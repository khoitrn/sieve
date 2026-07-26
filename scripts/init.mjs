#!/usr/bin/env node
// Scaffold Sieve into a target project. Copies the protocol, skills, and templates
// from the installed package into the target repo, seeds an empty PROGRESS.md and
// HISTORY.jsonl, and writes agent bridge files. Idempotent and safe to re-run:
// existing files are not overwritten unless --force is passed.
//
// Usage: node scripts/init.mjs [target-dir] [--force] [--detect]
//        (target-dir defaults to the current directory)

import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const args = process.argv.slice(2);
const force = args.includes("--force");
const detect = args.includes("--detect");
const target = args.find((a) => !a.startsWith("--")) || process.cwd();

mkdirSync(target, { recursive: true });

// What gets copied from the package into a new project.
const COPY = ["AGENTS.md", "sieve.index.json", "skills", "templates"];
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

// What gets seeded fresh (never copied from the package's own state).
const SEED = [
  { path: "PROGRESS.md", from: "templates/progress.md" },
  { path: "HISTORY.jsonl", content: "" },
  { path: "PROPOSED.md", content: PROPOSED_SEED },
  { path: "STALE.md", content: STALE_SEED },
  { path: "staging/README.md", content: STAGING_README },
];

function copyInto(name) {
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

function seed({ path, from, content }) {
  const dst = join(target, path);
  if (existsSync(dst) && !force) {
    console.log(`skip  ${path} (exists)`);
    return;
  }
  const dir = dirname(dst);
  if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
  const body = from ? readFileSync(join(pkgRoot, from), "utf8") : content ?? "";
  writeFileSync(dst, body);
  console.log(`seed  ${path}`);
}

console.log(`Installing Sieve into ${target}\n`);
for (const name of COPY) copyInto(name);
for (const s of SEED) seed(s);

// Write agent bridge files into the target.
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

console.log(`\nSieve is ready in ${target}.`);
console.log("Open your coding agent there and describe what you want to build.");
