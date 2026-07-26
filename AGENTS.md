# Sieve

Portable agent protocol. Read this file at the start of every session and follow it.
This file is the single source of truth. It works the same whether you are Claude Code, Codex, or another agent.

## Step 0: which mode?

Before loading any skill or writing any code, decide the mode. If it is not obvious, ask.

- **New idea** (greenfield): there is nothing built yet. Your job is to build up context from zero.
- **Existing project**: work already exists. Your job is to acknowledge the current context before proposing anything.

Do not guess between these. When ambiguous, ask one question and wait.

## Path A: new idea

1. Load the `grill-me` skill. Do not write code yet.
2. Grill the idea through six fields, one at a time: goal, context, tools, loop, verification, human checkpoint.
3. Produce a short design doc using `templates/design-doc.md`, saved under `docs/design/<name>.md`. Get explicit sign-off before moving on.
4. Then continue to skill selection below.

## Path B: existing project

1. Load the `acknowledge-project` skill.
2. Read `PROGRESS.md` and existing conventions first. This is the source of truth for what is decided and what is next.
3. State your understanding back to the user. Confirm it, or flag where your read and their framing diverge, before asking anything else.
4. Suggest the next step, or start a scoped feature grill (six fields, pre-filled from the project).
5. Then continue to skill selection below.

## Skill selection

1. Match the task against the skills catalog (see `sieve.index.json`).
2. Propose a shortlist of two to five skills, each with a one-line reason.
3. Proceed on low-risk, unambiguous tasks; otherwise confirm the shortlist first. Say which you are doing.
4. Load only the shortlisted `SKILL.md` files. Never load the whole catalog.

## Guardrails (always active)

Do not skip these without explicit user approval. If a task seems to require going outside them, stop and ask first.

- **test-driven-development**: write a failing test, watch it fail, write minimal code, watch it pass, commit.
- **requesting-code-review**: review against the plan between tasks. Critical issues block progress.
- **verification-before-completion**: verify with evidence before declaring anything done. Do not claim success you have not checked.

## Approval gate

Two conditions require an explicit ask before proceeding:

- **Guardrail bypass**: you want to skip a guardrail. Cite the reason, get a clear yes.
- **Catalog deviation**: the task matches nothing in the shortlist and you want to improvise. Flag it as uncurated, ask first.

## Continuity

- Read `PROGRESS.md` at the start of a session. If it does not exist and this is an existing project, ask before assuming greenfield rules.
- Keep `PROGRESS.md` in the shape of `templates/progress.md`. Update it at the end of a session: current phase, last completed, next up, open questions.
- Record every decision or pivot as one line in the PROGRESS decision log. A mid-flight change to a grill assumption is documented there with the field that changed, never made silently.
- Append one structured line to `HISTORY.jsonl` per meaningful event (grill complete, gate fired, skill reload, task done).
- Keep `PROGRESS.md` short. Push detail into referenced files read on demand.

## Reload checkpoint

Between tasks, not mid-task, check quickly: did a shortlisted skill change, or did a better-matched skill appear? If yes, swap that single skill and note it in `HISTORY.jsonl`. If no, keep current context and proceed. Never reload the whole shortlist.

## Catalog growth

The catalog grows by use. When work reveals a gap, capture it instead of letting it vanish.

- If a task needed a skill the catalog does not have, append one line to `PROPOSED.md`. Do not improvise a permanent skill mid-task; capture the need and move on.
- If an existing skill was wrong, outdated, or misfired, append one line to `STALE.md` rather than fixing it silently.
- Run `sieve check` on a cadence to surface stale skills (by `last_reviewed`) and pending items. Triage is a human step: revise, promote, or archive.

## Local skills

Skills live in `skills/<category>/<name>/SKILL.md`. Reference them, do not paste their contents here.

- planning: `grill-me`, `acknowledge-project`, `writing-plans`
- testing: `test-driven-development`
- review: `requesting-code-review`
- debugging: `systematic-debugging`
