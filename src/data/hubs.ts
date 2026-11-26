// Programmatic landing pages. Each hub is a filtered view of `entries` plus enough
// unique copy that it stands on its own in search results.
import { entries, type Entry, type HardwareTier } from './directoryData';

export interface Hub {
  slug: string;
  /** Short label for nav, chips and breadcrumbs. */
  label: string;
  title: string;
  metaDescription: string;
  intro: string;
  /** Completes "N resources …" in the answer that leads the hub page. */
  answer: string;
  /** Two paragraphs of practical guidance specific to this hub. */
  guide: [string, string];
  guideHeading: string;
  filter: (e: Entry) => boolean;
}

export const HARDWARE_HUBS: (Hub & { tier: HardwareTier })[] = [
  {
    slug: 'laptop-cpu',
    tier: 'laptop-cpu',
    label: 'Laptop CPU',
    title: 'Machine learning datasets that run on a laptop CPU',
    metaDescription:
      'Open ML datasets and free APIs you can train or query on an ordinary laptop CPU, no GPU needed: sizes, licenses, baselines and starter code.',
    answer: 'train or run on an ordinary laptop CPU, with no GPU and no cloud bill',
    intro:
      'Everything here trains a sensible baseline on an ordinary laptop in seconds to a few minutes, or runs on a provider’s servers so your machine only sends requests. No GPU, no cloud bill.',
    guideHeading: 'Getting the most out of a laptop CPU',
    guide: [
      'Start with classic models before neural networks. Logistic regression, random forests and gradient boosting (scikit-learn’s HistGradientBoosting, LightGBM or XGBoost) train in seconds on tables and TF-IDF features, and they set the bar any deep model has to beat. Use all cores with n_jobs=-1, and prefer 5-fold cross-validation over a single split: on small data the variance between splits is often bigger than the gap between models.',
      'When you do train a neural network on CPU, keep it small: one or two convolutional layers for 28×28 images, batch sizes of 64–256, and float32 rather than fp16, which CPUs rarely speed up. Load data once into memory as NumPy arrays instead of re-reading files each epoch, and subsample to 10–20% while you iterate on the pipeline, then run the full set once for the final number.',
    ],
    filter: (e) => e.hardware === 'laptop-cpu',
  },
  {
    slug: 'free-colab-t4',
    tier: 'free-colab-t4',
    label: 'Free Colab T4',
    title: 'Datasets for a free Google Colab T4 GPU',
    metaDescription:
      'Open datasets sized for a free Google Colab T4 GPU session: fine-tuning transformers, ResNets and audio models, with fp16 tips, baselines and starter code.',
    answer: 'reach a solid baseline inside one free Google Colab T4 GPU session (16 GB of VRAM)',
    intro:
      'These datasets are where a GPU starts to matter: fine-tuning a pretrained transformer, a ResNet or an audio model. Each one is sized to reach a solid baseline inside a single free Colab session on a T4 (16 GB of VRAM), the GPU free sessions typically get. Colab does not guarantee a GPU type or session length on the free tier, so save checkpoints. Everything on the laptop CPU page runs here too.',
    guideHeading: 'Tuning for a 16 GB T4 in a free session',
    guide: [
      'Turn on mixed precision first: torch.autocast with fp16 (or fp16=True in the Hugging Face Trainer) roughly doubles throughput on a T4 and halves activation memory. The T4 does not support bf16 efficiently, so stick with fp16. Start with batch size 32 for image models and 16 for base-size transformers; if you run out of memory, halve the batch and use gradient accumulation to keep the effective batch size.',
      'Free sessions disconnect when idle and run for at most 12 hours (often less, per Colab’s FAQ), so save checkpoints to Google Drive every epoch and make training resumable. Copy the dataset to the local /content disk instead of reading from Drive, set num_workers in the DataLoader to the CPU count the runtime reports (os.cpu_count()), and debug on a 5–10% subsample before launching the full run.',
    ],
    filter: (e) => e.hardware === 'free-colab-t4',
  },
  {
    slug: 'needs-gpu-subset',
    tier: 'needs-gpu-subset',
    label: 'GPU or subset',
    title: 'Large ML datasets: start with a subset on free hardware',
    metaDescription:
      'Large open datasets (COCO, WikiText-103, LJ Speech) that outgrow a laptop or one free GPU session, with practical subsetting strategies to start for free.',
    answer: 'are too big to train end to end on free hardware',
    intro:
      'These datasets are too big to train on end to end with free hardware. You can still use them for free: evaluate a pretrained model, fine-tune on a subset, or prototype on a smaller sibling dataset first.',
    guideHeading: 'How to work with a big dataset on free hardware',
    guide: [
      'Subsample on purpose, not at random. For detection, pick a handful of classes and keep every image that contains them; for language modelling, prototype on WikiText-2 before WikiText-103; for speech, take a few hours of audio rather than the whole corpus. Fix the random seed, write the subset’s file list to disk, and report results on the official validation split so your numbers stay comparable.',
      'Lean on pretrained checkpoints. Evaluating a pretrained YOLO, GPT-2 or VITS model takes minutes on a T4 and is a meaningful result on its own; fine-tuning from there needs a fraction of the compute of training from scratch. Use fp16, gradient checkpointing for long sequences, and stream data (Hugging Face datasets with streaming=True) instead of downloading everything.',
    ],
    filter: (e) => e.hardware === 'needs-gpu-subset',
  },
];

export const ACCESS_HUBS: Hub[] = [
  {
    slug: 'no-signup',
    label: 'No signup',
    title: 'Open ML datasets and APIs without sign-up',
    metaDescription:
      'Open machine learning datasets and free APIs you can use without creating an account or API key: one-line loaders, licenses and starter code.',
    answer: 'work with no account, API key or email',
    intro:
      'No account, no API key, no email. Every resource here works straight away from a notebook or a plain HTTP request, which makes them ideal for workshops, coursework and anything you want others to reproduce.',
    guideHeading: 'Why no-signup data matters for your project',
    guide: [
      'Reproducibility is the main win. If your notebook pulls data with a public loader such as load_dataset, fetch_openml or a keyless URL, a teacher, reviewer or recruiter can rerun it without asking you for credentials. Pin the dataset revision or download date in your README so later runs see the same data.',
      'No signup does not mean no rules. Licenses still apply, and keyless APIs still expect fair use: cache responses locally, send a descriptive User-Agent, and stay well under any published rate limit so the service stays open for everyone.',
    ],
    filter: (e) => e.badges.includes('no-signup'),
  },
  {
    slug: 'open-commercial',
    label: 'Commercial use OK',
    title: 'Free ML datasets and APIs allowed for commercial use',
    metaDescription:
      'Open datasets and free APIs whose license or terms allow commercial use (CC0, CC BY, MIT, public domain), with attribution notes and starter code.',
    answer: 'have a license or terms that allow use in a paid product',
    intro:
      'Every resource here has a license or terms that allow use in a paid product, such as CC0, CC BY, CC BY-SA, MIT or public domain, or an API whose terms permit commercial apps. Attribution or share-alike conditions may still apply.',
    guideHeading: 'Using open data in a commercial product',
    guide: [
      'Read the exact license, not just the badge. CC0 and public domain need nothing; CC BY needs attribution, typically a line in your docs or About page; CC BY-SA also requires sharing adapted data under the same license. Whether a trained model counts as an adaptation is legally unsettled, so keep the attribution either way.',
      'Keep a simple data inventory: dataset, version, license URL, date downloaded and how it is used. It takes ten minutes and answers most due-diligence questions from customers, investors or an app store. For APIs, re-check the provider’s terms before launch, since free-tier terms change more often than dataset licenses.',
    ],
    filter: (e) => e.badges.includes('commercial-ok'),
  },
  {
    slug: 'academic-research',
    label: 'Academic & research',
    title: 'Open datasets for academic research and coursework',
    metaDescription:
      'Benchmark datasets that are free for academic research, theses and coursework but restricted or unclear for commercial use, with citation and split tips.',
    answer: 'are free for coursework, theses and papers but have a non-commercial, research-only or unclear license',
    intro:
      'Widely cited benchmarks that are free for coursework, theses and papers, but whose license is non-commercial, research-only or unclear. Use them to learn and publish; check the terms before shipping a product.',
    guideHeading: 'Using benchmark datasets in academic work',
    guide: [
      'Cite the dataset paper, not just the download page. Most benchmarks ask for a specific citation on their homepage or dataset card, and reviewers check. Report results on the official splits and name the exact version or config, because many datasets have several (SQuAD 1.1 vs 2.0, GLUE task configs).',
      'Research-only or non-commercial terms usually cover models too: a classifier trained on a non-commercial dataset should not ship in a paid product without permission. If a thesis project might turn into a startup, plan for it early by pairing these benchmarks with a commercially licensed dataset from the same domain.',
    ],
    filter: (e) => e.kind === 'dataset' && !e.badges.includes('commercial-ok'),
  },
];

export const hubEntries = (hub: Hub) => entries.filter(hub.filter);
export const hardwareHub = (tier: HardwareTier) => HARDWARE_HUBS.find((h) => h.tier === tier)!;
