---
title: OG Image Generator
tags:
aliases:
  - Open Graph Images
---

# OG Image Generator

The OG image system generates custom social media preview images (1200×630px PNG) for posts and pages. When you share a link on Twitter, Discord, or Slack, these appear as rich previews.

**Technology stack:**
- **Satori** — converts React components to SVG
- **Sharp** — converts SVG to optimised PNG
- **Astro API Routes** — serves images as static endpoints

---

## Three Implementations

There are three OG route implementations in the project. All produce identical image quality and use the same [[#Core Generation Pipeline|generation pipeline]].

### Simple Version — Single Collection

**File:** `src/pages/og/posts_/[...slug].png.ts`

- Generates OG images for **one collection** (`posts`) only
- Hardcoded collection name, minimal boilerplate
- Good starting point; easy to understand

### Dynamic Version — Multiple Collections

**File:** `src/pages/og/[articleType]/[...slug].png.ts`

- Generates OG images for **multiple collections** (`posts`, `notes`, …)
- Validates collection type from URL
- Recommended when you have or expect multiple content types

### Pages Version — Static Pages

**File:** `src/pages/og/pages/[...slug].png.ts`

- Generates OG images for **non-content pages** (homepage, resume, uses, etc.)
- Driven by `src/content/og-images.json` — the `ogImages` collection
- Each entry has `title`, `description`, `slug`, and optional `ogStyle`
- Add new entries to the JSON to generate OG images for new static pages

```json
{ "title": "My Page", "description": "...", "slug": "my-page", "ogStyle": "default-dark" }
```

> [!tip] Which should I use?
> - **pages route** — for top-level pages (index, resume, uses)
> - **simple route** — for a single content collection with minimal setup
> - **dynamic route** — for multiple content collections

---

## How the Simple Version Works

**1. Load collection once at module level**

```typescript
const posts = await getCollection('posts')
```

**2. Generate static paths at build time**

```typescript
export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }))
}
```

**3. Handle GET request**

```typescript
export async function GET(ctx: APIContext) {
  const post = posts.find((p) => p.id === ctx.params.slug)
  if (!post) return new Response('Not Found', { status: 404 })

  const ogImage = await generateOgImage(
    post.data.title,
    post.data.description || '',
    post.data.ogStyle || 'default',
  )

  return new Response(ogImage, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}
```

---

## How the Dynamic Version Works

**1. Define valid article types**

```typescript
const VALID_ARTICLE_TYPES = ['posts', 'notes'] as const
type ArticleType = (typeof VALID_ARTICLE_TYPES)[number]
```

**2. Generate paths for all collections**

```typescript
export async function getStaticPaths() {
  const paths = []
  for (const articleType of VALID_ARTICLE_TYPES) {
    const articles = await getCollection(articleType)
    for (const article of articles) {
      paths.push({ params: { articleType, slug: article.id }, props: { article, articleType } })
    }
  }
  return paths
}
```

**3. Validate and handle request**

```typescript
export async function GET(ctx: APIContext) {
  const { articleType, slug } = ctx.params
  if (!VALID_ARTICLE_TYPES.includes(articleType as ArticleType)) {
    return new Response('Invalid article type', { status: 400 })
  }
  // ...generate image
}
```

### Adding a New Collection

To add a `projects` collection, only one line change is needed:

```typescript
const VALID_ARTICLE_TYPES = ['posts', 'notes', 'projects'] as const
```

The system then automatically generates OG images for all `projects` entries.

---

## Core Generation Pipeline

Both versions call the same function:

**File:** `src/lib/generate-og-image.ts`

```typescript
export async function generateOgImage(
  title: string,
  description: string,
  style: string = 'default',
): Promise<Buffer>
```

**Steps:**
1. Load three VictorMono font weights (Regular 400, Light 300, Bold 700) as `.ttf` — cached at module level via top-level `await`
2. Render React component → SVG via Satori
3. Convert SVG → PNG via Sharp (compression level 9, adaptive filtering, palette mode)
4. Return PNG as `Buffer`

### OG Templates

**File:** `src/components/og/og-template.tsx` — export: `OgImageTemplate`

```typescript
const themeComponents = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}
```

Theme components live in `src/components/og/_components/`. They must use **inline styles only** (Satori limitation — no CSS classes).

---

## Frontmatter Integration

Posts control their OG style via frontmatter:

```yaml
---
title: My Post
description: Short description for social media
ogStyle: 'particle'   # 'default' | 'default-dark' | 'particle'
---
```

---

## Build Process

All three versions use `export const prerender = true`. Astro generates all images at build time:

1. `getStaticPaths()` creates the list of all image URLs
2. `GET()` is called for each URL
3. PNGs are saved to `dist/og/...`

---

## Comparison

| Feature | Simple | Dynamic | Pages |
|---|---|---|---|
| File | `og/posts_/[...slug].png.ts` | `og/[articleType]/[...slug].png.ts` | `og/pages/[...slug].png.ts` |
| Data source | `posts` collection | `posts` + `notes` collections | `og-images.json` |
| URL pattern | `/og/posts_/{slug}.png` | `/og/{collection}/{slug}.png` | `/og/pages/{slug}.png` |
| Use case | Single content collection | Multiple content collections | Static pages |
| Validation | None | Type-checked `articleType` | None |
| Extensibility | Duplicate code | Add one entry to array | Add row to JSON |
| Complexity | Low | Medium | Low |

---

## Testing Locally

```bash
bun run dev

# Pages route:    http://localhost:4321/og/pages/index.png
# Simple route:   http://localhost:4321/og/posts_/my-post.png
# Dynamic route:  http://localhost:4321/og/posts/my-post.png
```

**Social media validators:**
- Twitter: https://cards-dev.twitter.com/validator
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/

---

## Common Issues

> [!warning] Image not found (404)
> - **Simple:** check that the post ID matches the slug exactly
> - **Dynamic:** check that `articleType` is in `VALID_ARTICLE_TYPES` and the URL is `/og/{collection}/{slug}.png`

> [!warning] Wrong style applied
> Check the `ogStyle` frontmatter field — the value must match a key in `themeComponents`.

> [!bug] Build errors
> - *Font loading fails* → verify all three `.ttf` files exist: `src/assets/fonts/VictorMono-Regular.ttf`, `VictorMono-Light.ttf`, `VictorMono-Bold.ttf`
> - *Satori errors* → ensure only inline styles are used in theme components
> - *Sharp errors* → check image dimensions are valid (must be 1200×630)

---

## Related

- [[Adding a Theme]] — how to create new OG visual themes
- Full OG post: `src/content/posts/opengraph/index.mdx`
