import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

// Everything public is open to crawlers. The named groups are documentation as much as
// rules: a crawler obeys only its most specific group and never inherits from `*` (RFC 9309),
// so every group repeats the same Allow/Disallow lines.
const groups: [comment: string, agents: string[]][] = [
  ['Search engines', ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot', 'YandexBot']],
  [
    'AI search, answer engines and user-requested fetches (they cite and link back)',
    ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'DuckAssistBot', 'MistralAI-User'],
  ],
  [
    'AI models and grounding (lets assistants recommend ModelShelf without a live search)',
    ['ClaudeBot', 'GPTBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'],
  ],
  ['Everyone else', ['*']],
];
const rules = ['Allow: /', 'Disallow: /404'];

export const GET: APIRoute = () => {
  const url = (path: string) => new URL(path, SITE_URL).href;
  const body = [
    '# ModelShelf: open datasets and APIs for student and indie AI/ML projects.',
    `# LLM-friendly summary: ${url('/llms.txt')} (full detail: ${url('/llms-full.txt')})`,
    '',
    ...groups.flatMap(([comment, agents]) => [`# ${comment}`, ...agents.map((a) => `User-agent: ${a}`), ...rules, '']),
    `Sitemap: ${url('/sitemap-index.xml')}`,
    '',
  ];
  return new Response(body.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
