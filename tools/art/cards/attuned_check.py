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
import os, sys, re, json
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
if groups and greys:   # a batch with one variant per card (the 12-card sheet) has no pairs to compare
    gs = [x[3] for x in greys]; fs = [x[4] for x in greys if x[4] is not None]
    lines.append(f"INFO  L61  greyscale distances: card min {min(gs):.2f} median {np.median(gs):.2f}" + (f"; FX layer min {min(fs):.2f} median {np.median(fs):.2f}" if fs else "; no FX layers"))
    lines.append((f"FAIL  L61  variants alike in greyscale (FX layer under {FX_MIN}; whole card under {GREY_MIN} where a card has no FX layer): " + ", ".join(gbad)) if gbad else f"PASS  L61  every pair of variants differs in greyscale (FX layer {FX_MIN} or more; whole card {GREY_MIN} where there is no FX layer)")
# L61 size: on a cast hero card the element FX layer takes about a fifth of the frame (Cole: 15 to 25%), so the element
# reads at 162 x 86 (alpha over 40 at that size; the layer includes the stroke, the impact and the course marks)
COVER = (0.15, 0.30)
cov = []
for fn, cid, desc in rows:
    fxp = os.path.join(out, "_full", fn + "_fx.png")
    if desc.split()[0] != "cast" or not os.path.exists(fxp):
        continue
    a = np.asarray(Image.open(fxp).convert("RGBA").resize((162, 86), Image.LANCZOS))[..., 3]
    cov.append((cid, float((a > 40).mean())))
if cov:
    v = [c for _, c in cov]
    lines.append(f"INFO  L61  element FX cover on {len(cov)} cast cards: min {min(v):.2f} median {np.median(v):.2f} max {max(v):.2f}")
    off = [f"{c} {x:.2f}" for c, x in cov if not COVER[0] <= x <= COVER[1]]
    if "--fxscale" in sys.argv:   # feed the measured cover back: a per-card size factor toward 21% (hero_comp.js reads it)
        fp = sys.argv[sys.argv.index("--fxscale") + 1]
        try:
            fac = json.load(open(fp))
        except Exception:
            fac = {}
        for c, x in cov:
            if not COVER[0] <= x <= COVER[1]:
                fac[c] = round(float(np.clip(fac.get(c, 1.0) * (0.21 / max(x, 0.02)) ** 0.5, 0.6, 2.4)), 3)
        json.dump(fac, open(fp, "w"), indent=0)
        lines.append(f"INFO  L61  {len(fac)} cards carry a measured FX size factor ({fp})")
    if off:
        gbad.append("size")
        lines.append(f"FAIL  L61  element FX outside {COVER[0]:.0%} to {COVER[1]:.0%} of the frame: " + ", ".join(off))
    else:
        lines.append(f"PASS  L61  every cast card's element FX covers {COVER[0]:.0%} to {COVER[1]:.0%} of the frame")
# L61 symmetry: an element impact is never a clean emblem (rule 8). Its main mass (<fn>_imp.png, closed, specks dropped)
# must not match itself flipped left to right or top to bottom, turned half a turn, or turned by 360/n (n 3 to 12, a
# starburst's own symmetry) at IoU SYM_MAX or more. Void is exempt: its bored hole is an ellipse by rule (D.hole).
# Calibrated (L61): it fails a billow-row toxin cloud (0.75) and passes every redrawn impact (0.49 or less). It does not
# catch the first picket fire (0.52) or the first starburst frost (0.40): those were caught by eye, so it is a floor only.
SYM_MAX = 0.7
import json as _json
_CARDS = _json.load(open("/home/claude/ostium/data/cards.json"))
def course_of_card(cid):   # the variant's course, else the card's own (attuned base cards are fire)
    m1 = VAR.match(cid)
    if m1:
        return m1.group(2)
    c = _CARDS.get(cid, {})
    return "fire" if c.get("cat") == "attuned" else c.get("cat")
from scipy import ndimage as nd
def main_mass(m):
    m = nd.binary_closing(m, iterations=2)
    lab, n = nd.label(m)
    if n == 0:
        return m
    sizes = nd.sum(m, lab, range(1, n + 1))
    return np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v >= 0.04 * sizes.max()])
def self_match(m):
    iou = lambda a, b: (a & b).sum() / max(1, (a | b).sum())
    ys, xs = np.where(m)
    c = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    v = {"flip": iou(c, c[:, ::-1]), "vflip": iou(c, c[::-1, :]), "half": iou(c, c[::-1, ::-1])}
    cy, cx = ys.mean(), xs.mean(); R = int(max(np.hypot(ys - cy, xs - cx).max(), 4)) + 2
    P = np.zeros((2 * R + 1, 2 * R + 1), bool); yy, xx = ys - int(round(cy)) + R, xs - int(round(cx)) + R
    ok = (yy >= 0) & (yy <= 2 * R) & (xx >= 0) & (xx <= 2 * R); P[yy[ok], xx[ok]] = True
    for k in range(3, 13):
        v[f"turn 360/{k}"] = iou(P, nd.rotate(P.astype(float), 360 / k, reshape=False, order=1) > 0.5)
    key = max(v, key=v.get)
    return v[key], key
sym = []
for fn, cid, desc in rows:
    ip = os.path.join(out, "_full", fn + "_imp.png")
    m0 = VAR.match(cid)
    if not os.path.exists(ip) or course_of_card(cid) == "void":
        continue
    m = np.asarray(Image.open(ip).convert("RGBA").getchannel("A").resize((324, 177), Image.BILINEAR)) > 100
    if m.sum() < 50:
        continue
    v, k = self_match(main_mass(m))
    sym.append((cid, v, k))
if sym:
    lines.append(f"INFO  L61  impact self-match on {len(sym)} cards: max {max(x[1] for x in sym):.2f} median {np.median([x[1] for x in sym]):.2f}")
    sb = [f"{c} {x:.2f} ({k})" for c, x, k in sym if x >= SYM_MAX]
    if sb:
        gbad.append("sym")
        lines.append(f"FAIL  L61  symmetric impacts (an emblem, not the element; IoU with a flipped or turned self {SYM_MAX} or more): " + ", ".join(sb))
    else:
        lines.append(f"PASS  L61  no element impact matches its flipped or turned self at {SYM_MAX} or more (void exempt: its hole is an ellipse by rule)")
# L61 eye-caught shapes, made checks (Cole's review of the strips; calibrated on the kept first renders):
# - fire evenness: the first fire impact was a row of even triangles (a picket fence, a crown). Over the flame masses (orange-ochre pixels of _imp.png), the top edge's peaks (3 or more) must vary in height (CV 0.25 or more) and in
#   spacing (CV 0.25 or more). The picket measured 0.21 and 0.23 and fails; the redrawn fire measures 0.28 and 0.50.
# - frost rays: the first frost impact was a starburst. Its spikes (the radial extent of the pale ice from the impact's
#   centroid, peaks of the angular profile) must vary in length (CV 0.2 or more); with 5 or more rays their angular gaps
#   must also be uneven (CV 0.3 or more). The starburst measured length CV 0.17 and fails. Its gaps were already uneven
#   (0.70), so the gap test alone would have missed it.
import json
from scipy.signal import find_peaks
CARDS = json.load(open("/home/claude/ostium/data/cards.json"))
def course_of(cid):
    m1 = VAR.match(cid)
    if m1:
        return m1.group(2)
    c = CARDS.get(cid, {})
    return "fire" if c.get("cat") == "attuned" else c.get("cat")
def rgba(f):
    return np.asarray(Image.open(f).convert("RGBA").resize((648, 354), Image.LANCZOS)).astype(float) / 255
def hue_sat(a):
    rgb = a[..., :3]; mx, mn = rgb.max(-1), rgb.min(-1)
    r_, g_, b_ = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return np.degrees(np.arctan2(np.sqrt(3) * (g_ - b_), 2 * r_ - g_ - b_)) % 360, (mx - mn) / np.maximum(mx, 1e-6), mx
def fire_even(a):
    h, sa, mx = hue_sat(a)
    m = nd.binary_opening((a[..., 3] > 0.6) & (sa > 0.4) & (mx > 0.45) & (h > 12) & (h < 58), iterations=1)
    lab, n = nd.label(nd.binary_closing(m, iterations=3))
    if n == 0:
        return None
    sz = nd.sum(m, lab, range(1, n + 1)); big = np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= 0.05 * sz.max()])   # every flame mass: a tall tongue apart from the row still counts
    cols = np.where(big.any(0))[0]; H = big.shape[0]
    base = H - np.where(big.any(1))[0].max()
    hh = np.array([(H - np.argmax(big[:, x]) - base) if big[:, x].any() else 0 for x in range(cols.min(), cols.max() + 1)], float)   # a column with no flame is height 0 (argmax of an empty column is 0, which read as the full frame)
    pk, _ = find_peaks(hh, prominence=max(3, 0.08 * hh.max()), distance=max(3, len(hh) // 25))
    if len(pk) < 3:
        return None   # no row of peaks, no picket
    return hh[pk].std() / hh[pk].mean(), np.diff(pk).std() / np.diff(pk).mean(), len(pk)
def frost_rays(a):
    h, sa, mx = hue_sat(a)
    m = nd.binary_opening((a[..., 3] > 0.6) & (mx > 0.72) & (sa < 0.25), iterations=1)
    lab, n = nd.label(nd.binary_closing(m, iterations=2))
    if n == 0:
        return None
    sizes = nd.sum(m, lab, range(1, n + 1)); keep = np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v >= 0.05 * sizes.max()])
    ys, xs = np.where(keep); cy, cx = ys.mean(), xs.mean()
    prof = np.zeros(180); np.maximum.at(prof, ((np.degrees(np.arctan2(ys - cy, xs - cx)) % 360) / 2).astype(int) % 180, np.hypot(ys - cy, xs - cx))
    prof = nd.maximum_filter1d(prof, 3, mode="wrap")
    pk, _ = find_peaks(np.concatenate([prof, prof, prof]), prominence=0.12 * prof.max(), distance=4)
    pk = pk[(pk >= 180) & (pk < 360)] - 180
    if len(pk) < 3:
        return None
    angs = np.sort(pk * 2.0); gaps = np.diff(np.concatenate([angs, [angs[0] + 360]]))
    return gaps.std() / gaps.mean(), prof[pk].std() / prof[pk].mean(), len(pk)
# - water roundness (round 10): the round-9 water impact was a crown of cones, as pointed as the frost. Over the impact's
#   main masses, the top edge's peaks (prominence 8% of the height or more) are scored by sharpness, prominence over the
#   width at half prominence. Water fails with 2 or more peaks of sharpness 1.5 or more. Calibrated on _heroes/elem_r9
#   (the cones: Heavy Pour 2 spikes at 3.7 and 4.6, Ink Bolt 2 at 4.2 and 1.7, both fail) against the curl of round 10
#   (no peak above 1.5 on either). Frost still scores 2.2 to 4.4: the shards are meant to be sharp.
from scipy.signal import peak_widths
def water_spikes(a):
    m = a[..., 3] > 0.6
    lab, n = nd.label(nd.binary_closing(m, iterations=2))
    if n == 0:
        return None
    sz = nd.sum(m, lab, range(1, n + 1)); big = np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= 0.05 * sz.max()])
    cols = np.where(big.any(0))[0]; H = big.shape[0]
    hh = np.array([(H - np.argmax(big[:, x])) if big[:, x].any() else 0 for x in range(cols.min(), cols.max() + 1)], float)
    pk, pr = find_peaks(hh, prominence=max(4, 0.08 * hh.max()))
    if not len(pk):
        return 0, 0.0
    sharp = pr["prominences"] / np.maximum(peak_widths(hh, pk, rel_height=0.5)[0], 1)
    return int((sharp >= 1.5).sum()), float(sharp.max())
# - water spray glyphs (round 12): five frayed strands fanned from one point drew a little stick figure at the wave's tip
#   (Feedback, Spectrum Bolt; the coordinator's eye). Over the pale foam and spray of a water card's FX layer, a component
#   whose skeleton has 4 or more ends and a branch point and whose strokes are thin (area over skeleton length 12 px or
#   less), and that stands as a figure would (40 px or more across, no more than 1.8 times as long as wide), is a limb-like
#   glyph and fails. Bubbles merged into a clump are wide (18 px) or small (under 40 px), and a crest with hooks hanging off
#   it is long (2.2 to 1), so they pass. Calibrated on the kept renders: it found the Feedback figure (6 ends, width 8.6),
#   the Spectrum Bolt one (5 ends, 8.3) and the object card Scatter Ink's (5 ends, 29 by 51 px).
from skimage.morphology import skeletonize
def spray_glyphs(f):
    a = np.asarray(Image.open(f).convert("RGBA")).astype(float) / 255
    rgb = a[..., :3]; mx, mn = rgb.max(-1), rgb.min(-1)
    m = (a[..., 3] > 0.6) & (mx > 0.8) & ((mx - mn) / np.maximum(mx, 1e-6) < 0.2)
    lab, n = nd.label(m, structure=np.ones((3, 3)))
    out = []
    for i in range(1, n + 1):
        c = lab == i; sz = c.sum()
        if sz < 30 or sz > 6000:
            continue
        sk = skeletonize(c); nb = nd.convolve(sk.astype(int), np.ones((3, 3)), mode="constant") - 1
        ends, br, wd = int((sk & (nb == 1)).sum()), int((sk & (nb >= 3)).sum()), sz / max(1, sk.sum())
        ys, xs = np.where(c); hh, ww = np.ptp(ys) + 1, np.ptp(xs) + 1
        if ends >= 4 and br >= 1 and wd <= 12 and max(hh, ww) >= 40 and max(hh, ww) / min(hh, ww) <= 1.8:
            out.append(f"at ({int(xs.mean())}, {int(ys.mean())}) {ends} ends")
    return out
ev, eb = [], []
for fn, cid, desc in rows:
    ip = os.path.join(out, "_full", fn + "_imp.png")
    if not os.path.exists(ip):
        continue
    co = course_of(cid)
    if co == "fire":
        v = fire_even(rgba(ip))
        if v:
            ev.append(f"{cid} fire {v[0]:.2f}/{v[1]:.2f}")
            if False and (v[0] < 0.25 or v[1] < 0.25):   # round 10: fire is a jet and a radial burst now, no row of standing flames to picket; kept as INFO (coordinator)
                eb.append(f"{cid} flame peaks even (height CV {v[0]:.2f}, spacing CV {v[1]:.2f}, {v[2]} peaks)")
    elif co == "frost":
        v = frost_rays(rgba(ip))
        if v:
            ev.append(f"{cid} frost {v[1]:.2f}/{v[0]:.2f}")
            if v[1] < 0.2 or (v[2] >= 5 and v[0] < 0.3):
                eb.append(f"{cid} ice spikes regular (length CV {v[1]:.2f}, angle gap CV {v[0]:.2f}, {v[2]} rays)")
    elif co == "water":
        fxp = os.path.join(out, "_full", fn + "_fx.png")
        g = spray_glyphs(fxp) if os.path.exists(fxp) else []
        if g:
            eb.append(f"{cid} water spray drawn as limb-like glyphs (" + "; ".join(g) + "): spray is dots and crest curls")
        v = water_spikes(rgba(ip))
        if v:
            ev.append(f"{cid} water {v[0]} spikes, max {v[1]:.1f}")
            if v[0] >= 2:
                eb.append(f"{cid} water is pointed ({v[0]} cone spikes of sharpness 1.5 or more, max {v[1]:.1f}): water is rounded")
if ev:
    lines.append(f"INFO  L61  fire, frost and water shape measures on {len(ev)} cards")
    if eb:
        gbad.append("even")
        lines.append("FAIL  L61  an emblem, not the element: " + ", ".join(eb))
    else:
        lines.append("PASS  L61  no picket-fence fire, no starburst frost, no cone-crown water (flame peaks and ice spikes vary; water is rounded)")
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
