import os, shutil
from PIL import Image, ImageDraw, ImageFont
O = '/home/claude/party/out'
B = [('procession', 'The Procession (ruler 3.5)'), ('cicada_under_the_road', 'The Cicada Under the Road (ruler 4, true height)'), ('courier', 'The Courier (elite 2.2)'),
     ('road_centipede', 'Road Centipede (elite 1.9 reared, 4 long)'), ('dowser', 'The Dowser (1.0)'), ('struck_shepherd', 'Struck Shepherd (1.0)'), ('highwayman', 'Highwayman (1.0)'),
     ('tinker', 'The Tinker (1.0, 1.35 load)'), ('road_warden', 'Road-Warden (1.05, pike)'), ('spire_termites', 'Spire Termites (0.6)'), ('antlion', 'Antlion (large 1.2 x 1.8)')]
A = [('hive_queen', 'The Hive Queen (ruler 4)'), ('mantis_duelist', 'Mantis Duelist (elite 2.0)'), ('brood_mother', 'Brood Mother (elite 2.2)'), ('venom_spider', 'Venom Spider (1.2)'),
     ('puppet_host', 'Puppet Host (1.0)'), ('galvanic_beetle', 'Galvanic Beetle (1.2)'), ('hive_drone', 'Hive Drone (0.6)'), ('spire_wasps', 'Spire Wasps (0.6)')]
os.makedirs(f'{O}/worlds/X_b', exist_ok=True)
for k, _ in B:
    for suf in ['', '_sil']: shutil.copy(f'{O}/worlds/world_X_b_{k}{suf}.png', f'{O}/worlds/X_b/{k}{suf}.png')
def load(p):
    im = Image.open(p).convert('RGBA'); return im, im.split()[3].getbbox()
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 30)
except Exception: font = ImageFont.load_default()
THR = (f'{O}/dirAC2_thrall.png', 'Drowned Thrall (1.0, reference)')
def sheet(items, out, maxw=None):
    ims = [(load(p), n) for p, n in items]
    GAP, GROUND, LAB = 60, 30, 70
    W = sum(max(bb[2] - bb[0], 440) for (im, bb), _ in ims) + GAP * (len(ims) + 1)
    Htop = max(im.height - GROUND - bb[1] for (im, bb), _ in ims)
    H = Htop + GROUND + LAB + 40
    sh = Image.new('RGBA', (W, H), (26, 24, 26, 255)); d = ImageDraw.Draw(sh)
    gy = 20 + Htop; d.rectangle([0, gy, W, H], fill=(16, 15, 17, 255))
    x = GAP
    for (im, bb), name in ims:
        sh.alpha_composite(im.crop((bb[0], 0, bb[2], im.height)), (x, gy - (im.height - GROUND)))
        d.text((x, gy + 30), name, fill=(206, 200, 190, 255), font=font)
        x += max(bb[2] - bb[0], 440) + GAP
    sh.convert('RGB').save(out); print(out, sh.size)
sheet([(f'{O}/worlds/world_X_b_{k}.png', n) for k, n in B] + [THR], f'{O}/worlds/X_b/sheet.png')
sheet([(f'{O}/worlds/world_X_{k}.png', n) for k, n in A] + [(f'{O}/worlds/world_X_b_{k}.png', n) for k, n in B] + [THR], f'{O}/worlds/X_b/sheet19.png')
# silhouettes at game size (a 1.0 human about 190 px), all 19 of the world
k = 190 / 640; row = []
for p in [f'{O}/worlds/world_X_{a}.png' for a, _ in A] + [f'{O}/worlds/world_X_b_{b}.png' for b, _ in B]:
    im = Image.open(p).convert('RGBA'); a = im.split()[3]; bb = a.getbbox()
    blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(a)
    blk = blk.crop((bb[0] - 6, 0, bb[2] + 6, im.height - 26))
    row.append(blk.resize((max(1, int(blk.width * k)), max(1, int(blk.height * k))), Image.LANCZOS))
Hs = max(r.height for r in row) + 30; Ws = sum(r.width for r in row) + 14 * (len(row) + 1)
sil = Image.new('RGBA', (Ws, Hs), (216, 210, 196, 255)); x = 14
for r in row: sil.alpha_composite(r, (x, Hs - 15 - r.height)); x += r.width + 14
sil.convert('RGB').save(f'{O}/worlds/X_b/sil.png'); print('sil', sil.size)
