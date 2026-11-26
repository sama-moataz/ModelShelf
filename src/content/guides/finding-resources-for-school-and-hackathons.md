---
title: 'Finding Datasets and APIs for School and Hackathons'
h1: 'Finding datasets and APIs for school projects and hackathons'
description: 'A ten-minute checklist for judging any dataset or API under a deadline, where to look beyond ModelShelf, red flags to avoid and a data note for your README.'
summary: 'Under a deadline, judge any resource in ten minutes: who made it, the license, access, size, documentation and limits. Prefer sources that name their authors and license, avoid re-uploads with no provenance, and write down what you used.'
order: 7
checked: '2026-11-26'
resources: ['palmer-penguins', 'titanic', 'mnist', 'frankfurter', 'groq-api', 'ollama-local']
sources:
  - label: 'UCI Machine Learning Repository (license shown per dataset)'
    url: 'https://archive.ics.uci.edu/dataset/53/iris'
  - label: 'OpenML dataset 40945 (Titanic)'
    url: 'https://www.openml.org/d/40945'
  - label: 'Hugging Face Hub docs: gated datasets'
    url: 'https://huggingface.co/docs/hub/datasets-gated'
---

ModelShelf's curated lists are a starting point: [datasets for school projects](/datasets-for-school-projects/) and [datasets and APIs for hackathons](/datasets-for-hackathons/). This guide is about judging anything else you find, quickly.

## Where to look

- **Dataset repositories with provenance**: the UCI Machine Learning Repository and OpenML record who made a dataset, and UCI shows a license on each dataset page.
- **The Hugging Face Hub**: huge and searchable, but cards are written by uploaders. Check whether a dataset is gated before you plan around it.
- **The original authors**: a paper's "data availability" section or the lab's page is the most reliable source of a license.
- **Government open-data portals and public APIs**: often generous licenses and real-world topics, which make good school projects.

> **Checked fact:** UCI states the license on each dataset page; for Iris it reads "This dataset is licensed under a Creative Commons Attribution 4.0 International (CC BY 4.0) license." OpenML, by contrast, shows a licence field filled in by the platform; for Titanic it says "Public", which is not a license. [UCI Iris](https://archive.ics.uci.edu/dataset/53/iris) · [OpenML 40945](https://www.openml.org/d/40945)

## The ten-minute check

Run this on any candidate before you commit. If you cannot answer a question in a couple of minutes, that is itself the answer.

1. **Who made it?** A named author, lab or organisation. Anonymous re-uploads are a warning sign.
2. **License or terms?** Found on the author's own page. Note whether commercial use is allowed if the project could continue. ([Licenses guide](/guides/dataset-licenses/))
3. **Access?** No account, a free account, a key, an approval step or a payment card. For a hackathon, anything with an approval step is too slow.
4. **Size and hardware?** Download size, and whether your laptop or a free Colab session can train on it. ([Laptop CPU guide](/guides/ml-on-a-laptop-cpu/))
5. **Documentation?** Column meanings, label definitions and the official split.
6. **Limits (APIs)?** Per-minute and per-day caps, and what happens when you exceed them. ([Rate limits guide](/guides/api-keys-and-rate-limits/))
7. **Freshness?** When it was last updated, and whether the API still answers today. Run one request before you design around it.

## Red flags

- A license on a mirror that the original authors never state. ModelShelf found exactly this with [MNIST](/resources/mnist/): the Hugging Face card says MIT; the authors say nothing.
- "Free" that turns out to be a trial, or a free tier that asks for a payment card up front.
- Scraped personal data (social media profiles, faces, health records) with no consent or license. Avoid it for school work, whatever its popularity.
- An API with no documentation page, or one whose example requests fail.

## Budget your time

For a **school project** with weeks to go, spend an evening choosing: it is the decision that most affects your grade. Prefer data your teacher can download without an account, and cite it the way the authors ask.

For a **hackathon**, cap the search at an hour. Pick one dataset or API you have verified with a real request, one LLM API with no card ([Groq](/resources/groq-api/) is a common choice), and a fallback that works offline ([Ollama](/resources/ollama-local/)). Cache every API response your demo relies on.

## Write a data note

Put this at the top of your README or report. Teachers, judges and future you will all ask these questions:

```markdown
## Data
- **Source:** Palmer Penguins, Gorman, Williams & Fraser (2014), via the palmerpenguins R package
  (https://github.com/allisonhorst/palmerpenguins), downloaded 2026-11-26
- **License:** CC0 1.0
- **Size:** 344 rows; 333 after dropping rows with missing values
- **Split:** 80/20 stratified by species, random_state=42
- **Known issues:** 11 rows have no recorded sex
```

## Common mistakes

- Spending half a hackathon choosing data instead of building.
- Using a dataset nobody on the team has opened, then discovering the labels mean something else.
- Forgetting the citation until the night before the deadline.
- Trusting an API that worked yesterday without checking it on demo day.
