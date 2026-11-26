// Integrity checks on the directory data, landing pages and guides. No build needed.
//   npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { loadModules, root } from './load.mjs';

const [data, landingsMod, hubsMod, guideIndexMod] = await loadModules([
  '/src/data/directoryData.ts',
  '/src/data/landings.ts',
  '/src/data/hubs.ts',
  '/src/data/guideIndex.ts',
]);
const { entries, BADGES, CATEGORIES, PRICING, LAST_CHECKED } = data;
const { LANDINGS, landingPicks } = landingsMod;
const vercel = JSON.parse(await readFile(`${root}vercel.json`, 'utf8'));
const iso = /^\d{4}-\d{2}-\d{2}$/;

test('slugs and titles are unique and well formed', () => {
  const slugs = entries.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate slug');
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad slug ${s}`);
  const titles = entries.map((e) => e.seoTitle);
  assert.equal(new Set(titles).size, titles.length, 'duplicate seoTitle');
  for (const e of entries) {
    // The full <title> adds " | ModelShelf"; keep it near Google's ~60-character display width.
    assert.ok(`${e.seoTitle} | ModelShelf`.length <= 65, `${e.slug}: title too long (${e.seoTitle})`);
  }
});

test('every entry has the fields its page renders', () => {
  const cats = new Set(CATEGORIES.map((c) => c.id));
  for (const e of entries) {
    assert.ok(cats.has(e.category), `${e.slug}: unknown category`);
    assert.ok(e.pricing in PRICING, `${e.slug}: unknown pricing`);
    for (const b of e.badges) assert.ok(b in BADGES, `${e.slug}: unknown badge ${b}`);
    for (const u of [e.url, e.docsUrl, e.licenseUrl].filter(Boolean)) assert.doesNotThrow(() => new URL(u), `${e.slug}: bad URL ${u}`);
    assert.ok(e.summary.length > 20 && e.description.length >= 50, `${e.slug}: summary/description too short`);
    assert.ok(e.preprocessingTips.length >= 2, `${e.slug}: needs at least two preprocessing tips`);
    if (e.kind === 'dataset') {
      assert.equal(typeof e.sizeMB, 'number', `${e.slug}: datasets need sizeMB`);
      assert.equal(e.pricing, 'free-download', `${e.slug}: datasets are free downloads`);
    }
    for (const q of e.quotas ?? []) assert.ok(Number.isInteger(q.perDay) && q.perDay > 0, `${e.slug}: quota perDay must be a positive integer`);
  }
});

test('every entry records a primary-source verification', () => {
  for (const e of entries) {
    const v = e.verification;
    assert.ok(v, `${e.slug}: missing verification`);
    assert.match(v.checked, iso, `${e.slug}: verification.checked must be an ISO date`);
    assert.ok(v.checked <= LAST_CHECKED, `${e.slug}: checked after LAST_CHECKED`);
    assert.ok(v.sources.length >= 1, `${e.slug}: needs at least one primary source`);
    for (const s of v.sources) assert.doesNotThrow(() => new URL(s.url), `${e.slug}: bad source URL`);
    if (v.status === 'partial') assert.ok(v.open?.length, `${e.slug}: partly verified entries must say what is open`);
    else assert.equal(v.status, 'verified', `${e.slug}: unknown status`);
    if (e.baselineSource) assert.doesNotThrow(() => new URL(e.baselineSource.url));
  }
});

test('badges never contradict the license or the cost', () => {
  for (const e of entries) {
    if (e.badges.includes('commercial-ok')) {
      assert.doesNotMatch(e.license, /^No license specified|non-commercial|research use only/i, `${e.slug}: commercial-ok with a restrictive license`);
    }
    if (e.pricing === 'pay-as-you-go') {
      assert.ok(!e.badges.includes('no-card') && !e.badges.includes('no-signup'), `${e.slug}: paid entries cannot claim no-card or no-signup`);
    }
    if (e.badges.includes('no-signup')) assert.ok(e.access === 'open' || e.access === 'local', `${e.slug}: no-signup needs open or local access`);
    if (/No license specified/.test(e.license)) assert.equal(e.licenseUrl, undefined, `${e.slug}: no license, so no license URL`);
  }
});

test('landing pages pick real entries that keep the page’s promise', () => {
  const slugs = new Set(entries.map((e) => e.slug));
  const pageSlugs = new Set();
  for (const l of LANDINGS) {
    assert.ok(!pageSlugs.has(l.slug), `duplicate landing ${l.slug}`);
    pageSlugs.add(l.slug);
    const picks = landingPicks(l);
    assert.ok(picks.length >= 4, `${l.slug}: too few picks to be useful`);
    assert.equal(new Set(picks.map((e) => e.slug)).size, picks.length, `${l.slug}: an entry is listed twice`);
    for (const e of picks) assert.ok(l.rule.test(e), `${l.slug}: ${e.slug} breaks the rule "${l.rule.text}"`);
    for (const g of l.groups) for (const p of g.picks) assert.ok(slugs.has(p.slug));
    assert.ok(l.metaDescription.length >= 70 && l.metaDescription.length <= 170, `${l.slug}: meta description length ${l.metaDescription.length}`);
    // A landing URL must not also be a redirect source.
    assert.ok(!vercel.redirects.some((r) => r.source.replace(/\/$/, '') === `/${l.slug}`), `${l.slug}: is also redirected`);
  }
});

test('guides only reference entries that exist', async () => {
  const slugs = new Set(entries.map((e) => e.slug));
  const files = (await readdir(`${root}src/content/guides`)).filter((f) => f.endsWith('.md'));
  assert.equal(guideIndexMod.GUIDE_INDEX.length, files.length);
  for (const f of files) {
    const src = await readFile(`${root}src/content/guides/${f}`, 'utf8');
    const list = src.match(/^resources:\s*\[(.*)\]$/m)?.[1] ?? '';
    for (const s of list.split(',').map((x) => x.trim().replace(/'/g, '')).filter(Boolean)) assert.ok(slugs.has(s), `${f}: unknown resource ${s}`);
    for (const m of src.matchAll(/\]\(\/resources\/([a-z0-9-]+)\/\)/g)) assert.ok(slugs.has(m[1]), `${f}: links to unknown resource ${m[1]}`);
    // Every "Checked fact" must carry a link to its source.
    for (const block of src.split('\n').filter((l) => l.startsWith('> **Checked fact'))) assert.match(block, /\]\(https?:\/\/|\]\(\//, `${f}: checked fact without a source link`);
  }
});

test('redirects are permanent and point at real routes', () => {
  for (const r of vercel.redirects) {
    assert.equal(r.statusCode, 301, `${r.source} should be a 301`);
    assert.ok(r.destination.endsWith('/') || r.destination.includes(':'), `${r.source} -> ${r.destination} should end in a slash`);
  }
  const hubPaths = new Set([
    ...CATEGORIES.map((c) => `/categories/${c.id}/`),
    ...hubsMod.HARDWARE_HUBS.map((h) => `/hardware/${h.slug}/`),
    ...hubsMod.ACCESS_HUBS.map((h) => `/access/${h.slug}/`),
    '/estimator/',
    '/',
  ]);
  for (const r of vercel.redirects.filter((x) => !x.destination.includes(':'))) assert.ok(hubPaths.has(r.destination), `${r.source} -> unknown ${r.destination}`);
});
