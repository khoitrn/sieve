# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

Stage 1 foundation scaffolded. Standard-conforming file layout in place: thin AGENTS.md source of truth, CLAUDE.md bridge, four starter skills, catalog index, validate script, CLI stub.

## Last completed

Foundation commit: AGENTS.md, CLAUDE.md, skills/ (grill-me, acknowledge-project, test-driven-development, requesting-code-review), sieve.index.json, validate-skill.mjs, bin/cli.js stub.

## Decisions (2026-07-26)

- **TDD enforcement stays guidance-only.** No PreToolUse hook yet; too high-stakes to hardcode before the four default skills have survived real use.
- **Scope pivots to distributable-from-the-start.** Reverses HANDOFF.md's original "personal harness first" bias. Stage 2 (`npx sieve init` full scaffold, npm publish) is now a near-term priority, not gated behind a private real-use test first.

## Next up

1. CI enforcement: done (`.github/workflows/validate.yml`, green).
2. Wire the validate script into the staging lane so uploads are checked mechanically.
3. Stage 2, now prioritized: build out `npx sieve init` full scaffold (copy AGENTS.md + skills/ into a target repo, write a lockfile) and prep for `npm publish` so it works for strangers.
4. Still worth doing, no longer gating: live with the four skills on a real project (engenium/TxCR) to sanity-check the defaults, in parallel with distribution work rather than before it.

## Open questions

- None currently open. Both prior open questions were resolved 2026-07-26 (see Decisions above).
