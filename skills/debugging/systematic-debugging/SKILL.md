---
name: systematic-debugging
description: >
  Find the root cause of a bug through a disciplined four-phase process instead of
  guessing. Use when something is broken, a test fails, behavior is unexpected, or the
  user says "debug this", "why is this failing", "it does not work", or asks to
  investigate an error. Do not patch symptoms before the root cause is understood.
version: 1.0.0
triggers:
  - "debug this"
  - "why is this failing"
  - "it does not work"
  - "investigate the error"
tags: [debugging, root-cause, quality]
last_reviewed: 2026-07-26
origin: sieve
---

# Systematic debugging

Fix the cause, not the symptom. Guessing wastes time and hides the real fault. Work the four phases in order.

## When to use

Any time something is broken or behaving unexpectedly. Runs before writing a fix.

## Phase 1: reproduce

Get a reliable, minimal reproduction. If you cannot reproduce it on demand, you cannot know you fixed it. Reduce the case until nothing can be removed without the bug disappearing.

## Phase 2: trace to the root cause

Follow the evidence, do not jump to a fix. Read the actual error, the actual values, the actual call path. Ask what is true at the point of failure, then work backward to what made it true. A root cause explains every symptom; a guess explains only the one you noticed.

## Phase 3: fix at the root

Change the thing that is actually wrong, not the place the symptom surfaced. A fix that suppresses the symptom while the cause remains is a regression waiting to happen. Prefer defense in depth: fix the cause, and where cheap, make the failure impossible to reintroduce silently.

## Phase 4: verify with the failing case

Run the exact reproduction from phase 1 and confirm it now passes. Add it as a test so the bug cannot return unnoticed. Then check nothing nearby broke.

## Rules

- No fix before the root cause is named. If you are about to change code without being able to explain why the bug happened, stop.
- Wait on real conditions, not fixed delays. If timing is involved, wait for the state to be true, not for an arbitrary sleep.
- One root cause at a time. If you find two, fix and verify each separately.
