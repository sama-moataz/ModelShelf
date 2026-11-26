# Contributing to ModelShelf

ModelShelf is only useful if every fact on it is right, so corrections matter as much as new entries.

## Report a correction

Each resource page has a **Report a correction on GitHub** link that opens a pre-filled issue. In the issue, include:

- the page URL
- the claim that is wrong
- a link to the **primary source** that shows the right value: the provider's own license, pricing, rate-limit or download page, not a blog post or a mirror

## Suggest a resource

Use the [submit page](https://modelshelf.vercel.app/submit/) or open an issue. A resource qualifies when all of these are true:

- It is free to use without entering a credit card. A free trial that expires is not a free tier.
- It has a public source page and documentation.
- It can reach a sensible baseline on free hardware (a laptop CPU or a free Colab T4), or has a clear subset or pretrained route.
- Its license or terms can be read and quoted.

## Add or update an entry yourself

Follow **Adding or updating datasets and APIs** in the [README](README.md#adding-or-updating-datasets-and-apis). In short:

1. Add the entry to `src/data/directoryData.ts`, including a concise `seoTitle` ("Name: what it is", under about 50 characters).
2. Check the license on the primary source: the authors' or provider's own page, not a mirror or re-upload. If they state none, write "No license specified". Add `commercial-ok` only when the terms clearly allow a paid product, because downloadable does not mean commercially usable.
3. Record access exactly: no account, a free account, a free API key, or local. Add `no-card` only if the free tier never asks for a payment method.
4. Set `pricing`: `free-download`, `free-tier` (permanent, within limits), `pay-as-you-go` or `local`. A free trial does not qualify for the directory.
5. Fill in `verification`: the date, the primary sources you read, and `status: 'verified'` only if license, access, size and sample count all matched. Otherwise use `'partial'` and list what is still `open`.
6. Run the starter snippet. Never invent sample counts, sizes or benchmark numbers. Give a baseline a `baselineSource` when it comes from a paper or official page; otherwise it is shown as a rough guide.
7. Run `npm run verify` and open a pull request.

Guides are Markdown files in `src/content/guides/`. Write any fact taken from a primary source as a `> **Checked fact:** … [source](url)` blockquote, and keep the rest clearly as guidance. `npm test` fails if a checked fact has no link or a guide links to an unknown resource.

## Verification standard

- A link returning HTTP 200 does not count as verified.
- An entry is verified only when a person has read its license, access and limit pages and compared them with the entry.
- Changes to a license, price or access requirement need a second look in the pull request review.
- After a full re-check, update `LAST_CHECKED` in `directoryData.ts`.
- The latest full re-check and its per-entry results are recorded in [`docs/resource-verification.md`](docs/resource-verification.md).

## Contact

Open an issue on [GitHub](https://github.com/sama-moataz/ModelShelf/issues). That is the maintainers' contact channel.
