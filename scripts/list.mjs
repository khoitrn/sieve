#!/usr/bin/env node
// List the skills currently installed in a project. sieve.index.json is the
// local manifest of what's actually here (kept accurate by onboard.mjs/
// add.mjs/remove.mjs — see lib/registry.mjs).
//
// Usage: node scripts/list.mjs [target-dir]

import { loadLocalIndex } from "./lib/registry.mjs";

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--")) || process.cwd();

const index = loadLocalIndex(target);
if (!index) {
  console.error(`no sieve.index.json in ${target} — is this a Sieve project? Run 'sieve init' first.`);
  process.exit(1);
}

const guardrails = index.skills.filter((s) => s.tier === "guardrail");
const catalog = index.skills.filter((s) => s.tier !== "guardrail");

console.log(`Skills installed in ${target}\n`);

console.log(`Guardrails (always on): ${guardrails.length}`);
for (const s of guardrails) console.log(`  - ${s.name}@${s.version} (${s.category})`);

console.log(`\nCatalog: ${catalog.length}`);
if (catalog.length === 0) console.log("  none");
for (const s of catalog) console.log(`  - ${s.name}@${s.version} (${s.category})`);

console.log(`\nThis is a starting point, not a ceiling — add more with 'sieve add <name>',`);
console.log(`drop one with 'sieve remove <name>'. Your agent can also propose going beyond`);
console.log(`this list mid-task; it will flag that and ask first (see AGENTS.md).`);
