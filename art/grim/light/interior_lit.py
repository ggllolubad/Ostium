"""Lit render of an abbey interior with its keeper in place.

Layers: bg, the keeper sprite (at its feet depth, so the room's lights fall on it), fg. Also writes the keeper's hover
outline (the sprite's visible silhouette edge, so whatever stands in front cuts it) and its click polygon back into
the room's hotspots file, and saves the depth buffer for the depth-tested door and prop outlines.

Usage: python3 grim/light/interior_lit.py <room> <out.png> [unlit.png]
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
import lightrender as LR
from garth_lit import over, relight
import passes

ROOT = os.path.join(os.path.dirname(__file__), '..')
INT = os.path.join(ROOT, 'hub', 'int')
TMP = '/tmp/claude-0/lit_int'
os.makedirs(TMP, exist_ok=True)


def layer_passes(room, name, meta):
    svg = open(os.path.join(INT, '%s__%s.svg' % (room, name))).read()
    out = {}
    for mode in ('albedo', 'emissive', 'emask', 'normal', 'depth'):
        t = passes.transform(svg, mode, meta['planes'])
        p = '%s/%s_%s_%s' % (TMP, room, name, mode)
        open(p + '.svg', 'w').write(t)
        subprocess.run(['rsvg-convert', p + '.svg', '-o', p + '.png'], check=True)
        out[mode] = np.asarray(Image.open(p + '.png').convert('RGBA'), dtype=np.float32) / 255.0
    return out


def keeper_sprite(kp, room):
    """Render the keeper SVG so its figure spans height_px, feet on kp['feet']. Returns (rgba array, ox, oy) in frame px."""
    src = os.path.join(ROOT, 'keepers', kp['sprite'] + '.svg')
    fig0, fig1 = kp['figure']
    sc = kp['height_px'] / float(fig1 - fig0)
    tmp = '%s/%s_keeper.png' % (TMP, room)
    subprocess.run(['rsvg-convert', '-z', str(sc), src, '-o', tmp], check=True)
    im = Image.open(tmp).convert('RGBA')
    if kp.get('flip'):
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    arr = np.asarray(im, dtype=np.float32) / 255.0
    bb = im.getchannel('A').getbbox()
    x, y = kp['feet']
    ox, oy = int(round(x - (bb[0] + bb[2]) / 2)), int(round(y - fig1 * sc))
    return arr, ox, oy


def place(buf, arr, ox, oy, z, mask_out, ymax=None):
    H, W = buf['albedo'].shape[:2]
    h, w = arr.shape[:2]
    x0, y0, x1, y1 = max(0, ox), max(0, oy), min(W, ox + w), min(H if ymax is None else min(H, int(ymax)), oy + h)
    if y1 <= y0:
        return
    s = arr[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    a = s[..., 3:4]
    reg = (slice(y0, y1), slice(x0, x1))
    buf['albedo'][reg][..., :3] = s[..., :3] * a + buf['albedo'][reg][..., :3] * (1 - a)
    em = s[..., 3] * 0  # the keeper's own emissive bits come from a separate pass of the sprite (static in Hild's hair)
    buf['emissive'][reg][..., :3] *= (1 - a)
    buf['emask'][reg][..., :3] *= (1 - a)
    hard = s[..., 3] > 0.5
    zc = int(round(z * 100)) + 1
    d = buf['depth'][reg]
    d[hard] = [85 / 255.0, (zc // 256) / 255.0, (zc % 256) / 255.0, 1]
    buf['edge'][reg] |= ndimage.binary_dilation(hard, iterations=1) & ~hard
    mask_out[reg] = np.maximum(mask_out[reg], s[..., 3])


def sprite_emissive(kp, room, ox, oy, shape):
    """The sprite's own emissive elements (class em), rendered alone at the same scale."""
    src = os.path.join(ROOT, 'keepers', kp['sprite'] + '.svg')
    svg = open(src).read()
    t = passes.transform(svg, 'emissive', [])
    p = '%s/%s_keeper_em' % (TMP, room)
    open(p + '.svg', 'w').write(t)
    fig0, fig1 = kp['figure']
    sc = kp['height_px'] / float(fig1 - fig0)
    subprocess.run(['rsvg-convert', '-z', str(sc), p + '.svg', '-o', p + '.png'], check=True)
    im = Image.open(p + '.png').convert('RGBA')
    if kp.get('flip'):
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    arr = np.asarray(im, dtype=np.float32) / 255.0
    out = np.zeros(shape + (3,), np.float32)
    H, W = shape
    h, w = arr.shape[:2]
    x0, y0, x1, y1 = max(0, ox), max(0, oy), min(W, ox + w), min(H, oy + h)
    out[y0:y1, x0:x1] = arr[y0 - oy:y1 - oy, x0 - ox:x1 - ox, :3] * arr[y0 - oy:y1 - oy, x0 - ox:x1 - ox, 3:4]
    return out


def keeper_outline(full, path, occl=None, min_px=60):
    """Hover state for a person: a thin white line round their whole silhouette, hidden where something stands in front.
    Specks smaller than min_px (blood drops, loose sparks) are not part of the outline."""
    m = full > 0.5
    lab, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, sz in enumerate(sizes) if sz >= min_px])
    big = Image.fromarray((m * 255).astype(np.uint8)).resize((m.shape[1] * 4, m.shape[0] * 4), Image.NEAREST).filter(ImageFilter.GaussianBlur(2))
    mm = np.asarray(big) > 127
    ring = ndimage.binary_dilation(mm, iterations=7) & ~ndimage.binary_dilation(mm, iterations=1)
    line = np.asarray(Image.fromarray((ring * 255).astype(np.uint8)).resize((m.shape[1], m.shape[0]), Image.LANCZOS), np.float32)
    if occl is not None:
        line = line * (1 - np.clip(occl, 0, 1))
    line = Image.fromarray(line.astype(np.uint8))
    halo = line.filter(ImageFilter.GaussianBlur(3)).point(lambda v: int(v * 0.35))
    a = np.maximum(np.asarray(line, np.float32), np.asarray(halo, np.float32) * 1.6).clip(0, 255).astype(np.uint8)
    rgba = np.zeros(m.shape + (4,), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = a
    Image.fromarray(rgba).save(path)


def panel_mask(room, layer):
    """Coverage of the panel object alone (everything inside class="panel" in that layer), for its shaped hover outline."""
    svg = open(os.path.join(INT, '%s__%s.svg' % (room, layer))).read()
    if 'class="panel"' not in svg:
        return None
    css = '<style>*{visibility:hidden}.panel,.panel *{visibility:visible}</style>'
    i = svg.index('>', svg.index('<svg')) + 1
    p = '%s/%s_panel' % (TMP, room)
    open(p + '.svg', 'w').write(svg[:i] + css + svg[i:])
    subprocess.run(['rsvg-convert', p + '.svg', '-o', p + '.png'], check=True)
    return np.asarray(Image.open(p + '.png').convert('RGBA'), dtype=np.float32)[..., 3] / 255.0


def hull_poly(vis):
    """A click polygon for the keeper: the convex hull of the visible silhouette, simplified."""
    ys, xs = np.nonzero(vis > 0.5)
    pts = np.stack([xs, ys], 1).astype(float)
    if len(pts) > 4000:
        pts = pts[np.random.default_rng(0).choice(len(pts), 4000, replace=False)]
    from scipy.spatial import ConvexHull
    h = ConvexHull(pts)
    return [[round(float(pts[i][0]), 1), round(float(pts[i][1]), 1)] for i in h.vertices]


def main(room, out, unlit_out=None):
    meta = json.load(open(os.path.join(INT, room + '.light.json')))
    hp = os.path.join(INT, room + '_hotspots.json')
    J = json.load(open(hp))
    names = [n for n in ('bg', 'mid', 'fg') if os.path.exists(os.path.join(INT, '%s__%s.svg' % (room, n)))]
    L = {n: layer_passes(room, n, meta) for n in names}
    buf = {k: v.copy() for k, v in L['bg'].items()}
    buf['edge'] = np.zeros(buf['albedo'].shape[:2], bool)
    roster_masks = []
    for r in sorted(J.get('roster', []), key=lambda r: -r['z']):
        sc = r['height_px'] / 620.0
        tmp = '%s/%s_hero_%d.png' % (TMP, room, r['slot'])
        subprocess.run(['rsvg-convert', '-z', str(sc), os.path.join(ROOT, r['name'] + '.svg'), '-o', tmp], check=True)
        im = Image.open(tmp).convert('RGBA')
        if r.get('flip'):
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        bb = im.getchannel('A').getbbox()
        hx, hy = r['feet']
        hox, hoy = int(hx - (bb[0] + bb[2]) / 2), int(hy - bb[3] + 6)
        m = np.zeros(buf['albedo'].shape[:2], np.float32)
        place(buf, np.asarray(im, dtype=np.float32) / 255.0, hox, hoy, r['z'], m)
        # nearer heroes hide the parts of farther ones they cover
        for _, m0 in roster_masks:
            m0 *= (1 - m)
        roster_masks.append((r['slot'], m))
    kp = J['keeper']
    arr, ox, oy = keeper_sprite(kp, room)
    kmask = np.zeros(buf['albedo'].shape[:2], np.float32)
    place(buf, arr, ox, oy, kp['z'], kmask)
    kem = sprite_emissive(kp, room, ox, oy, kmask.shape)
    buf['emissive'][..., :3] = np.maximum(buf['emissive'][..., :3], kem)
    buf['emask'][..., :3] = np.maximum(buf['emask'][..., :3], (kem.max(-1, keepdims=True) > 0.05).astype(np.float32))
    occl = np.zeros(kmask.shape, np.float32)
    top = np.zeros(kmask.shape, np.float32)
    if 'mid' in L:
        over(buf, L['mid'])
        occl = L['mid']['albedo'][..., 3].copy()
        cut = kp.get('over_cut')
        if cut is not None:
            # hands and arms resting on the mid layer (a table) come back over it above the cut line
            place(buf, arr, ox, oy, kp['z'] - 0.3, top, ymax=cut)
            occl[:int(cut)] *= (1 - top[:int(cut)])
    over(buf, L['fg'])
    occl = 1 - (1 - occl) * (1 - L['fg']['albedo'][..., 3])
    vis = kmask * (1 - occl)
    for slot, m in roster_masks:
        mv = m * (1 - kmask) * (1 - occl)
        keeper_outline(m, os.path.join(INT, 'states', '%s_hero_%d_outline.png' % (room, slot)), 1 - (1 - occl) * (1 - kmask))
        J['hotspots']['hero_%d' % slot] = {'label': 'Roster hero', 'poly': hull_poly(mv), 'roster_slot': slot}
    os.makedirs(os.path.join(INT, 'states'), exist_ok=True)
    # the panel: outline its own shape, hidden where the keeper's hands come over it
    pid = J.get('panel')
    for lay in ('bg', 'mid', 'fg'):
        if pid and pid in J['hotspots'] and os.path.exists(os.path.join(INT, '%s__%s.svg' % (room, lay))):
            pm = panel_mask(room, lay)
            if pm is None:
                continue
            po = top if lay == 'mid' else (kmask if lay == 'bg' else np.zeros_like(kmask))
            keeper_outline(pm, os.path.join(INT, 'states', '%s_%s_outline.png' % (room, pid)), po, min_px=200)
            J['hotspots'][pid]['poly'] = hull_poly(pm)
            J['hotspots'][pid].pop('outline', None)
            break
    keeper_outline(kmask, os.path.join(INT, 'states', '%s_keeper_outline.png' % room), occl)
    J['hotspots']['keeper']['poly'] = hull_poly(vis)
    J['keeper']['origin'] = [ox, oy]
    json.dump(J, open(hp, 'w'), indent=1)
    import garth_lit
    garth_lit.TMP = TMP
    relight(meta, buf, out, unlit_out)
    os.replace(TMP + '/zbuf.npy', TMP + '/%s_zbuf.npy' % room)


if __name__ == '__main__':
    main(*sys.argv[1:])
