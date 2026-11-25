// World V, The Storm Foundry (Fire + Lightning, Plasma): shared helpers for world_V.js.
// Fire (dominant) consumes from inside: split skin and plate with glowing seams, charred edges, upward curling ash, flaking.
// Lightning strikes and scars: branching Lichtenberg burns, fused copper and bronze, standing hair, scorched metal.
// Never cartoon flames on heads; never glowing outlines or sci-fi arcs (arcs here are jagged ink-cored threads).
// Palette: bronze, white-gold arcs, soot, plus ink black, bone and grey (and the shared material library: leather,
// wrought iron, copper on bronze work). Ember orange is the fire inside the bronze.
// The copied fire helpers (seam, crackNet, ash, smoke, soot, flakes, fuse, rope, chainLinks, fullLeg, legRig, armRig,
// legTube, bootRig, humanJoints, ik, spline, clipDraw, lumpy) come from the world IV kit; everything else is new.
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  bronze: '#94683a', bronzeL: '#c4975c', bronzeD: '#4e3418', bronzeP: '#e2c08a', // bronze: warm brown, bright where worn
  copper: '#9a5a38', copperL: '#c88458', copperD: '#4e2a1a',
  arc: '#fff6d8', arcG: '#f4dc92', arcD: '#c8a856', // white-gold arcs
  lamp: '#e2782a', lampL: '#f6a848', hot: '#ffd890', core: '#fff4d0', ember: '#b8481c', // fire inside the bronze
  soot: '#2a2420', sootL: '#45392f', sootD: '#15110e', char: '#1c120c',
  bone: '#d6cdb8', boneD: '#9a917e', grey: '#77736a', greyD: '#4e4b45', greyL: '#a8a49a',
  iron: '#3a3632', ironL: '#5e5852', ironD: '#221f1c', rust: '#6a3a22', rustL: '#8e5430',
  slag: '#16130f', slagL: '#3e3a36',
  wood: '#4e3a26', woodD: '#2e2216', woodL: '#76603e',
  leath: '#4c3522', leathD: '#2a1c12', leathL: '#70523a',
  canvas: '#5e5444', canvasD: '#3e362c', canvasL: '#7e7260',
  skin: '#9c826a', skinS: '#3e2c26', skinL: '#c0a488', // soot-grimed forge skin
  scar: '#45281c', scarL: '#b49884', // burn scar brown and the shiny pale keloid
  smoke: '#6a6058', ochL: '#9a8e80', ochD: '#3e3630',
  mud: '#231d18',
};

// the world's render setup: kit.foeBase, sooty floor, warm-brown shadow tint; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.27), shadowTint: '#221a18', mud: P.mud }, o));

// textures and glow filters for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  let c = '';
  for (let i = 0; i < 18; i++) { let x = r() * 48, y = r() * 48, a = r() * 6.3; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 3; k++) { a += (r() - 0.5) * 1.6; x += Math.cos(a) * (3 + r() * 5); y += Math.sin(a) * (3 + r() * 5); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } c += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="craze${s}" patternUnits="userSpaceOnUse" width="48" height="48">${c}</pattern>`);
  f.defs.push(`<filter id="sootf${s}"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="${s + 21}"/><feColorMatrix values="0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 -2.4 1.3"/></filter>`);
  f.defs.push(`<pattern id="soot${s}" patternUnits="userSpaceOnUse" width="400" height="400"><rect width="400" height="400" filter="url(#sootf${s})"/></pattern>`);
  // hammered bronze: shallow dished dimples, dark lower lip and a pale upper lip toward the key light
  let h = '';
  for (let i = 0; i < 26; i++) { const x = r() * 44, y = r() * 44, rx = 2.2 + r() * 3.2, ry = rx * (0.6 + r() * 0.3); h += `<path d="M${(x - rx).toFixed(1)},${y.toFixed(1)} a${rx.toFixed(1)},${ry.toFixed(1)} 0 0 0 ${(2 * rx).toFixed(1)},0" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.45"/><path d="M${(x - rx * 0.8).toFixed(1)},${(y - 0.6).toFixed(1)} a${rx.toFixed(1)},${ry.toFixed(1)} 0 0 1 ${(1.6 * rx).toFixed(1)},0" fill="none" stroke="#f4e2b8" stroke-width="0.7" opacity="0.35"/>`; }
  f.defs.push(`<pattern id="hammer${s}" patternUnits="userSpaceOnUse" width="44" height="44">${h}</pattern>`);
  // pitting on iron
  let g = '';
  for (let i = 0; i < 40; i++) { const x = r() * 30, y = r() * 30, rr = 0.5 + r() * 1.2; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > 0.35 ? INK : '#c8b8a0'}" opacity="${r() > 0.5 ? 0.45 : 0.3}"/>`; }
  f.defs.push(`<pattern id="pit${s}" patternUnits="userSpaceOnUse" width="30" height="30">${g}</pattern>`);
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  f.defs.push(`<filter id="glow${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>`);
  f.defs.push(`<filter id="glowL${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>`);
  f.defs.push(`<filter id="smk${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`);
}

const R = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
const pd = pts => E.smooth(pts, false);

// soft glow: an ellipse or a line of light, blurred (big = the large filter)
function glow(f, c, rx, ry, col = P.lamp, op = 0.3, big = false, a = 0) {
  f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
}
function glowLine(f, pts, w, col = P.lamp, op = 0.4, big = false) {
  f.raw(`<path d="${pd(pts)}" fill="none" stroke="${col}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
}

// a split in the skin with a glowing seam: charred lips, an orange core, a hot thread, a soft bloom
function seam(f, pts, w = 3, o = {}) {
  if (o.glow !== false) glowLine(f, pts, w * 4, P.lamp, o.glowOp ?? 0.35);
  f.stroke(pts, w * 2.6, P.char, { op: 0.9 });
  f.stroke(pts, w * 1.5, P.ember);
  f.stroke(pts, w * 1.05, P.lamp);
  f.stroke(pts.slice(1, -1).length > 1 ? pts.slice(1, -1) : pts, w * 0.45, o.hot || P.hot);
}
// a random branching crack network from c, heading ang, total length len, width w
function crackNet(f, c, a, len, w, o = {}) {
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 4;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * 0.9; q = add(q, rot([L / n, 0], b)); pts.push(q); }
    seam(f, pts, ww, o);
    if (depth > 0) for (let k = 1; k < n; k++) if (f.r() < (o.fork ?? 0.55)) go(pts[k], b + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), L * R(f, 0.35, 0.6), ww * 0.65, depth - 1);
  };
  go(c, a, len, w, o.depth ?? 2);
}
// a hairline seam starting: dark crack with a faint glow at its heart (a skin about to split)
function hairline(f, pts, w = 1.4) { f.line(pts, w + 1.2, P.char, { op: 0.8 }); f.line(pts.slice(1, -1).length > 1 ? pts.slice(1, -1) : pts, w * 0.6, P.lampL, { op: 0.85 }); }

// a falling bead (a drip): teardrop plus a drop below
function drip(f, p, s = 1, col = P.lampL) { f.flat([add(p, [-1.8 * s, 0]), add(p, [1.8 * s, 0]), add(p, [0, 8 * s])], col, { op: 0.9 }); f.flat(ell(add(p, [0, 13 * s]), 2.2 * s, 3.4 * s, 0, 6), col, { op: 0.9 }); f.flat(ell(add(p, [0.6 * s, 12 * s]), 0.7 * s, 1 * s, 0, 5), '#fff', { op: 0.6 }); }
// charred flakes lifting off a surface: dark curled flakes with a pale under-edge
function flakes(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = f.r() * 6.3, l = R(f, 5, 10) * s;
    f.flat([p, add(p, rot([l, -l * 0.2], a)), add(p, rot([l * 1.1, l * 0.35], a)), add(p, rot([l * 0.3, l * 0.4], a))], P.char, { op: 0.9 });
    f.line([add(p, rot([l * 0.3, l * 0.42], a)), add(p, rot([l * 1.08, l * 0.36], a))], 1, P.greyL, { op: 0.6 });
  }
}
// ash rising from p and curling: dark flakes and a few dull embers, getting smaller as they rise
function ash(f, p, n, spread = 40, rise = 140, s = 1) {
  for (let i = 0; i < n; i++) {
    const t = i / n, q = add(p, [(f.r() - 0.5) * spread + Math.sin(t * 7 + p[0]) * 10 * s, -t * rise - f.r() * 12]), r = (1.2 + f.r() * 2.6) * s * (1 - t * 0.5), a = f.r() * 6.3;
    if (f.r() < 0.25) f.flat(ell(q, r * 0.7, r * 0.7, 0, 6), f.r() > 0.5 ? P.lampL : P.hot, { op: 0.85 });
    else { f.flat([add(q, rot([-r * 1.4, 0], a)), add(q, rot([0, -r * 0.7], a)), add(q, rot([r * 1.4, -r * 0.2], a)), add(q, rot([r * 0.3, r * 0.5], a))], f.r() > 0.4 ? '#2a2420' : '#6a625a', { op: 0.8 }); }
  }
}
// a smoke wisp: a soft ochre body curling up from p0, with a thin ink-ochre curl to define it (no cartoon puffs)
function smoke(f, p0, h, w, o = {}) {
  const sw = o.sway ?? 18, ph = o.phase ?? 0, C = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; C.push(add(p0, [Math.sin(t * 4 + ph) * sw * t + (o.drift ?? 0) * t, -h * t])); }
  const L = [], Rr = [];
  C.forEach((c, i) => { const t = i / 10, ww = w * (0.35 + t * 0.9) / 2; L.push(add(c, [-ww, 0])); Rr.push(add(c, [ww, 0])); });
  f.raw(`<path d="${E.smooth([...L, ...Rr.reverse()])}" fill="${o.col || P.smoke}" opacity="${o.op ?? 0.32}" filter="url(#smk${f.o.seed})"/>`);
  f.line(C.slice(1).map((c, i) => add(c, [Math.sin(i * 1.3 + ph) * w * 0.2, 0])), 1.1, o.line || P.ochL, { op: o.lineOp ?? 0.55 });
  f.line(C.slice(3).map((c, i) => add(c, [w * 0.25 + Math.cos(i * 1.1 + ph) * w * 0.15, 4])), 0.9, P.ochD, { op: 0.4 });
}
// soot smudge
function soot(f, c, rx, ry, op = 0.5, a = 0) { f.flat(ell(c, rx, ry, a, 14).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3]) : q), P.sootD, { op }); }
// a lit fuse: twisted cord ending in a spitting spark
function fuse(f, pts, w = 3, o = {}) {
  f.line(pts, w + 2, INK);
  f.line(pts, w, o.col || '#5a4a30');
  const n = pts.length; let acc = 0;
  for (let i = 0; i < n - 1; i++) { const a = pts[i], b = pts[i + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; for (let t = acc % (w * 1.6); t < L; t += w * 1.6) { const q = add(a, mul(d, t)); f.line([add(q, mul(nn, w * 0.5)), add(add(q, mul(nn, -w * 0.5)), mul(d, w * 0.7))], 0.8, INK, { op: 0.6, straight: true }); } acc += L; }
  if (o.lit !== false) {
    const e = pts[n - 1], d = E.norm(sub(e, pts[n - 2]));
    f.line([lerp(pts[n - 2], e, 0.6), e], w + 0.6, P.char);
    glow(f, e, w * 5, w * 5, P.lampL, 0.6);
    for (let k = 0; k < 7; k++) { const a = Math.atan2(d[1], d[0]) + (f.r() - 0.5) * 2.6, l = w * R(f, 2, 5); f.line([e, add(e, rot([l, 0], a))], 1, k % 2 ? P.hot : P.core, { op: 0.95, straight: true }); }
    f.flat(ell(e, w * 0.9, w * 0.9, 0, 8), P.core);
  }
}
// rope or cord with twist ticks
function rope(f, pts, w, o = {}) {
  const col = o.col || '#8a7650';
  f.line(pts, w + 2.2, INK, { k: o.k });
  f.line(pts, w, col, { k: o.k });
  f.line(pts.map(q => add(q, [w * 0.18, -w * 0.18])), Math.max(0.7, w * 0.22), mix(col, '#fff', 0.35), { op: 0.6, k: o.k });
  const n = pts.length; let acc = 0;
  for (let i = 0; i < n - 1; i++) { const a = pts[i], b = pts[i + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; for (let t = (acc % (w * 1.4)); t < L; t += w * 1.4) { const q = add(a, mul(d, t)); f.line([add(q, mul(nn, w * 0.5)), add(add(q, mul(nn, -w * 0.5)), mul(d, w * 0.6))], 0.9, INK, { op: 0.6, straight: true }); } acc += L; }
}
// iron chain of alternating links along a polyline; s = link length
function chainLinks(f, pts, s, col = P.iron, o = {}) {
  const C = []; for (let i = 0; i < pts.length - 1; i++) { const L = E.len(sub(pts[i + 1], pts[i])), n = Math.max(1, Math.round(L / (s * 0.8))); for (let k = 0; k < n; k++) C.push([lerp(pts[i], pts[i + 1], k / n), lerp(pts[i], pts[i + 1], (k + 1) / n)]); }
  C.forEach(([a, b], i) => {
    const m = lerp(a, b, 0.5), an = ang(a, b);
    if (i % 2) { f.line([add(m, rot([-s * 0.5, 0], an)), add(m, rot([s * 0.5, 0], an))], s * 0.26 + 1.6, INK, { straight: true }); f.line([add(m, rot([-s * 0.45, 0], an)), add(m, rot([s * 0.45, 0], an))], s * 0.22, mix(col, '#fff', 0.15), { straight: true }); }
    else { const e = ell(m, s * 0.58, s * 0.3, an, 12); f.line(e.concat([e[0]]), s * 0.2 + 1.6, INK); f.line(e.concat([e[0]]), s * 0.16, col); f.line(e.slice(7, 11), 0.9, mix(col, '#fff', 0.5), { op: 0.8 }); }
  });
}
// a whole bare leg, hip to toes, in one outline (knee and ankle are soft bends). dir +1 = toes right.
function fullLeg(f, Hp, Kn, A, dir, s, wH, wK, look, o = {}) {
  const gy = o.groundY ?? f.o.groundY, ax = A[0], ay = A[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir * u * s;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d[1] * dir, -d[0] * dir]; };
  const nT = nrm(Hp, Kn), nS = nrm(Kn, A), nK = E.norm(add(nT, nS));
  const tq = o.thigh ?? 0.08, cf = o.calf ?? 1.18;
  const at = (t, off) => add(lerp(Kn, A, t), mul(nS, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    add(Hp, mul(nT, wH / 2)), add(lerp(Hp, Kn, 0.4), mul(nT, wH * 0.5 * (1 + tq))), add(lerp(Hp, Kn, 0.8), mul(nT, (wH + wK) * 0.25)),
    add(Kn, mul(nK, wK * 0.56)), at(0.18, wK * 0.46), at(0.45, wK * 0.4), at(0.72, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    at(0.72, -(wa * 0.62 + 2)), at(0.36, -wK * 0.5 * (cf + sw * 0.1)), at(0.12, -wK * 0.52), add(Kn, mul(nK, -wK * 0.5)),
    add(lerp(Hp, Kn, 0.6), mul(nT, -wH * 0.5 * (1 + tq * 0.6))), add(Hp, mul(nT, -wH / 2)),
  ];
  for (let i = 3; i >= 1; i--) { const tx = 1.0 - i * 0.075; f.part([[X(tx - 0.12), gy - h * (0.3 + i * 0.02)], [X(tx + 0.05), gy - h * (0.32 + i * 0.02)], [X(tx + 0.13), gy - h * 0.14], [X(tx + 0.1), gy - 1], [X(tx - 0.08), gy - 1]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.5, fill: mix(look.fill, '#1a1008', 0.2) })); }
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const dk = mix(look.fill, '#1a100a', 0.5), lt = mix(look.fill, '#fff', 0.3);
  f.line([add(Kn, mul(nK, wK * 0.5)), add(add(Kn, mul(nK, wK * 0.2)), mul(sub(A, Kn), 0.06)), add(add(Kn, mul(nK, wK * 0.45)), mul(sub(A, Kn), 0.14))], 1.2, INK, { op: 0.55 });
  f.line([add(Kn, mul(nK, -wK * 0.2)), add(add(Kn, mul(nK, -wK * 0.45)), mul(sub(Kn, Hp), -0.03))], 1, INK, { op: 0.5 });
  f.line([at(0.12, wK * 0.28), at(0.5, wK * 0.26), at(0.82, wa * 0.4)], 1, lt, { op: 0.5 });
  f.line([[X(-0.06), ay + h * 0.2], [X(0.05), ay + h * 0.12], [X(0.12), ay + h * 0.26]], 1.1, INK, { op: 0.5 });
  f.line([[X(-0.25), ay - h * 0.1], [X(-0.27), gy - h * 0.42]], 1, dk, { op: 0.7 });
  f.line([[X(0.36), ay + h * 0.36], [X(0.64), gy - h * 0.5], [X(0.9), gy - h * 0.38]], 1, lt, { op: 0.6 });
  f.part([[X(1.0), gy - h * 0.35], [X(1.13), gy - h * 0.3], [X(1.23), gy - h * 0.18], [X(1.24), gy - h * 0.07], [X(1.13), gy - h * 0.05], [X(1.03), gy - h * 0.15]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.4, cast: false, shade: 0.35 }));
  f.flat([[X(1.13), gy - h * 0.27], [X(1.21), gy - h * 0.19], [X(1.22), gy - h * 0.11], [X(1.14), gy - h * 0.15]], o.nail || mix(look.fill, '#e8e0cc', 0.4), { op: 0.9 });
  f.line([[X(0.92), gy - 2], [X(1.02), gy - h * 0.13]], 1, INK, { op: 0.6 });
  f.line([[X(-0.18), gy - 2], [X(0.06), gy - 2]], 1.6, dk, { op: 0.6, straight: true });
  return pts;
}
// a bare leg cut for the rig at knee and ankle
function legRig(f, Hp, Kn, A, s, wH, wK, look, sfx, o = {}) {
  const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  return split(f, () => fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o), [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, [side(Kn, dk, wK * 0.6), side(A, mul(da, -1), s * 0.34)]], ['foot' + sfx, side(A, da, s * 0.34)]]);
}
// a soft tube shoulder to wrist (sleeve or bare arm), cut at the elbow. ws: widths at shoulder, elbow, wrist
function armRig(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const de = elb(S0, E0, W0);
  return split(f, () => {
    const d = f.part(K.chain([S0, E0, W0], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
    if (o.muscle !== false) { f.line([lp(S0, E0, 0.3, ws[0] * 0.15), lp(S0, E0, 0.85, ws[1] * 0.1)], 1.1, INK, { op: 0.4 }); f.line([lp(E0, W0, 0.05, -ws[1] * 0.3), add(E0, mul(de, -ws[1] * 0.1)), lp(S0, E0, 0.92, -ws[1] * 0.3)], 1.2, INK, { op: 0.5 }); }
    if (o.after) o.after();
    return d;
  }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
}
// a trouser or breeches tube from hip through knee to a cuff, cut at the knee
function legTube(f, Hp, Kn, cu, ws, look, sfx, o = {}) {
  const A = o.A || cu, dk = elb(Hp, Kn, A);
  return split(f, () => {
    const d = f.part(K.chain([Hp, Kn, cu], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
    if (o.after) o.after();
    return d;
  }, [['thigh' + sfx, side(Kn, mul(dk, -1), ws[1] * 0.6)], ['shin' + sfx, side(Kn, dk, ws[1] * 0.6)]]);
}
// a boot cut at the ankle for the rig
function bootRig(f, K0, A, s, col, sfx, o = {}) {
  const da = add(E.norm(sub(A, K0)), [0.6, 0]);
  return split(f, () => K.B.boot(f, A, 1, s, col, o), [['shin' + sfx, side(A, mul(da, -1), s * 0.36)], ['foot' + sfx, side(A, da, s * 0.36)]]);
}
// standard humanoid skeleton. J: { P, T, N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF }
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  if (J.HN) f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  if (J.HF) f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
// two-bone IK: the elbow for a shoulder S reaching a wrist W with segment lengths l1, l2; sign picks the bend side
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), b = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], b + sign * a)), Wr];
}
// Catmull-Rom spline through control points, resampled about every `step` px
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
// point and tangent at arc length u along C (with its arcLen table S)
function at(C, S, u) { let i = 1; while (i < C.length - 1 && S[i] < u) i++; const t = Math.max(0, Math.min(1, (u - S[i - 1]) / ((S[i] - S[i - 1]) || 1))); const p = lerp(C[i - 1], C[i], t), d = E.norm(sub(C[i], C[i - 1])); return { p, d, n: [-d[1], d[0]] }; }
// draw() clipped to a region (SVG path d or polygon), on the current bone, in place
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], 1]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
// random lumps pushed out of an outline (keep amp small so the edge stays clean)
function lumpy(f, pts, amp) { const c = pts.reduce((a, p) => add(a, mul(p, 1 / pts.length)), [0, 0]); return pts.map(p => { const d = E.norm(sub(p, c)), k = (f.r() - 0.4) * amp; return p[2] ? [...add(p, mul(d, k)), 1] : add(p, mul(d, k)); }); }
// mud and soot splats
function splats(f, c, rx, ry, n, col = P.mud) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = 2 + f.r() * 5; f.flat(ell(p, r * 1.4, r, f.r() * 3, 8), col, { op: 0.8 }); } }

// ---------------------------------------------------------------- new for the Storm Foundry
const BR = (f, o = {}) => Object.assign({ fill: P.bronze, shadow: P.bronzeD, light: P.bronzeP, shade: 0.42, tex: 'hammer' + f.o.seed, texOp: 0.7 }, o); // bronze plate
const CU = (f, o = {}) => Object.assign({ fill: P.copper, shadow: P.copperD, light: P.copperL, shade: 0.42, tex: 'hammer' + f.o.seed, texOp: 0.5 }, o); // copper
const IR = (f, o = {}) => Object.assign({ fill: P.iron, shadow: P.ironD, shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.8 }, o); // wrought iron
const SK = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.36, tex: 'mottle' + f.o.seed, texOp: 0.6 }, o); // grimed skin
const LEA = (f, o = {}) => Object.assign({ fill: P.leath, shadow: P.leathD, shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.4 }, o);
const CAN = (f, o = {}) => Object.assign({ fill: P.canvas, shadow: '#2a241e', shade: 0.38, tex: 'weave' + f.o.seed, texOp: 0.45 }, o);

// Lichtenberg burn: a fern of branching scars from c heading a, length len, trunk width w.
// skin: a dark burnt-umber channel with a pale shiny keloid edge. o.metal: scorched black branches with a thin
// white-gold thread of fused metal in the trunk. No bloom: it is a scar, not light.
function lichtenberg(f, c, a, len, w, o = {}) {
  const dark = o.metal ? P.sootD : (o.col || P.scar), lite = o.metal ? P.arcG : P.scarL;
  const branches = [];
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 5;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * 0.7; q = add(q, rot([L / n, 0], b)); pts.push(q); }
    branches.push([pts, ww, depth]);
    if (depth > 0) for (let k = 1; k < n; k++) {
      const nk = f.r() < 0.5 ? 2 : 1;
      for (let j = 0; j < nk; j++) if (f.r() < (o.fork ?? 0.8)) go(pts[k], b + (j ? -1 : 1) * (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.0), L * R(f, 0.3, 0.55), ww * 0.62, depth - 1);
    }
  };
  go(c, a, len, w, o.depth ?? 3);
  if (!o.metal) for (const [pts, ww] of branches) f.stroke(pts, ww + 1.6, lite, { op: 0.3 });
  for (const [pts, ww] of branches) f.stroke(pts, ww, dark, { op: o.op ?? 0.85 });
  if (o.metal) for (const [pts, ww, d] of branches) if (d >= (o.depth ?? 3)) f.line(pts.slice(0, 4), Math.max(0.7, ww * 0.25), P.arcG, { op: 0.6 });
}
// a jagged bolt from a to b: an ink thread with a white-gold core and a whiter heart; forks spit off it.
// The bloom is small and only where it grounds; the bolt never traces a shape's outline.
function bolt(f, a, b, o = {}) {
  const w = o.w ?? 2.4, n = o.n ?? Math.max(4, Math.round(E.len(sub(b, a)) / 22)), jit = o.jit ?? 0.28;
  const d = sub(b, a), L = E.len(d), nn = E.norm([-d[1], d[0]]);
  const pts = [a];
  for (let i = 1; i < n; i++) { const t = i / n; pts.push(add(add(a, mul(d, t)), mul(nn, (f.r() - 0.5) * 2 * jit * L / n * 2.2))); }
  pts.push(b);
  const draw = (q, ww) => { f.line(q, ww + 3.2, INK, { straight: true, op: 0.85 }); f.line(q, ww + 1.2, o.col || P.arcG, { straight: true }); f.line(q, Math.max(0.8, ww * 0.45), P.arc, { straight: true }); };
  if (o.bloom !== false) { f.raw(`<path d="M${pts.map(q => q.map(v => v.toFixed(1)).join(',')).join('L')}" fill="none" stroke="${P.arcG}" stroke-width="${(w * 4).toFixed(1)}" opacity="${o.bloomOp ?? 0.18}" filter="url(#glow${f.o.seed})"/>`); }
  draw(pts, w);
  const forks = o.forks ?? 3;
  for (let k = 0; k < forks; k++) {
    const i = 1 + Math.floor(f.r() * (n - 1)), p0 = pts[i], dir = Math.atan2(d[1], d[0]) + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), fl = L * R(f, 0.12, 0.28);
    const q = [p0]; let p = p0; for (let j = 0; j < 3; j++) { p = add(p, rot([fl / 3, 0], dir + (f.r() - 0.5) * 1.0)); q.push(p); }
    draw(q, w * 0.45);
  }
  if (o.ends !== false) for (const e of [a, b]) f.raw(`<circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="${(w * 3.5).toFixed(1)}" fill="${P.arcG}" opacity="0.3" filter="url(#glow${f.o.seed})"/>`);
  return pts;
}
// sparks thrown off a point: short white-gold streaks with dark tails, a few still hot dots
function sparks(f, c, n, r, o = {}) {
  for (let i = 0; i < n; i++) {
    const a = (o.ang ?? -Math.PI / 2) + (f.r() - 0.5) * (o.spread ?? 3.2), d = r * (0.3 + f.r() * 0.9), p = add(c, rot([d, 0], a)), l = R(f, 4, 12) * (o.s ?? 1);
    const t = add(p, rot([-l, 0], a));
    f.line([t, p], 2.6, INK, { straight: true, op: 0.5 }); f.line([t, p], 1.4, f.r() > 0.4 ? P.arcG : P.lampL, { straight: true }); f.flat(ell(p, 1.4, 1.4, 0, 6), P.arc);
  }
}
// slag droplets crusted on skin or cloth: black glassy beads, a pale glint, some still glowing inside
function slag(f, c, rx, ry, n, r0, r1, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, r0, r1), hot = f.r() < (o.hot ?? 0.25);
    f.part(lumpy(f, ell(p, r * 1.15, r, f.r() * 3, 9), r * 0.35), { fill: hot ? P.ember : P.slag, shadow: '#000', light: hot ? P.lampL : P.slagL, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, gritOp: 0.2 });
    if (hot) f.flat(ell(add(p, [r * 0.1, r * 0.1]), r * 0.45, r * 0.4, 0, 6), P.hot, { op: 0.9 });
    f.flat(ell(add(p, [r * 0.35, -r * 0.35]), r * 0.28, r * 0.18, -0.6, 6), '#e8e0d0', { op: 0.75 });
    f.flat(ell(add(p, [0, r * 0.9]), r * 1.0, r * 0.35, 0, 8), P.scar, { op: 0.35 }); // burnt ring round the bead
  }
}
// a row of rivets, optionally some sheared or fused (melted into a bead with a run below)
function rivetRow(f, a, b, n, r = 3, col = P.bronzeL, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = lerp(a, b, (i + 0.5) / n);
    if (o.fused && f.r() < o.fused) { f.flat(ell(p, r * 1.3, r * 1.1, 0, 8), P.bronzeD); f.flat(ell(add(p, [0, r * 1.6]), r * 0.6, r * 1.4, 0, 8), mix(col, '#000', 0.3), { op: 0.9 }); f.flat(ell(add(p, [r * 0.3, -r * 0.3]), r * 0.4, r * 0.3, 0, 6), P.arcG, { op: 0.8 }); }
    else if (o.missing && f.r() < o.missing) { f.flat(ell(p, r * 0.8, r * 0.8, 0, 8), '#0a0806'); }
    else f.rivet(p, r, col);
  }
}
// fused bronze: a run of metal melted and set hard, bright at its lip, sooty where it cooled
function fusedRun(f, p, len, w, o = {}) {
  const pts = [p, add(p, [w * 0.2, len * 0.4]), add(p, [-w * 0.15, len * 0.75]), add(p, [0, len])];
  f.stroke(pts, w + 2, INK, { op: 0.8 }); f.stroke(pts, w, o.col || P.bronzeD); f.stroke(pts.slice(0, 3), w * 0.4, P.bronzeP, { op: 0.7 });
  f.part(ell(add(p, [0, len + w * 0.3]), w * 0.75, w * 0.6, 0, 8), BR(f, { fill: o.col || P.bronze, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }));
}
// a toothed gear wheel: rim with teeth, spokes, hub, sooted and worn
function gear(f, c, r, teeth, o = {}) {
  const pts = [], a0 = o.a || 0;
  for (let i = 0; i < teeth; i++) { const a = a0 + i * Math.PI * 2 / teeth, da = Math.PI / teeth * 0.5; pts.push([...add(c, rot([r * 0.84, 0], a - da * 1.1)), 1], [...add(c, rot([r, 0], a - da * 0.55)), 1], [...add(c, rot([r, 0], a + da * 0.55)), 1], [...add(c, rot([r * 0.84, 0], a + da * 1.1)), 1]); }
  f.part(pts, BR(f, Object.assign({ shade: 0.45, inkW: 1.2, inkHeavy: 2 }, o.look || {})));
  f.flat(ell(c, r * 0.68, r * 0.68, 0, 20), '#0e0a08', { op: 0.85 });
  for (let i = 0; i < (o.spokes ?? 5); i++) { const a = a0 + 0.3 + i * Math.PI * 2 / (o.spokes ?? 5); f.part(limb(add(c, rot([r * 0.15, 0], a)), add(c, rot([r * 0.7, 0], a)), r * 0.16, r * 0.12, { steps: 4 }), BR(f, { inkW: 1, inkHeavy: 1.4, cast: false })); }
  f.part(ell(c, r * 0.24, r * 0.24, 0, 12), BR(f, { fill: P.bronzeL, inkW: 1.1, cast: false }));
  f.flat(ell(c, r * 0.08, r * 0.08, 0, 8), '#0a0806');
}
// soot smudge that follows a region's shape loosely (heat-blackening on plates)
function scorch(f, c, rx, ry, op = 0.55, a = 0) { soot(f, c, rx, ry, op, a); soot(f, add(c, [rx * 0.2, -ry * 0.25]), rx * 0.6, ry * 0.55, op * 0.8, a); }
// standing hair: wiry strands lifted straight up and out from a scalp line, frizzed at the tips
function standingHair(f, pts, len, o = {}) {
  const col = o.col || '#3a322a';
  pts.forEach((p, i) => { const a = -Math.PI / 2 + (o.lean ?? 0) + (i / (pts.length - 1 || 1) - 0.5) * (o.fan ?? 1.4) + (f.r() - 0.5) * 0.35, l = len * R(f, 0.6, 1.1); const q1 = add(p, rot([l * 0.5, 0], a + (f.r() - 0.5) * 0.4)), q2 = add(p, rot([l, 0], a + (f.r() - 0.5) * 0.6)); f.stroke([p, q1, q2], o.w ?? 3, col); if (f.r() < 0.4) f.line([q1, add(q1, rot([l * 0.3, 0], a + 0.8))], 0.9, col); });
}
// heat shimmer / bloom from a furnace opening
function furnace(f, pts, o = {}) {
  const bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2];
  f.flat(pts, P.ember);
  clipDraw(f, pts, () => {
    f.flat(ell(add(c, [0, (bb[3] - bb[1]) * 0.15]), (bb[2] - bb[0]) * 0.45, (bb[3] - bb[1]) * 0.42, 0, 14), P.lamp);
    f.flat(ell(add(c, [0, (bb[3] - bb[1]) * 0.25]), (bb[2] - bb[0]) * 0.28, (bb[3] - bb[1]) * 0.25, 0, 12), P.hot);
    f.flat(ell(add(c, [0, (bb[3] - bb[1]) * 0.32]), (bb[2] - bb[0]) * 0.13, (bb[3] - bb[1]) * 0.12, 0, 10), P.core);
    // coals: dark lumps at the bottom
    for (let i = 0; i < (o.coals ?? 7); i++) { const p = [bb[0] + (bb[2] - bb[0]) * f.r(), bb[3] - (bb[3] - bb[1]) * 0.12 * f.r()], r = (bb[2] - bb[0]) * R(f, 0.05, 0.1); f.flat(lumpy(f, ell(p, r * 1.2, r, 0, 8), r * 0.3), P.char, { op: 0.85 }); }
  });
  glow(f, c, (bb[2] - bb[0]) * 0.6, (bb[3] - bb[1]) * 0.6, P.lamp, o.glowOp ?? 0.35);
}
// a bare muscular arm (shoulder to wrist) with deltoid, biceps and forearm swell, cut at the elbow
function muscleArm(f, S0, E0, W0, ws, look, sfx, o = {}) {
  return armRig(f, S0, E0, W0, ws, look, sfx, Object.assign({ bp: [[0, 0.15, 0.16, 0.14], [0, 0.55, 0.12, 0.18], [1, 0.25, 0.14, 0.2]], bq: [[0, 0.4, 0.1, 0.2], [1, 0.2, 0.18, 0.18]] }, o));
}

// ---------------------------------------------------------------- added in the independent review
// bevel(): a lit band inside the edges that face the key light and a dark band inside the edges that face away, both
// following the shape's own (smoothed) outline, so a plate reads as having a thickness and a turned edge. d is the
// path string f.part() returns. w = band width; the thin hard lip is drawn at w * 0.3.
function bevel(f, d, bb, w = 6, o = {}) {
  const L = f.L, pad = 60, rx = bb[0] - pad, ry = bb[1] - pad, rw = bb[2] - bb[0] + pad * 2, rh = bb[3] - bb[1] + pad * 2;
  const cid = f.id('bvc'); f.defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
  const band = (k, sgn, col, op) => {
    const mid = f.id('bvm');
    f.defs.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${rx}" y="${ry}" width="${rw}" height="${rh}"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#fff"/><path d="${d}" transform="translate(${(-sgn * L[0] * k).toFixed(1)},${(-sgn * L[1] * k).toFixed(1)})" fill="#000"/></mask>`);
    return `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${col}" opacity="${op}" mask="url(#${mid})"/>`;
  };
  let g = `<g clip-path="url(#${cid})">`;
  g += band(w, 1, o.lite || P.bronzeP, o.liteOp ?? 0.28) + band(w * 0.3, 1, o.lite2 || '#f6e2b0', o.lite2Op ?? 0.55);
  g += band(w * 1.3, -1, o.dark || '#000', o.darkOp ?? 0.3) + band(w * 0.35, -1, o.dark || '#000', (o.darkOp ?? 0.3) * 1.4);
  g += '</g>';
  f.raw(g);
}
// bplate(): a hard bronze plate with bevel, optional heat tint along edges (straw gold to oxidised umber), dents with
// a lit lower lip, scratches, Lichtenberg burns, scorch, rivet rows. pts may carry corner flags. Returns the path d.
function bplate(f, pts, look, o = {}) {
  const d = f.part(pts, look), bb = E.bbox(pts);
  bevel(f, d, bb, o.bev ?? 7, o.bevO || {});
  clipDraw(f, pts, () => {
    if (o.scorch) for (const [c, rx, ry, op] of o.scorch) scorch(f, c, rx, ry, op ?? 0.55);
    if (o.heat) for (const [q, w] of o.heat) heatTint(f, q, w);
    if (o.lich) for (const L of o.lich) lichtenberg(f, L[0], L[1], L[2], L[3] || 3, { metal: true, depth: L[4] ?? 3 });
    if (o.dents) for (const [c, r, a] of o.dents) dent(f, c, r, a ?? 0);
    if (o.scr) for (const [c, r, n] of o.scr) f.scratches(c, r, n, P.bronzeP, 1.1, -0.7);
    if (o.verd) for (const [c, rx, ry] of o.verd) verdigris(f, c, rx, ry);
    if (o.after) o.after();
  });
  if (o.rivets) for (const [a, b, n, r] of o.rivets) rivetRow(f, a, b, n, r ?? 5, P.bronzeL, { fused: o.fused ?? 0.15, missing: o.missing ?? 0.08 });
  return d;
}
// a dent: a shallow dish, dark on the side toward the light (it is concave), a bright lip on the side away
function dent(f, c, r, a = 0) {
  const e = ell(c, r, r * 0.62, a, 14);
  f.flat(e, '#000', { op: 0.16 });
  f.line(e.slice(9, 15).concat([e[0]]), Math.max(1, r * 0.12), '#000', { op: 0.35 });
  f.line(e.slice(2, 8), Math.max(1, r * 0.1), P.bronzeP, { op: 0.55 });
}
// heat tint along an edge or seam: a straw-gold band at the hot edge fading to oxidised umber further in
function heatTint(f, pts, w) {
  f.stroke(pts, w * 2.2, '#3e1c10', { op: 0.35 });
  f.stroke(pts, w * 1.2, '#b07a3a', { op: 0.35 });
  f.stroke(pts, w * 0.5, '#e8c070', { op: 0.4 });
}
// verdigris in a recess: mottled blue-green bloom (bronze is green in its crevices)
function verdigris(f, c, rx, ry, op = 0.5) {
  for (let i = 0; i < 9; i++) { const p = scatter(f, c, rx, ry), r = R(f, 0.25, 0.6) * Math.min(rx, ry); f.flat(lumpy(f, ell(p, r * 1.3, r, f.r() * 3, 9), r * 0.4), i % 3 ? '#56755e' : '#7a947c', { op: op * R(f, 0.4, 0.8) }); }
}
// a weld where lightning fused two plates: a lumpy bead of re-set bronze across the join, a white-gold thread in it,
// the metal around it scorched
function weld(f, pts, w, o = {}) {
  const C = spline(pts, w * 0.8);
  f.stroke(C, w * 3.2, P.sootD, { op: 0.45 });
  for (let i = 0; i < C.length; i += 1) { const r = w * R(f, 0.55, 0.85); f.part(ell(add(C[i], [R(f, -1, 1) * w * 0.15, R(f, -1, 1) * w * 0.15]), r * 1.1, r, f.r() * 3, 8), { fill: mix(P.bronze, P.bronzeD, 0.3), shadow: P.bronzeD, light: P.bronzeP, shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, gritOp: 0.2 }); }
  f.line(C.filter((_, i) => i % 2 === 0), Math.max(0.8, w * 0.22), P.arcG, { op: 0.75 });
  if (o.lich !== false) lichtenberg(f, C[Math.floor(C.length / 2)], o.a ?? -1.2, w * 9, w * 0.5, { metal: true, depth: 2 });
}
// an articulated plate gauntlet clenched into a fist, in B.fist's frame (x along the hand from wrist to knuckles,
// the gripped object along y through the curled fingers). Each finger is three short riveted lames; the tip lame turns
// under. flip mirrors so the thumb can sit either side. look: a bronze look; s: size like B.fist.
function gauntlet(f, c, a, s, flip, look, o = {}) {
  s *= o.scale ?? 1.18;
  const F0 = frame(c, a, s), F = flip ? pts => F0(pts.map(p => p.length > 2 ? [p[0], -p[1], p[2]] : [p[0], -p[1]])) : F0;
  const iw = Math.max(1.2, s * 0.012), sub = (q, x = {}) => Object.assign({}, look, { inkW: iw, inkHeavy: iw * 1.6, cast: false }, x);
  const dk = mix(look.fill, '#000', 0.4), lt = look.light || P.bronzeP;
  if (o.cuff !== false) {
    f.part(F([[-1.36, -0.92], [-0.98, -0.8], [-0.98, 0.8], [-1.36, 0.94]]).map(q => [q[0], q[1], 1]), sub(0, { fill: mix(look.fill, '#000', 0.12) }));
    f.part(F([[-1.02, -0.8], [-0.62, -0.68], [-0.62, 0.68], [-1.02, 0.8]]).map(q => [q[0], q[1], 1]), sub(0));
    f.line(F([[-1.3, -0.84], [-1.3, 0.86]]), iw * 1.6, lt, { op: 0.5 });
    for (const y of [-0.6, 0.62]) f.rivet(F([[-0.82, y]])[0], Math.max(1.4, s * 0.05), P.bronzeL);
  }
  // under-glove: the dark leather/iron palm showing between the plates
  f.flat(F([[-0.7, -0.62], [0.82, -0.62], [0.86, 0.6], [-0.7, 0.6]]), P.ironD);
  // fingers: three lames each, back to front: little finger first
  const fy = [[-0.6, 0.29, 0.8], [-0.3, 0.29, 0.84], [0.0, 0.28, 0.8], [0.28, 0.26, 0.7]];
  for (let i = 3; i >= 0; i--) {
    const [y0, hh, x1] = fy[i], seg = [[0.3, 0.5], [0.48, 0.66], [0.64, x1]];
    seg.forEach(([xa, xb], j) => {
      const sh = j === 2 ? 0.03 : 0, pts = F([[xa, y0 + 0.02], [xb, y0 + 0.01 + sh], [xb + 0.04, y0 + hh * 0.5], [xb, y0 + hh - sh], [xa, y0 + hh]]);
      f.part(pts, sub(0, { fill: j === 2 ? mix(look.fill, '#000', 0.25) : look.fill, k: 0.4, shade: 0.5 }));
      f.line(F([[xa + 0.03, y0 + 0.05], [xb - 0.02, y0 + 0.045]]), iw, lt, { op: 0.55 });
      if (j === 0) f.rivet(F([[xa + 0.08, y0 + hh * 0.5]])[0], Math.max(1.2, s * 0.035), P.bronzeL);
    });
    f.flat(F([[x1 - 0.08, y0 + hh - 0.06], [x1 + 0.02, y0 + hh * 0.5], [x1 - 0.02, y0 + hh - 0.01]]), dk, { op: 0.7 }); // the tip turning under
  }
  // back of the hand: a riveted plate with a raised knuckle ridge, then the knuckle guard
  f.part(F([[-0.72, -0.56], [-0.2, -0.66], [0.3, -0.64], [0.34, 0.62], [-0.2, 0.64], [-0.72, 0.54]]).map(q => [q[0], q[1], 1]), sub(0, { k: 0.8, shade: 0.42 }));
  f.line(F([[-0.6, -0.08], [0.2, -0.1]]), iw * 2.2, lt, { op: 0.45 });
  f.line(F([[-0.6, 0.0], [0.2, -0.02]]), iw, '#000', { op: 0.5 });
  f.part(F([[0.18, -0.66], [0.38, -0.64], [0.4, 0.62], [0.2, 0.64]]).map(q => [q[0], q[1], 1]), sub(0, { fill: mix(look.fill, '#fff', 0.08) }));
  for (let i = 0; i < 4; i++) { const y = fy[i][0] + fy[i][1] * 0.5; f.part(F(ell([0.29, y], 0.07, 0.11, 0, 8)), sub(0, { fill: mix(look.fill, '#fff', 0.12), shade: 0.5 })); }
  f.rivet(F([[-0.4, -0.38]])[0], Math.max(1.4, s * 0.045), P.bronzeL); f.rivet(F([[-0.4, 0.36]])[0], Math.max(1.4, s * 0.045), P.bronzeL);
  // thumb: a plate over the base, two lames wrapping over the index finger
  if (o.thumb !== false) {
    f.part(F([[-0.5, -0.5], [-0.1, -0.84], [0.12, -0.8], [0.08, -0.56], [-0.3, -0.36]]), sub(0, { k: 0.6 }));
    f.part(F([[0.06, -0.84], [0.36, -0.86], [0.4, -0.66], [0.1, -0.58]]).map(q => [q[0], q[1], 1]), sub(0));
    f.part(F([[0.34, -0.86], [0.6, -0.78], [0.6, -0.62], [0.38, -0.64]]).map(q => [q[0], q[1], 1]), sub(0, { fill: mix(look.fill, '#000', 0.15) }));
    f.line(F([[-0.4, -0.5], [0.04, -0.78]]), iw * 1.4, lt, { op: 0.5 });
  }
  return F;
}
function gauntletGrip(f, c, elbow, thumbAng, s, look, o = {}) {
  const g = K.B.gripAngle(c, elbow, thumbAng, o);
  g.F = gauntlet(f, c, g.ang, s, g.flip, look, o);
  return g;
}
// an engineered limb segment: a bronze cylinder from a to b with flanged collars at the ends, a lit stripe and edge
// shading so it reads round, optional rivets on the flanges
function cylinder(f, a, b, wa, wb, look, o = {}) {
  const d = f.part(limb(a, b, wa, wb, { steps: 6, capK: o.capK ?? 0.18, p: o.p, q: o.q }), Object.assign({ k: 0.85 }, look));
  bevel(f, d, E.bbox([add(a, [-wa, -wa]), add(b, [wb, wb]), add(a, [wa, wa]), add(b, [-wb, -wb])]), Math.max(4, (wa + wb) * 0.05));
  const dn = E.norm(sub(b, a)), nn = [-dn[1], dn[0]], side = (nn[0] * f.L[0] + nn[1] * f.L[1]) > 0 ? 1 : -1;
  f.line([lp(a, b, 0.08, side * wa * 0.26), lp(a, b, 0.92, side * wb * 0.26)], Math.max(1.4, wa * 0.05), P.bronzeP, { op: 0.45, straight: true });
  for (const [t, ww] of (o.flanges || [[0.02, wa * 1.14], [0.98, wb * 1.14]])) {
    const c = lerp(a, b, t), pts = [add(c, add(mul(nn, ww / 2), mul(dn, -ww * 0.06))), add(c, add(mul(nn, ww / 2), mul(dn, ww * 0.06))), add(c, add(mul(nn, -ww / 2), mul(dn, ww * 0.06))), add(c, add(mul(nn, -ww / 2), mul(dn, -ww * 0.06)))].map(q => [q[0], q[1], 1]);
    f.part(pts, Object.assign({}, look, { fill: o.flangeCol || mix(look.fill, '#000', 0.2), inkW: 1.4, inkHeavy: 2, cast: false }));
    if (o.rivets !== false) for (const u of [-0.32, 0, 0.32]) f.rivet(add(c, mul(nn, u * ww)), Math.max(1.6, ww * 0.035), P.bronzeL);
  }
  return d;
}
// a ball-and-socket or hinge joint for the engineered limbs: an iron ball, a bronze socket ring, a pin
function hinge(f, c, r, o = {}) {
  f.part(ell(c, r, r, 0, 16), IR(f, { fill: P.ironL, inkW: 1.6 }));
  f.line(ell(c, r * 0.78, r * 0.78, 0, 16).slice(10, 16), Math.max(1.2, r * 0.12), '#a8a49a', { op: 0.6 });
  f.part(ell(c, r * 0.42, r * 0.42, 0, 12), BR(f, { fill: P.bronzeL, inkW: 1.2, cast: false }));
  f.flat(ell(c, r * 0.14, r * 0.14, 0, 8), '#0a0806');
}

// a sculpted groove in cast bronze: a dark cut, verdigris packed in it, and a lit lip on the wall that faces the light
function groove(f, pts, w, o = {}) {
  const C = pts.length > 2 ? spline(pts, 6) : pts;
  if (o.verd !== false) f.stroke(C, w * 3, '#4f7a64', { op: o.vOp ?? 0.4 });
  f.stroke(C, w * 1.3, '#1a0e06', { op: 0.75 });
  f.stroke(C.map(q => add(q, mul(f.L, -w * 1.1))), w * 0.7, P.bronzeP, { op: 0.55 });
}

// the outline of B.head's face in head units (so overlays can be clipped to the face)
const faceOutline = (jaw = 1, chin = 0) => [[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32 + chin * 0.5, 0.37], [0.29 + chin, 0.47], [0.13 + chin * 0.5, 0.535 + chin * 0.2], [-0.06 - 0.08 * (jaw - 1), 0.47 + 0.04 * (jaw - 1)], [-0.21 - 0.1 * (jaw - 1), 0.27], [-0.30, 0.08], [-0.37, -0.13]];
module.exports = { groove, bevel, bplate, dent, heatTint, verdigris, weld, gauntlet, gauntletGrip, cylinder, hinge, faceOutline, P, base, textures, R, scatter, ang, elb, pd, glow, glowLine, seam, crackNet, hairline, drip, flakes, ash, smoke, soot, fuse, rope, chainLinks, fullLeg, legRig, armRig, legTube, bootRig, humanJoints, ik, spline, arcLen, at, clipDraw, lumpy, splats, SK, LEA, CAN, BR, CU, IR, lichtenberg, bolt, sparks, slag, rivetRow, fusedRun, gear, scorch, standingHair, furnace, muscleArm, split, side };
