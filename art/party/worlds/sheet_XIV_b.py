# World XIV second batch sheets:
#   out/worlds/XIV_b/sheet.png    the eleven creatures of this batch at true relative scale on a dark ground, names, the
#                                 Drowned Thrall (dirAC2) as the 1.0 human reference (1 px = 1 px of the renders)
#   out/worlds/XIV_b/sheet19.png  all nineteen creatures of the world (the first batch's renders plus this batch) at true
#                                 relative scale, drawn at half size so the sheet stays usable
#   out/worlds/XIV_b/sil.png      black silhouettes of all nineteen at game size (a 1.0 human about 190 px)
import os
from PIL import Image, ImageDraw, ImageFont
O = '/home/claude/party/out'
B = [('world_XIV_b_lady_of_the_bower', 'The Lady of the Bower (ruler 3)'), ('world_XIV_b_green_lion', 'The Green Lion (ruler 4.5)'),
     ('world_XIV_b_ladys_fool', "The Lady's Fool (elite 1.8)"), ('world_XIV_b_truffle_boar', 'The Truffle Boar (elite 1.9 at the shoulder)'),
     ('world_XIV_b_scarecrow', 'Scarecrow (1.1)'), ('world_XIV_b_blight_snails', 'Blight Snails (cluster 0.5)'), ('world_XIV_b_flower_strewer', 'Flower-Strewer (0.6)'),
     ('world_XIV_b_mole_catcher', 'Mole-Catcher (0.95)'), ('world_XIV_b_pond_swan', 'Pond Swan (1.3)'), ('world_XIV_b_orchard_picker', 'Orchard Picker (1.0)'),
     ('world_XIV_b_beekeeper', 'Beekeeper (1.0)')]
A = [('world_XIV_antlered_mother', 'The Antlered Mother (ruler 4)'), ('world_XIV_the_gardener', 'The Gardener (elite 2.0)'), ('world_XIV_blight_dryad', 'Blight Dryad (elite 2.2)'),
     ('world_XIV_root_horror', 'Root Horror (1.6)'), ('world_XIV_thorn_knight', 'Thorn Knight (1.4)'), ('world_XIV_spore_deer', 'Spore Deer (1.3)'),
     ('world_XIV_fungal_husk', 'Fungal Husk (1.0)'), ('world_XIV_moth_witch', 'Moth Witch (1.0)')]
REF = [('../dirAC2_thrall', 'Drowned Thrall (1.0, reference)')]
GROUND = 30
def load(k):
    p = f'{O}/worlds/{k}.png' if not k.startswith('..') else f'{O}/{k[3:]}.png'
    im = Image.open(p).convert('RGBA'); return im, im.split()[3].getbbox()
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
    fontS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
except Exception:
    font = fontS = ImageFont.load_default()

def sheet(items, k, out, fnt):
    ims = [(load(key), name) for key, name in items]
    GAP, LAB, MINW = int(50 * k), int(70 * k) + 20, int(330 * k)
    cols = []
    for (im, bb), name in ims:
        crop = im.crop((bb[0], 0, bb[2], im.height))
        if k != 1: crop = crop.resize((max(1, int(crop.width * k)), max(1, int(crop.height * k))), Image.LANCZOS)
        cols.append((crop, name, int((im.height - GROUND) * k)))
    W = sum(max(c.width, MINW) for c, _, _ in cols) + GAP * (len(cols) + 1)
    Htop = max(g for _, _, g in cols)
    H = Htop + int(GROUND * k) + LAB + 40
    sh = Image.new('RGBA', (W, H), (26, 24, 24, 255)); d = ImageDraw.Draw(sh)
    gy = 20 + Htop
    d.rectangle([0, gy, W, H], fill=(16, 15, 15, 255))
    x = GAP
    for c, name, g in cols:
        sh.alpha_composite(c, (x, gy - g))
        d.text((x, gy + int(30 * k) + 4), name, fill=(206, 200, 190, 255), font=fnt)
        x += max(c.width, MINW) + GAP
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sh.convert('RGB').save(out)
    return sh.size

def sil(items, out):
    k = 190 / 640; row = []
    for key, name in items:
        im, bb = load(key)
        blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(im.split()[3])
        blk = blk.crop((max(0, bb[0] - 6), 0, min(im.width, bb[2] + 6), im.height - GROUND + 4))
        row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
    # two rows so the sheet stays readable
    half = (len(row) + 1) // 2
    rows = [row[:half], row[half:]]
    Ws = max(sum(r.width for r in rr) + 14 * (len(rr) + 1) for rr in rows)
    Hr = [max(r.height for r in rr) + 30 for rr in rows]
    s = Image.new('RGBA', (Ws, sum(Hr)), (216, 210, 196, 255)); y = 0
    for rr, hh in zip(rows, Hr):
        x = 14
        for r in rr: s.alpha_composite(r, (x, y + hh - 15 - r.height)); x += r.width + 14
        y += hh
    s.convert('RGB').save(out)
    return s.size

print('sheet', sheet(B + REF, 1, f'{O}/worlds/XIV_b/sheet.png', font))
print('sheet19', sheet(A + B + REF, 0.5, f'{O}/worlds/XIV_b/sheet19.png', fontS))
print('sil', sil(A + B, f'{O}/worlds/XIV_b/sil.png'))
