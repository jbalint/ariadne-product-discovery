# Contributing

Thanks for considering a contribution. Ariadne is a small project with a narrow
job, so the most valuable contributions are usually not more features.

## What helps most

1. **Real discovery transcripts.** A worked session where the agent changed your
   understanding of your own product. Remove anything sensitive and add it to
   `docs/examples.md`.
2. **Failure cases.** Sessions where Ariadne converged too early, accepted an
   implementation artifact as a requirement, presented an inference as a fact,
   or asked a low-value question. These are the most useful bug reports.
3. **Ports to other tools.** Cursor rules, Windsurf workflows, or a clean
   "paste this into any chat" prompt.
4. **Wording fixes** that make the agent's questions sharper or its guardrails
   less ambiguous.

## Repository layout

```
agents/                 OpenCode agents — the source of truth
claude/commands/        Generated Claude Code ports
scripts/                sync-claude-commands.mjs
docs/                   Examples, methodology, comparison, roadmap
logo/                   SVG assets + generate.mjs
install.sh              Installer
```

## Editing an agent

The OpenCode agents in `agents/` are canonical. They use the OpenCode **V2**
agent format:

```yaml
---
description: What the agent is for
mode: primary
color: "#E8B04B"
permissions:
  - action: "*"
    resource: "*"
    effect: deny
  - action: read
    resource: "*"
    effect: allow
  - action: edit
    resource: ".ariadne/**"
    effect: allow
---
```

Notes:

- `permissions` is an ordered list and **the last matching rule wins**. Put broad
  rules first and exceptions after.
- Each agent may write only its own `.ariadne/` artifact. Discovery must not get
  shell access or unrestricted edit access; that restriction is the product.
- Do not mix V1 fields (`permission`, `tools`, `temperature`) into a V2 file.
  If any V2 field is present, the V1 fields are ignored.

After editing an agent, regenerate the Claude Code ports:

```sh
node scripts/sync-claude-commands.mjs
```

Do not edit `claude/commands/` by hand — it is generated.

## Changing the logo

The SVGs are generated. Edit `logo/generate.mjs` and run:

```sh
node logo/generate.mjs
```

Then check the result by rasterizing it:

```sh
rsvg-convert -w 512 -h 512 logo/ariadne-icon.svg -o /tmp/icon.png
```

## Pull requests

- Keep a PR focused on one change.
- If you change an agent's behavior, include a before/after transcript.
- If you change permissions, explain why the new access is required by the job.
- Run `node scripts/sync-claude-commands.mjs` and commit the result.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
