# How to Manage Projects

Each project is one MDX file in its own folder. A project with `featured: true`
appears as a card in the **Projects showcase** under the home-page bento grid
(`src/components/bento/portfolio-bento/ProjectShowcase.astro`).

| Collection | Source |
|------------|--------|
| `projects` | `src/content/projects/**/*.mdx` |

Schema: `src/content/collection-definitions/project.ts`. Only `.mdx` is loaded —
a `.md` file in `projects/` is skipped.

> These are portfolio projects. Resume projects are a separate collection
> (`resumeProjects`) — see [`resume.md`](./resume.md).

---

## Folder layout

One folder per project; the folder name is the entry id. Keep images next to
`index.mdx`.

```
src/content/projects/
  nexus/
    index.mdx
    screenshot.png
  dictionary-tui/
    index.mdx
```

---

## Frontmatter schema

The [shared article schema](./posts.md#frontmatter-schema) plus project fields.

```yaml
---
# project fields
title: string            # required — card heading
description: string      # required — card text, one or two sentences
url: string              # optional — website; clicking the card opens it (new tab)
github: string           # optional — repo; a GitHub icon on the card, or the card link when there is no url
featured: boolean        # optional, default: false — show in the Projects showcase
order: integer           # optional — showcase position, ascending; projects without one go last

# shared article fields (all optional)
date: string             # created, YYYY-MM-DD
updated: string          # YYYY-MM-DD
aliases: [string, ...]
tags: [string, ...]
stage: seedling | budding | evergreen
ogStyle: default | default-dark | particle
llmAssisted: boolean
---
```

A project must have a `url`, a `github`, or both; the build fails otherwise.

---

## Example

```mdx
---
title: Nexus
description: 'A link hub: a profile card and links to everything I build.'
url: https://nexus.altrf.dev
github: https://github.com/chuan-khuna/nexus
featured: true
order: 1
date: '2025-01-01'
tags: [astro, portfolio]
stage: seedling
---

## What it is

![Nexus profile card](./screenshot.png)
```

Quote a `description` that contains `: ` (YAML would otherwise read it as a map).

Reference images with Markdown syntax — a relative path (`./screenshot.png`) or
the `@/` alias (`@/assets/…`). Astro optimises both; no `import` is needed.

---

## Common tasks

- **Add a project:** create `src/content/projects/<slug>/index.mdx`.
- **Reorder the showcase:** change `order`.
- **Hide from the showcase:** set `featured: false` (or remove it).

The MDX body is not rendered on any page yet — there is no `/projects/<slug>` route.
