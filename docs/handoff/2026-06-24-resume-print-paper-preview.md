# Handoff — Paper-Simulating Web Preview for Resume/CV Print Pages

- **Date:** 2026-06-24
- **For:** `developer` agent (owns Astro components, layout, themes, print)
- **PRD:** `docs/artifacts/prd/2026-06-24-resume-print-paper-preview.md`
- **Status:** Ready to implement. Design fully agreed; no code written yet.

---

## TL;DR

Turn the web view of `resume-print.astro` / `cv-print.astro` into a faithful PDF
preview: white A4 sheets on a gray canvas, uniformly scaled up for readability,
fixed A4 height with visible overflow, sheets always white-paper/dark-ink. **Print
output must stay exactly as it is today.** All changes are shared layout components,
so both pages are covered at once.

## Current state (verified)

| File | Role today | Notes |
|------|-----------|-------|
| `src/pages/resume-print.astro` | Single A4 page | `max-w-[1200px]` (wider than A4), no page break |
| `src/pages/cv-print.astro` | 2 pages | Uses `PrintPageBreak`, same `max-w-[1200px]` |
| `src/components/resume/layout/WebWrapper.astro` | Bare centering div | → becomes the **gray canvas** |
| `src/components/resume/layout/PageLayout.astro` | Bare padded div ("a physical paper page") | → becomes the **A4 sheet** |
| `src/components/resume/PrintPageBreak.astro` | `page-break-after: always` + visible "PAGE BREAK" text | Keep print break; drop the web text label |
| `src/styles/print.css` | `@media print { @page { size: a4; margin: 0 } }` | Imported by `globals.css`. **Do not weaken.** |
| `src/layouts/BaseLayoutPrint.astro` | Hides nav/footer in print; `print:px-0/pb-0/pt-0` | Body is `bg-background text-foreground` |

## Critical gotchas

1. **Dark-mode foreground inheritance (R6).** Tailwind dark variant is
   `@custom-variant dark (&:is(.dark *))` and `body { @apply bg-background text-foreground }`.
   In dark mode `--foreground` is *light* (oklch ~0.83). A plain white background on the
   sheet is **not enough** — inherited `text-foreground` content would be light-on-white
   (invisible). **Fix:** on the sheet element, re-declare the **light-theme tokens**
   (`--foreground`, `--card-foreground`, etc. with their `:root`/light values) and set
   `color-scheme: light`, so the whole subtree resolves to dark ink. Good news: only
   **one** `dark:` class exists in the entire resume tree — in `PrintPageBreak`, which is
   being changed anyway — so content is otherwise theme-agnostic dark ink.

2. **Uniform scaling only (R2).** Achieve readability via `zoom` (or `transform: scale`),
   NOT by widening the box. Widening reflows text and makes page-fit untruthful. If using
   `transform: scale`, reserve layout space for the scaled box; if using `zoom`, verify
   print resets it to `1`. Prefer scoping the scale to `@media screen` so print never sees it.

3. **Print must be untouched (R7).** Put ALL simulation chrome (canvas bg, shadow, zoom,
   `width:210mm`, `min-height:297mm`, gaps, `overflow:visible`) under `@media screen`.
   Verify `Ctrl+P` of both pages matches today (A4, margin 0, no canvas/shadow).

## Suggested implementation

1. **`PageLayout.astro` → A4 sheet:** under `@media screen`, `width:210mm; min-height:297mm;`
   white bg, light-token re-declaration (gotcha #1), drop shadow, `overflow:visible`.
   Keep existing per-page padding classes (`px-8/px-12 py-4`). Print path = plain block flow.
2. **`WebWrapper.astro` → gray canvas:** under `@media screen`, theme-reactive gray
   backdrop, vertical stack + center, gap between sheets, and the responsive zoom
   (fit-to-viewport-width up to ~1.25× desktop max — R5). Print path = transparent passthrough.
3. **`PrintPageBreak.astro`:** keep the `page-break-after: always` div; remove/`print`-only
   the "PAGE BREAK" text; on screen render just transparent spacing (sheets already separate).
4. Consider a dedicated `@media screen`-scoped stylesheet (e.g. a `resume-page.css` or a
   scoped `<style>`) for the sheet/canvas/light-token rules to keep `print.css` minimal.

## Defaults to apply (tweakable)

- Desktop zoom target ~`1.25×` (≈ 990px effective width).
- Canvas gray: a neutral that reads in both themes.

## Definition of done

Use the PRD §5 acceptance checklist. Especially: (a) over-long resume visibly overflows
the sheet bottom, (b) `cv-print` shows two gapped sheets, (c) narrow viewport shrinks to
fit, (d) dark-mode sheet stays white/dark-ink, (e) **`Ctrl+P` identical to current output**.

## Out of scope

Content/schema/data changes; any change to printed appearance.
