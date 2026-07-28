---
name: writing-plans
description: >
  Break an approved design into small, verifiable tasks an unsupervised agent can
  execute without drifting. Use after a design doc is signed off, when the user says
  "make a plan", "break this down", "plan the implementation", or before starting a
  build of any real size. Each task must be small, concrete, and independently checkable.
version: 1.0.0
triggers:
  - "make a plan"
  - "break this down"
  - "plan the implementation"
tags: [planning, execution]
last_reviewed: 2026-07-26
origin: sieve
---

# Writing plans

Turn an approved design into a task list so precise that an enthusiastic junior with no context and no judgement could follow it and not go wrong.

## When to use

After a design doc is approved, before implementation. Not for tiny one-step changes.

## What a good task looks like

Each task is a small unit, roughly a few minutes of work, with three things:

1. **Exact location**: the file path or paths to touch.
2. **The change**: what to add or modify, concretely enough that there is no guessing.
3. **The verification**: how to confirm this task is done, by running something, not by judgement.

## Rules

- Small slices. One behavior per task. If a task has an "and" in its goal, split it.
- Order by dependency. A task should never need something a later task produces.
- Each task ends green. Following test-driven-development, a task is done when its test passes and it is committed.
- Over-specify. Ambiguity is where an unsupervised agent drifts. Remove it.
- No task invents scope beyond the design doc. If the plan needs something the design did not cover, that is a return to the grill, not a new task.

## Output

A numbered task list saved alongside the design doc. Each entry has location, change, and verification. This becomes the execution script; the reload checkpoint and approval gate apply as tasks are worked.
