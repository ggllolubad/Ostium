"""Pixel checks after rendering (LESSONS.md L3, L14), plus the unlabelled 170 px thumbnail sheet (L8).
Usage: python3 pixchecks.py <out dir> <list file>     (prints PASS/FAIL lines; exit 1 on any FAIL)

L3 flatness: over the object mask (the #subj layer rendered alone), the share of 16 x 16 tiles whose luminance
standard deviation is under T. T and the allowed share are calibrated on the hero render rigs_li/bulwark/full.webp
(tiles of 8 px there, since the hero sprite is drawn at about half the object scale). A card fails when its flat share
exceeds the hero's share plus 0.10. Tiles darker than DARK are skipped on both (deliberate ink-black voids).
L14 hue clusters: pixels with S > 0.45 and V > 0.35, binned by hue in 30 degree bins; a bin counts when it holds more
than 0.3% of the card. Four or more counted bins fail. That spec missed the rainbow bands on ve_ink_band (translucent
bands lose saturation), so the object mask is tested too, tighter: S > 0.3, V > 0.25, a bin counts above 1% of the
mask, four or more fail (calibrated on review 3: it flags ve_ink_band, the candy bellrope, the three-hue brews and the
blue-and-ochre brine flask, and no card the reviewer passed).

Round 6 (the review-4 blind test read 38 of 66; L45 to L48), on a 280 x 153 copy:
L45 visible: the subject (object and hand, _subj.png) must stand off its ground. Mean over the frame of
  |luminance - the ground's median luminance in a 7 px ring round the subject|, inside the subject mask: at least 2.4.
  Calibrated on review 4: it fails the four cards the tester could not see (8, 27, 31, 65) and the thin misreads.
L46 mass: the object alone (_mask.png) covers at least 7% of the frame; the brush, rapier, bell rope, tongs and
  scourge (4 to 6%) read as "a stick"; every object read correctly covered more.
L47 plank: an object mask that touches both side edges (95% of the width), is 1.8 times as wide as tall and fills 40%
  of its box reads as a board (suture, wrapped arm, ink arm, gold leaf); long things (blades, staves) are exempt.
L12 pairs: two cards with the same object in one batch must differ in silhouette: mask IoU under 0.5 (review 4's
  identical pairs measured 0.61 to 0.98).
L49 (round 7) cool grounds: where the ground ring round the subject is blue or purple (hue 170 to 320, S > 0.08), the
  subject's mean luminance must differ from the ring's median by 22 or more. L45 alone passed three dark-on-dark cards
  of review 5 (13, 21, 22); this fails them, and on review 5 also flagged the birds and the hourglass (lit since).
"""
import os, sys, colorsys
import numpy as np
from PIL import Image, ImageFilter

out, listfile = sys.argv[1], sys.argv[2]
rows = [l.split("\t") for l in open(listfile).read().splitlines() if l.strip()]
HERO = "/home/claude/ostium/assets/art/rigs_li/bulwark/full.webp"
T = 5.0
DARK = 45   # near-black tiles (a bell's mouth, a hole, the gap of a door) are ink, not a flat fill: skipped on the hero and the cards alike


def flat_share(rgb, alpha, tile):
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    h, w = lum.shape
    n = flat = 0
    for y in range(0, h - tile + 1, tile):
        for x in range(0, w - tile + 1, tile):
            if alpha[y:y + tile, x:x + tile].mean() < 0.9 or lum[y:y + tile, x:x + tile].mean() < DARK:
                continue
            n += 1
            if lum[y:y + tile, x:x + tile].std() < T:
                flat += 1
    return (flat / n if n else 0.0), n


def clusters(px, S, V, A):
    if not len(px):
        return 0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in px])
    sat = hsv[(hsv[:, 1] > S) & (hsv[:, 2] > V)]
    bins = np.bincount((sat[:, 0] * 12).astype(int) % 12, minlength=12) / len(hsv) if len(sat) else np.zeros(12)
    return int((bins > A).sum())


hero = np.asarray(Image.open(HERO).convert("RGBA")).astype(float)
hero_share, _ = flat_share(hero[..., :3], hero[..., 3] / 255.0, 8)
limit = hero_share + 0.10
lines, failed = [f"INFO  L3   hero flat-tile share {hero_share:.2f} at std<{T}; limit {limit:.2f}"], False
flat_bad, hue_bad = [], []
for fn, cid, desc in rows:
    full = os.path.join(out, "_full", fn + ".png")
    mask = os.path.join(out, "_full", fn + "_mask.png")
    img = np.asarray(Image.open(full).convert("RGB")).astype(float)
    if os.path.exists(mask):
        m = np.asarray(Image.open(mask).convert("RGBA")).astype(float)[..., 3] / 255.0
        share, n = flat_share(img, m, 16)
        if n >= 8 and share > limit:
            flat_bad.append(f"{cid} {share:.2f}")
    small = np.asarray(Image.open(full).convert("RGB").resize((280, 153))).astype(float) / 255.0
    k = clusters(small.reshape(-1, 3), 0.45, 0.35, 0.003)
    if k >= 4:
        hue_bad.append(f"{cid} {k} hue clusters")
    if os.path.exists(mask):
        mm = np.asarray(Image.open(mask).convert("RGBA").resize((280, 153))).astype(float)[..., 3] > 128
        km = clusters(small[mm], 0.3, 0.25, 0.01) if mm.sum() > 50 else 0
        if km >= 4:
            hue_bad.append(f"{cid} {km} hue clusters on the object")
LONG = {"sword", "rapier", "knife", "needle", "rod", "brush", "feather", "key", "bone", "tongs", "coalpan", "splint", "stinger", "scourge", "candle", "hammer"}
vis_bad, cool_bad, mass_bad, plank_bad, masks = [], [], [], [], {}
for fn, cid, desc in rows:
    obj = desc.split()[-1] if desc.split() else ""
    full = os.path.join(out, "_full", fn + ".png")
    mp, sp = os.path.join(out, "_full", fn + "_mask.png"), os.path.join(out, "_full", fn + "_subj.png")
    if not os.path.exists(mp):
        continue
    img = np.asarray(Image.open(full).convert("RGB").resize((280, 153))).astype(float)
    lum = 0.299 * img[..., 0] + 0.587 * img[..., 1] + 0.114 * img[..., 2]
    mo = np.asarray(Image.open(mp).convert("RGBA").getchannel("A").resize((280, 153))) > 128
    sa = Image.open(sp if os.path.exists(sp) else mp).convert("RGBA").getchannel("A").resize((280, 153)).point(lambda v: 255 if v > 128 else 0)
    ms = np.asarray(sa) > 128
    ring = (np.asarray(sa.filter(ImageFilter.MaxFilter(15))) > 128) & ~ms
    g = np.median(lum[ring]) if ring.any() else lum.mean()
    vis = (np.abs(lum - g) * ms).mean()
    if vis < 2.4:
        vis_bad.append(f"{cid} {vis:.1f}")
    rgb = img[ring].mean(0) / 255 if ring.any() else img.reshape(-1, 3).mean(0) / 255
    gh, gs, gv = colorsys.rgb_to_hsv(*rgb)
    dmean = abs(lum[ms].mean() - g) if ms.any() else 0
    if 170 <= gh * 360 <= 320 and gs > 0.08 and dmean < 22:   # L49: on a cool (blue or purple) ground the subject's mean must clear the ground by 22
        cool_bad.append(f"{cid} {dmean:.0f}")
    if mo.mean() < 0.07:
        mass_bad.append(f"{cid} {mo.mean() * 100:.0f}%")
    ys, xs = np.where(mo)
    if len(xs):
        w, h = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
        if w / 280 >= 0.95 and w / h >= 1.8 and mo.sum() / (w * h) >= 0.4 and obj not in LONG:
            plank_bad.append(f"{cid} {w / h:.1f}:1")
    masks[cid] = (obj, np.asarray(Image.open(mp).convert("RGBA").getchannel("A").resize((112, 61))) > 128)
pair_bad = []
ids = list(masks)
for i in range(len(ids)):
    for j in range(i + 1, len(ids)):
        (oa, a), (ob, b) = masks[ids[i]], masks[ids[j]]
        if oa == ob:
            iou = (a & b).sum() / max(1, (a | b).sum())
            if iou >= 0.5:
                pair_bad.append(f"{ids[i]}/{ids[j]} {oa} IoU {iou:.2f}")
for lesson, bad, ok, msg in [("L45", vis_bad, "every subject stands off its ground (visible mass 2.4 or more)", "subject sinks into the ground: "),
                             ("L49", cool_bad, "every subject on a cool ground clears it by 22 in mean luminance", "dark on a dark cool ground: "),
                             ("L46", mass_bad, "every object has mass (7% of the frame or more)", "a stick, not a mass: "),
                             ("L47", plank_bad, "no plank silhouettes", "plank silhouettes: "),
                             ("L12", pair_bad, "same-object cards differ in silhouette (IoU under 0.5)", "near-identical pairs: ")]:
    if bad:
        lines.append(f"FAIL  {lesson:4s} {msg}" + ", ".join(bad)); failed = True
    else:
        lines.append(f"PASS  {lesson:4s} {ok}")
if flat_bad:
    lines.append("FAIL  L3   flatter than the hero: " + ", ".join(flat_bad)); failed = True
else:
    lines.append(f"PASS  L3   no object mask flatter than the hero (limit {limit:.2f})")
if hue_bad:
    lines.append("FAIL  L14  saturated hue clusters: " + ", ".join(hue_bad)); failed = True
else:
    lines.append("PASS  L14  no card has 4 or more saturated hue clusters, on the card or on the object")
# the unlabelled thumbnail sheet for the blind naming test (L8)
cols, tw, th = 6, 170, 93
sheet = Image.new("RGB", (cols * (tw + 6) + 6, ((len(rows) + cols - 1) // cols) * (th + 6) + 6), (20, 16, 12))
for i, (fn, cid, desc) in enumerate(rows):
    im = Image.open(os.path.join(out, "_full", fn + ".png")).convert("RGB").resize((tw, th), Image.LANCZOS)
    sheet.paste(im, (6 + (i % cols) * (tw + 6), 6 + (i // cols) * (th + 6)))
sheet.save(os.path.join(out, "thumbs170.png"))
open(os.path.join(out, "thumbs170_key.txt"), "w").write("\n".join(f"{i + 1}\t{cid}\t{desc}" for i, (fn, cid, desc) in enumerate(rows)) + "\n")
print("\n".join(lines))
sys.exit(1 if failed else 0)
