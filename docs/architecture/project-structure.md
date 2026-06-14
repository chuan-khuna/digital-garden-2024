---
title: Project Structure
tags:
aliases:
  - File Organisation
  - Source Layout
---

# Project Structure

Top-level layout of the `src/` directory.

```
src/
  assets/         Static assets (images, fonts referenced in code)
  components/
    bento/        Homepage bento grid cards
    resume/       Resume page components
    post/         Post/article UI components
    ui/           Shared UI primitives (shadcn-style)
    og/           OG image components
    aceternity/   Aceternity UI animated components
  content/
    collection-definitions/  Zod schemas + collection configs
    posts/        Digital garden posts (.md, .mdx)
    notes/        Shorter notes (.md, .mdx)
    resume/       Resume data (JSON files)
  layouts/        BaseLayout, PostLayout, BaseLayoutPrint
  lib/            Browser utilities (browser-timezone, og-image generation)
  pages/          File-based routing (maps to URL paths 1:1)
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

---

## Key Entry Points

| Path | Purpose |
|---|---|
| `src/pages/index.astro` | Homepage (bento grid) |
| `src/pages/posts/[...slug].astro` | Individual post pages |
| `src/pages/resume.astro` | Web resume |
| `src/content.config.ts` | All content collection registrations |
| `src/styles/global.css` | Root stylesheet — imports all theme presets |
| `astro.config.mjs` | Astro config — plugins, integrations, adapter |

---

## Path Alias

`@/` maps to `src/`. Always use this alias instead of relative paths in `.astro`, `.tsx`, and `.ts` files.

```ts
// ✅
import BaseLayout from '@/layouts/BaseLayout.astro'
// ❌
import BaseLayout from '../../../layouts/BaseLayout.astro'
```

---

## Related

- [[Resume System]] — detailed breakdown of `src/components/resume/`
- [[Adding a Theme]] — detailed breakdown of `src/styles/presets/`
- [[OG Image Generator]] — `src/components/og/` and `src/lib/`
