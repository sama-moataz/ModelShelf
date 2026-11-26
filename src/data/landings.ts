// Intent landing pages at the site root (/datasets-for-beginners/ and friends).
// Each one answers a search intent the category and hub pages do not: a learning path,
// keyless APIs only, school work, a hackathon weekend. Facts about a resource (license,
// size, access) are never copied here; the page reads them from `entries` by slug.
// Copy may use `code`, [[slug]] and [label](/path/) (see utils/format).
import { entries, type Entry, type Snippet } from './directoryData';

export interface LandingPick {
  slug: string;
  /** Why this resource is on this page, for this reader. Not a restatement of its summary. */
  why: string;
}

export interface Landing {
  slug: string;
  /** Short label for breadcrumbs, nav and cross-links. */
  label: string;
  /** Page title before " | ModelShelf". */
  title: string;
  h1: string;
  metaDescription: string;
  /** Answer-first lead: what the page gives you, in two or three sentences. */
  answer: string;
  /** Who the page is for, and what they are up against. */
  audience: string;
  groups: { heading: string; intro?: string; picks: LandingPick[] }[];
  /** Access, hardware and license points specific to this audience. */
  considerations: string[];
  ideas: string[];
  mistakes: string[];
  snippet?: Snippet & { caption: string };
  nextSteps: { label: string; href: string; note: string }[];
  /** Every pick must pass this, so the page cannot drift from its promise as data changes. */
  rule: { text: string; test: (e: Entry) => boolean };
}

export const LANDINGS: Landing[] = [
  {
    slug: 'datasets-for-beginners',
    label: 'Datasets for beginners',
    title: 'Datasets for Beginners: A First ML Project Path',
    h1: 'Machine learning datasets for beginners, in the order to learn from them',
    metaDescription:
      'A beginner path through nine open ML datasets, from Iris to IMDB: what each one teaches, its license, the hardware it needs and starter code. No GPU or sign-up needed.',
    answer:
      'Start with [[iris]] to learn the train, evaluate and cross-validate loop, then add one new difficulty per dataset: missing values ([[palmer-penguins]]), feature engineering and leakage ([[titanic]]), regression ([[california-housing]]), images ([[mnist]], then [[fashion-mnist]]) and text ([[imdb-reviews]]). Every dataset on this path downloads without an account and trains on a laptop CPU.',
    audience:
      'You have finished a Python or intro-to-ML course and want projects where a mistake shows up as a bad number, not a crashed notebook. You have a laptop, no GPU, and limited time, so each step below adds exactly one new idea.',
    groups: [
      {
        heading: 'The path: one new idea per dataset',
        picks: [
          { slug: 'iris', why: 'Learn the workflow itself: split, fit, predict, score, then repeat with 5-fold cross-validation. With 150 rows every run takes under a second, so you can experiment freely.' },
          { slug: 'palmer-penguins', why: 'Same task, real-world mess: a few missing values, a categorical island column and three unevenly sized classes. It teaches imputation and stratified splits.' },
          { slug: 'titanic', why: 'Feature engineering and leakage. The `boat` and `body` columns record what happened after the sinking, and spotting why they must go is the lesson.' },
          { slug: 'california-housing', why: 'Your first regression problem: RMSE instead of accuracy, a capped target and skewed features. Gradient boosting trains in seconds.' },
          { slug: 'mnist', why: 'Your first neural network. Compare a linear model with a small CNN to see what convolution buys you.' },
          { slug: 'fashion-mnist', why: 'The same format as MNIST but harder, so you learn to read a confusion matrix when accuracy stops being impressive.' },
          { slug: 'imdb-reviews', why: 'Text classification: a TF-IDF baseline first, then a pretrained transformer, with the 2011 paper’s 88.89% as the bar.' },
        ],
      },
      {
        heading: 'After the path',
        intro: 'Once those feel routine, these add one bigger step each.',
        picks: [
          { slug: 'free-spoken-digit', why: 'Audio without the scale: 3,000 short recordings, MFCC features and a classifier that trains in seconds.' },
          { slug: 'cifar-10', why: 'Colour images and data augmentation. A laptop can train it, but a free Colab GPU makes experiments much faster.' },
        ],
      },
    ],
    considerations: [
      'Access: every dataset here loads with one line (`load_iris`, `fetch_openml`, `load_dataset`) or a public download, with no account.',
      'Hardware: all of them train on a laptop CPU. CIFAR-10 is the only one where a free Colab GPU noticeably speeds things up.',
      'Licenses differ, and "no license specified" is fine for learning but not a basis for a product. The list below says which is which.',
    ],
    ideas: [
      'Compare logistic regression and a random forest on [[palmer-penguins]] with 5-fold cross-validation, then explain which rows each model gets wrong.',
      'On [[titanic]], train once with the `boat` column and once without, and write up why the first score is meaningless.',
      'Train one small CNN on [[mnist]] and the same CNN on [[fashion-mnist]], then show which classes cause the drop.',
      'On [[imdb-reviews]], build TF-IDF + logistic regression and list the ten words with the largest positive and negative weights.',
    ],
    mistakes: [
      'Looking at the test set while tuning. Split once, put the test set away, and use cross-validation on the training data.',
      'Reporting accuracy on imbalanced data without a baseline. Always print what "predict the most common class" scores.',
      'Skipping the license because it is "just a class project". Note it in your README now and you will not have to dig later.',
    ],
    snippet: {
      lang: 'python',
      title: 'Cross-validate your first model',
      caption: 'Five-fold cross-validation on Iris, the loop every later project reuses.',
      code: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X, y = load_iris(return_X_y=True)
scores = cross_val_score(LogisticRegression(max_iter=1000), X, y, cv=5)
print(f"accuracy {scores.mean():.3f} ± {scores.std():.3f}")`,
    },
    nextSteps: [
      { label: 'Open the first dataset: Iris', href: '/resources/iris/', note: 'Starter code, preprocessing checklist and license.' },
      { label: 'Guide: how to choose a dataset', href: '/guides/choose-a-dataset/', note: 'The checks to run on any dataset before you commit to it.' },
      { label: 'Guide: ML on a laptop CPU', href: '/guides/ml-on-a-laptop-cpu/', note: 'Keep every step on this path fast without a GPU.' },
    ],
    rule: { text: 'Every pick is a dataset with no sign-up and the beginner badge.', test: (e) => e.kind === 'dataset' && e.badges.includes('no-signup') && e.badges.includes('beginner') },
  },
  {
    slug: 'free-apis-without-api-key',
    label: 'Free APIs without an API key',
    title: 'Free APIs Without an API Key for ML Projects',
    h1: 'Free APIs you can call without an API key',
    metaDescription:
      'Free APIs that need no API key or sign-up, for weather, exchange rates, Wikipedia text, dataset previews and a local LLM, with each one’s limits and commercial-use terms.',
    answer:
      'Four hosted APIs in the directory answer plain HTTP requests with no key or account: [[open-meteo]] (weather), [[frankfurter]] (exchange rates), [[wikipedia-rest]] (article text) and [[hf-datasets-server]] (previews of Hugging Face datasets). [[ollama-local]] needs no key either, because the model runs on your own machine. "No key" never means "no rules": each one has limits or terms, listed below.',
    audience:
      'You want live data in a notebook, a class demo or a prototype without managing secrets, or you are teaching and cannot ask every student to register for a service. Keyless APIs also make your project reproducible: anyone can rerun it.',
    groups: [
      {
        heading: 'Hosted APIs with no key',
        picks: [
          { slug: 'open-meteo', why: 'Hourly forecasts and historical weather back to 1940 from one URL. The free API is for non-commercial use and under 10,000 calls a day.' },
          { slug: 'frankfurter', why: 'Exchange-rate history for time-series practice. No quotas, and its FAQ says commercial use is fine.' },
          { slug: 'wikipedia-rest', why: 'Clean article summaries for retrieval and NLP demos. Requests without a descriptive User-Agent fail with HTTP 403.' },
          { slug: 'hf-datasets-server', why: 'Look at the rows and schema of a public dataset before downloading gigabytes. Gated datasets still need a token.' },
        ],
      },
      {
        heading: 'Runs locally, so there is no key',
        picks: [{ slug: 'ollama-local', why: 'An LLM behind a localhost HTTP API: no key, no quota and no data leaving your machine. Your RAM and CPU are the limit.' }],
      },
    ],
    considerations: [
      'Every hosted LLM API in the directory needs a key. [[groq-api]], [[gemini-api]] and [[openrouter-free]] give one away free with no credit card; if you need an LLM without any key, [[ollama-local]] is the option.',
      '[[nasa-apod]] can be tried without registering through its shared `DEMO_KEY`, but that is capped at 50 requests a day per IP, so treat it as a free-key API.',
      'Commercial use: Frankfurter and Wikipedia text (CC BY-SA, with attribution) allow it; Open-Meteo’s free API does not.',
      'Keyless APIs are shared by everyone. Cache responses, send a User-Agent that says who you are, and back off on HTTP 429.',
    ],
    ideas: [
      'Forecast tomorrow’s temperature for your city with [[open-meteo]] history and beat the "same hour yesterday" baseline.',
      'Chart a currency pair with [[frankfurter]] and compare a moving-average forecast with "tomorrow equals today".',
      'Fetch 200 [[wikipedia-rest]] summaries on one topic and build a small search or question-answering demo over them.',
      'Write a script that previews any dataset with [[hf-datasets-server]] and prints its columns, size and first rows before you download it.',
    ],
    mistakes: [
      'Calling the API inside a training loop. Download once, save to disk, and train from the file.',
      'Using Open-Meteo’s free API in a paid product. It is non-commercial; the paid plans cover commercial use.',
      'Sending requests in parallel to "go faster". Wikimedia asks for requests one at a time, and most keyless services throttle bursts.',
    ],
    snippet: {
      lang: 'python',
      title: 'A polite keyless request',
      caption: 'Identify yourself, set a timeout, and back off when the service says you are going too fast.',
      code: `import time, requests

session = requests.Session()
session.headers["User-Agent"] = "my-class-project/0.1 (you@example.com)"

def get_json(url, **params):
    for attempt in range(3):
        r = session.get(url, params=params, timeout=10)
        if r.status_code == 429:  # too many requests: wait, then retry
            time.sleep(int(r.headers.get("Retry-After", 2 ** attempt)))
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("still rate limited after 3 tries")

print(get_json("https://api.open-meteo.com/v1/forecast",
               latitude=30.04, longitude=31.24, current="temperature_2m"))`,
    },
    nextSteps: [
      { label: 'Check a quota in the estimator', href: '/estimator/#entry=open-meteo', note: 'See whether Open-Meteo’s daily limit covers your expected traffic.' },
      { label: 'Guide: API keys, rate limits and free tiers', href: '/guides/api-keys-and-rate-limits/', note: 'What a key does, how limits work, and how to keep keys out of your repo.' },
      { label: 'Everything with no sign-up', href: '/access/no-signup/', note: 'Keyless APIs plus every dataset that downloads without an account.' },
    ],
    rule: { text: 'Every pick is an API that needs no key or account.', test: (e) => e.kind === 'api' && (e.access === 'open' || e.access === 'local') },
  },
  {
    slug: 'datasets-for-school-projects',
    label: 'School projects',
    title: 'Datasets and APIs for School AI Projects',
    h1: 'Datasets and APIs for school AI projects',
    metaDescription:
      'Open datasets and keyless APIs for school AI projects, science fairs and coursework: no sign-up, laptop-friendly, with citation notes and project ideas by subject.',
    answer:
      'For a school project, pick a dataset your teacher can rerun without an account and your laptop can train before the deadline. Everything below downloads with no sign-up, most of it trains on a laptop CPU, and each pick is grouped by the kind of project it suits: a classic classifier, images, text, sound or live real-world data.',
    audience:
      'High-school and university students with an assignment, a science fair or a capstone: a deadline, a school laptop, possibly a school account that cannot sign up for outside services, and a teacher who has to be able to check your work.',
    groups: [
      {
        heading: 'A classic classifier write-up',
        picks: [
          { slug: 'palmer-penguins', why: 'CC0, small and easy to explain to a non-technical audience, with charts that look good on a poster.' },
          { slug: 'wine-quality', why: 'Lets you frame the same data as regression or classification and discuss which is fairer. Note the duplicate rows.' },
        ],
      },
      {
        heading: 'Images',
        picks: [
          { slug: 'mnist', why: 'Draw your own digits, photograph them and test whether the model still works: an instant experiment with a clear result.' },
          { slug: 'fashion-mnist', why: 'MIT-licensed and harder than MNIST, so your confusion matrix has a real story to tell.' },
        ],
      },
      {
        heading: 'Text',
        picks: [
          { slug: 'imdb-reviews', why: 'Sentiment is easy to explain and easy to test on reviews you write yourself. Cite Maas et al. (2011), as the authors ask.' },
          { slug: 'ag-news', why: 'Four news topics with balanced classes, so plain accuracy is an honest metric. Non-commercial only.' },
        ],
      },
      {
        heading: 'Sound',
        picks: [{ slug: 'free-spoken-digit', why: 'Record your own voice saying 0–9 and test whether a model trained on six speakers recognises you. That question makes a strong science-fair project.' }],
      },
      {
        heading: 'Live real-world data',
        picks: [
          { slug: 'open-meteo', why: 'Weather for your own town with no key. School work is non-commercial, which the free API allows.' },
          { slug: 'frankfurter', why: 'Exchange rates for an economics angle: a forecast compared with "tomorrow equals today".' },
        ],
      },
    ],
    considerations: [
      'No sign-up anywhere on this page, so a teacher can rerun your notebook without creating accounts.',
      'Hardware: everything trains or runs on a laptop CPU. Nothing here needs a GPU.',
      'Citations: IMDB, CIFAR-10 and ESC-50 ask you to cite a paper; CC BY datasets such as Wine Quality need attribution. Put the citation in your report even when the license does not require it.',
    ],
    ideas: [
      'Does a digit-recognition model trained on six adult speakers understand your voice? Record yourself, test [[free-spoken-digit]] and report accuracy per speaker.',
      'Can a computer tell penguin species apart from four measurements? Which measurement matters most? ([[palmer-penguins]])',
      'Predict tomorrow’s temperature in your town from the last week of [[open-meteo]] data, and compare it with "same as today".',
      'Write ten movie reviews of your own and see where an [[imdb-reviews]] model gets sarcasm wrong.',
    ],
    mistakes: [
      'Testing on data the model trained on. Split first, with a fixed random seed, and say so in the report.',
      'No baseline. "92% accurate" means little until you show what guessing the most common answer scores.',
      'Forgetting to write down where the data came from and when you downloaded it. Teachers ask, and datasets change.',
    ],
    snippet: {
      lang: 'python',
      title: 'A split your teacher can reproduce',
      caption: 'Fix the random seed and stratify, so anyone who reruns the notebook gets the same split.',
      code: `import seaborn as sns
from sklearn.model_selection import train_test_split

df = sns.load_dataset("penguins").dropna()
train, test = train_test_split(df, test_size=0.2, stratify=df["species"], random_state=42)
print(len(train), "train rows,", len(test), "test rows")  # put the seed and these numbers in your report`,
    },
    nextSteps: [
      { label: 'Guide: finding resources for school and hackathons', href: '/guides/finding-resources-for-school-and-hackathons/', note: 'How to judge any dataset or API under a deadline, on ModelShelf or elsewhere.' },
      { label: 'Guide: dataset licenses', href: '/guides/dataset-licenses/', note: 'What CC BY, CC BY-SA, CC0 and "no license" mean for your project.' },
      { label: 'Beginner learning path', href: '/datasets-for-beginners/', note: 'If this is your first ML project, start here instead.' },
    ],
    rule: { text: 'Every pick works with no sign-up and runs on a laptop CPU.', test: (e) => e.badges.includes('no-signup') && e.hardware === 'laptop-cpu' },
  },
  {
    slug: 'datasets-for-hackathons',
    label: 'Hackathons',
    title: 'Free Datasets and APIs for Hackathons',
    h1: 'Free datasets and APIs for a hackathon weekend',
    metaDescription:
      'Free datasets and APIs for a 24–48 hour hackathon: quick setup, live data, LLM APIs with no credit card, an offline fallback and commercial-use notes.',
    answer:
      'For a hackathon, choose resources that take minutes to set up and will not fail during the demo. Pair a quick-to-train dataset with a live API, use a free-key LLM API with no credit card, and keep [[ollama-local]] as an offline fallback. If the project might become a product, check the license notes below before you build on anything.',
    audience:
      'A team with 24–48 hours, a demo at the end and conference Wi-Fi in between. You need setup measured in minutes, limits that survive judges clicking around, and, if the idea takes off, terms that allow commercial use.',
    groups: [
      {
        heading: 'Live data for the demo, no key',
        picks: [
          { slug: 'frankfurter', why: 'No key, no quotas and commercial use allowed: the safest live-data source here if you plan to keep building.' },
          { slug: 'wikipedia-rest', why: 'Real text for a retrieval or Q&A demo in one request. CC BY-SA, so credit Wikipedia on screen.' },
          { slug: 'open-meteo', why: 'Weather in one call. Fine for the hackathon demo; its free API is non-commercial, so plan a paid plan before launch.' },
        ],
      },
      {
        heading: 'An LLM in the demo',
        picks: [
          { slug: 'groq-api', why: 'A free key with no credit card and an OpenAI-compatible API, so you can switch providers later without rewriting code.' },
          { slug: 'gemini-api', why: 'Image input and long context on a free key. Its terms require the paid tier if your app serves users in the EEA, Switzerland or the UK.' },
          { slug: 'openrouter-free', why: 'One key for many free models. Useful as a fallback when your main provider rate-limits you mid-demo.' },
          { slug: 'ollama-local', why: 'The Wi-Fi fallback: a small model on the laptop answers even when the venue network does not.' },
        ],
      },
      {
        heading: 'Something to train in an afternoon',
        picks: [
          { slug: 'fashion-mnist', why: 'MIT-licensed and trains in minutes on a laptop, so a vision feature is realistic in a weekend.' },
          { slug: 'speech-commands', why: 'CC BY 4.0 keyword spotting, for a voice-controlled demo. Start the 2.4 GB download early.' },
          { slug: 'squad-2', why: 'CC BY-SA question answering with "no answer" examples, so your demo can say when it does not know.' },
        ],
      },
    ],
    considerations: [
      'Keys: put them in a `.env` file that is listed in `.gitignore`, never in the repo you show the judges.',
      'Limits: free tiers cap requests per minute. Cache every response you show in the demo, so a judge clicking quickly does not trigger HTTP 429.',
      'If the project continues: Open-Meteo’s free API is non-commercial, Gemini’s free tier cannot serve users in the EEA, Switzerland or the UK, and Ollama’s MIT license covers the software, not the model you run. The license list below covers the rest.',
    ],
    ideas: [
      'A travel-budget assistant: live rates from [[frankfurter]], with an LLM from [[groq-api]] explaining the numbers.',
      'A "can you answer that?" bot that fetches a [[wikipedia-rest]] summary and uses a [[squad-2]] model to answer or abstain.',
      'A voice-controlled dashboard that recognises "yes", "no", "up" and "down" with a [[speech-commands]] model.',
      'An offline-first demo that runs on [[ollama-local]] and switches to a hosted API only when the network is good.',
    ],
    mistakes: [
      'Discovering at 3 a.m. that an API needs a credit card or an approval step. Every LLM API in the list above gives a key with no card.',
      'Demoing live calls with no cache. Record the responses you rely on and replay them if the network or rate limit fails.',
      'Building on non-commercial data and then pitching it as a startup. Check the license before the pitch deck.',
    ],
    snippet: {
      lang: 'python',
      title: 'Cache responses for demo day',
      caption: 'The first run fetches and saves; every later run, including the demo, reads from disk.',
      code: `import json, pathlib, requests

CACHE = pathlib.Path("cache")
CACHE.mkdir(exist_ok=True)

def cached_get(name, url, **params):
    path = CACHE / f"{name}.json"
    if path.exists():  # demo day: no network needed, no rate limit to hit
        return json.loads(path.read_text())
    data = requests.get(url, params=params, timeout=10).json()
    path.write_text(json.dumps(data))
    return data

rates = cached_get("usd", "https://api.frankfurter.dev/v2/rates", base="USD", quotes="EUR,EGP")
print(rates)`,
    },
    nextSteps: [
      { label: 'Dataset + live API combo ideas', href: '/#combos-h', note: 'Five worked pairings of a dataset and a free API.' },
      { label: 'Check API limits in the estimator', href: '/estimator/', note: 'Will the free tier survive your expected demo traffic?' },
      { label: 'Guide: local models vs hosted APIs', href: '/guides/local-vs-hosted-llms/', note: 'When the offline fallback is worth setting up.' },
    ],
    rule: { text: 'Every pick works with no sign-up or a free key with no credit card.', test: (e) => e.badges.includes('no-signup') || (e.access === 'free-key' && e.badges.includes('no-card')) },
  },
];

export const landingEntry = (slug: string) => {
  const e = entries.find((x) => x.slug === slug);
  if (!e) throw new Error(`Unknown entry slug on a landing page: ${slug}`);
  return e;
};
export const landingPicks = (l: Landing) => l.groups.flatMap((g) => g.picks.map((p) => landingEntry(p.slug)));
