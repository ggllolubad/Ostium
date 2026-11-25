// Shared surface builders for rooms, the hub and doors: coursed masonry, voussoir arches, iron-strapped leaves.
const { G, INK, smooth, poly, blob } = require('../gr');
const { mix, dark } = require('./kit');
const f = n => +n.toFixed(1);
// coursed ashlar over the rect x0..x1, y0..y1; every block toned and chipped, mortar shadowed, top edges lit
function masonry(a, R, x0, y0, x1, y1, col, o = {}) {
  let out = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${dark(col, 0.3)}"/>`;
  let y = y1, row = 0;
  const course = o.course || 26;
  while (y > y0) {
    const ch = course * (0.85 + R() * 0.3), yt = Math.max(y0, y - ch);
    let x = x0 - (row % 2) * (o.block || 80) * 0.5 - R() * 20;
    while (x < x1) {
      const bw = (o.block || 80) * (0.7 + R() * 0.7), tone = mix(col, R() < 0.5 ? '#d8cbb0' : '#1a1410', R() * 0.22);
      const bx0 = Math.max(x0, x) + 1.5, bx1 = Math.min(x1, x + bw) - 1.5, ya = yt + 1.5, yb = y - 1.5, c = 2 + R() * 3;
      if (bx1 - bx0 > 6) {
        out += `<path d="M${f(bx0 + c)} ${f(ya)} L${f(bx1 - R() * 3)} ${f(ya + R() * 1.5)} L${f(bx1)} ${f(yb - c)} L${f(bx1 - c)} ${f(yb)} L${f(bx0 + R() * 2)} ${f(yb)} L${f(bx0)} ${f(ya + c)} Z" fill="${tone}" stroke="${INK}" stroke-width="${o.ink || 0.9}"/>`;
        out += `<path d="M${f(bx0 + 2)} ${f(yb - 2)} L${f(bx1 - 2)} ${f(yb - 2)}" stroke="${INK}" stroke-width="2.2" opacity="0.32"/><path d="M${f(bx0 + 3)} ${f(ya + 2)} L${f(bx1 - 6)} ${f(ya + 2)}" stroke="#fff4dc" stroke-width="1" opacity="0.16"/>`;
        if (R() < 0.1) out += `<path d="M${f(bx0 + (bx1 - bx0) * 0.3)} ${f(ya)} l${f(4 + R() * 6)} ${f(ch * 0.4)} l-3 ${f(ch * 0.5)}" stroke="${INK}" stroke-width="0.8" fill="none"/>`;
      }
      x += bw;
    }
    y = yt; row++;
  }
  out += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${a.hatchPat(70, 3.4, 0.5)}" opacity="0.3"/>`;
  for (let i = 0; i < (o.streaks || 8); i++) { const x = x0 + R() * (x1 - x0); out += `<path d="M${f(x)} ${y0} C${f(x + 6)} ${f(y0 + (y1 - y0) * 0.3)} ${f(x - 4)} ${f(y0 + (y1 - y0) * 0.6)} ${f(x + 2)} ${y1}" stroke="#140e0a" stroke-width="${f(8 + R() * 26)}" opacity="${f(0.08 + R() * 0.1)}" fill="none"/>`; }
  return out;
}
// a ring of wedge stones around an arch of half-width rw, centre (cx, cy), from angle 0 to pi
function voussoirs(R, cx, cy, rw, rh, depth, col, n = 11) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI * i / n, t1 = Math.PI * (i + 1) / n, P = (t, k) => [cx - Math.cos(t) * (rw + k), cy - Math.sin(t) * (rh + k)];
    const pts = [P(t0, 0), P(t1, 0), P(t1, depth), P(t0, depth)];
    out += `<path d="${poly(pts)}" fill="${mix(col, R() < 0.5 ? '#d8cbb0' : '#1a1410', R() * 0.2 + (i === Math.floor(n / 2) ? 0.1 : 0))}" stroke="${INK}" stroke-width="1.2"/>`;
    out += `<path d="M${f(pts[0][0])} ${f(pts[0][1])} L${f(pts[1][0])} ${f(pts[1][1])}" stroke="#fff4dc" stroke-width="1" opacity="0.18"/>`;
  }
  return out;
}
// a plank door leaf (polygon pts) with vertical boards, iron straps at the given heights, studs and a ring pull
function leaf(a, R, pts, x0, x1, ys, col = '#3a2e22') {
  a.shape({ d: poly(pts), fill: col, tex: 'url(#grain)', texOp: 0.6, depth: 8, hatch: 80, mottle: 0.3,
    lines: Array.from({ length: Math.max(2, Math.round((x1 - x0) / 14)) }, (_, i) => `M${f(x0 + (i + 1) * (x1 - x0) / (Math.round((x1 - x0) / 14) + 1))} ${f(Math.min(...pts.map(p => p[1])))} L${f(x0 + (i + 1) * (x1 - x0) / (Math.round((x1 - x0) / 14) + 1))} ${f(Math.max(...pts.map(p => p[1])))}`) });
  let o = '';
  for (const y of ys) { o += `<path d="M${f(x0)} ${f(y)} L${f(x1)} ${f(y - 2)} L${f(x1)} ${f(y + 6)} L${f(x0)} ${f(y + 8)} Z" fill="#2a2826" stroke="${INK}" stroke-width="1"/>`; for (let x = x0 + 4; x < x1 - 2; x += 9) o += `<circle cx="${f(x)}" cy="${f(y + 3)}" r="1.5" fill="#6a6660" stroke="${INK}" stroke-width="0.5"/>`; }
  return o;
}
module.exports = { masonry, voussoirs, leaf };
