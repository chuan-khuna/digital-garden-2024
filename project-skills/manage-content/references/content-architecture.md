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
| `resumeSkills` | `src/content/resume/skills.json` | Resume skills |
| `resumeProjects` | `src/content/resume/projects/*.md` | Resume projects |
| `resumeExperiences` | `src/content/resume/experiences/*.md` | Resume experience entries |
| `resumeEducations` | `src/content/resume/educations.json` | Resume education |
| `resumeActivities` | `src/content/resume/activities.json` | Resume activities |
| `resumeInterests` | `src/content/resume/interests.json` | Resume interests |
| `resumeNow` | `src/content/resume/now.json` | "What I'm doing now" section |
| `resumeHeader` | `src/content/resume/header.json` | Resume header/contact info |

Schema definitions: `src/content/collection-definitions/`

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

For full field descriptions and authoring examples → [`how-to-manage-posts.md`](./how-to-manage-posts.md)

---

## Static config files (not Astro collections)

| File | Purpose |
|------|---------|
| `src/content/site.config.ts` | Global site metadata (`SITE.siteTitle`, etc.) |
| `src/content/portfolio.ts` | Personal info for the bento homepage (`PORTFOLIO`) |

For field details → [`how-to-manage-site-config.md`](./how-to-manage-site-config.md)
