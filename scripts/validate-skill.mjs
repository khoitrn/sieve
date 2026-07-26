#!/usr/bin/env node
// Validate one or more SKILL.md files against Sieve's minimal schema.
// Usage: node scripts/validate-skill.mjs <path-to-SKILL.md> [more...]
//        node scripts/validate-skill.mjs --all        (validates every skill in skills/)
// Exit code 0 means all valid, 1 means at least one failure. This is the
// mechanical gate for the staging lane: uploads pass through here before the catalog.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = ["anthropic", "claude"];
const MAX_NAME = 64;
const MAX_DESC = 1024;
const MAX_BODY_LINES = 500;

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { error: "missing frontmatter block" };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { error: "unterminated frontmatter block" };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4);
  const fm = {};
  let key = null;
  for (const line of raw.split("\n")) {
    const m = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (m) {
      key = m[1];
      const val = m[2].trim();
      fm[key] = val === "" || val === ">" || val === "|" ? "" : val.replace(/^["']|["']$/g, "");
    } else if (key && line.trim()) {
      fm[key] = (fm[key] ? fm[key] + " " : "") + line.trim().replace(/^-\s*/, "");
    }
  }
  return { fm, body };
}

function validate(path) {
  const errors = [];
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return [`cannot read ${path}`];
  }
  const { fm, body, error } = parseFrontmatter(text);
  if (error) return [`${path}: ${error}`];

  const name = fm.name;
  if (!name) errors.push("missing required field: name");
  else {
    if (name.length > MAX_NAME) errors.push(`name exceeds ${MAX_NAME} chars`);
    if (!NAME_RE.test(name)) errors.push("name must be lowercase words joined by hyphens");
    if (RESERVED.some((r) => name.includes(r))) errors.push(`name uses a reserved word (${RESERVED.join(", ")})`);
  }

  const desc = fm.description;
  if (!desc) errors.push("missing required field: description");
  else if (desc.length > MAX_DESC) errors.push(`description exceeds ${MAX_DESC} chars`);

  const bodyLines = body.split("\n").length;
  if (bodyLines > MAX_BODY_LINES) errors.push(`body is ${bodyLines} lines, over the ${MAX_BODY_LINES} limit; split into references/`);

  return errors.map((e) => `${path}: ${e}`);
}

function findSkills(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...findSkills(p));
    else if (entry === "SKILL.md") out.push(p);
  }
  return out;
}

const args = process.argv.slice(2);
let targets = args;
if (args.includes("--all")) {
  targets = findSkills("skills");
}
if (targets.length === 0) {
  console.error("usage: validate-skill.mjs <SKILL.md> [...] | --all");
  process.exit(1);
}

let failures = 0;
const seen = new Map();
for (const path of targets) {
  const errs = validate(path);
  // duplicate-name check across the batch
  try {
    const { fm } = parseFrontmatter(readFileSync(path, "utf8"));
    if (fm && fm.name) {
      if (seen.has(fm.name)) errs.push(`${path}: duplicate skill name "${fm.name}" (also in ${seen.get(fm.name)})`);
      else seen.set(fm.name, path);
    }
  } catch {}

  if (errs.length) {
    failures++;
    for (const e of errs) console.error("FAIL " + e);
  } else {
    console.log("OK   " + relative(process.cwd(), path));
  }
}

if (failures) {
  console.error(`\n${failures} skill(s) failed validation.`);
  process.exit(1);
}
console.log(`\nAll ${targets.length} skill(s) valid.`);
