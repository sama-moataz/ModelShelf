---
title: 'Dataset Licenses and Commercial Use, Explained'
h1: 'Understanding dataset licenses and commercial-use restrictions'
description: 'What CC0, CC BY, CC BY-SA, CC BY-NC, MIT and "no license specified" mean for coursework, a portfolio and a paid product, with real examples.'
summary: 'Read the license on the original authors’ page, not a mirror. CC0 and public domain have no conditions, CC BY needs credit, SA needs the same license on what you share, NC rules out paid products, and "no license specified" grants nothing beyond what the authors say.'
order: 4
checked: '2026-11-26'
resources: ['palmer-penguins', 'iris', 'squad-2', 'esc-50', 'mnist', 'oxford-iiit-pet', 'coco-2017', 'open-meteo']
sources:
  - label: 'Creative Commons: CC BY 4.0 deed'
    url: 'https://creativecommons.org/licenses/by/4.0/'
  - label: 'Creative Commons: CC BY-NC 4.0 deed'
    url: 'https://creativecommons.org/licenses/by-nc/4.0/'
  - label: 'Creative Commons: CC0 1.0 deed'
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  - label: 'The MIT License (Open Source Initiative)'
    url: 'https://opensource.org/license/mit'
  - label: 'COCO terms of use'
    url: 'https://github.com/cocodataset/cocodataset.github.io/blob/master/dataset/termsofuse.htm'
  - label: 'Open-Meteo terms of use'
    url: 'https://open-meteo.com/en/terms'
---

This guide explains what common licenses say. It is not legal advice; for a product with real money or users behind it, ask someone qualified.

## The licenses you will meet most

| License | Coursework and research | Paid product | What you must do |
| --- | --- | --- | --- |
| CC0 / public domain | Yes | Yes | Nothing required (crediting is still good practice) |
| CC BY | Yes | Yes | Credit the creator and link the license |
| CC BY-SA | Yes | Yes | Credit, and share adapted data under the same license |
| CC BY-NC | Yes | No | Credit; no commercial use |
| MIT | Yes | Yes | Keep the copyright and license notice |
| No license specified | Usually tolerated | Not permitted by default | Ask the authors |

> **Checked fact:** CC BY 4.0 lets you share and adapt material "for any purpose, even commercially", provided you give appropriate credit; the NonCommercial variant forbids commercial use; CC0 is a waiver of rights as far as the law allows. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) · [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

> **Checked fact:** the MIT license grants broad rights on the condition that "the above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software." [MIT License](https://opensource.org/license/mit)

## "No license" does not mean "free for anything"

When the authors state no license, copyright law's default applies: you have no explicit permission beyond what they say. Many classic benchmarks are in this state. Their authors usually only ask for a citation, and they are used everywhere for teaching and research. That is a practical norm, not a license. Do not build a commercial product on them without asking.

On ModelShelf, entries such as [MNIST](/resources/mnist/) and [IMDB](/resources/imdb-reviews/) read "No license specified" for exactly this reason.

## The hosting site is not the author

A license field on a mirror, a Kaggle page or a Hugging Face card is a claim by whoever uploaded the copy. Always trace it back to the original authors.

> **Checked fact (ModelShelf's own check):** the Hugging Face card for MNIST lists the MIT license, but the original authors' page states no license at all, so ModelShelf lists it as "No license specified" and does not mark it as commercial-OK. [MNIST entry](/resources/mnist/)

## Data and images can have different licenses

Large datasets are often assembled from material with its own rights. Read both layers.

> **Checked fact:** COCO's annotations "are licensed under a Creative Commons Attribution 4.0 License", while "use of the images must abide by the Flickr Terms of Use", and each image carries its own license. [COCO terms of use](https://github.com/cocodataset/cocodataset.github.io/blob/master/dataset/termsofuse.htm)

[ESC-50](/resources/esc-50/) is similar: CC BY-NC as a whole, with each clip keeping its own Freesound license. [Oxford-IIIT Pet](/resources/oxford-iiit-pet/) goes further: its web page and its download's README give conflicting terms, so ModelShelf marks it partly verified and treats it as research-only.

## APIs: the terms of service are the license

For an API, what you can do with the responses is set by its terms, and the free tier often has different terms from the paid one.

> **Checked fact:** Open-Meteo's free API is for non-commercial use, under 10,000 calls a day, while its data is licensed CC BY 4.0. A paid plan covers commercial use. [Open-Meteo terms](https://open-meteo.com/en/terms)

## What about a model trained on the data?

Whether a trained model is an "adaptation" of its training data is legally unsettled and varies by country. The cautious, common practice: treat a model trained on non-commercial data as non-commercial, keep attribution for CC BY data, and check before shipping. If a school project might become a startup, choose commercially usable data from the start; the [commercial-use collection](/access/open-commercial/) lists them.

## Keep a data inventory

Ten minutes now answers most questions later. Add this table to your README:

```markdown
| Dataset | Version / date | License | Source URL | How it is used |
| --- | --- | --- | --- | --- |
| Palmer Penguins | seaborn copy, downloaded 2026-11-26 | CC0 1.0 | https://github.com/allisonhorst/palmerpenguins | Training and test data |
```

## Common mistakes

- Reading the badge or summary and not the actual license text.
- Assuming "free to download" means "free to use commercially".
- Dropping the attribution because the credit line looks untidy in an app.
- Mixing a share-alike dataset into a dataset you want to release under a different license.
