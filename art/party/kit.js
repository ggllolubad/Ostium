// Shared building blocks for every Ostium figure in the Living Ink style (A bodies, C rendering).
'use strict';
const E = require('./engine');
const B = require('./body');
const G = require('./gear');
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const INK = '#1a120c';
// The one rendering setup for the whole cast. Foes are drawn facing right and flipped, so pass light: [0.6, -0.8] for them.
const base = (seed, o = {}) => Object.assign({ mode: 'ink', seed, ink: INK, shadowTint: '#2a1f2a', keyTint: '#fff3d8', rim: null, grimeY: 640, groundY: 790, mud: '#3a2a18', wobble: 1.8, inkW: 1.6, inkHeavy: 3.6 }, o);
const foeBase = (seed, o = {}) => base(seed, Object.assign({ light: [0.6, -0.8] }, o));
const ring = (f, c, rx, ry, w, col, o = {}) => { const e = ell(c, rx, ry, o.ang || 0, 14); f.line(e.concat([e[0]]), w, col, o); };
const rubric = '#9a2a1e';
// Size tiers: one pixel scale for the whole game (a 1.0 human stands about 640 px tall). Canvas [w, h], ground line = h - 30.
const TIERS = { small: [600, 820], human: [600, 820], large: [900, 1100], elite: [1100, 1400], ruler: [1600, 1600] };
// a soft tube along a polyline with no caps at the joints (sleeves, trouser legs, bare limbs).
// pts: joint points, ws: width at each joint, o.bp/o.bq: [[segment, t, amp]] bulges on the P (+normal) / Q side.
function chain(pts, ws, o = {}) {
  const P = [], Q = [], n = o.steps || 8;
  const samples = [];
  for (let s = 0; s < pts.length - 1; s++) for (let i = 0; i <= n; i++) { if (s > 0 && i === 0) continue; const t = i / n; samples.push({ c: lerp(pts[s], pts[s + 1], t), w: ws[s] + (ws[s + 1] - ws[s]) * t, s, t }); }
  samples.forEach((q, i) => {
    const a = samples[Math.max(0, i - 1)].c, b = samples[Math.min(samples.length - 1, i + 1)].c, d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
    const bump = arr => (arr || []).reduce((acc, [bs, bt, amp, sg]) => acc + (bs === q.s ? amp * Math.exp(-((q.t - bt) ** 2) / (2 * (sg || 0.2) ** 2)) : 0), 0);
    P.push(add(q.c, mul(nn, q.w / 2 * (1 + bump(o.bp))))); Q.push(add(q.c, mul(nn, -q.w / 2 * (1 + bump(o.bq)))));
  });
  return [...P, ...Q.reverse()];
}
// a limb whose far end is a ragged, torn or frayed hem instead of a round cap (rolled or torn sleeves)
function ragLimb(f, a, b, wa, wb, o = {}) {
  const steps = 10, pts = limb(a, b, wa, wb, Object.assign({ steps }, o, { capB: false }));
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], rag = [], k = o.teeth || 5;
  for (let i = 1; i < k; i++) { const u = wb / 2 - wb * i / k; rag.push([...add(add(b, mul(n, u)), mul(d, (i % 2 ? 1 : -0.3) * (o.depth || 9) * (0.6 + f.r() * 0.6))), 1]); }
  return [...pts.slice(0, steps + 1), ...rag, ...pts.slice(steps + 1)];
}
// bare lower leg and foot in one outline: calf, shin, ankle, Achilles, heel, arch, ball, big toe. dir +1 = toes right.
// top: centre of the leg where it leaves the cloth, wt: width there; s: foot length unit. Returns the outline.
function bareLeg(f, top, ankle, dir, s, wt, look, o = {}) {
  const gy = f.o.groundY, ax = ankle[0], ay = ankle[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir * u * s;
  const d = E.norm(sub(ankle, top)), nn = [d[1] * dir, -d[0] * dir];
  const at = (t, off) => add(lerp(top, ankle, t), mul(nn, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    at(0, wt / 2), at(0.35, wt * 0.46), at(0.7, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    at(0.72, -(wa * 0.62 + 2)), at(0.32, -wt * 0.5 * (1.14 + sw * 0.1)), at(0, -wt / 2),
  ];
  // far toes peeking past the big toe
  for (let i = 3; i >= 1; i--) { const tx = 1.0 - i * 0.075; f.part([[X(tx - 0.12), gy - h * (0.3 + i * 0.02)], [X(tx + 0.05), gy - h * (0.32 + i * 0.02)], [X(tx + 0.13), gy - h * 0.14], [X(tx + 0.1), gy - 1], [X(tx - 0.08), gy - 1]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.5, fill: mix(look.fill, '#2a2030', 0.15) })); }
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const ink = f.o.ink, dk = mix(look.fill, '#2a1c22', 0.5), lt = mix(look.fill, '#fff', 0.35);
  // anatomy lines: shin edge, ankle knob, Achilles, instep tendon, toe crease, nail
  f.line([at(0.1, wt * 0.3), at(0.5, wt * 0.3), at(0.8, wa * 0.4)], 1, lt, { op: 0.5 });
  f.line([[X(-0.06), ay + h * 0.2], [X(0.05), ay + h * 0.12], [X(0.12), ay + h * 0.26]], 1.1, ink, { op: 0.5 });
  f.line([[X(-0.25), ay - h * 0.1], [X(-0.27), gy - h * 0.42]], 1, dk, { op: 0.7 });
  f.line([[X(0.36), ay + h * 0.36], [X(0.64), gy - h * 0.5], [X(0.9), gy - h * 0.38]], 1, lt, { op: 0.6 });
  f.part([[X(1.0), gy - h * 0.35], [X(1.13), gy - h * 0.3], [X(1.23), gy - h * 0.18], [X(1.24), gy - h * 0.07], [X(1.13), gy - h * 0.05], [X(1.03), gy - h * 0.15]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.4, cast: false, shade: 0.35 }));
  f.flat([[X(1.13), gy - h * 0.27], [X(1.21), gy - h * 0.19], [X(1.22), gy - h * 0.11], [X(1.14), gy - h * 0.15]], o.nail || mix(look.fill, '#e8e0cc', 0.5), { op: 0.9 });
  f.line([[X(0.92), gy - 2], [X(1.02), gy - h * 0.13]], 1, ink, { op: 0.6 });
  f.line([[X(-0.18), gy - 2], [X(0.06), gy - 2]], 1.6, dk, { op: 0.6, straight: true });
  if (sw > 0) for (let i = 0; i < 3; i++) f.line([[X(0.46 + i * 0.13), gy - h * (0.42 - i * 0.05)], [X(0.5 + i * 0.13), gy - h * (0.28 - i * 0.05)]], 0.9, ink, { op: 0.45 });
  return pts;
}

module.exports = { E, B, G, INK, base, foeBase, ring, rubric, TIERS, chain, ragLimb, bareLeg };
