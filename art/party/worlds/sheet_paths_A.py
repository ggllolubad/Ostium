# Sheet for hero path variants batch A: per calling, the accepted base beside its three paths at full size,
# then the same four at battle size (0.3x, a human ~190 px) in colour and as silhouettes.
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir('/home/claude/party')
rows = [('bulwark', ['last_bastion', 'ironwarden', 'thornguard']), ('duelist', ['bladedancer', 'executioner', 'bloodletter']), ('elementalist', ['accumulator', 'catalyst', 'prismatic'])]
def font(sz):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf']:
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
F, Fs = font(26), font(18)
BG, BGs = (40, 35, 31), (216, 210, 196)
W, H, s = 600, 820, 0.3
sw, sh = int(W * s), int(H * s)
rowH = H + 40 + sh + 20
sheet = Image.new('RGB', (4 * W, len(rows) * rowH), BG)
d = ImageDraw.Draw(sheet)
for r, (cal, paths) in enumerate(rows):
    y0 = r * rowH
    items = [(f'out/dirAC_{cal}.png', f'out/dirAC_{cal}_sil.png', f'{cal.title()} (base)')] + [(f'out/paths/{cal}_{p}.png', f'out/paths/{cal}_{p}_sil.png', p.replace('_', ' ').title()) for p in paths]
    for i, (img, sil, name) in enumerate(items):
        im = Image.open(img).convert('RGBA')
        sheet.paste(im, (i * W, y0 + 30), im)
        d.text((i * W + 20, y0 + 6), name, fill=(232, 220, 196), font=F)
        small = im.resize((sw, sh), Image.LANCZOS)
        sx = i * W + 40; sy = y0 + H + 40
        sheet.paste(small, (sx, sy), small)
        sl = Image.open(sil).convert('RGB').resize((sw, sh), Image.LANCZOS)
        sheet.paste(sl, (sx + sw + 20, sy))
    d.line([(0, y0 + rowH - 4), (4 * W, y0 + rowH - 4)], fill=(90, 80, 70), width=2)
    d.text((10, y0 + H + 14), 'battle size 0.3x (colour, silhouette)', fill=(160, 150, 130), font=Fs)
sheet.save('out/paths/paths_A_sheet.png')
print(sheet.size)
