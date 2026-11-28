import type { APIRoute } from 'astro';
import { ADSENSE_CLIENT } from '../config/site';

// Authorised Digital Sellers (IAB ads.txt): names Google as the only seller of this site's ad space.
// f08c47fec0942fa0 is Google's certification authority ID, the same for every AdSense publisher.
export const GET: APIRoute = () =>
  new Response(`google.com, ${ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
