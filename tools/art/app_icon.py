"""app_icon.py: the Ostium app icon. An inked abbey door, pointed arch, left ajar with light at the threshold.
Writes assets/icon.png (512) and assets/icon.ico (16 to 256). Run: python3 tools/art/app_icon.py"""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

N = 1024
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'assets')
rng = np.random.default_rng(3)
INK = (34, 23, 15)
PARCH = (236, 222, 190)
STONE = (196, 178, 140)
WOOD = (96, 58, 34)
WOOD_D = (60, 34, 20)
LIGHT = (255, 214, 130)
RED = (150, 44, 30)

def arch(cx, base, w, h):
    """Pointed (gothic) arch polygon: straight sides, two arcs meeting at the apex."""
    pts = []
    r = w  # equilateral arch: each arc's radius equals the span
    left, right = cx - w / 2, cx + w / 2
    spring = base - (h - w * math.sqrt(3) / 2)
    pts += [(left, base), (left, spring)]
    for t in np.linspace(0, 1, 60):  # left arc, centred on the right springer
        a = math.pi - t * math.radians(60)
        pts.append((right + r * math.cos(a), spring - r * math.sin(a)))
    for t in np.linspace(0, 1, 60):  # right arc, centred on the left springer
        a = math.radians(60) - t * math.radians(60)
        pts.append((left + r * math.cos(a), spring - r * math.sin(a)))
    pts += [(right, spring), (right, base)]
    return pts

img = Image.new('RGBA', (N, N), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# tile: dark ink with a soft mottle and a parchment rim
tile = Image.new('L', (N, N), 0)
ImageDraw.Draw(tile).rounded_rectangle((24, 24, N - 24, N - 24), 190, fill=255)
noise = Image.fromarray((rng.random((64, 64)) * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC)
bg = Image.new('RGBA', (N, N), INK + (255,))
bg = Image.blend(bg, Image.merge('RGBA', [noise.point(lambda v: 34 + v // 10), noise.point(lambda v: 23 + v // 12), noise.point(lambda v: 15 + v // 14), Image.new('L', (N, N), 255)]), 0.5)
img.paste(bg, (0, 0), tile)
d.rounded_rectangle((40, 40, N - 40, N - 40), 175, outline=STONE + (255,), width=18)
# stone arch frame
cx, base = N / 2, 900
d.polygon(arch(cx, base, 560, 760), fill=STONE + (255,))
d.polygon(arch(cx, base, 560, 760), outline=INK + (255,), width=14)
# the doorway (dark), then the door leaf, swung slightly open to the right with light in the gap
inner = arch(cx, base, 420, 640)
d.polygon(inner, fill=(18, 12, 8, 255))
light = Image.new('L', (N, N), 0)
ImageDraw.Draw(light).polygon(inner, fill=255)
glow = Image.new('RGBA', (N, N), LIGHT + (255,))
gap = Image.new('L', (N, N), 0)
ImageDraw.Draw(gap).rectangle((cx + 120, 200, cx + 215, base), fill=255)
img.paste(glow, (0, 0), Image.fromarray(np.minimum(np.asarray(light), np.asarray(gap))))
# door leaf: planks, two iron bands, ring knocker
leaf_mask = Image.new('L', (N, N), 0)
ImageDraw.Draw(leaf_mask).polygon(inner, fill=255)
cut = Image.new('L', (N, N), 0)
ImageDraw.Draw(cut).rectangle((0, 0, cx + 120, N), fill=255)
leaf_mask = Image.fromarray(np.minimum(np.asarray(leaf_mask), np.asarray(cut)))
leaf = Image.new('RGBA', (N, N), WOOD + (255,))
ld = ImageDraw.Draw(leaf)
for x in range(int(cx - 210), int(cx + 130), 66):
    ld.line((x, 150, x, base), fill=WOOD_D + (255,), width=9)
for y in (430, 720):
    ld.rectangle((cx - 230, y - 22, cx + 130, y + 22), fill=(52, 48, 44, 255))
    for x in range(int(cx - 190), int(cx + 120), 70):
        ld.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(150, 140, 120, 255))
img.paste(leaf, (0, 0), leaf_mask)
d.ellipse((cx + 20, 560, cx + 100, 640), outline=(170, 160, 130, 255), width=14)
# Living Ink texture, no flat fills: grain over everything, ink hatching in the shadows, light fading into the gap
arr = np.asarray(img).astype(float)
alpha = arr[..., 3:4]
g = np.asarray(Image.fromarray((rng.random((N // 3, N // 3)) * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC)).astype(float) / 255.0
fine = rng.random((N, N))
arr[..., :3] *= (0.82 + 0.22 * g[..., None]) * (0.94 + 0.08 * fine[..., None])
img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
hatch = Image.new('L', (N, N), 0)
hd = ImageDraw.Draw(hatch)
for k in range(-N, N, 14):
    hd.line((k, N, k + N, 0), fill=150, width=3)
shade = Image.new('L', (N, N), 0)
sd = ImageDraw.Draw(shade)
sd.polygon(arch(cx, base, 560, 760), fill=255)
sd.polygon(arch(cx, base, 470, 700), fill=0)
sd.rectangle((cx, 0, N, N), fill=0)  # hatch only the arch's left (shadow) side
leafshade = Image.new('L', (N, N), 0)
ImageDraw.Draw(leafshade).rectangle((cx - 215, 150, cx - 120, base), fill=255)
leafshade = Image.fromarray(np.minimum(np.asarray(leafshade), np.asarray(leaf_mask)))
mask = Image.fromarray((np.maximum(np.asarray(shade), np.asarray(leafshade)) / 255.0 * np.asarray(hatch)).astype(np.uint8))
img.paste(Image.new('RGBA', (N, N), INK + (255,)), (0, 0), mask.point(lambda v: int(v * 0.55)))
grad = np.zeros((N, N), float)
xs = np.arange(N)
grad[:, :] = np.clip((xs - (cx + 120)) / 95.0, 0, 1)[None, :]
gapm = (np.asarray(gap).astype(float) / 255.0) * (np.asarray(light).astype(float) / 255.0)
dark = (gapm * (1 - grad) * 120).astype(np.uint8)
img.paste(Image.new('RGBA', (N, N), (180, 110, 40, 255)), (0, 0), Image.fromarray(dark))
d = ImageDraw.Draw(img)
d.polygon(arch(cx, base, 560, 760), outline=INK + (255,), width=14)
d.polygon(inner, outline=INK + (255,), width=10)
img = img.filter(ImageFilter.UnsharpMask(2, 60, 2))
big = img.resize((512, 512), Image.LANCZOS)
big.save(os.path.join(OUT, 'icon.png'))
img.save(os.path.join(OUT, 'icon.ico'), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print('wrote assets/icon.png and assets/icon.ico')
