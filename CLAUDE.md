# Digital Garden 2024 — AI Agent Instructions

## Commands

Use `bun` as the package manager (preferred). `npm` and `npx` are acceptable alternatives.

```bash
bun install          # install dependencies
bun run dev          # dev server at localhost:4321
```

---

## Agents

Two project agents live in `.claude/agents/` and read from the `docs/` knowledge base:

- **`developer`** — content, schemas, and architecture. Owns data and collection
  definitions; reads `docs/content/` and `docs/architecture/`.
- **`web-master`** — themes and the visual layer. Owns CSS presets, `ThemeToggle`,
  OG image styling, and bento layout; reads `docs/architecture/add-theme.md` and the visual
  architecture docs.

`docs/README.md` is the index for the knowledge base.

---

## Project Overview

An **Astro-based digital garden and personal portfolio** — Zettelkasten-style knowledge base + resume/CV pages. Built with Astro 6, React, Tailwind CSS 4, and bidirectional wiki-style linking.

- **Framework:** Astro 6 + MDX → Cloudflare Workers (`@astrojs/cloudflare`)
- **Styling:** Tailwind CSS 4 (Vite plugin), oklch CSS variables, multiple themes
- **Content:** Astro Content Collections (`glob` loader API)
- **Path Aliases:** `@/*` → `src/*`
- **Date Formatting:** UK format (DD/MM/YYYY)

---

## Project Structure

```
.agents/           Global AI agent skills
.claude/agents/    Project agents (developer, web-master)
docs/              Knowledge base — architecture/, content/, artifacts/
_references/       Local reference repos (gitignored)
src/
  assets/          Static assets
  components/      bento/, resume/, post/, ui/, og/, aceternity/
  content/         collection-definitions/, posts/, notes/, resume/
  data/            Static config files (site.config.ts, portfolio.ts)
  layouts/         BaseLayout, PostLayout, BaseLayoutPrint
  lib/             Browser utilities
  pages/           File-based routing
  styles/          presets/ (per-theme CSS), fonts.css, global.css
  utils/           Pure functions (bidirectional-link.ts, cn.ts)
```

---

## Conventions

### Imports

Always use the `@/` alias (maps to `src/`), configured in `tsconfig.json` and `astro.config.mjs`:

```typescript
// ✅ correct
import BaseLayout from '@/layouts/BaseLayout.astro'
// ❌ avoid
import BaseLayout from '../../../layouts/BaseLayout.astro'
```

### Styling

- **Tailwind v4:** use `@import 'tailwindcss'` (not `@tailwind base/components/utilities`)
- **Colors:** oklch CSS variables per theme — never hardcode colors
- **Fonts:** Sans (Lato, Metric) · Serif (Canela, DM Serif Text) · Mono (Inconsolata)
- **Font loading:** Astro Font API (`astro.config.mjs` → `fonts[]` with `fontProviders.google()`) + `FontLoader.astro` component injected in `BaseLayout.astro` `<head>`. CSS variables follow `--font-<kebab-name>` convention (e.g. `--font-lato`). Do **not** add Google Fonts `@import` to CSS — configure new fonts in `astro.config.mjs` and add a `<Font cssVariable="..." />` entry in `src/components/FontLoader.astro` instead.

### React Components

Use React only for interactive UI, animations (Framer Motion), or browser-only features. Always add a `client:*` directive — without one, the component renders as static HTML with no JS.

| Directive             | Use for                                        |
| --------------------- | ---------------------------------------------- |
| `client:load`         | Above-the-fold interactive components          |
| `client:idle`         | Non-critical UI                                |
| `client:visible`      | Below-the-fold animations/effects              |
| `client:only="react"` | Components that use `window`, WebGL, or canvas |

---

## Content

See **`docs/content/`** (start at `docs/content/content-architecture.md`) for the full collections table, article schema, and static config details — it is the single source of truth for content formats. The **developer** agent owns this area.

**Static data files** (in `src/data/`, imported directly — not Astro collections):

- `src/data/portfolio.ts` — personal info, links, skills (bento homepage)
- `src/data/site.config.ts` — site-wide config (display name, title, GitHub URL)

**Documentation rule:** whenever you change `src/content/collection-definitions/**`, `src/data/portfolio.ts`, or `src/data/site.config.ts`, update the matching reference doc in `docs/content/`. A task is not complete until the docs are in sync.

---

## LLM-Generated Artifacts

Save artifacts to the docs knowledge base:

```
docs/artifacts/<category>/yyyy-mm-dd-<topic>.<md|html>
```

Files may be **Markdown (`.md`)** or **HTML (`.html`)**. For HTML, use the Anthropic
visual style (ivory `#F0EEE6` background, clay `#CC785C` accent, serif headings) —
see `docs/artifacts/plan/2026-06-14-docs-restructure-plan.html` for a reference.

`<category>` is a free-form folder — create whatever fits the artifact. Common ones:

- `prd` — product requirement documents and feature specs
- `plan` — implementation plans and architectural decisions
- `research` — research notes, reference analysis, tech comparisons
- `design` — design decisions, UX notes, visual direction

Add new category folders as needed; the list above is a starting set, not a closed set.

---

## Common Issues

- **Missing backlinks:** Add `aliases` to frontmatter if a note is referenced by a different name
- **Theme not persisting:** Check browser localStorage is enabled
- **Import errors:** Verify `@/` alias in `tsconfig.json` `paths`
- **Cloudflare build failures:** Ensure `wrangler.jsonc` `compatibility_date` is current
