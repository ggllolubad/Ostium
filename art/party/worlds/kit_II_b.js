// World II, The Rotmire, second batch: helpers for world_II_b.js (on top of kit_II.js, which is not edited).
// Same rules: toxin ripens (swelling, blisters, moss, fungus, mould fur, rotted holes), water preserves (bog-tanned
// leather skin, stained brown, wrinkled). Never slime puddles, neon glow or fish faces. Palette from kit_II.P.
// Drawing space faces right with kit.foeBase light (upper right); the figures are flipped, so the light ends upper left.
'use strict';
const K = require('../kit');
const W = require('./kit_II');
const { split, side } = require('../dirAC');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { P } = W;
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
const inside = (poly, p) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };

// ---- humanoid rig: J = { pelvis, torso, neck, arm_n: [S, E, W], arm_f, leg_n: [H, K, A], leg_f }
function humanJoints(f, J) {
  f.joint('pelvis', J.pelvis).joint('torso', J.torso, 'pelvis').joint('head', J.neck, 'torso');
  for (const s of ['n', 'f']) {
    const [S, E0, W0] = J['arm_' + s], [H, Kn, A] = J['leg_' + s];
    f.joint('upperarm_' + s, S, 'torso').joint('forearm_' + s, E0, 'upperarm_' + s).joint('hand_' + s, W0, 'forearm_' + s);
    f.joint('thigh_' + s, H, 'pelvis').joint('shin_' + s, Kn, 'thigh_' + s).joint('foot_' + s, A, 'shin_' + s);
  }
}
// a bare leg in one outline, split at knee and ankle (kit_II.fullLeg); o: swell, thigh, nail, ar (ankle overlap radius)
function bareLeg(f, Hp, Kn, A, s, wH, wK, sfx, look, o = {}) {
  const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]), ar = o.ar || Math.max(18, s * 0.34);
  return split(f, () => W.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o), [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, [side(Kn, dk, wK * 0.6), side(A, mul(da, -1), ar)]], ['foot' + sfx, side(A, da, ar)]]);
}
// a cloth or leather tube hip to ankle (hose, breeches, waders) split at the knee; extra() draws on it before the split
function tubeLeg(f, Hp, Kn, A, ws, sfx, look, o = {}) {
  const dk = elb(Hp, Kn, A);
  return split(f, () => { const d = f.part(K.chain([Hp, Kn, A], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look)); if (o.extra) o.extra(d); return d; }, [['thigh' + sfx, side(Kn, mul(dk, -1), ws[1] * 0.6)], ['shin' + sfx, side(Kn, dk, ws[1] * 0.6)]]);
}
// a bare or sleeved arm in one outline, split at the elbow (kit_II.fullArm), with tendon and elbow-crease lines
function arm(f, S0, E0, W0, ws, sfx, look, o = {}) {
  const de = elb(S0, E0, W0);
  return split(f, () => {
    const d = W.fullArm(f, S0, E0, W0, ws[0], ws[1], ws[2], look, o);
    if (o.lines !== false) {
      f.line([lp(S0, E0, 0.3, ws[0] * 0.15), lp(S0, E0, 0.85, ws[1] * 0.1)], 1.1, o.lineCol || '#2a1a14', { op: 0.5 });
      f.line([lp(E0, W0, 0.2, ws[1] * 0.2), lp(E0, W0, 0.8, ws[2] * 0.15)], 1.1, o.lineCol || '#2a1a14', { op: 0.5 });
      f.line([lp(E0, W0, 0.05, -ws[1] * 0.3), add(E0, mul(de, -ws[1] * 0.1)), lp(S0, E0, 0.92, -ws[1] * 0.3)], 1.2, INK, { op: 0.5 });
    }
    if (o.extra) o.extra(d);
    return d;
  }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
}

// ---- faces: B.head with the world's face lighting (face shading 0.78, as on Mother Hild), then soft modelling, tanning
// blotches and age creases clipped to the face, so it never reads as a flat cut-out. Returns the head frame.
function faceOutline(p) {
  const jaw = p.jaw ?? 1, chin = p.chin ?? 0;
  return [[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355 + (p.browOut || 0), -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32 + chin * 0.5, 0.37], [0.29 + chin, 0.47], [0.13 + chin * 0.5, 0.535 + chin * 0.2], [-0.06 - 0.08 * (jaw - 1), 0.47 + 0.04 * (jaw - 1)], [-0.21 - 0.1 * (jaw - 1), 0.27], [-0.30, 0.08], [-0.37, -0.13]];
}
function face(f, c, H, a, p, o = {}) {
  const F = B.head(f, c, H, a, Object.assign({ faceShade: 0.78, jawShade: 0.5, age: true }, p));
  const d = E.smooth(F(faceOutline(p)), true, 1), bb = E.bbox(F(faceOutline(p)));
  const pad = [bb[0] - 4, bb[1] - 4, bb[2] + 4, bb[3] + 4];
  // soft modelling: the temple and the cheek under the bone in shade, the brow and cheekbone catching the key light
  W.softTone(f, d, [
    [F([[-0.36, -0.1], [-0.1, 0.0], [0.0, 0.3], [-0.06, 0.5], [-0.3, 0.3]]), '#120a06', o.shadeOp ?? 0.42, H * 0.08],
    [F([[0.02, 0.12], [0.2, 0.16], [0.24, 0.34], [0.08, 0.42]]), '#1a0e08', 0.25, H * 0.05],
    [F([[0.08, -0.38], [0.3, -0.3], [0.32, -0.16], [0.12, -0.24]]), o.lit || '#e0c49a', 0.28, H * 0.05],
    [F([[0.14, 0.02], [0.28, 0.0], [0.3, 0.1], [0.16, 0.1]]), o.lit || '#e0c49a', 0.22, H * 0.04],
  ]);
  if (o.stain !== false) W.stains(f, d, pad, o.stainCol || '#2a1408', 0.09, 4, -2.5, 31, 0.45, 3);
  // pores and broken veins on the nose and cheek, a few age creases on the forehead
  for (let i = 0; i < 10; i++) f.flat(F(ell([0.12 + f.r() * 0.2, 0.0 + f.r() * 0.2], 0.008, 0.006, 0, 5)), '#1a0e08', { op: 0.5 });
  if (o.creases !== false) for (let i = 0; i < 3; i++) W.crease(f, F([[0.02, -0.33 + i * 0.05], [0.14, -0.35 + i * 0.05], [0.27, -0.33 + i * 0.05]]), Math.max(1.2, H * 0.014), { lip: Math.max(1, H * 0.012), lit: o.creaseLit || '#c49a6a', col: '#2a1610', op: 0.55 });
  return F;
}

// ---- cloth: wear and soft modelling clipped to a garment (d = path returned by f.part), so no area reads flat
function clothWear(f, d, bb, o = {}) {
  W.stains(f, d, bb, o.stain || '#1a120a', o.freq || 0.02, 4.2, -2.4, o.seed || 3, o.op ?? 0.55, 3);
  if (o.light !== false) W.stains(f, d, bb, o.wear || '#8a7658', (o.freq || 0.02) * 1.6, 4, -2.7, (o.seed || 3) + 5, 0.3, 3);
  if (o.tone) W.softTone(f, d, o.tone);
}
// fold strokes: list of polylines, tapered ink with a lit lip (like skin creases, broader)
function folds(f, list, w = 2.6, o = {}) { for (const pts of list) W.crease(f, pts, w, Object.assign({ lip: w * 0.8, lit: '#9a8462', col: '#140c06', op: 0.75 }, o)); }
// a ragged rotted hem from a to b (in drawing order): teeth of uneven depth, occasional deep rot notches
function hem(f, a, b, n, depth, o = {}) {
  const d = E.norm(sub(b, a)), nn = o.down ? [0, 1] : [d[1], -d[0]].map(v => -v), pts = [];
  for (let i = 1; i < n; i++) { const t = i / n + (f.r() - 0.5) * 0.3 / n, q = lerp(a, b, t), dd = (i % 2 ? depth * (0.5 + f.r() * 0.8) : -depth * 0.15 * f.r()) * (f.r() < 0.15 ? 1.8 : 1); pts.push([...add(q, mul(nn, dd)), i % 2 ? 1 : 0]); }
  return pts;
}
// rotted holes through cloth, rimmed with mould fur; the dark shows through
function holes(f, c, rx, ry, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = W.scatter(f, c, rx, ry), r = (o.r0 || 4) + f.r() * ((o.r1 || 10) - (o.r0 || 4)), e = ell(p, r, r * (0.6 + f.r() * 0.4), f.r() * 3, 10).map((q, k) => k % 2 ? add(q, [(f.r() - 0.5) * r * 0.5, (f.r() - 0.5) * r * 0.5]) : q);
    f.flat(e, o.dark || '#0e0a06', { op: 0.92 });
    f.line(e.concat([e[0]]).slice(0, 7), 1.2, '#a8a88a', { op: 0.55 });
    for (let k = 0; k < 4; k++) { const q = e[Math.floor(f.r() * e.length)]; f.line([q, add(q, [(f.r() - 0.5) * 5, 2 + f.r() * 4])], 0.9, '#c8c8a8', { op: 0.6 }); }
  }
}
// mould fur: pale grey-green fuzz along a polyline (a rotted hem, the waterline on timber), hanging short and plumb
function mouldFur(f, pts, len, o = {}) {
  const n = o.n || Math.round(pts.length * 6);
  for (let i = 0; i < n; i++) {
    const k = Math.floor(f.r() * (pts.length - 1)), q = lerp(pts[k], pts[k + 1], f.r()), l = len * (0.4 + f.r() * 0.8);
    const c = f.r() > 0.6 ? '#c8ccb0' : f.r() > 0.5 ? '#8e9670' : '#a8ae8a';
    f.line([add(q, [0, -l * 0.2]), add(q, [(f.r() - 0.5) * l * 0.4, l * 0.5]), add(q, [(f.r() - 0.5) * l * 0.5, l])], o.w || 1, c, { op: 0.7 });
  }
  if (o.blob !== false) for (let i = 0; i < n / 5; i++) { const k = Math.floor(f.r() * (pts.length - 1)), q = lerp(pts[k], pts[k + 1], f.r()), r = len * (0.15 + f.r() * 0.2); f.flat(ell(q, r * 1.4, r, 0, 8), '#b8bc9c', { op: 0.45 }); }
}
// white mycelium threads branching through timber or skin from p along angle a
function mycelium(f, p, a, len, depth = 3, w = 1.4) {
  const q = add(p, rot([len, 0], a)), m = add(lerp(p, q, 0.5), rot([0, (f.r() - 0.5) * len * 0.25], a));
  f.line([p, m, q], w + 1.2, '#2a2418', { op: 0.35 });
  f.line([p, m, q], w, '#e4e0cc', { op: 0.8 });
  if (depth > 0) for (let i = 0; i < 2; i++) mycelium(f, lerp(p, q, 0.35 + f.r() * 0.4), a + (f.r() > 0.5 ? 1 : -1) * (0.4 + f.r() * 0.6), len * (0.45 + f.r() * 0.2), depth - 1, w * 0.7);
}

// ---- the barber's leech (same build as the Leech Swarm's, so the two read as the same animal): a flattened body thickest
// in its rear third, a broad rear sucker (pts[0]), a narrow head with a front sucker cup, rings, a lateral stripe and a
// wet lit edge on the side facing the light.
function leech(f, pts, w, o = {}) {
  const n = pts.length, P2 = [], Q2 = [];
  const sm = []; for (let i = 0; i < n - 1; i++) for (let k = 0; k < 6; k++) sm.push(lerp(pts[i], pts[i + 1], k / 6)); sm.push(pts[n - 1]);
  const prof = t => (t < 0.08 ? 0.62 + t * 3 : t < 0.32 ? 0.86 + (t - 0.08) * 0.6 : 1.0 - (t - 0.32) * 1.0) * (o.fat ? 1.14 : 1);
  sm.forEach((q, i) => { const a = sm[Math.max(0, i - 1)], b = sm[Math.min(sm.length - 1, i + 1)], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], t = i / (sm.length - 1), ww = w * prof(t) / 2; P2.push(add(q, mul(nn, ww))); Q2.push(add(q, mul(nn, -ww))); });
  const d0 = E.norm(sub(sm[1], sm[0]));
  f.part(ell(add(sm[0], mul(d0, -w * 0.08)), w * 0.24, w * 0.4, Math.atan2(d0[1], d0[0]), 12), { fill: '#241a12', shadow: '#000', shade: 0.35, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
  f.part([...P2, ...Q2.reverse()], { fill: o.col || P.leech, shadow: '#000', light: '#2e2620', shade: 0.35, inkW: 1.2, inkHeavy: 2, cast: o.cast ?? false, castOp: 0.4, k: 1, hatch: false, gritOp: 0.25 });
  Q2.reverse();
  const mi = Math.floor(sm.length * 0.4), up = E.norm(sub(P2[mi], sm[mi])), lit = (up[0] * 0.6 - up[1] * 0.8) > 0 ? P2 : Q2, dark = lit === P2 ? Q2 : P2;
  const inset = (arr, k) => arr.map((q, i) => lerp(q, sm[i], k));
  f.line(inset(dark, 0.45).slice(2, -3), Math.max(1, w * 0.07), '#5a4424', { op: 0.55 });
  for (let i = 2; i < sm.length - 2; i += 2) f.line([lerp(P2[i], sm[i], 0.08), sm[i], lerp(Q2[i], sm[i], 0.08)], 0.8, '#000', { op: 0.55 });
  const hl = inset(lit, 0.32).slice(3, -4); if (hl.length > 2) { f.line(hl, Math.max(1.2, w * 0.1), '#8a8676', { op: 0.55 }); f.line(hl.slice(Math.floor(hl.length * 0.25), Math.floor(hl.length * 0.6)), Math.max(0.9, w * 0.06), '#f0ecd8', { op: 0.75 }); }
  const h = sm[sm.length - 1], dh = E.norm(sub(h, sm[sm.length - 3])), ah = Math.atan2(dh[1], dh[0]);
  f.part(ell(add(h, mul(dh, 1)), w * 0.12, w * 0.2, ah, 10), { fill: '#3a2018', shadow: '#000', shade: 0.3, inkW: 0.9, cast: false, hatch: false });
  if (o.sucker) f.flat(ell(add(h, mul(dh, 2)), w * 0.06, w * 0.12, ah, 8), '#0a0404');
}
// a wiggled polyline from a to b
const wig = (a, b, amp, n = 4, ph = 0) => { const d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = []; for (let i = 0; i <= n; i++) r.push(add(lerp(a, b, i / n), mul(nn, Math.sin(i * 1.7 + ph + a[0] * 0.05) * amp))); return r; };

// ---- an eel. o.dried: a shrivelled black strip (the tithe eels), twisted, ribbed, the skin split; else a live glossy eel
function eel(f, pts, w, o = {}) {
  const sm = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 5; k++) sm.push(lerp(pts[i], pts[i + 1], k / 5)); sm.push(pts[pts.length - 1]);
  const L = [], R = [];
  sm.forEach((q, i) => { const a = sm[Math.max(0, i - 1)], b = sm[Math.min(sm.length - 1, i + 1)], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], t = i / (sm.length - 1); let ww = w * (t < 0.12 ? 0.55 + t * 3.5 : 1 - Math.pow(t, 2.2) * 0.85) / 2; if (o.dried) ww *= 0.8 + 0.25 * Math.sin(i * 1.9); L.push(add(q, mul(nn, ww))); R.push(add(q, mul(nn, -ww))); });
  const col = o.col || (o.dried ? '#1e1a12' : '#2a2a1a');
  f.part([...L, ...R.slice().reverse()], { fill: col, shadow: '#000', light: o.dried ? '#4a4030' : '#5a5a3a', shade: 0.35, inkW: 1.1, inkHeavy: 1.8, cast: false, hatch: false, k: 0.9 });
  if (o.dried) { for (let i = 2; i < sm.length - 2; i += 2) f.line([lerp(L[i], sm[i], 0.1), sm[i], lerp(R[i], sm[i], 0.1)], 0.9, '#5a4a32', { op: 0.6 }); f.line(sm.slice(2, -3).map((q, i) => lerp(q, L[i + 2], 0.4)), 1, '#7a6a4a', { op: 0.45 }); }
  else { f.line(sm.slice(2, -2).map((q, i) => lerp(q, L[i + 2], 0.45)), Math.max(1, w * 0.1), '#b8b890', { op: 0.5 }); f.line(sm.slice(1, -1).map((q, i) => lerp(q, R[i + 1], 0.5)), 1, '#c8c0a0', { op: 0.35 }); }
  const h = sm[0], dh = E.norm(sub(sm[0], sm[2]));
  f.flat(ell(add(h, mul(dh, w * 0.1)), w * 0.1, w * 0.08, 0, 6), o.dried ? '#0a0806' : '#c8b858', { op: 0.9 }); // the eye (shrunk dark on the dried ones)
  if (!o.dried) f.line([add(h, mul(dh, w * 0.3)), add(add(h, mul(dh, -w * 0.3)), mul([-dh[1], dh[0]], w * 0.12))], 1, INK, { op: 0.7 });
}
// ---- a willow eel trap: a long woven cone from the mouth (wide, the funnel inside) to the tied tail. r0/r1 radii.
function eelTrap(f, mouth, tip, r0, r1, o = {}) {
  const d = E.norm(sub(tip, mouth)), nn = [-d[1], d[0]], Lt = E.len(sub(tip, mouth)), col = o.col || '#7a6844', colD = mix(col, '#000', 0.4);
  const prof = t => r1 + (r0 - r1) * Math.pow(1 - t, 0.8) * (1 + 0.08 * Math.sin(t * 9));
  const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(add(add(mouth, mul(d, t * Lt)), mul(nn, prof(t)))); }
  for (let i = 12; i >= 0; i--) { const t = i / 12; pts.push(add(add(mouth, mul(d, t * Lt)), mul(nn, -prof(t)))); }
  const td = f.part(pts, { fill: col, shadow: '#1e160c', shade: 0.42, tex: 'weave' + f.o.seed, texOp: 0.35, inkW: 1.3, inkHeavy: 2.4 });
  // withies running the length, hoops across, a few broken ends sticking out
  for (let k = -3; k <= 3; k++) f.line(Array.from({ length: 9 }, (_, i) => { const t = i / 8; return add(add(mouth, mul(d, t * Lt)), mul(nn, prof(t) * k / 3.6)); }), 1.1, colD, { op: 0.7 });
  for (let i = 1; i < 9; i++) { const t = i / 9, c = add(mouth, mul(d, t * Lt)), r = prof(t); f.line([add(c, mul(nn, r)), add(add(c, mul(d, 3)), mul(nn, 0)), add(c, mul(nn, -r))], 2.4, colD, { op: 0.8 }); f.line([add(add(c, mul(nn, r * 0.8)), mul(d, -1.5)), add(add(c, mul(nn, -r * 0.3)), mul(d, 1))], 1, mix(col, '#fff', 0.35), { op: 0.5 }); }
  // the mouth: the rim hoop seen a little end-on, the dark funnel inside
  const ma = Math.atan2(d[1], d[0]);
  f.part(ell(mouth, r0 * 0.32, r0 * 1.02, ma, 16), { fill: colD, shade: 0.4, inkW: 1.3, cast: false, hatch: false });
  f.flat(ell(add(mouth, mul(d, 2)), r0 * 0.22, r0 * 0.8, ma, 14), '#0c0804');
  // the tail tied off with twine
  W.rope(f, [add(tip, mul(nn, r1 * 1.2)), add(tip, mul(d, 4)), add(tip, mul(nn, -r1 * 1.2))], 2.4, { col: P.ropeD });
  f.line([add(tip, mul(d, 4)), add(tip, mul(d, 16)), add(add(tip, mul(d, 22)), [0, 8])], 1.6, P.ropeD);
  for (let i = 0; i < 3; i++) { const q = add(add(mouth, mul(d, Lt * (0.2 + f.r() * 0.6))), mul(nn, prof(0.5) * (f.r() > 0.5 ? 1 : -1))); f.line([q, add(q, rot([6 + f.r() * 6, 0], ma + (f.r() - 0.5) * 2))], 1.4, col); }
  return td;
}
// ---- a tally stick: a split hazel rod with notches cut across it
function tally(f, a, b, w, n = 7, o = {}) {
  f.part(limb(a, b, w, w * 0.9, { steps: 6, capK: 0.5 }), { fill: o.col || '#8a7450', shadow: '#3a2a18', shade: 0.4, inkW: 1, inkHeavy: 1.6, cast: false, tex: 'wood' + f.o.seed, texOp: 0.4 });
  for (let i = 0; i < n; i++) { const t = 0.12 + i * 0.76 / n + (i % 3 === 2 ? 0.02 : 0); f.line([lp(a, b, t, w * 0.5), lp(a, b, t, w * (i % 4 === 0 ? -0.4 : 0.05))], 1.4, '#1a120a', { op: 0.9, straight: true }); }
  f.line([lp(a, b, 0.05, -w * 0.2), lp(a, b, 0.95, -w * 0.2)], 0.8, '#c8b088', { op: 0.5 });
}
// ---- a hag's twine charm: a knotted cord with small frog bones (and a frog's skull) hanging from top
function frogCharm(f, top, len, o = {}) {
  const s = o.s || 1, end = add(top, [o.sw || 0, len]);
  f.line([top, lerp(top, end, 0.5), end], 1.6 * s, P.ropeD);
  for (let i = 0; i < (o.n || 3); i++) { const q = lerp(top, end, 0.3 + i * 0.25); f.part(ell(q, 3 * s, 2.4 * s, 0, 6), { fill: P.rope, shade: 0.4, inkW: 0.8, cast: false, hatch: false }); W.boneCharm(f, add(q, [2 * s, 1]), add(q, [3 * s, 11 * s]), 3 * s); }
  f.part(ell(add(end, [0, 5 * s]), 6 * s, 5 * s, 0, 10), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1, cast: false, hatch: false }); // the frog's skull, flat and wide
  f.flat(ell(add(end, [-2.4 * s, 4 * s]), 1.6 * s, 1.4 * s, 0, 6), INK); f.flat(ell(add(end, [2.4 * s, 4 * s]), 1.6 * s, 1.4 * s, 0, 6), INK);
}
// ---- a feather lock (heron plumage): a tapered clump with a rachis, barbs angled back, a wet split at the tip.
// path root to tip; w max width; o.col fill, o.dk the barb shade
function plume(f, path, w, o = {}) {
  const col = o.col || '#8a8a84', dk = o.dk || mix(col, '#1a1a16', 0.55), lt = mix(col, '#f0ece0', 0.4);
  const n = path.length, L = [], R = [];
  path.forEach((q, i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], t = i / (n - 1), ww = w * Math.sin(Math.PI * (0.12 + 0.78 * t)) * (t > 0.85 ? (1 - t) * 4 : 1) / 2; L.push(add(q, mul(nn, ww))); R.push(add(q, mul(nn, -ww))); });
  const tipS = []; if (o.split !== false) { const e = path[n - 1], d = E.norm(sub(e, path[n - 2])); tipS.push([...add(add(e, mul(d, w * 0.25)), mul([-d[1], d[0]], w * 0.15)), 1], [...add(e, mul(d, -w * 0.2)), 0], [...add(add(e, mul(d, w * 0.35)), mul([-d[1], d[0]], -w * 0.18)), 1]); }
  f.part([...L, ...tipS, ...R.reverse()], { fill: col, shadow: o.shadow || '#2a2a26', shade: 0.4, inkW: o.inkW ?? 1.1, inkHeavy: o.inkHeavy ?? 1.8, cast: o.cast ?? false, castOp: 0.35, tex: o.tex, texOp: 0.4, k: 0.9, hatch: o.hatch });
  R.reverse();
  f.line(path.slice(0, -1), Math.max(0.8, w * 0.05), lt, { op: 0.55 }); // the rachis
  for (let i = 1; i < n - 1; i++) { const c = path[i]; f.line([c, lerp(c, L[Math.min(n - 1, i + 1)], 0.9)], 0.8, dk, { op: 0.55 }); f.line([c, lerp(c, R[Math.min(n - 1, i + 1)], 0.9)], 0.8, dk, { op: 0.45 }); }
}
// ---- a stretched blister skin swelling (goitre, gut, crop): soft modelling, veins and a tight sheen, clipped to d
function swelling(f, d, bb, c, o = {}) {
  const rx = (bb[2] - bb[0]) / 2, ry = (bb[3] - bb[1]) / 2;
  W.softTone(f, d, [
    [ell(add(c, [-rx * 0.35, ry * 0.45]), rx * 0.9, ry * 0.6, 0.2, 12), '#0e0a04', o.dark ?? 0.55, Math.max(6, rx * 0.25)],
    [ell(add(c, [rx * 0.3, -ry * 0.35]), rx * 0.42, ry * 0.3, -0.5, 10), o.lit || '#e8e0b0', o.litOp ?? 0.35, Math.max(4, rx * 0.15)],
  ]);
  W.stains(f, d, bb, o.mottle || '#3a2a12', 0.035, 4.4, -2.4, o.seed || 7, 0.6, 3);
  // veins: branching dark lines over the stretched skin
  for (let i = 0; i < (o.veins ?? 5); i++) { let p = W.scatter(f, c, rx * 0.7, ry * 0.7), a = f.r() * 6.3; const pts = [p]; for (let k = 0; k < 5; k++) { a += (f.r() - 0.5) * 0.9; p = add(p, rot([rx * 0.12, 0], a)); pts.push(p); } f.line(pts, 1.6, o.vein || '#3a4a1a', { op: 0.55 }); f.line(pts.slice(1, 3).map(q => add(q, rot([rx * 0.1, 0], a + 1.2))), 1, o.vein || '#3a4a1a', { op: 0.45 }); }
  f.line([add(c, [rx * 0.1, -ry * 0.62]), add(c, [rx * 0.48, -ry * 0.42]), add(c, [rx * 0.62, -ry * 0.05])], Math.max(2, rx * 0.05), '#f4ecd0', { op: 0.4 }); // the tight sheen
}

// ---- a contour feather (heron plumage), for building wings and plumage in layered masses rather than combed strands:
// narrow at the quill, broad toward a rounded tip, a pale shaft, barbs angled back, a lit edge on the key-light side, a
// cast shadow onto the feather beneath so the tiers separate; o.split cuts the wet tip into two or three points
function feather(f, base, tip, w, col, o = {}) {
  const d = E.norm(sub(tip, base)), n = [-d[1], d[0]], L = E.len(sub(tip, base)), bend = o.bend || 0;
  const at = (t, k) => add(add(lerp(base, tip, t), mul(n, k * w * 0.5)), mul(n, bend * Math.sin(Math.PI * t) * L * 0.08));
  const prof = t => t < 0.7 ? 0.3 + 0.7 * Math.sin(Math.PI * t / 1.4) : Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.7) / 0.3, 2))) * 0.98 + 0.02;
  const P2 = [], Q2 = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; P2.push(at(t, prof(t))); Q2.push(at(t, -prof(t))); }
  let tipPts = [];
  if (o.split) { const k = o.split; for (let j = 1; j < k + 1; j++) { const u = j / (k + 1) * 2 - 1; tipPts.push(add(at(1, u), mul(d, w * 0.25 * (j % 2 ? 1 : -0.6)))); } }
  const pts = [...P2, ...tipPts.reverse(), ...Q2.reverse()];
  const dk = mix(col, '#0e0e0c', 0.55), lt = mix(col, '#f6f2e6', 0.45);
  const dd = f.part(pts, { fill: col, shadow: o.shadow || dk, shade: 0.35, maxShade: Math.max(3, w * 0.18), inkW: o.inkW ?? 1, inkHeavy: o.inkHeavy ?? 1.8, cast: o.cast ?? true, castOp: o.castOp ?? 0.35, hatch: false, k: 0.9, tex: o.tex, texOp: 0.35, gritOp: 0.3 });
  f.line([at(0.04, 0), at(0.5, 0.04), at(0.9, 0)], Math.max(0.8, w * 0.05), lt, { op: 0.5 }); // the shaft
  for (let t = 0.2; t < 0.92; t += 0.12) { f.line([at(t, 0.05), at(t + 0.07, 0.8 * prof(t))], 0.8, dk, { op: 0.4 }); f.line([at(t, -0.05), at(t + 0.07, -0.8 * prof(t))], 0.8, dk, { op: 0.3 }); } // barbs
  const litSide = (-n[0] * 0.6 + n[1] * 0.8) < 0 ? 1 : -1; // the edge facing the key light (drawing space: upper right)
  f.line([0.3, 0.5, 0.7, 0.85, 0.95].map(t => at(t, litSide * prof(t) * 0.86)), Math.max(1, w * 0.06), lt, { op: 0.55 });
  return dd;
}

// ---- a bracket fungus shelf as a fan: attached along its top edge (under the shelf above), the lobed margin curving
// down toward the viewer; the top surface zoned in bands parallel to the margin, a thick pale growing margin, a thin
// crescent of the pored underside below it, and its shadow thrown on what is beneath. a = tilt; col = the crust colour.
function fan(f, c, w, a, col, o = {}) {
  const F = E.frame(c, a, 1), h = w * (o.h ?? (0.38 + f.r() * 0.12)), nl = 2 + Math.floor(f.r() * 2), ph = c[0] * 0.13;
  const arc = (k, dy = 0) => { const r = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12, lobe = 1 + 0.07 * Math.sin(t * nl * 2 + ph); r.push([-Math.cos(t) * w * 0.5 * k * lobe, Math.sin(t) * h * k * lobe + dy]); } return r; };
  f.flat(F(E.ell([w * 0.06, h * 0.9], w * 0.46, h * 0.36, 0, 12)), '#0a0604', { op: 0.4 });
  f.part(F(arc(1.0, 0).concat(arc(1.0, w * 0.07).reverse())), { fill: '#a49878', shadow: '#5a5038', shade: 0.4, maxShade: 4, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false });
  const d = f.part(F([[-w * 0.5, 0], [0, -h * 0.08], ...arc(1.0).slice().reverse().slice(1)]), { fill: col, shadow: mix(col, '#000', 0.55), shade: 0.3, maxShade: 8, inkW: 1.3, inkHeavy: 2.2, cast: false, k: 0.9 });
  const zc = [mix(col, '#000', 0.45), mix(col, '#d8c89a', 0.3), mix(col, P.bileD, 0.5), mix(col, '#000', 0.3)];
  for (let r = 1; r <= 4; r++) { const k = 1 - r * 0.17; f.line(F(arc(k).slice(1, -1)), Math.max(1.4, w * (0.05 - r * 0.006)), zc[(r + Math.floor(ph)) % 4], { op: 0.8 }); }
  f.line(F(arc(0.97).slice(1, -1)), Math.max(1.8, w * 0.035), '#d4c8a0', { op: 0.85 });
  return d;
}

// ---- face anatomy over a B.head face (F = the head frame face() returns): the shade under the brow ridge, the lit
// cheekbone and the hollow under it, the sunk temple, the fold from nose to mouth and the chin crease; o.hollow, o.age
function anat(f, F, Hh, o = {}) {
  const lw = Math.max(1.2, Hh * 0.02);
  f.flat(F(E.ell([0.17, -0.09], 0.16, 0.045, 0.05, 10)), '#140a06', { op: o.brow ?? 0.3 });
  f.line(F([[0.03, -0.14], [0.14, -0.16], [0.26, -0.14], [0.34, -0.11]]), lw * 1.2, o.lit || '#d8b088', { op: 0.4 });
  f.flat(F(E.ell([0.16, 0.07], 0.09, 0.028, -0.25, 8)), o.lit || '#d8b088', { op: 0.32 });
  f.flat(F(E.ell([0.12, 0.18], 0.08, 0.055, -0.2, 8)), '#140a06', { op: o.hollow ?? 0.35 });
  f.flat(F(E.ell([-0.06, -0.12], 0.06, 0.08, 0, 8)), '#140a06', { op: 0.25 });
  if (o.age !== false) W.crease(f, F([[0.25, 0.1], [0.21, 0.18], [0.19, 0.25]]), lw * 1.2, { lip: lw, lit: o.lit || '#c8a078', col: '#1e120a', op: 0.7 });
  W.crease(f, F([[0.2, 0.39], [0.26, 0.41], [0.31, 0.38]]), lw, { lip: lw * 0.8, lit: o.lit || '#c8a078', col: '#1e120a', op: 0.5 });
}

module.exports = { anat, fan, feather, ang, elb, inside, humanJoints, bareLeg, tubeLeg, arm, faceOutline, face, clothWear, folds, hem, holes, mouldFur, mycelium, leech, wig, eel, eelTrap, tally, frogCharm, plume, swelling };
