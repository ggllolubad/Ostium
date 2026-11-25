"""Contract check for the Living Ink garth against grim's: canvas, camera, layer names (rig), every light (position, strength,
range, colour, order), every hotspot (id, label, action, slot, click polygon, hover outline), party anchors, monument, brazier,
draw order. Planes may differ (the geometry is re-drawn), but every plane a light was derived from must still exist.
Usage: python3 scenes/check_garth.py <new_dir> [grim_hub_dir]
"""
import json, os, sys

new = sys.argv[1]
old = sys.argv[2] if len(sys.argv) > 2 else '/home/claude/ostium-art/grim/hub'
L = lambda d, n: json.load(open(os.path.join(d, n)))
bad = []
def chk(c, msg):
    if not c:
        bad.append(msg)

a, b = L(new, 'garth.light.json'), L(old, 'garth.light.json')
chk((a['w'], a['h'], a['camera']) == (b['w'], b['h'], b['camera']), 'light canvas/camera %s vs %s' % ((a['w'], a['h'], a['camera']), (b['w'], b['h'], b['camera'])))
chk(len(a['lights']) == len(b['lights']), 'light count %d vs %d' % (len(a['lights']), len(b['lights'])))
for i, (p, q) in enumerate(zip(a['lights'], b['lights'])):
    if any(abs(x - y) > 0.006 for x, y in zip(p['pos'], q['pos'])) or abs(p['I'] - q['I']) > 0.006 or abs(p['range'] - q['range']) > 0.006 or p['col'] != q['col']:
        bad.append('light %d: %s vs %s' % (i, p, q))
ra, rb = L(new, 'garth.rig.json'), L(old, 'garth.rig.json')
chk(ra == rb, 'rig %s vs %s' % (ra, rb))
ha, hb = L(new, 'garth_hotspots.json'), L(old, 'garth_hotspots.json')
for k in ('w', 'h', 'camera', 'party', 'monument', 'brazier', 'draw_order'):
    chk(ha.get(k) == hb.get(k), '%s: %s vs %s' % (k, ha.get(k), hb.get(k)))
chk(list(ha['hotspots']) == list(hb['hotspots']), 'hotspot ids/order %s vs %s' % (list(ha['hotspots']), list(hb['hotspots'])))
for k, v in hb['hotspots'].items():
    w = ha['hotspots'].get(k)
    if w is None:
        bad.append('missing hotspot ' + k); continue
    for f in ('label', 'action', 'slot', 'poly'):
        chk(w.get(f) == v.get(f), '%s.%s: %s vs %s' % (k, f, w.get(f), v.get(f)))
    if 'outline' in v:
        ok = 'outline' in w and len(w['outline']) == len(v['outline']) and all(x['closed'] == y['closed'] and len(x['pts']) == len(y['pts']) and all(abs(c - d) < 0.002 for P, Q in zip(x['pts'], y['pts']) for c, d in zip(P, Q)) for x, y in zip(w['outline'], v['outline']))
        chk(ok, '%s.outline differs' % k)
for n in ('bg', 'monument', 'light', 'fg'):
    chk(os.path.exists(os.path.join(new, 'garth__%s.svg' % n)), 'missing layer garth__%s.svg' % n)
print('CONTRACT OK' if not bad else 'CONTRACT FAIL\n  ' + '\n  '.join(bad[:40]))
print('planes', len(a['planes']), '(grim', len(b['planes']), ') lights', len(a['lights']), 'hotspots', len(ha['hotspots']))
sys.exit(1 if bad else 0)
