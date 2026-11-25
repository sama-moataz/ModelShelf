# ModelShelf

**[modelshelf.vercel.app](https://modelshelf.vercel.app)** is a free, curated directory of **20 open datasets and 10 free APIs** for student and indie AI/ML projects. Every entry lists its task, size, sample count, sign-up requirement, license, hardware fit, an expected baseline score and a copy-paste starter snippet, and links to the original source.

Last updated: November 25, 2026. Every source, documentation and license link was checked on that date.

## Project overview

**Who it's for**

- Students choosing a dataset for coursework, a thesis or a first machine learning project
- Hackathon teams that need data or a model API working in minutes, with no approval process
- Indie AI builders who need free tiers, keyless APIs and licenses that allow commercial use

**What's inside**

| Category | Entries | Kind |
| --- | --- | --- |
| Language datasets (NLP) | 5 | Datasets |
| Vision datasets | 5 | Datasets |
| Tabular datasets | 5 | Datasets |
| Audio & speech datasets | 5 | Datasets |
| Free LLM & model APIs | 5 | APIs (4 hosted, 1 local) |
| Free data APIs | 5 | APIs |

Every entry gets one **hardware tier**: the smallest free setup that reaches a sensible baseline. Hosted APIs count as Laptop CPU.

| Hardware tier | Entries |
| --- | --- |
| Laptop CPU | 20 (10 datasets and all 10 APIs) |
| Free Colab T4 GPU | 7 datasets |
| GPU, or start with a subset | 3 datasets |

**Access and license rules**

- **Sign-up:** 25 entries need no sign-up or API key: all 20 datasets and 5 APIs. The other 5 need a free key or account. None of them asks for a credit card.
- **License:** each entry quotes its license as the provider states it, and links the official text when it maps cleanly to Creative Commons or SPDX.
- **Commercial OK:** 17 entries have this badge, meaning their license or terms allow use in a paid product.
- **Research and coursework:** 8 datasets are free to learn and publish with, but their terms are non-commercial, research-only or unclear.

## Features and pages

| Route | What it is |
| --- | --- |
| `/` | The directory: search, category, type and badge filters, and sorting. It also has quick answers, the Dataset + Live API combo ideas and an FAQ. Deep links work: `/?q=weather&category=data-apis`. |
| `/resources/<slug>/` (30) | One page per entry. It has key facts (one per row), a starter snippet, a data leakage and preprocessing checklist, an expected baseline, project ideas, any combo ideas, an FAQ, and source and license links. |
| `/categories/`, `/categories/<id>/` (6) | Category pages. Each one has "When to choose" and "Best first project for beginners" blocks that name exact entries. |
| `/hardware/`, `/hardware/<tier>/` (3) | Hardware tiers: `laptop-cpu`, `free-colab-t4` and `needs-gpu-subset`. Each tier page gives a direct answer, then a spec table, cards and a tuning guide. |
| `/access/`, `/access/<hub>/` (3) | Access and license hubs: `no-signup`, `open-commercial` and `academic-research`. |
| `/compare/` | Every entry in one HTML table: modality, size, samples, hardware tier, time to baseline, sign-up and license. |
| `/estimator/` | Checks whether an API's free quota or a dataset's size fits your project. Link to one entry with `?entry=<slug>`. |
| `/submit/` | Opens a pre-filled GitHub issue to suggest a resource. There's no server, so it needs no backend. |
| `/about/` | What ModelShelf is, how entries are chosen and verified, and how to report a correction. |
| `/llms.txt`, `/llms-full.txt` | Plain-Markdown summaries for LLMs and answer engines. They're generated into `public/` (see below). |
| `/robots.txt`, `/sitemap-index.xml` | Crawler rules and the sitemap. |

Old-style paths `/category/*` and `/item/*` redirect permanently to `/categories/*` and `/resources/*` (see `vercel.json`).

## Tech stack and architecture

- **[Astro](https://astro.build) 7** with `output: 'static'` and `trailingSlash: 'always'`. Every route is pre-rendered HTML, and the home page filters only hide or reorder cards that are already rendered on the server.
- **Tailwind CSS 4** via `@tailwindcss/vite`. Brand colours and fonts live in `src/styles/global.css`.
- **[Lucide](https://lucide.dev) icons** via `lucide-astro`, imported one icon per file.
- **`@astrojs/sitemap`**: the sitemap skips the 404 page and the verification file, and sets `lastmod` from the verification date.
- **TypeScript data layer**: all content lives in typed modules, and pages, hubs, JSON-LD and the llms files are derived from them.
- **Vercel Web Analytics** (cookie-free) via `@vercel/analytics/astro`.
- **Hosting**: static deployment on Vercel. Every push to `main` on GitHub triggers a build. `vercel.json` sets the build command, redirects and headers.

```
src/
  config/site.ts          Canonical URL, site name, description, repo URL
  data/directoryData.ts   Entries, categories, badges, hardware tiers, LAST_CHECKED
  data/hubs.ts            Hardware and access hub definitions
  data/guides.ts          Category guides, home quick answers, combo ideas, hub answers
  utils/format.ts         Labels, sizes, dates, and the [[slug]] copy markup renderer
  utils/seo.ts            JSON-LD builders and per-entry FAQ copy
  utils/llms.ts           llms.txt and llms-full.txt content
  components/             Layout pieces, cards, tables, answer blocks
  pages/                  Routes (see the table above), plus robots.txt.ts
scripts/generate-llms.mjs Writes public/llms.txt and public/llms-full.txt from the data
public/                   Static files: llms*.txt, favicon, logo, og-image, Search Console file
```

## Local development and verification

Requires Node.js 22 (see `engines` in `package.json`).

```bash
npm install
npm run dev          # http://localhost:4321
npx astro check      # type-check pages and data; expect 0 errors
npm run check        # astro check, plus a check that public/llms*.txt are up to date
npm run build        # regenerates public/llms*.txt (prebuild), then builds dist/
npm run preview      # serve the production build locally
```

A good build ends with `51 page(s) built`. `dist/` should then contain:

- `index.html` and one page per route
- `llms.txt` and `llms-full.txt`
- `robots.txt`
- `sitemap-index.xml` and `sitemap-0.xml`

The canonical URL is set in `src/config/site.ts`. To build for another domain, override it with `PUBLIC_SITE_URL`:

```bash
PUBLIC_SITE_URL=https://example.com npm run build
```

## Adding or updating datasets and APIs

1. **Check that it qualifies.** It has to be free without a credit card, with a public source page and documentation. It should also be practical on free hardware, or have a clear subset or pretrained route.
2. **Add an object to `entries`** in `src/data/directoryData.ts`. The `Entry` interface documents every field. Required fields:
   - **Basics:** `slug`, `name`, `kind`, `category`, `task`, `summary` and `description`.
   - **Sources:** `url` (the original source) and `docsUrl`.
   - **Terms:** `provider`, `license` and `access`.
   - **Format and labels:** `format`, `badges`, `tags`, `useCases` and `gotchas`.
   - **Benchmark facts:** `hardware`, `samples`, `timeToBaseline`, 2–3 `preprocessingTips` and `baselineBenchmark`.
   - **Code:** a `snippet`.
   - **Datasets** also need `sizeMB`. **APIs** need `rateLimit`, and `quotas` if you want them in the estimator.
3. **Pick the hardware tier** (`laptop-cpu`, `free-colab-t4` or `needs-gpu-subset`). Use the smallest free setup that reaches the baseline you wrote down. Hosted APIs are `laptop-cpu`.
4. **Set the sign-up status** with `access`:
   - `open`: no account or key
   - `free-key`: a free API key
   - `account`: a free account
   - `local`: runs on your machine

   Add the `no-signup` badge only for `open` and `local`, and `no-card` only if the free tier never asks for a payment method.
5. **Check the license against the primary source,** not a mirror. Quote it in `license`. Set `licenseUrl` only when it maps cleanly to a Creative Commons or SPDX URL. Add `commercial-ok` only when the terms clearly allow a paid product.
6. **Run the starter snippet** before committing it. Keep it short, and keyless where the API allows.
7. **Optional copy:**
   - **Category guides:** `src/data/guides.ts` holds the category "When to choose" and "Best first project" blocks, and the combo ideas (`COMBO_IDEAS`).
   - **Copy markup:** in that copy, `[[slug]]` links an entry by name and `[label](/path/)` links a page on the site. An unknown slug fails the build.
8. **Update `LAST_CHECKED`** in `directoryData.ts` after re-checking every source, documentation and license link. That date drives the "Last verified" badges, the sitemap `lastmod`, JSON-LD dates and the llms files. Update the date at the top of this README too.
9. **Sync the llms files:** run `npm run llms` and commit `public/llms.txt` and `public/llms-full.txt` with your change. `npm run build` regenerates them anyway, and `npm run check` fails if the committed copies are stale.
10. **Verify:** run `npm run check && npm run build`, then open the new page with `npm run preview`.

Everything else picks the entry up on the next build: the category page, hubs, compare table, filters, estimator, sitemap and JSON-LD.

## GEO and indexing notes

- **Sitemap.** `/sitemap-index.xml` lists every page except the 404. Each `lastmod` is the verification date, so it only changes when links are actually re-checked. Submit the index URL in Google Search Console and Bing Webmaster Tools.
- **robots.txt.** It's generated by `src/pages/robots.txt.ts`. Search engines, AI search and answer bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot and others) and AI model crawlers (GPTBot, ClaudeBot, Google-Extended and others) each get a named group. A crawler with its own group never inherits the `*` rules, so every group repeats `Allow: /` and `Disallow: /404`. The file ends with the `Sitemap:` line.
- **JSON-LD.** Built in `src/utils/seo.ts` and kept in line with the visible text:
  - **Home page:** Organization, WebSite and DataCatalog nodes with stable `@id`s.
  - **Entry pages:** a WebPage node carries `dateModified` and `lastReviewed`, the date ModelShelf checked the entry. The Dataset or WebAPI node carries the facts and `sameAs` the real source URL. Dates stay off that node because ModelShelf doesn't know when the provider last changed their data.
  - **Breadcrumbs:** BreadcrumbList matches the visible breadcrumb on every page.
  - **FAQs:** FAQPage appears only where the same questions and answers are shown on the page.
  - **Hubs:** CollectionPage with an ItemList.
- **llms.txt and llms-full.txt.** A machine-readable index of the site: what it is, who it helps, categories, hubs, combo ideas and every entry with its key facts. They're a convenience, not a substitute: every fact in them is also on a crawlable HTML page with clear headings.
- **Answer-first copy.** Home, category, hub, compare and entry pages open their key sections with a 1–2 sentence answer, then specs, lists or tables. Answer engines quote self-contained passages, and numbers computed from the data can't drift from the tables.
- **External links and mentions matter too.** On-site structure makes ModelShelf easy to quote. Being cited elsewhere makes it more likely to be chosen. Useful places to be linked from include the GitHub repo's description and topics, course and bootcamp resource lists, hackathon starter guides, and "awesome" lists for datasets or free APIs.

## Deploy

Vercel builds `main` with `npm run build` and serves `dist/`. Any static host works too: there's nothing to run on a server.

## License

The code is MIT licensed (see `LICENSE`). Each dataset and API belongs to its provider and keeps its own license, linked from its page.
