#!/usr/bin/env node
// Write bridge files so agents that do NOT read AGENTS.md natively still get the
// same protocol. AGENTS.md stays the single source of truth; every other file is a
// thin pointer to it. Idempotent: safe to re-run.
//
// Usage: node scripts/bridge.mjs           (write bridges for all known agents)
//        node scripts/bridge.mjs --detect   (only write for agents whose config dir exists)

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const CANON = "AGENTS.md";

// Each agent that does not read AGENTS.md natively gets a pointer file.
// `detect` is a path whose presence suggests the agent is in use.
const BRIDGES = [
  {
    agent: "Claude Code",
    file: "CLAUDE.md",
    detect: [".claude", "CLAUDE.md"],
    body: `@AGENTS.md\n\n## Claude Code\n\nAGENTS.md is the single source of truth. The import above pulls it in.\nAdd Claude-only overrides below this line if needed. Keep them minimal.\n`,
  },
  {
    agent: "Gemini CLI",
    file: "GEMINI.md",
    detect: [".gemini", "GEMINI.md"],
    body: `# Gemini\n\nThis project uses AGENTS.md as the single source of truth for agent behavior.\nRead ${CANON} in the repository root and follow it.\n`,
  },
  {
    agent: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
    detect: [".github"],
    body: `# Copilot instructions\n\nThis project uses AGENTS.md as the single source of truth for agent behavior.\nRead ${CANON} in the repository root and follow it.\n`,
  },
  {
    agent: "Cursor",
    file: ".cursor/rules/sieve.mdc",
    detect: [".cursor", ".cursorrules"],
    body: `---\ndescription: Use AGENTS.md as the source of truth\nalwaysApply: true\n---\n\nThis project uses AGENTS.md as the single source of truth for agent behavior.\nRead ${CANON} in the repository root and follow it.\n`,
  },
  {
    agent: "Windsurf",
    file: ".windsurfrules",
    detect: [".windsurf", ".windsurfrules"],
    body: `This project uses AGENTS.md as the single source of truth for agent behavior.\nRead ${CANON} in the repository root and follow it.\n`,
  },
];

if (!existsSync(CANON)) {
  console.error(`error: ${CANON} not found in the current directory. Run this from the project root.`);
  process.exit(1);
}

const detectOnly = process.argv.includes("--detect");
let written = 0;

for (const b of BRIDGES) {
  if (detectOnly && !b.detect.some((p) => existsSync(p))) {
    console.log(`skip  ${b.agent} (not detected)`);
    continue;
  }
  const dir = dirname(b.file);
  if (dir && dir !== "." && !existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(b.file, b.body);
  console.log(`write ${b.file}  (${b.agent})`);
  written++;
}

console.log(`\n${written} bridge file(s) written. AGENTS.md remains the source of truth.`);
