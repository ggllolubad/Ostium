"""Ostium lighting model, reference implementation (the Godot shader in the game mirrors this maths).

lit = albedo * (ambient(N) + sum_i light_i(P, N)) + emissive, then exposure and a filmic curve with crushed blacks.

Inputs per scene: the four passes from passes.py plus the scene's .light.json (camera, planes, lights).
Sprites (heroes, foes) are composited into the same buffers before lighting, at their feet depth, with pillow normals,
so every character is lit by the same lights as the room it stands in.

World space: X right, Y up, Z away from the camera; the camera sits at (0, eye, 0) looking down +Z.
"""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage

# ------------------------------------------------------------------ the look: one table of numbers for every scene
LOOK = dict(
    ambient_col=(0.62, 0.66, 0.74),  # the Grey: cold, colourless
    ambient_sky=0.07,                # from above (scaled by N.up)
    ambient_fill=0.035,              # everywhere, so nothing is pure black where the art has detail
    key_dir=(-0.55, 0.62, -0.56),    # design bible: key light from the upper left at 45 degrees, a little toward us
    key_col=(0.70, 0.74, 0.82),
    key_int=0.05,
    exposure=1.7,
    toe=0.012,                       # crush: subtracted before the curve
    emissive_gain=1.0,
    sky_gain=0.22,                   # the Grey sky is dim at dusk
    pillow_radius=7.0,               # px: how far the rounded bevel of a prop reaches in from its ink edge
    pillow_strength=0.85,
    vignette=0.55,                   # post: corners darkened toward black, same on every screen
    bounce=0.075,                    # warm light thrown back off the lit garth, from the viewer's side, onto everything
    bounce_col=(1.0, 0.78, 0.58),
    wrap=0.18,                       # light wraps a little round rounded props (cloth, flesh), never round planes
)
import os as _os
_LOOK_JSON = _os.path.join(_os.path.dirname(__file__), 'look.json')
if _os.path.exists(_LOOK_JSON):
    LOOK.update(json.load(open(_LOOK_JSON)))   # look.json is the single source; the game reads the same file


def srgb_to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


def filmic(x):
    # ACES fitted curve (Narkowicz), then the toe crush
    a, b, c, d, e = 2.51, 0.03, 2.43, 0.59, 0.14
    y = (x * (a * x + b)) / (x * (c * x + d) + e)
    return np.clip(y, 0, 1)


def load(path):
    im = np.asarray(Image.open(path).convert('RGBA'), dtype=np.float32) / 255.0
    return im[..., :3], im[..., 3]


def decode_depth(dep):
    d = np.round(dep * 255).astype(np.int32)
    kind = d[..., 0]
    k = np.zeros(kind.shape, np.int8)                         # 0 untagged, 1 prop, 2 plane, 3 sky
    k[np.abs(kind - 85) < 30] = 1
    k[np.abs(kind - 170) < 30] = 2
    k[kind > 230] = 3
    val = d[..., 1] * 256 + d[..., 2]
    return k, val


def pillow_normals(albedo, kind, zval, alpha_edges=None):
    """Rounded normals for props and sprites: height rises with distance from the nearest ink line or object edge."""
    lum = albedo @ np.array([0.299, 0.587, 0.114], np.float32)
    ink = lum < 0.10
    edge = ink.copy()
    zz = np.where(kind == 1, zval, -1)
    edge[:, 1:] |= zz[:, 1:] != zz[:, :-1]
    edge[1:, :] |= zz[1:, :] != zz[:-1, :]
    if alpha_edges is not None:
        edge |= alpha_edges
    r = LOOK['pillow_radius']
    dist = ndimage.distance_transform_edt(~edge)
    t = np.clip(dist / r, 0, 1)
    h = np.sqrt(1 - (1 - t) ** 2) * r * LOOK['pillow_strength']
    h = ndimage.gaussian_filter(h, 1.0)
    gy, gx = np.gradient(h)
    n = np.stack([-gx, gy, np.ones_like(h)], -1)              # screen: x right, y up, z toward viewer
    return n / np.linalg.norm(n, axis=-1, keepdims=True)


def world_positions(meta, kind, val, shape):
    cam = meta['camera']
    H, W = shape
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    E, FL, HZ, CX = cam['eye_m'], cam['focal_px'], cam['horizon'], cam['cx']
    d = np.stack([(xs - CX) / FL, -(ys - HZ) / FL, np.ones_like(xs)], -1)
    camp = np.array([0, E, 0], np.float32)
    t = np.full((H, W), np.nan, np.float32)
    prop = kind == 1
    t[prop] = val[prop] / 100.0
    planes = meta['planes']
    pl = kind == 2
    for i in np.unique(val[pl]):
        if i >= len(planes):
            continue
        m = pl & (val == i)
        n = np.array(planes[i]['n'], np.float32)
        denom = d[m] @ n
        t[m] = (planes[i]['d'] - camp @ n) / np.where(np.abs(denom) < 1e-4, 1e-4, denom)
    # untagged pixels take the nearest tagged pixel's depth (decorations painted on a wall share its depth)
    bad = ~np.isfinite(t) | (t <= 0)
    bad &= kind != 3
    if bad.any():
        idx = ndimage.distance_transform_edt(bad | (kind == 3), return_distances=False, return_indices=True)
        t = t[idx[0], idx[1]]
    t = np.clip(np.nan_to_num(t, nan=60.0), 0.5, 200)
    return camp + d * t[..., None]


def light_scene(albedo, emissive, normal_s, kind, P, meta, pillow, emask=None):
    """albedo/emissive in sRGB 0..1, normal_s screen-space unit normals, P world positions."""
    alb = srgb_to_lin(albedo)
    emi = srgb_to_lin(emissive)
    N = np.stack([normal_s[..., 0], normal_s[..., 1], -normal_s[..., 2]], -1)   # to world (z away)
    up = np.array([0, 1, 0], np.float32)
    amb = LOOK['ambient_fill'] + LOOK['ambient_sky'] * (0.5 + 0.5 * (N @ up))
    key = np.array(LOOK['key_dir'], np.float32); key /= np.linalg.norm(key)
    acc = np.array(LOOK['ambient_col'], np.float32) * amb[..., None]
    acc += np.array(LOOK['key_col'], np.float32) * (LOOK['key_int'] * np.clip(N @ key, 0, None))[..., None]
    acc += np.array(LOOK['bounce_col'], np.float32) * (LOOK['bounce'] * np.clip(-N[..., 2], 0, None))[..., None]
    wrap = np.where(pillow, LOOK['wrap'], 0.0).astype(np.float32)
    for L in meta['lights']:
        lp = np.array(L['pos'], np.float32)
        v = lp - P
        dd = np.linalg.norm(v, axis=-1) + 1e-4
        rng = L['range']
        win = np.clip(1 - (dd / rng) ** 4, 0, 1) ** 2
        att = L['I'] * win / (1 + (dd / (rng * 0.3)) ** 2)
        ndl = np.clip(((N * v).sum(-1) / dd + wrap) / (1 + wrap), 0, None)
        acc += np.array(L['col'], np.float32) * (att * ndl)[..., None]
    m = 0.0 if emask is None else emask[..., None]
    lit = alb * acc * (1 - m) + emi * LOOK['emissive_gain']        # emissive covers the lit surface by its coverage
    sky = kind == 3
    lit[sky] = srgb_to_lin(albedo[sky]) * LOOK['sky_gain']
    H, W = kind.shape
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xs - W / 2) / (W * 0.62)) ** 2 + ((ys - H * 0.55) / (H * 0.62)) ** 2)
    vig = 1 - LOOK['vignette'] * np.clip((r - 0.55) / 0.6, 0, 1) ** 1.6
    x = np.clip(lit * LOOK['exposure'] * vig[..., None] - LOOK['toe'], 0, None)
    return lin_to_srgb(filmic(x))


def main(prefix, light_json, out):
    meta = json.load(open(light_json))
    albedo, a_alpha = load(prefix + '_albedo.png')
    emissive, _ = load(prefix + '_emissive.png')
    nrm, _ = load(prefix + '_normal.png')
    dep, _ = load(prefix + '_depth.png')
    kind, val = decode_depth(dep)
    n_s = nrm * 2 - 1
    n_s[..., 1] = n_s[..., 1]  # encoded with y up already
    pil = (kind == 1) | (kind == 0)
    pn = pillow_normals(albedo, kind, val)
    n_s = np.where(pil[..., None], pn, n_s)
    n_s /= np.linalg.norm(n_s, axis=-1, keepdims=True) + 1e-6
    P = world_positions(meta, kind, val, kind.shape)
    lit = light_scene(albedo, emissive, n_s, kind, P, meta, pil)
    Image.fromarray((lit * 255).astype(np.uint8)).save(out)
    print('lit', out)


if __name__ == '__main__':
    main(*sys.argv[1:4])
