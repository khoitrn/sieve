# What is next for Sieve

Everything buildable at the file layer is done. The architecture has no half-finished
pieces. The remaining steps require accounts and a real user, so they are owner-only.
Do them in order.

## 1. Push this work to GitHub

Needs your git auth. From the repo root:

    git add .
    git commit -m "Sieve: growth loop, publish-readiness, universal reframe"
    git push

If the repo is not initialized yet:

    git init
    git add .
    git commit -m "Sieve foundation through growth loop"
    git branch -M main
    git remote add origin https://github.com/<your-username>/sieve.git
    git push -u origin main

## 2. Publish to npm (the real unlock)

This turns Sieve from files in a repo into a tool anyone runs with npx.

1. Pick the name. Run `npm view sieve` first. It is almost certainly taken, so
   plan on a scoped name like `@yourhandle/sieve`.
2. Edit package.json: replace the three OWNER placeholders (repository, bugs,
   homepage) with your GitHub handle. If scoping, change "name" too.
3. Publish:

       npm login
       npm publish            # or: npm publish --access public   (for a scoped name)

   The prepublishOnly hook runs the self-tests first, so a broken build cannot ship.

## 3. Outside-user install test (the eval that matters)

Get one person who is not you to run, in a fresh empty repo:

    npx <name> init

Success means they reached first value without you explaining anything. This is the
only real test of whether the universal defaults are good. No further building here
can answer it.

## Then: a real fork

- Recommended: call it v1 and use it. Let real sessions write lines into PROPOSED.md
  and STALE.md, then `sieve check` tells you what to build next. Grow by use, not by
  guessing. This is the design philosophy; honor it.
- Or keep extending now: the mid-flight /validate re-grill trigger (described in the
  design doc, not yet wired), more skills, or the observability dashboard once
  HISTORY.jsonl has real data.

## Deferred by design (not gaps)

- Observability dashboard: needs weeks of real HISTORY.jsonl data before the UI can
  be designed. Building it now is guessing.
- PreToolUse enforcement hook: guidance-only for v1. It is Claude Code only and Sieve
  must stay cross-agent. Add later as an optional enhancement.

## One optional edit before publish

The LICENSE copyright reads "Sieve contributors". If you want your name on it, that is
a one-line change. Left generic on purpose to keep the project universal.
