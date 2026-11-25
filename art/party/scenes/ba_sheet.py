"""Before/after review sheet: each row is a label and a list of (before, after) image pairs, laid side by side at a common
width. Usage: python3 scenes/ba_sheet.py <out.png> <width> "label|before.png|after.png" [...]"""
import sys
from PIL import Image, ImageDraw, ImageFont
out, TW, rows = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
tiles = []
for r in rows:
    lab, b, a = r.split('|')
    ib, ia = Image.open(b).convert('RGB'), Image.open(a).convert('RGB')
    th = int(TW * ib.height / ib.width)
    tiles.append((lab, ib.resize((TW, th), Image.LANCZOS), ia.resize((TW, int(TW * ia.height / ia.width)), Image.LANCZOS)))
H = sum(max(t[1].height, t[2].height) + 12 for t in tiles)
s = Image.new('RGB', (TW * 2 + 12, H), (20, 18, 16)); d = ImageDraw.Draw(s); y = 0
for lab, ib, ia in tiles:
    for j, (im, k) in enumerate(((ib, 'before'), (ia, 'after'))):
        s.paste(im, (j * (TW + 12), y)); t = '%s: %s' % (lab, k)
        d.rectangle([j * (TW + 12) + 4, y + 4, j * (TW + 12) + 14 + 8 * len(t), y + 24], fill=(10, 9, 8)); d.text((j * (TW + 12) + 8, y + 6), t, fill=(230, 222, 205), font=F)
    y += max(ib.height, ia.height) + 12
s.save(out); print('sheet', s.size)
