// Shared scaffolding steps used by both init.mjs (copy-everything) and
// onboard.mjs (interview + selective pull). Kept here once so the two entry
// points can't drift on how PROGRESS.md/HISTORY.jsonl/staging/bridge files
// get seeded.

import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";

const STAGING_README = `# Staging (contrib lane)

Contributed or uploaded skills land here first. They do not enter the live catalog
in skills/ until they pass validation.

1. Drop a skill folder here: staging/<name>/SKILL.md
2. Validate it: node bin/cli.js validate staging/<name>/SKILL.md
3. On pass, move it into skills/<category>/<name>/ and add an entry to sieve.index.json
4. On fail, fix the reported issues and re-run

Nothing here is trusted until it is validated and promoted.
`;

const PROPOSED_SEED = `# Proposed skills

When a task reveals a skill the catalog does not have, capture it here so the
one-off improvisation is not lost. This is an input to the growth loop, not the
live catalog. A proposal graduates by being drafted in staging/, validated, and
promoted per CONTRIBUTING.md.

Format: one entry per proposal, newest last.

- <date> | <short name> | what it would do | the task that revealed the need
`;

const STALE_SEED = `# Stale skills

When a task reveals an existing skill is wrong, outdated, or misfiring, flag it
here rather than fixing it silently mid-task. This is an input to the growth loop.
Entries are triaged on a cadence: revise the skill, or archive it.

Format: one entry per flag, newest last.

- <date> | <skill name> | what is wrong | the task that revealed it
`;

const SEED_FILES = [
  { path: "PROGRESS.md", from: "templates/progress.md" },
  { path: "HISTORY.jsonl", content: "" },
  { path: "PROPOSED.md", content: PROPOSED_SEED },
  { path: "STALE.md", content: STALE_SEED },
  { path: "staging/README.md", content: STAGING_README },
];

export function copyAsset(pkgRoot, target, name, force) {
  const src = join(pkgRoot, name);
  const dst = join(target, name);
  if (existsSync(dst) && !force) {
    console.log(`skip  ${name} (exists; use --force to overwrite)`);
    return;
  }
  if (!existsSync(src)) {
    console.log(`warn  ${name} not found in package, skipping`);
    return;
  }
  cpSync(src, dst, { recursive: true });
  console.log(`copy  ${name}`);
}

export function seedProjectFiles(pkgRoot, target, force) {
  for (const { path, from, content } of SEED_FILES) {
    const dst = join(target, path);
    if (existsSync(dst) && !force) {
      console.log(`skip  ${path} (exists)`);
      continue;
    }
    const dir = dirname(dst);
    if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
    const body = from ? readFileSync(join(pkgRoot, from), "utf8") : content ?? "";
    writeFileSync(dst, body);
    console.log(`seed  ${path}`);
  }
}

export function writeBridgeFiles(pkgRoot, target, detect) {
  console.log("");
  const bridgeArgs = detect ? ["--detect"] : [];
  const r = spawnSync("node", [join(pkgRoot, "scripts/bridge.mjs"), ...bridgeArgs], {
    cwd: target,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.error("bridge step failed");
    process.exit(r.status ?? 1);
  }
}
