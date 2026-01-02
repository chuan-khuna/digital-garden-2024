# How OG Image Generator Works

This guide explains the Open Graph (OG) image generation system in this digital garden, covering both the simple single-collection version and the dynamic multi-collection version.

## Overview

The OG image generator creates custom social media preview images (1200x630px PNG files) for posts and pages. When you share a link on Twitter, Discord, Slack, or other platforms, these generated images appear as rich previews.

**Technology Stack:**

- **Satori** - Converts React components to SVG
- **Sharp** - Optimizes and converts SVG to PNG
- **Astro API Routes** - Serves images as static endpoints

## Architecture Comparison

There are two implementations in this project:

### Simple Version: Single Collection

**Location:** `src/pages/og/posts_/[...slug].png.ts`

- Generates OG images for ONE collection (`posts`)
- Hardcoded collection name
- Simpler to understand and maintain
- Good for projects with a single content type

### Dynamic Version: Multiple Collections

**Location:** `src/pages/og/[articleType]/[...slug].png.ts`

- Generates OG images for MULTIPLE collections (`posts`, `notes`)
- Validates collection type from URL
- More flexible and scalable
- Recommended for projects with multiple content types

---

## Simple Version: Posts Only

### File Structure

```
src/pages/og/posts_/
└── [...slug].png.ts      # Generates /og/posts_/my-post.png
```

### How It Works

**1. Load Collection at Module Level**

```typescript
const posts = await getCollection('posts')
```

This loads all posts once when the module initializes, avoiding repeated database queries.

**2. Generate Static Paths**

```typescript
export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }))
}
```

At build time, this creates a route for every post:

- `/og/posts_/my-first-post.png`
- `/og/posts_/another-post.png`
- etc.

**3. Handle GET Requests**

```typescript
export async function GET(ctx: APIContext) {
  const ogSlug = ctx.params.slug
  const post = posts.find((post) => post.id === ogSlug)

  if (!post) {
    return new Response('Not Found', { status: 404 })
  }

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

When `/og/posts_/my-post.png` is requested:

1. Extract `slug` from URL params
2. Find matching post by ID
3. Generate PNG using post's title, description, and style preference
4. Return PNG buffer with proper content type

### Usage in Templates

```astro
---
const post = Astro.props
const ogImageUrl = `/og/posts_/${post.id}.png`
---

<OpenGraph
  title={post.data.title}
  description={post.data.description}
  image={ogImageUrl}
/>
```

### Pros & Cons

**Pros:**

- Simple and straightforward
- Easy to understand
- No validation logic needed
- Minimal boilerplate

**Cons:**

- Only works for one collection
- Requires duplicate code for additional collections
- Less flexible for growth

---

## Dynamic Version: Multiple Collections

### File Structure

```
src/pages/og/[articleType]/
└── [...slug].png.ts      # Generates /og/posts/my-post.png
                          #           /og/notes/my-note.png
```

### How It Works

**1. Define Valid Article Types**

```typescript
const VALID_ARTICLE_TYPES = ['posts', 'notes'] as const
type ArticleType = (typeof VALID_ARTICLE_TYPES)[number]
```

This creates a type-safe list of supported collections.

**2. Generate Paths for All Collections**

```typescript
export async function getStaticPaths() {
  const paths = []

  for (const articleType of VALID_ARTICLE_TYPES) {
    const articles = await getCollection(articleType)

    for (const article of articles) {
      paths.push({
        params: {
          articleType,
          slug: article.id,
        },
        props: {
          article,
          articleType,
        },
      })
    }
  }

  return paths
}
```

This nested loop creates paths like:

- `/og/posts/my-post.png`
- `/og/posts/another-post.png`
- `/og/notes/quick-note.png`
- `/og/notes/another-note.png`

**3. Validate and Handle Requests**

```typescript
export async function GET(ctx: APIContext) {
  const { articleType, slug } = ctx.params

  // Validate article type
  if (
    !articleType ||
    !VALID_ARTICLE_TYPES.includes(articleType as ArticleType)
  ) {
    return new Response('Invalid article type', { status: 400 })
  }

  // Get article from props (passed from getStaticPaths)
  const article = ctx.props.article as
    | CollectionEntry<'posts'>
    | CollectionEntry<'notes'>

  if (!article) {
    return new Response('Not Found', { status: 404 })
  }

  const ogImage = await generateOgImage(
    article.data.title,
    article.data.description || '',
    article.data.ogStyle || 'default',
  )

  return new Response(ogImage, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}
```

Key differences:

- Extracts both `articleType` and `slug` from URL
- Validates `articleType` is in allowed list
- Uses generic `article` prop that works for any collection
- Type assertion for TypeScript safety

### Usage in Templates

```astro
---
const post = Astro.props
const collection = 'posts' // or 'notes'
const ogImageUrl = `/og/${collection}/${post.id}.png`
---

<OpenGraph
  title={post.data.title}
  description={post.data.description}
  image={ogImageUrl}
/>
```

### Adding New Collections

To add a new collection (e.g., `projects`):

**Step 1:** Update `VALID_ARTICLE_TYPES`

```typescript
const VALID_ARTICLE_TYPES = ['posts', 'notes', 'projects'] as const
```

**Step 2:** Ensure your collection schema has required fields

```typescript
// src/content.config.ts
export const collections = {
  projects: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      ogStyle: z.enum(['default', 'default-dark', 'particle']).optional(),
      // ... other fields
    }),
  }),
}
```

That's it! The system automatically generates OG images for all `projects` entries.

### Pros & Cons

**Pros:**

- Works with multiple collections
- Easy to add new collections (one line change)
- Type-safe validation
- Centralized logic
- Scales well

**Cons:**

- Slightly more complex
- Extra validation overhead
- More TypeScript types to manage

---

## Core Generation Pipeline

Both versions use the same underlying image generation pipeline:

### 1. Generate OG Image Function

**Location:** `src/lib/generate-og-image.ts`

```typescript
export async function generateOgImage(
  title: string,
  description: string,
  style: string = 'default',
): Promise<Buffer>
```

**Process:**

1. Load custom fonts (VictorMono)
2. Render React component to SVG with Satori
3. Convert SVG to optimized PNG with Sharp
4. Return PNG as Buffer

### 2. OG Templates

**Location:** `src/components/og/og-template.tsx`

React components that define the visual design:

```typescript
const themeComponents = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}

export function OgTemplate({ title, description, style }) {
  const Theme = themeComponents[style] || themeComponents.default
  return <Theme title={title} description={description} />
}
```

### 3. Theme Components

**Location:** `src/components/og/_components/`

Individual theme implementations:

- `og-default-theme.tsx` - Light theme with border
- `og-default-dark-theme.tsx` - Dark variant
- `og-particle-theme.tsx` - Animated particles background

**Design constraints:**

- Must use inline styles (Satori limitation)
- Dimensions: 1200x630px
- Limited CSS support (Flexbox subset)
- No external images

---

## Frontmatter Integration

Posts control their OG image style via frontmatter:

```yaml
---
title: My Awesome Post
description: A short description for social media
ogStyle: 'particle' # or 'default', 'default-dark'
---
```

The route handler reads `ogStyle` and passes it to `generateOgImage()`.

---

## Build Process

### Static Prerendering

Both versions use:

```typescript
export const prerender = true
```

This tells Astro to generate all OG images at build time, not on-demand.

### Build Flow

1. **Build starts** → Astro calls `getStaticPaths()` for all OG routes
2. **Path generation** → Creates list of all image URLs to prerender
3. **Image generation** → Calls `GET()` handler for each URL
4. **File output** → Saves PNG to `dist/og/posts/...` or `dist/og/[articleType]/...`
5. **Build complete** → All OG images are static files

### Performance Optimizations

- **Font caching** - Fonts loaded once at module level
- **Sharp optimization** - PNG compression level 9, adaptive filtering
- **Palette conversion** - Reduces file size for flat designs
- **Static output** - No runtime image generation

---

## Which Version Should You Use?

### Use Simple Version If:

- You only have one content collection
- Simplicity is more important than flexibility
- You don't plan to add more content types
- You want minimal abstraction

### Use Dynamic Version If:

- You have multiple content collections
- You expect to add more collections in the future
- You want centralized OG image logic
- Type safety and validation are important

### Migration Path

If you start with the simple version and later need multiple collections:

1. Copy the dynamic version structure
2. Update `VALID_ARTICLE_TYPES` with your collections
3. Update template references from `/og/posts_/` to `/og/posts/`
4. Test all OG image URLs still work
5. Delete old `posts_` route

---

## Testing OG Images

### Local Development

```bash
bun run dev

# Visit URLs in browser:
# http://localhost:4321/og/posts_/my-post.png (simple version)
# http://localhost:4321/og/posts/my-post.png (dynamic version)
# http://localhost:4321/og/notes/my-note.png (dynamic version)
```

### Production Build

```bash
bun run build

# Check generated files:
# dist/og/posts_/my-post.png (simple version)
# dist/og/posts/my-post.png (dynamic version)
# dist/og/notes/my-note.png (dynamic version)
```

### Social Media Validators

Test how your OG images appear on different platforms:

- **Twitter:** https://cards-dev.twitter.com/validator
- **Facebook:** https://developers.facebook.com/tools/debug/
- **LinkedIn:** https://www.linkedin.com/post-inspector/

---

## Common Issues

### Image Not Found (404)

**Simple version:**

- Check post ID matches slug exactly
- Verify post is in `posts` collection
- Ensure `getStaticPaths()` includes the post

**Dynamic version:**

- Check `articleType` is in `VALID_ARTICLE_TYPES`
- Verify article exists in that collection
- Check URL format: `/og/{collection}/{slug}.png`

### Wrong Style Applied

- Check frontmatter `ogStyle` field
- Verify style name matches theme component key
- Check default fallback: `post.data.ogStyle || 'default'`

### Text Overflow

- Use truncation utilities in `og/_components/utils.tsx`
- Test with long titles/descriptions
- Adjust font sizes in theme components

### Build Errors

- **Font loading fails:** Check `src/assets/fonts/VictorMono-Regular.woff` exists
- **Satori errors:** Ensure inline styles only (no CSS classes)
- **Sharp errors:** Check image dimensions are valid

---

## Advanced Customization

### Adding a New Theme

See the main documentation in `src/content/posts/opengraph/index.mdx` for detailed theme creation instructions.

### Custom Collection-Specific Styles

You can create collection-specific logic in the dynamic version:

```typescript
export async function GET(ctx: APIContext) {
  const { articleType } = ctx.params
  const article = ctx.props.article

  // Custom style logic per collection
  let style = article.data.ogStyle || 'default'

  if (articleType === 'notes') {
    style = 'particle' // All notes use particle theme
  }

  const ogImage = await generateOgImage(
    article.data.title,
    article.data.description || '',
    style,
  )

  // ...
}
```

### Different Sizes per Platform

Currently generates 1200x630 (standard). To add Twitter-specific size (1200x600):

```typescript
// Add size parameter to generateOgImage
const ogImage = await generateOgImage(title, description, style, {
  width: 1200,
  height: 600,
})

// Create separate routes:
// /og/twitter/posts/[...slug].png
// /og/facebook/posts/[...slug].png
```

---

## Summary

| Feature           | Simple Version               | Dynamic Version                     |
| ----------------- | ---------------------------- | ----------------------------------- |
| **File**          | `og/posts_/[...slug].png.ts` | `og/[articleType]/[...slug].png.ts` |
| **Collections**   | Single (`posts`)             | Multiple (`posts`, `notes`, ...)    |
| **URL Pattern**   | `/og/posts_/{slug}.png`      | `/og/{collection}/{slug}.png`       |
| **Validation**    | None needed                  | Type checking required              |
| **Extensibility** | Requires duplication         | Add to array                        |
| **Complexity**    | Low                          | Medium                              |
| **Best For**      | Single content type          | Multiple content types              |

Both versions produce identical image quality and use the same generation pipeline. Choose based on your project's needs for flexibility vs. simplicity.

## Further Reading

- Full OG system documentation: `src/content/posts/opengraph/index.mdx`
- Theme creation guide: `_docs/how-to-add-theme.md`
- Satori documentation: https://github.com/vercel/satori
- Sharp documentation: https://sharp.pixelplumbing.com/
