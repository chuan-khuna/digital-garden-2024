# .claude-dev

A local Claude Code plugin and marketplace. It holds skills that are not part of this repo's `.claude/skills/`.

```
.claude-dev/
├── .claude-plugin/
│   ├── plugin.json        # the plugin: writing-tools
│   └── marketplace.json   # the marketplace garden-local, which lists the plugin
└── skills/
    ├── resume/SKILL.md
    ├── technical-writing/SKILL.md
    └── unslop/SKILL.md
```

## Install

### As a plugin

From a terminal, in the repo root:

```bash
claude plugin marketplace add ./.claude-dev
claude plugin install writing-tools@garden-local
```

Or inside Claude Code:

```
/plugin marketplace add ./.claude-dev
/plugin install writing-tools@garden-local
```

Both install for your user by default. Pass a scope to `install` (`-s` for short) to change that:

- `--scope project` writes the setting to `.claude/settings.json`, which is committed, so anyone who clones the repo is offered the plugin.
- `--scope local` keeps the plugin to you, in this repo only.

#### Project level

To install for everyone who works on this repo:

```bash
claude plugin marketplace add ./.claude-dev --scope project
claude plugin install writing-tools@garden-local --scope project
```

The CLI saves the marketplace `path` in `.claude/settings.json` as an absolute path, which breaks on other machines. Change it to a relative path before you commit:

```json
"path": "./.claude-dev"
```

Skills then run with the plugin name in front: `/writing-tools:unslop`, `/writing-tools:technical-writing`, `/writing-tools:resume`.

To try the plugin for one session without installing it:

```bash
claude --plugin-dir ./.claude-dev
```

After you change a skill, refresh the marketplace, or restart the `--plugin-dir` session:

```bash
claude plugin marketplace update garden-local
```

To turn the plugin off and on:

```bash
claude plugin disable writing-tools
claude plugin enable writing-tools
```

### As plain skills

Copy the skill folders into `.claude/skills/` with the `skills` CLI (`bunx` works the same):

```bash
npx skills add ./.claude-dev --list                       # show what it finds
npx skills add ./.claude-dev -a claude-code               # install all
npx skills add ./.claude-dev --skill unslop -a claude-code
```

Or copy by hand: `cp -r .claude-dev/skills/<name> .claude/skills/`.

## Add a skill

1. Add `skills/<name>/SKILL.md`.
2. Add a line for it under [Skills](#skills), with its source.
3. Bump `version` in both `plugin.json` and `marketplace.json`.

## Skills

All skills set `disable-model-invocation: true`, so they run only when you call them by name.

- `unslop`: [cursor/plugins `pstack/skills/unslop`](https://github.com/cursor/plugins/tree/e1cc03121a0e71129a4fb730d7c5528a0a3e43c8/pstack/skills/unslop) (`e1cc03121a0e71129a4fb730d7c5528a0a3e43c8`)
- `resume`: written for this repo. It writes and proofreads resume text you give it, in British English, by the rules of [Harvard FAS Career Services](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/) and [the Guardian](https://www.theguardian.com/careers/careers-blog/grammar-rules-cv-top-tips), with the `technical-writing` and `unslop` skills.
- `technical-writing`: [cursor/plugins `pstack/skills/technical-writing`](https://github.com/cursor/plugins/tree/e1cc03121a0e71129a4fb730d7c5528a0a3e43c8/pstack/skills/technical-writing) (`e1cc03121a0e71129a4fb730d7c5528a0a3e43c8`)
