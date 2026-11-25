#!/bin/bash
# usage: grim/view.sh name  -> builds grim/name.js, renders grim/name.png (2x) and grim/name_v.png on parchment
n=$1
node grim/$n.js && node render.js grim/$n.svg grim/$n.png --scale 2 >/dev/null && python3 -c "
from PIL import Image
im=Image.open('grim/$n.png'); bg=Image.new('RGBA',im.size,(230,216,184,255)); bg.alpha_composite(im); bg.convert('RGB').save('grim/${n}_v.png')"
