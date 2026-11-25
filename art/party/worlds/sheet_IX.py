# World IX sheets: out/worlds/IX/sheet.png (true relative scale, dark ground, names) and out/worlds/IX/sil.png
# (black silhouettes at game size, a 1.0 human about 190 px). Every canvas shares one pixel scale (human = 640 px) and
# its ground line sits 30 px above the canvas bottom, so figures are placed bottom-aligned at native size.
import os
from PIL import Image, ImageDraw, ImageFont
O = 'out'
FIGS = [('world_IX_barrow_king', 'The Barrow King (ruler 3.5)'), ('world_IX_barrow_thane', 'Barrow Thane (elite 2.0)'),
        ('world_IX_rot_witch', 'Rot Witch (elite 1.8)'), ('world_IX_barrow_draugr', 'Barrow Draugr (1.05)'),
        ('world_IX_plague_wolf', 'Plague Wolf (large, 1.1 long)'), ('world_IX_frostbitten_leper', 'Frostbitten Leper (0.95)'),
        ('world_IX_mould_wight', 'Mould Wight (1.1)'), ('world_IX_grave_worm', 'Grave Worm (large 1.5)'),
        ('../dirAC2_thrall', 'Drowned Thrall (1.0, reference)')]
def load(k):
    p = f'{O}/worlds/{k}.png' if not k.startswith('..') else f'{O}/{k[3:]}.png'
    im = Image.open(p).convert('RGBA')
    bb = im.split()[3].getbbox()
    return im, bb
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
except Exception:
    font = ImageFont.load_default()
ims = [(load(k), n) for k, n in FIGS]
GAP = 40; GROUND = 30; LAB = 70
W = sum(bb[2] - bb[0] for (im, bb), _ in ims) + GAP * (len(ims) + 1)
Htop = max(im.height - GROUND - bb[1] for (im, bb), _ in ims)
H = Htop + GROUND + LAB + 40
sheet = Image.new('RGBA', (W, H), (24, 22, 20, 255))
d = ImageDraw.Draw(sheet)
gy = 20 + Htop
d.rectangle([0, gy, W, H], fill=(16, 15, 13, 255))
x = GAP
for (im, bb), name in ims:
    crop = im.crop((bb[0], 0, bb[2], im.height))
    sheet.alpha_composite(crop, (x, gy - (im.height - GROUND)))
    d.text((x, gy + 30), name, fill=(200, 196, 184, 255), font=font)
    x += bb[2] - bb[0] + GAP
os.makedirs(f'{O}/worlds/IX', exist_ok=True)
sheet.convert('RGB').save(f'{O}/worlds/IX/sheet.png')
# silhouettes at game size: 640 px human -> 190 px
k = 190 / 640
row = []
for (im, bb), name in ims:
    a = im.split()[3]
    blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(a)
    blk = blk.crop((bb[0] - 6, 0, bb[2] + 6, im.height - GROUND + 4))
    row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
Hs = max(r.height for r in row) + 30
Ws = sum(r.width for r in row) + 14 * (len(row) + 1)
sil = Image.new('RGBA', (Ws, Hs), (216, 210, 196, 255))
x = 14
for r in row:
    sil.alpha_composite(r, (x, Hs - 15 - r.height)); x += r.width + 14
sil.convert('RGB').save(f'{O}/worlds/IX/sil.png')
print('sheet', sheet.size, 'sil', sil.size)
