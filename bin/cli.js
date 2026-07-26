#!/usr/bin/env node
// Sieve CLI. init, validate, bridge, and check are all fully implemented.
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
    // Scaffold Sieve into a target directory (default: current dir).
    run("scripts/init.mjs", rest);
    break;

  case "check":
    // Report stale skills (by last_reviewed) and pending growth-loop items.
    run("scripts/check.mjs", rest);
    break;

  case "-h":
  case "--help":
  case undefined:
    console.log(`sieve <command>

  validate [path...]   Validate SKILL.md files (default: all in skills/)
  bridge [--detect]    Write pointer files for non-AGENTS.md agents
  init                 Scaffold Sieve into the current project (Stage 2)
  check [--days N]     Report stale skills and pending growth-loop items
`);
    process.exit(0);
    break;

  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(1);
}
