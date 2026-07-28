# Contributing to Sieve

Sieve is built to be used and extended by anyone. The most valuable contribution is a good skill. This guide covers how to add one.

## The contribution model

The catalog grows by use, not by design. A skill earns its place by being useful in real work, validated, and reviewed. Contributions flow through a staging lane so nothing enters the live catalog unchecked.

Two files capture signals from real sessions: `PROPOSED.md` (a skill the catalog was missing) and `STALE.md` (an existing skill that is wrong or outdated). Run `sieve check` on a cadence to surface these plus skills past their staleness window, then triage: draft, revise, promote, or archive.

## Adding a skill

1. **Draft it in staging.** Create `staging/<name>/SKILL.md`. Do not put it in `skills/` directly.
2. **Follow the shape.** Required frontmatter is `name` and `description`. The description is the trigger: say what the skill does and when to use it, with the phrases a user would type. Keep the body under 500 lines; push detail into a `references/` folder next to the skill. Add `origin: <who or where this came from>` (e.g. `sieve`, `community`, or a name) so a skill-stocktake pass can weigh contribution history, not just content.
3. **Validate it.**
   ```
   node bin/cli.js validate staging/<name>/SKILL.md
   ```
   The check enforces the name format, required fields, size limits, and duplicate names. Fix anything it reports.
4. **Promote it.** Move the folder from `staging/<name>/` to `skills/<category>/<name>/`, and add a matching entry to `sieve.index.json`.
5. **Open a pull request.** CI runs validation on every PR. A maintainer reviews for fit and quality before merge. Merging a skill into the live catalog is a human checkpoint, not automatic.

## What makes a good skill

- One clear job. A skill that does two things should be two skills.
- Triggers that match how people actually phrase the need, not how the author thinks about it.
- Verification that is checkable, not a matter of taste.
- No dependence on any one project or user. Skills must be useful to anyone.

## Conventions

- No em dashes. Use commas, periods, semicolons, colons, or parentheses.
- Active voice, concise.
- Reference skills from AGENTS.md; never paste skill bodies into it.
- Keep AGENTS.md under 100 lines. CI fails the build if it exceeds that.

## Reporting issues

Open an issue describing the problem, the agent and version you used, and a reproduction if you have one.
