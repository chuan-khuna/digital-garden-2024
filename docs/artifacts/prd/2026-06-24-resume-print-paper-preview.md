# PRD — Paper-Simulating Web Preview for Resume/CV Print Pages

- **Date:** 2026-06-24
- **Status:** Approved (design agreed via grilling session) — not yet implemented
- **Owner:** developer agent (visual/layout layer)
- **Pages affected:** `src/pages/resume-print.astro`, `src/pages/cv-print.astro`

---

## 1. Problem

`resume-print.astro` and `cv-print.astro` are tuned for A4 print output, but their
**web view does not represent the printed page**:

- Web content is centered at `max-w-[1200px]` — *wider* than A4, so what you see on
  screen does not match what prints.
- There is no visible page boundary, so you cannot tell whether a one-page resume
  actually fits on one sheet.
- `cv-print` shows a literal `PAGE BREAK` text divider instead of distinct sheets.

## 2. Goal

Make the **web view a faithful "PDF-preview" of the printed page** — comfortable to
read on screen — while leaving the `Ctrl+P` print output **byte-for-byte unchanged**.

### Non-goals
- No change to print output, `@page` rules, or print color/layout.
- No change to resume/CV *content*, schemas, or data.
- No reflow-based "readable" web layout — fidelity to print takes priority.

## 3. Requirements

| # | Requirement |
|---|-------------|
| R1 | Web view renders each page as a **white A4 sheet** (true 210:297 ratio) on a gray canvas with a drop shadow — a PDF-preview look. |
| R2 | The sheet is **uniformly scaled up** (zoom/transform) for readable text. Scaling MUST be uniform — never widen the box — so line breaks and page-fit match print exactly. |
| R3 | Each sheet has **fixed A4 height (297mm)**. Content that overflows **spills past the bottom edge** onto the canvas as a visible "won't fit one page" warning (no clipping/hiding). |
| R4 | `cv-print`'s pages render as **separate stacked sheets with a gap** between them. The `PAGE BREAK` text label is removed from the web view. |
| R5 | On screens narrower than the sheet, the sheet **scales down to fit the viewport width** — no horizontal scrolling; the sheet is always fully visible. |
| R6 | The sheet always renders in **print colors: white paper, dark ink**, regardless of the site's light/dark theme. Only the surrounding canvas reacts to theme. |
| R7 | **Print output is unchanged.** All simulation chrome (canvas, shadow, zoom, fixed height, gaps) lives under `@media screen` only; `@page { size: a4; margin: 0 }` and existing `print:` resets stay intact. |

## 4. Key design decisions (from grilling session)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Preview model | Zoomed A4 sheet | Best balances "simulate paper bounds" + "readable on web" |
| Page height | Fixed A4 + visible overflow | Surfaces page-fit problems for one-page resume tuning |
| Page break (cv) | Two stacked sheets + gap | Matches real PDF/Google-Docs preview |
| Responsive | Shrink-to-fit width | Usable on mobile, sheet always visible |
| Sheet colors | Always print colors | True WYSIWYG of the printed result |
| Scaling | Uniform only (never widen) | Widening reflows text → preview would lie about fit |
| Print safety | `@media screen` scoping | Hard guarantee `Ctrl+P` is unchanged |

## 5. Acceptance criteria

- [ ] On web, both pages show white A4 sheet(s) on a gray canvas with shadow.
- [ ] Text on the sheet is comfortably readable on a desktop viewport.
- [ ] An over-long resume visibly overflows the sheet's bottom edge.
- [ ] `cv-print` shows two distinct sheets with a gap, no "PAGE BREAK" text.
- [ ] On a narrow/phone viewport, the sheet shrinks to fit — no horizontal scroll.
- [ ] In site dark mode, the sheet stays white with dark ink; canvas is dark gray.
- [ ] `Ctrl+P` preview of both pages is identical to the current output (A4, margin 0).

## 6. Open knobs (defaults, tweakable)

- Desktop zoom target: ~`1.25×` (≈ 990px effective sheet width).
- Canvas gray shade: a neutral that reads in both light and dark themes.
