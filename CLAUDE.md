# Digital Garden 2024 — AI Agent Instructions

## Commands

Use `bun` as the package manager (preferred). `npm` and `npx` are acceptable alternatives.

```bash
bun install          # install dependencies
bun run dev          # dev server at localhost:4321
bun run build        # production build to ./dist/
bun run preview      # preview production build
bun run format       # Prettier with cache
bunx astro add ...   # add Astro integrations (e.g. tailwind, react)
bunx astro check     # TypeScript diagnostics
```

**Docker (Bun-based):**

```bash
docker compose -f bun.compose.yml up -d  # Port 4322
```

## Project Overview

An **Astro-based digital garden and personal portfolio** combining a Zettelkasten-style knowledge base with resume/CV pages. Built with Astro 6, React, Tailwind CSS 4, and bidirectional wiki-style linking between notes.

**Key Architecture:**

- **Framework:** Astro 6 with MDX, deployed on **Cloudflare Workers** via `@astrojs/cloudflare`
- **Styling:** Tailwind CSS 4 (Vite plugin) with CSS variables + multiple themes
- **Content:** Astro Content Collections (Astro 6 `glob` loader API)
- **React:** Used selectively for interactive/animated components
- **Path Aliases:** `@/*` → `src/*` (see `tsconfig.json`)
- **Date Formatting:** Use UK format (DD/MM/YYYY)

## Special Directories

- **`_references/`** — Local reference repositories (gitignored, not part of the project)
- **`.vault/astro-knowledge/`** — Obsidian vault for project notes and knowledge (do not modify programmatically)
- **`skills/`** — Project-specific AI agent skills for managing and extending this site (see `skills/README.md`)

---

## Content Architecture

### Content Collections (`src/content/`)

Defined in `src/content.config.ts` using the Astro 6 `glob`/`file` loader API. For the full collections table, article schema, and static config files, see the **`manage-content`** skill (`skills/manage-content/references/content-architecture.md`).

### Collection Definitions Structure

Each collection is defined in its own file under `src/content/collection-definitions/` and imported into `src/content.config.ts`:

```
src/content/collection-definitions/
  post.ts        # posts collection (MDX/MD digital garden notes)
  note.ts        # notes collection (shorter MDX/MD notes)
  resume.ts      # all resume-related collections (skills, projects, experiences, etc.)
  nav.ts         # navigation items
  og-images.ts   # OG image configs
  common-fields/
    _article.ts        # shared article Zod schema (used by post + note)
    _og-styles.ts      # OG style enum
    _evergreen-stages.ts # stage enum (seedling/budding/evergreen)
```

- Each file exports a named `defineCollection(...)` constant matching the collection key.
- `src/content.config.ts` only imports those exports and re-exports them via `collections`.
- When adding a new collection: create `src/content/collection-definitions/<entity>.ts`, export the collection, then add it to `collections` in `src/content.config.ts`.

### Static Data Files

- `src/content/portfolio.ts` — Personal info, links, skills for the bento homepage
- `src/content/site.config.ts` — Site-wide config (display name, title, GitHub URL)

---

## Development Workflows

**Build:** `bun run build` → `dist/` | **Deploy:** Cloudflare Workers (primary) — see `.vault/astro-knowledge/notes/documents/Deployment.md`.

---

## Project Conventions

### Imports

Always use the `@/` alias instead of relative paths when importing files or components. The alias maps to `src/` and is configured in both `tsconfig.json` and `astro.config.mjs`.

```typescript
// ✅ correct
import BaseLayout from '@/layouts/BaseLayout.astro'
import { PORTFOLIO } from '@/content/portfolio.ts'
import { getCollection } from 'astro:content'

// ❌ avoid
import BaseLayout from '../../../layouts/BaseLayout.astro'
import { PORTFOLIO } from '../../../content/portfolio.ts'
```

This applies to `.astro`, `.tsx`, `.ts` — all source files.

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

### React Components

Use React only for interactive UI, animations (Framer Motion), or client-side-only features.

```astro
---
import { MyComponent } from '@/components/my-component'
---

<MyComponent client:load />
```

---

## Troubleshooting Display and Animation Issues

When animations, visual effects, or interactive behavior don't work as expected, the cause is often Astro's default static rendering — React components render to HTML on the server and ship no JS unless a `client:*` directive is present.

Reference: https://docs.astro.build/en/reference/directives-reference/#client-directives

| Directive             | When JS loads                  | Use for                                                             |
| --------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `client:load`         | Immediately on page load       | Above-the-fold interactive components                               |
| `client:idle`         | When browser is idle           | Non-critical UI                                                     |
| `client:visible`      | When component enters viewport | Below-the-fold animations/effects                                   |
| `client:only="react"` | Immediately, skips SSR         | Components that break during SSR (e.g. use `window`, WebGL, canvas) |

If an animation or effect works in isolation but breaks on the site, first check whether the component has the right `client:*` directive. `client:only` is the escape hatch for anything that relies on browser APIs unavailable during SSR.

---

## LLM-Generated Artifacts

Artifacts produced during AI-assisted sessions (plans, research notes, design decisions, conversation summaries) are stored under:

```
docs/artifacts/<type>/yyyy-mm-dd-<topic>.md
```

**Type subdirectories:**

| Type       | Contents                                             |
| ---------- | ---------------------------------------------------- |
| `prd`      | Product requirement documents and feature specs      |
| `plan`     | Implementation plans and architectural decisions     |
| `research` | Research notes, reference analysis, tech comparisons |
| `design`   | Design decisions, UX notes, visual direction         |

**Example:**

```
docs/artifacts/plan/2026-05-24-new-theme-plan.md
docs/artifacts/research/2026-05-24-katex-alternatives.md
```

When producing an artifact during a session, save it to the appropriate subdirectory. Do not place artifacts directly in `docs/` root.

---

## Documentation Maintenance

The `skills/manage-content/` skill is the single source of truth for content formats in this project. Whenever you change any of the following, update the relevant files inside `skills/manage-content/` so the skill always reflects the live codebase:

- `src/content/collection-definitions/**` — any schema or collection definition change
- `src/content/portfolio.ts` or `src/content/site.config.ts` — any field added, removed, or renamed

**Rule:** read the changed source, find the matching reference doc in `skills/manage-content/references/`, and rewrite the affected schema block to match. A task is not complete until the skill is in sync with the code.

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
