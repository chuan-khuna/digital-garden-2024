---
title: Resume System
tags:
aliases:
  - How the Resume Works
  - Resume Architecture
---

# Resume System

The resume is built from **Astro Content Collections** — structured data files that are queried at build time and rendered into two variants: an interactive web page and a print-optimised PDF page.

---

## Project Structure

```
src/
├── content/
│   ├── resume/                          ← all resume data lives here
│   │   ├── header.json                  ← name, job title, contact info
│   │   ├── skills.json                  ← skill categories + keyword lists
│   │   ├── projects.json                ← project entries (with visibility)
│   │   ├── educations.json              ← education entries
│   │   ├── activities.json              ← activity / side-project entries
│   │   ├── interests.json               ← interests list
│   │   ├── now.json                     ← "what I'm doing now" section
│   │   └── experiences/                 ← one .md file per job role
│   │       └── themather-datascientist.md
│   └── collection-definitions/
│       └── resume.ts                    ← Zod schemas + collection registrations
│
├── pages/
│   ├── resume.astro                     ← web version (/resume)
│   ├── resume-print.astro               ← print resume (/resume-print)
│   └── cv-print.astro                   ← print CV (/cv-print)
│
├── components/resume/
│   ├── layout/                          ← print layout wrappers
│   │   ├── WebWrapper.astro
│   │   ├── PageLayout.astro
│   │   └── Content.astro
│   ├── sections/
│   │   ├── web/                         ← web section components
│   │   │   ├── Experiences.astro
│   │   │   ├── Projects.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Education.astro
│   │   │   ├── Activity.astro
│   │   │   ├── Interests.astro
│   │   │   └── Now.astro
│   │   └── print/                       ← print section components
│   │       ├── Header.astro
│   │       ├── Experiences.astro
│   │       ├── Projects.astro
│   │       ├── Skills.astro
│   │       ├── Education.astro
│   │       ├── Activity.astro
│   │       └── Interests.astro
│   ├── Item/
│   │   ├── Item.astro                   ← web job/project title row
│   │   ├── PrintItem.astro              ← print job/project title row (auto inline/stack)
│   │   └── ItemSeparator.astro          ← dashed line separator
│   ├── SectionBlock.astro               ← web section wrapper (border + prose)
│   ├── PrintSectionBlock.astro          ← print section wrapper (compact)
│   ├── UnorderedList.astro              ← web bullet list (string arrays)
│   ├── PrintUnorderedList.astro         ← print bullet list (string arrays)
│   ├── ResumeMarkdownBulletWrapper.astro ← bullet wrapper for markdown-rendered content
│   ├── ListItem.astro                   ← single web list item
│   ├── Divider.astro
│   └── PrintPageBreak.astro             ← visible divider + CSS page-break
│
└── layouts/
    └── BaseLayoutPrint.astro            ← print layout (hides nav/footer on print)
```

---

## Content Collections

All resume data is registered in `src/content/collection-definitions/resume.ts` and exported to `src/content.config.ts`.

### Collections Overview

| Collection | Loader | File | Key fields |
|---|---|---|---|
| `resumeHeader` | `file()` | `header.json` | `name`, `jobTitle`, `email`, `github`, `githubName`, `introduction`, `location` |
| `resumeExperiences` | `glob()` | `experiences/*.md` | `jobTitle`, `company`, `time`, `visibility` — bullets in MD body |
| `resumeProjects` | `file()` | `projects.json` | `title`, `time`, `description`, `url`, `details[]`, `visibility` |
| `resumeSkills` | `file()` | `skills.json` | `category`, `details[]` |
| `resumeEducations` | `file()` | `educations.json` | `degree`, `institution`, `time`, `details[]`, `visibility` |
| `resumeActivities` | `file()` | `activities.json` | `title`, `time`, `description`, `url`, `details[]` |
| `resumeInterests` | `file()` | `interests.json` | `items[]` |
| `resumeNow` | `file()` | `now.json` | `lastUpdated`, `intro`, `paragraphs[]` |

### Visibility Flags

Projects, experiences, and educations have a `visibility` object to control which pages show them:

```json
"visibility": {
  "web": true,
  "resume_print": true,
  "cv_print": true
}
```

Set a flag to `false` to hide an entry from that specific page without deleting it.

---

## How to Update Resume Content

### Header / Contact Info

Edit `src/content/resume/header.json`:

```json
{
  "name": "Your Name",
  "jobTitle": "Your Title",
  "email": "you@email.com",
  "github": "https://github.com/handle",
  "githubName": "handle",
  "introduction": "A short bio...",
  "location": "City, Country"
}
```

### Adding a New Job Experience

Create a new file in `src/content/resume/experiences/`:

```
src/content/resume/experiences/companyname-jobtitle.md
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

> [!tip] Markdown in bullets
> Experiences use markdown bodies so you can use `**bold**`, `*italic*`, inline `code`, etc. in bullet points. Other collections (projects, educations) still use plain string arrays.

> [!info] File ordering
> The glob loader sorts files alphabetically. If order matters, prefix filenames with a number: `01-latest-job.md`, `02-previous-job.md`.

### Adding a Project

Add an entry to `src/content/resume/projects.json`:

```json
{
  "id": "my-project-slug",
  "title": "My Project",
  "time": "Mar 2025",
  "description": "Short description",
  "url": "https://github.com/...",
  "details": [
    "What I built and why it matters",
    "Key technologies or techniques used"
  ],
  "visibility": { "web": true, "resume_print": true, "cv_print": true }
}
```

### Updating Skills

Edit `src/content/resume/skills.json` — each entry is a category with a keyword list:

```json
{ "id": "languages", "category": "Languages", "details": ["Python", "Go", "Elixir"] }
```

---

## Web Page (`/resume`)

**File:** `src/pages/resume.astro`

Uses `BaseLayout` (full site layout with nav/footer). Header data is fetched directly via `getCollection('resumeHeader')`. Each section is a self-contained component that fetches its own data:

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

Each section component independently calls `getCollection(...)` — no data is passed as props from the page.

---

## Print Pages (`/resume-print`, `/cv-print`)

Both pages use `BaseLayoutPrint` which hides the nav and footer when printing via `print:hidden` Tailwind classes, and removes padding/margins from the container.

### `resume-print` — 2-column layout

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

### `cv-print` — single column + page break

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
| `Content` | Inner grid wrapper |
| `PrintPageBreak` | Shows "PAGE BREAK" label on screen; inserts CSS `page-break-after: always` for PDF |

Font for all print pages: `font-resumesans` (Metric / MetricHPEXS).

---

## Component Anatomy

### Section Wrappers

**`SectionBlock`** (web) — adds a visible border and `prose` styling:
```astro
<div class="prose-cactus prose relative max-w-full border p-4">
  <h1 class="text-2xl">{title}</h1>
  <slot />
</div>
```

**`PrintSectionBlock`** (print) — compact, no border, smaller heading using `font-resumeserif`:
```astro
<div class="prose-cactus prose relative block max-w-full p-1">
  <h1 class="mb-1 font-resumeserif text-lg">{title}</h1>
  <slot />
</div>
```

### Item Rows

**`Item`** (web) — title + company/description + time, stacked layout:
```
Job Title
Company Name                            Jul 2022 - Present
```

**`PrintItem`** (print) — auto-detects whether to go inline or stacked based on total character length (`≤ 64` chars = inline):
```
// Inline (short):   Job Title | Company | Jul 2022 ----
// Stacked (long):   Long Job Title --------------------
//                   Company Name  Jul 2022 - Present
```

### Bullet Lists

There are two bullet list systems depending on the data source:

**String array** (projects, educations, activities) → `UnorderedList` / `PrintUnorderedList`

```astro
<!-- receives items: string[] prop -->
<UnorderedList ulClass="text-sm" items={project.data.details} />
<PrintUnorderedList items={project.data.details} />
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

> [!info] Why `li p` rule?
> Astro's markdown renderer may wrap `<li>` content in `<p>` tags. Without zeroing their margins, each bullet gets extra vertical spacing making the list look loose. Setting `display: inline` eliminates this gap.

---

## How a Section Component Works (Experiences example)

```astro
---
// 1. Fetch collection
const experiences = await getCollection('resumeExperiences')

// 2. Pre-render markdown bodies (experiences use .md files)
const renderedExperiences = await Promise.all(
  experiences.map(async (exp) => {
    const { Content } = await render(exp)
    return { exp, Content }
  })
)
---

<!-- 3. Render each entry -->
<PrintSectionBlock title="Experiences">
  {renderedExperiences.map(({ exp, Content }) => (
    <>
      <PrintItem
        title={exp.data.jobTitle}
        timeDescription={exp.data.time}
        description={exp.data.company}
      />
      <ResumeMarkdownBulletWrapper variant="print">
        <Content />
      </ResumeMarkdownBulletWrapper>
    </>
  ))}
</PrintSectionBlock>
```

For JSON-based sections (projects, skills), the pattern is simpler — no `render()` needed, just pass `items={entry.data.details}` directly to `PrintUnorderedList`.

---

## Rendering Pipeline

```
Content files (JSON / .md)
        ↓  Astro Content Collections (glob / file loaders)
getCollection('resumeXxx')
        ↓  each section component fetches its own data
Section components (web/ or print/)
        ↓  compose using Item + UnorderedList / ResumeMarkdownBulletWrapper
resume.astro / resume-print.astro / cv-print.astro
        ↓  wrapped in BaseLayout / BaseLayoutPrint
Browser → Ctrl+P → PDF
```

---

## Related

- [[OG Image Generator]] — resume page has its own OG image via `og-images.json`
- [[Adding a Theme]] — `font-resumesans` and `font-resumeserif` are custom font utilities defined in `tailwind.config.ts`
