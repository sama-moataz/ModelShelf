# External credibility: shortlist and drafts

Nothing in this file has been sent or submitted. Each item is a draft for a maintainer to review, adapt and send by hand, one destination at a time. Contribution rules below were read on 26 November 2026; re-read them on the day you submit, because they change.

Ground rules:

- Submit only where ModelShelf genuinely fits the list's scope. One submission per destination; no follow-up chasing.
- No paid links, link exchanges, mass email or automated posting.
- Describe ModelShelf exactly as it is: a curated index of 30 resources, not a dataset or an API itself. Never claim endorsements, traffic or rankings.
- Before pitching anything, set the GitHub repository's description and topics (below), because reviewers click through to the repo.

## Shortlist, best fit first

| # | Destination | Why it fits | Rules (as read 26 Nov 2026) | Action |
| --- | --- | --- | --- | --- |
| 1 | [academic/awesome-datascience](https://github.com/academic/awesome-datascience) | Has *Datasets* and *Free Courses / Tutorials* sections aimed at learners, which matches ModelShelf's student audience. | Contributions welcome via its `CONTRIBUTING.md`: one pull request adding one line, in the existing format and order. | Draft A |
| 2 | Hackathon starter guides (MLH member events, Devpost hackathon pages, university hackathons) | The [hackathons page](https://modelshelf.vercel.app/datasets-for-hackathons/) and keyless APIs solve a real setup problem for teams. | Each organiser decides; there is no shared process. | Draft C, one organiser at a time |
| 3 | Course resource pages (university ML courses, bootcamps) | The [beginner path](https://modelshelf.vercel.app/datasets-for-beginners/), [school projects page](https://modelshelf.vercel.app/datasets-for-school-projects/) and [licenses guide](https://modelshelf.vercel.app/guides/dataset-licenses/) are useful to instructors. | Contact the instructor or TA directly. | Draft D |
| 4 | [josephmisiti/awesome-machine-learning](https://github.com/josephmisiti/awesome-machine-learning) | Weak to moderate: the list is mainly libraries and tools, but has learning-resource sections. | Since April 2026 the maintainer asks contributors to **email first** to show they are human, because of LLM-generated pull requests. Do not open an unsolicited PR. | Draft B (email only) |
| 5 | [awesomedata/awesome-public-datasets](https://github.com/awesomedata/awesome-public-datasets) | **Weak.** It lists primary data sources; ModelShelf is an index of other sources. | The README is generated; contributions go to [apd-core](https://github.com/awesomedata/apd-core/blob/master/CONTRIBUTING.md) as metadata files. | Do not submit ModelShelf itself. |
| 6 | Student communities (subreddits, course Discords, study groups) | Good when someone asks a question a guide answers. | Every community has its own self-promotion rules; they were **not** checked here. Read them first. | Answer the question; link one page only if it helps |

## GitHub repository description and topics

- **Description:** `Curated open datasets and APIs for student AI/ML projects, with licenses, sign-up needs, costs, hardware fit and starter code, checked against primary sources.`
- **Website:** `https://modelshelf.vercel.app`
- **Topics:** `datasets`, `machine-learning`, `free-api`, `students`, `open-data`, `education`, `hackathon`, `astro`

## Draft A: awesome-datascience pull request

Line to add, in the section that fits best (check the current headings; *Datasets* is the likely one), matching the list's existing format:

```markdown
* [ModelShelf](https://modelshelf.vercel.app/) - Curated open datasets and APIs for student ML projects, each with its license, sign-up requirement, cost, hardware fit and starter code.
```

Pull request description:

```markdown
Adds ModelShelf to the Datasets section.

ModelShelf is a free, open-source directory (MIT, https://github.com/sama-moataz/ModelShelf) of 20 open datasets and 10 APIs for students. Each entry records the license as the original authors state it, whether you need an account, key or card, which free hardware it runs on, and a starter snippet. Entries were checked against primary sources on 26 Nov 2026, and each page lists the sources read.

It is an index of other resources, not a dataset itself. If it fits a different section better, I'm happy to move it.
```

## Draft B: email to the awesome-machine-learning maintainer

Send from a personal address, as the project's maintainer, and only once.

```text
Subject: Question before a PR: ModelShelf (student dataset/API directory)

Hi,

I maintain ModelShelf (https://modelshelf.vercel.app/, code at https://github.com/sama-moataz/ModelShelf), a small open-source directory of 20 open datasets and 10 APIs for students (all but one API free to call). Each entry gives the license as the original authors state it, sign-up and card requirements, which free hardware it runs on, and starter code; entries were checked against primary sources this month.

Your README asks contributors to get in touch before opening a pull request. Would a one-line entry in a learning-resources section be in scope? If not, no problem at all, and thanks for maintaining the list.

[Your name]
```

## Draft C: hackathon organiser

```text
Subject: A free resource list for your participants' setup

Hi [organiser],

Ahead of [event], you might find this useful for the participant guide: https://modelshelf.vercel.app/datasets-for-hackathons/

It lists free datasets and APIs that work in a weekend: APIs that need no key, LLM APIs with a free key and no credit card, an offline fallback for bad Wi-Fi, and which ones allow commercial use if a team keeps going. It's free and open source, with no sign-up and no ads.

If it doesn't fit your guide, no reply needed.

[Your name]
```

## Draft D: course instructor or TA

```text
Subject: Dataset list for [course] projects

Hi [name],

Students often lose time picking a dataset that fits their laptop and has a usable license. I maintain a free, open-source list that might help with project selection:

- A beginner path through nine datasets, in order: https://modelshelf.vercel.app/datasets-for-beginners/
- Datasets and APIs that need no sign-up, for school projects: https://modelshelf.vercel.app/datasets-for-school-projects/
- A short guide to dataset licenses: https://modelshelf.vercel.app/guides/dataset-licenses/

Each entry states its license as the authors give it and links the original source. Corrections are welcome via GitHub issues.

[Your name]
```

## After submitting

Log each submission (date, destination, link, outcome) in the GEO log in [`indexing-and-monitoring.md`](indexing-and-monitoring.md), so nobody submits to the same place twice.
