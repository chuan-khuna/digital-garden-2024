# How to Manage the Portfolio Page

The portfolio homepage is a **12-column bento grid** built in `src/pages/index.astro`. Personal content is sourced from `src/content/portfolio.ts`; layout is controlled by `colSpan`/`rowSpan` props on each `<Card>`.

---

## Data file — `src/content/portfolio.ts`

All personal content lives here. Edit this first for any content changes.

```ts
export const PORTFOLIO = {
  displayName: string,      // short name for display (e.g. 'ALTR')
  firstName: string,
  name: string,             // full legal name
  nickname: string,
  timezone: string,         // IANA timezone (e.g. 'Asia/Bangkok') — used by the live clock card
  avatarUrl: string,        // filename only (e.g. 'lucy.jpg') — file must exist in public/
  headLine: string,         // one-liner shown below the name in IntroCard
  shortIntros: string[],    // rotating intro lines (emoji + short phrase each)
  interests: string[],      // interest keywords shown in AboutMe card
  skills: string[],         // skill keywords shown in AboutMe card
}
```

> **Note:** Portfolio content is intentionally separate from resume data. What you show here is curated for a general audience — it does not need to match `resume/skills.json` exactly. Update each independently.

---

## Common content updates

### Change the headline or intro text
Edit `headLine` (one-liner under the name) or `shortIntros` (rotating list) in `portfolio.ts`.

### Add or remove a skill / interest
Edit the `skills` or `interests` arrays in `portfolio.ts`.

### Change the avatar
Replace the image file in `public/` and update `avatarUrl` in `portfolio.ts` to the new filename.

### Change the timezone shown on the clock card
Update `timezone` in `portfolio.ts` to a valid IANA string (e.g. `'Europe/London'`).

---

## Bento card components

Card components live in `src/components/bento/portfolio-bento/`. Each component reads from `PORTFOLIO` directly — they accept no personal-data props.

| Component | What it shows |
|-----------|--------------|
| `IntroCard.astro` | Avatar, name, headline, shortIntros |
| `AboutMe.astro` | Interests + skills from `PORTFOLIO` |
| `TimeZoneCard.astro` | Live clock — accepts optional `timezone` prop (defaults to visitor's local time) |
| `Lorem.astro` | Placeholder / projects card |
| `LoremSm.astro` | Smaller placeholder card |

---

## Adding a new bento card

1. Create `src/components/bento/portfolio-bento/YourCard.astro`
2. Import `PORTFOLIO` if you need data:
   ```ts
   import { PORTFOLIO } from '@/content/portfolio.ts'
   ```
3. In `src/pages/index.astro`, import and place inside a `<Card>` wrapper:
   ```astro
   import YourCard from '@/components/bento/portfolio-bento/YourCard.astro'

   <Card colSpan="lg:col-span-4 md:col-span-1" rowSpan="lg:row-span-2">
     <YourCard />
   </Card>
   ```

---

## Grid layout reference

The grid is **12 columns on `lg`**, 2 columns on `md`, 1 column on `sm`. Both `colSpan` and `rowSpan` accept Tailwind class strings and are set at the page level in `index.astro`.

| Logical size | `colSpan` value |
|---|---|
| Full width | `lg:col-span-12 md:col-span-2` |
| Three quarters | `lg:col-span-9 md:col-span-2` |
| Two thirds | `lg:col-span-8 md:col-span-2` |
| Half | `lg:col-span-6 md:col-span-1` |
| One third | `lg:col-span-4 md:col-span-1` |
| Quarter | `lg:col-span-3 md:col-span-1` |

Always pair `lg:col-span-*` with a `md:col-span-*` fallback.

### `<Card>` props

| Prop | Type | Purpose |
|------|------|---------|
| `colSpan` | Tailwind class string | Column width |
| `rowSpan` | Tailwind class string | Row height |
| `title` | string (optional) | Card header label |
| `href` | string (optional) | Makes the whole card a link |
| `colorText` | string (optional) | Text color override when `href` is set |
| `height` | string (optional) | Overrides default `h-full` |

---

## Theming

Card colors use OKLCH CSS variables — never hardcode hex/rgb. Use `var(--card)`, `var(--foreground)`, `var(--muted-foreground)`, `var(--accent)` etc. Theme variables are defined in `src/styles/presets/`.
