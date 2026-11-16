# How to Manage Projects

Each project is one MDX file in its own folder, and gets:

- **a project page** at `/projects/<slug>` (`src/pages/projects/[slug].astro`) —
  the cover, links to the site and repo, and the MDX body as the project story;
- **a card** on the `/projects` page (`src/pages/projects/index.astro`);
- **a card in the home-page Projects showcase**, when `featured: true`;
- **an OG image** at `/og/projects/<slug>.png`, from its frontmatter.

Cards are drawn by `src/components/bento/portfolio-bento/ProjectShowcase.astro`.

| Collection | Source                          |
| ---------- | ------------------------------- |
| `projects` | `src/content/projects/**/*.mdx` |

Schema: `src/content/collection-definitions/project.ts`. Only `.mdx` is loaded —
a `.md` file in `projects/` is skipped.

> These are portfolio projects. Resume projects are a separate collection
> (`resumeProjects`) — see [`resume.md`](./resume.md).

---

## Folder layout

One folder per project; the folder name is the entry id and the URL slug. Keep
images next to `index.mdx`.

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
title: string # required — card heading and page title
description: string # required — card text and page subtitle, one or two sentences
url: string # optional — website: the ↗ icon on the card, "Visit site" on the page
github: string # optional — repo: the GitHub icon on the card, "GitHub" on the page
cover: string # optional — image path relative to index.mdx; card thumbnail and page hero
coverAlt: string # optional — alt text for cover on the page (default: "<title> screenshot")
featured: boolean # optional, default: false — show in the home Projects showcase
order: integer # optional — sort position, ascending; projects without one go last, by title

# shared article fields (all optional)
date: string # created, YYYY-MM-DD
updated: string # YYYY-MM-DD
aliases: [string, ...]
tags: [string, ...]
stage: seedling | budding | evergreen
ogStyle: default | default-dark | particle
llmAssisted: boolean
---
```

A project must have a `url`, a `github`, or both; the build fails otherwise.
A missing `cover` file also fails the build.

---

## Card and page behaviour

- **Card:** clicking anywhere opens the project page. The ↗ icon (when `url`
  is set) and the GitHub icon (when `github` is set) open the site and repo in
  a new tab. With a `cover`, the card shows it as a 16:9 thumbnail, cropped from
  the top.
- **Page:** "All projects" back link, the title block (title, description,
  dates, tags — the same header as posts), "Visit site" and "GitHub" buttons,
  the cover, the MDX body, then previous/next links in `order`.

---

## Example

```mdx
---
title: Nexus
description: 'A link hub: a profile card and links to everything I build.'
url: https://nexus.altrf.dev
github: https://github.com/chuan-khuna/nexus
cover: ./screenshot.png
coverAlt: 'Nexus home page: a profile card with live clocks and link cards'
featured: true
order: 1
date: '2025-01-01'
tags: [astro, portfolio]
stage: seedling
---

## Why I built it

...

![The link cards on a phone](./mobile.png)
```

Quote a `description` or `coverAlt` that contains `: ` (YAML would otherwise
read it as a map).

In the body, reference images with Markdown syntax — a relative path
(`./mobile.png`) or the `@/` alias (`@/assets/…`). Astro optimises both; no
`import` is needed. Don't repeat the cover in the body; the page already shows it.

---

## Common tasks

- **Add a project:** create `src/content/projects/<slug>/index.mdx`.
- **Write the project story:** add Markdown/MDX below the frontmatter.
- **Add a cover:** put the image next to `index.mdx` and set `cover` and `coverAlt`.
- **Reorder:** change `order` — it sorts the home showcase, `/projects` and the
  previous/next links.
- **Hide from the home showcase:** set `featured: false` (or remove it). It stays on `/projects`.
