// Checks the production build in dist/: canonicals, titles, headings, JSON-LD, internal
// links, sitemap, robots.txt and llms files. Run after "npm run build":
//   npm run test:dist
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { loadModules, root } from './load.mjs';

const dist = join(root, 'dist');
assert.ok(existsSync(join(dist, 'index.html')), 'dist/ is missing: run "npm run build" first');
const SITE = 'https://modelshelf.vercel.app';
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

async function walk(dir) {
  const out = [];
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) out.push(...(await walk(p)));
    else if (d.name.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(d.name)) out.push(p);
  }
  return out;
}
const files = await walk(dist);
const pages = await Promise.all(
  files.map(async (file) => {
    const html = await readFile(file, 'utf8');
    const rel = relative(dist, file).replace(/\\/g, '/');
    const route = rel === '404.html' ? '/404' : `/${rel.replace(/index\.html$/, '')}`;
    return { file, rel, route, html };
  }),
);
const indexable = pages.filter((p) => !/<meta name="robots" content="[^"]*noindex/.test(p.html));
const attr = (html, re) => html.match(re)?.[1];
const [data, format] = await loadModules(['/src/data/directoryData.ts', '/src/utils/format.ts']);

/** The text a reader sees: no scripts, styles or tags, entities decoded, whitespace collapsed. */
const decode = (t) =>
  t.replace(/&(amp|lt|gt|quot|#39|#x27|#x2F);/g, (_, x) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'", '#x2F': '/' })[x]);
// Inline tags join their neighbours ("IMDB, MNIST"); block tags separate them with a space.
const visibleText = (html) =>
  decode(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, ' ')
      .replace(/<\/?(?:a|code|strong|em|span|time|abbr|b|i)\b[^>]*>/g, '')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
const squash = (t) => t.replace(/\s+/g, ' ').trim();
const jsonLdNodes = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(([, raw]) => {
    const d = JSON.parse(raw);
    return d['@graph'] ?? [d];
  });

test('every page has one H1, a title and a description', () => {
  for (const p of pages) {
    assert.equal((p.html.match(/<h1[\s>]/g) ?? []).length, 1, `${p.route}: expected exactly one <h1>`);
    assert.ok(attr(p.html, /<title>([^<]+)<\/title>/), `${p.route}: missing <title>`);
    const d = attr(p.html, /<meta name="description" content="([^"]*)"/);
    assert.ok(d && d.length >= 50 && d.length <= 200, `${p.route}: description length ${d?.length}`);
  }
});

test('titles and descriptions are unique across indexable pages', () => {
  const seen = new Map();
  for (const p of indexable) {
    for (const key of [attr(p.html, /<title>([^<]+)<\/title>/), attr(p.html, /<meta name="description" content="([^"]*)"/)]) {
      assert.ok(!seen.has(key), `${p.route} duplicates ${seen.get(key)}: ${key}`);
      seen.set(key, p.route);
    }
  }
});

test('canonical URLs match their own route; noindex pages have none', () => {
  for (const p of pages) {
    const canonical = attr(p.html, /<link rel="canonical" href="([^"]+)"/);
    if (indexable.includes(p)) assert.equal(canonical, `${SITE}${p.route}`, `${p.route}: canonical`);
    else assert.equal(canonical, undefined, `${p.route}: noindex page should not declare a canonical`);
  }
});

test('Open Graph and Twitter tags are present', () => {
  for (const p of indexable) {
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) assert.ok(p.html.includes(`property="${prop}"`), `${p.route}: missing ${prop}`);
    assert.equal(attr(p.html, /<meta property="og:url" content="([^"]+)"/), `${SITE}${p.route}`, `${p.route}: og:url`);
    assert.ok(p.html.includes('name="twitter:card"'), `${p.route}: missing twitter:card`);
  }
});

test('JSON-LD parses and uses schema.org types correctly', () => {
  for (const p of pages) {
    const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    if (indexable.includes(p)) assert.ok(blocks.length, `${p.route}: no structured data`);
    for (const [, raw] of blocks) {
      const data = JSON.parse(raw);
      assert.equal(data['@context'], 'https://schema.org', `${p.route}: @context`);
      for (const node of data['@graph'] ?? [data]) {
        assert.ok(node['@type'], `${p.route}: node without @type`);
        const types = [node['@type']].flat();
        if (types.includes('Dataset')) {
          assert.ok(node.name && node.description?.length >= 50 && node.description.length <= 5000, `${p.route}: Dataset needs name and a 50–5000 char description`);
          if (node.license && typeof node.license === 'string') assert.doesNotThrow(() => new URL(node.license));
        }
        if (types.includes('BreadcrumbList')) {
          node.itemListElement.forEach((li, i) => assert.equal(li.position, i + 1));
          assert.equal(node.itemListElement.at(-1).item, `${SITE}${p.route}`, `${p.route}: breadcrumb should end at the page`);
        }
        // Dataset markup belongs to dataset pages and data APIs only.
        if (types.includes('Dataset')) assert.match(p.route, /^\/resources\//, `${p.route}: Dataset markup outside a resource page`);
      }
    }
  }
});

test('internal links resolve to built pages or files', () => {
  const exists = (path) => {
    const clean = decodeURIComponent(path.split('#')[0].split('?')[0]);
    if (clean === '' ) return true;
    const target = join(dist, clean);
    return existsSync(target) && !clean.endsWith('/') ? true : existsSync(join(target, 'index.html'));
  };
  const broken = [];
  for (const p of pages) {
    for (const [, href] of p.html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      assert.ok(!/[?&]entry=/.test(href), `${p.route}: links to a ?entry= URL (${href})`);
      if (!exists(href)) broken.push(`${p.route} -> ${href}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('the sitemap lists exactly the indexable pages', async () => {
  const xml = await readFile(join(dist, 'sitemap-0.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(new Set(locs).size, locs.length, 'duplicate URL in sitemap');
  for (const l of locs) {
    assert.ok(l.startsWith(`${SITE}/`) && l.endsWith('/'), `sitemap URL should be a canonical slash URL: ${l}`);
    assert.ok(!/[?#]|index\.html/.test(l), `sitemap URL has a query, fragment or index.html: ${l}`);
  }
  assert.deepEqual(locs.sort(), indexable.map((p) => `${SITE}${p.route}`).sort());
  for (const r of vercel.redirects) assert.ok(!locs.includes(`${SITE}${r.source}`) && !locs.includes(`${SITE}${r.source}/`), `redirect source in sitemap: ${r.source}`);
});

test('robots.txt allows crawling and points to the sitemap', async () => {
  const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
  assert.match(robots, new RegExp(`^Sitemap: ${SITE}/sitemap-index\\.xml$`, 'm'));
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m, 'robots.txt blocks the whole site');
  for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot']) assert.ok(robots.includes(`User-agent: ${bot}`), `robots.txt has no group for ${bot}`);
});

test('llms.txt and llms-full.txt link every resource by its canonical URL', async () => {
  const llms = await readFile(join(dist, 'llms.txt'), 'utf8');
  const full = await readFile(join(dist, 'llms-full.txt'), 'utf8');
  const resourcePages = pages.filter((p) => p.route.startsWith('/resources/'));
  assert.ok(resourcePages.length >= 30);
  for (const p of resourcePages) {
    assert.ok(llms.includes(`(${SITE}${p.route})`), `llms.txt is missing ${p.route}`);
    assert.ok(full.includes(`- Page: ${SITE}${p.route}`), `llms-full.txt is missing ${p.route}`);
  }
  for (const m of llms.matchAll(/\]\((https:\/\/modelshelf\.vercel\.app[^)]*)\)/g)) {
    const path = new URL(m[1]).pathname;
    assert.ok(indexable.some((p) => p.route === path) || /\.(txt|xml)$/.test(path), `llms.txt links to a non-page: ${m[1]}`);
  }
});

test('the favicon set and manifest are referenced on every page', () => {
  for (const p of pages) {
    for (const href of ['/favicon.ico', '/favicon.svg', '/favicon-96x96.png', '/apple-touch-icon.png', '/site.webmanifest']) {
      assert.ok(p.html.includes(`href="${href}"`), `${p.route}: missing ${href}`);
      assert.ok(existsSync(join(dist, href)), `dist is missing ${href}`);
    }
  }
});

test('resource pages show the same facts as the data', () => {
  for (const e of data.entries) {
    const page = pages.find((p) => p.route === `/resources/${e.slug}/`);
    assert.ok(page, `no page for ${e.slug}`);
    const text = visibleText(page.html);
    const expected = [
      e.name, e.summary, e.license, e.task, e.samples,
      format.authLabel(e), data.PRICING[e.pricing].label, data.HARDWARE_TIERS[e.hardware].label,
      ...(e.sizeMB !== undefined ? [format.sizeLabel(e)] : []),
      ...(e.rateLimit ? [e.rateLimit] : []),
      format.longDate(e.verification.checked),
    ];
    for (const fact of expected) assert.ok(text.includes(squash(fact)), `${e.slug}: page does not show "${fact}"`);
  }
});

test('FAQ structured data repeats the visible questions and answers word for word', () => {
  for (const p of indexable) {
    const text = visibleText(p.html);
    for (const node of jsonLdNodes(p.html).filter((n) => n['@type'] === 'FAQPage')) {
      for (const q of node.mainEntity) {
        assert.ok(text.includes(squash(q.name)), `${p.route}: FAQ question not visible: ${q.name}`);
        assert.ok(text.includes(squash(q.acceptedAnswer.text)), `${p.route}: FAQ answer not visible: ${q.acceptedAnswer.text.slice(0, 80)}…`);
      }
    }
  }
});

test('visible breadcrumbs match the BreadcrumbList', () => {
  for (const p of indexable.filter((x) => x.route !== '/')) {
    const nav = p.html.match(/<nav aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, `${p.route}: no visible breadcrumb`);
    const visible = [...nav.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => visibleText(m[1]).replace(/\s*\/$/, ''));
    const list = jsonLdNodes(p.html).find((n) => n['@type'] === 'BreadcrumbList');
    assert.deepEqual(visible, list.itemListElement.map((li) => li.name), `${p.route}: breadcrumb text differs from JSON-LD`);
  }
});

test('structured data never calls a paid resource free', () => {
  for (const e of data.entries) {
    const page = pages.find((p) => p.route === `/resources/${e.slug}/`);
    const node = jsonLdNodes(page.html).find((n) => n['@id']?.endsWith(e.kind === 'api' ? '#api' : '#dataset'));
    assert.ok(node, `${e.slug}: no Dataset/WebAPI node`);
    const free = e.pricing !== 'pay-as-you-go';
    assert.equal(node.isAccessibleForFree, free, `${e.slug}: isAccessibleForFree`);
    if (!free) assert.equal(node.offers, undefined, `${e.slug}: a paid resource must not carry a $0 offer`);
  }
});
