#!/bin/sh
# Run the game's own lit renderer (grim/light/interior_lit.py, unchanged) on a Living Ink room in a staged copy, then bring
# back the hotspots file it rewrites (keeper and panel click polygons, keeper origin) and its hover outlines (states/).
# Usage: sh scenes/lit_check.sh <room> <roomDir> <keeperSprite> <keeper_mirrorlight.svg> <stageDir>
set -e
R=$1; D=$2; SPR=$3; KSVG=$4; ST=$5
G=/home/claude/ostium-art/grim
mkdir -p "$ST/grim/hub/int/states" "$ST/grim/keepers" "$ST/grim/light"
[ -f "$ST/grim/light/interior_lit.py" ] || cp $G/light/*.py $G/light/look.json "$ST/grim/light/"
for l in bg mid fg fx; do [ -f "$D/${R}__$l.svg" ] && cp "$D/${R}__$l.svg" "$ST/grim/hub/int/"; done
cp "$D/$R.light.json" "$D/${R}_hotspots.json" "$ST/grim/hub/int/"
cp "$KSVG" "$ST/grim/keepers/$SPR.svg"
python3 "$ST/grim/light/interior_lit.py" "$R" "$D/${R}_lit_check.png"
cp "$ST/grim/hub/int/${R}_hotspots.json" "$D/"
mkdir -p "$D/states"; cp "$ST/grim/hub/int/states/${R}_"* "$D/states/"
echo "lit check done: $D/${R}_lit_check.png"
