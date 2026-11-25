// Writes public/llms.txt and public/llms-full.txt from the directory data (src/utils/llms.ts),
// so the committed files always match the pages. Runs before every build (npm "prebuild").
//   node scripts/generate-llms.mjs          regenerate both files
//   node scripts/generate-llms.mjs --check  exit 1 if the committed files are out of date
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const check = process.argv.includes('--check');

// Vite's SSR loader resolves the TypeScript data layer exactly as Astro does, including
// PUBLIC_SITE_URL from the environment or a .env file.
const vite = await createServer({
  root,
  configFile: false,
  envPrefix: 'PUBLIC_',
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
});

let stale = [];
try {
  const { llmsTxt, llmsFullTxt } = await vite.ssrLoadModule('/src/utils/llms.ts');
  for (const [file, body] of [['llms.txt', llmsTxt()], ['llms-full.txt', llmsFullTxt()]]) {
    const path = `${root}public/${file}`;
    const current = await readFile(path, 'utf8').catch(() => '');
    if (current === body) continue;
    if (check) stale.push(file);
    else {
      await writeFile(path, body);
      console.log(`Wrote public/${file} (${(Buffer.byteLength(body) / 1024).toFixed(1)} KB)`);
    }
  }
} finally {
  await vite.close();
}

if (stale.length) {
  console.error(`Out of date: ${stale.map((f) => `public/${f}`).join(', ')}. Run "npm run llms" and commit the result.`);
  process.exit(1);
}
if (check) console.log('public/llms.txt and public/llms-full.txt are up to date.');
