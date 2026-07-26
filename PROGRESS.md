# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

Stage 1 foundation scaffolded. Standard-conforming file layout in place: thin AGENTS.md source of truth, CLAUDE.md bridge, four starter skills, catalog index, validate script, CLI stub.

## Last completed

Foundation commit: AGENTS.md, CLAUDE.md, skills/ (grill-me, acknowledge-project, test-driven-development, requesting-code-review), sieve.index.json, validate-skill.mjs, bin/cli.js stub.

## Next up

1. Live with the four skills across one real project; confirm the defaults are good before adding more.
2. Wire the validate script into the staging lane so uploads are checked mechanically.
3. Stage 2: build out `npx sieve init` agent detection (Claude Code, Codex) and AGENTS.md generation.

## Open questions

- Which enforcement to make mechanical first: a PreToolUse hook for TDD on Claude Code, or keep guidance-only until the catalog has proven itself?
- Personal harness vs. distributable package: build for me first, open up once defaults hold.
