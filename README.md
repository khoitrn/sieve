# Sieve

A portable, file-based agent protocol and skill library that installs in one command and works the same across Claude Code, Codex, Cursor, and other coding agents.

If you use an AI coding assistant, Sieve gives it a consistent set of ground rules (test first, review before moving on, verify before declaring done) and a growing library of skills it can pull in only when a task needs them — instead of you re-explaining your conventions to every tool separately, or a single giant instructions file every agent has to read in full on every task.

![npm version](https://img.shields.io/npm/v/sievekit)
![npm downloads](https://img.shields.io/npm/dm/sievekit)
![status](https://img.shields.io/badge/status-alpha-orange)
![node](https://img.shields.io/badge/node-%3E%3D18-green)
![license](https://img.shields.io/badge/license-MIT-blue)

## Contents

- [Install](#install)
- [See it in action](#see-it-in-action)
- [Why Sieve](#why-sieve)
- [First 60 seconds](#first-60-seconds)
- [How it works](#how-it-works)
- [Commands](#commands)
- [What is inside](#what-is-inside)
- [Creating a skill](#creating-a-skill)
- [Contributing](#contributing)
- [License](#license)

## Install

Requires Node.js 18 or later. Scaffold Sieve into any project with one command:

```sh
npx sievekit init
```

That asks two short questions (new idea or existing project, any focus areas), asks the [Sieve registry](https://github.com/khoitrn/sieve-registry) which skills fit, and installs just that shortlist plus the always-on guardrails — not the whole catalog. It seeds your project state and writes pointer files for whichever agents you use. Then open your coding agent in that folder and describe what you want to build.

No registry, no problem: if it's unreachable (offline, self-hosting, whatever), `init` falls back to installing the full bundled catalog automatically — Sieve stays a plain, portable, file-based layer either way. Prefer that path outright, e.g. for CI or scripted use? `npx sievekit init --all` (or `--offline`) skips the interview and the network call entirely.

## See it in action

A real `npx sievekit init --offline` run, so you know exactly what lands in your project before you try it:

```
Installing Sieve (full catalog) into your-project/

copy  AGENTS.md
copy  sieve.index.json
copy  skills
copy  templates
seed  PROGRESS.md
seed  HISTORY.jsonl
seed  PROPOSED.md
seed  STALE.md
seed  staging/README.md

write CLAUDE.md  (Claude Code)
write GEMINI.md  (Gemini CLI)
write .github/copilot-instructions.md  (GitHub Copilot)
write .cursor/rules/sieve.mdc  (Cursor)
write .windsurfrules  (Windsurf)

5 bridge file(s) written. AGENTS.md remains the source of truth.

Sieve is ready in your-project/.
Open your coding agent there and describe what you want to build.
```

Every "write" line is a thin pointer back to `AGENTS.md` for agents that read a different filename — none of them duplicate its content.

## Why Sieve

- Agent memory and enforcement are vendor-locked. Your working judgment should not be. Sieve keeps the durable layer (protocol, guardrails, skills, state) in plain files you own, and treats each vendor's native machinery as a removable enhancement.
- One protocol, every agent. `AGENTS.md` is the source of truth, read natively by Codex, Cursor, Copilot, Gemini CLI, Aider, Windsurf, Zed, and 20+ others. For the few agents that read a different filename (Claude Code, Gemini CLI, Copilot, Cursor, Windsurf), `sieve bridge` writes a thin pointer back to `AGENTS.md`, so you never maintain the same rules twice.
- Grows by use, not by design. Skills are proposed, validated, and promoted as real work surfaces them. The catalog scales without every session paying for the whole thing.

## First 60 seconds

1. Drop `AGENTS.md`, `CLAUDE.md`, and `skills/` into a repo.
2. Open your agent and describe what you want to build.
3. The agent asks whether this is a new idea or an existing project, then loads only the skills the task needs.

## How it works

Three load tiers keep token cost flat as the catalog grows:

- **Always loaded (tiny):** the fork question and guardrail names, in `AGENTS.md`, under 100 lines.
- **On the chosen path only:** new idea loads a grill (a short structured Q&A that turns a rough idea into an agreed plan); existing project reads state and confirms it.
- **Lazy, per task:** individual `SKILL.md` files load only when the shortlist selects them.

Guardrails (test-driven development, code review, verification) stay active by default. Anything that bypasses a guardrail or improvises past the shortlist hits an approval gate and asks first.

## Commands

Everything below runs as `npx sievekit <command>` in a project where Sieve is installed (or `sieve <command>` if installed globally).

| Command | What it does |
|---|---|
| `init [--all\|--offline] [--detect-stack]` | Onboard into the current project: interview + registry-recommended skills by default, or `--all`/`--offline` for the full bundled catalog with no prompts or network call |
| `list` | Show which skills are currently installed, guardrails vs. catalog |
| `add <name> [--force]` | Pull one more skill from the registry into this project |
| `remove <name> [--force]` | Drop one installed skill (`--force` required for guardrails) |
| `check [--days N] [--updates]` | Report stale skills and pending growth-loop items; `--updates` also diffs installed skill versions against the registry |
| `bridge [--detect]` | (Re)write pointer files for agents that don't read `AGENTS.md` natively |
| `validate [path...]` | Validate `SKILL.md` files (default: everything in `skills/`) |

## What is inside

- `AGENTS.md`: the protocol. Fork, guardrails, skill selection, approval gate, continuity.
- `CLAUDE.md`: a one-line bridge that imports `AGENTS.md`.
- `skills/<category>/<name>/SKILL.md`: the catalog.
  - planning: `grill-me`, `acknowledge-project`, `writing-plans`
  - testing: `test-driven-development`
  - review: `requesting-code-review`, `open-code-review`
  - debugging: `systematic-debugging`
  - verification: `verification-before-completion`
  - maintenance: `skill-stocktake`
- `sieve.index.json`: the machine-readable catalog index.
- `bin/cli.js`: the `sieve`/`npx sievekit` entry point — dispatches to the scripts below.
- `scripts/onboard.mjs`, `init.mjs`, `bridge.mjs`, `check.mjs`, `list.mjs`, `add.mjs`, `remove.mjs`, `validate-skill.mjs`: one script per command in the table above.
- `scripts/security-scan.mjs`, `test-cli.mjs`: maintainer-only tooling — a heuristic scan over staged skills, and this repo's own test suite. Not exposed as `sieve` subcommands.
- `PROGRESS.md`, `HISTORY.jsonl`: continuity and a structured event log.
- `staging/`: where contributed skills land before validation.
- `.sieve/project.json` (written into the *target* project, not this repo): the project's id and which skills were pulled, at what version — input for `sieve check --updates`.

## Creating a skill

Draft `staging/<name>/SKILL.md` with `name` and `description` frontmatter (the description is the trigger). Keep the body under 500 lines; push detail into `references/`. Then validate:

```sh
npx sievekit validate staging/<name>/SKILL.md
```

## Contributing

Drop the skill in `staging/`, validate it, and promote it once it passes. See `staging/README.md` and `CONTRIBUTING.md`.

## License

MIT
