#!/usr/bin/env bash
# Mirror the canonical shared contract into all three repos (Constitution Principle I).
#
#   contract/contract.ts  + SCHEMA.md  -> {nextgear-site,drivemind-admin,drivemind-chatbot}/lib/
#   contract/kb-schema.sql              -> {drivemind-admin,drivemind-chatbot}/supabase/
#
# Run this whenever the contract changes — in the SAME change set across repos.
# CI (.github/workflows/ci.yml) re-runs this in --check mode and fails on drift.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/contract"
CONTRACT_TARGETS=(nextgear-site drivemind-admin drivemind-chatbot)
KB_TARGETS=(drivemind-admin drivemind-chatbot)

CHECK=0
[[ "${1:-}" == "--check" ]] && CHECK=1

copy_or_check() {
  local src="$1" dst="$2"
  if [[ "$CHECK" -eq 1 ]]; then
    if ! diff -q "$src" "$dst" >/dev/null 2>&1; then
      echo "DRIFT: $dst differs from canonical $src" >&2
      return 1
    fi
  else
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
    echo "synced: $dst"
  fi
}

rc=0
for app in "${CONTRACT_TARGETS[@]}"; do
  copy_or_check "$SRC/contract.ts" "$ROOT/$app/lib/contract.ts" || rc=1
  copy_or_check "$SRC/SCHEMA.md"   "$ROOT/$app/lib/SCHEMA.md"   || rc=1
done
for app in "${KB_TARGETS[@]}"; do
  copy_or_check "$SRC/kb-schema.sql" "$ROOT/$app/supabase/kb-schema.sql" || rc=1
done

if [[ "$CHECK" -eq 1 && "$rc" -eq 0 ]]; then echo "contract in sync ✓"; fi
exit "$rc"
