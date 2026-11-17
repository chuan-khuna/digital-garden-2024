# OG Image Generator

The OG image system generates social media preview images (1200×630 PNG) for posts and pages at build time. When you share a link on LINE, X, Discord or Slack, these appear as the preview card.

**Technology stack:**

- **Satori** — converts React components to SVG
- **Sharp** — converts SVG to optimised PNG
- **Astro API routes** — prerendered endpoints that emit the PNGs

---

## The OG image module

Everything about OG images goes through one module, `src/lib/og-image/`. Pages and routes never build `og/...` paths or call Satori themselves.

```
          pages (.astro)                     OG routes (.png.ts)
               │                                     │
  pageOgImage(slug) / articleOgImage(c, id)   ogImageResponse(data)
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌
  src/lib/og-image/
    index.ts    adapter: reads the ogImages collection + site URL
    resolve.ts  pure rules: URL shape, page slug check, {{siteTitle}}   (tested)
    render.ts   fonts → OgImageTemplate → satori → sharp
    color.ts    oklch() → rgba() for Satori                      (tested)
```

| File                                                             | Role                                                                                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/lib/og-image/index.ts`                                      | Astro adapter. Interface: `pageOgImage`, `articleOgImage`, `ogImageResponse`, `OG_ARTICLE_COLLECTIONS`            |
| `src/lib/og-image/resolve.ts`                                    | Pure rules, no `astro:content`. Tested in `resolve.test.ts`                                                       |
| `src/lib/og-image/render.ts`                                     | `renderOgImage({ title, description, style, label, siteHost, siteTitle })` → PNG `Buffer`                         |
| `src/lib/og-image/color.ts`                                      | `oklch(l, c, h, alpha?)` → `rgba(…)`. Satori reads neither CSS variables nor `oklch()`. Tested in `color.test.ts` |
| `src/components/og/og-template.tsx`                              | Picks the theme for an `OgStyle`                                                                                  |
| `src/components/og/_components/og-card.tsx`                      | The shared card layout every theme renders                                                                        |
| `src/components/og/_components/og-palettes.ts`                   | Light and dark palettes, in oklch, copied from `src/styles/presets/`                                              |
| `src/components/og/_components/`                                 | Theme wrappers, the logo, the particle network and text helpers                                                   |
| `src/content/collection-definitions/common-fields/_og-styles.ts` | `ogStyles` enum and `OgStyle` type                                                                                |

### Interface

```typescript
// For pages — returns an absolute URL for `og:image`
pageOgImage(slug: string): Promise<URL>                        // og/pages/<slug>.png
articleOgImage(collection: 'posts' | 'notes' | 'projects', id: string): URL  // og/<collection>/<id>.png

// For OG routes
ogImageResponse(kind: 'pages' | collection, { title, description?, ogStyle }): Promise<Response>  // image/png
```

- `pageOgImage` **fails the build** if `slug` has no entry in `src/content/og-images.json`, so a page can never point `og:image` at an image that isn't generated.
- `ogImageResponse` fills `{{siteTitle}}` in the title, defaults a missing description to `''`, sets the kicker from `kind` (`ogLabel`: Page, Post, Note, Project) and the footer host from the site URL (`ogSiteHost`), renders, and wraps the PNG in a `Response`.
- The site origin comes from `import.meta.env.SITE` (`site` in `astro.config.mjs`).

---

## Two routes

### Articles — `src/pages/og/[articleType]/[...slug].png.ts`

- One image per entry in every collection in `OG_ARTICLE_COLLECTIONS` (`posts`, `notes`, `projects`)
- URL: `/og/<collection>/<id>.png`
- Title, description and style come from the article's frontmatter

```typescript
export async function GET({ props }: APIContext) {
  return ogImageResponse(props.article.collection, props.article.data)
}
```

### Pages — `src/pages/og/pages/[...slug].png.ts`

- One image per entry in `src/content/og-images.json` (the `ogImages` collection)
- URL: `/og/pages/<slug>.png`
- For pages that are not content entries (home, resume, uses, …). Each page's title, description and style are **customised in the JSON**, see [`docs/content-formats/og-images.md`](../content-formats/og-images.md)

Both routes use `export const prerender = true`, so images are generated at build time into `dist/.../og/...`.

---

## Using an OG image on a page

```astro
---
// A page configured in og-images.json
import { pageOgImage } from '@/lib/og-image'
const ogImageUrl = await pageOgImage('resume')
---

<BaseLayout title="…" ogImage={ogImageUrl} />
```

```astro
---
// An article page
import { articleOgImage } from '@/lib/og-image'
const ogImageUrl = articleOgImage('posts', Astro.params.slug!)
---
```

### Adding OG image to a new page

1. Add an entry to `src/content/og-images.json` with the page's `slug`, `title`, `description` and optional `ogStyle`
2. In the page: `const ogImageUrl = await pageOgImage('<slug>')` and pass it to the layout's `ogImage` prop

If you skip step 1 the build fails with `[og] No OG image for page "<slug>"…`.

### Adding a new article collection

Add it to `OG_ARTICLE_COLLECTIONS` in `src/lib/og-image/resolve.ts`. The collection's schema must include `title`, `description` and `ogStyle` (use `articleSchema` from `common-fields/_article.ts`).

---

## Rendering pipeline

`renderOgImage(title, description, style)` in `src/lib/og-image/render.ts`:

1. Load the fonts from `src/assets/fonts/` once, at module load via top-level `await`: DM Serif Text 400 (title), Lato 400/700 (description) and VictorMono 400/700 (kicker and footer). Paths are relative to the project root, so `astro build` must run from there. The OFL licence for each font sits next to it.
2. Render `OgImageTemplate` → SVG via Satori
3. Convert SVG → PNG via Sharp (compression level 9, adaptive filtering, palette mode)
4. Return the PNG `Buffer`

### Styles and themes

`src/components/og/og-template.tsx` maps each style to a theme:

```typescript
const themeComponents: Record<OgStyle, typeof OgDefaultTheme> = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}
```

### The card

Every style renders the same card (`og-card.tsx`), designed to stay readable at thumbnail size (Discord, LINE and Slack show it about 400px wide, under text that already repeats the title and description):

- **Header:** an accent bar and the kicker (`POST`, `NOTE`, `PROJECT`, `PAGE`) on the left; the site title on the right, hidden when it equals the card title (the home page).
- **Body:** the title in DM Serif Text, from 92px for short titles down to 54px for long ones, truncated at 110 characters on a word boundary. The description is in Lato at 30px, truncated at 140 characters (about two lines).
- **Footer:** an accent rule and the site host on the left, the logo on the right.

| Style          | Palette                                                     | Background                                                  |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `default`      | light (`nzk` preset): cream, navy title, orange accent      | plain                                                       |
| `default-dark` | dark (`dark` preset): near-black, white title, green accent | plain                                                       |
| `particle`     | light                                                       | seeded particle network, faded towards the text on the left |

To change colours, edit `og-palettes.ts` (keep the values in step with `src/styles/presets/`).

`OgStyle` is inferred from the `ogStyles` Zod enum, so adding a style to the enum without a theme here **fails typecheck**, and a mistyped `ogStyle` in content fails schema validation. There is no silent fallback. Theme components must use **inline styles only** (Satori limitation — no CSS classes). To add one: add the value to `ogStyles`, then a theme component in `src/components/og/_components/` (usually an `OgCard` with a palette and an optional `background`) and its entry in `themeComponents`.

### Frontmatter

```yaml
---
title: My Post
description: Short description for social media
ogStyle: 'particle' # 'default' | 'default-dark' | 'particle'; default: 'default'
---
```

---

## Testing

- `bun run test` — `src/lib/og-image/resolve.test.ts` covers URL shape, the page slug check, `{{siteTitle}}`, the kicker and the footer host; `color.test.ts` covers the oklch conversion. Rendering is not unit-tested (slow, needs image snapshots).
- `bun run build` — renders every image; a missing page entry or bad `ogStyle` fails here.
- Locally:

```bash
bun run dev
# Pages:    http://localhost:4321/og/pages/index.png
# Articles: http://localhost:4321/og/posts/my-post.png
```

**Social media validators:**

- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/

---

## Common issues

> **Build error `[og] No OG image for page "…"`**
> The page calls `pageOgImage(slug)` but `og-images.json` has no entry with that `slug`. Add one (or fix the typo).

> **Image 404 for an article**
> Check the collection is in `OG_ARTICLE_COLLECTIONS` and the URL is `/og/<collection>/<id>.png`.

> **Build errors in rendering**
>
> - _Font loading fails_ → verify the `.ttf` files listed in `render.ts` exist in `src/assets/fonts/` and the build runs from the project root
> - _Satori errors_ → ensure only inline styles are used in theme components
> - _Sharp errors_ → check image dimensions are valid (must be 1200×630)

---

## Related

- [Adding a Theme](./add-theme.md) — site colour themes (a separate concept from OG styles)
- [`docs/content-formats/og-images.md`](../content-formats/og-images.md) — the page OG config format
- Blog post with a simple walkthrough: `src/content/posts/opengraph/index.mdx`
