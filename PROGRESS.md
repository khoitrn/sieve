# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

Published and audited (eight skills, CI, `sieve init`/`sieve check`, per-agent bridges, growth-loop capture files). The project-visibility dashboard idea moved past pre-phase: built and shipped as a real, separate, hosted app. See `docs/design/project-visibility-dashboard.md`. A central skill registry now exists too, with one-click onboarding replacing manual catalog copying.

## Last completed

Built and deployed `sieve-registry` (new repo, Cloudflare Worker + D1, `https://sieve-registry.khoitrn.workers.dev`) — a central database of the skill catalog that `sieve init` pulls a recommended shortlist from, instead of always copying every skill. Added `scripts/onboard.mjs` as the new default `init` path: a short interview (new idea vs existing project, focus keywords), a call to the registry's `/api/recommend` (rule-based tag matching, no ML/LLM scoring in v1), selective install of just guardrails + the matched shortlist, and an assignment record written back to the registry (`/api/projects/:id/assign`). `scripts/init.mjs` (full bundled catalog, no prompts, no network) is preserved as the `--all`/`--offline` path for CI/scripted use, since Sieve must keep working with zero network access. Verified end to end against the live registry (selective pull + registry-side assignment record) and with the registry deliberately unreachable (clean fallback to the full catalog, no crash).

## Next up

1. `sieve check --updates`: diff the local `.sieve/project.json` (now written by `onboard.mjs`) against the registry's current skill versions and report drift — the registry's `/api/skills` already carries `version`, so this is additive, not a new source of truth.
2. A publish workflow for getting new/edited skills *into* the registry after the initial seed — today the registry is seeded once from `sieve.index.json` and has no update path of its own yet.
3. sieve-dashboard: private-repo support (foxy, aerie) would need a GitHub OAuth/token flow — deliberately deferred, not yet needed.
4. Owner to re-export the architecture diagram (source lives outside this repo; the shipped file is a flattened PNG at `~/Downloads/sieve_architecture_v5_shipped.png` with no Mermaid/Excalidraw/drawio source to edit programmatically). Two fixes needed in the next export: drop the tier-check claim from the maintenance-lane "Validate" box, and rename the contrib lane from "Staging (contrib/)" to "Staging (staging/)". The diagram should also gain the eighth skill (`skill-stocktake`), its `maintenance` category, and the new registry piece.
5. Real outside-user test remains open: someone who did not build Sieve running `npx sievekit init` cold, with no explanation. Still owner-only; nothing further to build until this returns signal.

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
- 2026-07-29: owner requested a central skill registry and one-click onboarding, another explicit exception to grow-by-use (flagged the tradeoff — no multi-repo usage data yet justifying a registry — owner proceeded anyway). Built `sieve-registry` as a third, separate repo rather than folding it into `sieve` (must stay zero-dependency and offline-capable) or `sieve-dashboard` (states its own no-database, read-only design goal). Registry recommendation logic is v1 rule-based tag matching, explicitly not ML/LLM-based, matching the project's existing bias against building ahead of real usage data. `sieve init` defaults to the interview+registry path now; `--all`/`--offline` preserves the old no-network behavior.
