import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

// Generated at build time so the Sitemap line always matches the deployed SITE_URL.
export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', SITE_URL).href}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
