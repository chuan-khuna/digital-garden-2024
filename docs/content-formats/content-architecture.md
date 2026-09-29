# Content Architecture Overview

All content lives in `src/content/`. Collections are defined in `src/content.config.ts` using the Astro 5 `glob`/`file` loader API.

---

## Active collections

| Collection | Source | Description |
|------------|--------|-------------|
| `posts` | `src/content/posts/**/*.{md,mdx}` | Digital garden notes with wiki-style links |
| `notes` | `src/content/notes/**/*.{md,mdx}` | Shorter notes (same schema as posts) |
| `navItems` | `src/content/nav-items.json` | Navigation configuration |
| `ogImages` | `src/content/og-images.json` | OG image configs |
| `resumeSkills` | `src/content/resume/*/skills.json` | Resume skills |
| `resumeProjects` | `src/content/resume/*/projects/*.md` | Resume projects |
| `resumeExperiences` | `src/content/resume/*/experiences/*.md` | Resume experience entries |
| `resumeEducations` | `src/content/resume/*/educations.json` | Resume education |
| `resumeActivities` | `src/content/resume/*/activities.json` | Resume activities |
| `resumeInterests` | `src/content/resume/*/interests.json` | Resume interests |
| `resumeNow` | `src/content/resume/index/now.json` | "What I'm doing now" section (Default Version only) |
| `resumeHeader` | `src/content/resume/*/header.json` | Resume header/contact info |

Schema definitions: `src/content/collection-definitions/`

Resume collections span every Resume Version folder (`src/content/resume/<version>/`, `*` above); `index` is the Default Version. Read them through `getResume()` in `src/lib/resume/index.ts`, never via `getCollection` directly. See `docs/content-formats/resume.md`.

---

## Shared article schema

Used by both `posts` and `notes`. Defined in `src/content/collection-definitions/common-fields/_article.ts`.

```typescript
{
  title: string
  description?: string
  date?: string           // created date (YYYY-MM-DD)
  updated?: string        // last updated date (YYYY-MM-DD)
  aliases?: string[]      // alternative names for backlink matching
  tags?: string[]
  stage?: 'seedling' | 'budding' | 'evergreen'
  ogStyle?: 'default' | 'default-dark' | 'particle'  // default: 'default'
  llmAssisted?: boolean   // default: false
}
```

For full field descriptions and authoring examples → [`posts.md`](./posts.md)

---

## Static config files (not Astro collections, live in `src/data/`)

| File | Purpose |
|------|---------|
| `src/data/site.config.ts` | Global site metadata (`SITE.siteTitle`, etc.) |
| `src/data/portfolio.ts` | Personal info for the bento homepage (`PORTFOLIO`) |

For field details → [`site-config.md`](./site-config.md) and [`portfolio.md`](./portfolio.md)

---

## Schema-sync table

Changing a source below means updating its doc in the same task (see `CLAUDE.md` → Content and schema sync). A new collection gets a new doc in `docs/content-formats/` and a row here.

| Source path | Reference doc |
|---|---|
| `src/content/collection-definitions/post.ts`, `note.ts` | `posts.md` |
| `src/content/collection-definitions/common-fields/_article.ts`, `_evergreen-stages.ts` | `posts.md` |
| `src/content/collection-definitions/common-fields/_og-styles.ts` | `posts.md` + `og-images.md` |
| `src/content/collection-definitions/resume.ts`, `resume-loaders.ts`, `resume-sections.ts` | `resume.md` + `docs/architecture/resume-system.md` |
| `src/content/collection-definitions/nav.ts` | `nav.md` |
| `src/content/collection-definitions/og-images.ts` | `og-images.md` |
| `src/data/portfolio.ts` | `portfolio.md` + `site-config.md` |
| `src/data/site.config.ts` | `site-config.md` |
