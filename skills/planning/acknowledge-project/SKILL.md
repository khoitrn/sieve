---
name: acknowledge-project
description: >
  Absorb and confirm the current state of an existing project before proposing or
  changing anything. Use when working on a project that already exists, when the user
  references "my project", "the current codebase", "where we left off", or when
  continuing prior work rather than starting fresh.
version: 1.0.0
triggers:
  - "current project"
  - "where we left off"
  - "continue working on"
  - "existing project"
tags: [planning, context, onboarding]
last_reviewed: 2026-07-25
---

# Acknowledge project

Understand what is already here before touching it. Do not re-litigate settled decisions, and do not invent context that should come from the project.

## When to use

Any task on a project that already exists. This runs before skill selection on Path B.

## Steps

1. **Read state silently first.** Open `PROGRESS.md`, then existing conventions: AGENTS.md or CLAUDE.md in the target repo, lint and test config, existing test patterns, recent commits. Build an internal picture. Do not ask the user to re-explain what is already written down.
2. **State your understanding back.** Summarize what the project is, what is decided, and what is next, as you read it. This is a confirmation step, not a discovery interview.
3. **Confirm or flag divergence.** If your read and the user's framing match, proceed. If they conflict, name exactly where they diverge and ask which is right. A repeated conflict is a checkpoint, not a single yes-or-no.
4. **Ask for their assumption.** Only now ask what they think should happen next. Answers before this step are calibrated to a possibly wrong model of the state.
5. **Suggest the next step**, drawn from the "next up" line in `PROGRESS.md`, or start a scoped feature grill if the ask is a new feature rather than continuing existing work.

## Rules

- Never assume greenfield rules on an existing project. If `PROGRESS.md` is missing, that is a flag: ask whether to create one before proceeding.
- Respect existing conventions. The shortlist must not introduce a parallel pattern that conflicts with what is already established.
- The design doc or `PROGRESS.md` can drift out of date. If what you read contradicts what is actually built, surface it rather than trusting the doc blindly.
