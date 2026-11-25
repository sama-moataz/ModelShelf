import type { APIRoute } from 'astro';
import { llmsTxt } from '../utils/llms';

// Generated from the directory data so it always matches the pages (see utils/llms.ts).
export const GET: APIRoute = () => new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
