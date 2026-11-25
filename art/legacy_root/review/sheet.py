"""python3 review/sheet.py out.jpg cols cellw cellh key1 key2 ...  (keys -> grim/rig/<key>.png, or paths)"""
import sys
from PIL import Image, ImageDraw
out, cols, cw, ch = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
ks = sys.argv[5:]
rows = (len(ks) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * ch), (196, 186, 166))
d = ImageDraw.Draw(sheet)
for i, k in enumerate(ks):
    p = k if '/' in k else f'grim/rig/{k}.png'
    im = Image.open(p).convert('RGBA'); im.thumbnail((cw, ch - 14))
    bg = Image.new('RGBA', im.size, (196, 186, 166, 255)); bg.alpha_composite(im)
    x, y = (i % cols) * cw, (i // cols) * ch
    sheet.paste(bg.convert('RGB'), (x + (cw - im.width) // 2, y + 14))
    d.text((x + 4, y + 1), k.split('/')[-1], fill=(20, 15, 10))
sheet.save(out, quality=88)
