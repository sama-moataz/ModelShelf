// Builders for JSON-LD and page-specific FAQ copy, shared by detail pages and hubs.
import { HARDWARE_TIERS, LAST_CHECKED, type Entry } from '../data/directoryData';
import { SITE_NAME, SITE_URL } from '../config/site';
import { categoryById, entryPath, formatSize } from './format';

export const abs = (path: string) => new URL(path, SITE_URL).href;

export function breadcrumbs(trail: [name: string, path: string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  };
}

export function itemList(name: string, list: Entry[]) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(entryPath(e)), name: e.name })),
  };
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/** Google wants a URL for `license`; fall back to a named CreativeWork pointing at the source. */
function licenseValue(e: Entry) {
  return e.licenseUrl ?? { '@type': 'CreativeWork', name: e.license, url: e.docsUrl };
}

/**
 * Datasets and data APIs are typed as Dataset so they are eligible for Google Dataset Search.
 * LLM APIs are WebAPI only: SoftwareApplication would make Search Console demand ratings we don't have.
 */
export function entrySchema(e: Entry) {
  const cat = categoryById(e.category);
  const url = abs(entryPath(e));
  const description = e.description.length >= 50 ? e.description : `${e.summary} ${e.description}`;
  const keywords = [...e.tags, cat.short, cat.name, `${HARDWARE_TIERS[e.hardware].label}`];
  const provider = { '@type': 'Organization', name: e.provider };
  const catalog = { '@type': 'DataCatalog', name: SITE_NAME, url: SITE_URL + '/' };
  const offers = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };

  if (e.kind === 'dataset') {
    return {
      '@type': 'Dataset',
      name: e.name,
      description,
      url,
      sameAs: e.url,
      keywords,
      isAccessibleForFree: true,
      license: licenseValue(e),
      creator: provider,
      dateModified: LAST_CHECKED,
      includedInDataCatalog: catalog,
      distribution: [{ '@type': 'DataDownload', encodingFormat: e.format, contentUrl: e.url }],
    };
  }

  const api = {
    name: e.name,
    description,
    url,
    sameAs: e.url,
    documentation: e.docsUrl,
    provider,
    offers,
    keywords,
    isAccessibleForFree: true,
    dateModified: LAST_CHECKED,
  };
  if (e.category === 'data-apis') {
    return {
      '@type': ['WebAPI', 'Dataset'],
      ...api,
      license: licenseValue(e),
      creator: provider,
      includedInDataCatalog: catalog,
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: e.url }],
    };
  }
  return { '@type': 'WebAPI', ...api, termsOfService: e.docsUrl };
}

const attribution = (license: string) =>
  /per-model/i.test(license)
    ? ' Each model also has its own license, so check the one you pick.'
    : /\bSA\b/.test(license)
    ? ' Keep the attribution and share any redistributed data under the same license.'
    : /\bBY\b/.test(license)
      ? ' Keep the attribution the license asks for.'
      : '';

/** Two page-specific questions; the same text feeds the visible FAQ and FAQPage JSON-LD. */
export function entryFaq(e: Entry): { q: string; a: string }[] {
  const sizeText = e.sizeMB === undefined ? '' : e.sizeMB < 1 ? 'under 1 MB' : `about ${formatSize(e.sizeMB).replace(/^~/, '')}`;
  const size = sizeText ? ` (${sizeText} to download)` : '';
  let hw: { q: string; a: string };
  if (e.kind === 'api') {
    hw = {
      q: `Can I use ${e.name} from a laptop or a free Google Colab notebook?`,
      a:
        e.access === 'local'
          ? `Yes, it runs on your own machine, so a laptop works for small quantized models and a free Colab T4 handles larger ones. ${e.baselineBenchmark}`
          : `Yes. The work happens on ${e.provider}'s servers, so any laptop or a free Colab notebook can call it${e.access === 'open' ? ' without a key' : ' with a free key'}. ${e.baselineBenchmark}`,
    };
  } else {
    const body = {
      'laptop-cpu': `Yes. ${e.name}${size} trains comfortably on a laptop CPU, so a GPU is optional. ${e.baselineBenchmark}`,
      'free-colab-t4': `A free Colab T4 is the sweet spot for ${e.name}${size}. A laptop CPU handles loading and small experiments, but use the T4 with fp16 for real training runs. ${e.baselineBenchmark}`,
      'needs-gpu-subset': `Not end to end. ${e.name}${size} outgrows a laptop and a single free Colab session, so start with a subset or a pretrained checkpoint. ${e.baselineBenchmark}`,
    }[e.hardware];
    hw = { q: `Can I train ${e.name} on a free Google Colab T4 GPU or a laptop CPU?`, a: body };
  }

  const commercial = e.badges.includes('commercial-ok')
    ? `Yes. ${e.name} is free to use and its terms (${e.license}) allow commercial use, so portfolio and paid projects are both fine.${attribution(e.license)}`
    : `It's free for learning, research and portfolio projects. Commercial use is not clearly allowed: the terms are "${e.license}". Check with ${e.provider} before using it in a paid product.`;

  return [hw, { q: `Is ${e.name} free for commercial or portfolio projects?`, a: commercial }];
}
