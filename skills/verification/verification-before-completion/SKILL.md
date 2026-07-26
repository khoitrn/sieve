---
name: verification-before-completion
description: >
  Verify work with evidence before declaring anything done. Use before marking any
  task, feature, or fix complete: run the test, read the output, check the file, do
  not assume it passed. This is a guardrail; it is active by default and skipping it
  requires explicit user approval.
version: 1.0.0
triggers:
  - "done"
  - "task complete"
  - "should work now"
  - "mark this complete"
tags: [verification, guardrail, quality]
last_reviewed: 2026-07-26
---

# Verification before completion

Do not claim success you have not checked. This is a guardrail, not a suggestion.

## The rule

Before declaring a task, feature, or fix done, produce the evidence:

1. **Run it.** Execute the test, the command, or the build. Do not reason about whether it would probably pass.
2. **Read the actual output.** A command that exits without visible output, or one you have not read, is not verified.
3. **Check the artifact.** If the task changed a file, wrote a value, or scaffolded a project, open it and confirm it looks like what was claimed.
4. **State what you checked.** The completion claim should name the check, not just assert the result.

## Rules

- "This should work" is not verification. Neither is re-reading the code and reasoning it through without running it.
- If verification is not possible (no test harness, no way to observe the effect), say so explicitly instead of claiming success anyway.
- A claim of success that turns out to be wrong is worse than a slower, honest "not yet verified."

## Bypass

Skipping verification requires explicit user approval per the approval gate in AGENTS.md. Cite the reason, get a clear yes, and log it in `HISTORY.jsonl`. Do not skip silently.
