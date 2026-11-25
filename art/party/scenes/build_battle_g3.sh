#!/bin/sh
# Build one battle room of worlds VII-IX (group g3): run its scene script, render far/mid/fore at 2x (Chromium, one at a
# time), make the far layer opaque (SVG backstop + PNG fill, scenes/opaque_far.py), compose the preview at true scale.
# Usage: sh scenes/build_battle_g3.sh <W> <room> <scene.js> <foe[@x],foe[@x],...> [quarter.png]
set -e
W=$1; R=$2; JS=$3; FOES=$4; Q=$5
cd "$(dirname "$0")/.."
OUT=out/scenes/battle/$W
node "$JS" "$OUT"
node scenes/render.js $OUT/${R}_far.svg $OUT/${R}_far.png 2 $OUT/${R}_mid.svg $OUT/${R}_mid.png 2 $OUT/${R}_fore.svg $OUT/${R}_fore.png 2
python3 scenes/opaque_far.py $OUT/${R}_far.svg $OUT/${R}_far.png
python3 scenes/battle_preview_g3.py "$W" "$R" "$OUT" "$FOES" $Q
