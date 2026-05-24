# How to Manage Navigation Items

**Source file:** `src/content/nav-items.json`  
**Schema definition:** `src/content/collection-definitions/nav.ts`

Navigation items are rendered in the site header. The `order` field controls display sequence.

---

## Schema

```json
[
  {
    "id": "string",
    "label": "string",
    "link": "string",
    "order": number
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (used as Astro collection entry id) |
| `label` | string | Text shown in the navigation bar |
| `link` | string | URL path (e.g. `/garden`, `/resume`) |
| `order` | number | Sort order — lower numbers appear first |

---

## Current nav items

| id | label | link | order |
|----|-------|------|-------|
| `home` | Home | `/` | 1 |
| `garden` | Garden | `/garden` | 2 |
| `uses` | Uses | `/uses` | 3 |
| `resume` | Resume | `/resume` | 4 |

---

## Adding a nav item

1. Add a new entry to `src/content/nav-items.json`
2. Assign the next available `order` number (or insert between existing entries by renumbering)
3. Make sure the `link` matches an actual page in `src/pages/`
