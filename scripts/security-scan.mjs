#!/usr/bin/env node
// Heuristic pattern scan over every skills/**/SKILL.md body. Same rule set
// as sieve-registry's src/security-scan.ts (kept in sync by hand — this
// repo has zero dependencies and no build step, so there's nothing to
// import from across repos). A first-pass filter, not a semantic security
// review: it catches the shape of an attack (a curl-pipe-to-shell, a
// prompt-injection phrase, a credential read paired with an outbound call,
// an obfuscated blob), not a guarantee that content is safe.
//
// Usage: node scripts/security-scan.mjs   (exits 1 if anything is flagged)

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(fileURLToPath(import.meta.url), "..", "..");

const RULES = [
  {
    id: "pipe-to-shell",
    pattern: /\b(curl|wget)\b[^\n`]{0,200}\|\s*(sudo\s+)?(sh|bash|zsh)\b/i,
    reason: "downloads and pipes straight into a shell",
  },
  {
    id: "eval-exec",
    pattern: /\b(eval|exec)\s*\(\s*(atob|Buffer\.from|base64)/i,
    reason: "decodes and evaluates/executes an encoded payload",
  },
  {
    id: "prompt-injection-ignore",
    pattern: /\b(ignore|disregard)\b[^\n]{0,40}\b(previous|prior|all|above)\b[^\n]{0,20}\b(instructions?|rules?|guardrails?)\b/i,
    reason: "phrasing that reads as an attempt to override prior instructions",
  },
  {
    id: "prompt-injection-mode",
    pattern: /\byou are now in\b[^\n]{0,30}\b(developer|debug|unrestricted|unfiltered|jailbreak)\b/i,
    reason: "phrasing that reads as a jailbreak/mode-switch attempt",
  },
  {
    id: "prompt-injection-secrecy",
    pattern: /\bdo not\b[^\n]{0,20}\b(tell|inform|mention|reveal)\b[^\n]{0,20}\buser\b/i,
    reason: "instructs the agent to hide actions from the user",
  },
  {
    id: "reveal-system-prompt",
    pattern: /\breveal\b[^\n]{0,20}\b(system prompt|hidden instructions|your instructions)\b/i,
    reason: "attempts to extract the agent's own system prompt",
  },
  {
    id: "obfuscated-blob",
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
    reason: "contains a long base64-like blob, unusual in an instructional file",
  },
];

const SECRET_HINTS = /(\.ssh\/id_rsa|\.aws\/credentials|\.npmrc|process\.env\[|~\/\.env\b)/i;
const NETWORK_HINTS = /\b(curl\s+https?:|fetch\(|axios\.|https?:\/\/(?!localhost|127\.0\.0\.1))/i;

function scanSkillBody(body) {
  const reasons = [];
  for (const rule of RULES) {
    if (rule.pattern.test(body)) reasons.push(rule.reason);
  }
  if (SECRET_HINTS.test(body) && NETWORK_HINTS.test(body)) {
    reasons.push("reads a credential path and makes a network call in the same file");
  }
  return { flagged: reasons.length > 0, reasons };
}

function findSkillFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  let out = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(findSkillFiles(p));
    else if (e.name === "SKILL.md") out.push(p);
  }
  return out;
}

const skillsDir = join(pkgRoot, "skills");
const files = findSkillFiles(skillsDir);
let flaggedCount = 0;

for (const file of files) {
  const body = readFileSync(file, "utf8");
  const result = scanSkillBody(body);
  if (result.flagged) {
    flaggedCount++;
    console.log(`FLAGGED  ${file.replace(pkgRoot + "/", "")}`);
    for (const reason of result.reasons) console.log(`  - ${reason}`);
  }
}

console.log(`\nScanned ${files.length} skill file(s), ${flaggedCount} flagged.`);
if (flaggedCount > 0) {
  console.log("This is a heuristic filter, not a semantic review — triage each flag by hand.");
  process.exit(1);
}
