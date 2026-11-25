"""Contact sheet for the Living Ink icons: every icon at full size (128) over a mid-dark card with its id, and the same
icon at 48, 32 and 22 px (downscaled; 22 px is UiStyle.icon_tag, inline in card and tooltip text), plus the 22 px one
blown up 3x with hard pixels so its read can be judged.
Usage: python3 scenes/icons_sheet.py <png_dir> <out.png> [grim_png_dir]"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
grim = sys.argv[3] if len(sys.argv) > 3 else None
try:
    FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
except Exception:
    FONT = ImageFont.load_default()
ids = sorted(f[:-4] for f in os.listdir(src) if f.endswith('.png'))
CW, CH, COLS = 128 + 48 + 32 + 22 + 66 + 40 + (136 if grim else 0), 150, 6
rows = (len(ids) + COLS - 1) // COLS
sheet = Image.new('RGB', (COLS * CW, rows * CH), (34, 31, 28)); d = ImageDraw.Draw(sheet)
for i, k in enumerate(ids):
    x, y = (i % COLS) * CW, (i // COLS) * CH
    d.rectangle([x + 2, y + 2, x + CW - 3, y + CH - 3], fill=(58, 53, 47))
    im = Image.open(os.path.join(src, k + '.png')).convert('RGBA')
    ox = x + 6
    if grim and os.path.exists(os.path.join(grim, k + '.png')):
        g = Image.open(os.path.join(grim, k + '.png')).convert('RGBA'); sheet.paste(g, (ox, y + 6), g); ox += 136
    sheet.paste(im, (ox, y + 6), im)
    xx = ox + 134
    for s in (48, 32, 22):
        t = im.resize((s, s), Image.LANCZOS); sheet.paste(t, (xx, y + 6 + (128 - s)), t); xx += s + 6
    t = im.resize((22, 22), Image.LANCZOS).resize((66, 66), Image.NEAREST); sheet.paste(t, (xx, y + 68), t)
    d.text((x + 6, y + 136), k, fill=(225, 216, 198), font=FONT)
sheet.save(out)
print('sheet', sheet.size, len(ids))
