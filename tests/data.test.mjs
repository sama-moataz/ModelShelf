// Integrity checks on the directory data, landing pages and guides. No build needed.
//   npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { loadModules, root } from './load.mjs';

const [data, landingsMod, hubsMod, guideIndexMod, guidesMod, llmsMod] = await loadModules([
  '/src/data/directoryData.ts',
  '/src/data/landings.ts',
  '/src/data/hubs.ts',
  '/src/data/guideIndex.ts',
  '/src/data/guides.ts',
  '/src/utils/llms.ts',
]);
const { entries, BADGES, CATEGORIES, PRICING, HARDWARE_TIERS, LAST_CHECKED } = data;
const { CATEGORY_GUIDES, COMBO_IDEAS } = guidesMod;
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

// ---------------------------------------------------------------- consistency checks
// These guard the facts that appear on more than one page, so a change in directoryData.ts
// cannot leave a card, hub, landing page, combo or llms file saying something different.

test('required text fields are filled in', () => {
  const text = ['name', 'seoTitle', 'task', 'summary', 'description', 'provider', 'license', 'format', 'samples', 'timeToBaseline', 'baselineBenchmark'];
  for (const e of entries) {
    for (const k of text) assert.ok(typeof e[k] === 'string' && e[k].trim().length > 0, `${e.slug}: missing ${k}`);
    assert.ok(e.useCases.length >= 1 && e.gotchas.length >= 1 && e.tags.length >= 1, `${e.slug}: needs use cases, gotchas and tags`);
    assert.ok(e.snippet?.code?.trim() && e.snippet.title, `${e.slug}: needs a starter snippet`);
    if (e.kind === 'api') assert.ok(e.rateLimit, `${e.slug}: APIs must state their limits (rateLimit)`);
    if (e.sizeNote) assert.equal(typeof e.sizeMB, 'number', `${e.slug}: sizeNote without sizeMB`);
  }
});

// Primary sources that only answer over plain HTTP (checked 2026-11-27: the TLS handshake fails).
const HTTP_ONLY_HOSTS = new Set(['groups.di.unipi.it']);

test('source, documentation and license links are https and distinct per entry', () => {
  for (const e of entries) {
    const links = [e.url, e.docsUrl, e.licenseUrl, e.baselineSource?.url, ...e.verification.sources.map((s) => s.url)].filter(Boolean);
    for (const u of links) {
      const { protocol, host } = new URL(u);
      assert.ok(protocol === 'https:' || (protocol === 'http:' && HTTP_ONLY_HOSTS.has(host)), `${e.slug}: ${u} is not https`);
    }
    const sources = e.verification.sources.map((s) => s.url);
    assert.equal(new Set(sources).size, sources.length, `${e.slug}: a verification source is listed twice`);
  }
});

test('derived badges always agree with access, pricing and hardware', () => {
  const order = Object.keys(BADGES);
  for (const e of entries) {
    const has = (b) => e.badges.includes(b);
    assert.equal(has('no-signup'), e.access === 'open' || e.access === 'local', `${e.slug}: no-signup vs access ${e.access}`);
    assert.equal(has('no-card'), e.pricing !== 'pay-as-you-go', `${e.slug}: no-card vs pricing ${e.pricing}`);
    assert.equal(has('laptop-friendly'), e.hardware === 'laptop-cpu', `${e.slug}: laptop-friendly vs hardware ${e.hardware}`);
    assert.deepEqual(e.badges, [...new Set(e.badges)].sort((a, b) => order.indexOf(a) - order.indexOf(b)), `${e.slug}: badges must be unique and in BADGES order`);
  }
});

test('pricing, access and kind never contradict each other', () => {
  for (const e of entries) {
    if (e.kind === 'dataset') assert.equal(e.access, 'open', `${e.slug}: datasets in the directory download without sign-up`);
    assert.equal(e.access === 'local', e.pricing === 'local', `${e.slug}: local access and local pricing go together`);
    if (e.pricing === 'pay-as-you-go') assert.ok(e.kind === 'api' && e.access !== 'open', `${e.slug}: paid access needs an account or key`);
    if (e.pricing === 'free-tier') assert.equal(e.kind, 'api', `${e.slug}: only APIs have a free tier`);
    if (e.quotas?.length) assert.equal(e.pricing, 'free-tier', `${e.slug}: estimator quotas are free-tier allowances`);
  }
});

test('a paid entry is never described as free, and a free one never as needing a card', () => {
  const freeClaim = /\b(?:free (?:tier|to use|to call|of charge)|no (?:credit )?card|completely free|no cost)\b/i;
  const cardClaim = /\b(?:credit card|payment method) (?:is )?required\b/i;
  for (const e of entries) {
    // Gotchas may mention a related free product (Hugging Face's free datasets), so only the
    // copy that describes the entry itself is checked.
    const copy = [e.summary, e.description, e.rateLimit ?? ''].join(' ');
    if (e.pricing === 'pay-as-you-go') assert.doesNotMatch(copy, freeClaim, `${e.slug}: paid entry described as free`);
    else assert.doesNotMatch(copy, cardClaim, `${e.slug}: free entry described as needing a card`);
  }
});

test('license wording, license URL and the commercial-use badge agree', () => {
  const restrictive = /^No license specified|non-commercial|research (?:use |purposes )?only|\bNC\b|^Varies/i;
  for (const e of entries) {
    if (e.badges.includes('commercial-ok')) assert.doesNotMatch(e.license, restrictive, `${e.slug}: commercial-ok with restrictive terms "${e.license}"`);
    const u = e.licenseUrl ?? '';
    if (/\/by-sa\//.test(u)) assert.match(e.license, /BY-SA/, `${e.slug}: license URL is BY-SA`);
    if (/\/by-nc\//.test(u)) assert.match(e.license, /BY-NC/, `${e.slug}: license URL is BY-NC`);
    if (/\/licenses\/by\//.test(u)) assert.match(e.license, /CC BY \d/, `${e.slug}: license URL is CC BY`);
    if (/publicdomain\/zero/.test(u)) assert.match(e.license, /CC0/, `${e.slug}: license URL is CC0`);
    if (/spdx\.org\/licenses\/MIT/.test(u)) assert.match(e.license, /\bMIT\b/, `${e.slug}: license URL is MIT`);
    if (/non-commercial|\bNC\b/i.test(e.license)) assert.ok(!e.badges.includes('commercial-ok'), `${e.slug}: non-commercial license`);
  }
});

test('hubs and categories use the shared labels and point at real data', () => {
  const cats = new Set(CATEGORIES.map((c) => c.id));
  for (const id of Object.keys(CATEGORY_GUIDES)) assert.ok(cats.has(id), `CATEGORY_GUIDES has unknown category ${id}`);
  for (const c of CATEGORIES) {
    assert.ok(entries.some((e) => e.category === c.id), `${c.id}: empty category`);
    const starter = entries.find((e) => e.slug === CATEGORY_GUIDES[c.id].firstProject.slug);
    assert.equal(starter?.category, c.id, `${c.id}: first project must be in the category`);
  }
  for (const h of hubsMod.HARDWARE_HUBS) assert.equal(h.label, HARDWARE_TIERS[h.tier].short, `${h.slug}: hub label differs from the tier label`);
  const byBadge = { 'no-signup': 'no-signup', 'open-commercial': 'commercial-ok' };
  for (const h of hubsMod.ACCESS_HUBS) if (byBadge[h.slug]) assert.equal(h.label, BADGES[byBadge[h.slug]].label, `${h.slug}: hub label differs from the badge`);
  // A category whose name promises "free" must not contain a paid entry.
  for (const c of CATEGORIES) {
    if (/\bfree\b/i.test(c.name)) assert.ok(!entries.some((e) => e.category === c.id && e.pricing === 'pay-as-you-go'), `${c.id}: "${c.name}" lists a paid entry`);
  }
});

test('combo ideas pair a real dataset with a real API and quote their facts', () => {
  for (const c of COMBO_IDEAS) {
    const d = entries.find((e) => e.slug === c.dataset);
    const a = entries.find((e) => e.slug === c.api);
    assert.equal(d?.kind, 'dataset', `${c.id}: ${c.dataset} is not a dataset`);
    assert.equal(a?.kind, 'api', `${c.id}: ${c.api} is not an API`);
    assert.ok(c.hardware.toLowerCase().includes(HARDWARE_TIERS[d.hardware].short.toLowerCase()), `${c.id}: hardware note should name the dataset's tier (${HARDWARE_TIERS[d.hardware].short})`);
    if (!d.badges.includes('commercial-ok') || !a.badges.includes('commercial-ok')) {
      assert.match(c.license, /non-commercial|course|portfolio|no stated license/i, `${c.id}: one side is not cleared for commercial use, so the license note must say so`);
    }
    for (const [pct] of c.how.matchAll(/\d+(?:\.\d+)?%/g)) assert.ok(d.baselineBenchmark.includes(pct), `${c.id}: quotes ${pct}, which is not in ${d.slug}'s baseline`);
  }
});

test('hand-written copy quotes sizes and counts that match the data', () => {
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  const copy = [
    ...Object.values(CATEGORY_GUIDES).flatMap((g) => [g.whenToChoose.answer, ...g.whenToChoose.picks, g.firstProject.answer, ...g.firstProject.steps]),
    ...LANDINGS.flatMap((l) => [l.answer, ...l.considerations, ...l.ideas, ...l.groups.flatMap((g) => g.picks.map((p) => `[[${p.slug}]] ${p.why}`))]),
    ...COMBO_IDEAS.flatMap((c) => [c.how, c.build]),
  ];
  const num = (t) => Number(t.replace(/,/g, ''));
  for (const text of copy) {
    // A size or a count in the same clause as an entry link must be that entry's figure.
    for (const m of text.matchAll(/\[\[([a-z0-9-]+)\]\]([^.;\[]*?)~?(\d[\d.,]*)\s?(MB|GB)\b/g)) {
      const e = bySlug.get(m[1]);
      const mb = num(m[3]) * (m[4] === 'GB' ? 1000 : 1);
      assert.ok(e?.sizeMB !== undefined && Math.abs(mb - e.sizeMB) / e.sizeMB <= 0.1, `copy says ${m[3]} ${m[4]} for ${m[1]}, data says ${e?.sizeMB} MB: "${text.slice(0, 80)}…"`);
    }
    for (const m of text.matchAll(/\[\[([a-z0-9-]+)\]\][^.;\[]*?(\d{1,3}(?:,\d{3})+) (?:reviews|articles|images|rows|clips|recordings|questions|passengers|utterances)\b/g)) {
      const e = bySlug.get(m[1]);
      assert.ok(e.samples.includes(m[2]), `copy says ${m[2]} for ${m[1]}, data says "${e.samples}"`);
    }
  }
});

test('the committed llms files match what the data generates', async () => {
  assert.equal(await readFile(`${root}public/llms.txt`, 'utf8'), llmsMod.llmsTxt(), 'public/llms.txt is stale: run npm run llms');
  assert.equal(await readFile(`${root}public/llms-full.txt`, 'utf8'), llmsMod.llmsFullTxt(), 'public/llms-full.txt is stale: run npm run llms');
});
