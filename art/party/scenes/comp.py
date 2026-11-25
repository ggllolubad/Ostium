"""Composite previews for the Living Ink scenes.

room: layers bg / roster heroes / keeper / mid / fg / fx, with the figures placed by the same rules as the game's
grim/light/interior_lit.py (hero: scale = height_px / 620, bbox centred on the feet x, bbox bottom 6 px below the feet;
keeper: scale = height_px / (figure[1] - figure[0]), bbox centred on the feet x, figure ground line on the feet y).
Figure PNGs must already be rendered at those scales (scenes/render.js <svg> <png> <scale>): <figs>/keeper.png and
<figs>/roster_<slot>.png. Layers that a room does not have (the smithy has no mid) are skipped.

Usage: python3 scenes/comp.py room <room> <room_dir> <figs_dir> [out.png]
       python3 scenes/comp.py nave <pilot_dir> <figs_dir>
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFilter


def over(dst, src, x, y):
    dst.alpha_composite(src, (max(0, x), max(0, y)), (max(0, -x), max(0, -y)))


def room(name, d, figs):
    J = json.load(open(os.path.join(d, '%s_hotspots.json' % name)))
    L = {n: Image.open(os.path.join(d, '%s__%s.png' % (name, n))).convert('RGBA') for n in ('bg', 'mid', 'fg', 'fx') if os.path.exists(os.path.join(d, '%s__%s.png' % (name, n)))}
    im = L['bg'].copy()
    for r in sorted(J.get('roster', []), key=lambda r: -r['z']):
        f = Image.open(os.path.join(figs, 'roster_%d.png' % r['slot'])).convert('RGBA')
        if r.get('flip'):
            f = f.transpose(Image.FLIP_LEFT_RIGHT)
        bb = f.getchannel('A').getbbox()
        over(im, f, int(r['feet'][0] - (bb[0] + bb[2]) / 2), int(r['feet'][1] - bb[3] + 6))
    kp = J['keeper']
    kpath = os.path.join(figs, 'keeper.png')
    if os.path.exists(kpath):
        k = Image.open(kpath).convert('RGBA')
        sc = kp['height_px'] / float(kp['figure'][1] - kp['figure'][0])
        bb = k.getchannel('A').getbbox()
        ox, oy = int(round(kp['feet'][0] - (bb[0] + bb[2]) / 2)), int(round(kp['feet'][1] - kp['figure'][1] * sc))
        over(im, k, ox, oy)
    for n in ('mid', 'fg', 'fx'):
        if n in L:
            im.alpha_composite(L[n])
        if n == 'mid' and os.path.exists(kpath) and kp.get('over_cut') is not None:
            # as interior_lit.py: hands and arms resting on the mid layer come back over it above the cut line
            cut = int(kp['over_cut']) - oy
            if cut > 0:
                top = k.crop((0, 0, k.width, min(k.height, cut)))
                over(im, top, ox, oy)
    return im


def nave(pilot, figs):
    M = json.load(open(os.path.join(figs, 'battle.json')))
    L = {n: Image.open(os.path.join(pilot, 'nave_%s.png' % n)).convert('RGBA') for n in ('far', 'mid', 'fore')}
    im = L['far'].copy()
    im.alpha_composite(L['mid'])
    # contact shadows under the fighters (preview only; the game draws its own)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(sh)
    for s in M['slots']:
        f = Image.open(os.path.join(figs, s['png'])); bb = f.getchannel('A').getbbox(); w = (bb[2] - bb[0]) * 0.42
        dr.ellipse([s['x'] - w, s['feet'] - 9, s['x'] + w, s['feet'] + 9], fill=(5, 8, 10, 150))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    for s in M['slots']:
        f = Image.open(os.path.join(figs, s['png'])).convert('RGBA')
        bb = f.getchannel('A').getbbox()
        over(im, f, int(s['x'] - (bb[0] + bb[2]) / 2), int(s['feet'] - s['ground'] * s['scale']))
    im.alpha_composite(L['fore'])
    return im


if __name__ == '__main__':
    kind = sys.argv[1]
    if kind == 'room':
        name, d, figs = sys.argv[2:5]
        out = sys.argv[5] if len(sys.argv) > 5 else os.path.join(d, '%s_preview.png' % name)
        room(name, d, figs).convert('RGB').save(out)
        print('preview', out)
    elif kind == 'guesthouse':
        pilot, figs = sys.argv[2:4]
        room('guesthouse', pilot, figs).convert('RGB').save(os.path.join(pilot, 'guesthouse_preview.png'))
        print('preview guesthouse')
    else:
        pilot, figs = sys.argv[2:4]
        nave(pilot, figs).convert('RGB').save(os.path.join(pilot, 'drowned_nave_preview.png'))
        print('preview nave')
