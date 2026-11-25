#!/usr/bin/env bash
# Build the cloister garth end to end: ink art -> lit reference -> game maps -> engine render -> parity and review crops.
# Usage: grim/light/build_garth.sh <game_dir> <out_dir>
set -euo pipefail
GAME=${1:-/home/claude/src_code}; OUT=${2:-/home/claude/hub/review3}; GODOT=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
mkdir -p "$OUT"
node grim/garth.js
node grim/garth_states.js
python3 grim/light/garth_lit.py "$OUT/garth_lit.png" "$OUT/garth_unlit.png"
python3 grim/light/hover_outline.py grim/hub/garth_hotspots.json grim/hub/garth.light.json /tmp/claude-0/lit/zbuf.npy grim/hub/states
mkdir -p "$GAME/assets/art/hub/garth/hover" && cp grim/hub/states/*_outline.png "$GAME/assets/art/hub/garth/hover/"
cp grim/light/look.json "$GAME/data/lighting.json"
python3 grim/light/export_godot.py scene grim/hub garth "$GAME/assets/art/hub/garth" bg monument fg
python3 grim/light/export_party.py grim/hub/garth_hotspots.json "$GAME/assets/art/hub/garth"
python3 grim/light/export_godot.py sprites "$GAME"/assets/art/hub/garth/party_?.png
for f in "$GAME"/assets/art/hub/garth/*.png.import; do [ -f "$f" ] && sed -i 's/^compress\/mode=1/compress\/mode=0/; s/^process\/fix_alpha_border=true/process\/fix_alpha_border=false/' "$f"; done
( cd "$GAME" && timeout 300 "$GODOT" --headless --path . --editor --quit >/dev/null 2>&1 || true
  for f in assets/art/hub/garth/*.png.import; do sed -i 's/^compress\/mode=1/compress\/mode=0/; s/^process\/fix_alpha_border=true/process\/fix_alpha_border=false/' "$f"; done
  timeout 300 "$GODOT" --headless --path . --editor --quit >/dev/null 2>&1 || true
  timeout 180 xvfb-run -a -s "-screen 0 1600x1000x24" "$GODOT" --path . --rendering-driver opengl3 --resolution 1600x1000 --script res://tests/lighting_demo.gd -- "$OUT/garth_in_godot.png" 2>&1 | grep saved )
python3 grim/light/review_crops.py grim/hub/garth_hotspots.json "$OUT"
