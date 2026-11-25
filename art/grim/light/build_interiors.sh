#!/usr/bin/env bash
# Build the abbey interiors end to end: keepers -> ink art -> lit reference -> hover outlines -> game maps -> engine render -> parity.
# Usage: grim/light/build_interiors.sh <game_dir> <out_dir> [room ...]
set -euo pipefail
GAME=${1:-/home/claude/src_code}; OUT=${2:-/home/claude/hub/int_review}; shift 2 || true
ROOMS=${*:-smithy infirmarium almonry cellarium sacristy scriptorium chapter guesthouse}
GODOT=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
mkdir -p "$OUT"
for k in hild wenna fenn godric ide lucan aldric hosteller; do node grim/k_$k.js >/dev/null; done
cp grim/light/look.json "$GAME/data/lighting.json"
for r in $ROOMS; do
  node grim/int_$r.js
  python3 grim/light/interior_lit.py $r "$OUT/${r}_lit.png" "$OUT/${r}_unlit.png"
  python3 grim/light/hover_outline.py grim/hub/int/${r}_hotspots.json grim/hub/int/$r.light.json /tmp/claude-0/lit_int/${r}_zbuf.npy grim/hub/int/states
  python3 grim/light/export_interior.py $r "$GAME"
done
fix() { for f in "$GAME"/assets/art/hub/int/*/*.png.import "$GAME"/assets/art/hub/int/*/hover/*.png.import; do [ -f "$f" ] && sed -i 's/^compress\/mode=1/compress\/mode=0/; s/^process\/fix_alpha_border=true/process\/fix_alpha_border=false/' "$f"; done; }
( cd "$GAME" && timeout 300 "$GODOT" --headless --path . --editor --quit >/dev/null 2>&1 || true; fix; timeout 300 "$GODOT" --headless --path . --editor --quit >/dev/null 2>&1 || true
  for r in $ROOMS; do timeout 180 xvfb-run -a -s "-screen 0 1600x1000x24" "$GODOT" --path . --rendering-driver opengl3 --resolution 1600x1000 --script res://tests/interior_demo.gd -- $r "$OUT/${r}_godot.png" 2>&1 | grep saved; done )
for r in $ROOMS; do python3 -c "
import numpy as np; from PIL import Image
a=np.asarray(Image.open('$OUT/${r}_godot.png').convert('RGB'),float); b=np.asarray(Image.open('$OUT/${r}_lit.png').convert('RGB'),float)
print('$r parity: %.2f/255 mean abs diff' % np.abs(a-b).mean())"; done
