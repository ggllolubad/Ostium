#!/bin/bash
# usage: ./view.sh name [bg r,g,b]
n=$1; bg=${2:-236,223,194}
node $n.js src/$n.svg && node render.js src/$n.svg out/$n.png --scale 2 >/dev/null && python3 -c "
from PIL import Image
im=Image.open('out/$n.png'); bg=Image.new('RGBA',im.size,tuple(map(int,'$bg'.split(',')))+(255,)); bg.alpha_composite(im); bg.save('out/${n}_v.png')"
