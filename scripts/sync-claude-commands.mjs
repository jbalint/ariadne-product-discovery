#!/usr/bin/env node
// Regenerates every derived port from agents/*.md:
//
//   claude/commands/<stage>.md        Claude Code slash commands (plugin + install.sh)
//   claude/agents/<stage>.md          Claude Code agents with a real tool allowlist
//   skills/ariadne-<stage>/SKILL.md   Agent Skills, for any tool that reads SKILL.md
//
// The OpenCode agents are the source of truth. The persona body must stay
// identical everywhere; only the frontmatter and the trailing hook differ.
// Run this after editing anything in agents/:
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
    color: "yellow",
    whenToUse:
      "Use when the user wants to work out what a product or feature should do and how it should feel before any code is written, or says the current behavior feels wrong without being able to say why.",
  },
  audit: {
    description:
      "Audit a product or system proposal for prior art, novelty, and risk",
    hint: "[the proposal to audit]",
    subject: "the proposal in .ariadne/discovery.md",
    color: "blue",
    whenToUse:
      "Use after discovery, when a product idea needs stress-testing against prior art, risks, and the strongest competing design before planning.",
  },
  architect: {
    description:
      "Turn a clarified product vision into an implementation-ready plan",
    hint: "[the vision to plan]",
    subject: "the vision in .ariadne/discovery.md",
    color: "green",
    whenToUse:
      "Use when a product vision is clarified (usually in .ariadne/discovery.md) and needs a repository-aware implementation plan, without writing code.",
  },
};

// OpenCode permission action -> Claude Code tools. Both "allow" and "ask" grant
// the tool; Claude Code's own permission prompts cover "ask" (Bash prompts by
// default). Edit scoping to .ariadne/ is enforced by claude/hooks/guard-writes.sh.
const TOOLS = {
  read: ["Read"],
  glob: ["Glob"],
  grep: ["Grep"],
  edit: ["Write", "Edit"],
  webfetch: ["WebFetch"],
  websearch: ["WebSearch"],
  shell: ["Bash"],
};

function parse(name) {
  const source = readFileSync(join(ROOT, `agents/ariadne-${name}.md`), "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  const body = source.slice(match[0].length).trimStart();
  const rules = [
    ...match[1].matchAll(
      /^\s*-\s*action:\s*(\S+)\s*\n\s*resource:\s*(.+?)\s*\n\s*effect:\s*(\S+)/gm
    ),
  ].map(([, action, resource, effect]) => ({
    action: action.replace(/["']/g, ""),
    resource: resource.replace(/["']/g, ""),
    effect: effect.replace(/["']/g, ""),
  }));

  const tools = [];
  for (const { action, resource, effect } of rules) {
    if (action === "*" || effect === "deny") continue;
    if (!TOOLS[action]) throw new Error(`${name}: no Claude mapping for "${action}"`);
    if (action === "edit" && resource !== ".ariadne/**") {
      throw new Error(`${name}: edit scope "${resource}" is not enforced by the Claude write guard`);
    }
    tools.push(...TOOLS[action]);
  }
  return { body, tools: [...new Set(tools)] };
}

function write(rel, text) {
  const dest = join(ROOT, rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, text);
  console.log("wrote", rel);
}

for (const [name, meta] of Object.entries(META)) {
  const { body, tools } = parse(name);

  write(
    `claude/commands/${name}.md`,
    `---
description: ${meta.description}
argument-hint: "${meta.hint}"
---

${body}

---

If \`$ARGUMENTS\` is non-empty, treat it as the subject of this session. Otherwise, ask me what we are working on. Default to ${meta.subject}.
`
  );

  write(
    `claude/agents/${name}.md`,
    `---
name: ${name}
description: >-
  ${meta.description}. Interactive: run it as the main session with
  \`claude --agent ariadne:${name}\` rather than delegating to it.
tools: ${tools.join(", ")}
color: ${meta.color}
---

${body}
`
  );

  write(
    `skills/ariadne-${name}/SKILL.md`,
    `---
name: ariadne-${name}
description: >-
  ${meta.description}. ${meta.whenToUse}
---

${body}

---

Treat whatever the user said when invoking this skill as the subject of the session. If they gave none, ask what we are working on. Default to ${meta.subject}.
`
  );
}
