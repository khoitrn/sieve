# Design doc: sieve

Status: approved
Path: new idea
Last updated: 2026-07-26

Sieve's own design, produced in Sieve's format. The six fields below are the settled definition; the decision log records how it got here. Sieve is built to be distributed from the start, so this doc is written for any developer, not any single project.

## 1. Goal

Done is a portable, file-based agent protocol that any developer can adopt in one command and that:

- installs and loads across Claude Code, Codex, and other coding agents from one source of truth (AGENTS.md), with per-agent pointer files for the few that read a different name;
- makes the fork, guardrails, and skill selection fire consistently without the user hand-invoking them;
- carries project state across sessions on disk (PROGRESS.md, HISTORY.jsonl) so no session starts from zero.

Checkable v1 success: a developer who did not build Sieve can install it into their own repo with one command and get value in the first session, without being told how the protocol works and without editing anything by hand.

## 2. Context

Every coding agent locks its memory and enforcement to itself. Auto memory and hooks are Claude Code only; Codex, Gemini, and Cursor each have their own siloed mechanisms. A developer's way of working should not be stranded when they switch tools. Existing tools (Superpowers, grill-me, gstack) each solve one slice (intake, or enforcement, or catalog) but none connect intake to enforcement to cross-agent portability in a single installable package. Sieve fills that gap and is distributable from day one, not a personal harness that gets opened up later.

## 3. Tools

- Plain files (markdown, JSON, JSONL) as the portable floor. This is the layer every agent reads.
- A Node.js CLI (npx sieve) for init, validate, and bridge.
- The AGENTS.md open standard plus generated per-agent bridge files.
- Claude Code hooks as an optional enforcement ceiling, layered on top, never the foundation.

Off the table: vendor-specific memory systems as the foundation; a heavyweight bespoke installer (wrap the existing npx skills model where possible, do not reinvent it); per-invocation update checks that burn tokens every run.

## 4. Loop

Fork (new idea or existing project), then path-specific intake (grill, or acknowledge-and-confirm), then skill shortlist, then approval gate, then execute with guardrails, then update state and history, then a reload checkpoint before the next task. A mid-flight validation trigger can re-enter and re-grill a single changed field. The catalog grows by use: skills are proposed, validated in staging, and promoted by pull request. The loop stops on a task when its verification passes and PROGRESS.md is updated.

## 5. Verification

Checkable, not judged. Concrete checks:

- node bin/cli.js validate exits 0 on a clean catalog.
- validate rejects a malformed skill and exits nonzero.
- init scaffolds a fresh empty directory into a working Sieve project and bridge writes correct pointer files for detected agents.
- AGENTS.md stays under 100 lines.
- A fresh agent, given one natural-language prompt, asks the fork question and loads only the right skills.
- A new user, not the author, installs Sieve into their own repo and reaches first value without editing files by hand.

CI runs the validate and line-limit checks on every push so a broken skill or a bloated AGENTS.md fails the build.

## 6. Human checkpoint

Risk-scoped, not uniform. A human yes is required at: design-doc sign-off (Path A), understanding confirmation (Path B), guardrail bypass, catalog deviation, and merging a contributed skill into the live catalog. Low-risk, in-shortlist tasks proceed without a gate, to avoid approval fatigue.

## Open questions

- Distribution channel: npm as the primary install, with npx skills compatibility as a secondary path.

## Resolved

- Enforcement is guidance-first for v1. Mechanical enforcement (a PreToolUse hook for TDD) is out of scope for the first release because it is Claude Code only and Sieve must stay cross-agent. The guardrails and approval gate work by protocol and the risk-scoped human checkpoints; CI enforces the checkable parts (validate, line limit). A hook can be added later as an optional Claude Code enhancement without changing the file layer.

## Decision log

- 2026-07-25: chose AGENTS.md as the single source of truth, kept thin, with per-agent bridges. Reason: it is the cross-tool standard and keeps token cost flat.
- 2026-07-25: chose guidance-first enforcement over mandatory-always, with a risk-scoped approval gate. Reason: flexibility to ask beats rigidity, and mechanical enforcement is Claude Code only.
- 2026-07-26: added canonical output templates so continuity survives across sessions.
- 2026-07-26: reframed the project as universal and distributable from the start, overriding the earlier build-for-one-user-first approach. Reason: the goal is a tool any developer installs, so the success criteria, docs, and next steps must target a stranger, not the author.
- 2026-07-26: made the package npm-publish-ready and resolved enforcement as guidance-first for v1.
- 2026-07-26: closed the growth loop. Added PROPOSED.md and STALE.md capture files (seeded by init), protocol lines directing the agent to append to them, and a real sieve check that reports stale skills by last_reviewed and pending items. Reason: without an internal usage-signal input, grow-by-use was aspirational; the catalog could take outside contributions but not learn from its own sessions.
