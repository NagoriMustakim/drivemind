#!/usr/bin/env bash
#
# Start (or restart) all three DriveMind apps on fixed ports:
#   nextgear-site     → http://localhost:3000   (dealer website + Otto)
#   drivemind-admin   → http://localhost:3001   (Sync control plane)
#   drivemind-chatbot → http://localhost:3002   (assistant API + /otto.js)
#
# Usage:
#   ./dev.sh           # stop ports, install missing deps, build widget, start all 3
#   ./dev.sh stop      # stop all 3
#   ./dev.sh restart   # same as default
#
# Dependencies: each app's node_modules is installed automatically if missing,
# and left untouched if already present.
#
# Logs: combined output from all 3 servers streams into THIS terminal (each line
# prefixed with [app]) and is also saved to .dev-logs/<app>.log.
# Stop: press Ctrl+C, or run ./dev.sh stop in another terminal.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGDIR="$ROOT/.dev-logs"
mkdir -p "$LOGDIR"

# app:port pairs (kept as a simple list for portability)
APPS=("nextgear-site:3000" "drivemind-admin:3001" "drivemind-chatbot:3002")

kill_port() {
  local port="$1" pids=""
  if command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -ti "tcp:$port" 2>/dev/null || true)"
  elif command -v fuser >/dev/null 2>&1; then
    pids="$(fuser "$port/tcp" 2>/dev/null || true)"
  fi
  if [ -n "$pids" ]; then
    echo "  • freeing port $port (pids: $pids)"
    kill $pids 2>/dev/null || true
    sleep 1
    kill -9 $pids 2>/dev/null || true
  fi
}

stop_all() {
  echo "Stopping DriveMind dev servers..."
  for pair in "${APPS[@]}"; do
    kill_port "${pair##*:}"
  done
  echo "Stopped."
}

start_all() {
  echo "Building the Otto widget (so /otto.js is served)..."
  ( cd "$ROOT/drivemind-chatbot" && npm run widget:build ) >"$LOGDIR/widget-build.log" 2>&1 \
    && echo "  • widget built" \
    || { echo "  ! widget build failed — see .dev-logs/widget-build.log"; }

  echo "Checking dependencies..."
  for pair in "${APPS[@]}"; do
    local app="${pair%%:*}"
    if [ ! -d "$ROOT/$app/node_modules" ]; then
      echo "  • $app: node_modules missing — installing..."
      ( cd "$ROOT/$app" && npm install ) >"$LOGDIR/$app-install.log" 2>&1 \
        && echo "    ↳ installed" \
        || { echo "    ! $app: npm install failed — see .dev-logs/$app-install.log"; exit 1; }
    else
      echo "  • $app: node_modules present — skipping install"
    fi
  done

  echo "Starting servers..."
  PIDS=()
  for pair in "${APPS[@]}"; do
    local app="${pair%%:*}" port="${pair##*:}"
    # Prefix every line of this app's output with its name, stream to this
    # terminal AND the per-app log file.
    ( cd "$ROOT/$app" && exec npm run dev -- -p "$port" ) 2>&1 \
      | sed "s/^/[$app] /" | tee "$LOGDIR/$app.log" &
    PIDS+=("$!")
    echo "  • $app → http://localhost:$port   (log: .dev-logs/$app.log)"
  done

  echo ""
  echo "All three running. Combined logs stream below — press Ctrl+C to stop all."
  echo "--------------------------------------------------------------------------"

  # On Ctrl+C (or any exit), stop every server before leaving.
  trap 'echo ""; stop_all; exit 0' INT TERM

  # Wait on the streaming pipelines so logs keep flowing in this terminal.
  wait "${PIDS[@]}"
}

case "${1:-start}" in
  stop)
    stop_all
    ;;
  start | restart | "")
    stop_all
    start_all
    ;;
  *)
    echo "usage: ./dev.sh [start|stop|restart]" >&2
    exit 1
    ;;
esac
