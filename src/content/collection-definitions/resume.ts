import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import type { Visibility } from '@/content/resume'

// Zod schema for the shared Visibility type
const visibilitySchema = z.object({
  web: z.boolean(),
  resume_print: z.boolean(),
  cv_print: z.boolean(),
})

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
    visibility: visibilitySchema.default({
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
    visibility: visibilitySchema.default({
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
    visibility: visibilitySchema.default({
      web: true,
      resume_print: true,
      cv_print: true,
    }),
  }),
})

export const resumeActivitiesCollection = defineCollection({
  loader: file('src/content/resume/activities.json'),
  schema: z.object({
    title: z.string(),
    time: z.string(),
    description: z.string(),
    url: z.string().url().nullable().optional(),
    details: z.array(z.string()),
  }),
})

export const resumeInterestsCollection = defineCollection({
  loader: file('src/content/resume/interests.json'),
  schema: z.object({
    items: z.array(z.string()),
  }),
})

export const resumeNowCollection = defineCollection({
  loader: file('src/content/resume/now.json'),
  schema: z.object({
    lastUpdated: z.string(),
    intro: z.string(),
    paragraphs: z.array(z.string()),
  }),
})

export const resumeHeaderCollection = defineCollection({
  loader: file('src/content/resume/header.json'),
  schema: z.object({
    name: z.string(),
    jobTitle: z.string(),
    email: z.string().email(),
    github: z.string().url(),
    githubName: z.string(),
    introduction: z.string(),
    location: z.string(),
  }),
})
