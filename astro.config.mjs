// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// astro.config.mjs runs before Vite exposes import.meta.env, so read the same variable manually.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const SITE_URL = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || 'https://modelshelf.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // The preview pane reaches the dev server through a proxy host name.
    server: { allowedHosts: true },
  },
});
