// World XV, The Torn Sky (Lightning + Void, Discharge): local helpers. Shared files stay frozen; everything new lives here.
// A heaven torn open by a war of gods; the cast was never human (angels and heaven's creatures), so anatomy is idealised
// human or animal anatomy broken by the courses.
// Copied from reviewed kits so this world does not depend on their files: spline/arcLen/ik/clipDraw/ribbon/jointLimb/
// jcut/creases/fistDetail/tube/mlimb/humanJoints/rope/softTone/stains/crease/creaseField/offsetLine/hairClump/fullLeg/
// prune/openHand/tableHand/link/ironChain/greyFace/wraps, seam/crackNet/hairline/flakes/ash/soot/ashCake/charEdge/
// charHem/burnHole, voidDisk/cutHoles/voidEye, muscleArm/smokeHair/placeFigure (all from kit_XIII, which took them from
// kit_IX, kit_I_a, kit_II, kit_VII, kit_VIII and kit_keepers); feather/plumeMass/featherHem/wing (kit_VI, the reviewed
// wing: slotted primaries, layered coverts, the hand breaking back at the wrist); split/side (dirAC).
//
// Lightning (dominant) strikes and scars: violet branching Lichtenberg burns, fused metal and joints, standing hair and
// feathers. Never glowing outlines, never arcs or bolts in the air: strikes are engine effects (GUIDE 8 ruling).
// Void (second) unmakes: holes and cracks with clean rims opening onto black, edges that thin into nothing, eyes (this is
// a void world: eyes are expected). Never purple sparkles or galaxies.
// Palette: gold leaf cracked over black, violet lightning; plus ink black, bone and grey. Gold is allowed everywhere here
// (the bible: "Gold leaf is allowed here, cracked over black"). Red only for blood, doom and rubric.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  // gold leaf over black: the leaf, its burnish, its shadow, and the black ground showing where the leaf is lost
  gold: '#a8822e', goldL: '#e2c272', goldM: '#8a6a26', goldD: '#5e4214', goldS: '#1e1408', goldW: '#fff0c0',
  black: '#141016', blackL: '#2e2832', blackD: '#08060a',
  void: '#040306', voidL: '#120e1a',
  vio: '#8a58c6', vioL: '#c8a6f0', vioW: '#efe4ff', vioD: '#4c2c72', vioS: '#24163a', scorch: '#1c1224',
  bone: '#d8d0bc', boneD: '#9e9480', boneS: '#5a5246',
  grey: '#7a7680', greyL: '#a8a4ac', greyD: '#4a4650', greyS: '#24222a',
  // feathers: bone-white and ash-grey down, black flight feathers
  plume: '#cfc8ba', plumeD: '#8e877c', plumeS: '#3e3a40',
  // copied helpers' colour names, mapped onto this world
  ash: '#8c8884', ashL: '#c8c2b8', ashD: '#5e5a58', ashS: '#2c282a', ashW: '#e4dccc',
  char: '#2e2826', charL: '#4e4442', charD: '#181314', charS: '#0b0809',
  flame: '#040306', flameM: '#1e1628',
  iron: '#3c3a3e', ironD: '#222024', ironL: '#68646c', rust: '#4a3a2a',
  sack: '#6e6a60', skin: '#c09238', skinS: '#2e1e0c',
  mud: '#2a2630',
};

// the world's render setup: kit.foeBase, a violet-black shadow; no mud in heaven, only scorch and gold dust at the feet
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - 46, shadowTint: '#221a2a', mud: P.mud }, o));
const rnd = (f, a, b) => a + (b - a) * f.r();
const R = rnd;
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
const pd = pts => E.smooth(pts, false);
const dir = a => [Math.cos(a), Math.sin(a)];

// looks
const GL = (f, o = {}) => Object.assign({ fill: P.gold, shadow: P.goldS, light: P.goldL, shade: 0.42, tex: 'craq' + f.o.seed, texOp: 0.75 }, o); // gold leaf
const BK = (f, o = {}) => Object.assign({ fill: P.black, shadow: P.blackD, light: P.blackL, shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.35 }, o); // the black ground
const BN = (f, o = {}) => Object.assign({ fill: P.bone, shadow: P.boneS, light: '#f0ead8', shade: 0.36, tex: 'mottle' + f.o.seed, texOp: 0.4 }, o); // bone
const GR = (f, o = {}) => Object.assign({ fill: P.grey, shadow: P.greyS, light: P.greyL, shade: 0.4, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o); // grey
const FE = (f, o = {}) => Object.assign({ fill: P.plume, shadow: P.plumeS, light: '#ece6da', shade: 0.42, tex: 'barb' + f.o.seed, texOp: 0.45, inkW: 1, inkHeavy: 1.4 }, o); // feathers
const HS = (f, o = {}) => GL(f, o);
const SK = GL;

// texture patterns and filters for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 11 + 7);
  let c = '';
  for (let i = 0; i < 18; i++) { let x = r() * 48, y = r() * 48, a = r() * 6.3; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 3; k++) { a += (r() - 0.5) * 1.6; x += Math.cos(a) * (3 + r() * 5); y += Math.sin(a) * (3 + r() * 5); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } c += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="craze${s}" patternUnits="userSpaceOnUse" width="48" height="48">${c}</pattern>`);
  // craquelure: gold leaf crazed into a net of small irregular cells (each point joined to its nearest neighbours by a
  // bent hairline crack; the cracks show the black under the leaf)
  let q = '';
  const W = 120, cells = [];
  for (let i = 0; i < 34; i++) cells.push([r() * W, r() * W]);
  const pts = []; for (const p of cells) for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) pts.push([p[0] + dx, p[1] + dy]);
  for (const a of cells) {
    const near = pts.map(b => [Math.hypot(a[0] - b[0], a[1] - b[1]), b]).filter(x => x[0] > 1).sort((x, y) => x[0] - y[0]).slice(0, 3);
    for (const [d, b] of near) { const m = [(a[0] + b[0]) / 2 + (r() - 0.5) * d * 0.25, (a[1] + b[1]) / 2 + (r() - 0.5) * d * 0.25]; q += `<path d="M${a[0].toFixed(1)},${a[1].toFixed(1)} L${m[0].toFixed(1)},${m[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}" fill="none" stroke="${P.blackD}" stroke-width="${(0.7 + r() * 0.6).toFixed(2)}" opacity="0.75"/>`; }
  }
  f.defs.push(`<pattern id="craq${s}" patternUnits="userSpaceOnUse" width="${W}" height="${W}">${q}</pattern>`);
  f.defs.push(`<pattern id="barb${s}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="0.7" opacity="0.5"/></pattern>`);
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  let a2 = '';
  for (let i = 0; i < 40; i++) { const x = r() * 40, y = r() * 40, rr = 0.5 + r() * 1.3; a2 += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > 0.35 ? P.ashW : '#1a1618'}" opacity="${(0.35 + r() * 0.45).toFixed(2)}"/>`; }
  f.defs.push(`<pattern id="ashtex${s}" patternUnits="userSpaceOnUse" width="40" height="40">${a2}</pattern>`);
  // chisel: stone tooling, short parallel claw-chisel strokes in patches
  let ch = '';
  for (let i = 0; i < 14; i++) { const x = r() * 60, y = r() * 60, a = -0.6 + (r() - 0.5) * 0.6; for (let k = 0; k < 4; k++) { const ox = x + k * 2.6 * Math.sin(a), oy = y - k * 2.6 * Math.cos(a) * -1; ch += `<path d="M${ox.toFixed(1)},${oy.toFixed(1)} l${(Math.cos(a) * 7).toFixed(1)},${(Math.sin(a) * 7).toFixed(1)}" stroke="${INK}" stroke-width="0.7" opacity="0.4"/>`; } }
  f.defs.push(`<pattern id="chisel${s}" patternUnits="userSpaceOnUse" width="60" height="60">${ch}</pattern>`);
  f.defs.push(`<filter id="smk${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`);
  f.defs.push(`<filter id="smkL${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>`);
}

// ================================================================ copied from kit_XIII (unchanged)
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
  f.defs.push(`<filter id="${id}" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" x="${bb[0]}" y="${bb[1]}" width="${bb[2] - bb[0]}" height="${bb[3] - bb[1]}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${f.o.seed + seedOff}"/><feColorMatrix values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${bl}  ${a} 0 0 0 ${b}"/></filter>`);
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

// ================================================================ copied from kit_VI (unchanged): the reviewed wing
// ---- feathers and wings ----
// One feather from root heading a: length L, width W, the vane split by the rachis (lead = share on the +n side).
// o.bend curls the tip toward +n; o.notch tears the trailing vane; o.lift (static) splays a few barbs off the edge.
function feather(f, root, a, L, W, look, o = {}) {
  const d = dir(a), n = [-d[1], d[0]], lead = o.lead ?? 0.35, bend = o.bend ?? 0, N = 16;
  const C = []; for (let i = 0; i <= N; i++) { const t = i / N; C.push(add(add(root, mul(d, L * t)), mul(n, bend * L * t * t))); }
  // a flight feather keeps its width along the vane: narrow only at the quill, rounded at the tip
  const tipR = o.round ? 0.22 : 0.32;
  const wt = t => W * Math.pow(Math.min(1, (t + 0.03) / 0.22), 0.7) * (t > 1 - tipR ? Math.sqrt(Math.max(0, 1 - ((t - 1 + tipR) / tipR) ** 2)) : 1) * (o.taper === false ? 1 : 1 - t * 0.3) + 0.5;
  // emargination (independent review): the outer primaries' vanes step in past mid-length, so the wing tip splays into
  // slotted fingers instead of a row of planks
  const sst = (a, b, t) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); }, em = o.emarg || 0;
  const eL = t => 1 - em * 0.6 * sst(0.4, 0.56, t), eT = t => 1 - em * 0.32 * sst(0.5, 0.66, t);
  const Pp = [], Q = [];
  C.forEach((p, i) => { const t = i / N, a1 = C[Math.max(0, i - 1)], b1 = C[Math.min(N, i + 1)], dd = E.norm(sub(b1, a1)), nn = [-dd[1], dd[0]], w = wt(t); Pp.push(add(p, mul(nn, w * lead * eL(t)))); Q.push(add(p, mul(nn, -w * (1 - lead) * eT(t)))); });
  // notches in the trailing vane: a V cut back toward the rachis
  for (const t of (o.notch || [])) { const i = Math.max(2, Math.min(N - 2, Math.round(t * N))); Q[i] = lerp(Q[i], C[i], 0.55); }
  const tip = add(C[N], mul(E.norm(sub(C[N], C[N - 1])), W * 0.04));
  const out = [...Pp, o.round ? tip : [...tip, 1], ...Q.reverse()];
  f.part(out, Object.assign({ k: 0.9, inkW: 1.1, inkHeavy: 1.8, maxShade: Math.max(2.5, W * 0.12), hi: 0.02 }, look, { cast: !!o.cast, castOp: 0.5 }));
  // rachis and a few barb splits
  f.line(C.slice(0, N - 1), Math.max(0.8, W * 0.04), mix(look.fill, '#fff', 0.3), { op: 0.45 });
  if (o.splits !== false) for (let k = 0; k < 2; k++) { const i = 5 + Math.floor(f.r() * 8), p = C[i], qq = Q[Q.length - 1 - i] || Q[0]; f.line([p, lerp(p, qq, 1.02)], 0.8, INK, { op: 0.6 }); }
  if (o.dark) clipDraw(f, out, () => f.flat([...Pp.slice(Math.round(N * (1 - o.dark))).map(q => add(q, mul(n, W))), add(tip, mul(d, W)), ...Q.slice(0, Math.round(N * o.dark) + 1).map(q => add(q, mul(n, -W)))], o.darkCol || '#1a1e24', { op: o.darkOp ?? 0.3 }));
  if (o.lift) for (let k = 0; k < o.lift; k++) { const i = 3 + Math.floor(f.r() * (N - 5)), p = (f.r() > 0.5 ? Pp : [...Q].reverse())[i], aa = a + (f.r() - 0.5) * 1.6; f.line([p, add(p, rot([W * R(f, 0.3, 0.6), 0], aa))], 1, look.fill, { op: 0.9 }); f.line([p, add(p, rot([W * R(f, 0.3, 0.6), 0], aa))], 0.5, INK, { op: 0.5 }); }
  return { C, out, tip };
}

// a feathered mass: one shape for a region of plumage, its edge torn into rounded feather tips along `hem` (a polyline
// on the region's lower edge), with scalloped rows of feather ends inside pointing along `a`. Reads as plumage, not as
// tiles. pts: the region outline; a: the direction the feathers lie (root to tip); sz: feather-end size.
function plumeMass(f, pts, a, sz, look, o = {}) {
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const bb = E.bbox(pts), d = dir(a), n = [-d[1], d[0]], lt = mix(look.fill, '#fff', 0.3), dk = mix(look.shadow || look.fill, '#000', 0.25);
  clipDraw(f, pts, () => {
    const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, span = Math.max(bb[2] - bb[0], bb[3] - bb[1]) * 0.75;
    let row = 0;
    for (let v = -span; v < span; v += sz * 0.62, row++) for (let u = -span; u < span; u += sz * 0.9) {
      const q = add(add([cx, cy], mul(d, v + (f.r() - 0.5) * sz * 0.2)), mul(n, u + (row % 2) * sz * 0.45 + (f.r() - 0.5) * sz * 0.2)), w = sz * R(f, 0.38, 0.55), l = sz * R(f, 0.3, 0.45);
      const arc = [add(q, mul(n, -w)), add(add(q, mul(n, -w * 0.7)), mul(d, l * 0.8)), add(q, mul(d, l)), add(add(q, mul(n, w * 0.7)), mul(d, l * 0.8)), add(q, mul(n, w))];
      if (f.r() < (o.dark ?? 0.25)) f.flat([...arc, add(q, mul(d, -l * 0.6))], dk, { op: 0.35 });
      f.line(arc, o.w ?? 1.2, INK, { op: o.op ?? 0.55 });
      f.line(arc.slice(1, 4).map(p => add(p, mul(d, -2))), 0.9, lt, { op: 0.35 });
      if (f.r() < (o.shaft ?? 0.25)) f.line([add(q, mul(d, -l * 0.6)), add(q, mul(d, l * 0.9))], 0.8, lt, { op: 0.4 });
    }
  });
}
// a hem of rounded feather tips from a to b along a polyline (returns points for an outline): bulges of size sz out
// along `a` (the direction the feathers point)
function featherHem(line, a, sz, f, jit = 0.4) {
  const d = dir(a), out = [];
  for (let i = 0; i < line.length - 1; i++) {
    const p0 = line[i], p1 = line[i + 1], L = E.len(sub(p1, p0)), k = Math.max(1, Math.round(L / sz));
    for (let j = 0; j < k; j++) { const t0 = j / k, t1 = (j + 1) / k, m = lerp(p0, p1, (t0 + t1) / 2), ext = sz * (0.55 + (f.r() - 0.5) * jit); out.push([...lerp(p0, p1, t0), 1], add(add(lerp(p0, p1, t0 + (t1 - t0) * 0.25), mul(d, ext * 0.75)), [0, 0]), add(m, mul(d, ext)), add(lerp(p0, p1, t0 + (t1 - t0) * 0.75), mul(d, ext * 0.75))); }
  }
  out.push([...line[line.length - 1], 1]);
  return out;
}

// A wing whose leading edge runs shoulder S -> elbow Ew -> wrist Wr -> tip T. The trailing side is `tr` (+1: the side to the
// left of the leading edge's direction, i.e. +normal). Feathers: primaries fan from the hand, secondaries along the forearm,
// tertials at the elbow, then greater, median and marginal coverts layered over their bases. Bones: b1 (upper arm), b2
// (forearm), b3 (hand): each feather is drawn on the bone it grows from. o.look: the feather look; o.skin: arm look.
function wing(f, S, Ew, Wr, T, o = {}) {
  const tr = o.tr ?? 1, look = o.look || FE(f), [b1, b2, b3] = o.bones;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return mul([-d[1], d[0]], tr); };
  const nF = nrm(Ew, Wr), nH = nrm(Wr, T), nU = nrm(S, Ew);
  const aF = Math.atan2(nF[1], nF[0]), aH = Math.atan2(nH[1], nH[0]), aT = ang(Wr, T);
  const Lp = o.Lp ?? E.len(sub(T, Wr)) * 1.6, Ls = o.Ls ?? Lp * 0.62, Wp = o.Wp ?? Lp * 0.13, Ws = o.Ws ?? Ls * 0.22;
  const sk = o.skin || HS(f);
  const tone = i => mix(look.fill, i % 3 === 0 ? '#2a3038' : '#8a949c', 0.12 + (i % 3) * 0.04);
  // primaries: from the wrist to the tip, fanning from the trailing direction toward the line of the hand
  f.bone(b3);
  const np = o.np ?? 9;
  for (let i = 0; i < np; i++) {
    const t = i / (np - 1), r0 = lerp(Wr, T, 0.05 + t * 0.95), a = aT + (aH - aT) * (1 - t) * (o.spreadP ?? 0.38) + (f.r() - 0.5) * 0.08, L = Lp * (0.78 + t * 0.3) * (o.pLen ? o.pLen(t) : 1) * R(f, 0.92, 1.06);
    feather(f, r0, a, L, Wp * (1 - t * 0.15), Object.assign({}, look, { fill: mix(tone(i), f.r() > 0.5 ? '#fff' : '#000', f.r() * 0.08) }), { lead: 0.3, bend: tr * -0.03, round: true, notch: (o.notchP || []).includes(i) ? [0.62, 0.8] : [], dark: o.darkTips ?? 0, lift: o.lift && i % 3 === 1 ? 1 : 0, emarg: t > 0.4 ? 0.55 + t * 0.4 : 0 });
  }
  // secondaries along the forearm, pointing to the trailing side, raking back toward the body
  f.bone(b2);
  const ns = o.ns ?? 12;
  for (let i = ns - 1; i >= 0; i--) {
    const t = i / (ns - 1), r0 = lerp(Ew, Wr, 0.04 + t * 0.94), a = aF + (o.rake ?? -0.35) * tr * (1 - t * 0.3) + (f.r() - 0.5) * 0.1, L = Ls * (o.sLen ? o.sLen(t) : (0.92 + 0.12 * Math.sin(t * 3))) * R(f, 0.9, 1.08);
    feather(f, r0, a, L, Ws, Object.assign({}, look, { fill: tone(i + 1) }), { lead: 0.4, bend: tr * 0.05, round: true, notch: (o.notchS || []).includes(i) ? [0.7] : [], dark: 0, lift: o.lift && i % 3 === 0 ? 1 : 0 });
  }
  // tertials at the elbow, longer and soft, lying back toward the body
  f.bone(b1);
  for (let i = 0; i < (o.nt ?? 4); i++) { const t = i / 3, r0 = lerp(lerp(S, Ew, 0.55), Ew, t), a = aU(nU) + (o.rake ?? -0.35) * tr * 1.6; feather(f, r0, a, Ls * (0.8 - t * 0.15), Ws * 1.1, Object.assign({}, look, { fill: tone(i + 2) }), { lead: 0.45, round: true, dark: 0.2 }); }
  function aU(n2) { return Math.atan2(n2[1], n2[0]); }
  // the arm itself: a lean muscled limb inside the leading edge, skin over bone
  const arm = (a, b, wa, wb, bn, ext) => { f.bone(bn); f.part(K.chain([a, b], [wa, wb], { steps: 8, bp: [[0, 0.3, 0.18, 0.2]], bq: [[0, 0.6, 0.12, 0.2]] }), Object.assign({ k: 0.9 }, sk)); f.line([lp(a, b, 0.15, -wa * 0.2), lp(a, b, 0.85, -wb * 0.2)], 1.1, INK, { op: 0.4 }); f.line([lp(a, b, 0.1, wa * 0.3), lp(a, b, 0.5, wa * 0.36), lp(a, b, 0.9, wb * 0.3)], 1.3, mix(sk.fill, '#fff', 0.35), { op: 0.5 }); if (ext) ext(); };
  const wS = o.wS ?? Ws * 1.9, wE = o.wE ?? Ws * 1.2, wW = o.wW ?? Ws * 0.9;
  // coverts: greater (long), median, then lesser/marginal small scale-like rows close to the leading edge
  // greater coverts: one row of broad feathers over the bases of the secondaries
  f.bone(b2);
  const soft = (x) => Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.2 }, x);
  const ng = Math.round(ns * 0.8);
  for (let i = ng - 1; i >= 0; i--) { const t = i / (ng - 1) + (f.r() - 0.5) * 0.04, r0 = add(lerp(Ew, Wr, 0.02 + t * 0.96), mul(nF, -wE * 0.1)), a = aF + (o.rake ?? -0.35) * tr * 0.6 + (f.r() - 0.5) * 0.15; feather(f, r0, a, Ls * 0.48 * (1 - t * 0.2) * R(f, 0.88, 1.08), Ws * 0.95, soft({ fill: mix(tone(i + 2), '#fff', 0.04) }), { lead: 0.45, round: true, splits: true, cast: !!o.cover }); }
  // the forearm skin along the leading edge, then the coverts lapping over its trailing half
  arm(Ew, Wr, wE * 0.95, wW, b2);
  f.bone(b2);
  // the median and lesser coverts and the marginals along the leading edge: one feathered mass with a tipped hem
  const cd = Ls * (o.covD ?? 0.3), ca = aF + (o.rake ?? -0.35) * tr * 0.6;
  const hemL = [add(Ew, mul(nF, cd * 0.85)), add(lerp(Ew, Wr, 0.5), mul(nF, cd)), add(Wr, mul(nF, cd * 0.7))];
  const cv = o.cover ? -0.62 : 0;
  const mass = [add(Ew, mul(nF, wE * (0.05 + cv))), add(lerp(Ew, Wr, 0.5), mul(nF, wE * (cv - 0.02))), add(lerp(Ew, Wr, 0.86), mul(nF, wW * (cv * 0.8 + 0.1))), add(Wr, mul(nF, cd * 0.5)), ...featherHem(hemL.slice().reverse(), ca, Ws * 0.7, f).map(q => q)];
  if (o.cover) f.flat(featherHem(hemL, ca, Ws * 0.7, f).map(q => add(q, mul(nF, 6))).concat([add(Wr, mul(nF, cd * 0.4)), add(Ew, mul(nF, cd * 0.6))]), '#0c1016', { op: 0.3 }); // the row's shadow on the greater coverts
  plumeMass(f, mass, ca, Ws * 0.75, soft({ fill: mix(look.fill, '#fff', o.cover ? 0.12 : 0.06), tex: 'barb' + f.o.seed, texOp: 0.35 }), { w: 1, op: 0.5 });
  if (o.cover) { const mg = [add(Ew, mul(nF, -wE * 0.6)), add(lerp(Ew, Wr, 0.5), mul(nF, -wE * 0.6)), add(lerp(Ew, Wr, 0.84), mul(nF, -wW * 0.45)), ...featherHem([add(lerp(Ew, Wr, 0.84), mul(nF, cd * 0.2)), add(lerp(Ew, Wr, 0.5), mul(nF, cd * 0.3)), add(Ew, mul(nF, cd * 0.32))], ca, Ws * 0.45, f)]; plumeMass(f, mg, ca, Ws * 0.45, soft({ fill: mix(look.fill, '#fff', 0.2), tex: 'barb' + f.o.seed, texOp: 0.35 }), { w: 0.9, op: 0.45 }); } // the lesser and marginal coverts over the leading edge, the palest row
  f.bone(b3);
  for (let i = 5; i >= 0; i--) { const t = i / 5, r0 = lerp(Wr, T, 0.05 + t * 0.6), a = aT + (aH - aT) * (1 - t) * 0.5; feather(f, r0, a, Lp * 0.34, Wp * 1.0, Object.assign({}, look, { fill: tone(i + 4), inkW: 0.8, inkHeavy: 1.1 }), { lead: 0.4, round: true, splits: false, cast: !!o.cover }); }
  // upper arm (with the scapular coverts lying over it), forearm and hand skin along the leading edge
  arm(S, Ew, wS, wE, b1, () => { const sa = aU(nU) + (o.rake ?? -0.35) * tr, sd = Ls * 0.42; const hm = [add(lerp(S, Ew, 0.1), mul(nU, sd * 0.8)), add(lerp(S, Ew, 0.95), mul(nU, sd * 0.6))]; plumeMass(f, [add(lerp(S, Ew, 0.05), mul(nU, -wS * (o.cover ? 0.62 : 0.3))), add(Ew, mul(nU, -wE * (o.cover ? 0.62 : 0.3))), add(Ew, mul(nU, sd * 0.4)), ...featherHem(hm.slice().reverse(), sa, Ws * 0.8, f)], sa, Ws * 0.8, Object.assign({}, look, { fill: mix(look.fill, '#fff', 0.05), inkW: 0.9, inkHeavy: 1.2 }), { w: 1, op: 0.5 }); });
  return { nF, nH, aF, aH, aT };
}

// ================================================================ the Torn Sky's own marks

// gold leaf cracked over black on a shape already drawn with GL(): where the leaf has flaked the black ground shows in
// irregular patches (fractal noise, so the losses cluster at edges and high points), with a pale lifted edge on a few;
// burnished bright strokes on the lit side. lost: 0..1 how much leaf is gone.
function gild(f, shape, o = {}) {
  const d = typeof shape === 'string' ? shape : E.smooth(shape), bb = o.bb || E.bbox(shape), pad = 12, lost = o.lost ?? 0.35;
  const box = [bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad];
  clipDraw(f, d, () => {
    stains(f, d, box, P.black, (o.freq ?? 0.03) * 0.45, 16, -10.4 + lost * 9, Math.round(bb[0] * 7 + bb[1] * 3) % 997, 0.95, 5);
    stains(f, d, box, P.goldD, (o.freq ?? 0.03) * 1.4, 6, -3.8, Math.round(bb[0] * 3 + bb[1] * 11) % 991, 0.35, 3);
    if (o.burnish !== false) { const lit = mul(f.L, -1); for (let i = 0; i < Math.min(3, o.nB ?? 3); i++) { const c = scatter(f, [(bb[0] + bb[2]) / 2 + lit[0] * (bb[2] - bb[0]) * 0.18, (bb[1] + bb[3]) / 2 + lit[1] * (bb[3] - bb[1]) * 0.18], (bb[2] - bb[0]) * 0.3, (bb[3] - bb[1]) * 0.3), l = R(f, 6, 18) * (o.s || 1), a = R(f, -0.9, -0.3); f.stroke([add(c, rot([-l, 0], a)), c, add(c, rot([l, 0], a))], R(f, 1.6, 3) * (o.s || 1), P.goldW, { op: R(f, 0.3, 0.5) }); } }
  });
  return d;
}
// leaf curling off the black at an edge: small gold flakes, lit on top, black under-edge
function leafFlakes(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = R(f, -2.6, -0.4), l = R(f, 4, 9) * s;
    f.flat([p, add(p, rot([l, -l * 0.25], a)), add(p, rot([l * 1.1, l * 0.3], a)), add(p, rot([l * 0.3, l * 0.45], a))], f.r() > 0.4 ? P.goldL : P.gold, { op: 0.95 });
    f.line([add(p, rot([l * 0.3, l * 0.45], a)), add(p, rot([l * 1.1, l * 0.3], a))], 0.9, P.blackD, { op: 0.8 });
  }
}
// gold leaf drifting in the air: tiny bent squares of leaf, some edge-on
function leafDrift(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = f.r() * 6.3, l = R(f, 3, 8) * s, k = R(f, 0.2, 1);
    const q = [add(p, rot([-l, -l * k * 0.6], a)), add(p, rot([l * 0.9, -l * k * 0.5], a)), add(p, rot([l, l * k * 0.6], a)), add(p, rot([-l * 0.8, l * k * 0.5], a))];
    f.flat(q, P.goldS, { op: 0.7 }); f.flat(q.map(x => add(x, [-0.6, -0.6])), f.r() > 0.5 ? P.goldL : P.gold, { op: 0.95 });
  }
}
// Lichtenberg burn: a fern of violet branching scars from c heading a, length len, trunk width w. A scorched halo round
// each branch, the burnt violet channel, a pale violet thread down the thickest branches. A scar, not light: no bloom.
function burn(f, c, a, len, w, o = {}) {
  if (o.clip) { const cl = o.clip; return clipDraw(f, typeof cl === 'string' ? cl : E.smooth(cl), () => burn(f, c, a, len, w, Object.assign({}, o, { clip: null }))); }
  const branches = [];
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 5;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * (o.wander ?? 0.8); q = add(q, rot([L / n, 0], b)); pts.push(q); }
    branches.push([pts, ww, depth]);
    if (depth > 0) for (let k = 1; k < n; k++) {
      const nk = f.r() < 0.5 ? 2 : 1;
      for (let j = 0; j < nk; j++) if (f.r() < (o.fork ?? 0.8)) go(pts[k], b + (j ? -1 : 1) * (f.r() > 0.5 ? 1 : -1) * R(f, 0.45, 1.0), L * R(f, 0.3, 0.55), ww * 0.62, depth - 1);
    }
  };
  go(c, a, len, w, o.depth ?? 3);
  if (o.halo !== false) for (const [pts, ww] of branches) f.stroke(pts, ww * 2.6 + 2, o.scorch || P.scorch, { op: o.haloOp ?? 0.4 });
  for (const [pts, ww] of branches) f.stroke(pts, ww + 1, P.vioS, { op: 0.9 });
  for (const [pts, ww] of branches) f.stroke(pts, ww * 0.8, o.col || P.vio, { op: 0.95 });
  for (const [pts, ww, dd] of branches) if (dd >= (o.depth ?? 3) - 1 && ww > 1.6) f.line(pts.slice(0, 4), Math.max(0.7, ww * 0.25), P.vioW, { op: 0.8 });
  return branches;
}
// a crack opening onto the void: a dark lip, the black void inside, a lit chip along the lip facing the light, a thin
// violet thread on the far lip. pts: the crack's line; w: its gape. o.lip: the material's light colour.
function vcrack(f, pts, w = 3, o = {}) {
  const C = pts.length > 2 ? spline(pts, 3) : pts, n = C.length;
  const tw = t => Math.sin(Math.PI * (0.06 + 0.88 * t));
  const L = offsetLine(C, t => w * 0.5 * tw(t)), Rr = offsetLine(C, t => -w * 0.5 * tw(t));
  f.flat([...L, ...Rr.slice().reverse()], o.dark || P.goldS, { op: 0.9 });
  const L2 = offsetLine(C, t => w * 0.32 * tw(t)), R2 = offsetLine(C, t => -w * 0.32 * tw(t));
  f.flat([...L2, ...R2.slice().reverse()], P.void);
  if (n < 3) return;
  const lit = mul(f.L, -1), side2 = (() => { const d = E.norm(sub(C[n - 1], C[0])), nn = [-d[1], d[0]]; return nn[0] * lit[0] + nn[1] * lit[1] > 0 ? 1 : -1; })();
  f.line(offsetLine(C, t => -side2 * w * 0.62 * tw(t)).slice(1, -1), Math.max(0.7, w * 0.22), o.lip || P.goldW, { op: 0.75 });
  f.line(offsetLine(C, t => side2 * w * 0.4 * tw(t)).slice(1, -1), Math.max(0.6, w * 0.16), P.vio, { op: 0.8 });
}
// a branching net of void cracks
function crackV(f, c, a, len, w, o = {}) {
  const out = [];
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 4;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * (o.wander ?? 0.9); q = add(q, rot([L / n, 0], b)); pts.push(q); }
    vcrack(f, pts, ww, o); out.push(pts);
    if (depth > 0) for (let k = 1; k < n; k++) if (f.r() < (o.fork ?? 0.55)) go(pts[k], b + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), L * R(f, 0.35, 0.6), ww * 0.62, depth - 1);
  };
  go(c, a, len, w, o.depth ?? 2);
  return out;
}
// An eye with lids (void world only). c: centre, s: half-width of the eye opening, a: the head's angle. o.lid: lid look;
// o.open 0..1 (how far the upper lid is raised), o.gaze [-1..1, -1..1] (iris offset), o.iris colour, o.lower: show the
// lower lid. Almond opening, wet sclera with violet veins, a striated iris with a dark limbal ring, a small pupil, a
// small wet highlight; the upper lid's crease and its cast shadow over the eyeball. Never a big round staring disc.
function eye(f, c, s, a = 0, o = {}) {
  const F = frame(c, a, s), op = o.open ?? 0.7, g = o.gaze || [0.15, 0.05], ir = o.iris || P.vio, lid = o.lid || GL(f);
  const top = -0.42 * op - 0.06, bot = 0.36;
  const alm = [[-1, 0.04, 1], [-0.6, top * 0.85], [0, top], [0.55, top * 0.9], [1.02, -0.02, 1], [0.55, bot * 0.9], [0, bot], [-0.6, bot * 0.75]];
  // socket and lid mass round the opening
  if (o.mass !== false) f.part(F([[-1.45, 0.1], [-1.1, -0.72], [-0.2, -1.0], [0.8, -0.86], [1.4, -0.2], [1.28, 0.55], [0.4, 0.82], [-0.7, 0.72]]), Object.assign({}, lid, { cast: false, maxShade: s * 0.5, inkW: o.inkW ?? 1.4, inkHeavy: 2 }));
  else f.part(F([[-1.2, 0.05], [-0.7, -0.62], [0.2, -0.78], [1.1, -0.42], [1.2, 0.15], [0.7, 0.5], [-0.4, 0.5]]), Object.assign({}, lid, { cast: false, maxShade: s * 0.3, inkW: 0.8, inkHeavy: 0 }));
  f.flat(F([[-1.15, 0.0], [-0.7, -0.6], [0.2, -0.78], [1.0, -0.5], [1.2, 0.0], [0.6, -0.2], [0, -0.46], [-0.7, -0.3]]), lid.shadow || '#000', { op: 0.35 });
  // the eyeball
  f.part(F(alm), { fill: o.white || '#e2dccc', shadow: '#5a4e5e', light: '#fff8ec', shade: 0.42, cast: false, inkW: 1.2, inkHeavy: 1.6, hatch: false, maxShade: s * 0.25, k: 0.9 });
  clipDraw(f, E.smooth(F(alm).map(q => [...q, 0])), () => {
    for (let i = 0; i < 4; i++) { const sg = i % 2 ? 1 : -1, y = R(f, -0.15, 0.2); f.line(F([[sg * 1.0, y], [sg * 0.75, y + R(f, -0.08, 0.08)], [sg * 0.55, y + R(f, -0.1, 0.1)]]), 0.8, P.vio, { op: 0.45 }); }
    const ic = [g[0] * 0.45, g[1] * 0.2 + 0.0], R0 = 0.5;
    f.flat(F(ell(ic, R0, R0, 0, 22)), mix(ir, '#000', 0.35));
    f.flat(F(ell(ic, R0 * 0.86, R0 * 0.86, 0, 22)), ir);
    for (let k = 0; k < 14; k++) { const t = k / 14 * Math.PI * 2; f.line(F([add(ic, [Math.cos(t) * R0 * 0.3, Math.sin(t) * R0 * 0.3]), add(ic, [Math.cos(t) * R0 * 0.82, Math.sin(t) * R0 * 0.82])]), 0.7, mix(ir, '#000', 0.4), { op: 0.6 }); }
    f.flat(F(ell(ic, R0 * 0.34, R0 * 0.36, 0, 14)), '#030204');
    f.flat(F(ell(add(ic, [-0.14, -0.16]), 0.09, 0.07, 0, 8)), '#fffaf0', { op: 0.85 });
    f.flat(F([[-1.1, top - 0.1], [1.1, top - 0.1], [1.1, top + 0.22], [0.4, top + 0.28], [-0.4, top + 0.26], [-1.1, top + 0.18]]), '#1a1018', { op: 0.45 }); // the upper lid's shadow on the ball
  });
  // the lid margins: a thick upper lid edge with its crease above, a thin lower lid
  f.stroke(F([[-1.02, 0.05], [-0.6, top * 0.85 - 0.02], [0, top - 0.04], [0.55, top * 0.9 - 0.03], [1.04, -0.02]]), s * 0.16, INK);
  f.line(F([[-0.8, top - 0.24], [-0.1, top - 0.36], [0.6, top - 0.28], [0.95, top - 0.12]]), Math.max(0.9, s * 0.05), mix(lid.shadow || '#000', '#000', 0.3), { op: 0.75 });
  if (o.lower !== false) f.line(F([[-0.7, bot * 0.8 + 0.04], [0, bot + 0.05], [0.6, bot * 0.9 + 0.04]]), Math.max(0.8, s * 0.05), mix(lid.fill, '#000', 0.4), { op: 0.7 });
  return F;
}
// a starfield inside a void shape: points of light of a few sizes, a few with four short rays; never nebulae or galaxies
function starfield(f, d, bb, n, o = {}) {
  clipDraw(f, d, () => {
    for (let i = 0; i < n; i++) {
      const p = [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])], big = f.r() < 0.08, r = big ? R(f, 1.4, 2.4) : R(f, 0.5, 1.3);
      const col = f.r() < 0.15 ? P.goldL : f.r() < 0.3 ? P.vioL : '#f4f0ff';
      f.flat(ell(p, r, r, 0, 6), col, { op: R(f, 0.5, 1) });
      if (big) for (const a of [0, Math.PI / 2]) f.line([add(p, rot([-r * 3.2, 0], a)), add(p, rot([r * 3.2, 0], a))], 0.7, col, { op: 0.7, straight: true });
    }
  });
}
// a dent in plate: a dark crescent on the side away from the light, a bright crescent toward it, a crease through it
function dent(f, c, r, a = 0, o = {}) {
  const lit = Math.atan2(-f.L[1], -f.L[0]);
  f.flat(ell(add(c, rot([r * 0.25, 0], lit)), r, r * 0.7, a, 14), o.dark || P.goldS, { op: 0.5 });
  f.flat(ell(add(c, rot([-r * 0.3, 0], lit)), r * 0.7, r * 0.45, a, 12), o.lite || P.goldL, { op: 0.45 });
  f.line([add(c, rot([-r, 0], a + 0.3)), add(c, rot([r * 0.9, r * 0.1], a + 0.3))], 1, INK, { op: 0.5 });
}
// metal melted by the strike and set hard: a run hanging from p with a bead at its end, bright at its lip
function fusedRun(f, p, len, w, look) {
  const pts = [p, add(p, [w * 0.2, len * 0.4]), add(p, [-w * 0.15, len * 0.75]), add(p, [0, len])];
  f.stroke(pts, w + 2.4, INK, { op: 0.85 }); f.stroke(pts, w, look.fill); f.stroke(pts.slice(0, 3), w * 0.35, look.light || '#fff', { op: 0.7 });
  f.part(ell(add(p, [0, len + w * 0.3]), w * 0.8, w * 0.65, 0, 8), Object.assign({}, look, { shade: 0.4, inkW: 1.1, inkHeavy: 1.2, cast: false, hatch: false, tex: undefined }));
}
// a cracked halo: a ring of gold leaf over black broken into pieces that have drifted a little apart (clean gaps).
// c: centre, rx/ry: radii (ry < rx tips it into perspective), a: tilt, w: band width, breaks: angles (0..1 round the
// ring) where it is broken, drift: how far the pieces have moved apart. Returns the pieces' centres.
function crackedHalo(f, c, rx, ry, a, w, breaks, o = {}) {
  const drift = o.drift ?? 6, bs = breaks.slice().sort((x, y) => x - y), out = [];
  for (let i = 0; i < bs.length; i++) {
    const t0 = bs[i] + 0.012, t1 = (i + 1 < bs.length ? bs[i + 1] : bs[0] + 1) - 0.012, n = Math.max(4, Math.round((t1 - t0) * 60));
    const mid = (t0 + t1) / 2 * Math.PI * 2, mv = rot([Math.cos(mid) * drift, Math.sin(mid) * drift * (ry / rx)], a);
    const at = (t, rr) => add(add(c, rot([Math.cos(t * Math.PI * 2) * rr, Math.sin(t * Math.PI * 2) * rr * (ry / rx)], a)), mv);
    const outer = [], inner = [];
    for (let k = 0; k <= n; k++) { const t = t0 + (t1 - t0) * k / n; outer.push(at(t, rx + w / 2)); inner.push(at(t, rx - w / 2)); }
    const shp = [...outer.map((q, k) => k === 0 || k === n ? [...q, 1] : q), ...inner.reverse().map((q, k) => k === 0 || k === n ? [...q, 1] : q)];
    f.part(shp, GL(f, { shade: 0.35, inkW: 1.6, inkHeavy: 2.4, cast: false, maxShade: w * 0.4, k: 0.9 }));
    gild(f, shp, { lost: o.lost ?? 0.35, nB: 2, s: Math.max(0.5, w / 20) });
    // the tooled band along the middle and the snapped ends, black inside
    const mids = []; for (let k = 1; k < n; k++) mids.push(at(t0 + (t1 - t0) * k / n, rx));
    f.line(mids, Math.max(0.8, w * 0.1), P.goldD, { op: 0.7, dash: `${(w * 0.25).toFixed(1)} ${(w * 0.35).toFixed(1)}` });
    for (const t of [t0, t1]) f.line([at(t, rx - w / 2 + 1), at(t, rx + w / 2 - 1)], Math.max(1.4, w * (o.capW ?? 0.22)), P.void);
    if (o.burn !== false && f.r() < 0.6) burn(f, at((t0 + t1) / 2, rx), (t0 + t1) / 2 * Math.PI * 2 + a + Math.PI / 2, Math.min(w * 3, (t1 - t0) * rx * 3), Math.max(1.2, w * 0.12), { depth: 1, halo: false, clip: shp }); // clipped to the piece: never off it into the air
    out.push(at((t0 + t1) / 2, rx));
  }
  return out;
}
// A hole in the world in the shape of a body (Rift Hound): flat void, depth shown by the far inner wall catching a dim
// violet light on the side away from the key light (a hole, not a solid), a thin violet rim, the lit lip on the near
// edge, and edge fragments that have thinned off into clean little shards drifting away.
function voidShape(f, pts, o = {}) {
  const d = E.smooth(pts), bb = E.bbox(pts), lit = mul(f.L, -1);
  f.flat(d, P.void);
  clipDraw(f, d, () => {
    const off = mul(lit, -(o.depth ?? 22)), inner = pts.map(q => add(q, off));
    f.raw(`<path d="${d}" fill="${P.vioS}" opacity="0.9"/>`);
    f.flat(inner, P.void); // the near wall hides all but a crescent of the far wall
    softTone(f, d, [[inner, P.void, 0.7, 10]]);
    if (o.inside) o.inside();
  });
  f.line([...pts, pts[0]], o.rimW ?? 3.2, P.vioD, { op: 0.95 });
  f.line([...pts, pts[0]], Math.max(0.8, (o.rimW ?? 3.2) * 0.35), P.vioL, { op: 0.85 });
  return d;
}
// small clean-edged shards of void drifting off an edge (the edge thinning into nothing)
function shards(f, c, dirA, n, s = 1, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = add(c, rot([R(f, 6, 40) * s * (1 + i * 0.3), R(f, -12, 12) * s], dirA)), r = R(f, 2.5, 7) * s * (1 - i * 0.08), a = f.r() * 6.3;
    const q = [add(p, rot([-r, -r * 0.4], a)), add(p, rot([r * 0.8, -r * 0.6], a)), add(p, rot([r * 1.1, r * 0.4], a)), add(p, rot([-r * 0.3, r * 0.7], a))].map(x => [...x, 1]);
    f.line([...q, q[0]], 2, o.rim || P.vioD, { op: 0.9 }); f.flat(q, o.fill || P.void);
    f.line([q[0], q[1]], 0.8, P.vioL, { op: 0.7 });
  }
}
// hair standing from the strike: clumps lifted up and out from a scalp line, frizzed and forked at their tips
function standingHair(f, roots, len, o = {}) {
  const pal = o.pal || [P.goldD, P.gold, P.goldL, P.goldM];
  roots.forEach(([p, aa], i) => {
    const a = aa ?? (-Math.PI / 2 + (o.lean ?? 0)), l = len * R(f, 0.6, 1.1), ph = f.r() * 6;
    const C = []; for (let k = 0; k <= 6; k++) { const t = k / 6; C.push(add(p, rot([l * t, Math.sin(t * 7 + ph) * 3 * t], a + (f.r() - 0.5) * 0.15))); }
    hairClump(f, C, o.w ?? R(f, 4, 7), { pal, gap: o.gap ?? true, n: 2 });
    // the tip frizzes and forks: two or three fine hairs splaying off it
    const e = C[C.length - 1], m = C[4];
    for (let k = -1; k <= 1; k++) if (k === 0 || f.r() < 0.7) { const q = add(e, rot([l * R(f, 0.12, 0.25), 0], a + k * R(f, 0.35, 0.7))); f.line([m, lerp(m, e, 0.6), q], 0.9, pal[k === 0 ? 2 : 1], { op: 0.85 }); }
  });
}
// a small stone or gold shard of ruin (floating rubble): a faceted chip with a lit top face
function chip(f, c, r, look, o = {}) {
  const a = o.a ?? f.r() * 6.3, k = o.k ?? R(f, 0.5, 0.9);
  const q = [[-1, -0.3], [-0.3, -k], [0.7, -0.7 * k], [1, 0.2], [0.3, 0.8 * k], [-0.6, 0.6 * k]].map(([x, y]) => [...add(c, rot([x * r, y * r], a)), 1]);
  f.part(q, Object.assign({}, look, { cast: false, inkW: 1.1, inkHeavy: 1.6, maxShade: r * 0.4 }));
  f.flat([q[0], q[1], q[2], add(c, rot([0, -0.1 * r], a))], look.light || '#fff', { op: 0.35 });
  return q;
}
// a bare angel's leg: thigh, knee, shin and a bare foot in one idealised outline (kit fullLeg), with its anatomy
function angelLeg(f, Hp, Kn, A, s, wH, wK, look, o = {}) { return fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o); }

// ================================================================ second pass (director's sheet check)
// Gold leaf laid over black stone, as large intact plates: the leaf is whole across most of the form; the black shows
// only along the cracks between plates (a net of bent hairlines, some opened wider with a lifted, lit lip and a leaf
// curling off it), at chips along the piece's edge, and in recesses (o.recess: polygons darkened as hollows). A faint
// tarnish keeps the plates from reading flat. cell: plate size in px.
function leaf(f, shape, o = {}) {
  const d = typeof shape === 'string' ? shape : E.smooth(shape), bb = o.bb || E.bbox(shape), cell = o.cell ?? 70, s = o.s ?? 1;
  const lit = mul(f.L, -1);
  clipDraw(f, d, () => {
    stains(f, d, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.goldD, 0.012, 5, -3.2, Math.round(bb[0] * 3 + bb[1] * 11) % 991, 0.3, 3); // tarnish
    if (o.recess) for (const r of o.recess) softTone(f, d, [[r, P.blackD, 0.55, 10 * s]]);
    // the plates: jittered grid points joined to their nearest neighbours
    const pts = [];
    for (let y = bb[1] - cell * 0.5; y < bb[3] + cell; y += cell * 0.86) for (let x = bb[0] - cell * 0.5; x < bb[2] + cell; x += cell) pts.push([x + R(f, -0.35, 0.35) * cell + (Math.round(y / cell) % 2) * cell * 0.5, y + R(f, -0.3, 0.3) * cell]);
    const seen = new Set();
    pts.forEach((a, i) => {
      const near = pts.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1]), j]).filter(x => x[1] !== i).sort((x, y) => x[0] - y[0]).slice(0, 3);
      for (const [dd, j] of near) {
        const key = i < j ? i + '_' + j : j + '_' + i; if (seen.has(key) || dd > cell * 1.5) continue; seen.add(key);
        const b = pts[j], m1 = add(lerp(a, b, 0.33), [R(f, -0.08, 0.08) * dd, R(f, -0.08, 0.08) * dd]), m2 = add(lerp(a, b, 0.66), [R(f, -0.08, 0.08) * dd, R(f, -0.08, 0.08) * dd]);
        const L = [a, m1, m2, b], open = f.r() < (o.open ?? 0.16);
        if (open) { // the crack has opened: black between the plates, the lifted lip catching the light, a curl of leaf
          f.line(L, R(f, 2.6, 4.6) * s, P.blackD, { straight: true, op: 0.95 });
          f.line(L.map(q => add(q, mul(lit, 2.2 * s))), 1.2 * s, P.goldW, { straight: true, op: 0.7 });
          if (f.r() < 0.5) leafFlakes(f, lerp(m1, m2, 0.5), 4, 4, 1, s * 1.2);
        } else f.line(L, R(f, 0.8, 1.5) * s, P.blackD, { straight: true, op: 0.7 });
      }
    });
    // chips: the leaf gone at the edge of the piece, black stone showing, a lit broken lip
    const ol = typeof shape === 'string' ? null : shape;
    if (ol) for (let k = 0; k < (o.chips ?? 6); k++) {
      const q = ol[Math.floor(f.r() * ol.length)], r = R(f, 6, 16) * s, a = f.r() * 6.3, n = 6 + Math.floor(f.r() * 3), c = [];
      for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; c.push([...add(q, rot([Math.cos(t) * r * R(f, 0.6, 1.3), Math.sin(t) * r * R(f, 0.5, 1)], a)), 1]); }
      f.flat(c, P.black); f.line(c.slice(0, Math.ceil(n / 2)), 1.2 * s, P.goldW, { op: 0.6 });
    }
    if (o.burnish !== false) for (let i = 0; i < (o.nB ?? 3); i++) { const c = scatter(f, [(bb[0] + bb[2]) / 2 + lit[0] * (bb[2] - bb[0]) * 0.2, (bb[1] + bb[3]) / 2 + lit[1] * (bb[3] - bb[1]) * 0.2], (bb[2] - bb[0]) * 0.25, (bb[3] - bb[1]) * 0.25); softTone(f, d, [[ell(c, R(f, 12, 30) * s, R(f, 5, 12) * s, R(f, -0.9, -0.3), 10), P.goldW, 0.35, 5 * s]]); }
  });
  return d;
}
// a deep drapery fold inside a clipped region d: a dark valley on the shadow side, a lit ridge on the light side, the
// crease itself, and a few hatch strokes laid across the valley following the fold (Living Ink form hatching)
function fold2(f, d, pts, w, o = {}) {
  const C = spline(pts, 6), lit = mul(f.L, -1);
  const band = (off, ww) => ribbon(C.map(q => add(q, off)), C.map((_, i, A) => ww * Math.sin(Math.PI * (0.08 + 0.84 * i / (A.length - 1)))));
  softTone(f, d, [[band(mul(lit, -w * 0.6), w * 1.4), o.dark || '#140a02', o.darkOp ?? 0.6, w * 0.35], [band(mul(lit, w * 0.9), w * 0.9), o.light || '#fff0c0', o.lightOp ?? 0.35, w * 0.3]]);
  crease(f, C, w * 0.32, { col: o.col || '#120800', lit: o.lit || '#f6dc90', op: 0.8 });
  if (o.hatch !== false) for (let i = 2; i < C.length - 2; i += 3) { const dd = E.norm(sub(C[i + 1], C[i - 1])), nn = [-dd[1], dd[0]], sd = (nn[0] * lit[0] + nn[1] * lit[1]) > 0 ? -1 : 1; const a = add(C[i], mul(nn, sd * w * 0.1)), b = add(add(C[i], mul(nn, sd * w * 0.9)), mul(dd, w * 0.2)); f.line([a, b], 1, INK, { op: 0.45 }); }
}
// Living Ink form hatching on a curved surface: short strokes laid along a contour (pts), on its shadow side, each stroke
// turning with the surface; n strokes, len long. Used on cheek, brow, breast and fold shoulders.
function formHatch(f, pts, len, o = {}) {
  const C = spline(pts, o.step ?? 7), lit = mul(f.L, -1);
  for (let i = 1; i < C.length - 1; i++) {
    const dd = E.norm(sub(C[i + 1], C[i - 1])), nn = [-dd[1], dd[0]], sd = o.side ?? ((nn[0] * lit[0] + nn[1] * lit[1]) > 0 ? -1 : 1), t = i / (C.length - 1), l = len * Math.sin(Math.PI * t) * R(f, 0.7, 1.1);
    const a = C[i], b = add(add(a, mul(nn, sd * l)), mul(dd, l * 0.25)), m = add(lerp(a, b, 0.5), mul(dd, l * 0.12));
    f.line([a, m, b], o.w ?? 1.1, o.col || INK, { op: o.op ?? 0.5 });
  }
}
// The broken underside of a hollow piece, seen from below (the camera stands at a human's chest, under the colossus): a
// band hanging under the break line `line` by `depth` along `dirV`; the stone shell shows at its outer and inner rims
// (chiselled grey-black stone, a lit chipped edge), and between them the hollow: void, with a dim violet depth.
function breakFace(f, line, dirV, depth, o = {}) {
  const sh = o.shell ?? Math.max(8, depth * 0.3), dv = E.norm(dirV);
  const far = line.map(q => add(q, mul(dv, depth)));
  const band = [...line, ...far.slice().reverse()].map(q => [q[0], q[1], 1]);
  f.part(band, { fill: '#3a3440', shadow: '#0c0a10', light: '#6a6270', shade: 0.35, tex: 'chisel' + f.o.seed, texOp: 0.8, inkW: 1.6, inkHeavy: 2.4, cast: false, maxShade: 6 });
  const inA = line.map(q => add(q, mul(dv, sh))), inB = line.map(q => add(q, mul(dv, depth - sh * 0.6)));
  const hollow = [...inA.slice(1, -1), ...inB.slice(1, -1).reverse()];
  if (hollow.length > 2) { f.flat(hollow, P.void); f.flat(hollow.map(q => add(q, mul(dv, -sh * 0.4))).slice(0, inA.length - 2), P.vioS, { op: 0.0 }); f.line(inA.slice(1, -1), 2, P.vioD, { op: 0.8 }); }
  f.line(line, 2.2 * (o.s ?? 1), P.goldW, { op: 0.7 }); // the leaf's broken lip on the outer edge
  return band;
}

// ================================================================ independent review (2026-11-23)
// A big carved hand whose fingers really fold (the shared openHand only shortens a straight finger). Local frame: x from
// the wrist along the hand, y toward the palm side (o.flip mirrors it), unit = s (hand length). Each finger is three
// phalanges joined at angles: fingers[i] = { b: base [u,v], a: base angle, L: [l1,l2,l3] (in s), bend: [at the
// knuckle, at the middle joint, at the end joint] (radians, + curls toward the palm), w: width, nail: show the nail,
// back: which side shows the back of the finger (-1 dorsal = -y, the default), cut: [segment, t] (the finger broken off
// there), z: 1 draws it over the palm }. The outline tapers from the base to the tip, swells into a knuckle bump on the
// back of each bent joint and into a pad on the palm side of each phalanx, and nips in at the palm-side creases. Each
// finger gets lit knuckles, wrinkle arcs over the back of its joints, crease pairs on the palm side and a nail plate
// with its cuticle and free edge. thumb: the same record (its base at the heel of the hand). palm: polygon in local
// units. Returns { F, fing: [{ k: [k0..k3] screen, W }] }.
function godHand(f, c, a0, s, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(c, a0, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg, p[2] || 0]));
  const look = o.look, dk = mix(look.shadow || '#000', '#000', 0.2), lt = o.lit || mix(look.fill, '#fff', 0.5);
  const pn = a => [-Math.sin(a), Math.cos(a)]; // the palm-side normal of a phalanx heading a (local)
  const build = (g) => {
    const L = g.L, w = g.w, bk = g.back ?? -1;
    const ks = [g.b]; let a = g.a + (g.bend[0] || 0); const angs = [];
    for (let j = 0; j < 3; j++) { if (j) a += g.bend[j] || 0; angs.push(a); ks.push(add(ks[j], mul([Math.cos(a), Math.sin(a)], L[j]))); }
    const hw = [w * 0.5, w * 0.46, w * 0.41, w * 0.35]; // half widths at k0..k3: the taper
    let nSeg = 3, tEnd = 1; if (g.cut) { nSeg = g.cut[0] + 1; tEnd = g.cut[1]; }
    const D = [], Pm = []; // back-side and palm-side outlines, base to tip
    for (let j = 0; j < nSeg; j++) {
      const k0 = ks[j], k1 = ks[j + 1], aa = angs[j], d = [Math.cos(aa), Math.sin(aa)], n = pn(aa), last = j === nSeg - 1, te = last ? tEnd : 1;
      const hA = hw[j], hB = hw[j] + (hw[j + 1] - hw[j]) * te, at = (t, k) => add(lerp(k0, k1, t), mul(n, k));
      if (j === 0) { D.push(at(0, -bk * -hA)); Pm.push(at(0, bk * -hA)); }
      // the back of the phalanx runs straight; its palm side swells into a pad
      D.push(at(0.5 * te, -bk * -(hA + hB) / 2 * 0.98)); Pm.push(at(0.5 * te, bk * -(hA + hB) / 2 * 1.1));
      if (!last) { // the joint: a knuckle bump on the outside of the bend, a nipped crease inside it
        const n2 = pn(angs[j + 1]), bis = E.norm(add(n, n2)), bend = Math.abs(angs[j + 1] - aa);
        D.push(add(k1, mul(bis, bk * hw[j + 1] * (1.06 + Math.min(0.3, bend * 0.25)))));
        Pm.push(add(k1, mul(bis, -bk * hw[j + 1] * (0.84 - Math.min(0.12, bend * 0.1)))));
      } else if (!g.cut) {
        D.push(at(0.82, -bk * -hB * 0.98)); Pm.push(at(0.8, bk * -hB * 1.02));
      } else { D.push(at(te, -bk * -hB)); Pm.push(at(te, bk * -hB)); }
    }
    let out;
    if (!g.cut) { // the rounded fingertip
      const aa = angs[2], d = [Math.cos(aa), Math.sin(aa)], n = pn(aa), cc = add(ks[3], mul(d, -hw[3] * 0.85)), cap = [];
      for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(cc, add(mul(n, bk * Math.cos(t) * hw[3]), mul(d, Math.sin(t) * hw[3] * 1.05)))); }
      out = [...D, ...cap, ...Pm.slice().reverse()];
    } else out = [...D, ...Pm.slice().reverse().map((q, i) => i === 0 ? [...q, 1] : q)].map((q, i) => i === D.length - 1 ? [...q, 1] : q);
    return { ks, angs, hw, out, nSeg, tEnd, bk };
  };
  const draw = (g, B) => {
    const sh = F(B.out);
    f.part(sh, Object.assign({}, look, { cast: false, inkW: o.inkW ?? 2, inkHeavy: o.inkHeavy ?? 3, maxShade: s * g.w * 0.3 }));
    clipDraw(f, E.smooth(sh), () => {
      for (let j = 0; j < B.nSeg; j++) { // a lit band down the back of each phalanx, the palm side in shade
        const k0 = B.ks[j], k1 = j === B.nSeg - 1 ? lerp(B.ks[j], B.ks[j + 1], B.tEnd) : B.ks[j + 1], n = pn(B.angs[j]);
        softTone(f, E.smooth(sh), [[F([add(k0, mul(n, B.bk * B.hw[j] * 0.2)), add(k1, mul(n, B.bk * B.hw[j] * 0.2)), add(k1, mul(n, B.bk * B.hw[j] * 0.85)), add(k0, mul(n, B.bk * B.hw[j] * 0.85))]), o.litCol || '#fff0c0', 0.3, s * 0.008 + 2], [F([add(k0, mul(n, -B.bk * B.hw[j] * 0.3)), add(k1, mul(n, -B.bk * B.hw[j] * 0.3)), add(k1, mul(n, -B.bk * B.hw[j] * 1.2)), add(k0, mul(n, -B.bk * B.hw[j] * 1.2))]), '#140a02', 0.35, s * 0.008 + 2]]);
      }
    });
    for (let j = 1; j < B.nSeg + (B.tEnd < 1 ? 0 : 0); j++) { // the joints
      const k = B.ks[j], n1 = pn(B.angs[j - 1]), n2 = pn(B.angs[j]), bis = E.norm(add(n1, n2)), d = E.norm(add([Math.cos(B.angs[j - 1]), Math.sin(B.angs[j - 1])], [Math.cos(B.angs[j]), Math.sin(B.angs[j])])), h = B.hw[j];
      const kb = add(k, mul(bis, B.bk * h * 0.7));
      f.flat(F(ell(add(kb, mul(bis, -B.bk * h * 0.05)), h * 0.42, h * 0.28, Math.atan2(d[1], d[0]), 10)), lt, { op: 0.4 }); // the lit knuckle
      for (let i = 0; i < 3; i++) { const c0 = add(add(k, mul(d, (i - 1) * h * 0.22)), mul(bis, B.bk * h * 0.25)); f.line(F([add(c0, mul(bis, B.bk * h * 0.55)), add(add(c0, mul(bis, B.bk * h * 0.15)), mul(d, -h * 0.12)), add(c0, mul(bis, -B.bk * h * 0.2))]), i === 1 ? 1.6 : 1.1, INK, { op: 0.5 }); } // wrinkles over the back of the joint
      for (const off of [-0.12, 0.1]) f.line(F([add(add(k, mul(d, off * h)), mul(bis, -B.bk * h * 0.95)), add(add(k, mul(d, off * h + 0.01)), mul(bis, -B.bk * h * 0.35))]), off < 0 ? 2 : 1.4, dk, { op: 0.75 }); // the palm-side crease
    }
    if (g.nail !== false && !g.cut) { // the nail plate on the back of the last phalanx
      const k2 = B.ks[2], k3 = B.ks[3], aa = B.angs[2], d = [Math.cos(aa), Math.sin(aa)], n = pn(aa), h = B.hw[3], off = g.nailOff ?? 0.45;
      const at = (t, k) => add(lerp(k2, k3, t), mul(n, B.bk * (k + off) * h));
      const nl = [at(0.32, 0.55), at(0.86, 0.58), at(0.99, 0.3), at(1.0, -0.05), at(0.86, -0.42), at(0.32, -0.4)];
      f.part(F(nl), Object.assign({}, look, { fill: o.nail || mix(look.fill, '#fff', 0.25), cast: false, inkW: 1.3, inkHeavy: 1.8, maxShade: 3, hatch: false }));
      f.line(F([at(0.36, 0.5), at(0.3, 0.05), at(0.36, -0.36)]), 1.6, dk, { op: 0.7 }); // the cuticle
      f.line(F([at(0.45, 0.25), at(0.9, 0.25)]), 1.4, lt, { op: 0.6 });
      f.line(F([at(0.9, 0.5), at(0.95, 0.05), at(0.88, -0.35)]), 1.1, INK, { op: 0.5 }); // the free edge
    }
    if (g.cut) { // broken off: the stump shows the shell and the hollow
      const j = B.nSeg - 1, e = lerp(B.ks[j], B.ks[j + 1], B.tEnd), aa = B.angs[j], h = B.hw[j] * 0.95;
      const rim = F(ell(e, h * 0.36, h, aa, 14)); f.flat(rim, '#3a3440'); f.flat(F(ell(e, h * 0.24, h * 0.72, aa, 12)), P.void); f.line(rim.slice(0, 8), 1.6, P.goldW, { op: 0.7 });
    }
    return B;
  };
  const fin = (o.fingers || []).map(g => ({ g, B: build(g) }));
  const th = o.thumb ? { g: o.thumb, B: build(o.thumb) } : null;
  const order = x => x.g.z || 0;
  if (th && !th.g.z) draw(th.g, th.B);
  fin.filter(x => order(x) <= 0).forEach(x => draw(x.g, x.B));
  if (o.palm) {
    const pm = F(o.palm);
    f.part(pm, Object.assign({}, look, { cast: false, inkW: o.inkW ?? 2.2, inkHeavy: o.inkHeavy ?? 3.2, maxShade: s * 0.06 }));
    if (o.palmIn) clipDraw(f, E.smooth(pm), () => o.palmIn(F));
  }
  fin.filter(x => order(x) > 0).forEach(x => draw(x.g, x.B));
  if (th && th.g.z) draw(th.g, th.B);
  return { F, fing: fin.map(x => ({ k: F(x.B.ks), W: x.g.w * s, B: x.B })), thumb: th ? F(th.B.ks) : null };
}

module.exports = {
  godHand,
  P, base, rnd, R, scatter, ang, elb, pd, dir, GL, BK, BN, GR, FE, HS, textures, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, mlimb, humanJoints, rope,
  softTone, stains, crease, creaseField, offsetLine, hairClump, fullLeg, prune, openHand, tableHand, link, ironChain, greyFace, wraps, split, side,
  seam, crackNet, hairline, flakes, ash, soot, ashCake, charEdge, charHem, burnHole, voidDisk, cutHoles, voidEye, muscleArm, placeFigure,
  feather, plumeMass, featherHem, wing,
  leaf, fold2, formHatch, breakFace, gild, leafFlakes, leafDrift, burn, vcrack, crackV, eye, starfield, dent, fusedRun, crackedHalo, voidShape, shards, standingHair, chip, angelLeg,
};
