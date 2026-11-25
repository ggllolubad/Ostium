# World XV sheets: out/worlds/XV/sheet.png (true relative scale, dark ground, names, Drowned Thrall as reference)
# and out/worlds/XV/sil.png (black silhouettes at game size, a 1.0 human about 190 px). After worlds/sheet_XIII.py.
import os
from PIL import Image, ImageDraw, ImageFont
O = '/home/claude/party/out'
FIGS = [('world_XV_shattered_god', 'The Shattered God (ruler 5, cropped by its frame)'), ('world_XV_thunder_seraph', 'Thunder Seraph (elite 2.4)'),
        ('world_XV_rift_leviathan', 'Rift Leviathan (elite 2.5, partly in frame)'), ('world_XV_skywreck_knight', 'Skywreck Knight (large 1.4)'),
        ('world_XV_rift_hound', 'Rift Hound (large, 1.1 long)'), ('world_XV_fallen_angel', 'Fallen Angel (1.1)'),
        ('world_XV_storm_shade', 'Storm Shade (1.0)'), ('world_XV_choir_of_eyes', 'Choir of Eyes (1.0)'),
        ('../dirAC2_thrall', 'Drowned Thrall (1.0, reference)')]
def load(k):
    p = f'{O}/worlds/{k}.png' if not k.startswith('..') else f'{O}/{k[3:]}.png'
    im = Image.open(p).convert('RGBA'); return im, im.split()[3].getbbox()
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
except Exception: font = ImageFont.load_default()
ims = [(load(k), n) for k, n in FIGS]
GAP, GROUND, LAB = 60, 30, 70
W = sum(max(bb[2] - bb[0], 420) for (im, bb), _ in ims) + GAP * (len(ims) + 1)
Htop = max(im.height - GROUND - bb[1] for (im, bb), _ in ims)
H = Htop + GROUND + LAB + 40
sheet = Image.new('RGBA', (W, H), (26, 24, 26, 255)); d = ImageDraw.Draw(sheet)
gy = 20 + Htop
d.rectangle([0, gy, W, H], fill=(16, 15, 17, 255))
x = GAP
for (im, bb), name in ims:
    crop = im.crop((bb[0], 0, bb[2], im.height))
    sheet.alpha_composite(crop, (x, gy - (im.height - GROUND)))
    d.text((x, gy + 30), name, fill=(206, 200, 190, 255), font=font)
    x += max(bb[2] - bb[0], 420) + GAP
os.makedirs(f'{O}/worlds/XV', exist_ok=True)
sheet.convert('RGB').save(f'{O}/worlds/XV/sheet.png')
k = 190 / 640; row = []
for (im, bb), name in ims:
    blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(im.split()[3])
    blk = blk.crop((bb[0] - 6, 0, bb[2] + 6, im.height - GROUND + 4))
    row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
Hs = max(r.height for r in row) + 30; Ws = sum(r.width for r in row) + 14 * (len(row) + 1)
sil = Image.new('RGBA', (Ws, Hs), (216, 210, 196, 255)); x = 14
for r in row: sil.alpha_composite(r, (x, Hs - 15 - r.height)); x += r.width + 14
sil.convert('RGB').save(f'{O}/worlds/XV/sil.png')
print('sheet', sheet.size, 'sil', sil.size)
