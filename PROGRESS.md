# Progress

Keep this short. It is read at the start of every session. Push detail into referenced files.

## Current phase

npm-publish-ready with the growth loop closed. Universal foundation, six skills, canonical templates, CI (validate + self-tests + line limit), working and pack-tested `sieve init`, `sieve check` for catalog health, per-agent bridges, PROPOSED/STALE capture files, LICENSE, CONTRIBUTING, issue/PR templates. The architecture has no remaining gaps that are not deferred-by-design or owner-only.

## Last completed

Closed the growth loop: PROPOSED.md and STALE.md capture files (seeded into new projects by init), AGENTS.md protocol lines directing the agent to append usage signals, and a real `sieve check` command that reports stale skills by last_reviewed and pending growth-loop items. Verified from a fresh packed install.

## Next up (owner-only steps)

1. Pick the npm package name. `sieve` is likely taken; use a scoped name like `@yourname/sieve` or confirm availability with `npm view sieve`. Replace OWNER in package.json repository/bugs/homepage with the GitHub owner, and the name if scoping.
2. `npm login`, then `npm publish` (or `npm publish --access public` for a scoped name). The prepublishOnly hook runs the self-tests first.
3. Install-test as an outside user: `npx <name> init` in a fresh repo, confirm first value without hand-editing.

## Resolved

- Enforcement is guidance-first for v1; a Claude Code PreToolUse hook is a later optional enhancement, out of scope for release. Reason: it is Claude Code only and Sieve must stay cross-agent.

## Decision log

- 2026-07-25: foundation scaffolded, guidance-first enforcement chosen over mechanical, later stages deferred until defaults prove out.
- 2026-07-26: added canonical templates and wired them into AGENTS.md; design docs live under docs/design/.
- 2026-07-26: built core catalog depth (systematic-debugging, writing-plans) plus CI validation.
- 2026-07-26: reframed the whole project as universal and distributable from the start; built a working init scaffolder, LICENSE, and CONTRIBUTING.
- 2026-07-26: made the package npm-publish-ready (metadata, self-tests, templates, pack-tested install) and resolved enforcement as guidance-first for v1. Remaining steps require the owner's npm and GitHub accounts.
- 2026-07-26: closed the growth loop (PROPOSED.md, STALE.md, protocol capture lines, real sieve check). The architecture is now complete except for deferred-by-design pieces (dashboard, enforcement hook) and owner-only steps (publish).
