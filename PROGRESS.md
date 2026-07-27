# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

Published and audited. Seven skills (including verification-before-completion, added to close an audit gap), canonical templates, CI (validate + self-tests + line limit), working and pack-tested `sieve init`, `sieve check` for catalog health, per-agent bridges, PROPOSED/STALE capture files, LICENSE, CONTRIBUTING, issue/PR templates. Published to npm as `sievekit@0.1.0`; `github.com/khoitrn/sieve` is public. A full doc-vs-code audit against the architecture diagram found and closed two real gaps (missing guardrail skill, stale docs). Code and docs are fully aligned; only the diagram image itself is stale, pending a manual re-export.

## Last completed

Ran an end-to-end audit against the architecture diagram, docs/design/sieve.md, AGENTS.md, and HANDOFF.md. Added the missing verification-before-completion guardrail skill (matching the shape of the other two guardrails) and indexed it. Synced HANDOFF.md, bin/cli.js's header comment, and README.md to current reality (all were describing a superseded Stage 1 state or undercounting the catalog).

## Next up

1. Owner to re-export the diagram (source lives outside this repo; the shipped file is a flattened PNG at `~/Downloads/sieve_architecture_v5_shipped.png` with no Mermaid/Excalidraw/drawio source to edit programmatically). Two fixes needed in the next export: drop the tier-check claim from the maintenance-lane "Validate" box (validator only checks frontmatter + dedupe; tier lives solely in `sieve.index.json`), and rename the contrib lane from "Staging (contrib/)" to "Staging (staging/)" to match the real directory.
2. Real outside-user test remains open: someone who did not build Sieve running `npx sievekit init` cold, with no explanation. Still owner-only; nothing further to build until this returns signal.

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
