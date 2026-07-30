// Shared registry client + project-local state helpers. Used by onboard.mjs,
// add.mjs, remove.mjs, and list.mjs so these entry points can't drift on how
// they talk to the registry or read/write .sieve/project.json and
// sieve.index.json.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const REGISTRY_URL = process.env.SIEVE_REGISTRY_URL ?? "https://sieve-registry.khoitrn.workers.dev";
const REQUEST_TIMEOUT_MS = 5000;

export async function fetchRegistry(path, init) {
  const res = await fetch(`${REGISTRY_URL}${path}`, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

// Registry skills come back shaped per db.ts's Skill type (source_id, name,
// category, tier, description, tags, version, last_reviewed, body, ...).
// This maps one onto a sieve.index.json entry, the local-manifest shape.
export function indexEntryFor(skill) {
  return {
    name: skill.name,
    type: "skill-md",
    description: skill.description,
    // Forward slashes always — this is a portable manifest field, not a
    // filesystem path, so it must not pick up path.join's OS-specific
    // separator (join would emit backslashes on Windows).
    url: `skills/${skill.category}/${skill.name}/SKILL.md`,
    category: skill.category,
    tier: skill.tier,
    tags: skill.tags,
    version: skill.version,
    last_reviewed: skill.last_reviewed,
    status: "active",
  };
}

export function loadLocalIndex(target) {
  const indexPath = join(target, "sieve.index.json");
  if (!existsSync(indexPath)) return null;
  return JSON.parse(readFileSync(indexPath, "utf8"));
}

export function writeLocalIndex(target, topFields, skillEntries) {
  writeFileSync(join(target, "sieve.index.json"), JSON.stringify({ ...topFields, skills: skillEntries }, null, 2) + "\n");
}

export function loadProjectState(target) {
  const stateFile = join(target, ".sieve", "project.json");
  if (!existsSync(stateFile)) return null;
  try {
    return JSON.parse(readFileSync(stateFile, "utf8"));
  } catch {
    return null;
  }
}

export function saveProjectState(target, state) {
  mkdirSync(join(target, ".sieve"), { recursive: true });
  writeFileSync(join(target, ".sieve", "project.json"), JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2) + "\n");
}
