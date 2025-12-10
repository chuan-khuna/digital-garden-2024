import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

export const resumeProjectsCollection = defineCollection({
  loader: file('src/content/resume/projects.json'),
  schema: z.object({
    title: z.string(),
    time: z.string(),
    description: z.string(),
    url: z.string().url().nullable(),
    details: z.array(z.string()),
    visibility: z
      .object({
        web: z.boolean(),
        resume_print: z.boolean(),
        cv_print: z.boolean(),
      })
      .default({
        web: true,
        resume_print: true,
        cv_print: true,
      }),
  }),
})
