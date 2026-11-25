"""Imports the Living Ink art (art/party pipeline output) into the game.

Rooms:  out/scenes/battle/<world>/<room>_{far,mid,fore}.png (2x of the 1480x480 battle frame)
        -> assets/art/rooms/<room>_{far,mid,fore}.webp and data/rooms/<room>.json (camera: horizon, feet line, figure scale)
Rigs:   out/rig/**/<rig>/NN_<part>.png full-canvas bone layers + rig.json
        -> assets/art/rigs_li/<key>/<layer>.webp, cropped to the ink and scaled by RS
           data/rigs_li/<key>.json: canvas, ground, flip, bones {pivot, parent}, layers [{name, bone, z, pos, size}],
           variants (swappable layers, e.g. the Elementalist's sign per element), all in the scaled space
        -> assets/art/rigs_li/<key>/full.webp, the rest pose, for portraits, the bestiary and previews

Keys: enemy keys from data/enemies.json (matched by name), heroes by calling, path variants as <calling>__<path>.
Usage: python3 tools/art/import_living_ink.py /path/to/party/out [--only key,key] [--rooms-only|--rigs-only]
"""
import json, os, re, sys, unicodedata, glob
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RS = 0.6          # rig storage scale: the battle draws rigs at 0.2971 of rig px, so this keeps about 2x detail
Q = 90            # WebP quality
HEROES = {"bulwark": "dirAC_bulwark", "duelist": "dirAC_duelist", "elementalist": "dirAC_elementalist",
          "alchemist": "dirAC2_alchemist", "hexweaver": "dirAC2_hexweaver", "oracle": "dirAC2_oracle",
          "vessel": "worlds/hero_vessel_vessel"}
ALIAS = {"thrall": "dirAC2_thrall", "cyclops_smith": "worlds/world_V_sparkblind_smith",
         "hive_queen": "worlds/world_X_hive_queen"}
ELEMENTS = ["fire", "frost", "lightning", "water", "toxin", "void"]


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower().replace("_", " ")
    s = re.sub(r"\bthe\b", "", s)
    return re.sub(r"[^a-z]", "", s)


def rig_map(out):
    src = os.path.join(ROOT, "data", "enemies.json")
    if "--creatures" in sys.argv:   # Gate 3: match against the v3 creature list (build/data_v3/creatures.json)
        src = sys.argv[sys.argv.index("--creatures") + 1]
    E = json.load(open(src))
    by = {}
    for k, v in E.items():
        by[norm(v["name"])] = k
        by[norm(k)] = k
    m = {k: os.path.join(out, "rig", d) for k, d in HEROES.items()}
    for d in sorted(os.listdir(os.path.join(out, "rig", "worlds"))):
        full = os.path.join(out, "rig", "worlds", d)
        hp = re.match(r"hero_paths_[AB]_([a-z]+)_([a-z_]+)$", d)
        if hp:
            m[f"{hp.group(1)}__{hp.group(2)}"] = full
            continue
        w = re.match(r"world_[IVX]+(?:_b)?_(?:[abc]_)?(.*)$", d)
        if not w:
            continue
        k = by.get(norm(w.group(1)))
        if k and k not in m and k not in ALIAS:
            m[k] = full
    for k, d in ALIAS.items():
        m[k] = os.path.join(out, "rig", d)
    missing = [k for k in E if k not in m]
    return m, missing


def crop_scale(im):
    bb = im.getchannel("A").getbbox()
    if not bb:
        return None, None
    x0, y0, x1, y1 = max(0, bb[0] - 2), max(0, bb[1] - 2), min(im.width, bb[2] + 2), min(im.height, bb[3] + 2)
    c = im.crop((x0, y0, x1, y1))
    w, h = max(1, round(c.width * RS)), max(1, round(c.height * RS))
    # place the scaled crop on the scaled grid: snap the origin and let the size follow
    return c.resize((w, h), Image.LANCZOS), [round(x0 * RS, 2), round(y0 * RS, 2)]


def import_rig(key, src):
    rig = json.load(open(os.path.join(src, "rig.json")))
    dst = os.path.join(ROOT, "assets", "art", "rigs_li", key)
    os.makedirs(dst, exist_ok=True)
    for f in glob.glob(os.path.join(dst, "*.webp")):
        os.remove(f)
    W, H = rig["canvas"]
    full = Image.new("RGBA", (round(W * RS), round(H * RS)))
    layers = []
    for L in rig["layers"]:
        im = Image.open(os.path.join(src, L["name"] + ".png")).convert("RGBA")
        part, pos = crop_scale(im)
        if part is None:
            continue
        part.save(os.path.join(dst, L["name"] + ".webp"), quality=Q, method=6)
        layers.append({"name": L["name"], "bone": L["bone"], "z": L["z"], "pos": pos, "size": [part.width, part.height]})
        full.alpha_composite(part, (round(pos[0]), round(pos[1])))
    bb = full.getchannel("A").getbbox()
    full.save(os.path.join(dst, "full.webp"), quality=Q, method=6)
    bones = {b: {"pivot": [round(v["pivot"][0] * RS, 2), round(v["pivot"][1] * RS, 2)], "parent": v["parent"]} for b, v in rig["bones"].items()}
    out = {"key": key, "source": os.path.relpath(src, os.path.dirname(os.path.dirname(src))), "scale": RS,
           "canvas": [round(W * RS), round(H * RS)], "ground": round(rig["ground"] * RS, 2), "flip": rig["flip"],
           "ink": list(bb) if bb else None, "bones": bones, "layers": layers}
    # swappable layer variants: the Elementalist's book and sign, one set per element
    if key == "elementalist":
        out["variants"] = {}
        base_dir = src
        for el in ELEMENTS:
            vdir = f"{base_dir}_{el}"
            if not os.path.isdir(vdir):
                continue
            vs = {}
            for L in rig["layers"]:
                a, b = os.path.join(base_dir, L["name"] + ".png"), os.path.join(vdir, L["name"] + ".png")
                if os.path.exists(b) and open(a, "rb").read() != open(b, "rb").read():
                    part, pos = crop_scale(Image.open(b).convert("RGBA"))
                    if part is None:
                        continue
                    fn = f"{L['name']}__{el}"
                    part.save(os.path.join(dst, fn + ".webp"), quality=Q, method=6)
                    vs[L["name"]] = {"file": fn, "pos": pos, "size": [part.width, part.height]}
            out["variants"][el] = vs
    os.makedirs(os.path.join(ROOT, "data", "rigs_li"), exist_ok=True)
    json.dump(out, open(os.path.join(ROOT, "data", "rigs_li", key + ".json"), "w"), indent=0)
    return len(layers)


def import_rooms(out):
    n = 0
    os.makedirs(os.path.join(ROOT, "data", "rooms"), exist_ok=True)
    for cam in sorted(glob.glob(os.path.join(out, "scenes", "battle", "*", "*.camera.json"))):
        room = os.path.basename(cam)[:-len(".camera.json")]
        d = os.path.dirname(cam)
        for layer in ("far", "mid", "fore"):
            im = Image.open(os.path.join(d, f"{room}_{layer}.png"))
            im.save(os.path.join(ROOT, "assets", "art", "rooms", f"{room}_{layer}.webp"), quality=Q, method=6)
        j = json.load(open(cam))
        j["world_dir"] = os.path.basename(d)
        json.dump(j, open(os.path.join(ROOT, "data", "rooms", room + ".json"), "w"), indent=1)
        n += 1
    return n


if __name__ == "__main__":
    out = sys.argv[1]
    only = None
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    if "--rigs-only" not in sys.argv:
        print("rooms", import_rooms(out))
    if "--rooms-only" not in sys.argv:
        m, missing = rig_map(out)
        print("rigs mapped", len(m), "enemies without art", missing)
        for k in sorted(m):
            if only and k not in only:
                continue
            print(k, import_rig(k, m[k]), flush=True)
