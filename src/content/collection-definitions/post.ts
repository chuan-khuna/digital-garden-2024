import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const postsCollection = defineCollection({
  loader: glob({ base: 'src/content/posts', pattern: '**/*.{md,mdx}' }),
  // type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    updated: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    stage: z.enum(['seedling', 'budding', 'evergreen']).optional(),
  }),
})
