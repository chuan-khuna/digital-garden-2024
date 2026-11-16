import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

import { articleSchema } from './common-fields/_article'

// A project: a page at /projects/<id> (its MDX body is the project story) and a
// card on /projects. Featured projects also get a card in the home-page
// Projects showcase.
export const projectsCollection = defineCollection({
  loader: glob({ base: 'src/content/projects', pattern: '**/*.mdx' }),
  schema: ({ image }) =>
    articleSchema
      .extend({
        description: z.string(), // card text and page subtitle
        url: z.string().url().optional(), // website
        github: z.string().url().optional(), // repo
        cover: image().optional(), // card thumbnail and page hero, e.g. ./cover.png
        coverAlt: z.string().optional(), // alt text for cover
        featured: z.boolean().default(false), // show in the home Projects showcase
        order: z.number().int().optional(), // sort position, ascending
      })
      .refine((p) => p.url || p.github, {
        message: 'A project needs a url, a github, or both',
      }),
})
