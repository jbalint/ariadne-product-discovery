#!/usr/bin/env sh
# Tests claude/hooks/guard-writes.sh against PreToolUse payloads shaped like
# the ones Claude Code sends. Used by CI; also: sh scripts/test-guard.sh

set -u
GUARD="$(dirname "$0")/../claude/hooks/guard-writes.sh"
failed=0

expect() {
  want="$1" label="$2" payload="$3"
  printf '%s' "$payload" | CLAUDE_PROJECT_DIR=/p sh "$GUARD" 2>/dev/null
  got=$?
  if [ "$got" -eq "$want" ]; then
    echo "ok   $label"
  else
    echo "FAIL $label (exit $got, want $want)"
    failed=1
  fi
}

expect 0 "non-Ariadne agent writes anywhere" '{"agent_type":"general-purpose","tool_name":"Write","tool_input":{"file_path":"/p/src/a.ts"}}'
expect 0 "main session without --agent"      '{"tool_name":"Write","tool_input":{"file_path":"/p/src/a.ts"}}'
expect 0 "discover writes its artifact"       '{"agent_type":"ariadne:discover","tool_name":"Write","tool_input":{"file_path":"/p/.ariadne/discovery.md","content":"# x"}}'
expect 0 "audit, relative artifact path"      '{"agent_type":"ariadne:audit","tool_name":"Edit","tool_input":{"file_path":".ariadne/audit.md"}}'
expect 2 "discover writes source"             '{"agent_type":"ariadne:discover","tool_name":"Write","tool_input":{"file_path":"/p/src/a.ts"}}'
expect 2 "escape with .."                     '{"agent_type":"ariadne:audit","tool_name":"Write","tool_input":{"file_path":"/p/.ariadne/../src/a.ts"}}'
expect 2 "lookalike sibling directory"        '{"agent_type":"ariadne:architect","tool_name":"Write","tool_input":{"file_path":"/p/.ariadne-x/a"}}'
expect 2 "notebook outside .ariadne"          '{"agent_type":"ariadne:architect","tool_name":"NotebookEdit","tool_input":{"notebook_path":"/p/n.ipynb"}}'
expect 2 "missing path fails closed"          '{"agent_type":"ariadne:architect","tool_name":"Write","tool_input":{}}'
expect 2 "spoofed path inside content"        '{"agent_type":"ariadne:discover","tool_name":"Write","tool_input":{"file_path":"/p/src/a.ts","content":"\"file_path\": \"/p/.ariadne/x.md\""}}'

exit $failed
