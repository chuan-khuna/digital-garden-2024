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

## Gap Analysis vs shadcn/Tailwind Standard

Comparing current preset files and `global.css` against the shadcn/Tailwind theming standard.

### Missing CSS Variables in Presets & `:root`

#### `--chart-*` tokens

The standard defines 5 chart colour tokens for use with Recharts / data visualisation components:

```css
--chart-1: oklch(...);
--chart-2: oklch(...);
--chart-3: oklch(...);
--chart-4: oklch(...);
--chart-5: oklch(...);
```

And registers them in `@theme inline`:

```css
--color-chart-1: var(--chart-1);
/* ... */
--color-chart-5: var(--chart-5);
```

**Status:** Not defined in `:root`, not in any preset, not registered in `@theme inline`.

#### `--sidebar-*` tokens

The standard defines a full sidebar colour sub-system:

```css
--sidebar: oklch(...);
--sidebar-foreground: oklch(...);
--sidebar-primary: oklch(...);
--sidebar-primary-foreground: oklch(...);
--sidebar-accent: oklch(...);
--sidebar-accent-foreground: oklch(...);
--sidebar-border: oklch(...);
--sidebar-ring: oklch(...);
```

**Status:** Not present. Less critical for this project (no sidebar component), but required for shadcn compatibility.

#### `--shadow-*` tokens

The standard's presets define per-preset shadow styles for consistent elevation:

```css
--shadow-2xs: 0px 2px 0px 0px hsl(0 0% 20% / 0.07);
--shadow-xs: ...;
--shadow-sm: ...;
--shadow: ...;
--shadow-md: ...;
--shadow-lg: ...;
--shadow-xl: ...;
--shadow-2xl: ...;
```

These are applied via `@layer utilities` conditionally when a preset is active. **Status:** Not defined in any preset.

---

### Missing `@theme inline` Registrations

The `@theme inline` block is missing these token registrations (compared to the standard):

| Missing token | Needed for |
|---|---|
| `--color-chart-1` … `--color-chart-5` | Tailwind `text-chart-1` etc. utilities |
| `--color-sidebar` … `--color-sidebar-ring` | Tailwind sidebar utilities |
| `--radius-xl`, `--radius-2xl`, etc. | Tailwind `rounded-xl` using theme radius |

The standard also registers **only** `--color-destructive` (no `--color-destructive-foreground`) — our `@theme inline` includes `--color-destructive-foreground` which is an intentional addition and fine.

---

### Missing Dark Variant in Presets

The standard supports both a colour preset **and** independent dark mode simultaneously via:

```css
:root[data-color-preset="graphite"] { /* light */ }
.dark:root[data-color-preset="graphite"] { /* dark override */ }
```

Our preset files only define the light variant. The `.dark` class has no effect when a preset is active because the preset values win regardless of light/dark.

**Status:** `presets/dark.css`, `presets/nexus.css`, and `presets/nzk.css` all lack a `.dark:root[data-color-preset="..."]` block.

---

### Missing `@layer utilities` Shadow Override Block

The standard conditionally activates shadow tokens only when a preset is active:

```css
@layer utilities {
  [data-theme-preset]:not([data-theme-preset="default"]) .shadow-sm {
    box-shadow: var(--shadow-sm);
  }
  /* ... all shadow sizes */
}
```

This keeps the default Tailwind shadows when no preset overrides them. **Status:** Not present in `global.css`.

---

### Attribute Name Difference (`data-color-preset` vs `data-theme-preset`)

The standard uses `[data-theme-preset]`. This project intentionally uses `data-color-preset` to avoid collision with `data-theme` used by expressive-code syntax highlighter. This is a **deliberate divergence**, not a bug.

---

### Missing Preset Metadata Comments

The standard includes a machine-readable comment block at the top of each preset file used by tooling (e.g. theme pickers):

```css
/*
label: Graphite
value: graphite
*/
```

**Status:** Not present in any of our preset files.

---

### Summary Table

| Gap | Files Affected | Priority |
|---|---|---|
| `--chart-*` vars missing | `:root`, all presets, `@theme inline` | 🟡 Low (no charts currently) |
| `--sidebar-*` vars missing | `:root`, all presets, `@theme inline` | 🟡 Low (no sidebar component) |
| `--shadow-*` vars missing | all presets | 🟡 Low |
| Dark variant missing in presets | `presets/*.css` | 🔴 Medium (dark mode broken with preset active) |
| `@layer utilities` shadow block | `global.css` | 🟡 Low |
| Metadata comments | `presets/*.css` | ⚪ Cosmetic |

---

## Related

- [[Architecture and Code Quality Analysis]]
