"""Copies rig layers into the game: enemies get the grim grade; writes data/rigs/<name>.json."""
import json, os, glob, shutil
import numpy as np
from PIL import Image, ImageEnhance
GAME = "/home/claude/ostium"
HEROES = {"bulwark", "duelist", "elementalist", "alchemist", "oracle", "hexweaver"}
def grade(im, strength=0.8):
    a = np.asarray(im.convert("RGBA")).astype(np.float32)
    h, w = a.shape[:2]
    rgb = a[..., :3]
    lum = rgb.mean(axis=2, keepdims=True)
    rgb = lum + (rgb - lum) * (1 - 0.18 * strength)          # desaturate
    rgb = (rgb - 128) * (1 + 0.16 * strength) + 128            # contrast
    yy = np.linspace(0, 1, h)[:, None]; xx = np.linspace(0, 1, w)[None, :]
    shade = 1 - strength * (70 / 255 * np.clip((yy - 0.45) / 0.55, 0, 1) + 30 / 255 * xx)
    rgb = rgb * shade[..., None]
    a[..., :3] = np.clip(rgb, 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")
os.makedirs(f"{GAME}/data/rigs", exist_ok=True)
for rj in glob.glob("grim/rig/*.rig.json"):
    name = os.path.basename(rj)[:-9]
    rig = json.load(open(rj))
    out = f"{GAME}/assets/art/rigs/{name}"
    os.makedirs(out, exist_ok=True)
    for l in rig["layers"]:
        src = f"grim/rig/{name}__{l['name']}.png"
        im = Image.open(src)
        if name not in HEROES:
            im = grade(im)
        bb = im.getbbox()
        l["empty"] = bb is None
        im.save(f"{out}/{l['name']}.png", optimize=True)
    full = Image.open(f"grim/rig/{name}.png")
    if name not in HEROES:
        full = grade(full)
    full.save(f"{out}/full.png", optimize=True)
    json.dump(rig, open(f"{GAME}/data/rigs/{name}.json", "w"))
    print(name, [l["name"] for l in rig["layers"]])
