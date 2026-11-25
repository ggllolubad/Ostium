"""Check a Living Ink interior against its grim contract: camera, size, light list (order, positions, strengths, ranges,
colours), exit polygon and 3D outline, hotspot keys, panel id, draw order, keeper spot.
Usage: python3 scenes/check_contract.py <room> <room_dir> [grim_int_dir]"""
import json, os, sys
room, d = sys.argv[1], sys.argv[2]
G = sys.argv[3] if len(sys.argv) > 3 else '/home/claude/ostium-art/grim/hub/int'
gl, nl = json.load(open(os.path.join(G, room + '.light.json'))), json.load(open(os.path.join(d, room + '.light.json')))
gh, nh = json.load(open(os.path.join(G, room + '_hotspots.json'))), json.load(open(os.path.join(d, room + '_hotspots.json')))
bad = []
def ck(name, ok, info=''):
    print(('ok   ' if ok else 'FAIL ') + name + ('' if ok else '  ' + str(info)))
    if not ok: bad.append(name)
ck('size and camera', (gl['w'], gl['h'], gl['camera']) == (nl['w'], nl['h'], nl['camera']))
ck('light count %d' % len(gl['lights']), len(gl['lights']) == len(nl['lights']), (len(gl['lights']), len(nl['lights'])))
for i, (a, b) in enumerate(zip(gl['lights'], nl['lights'])):
    same = all(abs(x - y) < 0.006 for x, y in zip(a['pos'], b['pos'])) and abs(a['I'] - b['I']) < 1e-6 and abs(a['range'] - b['range']) < 1e-6 and all(abs(x - y) < 1e-6 for x, y in zip(a['col'], b['col']))
    ck('light %d %s' % (i, a['pos']), same, (a, b))
ck('exit polygon', gh['hotspots']['exit']['poly'] == nh['hotspots']['exit']['poly'], (gh['hotspots']['exit']['poly'][:3], nh['hotspots']['exit']['poly'][:3]))
ck('exit outline', gh['hotspots']['exit'].get('outline') == nh['hotspots']['exit'].get('outline'))
ck('hotspot keys', sorted(gh['hotspots']) == sorted(nh['hotspots']), (sorted(gh['hotspots']), sorted(nh['hotspots'])))
for k in ('room', 'panel', 'draw_order', 'w', 'h', 'camera'):
    ck(k, gh.get(k) == nh.get(k), (gh.get(k), nh.get(k)))
for k in ('X', 'Z', 'sprite', 'label', 'feet', 'z'):
    ck('keeper ' + k, gh['keeper'].get(k) == nh['keeper'].get(k), (gh['keeper'].get(k), nh['keeper'].get(k)))
pid = gh.get('panel')
ck('panel hotspot has outline as grim' , ('outline' in gh['hotspots'][pid]) == ('outline' in nh['hotspots'][pid]), (('outline' in gh['hotspots'][pid]), ('outline' in nh['hotspots'][pid])))
print('CONTRACT', 'OK' if not bad else 'FAILS: ' + ', '.join(bad))
