---
name: update-portfolio
description: Guide for updating portfolio content in an Astro project — editing the PORTFOLIO data config, adding or modifying bento cards, and adjusting the homepage grid layout.
---

# Update Portfolio

Reference for updating the portfolio landing page content and layout.

---

## Data File

All personal content lives in **`src/content/portfolio.ts`**. Edit this file first for any content changes.

```ts
export const PORTFOLIO = {
  name: 'Your Name',
  jobTitle: 'Your Job Title',
  bio: 'Short bio for the intro card.',
  avatarUrl: '/avatar.jpg',
  links: [
    { label: 'GitHub', url: 'https://github.com/you' },
    { label: 'Email', url: 'mailto:you@example.com' },
  ],
  skills: ['TypeScript', 'Python', 'Astro'],
  interests: ['Music', 'Coffee', 'Open Source'],
}
```

> **Note:** Portfolio content is intentionally separate from resume data. What you show here is curated for a general audience — it does not need to match the resume exactly.

---

## Common Updates

### Change bio or intro text
Edit `bio` in `portfolio.ts`. The `IntroCard` component reads from this field.

### Add or remove a link
Edit the `links` array in `portfolio.ts`. Each link needs `label` and `url`.

### Update skills or interests
Edit the `skills` or `interests` arrays in `portfolio.ts`. These are intentionally independent from `resume/skills.json` — update each separately based on what's relevant for that audience.

### Change avatar
Replace the image file and update `avatarUrl` in `portfolio.ts`. Use Astro's `<Image>` component in `IntroCard.astro` for optimised output.

---

## Adding a New Bento Card

1. Create `src/components/bento/portfolio-bento/YourCard.astro`
2. Import `PORTFOLIO` if you need data: `import { PORTFOLIO } from '@/content/portfolio'`
3. In `src/pages/index.astro`, import and add the card inside a `<Card>` wrapper:

```astro
<Card colSpan="lg:col-span-4" title="Your Section">
  <YourCard />
</Card>
```

`colSpan` and `rowSpan` accept Tailwind class strings. The grid is 12 columns on large screens.

---

## Adjusting Layout

The bento grid is defined in `src/pages/index.astro`. Change `colSpan` / `rowSpan` on `<Card>` to reflow the layout:

| Size | `colSpan` value |
|------|----------------|
| Full width | `lg:col-span-12` |
| Two thirds | `lg:col-span-8` |
| Half | `lg:col-span-6` |
| One third | `lg:col-span-4` |
| Quarter | `lg:col-span-3` |

---

## Theming

Cards use OKLCH CSS variables — do not hardcode colors. Use `var(--color-card)`, `var(--color-foreground)`, `var(--color-muted)` etc. Theme variables are defined in `src/styles/theme_*.css`.
