"""Emblem card art (prototype): the act shown as a symbol, in the manner of an emblem book, rather than as a scene.
A course-coloured wash, one large inked device with hatching, one gesture stroke. Same ink, hatching and wobble
as the map engravings so the game reads as one hand.

Usage: python3 tools/art/emblem.py [ids...] -> build/emblem/<id>.jpg (560x306, the card art size) and a contact sheet."""
import math, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "build", "emblem")
INK, WASH, RUB, PAPER = "#2b1d12", "#6f5036", "#9c3d2b", "#efe3c6"
COURSE = {"fire": "#c4573f", "frost": "#5a78a6", "lightning": "#a9822f", "water": "#3f6fa0", "toxin": "#62804f",
          "void": "#6d5a8a", "physical": "#8a6a46", "blood": "#8a1a12"}
Wd, Ht = 1120, 612

S = lambda w=5, c=INK: f'fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"'
HATCH = 'fill="url(#h)"'
XHATCH = 'fill="url(#hx)"'


def defs(seed=3):
    return f"""<defs>
 <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="{seed}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="4" result="g"/>
  <feDisplacementMap in="d" in2="g" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
 </filter>
 <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="{seed+5}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="90" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feGaussianBlur in="d" stdDeviation="6"/>
 </filter>
 <filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.13  0 0 0 -1.9 1.1"/>
  <feComposite in2="SourceGraphic" operator="in"/>
 </filter>
 <filter id="mottle" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="4" seed="{seed}" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 -1.4 0.95"/>
  <feComposite in2="SourceGraphic" operator="in"/>
 </filter>
 <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
 <filter id="pool" x="-40%" y="-40%" width="180%" height="180%">
  <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="{seed+2}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feGaussianBlur in="d" stdDeviation="38"/>
 </filter>
 <pattern id="h" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
  <line x1="0" y1="0" x2="0" y2="10" stroke="{INK}" stroke-width="2.3"/></pattern>
 <pattern id="hx" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
  <line x1="0" y1="0" x2="0" y2="9" stroke="{INK}" stroke-width="2.2"/><line x1="0" y1="0" x2="9" y2="0" stroke="{INK}" stroke-width="1.6"/></pattern>
 <pattern id="hf" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
  <line x1="0" y1="0" x2="0" y2="14" stroke="{INK}" stroke-width="1.4" stroke-opacity="0.55"/></pattern>
 <radialGradient id="eg" cx="50%" cy="50%" r="62%"><stop offset="58%" stop-color="#000"/><stop offset="100%" stop-color="#fff"/></radialGradient>
 <mask id="edge"><rect width="1120" height="612" fill="url(#eg)"/></mask>
 <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="55%" stop-color="#3a2614" stop-opacity="0"/>
  <stop offset="100%" stop-color="#1c120a" stop-opacity="0.7"/></radialGradient>
</defs>"""


def ground(col, blobs, dark=0.0, light=(560, 300, 330, 220)):
    """Full-bleed course colour, a pool of paper light behind the device, engraved shade in the corners."""
    b = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c or col}" opacity="{o}" filter="url(#bloom)"/>' for x, y, rx, ry, o, c in blobs)
    lx, ly, lrx, lry = light
    return (f'<rect width="{Wd}" height="{Ht}" fill="#eadcb9"/>'
            f'<rect width="{Wd}" height="{Ht}" fill="{col}" opacity="0.78"/>'
            f'<rect width="{Wd}" height="{Ht}" fill="#1c120a" opacity="{0.25 + dark}"/>'
            f'<rect width="{Wd}" height="{Ht}" fill="#000" filter="url(#mottle)" opacity="0.45"/>'
            f'<ellipse cx="{lx}" cy="{ly}" rx="{lrx}" ry="{lry}" fill="#f1e4c4" opacity="0.85" filter="url(#pool)"/>'
            f'<ellipse cx="{lx}" cy="{ly}" rx="{lrx*0.6:.0f}" ry="{lry*0.6:.0f}" fill="#f6ecd2" opacity="0.6" filter="url(#pool)"/>{b}'
            f'<rect width="{Wd}" height="{Ht}" fill="url(#hx)" mask="url(#edge)" opacity="0.55"/>')


def finish():
    return (f'<rect width="{Wd}" height="{Ht}" fill="#000" filter="url(#grain)" opacity="0.22"/>'
            f'<rect width="{Wd}" height="{Ht}" fill="url(#vig)"/>')


def stroke(pts, w0, w1, col, op=1.0, bulge=1.0):
    """A tapered brush stroke along a polyline: thin, swelling, thin."""
    n = len(pts)
    L, R = [], []
    for i, (x, y) in enumerate(pts):
        t = i / (n - 1)
        w = (w0 + (w1 - w0) * t) * (math.sin(math.pi * min(1, t * 1.15)) ** 0.6 if t < 0.87 else max(0.05, (1 - t) * 5)) * bulge
        if i == 0:
            dx, dy = pts[1][0] - x, pts[1][1] - y
        else:
            dx, dy = x - pts[i - 1][0], y - pts[i - 1][1]
        m = math.hypot(dx, dy) or 1
        nx, ny = -dy / m, dx / m
        L.append((x + nx * w / 2, y + ny * w / 2))
        R.append((x - nx * w / 2, y - ny * w / 2))
    poly = L + R[::-1]
    return f'<path d="M{" L".join(f"{a:.1f} {b:.1f}" for a, b in poly)} Z" fill="{col}" opacity="{op}"/>'


def arc_pts(cx, cy, r, a0, a1, n=40, squash=1.0):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / (n - 1))), cy + r * squash * math.sin(math.radians(a0 + (a1 - a0) * i / (n - 1)))) for i in range(n)]


def line_pts(x0, y0, x1, y1, bow=0.0, n=30):
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    dx, dy = x1 - x0, y1 - y0
    cx, cy = mx - dy * bow, my + dx * bow
    out = []
    for i in range(n):
        t = i / (n - 1)
        out.append(((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1))
    return out


def star(cx, cy, r, k=5, inner=0.45, rot=-90):
    pts = []
    for i in range(k * 2):
        rr = r if i % 2 == 0 else r * inner
        a = math.radians(rot + i * 180 / k)
        pts.append(f"{cx + rr * math.cos(a):.1f} {cy + rr * math.sin(a):.1f}")
    return "M" + " L".join(pts) + " Z"


def burst(cx, cy, r0, r1, k, seed=1):
    import random
    rnd = random.Random(seed)
    pts = []
    for i in range(k * 2):
        a = i * math.pi / k + rnd.uniform(-0.12, 0.12)
        rr = (r1 * rnd.uniform(0.75, 1.15)) if i % 2 == 0 else r0 * rnd.uniform(0.8, 1.1)
        pts.append(f"{cx + rr * math.cos(a):.1f} {cy + rr * math.sin(a):.1f}")
    return "M" + " L".join(pts) + " Z"


# ------------------------------------------------------------------ grounds (StS2 grammar: a loud field behind one subject)
def _field(cx, cy, c1, c2, dark, lines):
    """The game's page: parchment, a course wash blooming from the subject, engraved lines, a brown vignette."""
    return (f'<rect width="{Wd}" height="{Ht}" fill="#e3d2ab"/>'
            f'<rect width="{Wd}" height="{Ht}" fill="#000" filter="url(#mottle)" opacity="0.35"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="760" ry="520" fill="{c2}" opacity="0.5" filter="url(#bloom)"/>'
            f'<rect width="{Wd}" height="{Ht}" fill="{c1}" opacity="0.55" mask="url(#edge)"/>'
            f'{lines}'
            f'<ellipse cx="{cx}" cy="{cy}" rx="300" ry="220" fill="#f3e6c6" opacity="0.55" filter="url(#pool)"/>'
            f'<radialGradient id="rg" cx="{cx/Wd:.2f}" cy="{cy/Ht:.2f}" r="0.8"><stop offset="0.45" stop-color="#2b1d12" stop-opacity="0"/>'
            f'<stop offset="1" stop-color="#2b1d12" stop-opacity="{dark}"/></radialGradient><rect width="{Wd}" height="{Ht}" fill="url(#rg)"/>')


def rays(cx, cy, c1, c2, n=22, rot=0, dark=0.45):
    """Engraved glory: fine ink rays from the subject, as an engraver draws light."""
    ln = ""
    for i in range(n * 3):
        a = math.radians(rot + i * 360 / (n * 3))
        w = 2.4 if i % 3 == 0 else 1.2
        ln += f'<path d="M{cx + 90 * math.cos(a):.0f} {cy + 90 * math.sin(a):.0f} L{cx + 1500 * math.cos(a):.0f} {cy + 1500 * math.sin(a):.0f}" stroke="{INK}" stroke-width="{w}" opacity="0.28"/>'
    return _field(cx, cy, c1, c2, dark, f'<g filter="url(#ink)">{ln}</g>')


def swirl(cx, cy, c1, c2, turns=3.2, dark=0.45):
    ln = ""
    for k in range(4):
        pts = []
        for i in range(140):
            t = i / 139
            a = t * turns * 2 * math.pi + k * math.pi / 2
            r = 40 + t * 900
            pts.append(f"{cx + r * math.cos(a):.0f} {cy + r * math.sin(a) * 0.8:.0f}")
        ln += f'<path d="M{" L".join(pts)}" fill="none" stroke="{INK}" stroke-width="{3 - k * 0.5}" opacity="0.3"/>'
    return _field(cx, cy, c1, c2, dark, f'<g filter="url(#ink)">{ln}</g>')


O = lambda w=7: S(round(max(3, w * 0.72), 1))   # the game's ink weight, a little heavier than the map
SKIN, SKIN_D = "#d8b08a", "#a07656"
STEEL, STEEL_D = "#9fa19f", "#6a6c6a"

# hands by calling: (skin, skin shade, cuff, cuff shade, plated?, rings?)
HANDS = {"bulwark": (STEEL, STEEL_D, "#7a4a2a", "#4e2e18", True, False), "duelist": ("#7a4a2c", "#4f2e1a", RUB, "#6a2418", False, False),
         "alchemist": ("#5f6f4a", "#3e4a2e", "#c9b48a", "#8d7a55", False, False), "oracle": (SKIN, SKIN_D, "#3a4a7a", "#232e52", False, False),
         "hexweaver": ("#b7aab8", "#7d6d80", "#3b2c3e", "#22182a", False, True), "elementalist": (SKIN, SKIN_D, "#5a3f6e", "#392648", False, False)}


def fist(who, x, y, rot=0, sc=1.0, flip=False):
    """A right fist round a pole that runs vertically through local x=0. Back of the hand to the left, cuff past it."""
    sk, skd, cf, cfd, plate, rings = HANDS[who]
    fingers = ""
    for i in range(4):
        fy = -62 + i * 31
        fingers += (f'<path d="M-24 {fy} H34 Q50 {fy} 50 {fy+15} Q50 {fy+30} 34 {fy+30} H-24 Z" fill="{sk}"/>'
                    f'<path d="M-24 {fy+18} H40 Q50 {fy+24} 34 {fy+30} H-24 Z" fill="{skd}"/>'
                    f'<path d="M-24 {fy} H34 Q50 {fy} 50 {fy+15} Q50 {fy+30} 34 {fy+30} H-24" {S(5)}/>'
                    f'<path d="M14 {fy+4} V{fy+26}" {S(3)}/>')
        if plate:
            fingers += f'<circle cx="0" cy="{fy+15}" r="3.5" fill="{INK}"/>'
        if rings and i in (1, 3):
            fingers += f'<rect x="-6" y="{fy+2}" width="12" height="26" fill="#d6ad52" stroke="{INK}" stroke-width="3"/>'
    back = (f'<path d="M-120 -70 Q-60 -86 -20 -66 L-20 64 Q-60 80 -120 70 Z" fill="{sk}"/>'
            f'<path d="M-120 20 Q-70 30 -20 30 L-20 64 Q-60 80 -120 70 Z" fill="{skd}"/>'
            f'<path d="M-120 -70 Q-60 -86 -20 -66 L-20 64 Q-60 80 -120 70" {S(6)}/>')
    if plate:
        back += f'<path d="M-104 -60 Q-70 -50 -40 -60 M-108 -20 Q-70 -10 -36 -20 M-108 24 Q-70 34 -36 24" {S(4)}/>' + "".join(f'<circle cx="{-96+j*26}" cy="-38" r="4" fill="{INK}"/>' for j in range(3))
    thumb = (f'<path d="M-70 -72 Q-40 -110 10 -96 Q40 -88 36 -72 Q26 -62 -6 -70 Q-30 -72 -46 -58 Z" fill="{sk}"/>'
             f'<path d="M-70 -72 Q-40 -110 10 -96 Q40 -88 36 -72 Q26 -62 -6 -70 Q-30 -72 -46 -58 Z" {S(5)}/>'
             f'<path d="M2 -94 Q12 -84 6 -72" {S(3)}/>')
    cuff = (f'<path d="M-230 -84 L-116 -78 L-116 80 L-230 88 Z" fill="{cf}"/>'
            f'<path d="M-230 30 L-116 30 L-116 80 L-230 88 Z" fill="{cfd}"/><path d="M-230 30 L-116 30 L-116 80 L-230 88 Z" {HATCH} opacity="0.5"/>'
            f'<path d="M-230 -84 L-116 -78 L-116 80 L-230 88 Z" {S(6)}/><path d="M-136 -78 V80" {S(4)}/>')
    return f'<g transform="translate({x} {y}) rotate({rot}) scale({-sc if flip else sc} {sc})">{cuff}{back}{fingers}{thumb}</g>'


def sparks(pts, col=PAPER):
    return "".join(f'<path d="{star(x, y, r, 4, 0.28, a)}" fill="{col}" stroke="{INK}" stroke-width="3"/>' for x, y, r, a in pts)


def speed(cx, cy, n, r0, r1, col=PAPER, w=7, seed=2):
    import random
    rnd = random.Random(seed)
    out = ""
    for i in range(n):
        a = rnd.uniform(0, 2 * math.pi)
        ra, rb = rnd.uniform(r0, r0 * 1.3), rnd.uniform(r1 * 0.8, r1)
        out += stroke([(cx + (ra + (rb - ra) * t / 9) * math.cos(a), cy + (ra + (rb - ra) * t / 9) * math.sin(a)) for t in range(10)], w, w * 0.6, col, 0.9)
    return out


# ------------------------------------------------------------------ the devices
def mace_blow():
    bg = rays(760, 250, "#7a2a1c", "#a8442c", 20, 8)
    head = f"""
 <g transform="translate(700 250) rotate(48)">
  <rect x="-15" y="40" width="30" height="520" fill="#7a5236"/><rect x="0" y="40" width="15" height="520" fill="#4e321e"/><rect x="-15" y="40" width="30" height="520" {O(6)}/>
  <path d="M-34 20 H34 V48 H-34 Z" fill="{STEEL}"/><path d="M0 20 H34 V48 H0 Z" fill="{STEEL_D}"/><path d="M-34 20 H34 V48 H-34 Z" {O(6)}/>
  <path d="M-26 20 L-96 -6 L-104 -150 L-26 -186 Z" fill="{STEEL}"/><path d="M-26 20 L-96 -6 L-104 -150 L-26 -186 Z" {O(6)}/>
  <path d="M26 20 L96 -6 L104 -150 L26 -186 Z" fill="{STEEL_D}"/><path d="M26 20 L96 -6 L104 -150 L26 -186 Z" {HATCH}/><path d="M26 20 L96 -6 L104 -150 L26 -186 Z" {O(6)}/>
  <path d="M-26 20 L-26 -190 L0 -226 L26 -190 L26 20 Z" fill="#c9cdd2"/><path d="M0 -226 L26 -190 L26 20 L0 20 Z" fill="{STEEL_D}"/><path d="M-26 20 L-26 -190 L0 -226 L26 -190 L26 20 Z" {O(6)}/>
  <path d="M-12 -170 V-10 M-70 -10 L-76 -140" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
 </g>"""
    imp = (f'<path d="{burst(870, 110, 40, 150, 9, 3)}" fill="#f2d27a"/><path d="{burst(870, 110, 40, 150, 9, 3)}" {O(5)}/>'
           f'<path d="{burst(870, 110, 18, 60, 7, 5)}" fill="#fff6dc"/>'
           + sparks([(1010, 200, 22, 10), (760, 40, 16, 30), (1040, 60, 14, 0), (980, 290, 12, 20)]))
    return bg + f'<g filter="url(#ink)">{speed(700, 250, 10, 330, 600, "#f0c98a", 8)}{head}{imp}{fist("bulwark", 388, 531, 48, 1.05, True)}</g>'


def two_step():
    bg = swirl(560, 300, "#3a1018", "#6e1c26", 2.6)
    def dagger(x, y, rot):
        return f"""<g transform="translate({x} {y}) rotate({rot})">
  <path d="M0 -12 L330 -6 L370 0 L330 6 L0 12 Z" fill="#d9dde2"/><path d="M0 0 L370 0 L330 6 L0 12 Z" fill="{STEEL_D}"/><path d="M0 -12 L330 -6 L370 0 L330 6 L0 12 Z" {O(5)}/>
  <path d="M-8 -46 Q8 -30 -8 -14 M-8 46 Q8 30 -8 14" {O(7)}/><path d="M-10 -46 V46" {O(9)}/>
  <rect x="-90" y="-12" width="80" height="24" rx="6" fill="#4e2e1a"/><rect x="-90" y="-12" width="80" height="24" rx="6" {O(5)}/>
  <circle cx="-100" cy="0" r="16" fill="#d6ad52"/><circle cx="-100" cy="0" r="16" {O(5)}/></g>"""
    cuts = (stroke(line_pts(150, 80, 990, 540, 0.12), 90, 50, "#e04a3a", 1) + stroke(line_pts(200, 560, 940, 50, -0.12), 80, 44, "#e04a3a", 1)
            + stroke(line_pts(170, 96, 970, 530, 0.12), 26, 14, "#ffd9c0", 0.95) + stroke(line_pts(220, 548, 920, 62, -0.12), 22, 12, "#ffd9c0", 0.95))
    return bg + f'<g filter="url(#ink)">{dagger(200, 470, -28)}{dagger(930, 470, -152)}{cuts}{sparks([(560, 300, 40, 0), (300, 150, 16, 20), (840, 140, 18, 10)], "#fff3d8")}</g>'


def plague_flask():
    bg = swirl(560, 330, "#1e3a1a", "#3f6a2a", 3.0)
    def cloud(cx, cy, w, h, n, seed, fill):
        import random
        rnd = random.Random(seed)
        pts = [(cx + w * math.cos(2 * math.pi * i / n), cy + h * math.sin(2 * math.pi * i / n)) for i in range(n)]
        d = f"M{pts[0][0]:.0f} {pts[0][1]:.0f}"
        for i in range(n):
            x1, y1 = pts[(i + 1) % n]
            r = math.hypot(x1 - pts[i][0], y1 - pts[i][1]) * rnd.uniform(0.55, 0.75)
            d += f" A{r:.0f} {r:.0f} 0 0 1 {x1:.0f} {y1:.0f}"
        return (f'<path d="{d} Z" fill="{fill}"/><path d="{d} Z" fill="#4c7a2c" opacity="0.55" transform="translate({cx*0.06:.0f} {cy*0.1+h*0.35:.0f}) scale(0.94 0.8)"/>'
                f'<path d="{d} Z" {O(6)}/>' + "".join(f'<path d="M{cx+w*dx:.0f} {cy+h*dy:.0f} q{w*0.12:.0f} {-h*0.25:.0f} {w*0.25:.0f} 0" {S(4)}/>' for dx, dy in [(-0.6, 0.1), (0.3, 0.3), (-0.2, -0.4), (0.55, -0.2)]))
    wash = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" opacity="{o}" filter="url(#bloom)"/>' for x, y, rx, ry, c, o in
                   [(560, 200, 230, 140, "#9fb878", 0.85), (560, 220, 150, 100, "#7f9a5a", 0.6), (250, 300, 140, 80, "#9fb878", 0.7), (870, 300, 140, 80, "#9fb878", 0.7)])
    def wisp(pts, w):
        return stroke(pts, w * 0.3, w, INK, 0.85)
    curl = lambda cx, cy, r, a0, a1: arc_pts(cx, cy, r, a0, a1, 24)
    gas = wash + wisp(line_pts(600, 380, 760, 150, -0.3, 30) + curl(790, 150, 34, 180, 400)[:16], 8)
    skull = (f'<ellipse cx="520" cy="196" rx="26" ry="32" fill="#1e3a1a" opacity="0.8"/><ellipse cx="604" cy="196" rx="26" ry="32" fill="#1e3a1a"/>'
             f'<path d="M562 230 l-12 24 h24 z" fill="#1e3a1a"/><path d="M516 268 H608 M530 258 V280 M552 258 V282 M574 258 V282 M596 258 V280" {S(6, "#1e3a1a")}/>')
    flask = f"""
 <path d="M430 480 Q430 400 506 388 L522 360 L548 384 L574 352 L600 382 L626 362 L636 388 Q690 400 690 480 Q690 600 560 600 Q430 600 430 480 Z" fill="#7fb04a"/>
 <path d="M560 600 Q690 600 690 480 Q690 400 636 388 Q660 470 620 560 Q600 590 560 600 Z" fill="#4c7a2c"/>
 <path d="M506 388 L522 360 L548 384 L574 352 L600 382 L626 362 L636 388 Q690 400 690 480 Q690 600 560 600 Q430 600 430 480 Q430 400 506 388" {O(7)}/>
 <path d="M466 480 Q474 432 510 414" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.8"/>
 {''.join(f'<path d="M{x} {y} l{a} {b} l{c} {d} z" fill="#dff0c0" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>' for x, y, a, b, c, d in [(470, 340, -50, -24, 12, -40), (680, 330, 54, -34, 8, 36), (400, 410, -60, 6, 26, -36), (740, 410, 56, 4, -16, -36)])}"""
    return bg + f'<g filter="url(#ink)">{gas}{skull}{flask}</g>'


def stolen_hour():
    bg = rays(560, 300, "#1c1630", "#2c2448", 24, 4, 0.5)
    stars = "".join(f'<path d="{star(x, y, s, 4, 0.3, a)}" fill="#f2d27a"/>' for x, y, s, a in
                    [(150, 120, 20, 0), (240, 470, 14, 10), (930, 110, 18, 20), (990, 430, 22, 0), (860, 520, 12, 0), (120, 330, 12, 30), (330, 80, 10, 0), (780, 70, 12, 0)])
    glass = f"""
 <g transform="translate(560 280) rotate(-10)">
  <path d="M-140 -250 H140 V-222 H-140 Z M-140 222 H140 V250 H-140 Z" fill="#a0704a"/><path d="M0 -250 H140 V-222 H0 Z M0 222 H140 V250 H0 Z" fill="#6a4428"/>
  <path d="M-140 -250 H140 V-222 H-140 Z M-140 222 H140 V250 H-140 Z" {O(6)}/>
  {''.join(f'<path d="M{x} -222 V222" stroke="{INK}" stroke-width="18" stroke-linecap="round"/><path d="M{x} -222 V222" stroke="#a0704a" stroke-width="9"/>' for x in (-122, 122))}
  <path d="M-96 -222 Q-96 -60 -12 0 Q-96 60 -96 222 H96 Q96 60 12 0 Q96 -60 96 -222 Z" fill="#c8d4ec" fill-opacity="0.45"/>
  <path d="M-70 -150 Q-60 -60 -8 -10 L8 -10 Q60 -60 70 -150 Q0 -130 -70 -150 Z" fill="#3a3070"/>
  {''.join(f'<path d="{star(x, y, s, 4, 0.3)}" fill="#f2d27a"/>' for x, y, s in [(-30, -120, 12), (20, -105, 10), (-8, -70, 9), (30, -140, 8), (4, 40, 8), (-2, 80, 9), (6, 120, 8)])}
  <path d="M-84 222 Q-60 140 0 130 Q60 140 84 222 Z" fill="#3a3070"/>
  {''.join(f'<path d="{star(x, y, s, 4, 0.3)}" fill="#f2d27a"/>' for x, y, s in [(-40, 196, 10), (0, 166, 12), (36, 192, 10)])}
  <path d="M-96 -222 Q-96 -60 -12 0 Q-96 60 -96 222 M96 222 Q96 60 12 0 Q96 -60 96 -222" {O(7)}/>
  <path d="M-70 -200 Q-74 -120 -40 -60" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.7"/>
 </g>"""
    return bg + f'<g filter="url(#ink)">{stars}{glass}</g>'


def silver_lie():
    bg = swirl(620, 290, "#2a2236", "#4a3d5e", 2.4)
    mirror = f"""
 <g transform="translate(640 270) rotate(-14)">
  <rect x="-20" y="200" width="40" height="260" rx="10" fill="#3b2c3e"/><rect x="-20" y="200" width="40" height="260" rx="10" {O(6)}/>
  <ellipse cx="0" cy="0" rx="180" ry="210" fill="#d6ad52"/><ellipse cx="0" cy="0" rx="180" ry="210" {O(8)}/>
  <ellipse cx="0" cy="0" rx="150" ry="180" fill="#d8dceb"/><path d="M60 -160 A150 180 0 0 1 60 160 A120 170 0 0 0 60 -160 Z" fill="#a7acc4"/>
  <ellipse cx="0" cy="0" rx="150" ry="180" {O(5)}/>
  <path d="M-36 -74 H56 V-6 Q56 62 10 90 Q-36 62 -36 -6 Z" fill="#c64a3a"/><path d="M10 -74 H56 V-6 Q56 62 10 90 Z" fill="#8a2a20"/>
  <path d="M-36 -74 H56 V-6 Q56 62 10 90 Q-36 62 -36 -6 Z" {O(6)}/><path d="M10 -64 V80 M-28 -10 H48" stroke="#d6ad52" stroke-width="8"/>
  <path d="M-70 -130 L-20 -40 L-80 30 L-46 140 M-20 -40 L60 -90 L116 -150 M-80 30 L-150 44 M60 -90 L124 10 L100 130" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M-70 -130 L-20 -40 L-80 30 L-46 140 M-20 -40 L60 -90 L116 -150 M-80 30 L-150 44 M60 -90 L124 10 L100 130" {S(3)}/>
  <path d="M-110 -120 Q-130 -60 -116 0" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8"/>
 </g>"""
    ghost = (f'<path d="M110 200 H220 V280 Q220 350 165 384 Q110 350 110 280 Z" fill="none" stroke="#e0d4ee" stroke-width="6" stroke-dasharray="14 12"/>'
             + stroke(line_pts(230, 300, 480, 260, -0.15), 50, 16, "#b9a3d6", 0.8))
    return bg + f'<g filter="url(#ink)">{ghost}{mirror}</g>'


def strike_the_ring():
    bg = rays(560, 240, "#6a4a14", "#a3761e", 26, 0, 0.45)
    cols = [COURSE[c] for c in ("fire", "lightning", "toxin", "water", "void")]
    rings = "".join(stroke(arc_pts(560, 230, 210 + i * 56, 196, 344), 30, 24, c, 1) + stroke(arc_pts(560, 230, 210 + i * 56, 18, 162), 20, 16, c, 0.8) for i, c in enumerate(cols))
    bell = f"""
 <path d="M560 50 Q494 50 480 130 Q464 260 392 334 Q384 356 414 362 H706 Q736 356 728 334 Q656 260 640 130 Q626 50 560 50 Z" fill="#d6ad52"/>
 <path d="M604 62 Q628 80 640 130 Q656 260 728 334 Q736 356 706 362 H606 Q648 250 604 62 Z" fill="#9c7428"/>
 <path d="M560 50 Q494 50 480 130 Q464 260 392 334 Q384 356 414 362 H706 Q736 356 728 334 Q656 260 640 130 Q626 50 560 50 Z" {O(8)}/>
 <path d="M406 334 H714 M474 176 Q560 194 646 176 M466 206 Q560 224 654 206" {O(5)}/>
 <path d="M536 50 Q536 18 560 18 Q584 18 584 50" {O(8)}/>
 <circle cx="560" cy="386" r="28" fill="{INK}"/>
 <path d="M516 110 Q504 200 460 290" stroke="#fff6dc" stroke-width="9" stroke-linecap="round" fill="none"/>"""
    strike = (f'<path d="{burst(744, 300, 30, 110, 9, 9)}" fill="#fff6dc"/><path d="{burst(744, 300, 30, 110, 9, 9)}" {O(5)}/>'
              + sparks([(860, 220, 20, 10), (820, 420, 16, 30), (690, 180, 12, 0)]))
    brush = stroke(line_pts(1130, 600, 760, 310, 0.1, 40), 10, 70, INK, 0.95)
    return bg + f'<g filter="url(#ink)">{rings}{bell}{brush}{strike}</g>'


# ------------------------------------------------------------------ the company itself (StS2's character cards)
PARTY = os.environ.get("PARTY", "/home/claude/party")
FIG = {"bulwark": ("dirAC", "bulwark"), "duelist": ("dirAC", "duelist"), "elementalist": ("dirAC", "elementalist"),
       "alchemist": ("dirAC2", "alchemist"), "oracle": ("dirAC2", "oracle"), "hexweaver": ("dirAC2", "hexweaver")}


def figure(who, pose, at, joint="torso", sc=1.0):
    """The calling's Living Ink figure, posed as vector and placed so `joint` lands on `at`."""
    import subprocess, base64, json as js
    mod, key = FIG[who]
    tmp = os.path.join(OUT, f"_fig_{who}.svg")
    meta = js.loads(subprocess.run(["node", "card_figure.js", mod, key, js.dumps(pose), tmp], cwd=PARTY, capture_output=True, text=True, check=True).stdout)
    P, W0, H0 = meta["pad"], meta["W"], meta["H"]
    jx, jy = meta["joints"][joint]
    b64 = base64.b64encode(open(tmp, "rb").read()).decode()
    x, y = at[0] - (jx + P) * sc, at[1] - (jy + P) * sc
    return f'<image href="data:image/svg+xml;base64,{b64}" x="{x:.0f}" y="{y:.0f}" width="{(W0 + 2 * P) * sc:.0f}" height="{(H0 + 2 * P) * sc:.0f}"/>'


def f_mace_blow():
    hx, hy = 880, 200
    bg = rays(hx, hy, "#5a3a26", "#a0603c", 20, 8)
    arcs = "".join(stroke(arc_pts(440, 520, r, -96, -36), 22 - i * 6, 12 - i * 3, INK, 0.75 - i * 0.2) for i, r in enumerate([470, 420, 370]))
    imp = (f'<path d="{burst(hx, hy, 40, 150, 9, 3)}" fill="{RUB}" opacity="0.92"/><path d="{burst(hx, hy, 40, 150, 9, 3)}" {O(6)}/>'
           f'<path d="{burst(hx, hy, 18, 62, 7, 5)}" fill="{PAPER}"/>'
           + "".join(f'<path d="{star(x, y, r, 3, 0.4, a)}" fill="{INK}"/>' for x, y, r, a in [(1050, 290, 16, 10), (1010, 80, 12, 30), (1080, 190, 10, 20), (960, 360, 10, 0)]))
    fig = figure("bulwark", {"upperarm_n": -40, "forearm_n": -20, "hand_n": 70, "torso": 6, "lean": 4}, (380, 470), "torso", 1.25)
    return bg + f'<g filter="url(#ink)">{arcs}{imp}</g>{fig}'


def f_two_step():
    bg = swirl(860, 300, "#5a2a26", "#a05a4c", 2.6)
    fig = figure("duelist", {"upperarm_n": -62, "forearm_n": -6, "hand_n": -8, "torso": 10, "lean": 9, "cape": -14}, (330, 420), "torso", 1.2)
    cuts = (stroke(line_pts(700, 110, 1080, 470, 0.14), 56, 30, RUB, 0.95) + stroke(line_pts(720, 500, 1070, 90, -0.14), 50, 26, RUB, 0.95)
            + stroke(line_pts(712, 124, 1068, 462, 0.14), 8, 4, INK, 0.9) + stroke(line_pts(732, 490, 1060, 100, -0.14), 7, 4, INK, 0.9))
    return bg + fig + f'<g filter="url(#ink)">{cuts}</g>'


def f_ink_bolt():
    col = COURSE["void"]
    bg = rays(330, 260, "#3a3046", "#8e7aa6", 18, 0)
    fig = figure("elementalist", {"upperarm_n": -95, "forearm_n": 55, "hand_n": 20, "torso": 8, "lean": 5}, (300, 500), "torso", 1.15)
    trail = (stroke(line_pts(560, 130, 1000, 330, -0.24, 40), 6, 40, INK, 0.95)
             + f'<circle cx="1010" cy="330" r="34" fill="{INK}"/>'
             + "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}"/>' for x, y, r in [(1062, 296, 12), (1076, 360, 9), (980, 380, 8), (1050, 400, 6), (1090, 320, 5)])
             + "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}" opacity="0.8"/>' for x, y, r in [(650, 110, 8), (780, 150, 6), (890, 220, 7)]))
    return bg + fig + f'<g filter="url(#ink)">{trail}</g>'


def f_brace():
    bg = rays(700, 330, "#4a3a2a", "#8a6a46", 22, 4)
    arcs = "".join(stroke(arc_pts(560, 360, 260 + i * 40, -58, 58), 26 - i * 6, 26 - i * 6, c, 0.9) for i, c in enumerate([INK, "#8a6a46", INK]))
    fig = figure("bulwark", {"upperarm_n": -10, "torso": -4, "lean": -3}, (380, 420), "torso", 1.15)
    return bg + fig + f'<g filter="url(#ink)">{arcs}</g>'


ART = {"bw_mace_blow": f_mace_blow, "du_two_step": f_two_step, "el_ink_bolt": f_ink_bolt, "bw_brace": f_brace,
       "al_plague_flask": plague_flask, "or_stolen_hour": stolen_hour, "silver_lie": silver_lie, "el_strike_the_ring": strike_the_ring}

# the earlier saturated devices, brought to the game's inks
TONE = {"#e04a3a": RUB, "#ffd9c0": PAPER, "#a6d36a": "#a4bb7c", "#86b552": "#8aa266", "#7fb04a": "#8aa66a", "#4c7a2c": "#56703e",
        "#1e3a1a": "#2f3a24", "#3f6a2a": "#62804f", "#3a3070": "#4a3e66", "#f2d27a": "#d9bd78", "#c8d4ec": "#c9cfd6",
        "#d8dceb": "#d9d8cf", "#a7acc4": "#a3a49e", "#c64a3a": RUB, "#8a2a20": "#6a2418", "#d6ad52": "#c9a24a", "#9c7428": "#8a6a2e",
        "#fff6dc": PAPER, "#b9a3d6": "#8e7aa6", "#e0d4ee": "#d8cfe0", '"#fff"': '"#f3e8cf"', "#dff0c0": "#e6ecd0",
        "#7a2a1c": "#6a3a2a", "#a8442c": "#9c5a40", "#3a1018": "#4a2a28", "#6e1c26": "#8a4a40", "#1c1630": "#2e2840", "#2c2448": "#6d5a8a",
        "#2a2236": "#3a3046", "#4a3d5e": "#8e7aa6", "#6a4a14": "#6a5228", "#a3761e": "#a9822f", "#a0704a": "#8a6446", "#6a4428": "#5a3c24"}


def main():
    ids = [a for a in sys.argv[1:] if a in ART] or list(ART)
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": Wd, "height": Ht})
        for i, k in enumerate(ids):
            body = ART[k]()
            for a_, b_ in TONE.items():
                body = body.replace(a_, b_)
            svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{Wd}" height="{Ht}" viewBox="0 0 {Wd} {Ht}">{defs(3 + i)}{body}{finish()}</svg>'
            open(os.path.join(OUT, k + ".svg"), "w").write(svg)
            pg.set_content(f'<html><body style="margin:0">{svg}</body></html>')
            pg.screenshot(path=os.path.join(OUT, k + "_full.png"))
        b.close()
    from PIL import Image
    for k in ids:
        Image.open(os.path.join(OUT, k + "_full.png")).convert("RGB").resize((560, 306), Image.LANCZOS).save(os.path.join(OUT, k + ".jpg"), quality=88)
    sheet = Image.new("RGB", (1120 + 12, ((len(ids) + 1) // 2) * 312 + 6), (30, 22, 16))
    for i, k in enumerate(ids):
        sheet.paste(Image.open(os.path.join(OUT, k + ".jpg")), (6 + (i % 2) * 566, 6 + (i // 2) * 312))
    sheet.save(os.path.join(OUT, "contact.jpg"), quality=88)
    print("emblems:", len(ids), "->", OUT)


if __name__ == "__main__":
    main()
