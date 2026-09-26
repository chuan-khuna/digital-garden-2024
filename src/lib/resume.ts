/**
 * Resume data for pages. Every resume page must read resume data through
 * `getResume()` — never call `getCollection('resume*')` directly, or the page
 * will mix entries from every Resume Version.
 *
 * This module is the Astro content adapter: it loads the collections and hands
 * them to the pure rules in `@/lib/resume-resolve` (fallback, visibility,
 * ordering), which is where tests exercise them.
 */
import { getCollection } from 'astro:content'
import { DEFAULT_RESUME_VERSION } from '@/content/collection-definitions/resume-loaders'
import {
  resolveResume,
  resumeVersionsIn,
  type Resume,
  type ResumeEntries,
  type Surface,
} from '@/lib/resume-resolve'

export { DEFAULT_RESUME_VERSION }
export type { Resume, Surface }

async function loadAllSections(): Promise<ResumeEntries> {
  const [
    header,
    skills,
    experiences,
    projects,
    educations,
    activities,
    interests,
    now,
  ] = await Promise.all([
    getCollection('resumeHeader'),
    getCollection('resumeSkills'),
    getCollection('resumeExperiences'),
    getCollection('resumeProjects'),
    getCollection('resumeEducations'),
    getCollection('resumeActivities'),
    getCollection('resumeInterests'),
    getCollection('resumeNow'),
  ])
  return {
    header,
    skills,
    experiences,
    projects,
    educations,
    activities,
    interests,
    now,
  }
}

/**
 * Every Resume Version found in the content, excluding the Default Version
 * (`index`), sorted alphabetically. Used for print-page `getStaticPaths`.
 */
export async function getResumeVersions(): Promise<string[]> {
  return resumeVersionsIn(await loadAllSections())
}

/**
 * All Sections resolved for `version` (defaults to the Default Version) and
 * filtered to what `surface` shows.
 */
export async function getResume(
  surface: Surface,
  version: string = DEFAULT_RESUME_VERSION,
): Promise<Resume> {
  return resolveResume(await loadAllSections(), surface, version)
}
