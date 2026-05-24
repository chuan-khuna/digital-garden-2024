# Skills

This folder contains **project-specific AI agent skills** for managing and extending this digital garden site. Unlike the general-purpose skills in `.agents/skills/`, every skill here is tailored to the conventions, file structure, and workflows of this Astro-based digital garden.

Skills are picked up automatically by the AI agent — when your request matches a skill's description, it loads the relevant instructions and follows them.

---

## Skills

| Skill                               | Description                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`add-theme`](./add-theme/SKILL.md) | Add a new visual theme — creates the CSS preset, imports it in `global.css`, and wires up the toggle button in `ThemeToggle.astro` |

---

## Adding a New Skill

1. Create a folder: `skills/<skill-name>/`
2. Add `SKILL.md` with YAML frontmatter (`name`, `description`) and step-by-step instructions
3. Optionally add `scripts/`, `references/`, or `assets/` subdirectories

Use the `skill-creator` skill (in `.agents/skills/skill-creator/`) to scaffold, test, and iterate on new skills.
