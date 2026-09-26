/**
 * Resume Version resolution rules, as pure functions over already-loaded
 * entries. `getResume()` in `@/lib/resume` is the Astro content adapter that
 * loads the collections and calls `resolveResume()`; tests pass fixture arrays.
 * This module must not import `astro:content` at runtime (type imports only).
 *
 * Fallback rule: a Resume Version overrides a Section WHOLE if it has any
 * entries for it; otherwise the whole Section comes from the Default Version
 * (`index`). There is no per-entry merging and no inheritance between versions.
 * The `now` Section is always read from `index`.
 *
 * Visibility rule: experiences, projects and educations are filtered by the
 * entry's `visibility[surface]`, so pages receive only what they should show.
 */
import type { CollectionEntry } from 'astro:content'
import {
  DEFAULT_RESUME_VERSION,
  assertValidResumeVersion,
} from '@/content/collection-definitions/resume-loaders'

/**
 * Where a Resume Version is shown: the web resume, the Resume Print Page or the
 * CV Print Page. Values match the keys of an entry's `visibility`.
 */
export type Surface = 'web' | 'resume_print' | 'cv_print'

/** Every entry of every resume collection, across all Resume Versions. */
export interface ResumeEntries {
  header: CollectionEntry<'resumeHeader'>[]
  skills: CollectionEntry<'resumeSkills'>[]
  experiences: CollectionEntry<'resumeExperiences'>[]
  projects: CollectionEntry<'resumeProjects'>[]
  educations: CollectionEntry<'resumeEducations'>[]
  activities: CollectionEntry<'resumeActivities'>[]
  interests: CollectionEntry<'resumeInterests'>[]
  now: CollectionEntry<'resumeNow'>[]
}

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
type VisibleEntry = { data: { visibility: Record<Surface, boolean> } }

/** Whole-Section override: the version's entries if it has any, else `index`'s. */
function resolveSection<T extends VersionedEntry>(
  entries: T[],
  version: string,
): T[] {
  const own = entries.filter((e) => e.data.version === version)
  if (own.length > 0) return own
  return entries.filter((e) => e.data.version === DEFAULT_RESUME_VERSION)
}

function visibleOn<T extends VisibleEntry>(
  entries: T[],
  surface: Surface,
): T[] {
  return entries.filter((e) => e.data.visibility[surface])
}

/**
 * Every Resume Version found in `entries`, excluding the Default Version
 * (`index`), sorted alphabetically.
 */
export function resumeVersionsIn(entries: ResumeEntries): string[] {
  const versions = new Set<string>()
  for (const section of Object.values(entries) as VersionedEntry[][]) {
    for (const entry of section) versions.add(entry.data.version)
  }
  versions.delete(DEFAULT_RESUME_VERSION)
  for (const version of versions) assertValidResumeVersion(version)
  return [...versions].sort()
}

/** All Sections resolved for `version` and filtered to what `surface` shows. */
export function resolveResume(
  entries: ResumeEntries,
  surface: Surface,
  version: string = DEFAULT_RESUME_VERSION,
): Resume {
  assertValidResumeVersion(version)

  const header = resolveSection(entries.header, version)[0]
  if (!header) {
    throw new Error(
      `[resume] No header found for Resume Version "${version}" or the Default Version "${DEFAULT_RESUME_VERSION}".`,
    )
  }
  const now = entries.now.find((e) => e.data.version === DEFAULT_RESUME_VERSION)
  if (!now) {
    throw new Error(
      `[resume] Missing src/content/resume/${DEFAULT_RESUME_VERSION}/now.json.`,
    )
  }

  return {
    version,
    surface,
    header: header.data,
    skills: resolveSection(entries.skills, version),
    experiences: visibleOn(
      resolveSection(entries.experiences, version),
      surface,
    ),
    projects: visibleOn(
      resolveSection(entries.projects, version),
      surface,
    ).sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    educations: visibleOn(resolveSection(entries.educations, version), surface),
    activities: resolveSection(entries.activities, version),
    interests: resolveSection(entries.interests, version)[0]?.data.items ?? [],
    now,
  }
}
