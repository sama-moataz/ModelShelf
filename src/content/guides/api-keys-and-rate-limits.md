---
title: 'API Keys, Rate Limits and Free Tiers Explained'
h1: 'Understanding API keys, authentication, rate limits and free tiers'
description: 'What an API key is, how to keep it out of your code, how rate limits and HTTP 429 work, and how to tell a permanent free tier from a trial or credits.'
summary: 'An API key identifies you to a provider; keep it in an environment variable, never in code. Free tiers are capped per minute and per day, and HTTP 429 means "slow down". Read whether "free" means a permanent tier, a trial or credits before you build on it.'
order: 5
checked: '2026-11-26'
resources: ['open-meteo', 'wikipedia-rest', 'nasa-apod', 'groq-api', 'gemini-api', 'openrouter-free', 'hugging-face-inference']
sources:
  - label: 'RFC 6585, section 4: 429 Too Many Requests'
    url: 'https://www.rfc-editor.org/rfc/rfc6585.html#section-4'
  - label: 'OpenRouter API limits'
    url: 'https://openrouter.ai/docs/api-reference/limits'
  - label: 'Wikimedia User-Agent policy'
    url: 'https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy'
  - label: 'api.nasa.gov authentication and rate limits'
    url: 'https://api.nasa.gov/assets/html/authentication.html'
  - label: 'Hugging Face Inference Providers pricing'
    url: 'https://huggingface.co/docs/inference-providers/pricing'
---

## What an API key is

An API key is a secret string that tells the provider who is calling. It lets them count your requests against your limits, bill you if you are on a paid plan, and switch you off if you misuse the service. Anyone who has your key can spend your quota or your money, so treat it like a password.

Some APIs need no key at all. [Open-Meteo](/resources/open-meteo/) and the [Wikipedia REST API](/resources/wikipedia-rest/) identify you by IP address and User-Agent instead. That is convenient, but the limits still apply. See [free APIs without an API key](/free-apis-without-api-key/).

> **Checked fact:** on Wikimedia sites, "if you don't supply a User-Agent header, or you supply an empty or generic one, your request will fail with an HTTP 403 error." [Wikimedia User-Agent policy](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy)

## Keep keys out of your code

Put the key in an environment variable and read it at runtime. In a project folder, a `.env` file listed in `.gitignore` keeps it out of Git:

```bash
# .env  (never commit this file)
GROQ_API_KEY=gsk_your_key_here

# .gitignore
.env
```

```python
import os
key = os.environ["GROQ_API_KEY"]  # fails loudly if the key is missing, instead of sending an empty one
```

In Colab, use the *Secrets* panel (the key icon) rather than pasting the key into a cell. If a key ever reaches a public repository or a shared notebook, revoke it in the provider's console and create a new one; deleting the commit is not enough.

## How rate limits work

Providers cap how fast and how much you can call: requests per minute, requests per day, and for LLM APIs, tokens per minute and per day. When you go over, the server answers with status 429.

> **Checked fact:** HTTP 429 "Too Many Requests" means the user "has sent too many requests in a given amount of time", and the response "MAY include a Retry-After header indicating how long to wait before making a new request." [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585.html#section-4)

Some published limits from the directory, read on 26 Nov 2026:

> **Checked fact:** OpenRouter's free (`:free`) models allow 20 requests a minute and 50 a day, or 1,000 a day once you have bought at least 10 credits. NASA's shared `DEMO_KEY` allows 30 requests an hour and 50 a day per IP address. [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits) · [api.nasa.gov](https://api.nasa.gov/assets/html/authentication.html)

Other providers, such as [Groq](/resources/groq-api/) and [Gemini](/resources/gemini-api/), show your exact free-tier limits only inside their console, per model. Check them there before a demo.

## Handle 429 properly

Wait and retry, honouring `Retry-After` when the server sends it, and give up after a few tries:

```python
import time, requests

def get_with_backoff(url, headers=None, tries=4, **params):
    for attempt in range(tries):
        r = requests.get(url, headers=headers, params=params, timeout=10)
        if r.status_code != 429:
            r.raise_for_status()
            return r.json()
        wait = int(r.headers.get("Retry-After", 2 ** attempt))  # 1, 2, 4, 8 s if no hint
        time.sleep(wait)
    raise RuntimeError(f"rate limited {tries} times; slow down or cache")
```

Better still, avoid the 429 in the first place: cache responses on disk while you develop, and never call an API inside a training loop. The [estimator](/estimator/) checks whether a daily quota covers your expected users.

## "Free" means four different things

ModelShelf labels the cost of every API, because "free" hides the difference that matters:

- **Permanent free tier, within limits.** Free with no end date, capped per minute or day. Most APIs in the directory work this way.
- **Free trial.** Free for a period or up to an amount, then it stops or bills you. ModelShelf does not list trials.
- **Credits.** A balance that runs down. Check whether free accounts get any.
- **Local.** No hosted charges at all, because the model runs on your machine ([Ollama](/resources/ollama-local/)).

> **Checked fact:** Hugging Face Inference Providers is pay-as-you-go: "Free users can use Inference Providers by purchasing credits, or by upgrading to PRO". Its pricing table lists Free users with no monthly credits, and PRO users and Team or Enterprise organizations with $2.00 a month (per seat for organizations). ModelShelf labels it "Paid credits"; Hugging Face dataset downloads and the Dataset Viewer API stay free. [HF pricing](https://huggingface.co/docs/inference-providers/pricing)

Also check whether the free tier asks for a payment card. A card on file turns a mistake (an infinite loop calling the API) into a bill.

## Common mistakes

- Committing a key in a notebook, then making the repository public.
- Sharing one key across a whole team, so one person's loop blocks everyone.
- Retrying instantly on 429, which makes the throttling worse.
- Building a demo on a free trial that ends before the judging.
