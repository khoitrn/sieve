# Sieve

A portable, file-based agent protocol and skill library that installs in one command and works the same across Claude Code, Codex, and other coding agents.

![status](https://img.shields.io/badge/status-alpha-orange)
![node](https://img.shields.io/badge/node-%3E%3D18-green)
![license](https://img.shields.io/badge/license-MIT-blue)

## Install

Scaffold Sieve into any project with one command:

```
npx sievekit init
```

That copies the protocol and skills in, seeds your project state, and writes pointer files for whichever agents you use. Then open your coding agent in that folder and describe what you want to build.

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
- **On the chosen path only:** new idea loads a grill; existing project reads state and confirms it.
- **Lazy, per task:** individual `SKILL.md` files load only when the shortlist selects them.

Guardrails (test-driven development, code review, verification) stay active by default. Anything that bypasses a guardrail or improvises past the shortlist hits an approval gate and asks first.

## What is inside

- `AGENTS.md`: the protocol. Fork, guardrails, skill selection, approval gate, continuity.
- `CLAUDE.md`: a one-line bridge that imports `AGENTS.md`.
- `skills/<category>/<name>/SKILL.md`: the catalog.
  - planning: `grill-me`, `acknowledge-project`
  - testing: `test-driven-development`
  - review: `requesting-code-review`
- `sieve.index.json`: the machine-readable catalog index.
- `scripts/validate-skill.mjs`: the validation gate for contributed skills.
- `scripts/init.mjs`: scaffolds Sieve into any project with one command.
- `scripts/bridge.mjs`: writes pointer files for agents that do not read `AGENTS.md` natively.
- `PROGRESS.md`, `HISTORY.jsonl`: continuity and a structured event log.
- `staging/`: where contributed skills land before validation.

## Creating a skill

Add `skills/<category>/<name>/SKILL.md` with `name` and `description` frontmatter (the description is the trigger). Keep the body under 500 lines; push detail into `references/`. Then validate:

```
node scripts/validate-skill.mjs skills/<category>/<name>/SKILL.md
```

## Contributing

Drop the skill in `staging/`, validate it, and promote it once it passes. See `staging/README.md`.

## License

MIT
