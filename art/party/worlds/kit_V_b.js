// World V, The Storm Foundry, second batch: helpers for world_V_b.js. Built on kit_V (required, never edited).
// Fire (dominant) chars skin black and splits it in glowing seams; lightning leaves branching burns, fuses metal into
// flesh and stands hair and fur on end. No arcs or bolts are drawn on figures: strikes are engine effects.
'use strict';
const K = require('../kit');
const W = require('./kit_V');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const P = W.P;

// blackened, fire-split skin: soot-black with a warm umber light so the form still reads; craze texture
const CHAR = (f, o = {}) => Object.assign({ fill: '#3a2c24', shadow: '#120c09', light: '#7a6250', shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.45, maxShade: 40 }, o);
// sooted but not charred skin (faces kept legible)
const SOOT = (f, o = {}) => Object.assign({ fill: '#7a6252', shadow: '#2a1c16', light: '#b0927a', shade: 0.38, tex: 'mottle' + f.o.seed, texOp: 0.5, maxShade: 40 }, o);

// glowing seams split into charred skin inside region: n crack networks scattered round c
function charCracks(f, region, c, rx, ry, n, len = 50, w = 1.8, o = {}) {
  W.clipDraw(f, region, () => {
    for (let i = 0; i < n; i++) W.crackNet(f, W.scatter(f, c, rx, ry), o.a ?? f.r() * 6.3, len * W.R(f, 0.6, 1.2), w, { depth: o.depth ?? 1, fork: 0.5, glowOp: o.glowOp ?? 0.3 });
    if (o.after) o.after();
  });
}
// a heat-crazed net of polygonal plates (cracked like a hearth brick): seams round irregular cells inside region
function brickCracks(f, region, bb, cell, w = 2, o = {}) {
  W.clipDraw(f, region, () => {
    const pts = [];
    for (let y = bb[1]; y < bb[3] + cell; y += cell) for (let x = bb[0]; x < bb[2] + cell; x += cell) pts.push([x + W.R(f, -0.35, 0.35) * cell + ((y / cell) % 2) * cell * 0.5, y + W.R(f, -0.3, 0.3) * cell]);
    const cols = Math.ceil((bb[2] - bb[0]) / cell) + 1;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      for (const j of [i + 1, i + cols]) { const q = pts[j]; if (!q || E.len(sub(q, p)) > cell * 1.6 || f.r() < (o.skip ?? 0.25)) continue; const m = add(lerp(p, q, 0.5), [W.R(f, -1, 1) * cell * 0.12, W.R(f, -1, 1) * cell * 0.12]); W.seam(f, [p, m, q], w * W.R(f, 0.6, 1.1), { glowOp: o.glowOp ?? 0.25, hot: o.hot }); }
    }
  });
}
// an iron nail welded on by its head: a scorched weld bead, a square shank tapering to a point, black with a lit arris
function nail(f, base, a, len, w, o = {}) {
  const tip = add(base, rot([len, 0], a)), n = rot([0, 1], a);
  const sh = [add(base, mul(n, w / 2)), add(lerp(base, tip, 0.7), mul(n, w * 0.38)), tip, add(lerp(base, tip, 0.7), mul(n, -w * 0.38)), add(base, mul(n, -w / 2))].map(q => [q[0], q[1], 1]);
  f.part(sh, { fill: o.col || '#2a2624', shadow: '#000', light: '#6a645c', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false, gritOp: 0.3 });
  f.line([add(base, mul(n, w * 0.15)), add(lerp(base, tip, 0.85), mul(n, w * 0.08))], Math.max(0.6, w * 0.18), o.lit || '#9a948a', { op: 0.55, straight: true });
  if (o.head !== false) { const hd = [add(base, mul(n, w * 0.95)), add(add(base, mul(n, w * 0.9)), rot([w * 0.5, 0], a)), add(add(base, mul(n, -w * 0.9)), rot([w * 0.5, 0], a)), add(base, mul(n, -w * 0.95))].map(q => [q[0], q[1], 1]); f.part(hd, { fill: '#3a3430', shade: 0.3, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false }); }
  if (o.weld) { f.flat(ell(base, w * 1.2, w * 0.9, a, 8), '#1e1410', { op: 0.9 }); f.flat(ell(add(base, rot([-w * 0.3, -w * 0.3], a)), w * 0.45, w * 0.28, a, 6), '#8a7a62', { op: 0.6 }); if (o.hot) f.flat(ell(base, w * 0.5, w * 0.35, a, 6), P.lamp, { op: 0.8 }); }
  return tip;
}
// a coil of drawn wire seen from the side: n stacked loops of an ellipse (rx, ry) turned by a, each loop a dark core
// with a bright bronze crest, a few loops sprung loose
function wireCoil(f, c, rx, ry, a, n, w, o = {}) {
  const col = o.col || P.bronze, lit = o.lit || P.bronzeP, gap = o.gap ?? w * 0.9;
  const d = rot([0, 1], a), loops = [];
  for (let i = 0; i < n; i++) loops.push(add(c, mul(d, (i - (n - 1) / 2) * gap)));
  // the back halves first, darker, then the front halves on top
  for (const half of (o.only != null ? [o.only] : [0, 1])) loops.forEach((q, i) => {
    const sp = (o.sprung && o.sprung.includes(i) ? 1.18 : 1) * (1 + (o.jit ? Math.sin(i * 2.3) * o.jit : 0)), e = ell(q, rx * sp, ry * sp, a, 28), seg = half ? e.slice(0, 15) : e.slice(14).concat([e[0]]);
    f.line(seg, w + 2, INK, { op: half ? 0.95 : 0.7 });
    f.line(seg, w, half ? col : mix(col, '#000', 0.45));
    if (half) f.line(seg.slice(3, 10).map(z => add(z, mul(d, -w * 0.25))), Math.max(0.7, w * 0.35), lit, { op: 0.75 });
  });
  return loops;
}
// a clump of fur or hair: a tapered stroke from base along ang, curved, with a lit edge and a dark core
function clump(f, base, a, len, w, col, o = {}) {
  const bend = o.bend ?? 0, pts = [base, add(base, rot([len * 0.4, 0], a + bend * 0.3)), add(base, rot([len * 0.75, 0], a + bend * 0.7)), add(base, rot([len, 0], a + bend))];
  f.stroke(pts, w + 2.4, INK, { op: o.inkOp ?? 0.9 });
  f.stroke(pts, w, col);
  f.stroke(pts.slice(0, 3).map(q => add(q, rot([0, -w * 0.18], a))), w * 0.35, o.lit || mix(col, '#fff', 0.35), { op: 0.6 });
  if (o.tipCol) f.stroke(pts.slice(2), w * 0.45, o.tipCol, { op: 0.9 });
  return pts[3];
}
// a hearthstone / floor slab under a small creature: a worn stone with a chipped edge and soot
function slab(f, x0, x1, y, h, o = {}) {
  const pts = [[x0, y + 4, 1], [x0 + 10, y - h * 0.2], [x0 + 30, y - h], [x1 - 40, y - h - 4], [x1 - 8, y - h * 0.6], [x1, y + 4, 1]];
  f.part(pts, { fill: o.col || '#4a443e', shadow: '#16120e', light: '#8a8278', shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.6 });
  f.line([[x0 + 30, y - h + 3], [x1 - 40, y - h - 1]], 2, '#a8a094', { op: 0.4 });
  return pts;
}
// a carved wooden clog (sabot) cut for the rig like a boot: the shoe's form from B.boot in oak, then grain, a strap
// of iron nailed round the sole, and a worn, split toe
function clog(f, A, s, sfx, Kn, o = {}) {
  const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  return W.split(f, () => {
    K.B.boot(f, A, 1, s, o.col || '#5a4028', { shaft: o.shaft ?? 0.5, tex: 'wood' + f.o.seed, texOp: 0.5, toe: 1.32 });
    const gy = f.o.groundY, X = u => A[0] + u * s;
    f.line([[X(-0.4), gy - s * 0.12], [X(1.36), gy - s * 0.12]], 2.6, '#3a3632', { straight: true });
    for (const u of [-0.2, 0.3, 0.8, 1.2]) f.rivet([X(u), gy - s * 0.12], 1.6, '#8a847a');
    f.line([[X(1.1), gy - s * 0.45], [X(1.22), gy - s * 0.3]], 1.2, INK, { op: 0.7 }); // split in the toe
    f.line([[X(-0.2), A[1] + 4], [X(0.5), A[1] - 2]], 1.6, '#c8a878', { op: 0.35 });
  }, [['shin' + sfx, W.side(A, mul(da, -1), s * 0.36)], ['foot' + sfx, W.side(A, da, s * 0.36)]]);
}
// a Lichtenberg burn clipped to the part it is on (a scar never leaves the skin or metal it is burned into)
function lich(f, region, c, a, len, w, o = {}) { W.clipDraw(f, region, () => W.lichtenberg(f, c, a, len, w, o)); }
// nails welded all over a limb or flank: pts is the part's axis polyline, ws its widths there. Each nail stands out of
// the surface along its normal (points out), tilted at random; nails near the middle point at the viewer and are
// foreshortened to a head and a short shank. Drawn back to front so the nearest sit on top.
function bristle(f, pts, ws, n, len, o = {}) {
  const C = W.spline(pts, 4), S = W.arcLen(C), Lt = S[S.length - 1], wAt = u => { const t = u / Lt * (ws.length - 1), i = Math.min(ws.length - 2, Math.floor(t)); return ws[i] + (ws[i + 1] - ws[i]) * (t - i); };
  const list = [];
  for (let i = 0; i < n; i++) {
    const u = (o.u0 ?? 0) * Lt + f.r() * Lt * ((o.u1 ?? 1) - (o.u0 ?? 0)), q = W.at(C, S, u), s = (f.r() * 2 - 1) * (o.span ?? 0.95), w = wAt(u);
    const base = add(q.p, mul(q.n, s * w / 2)), sg = s >= 0 ? 1 : -1, out = Math.atan2(q.n[1] * sg, q.n[0] * sg) + (f.r() - 0.5) * (o.spread ?? 0.9) + (o.bias ?? 0);
    const fore = 0.25 + 0.75 * Math.abs(s) ** 0.7; // foreshortened toward the middle
    list.push({ base, a: out, l: W.R(f, len[0], len[1]) * fore, z: Math.abs(s) });
  }
  list.sort((a, b) => b.z - a.z);
  for (const k of list) nail(f, k.base, k.a, k.l, o.w ?? 4.2, { weld: f.r() < (o.weld ?? 0.5), hot: f.r() < 0.12 });
  return list;
}
// a Lichtenberg burn on dark hide or charred skin: thin branching scars, each a pale raised edge round a dark burnt
// core, no halo (it is a scar, not light); o.thread draws a white-gold fused thread along the trunk where the strike
// came in. Drawn as is: clip it with lich() style W.clipDraw if it may leave its part.
function fernSkin(f, c, a, len, w, o = {}) {
  const br = [];
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa;
    for (let i = 0; i < 5; i++) { b += (f.r() - 0.5) * 0.7; q = add(q, rot([L / 5, 0], b)); pts.push(q); }
    br.push([pts, ww]);
    if (depth > 0) for (let k = 1; k < 5; k++) if (f.r() < (o.fork ?? 0.6)) go(pts[k], b + (f.r() > 0.5 ? 1 : -1) * W.R(f, 0.45, 1.0), L * W.R(f, 0.3, 0.5), ww * 0.6, depth - 1);
  };
  go(c, a, len, w, o.depth ?? 2);
  for (const [pts, ww] of br) f.stroke(pts, ww + 1.6, o.lite || '#8e7462', { op: o.liteOp ?? 0.5 });
  for (const [pts, ww] of br) f.stroke(pts, Math.max(0.8, ww * 0.55), o.dark || '#100806', { op: 0.85 });
  if (o.thread) f.line(br[0][0].slice(0, 3), Math.max(0.8, w * 0.3), P.arcG, { op: 0.7 });
  return br;
}
// bake(f, rots, all): re-pose a finished figure, the way posetest.py poses a rig, so the rest pose itself carries the
// posture. rots = { bone: degrees } (screen degrees in build space, about each bone's own pivot, composed down the
// joint chain); all = [degrees, pivot] turns the whole figure (root included). Every drawn element is wrapped in
// nested rotate() groups (clip paths, masks and patterns are in its user space, so they turn with it), and every
// joint pivot is moved to its posed place, so the rig exports the baked pose with its parts still overlapping.
function bake(f, rots, all) {
  const J = f.joints, chain = b => { const c = []; while (b && J[b]) { c.unshift(b); b = J[b].parent; } return c; };
  const R = (p, deg, c) => { const a = deg * Math.PI / 180, d = sub(p, c); return add(c, rot(d, a)); };
  const xf = (p, bones) => { let q = p; for (const b of bones.slice().reverse()) if (rots[b]) q = R(q, rots[b], J[b].pivot); if (all) q = R(q, all[0], all[1]); return q; };
  const boneAt = []; f.marks.forEach((m, k) => { const end = k + 1 < f.marks.length ? f.marks[k + 1].i : f.out.length; for (let i = m.i; i < end; i++) boneAt[i] = m.bone; });
  f.out = f.out.map((s, i) => {
    let g = s; const ch = chain(boneAt[i] === 'root' ? null : boneAt[i]);
    for (const b of ch.slice().reverse()) if (rots[b]) g = `<g transform="rotate(${rots[b]} ${J[b].pivot[0]} ${J[b].pivot[1]})">${g}</g>`;
    if (all) g = `<g transform="rotate(${all[0]} ${all[1][0]} ${all[1][1]})">${g}</g>`;
    return g;
  });
  const np = {}; for (const b of Object.keys(J)) np[b] = xf(J[b].pivot, chain(J[b].parent));
  for (const b of Object.keys(J)) J[b].pivot = np[b].map(v => Math.round(v * 10) / 10);
  return f;
}
module.exports = { bake, fernSkin, bristle, lich, clog, CHAR, SOOT, charCracks, brickCracks, nail, wireCoil, clump, slab };
