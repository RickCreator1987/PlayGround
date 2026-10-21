#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

: "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to an output directory outside the source tree}"
export CAPTURE_URL CAPTURE_DIR
export CAPTURE_AUTO_START="${CAPTURE_AUTO_START:-false}"
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-[data-app-ready=\"true\"]}"

echo "[capture] url=$CAPTURE_URL dir=$CAPTURE_DIR"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
echo '[capture] wrote final-desktop.png and final-mobile.png'
