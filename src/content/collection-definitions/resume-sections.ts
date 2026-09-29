/**
 * Registry of resume Sections: each Section key mapped to the content collection
 * that holds it across every Resume Version.
 *
 * Deliberately import-free: request-time code (workerd in dev) and Vitest will
 * import it, and pulling in `astro/loaders` or `node:fs` there breaks dev with
 * "require is not defined".
 *
 * Not wired in yet — a later step derives the resume collections and loader
 * from this registry.
 */
export const RESUME_SECTIONS = {
  header: 'resumeHeader',
  skills: 'resumeSkills',
  experiences: 'resumeExperiences',
  projects: 'resumeProjects',
  educations: 'resumeEducations',
  activities: 'resumeActivities',
  interests: 'resumeInterests',
  now: 'resumeNow',
} as const

/** A resume Section key, e.g. `skills`. */
export type ResumeSection = keyof typeof RESUME_SECTIONS

/** A resume collection name, e.g. `resumeSkills`. */
export type ResumeCollection = (typeof RESUME_SECTIONS)[ResumeSection]
