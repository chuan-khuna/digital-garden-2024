/**
 * Resume Version resolution. Every resume page must read resume data through
 * `getResume()` — never call `getCollection('resume*')` directly, or the page
 * will mix entries from every Resume Version.
 *
 * Fallback rule: a Resume Version overrides a Section WHOLE if it has any
 * entries for it; otherwise the whole Section comes from the Default Version
 * (`index`). There is no per-entry merging and no inheritance between versions.
 * The `now` Section is always read from `index`.
 *
 * Visibility rule: experiences, projects and educations are filtered by the
 * entry's `visibility[surface]`, so pages receive only what they should show.
 */
import { getCollection, type CollectionEntry } from 'astro:content'
import {
  DEFAULT_RESUME_VERSION,
  assertValidResumeVersion,
} from '@/content/collection-definitions/resume-loaders'

export { DEFAULT_RESUME_VERSION }

/**
 * Where a Resume Version is shown: the web resume, the Resume Print Page or the
 * CV Print Page. Values match the keys of an entry's `visibility`.
 */
export type Surface = 'web' | 'resume_print' | 'cv_print'

export interface Resume {
  version: string
  surface: Surface
  header: CollectionEntry<'resumeHeader'>['data']
  skills: CollectionEntry<'resumeSkills'>[]
  /** Only entries visible on `surface`. */
  experiences: CollectionEntry<'resumeExperiences'>[]
  /** Only entries visible on `surface`, sorted by `order` (ascending). */
  projects: CollectionEntry<'resumeProjects'>[]
  /** Only entries visible on `surface`. */
  educations: CollectionEntry<'resumeEducations'>[]
  activities: CollectionEntry<'resumeActivities'>[]
  interests: string[]
  /** Always from the Default Version. */
  now: CollectionEntry<'resumeNow'>
}

type VersionedEntry = { data: { version: string } }

/** Whole-Section override: the version's entries if it has any, else `index`'s. */
function resolveSection<T extends VersionedEntry>(
  entries: T[],
  version: string,
): T[] {
  const own = entries.filter((e) => e.data.version === version)
  if (own.length > 0) return own
  return entries.filter((e) => e.data.version === DEFAULT_RESUME_VERSION)
}

type VisibleEntry = { data: { visibility: Record<Surface, boolean> } }

function visibleOn<T extends VisibleEntry>(entries: T[], surface: Surface): T[] {
  return entries.filter((e) => e.data.visibility[surface])
}

async function loadAllSections() {
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
  const sections = await loadAllSections()
  const versions = new Set<string>()
  for (const entries of Object.values(sections)) {
    for (const entry of entries) versions.add(entry.data.version)
  }
  versions.delete(DEFAULT_RESUME_VERSION)
  for (const version of versions) assertValidResumeVersion(version)
  return [...versions].sort()
}

/**
 * All Sections resolved for `version` (defaults to the Default Version) and
 * filtered to what `surface` shows.
 */
export async function getResume(
  surface: Surface,
  version: string = DEFAULT_RESUME_VERSION,
): Promise<Resume> {
  assertValidResumeVersion(version)
  const sections = await loadAllSections()

  const header = resolveSection(sections.header, version)[0]
  if (!header) {
    throw new Error(
      `[resume] No header found for Resume Version "${version}" or the Default Version "${DEFAULT_RESUME_VERSION}".`,
    )
  }
  const now = sections.now.find(
    (e) => e.data.version === DEFAULT_RESUME_VERSION,
  )
  if (!now) {
    throw new Error(
      `[resume] Missing src/content/resume/${DEFAULT_RESUME_VERSION}/now.json.`,
    )
  }

  return {
    version,
    surface,
    header: header.data,
    skills: resolveSection(sections.skills, version),
    experiences: visibleOn(
      resolveSection(sections.experiences, version),
      surface,
    ),
    projects: visibleOn(resolveSection(sections.projects, version), surface).sort(
      (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0),
    ),
    educations: visibleOn(resolveSection(sections.educations, version), surface),
    activities: resolveSection(sections.activities, version),
    interests: resolveSection(sections.interests, version)[0]?.data.items ?? [],
    now,
  }
}
