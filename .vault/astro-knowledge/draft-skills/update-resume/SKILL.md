---
name: update-resume
description: Guide for updating resume content in an Astro project — editing JSON data files, adding new experiences as markdown, and adjusting visibility for web vs print versions.
---

# Update Resume

Reference for updating resume content stored as Astro Content Collections under `src/content/resume/`.

---

## File Map

| What to update | File |
|---|---|
| Name, job title, contact, links | `src/content/resume/header.json` |
| Skill categories and keywords | `src/content/resume/skills.json` |
| Projects | `src/content/resume/projects.json` |
| Education | `src/content/resume/educations.json` |
| Interests | `src/content/resume/interests.json` |
| Work experience | `src/content/resume/experiences/<slug>.md` |

---

## Adding a New Work Experience

Create a new `.md` file in `src/content/resume/experiences/`:

```md
---
company: Company Name
role: Your Role
startDate: '2024-01'
endDate: '2025-03'        # omit if current role
visibility:
  web: true
  resume_print: true
---

- Achieved X by doing Y, resulting in Z
- Led a team of N to deliver ...
- Built a system that ...
```

Use **UK date format** for display: `Jan 2024 – Mar 2025`.

Bullet points in the body become the experience description on the resume. Keep them achievement-focused and concise.

---

## Visibility Control

Each entry has a `visibility` field controlling where it appears:

```json
"visibility": { "web": true, "resume_print": false }
```

- `web: true` — shows on the `/resume` web page
- `resume_print: true` — shows on the `/resume-print` PDF page

Use this to tailor the print resume without removing entries from the web version. For example, you may want all experiences visible on the web but only the most recent 3–4 on the printed page.

> **Note:** Resume content is intentionally separate from portfolio data. What you list here is comprehensive and may be filtered per job application — it does not need to match the portfolio page.

---

## Updating Skills

Edit `src/content/resume/skills.json`. Structure as categories with keyword lists:

```json
[
  {
    "category": "Languages",
    "keywords": ["Python", "TypeScript", "SQL"]
  },
  {
    "category": "Tools",
    "keywords": ["dbt", "Airflow", "Docker"]
  }
]
```

These are separate from the portfolio skills list in `portfolio.ts`. Update each independently based on what's relevant for that audience.

---

## Updating Projects

Edit `src/content/resume/projects.json`. Each entry should have:

```json
{
  "name": "Project Name",
  "description": "One-line description of what it does and the impact.",
  "url": "https://github.com/you/project",
  "visibility": { "web": true, "resume_print": true }
}
```

---

## After Editing

- Run `npm run dev` (or `bun dev`) and check `/resume` for the web view
- Check `/resume-print` for the print layout — this is what becomes the PDF
- Use browser `Ctrl+P` / `Cmd+P` on `/resume-print` to save as PDF

---

## Date Formatting

Use **UK date format** throughout: `DD MMM YYYY` or `MMM YYYY` for month-only dates.  
Examples: `01 Jan 2024`, `Mar 2023 – Present`
