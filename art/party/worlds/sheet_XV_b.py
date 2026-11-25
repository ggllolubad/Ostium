# World XV second batch sheets (after worlds/sheet_XV.py):
#   out/worlds/XV_b/sheet.png   the 11 creatures of the batch at true relative scale on a dark ground, names, the Drowned
#                               Thrall (dirAC2) as the 1.0 human reference
#   out/worlds/XV_b/sheet19.png all 19 of the world at true relative scale (two rows, the whole sheet at half size)
#   out/worlds/XV_b/sil.png     black silhouettes of all 19 at game size (a 1.0 human about 190 px)
import os
from PIL import Image, ImageDraw, ImageFont
O = '/home/claude/party/out'
B = [('world_XV_b_wheel_of_thrones', 'The Wheel of Thrones (ruler 4, cropped)'), ('world_XV_b_fourfold_beast', 'The Fourfold Beast (ruler 3.5, cropped)'),
     ('world_XV_b_recording_angel', 'The Recording Angel (elite 2.2)'), ('world_XV_b_weigher_of_souls', 'The Weigher of Souls (elite 2.3)'),
     ('world_XV_b_porter_of_heaven', 'Porter of Heaven (1.15)'), ('world_XV_b_herald_of_heaven', 'Herald of Heaven (1.05)'),
     ('world_XV_b_putto', 'Putto (0.5)'), ('world_XV_b_scorched_doves', 'Scorched Doves (flock 0.6)'),
     ('world_XV_b_throne_lion', 'Throne Lion (large 1.3)'), ('world_XV_b_rift_crawler', 'Rift Crawler (large, 1.6 long)'),
     ('world_XV_b_star_lighter', 'Star-Lighter (1.0)')]
A = [('world_XV_shattered_god', 'The Shattered God (ruler 5)'), ('world_XV_thunder_seraph', 'Thunder Seraph (elite 2.4)'),
     ('world_XV_rift_leviathan', 'Rift Leviathan (elite 2.5)'), ('world_XV_skywreck_knight', 'Skywreck Knight (1.4)'),
     ('world_XV_rift_hound', 'Rift Hound (1.1 long)'), ('world_XV_fallen_angel', 'Fallen Angel (1.1)'),
     ('world_XV_storm_shade', 'Storm Shade (1.0)'), ('world_XV_choir_of_eyes', 'Choir of Eyes (1.0)')]
REF = ('../dirAC2_thrall', 'Drowned Thrall (1.0, reference)')
GROUND = 30
def load(k):
    p = f'{O}/worlds/{k}.png' if not k.startswith('..') else f'{O}/{k[3:]}.png'
    im = Image.open(p).convert('RGBA'); return im, im.split()[3].getbbox()
def font(sz):
    try: return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', sz)
    except Exception: return ImageFont.load_default()
def row_sheet(items, k=1.0, gap=60, lab=70, fsz=28):
    ims = []
    for (im, bb), name in items:
        crop = im.crop((bb[0], 0, bb[2], im.height))
        if k != 1.0: crop = crop.resize((max(1, int(crop.width * k)), max(1, int(crop.height * k))), Image.LANCZOS)
        ims.append((crop, name))
    g = int(GROUND * k); colw = lambda c: max(c.width, int(420 * k))
    W = sum(colw(c) for c, _ in ims) + gap * (len(ims) + 1)
    Htop = max(c.height - g for c, _ in ims)
    H = Htop + g + lab + 40
    sh = Image.new('RGBA', (W, H), (26, 24, 26, 255)); d = ImageDraw.Draw(sh); f = font(fsz)
    gy = 20 + Htop; d.rectangle([0, gy, W, H], fill=(16, 15, 17, 255)); x = gap
    for c, name in ims:
        sh.alpha_composite(c, (x, gy - (c.height - g))); d.text((x, gy + 30 * k + 6), name, fill=(206, 200, 190, 255), font=f); x += colw(c) + gap
    return sh
os.makedirs(f'{O}/worlds/XV_b', exist_ok=True)
bitems = [(load(k), n) for k, n in B + [REF]]
row_sheet(bitems).convert('RGB').save(f'{O}/worlds/XV_b/sheet.png')
aitems = [(load(k), n) for k, n in A]
r1 = row_sheet(bitems[:4] + aitems[:3], 0.5, 40, 50, 22)
r2 = row_sheet(aitems[3:] + bitems[4:], 0.5, 40, 50, 22)
W = max(r1.width, r2.width); s19 = Image.new('RGBA', (W, r1.height + r2.height), (16, 15, 17, 255)); s19.alpha_composite(r1, (0, 0)); s19.alpha_composite(r2, (0, r1.height))
s19.convert('RGB').save(f'{O}/worlds/XV_b/sheet19.png')
k = 190 / 640; row = []
for (im, bb), name in aitems + bitems[:-1]:
    blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(im.split()[3])
    blk = blk.crop((bb[0] - 6, 0, bb[2] + 6, im.height - GROUND + 4))
    row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
Hs = max(r.height for r in row) + 30; Ws = sum(r.width for r in row) + 14 * (len(row) + 1)
sil = Image.new('RGBA', (Ws, Hs), (216, 210, 196, 255)); x = 14
for r in row: sil.alpha_composite(r, (x, Hs - 15 - r.height)); x += r.width + 14
sil.convert('RGB').save(f'{O}/worlds/XV_b/sil.png')
print('sheet', 'sheet19', s19.size, 'sil', sil.size)
