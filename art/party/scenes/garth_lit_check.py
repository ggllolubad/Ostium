"""Run the game's garth lighting on the Living Ink garth, in a staged copy of grim's layout (the game scripts unchanged).
Stages <stage>/grim/{light/*.py, hub/garth*, <hero>.svg}, runs grim/garth_states.js there, then lights the frame once per
party variant with garth_lit.py's own functions (layer passes rendered once, sprites composited per variant), then
hover_outline.py on the first variant's depth buffer. Copies states/ and the lit and unlit frames back to <garth_dir>.
Usage: python3 scenes/garth_lit_check.py <garth_dir> <party_svg_dir> <stage_dir>
"""
import glob, json, os, shutil, subprocess, sys
import numpy as np

gd, party, stage = [os.path.abspath(a) for a in sys.argv[1:4]]
GRIM = '/home/claude/ostium-art/grim'
sg = os.path.join(stage, 'grim')
for d in ('light', 'hub/states'):
    os.makedirs(os.path.join(sg, d), exist_ok=True)
for f in glob.glob(GRIM + '/light/*.py') + glob.glob(GRIM + '/light/*.json'):
    shutil.copy(f, os.path.join(sg, 'light'))
shutil.copy(GRIM + '/garth_states.js', sg)
for f in glob.glob(gd + '/garth__*.svg') + [gd + '/garth.light.json', gd + '/garth_hotspots.json', gd + '/garth.rig.json']:
    shutil.copy(f, os.path.join(sg, 'hub'))
for f in glob.glob(party + '/*.svg'):
    shutil.copy(f, sg)
subprocess.run(['node', 'grim/garth_states.js'], cwd=stage, check=True)

sys.path.insert(0, os.path.join(sg, 'light'))
import garth_lit as GL
meta = json.load(open(os.path.join(GL.HUB, 'garth.light.json')))
J = json.load(open(os.path.join(GL.HUB, 'garth_hotspots.json')))
L = {n: GL.layer_passes(n, meta) for n in ('bg', 'monument', 'fg')}
VARIANTS = [('company', {0: ('bulwark', False), 1: ('elementalist', True), 2: ('duelist', True), 3: ('oracle', False)}),
            ('vessel', {0: ('bulwark', False), 1: ('elementalist', True), 2: ('duelist', True), 3: ('vessel_garth', False)})]
zb = None
for name, heroes in VARIANTS:
    GL.HEROES = heroes
    buf = {k: v.copy() for k, v in L['bg'].items()}
    buf['edge'] = np.zeros(buf['albedo'].shape[:2], bool)
    mz = J['monument']['z']
    order = sorted(J['party'], key=lambda p: -p['z'])
    for p in order:
        if p['z'] > mz:
            GL.sprite(buf, J, p['slot'])
    GL.over(buf, L['monument'])
    for p in order:
        if p['z'] <= mz:
            GL.sprite(buf, J, p['slot'])
    GL.over(buf, L['fg'])
    GL.relight(meta, buf, os.path.join(gd, 'garth_lit_%s.png' % name), os.path.join(gd, 'garth_unlit_%s.png' % name))
    if zb is None:
        zb = os.path.join(stage, 'zbuf_company.npy'); shutil.copy(GL.TMP + '/zbuf.npy', zb)
subprocess.run(['python3', os.path.join(sg, 'light', 'hover_outline.py'), os.path.join(GL.HUB, 'garth_hotspots.json'), os.path.join(GL.HUB, 'garth.light.json'), zb, os.path.join(GL.HUB, 'states')], check=True)
os.makedirs(os.path.join(gd, 'states'), exist_ok=True)
for f in glob.glob(os.path.join(GL.HUB, 'states', '*')):
    shutil.copy(f, os.path.join(gd, 'states'))
print('states', len(os.listdir(os.path.join(gd, 'states'))))
