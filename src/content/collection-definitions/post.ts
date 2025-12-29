import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { ogStyleChoices } from './common-fields/_og-styles'
import { evergreenStages } from './common-fields/_evergreen-stages'

export const postsCollection = defineCollection({
  loader: glob({ base: 'src/content/posts', pattern: '**/*.{md,mdx}' }),
  // type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    updated: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    stage: evergreenStages,
    ogStyle: ogStyleChoices,
  }),
})
