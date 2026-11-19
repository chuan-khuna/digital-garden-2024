# How to Manage Posts and Notes

Both collections (`posts` and `notes`) use the **same schema** (`articleSchema`).
The only difference is where files live.

| Collection | Source directory |
|------------|-----------------|
| `posts` | `src/content/posts/**/*.{md,mdx}` |
| `notes` | `src/content/notes/**/*.{md,mdx}` |

---

## Frontmatter schema

Defined in: `src/content/collection-definitions/common-fields/_article.ts`

```yaml
---
title: string                        # required
description: string                  # optional
date: string                         # optional — created date, format: YYYY-MM-DD (UK display: DD/MM/YYYY)
updated: string                      # optional — last updated date, same format
aliases: [string, ...]               # optional — alternative names for backlink matching
tags: [string, ...]                  # optional
stage: seedling | budding | evergreen  # optional
ogStyle: default | default-dark | particle  # optional, default: 'default'
llmAssisted: boolean                 # optional, default: false
---
```

### Field notes

- **`stage`** — Evergreen note maturity level. Use `seedling` for new drafts, `budding` for developing ideas, `evergreen` for polished notes.
- **`aliases`** — Used by the bidirectional link system (`src/utils/bidirectional-link.ts`) to match `[[wiki-links]]` that reference this note by a different name.
- **`ogStyle`** — Controls the OG image style. `default` is light, `default-dark` is dark, `particle` is animated particles.
- **`llmAssisted`** — Flag to mark notes that were written with AI assistance.

---

## Example frontmatter

```yaml
---
title: 'Monads in Haskell'
description: 'A gentle introduction to monads through Haskell examples'
date: '2024-12-10'
updated: '2025-01-15'
tags: ['haskell', 'functional-programming', 'monads']
stage: 'budding'
aliases: ['monad', 'haskell-monad']
ogStyle: 'default'
llmAssisted: false
---
```

---

## Wiki links in content

Use `[[note-title]]` or `[[note-title:custom display text]]` within the MDX body.
The remark-wiki-link plugin resolves them to `/posts/{slug}`.

```mdx
See also [[monads in haskell]] or [[monads in haskell:this post about monads]].
```

---

## Table of contents

Every post gets a table of contents built from its `##` and `###` headings
(`TableOfContents.astro`, fed by the `headings` from `render(entry)`). At `xl`
and wider it is a sticky list in the right gutter that highlights the section
in view; below that it is a collapsible "Contents" block under the post header.
A post with fewer than two such headings shows none.

---

## Diagrams

Write a Mermaid diagram with the `Mermaid` component (MDX only). It is
rendered to SVG by [Pele](https://pele.run) at build time, so a broken diagram
fails the build with Pele's error. Colours follow the colour preset and the
theme toggle. The toolbar zooms, fits, copies the Mermaid source, downloads SVG
or PNG and expands the diagram to the full page.

```mdx
import Mermaid from '@/components/Mermaid.astro'

<Mermaid
  title="OG image pipeline"
  code={`flowchart LR
  post[Post frontmatter] --> png[og/posts/<id>.png]
  class png accent`}
/>
```

`title` (optional) shows in the toolbar and names the downloaded file;
`height` (optional, default 640) caps the inline height in px.
`class <node> accent` highlights a node.
