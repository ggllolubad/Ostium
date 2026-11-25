#!/bin/sh
# Build one Living Ink battle room: run its scene script, render far/mid/fore at 2x (Chromium, one at a time), compose the
# preview with 4 heroes and the given foes at true scale.
# Usage: sh scenes/build_battle.sh <room> <scene.js> <outDir> <foe1.png> [foe2.png ...]
set -e
R=$1; JS=$2; OUT=$3; shift 3
cd "$(dirname "$0")/.."
node "$JS" "$OUT"
node scenes/render.js "$OUT/${R}_far.svg" "$OUT/${R}_far.png" 2 "$OUT/${R}_mid.svg" "$OUT/${R}_mid.png" 2 "$OUT/${R}_fore.svg" "$OUT/${R}_fore.png" 2
python3 scenes/opaque_far.py "$OUT/${R}_far.svg" "$OUT/${R}_far.png"
python3 scenes/comp_battle.py "$OUT" "$R" "$@"
