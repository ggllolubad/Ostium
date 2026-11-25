#!/bin/sh
# Build one battle room of worlds X-XII (group g4): run its scene script, render far/mid/fore at 2x (Chromium, one at a
# time), flatten the far layer (opaque_far.py) and compose the preview (battle_preview_g4.py).
# Usage: sh scenes/build_battle_g4.sh <W> <room> <scene.js> <foe1,foe2,foe3> [boss=<figkey>[@x]]
set -e
W=$1; R=$2; JS=$3; FOES=$4; BOSS=$5
cd "$(dirname "$0")/.."
OUT=out/scenes/battle/$W
node "$JS" "$OUT"
node scenes/render.js $OUT/${R}_far.svg $OUT/${R}_far.png 2 $OUT/${R}_mid.svg $OUT/${R}_mid.png 2 $OUT/${R}_fore.svg $OUT/${R}_fore.png 2
python3 scenes/opaque_far.py $OUT/${R}_far.svg $OUT/${R}_far.png
python3 scenes/battle_preview_g4.py "$W" "$R" "$OUT" "$FOES" $BOSS
