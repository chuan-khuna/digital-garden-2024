---
title: Portfolio-to-Resume Template Conversion
tags:
  - analysis
  - portfolio
  - resume
aliases:
  - Conversion Plan
  - Resume Template Conversion
updated: 2026-05-16
---

# Portfolio-to-Resume Template Conversion

Analysis of converting `digital-garden-2024` from a digital garden + resume hybrid into a focused **landing page / resume / portfolio template** for developers.

**Killer feature:** Save Resume as PDF via the print-optimised `/resume-print` page.

> [!warning] Status (2026-05-16, updated)
> `<text>`/`<t>` invalid HTML fixed. `site.config.ts` introduced — page titles and Footer no longer hardcoded. OG image site title now reads from `SITE.siteTitle`. All other items remain open.

---

## 1. What to Remove (Blog/Garden System)

The blog system has significant surface area that adds complexity without value for a pure portfolio site.

**Pages to retire:**
- `src/pages/garden.astro`
- `src/pages/posts/` — dynamic `[...slug]` routes

**Content to remove:**
- `src/content/posts/` — all post `.md`/`.mdx` files
- `src/content/collection-definitions/post.ts` & `note.ts`
- `notesCollection` export in `content.config.ts`
- `src/layouts/PostLayout.astro`
- `src/components/post/` directory
- `src/components/aceternity/` (only used in blog/garden animations)
- `src/utils/bidirectional-link.ts`
- `src/styles/obsidian_callout.css`
- `src/styles/flexible_mark.css`

**Dependencies to strip from `astro.config.mjs`:**
- `remark-wiki-link`
- `remark-math` + `rehype-katex`

**Also:**
- Remove KaTeX CDN stylesheet from `BaseLayout.astro`
- Remove `Garden` entry from `src/content/nav-items.json`

---

## 2. Homepage (Bento Grid) Issues

### Placeholder / Hardcoded Content
- `Lorem.astro` and `LoremSm.astro` are explicit placeholder cards — need real sections (Projects, Skills, Contact, etc.)
- `IntroCard.astro` has the bio hardcoded as a literal string (`"An ordinary Data Scientist who loves SAWANO Hiroyuki's music"`) instead of reading from `PORTFOLIO`
- `index.astro` has hardcoded personal blockquotes and an "About this digital garden" card — completely breaks template reuse
- `index.astro` `description` prop contains a hardcoded personal bio

### Image Bug (Known, Unfixed)
- `IntroCard.astro` uses a plain `<img>` tag and has a TODO comment about a layout bug when text isn't long enough
- Astro's optimised `<Image>` component is commented out — should be fixed and used

---

## 3. Data Architecture Issues

### Dual Data Sources (Fragmentation)
There are **two parallel data stores** for overlapping concepts:
1. `src/content/portfolio.ts` — flat TS object for the bento homepage (name, avatar, interests, skills, links)
2. `src/content/resume/header.json` + individual JSON section files — for resume pages

Skills and interests are **duplicated** between these. A template user must edit two separate files to keep them in sync.

**Recommendation:** Do **not** blindly merge these into one source. The portfolio and resume serve different audiences and intentionally need different content — portfolio is curated and creative, resume is comprehensive and formal. The same experience or skill may be presented differently in each context. Merging would require `showOnPortfolio` / `showOnResume` flags on every entry, which adds complexity without benefit.

Instead, address the two real problems separately:
- **Identity data** (name, job title, avatar, social links) should be consolidated into one place — these genuinely should never differ between pages
- **Content data** (skills list, project descriptions, experience summaries) should remain in separate files, with each page owning its own curated version

### Over-split Content Collections
Each resume section is its own JSON file and its own collection definition (8 collections total):
```
resumeHeader, resumeSkills, resumeProjects, resumeExperiences,
resumeEducations, resumeActivities, resumeInterests, resumeNow
```
This is unnecessarily granular and makes the content config verbose. Could be flattened into 2–3 logical groups.

### Deprecated File
- `src/content/_resume.ts` — old resume data file still present in the repo, creates confusion for template users

---

## 4. Resume Page Issues

### Web Resume (`/resume`)
- Uses invalid HTML `<text>` element (e.g. `<text class="font-medium">Github</text>`) — should be `<span>`
- The links to `/resume-print` and `/cv-print` are buried at the bottom of the page in a plain `<div>` — no visual hierarchy or call-to-action prominence
- `title="ALTR's Resume"` is hardcoded; should reference the header data

### Two Nearly Identical Print Pages
- `resume-print.astro` and `cv-print.astro` use the same components in slightly different column arrangements
- The distinction between "Resume" and "CV" is unclear — no documentation or comments explain the difference
- Could be consolidated into one configurable print template with a layout prop

---

## 5. PDF/Print Feature — The Killer Feature

The print-to-PDF flow is the main differentiator. Currently functional but **severely undersold**.

**Current flow:**
1. User navigates to `/resume-print` or `/cv-print`
2. Uses browser `Ctrl+P` / `Cmd+P` to save as PDF
3. CSS `@media print` with A4 page size handles layout

**Problems:**

| Issue | Location |
|---|---|
| No prominent "Download Resume as PDF" button anywhere | `/resume`, homepage |
| Print pages only reachable via small text link at the bottom of `/resume` | `resume.astro:81–88` |
| `BaseLayoutPrint` imports Nav + Footer then hides them with `print:hidden` — wasteful | `BaseLayoutPrint.astro` |
| `global_print.css` is only 6 lines — just sets A4 size, no page-break handling | `src/styles/global_print.css` |
| `WebWrapper` and `PageLayout` are thin pass-through divs with no logic | `src/components/resume/layout/` |
| No visible instruction on print page telling users to use browser print | `resume-print.astro` |

**Recommended improvements:**
- Add a prominent sticky "Save as PDF" CTA button on `/resume` that calls `window.print()`
- Add a floating action button on the print preview page itself
- Improve `global_print.css`: add `page-break-inside: avoid` on sections, consistent font sizes, link URL printing
- Consider `?print=true` query param that auto-triggers the print dialog on load
- Remove Nav/Footer from `BaseLayoutPrint` entirely (don't import, not just hide)

---

## 6. Navigation & Page Structure

For a portfolio template, the current nav (`Home`, `Garden`, `Uses`, `Resume`) should become:
- `Home` — bento landing page
- `Resume` — web resume view
- Optionally: `Projects`, `Uses`

The `Uses` page (`/uses`) is entirely personal hardcoded content (specific keyboards, tea brands, table tennis paddles) in the `.astro` file — not data-driven. For a template this should be either removed or converted to a data file.

---

## 7. Code Quality Issues

| Location | Issue |
|---|---|
| `IntroCard.astro:7–8` | `var` used instead of `const` for CSS class strings |
| `resume/sections/print/Header.astro:29` | `<text>` is not a valid HTML element — use `<span>` |
| `resume.astro:49–65` | Multiple `<text>` invalid HTML elements |
| `global.css:55–56` | `--animate-accordion-down` keyframe definition appears truncated inside a CSS comment |
| `global.css:60–68` | `accordion-down` keyframe defined inside `@theme` but no `--animate-accordion-down` custom property is set (only `accordion-up` has one) |
| `BaseLayoutPrint.astro` | Imports and renders Nav + Footer just to hide them — unnecessary collection fetches |
| `IntroCard.astro:51–58` | `<img>` with known layout bug; Astro `<Image>` is commented out |
| `src/pages/_wip/` and `src/pages/_deprecated/` | Dead code directories still present |

---

## 8. Template Readiness — Hardcoded Content Audit

For this to work as a reusable template, all personalised content must be data-driven:

| Currently Hardcoded In | Value | Should Move To |
|---|---|---|
| `IntroCard.astro` | Bio text literal string | `PORTFOLIO` config |
| `index.astro` | Personal blockquotes | `PORTFOLIO` config or remove |
| `index.astro` | "About this digital garden" card | Remove entirely |
| `resume.astro`, `resume-print.astro`, `cv-print.astro` | `title="ALTR's Resume"` | Resume header data |
| `BaseLayout` call-sites | `description` prop | Site config |
| `uses.astro` | All content | Data file |

---

## 9. Positive Aspects (Keep As-Is)

- **OKLCH theming system** with multiple themes (nzk, nexus, dark) is well-structured and elegant — a genuine differentiator
- **Content Collections** for resume JSON data is the right architecture: typed, validated, easy to edit
- **Bento grid layout** is visually interesting without being distracting — appropriate tone for a developer portfolio
- **Print CSS approach** (browser print → PDF) is dependency-free and always reflects latest content
- **OG image generation** via Satori (`/og/pages/*.png`) is a nice touch for social sharing
- **shadcn/ui** component primitives provide solid, accessible UI foundation
- **Two-column print layout** for resume is clean and space-efficient

---

## 10. Recommended Conversion Roadmap

1. **Strip blog system** — remove posts, garden page, wiki-link + math plugins, KaTeX
2. **Consolidate identity data** — extract name, job title, avatar, social links into a single `src/content/site-config.ts`; keep portfolio and resume content data separate (they serve different audiences and need different content)
3. **Fix homepage** — replace `Lorem` placeholders with real sections; make all text data-driven from config
4. **Promote the PDF feature** — add prominent `window.print()` CTA; improve print CSS; fix `BaseLayoutPrint`
5. **Consolidate print pages** — merge `resume-print` and `cv-print` into one configurable template
6. **Fix code quality** — replace `<text>` with `<span>`, `var` → `const`, fix Astro `<Image>` usage, remove `_wip`/`_deprecated`
7. **Clean up navigation** — remove Garden/Uses or make Uses data-driven
8. **Template documentation** — clear README on how to customise name, sections, links, avatar

---

## Log

### 2026-05-16
- Initial analysis documented: blog removal, bento placeholders, dual data sources, print/PDF weaknesses, hardcoded content audit

### 2026-05-16 (status review)
- ✅ `<text>`/`<t>` invalid HTML fixed — replaced with `<span>` across 6 files (Item.astro, web/Skills.astro, print/Skills.astro, print/Header.astro, resume.astro, PostMetadata.astro)
- ✅ `Lorem.astro` / `LoremSm.astro` confirmed as intentional placeholder components — not an issue
- ✅ Page titles (`index`, `resume`, `uses`, `resume-print`, `cv-print`) now read from `SITE.displayName` via `site.config.ts`
- ✅ Footer hardcoded "ALTR" and GitHub URL now read from `SITE`
- ✅ `og-images.json` index title now resolved from `SITE.siteTitle` via `{{siteTitle}}` token
- ✅ Rogue `next` package removed — fixes duplicate React / useState crash in `NowTime`
- ❌ 11 items remain open: blog removal, Lorem placeholder cards, IntroCard bio hardcoded, print CSS, BaseLayoutPrint waste, resume-print/cv-print duplication, `_wip`/`_deprecated` dead code, resume.astro hardcoded description, `uses.astro` hardcoded content, no PDF CTA button, thin layout abstractions
