"""Review sheet for the v3 hub rooms: one row per room, unlit preview | game lit check, at half size.
Usage: python3 scenes/rooms_sheet.py <hub_dir> <out.png> room [room ...]"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
hub, out, rooms = sys.argv[1], sys.argv[2], sys.argv[3:]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
TW, TH, G = 800, 500, 16
sheet = Image.new('RGB', (TW * 2 + G, len(rooms) * TH + (len(rooms) - 1) * G), (20, 18, 16)); d = ImageDraw.Draw(sheet)
for i, r in enumerate(rooms):
    y = i * (TH + G)
    for j, n in enumerate(('%s_preview.png', '%s_lit_check.png')):
        im = Image.open(os.path.join(hub, r, n % r)).convert('RGB').resize((TW, TH), Image.LANCZOS)
        sheet.paste(im, (j * (TW + G), y))
    d.text((8, y + 6), '%s  (unlit preview | game lit check)' % r, fill=(230, 222, 205), font=F)
sheet.save(out); print('sheet', sheet.size)
