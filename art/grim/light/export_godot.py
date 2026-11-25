"""Export a scene's lit-ready maps for the game, one set per layer, plus normal maps for sprites.

Per layer: <layer>.png (albedo, RGBA), <layer>_n.png (normal: x right, y up, z toward viewer, 0.5-biased),
<layer>_e.png (emissive), <layer>_d.png (depth: R,G = distance along the view ray in cm as 16 bits, B = 255 on sky).
Sprites: <name>_n.png beside each sprite PNG (pillow normals from alpha and ink); their depth comes from where they stand.

Usage:
  python3 export_godot.py scene <hub_dir> <scene_name> <out_dir> <layer> [<layer> ...]
  python3 export_godot.py sprites <png> [<png> ...]
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
import passes, lightrender as LR


def save(arr, path):
    Image.fromarray(np.clip(arr * 255 + 0.5, 0, 255).astype(np.uint8)).save(path)


def layer_maps(svg_path, meta, out_prefix):
    svg = open(svg_path).read()
    P = {}
    for mode in ('albedo', 'emissive', 'emask', 'normal', 'depth'):
        t = passes.transform(svg, mode, meta['planes'])
        tmp = out_prefix + '__%s.svg' % mode
        open(tmp, 'w').write(t)
        subprocess.run(['rsvg-convert', tmp, '-o', out_prefix + '__%s.png' % mode], check=True)
        os.remove(tmp)
        P[mode] = np.asarray(Image.open(out_prefix + '__%s.png' % mode).convert('RGBA'), dtype=np.float32) / 255.0
        os.remove(out_prefix + '__%s.png' % mode)
    alb, alpha = P['albedo'][..., :3], P['albedo'][..., 3]
    kind, val = LR.decode_depth(P['depth'][..., :3])
    hard = P['depth'][..., 3] > 0.5
    kind[~hard] = 0
    edge = ndimage.binary_dilation(hard) & ~hard
    n_s = P['normal'][..., :3] * 2 - 1
    pil = (kind == 1) | (kind == 0)
    pn = LR.pillow_normals(alb, kind, val, edge)
    n_s = np.where(pil[..., None], pn, n_s)
    n_s /= np.linalg.norm(n_s, axis=-1, keepdims=True) + 1e-6
    W3 = LR.world_positions(meta, np.where(hard, kind, 0).astype(np.int8), val, kind.shape)
    t = np.clip(W3[..., 2], 0, 655.35)                       # d.z == 1, so the ray distance factor is world Z
    cm = np.round(t * 100).astype(np.int32)
    dep = np.zeros(kind.shape + (4,), np.float32)
    dep[..., 0] = (cm // 256) / 255.0
    dep[..., 1] = (cm % 256) / 255.0
    dep[..., 2] = np.where((kind == 3) & hard, 1.0, 0.0)
    dep[..., 3] = alpha
    save(P['albedo'], out_prefix + '.png')
    nm = np.concatenate([n_s * 0.5 + 0.5, alpha[..., None]], -1)
    save(nm, out_prefix + '_n.png')
    save(np.concatenate([P['emissive'][..., :3], alpha[..., None]], -1), out_prefix + '_e.png')
    save(dep, out_prefix + '_d.png')
    # the pillow flag (wrap lighting) rides in the emissive alpha? no: in the normal map's alpha below 1 would break blending,
    # so the game infers it the same way the reference does: depth kind is not stored; props are lit with wrap via a mask.
    # _p: R = rounded (pillow) surface, G = emissive coverage
    em = P['emask'][..., 0]
    save(np.concatenate([pil[..., None].astype(np.float32), em[..., None], np.zeros_like(em)[..., None], alpha[..., None]], -1), out_prefix + '_p.png')


def sprite_normals(png):
    im = np.asarray(Image.open(png).convert('RGBA'), dtype=np.float32) / 255.0
    alb, a = im[..., :3], im[..., 3]
    hard = a > 0.5
    kind = np.where(hard, 1, 0).astype(np.int8)
    edge = ndimage.binary_dilation(~hard) & hard | (ndimage.binary_dilation(hard) & ~hard)
    n = LR.pillow_normals(alb, kind, np.zeros_like(kind, np.int32), edge)
    out = png[:-4] + '_n.png'
    save(np.concatenate([n * 0.5 + 0.5, a[..., None]], -1), out)
    return out


if __name__ == '__main__':
    if sys.argv[1] == 'scene':
        hub, name, out = sys.argv[2:5]
        meta = json.load(open(os.path.join(hub, name + '.light.json')))
        os.makedirs(out, exist_ok=True)
        for layer in sys.argv[5:]:
            layer_maps(os.path.join(hub, '%s__%s.svg' % (name, layer)), meta, os.path.join(out, layer))
        json.dump(meta, open(os.path.join(out, name + '.light.json'), 'w'))
        print('exported', out)
    else:
        for p in sys.argv[2:]:
            print(sprite_normals(p))
