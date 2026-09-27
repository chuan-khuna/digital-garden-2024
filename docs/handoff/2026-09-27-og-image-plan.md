# Handoff: OG Image Plan

- **Date:** 2026-09-27
- **For:** `developer` agent
- **Status:** **Done (2026-09-27).** Items 1–5 below are implemented, except the font path fix (see Decisions). Current design: [`docs/architecture/og-image-generator.md`](../architecture/og-image-generator.md).
- **Details:** [`docs/research/2026-09-27-og-image-module.md`](../research/2026-09-27-og-image-module.md) (Thai: full explanation of the problems and the proposed solution)
- **Source:** candidate 2 in [garden architecture review](../research/2026-09-27-garden-architecture-review.html)

---

## TL;DR

Knowledge about OG images is spread across about 10 files. Pages build image URLs by hand with slugs that nothing checks, the three routes repeat the same code, and style names are passed around as `string`. The plan is to gather all of this into one module, `src/lib/og-image/`, with a two-function interface: `ogImageUrl(kind, slug)` and `ogImageResponse(meta)`.

## Current state (checked 2026-09-27)

| File | Role | Problem |
|---|---|---|
| `src/pages/og/posts_/[...slug].png.ts` | "Simple Version" route, kept as an example | Astro only ignores names that *start* with `_`, so this route is still built. Every post image is rendered twice. |
| `src/pages/og/[articleType]/[...slug].png.ts` | OG images for posts and notes | Repeats the generate + `Response` code |
| `src/pages/og/pages/[...slug].png.ts` | OG images for pages in `og-images.json` | Repeats the generate + `Response` code |
| `src/pages/index.astro:15`, `resume.astro:31`, `uses.astro:9`, `posts/[...slug]/index.astro:9-12` | Build the OG URL by hand | A mistyped slug still builds; link previews then show no image |
| `src/lib/generate-og-image.ts` | satori → sharp | `style: string`; font paths depend on the working directory; unused `getFontData` |
| `src/components/og/og-template.tsx` | Picks the theme | Redefines the enum and falls back to `OgDefaultTheme` silently |

## Planned work (pending decision)

Each item is a separate commit and must pass `bun run test` + `bun run build`.

1. **`fix(og): remove duplicate posts_ route`**
   - Delete `src/pages/og/posts_/`
   - Update `docs/architecture/og-image-generator.md`: "Three Implementations" → two, and remove "How the Simple Version Works", the Simple column in the Comparison table, the Simple route in Testing Locally, and the Simple entry in Common Issues
   - The post `src/content/posts/opengraph/index.mdx:76-110` describes this route as the "Simple Version" with the URL `/og/posts_/…`. This is content, so hand it to `web-master`, or have the owner decide whether to keep it as an example code block.
2. **`refactor(og): type og styles end to end`**: export `OgStyle = z.infer<…>`, use `Record<OgStyle, Theme>`, remove the fallback
3. **`refactor(og): add og-image module`**: `ogImageUrl` checks slugs against `og-images.json` at build time, `ogImageResponse` is used by the routes, font paths are resolved from `import.meta.url`, and `getFontData` is deleted
4. **`test(og): cover url and title resolution`**: Vitest for the pure files only (do not test satori rendering)
5. Update `docs/architecture/og-image-generator.md` to match the new structure

## Open decisions (for the owner)

1. Delete the `posts_/` route? If so, what happens to the example in the `opengraph` post?
2. Check slugs at build time (keep the JSON), or move them to a TS `as const` (changes the content format and falls under the schema-sync rule)?
3. Remove the fallback theme and let the compiler enforce it?
4. Include the font path fix?
5. Do the whole module, or only item 1?

## Decisions (2026-09-27)

1. `posts_/` route deleted. The `opengraph` post was rewritten as a simple standalone example, followed by a short section on how this site does it.
2. Page slugs are checked at build time against `og-images.json`, which stays a content collection, so page OG images are still customised there. `pageOgImage(slug)` throws if there is no entry.
3. Fallback theme removed. `themeComponents` is `Record<OgStyle, …>`.
4. Font path **not** changed. `import.meta.url` points into the bundled chunk in `dist/` at build time, so a path relative to the source file would break. Fonts stay project-root-relative (documented). Only the unused `getFontData` was removed.
5. Whole module done: `src/lib/og-image/{index,resolve,render}.ts` + `resolve.test.ts`.
