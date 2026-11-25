// World XIII, The Black Pyre (Fire + Void, Hollow Flame): local helpers. Shared files stay frozen; everything new lives here.
// Copied from reviewed kits so this world does not depend on their files: spline/arcLen/ik/clipDraw/ribbon/jointLimb/
// jcut/creases/fistDetail/tube/mlimb/humanJoints/rope/softTone/stains/crease/creaseField/offsetLine/hairClump/fullLeg/
// prune/openHand/tableHand/link/ironChain/greyFace/wraps (kit_IX, which took them from kit_I_a, kit_II, kit_VII and
// kit_keepers); seam/crackNet/flakes/ash/soot (kit_VIII, recoloured: this fire gives no light); split/side (dirAC).
//
// Fire (dominant) consumes from inside: skin split into seams with charred lips, charred edges, ash curling upward,
// flaking. Never cartoon flames on heads (only where the bible names them: the Saint's hair as smoke, the Candle Wraith).
// Void unmakes: the fire is black with violet edges and casts no light (no glow halos, no bloom, no light thrown on
// neighbouring surfaces); clean round holes with clean rims where matter is gone, never ragged; eyes only with purpose.
// Never purple sparkles or galaxies.
// Palette: black flame with violet edges, ash grey, char; plus ink black, bone and grey. Gold only on the Saint's halo.
// Red only for doom and rubric (and the Inquisitor's red-black robes and the Penitent's raw flesh, both named by the bible).
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  ash: '#8c8884', ashL: '#b8b4ae', ashD: '#5e5a58', ashS: '#2c282a', ashW: '#d4d0c8',
  cinder: '#4c4648', cinderL: '#6e6668', cinderD: '#2c2628',
  char: '#2e2826', charL: '#4e4442', charD: '#181314', charS: '#0b0809',
  flame: '#0c0912', flameM: '#1e1628', vio: '#8a58c6', vioL: '#c8a6f0', vioD: '#4c2c72', vioS: '#24163a',
  bone: '#d6cfbe', boneD: '#9c937f', boneS: '#5e574a',
  skin: '#8e8682', skinS: '#3a3036', skinD: '#5c5452', // ash-grey dead skin; a violet-brown shadow so it reads as flesh
  shift: '#d6d0c4', shiftD: '#a49c90', shiftS: '#5a5250',
  iron: '#3c3a3c', ironD: '#222022', ironL: '#68646a', rust: '#5a3a2a',
  steel: '#3e4046', steelL: '#6a6c74', steelD: '#202126', // blackened plate
  robe: '#3c1517', robeD: '#1c0a0c', robeL: '#62252a', robeS: '#0e0405', // deep red-black (bible)
  rochet: '#cfc9bd', rochetD: '#8e877c',
  sack: '#6e6a60', sackD: '#45423c', sackL: '#8e897d',
  leather: '#3a3230', leatherD: '#201a19', leatherL: '#5a4e4a',
  wood: '#2a2422', woodD: '#151112', woodL: '#4a403c', // black pyre wood
  wax: '#d8d0bc', waxD: '#a0957e',
  raw: '#7a3a34', rawD: '#4a1c1a', rawL: '#a2584c', // the Penitent's flayed flesh (bible: raw red)
  rubric: '#9a2a1e',
  gold: '#c49a3a', goldL: '#f0d488', goldD: '#7a5418', goldS: '#4a3010', // the Saint's halo only
  black: '#121012', grey: '#77736e', mud: '#33302e',
};

// the world's render setup: kit.foeBase, a violet-grey shadow, ash at the feet; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.22), shadowTint: '#241c28', mud: P.mud }, o));
const rnd = (f, a, b) => a + (b - a) * f.r();
const R = rnd;
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
const pd = pts => E.smooth(pts, false);

// looks
const SK = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.32, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o);
const CH = (f, o = {}) => Object.assign({ fill: P.char, shadow: P.charS, light: P.charL, shade: 0.36, tex: 'craze' + f.o.seed, texOp: 0.6 }, o);
const ASH = (f, o = {}) => Object.assign({ fill: P.ash, shadow: P.ashS, light: P.ashL, shade: 0.34, tex: 'craze' + f.o.seed, texOp: 0.45 }, o);

// texture patterns and filters for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 11 + 7);
  // craze: a fine net of charred cracks for burnt skin, cinder, leather and wood
  let c = '';
  for (let i = 0; i < 18; i++) { let x = r() * 48, y = r() * 48, a = r() * 6.3; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 3; k++) { a += (r() - 0.5) * 1.6; x += Math.cos(a) * (3 + r() * 5); y += Math.sin(a) * (3 + r() * 5); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } c += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="craze${s}" patternUnits="userSpaceOnUse" width="48" height="48">${c}</pattern>`);
  // ashtex: pale ash specks and short dark flecks (ash caked on a surface)
  let a = '';
  for (let i = 0; i < 40; i++) { const x = r() * 40, y = r() * 40, rr = 0.5 + r() * 1.3; a += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > 0.35 ? P.ashW : '#1a1618'}" opacity="${(0.35 + r() * 0.45).toFixed(2)}"/>`; }
  f.defs.push(`<pattern id="ashtex${s}" patternUnits="userSpaceOnUse" width="40" height="40">${a}</pattern>`);
  // grain: black wood, split along the grain
  let g = '';
  for (let i = 0; i < 9; i++) { const y = r() * 60; g += `<path d="M0,${y.toFixed(1)} q15,${((r() - 0.5) * 4).toFixed(1)} 30,0 t30,${((r() - 0.5) * 3).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${(0.7 + r() * 0.6).toFixed(1)}" opacity="0.75"/>`; }
  f.defs.push(`<pattern id="grain${s}" patternUnits="userSpaceOnUse" width="60" height="60">${g}</pattern>`);
  let fu = '';
  for (let i = 0; i < 30; i++) { const x = r() * 30, y = r() * 30, l = 4 + r() * 5; fu += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q1,${(l / 2).toFixed(1)} ${(r() - 0.5).toFixed(1)},${l.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="fur${s}" patternUnits="userSpaceOnUse" width="30" height="30">${fu}</pattern>`);
  // fine wrinkles (for skin and velvet)
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  f.defs.push(`<filter id="smk${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`);
  f.defs.push(`<filter id="smkL${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>`);
  f.defs.push(`<filter id="mb${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>`);
  f.defs.push(`<filter id="soft${s}x" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
}
// ---- geometry helpers (copied from kit_VII / kit_I_c / kit_I_b)
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
// a hand lying palm-down on a surface seen from the side (copied from kit_keepers tableHand, frame helper inlined)
const fr2 = (o, a0, su, sv) => pts => pts.map(p => { const q = add(o, rot([p[0] * su, p[1] * sv], a0)); return p[2] ? [q[0], q[1], 1] : q; });
function tableHand(f, W, a0, L, col, o = {}) {
  const F = fr2(W, a0, L, L), sh = o.shadow || P.skinS, dk = mix(col, '#000', 0.45), lt = mix(col, '#fff', 0.35);
  const look = x => Object.assign({ fill: col, shadow: sh, shade: 0.45, inkW: 1, inkHeavy: 1.5, cast: false, tex: o.tex, texOp: o.texOp }, x);
  const ds = mul(o.depth || [-0.5, -2.4], L / 70), lift = o.light ? -0.03 : 0;
  const at = (pts, d) => F(pts).map(q => add(q, mul(ds, d)));
  f.flat(at([[-0.06, 0.0], [0.5, -0.01], [1.02, -0.005], [1.0, 0.035], [0.4, 0.04], [-0.06, 0.03]], o.thumbNear ? 1 : 0.5), '#0c0a08', { op: 0.45 });
  const fing = { index: [0.95, 0.105, 0.08], middle: [1.0, 0.11, 0.082], ring: [0.94, 0.1, 0.076], little: [0.82, 0.088, 0.068] };
  const order = o.thumbNear ? ['little', 'ring', 'middle', 'index'] : ['index', 'middle', 'ring', 'little'];
  const thumb = d => {
    const pts = [[0.06, -0.09 + lift], [0.24, -0.075 + lift], [0.4, -0.05 + lift], [0.52, -0.04 + lift]];
    f.part(at(tube(pts, [0.13, 0.11, 0.095, 0.085].map(x => x * (o.fw || 1))), d), look({}));
    f.flat(at(ell([0.48, -0.065 + lift], 0.04, 0.018, 0, 6), d), lt, { op: 0.6 });
    f.line(at([[0.3, -0.12 + lift], [0.31, -0.03 + lift]], d), 0.8, dk, { op: 0.5 });
  };
  if (!o.thumbNear && o.thumb !== false) thumb(4.2);
  order.forEach((n, i) => {
    const [ue, w0, w1] = fing[n], d = 3 - i, cu = (o.curl || 0), tl = o.tips;
    const pts = [[0.44, -0.12 + lift], [0.66, -0.088 + lift * 0.8], [0.83 * ue / 0.95, -0.06 + lift * 0.5 + cu * 0.03], [ue, -w1 / 2 + cu * 0.06]];
    f.part(at(tube(pts, [w0, w0 * 0.92, w1 * 1.02, w1].map(x => x * (o.fw || 1))), d), look({ inkW: 0.9, inkHeavy: 1.3, shade: 0.35 }));
    if (tl && tl !== col) f.part(at(tube([lerp(pts[2], pts[3], 0.25), pts[3]], [w1 * 1.0, w1]), d), look({ fill: tl, inkW: 0.6, inkHeavy: 0, shade: 0.3 }));
    f.line(at([[0.66, -0.088 - w0 * 0.5 + lift], [0.675, -0.088 + w0 * 0.15 + lift]], d), 0.8, dk, { op: 0.55 });
    f.line(at([[0.83 * ue / 0.95, -0.06 - w1 * 0.5 + lift * 0.5], [0.84 * ue / 0.95, -0.06 + w1 * 0.1 + lift * 0.5]], d), 0.7, dk, { op: 0.45 });
    f.flat(at(ell([ue - 0.05, -w1 * 0.85 + cu * 0.05], 0.04, 0.014, 0, 6), d), mix(tl || col, '#fff', 0.4), { op: 0.7 });
  });
  f.part(at([[-0.06, 0.0 + lift], [-0.08, -0.13], [-0.02, -0.235], [0.14, -0.27], [0.3, -0.255], [0.44, -0.2], [0.5, -0.135], [0.47, -0.05 + lift], [0.4, 0.0 + lift]], 0.6), look({ shade: 0.4, inkW: 1.2, inkHeavy: 1.8 }));
  for (let i = 0; i < 4; i++) f.flat(at(ell([0.45, -0.2 + i * 0.025], 0.035, 0.022, 0, 6), 3 - i), lt, { op: 0.45 });
  f.line(at([[0.02, -0.2], [0.2, -0.235], [0.4, -0.2]], 1), 0.9, dk, { op: 0.45 });
  f.line(at([[0.02, -0.14], [0.22, -0.16], [0.42, -0.15]], 0.5), 0.9, dk, { op: 0.4 });
  if (o.thumbNear && o.thumb !== false) thumb(-1.0);
  return { F, at };
}

// ---- iron chain (copied from kit_I_a link / ironChain), rust as the bloom
function link(f, c, a0, l, w, faceOn, col = P.iron) {
  if (faceOn) {
    const ry = l * 0.34, o = ell(c, l / 2, ry, a0, 20), i = ell(c, l / 2 - w * 0.9, ry - w * 0.8, a0, 20);
    f.part(E.smooth(o) + ' ' + E.smooth(i.slice().reverse()), { bbPts: o, fill: col, shade: 0.45, inkW: 1.3, inkHeavy: 2.2, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.6 });
    f.line([add(c, rot([-l * 0.3, -ry * 0.75], a0)), add(c, rot([l * 0.1, -ry * 0.85], a0))], 1.2, mix(col, '#fff', 0.4), { op: 0.6 });
  } else {
    f.part(limb(add(c, rot([-l / 2 + w * 0.5, 0], a0)), add(c, rot([l / 2 - w * 0.5, 0], a0)), w * 1.15, w * 1.15, { steps: 4, capK: 1 }), { fill: mix(col, '#000', 0.12), shade: 0.45, inkW: 1.3, inkHeavy: 2.2, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.6 });
  }
  f.flat(ell(add(c, rot([-l * 0.15, -w * 0.3], a0)), l * 0.12, w * 0.2, a0, 8), P.rust, { op: 0.55 });
}
function ironChain(f, pts, l, w, col = P.iron, o = {}) {
  const segs = []; let acc = 0; for (let i = 0; i < pts.length - 1; i++) { const L = E.len(sub(pts[i + 1], pts[i])); segs.push([pts[i], pts[i + 1], acc, L]); acc += L; }
  const n = Math.floor(acc / (l * 0.78)), at = s => { for (const [a, b, a00, L] of segs) if (s <= a00 + L) return [lerp(a, b, (s - a00) / L), Math.atan2(b[1] - a[1], b[0] - a[0])]; const [a, b] = segs[segs.length - 1]; return [b, Math.atan2(b[1] - a[1], b[0] - a[0])]; };
  const out = [];
  for (let k = 0; k < n; k++) { const [c, a] = at(l * 0.5 + k * l * 0.78); out.push([c, a, k % 2 === (o.phase || 0)]); }
  for (const [c, a, face] of out) if (!face) link(f, c, a, l, w, false, col);
  for (const [c, a, face] of out) if (face) link(f, c, a, l, w, true, col);
  return out;
}


function greyFace(f, hF, skin, nz = 1, o = {}) {
  const tipX = 0.395 * nz + 0.02 * (1 - nz);
  f.flat(hF([[0.30, -0.07], [0.335, -0.01], [tipX - 0.02, 0.09], [tipX + 0.005, 0.12], [tipX - 0.01, 0.155], [0.35, 0.168], [0.31, 0.163], [0.27, 0.15], [0.255, 0.12], [0.27, 0.09], [0.29, 0.02]]), skin, { op: 0.55 });
  if (!o.noEar) { const ec = [-0.2, 0.04]; f.flat(hF([[ec[0] + 0.03, ec[1] - 0.12], [ec[0] - 0.04, ec[1] - 0.1], [ec[0] - 0.07, ec[1] - 0.02], [ec[0] - 0.05, ec[1] + 0.08], [ec[0] + 0.0, ec[1] + 0.14], [ec[0] + 0.05, ec[1] + 0.12], [ec[0] + 0.04, ec[1] + 0.02]]), skin, { op: 0.6 }); }
  f.flat(hF([[0.19, 0.3], [0.27, 0.297], [0.29, 0.33], [0.21, 0.335]]), skin, { op: 0.6 }); // the lower lip's shadow
}
// ---- cloth: bandage wraps across a limb or body between two edges. a/b: centreline, w0/w1: widths, n: number of turns.
// Each turn is a strip lying diagonally with a lit upper edge and a shadowed overlap below it; stains and a loose end.
function wraps(f, a, b, w0, w1, n, col, o = {}) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]], tilt = o.tilt ?? 0.3, sh = mix(col, '#000', 0.45), lt = mix(col, '#fff', 0.35);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, w = (w0 + (w1 - w0) * t) / 2, c = lerp(a, b, t), dt = 1 / n * (o.overlap ?? 0.55), L2 = E.len(sub(b, a)) * dt;
    const pa = add(add(c, mul(nn, w * 1.03)), mul(d, -L2 * tilt)), pb = add(add(c, mul(nn, -w * 1.03)), mul(d, L2 * tilt));
    f.line([pa, add(lerp(pa, pb, 0.5), mul(d, L2 * 0.12)), pb], 1.3, sh, { op: 0.75 }); // the lower edge of this turn
    f.line([add(pa, mul(d, -1.6)), add(add(lerp(pa, pb, 0.5), mul(d, L2 * 0.12)), mul(d, -1.6)), add(pb, mul(d, -1.6))], 0.9, lt, { op: 0.5 });
    if (o.stain && f.r() < o.stain) f.flat(ell(add(c, mul(nn, (f.r() - 0.5) * w)), w * 0.35, L2 * 0.6, ang(a, b), 8), o.stainCol || P.charS, { op: 0.35 });
  }
}


// ---------------------------------------------------------------- fire: splits, char and ash. This fire gives no light.
// a split in skin, wood or cloth: charred lips, a black core, the void's violet thread along both lips (no glow, no bloom)
function seam(f, pts, w = 3, o = {}) {
  const C = pts.length > 2 ? spline(pts, 3) : pts;
  f.stroke(C, w * 2.8, P.charS, { op: o.lipOp ?? 0.92 });
  f.stroke(C, w * 1.7, P.flame);
  if (C.length < 3) return;
  const tw = t => Math.sin(Math.PI * (0.1 + 0.8 * t));
  f.line(offsetLine(C, t => w * 0.62 * tw(t)).slice(1, -1), Math.max(0.7, w * 0.26), o.edge || P.vioL, { op: 0.9 });
  f.line(offsetLine(C, t => -w * 0.6 * tw(t)).slice(1, -1), Math.max(0.6, w * 0.2), P.vio, { op: 0.75 });
}
// a branching net of seams, never ruler-straight
function crackNet(f, c, a, len, w, o = {}) {
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 4;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * (o.wander ?? 0.9); q = add(q, rot([L / n, 0], b)); pts.push(q); }
    seam(f, pts, ww, o);
    if (depth > 0) for (let k = 1; k < n; k++) if (f.r() < (o.fork ?? 0.55)) go(pts[k], b + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), L * R(f, 0.35, 0.6), ww * 0.65, depth - 1);
  };
  go(c, a, len, w, o.depth ?? 2);
}
// a hairline crack with a violet thread (for small surfaces: fingers, the face, a mitre)
function hairline(f, pts, w = 1.4) { f.line(pts, w + 1.4, P.charS, { op: 0.85 }); f.line(pts.length > 2 ? pts.slice(1, -1) : pts, Math.max(0.6, w * 0.5), P.vioL, { op: 0.8 }); }
// charred flakes lifting off a surface: dark curled flakes with a pale ash under-edge
function flakes(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = -Math.PI / 2 + (f.r() - 0.5) * 2.4, l = R(f, 5, 10) * s;
    f.flat([p, add(p, rot([l, -l * 0.2], a)), add(p, rot([l * 1.1, l * 0.35], a)), add(p, rot([l * 0.3, l * 0.4], a))], P.charS, { op: 0.9 });
    f.line([add(p, rot([l * 0.3, l * 0.42], a)), add(p, rot([l * 1.08, l * 0.36], a))], 1, P.ashL, { op: 0.6 });
  }
}
// ash lifting off p and curling upward: dark and pale flakes, a rare violet speck, smaller as they rise
function ash(f, p, n, spread = 40, rise = 140, s = 1) {
  for (let i = 0; i < n; i++) {
    const t = i / n, q = add(p, [(f.r() - 0.5) * spread + Math.sin(t * 7 + p[0]) * 10 * s, -t * rise - f.r() * 12]), r = (1.2 + f.r() * 2.6) * s * (1 - t * 0.5), a = f.r() * 6.3;
    if (f.r() < 0.12) f.flat(ell(q, r * 0.6, r * 0.6, 0, 6), P.vioL, { op: 0.8 });
    else f.flat([add(q, rot([-r * 1.4, 0], a)), add(q, rot([0, -r * 0.7], a)), add(q, rot([r * 1.4, -r * 0.2], a)), add(q, rot([r * 0.3, r * 0.5], a))], f.r() > 0.45 ? '#2a2426' : P.ashL, { op: 0.8 });
  }
}
function soot(f, c, rx, ry, op = 0.5, a = 0) { f.flat(ell(c, rx, ry, a, 14).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3]) : q), P.charS, { op }); }
// pale ash caked on a surface: irregular blotches
function ashCake(f, c, rx, ry, n, s = 1, op = 0.38) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, 2.5, 7) * s, a = f.r() * 3, k = 7 + Math.floor(f.r() * 4), pts = [];
    for (let j = 0; j < k; j++) { const t = j / k * Math.PI * 2; pts.push(add(p, rot([Math.cos(t) * r * R(f, 0.6, 1.5), Math.sin(t) * r * 0.6 * R(f, 0.6, 1.4)], a))); }
    f.flat(pts, f.r() > 0.35 ? P.ashL : P.ashW, { op: op * R(f, 0.5, 1.1) });
  }
}
// a burnt edge (hem, cuff, page): a charred band on the edge, the violet thread on the very edge, curls lifting
function charEdge(f, pts, w = 6, o = {}) {
  const C = spline(pts, 3);
  f.line(C, w, P.charS, { op: o.op ?? 0.7 });
  f.line(C, w * 0.45, P.charD, { op: 0.9 });
  if (o.violet !== false) f.line(C, Math.max(0.8, w * 0.17), o.edge || P.vioL, { op: o.vop ?? 0.85 });
  const up = o.up || [0, -1], gap = o.gap || 9;
  for (let i = 2; i < C.length - 2; i += gap) {
    const d = E.norm(sub(C[i + 1], C[i - 1])), p = C[i], l = R(f, 4, 9) * (o.s || 1), sg = f.r() > 0.5 ? 1 : -1;
    f.flat([p, add(p, add(mul(d, sg * l * 0.6), mul(up, l * 0.55))), add(p, add(mul(d, sg * l), mul(up, l * 0.15))), add(p, mul(d, sg * l * 0.4))], P.charS, { op: 0.9 });
  }
}
// a hem burnt into split, curled tongues between a and b (out: unit vector away from the cloth). Returns hem points.
function charHem(f, a, b, n, depth, out, o = {}) {
  const pts = [a], ab = sub(b, a), L = E.len(ab), d = E.norm(ab);
  let t = 0;
  while (true) {
    t += R(f, 0.5, 1.5) / n; if (t > 0.97) break;
    const p = lerp(a, b, t), kind = f.r();
    if (kind < 0.55) { // a burnt tongue hanging down, curling at its tip
      const k = depth * R(f, 0.3, 0.95), w = L / n * R(f, 0.4, 0.7), side2 = rot(out, (f.r() - 0.5) * 0.5), tip = add(p, mul(side2, k)), cu = mul(d, (f.r() - 0.5) * w * 1.4);
      pts.push(add(p, mul(d, -w)), add(add(p, mul(side2, k * 0.6)), mul(d, -w * 0.55)), [...add(tip, cu), 1], add(add(p, mul(side2, k * 0.75)), add(mul(d, w * 0.1), cu)), add(add(p, mul(side2, k * 0.5)), mul(d, w * 0.6)), add(p, mul(d, w)));
    } else if (kind < 0.8) pts.push(add(p, mul(out, depth * R(f, 0.05, 0.25)))); // a shallow scallop
    else pts.push([...add(p, mul(out, depth * R(f, 0.2, 0.5))), 1]); // a short split
  }
  pts.push(b);
  return pts;
}
// a burnt hole in cloth (fire: ragged, charred rim) - not a void hole
function burnHole(f, c, r, a = 0) {
  const pts = []; for (let i = 0; i < 9; i++) { const t = i / 9 * Math.PI * 2; pts.push(add(c, rot([Math.cos(t) * r * R(f, 0.7, 1.2), Math.sin(t) * r * 0.7 * R(f, 0.7, 1.2)], a))); }
  f.flat(pts.map(q => add(c, mul(sub(q, c), 1.35))), P.charS, { op: 0.55 });
  f.flat(pts, '#0a0708');
  f.line(pts.slice(5).concat(pts.slice(0, 2)), 0.9, P.vioL, { op: 0.7 });
}

// ---------------------------------------------------------------- black flame, black smoke
// Black flame (independent review rebuild). The old helper drew rows of the same pointed triangle; this one grows each
// fire as one joined mass of irregular tongues. A tongue's centreline leaves its surface along the surface normal, turns
// upward as it rises (fire rises), sways and curls at the tip; its width bulges above the root and thins into a long
// whip whose end breaks into a smoke wisp. Big tongues fork: side tongues peel off, curl away and turn up. Many sizes
// are mixed. Every tongue of one fire is filled as a single union, so the thin violet edge runs only round the outer rim
// (rim strokes go down first, then all the fills over them, which covers every inner edge). Inside: a slightly lifted
// core on each tongue and a near-black violet lick for form. No blur, no glow, no light thrown: it casts no light.
function tongueLine(f, b, h, o) {
  const n = o.n || 22, ph = o.phase ?? f.r() * 6.28, d0 = o.dir ? E.norm(o.dir) : [0, -1], rise = o.rise ?? 1.0;
  const lA = Math.atan((o.lean ?? 0) * 1.5), sway = o.sway ?? 0.55, curl = (o.curl ?? R(f, -1, 1)) * 0.55;
  const C = [b]; let p = b;
  for (let i = 1; i <= n; i++) {
    const t = i / n; let d = E.norm(lerp(d0, [0, -1], Math.min(1, t * rise * 1.4)));
    d = rot(d, lA * (0.35 + 0.8 * t) + sway * Math.sin(t * 6.0 + ph) * (0.35 + 1.2 * t) + curl * t * t * 1.4);
    p = add(p, mul(d, h / n)); C.push(p);
  }
  return C;
}
// one tongue's outline (and its forks, pushed onto list). Returns nothing; list gets {poly, C, w, h}.
function tongue(f, list, b, h, w, o = {}, depth = 0) {
  const C = tongueLine(f, b, h, o), n = C.length - 1, ph = f.r() * 6.28, ph2 = f.r() * 6.28;
  const wf = t => w * 0.7 * Math.pow(Math.max(0, 1 - t), o.taper ?? 1.6) * (1 + 4.4 * t);
  const L = [], Rr = [];
  // a nick or two on the edges where a lick starts to split off
  const nick = [R(f, 0.3, 0.7), R(f, 0.2, 0.8)], nickS = [f.r() > 0.5 ? 1 : -1, f.r() > 0.5 ? 1 : -1];
  C.forEach((c, i) => {
    const t = i / n, a0 = C[Math.max(0, i - 1)], a1 = C[Math.min(n, i + 1)], d = E.norm(sub(a1, a0)), nn = [-d[1], d[0]];
    let kl = 1 + 0.2 * Math.sin(t * 7 + ph) + 0.08 * Math.sin(t * 15 + ph2), kr = 1 + 0.2 * Math.sin(t * 6 + ph2 + 1) + 0.08 * Math.sin(t * 13 + ph);
    for (let j = 0; j < 2; j++) { const g = Math.exp(-((t - nick[j]) ** 2) / 0.0012) * 0.55; if (nickS[j] > 0) kl -= g; else kr -= g; }
    L.push(add(c, mul(nn, wf(t) / 2 * Math.max(0.2, kl)))); Rr.push(add(c, mul(nn, -wf(t) / 2 * Math.max(0.2, kr))));
  });
  // the root sinks a little into the surface so neighbouring tongues join at their base
  const dIn = E.norm(sub(C[0], C[2])), root = add(C[0], mul(dIn, w * (o.sink ?? 0.08)));
  const poly = [...L.slice(0, n - 1), [...C[n], 1], ...Rr.slice(0, n - 1).reverse(), root];
  list.push({ poly, C, w, h, wf });
  // forks: side tongues that peel away from the body, curl outward and then rise
  if (!o.noFork && depth < 2 && h > w * 1.6) {
    const nf = h > w * 3.5 ? (f.r() < 0.6 ? 2 : 1) : (f.r() < 0.6 ? 1 : 0);
    for (let k = 0; k < nf; k++) {
      const t = R(f, 0.18, 0.55), i = Math.round(t * n), s = (k === 0 ? (f.r() > 0.5 ? 1 : -1) : -1 * (list[list.length - 1].s || 1));
      const d = E.norm(sub(C[Math.min(n, i + 1)], C[Math.max(0, i - 1)])), nn = [-d[1], d[0]];
      const bb = add(C[i], mul(nn, s * wf(t) * 0.2));
      tongue(f, list, bb, h * R(f, 0.28, 0.55) * (1 - t * 0.4), wf(t) * R(f, 0.42, 0.62), { dir: rot(d, -s * R(f, 0.35, 0.7)), rise: R(f, 1.2, 2.0), curl: s * R(f, 0.3, 1.0), sway: R(f, 0.35, 0.6), lean: (o.lean ?? 0) * 0.6, noFork: depth >= 1 }, depth + 1);
      list[list.length - 1].s = s;
    }
  }
}
// draw one fire: a list of tongues (and optional base body polygons) as one union with a violet rim
function fireMass(f, list, o = {}) {
  const ew = o.edgeW ?? 2.4, bodies = o.bodies || [];
  // smoke wisps off the tips (behind the fire): the whip continues as a thin grey thread that drifts and fades
  if (o.wisps !== false) for (const tg of list) {
    if (tg.h < 26 || f.r() < 0.25) continue;
    const C = tg.C, e = C[C.length - 1], d = E.norm(sub(e, C[C.length - 3])), l = tg.h * R(f, 0.25, 0.55), ph = f.r() * 6;
    const W = [e]; let p = e, dd = d;
    for (let i = 1; i <= 8; i++) { dd = E.norm(lerp(rot(dd, Math.sin(i * 0.9 + ph) * 0.35), [0, -1], 0.25)); p = add(p, mul(dd, l / 8)); W.push(p); }
    f.raw(`<path d="${E.smooth(ribbon(W, W.map((_, i) => Math.max(1, tg.w * 0.05) * (1 + i * 0.5))))}" fill="#26222a" opacity="0.4" filter="url(#smk${f.o.seed})"/>`);
    f.line(W.slice(0, 5), 0.8, '#4a4450', { op: 0.3 });
  }
  const polys = [...bodies, ...list.map(t => t.poly)];
  for (const p of polys) f.line([...p, p[0]], ew * 2, o.edge || P.vio, { op: o.edgeOp ?? 0.95 });
  for (const p of polys) f.line([...p, p[0]], Math.max(0.8, ew * 0.8), P.vioL, { op: 0.85 });
  for (const p of polys) f.flat(p, o.body || P.flame);
  // form inside: a lifted core along each big tongue, on its lit side, and a dark violet lick
  for (const tg of list) {
    if (tg.w < 7) continue;
    const C = tg.C, n = C.length - 1, i1 = Math.round(n * 0.78);
    const core = [], back = [];
    for (let i = 1; i <= i1; i++) { const t = i / n, d = E.norm(sub(C[Math.min(n, i + 1)], C[i - 1])), nn = [-d[1], d[0]]; core.push(add(C[i], mul(nn, tg.wf(t) * 0.12))); back.push(add(C[i], mul(nn, -tg.wf(t) * 0.2))); }
    f.flat([...core, ...back.reverse()], P.flameM, { op: 0.75 });
    if (tg.h > 40) f.line(C.slice(2, i1).map((q, i) => add(q, [Math.sin(i * 0.8) * tg.w * 0.06, 0])), Math.max(0.8, tg.w * 0.035), P.vioS, { op: 0.9 });
  }
  // a few torn-off scraps above the tallest tips: thin curved slivers, each with its own rim
  if (o.scraps !== false) list.filter(t => t.h > 90 && f.r() < 0.45).slice(0, o.maxScraps ?? 3).forEach(tg => {
    const C = tg.C, e = C[C.length - 1], d = E.norm(sub(e, C[C.length - 4])), q = add(e, add(mul(d, tg.h * R(f, 0.12, 0.25)), [R(f, -8, 8), 0]));
    const s = R(f, 0.06, 0.11) * tg.h, cu = f.r() > 0.5 ? 1 : -1, a = Math.atan2(d[1], d[0]);
    const sl = [add(q, rot([-s * 0.9, 0], a)), add(q, rot([-s * 0.2, s * 0.22 * cu], a)), [...add(q, rot([s, s * 0.35 * cu], a)), 1], add(q, rot([0, s * 0.05 * cu], a))];
    f.line([...sl, sl[0]], ew * 1.4, P.vio, { op: 0.9 }); f.flat(sl, P.flame);
  });
}
// a lone fire rising from b: one tongue with its forks and a couple of small tongues at its root (o.dir: the surface
// normal it leaves along). Signature kept from the first build: (f, b, h, w, {lean, sway, noFork, edgeW, phase, dir}).
function blackFlame(f, b, h, w, o = {}) {
  const list = [];
  tongue(f, list, b, h, w, o);
  if (!o.single && h > 24) for (let k = 0; k < (h > 80 ? 2 : 1); k++) {
    const s = k ? -1 : 1, d0 = o.dir ? E.norm(o.dir) : [0, -1], nn = [-d0[1], d0[0]];
    tongue(f, list, add(b, mul(nn, s * w * R(f, 0.25, 0.45))), h * R(f, 0.2, 0.42), w * R(f, 0.4, 0.6), { dir: rot(d0, s * R(f, 0.2, 0.5)), lean: o.lean, curl: s * R(f, 0.4, 1.2), noFork: true });
  }
  fireMass(f, list, o);
  return list[0].C;
}
// a sheet of fire off a base line: a joined body hugging the base and tongues of many sizes. tongues: [[x, h, w, lean]]
// (x along the base, as in the first build); small tongues are added between them. o.dir: rise direction (default up).
function flameSheet(f, basePts, tongues, o = {}) {
  const C = spline(basePts, 4);
  const atX = x => { let best = C[0], bd = 1e9; for (const q of C) { const d = Math.abs(q[0] - x); if (d < bd) { bd = d; best = q; } } return best; };
  const ts = tongues.slice().sort((a, b) => a[0] - b[0]), list = [], hMin = Math.min(...ts.map(t => t[1]));
  const big = (x, h, w, ln) => tongue(f, list, atX(x), h * R(f, 0.8, 1.15), w * R(f, 0.8, 1.2), { lean: (ln || 0) + R(f, -0.1, 0.1), dir: o.dir, curl: R(f, -1.3, 1.3) });
  ts.forEach(([x, h, w, ln], i) => {
    big(x, h, w, ln);
    const nx = ts[i + 1];
    if (nx) { const k = 1 + (f.r() < 0.5 ? 1 : 0); for (let j = 0; j < k; j++) { const xx = lerp([x, 0], [nx[0], 0], (j + 1) / (k + 1) + R(f, -0.08, 0.08))[0], hh = Math.min(h, nx[1]) * R(f, 0.22, 0.5); tongue(f, list, atX(xx), hh, Math.min(w, nx[2]) * R(f, 0.4, 0.65), { lean: ((ln || 0) + (nx[3] || 0)) / 2 + R(f, -0.2, 0.2), dir: o.dir, noFork: hh < 40 }); } }
  });
  // the joined body: a band hugging the base line, its top edge rolling
  const bh = Math.max(6, hMin * (o.band ?? 0.22)), top = C.filter((_, i) => i % 3 === 0).map((q, i) => add(q, [0, -bh * (0.6 + 0.4 * Math.sin(i * 1.7))]));
  const body = [...C.filter((_, i) => i % 3 === 0).map(q => add(q, [0, 2])).reverse(), ...top];
  fireMass(f, list, Object.assign({ bodies: [body] }, o));
  return body;
}
// fire burning along a surface (pts: the surface line, o.side: +1/-1 picks which normal is outward): tongues leave the
// surface along its normal and turn upward; their roots overlap so the fire is one body. n tongues, heights h0..h1.
function flames(f, basePts, n, h0, h1, w, o = {}) {
  const C = spline(basePts, 3), S = arcLen(C), T = S[S.length - 1], list = [], sd = o.side ?? 1;
  for (let i = 0; i < n; i++) {
    const u = T * (i + 0.15 + f.r() * 0.7) / n; let k = 1; while (k < S.length - 1 && S[k] < u) k++;
    const d = E.norm(sub(C[Math.min(C.length - 1, k + 1)], C[k - 1])), nn = mul([-d[1], d[0]], sd), big = f.r() < 0.35;
    tongue(f, list, C[k], R(f, h0, h1) * (big ? 1.35 : R(f, 0.5, 1)), w * R(f, 0.65, 1.2), { dir: o.up || nn, rise: o.rise ?? 0.8, lean: o.lean ?? R(f, -0.15, 0.15), curl: R(f, -1.2, 1.2), noFork: !big });
  }
  const body = !o.band ? [] : [ribbon(C.filter((_, i) => i % 2 === 0), C.filter((_, i) => i % 2 === 0).map(() => w * 0.35))];
  fireMass(f, list, Object.assign({ bodies: body }, o));
  return list;
}
// black smoke curling up from p0: a soft dark body and one thin defining curl (no cartoon puffs)
function smoke(f, p0, h, w, o = {}) {
  const sw = o.sway ?? 18, ph = o.phase ?? 0, C = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; C.push(add(p0, [Math.sin(t * 4 + ph) * sw * t + (o.drift ?? 0) * t, -h * t * (o.down ? -1 : 1)])); }
  const L = [], Rr = [];
  C.forEach((c, i) => { const t = i / 10, ww = w * (0.35 + t * 0.9) / 2; L.push(add(c, [-ww, 0])); Rr.push(add(c, [ww, 0])); });
  f.raw(`<path d="${E.smooth([...L, ...Rr.reverse()])}" fill="${o.col || '#1a161e'}" opacity="${o.op ?? 0.55}" filter="url(#${o.big ? 'smkL' : 'smk'}${f.o.seed})"/>`);
  f.line(C.slice(1).map((c, i) => add(c, [Math.sin(i * 1.3 + ph) * w * 0.2, 0])), 1.1, o.line || P.ashD, { op: o.lineOp ?? 0.6 });
  return C;
}


// ---------------------------------------------------------------- burnt wings (independent review: the first build drew
// combs of sticks). A wing whose leading edge runs shoulder S -> elbow Ew -> wrist Wr -> tip T, folded at the wrist so the
// hand breaks back from the forearm. Structure as on a real wing (after the reviewed Harpy Matron): primaries fan from
// the hand, secondaries hang from the forearm, tertials at the elbow, rows of greater and median coverts lap over their
// bases. Fire has burnt it unevenly: some flight feathers keep a charred vane with ragged, holed edges, some are burnt to
// the bare shaft with a few barb stubs, some are gone; the forearm and hand are burnt to the bone (radius and ulna side by
// side, knuckled joints), the upper arm keeps its charred skin. Black flame runs along the leading edge and follows it.
// o.bones: [upper, fore, hand]; o.tr: trailing side (+1 = +normal of the leading edge); o.dim: 0..1 darker for far wings.
function burntFeather(f, root, a, L, W, o = {}) {
  const d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]], N = 14, bend = o.bend ?? 0;
  const C = []; for (let i = 0; i <= N; i++) { const t = i / N; C.push(add(add(root, mul(d, L * t)), mul(n, bend * L * t * t))); }
  const state = o.state; // 'vane' | 'shaft'
  const col = mix(o.col || ['#5a5254', '#4e4648', '#625a5a'][Math.floor(f.r() * 3)], '#000', o.dim || 0);
  if (state === 'vane') {
    const cut = R(f, 0.72, 1.0), Nc = Math.round(N * cut); // the tip burnt off short
    const wt = t => W * 1.15 * Math.min(1, (t + 0.05) / 0.22) * (1 - t * 0.2);
    const Pp = [], Q = [];
    for (let i = 0; i <= Nc; i++) { const t = i / N, rag = i > 3 && f.r() < 0.2 ? R(f, 0.35, 0.75) : 1, rag2 = i > 3 && f.r() < 0.25 ? R(f, 0.3, 0.7) : 1; Pp.push(add(C[i], mul(n, wt(t) * 0.35 * rag))); Q.push(add(C[i], mul(n, -wt(t) * 0.65 * rag2))); }
    const end = []; for (let k = 0; k < 4; k++) end.push([...add(lerp(Pp[Nc], Q[Nc], k / 3), mul(d, R(f, -8, 6))), k % 2]); // the ragged burnt end
    const out = [...Pp, ...end, ...Q.reverse()];
    f.part(out, { fill: col, shadow: '#0a0809', light: mix(col, '#9a9090', 0.35), shade: 0.35, tex: 'craze' + f.o.seed, texOp: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, maxShade: 4, k: 0.6 });
    // barbs: fine lines raking from the shaft to the edges
    for (let i = 2; i < Nc; i += 2) { f.line([C[i], add(add(C[i], mul(d, W * 0.25)), mul(n, -W * 0.55))], 0.7, '#0c0a0b', { op: 0.5 }); }
    f.line(Q.slice(1, -1), 0.9, P.vio, { op: 0.5 }); // the burnt edge, a thread of violet
    if (f.r() < 0.5) { const i = Math.round(Nc * R(f, 0.3, 0.7)); f.flat(ell(add(C[i], mul(n, -W * 0.3)), W * 0.14, W * 0.1, a, 8), '#060506'); } // a burn hole in the vane
  }
  // the shaft (rachis): pale under the char at the quill, thinning to the tip; a few barb stubs where the vane burnt away
  const sh = state === 'vane' ? C : C.slice(0, Math.round(N * R(f, 0.6, 0.95)) + 1);
  f.stroke(sh, Math.max(2.6, W * 0.16), '#0c0a0b');
  f.line(sh.slice(0, -2), Math.max(1, W * 0.07), mix('#8a807a', '#000', o.dim || 0), { op: 0.85 });
  if (state === 'shaft') { for (let i = 3; i < sh.length - 1; i += 2) for (const s2 of [1, -1]) if (f.r() < 0.55) f.line([sh[i], add(add(sh[i], mul(d, W * 0.12)), mul(n, s2 * W * R(f, 0.12, 0.3)))], 0.9, '#2a2426', { op: 0.85 }); f.flat(ell(sh[sh.length - 1], 2.2, 2.2, 0, 6), P.vio, { op: 0.8 }); }
  return C;
}
function burntWing(f, S, Ew, Wr, T, o = {}) {
  const tr = o.tr ?? 1, dim = o.dim || 0, [b1, b2, b3] = o.bones;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return mul([-d[1], d[0]], tr); };
  const nU = nrm(S, Ew), nF = nrm(Ew, Wr), nH = nrm(Wr, T);
  const aF = Math.atan2(nF[1], nF[0]), aH = Math.atan2(nH[1], nH[0]), aT = ang(Wr, T), aU = Math.atan2(nU[1], nU[0]);
  const span = E.len(sub(T, Wr)), Lp = o.Lp ?? span * 1.5, Ls = o.Ls ?? Lp * 0.6, Wp = o.Wp ?? Lp * 0.15, Ws = o.Ws ?? Ls * 0.24;
  const pick = (k) => { const r = f.r(); return r < (o.gone ?? 0.15) ? null : r < (o.gone ?? 0.15) + (o.bare ?? 0.4) ? 'shaft' : 'vane'; };
  const BN = { fill: mix('#57504e', '#000', dim), shadow: '#0e0a0c', light: mix('#9a908a', '#000', dim), shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.5, inkW: 1.4, inkHeavy: 2 };
  // primaries from the hand: fanning from the trailing side round to the line of the hand
  f.bone(b3);
  const np = o.np ?? 9;
  for (let i = np - 1; i >= 0; i--) { const t = i / (np - 1), st = pick(i); if (!st) continue; const r0 = lerp(Wr, T, 0.04 + t * 0.92), a = aT + (aH - aT) * (1 - t) * 0.5 + R(f, -0.05, 0.05); burntFeather(f, r0, a, Lp * (0.8 + t * 0.25) * R(f, 0.9, 1.05), Wp, { state: st, dim, bend: tr * -0.04 }); }
  // secondaries from the forearm, raking back toward the body
  f.bone(b2);
  const ns = o.ns ?? 10;
  for (let i = ns - 1; i >= 0; i--) { const t = i / (ns - 1), st = pick(i); if (!st) continue; const r0 = lerp(Ew, Wr, 0.04 + t * 0.94), a = aF - 0.3 * tr * (1 - t * 0.3) + R(f, -0.06, 0.06); burntFeather(f, r0, a, Ls * R(f, 0.85, 1.05), Ws, { state: st, dim, bend: tr * 0.05 }); }
  // tertials at the elbow, lying back toward the body
  f.bone(b1);
  for (let i = 0; i < 3; i++) { const r0 = lerp(lerp(S, Ew, 0.6), Ew, i / 2); burntFeather(f, r0, aU - 0.45 * tr, Ls * (0.75 - i * 0.1), Ws * 1.1, { state: i === 1 ? 'shaft' : 'vane', dim }); }
  // coverts where feathers remain: a row of greater coverts over the secondaries' bases, then the median row, each a
  // rounded charred feather lapping over the next and casting onto it; some burnt to stubs
  f.bone(b2);
  const cov = (len, w, rows, off) => {
    for (let r = 0; r < rows; r++) {
      const nn = Math.round(E.len(sub(Wr, Ew)) / (w * 0.85));
      for (let i = nn - 1; i >= 0; i--) {
        const t = (i + 0.5) / nn; if (t > (o.covTo ?? 0.8)) continue; if (f.r() < 0.18) continue;
        const r0 = add(lerp(Ew, Wr, t), mul(nF, off + r * len * 0.4)), a = aF - 0.3 * tr + R(f, -0.08, 0.08), d = [Math.cos(a), Math.sin(a)], nn2 = [-d[1], d[0]];
        const L2 = len * R(f, 0.8, 1.05) * (1 - r * 0.25), W2 = w * (1 - r * 0.15);
        const pts = [add(r0, mul(nn2, W2 * 0.4)), add(add(r0, mul(d, L2 * 0.7)), mul(nn2, W2 * 0.5)), add(r0, mul(d, L2)), add(add(r0, mul(d, L2 * 0.7)), mul(nn2, -W2 * 0.5)), add(r0, mul(nn2, -W2 * 0.4))];
        f.flat(pts.map(q => add(q, mul(d, 4))), '#000', { op: 0.35 }); // cast onto the row below
        f.part(pts, { fill: mix(r ? '#686062' : '#5a5254', '#000', dim), shadow: '#0a0809', light: mix('#8a8284', '#000', dim), shade: 0.35, tex: 'craze' + f.o.seed, texOp: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, maxShade: 3 });
        f.line([pts[1], pts[2], pts[3]], 0.9, P.vio, { op: 0.4 });
        f.line([r0, add(r0, mul(d, L2 * 0.8))], 0.8, mix('#8a807a', '#000', dim), { op: 0.5 });
      }
    }
  };
  cov(Ls * 0.42, Ws * 1.0, 1, Ws * 0.1); cov(Ls * 0.26, Ws * 0.8, 1, -Ws * 0.15);
  // black flame along the leading edge, behind the bones so it leaves them as one body: it follows the edge's outward
  // normal and turns upward as it rises
  f.bone(b2);
  flames(f, [lerp(S, Ew, 0.5), Ew, lerp(Ew, Wr, 0.5), Wr], o.nFl ?? 4, 60, 150 * (1 - dim * 0.3), 36, { side: -tr, rise: 0.7, edgeW: 2.2, band: true });
  f.bone(b3);
  flames(f, [Wr, lerp(Wr, T, 0.55)], 2, 50, 110 * (1 - dim * 0.3), 30, { side: -tr, rise: 0.7, edgeW: 2.2, band: true });
  // the bones: the upper arm still in charred skin; the forearm burnt to its two bones; the hand bones to the tip
  f.bone(b1);
  f.part(limb(S, Ew, o.wS ?? 46, 30, { steps: 8, p: [[0.25, 0.25, 0.15]], q: [[0.7, 0.15, 0.15]] }), Object.assign({}, BN, { fill: mix('#4a4244', '#000', dim) }));
  X_seamLine(f, [lp(S, Ew, 0.2, 4), lp(S, Ew, 0.5, -3), lp(S, Ew, 0.8, 3)]);
  f.bone(b2);
  for (const off of [-5, 6]) f.part(limb(lp(Ew, Wr, 0, off), lp(Wr, Ew, 0, -off * 0.6), off < 0 ? 13 : 10, off < 0 ? 10 : 8, { steps: 8 }), Object.assign({}, BN, { fill: mix(P.boneD, '#2a2426', 0.2 + dim * 0.3), light: P.bone }));
  f.part(ell(Ew, 17, 14, ang(S, Ew), 12), BN);
  f.bone(b3);
  f.part(limb(Wr, T, 18, 6, { steps: 8, p: [[0.25, 0.25, 0.12]] }), Object.assign({}, BN, { fill: mix(P.boneD, '#2a2426', 0.25 + dim * 0.3), light: P.bone }));
  f.part(ell(Wr, 15, 12, ang(Ew, Wr), 12), BN); // the wrist, where the wing breaks
  f.part([add(Wr, mul(nF, -6)), add(add(Wr, mul(nF, -20)), mul(E.norm(sub(Wr, Ew)), 6)), add(Wr, mul(E.norm(sub(T, Wr)), 12))], Object.assign({}, BN, { inkW: 1, inkHeavy: 1.2 })); // the alula's stub
  ash(f, lerp(Wr, T, 0.5), 6, 60, -90, 1);
  return { nF, nH };
}
function X_seamLine(f, pts) { seam(f, pts, 1.6); }

// ---------------------------------------------------------------- void: clean round holes
// a void spot on a surface that is not cut through: a clean pale rim, a black core, a faint violet heart
function voidDisk(f, c, rx, ry = rx, a = 0, o = {}) {
  f.part(ell(c, rx + 2, ry + 2, a, 26), { fill: o.rim || P.ashW, shade: 0.12, inkW: 1.1, inkHeavy: 1.1, cast: false, hatch: false, gritOp: 0.15 });
  f.flat(ell(c, rx, ry, a, 26), '#040306');
  f.flat(ell(add(c, [rx * 0.12, ry * 0.12]), rx * 0.42, ry * 0.36, a, 14), P.vioS, { op: 0.9 });
}
// draw() with clean round holes cut right through it (see-through), then clean rims. holes: [[centre, r], ...].
// o.shape: clip the rims to this outline (pts or d) so a bite on an edge only rims the cloth that is left.
function cutHoles(f, holes, draw, o = {}) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('vh');
  const circ = ([c, r]) => `M${(c[0] + r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] - r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] + r).toFixed(1)},${c[1].toFixed(1)}Z`;
  f.defs.push(`<clipPath id="${id}"><path clip-rule="evenodd" d="M-4000,-4000H8000V8000H-4000Z ${holes.map(circ).join(' ')}"/></clipPath>`);
  f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  if (o.rims === false) return res;
  const rims = () => { for (const [c, r] of holes) { const e = ell(c, r + 0.4, r + 0.4, 0, 32), e2 = ell(c, r + 2.4, r + 2.4, 0, 32); f.line(e2.concat([e2[0]]), 1.2, P.vio, { op: 0.55 }); f.line(e.concat([e[0]]), o.rimW ?? 1.5, o.rim || P.ashW, { op: 0.9 }); } };
  if (o.shape) clipDraw(f, typeof o.shape === 'string' ? o.shape : E.smooth(o.shape), rims); else rims();
  return res;
}
// an eye in the void: used only where it has a purpose (the Seraph went in to look)
function voidEye(f, c, s, a = 0) {
  f.flat(ell(c, s, s * 0.42, a, 18), '#8e8698', { op: 0.85 });
  f.flat(ell(add(c, rot([s * 0.1, 0], a)), s * 0.36, s * 0.36, a, 14), P.vioD);
  f.flat(ell(add(c, rot([s * 0.12, 0], a)), s * 0.17, s * 0.17, a, 10), '#020104');
  f.flat(ell(add(c, rot([s * 0.02, -s * 0.06], a)), s * 0.07, s * 0.06, a, 6), '#d8d0e0', { op: 0.7 });
  f.line(ell(c, s, s * 0.44, a, 18).slice(9, 18), 1.6, INK); f.line(ell(c, s * 1.05, s * 0.6, a, 18).slice(10, 17), 1, '#5a5262', { op: 0.6 });
}
// ---------------------------------------------------------------- holy gold (the Saint's halo only)
function halo(f, c, r, o = {}) {
  const G = { fill: P.gold, shadow: P.goldS, light: P.goldL, shade: 0.3, inkW: 1.8, inkHeavy: 2.6, cast: false, hatch: false, gritOp: 0.25 };
  f.part(ell(c, r, r * (o.sq ?? 0.96), o.a || 0, 48), G);
  f.part(ell(c, r * 0.84, r * 0.84 * (o.sq ?? 0.96), o.a || 0, 44), Object.assign({}, G, { fill: mix(P.gold, P.goldD, 0.35), inkW: 1.2, inkHeavy: 1.2 }));
  // tooled rays and punched dots, worn bright on the upper left
  for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2, q0 = add(c, [Math.cos(t) * r * 0.3, Math.sin(t) * r * 0.3]), q1 = add(c, [Math.cos(t) * r * 0.8, Math.sin(t) * r * 0.8]); f.line([q0, q1], i % 2 ? 1 : 1.8, P.goldD, { op: 0.6, straight: true }); }
  for (let i = 0; i < 56; i++) { const t = i / 56 * Math.PI * 2; f.flat(ell(add(c, [Math.cos(t) * r * 0.92, Math.sin(t) * r * 0.92 * (o.sq ?? 0.96)]), 2.2, 2.2, 0, 6), P.goldS, { op: 0.8 }); }
  f.line(ell(c, r * 0.98, r * 0.98, 0, 48).slice(26, 40), 3, P.goldL, { op: 0.8 });
  return c;
}

// ---------------------------------------------------------------- ground
function ashHeap(f, c, w, h, o = {}) {
  const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12, x = c[0] - w / 2 + w * t; pts.push([x, c[1] - h * Math.pow(Math.sin(Math.PI * t), 0.8) * R(f, 0.75, 1.1)]); }
  pts.push([c[0] + w / 2, c[1] + 2, 1], [c[0] - w / 2, c[1] + 2, 1]);
  f.part(pts, { fill: o.col || P.ashD, shadow: P.ashS, light: P.ashL, shade: 0.35, tex: 'ashtex' + f.o.seed, texOp: 0.8, inkW: 1.1, inkHeavy: 1.6, cast: false, grime: false });
  ashCake(f, [c[0] - w * 0.1, c[1] - h * 0.55], w * 0.3, h * 0.25, o.n || 5, 0.8);
  return pts;
}
function ashprint(f, c, s = 1) {
  f.flat(ell(c, 12 * s, 3.5 * s, 0, 10), P.ashL, { op: 0.45 });
  for (let i = 0; i < 3; i++) f.flat(ell(add(c, [6 * s + i * 5 * s, -2 * s + (i - 1) * 1.2 * s]), 2.6 * s, 1.6 * s, 0, 6), P.ashL, { op: 0.5 });
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

// hair rising as smoke: n thin dark strands lifting off the scalp along roots, curling and thinning, their tips breaking
// into soft smoke with a few thin pale curls (the Saint's hair, named by the bible)
function smokeHair(f, roots, len, o = {}) {
  for (const [r0, sw] of roots) {
    const l = len * R(f, 0.7, 1.15), ph = f.r() * 6;
    const C = []; for (let i = 0; i <= 8; i++) { const t = i / 8; C.push(add(r0, [sw * t + Math.sin(t * 5 + ph) * 14 * t, -l * t])); }
    smoke(f, C[5], l * 0.9, R(f, 24, 46), { sway: 20, phase: ph, op: o.op ?? 0.32, big: true, col: o.col || '#4a444c', line: P.ashL, lineOp: 0.4 });
    hairClump(f, spline(C, 6), o.w ?? R(f, 7, 13), { pal: [P.charD, '#2a2228', P.charL], gap: false, n: 3 });
  }
}
// wrap everything drawn since i0 in a transform (scale k about `from`, then move it to `to`); joints named in `bones`
// move the same way. Used to set a whole figure at its true size without retyping its coordinates.
function placeFigure(f, i0, k, from, to, bones = []) {
  const tx = to[0] - from[0] * k, ty = to[1] - from[1] * k, m = `matrix(${k},0,0,${k},${tx.toFixed(2)},${ty.toFixed(2)})`;
  for (let i = i0; i < f.out.length; i++) f.out[i] = `<g transform="${m}">${f.out[i]}</g>`;
  for (const b of bones) if (f.joints[b]) { const p = f.joints[b].pivot; f.joints[b].pivot = [+(p[0] * k + tx).toFixed(1), +(p[1] * k + ty).toFixed(1)]; }
}

// a body of grey cinders held together by black flame (independent review rebuild: the first version tiled a jittered
// grid of plates, which read as cobblestones). Now the shape is one shaded cinder mass that cracks along its form: a few
// long wavy splits run along the part's main axis (o.lines can name them: the spine, the ribs, the shoulder blade), and
// cross-cracks break across it at irregular spacing, bending and stopping at a split, so the plates are uneven slabs that
// follow the muscle under them. Each crack is a seam: black flame at its core, violet on its lips (no glow); the plate
// edge facing the light is worn pale; some plates lift as flakes; ash cakes the hollows. cell: plate size.
function cinders(f, shape, cell, look, o = {}) {
  const d = E.smooth(shape), bb = E.bbox(shape);
  f.part(shape, Object.assign({}, look, { maxShade: o.maxShade ?? Math.max(10, Math.min(bb[2] - bb[0], bb[3] - bb[1]) * 0.35) }));
  // the part's main axis (principal direction of its outline)
  const m = mul(shape.reduce((a, b) => add(a, b), [0, 0]), 1 / shape.length);
  let cxx = 0, cyy = 0, cxy = 0; for (const p of shape) { const q = sub(p, m); cxx += q[0] * q[0]; cyy += q[1] * q[1]; cxy += q[0] * q[1]; }
  const th = o.axis ?? 0.5 * Math.atan2(2 * cxy, cxx - cyy), ax = [Math.cos(th), Math.sin(th)], nx = [-ax[1], ax[0]];
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9; for (const p of shape) { const q = sub(p, m), u = q[0] * ax[0] + q[1] * ax[1], v = q[0] * nx[0] + q[1] * nx[1]; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  const P2 = (u, v) => add(m, add(mul(ax, u), mul(nx, v)));
  const lit = mul(f.L, -1);
  clipDraw(f, d, () => {
    if (o.tones) softTone(f, d, o.tones);
    // cinder, not hide: blotches of paler ash and darker clinker so each plate has its own tone
    stains(f, d, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.ashL, 0.018, 3.0, -1.5, Math.round(bb[0] + bb[1]) % 97, 0.45);
    stains(f, d, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.cinderD, 0.022, 3.0, -1.4, Math.round(bb[0] * 3 + bb[1]) % 89, 0.5);
    if (o.before) o.before();
    const wv = o.w ?? Math.max(1.4, Math.min(2.6, cell * 0.07));
    const splits = o.lines || [];
    if (!o.lines) { const ns = (v1 - v0) > cell * 1.6 ? 2 : 1; for (let k = 0; k < ns; k++) { const v = v0 + (v1 - v0) * (ns === 1 ? R(f, 0.35, 0.6) : (k ? R(f, 0.6, 0.75) : R(f, 0.25, 0.4))), pts = []; for (let u = u0 - 10; u <= u1 + 10; u += cell * 0.5) pts.push(P2(u, v + R(f, -0.12, 0.12) * cell)); splits.push(pts); } }
    for (const [li, L] of splits.entries()) { const lw = o.lineW ? o.lineW(li) : wv; seam(f, L, lw); f.line(L.map(q => add(q, mul(lit, lw * 1.6))), Math.max(0.8, lw * 0.5), look.light || P.ashL, { op: 0.45 }); }
    // cross-cracks: irregular spacing, slanted, bent; some run the full width, some stop at a split
    let u = u0 + cell * R(f, 0.4, 0.9);
    while (u < u1) {
      const full = f.r() < (o.full ?? 0.4), va = full ? v0 - 6 : (f.r() < 0.5 ? v0 - 6 : (v0 + v1) / 2), vb = full ? v1 + 6 : (va < v0 ? (v0 + v1) / 2 : v1 + 6), sl = R(f, -0.8, 0.8) * cell;
      const pts = [], bw = R(f, -0.25, 0.25) * cell; for (let k = 0; k <= 4; k++) { const t = k / 4; pts.push(P2(u + sl * (t - 0.5) + bw * Math.sin(t * Math.PI) + R(f, -0.1, 0.1) * cell, va + (vb - va) * t)); }
      seam(f, pts, wv * R(f, 0.6, 0.9));
      f.line(pts.map(q => add(q, mul(lit, wv * 1.4))), Math.max(0.7, wv * 0.4), look.light || P.ashL, { op: 0.4 });
      if (f.r() < 0.4) { const q = pts[Math.floor(R(f, 1, 4))]; seam(f, [q, add(q, rot(mul(ax, cell * R(f, 0.3, 0.6)), R(f, -0.6, 0.6)))], wv * 0.5); } // a short spur
      u += cell * R(f, 0.5, 1.6);
    }
    // plates lifting at their edges, ash in the hollows, a few dark pits
    flakes(f, m, (u1 - u0) * 0.4, (v1 - v0) * 0.4, Math.round((u1 - u0) * (v1 - v0) / (cell * cell * 3)) + 1, Math.max(0.6, cell / 40));
    ashCake(f, m, (u1 - u0) * 0.4, (v1 - v0) * 0.4, Math.round((u1 - u0) * (v1 - v0) / (cell * cell * 2)) + 1, Math.max(0.6, cell / 40), 0.3);
    if (o.after) o.after();
  });
  return d;
}

module.exports = {
  P, base, rnd, R, scatter, ang, elb, pd, SK, CH, ASH, textures, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, mlimb, humanJoints, rope,
  softTone, stains, crease, creaseField, offsetLine, hairClump, fullLeg, prune, openHand, tableHand, link, ironChain, greyFace, wraps, split, side,
  seam, crackNet, hairline, flakes, ash, soot, ashCake, charEdge, charHem, burnHole, blackFlame, flames, smoke, tongue, fireMass, burntWing, burntFeather, voidDisk, cutHoles, voidEye, flameSheet, halo, ashHeap, ashprint, muscleArm, smokeHair, placeFigure, cinders,
};
