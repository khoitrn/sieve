---
name: test-driven-development
description: >
  Enforce red, green, refactor on every implementation task. Use during any coding
  work: write a failing test first, watch it fail, write minimal code to pass, watch
  it pass, then commit. This is a guardrail; it is active by default and skipping it
  requires explicit user approval.
version: 1.0.0
triggers:
  - "implement"
  - "write code"
  - "build the feature"
tags: [testing, guardrail, quality]
last_reviewed: 2026-07-25
origin: sieve
---

# Test-driven development

Write the test before the code. Always. This is a guardrail, not a suggestion.

## The cycle

1. **Red**: write one failing test for the next small piece of behavior. Run it. Watch it fail for the right reason.
2. **Green**: write the minimum code to make it pass. Nothing extra. Run it. Watch it pass.
3. **Refactor**: clean up while tests stay green.
4. **Commit**: commit the working slice before moving on.

## Rules

- If code was written before a failing test existed for it, that is a bypass. Flag it, and prefer deleting and redoing it test-first over keeping it.
- Keep slices small: one behavior per cycle.
- A test that never failed proves nothing. If a new test passes immediately, question whether it tests anything real.

## Bypass

Skipping TDD requires explicit user approval per the approval gate in AGENTS.md. Cite the reason, get a clear yes, and log it in `HISTORY.jsonl`. Do not skip silently.
