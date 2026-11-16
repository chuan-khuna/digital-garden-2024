# Documentation

Knowledge base for the Digital Garden 2024 site. Plain markdown, one job per folder. Two agents read from here — **developer** (`.claude/agents/developer.md`) and **web-master** (`.claude/agents/web-master.md`).

## Categories

| Folder             | Contents                                                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `documents/`       | Entry point `INDEX.md`. How the system is built — project structure, markdown pipeline, links, deployment, OG images, resume, bento, site config, theme-add procedure |
| `content-formats/` | Authoring formats for every content collection (posts, resume, nav, portfolio, site config, OG images) + the schema-sync rule                                         |
| `adr/`             | Architecture decision records                                                                                                                                         |
| `records/`         | Discussion records, one per discussion: `yyyy-mm-dd-<topic>.md` (see CLAUDE.md → Project docs → Records)                                                              |
| `agents/`          | Config for the engineering skills — issue tracker (local `.scratch/`), triage labels, domain-doc layout (see CLAUDE.md → Agent skills)                                |
| `shared/`          | Shared CSS and JS for HTML documents (`globals.css`, `doc.js`) — see CLAUDE.md → Project docs → HTML documents                                                        |
| `research/`        | LLM-generated research notes and analyses (see CLAUDE.md → LLM-Generated Artifacts)                                                                                   |
| `handoff/`         | LLM-generated handoff briefs for another agent to pick up                                                                                                             |

Other LLM-generated artifacts go in their own `docs/<category>/` folder (see CLAUDE.md → LLM-Generated Artifacts).

## Agent → docs map

- **developer** → `documents/`, `content-formats/`
- **web-master** → `content-formats/`, plus `GLOSSARY.md` for resume work
