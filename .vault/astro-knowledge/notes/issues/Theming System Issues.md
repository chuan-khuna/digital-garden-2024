---
title: Theming System Issues
tags:
  - issue
  - css
  - theming
  - code-quality
aliases:
  - CSS Theme Bugs
  - oklch Theme Issues
---

# Theming System Issues

Analysis of `src/styles/` theming system in `digital-garden-2024`. Bugs and a structural redesign decision recorded here.

---

## Current Architecture (Broken)

Colours flow through three layers:

```
theme_<name>.css              global.css @theme              Tailwind class
──────────────────             ──────────────────             ─────────────
--palette-x: L C H;  →       --color-x: oklch(var(--x))  →  bg-background
--x: var(--palette-x);
```

Theme files store raw oklch channel values (three floats: `L C H`) **without** `oklch()`. `global.css` then wraps them. This creates a fragile split that caused both bugs below.

---

## Bug 1 — Double `oklch()` Wrapping

`theme_nzk.css` line 44 already includes `oklch()`:

```css
--destructive: oklch(0.6368 0.2078 25.33);  /* ← oklch() already here */
```

But `global.css @theme` wraps it again:

```css
--color-destructive: oklch(var(--destructive));  /* → oklch(oklch(...)) — invalid */
```

> [!bug] Quick fix (before full refactor)
> ```css
> --destructive: 0.6368 0.2078 25.33;
> ```

---

## Bug 2 — `:root` Fallback Uses Wrong Colour Format

`global.css :root` defines fallback values in HSL-like percentages:

```css
--palette-background: 40 47.4% 96.3%;   /* HSL — wrong format */
--secondary: 13.1 100% 64.1%;
```

But `global.css @theme` consumes them as `oklch()` channels:

```css
--color-background: oklch(var(--background));  /* → oklch(40 47.4% 96.3%) — wrong */
```

`oklch()` expects unitless decimals (`0.977 0.008 84.57`), not HSL percentages. Colours are visually wrong when no theme class is applied.

---

## Bug 3 — IDE Cannot Preview Colours

Raw channel triplets have no colour preview in VS Code or any IDE:

```css
--palette-nzk-blue: 0.3261 0.0984 268.87;  /* IDE sees: three numbers */
```

This caused Bug 1 — a developer added `oklch()` to get IDE preview, not knowing `global.css` would wrap it again.

---

## Decided Architecture (Redesign)

After comparing against a reference implementation, the chosen pattern is:

### Pattern: `@theme inline` + `:root[data-color-preset="name"]`

```css
/* global.css */
@theme inline {
  --color-background: var(--background);  /* no oklch() — just passes through */
  --color-primary:    var(--primary);
  /* ... */
}

/* default theme lives in :root */
:root {
  --background: oklch(0.977 0.0085 84.57);  /* full oklch(), IDE-previewable */
  --primary:    oklch(0.3261 0.0984 268.87);
}

/* dark mode — orthogonal axis, independent of preset */
.dark {
  --background: oklch(0.079 0.0178 254.43);
  --primary:    oklch(0.8087 0.1067 222.35);
}
```

```css
/* styles/presets/nexus.css */
:root[data-color-preset="nexus"] {
  --background: oklch(0.1727 0.0161 261.53);
  --primary:    oklch(0.5885 0.1542 291.11);
  /* ... */
}

.dark:root[data-color-preset="nexus"] {
  --background: oklch(...);
  /* ... */
}
```

### Why This Pattern

| Concern | Old | New |
|---|---|---|
| IDE colour preview | ❌ Raw triplets | ✅ Full `oklch()` in every file |
| Double-wrap risk | ❌ `oklch(oklch(...))` possible | ✅ No `oklch()` in `@theme` at all |
| `:root` correctness | ❌ HSL values in oklch context | ✅ Full `oklch()` values |
| Dark mode | Mixed into theme files | Orthogonal `.dark` class |
| Theme switching | Class on `<html>` (`.nzk`) | `data-color-preset` attribute |
| Tailwind opacity modifiers | ❌ Broken (`oklch(var(...))`) | ✅ Works (`var(--x)` stays dynamic) |

### `data-color-preset` vs class

`data-theme` is already used by expressive-code (syntax highlighter) — set in `ThemeToggle.astro` line 68. Use `data-color-preset` to avoid collision.

Classes (`.nzk`, `.dark`, `.nexus`) can conflict with Tailwind utility names. Attribute selectors are safer and more semantic.

### `@theme inline` is the key

Without `inline`, Tailwind bakes the token value at build time — runtime CSS variable overrides don't propagate. With `inline`, utilities like `bg-background` emit `background-color: var(--color-background)`, which picks up any runtime change to `--background`.

---

## Migration Steps

1. Replace `@theme { --color-x: oklch(var(--x)) }` with `@theme inline { --color-x: var(--x) }`
2. Move default colours into `:root` in `global.css` as full `oklch()` values
3. Convert `theme_dark.css` → `presets/dark.css` using `:root[data-color-preset="dark"]` + `.dark:root[data-color-preset="dark"]`
4. Convert `theme_nexus.css` → `presets/nexus.css` same pattern
5. Convert `theme_nzk.css` → make it the `:root` default (it's the primary theme)
6. Update `ThemeToggle.astro` to set `data-color-preset` attribute instead of adding class
7. Delete `--palette-*` intermediate layer — store colours directly as semantic tokens

---

## Related

- [[Architecture and Code Quality Analysis]]
