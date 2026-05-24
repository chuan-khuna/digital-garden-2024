---
title: Deployment
tags:
aliases:
  - Deploy
  - Hosting
---

# Deployment

The site is primarily deployed to **Cloudflare Workers**, with secondary configs for Netlify and Vercel.

---

## Cloudflare Workers (Primary)

- **Adapter:** `@astrojs/cloudflare`
- **Config:** `wrangler.jsonc` at repo root
- **Build output:** `dist/`

> [!warning] Compatibility date
> Keep `compatibility_date` in `wrangler.jsonc` current. Outdated dates cause build failures on Cloudflare.

Build and deploy:

```bash
bun run build   # outputs to dist/
```

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

- [[Site Configuration]] — `wrangler.jsonc` references the site name from config
