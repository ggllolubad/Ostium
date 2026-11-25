// World IX, The Hollow Barrow (Frost + Toxin, cryo-rot): local helpers. Shared files stay frozen; everything new lives here.
// Copied from reviewed kits so this world does not depend on their files: openHand/tube/prune/link/ironChain (kit_I_a),
// crease/creaseField/stains/softTone/offsetLine/hairClump/fullLeg/fullArm (kit_II), tableHand (kit_keepers),
// spline/arcLen/ik/clipDraw/ribbon/jointLimb/jcut/creases/fistDetail/mlimb/humanJoints and the frost marks (kit_VII),
// split/side (dirAC).
//
// Frost (dominant): keeps bodies grey and stiff; rime crust in the hollows and on the windward side, icicles hanging
// plumb, faceted planes, bodies stopped mid-gesture. Never clean ice crystals or snowflakes: every bit of ice is lumpy,
// dull and dirty grey-green white.
// Toxin: blooms anyway: grey-green mould, plague sores and buboes, fungal fur, fruiting bodies, peeling. Never slime
// puddles, never a neon green glow: the mould is dull, furred and dry.
// Palette: grey-green frost, bone, mould; plus ink black and grey (rust, tarnished silver and black frostbite where the
// bible names them). No warm colour, no red.
// Windward: the cold air pours down the barrow passage behind them, so in drawing space (foes are drawn facing right and
// mirrored) rime builds on the back (-x) and upper edges and in every hollow. Key light: foeBase, upper right in drawing space.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  frost: '#d3dbd3', frostS: '#8f9c94', frostD: '#5b6a63', glaze: '#bfcdc4', hoar: '#eef2ec',
  skin: '#9da093', skinS: '#4c4946', skinL: '#c0c2b5', skinD: '#6c6d64', // dead grey; a warm-grey shadow so it reads as flesh, not steel
  bruise: '#6c6163', bruiseD: '#382e30', pus: '#c9c39a', // plague sores: grey-mauve and bone-yellow, never red
  mould: '#6d775f', mouldD: '#3e4636', mouldL: '#929a82', mouldW: '#cdd0c0', mouldY: '#8e8e6a',
  bone: '#d5cfbb', boneD: '#99917d', boneS: '#5e584a',
  linen: '#8d8b80', linenD: '#5c5b52', linenL: '#b4b0a0',
  wool: '#585a50', woolD: '#393b33', woolL: '#76786c',
  fur: '#6c6a5e', furD: '#403e35', furL: '#9a9686',
  iron: '#3f413e', ironD: '#262826', ironL: '#646862',
  rust: '#6b4a34', rustD: '#43301f', rustL: '#8a6446',
  silver: '#8e9491', silverD: '#525956', silverL: '#c2c7c1',
  leather: '#3d3a30', leatherD: '#24231c', leatherL: '#5a5646',
  wood: '#4a463a', woodD: '#2c2a22', woodL: '#6c6654',
  stone: '#5d625c', stoneD: '#393d39', stoneL: '#7e837b',
  black: '#1c1a1a', blackL: '#3a3634', earth: '#2b2c25', grey: '#77786f',
};

// the world's render setup: kit.foeBase with a cool grey-green shadow and frozen-earth mud; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - 230, shadowTint: '#222826', mud: '#2a2c24' }, o));
const rnd = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend

// dead grey skin (explicit warm-grey shadow; mottled)
const SK = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.32, tex: 'mottle' + f.o.seed, texOp: 0.6 }, o);

// texture patterns for one figure (call once after the Fig is made): mfur (mould fuzz), hoar (frost speckle),
// icetex (dull ice), wrinkle (fine skin creases), lamellar (laced plates), fur (combed animal fur)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 7 + 3);
  let m = '';
  for (let i = 0; i < 60; i++) { const x = r() * 40, y = r() * 40, a = r() * Math.PI * 2, l = 1.5 + r() * 3, c = r() > 0.55 ? P.mouldL : (r() > 0.5 ? P.mouldD : P.mouldW); m += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" stroke="${c}" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>`; }
  for (let i = 0; i < 10; i++) { const x = r() * 40, y = r() * 40; m += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + r() * 1.2).toFixed(1)}" fill="${P.mouldW}" opacity="0.7"/>`; }
  f.defs.push(`<pattern id="mfur${s}" patternUnits="userSpaceOnUse" width="40" height="40">${m}</pattern>`);
  f.defs.push(`<filter id="hoarf${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${s + 41}"/><feColorMatrix values="0 0 0 0 0.92  0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 9 -5.6"/></filter><pattern id="hoar${s}" patternUnits="userSpaceOnUse" width="300" height="300"><rect width="300" height="300" filter="url(#hoarf${s})"/></pattern>`);
  f.defs.push(`<filter id="icef${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="${s + 47}"/><feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.40  0 0 0 0 0.36  0 0 0 -2.2 1.15"/></filter><pattern id="icetex${s}" patternUnits="userSpaceOnUse" width="400" height="400"><rect width="400" height="400" filter="url(#icef${s})"/></pattern>`);
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  // lamellar: small laced plates in staggered rows, each with a lace hole pair and a lit top edge
  f.defs.push(`<pattern id="lamellar${s}" patternUnits="userSpaceOnUse" width="14" height="22"><path d="M0.5,1 h6 v19 h-6 z M7.5,12 h6 v19 h-6 z M7.5,-10 h6 v19 h-6 z" fill="none" stroke="${INK}" stroke-width="1.1"/><path d="M1,1.5 h5 M8,12.5 h5" stroke="#d0c8b0" stroke-width="0.8" opacity="0.5"/><circle cx="3.5" cy="5" r="0.9" fill="${INK}"/><circle cx="3.5" cy="16" r="0.9" fill="${INK}"/><circle cx="10.5" cy="5" r="0.9" fill="${INK}"/><circle cx="10.5" cy="16" r="0.9" fill="${INK}"/></pattern>`);
  // fur: combed strands, mostly downward
  let fu = '';
  for (let i = 0; i < 34; i++) { const x = r() * 30, y = r() * 30, a = 1.2 + (r() - 0.5) * 0.7, l = 4 + r() * 6; fu += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(Math.cos(a) * l * 0.5 + 1).toFixed(1)},${(Math.sin(a) * l * 0.5).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" fill="none" stroke="${r() > 0.5 ? INK : '#c8c4b0'}" stroke-width="0.9" opacity="${r() > 0.5 ? 0.55 : 0.4}"/>`; }
  f.defs.push(`<pattern id="fur${s}" patternUnits="userSpaceOnUse" width="30" height="30">${fu}</pattern>`);
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
function rope(f, pts, w, col = P.linenD, o = {}) {
  const C = spline(pts, 3);
  f.line(C, w + 2, INK, { op: 0.9 }); f.line(C, w, col);
  for (let i = 1; i < C.length - 1; i += 2) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, w * 0.45)), add(add(C[i], mul(d, w * 0.5)), mul(n, -w * 0.45))], 0.8, mix(col, '#000', 0.5), { op: 0.7, straight: true }); }
  if (o.lit !== false) f.line(C.map(q => add(q, [w * 0.15, -w * 0.25])), Math.max(0.8, w * 0.2), '#e4e8e0', { op: 0.4 });
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
  const pal = o.pal || [P.furD, P.fur, P.furL, P.grey];
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

// ---- frost marks (after kit_VII fx, recoloured to the barrow's grey-green frost). Windward = -x in drawing space.
function fx(f, sc = 1) {
  const R = () => f.r(), s = f.o.seed, o = {};
  const IC = (x = {}) => Object.assign({ fill: P.frost, shadow: P.frostS, shade: 0.32, tex: 'icetex' + s, texOp: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false, hatch: false, grime: false }, x);
  o.IC = IC;
  // rime crust along a surface edge: a lumpy band with blunt feathered lobes leaning into the wind. out: +1 grows on the
  // polyline's +normal side ([-dy, dx]), -1 on the other. d: crust depth.
  o.rime = (pts, d = 8, out = 1, x = {}) => {
    const C = spline(pts, Math.max(5, d * 1.5)), n = C.length, wind = E.norm(x.wind || [-1, -0.5]), inner = [], outer = [], ph = R() * 6;
    for (let i = 0; i < n; i++) {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], t = E.norm(sub(b, a)), nn = mul([-t[1], t[0]], out);
      const taper = Math.min(1, (i + 0.5) / 2, (n - 0.5 - i) / 2), lobe = (0.8 + 0.25 * Math.sin(i * 1.3 + ph) + R() * 0.2) * taper;
      inner.push(add(C[i], mul(nn, -d * 0.3)));
      outer.push(add(add(C[i], mul(nn, d * lobe)), mul(wind, d * 0.2 * lobe)));
    }
    f.part([...inner, ...outer.reverse()], IC(Object.assign({ k: 1 }, x.look || {})));
    const ot = outer.slice().reverse();
    f.line(inner.slice(1, -1), 1.2, P.frostD, { op: 0.5 });
    for (let i = 1; i < n - 1; i += 3) f.line([lerp(C[i], ot[i], 0.5), lerp(C[Math.min(n - 1, i + 1)], ot[Math.min(n - 1, i + 1)], 0.75)], 0.9, P.frostS, { op: 0.7 });
    for (let i = 2; i < n - 2; i += 4) f.flat(ell(lerp(C[i], ot[i], 0.4), 1.2 * sc + R(), 1 * sc + R() * 0.6, 0, 6), P.frostD, { op: 0.6 });
    return { inner, outer: ot };
  };
  // one icicle hanging plumb from p (screen space): irregular, ringed, dull, lit edge on +x, frozen drop at the tip
  o.icicle = (p, len, w) => {
    const segs = 5, L = [], Rr = [];
    for (let i = 0; i <= segs; i++) { const t = i / segs, ww = w / 2 * (1 - t) ** 0.85 * (i % 2 ? 0.82 : 1.06) * (i === 0 ? 1.15 : 1), jx = (R() - 0.5) * w * 0.12; L.push([p[0] - ww + jx, p[1] + len * t]); Rr.push([p[0] + ww + jx, p[1] + len * t]); }
    const tip = [p[0] + (R() - 0.5) * w * 0.2, p[1] + len + w * 0.15];
    f.part([...L, [...tip, 1], ...Rr.reverse()], IC({ fill: mix(P.frost, P.glaze, 0.4), shade: 0.4, inkW: 0.9, inkHeavy: 1.3, k: 0.7 }));
    f.line([[p[0] + w * 0.18, p[1] + 2], [p[0] + w * 0.08, p[1] + len * 0.7]], Math.max(0.8, w * 0.16), P.hoar, { op: 0.7 });
    if (len > 14) for (let i = 1; i < 3; i++) f.line([[p[0] - w * 0.3 * (1 - i / 3), p[1] + len * i / 3], [p[0] + w * 0.3 * (1 - i / 3), p[1] + len * i / 3 + 1]], 0.8, P.frostD, { op: 0.5 });
  };
  o.icicles = (pts, n, maxLen, w = 6) => {
    const C = spline(pts, 3), S = arcLen(C), Ltot = S[S.length - 1];
    for (let k = 0; k < n; k++) { const u = (k + 0.3 + R() * 0.4) / n * Ltot; let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; const L = maxLen * (0.3 + R() * 0.7) * (k % 3 === 1 ? 1 : 0.7); o.icicle(add(C[i], [0, -1]), L, w * (0.6 + L / maxLen * 0.6)); }
  };
  // frost packed into a hollow (an eye socket, a collarbone pit, under a jaw): a lumpy pale cake with facets and a dark rim
  o.hollow = (c, rx, ry, a0 = 0) => {
    const pts = ell(c, rx, ry, a0, 12).map(q => add(q, [(R() - 0.5) * rx * 0.25, (R() - 0.5) * ry * 0.25]));
    f.part(pts, IC({ shade: 0.4, inkW: 1, inkHeavy: 1.4, k: 0.8 }));
    f.line([add(c, [-rx * 0.5, -ry * 0.1]), add(c, [0, -ry * 0.35]), add(c, [rx * 0.45, -ry * 0.05])], 0.9, P.frostD, { op: 0.6, straight: true });
    f.line([add(c, [0, -ry * 0.35]), add(c, [rx * 0.1, ry * 0.4])], 0.8, P.frostD, { op: 0.5, straight: true });
    f.flat(ell(add(c, [rx * 0.25, -ry * 0.3]), rx * 0.25, ry * 0.18, 0, 6), P.hoar, { op: 0.7 });
  };
  // an empty eye socket: deep dark, frost caked along its lower rim and in the inner corner, never a white disc
  o.socket = (c, rx, ry, a0 = 0) => {
    // an empty socket under the brow: a flat-topped hollow of shadow, deepest under the brow ridge, ragged below; frost
    // rimes the brow above it, never the hollow (a pale crescent inside reads as an eye with a lid)
    const Fq = q => add(c, rot(q, a0));
    f.flat([Fq([-rx * 1.1, -ry * 0.5]), Fq([rx * 1.05, -ry * 0.65]), Fq([rx * 1.0, ry * 0.2]), Fq([rx * 0.4, ry * 0.85]), Fq([-rx * 0.3, ry * 0.7]), Fq([-rx * 0.95, ry * 0.3])], '#141413', { op: 0.9 });
    f.flat([Fq([-rx * 0.9, -ry * 0.45]), Fq([rx * 0.9, -ry * 0.6]), Fq([rx * 0.6, ry * 0.1]), Fq([-rx * 0.5, ry * 0.05])], '#000', { op: 0.55 });
    f.line([Fq([-rx * 1.1, -ry * 0.75]), Fq([0, -ry * 0.95]), Fq([rx * 1.05, -ry * 0.85])], Math.max(1.6, ry * 0.3), P.frost, { op: 0.75 });
  };
  // a thin frozen glaze over a surface (a face, a sore): translucent sheet, streaks, one crack
  o.glaze = (pts, op = 0.3) => {
    f.flat(pts, P.glaze, { op });
    const bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], w = bb[2] - bb[0], h = bb[3] - bb[1];
    for (let i = 0; i < 3; i++) { const q = add(c, [w * (0.05 + i * 0.12), -h * (0.3 - i * 0.18)]); f.line([q, add(q, [w * 0.1, h * 0.12])], 1.2, P.hoar, { op: 0.5 }); }
    f.line([add(c, [-w * 0.3, -h * 0.1]), add(c, [-w * 0.05, h * 0.02]), add(c, [0, h * 0.25]), add(c, [w * 0.15, h * 0.32])], 0.9, P.frostD, { op: 0.6, straight: true });
  };
  // hairline frost cracks with a pale lit lip
  o.cracks = (c, r, n, a0 = 0) => {
    for (let i = 0; i < n; i++) {
      const a = a0 + (R() - 0.5) * 2.4, p0 = add(c, [(R() - 0.5) * r, (R() - 0.5) * r]), p1 = add(p0, rot([r * (0.3 + R() * 0.4), 0], a)), p2 = add(p1, rot([r * (0.2 + R() * 0.3), 0], a + (R() - 0.5) * 1.2));
      f.line([p0, p1, p2], 1.1 * sc, '#1c1a1a', { op: 0.75, straight: true });
      f.line([add(p0, [1, -1]), add(p1, [1, -1])], 0.8, P.hoar, { op: 0.5, straight: true });
    }
  };
  // a scatter of hoar specks and small rime lumps over a surface
  o.frost = (c, rx, ry, n, r0 = 1.4) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]), r = r0 * (0.6 + R() * 0.9) * sc; f.flat(ell(p, r * 1.4, r, R() * 3, 6), P.hoar, { op: 0.85 }); f.flat(ell(add(p, [0, r * 0.5]), r * 1.2, r * 0.4, 0, 6), P.frostD, { op: 0.4 }); } };
  // breath frozen as it leaves the mouth, carrying spores: a loose cluster of cloudy puffs sinking a little, specked
  o.breath = (p, dir, len, w, spores = 8) => {
    const d = E.norm(dir), nn = [-d[1], d[0]], cc = add(p, add(mul(d, len * 0.62), mul(nn, -w * 0.15))), puffs = [];
    puffs.push([add(p, mul(d, w * 0.14)), w * 0.1], [add(p, add(mul(d, w * 0.36), mul(nn, -w * 0.05))), w * 0.15]);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + R() * 0.6, rr = 0.25 + R() * 0.45; puffs.push([add(cc, add(mul(d, Math.cos(a) * len * 0.34 * rr), mul(nn, Math.sin(a) * w * 0.32 * rr))), w * (0.16 + R() * 0.14)]); }
    puffs.push([cc, w * 0.24]);
    for (const [q, r] of puffs) {
      const pts = []; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = r * (0.8 + R() * 0.35); pts.push(add(q, [Math.cos(a) * rr * 1.15, Math.sin(a) * rr * 0.85])); }
      f.part(pts, IC({ fill: '#d6ddd4', inkW: 0.8, inkHeavy: 1, opacity: 0.55, k: 1, shade: 0.3 }));
    }
    for (let i = 0; i < spores; i++) { const q = add(cc, [(R() - 0.5) * len * 0.8, (R() - 0.5) * w * 0.7]); f.flat(ell(q, 1.6 * sc, 1.6 * sc, 0, 6), P.mouldD, { op: 0.8 }); f.flat(ell(add(q, [0.5, -0.5]), 0.7 * sc, 0.7 * sc, 0, 5), P.mouldW, { op: 0.8 }); }
    return cc;
  };
  return o;
}

// ---- toxin marks: mould, sores, buboes, fungal fur, fruiting bodies, spores (dry, furred, dull: never slime, never glow)
// mould bloom: an irregular furred patch with colony rings and a pale fuzzy rim. o.col: base, o.op
function mould(f, c, rx, ry, o = {}) {
  const pts = ell(c, rx, ry, o.ang || 0, 16).map((p, i) => add(p, [(f.r() - 0.5) * rx * 0.35, (f.r() - 0.5) * ry * 0.35]));
  f.part(pts, { fill: o.col || P.mould, shadow: P.mouldD, shade: 0.35, tex: 'mfur' + f.o.seed, texOp: 0.95, inkW: o.ink ?? 0.9, inkHeavy: o.ink === 0 ? 0 : 1.2, cast: false, k: 0.8, hatch: false, opacity: o.op ?? 0.88 });
  // colonies: soft paler blotches with a broken fuzzy edge and dark seed specks (never closed rings with a dot: they read as eyes)
  const nr = o.rings ?? Math.max(1, Math.round((rx + ry) / 14));
  for (let i = 0; i < nr; i++) { const q = scatter(f, c, rx * 0.5, ry * 0.5), r = Math.min(rx, ry) * (0.25 + f.r() * 0.25); f.flat(ell(q, r, r * 0.75, f.r() * 3, 9).map(p => add(p, [(f.r() - 0.5) * r * 0.4, (f.r() - 0.5) * r * 0.4])), P.mouldL, { op: 0.45 }); for (let k = 0; k < 3; k++) f.flat(ell(scatter(f, q, r * 0.7, r * 0.6), 0.9, 0.9, 0, 5), P.mouldD, { op: 0.8 }); }
  // pale fuzz at the rim, short hairs leaning outward
  for (let i = 0; i < Math.round((rx + ry) * 0.22); i++) { const t = f.r() * Math.PI * 2, q = add(c, rot([Math.cos(t) * rx * 0.85, Math.sin(t) * ry * 0.85], o.ang || 0)), d = E.norm(sub(q, c)); f.line([q, add(q, mul(d, 1.5 + f.r() * 2.5))], 0.7, P.mouldW, { op: 0.5 }); }
}
// fungal fur along an edge: fine pale hyphae standing off a surface. pts: the surface line; out: +1/-1 normal side
function fungalFur(f, pts, len, out = 1, o = {}) {
  const C = spline(pts, 2.5);
  for (let i = 1; i < C.length - 1; i++) { if (f.r() < (o.gaps ?? 0.25)) continue; const d = E.norm(sub(C[i + 1], C[i - 1])), nn = mul([-d[1], d[0]], out), l = len * (0.4 + f.r() * 0.8), a = (f.r() - 0.5) * 0.7; f.line([C[i], add(C[i], mul(rot(nn, a), l * 0.5)), add(C[i], mul(rot(nn, a * 1.6), l))], 0.7 + f.r() * 0.5, f.r() > 0.35 ? (o.col || P.mouldW) : P.mouldL, { op: 0.75 }); }
}
// an open plague sore: irregular crater, dark core, pale raised rim, crust, a frost skin on the upper lip
function sore(f, c, r, o = {}) {
  // an open plague sore: an elongated, crusted split in the skin, never round (a round pit with a dark core reads as an eye)
  const a0 = o.ang ?? (f.r() - 0.5) * 1.2, F = frame(c, a0, r);
  const outer = F([[-1.5, 0.1], [-0.9, -0.45], [-0.2, -0.6], [0.6, -0.5], [1.4, -0.2], [1.6, 0.2], [0.8, 0.55], [0.0, 0.6], [-0.9, 0.5]]).map(q => add(q, [(f.r() - 0.5) * r * 0.25, (f.r() - 0.5) * r * 0.25]));
  f.part(outer, { fill: mix(P.bruise, P.skin, 0.3), shadow: P.bruiseD, shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false, k: 0.8 });
  f.flat(F([[-1.1, 0.05], [-0.4, -0.18], [0.5, -0.14], [1.2, 0.05], [0.5, 0.2], [-0.4, 0.22]]), P.bruiseD, { op: 0.95 });
  f.flat(F([[-0.5, 0.02], [0.3, -0.04], [0.7, 0.06], [0.1, 0.12]]), P.pus, { op: 0.7 });
  f.line(F([[-1.3, -0.2], [-0.4, -0.5], [0.6, -0.45], [1.3, -0.15]]), 1, P.hoar, { op: 0.5 });
  if (o.crust !== false) for (let i = 0; i < 3; i++) f.flat(F([[-1.2 + i * 1.1, 0.25], [-0.9 + i * 1.1, 0.2], [-0.8 + i * 1.1, 0.45], [-1.1 + i * 1.1, 0.5]]), P.mouldY, { op: 0.75 });
}
// a plague bubo: a swollen gland that sags toward the ground, bruised, tight-shined, cracked, filmed with frost
function bubo(f, c, r, o = {}) {
  const sag = o.sag ?? 0.35, j = () => (f.r() - 0.5) * r * 0.12;
  const pts = [[c[0] - r * 0.6 + j(), c[1] - r * 0.55], [c[0] + j(), c[1] - r * 0.8], [c[0] + r * 0.7 + j(), c[1] - r * 0.45], [c[0] + r * 0.95, c[1] + r * 0.15], [c[0] + r * 0.6, c[1] + r * (0.75 + sag)], [c[0] - r * 0.05, c[1] + r * (0.95 + sag)], [c[0] - r * 0.75, c[1] + r * (0.6 + sag * 0.7)], [c[0] - r * 0.95, c[1] + r * 0.05]];
  f.part(pts, { fill: mix(P.bruise, P.skin, o.mixSkin ?? 0.35), shadow: P.bruiseD, shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: 1.3, inkHeavy: 2, k: 1, cast: o.cast ?? true });
  f.flat(ell(add(c, [r * 0.35, -r * 0.35]), r * 0.28, r * 0.16, -0.6, 8), P.hoar, { op: 0.55 }); // tight shine toward the key light
  for (let i = 0; i < 4; i++) { const a = -2.6 + i * 0.6 + (f.r() - 0.5) * 0.3, p0 = add(c, rot([r * 0.9, 0], a)); f.line([p0, add(p0, rot([r * 0.35, 2], a)), add(p0, rot([r * 0.6, -2], a))], 1, P.bruiseD, { op: 0.55 }); } // veins dragged round it
  if (o.burst !== false) { const q = add(c, [-r * 0.1, r * (0.45 + sag * 0.6)]); f.flat([add(q, [-r * 0.28, 0]), add(q, [0, -r * 0.1]), add(q, [r * 0.26, r * 0.04]), add(q, [0, r * 0.12])], P.bruiseD, { op: 0.95 }); f.flat(ell(add(q, [0, r * 0.08]), r * 0.12, r * 0.07, 0, 6), P.pus, { op: 0.85 }); }
  f.line(ell(c, r * 0.85, r * 0.7, 0, 14).slice(9, 14), 1.2, P.hoar, { op: 0.45 }); // frost film on the top
}
// pustules: small raised blisters, bone-yellow cores, a rime cap
function pustules(f, c, rx, ry, n, r0, r1) {
  const L = []; for (let i = 0; i < n; i++) L.push([scatter(f, c, rx, ry), rnd(f, r0, r1)]);
  L.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => {
    f.part(ell(p, r, r * 0.85, 0, 10), { fill: mix(P.pus, P.bruise, 0.35), shadow: P.bruiseD, shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
    f.flat(ell(add(p, [r * 0.25, -r * 0.3]), r * 0.3, r * 0.2, 0, 6), P.hoar, { op: 0.7 });
  });
}
// a grave cap: thin pale stem, a tall bell cap of grey-bone with a ragged inked hem. b base, a0 growth angle, s height
function graveCap(f, b, a0, s, o = {}) {
  const d = rot([1, 0], a0), n = [-d[1], d[0]], top = add(b, mul(d, s * 0.75));
  f.part(limb(b, top, s * 0.12, s * 0.09, { steps: 5, capK: 0.6, p: [[0.3, 0.15, 0.25]] }), { fill: P.bone, shadow: P.boneS, shade: 0.45, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false });
  const cw = s * (o.w ?? 0.3), ch = s * (o.h ?? 0.55), cb = add(b, mul(d, s * 0.55));
  const cap = [add(cb, mul(n, cw)), add(add(cb, mul(n, cw * 0.9)), mul(d, ch * 0.45)), add(add(cb, mul(n, cw * 0.5)), mul(d, ch * 0.85)), add(cb, mul(d, ch)), add(add(cb, mul(n, -cw * 0.5)), mul(d, ch * 0.85)), add(add(cb, mul(n, -cw * 0.9)), mul(d, ch * 0.45)), add(cb, mul(n, -cw))];
  f.part(cap, { fill: o.col || mix(P.boneD, P.grey, 0.4), shadow: P.boneS, shade: 0.45, inkW: 1, inkHeavy: 1.6, cast: false, k: 0.9, hatch: false });
  for (let i = -2; i <= 2; i++) f.line([add(add(cb, mul(n, i * cw * 0.3)), mul(d, ch * 0.08)), add(add(cb, mul(n, i * cw * 0.22)), mul(d, ch * 0.6))], 0.8, INK, { op: 0.4 });
  f.stroke([add(cb, mul(n, cw)), add(add(cb, mul(n, cw * 0.3)), mul(d, -s * 0.02)), add(cb, mul(n, -cw))], Math.max(1.5, s * 0.05), P.black, { op: 0.75 }); // the inked, curling hem
  f.line([add(add(cb, mul(n, cw * 0.7)), mul(d, ch * 0.4)), add(add(cb, mul(n, cw * 0.3)), mul(d, ch * 0.8))], 1, P.hoar, { op: 0.55 });
}
function graveCaps(f, b, a0, s, n, o = {}) {
  const L = []; for (let i = 0; i < n; i++) L.push([add(b, rot([(f.r() - 0.5) * s * 0.3, (f.r() - 0.5) * s * 0.6], a0)), a0 + (i - (n - 1) / 2) * 0.32 + (f.r() - 0.5) * 0.2, s * (0.55 + f.r() * 0.5)]);
  L.sort((a, c) => a[2] - c[2]).forEach(([p, a, ss]) => graveCap(f, p, a, ss, o));
}
// shag: a fringe of thin hanging mould filaments along an edge (each hangs plumb with a little sway); dense, uneven,
// darker at the root. pts: the edge (screen space), len: typical length, o.pal colours, o.step spacing in px
function shag(f, pts, len, o = {}) {
  const C = spline(pts, o.step || 4), pal = o.pal || [P.mouldD, P.mould, P.mouldL, P.frostS, '#4e5446'];
  const L = C.map((q, i) => [q, len * (0.35 + f.r() * 0.9) * (i % 5 === 2 ? 1.35 : 1)]);
  for (const [q, l] of L) f.line([q, add(q, [(f.r() - 0.5) * 3, l * 0.6])], 4.5, '#141810', { op: 0.55 }); // the matted root mass
  for (const [q, l] of L) for (let k = 0; k < (o.n || 2); k++) { const sw = (f.r() - 0.5) * (o.sway ?? 6), q0 = add(q, [(f.r() - 0.5) * 4, -2]); f.line([q0, add(q0, [sw * 0.4, l * 0.5]), add(q0, [sw, l * (0.85 + f.r() * 0.3)])], 0.8 + f.r() * 1.3, pal[Math.floor(f.r() * pal.length)], { op: 0.9 }); }
  if (o.ice) for (let i = 0; i < L.length; i += 7) { const [q, l] = L[i]; f.flat(ell(add(q, [0, l * 0.9]), 1.8, 2.6, 0, 6), P.hoar, { op: 0.8 }); }
}
// bristles: stiff fur standing off an edge along a direction (hackles, a ruff): thin strands over a dark root mass
function bristles(f, pts, len, dir, o = {}) {
  const C = spline(pts, o.step || 3.5), pal = o.pal || [P.furD, P.fur, P.furL, P.grey], d0 = E.norm(dir);
  C.forEach((q, i) => { const l = len * (0.5 + f.r() * 0.7) * (o.taper ? o.taper(i / (C.length - 1)) : 1); f.line([q, add(q, mul(d0, l * 0.6))], 4, '#161412', { op: 0.5 }); for (let k = 0; k < (o.n || 2); k++) { const d = rot(d0, (f.r() - 0.5) * 0.5), q0 = add(q, [(f.r() - 0.5) * 3, (f.r() - 0.5) * 3]); f.line([q0, add(add(q0, mul(d, l * 0.5)), mul([-d[1], d[0]], (f.r() - 0.5) * 3)), add(q0, mul(d, l))], 0.8 + f.r() * 1.3, pal[Math.floor(f.r() * pal.length)], { op: 0.92 }); } });
  if (o.ice) for (let i = 2; i < C.length; i += 6) f.flat(ell(add(C[i], mul(d0, len * 0.8)), 1.8, 1.8, 0, 6), P.hoar, { op: 0.85 });
}
// spores drifting: specks with a pale fleck, sinking in the cold
function spores(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const q = scatter(f, c, rx, ry), r = (0.9 + f.r() * 1.6) * s; f.flat(ell(q, r, r, 0, 6), f.r() > 0.4 ? P.mouldD : P.mouldY, { op: 0.75 }); f.flat(ell(add(q, [r * 0.3, -r * 0.3]), r * 0.4, r * 0.4, 0, 5), P.mouldW, { op: 0.7 }); } }
// peeling grey skin flakes with a lit lip
function peel(f, c, n, s = 1, spread = 22) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * spread, (f.r() - 0.5) * spread * 0.8]); f.flat([p, add(p, [7 * s, -2 * s]), add(p, [9 * s, 3 * s]), add(p, [3 * s, 4 * s])], P.skinL, { op: 0.85 }); f.line([p, add(p, [7 * s, -2 * s])], 0.8, INK, { op: 0.6 }); } }
// grave-dirt mottling and grey-green blotches on dead skin
function livid(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry); f.flat(ell(p, (3 + f.r() * 7) * s, (2 + f.r() * 4) * s, f.r() * 3, 8), f.r() > 0.5 ? P.bruise : P.mouldD, { op: 0.32 }); } }
function veins(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry); f.line([p, add(p, [(3 + f.r() * 6) * s, (5 + f.r() * 5) * s]), add(p, [f.r() * 12 * s, (12 + f.r() * 8) * s])], 0.9 + s * 0.2, '#4a4e48', { op: 0.55 }); } }

// B.head tints the nose and ear warm (fine for living skin); the barrow allows no warm colour, so lay the dead skin's
// own grey back over them. hF: the head frame, nz: the nose size passed to B.head.
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
    if (o.stain && f.r() < o.stain) f.flat(ell(add(c, mul(nn, (f.r() - 0.5) * w)), w * 0.35, L2 * 0.6, ang(a, b), 8), o.stainCol || P.mouldD, { op: 0.35 });
  }
}

module.exports = {
  shag, bristles, greyFace, P, base, rnd, scatter, ang, elb, SK, textures, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, mlimb, humanJoints, rope,
  softTone, stains, crease, creaseField, offsetLine, hairClump, fullLeg, prune, openHand, tableHand, link, ironChain, fx,
  mould, fungalFur, sore, bubo, pustules, graveCap, graveCaps, spores, peel, livid, veins, wraps, split, side,
};
