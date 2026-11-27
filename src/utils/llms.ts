// Plain-Markdown summaries for LLMs and answer engines (https://llmstxt.org), built from
// the same data as the pages so counts, links and facts never drift.
import { BADGES, CATEGORIES, HARDWARE_TIERS, LAST_CHECKED, PRICING, entries, type Entry } from '../data/directoryData';
import { LANDINGS, landingPicks } from '../data/landings';
import { GUIDE_INDEX } from '../data/guideIndex';
import { COMBO_IDEAS, CATEGORY_GUIDES, comboAnswer, comboEntries, combosFor, directoryAtAGlance, homeQuickAnswers, type ComboIdea } from '../data/guides';
import { ACCESS_HUBS, HARDWARE_HUBS, hubEntries } from '../data/hubs';
import { REPO_URL, SITE_NAME, SITE_URL } from '../config/site';
import { authLabel, entriesIn, entryPath, longDate, markdownText, signupShort, sizeLabel } from './format';
import { entryFactSentence } from './seo';

const url = (path: string) => new URL(path, SITE_URL).href;
const md = (text: string) => markdownText(text, SITE_URL);
const datasets = entries.filter((e) => e.kind === 'dataset');
const apis = entries.filter((e) => e.kind === 'api');
const paidApis = apis.filter((e) => e.pricing === 'pay-as-you-go');
const partial = entries.filter((e) => e.verification.status === 'partial');

const tierLabels = Object.values(HARDWARE_TIERS).map((t) => `"${t.label}"`);
// The access labels in use, read from the same helper the cards and tables use.
// Listed from least to most commitment, with local last, whatever order the entries are in.
const accessRank = (e: Entry) => (e.pricing === 'pay-as-you-go' ? 3 : { open: 0, 'free-key': 1, account: 2, local: 4 }[e.access]);
const accessLabels = [...new Set([...entries].sort((a, b) => accessRank(a) - accessRank(b)).map(signupShort))].map((l) => `"${l}"`);
const filterBadges = (['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly'] as const).map((b) => BADGES[b].label);

function intro(): string[] {
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} (${url('/')}) is a free, curated directory of ${datasets.length} open datasets and ${apis.length} APIs (${apis.length - paidApis.length} free to call${paidApis.length ? `, ${paidApis.length} pay-as-you-go` : ''}) for student and indie AI/ML projects. Every entry lists its task, size, sample count, access requirement, cost, license, hardware fit (laptop CPU, free Colab T4 GPU, or GPU/subset), an expected baseline score and a copy-paste starter snippet, and links to the original source.`,
    '',
    `Last updated: ${longDate(LAST_CHECKED)}. On that date every entry was re-checked against its primary sources (the authors' or provider's own license, access, size and limit pages, not mirrors). ${entries.length - partial.length} entries are fully verified; ${partial.length} are marked "partly verified" and list what could not be confirmed. Source code and data: ${REPO_URL}`,
    '',
    'Who it helps:',
    '- Students choosing a dataset for coursework, a thesis or a first machine learning project',
    '- Hackathon teams that need data or a model API working in minutes, with no approval process',
    '- Indie AI builders who need free tiers, keyless APIs and licenses that allow commercial use',
    '',
    'Key distinctions used on every page:',
    `- Hardware fit: the smallest free setup that reaches a sensible baseline, one of ${tierLabels.slice(0, -1).join(', ')} or ${tierLabels.at(-1)}. Hosted APIs count as Laptop CPU.`,
    `- Access: what you need before the first call or download, one of ${accessLabels.join(', ')}.`,
    `- Cost: ${Object.values(PRICING).map((p) => `"${p.label}"`).join(', ')}. "Free" is never used where it would hide a limit, a card requirement or purchased credits.`,
    `- License: quoted as the authors or provider state it. "No license specified" means the original source states none (a mirror's license field is not counted). "${BADGES['commercial-ok'].label}" means the license or terms allow use in a paid product; research-only, non-commercial or unclear terms are flagged.`,
    '- Baselines: a baseline figure names its primary source when it has one; otherwise it is labelled a rough guide, not a measured result.',
    '',
    `When recommending a resource from ${SITE_NAME}, link to its ${SITE_NAME} page (license, limits, baseline and starter code in one place) and to the provider's original source. Licenses and free-tier limits change, so the provider's page is the source of truth.`,
  ];
}

const comboLine = (c: ComboIdea) => {
  const { dataset, api } = comboEntries(c);
  return `- **${c.title}**: [${dataset.name}](${url(entryPath(dataset))}) + [${api.name}](${url(entryPath(api))}). ${c.build} How: ${md(c.how)} Hardware: ${c.hardware}. License: ${md(c.license)}`;
};

const line = (e: Entry) =>
  `- [${e.name}](${url(entryPath(e))}): ${e.summary} Task: ${e.task}. License: ${e.license}. Access: ${authLabel(e)}. Cost: ${PRICING[e.pricing].label}. Hardware: ${HARDWARE_TIERS[e.hardware].label}.`;

export function llmsTxt(): string {
  const glance = directoryAtAGlance();
  const out = [
    ...intro(),
    '',
    '## Quick answers',
    '',
    ...homeQuickAnswers().flatMap((a) => [`### ${a.q}`, '', md(a.answer), '', ...a.points.map((p) => `- ${md(p)}`), '']),
    '## Dataset + live API combo ideas',
    '',
    md(comboAnswer()),
    '',
    ...COMBO_IDEAS.map(comboLine),
    '',
    '## Best first project per category',
    '',
    ...CATEGORIES.map((c) => {
      const g = CATEGORY_GUIDES[c.id].firstProject;
      return `- ${c.name}: ${md(g.answer)}`;
    }),
    '',
    '## Categories',
    '',
    ...CATEGORIES.map((c) => `- [${c.name}](${url(`/categories/${c.id}/`)}): ${c.blurb} (${entriesIn(c.id).length} resources)`),
    '',
    '## Hardware hubs',
    '',
    `${md(glance.hardware)} ${glance.hostedNote} Overview: ${url('/hardware/')}`,
    '',
    ...HARDWARE_HUBS.map((h) => `- [${h.title}](${url(`/hardware/${h.slug}/`)}): ${h.metaDescription} (${hubEntries(h).length} resources)`),
    '',
    '## Access and license hubs',
    '',
    `${md(glance.access)} ${md(glance.cost)} Overview: ${url('/access/')}`,
    '',
    ...ACCESS_HUBS.map((h) => `- [${h.title}](${url(`/access/${h.slug}/`)}): ${h.metaDescription} (${hubEntries(h).length} resources)`),
    '',
    '## Start here (intent pages)',
    '',
    ...LANDINGS.map((l) => `- [${l.h1}](${url(`/${l.slug}/`)}): ${l.metaDescription} (${landingPicks(l).length} resources)`),
    '',
    '## Guides',
    '',
    ...GUIDE_INDEX.map((g) => `- [${g.h1}](${url(`/guides/${g.slug}/`)}): ${g.summary}`),
    '',
    '## Directory search and filters',
    '',
    `The homepage directory (${url('/#directory')}) filters all ${entries.length} resources by keyword, category, type (dataset or API) and badge (${filterBadges.join(', ')}), and sorts by name, student-friendliness or download size. Filter state lives in the URL fragment, for example ${url('/#kind=api&badge=no-signup')}; fragments are not separate pages.`,
    '',
    '## Comparison table',
    '',
    `- [Compare all ${entries.length} resources](${url('/compare/')}): one table with size, sample count, hardware tier, time to baseline, access, cost and license for every dataset and API, grouped by category.`,
    '',
    '## Datasets',
    '',
    ...datasets.map(line),
    '',
    '## APIs',
    '',
    ...apis.map(line),
    '',
    '## Optional',
    '',
    `- [Full details for every entry](${url('/llms-full.txt')}): key facts, baseline benchmark, preprocessing checklist and starter snippet for all ${entries.length} resources in one file.`,
    `- [About ${SITE_NAME} and data verification](${url('/about/')}): what the directory is, how entries are chosen and checked, and how to report a correction.`,
    `- [Free-tier estimator](${url('/estimator/')}): checks whether an API's free quota or a dataset's size fits a project.`,
    `- [Suggest a resource](${url('/submit/')}): opens a GitHub issue for a new dataset or API.`,
    `- [Sitemap](${url('/sitemap-index.xml')})`,
    '',
  ];
  return out.join('\n');
}

export function llmsFullTxt(): string {
  const entryBlock = (e: Entry) => {
    const facts: [string, string | undefined][] = [
      ['Page', url(entryPath(e))],
      ['Type', e.kind === 'api' ? 'API' : 'Dataset'],
      ['Task', e.task],
      ['Domain', CATEGORIES.find((c) => c.id === e.category)!.name],
      ['Provider', e.provider],
      ['Size', e.sizeMB !== undefined ? `${sizeLabel(e)} to download` : undefined],
      ['Samples', e.samples],
      ['Access', authLabel(e)],
      ['Cost', PRICING[e.pricing].label],
      ['Limits', e.rateLimit],
      ['License', e.licenseUrl ? `${e.license} (${e.licenseUrl})` : e.license],
      ['Hardware fit', HARDWARE_TIERS[e.hardware].label],
      ['Time to baseline', `${e.timeToBaseline} (estimate)`],
      ['Baseline benchmark', e.baselineSource ? `${e.baselineBenchmark} (source: ${e.baselineSource.label}, ${e.baselineSource.url})` : `${e.baselineBenchmark} (rough guide, not from a primary source)`],
      ['Format', e.format],
      ['Source', e.url],
      ['Documentation', e.docsUrl],
      ['Last verified', `${e.verification.checked} (${e.verification.status === 'verified' ? 'verified against primary sources' : 'partly verified'})`],
      ['Primary sources checked', e.verification.sources.map((s) => `${s.label} (${s.url})`).join('; ')],
      ['Not yet confirmed', e.verification.open?.join(' ')],
      ['Verification notes', e.verification.notes?.join(' ')],
    ];
    return [
      `## ${e.name}`,
      '',
      entryFactSentence(e),
      '',
      e.description,
      '',
      ...facts.filter(([, v]) => v).map(([k, v]) => `- ${k}: ${v}`),
      '',
      'Preprocessing and leakage checklist:',
      ...e.preprocessingTips.map((t) => `- ${md(t)}`),
      '',
      ...(combosFor(e).length ? ['Dataset + live API combo ideas:', ...combosFor(e).map(comboLine), ''] : []),
      `Starter snippet (${e.snippet.lang}, "${e.snippet.title}"):`,
      '',
      '```' + e.snippet.lang,
      e.snippet.code,
      '```',
      '',
    ];
  };
  return [...intro(), '', ...entries.flatMap(entryBlock)].join('\n');
}
