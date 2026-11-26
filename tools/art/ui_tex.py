"""ui_tex.py: textured UI pieces in the Living Ink look (no flat fills).

Writes assets/art/ui/tex/*.png:
  btn_parch[_hover|_down|_off].png  parchment buttons, 9-slice (margin 14)
  btn_red[_hover|_down].png         red lacquered buttons for the main actions, 9-slice (margin 16)
  slip_sel.png                      a selected parchment slip with a red ink border, 9-slice (margin 14)
  bar_track.png, bar_red.png, bar_green.png, bar_violet.png, bar_blue.png  bar fills, stretched
Run: python3 tools/art/ui_tex.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'art', 'ui', 'tex')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def noise(w, h, scale, octaves=4):
    """Smooth value noise in 0..1."""
    acc = np.zeros((h, w))
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        s = max(1, int(scale / (2 ** o)))
        g = rng.random((h // s + 2, w // s + 2))
        im = Image.fromarray((g * 255).astype(np.uint8)).resize((w + 2 * s, h + 2 * s), Image.BICUBIC)
        acc += amp * (np.asarray(im)[s:s + h, s:s + w] / 255.0)
        tot += amp
        amp *= 0.5
    return acc / tot


def grain(w, h, amt):
    return (rng.random((h, w)) - 0.5) * amt


def surface(w, h, base, dark, mottle=0.5, scale=40, edge=0.45, grain_amt=0.10):
    """Mottled colour field that darkens toward the edges, with fine grain."""
    n = noise(w, h, scale)
    yy, xx = np.mgrid[0:h, 0:w]
    dx = np.minimum(xx, w - 1 - xx) / (w / 2)
    dy = np.minimum(yy, h - 1 - yy) / (h / 2)
    vig = np.clip(np.minimum(dx * 2.2, dy * 2.2), 0, 1)
    t = np.clip(mottle * n + (1 - vig) * edge + grain(w, h, grain_amt), 0, 1)[..., None]
    base = np.array(base, float)
    dark = np.array(dark, float)
    rgb = base * (1 - t) + dark * t
    return rgb


def ink_border(img, inset, width, col, jitter=1.2, double=False):
    """A hand-drawn rectangle: segments with slight wobble and broken pressure."""
    d = ImageDraw.Draw(img)
    w, h = img.size

    def wob_line(p0, p1, wd):
        n = 48
        # a slow wobble (few control points, smoothly interpolated), not per-point jitter
        ctrl = rng.normal(0, jitter, 6)
        off = np.interp(np.linspace(0, 5, n + 1), np.arange(6), ctrl)
        L = max(1e-6, ((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2) ** 0.5)
        nx, ny = -(p1[1] - p0[1]) / L, (p1[0] - p0[0]) / L
        pts = []
        for i in range(n + 1):
            t = i / n
            pts.append((p0[0] + (p1[0] - p0[0]) * t + nx * off[i], p0[1] + (p1[1] - p0[1]) * t + ny * off[i]))
        for a, b in zip(pts, pts[1:]):
            ww = max(1, int(round(wd * rng.uniform(0.85, 1.1))))
            d.line([a, b], fill=col, width=ww)

    for k, (ins, wd) in enumerate([(inset, width)] + ([(inset + width + 3, max(1, width // 2))] if double else [])):
        x0, y0, x1, y1 = ins, ins, w - 1 - ins, h - 1 - ins
        wob_line((x0, y0), (x1, y0), wd)
        wob_line((x1, y0), (x1, y1), wd)
        wob_line((x1, y1), (x0, y1), wd)
        wob_line((x0, y1), (x0, y0), wd)


def rough_alpha(w, h, r=5):
    """Slightly torn rounded edge so the piece is not a hard rectangle."""
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((1, 1, w - 2, h - 2), r, fill=255)
    a = np.asarray(m).astype(float)
    a *= np.clip(1.0 - (noise(w, h, 6) < 0.18) * (a < 255) * 1.0, 0, 1)
    return Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))


def save_piece(name, rgb, border_col, bw=2, double=False, alpha=True):
    h, w = rgb.shape[:2]
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert('RGBA')
    ink_border(im, 2, bw, border_col, double=double)
    if alpha:
        im.putalpha(rough_alpha(w, h))
    im.save(os.path.join(OUT, name))


PARCH = (243, 232, 207)
PARCH_D = (205, 184, 142)
INK = (43, 29, 18, 255)

# parchment buttons
save_piece('btn_parch.png', surface(240, 72, PARCH, PARCH_D, 0.55, 30, 0.55), INK)
save_piece('btn_parch_hover.png', surface(240, 72, (250, 242, 222), (220, 196, 150), 0.5, 30, 0.45), (120, 40, 26, 255))
save_piece('btn_parch_down.png', surface(240, 72, (226, 210, 174), (180, 156, 112), 0.6, 30, 0.6), INK)
save_piece('btn_parch_off.png', surface(240, 72, (226, 216, 192), (196, 184, 160), 0.4, 30, 0.4, 0.05), (154, 138, 112, 255))
save_piece('slip_sel.png', surface(240, 96, (250, 242, 222), (222, 200, 156), 0.5, 30, 0.45), (156, 61, 43, 255), 3, double=True)

# red lacquered action buttons: deep madder with mottle, darker worn edges and a thin gold inner line
for nm, base, dark in [('btn_red.png', (150, 46, 32), (70, 18, 12)), ('btn_red_hover.png', (178, 60, 40), (90, 26, 16)),
                       ('btn_red_down.png', (120, 36, 24), (56, 14, 9))]:
    rgb = surface(300, 96, base, dark, 0.65, 26, 0.7, 0.14)
    im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert('RGBA')
    ink_border(im, 2, 3, INK)
    ink_border(im, 9, 1, (214, 173, 82, 200), jitter=0.8)
    im.putalpha(rough_alpha(300, 96, 6))
    im.save(os.path.join(OUT, nm))

# bars: horizontal strips that stretch; mottled fills with a lit top edge and a shaded bottom
def bar(name, base, dark, hi):
    w, h = 256, 20
    rgb = surface(w, h, base, dark, 0.55, 14, 0.25, 0.12)
    yy = np.linspace(0, 1, h)[:, None, None]
    rgb = rgb * (1 - 0.35 * yy) + np.array(hi, float) * np.clip(0.35 - yy, 0, 1) * 0.8
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name))

bar('bar_red.png', (186, 62, 44), (96, 24, 16), (240, 150, 120))
bar('bar_green.png', (104, 132, 80), (46, 66, 34), (190, 214, 160))
bar('bar_violet.png', (142, 122, 166), (74, 58, 96), (210, 196, 230))
bar('bar_blue.png', (112, 140, 186), (52, 72, 112), (200, 216, 240))
track = surface(256, 20, (238, 226, 198), (190, 168, 128), 0.5, 14, 0.5, 0.1)
track[:4] *= 0.82  # inset shadow along the top
Image.fromarray(np.clip(track, 0, 255).astype(np.uint8)).save(os.path.join(OUT, 'bar_track.png'))
print('wrote', sorted(os.listdir(OUT)))
