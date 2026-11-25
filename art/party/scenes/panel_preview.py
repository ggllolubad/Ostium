"""Compose the Sacristy panel preview: the room, the panel over it, all fifteen Teeth in their niches.
Usage: python3 scenes/panel_preview.py <panels_dir> <room_preview.png>"""
import json, os, sys
from PIL import Image
P, room = sys.argv[1], sys.argv[2]
L = json.load(open(os.path.join(P, 'sacristy_layout.json')))['sacristy']
im = Image.open(room).convert('RGBA')
im.alpha_composite(Image.open(os.path.join(P, 'sacristy.png')).convert('RGBA'))
for s in L['tooth_slots']:
    im.alpha_composite(Image.open(os.path.join(P, s['file'])).convert('RGBA'), (s['rect'][0], s['rect'][1]))
im.convert('RGB').save(os.path.join(P, 'sacristy_panel_preview.png'))
print('panel preview')
