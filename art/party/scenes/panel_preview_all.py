"""Panel previews: each panel laid over its room's preview, with the sprites the game sets into it shown in their slots
(the Scriptorium's ribbon tabs). Usage: python3 scenes/panel_preview_all.py <panels_dir>"""
import json, os, sys
from PIL import Image
P = sys.argv[1]; ROOT = os.path.join(os.path.dirname(__file__), '..', 'out', 'scenes')
rooms = {'guesthouse': 'pilot/guesthouse_preview.png', 'almonry': 'hub/almonry/almonry_preview.png', 'smithy': 'hub/smithy/smithy_preview.png', 'infirmarium': 'hub/infirmarium/infirmarium_preview.png',
         'cellarium': 'hub/cellarium/cellarium_preview.png', 'scriptorium': 'hub/scriptorium/scriptorium_preview.png', 'chapter': 'hub/chapter/chapter_preview.png'}
for n, r in rooms.items():
    im = Image.open(os.path.join(ROOT, r)).convert('RGBA')
    im.alpha_composite(Image.open(os.path.join(P, n + '.png')).convert('RGBA'))
    L = json.load(open(os.path.join(P, n + '_layout.json')))[n]
    for i, t in enumerate(L.get('tab_slots', [])):
        s = Image.open(os.path.join(P, 'ui', 'ui_tab_sel.png' if i == 0 else 'ui_tab.png')).convert('RGBA').resize((t['rect'][2], t['rect'][3]))
        im.alpha_composite(s, (t['rect'][0], t['rect'][1]))
    im.convert('RGB').save(os.path.join(P, n + '_panel_preview.png'))
    print('preview', n)
