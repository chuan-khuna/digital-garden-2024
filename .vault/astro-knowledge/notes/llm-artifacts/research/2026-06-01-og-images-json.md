# How `og-images.json` Works

## What it is

`src/content/og-images.json` is an Astro **content collection** (loaded via the `file()` loader). It holds OG image configuration for **static, non-post pages** — pages that are not generated from Markdown/MDX content collections and therefore cannot declare `ogStyle` in their own frontmatter.

## How it flows

```
og-images.json
  → collection-definitions/og-images.ts   (defines schema + file loader)
  → src/content.config.ts                 (registers as 'ogImages' collection)
  → src/pages/og/pages/[...slug].png.ts   (reads collection, generates one PNG per entry)
```

Each entry in the JSON becomes a route at `/og/pages/<slug>.png`. The OG image renderer (`generateOgImage`) uses the `title`, `description`, and `ogStyle` from the entry.

## Schema

```ts
{
  title: string        // supports {{siteTitle}} token — resolved at render time
  description: string
  slug: string         // becomes the URL segment: /og/pages/<slug>.png
  ogStyle?: 'default' | 'default-dark' | 'particle'  // optional, defaults to 'default'
}
```

## When is it needed?

Add an entry to `og-images.json` when:

1. **A new static page exists** (e.g. `/uses`, `/resume`, `/garden`) and you want a custom OG image for it.
2. The page is **not** generated from a posts/notes content collection — those pages generate their own OG images automatically via `src/pages/og/posts/[...slug].png.ts`.
3. You want a **different visual style** per page (e.g. the homepage uses `default-dark`, the Uses page uses `particle`).

## When is it NOT needed?

- Blog posts and garden notes — they have `ogStyle` in their own MDX frontmatter and use a separate OG route.
- Pages where the default social card (from the base layout's `<meta og:image>`) is acceptable.

## Current entries

| slug    | ogStyle        | Notes                          |
|---------|---------------|--------------------------------|
| `index` | `default-dark` | Homepage — uses `{{siteTitle}}` token |
| `resume`| (default)      | Resume page                    |
| `uses`  | `particle`     | Uses page                      |

## `{{siteTitle}}` token

The string `{{siteTitle}}` in a `title` field is replaced at render time with `site.siteTitle` from `src/data/site.config.ts`. This avoids duplicating the site title string in the JSON.
