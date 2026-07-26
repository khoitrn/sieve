---
name: requesting-code-review
description: >
  Review work against the plan between tasks and report issues by severity. Use after
  completing a task and before starting the next one. Critical issues block progress.
  This is a guardrail; it is active by default and skipping it requires explicit approval.
version: 1.0.0
triggers:
  - "review this"
  - "task complete"
  - "before the next task"
tags: [review, guardrail, quality]
last_reviewed: 2026-07-25
---

# Requesting code review

Check the work before moving on. This runs between tasks, not only at the end.

## Steps

1. Review the completed work against the plan or design doc, not against a vague sense of quality.
2. Report issues grouped by severity: critical, major, minor.
3. Critical issues block progress. Do not start the next task until they are resolved.
4. Note what was reviewed and the outcome in `HISTORY.jsonl`.

## Two-stage review

When the stakes justify it, split the review:

1. **Spec compliance**: does the work do what the plan said, no more, no less?
2. **Code quality**: is it clear, tested, and free of obvious defects?

## Rules

- Review against the stated plan. Scope creep is an issue, not a feature.
- Be specific. "Looks fine" is not a review.
- This is a guardrail. Skipping it requires explicit approval per the approval gate in AGENTS.md.
