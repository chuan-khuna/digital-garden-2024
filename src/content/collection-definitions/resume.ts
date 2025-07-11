import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'

export const resumeSkillsCollection = defineCollection({
  loader: file('@/content/resume/skills.json'),
  schema: z.object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    tools: z.array(z.string()),
  }),
})
