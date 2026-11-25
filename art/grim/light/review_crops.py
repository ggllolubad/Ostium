"""Review sheet inputs: half-size frame, parity number, and zoomed lit + unlit crops of every clickable opening."""
import json, sys, os
import numpy as np
from PIL import Image
hot, out = sys.argv[1], sys.argv[2]
J = json.load(open(hot))
L, U = Image.open(os.path.join(out, 'garth_lit.png')), Image.open(os.path.join(out, 'garth_unlit.png'))
for k, h in J['hotspots'].items():
    if k.startswith('company_') and k != 'company_cross':
        continue
    xs = [p[0] for p in h['poly']]; ys = [p[1] for p in h['poly']]
    b = (max(0, int(min(xs)) - 60), max(0, int(min(ys)) - 60), min(1600, int(max(xs)) + 60), min(1000, int(max(ys)) + 60))
    for nm, im in (('lit', L), ('unlit', U)):
        c = im.crop(b); s = max(1, int(500 / max(c.size)))
        (c.resize((c.width * s, c.height * s), Image.NEAREST) if s > 1 else c).save(os.path.join(out, 'open_%s_%s.png' % (k, nm)))
L.resize((800, 500), Image.LANCZOS).save(os.path.join(out, 'garth_lit_half.png'))
g = os.path.join(out, 'garth_in_godot.png')
if os.path.exists(g):
    a = np.asarray(Image.open(g).convert('RGB'), float); b2 = np.asarray(L.convert('RGB'), float)
    print('parity: engine vs reference mean abs diff %.2f / 255' % np.abs(a - b2).mean())
