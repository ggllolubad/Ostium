# Kept with the batch: run `python3 worlds/sheet_IX_b.py` from the repo root.
# World IX_b sheets: sheet.png (the 11 at true relative scale with the Drowned Thrall), sheet19.png (all 19 of World IX),
# sil.png (all 19 as black silhouettes at game size, a 1.0 human about 190 px). Every canvas shares one pixel scale and
# its ground line sits 30 px above the canvas bottom, so figures are placed bottom-aligned at native size.
import os
from PIL import Image, ImageDraw, ImageFont
O = '/home/claude/party/out'
B = [('world_IX_b_rat_king', 'The Rat King (ruler 3)'), ('world_IX_b_dead_cart', 'The Dead-Cart (ruler 3.5)'),
     ('world_IX_b_barrow_chaplain', 'Barrow Chaplain (elite 1.9)'), ('world_IX_b_pest_house_watchman', 'Pest-House Watchman (elite 2.1)'),
     ('world_IX_b_gravedigger', 'Gravedigger (1.0)'), ('world_IX_b_the_swollen', 'The Swollen (0.95)'),
     ('world_IX_b_court_fool', 'Court Fool (0.55 seated)'), ('world_IX_b_kings_hawk', "The King's Hawk (0.5)"),
     ('world_IX_b_sexton_beetles', 'Sexton Beetles (0.5 heap)'), ('world_IX_b_barrow_mason', 'Barrow Mason (large 1.4)'),
     ('world_IX_b_rat_catcher', 'Rat-Catcher (1.0)')]
A = [('world_IX_barrow_king', 'The Barrow King (ruler 3.5)'), ('world_IX_barrow_thane', 'Barrow Thane (elite 2.0)'),
     ('world_IX_rot_witch', 'Rot Witch (elite 1.8)'), ('world_IX_barrow_draugr', 'Barrow Draugr (1.05)'),
     ('world_IX_plague_wolf', 'Plague Wolf (large)'), ('world_IX_frostbitten_leper', 'Frostbitten Leper (0.95)'),
     ('world_IX_mould_wight', 'Mould Wight (1.1)'), ('world_IX_grave_worm', 'Grave Worm (large 1.5)')]
REF = ('../dirAC2_thrall', 'Drowned Thrall (1.0, reference)')
def load(k):
    p = f'{O}/worlds/{k}.png' if not k.startswith('..') else f'{O}/{k[3:]}.png'
    im = Image.open(p).convert('RGBA'); return im, im.split()[3].getbbox()
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
except Exception: font = ImageFont.load_default()
def sheet(figs, out, rows=1):
    ims = [(load(k), n) for k, n in figs]
    tw = lambda n: int(ImageDraw.Draw(Image.new('RGB', (1, 1))).textlength(n, font=font)) + 10
    cw = lambda e: max(e[0][1][2] - e[0][1][0], tw(e[1]))
    GAP, GROUND, LAB = 40, 30, 70
    per = (len(ims) + rows - 1) // rows
    rowsL = [ims[i * per:(i + 1) * per] for i in range(rows)]
    def rowdims(r):
        w = sum(cw(e) for e in r) + GAP * (len(r) + 1)
        top = max(im.height - GROUND - bb[1] for (im, bb), _ in r)
        return w, top
    dims = [rowdims(r) for r in rowsL]
    W = max(d[0] for d in dims); H = sum(d[1] + GROUND + LAB + 40 for d in dims)
    sh = Image.new('RGBA', (W, H), (24, 22, 20, 255)); d = ImageDraw.Draw(sh); y0 = 0
    for r, (w, top) in zip(rowsL, dims):
        gy = y0 + 20 + top; d.rectangle([0, gy, W, gy + GROUND + LAB], fill=(16, 15, 13, 255)); x = GAP
        for e in r:
            (im, bb), name = e
            sh.alpha_composite(im.crop((bb[0], 0, bb[2], im.height)), (x, gy - (im.height - GROUND)))
            d.text((x, gy + 30), name, fill=(200, 196, 184, 255), font=font); x += cw(e) + GAP
        y0 += top + GROUND + LAB + 40
    sh.convert('RGB').save(out); print(out, sh.size)
os.makedirs(f'{O}/worlds/IX_b', exist_ok=True)
sheet(B + [REF], f'{O}/worlds/IX_b/sheet.png')
sheet(A + B + [REF], f'{O}/worlds/IX_b/sheet19.png', rows=2)
k = 190 / 640; row = []
for kk, _ in A + B + [REF]:
    im, bb = load(kk); a = im.split()[3]
    blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(a)
    blk = blk.crop((max(0, bb[0] - 6), 0, min(im.width, bb[2] + 6), im.height - 30 + 4))
    row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
half = (len(row) + 1) // 2; rows = [row[:half], row[half:]]
Hs = [max(r.height for r in rr) + 30 for rr in rows]; Ws = max(sum(r.width for r in rr) + 14 * (len(rr) + 1) for rr in rows)
sil = Image.new('RGBA', (Ws, sum(Hs)), (216, 210, 196, 255)); y = 0
for rr, h in zip(rows, Hs):
    x = 14
    for r in rr: sil.alpha_composite(r, (x, y + h - 15 - r.height)); x += r.width + 14
    y += h
sil.convert('RGB').save(f'{O}/worlds/IX_b/sil.png'); print('sil', sil.size)
