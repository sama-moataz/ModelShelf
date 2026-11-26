---
title: 'How to Run ML Projects on a Laptop CPU'
h1: 'How to run machine-learning projects on a laptop CPU'
description: 'What a laptop CPU can train, how to estimate memory before you load data, and the settings that make scikit-learn and PyTorch fast without a GPU.'
summary: 'A laptop CPU trains classic models on tables and text, small CNNs on small images, and runs small quantized LLMs. Estimate memory first, use gradient boosting and all your cores, and subsample while you iterate.'
order: 2
checked: '2026-11-26'
resources: ['california-housing', 'palmer-penguins', 'fashion-mnist', 'ag-news', 'ollama-local']
sources:
  - label: 'scikit-learn: HistGradientBoostingClassifier'
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html'
  - label: 'Ollama LICENSE (MIT) and model licenses'
    url: 'https://github.com/ollama/ollama/blob/main/LICENSE'
---

## What a laptop CPU is good at

A modern laptop CPU is a capable machine-learning computer for the right jobs:

- **Tabular data** of any size that fits in memory: linear models, random forests and gradient boosting.
- **Text with classic features**: TF-IDF plus logistic regression trains on a hundred thousand short documents in about a minute.
- **Small images**: a small CNN on 28×28 images such as [Fashion-MNIST](/resources/fashion-mnist/).
- **Inference** with a small pretrained model, including a quantized LLM through [Ollama](/resources/ollama-local/).
- **Calling hosted APIs**, where the work happens on someone else's servers.

It struggles with training anything large from scratch: transformers, ResNets on full-size images, speech models. That is where a [free Colab GPU](/guides/google-colab-free-tier/) helps.

## Estimate memory before you load anything

Running out of RAM freezes a laptop. The arithmetic takes ten seconds:

- A `float32` number takes 4 bytes. 60,000 images of 28×28 pixels is 60,000 × 784 × 4 bytes ≈ 188 MB.
- A pandas DataFrame of mixed columns often takes several times its CSV size in memory. Check with `df.memory_usage(deep=True).sum()`.
- An LLM's weights take about *parameters × bits ÷ 8* bytes: a 3-billion-parameter model at 4 bits is about 1.5 GB, plus working memory on top.

```python
import numpy as np

n, h, w = 60_000, 28, 28
print(f"{n * h * w * np.dtype('float32').itemsize / 1e6:.0f} MB as float32")  # ≈ 188 MB
print(f"{n * h * w * np.dtype('uint8').itemsize / 1e6:.0f} MB as uint8")      # ≈ 47 MB: convert per batch
```

## Pick models that are fast on a CPU

For tables, start with gradient boosting on histograms. It handles missing values without imputation and is the strongest default for tabular data.

> **Checked fact:** scikit-learn's HistGradientBoostingClassifier "is much faster than GradientBoostingClassifier for big datasets (n_samples >= 10 000)" and "has native support for missing values (NaNs)". [scikit-learn docs](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.HistGradientBoostingClassifier.html)

```python
from time import perf_counter
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import cross_val_score

X, y = fetch_california_housing(return_X_y=True)
t = perf_counter()
scores = cross_val_score(HistGradientBoostingRegressor(), X, y, cv=5, scoring="r2", n_jobs=-1)
print(f"R² {scores.mean():.3f}, {perf_counter() - t:.1f} s for 5 folds")
```

`n_jobs=-1` runs the folds on all your cores. Time your own run: it is the only benchmark that matters for your machine.

## Make neural networks bearable on a CPU

- Keep the model small: one or two convolutional layers for 28×28 images.
- Load the whole dataset into memory once as NumPy arrays or tensors. Re-reading image files every epoch is often slower than the training itself.
- Use `float32`. Half precision rarely speeds up CPU training.
- Batch sizes of 64–256 use the CPU's vector units well. Try a few and time one epoch.
- In PyTorch, `torch.set_num_threads()` controls how many cores one process uses; leave a core free if the laptop becomes unresponsive.

## Iterate on a slice, finish on everything

Most of a project is debugging the pipeline, not training. Work on 10–20% of the data until the whole notebook runs end to end, then run the full set once. Fix the random seed so the slice is the same every time.

## Running a small LLM locally

[Ollama](/resources/ollama-local/) serves quantized open models on `localhost` with no key. On a laptop, start with a model of 1–4 billion parameters and move up only if the answers are too weak and your RAM allows it.

> **Checked fact:** Ollama's own code is MIT-licensed ("MIT License Copyright (c) Ollama"). That license covers the software, not the models you download through it, which keep their own licenses. [Ollama LICENSE](https://github.com/ollama/ollama/blob/main/LICENSE)

## Common mistakes

- Loading a dataset as `float64` by default and doubling its memory.
- Training a deep network when gradient boosting would have been better and a hundred times faster.
- Leaving a browser with 40 tabs open during training. RAM is shared.
- Judging speed from the first epoch, which includes loading and warm-up.
