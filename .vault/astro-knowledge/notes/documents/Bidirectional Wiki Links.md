---
title: Bidirectional Wiki Links
tags:
aliases:
  - Wiki Links
  - Backlinks
  - Wikilinks
---

# Bidirectional Wiki Links

Posts can link to each other using `[[wiki-link]]` syntax. The system tracks both outgoing and incoming links, rendering backlinks at the bottom of each post.

---

## Syntax

```md
[[note-title]]                        ← links to a note by title or slug
[[note-title:custom display text]]    ← with custom label
```

Links resolve to `/posts/{permalink}` via the `remark-wiki-link` plugin configured in `astro.config.mjs`.

---

## Implementation

**File:** `src/utils/bidirectional-link.ts`

| Function | Purpose |
|---|---|
| `getOutgoingNotes(node)` | Extract all `[[links]]` from a post's AST body |
| `getIncomingNotes(node)` | Find all posts that link TO this note (matches by slug, title, or aliases) |

Matching uses three identifiers — so if a post's title changes, add the old title to `aliases` in frontmatter to preserve incoming links.

---

## UI

**Component:** `BackReferenceSection`

Rendered at the bottom of each post page in `src/pages/posts/[...slug].astro`. Shows a list of posts that link to the current post.

---

## Troubleshooting

> [!warning] Backlink not showing up
> The link must match the target post's `slug`, `title`, or one of its `aliases`. Add the linking name to the `aliases` array in the target post's frontmatter.

---

## Related

- [[Markdown Pipeline]] — `remark-wiki-link` is one of the remark plugins in the pipeline
