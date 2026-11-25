"""Split a tagged Ostium scene SVG into the four render passes the lighting model needs.

  albedo   the ink art with painted glows removed (class "glow": they are the unlit preview's fake light)
  emissive black everywhere except emissive elements (class "em": flames, lit openings, lantern glass, the sky)
  normal   every face filled flat with its plane's normal (class "pl_<i>"), props flat (lit later with pillow normals)
  depth    a key per pixel: 170 = plane i, 85 = prop at depth Z (class "z_<Z*100>"), 255 = sky, 0 = untagged

Usage: python3 passes.py scene.svg scene.light.json outdir/prefix
Writes prefix_albedo.png, prefix_emissive.png, prefix_normal.png, prefix_depth.png (all the SVG's size, with alpha).
"""
import json, re, subprocess, sys

TAG = re.compile(r'<(/?)([a-zA-Z][\w:-]*)((?:[^>"\']|"[^"]*"|\'[^\']*\')*?)(/?)>')
DRAW = {'path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'use', 'text'}


def classes(attrs):
    m = re.search(r'class="([^"]*)"', attrs)
    return m.group(1).split() if m else []


def set_attr(attrs, name, val):
    if re.search(r'\s%s="[^"]*"' % name, attrs):
        return re.sub(r'(\s%s=)"[^"]*"' % name, r'\1"%s"' % val, attrs)
    return attrs + ' %s="%s"' % (name, val)


def drop_attr(attrs, name):
    return re.sub(r'\s%s="[^"]*"' % name, '', attrs)


def opacity(attrs):
    m = re.search(r'\sopacity="([^"]*)"', attrs)
    return float(m.group(1)) if m else 1.0


def transform(svg, mode, planes):
    """Walk the tag stream with a stack of inherited tags (em, glow, plane, depth) and rewrite paint per pass."""
    out, pos, stack, in_defs, skip = [], 0, [], 0, 0

    def ctx():
        c = {'em': False, 'glow': False, 'pl': None, 'z': None, 'sky': False, 'faint': False}
        for f in stack:
            for k, v in f.items():
                if k in ('pl', 'z'):
                    if v is not None:
                        c[k] = v
                        if k == 'pl':
                            c['z'] = None
                        else:
                            c['pl'] = None
                elif v:
                    c[k] = True
        return c

    def paint(c):
        if mode == 'normal':
            if c['pl'] is not None:
                n = planes[c['pl']]['n']  # world: x right, y up, z away -> screen colour: x, y up, z toward viewer
                return '#%02x%02x%02x' % tuple(int(round((v * 0.5 + 0.5) * 255)) for v in (n[0], n[1], -n[2]))
            return '#8080ff'
        if mode == 'depth':
            if c['sky']:
                return '#ff0000'
            if c['pl'] is not None:
                return '#aa%02x%02x' % (c['pl'] // 256, c['pl'] % 256)
            if c['z'] is not None:
                return '#55%02x%02x' % (c['z'] // 256, c['z'] % 256)
            return '#000000'
        return '#000000'

    for m in TAG.finditer(svg):
        text = svg[pos:m.start()]
        if not skip:
            out.append(text)
        pos = m.end()
        close, name, attrs, selfclose = m.group(1), m.group(2), m.group(3), m.group(4)
        if name == 'defs':
            in_defs += -1 if close else (0 if selfclose else 1)
            if not skip:
                out.append(m.group(0))
            continue
        if in_defs or name in ('svg', 'style', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask', 'pattern', 'filter') or name.startswith('fe'):
            if not skip:
                out.append(m.group(0))
            continue
        if close:
            if stack:
                f = stack.pop()
                if f.get('_skip'):
                    skip -= 1
                    continue
            if not skip:
                out.append(m.group(0))
            continue
        cls = classes(attrs)
        frame = {'em': 'em' in cls, 'glow': 'glow' in cls, 'sky': 'sky' in cls, 'pl': None, 'z': None,
                 'faint': opacity(attrs) < 0.6 or 'url(#rough)' in attrs}
        for k in cls:
            if k.startswith('pl_'):
                frame['pl'] = int(k[3:])
            if k.startswith('z_'):
                frame['z'] = int(k[2:])
        stack.append(frame)
        c = ctx()
        drop = (mode in ('albedo', 'emissive', 'emask') and c['glow']) or (mode in ('normal', 'depth') and (c['glow'] or c['faint']))
        if drop:
            if selfclose:
                stack.pop()
            else:
                frame['_skip'] = True
                skip += 1
            continue
        if skip:
            if selfclose:
                stack.pop()
            continue
        a = attrs
        keep_filter = 'url(#wob)' in a
        if mode in ('emissive', 'emask', 'normal', 'depth') and not keep_filter:
            a = drop_attr(a, 'filter')
        if mode == 'emask' and name in DRAW:
            col = '#ffffff' if c['em'] else '#000000'
            if not re.search(r'\sfill="none"', a):
                a = set_attr(a, 'fill', col)
            if re.search(r'\sstroke="', a) and not re.search(r'\sstroke="none"', a):
                a = set_attr(a, 'stroke', col)
        if mode == 'emissive' and not (c['em'] or c['glow']):
            if name in DRAW:
                if not re.search(r'\sfill="none"', a):
                    a = set_attr(a, 'fill', '#000000')
                if re.search(r'\sstroke="', a) and not re.search(r'\sstroke="none"', a):
                    a = set_attr(a, 'stroke', '#000000')
        if mode == 'emissive' and c['glow'] and name in DRAW:
            a = set_attr(a, 'opacity', '%.2f' % (opacity(a) * 0.5))
        if mode in ('normal', 'depth'):
            a = drop_attr(a, 'opacity')
            if name in DRAW:
                col = paint(c)
                if not re.search(r'\sfill="none"', a):
                    a = set_attr(a, 'fill', col)
                if re.search(r'\sstroke="', a) and not re.search(r'\sstroke="none"', a):
                    a = set_attr(a, 'stroke', col)
        out.append('<%s%s%s>' % (name, a, selfclose))
        if selfclose:
            stack.pop()
    out.append(svg[pos:])
    res = ''.join(out)
    if mode in ('normal', 'depth'):
        res = res.replace('<svg ', '<svg shape-rendering="crispEdges" ', 1)
    return res


def main(svg_path, light_path, prefix):
    svg = open(svg_path).read()
    planes = json.load(open(light_path))['planes']
    for mode in ('albedo', 'emissive', 'emask', 'normal', 'depth'):
        t = transform(svg, mode, planes)
        tmp = '%s_%s.svg' % (prefix, mode)
        open(tmp, 'w').write(t)
        subprocess.run(['rsvg-convert', tmp, '-o', '%s_%s.png' % (prefix, mode)], check=True)
    print('passes', prefix)


if __name__ == '__main__':
    main(*sys.argv[1:4])
