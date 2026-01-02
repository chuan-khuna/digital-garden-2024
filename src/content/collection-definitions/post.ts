import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

import { articleSchema } from './common-fields/_article'

export const postsCollection = defineCollection({
  loader: glob({ base: 'src/content/posts', pattern: '**/*.{md,mdx}' }),
  // type: 'content',
  schema: articleSchema,
})
