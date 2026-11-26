"""Hero card review sheets (hero-card agent, L66).
  python3 herosheet.py <out dir>                       labelled contact sheet per calling: <out>/sheets/<calling>.jpg
  python3 herosheet.py <out dir> --blind <dir> <calling> [<calling> ...] [--key <file>]
      the matching test: <dir>/sheet.png (numbered, unlabelled, at game size 162 x 86 and at 2x) and <dir>/names.txt
      (the same cards' names, shuffled); the key (number -> id, name) goes to --key, never into <dir>
Cards are read from <out>/_full/_list.txt (hero kinds only) and <out>/_full/<fn>.png.
"""
import os, sys, json, random
from PIL import Image, ImageDraw, ImageFont

out = sys.argv[1]
rows = [l.split("\t") for l in open(os.path.join(out, "_full", "_list.txt")).read().splitlines() if l.strip()]
rows = [r for r in rows if r[2].split()[0] in ("attack", "cast", "block") and "hand-made" not in r[2]]
cards = json.load(open("/home/claude/ostium/data/cards.json"))
# round 11: the test uses each card's FINAL name (docs/design/names/renames.csv, carried in hero_cues.json), the names the cues were chosen for
try:
    for cid, t in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "hero_cues.json"))).items():
        if cid in cards:
            cards[cid] = dict(cards[cid], name=t["name"])
except Exception:
    pass
alloc = {}
try:
    alloc = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "hero_alloc.json")))["cards"]
except Exception:
    pass
cal = lambda desc: desc.split()[1].split("_")[0]
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except Exception:
    font = ImageFont.load_default()


def sheet(items, cols, tw, th, label):
    rows_n = (len(items) + cols - 1) // cols
    lh = 22 if label else 0
    S = Image.new("RGB", (cols * (tw + 8) + 8, rows_n * (th + lh + 8) + 8), (24, 20, 16))
    d = ImageDraw.Draw(S)
    for i, (fn, text) in enumerate(items):
        x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + lh + 8)
        S.paste(Image.open(os.path.join(out, "_full", fn + ".png")).convert("RGB").resize((tw, th), Image.LANCZOS), (x, y))
        d.text((x + 2, y + th + 3), text, fill=(236, 226, 200), font=font)
    return S


if "--score" in sys.argv:
    # python3 herosheet.py <out> --score <answers> --key <key>: answers are lines "<number> <name>" (any separator)
    import re as _re
    key = {int(l.split("\t")[0]): l.split("\t")[2].strip() for l in open(sys.argv[sys.argv.index("--key") + 1]) if l.strip()}
    norm_ = lambda t: _re.sub(r"[^a-z]", "", t.lower())
    got = {}
    for l in open(sys.argv[sys.argv.index("--score") + 1]):
        m = _re.match(r"\s*(\d+)\W+(.+?)\s*$", l)
        if m:
            got[int(m.group(1))] = m.group(2)
    hit = [n for n in key if n in got and norm_(got[n]) == norm_(key[n])]
    miss = [f"{n}: answered '{got.get(n, '-')}', was '{key[n]}'" for n in sorted(key) if n not in hit]
    print(f"matched {len(hit)} of {len(key)} ({100 * len(hit) / len(key):.0f}%)")
    print("\n".join(miss))
    sys.exit(0)
if "--blind" not in sys.argv:
    os.makedirs(os.path.join(out, "sheets"), exist_ok=True)
    by = {}
    for fn, cid, desc in rows:
        by.setdefault(cal(desc), []).append((fn, cid))
    for c, L in sorted(by.items()):
        items = []
        for fn, cid in L:
            a = alloc.get(cid, {})
            items.append((fn, f"{cards.get(cid, {}).get('name', cid)}  ({a.get('frame', '?')}, {a.get('mech', '?')})"))
        p = os.path.join(out, "sheets", c + ".jpg")
        sheet(items, 4, 324, 177, True).save(p, quality=90)
        print(p, len(L))
else:
    i = sys.argv.index("--blind")
    keyfile = sys.argv[sys.argv.index("--key") + 1] if "--key" in sys.argv else None
    bdir, callings = sys.argv[i + 1], []
    for a in sys.argv[i + 2:]:
        if a.startswith("--"):
            break
        callings.append(a)
    sel = [(fn, cid) for fn, cid, desc in rows if cal(desc) in callings]
    rnd = random.Random(59)
    rnd.shuffle(sel)
    os.makedirs(bdir, exist_ok=True)
    items = [(fn, str(k + 1)) for k, (fn, cid) in enumerate(sel)]
    sheet(items, 6, 162, 86, True).save(os.path.join(bdir, "sheet_game_size.png"))
    sheet(items, 4, 324, 177, True).save(os.path.join(bdir, "sheet.png"))
    names = [cards[cid]["name"] for fn, cid in sel]
    rnd.shuffle(names)
    open(os.path.join(bdir, "names.txt"), "w").write("\n".join(names) + "\n")
    if keyfile:
        open(keyfile, "w").write("\n".join(f"{k + 1}\t{cid}\t{cards[cid]['name']}" for k, (fn, cid) in enumerate(sel)) + "\n")
    print(bdir, len(sel), "cards")
