#!/bin/sh
# Build one Living Ink interior: run its scene script, render its layers to PNG (Chromium, one at a time), compose the preview.
# Usage: sh scenes/build_room.sh <room> <scene.js> <outDir> <figsDir>
set -e
R=$1; JS=$2; OUT=$3; FIGS=$4
cd "$(dirname "$0")/.."
node "$JS" "$OUT"
ARGS=""
for l in bg mid fg fx; do [ -f "$OUT/${R}__$l.svg" ] && ARGS="$ARGS $OUT/${R}__$l.svg $OUT/${R}__$l.png"; done
node scenes/render.js $ARGS
python3 scenes/comp.py room "$R" "$OUT" "$FIGS"
