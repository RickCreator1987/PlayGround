#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

PROJECT_DIR="$(pwd)"
PORT="${PORT:-3000}"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
DIST_DIR="$PROJECT_DIR/dist"
export PROJECT_DIR PORT WEB_DIR DIST_DIR

echo "[start] project=$PROJECT_DIR port=$PORT dist=$DIST_DIR"
/usr/bin/time -p mkdir -p "$WEB_DIR"

if [[ ! -d node_modules/vite || ! -d node_modules/react ]]; then
  if [[ -f package-lock.json ]]; then
    echo '[start] installing dependencies with npm ci'
    /usr/bin/time -p npm ci --no-audit --no-fund --include=dev
  else
    echo '[start] installing dependencies with npm install'
    /usr/bin/time -p npm install --no-audit --no-fund --include=dev
  fi
else
  echo '[start] dependencies already installed'
fi

echo '[start] building static output'
/usr/bin/time -p npm run build

if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "[start] build did not produce $DIST_DIR/index.html" >&2
  exit 1
fi

echo '[start] writing deployment output metadata'
/usr/bin/time -p node -e '
const fs = require("node:fs")
const path = require("node:path")
const file = path.join(process.env.WEB_DIR, "deployment-output.json")
fs.writeFileSync(
  file,
  JSON.stringify({ project: process.env.PROJECT_DIR, directory: process.env.DIST_DIR }),
)
console.log(`[start] wrote ${file}`)
'

echo "[start] serving $DIST_DIR in the foreground on 0.0.0.0:$PORT"
/usr/bin/time -p node node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port "$PORT" --strictPort
