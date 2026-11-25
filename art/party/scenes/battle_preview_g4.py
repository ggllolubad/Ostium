"""Battle-room previews for worlds X, XI, XII (group g4, round 2). Composes far / mid / fighters / fore at 2x on the shared
battle camera (feet at y 430 at 1x = 860 at 2x, a 1.0 human 190 px at 1x). Figure PNGs are rendered at 0.594 (2x figure
scale) from scenes/figs.js '... right' (as drawn, facing right); a figure's ground line is its canvas height - 30.
Heroes: the nave preview's four (out/scenes/pilot/figs/nave). Foes: out/scenes/battle/figs/<W>_<key>.png, flipped unless
listed in NOFLIP (entries with flip: false in the world file).

Regular room:  python3 scenes/battle_preview_g4.py <W> <room> <dir> <foe1,foe2[,foe3]>
Boss room:     python3 scenes/battle_preview_g4.py <W> <room> <dir> <companion> boss=<figkey>[@x]
  the boss canvas (ruler, 1600 x 1600 at 640 px per human) is placed at true scale with its ground line on the fighters'
  feet, centred at x (2x px, default 2330, the middle of the right 45% stage); the companion stands at 1640.
Sheet:         python3 scenes/battle_preview_g4.py sheet <out.png> <title> <preview1.png> ...
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HEROES = os.path.join(ROOT, 'out/scenes/pilot/figs/nave')
FOES = os.path.join(ROOT, 'out/scenes/battle/figs')
S = 0.594
FEET = 860
NOFLIP = {'XI_the_last_hour'}


def opaque(path):
    im = Image.open(path).convert('RGBA')
    if im.getchannel('A').getextrema()[0] == 255:
        return
    bg = im.convert('RGB').filter(ImageFilter.GaussianBlur(6)).convert('RGBA')
    bg.alpha_composite(im)
    bg.convert('RGB').save(path)


def place(im, f, x, flip=False, centre_canvas=False):
    if flip:
        f = f.transpose(Image.FLIP_LEFT_RIGHT)
    canvas_h = round(f.height / S)
    ground = (canvas_h - 30) * S
    if centre_canvas:
        cx = f.width / 2
    else:
        bb = f.getchannel('A').getbbox(); cx = (bb[0] + bb[2]) / 2
    ox, oy = int(x - cx), int(FEET - ground)
    im.alpha_composite(f, (max(0, ox), max(0, oy)), (max(0, -ox), max(0, -oy)))


def shadow(im, f, x):
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    bb = f.getchannel('A').getbbox(); w = min(170, (bb[2] - bb[0]) * 0.42)
    dr.ellipse([x - w, FEET - 9, x + w, FEET + 9], fill=(5, 6, 8, 130))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))


def preview(W, room, d, foes, boss=None, shadows=True):
    opaque(os.path.join(d, '%s_far.png' % room))
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy()
    im.alpha_composite(L['mid'])
    heroes = [('oracle.png', 250), ('elementalist.png', 520), ('duelist.png', 800), ('bulwark.png', 1090)]
    figs = [(Image.open(os.path.join(HEROES, p)).convert('RGBA'), x, False, True) for p, x in heroes]
    xs = (1640,) if boss else ((1900, 2400) if len(foes) == 2 else (1900, 2260, 2640))
    for k, x in zip(foes, xs):
        key = '%s_%s' % (W, k)
        figs.append((Image.open(os.path.join(FOES, key + '.png')).convert('RGBA'), x, key not in NOFLIP, True))
    if boss:
        k, _, bx = boss.partition('@')
        key = '%s_%s' % (W, k)
        bf = Image.open(os.path.join(FOES, key + '.png')).convert('RGBA')
        # the boss stands behind its companion
        place(im, bf, int(bx or 2330), key.split('_noroot')[0].split('_nospire')[0] not in NOFLIP, centre_canvas=True)
    for f, x, _, sh in figs:
        if shadows and sh:
            shadow(im, f, x)
    for f, x, fl, _ in figs:
        place(im, f, x, fl)
    im.alpha_composite(L['fore'])
    out = os.path.join(d, '%s_preview.png' % room)
    im.convert('RGB').save(out)
    im.convert('RGB').resize((1480, 480), Image.LANCZOS).save(os.path.join(d, '%s_preview_1x.png' % room))
    print('preview', out)


def sheet(out, title, paths):
    ims = [Image.open(p).convert('RGB').resize((1480, 480), Image.LANCZOS) for p in paths]
    pad, lab = 16, 30
    sh = Image.new('RGB', (1480 + 2 * pad, 40 + len(ims) * (480 + lab + pad) + pad), (14, 14, 16))
    dr = ImageDraw.Draw(sh)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
        big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    except Exception:
        font = big = None
    dr.text((pad, 10), title, fill=(236, 230, 214), font=big)
    y = 40 + pad
    for p, im in zip(paths, ims):
        dr.text((pad, y + 4), os.path.basename(p).replace('_preview.png', ''), fill=(220, 214, 200), font=font)
        sh.paste(im, (pad, y + lab)); y += 480 + lab + pad
    sh.save(out)
    print('sheet', out)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'sheet':
        sheet(a[1], a[2], a[3:])
    else:
        boss = next((x[5:] for x in a[4:] if x.startswith('boss=')), None)
        preview(a[0], a[1], a[2], [k for k in a[3].split(',') if k], boss)
