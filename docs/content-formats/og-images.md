# How to Manage OG Images

**Source file:** `src/content/og-images.json`  
**Schema definition:** `src/content/collection-definitions/og-images.ts`

OG image configs define — and customise — the Open Graph preview card of each page that is not a content entry (e.g. homepage, resume, uses). Each entry generates `/og/pages/<slug>.png`. Posts and notes do not need an entry; their OG image comes from their own frontmatter. How the images are generated: [`docs/architecture/og-image-generator.md`](../architecture/og-image-generator.md).

---

## Schema

```json
[
  {
    "title": "string",
    "description": "string",
    "slug": "string",
    "ogStyle": "default | default-dark | particle"
  }
]
```

| Field         | Type   | Required | Description                                                      |
| ------------- | ------ | -------- | ---------------------------------------------------------------- |
| `title`       | string | ✅       | Page title shown in OG card                                      |
| `description` | string | ✅       | Short description shown in OG card                               |
| `slug`        | string | ✅       | Name the page asks for with `pageOgImage(slug)` (e.g. `index`, `resume`, `uses`) |
| `ogStyle`     | enum   | optional | Visual style of the OG image. Default: `'default'`               |

### `ogStyle` options

| Value          | Description                         |
| -------------- | ----------------------------------- |
| `default`      | Light theme OG image                |
| `default-dark` | Dark theme OG image                 |
| `particle`     | Animated particle effect background |

---

## Special values

- `{{siteTitle}}` — Template token in `title`; replaced at build time (every occurrence) with `site.siteTitle` from `src/data/site.config.ts`.

---

## Current OG image configs

| slug     | title           | ogStyle        |
| -------- | --------------- | -------------- |
| `index`  | `{{siteTitle}}` | `default-dark` |
| `resume` | Resume          | `default`      |
| `uses`   | Uses            | `particle`     |

---

## Adding a new OG image config

1. Add an entry to `src/content/og-images.json`. By convention the `slug` matches the page's route without the leading `/` (`index` for the homepage).
2. In the page, ask for it by slug and pass it to the layout:

   ```astro
   ---
   import { pageOgImage } from '@/lib/og-image'
   const ogImageUrl = await pageOgImage('my-page')
   ---
   <BaseLayout title="…" ogImage={ogImageUrl}>
   ```

If the page asks for a `slug` that has no entry, the build fails with `[og] No OG image for page "…"`. Pages that don't pass `ogImage` have no OG image.
