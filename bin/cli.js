#!/usr/bin/env node
// Sieve CLI. Stage 1: `validate` works. `init` and `check` are stubs for Stage 2.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const [cmd, ...rest] = process.argv.slice(2);

function run(file, args) {
  const r = spawnSync("node", [join(root, file), ...args], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}

switch (cmd) {
  case "validate":
    run("scripts/validate-skill.mjs", rest.length ? rest : ["--all"]);
    break;

  case "bridge":
    // Write pointer files for agents that do not read AGENTS.md natively.
    // Pass --detect to only write for agents whose config dirs are present.
    run("scripts/bridge.mjs", rest);
    break;

  case "init":
    // Stage 2: full scaffold. For now it composes what exists: bridges + validate.
    // Later: copy AGENTS.md + skills/ into a target repo and write skills-lock.json.
    console.log("sieve init: partial (Stage 2 in progress).");
    console.log("Run `sieve bridge` to write agent pointer files, and");
    console.log("`sieve validate` to check skills. Full scaffold-into-target-repo is next.");
    process.exit(0);
    break;

  case "check":
    // Stage 3: cached staleness check against last_reviewed and referenced files.
    console.log("sieve check: not implemented yet (Stage 3).");
    process.exit(0);
    break;

  case "-h":
  case "--help":
  case undefined:
    console.log(`sieve <command>

  validate [path...]   Validate SKILL.md files (default: all in skills/)
  bridge [--detect]    Write pointer files for non-AGENTS.md agents
  init                 Scaffold Sieve into the current project (Stage 2)
  check                Report stale skills (Stage 3)
`);
    process.exit(0);
    break;

  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(1);
}
