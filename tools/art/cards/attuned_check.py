"""Attuned variants read apart (LESSONS L60). Usage: python3 attuned_check.py <out dir> <list file>
For every card rendered in its course variants (ids <id>~<course> in the list), the six variants must differ pairwise
at the game's art size (162 x 86) in the colour of the ink or of the ground:
  ground = the median colour of the card (CIELAB);
  ink    = the mean colour of the card's most chromatic 4% of pixels (the course ink and its marks);
  a pair differs when the larger of the two CIE76 distances (ground, ink) is at least DE_MIN.
Calibrated on el_ink_bolt, el_heavy_pour (heroes) and el_scatter_ink (object), see LESSONS L60.
L61 (an element is a shape, not a hue): the variants must also differ in greyscale, as a whole card and in the FX layer
alone (<fn>_fx.png, the .cfx groups render.js captures): band-pass distance (as herosim.py B) of each, at 64 x 35 from the
162 x 86 copy, at least GREY_MIN and FX_MIN. A recolour passes L60 and fails here.
Prints PASS/FAIL; exit 1 on any FAIL. Also writes <out>/attuned_strips.jpg: each card's six variants side by side.
"""
import os, sys, re
import numpy as np
from PIL import Image, ImageDraw

DE_MIN = 12.0
GREY_MIN, FX_MIN = 0.12, 0.33   # calibrated in L61: a recolour's FX layers fall to 0.06; element shapes keep 0.28 and up
from scipy.ndimage import gaussian_filter


def bandpass(a):
    h = a - gaussian_filter(a, 6, mode="reflect")
    return (h - h.mean()) / (h.std() + 1e-6)


def grey64(im):
    return np.asarray(im.convert("L").resize((64, 35), Image.LANCZOS)).astype(float)
out, listfile = sys.argv[1], sys.argv[2]
rows = [l.split("\t") for l in open(listfile).read().splitlines() if l.strip()]
VAR = re.compile(r"^(.+)~(fire|frost|lightning|water|toxin|void)$")


def lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


groups = {}
for fn, cid, desc in rows:
    m = VAR.match(cid)
    if m:
        groups.setdefault(m.group(1), {})[m.group(2)] = fn
lines, bad, strips, gbad, greys = [], [], [], [], []
for base, vs in sorted(groups.items()):
    D = {}
    for course, fn in vs.items():
        im = Image.open(os.path.join(out, "_full", fn + ".png")).convert("RGB").resize((162, 86), Image.LANCZOS)
        L = lab(np.asarray(im).astype(float)).reshape(-1, 3)
        chroma = np.hypot(L[:, 1], L[:, 2])
        top = L[chroma >= np.percentile(chroma, 96)]
        fxp = os.path.join(out, "_full", fn + "_fx.png")
        fx = None
        if os.path.exists(fxp):
            fa = Image.open(fxp).convert("RGBA").resize((162, 86), Image.LANCZOS)
            arr = np.asarray(fa).astype(float)
            if arr[..., 3].mean() > 1:
                lum = (0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]) * arr[..., 3] / 255 + 128 * (1 - arr[..., 3] / 255)
                fx = bandpass(np.asarray(Image.fromarray(lum.astype(np.uint8)).resize((64, 35), Image.LANCZOS)).astype(float))
        D[course] = (np.median(L, 0), top.mean(0), im, bandpass(grey64(im)), fx)
    cs = sorted(D)
    worst = (1e9, "")
    for i in range(len(cs)):
        for j in range(i + 1, len(cs)):
            a, b = D[cs[i]], D[cs[j]]
            d = max(np.linalg.norm(a[0] - b[0]), np.linalg.norm(a[1] - b[1]))
            if d < worst[0]:
                worst = (d, f"{cs[i]}/{cs[j]}")
            if d < DE_MIN:
                bad.append(f"{base} {cs[i]}/{cs[j]} {d:.1f}")
            g = 1 - float((a[3] * b[3]).mean())
            fxd = 1 - float((a[4] * b[4]).mean()) if a[4] is not None and b[4] is not None else None
            greys.append((base, cs[i], cs[j], g, fxd))
            if (fxd is not None and fxd < FX_MIN) or (fxd is None and g < GREY_MIN):   # the FX layer where there is one (heroes), the whole card otherwise (objects)
                gbad.append(f"{base} {cs[i]}/{cs[j]} grey {g:.2f}" + (f" fx {fxd:.2f}" if fxd is not None else ""))
    lines.append(f"INFO  L60  {base}: {len(cs)} variants, closest pair {worst[1]} at {worst[0]:.1f}")
    strips.append((base, [(c, D[c][2]) for c in cs]))
if not groups:
    lines.append("PASS  L60  no attuned variants in this batch")
elif bad:
    lines.append(f"FAIL  L60  attuned variants too alike in ink and ground (CIE76 under {DE_MIN}): " + ", ".join(bad))
else:
    lines.append(f"PASS  L60  every attuned card's variants differ pairwise in ink or ground by {DE_MIN} or more")
if groups:
    gs = [x[3] for x in greys]; fs = [x[4] for x in greys if x[4] is not None]
    lines.append(f"INFO  L61  greyscale distances: card min {min(gs):.2f} median {np.median(gs):.2f}" + (f"; FX layer min {min(fs):.2f} median {np.median(fs):.2f}" if fs else "; no FX layers"))
    lines.append((f"FAIL  L61  variants alike in greyscale (FX layer under {FX_MIN}; whole card under {GREY_MIN} where a card has no FX layer): " + ", ".join(gbad)) if gbad else f"PASS  L61  every pair of variants differs in greyscale (FX layer {FX_MIN} or more; whole card {GREY_MIN} where there is no FX layer)")
if strips:
    S = Image.new("RGB", (6 * 170 + 8, len(strips) * 112 + 8), (24, 20, 16))
    d = ImageDraw.Draw(S)
    for k, (base, vs) in enumerate(strips):
        for i, (c, im) in enumerate(vs):
            S.paste(im, (8 + i * 170, 8 + k * 112))
            d.text((10 + i * 170, 96 + k * 112), f"{base} {c}", fill=(236, 226, 200))
    S.save(os.path.join(out, "attuned_strips.jpg"), quality=92)
print("\n".join(lines))
sys.exit(1 if (bad or gbad) else 0)
