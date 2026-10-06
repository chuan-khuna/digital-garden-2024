/**
 * Print Layouts and the Print Page's selection rules, as pure data and
 * functions. The Print Page markup (`ResumePrintPage.astro`) renders from
 * `PRINT_LAYOUTS` / `PRINT_SECTIONS`, and its browser script applies the
 * selection rules below to the DOM; tests exercise the rules directly.
 *
 * Must stay free of runtime imports from `astro:content` (it ships to the
 * browser) — type imports only.
 *
 * Selection lives in the URL: `?layout=<name>&hide=<section>,<section>`.
 * Unknown names are ignored. Without `?hide=` a layout shows every Section
 * except its `defaultHidden` ones; an explicit `?hide=` — even empty —
 * overrides those defaults. Switching layout resets to its defaults.
 */
import type { ResumeSection } from '@/content/collection-definitions/resume-sections'
import type { Surface } from '@/lib/resume/resolve'

/** A Section the Print Page can hide. The header always shows; `now` is web-only. */
export type PrintSection = Exclude<ResumeSection, 'header' | 'now'>

/** Hideable Sections in selector (and `?hide=`) order. Names are the `?hide=` values. */
export const PRINT_SECTIONS: readonly { name: PrintSection; label: string }[] =
  [
    { name: 'skills', label: 'Skills' },
    { name: 'experiences', label: 'Experience' },
    { name: 'projects', label: 'Projects' },
    { name: 'educations', label: 'Education' },
    { name: 'activities', label: 'Activity' },
    { name: 'interests', label: 'Interests' },
  ]

export interface PrintLayout {
  /** The `?layout=` value. */
  name: string
  label: string
  /** The Surface its Resume is resolved for. */
  surface: Extract<Surface, 'resume_print' | 'cv_print'>
  /**
   * Every PrintSection once, in groups: the two columns of
   * `resume-two-cols`, the single column of `resume-one-col`, the pages of
   * `cv`. The header is rendered first, outside the groups.
   */
  arrangement: readonly (readonly PrintSection[])[]
  /** Sections hidden until toggled on. */
  defaultHidden: readonly PrintSection[]
}

/** Print Layouts; the first is the default. */
export const PRINT_LAYOUTS = [
  {
    name: 'resume-two-cols',
    label: 'Resume · 2 columns',
    surface: 'resume_print',
    arrangement: [
      ['skills', 'activities', 'interests'],
      ['experiences', 'projects', 'educations'],
    ],
    defaultHidden: [],
  },
  {
    name: 'resume-one-col',
    label: 'Resume · 1 column',
    surface: 'resume_print',
    arrangement: [
      [
        'skills',
        'experiences',
        'projects',
        'educations',
        'activities',
        'interests',
      ],
    ],
    defaultHidden: ['interests'],
  },
  {
    name: 'cv',
    label: 'CV · multi-page',
    surface: 'cv_print',
    arrangement: [
      ['skills', 'experiences', 'educations', 'projects'],
      ['activities', 'interests'],
    ],
    defaultHidden: [],
  },
] as const satisfies readonly PrintLayout[]

export type PrintLayoutName = (typeof PRINT_LAYOUTS)[number]['name']

export const DEFAULT_PRINT_LAYOUT: PrintLayoutName = PRINT_LAYOUTS[0].name

/** What the Print Page shows: one layout, minus the hidden Sections. */
export interface PrintSelection {
  layout: PrintLayoutName
  hidden: ReadonlySet<PrintSection>
}

export function getPrintLayout(name: PrintLayoutName): PrintLayout {
  return PRINT_LAYOUTS.find((l) => l.name === name)!
}

function isPrintLayoutName(name: string | null): name is PrintLayoutName {
  return PRINT_LAYOUTS.some((l) => l.name === name)
}

function parseHide(value: string): Set<PrintSection> {
  const names = value.split(',')
  return new Set(
    PRINT_SECTIONS.map((s) => s.name).filter((n) => names.includes(n)),
  )
}

/** `?hide=` value: hidden Sections in PRINT_SECTIONS order, so URLs are stable. */
function formatHide(hidden: ReadonlySet<PrintSection>): string {
  return PRINT_SECTIONS.map((s) => s.name)
    .filter((n) => hidden.has(n))
    .join(',')
}

/** `layout` with its default Sections hidden. */
export function selectLayout(layout: PrintLayoutName): PrintSelection {
  return { layout, hidden: new Set(getPrintLayout(layout).defaultHidden) }
}

/** The selection a URL's query string asks for. */
export function parseSelection(params: URLSearchParams): PrintSelection {
  const requested = params.get('layout')
  const layout = isPrintLayoutName(requested) ? requested : DEFAULT_PRINT_LAYOUT
  const hide = params.get('hide')
  return hide === null
    ? selectLayout(layout)
    : { layout, hidden: parseHide(hide) }
}

/**
 * Writes `selection` into `params`, leaving out `layout` when it is the
 * default and `hide` when it matches the layout's defaults.
 */
export function writeSelection(
  params: URLSearchParams,
  selection: PrintSelection,
): void {
  if (selection.layout === DEFAULT_PRINT_LAYOUT) params.delete('layout')
  else params.set('layout', selection.layout)

  const hide = formatHide(selection.hidden)
  if (hide === formatHide(selectLayout(selection.layout).hidden)) {
    params.delete('hide')
  } else {
    params.set('hide', hide)
  }
}

/** `selection` with `section` flipped between shown and hidden. */
export function toggleSection(
  selection: PrintSelection,
  section: PrintSection,
): PrintSelection {
  const hidden = new Set(selection.hidden)
  if (hidden.has(section)) hidden.delete(section)
  else hidden.add(section)
  return { layout: selection.layout, hidden }
}
