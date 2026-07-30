#!/usr/bin/env node
// Add one skill to an already-onboarded project, pulled fresh from the
// registry. Unlike `sieve init`, there is no bundled-catalog fallback here —
// "add this specific skill" has no offline equivalent, so a registry failure
// is a hard error rather than a silent substitution.
//
// Usage: node scripts/add.mjs <skill-name> [target-dir] [--force]
//        --force re-pulls even if the skill is already installed

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fetchRegistry, indexEntryFor, loadLocalIndex, loadProjectState, saveProjectState, writeLocalIndex } from "./lib/registry.mjs";

const args = process.argv.slice(2);
const force = args.includes("--force");
const positionals = args.filter((a) => !a.startsWith("--"));
const name = positionals[0];
const target = positionals[1] || process.cwd();

if (!name) {
  console.error("usage: sieve add <skill-name> [target-dir] [--force]");
  process.exit(1);
}

const index = loadLocalIndex(target);
if (!index) {
  console.error(`no sieve.index.json in ${target} — is this a Sieve project? Run 'sieve init' first.`);
  process.exit(1);
}

if (index.skills.some((s) => s.name === name) && !force) {
  console.log(`skip  ${name} (already installed; use --force to re-pull)`);
  process.exit(0);
}

let skills;
try {
  skills = await fetchRegistry("/api/skills", { method: "GET" });
} catch (err) {
  console.error(`registry unavailable (${err.message}) — cannot add "${name}" without it.`);
  process.exit(1);
}

const skill = skills.find((s) => s.name === name);
if (!skill) {
  console.error(`"${name}" is not in the registry. Run 'sieve list' to see what's installed, or check the registry's full catalog.`);
  process.exit(1);
}

const skillDir = join("skills", skill.category, skill.name);
const dst = join(target, skillDir);
mkdirSync(dirname(join(dst, "SKILL.md")), { recursive: true });
writeFileSync(join(dst, "SKILL.md"), skill.body);
console.log(`pull  ${skillDir}`);

const skillEntries = [...index.skills.filter((s) => s.name !== name), indexEntryFor(skill)];
writeLocalIndex(target, { $schema: index.$schema, name: index.name, version: index.version }, skillEntries);
console.log("write sieve.index.json");

const state = loadProjectState(target);
if (state) {
  const assigned = { name: skill.name, version: skill.version, sourceId: skill.source_id };
  const assignedSkills = [...(state.assignedSkills ?? []).filter((s) => s.name !== name), assigned];
  saveProjectState(target, { ...state, assignedSkills });
  console.log("write .sieve/project.json");

  if (state.projectId) {
    try {
      await fetchRegistry(`/api/projects/${encodeURIComponent(state.projectId)}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: [assigned] }),
      });
    } catch (err) {
      console.log(`note  could not record assignment with the registry (${err.message}) — continuing`);
    }
  }
}

console.log(`\n"${name}" added.`);
