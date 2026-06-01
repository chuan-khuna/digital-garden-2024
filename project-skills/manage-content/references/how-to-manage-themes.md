# How to Manage Themes

Themes are CSS custom properties (OKLCH variables) toggled by a class on `<html>`. Theme registration is split between a CSS file, `src/styles/global.css`, and `src/data/site.config.ts`.

---

## How the system works

```
src/styles/theme_<name>.css   ← CSS variables scoped to .<name> class
    ↓ imported by
src/styles/global.css         ← loaded by all layouts
    ↓ registered in
src/data/site.config.ts       ← themes array drives ThemeToggle
    ↓ toggled by
src/components/ThemeToggle.astro
```

---

## Adding a new theme (3 steps)

### Step 1 — Create the CSS file

Create `src/styles/theme_<name>.css`. The class name must match the `preset` value you'll register.

Copy `theme_nzk.css` (light) or `theme_dark.css` (dark) as a starting point and adjust the palette variables.

Values are `lightness chroma hue` **without** the `oklch()` wrapper — `global.css` wraps them via `oklch(var(--variable))`.

### Step 2 — Import in `global.css`

```css
@import './theme_dark.css';
@import './theme_nexus.css';
@import './theme_nzk.css';
@import './theme_forest.css';   /* ← add here */
```

### Step 3 — Register in `src/data/site.config.ts`

```ts
export const themes = [
  // ...existing themes
  {
    preset: 'forest',         // must match the CSS class name exactly
    name: 'Forest',           // display name in the toggle
    default: false,
    syntaxTheme: 'catppuccin-latte',  // or 'catppuccin-macchiato' for dark themes
    icon: 'TreePine',         // PascalCase lucide-react export name
  },
] as const
```

Then add the icon to `ThemeToggle.astro`:

```ts
import { Sun, Moon, Flame, TreePine, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { Sun, Moon, Flame, TreePine }
```

> **Why named imports?** `import * as Icons from 'lucide-react'` breaks Astro's SSR renderer. Named imports + `ICON_MAP` is the correct pattern.

Browse icon names at [lucide.dev](https://lucide.dev/).

---

## Required CSS variables

Every theme must define all of these:

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

## Current themes

| preset  | name   | default | syntaxTheme           |
|---------|--------|---------|-----------------------|
| `nzk`   | Light  | yes     | catppuccin-latte      |
| `dark`  | Dark   | no      | catppuccin-macchiato  |
| `nexus` | Nexus  | no      | catppuccin-macchiato  |

---

## Troubleshooting

- **Theme not showing:** CSS class name must match `preset` exactly (e.g. `.forest` for `'forest'`). Check the `@import` is in `global.css`.
- **Toggle button missing:** Verify `icon` is a valid PascalCase lucide export and is added to both the named import and `ICON_MAP` in `ThemeToggle.astro`.
- **Colours wrong:** Values must be `L C H` without `oklch()` wrapper. Order: lightness (0–1), chroma (0–0.4), hue (0–360).
