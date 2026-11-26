// Builders for JSON-LD and page-specific FAQ copy, shared by detail pages and hubs.
import { HARDWARE_TIERS, LAST_CHECKED, entries, type Entry } from '../data/directoryData';
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../config/site';
import { categoryById, entryPath, formatSize, lowerFirst, sizeWords } from './format';

export const abs = (path: string) => new URL(path, SITE_URL).href;

// Stable @ids so every page's JSON-LD points at the same ModelShelf entities.
export const ORG_ID = abs('/#organization');
export const WEBSITE_ID = abs('/#website');
export const CATALOG_ID = abs('/#catalog');

/** Organization, WebSite and DataCatalog nodes for the homepage. */
export function siteGraph() {
  const datasetCount = entries.filter((e) => e.kind === 'dataset').length;
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: abs('/'),
      logo: { '@type': 'ImageObject', url: abs('/logo.png'), width: 512, height: 512 },
      description: SITE_DESCRIPTION,
      sameAs: [REPO_URL],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      // Google reads the site name for the SERP from this node; the favicon carries the same mark.
      alternateName: 'Model Shelf',
      url: abs('/'),
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': ORG_ID },
      dateModified: LAST_CHECKED,
      // The directory reads ?q= on load, so this template is a working search URL.
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${abs('/')}?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
    },
    {
      '@type': 'DataCatalog',
      '@id': CATALOG_ID,
      name: SITE_NAME,
      url: abs('/'),
      description: `A curated catalog of ${datasetCount} open datasets and ${entries.length - datasetCount} free APIs for student and indie AI/ML projects.`,
      publisher: { '@id': ORG_ID },
      isAccessibleForFree: true,
      dateModified: LAST_CHECKED,
    },
  ];
}

/**
 * One self-contained sentence of the facts an answer engine is most likely to quote.
 * Rendered above the key-facts list and reused in llms-full.txt.
 */
export function entryFactSentence(e: Entry): string {
  const what = {
    nlp: 'NLP dataset', vision: 'computer vision dataset', tabular: 'tabular dataset', audio: 'audio dataset',
    'llm-apis': 'LLM API', 'data-apis': 'data API',
  }[e.category];
  const parts: string[] = [];
  if (e.kind === 'dataset') parts.push(e.samples);
  if (e.sizeMB !== undefined) parts.push(`${sizeWords(e.sizeMB)} to download`);
  const card = e.badges.includes('no-card') ? ' (no credit card)' : '';
  const paid = e.pricing === 'pay-as-you-go';
  parts.push(paid ? 'an account with purchased credits' : { open: 'no sign-up or API key', local: 'no sign-up', 'free-key': `free API key${card}`, account: `free account${card}` }[e.access]);
  parts.push(e.kind === 'api' && e.access !== 'local' ? 'callable from any laptop' : `hardware fit: ${HARDWARE_TIERS[e.hardware].label}`);
  return `${e.name} is ${paid ? 'a pay-as-you-go' : 'a free'} ${what} from ${e.provider} for ${lowerFirst(e.task)}: ${parts.join(', ')}. License: ${e.license}.`;
}

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

/**
 * Google wants a URL for `license`; fall back to a named CreativeWork pointing at the source.
 * When the source states no license, say nothing rather than mark up "No license specified" as one.
 */
function licenseValue(e: Entry) {
  if (/^No license specified/.test(e.license)) return undefined;
  return e.licenseUrl ?? { '@type': 'CreativeWork', name: e.license, url: e.docsUrl };
}

/**
 * Datasets and data APIs are typed as Dataset so they are eligible for Google Dataset Search.
 * Hosted LLM APIs are WebAPI only. Ollama is software you install, so it is a SoftwareApplication;
 * Search Console may note it has no ratings, which only affects rich-result eligibility.
 */
export function entrySchema(e: Entry) {
  const cat = categoryById(e.category);
  const url = abs(entryPath(e));
  const description = e.description.length >= 50 ? e.description : `${e.summary} ${e.description}`;
  const keywords = [...e.tags, cat.short, cat.name, `${HARDWARE_TIERS[e.hardware].label}`];
  const provider = { '@type': 'Organization', name: e.provider };
  const catalog = { '@type': 'DataCatalog', '@id': CATALOG_ID, name: SITE_NAME, url: abs('/') };
  const free = e.pricing !== 'pay-as-you-go';
  const offers = free ? { '@type': 'Offer', price: '0', priceCurrency: 'USD' } : undefined;
  const license = licenseValue(e);

  if (e.kind === 'dataset') {
    return {
      '@type': 'Dataset',
      '@id': `${url}#dataset`,
      name: e.name,
      description,
      url,
      sameAs: e.url,
      keywords,
      isAccessibleForFree: true,
      ...(license && { license }),
      creator: provider,
      includedInDataCatalog: catalog,
      distribution: [{ '@type': 'DataDownload', encodingFormat: e.format, contentUrl: e.url, ...(e.sizeMB !== undefined && { contentSize: formatSize(e.sizeMB).replace(/^~/, '') }) }],
    };
  }

  const api = {
    '@id': `${url}#api`,
    name: e.name,
    description,
    url,
    sameAs: e.url,
    documentation: e.docsUrl,
    provider,
    ...(offers && { offers }),
    keywords,
    isAccessibleForFree: free,
  };
  if (e.access === 'local') {
    return {
      '@type': 'SoftwareApplication',
      ...api,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Windows, Linux',
      ...(license && { license }),
    };
  }
  if (e.category === 'data-apis') {
    return {
      '@type': ['WebAPI', 'Dataset'],
      ...api,
      ...(license && { license }),
      creator: provider,
      includedInDataCatalog: catalog,
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: e.url }],
    };
  }
  return { '@type': 'WebAPI', ...api };
}

/**
 * The page about an entry. Our verification date lives here (dateModified, lastReviewed):
 * on the Dataset or WebAPI node it would wrongly claim the provider changed their data that day.
 */
export function entryPage(e: Entry, name: string, description: string) {
  const url = abs(entryPath(e));
  return {
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': `${url}#${e.kind === 'api' ? 'api' : 'dataset'}` },
    dateModified: e.verification.checked,
    lastReviewed: e.verification.checked,
  };
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
          : `Yes. The work happens on ${e.provider}'s servers, so any laptop or a free Colab notebook can call it${e.access === 'open' ? ' without a key' : e.pricing === 'pay-as-you-go' ? ' with a token and purchased credits' : ' with a free key'}. ${e.baselineBenchmark}`,
    };
  } else {
    const body = {
      'laptop-cpu': `Yes. ${e.name}${size} trains comfortably on a laptop CPU, so a GPU is optional. ${e.baselineBenchmark}`,
      'free-colab-t4': `A free Colab T4 is the sweet spot for ${e.name}${size}. A laptop CPU handles loading and small experiments, but use the T4 with fp16 for real training runs. ${e.baselineBenchmark}`,
      'needs-gpu-subset': `Not end to end. ${e.name}${size} outgrows a laptop and a single free Colab session, so start with a subset or a pretrained checkpoint. ${e.baselineBenchmark}`,
    }[e.hardware];
    hw = { q: `Can I train ${e.name} on a free Google Colab T4 GPU or a laptop CPU?`, a: body };
  }

  const commercial = e.pricing === 'pay-as-you-go'
    ? `It is not free: ${e.name} is pay-as-you-go, and free accounts must buy credits. The terms are "${e.license}", so check the license of the model you call before using it in a paid product.`
    : e.badges.includes('commercial-ok')
    ? `Yes. ${e.name} is free to use and its terms (${e.license}) allow commercial use, so portfolio and paid projects are both fine.${attribution(e.license)}`
    : `It's free for learning, research and portfolio projects. Commercial use is not clearly allowed: the terms are "${e.license}". Check with ${e.provider} before using it in a paid product.`;

  return [hw, { q: `Is ${e.name} free for commercial or portfolio projects?`, a: commercial }];
}
