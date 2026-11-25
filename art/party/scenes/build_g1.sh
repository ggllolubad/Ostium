#!/bin/sh
# Build one g1 battle room: scene script -> far/mid/fore at 2x (each layer rendered on its own, retried up to 3 times when
# the shared Chromium times out under load) -> opaque far -> preview (foes as <png>[@x]) -> 0.5x review copy.
# Usage: sh scenes/build_g1.sh <room> <scene.js> <outDir> <foe.png[@x]> ...
set -e
R=$1; JS=$2; OUT=$3; shift 3
cd "$(dirname "$0")/.."
node "$JS" "$OUT"
for L in far mid fore; do
  n=0; until node scenes/render.js "$OUT/${R}_$L.svg" "$OUT/${R}_$L.png" 2 >/dev/null 2>&1; do n=$((n+1)); if [ $n -ge 3 ]; then echo "RENDER FAILED $R $L"; exit 1; fi; echo "retry $R $L"; done
done
python3 scenes/opaque_far.py "$OUT/${R}_far.svg" "$OUT/${R}_far.png"
python3 scenes/comp_g1.py "$OUT" "$R" "$@"
python3 scenes/comp_g1.py half "$OUT/${R}_preview.png"
