import type { APIRoute } from 'astro';
import { llmsFullTxt } from '../utils/llms';

// Every entry's key facts, checklist and starter snippet in one file for retrieval systems.
export const GET: APIRoute = () => new Response(llmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
