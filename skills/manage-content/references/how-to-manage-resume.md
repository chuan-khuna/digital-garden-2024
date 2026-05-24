# How to Manage Resume Content

All resume data lives in `src/content/resume/`. Changes apply to both the web resume (`/resume`) and print layouts (`/resume-print`, `/cv-print`).

Schema definitions: `src/content/collection-definitions/resume.ts`

---

## Visibility field (shared by most collections)

Many resume collections have a `visibility` object that controls which pages the entry appears on:

```json
"visibility": {
  "web": true,
  "resume_print": true,
  "cv_print": true
}
```

Default is `true` for all three. Set to `false` to hide from a specific layout.

---

## Collections

### `resumeHeader` — `src/content/resume/header.json`

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

### `resumeNow` — `src/content/resume/now.json`

Single-item JSON array. The "what I'm doing now" section.

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

### `resumeSkills` — `src/content/resume/skills.json`

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

### `resumeEducations` — `src/content/resume/educations.json`

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

### `resumeActivities` — `src/content/resume/activities.json`

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

### `resumeInterests` — `src/content/resume/interests.json`

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

### `resumeExperiences` — `src/content/resume/experiences/*.md`

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

To add a new experience: create `src/content/resume/experiences/<slug>.md`.

---

### `resumeProjects` — `src/content/resume/projects/*.md`

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

To add a new project: create `src/content/resume/projects/<slug>.md`.
