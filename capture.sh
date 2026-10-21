#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
: "${CAPTURE_URL:?Set CAPTURE_URL to the page to capture.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to the evidence directory.}"
export CAPTURE_URL CAPTURE_DIR

/usr/bin/time -p bash -n capture.sh
/usr/bin/time -p test -f capture.mjs
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

set +e
/usr/bin/time -p node capture.mjs
status=$?
set -e

if [[ ! -s "$CAPTURE_DIR/final-desktop.png" ]]; then
  echo "Missing final-desktop.png in $CAPTURE_DIR" >&2
  exit 1
fi
if [[ ! -s "$CAPTURE_DIR/final-mobile.png" ]]; then
  echo "Missing final-mobile.png in $CAPTURE_DIR" >&2
  exit 1
fi

if [[ "$status" -ne 0 ]]; then
  exit "$status"
fi

/usr/bin/time -p ls -lh "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
echo "Desktop and mobile captures are ready in $CAPTURE_DIR"
