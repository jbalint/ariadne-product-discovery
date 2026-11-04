#!/usr/bin/env sh
# PreToolUse guard: an Ariadne agent may write only under <project>/.ariadne/.
#
# Claude Code ignores hooks in plugin agent frontmatter, so this runs for every
# file write in the session and acts only when agent_type names an Ariadne
# agent (main session via `claude --agent ariadne:<stage>`, or a subagent).
# Everything else passes through untouched. Fails closed for Ariadne agents.

input=$(cat)

field() {
  printf '%s' "$input" | tr -d '\n' |
    sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p"
}

case "$(field agent_type)" in
  ariadne:discover|ariadne:audit|ariadne:architect) ;;
  *) exit 0 ;;
esac

path=$(field file_path)
[ -n "$path" ] || path=$(field notebook_path)
project=${CLAUDE_PROJECT_DIR:-$(field cwd)}

block() {
  echo "Ariadne agents may only write under .ariadne/ in the project ($1). Write your findings to the stage's .ariadne/*.md artifact instead." >&2
  exit 2
}

[ -n "$path" ] || block "could not determine the target path"
[ -n "$project" ] || block "could not determine the project directory"
case "$path" in
  */../*|../*|*/..) block "path contains '..'" ;;
  /*) ;;
  *) path="$project/$path" ;;
esac
case "$path" in
  "${project%/}"/.ariadne/*) exit 0 ;;
  *) block "$path" ;;
esac
