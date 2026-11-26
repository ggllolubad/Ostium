"""Visual look-alikes within a calling (LESSONS L70). Usage: python3 lookalike.py <out dir> <list file>
The name-based reuse cap (L58) misses objects that look the same under different names (weights and scales, bell and
handbell, a still and a furnace), so object cards are also clustered by what a viewer sees at card size:
  - each card's object mask (_mask.png) is cropped to its bounding box and resized to 48 x 48 (aligned silhouettes);
  - two cards are alike when that silhouette IoU is IOU_MIN or more and their mean subject hues are within HUE_MAX;
  - clusters are the connected groups of alike cards, per calling (card.cls; ~course variants count as one card).
A cluster may hold at most CAP cards, and at most CAP_RARITY cards of one rarity. Prints PASS/FAIL; exit 1 on FAIL.
A backstop to the family rule in checks.js (L70): it catches clones that the family table does not name.
"""
import os, sys, json, colorsys
import numpy as np
from PIL import Image

IOU_MIN, AR_MIN, HUE_MAX, CAP, CAP_RARITY = 0.9, 0.9, 35.0, 3, 2   # calibrated on the variety sheets: the clones the testers named (two yokes 0.97, two handbells 0.98, the weights 0.90) reach 0.9; at 0.85 round things of different kinds (an initial, an eye, a wheel, an astrolabe) chained together
out, listfile = sys.argv[1], sys.argv[2]
cards = json.load(open('/home/claude/ostium/data/cards.json'))
rows = [l.split("\t") for l in open(listfile).read().splitlines() if l.strip()]
items, seen = [], set()
for fn, cid, desc in rows:
    base = cid.split('~')[0]
    mp = os.path.join(out, "_full", fn + "_mask.png")
    if base in seen or base not in cards or not os.path.exists(mp):
        continue
    seen.add(base)
    a = np.asarray(Image.open(mp).convert("RGBA").resize((280, 153)))
    m = a[..., 3] > 128
    if m.sum() < 30:
        continue
    ys, xs = np.where(m)
    crop = Image.fromarray((m[ys.min():ys.max() + 1, xs.min():xs.max() + 1] * 255).astype(np.uint8)).resize((48, 48))
    rgb = a[..., :3][m].astype(float) / 255
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in rgb[:: max(1, len(rgb) // 400)]])
    w = hsv[:, 1] * hsv[:, 2]   # hue weighted by colourfulness; grey things have no hue to speak of
    ang = np.arctan2((np.sin(hsv[:, 0] * 2 * np.pi) * w).sum(), (np.cos(hsv[:, 0] * 2 * np.pi) * w).sum())
    sat = float(w.mean())
    ar = (xs.max() - xs.min() + 1) / (ys.max() - ys.min() + 1)
    items.append(dict(ar=ar, id=base, cls=cards[base].get('cls') or 'shared', rar=cards[base].get('rarity'), obj=desc.split()[-1], sil=np.asarray(crop) > 128, hue=(np.degrees(ang) % 360), sat=sat))
n = len(items)
par = list(range(n))
def find(i):
    while par[i] != i:
        par[i] = par[par[i]]; i = par[i]
    return i
pairs = 0
for i in range(n):
    for j in range(i + 1, n):
        a, b = items[i], items[j]
        if a['cls'] != b['cls']:
            continue
        iou = (a['sil'] & b['sil']).sum() / max(1, (a['sil'] | b['sil']).sum())
        dh = abs((a['hue'] - b['hue'] + 180) % 360 - 180)
        if iou >= IOU_MIN and min(a['ar'], b['ar']) / max(a['ar'], b['ar']) >= AR_MIN and (dh <= HUE_MAX or min(a['sat'], b['sat']) < 0.08):
            par[find(i)] = find(j); pairs += 1
groups = {}
for i in range(n):
    groups.setdefault(find(i), []).append(items[i])
bad = []
for g in groups.values():
    if len(g) < 2:
        continue
    rar = {}
    for it in g:
        rar[it['rar']] = rar.get(it['rar'], 0) + 1
    if len(g) > CAP or max(rar.values()) > CAP_RARITY:
        bad.append(f"{g[0]['cls']} [{len(g)}: " + ", ".join(f"{it['id']} {it['obj']}" for it in g) + "]")
big = sorted((len(g) for g in groups.values()), reverse=True)[:5]
print(f"INFO  L70  {n} object cards, {pairs} alike pairs (aligned silhouette IoU {IOU_MIN}+, hue within {HUE_MAX:.0f}); largest clusters {big}")
if bad:
    print(f"FAIL  L70  look-alike clusters over {CAP} cards, or over {CAP_RARITY} of one rarity: " + "; ".join(bad))
    sys.exit(1)
print(f"PASS  L70  no look-alike cluster over {CAP} cards or {CAP_RARITY} of one rarity in a calling")
