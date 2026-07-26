#!/usr/bin/env node
// Report the health of the catalog: skills past their staleness window, and any
// pending growth-loop items in PROPOSED.md and STALE.md. This is the cadence-review
// output of the growth loop. It reports; it does not change anything.
//
// Usage: node scripts/check.mjs [--days N]   (default staleness window: 90 days)

import { readFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const daysArg = args.indexOf("--days");
const WINDOW_DAYS = daysArg !== -1 ? parseInt(args[daysArg + 1], 10) : 90;
const now = Date.now();

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
