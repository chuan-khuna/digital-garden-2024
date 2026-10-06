# Resume System

The resume is built from **Astro Content Collections** — structured data files that are queried at build time and rendered into an interactive web page and print-optimised PDF pages (the **Print Page**, with three **Print Layouts**: the one-page Resume in two columns or one, and the multi-page CV).

Resume content is organised into **Resume Versions** (glossary: `GLOSSARY.md`; decision record: `docs/adr/0001-versioned-resume-collections.md`). The **Default Version** is the folder named `index`; any other folder is a Resume Version tailored for a specific job application, rendered only on its own unlisted, noindexed print URLs.

---

## Project Structure

```
src/
├── content/
│   ├── resume/                          ← one folder per Resume Version
│   │   ├── index/                       ← Default Version (backs /resume, /resume-print)
│   │   │   ├── header.json              ← name, job title, contact info
│   │   │   ├── skills.json              ← skill categories + keyword lists
│   │   │   ├── educations.json          ← education entries
│   │   │   ├── activities.json          ← activity / side-project entries
│   │   │   ├── interests.json           ← interests list
│   │   │   ├── now.json                 ← "what I'm doing now" (Default Version only)
│   │   │   ├── experiences/             ← one .md file per job role
│   │   │   └── projects/                ← one .md file per project
│   │   └── <version>/                   ← a Resume Version, e.g. 2026-jul-dev (none committed yet)
│   │       └── …                        ← only the Sections it overrides
│   └── collection-definitions/
│       ├── resume.ts                    ← Zod schemas + collection registrations
│       ├── resume-loaders.ts            ← versioned loaders + version-name validation
│       └── resume-sections.ts           ← Section → collection registry (import-free)
│
├── lib/
│   └── resume/
│       ├── index.ts                     ← getResume(surface, version) / getResumeVersions() — Astro content adapter
│       ├── resolve.ts                   ← resolveResume(): fallback, visibility, ordering (pure)
│       └── resolve.test.ts              ← Vitest tests for the rules above
│
├── pages/
│   ├── resume.astro                     ← web version (/resume), always `index`
│   ├── resume-print/index.astro         ← Print Page, Default Version (/resume-print)
│   ├── resume-print/[version].astro     ← Print Page, other versions (/resume-print/<version>)
│   └── resume-print/versions.astro      ← list of every version (/resume-print/versions)
│
├── components/resume/
│   ├── pages/
│   │   └── ResumePrintPage.astro        ← body of /resume-print and /resume-print/<version>: every Print Layout + selector
│   ├── layout/                          ← print layout wrappers
│   │   ├── WebWrapper.astro
│   │   └── PageLayout.astro
│   ├── sections/
│   │   ├── Experiences.astro            ← unified: accepts data[] + variant prop
│   │   ├── Projects.astro
│   │   ├── Skills.astro
│   │   ├── Education.astro
│   │   ├── Activity.astro
│   │   ├── Interests.astro
│   │   ├── Now.astro                    ← web-only (no print equivalent)
│   │   └── print/
│   │       └── Header.astro             ← print-only resume header (receives `header` prop)
│   ├── Item/
│   │   ├── Item.astro                   ← unified: web stacked / print inline-auto
│   │   └── ItemSeparator.astro          ← dashed line separator (used in print)
│   ├── SectionBlock.astro               ← unified section wrapper (variant prop)
│   ├── UnorderedList.astro              ← unified bullet list (variant prop)
│   ├── ResumeMarkdownBulletWrapper.astro ← bullet wrapper for markdown-rendered content
│   ├── ListItem.astro                   ← single web list item
│   ├── Divider.astro
│   └── PrintPageBreak.astro             ← visible divider + CSS page-break
│
└── layouts/
    └── BaseLayoutPrint.astro            ← print layout (hides nav/footer on print; `noindex` prop)
```

---

## Content Collections

All resume data is registered in `src/content/collection-definitions/resume.ts` and exported to `src/content.config.ts`. There is **one collection per data type**, and each collection's loader spans **every** version folder (`src/content/resume/*/…`).

### Collections Overview

File paths are relative to `src/content/resume/<version>/`.

| Collection | Loader | File | Key fields |
|---|---|---|---|
| `resumeHeader` | `versionedResumeJson()` | `header.json` | `name`, `jobTitle`, `email`, `github`, `githubName`, `introduction`, `location` |
| `resumeExperiences` | `versionedResumeGlob()` | `experiences/*.md` | `jobTitle`, `company`, `time`, `visibility` — bullets in MD body |
| `resumeProjects` | `versionedResumeGlob()` | `projects/*.md` | `title`, `time`, `description`, `url`, `order`, `visibility` — bullets in MD body |
| `resumeSkills` | `versionedResumeJson()` | `skills.json` | `category`, `details[]` |
| `resumeEducations` | `versionedResumeJson()` | `educations.json` | `degree`, `institution`, `time`, `details[]`, `visibility` |
| `resumeActivities` | `versionedResumeJson()` | `activities.json` | `title`, `time`, `description`, `url`, `details[]` |
| `resumeInterests` | `versionedResumeJson()` | `interests.json` | `items[]` |
| `resumeNow` | `versionedResumeJson(…, { defaultVersionOnly: true })` | `index/now.json` only | `lastUpdated`, `intro`, `paragraphs[]` |

Every entry also carries a `version` field (the folder it came from), injected by the loader, and its id is prefixed with `<version>/` so ids are unique across versions.

### Versioned Loaders (`resume-loaders.ts`)

- **`versionedResumeGlob(section)`** wraps Astro's `glob()` with the pattern `*/<section>/*.md` (base `src/content/resume`). It sets each id to `<version>/<file-slug>` and wraps `parseData` to inject `version`. Because it delegates to `glob()`, markdown rendering, digests and dev-server file watching work unchanged.
- **`versionedResumeJson(fileName)`** replaces `file()`, which can only read one file. It reads `src/content/resume/<version>/<fileName>` for every version folder, parses the JSON array (items keep their existing `id` field), and stores each item as `<version>/<id>` with `version` injected, validated by the collection schema. In dev it watches `src/content/resume/` and re-syncs whenever a matching file is added, changed or removed.
- **`defaultVersionOnly: true`** (used by `resumeNow`) reads only `index/<fileName>`. The same file inside any other version is silently ignored.
- **Version-name validation:** every folder name other than `index` must be a lowercase kebab-case slug (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`). Anything else fails the build with an `[resume] Invalid Resume Version folder …` error.

### Resolving a Version: `getResume()` (`src/lib/resume/index.ts`)

Pages never call `getCollection('resume*')` directly, because that would mix entries from every version. They go through `src/lib/resume/index.ts`, a thin adapter that loads the eight collections and passes them to the pure `resolveResume(entries, surface, version)` in `src/lib/resume/resolve.ts`. Every rule below lives in `resolve.ts` and is covered by `resume/resolve.test.ts` (`bun run test`), which feeds it fixture entries instead of content:

- **`getResume(surface, version = 'index')`** returns a `Resume` object with every Section resolved for that version: `header` (data), `skills`, `experiences`, `projects` (sorted by `order`), `educations`, `activities`, `interests` (`string[]`) and `now`. `surface` is required (`'web' | 'resume_print' | 'cv_print'`); experiences, projects and educations come back already filtered to entries visible on it.
- **`getResumeVersions()`** returns every distinct version found in the content, **excluding `index`**, sorted. The `[version]` pages use it in `getStaticPaths`.

**Fallback rule (whole-Section override):**

1. If the requested version has **any** entries for a Section, that whole Section comes from the version.
2. Otherwise the whole Section comes from `index`.
3. There is no per-entry merging and no inheritance between versions. The fallback is always `index`.
4. `now` is always read from `index`.

Visibility filtering happens **after** resolution, inside `getResume()`. So a version whose projects are all `resume_print: false` still overrides the projects Section (and shows no projects on `/resume-print/<version>`). It does not fall back to `index`.

Components never query resume collections themselves either: `PrintHeader` (`sections/print/Header.astro`) receives `header` as a prop.

### Visibility Flags

Projects, experiences, and educations have a `visibility` object to control which pages show them:

```json
"visibility": {
  "web": true,
  "resume_print": true,
  "cv_print": true
}
```

Set a flag to `false` to hide an entry from that specific page without deleting it. Each key is a **Surface**; the page passes its Surface to `getResume()`, which does the filtering.

| Page | Filters on |
|---|---|
| `/resume` | `visibility.web` |
| `/resume-print` (and `/<version>`), layouts `resume-two-cols`, `resume-one-col` | `visibility.resume_print` |
| `/resume-print` (and `/<version>`), layout `cv` | `visibility.cv_print` |

The Print Page resolves the version twice — once per print Surface — and hands the `resume_print` result to the two Resume layouts and the `cv_print` result to the CV layout.

---

## How to Update Resume Content

Paths below are for the Default Version (`index`). To change a Resume Version instead, use `src/content/resume/<version>/…`. The full authoring reference, including how to create a new Resume Version, is in `docs/content-formats/resume.md`.

### Header / Contact Info

Edit `src/content/resume/index/header.json`:

```json
[
  {
    "id": "header",
    "name": "Your Name",
    "jobTitle": "Your Title",
    "email": "you@email.com",
    "github": "https://github.com/handle",
    "githubName": "handle",
    "introduction": "A short bio...",
    "location": "City, Country"
  }
]
```

### Adding a New Job Experience

Create a new file in `src/content/resume/index/experiences/`:

```
src/content/resume/index/experiences/companyname-jobtitle.md
```

**Frontmatter** holds the metadata; the **markdown body** holds the bullet points:

```markdown
---
jobTitle: 'Senior Engineer'
company: 'Acme Corp'
time: 'Jan 2025 - Present'
visibility:
  web: true
  resume_print: true
  cv_print: false
---

- Built and maintained the core API serving 10k requests/day
- Reduced deployment time by **40%** by migrating to containerised CI/CD
- Led a team of 3 engineers on the checkout refactor
```

> **Tip — Markdown in bullets**
> Experiences and projects use markdown bodies so you can use `**bold**`, `*italic*`, inline `code`, etc. in bullet points. Educations and activities still use plain string arrays.

> **Note — File ordering**
> The glob loader sorts files alphabetically. If order matters, prefix filenames with a number: `01-latest-job.md`, `02-previous-job.md`.

### Adding a Project

Projects are markdown files, one per project (there is no `projects.json`). Create `src/content/resume/index/projects/<slug>.md`:

```markdown
---
title: 'My Project'
time: '2025'
description: 'Personal project'
url: 'https://github.com/...'   # or null
order: 5                        # optional; lower = earlier
visibility:
  web: true
  resume_print: true
  cv_print: true
---

- What I built and why it matters
- Key technologies or techniques used
```

### Updating Skills

Edit `src/content/resume/index/skills.json` — each entry is a category with a keyword list:

```json
{ "id": "languages", "category": "Languages", "details": ["Python", "Go", "Elixir"] }
```

---

## Web Page (`/resume`)

**File:** `src/pages/resume.astro`

Uses `BaseLayout` (full site layout with nav/footer). The page always shows the Default Version: it calls `getResume('web')` once at the top level and passes the resolved Sections down as props to each section component:

```
┌─────────────────────────────────────┐
│ Header (name, title, contact)       │  ← inline in resume.astro
├───────────────────┬─────────────────┤
│ Experiences       │ Skills          │
│ Projects          │ Education       │
│ Activity          │ Interests       │
│                   │ Now             │
│                   │ [Print links]   │
└───────────────────┴─────────────────┘
  col-span-1 (left)   col-span-1 (right)
  md:grid-cols-2
```

Data fetching happens in `resume.astro` via `getResume()`. Section components receive typed `data` props and a `variant` prop — they are purely presentational.

**Print links** are an untitled `SectionBlock` (hidden with `print:hidden`) styled like the Projects list: two rows split by a dashed divider, each an underlined link with a small muted note on the right: **Print resume** → `/resume-print` ("1 page") and **Print CV** → `/resume-print?layout=cv` ("Full, multi-page"). They always point at the Default Version. Wording follows US usage: a resume is the short document, a CV the full one.

---

## Print Page (`/resume-print`)

### Routes

| URL | File | Resume Version |
|---|---|---|
| `/resume-print` | `src/pages/resume-print/index.astro` | `index` |
| `/resume-print/<version>` | `src/pages/resume-print/[version].astro` | `<version>` |
| `/resume-print/versions` | `src/pages/resume-print/versions.astro` | all (list) |

The `[version]` pages build one page per entry of `getResumeVersions()`, which excludes `index`, so there is no `/resume-print/index`. `versions` is also a reserved folder name, so the static `versions.astro` route never collides with a Resume Version. The page markup lives once in `components/resume/pages/ResumePrintPage.astro`. Routes pass only the Resume Version (`<ResumePrintPage />` for `index`, `<ResumePrintPage version={version} />` otherwise); the page resolves the Resume for each Print Layout's Surface itself and sets `noindex` whenever the version is not the Default Version.

Resume Version pages:

- pass `noindex` to `BaseLayoutPrint`, which forwards it to `HeadSEO` and emits `<meta name="robots" content="noindex">` (and the same for `googlebot`) instead of `index, follow`;
- are excluded from the sitemap (the `filter` on `sitemap()` in `astro.config.mjs`);
- are not linked from the site; the only links to them are on `/resume-print/versions`, which is itself noindexed, out of the sitemap and unlinked;
- keep the same `<title>` as the Default Version (`<displayName>'s Resume`), so the printed PDF doesn't reveal the version name.

### Print Layouts

The Print Layouts and their selection rules live in one pure module, `src/lib/resume/print-layouts.ts` (tested in `print-layouts.test.ts`): each layout's name, label, Surface, Section arrangement and default-hidden Sections, plus `parseSelection` / `writeSelection` / `selectLayout` / `toggleSection` for the URL state. The page markup renders from it, and the page's browser script imports the same functions and only applies the result to the DOM. Add or change a layout there first.

Every page renders all three Print Layouts. An on-screen selector (`print:hidden`) shows one and sets `hidden` on the others, so only the shown layout prints. The choice is kept in the `?layout=` query parameter, so a layout can be linked directly; an unknown or missing value — or no JS — falls back to the default.

| `?layout=` | Surface | Shape | Hidden by default |
|---|---|---|---|
| `resume-two-cols` (default) | `resume_print` | one page, two columns | — |
| `resume-one-col` | `resume_print` | one page, one column | `interests` |
| `cv` | `cv_print` | two pages, one column | — |

A second selector shows or hides individual Sections (`skills`, `experiences`, `projects`, `educations`, `activities`, `interests`); the header always shows. Each Section is rendered by `sections/print/Section.astro`, which wraps it in `<div data-section="<name>">`; a layout's defaults are its `defaultHidden` list in `print-layouts.ts`. Switching layout resets the Section toggles to that layout's defaults. Hidden Sections are kept in `?hide=` (comma-separated, e.g. `/resume-print?layout=cv&hide=projects,interests`), which is left out of the URL when it matches the layout's defaults; an explicit `?hide=` — even empty — overrides them.

The page uses `BaseLayoutPrint`, which hides the nav and footer when printing via `print:hidden` Tailwind classes, and removes padding/margins from the container.

### `resume-two-cols`

```
┌───────────────────────────────────────────────────┐
│ PrintHeader (full width, col-span-7)              │
├──────────────────┬────────────────────────────────┤
│ Skills           │ Experiences                    │
│ Activity         │ Projects                       │
│ Interests        │ Education                      │
│ (col-span-2)     │ (col-span-5)                   │
└──────────────────┴────────────────────────────────┘
  7-column grid total
```

### `resume-one-col`

```
┌──────────────────┐
│ PrintHeader      │
│ Skills           │
│ Experiences      │
│ Projects         │
│ Education        │
│ Activity         │
│ Interests        │
└──────────────────┘
```

### `cv` — single column + page break

```
Page 1:                    Page 2:
┌──────────────────┐       ┌──────────────────┐
│ PrintHeader      │       │ Activity         │
│ Skills           │       │ Interests        │
│ Experiences      │       └──────────────────┘
│ Education        │
│ Projects         │
└──────────────────┘
      ↑ PrintPageBreak (page-break-after: always)
```

### Print Layout Components

| Component | Purpose |
|---|---|
| `WebWrapper` | Outer `div` — centres and sizes content for screen |
| `PageLayout` | Represents a physical page — sets padding/margins for print bleed |
| `sections/print/Section` | Renders one hideable Section by name, wrapped in its `data-section` element |
| `PrintPageBreak` | Shows "PAGE BREAK" label on screen; inserts CSS `page-break-after: always` for PDF |

Font for all print pages: `font-resumesans` (Metric / MetricHPEXS).

---

## Component Anatomy

### Section Wrappers

**`SectionBlock`** accepts a `variant` prop (`'web'` default | `'print'`):

| | `variant="web"` | `variant="print"` |
|---|---|---|
| Border | visible | none |
| Padding | `p-4` | `p-1` |
| Heading size | `text-2xl` | `text-lg` |
| Heading font | default | `font-resumeserif` |

### Item Rows

**`Item`** accepts a `variant` prop:

- `variant="web"` — stacked layout: title on one line, company + time below
- `variant="print"` — auto-detects inline vs stacked based on total character length (`≤ 64` chars = inline):

```
// Inline (short):   Job Title | Company | Jul 2022 ----
// Stacked (long):   Long Job Title --------------------
//                   Company Name  Jul 2022 - Present
```

Print variant also accepts `inline` (force bool) and `titleFontSize` override props.

### Bullet Lists

There are two bullet list systems depending on the data source:

**String array** (projects, educations, activities) → `UnorderedList` with `variant` prop:

```astro
<!-- web -->
<UnorderedList ulClass="text-sm" items={project.data.details} />
<!-- print -->
<UnorderedList items={activity.data.details} variant="print" />
```

**Markdown body** (experiences only) → `ResumeMarkdownBulletWrapper`

```astro
<!-- renders Content component from render(), wraps with styled div -->
const { Content } = await render(exp)
<ResumeMarkdownBulletWrapper variant="print">
  <Content />
</ResumeMarkdownBulletWrapper>
```

---

## `ResumeMarkdownBulletWrapper` Deep Dive

**File:** `src/components/resume/ResumeMarkdownBulletWrapper.astro`

This component exists because Astro's scoped `<style>` cannot reach `<slot>` content — so it uses `<style is:global>` with namespaced class names to style the rendered markdown output.

**Props:** `variant?: 'web' | 'print'` (defaults to `'web'`)

**Key CSS rules applied:**

| Rule | Web | Print |
|---|---|---|
| `ul` margin | `0.5rem` top/bottom | `0.25rem` top/bottom |
| `ul` style | `list-disc`, `pl-5` | `list-disc`, `pl-5` |
| `li::marker` color | `rgb(209 213 219)` (gray-300) | `rgb(209 213 219)` (gray-300) |
| `li` spacing | — | `mb-0 mt-0`, `line-height: 1.25rem` |
| `li p` | `margin: 0; display: inline` | `margin: 0; display: inline` |
| `strong` | `font-weight: 700` | `font-weight: 700` |

> **Note — Why `li p` rule?**
> Astro's markdown renderer may wrap `<li>` content in `<p>` tags. Without zeroing their margins, each bullet gets extra vertical spacing making the list look loose. Setting `display: inline` eliminates this gap.

---

## How a Section Component Works (Experiences example)

The **route** names the Resume Version; the **page body** resolves it for each Surface (via `getResume()`, which also filters by visibility). The **section component** only renders.

```astro
---
// resume-print/[version].astro (route) — names the version
const { version } = Astro.params
---
<ResumePrintPage version={version} />
```

```astro
---
// components/resume/pages/ResumePrintPage.astro (page body) — resolves per Surface
const bySurface = {
  resume_print: await getResume('resume_print', version),
  cv_print: await getResume('cv_print', version),
}
---
{PRINT_LAYOUTS.map(({ surface, arrangement }) => /* … */
  <PrintSection name="experiences" resume={bySurface[surface]} />)}
```

```astro
---
// sections/Experiences.astro (component) — presentational
interface Props {
  data: CollectionEntry<'resumeExperiences'>[]
  variant?: 'web' | 'print'
}
const { data, variant = 'web' } = Astro.props

// Pre-render markdown bodies
const rendered = await Promise.all(
  data.map(async (exp) => {
    const { Content } = await render(exp)
    return { exp, Content }
  })
)
---

<SectionBlock title="Experience" variant={variant}>
  {rendered.map(({ exp, Content }) => (
    <div>
      <Item title={exp.data.jobTitle} timeDescription={exp.data.time}
            description={exp.data.company} variant={variant} />
      <ResumeMarkdownBulletWrapper variant={variant}>
        <Content />
      </ResumeMarkdownBulletWrapper>
    </div>
  ))}
</SectionBlock>
```

For JSON-based sections (skills, educations, activities), the pattern is simpler — no `render()` needed, just pass `items={entry.data.details}` to `UnorderedList`. Projects, like experiences, are markdown and use `render()`.

---

## Rendering Pipeline

```
Content files (src/content/resume/<version>/ JSON / .md)
        ↓  Astro Content Collections (versionedResumeJson / versionedResumeGlob loaders)
getResume(surface, version)  ← src/lib/resume/index.ts → resolveResume() in resume/resolve.ts: whole-Section override, fallback to `index`, visibility filter
        ↓
resume.astro / resume-print/(index|[version]).astro
        ↓  ResumePrintPage (resolves each Surface; Print Layouts from lib/resume/print-layouts.ts)
Section components (sections/*.astro)  ← receive typed data[] + variant as props
        ↓  compose using SectionBlock + Item + UnorderedList / ResumeMarkdownBulletWrapper
        ↓  wrapped in BaseLayout / BaseLayoutPrint
Browser → Ctrl+P → PDF
```

---

## Related

- [OG Image Generator](./og-image-generator.md) — resume page has its own OG image via `og-images.json`
- [Adding a Theme](./add-theme.md) — `font-resumesans` and `font-resumeserif` are custom font utilities defined in `tailwind.config.ts`
