// World XII, The White Silence (Frost + Void, absolute zero): local helpers. Shared files stay frozen; everything new
// lives here. Geometry and anatomy helpers are copied from reviewed kits (kit_VII: space/fx/rime/icicles/jointLimb/
// openHand/muscleBody; kit_IX: hairClump/crease/softTone) so this world does not depend on their files.
//
// Frost (dominant) stills and whitens: lumpy rime on the windward faces, icicles hanging plumb, faceted planes, things
// stopped mid-gesture. Never clean crystals or snowflakes: all ice here is dull, lumpy, rough.
// Void unmakes: holes with clean round rims (never ragged), pieces taken away (faces, shadows, sound), eyes. Never purple
// sparkles or galaxies, and in this world never any colour at all: the void is flat black, its rims are clean pale lines.
// Palette: almost pure white, a black sun, ink black and grey. Nothing else (bone allowed, as for every world).
// Windward = the heroes' side = drawing +x (foes are drawn facing right, then mirrored). Key light: foeBase, upper right
// in drawing space, upper left in the game.
// No ground shadows anywhere: the void has taken the shadows. The only shadow in the world is the Rime Shade.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { split, side } = require('../dirAC');

const PAL = {
  white: '#f3f4f3', snow: '#eceeee', snowS: '#b9bec4', snowD: '#8f969e',
  fur: '#e7e8e5', furS: '#8d9298', furD: '#5d6268', furL: '#fbfbfa',
  hide: '#dcdcd6', hideS: '#80848a', hideD: '#56595e',
  ice: '#e4e8ea', iceS: '#939aa2', iceD: '#646b73', rime: '#f0f2f2', glaze: '#d6dde2',
  skin: '#dcdedf', skinS: '#7c7f88', bite: '#9a9ca6', biteD: '#4a4c56',
  bone: '#ddd8cb', boneS: '#8c887e', boneD: '#5e5b54',
  grey: '#8a8c8e', greyD: '#4a4c50', iron: '#55585c', ironD: '#33353a', wood: '#7a7a76', woodD: '#4a4a48',
  void: '#040405', voidRim: '#f6f7f7',
};
const WORLD = { shadowTint: '#2a2c33', keyTint: '#ffffff', mud: '#d4d8dc' }; // the grime rising up the legs is caked snow
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({}, WORLD, { groundY: h - 30, grimeY: h - 30 - 170 }, o));

const rnd = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));

// ---- authoring space (copied from kit_VII): author in human space (ground 790, a 1.0 human ~640 tall, centred near
// x 300) and map onto the tier canvas at the creature's true scale k.
function space(k, X0, GY, cx = 300) {
  const Z = p => { const q = [X0 + (p[0] - cx) * k, GY - (790 - p[1]) * k]; return p[2] ? [q[0], q[1], 1] : q; };
  return { k, Z, ZZ: pts => pts.map(Z), W: w => w * k };
}

// ---- geometry (copied from kit_VII / kit_I_c)
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
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], q[2] || 0]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
function ribbon(C, W, o = {}) {
  const P = [], Q = [], n = C.length;
  C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)), m = [-d[1], d[0]]; P.push(add(c, mul(m, W[i] / 2 * (o.p ? o.p(i / (n - 1)) : 1)))); Q.push(add(c, mul(m, -W[i] / 2 * (o.q ? o.q(i / (n - 1)) : 1)))); });
  return [...P, ...Q.reverse()];
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
const jcut = (A, J, Bp, r) => [side(J, mul(E.norm(sub(J, A)), -1), r), side(J, E.norm(sub(Bp, J)), r)];
function creases(f, c, a0, len, n, col, op = 0.55) {
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * len * 0.22, a = a0 + (f.r() - 0.5) * 0.3, p = add(c, rot([0, o], a0)); f.line([add(p, rot([-len / 2, 0], a)), add(p, rot([0, len * 0.06], a)), add(p, rot([len / 2, 0], a))], 1, col, { op: op * (0.6 + f.r() * 0.4) }); }
}
// knuckle heads, finger-joint creases and a thumbnail on a B.grip fist
function fistDetail(f, g, s, col, o = {}) {
  const F = g.F, dk = mix(col, '#1a1020', 0.5), lt = mix(col, '#ffffff', 0.4);
  for (let i = 0; i < 4; i++) { const y = -0.45 + i * 0.3; f.flat(F(ell([0.34, y], 0.1, 0.11, 0, 8)), lt, { op: 0.45 }); f.line(F([[0.28, y + 0.1], [0.4, y + 0.12]]), 0.9, dk, { op: 0.6 }); }
  for (let i = 0; i < 4; i++) { const y = -0.5 + i * 0.3; f.line(F([[0.5, y + 0.06], [0.56, y + 0.12], [0.54, y + 0.2]]), 0.9, dk, { op: 0.55 }); }
  f.part(F([[0.38, -0.82], [0.56, -0.8], [0.6, -0.68], [0.44, -0.66]]), { fill: o.nail || mix(col, '#d8d4dc', 0.5), shade: 0.3, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
  if (o.wrinkle !== false) for (let i = 0; i < 3; i++) f.line(F([[-0.6 + i * 0.12, -0.3], [-0.55 + i * 0.12, 0.3]]), 0.8, dk, { op: 0.4 });
}
function tube(pts, ws, capK = 0.9) {
  const o = K.chain(pts, ws, { steps: 6 }), n = o.length / 2, P = o.slice(0, n), Q = o.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = ws[ws.length - 1] / 2, cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(b, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * capK)))); }
  return [...P, ...cap, ...Q];
}
// open hand with jointed fingers, knuckle creases and nails (copied from kit_VII): c wrist, ang wrist->middle knuckle,
// s hand length; o.flip thumb on the other side; o.back shows the back of the hand; o.curl 0..1; o.curls per finger.
function openHand(f, c, a0, s, look, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(c, a0, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg]));
  const sp = o.spread ?? 0.14, cu = o.curl ?? 0.2, sw = 1 + (o.swell ?? 0.1), back = !!o.back;
  const sh = look.shadow || mix(look.fill, '#000', 0.4), dk = mix(sh, '#000', 0.3), lt = mix(look.fill, '#fff', 0.45);
  const part = (q, st) => f.part(q, Object.assign({}, look, { cast: false, hatch: false }, st || {}));
  const FG = [[0.405, -0.17, 0.4, 0.088], [0.45, -0.062, 0.5, 0.097], [0.465, 0.048, 0.545, 0.1], [0.44, 0.158, 0.49, 0.097]];
  const fing = FG.map(([u, v, L, w], i) => {
    const a = (i - 1.9) * sp + (o.bend || [0, 0, 0, 0])[i], d = [Math.cos(a), Math.sin(a)], cc = (o.curls || [])[i] ?? cu;
    const k0 = [u, v], k1 = add(k0, mul(d, L * 0.46)), d2 = rot(d, cc * 0.9 * sg), k2 = add(k1, mul(d2, L * 0.3 * (1 - cc * 0.45))), d3 = rot(d2, cc * 0.9 * sg), k3 = add(k2, mul(d3, L * 0.24 * (1 - cc * 0.62)));
    return { k0: F([k0])[0], k1: F([k1])[0], k2: F([k2])[0], k3: F([k3])[0], kb: F([add(k0, mul(d, -0.05))])[0], W: w * sw * s };
  });
  const thB = [0.07, 0.19], ta = o.thumbAng ?? 0.9, td = [Math.cos(ta), Math.sin(ta)], th1 = add(thB, mul(td, 0.24)), td2 = [Math.cos(ta - 0.25), Math.sin(ta - 0.25)], th2 = add(th1, mul(td2, 0.2 * (1 - cu * 0.3)));
  const nail = (a, b, w) => { f.part([lp(a, b, 0.35, w * 0.3), lp(a, b, 0.9, w * 0.32), lp(a, b, 1.04, 0), lp(a, b, 0.9, -w * 0.32), lp(a, b, 0.35, -w * 0.28)], { fill: o.nail || mix(look.fill, '#d8dce0', 0.4), shadow: sh, shade: 0.4, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false }); f.line([lp(a, b, 0.92, w * 0.05), lp(a, b, 0.7, w * 0.1)], 0.8, INK, { op: 0.6 }); };
  const thumb = () => { part(tube([F([add(thB, mul(td, -0.06))])[0], F([th1])[0], F([th2])[0]], [0.15 * sw * s, 0.125 * sw * s, 0.105 * sw * s]), { inkW: 1.3, inkHeavy: 2 }); const a = F([th1])[0], b = F([th2])[0]; f.line([lp(a, b, -0.04, 0.06 * s), lp(a, b, 0.02, 0), lp(a, b, -0.04, -0.06 * s)], 1.2, dk, { op: 0.7 }); if (back) nail(a, b, 0.11 * sw * s); };
  const finger = g => {
    const ws = [g.W, g.W * 0.94, g.W * 0.86, g.W * 0.78];
    part(tube([g.kb, g.k1, g.k2, g.k3], ws), { inkW: 1.3, inkHeavy: 2 });
    for (const [k, w, pa, pb] of [[g.k1, ws[1], g.k0, g.k2], [g.k2, ws[2], g.k1, g.k3]]) {
      const dd = E.norm(sub(pb, pa)), nn = [-dd[1], dd[0]];
      if (back) { for (let i = 0; i < 3; i++) { const c0 = add(k, mul(dd, (i - 1) * w * 0.15)); f.line([add(c0, mul(nn, -w * 0.34)), add(c0, mul(dd, -w * 0.09)), add(c0, mul(nn, w * 0.34))], i === 1 ? 1.2 : 0.9, INK, { op: 0.5 }); } f.flat(ell(k, w * 0.2, w * 0.14, Math.atan2(dd[1], dd[0]), 8), lt, { op: 0.3 }); }
      else for (const off of [-0.05, 0.05]) f.line([add(add(k, mul(dd, off * w)), mul(nn, w * 0.42)), add(k, mul(dd, off * w + 1)), add(add(k, mul(dd, off * w)), mul(nn, -w * 0.42))], off < 0 ? 1.4 : 1, dk, { op: 0.75 });
    }
    if (back) nail(g.k2, g.k3, ws[3]);
  };
  const palm = F([[-0.06, -0.15], [0.06, -0.2], [0.24, -0.215], [0.4, -0.22], [0.47, -0.13], [0.49, 0.0], [0.48, 0.12], [0.45, 0.21], [0.3, 0.24], [0.16, 0.26], [0.04, 0.23], [-0.06, 0.12]]);
  if (back) { thumb(); part(palm, { inkW: 1.5, inkHeavy: 2.4 }); fing.forEach(finger); fing.forEach(g => { f.flat(ell(g.k0, g.W * 0.34, g.W * 0.24, a0, 10), lt, { op: 0.35 }); f.line([lp(g.k0, g.k1, 0.05, g.W * 0.5), lp(g.k0, g.k1, -0.02, 0), lp(g.k0, g.k1, 0.05, -g.W * 0.5)], 1.1, dk, { op: 0.6 }); f.line([F([[0.04, 0]])[0], g.k0], 1, dk, { op: 0.35 }); }); }
  else { fing.forEach(finger); part(palm, { inkW: 1.5, inkHeavy: 2.4 }); part(F([[0.0, 0.04], [0.12, 0.02], [0.24, 0.12], [0.22, 0.24], [0.08, 0.26], [-0.04, 0.16]]), { inkW: 1, inkHeavy: 1.2, maxShade: 10 }); f.line(F([[0.36, -0.2], [0.33, -0.08], [0.36, 0.04], [0.42, 0.13]]), 1.6, dk, { op: 0.75 }); f.line(F([[0.3, 0.19], [0.18, 0.12], [0.06, 0.1], [0.0, 0.04]]), 1.5, dk, { op: 0.7 }); thumb(); }
  return { fing, F, thumbTip: F([th2])[0] };
}
function mlimb(a, b, P, Q, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  const sd = (arr, sg) => arr.map(([t, w, sh]) => { const q = add(lerp(a, b, t), mul(n, sg * w)); return sh ? [...q, 1] : q; });
  const pp = sd(P, 1), qq = sd(Q, -1), ck = o.capK ?? 0.75, out = [...pp];
  const wpB = P[P.length - 1][1], wqB = Q[Q.length - 1][1], cB = lerp(lerp(a, b, P[P.length - 1][0]), lerp(a, b, Q[Q.length - 1][0]), 0.5);
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(cB, add(mul(n, Math.cos(an) * w), mul(d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...qq.reverse());
  const wpA = P[0][1], wqA = Q[0][1], cA = lerp(lerp(a, b, P[0][0]), lerp(a, b, Q[0][0]), 0.5);
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
// a twisted cord along a polyline (dark core, lay lines), frozen stiff
function rope(f, pts, w, col = PAL.hide, o = {}) {
  const C = spline(pts, 3);
  f.line(C, w + 2, INK, { op: 0.9 }); f.line(C, w, col);
  if (o.lay !== false) for (let i = 1; i < C.length - 1; i += 2) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, w * 0.45)), add(add(C[i], mul(d, w * 0.5)), mul(n, -w * 0.45))], 0.8, mix(col, '#000', 0.5), { op: 0.7, straight: true }); }
  return C;
}
function offsetLine(pts, off) {
  const n = pts.length;
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)); return add(p, mul([-d[1], d[0]], off(i / (n - 1)))); });
}
// a skin crease: dark tapered valley with a thin lit lip on the wall that faces the key light (kit_IX)
function crease(f, pts, w, o = {}) {
  const L = f.L, off = mul([-L[0], -L[1]], o.lip ?? Math.max(1.5, w * 0.7));
  f.stroke(pts, w, o.col || '#1e1e22', { op: o.op ?? 0.7 });
  if (o.light !== false && pts.length > 2) f.line(pts.slice(1, -1).map(q => add(q, off)), Math.max(0.8, w * 0.32), o.lit || '#ffffff', { op: o.litOp ?? 0.6 });
}
// soft blurred tone patches clipped to a shape (form shading inside large masses)
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
// a muscular body along a centreline: the outside of every bend bulges, the inside pinches (copied from kit_VII)
function muscleBody(C, W, o = {}) {
  const n = C.length, T = C.map((_, i) => E.norm(sub(C[Math.min(n - 1, i + 1)], C[Math.max(0, i - 1)]))), Nn = T.map(t => [-t[1], t[0]]);
  const k = 3, bend = C.map((_, i) => { const a = T[Math.max(0, i - k)], b = T[Math.min(n - 1, i + k)], d = sub(b, a); return (d[0] * Nn[i][0] + d[1] * Nn[i][1]); });
  const bs = bend.map((_, i) => { let s = 0, c = 0; for (let j = -3; j <= 3; j++) { s += bend[Math.max(0, Math.min(n - 1, i + j))]; c++; } return s / c; });
  const bulge = o.bulge ?? 0.35, pinch = o.pinch ?? 0.18, g = o.gain ?? 2.5;
  for (let i = 0; i < n; i++) bs[i] = Math.max(-1, Math.min(1, bs[i] * g));
  const wp = W.map((w, i) => w / 2 * (1 - (bs[i] > 0 ? pinch : -bulge) * Math.abs(bs[i])));
  const wq = W.map((w, i) => w / 2 * (1 + (bs[i] > 0 ? bulge : -pinch) * Math.abs(bs[i])));
  const P = C.map((c, i) => add(c, mul(Nn[i], wp[i]))), Q = C.map((c, i) => add(c, mul(Nn[i], -wq[i])));
  return { outline: [...P, ...Q.slice().reverse()], P, Q, T, Nn, n };
}

const inPoly = (q, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
// ---- figure-bound frost, fur and void marks (seeded by the figure so renders repeat)
function fx(f, sc = 1) {
  const R = () => f.r(), s = f.o.seed, o = {};
  f.defs.push(`<filter id="hoarf${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${s + 41}"/><feColorMatrix values="0 0 0 0 0.97  0 0 0 0 0.98  0 0 0 0 0.98  0 0 0 9 -5.6"/></filter><pattern id="hoar${s}" patternUnits="userSpaceOnUse" width="300" height="300"><rect width="300" height="300" filter="url(#hoarf${s})"/></pattern>`);
  f.defs.push(`<filter id="icef${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="${s + 47}"/><feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.39  0 0 0 0 0.43  0 0 0 -2.2 1.15"/></filter><pattern id="icetex${s}" patternUnits="userSpaceOnUse" width="400" height="400"><rect width="400" height="400" filter="url(#icef${s})"/></pattern>`);
  // hair texture: fine directional strands (rotated per use with o.hairTex(angleDeg))
  o.hoar = 'hoar' + s; o.icetex = 'icetex' + s;
  const hairTexCache = {};
  o.hairTex = (a = 90) => { const k = 'ht' + s + '_' + Math.round(a); if (!hairTexCache[k]) { hairTexCache[k] = 1; f.defs.push(`<pattern id="${k}" patternUnits="userSpaceOnUse" width="9" height="40" patternTransform="rotate(${a - 90})"><path d="M2,0 q1.5,20 0,40 M6.5,6 q-1,14 0.5,30" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.55"/></pattern>`); } return k; };
  const IC = (x = {}) => Object.assign({ fill: PAL.rime, shadow: PAL.iceS, shade: 0.3, tex: o.icetex, texOp: 0.45, inkW: 1.1, inkHeavy: 1.8, cast: false, hatch: false, grime: false }, x);
  o.IC = IC;
  // rime crust along a surface edge: lumpy blunt lobes leaning windward (+x, up), seated with a shadow line
  o.rime = (pts, d = 8, out = 1, x = {}) => {
    const C = spline(pts, Math.max(5, d * 1.5)), n = C.length, wind = E.norm(x.wind || [1, -0.5]), inner = [], outer = [], ph = R() * 6;
    for (let i = 0; i < n; i++) {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], t = E.norm(sub(b, a)), nn = mul([-t[1], t[0]], out);
      const taper = Math.min(1, (i + 0.5) / 2, (n - 0.5 - i) / 2), lobe = (0.8 + 0.25 * Math.sin(i * 1.3 + ph) + R() * 0.2) * taper;
      inner.push(add(C[i], mul(nn, -d * 0.3)));
      outer.push(add(add(C[i], mul(nn, d * lobe)), mul(wind, d * 0.2 * lobe)));
    }
    f.part([...inner, ...outer.reverse()], IC(Object.assign({ k: 1 }, x.look || {})));
    const ot = outer.slice().reverse();
    f.line(inner.slice(1, -1), 1.3, PAL.iceD, { op: 0.55 });
    for (let i = 1; i < n - 1; i += 3) f.line([lerp(C[i], ot[i], 0.5), lerp(C[Math.min(n - 1, i + 1)], ot[Math.min(n - 1, i + 1)], 0.75)], 0.9, PAL.iceS, { op: 0.7 });
    for (let i = 2; i < n - 2; i += 4) f.flat(ell(lerp(C[i], ot[i], 0.4), 1.2 * sc + R(), 1 * sc + R() * 0.6, 0, 6), PAL.iceD, { op: 0.6 });
    return { inner, outer: ot };
  };
  // one icicle hanging plumb from p (screen space): irregular, ringed, dull, a lit edge, a frozen drop at the tip
  o.icicle = (p, len, w, x = {}) => {
    const segs = 5, L = [], Rr = [];
    for (let i = 0; i <= segs; i++) { const t = i / segs, ww = w / 2 * (1 - t) ** 0.85 * (i % 2 ? 0.82 : 1.06) * (i === 0 ? 1.15 : 1), jx = (R() - 0.5) * w * 0.12; L.push([p[0] - ww + jx, p[1] + len * t]); Rr.push([p[0] + ww + jx, p[1] + len * t]); }
    const tip = [p[0] + (R() - 0.5) * w * 0.2, p[1] + len + w * 0.15];
    f.part([...L, [...tip, 1], ...Rr.reverse()], IC(Object.assign({ fill: x.fill || mix(PAL.rime, PAL.glaze, 0.4), shadow: x.shadow || PAL.iceS, shade: 0.4, inkW: 0.9, inkHeavy: 1.3, k: 0.7 })));
    f.line([[p[0] + w * 0.18, p[1] + 2], [p[0] + w * 0.08, p[1] + len * 0.7]], Math.max(0.8, w * 0.16), '#ffffff', { op: 0.8 });
    if (len > 14) for (let i = 1; i < 3; i++) f.line([[p[0] - w * 0.3 * (1 - i / 3), p[1] + len * i / 3], [p[0] + w * 0.3 * (1 - i / 3), p[1] + len * i / 3 + 1]], 0.8, PAL.iceD, { op: 0.5 });
  };
  o.icicles = (pts, n, maxLen, w = 6, x = {}) => {
    const C = spline(pts, 3), S = arcLen(C), Ltot = S[S.length - 1];
    for (let k = 0; k < n; k++) { const u = (k + 0.3 + R() * 0.4) / n * Ltot; let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; const L = maxLen * (0.3 + R() * 0.7) * (k % 3 === 1 ? 1 : 0.7); o.icicle(add(C[i], [0, -1]), L, w * (0.6 + L / maxLen * 0.6), x); }
  };
  o.frost = (c, rx, ry, n, r0 = 1.4) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]), r = r0 * (0.6 + R() * 0.9) * sc; f.flat(ell(p, r * 1.4, r, R() * 3, 6), '#ffffff', { op: 0.9 }); f.flat(ell(add(p, [0, r * 0.5]), r * 1.2, r * 0.4, 0, 6), PAL.iceD, { op: 0.45 }); } };
  o.cracks = (c, r, n, a0 = 0) => {
    for (let i = 0; i < n; i++) {
      const a = a0 + (R() - 0.5) * 2.4, p0 = add(c, [(R() - 0.5) * r, (R() - 0.5) * r]), p1 = add(p0, rot([r * (0.3 + R() * 0.4), 0], a)), p2 = add(p1, rot([r * (0.2 + R() * 0.3), 0], a + (R() - 0.5) * 1.2));
      f.line([p0, p1, p2], 1.1 * sc, '#1c1c22', { op: 0.75, straight: true });
      f.line([add(p0, [1, -1]), add(p1, [1, -1])], 0.8, '#ffffff', { op: 0.6, straight: true });
      if (R() > 0.4) f.line([p1, add(p1, rot([r * 0.2, 0], a + 1))], 0.8 * sc, '#1c1c22', { op: 0.6, straight: true });
    }
  };
  // frost-bitten skin: grey blotches darkening toward the extremity
  o.bite = (c, rx, ry, n, dark = 0.3) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.flat(ell(p, (3 + R() * 6) * sc, (2 + R() * 4) * sc, R() * 3, 8), R() < dark ? PAL.biteD : PAL.bite, { op: 0.4 }); } };

  // ---- fur. lock(): one clump of frozen fur hanging from p, plumb (screen space), pointed, with a crease down it.
  o.lock = (p, len, w, x = {}) => {
    const sway = x.sway ?? (R() - 0.5) * w * 0.6, dir = E.norm(x.dir || [0, 1]), nn = [-dir[1], dir[0]];
    const P0 = add(p, mul(nn, w / 2)), Q0 = add(p, mul(nn, -w / 2)), tip = add(add(p, mul(dir, len)), mul(nn, sway));
    const pts = [P0, add(add(lerp(p, tip, 0.45), mul(nn, w * 0.52)), mul(nn, sway * 0.3)), add(add(lerp(p, tip, 0.8), mul(nn, w * 0.22)), mul(nn, sway * 0.4)), [...tip, 1], add(add(lerp(p, tip, 0.78), mul(nn, -w * 0.2)), mul(nn, sway * 0.4)), add(add(lerp(p, tip, 0.4), mul(nn, -w * 0.5)), mul(nn, sway * 0.25)), Q0];
    f.part(pts, Object.assign({ fill: x.fill || PAL.fur, shadow: x.shadow || PAL.furS, shade: 0.4, inkW: x.inkW ?? 1.1, inkHeavy: x.inkHeavy ?? 1.9, cast: x.cast ?? true, castOp: 0.25, hatch: x.hatch ?? false, k: 0.9, grime: x.grime }, x.look || {}));
    f.line([add(lerp(p, tip, 0.12), mul(nn, w * 0.08)), add(lerp(p, tip, 0.55), mul(nn, sway * 0.3 + w * 0.06)), add(lerp(p, tip, 0.85), mul(nn, sway * 0.4))], 1, PAL.furD, { op: 0.55 });
    f.line([add(lerp(p, tip, 0.15), mul(nn, -w * 0.25)), add(lerp(p, tip, 0.5), mul(nn, sway * 0.25 - w * 0.22))], 1, '#ffffff', { op: 0.8 });
    if (x.ice && R() < x.ice) o.icicle(add(tip, [0, -2]), w * (0.8 + R() * 0.8), Math.max(3, w * 0.28));
    return tip;
  };
  // a row of locks hanging from an edge polyline (the outline breaks into clumps). n locks, length range, width.
  o.locks = (pts, n, l0, l1, w, x = {}) => {
    const C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1], tips = [];
    for (let k = 0; k < n; k++) { const u = (k + 0.5 + (R() - 0.5) * 0.5) / n * Lt; let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; const l = l0 + (l1 - l0) * R() * (x.taper ? x.taper(k / Math.max(1, n - 1)) : 1); tips.push(o.lock(add(C[i], x.lift ? [0, -x.lift] : [0, -w * 0.3]), l, w * (0.75 + R() * 0.5), x)); }
    return tips;
  };
  // hank(): one clump of long hair hanging plumb from p (screen space), widest at the root and tapering to a point,
  // bending a little as it falls. No ink across the root (it grows out of the mass above it) and no drop shadow; the
  // ink runs down the two sides only, heavier on the shadow side, with strand lines inside and a lit edge. A fall of
  // hanks reads as hair, where outlined teardrops in a row read as teeth (the review's finding on this world).
  o.hank = (p, len, w, x = {}) => {
    const s1 = x.sway ?? (R() - 0.5) * w * 1.2, s2 = s1 * (1.3 + R() * 0.6), cur = x.curl ?? (R() - 0.5) * w * 0.5;
    const C = spline([add(p, [0, -w * 0.25]), add(p, [s1 * 0.25 + cur, len * 0.35]), add(p, [s1 + cur * 0.5, len * 0.7]), add(p, [s2, len])], 5), n = C.length;
    const W = C.map((_, i) => { const t = i / (n - 1); return w * (t < 0.35 ? 1 - t * 0.35 : (0.88 * (1 - (t - 0.35) / 0.65) ** 1.15)) + 0.6; });
    const i0 = f.out.length, rb = ribbon(C, W), col = x.fill || PAL.fur, dk = x.dark || PAL.furD, r0 = W[0] / 2, cap = [];
    for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(C[0], [Math.cos(t) * r0, -Math.sin(t) * r0 * 0.7])); } // a rounded root: a clump, never a cut edge
    const sh = [...rb, ...cap];
    f.part(sh, Object.assign({ fill: col, shadow: x.shadow || PAL.furS, light: PAL.furL, shade: 0.42, maxShade: Math.max(3, w * 0.35), hi: 0, inkW: 0, cast: false, hatch: false, k: 0.9, grime: x.grime, tex: x.tex, texOp: 0.2 }, x.look || {}));
    const P1 = rb.slice(0, n), Q1 = rb.slice(n).reverse(), k0 = Math.max(1, Math.round(n * 0.08));
    f.line([Q1[0], ...cap, P1[0]], 0.9, INK, { op: 0.4 });
    f.line(P1.slice(k0), x.inkP ?? 1.7, INK, { op: 0.9 }); f.line(Q1.slice(k0), x.inkQ ?? 1.1, INK, { op: 0.85 });
    for (const [o2, c2, op, wd] of [[-0.18, dk, 0.55, 1.1], [0.2, dk, 0.45, 1], [0.32, '#ffffff', 0.85, 1]]) f.line(C.slice(Math.round(n * 0.12), Math.round(n * 0.86)).map((q, i) => add(q, [W[i + Math.round(n * 0.12)] * o2, 0])), wd, c2, { op });
    // the root fades into the mass it grows from: no visible start to a hank
    if (x.fade !== false) {
      const gid = f.id('hg'), mid = f.id('hm'), y0 = p[1] - w * 0.4, y1 = p[1] + Math.min(len * 0.3, w * 1.4), bx = [p[0] - w * 3 - Math.abs(s2), p[1] - w, w * 6 + Math.abs(s2) * 2, len + w * 2];
      f.defs.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0.toFixed(1)}" x2="0" y2="${y1.toFixed(1)}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mid}" maskUnits="userSpaceOnUse" x="${bx[0].toFixed(1)}" y="${bx[1].toFixed(1)}" width="${bx[2].toFixed(1)}" height="${bx[3].toFixed(1)}"><rect x="${bx[0].toFixed(1)}" y="${bx[1].toFixed(1)}" width="${bx[2].toFixed(1)}" height="${bx[3].toFixed(1)}" fill="url(#${gid})"/></mask>`);
      const body = f.out.splice(i0).join('\n'); f.raw(`<g mask="url(#${mid})">${body}</g>`);
    }
    if (x.ice && R() < x.ice) o.icicle(add(C[n - 1], [0, -3]), Math.max(8, w * (0.5 + R() * 0.7)), Math.max(3, w * 0.22));
    return C[n - 1];
  };
  // a fall of hanks along an edge, in two depths, so the mass reads as layered hair; widths, lengths and bends vary. x.tone darkens the whole fall (far side).
  o.hanks = (pts, n, l0, l1, w0, w1, x = {}) => {
    const C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1], at = u => { let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; return C[i]; };
    const tone = x.tone ?? 0, tips = [];
    // shingled like real hair: the lower-rooted row first (darker, in the shade of the row above), then the row rooted
    // higher on top, so its tips cover the roots below and only tips and sides show
    for (const row of [1, 0]) {
      const m = row ? n : Math.max(1, Math.round(n * 0.75));
      for (let k = 0; k < m; k++) {
        const u = (k + 0.5 + (R() - 0.5) * 0.7) / m * Lt, p = add(at(u), [0, -(x.lift ?? 6) - (row ? 0 : 24 + R() * 36)]);
        const len = (l0 + (l1 - l0) * R()) * (row ? 1 : 0.8 + R() * 0.3), w = w0 + (w1 - w0) * R();
        const inMass = !x.inside || inPoly(add(p, [0, -w * 0.5]), x.inside); // a root on the outline keeps its clump top
        tips.push(o.hank(p, len, w, { fill: mix(PAL.fur, PAL.furS, Math.min(0.6, tone + (row ? 0.16 + R() * 0.12 : R() * 0.1))), ice: x.ice ?? 0.2, tex: x.tex, grime: x.grime, fade: inMass }));
      }
    }
    return tips;
  };
  // a frozen fringe: ONE shape hanging plumb from an edge, its lower edge broken into n clumps of uneven length with
  // notches between them, strand lines running down into each point. Reads as fur or hide fringe, never as a row of
  // teeth (separate outlined tongues in a row did). x.ice: share of points that carry an icicle.
  o.fringe = (pts, n, l0, l1, x = {}) => {
    const C = spline(pts, 3), S = arcLen(C), Lt = S[S.length - 1], at = u => { let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; return C[i]; };
    const dir = E.norm(x.dir || [0, 1]), top = [], bot = [], tips = [];
    for (let k = 0; k <= 12; k++) top.push(add(at(Lt * k / 12), mul(dir, -(x.lift ?? 6))));
    bot.push(add(at(0), mul(dir, l0 * 0.3)));
    for (let k = 0; k < n; k++) {
      const u0 = Lt * k / n, u1 = Lt * (k + 1) / n, um = (u0 + u1) / 2 + (R() - 0.5) * (u1 - u0) * 0.3, l = l0 + (l1 - l0) * Math.pow(R(), 0.8) * (x.taper ? x.taper(k / Math.max(1, n - 1)) : 1);
      const sway = (x.sway ?? 0) + (R() - 0.5) * l * 0.18, tip = add(add(at(um), mul(dir, l)), [sway, 0]);
      bot.push(add(lerp(at(u0), tip, 0.6), [(R() - 0.5) * 4, 0]), add(tip, [-(u1 - u0) * 0.12, -2]), tip, add(tip, [(u1 - u0) * 0.12, -2]), add(add(at(u1), mul(dir, l * (0.35 + R() * 0.3))), [0, 0]));
      tips.push([at(um), tip, l]);
    }
    const shape = [...top, ...bot.reverse()];
    f.part(shape, Object.assign({ fill: x.fill || PAL.fur, shadow: x.shadow || PAL.furS, light: PAL.furL, shade: 0.38, inkW: 1.2, inkHeavy: 2.2, castOp: 0.3, k: 0.85, tex: x.tex, texOp: 0.22, grime: x.grime }, x.look || {}));
    clipDraw(f, shape, () => {
      for (const [r0, tp, l] of tips) {
        for (let j = -1; j <= 1; j++) { const a = add(r0, [j * 6 + (R() - 0.5) * 4, l * 0.1]); f.line([a, lerp(a, tp, 0.6), add(tp, [j * 1.5, -3])], j === 0 ? 1.6 : 1, j === 1 ? '#ffffff' : PAL.furD, { op: j === 1 ? 0.8 : 0.6 }); }
      }
    });
    if (x.ice) for (const [, tp, l] of tips) if (R() < x.ice * 0.6) o.icicle(add(tp, [0, -3]), Math.max(8, l * (0.2 + R() * 0.25)), Math.max(3, l * 0.08));
    return tips.map(t => t[1]);
  };
  // fur detail inside a mass: directional clumps (a dark trough with a lit ridge beside it), following dir(p)
  o.furField = (outline, n, len, x = {}) => {
    const bb = E.bbox(outline), dirF = x.dir || (() => [0, 1]);
    clipDraw(f, outline, () => {
      for (let i = 0; i < n; i++) {
        const p = [bb[0] + R() * (bb[2] - bb[0]), bb[1] + R() * (bb[3] - bb[1])], d = E.norm(dirF(p)), nn = [-d[1], d[0]], l = len * (0.5 + R() * 0.8), bw = (R() - 0.5) * l * 0.25;
        const pts = [p, add(add(p, mul(d, l * 0.5)), mul(nn, bw)), add(p, mul(d, l))];
        f.stroke(pts, (x.w || 3.4) * (0.6 + R() * 0.7), x.dark || PAL.furD, { op: x.op ?? 0.55 });
        f.line(pts.map(q => add(q, mul(nn, -(x.w || 3.4) * 0.9))), 1, '#ffffff', { op: 0.75 });
      }
    });
  };

  // ---- void. A see-through hole: the near rim ellipse, the far exit offset by `far` (the tunnel axis seen at 3/4).
  // The opening (near and far overlapping) is cut out of everything drawn inside cut(); the tunnel wall is flat black;
  // the near rim is a clean pale line. Never ragged.
  o.holes = [];
  o.hole = (c, rx, ry, a0 = 0, far = [rx * 0.3, ry * 0.15]) => { const h = { c, rx, ry, a0, far }; o.holes.push(h); return h; };
  // the opening's outline: an irregular, clean-rimmed absence, never a perfect ellipse. The wobble is a fixed function of
  // the hole's own centre and size, so it draws no random numbers and every other stroke of the figure is unchanged.
  const hk = h => { const s0 = Math.sin(h.c[0] * 12.9898 + h.c[1] * 78.233 + h.rx * 3.1) * 43758.5453; return s0 - Math.floor(s0); };
  const iell = (h, c = h.c, d = 0) => { const k = hk(h), p1 = k * 6.283, p2 = k * 17.1, p3 = k * 41.7, a = 0.11 + k * 0.05;
    return ell(c, 1, 1, h.a0, 28).map(q => { const v = sub(q, c), th = Math.atan2(v[1], v[0]), w = 1 + a * Math.sin(2 * th + p1) + 0.06 * Math.sin(3 * th + p2) + 0.035 * Math.sin(5 * th + p3);
      return add(c, [v[0] * (h.rx * w + d), v[1] * (h.ry * w + d)]); }); };
  o.iell = iell;
  o.cut = (holes, draw) => {
    const i0 = f.out.length; draw();
    const mid = f.id('vm'), cps = holes.map(h => { const cid = f.id('vc'); f.defs.push(`<clipPath id="${cid}"><path d="${E.smooth(iell(h))}"/></clipPath>`); return cid; });
    f.defs.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="9000" height="9000"><rect x="-4000" y="-4000" width="9000" height="9000" fill="#fff"/>${holes.map((h, i) => `<g clip-path="url(#${cps[i]})"><path d="${E.smooth(iell(h, add(h.c, h.far)))}" fill="#000"/></g>`).join('')}</mask>`);
    for (let i = i0; i < f.out.length; i++) f.out[i] = `<g mask="url(#${mid})">${f.out[i]}</g>`;
  };
  // the tunnel wall (draw inside cut(), after the body parts it passes through) and the rim (draw after cut())
  o.holeWall = h => { f.flat(iell(h), PAL.void); };
  o.holeRim = (h, x = {}) => {
    const e = iell(h);
    f.line(e.concat([e[0]]), x.w ?? 2.4, INK, {});
    f.line(iell(h, h.c, -2.2).slice(15, 27), 1.3, PAL.voidRim, { op: 0.95 }); // the lit lip on the far side
    f.line(iell(h, h.c, 2.6).slice(1, 12), 1.2, '#ffffff', { op: 0.85 }); // a clean pale rim outside
  };
  // an opaque void patch (a taken face, a mouth): flat black inside a clean rim
  o.voidPatch = (pts, x = {}) => { f.flat(pts, PAL.void); f.line(pts.concat([pts[0]]), x.w ?? 2, INK); if (x.rim !== false) f.line(pts.slice(x.r0 ?? 0, x.r1 ?? Math.ceil(pts.length / 2)).map(q => q), 1.2, '#ffffff', { op: 0.75 }); };
  return o;
}

// ---- snow ground (on the root bone): a low drift whose top edge is the ground line, sastrugi ridges, a wind lip,
// no cast shadow (the void took it). x0..x1 extent, gy ground line, o.prints: [[x, len, dir]] footprints.
function snowGround(f, x0, x1, gy, o = {}) {
  const R = () => f.r(), dep = o.depth ?? 24, n = Math.max(6, Math.round((x1 - x0) / 60)), top = [], bot = [];
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, e = Math.min(1, i / 1.5, (n - i) / 1.5); top.push([x, gy - (2 + R() * 4) * e + (1 - e) * 6]); bot.push([x + (R() - 0.5) * 10, gy + dep * (0.55 + R() * 0.45) * (0.4 + e * 0.6)]); }
  const pts = [...top, ...bot.reverse()];
  f.part(pts, { fill: PAL.snow, shadow: PAL.snowS, shade: 0.12, maxShade: 6, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false, grime: false, gritOp: 0.25 });
  clipDraw(f, pts, () => {
    for (let i = 0; i < n * 2; i++) { const x = x0 + R() * (x1 - x0), y = gy + 4 + R() * dep * 0.6, l = 20 + R() * 50; f.line([[x, y], [x + l * 0.5, y - 2 - R() * 2], [x + l, y + 1]], 1, PAL.snowD, { op: 0.55 }); f.line([[x + 3, y - 2], [x + l * 0.5, y - 4]], 1, '#ffffff', { op: 0.9 }); }
    for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0); f.line([[x, gy + dep * 0.75], [x + 18 + R() * 20, gy + dep * 0.8]], 1.6, PAL.snowS, { op: 0.6 }); }
  });
  for (const [x, l, dr] of (o.prints || [])) { f.flat(ell([x, gy + 6], l, 3.2, 0, 12), PAL.snowS, { op: 0.75 }); f.line(ell([x, gy + 6], l, 3.2, 0, 12).slice(0, 7), 1, INK, { op: 0.55 }); f.line(ell([x, gy + 6], l, 3.2, 0, 12).slice(7, 12), 1, '#ffffff', { op: 0.9 }); }
  return pts;
}
// snow banked against a foot or hoof so it sinks in: a lumpy lip drawn over the bottom of the foot
function snowLip(f, c, w, h = 10) {
  const R = () => f.r(), pts = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8, x = c[0] - w / 2 + w * t; pts.push([x, c[1] - h * Math.sin(Math.PI * t) ** 0.6 * (0.7 + R() * 0.5)]); }
  pts.push([c[0] + w / 2 + 6, c[1] + 4], [c[0] - w / 2 - 6, c[1] + 4]);
  f.part(pts, { fill: PAL.snow, shadow: PAL.snowS, shade: 0.2, maxShade: 4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, grime: false, gritOp: 0.2 });
  f.line(pts.slice(1, 8).map(q => add(q, [0, 2])), 1, '#ffffff', { op: 0.9 });
}

// move a finished figure: wrap every drawn entry in a translate and shift the joint pivots to match (for laying out a
// figure on its canvas after authoring it; masks and clips are in user space, so they move with it)
function shiftFig(f, dx, dy = 0) {
  for (let i = 0; i < f.out.length; i++) f.out[i] = `<g transform="translate(${dx},${dy})">${f.out[i]}</g>`;
  for (const j of Object.values(f.joints)) j.pivot = [j.pivot[0] + dx, j.pivot[1] + dy];
  return f;
}

module.exports = { shiftFig, PAL, WORLD, base, rnd, scatter, ang, elb, space, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, openHand, mlimb, humanJoints, rope, offsetLine, crease, softTone, muscleBody, fx, snowGround, snowLip, split, side };
