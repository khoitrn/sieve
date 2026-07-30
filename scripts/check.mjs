#!/usr/bin/env node
// Report the health of the catalog: skills past their staleness window, any
// pending growth-loop items in PROPOSED.md and STALE.md, and (with --updates)
// whether any registry-pulled skill has moved since it was installed. This is
// a report; it never changes anything.
//
// Usage: node scripts/check.mjs [--days N] [--updates]
//   --days N     staleness window in days (default 90)
//   --updates    also diff .sieve/project.json's pinned versions against the
//                registry's current versions (needs network; skipped, with a
//                note, if the registry is unreachable or nothing was tracked)

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const daysArg = args.indexOf("--days");
const WINDOW_DAYS = daysArg !== -1 ? parseInt(args[daysArg + 1], 10) : 90;
const wantUpdates = args.includes("--updates");
const now = Date.now();
const REGISTRY_URL = process.env.SIEVE_REGISTRY_URL ?? "https://sieve-registry.khoitrn.workers.dev";
const REQUEST_TIMEOUT_MS = 5000;

function loadIndex() {
  try {
    return JSON.parse(readFileSync("sieve.index.json", "utf8"));
  } catch {
    console.error("cannot read sieve.index.json from the current directory.");
    process.exit(1);
  }
}

function daysSince(dateStr) {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return null;
  return Math.floor((now - t) / 86400000);
}

function countPending(file) {
  if (!existsSync(file)) return 0;
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((l) => l.trim().startsWith("- ") && !l.includes("<date>")).length;
}

function loadProjectSource() {
  const stateFile = join(".sieve", "project.json");
  if (!existsSync(stateFile)) return null;
  try {
    return JSON.parse(readFileSync(stateFile, "utf8")).source ?? null;
  } catch {
    return null;
  }
}

const index = loadIndex();
const stale = [];
const missing = [];

for (const s of index.skills) {
  if (!s.last_reviewed) {
    missing.push(s.name);
    continue;
  }
  const age = daysSince(s.last_reviewed);
  if (age === null) missing.push(s.name);
  else if (age > WINDOW_DAYS) stale.push({ name: s.name, age });
}

console.log(`Catalog check (staleness window: ${WINDOW_DAYS} days)\n`);

if (loadProjectSource() === "offline-fallback") {
  console.log(
    "Installed offline: full bundled catalog, not a tailored set. Run 'sieve init --force' when the registry is reachable to get the shortlist instead.\n",
  );
}

console.log(`Skills: ${index.skills.length} total`);
if (stale.length === 0) {
  console.log("  none past the staleness window.");
} else {
  console.log(`  ${stale.length} past the window:`);
  for (const s of stale.sort((a, b) => b.age - a.age)) {
    console.log(`  - ${s.name} (reviewed ${s.age} days ago)`);
  }
}
if (missing.length) {
  console.log(`  ${missing.length} missing a valid last_reviewed: ${missing.join(", ")}`);
}

const proposed = countPending("PROPOSED.md");
const staleFlags = countPending("STALE.md");
console.log(`\nGrowth loop inputs:`);
console.log(`  PROPOSED.md: ${proposed} pending proposal(s)`);
console.log(`  STALE.md:    ${staleFlags} pending flag(s)`);

const actionable = stale.length + missing.length + proposed + staleFlags;
console.log(
  actionable === 0
    ? "\nCatalog is healthy. Nothing to triage."
    : `\n${actionable} item(s) to triage. This is a report; nothing was changed.`
);

async function fetchRegistrySkills() {
  const res = await fetch(`${REGISTRY_URL}/api/skills`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`/api/skills -> ${res.status}`);
  return res.json();
}

function loadProjectAssignments() {
  const stateFile = join(".sieve", "project.json");
  if (!existsSync(stateFile)) return null;
  try {
    const state = JSON.parse(readFileSync(stateFile, "utf8"));
    return state.assignedSkills ?? [];
  } catch {
    return null;
  }
}

async function checkForUpdates() {
  console.log("\nRegistry updates:");
  const assigned = loadProjectAssignments();
  if (assigned === null) {
    console.log("  no .sieve/project.json here — nothing tracked to diff.");
    return;
  }
  if (assigned.length === 0 || !assigned[0].sourceId) {
    console.log("  installed skills weren't pinned to a source/version (offline-fallback install, or installed before pinning existed) — nothing to diff.");
    return;
  }

  let registrySkills;
  try {
    registrySkills = await fetchRegistrySkills();
  } catch (err) {
    console.log(`  registry unavailable (${err.message}) — skipping.`);
    return;
  }

  const current = new Map(registrySkills.map((s) => [`${s.source_id}:${s.name}`, s]));
  const changed = [];
  const gone = [];
  for (const installed of assigned) {
    const key = `${installed.sourceId}:${installed.name}`;
    const latest = current.get(key);
    if (!latest) {
      gone.push(installed.name);
    } else if (latest.version !== installed.version) {
      changed.push({ name: installed.name, from: installed.version, to: latest.version });
    }
  }

  if (changed.length === 0 && gone.length === 0) {
    console.log(`  all ${assigned.length} pinned skill(s) up to date.`);
    return;
  }
  for (const c of changed) console.log(`  - ${c.name}: ${c.from} -> ${c.to}`);
  for (const name of gone) console.log(`  - ${name}: no longer in the registry (source removed or renamed)`);
  console.log(`\n  ${changed.length + gone.length} skill(s) changed since install. This is a report; nothing was updated.`);
}

if (wantUpdates) await checkForUpdates();
