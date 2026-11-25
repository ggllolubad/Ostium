"""The sky above the abbey for the title screen, painted in numpy rather than built from circles.

1600x1400; its bottom edge is the top edge of the cloister garth (world y 0), so the camera can pan straight down.
Banks of cumulus are density fields (heaped profile + fractal noise, flat undersides). Each is lit by marching toward
the drowned sun: where little cloud lies between a point and the sun the point is lit, so every billow gets a soft
lit crescent on its sun side and falls into shade behind. The silhouette is inked, the lit/shade boundary carries a
hair of ink, deep shade takes a faint engraved hatch, and fine grain sits over everything (no blotches).
The garth roofline that stands above the garth's top edge (the smithy stack, the roof slopes) is rendered from
garth__bg.svg, graded to the in-game lighting, and laid along the bottom; the sky's lowest rows are blended into the
exact colours the lit garth shows at its top edge so the pan has no seam.

Usage: python3 grim/title_sky.py <garth_screenshot.png> <garth_bg.png> <out.png>
"""
import re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

W, H = 1600, 1400
SUN = np.array([1120.0, 760.0])
rng = np.random.default_rng(1400)
ART = '/home/claude/ostium-art/grim/'


def vnoise(h, w, cy, cx):
    gh, gw = int(np.ceil(h / cy)) + 3, int(np.ceil(w / cx)) + 3
    g = rng.random((gh, gw))
    z = nd.zoom(g, (cy, cx), order=3, mode='reflect')
    return z[:h, :w]


def fbm(h, w, cy, cx, oct=5, gain=0.5):
    s, amp, tot = np.zeros((h, w)), 1.0, 0.0
    for o in range(oct):
        s += amp * (vnoise(h, w, max(1, cy / 2 ** o), max(1, cx / 2 ** o)) - 0.5)
        tot += amp
        amp *= gain
    return s / tot


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def mix(a, b, t):
    return a + (b - a) * t[..., None]


def hexc(s):
    return np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], float)


Y, X = np.mgrid[0:H, 0:W].astype(float)
# --- sky
stops = [(0, '#0b0c0f'), (0.3, '#1c1d23'), (0.62, '#35353a'), (0.86, '#48474a'), (1, '#4f4e4b')]
t = Y / H
img = np.zeros((H, W, 3))
for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
    m = (t >= t0) & (t <= t1)
    k = ((t - t0) / (t1 - t0))[m]
    img[m] = hexc(c0) + (hexc(c1) - hexc(c0)) * k[:, None]
# sun bloom
d = np.hypot(X - SUN[0], Y - SUN[1])
bloom = np.exp(-(d / 230) ** 2) * 0.55 + np.exp(-(d / 520) ** 2) * 0.22
img = mix(img, np.broadcast_to(hexc('#e2d8c0'), img.shape), np.clip(bloom, 0, 1))
# faint rays fanning from the sun
ang = np.arctan2(Y - SUN[1], X - SUN[0])
rays = np.zeros((H, W))
for _ in range(11):
    a0, wd = rng.uniform(-np.pi, 0), rng.uniform(0.02, 0.06)
    da = np.angle(np.exp(1j * (ang - a0)))
    rays += np.exp(-(da / (wd * 1.6)) ** 2) * rng.uniform(0.015, 0.035)
rays *= np.exp(-d / 900) * (d > 60)
img = mix(img, np.broadcast_to(hexc('#e8e0cc'), img.shape), np.clip(rays, 0, 1))
# stars where the Grey thins
for _ in range(240):
    y = (rng.random() ** 1.7) * 520
    x = rng.random() * W
    r = rng.uniform(0.5, 1.4)
    op = (1 - y / 520) * rng.uniform(0.15, 0.7)
    m = np.hypot(X[:int(y) + 3] - x, Y[:int(y) + 3] - y) < r
    img[:int(y) + 3][m] = img[:int(y) + 3][m] * (1 - op) + hexc('#d8d4c8') * op
# the disc, soft-edged
disc = smooth(52, 46, d)
# the disc: limb-darkened, its dim seas mottled in, a fine ink ring
maria = fbm(H, W, 14, 14, oct=3)
mcol = hexc('#efe8d4') * (1 - 0.16 * smooth(0.55, 1.0, d / 50)[..., None]) * (1 - 0.1 * smooth(0.0, 0.2, maria)[..., None])
img = img * (1 - (disc * 0.88)[..., None]) + mcol * (disc * 0.88)[..., None]
ring = np.exp(-((d - 50) / 1.1) ** 2) * 0.45
img = mix(img, np.broadcast_to(hexc('#2a2420'), img.shape), ring)

# --- stratus wisps: long, thin, soft
def wisps(y0, y1, op):
    global img
    n = fbm(H, W, 16, 520, oct=4)
    band = np.exp(-((Y - (y0 + y1) / 2) / ((y1 - y0) / 2)) ** 2)
    a = smooth(0.12, 0.26, n) * band * op * 0.4
    col = mix(np.broadcast_to(hexc('#5a5854'), img.shape), np.broadcast_to(hexc('#a8a294'), img.shape), np.clip(bloom * 2, 0, 1))
    img = mix(img, col, a)

INK = hexc('#120e0b')


def bank(yc, hgt, scale, tone, lip, gaps, seed_shift):
    """One bank of cumulus with its flat underside on y=yc. Each cloud is a heap of metaball billows: a base row, a
    middle tier and a crown. Every billow is shaded as a rounded lump (its own sphere normal against the sun), the
    heap is also self-shadowed by marching toward the sun, the silhouette is inked, and where a nearer billow
    overlaps one behind, a hair of ink marks the join."""
    global img
    top = int(max(0, yc - hgt * 1.5))
    bot = int(min(H, yc + hgt * 0.3 + 24))
    h = bot - top
    yy, xx = Y[top:bot], X[top:bot]
    blobs = []  # cx, cy, r, depth (bigger = nearer)
    x = rng.uniform(-260, -80)
    while x < W + 200:
        w = rng.uniform(1.0, 2.1) * hgt
        if rng.random() > gaps:
            ch = hgt * rng.uniform(0.6, 1.1)
            cb = yc + rng.uniform(-0.22, 0.22) * hgt  # this cloud's own base
            n = max(4, int(w / (ch * 0.26)))
            for i in range(n):  # small fused curds along the flat base
                t = (i + 0.5) / n
                r = ch * rng.uniform(0.2, 0.32)
                blobs.append((x + w * t + rng.uniform(-0.3, 0.3) * w / n, cb - r * rng.uniform(0.5, 0.9), r, 3 + rng.random(), cb))
            m = max(2, int(w / (ch * 0.6)))
            for i in range(m):  # the main heaps, biggest near the middle
                t = rng.uniform(0.12, 0.88)
                bell = np.sin(np.pi * t) ** 0.8
                r = ch * rng.uniform(0.32, 0.5) * (0.6 + 0.4 * bell)
                blobs.append((x + w * t, cb - ch * (0.25 + 0.3 * bell) * rng.uniform(0.8, 1.15), r, 2 + rng.random(), cb))
            for i in range(max(1, m // 2)):  # the crown
                t = rng.uniform(0.3, 0.7)
                r = ch * rng.uniform(0.2, 0.3)
                blobs.append((x + w * t, cb - ch * rng.uniform(0.68, 0.95), r, 1 + rng.random(), cb))
        x += w * rng.uniform(0.6, 1.0)
    if not blobs:
        return
    field = np.zeros((h, W)); flat = np.zeros((h, W))
    best = np.full((h, W), -1e9)
    wsum = np.full((h, W), 3.0); nx = np.zeros((h, W)); ny = np.zeros((h, W)); lab = np.zeros((h, W), int)
    for k, (bx, by, r, dep, cb) in enumerate(blobs):
        y0, y1 = int(max(top, by - r * 2)), int(min(bot, by + r * 2))
        x0, x1 = int(max(0, bx - r * 2)), int(min(W, bx + r * 2))
        if y1 <= y0 or x1 <= x0:
            continue
        sy, sx = slice(y0 - top, y1 - top), slice(x0, x1)
        dx, dy = (X[y0:y1, x0:x1] - bx) / r, (Y[y0:y1, x0:x1] - by) / r
        dd = dx * dx + dy * dy
        cbk = cb + rng.uniform(-5, 5)
        g = np.exp(-dd * 1.15) * smooth(cbk + 6, cbk - 8, Y[y0:y1, x0:x1])
        field[sy, sx] += g
        # normals blend softly, nearer billows dominate where they overlap
        wk = np.exp(-dd * 4) * np.exp(dep * 2.2)
        wsum[sy, sx] += wk; nx[sy, sx] += wk * dx; ny[sy, sx] += wk * dy
        score = np.where(dd < 1.25, dep * 10 - dd, -1e9)
        upd = score > best[sy, sx]
        best[sy, sx] = np.where(upd, score, best[sy, sx]); lab[sy, sx] = np.where(upd, k, lab[sy, sx])
    nx /= wsum; ny /= wsum
    nl = np.hypot(nx, ny)
    sc = np.where(nl > 1, 1 / np.maximum(nl, 1e-6), 1)
    nx *= sc; ny *= sc
    det = fbm(h, W, 9 * scale, 11 * scale, oct=3)
    dens = field + det * 0.3
    alpha = smooth(0.26, 0.33, dens)
    # rounded-lump shading per billow
    nz = np.sqrt(np.clip(1 - nx * nx - ny * ny, 0, 1))
    near = np.clip(1 - np.hypot(xx - SUN[0], yy - SUN[1]) / 780, 0, 1)
    ux, uy = SUN[0] - xx, SUN[1] - yy
    ul = np.hypot(ux, uy) + 1e-6
    lx, ly, lz = ux / ul * 0.92, uy / ul * 0.92, 0.25
    lam = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    lam = nd.gaussian_filter(lam, 2.2 * scale)
    # self-shadow: how much cloud lies toward the sun
    occ = np.zeros_like(alpha)
    for s0 in range(0, W, 80):
        u = SUN - np.array([s0 + 40, yc - hgt * 0.4]); u /= np.linalg.norm(u)
        acc = np.zeros((h, 80))
        for k in range(1, 7):
            ddx, ddy = int(round(u[0] * k * 7 * scale)), int(round(u[1] * k * 7 * scale))
            sh = np.roll(np.roll(alpha, -ddy, axis=0), -ddx, axis=1)
            if ddy > 0: sh[h - ddy:] = 0
            if ddy < 0: sh[:-ddy] = 0
            acc += sh[:, s0:s0 + 80] * (1 - k / 8)
        occ[:, s0:s0 + 80] = acc
    occl = np.clip(1 - nd.gaussian_filter(occ / 2.6, (2 * scale, 12 * scale)), 0, 1)
    # per-billow rims: a pixel is in shade if the step toward the sun lands on the same billow or a nearer one, so
    # each billow's sun-facing edge lights up where it stands in front of the billows behind it
    deps = np.array([b[3] for b in blobs])
    dmap = np.where(alpha > 0.5, deps[lab], -1.0)
    occ2 = np.zeros_like(alpha)
    for s0 in range(0, W, 80):
        u = SUN - np.array([s0 + 40, yc - hgt * 0.4]); u /= np.linalg.norm(u)
        acc = np.zeros((h, 80))
        for k in range(1, 6):
            ddx, ddy = int(round(u[0] * k * 4 * scale)), int(round(u[1] * k * 4 * scale))
            sh = np.roll(np.roll(dmap, -ddy, axis=0), -ddx, axis=1)
            if ddy > 0: sh[h - ddy:] = -1
            if ddy < 0: sh[:-ddy] = -1
            acc += (sh[:, s0:s0 + 80] >= dmap[:, s0:s0 + 80] - 1e-6) * (1 - k / 7)
        occ2[:, s0:s0 + 80] = acc
    rimb = np.clip(1 - nd.gaussian_filter(occ2 / 2.4, 1.6 * scale), 0, 1) * (dmap >= 0)
    lam_s = nd.gaussian_filter(lam, 5 * scale)
    light = np.clip(lam_s * 0.72 + occl * 0.3 - 0.14, 0, 1)
    litc = mix(np.broadcast_to(hexc(tone) * 0.15 + hexc(lip) * 0.85, (h, W, 3)), np.broadcast_to(hexc('#f0e4c6'), (h, W, 3)), near * 0.65)
    v = np.clip((yc - yy) / hgt, 0, 1.4)
    shadecol = mix(np.broadcast_to(hexc(tone), (h, W, 3)), np.broadcast_to(hexc(tone) * 0.66, (h, W, 3)), np.clip(v, 0, 1) * 0.7)
    # painted in a few flat-ish values like an inked illustration: shade, half, light, highlight, with narrow soft
    # transitions, and a hair of ink along each step so the forms read as drawn, not airbrushed
    # the sun-side rims are stepped like an inked illustration (two crisp bands with a hair of ink at each step);
    # the body keeps the soft rounded form shading
    steps = [0.35, 0.65]
    rl = np.maximum(occl, rimb * 0.8)
    rim = sum(smooth(t0 - 0.03, t0 + 0.03, rl) for t0 in steps) / len(steps)
    q = np.clip(rim * 0.55 + light * 0.6, 0, 1)
    col = mix(shadecol, litc, np.power(q, 1.1))
    hair = sum(np.exp(-((rl - t0) / 0.015) ** 2) for t0 in steps) * 0.14
    # a faint warm bounce on the flat undersides from the sun below
    under = smooth(yc - 30, yc + 4, yy) * near
    col = mix(col, np.broadcast_to(hexc('#a89880'), col.shape), under * 0.35)
    # joins between billows, inked where the lit side of a nearer one meets shade behind it
    join = (nd.maximum_filter(lab, 3) != nd.minimum_filter(lab, 3)) & (alpha > 0.9) & (yy < yc - hgt * 0.3)
    join = nd.gaussian_filter(join.astype(float), 0.7) * 0.28 * smooth(0.35, 0.75, light) + hair
    hatch = 0
    col = mix(col, np.broadcast_to(INK, col.shape), np.clip(join + hatch, 0, 0.6) * alpha)
    er = nd.minimum_filter(alpha, size=max(3, int(3.2 * scale)))
    edge = np.clip(alpha - er, 0, 1) * 0.55
    region = img[top:bot]
    region = mix(region, col, alpha)
    region = mix(region, np.broadcast_to(INK, region.shape), edge)
    img[top:bot] = region


banks = [  # far (low) to near (high): later ones overlap earlier
    (1060, 70, 0.62, '#4a4946', '#8c897f', 0.45),
    (880, 100, 0.8, '#3d3d3e', '#7c7a74', 0.42),
    (680, 135, 1.0, '#2e2e32', '#6a6865', 0.4),
    (470, 170, 1.18, '#232429', '#585759', 0.35),
    (260, 210, 1.4, '#18191e', '#47474c', 0.3),
]
for i, b in enumerate(banks):
    bank(*b, seed_shift=i)
# fog low over the abbey
for y in (1110, 1210, 1300):
    f = np.exp(-((Y - y) / 60) ** 2) * 0.28
    img = mix(img, np.broadcast_to(hexc('#5e5c57'), img.shape), f)

# --- forge smoke rising from the smithy stack (its top is at 292,1250): soft puffs drifting east and up
smk = np.zeros((H, W))
x, y, r = 292.0, 1240.0, 14.0
for k in range(30):
    x0 = x + rng.uniform(-5, 5)
    smk = np.maximum(smk, np.exp(-((X - x0) ** 2 + (Y - y) ** 2) / (2 * r * r)) * max(0.15, 0.85 - k / 34))
    x += 7 + k * 1.5
    y -= 14 - k * 0.3
    r += 3.2
smk *= 0.75 + 0.5 * fbm(H, W, 30, 30, oct=3)
img = mix(img, np.broadcast_to(hexc('#1d1a18'), img.shape), np.clip(smk, 0, 1))

# --- grain
# faint brushed streaks in the open sky between the clouds, horizontal, never blotches
streak = fbm(H, W, 10, 360, oct=3)
img *= (1 + streak * 0.07)[..., None]
img += rng.normal(0, 2.2, (H, W, 1))

# --- blend the lowest rows into the lit garth's top-edge colours, column by column
shot = np.asarray(Image.open(sys.argv[1]).convert('RGB'), float)
raw = np.asarray(Image.open(sys.argv[2]).convert('RGB'), float)
row = shot[3]
is_sky = np.abs(raw[3] - np.array([142, 140, 135])).sum(1) < 18
xs = np.arange(W)
tgt = np.stack([np.interp(xs, xs[is_sky], row[is_sky, c]) for c in range(3)], 1)
tgt = nd.gaussian_filter1d(tgt, 40, axis=0)
ramp = smooth(H - 320, H - 2, Y)[..., None]
img = img * (1 - ramp) + tgt[None] * ramp

# --- crows wheeling over the bell tower, drawn 4x and reduced
ss = 4
cl = Image.new('L', (W * ss, H * ss), 0)
dr = ImageDraw.Draw(cl)
for _ in range(16):
    cx, cy, s = rng.uniform(1130, 1480), rng.uniform(900, 1190), rng.uniform(5, 11)
    wd = max(1, int(s * 0.32 * ss))
    for sgn in (-1, 1):
        pts = []
        for i in range(9):
            tt = i / 8
            px = cx + sgn * s * tt
            py = cy - np.sin(np.pi * tt) * s * 0.55 + tt * s * 0.1
            pts.append((px * ss, py * ss))
        dr.line(pts, fill=255, width=wd, joint='curve')
cl = np.asarray(cl.resize((W, H), Image.LANCZOS), float) / 255
img = mix(img, np.broadcast_to(hexc('#0a0a0c'), img.shape), cl)

# --- the roofline standing above the garth's top edge (smoke strokes stripped; the sky paints its own)
s = open(ART + 'hub/garth__bg.svg').read()
pat = re.compile(r'<g filter="url\(#rough\)"><path d="[^"]*" stroke="#[0-9a-fA-F]+" stroke-width="[\d.]+" fill="none" stroke-linecap="round" opacity="[\d.]+"/><path d="[^"]*" stroke="#[0-9a-fA-F]+" stroke-width="[\d.]+" fill="none" stroke-linecap="round" opacity="[\d.]+"/></g>')
s = pat.sub('', s).replace('width="1600" height="1000" viewBox="0 0 1600 1000"', 'width="1600" height="440" viewBox="0 -440 1600 440"', 1)
open('/tmp/claude-0/band.svg', 'w').write(s)
subprocess.run(['rsvg-convert', '/tmp/claude-0/band.svg', '-o', '/tmp/claude-0/band.png'], check=True)
band = np.asarray(Image.open('/tmp/claude-0/band.png').convert('RGBA'), float)
# grade: the ratio the lighting applies to opaque building pixels near the top edge of the garth
m = (~is_sky) & (raw[3].sum(1) > 30)
ratio = np.median(shot[4:30][:, m].reshape(-1, 3) / np.maximum(raw[4:30][:, m].reshape(-1, 3), 1), 0)
ratio = np.clip(ratio, 0.15, 0.8)
ba = band[..., 3:4] / 255
rgb = band[..., :3] * ratio
# embers and the glowing stack lip keep their own light
glow = (band[..., 0] > band[..., 2] + 60)[..., None]
rgb = np.where(glow, band[..., :3] * 0.9, rgb)
img[H - 440:] = img[H - 440:] * (1 - ba) + rgb * ba

Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(sys.argv[3])
print('sky ok, band grade', ratio.round(3))
