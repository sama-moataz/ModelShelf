// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { LAST_CHECKED } from './src/data/directoryData.ts';
import { editorTheme } from './src/utils/editorTheme.ts';

// astro.config.mjs runs before Vite exposes import.meta.env, so read the same variable manually.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const SITE_URL = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || 'https://modelshelf.vercel.app';


export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // Guide code fences use the same editor theme as the CodeBlock component.
  markdown: { shikiConfig: { theme: editorTheme } },
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // 404 is noindex; the Search Console verification file is not a page.
      filter: (page) => !/\/404\/?$/.test(page) && !/\/google[0-9a-f]+\.html$/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname;
        // Google ignores priority, but lastmod is used when it is consistently accurate.
        item.lastmod = new Date(`${LAST_CHECKED}T00:00:00Z`).toISOString();
        item.priority = path === '/' ? 1.0 : /^\/(resources|compare)\//.test(path) ? 0.8 : 0.6;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // The preview pane reaches the dev server through a proxy host name.
    server: { allowedHosts: true },
  },
});
