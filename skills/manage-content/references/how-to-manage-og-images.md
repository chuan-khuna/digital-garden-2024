# How to Manage OG Images

**Source file:** `src/content/og-images.json`  
**Schema definition:** `src/content/collection-definitions/og-images.ts`

OG image configs define the Open Graph preview cards for specific pages (e.g. homepage, resume, uses). Pages not listed here use a default OG image.

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Page title shown in OG card |
| `description` | string | ✅ | Short description shown in OG card |
| `slug` | string | ✅ | URL slug used to match the page (e.g. `index`, `resume`, `uses`) |
| `ogStyle` | enum | optional | Visual style of the OG image. Default: `'default'` |

### `ogStyle` options

| Value | Description |
|-------|-------------|
| `default` | Light theme OG image |
| `default-dark` | Dark theme OG image |
| `particle` | Animated particle effect background |

---

## Special values

- `{{siteTitle}}` — Template token in `title`; replaced at build time with the value from `SITE.siteTitle` in `src/content/site.config.ts`.

---

## Current OG image configs

| slug | title | ogStyle |
|------|-------|---------|
| `index` | `{{siteTitle}}` | `default-dark` |
| `resume` | Resume | `default` |
| `uses` | Uses | `particle` |

---

## Adding a new OG image config

Add an entry to `src/content/og-images.json`. The `slug` should match the page's route (without leading `/`).
