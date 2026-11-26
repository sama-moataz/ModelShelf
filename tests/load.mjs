// Loads the TypeScript data layer through Vite's SSR loader, the same way Astro and
// scripts/generate-llms.mjs do, so tests see exactly what the pages render.
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

export const root = fileURLToPath(new URL('..', import.meta.url));

export async function loadModules(paths) {
  const vite = await createServer({
    root,
    configFile: false,
    envPrefix: 'PUBLIC_',
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  try {
    return await Promise.all(paths.map((p) => vite.ssrLoadModule(p)));
  } finally {
    await vite.close();
  }
}
