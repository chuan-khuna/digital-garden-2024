import { z, defineCollection } from 'astro:content'
import { glob, file } from 'astro/loaders'

export const resumeSkillsCollection = defineCollection({
  loader: file('src/content/resume/skills.json'),
  schema: z.object({
    category: z.string(),
    details: z.array(z.string()),
  }),
})
