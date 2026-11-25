#!/bin/sh
# Build one battle room of worlds VIII-XV: run its scene script, render far/mid/fore at 2x (Chromium, one at a time),
# compose the preview with 4 heroes and 3 foes at true scale.
# Usage: sh scenes/build_battle_b.sh <W> <room> <scene.js> <foe1,foe2,foe3>
set -e
W=$1; R=$2; JS=$3; FOES=$4
cd "$(dirname "$0")/.."
OUT=out/scenes/battle/$W
node "$JS" "$OUT"
node scenes/render.js $OUT/${R}_far.svg $OUT/${R}_far.png 2 $OUT/${R}_mid.svg $OUT/${R}_mid.png 2 $OUT/${R}_fore.svg $OUT/${R}_fore.png 2
python3 scenes/battle_preview_b.py "$W" "$R" "$OUT" "$FOES"
