"""Battle-room previews for worlds VII, VIII, IX (group g3, round 2). Same composition as battle_preview_b.py (far / mid /
contact shadows / 4 heroes + foes at true scale / fore, at 2x, feet on y 860, figures at 0.594), plus:
  - foes given as key or key@x (x at 2x); the default slots are 1900, 2260, 2640 (3 foes) or 1980, 2520 (2 foes)
  - boss rooms: pass the companion first and the boss second, e.g. VII_frozen_whaler@1800,VII_leviathan_in_the_ice@2440
  - a half-size copy (<room>_preview_half.png, scratch, for the 0.5x look) when HALF is set
  - sheet: one world's rooms side by side for the distinctness check (2 columns), labelled.
Foe PNGs: out/scenes/battle/figs/<W>_<key>.png (drawn facing right with the foe light, flipped here).

Usage: python3 scenes/battle_preview_g3.py <W> <room> <room_dir> <foe[@x],...> [half_out.png]
       python3 scenes/battle_preview_g3.py sheet <out.png> <title> <preview1.png> ...
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HEROES = os.path.join(ROOT, 'out/scenes/pilot/figs/nave')
FOES = os.path.join(ROOT, 'out/scenes/battle/figs')
S, FEET = 0.594, 860


def place(im, f, x, flip=False):
    if flip:
        f = f.transpose(Image.FLIP_LEFT_RIGHT)
    ground = (round(f.height / S) - 30) * S
    bb = f.getchannel('A').getbbox()
    ox, oy = int(x - (bb[0] + bb[2]) / 2), int(FEET - ground)
    im.alpha_composite(f, (max(0, ox), max(0, oy)), (max(0, -ox), max(0, -oy)))


def opaque(path):
    im = Image.open(path).convert('RGBA')
    if im.getchannel('A').getextrema()[0] == 255:
        return
    bg = im.convert('RGB').filter(ImageFilter.GaussianBlur(6)).convert('RGBA')
    bg.alpha_composite(im)
    bg.convert('RGB').save(path)


def preview(W, room, d, foes, half=None):
    opaque(os.path.join(d, '%s_far.png' % room))
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy()
    im.alpha_composite(L['mid'])
    heroes = [('oracle.png', 250), ('elementalist.png', 520), ('duelist.png', 800), ('bulwark.png', 1090)]
    default = {1: [2300], 2: [1980, 2520], 3: [1900, 2260, 2640]}[len(foes)]
    fl = []
    for i, f in enumerate(foes):
        k, x = (f.split('@') + [None])[:2]
        k = W + '_' + k
        fl.append((os.path.join(FOES, k + '.png'), int(x) if x else default[i]))
    figs = [(Image.open(os.path.join(HEROES, p)).convert('RGBA'), x, False) for p, x in heroes] + [(Image.open(p).convert('RGBA'), x, True) for p, x in fl]
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for f, x, _ in figs:
        bb = f.getchannel('A').getbbox(); w = min(260, (bb[2] - bb[0]) * 0.42)
        dr.ellipse([x - w, FEET - 9, x + w, FEET + 9], fill=(5, 6, 8, 140))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    for f, x, fl_ in figs:
        place(im, f, x, fl_)
    im.alpha_composite(L['fore'])
    out = os.path.join(d, '%s_preview.png' % room)
    im.convert('RGB').save(out)
    print('preview', out)
    if half:
        im.convert('RGB').resize((im.width // 4, im.height // 4), Image.LANCZOS).save(half)
        print('quarter', half)


def sheet(out, title, paths):
    w, h = 1480, 480
    ims = [Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS) for p in paths]
    cols = 2; rows = (len(ims) + 1) // 2
    pad, lab, top = 16, 30, 46
    sh = Image.new('RGB', (cols * w + (cols + 1) * pad, top + rows * (h + lab + pad) + pad), (14, 14, 16))
    dr = ImageDraw.Draw(sh)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
        big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    except Exception:
        font = big = None
    dr.text((pad, 10), title, fill=(232, 226, 210), font=big)
    for i, (p, im) in enumerate(zip(paths, ims)):
        c, r = i % cols, i // cols
        x, y = pad + c * (w + pad), top + r * (h + lab + pad)
        dr.text((x, y + 4), os.path.basename(p).replace('_preview.png', ''), fill=(220, 214, 200), font=font)
        sh.paste(im, (x, y + lab))
    sh.save(out)
    print('sheet', out)


if __name__ == '__main__':
    if sys.argv[1] == 'sheet':
        sheet(sys.argv[2], sys.argv[3], sys.argv[4:])
    else:
        preview(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(','), sys.argv[5] if len(sys.argv) > 5 else None)
