"""Crop regions of an image and zoom them (for review). Usage: python3 scenes/crop.py <in.png> <out.png> <zoom> x0,y0,x1,y1 [...]"""
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); z = float(sys.argv[3])
crops = [tuple(int(v) for v in a.split(',')) for a in sys.argv[4:]]
tiles = [im.crop(c).resize((int((c[2] - c[0]) * z), int((c[3] - c[1]) * z)), Image.LANCZOS) for c in crops]
W = sum(t.width for t in tiles) + 8 * (len(tiles) - 1); Hh = max(t.height for t in tiles)
out = Image.new('RGB', (W, Hh), (20, 18, 16)); x = 0
for t in tiles: out.paste(t, (x, 0)); x += t.width + 8
out.save(sys.argv[2])
