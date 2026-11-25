// Every entry's URL was checked on LAST_CHECKED. Sizes are approximate; limits and
// free tiers change, so each page links to the provider's own docs as the source of truth.
export const LAST_CHECKED = '2026-11-24';

export type CategoryId = 'nlp' | 'vision' | 'tabular' | 'audio' | 'llm-apis' | 'data-apis';
export type EntryKind = 'dataset' | 'api';
export type BadgeId =
  | 'no-signup'
  | 'no-card'
  | 'commercial-ok'
  | 'laptop-friendly'
  | 'beginner'
  | 'one-liner';
export type Access = 'open' | 'free-key' | 'account' | 'local';

export interface Badge {
  id: BadgeId;
  label: string;
  hint: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
  blurb: string;
}

export interface Snippet {
  lang: 'python' | 'bash' | 'javascript';
  title: string;
  code: string;
}

export interface Quota {
  label: string;
  perDay: number;
}

export interface Entry {
  slug: string;
  name: string;
  kind: EntryKind;
  category: CategoryId;
  summary: string;
  description: string;
  url: string;
  docsUrl: string;
  provider: string;
  license: string;
  access: Access;
  rateLimit?: string;
  format: string;
  /** Approximate download size in MB (datasets only). */
  sizeMB?: number;
  /** Free daily request allowances the estimator can compare against (APIs only). */
  quotas?: Quota[];
  badges: BadgeId[];
  tags: string[];
  useCases: string[];
  gotchas: string[];
  /** Smallest free setup that gets a sensible baseline. Hosted APIs count as laptop-cpu. */
  hardware: HardwareTier;
  /** Human-readable sample count, e.g. "50,000 reviews". */
  samples: string;
  /** Rough wall-clock time to a first baseline (or first API call). */
  timeToBaseline: string;
  /** Canonical SPDX / Creative Commons URL, only where the license maps to one cleanly. */
  licenseUrl?: string;
  /** 2–3 dataset-specific cleaning, splitting and leakage warnings. */
  preprocessingTips: string[];
  /** Realistic starter model and expected metric range. */
  baselineBenchmark: string;
  snippet: Snippet;
}

export type HardwareTier = 'laptop-cpu' | 'free-colab-t4' | 'needs-gpu-subset';

export const HARDWARE_TIERS: Record<HardwareTier, { label: string; short: string }> = {
  'laptop-cpu': { label: 'Laptop CPU', short: 'CPU' },
  'free-colab-t4': { label: 'Free Colab T4 GPU', short: 'Colab T4' },
  'needs-gpu-subset': { label: 'GPU, or start with a subset', short: 'GPU / subset' },
};

export const BADGES: Record<BadgeId, Badge> = {
  'no-signup': { id: 'no-signup', label: 'No signup', hint: 'Works without an account or API key.' },
  'no-card': { id: 'no-card', label: 'No credit card', hint: 'The free tier never asks for a payment method.' },
  'commercial-ok': { id: 'commercial-ok', label: 'Commercial OK', hint: 'The license or terms allow use in a paid product.' },
  'laptop-friendly': { id: 'laptop-friendly', label: 'Laptop-friendly', hint: 'Small enough to train or query on a normal laptop.' },
  beginner: { id: 'beginner', label: 'Beginner pick', hint: 'Clean, well documented, and widely used in tutorials.' },
  'one-liner': { id: 'one-liner', label: 'One-line load', hint: 'A single function call gets you the data.' },
};

export const CATEGORIES: Category[] = [
  {
    id: 'nlp',
    name: 'Language datasets',
    short: 'NLP',
    description: 'Text corpora for classification, question answering and language modelling.',
    blurb: 'Open text datasets for sentiment, QA, topic classification and language modelling projects.',
  },
  {
    id: 'vision',
    name: 'Vision datasets',
    short: 'Vision',
    description: 'Image datasets from first CNN to object detection.',
    blurb: 'Image datasets that run on a laptop, plus COCO for when you are ready for detection.',
  },
  {
    id: 'tabular',
    name: 'Tabular datasets',
    short: 'Tabular',
    description: 'Small, clean tables for regression, classification and EDA.',
    blurb: 'Small tabular datasets for classic machine learning, feature engineering and data-viz practice.',
  },
  {
    id: 'audio',
    name: 'Audio & speech datasets',
    short: 'Audio',
    description: 'Speech, sound-event and keyword datasets.',
    blurb: 'Open audio datasets for speech recognition, keyword spotting and sound classification.',
  },
  {
    id: 'llm-apis',
    name: 'Free LLM & model APIs',
    short: 'LLM APIs',
    description: 'Hosted and local ways to call language models for free.',
    blurb: 'Free-tier language model APIs, and one fully local option, for prototypes and course projects.',
  },
  {
    id: 'data-apis',
    name: 'Free data APIs',
    short: 'Data APIs',
    description: 'Keyless or free-key APIs that feed live data into a project.',
    blurb: 'Free APIs for weather, currency, encyclopedic text, space imagery and dataset previews.',
  },
];

export const entries: Entry[] = [
  // ---------------------------------------------------------------- NLP
  {
    slug: 'imdb-reviews',
    name: 'IMDB Movie Reviews',
    kind: 'dataset',
    category: 'nlp',
    summary: '50,000 labelled movie reviews for binary sentiment classification.',
    description:
      'The Large Movie Review Dataset has 25,000 training and 25,000 test reviews, evenly split between positive and negative. It is the standard first project for text classification, from bag-of-words baselines to fine-tuning a small transformer.',
    url: 'https://huggingface.co/datasets/stanfordnlp/imdb',
    docsUrl: 'https://huggingface.co/datasets/stanfordnlp/imdb',
    provider: 'Stanford (Maas et al.)',
    license: 'Research use, no formal license',
    access: 'open',
    format: 'Parquet via Hugging Face',
    sizeMB: 84,
    badges: ['no-signup', 'no-card', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['sentiment', 'classification', 'text', 'english'],
    useCases: ['Sentiment classifier baseline', 'Fine-tune DistilBERT', 'Compare TF-IDF vs embeddings'],
    gotchas: [
      'Reviews contain HTML line breaks (<br />), so clean them first.',
      'The license is not explicit: fine for coursework, check before shipping a product.',
    ],
    hardware: 'laptop-cpu',
    samples: '50,000 reviews',
    timeToBaseline: '~1 min on CPU',
    preprocessingTips: [
      'Reviews contain HTML `<br />` tags; strip them before tokenizing or they become your most frequent "word".',
      'The test split is as large as train. Carve a validation set out of train and touch test only once, for the final number.',
      'Reviews average ~230 words with a long tail past 1,000. Truncate to 256–512 tokens for transformers and note what you cut.',
    ],
    baselineBenchmark: 'TF-IDF (1–2 grams) + logistic regression: ~88–90% test accuracy in about a minute on CPU. Fine-tuned DistilBERT: ~92–93% in ~20 min on a T4.',
    snippet: {
      lang: 'python',
      title: 'Load and peek',
      code: `from datasets import load_dataset

ds = load_dataset("stanfordnlp/imdb")
print(ds["train"][0]["text"][:200])
print(ds["train"].features["label"].names)  # ['neg', 'pos']`,
    },
  },
  {
    slug: 'squad-2',
    name: 'SQuAD 2.0',
    kind: 'dataset',
    category: 'nlp',
    summary: 'Reading-comprehension questions, including ones with no answer in the text.',
    description:
      'SQuAD 2.0 combines 100,000+ answerable questions with 50,000+ unanswerable ones written to look similar. A model has to know when to say "no answer", which makes it a good benchmark for extractive QA.',
    url: 'https://huggingface.co/datasets/rajpurkar/squad_v2',
    docsUrl: 'https://rajpurkar.github.io/SQuAD-explorer/',
    provider: 'Stanford NLP',
    license: 'CC BY-SA 4.0',
    access: 'open',
    format: 'Parquet via Hugging Face',
    sizeMB: 45,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'one-liner'],
    tags: ['question-answering', 'reading-comprehension', 'extractive'],
    useCases: ['Fine-tune an extractive QA model', 'Evaluate with exact match and F1', 'Build a document Q&A demo'],
    gotchas: [
      'Unanswerable questions have empty answer lists, so index carefully.',
      'CC BY-SA means derivative datasets must be shared under the same license.',
    ],
    hardware: 'free-colab-t4',
    samples: '~142,000 questions',
    timeToBaseline: '~1.5 h on a T4',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    preprocessingTips: [
      'About a third of training questions are unanswerable (empty `answers.text`). Handle them explicitly instead of indexing `text[0]`.',
      'Contexts longer than the model limit need a sliding window (stride ~128 tokens), or answers near the end are silently cut off.',
      'There is no public test set. If you hold out data from train, split by article title, not by question, so the same passage never lands on both sides.',
    ],
    baselineBenchmark: 'Fine-tuned DistilBERT (2 epochs): ~65–72 F1 on the dev set in ~1.5 h on a T4. Always predicting "no answer" scores ~50 F1, so beat that first.',
    snippet: {
      lang: 'python',
      title: 'Read a question and its answer',
      code: `from datasets import load_dataset

squad = load_dataset("rajpurkar/squad_v2", split="validation")
ex = squad[0]
answers = ex["answers"]["text"]  # empty list when the question is unanswerable
print(ex["question"], "->", answers[0] if answers else "(no answer)")`,
    },
  },
  {
    slug: 'glue-benchmark',
    name: 'GLUE Benchmark',
    kind: 'dataset',
    category: 'nlp',
    summary: 'Nine sentence-level language understanding tasks behind one loader.',
    description:
      'GLUE bundles tasks such as sentiment (SST-2), paraphrase detection (MRPC) and natural language inference (MNLI). Pick one small task, such as SST-2 or RTE, to iterate quickly on a laptop.',
    url: 'https://huggingface.co/datasets/nyu-mll/glue',
    docsUrl: 'https://gluebenchmark.com/',
    provider: 'NYU, UW, DeepMind',
    license: 'Mixed (set per task)',
    access: 'open',
    format: 'Parquet via Hugging Face',
    sizeMB: 300,
    badges: ['no-signup', 'no-card', 'beginner', 'one-liner'],
    tags: ['benchmark', 'nli', 'sentiment', 'paraphrase'],
    useCases: ['Benchmark a fine-tuned encoder', 'Learn the Trainer API on SST-2', 'Course assignment on transfer learning'],
    gotchas: [
      'Each task has its own license; read the source paper before redistributing any one of them.',
      'Test labels are hidden (-1), so evaluate on the validation split.',
    ],
    hardware: 'free-colab-t4',
    samples: '9 tasks, ~950,000 training examples',
    timeToBaseline: '~30 min on a T4 (SST-2)',
    preprocessingTips: [
      'Test labels are hidden (all set to -1). Evaluate on validation; test scores come only from the GLUE leaderboard server.',
      'Each task has its own metric: Matthews correlation for CoLA, F1 and accuracy for MRPC and QQP, Pearson/Spearman for STS-B. Report the right one.',
      'MNLI ships matched and mismatched validation sets. Report both, since the gap shows how well the model generalises across genres.',
    ],
    baselineBenchmark: 'Fine-tuned bert-base on SST-2: ~92–93% validation accuracy in ~30 min on a T4. TF-IDF + logistic regression on SST-2: ~80–82% on CPU.',
    snippet: {
      lang: 'python',
      title: 'Load one task',
      code: `from datasets import load_dataset

sst2 = load_dataset("nyu-mll/glue", "sst2")
print(sst2["train"][0])  # {'sentence': ..., 'label': 0 or 1, 'idx': 0}`,
    },
  },
  {
    slug: 'ag-news',
    name: 'AG News',
    kind: 'dataset',
    category: 'nlp',
    summary: '120,000 news headlines in four topic classes.',
    description:
      'AG News contains short title-and-description pairs labelled World, Sports, Business or Sci/Tech. It is balanced, short and fast to train on, which makes it ideal for comparing classical and neural text classifiers.',
    url: 'https://huggingface.co/datasets/fancyzhx/ag_news',
    docsUrl: 'https://huggingface.co/datasets/fancyzhx/ag_news',
    provider: 'Zhang, Zhao & LeCun',
    license: 'Non-commercial research use',
    access: 'open',
    format: 'Parquet via Hugging Face',
    sizeMB: 31,
    badges: ['no-signup', 'no-card', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['topic-classification', 'news', 'text'],
    useCases: ['Naive Bayes vs logistic regression', 'Zero-shot vs fine-tuned comparison', 'Topic classifier demo'],
    gotchas: ['Non-commercial terms: do not put a model trained on it into a paid product.'],
    hardware: 'laptop-cpu',
    samples: '127,600 articles',
    timeToBaseline: '~1 min on CPU',
    preprocessingTips: [
      'Only train (120,000) and test (7,600) exist. Split a stratified validation set from train.',
      'Text contains escaped artifacts such as `#39;` (apostrophes) and stray backslashes. Clean them up before tokenizing.',
      'Classes are perfectly balanced (30,000 each in train), so plain accuracy is a fair headline metric here.',
    ],
    baselineBenchmark: 'TF-IDF + linear SVM or logistic regression: ~91–92% test accuracy in about a minute on CPU. Fine-tuned BERT reaches ~94–95% on a T4.',
    snippet: {
      lang: 'python',
      title: 'Load and count classes',
      code: `from collections import Counter
from datasets import load_dataset

ds = load_dataset("fancyzhx/ag_news", split="train")
names = ds.features["label"].names
print(Counter(names[i] for i in ds["label"]))`,
    },
  },
  {
    slug: 'wikitext-103',
    name: 'WikiText-103',
    kind: 'dataset',
    category: 'nlp',
    summary: '100M+ tokens of verified Good and Featured Wikipedia articles.',
    description:
      'WikiText-103 is the classic language modelling corpus: long, clean articles that keep punctuation and casing. Use the smaller WikiText-2 variant, from the same loader, when you only need a quick experiment.',
    url: 'https://huggingface.co/datasets/Salesforce/wikitext',
    docsUrl: 'https://blog.salesforceairesearch.com/the-wikitext-long-term-dependency-language-modeling-dataset/',
    provider: 'Salesforce Research',
    license: 'CC BY-SA',
    access: 'open',
    format: 'Parquet via Hugging Face',
    sizeMB: 300,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'one-liner'],
    tags: ['language-modeling', 'wikipedia', 'perplexity'],
    useCases: ['Train a small GPT from scratch', 'Measure perplexity', 'Tokenizer experiments'],
    gotchas: [
      'Use the "raw" configs to keep original text; the others replace rare words with <unk>.',
      'Start with wikitext-2-raw-v1 to avoid a few hundred MB while debugging.',
    ],
    hardware: 'needs-gpu-subset',
    samples: '~103 million tokens',
    timeToBaseline: '~30 min on a T4 (WikiText-2)',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    preprocessingTips: [
      'Use the `raw` config if you plan to train your own tokenizer; the default config has rare words already replaced by `<unk>`.',
      'Lines are paragraph-level, with ` = Heading = ` markers and blank lines. Concatenate and chunk into fixed-length blocks instead of training on single lines.',
      'The full 103M tokens is too much for a free GPU session. Prototype on WikiText-2 (same format, ~2M tokens) first.',
    ],
    baselineBenchmark: 'Small LSTM on WikiText-2: ~90–110 test perplexity in ~30 min on a T4. Zero-shot GPT-2 small scores ~37 perplexity on WikiText-103, which is a useful bar to beat.',
    snippet: {
      lang: 'python',
      title: 'Load the raw variant',
      code: `from datasets import load_dataset

wt = load_dataset("Salesforce/wikitext", "wikitext-103-raw-v1")
print(wt)  # train / validation / test splits of text lines`,
    },
  },

  // ------------------------------------------------------------- Vision
  {
    slug: 'mnist',
    name: 'MNIST',
    kind: 'dataset',
    category: 'vision',
    summary: '70,000 handwritten digits as 28x28 grayscale images.',
    description:
      'The "hello world" of computer vision. It trains in seconds on a CPU and works for every course from logistic regression to your first CNN.',
    url: 'https://huggingface.co/datasets/ylecun/mnist',
    docsUrl: 'http://yann.lecun.com/exdb/mnist/',
    provider: 'Yann LeCun et al.',
    license: 'MIT (per Hugging Face card)',
    access: 'open',
    format: 'Parquet / IDX',
    sizeMB: 15,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['digits', 'classification', 'cnn', 'grayscale'],
    useCases: ['First CNN', 'Visualise embeddings with t-SNE or UMAP', 'Test a training loop end to end'],
    gotchas: ['Too easy for benchmarking modern models; use Fashion-MNIST or CIFAR-10 for a real challenge.'],
    hardware: 'laptop-cpu',
    samples: '70,000 images',
    timeToBaseline: '~2 min on CPU',
    licenseUrl: 'https://spdx.org/licenses/MIT.html',
    preprocessingTips: [
      'Scale pixels to [0, 1] and keep the official 60,000 / 10,000 split so your number compares with published results.',
      'Hold out the last 5,000 training images for validation. Early-stopping on the test set is the most common MNIST leak.',
    ],
    baselineBenchmark: 'Logistic regression: ~92% test accuracy in under a minute on CPU. A two-layer CNN: ~99% in a few minutes on CPU.',
    snippet: {
      lang: 'python',
      title: 'Load as NumPy',
      code: `from datasets import load_dataset
import numpy as np

mnist = load_dataset("ylecun/mnist", split="train")
x = np.array(mnist[0]["image"])
print(x.shape, mnist[0]["label"])  # (28, 28) 5`,
    },
  },
  {
    slug: 'cifar-10',
    name: 'CIFAR-10',
    kind: 'dataset',
    category: 'vision',
    summary: '60,000 tiny 32x32 colour images across 10 classes.',
    description:
      'CIFAR-10 is the usual next step after MNIST: colour images, real objects and enough difficulty to need a proper CNN. It is small enough for a free Colab GPU to train in minutes.',
    url: 'https://huggingface.co/datasets/uoft-cs/cifar10',
    docsUrl: 'https://www.cs.toronto.edu/~kriz/cifar.html',
    provider: 'University of Toronto (Krizhevsky)',
    license: 'Free for research, cite Krizhevsky (2009)',
    access: 'open',
    format: 'Parquet / pickled batches',
    sizeMB: 163,
    badges: ['no-signup', 'no-card', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['image-classification', 'cnn', 'rgb'],
    useCases: ['Train a ResNet from scratch', 'Data augmentation experiments', 'Compare optimisers'],
    gotchas: ['There is no formal license, so cite the technical report and stay with research or coursework.'],
    hardware: 'free-colab-t4',
    samples: '60,000 images',
    timeToBaseline: '~10 min on CPU (small CNN)',
    preprocessingTips: [
      'Compute per-channel mean and std on the training set only, then apply them to validation and test.',
      'Use random crop (pad 4) + horizontal flip. Without augmentation, small CNNs start overfitting within a few epochs.',
      'Hold out 5,000 training images for validation. The 10,000 test images are for the final number only.',
    ],
    baselineBenchmark: 'Small CNN: ~70–75% test accuracy in ~10 min on CPU. ResNet-18 with augmentation and fp16: ~93–95% in ~30–40 min on a T4.',
    snippet: {
      lang: 'python',
      title: 'Load and view a sample',
      code: `from datasets import load_dataset

cifar = load_dataset("uoft-cs/cifar10", split="train")
sample = cifar[0]
print(sample["img"].size, cifar.features["label"].names[sample["label"]])`,
    },
  },
  {
    slug: 'fashion-mnist',
    name: 'Fashion-MNIST',
    kind: 'dataset',
    category: 'vision',
    summary: 'A harder drop-in replacement for MNIST using clothing images.',
    description:
      'Fashion-MNIST has the same size and format as MNIST (70,000 28x28 images, 10 classes), but with clothing items, so models cannot hit 99% with a trivial baseline. It is the easiest upgrade when MNIST stops being informative.',
    url: 'https://huggingface.co/datasets/zalando-datasets/fashion_mnist',
    docsUrl: 'https://github.com/zalandoresearch/fashion-mnist',
    provider: 'Zalando Research',
    license: 'MIT',
    access: 'open',
    format: 'Parquet / IDX',
    sizeMB: 30,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['clothing', 'classification', 'grayscale'],
    useCases: ['Benchmark small CNNs', 'Confusion-matrix analysis (shirt vs T-shirt)', 'Intro to PyTorch'],
    gotchas: ['Several classes (shirt, T-shirt, pullover) overlap, so expect a ceiling near 93-95% for small models.'],
    hardware: 'laptop-cpu',
    samples: '70,000 images',
    timeToBaseline: '~2 min on CPU',
    licenseUrl: 'https://spdx.org/licenses/MIT.html',
    preprocessingTips: [
      'Shirt, T-shirt/top, pullover and coat are constantly confused with each other. Read the confusion matrix, not just accuracy.',
      'Same 28×28 format as MNIST: scale to [0, 1] and hold out validation from the 60,000 training images.',
    ],
    baselineBenchmark: 'Logistic regression: ~84% test accuracy in about a minute on CPU. Small CNN: ~91–93% in a few minutes on CPU.',
    snippet: {
      lang: 'python',
      title: 'Load and list classes',
      code: `from datasets import load_dataset

fm = load_dataset("zalando-datasets/fashion_mnist", split="train")
print(fm.features["label"].names)
fm[0]["image"].resize((140, 140)).save("sample.png")`,
    },
  },
  {
    slug: 'oxford-iiit-pet',
    name: 'Oxford-IIIT Pet',
    kind: 'dataset',
    category: 'vision',
    summary: '7,000+ photos of 37 cat and dog breeds, with segmentation masks.',
    description:
      'Real photos with breed labels, head bounding boxes and pixel-level trimaps. It is a good size for transfer learning with a pretrained backbone, and the masks also support a segmentation project.',
    url: 'https://huggingface.co/datasets/timm/oxford-iiit-pet',
    docsUrl: 'https://www.robots.ox.ac.uk/~vgg/data/pets/',
    provider: 'Oxford VGG',
    license: 'CC BY-SA 4.0',
    access: 'open',
    format: 'Images + XML / trimaps',
    sizeMB: 800,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'one-liner'],
    tags: ['fine-grained', 'transfer-learning', 'segmentation'],
    useCases: ['Fine-tune a pretrained ResNet or ViT', 'Fine-grained classification', 'Segmentation starter project'],
    gotchas: ['Breed classes are imbalanced between cats and dogs; stratify your splits.'],
    hardware: 'free-colab-t4',
    samples: '7,349 images',
    timeToBaseline: '~15 min on a T4',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    preprocessingTips: [
      '37 fine-grained breeds with ~200 images each. Start from a pretrained backbone; training from scratch will underfit.',
      'Images vary in size and aspect ratio. Resize and center-crop to 224 px and keep the official trainval / test split.',
      'Trimap masks use 1 = pet, 2 = background, 3 = border. Remap to 0-indexed classes before training a segmentation model.',
    ],
    baselineBenchmark: 'Fine-tuned ResNet-50 (ImageNet weights): ~88–92% breed accuracy in ~15 min on a T4.',
    snippet: {
      lang: 'python',
      title: 'Load the timm copy',
      code: `from datasets import load_dataset

pets = load_dataset("timm/oxford-iiit-pet", split="train")
row = pets[0]
print(row["image"].size, row["label"], row.get("label_cat_dog"))`,
    },
  },
  {
    slug: 'coco-2017',
    name: 'COCO 2017',
    kind: 'dataset',
    category: 'vision',
    summary: 'The standard benchmark for object detection, segmentation and captioning.',
    description:
      'COCO has 330,000 images with 80 object categories, instance masks, keypoints and captions. Download only the 1 GB validation set to prototype a detector, and leave the 18 GB training set for later.',
    url: 'https://cocodataset.org/',
    docsUrl: 'https://cocodataset.org/#download',
    provider: 'COCO Consortium',
    license: 'Annotations CC BY 4.0; images under Flickr terms',
    access: 'open',
    format: 'JPEG + JSON annotations',
    sizeMB: 20000,
    badges: ['no-signup', 'no-card'],
    tags: ['object-detection', 'segmentation', 'captioning', 'benchmark'],
    useCases: ['Fine-tune YOLO or DETR', 'Train a captioning model', 'Evaluate with pycocotools'],
    gotchas: [
      'The full set is about 20 GB. Start with val2017 (1 GB) plus annotations.',
      'Image licenses vary per photo; check the license field in the annotations before redistributing images.',
    ],
    hardware: 'needs-gpu-subset',
    samples: '~123,000 images (train + val)',
    timeToBaseline: '~5 min on a T4 (pretrained eval)',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    preprocessingTips: [
      'Download the annotations first and pick a subset (a few classes, or ~5,000 images) with pycocotools before pulling 18 GB of images.',
      'Boxes are `[x, y, width, height]` in pixels. Convert to the format your model expects (x1, y1, x2, y2 or normalised cx, cy, w, h).',
      'Annotations with `iscrowd=1` use RLE masks for groups of objects. Most training code excludes them from the box loss.',
    ],
    baselineBenchmark: 'Pretrained YOLO nano models score ~37–40 box mAP@50:95 on val2017 out of the box. Fine-tuning on a 5,000-image subset fits a free T4 session.',
    snippet: {
      lang: 'bash',
      title: 'Download validation images and annotations',
      code: `curl -O http://images.cocodataset.org/zips/val2017.zip
curl -O http://images.cocodataset.org/annotations/annotations_trainval2017.zip
unzip -q val2017.zip && unzip -q annotations_trainval2017.zip`,
    },
  },

  // ------------------------------------------------------------ Tabular
  {
    slug: 'iris',
    name: 'Iris',
    kind: 'dataset',
    category: 'tabular',
    summary: '150 flowers, four measurements, three species.',
    description:
      'Fisher\'s 1936 dataset is still the best way to learn the machine learning workflow: split, fit, evaluate. It ships with scikit-learn, so no download is needed.',
    url: 'https://archive.ics.uci.edu/dataset/53/iris',
    docsUrl: 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html',
    provider: 'UCI Machine Learning Repository',
    license: 'CC BY 4.0',
    access: 'open',
    format: 'CSV / scikit-learn loader',
    sizeMB: 0.01,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['classification', 'toy', 'sklearn'],
    useCases: ['Your first classifier', 'Decision-tree visualisation', 'Teaching cross-validation'],
    gotchas: ['It is tiny and nearly separable, so accuracy near 100% says little about your method.'],
    hardware: 'laptop-cpu',
    samples: '150 rows',
    timeToBaseline: '< 1 s on CPU',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    preprocessingTips: [
      'With only 150 rows, use stratified k-fold cross-validation instead of a single train/test split.',
      'Setosa is linearly separable. Every error you see will be versicolor vs virginica, so inspect those rows.',
    ],
    baselineBenchmark: 'Logistic regression, 5-fold CV: ~95–97% accuracy in well under a second on CPU.',
    snippet: {
      lang: 'python',
      title: 'Load as a DataFrame',
      code: `from sklearn.datasets import load_iris

iris = load_iris(as_frame=True)
df = iris.frame
print(df.head())
print(iris.target_names)`,
    },
  },
  {
    slug: 'titanic',
    name: 'Titanic Passengers',
    kind: 'dataset',
    category: 'tabular',
    summary: 'Survival outcomes for 1,309 passengers, with missing values included.',
    description:
      'A messy mix of numeric, categorical and missing data. It teaches feature engineering and imputation, which clean toy datasets skip.',
    url: 'https://www.openml.org/search?type=data&id=40945',
    docsUrl: 'https://www.openml.org/search?type=data&id=40945',
    provider: 'OpenML',
    license: 'Public (OpenML listing)',
    access: 'open',
    format: 'ARFF via OpenML',
    sizeMB: 0.1,
    badges: ['no-signup', 'no-card', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['classification', 'feature-engineering', 'missing-data'],
    useCases: ['Imputation strategies', 'Compare tree models', 'Write your first Kaggle-style notebook'],
    gotchas: ['Do not let "boat" or "body" columns leak the target into your features.'],
    hardware: 'laptop-cpu',
    samples: '1,309 rows',
    timeToBaseline: '< 5 s on CPU',
    preprocessingTips: [
      'The `boat` and `body` columns record what happened after the sinking. Drop them, or you leak the label.',
      '`age` is missing for ~20% of rows and `cabin` for ~77%. Impute age (e.g. by title parsed from `name`) and turn cabin into a has-cabin flag.',
      'Families share a `ticket` number. Group cross-validation folds by ticket to avoid optimistic scores.',
    ],
    baselineBenchmark: 'Logistic regression or gradient boosting on sex, class, age and fare: ~0.78–0.82 accuracy (5-fold CV) in seconds on CPU.',
    snippet: {
      lang: 'python',
      title: 'Fetch from OpenML',
      code: `from sklearn.datasets import fetch_openml

titanic = fetch_openml("titanic", version=1, as_frame=True)
df = titanic.frame
print(df.shape, df["survived"].value_counts().to_dict())`,
    },
  },
  {
    slug: 'california-housing',
    name: 'California Housing',
    kind: 'dataset',
    category: 'tabular',
    summary: '20,640 census block groups with median house value as the target.',
    description:
      'Eight numeric features and a continuous target make this the default regression dataset. It is large enough to expose overfitting and small enough for gradient boosting in seconds.',
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html',
    docsUrl: 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html',
    provider: 'scikit-learn (1990 US Census)',
    license: 'Public (US Census derived)',
    access: 'open',
    format: 'scikit-learn loader',
    sizeMB: 2,
    badges: ['no-signup', 'no-card', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['regression', 'geospatial', 'sklearn'],
    useCases: ['Regression baseline', 'Plot predictions on a map', 'Compare linear vs boosted models'],
    gotchas: ['Target values are capped at $500,000, which clips the top of the distribution.'],
    hardware: 'laptop-cpu',
    samples: '20,640 rows',
    timeToBaseline: '< 10 s on CPU',
    preprocessingTips: [
      'The target is capped at 5.0 ($500k) and ~1,000 districts sit on the cap. Flag or drop them, or the model learns the ceiling.',
      'Neighbouring districts are correlated, so random splits look better than reality. Try a spatial split on latitude/longitude.',
      '`AveRooms` and `AveOccup` have extreme outliers. Use robust scaling or tree-based models.',
    ],
    baselineBenchmark: 'Linear regression: ~0.72–0.74 RMSE (in $100k units). HistGradientBoosting: ~0.45–0.50 RMSE, R² ~0.83–0.85, in seconds on CPU.',
    snippet: {
      lang: 'python',
      title: 'Load and fit a baseline',
      code: `from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split

X, y = fetch_california_housing(return_X_y=True, as_frame=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)
print(HistGradientBoostingRegressor().fit(X_tr, y_tr).score(X_te, y_te))`,
    },
  },
  {
    slug: 'palmer-penguins',
    name: 'Palmer Penguins',
    kind: 'dataset',
    category: 'tabular',
    summary: 'A friendlier Iris: 344 penguins, three species, mixed feature types.',
    description:
      'Measurements of bill, flipper and body mass from three Antarctic species, plus island and sex. It is released under CC0, so you can use it in any course material, post or product.',
    url: 'https://github.com/allisonhorst/palmerpenguins',
    docsUrl: 'https://allisonhorst.github.io/palmerpenguins/',
    provider: 'Horst, Hill & Gorman',
    license: 'CC0',
    access: 'open',
    format: 'CSV (seaborn / R package)',
    sizeMB: 0.02,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'beginner', 'one-liner'],
    tags: ['classification', 'eda', 'visualisation'],
    useCases: ['EDA and plotting practice', 'Clustering demo', 'Classifier with mixed numeric and categorical features'],
    gotchas: ['A handful of rows have missing measurements, so decide on drop or impute.'],
    hardware: 'laptop-cpu',
    samples: '344 rows',
    timeToBaseline: '< 1 s on CPU',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    preprocessingTips: [
      '`sex` is missing for 11 rows and 2 rows have no measurements at all. Drop or impute before fitting.',
      'Stratify splits by species. Chinstrap has only 68 rows and can vanish from a small random test set.',
    ],
    baselineBenchmark: 'Logistic regression on the four body measurements: ~97–99% species accuracy (5-fold CV) in under a second.',
    snippet: {
      lang: 'python',
      title: 'Load with seaborn',
      code: `import seaborn as sns

penguins = sns.load_dataset("penguins").dropna()
print(penguins.groupby("species").mean(numeric_only=True))`,
    },
  },
  {
    slug: 'wine-quality',
    name: 'Wine Quality',
    kind: 'dataset',
    category: 'tabular',
    summary: '6,497 Portuguese wines with 11 lab measurements and a quality score.',
    description:
      'Works as regression (predict the score) or classification (good vs average). The imbalance across quality levels makes it a useful lesson in picking the right metric.',
    url: 'https://archive.ics.uci.edu/dataset/186/wine+quality',
    docsUrl: 'https://archive.ics.uci.edu/dataset/186/wine+quality',
    provider: 'UCI Machine Learning Repository',
    license: 'CC BY 4.0',
    access: 'open',
    format: 'CSV via ucimlrepo',
    sizeMB: 0.4,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'beginner'],
    tags: ['regression', 'classification', 'imbalanced'],
    useCases: ['Regression vs classification framing', 'Feature importance', 'Handling class imbalance'],
    gotchas: ['Most wines score 5-7. Accuracy looks fine while rare classes are missed.'],
    hardware: 'laptop-cpu',
    samples: '6,497 rows',
    timeToBaseline: '< 10 s on CPU',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    preprocessingTips: [
      'There are ~1,100 duplicate rows. Deduplicate before splitting, or identical wines leak from train into test.',
      'Scores are imbalanced (mostly 5–6, almost no 3 or 9). Use stratified splits and report macro-F1 or MAE, not just accuracy.',
      'Red and white wines have different distributions. Add a `color` feature or model them separately.',
    ],
    baselineBenchmark: 'Random forest regression: ~0.55–0.60 MAE on the quality score. As a good (≥ 7) vs not classifier: ~0.85–0.90 ROC-AUC, in seconds on CPU.',
    snippet: {
      lang: 'python',
      title: 'Fetch with ucimlrepo',
      code: `# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo

wine = fetch_ucirepo(id=186)
X, y = wine.data.features, wine.data.targets
print(X.shape, y["quality"].value_counts().sort_index().to_dict())`,
    },
  },

  // -------------------------------------------------------------- Audio
  {
    slug: 'speech-commands',
    name: 'Speech Commands v2',
    kind: 'dataset',
    category: 'audio',
    summary: '105,000 one-second clips of 35 spoken words.',
    description:
      'Built for keyword spotting: "yes", "no", "up", "down", digits and more, from thousands of speakers. Short clips and a fixed length make it easy to feed a CNN on spectrograms.',
    url: 'https://huggingface.co/datasets/google/speech_commands',
    docsUrl: 'https://arxiv.org/abs/1804.03209',
    provider: 'Google (Pete Warden)',
    license: 'CC BY 4.0',
    access: 'open',
    format: 'WAV, 16 kHz',
    sizeMB: 2300,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'beginner', 'one-liner'],
    tags: ['keyword-spotting', 'speech', 'spectrogram'],
    useCases: ['Wake-word detector', 'CNN on mel spectrograms', 'TinyML on a microcontroller'],
    gotchas: ['The full download is about 2.3 GB; use the validation split while debugging.'],
    hardware: 'free-colab-t4',
    samples: '~105,000 clips',
    timeToBaseline: '~20 min on a T4',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    preprocessingTips: [
      'Use the official `validation_list.txt` and `testing_list.txt`. They keep each speaker in exactly one split.',
      'Some clips are shorter than one second. Zero-pad to 16,000 samples before computing features.',
      '`_background_noise_` holds long recordings, not labelled clips. Use them for augmentation or to build the silence class.',
    ],
    baselineBenchmark: 'Small CNN on log-mel spectrograms (12-class task): ~90–95% test accuracy in ~20 min on a T4.',
    snippet: {
      lang: 'python',
      title: 'Stream a few clips',
      code: `from datasets import load_dataset

sc = load_dataset("google/speech_commands", "v0.02", split="validation", streaming=True)
clip = next(iter(sc))
print(clip["label"], clip["audio"]["sampling_rate"], len(clip["audio"]["array"]))`,
    },
  },
  {
    slug: 'librispeech',
    name: 'LibriSpeech',
    kind: 'dataset',
    category: 'audio',
    summary: '1,000 hours of read English speech with transcripts.',
    description:
      'The standard dataset for speech recognition research, derived from public-domain audiobooks. Start with the 337 MB dev-clean subset before touching the 60 GB full corpus.',
    url: 'https://www.openslr.org/12',
    docsUrl: 'https://www.openslr.org/12',
    provider: 'OpenSLR',
    license: 'CC BY 4.0',
    access: 'open',
    format: 'FLAC, 16 kHz + text',
    sizeMB: 337,
    badges: ['no-signup', 'no-card', 'commercial-ok'],
    tags: ['asr', 'speech-recognition', 'transcripts'],
    useCases: ['Evaluate Whisper or wav2vec2', 'Fine-tune a small ASR model', 'Forced alignment practice'],
    gotchas: ['Training sets run to tens of GB. The size shown here is only dev-clean.'],
    hardware: 'free-colab-t4',
    samples: '2,703 utterances (~5.4 h)',
    timeToBaseline: '~10 min on a T4',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    preprocessingTips: [
      'Transcripts are uppercase with no punctuation. Normalise model output the same way before computing WER.',
      'dev-clean speakers never appear in the training sets. Keep it that way if you combine splits.',
      'Utterances run up to ~35 s. Batch by length to cut padding and avoid out-of-memory errors.',
    ],
    baselineBenchmark: 'Whisper small or wav2vec2-base-960h, zero-shot: ~3–4% WER on dev-clean in ~10 min on a T4.',
    snippet: {
      lang: 'bash',
      title: 'Download the dev-clean subset',
      code: `curl -O https://www.openslr.org/resources/12/dev-clean.tar.gz
tar -xzf dev-clean.tar.gz
ls LibriSpeech/dev-clean | head`,
    },
  },
  {
    slug: 'esc-50',
    name: 'ESC-50',
    kind: 'dataset',
    category: 'audio',
    summary: '2,000 five-second environmental sound clips in 50 classes.',
    description:
      'Dog barks, rain, sirens, clocks and more, pre-split into five folds for cross-validation. A small, clean dataset for sound classification with spectrograms or pretrained audio embeddings.',
    url: 'https://github.com/karolpiczak/ESC-50',
    docsUrl: 'https://github.com/karolpiczak/ESC-50#readme',
    provider: 'Karol Piczak',
    license: 'CC BY-NC 3.0',
    access: 'open',
    format: 'WAV + CSV metadata',
    sizeMB: 600,
    badges: ['no-signup', 'no-card', 'laptop-friendly', 'beginner'],
    tags: ['sound-classification', 'environmental', 'spectrogram'],
    useCases: ['Audio classification with a CNN', 'Transfer learning from AudioSet models', 'Spectrogram augmentation'],
    gotchas: ['Non-commercial license. Use the provided folds to avoid train/test leakage.'],
    hardware: 'free-colab-t4',
    samples: '2,000 clips',
    timeToBaseline: '~10 min on a T4',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc/3.0/',
    preprocessingTips: [
      'Always use the five predefined folds. Clips cut from the same source recording share a fold, and random splits leak.',
      'Many clips are padded with silence. Pad or trim every clip to exactly 5 s.',
      'With only 40 clips per class, use pretrained audio embeddings (PANNs, AST or CLAP) instead of training from scratch.',
    ],
    baselineBenchmark: 'Linear classifier on pretrained audio embeddings: ~85–95% 5-fold accuracy. A from-scratch CNN on log-mels: ~65–75%. Humans score ~81%.',
    snippet: {
      lang: 'python',
      title: 'Clone and read metadata',
      code: `import subprocess, pandas as pd

subprocess.run(["git", "clone", "--depth", "1", "https://github.com/karolpiczak/ESC-50.git"], check=True)
meta = pd.read_csv("ESC-50/meta/esc50.csv")
print(meta[["filename", "fold", "category"]].head())`,
    },
  },
  {
    slug: 'lj-speech',
    name: 'LJ Speech',
    kind: 'dataset',
    category: 'audio',
    summary: '13,100 clips of one speaker reading, in the public domain.',
    description:
      'About 24 hours of a single female speaker reading non-fiction books, each clip paired with its transcript. It is the go-to dataset for text-to-speech experiments.',
    url: 'https://keithito.com/LJ-Speech-Dataset/',
    docsUrl: 'https://keithito.com/LJ-Speech-Dataset/',
    provider: 'Keith Ito',
    license: 'Public domain',
    access: 'open',
    format: 'WAV, 22.05 kHz + CSV',
    sizeMB: 2600,
    badges: ['no-signup', 'no-card', 'commercial-ok'],
    tags: ['tts', 'speech-synthesis', 'single-speaker'],
    useCases: ['Train or fine-tune a TTS model', 'Voice-cloning experiments', 'Alignment and prosody analysis'],
    gotchas: ['Single speaker, single accent: models will not generalise to other voices.'],
    hardware: 'needs-gpu-subset',
    samples: '13,100 clips (~24 h)',
    timeToBaseline: '2–4 h fine-tune on a T4',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    preprocessingTips: [
      'It is a single speaker. Great for TTS, but useless for claims about generalising to other voices.',
      'Use the normalised transcription (third column of `metadata.csv`), where numbers and abbreviations are spelled out.',
      'Trim leading and trailing silence; it speeds up alignment and stabilises attention-based models.',
    ],
    baselineBenchmark: 'Fine-tuning a pretrained VITS or Tacotron 2 checkpoint gives intelligible speech after ~2–4 h on a T4. Training from scratch takes days on one GPU.',
    snippet: {
      lang: 'bash',
      title: 'Download and inspect',
      code: `curl -O https://data.keithito.com/data/speech/LJSpeech-1.1.tar.bz2
tar -xjf LJSpeech-1.1.tar.bz2
head -n 3 LJSpeech-1.1/metadata.csv`,
    },
  },
  {
    slug: 'free-spoken-digit',
    name: 'Free Spoken Digit Dataset',
    kind: 'dataset',
    category: 'audio',
    summary: 'Recordings of spoken digits 0-9, a "MNIST for audio".',
    description:
      'Short recordings of digits from several speakers at 8 kHz. It is small enough to train on a laptop CPU, so it is a good first speech classification project.',
    url: 'https://github.com/Jakobovski/free-spoken-digit-dataset',
    docsUrl: 'https://github.com/Jakobovski/free-spoken-digit-dataset#readme',
    provider: 'Zohar Jackson et al.',
    license: 'CC BY-SA 4.0',
    access: 'open',
    format: 'WAV, 8 kHz',
    sizeMB: 20,
    badges: ['no-signup', 'no-card', 'commercial-ok', 'laptop-friendly', 'beginner'],
    tags: ['digits', 'speech', 'classification'],
    useCases: ['First audio classifier', 'MFCC feature experiments', 'Split by speaker to test generalisation'],
    gotchas: ['Few speakers: split by speaker, not at random, or accuracy will look inflated.'],
    hardware: 'laptop-cpu',
    samples: '3,000 recordings',
    timeToBaseline: '< 1 min on CPU',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    preprocessingTips: [
      'The README test set is recordings 0–4 of each digit per speaker. To measure generalisation to new voices, hold out a whole speaker instead.',
      'Clips are 8 kHz and vary in length. Pad or trim to ~1 s before extracting MFCCs.',
    ],
    baselineBenchmark: 'MFCC features + logistic regression or SVM: ~90–97% accuracy in seconds on CPU.',
    snippet: {
      lang: 'python',
      title: 'Clone and parse file names',
      code: `import subprocess, pathlib

subprocess.run(["git", "clone", "--depth", "1",
                "https://github.com/Jakobovski/free-spoken-digit-dataset.git"], check=True)
for f in sorted(pathlib.Path("free-spoken-digit-dataset/recordings").glob("*.wav"))[:3]:
    digit, speaker, idx = f.stem.split("_")  # e.g. 0_jackson_0
    print(f.name, "digit", digit, "speaker", speaker)`,
    },
  },

  // ----------------------------------------------------------- LLM APIs
  {
    slug: 'hugging-face-inference',
    name: 'Hugging Face Inference Providers',
    kind: 'api',
    category: 'llm-apis',
    summary: 'One token, many hosted open models, with monthly free credits.',
    description:
      'A single OpenAI-compatible endpoint routes to open models hosted by several providers. Free accounts get a small monthly credit allowance, enough for prototypes and demos.',
    url: 'https://huggingface.co/docs/inference-providers/index',
    docsUrl: 'https://huggingface.co/docs/inference-providers/index',
    provider: 'Hugging Face',
    license: 'Per-model licenses',
    access: 'account',
    rateLimit: 'Monthly free credits; exact amount is shown in your account billing page.',
    format: 'REST (OpenAI-compatible) + Python/JS SDKs',
    badges: ['no-card', 'beginner'],
    tags: ['llm', 'chat', 'open-models', 'embeddings'],
    useCases: ['Try many open models with one client', 'Course project chatbot', 'Embeddings for a search demo'],
    gotchas: [
      'Free credits run out; the call then fails until the month resets or you add billing.',
      'Available models and providers change, so look up current IDs on the Hub model pages.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~5 min to first call',
    preprocessingTips: [
      'Pin the exact model ID and retry on 503 or loading errors. Which models are served changes over time.',
      'Cache responses while developing so re-running a notebook does not burn your monthly credits.',
      'Keep the prompts you tune on separate from the prompts you evaluate on. Tuning on your test questions is leakage too.',
    ],
    baselineBenchmark: 'A 7–8B instruct model answers short prompts in ~1–3 s, so a 100-prompt evaluation finishes in a few minutes.',
    snippet: {
      lang: 'python',
      title: 'Chat completion',
      code: `# pip install huggingface_hub  ·  export HF_TOKEN=hf_...
import os
from huggingface_hub import InferenceClient

client = InferenceClient(api_key=os.environ["HF_TOKEN"])
out = client.chat_completion(
    model="meta-llama/Llama-3.1-8B-Instruct",  # pick any chat model supported by a provider
    messages=[{"role": "user", "content": "Explain overfitting in one sentence."}],
    max_tokens=80,
)
print(out.choices[0].message.content)`,
    },
  },
  {
    slug: 'groq-api',
    name: 'Groq API',
    kind: 'api',
    category: 'llm-apis',
    summary: 'Very fast open-model inference on a rate-limited free tier.',
    description:
      'Groq serves open models at high speed through an OpenAI-compatible API. The free tier requires only an account and API key, with per-model limits on requests and tokens.',
    url: 'https://console.groq.com/docs/rate-limits',
    docsUrl: 'https://console.groq.com/docs/overview',
    provider: 'Groq',
    license: 'Per-model licenses',
    access: 'free-key',
    rateLimit: 'Per-model requests and tokens per minute and per day; see the rate-limits page.',
    format: 'REST (OpenAI-compatible)',
    badges: ['no-card', 'beginner', 'commercial-ok'],
    tags: ['llm', 'chat', 'fast', 'openai-compatible'],
    useCases: ['Low-latency chat demo', 'Batch labelling with an LLM', 'Agent prototypes'],
    gotchas: [
      'Free-tier limits differ per model and change; handle HTTP 429 with backoff.',
      'Model names are retired regularly, so check the models list.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~5 min to first call',
    preprocessingTips: [
      'Hitting per-minute token limits returns HTTP 429. Read the `retry-after` header and back off.',
      'Keep a held-out prompt set for evaluation, separate from the prompts you iterate on.',
      'Set `temperature: 0` when comparing prompts or models so differences are not just sampling noise.',
    ],
    baselineBenchmark: 'Llama 3.1 8B Instant streams several hundred tokens per second, so a 100-question eval finishes in a minute or two within free limits.',
    snippet: {
      lang: 'python',
      title: 'OpenAI-compatible call',
      code: `# pip install openai  ·  export GROQ_API_KEY=...
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["GROQ_API_KEY"], base_url="https://api.groq.com/openai/v1")
model = client.models.list().data[0].id  # or set a model id from the console
resp = client.chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": "Give me three project ideas using MNIST."}],
)
print(resp.choices[0].message.content)`,
    },
  },
  {
    slug: 'gemini-api',
    name: 'Google Gemini API',
    kind: 'api',
    category: 'llm-apis',
    summary: 'Free-tier access to Gemini models with a key from AI Studio.',
    description:
      'Create a key in Google AI Studio and call Gemini models without a billing account. The free tier has per-model rate limits, and your inputs may be used to improve Google products, so skip private data.',
    url: 'https://ai.google.dev/gemini-api/docs/rate-limits',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    provider: 'Google',
    license: 'Google API terms',
    access: 'free-key',
    rateLimit: 'Per-model requests per minute and per day; see the rate-limits page.',
    format: 'REST + official SDKs',
    badges: ['no-card', 'beginner'],
    tags: ['llm', 'multimodal', 'long-context'],
    useCases: ['Multimodal (image + text) prototypes', 'Long-document summarisation', 'Structured JSON extraction'],
    gotchas: [
      'Free-tier prompts can be used by Google to improve its products. Never send private data.',
      'Limits vary by model and change often, so confirm on the rate-limits page.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~5 min to first call',
    preprocessingTips: [
      'On the free tier, Google may use prompts to improve its products. Do not send private or personal data.',
      'Flash models have far higher free daily quotas than Pro models. Prototype on Flash.',
      'Separate the prompts you tune on from the prompts you evaluate on.',
    ],
    baselineBenchmark: 'Flash models answer short prompts in ~1–2 s, so a 100-prompt eval fits in a few minutes inside free-tier limits.',
    snippet: {
      lang: 'bash',
      title: 'REST call',
      code: `# export GEMINI_API_KEY=...   (model IDs: curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY")
MODEL="gemini-2.5-flash"
curl -s "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent" \\
  -H "x-goog-api-key: $GEMINI_API_KEY" -H "Content-Type: application/json" \\
  -d '{"contents":[{"parts":[{"text":"Explain k-means in two sentences."}]}]}'`,
    },
  },
  {
    slug: 'openrouter-free',
    name: 'OpenRouter Free Models',
    kind: 'api',
    category: 'llm-apis',
    summary: 'One API for dozens of models, including a rotating set that cost nothing.',
    description:
      'OpenRouter lists models whose prompt and completion price is zero. A free key is enough to call them through an OpenAI-compatible endpoint, which is handy for comparing models in a project.',
    url: 'https://openrouter.ai/docs/api-reference/limits',
    docsUrl: 'https://openrouter.ai/docs/quickstart',
    provider: 'OpenRouter',
    license: 'Per-model licenses',
    access: 'free-key',
    rateLimit: 'Free models are capped per minute and per day; the cap is higher once you add credits.',
    format: 'REST (OpenAI-compatible)',
    quotas: [
      { label: 'Free models, no credits (approx.)', perDay: 50 },
      { label: 'Free models, with credits purchased (approx.)', perDay: 1000 },
    ],
    badges: ['no-card', 'beginner'],
    tags: ['llm', 'router', 'model-comparison', 'openai-compatible'],
    useCases: ['A/B compare open models', 'Low-volume demos', 'Fallback model for an app'],
    gotchas: [
      'The free list rotates and free models can be slow or busy. Never hard-code one model.',
      'Daily caps are small without credits, so cache responses while developing.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~5 min to first call',
    preprocessingTips: [
      'Free model IDs end in `:free` and can be removed or throttled without notice. Configure a fallback model.',
      'Some free providers log prompts. Check each model\'s data policy before sending anything sensitive.',
      'Keep evaluation prompts separate from the ones you iterate on.',
    ],
    baselineBenchmark: 'Free models answer short prompts in ~1–5 s depending on provider load. The daily cap, not speed, is usually the bottleneck.',
    snippet: {
      lang: 'python',
      title: 'Pick a free model at runtime',
      code: `# pip install requests  ·  export OPENROUTER_API_KEY=...
import os, requests

headers = {"Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}"}
models = requests.get("https://openrouter.ai/api/v1/models", headers=headers).json()["data"]
free = [m["id"] for m in models if float(m["pricing"]["prompt"]) == 0 and float(m["pricing"]["completion"]) == 0]
r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers,
                  json={"model": free[0], "messages": [{"role": "user", "content": "Hello!"}]})
print(free[0], "->", r.json()["choices"][0]["message"]["content"])`,
    },
  },
  {
    slug: 'ollama-local',
    name: 'Ollama (local)',
    kind: 'api',
    category: 'llm-apis',
    summary: 'Run open models on your own machine with an HTTP API. No key, no limits.',
    description:
      'Ollama downloads quantised open models and serves them at localhost. Nothing leaves your computer, there is no quota, and it works offline, so the only limit is your hardware.',
    url: 'https://ollama.com/',
    docsUrl: 'https://github.com/ollama/ollama/blob/main/docs/api.md',
    provider: 'Ollama',
    license: 'MIT (Ollama); per-model licenses',
    access: 'local',
    rateLimit: 'None; limited by your CPU/GPU and RAM.',
    format: 'REST on localhost:11434',
    badges: ['no-signup', 'no-card', 'commercial-ok', 'beginner'],
    tags: ['llm', 'local', 'offline', 'privacy'],
    useCases: ['Private notes or data experiments', 'Offline demo at a hackathon', 'Unlimited prompt iteration'],
    gotchas: [
      'Small models (1-8B) are far less capable than hosted ones, and big ones need serious RAM or a GPU.',
      'The first pull downloads gigabytes.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Local API (no fixed sample count)',
    timeToBaseline: '~10 min (install + model pull)',
    preprocessingTips: [
      'Pick a model that fits your RAM: plan on ~8 GB for 7–8B models and 16 GB for 13B models.',
      'The default context window is small. Raise `num_ctx` for long documents, or input is silently truncated.',
      'Set `temperature` and `seed` in `options` for reproducible outputs when comparing prompts.',
    ],
    baselineBenchmark: 'Llama 3.2 3B (4-bit) on a modern laptop CPU: roughly 10–20 tokens/s. On Apple Silicon or an 8 GB GPU: 30–60+ tokens/s.',
    snippet: {
      lang: 'bash',
      title: 'Pull a model and call it',
      code: `ollama pull llama3.2
curl -s http://localhost:11434/api/generate \\
  -d '{"model":"llama3.2","prompt":"What is a confusion matrix?","stream":false}'`,
    },
  },

  // ---------------------------------------------------------- Data APIs
  {
    slug: 'open-meteo',
    name: 'Open-Meteo',
    kind: 'api',
    category: 'data-apis',
    summary: 'Keyless weather forecasts and 80 years of historical data.',
    description:
      'Forecast, historical and air-quality endpoints with no account and no key. Ideal for time-series and forecasting projects. The free tier is for non-commercial use.',
    url: 'https://open-meteo.com/en/docs',
    docsUrl: 'https://open-meteo.com/en/docs',
    provider: 'Open-Meteo',
    license: 'CC BY 4.0 data; free API is non-commercial',
    access: 'open',
    rateLimit: 'Under 10,000 calls/day, 5,000/hour and 600/minute.',
    format: 'JSON',
    quotas: [{ label: 'Free tier', perDay: 10000 }],
    badges: ['no-signup', 'no-card', 'beginner', 'one-liner'],
    tags: ['weather', 'time-series', 'forecast', 'historical'],
    useCases: ['Weather forecasting model', 'Energy-demand features', 'Dashboards with live data'],
    gotchas: ['The free API is for non-commercial use only. Commercial projects need a paid plan.'],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~2 min to first call',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    preprocessingTips: [
      'Times are GMT unless you pass `timezone=auto` (or a named zone). Mismatched time zones shift every daily aggregate.',
      'For forecasting, split train and test by date and never shuffle, or the future leaks into training.',
      'Pull training data from the historical archive endpoint and cache it. Forecast values change on every model run.',
    ],
    baselineBenchmark: 'Seasonal-naive forecast (same hour yesterday) is the bar to beat; gradient boosting with lag features usually cuts its MAE by 20–40%.',
    snippet: {
      lang: 'javascript',
      title: 'Current temperature (Cairo)',
      code: `const url = "https://api.open-meteo.com/v1/forecast?latitude=30.04&longitude=31.24&current=temperature_2m,wind_speed_10m";
const res = await fetch(url);
const { current } = await res.json();
console.log(current.temperature_2m, "°C");`,
    },
  },
  {
    slug: 'frankfurter',
    name: 'Frankfurter Exchange Rates',
    kind: 'api',
    category: 'data-apis',
    summary: 'Keyless currency rates published by the European Central Bank.',
    description:
      'Latest and historical reference rates for around 30 currencies, back to 1999, with no key and no sign-up. It suits finance dashboards and time-series forecasting practice.',
    url: 'https://frankfurter.dev/',
    docsUrl: 'https://frankfurter.dev/',
    provider: 'Frankfurter (ECB data)',
    license: 'Open, no key',
    access: 'open',
    rateLimit: 'No published hard limit; cache responses and be considerate.',
    format: 'JSON',
    badges: ['no-signup', 'no-card', 'commercial-ok', 'beginner', 'one-liner'],
    tags: ['currency', 'finance', 'time-series'],
    useCases: ['Currency converter', 'Exchange-rate time-series forecasting', 'Cost calculators'],
    gotchas: [
      'Rates update once per working day, not in real time.',
      'The API moved to /v1 on api.frankfurter.dev; older URLs may redirect.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~2 min to first call',
    preprocessingTips: [
      'Rates are published once per working day. Weekends and holidays have no new values, so forward-fill the gaps.',
      'Split by date when forecasting. A random split leaks future rates into training.',
    ],
    baselineBenchmark: 'The random-walk baseline (tomorrow = today) is notoriously hard to beat for daily FX. Every model should be compared against it.',
    snippet: {
      lang: 'python',
      title: 'Latest USD to EUR/EGP',
      code: `import requests

r = requests.get("https://api.frankfurter.dev/v1/latest", params={"base": "USD", "symbols": "EUR,EGP"})
print(r.json())`,
    },
  },
  {
    slug: 'wikipedia-rest',
    name: 'Wikipedia REST API',
    kind: 'api',
    category: 'data-apis',
    summary: 'Page summaries and article content, keyless, for text projects.',
    description:
      'The Wikimedia REST API returns clean page summaries and HTML for any article. Useful for building small corpora, retrieval demos and entity lookups without scraping.',
    url: 'https://en.wikipedia.org/api/rest_v1/',
    docsUrl: 'https://api.wikimedia.org/wiki/Core_REST_API',
    provider: 'Wikimedia Foundation',
    license: 'CC BY-SA 4.0 text',
    access: 'open',
    rateLimit: 'Be polite: send a descriptive User-Agent and keep to a few requests per second.',
    format: 'JSON / HTML',
    badges: ['no-signup', 'no-card', 'commercial-ok', 'one-liner'],
    tags: ['text', 'encyclopedia', 'retrieval', 'wikipedia'],
    useCases: ['Seed a retrieval-augmented demo', 'Entity linking practice', 'Summarisation test inputs'],
    gotchas: [
      'Requests without a descriptive User-Agent may be blocked.',
      'Content is CC BY-SA, so attribute it and share derivatives under the same license.',
    ],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~2 min to first call',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    preprocessingTips: [
      'Send a descriptive User-Agent with contact details, or requests may be blocked.',
      'Summaries include disambiguation pages. Check the `type` field and skip `disambiguation`.',
      'Text is CC BY-SA. Attribute it and share derived text under the same license if you redistribute it.',
    ],
    baselineBenchmark: 'Summary requests return in ~100–300 ms. Fetching 1,000 summaries politely (a few per second) takes ~5–10 min.',
    snippet: {
      lang: 'python',
      title: 'Fetch an article summary',
      code: `import requests

r = requests.get(
    "https://en.wikipedia.org/api/rest_v1/page/summary/Machine_learning",
    headers={"User-Agent": "my-student-project/0.1 (you@example.com)"},
)
print(r.json()["extract"])`,
    },
  },
  {
    slug: 'hf-datasets-server',
    name: 'Hugging Face Datasets Server',
    kind: 'api',
    category: 'data-apis',
    summary: 'Preview rows and splits of public Hub datasets without downloading them.',
    description:
      'A REST API that returns rows, schemas and statistics for public datasets on the Hugging Face Hub. Inspect a dataset in your browser or script before committing to a multi-gigabyte download.',
    url: 'https://huggingface.co/docs/dataset-viewer/index',
    docsUrl: 'https://huggingface.co/docs/dataset-viewer/index',
    provider: 'Hugging Face',
    license: 'Per-dataset licenses',
    access: 'open',
    rateLimit: 'Public datasets need no key; heavy use may be throttled.',
    format: 'JSON',
    badges: ['no-signup', 'no-card', 'one-liner'],
    tags: ['datasets', 'preview', 'exploration'],
    useCases: ['Sanity-check a dataset before download', 'Build a dataset browser', 'Sample rows for a demo'],
    gotchas: ['Max 100 rows per request; page with offset and length.'],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~2 min to first call',
    preprocessingTips: [
      'Call `/is-valid` first; not every dataset has the viewer or Parquet export enabled.',
      '`/rows` returns at most 100 rows per request. Page with `offset`, or download the files listed by `/parquet` for the full data.',
      'The API does not change a dataset\'s terms. Check the license on each dataset card.',
    ],
    baselineBenchmark: 'Previewing the first 100 rows takes one request (~0.5 s). Pulling the Parquet export of a mid-size dataset takes seconds to minutes.',
    snippet: {
      lang: 'bash',
      title: 'First rows of IMDB',
      code: `curl -s "https://datasets-server.huggingface.co/first-rows?dataset=stanfordnlp/imdb&config=plain_text&split=train" | head -c 600`,
    },
  },
  {
    slug: 'nasa-apod',
    name: 'NASA Open APIs (APOD)',
    kind: 'api',
    category: 'data-apis',
    summary: 'Astronomy Picture of the Day and other NASA data with a free key.',
    description:
      'NASA\'s APIs include the Astronomy Picture of the Day, Mars rover photos, near-Earth asteroids and more. Use the shared DEMO_KEY to try it instantly, then request a free personal key for higher limits.',
    url: 'https://api.nasa.gov/',
    docsUrl: 'https://api.nasa.gov/',
    provider: 'NASA',
    license: 'US government content, mostly public domain',
    access: 'free-key',
    rateLimit: 'DEMO_KEY: 30/hour and 50/day per IP. A personal key allows 1,000/hour.',
    format: 'JSON',
    quotas: [
      { label: 'DEMO_KEY', perDay: 50 },
      { label: 'Personal key (1,000/hour)', perDay: 24000 },
    ],
    badges: ['no-card', 'commercial-ok', 'beginner', 'one-liner'],
    tags: ['space', 'images', 'astronomy'],
    useCases: ['Space dashboard', 'Image-captioning test set', 'Near-Earth-object analysis'],
    gotchas: ['DEMO_KEY is shared and rate limited quickly. Get your own key at api.nasa.gov.'],
    hardware: 'laptop-cpu',
    samples: 'Live API (no fixed sample count)',
    timeToBaseline: '~2 min to first call',
    preprocessingTips: [
      'Some days are videos (`media_type: video`), not images. Filter them out before building an image pipeline.',
      'Not every image is public domain. Check the `copyright` field before reusing one.',
      'DEMO_KEY limits are tiny. Get a free personal key before any batch pull.',
    ],
    baselineBenchmark: 'With `start_date` and `end_date`, a full year of entries comes back in a single request.',
    snippet: {
      lang: 'bash',
      title: "Today's picture",
      code: `curl -s "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"`,
    },
  },
];
