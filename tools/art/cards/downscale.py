"""Downscale rendered cards (1120x612) to the card art size (560x306) and build a contact sheet.
Usage: python3 downscale.py <out dir> <ids...>   (the contact sheet always holds every <id>.jpg of the eight samples present)"""
import os, sys
from PIL import Image

out, ids = sys.argv[1], sys.argv[2:]
for k in ids:
    im = Image.open(os.path.join(out, "_full", k + ".png")).convert("RGB")
    im.resize((560, 306), Image.LANCZOS).save(os.path.join(out, k + ".jpg"), quality=90)
SAMPLES = ["bw_mace_blow", "du_two_step", "el_ink_bolt", "bw_brace", "al_plague_flask", "or_stolen_hour", "silver_lie", "el_strike_the_ring"]
have = [k for k in SAMPLES if os.path.exists(os.path.join(out, k + ".jpg"))]
sheet = Image.new("RGB", (560 * 2 + 18, ((len(have) + 1) // 2) * 312 + 6), (24, 18, 13))
for i, k in enumerate(have):
    sheet.paste(Image.open(os.path.join(out, k + ".jpg")), (6 + (i % 2) * 566, 6 + (i // 2) * 312))
sheet.save(os.path.join(out, "contact.jpg"), quality=90)
print("cards:", len(ids), "contact:", len(have))
