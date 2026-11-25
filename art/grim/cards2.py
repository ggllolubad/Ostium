"""Card scenes, step 2: composite room backdrop + posed hero rig + foes/ally + effect layer, then grade.
   python3 grim/cards2.py plan      -> grim/cards2/pos.json (where hands, targets and figures sit, per card)
   python3 grim/cards2.py render    -> /home/claude/ostium/assets/art/cards/<id>.jpg
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from multiprocessing import Pool

ART = '/home/claude/ostium-art/grim'
GAME = '/home/claude/ostium'
W, H = 840, 460
OUT_W, OUT_H = 560, 306
S = 0.75  # 1x rig units -> frame pixels
man = json.load(open(f'{ART}/cards2/manifest.json'))
ARMS = {'arm', 'farm', 'near', 'fx'}
POSE_ANGLE = {'swing': -20, 'thrust': -4, 'throw': -50, 'cast': -34}
HAND_LAYER = {'bulwark': 'arm', 'duelist': 'arm', 'elementalist': 'fx', 'alchemist': 'arm', 'oracle': 'arm', 'hexweaver': 'arm'}

_cache = {}


def rig(name):
    if name not in _cache:
        _cache[name] = json.load(open(f'{ART}/rig/{name}.rig.json'))
    return _cache[name]


def layer_img(name, layer, s):
    k = (name, layer, s)
    if k not in _cache:
        im = Image.open(f'{ART}/rig/{name}__{layer}.png').convert('RGBA')
        _cache[k] = im.resize((round(im.width * s / 2), round(im.height * s / 2)), Image.LANCZOS)
    return _cache[k]


def hero_figure(cls, pose, s):
    """Render the hero at scale s (1x units -> px) in its own canvas; returns (image, hand_xy, arm_rot)."""
    r = rig(cls)
    cw, ch = round(r['w'] * s), round(r['h'] * s)
    canvas = Image.new('RGBA', (cw, ch))
    hand = r['anim']['hand']
    hl = HAND_LAYER[cls]
    arm_layer = next((l for l in r['layers'] if l['name'] == ('arm' if hl == 'fx' else hl)), None)
    rot = 0.0
    if pose in POSE_ANGLE and arm_layer:
        px, py = arm_layer['pivot']
        cur = math.degrees(math.atan2(hand[1] - py, hand[0] - px))
        d = POSE_ANGLE[pose] - cur
        d = (d + 180) % 360 - 180
        rot = max(-125, min(125, d))
    out_hand = list(hand)
    for l in r['layers']:
        name = l['name']
        group = name.split('.')[0]
        im = layer_img(cls, name, s)
        if name == 'shadow':
            canvas.alpha_composite(im)
            continue
        piv = l.get('pivot')
        dx = dy = 0
        if pose == 'thrust' and group in ARMS | {'body', 'head', 'back'}:
            dx = 10 * s
        if pose == 'guard' and name in ('shield',):
            dx = 14 * s
        if pose == 'slump' and group == 'head' and piv:
            im = im.rotate(-16, resample=Image.BICUBIC, center=(piv[0] * s, piv[1] * s))
            dy = 10 * s
        if rot and group in ARMS and arm_layer:
            apx, apy = arm_layer['pivot']
            im = im.rotate(-rot, resample=Image.BICUBIC, center=(apx * s, apy * s))
        canvas.alpha_composite(im, (round(dx), round(dy)))
    if rot and arm_layer:
        apx, apy = arm_layer['pivot']
        a = math.radians(rot)
        vx, vy = hand[0] - apx, hand[1] - apy
        out_hand = [apx + vx * math.cos(a) - vy * math.sin(a), apy + vx * math.sin(a) + vy * math.cos(a)]
    if pose == 'thrust':
        out_hand[0] += 10
    return canvas, (out_hand[0] * s, out_hand[1] * s)


def enemy_img(key, s):
    k = ('foe', key, s)
    if k not in _cache:
        im = Image.open(f'{GAME}/assets/art/rigs/{key}/full.png').convert('RGBA')
        _cache[k] = im.resize((round(im.width * s / 2), round(im.height * s / 2)), Image.LANCZOS)
    return _cache[k]


def bbox_point(im, ox, oy, fy=0.38):
    a = np.asarray(im)[:, :, 3]
    ys, xs = np.nonzero(a > 40)
    if not len(xs):
        return [ox + im.width / 2, oy + im.height / 2]
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    return [ox + (x0 + x1) / 2, oy + y0 + (y1 - y0) * fy]


def place(cid):
    """Lay out one scene: returns list of (image, x, y, kind) plus effect anchor points."""
    m = man[cid]
    seed = m['seed']
    jit = lambda k, amp: ((seed >> k) % 1000 / 1000 - 0.5) * amp
    layout, cls, pose = m['layout'], m['cls'], m['pose']
    items = []
    floor = 486 + jit(3, 14)
    hs = S * (1 + jit(7, 0.08))
    fig, hand = hero_figure(cls, pose, hs)
    r = rig(cls)
    hx_c = {'versus': 190, 'versus_many': 170, 'ally': 210, 'solo': 420, 'cursed': 420}[layout] + jit(11, 30)
    ox = hx_c - r['w'] * hs / 2
    oy = floor - r['h'] * hs
    items.append((fig, ox, oy, 'hero'))
    pos = {'hand': [ox + hand[0], oy + hand[1]], 'selfpos': bbox_point(fig, ox, oy, 0.45)}
    pos['tpos'] = pos['allypos'] = pos['selfpos']
    if layout in ('versus', 'versus_many'):
        foes = m['foes']
        xs = [640] if len(foes) == 1 else ([575, 735] if len(foes) == 2 else [560, 680, 790])
        pts = []
        order = list(range(len(foes)))
        for i in order:
            key = foes[i]
            fs = S * (0.98 if len(foes) == 1 else 0.86) * (1 + jit(13 + i, 0.1))
            im = enemy_img(key, fs)
            w0 = json.load(open(f'{GAME}/data/rigs/{key}.json')).get('w', im.width / fs) if os.path.exists(f'{GAME}/data/rigs/{key}.json') else im.width / fs
            fx = xs[i] + jit(17 + i, 30) - im.width / 2
            fy = floor + (8 if i % 2 else 0) - im.height
            items.append((im, fx, fy, 'foe'))
            pts.append(bbox_point(im, fx, fy))
        if len(pts) == 1:
            pos['tpos'] = pts[0]
        else:
            pos['tpos'] = [sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)]
    if layout == 'ally':
        afig, _ = hero_figure(m['ally'], 'idle', S * 0.96)
        afig = afig.transpose(Image.FLIP_LEFT_RIGHT)
        ar = rig(m['ally'])
        ax = 630 + jit(19, 30) - ar['w'] * S * 0.96 / 2
        ay = floor + 6 - ar['h'] * S * 0.96
        items.append((afig, ax, ay, 'ally'))
        pos['allypos'] = pos['tpos'] = bbox_point(afig, ax, ay, 0.45)
    pos = {k: [round(v[0], 1), round(v[1], 1)] for k, v in pos.items()}
    return items, pos


def room_backdrop(m):
    seed = m['seed']
    room = m['room']
    out = Image.new('RGBA', (W, H), (20, 16, 12, 255))
    for i, part in enumerate(['far', 'mid']):
        im = Image.open(f'{GAME}/assets/art/rooms/{room}_{part}.png').convert('RGBA')
        sc = (H * 1.08) / im.height
        im = im.resize((round(im.width * sc), round(H * 1.08)), Image.LANCZOS)
        span = im.width - W
        x = int(((seed >> (6 + i * 3)) % 1000) / 1000 * span) if i == 0 else int(((seed >> 6) % 1000) / 1000 * span * 0.9 + span * 0.05)
        crop = im.crop((x, int(H * 0.04), x + W, int(H * 0.04) + H))
        if part == 'far':
            crop = crop.filter(ImageFilter.GaussianBlur(2.2))
        else:
            crop = crop.filter(ImageFilter.GaussianBlur(1.0))
        out.alpha_composite(crop)
    arr = np.asarray(out).astype(np.float32)
    arr[:, :, :3] *= 0.56
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8))


ELEM_TINT = {'fire': (1.12, 0.96, 0.82), 'frost': (0.88, 0.97, 1.1), 'lightning': (1.06, 1.04, 0.9), 'water': (0.86, 0.96, 1.08),
             'toxin': (0.94, 1.06, 0.84), 'void': (0.98, 0.88, 1.08), '': (1.0, 1.0, 1.0)}


def grade(img, m):
    a = np.asarray(img.convert('RGB')).astype(np.float32) / 255
    lum = a @ np.array([0.3, 0.59, 0.11], np.float32)
    sepia = np.stack([lum * 1.07, lum * 0.95, lum * 0.78], -1)
    a = a * 0.72 + sepia * 0.28
    a *= np.array(ELEM_TINT.get(m['elem'], ELEM_TINT['']), np.float32)
    a = np.clip((a - 0.5) * 1.12 + 0.5, 0, 1)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = ((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.46) / (H * 0.7)) ** 2
    vig = np.clip(1.0 - v * 0.75, 0.22, 1.0)
    if m['layout'] == 'cursed':
        vig = vig ** 1.6
    a *= vig[..., None]
    rs = np.random.RandomState(m['seed'] % 2**31)
    a += (rs.standard_normal((H, W, 1)).astype(np.float32)) * 0.022
    a = np.clip(a * 1.14, 0, 1) ** 0.98
    return Image.fromarray((a * 255).astype(np.uint8))


def figure_light(im, kind, m):
    """Darken figures slightly toward their feet and push foes back a touch so the actor reads first."""
    arr = np.asarray(im).astype(np.float32)
    h = arr.shape[0]
    grad = np.linspace(1.08, 0.78, h, dtype=np.float32)[:, None]
    f = 0.92 if kind == 'foe' else 1.0
    arr[:, :, :3] *= (grad * f)[..., None]
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8))


def render(cid):
    m = man[cid]
    items, pos = place(cid)
    out = room_backdrop(m)
    # ground fog band
    fog = Image.new('RGBA', (W, H))
    fa = np.zeros((H, W, 4), np.float32)
    yy = np.arange(H, dtype=np.float32)[:, None]
    fa[:, :, :3] = (40, 34, 28)
    fa[:, :, 3] = np.clip((yy - H * 0.72) / (H * 0.28), 0, 1) * 150
    fog = Image.fromarray(fa.astype(np.uint8))
    for im, x, y, kind in sorted(items, key=lambda t: {'foe': 0, 'ally': 1, 'hero': 2}[t[3]]):
        lit = figure_light(im, kind, m)
        # soft contact shadow
        sh = Image.new('RGBA', (W, H))
        out.alpha_composite(lit, (round(x), round(y)))
    out.alpha_composite(fog)
    fx = Image.open(f'{ART}/cards2/{cid}.png').convert('RGBA')
    # effects: additive glow pass + normal pass so light reads as light
    fa2 = np.asarray(fx).astype(np.float32) / 255
    base = np.asarray(out).astype(np.float32) / 255
    alpha = fa2[:, :, 3:4]
    rgb = base[:, :, :3] * (1 - alpha) + fa2[:, :, :3] * alpha
    glow = np.asarray(fx.filter(ImageFilter.GaussianBlur(10))).astype(np.float32) / 255
    rgb = rgb + glow[:, :, :3] * glow[:, :, 3:4] * 0.45
    out = Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8))
    # camera: each card frames its own moment (close on the actor, the victim, or the space between)
    seed = m['seed']
    z = 1.1 + ((seed >> 4) % 100) / 100 * 0.38
    t = ((seed >> 12) % 100) / 100
    if m['layout'] in ('solo', 'cursed'):
        fx_, fy_ = pos['selfpos']
    else:
        a_, b_ = pos['selfpos'], pos['tpos']
        k = 0.2 + t * 0.6
        fx_, fy_ = a_[0] + (b_[0] - a_[0]) * k, a_[1] + (b_[1] - a_[1]) * k
    cw, ch = W / z, H / z
    x0 = min(max(fx_ - cw / 2, 0), W - cw)
    y0 = min(max(fy_ - ch * 0.5, 0), H - ch)
    out = out.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch))).resize((W, H), Image.LANCZOS)
    g = grade(out, m).resize((OUT_W, OUT_H), Image.LANCZOS)
    g.save(f'{GAME}/assets/art/cards/{cid}.jpg', quality=88)
    return cid


if __name__ == '__main__':
    mode = sys.argv[1]
    ids = sys.argv[2:] or list(man.keys())
    if mode == 'plan':
        allpos = {}
        for cid in ids:
            allpos[cid] = place(cid)[1]
        prev = json.load(open(f'{ART}/cards2/pos.json')) if os.path.exists(f'{ART}/cards2/pos.json') else {}
        prev.update(allpos)
        json.dump(prev, open(f'{ART}/cards2/pos.json', 'w'))
        print('planned', len(allpos))
    else:
        with Pool(2) as p:
            n = len(p.map(render, ids, chunksize=8))
        print('rendered', n)
