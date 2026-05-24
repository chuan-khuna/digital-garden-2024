---
name: add-theme
description: >
  Add a new visual theme to the digital garden site. Use this skill whenever
  the user asks to add a theme, create a color scheme, introduce a new
  visual style, or says something like "add a [name] theme". Handles all
  four required file changes: CSS variables, global import, ThemeToggle
  component, and syntax highlighter mapping.
---

# Add Theme

Adding a theme involves four coordinated changes across three files. Missing
any one of them will cause the toggle button to disappear, the theme colors
to not apply, or syntax highlighting to break.

## Required files

| File | What to change |
|------|---------------|
| `src/styles/presets/<name>.css` | Create — define all CSS variables |
| `src/styles/global.css` | Add `@import` line for the new preset |
| `src/components/ThemeToggle.astro` | Add to `THEMES`, `SYNTAX_HIGHLIGHTER_THEMES`, and add a button |

---

## Step 1 — Create the CSS preset file

Create `src/styles/presets/<themename>.css`. All colors must use `oklch()` —
never hardcode hex or rgb values; the rest of the site depends on these
variables staying in oklch.

The selector must match this pattern exactly (controls which variables
are active when the theme is selected):

```css
:root[data-color-preset='<themename>'] {
  /* shadcn-compatible tokens */
  --background: oklch(...);
  --foreground: oklch(...);

  --card: oklch(...);
  --card-foreground: oklch(...);

  --popover: oklch(...);
  --popover-foreground: oklch(...);

  --primary: oklch(...);
  --primary-foreground: oklch(...);

  --secondary: oklch(...);
  --secondary-foreground: oklch(...);

  --muted: oklch(...);
  --muted-foreground: oklch(...);

  --accent: oklch(...);
  --accent-foreground: oklch(...);

  --destructive: oklch(...);
  --destructive-foreground: oklch(...);

  --border: oklch(...);
  --input: oklch(...);
  --ring: oklch(...);

  --radius: 0.5rem;

  /* Site-specific semantic tokens */
  --theme-bg: oklch(...);      /* page background */
  --theme-link: oklch(...);    /* link color */
  --theme-text: oklch(...);    /* body text */
  --theme-accent: oklch(...);  /* primary accent */
  --theme-accent-2: oklch(...); /* secondary accent */
  --theme-quote: oklch(...);   /* blockquote text */
}
```

If the user hasn't specified exact colors, generate a harmonious palette
that matches their description (e.g. "forest green theme", "warm pink theme").
Aim for good contrast ratios — the foreground/background pairs should meet
WCAG AA (contrast ≥ 4.5:1 for normal text).

**Reference:** Look at `src/styles/presets/nzk.css` (light theme) and
`src/styles/presets/dark.css` (dark theme) for working examples.

---

## Step 2 — Import the preset in global.css

In `src/styles/global.css`, add an import alongside the other presets
(lines 1-4). Place it after the existing preset imports:

```css
@import './presets/nzk.css';
@import './presets/dark.css';
@import './presets/nexus.css';
@import './presets/<themename>.css';   ← add this
```

---

## Step 3 — Update ThemeToggle.astro

`src/components/ThemeToggle.astro` has three things to update:

### 3a. Add to `THEMES` array

```ts
const THEMES = [DEFAULT_THEME, 'dark', 'nexus', '<themename>'] as const
```

The order determines the cycling sequence when the user clicks the toggle button.

### 3b. Add to `SYNTAX_HIGHLIGHTER_THEMES`

Map the new theme to one of the two available syntax highlighter themes:
- `'catppuccin-latte'` → for light themes
- `'catppuccin-macchiato'` → for dark themes

```ts
const SYNTAX_HIGHLIGHTER_THEMES = {
  nzk: 'catppuccin-latte',
  dark: 'catppuccin-macchiato',
  nexus: 'catppuccin-macchiato',
  <themename>: 'catppuccin-latte',  // or 'catppuccin-macchiato'
} as const
```

### 3c. Add the toggle button icon

Add a button element inside the `<Button>` wrapper. Use a
[Lucide React](https://lucide.dev/icons/) icon that fits the theme's
personality. The existing choices are: `Sun` (nzk), `Flame` (nexus),
`Moon` (dark).

```astro
---
import { Moon, Sun, Leaf, Flame, <YourIcon> } from 'lucide-react'
---

<Button variant="ghost" size="icon" id="themeToggle">
  <Sun className={THEME_BUTTON_CSS} id={`${DEFAULT_THEME}Button`} />
  <Flame className={THEME_BUTTON_CSS} id="nexusButton" />
  <Moon className={THEME_BUTTON_CSS} id="darkButton" />
  <YourIcon className={THEME_BUTTON_CSS} id="<themename>Button" />
  <span class="sr-only">Toggle theme</span>
</Button>
```

The `id` **must** follow the pattern `<themename>Button` — the toggle
script uses this to show/hide the correct icon.

---

## Checklist before finishing

- [ ] `src/styles/presets/<themename>.css` exists with all CSS variables
- [ ] `src/styles/global.css` has the `@import` for the new preset
- [ ] `THEMES` array in `ThemeToggle.astro` includes the new theme name
- [ ] `SYNTAX_HIGHLIGHTER_THEMES` maps the new theme to a syntax theme
- [ ] Button with `id="<themename>Button"` added to `ThemeToggle.astro`
- [ ] Icon import added to the frontmatter of `ThemeToggle.astro`
