import { describe, expect, it } from 'vitest'
import {
  resolveResume,
  resumeVersionsIn,
  type ResumeEntries,
} from '@/lib/resume-resolve'

// Fixture adapter: builds the entries `getResume()` would load from content.
// Only the fields the resolution rules read are filled in.
type Visibility = { web: boolean; resume_print: boolean; cv_print: boolean }
const shown: Visibility = { web: true, resume_print: true, cv_print: true }

function entry(
  version: string,
  id: string,
  data: Record<string, unknown> = {},
) {
  return { id: `${version}/${id}`, data: { version, ...data } }
}

function entries(
  overrides: Partial<Record<keyof ResumeEntries, unknown[]>> = {},
) {
  return {
    header: [entry('index', 'header', { name: 'Default' })],
    skills: [],
    experiences: [],
    projects: [],
    educations: [],
    activities: [],
    interests: [],
    now: [entry('index', 'now')],
    ...overrides,
  } as unknown as ResumeEntries
}

const ids = (list: { id: string }[]) => list.map((e) => e.id)

describe('resolveResume — whole-Section override', () => {
  it('uses the Default Version when no version is given', () => {
    const resume = resolveResume(
      entries({ skills: [entry('index', 'a'), entry('2026-jul-dev', 'b')] }),
      'web',
    )
    expect(resume.version).toBe('index')
    expect(ids(resume.skills)).toEqual(['index/a'])
  })

  it('takes the whole Section from the version when it has any entries', () => {
    const resume = resolveResume(
      entries({
        skills: [
          entry('index', 'a'),
          entry('index', 'b'),
          entry('2026-jul-dev', 'c'),
        ],
      }),
      'web',
      '2026-jul-dev',
    )
    expect(ids(resume.skills)).toEqual(['2026-jul-dev/c'])
  })

  it('falls back to the Default Version for Sections the version omits', () => {
    const resume = resolveResume(
      entries({
        skills: [entry('index', 'a')],
        activities: [entry('index', 'x'), entry('other', 'y')],
      }),
      'web',
      '2026-jul-dev',
    )
    expect(ids(resume.skills)).toEqual(['index/a'])
    expect(ids(resume.activities)).toEqual(['index/x'])
  })

  it('never falls back from one non-default version to another', () => {
    const resume = resolveResume(
      entries({ skills: [entry('other', 'y')] }),
      'web',
      '2026-jul-dev',
    )
    expect(resume.skills).toEqual([])
  })

  it('resolves header and interests as single Sections', () => {
    const resume = resolveResume(
      entries({
        header: [
          entry('index', 'header', { name: 'Default' }),
          entry('2026-jul-dev', 'header', { name: 'Tailored' }),
        ],
        interests: [entry('index', 'interests', { items: ['chess'] })],
      }),
      'web',
      '2026-jul-dev',
    )
    expect(resume.header).toMatchObject({ name: 'Tailored' })
    expect(resume.interests).toEqual(['chess'])
  })

  it('returns no interests when no version defines them', () => {
    expect(resolveResume(entries(), 'web').interests).toEqual([])
  })
})

describe('resolveResume — now and header', () => {
  it('always reads now from the Default Version', () => {
    const resume = resolveResume(
      entries({ now: [entry('2026-jul-dev', 'now'), entry('index', 'now')] }),
      'web',
      '2026-jul-dev',
    )
    expect(resume.now.id).toBe('index/now')
  })

  it('throws when the Default Version has no now', () => {
    expect(() =>
      resolveResume(entries({ now: [entry('2026-jul-dev', 'now')] }), 'web'),
    ).toThrow(/now\.json/)
  })

  it('throws when neither the version nor the Default Version has a header', () => {
    expect(() =>
      resolveResume(entries({ header: [] }), 'web', '2026-jul-dev'),
    ).toThrow(/No header found/)
  })

  it('rejects an invalid version name', () => {
    expect(() => resolveResume(entries(), 'web', 'Not_Valid')).toThrow(
      /Invalid Resume Version/,
    )
  })
})

describe('resolveResume — Visibility per Surface', () => {
  const hiddenOn = (surface: keyof Visibility): Visibility => ({
    ...shown,
    [surface]: false,
  })
  const content = entries({
    experiences: [
      entry('index', 'shown', { visibility: shown }),
      entry('index', 'no-web', { visibility: hiddenOn('web') }),
      entry('index', 'no-resume', { visibility: hiddenOn('resume_print') }),
      entry('index', 'no-cv', { visibility: hiddenOn('cv_print') }),
    ],
    projects: [entry('index', 'no-web', { visibility: hiddenOn('web') })],
    educations: [entry('index', 'no-cv', { visibility: hiddenOn('cv_print') })],
  })

  it('hides entries with visibility.web false on the web Surface', () => {
    const resume = resolveResume(content, 'web')
    expect(ids(resume.experiences)).toEqual([
      'index/shown',
      'index/no-resume',
      'index/no-cv',
    ])
    expect(resume.projects).toEqual([])
    expect(ids(resume.educations)).toEqual(['index/no-cv'])
  })

  it('filters each print Surface on its own flag', () => {
    expect(ids(resolveResume(content, 'resume_print').experiences)).toEqual([
      'index/shown',
      'index/no-web',
      'index/no-cv',
    ])
    expect(ids(resolveResume(content, 'cv_print').experiences)).toEqual([
      'index/shown',
      'index/no-web',
      'index/no-resume',
    ])
    expect(resolveResume(content, 'cv_print').educations).toEqual([])
  })

  it('filters after resolution, so an all-hidden Section still overrides', () => {
    const resume = resolveResume(
      entries({
        projects: [
          entry('index', 'p', { visibility: shown }),
          entry('2026-jul-dev', 'q', { visibility: hiddenOn('resume_print') }),
        ],
      }),
      'resume_print',
      '2026-jul-dev',
    )
    expect(resume.projects).toEqual([])
  })

  it('records the Surface it resolved for', () => {
    expect(resolveResume(content, 'cv_print').surface).toBe('cv_print')
  })
})

describe('resolveResume — projects order', () => {
  it('sorts projects by order ascending, missing order as 0', () => {
    const resume = resolveResume(
      entries({
        projects: [
          entry('index', 'c', { order: 3, visibility: shown }),
          entry('index', 'none', { visibility: shown }),
          entry('index', 'a', { order: 1, visibility: shown }),
        ],
      }),
      'web',
    )
    expect(ids(resume.projects)).toEqual(['index/none', 'index/a', 'index/c'])
  })
})

describe('resumeVersionsIn', () => {
  it('lists every non-default version across Sections, sorted', () => {
    const versions = resumeVersionsIn(
      entries({
        skills: [entry('2026-jul-dev', 'a')],
        projects: [entry('2025-mar-ops', 'b'), entry('2026-jul-dev', 'c')],
      }),
    )
    expect(versions).toEqual(['2025-mar-ops', '2026-jul-dev'])
  })

  it('rejects an invalid version folder name', () => {
    expect(() =>
      resumeVersionsIn(entries({ skills: [entry('Bad Name', 'a')] })),
    ).toThrow(/Invalid Resume Version/)
  })
})
