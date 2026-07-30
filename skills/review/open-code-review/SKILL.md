---
name: open-code-review
description: >
  Run a second, independent automated review pass over a diff with the
  open-code-review CLI (`ocr`), when it happens to be installed. Use
  alongside requesting-code-review for larger diffs, higher-stakes changes,
  or unfamiliar code — complements the review guardrail, never replaces it,
  and is never a blocking dependency.
version: 1.0.0
triggers:
  - "second opinion on this diff"
  - "run ocr"
  - "automated review pass"
tags: [review, quality, optional-tooling]
last_reviewed: 2026-07-29
origin: adapted from alibaba/open-code-review (external CLI, github.com/alibaba/open-code-review)
---

# Open code review

An optional second pass, not a replacement for `requesting-code-review`.
That guardrail is this same agent grading its own work against the plan;
`ocr` is an independent model reviewing the diff line-by-line — a genuinely
different kind of check, useful precisely because it isn't the same agent
marking its own homework. It needs an installed CLI and its own model
config, so it is catalog tier, opt-in, never forced on a project that
doesn't have it.

## When to use

- Larger diffs, where `requesting-code-review`'s self-check risks missing
  detail.
- Reviewing or auditing unfamiliar code.
- The user explicitly asks for a second opinion, to "run ocr," or for an
  automated review pass.

Not a default for every task. Never block progress on this tool being
absent — check once, and if it isn't there, fall back to
`requesting-code-review` alone without commentary about the gap.

## Steps

1. Check availability once per session (e.g. `ocr --version`). If not
   found, skip this skill silently; `requesting-code-review` still runs on
   its own.
2. If installed but not yet configured (no provider/model selected via
   `ocr config provider` / `ocr config model`), treat that the same as not
   installed — that's a one-time setup step for the user, not something to
   walk them through mid-task.
3. Run against the actual scope of the change, not the whole repo:
   - Working changes: `ocr review`
   - A specific commit: `ocr review --commit <sha>`
   - A branch range: `ocr review --from <base> --to <head>`
4. Fold its line-level comments into the same critical/major/minor triage
   `requesting-code-review` already uses — one merged report, not two
   separate reviews presented side by side.
5. Note in `HISTORY.jsonl` that `ocr` ran (or that it was skipped because
   it wasn't installed/configured) alongside the regular review entry.

## Rules

- Optional tooling, not a guardrail. Its absence is never a blocking
  condition and never worth raising to the user beyond the one-line
  `HISTORY.jsonl` note.
- Findings route through the same severity triage as manual review — this
  adds coverage, it doesn't introduce a separate approval path.
- Don't install it on the user's behalf. If it isn't present, that's the
  user's call, not something this skill prompts for.
