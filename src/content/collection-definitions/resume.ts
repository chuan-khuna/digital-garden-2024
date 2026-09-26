import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import {
  versionedResumeGlob,
  versionedResumeJson,
} from '@/content/collection-definitions/resume-loaders'

// Every resume collection spans all Resume Version folders
// (src/content/resume/<version>/). The loader injects `version` (the folder name)
// into each entry and prefixes ids with `<version>/`. Read resume data through
// `getResume()` in `@/lib/resume` rather than calling getCollection directly.
const versionSchema = z.string()

// Zod schema for the shared Visibility type
const visibilitySchema = z.object({
  web: z.boolean(),
  resume_print: z.boolean(),
  cv_print: z.boolean(),
})

export const resumeSkillsCollection = defineCollection({
  loader: versionedResumeJson('skills.json'),
  schema: z.object({
    version: versionSchema,
    category: z.string(),
    // list of jargons/keywords
    details: z.array(z.string()),
  }),
})

export const resumeProjectsCollection = defineCollection({
  loader: versionedResumeGlob('projects'),
  schema: z.object({
    version: versionSchema,
    title: z.string(),
    time: z.string(),
    description: z.string(),
    url: z.string().url().nullable(),
    order: z.number().int().optional(),
    visibility: visibilitySchema.default({
      web: true,
      resume_print: true,
      cv_print: true,
    }),
  }),
})

export const resumeExperiencesCollection = defineCollection({
  loader: versionedResumeGlob('experiences'),
  schema: z.object({
    version: versionSchema,
    jobTitle: z.string(),
    company: z.string(),
    time: z.string(),
    visibility: visibilitySchema.default({
      web: true,
      resume_print: true,
      cv_print: true,
    }),
  }),
})

export const resumeEducationsCollection = defineCollection({
  loader: versionedResumeJson('educations.json'),
  schema: z.object({
    version: versionSchema,
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
  loader: versionedResumeJson('activities.json'),
  schema: z.object({
    version: versionSchema,
    title: z.string(),
    time: z.string(),
    description: z.string(),
    url: z.string().url().nullable().optional(),
    details: z.array(z.string()),
  }),
})

export const resumeInterestsCollection = defineCollection({
  loader: versionedResumeJson('interests.json'),
  schema: z.object({
    version: versionSchema,
    items: z.array(z.string()),
  }),
})

// The `now` Section belongs only to the Default Version (`index`);
// a now.json inside any other version folder is ignored.
export const resumeNowCollection = defineCollection({
  loader: versionedResumeJson('now.json', { defaultVersionOnly: true }),
  schema: z.object({
    version: versionSchema,
    lastUpdated: z.string(),
    intro: z.string(),
    paragraphs: z.array(z.string()),
  }),
})

export const resumeHeaderCollection = defineCollection({
  loader: versionedResumeJson('header.json'),
  schema: z.object({
    version: versionSchema,
    name: z.string(),
    jobTitle: z.string(),
    email: z.string().email(),
    github: z.string().url(),
    githubName: z.string(),
    introduction: z.string(),
    location: z.string(),
  }),
})
