"""Render a region of a full-frame SVG at a zoom, straight from the vectors (review at 2x without rendering the whole frame
at 2x). Usage: python3 scenes/zoom_svg.py <in.svg> <out.png> <zoom> x0,y0,x1,y1"""
import re, subprocess, sys, tempfile, os
src, out, z = sys.argv[1], sys.argv[2], float(sys.argv[3])
fast = '--fast' in sys.argv          # drop the layer-wide wobble and grit filters (a quick look, not the final read)
x0, y0, x1, y1 = [float(v) for v in sys.argv[4].split(',')]
s = open(src).read()
head = re.match(r'<svg[^>]*>', s).group(0)
nh = re.sub(r'width="[^"]*"', 'width="%d"' % ((x1 - x0) * z), head, count=1)
nh = re.sub(r'height="[^"]*"', 'height="%d"' % ((y1 - y0) * z), nh, count=1)
nh = re.sub(r'viewBox="[^"]*"', 'viewBox="%g %g %g %g"' % (x0, y0, x1 - x0, y1 - y0), nh, count=1)
fd, tmp = tempfile.mkstemp(suffix='.svg'); os.close(fd)
body = s[len(head):]
if fast: body = body.replace('<g filter="url(#wob)"><g filter="url(#grit)">', '<g><g>')
open(tmp, 'w').write(nh + body)
subprocess.run(['rsvg-convert', tmp, '-o', out], check=True)
os.remove(tmp)
