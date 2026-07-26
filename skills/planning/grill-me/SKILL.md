---
name: grill-me
description: >
  Interrogate a rough idea before any code gets written, one question at a time,
  until the plan has edges. Use when starting a new idea or feature, when the user
  says "grill me", "grill my idea", "stress-test this", or when a request is
  underspecified enough that building now would mean guessing.
version: 1.0.0
triggers:
  - "grill me"
  - "grill my idea"
  - "stress-test this"
  - "new idea"
tags: [planning, requirements, discovery]
last_reviewed: 2026-07-25
---

# Grill me

Refine an idea by asking, not assuming. The goal is a design doc with no hidden guesses.

## When to use

At the start of a new idea, or a new feature on an existing project. Not for tasks that are already fully specified.

## The six fields

Work through these one at a time. Ask a real question for each, push on the weak answer, and do not move on until it holds.

1. **Goal**: what does done look like, stated as something checkable? Reject "make it good."
2. **Context**: what is known going in? Who is this for? What already exists around it?
3. **Tools**: what can actually be used or called? What is off the table?
4. **Loop**: how does the work repeat? Plan, execute, verify, retry. Where does it stop?
5. **Verification**: how is success checked, by a process with no context except the output and the criteria? Make it testable, not judged.
6. **Human checkpoint**: where does a person review before proceeding? Scope this by risk, not uniformly.

## Rules

- One question per turn. Wait for the answer.
- Push on vague answers rather than accepting them. The point is to surface hidden assumptions.
- For a new idea, all six fields start blank. For a feature on an existing project, pre-fill context and tools from the project and focus on goal and verification.
- Stop when the six fields are answered well enough that an unsupervised builder could not go wrong. Then write the design doc and ask for sign-off.

## Output

A short design doc: the six fields, filled, plus any open questions. Keep it tight. This becomes the source of truth for the build.
