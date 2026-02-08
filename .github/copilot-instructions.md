# Digital Garden 2024 - AI Agent Instructions

Use `bun` as package manager.

## Project Overview

This is an **Astro-based digital garden and personal portfolio** combining a Zettelkasten-style knowledge base with resume/CV pages. The project uses Astro 5 with React components, Tailwind CSS 4, and supports bidirectional wiki-style linking between notes.

**Key Architecture:**

- **Framework:** Astro 5 with MDX support for content
- **Styling:** Tailwind CSS 4 with custom theme system (CSS variables + multiple themes)
- **Content Management:** Astro Content Collections for type-safe content
- **React Integration:** Used selectively for interactive components (Bento cards, forms)
- **Path Aliases:** `@/*` maps to `src/*` (see `tsconfig.json`)
- Use `UK` date formatting

## Content Architecture

### Content Collections (`src/content/`)

Three main collections defined in `src/content.config.ts`:

1. **`posts`** - Digital garden notes with wiki-style linking
   - Schema: `title`, `date`, `updated`, `aliases`, `tags`, `stage` (seedling/budding/evergreen)
   - Location: `src/content/posts/**/*.{md,mdx}`
   - Supports bidirectional links via `[[note-title]]` or `[[note-title:display text]]`

2. **`resumeSkills`** - Structured skill data for resume
   - Location: `src/content/skills.json`

3. **`navItems`** - Navigation configuration
   - Location: `src/content/nav-items.json`

### Static Data Files

- **Portfolio:** `src/content/portfolio.ts` - Personal info, links, skills for bento grid homepage
- **Resume:** `src/content/resume.ts` - Complete resume data structure (header, experiences, projects, skills)

## Critical Features

### 1. Bidirectional Wiki Links

**Implementation:** `src/utils/bidirectional-link.ts`

- **Syntax:** `[[note-title]]` or `[[note-title:custom text]]`
- **Processing:** `remark-wiki-link` plugin in `astro.config.mjs` transforms to `/posts/{permalink}`
- **Functions:**
  - `getOutgoingNotes(node)` - Extract all `[[links]]` from a post's body
  - `getIncomingNotes(node)` - Find all posts linking TO this note (matches slug, title, or aliases)
  - Used in `src/pages/posts/[...slug].astro` to display backlinks

**Example:** When editing posts, maintain `[[links]]` format. The `BackReferenceSection` component displays incoming links at bottom of each post.

### 2. Theme System

**Themes:** `nzk` (default), `nexus`, `dark`

- **Configuration:** `src/components/ThemeToggle.astro` defines available themes
- **CSS Variables:** Each theme file (`src/styles/theme_*.css`) defines oklch color variables
- **Storage:** Theme persisted to localStorage, applied via class on `<html>` element
- **Adding New Themes:**
  1. Create `src/styles/theme_name.css` with CSS variables (follow `theme_dark.css` structure)
  2. Import in `src/styles/global.css`
  3. Add theme name to `themes` array in `ThemeToggle.astro`
  4. Add corresponding icon/button in ThemeToggle component

### 3. Bento Grid Layout

**Homepage (`src/pages/index.astro`):** Portfolio displayed as bento grid

- **Card Component:** `src/components/bento/card.astro` - Wrapper with responsive sizing
  - Props: `colSpan` (Tailwind classes like `lg:col-span-9`), `rowSpan`, `title`
- **Portfolio Cards:** `src/components/bento/portfolio-bento/` - Individual card content
  - `IntroCard.astro`, `AboutMe.astro`, `TimeZoneCard.astro`, etc.
- **Layout:** Uses Tailwind grid with breakpoints: `md:grid-cols-2 lg:grid-cols-12`

### 4. Resume Pages

**Two Variants:**

- `/resume` - Interactive web version (`src/pages/resume.astro`)
- `/resume-print` - Print-optimized version (`src/pages/resume-print.astro`)
- `/cv-print` - Alternative print layout

**Data Source:** `src/content/resume.ts` - Single source of truth

**Components:** `src/components/resume/` organized by:

- `sections/` - Content sections (Experiences, Projects, Skills, etc.)
- `sections/print/` - Print-specific section variants
- `layout/` - Layout wrappers for print vs web
- Base components: `SectionBlock`, `UnorderedList`, `ListItem`, `Divider`

## Development Workflows

### Running Development Server

```bash
npm run dev          # Standard dev server (localhost:4321)
docker compose up -d # Bun-based Docker dev (port 4322)
```

**Docker Setup:** `bun.compose.yml` + `bun.Dockerfile` for containerized development with Bun runtime.

### Building & Preview

```bash
npm run build   # Production build → dist/
npm run preview # Preview production build
```

### Code Formatting

```bash
npm run format  # Prettier with cache
```

**Configuration:** `.prettierrc` (assumed standard) with plugins:

- `prettier-plugin-astro`
- `prettier-plugin-tailwindcss`

## Project Conventions

### Import Patterns

**Always use `@/` alias for internal imports:**

```typescript
import BaseLayout from '@/layouts/BaseLayout.astro'
import { PORTFOLIO } from '@/content/portfolio.ts'
import { getCollection } from 'astro:content'
```

### File Organization

- **Pages:** `src/pages/` - File-based routing (Astro convention)
- **Layouts:** `src/layouts/` - Page templates (`BaseLayout`, `PostLayout`, `BaseLayoutPrint`)
- **Components:** `src/components/` organized by feature:
  - `bento/` - Homepage bento grid
  - `resume/` - Resume page components
  - `post/` - Blog post UI components
  - `ui/` - Shared UI primitives (shadcn-style)
- **Styles:** `src/styles/` - Global CSS, themes, fonts
- **Utils:** `src/utils/` - Pure functions (bidirectional links, classname utilities)

### Styling Conventions

1. **Tailwind v4:** Uses `@import 'tailwindcss'` in CSS (not `base`/`components`/`utilities`)
2. **CSS Variables:** All colors use oklch variables defined per theme
3. **Typography:** `@tailwindcss/typography` with custom prose styles in `tailwind.config.ts`
4. **Fonts:**
   - Sans: Lato, Metric (primary)
   - Serif: Canela, DM Serif Text
   - Mono: Inconsolata
   - Defined in `tailwind.config.ts` + `src/styles/fonts.css`

### Content Writing

**Creating New Posts:**

1. Add to `src/content/posts/` as `.md` or `.mdx`
2. Include frontmatter:
   ```yaml
   ---
   title: 'Post Title'
   date: '2024-12-10'
   tags: ['tag1', 'tag2']
   stage: 'seedling' # or "budding", "evergreen"
   aliases: ['alternative-name'] # optional
   ---
   ```
3. Use `[[wiki-links]]` to reference other posts
4. Math support via KaTeX: inline `$...$`, block `$$...$$`

### React Components

**When to use React:**

- Interactive UI (forms, dynamic state)
- Animation with Framer Motion
- Client-side only features

**Pattern:**

```tsx
// src/components/example.tsx
import { useState } from 'react'

export function Example() {
  // React component logic
}
```

**Usage in Astro:**

```astro
---
import { Example } from '@/components/example'
---

<Example client:load />
```

## Key Integration Points

### Markdown Processing Pipeline

1. **Remark Plugins:**
   - `remark-math` - Parse math syntax
   - `remark-wiki-link` - Transform `[[links]]` to proper hrefs

2. **Rehype Plugins:**
   - `rehype-katex` - Render math with KaTeX

**Configuration:** `astro.config.mjs` → `markdown.remarkPlugins` / `rehypePlugins`

### Astro Collections Usage

**Getting collection data:**

```typescript
import { getCollection, getEntry, render } from 'astro:content'

// Get all posts
const posts = await getCollection('posts')

// Get single post
const post = await getEntry('posts', 'my-post')

// Render MDX content
const { Content } = await render(post)
```

**Example:** `src/pages/posts/[...slug].astro` uses this pattern for dynamic post routes.

## Common Tasks

### Adding a New Page

1. Create `src/pages/pagename.astro`
2. Use `BaseLayout` wrapper
3. Add to navigation in `src/content/nav-items.json` if needed

### Adding a New Theme

1. Create `src/styles/theme_themename.css` with all CSS variables
2. Import in `src/styles/global.css`: `@import './theme_themename.css';`
3. Update `src/components/ThemeToggle.astro`:
   - Add to `themes` array
   - Add icon button with `id="themenameButton"`

### Modifying Resume Content

**Edit:** `src/content/resume.ts` - All resume data lives here

**Structure:** TypeScript object with nested sections (header, skills, experiences, projects, education)

**Apply to both web and print versions automatically**

### Adding Bento Card to Homepage

1. Create component in `src/components/bento/portfolio-bento/YourCard.astro`
2. Import in `src/pages/index.astro`
3. Wrap in `<Card>` with appropriate `colSpan` and `rowSpan` props

## Deployment

**Platform:** Netlify (config: `netlify.toml`) and Vercel (config: `vercel.json`)

**Build Command:** `npm run build`

**Output Directory:** `dist/`

**Environment:** `process.env.CI` used for site URL in `astro.config.mjs`

## Reference Projects

The project draws inspiration from:

- [AREA44/astro-shadcn-ui-template](https://github.com/AREA44/astro-shadcn-ui-template) - shadcn/ui integration
- [chrismwilliams/astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus) - Blog theme structure
- [techtim-astro-bento-portfolio](https://github.com/tim-hub/techtim-astro-bento-portfolio) - Bento grid layout

## Testing & Debugging

**No formal test suite currently.** Manual testing workflow:

1. Run dev server: `npm run dev`
2. Check browser console for errors
3. Test theme switching works across pages
4. Verify wiki links resolve correctly in posts
5. Check print styles at `/resume-print` and `/cv-print`

**Common Issues:**

- **Missing backlinks:** Ensure post has `aliases` in frontmatter if referenced by different names
- **Theme not persisting:** Check localStorage is enabled in browser
- **Import errors:** Verify `@/` paths are correctly configured in `tsconfig.json`
