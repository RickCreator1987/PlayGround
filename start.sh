#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
export PORT
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
BUILD_DIR="$PROJECT_DIR/dist"

/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p bash -n start.sh
/usr/bin/time -p test -f index.html
/usr/bin/time -p test -f styles.css
/usr/bin/time -p test -f js/app.js

if [[ -f package-lock.json ]]; then
  /usr/bin/time -p npm ci --no-audit --no-fund
elif [[ -f package.json ]]; then
  /usr/bin/time -p npm install --no-audit --no-fund
fi

/usr/bin/time -p rm -rf "$BUILD_DIR"
/usr/bin/time -p mkdir -p "$BUILD_DIR/js" "$BUILD_DIR/assets/fonts"
/usr/bin/time -p cp index.html styles.css "$BUILD_DIR/"
/usr/bin/time -p cp js/*.js "$BUILD_DIR/js/"
/usr/bin/time -p cp assets/fonts/*.woff2 "$BUILD_DIR/assets/fonts/"
/usr/bin/time -p test -f "$BUILD_DIR/index.html"

/usr/bin/time -p printf '{"project":"%s","directory":"%s"}\n' "$PROJECT_DIR" "$BUILD_DIR" > "$WEB_DIR/deployment-output.json"
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"

echo "Serving Cashly from $BUILD_DIR on port $PORT"
/usr/bin/time -p node server.mjs "$BUILD_DIR" "$PORT"
