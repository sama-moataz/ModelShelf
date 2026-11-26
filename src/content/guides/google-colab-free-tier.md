---
title: 'Using Google Colab Effectively for Free'
h1: 'How to use Google Colab effectively on the free tier'
description: 'What the free Colab tier does and does not guarantee, and how to keep data on local disk, checkpoint to Drive and resume training after a disconnect.'
summary: 'Free Colab gives you a GPU when one is available, for at most 12 hours and often less, with limits Google does not publish. Plan for disconnects: keep data on local disk, checkpoint to Drive and make training resumable.'
order: 3
checked: '2026-11-26'
resources: ['cifar-10', 'squad-2', 'speech-commands', 'oxford-iiit-pet', 'librispeech']
sources:
  - label: 'Google Colab FAQ'
    url: 'https://research.google.com/colaboratory/faq.html'
---

## What the free tier promises, and what it does not

Colab is a hosted Jupyter notebook with an optional GPU. The free tier is generous, but it is explicitly best-effort. Read the facts below before you plan a long training run around it.

> **Checked fact:** "In the version of Colab that is free of charge notebooks can run for at most 12 hours, depending on availability and your usage patterns." Runtimes also time out when idle. [Colab FAQ](https://research.google.com/colaboratory/faq.html)

> **Checked fact:** Colab says that "usage limits as well as idle timeout periods, maximum VM lifetime, GPU types available, and other factors vary over time", that it "does not publish these limits", and that on the free tier "access to expensive resources like GPUs is heavily restricted". [Colab FAQ](https://research.google.com/colaboratory/faq.html)

ModelShelf's "Free Colab T4" tier means a dataset is sized for one session on the T4 GPU that free sessions typically get. It is a planning target, not a guarantee: some days you will get no GPU at all.

## Check what you got

After choosing *Runtime → Change runtime type → GPU*, confirm it in the first cell, so a CPU-only session does not silently take ten times longer:

```python
import torch
print(torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU only")
```

```bash
!nvidia-smi --query-gpu=name,memory.total --format=csv
```

## Keep data on the local disk

Google Drive is convenient for saving results but slow for reading thousands of small files during training. Copy or download the dataset to the session's local disk (`/content`) at the start of each session, and read from there. Archive many small files into one `.zip` or `.tar` on Drive, copy that one file, then extract it locally.

## Make training resumable

Assume the session will disconnect. Save a checkpoint to Drive at the end of every epoch, and start every run by loading the latest one if it exists:

```python
import os, torch
from google.colab import drive

drive.mount("/content/drive")
CKPT = "/content/drive/MyDrive/project/checkpoint.pt"
os.makedirs(os.path.dirname(CKPT), exist_ok=True)

start_epoch = 0
if os.path.exists(CKPT):
    state = torch.load(CKPT)
    model.load_state_dict(state["model"])
    optimizer.load_state_dict(state["optimizer"])
    start_epoch = state["epoch"] + 1

for epoch in range(start_epoch, num_epochs):
    train_one_epoch(model, optimizer)
    torch.save({"model": model.state_dict(), "optimizer": optimizer.state_dict(), "epoch": epoch}, CKPT)
```

`model`, `optimizer`, `num_epochs` and `train_one_epoch` are your own. Write to a temporary file and rename it if you want to be safe against a disconnect in the middle of a save.

## Use the GPU well

- **Mixed precision.** With `torch.autocast("cuda", dtype=torch.float16)` (or `fp16=True` in the Hugging Face Trainer), most models train faster and use less memory on a T4.
- **Batch size.** Start moderate. If you run out of memory, halve the batch and use gradient accumulation to keep the effective batch size.
- **Data loading.** If the GPU sits idle between batches, the bottleneck is loading. Set `num_workers` in the DataLoader to the CPU count the runtime reports (`os.cpu_count()`).
- **Debug small.** Run one epoch on 5–10% of the data before the full run, so a typo does not cost you an hour of quota.

## Keep the notebook reproducible

Pin the library versions you used (`pip install transformers==…` in the first cell), fix random seeds, and write the dataset version or download date into the notebook. Colab's preinstalled packages change over time, so a notebook that worked last term may not run unchanged today.

## Common mistakes

- Training straight from files on Drive and blaming the GPU for being slow.
- No checkpoints, so a disconnect at hour three loses everything.
- Leaving a finished session connected, which uses up the limits you need tomorrow.
- Assuming the session has a GPU without checking.
