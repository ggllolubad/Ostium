"""Battle-room previews for worlds XIII-XV, round 2 (group g5). Same composition as battle_preview_b.py (far / mid /
fighters / fore at 2x, feet on 860, figure PNGs rendered at 0.594 with scenes/figs.js ... right and flipped here), plus:
  - a boss slot: a foe key written '@key' is the boss, placed at true scale centred at x 2330 (the right 45% stage);
    with a boss, the other foe (the companion) stands at x 1700
  - a per-world sheet: the rooms in a 2 x 2 grid plus a thumbnail strip (the one-line distinctness test)

Usage: python3 scenes/battle_preview_g5.py <W> <room> <room_dir> <foe1,foe2,foe3 | companion,@boss>
       python3 scenes/battle_preview_g5.py sheet <out.png> <title> <preview1.png> ...
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HEROES = os.path.join(ROOT, 'out/scenes/pilot/figs/nave')
FOES = os.path.join(ROOT, 'out/scenes/battle/figs')
S = 0.594
FEET = 860


def place(im, f, x, flip=True):
    if flip:
        f = f.transpose(Image.FLIP_LEFT_RIGHT)
    canvas_h = round(f.height / S)
    ground = (canvas_h - 30) * S
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


def preview(W, room, d, foes):
    opaque(os.path.join(d, '%s_far.png' % room))
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy()
    im.alpha_composite(L['mid'])
    heroes = [('oracle.png', 250), ('elementalist.png', 520), ('duelist.png', 800), ('bulwark.png', 1090)]
    boss = [k[1:] for k in foes if k.startswith('@')]
    rest = [k for k in foes if not k.startswith('@')]
    xs = (1700,) if boss else (1900, 2260, 2640)
    foel = [(os.path.join(FOES, '%s_%s.png' % (W, k)), x) for k, x in zip(rest, xs)]
    if boss:
        foel.append((os.path.join(FOES, '%s_%s.png' % (W, boss[0])), 2330))
    figs = [(Image.open(os.path.join(HEROES, p)).convert('RGBA'), x, False) for p, x in heroes] + [(Image.open(p).convert('RGBA'), x, True) for p, x in foel]
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for f, x, _ in figs:
        bb = f.getchannel('A').getbbox(); w = min(300, (bb[2] - bb[0]) * 0.42)
        dr.ellipse([x - w, FEET - 9, x + w, FEET + 9], fill=(5, 6, 8, 140))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    for f, x, fl in figs:
        place(im, f, x, fl)
    im.alpha_composite(L['fore'])
    out = os.path.join(d, '%s_preview.png' % room)
    im.convert('RGB').save(out)
    print('preview', out)


def sheet(out, title, paths):
    font = None
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
    except Exception:
        pass
    cw, ch, pad, lab = 1110, 360, 18, 30
    ims = [Image.open(p).convert('RGB') for p in paths]
    rows = (len(ims) + 1) // 2
    tw, th = 360, 117
    H = 50 + rows * (ch + lab + pad) + th + lab + pad * 2
    sh = Image.new('RGB', (2 * cw + 3 * pad, H), (14, 14, 16))
    dr = ImageDraw.Draw(sh)
    dr.text((pad, 14), title, fill=(230, 224, 210), font=font)
    for i, (p, im) in enumerate(zip(paths, ims)):
        x = pad + (i % 2) * (cw + pad); y = 50 + (i // 2) * (ch + lab + pad)
        dr.text((x, y + 4), os.path.basename(p).replace('_preview.png', ''), fill=(220, 214, 200), font=font)
        sh.paste(im.resize((cw, ch), Image.LANCZOS), (x, y + lab))
    y = 50 + rows * (ch + lab + pad)
    dr.text((pad, y + 4), 'thumbnails (the one-line test)', fill=(220, 214, 200), font=font)
    for i, im in enumerate(ims):
        sh.paste(im.resize((tw, th), Image.LANCZOS), (pad + i * (tw + 12), y + lab))
    sh.save(out)
    print('sheet', out)


if __name__ == '__main__':
    if sys.argv[1] == 'sheet':
        sheet(sys.argv[2], sys.argv[3], sys.argv[4:])
    else:
        preview(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(','))
