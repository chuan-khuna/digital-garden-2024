---
name: setup-resume-page
description: Scaffold a resume system in an Astro project using Content Collections for structured JSON data, with a web view and a print-optimised PDF page. Uses Tailwind CSS v4 and OKLCH theming.
---

# Setup Resume Page

Scaffold a **resume system** in an existing Astro project. Creates typed Astro Content Collections for all resume sections, a web resume page, and a print-optimised PDF page.

Assumes Tailwind CSS v4, OKLCH CSS variables for theming, and shadcn/ui primitives are already installed.

---

## What This Skill Creates

```
src/
├── content/
│   ├── resume/
│   │   ├── header.json          ← name, job title, contact info
│   │   ├── skills.json          ← skill categories + keyword lists
│   │   ├── projects.json        ← project entries
│   │   ├── educations.json      ← education entries
│   │   ├── experiences/         ← one .md file per job role
│   │   │   └── example-role.md
│   │   └── interests.json       ← optional interests list
│   └── collection-definitions/
│       └── resume.ts            ← Zod schemas + collection registrations
├── pages/
│   ├── resume.astro             ← web version (/resume)
│   └── resume-print.astro       ← print/PDF version (/resume-print)
└── components/resume/
    ├── sections/
    │   ├── Experiences.astro
    │   ├── Projects.astro
    │   ├── Skills.astro
    │   └── Education.astro
    └── SectionBlock.astro       ← shared section wrapper
```

---

## Content Collections

Register all resume collections in `src/content/collection-definitions/resume.ts` using Zod schemas:

```ts
import { defineCollection, z } from 'astro:content'

const visibilitySchema = z.object({
  web: z.boolean().default(true),
  resume_print: z.boolean().default(true),
})

export const resumeCollections = {
  resumeHeader: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      jobTitle: z.string(),
      email: z.string(),
      location: z.string(),
      links: z.array(z.object({ label: z.string(), url: z.string() })),
    }),
  }),
  resumeExperiences: defineCollection({
    type: 'content',
    schema: z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      visibility: visibilitySchema.default({}),
    }),
  }),
  // add resumeSkills, resumeProjects, resumeEducations similarly
}
```

Then re-export in `src/content.config.ts`:

```ts
import { resumeCollections } from './content/collection-definitions/resume'
export const collections = { ...resumeCollections }
```

---

## Web Resume Page

`resume.astro` fetches all collections at the page level and passes data down as props:

```astro
---
import { getCollection } from 'astro:content'
const [header] = await getCollection('resumeHeader')
const experiences = await getCollection('resumeExperiences')
  .then(e => e.sort((a, b) => b.data.startDate.localeCompare(a.data.startDate)))
---
<Experiences experiences={experiences} />
```

> Always fetch at the page level — not inside section components. This keeps components composable and filtering centralised.

---

## Print Page

`resume-print.astro` uses the same data but filters by `visibility.resume_print`:

```astro
---
const experiences = await getCollection('resumeExperiences')
  .then(e => e.filter(x => x.data.visibility.resume_print))
---
```

Use `@media print` CSS to control the PDF layout. Set A4 page size and add page-break control:

```css
@media print {
  @page { size: A4; margin: 15mm; }
  section { page-break-inside: avoid; }
}
```

The print page layout should **not** render Nav or Footer — use a separate minimal layout component for print pages.

---

## Section Components

Each section component receives data as props (not fetching its own data):

```astro
---
interface Props {
  experiences: CollectionEntry<'resumeExperiences'>[]
}
const { experiences } = Astro.props
---
```

Use a `variant: 'web' | 'print'` prop to handle styling differences in one component rather than maintaining separate web/print component pairs.

---

## Design Notes

- **Resume data is separate from portfolio data** — these serve different audiences. Resume content is comprehensive and tailored per application; portfolio content is curated. Do not merge them.
- **Identity data** (name, links) lives in `resume/header.json`. If a portfolio page also needs this data, import it from here rather than duplicating it in `portfolio.ts`.
- Use UK date format: `DD MMM YYYY` (e.g. `01 Jan 2024`)

---

## Checklist

- [ ] All resume JSON files created under `src/content/resume/`
- [ ] Zod schemas defined in `collection-definitions/resume.ts`
- [ ] Collections registered in `content.config.ts`
- [ ] `resume.astro` fetches all data at page level, passes as props
- [ ] `resume-print.astro` filters by `visibility.resume_print`
- [ ] Print layout does not import/render Nav or Footer
- [ ] No `<text>` or `<t>` elements — use `<span>` throughout
- [ ] Section components accept data as props, do not call `getCollection()` internally
