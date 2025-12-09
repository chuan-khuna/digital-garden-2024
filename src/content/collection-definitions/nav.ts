import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'

export const navItemsCollection = defineCollection({
  loader: file('src/content/nav-items.json'),
  schema: z.object({
    label: z.string(),
    link: z.string(),
    order: z.number(),
  }),
})