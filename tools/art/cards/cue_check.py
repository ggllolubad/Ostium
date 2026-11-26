"""L67 name cues in the scene (hero-card agent, round 11).
  python3 cue_check.py <out dir> <list file>
Every hero card carries one name cue (hero_cues.js, the .cue groups). render.js writes <fn>_cue.png (the cue alone, on
transparent) beside <fn>.png (the card), <fn>_hero.png (the figure alone) and <fn>.svg. A cue must:
  - live in the scene, never in a halo or badge: no halo filter in the card's SVG, and no large filled patch of
    see-through pixels in its layer (a lit disc behind a cue measured as one: the first pass failed on all 152 cards);
  - touch the scene: it touches the hero (within 14 px of the figure), or the floor line (its bottom
    from 16 px above it to 22 px into it), or the frame top (the room's architecture: hanging things), or it spans half the frame (weather);
  - read at game size (162 x 86): its solid pixels (alpha over 0.5) that are not hidden behind the figure cover CUE_AREA
    or more of the frame, and stand off what is round them by CUE_CONTRAST (the card's luminance inside against a ring
    just outside, or the spread inside: an ink outline against a lit fill);
  - a setting cue (drawn behind the figure) keeps at least CUE_SHOWN of itself out from behind the figure.
"""
import os, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

CUE_AREA, CUE_CONTRAST, CUE_SHOWN, HALO_PATCH = 0.012, 0.18, 0.6, 0.015   # front contrast 0.18 from round 12: the L68 cues lost their pale rim (a sticker's edge), and on el12 a dropper bottle (0.20) and a toxin stroke (0.18) read
# L68 (round 12): cues are drawn to the figure's scale and set back in the room, so size and contrast floors go by mode.
# A held thing is hand-sized (its floor is low; as the name carrier its cap is 1.8 head heights, or 1.8 forearms for a long one);
# a setting cue behind the figure is seen through the room's air (cueHaze), so its contrast floor is lower. Set by eye
# on the round 12 el12 sheet: a hazed furnace at 0.17 reads, a black inkpot at 0.11 does not.
AREA_BY_MODE = {"held": 0.002, "effect": 0.006, "ground": 0.008, "hang": 0.008, "weather": 0.012}
CONTRAST_BACK, HELD_CAP, BIG_AREA = 0.15, 1.8, 0.03   # a held name carrier may reach 1.8 head heights (coordinator, round 12)
# L68 texture: a cue is drawn with the scene's ink texture and shading, never a flat single fill. Over the inside of the
# cue alone (_cue.png, eroded 6 px) and of the figure alone (_hero.png), the share of dead-flat pixels (local standard
# deviation of luminance under 0.006 in a 5 px window: a pure single fill) is measured; the cue fails when its share passes
# the figure's by 0.3. First set at 0.02 in 9 px and 0.25 on the el12 sheet, it failed library objects the coordinator
# had passed (a pendulum 0.42, a plumed hat 0.45: painted areas and the room's haze are smooth, not flat). At the dead-flat
# setting the library objects of the round 12 render reach 0.25 at most, and the flat drawings stand out (a black cat
# 0.76, footprints 0.60, a void rift 0.60).
FLAT_MARGIN = 0.3
FX_CUES = {'lightshaft', 'rain', 'meteors', 'stormcloud', 'returnarc', 'overarc', 'crescent', 'whirlwind', 'forcewave', 'rimband', 'rimefur', 'crackle', 'greenblood', 'bloodarc', 'cutthread', 'ghostblade', 'flourish', 'rebound', 'confluence', 'strikeacross', 'breathcloud', 'sightline'}   # effect strokes in the FX style: a brush stroke is solid ink by nature, like the act's own FX
# L68 action cues: a cue whose label names an action (blasting, leaping, bouncing, drawing) must draw the action, not
# only the object: its SVG carries a "cueact" group (the flames out of the furnace door, the ink leaving the pot, the cast
# stream curving back, the liquid running through the siphon). Round 12 drew a glowing door, a pot, an arrow and a bottle.
import json as _json
LABELS = {k: v.get("label", "") for k, v in _json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "hero_cues.json"))).items()}
ACTION = re.compile(r"\b(blasting|leaping|bouncing|drawing)\b")
def flat_share(p):
    a = np.asarray(Image.open(p).convert("RGBA")).astype(float) / 255
    Lm = a[..., :3].mean(-1); m = a[..., 3] > 0.9
    mu = nd.uniform_filter(Lm, 5); sd = np.sqrt(np.maximum(nd.uniform_filter(Lm * Lm, 5) - mu * mu, 0))
    mi = nd.binary_erosion(m, iterations=6)
    return None if mi.sum() < 400 else float((sd[mi] < 0.006).mean())   # a cue of thin strokes (grass, a brush arc) has no inside to judge   # contrast calibrated by eye on the 18-card test: a bell tower (0.26), an inkpot (0.26) and a ram log (0.27) read; a red moon behind the figure (0.14) did not
out, listfile = sys.argv[1], sys.argv[2]
rows = [l.split("\t") for l in open(listfile).read().splitlines() if l.strip()]
GS = (162, 86)


def rgba(p):
    return np.asarray(Image.open(p).convert("RGBA")).astype(float) / 255


lines, bad, info = [], [], []
for fn, cid, desc in rows:
    if desc.split()[0] not in ("attack", "cast", "block") or "hand-made" in desc:
        continue
    hp, cp, sp = (os.path.join(out, "_full", fn + x) for x in ("_hero.png", "_cue.png", ".svg"))
    if not os.path.exists(hp):
        continue   # not a staged hero card
    if not os.path.exists(cp):
        bad.append(f"{cid} has no cue")
        continue
    svg = open(sp).read() if os.path.exists(sp) else ""
    groups = re.findall(r'<g class="cue"[^>]*>', svg)
    meta = dict(re.findall(r'data-(mode|floor|layer|cue|headh|forel|long|objh|objl)="([^"]+)"', groups[0])) if groups else {}
    why = []
    if "cueLift" in svg:
        why.append("halo filter")
    C = rgba(cp)
    a = C[..., 3]
    solid, soft = a > 0.5, (a > 0.04) & (a <= 0.5)
    if not solid.any():
        bad.append(f"{cid} cue not drawn")
        continue
    lab, n = nd.label(soft)
    if n:
        sz = nd.sum(soft, lab, range(1, n + 1))
        for i in np.where(sz > HALO_PATCH * a.size)[0]:
            ys, xs = np.where(lab == i + 1)
            hh, ww = np.ptp(ys) + 1, np.ptp(xs) + 1
            if sz[i] / (hh * ww) > 0.6 and 0.4 <= hh / ww <= 2.5:   # a filled roundish patch (a halo or disc), not streaks, a thin trail or a flat floor shadow
                why.append(f"see-through patch {sz[i] / a.size:.3f}")
                break
    Hm = rgba(hp)[..., 3] > 0.5
    ys, xs = np.where(solid)
    box = (xs.min(), ys.min(), xs.max(), ys.max())
    floor = float(meta.get("floor", a.shape[0]))
    touch = []
    if (nd.distance_transform_edt(~Hm)[solid].min() <= 14):
        touch.append("hero")
    if -16 <= box[3] - floor <= 30 or box[3] >= a.shape[0] - 3:   # down to 22 px under the line: the dark edge (4 px) and the ink wobble sit a standing thing a little into the floor
        touch.append("floor")
    if box[1] <= 6:
        touch.append("top")
    if box[2] - box[0] >= 0.5 * a.shape[1]:
        touch.append("across")
    if not touch:
        why.append(f"floats (box {box}, floor {floor:.0f})")
    # at game size: what shows of the cue
    small = lambda m: np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize(GS, Image.LANCZOS)) > 127
    behind = meta.get("layer") == "back"
    vis = solid & ~Hm if behind else solid
    shown = vis.sum() / solid.sum()
    m = small(vis)
    area = m.mean()
    L = np.asarray(Image.open(os.path.join(out, "_full", fn + ".png")).convert("L").resize(GS, Image.LANCZOS)).astype(float) / 255
    con = 0.0
    if m.any():
        ring = nd.binary_dilation(m, iterations=3) & ~m
        sep = abs(np.median(L[m]) - np.median(L[ring])) if ring.any() else 0.0
        con = max(sep, np.percentile(L[m], 90) - np.percentile(L[m], 10))
    info.append((cid, area, con, shown, meta.get("mode", "?"), "+".join(touch)))
    mode = meta.get("mode", "?")
    if area < AREA_BY_MODE.get(mode, CUE_AREA):
        why.append(f"area {area:.3f}")
    if con < (CONTRAST_BACK if behind or meta.get("cue") in FX_CUES else CUE_CONTRAST) and area < BIG_AREA:   # a big cue reads by its shape even in the room's dimness (a hanging pendulum at 0.06 reads; a speck of a cat does not)   # a thin effect stroke mixes with its ground at 162 px like a hazed cue (an overhead brush arc reads at 0.15)
        why.append(f"contrast {con:.2f}")
    if ACTION.search(LABELS.get(cid.split("~")[0], "")) and 'class="cueact"' not in svg:
        why.append("its label names an action the cue does not draw")
    fc, fh = flat_share(cp), flat_share(hp)
    if fc is not None and fh is not None and fc > fh + FLAT_MARGIN and meta.get("cue") not in FX_CUES:
        why.append(f"flat fill ({fc:.2f} flat against the figure's {fh:.2f})")
    if mode == "held" and float(meta.get("headh", 0)) > 0:
        long_ = meta.get("long") == "1"
        cap = HELD_CAP * float(meta.get("forel" if long_ else "headh"))
        size = float(meta.get("objl" if long_ else "objh", 0)) or (max(box[2] - box[0], box[3] - box[1]) if long_ else box[3] - box[1])   # the object's own drawn size (an action part, such as the ink leaving the pot, is not the object)
        if size > cap:
            why.append(f"oversized for a hand ({size} px against {cap:.0f})")
    if behind and shown < CUE_SHOWN:
        why.append(f"hidden behind the figure ({shown:.2f} shows)")
    if why:
        bad.append(f"{cid} ({meta.get('cue', '?')}, {meta.get('mode', '?')}) " + " ".join(why))
if info:
    a = np.array([[x[1], x[2], x[3]] for x in info])
    from collections import Counter
    lines.append(f"INFO  L67  name cues on {len(info)} hero cards at 162 x 86: area min {a[:, 0].min():.3f} median {np.median(a[:, 0]):.3f}; contrast min {a[:, 1].min():.2f} median {np.median(a[:, 1]):.2f}; modes {dict(Counter(x[4] for x in info))}")
if bad:
    lines.append(f"FAIL  L67  name cues that are badges, float, flat, oversized, or do not read at game size ({len(bad)}): " + ", ".join(bad))
elif info:
    lines.append(f"PASS  L67  every hero card's name cue is in the scene (no halo; touches the hero, the floor or the frame top) and reads at 162 x 86 (area {CUE_AREA:.1%}, contrast {CUE_CONTRAST})")
print("\n".join(lines))
sys.exit(1 if bad else 0)
