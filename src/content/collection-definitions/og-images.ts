import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'

const ogImagesCollection = defineCollection({
  loader: file('src/content/og-images.json'),
  schema: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    slug: z.string({
      required_error: 'Slug is required',
    }),
  }),
})

export { ogImagesCollection }
