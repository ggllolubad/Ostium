"""Grim grade for in-game sprites: deepen the lower body and far side, lift contrast, desaturate slightly."""
import sys
from PIL import Image, ImageEnhance, ImageChops
def grade(src, dst, strength=1.0):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Color(rgb).enhance(1 - 0.18 * strength)
    rgb = ImageEnhance.Contrast(rgb).enhance(1 + 0.16 * strength)
    # vertical + diagonal shade: darker toward the feet and the right
    grad = Image.new("L", (w, h))
    px = grad.load()
    for y in range(h):
        for x in range(0, w, 1):
            v = 255 - int(strength * (70 * max(0, (y / h - 0.45)) / 0.55 + 30 * (x / w)))
            px[x, y] = max(0, min(255, v))
    shade = Image.merge("RGB", (grad, grad, grad))
    rgb = ImageChops.multiply(rgb, shade)
    out = Image.merge("RGBA", (*rgb.split(), im.split()[3]))
    out.save(dst)
if __name__ == "__main__":
    grade(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 1.0)
