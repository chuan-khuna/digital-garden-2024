import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { ogStyleChoices } from './common-fields/_og-styles'

const ogImagesCollection = defineCollection({
  loader: file('src/content/og-images.json'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    ogStyle: ogStyleChoices,
  }),
})

export { ogImagesCollection }
