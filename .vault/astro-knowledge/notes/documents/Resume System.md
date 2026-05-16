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
│   │   ├── Experiences.astro            ← unified: accepts data[] + variant prop
│   │   ├── Projects.astro
│   │   ├── Skills.astro
│   │   ├── Education.astro
│   │   ├── Activity.astro
│   │   ├── Interests.astro
│   │   ├── Now.astro                    ← web-only (no print equivalent)
│   │   └── print/
│   │       └── Header.astro             ← print-only resume header
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

Uses `BaseLayout` (full site layout with nav/footer). The page fetches **all** collection data at the top level and passes it down as props to each section component:

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

All `getCollection()` calls happen in `resume.astro`. Section components receive typed `data` props and a `variant` prop — they are purely presentational.

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

> [!info] Why `li p` rule?
> Astro's markdown renderer may wrap `<li>` content in `<p>` tags. Without zeroing their margins, each bullet gets extra vertical spacing making the list look loose. Setting `display: inline` eliminates this gap.

---

## How a Section Component Works (Experiences example)

The **page** owns data fetching and filtering. The **section component** only renders.

```astro
---
// resume-print.astro (page) — fetches and filters
const experiences = (await getCollection('resumeExperiences'))
  .filter((e) => e.data.visibility.resume_print)
---
<Experiences data={experiences} variant="print" />
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

For JSON-based sections (projects, skills), the pattern is simpler — no `render()` needed, just pass `items={entry.data.details}` to `UnorderedList`.

---

## Rendering Pipeline

```
Content files (JSON / .md)
        ↓  Astro Content Collections (glob / file loaders)
resume.astro / resume-print.astro / cv-print.astro
        ↓  getCollection() + .filter(visibility) — pages own all data fetching
Section components (sections/*.astro)  ← receive typed data[] + variant as props
        ↓  compose using SectionBlock + Item + UnorderedList / ResumeMarkdownBulletWrapper
        ↓  wrapped in BaseLayout / BaseLayoutPrint
Browser → Ctrl+P → PDF
```

---

## Related

- [[OG Image Generator]] — resume page has its own OG image via `og-images.json`
- [[Adding a Theme]] — `font-resumesans` and `font-resumeserif` are custom font utilities defined in `tailwind.config.ts`
