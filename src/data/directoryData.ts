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
  snippet: Snippet;
}

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
    snippet: {
      lang: 'bash',
      title: "Today's picture",
      code: `curl -s "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"`,
    },
  },
];
