#!/bin/sh
# Build one battle room of worlds XIII-XV (round 2, group g5): run its scene script, render far/mid/fore at 2x (Chromium,
# one at a time), flatten the far layer (opaque_far.py), compose the preview (heroes + foes, or companion + @boss).
# Usage: sh scenes/build_battle_g5.sh <W> <room> <scene.js> <foe1,foe2,foe3 | companion,@boss>
set -e
W=$1; R=$2; JS=$3; FOES=$4
cd "$(dirname "$0")/.."
OUT=out/scenes/battle/$W
node "$JS" "$OUT"
node scenes/render.js $OUT/${R}_far.svg $OUT/${R}_far.png 2 $OUT/${R}_mid.svg $OUT/${R}_mid.png 2 $OUT/${R}_fore.svg $OUT/${R}_fore.png 2
python3 scenes/opaque_far.py $OUT/${R}_far.svg $OUT/${R}_far.png
python3 scenes/battle_preview_g5.py "$W" "$R" "$OUT" "$FOES"
python3 -c "
from PIL import Image
im=Image.open('$OUT/${R}_preview.png'); im.resize((1480,480),Image.LANCZOS).save('/tmp/claude-0/-home-claude/b481cb9f-fd90-5adc-8daf-8b9ac366d903/scratchpad/${R}_half.png')
"
