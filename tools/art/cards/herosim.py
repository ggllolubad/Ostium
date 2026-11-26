"""Hero card similarity within a calling (LESSONS.md L58).
Usage: python3 herosim.py <out dir> <list file> [--masks <dir>] [--report <file>]
Prints PASS/FAIL lines; exit 1 on any FAIL.

Every hero card (kinds attack, cast, block in the list file) is compared with every other hero card of its calling.
In game the art slot is about 162 x 86 px, so both measures work on a 64 x 35 grey copy.

A  silhouette: the hero figure alone (<fn>_hero.png, the figure layer rendered on transparent ground, or <dir>/<fn>.png
   with --masks), thresholded at alpha 128 at 64 x 35. Two cards of a calling fail when the IoU of their figure
   masks is SIL_MAX or more: the same figure at the same place and size reads as the same picture whatever the FX do.
   Calibrated on build/emblem2/all (2026-11-25): the ten pairs among bw_aegis_of_the_door, bw_brace, bw_close_ranks,
   bw_dig_in and bw_draw_their_eyes measure 0.76 to 1.00; different figures on the old shared template measure 0.46
   (median); 0.5 is the bar L12 already sets for same-object silhouettes.
B  picture: the full card, grey, band-passed (minus a Gaussian blur of sigma 6 at 64 x 35, which removes the light
   pool and the vignette), normalised; distance = 1 - correlation. Two cards fail under PIC_MIN. Calibrated: object
   cards that passed the blind tests (review 5 to 7, 103 cards) never come closer than 0.514 to each other; same-pose
   hero pairs of the old render sit at 0.16 (median), and 94% of them under 0.55.
A card is its own picture only when it passes both against every other hero card of its calling.
"""
import os, sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

SIZE = (64, 35)
SIL_MAX = 0.50
PIC_MIN = 0.55
HERO_KINDS = {"attack", "cast", "block"}

args = sys.argv[1:]
out, listfile = args[0], args[1]
mask_dir = args[args.index("--masks") + 1] if "--masks" in args else None
report = args[args.index("--report") + 1] if "--report" in args else None
rows = [l.split("\t") for l in open(listfile).read().splitlines() if l.strip()]


def calling(desc):
    # describe() gives "<kind> <figure key>": the calling is the figure key's first word
    p = desc.split()
    return p[1].split("_")[0] if len(p) > 1 else ""


def picture(path):
    a = np.asarray(Image.open(path).convert("L").resize(SIZE, Image.LANCZOS)).astype(float)
    h = a - gaussian_filter(a, 6, mode="reflect")
    return (h - h.mean()) / (h.std() + 1e-6)


def silhouette(path):
    return np.asarray(Image.open(path).convert("RGBA").getchannel("A").resize(SIZE, Image.BILINEAR)) > 128


cards = []
for fn, cid, desc in rows:
    if desc.split()[0] not in HERO_KINDS or "hand-made" in desc:   # hand-made ART scenes are objects, not heroes
        continue
    full = os.path.join(out, "_full", fn + ".png")
    mp = os.path.join(mask_dir, fn + ".png") if mask_dir else os.path.join(out, "_full", fn + "_hero.png")
    cards.append((cid, calling(desc), picture(full), silhouette(mp) if os.path.exists(mp) else None))

sil_bad, pic_bad, missing, near = [], [], [c[0] for c in cards if c[3] is None], {}
for i in range(len(cards)):
    for j in range(i + 1, len(cards)):
        a, b = cards[i], cards[j]
        if a[1] != b[1]:
            continue
        d = 1 - float((a[2] * b[2]).mean())
        iou = float((a[3] & b[3]).sum() / max(1, (a[3] | b[3]).sum())) if a[3] is not None and b[3] is not None else 0.0
        if iou >= SIL_MAX:
            sil_bad.append((iou, a[0], b[0]))
        if d < PIC_MIN:
            pic_bad.append((d, a[0], b[0]))
        for x, y in ((a[0], b[0]), (b[0], a[0])):   # each card's nearest partner, for the report
            if x not in near or d < near[x][0]:
                near[x] = (d, y, iou)

failing = {x for _, a, b in sil_bad + pic_bad for x in (a, b)}
by_cal = {}
for cid, cal, _, _ in cards:
    t = by_cal.setdefault(cal, [0, 0]); t[0] += 1; t[1] += cid in failing
lines = [f"INFO  L58  {len(cards)} hero cards; cards with a twin in their calling: " + ", ".join(f"{c} {f}/{n}" for c, (n, f) in sorted(by_cal.items()))]
if missing:
    lines.append(f"FAIL  L58  no hero mask for {len(missing)} cards (silhouette check needs <id>_hero.png): " + ", ".join(missing[:8]))
show = lambda L, f: ", ".join(f"{a}/{b} {v:.2f}" for v, a, b in sorted(L, key=f)[:12]) + (f" (+{len(L) - 12} more)" if len(L) > 12 else "")
if sil_bad:
    lines.append(f"FAIL  L58  same figure, same staging (silhouette IoU {SIL_MAX} or more), {len(sil_bad)} pairs: " + show(sil_bad, lambda r: -r[0]))
else:
    lines.append(f"PASS  L58  every hero pair in a calling differs in silhouette (IoU under {SIL_MAX})")
if pic_bad:
    lines.append(f"FAIL  L58  near-identical pictures (band-pass distance under {PIC_MIN}), {len(pic_bad)} pairs: " + show(pic_bad, lambda r: r[0]))
else:
    lines.append(f"PASS  L58  every hero pair in a calling differs as a picture (distance {PIC_MIN} or more)")
if report:
    with open(report, "w") as fh:
        fh.write("id\tcalling\tnearest\tdistance\tsilhouette_iou\n")
        for cid, cal, _, _ in cards:
            d, y, iou = near.get(cid, (1.0, "", 0.0))
            fh.write(f"{cid}\t{cal}\t{y}\t{d:.3f}\t{iou:.3f}\n")
print("\n".join(lines))
sys.exit(1 if (sil_bad or pic_bad or missing) else 0)
