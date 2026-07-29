#!/usr/bin/env node
// Scaffold Sieve into a target project with the FULL bundled catalog — no
// registry interview, no network call. This is the offline/CI-safe path;
// `sieve init` without --all runs the onboarding interview instead (see
// onboard.mjs), which pulls just a recommended shortlist from the registry
// and falls back to this same full-copy behavior if the registry is
// unreachable. Idempotent and safe to re-run: existing files are not
// overwritten unless --force is passed.
//
// Usage: node scripts/init.mjs [target-dir] [--force] [--detect]
//        (target-dir defaults to the current directory)

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { copyAsset, seedProjectFiles, writeBridgeFiles } from "./lib/scaffold.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = dirname(__dirname);
const args = process.argv.slice(2);
const force = args.includes("--force");
const detect = args.includes("--detect");
const target = args.find((a) => !a.startsWith("--")) || process.cwd();

mkdirSync(target, { recursive: true });

console.log(`Installing Sieve (full catalog) into ${target}\n`);
for (const name of ["AGENTS.md", "sieve.index.json", "skills", "templates"]) {
  copyAsset(pkgRoot, target, name, force);
}
seedProjectFiles(pkgRoot, target, force);
writeBridgeFiles(pkgRoot, target, detect);

console.log(`\nSieve is ready in ${target}.`);
console.log("Open your coding agent there and describe what you want to build.");
