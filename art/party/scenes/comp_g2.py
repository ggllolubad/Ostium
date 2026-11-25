"""Battle-room preview and world sheets for worlds IV-VI (group g2). Same compositing as comp_battle.py (far + mid + contact
shadows + 4 heroes and foes at true scale + fore, at 2x: figure scale 0.594, feet on y 860), but each foe takes its own
x position (2x px) so a ruler can stand in the boss's stage at the right.

Usage: python3 scenes/comp_g2.py <dir> <room> <foe.png>[@x] ...        (default x: 1790, 2150, 2510)
       python3 scenes/comp_g2.py sheet <out.png> <title> <preview.png> ...   (2 x 2 grid of previews, labelled)
       python3 scenes/comp_g2.py thumbs <out.png> <preview.png> ...          (thumbnail row: the distinctness test)
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SC, FEET = 0.594, 860
HEROES = [('out/dirAC2_oracle.png', 300), ('out/dirAC2_alchemist.png', 545), ('out/dirAC_duelist.png', 800), ('out/dirAC_bulwark.png', 1065)]
FOE_X = [1790, 2150, 2510, 1980, 2720]


def font(sz):
    try: return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', sz)
    except Exception: return None


def fig(path):
    im = Image.open(os.path.join(ROOT, path) if not os.path.isabs(path) else path).convert('RGBA')
    g = im.height - 30
    im = im.resize((round(im.width * SC), round(im.height * SC)), Image.LANCZOS)
    return im, g * SC


def battle(d, room, foes):
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy(); im.alpha_composite(L['mid'])
    slots = list(HEROES)
    for i, f in enumerate(foes):
        p, _, x = f.partition('@'); slots.append((p, int(x) if x else FOE_X[i]))
    figs = [(fig(p), x) for p, x in slots]
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for (f, g), x in figs:
        bb = f.getchannel('A').getbbox(); w = min(260, (bb[2] - bb[0]) * 0.42)
        dr.ellipse([x - w, FEET - 9, x + w, FEET + 9], fill=(5, 6, 8, 150))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    for (f, g), x in figs:
        bb = f.getchannel('A').getbbox()
        ox, oy = int(x - (bb[0] + bb[2]) / 2), int(FEET - g)
        im.alpha_composite(f, (max(0, ox), max(0, oy)), (max(0, -ox), max(0, -oy)))
    im.alpha_composite(L['fore'])
    return im.convert('RGB')


if __name__ == '__main__':
    if sys.argv[1] == 'sheet':
        out, title, ps = sys.argv[2], sys.argv[3], sys.argv[4:]
        w = 1480; ims = [Image.open(p).convert('RGB').resize((w, 480), Image.LANCZOS) for p in ps]
        lab, pad, top = 30, 12, 50; cols = 2; rows = (len(ims) + 1) // 2
        sheet = Image.new('RGB', (cols * w + (cols + 1) * pad, top + rows * (480 + lab + pad)), (14, 12, 10)); dr = ImageDraw.Draw(sheet)
        dr.text((pad, 12), title, fill=(230, 220, 200), font=font(26))
        for i, (p, im) in enumerate(zip(ps, ims)):
            x = pad + (i % 2) * (w + pad); y = top + (i // 2) * (480 + lab + pad)
            dr.text((x, y + 4), os.path.basename(p).replace('_preview.png', ''), fill=(220, 210, 190), font=font(20))
            sheet.paste(im, (x, y + lab))
        sheet.save(out); print('sheet', out)
    elif sys.argv[1] == 'thumbs':
        out, ps = sys.argv[2], sys.argv[3:]
        w = 370; ims = [Image.open(p).convert('RGB').resize((w, 120), Image.LANCZOS) for p in ps]
        sheet = Image.new('RGB', (len(ims) * (w + 6), 120), (14, 12, 10))
        for i, im in enumerate(ims): sheet.paste(im, (i * (w + 6), 0))
        sheet.save(out); print('thumbs', out)
    else:
        d, room, foes = sys.argv[1], sys.argv[2], sys.argv[3:]
        out = os.path.join(d, '%s_preview.png' % room)
        battle(d, room, foes).save(out); print('preview', out)
