import { z, defineCollection } from 'astro:content'

export const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
})
