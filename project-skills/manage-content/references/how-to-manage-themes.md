# How to Manage Themes

Themes are CSS custom properties (OKLCH variables) toggled by a `data-color-preset` attribute on `<html>`. Theme registration is split between a CSS preset file, `src/styles/globals.css`, and `src/data/site.config.ts`.

---

## How the system works

```
src/styles/presets/<name>.css     ← CSS variables scoped to :root[data-color-preset='<name>']
    ↓ imported by
src/styles/globals.css            ← loaded by all layouts
    ↓ registered in
src/data/site.config.ts           ← themes array drives ThemeToggle
    ↓ toggled by
src/components/ThemeToggle.astro  ← sets data-color-preset on <html>, persists to localStorage
```

---

## Adding a new theme (3 steps)

### Step 1 — Create the CSS file

Create `src/styles/presets/<name>.css`. The `data-color-preset` value must match the `preset` key you register.

Copy `presets/nzk.css` (light) or `presets/dark.css` (dark) as a starting point and adjust the values.

Values use the full `oklch()` wrapper, e.g. `oklch(0.977 0.0085 84.57)`.

### Step 2 — Import in `globals.css`

```css
@import './presets/nzk.css';
@import './presets/dark.css';
@import './presets/nexus.css';
@import './presets/forest.css';   /* ← add here */
```

### Step 3 — Register in `src/data/site.config.ts`

```ts
export const themes = [
  // ...existing themes
  {
    preset: 'forest',         // must match the data-color-preset value exactly
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

- **Theme not showing:** The `data-color-preset` value in the CSS selector must match `preset` exactly (e.g. `data-color-preset='forest'` for `'forest'`). Check the `@import` is in `globals.css`.
- **Toggle button missing:** Verify `icon` is a valid PascalCase lucide export and is added to both the named import and `ICON_MAP` in `ThemeToggle.astro`.
- **Colours wrong:** Values must use the full `oklch()` wrapper. Order: lightness (0–1), chroma (0–0.4), hue (0–360).
