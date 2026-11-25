"""Battle-room previews for worlds VIII-XV (Living Ink). Composes far / mid / fighters / fore at 2x with 4 heroes on the
left and 3 foes on the right at true scale on the shared battle camera (feet at y 430 at 1x = 860 at 2x, a 1.0 human
190 px at 1x). Figure PNGs are rendered at 0.594 (2x figure scale); a figure's ground line is its canvas height - 30.
Heroes are the nave preview's (out/scenes/pilot/figs/nave); foes are out/scenes/battle/figs/<W>_<key>.png (drawn facing
right with the foe light, flipped here so they face left with the key light still upper left).

Usage: python3 scenes/battle_preview_b.py <W> <room> <room_dir> <foe1,foe2,foe3>
       python3 scenes/battle_preview_b.py sheet <out.png> <preview1.png> ...
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HEROES = os.path.join(ROOT, 'out/scenes/pilot/figs/nave')
FOES = os.path.join(ROOT, 'out/scenes/battle/figs')
S = 0.594
FEET = 860


def place(im, f, x, flip=False):
    if flip:
        f = f.transpose(Image.FLIP_LEFT_RIGHT)
    canvas_h = round(f.height / S)
    ground = (canvas_h - 30) * S
    bb = f.getchannel('A').getbbox()
    ox, oy = int(x - (bb[0] + bb[2]) / 2), int(FEET - ground)
    im.alpha_composite(f, (max(0, ox), max(0, oy)), (max(0, -ox), max(0, -oy)))


def opaque(path):
    # the wobble filter leaves a few hundred edge pixels part-transparent; fill them from the layer's own blurred colour
    im = Image.open(path).convert('RGBA')
    if im.getchannel('A').getextrema()[0] == 255:
        return
    bg = im.convert('RGB').filter(ImageFilter.GaussianBlur(6)).convert('RGBA')
    bg.alpha_composite(im)
    bg.convert('RGB').save(path)
    print('far made opaque', path)


def preview(W, room, d, foes):
    opaque(os.path.join(d, '%s_far.png' % room))
    L = {n: Image.open(os.path.join(d, '%s_%s.png' % (room, n))).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy()
    im.alpha_composite(L['mid'])
    heroes = [('oracle.png', 250), ('elementalist.png', 520), ('duelist.png', 800), ('bulwark.png', 1090)]
    foel = [(os.path.join(FOES, '%s_%s.png' % (W, k)), x) for k, x in zip(foes, (1900, 2260, 2640))]
    figs = [(Image.open(os.path.join(HEROES, p)).convert('RGBA'), x, False) for p, x in heroes] + [(Image.open(p).convert('RGBA'), x, True) for p, x in foel]
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for f, x, _ in figs:
        bb = f.getchannel('A').getbbox(); w = (bb[2] - bb[0]) * 0.42
        dr.ellipse([x - w, FEET - 9, x + w, FEET + 9], fill=(5, 6, 8, 140))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    for f, x, fl in figs:
        place(im, f, x, fl)
    im.alpha_composite(L['fore'])
    out = os.path.join(d, '%s_preview.png' % room)
    im.convert('RGB').save(out)
    print('preview', out)


def sheet(out, paths):
    ims = [Image.open(p).convert('RGB').resize((1480, 480), Image.LANCZOS) for p in paths]
    pad, lab = 16, 30
    sh = Image.new('RGB', (1480 + 2 * pad, len(ims) * (480 + lab + pad) + pad), (14, 14, 16))
    dr = ImageDraw.Draw(sh)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
    except Exception:
        font = None
    y = pad
    for p, im in zip(paths, ims):
        dr.text((pad, y + 4), os.path.basename(p).replace('_preview.png', ''), fill=(220, 214, 200), font=font)
        sh.paste(im, (pad, y + lab)); y += 480 + lab + pad
    sh.save(out)
    print('sheet', out)


if __name__ == '__main__':
    if sys.argv[1] == 'sheet':
        sheet(sys.argv[2], sys.argv[3:])
    else:
        preview(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(','))
