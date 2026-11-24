# ModelShelf

A curated, zero-cost directory of **open datasets and free APIs for student and indie AI/ML projects**. 30 hand-picked entries across six categories, each with its license, limits, starter code, project ideas and gotchas.

Built static-first with [Astro](https://astro.build), Tailwind CSS 4, [Lucide](https://lucide.dev) icons and `@astrojs/sitemap`: every route is pre-rendered, crawlable HTML.

## Features

- Home page with search, category/type/badge filters and sorting (server-rendered cards, enhanced with a small script)
- 30 detail pages at `/resources/<slug>/` with Dataset / WebAPI JSON-LD and breadcrumbs
- Category hub and per-category pages
- Student-first badges: no signup, no credit card, commercial OK, laptop-friendly, beginner pick, one-line load
- Free-tier estimator for API quotas and dataset size vs. your hardware
- Submit page that opens a pre-filled GitHub issue (no server needed)
- Canonical URLs, Open Graph/Twitter tags, FAQ JSON-LD, `robots.txt`, `sitemap-index.xml`

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the production build
```

## Configuration

The canonical URL lives in `src/config/site.ts` and is wired into `astro.config.mjs` as `site`. Override it with `PUBLIC_SITE_URL`:

```bash
PUBLIC_SITE_URL=https://example.com npm run build
```

`public/robots.txt` points to the default URL's sitemap, so edit it if you change domains.

## Add a resource

Add an object to `entries` in `src/data/directoryData.ts` (see the `Entry` interface). Pages, sitemap, filters and the estimator pick it up on the next build. Please check the license and free limits against the provider's own page, then update `LAST_CHECKED`.

## Deploy

`vercel.json` is included. Import the repo on Vercel (Astro preset) or any static host; there is nothing to run on a server.

## Notes

Entry URLs were checked on 2026-11-24. Sizes are approximate, and free-tier limits change often, so treat each provider's docs as the source of truth.
