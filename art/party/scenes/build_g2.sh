#!/bin/sh
# Build one battle room of worlds IV-VI (group g2): run its scene script, render far/mid/fore at 2x (Chromium, one at a
# time), make the far layer opaque, compose the preview with 4 heroes and the given foes (foe.png[@x2]) at true scale.
# Usage: sh scenes/build_g2.sh <roman> <room> <scene.js> <foe1.png[@x]> [...]
set -e
WD=$1; R=$2; JS=$3; shift 3
cd "$(dirname "$0")/.."
OUT=out/scenes/battle/$WD
node "$JS" "$OUT"
python3 scenes/trim_defs_g2.py "$OUT/${R}_far.svg" "$OUT/${R}_mid.svg" "$OUT/${R}_fore.svg"
node scenes/render.js "$OUT/${R}_far.svg" "$OUT/${R}_far.png" 2 "$OUT/${R}_mid.svg" "$OUT/${R}_mid.png" 2 "$OUT/${R}_fore.svg" "$OUT/${R}_fore.png" 2
python3 scenes/opaque_far.py "$OUT/${R}_far.svg" "$OUT/${R}_far.png"
python3 scenes/comp_g2.py "$OUT" "$R" "$@"
