#!/usr/bin/env node
// Regenerates claude/commands/*.md from agents/*.md.
//
// The OpenCode agents are the source of truth. Claude Code commands need their
// own frontmatter and an $ARGUMENTS hook, but the persona body must stay
// identical. Run this after editing anything in agents/:
//
//   node scripts/sync-claude-commands.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const META = {
  discover: {
    description: "Run an Ariadne product-discovery interview",
    hint: "[what you are designing]",
    subject: "this product",
  },
  audit: {
    description:
      "Audit a product or system proposal for prior art, novelty, and risk",
    hint: "[the proposal to audit]",
    subject: "the proposal in .ariadne/discovery.md",
  },
  architect: {
    description:
      "Turn a clarified product vision into an implementation-ready plan",
    hint: "[the vision to plan]",
    subject: "the vision in .ariadne/discovery.md",
  },
};

mkdirSync(join(ROOT, "claude/commands"), { recursive: true });

for (const [name, meta] of Object.entries(META)) {
  const source = readFileSync(join(ROOT, `agents/ariadne-${name}.md`), "utf8");
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, "").trimStart();

  const output = `---
description: ${meta.description}
argument-hint: "${meta.hint}"
---

${body}

---

If \`$ARGUMENTS\` is non-empty, treat it as the subject of this session. Otherwise, ask me what we are working on. Default to ${meta.subject}.
`;

  const dest = join(ROOT, `claude/commands/ariadne-${name}.md`);
  writeFileSync(dest, output);
  console.log("wrote", dest);
}
