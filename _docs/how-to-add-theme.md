# How to Add a Theme

This guide explains how to add a new theme to your digital garden.

## Overview

The theming system consists of three main parts:
1. **CSS theme files** - Define the color variables for each theme
2. **Global CSS** - Imports and loads all theme files
3. **Theme toggle component** - Allows users to switch between themes

## Where Global CSS is Loaded

The `global.css` file is loaded in the following layout files:

- `src/layouts/BaseLayout.astro` - Main layout for most pages
- `src/layouts/BaseLayoutPrint.astro` - Print-specific layout
- `src/layouts/PostLayout.astro` - Blog post layout

**Import statement:**
```astro
import '@/styles/global.css'
```

The `global.css` file (`src/styles/global.css`) imports all theme files:
```css
@import './fonts.css';
@import './theme_dark.css';
@import './theme_nexus.css';
@import './theme_nzk.css';
@import './global_print.css';
```

## How to Add a Theme CSS File

### Step 1: Create the Theme File

Create a new CSS file in `src/styles/` with the naming pattern `theme_<name>.css`.

For example, to create a "forest" theme:

**File: `src/styles/theme_forest.css`**

```css
.forest {
  /* colour palette variables */
  /* define base colours here */
  --palette-background: 120 20% 95%;
  --palette-foreground: 120 30% 15%;
  --palette-primary: 140 50% 35%;

  /* theme config */
  /* theme component colours - all picked from base colours? */
  --background: var(--palette-background);
  --foreground: var(--palette-foreground);

  --card: var(--palette-background);
  --card-foreground: var(--palette-foreground);

  --popover: var(--palette-background);
  --popover-foreground: var(--palette-foreground);

  --primary: var(--palette-primary);
  --primary-foreground: 120 20% 98%;

  --secondary: 90 60% 50%;
  --secondary-foreground: var(--palette-primary);

  --muted: 120 15% 85%;
  --muted-foreground: 120 20% 40%;

  --accent: 80 70% 45%;
  --accent-foreground: var(--palette-primary);

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 120 20% 80%;
  --input: 120 20% 80%;
  --ring: 120 30% 15%;

  --radius: 0.5rem;

  /* cactus (custom theme variables) */
  --theme-bg: 120deg 20% 95%;
  --theme-link: 140deg 50% 40%;
  --theme-text: 120deg 30% 15%;
  --theme-accent: 90deg 60% 50%;
  --theme-accent-2: 140deg 50% 35%;
  --theme-quote: 80deg 70% 45%;
}
```

**Note:** The class name (`.forest`) must match your theme name.

### Step 2: Import the Theme in Global CSS

Add an `@import` statement to `src/styles/global.css`:

```css
@import './fonts.css';
@import './theme_dark.css';
@import './theme_nexus.css';
@import './theme_nzk.css';
@import './theme_forest.css';  /* Add your new theme here */
@import './global_print.css';
```

## How to Add a Theme to the Toggle Button

### Step 1: Update ThemeToggle.astro

Edit `src/components/ThemeToggle.astro`:

1. **Add the theme to the themes array:**

```astro
const themes = [defaultTheme, 'nexus', 'dark', 'forest']
```

2. **Import an icon for the theme:**

```astro
import { Moon, Sun, Leaf, Flame, TreePine } from 'lucide-react'
```

3. **Add a button for the theme:**

```astro
<Button variant="ghost" size="icon" id="themeToggle">
  <Sun className={themeButtonCss} id=`${defaultTheme}Button` />
  <Flame className={themeButtonCss} id="nexusButton" />
  <Moon className={themeButtonCss} id="darkButton" />
  <TreePine className={themeButtonCss} id="forestButton" />
  <span class="sr-only">Toggle theme</span>
</Button>
```

**Important:** The button ID must follow the pattern: `<themeName>Button`

### Step 2: Test Your Theme

1. Save all files
2. Restart your dev server (if needed)
3. Click the theme toggle button to cycle through themes
4. Your new theme should appear in the rotation

## Theme Variables Reference

### Required Variables

All themes must define these CSS variables:

**Colors:**
- `--background` / `--foreground` - Main page background and text
- `--card` / `--card-foreground` - Card components
- `--popover` / `--popover-foreground` - Popover components
- `--primary` / `--primary-foreground` - Primary buttons and accents
- `--secondary` / `--secondary-foreground` - Secondary elements
- `--muted` / `--muted-foreground` - Muted/disabled elements
- `--accent` / `--accent-foreground` - Accent colors
- `--destructive` / `--destructive-foreground` - Error/delete actions
- `--border` - Border colors
- `--input` - Input field borders
- `--ring` - Focus ring color

**Borders:**
- `--radius` - Border radius for components

**Custom Variables (for markdown content):**
- `--theme-bg` - Background color
- `--theme-link` - Link color
- `--theme-text` - Text color
- `--theme-accent` - Primary accent
- `--theme-accent-2` - Secondary accent
- `--theme-quote` - Blockquote color

### Color Format

Colors use HSL format without the `hsl()` wrapper:
```css
/* Correct */
--background: 120 20% 95%;

/* Incorrect */
--background: hsl(120, 20%, 95%);
```

## Tips

1. **Start with an existing theme** - Copy `theme_nzk.css` or `theme_dark.css` and modify the colors
2. **Use a color picker** - Tools like [HSL Color Picker](https://hslpicker.com/) can help you find HSL values
3. **Test contrast** - Ensure text is readable on backgrounds using tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
4. **Choose appropriate icons** - Browse [Lucide Icons](https://lucide.dev/) for theme-appropriate icons
5. **Theme persistence** - The selected theme is automatically saved to localStorage

## Troubleshooting

**Theme not showing up:**
- Check that the theme file is imported in `global.css`
- Verify the class name matches the theme name exactly
- Ensure the theme name is added to the `themes` array in `ThemeToggle.astro`

**Theme button not appearing:**
- Check that the button ID follows the pattern: `<themeName>Button`
- Verify you imported the icon component from `lucide-react`
- Restart the dev server

**Colors look wrong:**
- Verify HSL values are in the correct format (no `hsl()` wrapper)
- Check that all required CSS variables are defined
- Use browser DevTools to inspect the computed CSS variables