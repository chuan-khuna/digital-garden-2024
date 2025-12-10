import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'

export const resumeSkillsCollection = defineCollection({
  loader: file('src/content/resume/skills.json'),
  schema: z.object({
    category: z.string(),
    // list of jargons/keywords
    details: z.array(z.string()),
  }),
})

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

export const resumeExperiencesCollection = defineCollection({
  loader: file('src/content/resume/experiences.json'),
  schema: z.object({
    jobTitle: z.string(),
    company: z.string(),
    time: z.string(),
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

export const resumeEducationsCollection = defineCollection({
  loader: file('src/content/resume/educations.json'),
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    time: z.string(),
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