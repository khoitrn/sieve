#!/usr/bin/env node
// Interactive onboarding: asks a couple of short questions, asks the Sieve
// registry which skills fit, and installs only that shortlist (plus
// always-on guardrails) instead of the whole catalog. If the registry is
// unreachable for any reason (offline, DNS, non-2xx, timeout) this falls
// back to the full bundled-catalog copy from init.mjs — Sieve must keep
// working as a plain, portable, file-based layer even with no network.
//
// Usage: node scripts/onboard.mjs [target-dir] [--force] [--detect]
//        (target-dir defaults to the current directory)
//
// Registry URL: SIEVE_REGISTRY_URL env var, defaults to the maintained
// instance. Self-hosting your own registry is a first-class option, not an
// afterthought — Sieve stays vendor-neutral, including about its own infra.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { copyAsset, seedProjectFiles, writeBridgeFiles } from "./lib/scaffold.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = dirname(__dirname);
const args = process.argv.slice(2);
const force = args.includes("--force");
const detect = args.includes("--detect");
const target = args.find((a) => !a.startsWith("--")) || process.cwd();

const REGISTRY_URL = process.env.SIEVE_REGISTRY_URL ?? "https://sieve-registry.khoitrn.workers.dev";
const REQUEST_TIMEOUT_MS = 5000;

function gitRemote(dir) {
  const r = spawnSync("git", ["-C", dir, "remote", "get-url", "origin"], { encoding: "utf8" });
  if (r.status !== 0) return null;
  return r.stdout.trim() || null;
}

function loadOrCreateProjectId(dir) {
  const stateFile = join(dir, ".sieve", "project.json");
  if (existsSync(stateFile)) {
    try {
      const prev = JSON.parse(readFileSync(stateFile, "utf8"));
      if (prev.projectId) return prev.projectId;
    } catch {
      // fall through to generating a fresh id
    }
  }
  return randomUUID();
}

async function ask(rl, question) {
  return (await rl.question(question)).trim();
}

async function runInterview() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log("A couple of questions to pick the right skills — press Enter to skip any of them.\n");
    let modeAnswer = "";
    while (modeAnswer !== "new" && modeAnswer !== "existing") {
      modeAnswer = (await ask(rl, "Is this a new idea or an existing project? [new/existing] ")).toLowerCase();
      if (modeAnswer.startsWith("n")) modeAnswer = "new";
      else if (modeAnswer.startsWith("e")) modeAnswer = "existing";
    }
    const focusRaw = await ask(rl, "Any specific focus areas (comma-separated, e.g. \"maintenance, testing\")? ");
    const focus = focusRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { mode: modeAnswer === "new" ? "new-idea" : "existing-project", focus };
  } finally {
    rl.close();
  }
}

async function fetchRegistry(path, init) {
  const res = await fetch(`${REGISTRY_URL}${path}`, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

function fallbackToFullCatalog(reason) {
  console.log(`\nRegistry unavailable (${reason}) — falling back to the full bundled catalog.\n`);
  copyAsset(pkgRoot, target, "skills", force);
  return { source: "offline-fallback", assignedSkills: [] };
}

async function pullFromRegistry(answers) {
  const [skills, choice] = await Promise.all([
    fetchRegistry("/api/skills", { method: "GET" }),
    fetchRegistry("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    }),
  ]);

  const wanted = new Set([...choice.guardrails, ...choice.recommended]);
  const bySkillName = new Map(skills.map((s) => [s.name, s]));
  const installed = [];

  for (const name of wanted) {
    const skill = bySkillName.get(name);
    if (!skill) continue;
    const skillDir = join("skills", skill.category, skill.name);
    const dst = join(target, skillDir);
    if (existsSync(dst) && !force) {
      console.log(`skip  ${skillDir} (exists; use --force to overwrite)`);
    } else {
      mkdirSync(dirname(join(dst, "SKILL.md")), { recursive: true });
      writeFileSync(join(dst, "SKILL.md"), skill.body);
      console.log(`pull  ${skillDir}`);
    }
    installed.push({ name: skill.name, version: skill.version });
  }

  return { source: "registry", assignedSkills: installed };
}

async function recordAssignment(projectId, repo, assignedSkills) {
  try {
    await fetchRegistry("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: projectId, repo }),
    });
    await fetchRegistry(`/api/projects/${encodeURIComponent(projectId)}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: assignedSkills }),
    });
  } catch (err) {
    console.log(`note  could not record assignment with the registry (${err.message}) — continuing`);
  }
}

mkdirSync(target, { recursive: true });

console.log(`Onboarding Sieve into ${target}\n`);
copyAsset(pkgRoot, target, "AGENTS.md", force);
copyAsset(pkgRoot, target, "sieve.index.json", force);
copyAsset(pkgRoot, target, "templates", force);
seedProjectFiles(pkgRoot, target, force);

const answers = await runInterview();

let result;
try {
  result = await pullFromRegistry(answers);
} catch (err) {
  result = fallbackToFullCatalog(err.message);
}

const projectId = loadOrCreateProjectId(target);
const repo = gitRemote(target);

if (result.source === "registry") {
  await recordAssignment(projectId, repo, result.assignedSkills);
}

mkdirSync(join(target, ".sieve"), { recursive: true });
writeFileSync(
  join(target, ".sieve", "project.json"),
  JSON.stringify({ projectId, source: result.source, assignedSkills: result.assignedSkills, updatedAt: new Date().toISOString() }, null, 2) + "\n",
);
console.log("write .sieve/project.json");

writeBridgeFiles(pkgRoot, target, detect);

console.log(`\nSieve is ready in ${target}.`);
console.log("Open your coding agent there and describe what you want to build.");
