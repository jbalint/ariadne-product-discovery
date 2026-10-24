#!/usr/bin/env sh
# Ariadne installer — copies the agents into OpenCode and/or Claude Code.
#
#   ./install.sh                 # install for both tools
#   ./install.sh --opencode      # OpenCode only
#   ./install.sh --claude        # Claude Code only
#   ./install.sh --dry-run       # show what would happen
#   ./install.sh --uninstall     # remove Ariadne from both tools
#
# Also works without cloning:
#   curl -fsSL https://raw.githubusercontent.com/jbalint/ariadne-product-discovery/main/install.sh | sh

set -eu

REPO="jbalint/ariadne-product-discovery"
BRANCH="main"

OPENCODE_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode/agents"
CLAUDE_DIR="$HOME/.claude/commands"

DO_OPENCODE=0
DO_CLAUDE=0
DRY_RUN=0
UNINSTALL=0
TMPDIR_DL=""

AGENTS="ariadne-discover ariadne-audit ariadne-architect"

say() { printf '%s\n' "$*"; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<'EOF'
Ariadne installer

Usage: ./install.sh [options]

Options:
  --opencode     Install the OpenCode agents
  --claude       Install the Claude Code slash commands
  --all          Install for both (default)
  --dry-run      Print what would be written, change nothing
  --uninstall    Remove Ariadne from the selected tools
  -h, --help     Show this help
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --opencode) DO_OPENCODE=1 ;;
    --claude) DO_CLAUDE=1 ;;
    --all) DO_OPENCODE=1; DO_CLAUDE=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --uninstall) UNINSTALL=1 ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown argument: $1" ;;
  esac
  shift
done

if [ "$DO_OPENCODE" -eq 0 ] && [ "$DO_CLAUDE" -eq 0 ]; then
  DO_OPENCODE=1
  DO_CLAUDE=1
fi

# --- Locate the source tree (checkout, or download when piped) --------------

SCRIPT_PATH="$0"
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$SCRIPT_PATH")" 2>/dev/null && pwd || true)

if [ -n "$SCRIPT_DIR" ] && [ -d "$SCRIPT_DIR/agents" ] && [ -d "$SCRIPT_DIR/claude" ]; then
  SRC="$SCRIPT_DIR"
else
  command -v curl >/dev/null 2>&1 || die "curl is required to install from the network"
  TMPDIR_DL=$(mktemp -d "${TMPDIR:-/tmp}/ariadne.XXXXXX")
  # shellcheck disable=SC2064
  trap "rm -rf '$TMPDIR_DL'" EXIT INT TERM
  say "Downloading ${REPO}@${BRANCH} ..."
  curl -fsSL "https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz" \
    -o "$TMPDIR_DL/repo.tar.gz" || die "download failed"
  tar -xzf "$TMPDIR_DL/repo.tar.gz" -C "$TMPDIR_DL"
  SRC=$(find "$TMPDIR_DL" -maxdepth 1 -type d -name 'ariadne-product-discovery-*' | head -n 1)
  [ -n "$SRC" ] || die "could not unpack the archive"
fi

# --- Helpers ---------------------------------------------------------------

install_file() {
  src="$1"
  dest="$2"
  if [ "$DRY_RUN" -eq 1 ]; then
    say "would write $dest"
  else
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    say "wrote $dest"
  fi
}

remove_file() {
  dest="$1"
  if [ "$DRY_RUN" -eq 1 ]; then
    say "would remove $dest"
  else
    rm -f "$dest"
    say "removed $dest"
  fi
}

# --- Uninstall -------------------------------------------------------------

if [ "$UNINSTALL" -eq 1 ]; then
  if [ "$DO_OPENCODE" -eq 1 ]; then
    for a in $AGENTS; do remove_file "$OPENCODE_DIR/$a.md"; done
  fi
  if [ "$DO_CLAUDE" -eq 1 ]; then
    for a in $AGENTS; do remove_file "$CLAUDE_DIR/$a.md"; done
  fi
  say ""
  say "Ariadne removed. Your .ariadne/ project artifacts were left untouched."
  exit 0
fi

# --- Install ---------------------------------------------------------------

if [ "$DO_OPENCODE" -eq 1 ]; then
  [ -d "$SRC/agents" ] || die "missing $SRC/agents"
  say "OpenCode agents -> $OPENCODE_DIR"
  for a in $AGENTS; do
    install_file "$SRC/agents/$a.md" "$OPENCODE_DIR/$a.md"
  done
fi

if [ "$DO_CLAUDE" -eq 1 ]; then
  [ -d "$SRC/claude/commands" ] || die "missing $SRC/claude/commands"
  say "Claude Code commands -> $CLAUDE_DIR"
  for a in $AGENTS; do
    install_file "$SRC/claude/commands/$a.md" "$CLAUDE_DIR/$a.md"
  done
fi

say ""
if [ "$DRY_RUN" -eq 1 ]; then
  say "Dry run complete. Nothing was changed."
else
  say "Done."
  say "  OpenCode:    choose the 'ariadne-discover' agent, then describe what you are building."
  say "  Claude Code: run /ariadne-discover"
  say ""
  say "Each stage writes a Markdown artifact under .ariadne/ in your project."
fi
