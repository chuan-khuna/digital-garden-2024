import { describe, expect, it } from 'vitest'
import {
  assertPageOgImage,
  ogImagePath,
  ogLabel,
  ogSiteHost,
  resolvePageTitle,
} from '@/lib/og-image/resolve'

describe('ogLabel', () => {
  it('names each kind in the singular', () => {
    expect(ogLabel('posts')).toBe('Post')
    expect(ogLabel('notes')).toBe('Note')
    expect(ogLabel('projects')).toBe('Project')
    expect(ogLabel('pages')).toBe('Page')
  })
})

describe('ogSiteHost', () => {
  it('drops the scheme and trailing slash', () => {
    expect(ogSiteHost('https://altrf.dev/')).toBe('altrf.dev')
  })

  it('keeps a port', () => {
    expect(ogSiteHost('http://localhost:4321')).toBe('localhost:4321')
  })
})

describe('ogImagePath', () => {
  it('puts page images under og/pages/', () => {
    expect(ogImagePath('pages', 'resume')).toBe('og/pages/resume.png')
  })

  it('puts article images under their collection', () => {
    expect(ogImagePath('posts', 'zettelkasten-note-types')).toBe(
      'og/posts/zettelkasten-note-types.png',
    )
    expect(ogImagePath('notes', 'a-note')).toBe('og/notes/a-note.png')
  })

  it('keeps nested article ids as path segments', () => {
    expect(ogImagePath('posts', '2024/intro')).toBe('og/posts/2024/intro.png')
  })
})

describe('assertPageOgImage', () => {
  const pageSlugs = ['index', 'resume', 'uses']

  it('accepts a slug that has an og-images.json entry', () => {
    expect(() => assertPageOgImage('resume', pageSlugs)).not.toThrow()
  })

  it('fails on a slug with no entry, naming the file and the known pages', () => {
    expect(() => assertPageOgImage('resumes', pageSlugs)).toThrow(
      /No OG image for page "resumes".*og-images\.json.*index, resume, uses/,
    )
  })

  it('fails when there are no page entries at all', () => {
    expect(() => assertPageOgImage('index', [])).toThrow(/\(none\)/)
  })
})

describe('resolvePageTitle', () => {
  it('fills {{siteTitle}}', () => {
    expect(resolvePageTitle('{{siteTitle}}', 'ALTR')).toBe('ALTR')
    expect(resolvePageTitle('Uses · {{siteTitle}}', 'ALTR')).toBe('Uses · ALTR')
  })

  it('fills every occurrence', () => {
    expect(resolvePageTitle('{{siteTitle}} / {{siteTitle}}', 'A')).toBe('A / A')
  })

  it('leaves titles without the placeholder unchanged', () => {
    expect(resolvePageTitle('Resume', 'ALTR')).toBe('Resume')
  })
})
