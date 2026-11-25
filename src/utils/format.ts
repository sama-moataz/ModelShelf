import { BADGES, CATEGORIES, entries, type Access, type CategoryId, type Entry } from '../data/directoryData';

export const accessLabel: Record<Access, string> = {
  open: 'Open, no key',
  'free-key': 'Free API key',
  account: 'Free account',
  local: 'Runs locally',
};

export function formatSize(mb?: number): string {
  if (mb === undefined) return '';
  if (mb < 1) return '< 1 MB';
  if (mb >= 1000) return `~${(mb / 1000).toFixed(mb >= 10000 ? 0 : 1).replace(/\.0$/, '')} GB`;
  return `~${mb} MB`;
}

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
export const entriesIn = (id: CategoryId) => entries.filter((e) => e.category === id);
export const entryPath = (e: Pick<Entry, 'slug'>) => `/resources/${e.slug}/`;
export const badgeList = (e: Entry) => e.badges.map((b) => BADGES[b]);

/** Same-category neighbours, used for "related" links on detail pages. */
export function related(e: Entry, n = 3): Entry[] {
  return entries.filter((x) => x.category === e.category && x.slug !== e.slug).slice(0, n);
}

/** Lower-case the first letter for use mid-sentence, leaving acronyms like "LLM" alone. */
export const lowerFirst = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

/** "Nov 2026" (or "November 2026") from an ISO date, for freshness badges. */
export function monthYear(iso: string, month: 'short' | 'long' = 'short'): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleString('en-US', { month, year: 'numeric', timeZone: 'UTC' });
}

/** "November 25, 2026" from an ISO date. */
export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleString('en-US', { dateStyle: 'long', timeZone: 'UTC' });
}

/** What a reader has to sign up for, spelled out so it can be quoted on its own. */
export function authLabel(e: Entry): string {
  const card = e.badges.includes('no-card') ? ', no credit card' : '';
  return {
    open: 'None: no account or API key',
    local: 'None: runs on your own machine',
    'free-key': `Free API key required${card}`,
    account: `Free account required${card}`,
  }[e.access];
}

// Copy in data files uses `code`, [[slug]] (a link to that entry, shown by name) and
// [label](/path/) for other pages on this site.
const siteLink = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const bySlug = (slug: string) => {
  const e = entries.find((x) => x.slug === slug);
  if (!e) throw new Error(`Unknown entry slug in copy: ${slug}`);
  return e;
};
const escapeHtml = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function richText(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-800">$1</code>')
    .replace(/\[\[([a-z0-9-]+)\]\]/g, (_, slug) => `<a class="font-medium text-brand-700 underline-offset-2 hover:underline" href="${entryPath(bySlug(slug))}">${escapeHtml(bySlug(slug).name)}</a>`)
    .replace(siteLink, '<a class="font-medium text-brand-700 underline-offset-2 hover:underline" href="$2">$1</a>');
}

/** The same copy as plain text, for JSON-LD that has to match the visible wording. */
export function plainText(text: string): string {
  return text.replace(/`([^`]+)`/g, '$1').replace(/\[\[([a-z0-9-]+)\]\]/g, (_, slug) => bySlug(slug).name).replace(siteLink, '$1');
}

/** The same copy as Markdown with absolute links, for llms.txt. */
export function markdownText(text: string, site: string): string {
  return text
    .replace(/\[\[([a-z0-9-]+)\]\]/g, (_, slug) => `[${bySlug(slug).name}](${new URL(entryPath(bySlug(slug)), site).href})`)
    .replace(siteLink, (_, label, path) => `[${label}](${new URL(path, site).href})`);
}
