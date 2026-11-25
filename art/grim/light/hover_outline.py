"""Hover state for doors: a thin white outline of the doorway and the building around it, depth-tested so anything
standing in front (people, props, heroes) cuts the line. Writes one transparent overlay PNG per target.

Usage: python3 hover_outline.py <hotspots.json> <light.json> <zbuf.npy> <out_dir> [preview_bg.png]
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = 4            # supersampling for clean thin lines
WIDTH = 1.6       # px at 1600x1000
GLOW = 0.35       # soft halo under the line


def project(cam, p):
    E, FL, HZ, CX = cam['eye_m'], cam['focal_px'], cam['horizon'], cam['cx']
    return CX + FL * p[0] / p[2], HZ + FL * (E - p[1]) / p[2]


def runs(cam, zbuf, pts, closed):
    """Visible screen-space runs of a 3D polyline after the depth test."""
    H, W = zbuf.shape
    seq = list(pts) + ([pts[0]] if closed else [])
    out, cur = [], []
    for a, b in zip(seq[:-1], seq[1:]):
        a, b = np.array(a, float), np.array(b, float)
        sa, sb = project(cam, a), project(cam, b)
        n = max(2, int(np.hypot(sb[0] - sa[0], sb[1] - sa[1]) * 1.5))
        for t in np.linspace(0, 1, n, endpoint=False):
            p = a + (b - a) * t
            x, y = project(cam, p)
            xi, yi = int(round(x)), int(round(y))
            vis = 0 <= xi < W and 0 <= yi < H and zbuf[yi, xi] >= p[2] - 0.3
            if vis:
                cur.append((x, y))
            elif cur:
                out.append(cur); cur = []
    if cur:
        out.append(cur)
    return [r for r in out if len(r) > 1]


def overlay(cam, zbuf, outline):
    H, W = zbuf.shape
    img = Image.new('L', (W * SS, H * SS), 0)
    d = ImageDraw.Draw(img)
    for poly in outline:
        for r in runs(cam, zbuf, poly['pts'], poly['closed']):
            d.line([(x * SS, y * SS) for x, y in r], fill=255, width=int(WIDTH * SS), joint='curve')
    line = img.resize((W, H), Image.LANCZOS)
    halo = line.filter(ImageFilter.GaussianBlur(3)).point(lambda v: int(v * GLOW))
    a = np.maximum(np.asarray(line, np.float32), np.asarray(halo, np.float32) * 1.6).clip(0, 255).astype(np.uint8)
    rgba = np.zeros((H, W, 4), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = a
    return Image.fromarray(rgba)


if __name__ == '__main__':
    hot, lj, zb, out = sys.argv[1:5]
    J, cam = json.load(open(hot)), json.load(open(lj))['camera']
    zbuf = np.load(zb)
    os.makedirs(out, exist_ok=True)
    for k, h in J['hotspots'].items():
        if h.get('outline'):
            overlay(cam, zbuf, h['outline']).save(os.path.join(out, '%s%s_outline.png' % ((J['room'] + '_') if J.get('room') else '', k)))
    print('outlines', out)
