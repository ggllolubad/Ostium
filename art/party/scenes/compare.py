"""Side-by-side comparisons for the Living Ink scene conversion.
pilot: rows Guesthouse and Nave; columns grim (stand-in render), pilot v1 (cropped from the v1 old_vs_new.png), v2 (fixed).
hub:   rows Sacristy, Scriptorium, Smithy; columns grim (stand-in render), Living Ink (layers, no figures).
Usage: python3 scenes/compare.py pilot <v1_old_vs_new.png> <out.png>
       python3 scenes/compare.py hub <grimref_dir> <out.png>"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.join(os.path.dirname(__file__), '..')
try:
    FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
except Exception:
    FONT = ImageFont.load_default()


def layers(d, room, names):
    im = None
    for n in names:
        p = os.path.join(d, '%s__%s.png' % (room, n)) if room else os.path.join(d, n)
        if not os.path.exists(p):
            continue
        L = Image.open(p).convert('RGBA')
        if im is None: im = L
        else: im.alpha_composite(L)
    return im.convert('RGB')


def grid(rows, colw, heads, out):
    pad, top = 16, 30
    H = top + sum(r[0] + 34 for r in rows)
    W = pad + len(heads) * (colw + pad)
    c = Image.new('RGB', (W, H), (22, 20, 18)); d = ImageDraw.Draw(c)
    for i, h in enumerate(heads):
        d.text((pad + i * (colw + pad), 8), h, fill=(220, 212, 196), font=FONT)
    y = top
    for h, cells, label in rows:
        for i, im in enumerate(cells):
            c.paste(im.resize((colw, h), Image.LANCZOS), (pad + i * (colw + pad), y))
        d.text((pad, y + h + 6), label, fill=(200, 192, 176), font=FONT)
        y += h + 34
    c.save(out)


if __name__ == '__main__':
    kind = sys.argv[1]
    if kind == 'pilot':
        v1 = Image.open(sys.argv[2]).convert('RGB'); out = sys.argv[3]
        P = os.path.join(ROOT, 'out', 'scenes', 'pilot')
        gh = [v1.crop((16, 35, 916, 597)), v1.crop((932, 35, 1832, 597)), layers(P, 'guesthouse', ['bg', 'mid', 'fg', 'fx'])]
        nv = [v1.crop((16, 630, 916, 922)), v1.crop((932, 630, 1832, 922)), layers(P, None, ['nave_far.png', 'nave_mid.png', 'nave_fore.png'])]
        grid([(375, gh, 'Guesthouse interior (1600 x 1000; layers bg, mid, fg, fx; no figures)'), (195, nv, 'Drowned Kingdom battle room: the nave (1480 x 480 at 2x; layers far, mid, fore; no fighters)')], 600,
             ['GRIM (stand-in gr.js render)', 'LIVING INK pilot v1', 'LIVING INK v2 (director\'s critique fixed)'], out)
    else:
        G, out = sys.argv[2], sys.argv[3]
        H = os.path.join(ROOT, 'out', 'scenes', 'hub')
        rows = []
        for r in ('sacristy', 'scriptorium', 'smithy'):
            rows.append((500, [Image.open(os.path.join(G, r + '.png')).convert('RGB'), layers(os.path.join(H, r), r, ['bg', 'mid', 'fg', 'fx'])], r.capitalize() + ' (1600 x 1000; no figures)'))
        grid(rows, 800, ['GRIM (stand-in gr.js render)', 'LIVING INK'], out)
    print('wrote', out)
