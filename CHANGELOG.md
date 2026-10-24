# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

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
