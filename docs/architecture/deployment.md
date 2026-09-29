# Deployment

The site is primarily deployed to **Cloudflare Workers**, with secondary configs for Netlify and Vercel.

---

## Cloudflare Workers (Primary)

- **Adapter:** `@astrojs/cloudflare`
- **Config:** `wrangler.jsonc` at repo root
- **Build output:** `dist/`

> **Warning — Compatibility date**
> Keep `compatibility_date` in `wrangler.jsonc` current. Outdated dates cause build failures on Cloudflare.

Build and deploy:

```bash
bun run build   # outputs to dist/
```

### Local dev runs in workerd

`bun run dev` runs server code inside workerd (the Workers runtime), which has no `require`, so any CommonJS dependency must be pre-bundled to ESM by Vite. The adapter pre-bundles its own list; `vite.optimizeDeps.include` in `astro.config.mjs` adds what it misses, and the adapter merges that list into the worker environment:

- `@astrojs/react > @astrojs/internal-helpers > picomatch`: `@astrojs/react`'s server imports this nested CommonJS copy of `picomatch`.
- `@astrojs/cloudflare/entrypoints/server`: pre-bundled so Vite doesn't re-optimize and reload the worker mid-startup.

If dev crashes with `ReferenceError: require is not defined` and the stack trace names a file under `node_modules`, add that package to this list (use `a > b` for nested copies) and delete `node_modules/.vite`.

Code that runs per request must not import build-time modules that pull in CommonJS packages, e.g. `src/content/collection-definitions/resume-loaders.ts` (`astro/loaders`, `node:fs`).

---

## Other Platforms

| Platform | Config file |
|---|---|
| Netlify | `netlify.toml` |
| Vercel | `vercel.json` |

Both use the same `bun run build` command and `dist/` output directory.

---

## Docker (local preview)

```bash
docker compose -f bun.compose.yml up -d   # serves on port 4322
```

---

## Related

- [Site Configuration](./site-configuration.md) — `wrangler.jsonc` references the site name from config
