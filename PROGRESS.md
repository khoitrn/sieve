# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

Published and audited (eight skills, CI, `sieve init`/`sieve check`, per-agent bridges, growth-loop capture files). The project-visibility dashboard idea moved past pre-phase: built and shipped as a real, separate, hosted app. See `docs/design/project-visibility-dashboard.md`.

## Last completed

Evaluated `github.com/affaan-m/ecc` and adapted the two pieces that were sieve-sized: added an `origin:` frontmatter field to all skills (provenance, no schema change needed), and added `skill-stocktake` as an eighth catalog skill, a periodic audit pass that assigns each skill a Keep/Improve/Update/Retire/Merge verdict with an evidence-backed reason, using `HISTORY.jsonl` usage counts and `sieve check` staleness output rather than inventing a new results store. ECC's "instinct" learned-preference system (background daemon, JSONL observation stream, confidence-decay math) was evaluated and rejected as strictly more machinery than sieve's existing HISTORY.jsonl-to-PROPOSED.md loop. `dashboard-builder`'s operator-questions framing was evaluated and rejected as not portable as a standalone piece (it is a one-page heuristic, not a system).

## Next up

1. sieve-dashboard: private-repo support (foxy, aerie) would need a GitHub OAuth/token flow — deliberately deferred, not yet needed.
2. Owner to re-export the architecture diagram (source lives outside this repo; the shipped file is a flattened PNG at `~/Downloads/sieve_architecture_v5_shipped.png` with no Mermaid/Excalidraw/drawio source to edit programmatically). Two fixes needed in the next export: drop the tier-check claim from the maintenance-lane "Validate" box, and rename the contrib lane from "Staging (contrib/)" to "Staging (staging/)". The diagram should also gain the eighth skill (`skill-stocktake`) and its new `maintenance` category.
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
- 2026-07-27: resolved the mock's blocking hosting-scope question — hosted, public-repos-only (no GitHub auth). Built as a separate repo (`sieve-dashboard`), not a feature of the `sievekit` package, since it's a standalone viewer of repos with its own deploy lifecycle. Shipped as a static export to Cloudflare Pages, matching the existing thedeejay-web pattern, with all GitHub reads happening client-side (raw.githubusercontent.com has permissive CORS) — no backend at all.
- 2026-07-27: closed the ECC functionality study. Owner chose to implement both portable pieces immediately rather than route them through PROPOSED.md, an explicit exception to grow-by-use since the pieces were externally pre-validated by ECC's own usage, not guessed. Added `origin:` frontmatter to all skills and shipped `skill-stocktake` as the eighth catalog skill (new `maintenance` category), scaled down from ECC's subagent-batched version to a plain checklist skill that reuses HISTORY.jsonl/PROGRESS.md/STALE.md instead of a new results store. Rejected the "instinct" system (too much machinery, sieve's own growth loop is already the minimal analog) and `dashboard-builder`'s framing (a one-page heuristic, not a portable system).
