# Sieve

Sieve teaches your AI coding assistant good habits — test before you claim it works, review before moving on, verify before calling it done — plus a growing library of focused how-to guides ("skills") it reaches for only when a task actually needs one. One command sets it up, and it works the same whether you use Claude Code, Codex, Cursor, or something else.

Without Sieve, you either re-explain your conventions to every AI tool separately, or hand every tool one giant instructions file it has to reread in full on every single task. Sieve keeps the rules in one place and only loads the extra detail that's relevant right now.

![npm version](https://img.shields.io/npm/v/sievekit)
![npm downloads](https://img.shields.io/npm/dm/sievekit)
![status](https://img.shields.io/badge/status-alpha-orange)
![node](https://img.shields.io/badge/node-%3E%3D18-green)
![license](https://img.shields.io/badge/license-MIT-blue)

**Is this for me?** Sieve is for anyone already coding with an AI assistant — Claude Code, Cursor, Codex, Copilot, and 20+ others are all supported. You'll need Node.js installed and a terminal to run one command; you don't need to know how to code yourself, just how to open a terminal in your project folder. If you don't already use one of those AI coding tools, Sieve has nothing to do yet — it configures tools you already have, it doesn't replace them.

## Contents

- [Install](#install)
- [See it in action](#see-it-in-action)
- [Why Sieve](#why-sieve)
- [First 60 seconds](#first-60-seconds)
- [A few words you'll see](#a-few-words-youll-see)
- [How it works](#how-it-works)
- [Commands](#commands)
- [What is inside](#what-is-inside)
- [Creating a skill](#creating-a-skill)
- [Related projects](#related-projects)
- [Contributing](#contributing)
- [License](#license)

## Install

Start with the CLI — it's what actually sets Sieve up in a project. The dashboard is a separate, optional piece, but it's not unrelated: once your project's on GitHub, the dashboard's **Dashboard** tab reflects exactly what the CLI installed there — which skills are active, with real usage evidence pulled straight from your own project.

### 1. The CLI — sets Sieve up in your project

Open a terminal in your project folder and run:

```sh
npx sievekit init
```

`npx` fetches Sieve, runs it once, and doesn't leave anything installed globally on your computer — safe to run any time, no separate "download" step first.

That command asks two short questions (new idea or existing project? any focus areas?), checks the [Sieve registry](https://github.com/khoitrn/sieve-registry) for which skills fit your answers, then shows you the recommended list before writing anything — press Enter to accept it, type skill names (comma-separated) to add more, or `n` to install just the always-on guardrails and skip the rest. Then open your AI coding assistant in that same folder and describe what you want to build — nothing else to configure.

No internet, or the registry happens to be down? `init` automatically falls back to installing the full built-in library instead — Sieve still works either way, it's just plain files either way. If you'd rather skip the two questions and always get the full library, run `npx sievekit init --all` (or `--offline`) instead.

### 2. The dashboard — see it reflected, browse, or connect more

[sieve-dashboard](https://github.com/khoitrn/sieve-dashboard) is a browser UI, self-hosted — see its [Setup guide](https://github.com/khoitrn/sieve-dashboard#setup-run-your-own-copy), about 15 minutes.

Once your project is on a **public** GitHub repo, point the dashboard's **Dashboard** tab at `owner/repo` and it shows exactly what's active there, no sign-in needed: guardrails marked "always active," every catalog skill's real mention count and last-used date pulled straight from your project's own `HISTORY.jsonl`, and a click-through to that skill's actual instructions plus the evidence lines behind the count. This isn't a mock or a static summary — it's read live from your repo on every load.

Sign in and the other tabs open up too — Library (your wider skill pool: curated + connected + custom, not tied to one project), Sources (connect other repos), Custom (author a skill by hand) — useful on their own, independent of any single project's CLI install.

## See it in action

Curious what actually shows up in your project folder? Here's a real `npx sievekit init --offline` run, so you know exactly what lands before you try it — nothing here is hidden or surprising:

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

Files with `write` next to them (`CLAUDE.md`, `GEMINI.md`, etc.) are just one-line pointers back to `AGENTS.md` for tools that expect their own filename — none of them copy the rules, they just point at the one real copy. That way you only ever edit the rules in one place.

## Why Sieve

- **You keep the rules, not the vendor.** Every AI coding tool has its own way of remembering instructions, and that memory disappears if you switch tools. Sieve keeps your actual rules — how you like tests written, how reviews should go, what "done" means — in plain text files that live in your project and belong to you, not locked inside any one tool.
- **Write the rules once, every tool reads them.** `AGENTS.md` is a plain-text file that most AI coding tools (Codex, Cursor, Copilot, Gemini CLI, and 20+ others) already read on their own. For the few that look for a different filename (like Claude Code), Sieve writes a one-line pointer file so they find the same rules — you never end up maintaining two copies that drift apart.
- **The library grows from real use, not guesswork.** New skills get added when real work actually needs them, get checked over, and only then join the library — so it grows to match how people really use it, instead of every project shipping with everything anyone might ever need.

## First 60 seconds

1. Run `npx sievekit init` (see [Install](#install) above) — this drops a few files into your project.
2. Open your AI coding assistant in that same folder and describe what you want to build, same as always.
3. It'll ask whether this is a brand-new idea or work on an existing project, then quietly pulls in only the specific guides it needs for that task — you don't have to pick anything yourself.

## A few words you'll see

Sieve tries to avoid jargon, but a few words come up repeatedly:

- **Agent** — your AI coding assistant itself (Claude Code, Cursor, Codex, Copilot, whichever you use).
- **Skill** — one short, focused how-to guide for a specific kind of task (e.g. "how to review code," "how to debug systematically"). Your agent only reads the ones relevant to what you're doing right now.
- **Guardrail** — a rule that's always on, no matter the task (e.g. "write a test before you write the fix"). Unlike skills, guardrails are never skipped without you being asked first.
- **Catalog** — the full collection of available skills to choose from.
- **Registry** — the online service Sieve checks to recommend which skills fit your project. If it's unreachable, Sieve just uses its own built-in catalog instead.

## How it works

The short version: not everything loads at once, so your agent isn't rereading a giant file on every single task.

- **Always on, and tiny:** the basic question ("new idea or existing project?") and the guardrail rules — under 100 lines total, in `AGENTS.md`.
- **Loaded once, based on your answer:** a short new-idea questionnaire, or a quick summary of your existing project's state.
- **Loaded only when needed:** the individual skill guides — each one is its own small file, and only the ones relevant to the current task get read at all.

Guardrails (test-first development, code review, verification before declaring done) stay on by default. If your agent ever wants to skip one, or do something outside the recommended skills, it's supposed to stop and ask you first rather than deciding on its own.

## Commands

Everything from here on is reference material for anyone who wants more control — you don't need any of it just to get started. Every command below runs as `npx sievekit <command>` in a project where Sieve is installed (or `sieve <command>` if installed globally).

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

## Related projects

Sieve is three repos on purpose, each with a different job:

- **sieve** (this repo) — the npm package. Zero runtime deps, works offline, the source of truth for `AGENTS.md` and the bundled catalog.
- **[sieve-registry](https://github.com/khoitrn/sieve-registry)** — the Cloudflare Worker + D1 API `npx sievekit init`/`add`/`check --updates` talk to for recommendations, connected sources, and hand-authored skills. The one stateful piece.
- **[sieve-dashboard](https://github.com/khoitrn/sieve-dashboard)** — a self-hosted browser UI on top of the registry: browse your skill pool, connect repos, author skills, or inspect any public repo's Sieve setup. Deploy your own copy — see its [Setup guide](https://github.com/khoitrn/sieve-dashboard#setup-run-your-own-copy).

## Contributing

Drop the skill in `staging/`, validate it, and promote it once it passes. See `staging/README.md` and `CONTRIBUTING.md`.

## License

MIT
