---
title: Bento Grid
tags:
aliases:
  - Homepage
  - Bento Homepage
  - Bento Cards
---

# Bento Grid

The homepage (`src/pages/index.astro`) is a responsive bento grid of cards, each card being an independent Astro component.

---

## Layout

```
Tailwind grid:  md:grid-cols-2  lg:grid-cols-12
```

Each card declares its own column/row span via props on the `<Card>` wrapper.

---

## Card Wrapper

**File:** `src/components/bento/card.astro`

| Prop | Type | Purpose |
|---|---|---|
| `colSpan` | string | Tailwind `col-span-*` class (e.g. `lg:col-span-4`) |
| `rowSpan` | string | Tailwind `row-span-*` class |
| `title` | string (optional) | Card heading |

---

## Adding a Card

1. Create `src/components/bento/portfolio-bento/YourCard.astro`
2. Import in `src/pages/index.astro`
3. Wrap with `<Card colSpan="lg:col-span-X" rowSpan="...">`

---

## Existing Cards

**Directory:** `src/components/bento/portfolio-bento/`

| Card | Purpose |
|---|---|
| `IntroCard.astro` | Name, tagline, intro text |
| `AboutMe.astro` | Short bio |
| `TimeZoneCard.astro` | Displays user's current timezone |
| `nowtime.tsx` | Live clock (React, `client:load`) |

> [!info] React cards
> Cards that need live data or browser APIs use React with a `client:*` directive. `nowtime.tsx` uses `client:load` because it renders the current time immediately on page load.

---

## Related

- [[Project Structure]] — `src/components/bento/` directory layout
