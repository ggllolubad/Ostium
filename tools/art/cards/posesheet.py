"""Sheets for posesheet.js: python3 posesheet.py <outdir>
Per pose: <calling>_<pose>.png, one row per figure (card | near hand 2x | far hand 2x).
Per calling: grid_<calling>.png (rows = poses, columns = figures). contact.jpg: every calling's grid, stacked."""
import os, sys
from PIL import Image, ImageDraw

out = sys.argv[1]
rows = [l.split('\t') for l in open(os.path.join(out, 'cells', '_rows.txt')).read().splitlines() if l]
CW, CH, HS = 672, 367, 367
by_pose, by_cls = {}, {}
for cls, tag, key, base in rows:
    by_pose.setdefault((cls, tag), []).append((key, base))
    by_cls.setdefault(cls, {}).setdefault(tag, []).append((key, base))

for (cls, tag), figs in by_pose.items():
    S = Image.new('RGB', (CW + 2 * HS + 8, (CH + 18) * len(figs)), (24, 22, 20)); d = ImageDraw.Draw(S)
    for k, (key, base) in enumerate(figs):
        y = k * (CH + 18)
        d.text((4, y + 3), f'{cls} {tag} {key}   [card | near hand 2x | far hand 2x]', fill=(255, 255, 120))
        S.paste(Image.open(base + '_card.png').convert('RGB').resize((CW, CH), Image.LANCZOS), (0, y + 18))
        S.paste(Image.open(base + '_handn.png').convert('RGB').resize((HS, HS)), (CW + 4, y + 18))
        S.paste(Image.open(base + '_handf.png').convert('RGB').resize((HS, HS)), (CW + HS + 8, y + 18))
    S.save(os.path.join(out, f'{cls}_{tag}.png'))

W, H = 400, 219
grids = []
for cls, tags in by_cls.items():
    cols = max(len(v) for v in tags.values())
    G = Image.new('RGB', (W * cols, (H + 16) * len(tags) + 22), (24, 22, 20)); d = ImageDraw.Draw(G)
    d.text((4, 4), cls, fill=(255, 220, 140))
    for i, (tag, figs) in enumerate(tags.items()):
        for j, (key, base) in enumerate(figs):
            x, y = j * W, 22 + i * (H + 16)
            G.paste(Image.open(base + '_card.png').convert('RGB').resize((W, H), Image.LANCZOS), (x, y + 16))
            d.text((x + 3, y + 2), f'{tag} {key}', fill=(255, 255, 120))
    G.save(os.path.join(out, f'grid_{cls}.png')); grids.append(G)
Wc = max(g.width for g in grids)
Cn = Image.new('RGB', (Wc, sum(g.height for g in grids)), (24, 22, 20)); y = 0
for g in grids: Cn.paste(g, (0, y)); y += g.height
Cn.save(os.path.join(out, 'contact.jpg'), quality=88)
print('sheets:', len(by_pose), 'poses,', len(grids), 'grids, contact.jpg', Cn.size)
