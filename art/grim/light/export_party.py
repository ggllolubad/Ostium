"""Render the placeholder company into the game's garth folder at each slot's size, facing its slot (flipped where needed)."""
import json, subprocess, sys, os
from PIL import Image
HE = {0: ('bulwark', False), 1: ('elementalist', True), 2: ('duelist', True), 3: ('oracle', False)}
hot, out = sys.argv[1], sys.argv[2]
J = json.load(open(hot))
party = []
for p in J['party']:
    name, flip = HE[p['slot']]
    f = os.path.join(out, 'party_%d.png' % p['slot'])
    subprocess.run(['rsvg-convert', '-z', str(p['height_px'] / 620), 'grim/%s.svg' % name, '-o', f], check=True)
    im = Image.open(f).convert('RGBA')
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im = im.crop(im.getchannel('A').getbbox())
    im.save(f)
    party.append({'slot': p['slot'], 'png': 'party_%d.png' % p['slot'], 'feet': p['feet'], 'z': p['z'], 'w': im.width, 'h': im.height})
json.dump({'party': party, 'monument_z': J['monument']['z']}, open(os.path.join(out, 'party.json'), 'w'))
