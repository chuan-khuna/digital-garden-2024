# Digital Garden 2024 — AI Agent Instructions

## Commands

Use `bun` as the package manager (preferred). `npm` and `npx` are acceptable alternatives.

```bash
bun install          # install dependencies
bun run dev          # dev server at localhost:4321
bun run build        # production build to ./dist/
bun run preview      # preview production build
bun run format       # Prettier with cache
bunx astro add ...   # add Astro integrations
bunx astro check     # TypeScript diagnostics
```

**Docker:** `docker compose -f bun.compose.yml up -d` (Port 4322)

**Deploy:** Cloudflare Workers — see `.vault/astro-knowledge/notes/documents/Deployment.md`.

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
.vault/            Obsidian vault (astro-knowledge/) — docs and LLM artifacts
_references/       Local reference repos (gitignored)
project-skills/    Project-specific skills (bunx skills@1.5.0 add ./project-skills -a 'universal claude-code' -y -p)
src/
  assets/          Static assets
  components/      bento/, resume/, post/, ui/, og/, aceternity/
  content/         collection-definitions/, posts/, notes/, resume/
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

See the **`manage-content`** skill (`project-skills/manage-content/`) for the full collections table, article schema, and static config details — it is the single source of truth for content formats.

**Static data files:**
- `src/content/portfolio.ts` — personal info, links, skills (bento homepage)
- `src/content/site.config.ts` — site-wide config (display name, title, GitHub URL)

**Documentation rule:** whenever you change `src/content/collection-definitions/**`, `portfolio.ts`, or `site.config.ts`, update the matching reference doc in `project-skills/manage-content/references/`. A task is not complete until the skill is in sync.

---

## LLM-Generated Artifacts

Save artifacts to the Obsidian vault:

```
.vault/astro-knowledge/notes/llm-artifacts/<category>/yyyy-mm-dd-<topic>.md
```

| Category   | Contents                                             |
| ---------- | ---------------------------------------------------- |
| `prd`      | Product requirement documents and feature specs      |
| `plan`     | Implementation plans and architectural decisions     |
| `research` | Research notes, reference analysis, tech comparisons |
| `design`   | Design decisions, UX notes, visual direction         |

---

## Common Issues

- **Missing backlinks:** Add `aliases` to frontmatter if a note is referenced by a different name
- **Theme not persisting:** Check browser localStorage is enabled
- **Import errors:** Verify `@/` alias in `tsconfig.json` `paths`
- **Cloudflare build failures:** Ensure `wrangler.jsonc` `compatibility_date` is current
