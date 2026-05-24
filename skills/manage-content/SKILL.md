---
name: manage-content
description: >
  Reference skill for managing site content and keeping collection format docs
  up to date. Use this skill when the user asks to:
  - Add or edit a post, note, resume entry, nav item, or OG image
  - Update a content collection schema (collection-definitions files)
  - Know the correct frontmatter or JSON format for any content type
  When a collection definition file changes, update the corresponding reference
  doc in this skill's references/ folder so it always reflects the live schema.
---

# Manage Content

This skill has two jobs:

1. **Content authoring guide** — tells you the correct format (frontmatter / JSON)
   for every active content collection so you never guess field names or types.

2. **Schema sync rule** — whenever a collection definition file changes, the
   matching reference doc here must be updated in the same task.

---

## Reference docs

| What changed / what you need | Reference file |
|------------------------------|----------------|
| Posts or notes (MDX/MD) | [`references/how-to-manage-posts.md`](./references/how-to-manage-posts.md) |
| Any resume section | [`references/how-to-manage-resume.md`](./references/how-to-manage-resume.md) |
| Navigation items | [`references/how-to-manage-nav.md`](./references/how-to-manage-nav.md) |
| OG images | [`references/how-to-manage-og-images.md`](./references/how-to-manage-og-images.md) |
| Site config / portfolio info | [`references/how-to-manage-site-config.md`](./references/how-to-manage-site-config.md) |

---

## Schema sync rule

When any content collection definition or site config file changes, update the matching reference doc in this skill so it reflects the live codebase. Use the reference docs below as a guide — find the one that covers the changed content type and rewrite the affected schema block.

| Source path | Reference doc |
|-------------|--------------|
| `src/content/collection-definitions/post.ts` | `references/how-to-manage-posts.md` |
| `src/content/collection-definitions/note.ts` | `references/how-to-manage-posts.md` |
| `src/content/collection-definitions/common-fields/_article.ts` | `references/how-to-manage-posts.md` |
| `src/content/collection-definitions/common-fields/_og-styles.ts` | `references/how-to-manage-posts.md` and `references/how-to-manage-og-images.md` |
| `src/content/collection-definitions/common-fields/_evergreen-stages.ts` | `references/how-to-manage-posts.md` |
| `src/content/collection-definitions/resume.ts` | `references/how-to-manage-resume.md` |
| `src/content/collection-definitions/nav.ts` | `references/how-to-manage-nav.md` |
| `src/content/collection-definitions/og-images.ts` | `references/how-to-manage-og-images.md` |
| `src/content/portfolio.ts` | `references/how-to-manage-site-config.md` |
| `src/content/site.config.ts` | `references/how-to-manage-site-config.md` |

If a new collection is added, create a new reference doc and add it to the table above.
