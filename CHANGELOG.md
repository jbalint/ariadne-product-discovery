# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [0.2.0] — 2026-11-04

### Added

- Claude Code plugin and marketplace: `/plugin marketplace add
  jbalint/ariadne-product-discovery`, then `/plugin install
  ariadne@ariadne-product-discovery`.
- Claude Code agents (`ariadne:discover`, `ariadne:audit`, `ariadne:architect`)
  with tool allowlists generated from the OpenCode permissions. Run one as the
  main session with `claude --agent ariadne:discover`.
- A plugin `PreToolUse` hook that blocks Ariadne agents from writing outside
  `.ariadne/`, so the per-stage write scoping is enforced on Claude Code too.
- Agent Skills (`skills/ariadne-*/SKILL.md`) for tools that read `SKILL.md`.
- Issue forms for failure cases and discovery transcripts.

### Changed

- Generated Claude commands are now `claude/commands/<stage>.md`; inside the
  plugin they are `/ariadne:discover`, `/ariadne:audit`, `/ariadne:architect`.
  `install.sh --claude` still installs them as `/ariadne-discover` and so on.
- The clone-free installer downloads a release tag instead of `main`.
- README compares Ariadne against Spec Kit, Kiro specs, and the BMAD Method.

## [0.1.0] — 2026-10-23

### Added

- `ariadne-discover`, `ariadne-audit`, and `ariadne-architect` — the three-stage
  product-discovery pipeline, as OpenCode V2 primary agents.
- Per-stage write scoping: each agent may write only its own `.ariadne/`
  artifact and nothing else.
- Claude Code slash-command ports (`/ariadne-discover`, `/ariadne-audit`,
  `/ariadne-architect`).
- `install.sh` with `--opencode`, `--claude`, `--dry-run`, and `--uninstall`,
  including a clone-free install path.
- Logo set: square icon, light and dark lockups, and a README hero banner, plus
  a reproducible SVG generator.
- Documentation: worked examples, methodology, comparison, and roadmap.
