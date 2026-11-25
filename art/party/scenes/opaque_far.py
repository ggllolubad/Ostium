"""Make a battle room's far layer truly opaque. The wobble filter displaces the full-frame base rect, leaving a few hundred
edge pixels part-transparent. Fix both outputs: in the SVG, put a copy of the layer's first full-frame rect (its base fill)
right after </defs>, outside the filters; in the PNG, fill any remaining part-transparent pixels from a blur of the layer.
Usage: python3 scenes/opaque_far.py <far.svg> <far.png>"""
import re, sys
from PIL import Image, ImageFilter
svg, png = sys.argv[1:3]
s = open(svg).read()
if '<!--backstop-->' not in s:
    m = re.search(r'<rect width="1480" height="480" fill="([^"]+)"/>', s)
    s = s.replace('</defs>', '</defs><!--backstop--><rect width="1480" height="480" fill="%s"/>' % m.group(1), 1)
    open(svg, 'w').write(s)
im = Image.open(png).convert('RGBA')
if im.getchannel('A').getextrema()[0] < 255:
    bg = im.convert('RGB').filter(ImageFilter.GaussianBlur(6)).convert('RGBA'); bg.alpha_composite(im); bg.convert('RGB').save(png)
print('opaque', svg, png)
