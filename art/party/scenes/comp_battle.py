"""Battle-room preview: far + mid + contact shadows + 4 heroes and 3-5 foes at true scale + fore, at 2x (2960 x 960).

Figures are the 1x figure renders (canvas w x h, ground line at h - 30, 640 px = 1.75 m human), scaled by 0.594 (the battle
camera's figure scale at 2x: a 1.0 human is 380 px at 2x, feet on y 860). Foe renders already face left.

Usage: python3 scenes/comp_battle.py <dir> <room> <foe1.png> [foe2.png ...]   (heroes fixed; foes placed right to left)
       python3 scenes/comp_battle.py sheet <out.png> <preview1.png> ...       (stack previews into one sheet)
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SC, FEET = 0.594, 860
HEROES = [('out/dirAC2_oracle.png', 300), ('out/dirAC2_alchemist.png', 545), ('out/dirAC_duelist.png', 800), ('out/dirAC_bulwark.png', 1065)]
FOE_X = [1790, 2150, 2510, 1980, 2720]


def fig(path):
    im = Image.open(os.path.join(ROOT, path) if not os.path.isabs(path) else path).convert('RGBA')
    g = im.height - 30
    im = im.resize((round(im.width * SC), round(im.height * SC)), Image.LANCZOS)
    return im, g * SC


def battle(d, room, foes):
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy()
    im.alpha_composite(L['mid'])
    slots = [(p, x) for p, x in HEROES] + [(p, FOE_X[i]) for i, p in enumerate(foes)]
    figs = [(fig(p), x) for p, x in slots]
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for (f, g), x in figs:
        bb = f.getchannel('A').getbbox(); w = (bb[2] - bb[0]) * 0.42
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
        out, ims = sys.argv[2], [Image.open(p).convert('RGB') for p in sys.argv[3:]]
        w = 1480; ims = [i.resize((w, round(i.height * w / i.width)), Image.LANCZOS) for i in ims]
        lab = 34; sheet = Image.new('RGB', (w, sum(i.height + lab for i in ims)), (14, 12, 10)); y = 0; dr = ImageDraw.Draw(sheet)
        try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
        except Exception: font = None
        for p, i in zip(sys.argv[3:], ims):
            dr.text((12, y + 6), os.path.basename(p).replace('_preview.png', ''), fill=(220, 210, 190), font=font); y += lab
            sheet.paste(i, (0, y)); y += i.height
        sheet.save(out); print('sheet', out)
    else:
        d, room, foes = sys.argv[1], sys.argv[2], sys.argv[3:]
        out = os.path.join(d, '%s_preview.png' % room)
        battle(d, room, foes).save(out); print('preview', out)
