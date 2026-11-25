// World I (The Drowned Kingdom), batch c: local helpers. Shared files stay frozen; everything new lives here.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, frame } = E;

// World palette: deep blue-black, verdigris, drowned gold (tarnished), plus ink black, bone and grey.
const PAL = {
  bb: '#141b26', bbL: '#24324a', water: '#0b1118', waterL: '#2c4458', verd: '#4f7a68', verdL: '#7aa08a', dgold: '#8a7442', dgoldD: '#5e4e2c',
  bone: '#d8d0bc', grey: '#7a7874', drip: '#9ec0d0', kelp: '#262a16', kelpL: '#6a7040', voidC: '#06050a', voidH: '#2a1c44',
};

// Drowned-flesh and void marks, bound to one figure (uses its seeded random so renders repeat).
function fx(f) {
  const R = () => f.r();
  const o = {};
  // lividity blotches pooled in the skin
  o.livid = (c, rx, ry, n, cols = ['#8a86a2', '#7a8c6c'], op = 0.4) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.flat(ell(p, 3 + R() * 7, 2 + R() * 4, R() * 3, 8), R() > 0.45 ? cols[0] : cols[1], { op }); } };
  // marbled veins
  o.veins = (c, rx, ry, n, col = '#57527e', w = 0.9) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.line([p, add(p, [3 + R() * 6, 5 + R() * 5]), add(p, [R() * 12, 12 + R() * 8])], w, col, { op: 0.6 }); } };
  // peeling skin flakes
  o.peel = (c, n, sp = 22) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * sp, (R() - 0.5) * sp * 0.8]); f.flat([p, add(p, [7, -2]), add(p, [9, 3]), add(p, [3, 4])], '#e2e0d2', { op: 0.85 }); f.line([p, add(p, [7, -2])], 0.8, INK, { op: 0.6 }); } };
  // barnacle: a low irregular cone with a dark slit
  o.barnacle = (c, r) => { const j = () => (R() - 0.5) * r * 0.5; f.part([add(c, [-r + j(), r * 0.4]), add(c, [-r * 0.5 + j(), -r * 0.35 + j()]), add(c, [r * 0.4 + j(), -r * 0.45 + j()]), add(c, [r + j(), r * 0.4])], { fill: mix('#a9a596', '#6e6a5e', R() * 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.9, hatch: false }); f.line([add(c, [-r * 0.3, -r * 0.3]), add(c, [r * 0.25, -r * 0.35])], 1.4, '#1c1a1a'); };
  o.barnacles = list => { for (const [x, y, r] of list) o.barnacle([x, y], r); };
  // mussel: blue-black shell with a lit growth line
  o.mussel = (c, a, s = 1) => { f.part(ell(c, 7 * s, 3.6 * s, a, 10), { fill: '#1d2332', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false }); f.line([add(c, rot([-5 * s, -1 * s], a)), add(c, rot([5 * s, -1 * s], a))], 0.9, '#6a7a9a', { op: 0.7 }); };
  // a water drop
  o.drip = (p, s = 1) => f.flat(ell(p, 2 * s, 3.4 * s, 0, 6), PAL.drip, { op: 0.85 });
  // a short run of water down a surface, with a drop at the end
  o.run = (pts, w = 2.2) => { f.stroke(pts, w, '#7ea4b8', { op: 0.55 }); o.drip(add(pts[pts.length - 1], [0, 5])); };
  // water-puckered skin: short ink ticks
  o.pucker = (c, n, ang = 1.2, l = 8) => { for (let i = 0; i < n; i++) { const p = add(c, [(i - n / 2) * 4.5, (R() - 0.5) * 4]); f.line([p, add(p, rot([l, 0], ang))], 0.8, INK, { op: 0.45 }); } };
  // void hole: a clean pale rim, a black core, a faint violet heart and a soft violet bloom behind
  o.voidHole = (c, rx, ry, ang = 0, op = {}) => {
    if (op.glow !== false) f.raw(`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx * 1.45}" ry="${ry * 1.45}" transform="rotate(${(ang * 57.3).toFixed(1)} ${c[0]} ${c[1]})" fill="#6a4aa0" opacity="0.26" filter="url(#soft${f.o.seed})"/>`);
    if (op.rim !== false) f.part(ell(c, rx, ry, ang, 18), { fill: op.rimCol || '#e8e2d8', shade: 0.2, inkW: 1.2, inkHeavy: 1.2, cast: false, hatch: false });
    f.flat(ell(add(c, [0.6, 0.6]), rx * 0.8, ry * 0.8, ang, 18), PAL.voidC);
    f.flat(ell(add(c, [rx * 0.15, ry * 0.15]), rx * 0.34, ry * 0.34, ang, 10), PAL.voidH, { op: 0.9 });
  };
  // kelp strand hanging plumb from p0 (screen space), with a lit edge; returns the end point
  o.kelp = (p0, len, w, sway, col = PAL.kelp, colL = PAL.kelpL) => { const pts = [p0, add(p0, [sway * 0.4, len * 0.35]), add(p0, [sway, len * 0.7]), add(p0, [sway * 0.6, len])]; f.stroke(pts, w, col); f.line(pts.slice(0, 3).map(q => add(q, [-w * 0.18, 0])), 1, colL, { op: 0.7 }); return pts[3]; };
  // verdigris and pits on metal
  o.verdi = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.flat(ell(p, 1.8 + R() * 3.4, 1.4 + R() * 2.4, R() * 3, 7), R() > 0.3 ? PAL.verd : '#2a3a30', { op: 0.75 }); } };
  // standing water ring on the ground
  o.puddle = (c, rx, op = 0.45) => { f.flat(ell(c, rx, Math.max(4, rx * 0.11), 0, 16), '#2c3a40', { op }); f.line(ell(c, rx * 0.7, Math.max(3, rx * 0.07), 0, 14).slice(9, 14), 1, '#7a9aa8', { op: 0.4 }); };
  return o;
}

// Standard humanoid skeleton. J: { P, T (torso pivot), N (head pivot), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF }.
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  if (J.HN) f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  if (J.HF) f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}

// open webbed hand: B.hand plus translucent webbing between the fingers and long dark nails.
function webHand(f, c, ang, s, col, o = {}) {
  const h = B.hand(f, c, ang, s, col, o);
  const F = h.F, web = o.web || mix(col, '#3a5a54', 0.45);
  // webbing spans from the knuckles out to two thirds of the fingers
  const knuck = [[0.42, -0.34], [0.42, -0.11], [0.42, 0.12], [0.42, 0.33]];
  for (let i = 0; i < 3; i++) {
    const a = h.tips[i], b = h.tips[i + 1], ka = F([knuck[i]])[0], kb = F([knuck[i + 1]])[0];
    const pa = lerp(ka, a, 0.86), pb = lerp(kb, b, 0.86), mid = lerp(lerp(ka, kb, 0.5), lerp(pa, pb, 0.5), 0.55);
    f.flat([ka, pa, mid, pb, kb], web, { op: 0.75 });
    f.line([pa, mid, pb], 0.9, INK, { op: 0.55 });
  }
  // thumb web
  const tw = F([[-0.05, -0.42]])[0], tk = F([[0.25, -0.62]])[0], ik = F([[0.5, -0.4]])[0];
  f.flat([tw, tk, ik, F([[0.42, -0.34]])[0]], web, { op: 0.5 });
  // nails: long, dark, curving on from each fingertip
  if (o.nails !== false) h.tips.forEach((t, i) => { const k = F([[0.42, [-0.34, -0.11, 0.12, 0.33][i]]])[0], d = E.norm(sub(t, k)), L = s * (o.nailL || 0.32) * 1.7; const e = add(add(t, mul(d, L)), rot(mul(d, L * 0.35), 1.3)); f.stroke([add(t, mul(d, -3)), lerp(t, e, 0.45), e], 5, INK); f.stroke([add(t, mul(d, -2)), lerp(t, e, 0.45), e], 3.4, o.nailCol || '#4a4a44'); });
  return h;
}

// scale texture (pale overlapping arcs), registered once per figure
function scaleDefs(f, col = INK) {
  const s = f.o.seed;
  f.defs.push(`<pattern id="scale${s}" patternUnits="userSpaceOnUse" width="11" height="8"><path d="M0,8 a5.5,5 0 0 1 11,0 M-5.5,4 a5.5,5 0 0 1 11,0 M5.5,4 a5.5,5 0 0 1 11,0" fill="none" stroke="${col}" stroke-width="0.8" opacity="0.75"/></pattern>`);
  return 'scale' + s;
}

// pool of black water lying on the ground plane: back half (drawn before the body) and front lip (after).
function poolBack(f, c, rx, ry) {
  f.part(ell(c, rx, ry, 0, 28), { fill: PAL.water, shade: 0.15, hatch: false, cast: false, inkW: 1.4, inkHeavy: 2, grime: false, gritOp: 0.25 });
  // dark depth toward the middle, lit sheen near the back rim
  f.flat(ell(add(c, [0, ry * 0.12]), rx * 0.82, ry * 0.62, 0, 24), '#05080c', { op: 0.8 });
  f.line(ell(c, rx * 0.94, ry * 0.8, 0, 24).slice(13, 22), 1.2, '#5a7a8a', { op: 0.45 });
}
function ripples(f, c, rx, ry, n = 3) {
  for (let i = 0; i < n; i++) { const k = 1 + i * 0.42, e = ell(c, rx * k, ry * k, 0, 22); f.line(e.slice(1, 11), 1.6 - i * 0.35, '#6e8e9e', { op: 0.6 - i * 0.15 }); f.line(e.slice(12, 21), 1.1, '#03060a', { op: 0.5 - i * 0.12 }); }
}

// A flowing lock of hair or weed: a tapered ribbon along a waving centreline. p0 root, dir unit direction, len, w root
// width, amp/freq/phase of the wave. Returns the centreline.
function waveLock(f, p0, dir, len, w, look, o = {}) {
  const n = 14, d = E.norm(dir), nn = [-d[1], d[0]], amp = o.amp ?? 10, fr = o.freq ?? 1.6, ph = o.phase ?? 0, curl = o.curl ?? 0;
  const C = [];
  for (let i = 0; i <= n; i++) { const t = i / n, bend = rot(d, curl * t * t); C.push(add(add(p0, mul(bend, len * t)), mul(nn, Math.sin(t * Math.PI * fr + ph) * amp * t))); }
  const P = [], Q = [];
  C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n, i + 1)], dd = E.norm(sub(b, a)), m = [-dd[1], dd[0]], t = i / n, ww = w / 2 * (1 - t) ** (o.taper ?? 0.8) * (1 + 0.25 * Math.sin(t * 9 + ph)); P.push(add(c, mul(m, ww))); Q.push(add(c, mul(m, -ww))); });
  f.part([...P, ...Q.reverse()], Object.assign({ k: 0.9 }, look));
  if (o.lit) f.line(C.slice(1, n - 3).map((c, i) => add(c, mul(nn, w * 0.15 * (1 - i / n)))), 1, o.lit, { op: 0.6 });
  return C;
}

// One connected mass of long hair streaming from a root along a curving path, its far end split into tapering tips.
// path: centreline points (root first), ws: width at each, tips: number of points at the end. Returns { top, bot, C }.
function hairMass(f, path, ws, look, o = {}) {
  const n = 24, C = [], W = [];
  for (let i = 0; i <= n; i++) { const t = i / n * (path.length - 1), k = Math.min(path.length - 2, Math.floor(t)), u = t - k; C.push(lerp(path[k], path[k + 1], u)); W.push(ws[k] + (ws[k + 1] - ws[k]) * u); }
  const top = [], bot = [], ph = o.phase ?? 0, amp = o.amp ?? 4;
  C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n, i + 1)], d = E.norm(sub(b, a)), m = [-d[1], d[0]], t = i / n;
    top.push(add(c, mul(m, W[i] / 2 + Math.sin(t * 11 + ph) * amp * t))); bot.push(add(c, mul(m, -W[i] / 2 + Math.sin(t * 9 + ph + 1) * amp * t))); });
  const tips = o.tips || 4, end = C[n], a = C[n - 2], d = E.norm(sub(end, a)), m = [-d[1], d[0]], we = W[n];
  const tipPts = [];
  for (let k = 0; k < tips; k++) {
    const u = we / 2 - we * (k + 0.5) / tips, L = (o.tipL ?? 40) * (0.6 + 0.4 * Math.sin(k * 2.3 + ph)), curlv = rot(d, (o.tipCurl ?? 0.3) * (k - tips / 2) / tips);
    tipPts.push([...add(add(end, mul(m, u)), mul(curlv, L)), 1]);
    if (k < tips - 1) tipPts.push(add(add(end, mul(m, we / 2 - we * (k + 1) / tips)), mul(d, -8)));
  }
  const outline = [...top, ...tipPts, ...bot.slice().reverse()];
  f.part(outline, Object.assign({ k: 0.85 }, look));
  // strands: lit and dark lines running along the mass
  if (o.strands !== false) for (let s = 1; s < 6; s++) { const v = s / 6 - 0.5; const pts = C.slice(1, n - 1).filter((_, i) => i % 2 === 0).map((c, i) => { const j = i * 2 + 1, aa = C[Math.max(0, j - 1)], bb = C[Math.min(n, j + 1)], dd = E.norm(sub(bb, aa)), mm = [-dd[1], dd[0]]; return add(c, mul(mm, v * W[j] * 0.9 + Math.sin(j * 0.7 + s) * 2)); }); f.line(pts, s % 2 ? 1.2 : 1, s % 2 ? (o.lit || '#5a6a50') : INK, { op: s % 2 ? 0.55 : 0.5 }); }
  return { top, bot, C };
}

// Two-bone IK: the elbow for a shoulder S reaching a wrist W with segment lengths l1, l2. sign picks the bend side.
// If W is out of reach it is pulled in along the line, and the second value says how far it moved.
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), base = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], base + sign * a)), Wr];
}

// ---------------------------------------------------------------- added in the independent review
// Catmull-Rom spline through control points, resampled about every `step` px. Sharp control angles give kinks.
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
// draw() into a clip region (an SVG path d or a polygon) on the current bone, in place
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], 1]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
// a strip polygon along a centreline sub-range (for clip regions): pts, half width hw
function strip(C, i0, i1, hw) {
  const L = [], R = [];
  for (let i = i0; i <= i1; i++) { const d = E.norm(sub(C[Math.min(C.length - 1, i + 1)], C[Math.max(0, i - 1)])), n = [-d[1], d[0]]; L.push(add(C[i], mul(n, hw))); R.push(add(C[i], mul(n, -hw))); }
  return [...L, ...R.reverse()];
}

// A lamprey: a slimy, mottled, kinked eel body tapering to a finned tail, mouth first. ctrl: centreline control points
// from the mouth to the tail tip. o.w body width; o.dorsal (+1/-1) which normal side is the back; o.head: 'side' (oral
// disc edge-on, lips flared), 'q3' (disc turned three-quarter to the viewer: fringe, radial rows of hooked teeth,
// throat), 'bite' (disc clamped flat on a surface, throat swollen with sucking), 'hidden' (head behind something).
// o.seed makes the mottling repeatable so the same lamprey can be drawn twice (behind and in front of what it wraps).
// Returns the centreline and widths.
function lamprey(f, ctrl, o = {}) {
  const R = E.rng(o.seed || 7), ink = f.o.ink;
  const C = spline(ctrl, 3.5), n = C.length, S = arcLen(C), L = S[n - 1], w = o.w || 26, sc = w / 26;
  const col = o.col || '#857a68', colD = o.colD || '#3e352c', belly = o.belly || '#c2b69c', mouthC = o.mouth || '#cfc0a6';
  const T = C.map((_, i) => E.norm(sub(C[Math.min(n - 1, i + 1)], C[Math.max(0, i - 1)]))), N = T.map(t => [-t[1], t[0]]);
  const ds = typeof o.dorsal === 'number' ? o.dorsal : (N[Math.floor(n * 0.35)][1] < 0 ? 1 : -1); // the back faces up unless told
  const W = C.map((_, i) => {
    const d = S[i], t = d / (o.len || L); let k; // o.len: the whole animal is longer than what shows (the rest is inside something)
    if (d < 2.6 * w) k = 0.86 + 0.14 * (d / (2.6 * w));
    else if (t < 0.42) k = 1;
    else k = 0.06 + 0.94 * Math.pow(Math.max(0, 1 - (t - 0.42) / 0.58), 1.15);
    if (o.head === 'bite') k *= 1 + 0.16 * Math.exp(-(((d - 1.3 * w) / (0.7 * w)) ** 2));
    return w * k * (1 + Math.sin(d * 0.21 + (o.seed || 0)) * 0.025);
  });
  const at = (i, u) => add(C[i], mul(N[i], u));
  const idx = t => Math.max(0, Math.min(n - 1, S.findIndex(s => s >= t * L)));
  const dIdx = d => Math.max(0, Math.min(n - 1, S.findIndex(s => s >= d)));
  const F0 = mul(T[0], -1); // forward, out of the mouth
  // ---- fins: a low first dorsal, a taller second dorsal running into the tail fin round the tip and under it
  const fin = (t0, t1, h, ventral = 0) => { const a = idx(t0), b = idx(t1), out = [], base = []; for (let i = a; i <= b; i++) { const u = (S[i] - S[a]) / Math.max(1, S[b] - S[a]); out.push(at(i, ds * (W[i] / 2 + h * Math.sin(Math.PI * Math.min(1, u * 1.15)) + 1))); base.push(at(i, ds * W[i] * 0.2)); } return [...out, ...base.reverse()]; };
  const finLook = { fill: mix(colD, '#9a9080', 0.32), shadow: '#1e1a16', shade: 0.22, hatch: false, inkW: 0.9, inkHeavy: 1.2, cast: false, opacity: 0.9, k: 0.8 };
  if (o.fins !== false && !o.len) {
    f.part(fin(0.5, 0.68, w * 0.26), finLook);
    const a = idx(0.7), out = [], back = [];
    for (let i = a; i < n; i++) { const u = (S[i] - S[a]) / (L - S[a]); out.push(at(i, ds * (W[i] / 2 + w * 0.36 * Math.sin(Math.PI * Math.min(1, 0.25 + u * 0.75)) + w * 0.12 * u + 1))); }
    const tip = add(C[n - 1], mul(T[n - 1], w * 0.42));
    const v0 = idx(0.86);
    for (let i = n - 1; i >= v0; i--) { const u = (S[i] - S[v0]) / (L - S[v0]); back.push(at(i, -ds * (W[i] / 2 + w * 0.22 * Math.sin(Math.PI * Math.min(1, u)) + w * 0.1 * u))); }
    const ctr = []; for (let i = v0; i >= a; i--) ctr.push(C[i]);
    f.part([...out, tip, ...back, ...ctr], finLook);
    for (let i = a + 2; i < n - 1; i += 3) f.line([at(i, ds * W[i] * 0.45), at(i, ds * (W[i] / 2 + w * 0.3))], 0.7, ink, { op: 0.35 });
  }
  // ---- body outline: mouth cap, flanks, pointed tail
  const Lp = C.map((_, i) => at(i, W[i] / 2)), Rp = C.map((_, i) => at(i, -W[i] / 2)), cap = [];
  for (let j = 1; j < 6; j++) { const a = Math.PI * j / 6; cap.push(add(add(C[0], mul(N[0], -Math.cos(a) * W[0] / 2)), mul(F0, Math.sin(a) * W[0] * 0.42))); }
  const poly = [...Lp, add(C[n - 1], mul(T[n - 1], o.len ? W[n - 1] * 0.3 : 3)), ...Rp.slice().reverse(), ...cap];
  f.part(poly, { fill: col, shadow: o.shadow || '#241e18', shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.75, k: 0.95, maxShade: w * 0.5 });
  // dark back, pale belly (inset so the ink edge survives)
  const band = (u0, u1, i0, i1) => { const A = [], B2 = []; for (let i = i0; i <= i1; i++) { A.push(at(i, u0 * W[i])); B2.push(at(i, u1 * W[i])); } return [...A, ...B2.reverse()]; };
  const iH = dIdx(0.5 * w), iT = idx(0.95);
  f.flat(band(ds * 0.04, ds * 0.42, iH, iT), colD, { op: 0.42 });
  f.flat(band(ds * 0.22, ds * 0.43, iH, iT), colD, { op: 0.35 });
  f.flat(band(-ds * 0.14, -ds * 0.41, dIdx(0.3 * w), idx(0.8)), belly, { op: 0.42 });
  // mottling: dark blotches on the back and flank, a few pale ones low on the side
  const nb = Math.round(L / 11);
  for (let k = 0; k < nb; k++) {
    const i = Math.floor(iH + R() * (idx(0.9) - iH)), pale = R() < 0.22, u = pale ? -ds * (0.05 + R() * 0.25) : ds * (0.02 + R() * 0.36), p = at(i, u * W[i]);
    const a = Math.atan2(T[i][1], T[i][0]) + (R() - 0.5) * 0.8, s = (2 + R() * 4.2) * sc * Math.max(0.45, W[i] / w);
    const blob = ell(p, s * (1.2 + R()), s * (0.6 + R() * 0.5), a, 7).map(q => add(q, [(R() - 0.5) * s * 0.5, (R() - 0.5) * s * 0.5]));
    f.flat(blob, pale ? '#cfc4ac' : '#221c16', { op: pale ? 0.3 : 0.5 });
  }
  // lateral line of sense pits
  for (let d = 3.2 * w; d < L * 0.8; d += 7 * sc) { const i = dIdx(d); f.flat(ell(at(i, ds * W[i] * 0.02), 0.9 * sc, 0.9 * sc, 0, 5), '#16120e', { op: 0.5 }); }
  // wet highlights: broken strokes along the lit flank, a few specular beads
  const Lv = E.norm(f.o.light), litS = i => (N[i][0] * Lv[0] + N[i][1] * Lv[1]) > 0 ? 1 : -1; // the engine lights the side facing +light
  let i = dIdx(0.4 * w);
  while (i < idx(0.88)) {
    const runL = (8 + R() * 18) * sc, j = Math.min(n - 1, dIdx(S[i] + runL));
    const dot = Math.abs(N[i][0] * Lv[0] + N[i][1] * Lv[1]);
    if (dot > 0.2 && j - i > 2) { const sd = litS(i), pts = []; for (let k = i; k <= j; k += 2) pts.push(at(k, sd * W[k] * (0.26 + 0.04 * Math.sin(k)))); f.stroke(pts, 2.6 * sc * Math.max(0.5, W[i] / w), '#eef4f2', { op: 0.6 }); }
    i = Math.min(n - 1, dIdx(S[j] + (5 + R() * 12) * sc));
    if (R() < 0.5) { const q = Math.floor(iH + R() * (idx(0.8) - iH)); f.flat(ell(at(q, litS(q) * W[q] * 0.34), 1.3 * sc, 1.1 * sc, 0, 6), '#ffffff', { op: 0.75 }); }
  }
  if (o.head !== 'hidden') {
    // seven gill pores in a row behind the eye, each a dark pit with a lit lower lip
    for (let k = 0; k < 7; k++) { const ii = dIdx((1.2 + k * 0.21) * w), p = at(ii, ds * W[ii] * 0.04), a = Math.atan2(T[ii][1], T[ii][0]); f.flat(ell(p, 1.5 * sc, 2.1 * sc, a, 8), '#1a120e', { op: 0.85 }); f.line([at(ii, ds * W[ii] * 0.04 - ds * 3.2 * sc), add(at(ii, ds * W[ii] * 0.04 - ds * 3.2 * sc), mul(T[ii], 2.4 * sc))], 0.9, '#d8d0bc', { op: 0.55 }); }
    // small eye
    const ie = dIdx(0.62 * w), pe = at(ie, ds * W[ie] * 0.2);
    f.flat(ell(pe, 3.4 * sc, 3.2 * sc, 0, 10), '#a89c84', { op: 0.8 }); f.flat(ell(pe, 2.3 * sc, 2.3 * sc, 0, 8), '#0a0808'); f.flat(ell(add(pe, [0.8 * sc, -0.8 * sc]), 0.8 * sc, 0.8 * sc, 0, 5), '#fff', { op: 0.8 });
    // nostril on top of the head
    const inn = dIdx(0.95 * w); f.flat(ell(at(inn, ds * W[inn] * 0.42), 1.6 * sc, 1.1 * sc, 0, 6), '#140e0c');
  }
  // ---- the mouth
  const ax = Math.atan2(F0[1], F0[0]), HF = (c, pts) => frame(c, ax, 1)(pts), wob = (rx, ry, ph, m = 22) => { const r = []; for (let k = 0; k < m; k++) { const a = Math.PI * 2 * k / m, kk = 1 + 0.07 * Math.sin(3 * a + ph) + 0.04 * Math.sin(5 * a + ph * 2); r.push([Math.cos(a) * rx * kk, Math.sin(a) * ry * kk]); } return r; };
  const lip = { fill: mouthC, shadow: '#6e5e4e', shade: 0.3, tex: 'mottle' + f.o.seed, texOp: 0.4, inkW: 1.3, inkHeavy: 1.8, cast: false, hatch: false };
  const tooth = (p, inw, s) => { const pp = [-inw[1], inw[0]]; f.flat([add(p, mul(pp, -s * 0.5)), add(p, mul(pp, s * 0.5)), add(add(p, mul(inw, s * 1.5)), mul(pp, s * 0.55))], '#e8dec4'); f.line([add(p, mul(pp, s * 0.5)), add(add(p, mul(inw, s * 1.5)), mul(pp, s * 0.55))], 0.6, ink, { op: 0.6 }); };
  if (o.head === 'side') {
    const hc = add(C[0], mul(F0, 0.12 * w)), ph = (o.seed || 1) * 1.7;
    for (let k = 0; k < 9; k++) { const a = -1.3 + k * 0.33, q = HF(hc, [[Math.cos(a) * 0.17 * w + 0.02 * w, Math.sin(a) * 0.66 * w]])[0]; f.part(ell(q, 2.3 * sc, 2.0 * sc, 0, 7), Object.assign({}, lip, { inkW: 0.8, inkHeavy: 1 })); } // fringe papillae
    f.part(HF(hc, wob(0.16 * w, 0.62 * w, ph)), lip);
    f.flat(HF(hc, wob(0.07 * w, 0.48 * w, ph + 1).map(q => [q[0] + 0.06 * w, q[1]])), '#1c0f0e'); // the gape, seen edge-on
    for (let k = 0; k < 6; k++) { const y = -0.38 + k * 0.15, p = HF(hc, [[0.05 * w, y * w]])[0]; tooth(p, mul(F0, 1), 2.4 * sc); }
    f.line(HF(hc, [[-0.1 * w, -0.5 * w], [-0.14 * w, 0], [-0.1 * w, 0.5 * w]]), 1, ink, { op: 0.5 }); // the hood fold behind the disc
  } else if (o.head === 'q3') {
    const hc = add(C[0], mul(F0, 0.2 * w)), ph = (o.seed || 1) * 1.3, rx = (o.discX || 0.44) * w, ry = 0.74 * w;
    const rim = wob(rx, ry, ph, 26);
    rim.forEach((q, k) => { if (R() < 0.55) f.part(ell(HF(hc, [[q[0] * (1.03 + R() * 0.06), q[1] * (1.03 + R() * 0.06)]])[0], (1.2 + R() * 1.4) * sc, (1 + R()) * sc, R() * 3, 7), Object.assign({}, lip, { inkW: 0.5, inkHeavy: 0.7, shade: 0.2 })); }); // a soft, uneven fringe of papillae
    f.part(HF(hc, rim), lip);
    f.part(HF(add(hc, mul(F0, 0.04 * w)), rim.map(q => [q[0] * 0.74, q[1] * 0.76])), { fill: '#8e7466', shadow: '#3e2a28', shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.4 });
    // radial rows of hooked teeth, pointing in toward the throat
    const tc = add(hc, mul(F0, 0.06 * w));
    for (let k = 0; k < 11; k++) { const a = Math.PI * 2 * k / 11 + ph + (R() - 0.5) * 0.2; for (const r of [0.72, 0.55, 0.4]) { if (R() < 0.12) continue; const rr = r + (R() - 0.5) * 0.06, p = HF(tc, [[Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]])[0], inw = E.norm(sub(tc, p)); tooth(p, inw, (1.2 + r * 2.4 + R() * 0.8) * sc); } }
    f.flat(HF(tc, wob(rx * 0.26, ry * 0.3, ph + 2, 14)), '#120707'); // throat
    const tg = HF(tc, [[-0.02 * w, 0.06 * w]])[0]; f.flat(ell(tg, 0.09 * w, 0.05 * w, ax + 1.57, 8), '#b89a88'); for (let k = -1; k <= 1; k++) tooth(add(tg, rot([k * 2.4 * sc, 0], ax + 1.57)), [Math.cos(ax), Math.sin(ax)], 1.6 * sc); // the rasping tongue
    f.line(HF(hc, rim.slice(4, 15).map(q => [q[0] * 0.96, q[1] * 0.96])), 1.4, '#f4ecd8', { op: 0.55 }); // wet rim
  } else if (o.head === 'bite') {
    const hc = add(C[0], mul(F0, 0.03 * w));
    f.part(HF(hc, wob(0.12 * w, 0.66 * w, o.seed || 1)), Object.assign({}, lip, { fill: mix(mouthC, colD, 0.3) }));
    f.line(HF(hc, [[0.1 * w, -0.6 * w], [0.13 * w, 0], [0.1 * w, 0.6 * w]]), 1.6, '#1a0e0c', { op: 0.8 }); // clamped edge
    for (let k = 0; k < 3; k++) f.line(HF(C[dIdx((0.9 + k * 0.25) * w)], [[0, -W[0] * 0.3], [-1.5, 0], [0, W[0] * 0.3]]), 0.9, ink, { op: 0.4 }); // throat rings working
  }
  return { C, T, N, W, S, L, poly };
}
// where a lamprey has clamped onto flesh: a bruised, puckered ring with radial wrinkles and a thin dark weep
function biteMark(f, c, ang, w, o = {}) {
  const ink = f.o.ink, F = frame(c, ang, 1);
  f.flat(F(ell([0, 0], 0.26 * w, 0.82 * w, 0, 16)), o.bruise || '#4a3448', { op: 0.55 });
  for (let k = 0; k < 9; k++) { const a = -1.4 + k * 0.35; f.line(F([[Math.cos(a) * 0.3 * w, Math.sin(a) * 0.8 * w], [Math.cos(a) * 0.55 * w, Math.sin(a) * 1.05 * w]]), 0.9, ink, { op: 0.45 }); }
  if (o.weep !== false) f.stroke([add(c, [0, w * 0.5]), add(c, [-1, w * 0.9]), add(c, [1, w * 1.5])], 3, '#2a1a20', { op: 0.7 });
}
// an old healed lamprey scar: a round puckered sore with a ring of tooth pricks
function lampreyScar(f, c, r) { const ink = f.o.ink; f.flat(ell(c, r, r * 0.9, 0.3, 12), '#6a4a58', { op: 0.5 }); f.flat(ell(c, r * 0.45, r * 0.4, 0.3, 10), '#2a1a20', { op: 0.65 }); for (let k = 0; k < 10; k++) { const a = k * 0.63; f.flat(ell(add(c, [Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.68]), 0.9, 0.9, 0, 5), '#1a1014', { op: 0.6 }); } f.line(ell(c, r * 1.05, r * 0.95, 0.3, 12).slice(2, 8), 0.9, '#e0d8cc', { op: 0.4 }); }


// One continuous outline for a two-segment limb (shoulder-elbow-wrist, hip-knee-ankle) instead of two capped tubes:
// the bony point (olecranon, kneecap) juts on the outside of the bend, muscle bellies swell on the other side near the
// joint above and below, the far end narrows to a bony wrist or ankle. ws: [top, joint, end] widths.
// o.point, o.mus0, o.mus1: bump sizes. Returns the polygon (open ends; hide them under the torso and the hand).
function jointLimb(A, J, Bp, ws, o = {}) {
  const K = require('../kit');
  const out = E.norm(mul(add(E.norm(sub(A, J)), E.norm(sub(Bp, J))), -1));
  const sideOf = (a, b) => { const d = E.norm(sub(b, a)), n = [-d[1], d[0]]; return n[0] * out[0] + n[1] * out[1] > 0 ? 'p' : 'q'; };
  const s0 = sideOf(A, J), s1 = sideOf(J, Bp), bp = [], bq = [], push = (sd, v) => (sd === 'p' ? bp : bq).push(v), opp = sd => (sd === 'p' ? 'q' : 'p');
  push(s0, [0, 1, o.point ?? 0.45, 0.07]); push(s1, [1, 0, o.point ?? 0.45, 0.07]);
  push(opp(s0), [0, o.mus0At ?? 0.45, o.mus0 ?? 0.2, 0.2]); push(opp(s1), [1, 0.22, o.mus1 ?? 0.24, 0.14]);
  push(s1, [1, 0.35, (o.mus1 ?? 0.24) * 0.5, 0.18]);
  return K.chain([A, J, Bp], ws, { bp, bq, steps: 10 });
}

module.exports = { PAL, fx, humanJoints, webHand, scaleDefs, poolBack, ripples, waveLock, hairMass, ik, spline, arcLen, clipDraw, strip, lamprey, biteMark, lampreyScar, jointLimb };
