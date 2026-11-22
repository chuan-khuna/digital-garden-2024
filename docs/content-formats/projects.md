# How to Manage Projects

Each project is one MDX file in its own folder, and gets:

- **a project page** at `/projects/<slug>` (`src/pages/projects/[slug].astro`) —
  a cover banner, links to the site and repo, and the MDX body as the project story;
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
cover: string # optional — image path relative to index.mdx; card thumbnail and page banner (a wide image, not a screenshot)
coverAlt: string # optional — alt text for cover on the page (default: empty, decorative)
featured: boolean # optional, default: false — show in the home Projects showcase
order: integer # optional — sort position, ascending; projects without one go last, by title
stack: [string, ...] # optional — tech it is built with, main tool first; shown as "Built with" on the page

# shared article fields (all optional)
date: string # created, YYYY-MM-DD
updated: string # YYYY-MM-DD
aliases: [string, ...]
tags: [string, ...] # on a project: the kind of work (website, tui, …), not the tech — that is `stack`
stage: seedling | budding | evergreen
ogStyle: default | default-dark | particle
llmAssisted: boolean
---
```

**`tags` or `stack`?** `tags` say what kind of thing the project is
(`website`, `tui`, `cli`, `library`, …); `stack` lists what it is built with
(`astro`, `tailwind`, `python`, `cloudflare pages`, …). Keep tech out of `tags`.

`url` and `github` are both optional. Leave both out for a private project:
its card and page then show no link (don't link a private repo, it gives
visitors a 404).
A missing `cover` file also fails the build.

---

## Card and page behaviour

- **Card:** clicking anywhere opens the project page. The ↗ icon (when `url`
  is set) and the GitHub icon (when `github` is set) open the site and repo in
  a new tab. With a `cover`, the card shows it as a 16:9 thumbnail, cropped from
  the top. On `/projects` the card also lists its `tags` (as `#tag` chips) and
  its `stack`; the home showcase leaves them out.
- **Page:** "All projects" back link, the cover as a 3:1 banner (cropped from
  the centre), then the header — title, description, dates, tags, the
  "Built with" stack and the "Visit site" / "GitHub" buttons (the same header as posts) — the MDX body,
  and previous/next links in `order`.
- **Table of contents:** built from the body's `##` and `###` headings, the
  same as posts (see [posts.md](posts.md#table-of-contents)): a sticky sidebar
  at `xl` and wider, a collapsible "Contents" block under the header below
  that, and none when there are fewer than two such headings.

**Cover or body image?** `cover` is a banner: it is cropped to 3:1 on the page
and 16:9 on the card, so use artwork or a wide image that survives cropping. Put
screenshots and diagrams in the MDX body, where they show uncropped.

---

## Example

```mdx
---
title: Nexus
description: 'A link hub: a profile card and links to everything I build.'
url: https://nexus.altrf.dev
github: https://github.com/chuan-khuna/nexus
cover: ./cover.png
coverAlt: 'Nexus link cards on an indigo background'
featured: true
order: 1
date: '2025-01-01'
tags: [website]
stack: [astro, tailwind, cloudflare pages]
stage: seedling
---

## Why I built it

...

![Nexus home page: a profile card and link cards](./screenshot.png)
```

Quote a `description` or `coverAlt` that contains `: ` (YAML would otherwise
read it as a map).

In the body, reference images with Markdown syntax — a relative path
(`./screenshot.png`) or the `@/` alias (`@/assets/…`). Astro optimises both; no
`import` is needed.

---

## Common tasks

- **Add a project:** create `src/content/projects/<slug>/index.mdx`.
- **Write the project story:** add Markdown/MDX below the frontmatter.
- **Add a cover:** put the image next to `index.mdx` and set `cover` and `coverAlt`.
- **Reorder:** change `order` — it sorts the home showcase, `/projects` and the
  previous/next links.
- **Hide from the home showcase:** set `featured: false` (or remove it). It stays on `/projects`.
