# Staging (contrib lane)

Uploaded or contributed skills land here first. They do not enter the live catalog
in `skills/` until they pass validation.

## Flow

1. Drop a skill folder here: `staging/<name>/SKILL.md`.
2. Validate it: `node scripts/validate-skill.mjs staging/<name>/SKILL.md`.
3. On pass, move it into `skills/<category>/<name>/` and add an entry to `sieve.index.json`.
4. On fail, fix the reported issues and re-run.

Nothing here is trusted until it is validated and promoted.
