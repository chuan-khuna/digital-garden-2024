---
name: setup-portfolio-page
description: Scaffold a portfolio landing page in an Astro project using a bento grid layout, Tailwind CSS, OKLCH theming, and shadcn/ui components. Creates the data config file and homepage with card-based layout.
---

# Setup Portfolio Page

Scaffold a **bento grid portfolio landing page** in an existing Astro project. Assumes Tailwind CSS v4, OKLCH CSS variables for theming, and shadcn/ui primitives are already installed.

---

## What This Skill Creates

1. `src/content/portfolio.ts` — typed data config (name, avatar, bio, links, skills, interests)
2. `src/pages/index.astro` — homepage using a 12-column bento grid
3. `src/components/bento/card.astro` — reusable card wrapper with `colSpan` / `rowSpan` props
4. `src/components/bento/portfolio-bento/` — individual card components (intro, about, links, etc.)

---

## Data Structure

Create `src/content/portfolio.ts` with a typed `PORTFOLIO` export:

```ts
export const PORTFOLIO = {
  name: 'Your Name',
  jobTitle: 'Your Job Title',
  bio: 'Short bio shown on the intro card.',
  avatarUrl: '/avatar.jpg',
  links: [
    { label: 'GitHub', url: 'https://github.com/you' },
    { label: 'Email', url: 'mailto:you@example.com' },
  ],
  skills: ['TypeScript', 'Python', 'Astro'],
  interests: ['Music', 'Coffee', 'Open Source'],
} as const
```

> **Design note:** `portfolio.ts` is intentionally separate from resume data. Portfolio content is curated for a general audience; resume content is tailored per application. Do not merge them into a single source.

---

## Bento Grid Layout

The homepage uses a **12-column CSS grid** with responsive breakpoints:

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
  <Card colSpan="lg:col-span-8" rowSpan="row-span-2" title="Intro">
    <IntroCard />
  </Card>
  <Card colSpan="lg:col-span-4" title="About">
    <AboutCard />
  </Card>
  <!-- Add more cards here -->
</div>
```

`card.astro` accepts `colSpan` and `rowSpan` as Tailwind class strings so the grid layout is controlled at the page level, not inside each card.

---

## Card Components

Each card in `src/components/bento/portfolio-bento/` should:
- Import data from `PORTFOLIO` (no hardcoded personal content)
- Be self-contained — receive no props beyond what they need from the global config
- Use OKLCH CSS variables for color (`var(--color-card)`, `var(--color-foreground)`, etc.)

Suggested starter cards:
- `IntroCard.astro` — name, avatar, job title, bio
- `LinksCard.astro` — social/contact links
- `SkillsCard.astro` — skills list or tag cloud
- `NowCard.astro` — what you're currently working on

---

## Theming

Colors must use OKLCH CSS variables, not hardcoded hex/rgb values:

```css
/* Example usage */
background-color: oklch(var(--background));
color: oklch(var(--foreground));
```

Theme variables are defined per-theme in `src/styles/theme_*.css` and applied via a class on `<html>`.

---

## Checklist

- [ ] `src/content/portfolio.ts` created with `PORTFOLIO` export
- [ ] `src/pages/index.astro` uses 12-column bento grid
- [ ] `src/components/bento/card.astro` accepts `colSpan`, `rowSpan`, `title` props
- [ ] All card text content reads from `PORTFOLIO` (no hardcoded strings)
- [ ] Colors use OKLCH CSS variables throughout
- [ ] `IntroCard` uses Astro `<Image>` component (not plain `<img>`)
