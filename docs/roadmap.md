# Roadmap

Ariadne is deliberately small. The roadmap favors making discovery sharper over
adding surface area.

## Shipped — v0.1

- Three-stage pipeline: Discover → Audit → Architect.
- Per-stage artifacts under `.ariadne/`, with write access scoped to each
  agent's own file.
- OpenCode V2 primary agents.
- Claude Code slash-command ports.
- Installer with `--opencode`, `--claude`, `--dry-run`, and `--uninstall`.
- Logo set and reproducible generator.

## Next

### Session memory across rounds

**Problem:** long discovery sessions lose earlier nuance when context is
compacted.

**Idea:** keep a compact "state of understanding" block at the top of
`discovery.md` — current model, confirmed decisions, and the live uncertainty —
so a fresh session can resume without replaying the whole conversation.

### Structured output

**Problem:** downstream agents read Markdown inconsistently.

**Idea:** emit an optional `discovery.json` alongside the Markdown, with stable
IDs for requirements, gaps, and questions. Keep Markdown as the human view.

### Seed discovery from existing tickets

**Problem:** intent often already exists, scattered across issues and docs.

**Idea:** ingest issue-tracker exports and pre-fill the requirements register
with `Observed` claims, then interview only where evidence conflicts.

### More tool ports

- Cursor rules
- Windsurf workflows
- A plain "paste into any chat" prompt with no tool assumptions

## Later

- **Confidence calibration.** Compare the agent's stated confidence with how
  often the owner confirms the inference, and tune the prompt.
- **Contradiction ledger.** Track conflicts across sessions instead of resolving
  them per session.
- **Review mode.** A read-only pass over an existing `.ariadne/` set that flags
  requirements that were never confirmed.
- **Example gallery.** A curated set of real transcripts, including failures.

## Non-goals

- Generating code or patches.
- Estimating effort or scheduling work.
- Replacing user research.
- Prescribing architecture.
- Becoming a general project-management framework.

## How to influence it

Open an issue describing the discovery moment that failed. A concrete transcript
is worth more than a feature request.
