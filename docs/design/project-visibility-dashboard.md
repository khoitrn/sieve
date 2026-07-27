# Design doc: project-visibility-dashboard

Status: shipped (v1)
Path: feature on existing project
Last updated: 2026-07-27

The six fields below are the output of the grill. Shipped as `github.com/khoitrn/sieve-dashboard`, live at https://sieve-dashboard.pages.dev — see the decision log below for what was actually built.

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

- Local-only render (one command, opens a browser tab on the owner's machine) vs. something reachable with no repo access (needs real hosting) — still owner's call, but see Research below: the closest existing analogues both default to local-first and treat hosting as an optional later tier, not the starting design.
- Sequencing against the ECC evaluation: does the ECC study (provenance/origin metadata, the "instinct" system, `dashboard-builder`'s operator-questions framing, `skill-stocktake`'s quality-audit pattern) change the dashboard's shape before it's built, or is it a separate track? Currently being evaluated in that order — ECC functionality second.

## Research (2026-07-27)

Checked whether this idea already exists. It doesn't, in this exact shape — two adjacent categories exist instead:

- **Live hook-based observability dashboards** for Claude Code — [claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability), [Claude-Code-Agent-Monitor](https://github.com/hoangsonww/Claude-Code-Agent-Monitor), [agents-observe](https://github.com/simple10/agents-observe). These stream live hook events (PreToolUse, SessionStart, etc.) through a running local server (Bun/Node + SQLite + WebSocket) to a real-time dashboard (timelines, pulse charts, swim lanes). Built for engineers debugging concurrent agent runs, not a static at-a-glance view for a non-technical viewer. Needs a running pipeline, not a read of flat files — heavier than sieve's file-based pitch. Confirmed default deployment model for both is local-only, no accounts; hosted/multi-user is an optional later add-on, not the starting design.
- **Skill marketplaces/registries** — [skills-marketplace](https://github.com/dukelyuu/skills-marketplace), [skills-hub-registry](https://github.com/tinh2/skills-hub-registry), [agent-skills](https://github.com/tech-leads-club/agent-skills). Confirmed directly (fetched skills-hub-registry's README): these are catalog/discovery infrastructure only — "no usage analytics, per-project telemetry, or per-user visibility features." They answer "what's installable," never "what's actually used in this project."
- LLM observability platforms (Langfuse, LangSmith, Helicone) track real tool-call usage but at trace/token/cost level for arbitrary LLM apps, and require either self-hosting a real backend or a hosted account — not a read of a lightweight file-based catalog like `sieve.index.json`.

Conclusion: the gap this mock targets — flat-file-scoped, GitHub-repo view of skill/guardrail health and protocol shape, legible without a CLI — is real and unclaimed. Design-best-practice research independently converged on the same framing as ECC's `dashboard-builder` skill: organize around real operator questions (healthy / what changed / where's the drift), inverted-pyramid (summary first, drill down), not a wall of metrics — which is what the mock already does.

## Mock v2 (2026-07-27)

Rebuilt the mock at the same URL to fold the research in directly, rather than leaving it as a written note only:

- Added an explicit "Local · reads files, no account" badge — makes the local-first-by-default precedent a visible product decision, not an implicit assumption.
- Replaced the "Bridged agents" stat tile with "Guardrails intact (3/3)" — an operator question (are the always-on checks still there?), not a headcount; bridge info still lives in the architecture panel's badges.
- Added dual-channel color coding on skill rows: a left-border stripe per domain (planning/testing/review/debugging/verification), independent of the existing tier chip (catalog/guardrail), with a legend. Adapted from `claude-code-hooks-multi-agent-observability`'s app-color + session-color pattern.
- Footer now states the local-first rationale explicitly instead of leaving it unexplained.

Still pre-phase — no build decision made. The hosting-scope question is now informed by precedent but not formally closed.

## Decision log

- 2026-07-27: built a static concept mock to react to before committing to an architecture; approved as directionally right. No build decision made yet — captured here instead of proceeding on a guess.
- 2026-07-27: owner resolved the hosting-scope question: hosted website, public repos only (no GitHub auth in scope for now). Built as a separate repo, `github.com/khoitrn/sieve-dashboard`, live at https://sieve-dashboard.pages.dev. Static-export Next.js (matches thedeejay-web's Cloudflare Pages pattern) with all GitHub reads happening client-side against `raw.githubusercontent.com` — no backend, no accounts, no stored data, closer to "plain files you own" than the original server-fetch design would have been. An unconnected repo (tested against `khoitrn/khoitrn-web`) renders the honest empty state as designed, not fabricated numbers. Private-repo support (foxy, aerie) is deliberately out of scope until there's a reason to add GitHub auth.
