# Documentation

Knowledge base for the Digital Garden 2024 site. Plain markdown, one job per folder. Two agents read from here — **developer** (`.claude/agents/developer.md`) and **web-master** (`.claude/agents/web-master.md`).

## Categories

| Folder            | Contents                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `architecture/`   | How the system is built — project structure, markdown pipeline, links, deployment, OG images, resume, bento, site config, theme-add procedure |
| `content/`        | Authoring formats for every content collection (posts, resume, nav, portfolio, site config, OG images) + the schema-sync rule |
| `artifacts/`      | LLM-generated PRDs, plans, research/analyses, and design notes (see CLAUDE.md → LLM-Generated Artifacts) |

## Agent → docs map

- **developer** → `architecture/`, `content/`
- **web-master** → `architecture/add-theme.md`, `architecture/og-image-generator.md`, `architecture/bento-grid.md`
