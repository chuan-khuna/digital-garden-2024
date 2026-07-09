# Adding a Theme

The theming system is built on **CSS custom properties** in OKLCH colour format, toggled by a `data-color-preset` attribute on `<html>`. Adding a new theme requires three steps: create a CSS preset file, import it, and register it in `site.config.ts`.

**Useful tools:**

- [tweakcn theme editor](https://tweakcn.com/editor/theme?p=custom) — visual OKLCH theme builder
- [OKLCH colour picker](https://oklch.com/) — pick and preview OKLCH values

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

`globals.css` is imported by all three layout files: `BaseLayout.astro`, `BaseLayoutPrint.astro`, `PostLayout.astro`.

---

## Step 1 — Create the CSS preset file

Create `src/styles/presets/<name>.css`. The `data-color-preset` value **must match** the `preset` key you register in step 3. All colours use the full `oklch()` wrapper — never hardcode hex or rgb.

Copy `presets/nzk.css` (light) or `presets/dark.css` (dark) as a starting point; you usually only need to change 3–5 values for a coherent theme. Aim for WCAG AA contrast (≥ 4.5:1 for body text).

Example for a `forest` theme:

```css
:root[data-color-preset='forest'] {
  --background: oklch(0.95 0.04 142);
  --foreground: oklch(0.35 0.08 142);

  --card: oklch(0.95 0.04 142);
  --card-foreground: oklch(0.35 0.08 142);

  --popover: oklch(0.95 0.04 142);
  --popover-foreground: oklch(0.35 0.08 142);

  --primary: oklch(0.55 0.12 152);
  --primary-foreground: oklch(0.98 0.02 142);

  --secondary: oklch(0.75 0.15 110);
  --secondary-foreground: oklch(0.55 0.12 152);

  --muted: oklch(0.88 0.03 142);
  --muted-foreground: oklch(0.55 0.06 142);

  --accent: oklch(0.72 0.18 105);
  --accent-foreground: oklch(0.35 0.08 142);

  --destructive: oklch(0.62 0.22 25);
  --destructive-foreground: oklch(0.98 0.01 247);

  --border: oklch(0.85 0.04 142);
  --input: oklch(0.85 0.04 142);
  --ring: oklch(0.35 0.08 142);

  --radius: 0.5rem;

  --theme-bg: oklch(0.95 0.04 142);
  --theme-link: oklch(0.58 0.12 152);
  --theme-text: oklch(0.35 0.08 142);
  --theme-accent: oklch(0.75 0.15 110);
  --theme-accent-2: oklch(0.55 0.12 152);
  --theme-quote: oklch(0.72 0.18 105);
}
```

> **OKLCH format** — values use the full `oklch()` wrapper. Lightness 0–1 (0 = black, 1 = white) · Chroma 0–0.4 (0 = grey) · Hue 0–360 (colour angle).

---

## Step 2 — Import in `globals.css`

Add an `@import` line to `src/styles/globals.css` alongside the other presets:

```css
@import './fonts.css';
@import './presets/nzk.css';
@import './presets/dark.css';
@import './presets/nexus.css';
@import './presets/forest.css'; /* ← add here */
@import './print.css';
```

---

## Step 3 — Register in `site.config.ts`

All theme registration lives in `src/data/site.config.ts`. Add an entry to the `themes` array:

```ts
export const themes = [
  // ...existing themes
  {
    preset: 'forest', // must match the data-color-preset value exactly
    name: 'Forest', // display name in the toggle
    default: false,
    syntaxTheme: 'catppuccin-latte', // or 'catppuccin-macchiato' for dark themes
    icon: 'TreePine', // PascalCase lucide-react export name
  },
] as const
```

Then add the named import + `iconMap` entry to `ThemeToggle.astro`:

```ts
import { Sun, Moon, Flame, TreePine, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = { Sun, Moon, Flame, TreePine }
```

Browse icons at [lucide.dev](https://lucide.dev/).

> **Why named imports?** `import * as Icons from 'lucide-react'` breaks Astro's SSR renderer because the namespace includes non-component exports. Named imports + `iconMap` is the correct pattern.

---

## Current themes

| preset  | name  | default | syntaxTheme          |
| ------- | ----- | ------- | -------------------- |
| `nzk`   | Light | yes     | catppuccin-latte     |
| `dark`  | Dark  | no      | catppuccin-macchiato |
| `nexus` | Nexus | no      | catppuccin-macchiato |

---

## Required CSS variables

Every theme must define all of these:

| Variable                                  | Purpose                        |
| ----------------------------------------- | ------------------------------ |
| `--background` / `--foreground`           | Page background and body text  |
| `--card` / `--card-foreground`            | Card components                |
| `--popover` / `--popover-foreground`      | Popover / dropdown             |
| `--primary` / `--primary-foreground`      | Primary buttons and accents    |
| `--secondary` / `--secondary-foreground`  | Secondary elements             |
| `--muted` / `--muted-foreground`          | Disabled / subdued elements    |
| `--accent` / `--accent-foreground`        | Accent highlights              |
| `--destructive` / `--destructive-foreground` | Error / delete actions      |
| `--border`                                | Border colour                  |
| `--input`                                 | Input field border             |
| `--ring`                                  | Focus ring                     |
| `--radius`                                | Component border radius        |
| `--theme-bg`                              | Markdown background            |
| `--theme-link`                            | Markdown link colour           |
| `--theme-text`                            | Markdown text                  |
| `--theme-accent`                          | Markdown primary accent        |
| `--theme-accent-2`                        | Markdown secondary accent      |
| `--theme-quote`                           | Markdown blockquote colour     |

---

## Troubleshooting

**Theme not showing up**

- Check the CSS file is imported in `globals.css`.
- Verify the `data-color-preset` value in the CSS selector matches `preset` exactly (e.g. `data-color-preset='forest'` for `'forest'`).
- Ensure the entry is in the `themes` array in `src/data/site.config.ts`.

**Toggle button missing**

- The button `id` follows the pattern `<preset>Button` (auto-generated from the theme config).
- Verify `icon` is a valid PascalCase lucide export (e.g. `'TreePine'`, not `'tree-pine'`) and is added to **both** the named import and `iconMap` in `ThemeToggle.astro`.
- Restart the dev server.

**Colours look wrong**

- Values must use the full `oklch()` wrapper. Order: lightness (0–1), chroma (0–0.4), hue (0–360).
- Inspect computed CSS variables in browser DevTools.
- Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify readability.

---

## Related

- [og-image-generator.md](./og-image-generator.md) — OG image themes are a separate concept from site colour themes.
