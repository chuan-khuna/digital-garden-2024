---
title: Adding a Theme
tags:
aliases:
---

# Adding a Theme

The theming system is built on **CSS custom properties (variables)** in OKLCH colour format, toggled by a class on `<html>`. Adding a new theme requires three steps: create a CSS file, import it, and register it in the toggle component.

**Useful tools:**
- [tweakcn theme editor](https://tweakcn.com/editor/theme?p=custom) — visual OKLCH theme builder
- [OKLCH colour picker](https://oklch.com/) — pick and preview OKLCH values

---

## How the System Works

```
theme_<name>.css          ← defines CSS variables under .<name> class
    ↓ imported by
src/styles/global.css     ← loaded by all layout files
    ↓ applied by
ThemeToggle.astro         ← adds/removes the class on <html>, persists to localStorage
```

`global.css` is imported in three layout files:
- `src/layouts/BaseLayout.astro`
- `src/layouts/BaseLayoutPrint.astro`
- `src/layouts/PostLayout.astro`

---

## Step 1 — Create the CSS Theme File

Create `src/styles/theme_<name>.css`. The class name **must match** the theme name.

Example for a `forest` theme:

```css
.forest {
  /* Palette — define base colours here */
  --palette-background: 0.95 0.04 142;
  --palette-foreground: 0.35 0.08 142;
  --palette-primary:    0.55 0.12 152;

  /* Semantic mappings */
  --background:            var(--palette-background);
  --foreground:            var(--palette-foreground);
  --card:                  var(--palette-background);
  --card-foreground:       var(--palette-foreground);
  --popover:               var(--palette-background);
  --popover-foreground:    var(--palette-foreground);
  --primary:               var(--palette-primary);
  --primary-foreground:    0.98 0.02 142;
  --secondary:             0.75 0.15 110;
  --secondary-foreground:  var(--palette-primary);
  --muted:                 0.88 0.03 142;
  --muted-foreground:      0.55 0.06 142;
  --accent:                0.72 0.18 105;
  --accent-foreground:     var(--palette-primary);
  --destructive:           0.62 0.22 25;
  --destructive-foreground: 0.98 0.01 247;
  --border:                0.85 0.04 142;
  --input:                 0.85 0.04 142;
  --ring:                  0.35 0.08 142;
  --radius:                0.5rem;

  /* Custom variables (used by markdown/prose content) */
  --theme-bg:       0.95 0.04 142;
  --theme-link:     0.58 0.12 152;
  --theme-text:     0.35 0.08 142;
  --theme-accent:   0.75 0.15 110;
  --theme-accent-2: 0.55 0.12 152;
  --theme-quote:    0.72 0.18 105;
}
```

> [!info] OKLCH format
> Values are written as `lightness chroma hue` **without** the `oklch()` wrapper, because `global.css` wraps them: `oklch(var(--background))`.
>
> - **Lightness:** 0–1 (0 = black, 1 = white)
> - **Chroma:** 0–0.4 (saturation; 0 = grey)
> - **Hue:** 0–360 (colour angle)

> [!tip] Quick start
> Copy `src/styles/theme_nzk.css` (light) or `theme_dark.css` (dark) and adjust the palette variables — you only need to change 3–5 values to get a coherent theme.

---

## Step 2 — Import in Global CSS

Add an `@import` line to `src/styles/global.css`:

```css
@import './fonts.css';
@import './theme_dark.css';
@import './theme_nexus.css';
@import './theme_nzk.css';
@import './theme_forest.css';   /* ← add here */
@import './global_print.css';
```

---

## Step 3 — Register in `site.config.ts`

All theme registration now lives in `src/data/site.config.ts`. Add an entry to the `themes` array:

```ts
export const themes = [
  // ...existing themes
  {
    preset: 'forest',   // must match the CSS class name
    name: 'Forest',     // display name
    default: false,
    syntaxTheme: 'catppuccin-latte',
    icon: 'TreePine',   // PascalCase lucide-react export name
  },
]
```

Browse icons at [lucide.dev](https://lucide.dev/).

**Then add the named import to `ThemeToggle.astro`:**

```ts
import { Sun, Moon, Flame, TreePine, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { Sun, Moon, Flame, TreePine }
```

> [!info] Why named imports?
> `import * as Icons from 'lucide-react'` breaks Astro's SSR renderer because the namespace includes non-component exports. Named imports + `ICON_MAP` is the correct pattern here.

---

## Required CSS Variables Reference

All themes must define these variables:

| Variable | Purpose |
|---|---|
| `--background` / `--foreground` | Page background and body text |
| `--card` / `--card-foreground` | Card components |
| `--popover` / `--popover-foreground` | Popover / dropdown |
| `--primary` / `--primary-foreground` | Primary buttons and accents |
| `--secondary` / `--secondary-foreground` | Secondary elements |
| `--muted` / `--muted-foreground` | Disabled / subdued elements |
| `--accent` / `--accent-foreground` | Accent highlights |
| `--destructive` / `--destructive-foreground` | Error / delete actions |
| `--border` | Border colour |
| `--input` | Input field border |
| `--ring` | Focus ring |
| `--radius` | Component border radius |
| `--theme-bg` | Markdown background |
| `--theme-link` | Markdown link colour |
| `--theme-text` | Markdown text |
| `--theme-accent` | Markdown primary accent |
| `--theme-accent-2` | Markdown secondary accent |
| `--theme-quote` | Markdown blockquote colour |

---

## Troubleshooting

> [!warning] Theme not showing up
> - Check the CSS file is imported in `global.css`
> - Verify the class name in the CSS file matches `preset` exactly (e.g. `.forest` for `'forest'`)
> - Ensure the entry is in the `themes` array in `src/data/site.config.ts`

> [!warning] Theme button not appearing
> - Check the button `id` follows the pattern `<preset>Button` (auto-generated from `THEME_CONFIG`)
> - Verify the `icon` string matches a PascalCase lucide export (e.g. `'TreePine'`, not `'tree-pine'`)
> - Verify the icon is added to both the named import and `ICON_MAP` in `ThemeToggle.astro`
> - Restart the dev server

> [!bug] Colours look wrong
> - Values must be in OKLCH format **without** `oklch()` wrapper
> - Order is: lightness (0–1), chroma (0–0.4), hue (0–360)
> - Inspect computed CSS variables in browser DevTools
> - Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify readability

---

## Related

- [[OG Image Generator]] — OG themes are a separate concept from site colour themes
