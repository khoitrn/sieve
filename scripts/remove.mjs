#!/usr/bin/env node
// Remove one skill from an already-onboarded project: deletes its files,
// drops it from the local manifest and project state, and best-effort tells
// the registry so the dashboard doesn't drift from what's actually on disk.
//
// Guardrails (tier: "guardrail" in sieve.index.json) are always-active per
// AGENTS.md, so removing one requires --force.
//
// Usage: node scripts/remove.mjs <skill-name> [target-dir] [--force]

import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fetchRegistry, loadLocalIndex, loadProjectState, saveProjectState, writeLocalIndex } from "./lib/registry.mjs";

const args = process.argv.slice(2);
const force = args.includes("--force");
const positionals = args.filter((a) => !a.startsWith("--"));
const name = positionals[0];
const target = positionals[1] || process.cwd();

if (!name) {
  console.error("usage: sieve remove <skill-name> [target-dir] [--force]");
  process.exit(1);
}

const index = loadLocalIndex(target);
if (!index) {
  console.error(`no sieve.index.json in ${target} — is this a Sieve project? Run 'sieve init' first.`);
  process.exit(1);
}

const skill = index.skills.find((s) => s.name === name);
if (!skill) {
  console.error(`"${name}" is not installed. Run 'sieve list' to see what is.`);
  process.exit(1);
}

if (skill.tier === "guardrail" && !force) {
  console.error(`"${name}" is a guardrail (always-active per AGENTS.md). Use --force to remove it anyway.`);
  process.exit(1);
}

const skillDir = join(target, "skills", skill.category, skill.name);
if (existsSync(skillDir)) {
  rmSync(skillDir, { recursive: true, force: true });
  console.log(`remove  skills/${skill.category}/${skill.name}`);
}

writeLocalIndex(
  target,
  { $schema: index.$schema, name: index.name, version: index.version },
  index.skills.filter((s) => s.name !== name),
);
console.log("write sieve.index.json");

const state = loadProjectState(target);
if (state) {
  saveProjectState(target, { ...state, assignedSkills: (state.assignedSkills ?? []).filter((s) => s.name !== name) });
  console.log("write .sieve/project.json");

  if (state.projectId) {
    try {
      await fetchRegistry(`/api/projects/${encodeURIComponent(state.projectId)}/assign/${encodeURIComponent(name)}`, { method: "DELETE" });
    } catch (err) {
      console.log(`note  could not update the registry (${err.message}) — continuing`);
    }
  }
}

console.log(`\n"${name}" removed.`);
