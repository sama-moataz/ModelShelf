# Indexing, SERP branding and monitoring

This is how ModelShelf keeps its URLs clean for search engines and answer engines, and what a maintainer needs to check by hand, because none of these accounts can be reached from the codebase.

## URL policy

| Rule | Where it lives |
| --- | --- |
| Every page URL ends in `/`. Vercel answers `/estimator` with a permanent 308 redirect to `/estimator/`. | `vercel.json` (`trailingSlash: true`), `astro.config.mjs` |
| `/<route>/index.html` and `/index.html` return a 301 to the slash URL, so no page is reachable at two addresses. | `vercel.json` redirects |
| The preferred estimator URL is **`/estimator/`**. `/tools/estimator` and `/tools/estimator/` return a 301 to it. | `vercel.json` |
| On-site links prefill the estimator with a fragment (`/estimator/#entry=iris`). A fragment is never a separate URL. Older `?entry=` links still work, and the page rewrites them to the fragment form. | `src/pages/resources/[slug].astro`, `src/pages/estimator.astro` |
| Homepage filters keep their state in the fragment (`/#kind=api&badge=no-signup&sort=size`), so Back and shared links restore them without creating duplicate URLs. | `src/pages/index.astro` |
| Eight requested landing URLs duplicate existing pages, so they return a 301 instead of a near-copy: `/datasets-for-laptop-cpu`, `/datasets-for-google-colab`, `/datasets-without-signup`, `/commercial-use-datasets`, `/free-nlp-datasets`, `/free-computer-vision-datasets`, `/free-audio-datasets`, `/free-llm-apis` (each with and without the trailing slash). | `vercel.json` |
| Four intent pages are real pages: `/datasets-for-beginners/`, `/free-apis-without-api-key/`, `/datasets-for-school-projects/`, `/datasets-for-hackathons/`. Guides live under `/guides/`. | `src/data/landings.ts`, `src/content/guides/` |
| Every indexable page carries `<link rel="canonical">` with its own slash URL. The 404 page carries `noindex` and no canonical. | `src/layouts/Layout.astro` |
| The sitemap lists every page once, by its canonical URL. It contains no query strings, no `index.html` paths and no 404 page. | `astro.config.mjs` (sitemap `filter`) |
| Old `/category/*` and `/item/*` paths return a 301 to `/categories/*` and `/resources/*`. | `vercel.json` |

Never rename an existing slug. A slug that ever has to change needs a 301 in `vercel.json` in the same commit.

### Checks to run after every deploy

These redirects only exist on Vercel, so test them against the live site:

```bash
SITE=https://modelshelf.vercel.app

# 1. Status codes and redirect targets (no redirect following)
for p in / /estimator /estimator/ /estimator/index.html "/estimator/?entry=iris" /tools/estimator /tools/estimator/ \
         /index.html /resources/ag-news/index.html /category/nlp/ /item/iris/ \
         /datasets-for-laptop-cpu /datasets-for-google-colab/ /datasets-without-signup /commercial-use-datasets \
         /free-nlp-datasets /free-computer-vision-datasets /free-audio-datasets /free-llm-apis \
         /datasets-for-beginners/ /free-apis-without-api-key/ /datasets-for-school-projects/ /datasets-for-hackathons/ \
         /guides/ /guides/dataset-licenses/ /llms.txt /llms-full.txt /robots.txt /sitemap-index.xml \
         /site.webmanifest /favicon.ico /favicon.svg /favicon-96x96.png /apple-touch-icon.png /does-not-exist/; do
  curl -s -o /dev/null -w "%{http_code} %-45{redirect_url} $p\n" "$SITE$p"
done

# 2. Content types of the machine-readable files
for p in /llms.txt /llms-full.txt /robots.txt /sitemap-index.xml /site.webmanifest; do
  curl -sI "$SITE$p" | grep -i '^content-type' | sed "s|^|$p  |"
done

# 3. Canonical tags match the URL on a sample of pages
for p in / /estimator/ /resources/mnist/ /datasets-for-hackathons/ /guides/choose-a-dataset/; do
  curl -s "$SITE$p" | grep -o '<link rel="canonical" href="[^"]*"' | sed "s|^|$p  |"
done

# 4. Sitemap: count URLs and make sure no query strings or index.html paths slipped in
curl -s "$SITE/sitemap-0.xml" | grep -o '<loc>[^<]*</loc>' | wc -l
curl -s "$SITE/sitemap-0.xml" | grep -E '\?|index\.html' || echo "sitemap clean"

# 5. robots.txt still allows crawling and names the sitemap
curl -s "$SITE/robots.txt" | grep -E '^(Sitemap|Disallow: /$)'

# 6. Font files are cached for a year
curl -sI "$SITE/fonts/jetbrains-mono-latin.woff2" | grep -i '^cache-control'
```

Expected results:

- Real pages, the text files, the sitemap, the manifest and every favicon return `200`.
- Every duplicate or old variant returns `301` or `308` to its slash URL **in one hop** (the `redirect_url` column), never to another redirect. The eight landing redirects point at `/hardware/…`, `/access/…` or `/categories/…`.
- `/estimator/?entry=iris` returns `200` with the canonical `/estimator/`; the page itself rewrites the address to `/estimator/#entry=iris`.
- `llms.txt`, `llms-full.txt` and `robots.txt` are `text/plain`; the sitemap is XML; the manifest is JSON.
- Each canonical equals the URL you requested.
- The sitemap has 62 URLs (63 built pages minus the 404) and prints `sitemap clean`.
- robots.txt prints the `Sitemap:` line and no `Disallow: /` line.
- Fonts show `public, max-age=31536000, immutable`. If a font file ever changes, give it a new file name.
- `/does-not-exist/` returns `404`.

`npm run test:dist` runs the same canonical, sitemap, robots, llms and link checks against `dist/` before you push.

## Site name and favicon in Google

- The homepage has a `WebSite` JSON-LD node:
  - `name: "ModelShelf"`
  - `alternateName: "Model Shelf"`
  - `url: "https://modelshelf.vercel.app/"`
- It is published by an `Organization` node for the project. That node holds only the name, the logo, the description and the GitHub repository. It has no address and no invented business details.
- Icons:
  - `/favicon.ico`: 16, 32 and 48 px.
  - `/favicon-96x96.png`: 96 px, a multiple of 48, which is what Google asks for.
  - `/favicon.svg`.
  - `/apple-touch-icon.png`: 180 px.
  - `/web-app-manifest-192x192.png` and `-512x512.png`.
  - `/site.webmanifest`, named ModelShelf.
- `/logo.png` (512 px) is the Organization logo. `/og-image.png` (1200×630) is the share card.
- Google chooses the site name and favicon itself, and only after it recrawls the homepage. Until then the results can keep showing "Vercel" and the triangle icon. Use URL Inspection → Request indexing on the homepage to speed that up. Nothing guarantees when, or whether, Google switches.

## Google Search Console

The site is verified with the HTML file `public/googlefbe977aa5a93e0e7.html`. Keep that file, and never let a redirect rule catch it.

- [ ] Verification: the HTML file method is already in place. Confirm the property shows as verified; do not add a second token unless Google asks.
- [ ] Sitemaps: submit only `https://modelshelf.vercel.app/sitemap-index.xml`. After this release it lists 62 URLs, including the four intent pages and eight guide pages.
- [ ] URL Inspection → Request indexing for the homepage, `/guides/`, and the four intent pages. Don't bulk-request the rest; the sitemap covers them.
- [ ] Pages report: watch "Duplicate, Google chose different canonical than user", "Alternate page with proper canonical tag" and "Crawled – currently not indexed".
- [ ] For the estimator, use URL Inspection on `/estimator/` and on one old `/estimator/?entry=…` URL, and confirm that **Google-selected canonical** reads `/estimator/`.
- [ ] Spot-check five resource pages with URL Inspection, and confirm that user-declared and Google-selected canonicals match.
- [ ] Don't read "indexed" off `site:` searches. Only the Pages report counts.

## Bing Webmaster Tools

- [ ] Add the site with **Import from Google Search Console**. That reuses the Google verification and the sitemap, so no Bing token is needed in the code.
- [ ] If you verify manually instead, Bing issues a `BingSiteAuth.xml` file or an `msvalidate.01` meta tag. Add only the real one Bing gives you, and never a placeholder.
- [ ] Submit `sitemap-index.xml`, then check Site Explorer and URL Inspection the same way as in Google.

## Core Web Vitals

Lab measurements on 26 Nov 2026 (Lighthouse 12 against a local production build, not the live site; simulated mobile = Moto G Power, slow 4G, 4× CPU slowdown):

| Page | Mobile LCP | CLS | TBT | Performance score |
| --- | --- | --- | --- | --- |
| `/` | 1.7 s | 0 | 0 ms | 100 |
| `/resources/coco-2017/` | 1.2 s | 0 | 0 ms | 100 |
| `/estimator/` | 1.2 s | 0 | 0 ms | 100 |
| `/datasets-for-hackathons/` | 1.5 s | 0 | 0 ms | 100 |
| `/guides/dataset-licenses/` | 1.2 s | 0 | 0 ms | 100 |

INP can't be measured in a lab run. With the CPU slowed 4× in a headless browser, the slowest tap or keypress took 88 ms on the homepage filters and 24 ms in the estimator. These are lab figures; **field Core Web Vitals are unmeasured** until real visitors generate data.

After deploy:

- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on `/`, one resource page, `/estimator/` and one guide, mobile and desktop. Note the lab numbers here.
- [ ] Search Console → Core Web Vitals: field data appears only once Chrome has enough visits (CrUX). Until then the report is empty; that is normal for a small site.
- [ ] Targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile.
- [ ] Optional: Vercel Speed Insights reports field metrics from your own visitors. It is not installed; adding it is a separate decision, because it adds a script.

## First 30 days after deploy

| When | Check |
| --- | --- |
| Day 0 (deploy) | Run the post-deploy checks above. Fix any redirect that takes more than one hop. Submit the sitemap in Search Console and Bing. Request indexing for the homepage, `/guides/` and the four intent pages. Run PageSpeed Insights on four pages. |
| Day 1–2 | Search Console → Pages: no new "Server error (5xx)" or "Not found (404)" for URLs that should exist. URL Inspection on `/estimator/` shows a Google-selected canonical of `/estimator/`. |
| Day 7 | Sitemaps report shows the index as "Success" with 62 discovered URLs. Check "Duplicate, Google chose different canonical than user" is empty or shrinking. Spot-check five resource pages and two guides with URL Inspection. Run the GEO prompt set once and log it. |
| Day 14 | Search for `site:modelshelf.vercel.app` only to eyeball the site name and favicon; Google may still show "Vercel". Re-run the post-deploy checks. Check Bing Site Explorer for crawl errors. |
| Day 21 | Search Console → Performance: note which queries reach the intent pages and guides. Fix any page with impressions but a misleading title or description. |
| Day 30 | Full review: Pages report, Core Web Vitals (if field data exists), GEO log, and the resource sources most likely to change (Gemini model names, OpenRouter free models, NASA APOD's repository move on 1 Dec 2026). Re-check any entry whose provider page changed, then update `LAST_CHECKED`. |

After 30 days, repeat the Day 30 review monthly.

## Crawler access

- `robots.txt` is generated by `src/pages/robots.txt.ts`.
- Search engines, AI search bots (including OAI-SearchBot, PerplexityBot and Claude-SearchBot) and AI training crawlers (including GPTBot, ClaudeBot and Google-Extended) each get a named group with `Allow: /` and `Disallow: /404`, plus the `Sitemap:` line.
- `/llms.txt` and `/llms-full.txt` are plain text with no authentication. They are regenerated from the data on every build, and they link only to canonical `/resources/<slug>/` URLs.

## GEO monitoring test set

Run these prompts once a month in ChatGPT (with search), Gemini and Perplexity, and log each result as Mentioned / Recommended / Cited / Linked / Absent. A single answer is one sample, not a ranking.

| # | Prompt |
| --- | --- |
| 1 | Where can students find free AI datasets? |
| 2 | What are the best free dataset directories for machine learning? |
| 3 | Which datasets work on a laptop without a GPU? |
| 4 | What free APIs do not require registration or an API key? |
| 5 | Where can I find free resources for a school AI project? |
| 6 | What are the best free resources for beginner machine learning? |

| Date | Assistant | Prompt # | Result | Linked URL | Notes |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## External distribution

The shortlist, each destination's rules and ready-to-adapt drafts are in [`outreach.md`](outreach.md). Submit by hand, one list at a time, only where ModelShelf genuinely fits, and follow each list's current rules. Nothing has been submitted yet.

| Destination | Fit | Rules as read on 26 Nov 2026 |
| --- | --- | --- |
| [academic/awesome-datascience](https://github.com/academic/awesome-datascience) | Good. It has *Datasets* and *Free Courses / Tutorials* sections. | Contributions are welcome through its `CONTRIBUTING.md`. Open one PR that adds one line. |
| [awesomedata/awesome-public-datasets](https://github.com/awesomedata/awesome-public-datasets) | Weak. It lists primary data sources, and ModelShelf is a curated index of other sources. | The README is generated. Contributions go to [apd-core](https://github.com/awesomedata/apd-core/blob/master/CONTRIBUTING.md) as metadata files. |
| [josephmisiti/awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) | Weak to moderate. It lists libraries and tools. | Since April 2026 the maintainer asks contributors to email first to prove they are human, because of LLM-generated PRs. Don't open an unsolicited PR. |
| Hackathon starter guides (MLH, Devpost and university hackathon pages) | Good, especially the keyless APIs and combo ideas. | Contact each organiser. |
| Course resource pages (university ML courses, bootcamps) | Good. | Email the instructor or TA with the hardware hub pages. |

Before you pitch any list, update the GitHub repository's description and topics (`datasets`, `free-api`, `machine-learning`, `students`).
