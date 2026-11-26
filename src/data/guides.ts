// Answer-first copy for category pages. Each block opens with 2–3 sentences that answer
// the question on their own, then concrete picks. In this copy, [[slug]] links to that
// entry by name, [label](/path/) links inside the site, and `code` renders as code.
import { entries, type CategoryId, type Entry, type HardwareTier } from './directoryData';
import { ACCESS_HUBS, HARDWARE_HUBS, hubEntries, type Hub } from './hubs';
import { sizeWords } from '../utils/format';

export interface CategoryGuide {
  whenToChoose: { answer: string; picks: string[] };
  firstProject: { slug: string; title: string; answer: string; steps: string[] };
}

export const CATEGORY_GUIDES: Record<CategoryId, CategoryGuide> = {
  nlp: {
    whenToChoose: {
      answer:
        'Choose a language dataset when your input is text and you want to train or fine-tune your own model to classify it, answer questions about it or predict the next word. Classification sets like [[imdb-reviews]] and [[ag-news]] reach a strong TF-IDF baseline on a laptop CPU in about a minute; question answering and the GLUE tasks are where fine-tuning a transformer on a free Colab T4 pays off. If you only need to call a model, not train one, use a [free LLM API](/categories/llm-apis/) instead.',
      picks: [
        'Sentiment or topic labels: [[imdb-reviews]] (2 classes, 50,000 reviews) or [[ag-news]] (4 classes, 127,600 articles). Laptop CPU.',
        'Question answering: [[squad-2]], ~142,000 questions including unanswerable ones. Free Colab T4.',
        'One fine-tuned model across many tasks: [[glue-benchmark]], 9 tasks behind one loader. Free Colab T4.',
        'Language modelling and perplexity: [[wikitext-103]]. Start with WikiText-2 or a subset.',
      ],
    },
    firstProject: {
      slug: 'imdb-reviews',
      title: 'Movie review sentiment classifier',
      answer:
        'Build a positive/negative sentiment classifier on [[imdb-reviews]]. It loads in one line with no account, and TF-IDF (1–2 grams) with logistic regression trains in about a minute on a laptop CPU. The original paper reported 88.89% test accuracy, a fair bar for your baseline.',
      steps: [
        'Load it with `load_dataset("stanfordnlp/imdb")` and strip the `<br />` tags from the text.',
        'Carve a validation split out of train and keep the 25,000-review test split for the final number.',
        'Fit TF-IDF + logistic regression, then fine-tune DistilBERT on a free Colab T4 and compare against the 95–97% the dataset page cites for modern transformers.',
      ],
    },
  },
  vision: {
    whenToChoose: {
      answer:
        'Choose a vision dataset when your input is images and you want to classify them, find objects in them or segment them. [[mnist]] and [[fashion-mnist]] train a small CNN past 90% accuracy on a laptop CPU in minutes; [[cifar-10]] and [[oxford-iiit-pet]] are where a free Colab T4 and pretrained weights start to matter. Move to [[coco-2017]] for object detection once classification feels easy.',
      picks: [
        'Your first CNN: [[mnist]] (70,000 digits, ~15 MB) or the harder [[fashion-mnist]]. Laptop CPU.',
        'Colour images and data augmentation: [[cifar-10]], 60,000 images at 32×32. Free Colab T4 for ResNets.',
        'Transfer learning on real photos: [[oxford-iiit-pet]], 37 breeds with segmentation masks. Free Colab T4.',
        'Object detection and segmentation: [[coco-2017]], ~20 GB. Evaluate a pretrained model or train on a subset.',
      ],
    },
    firstProject: {
      slug: 'mnist',
      title: 'Handwritten digit classifier',
      answer:
        'Train a handwritten-digit classifier on [[mnist]]. It is 70,000 grayscale 28×28 images (about 18 MB) that load in one line, and a small CNN in the style of LeNet-5 (99.05% in LeCun et al., 1998) trains in minutes on a laptop CPU.',
      steps: [
        'Load it with `load_dataset("ylecun/mnist")`, scale pixels to 0–1 and keep the official 60,000 / 10,000 split.',
        'Fit a linear model on raw pixels first (the authors list 88% for a linear classifier) so you know what the CNN has to beat.',
        'Train a two-layer CNN, then rerun the same code on [[fashion-mnist]], a harder drop-in replacement.',
      ],
    },
  },
  tabular: {
    whenToChoose: {
      answer:
        'Choose a tabular dataset when your data is rows and columns, such as measurements, prices or records, and you want classic machine learning: regression, classification and feature engineering. Every tabular dataset on ModelShelf is 2 MB or smaller, needs no sign-up and trains in seconds on a laptop CPU, so it is the fastest way to practise the whole workflow. On tables, gradient boosting is usually the model to beat, not a neural network.',
      picks: [
        'Your very first model: [[iris]] (150 rows) or [[palmer-penguins]] (344 rows, with mixed feature types and a few missing values).',
        'Missing data and feature engineering: [[titanic]], 1,309 passengers.',
        'Regression: [[california-housing]] (20,640 census block groups) or [[wine-quality]] (6,497 wines).',
      ],
    },
    firstProject: {
      slug: 'titanic',
      title: 'Titanic survival prediction',
      answer:
        'Predict passenger survival on [[titanic]]. Its 1,309 rows have missing values and mixed column types, so you practise cleaning, encoding and cross-validation, and logistic regression or gradient boosting scores about 0.78–0.82 accuracy in seconds on a laptop CPU.',
      steps: [
        'Load it with `fetch_openml("titanic", version=1, as_frame=True)` and drop `boat` and `body`, which leak the outcome.',
        'Impute `age`, encode `sex` and `pclass`, and keep all of it inside a scikit-learn `Pipeline` so nothing leaks between folds.',
        'Compare logistic regression with gradient boosting using 5-fold cross-validation.',
      ],
    },
  },
  audio: {
    whenToChoose: {
      answer:
        'Choose an audio dataset when your input is sound and you want to recognise words, transcribe speech, classify sounds or synthesise a voice. Most projects turn audio into spectrograms, MFCCs or pretrained embeddings and then train a familiar classifier on top. [[free-spoken-digit]] trains on a laptop CPU in seconds; the larger speech and sound datasets fit a free Colab T4.',
      picks: [
        'Laptop only: [[free-spoken-digit]], 3,000 recordings of the digits 0–9, ~20 MB.',
        'Keyword spotting: [[speech-commands]], ~105,000 one-second clips of 35 words. Free Colab T4.',
        'Environmental sounds: [[esc-50]], 2,000 clips in 50 classes (non-commercial license).',
        'Speech recognition: [[librispeech]]. Text-to-speech: [[lj-speech]] (public domain; start from a pretrained checkpoint).',
      ],
    },
    firstProject: {
      slug: 'free-spoken-digit',
      title: 'Spoken digit recogniser',
      answer:
        'Classify spoken digits with [[free-spoken-digit]], the "MNIST for audio". It is 3,000 short WAV recordings (about 16 MB), and MFCC features with logistic regression or an SVM train in seconds on a laptop CPU.',
      steps: [
        'Clone the repository; each file name holds the label and speaker, e.g. `0_jackson_0.wav`.',
        'Pad or trim clips to about 1 second at 8 kHz, then extract MFCCs with librosa.',
        'Hold out one whole speaker as the test set to measure how well it handles a new voice.',
      ],
    },
  },
  'llm-apis': {
    whenToChoose: {
      answer:
        'Choose a free LLM API when you want to call a ready-made language model, for a chatbot, summariser, RAG app or evaluation, instead of training your own. [[groq-api]] and [[gemini-api]] give you a free key with no credit card, [[openrouter-free]] puts many open models behind one free key, and [[ollama-local]] runs models on your own machine with no key and no rate limits. [[hugging-face-inference]] also covers many open models, but free accounts have to buy credits. Hosted free tiers cap requests per minute and per day, so cache responses while you develop.',
      picks: [
        'Fastest responses on a free key: [[groq-api]].',
        'Long context and image input: [[gemini-api]].',
        'Many models behind one key: [[openrouter-free]] (free `:free` models), or [[hugging-face-inference]] if you have PRO or purchased credits.',
        'Offline, private or unlimited: [[ollama-local]], limited only by your own hardware.',
      ],
    },
    firstProject: {
      slug: 'groq-api',
      title: 'Command-line Q&A bot with a small eval',
      answer:
        'Build a command-line Q&A bot with [[groq-api]]. A free key needs no credit card and the API is OpenAI-compatible, so the same client code works later with other providers. Groq is built for low-latency inference; on a small evaluation the free tier’s per-minute token limit, not speed, is what you plan around.',
      steps: [
        'Create a key in the Groq console and keep it in the `GROQ_API_KEY` environment variable, never in your code.',
        'Send one chat request with the OpenAI Python client pointed at Groq, then add a system prompt.',
        'Write 20 test questions with expected answers and score replies at `temperature: 0`, so you can compare models fairly later.',
      ],
    },
  },
  'data-apis': {
    whenToChoose: {
      answer:
        'Choose a free data API when your project needs live or regularly updated data, such as weather, exchange rates or encyclopedia text, rather than a fixed download. [[open-meteo]], [[frankfurter]], [[wikipedia-rest]] and [[hf-datasets-server]] need no sign-up or key, and [[nasa-apod]] works with a shared `DEMO_KEY` until you request a free personal key. Cache responses locally and stay well inside each API’s limits.',
      picks: [
        'Time-series forecasting: [[open-meteo]] (about 80 years of weather history) or [[frankfurter]] (daily European Central Bank exchange rates).',
        'Text for NLP or retrieval projects: [[wikipedia-rest]].',
        'Checking a dataset before you download it: [[hf-datasets-server]].',
        'Images and space data: [[nasa-apod]].',
      ],
    },
    firstProject: {
      slug: 'open-meteo',
      title: 'Next-day temperature forecaster',
      answer:
        'Forecast tomorrow’s temperature with [[open-meteo]]. It needs no key and returns hourly history for a whole date range in one request, and the bar to beat is a "same hour yesterday" baseline: gradient boosting with lag features is a good first model.',
      steps: [
        'Pull a year of hourly temperature for your city from the historical archive endpoint with `timezone=auto`, and save it to CSV.',
        'Score the "same hour yesterday" baseline first, using a date-based split, never a shuffled one.',
        'Add lag and calendar features, train gradient boosting and report how much it lowers the MAE.',
      ],
    },
  },
};

export interface QuickAnswer {
  id: string;
  q: string;
  /** 2–3 sentences that answer the question on their own. */
  answer: string;
  points: string[];
}

/** "[[a]], [[b]] and [[c]]": entry links in a sentence. */
export const names = (list: Entry[]) => {
  const links = list.map((e) => `[[${e.slug}]]`);
  return links.length < 2 ? links.join('') : `${links.slice(0, -1).join(', ')} and ${links.at(-1)}`;
};
/** The first entry from each category, so examples span modalities. */
const onePerCategory = (list: Entry[]) => list.filter((e, i) => list.findIndex((x) => x.category === e.category) === i);

/** Homepage quick answers, computed from the data so counts and names never drift. */
export function homeQuickAnswers(): QuickAnswer[] {
  const datasets = entries.filter((e) => e.kind === 'dataset');
  const apis = entries.filter((e) => e.kind === 'api');
  const tier = (t: HardwareTier) => datasets.filter((e) => e.hardware === t);
  const keyless = entries.filter((e) => e.badges.includes('no-signup'));
  const keylessDatasets = keyless.filter((e) => e.kind === 'dataset');
  const keylessApis = keyless.filter((e) => e.kind === 'api');
  const keyed = entries.filter((e) => !e.badges.includes('no-signup'));
  const paid = keyed.filter((e) => e.pricing === 'pay-as-you-go');
  const keyedFree = keyed.filter((e) => e.pricing !== 'pay-as-you-go');
  const noCard = keyedFree.every((e) => e.badges.includes('no-card'));
  const paidNote = paid.length ? ` ${names(paid)} ${paid.length === 1 ? 'needs' : 'need'} purchased credits.` : '';
  const hub = (t: HardwareTier) => `/hardware/${HARDWARE_HUBS.find((h) => h.tier === t)!.slug}/`;

  return [
    {
      id: 'pick-for-hardware',
      q: 'How do I pick an ML dataset that fits free Colab or a laptop?',
      answer:
        'Match the dataset to your hardware first. Tabular data, MNIST-sized images and TF-IDF text models train on a laptop CPU in seconds to minutes; fine-tuning a transformer, a ResNet or an audio model needs a free Colab T4 GPU; very large datasets such as COCO need a subset or a pretrained checkpoint. Every ModelShelf entry is labelled with one of these three hardware tiers, along with its download size and time to a first baseline.',
      points: [
        `[Laptop CPU](${hub('laptop-cpu')}): ${tier('laptop-cpu').length} datasets, including ${names(onePerCategory(tier('laptop-cpu')))}, plus all ${apis.length} APIs.`,
        `[Free Colab T4](${hub('free-colab-t4')}): ${tier('free-colab-t4').length} datasets, such as ${names(onePerCategory(tier('free-colab-t4')))}. Use fp16 and save checkpoints to Drive.`,
        `[GPU or a subset](${hub('needs-gpu-subset')}): ${names(tier('needs-gpu-subset'))}. Start from a pretrained model or a slice of the data.`,
        `To weigh size, sample count and time to baseline side by side, use the [comparison table](/compare/).`,
      ],
    },
    {
      id: 'no-signup',
      q: 'Which datasets and APIs on ModelShelf require no sign-up or API key?',
      answer: `${keyless.length} of the ${entries.length} resources work without an account or API key: ${keylessDatasets.length === datasets.length ? 'all ' : ''}${keylessDatasets.length} datasets and ${keylessApis.length} of the ${apis.length} APIs. The datasets download from public URLs or one-line loaders such as \`load_dataset\` and \`fetch_openml\`, and the keyless APIs answer plain HTTP requests.${keyedFree.length ? ` ${keyedFree.length} more need only a free key or account${noCard ? ', and none of them asks for a credit card' : ''}.` : ''}${paidNote}`,
      points: [
        `Keyless APIs: ${names(keylessApis)}.`,
        ...(keyedFree.length ? [`Free key or account${noCard ? ', no credit card' : ''}: ${names(keyedFree)}.`] : []),
        ...(paid.length ? [`Account plus purchased credits: ${names(paid)}.`] : []),
        `No-signup datasets include ${names(onePerCategory(keylessDatasets))}; see every one on the [no-signup page](/access/no-signup/).`,
      ],
    },
  ];
}

export interface ComboIdea {
  id: string;
  title: string;
  /** Slug of the dataset you train on. */
  dataset: string;
  /** Slug of the API that feeds the model live inputs. */
  api: string;
  build: string;
  how: string;
  hardware: string;
  license: string;
}

// Each pair trains on a dataset and runs on live data from a keyless API. Figures quoted
// here come from the entries' own baselines, so update both together.
export const COMBO_IDEAS: ComboIdea[] = [
  {
    id: 'ask-wikipedia',
    title: 'Ask Wikipedia: question answering that can say "no answer"',
    dataset: 'squad-2',
    api: 'wikipedia-rest',
    build: 'A Q&A app that fetches a Wikipedia article summary live and extracts the answer from it, or replies "no answer" when the summary does not contain one.',
    how: 'Fine-tune DistilBERT on [[squad-2]] (always predicting "no answer" already scores about 50 F1 on the dev set, so that is the bar to clear), then pass each `page/summary/{title}` extract from the [[wikipedia-rest]] as the context. SQuAD 2.0’s unanswerable questions are what teach the model to abstain.',
    hardware: 'Free Colab T4 to fine-tune; a laptop CPU to run the app',
    license: 'Both are CC BY-SA 4.0: credit SQuAD and Wikipedia, and share any redistributed text under the same license.',
  },
  {
    id: 'local-llm-vs-baseline',
    title: 'Local LLM vs. a one-minute baseline',
    dataset: 'imdb-reviews',
    api: 'ollama-local',
    build: 'A notebook that measures whether a small local LLM labels movie-review sentiment better than a classic model trained in a minute.',
    how: 'Train TF-IDF + logistic regression on [[imdb-reviews]] (the original paper reported 88.89%), then send the same 200 held-out reviews to the `/api/generate` endpoint of [[ollama-local]] with one fixed prompt. Compare accuracy and seconds per review.',
    hardware: 'Laptop CPU: a 3B model at 4-bit fits in 8 GB of RAM; speed depends on your CPU',
    license: 'IMDB has no stated license (the authors ask for a citation), so keep this a course or portfolio project. Ollama is MIT; the model you pull has its own license.',
  },
  {
    id: 'penguins-weather',
    title: 'Does the weather show up in the penguins?',
    dataset: 'palmer-penguins',
    api: 'open-meteo',
    build: 'A feature-engineering exercise that joins each penguin’s study year to the temperature at Palmer Station, Antarctica, from Open-Meteo’s historical weather API.',
    how: 'Request daily temperatures for Palmer Station (64.77°S, 64.05°W) for 2007–2009, average them per year, join them on the `year` column of [[palmer-penguins]] and test whether the feature improves a body-mass regression. With only three seasons, weather and year cannot be separated, and that is the lesson worth writing up.',
    hardware: 'Laptop CPU, in under a minute',
    license: 'Palmer Penguins is CC0. [[open-meteo]] data is CC BY 4.0 and its free API is for non-commercial use, so credit Open-Meteo.',
  },
  {
    id: 'rain-sound-check',
    title: 'Rain or not? A sound classifier checked against live weather',
    dataset: 'esc-50',
    api: 'open-meteo',
    build: 'An app that labels a short recording as rain, wind, thunderstorm or something else, then checks the label against the current precipitation and wind speed for the same place.',
    how: 'Fine-tune a pretrained audio model on [[esc-50]] with its five folds (the ESC-50 results table lists AST at 95.7% across all 50 classes), then call [[open-meteo]] with `current=precipitation,wind_speed_10m` for the recording’s location.',
    hardware: 'Free Colab T4 to train; a laptop CPU to run the check',
    license: 'Both are non-commercial: ESC-50 is CC BY-NC 3.0 and Open-Meteo’s free API is for non-commercial use. Fine for coursework and demos.',
  },
  {
    id: 'wikipedia-topic-tagger',
    title: 'News-style topic tagger for Wikipedia pages',
    dataset: 'ag-news',
    api: 'wikipedia-rest',
    build: 'A tagger that sorts live Wikipedia summaries into AG News’s four topics (World, Sports, Business, Sci/Tech) and sends low-confidence pages to "other".',
    how: 'Train TF-IDF + logistic regression on [[ag-news]] (about a minute on a laptop CPU), fetch summaries from the [[wikipedia-rest]], and route predictions below a probability threshold to "other". Encyclopedia text is out of domain for a news model, so measure how often that happens.',
    hardware: 'Laptop CPU',
    license: 'AG News is for non-commercial use only and Wikipedia text is CC BY-SA 4.0: keep it a course project and credit both.',
  },
];

const bySlug = (slug: string) => {
  const e = entries.find((x) => x.slug === slug);
  if (!e) throw new Error(`Unknown entry slug in COMBO_IDEAS: ${slug}`);
  return e;
};
export const comboEntries = (c: ComboIdea) => ({ dataset: bySlug(c.dataset), api: bySlug(c.api) });
export const combosFor = (e: Entry) => COMBO_IDEAS.filter((c) => c.dataset === e.slug || c.api === e.slug);

/** The 1–2 sentence answer that leads the combo section, checked against the data. */
export function comboAnswer(): string {
  const pairs = COMBO_IDEAS.map(comboEntries);
  const keyless = pairs.every((p) => p.api.badges.includes('no-signup'));
  const free = pairs.every((p) => p.dataset.hardware !== 'needs-gpu-subset');
  return `Pair a dataset you train on with a free API that feeds your model live inputs, and a notebook becomes a demo anyone can try. ${keyless ? `Every API in these ${COMBO_IDEAS.length} combos works with no sign-up or API key` : `These are ${COMBO_IDEAS.length} combos`}${free ? ', and each one fits a laptop CPU or a free Colab T4' : ''}.`;
}

const count = (list: Entry[], label: string, test: (e: Entry) => boolean) => {
  const n = list.filter(test).length;
  return n === 0 || n === list.length ? '' : `${n} ${label}`;
};
const join = (parts: string[]) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`);

/**
 * Answer-first lead for a hardware or access hub: the count, every resource by name, then the
 * facets readers check next (sign-up, license, hardware) and the download size range.
 */
export function hubAnswer(hub: Hub): string {
  const list = hubEntries(hub);
  const datasets = list.filter((e) => e.kind === 'dataset');
  const apis = list.filter((e) => e.kind === 'api');
  const allApis = entries.filter((e) => e.kind === 'api').length;
  const allDatasets = entries.length - allApis;
  const groups = [
    datasets.length ? `${datasets.length === allDatasets ? 'all ' : ''}${datasets.length} ${datasets.length === 1 ? 'dataset' : 'datasets'} (${names(datasets)})` : '',
    apis.length ? `${apis.length === allApis ? 'all ' : ''}${apis.length} ${apis.length === 1 ? 'API' : 'APIs'} (${names(apis)})` : '',
  ].filter(Boolean);
  const facets = [
    count(list, 'need no sign-up or API key', (e) => e.badges.includes('no-signup')),
    count(list, 'allow commercial use', (e) => e.badges.includes('commercial-ok')),
    count(list, 'run on a laptop CPU', (e) => e.hardware === 'laptop-cpu'),
  ].filter(Boolean);
  const sized = datasets.filter((e) => e.sizeMB !== undefined).sort((a, b) => a.sizeMB! - b.sizeMB!);
  const range =
    sized.length > 1
      ? ` Dataset downloads range from ${sizeWords(sized[0].sizeMB!)} ([[${sized[0].slug}]]) to ${sizeWords(sized.at(-1)!.sizeMB!)} ([[${sized.at(-1)!.slug}]]).`
      : '';
  return `${list.length} ${list.length === 1 ? 'resource' : 'resources'} ${hub.answer}: ${join(groups)}.${facets.length ? ` Of these, ${join(facets)}.` : ''}${range}`;
}

const tally = (test: (e: Entry) => boolean) => entries.filter(test).length;

/** Lead for /compare/ and the hub index pages: the whole directory in tier and access counts. */
export function directoryAtAGlance() {
  const datasets = entries.filter((e) => e.kind === 'dataset');
  const apis = entries.filter((e) => e.kind === 'api');
  const tier = (t: HardwareTier) => tally((e) => e.hardware === t);
  const keyless = tally((e) => e.badges.includes('no-signup'));
  const commercial = tally((e) => e.badges.includes('commercial-ok'));
  const hubLink = (base: string, h: Hub) => `[${h.label}](${base}${h.slug}/)`;
  const paid = tally((e) => e.pricing === 'pay-as-you-go');
  const noCard = entries.every((e) => e.pricing === 'pay-as-you-go' || e.badges.includes('no-signup') || e.badges.includes('no-card'));
  return {
    hardware: `Of the ${entries.length} resources, ${tier('laptop-cpu')} run on a laptop CPU, ${tier('free-colab-t4')} need a free Colab T4 GPU and ${tier('needs-gpu-subset')} need a bigger GPU or a subset.`,
    hostedNote: 'Hosted APIs count as laptop CPU because the work runs on the provider’s servers.',
    access: `${keyless} of the ${entries.length} resources need no sign-up or API key, ${entries.length - keyless - paid} need only a free key or account${noCard ? ' with no credit card' : ''}${paid ? `, ${paid} ${paid === 1 ? 'needs' : 'need'} purchased credits` : ''}, and ${commercial} have terms that allow commercial use.`,
    hardwarePoints: HARDWARE_HUBS.map((h) => {
      const list = hubEntries(h);
      const d = list.filter((e) => e.kind === 'dataset').length;
      const a = list.length - d;
      return `${hubLink('/hardware/', h)}: ${list.length} resources (${d} datasets${a ? ` and ${a === apis.length ? 'all ' : ''}${a} APIs` : ''}).`;
    }),
    accessPoints: ACCESS_HUBS.map((h) => `${hubLink('/access/', h)}: ${hubEntries(h).length} resources that ${h.answer}.`),
    counts: { datasets: datasets.length, apis: apis.length, keyless, commercial },
  };
}
