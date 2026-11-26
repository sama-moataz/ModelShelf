// Reports external links (entry sources, docs, licenses, verification sources, guide sources)
// that no longer answer. A reachable URL is NOT verification: it only tells a maintainer
// which entries to re-read first.
//   node scripts/check-links.mjs        exit 1 if any link is broken
import { readFile, readdir } from 'node:fs/promises';
import { loadModules, root } from '../tests/load.mjs';

const [{ entries }] = await loadModules(['/src/data/directoryData.ts']);
const urls = new Map(); // url -> where it is used
const add = (url, where) => url && /^https?:/.test(url) && urls.set(url, [...(urls.get(url) ?? []), where]);
for (const e of entries) {
  add(e.url, `${e.slug}: url`);
  add(e.docsUrl, `${e.slug}: docsUrl`);
  add(e.licenseUrl, `${e.slug}: licenseUrl`);
  add(e.baselineSource?.url, `${e.slug}: baselineSource`);
  for (const s of e.verification.sources) add(s.url, `${e.slug}: verification`);
}
for (const f of (await readdir(`${root}src/content/guides`)).filter((x) => x.endsWith('.md'))) {
  const src = await readFile(`${root}src/content/guides/${f}`, 'utf8');
  for (const m of src.matchAll(/url: '([^']+)'|\]\((https?:\/\/[^)\s]+)\)/g)) add(m[1] ?? m[2], `guide ${f}`);
}

// Large downloads are checked with HEAD only; some hosts reject HEAD, so fall back to a GET.
async function probe(url) {
  const opts = { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'ModelShelf-link-check/1.0 (+https://github.com/sama-moataz/ModelShelf)' } };
  try {
    let r = await fetch(url, { ...opts, method: 'HEAD' });
    if (r.status >= 400 && !/\.(zip|gz|bz2|tar)$/.test(new URL(url).pathname)) r = await fetch(url, { ...opts, method: 'GET' });
    return r.status;
  } catch (err) {
    return `error: ${err.cause?.code ?? err.name}`;
  }
}

const list = [...urls.keys()];
const results = [];
for (let i = 0; i < list.length; i += 6) {
  results.push(...(await Promise.all(list.slice(i, i + 6).map(async (u) => [u, await probe(u)]))));
}
// 401/403/429 usually mean "bot blocked" or "login wall", not a dead page: report them separately.
const broken = results.filter(([, s]) => typeof s !== 'number' || (s >= 400 && ![401, 403, 429].includes(s)));
const blocked = results.filter(([, s]) => [401, 403, 429].includes(s));
console.log(`Checked ${results.length} external URLs: ${results.length - broken.length - blocked.length} OK, ${blocked.length} blocked bots or need login, ${broken.length} broken.`);
for (const [u, s] of blocked) console.log(`  blocked ${s}  ${u}  (${urls.get(u).join(', ')})`);
for (const [u, s] of broken) console.log(`  BROKEN  ${s}  ${u}  (${urls.get(u).join(', ')})`);
if (broken.length) process.exit(1);
