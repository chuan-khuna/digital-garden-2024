# How to Manage Resume Content

All resume data lives in `src/content/resume/<version>/`, one folder per **Resume Version** (glossary: `CONTEXT.md`).

- `src/content/resume/index/` is the **Default Version**. It backs the web resume (`/resume`) and the default print pages (`/resume-print`, `/cv-print`).
- Any other folder, e.g. `src/content/resume/2026-jul-dev/`, is a Resume Version tailored for a specific job application. It is rendered only at `/resume-print/<version>` and `/cv-print/<version>`.

Schema definitions: `src/content/collection-definitions/resume.ts` (loaders: `resume-loaders.ts`; resolution: `src/lib/resume.ts`). Architecture: `docs/architecture/resume-system.md`.

```
src/content/resume/
├── index/                  ← Default Version: must contain every Section
│   ├── header.json
│   ├── skills.json
│   ├── educations.json
│   ├── activities.json
│   ├── interests.json
│   ├── now.json            ← only read from index
│   ├── experiences/*.md
│   └── projects/*.md
└── 2026-jul-dev/           ← a Resume Version: only the Sections it overrides
    ├── header.json
    ├── experiences/*.md
    └── …
```

---

## Resume Versions

### Creating a new Resume Version

1. Create a folder `src/content/resume/<slug>/`.
2. Add **only the Sections you want to change**, using the same file names and formats as `index/` (see [Collections](#collections) below). For example, to tailor just the header and projects:

   ```
   src/content/resume/2026-sep-backend/
   ├── header.json
   └── projects/
       ├── project-a.md
       └── project-b.md
   ```

3. Build or run the dev server. The version is rendered at:
   - `/resume-print/<slug>` (one-page Resume)
   - `/cv-print/<slug>` (multi-page CV)

No code or schema changes are needed: the version list is derived from the folders.

### Override semantics: whole Sections, not entries

A **Section** is one kind of content: header, skills, experiences, projects, educations, activities, interests, or now.

- If a version contains **any** entries for a Section, that **whole Section** comes from the version. For example, if `2026-jul-dev/projects/` holds one file, that version shows that one project and none of the `index` projects.
- If a version has **no** entries for a Section (the file or folder is absent), the whole Section comes from `index`.
- Entries are never merged across versions, and versions never inherit from each other. The fallback is always `index`.
- Visibility flags are applied after this resolution. A version whose projects are all `resume_print: false` shows no projects on `/resume-print/<slug>`; it does not fall back to `index`.

To keep an `index` entry in a version that overrides that Section, copy the entry into the version folder.

### The `now` Section

`now` belongs only to the Default Version. A `now.json` placed inside any other version folder is **silently ignored**. (`now` is shown only on the web resume, which always uses `index`.)

### Naming

- Version folder names must be **lowercase kebab-case slugs**: `a-z`, `0-9`, single hyphens (e.g. `2026-jul-dev`, `acme-backend`). Anything else fails the build with an `[resume] Invalid Resume Version folder …` error.
- `index` is **reserved** for the Default Version. There is no `/resume-print/index` page.
- Naming versions `yyyy-mmm-role` (e.g. `2026-jul-dev`) is a **convention only**; it is not enforced.

### Visibility of version pages

Version pages carry `<meta name="robots" content="noindex">`, are excluded from the sitemap, and are not linked anywhere on the site. Share the URL directly. The page `<title>` is the same as the Default Version's (`<displayName>'s Resume`).

`src/content/resume/2026-jul-dev/` is a **mock** version filled with obviously fake data (e.g. "Mock Person"), kept for testing.

---

## Visibility field (shared by most collections)

Projects, experiences and educations have a `visibility` object that controls which pages the entry appears on:

```json
"visibility": {
  "web": true,
  "resume_print": true,
  "cv_print": true
}
```

Default is `true` for all three. Set to `false` to hide from a specific layout.

| Page | Filters on |
|---|---|
| `/resume` | none (renders every entry) |
| `/resume-print`, `/resume-print/<version>` | `resume_print` |
| `/cv-print`, `/cv-print/<version>` | `cv_print` |

---

## Collections

Each collection spans every version folder. Paths below are relative to `src/content/resume/<version>/`. JSON items keep an `id` field; the loader stores them as `<version>/<id>` and adds a `version` field (the folder name) to every entry, so don't write `version` yourself.

### `resumeHeader` — `header.json`

Single-item JSON array. The header/contact info shown at the top of the resume.

```json
[
  {
    "id": "header",
    "name": "string",
    "jobTitle": "string",
    "email": "email string",
    "github": "url string",
    "githubName": "string",
    "introduction": "string",
    "location": "string"
  }
]
```

---

### `resumeNow` — `now.json` (Default Version only)

Single-item JSON array. The "what I'm doing now" section. Read only from `index/now.json`; ignored in every other version.

```json
[
  {
    "id": "now",
    "lastUpdated": "YYYY-MM-DD",
    "intro": "string",
    "paragraphs": ["string", "..."]
  }
]
```

---

### `resumeSkills` — `skills.json`

JSON array of skill categories.

```json
[
  {
    "id": "string",
    "category": "string",
    "details": ["string", "..."]
  }
]
```

---

### `resumeEducations` — `educations.json`

JSON array of education entries.

```json
[
  {
    "id": "string",
    "degree": "string",
    "institution": "string",
    "time": "string",
    "details": ["string", "..."],
    "visibility": { "web": true, "resume_print": true, "cv_print": true }
  }
]
```

---

### `resumeActivities` — `activities.json`

JSON array of extracurricular activities.

```json
[
  {
    "id": "string",
    "title": "string",
    "time": "string",
    "description": "string",
    "url": "url string | null",
    "details": ["string", "..."]
  }
]
```

Note: `url` is optional and can be `null`.

---

### `resumeInterests` — `interests.json`

Single-item JSON array. A flat list of interest keywords.

```json
[
  {
    "id": "interests",
    "items": ["string", "..."]
  }
]
```

---

### `resumeExperiences` — `experiences/*.md`

One `.md` file per job. Frontmatter holds metadata; the body is a bullet-point list of accomplishments.

```yaml
---
jobTitle: string
company: string
time: string        # e.g. 'Jul 2022 - Present'
visibility:
  web: true
  resume_print: true
  cv_print: true
---

- **Category**: Description of accomplishment.
```

To add a new experience: create `src/content/resume/<version>/experiences/<slug>.md` (e.g. `index/experiences/<slug>.md`).

---

### `resumeProjects` — `projects/*.md`

One `.md` file per project. Frontmatter holds metadata; the body is a bullet-point list of highlights.

```yaml
---
title: string
time: string         # e.g. '2025' or '2024-2025'
description: string  # short context label (e.g. 'Personal project')
url: url string | null
order: number        # optional — controls display order (lower = earlier)
visibility:
  web: true
  resume_print: true
  cv_print: true
---

- Project highlight or feature.
```

To add a new project: create `src/content/resume/<version>/projects/<slug>.md` (e.g. `index/projects/<slug>.md`).

---

## Scaffolding a new resume collection

If you need to add an entirely new collection (e.g. `resumeCertifications`):

### 1. Add the collection definition in `src/content/collection-definitions/resume.ts`

Use the versioned loaders from `resume-loaders.ts` (not `file()` / `glob()` directly) so the collection spans every Resume Version, and include `version` in the schema:

```ts
// For a JSON array file (src/content/resume/<version>/certifications.json):
export const resumeCertificationsCollection = defineCollection({
  loader: versionedResumeJson('certifications.json'),
  schema: z.object({
    version: versionSchema,
    title: z.string(),
    issuer: z.string(),
    time: z.string(),
    visibility: visibilitySchema.default({ web: true, resume_print: true, cv_print: true }),
  }),
})

// For one-file-per-entry markdown (src/content/resume/<version>/certifications/*.md):
export const resumeCertificationsCollection = defineCollection({
  loader: versionedResumeGlob('certifications'),
  schema: z.object({ version: versionSchema, ... }),
})
```

### 2. Register it in `src/content.config.ts`

```ts
import { resumeCertificationsCollection } from '@/content/collection-definitions/resume'
export const collections = {
  ...existingCollections,
  resumeCertifications: resumeCertificationsCollection,
}
```

### 3. Resolve it in `getResume()` — not in pages or section components

Add the collection to `loadAllSections()` in `src/lib/resume.ts` and a resolved field to the `Resume` interface using `resolveSection(entries, version)`, so it follows the whole-Section fallback rule. Pages and section components never call `getCollection('resume*')`; section components receive data as props.

### 4. Filter by visibility in the print page bodies

```astro
// components/resume/pages/ResumePrintPage.astro
const certifications = resume.certifications.filter((c) => c.data.visibility.resume_print)

// components/resume/pages/CvPrintPage.astro
const certifications = resume.certifications.filter((c) => c.data.visibility.cv_print)
```
