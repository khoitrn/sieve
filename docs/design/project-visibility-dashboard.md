# Design doc: project-visibility-dashboard

Status: draft
Path: feature on existing project
Last updated: 2026-07-27

The six fields below are the output of the grill. Context and tools are pre-filled from the project; goal, loop, and verification are still open — this is a pre-phase idea, not an approved build.

## 1. Goal

Not settled yet. Working goal: someone who doesn't touch sieve's CLI — potentially non-technical — can look at a project and see which skills exist, which are guardrails vs. catalog, how often each has actually fired, and how the protocol pieces (`AGENTS.md` → guardrails/catalog → agent session → `PROGRESS.md`/`HISTORY.jsonl`) fit together.

Open and unresolved: does "look at a project" mean opening a page on the owner's own machine (no accounts, no hosting), or does it need to be reachable by someone with no access to the repo at all (which would require real hosting)? This decides the whole architecture and hasn't been picked.

## 2. Context

Sieve is file-based: `sieve.index.json` (catalog), `HISTORY.jsonl` (event log), `PROGRESS.md` (continuity). No backend or accounts exist today. The observability dashboard was already deferred in `NEXT.md`, pending real usage data — as of this writing `HISTORY.jsonl` has 14 lines, all from building sieve itself; zero outside users.

A static concept mock was built and reviewed: https://claude.ai/code/artifact/34c328d6-28a6-435f-b1eb-0036ca9711d1. It shows a repo picker (sieve / foxy / aerie), a skill-usage panel (tier chip, usage bar, last-used date), an architecture diagram of the actual protocol flow, agent-bridge badges pulled from `scripts/bridge.mjs`, and a real `HISTORY.jsonl` tail. It also modeled the "unconnected repo" case — a repo with no `AGENTS.md` gets an honest empty state and an install prompt instead of fabricated numbers. Reaction: "this is the pre-phase of my idea" — directionally right, not yet a build decision.

Running in parallel: an evaluation of `github.com/affaan-m/ecc`, a much larger (268-skill, maximalist) competing project, for pieces worth adapting in sieve-sized form — see Open questions.

## 3. Tools

Whatever gets built has to stay consistent with sieve's core pitch — "plain files you own, not vendor-locked." A render of existing local files, not a new hosted data store, unless the "reachable without repo access" branch of the goal is deliberately chosen.

## 4. Loop

Not yet defined. Blocked on the goal's hosting-scope question above.

## 5. Verification

Not yet defined. Blocked on the goal.

## 6. Human checkpoint

Owner decides local-only vs. hosted before any real build starts. The mock itself was the first checkpoint and passed.

## Open questions

- Local-only render (one command, opens a browser tab on the owner's machine) vs. something reachable with no repo access (needs real hosting) — unresolved, decides the architecture.
- Sequencing against the ECC evaluation: does the ECC study (provenance/origin metadata, the "instinct" system, `dashboard-builder`'s operator-questions framing, `skill-stocktake`'s quality-audit pattern) change the dashboard's shape before it's built, or is it a separate track? Currently being evaluated in that order — ECC functionality second.

## Decision log

- 2026-07-27: built a static concept mock to react to before committing to an architecture; approved as directionally right. No build decision made yet — captured here instead of proceeding on a guess.
