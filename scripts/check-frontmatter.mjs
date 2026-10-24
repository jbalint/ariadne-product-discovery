#!/usr/bin/env node
// Validates the OpenCode agent frontmatter without external dependencies.
// Used by CI; also useful locally: node scripts/check-frontmatter.mjs

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AGENTS_DIR = join(ROOT, "agents");

const ALLOWED_KEYS = new Set(["description", "mode", "color", "permissions"]);
const REQUIRED_KEYS = ["description", "mode", "permissions"];
const EFFECTS = new Set(["allow", "ask", "deny"]);
const MODES = new Set(["primary", "subagent", "all"]);

let failed = false;
const fail = (msg) => {
  console.error(`FAIL ${msg}`);
  failed = true;
};

const files = readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".md"));
if (files.length === 0) fail("no agent files found");

for (const file of files) {
  const text = readFileSync(join(AGENTS_DIR, file), "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    fail(`${file}: missing YAML frontmatter`);
    continue;
  }

  const fm = match[1];
  const keys = [...fm.matchAll(/^([a-zA-Z][\w-]*):/gm)].map((m) => m[1]);

  for (const key of keys) {
    if (!ALLOWED_KEYS.has(key)) fail(`${file}: unexpected frontmatter key "${key}"`);
  }
  for (const key of REQUIRED_KEYS) {
    if (!keys.includes(key)) fail(`${file}: missing required key "${key}"`);
  }

  const mode = fm.match(/^mode:\s*(\S+)/m)?.[1]?.replace(/["']/g, "");
  if (mode && !MODES.has(mode)) fail(`${file}: invalid mode "${mode}"`);

  const entries = [
    ...fm.matchAll(
      /^\s*-\s*action:\s*(\S+)\s*\n\s*resource:\s*(.+?)\s*\n\s*effect:\s*(\S+)/gm
    ),
  ];

  if (entries.length === 0) fail(`${file}: no permission entries`);

  entries.forEach((entry, index) => {
    const [, action, resource, effect] = entry;
    if (!EFFECTS.has(effect.replace(/["']/g, ""))) {
      fail(`${file}: permission ${index + 1} has invalid effect "${effect}"`);
    }
    if (!action.trim() || !resource.trim()) {
      fail(`${file}: permission ${index + 1} is missing action or resource`);
    }
  });

  if (entries.length > 0) {
    const firstEffect = entries[0][3]?.replace(/["']/g, "");
    if (firstEffect !== "deny") {
      fail(`${file}: first permission rule should deny by default`);
    }
  }

  console.log(`ok   ${file} (${entries.length} permission rules)`);
}

process.exit(failed ? 1 : 0);
