---
title: Markdown Pipeline
tags:
aliases:
  - Markdown Processing
  - Remark Rehype Plugins
---

# Markdown Pipeline

Configured in `astro.config.mjs`. All posts and notes pass through this pipeline at build time.

---

## Remark Plugins

| Plugin | Purpose |
|---|---|
| `remark-math` | Parse inline `$...$` and block `$$...$$` math syntax |
| `remark-flexible-markers` | Custom text marker syntax |
| `remark-obsidian-callout` | Obsidian-style `> [!tip]` callout blocks |
| `remark-wiki-link` | Transform `[[links]]` → `/posts/{permalink}` |

---

## Rehype Plugins

| Plugin | Purpose |
|---|---|
| `rehype-katex` | Render parsed math nodes with KaTeX |

---

## Code Blocks

Powered by `astro-expressive-code` with:

- **Light theme:** `catppuccin-latte`
- **Dark theme:** `catppuccin-macchiato`
- Line numbers plugin enabled

The active syntax theme is driven by the site theme — see [[Adding a Theme]] for how `SYNTAX_HIGHLIGHTER_THEMES` maps each theme name to a highlighter.

---

## Math Usage

```md
Inline: $E = mc^2$

Block:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

> [!info] KaTeX vs MathJax
> This site uses KaTeX (faster, subset of LaTeX). Some advanced LaTeX macros may not be supported. See [KaTeX supported functions](https://katex.org/docs/supported.html).

---

## Related

- [[Adding a Theme]] — syntax highlighter theme mapping per site theme
