# Digital Garden 2024 — AI Agent Instructions

## Package Manager

Use `bun` as the package manager.

## Project Overview

An **Astro-based digital garden and personal portfolio** combining a Zettelkasten-style knowledge base with resume/CV pages. Built with Astro 5, React, Tailwind CSS 4, and bidirectional wiki-style linking between notes.

**Key Architecture:**

- **Framework:** Astro 5 with MDX, deployed on **Cloudflare Workers** via `@astrojs/cloudflare`
- **Styling:** Tailwind CSS 4 (Vite plugin) with CSS variables + multiple themes
- **Content:** Astro Content Collections (Astro 5 `glob` loader API)
- **React:** Used selectively for interactive/animated components
- **Path Aliases:** `@/*` → `src/*` (see `tsconfig.json`)
- **Date Formatting:** Use UK format (DD/MM/YYYY)

## Special Directories

- **`_references/`** — Local reference repositories (gitignored, not part of the project)
- **`.vault/astro-knowledge/`** — Obsidian vault for project notes and knowledge (do not modify programmatically)

---

## Content Architecture

### Content Collections (`src/content/`)

Defined in `src/content.config.ts` using the Astro 5 `glob` loader:

| Collection          | Source                               | Description                                |
| ------------------- | ------------------------------------ | ------------------------------------------ |
| `posts`             | `src/content/posts/**/*.{md,mdx}`    | Digital garden notes with wiki-style links |
| `notes`             | `src/content/notes/**/*.{md,mdx}`    | Shorter notes (same schema as posts)       |
| `navItems`          | `src/content/nav-items.json`         | Navigation configuration                   |
| `ogImages`          | `src/content/og-images.json`         | OG image configs                           |
| `resumeSkills`      | `src/content/resume/skills.json`     | Resume skills                              |
| `resumeProjects`    | `src/content/resume/projects/`       | Resume projects                            |
| `resumeExperiences` | `src/content/resume/experiences/`    | Resume experience entries                  |
| `resumeEducations`  | `src/content/resume/educations.json` | Resume education                           |
| `resumeActivities`  | `src/content/resume/activities.json` | Resume activities                          |
| `resumeInterests`   | `src/content/resume/interests.json`  | Resume interests                           |
| `resumeNow`         | `src/content/resume/now.json`        | "What I'm doing now" section               |
| `resumeHeader`      | `src/content/resume/header.json`     | Resume header/contact info                 |

**Article schema** (shared by `posts` and `notes`, defined in `src/content/collection-definitions/common-fields/_article.ts`):

```typescript
{
  title: string
  description?: string
  date?: string         // created date
  updated?: string      // last updated date
  aliases?: string[]    // alternative names for backlink matching
  tags?: string[]
  stage: 'seedling' | 'budding' | 'evergreen'
  ogStyle: ...          // OG image style choice
  llmAssisted?: boolean // default: false
}
```

### Static Data Files

- `src/content/portfolio.ts` — Personal info, links, skills for the bento homepage
- `src/content/_resume.ts` — Legacy/shared resume data (check before adding new resume data)

---

## Critical Features

### 1. Bidirectional Wiki Links

**File:** `src/utils/bidirectional-link.ts`

- **Syntax:** `[[note-title]]` or `[[note-title:custom display text]]`
- **Processing:** `remark-wiki-link` plugin → `/posts/{permalink}`
- **Functions:**
  - `getOutgoingNotes(node)` — Extract all `[[links]]` from a post body
  - `getIncomingNotes(node)` — Find posts linking TO this note (matches slug, title, or aliases)
- **UI:** `BackReferenceSection` component renders backlinks at the bottom of each post page (`src/pages/posts/[...slug].astro`)

### 2. Theme System

**Themes:** `nzk` (default), `nexus`, `dark`

- **Config:** `src/components/ThemeToggle.astro` — `themes` array + toggle buttons
- **CSS Variables:** `src/styles/presets/nzk.css`, `nexus.css`, `dark.css` — oklch color variables
- **Persistence:** localStorage → class on `<html>`

**Adding a new theme:**

1. Create `src/styles/presets/themename.css` with oklch CSS variables
2. Import in `src/styles/global.css`
3. Add to `themes` array in `ThemeToggle.astro`
4. Add the toggle button with `id="themenameButton"`

### 3. Bento Grid Homepage

**Page:** `src/pages/index.astro`

- **Card wrapper:** `src/components/bento/card.astro` — props: `colSpan`, `rowSpan`, `title`
- **Cards:** `src/components/bento/portfolio-bento/` — `IntroCard.astro`, `AboutMe.astro`, `TimeZoneCard.astro`, etc.
- **Layout:** Tailwind grid `md:grid-cols-2 lg:grid-cols-12`
- **Now time:** `src/components/bento/nowtime.tsx` (React, client-side)

### 4. Resume Pages

**Routes:**

- `/resume` — Web version (`src/pages/resume.astro`)
- `/resume-print` — Print version (`src/pages/resume-print.astro`)
- `/cv-print` — Alternative print layout (`src/pages/cv-print.astro`)

**Data source:** `src/content/resume/` JSON files (one per section, loaded via Astro collections)

**Components:** `src/components/resume/`

```
resume/
  SectionBlock.astro
  UnorderedList.astro
  ListItem.astro
  Divider.astro
  PrintPageBreak.astro
  PrintSectionBlock.astro
  PrintUnorderedList.astro
  ResumeMarkdownBulletWrapper.astro
  sections/
    web/     ← web-specific section components
    print/   ← print-specific section components
  layout/    ← layout wrappers for print vs web
```

---

## Development Workflows

### Commands

```bash
bun run dev      # Dev server at localhost:4321
bun run build    # Production build → dist/ (sets CI=true)
bun run preview  # Preview production build
bun run format   # Prettier with cache
```

**Docker (Bun-based):**

```bash
docker compose -f bun.compose.yml up -d  # Port 4322
```

### Deployment

**Platform:** Cloudflare Workers (primary), also configured for Netlify and Vercel

- Cloudflare: `wrangler.jsonc`, adapter `@astrojs/cloudflare`
- Netlify: `netlify.toml`
- Vercel: `vercel.json`

**Build command:** `bun run build` | **Output:** `dist/`

---

## Project Conventions

### Imports

Always use `@/` alias for internal imports:

```typescript
import BaseLayout from '@/layouts/BaseLayout.astro'
import { PORTFOLIO } from '@/content/portfolio.ts'
import { getCollection } from 'astro:content'
```

### File Organization

```
src/
  assets/         Static assets
  components/
    bento/        Homepage bento grid
    resume/       Resume page components
    post/         Post/article UI components
    ui/           Shared UI primitives (shadcn-style)
    og/           OG image components
    aceternity/   Aceternity UI components
  content/
    collection-definitions/  Zod schemas + collection configs
    posts/        Digital garden posts (.md, .mdx)
    notes/        Shorter notes (.md, .mdx)
    resume/       Resume data (JSON files)
  layouts/        BaseLayout, PostLayout, BaseLayoutPrint
  lib/            Browser utilities (browser-timezone, og-image generation)
  pages/          File-based routing
  styles/
    presets/      Per-theme CSS variable files (nzk.css, nexus.css, dark.css)
    fonts.css
    global.css
    global_print.css
    flexible_mark.css
    obsidian_callout.css
    expressive_code.css
  utils/          Pure functions (bidirectional-link.ts, cn.ts)
```

### Styling

1. **Tailwind v4:** Uses `@import 'tailwindcss'` in CSS (not `@tailwind base/components/utilities`)
2. **Colors:** All use oklch CSS variables per theme — never hardcode colors
3. **Typography:** `@tailwindcss/typography` with custom prose config in `tailwind.config.ts`
4. **Fonts** (defined in `tailwind.config.ts` + `src/styles/fonts.css`):
   - Sans: Lato, Metric
   - Serif: Canela, DM Serif Text
   - Mono: Inconsolata

### Content Writing

**Post frontmatter:**

```yaml
---
title: 'Post Title'
description: 'Optional description'
date: '2024-12-10'
tags: ['tag1', 'tag2']
stage: 'seedling' # seedling | budding | evergreen
aliases: ['alt-name'] # optional, for backlink matching
ogStyle: 'default' # OG image style
llmAssisted: false # mark if AI-assisted
---
```

Use `[[wiki-links]]` within post content. Math: inline `$...$`, block `$$...$$`.

### React Components

Use React only for interactive UI, animations (Framer Motion), or client-side-only features.

```astro
---
import { MyComponent } from '@/components/my-component'
---

<MyComponent client:load />
```

---

## Markdown Processing Pipeline

Configured in `astro.config.mjs`:

**Remark plugins:**

- `remark-math` — Parse `$...$` and `$$...$$`
- `remark-flexible-markers` — Custom text markers
- `remark-obsidian-callout` — Obsidian-style callout blocks
- `remark-wiki-link` — Transform `[[links]]` → `/posts/{permalink}`

**Rehype plugins:**

- `rehype-katex` — Render math with KaTeX

**Code blocks:** `astro-expressive-code` with `catppuccin-latte` (light) and `catppuccin-macchiato` (dark) themes, plus line numbers plugin.

---

## Common Tasks

### Add a new page

1. Create `src/pages/pagename.astro`
2. Wrap with `<BaseLayout>`
3. Add to `src/content/nav-items.json` if navigable

### Add a new theme

1. `src/styles/presets/themename.css` — define all CSS variables
2. `@import './presets/themename.css'` in `src/styles/global.css`
3. Add to `themes` array + button in `src/components/ThemeToggle.astro`

### Add a bento card to homepage

1. Create `src/components/bento/portfolio-bento/YourCard.astro`
2. Import in `src/pages/index.astro`
3. Wrap in `<Card colSpan="lg:col-span-X" rowSpan="...">`

### Modify resume content

Edit the relevant JSON file in `src/content/resume/` — changes apply to both web and print.

---

## Testing & Debugging

No formal test suite. Manual testing:

1. `bun run dev` — check browser console
2. Test theme switching persists across pages
3. Verify `[[wiki-links]]` resolve correctly
4. Check print styles at `/resume-print` and `/cv-print`

**Common issues:**

- **Missing backlinks:** Add `aliases` to frontmatter if the note is referenced by a different name
- **Theme not persisting:** Check browser localStorage is enabled
- **Import errors:** Verify `@/` alias in `tsconfig.json` `paths`
- **Cloudflare build failures:** Ensure `wrangler.jsonc` `compatibility_date` is current
