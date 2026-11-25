# World XIII second batch sheets (true relative scale on a dark ground, names, the Drowned Thrall as the 1.0 reference):
#   out/worlds/XIII_b/sheet.png    the eleven second-batch creatures
#   out/worlds/XIII_b/sheet19.png  all nineteen creatures of the world (first batch renders out/worlds/world_XIII_<key>.png)
#   out/worlds/XIII_b/sil.png      black silhouettes of all nineteen at game size (a 1.0 human about 190 px)
# Every canvas has its ground line at h - 30, so figures stand on one line at one pixel scale.
import os
from PIL import Image, ImageDraw, ImageFont
O = '/home/claude/party/out'
B2 = [('world_XIII_b_iron_bull', 'The Iron Bull (ruler 3.5 at the shoulder, frame-cropped)'), ('world_XIII_b_confessor', 'The Confessor (ruler 4, frame-cropped)'),
      ('world_XIII_b_questioner', 'The Questioner (elite 2.0)'), ('world_XIII_b_bellows_sister', 'The Bellows Sister (elite 1.9)'),
      ('world_XIII_b_charred_destrier', 'Charred Destrier (large 1.7 at the head)'), ('world_XIII_b_faggot_bearer', 'Faggot-Bearer (large 1.5)'),
      ('world_XIII_b_recanter', 'Recanter (1.0; 1.3 to the hat)'), ('world_XIII_b_scold', 'The Scold (1.0)'), ('world_XIII_b_ash_pardoner', 'Ash Pardoner (0.95)'),
      ('world_XIII_b_familiar', 'The Familiar (small 0.6 reared)'), ('world_XIII_b_belfry_bats', 'Belfry Bats (small, 0.6 swirl)')]
B1 = [('world_XIII_saint_unending', 'The Saint Unending (ruler 3.5)'), ('world_XIII_unburnt_inquisitor', 'The Unburnt Inquisitor (elite 2.0)'),
      ('world_XIII_pyre_seraph', 'Pyre Seraph (elite 2.4)'), ('world_XIII_pyre_knight', 'Pyre Knight (large 1.4)'),
      ('world_XIII_cinder_hound', 'Cinder Hound (large, 1.1 long)'), ('world_XIII_ash_penitent', 'Ash Penitent (1.0)'),
      ('world_XIII_censer_deacon', 'Censer Deacon (1.0)'), ('world_XIII_candle_wraith', 'Candle Wraith (small 0.6)')]
REF = [('../dirAC2_thrall', 'Drowned Thrall (1.0, reference)')]
GROUND = 30
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
except Exception: font = ImageFont.load_default()

def load(k):
    p = f'{O}/worlds/{k}.png' if not k.startswith('..') else f'{O}/{k[3:]}.png'
    im = Image.open(p).convert('RGBA'); return im, im.split()[3].getbbox()

def sheet(figs, out):
    ims = [(load(k), n) for k, n in figs]
    GAP, LAB = 60, 80
    W = sum(max(bb[2] - bb[0], 360) for (im, bb), _ in ims) + GAP * (len(ims) + 1)
    Htop = max(im.height - GROUND - bb[1] for (im, bb), _ in ims)
    H = Htop + GROUND + LAB + 40
    sh = Image.new('RGBA', (W, H), (26, 24, 24, 255)); d = ImageDraw.Draw(sh)
    gy = 20 + Htop
    d.rectangle([0, gy, W, H], fill=(16, 15, 15, 255))
    x = GAP
    for (im, bb), name in ims:
        crop = im.crop((bb[0], 0, bb[2], im.height))
        sh.alpha_composite(crop, (x, gy - (im.height - GROUND)))
        d.text((x, gy + 34), name, fill=(206, 200, 190, 255), font=font)
        x += max(bb[2] - bb[0], 360) + GAP
    sh.convert('RGB').save(out); print(out, sh.size)

def sil(figs, out):
    k = 190 / 640; row = []
    for kk, n in figs:
        im, bb = load(kk)
        blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(im.split()[3])
        blk = blk.crop((max(0, bb[0] - 6), 0, min(im.width, bb[2] + 6), im.height - GROUND + 4))
        row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
    Hs = max(r.height for r in row) + 30; Ws = sum(r.width for r in row) + 14 * (len(row) + 1)
    s = Image.new('RGBA', (Ws, Hs), (216, 210, 196, 255)); x = 14
    for r in row: s.alpha_composite(r, (x, Hs - 15 - r.height)); x += r.width + 14
    s.convert('RGB').save(out); print(out, s.size)

os.makedirs(f'{O}/worlds/XIII_b', exist_ok=True)
sheet(B2 + REF, f'{O}/worlds/XIII_b/sheet.png')
sheet(B1[:1] + B2[:2] + B1[1:3] + B2[2:4] + B1[3:5] + B2[4:6] + B1[5:7] + B2[6:9] + B1[7:] + B2[9:] + REF, f'{O}/worlds/XIII_b/sheet19.png')
sil(B1 + B2, f'{O}/worlds/XIII_b/sil.png')
