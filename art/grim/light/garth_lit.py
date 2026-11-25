"""Lit render of the cloister garth with the company in place.

Layers in draw order: bg, back party slots, monument, front party slots, fg (the 'light' layer is painted light and is
not used: the lighting model makes it). Each layer is split into passes, sprites are added as props at their feet
depth, then the whole frame is lit once by lightrender.light_scene.

Usage: python3 grim/light/garth_lit.py out.png [unlit_out.png]
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
import passes, lightrender as LR

ROOT = os.path.join(os.path.dirname(__file__), '..')
HUB = os.path.join(ROOT, 'hub')
TMP = '/tmp/claude-0/lit'
os.makedirs(TMP, exist_ok=True)
HEROES = {0: ('bulwark', False), 1: ('elementalist', True), 2: ('duelist', True), 3: ('oracle', False)}


def layer_passes(name, meta):
    svg = open(os.path.join(HUB, 'garth__%s.svg' % name)).read()
    out = {}
    for mode in ('albedo', 'emissive', 'emask', 'normal', 'depth'):
        t = passes.transform(svg, mode, meta['planes'])
        p = '%s/%s_%s' % (TMP, name, mode)
        open(p + '.svg', 'w').write(t)
        subprocess.run(['rsvg-convert', p + '.svg', '-o', p + '.png'], check=True)
        out[mode] = np.asarray(Image.open(p + '.png').convert('RGBA'), dtype=np.float32) / 255.0
    return out


def over(buf, lay):
    a = lay['albedo'][..., 3:4]
    for k in ('albedo', 'emissive', 'emask'):
        buf[k][..., :3] = lay[k][..., :3] * a + buf[k][..., :3] * (1 - a)
    hard = lay['depth'][..., 3] > 0.5
    for k in ('normal', 'depth'):
        buf[k][hard] = lay[k][hard]
    buf['edge'] |= ndimage.binary_dilation(hard) & ~hard


def sprite(buf, J, slot):
    p = J['party'][slot]
    name, flip = HEROES[slot]
    sc = p['height_px'] / 620.0
    tmp = '%s/hero_%d.png' % (TMP, slot)
    subprocess.run(['rsvg-convert', '-z', str(sc), os.path.join(ROOT, name + '.svg'), '-o', tmp], check=True)
    im = Image.open(tmp).convert('RGBA')
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    bb = im.getchannel('A').getbbox()
    x, y = p['feet']
    ox, oy = int(x - (bb[0] + bb[2]) / 2), int(y - bb[3] + 6)
    H, W = buf['albedo'].shape[:2]
    arr = np.asarray(im, dtype=np.float32) / 255.0
    h, w = arr.shape[:2]
    x0, y0, x1, y1 = max(0, ox), max(0, oy), min(W, ox + w), min(H, oy + h)
    s = arr[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    a = s[..., 3:4]
    reg = (slice(y0, y1), slice(x0, x1))
    buf['albedo'][reg][..., :3] = s[..., :3] * a + buf['albedo'][reg][..., :3] * (1 - a)
    buf['emissive'][reg][..., :3] *= (1 - a)
    buf['emask'][reg][..., :3] *= (1 - a)
    hard = s[..., 3] > 0.5
    zc = int(round(p['z'] * 100)) + 1
    d = buf['depth'][reg]
    d[hard] = [85 / 255.0, (zc // 256) / 255.0, (zc % 256) / 255.0, 1]
    buf['edge'][reg] |= ndimage.binary_dilation(hard, iterations=1) & ~hard


def main(out, unlit_out=None):
    meta = json.load(open(os.path.join(HUB, 'garth.light.json')))
    J = json.load(open(os.path.join(HUB, 'garth_hotspots.json')))
    cache = TMP + '/buf.npz'
    if os.environ.get('REUSE') and os.path.exists(cache):
        z = np.load(cache); return relight(meta, {k: z[k] for k in z.files}, out, unlit_out)
    L = {n: layer_passes(n, meta) for n in ('bg', 'monument', 'fg')}
    buf = {k: v.copy() for k, v in L['bg'].items()}
    buf['edge'] = np.zeros(buf['albedo'].shape[:2], bool)
    mz = J['monument']['z']
    order = sorted(J['party'], key=lambda p: -p['z'])
    for p in order:
        if p['z'] > mz:
            sprite(buf, J, p['slot'])
    over(buf, L['monument'])
    for p in order:
        if p['z'] <= mz:
            sprite(buf, J, p['slot'])
    over(buf, L['fg'])
    np.savez(cache, **buf)
    relight(meta, buf, out, unlit_out)


def relight(meta, buf, out, unlit_out=None):
    albedo, emissive, emask = buf['albedo'][..., :3], buf['emissive'][..., :3], buf['emask'][..., 0]
    if unlit_out:
        Image.fromarray((albedo * 255).astype(np.uint8)).save(unlit_out)
    kind, val = LR.decode_depth(buf['depth'][..., :3])
    n_s = buf['normal'][..., :3] * 2 - 1
    pil = (kind == 1) | (kind == 0)
    pn = LR.pillow_normals(albedo, kind, val, buf['edge'])
    n_s = np.where(pil[..., None], pn, n_s)
    n_s /= np.linalg.norm(n_s, axis=-1, keepdims=True) + 1e-6
    P = LR.world_positions(meta, kind, val, kind.shape)
    lit = LR.light_scene(albedo, emissive, n_s, kind, P, meta, pil, emask)
    Image.fromarray((lit * 255).astype(np.uint8)).save(out)
    np.save(TMP + '/normal_final.npy', n_s.astype(np.float16))
    np.save(TMP + '/zbuf.npy', P[..., 2].astype(np.float32))      # world depth per pixel, for depth-tested overlays
    print('lit', out)


if __name__ == '__main__':
    main(*sys.argv[1:])
