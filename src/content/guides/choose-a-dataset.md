---
title: 'How to Choose a Dataset for an ML Project'
h1: 'How to choose a dataset for an AI or ML project'
description: 'Six checks to run before you commit to a dataset: task fit, size against your hardware, license, access, official splits and a published baseline.'
summary: 'Start from the question, then check six things in this order: task fit, size against your hardware, license, access, official splits and whether a published baseline exists.'
order: 1
checked: '2026-11-26'
resources: ['iris', 'titanic', 'imdb-reviews', 'free-spoken-digit', 'esc-50', 'speech-commands', 'hf-datasets-server']
sources:
  - label: 'Hugging Face Hub docs: gated datasets'
    url: 'https://huggingface.co/docs/hub/datasets-gated'
  - label: 'Large Movie Review Dataset page (Maas et al.)'
    url: 'https://ai.stanford.edu/~amaas/data/sentiment/'
  - label: 'ESC-50 README'
    url: 'https://github.com/karolpiczak/ESC-50'
---

## Start from the question, not the dataset

"I want to use COCO" is not a project. "Can a small model tell whether a photo contains a dog, on my laptop, in a weekend?" is. Write the question down in one sentence, including the input (images, text, a table, audio), the output (a label, a number, a box) and the hardware you have. Every check below is easier once that sentence exists.

## The six checks, in order

Run them in this order. Each one is cheaper than the next, and failing an early check saves you the later ones.

1. **Task fit.** Do the labels answer your question? A sentiment dataset labelled positive/negative cannot teach "angry vs. sad". Read five random rows before anything else.
2. **Size against your hardware.** Compare the download size and sample count with what you have. As a rule of thumb, a laptop CPU handles tables, MNIST-sized images and TF-IDF text models; fine-tuning a pretrained image or language model wants a GPU such as a free Colab session; anything in the tens of gigabytes needs a subset. Each ModelShelf entry carries one of these [hardware tiers](/hardware/).
3. **License.** Find the license on the original authors' page, not on a mirror. "No license specified" is fine for learning and coursework but is not permission to ship a product. The [licenses guide](/guides/dataset-licenses/) explains the common ones.
4. **Access.** Can you, and anyone checking your work, download it without an account, an approval step or a payment card?
5. **Official splits and leakage traps.** Use the published train/validation/test split if one exists, and look for columns that give away the answer.
6. **A published baseline.** A number from the dataset's own paper or page tells you whether your result is reasonable.

> **Checked fact:** gated datasets on the Hugging Face Hub require access to be requested, and "you must be logged in to a Hugging Face user account" to do so. A dataset that needs approval can stall a project for days. [Hugging Face docs](https://huggingface.co/docs/hub/datasets-gated)

## What leakage looks like in real datasets

Leakage means information about the answer sneaks into the inputs, so your score is better than the model really is. It is the most common reason a student project's number is wrong.

- In [Titanic](/resources/titanic/), the `boat` and `body` columns record what happened after the sinking. A model that sees them is not predicting survival.
- In [ESC-50](/resources/esc-50/), several clips are cut from the same original recording. A random split puts pieces of one recording on both sides.
- In speech datasets, the same speaker in train and test inflates accuracy. [Speech Commands](/resources/speech-commands/) ships validation and test lists that keep each speaker on one side.

> **Checked fact:** the ESC-50 authors keep clips from one source file together: "fragments from the same original source file are contained in a single fold", and the README warns about potential information leakage. [ESC-50 README](https://github.com/karolpiczak/ESC-50)

## Look before you download

For anything bigger than a few hundred megabytes, look at the rows first. The [Dataset Viewer API](/resources/hf-datasets-server/) returns the first 100 rows of a public Hugging Face dataset with one request and no key:

```bash
curl -s "https://datasets-server.huggingface.co/first-rows?dataset=stanfordnlp/imdb&config=plain_text&split=train" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['features']); print(d['rows'][0]['row'])"
```

Check three things in that output: the column names match the paper, the labels mean what you think, and the text or image looks like the inputs you care about.

## Find the baseline before you train

A baseline turns "83%" into a judgement. Look for it in the dataset paper or on the authors' page, and also compute the trivial one yourself: what does predicting the most common class score?

> **Checked fact:** the IMDB dataset page notes that "the original 2011 paper reported 88.89%" test accuracy, and that modern transformer models reach 95–97%. A TF-IDF model in that range is working; one at 70% has a bug. [Large Movie Review Dataset](https://ai.stanford.edu/~amaas/data/sentiment/)

## A worked example: a sound classifier on a laptop

Question: "Can I build a sound classifier on my laptop for a class project?" Three audio datasets in the directory fit different answers:

| If you want… | Pick | Why |
| --- | --- | --- |
| The smallest possible first project | [Free Spoken Digit](/resources/free-spoken-digit/) | Tiny, trains in seconds, CC BY-SA |
| Real-world sounds | [ESC-50](/resources/esc-50/) | 50 classes with predefined folds; non-commercial license |
| A wake-word demo | [Speech Commands](/resources/speech-commands/) | Large and CC BY 4.0, but a multi-gigabyte download |

The license column decides it if the project might become a product; the size column decides it if your laptop is the only machine you have. The table at the bottom of this page shows the current figures for each.

## Common mistakes

- Choosing the most famous dataset instead of the one that fits your hardware and deadline.
- Trusting the license field on a mirror or a re-upload. The hosting site is not the author.
- Shuffling and splitting time-series or grouped data at random.
- Reporting a score with no baseline next to it.
