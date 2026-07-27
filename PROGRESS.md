# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

Published and audited (seven skills, CI, `sieve init`/`sieve check`, per-agent bridges, growth-loop capture files). Alongside that, a new feature idea is now in pre-phase evaluation: project-visibility ("what skills are being used, for a non-technical viewer, maybe GitHub-connected"). A static concept mock was built and approved as directionally right; no build decision yet. See `docs/design/project-visibility-dashboard.md`.

## Last completed

Built and reviewed a static concept mock of a project-visibility dashboard (repo picker, skill usage panel, protocol architecture diagram, agent-bridge badges, real HISTORY.jsonl tail): https://claude.ai/code/artifact/34c328d6-28a6-435f-b1eb-0036ca9711d1. Reaction: "this is the pre-phase of my idea."

## Next up

1. Evaluating two things in order: (a) the project-visibility dashboard idea — open question is local-only render vs. something needing real hosting, see `docs/design/project-visibility-dashboard.md`; (b) `github.com/affaan-m/ecc` for functionality worth adapting in sieve-sized form (skill provenance/origin metadata, the "instinct" learned-preference system, `dashboard-builder`'s operator-questions framing, `skill-stocktake`'s quality-audit pattern) — not a wholesale import, ECC's 268-skill maximalist catalog runs counter to sieve's grow-by-use design.
2. Owner to re-export the architecture diagram (source lives outside this repo; the shipped file is a flattened PNG at `~/Downloads/sieve_architecture_v5_shipped.png` with no Mermaid/Excalidraw/drawio source to edit programmatically). Two fixes needed in the next export: drop the tier-check claim from the maintenance-lane "Validate" box, and rename the contrib lane from "Staging (contrib/)" to "Staging (staging/)".
3. Real outside-user test remains open: someone who did not build Sieve running `npx sievekit init` cold, with no explanation. Still owner-only; nothing further to build until this returns signal.

## Resolved

- Enforcement is guidance-first for v1; a Claude Code PreToolUse hook is a later optional enhancement, out of scope for release. Reason: it is Claude Code only and Sieve must stay cross-agent.

## Decision log

- 2026-07-25: foundation scaffolded, guidance-first enforcement chosen over mechanical, later stages deferred until defaults prove out.
- 2026-07-26: added canonical templates and wired them into AGENTS.md; design docs live under docs/design/.
- 2026-07-26: built core catalog depth (systematic-debugging, writing-plans) plus CI validation.
- 2026-07-26: reframed the whole project as universal and distributable from the start; built a working init scaffolder, LICENSE, and CONTRIBUTING.
- 2026-07-26: made the package npm-publish-ready (metadata, self-tests, templates, pack-tested install) and resolved enforcement as guidance-first for v1. Remaining steps require the owner's npm and GitHub accounts.
- 2026-07-26: closed the growth loop (PROPOSED.md, STALE.md, protocol capture lines, real sieve check). The architecture is now complete except for deferred-by-design pieces (dashboard, enforcement hook) and owner-only steps (publish).
- 2026-07-26: published to npm as `sievekit` (name `sieve` was taken), made `github.com/khoitrn/sieve` public, verified with a live `npx sievekit init` install test.
- 2026-07-26: ran a full docs-vs-diagram-vs-code audit. Added the missing verification-before-completion skill and indexed it. Synced HANDOFF.md, bin/cli.js, and README.md to current reality. The tier-validation gap (diagram claims a check the validator does not perform) is unresolved pending an owner decision on whether to fix the diagram or the validator.
- 2026-07-26: owner decided to fix the diagram, not the validator (tier check stays out of code). Blocked on a manual re-export since the shipped PNG has no editable source; two label fixes queued for that pass (drop tier claim, fix "contrib/" → "staging/").
- 2026-07-27: opened a new feature evaluation (project-visibility dashboard) rather than treating the deferred-dashboard decision as final; a static mock was built first instead of designing against no data. Sequenced ahead of the ECC functionality study, per owner's stated order.
