"""Review sheet for the Living Ink garth: rows of unlit | lit for the company and for the Vessel variant, then every hotspot
state over the lit frame (hover: the game's warm lift plus the depth-tested white outline; locked: dimmed and barred).
Usage: python3 scenes/garth_sheet.py <garth_dir> <out.png>"""
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont
gd, out = sys.argv[1], sys.argv[2]
try:
    FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
except Exception:
    FONT = ImageFont.load_default()
J = json.load(open(os.path.join(gd, 'garth_hotspots.json')))
st = os.path.join(gd, 'states')
tmp = tempfile.mkdtemp()


def svgpng(p):
    o = os.path.join(tmp, os.path.basename(p) + '.png'); subprocess.run(['rsvg-convert', p, '-o', o], check=True); return Image.open(o).convert('RGBA')


lit = Image.open(os.path.join(gd, 'garth_lit_company.png')).convert('RGBA')
rows = [[(Image.open(os.path.join(gd, 'garth_unlit_preview.png')), 'unlit preview (layers, painted glows)'), (lit, 'game lit check: company')],
        [(Image.open(os.path.join(gd, 'garth_unlit_vessel.png')), 'albedo with the Vessel (vessel_garth) in slot 3'), (Image.open(os.path.join(gd, 'garth_lit_vessel.png')), 'game lit check: the Vessel in slot 3')]]
ids = [k for k in J['hotspots'] if not k.startswith('company_') or k == 'company_cross']
tiles = []
for k in ids:
    for kind in ('hover', 'locked'):
        im = lit.copy()
        im.alpha_composite(svgpng(os.path.join(st, '%s_%s.svg' % (k, kind))))
        if kind == 'hover' and os.path.exists(os.path.join(st, '%s_outline.png' % k)):
            im.alpha_composite(Image.open(os.path.join(st, '%s_outline.png' % k)).convert('RGBA'))
        tiles.append((im, '%s %s' % (k, kind)))
W2 = 1600 * 2 + 12
H = 0
sheet_rows = []
for r in rows:
    sheet_rows.append(('big', r)); H += 1000 + 12
tw = (W2 - 12 * 3) // 4; th = int(tw * 1000 / 1600)
for i in range(0, len(tiles), 4):
    sheet_rows.append(('small', tiles[i:i + 4])); H += th + 12
sheet = Image.new('RGB', (W2, H), (18, 16, 14)); d = ImageDraw.Draw(sheet); y = 0
for kind, r in sheet_rows:
    if kind == 'big':
        for j, (im, lab) in enumerate(r):
            sheet.paste(im.convert('RGB'), (j * (1600 + 12), y)); d.rectangle([j * 1612 + 6, y + 6, j * 1612 + 16 + 9 * len(lab), y + 28], fill=(10, 9, 8)); d.text((j * 1612 + 10, y + 8), lab, fill=(230, 222, 205), font=FONT)
        y += 1012
    else:
        for j, (im, lab) in enumerate(r):
            x = j * (tw + 12); sheet.paste(im.convert('RGB').resize((tw, th), Image.LANCZOS), (x, y)); d.rectangle([x + 4, y + 4, x + 14 + 9 * len(lab), y + 24], fill=(10, 9, 8)); d.text((x + 8, y + 6), lab, fill=(230, 222, 205), font=FONT)
        y += th + 12
sheet.save(out)
print('sheet', sheet.size, len(tiles), 'state tiles')
