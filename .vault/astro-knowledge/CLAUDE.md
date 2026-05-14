# Digital Garden 2024

Astro 5 digital garden + personal portfolio. Combines a Zettelkasten-style knowledge base with resume/CV pages.

**Stack:** Astro 5, React, Tailwind CSS 4, MDX, Cloudflare Workers  
**Package manager:** `bun`

## Project Structure

```
src/
  components/
    bento/          Homepage bento grid cards
    resume/         Resume section components (web + print)
    post/           Post/article UI
    ui/             Shared primitives (shadcn-style)
  content/
    posts/          Digital garden posts (.md, .mdx)
    notes/          Shorter notes (.md, .mdx)
    resume/         Resume data (JSON files)
  layouts/          BaseLayout, PostLayout, BaseLayoutPrint
  lib/              Browser utilities
  pages/            File-based routing
  styles/
    presets/        Per-theme CSS files (nzk, nexus, dark)
  utils/            Pure functions (bidirectional-link, cn)
_references/        Reference repositories (gitignored)
.vault/             Obsidian vault (this folder)
```

## Key Concepts

- **Themes:** `nzk` (default), `nexus`, `dark` — CSS variables in `src/styles/presets/`
- **Wiki links:** `[[note-title]]` syntax, resolved to `/posts/{permalink}`
- **Backlinks:** computed at build time via `src/utils/bidirectional-link.ts`
- **Resume:** data lives in `src/content/resume/` JSON files; renders to `/resume`, `/resume-print`, `/cv-print`
- **Homepage:** bento grid layout at `src/pages/index.astro`

## Commands

```bash
bun run dev      # localhost:4321
bun run build    # production build → dist/
bun run format   # prettier
```