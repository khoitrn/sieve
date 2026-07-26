# Sieve: Handoff for Claude Code

Read this file fully before doing anything. It carries the reasoning behind Sieve, not just the what. Several design choices below look like gaps but are deliberate. Do not "fix" them without asking. This document uses no em dashes, matching the project's writing convention; keep it that way in anything you write here.

## What Sieve is, in one line

A portable, file-based agent protocol and skill library that installs in one command and behaves the same across coding agents (Claude Code, Codex, Cursor, Gemini CLI, and others), so working judgment lives in files the developer controls rather than in any single vendor's memory system.

## The thesis (why this exists)

Agent memory and enforcement are vendor-locked. Auto memory and hooks are Claude Code only; Codex, Gemini, and Cursor each have their own siloed mechanisms. A developer's way of working should not be hostage to one vendor's roadmap or pricing. Sieve relocates the durable layer (protocol, guardrails, skills, project state) into plain files in the repo that every agent reads, and treats each vendor's native machinery (hooks, auto memory) as a removable enhancement layered on top, never the foundation.

The same class of problem, knowledge walking out the door when a person or a tool leaves, applies to any team; Sieve points the fix at agents instead of people.

## The core design, decision by decision

1. **AGENTS.md is the single source of truth.** It is the cross-tool open standard read natively by 30+ agents. It holds the entire protocol and stays thin (under 100 lines) so it loads reliably and does not blow the token budget. Every other agent-specific file (CLAUDE.md, GEMINI.md, etc.) is a thin pointer back to it, never a duplicate. Do not fatten AGENTS.md. If it needs more, push detail into referenced files.

2. **Two paths, forked at the very top.** The first move in any session is to decide: new idea (greenfield, build context from zero) or existing project (absorb and confirm existing context before proposing anything). These are genuinely different and must not be collapsed. When ambiguous, ask, do not guess.
   - New idea path: load `grill-me`, interrogate the idea through six fields (goal, context, tools, loop, verification, human checkpoint), produce a design doc, get sign-off, then build.
   - Existing project path: load `acknowledge-project`, read PROGRESS.md and conventions silently first, state understanding back to the user, confirm or flag divergence, then suggest next step or a scoped feature grill.

3. **Guardrails are always active but not tyrannical.** Test-driven development, code review, and verification-before-completion run by default. But skills beyond those are proposed as a shortlist per task, not hardcoded. An approval gate requires an explicit ask before either bypassing a guardrail or improvising past the shortlist. This is deliberately softer than a rigid "mandatory skills" system; the flexibility is the point.

4. **Three context load tiers, for scale and token cost.** This is the key architectural idea. Tier 1 (always loaded, tiny): the fork and guardrail names in AGENTS.md. Tier 2 (loaded on the chosen path only): the other path never enters context. Tier 3 (lazy, per task): individual SKILL.md files load only when the shortlist selects them. A catalog of hundreds of skills costs nothing at rest because nothing loads until the task needs it. Preserve this. Never load the whole catalog into context.

5. **Continuity lives on disk, not in the model's head.** PROGRESS.md is the source of truth for where things stand and what is next, read at session start. HISTORY.jsonl is a structured, append-only event log (one line per meaningful event). This exists because plan mode does not reliably carry state across sessions. The structured log is also the future foundation for observability and a personal dashboard, so keep it machine-readable (JSONL), not prose.

6. **The catalog grows by use, not by design.** Skills earn their place by being proposed and accepted in real tasks; stale ones get flagged and archived, not silently kept. There is a staging lane (staging/) where contributed or uploaded skills land before validation, and a validate script that mechanically checks them before they enter the live catalog. This is the one place enforcement is real code, not guidance, because it is the safety boundary for anything contributed.

7. **A reload checkpoint between tasks.** Skills change over time. Between tasks (never mid-task, to avoid thrashing context) the agent checks whether a shortlisted skill changed or a better one appeared, and swaps only that single skill if worth it. It never reloads the whole shortlist. This is a think-first gate, not an auto-reload, because blind reloading defeats the token efficiency.

8. **A mid-flight validation trigger.** Ideas get re-checked mid-build, not just once at the top. If reality diverges from an assumption made during the grill, the design doc is not frozen; a scoped re-grill updates only the box that changed, versioned in PROGRESS.md so a pivot is documented rather than silent.

## What is deliberately NOT built yet (do not build without asking)

These are staged on purpose. Building them before the defaults prove out in real use is the exact scope creep the design avoids.

- **Full `sieve init` scaffolding into a target repo.** Currently stubbed. It should eventually copy AGENTS.md plus skills into a target project, run bridge, and write a lockfile. Stage 2.
- **npm publish** so `npx sieve init` works for strangers. Stage 2.
- **PreToolUse hook enforcement** (making TDD a mechanical wall on Claude Code). Deferred until the guidance version has been lived with and it is clear which guardrail is worth making a wall. Higher stakes because it can block real work.
- **SessionStart hook** for auto-loading the protocol. Low risk, worth building early, but Claude Code only, so it is the ceiling not the floor.
- **The staleness `check` command, growth loop automation, and any dashboard.** Stage 3. These need weeks of real HISTORY.jsonl data to be worth building; building now means guessing at what they should show.

## Current state (what exists in the repo)

```
sieve/
├── AGENTS.md            source of truth: fork, guardrails, selection, gate, continuity, reload
├── CLAUDE.md            @AGENTS.md import bridge
├── README.md            inverted-pyramid, install above the fold
├── package.json         bin: sieve, npx-ready
├── bin/cli.js           validate + bridge work; init/check stubbed
├── sieve.index.json     catalog index, agentskills.io 0.2.0 field shape
├── scripts/
│   ├── validate-skill.mjs   the validation gate (real code, tested)
│   └── bridge.mjs           writes pointer files for non-AGENTS.md agents
├── PROGRESS.md          continuity, seeded
├── HISTORY.jsonl        structured event log, seeded
├── skills/
│   ├── planning/grill-me/SKILL.md
│   ├── planning/acknowledge-project/SKILL.md
│   ├── testing/test-driven-development/SKILL.md
│   └── review/requesting-code-review/SKILL.md
└── staging/README.md    contrib lane
```

Verified working: all four skills pass `node bin/cli.js validate`; the validate gate correctly rejects a bad skill and exits nonzero; `node bin/cli.js bridge` writes pointer files for Claude Code, Gemini CLI, Copilot, Cursor, and Windsurf; `bridge --detect` writes only for agents whose config dirs exist.

## Step by step: what to do, in order

### Step 1: push to a repo (needs the user's git auth)
1. Confirm `gh` is installed and authenticated (`gh auth status`), or that the user has created an empty GitHub repo named `sieve`.
2. If using gh: `gh repo create sieve --private --source=. --remote=origin` (adjust visibility as the user prefers). Otherwise add the remote manually.
3. `git init && git add . && git commit -m "Sieve foundation: cross-agent protocol, skill catalog, validate + bridge"`
4. `git branch -M main && git push -u origin main`
5. Report the repo URL back.

### Step 2: verify the foundation
1. `node bin/cli.js validate` (expect all 4 skills OK, exit 0).
2. `node bin/cli.js bridge --detect` (writes pointer files for detected agents only).
3. Confirm AGENTS.md is under 100 lines.

### Step 3: set up cheap enforcement (high value, low risk)
1. Add a GitHub Action at `.github/workflows/validate.yml` that runs `node bin/cli.js validate` on every push and PR. This is the first place guidance becomes enforcement for free. Do not skip validation on failure; a broken skill should fail the build.
2. Optionally add a pre-commit hook running the same check.

### Step 4: the real test (do this before any Stage 2 work)
1. A user who did not build Sieve installs it into their own repo with one command and uses it for a few sessions. This is the eval for whether the defaults and the fork work for someone who is not the author.
2. Do not build Stage 2 until the defaults have survived real use. If they do not hold up, the fix is to improve the skills and AGENTS.md, not to add more machinery.

### Step 5: resolve the one open decision
The open question in PROGRESS.md: whether to build a PreToolUse hook that mechanically enforces TDD on Claude Code, or stay guidance-only until the catalog proves itself. Surface this to the user; do not decide it unilaterally.

## How to confirm you carried the idea correctly

Before writing code, read AGENTS.md, PROGRESS.md, and this file, then summarize back to the user: what Sieve is, what is done, and what is next. The summary must show you understand three things:
1. This is an existing project (Path B), not a new idea.
2. The thesis is portability and developer-controlled files, escaping vendor lock.
3. The thin AGENTS.md, the guidance-first enforcement, and the stubbed Stage 2/3 are intentional, not bugs to fix.

If your summary gets any of these wrong, stop and re-read. Getting this right is the whole point of the handoff.

## Conventions to follow in this repo

- No em dashes anywhere. Use commas, periods, semicolons, colons, or parentheses.
- Active voice, concise, first person where appropriate.
- AGENTS.md stays under 100 lines. Skill bodies stay under 500 lines; push detail into references/.
- Skills are referenced from AGENTS.md, never pasted into it.
- Every meaningful action appends one line to HISTORY.jsonl.
- When a handoff or session drifts, the fix is to improve the files, not to re-explain to the agent. The files are the only channel that survives a fresh session.
