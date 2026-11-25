"""Export one abbey interior to the game: per-layer lit maps (bg, mid, fg), the keeper sprite and any roster sprites
with their normal maps, the hover outlines, and a room.json the game reads (camera, sprite placements, hotspots, draw order).

Usage: python3 grim/light/export_interior.py <room> <game_dir>
Writes <game_dir>/assets/art/hub/int/<room>/.
"""
import json, os, shutil, subprocess, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
import export_godot as EG

ROOT = os.path.join(os.path.dirname(__file__), '..')
INT = os.path.join(ROOT, 'hub', 'int')


def main(room, game):
    out = os.path.join(game, 'assets', 'art', 'hub', 'int', room)
    os.makedirs(out, exist_ok=True)
    meta = json.load(open(os.path.join(INT, room + '.light.json')))
    J = json.load(open(os.path.join(INT, room + '_hotspots.json')))
    layers = [l for l in ('bg', 'mid', 'fg') if os.path.exists(os.path.join(INT, '%s__%s.svg' % (room, l)))]
    for l in layers:
        EG.layer_maps(os.path.join(INT, '%s__%s.svg' % (room, l)), meta, os.path.join(out, l))
    json.dump(meta, open(os.path.join(out, room + '.light.json'), 'w'))
    sprites = []
    # the keeper, rendered at the same scale and origin as the reference render
    kp = J['keeper']
    sc = kp['height_px'] / float(kp['figure'][1] - kp['figure'][0])
    kpng = os.path.join(out, 'keeper.png')
    subprocess.run(['rsvg-convert', '-z', str(sc), os.path.join(ROOT, 'keepers', kp['sprite'] + '.svg'), '-o', kpng], check=True)
    if kp.get('flip'):
        Image.open(kpng).transpose(Image.FLIP_LEFT_RIGHT).save(kpng)
    EG.sprite_normals(kpng)
    sprites.append({'id': 'keeper', 'png': 'keeper.png', 'pos': kp['origin'], 'z': kp['z'], 'over_cut': kp.get('over_cut')})
    # the roster's resting heroes (guesthouse): one sprite per slot, cropped, positioned at the feet
    for r in J.get('roster', []):
        f = os.path.join(out, 'hero_%d.png' % r['slot'])
        subprocess.run(['rsvg-convert', '-z', str(r['height_px'] / 620.0), os.path.join(ROOT, r['name'] + '.svg'), '-o', f], check=True)
        im = Image.open(f).convert('RGBA')
        if r.get('flip'):
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        im = im.crop(im.getchannel('A').getbbox()); im.save(f)
        EG.sprite_normals(f)
        sprites.append({'id': 'hero_%d' % r['slot'], 'png': 'hero_%d.png' % r['slot'], 'pos': [round(r['feet'][0] - im.width / 2), round(r['feet'][1] - im.height + 6)], 'z': r['z'], 'roster_slot': r['slot']})
    # hover outlines
    hv = os.path.join(out, 'hover'); os.makedirs(hv, exist_ok=True)
    for k in J['hotspots']:
        src = os.path.join(INT, 'states', '%s_%s_outline.png' % (room, k))
        if os.path.exists(src):
            shutil.copy(src, os.path.join(hv, '%s_outline.png' % k))
    hotspots = {k: {kk: vv for kk, vv in v.items() if kk != 'outline'} for k, v in J['hotspots'].items()}
    room_json = {'room': room, 'w': 1600, 'h': 1000, 'layers': layers, 'sprites': sprites, 'hotspots': hotspots, 'panel': J.get('panel'),
                 'draw_order': ['bg', 'roster', 'keeper', 'mid', 'keeper_over_cut', 'fg']}
    json.dump(room_json, open(os.path.join(out, 'room.json'), 'w'), indent=1)
    print('exported', room, '->', out)


if __name__ == '__main__':
    main(*sys.argv[1:3])
