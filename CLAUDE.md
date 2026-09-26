# Digital Garden 2024 — AI Agent Instructions

An **Astro 7 digital garden and personal portfolio** — Zettelkasten-style posts and
notes with bidirectional wiki links, plus a resume/CV published on the web and
printed to PDF. React for interactive UI, Tailwind CSS 4, deployed to Cloudflare
Workers (`@astrojs/cloudflare`).

## Commands

Use `bun` (`npm`/`npx` also work).

```bash
bun install          # install dependencies
bun run dev          # dev server at localhost:4321
bun run build        # production build — the check that code, schemas and content still compile
bun run format       # prettier
bun run test         # vitest — unit tests for pure modules (src/**/*.test.ts)
```

`bun run test` and `bun run build` both passing is the bar for a code change. Tests cannot import `astro:content`; put logic worth testing in a pure module behind the Astro adapter (e.g. `src/lib/resume-resolve.ts` behind `src/lib/resume.ts`).

## Where knowledge lives

- `CONTEXT.md` — domain vocabulary (Resume Version, Section, Default Version, Print Page). Name code and docs after it.
- `docs/adr/` — decisions that constrain the code. Read the ones for the area you touch before changing it.
- `docs/README.md` — index of the knowledge base: `architecture/` (how the system works, incl. `project-structure.md`) and `content/` (every content format).

Two project agents in `.claude/agents/` split the work: **developer** (code, schemas, visual layer) and **web-master** (content and data values).

## Conventions

- **Imports:** always the `@/` alias (→ `src/`), e.g. `import BaseLayout from '@/layouts/BaseLayout.astro'`.
- **Tailwind v4:** `@import 'tailwindcss'` (the v3 `@tailwind base/components/utilities` directives are gone).
- **Colours:** oklch CSS variables defined per theme in `src/styles/presets/`; components reference the variables, never literal hex/rgb.
- **Fonts:** Sans (Lato, Metric) · Serif (Canela, DM Serif Text) · Mono (Inconsolata). New fonts go in `astro.config.mjs` → `fonts[]` (`fontProviders.google()`) plus a `<Font cssVariable="--font-<kebab-name>" />` entry in `src/components/FontLoader.astro` — not a Google Fonts `@import` in CSS.
- **React:** only for interactive, animated or browser-only UI, always with a `client:*` directive (without one it renders as static HTML).
- **Dates:** stored as `YYYY-MM-DD` in frontmatter/JSON; displayed in UK format (DD/MM/YYYY).

## Content and schema sync

`docs/content/` is the single source of truth for content formats (start at `docs/content/content-architecture.md`). Static site data lives in `src/data/portfolio.ts` and `src/data/site.config.ts` (imported directly, not collections).

**Schema-sync rule:** changing `src/content/collection-definitions/**`, `src/data/portfolio.ts` or `src/data/site.config.ts` means updating the matching doc in the same task — the source → doc table is in `docs/content/content-architecture.md`. The task is not complete until the docs match the live schema.

## LLM-generated artifacts

Save to `docs/<category>/yyyy-mm-dd-<topic>.<md|html>`, where `<category>` is a free-form folder directly under `docs/` — e.g. `research`, `handoff`, `design`; add new ones as needed. `architecture/`, `content/` and `adr/` are reserved for maintained reference docs and decision records.

HTML artifacts use the Anthropic visual style: ivory `#F0EEE6` background, clay `#CC785C` accent, serif headings.

## Common issues

- **Import errors:** check the `@/` alias in `tsconfig.json` `paths`.
- **Cloudflare build failures:** make sure `wrangler.jsonc` `compatibility_date` is current.
