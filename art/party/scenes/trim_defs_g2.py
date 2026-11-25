"""Trim a layer SVG's <defs> to what its body (and the kept defs) actually reference. lik's svgLayer embeds every def of the
room in every layer (the figure-engine fires bring hundreds of KB each), so far/mid/fore each carried the whole room.
Usage: python3 scenes/trim_defs_g2.py <layer.svg> [...]"""
import re, sys
REF = re.compile(r'url\(#([^)]+)\)|href="#([^"]+)"')
for path in sys.argv[1:]:
    s = open(path).read()
    a = s.find('<defs>'); b = s.find('</defs>')
    if a < 0 or b < 0: continue
    defs, body = s[a + 6:b], s[b + 7:]
    # split the defs into top-level elements with a small tag-depth scanner
    els, i, n = [], 0, len(defs)
    while i < n:
        j = defs.find('<', i)
        if j < 0: break
        if defs.startswith('<!--', j): k = defs.find('-->', j) + 3; els.append(defs[j:k]); i = k; continue
        depth, k = 0, j
        while True:
            m = re.compile(r'<(/?)([a-zA-Z][\w:-]*)[^>]*?(/?)>', re.S).search(defs, k)
            if not m: k = n; break
            if m.group(1): depth -= 1
            elif not m.group(3): depth += 1
            k = m.end()
            if depth == 0: break
        els.append(defs[j:k]); i = k
    ids = {}
    for e in els:
        m = re.match(r'<[a-zA-Z][\w:-]*[^>]*?\sid="([^"]+)"', e, re.S)
        ids.setdefault(m.group(1) if m else None, []).append(e)
    keep, todo = set(), [x for t in REF.findall(body) for x in t if x]
    while todo:
        x = todo.pop()
        if x in keep or x not in ids: continue
        keep.add(x)
        for e in ids[x]: todo += [y for t in REF.findall(e) for y in t if y]
    out = ''.join(e for e in els if not re.match(r'<[a-zA-Z][\w:-]*[^>]*?\sid="', e, re.S)) + ''.join(e for k2, es in ids.items() if k2 in keep for e in es)
    s2 = s[:a + 6] + out + '</defs>' + body
    open(path, 'w').write(s2)
    print('trim', path, '%.1f -> %.1f MB' % (len(s) / 1e6, len(s2) / 1e6))
