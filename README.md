# Digital Garden 2024

An Astro-based digital garden and personal portfolio — Zettelkasten-style knowledge base combined with resume/CV pages. Features bidirectional wiki-style linking, multiple themes, and is deployed to Cloudflare Workers.

## Tech Stack

- **Framework:** [Astro 6](https://astro.build/) + MDX, deployed via `@astrojs/cloudflare`
- **UI:** React (interactive components), Framer Motion (animations)
- **Styling:** Tailwind CSS 4 (Vite plugin), oklch CSS variables, multiple themes
- **Content:** Astro Content Collections with `glob` loader API
- **Fonts:** Sans (Lato, Metric) · Serif (Canela, DM Serif Text) · Mono (Inconsolata)

## Getting Started

```bash
bun install       # install dependencies
bun run dev       # dev server at localhost:4321
bun run build     # production build
```

> `npm` and `npx` are also supported if `bun` is not available.

## Project Structure

```
src/
  assets/          Static assets
  components/      bento/, resume/, post/, ui/, og/, aceternity/
  content/         collection-definitions/, posts/, notes/, resume/
  layouts/         BaseLayout, PostLayout, BaseLayoutPrint
  pages/           File-based routing
  styles/          presets/ (per-theme CSS), fonts.css, global.css
  utils/           Pure functions (bidirectional-link.ts, cn.ts)
```

**Key config files:**

- `src/content/portfolio.ts` — personal info, links, skills (bento homepage)
- `src/content/site.config.ts` — site-wide config (title, display name, GitHub URL)

## References

- [AREA44's astro-shadcn-ui-template](https://github.com/AREA44/astro-shadcn-ui-template)
- [chrismwilliams' astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus/tree/main)
- Bento Card: [techtim-astro-bento-portfolio](https://github.com/tim-hub/techtim-astro-bento-portfolio) and [astro-bento-portfolio](https://github.com/Ladvace/astro-bento-portfolio)
