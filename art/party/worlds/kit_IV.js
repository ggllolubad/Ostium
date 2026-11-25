// World IV, The Sulphur Pits (Fire + Toxin, Combust): shared helpers for world_IV.js.
// Fire (dominant) consumes from inside: split skin with glowing seams, charred edges, upward curling ash, flaking.
// Toxin ripens and rots: gas sacs, swelling, yellow sulphur crust, ripening blisters, peeling.
// Never cartoon flames on heads; never slime puddles; never neon green glow.
// Palette: sulphur yellow, ochre smoke, lamp orange, plus ink black, bone and grey (and the shared material library).
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell } = E;
const { split, side } = require('../dirAC');

const P = {
  sul: '#c4a22e', sulL: '#e8d27a', sulD: '#7e6218', sulP: '#f2e6a8', // sulphur yellow (dulled, never lemon)
  och: '#9a7448', ochL: '#c09a64', ochD: '#5e4428', smoke: '#8a7050', // ochre smoke
  lamp: '#e2782a', lampL: '#f6a848', hot: '#ffd27a', core: '#fff0c0', ember: '#b84a1c', // lamp orange
  soot: '#2a2420', sootL: '#45392f', sootD: '#15110e', char: '#1c120c',
  bone: '#d6cdb8', boneD: '#9a917e', grey: '#77736a', greyD: '#4e4b45', greyL: '#a8a49a',
  iron: '#3c3834', ironL: '#625c54', rust: '#6e3c22',
  wood: '#4e3a26', woodD: '#2e2216', woodL: '#76603e',
  leath: '#4a3622', leathD: '#2c2014', leathL: '#6e5236',
  canvas: '#6e604a', canvasD: '#4a4032', canvasL: '#8c7c60',
  brass: '#9c8044', brassD: '#5e4a22', brassL: '#c8ac66',
  skin: '#a48c6c', skinS: '#4e3a30', skinL: '#c4ac88', // sallow miner's skin under soot
  mud: '#2a2218',
};

// the world's render setup: kit.foeBase, sooty mud, warm-brown shadow tint; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.27), shadowTint: '#221a18', mud: P.mud }, o));

// textures and glow filters for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  // craze: a fine net of charred cracks for burnt skin and scorched leather
  let c = '';
  for (let i = 0; i < 18; i++) { let x = r() * 48, y = r() * 48, a = r() * 6.3; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 3; k++) { a += (r() - 0.5) * 1.6; x += Math.cos(a) * (3 + r() * 5); y += Math.sin(a) * (3 + r() * 5); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } c += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="craze${s}" patternUnits="userSpaceOnUse" width="48" height="48">${c}</pattern>`);
  // soot: soft dark smudge noise
  f.defs.push(`<filter id="sootf${s}"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="${s + 21}"/><feColorMatrix values="0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 -2.4 1.3"/></filter>`);
  f.defs.push(`<pattern id="soot${s}" patternUnits="userSpaceOnUse" width="400" height="400"><rect width="400" height="400" filter="url(#sootf${s})"/></pattern>`);
  // grain: granular crust (sulphur druse) specks
  let g = '';
  for (let i = 0; i < 40; i++) { const x = r() * 30, y = r() * 30, rr = 0.6 + r() * 1.4; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > 0.5 ? INK : '#f4e8b0'}" opacity="${r() > 0.5 ? 0.45 : 0.6}"/>`; }
  f.defs.push(`<pattern id="grain${s}" patternUnits="userSpaceOnUse" width="30" height="30">${g}</pattern>`);
  // wrinkle: fine creases
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  // plate: chitin growth lines
  f.defs.push(`<pattern id="growth${s}" patternUnits="userSpaceOnUse" width="10" height="7"><path d="M0,3.5 q5,-2 10,0" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/></pattern>`);
  // glow filters: small and large soft blooms
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

// one sulphur crystal: a hexagonal prism side-on, pointed, with a lit facet (lit side is +x for foes) and a ridge
function crystal(f, b, a, L, w, o = {}) {
  const d = rot([1, 0], a), n = [-d[1], d[0]], tipOff = (o.tip ?? 0.12) * w;
  const p = (u, v) => add(add(b, mul(d, u)), mul(n, v));
  const col = o.col || P.sul;
  const pts = [[...p(0, -w / 2), 1], [...p(L * 0.78, -w / 2), 1], [...p(L, tipOff), 1], [...p(L * 0.8, w / 2), 1], [...p(0, w / 2), 1]];
  f.part(pts, { fill: col, shadow: o.shadow || P.sulD, light: P.sulP, shade: 0.4, inkW: o.inkW ?? 1, inkHeavy: o.inkH ?? 1.5, cast: false, hatch: false, gritOp: 0.25 });
  // the facet toward the light (+x and up) is pale; the facet away is dark
  const litSide = (n[0] * 0.6 - n[1] * 0.8) > 0 ? 1 : -1;
  f.flat([p(0, 0), p(L * 0.79, 0), p(L, tipOff), p(L * 0.8 * (litSide > 0 ? 1 : 0.98), litSide * w / 2), p(0, litSide * w / 2)], P.sulP, { op: 0.45 });
  f.flat([p(0, 0), p(L * 0.79, 0), p(L, tipOff), p(L * 0.78, -litSide * w / 2), p(0, -litSide * w / 2)], P.sulD, { op: 0.35 });
  f.line([p(0, 0), p(L * 0.79, 0), p(L, tipOff)], 0.9, INK, { op: 0.55, straight: true });
}
// a druse: a cluster of crystals growing from a crusted base at b, along a (screen angle), size s. A few big chunky
// prisms and more small ones, each tilted its own way, the small ones crowding round the feet of the big ones.
function druse(f, b, a, s, n = 5, o = {}) {
  const base = ell(b, s * 0.5, s * 0.24, a + Math.PI / 2, 12).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * s * 0.14, (f.r() - 0.5) * s * 0.14]) : q);
  f.part(base, { fill: mix(P.sul, P.och, 0.35), shadow: P.sulD, shade: 0.4, tex: 'grain' + f.o.seed, texOp: 0.8, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false });
  const list = [];
  const big = Math.max(1, Math.round(n * 0.35));
  for (let i = 0; i < n; i++) {
    const isBig = i < big, off = (f.r() - 0.5) * s * 0.7;
    const aa = a + (f.r() - 0.5) * (isBig ? 0.9 : 1.6) * (o.fan ?? 1);
    const L = s * (isBig ? R(f, 0.7, 1.05) : R(f, 0.22, 0.5)), w = L * (isBig ? R(f, 0.26, 0.34) : R(f, 0.3, 0.42));
    list.push([add(b, rot([0, off], a)), aa, L, w]);
  }
  list.sort((x, y) => x[2] - y[2]).reverse().forEach(([q, aa, L, w]) => crystal(f, q, aa, L, w, o)); // big ones behind, small ones in front
  for (let i = 0; i < 4; i++) f.flat(ell(add(b, rot([(f.r() - 0.3) * s * 0.2, (f.r() - 0.5) * s * 0.8], a)), s * 0.05, s * 0.035, 0, 6), P.sulP, { op: 0.6 }); // grains at the foot
}
// a field of granular sulphur crust: low lumpy plates with grain, a few small crystals poking out
function crust(f, c, rx, ry, n, r0, r1, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, r0, r1);
    const pts = ell(p, r * 1.3, r * 0.8, f.r() * 3, 10).map((q, k) => k % 2 ? add(q, [(f.r() - 0.5) * r * 0.5, (f.r() - 0.5) * r * 0.5]) : q);
    f.part(pts, { fill: mix(P.sul, P.och, f.r() * 0.4), shadow: P.sulD, shade: 0.45, tex: 'grain' + f.o.seed, texOp: 0.8, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, gritOp: 0.3 });
    f.flat(ell(add(p, [r * 0.3, -r * 0.3]), r * 0.4, r * 0.22, -0.4, 6), P.sulP, { op: 0.5 });
    if (o.spikes !== false && f.r() < (o.spikes ?? 0.35)) crystal(f, p, (o.up ?? -Math.PI / 2) + (f.r() - 0.5) * 1.2, r * R(f, 1.2, 2.2), r * 0.5);
  }
}
// sweat beads of yellow brimstone: small drops with a bright shine
function beads(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, 1.6, 3.6) * s;
    f.part(ell(p, r, r * 1.2, 0, 8), { fill: P.sulL, shadow: P.sulD, shade: 0.35, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false, gritOp: 0.1 });
    f.flat(ell(add(p, [r * 0.3, -r * 0.4]), r * 0.3, r * 0.3, 0, 6), '#fffbe8', { op: 0.85 });
  }
}
// a falling bead (a drip): teardrop plus a drop below
function drip(f, p, s = 1, col = P.sulL) { f.flat([add(p, [-1.8 * s, 0]), add(p, [1.8 * s, 0]), add(p, [0, 8 * s])], col, { op: 0.9 }); f.flat(ell(add(p, [0, 13 * s]), 2.2 * s, 3.4 * s, 0, 6), col, { op: 0.9 }); f.flat(ell(add(p, [0.6 * s, 12 * s]), 0.7 * s, 1 * s, 0, 5), '#fff', { op: 0.6 }); }
// a ripening blister: yellow-ochre dome with a tight shine and an inflamed base; burst ones are crusted craters
function blister(f, c, r, o = {}) {
  if (o.burst) {
    f.part(ell(c, r * 1.15, r * 0.82, o.ang || 0, 12), { fill: mix(P.sulD, P.och, 0.4), shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
    f.flat(ell(add(c, [r * 0.1, r * 0.1]), r * 0.6, r * 0.42, o.ang || 0, 10), '#1e140c', { op: 0.85 });
    f.flat(ell(add(c, [-r * 0.45, -r * 0.3]), r * 0.3, r * 0.16, 0, 6), P.sulL, { op: 0.7 });
    return;
  }
  f.flat(ell(add(c, [0, r * 0.1]), r * 1.45, r * 1.05, o.ang || 0, 12), '#7a3a20', { op: 0.45 }); // inflamed skin round it
  f.part(ell(c, r, r * 0.86, o.ang || 0, 14), { fill: o.col || mix(P.sul, P.och, 0.3), shadow: mix(P.sulD, P.ochD, 0.5), shade: 0.5, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, gritOp: 0.3 });
  f.flat(ell(add(c, [-r * 0.1, r * 0.25]), r * 0.6, r * 0.35, 0, 8), mix(P.sulL, '#fff', 0.2), { op: 0.35 }); // pus pooled low under the skin
  f.flat(ell(add(c, [r * 0.32, -r * 0.34]), r * 0.22, r * 0.14, -0.6, 6), '#fffbe8', { op: 0.6 }); // small tight shine toward the key light
  f.flat(ell(add(c, [-r * 0.2, r * 0.25]), r * 0.2, r * 0.13, 0, 6), P.ochD, { op: 0.55 });
}
function blisters(f, c, rx, ry, n, r0, r1, o = {}) {
  const pts = []; for (let i = 0; i < n; i++) pts.push([scatter(f, c, rx, ry), R(f, r0, r1), f.r() < (o.burst ?? 0.25)]);
  pts.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r, b]) => blister(f, p, r, { burst: b, col: o.col }));
}
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
    const pts = K.chain([S0, E0, W0], ws, { steps: 10, bp: o.bp, bq: o.bq });
    if (o.capTop) { const d0 = E.norm(sub(E0, S0)), n0 = [-d0[1], d0[0]], r = ws[0] / 2; for (let i = 1; i < 6; i++) { const a = Math.PI * i / 6; pts.push(add(S0, add(mul(n0, -Math.cos(a) * r), mul(d0, -Math.sin(a) * r * o.capTop)))); } } // a rounded shoulder end
    const d = f.part(pts, Object.assign({ k: 0.9 }, look));
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
// skin looks
const SK = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o);
const LEA = (f, o = {}) => Object.assign({ fill: P.leath, shadow: P.leathD, shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.35 }, o);
const CAN = (f, o = {}) => Object.assign({ fill: P.canvas, shadow: '#2e2820', shade: 0.38, tex: 'weave' + f.o.seed, texOp: 0.45 }, o);

module.exports = { P, base, textures, R, scatter, ang, elb, pd, glow, glowLine, seam, crackNet, hairline, crystal, druse, crust, beads, drip, blister, blisters, flakes, ash, smoke, soot, fuse, rope, chainLinks, fullLeg, legRig, armRig, legTube, bootRig, humanJoints, ik, spline, arcLen, at, clipDraw, lumpy, splats, SK, LEA, CAN, split, side };
