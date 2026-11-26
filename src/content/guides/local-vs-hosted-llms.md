---
title: 'Local LLMs vs Hosted AI APIs: How to Choose'
h1: 'Choosing between local AI models and hosted AI APIs'
description: 'When to run an open model locally with Ollama and when to call a hosted API: privacy, cost, quality, speed, rate limits and offline use, with one client for both.'
summary: 'Run a model locally when privacy, offline use or unlimited iteration matter more than quality; call a hosted API when you need a stronger model or have weak hardware. With an OpenAI-compatible client, you can switch between the two by changing one URL.'
order: 6
checked: '2026-11-26'
resources: ['ollama-local', 'groq-api', 'gemini-api', 'openrouter-free', 'hugging-face-inference']
sources:
  - label: 'Ollama: OpenAI compatibility'
    url: 'https://docs.ollama.com/api/openai-compatibility'
  - label: 'Ollama LICENSE (MIT)'
    url: 'https://github.com/ollama/ollama/blob/main/LICENSE'
  - label: 'Gemini API additional terms of service'
    url: 'https://ai.google.dev/gemini-api/terms'
  - label: 'Groq OpenAI compatibility'
    url: 'https://console.groq.com/docs/openai'
---

## The short version

| What matters most | Local (e.g. Ollama) | Hosted free tier (e.g. Groq, Gemini) |
| --- | --- | --- |
| Private or personal data | Stays on your machine | Leaves your machine; read the data-use terms |
| Works without internet | Yes | No |
| Answer quality | Limited by the model size your RAM allows | Larger models than a laptop can run |
| Speed | Depends on your CPU or GPU | Usually fast |
| Limits | None but your hardware | Per-minute and per-day caps |
| Setup | Install plus a multi-gigabyte model download | A key and one HTTP call |
| Cost | Your hardware and electricity | Free within limits; pay beyond |

## When local wins

Choose a local model when the data is private (student records, medical notes, anything you promised not to share), when the demo must work without a network, or when you need to iterate on prompts thousands of times without hitting a quota. [Ollama](/resources/ollama-local/) downloads quantized open models and serves them on `localhost`.

> **Checked fact:** Ollama's software is MIT-licensed. The models you pull keep their own licenses, which can restrict commercial use or require attribution, so check each one. [Ollama LICENSE](https://github.com/ollama/ollama/blob/main/LICENSE)

Size the model to your memory: weights take about *parameters × bits ÷ 8* bytes, so a 7-billion-parameter model at 4 bits needs roughly 3.5 GB for weights alone, plus working memory. On an 8 GB laptop, models of 1–4 billion parameters are the comfortable range.

## When hosted wins

Choose a hosted API when you need better answers than a small local model gives, when your machine is old or a Chromebook, or when the project is a quick prototype. [Groq](/resources/groq-api/), [Gemini](/resources/gemini-api/) and [OpenRouter](/resources/openrouter-free/) all give a free key with no credit card.

Read the data-use terms before you send anything personal:

> **Checked fact:** Google's Gemini API terms say that for unpaid services, Google uses submitted content to provide and improve its products, and that "you may use only Paid Services when making API Clients available to users in the European Economic Area, Switzerland, or the United Kingdom." [Gemini API terms](https://ai.google.dev/gemini-api/terms)

## Use one client for both

Ollama and most hosted providers speak the same OpenAI-style API, so your code can switch with one setting. Develop against the local model with no quota, then point the same code at a hosted model for the demo, or keep local as the fallback when the venue Wi-Fi fails.

> **Checked fact:** Ollama exposes an OpenAI-compatible endpoint at `http://localhost:11434/v1/`, and Groq at `https://api.groq.com/openai/v1`. [Ollama docs](https://docs.ollama.com/api/openai-compatibility) · [Groq docs](https://console.groq.com/docs/openai)

```python
# pip install openai
import os
from openai import OpenAI

BACKENDS = {
    "local": dict(base_url="http://localhost:11434/v1/", api_key="ollama", model="llama3.2"),
    "groq": dict(base_url="https://api.groq.com/openai/v1", api_key=os.environ.get("GROQ_API_KEY", ""), model="openai/gpt-oss-20b"),
}

def ask(prompt, backend=os.environ.get("LLM_BACKEND", "local")):
    cfg = BACKENDS[backend]
    client = OpenAI(base_url=cfg["base_url"], api_key=cfg["api_key"])  # Ollama ignores the key
    resp = client.chat.completions.create(model=cfg["model"], messages=[{"role": "user", "content": prompt}], temperature=0)
    return resp.choices[0].message.content

print(ask("Explain a confusion matrix in two sentences."))
```

Model IDs change; take them from the provider's model list on the day you build.

## Compare them fairly

If the choice matters, measure it. Write 20–50 questions with expected answers, run them through both back ends at `temperature=0`, and score accuracy and seconds per answer. Keep these evaluation questions separate from the prompts you tune on, or you are testing on your training data.

## Common mistakes

- Pulling the largest model that fits on disk, not in RAM, and watching the laptop swap.
- Sending personal data to a free hosted tier whose terms allow it to be used for product improvement.
- Hard-coding one hosted model ID that gets retired a month later.
- Assuming the MIT license of the runtime covers the model.
