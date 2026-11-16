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

`bun run test` and `bun run build` both passing is the bar for a code change. Tests cannot import `astro:content`; put logic worth testing in a pure module behind the Astro adapter (e.g. `src/lib/resume/resolve.ts` behind `src/lib/resume/index.ts`).

## Where knowledge lives

- `GLOSSARY.md` — domain vocabulary (Resume Version, Section, Default Version, Print Page). Name code and docs after it.
- `docs/adr/` — decisions that constrain the code. Read the ones for the area you touch before changing it.
- `docs/README.md` — index of the knowledge base: `documents/` (how the system works, incl. `project-structure.md`) and `content-formats/` (every content format).

Two project agents in `.claude/agents/` split the work: **developer** (code, schemas, visual layer) and **web-master** (content and data values).

## Conventions

- **Imports:** always the `@/` alias (→ `src/`), e.g. `import BaseLayout from '@/layouts/BaseLayout.astro'`.
- **Tailwind v4:** `@import 'tailwindcss'` (the v3 `@tailwind base/components/utilities` directives are gone).
- **Colours:** oklch CSS variables defined per theme in `src/styles/presets/`; components reference the variables, never literal hex/rgb.
- **Fonts:** Sans (Lato, Metric) · Serif (Canela, DM Serif Text) · Mono (Inconsolata). New fonts go in `astro.config.mjs` → `fonts[]` (`fontProviders.google()`) plus a `<Font cssVariable="--font-<kebab-name>" />` entry in `src/components/FontLoader.astro` — not a Google Fonts `@import` in CSS.
- **React:** only for interactive, animated or browser-only UI, always with a `client:*` directive (without one it renders as static HTML).
- **Dates:** stored as `YYYY-MM-DD` in frontmatter/JSON; displayed in UK format (DD/MM/YYYY).

## Content and schema sync

`docs/content-formats/` is the single source of truth for content formats (start at `docs/content-formats/content-architecture.md`). Static site data lives in `src/data/portfolio.ts` and `src/data/site.config.ts` (imported directly, not collections).

**Schema-sync rule:** changing `src/content/collection-definitions/**`, `src/data/portfolio.ts` or `src/data/site.config.ts` means updating the matching doc in the same task — the source → doc table is in `docs/content-formats/content-architecture.md`. The task is not complete until the docs match the live schema.

## LLM-generated artifacts

Save to `docs/<category>/yyyy-mm-dd-<topic>.<md|html>`, where `<category>` is a free-form folder directly under `docs/` — e.g. `research`, `handoff`, `design`; add new ones as needed. `documents/`, `content-formats/`, `adr/` and `records/` are reserved for maintained reference docs, decision records and discussion records.

HTML artifacts follow the rules in Project docs → HTML documents.

## Project docs

### Documents

Documents about this project, including how it is implemented, live in `docs/documents/<name>.md` (or `.html`). `docs/documents/INDEX.md` is the entry point: it lists every document as one bullet, `- [Title](<name>.md) — one-line summary`.

- Read the index before working on an area, and open the documents relevant to it.
- When you add, rename or remove a document, update `INDEX.md` in the same change.
- Keep documents in step with the code they describe: if a change makes a document wrong, fix the document in the same change.

### HTML documents

When a document in `docs/` is generated as HTML:

- **Shared assets:** CSS and JS used across HTML documents live in `docs/shared/` (`globals.css`, `doc.js`). Link them with relative paths instead of inlining or duplicating them per page; add new shared code there. Load `doc.js` in `<head>` without `defer` so the saved theme applies before first paint; see its header comment for the page contract.
- **Theme:** choose from a dropdown with "Auto (system)" first, then options grouped by Light and Dark.
  - Light: Rosé Pine Dawn, Catppuccin Latte, Everforest Light, Kanagawa Lotus.
  - Dark: Rosé Pine Moon, Catppuccin Macchiato, Everforest Dark, Kanagawa Wave.
  - Auto follows the system setting with Rosé Pine (Dawn or main).
- **Code blocks:** highlight with Shiki, using the Shiki theme that matches the selected page theme.
- **Diagrams:** write them in Mermaid and render with Pele (`pele.run/api`). Make them expandable, zoomable and pannable, with expand, close and zoom icon controls.
- **Styling:** small border radius (about 3–6px), and thin scrollbars styled to match the theme.
- **Table of contents:** always include one.
- **Colour:** write every colour in `oklch()` (derive with `color-mix(in oklch, …)`); no hex, `rgb()` or `hsl()`.
- **Thai body text:** use a looped Thai font (Noto Sans Thai Looped).
- **Glossary cards:** define each project term once, in a glossary on the page (`<dl class="glossary">` or a table marked `data-glossary`), with `id="term-<slug>"`. Mark the first use of a term in each `h2` section as `<a class="term" href="#term-<slug>">`; `doc.js` shows its meaning in a card on hover, focus or tap. Do not mark a term that has no entry.
- **Technical manuals** (setup guides, runbooks, how-to, API guides): write in ASD-STE100 at about 60%. Procedures are numbered steps, one action each, starting with a verb; condition before action; active voice; steps of 20 words or fewer; warnings before their step; the glossary term every time, never a synonym. Explanations may read naturally, and the STE dictionary is not required. Thai text follows the same principles.

### Records

Discussion records live at `docs/records/yyyy-mm-dd-<topic>.md`, dated the day the discussion took place. Each record captures one discussion: what was discussed, what was decided, and any open questions.

## Agent skills

### Issue tracker

Issues and PRDs live as local markdown files under `.scratch/<feature-slug>/` (no remote tracker). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Common issues

- **Import errors:** check the `@/` alias in `tsconfig.json` `paths`.
- **Cloudflare build failures:** make sure `wrangler.jsonc` `compatibility_date` is current.
