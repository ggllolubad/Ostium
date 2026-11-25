"""Downscale rendered cards (1120x612) to the card art size (560x306) and build a contact sheet.
Usage: python3 downscale.py <out dir> <list file> samples|sheet
  samples: contact.jpg holds the eight samples, two across, as before.
  sheet:   contact.jpg holds every card in the list, four across, each labelled with its id and composition."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

out, listfile, mode = sys.argv[1], sys.argv[2], sys.argv[3]
rows = [l.split("\t") for l in open(listfile).read().splitlines() if l.strip()]
for fn, cid, desc in rows:
    im = Image.open(os.path.join(out, "_full", fn + ".png")).convert("RGB")
    im.resize((560, 306), Image.LANCZOS).save(os.path.join(out, fn + ".jpg"), quality=90)
if mode == "samples":
    SAMPLES = ["bw_mace_blow", "du_two_step", "el_ink_bolt", "bw_brace", "al_plague_flask", "or_stolen_hour", "silver_lie", "el_strike_the_ring"]
    have = [k for k in SAMPLES if os.path.exists(os.path.join(out, k + ".jpg"))]
    sheet = Image.new("RGB", (560 * 2 + 18, ((len(have) + 1) // 2) * 312 + 6), (24, 18, 13))
    for i, k in enumerate(have):
        sheet.paste(Image.open(os.path.join(out, k + ".jpg")), (6 + (i % 2) * 566, 6 + (i // 2) * 312))
else:
    cols, tw, th, lab = 4, 420, 230, 30
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 15)
    except Exception:
        font = ImageFont.load_default()
    sheet = Image.new("RGB", (cols * (tw + 8) + 8, ((len(rows) + cols - 1) // cols) * (th + lab + 8) + 8), (24, 18, 13))
    dr = ImageDraw.Draw(sheet)
    for i, (fn, cid, desc) in enumerate(rows):
        x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + lab + 8)
        sheet.paste(Image.open(os.path.join(out, fn + ".jpg")).resize((tw, th), Image.LANCZOS), (x, y))
        dr.text((x + 2, y + th + 6), (cid + "  " + desc)[:58], fill=(220, 205, 175), font=font)
sheet.save(os.path.join(out, "contact.jpg"), quality=90)
print("cards:", len(rows), "contact:", mode)
