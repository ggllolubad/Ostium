"""Builds the Gate 3 review sheets (one HTML page) from build/data_v3/ and the card art.
Usage: python3 tools/content/v3/sheets.py [--art]   -> build/sheets/ostium_sheets.html"""
import base64, io, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
D = os.path.join(ROOT, "build", "data_v3")
cards = json.load(open(os.path.join(D, "cards.json")))
heroes = json.load(open(os.path.join(D, "heroes.json")))
cre = json.load(open(os.path.join(D, "creatures.json")))
enc = json.load(open(os.path.join(D, "encounters.json")))
needs = json.load(open(os.path.join(D, "needs.json")))
worlds = json.load(open(os.path.join(ROOT, "data", "worlds.json")))
coms = json.load(open(os.path.join(HERE, "commissions_src.json")))

KEEP = ("name", "cost", "rarity", "target", "text", "cls", "use", "hit", "cat", "kw", "sub", "flavour", "note", "arch", "world", "rite")
C = {}
for k, v in cards.items():
    c = {x: v[x] for x in KEEP if x in v}
    if "up" in v:
        c["up"] = {x: v["up"][x] for x in ("text", "cost") if x in v["up"]}
    C[k] = c
CR = {}
for k, v in cre.items():
    CR[k] = {"name": v["name"], "tier": v["tier"], "hp": v["hp"], "armor": v["armor"], "span": v["span"], "resist": v["resist"],
             "role": v.get("role", ""), "world": v["world"], "lore": v.get("lore", ""), "personality": v.get("personality", ""),
             "flags": v.get("flags", []), "intents": [[i["name"], i["kind"], i["text"]] for i in v["intents"].values()],
             "traits": [[t.get("name", ""), t.get("on", ""), t.get("text", "")] for t in v.get("traits", [])],
             "phases": [[p["at"], p["text"]] for p in v.get("phases", [])]}
EN = [{"world": e["world"], "name": e["name"], "tier": e["tier"], "enemies": e["enemies"], "room": e["room"], "idea": e.get("idea", ""),
       "desc": e.get("desc", "")} for e in enc]
H = {k: {"name": v["name"], "hp": v["hp"], "armor": v["armor"], "grit": v["grit"], "blurb": v.get("blurb", ""), "subs": v.get("subclasses", {}),
         "deck": v["deck"], "kit": v["kit"], "color": v.get("color", "6f5036")} for k, v in heroes.items()}
W = {k: {"name": v["name"], "pair": v["pair"], "conj": v["conjunction"]} for k, v in worlds.items()}
ART = {}
if "--art" in sys.argv:
    from PIL import Image
    for k, v in cards.items():
        p = os.path.join(ROOT, "assets", "art", "cards", v.get("art", k) + ".jpg")
        if k.endswith("+") or not os.path.exists(p):
            continue
        im = Image.open(p).convert("RGB").resize((240, 131), Image.LANCZOS)
        b = io.BytesIO()
        im.save(b, "JPEG", quality=62)
        ART[k] = base64.b64encode(b.getvalue()).decode()
data = {"cards": C, "creatures": CR, "encounters": EN, "heroes": H, "worlds": W, "needs": needs, "commissions": coms, "art": ART}
tpl = open(os.path.join(HERE, "sheets_template.html")).read()
out = os.path.join(ROOT, "build", "sheets")
os.makedirs(out, exist_ok=True)
html = tpl.replace("/*DATA*/", "const DATA = " + json.dumps(data, separators=(",", ":")) + ";")
open(os.path.join(out, "ostium_sheets.html"), "w").write(html)
print("sheets:", len(html) // 1024, "KB,", len(C), "cards,", len(CR), "creatures,", len(ART), "art")
