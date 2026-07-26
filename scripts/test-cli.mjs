#!/usr/bin/env node
// Self-test for the Sieve CLI. Exercises validate, init, and bridge end to end.
// Exit 0 means all pass. Wired into `npm test` and `prepublishOnly` so a broken
// build cannot be published.

import { spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;

function check(name, cond) {
  if (cond) {
    console.log(`ok   ${name}`);
  } else {
    console.error(`FAIL ${name}`);
    failures++;
  }
}

function run(args, opts = {}) {
  return spawnSync("node", [join(root, "bin/cli.js"), ...args], {
    encoding: "utf8",
    ...opts,
  });
}

// 1. validate passes on the shipped catalog
let r = run(["validate"]);
check("validate exits 0 on clean catalog", r.status === 0);
check("validate reports all skills valid", /All \d+ skill\(s\) valid/.test(r.stdout));

// 2. validate fails on a malformed skill
const badDir = mkdtempSync(join(tmpdir(), "sieve-bad-"));
const badSkill = join(badDir, "SKILL.md");
import("node:fs").then(({ writeFileSync }) => {
  writeFileSync(badSkill, "---\nname: Claude_Bad\ndescription:\n---\nbody\n");
  const rb = run(["validate", badSkill]);
  check("validate exits nonzero on malformed skill", rb.status !== 0);
  rmSync(badDir, { recursive: true, force: true });

  // 3. init scaffolds a fresh directory
  const proj = mkdtempSync(join(tmpdir(), "sieve-init-"));
  const ri = run(["init", proj, "--detect"]);
  check("init exits 0", ri.status === 0);
  check("init writes AGENTS.md", existsSync(join(proj, "AGENTS.md")));
  check("init writes skills/", existsSync(join(proj, "skills")));
  check("init seeds PROGRESS.md", existsSync(join(proj, "PROGRESS.md")));
  check("init seeds empty HISTORY.jsonl", existsSync(join(proj, "HISTORY.jsonl")));

  // 4. scaffolded project validates
  const rv = spawnSync("node", [join(root, "scripts/validate-skill.mjs"), "--all"], {
    cwd: proj,
    encoding: "utf8",
  });
  check("scaffolded project passes validate", rv.status === 0);

  // 5. with --detect and no agent dirs, no bridges are written; AGENTS.md is the source
  check("init keeps AGENTS.md as the canonical source", existsSync(join(proj, "AGENTS.md")));
  // and a full (non-detect) bridge run writes CLAUDE.md
  const rbridge = run(["bridge"], { cwd: proj });
  check("bridge writes CLAUDE.md on full run", existsSync(join(proj, "CLAUDE.md")));
  rmSync(proj, { recursive: true, force: true });

  // 6. check runs against the shipped catalog and exits 0
  const rc = run(["check"]);
  check("check exits 0 on clean catalog", rc.status === 0);
  check("check reports growth loop inputs", /Growth loop inputs/.test(rc.stdout));

  console.log("");
  if (failures) {
    console.error(`${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log("All CLI self-tests passed.");
});
