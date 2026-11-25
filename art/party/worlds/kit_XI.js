// World XI, The Stilled Spire (Frost + Lightning, Lockdown): local helpers for world_XI.js. Shared files stay frozen.
// Copied and recoloured from reviewed kits: kit_V (bevel, bplate, dent, rivetRow, fusedRun, gear, weld, gauntlet,
// cylinder, hinge, lichtenberg, bolt, rope, chainLinks, legRig, armRig, legTube, bootRig, humanJoints, ik, spline,
// clipDraw, lumpy) and kit_VIII (icicle, icicles, rimeCrust, facets, frostCracks, the rime and crack textures).
//
// Frost (dominant) stills and preserves: rime crust on the windward side, icicles that hang plumb, faceted planes,
//   bodies, cloth and hair stopped mid-motion. Never clean ice crystals or snowflakes: all ice here is rough, dull,
//   cracked and dirty-white.
// Lightning strikes and scars: branching Lichtenberg burns, fused brass, scorched metal. In this world the burns are
//   aurora-coloured (a dark scorched channel with an aurora-green heart). Never glowing outlines or sci-fi arcs: arcs are
//   jagged ink-cored threads with a small bloom only where they ground.
// Windward: foes are drawn facing right and mirrored; the cold comes off the heroes, so rime builds on the front
//   (drawing-right) and upper edges. Light: foeBase puts the key light at the upper right in drawing space.
// Palette: brass, pale blue, aurora green, plus ink black, bone and grey (and the shared material library dulled
//   toward grey: iron, steel, leather, wool, wood).
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  brass: '#a5823c', brassL: '#d0ae64', brassD: '#4a3414', brassP: '#efdc9e', brassR: '#8c6236', // brass; brassR a red-brass for springs
  ice: '#cddbe3', iceL: '#eef5f8', iceM: '#a8bccb', iceD: '#7890a2', iceS: '#344258', glass: '#b4ccda', rime: '#f3f8fa', clear: '#93b6cc',
  aur: '#5ed6a0', aurL: '#c8f6de', aurD: '#1f6e58', aurM: '#2fa878', // aurora green
  bone: '#d6cdb8', boneD: '#9a917e', grey: '#77736a', greyD: '#4e4b45', greyL: '#a8a49a',
  iron: '#3a3a3e', ironL: '#5e5e66', ironD: '#1e1e24', steel: '#7a8590', steelD: '#4e5862', steelL: '#b0bac4',
  leath: '#4a3e36', leathD: '#2a221e', leathL: '#6a5a4e',
  wool: '#6c6458', woolD: '#463f37', woolL: '#8e8676', // grey-brown wool
  robe: '#2c323e', robeD: '#181c24', robeL: '#4a5466', // the astronomers' dark robe
  wood: '#4a3e30', woodD: '#2a2218', woodL: '#6e5e48',
  skinI: '#bcc6cc', skinIS: '#4a5068', // frozen skin: grey-white with a cold violet shadow (flesh, not steel)
  skin: '#b8a492', skinS: '#5a4444',
  scorch: '#1c1a1c', mud: '#24282e',
};

const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.25), shadowTint: '#232838', mud: P.mud }, o));

function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  let h = '';
  for (let i = 0; i < 26; i++) { const x = r() * 44, y = r() * 44, rx = 2.2 + r() * 3.2, ry = rx * (0.6 + r() * 0.3); h += `<path d="M${(x - rx).toFixed(1)},${y.toFixed(1)} a${rx.toFixed(1)},${ry.toFixed(1)} 0 0 0 ${(2 * rx).toFixed(1)},0" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.4"/><path d="M${(x - rx * 0.8).toFixed(1)},${(y - 0.6).toFixed(1)} a${rx.toFixed(1)},${ry.toFixed(1)} 0 0 1 ${(1.6 * rx).toFixed(1)},0" fill="none" stroke="#f6ecc8" stroke-width="0.7" opacity="0.35"/>`; }
  f.defs.push(`<pattern id="hammer${s}" patternUnits="userSpaceOnUse" width="44" height="44">${h}</pattern>`);
  // brushed brass: fine parallel strokes with a few longer scratches
  let b = '';
  for (let i = 0; i < 22; i++) { const y = r() * 40, x = r() * 40, l = 6 + r() * 14; b += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${l.toFixed(1)},${(l * 0.12).toFixed(1)}" stroke="${i % 3 ? INK : '#f6ecc8'}" stroke-width="0.7" opacity="${i % 3 ? 0.3 : 0.4}"/>`; }
  f.defs.push(`<pattern id="brush${s}" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(-20)">${b}</pattern>`);
  let g = '';
  for (let i = 0; i < 40; i++) { const x = r() * 30, y = r() * 30, rr = 0.5 + r() * 1.2; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > 0.35 ? INK : '#c8ccd0'}" opacity="${r() > 0.5 ? 0.45 : 0.3}"/>`; }
  f.defs.push(`<pattern id="pit${s}" patternUnits="userSpaceOnUse" width="30" height="30">${g}</pattern>`);
  let c = '';
  for (let i = 0; i < 18; i++) { let x = r() * 48, y = r() * 48, a = r() * 6.3; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 3; k++) { a += (r() - 0.5) * 1.6; x += Math.cos(a) * (3 + r() * 5); y += Math.sin(a) * (3 + r() * 5); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } c += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>`; }
  f.defs.push(`<pattern id="craze${s}" patternUnits="userSpaceOnUse" width="48" height="48">${c}</pattern>`);
  // rime: uneven pale specks and short feathered strokes leaning into the wind (drawing-right), never stars
  let m = '';
  for (let i = 0; i < 34; i++) { const x = r() * 40, y = r() * 40, rr = 0.5 + r() * 1.4; m += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#f6fafc" opacity="${(0.5 + r() * 0.4).toFixed(2)}"/>`; }
  for (let i = 0; i < 12; i++) { const x = r() * 40, y = r() * 40, l = 3 + r() * 5; m += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${l.toFixed(1)},${(-l * 0.25).toFixed(1)} M${(x + l * 0.5).toFixed(1)},${(y - l * 0.12).toFixed(1)} l${(l * 0.3).toFixed(1)},${(l * 0.35).toFixed(1)}" stroke="#f6fafc" stroke-width="0.8" opacity="0.7"/>`; }
  for (let i = 0; i < 6; i++) { const x = r() * 40, y = r() * 40; m += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(2 + r() * 4).toFixed(1)},${(1 + r() * 3).toFixed(1)}" stroke="${INK}" stroke-width="0.7" opacity="0.45"/>`; }
  f.defs.push(`<pattern id="rime${s}" patternUnits="userSpaceOnUse" width="40" height="40">${m}</pattern>`);
  let q = '';
  for (let i = 0; i < 9; i++) { let x = r() * 64, y = r() * 64; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 2; k++) { x += (r() - 0.5) * 22; y += (r() - 0.5) * 22; d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } q += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.4"/>`; }
  f.defs.push(`<pattern id="crack${s}" patternUnits="userSpaceOnUse" width="64" height="64">${q}</pattern>`);
  // chisel: short parallel tool marks in carved ice or stone
  let ch = '';
  for (let i = 0; i < 14; i++) { const x = r() * 50, y = r() * 50, l = 4 + r() * 6; for (let k = 0; k < 3; k++) ch += `<path d="M${(x + k * 2.2).toFixed(1)},${(y + k * 0.8).toFixed(1)} l${(l * 0.3).toFixed(1)},${l.toFixed(1)}" stroke="${INK}" stroke-width="0.7" opacity="0.35"/>`; }
  f.defs.push(`<pattern id="chisel${s}" patternUnits="userSpaceOnUse" width="50" height="50">${ch}</pattern>`);
  f.defs.push(`<radialGradient id="hg${s}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="hm${s}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#hg${s})"/></mask>`);
  f.defs.push(`<filter id="glow${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>`);
  f.defs.push(`<filter id="glowL${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>`);
}

const R = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
const pd = pts => E.smooth(pts, false);
const hard = pts => pts.map(q => [q[0], q[1], 1]);

function glow(f, c, rx, ry, col = P.aur, op = 0.3, big = false, a = 0) {
  f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
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
function at(C, S, u) { let i = 1; while (i < C.length - 1 && S[i] < u) i++; const t = Math.max(0, Math.min(1, (u - S[i - 1]) / ((S[i] - S[i - 1]) || 1))); const p = lerp(C[i - 1], C[i], t), d = E.norm(sub(C[i], C[i - 1])); return { p, d, n: [-d[1], d[0]] }; }
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], 1]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
function lumpy(f, pts, amp) { const c = pts.reduce((a, p) => add(a, mul(p, 1 / pts.length)), [0, 0]); return pts.map(p => { const d = E.norm(sub(p, c)), k = (f.r() - 0.4) * amp; return p[2] ? [...add(p, mul(d, k)), 1] : add(p, mul(d, k)); }); }
function soot(f, c, rx, ry, op = 0.5, a = 0) { f.flat(ell(c, rx, ry, a, 14).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3]) : q), P.scorch, { op }); }
function splats(f, c, rx, ry, n, col = P.mud) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = 2 + f.r() * 5; f.flat(ell(p, r * 1.4, r, f.r() * 3, 8), col, { op: 0.75 }); } }
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), b = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], b + sign * a)), Wr];
}

// ---------------------------------------------------------------- looks
const BR = (f, o = {}) => Object.assign({ fill: P.brass, shadow: P.brassD, light: P.brassP, shade: 0.42, tex: 'hammer' + f.o.seed, texOp: 0.6 }, o);
const BRD = (f, o = {}) => BR(f, Object.assign({ fill: mix(P.brass, '#2a2a30', 0.35) }, o)); // tarnished, frost-dulled brass
const IR = (f, o = {}) => Object.assign({ fill: P.iron, shadow: P.ironD, shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.8 }, o);
const ST = (f, o = {}) => Object.assign({ fill: P.steel, shadow: P.steelD, light: P.steelL, shade: 0.42, tex: 'pit' + f.o.seed, texOp: 0.5 }, o);
const ICE = (f, o = {}) => Object.assign({ fill: P.ice, shadow: P.iceS, light: P.iceL, shade: 0.36, tex: 'crack' + f.o.seed, texOp: 0.6 }, o);
const SKI = (f, o = {}) => Object.assign({ fill: P.skinI, shadow: P.skinIS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o);
const LEA = (f, o = {}) => Object.assign({ fill: P.leath, shadow: P.leathD, shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.3 }, o);
const WOOL = (f, o = {}) => Object.assign({ fill: P.wool, shadow: P.woolD, shade: 0.4, tex: 'weave' + f.o.seed, texOp: 0.5 }, o);
const ROBE = (f, o = {}) => Object.assign({ fill: P.robe, shadow: P.robeD, light: P.robeL, shade: 0.4, tex: 'weave' + f.o.seed, texOp: 0.45 }, o);
// a look half-buried in rime: paler, cold shadow
const rimed = (look, k = 0.45) => Object.assign({}, look, { fill: mix(look.fill, P.ice, k), shadow: mix(look.shadow || '#222', P.iceS, 0.6), light: P.iceL });

// ---------------------------------------------------------------- frost
function icicle(f, p, len, w, o = {}) {
  const tip = add(p, [o.lean || 0, len]);
  const pts = [[...add(p, [-w / 2, 0]), 1], [...add(lerp(p, tip, 0.45), [-w * 0.28, 0])], [...tip, 1], [...add(lerp(p, tip, 0.4), [w * 0.3, 0])], [...add(p, [w / 2, 0]), 1]];
  f.part(pts, { fill: o.col || P.glass, shadow: P.iceS, light: P.iceL, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, gritOp: 0.25, k: 0.7 });
  f.line([add(p, [-w * 0.15, 1]), add(lerp(p, tip, 0.7), [-w * 0.05, 0])], Math.max(0.8, w * 0.18), P.iceL, { op: 0.8, straight: true });
  if (len > 14) f.line([add(lerp(p, tip, 0.2), [w * 0.25, 0]), add(lerp(p, tip, 0.32), [w * 0.1, 0])], 0.8, INK, { op: 0.5, straight: true });
  if (o.drop) f.flat(ell(add(tip, [0, 6]), 1.4, 2.2, 0, 6), P.iceL, { op: 0.8 });
}
// a row of icicles hanging plumb under an edge polyline
function icicles(f, edge, n, l0, l1, o = {}) {
  const C = spline(edge, 3), S = arcLen(C), T = S[S.length - 1];
  for (let i = 0; i < n; i++) { const u = T * (i + 0.3 + f.r() * 0.4) / n, q = at(C, S, u).p, l = R(f, l0, l1) * (i % 3 === 1 ? 1.3 : 1); icicle(f, add(q, [0, -2]), l, Math.max(3, l * (o.wk ?? 0.22)), { drop: f.r() < 0.35, col: o.col }); }
}
// rime crust: a lumpy pale band along a polyline, feathers growing into the wind (dir)
function rimeCrust(f, pts, w, dir = [1, -0.2], o = {}) {
  const C = spline(pts, 4), S = arcLen(C), T = S[S.length - 1], L = [], Rr = [];
  for (let u = 0; u <= T; u += 6) { const a = at(C, S, u), ww = w * (0.55 + 0.45 * Math.sin(u * 0.09 + 1) * Math.sin(u * 0.031)) * (0.75 + f.r() * 0.35); L.push(add(a.p, mul(a.n, ww * 0.5))); Rr.push(add(a.p, mul(a.n, -ww * 0.5))); }
  if (L.length < 2) return;
  f.part([...L, ...Rr.reverse()], { fill: o.col || P.rime, shadow: P.iceM, light: '#ffffff', shade: 0.3, inkW: o.inkW ?? 1.1, inkHeavy: 1.6, cast: false, hatch: false, gritOp: 0.25, tex: 'rime' + f.o.seed, texOp: 0.6, k: 0.9 });
  const n = Math.round(T / (o.gap || 9)), dn = E.norm(dir);
  for (let i = 0; i < n; i++) { const a = at(C, S, (i + f.r()) * T / n), l = R(f, 2, 4.5) * (o.feather ?? 1); f.line([a.p, add(a.p, add(mul(dn, l), [0, -l * 0.2])), add(a.p, mul(dn, l * 1.3))], 1, '#ffffff', { op: 0.75, straight: true }); }
}
function facets(f, c, rx, ry, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, 6, 16) * (o.s || 1), a = f.r() * 6.3;
    const pts = [0, 1, 2, 3].map(k => add(p, rot([r * (0.6 + f.r() * 0.6), 0], a + k * 1.57 + (f.r() - 0.5) * 0.6)));
    f.flat(pts, f.r() > 0.45 ? P.iceL : P.iceD, { op: o.op ?? 0.3 });
    f.line([pts[0], pts[1], pts[2]], 0.8, INK, { op: 0.35, straight: true });
  }
}
function frostCracks(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), a = f.r() * 6.3; let q = p; const pts = [p]; for (let k = 0; k < 3; k++) { q = add(q, rot([R(f, 5, 12) * s, 0], a + (f.r() - 0.5) * 1.2)); pts.push(q); } f.line(pts, 0.9 * s, INK, { op: 0.6, straight: true }); f.line(pts.map(z => add(z, [-0.8, 0.8])), 0.7 * s, P.iceL, { op: 0.5, straight: true }); } }
// hoar frost dusting: a patch of rime texture over whatever is below (clipped by the caller)
function hoar(f, c, rx, ry, op = 0.7) { const e = `cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}"`; f.raw(`<ellipse ${e} fill="${P.iceL}" opacity="${(op * 0.3).toFixed(2)}" mask="url(#hm${f.o.seed})"/><ellipse ${e} fill="url(#rime${f.o.seed})" opacity="${op.toFixed(2)}" mask="url(#hm${f.o.seed})"/>`); }

// ---------------------------------------------------------------- lightning, aurora-coloured
// Lichtenberg burn: a fern of branching scars. skin: dark channel with an aurora-green edge; metal: scorched branches
// with a thin aurora thread fused into the trunk. No bloom: it is a scar.
function lichtenberg(f, c, a, len, w, o = {}) {
  const dark = o.metal ? P.scorch : (o.col || '#2a3a3a'), lite = o.metal ? P.aur : P.aurL;
  const branches = [];
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 5;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * 0.7; q = add(q, rot([L / n, 0], b)); pts.push(q); }
    branches.push([pts, ww, depth]);
    if (depth > 0) for (let k = 1; k < n; k++) { const nk = f.r() < 0.5 ? 2 : 1; for (let j = 0; j < nk; j++) if (f.r() < (o.fork ?? 0.8)) go(pts[k], b + (j ? -1 : 1) * (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.0), L * R(f, 0.3, 0.55), ww * 0.62, depth - 1); }
  };
  go(c, a, len, w, o.depth ?? 3);
  for (const [pts, ww] of branches) f.stroke(pts, ww + 2, lite, { op: o.metal ? 0.22 : 0.35 });
  for (const [pts, ww] of branches) f.stroke(pts, ww, dark, { op: o.op ?? 0.85 });
  for (const [pts, ww, d] of branches) if (d >= (o.depth ?? 3) - 1) f.line(pts.slice(0, 4), Math.max(0.7, ww * 0.28), P.aur, { op: 0.75 });
}
// a jagged bolt from a to b: ink thread, aurora body, pale heart, forks; small bloom only at the ends
function bolt(f, a, b, o = {}) {
  const w = o.w ?? 2.4, n = o.n ?? Math.max(4, Math.round(E.len(sub(b, a)) / 22)), jit = o.jit ?? 0.28;
  const d = sub(b, a), L = E.len(d), nn = E.norm([-d[1], d[0]]);
  const pts = [a];
  for (let i = 1; i < n; i++) { const t = i / n; pts.push(add(add(a, mul(d, t)), mul(nn, (f.r() - 0.5) * 2 * jit * L / n * 2.2))); }
  pts.push(b);
  const draw = (q, ww) => { f.line(q, ww + 3.2, INK, { straight: true, op: 0.85 }); f.line(q, ww + 1.2, o.col || P.aur, { straight: true }); f.line(q, Math.max(0.8, ww * 0.45), P.aurL, { straight: true }); };
  draw(pts, w);
  for (let k = 0; k < (o.forks ?? 3); k++) {
    const i = 1 + Math.floor(f.r() * (n - 1)), p0 = pts[i], dir = Math.atan2(d[1], d[0]) + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), fl = L * R(f, 0.12, 0.28);
    const q = [p0]; let p = p0; for (let j = 0; j < 3; j++) { p = add(p, rot([fl / 3, 0], dir + (f.r() - 0.5) * 1.0)); q.push(p); }
    draw(q, w * 0.45);
  }
  if (o.ends !== false) for (const e of [a, b]) glow(f, e, w * 4, w * 4, P.aur, 0.3);
  return pts;
}
// a fused rivet or seam: re-set brass bead, aurora heat ring
function fusedBead(f, p, r) { f.flat(ell(p, r * 1.8, r * 1.4, 0, 10), P.scorch, { op: 0.45 }); f.part(lumpy(f, ell(p, r * 1.2, r, 0, 9), r * 0.3), BR(f, { fill: mix(P.brass, P.brassD, 0.25), inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, gritOp: 0.2 })); f.flat(ell(add(p, [r * 0.3, -r * 0.3]), r * 0.4, r * 0.3, 0, 6), P.aurL, { op: 0.8 }); f.flat(ell(add(p, [0, r * 1.5]), r * 0.5, r * 1.1, 0, 8), mix(P.brass, '#000', 0.3), { op: 0.85 }); }
function rivetRow(f, a, b, n, r = 3, col = P.brassL, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = lerp(a, b, (i + 0.5) / n);
    if (o.fused && f.r() < o.fused) fusedBead(f, p, r);
    else if (o.missing && f.r() < o.missing) f.flat(ell(p, r * 0.8, r * 0.8, 0, 8), '#0a0a0c');
    else f.rivet(p, r, col);
  }
}
// a weld where lightning fused two brass parts: a lumpy bead across the join, an aurora thread in it
function weld(f, pts, w, o = {}) {
  const C = spline(pts, w * 0.8);
  f.stroke(C, w * 3.2, P.scorch, { op: 0.45 });
  for (let i = 0; i < C.length; i++) { const r = w * R(f, 0.55, 0.85); f.part(ell(add(C[i], [R(f, -1, 1) * w * 0.15, R(f, -1, 1) * w * 0.15]), r * 1.1, r, f.r() * 3, 8), { fill: mix(P.brass, P.brassD, 0.3), shadow: P.brassD, light: P.brassP, shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, gritOp: 0.2 }); }
  f.line(C.filter((_, i) => i % 2 === 0), Math.max(0.8, w * 0.22), P.aur, { op: 0.8 });
  if (o.lich !== false) lichtenberg(f, C[Math.floor(C.length / 2)], o.a ?? -1.2, w * 8, w * 0.45, { metal: true, depth: 2 });
}

// ---------------------------------------------------------------- brass engineering
function bevel(f, d, bb, w = 6, o = {}) {
  const L = f.L, pad = 60, rx = bb[0] - pad, ry = bb[1] - pad, rw = bb[2] - bb[0] + pad * 2, rh = bb[3] - bb[1] + pad * 2;
  const cid = f.id('bvc'); f.defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
  const band = (k, sgn, col, op) => { const mid = f.id('bvm'); f.defs.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${rx}" y="${ry}" width="${rw}" height="${rh}"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#fff"/><path d="${d}" transform="translate(${(-sgn * L[0] * k).toFixed(1)},${(-sgn * L[1] * k).toFixed(1)})" fill="#000"/></mask>`); return `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${col}" opacity="${op}" mask="url(#${mid})"/>`; };
  f.raw(`<g clip-path="url(#${cid})">` + band(w, 1, o.lite || P.brassP, o.liteOp ?? 0.28) + band(w * 0.3, 1, o.lite2 || '#fbf0c8', o.lite2Op ?? 0.55) + band(w * 1.3, -1, o.dark || '#000', o.darkOp ?? 0.3) + band(w * 0.35, -1, o.dark || '#000', (o.darkOp ?? 0.3) * 1.4) + '</g>');
}
function dent(f, c, r, a = 0) { const e = ell(c, r, r * 0.62, a, 14); f.flat(e, '#000', { op: 0.16 }); f.line(e.slice(9, 15).concat([e[0]]), Math.max(1, r * 0.12), '#000', { op: 0.35 }); f.line(e.slice(2, 8), Math.max(1, r * 0.1), P.brassP, { op: 0.55 }); }
// a hard brass plate with a bevel, optional scorch, dents, scratches, aurora burns and rivets
function bplate(f, pts, look, o = {}) {
  if (o.hard !== false) pts = hard(pts);
  const d = f.part(pts, Object.assign({ k: 0.6 }, look));
  bevel(f, d, E.bbox(pts), o.bev ?? 6, o.bevO || {});
  clipDraw(f, pts, () => {
    if (o.scorch) for (const [c, rx, ry, op] of o.scorch) soot(f, c, rx, ry, op ?? 0.45);
    if (o.lich) for (const L of o.lich) lichtenberg(f, L[0], L[1], L[2], L[3] || 2.6, { metal: true, depth: L[4] ?? 2 });
    if (o.dents) for (const [c, r, a] of o.dents) dent(f, c, r, a ?? 0);
    if (o.scr) for (const [c, r, n] of o.scr) f.scratches(c, r, n, P.brassP, 1, -0.7);
    if (o.frost) for (const [c, rx, ry, op] of o.frost) hoar(f, c, rx, ry, op ?? 0.7);
    if (o.after) o.after();
  });
  if (o.rivets) for (const [a, b, n, r] of o.rivets) rivetRow(f, a, b, n, r ?? 3.4, P.brassL, { fused: o.fused ?? 0.15, missing: o.missing ?? 0.08 });
  return d;
}
// toothed gear wheel: rim with teeth, spokes, hub
function gear(f, c, r, teeth, o = {}) {
  const pts = [], a0 = o.a || 0, look = o.look || BR(f);
  for (let i = 0; i < teeth; i++) { const a = a0 + i * Math.PI * 2 / teeth, da = Math.PI / teeth * 0.5; pts.push([...add(c, rot([r * 0.84, 0], a - da * 1.1)), 1], [...add(c, rot([r, 0], a - da * 0.55)), 1], [...add(c, rot([r, 0], a + da * 0.55)), 1], [...add(c, rot([r * 0.84, 0], a + da * 1.1)), 1]); }
  const d = f.part(pts, Object.assign({}, look, { shade: 0.45, inkW: o.inkW ?? 1.2, inkHeavy: 2, cast: o.cast }));
  if (r > 20) bevel(f, d, E.bbox(pts), Math.max(2, r * 0.06));
  if (o.solid) { f.flat(ell(c, r * 0.68, r * 0.68, 0, 20), '#000', { op: 0.18 }); f.line(ell(c, r * 0.7, r * 0.7, 0, 20).concat([ell(c, r * 0.7, r * 0.7, 0, 20)[0]]), 1, INK, { op: 0.5 }); }
  else {
    f.flat(ell(c, r * 0.7, r * 0.7, 0, 20), o.hole || '#0c0c10', { op: 0.88 });
    const ns = o.spokes ?? 5;
    for (let i = 0; i < ns; i++) { const a = a0 + 0.3 + i * Math.PI * 2 / ns; f.part(limb(add(c, rot([r * 0.15, 0], a)), add(c, rot([r * 0.72, 0], a)), r * 0.17, r * 0.12, { steps: 4 }), Object.assign({}, look, { inkW: 1, inkHeavy: 1.4, cast: false })); }
  }
  f.part(ell(c, r * 0.24, r * 0.24, 0, 12), Object.assign({}, look, { fill: P.brassL, inkW: 1.1, cast: false }));
  f.flat(ell(c, r * 0.08, r * 0.08, 0, 8), '#0a0a0c');
  return d;
}
// an engineered limb segment: a brass cylinder with flanged collars, a lit stripe, edge shading
function cylinder(f, a, b, wa, wb, look, o = {}) {
  const d = f.part(limb(a, b, wa, wb, { steps: 6, capK: o.capK ?? 0.18, p: o.p, q: o.q }), Object.assign({ k: 0.85 }, look));
  bevel(f, d, E.bbox([add(a, [-wa, -wa]), add(b, [wb, wb]), add(a, [wa, wa]), add(b, [-wb, -wb])]), Math.max(4, (wa + wb) * 0.05));
  const dn = E.norm(sub(b, a)), nn = [-dn[1], dn[0]], sd = (nn[0] * f.L[0] + nn[1] * f.L[1]) > 0 ? 1 : -1;
  f.line([lp(a, b, 0.08, sd * wa * 0.26), lp(a, b, 0.92, sd * wb * 0.26)], Math.max(1.4, wa * 0.05), P.brassP, { op: 0.45, straight: true });
  for (const [t, ww] of (o.flanges || [[0.02, wa * 1.14], [0.98, wb * 1.14]])) {
    const c = lerp(a, b, t), pts = hard([add(c, add(mul(nn, ww / 2), mul(dn, -ww * 0.06))), add(c, add(mul(nn, ww / 2), mul(dn, ww * 0.06))), add(c, add(mul(nn, -ww / 2), mul(dn, ww * 0.06))), add(c, add(mul(nn, -ww / 2), mul(dn, -ww * 0.06)))]);
    f.part(pts, Object.assign({}, look, { fill: o.flangeCol || mix(look.fill, '#000', 0.2), inkW: 1.4, inkHeavy: 2, cast: false }));
    if (o.rivets !== false) for (const u of [-0.32, 0, 0.32]) f.rivet(add(c, mul(nn, u * ww)), Math.max(1.6, ww * 0.035), P.brassL);
  }
  return d;
}
function hinge(f, c, r, a0 = 0) {
  // a clevis: two iron cheek plates round the joint, a hex-headed pin with a slot (never a round 'eye')
  const ch = []; for (let i = 0; i < 8; i++) { const t = a0 + i * Math.PI / 4 + Math.PI / 8; ch.push([...add(c, rot([r, 0], t)), 1]); }
  f.part(ch, IR(f, { fill: P.ironL, inkW: 1.6, k: 0.5 }));
  f.line([add(c, rot([r * 0.9, 0], a0 + 2.4)), add(c, rot([r * 0.9, 0], a0 + 3.9))], Math.max(1.2, r * 0.1), '#a8acb0', { op: 0.6, straight: true });
  const hx = []; for (let i = 0; i < 6; i++) hx.push([...add(c, rot([r * 0.5, 0], a0 + i * Math.PI / 3)), 1]);
  f.part(hx, BR(f, { fill: P.brassL, inkW: 1.2, cast: false }));
  f.line([add(c, rot([-r * 0.32, 0], a0 + 0.5)), add(c, rot([r * 0.32, 0], a0 + 0.5))], Math.max(1, r * 0.1), INK, { straight: true, op: 0.8 });
}
// articulated brass gauntlet fist (B.fist's frame): riveted finger lames, knuckle guard, thumb plates
function gauntlet(f, c, a, s, flip, look, o = {}) {
  s *= o.scale ?? 1.18;
  const F0 = frame(c, a, s), F = flip ? pts => F0(pts.map(p => p.length > 2 ? [p[0], -p[1], p[2]] : [p[0], -p[1]])) : F0;
  const iw = Math.max(1.2, s * 0.012), sb = x => Object.assign({}, look, { inkW: iw, inkHeavy: iw * 1.6, cast: false }, x || {});
  const dk = mix(look.fill, '#000', 0.4), lt = look.light || P.brassP;
  if (o.cuff !== false) {
    f.part(hard(F([[-1.36, -0.92], [-0.98, -0.8], [-0.98, 0.8], [-1.36, 0.94]])), sb({ fill: mix(look.fill, '#000', 0.12) }));
    f.part(hard(F([[-1.02, -0.8], [-0.62, -0.68], [-0.62, 0.68], [-1.02, 0.8]])), sb());
    f.line(F([[-1.3, -0.84], [-1.3, 0.86]]), iw * 1.6, lt, { op: 0.5 });
    for (const y of [-0.6, 0.62]) f.rivet(F([[-0.82, y]])[0], Math.max(1.4, s * 0.05), P.brassL);
  }
  f.flat(F([[-0.7, -0.62], [0.82, -0.62], [0.86, 0.6], [-0.7, 0.6]]), P.ironD);
  const fy = [[-0.6, 0.29, 0.8], [-0.3, 0.29, 0.84], [0.0, 0.28, 0.8], [0.28, 0.26, 0.7]];
  for (let i = 3; i >= 0; i--) {
    const [y0, hh, x1] = fy[i], seg = [[0.3, 0.5], [0.48, 0.66], [0.64, x1]];
    seg.forEach(([xa, xb], j) => {
      const sh = j === 2 ? 0.03 : 0;
      f.part(F([[xa, y0 + 0.02], [xb, y0 + 0.01 + sh], [xb + 0.04, y0 + hh * 0.5], [xb, y0 + hh - sh], [xa, y0 + hh]]), sb({ fill: j === 2 ? mix(look.fill, '#000', 0.25) : look.fill, k: 0.4, shade: 0.5 }));
      f.line(F([[xa + 0.03, y0 + 0.05], [xb - 0.02, y0 + 0.045]]), iw, lt, { op: 0.55 });
      if (j === 0) f.rivet(F([[xa + 0.08, y0 + hh * 0.5]])[0], Math.max(1.2, s * 0.035), P.brassL);
    });
    f.flat(F([[x1 - 0.08, y0 + hh - 0.06], [x1 + 0.02, y0 + hh * 0.5], [x1 - 0.02, y0 + hh - 0.01]]), dk, { op: 0.7 });
  }
  f.part(hard(F([[-0.72, -0.56], [-0.2, -0.66], [0.3, -0.64], [0.34, 0.62], [-0.2, 0.64], [-0.72, 0.54]])), sb({ k: 0.8, shade: 0.42 }));
  f.line(F([[-0.6, -0.08], [0.2, -0.1]]), iw * 2.2, lt, { op: 0.45 });
  f.line(F([[-0.6, 0.0], [0.2, -0.02]]), iw, '#000', { op: 0.5 });
  f.part(hard(F([[0.18, -0.66], [0.38, -0.64], [0.4, 0.62], [0.2, 0.64]])), sb({ fill: mix(look.fill, '#fff', 0.08) }));
  for (let i = 0; i < 4; i++) { const y = fy[i][0] + fy[i][1] * 0.5; f.part(F(ell([0.29, y], 0.07, 0.11, 0, 8)), sb({ fill: mix(look.fill, '#fff', 0.12), shade: 0.5 })); }
  f.rivet(F([[-0.4, -0.38]])[0], Math.max(1.4, s * 0.045), P.brassL); f.rivet(F([[-0.4, 0.36]])[0], Math.max(1.4, s * 0.045), P.brassL);
  if (o.thumb !== false) {
    f.part(F([[-0.5, -0.5], [-0.1, -0.84], [0.12, -0.8], [0.08, -0.56], [-0.3, -0.36]]), sb({ k: 0.6 }));
    f.part(hard(F([[0.06, -0.84], [0.36, -0.86], [0.4, -0.66], [0.1, -0.58]])), sb());
    f.part(hard(F([[0.34, -0.86], [0.6, -0.78], [0.6, -0.62], [0.38, -0.64]])), sb({ fill: mix(look.fill, '#000', 0.15) }));
    f.line(F([[-0.4, -0.5], [0.04, -0.78]]), iw * 1.4, lt, { op: 0.5 });
  }
  return F;
}
function gauntletGrip(f, c, elbow, thumbAng, s, look, o = {}) { const g = K.B.gripAngle(c, elbow, thumbAng, o); g.F = gauntlet(f, c, g.ang, s, g.flip, look, o); return g; }

// ---------------------------------------------------------------- the clockmaker's marks
// roman numeral glyph n (1..12) drawn with straight strokes, centred at c, upright along `up` (unit), height h
function numeral(f, c, n, h, up, col = INK, w = 1.6) {
  const map = { 1: 'I', 2: 'II', 3: 'III', 4: 'IIII', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII' }, s = map[n];
  const ux = [-up[1], up[0]], gw = h * 0.42, W2 = s.length * gw, P0 = (x, y) => add(c, add(mul(ux, x), mul(up, y)));
  let x = -W2 / 2;
  for (const ch of s) {
    const segs = ch === 'I' ? [[[0.5, -0.5], [0.5, 0.5]]] : ch === 'V' ? [[[0.05, 0.5], [0.5, -0.5]], [[0.5, -0.5], [0.95, 0.5]]] : [[[0.05, 0.5], [0.95, -0.5]], [[0.05, -0.5], [0.95, 0.5]]];
    for (const [a, b] of segs) f.line([P0(x + a[0] * gw, a[1] * h), P0(x + b[0] * gw, b[1] * h)], w, col, { straight: true });
    f.line([P0(x, 0.5 * h), P0(x + gw, 0.5 * h)], w * 0.6, col, { straight: true, op: 0.6 }); f.line([P0(x, -0.5 * h), P0(x + gw, -0.5 * h)], w * 0.6, col, { straight: true, op: 0.6 }); // serifs
    x += gw;
  }
}
// a dial seen in three-quarter view: T maps unit-disc [u,v] to the page (u squashed by k). Returns T.
function dialFrame(c, R, k = 1, a = 0) { return (u, v) => add(c, rot([u * R * k, v * R], a)); }
// a ring (annulus) between radii r0 < r1 in a dial frame, as one path with the hole cut out
function ringPath(T, r0, r1, n = 48) { const o = [], i = []; for (let j = 0; j < n; j++) { const t = j / n * Math.PI * 2; o.push(T(Math.cos(t) * r1, Math.sin(t) * r1)); i.push(T(Math.cos(-t) * r0, Math.sin(-t) * r0)); } return { d: E.smooth(o) + ' ' + E.smooth(i), outer: o }; }
// a clock hand from the dial frame centre at screen angle ang (0 = up/12, clockwise), length L px, base width w
function clockHand(f, c, ang0, L, w, look, o = {}) {
  const d = [Math.sin(ang0), -Math.cos(ang0)], n = [-d[1], d[0]], P0 = (u, v) => add(c, add(mul(d, u), mul(n, v)));
  const tail = o.tail ?? 0.22;
  const pts = [P0(-L * tail, 0), P0(-L * tail * 0.8, w * 0.45), P0(-L * 0.02, w * 0.6), P0(L * 0.3, w * 0.38), P0(L * 0.55, w * 0.7), P0(L * 0.62, w * 0.2), P0(L, 0), P0(L * 0.62, -w * 0.2), P0(L * 0.55, -w * 0.7), P0(L * 0.3, -w * 0.38), P0(-L * 0.02, -w * 0.6), P0(-L * tail * 0.8, -w * 0.45)];
  const dd = f.part(hard(pts), Object.assign({ k: 0.5 }, look));
  f.flat(ell(P0(L * 0.5, 0), w * 0.3, w * 0.22, ang0 - Math.PI / 2, 8), '#0a0a0c'); // the pierced lozenge
  f.line([P0(-L * tail * 0.6, 0), P0(L * 0.95, 0)], Math.max(0.8, w * 0.08), P.brassP, { op: 0.5, straight: true });
  return dd;
}

// ---------------------------------------------------------------- body parts (copied from kit_V, recoloured)
function chainLinks(f, pts, s, col = P.ironL) {
  const C = []; for (let i = 0; i < pts.length - 1; i++) { const L = E.len(sub(pts[i + 1], pts[i])), n = Math.max(1, Math.round(L / (s * 0.8))); for (let k = 0; k < n; k++) C.push([lerp(pts[i], pts[i + 1], k / n), lerp(pts[i], pts[i + 1], (k + 1) / n)]); }
  C.forEach(([a, b], i) => {
    const m = lerp(a, b, 0.5), an = ang(a, b);
    if (i % 2) { f.line([add(m, rot([-s * 0.5, 0], an)), add(m, rot([s * 0.5, 0], an))], s * 0.26 + 1.6, INK, { straight: true }); f.line([add(m, rot([-s * 0.45, 0], an)), add(m, rot([s * 0.45, 0], an))], s * 0.22, mix(col, '#fff', 0.15), { straight: true }); }
    else { const e = ell(m, s * 0.58, s * 0.3, an, 12); f.line(e.concat([e[0]]), s * 0.2 + 1.6, INK); f.line(e.concat([e[0]]), s * 0.16, col); f.line(e.slice(7, 11), 0.9, mix(col, '#fff', 0.5), { op: 0.8 }); }
  });
}
function rope(f, pts, w, o = {}) {
  const col = o.col || '#7a6e58';
  f.line(pts, w + 2.2, INK); f.line(pts, w, col); f.line(pts.map(q => add(q, [w * 0.18, -w * 0.18])), Math.max(0.7, w * 0.22), mix(col, '#fff', 0.35), { op: 0.6 });
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; for (let t = (acc % (w * 1.4)); t < L; t += w * 1.4) { const q = add(a, mul(d, t)); f.line([add(q, mul(nn, w * 0.5)), add(add(q, mul(nn, -w * 0.5)), mul(d, w * 0.6))], 0.9, INK, { op: 0.6, straight: true }); } acc += L; }
}
function armRig(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const de = elb(S0, E0, W0);
  return split(f, () => {
    const d = f.part(K.chain([S0, E0, W0], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
    if (o.after) o.after();
    return d;
  }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
}
function legTube(f, Hp, Kn, cu, ws, look, sfx, o = {}) {
  const A = o.A || cu, dk = elb(Hp, Kn, A);
  return split(f, () => { const d = f.part(K.chain([Hp, Kn, cu], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look)); if (o.after) o.after(); return d; },
    [['thigh' + sfx, side(Kn, mul(dk, -1), ws[1] * 0.6)], ['shin' + sfx, side(Kn, dk, ws[1] * 0.6)]]);
}
function bootRig(f, K0, A, s, col, sfx, o = {}) {
  const da = add(E.norm(sub(A, K0)), [0.6, 0]);
  return split(f, () => K.B.boot(f, A, 1, s, col, o), [['shin' + sfx, side(A, mul(da, -1), s * 0.36)], ['foot' + sfx, side(A, da, s * 0.36)]]);
}
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  if (J.HN) f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  if (J.HF) f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
// the region of a ribbon of width W along a polyline (cloth strips, straps)
function ribbon(C, W) { const L = [], Rr = []; C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], d = E.norm(sub(b, a)), n = [-d[1], d[0]], w = typeof W === 'function' ? W(i / (C.length - 1)) : W; L.push(add(c, mul(n, w / 2))); Rr.push(add(c, mul(n, -w / 2))); }); return [...L, ...Rr.reverse()]; }
// stitched fold lines inside cloth: ink fold with a lit lip
function fold(f, pts, w = 2) { f.stroke(pts, w, INK, { op: 0.7 }); f.line(pts.map(q => add(q, mul(f.L, 2))), 1, '#ffffff', { op: 0.18 }); }

// a ring of heavy iron gate keys hanging plumb from p
function ringR(f, p, s = 1) {
  const rc = add(p, [0, 16 * s]);
  f.line(ell(rc, 14 * s, 14 * s, 0, 16).concat([ell(rc, 14 * s, 14 * s, 0, 16)[0]]), 5 * s, INK); f.line(ell(rc, 14 * s, 14 * s, 0, 16).concat([ell(rc, 14 * s, 14 * s, 0, 16)[0]]), 3 * s, P.ironL);
  f.line([p, add(p, [0, 4 * s])], 4 * s, P.iron);
  [[-0.35, 1], [0.05, 1.15], [0.45, 0.9]].forEach(([a, l]) => {
    const top = add(rc, [Math.sin(a) * 12 * s, 12 * s]), bot = add(top, [Math.sin(a) * 10 * s, 64 * s * l]);
    f.part(ell(top, 8 * s, 9 * s, 0, 10), IR(f, { inkW: 1.2, cast: false })); f.flat(ell(top, 3.5 * s, 4 * s, 0, 8), '#0a0a0c');
    f.part(limb(add(top, [0, 8 * s]), bot, 6 * s, 6 * s, { steps: 4, capK: 0.3 }), IR(f, { inkW: 1.1, cast: false }));
    f.part(hard([add(bot, [-2 * s, -16 * s]), add(bot, [12 * s, -16 * s]), add(bot, [12 * s, -8 * s]), add(bot, [6 * s, -8 * s]), add(bot, [6 * s, 0]), add(bot, [-2 * s, 0])]), IR(f, { inkW: 1.1, cast: false })); // bit
    icicle(f, add(bot, [2 * s, 0]), 10 * s, 3 * s);
  });
}

// a brass band along a polyline (an armillary ring, a hoop): ink border, body, a lit lip toward the key light
function band(f, pts, w, col = P.brass, o = {}) {
  f.line(pts, w + 3.4, INK, { op: o.inkOp ?? 1 }); f.line(pts, w, col); f.line(pts.map(q => add(q, mul(f.L, w * 0.22))), Math.max(1, w * 0.28), o.lite || P.brassP, { op: 0.55 });
  f.line(pts.map(q => add(q, mul(f.L, -w * 0.25))), Math.max(1, w * 0.22), '#000', { op: 0.3 });
}
// an ellipse ring in a rotated frame: returns its points from t0 to t1 (radians)
function ringArc(c, rx, ry, a, t0, t1, n = 40) { const r = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; r.push(add(c, rot([Math.cos(t) * rx, Math.sin(t) * ry], a))); } return r; }

// ---------------------------------------------------------------- carving (added in the independent review)
// A chiselled fold: a dark tapered valley, a deep ink core, a lit ridge on the light side and a soft shade on the far
// side, so drapery reads as cut into a block, not drawn on it. pts: the fold's centre line; w: max valley width.
// o.open: the valley widens toward the end (a fold opening into a hem); o.col: valley colour; o.lite: ridge colour.
function trough(f, pts, w, o = {}) {
  const C = pts.length > 2 ? spline(pts, 5) : pts, n = C.length;
  if (n < 2) return;
  const prof = t => o.open ? Math.min(1, 0.25 + t * 1.1) * Math.sin(Math.PI * Math.min(0.98, 0.04 + t * 0.6 + 0.36 * t)) : Math.pow(Math.sin(Math.PI * (0.04 + 0.92 * t)), 0.7);
  f.flat(ribbon(C, t => w * prof(t)), o.col || '#2c3a50', { op: o.op ?? 0.42 });
  f.flat(ribbon(C.map(q => add(q, mul(f.L, -w * 0.35))), t => w * 0.7 * prof(t)), '#141c2a', { op: (o.op ?? 0.42) * 0.45 });
  f.stroke(C, Math.max(1.6, w * 0.26), INK, { op: o.inkOp ?? 0.7 });
  f.stroke(C.map(q => add(q, mul(f.L, w * 0.62))), Math.max(1.4, w * 0.24), o.lite || '#f2f8fb', { op: o.liteOp ?? 0.62 });
}
// a chip knocked out of a carved edge: a pale fresh-broken facet with a hard inked lip on the shadow side
function chip(f, p, r, a = 0, o = {}) {
  const pts = [[-1, -0.2], [-0.3, -0.75], [0.6, -0.55], [1, 0.1], [0.2, 0.6], [-0.7, 0.45]].map(q => add(p, rot([q[0] * r * (0.85 + f.r() * 0.3), q[1] * r * (0.85 + f.r() * 0.3)], a)));
  f.flat(pts.map(q => [q[0], q[1], 1]), o.col || '#e8f1f6', { op: 0.85 });
  f.flat([pts[3], pts[4], pts[5], add(p, rot([-0.2 * r, 0.15 * r], a))].map(q => [q[0], q[1], 1]), '#3c4c64', { op: 0.35 });
  f.line([pts[2], pts[3], pts[4], pts[5]], Math.max(1, r * 0.12), INK, { op: 0.75, straight: true });
}
// weathering: thin dark runs down a surface from crevices (meltwater and grime), plumb
function streaks(f, c, rx, n, len, o = {}) { for (let i = 0; i < n; i++) { const x = c[0] + (f.r() - 0.5) * 2 * rx, y = c[1] + (f.r() - 0.5) * rx * 0.4, l = len * (0.5 + f.r() * 0.7); f.stroke([[x, y], [x + (f.r() - 0.5) * 3, y + l * 0.5], [x + (f.r() - 0.5) * 4, y + l]], o.w ?? 3, o.col || '#3a4a5e', { op: o.op ?? 0.22 }); } }
// a carved lock of hair or beard: a tapered strand from root to tip that ends in a drilled spiral curl
function lock(f, root, tip, w, look, o = {}) {
  const mid = add(lerp(root, tip, 0.5), o.bend || [0, 0]);
  const C = spline([root, mid, tip], 4), d = E.norm(sub(tip, mid)), cs = o.curl ?? 1;
  const R2 = ribbon(C, t => w * (1 - t * 0.5));
  f.flat(R2, look.fill, { op: 0.92 });
  f.flat(ribbon(C.map(q => add(q, mul(f.L, -w * 0.3))), t => w * 0.45 * (1 - t * 0.5)), look.shadow || '#3a4a62', { op: 0.35 });
  f.stroke(C.map(q => add(q, mul(f.L, -w * 0.5))), Math.max(1.6, w * 0.22), INK, { op: 0.75 }); // the groove on the shadow side
  f.stroke(C.slice(0, -1).map(q => add(q, mul(f.L, w * 0.18))), Math.max(1.2, w * 0.2), '#f2f8fb', { op: 0.65 }); // the lit ridge
  if (cs) { const c = add(tip, mul([-d[1], d[0]], w * 0.3 * cs)), sp = []; for (let i = 0; i <= 14; i++) { const t = i / 14, a = Math.atan2(-d[1], -d[0]) + t * 5.2 * cs, r = w * 0.5 * (1 - t * 0.75); sp.push(add(c, [Math.cos(a) * r, Math.sin(a) * r])); } f.flat(ell(c, w * 0.55, w * 0.55, 0, 10), look.fill, { op: 0.9 }); f.line(sp, Math.max(1.4, w * 0.16), INK, { op: 0.85 }); f.flat(ell(c, w * 0.12, w * 0.12, 0, 6), '#141c2a', { op: 0.9 }); }
}

module.exports = { trough, chip, streaks, lock, band, ringArc, ringR, P, base, textures, R, scatter, ang, elb, pd, hard, glow, spline, arcLen, at, clipDraw, lumpy, soot, splats, ik,
  BR, BRD, IR, ST, ICE, SKI, LEA, WOOL, ROBE, rimed, icicle, icicles, rimeCrust, facets, frostCracks, hoar,
  lichtenberg, bolt, fusedBead, rivetRow, weld, bevel, dent, bplate, gear, cylinder, hinge, gauntlet, gauntletGrip,
  numeral, dialFrame, ringPath, clockHand, chainLinks, rope, armRig, legTube, bootRig, humanJoints, ribbon, fold, split, side };
