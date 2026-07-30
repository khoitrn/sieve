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

  case "init": {
    // Default: interactive onboarding (interview + registry-recommended shortlist).
    // --all / --offline: old behavior, copy the whole bundled catalog, no prompts,
    // no network — for CI/scripted use.
    const skipOnboard = rest.includes("--all") || rest.includes("--offline");
    const scriptArgs = rest.filter((a) => a !== "--all" && a !== "--offline");
    run(skipOnboard ? "scripts/init.mjs" : "scripts/onboard.mjs", scriptArgs);
    break;
  }

  case "check":
    // Report stale skills (by last_reviewed) and pending growth-loop items.
    run("scripts/check.mjs", rest);
    break;

  case "list":
    // Show what's actually installed, per the local sieve.index.json.
    run("scripts/list.mjs", rest);
    break;

  case "add":
    // Pull one more skill from the registry into an already-onboarded project.
    run("scripts/add.mjs", rest);
    break;

  case "remove":
    // Drop one installed skill. Guardrails need --force.
    run("scripts/remove.mjs", rest);
    break;

  case "-h":
  case "--help":
  case undefined:
    console.log(`sieve <command>

  validate [path...]   Validate SKILL.md files (default: all in skills/)
  bridge [--detect]    Write pointer files for non-AGENTS.md agents
  init [--all|--offline] [--detect-stack]  Onboard into the current project: interview +
                       registry-recommended skills (default), or --all/--offline for the
                       full bundled catalog; --detect-stack adds package.json-based tags
                       to the interview's focus answer
  check [--days N] [--updates]  Report stale skills and pending growth-loop items;
                       --updates also diffs installed skill versions against the registry
  list                 Show skills currently installed (guardrails vs catalog)
  add <name> [--force]     Pull one more skill from the registry into this project
  remove <name> [--force]  Drop one installed skill (--force required for guardrails)
`);
    process.exit(0);
    break;

  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(1);
}
