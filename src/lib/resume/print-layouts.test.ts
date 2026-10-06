import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PRINT_LAYOUT,
  PRINT_LAYOUTS,
  PRINT_SECTIONS,
  parseSelection,
  selectLayout,
  toggleSection,
  writeSelection,
  type PrintSelection,
} from '@/lib/resume/print-layouts'

const parse = (query: string) => parseSelection(new URLSearchParams(query))

function write(selection: PrintSelection, query = ''): string {
  const params = new URLSearchParams(query)
  writeSelection(params, selection)
  return decodeURIComponent(params.toString())
}

describe('PRINT_LAYOUTS', () => {
  it.each(PRINT_LAYOUTS.map((l) => [l.name, l]))(
    '%s arranges every hideable Section exactly once',
    (_, layout) => {
      expect(layout.arrangement.flat().toSorted()).toEqual(
        PRINT_SECTIONS.map((s) => s.name).toSorted(),
      )
    },
  )

  it('defaults to the two-column Resume', () => {
    expect(DEFAULT_PRINT_LAYOUT).toBe('resume-two-cols')
  })
})

describe('parseSelection', () => {
  it('falls back to the default layout and its defaults', () => {
    expect(parse('')).toEqual(selectLayout('resume-two-cols'))
  })

  it('ignores an unknown layout', () => {
    expect(parse('layout=nope').layout).toBe(DEFAULT_PRINT_LAYOUT)
  })

  it("uses the layout's default-hidden Sections without ?hide=", () => {
    expect(parse('layout=resume-one-col')).toEqual({
      layout: 'resume-one-col',
      hidden: new Set(['interests']),
    })
  })

  it('lets an explicit ?hide= override the defaults, even when empty', () => {
    expect(parse('layout=resume-one-col&hide=').hidden).toEqual(new Set())
    expect(parse('layout=cv&hide=projects,interests').hidden).toEqual(
      new Set(['projects', 'interests']),
    )
  })

  it('drops unknown and non-hideable Section names', () => {
    expect(parse('hide=header,nope,skills').hidden).toEqual(new Set(['skills']))
  })
})

describe('writeSelection', () => {
  it('leaves out the default layout and default-matching hide', () => {
    expect(
      write(selectLayout('resume-two-cols'), 'layout=cv&hide=skills'),
    ).toBe('')
    expect(write(selectLayout('resume-one-col'))).toBe('layout=resume-one-col')
  })

  it('writes hidden Sections in Section order', () => {
    const selection = {
      layout: 'cv' as const,
      hidden: new Set(['interests', 'skills'] as const),
    }
    expect(write(selection)).toBe('layout=cv&hide=skills,interests')
  })

  it('writes an empty hide when every default-hidden Section is shown', () => {
    const shown = toggleSection(selectLayout('resume-one-col'), 'interests')
    expect(write(shown)).toBe('layout=resume-one-col&hide=')
  })

  it('round-trips through parseSelection', () => {
    const selection = toggleSection(selectLayout('cv'), 'projects')
    expect(parse(write(selection))).toEqual(selection)
  })

  it('keeps unrelated query parameters', () => {
    expect(write(selectLayout('cv'), 'utm=x')).toBe('utm=x&layout=cv')
  })
})

describe('toggleSection', () => {
  it('flips a Section without mutating the input', () => {
    const before = selectLayout('resume-two-cols')
    const after = toggleSection(before, 'skills')
    expect(after.hidden).toEqual(new Set(['skills']))
    expect(before.hidden).toEqual(new Set())
    expect(toggleSection(after, 'skills').hidden).toEqual(new Set())
  })
})
