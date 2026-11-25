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

/** "Nov 2026" from an ISO date, for freshness badges. */
export function monthYear(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
