// Guides are Markdown in src/content/guides. Facts in a guide that come from a primary
// source are written as "Checked fact" blockquotes with a link; everything else is guidance.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({
    /** Page title before " | ModelShelf". */
    title: z.string(),
    h1: z.string(),
    description: z.string().min(70).max(170),
    /** One-sentence answer shown under the H1 and on the guides index. */
    summary: z.string(),
    order: z.number(),
    /** ISO date the guide's checked facts were last re-read. */
    checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** Directory entries the guide relies on; their facts render from the data, not the Markdown. */
    resources: z.array(z.string()).default([]),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).min(1),
  }),
});

export const collections = { guides };
