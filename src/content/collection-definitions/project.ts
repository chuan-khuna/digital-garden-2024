import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

import { articleSchema } from './common-fields/_article'

// A project: an MDX page in the garden plus, when `featured`, a card in the
// home-page Projects showcase. The card opens `url`, or `github` when there is
// no website, so every project needs at least one of the two.
export const projectSchema = articleSchema
  .extend({
    description: z.string(), // the showcase card shows it
    url: z.string().url().optional(), // website
    github: z.string().url().optional(), // repo
    featured: z.boolean().default(false), // show in the Projects showcase
    order: z.number().int().optional(), // showcase position, ascending
  })
  .refine((p) => p.url || p.github, {
    message: 'A project needs a url, a github, or both',
  })

export const projectsCollection = defineCollection({
  loader: glob({ base: 'src/content/projects', pattern: '**/*.mdx' }),
  schema: projectSchema,
})
