# Site Configuration

The project uses **three separate data sources** for personal content. They are intentionally decoupled — each serves a different audience and rendering context.

---

## 1. `src/content/site.config.ts` — Site Identity

The single source of truth for identity/metadata shared across **every page**.

```typescript
export const SITE = {
  displayName: 'ALTR',
  siteTitle: "ALTR's Digital Garden",
  github: 'https://github.com/chuan-khuna',
}
```

**Used by:**
- `<title>` tags in `BaseLayout.astro` and `BaseLayoutPrint.astro`
- `Footer.astro` — display name + GitHub link
- OG image generation (`src/lib/og-image/`)
- Any component that needs the site name or owner identity

**Rule:** If something appears on every page and identifies the site or its owner, it belongs here.

---

## 2. `src/content/portfolio.ts` — Bento Homepage

Content for the **homepage bento grid** (`/`). Richer personal data — intro copy, avatar, interests, tech skills.

```typescript
export const PORTFOLIO = {
  displayName: 'ALTR',
  firstName: 'Phattharanat',
  name: 'Phattharanat Khunakornophat',
  nickname: 'Chuan',
  timezone: 'Asia/Bangkok',
  avatarUrl: 'lucy.jpg',          // filename in /public
  headLine: '...',
  shortIntros: [...],             // rotating intro lines
  interests: [...],               // topic interests
  skills: [...],                  // tech skills for tag cloud
}
```

**Used by:**
- `src/pages/index.astro` → bento card components in `src/components/bento/portfolio-bento/`
- `IntroCard.astro`, `AboutMe.astro`, `TimeZoneCard.astro`, etc.

**Rule:** Content that only appears on the homepage bento grid lives here. It does **not** need to match the resume data exactly — the homepage is a personal brand surface, the resume is a professional document.

---

## 3. `src/content/resume/` — Resume Content Collections

Structured data for the resume pages (`/resume`, `/resume-print`, `/cv-print`, and the per-version `/resume-print/<version>`, `/cv-print/<version>`). Uses **Astro Content Collections** (JSON files + markdown entries), organised into one folder per **Resume Version**. `index` is the Default Version; see `docs/architecture/resume-system.md` and `docs/content/resume.md`.

```
src/content/resume/
  index/                 ← Default Version
    header.json          ← name, contact info, location
    skills.json          ← skill groups
    interests.json       ← interest list
    now.json             ← "what I'm doing now" (web-only; Default Version only)
    activities.json      ← activities / volunteering
    educations.json      ← degrees
    experiences/         ← job entries (.md files with frontmatter)
    projects/            ← project entries (.md files with frontmatter)
  <version>/             ← a Resume Version: only the Sections it overrides
```

Projects, experiences and educations support a `visibility` field to control which pages include them:

```json
{
  "visibility": {
    "web": true,
    "resume_print": true,
    "cv_print": true
  }
}
```

**Used by** (all read through `getResume(surface, version)` in `src/lib/resume.ts`, which applies the filter):
- `src/pages/resume.astro` — Default Version; `visibility.web`
- `src/pages/resume-print/index.astro`, `src/pages/resume-print/[version].astro` — `visibility.resume_print`
- `src/pages/cv-print/index.astro`, `src/pages/cv-print/[version].astro` — `visibility.cv_print`

**Rule:** Any content that belongs on the resume (professional history, education, projects) lives here, not in `portfolio.ts`.

---

## Why Three Sources?

| Concern | site.config.ts | portfolio.ts | resume/ |
|---|---|---|---|
| Audience | Every visitor | Homepage visitor | Recruiter / HR |
| Format | Single TS object | Single TS object | Astro collections (JSON + MD) |
| Rendered by | Layouts, Footer, OG | Bento grid components | Resume page components |
| Visibility filtering | N/A | N/A | Per-entry, per-page |

**Identity** (`displayName`, `siteTitle`) lives in `site.config.ts` and is referenced from `portfolio.ts` as a loose copy — there is a known minor duplication (tracked as open issue in Architecture Analysis).

---

## Adding New Content

| What you want to add | Where |
|---|---|
| Change the site title or GitHub link | `site.config.ts` |
| Update homepage intro, skills tag cloud, avatar | `portfolio.ts` |
| Add a new job or project to the resume | `src/content/resume/index/experiences/` or `index/projects/` |
| Hide a resume entry from print | Set `visibility.resume_print: false` in the entry |
| Add a new resume section entirely | Add JSON/collection, create a section component in `sections/`, update the 3 resume pages |
