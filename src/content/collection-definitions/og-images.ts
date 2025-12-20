import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'

const ogImagesCollection = defineCollection({
  loader: file('src/content/og-images.json'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    ogStyle: z.string().optional().default('default'),
  }),
})

export { ogImagesCollection }
