# Roadmap status: 26 November 2026

Status of every phase in the *SEO, GEO, AEO & Product Improvement Roadmap* and the final-completion brief, after the 26 November 2026 work. "Done" means implemented and tested in the repository; nothing here is deployed until the changes are pushed and Vercel builds them.

| Phase | Status | Where |
| --- | --- | --- |
| 1. Audit | Done | `docs/audit-2026-11-26.md` (live HTTP checks before the change) |
| 2. Technical SEO: metadata, sitemap, robots, rendering | Done. Unique titles and descriptions, self-canonicals, OG/Twitter tags, one H1 per page, sitemap of 62 canonical URLs, robots.txt with named crawler groups. All enforced by `npm run test:dist`. | `src/layouts/Layout.astro`, `astro.config.mjs`, `src/pages/robots.txt.ts` |
| 3. GEO: llms.txt, AI-readable facts, answer-first copy | Done. llms files are generated from the data on every build and now include cost labels, verification status, the intent pages, guides and filter URLs. | `src/utils/llms.ts`, `scripts/generate-llms.mjs` |
| 4. Homepage | Done. Hero and CTAs as suggested, nine discovery pathways (each to a crawlable page), filters with a mobile drawer and shareable state, combos, quick answers, FAQ, verification summary, contribution links. | `src/pages/index.astro` |
| 5. Landing pages | Done for genuinely distinct intents: `/datasets-for-beginners/`, `/free-apis-without-api-key/`, `/datasets-for-school-projects/`, `/datasets-for-hackathons/`. The other eight suggested URLs duplicate existing pages, so they 301 to them instead of creating thin copies. The landing pages have answer-first leads, notes and common mistakes rather than a separate FAQ block. | `src/data/landings.ts`, `vercel.json` |
| 6. Resource accuracy and verification | Done. All 30 entries re-checked against primary sources; per-entry status, sources and open questions in the data and on each page. Link checker added (`npm run links`); it reports, never verifies. | `docs/resource-verification.md`, `scripts/check-links.mjs` |
| 7. Structured data | Done. WebSite, Organization, DataCatalog, CollectionPage, Dataset (dataset pages and data APIs only), WebAPI, SoftwareApplication (Ollama), TechArticle, BreadcrumbList, FAQPage. No ratings, reviews or invented organisation details. Parsed and checked by `npm run test:dist`; not yet run through Google's Rich Results Test (needs the live URL). | `src/utils/seo.ts` |
| 8. Educational content | Done: seven guides with checked facts, code and primary sources. Topics map onto the roadmap's suggestions (laptop CPU, licensing, keyless APIs, hardware-based choice, school and hackathon resources, no paid cloud). | `src/content/guides/` |
| 9. External authority | Prepared, not submitted: shortlist, rules and drafts. CONTRIBUTING and the About page cover purpose, audience, verification standards and contact. | `docs/outreach.md`, `CONTRIBUTING.md`, `/about/` |
| 10. UX and performance | Done and measured in a headless browser: no horizontal overflow at 320–1440 px, axe WCAG 2.2 AA clean, Lighthouse lab LCP 1.2–1.7 s mobile, CLS 0, interaction latency ≤ 88 ms at 4× CPU slowdown. Field Core Web Vitals are unmeasured until there is real traffic. | `docs/indexing-and-monitoring.md` |
| 11. Analytics and monitoring | Prepared: Search Console and Bing checklists, 30-day schedule, CWV checks, GEO prompt log. Vercel Web Analytics stays. Account actions need the owner. | `docs/indexing-and-monitoring.md` |
| 12. Final testing | Done locally; see the final report in the chat. Redirects and headers can only be tested after deploy. | `npm run verify` |

## Recommended next phase

1. Hugging Face Inference Providers: decided on 26 November 2026. It stays listed as pay-as-you-go ($0 monthly credits on Free accounts), labelled "Paid credits", with every page, llms file and the README saying so.
2. After deploy, run the post-deploy checks, submit the sitemap, and run the Rich Results Test on one dataset page, one guide and the homepage.
3. Resolve the six partly verified entries when their providers publish the missing terms (Groq and Gemini free-tier limits, the WikiText license version, GLUE per-task licenses, Oxford-IIIT Pet's conflicting terms, Titanic's original source).
4. Optional: run `npm run links` on a weekly schedule (for example a GitHub Actions workflow) and add ESLint if the team wants a linter beyond `astro check`.
