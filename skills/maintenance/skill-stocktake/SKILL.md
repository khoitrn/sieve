---
name: skill-stocktake
description: >
  Audit the whole skill catalog for overlap, staleness, and real usage, and assign
  each skill a verdict with an evidence-backed reason. Use on a periodic cadence,
  after `sieve check` surfaces a backlog, or when the user says "stocktake the
  skills", "audit the catalog", or "which skills are still earning their place".
  Not for reviewing a single skill mid-task; use STALE.md for that.
version: 1.0.0
triggers:
  - "stocktake the skills"
  - "audit the catalog"
  - "which skills are still earning their place"
  - "skill stocktake"
tags: [maintenance, catalog, quality]
last_reviewed: 2026-07-27
origin: ECC adaptation (skill-stocktake pattern, scaled down for sieve's file-based, no-database catalog)
---

# Skill stocktake

Sieve's catalog grows by use. This is the other half: periodically confirm every
skill still earns its place. Adapted from a larger competitor's audit pattern,
scaled down since sieve has a handful of skills, not hundreds; no batching, no
subagent orchestration, no separate results store. `sieve check` already reports
staleness by `last_reviewed` and counts pending `PROPOSED.md`/`STALE.md` items;
this skill adds the judgment pass those numbers cannot do on their own.

## Process

1. **Run `sieve check`.** Note which skills are past the staleness window and how
   many growth-loop items are pending.
2. **Pull usage signal.** For each skill in `sieve.index.json`, grep its name in
   `HISTORY.jsonl` to see how often it has actually been loaded or referenced. Zero
   hits is a signal, not a verdict on its own; a guardrail with zero hits may just
   mean nothing tripped it yet.
3. **Evaluate each skill against this checklist:**
   - **Overlap.** Does it duplicate another skill's job, or content already covered
     in `AGENTS.md` or `PROGRESS.md`? A skill that does two things should be two
     skills, per `CONTRIBUTING.md`; two skills that do the same thing should be one.
   - **Currency.** If the skill references a tool, API, or convention, is it still
     accurate?
   - **Usage.** Does `HISTORY.jsonl` show it firing, or has it gone quiet?
   - **Origin.** Read `origin:` for context on why the skill exists, not as a factor
     in the verdict. Evaluation is blind to where a skill came from.
4. **Assign one verdict per skill**, each with a reason specific enough to act on:
   - **Keep**: earning its place, no action.
   - **Improve**: right skill, weak execution (unclear trigger, thin verification).
   - **Update**: content has drifted from current reality.
   - **Retire**: no longer earning its place; propose removal.
   - **Merge**: overlaps another skill closely enough that one should absorb it.

   A reason like "unchanged" or "looks fine" is not acceptable. Say what you
   checked: "zero `HISTORY.jsonl` hits in 90 days and its one trigger phrase is a
   subset of `systematic-debugging`'s" is a reason; "still relevant" is not.
5. **Report the verdicts to the user.** Keep and Improve can be noted and left for
   the next normal edit. Retire and Merge require the user's explicit sign-off
   before anything is deleted or folded together; this is a human checkpoint, not
   an automatic action.
6. **Record the outcome.** Append one line to `HISTORY.jsonl` for the stocktake
   itself. For any Retire or Merge the user confirms, log it as a decision line in
   `PROGRESS.md` and carry out the change through the normal skill lifecycle
   (remove or edit the `skills/` entry and `sieve.index.json` together).

## Rules

- Evaluate content and usage, not tenure. An old skill with real usage outranks a
  new one with none.
- Never retire or merge a skill without explicit user confirmation, even if the
  evidence looks conclusive.
- Do not invent a new results file or state store for this. `HISTORY.jsonl`,
  `PROGRESS.md`, and `STALE.md` are sieve's existing persistence layer; use them.
