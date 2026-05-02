---
title: Architecture and Code Quality Analysis
tags:
  - analysis
  - architecture
  - code-quality
aliases:
  - Code Architecture Review
  - Maintainability Analysis
---

# Architecture and Code Quality Analysis

Analysis of `digital-garden-2024` from the perspective of **maintainability**, **extensibility** (adding new pages/features), and **scalability** (cloning/reusing as a template for new projects).

---

## 1. Component Duplication — Web vs Print Pairs

Every resume section exists as **two nearly identical components**:

```
src/components/resume/sections/
├── web/
│   ├── Experiences.astro
│   ├── Projects.astro
│   ├── Skills.astro
│   └── ...
└── print/
    ├── Experiences.astro   ← almost identical logic
    ├── Projects.astro
    ├── Skills.astro
    └── ...
```

The only real differences between each pair are:
1. Which wrapper block component is used (`SectionBlock` vs `PrintSectionBlock`)
2. Which item component is used (`Item` vs `PrintItem`)
3. Visibility filtering (print versions filter by `visibility.resume_print`)

**Impact:** Adding a new resume section requires creating **two components** and updating **two pages**. Any logic change (sorting, rendering) must be applied twice. Bug fixes easily diverge.

**Fix:** Unify into one component per section accepting a `variant: 'web' | 'print'` prop — exactly as `ResumeMarkdownBulletWrapper` already does:

```astro
---
const { variant = 'web' } = Astro.props
---
```

---

## 2. `SectionBlock` vs `PrintSectionBlock` — Diverged Twins

Two wrapper components with near-identical structure but different classes:

| | `SectionBlock` | `PrintSectionBlock` |
|---|---|---|
| Padding | `p-4` | `p-1` |
| Display | `border` box | no border |
| Heading size | `text-2xl` | `text-lg` |
| Heading font | default | `font-resumeserif` |

These are the same component with two variants. Having them as separate files means styling a section header requires updating both files.

Same applies to `Item.astro` vs `PrintItem.astro` — the print version is actually more sophisticated (auto-detects inline vs block layout based on text length) while the web version uses invalid HTML elements (`<text>`, `<t>`).

---

## 3. Data Fetching in Leaf Components (No Prop Drilling)

Every section component independently calls `getCollection()`:

```astro
<!-- Experiences.astro — fetches its own data -->
const experiences = await getCollection('resumeExperiences')
```

This pattern means:
- **Pages are passive** — `resume.astro` just slots in components, holds no data
- **Components are opaque** — you can't pass alternate data in (e.g. for testing or reuse)
- **No shared filtering** — each component re-runs the same query logic independently
- **Cannot compose** — impossible to pass a subset of experiences to a component without rewriting it

The better Astro pattern is to fetch at the page level and pass data down as props. This is especially important for the print pages where filtering by `visibility` is scattered across every leaf component instead of being one centralised filter.

---

## 4. Visibility System Design

The `visibility` flag on resume items is a per-field object:

```json
"visibility": { "web": true, "resume_print": true, "cv_print": true }
```

**Problems:**

- **Snake_case in JSON, no TypeScript type enforced at the data layer** — the `Visibility` type is defined in the deprecated `_resume.ts` file and imported from there
- **Filtering happens inside each leaf component** — to add a new print variant (e.g. a one-page version), you'd need to edit every single section component
- **Web version doesn't filter by visibility at all** — `web/Experiences.astro` shows all entries regardless of `visibility.web`
- **Inconsistent sorting** — `web/Projects.astro` sorts by `order`; `web/Experiences.astro` has no sort order at all

---

## 5. Dual Data Sources for Overlapping Concepts

Two parallel data systems describe the same person:

| System | File | Used By |
|---|---|---|
| `PORTFOLIO` object | `src/content/portfolio.ts` | Homepage bento cards, `Footer.astro` |
| Content Collections | `src/content/resume/*.json` | Resume pages, print pages |

Skills and interests exist in **both** `portfolio.ts` and `resume/skills.json` / `resume/interests.json`. Name appears in `portfolio.ts`, `resume/header.json`, `Logo.astro`, and multiple page `title=` props.

**For a new clone:** A user must find and update 5+ separate files just to change their name and identity.

---

## 6. `type { Visibility }` Imported from Deprecated File

In `src/content/collection-definitions/resume.ts`:

```ts
import type { Visibility } from '@/content/resume'
```

`@/content/resume` is a **directory**, so this resolves to `src/content/_resume.ts` (the underscore-prefixed deprecated file). The type is still live and used in schemas — but the source file is named to signal deprecation. Anyone cleaning up the codebase would likely delete it and break the build.

---

## 7. Redundant Styling Configuration

Colors are defined **twice**:

1. **`tailwind.config.ts`**: `colors: { border: 'oklch(var(--border))', ... }`
2. **`global.css` `@theme` block**: `--color-border: oklch(var(--border));`

In Tailwind v4, `@theme` in CSS replaces `tailwind.config.ts` color definitions. Both exist simultaneously, creating two sources of truth. A theme update needs to touch both files — or only one, leading to silent divergence.

Additionally, `tailwind.config.ts` still references legacy cactus-theme colors (`cactus-bg`, `cactus-text`, etc.) that are remnants of the original Astro Cactus template. These are not used anywhere meaningful in the current codebase.

---

## 8. Thin Abstraction Layers With No Logic

`src/components/resume/layout/` contains three components:

```astro
<!-- WebWrapper.astro -->
<div class={className}><slot /></div>

<!-- PageLayout.astro -->
<div class={className}><slot /></div>

<!-- Content.astro -->
<div class={className}><slot /></div>
```

All three are identical pass-through divs that accept a `className` prop and render a slot. They add **three extra files and import statements** without providing type safety, default styling, or any logic. The semantic distinction between `WebWrapper`, `PageLayout`, and `Content` is not enforced or meaningful.

---

## 9. Hardcoded Contact Fields in Resume Header

The header schema and component hardcode specific contact channels:

```json
{ "github": "...", "githubName": "...", "email": "...", "location": "..." }
```

```astro
<!-- Header.astro -->
<text class="font-medium">Github</text>: <a href={header.github}>...</a>
<text class="font-medium">Email</text>: {header.email}
<text class="font-medium">Location</text>: {header.location}
```

**Impact on extensibility:** Adding LinkedIn, a personal website, phone number, or Twitter requires editing both `header.json` schema validation AND the `Header.astro` component template. There is no extensible `links: [{label, url}]` array.

---

## 10. Theme System — Multi-Step Addition Process

Adding a new theme requires **5 coordinated changes** across 3 files:

1. Create `src/styles/theme_name.css` with all CSS variables
2. `@import './theme_name.css'` in `global.css`
3. Add theme name to `THEMES` array in `ThemeToggle.astro`
4. Add `<Button id="nameButton">` in `ThemeToggle.astro`
5. Add entry to `SYNTAX_HIGHLIGHTER_THEMES` in `ThemeToggle.astro`

The button ID convention (`${theme}Button`) is an implicit contract between the Astro markup and the JavaScript — not type-checked and not documented. Missing step 4 produces a silent failure (button just doesn't update visually).

Also: no `astro:after-swap` handler for Astro [[View Transitions]] — if client-side navigation is enabled, the theme class on `<html>` will be lost on each page transition.

---

## 11. `astro.config.mjs` — Blog-Coupled Configuration

The Astro config loads 5 remark/rehype plugins that are entirely blog-specific:

```js
remarkPlugins: [
  remarkMath,            // blog only
  remarkFlexibleMarkers, // blog only
  remarkObsidianCallout, // blog only
  wikiLinkPlugin,        // blog only
],
rehypePlugins: [rehypeKatex] // blog only
```

`expressiveCode` (syntax-highlighted code blocks) is also blog-only but runs as an integration affecting the entire build. For a portfolio-only site, these add unnecessary build time and output bundle weight.

---

## 12. Invalid HTML Elements Throughout Components

`<text>` and `<t>` are not valid HTML elements. They appear in:

| File | Count | Should Be |
|---|---|---|
| `Item.astro` | 3× | `<span>` |
| `resume/sections/web/Skills.astro` | 2× | `<span>` |
| `resume/sections/print/Skills.astro` | 2× | `<span>` |
| `resume/sections/print/Header.astro` | 3× | `<span>` |
| `resume.astro` (web page) | 3× | `<span>` |

Browsers typically handle these gracefully as inline elements, but they fail HTML validators, break screen readers' semantic parsing, and make the codebase look unpolished for a developer portfolio.

---

## 13. Scalability — Cloning to a New Project

A new user cloning this as a template needs to change the following to personalise it:

| What to Change | Where It Lives |
|---|---|
| Name | `portfolio.ts`, `resume/header.json`, `Logo.astro`, 4× page `title=` props |
| Job title | `resume/header.json` |
| Bio / intro | `resume/header.json`, `IntroCard.astro` (hardcoded literal) |
| Avatar | `portfolio.ts` (`avatarUrl`) |
| GitHub link | `portfolio.ts`, `resume/header.json` (two separate fields) |
| Footer credit | `Footer.astro` (hardcoded "ALTR" string) |
| Interests | `portfolio.ts`, `resume/interests.json` (two separate files) |
| Skills | `portfolio.ts`, `resume/skills.json` (two separate files) |
| Site URL | `astro.config.mjs` (`site:` value) |

There is **no single entry-point config file**. A new user must grep for their predecessor's name across 10+ files.

---

## 14. Print CSS — Fragile PDF Output

`global_print.css` is 6 lines:

```css
@media print {
  @page { size: a4; margin: 0mm; }
}
```

Issues:
- `margin: 0mm` overrides the browser's default header/footer (page numbers, URL) inconsistently — browser still decides whether to show them
- No `page-break-inside: avoid` on sections — a section can split mid-content across pages
- No font-size baseline for print (screen and print use the same font sizes)
- No explicit handling for links (URLs in `<a>` tags are invisible in PDF unless you add `a::after { content: " (" attr(href) ")" }`)

---

## 15. `BaseLayoutPrint` Imports Components It Hides

```astro
<!-- BaseLayoutPrint.astro -->
import Nav from '@/components/Nav.astro'
import Footer from '@/components/Footer.astro'
...
<div class="print:hidden"><Nav /></div>
<div class="print:hidden"><Footer /></div>
```

`Nav.astro` calls `getCollection('navItems')` on every render. `Footer.astro` imports `PORTFOLIO`. Both are fully rendered into HTML — then hidden by a CSS class at print time. For a print-only page, these are dead weight: collection queries, component renders, and HTML output that serves no purpose.

---

## Summary Table

| Concern | Issue | Severity |
|---|---|---|
| Maintainability | Every section duplicated as web + print component | High |
| Maintainability | Data fetched inside leaf components — not composable | High |
| Maintainability | `Visibility` type imported from deprecated file | Medium |
| Maintainability | Redundant color config in both `tailwind.config.ts` and `global.css` | Medium |
| Maintainability | Invalid `<text>` / `<t>` HTML elements | Medium |
| Extensibility | Hardcoded contact fields in header — no links array | High |
| Extensibility | Adding a resume section requires editing 2 components + 2 pages | High |
| Extensibility | Adding a theme requires 5 coordinated steps across 3 files | Medium |
| Extensibility | No `astro:after-swap` for view transitions | Low |
| Scalability | No single config entry-point — name/identity spread across 10+ files | High |
| Scalability | Two parallel data systems for the same person (`portfolio.ts` + resume JSONs) | High |
| Scalability | Blog-only remark/rehype plugins in global Astro config | Low |
| Scalability | Proprietary fonts (Metric, Canela) require licensing for new users | Medium |
| Print/PDF | No page-break control, no link URL printing, fragile margins | Medium |
| Print/PDF | `BaseLayoutPrint` renders Nav+Footer only to hide them | Low |
| Print/PDF | Thin layout abstractions (`WebWrapper`, `PageLayout`, `Content`) | Low |
