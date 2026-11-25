"""Battle-room previews for group g1 (worlds I-III, round 2). Like comp_battle.py (same heroes, same scale 0.594 at 2x,
feet on y 860), but each foe can be given an x, and a ruler (1600 canvas, ground at 1570) is placed at true scale on the
boss stage (right 45% of the frame) behind its companion. Also: half-size check image, and the per-world sheet.

Usage: python3 scenes/comp_g1.py <dir> <room> <foe.png>[@x] ...     (x at 2x; defaults 1790, 2150, 2510)
       python3 scenes/comp_g1.py half <preview.png>                  (writes <preview>_half.png at 0.5x for review)
       python3 scenes/comp_g1.py sheet <out.png> <preview1.png> ...  (rooms side by side in a 2-column grid, labelled)
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comp_battle import fig, HEROES, FEET, ROOT
from PIL import Image, ImageDraw, ImageFilter, ImageFont

DEF_X = [1790, 2150, 2510, 1980, 2720]


def battle(d, room, foes):
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy(); im.alpha_composite(L['mid'])
    slots = list(HEROES)
    for i, f in enumerate(foes):
        p, x = (f.split('@') + [None])[:2]
        slots.append((p, int(x) if x else DEF_X[i]))
    # rulers first (behind), then the rest left to right
    figs = [(fig(p), x) for p, x in slots]
    order = sorted(range(len(figs)), key=lambda i: (0 if figs[i][0][0].height > 900 else 1))
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for (f, g), x in figs:
        if f.height > 900: continue
        bb = f.getchannel('A').getbbox(); w = (bb[2] - bb[0]) * 0.42
        dr.ellipse([x - w, FEET - 9, x + w, FEET + 9], fill=(5, 6, 8, 150))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    for i in order:
        (f, g), x = figs[i]
        bb = f.getchannel('A').getbbox() if f.height <= 900 else (0, 0, f.width, f.height)
        ox, oy = int(x - (bb[0] + bb[2]) / 2), int(FEET - g)
        im.alpha_composite(f, (max(0, ox), max(0, oy)), (max(0, -ox), max(0, -oy)))
    im.alpha_composite(L['fore'])
    return im.convert('RGB')


def sheet(out, paths):
    ims = [Image.open(p).convert('RGB').resize((1480, 480), Image.LANCZOS) for p in paths]
    cols = 2 if len(ims) > 3 else 1; rows = (len(ims) + cols - 1) // cols; lab, pad = 30, 14
    sh = Image.new('RGB', (cols * (1480 + pad) + pad, rows * (480 + lab + pad) + pad), (14, 12, 10)); dr = ImageDraw.Draw(sh)
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
    except Exception: font = None
    for i, (p, im) in enumerate(zip(paths, ims)):
        c, r = i % cols, i // cols; x, y = pad + c * (1480 + pad), pad + r * (480 + lab + pad)
        dr.text((x + 4, y + 4), os.path.basename(p).replace('_preview.png', ''), fill=(225, 214, 196), font=font)
        sh.paste(im, (x, y + lab))
    sh.save(out); print('sheet', out)


if __name__ == '__main__':
    if sys.argv[1] == 'sheet':
        sheet(sys.argv[2], sys.argv[3:])
    elif sys.argv[1] == 'half':
        im = Image.open(sys.argv[2]); im.resize((im.width // 4, im.height // 4), Image.LANCZOS).save(sys.argv[2].replace('.png', '_q.png'))
    else:
        d, room = sys.argv[1], sys.argv[2]
        out = os.path.join(d, '%s_preview.png' % room)
        battle(d, room, sys.argv[3:]).save(out); print('preview', out)
