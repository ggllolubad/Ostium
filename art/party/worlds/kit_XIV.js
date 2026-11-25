// World XIV, The Blighted Garden (Toxin + Void, Blight): local helpers. Shared files stay frozen; everything new lives
// here. Copied from reviewed kits so this world does not depend on their files: spline/arcLen/ik/clipDraw/ribbon/
// jointLimb/jcut/creases/fistDetail/tube/mlimb/humanJoints/rope/softTone/stains/crease/creaseField/offsetLine/hairClump/
// fullLeg/prune/openHand/muscleArm/placeFigure (kit_XIII, which took them from kit_IX, kit_I_a, kit_II, kit_VII,
// kit_keepers and kit_III); cutHoles (kit_XIII, rims recoloured); the cervid leg after the Silence Stag (world_XII);
// split/side (dirAC).
//
// Toxin (dominant) ripens and rots: swelling, pustules, fungal growth (bracket shelves, gilled caps, puffballs, coral),
// peeling, mould bloom, fruiting bodies, pastel blooms. Never slime puddles or neon green glow: everything is dry,
// furred and dull, and nothing glows.
// Void unmakes: clean round holes with clean rims (never ragged), eyes opening in the growth (a void world; the bible
// expects them here), lidded and blinking out of time, never round staring cartoon eyes.
// Palette: sick pastel blooms (pink, lilac, pale yellow) over black loam, with eyes; plus ink black, bone and grey.
// Colours the old entries name outside it (moss green, briar green, fawn, brown cloth) are rendered as rotted near-black
// greens (P.rot*) and loam browns (P.loam*), so the world stays inside its palette.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  // black loam and loam browns (soil, dead leather, brown cloth, the deer's coat)
  loam: '#1e1915', loamD: '#0f0c0a', loamL: '#3b3129', loamB: '#5c4b3d', loamBL: '#7e6a57', loamBS: '#2a201a',
  // rotted near-black greens (moss, briar, leaves)
  rot: '#262d25', rotD: '#121611', rotL: '#3e4a3a', rotS: '#0a0d09',
  // the sick pastels
  pink: '#bf98a0', pinkD: '#8a6670', pinkS: '#4a3038', pinkL: '#dcc4c8',
  lilac: '#a49aac', lilacD: '#6c6274', lilacS: '#38303e', lilacL: '#cbc4d0',
  yel: '#cfc495', yelD: '#958a5e', yelS: '#4e4832', yelL: '#e6dfc0',
  // bone white (the Mother's hide, eye whites, stems) and grey (dead wood, steel)
  bone: '#e6dfcf', boneS: '#8c8474', boneD: '#605a4e', boneL: '#f7f3ea',
  grey: '#8e8a86', greyD: '#5c5856', greyS: '#2c2a2b', greyL: '#bcb8b2',
  steel: '#55575d', steelD: '#2e3034', steelL: '#888a90',
  skin: '#d6c9c2', skinS: '#6a5462', skinD: '#a8949a',
  void: '#050407', rim: '#f2eaf2', rimD: '#5a4a6a',
};
// aliases used by the copied helpers
P.sack = P.loamB; P.ashL = P.boneL; P.ashD = P.greyD; P.black = P.void; P.char = P.loam; P.charD = P.loamD; P.charL = P.loamL; P.charS = P.loamD;
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.22), shadowTint: '#2a1f2e', keyTint: '#fff6ea', mud: '#1a1512' }, o));
const rnd = (f, a, b) => a + (b - a) * f.r();
const R = rnd;
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
const pd = pts => E.smooth(pts, false);

// texture patterns for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  // mfur: dense short hyphae for mould bloom and moth fur
  let m = '';
  for (let i = 0; i < 70; i++) { const x = r() * 30, y = r() * 30, a = r() * 6.3, l = 1.5 + r() * 2.5; m += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" stroke="${r() > 0.5 ? '#ffffff' : INK}" stroke-width="0.6" opacity="${(0.25 + r() * 0.4).toFixed(2)}"/>`; }
  f.defs.push(`<pattern id="mfur${s}" patternUnits="userSpaceOnUse" width="30" height="30">${m}</pattern>`);
  // bark: long furrows with cross checks (dead oak, roots)
  let b = '';
  for (let i = 0; i < 12; i++) { const x = r() * 40; b += `<path d="M${x.toFixed(1)},0 q${((r() - 0.5) * 6).toFixed(1)},20 ${((r() - 0.5) * 4).toFixed(1)},40 t${((r() - 0.5) * 4).toFixed(1)},40" fill="none" stroke="${INK}" stroke-width="${(0.8 + r() * 1.2).toFixed(1)}" opacity="0.7"/>`; }
  for (let i = 0; i < 10; i++) { const x = r() * 40, y = r() * 80; b += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(3 + r() * 4).toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="bark${s}" patternUnits="userSpaceOnUse" width="40" height="80">${b}</pattern>`);
  // grain: wood split along the grain (handles, the ladder of a trowel)
  let g = '';
  for (let i = 0; i < 9; i++) { const y = r() * 60; g += `<path d="M0,${y.toFixed(1)} q15,${((r() - 0.5) * 4).toFixed(1)} 30,0 t30,${((r() - 0.5) * 3).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${(0.7 + r() * 0.6).toFixed(1)}" opacity="0.7"/>`; }
  f.defs.push(`<pattern id="grain${s}" patternUnits="userSpaceOnUse" width="60" height="60">${g}</pattern>`);
  // velvet nap for moth wings: soft scale rows
  let v = '';
  for (let i = 0; i < 40; i++) { const x = r() * 24, y = r() * 24; v += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q1.5,-1.2 3,0" fill="none" stroke="${INK}" stroke-width="0.6" opacity="${(0.3 + r() * 0.3).toFixed(2)}"/>`; }
  f.defs.push(`<pattern id="scale${s}" patternUnits="userSpaceOnUse" width="24" height="24">${v}</pattern>`);
  f.defs.push(`<filter id="puff${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>`);
}

function spline(ctrl, step = 4) {
  const out = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(E.len(sub(p2, p1)) / step));
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  out.push(ctrl[ctrl.length - 1].slice(0, 2));
  return out;
}
const arcLen = C => { const s = [0]; for (let i = 1; i < C.length; i++) s.push(s[i - 1] + E.len(sub(C[i], C[i - 1]))); return s; };
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), b0 = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], b0 + sign * a)), Wr];
}
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], 1]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
function ribbon(C, W, o = {}) {
  const Pp = [], Q = [], n = C.length;
  C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)), m = [-d[1], d[0]]; Pp.push(add(c, mul(m, W[i] / 2 * (o.p ? o.p(i / (n - 1)) : 1)))); Q.push(add(c, mul(m, -W[i] / 2 * (o.q ? o.q(i / (n - 1)) : 1)))); });
  return [...Pp, ...Q.reverse()];
}
// anatomical limb through three joints: bony point on the outside of the bend, muscle bellies inside
function jointLimb(A, J, Bp, ws, o = {}) {
  const out = E.norm(mul(add(E.norm(sub(A, J)), E.norm(sub(Bp, J))), -1));
  const sideOf = (a, b) => { const d = E.norm(sub(b, a)), n = [-d[1], d[0]]; return n[0] * out[0] + n[1] * out[1] > 0 ? 'p' : 'q'; };
  const s0 = sideOf(A, J), s1 = sideOf(J, Bp), bp = [], bq = [], push = (sd, v) => (sd === 'p' ? bp : bq).push(v), opp = sd => (sd === 'p' ? 'q' : 'p');
  push(s0, [0, 1, o.point ?? 0.45, 0.07]); push(s1, [1, 0, o.point ?? 0.45, 0.07]);
  push(opp(s0), [0, o.mus0At ?? 0.45, o.mus0 ?? 0.2, 0.2]); push(opp(s1), [1, 0.22, o.mus1 ?? 0.24, 0.14]);
  push(s1, [1, 0.35, (o.mus1 ?? 0.24) * 0.5, 0.18]);
  return K.chain([A, J, Bp], ws, { bp, bq, steps: 10 });
}
// joint cuts for split(): parent keeps the side toward A, child the side toward Bp, both own a disk of radius r
const jcut = (A, J, Bp, r) => [side(J, mul(E.norm(sub(J, A)), -1), r), side(J, E.norm(sub(Bp, J)), r)];
function creases(f, c, a0, len, n, col, op = 0.55) {
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * len * 0.22, a = a0 + (f.r() - 0.5) * 0.3, p = add(c, rot([0, o], a0)); f.line([add(p, rot([-len / 2, 0], a)), add(p, rot([0, len * 0.06], a)), add(p, rot([len / 2, 0], a))], 1, col, { op: op * (0.6 + f.r() * 0.4) }); }
}
// knuckle heads, finger-joint creases and a thumbnail on a B.grip fist
function fistDetail(f, g, s, col, o = {}) {
  const F = g.F, dk = mix(col, '#1a1414', 0.5), lt = mix(col, '#ffffff', 0.4);
  for (let i = 0; i < 4; i++) { const y = -0.45 + i * 0.3; f.flat(F(ell([0.34, y], 0.1, 0.11, 0, 8)), lt, { op: 0.45 }); f.line(F([[0.28, y + 0.1], [0.4, y + 0.12]]), 0.9, dk, { op: 0.6 }); }
  for (let i = 0; i < 4; i++) { const y = -0.5 + i * 0.3; f.line(F([[0.5, y + 0.06], [0.56, y + 0.12], [0.54, y + 0.2]]), 0.9, dk, { op: 0.55 }); }
  f.part(F([[0.38, -0.82], [0.56, -0.8], [0.6, -0.68], [0.44, -0.66]]), { fill: o.nail || mix(col, '#d8d4cc', 0.4), shade: 0.3, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
  if (o.wrinkle !== false) for (let i = 0; i < 3; i++) f.line(F([[-0.6 + i * 0.12, -0.3], [-0.55 + i * 0.12, 0.3]]), 0.8, dk, { op: 0.4 });
  if (o.tips) for (let i = 0; i < 4; i++) { const y = -0.6 + i * 0.3; f.flat(F([[0.62, y], [0.86, y + 0.02], [0.88, y + 0.24], [0.62, y + 0.26]]), o.tips, { op: 0.9 }); }
}
function tube(pts, ws, capK = 0.9) {
  const o = K.chain(pts, ws, { steps: 6 }), n = o.length / 2, Pp = o.slice(0, n), Q = o.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = ws[ws.length - 1] / 2, cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(b, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * capK)))); }
  return [...Pp, ...cap, ...Q];
}
function mlimb(a, b, Pp, Q, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  const sd = (arr, sg) => arr.map(([t, w, sh]) => { const q = add(lerp(a, b, t), mul(n, sg * w)); return sh ? [...q, 1] : q; });
  const pp = sd(Pp, 1), qq = sd(Q, -1), ck = o.capK ?? 0.75, out = [...pp];
  const wpB = Pp[Pp.length - 1][1], wqB = Q[Q.length - 1][1], cB = lerp(lerp(a, b, Pp[Pp.length - 1][0]), lerp(a, b, Q[Q.length - 1][0]), 0.5);
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(cB, add(mul(n, Math.cos(an) * w), mul(d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...qq.reverse());
  const wpA = Pp[0][1], wqA = Q[0][1], cA = lerp(lerp(a, b, Pp[0][0]), lerp(a, b, Q[0][0]), 0.5);
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(cA, add(mul(n, -Math.cos(an) * w), mul(d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
// rope or cord: a twisted line with lay ticks, frozen stiff
function rope(f, pts, w, col = P.sack, o = {}) {
  const C = spline(pts, 3);
  f.line(C, w + 2, INK, { op: 0.9 }); f.line(C, w, col);
  for (let i = 1; i < C.length - 1; i += 2) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, w * 0.45)), add(add(C[i], mul(d, w * 0.5)), mul(n, -w * 0.45))], 0.8, mix(col, '#000', 0.5), { op: 0.7, straight: true }); }
  if (o.lit !== false) f.line(C.map(q => add(q, [w * 0.15, -w * 0.25])), Math.max(0.8, w * 0.2), P.ashL, { op: 0.4 });
  if (o.fray) { const e = C[C.length - 1], d = E.norm(sub(e, C[C.length - 2])); for (let k = -2; k <= 2; k++) f.line([e, add(e, rot(mul(d, w * 1.6 + f.r() * w), k * 0.28))], 0.9, col, { op: 0.9 }); }
  return C;
}

// ---- realism helpers (copied from kit_II)
function softTone(f, clipD, list) {
  const cid = f.id('sc'); f.defs.push(`<clipPath id="${cid}"><path d="${clipD}"/></clipPath>`);
  f._sb = f._sb || {};
  let g = `<g clip-path="url(#${cid})">`;
  for (const [pts, col, op, bl] of list) {
    const fid = `sb${f.o.seed}_${bl}`;
    if (!f._sb[fid]) { f._sb[fid] = 1; f.defs.push(`<filter id="${fid}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${bl}"/></filter>`); }
    g += `<path d="${E.smooth(pts, true, 1)}" fill="${col}" opacity="${op}" filter="url(#${fid})"/>`;
  }
  f.raw(g + '</g>');
}
const hex01 = h => [1, 3, 5].map(i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3));
// blotchy stain from fractal noise, clipped to a shape (damp, grave-wax, mould tide marks). bb = [x0,y0,x1,y1]
function stains(f, clipD, bb, col, freq, a, b, seedOff, op = 1, oct = 4) {
  const id = f.id('st'), cid = f.id('sc'), [r, g, bl] = hex01(col);
  f.defs.push(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${bb[0]}" y="${bb[1]}" width="${bb[2] - bb[0]}" height="${bb[3] - bb[1]}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${f.o.seed + seedOff}"/><feColorMatrix values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${bl}  ${a} 0 0 0 ${b}"/></filter>`);
  f.defs.push(`<clipPath id="${cid}"><path d="${clipD}"/></clipPath>`);
  f.raw(`<g clip-path="url(#${cid})"><rect x="${bb[0]}" y="${bb[1]}" width="${bb[2] - bb[0]}" height="${bb[3] - bb[1]}" filter="url(#${id})" opacity="${op}"/></g>`);
}
// a skin crease: dark tapered valley with a thin lit lip on the wall that faces the key light
function crease(f, pts, w, o = {}) {
  const L = f.L, off = mul([-L[0], -L[1]], o.lip ?? Math.max(1.5, w * 0.7));
  f.stroke(pts, w, o.col || '#1a1614', { op: o.op ?? 0.75 });
  if (o.light !== false && pts.length > 2) f.line(pts.slice(1, -1).map(q => add(q, off)), Math.max(0.8, w * 0.32), o.lit || '#d0d2c4', { op: o.litOp ?? 0.45 });
}
function creaseField(f, c, rx, ry, n, dir, len, w, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = dir + (f.r() - 0.5) * (o.spread ?? 0.35), l = len * (0.5 + f.r() * 0.7), d = rot([1, 0], a), nn = [-d[1], d[0]];
    const bend = (o.bend ?? 0.12) * l * (f.r() > 0.3 ? 1 : -1);
    crease(f, [add(p, mul(d, -l / 2)), add(add(p, mul(d, -l / 6)), mul(nn, bend)), add(add(p, mul(d, l / 6)), mul(nn, bend)), add(p, mul(d, l / 2))], w * (0.6 + f.r() * 0.6), o);
  }
}
function offsetLine(pts, off) {
  const n = pts.length;
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)); return add(p, mul([-d[1], d[0]], off(i / (n - 1)))); });
}
// a clump of matted hair or fur along path (root to tip): dark gap, tapered body, strands converging on the tip
function hairClump(f, path, w, o = {}) {
  const pal = o.pal || [P.charD, P.char, P.charL, P.ashD];
  const b0 = o.base || pal[Math.floor(f.r() * pal.length)];
  const tw = t => Math.sin(Math.PI * (0.1 + 0.85 * t)) * (t < 0.15 ? 0.6 + t * 2.6 : 1);
  if (o.gap !== false) f.stroke(path, w + 4, INK, { op: 0.85 });
  f.stroke(path, w, b0);
  const n = o.n || Math.max(3, Math.round(w / 6));
  for (let k = 0; k < n; k++) {
    const s = (k / (n - 1) - 0.5) * w * 0.7, j = (f.r() - 0.5) * 3;
    const pts = offsetLine(path, t => (s + j) * tw(t) * 0.95);
    const t0 = Math.floor(f.r() * 2), t1 = pts.length - Math.floor(f.r() * 2);
    f.line(pts.slice(t0, Math.max(t0 + 2, t1)), 0.7 + f.r() * 1.0, f.r() > 0.45 ? mix(b0, '#000', 0.45) : mix(b0, '#e8e8dc', 0.3), { op: 0.75 });
  }
  if (o.sheen) { const pts = offsetLine(path, t => w * 0.16 * tw(t)); f.line(pts.slice(1, -1), Math.max(1, w * 0.08), o.sheen, { op: 0.55 }); }
}
// a whole bare leg in one outline, hip to toes. dir +1 = toes right. wH/wK: width at hip and knee; s: foot unit.
function fullLeg(f, Hp, Kn, A, dir, s, wH, wK, look, o = {}) {
  const gy = o.groundY ?? f.o.groundY, ax = A[0], ay = A[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir * u * s;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d[1] * dir, -d[0] * dir]; };
  const nT = nrm(Hp, Kn), nS = nrm(Kn, A), nK = E.norm(add(nT, nS));
  const tq = o.thigh ?? 0.08;
  const at = (t, off) => add(lerp(Kn, A, t), mul(nS, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    add(Hp, mul(nT, wH / 2)), add(lerp(Hp, Kn, 0.4), mul(nT, wH * 0.5 * (1 + tq))), add(lerp(Hp, Kn, 0.8), mul(nT, (wH + wK) * 0.25)),
    add(Kn, mul(nK, wK * 0.56)), at(0.18, wK * 0.46), at(0.45, wK * 0.4), at(0.72, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    at(0.72, -(wa * 0.62 + 2)), at(0.36, -wK * 0.5 * (1.18 + sw * 0.1)), at(0.12, -wK * 0.52), add(Kn, mul(nK, -wK * 0.5)),
    add(lerp(Hp, Kn, 0.6), mul(nT, -wH * 0.5 * (1 + tq * 0.6))), add(Hp, mul(nT, -wH / 2)),
  ];
  for (let i = 3; i >= 1; i--) { const tx = 1.0 - i * 0.075; f.part([[X(tx - 0.12), gy - h * (0.3 + i * 0.02)], [X(tx + 0.05), gy - h * (0.32 + i * 0.02)], [X(tx + 0.13), gy - h * 0.14], [X(tx + 0.1), gy - 1], [X(tx - 0.08), gy - 1]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.5, fill: mix(look.fill, '#1a1410', 0.2) })); }
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const dk = mix(look.fill, '#1a1410', 0.5), lt = mix(look.fill, '#fff', 0.3);
  f.line([add(Kn, mul(nK, wK * 0.5)), add(add(Kn, mul(nK, wK * 0.2)), mul(sub(A, Kn), 0.06)), add(add(Kn, mul(nK, wK * 0.45)), mul(sub(A, Kn), 0.14))], 1.2, INK, { op: 0.55 });
  f.line([add(Kn, mul(nK, -wK * 0.2)), add(add(Kn, mul(nK, -wK * 0.45)), mul(sub(Kn, Hp), -0.03))], 1, INK, { op: 0.5 });
  f.line([at(0.12, wK * 0.28), at(0.5, wK * 0.26), at(0.82, wa * 0.4)], 1, lt, { op: 0.5 });
  f.line([[X(-0.06), ay + h * 0.2], [X(0.05), ay + h * 0.12], [X(0.12), ay + h * 0.26]], 1.1, INK, { op: 0.5 });
  f.line([[X(-0.25), ay - h * 0.1], [X(-0.27), gy - h * 0.42]], 1, dk, { op: 0.7 });
  f.line([[X(0.36), ay + h * 0.36], [X(0.64), gy - h * 0.5], [X(0.9), gy - h * 0.38]], 1, lt, { op: 0.6 });
  f.part([[X(1.0), gy - h * 0.35], [X(1.13), gy - h * 0.3], [X(1.23), gy - h * 0.18], [X(1.24), gy - h * 0.07], [X(1.13), gy - h * 0.05], [X(1.03), gy - h * 0.15]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.4, cast: false, shade: 0.35 }));
  f.flat([[X(1.13), gy - h * 0.27], [X(1.21), gy - h * 0.19], [X(1.22), gy - h * 0.11], [X(1.14), gy - h * 0.15]], o.nail || mix(look.fill, '#e8e4d4', 0.5), { op: 0.9 });
  f.line([[X(0.92), gy - 2], [X(1.02), gy - h * 0.13]], 1, INK, { op: 0.6 });
  f.line([[X(-0.18), gy - 2], [X(0.06), gy - 2]], 1.6, dk, { op: 0.6, straight: true });
  return pts;
}
// ---- hands (copied from kit_I_a openHand, without its drowned-skin pucker and peel unless asked)
function prune(f, a, b, w, n, op = 0.5) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
  for (let i = 0; i < n; i++) { const o = (i / (n - 1) - 0.5) * w * 0.7, p0 = add(a, mul(nn, o)), p1 = add(b, mul(nn, o * 0.8)); f.line([p0, add(lerp(p0, p1, 0.33), mul(nn, 1.6)), add(lerp(p0, p1, 0.66), mul(nn, -1.6)), p1], 0.9, INK, { op }); }
}
// An open hand. c: wrist, a0: wrist to middle knuckle (screen radians), s: hand length (wrist to middle fingertip).
// +v is the thumb side (o.flip puts it on -v). o.back shows the back (nails, knuckles, tendons). o.curl 0..1, o.spread,
// o.bend per finger, o.tips: fingertip colour (frostbite), o.nail colour, o.swell.
function openHand(f, c, a0, s, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(c, a0, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg]));
  const back = !!o.back, look = o.look, sp = o.spread ?? 0.14, cu = o.curl ?? 0.2, sw = 1 + (o.swell ?? 0.1);
  const sh = look.shadow || mix(look.fill, '#000', 0.4), dk = mix(sh, '#000', 0.3), lt = mix(look.fill, '#fff', 0.45);
  const part = (q, st) => f.part(q, Object.assign({}, look, { cast: false, hatch: false }, st || {}));
  const FG = [[0.405, -0.17, 0.4, 0.088], [0.45, -0.062, 0.5, 0.097], [0.465, 0.048, 0.545, 0.1], [0.44, 0.158, 0.49, 0.097]];
  const fing = FG.map(([u, v, L, w], i) => {
    const a = (i - 1.9) * sp + (o.bend || [0, 0, 0, 0])[i], d = [Math.cos(a), Math.sin(a)], k0 = [u, v], cc = (o.curls || [])[i] ?? cu;
    const l1 = L * 0.46, l2 = L * 0.3 * (1 - cc * 0.45), l3 = L * 0.24 * (1 - cc * 0.62);
    const k1 = add(k0, mul(d, l1)), k2 = add(k1, mul(d, l2)), k3 = add(k2, mul(d, l3)), W = w * sw;
    return { k0: F([k0])[0], k1: F([k1])[0], k2: F([k2])[0], k3: F([k3])[0], kb: F([add(k0, mul(d, -0.05))])[0], W: W * s, cut: (o.cut || [])[i] };
  });
  const thB = [0.07, 0.19], ta = (o.thumbAng ?? 0.9), td = [Math.cos(ta), Math.sin(ta)], th1 = add(thB, mul(td, 0.24)), td2 = [Math.cos(ta - 0.25), Math.sin(ta - 0.25)], th2 = add(th1, mul(td2, 0.2 * (1 - cu * 0.3)));
  const tipC = o.tips;
  const nail = (a, b, w) => {
    const q = [lp(a, b, 0.3, w * 0.3), lp(a, b, 0.86, w * 0.34), lp(a, b, 1.04, w * 0.1), lp(a, b, 1.04, -w * 0.12), lp(a, b, 0.86, -w * 0.34), lp(a, b, 0.3, -w * 0.28)];
    f.part(q, { fill: o.nail || mix(look.fill, '#5a5a52', 0.5), shadow: '#22221e', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: look.tex, texOp: 0.5 });
    for (const off of [-0.14, 0.08]) f.line([lp(a, b, 0.4, w * off), lp(a, b, 0.96, w * off * 1.1)], 0.8, INK, { op: 0.45 });
    f.line([lp(a, b, 1.0, w * 0.05), lp(a, b, 0.78, w * 0.12), lp(a, b, 0.66, -w * 0.04)], 1, INK, { op: 0.7 });
  };
  const thumb = () => {
    part(tube([F([add(thB, mul(td, -0.06))])[0], F([th1])[0], F([th2])[0]], [0.15 * sw * s, 0.125 * sw * s, 0.105 * sw * s]), { inkW: 1.4, inkHeavy: 2.1, maxShade: 0.05 * s });
    const a = F([th1])[0], b = F([th2])[0], ww = 0.11 * sw * s;
    if (tipC) part(tube([lerp(a, b, 0.35), b], [ww * 1.05, ww * 0.95]), { fill: tipC, shadow: mix(tipC, '#000', 0.4), inkW: 0.8, inkHeavy: 0, tex: undefined });
    f.line([lp(a, b, -0.04, ww * 0.55), lp(a, b, 0.02, 0), lp(a, b, -0.04, -ww * 0.55)], 1.4, dk, { op: 0.75 });
    if (back) nail(a, b, ww); else if (o.prune) prune(f, lp(a, b, 0.45, 0), lp(a, b, 0.92, 0), ww, 4);
  };
  const finger = g => {
    const ws = [g.W, g.W * 0.94, g.W * 0.86, g.W * 0.78];
    if (g.cut) { part(K.chain([g.kb, g.k1, lerp(g.k1, g.k2, g.cut)], ws.slice(0, 3)), { inkW: 1.4, inkHeavy: 2.1 }); const e = lerp(g.k1, g.k2, g.cut); f.flat(ell(e, ws[2] * 0.36, ws[2] * 0.3, 0, 8), tipC || P.black, { op: 0.9 }); return; }
    part(tube([g.kb, g.k1, g.k2, g.k3], ws), { inkW: 1.4, inkHeavy: 2.1, maxShade: g.W * 0.35 });
    if (tipC) part(tube([lerp(g.k1, g.k2, 0.55), g.k2, g.k3], [ws[2] * 1.02, ws[2], ws[3]]), { fill: tipC, shadow: mix(tipC, '#000', 0.4), inkW: 0.8, inkHeavy: 0, tex: undefined });
    for (const [k, w, pa, pb] of [[g.k1, ws[1], g.k0, g.k2], [g.k2, ws[2], g.k1, g.k3]]) {
      const dd = E.norm(sub(pb, pa)), nn = [-dd[1], dd[0]];
      if (back) {
        for (let i = 0; i < 3; i++) { const c0 = add(k, mul(dd, (i - 1) * w * 0.15)); f.line([add(c0, mul(nn, -w * 0.34)), add(c0, mul(dd, -w * 0.09)), add(c0, mul(nn, w * 0.34))], i === 1 ? 1.3 : 0.9, INK, { op: 0.55 }); }
        f.flat(ell(k, w * 0.2, w * 0.14, Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), 8), lt, { op: 0.3 });
      } else for (const off of [-0.05, 0.05]) f.line([add(add(k, mul(dd, off * w)), mul(nn, w * 0.42)), add(add(k, mul(dd, off * w + 1)), mul(nn, 0)), add(add(k, mul(dd, off * w)), mul(nn, -w * 0.42))], off < 0 ? 1.5 : 1.1, dk, { op: 0.8 });
    }
    if (back) nail(g.k2, g.k3, ws[3]); else if (o.prune) prune(f, lerp(g.k2, g.k3, 0.25), lerp(g.k2, g.k3, 0.95), ws[3], 4);
  };
  const palm = F([[-0.06, -0.15], [0.06, -0.2], [0.24, -0.215], [0.4, -0.22], [0.47, -0.13], [0.49, 0.0], [0.48, 0.12], [0.45, 0.21], [0.3, 0.24], [0.16, 0.26], [0.04, 0.23], [-0.06, 0.12]]);
  if (back) {
    thumb();
    part(palm, { inkW: 1.6, inkHeavy: 2.6, maxShade: 0.1 * s });
    fing.forEach(finger);
    fing.forEach(g => { f.flat(ell(g.k0, g.W * 0.34, g.W * 0.24, a0, 10), lt, { op: 0.35 }); f.line([lp(g.k0, g.k1, 0.05, g.W * 0.5), lp(g.k0, g.k1, -0.02, 0), lp(g.k0, g.k1, 0.05, -g.W * 0.5)], 1.2, dk, { op: 0.6 }); f.line([F([[0.04, 0.0]])[0], lerp(F([[0.04, 0.0]])[0], g.k0, 0.5), g.k0].map((q, i) => i === 1 ? add(q, mul(rot([0, 1], a0), sg * 3)) : q), 1.8, lt, { op: 0.35 }); f.line([F([[0.06, 0.012]])[0], lerp(F([[0.06, 0.012]])[0], g.k0, 0.94)], 1, dk, { op: 0.4 }); });
    if (o.vein !== false) f.line(F([[0.02, -0.1], [0.14, -0.04], [0.22, 0.06], [0.3, 0.04], [0.38, 0.12]]), 1.8, mix(sh, '#3e4a44', 0.3), { op: 0.5 });
  } else {
    fing.forEach(finger);
    part(palm, { inkW: 1.6, inkHeavy: 2.6 });
    fing.forEach(g => part(ell(lerp(g.k0, g.k1, 0.08), g.W * 0.48, g.W * 0.36, a0 + Math.PI / 2, 12), { inkW: 1, inkHeavy: 1.2, maxShade: 8 }));
    part(F([[0.0, 0.04], [0.12, 0.02], [0.24, 0.12], [0.22, 0.24], [0.08, 0.26], [-0.04, 0.16]]), { inkW: 1.1, inkHeavy: 1.4, maxShade: 14 });
    f.line(F([[0.36, -0.2], [0.33, -0.08], [0.36, 0.04], [0.42, 0.13]]), 1.8, dk, { op: 0.8 });
    f.line(F([[0.3, 0.2], [0.27, 0.06], [0.22, -0.06], [0.24, -0.18]]), 1.6, dk, { op: 0.75 });
    f.line(F([[0.3, 0.19], [0.18, 0.12], [0.06, 0.1], [0.0, 0.04]]), 1.6, dk, { op: 0.75 });
    thumb();
  }
  return { fing, thumb: [F([thB])[0], F([th1])[0], F([th2])[0]], F };
}
// ---------------------------------------------------------------- anatomy (after the reviewed Cauldron Bearer, kit_III)
// A muscled arm from explicit profiles: the deltoid swelling at the top of the outer edge, biceps inside the bend, triceps
// behind, the elbow's bony point, the forearm's thick muscle below the elbow tapering hard to the wrist; soft light along
// the top and soft shade along the underside, clipped to the limb. Upper arm and forearm are separate overlapping parts.
function muscleArm(f, S0, E0, W0, wU, wF, look, sfx, o = {}) {
  const lit = o.lit || mix(look.fill, '#ffffff', 0.3), dark = o.dark || mix(look.shadow || '#000', '#000', 0.3);
  const dU = E.norm(sub(E0, S0)), dF = E.norm(sub(W0, E0)), nU = [-dU[1], dU[0]], nF = [-dF[1], dF[0]];
  const inU = (dF[0] * nU[0] + dF[1] * nU[1]) > 0 ? 1 : -1, inF = (dU[0] * nF[0] + dU[1] * nF[1]) < 0 ? 1 : -1;
  const sc = (arr, w) => arr.map(([t, k]) => [t, k * w]);
  const bic = sc([[0, 0.44], [0.2, 0.5], [0.48, 0.56], [0.72, 0.5], [0.9, 0.4], [1, 0.38]], wU), tri = sc([[0, 0.52], [0.12, 0.58], [0.32, 0.55], [0.55, 0.5], [0.8, 0.46], [1, 0.44]], wU);
  const flx = sc([[0, 0.44], [0.16, 0.5], [0.4, 0.44], [0.72, 0.33], [1, 0.3]], wF), ext = sc([[0, 0.5], [0.2, 0.58], [0.42, 0.5], [0.74, 0.36], [1, 0.32]], wF);
  const u = (t, k) => lp(S0, E0, t, k * wU * inU), fa = (t, k) => lp(E0, W0, t, k * wF * inF);
  const tone = (shape, list) => softTone(f, E.smooth(shape), list);
  f.bone(o.bones ? o.bones[0] : 'upperarm' + sfx);
  const up = mlimb(S0, E0, inU > 0 ? bic : tri, inU > 0 ? tri : bic, { capK: 0.8 });
  f.part(up, Object.assign({}, look, { maxShade: wU * 0.3 }));
  tone(up, [[[u(0, -0.7), u(0.5, -0.66), u(1, -0.6), u(1, -0.3), u(0.5, -0.32), u(0, -0.36)], lit, 0.3, 6], [[u(0.1, 0.7), u(0.5, 0.72), u(1, 0.6), u(1, 0.3), u(0.5, 0.36), u(0.1, 0.36)], dark, 0.35, 6]]);
  f.stroke([u(0.04, -0.5), u(0.3, -0.36), u(0.44, -0.1)], 2.4, dark, { op: 0.55 }); // the deltoid's lower edge
  f.stroke([u(0.4, 0.0), u(0.62, 0.06), u(0.86, 0.02)], 2, dark, { op: 0.45 }); // biceps against triceps
  f.line([u(0.2, -0.46), u(0.5, -0.44), u(0.8, -0.4)], 2.2, lit, { op: 0.45 });
  f.bone(o.bones ? o.bones[1] : 'forearm' + sfx);
  const fo = mlimb(E0, W0, inF > 0 ? flx : ext, inF > 0 ? ext : flx, { capK: 0.9 });
  f.part(fo, Object.assign({}, look, { maxShade: wF * 0.28 }));
  tone(fo, [[[fa(0, -0.7), fa(0.5, -0.6), fa(1, -0.5), fa(1, -0.2), fa(0.5, -0.25), fa(0, -0.3)], lit, 0.25, 5]]);
  f.part(ell(add(E0, mul(E.norm(sub(dU, dF)), wU * 0.36)), wU * 0.16, wU * 0.12, Math.atan2(dU[1], dU[0]), 10), Object.assign({}, look, { cast: false, inkW: 1.1, inkHeavy: 1.4, hatch: false, maxShade: 5, fill: mix(look.fill, lit, 0.25) })); // the elbow's point
  for (let i = 0; i < 3; i++) f.line([fa(0.02 + i * 0.03, 0.42), fa(0.05 + i * 0.03, 0.1), fa(0.02 + i * 0.03, -0.2)], 1.1, dark, { op: 0.45 }); // skin creased at the bend
  f.stroke([fa(0.1, -0.1), fa(0.4, -0.06), fa(0.75, -0.02)], 2, dark, { op: 0.4 }); // between the forearm's muscle groups
  if (o.vein !== false) f.line([fa(0.2, 0.3), fa(0.45, 0.2), fa(0.6, 0.26), fa(0.85, 0.16)], 1.6, mix(look.fill, '#4a3a5a', 0.5), { op: 0.45 });
  f.line([fa(0.12, -0.5), fa(0.4, -0.44)], 2, lit, { op: 0.4 });
  return { u, fa, up, fo };
}
// wrap everything drawn since i0 in a transform (scale k about `from`, then move it to `to`); joints named in `bones`
// move the same way. Used to set a whole figure at its true size without retyping its coordinates.
function placeFigure(f, i0, k, from, to, bones = []) {
  const tx = to[0] - from[0] * k, ty = to[1] - from[1] * k, m = `matrix(${k},0,0,${k},${tx.toFixed(2)},${ty.toFixed(2)})`;
  for (let i = i0; i < f.out.length; i++) f.out[i] = `<g transform="${m}">${f.out[i]}</g>`;
  for (const b of bones) if (f.joints[b]) { const p = f.joints[b].pivot; f.joints[b].pivot = [+(p[0] * k + tx).toFixed(1), +(p[1] * k + ty).toFixed(1)]; }
}

// a bare arm in one outline from shoulder through elbow to wrist, cut at the elbow for the rig (world_XIII)
function bareArm(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const [c0, c1] = jcut(S0, E0, W0, ws[1] / 2);
  return split(f, () => f.part(jointLimb(S0, E0, W0, ws, Object.assign({ point: 0.35, mus0: 0.14, mus1: 0.22 }, o)), Object.assign({ maxShade: ws[1] * 0.3 }, look)), [['upperarm' + sfx, c0], ['forearm' + sfx, c1]]);
}
// give one drawing to several bones, each clipped to its regions (world_XIII bareLegRig's put)
function multi(f, draw, cuts) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  for (const [bone, regs] of cuts) { let g = body; for (const r of [].concat(regs)) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; } f.bone(bone); f.raw(g); }
  return res;
}

// ---------------------------------------------------------------- void: clean round holes, eyes
// draw() with clean round holes cut right through it (see-through), then clean rims. holes: [[centre, r], ...].
// o.shape: clip the rims to this outline so a bite on an edge only rims what is left.
function cutHoles(f, holes, draw, o = {}) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('vh');
  const circ = ([c, r]) => `M${(c[0] + r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] - r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] + r).toFixed(1)},${c[1].toFixed(1)}Z`;
  f.defs.push(`<clipPath id="${id}"><path clip-rule="evenodd" d="M-4000,-4000H8000V8000H-4000Z ${holes.map(circ).join(' ')}"/></clipPath>`);
  f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  if (o.rims === false) return res;
  const rims = () => { for (const [c, r] of holes) { const e = ell(c, r + 0.4, r + 0.4, 0, 32), e2 = ell(c, r + 2.6, r + 2.6, 0, 32); f.line(e2.concat([e2[0]]), 1.6, INK, { op: 0.7 }); f.line(e.concat([e[0]]), o.rimW ?? 1.6, o.rim || P.rim, { op: 0.95 }); f.line(ell(c, r + 1.2, r + 1.2, 0, 32).slice(17, 30), 1, P.rimD, { op: 0.6 }); } };
  if (o.shape) clipDraw(f, typeof o.shape === 'string' ? o.shape : E.smooth(o.shape), rims); else rims();
  return res;
}
// a void spot on a surface that is not cut through: a clean pale rim, a flat black core
function voidDisk(f, c, rx, ry = rx, a = 0) {
  f.part(ell(c, rx + 2.2, ry + 2.2, a, 28), { fill: P.rim, shade: 0.12, inkW: 1.1, inkHeavy: 1.1, cast: false, hatch: false, gritOp: 0.15 });
  f.flat(ell(c, rx, ry, a, 28), P.void);
}
// A real eye opened in growth, hide or bark, set INTO the flesh: a wet socket shadow round it, a soft swollen lid with no
// sticker outline, the fold above and the pouch below, an almond opening, the upper lid covering the top of the iris,
// a wet lower rim. Never a round staring disc. s: width of the opening; a: its tilt; o.open 0 (shut) .. 1;
// o.lid: the host tissue's colour; o.iris; o.look: iris offset; o.white.
function eye(f, c, s, a = 0, o = {}) {
  const F = frame(c, a, s), op = o.open ?? 0.75, lid = o.lid || P.pink, sh = o.lidS || mix(lid, P.loamD, 0.6), dk = mix(sh, '#000', 0.4);
  // the socket: a soft dark hollow the eye sits down in
  f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${(c[1] + s * 0.06).toFixed(1)}" rx="${(s * 0.78).toFixed(1)}" ry="${(s * 0.5).toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})" fill="${dk}" opacity="0.55" filter="url(#puff${f.o.seed})"/>`);
  const mound = F([[-0.64, 0.05], [-0.44, -0.3], [-0.02, -0.4], [0.42, -0.29], [0.66, 0.0], [0.42, 0.26], [0.0, 0.33], [-0.42, 0.25]]);
  f.part(mound, { fill: lid, shadow: sh, shade: 0.45, inkW: 0, inkHeavy: Math.min(1.4, s * 0.06), cast: false, hatch: true, k: 1, maxShade: s * 0.16, tex: 'mottle' + f.o.seed, texOp: 0.45 });
  const fold = (y, w) => f.line(F([[-0.5, y * 0.6], [-0.2, y], [0.2, y], [0.5, y * 0.55]]), Math.max(0.7, s * w), dk, { op: 0.7 });
  if (op < 0.08) { // shut: the lid seam with lashes, the swollen lid, the fold above
    f.stroke(F([[-0.5, 0.0], [-0.2, 0.09], [0.15, 0.1], [0.5, -0.01]]), Math.max(1.2, s * 0.07), INK);
    for (let i = 0; i < 5; i++) { const t = -0.34 + i * 0.17; f.line(F([[t, 0.08], [t - 0.04, 0.17]]), Math.max(0.6, s * 0.03), INK, { op: 0.75 }); }
    fold(-0.2, 0.04); fold(0.24, 0.03);
    f.line(F([[-0.3, -0.08], [0.1, -0.12]]), Math.max(0.6, s * 0.03), mix(lid, '#fff', 0.45), { op: 0.5 });
    return;
  }
  const up = 0.27 * op, lo = 0.15 * Math.min(1, op + 0.3);
  const open = F([[-0.52, 0.02, 1], [-0.3, -up * 0.8], [0.04, -up], [0.3, -up * 0.72], [0.52, 0.0, 1], [0.27, lo * 0.9], [0.0, lo], [-0.28, lo * 0.78]]);
  f.flat(open, o.white || '#ddd3c6');
  const lk = o.look || [0.05, 0.03], ir = o.ir ?? 0.21, irc = o.iris || P.lilacD;
  clipDraw(f, open, () => {
    f.flat(F(ell([-0.1, lo], 0.6, 0.14, 0, 12)), mix(o.white || '#ddd3c6', P.pinkD, 0.55), { op: 0.7 }); // the wet, reddened lower rim
    f.flat(F(ell(lk, ir, ir, 0, 18)), irc);
    for (let i = 0; i < 7; i++) { const t = i / 7 * Math.PI * 2; f.line(F([[lk[0] + Math.cos(t) * ir * 0.45, lk[1] + Math.sin(t) * ir * 0.45], [lk[0] + Math.cos(t) * ir * 0.92, lk[1] + Math.sin(t) * ir * 0.92]]), Math.max(0.5, s * 0.02), mix(irc, '#fff', 0.3), { op: 0.45 }); }
    f.flat(F(ell([lk[0] + 0.01, lk[1]], ir * 0.44, ir * 0.48, 0, 12)), P.void);
    f.flat(F([[-0.7, -0.5], [0.7, -0.5], [0.7, -up + 0.12], [0.0, -up + 0.16], [-0.7, -up + 0.1]]), dk, { op: 0.65 }); // the upper lid's shadow on the ball
    f.flat(F(ell([lk[0] - 0.08, lk[1] - 0.08], 0.05, 0.035, 0, 6)), '#ffffff', { op: 0.8 });
  });
  f.stroke(F([[-0.54, 0.03], [-0.3, -up * 0.84], [0.04, -up * 1.05], [0.3, -up * 0.76], [0.54, 0.0]]), Math.max(1.3, s * 0.085), INK); // upper lid edge
  f.line(F([[-0.48, 0.03], [-0.26, lo * 0.85], [0.02, lo * 1.02], [0.28, lo * 0.86], [0.5, 0.01]]), Math.max(0.7, s * 0.035), INK, { op: 0.7 });
  f.line(F([[-0.4, lo + 0.06], [0.0, lo + 0.1], [0.34, lo + 0.05]]), Math.max(0.6, s * 0.03), mix(lid, '#fff', 0.5), { op: 0.55 }); // the wet lower lid's lit edge
  fold(-up - 0.13, 0.04); fold(lo + 0.2, 0.03); // the lid fold above, the pouch below
  if (o.lashes) for (let i = 0; i < 5; i++) { const t = -0.36 + i * 0.18; f.line(F([[t, -up * 0.9 - 0.02], [t + 0.02, -up - 0.12]]), Math.max(0.6, s * 0.025), INK, { op: 0.8 }); }
}
// eyes scattered in a region: list of [centre, size, angle, open]; opens vary so they blink out of time
function eyes(f, list, o = {}) { for (const [c, s, a, op] of list) eye(f, c, s, a, Object.assign({}, o, { open: op, look: [R(f, -0.06, 0.1), R(f, -0.02, 0.05)] })); }

// ---------------------------------------------------------------- toxin: mould, pustules, spores, fungus, blooms
// mould bloom: an irregular furred patch with paler colonies and a fuzzy rim (never closed rings with a dot: eyes are
// drawn on purpose, not by accident). o.col base colour, o.op
function mould(f, c, rx, ry, o = {}) {
  const col = o.col || P.lilac, pts = ell(c, rx, ry, o.ang || 0, 16).map(p => add(p, [(f.r() - 0.5) * rx * 0.4, (f.r() - 0.5) * ry * 0.4]));
  f.part(pts, { fill: col, shadow: mix(col, P.lilacS, 0.6), shade: 0.3, tex: 'mfur' + f.o.seed, texOp: 0.9, inkW: o.ink ?? 0, inkHeavy: 0, cast: false, k: 0.8, hatch: false, opacity: o.op ?? 0.8, gritOp: 0.3 });
  const nr = o.rings ?? Math.max(1, Math.round((rx + ry) / 16));
  for (let i = 0; i < nr; i++) { const q = scatter(f, c, rx * 0.5, ry * 0.5), r = Math.min(rx, ry) * R(f, 0.25, 0.5); f.flat(ell(q, r, r * 0.75, f.r() * 3, 9).map(p => add(p, [(f.r() - 0.5) * r * 0.5, (f.r() - 0.5) * r * 0.5])), mix(col, '#ffffff', 0.45), { op: 0.45 }); for (let k = 0; k < 3; k++) f.flat(ell(scatter(f, q, r * 0.7, r * 0.6), 0.9, 0.9, 0, 5), mix(col, P.loamD, 0.6), { op: 0.7 }); }
  for (let i = 0; i < Math.round((rx + ry) * 0.25); i++) { const t = f.r() * Math.PI * 2, q = add(c, rot([Math.cos(t) * rx * 0.9, Math.sin(t) * ry * 0.9], o.ang || 0)), d = E.norm(sub(q, c)); f.line([q, add(q, mul(d, 1.5 + f.r() * 3))], 0.7, mix(col, '#ffffff', 0.6), { op: 0.55 }); }
}
// fungal fur along an edge: fine pale hyphae standing off a surface (the outline breaks the way toxin breaks it)
function fungalFur(f, pts, len, out = 1, o = {}) {
  const C = spline(pts, 2.5);
  for (let i = 1; i < C.length - 1; i++) { if (f.r() < (o.gaps ?? 0.25)) continue; const d = E.norm(sub(C[i + 1], C[i - 1])), nn = mul([-d[1], d[0]], out), l = len * (0.4 + f.r() * 0.8), a = (f.r() - 0.5) * 0.7; f.line([C[i], add(C[i], mul(rot(nn, a), l * 0.5)), add(C[i], mul(rot(nn, a * 1.6), l))], 0.7 + f.r() * 0.5, f.r() > 0.35 ? (o.col || P.lilacL) : (o.col2 || P.yelL), { op: 0.75 }); }
}
// pustules: raised soft blisters with a tight shine and a dark head; sorted so lower ones overlap upper ones
function pustules(f, c, rx, ry, n, r0, r1, o = {}) {
  const L = []; for (let i = 0; i < n; i++) L.push([scatter(f, c, rx, ry), R(f, r0, r1)]);
  const col = o.col || P.pink;
  L.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => {
    f.part([add(p, [-r, r * 0.35]), add(p, [-r * 0.8, -r * 0.45]), add(p, [0, -r * 0.85]), add(p, [r * 0.85, -r * 0.4]), add(p, [r, r * 0.4]), add(p, [0, r * 0.6])], { fill: col, shadow: mix(col, P.lilacS, 0.6), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, k: 1 });
    f.flat(ell(add(p, [r * 0.28, -r * 0.35]), r * 0.3, r * 0.18, -0.5, 6), '#ffffff', { op: 0.6 });
    f.flat(ell(add(p, [-r * 0.05, -r * 0.05]), r * 0.22, r * 0.18, 0, 6), o.head || P.yel, { op: 0.9 });
  });
}
// spores drifting: specks with a pale fleck (dry, never a glow)
function spores(f, c, rx, ry, n, s = 1, o = {}) { for (let i = 0; i < n; i++) { const q = scatter(f, c, rx, ry), r = (0.9 + f.r() * 1.6) * s; f.flat(ell(q, r, r, 0, 6), f.r() > 0.5 ? (o.col || P.yelD) : P.lilacD, { op: 0.75 }); f.flat(ell(add(q, [r * 0.3, -r * 0.3]), r * 0.45, r * 0.45, 0, 5), P.yelL, { op: 0.7 }); } }
// a soft puff of spore dust (dull, translucent, no glow): a few blurred lobes plus specks
function puff(f, c, r, o = {}) {
  const col = o.col || P.yelL;
  for (let i = 0; i < (o.n || 5); i++) { const q = scatter(f, c, r * 0.6, r * 0.45), rr = r * R(f, 0.35, 0.7); f.raw(`<ellipse cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" rx="${rr.toFixed(1)}" ry="${(rr * 0.8).toFixed(1)}" fill="${col}" opacity="${(o.op ?? 0.22).toFixed(2)}" filter="url(#puff${f.o.seed})"/>`); }
  spores(f, c, r * 0.9, r * 0.7, o.specks ?? Math.round(r / 3), o.s ?? 1);
}
// peeling skin: lifted flakes with a lit lip
function peel(f, c, n, s = 1, spread = 22, col = P.skin) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * spread, (f.r() - 0.5) * spread * 0.8]); f.flat([p, add(p, [7 * s, -2 * s]), add(p, [9 * s, 3 * s]), add(p, [3 * s, 4 * s])], mix(col, '#ffffff', 0.4), { op: 0.85 }); f.line([p, add(p, [7 * s, -2 * s])], 0.8, INK, { op: 0.6 }); f.flat([add(p, [3 * s, 4 * s]), add(p, [9 * s, 3 * s]), add(p, [8 * s, 5 * s])], mix(col, '#000', 0.4), { op: 0.5 }); } }

// ---- fungus, drawn in Living Ink like everything else: shaded, hatched in shadow, darker undersides and gills, a cast
// shadow on the host, irregular sizes in clusters, some torn or collapsing. Colours stay in the dusky palette.
const FL = (f, col, o = {}) => Object.assign({ fill: col, shadow: mix(col, P.loamD, 0.62), light: mix(col, '#ffffff', 0.22), shade: 0.46, inkW: 1.3, inkHeavy: 2.2, cast: false, hatch: true, k: 0.9, tex: 'mfur' + f.o.seed, texOp: 0.3 }, o);
// a soft shadow the growth casts onto its host (down and toward the shadow side of the key light)
function hostShadow(f, pts, d, op = 0.5) { const L = f.L, off = [-L[0] * d, -L[1] * d * -1.2]; f.raw(`<path d="${E.smooth(pts.map(q => add(q, [off[0], Math.abs(off[1])])))}" fill="${P.loamD}" opacity="${op}" filter="url(#puff${f.o.seed})"/>`); }
// bracket fungus seen from the front and a little above: a lobed fan rooted on the host, zoned top (o.kind 'zoned'),
// smooth with gills showing under the lip ('oyster'); o.torn bites a split out of the margin; o.droop sags it.
function bracket(f, b, a, w, h, o = {}) {
  if (o.side) return bracketSide(f, b, a, w, h, o);
  const F = frame(b, a, 1), col = o.col || P.yel, kind = o.kind || 'zoned', th = o.th ?? Math.max(4, h * 0.22), dr = o.droop ?? 0;
  const j = () => (f.r() - 0.5) * h * 0.12, nl = 7;
  const rim = []; for (let i = 0; i <= nl; i++) { const t = i / nl, ang2 = -Math.PI / 2 + Math.PI * t, lobe = 1 + 0.08 * Math.sin(t * 9 + f.r() * 3); rim.push([h * Math.cos(ang2) * lobe + j() + dr * h * 0.3 * Math.sin(Math.PI * t), w * 0.5 * Math.sin(ang2) * lobe]); }
  if (o.torn) { const k = 2 + Math.floor(f.r() * 4); rim.splice(k + 1, 0, [rim[k][0] * 0.55, (rim[k][1] + rim[k + 1][1]) / 2, 1]); }
  const top = F([[-4, -w * 0.48, 1], ...rim, [-4, w * 0.5, 1]]);
  hostShadow(f, top, h * 0.25, 0.45);
  const under = top.map((q, i) => (i === 0 || i === top.length - 1) ? q : add(q, [0, th]));
  f.part([...top.slice(1, -1), ...under.slice(1, -1).reverse()], FL(f, mix(col, P.loamD, 0.68), { inkW: 1.1, inkHeavy: 1.6, texOp: 0 }));
  if (kind === 'oyster') for (let i = 1; i < top.length - 1; i++) f.line([lerp(top[i], b, 0.15), add(top[i], [0, th * 0.9])], 0.8, P.loamD, { op: 0.7 }); // gills under the lip
  else for (let i = 0; i < Math.round(w / 7); i++) f.flat(ell(add(lerp(top[1 + Math.floor(f.r() * (top.length - 2))], b, R(f, 0, 0.2)), [0, th * 0.6]), 0.9, 0.9, 0, 5), P.loamD, { op: 0.7 }); // pores
  f.part(top, FL(f, col, { maxShade: h * 0.35 }));
  if (kind === 'zoned') { const nz = o.zones ?? 3; for (let z = 1; z <= nz; z++) { const kk = 1 - z / (nz + 1); f.line(F(rim.map(([u, v]) => [u * kk, v * (0.55 + 0.45 * kk)])), Math.max(1, h * 0.05), z % 2 ? mix(col, P.loamD, 0.5) : mix(col, '#ffffff', 0.3), { op: 0.6 }); } }
  else for (let i = 1; i < rim.length - 1; i += 2) f.line([lerp(b, F([rim[i]])[0], 0.2), lerp(b, F([rim[i]])[0], 0.85)], 0.9, mix(col, P.loamD, 0.45), { op: 0.45 }); // radial ribbing
  f.line(F(rim.slice(1, -1).map(([u, v]) => [u - 2, v * 0.96])), Math.max(1.2, h * 0.06), mix(col, '#ffffff', 0.4), { op: 0.7 }); // the swollen margin
  if (o.rot !== false && f.r() < 0.5) f.flat(F(ell([h * 0.5, w * R(f, -0.2, 0.2)], h * 0.14, w * 0.1, 0, 8)), mix(col, P.loamD, 0.55), { op: 0.6 }); // a rotting blotch
}
// a bracket seen from the side: a wedge thick at the root and thin at the swollen margin, its zoned top face seen from a
// little above, the dark pored underside below. w: root thickness, h: how far it stands out. o.kind 'hoof' = woody,
// ridged in bands (a dead tree's hoof fungus); o.droop sags the tip; o.torn splits the margin.
function bracketSide(f, b, a, w, h, o = {}) {
  const d = rot([1, 0], a), dn = rot([0, 1], a)[1] >= 0 ? 1 : -1, F0 = frame(b, a, 1), F = pts => F0(pts.map(q => [q[0], q[1] * dn]));
  const col = o.col || P.yel, j = () => (f.r() - 0.5) * h * 0.05, droop = o.droop ?? 0.12, hoof = o.kind === 'hoof';
  const tip = o.torn ? [[h * 0.92, h * droop * 0.5], [h * 0.84, h * droop * 0.8, 1], [h, h * droop * 0.9]] : [[h, h * droop * 0.7]];
  const topE = [[0, -w * 0.5], [h * 0.3, -w * 0.5 - h * (hoof ? 0.05 : 0.17) + j()], [h * 0.66, -w * (hoof ? 0.42 : 0.3) - h * 0.14 + j()], [h * 0.92, -h * 0.04 + droop * h * 0.5], ...tip];
  const lip = [[h * 0.95, h * (droop + 0.12)], [h * 0.7, h * 0.1 + w * 0.12], [h * 0.35, w * 0.3], [0, w * 0.5]];
  const body = F([...topE, ...lip]);
  hostShadow(f, body, w * 0.5, 0.5);
  f.part(body, FL(f, col, { maxShade: w * 0.45 }));
  const under = F([[h * 0.98, h * droop * 0.75], [h * 0.93, h * (droop + 0.11)], [h * 0.68, h * 0.1 + w * 0.12], [h * 0.33, w * 0.3], [0, w * 0.5], [0, w * 0.18], [h * 0.4, w * 0.02 + h * 0.03], [h * 0.8, h * droop * 0.6]]);
  f.flat(under, mix(col, P.loamD, 0.72));
  for (let i = 0; i < 4; i++) f.line([lerp(under[1], under[5], 0.2 + i * 0.2), lerp(under[2], under[6], 0.2 + i * 0.2)], 0.7, P.loamD, { op: 0.6 });
  if (hoof) for (let k = 1; k < 5; k++) f.line(F([[h * 0.08 * k, -w * 0.5 - 2], [h * 0.06 * k + h * 0.1, 0], [h * 0.05 * k, w * 0.48]]).map((q, i) => add(q, mul(d, h * 0.16 * k))), Math.max(1.2, w * 0.06), k % 2 ? mix(col, P.loamD, 0.55) : mix(col, '#fff', 0.3), { op: 0.7 });
  else for (const kk of [0.78, 0.55, 0.32]) f.line(F([[h * kk * 0.25, -w * 0.5 - h * 0.1 * kk], [h * kk * 0.6, -w * 0.34 - h * 0.1 * kk], [h * kk * 0.92, -w * 0.12 * (1 - kk)], [h * kk, h * droop * 0.5 * kk]]), Math.max(1, h * 0.04), kk === 0.55 ? mix(col, '#ffffff', 0.3) : mix(col, P.loamD, 0.5), { op: 0.6 });
  f.line(F([[h * 0.7, -w * 0.28 - h * 0.12], [h * 0.93, -h * 0.03 + droop * h * 0.5], [h * 0.99, h * droop * 0.72], [h * 0.94, h * (droop + 0.11)]]), Math.max(1.4, h * 0.06), mix(col, '#ffffff', 0.45), { op: 0.75 });
  return { tip: F([[h, h * droop * 0.7]])[0], d };
}
// an irregular cluster along a host line: sizes skewed so a few are big and many small, torn and drooping ones mixed in,
// lower ones drawn first so upper shelves overlap their roots. size: [min, max] scale of w and h
function brackets(f, pts, n, a, w, h, o = {}) {
  const C = spline(pts, 3), out = [];
  for (let k = 0; k < n; k++) { const i = Math.floor(f.r() * C.length), sz = 0.35 + 0.75 * Math.pow(f.r(), 2.2); out.push([add(C[i], [R(f, -4, 4), R(f, -4, 4)]), w * sz, h * sz, k]); }
  out.sort((p, q) => q[0][1] - p[0][1]).forEach(([c, ww, hh, k]) => bracket(f, c, a + R(f, -0.2, 0.2), ww, hh, Object.assign({}, o, { col: o.cols ? o.cols[k % o.cols.length] : o.col, torn: f.r() < 0.25, droop: o.side ? R(f, 0.06, 0.3) : (f.r() < 0.2 ? 0.5 : 0) })));
}
// a gilled mushroom: a bowed stem with a ragged ring, a cap (conic, convex, flat or 'inkcap', a tall bell whose margin is
// blackening and curling) seen from below enough to show the darker gills; warts, a torn margin, browned edges, a cast
// shadow on the host; o.collapse tips the cap over and rags its edge. b: base, a: growth direction, s: overall height.
function cap(f, b, a, s, o = {}) {
  const d = rot([1, 0], a + (o.collapse ? 0.5 : 0)), n = [-d[1], d[0]], col = o.col || P.pink, stem = o.stem || mix(P.bone, P.grey, 0.25), shp = o.shape || 'convex';
  const L = s * (o.stemL ?? 0.62), bow = (o.bow ?? (f.r() - 0.5) * 0.16) * s + (o.collapse ? s * 0.12 : 0), top = add(add(b, mul(rot([1, 0], a), L)), mul(n, bow * 0.6));
  const sw = s * (o.sw ?? 0.11);
  const stemPts = spline([b, add(lerp(b, top, 0.5), mul(n, bow)), top], 4);
  const stemShape = ribbon(stemPts, stemPts.map((_, i) => sw * (1.3 - 0.35 * i / (stemPts.length - 1))));
  hostShadow(f, stemShape, sw * 0.8, 0.45);
  f.part(stemShape, FL(f, stem, { maxShade: sw * 0.55, inkW: 1, inkHeavy: 1.6 }));
  f.line(stemPts.map(q => add(q, mul(n, -sw * 0.25))), 0.8, mix(stem, P.loamD, 0.5), { op: 0.5 });
  const ringC = lerp(b, top, 0.78); f.part([add(ringC, mul(n, sw * 0.9)), add(add(ringC, mul(n, sw * 0.5)), mul(rot([1, 0], a), -sw * 0.6)), add(add(ringC, mul(n, -sw * 0.6)), mul(rot([1, 0], a), -sw * 0.5)), add(ringC, mul(n, -sw * 0.95)), add(add(ringC, mul(n, -sw * 0.3)), mul(rot([1, 0], a), sw * 0.2))], FL(f, mix(stem, '#ffffff', 0.15), { inkW: 0.8, inkHeavy: 1.1, hatch: false }));
  const cw = s * (o.w ?? 0.34), ch = s * (o.h ?? (shp === 'conic' ? 0.5 : shp === 'inkcap' ? 0.7 : shp === 'flat' ? 0.16 : 0.3)), cb = top;
  const C = (u, v) => add(add(cb, mul(d, u)), mul(n, v));
  const prof = shp === 'conic' ? [[0, 1], [0.3, 0.86], [0.66, 0.5], [0.92, 0.16], [1, 0]] : shp === 'inkcap' ? [[0, 0.8], [0.4, 0.86], [0.75, 0.66], [0.95, 0.3], [1, 0]] : shp === 'flat' ? [[0, 1], [0.5, 0.9], [0.85, 0.6], [1, 0.25], [1.02, 0]] : [[0, 1], [0.42, 0.9], [0.78, 0.62], [0.96, 0.3], [1, 0]];
  const rag = () => o.collapse || shp === 'inkcap' ? (f.r() - 0.5) * ch * 0.18 : 0;
  const capPts = [C(rag(), cw * prof[0][1]), ...prof.slice(1).map(([u, v]) => C(u * ch, v * cw)), ...prof.slice(1, -1).reverse().map(([u, v]) => C(u * ch, -v * cw)), C(rag(), -cw * prof[0][1])];
  if (shp === 'inkcap') for (let i = 0; i < 4; i++) capPts.splice(i === 0 ? 0 : capPts.length, 0); // (the ragged hem is drawn below)
  const marg = [C(-ch * 0.05, cw * 1.03), C(-ch * 0.2, cw * 0.55), C(-ch * 0.24, 0), C(-ch * 0.2, -cw * 0.55), C(-ch * 0.05, -cw * 1.03)];
  if (o.under !== false && shp !== 'inkcap') {
    f.part([C(0, cw), ...marg.slice(1, 4), C(0, -cw)], FL(f, mix(col, P.loamD, 0.7), { inkW: 1, inkHeavy: 1.4, texOp: 0 }));
    for (let i = 1; i < 12; i++) { const t = i / 12, v = (t - 0.5) * 2 * cw * 0.95; f.line([C(-ch * 0.03, v), C(-ch * 0.17 * Math.cos((t - 0.5) * 2.4), v * 0.3)], 0.8, P.loamD, { op: 0.7 }); }
  }
  hostShadow(f, capPts, cw * 0.3, 0.4);
  f.part(capPts, FL(f, col, { maxShade: cw * 0.42 }));
  clipDraw(f, capPts, () => {
    f.flat([C(ch * 0.55, -cw * 0.2), C(ch * 1.05, -cw * 0.2), C(ch * 1.05, cw * 0.4), C(ch * 0.55, cw * 0.3)], mix(col, P.loamD, 0.4), { op: 0.45 }); // the darker crown
    f.line([C(0, cw * 0.98), C(ch * 0.04, 0), C(0, -cw * 0.98)], Math.max(1.4, cw * 0.1), shp === 'inkcap' ? P.loamD : mix(col, P.loamD, 0.6), { op: shp === 'inkcap' ? 0.85 : 0.45 }); // edges browning (an inkcap's blackening)
    if (shp === 'inkcap') for (let i = 0; i < 7; i++) { const v = (i / 6 - 0.5) * 1.8 * cw; f.line([C(0, v), C(ch * R(f, 0.3, 0.6), v * 0.8)], 1, P.loamD, { op: 0.55 }); } // the bell's striations
    for (let i = 0; i < (o.warts ?? (shp === 'inkcap' ? 2 : 5)); i++) { const q = C(ch * R(f, 0.2, 0.85), cw * R(f, -0.7, 0.7)), r = cw * R(f, 0.04, 0.09); f.flat(ell(q, r, r * 0.8, 0, 6), mix(col, '#ffffff', 0.45), { op: 0.8 }); f.flat(ell(add(q, mul(n, -r * 0.3)), r * 0.5, r * 0.4, 0, 5), mix(col, P.loamD, 0.5), { op: 0.5 }); }
    f.line([C(ch * 0.2, cw * 0.75), C(ch * 0.62, cw * 0.48), C(ch * 0.9, cw * 0.15)], Math.max(1, cw * 0.06), mix(col, '#ffffff', 0.4), { op: 0.45 });
  });
  if (o.tear !== false) { const q = C(0, cw * R(f, -0.6, 0.6)); f.flat([add(q, mul(n, -cw * 0.14)), add(q, mul(d, ch * 0.28)), add(q, mul(n, cw * 0.14))], mix(col, P.loamD, 0.7), { op: 0.9 }); } // a split in the margin
  return { top: C(ch, 0), rimN: C(0, cw), rimF: C(0, -cw), d, n };
}
// a cluster of caps from one root: a few big, many small, sorted small (behind) to big (front); one may be collapsing
function caps(f, b, a, s, n, o = {}) {
  const L = []; for (let i = 0; i < n; i++) L.push([add(b, rot([(f.r() - 0.5) * s * 0.2, (f.r() - 0.5) * s * 0.5], a)), a + (i - (n - 1) / 2) * (o.fan ?? 0.35) + (f.r() - 0.5) * 0.2, s * (0.35 + 0.7 * Math.pow(f.r(), 1.8)), o.cols ? o.cols[i % o.cols.length] : o.col]);
  L.sort((p, q) => p[2] - q[2]).forEach(([p, aa, ss, col], i) => cap(f, p, aa, ss, Object.assign({}, o, { col, collapse: o.collapse ?? (n > 2 && i === 1) })));
}
// a puffball: a sagging, pear-shaped ball (never a circle), warty, hatched in shadow, its top torn open on a pore
function puffball(f, c, r, o = {}) {
  const col = o.col || P.yel, j = () => (f.r() - 0.5) * r * 0.1;
  const pts = [[c[0] - r * 0.55 + j(), c[1] - r * 0.6], [c[0] + j(), c[1] - r * 0.86], [c[0] + r * 0.6 + j(), c[1] - r * 0.6], [c[0] + r * 0.95, c[1] + r * 0.1], [c[0] + r * 0.7, c[1] + r * 0.66], [c[0], c[1] + r * 0.8], [c[0] - r * 0.72, c[1] + r * 0.62], [c[0] - r * 0.95, c[1] + r * 0.05]];
  hostShadow(f, pts, r * 0.2, 0.45);
  f.part(pts, FL(f, col, { k: 1, maxShade: r * 0.45 }));
  clipDraw(f, pts, () => { for (let i = 0; i < Math.round(r * 0.7); i++) { const q = scatter(f, c, r * 0.8, r * 0.7), rr = r * R(f, 0.04, 0.09); f.flat(ell(q, rr, rr * 0.8, 0, 6), mix(col, P.loamD, 0.45), { op: 0.6 }); f.flat(ell(add(q, [rr * 0.3, -rr * 0.4]), rr * 0.5, rr * 0.4, 0, 5), mix(col, '#ffffff', 0.5), { op: 0.6 }); } });
  if (o.pore !== false) { const q = add(c, [r * 0.1, -r * 0.74]); f.flat([add(q, [-r * 0.2, 0]), add(q, [-r * 0.05, -r * 0.1]), add(q, [r * 0.2, -r * 0.02]), add(q, [0.02, r * 0.08])], P.loamD); f.line([add(q, [-r * 0.22, 0]), add(q, [-r * 0.3, -r * 0.12])], 1, mix(col, P.loamD, 0.5)); if (o.smoke !== false) puff(f, add(q, [0, -r * 0.4]), r * 0.5, { col: P.yelL, op: 0.18, specks: 4 }); }
}
// coral fungus: blunt or pointed, branching, tapering arms in one dusky colour family (darker at the root, paler at the
// tips), hatched in shadow. b root, a direction, len, w root width
function coral(f, b, a, len, w, depth, o = {}) {
  const col = o.col || P.pink, out = [];
  const grow = (p, aa, L, ww, dd, gen) => {
    const C = []; let q = p, bb = aa; for (let i = 0; i <= 4; i++) { C.push(q); bb += (f.r() - 0.5) * (o.wander ?? 0.35) + (o.curl ?? 0); q = add(q, rot([L / 4, 0], bb)); }
    const S = spline(C, 4), W = S.map((_, i) => Math.max(o.minW ?? 5, ww * (1 - (o.taper ?? 0.35) * i / (S.length - 1))));
    const kids = [];
    if (dd > 0) for (const t of [0.45, 0.75, 1.0]) if (t === 1.0 || f.r() < (o.fork ?? 0.7)) { const k = Math.min(S.length - 1, Math.round(t * (S.length - 1))); kids.push([S[k], bb + (t === 1 ? (f.r() - 0.5) * 0.5 : (f.r() > 0.5 ? 1 : -1) * R(f, 0.35, 0.75)), L * R(f, 0.5, 0.75), W[k] * 0.82, dd - 1, gen + 1]); }
    out.push([S, W, gen]);
    for (const k of kids) grow(...k);
  };
  grow(b, a, len, w, depth, 0);
  const maxGen = Math.max(...out.map(q => q[2]));
  for (const [S, W, gen] of out) {
    const rb = ribbon(S, W), n = S.length, ta = Math.atan2(S[n - 1][1] - S[n - 2][1], S[n - 1][0] - S[n - 2][0]);
    const c2 = o.cols ? o.cols[Math.min(o.cols.length - 1, gen)] : mix(col, '#ffffff', 0.25 * gen / Math.max(1, maxGen));
    f.part([...rb.slice(0, n), ...(o.point ? [[...add(S[n - 1], rot([W[n - 1] * 2.4, 0], ta)), 1]] : [1, 2, 3, 4, 5].map(i => add(S[n - 1], rot([W[n - 1] * 0.5 * (i === 3 ? 1.15 : 1), 0], ta + Math.PI / 2 - i * Math.PI / 6)))), ...rb.slice(n)], Object.assign(FL(f, c2, { inkW: Math.min(1.3, W[0] * 0.12 + 0.4), inkHeavy: Math.min(2, W[0] * 0.2 + 0.5), maxShade: W[0] * 0.38, cast: true, castOp: 0.35 }), o.look || {}));
    f.line(S.slice(1, -1).map((q, i) => add(q, [W[i + 1] * 0.2, -W[i + 1] * 0.2])), Math.max(0.8, W[0] * 0.1), mix(c2, '#ffffff', 0.35), { op: 0.45 });
  }
  return out;
}
// a bloom: petals round a dark heart, in two rings, seen at a slant (sy squashes it), withering: edges browned, one petal
// wilting, hatched in shadow. o.rose: a cupped rose with a spiral heart instead.
function bloom(f, c, r, col, o = {}) {
  const a0 = o.ang ?? (f.r() * 6.3), sy = o.sy ?? 0.7, tilt = o.tilt ?? 0, sh = mix(col, P.loamD, 0.6), br = mix(col, P.loamB, 0.75);
  const T = q => add(c, rot([q[0], q[1] * sy], tilt));
  const PL = (cc, x = {}) => FL(f, cc, Object.assign({ inkW: 1.1, inkHeavy: 1.6, maxShade: r * 0.32, k: 0.95, texOp: 0.15 }, x));
  if (o.rose) {
    const Q = (u, v) => T([u * r, v * r]);
    hostShadow(f, [Q(-1, 0), Q(0, -1), Q(1, 0), Q(0, 1)], r * 0.3, 0.4);
    for (const [cx, w0] of [[-0.62, 0.5], [0.0, 0.56], [0.6, 0.5]]) f.part([Q(cx - w0, -0.2), Q(cx - w0 * 0.9, -0.72), Q(cx - w0 * 0.3, -1.02), Q(cx + w0 * 0.4, -0.98), Q(cx + w0 * 0.95, -0.62), Q(cx + w0, -0.2)], PL(mix(col, P.loamD, 0.2)));
    f.part([Q(-1.0, -0.36), Q(-0.96, 0.2), Q(-0.6, 0.66), Q(0, 0.86), Q(0.6, 0.66), Q(0.96, 0.2), Q(1.0, -0.36), Q(0.5, -0.5), Q(-0.5, -0.5)], PL(col));
    f.flat([Q(-0.7, -0.44), Q(0, -0.58), Q(0.7, -0.44), Q(0.4, -0.3), Q(-0.4, -0.3)], mix(sh, '#000', 0.3), { op: 0.85 });
    f.line([Q(-0.3, -0.42), Q(0.05, -0.5), Q(0.3, -0.4), Q(0.05, -0.34), Q(-0.12, -0.42)], Math.max(1, r * 0.07), mix(col, '#ffffff', 0.35), { op: 0.8 });
    for (const [cx, w0, y0] of [[-0.5, 0.62, -0.34], [0.5, 0.62, -0.3], [0.0, 0.7, -0.16]]) {
      const pet = [Q(cx - w0, y0 + 0.06), Q(cx - w0 * 0.96, y0 + 0.5), Q(cx - w0 * 0.5, y0 + 0.86), Q(cx + w0 * 0.3, y0 + 0.9), Q(cx + w0 * 0.92, y0 + 0.5), Q(cx + w0, y0 + 0.04), Q(cx, y0 - 0.06)];
      f.part(pet, PL(col));
      f.line([Q(cx - w0 * 0.9, y0 + 0.04), Q(cx, y0 - 0.04), Q(cx + w0 * 0.9, y0 + 0.02)], Math.max(1.2, r * 0.09), mix(col, '#ffffff', 0.4), { op: 0.8 });
      f.line(pet.slice(1, 4), Math.max(1, r * 0.08), br, { op: 0.55 });
    }
    f.part([Q(0.7, 0.4), Q(1.2, 0.5), Q(1.36, 0.9), Q(1.1, 1.06), Q(0.86, 0.7)], PL(mix(col, P.loamB, 0.45)));
    for (const a of [-2.3, -1.2, 0.0]) f.part([Q(-0.2, 0.76), Q(-0.2 + Math.cos(a + 1.57) * 0.5, 0.8 + Math.abs(Math.sin(a + 1.57)) * 0.4), Q(0.2, 0.8)], PL(P.rot, { maxShade: 4 }));
    return;
  }
  const np = o.n || 6;
  for (const ring of [0, 1]) {
    const rr = r * (ring ? 0.62 : 1), m = ring ? np - 1 : np;
    for (let i = 0; i < m; i++) {
      const a = a0 + (i + ring * 0.5) / m * Math.PI * 2 + (f.r() - 0.5) * 0.3, wilt = (!ring && i === 1) ? 1.4 : 1, pw = rr * (o.pw ?? 0.42);
      const tip = [Math.cos(a) * rr * wilt, Math.sin(a) * rr * wilt + (wilt > 1 ? rr * 0.5 : 0)], nn = [-Math.sin(a), Math.cos(a)];
      const pet = [[0, 0], add(mul(tip, 0.35), mul(nn, pw * 0.8)), add(mul(tip, 0.8), mul(nn, pw)), add(tip, mul(nn, pw * 0.3)), [...tip, 0], add(tip, mul(nn, -pw * 0.35)), add(mul(tip, 0.8), mul(nn, -pw)), add(mul(tip, 0.35), mul(nn, -pw * 0.8))].map(T);
      f.part(pet, PL(ring ? mix(col, '#ffffff', 0.1) : (wilt > 1 ? mix(col, P.loamB, 0.45) : col), { maxShade: rr * 0.25 }));
      f.line([T(mul(tip, 0.15)), T(mul(tip, 0.75))], 0.8, sh, { op: 0.6 });
      if (!ring) f.line(pet.slice(2, 7), Math.max(1, r * 0.07), br, { op: 0.6 });
    }
  }
  f.part(ell(c, r * 0.24, r * 0.24 * sy, tilt, 10), FL(f, P.loamL, { maxShade: 4, inkW: 1, inkHeavy: 1.2 }));
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; f.flat(ell(T([Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3]), r * 0.05, r * 0.05, 0, 5), P.yelD, { op: 0.9 }); }
}
// moss: a mat of small rounded tufts along a surface line, near-black green, stippled, a few pale-yellow fruiting stalks
function moss(f, pts, d, o = {}) {
  const C = spline(pts, Math.max(3, d * 0.6)), col = o.col || P.rot, out = o.out ?? 1;
  const blobs = [];
  for (let i = 0; i < C.length; i++) { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], t = E.norm(sub(b, a)), nn = mul([-t[1], t[0]], out); blobs.push([add(C[i], mul(nn, d * R(f, 0.0, 0.5))), d * R(f, 0.45, 0.85)]); }
  for (const [q, r] of blobs) f.part(ell(q, r, r * 0.8, 0, 9).map(p => add(p, [(f.r() - 0.5) * r * 0.3, (f.r() - 0.5) * r * 0.3])), { fill: mix(col, P.rotL, f.r() * 0.5), shadow: P.rotS, shade: 0.45, inkW: 0.8, inkHeavy: 1.2, cast: false, hatch: false, k: 1, tex: 'mfur' + f.o.seed, texOp: 0.4 });
  for (let i = 0; i < blobs.length; i += 3) { const [q, r] = blobs[i]; f.flat(ell(add(q, [r * 0.2, -r * 0.3]), r * 0.3, r * 0.2, 0, 6), P.rotL, { op: 0.8 }); }
  if (o.stalks !== false) for (let i = 1; i < blobs.length; i += 4) { const [q, r] = blobs[i], tp = add(q, [R(f, -2, 2), -r * R(f, 1.2, 2)]); f.line([q, tp], 0.8, P.yelD, { op: 0.8 }); f.flat(ell(tp, 1.3, 2, 0, 6), P.yel); }
}
// a root: a tapering, knotted, barked rope along pts (root to tip), grooves along its length, rootlets
function root(f, pts, w0, w1, o = {}) {
  const C = spline(pts, 4), n = C.length, W = C.map((_, i) => { const t = i / (n - 1); return (w0 + (w1 - w0) * Math.pow(t, o.pow ?? 0.8)) * (1 + (o.knot ?? 0.1) * Math.sin(i * 0.22 + (o.ph ?? 0)) + 0.04 * Math.sin(i * 0.7)); });
  const col = o.col || P.loam, rb = ribbon(C, W), e = C[n - 1], d = E.norm(sub(C[n - 1], C[n - 2]));
  const shape = [...rb.slice(0, n), add(e, mul(d, W[n - 1] * 0.5)), ...rb.slice(n)];
  f.part(shape, { fill: col, shadow: o.shadow || P.loamD, light: o.light || P.loamBL, shade: 0.42, inkW: o.inkW ?? 1.3, inkHeavy: o.inkHeavy ?? 2.4, cast: o.cast ?? true, castOp: 0.35, hatch: o.hatch ?? true, tex: 'bark' + f.o.seed, texOp: o.texOp ?? 0.45, maxShade: Math.max(4, w0 * 0.35), grime: false });
  for (const k of [-0.25, 0.18]) f.line(offsetLine(C, t => (w0 + (w1 - w0) * t) * k).slice(1, -2), Math.max(0.8, w0 * 0.05), k < 0 ? (o.light || P.loamBL) : INK, { op: 0.45 });
  if (o.rootlets) for (let i = 2; i < n - 2; i += Math.max(2, Math.round(n / o.rootlets))) { const a = Math.atan2(C[i + 1][1] - C[i - 1][1], C[i + 1][0] - C[i - 1][0]) + (f.r() > 0.5 ? 1 : -1) * R(f, 0.6, 1.2), l = Math.min(40, W[i] * R(f, 0.8, 1.8)), q0 = add(C[i], rot([W[i] * 0.4, 0], a)); f.line([q0, add(q0, rot([l * 0.5, (f.r() - 0.5) * 4], a)), add(q0, rot([l, (f.r() - 0.5) * 8], a))], Math.min(3.2, Math.max(0.8, W[i] * 0.12)), o.shadow || P.loamD, { op: 0.9 }); }
  return { C, W, shape };
}
// thorns along a stem line: hooked, curving back toward the root, dark with a pale tip
function thorns(f, pts, n, len, o = {}) {
  const C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1];
  for (let k = 0; k < n; k++) {
    const u = (k + 0.5 + (f.r() - 0.5) * 0.5) / n * Lt; let i = S.findIndex(v => v >= u); if (i < 1) i = 1; if (i > C.length - 2) i = C.length - 2;
    const t = E.norm(sub(C[i + 1], C[i - 1])), sd = (o.side ?? (k % 2 ? 1 : -1)), nn = mul([-t[1], t[0]], sd), l = len * R(f, 0.7, 1.2), bw = l * 0.32;
    const b0 = add(C[i], mul(t, bw)), b1 = add(C[i], mul(t, -bw)), tip = add(add(C[i], mul(nn, l + (o.off ?? 0))), mul(t, -l * 0.45));
    f.part([add(b0, mul(nn, o.off ?? 0)), [...tip, 1], add(b1, mul(nn, o.off ?? 0))], { fill: o.col || P.rotL, shadow: P.rotS, shade: 0.4, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, k: 0.6 });
    f.line([lerp(add(b0, mul(nn, o.off ?? 0)), tip, 0.6), tip], 0.9, o.tip || P.yelL, { op: 0.75 });
  }
}
// a briar cane: a thin dark ribbon along pts, thorny, a few small rotted leaves
function briar(f, pts, w, o = {}) {
  const C = spline(pts, 4), n = C.length, W = C.map((_, i) => Math.max(1.6, w * (1 - 0.6 * i / (n - 1))));
  f.part(ribbon(C, W), { fill: o.col || P.rot, shadow: P.rotS, light: P.rotL, shade: 0.4, inkW: 1.1, inkHeavy: 1.8, cast: o.cast ?? true, castOp: 0.3, hatch: false, maxShade: w * 0.4 });
  f.line(offsetLine(C, () => -w * 0.22).slice(1, -1), Math.max(0.7, w * 0.15), P.rotL, { op: 0.7 });
  thorns(f, pts, o.thorns ?? Math.max(2, Math.round(arcLen(C).pop() / (w * 2.6))), w * 1.4, { off: w * 0.3 });
  for (let i = 0; i < (o.leaves ?? 1); i++) { const k = Math.min(n - 2, Math.max(1, Math.round(R(f, 0.3, 0.85) * (n - 1)))); leaf(f, C[k], Math.atan2(C[k + 1][1] - C[k - 1][1], C[k + 1][0] - C[k - 1][0]) + (f.r() > 0.5 ? 0.9 : -0.9), w * 3.2); }
}
// a rotted leaf: a pointed blade with a midrib, eaten through in places (lace), browned and blotched
function leaf(f, b, a, s, o = {}) {
  const F = frame(b, a, s), col = o.col || P.rot;
  const pts = F([[0, 0], [0.2, -0.2], [0.55, -0.24], [0.85, -0.12], [1.05, 0.02, 1], [0.8, 0.13], [0.5, 0.22], [0.2, 0.16]]);
  f.part(pts, { fill: col, shadow: P.rotS, light: P.rotL, shade: 0.4, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, k: 0.9 });
  f.line(F([[0.02, 0], [0.5, 0.0], [1.0, 0.02]]), 0.8, P.rotL, { op: 0.7 });
  for (const q of [[0.45, -0.1], [0.7, 0.08]]) f.flat(F(ell(q, 0.06, 0.04, 0, 6)), P.loamB, { op: 0.6 });
  if (o.hole !== false) f.flat(F(ell([0.62, -0.06], 0.05, 0.035, 0, 6)), P.loamD, { op: 0.9 });
}
// a skin crack splitting open with fungus pushing out: dark lips, a pale inner flesh, caps or brackets set into it
function rotSplit(f, pts, w, o = {}) {
  const C = spline(pts, 3);
  f.stroke(C, w * 2.4, o.lip || P.loamD, { op: 0.9 });
  f.stroke(C, w * 1.3, o.inner || P.pinkS);
  f.line(offsetLine(C, t => w * 0.7 * Math.sin(Math.PI * (0.1 + 0.8 * t))).slice(1, -1), Math.max(0.7, w * 0.25), o.edge || P.pinkL, { op: 0.75 });
  return C;
}
// fur detail inside a mass: directional clumps (a dark trough with a lit ridge beside it), following dir(p) (kit_XII)
function furField(f, outline, n, len, o = {}) {
  const bb = E.bbox(outline), dirF = o.dir || (() => [0, 1]);
  clipDraw(f, outline, () => {
    for (let i = 0; i < n; i++) {
      const p = [bb[0] + f.r() * (bb[2] - bb[0]), bb[1] + f.r() * (bb[3] - bb[1])], d = E.norm(dirF(p)), nn = [-d[1], d[0]], l = len * (0.5 + f.r() * 0.8), bw = (f.r() - 0.5) * l * 0.25;
      const pts = [p, add(add(p, mul(d, l * 0.5)), mul(nn, bw)), add(p, mul(d, l))];
      f.stroke(pts, (o.w || 3.4) * (0.6 + f.r() * 0.7), o.dark || P.boneS, { op: o.op ?? 0.5 });
      f.line(pts.map(q => add(q, mul(nn, -(o.w || 3.4) * 0.9))), 1, o.lite || '#ffffff', { op: o.liteOp ?? 0.7 });
    }
  });
}
// a cervid leg after the Silence Stag (world_XII): one outline from the top joint (point of shoulder / hip) through the
// elbow or stifle, the knee (carpus) or hock, the fetlock, to the end of the pastern; the elbow point and the point of
// the hock as bumps; a cannon with its tendon behind; dewclaws; a cloven hoof. Cut for the rig at the elbow/stifle and the
// knee/hock: bones leg_<k>_1, _2, _3. L: {S,E,K,F,Q}; ws: widths at those joints; part: 1 the upper leg, 2 the rest, 3 both.
function cervidLeg(f, L, k, ws, look, o = {}) {
  // (reviewer, pass 2) the outline is laid by hand from explicit profiles so the leg is built like a deer's, not a column:
  // the forearm/gaskin tapering hard into the knee/hock, a bony knee knob (front leg: flat-fronted carpus with the
  // accessory carpal standing out behind; hind leg: the point of the hock standing sharp behind and above the joint), a
  // cannon about 40% of the forearm's width with its tendon behind, a fetlock bulging at the joint, a short pastern.
  // +offset = back of the leg on every segment (lp's normal, deer drawn facing right).
  const front = k[0] === 'f', part = o.part ?? 3, gy = o.gy ?? f.o.groundY;
  const { S, E: El, K: Kn, F: Ft, Q } = L;
  const [w0, w1, wK0, wF0, wQ0] = ws, wK = wK0, wC = o.cannon ?? wK0 * 0.62, wF = wF0 * 1.08, wP = wQ0 * 0.92;
  const fr = front ? [
    lp(S, El, 0, -0.5 * w0), lp(S, El, 0.5, -0.4 * w0), lp(El, Kn, 0, -0.4 * w1), lp(El, Kn, 0.3, -0.37 * w1), lp(El, Kn, 0.7, -0.28 * w1), lp(El, Kn, 0.93, -0.5 * wK),
    lp(Kn, Ft, -0.03, -0.58 * wK), lp(Kn, Ft, 0.09, -0.5 * wK), lp(Kn, Ft, 0.2, -0.5 * wC), lp(Kn, Ft, 0.6, -0.47 * wC), lp(Kn, Ft, 0.86, -0.5 * wC), lp(Kn, Ft, 0.98, -0.5 * wF),
  ] : [
    lp(S, El, 0, -0.5 * w0), lp(S, El, 0.6, -0.42 * w0), lp(S, El, 1.0, -0.36 * w1), lp(El, Kn, 0.15, -0.3 * w1), lp(El, Kn, 0.5, -0.2 * w1), lp(El, Kn, 0.85, -0.5 * wK), lp(El, Kn, 1.0, -0.48 * wK),
    lp(Kn, Ft, 0.12, -0.55 * wC), lp(Kn, Ft, 0.5, -0.5 * wC), lp(Kn, Ft, 0.86, -0.5 * wC), lp(Kn, Ft, 0.98, -0.5 * wF),
  ];
  const pastern = [lp(Ft, Q, 0.3, -0.5 * wP), lp(Ft, Q, 1.0, -0.5 * wP), lp(Ft, Q, 1.0, 0.5 * wP), lp(Ft, Q, 0.35, 0.55 * wP)];
  const bk = front ? [
    lp(Kn, Ft, 1.05, 0.58 * wF), lp(Kn, Ft, 0.9, 0.52 * wC), lp(Kn, Ft, 0.5, 0.52 * wC), lp(Kn, Ft, 0.18, 0.54 * wC), [...lp(Kn, Ft, 0.04, 0.62 * wK), 1], lp(El, Kn, 0.9, 0.42 * wK),
    lp(El, Kn, 0.6, 0.2 * w1), lp(El, Kn, 0.25, 0.34 * w1), lp(El, Kn, 0.02, 0.46 * w1), lp(S, El, 0.85, 0.55 * w1), lp(S, El, 0.4, 0.45 * w0), lp(S, El, 0, 0.5 * w0),
  ] : [
    lp(Kn, Ft, 1.05, 0.58 * wF), lp(Kn, Ft, 0.9, 0.5 * wC), lp(Kn, Ft, 0.45, 0.52 * wC), lp(Kn, Ft, 0.1, 0.46 * wK), [...lp(El, Kn, 1.08, 0.95 * wK), 1], lp(El, Kn, 0.8, 0.5 * wK),
    lp(El, Kn, 0.5, 0.22 * w1), lp(El, Kn, 0.18, 0.38 * w1), lp(S, El, 0.9, 0.55 * w1), lp(S, El, 0.45, 0.44 * w0), lp(S, El, 0, 0.5 * w0),
  ];
  const shape = [...fr, ...pastern, ...bk];
  const [k1, k2] = jcut(S, El, Kn, w1 * 0.55), [c1, c2] = jcut(El, Kn, Ft, wK * 0.6);
  const sc = o.sc ?? 1, fd = o.furDark || P.boneS, fl = o.furLite || '#ffffff';
  // roots wound round the leg: a helix about the axis from the hoof up toward the knee; the runs behind the leg are drawn
  // before it, the runs in front after it, each front run throwing a shadow onto the leg
  const wraps = (o.wrap || []).map(wr => {
    const ax = [Q, Ft, lerp(Ft, Kn, wr.up ?? 0.85)], aw = [wP, wF, wC], seg = [0, E.len(sub(Ft, Q))], Lt = seg[1] + E.len(sub(ax[2], Ft));
    const pts = []; for (let i = 0; i <= 48; i++) { const u = i / 48, sl = u * Lt, j = sl < seg[1] ? 0 : 1, t = j ? (sl - seg[1]) / (Lt - seg[1]) : sl / seg[1], c = lerp(ax[j], ax[j + 1], t), ww = aw[j] + (aw[j + 1] - aw[j]) * t, d = E.norm(sub(ax[j + 1], ax[j])), nn = [-d[1], d[0]], ph = (wr.phase ?? 0) + (wr.turns ?? 2.2) * Math.PI * 2 * u; pts.push([add(c, mul(nn, Math.cos(ph) * (ww / 2 + (wr.w ?? 10) * 0.35))), Math.sin(ph) > 0]); }
    const runs = []; let cur = null; for (const [q, fz] of pts) { if (!cur || cur.front !== fz) { if (cur) cur.pts.push(q); cur = { front: fz, pts: cur ? [cur.pts[cur.pts.length - 1]] : [] }; runs.push(cur); } cur.pts.push(q); }
    return { wr, runs: runs.filter(r => r.pts.length > 2) };
  });
  const rootLook = (wr, frontRun) => ({ col: frontRun ? (wr.col || mix(P.loam, P.loamL, 0.5)) : mix(wr.col || P.loam, P.loamD, 0.5), shadow: P.loamD, light: frontRun ? P.loamB : P.loam, pow: 1, knot: 0.25, cast: frontRun, castOp: 0.5, rootlets: frontRun ? 2 : 0, hatch: !frontRun });
  const column = () => {
    for (const { wr, runs } of wraps) for (const r of runs) if (!r.front) root(f, r.pts, (wr.w ?? 10) * 0.9, (wr.w ?? 10) * 0.75, rootLook(wr, false));
    f.part(shape, Object.assign({ maxShade: w1 * 0.25 }, look, { k: 0.85 }));
    clipDraw(f, shape, () => {
      if (o.fur !== false) furField(f, shape, front ? 30 : 44, 18 * sc, { dir: () => [-0.15, 1], w: 2.6 * sc, dark: fd, lite: fl, op: 0.45 });
      // stockings: the lower leg in darker, coarser hair from just above the knee/hock to the hoof, the edge broken by hair
      if (o.stock) {
        const top = front ? -0.12 : -0.16, sp = [lp(Kn, Ft, top, -wK), lp(Kn, Ft, top + 0.05, wK * 1.2), lp(Ft, Q, 1.3, wP * 1.5), lp(Ft, Q, 1.3, -wP * 1.5)];
        softTone(f, E.smooth(shape), [[sp, o.stock, 0.78, 7 * sc], [[lp(Kn, Ft, 0.1, 0), lp(Kn, Ft, 0.1, wK), lp(Ft, Q, 1, wP), lp(Ft, Q, 1, 0)], mix(o.stock, '#000', 0.3), 0.5, 6 * sc]]);
        for (let i = 0; i < 16; i++) { const u = (i / 15 - 0.5) * 1.1, q = lp(Kn, Ft, top + 0.02 + 0.02 * Math.sin(i * 2.1), u * wK); f.line([add(q, [0, -10 * sc]), add(q, [R(f, -2, 2) * sc, 8 * sc])], 2.2 * sc, o.stock, { op: 0.7 }); }
        for (let i = 0; i < 18; i++) { const q = lp(Kn, Ft, R(f, 0.05, 0.95), R(f, -0.4, 0.4) * wC); f.line([q, add(q, [R(f, -1.5, 1.5) * sc, R(f, 6, 12) * sc])], 1.1, i % 3 ? mix(o.stock, '#000', 0.35) : mix(o.stock, '#fff', 0.25), { op: 0.7 }); }
      }
      // the cannon: tendon down the back with the groove in front of it, the bone's lit front edge
      crease(f, [lp(Kn, Ft, 0.16, 0.18 * wC), lp(Kn, Ft, 0.5, 0.16 * wC), lp(Kn, Ft, 0.86, 0.2 * wC)], 2.4 * sc, { col: fd, lit: fl, op: 0.7 });
      f.line([lp(Kn, Ft, 0.2, 0.4 * wC), lp(Kn, Ft, 0.85, 0.42 * wC)], 1.4 * sc, fl, { op: 0.4 });
      f.line([lp(Kn, Ft, 0.14, -0.34 * wC), lp(Kn, Ft, 0.86, -0.34 * wC)], 1.6 * sc, fl, { op: 0.6 });
      // the knee / hock: a bony knob, lit, with a crease under it; the hind leg's point of the hock lit and its tendon
      if (front) {
        softTone(f, E.smooth(shape), [[ell(lp(Kn, Ft, -0.01, -0.22 * wK), 0.3 * wK, 0.24 * wK, 0, 10), fl, 0.3, 2 * sc]]);
        f.line(ell(lp(Kn, Ft, -0.01, -0.2 * wK), 0.32 * wK, 0.26 * wK, 0, 14).slice(5, 13), 1.6 * sc, fd, { op: 0.6 }); // the knob's lower edge
        crease(f, [lp(Kn, Ft, 0.1, -0.45 * wK), lp(Kn, Ft, 0.12, -0.1 * wK), lp(Kn, Ft, 0.1, 0.3 * wK)], 2.2 * sc, { col: fd, lit: fl, op: 0.7 });
        crease(f, [lp(El, Kn, 0.88, -0.4 * wK), lp(El, Kn, 0.9, 0), lp(El, Kn, 0.88, 0.35 * wK)], 1.8 * sc, { col: fd, lit: fl, op: 0.55 });
        f.flat(ell(lp(Kn, Ft, 0.04, 0.42 * wK), 0.16 * wK, 0.2 * wK, 0, 8), fl, { op: 0.35 }); // the accessory carpal
      } else {
        f.line([lp(El, Kn, 0.45, 0.2 * w1), lp(El, Kn, 0.8, 0.42 * wK), lp(El, Kn, 1.05, 0.8 * wK)], 2 * sc, fl, { op: 0.55 }); // the Achilles tendon running to the point of the hock
        crease(f, [lp(El, Kn, 0.5, 0.05 * w1), lp(El, Kn, 0.85, 0.12 * wK), lp(Kn, Ft, 0.08, 0.2 * wK)], 2.2 * sc, { col: fd, lit: fl, op: 0.65 });
        softTone(f, E.smooth(shape), [[ell(lp(El, Kn, 1.03, 0.6 * wK), 0.22 * wK, 0.2 * wK, 0, 8), fl, 0.35, 2 * sc]]);
        crease(f, [lp(Kn, Ft, 0.0, -0.45 * wK), lp(Kn, Ft, 0.06, 0), lp(Kn, Ft, 0.1, 0.35 * wK)], 2 * sc, { col: fd, lit: fl, op: 0.6 });
      }
      // the fetlock: the joint's bulge, lit on its front, creases round it
      softTone(f, E.smooth(shape), [[ell(lp(Kn, Ft, 0.98, -0.12 * wF), 0.32 * wF, 0.26 * wF, 0, 10), fl, 0.25, 2 * sc]]);
      f.line(ell(lp(Kn, Ft, 0.98, -0.1 * wF), 0.36 * wF, 0.3 * wF, 0, 14).slice(6, 12), 1.4 * sc, fd, { op: 0.5 });
      crease(f, [lp(Ft, Q, 0.12, -0.5 * wP), lp(Ft, Q, 0.18, 0), lp(Ft, Q, 0.12, 0.5 * wP)], 1.8 * sc, { col: fd, lit: fl, op: 0.6 });
      crease(f, [lp(Kn, Ft, 0.9, -0.45 * wC), lp(Kn, Ft, 0.92, 0), lp(Kn, Ft, 0.9, 0.45 * wC)], 1.6 * sc, { col: fd, lit: fl, op: 0.5 });
      if (front) crease(f, [lp(S, El, 0.9, w0 * 0.3), lp(El, Kn, 0.15, w1 * 0.1), lp(El, Kn, 0.4, -w1 * 0.1)], 2.4 * sc, { col: fd, op: 0.45 });
      else crease(f, [lp(El, Kn, 0.1, w1 * 0.3), lp(El, Kn, 0.4, w1 * 0.15), lp(El, Kn, 0.7, wK * 0.3)], 2.4 * sc, { col: fd, op: 0.5 });
      if (o.inside) o.inside(shape);
      // (ruler pass, used only where o.planes is set) the joints' plane changes as hard-edged lit and shadow facets, not soft
      // tones: the knee's flat front face lit with its side turning away dark and the step down to the cannon; the point
      // of the hock lit as a facet over the dark flexion; the fetlock's front-top facet lit and its underside dark, the
      // pastern's front strip lit. Crisp ink at each plane break. o.planes scales the strength (far legs dimmer).
      if (o.planes) { const pk = o.planes, sharp = pts => pts.map(q => [...q, 1]);
        if (front) {
          const A = sharp([lp(El, Kn, 0.86, -0.46 * wK), lp(Kn, Ft, -0.03, -0.58 * wK), lp(Kn, Ft, 0.09, -0.5 * wK), lp(Kn, Ft, 0.11, -0.06 * wK), lp(El, Kn, 0.9, -0.08 * wK)]);
          f.flat(A, fl, { op: 0.62 * pk });
          f.flat(sharp([lp(El, Kn, 0.9, -0.08 * wK), lp(Kn, Ft, 0.11, -0.06 * wK), lp(Kn, Ft, 0.13, 0.5 * wK), lp(Kn, Ft, 0.0, 0.62 * wK), lp(El, Kn, 0.92, 0.4 * wK)]), fd, { op: 0.5 * pk });
          f.line([lp(El, Kn, 0.9, -0.08 * wK), lp(Kn, Ft, 0.11, -0.06 * wK)], 1.6 * sc, INK, { op: 0.7 * pk }); // the plane break
          f.line([lp(Kn, Ft, 0.12, -0.52 * wK), lp(Kn, Ft, 0.14, 0.0), lp(Kn, Ft, 0.14, 0.5 * wC)], 2.2 * sc, INK, { op: 0.75 * pk }); f.line([lp(Kn, Ft, 0.1, -0.5 * wK), lp(Kn, Ft, 0.12, -0.05 * wK)], 1.4 * sc, fl, { op: 0.7 * pk }); // the step down to the cannon
        } else {
          const ph = lp(El, Kn, 1.06, 0.78 * wK);
          f.flat(sharp([lp(El, Kn, 0.8, 0.48 * wK), ph, lp(Kn, Ft, 0.08, 0.5 * wK), lp(Kn, Ft, 0.04, 0.12 * wK), lp(El, Kn, 0.86, 0.12 * wK)]), fl, { op: 0.5 * pk }); // the point of the hock's lit facet
          f.flat(sharp([lp(El, Kn, 0.82, -0.5 * wK), lp(El, Kn, 0.86, 0.1 * wK), lp(Kn, Ft, 0.04, 0.1 * wK), lp(Kn, Ft, 0.12, -0.55 * wC), lp(El, Kn, 1.0, -0.48 * wK)]), fd, { op: 0.45 * pk }); // the hock's front, in the flexion's shadow
          f.line([lp(El, Kn, 0.86, 0.1 * wK), lp(Kn, Ft, 0.04, 0.1 * wK)], 1.6 * sc, INK, { op: 0.7 * pk });
        }
        f.flat(sharp([lp(Kn, Ft, 0.84, -0.5 * wC), lp(Kn, Ft, 0.98, -0.5 * wF), lp(Ft, Q, 0.22, -0.5 * wP), lp(Ft, Q, 0.18, -0.02 * wP), lp(Kn, Ft, 0.9, -0.04 * wC)]), fl, { op: 0.6 * pk }); // the fetlock's front-top facet
        f.flat(sharp([lp(Kn, Ft, 0.92, 0.0), lp(Kn, Ft, 1.05, 0.58 * wF), lp(Ft, Q, 0.4, 0.55 * wP), lp(Ft, Q, 0.2, 0.02 * wP)]), fd, { op: 0.55 * pk }); // its underside, dark
        f.line([lp(Kn, Ft, 0.9, -0.04 * wC), lp(Ft, Q, 0.18, -0.02 * wP), lp(Ft, Q, 0.5, 0.0)], 1.6 * sc, INK, { op: 0.7 * pk }); // the break
        f.flat(sharp([lp(Ft, Q, 0.3, -0.5 * wP), lp(Ft, Q, 0.95, -0.5 * wP), lp(Ft, Q, 0.95, -0.22 * wP), lp(Ft, Q, 0.3, -0.2 * wP)]), fl, { op: 0.45 * pk }); // the pastern's lit front strip
      }
      // the shadows the wound roots throw on the leg where they pass in front
      for (const { wr, runs } of wraps) for (const r of runs) if (r.front) f.stroke(r.pts.map(q => add(q, [-3 * sc, 6 * sc])), (wr.w ?? 10) * 1.8, P.loamD, { op: 0.45 });
    });
    for (const { wr, runs } of wraps) for (const r of runs) if (r.front) root(f, r.pts, (wr.w ?? 10), (wr.w ?? 10) * 0.8, rootLook(wr, true));
    // the ergot's tuft at the back of the fetlock
    for (let i = 0; i < 5; i++) { const q = lp(Kn, Ft, 1.02, 0.5 * wF); f.line([q, add(q, [(i - 2) * 2 * sc, R(f, 8, 14) * sc])], 1.2, o.stock || fd, { op: 0.8 }); }
  };
  if (part & 1) split(f, column, [[`leg_${k}_1`, k1]]);
  if (!(part & 2)) return shape;
  split(f, column, [[`leg_${k}_2`, [k2, c1]], [`leg_${k}_3`, c2]]);
  f.bone(`leg_${k}_3`);
  const hoof = o.hoof || '#3a3436', hs = o.hs ?? 1, dF = E.norm(sub(L.Q, L.F)), nF = [-dF[1], dF[0]];

  for (const o2 of [0, 7]) f.part([add(add(L.F, mul(nF, (16 + o2 * 0.3) * hs)), mul(dF, (6 + o2) * hs)), add(add(L.F, mul(nF, (30 + o2 * 0.3) * hs)), mul(dF, (14 + o2) * hs)), add(add(L.F, mul(nF, 26 * hs)), mul(dF, (24 + o2) * hs)), add(add(L.F, mul(nF, 14 * hs)), mul(dF, (16 + o2) * hs))], { fill: hoof, shadow: '#141214', light: '#7a7476', shade: 0.3, inkW: 1, cast: false }); // dewclaws
  const hv = dx => [[Q[0] + (-16 + dx) * hs, Q[1] - 4 * hs], [Q[0] + (8 + dx) * hs, Q[1] - 8 * hs], [Q[0] + (34 + dx) * hs, gy - 2, 1], [Q[0] + (30 + dx) * hs, gy + 2, 1], [Q[0] + (-14 + dx) * hs, gy + 2, 1], [Q[0] + (-20 + dx) * hs, gy - 12 * hs]];
  f.part(hv(-8), { fill: mix(hoof, '#000', 0.25), shadow: '#141214', light: '#6a6466', shade: 0.35, inkW: 1.2, cast: false, grime: false });
  f.part(hv(4), { fill: hoof, shadow: '#141214', light: '#7a7476', shade: 0.35, inkW: 1.4, cast: false, grime: false });
  f.line([[Q[0] + 2 * hs, Q[1] - 4 * hs], [Q[0] + 24 * hs, gy - 4]], 1.1, '#8a8486', { op: 0.6 }); f.line([[Q[0] + 12 * hs, gy - 18 * hs], [Q[0] + 16 * hs, gy]], 1.2, INK, { op: 0.8 }); // horn grain, the cleft
  return shape;
}

// ---------------------------------------------------------------- ground
// black loam: a low mound whose top edge is the ground line, clods and a few fallen petals
function loamGround(f, x0, x1, gy, o = {}) {
  const dep = o.depth ?? 18, n = Math.max(6, Math.round((x1 - x0) / 50)), top = [], bot = [];
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, e = Math.min(1, i / 1.5, (n - i) / 1.5); top.push([x, gy - (1 + f.r() * 4) * e + (1 - e) * 5]); bot.push([x + (f.r() - 0.5) * 10, gy + dep * (0.5 + f.r() * 0.5) * (0.4 + e * 0.6)]); }
  const pts = [...top, ...bot.reverse()];
  f.part(pts, { fill: P.loam, shadow: P.loamD, light: P.loamL, shade: 0.2, maxShade: 6, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false, grime: false, gritOp: 0.6 });
  clipDraw(f, pts, () => { for (let i = 0; i < n * 3; i++) { const q = [x0 + f.r() * (x1 - x0), gy + 2 + f.r() * dep * 0.7]; f.flat(ell(q, R(f, 2, 6), R(f, 1.2, 3), 0, 7), f.r() > 0.5 ? P.loamL : P.loamD, { op: 0.8 }); } });
  for (let i = 0; i < (o.petals ?? 4); i++) { const q = [x0 + f.r() * (x1 - x0), gy + R(f, 0, 6)]; f.part(ell(q, R(f, 4, 7), R(f, 1.6, 2.6), R(f, -0.4, 0.4), 8), { fill: [P.pink, P.lilac, P.yel][i % 3], shadow: P.lilacS, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); }
  return pts;
}

module.exports = {
  P, base, rnd, R, scatter, ang, elb, pd, textures, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, mlimb, humanJoints, rope,
  softTone, stains, crease, creaseField, offsetLine, hairClump, fullLeg, prune, openHand, muscleArm, placeFigure, split, side, bareArm, multi,
  cutHoles, voidDisk, eye, eyes, FL, hostShadow, mould, fungalFur, pustules, spores, puff, peel, bracket, brackets, cap, caps, puffball, coral, bloom, moss, root, thorns, briar, leaf, rotSplit, furField, cervidLeg, loamGround,
};
