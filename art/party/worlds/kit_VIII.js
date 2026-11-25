// World VIII, The Sundered Rime (Fire + Frost, Thermal Shock): shared helpers for world_VIII.js.
// The bible's rule: every body is split, one side rimed white, the other charred with glowing orange seams, and the line
// between them cracking. Fire (first course, dominant) consumes from inside: split skin with glowing seams, charred
// edges, upward curling ash, flaking. Frost stills and preserves: rime crust on the windward side, icicles that hang
// plumb, faceted planes, frozen mid-gesture. Never cartoon flames on heads; never clean ice crystals or snowflakes.
// Palette: white ice split by orange seams, black obsidian, plus ink black, bone and grey (and the shared material
// library: leather, fur, wool, iron, mail, all dulled toward grey). Gold only on holy things (none here). Red only for
// blood (the Shieldmaiden's cuts).
// Several helpers are copied from other world kits (kit_IV glow/seam/crackNet/flakes/ash/smoke/fullLeg/legRig/armRig/
// legTube/bootRig/humanJoints/ik/spline/clipDraw/lumpy; kit_I_a tube/openHand) so this world does not depend on them.
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell } = E;
const { split, side } = require('../dirAC');

const P = {
  // ice and rime: blue-white, never clean crystal
  ice: '#d2dce0', iceL: '#eef4f5', iceM: '#aebcc4', iceD: '#7e909c', iceS: '#3a4658', glass: '#bcd0d8', rime: '#f2f6f6',
  // frozen skin: grey-white with a cold violet shadow, so it reads as flesh and not as steel
  skinI: '#b9c2c6', skinIS: '#4a5068',
  // living skin under it all (the hold's people): pale, weathered
  skin: '#bfa894', skinS: '#5e4440',
  // charred: charcoal with a warm brown light, never pure black, so ink detail still reads
  char: '#3a302c', charL: '#5c4c42', charD: '#1c1513', charS: '#0c0807',
  // obsidian: black glass with a cold glossy light
  obs: '#1a1820', obsL: '#6a6a80', obsM: '#34323e', obsS: '#060509',
  // molten orange seams
  lamp: '#e2782a', lampL: '#f6a848', hot: '#ffd27a', core: '#fff0c0', ember: '#b84a1c',
  // shared material library, dulled toward grey
  bone: '#d6cdb8', boneD: '#9a917e', grey: '#77736a', greyD: '#4e4b45', greyL: '#a8a49a',
  iron: '#3c3a3a', ironL: '#625e5c', mail: '#5a5c60', rust: '#5e3a26',
  leath: '#4a3e36', leathD: '#2a221e', leathL: '#6a5a4e',
  fur: '#5e564e', furD: '#2e2a26', furL: '#8a8278',
  wool: '#6a645a', woolD: '#45413a', woolL: '#8c8678',
  wood: '#4a3a2c', woodD: '#2a2018', woodL: '#6e5a44',
  blood: '#7a1a14', bloodD: '#4a0c08',
  steam: '#e4e8e8',
  mud: '#2a2826',
};

// the world's render setup: kit.foeBase, a cold slate shadow tint, sooty slush at the feet; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.25), shadowTint: '#232634', mud: P.mud }, o));

// textures and glow filters for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  // craze: a fine net of charred cracks for burnt skin, leather and wood
  let c = '';
  for (let i = 0; i < 18; i++) { let x = r() * 48, y = r() * 48, a = r() * 6.3; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 3; k++) { a += (r() - 0.5) * 1.6; x += Math.cos(a) * (3 + r() * 5); y += Math.sin(a) * (3 + r() * 5); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } c += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="craze${s}" patternUnits="userSpaceOnUse" width="48" height="48">${c}</pattern>`);
  // rime: hoar frost as uneven pale specks and short feathered strokes leaning one way (into the wind), never stars
  let g = '';
  for (let i = 0; i < 34; i++) { const x = r() * 40, y = r() * 40, rr = 0.5 + r() * 1.4; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#f6fafa" opacity="${(0.5 + r() * 0.4).toFixed(2)}"/>`; }
  for (let i = 0; i < 12; i++) { const x = r() * 40, y = r() * 40, l = 3 + r() * 5; g += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(-l).toFixed(1)},${(-l * 0.25).toFixed(1)} M${(x - l * 0.5).toFixed(1)},${(y - l * 0.12).toFixed(1)} l${(-l * 0.3).toFixed(1)},${(l * 0.35).toFixed(1)}" stroke="#f6fafa" stroke-width="0.8" opacity="0.7"/>`; }
  for (let i = 0; i < 6; i++) { const x = r() * 40, y = r() * 40; g += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(2 + r() * 4).toFixed(1)},${(1 + r() * 3).toFixed(1)}" stroke="${INK}" stroke-width="0.7" opacity="0.45"/>`; }
  f.defs.push(`<pattern id="rime${s}" patternUnits="userSpaceOnUse" width="40" height="40">${g}</pattern>`);
  // frost crackle: a sparse angular net of fine dark lines, for frozen flesh and ice (faceted, not round)
  let q = '';
  for (let i = 0; i < 9; i++) { let x = r() * 64, y = r() * 64; let d = `M${x.toFixed(1)},${y.toFixed(1)}`; for (let k = 0; k < 2; k++) { x += (r() - 0.5) * 22; y += (r() - 0.5) * 22; d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } q += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.4"/>`; }
  f.defs.push(`<pattern id="crack${s}" patternUnits="userSpaceOnUse" width="64" height="64">${q}</pattern>`);
  // fur: short strokes
  let fu = '';
  for (let i = 0; i < 30; i++) { const x = r() * 30, y = r() * 30, l = 4 + r() * 5; fu += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q1,${(l / 2).toFixed(1)} ${(r() - 0.5).toFixed(1)},${l.toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="fur${s}" patternUnits="userSpaceOnUse" width="30" height="30">${fu}</pattern>`);
  f.defs.push(`<filter id="glow${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>`);
  f.defs.push(`<filter id="glowL${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>`);
  f.defs.push(`<filter id="smk${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`);
  f.defs.push(`<filter id="smkL${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>`);
}

const R = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
const pd = pts => E.smooth(pts, false);

// ---------------------------------------------------------------- fire
function glow(f, c, rx, ry, col = P.lamp, op = 0.3, big = false, a = 0) {
  f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
}
function glowLine(f, pts, w, col = P.lamp, op = 0.4, big = false) {
  f.raw(`<path d="${pd(pts)}" fill="none" stroke="${col}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
}
// a split in the skin with a glowing seam: charred lips, an orange core, a hot thread, a soft bloom
function seam(f, pts, w = 3, o = {}) {
  if (o.glow !== false) glowLine(f, pts, w * 4, P.lamp, o.glowOp ?? 0.35);
  f.stroke(pts, w * 2.6, P.charS, { op: 0.9 });
  f.stroke(pts, w * 1.5, P.ember);
  f.stroke(pts, w * 1.05, P.lamp);
  f.stroke(pts.slice(1, -1).length > 1 ? pts.slice(1, -1) : pts, w * 0.45, o.hot || P.hot);
}
function crackNet(f, c, a, len, w, o = {}) {
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 4;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * 0.9; q = add(q, rot([L / n, 0], b)); pts.push(q); }
    seam(f, pts, ww, o);
    if (depth > 0) for (let k = 1; k < n; k++) if (f.r() < (o.fork ?? 0.55)) go(pts[k], b + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), L * R(f, 0.35, 0.6), ww * 0.65, depth - 1);
  };
  go(c, a, len, w, o.depth ?? 2);
}
function hairline(f, pts, w = 1.4) { f.line(pts, w + 1.2, P.charS, { op: 0.8 }); f.line(pts.slice(1, -1).length > 1 ? pts.slice(1, -1) : pts, w * 0.6, P.lampL, { op: 0.85 }); }
// charred flakes lifting off a surface: dark curled flakes with a pale ash under-edge
function flakes(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = f.r() * 6.3, l = R(f, 5, 10) * s;
    f.flat([p, add(p, rot([l, -l * 0.2], a)), add(p, rot([l * 1.1, l * 0.35], a)), add(p, rot([l * 0.3, l * 0.4], a))], P.charS, { op: 0.9 });
    f.line([add(p, rot([l * 0.3, l * 0.42], a)), add(p, rot([l * 1.08, l * 0.36], a))], 1, P.greyL, { op: 0.6 });
  }
}
// ash rising from p and curling: dark flakes and a few dull embers, smaller as they rise
function ash(f, p, n, spread = 40, rise = 140, s = 1) {
  for (let i = 0; i < n; i++) {
    const t = i / n, q = add(p, [(f.r() - 0.5) * spread + Math.sin(t * 7 + p[0]) * 10 * s, -t * rise - f.r() * 12]), r = (1.2 + f.r() * 2.6) * s * (1 - t * 0.5), a = f.r() * 6.3;
    if (f.r() < 0.25) f.flat(ell(q, r * 0.7, r * 0.7, 0, 6), f.r() > 0.5 ? P.lampL : P.hot, { op: 0.85 });
    else f.flat([add(q, rot([-r * 1.4, 0], a)), add(q, rot([0, -r * 0.7], a)), add(q, rot([r * 1.4, -r * 0.2], a)), add(q, rot([r * 0.3, r * 0.5], a))], f.r() > 0.4 ? '#2a2420' : '#6a625a', { op: 0.8 });
  }
}
// embers: tiny hot specks sitting in the charred side's cracks
function embers(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = R(f, 0.8, 2.2) * s; f.flat(ell(p, r, r * 0.8, 0, 6), f.r() > 0.5 ? P.lampL : P.lamp, { op: 0.9 }); } }
// a steam or smoke wisp curling up from p0: soft body plus a thin defining curl (no cartoon puffs)
function steam(f, p0, h, w, o = {}) {
  const sw = o.sway ?? 18, ph = o.phase ?? 0, C = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; C.push(add(p0, [Math.sin(t * 4 + ph) * sw * t + (o.drift ?? 0) * t, -h * t])); }
  const L = [], Rr = [];
  C.forEach((c, i) => { const t = i / 10, ww = w * (0.35 + t * 0.9) / 2; L.push(add(c, [-ww, 0])); Rr.push(add(c, [ww, 0])); });
  f.raw(`<path d="${E.smooth([...L, ...Rr.reverse()])}" fill="${o.col || P.steam}" opacity="${o.op ?? 0.26}" filter="url(#${o.big ? 'smkL' : 'smk'}${f.o.seed})"/>`);
  f.line(C.slice(1).map((c, i) => add(c, [Math.sin(i * 1.3 + ph) * w * 0.2, 0])), 1.1, o.line || '#c8d0d2', { op: o.lineOp ?? 0.5 });
  f.line(C.slice(3).map((c, i) => add(c, [w * 0.25 + Math.cos(i * 1.1 + ph) * w * 0.15, 4])), 0.9, P.iceD, { op: 0.35 });
}
function soot(f, c, rx, ry, op = 0.5, a = 0) { f.flat(ell(c, rx, ry, a, 14).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3]) : q), P.charS, { op }); }

// ---------------------------------------------------------------- frost
// icicles hanging plumb from points along an edge: tapered, faceted (a lit facet and a dark one), a drop at the tip
function icicle(f, p, len, w, o = {}) {
  const tip = add(p, [o.lean || 0, len]);
  const pts = [[...add(p, [-w / 2, 0]), 1], [...add(lerp(p, tip, 0.45), [-w * 0.28, 0])], [...tip, 1], [...add(lerp(p, tip, 0.4), [w * 0.3, 0])], [...add(p, [w / 2, 0]), 1]];
  f.part(pts, { fill: o.col || P.glass, shadow: P.iceS, light: P.iceL, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, gritOp: 0.2, k: 0.7 });
  f.line([add(p, [w * 0.15, 1]), add(lerp(p, tip, 0.7), [w * 0.05, 0])], Math.max(0.8, w * 0.18), P.iceL, { op: 0.8, straight: true });
  if (len > 14) f.line([add(lerp(p, tip, 0.2), [-w * 0.25, 0]), add(lerp(p, tip, 0.32), [-w * 0.1, 0])], 0.8, INK, { op: 0.5, straight: true });
  if (o.drop) f.flat(ell(add(tip, [0, 6]), 1.4, 2.2, 0, 6), P.iceL, { op: 0.8 });
}
// a row of icicles under an edge polyline: n of them, lengths in [l0, l1], widths scaled from the length
function icicles(f, edge, n, l0, l1, o = {}) {
  const C = spline(edge, 3), S = arcLen(C), T = S[S.length - 1];
  for (let i = 0; i < n; i++) { const u = T * (i + 0.3 + f.r() * 0.4) / n, q = at(C, S, u).p, l = R(f, l0, l1) * (i % 3 === 1 ? 1.3 : 1); icicle(f, add(q, [0, -2]), l, Math.max(3, l * (o.wk ?? 0.22)), { drop: f.r() < 0.4, col: o.col }); }
}
// rime crust: a lumpy pale band along a polyline, with short feathers growing into the wind (dir: unit vector)
function rimeCrust(f, pts, w, dir, o = {}) {
  const C = spline(pts, 4), S = arcLen(C), T = S[S.length - 1], L = [], Rr = [];
  for (let u = 0; u <= T; u += 6) { const a = at(C, S, u), ww = w * (0.55 + 0.45 * Math.sin(u * 0.09 + 1) * Math.sin(u * 0.031)) * (0.75 + f.r() * 0.35); L.push(add(a.p, mul(a.n, ww * 0.5))); Rr.push(add(a.p, mul(a.n, -ww * 0.5))); }
  f.part([...L, ...Rr.reverse()], { fill: o.col || P.rime, shadow: P.iceM, light: '#ffffff', shade: 0.3, inkW: o.inkW ?? 1.1, inkHeavy: 1.6, cast: false, hatch: false, gritOp: 0.25, tex: 'rime' + f.o.seed, texOp: 0.6, k: 0.9 });
  // feathers: little blades leaning into the wind, rooted on the crust
  const n = Math.round(T / (o.gap || 9));
  for (let i = 0; i < n; i++) { const a = at(C, S, (i + f.r()) * T / n), l = R(f, 2, 4.5) * (o.feather ?? 1); f.line([a.p, add(a.p, add(mul(dir, l), [0, -l * 0.2])), add(a.p, mul(dir, l * 1.3))], 1, '#ffffff', { op: 0.75, straight: true }); }
}
// faceted planes on frozen flesh or ice: a few angular light and dark facets (the "still" read), clipped by the caller
function facets(f, c, rx, ry, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, 6, 16) * (o.s || 1), a = f.r() * 6.3;
    const pts = [0, 1, 2, 3].map(k => add(p, rot([r * (0.6 + f.r() * 0.6), 0], a + k * 1.57 + (f.r() - 0.5) * 0.6)));
    f.flat(pts, f.r() > 0.45 ? P.iceL : P.iceD, { op: o.op ?? 0.3 });
    f.line([pts[0], pts[1], pts[2]], 0.8, INK, { op: 0.35, straight: true });
  }
}
// frost cracks: dark angular hairlines in ice (no glow)
function frostCracks(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), a = f.r() * 6.3; let q = p; const pts = [p]; for (let k = 0; k < 3; k++) { q = add(q, rot([R(f, 5, 12), 0], a + (f.r() - 0.5) * 1.2)); pts.push(q); } f.line(pts, 0.9, INK, { op: 0.6, straight: true }); f.line(pts.map(z => add(z, [0.8, 0.8])), 0.7, P.iceL, { op: 0.5, straight: true }); } }
// meltwater: a thin running stream with a bead at the end
function melt(f, p, len, s = 1) { const pts = [p, add(p, [1.5 * s, len * 0.4]), add(p, [-1 * s, len * 0.75]), add(p, [0.5 * s, len])]; f.line(pts, 2.2 * s, P.iceS, { op: 0.35 }); f.line(pts, 1.2 * s, P.glass, { op: 0.85 }); f.flat(ell(add(pts[3], [0, 3 * s]), 1.6 * s, 2.4 * s, 0, 6), P.iceL, { op: 0.85 }); }

// ---------------------------------------------------------------- the split
// a jagged dividing line: resample a polyline every `step` px and push each point off the line by up to `amp`
function jag(f, line, amp, step = 14) {
  const C = spline(line, 2), S = arcLen(C), T = S[S.length - 1], out = [];
  const n = Math.max(2, Math.round(T / step));
  for (let i = 0; i <= n; i++) { const a = at(C, S, T * i / n), off = (i === 0 || i === n) ? 0 : (f.r() - 0.5) * 2 * amp * (i % 3 === 0 ? 1.5 : 1); out.push(add(a.p, mul(a.n, off))); }
  return out;
}
// the region on one side of a polyline that runs right across the figure. sgn +1: the side the clockwise normal
// [d.y, -d.x] points to (for a line drawn top to bottom, the screen-right side); -1 the other side.
function halfRegion(line, sgn, L = 6000) {
  const a = line[0], b = line[1], y = line[line.length - 2], z = line[line.length - 1];
  const start = add(a, mul(E.norm(sub(a, b)), L)), end = add(z, mul(E.norm(sub(z, y)), L));
  const D = E.norm(sub(end, start)), n = [D[1] * sgn, -D[0] * sgn];
  return [start, ...line, end, add(end, mul(n, L)), add(start, mul(n, L))];
}
const regionD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z';
// draw() clipped to a region (SVG path d or polygon), in place on the current bone
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : regionD(region);
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
// draw something twice: drawIce() on the rimed side of the split, drawChar() on the charred side
function sides(f, Sp, drawIce, drawChar) {
  let r;
  if (drawIce) r = clipDraw(f, halfRegion(Sp.line, Sp.ice), drawIce);
  if (drawChar) clipDraw(f, halfRegion(Sp.line, -Sp.ice), drawChar);
  return r;
}
// The split body part. Sp = { line (jagged), ice: which side (+1/-1) is rimed, dir: the wind (rime feathers lean into it) }.
// The part is drawn in the ice look on one side and the char look on the other, each with its course's surface (rime
// specks and faceted planes; craze, flakes and embers), and the cracking glowing line along the split.
function thermal(f, pts, Sp, iceLook, charLook, o = {}) {
  const bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], rx = (bb[2] - bb[0]) / 2, ry = (bb[3] - bb[1]) / 2;
  const box = `<rect x="${(bb[0] - 10).toFixed(1)}" y="${(bb[1] - 10).toFixed(1)}" width="${(bb[2] - bb[0] + 20).toFixed(1)}" height="${(bb[3] - bb[1] + 20).toFixed(1)}"`;
  let d;
  sides(f, Sp, () => { d = f.part(pts, iceLook); }, () => { d = f.part(pts, charLook); });
  clipDraw(f, d, () => {
    sides(f, Sp, () => {
      f.raw(`${box} fill="url(#rime${f.o.seed})" opacity="${o.rimeOp ?? 0.5}"/>`);
      if (o.facets !== false) facets(f, c, rx, ry, o.nFacets ?? Math.max(2, Math.round(rx * ry / 1800)), { op: 0.28, s: o.fs || 1 });
      if (o.iceAfter) o.iceAfter();
    }, () => {
      f.raw(`${box} fill="url(#craze${f.o.seed})" opacity="${o.crazeOp ?? 0.8}"/>`);
      if (o.nEmbers !== 0) embers(f, c, rx, ry, o.nEmbers ?? Math.max(2, Math.round(rx * ry / 1500)));
      if (o.charAfter) o.charAfter();
    });
    if (o.rift !== false) rift(f, Sp, o.riftW ?? 3, o.faint);
  });
  return d;
}
// the cracking line itself: a glowing seam along the split, a rime lip on the ice side, a charred lip on the other,
// and short cracks branching off into both sides (dark in the ice, glowing in the char)
function rift(f, Sp, w = 3, faint = false) {
  const L = Sp.line;
  const off = (k, d) => L.map((p, i) => { const a = L[Math.max(0, i - 1)], b = L[Math.min(L.length - 1, i + 1)], t = E.norm(sub(b, a)), n = [t[1] * Sp.ice, -t[0] * Sp.ice]; return add(p, mul(n, d * k)); });
  if (faint) {
    // a limb's split: a dark crack with a frost lip, glowing only where it has opened
    f.line(off(1, w * 1.2), w * 1.1, P.rime, { op: 0.6 });
    f.line(L, w * 1.3, P.charS, { op: 0.85 });
    for (let i = 1; i < L.length - 2; i += 3) if (f.r() < 0.75) seam(f, [L[i], L[i + 1], L[Math.min(L.length - 1, i + 2)]], w * 0.55, { glow: false });
    return;
  }
  glowLine(f, L, w * 5, P.lamp, 0.22);
  // rime lip on the ice side, charred lip on the other
  f.line(off(1, w * 1.1), w * 0.9, P.rime, { op: 0.65 });
  f.line(off(-1, w * 1.3), w * 1.5, P.charS, { op: 0.85 });
  seam(f, L, w, { glow: false });
  // branches: every few points, a short crack off each side
  for (let i = 2; i < L.length - 2; i += 3) {
    const a = L[i - 1], b = L[i + 1], t = E.norm(sub(b, a)), n = [t[1] * Sp.ice, -t[0] * Sp.ice];
    const iceTip = add(add(L[i], mul(n, R(f, 8, 18) * w / 3)), mul(t, R(f, -6, 6)));
    f.line([L[i], lerp(L[i], iceTip, 0.5).map((v, j) => v + (f.r() - 0.5) * 3), iceTip], 1, INK, { op: 0.7 });
    if (f.r() < 0.7) { const ct = add(add(L[i + 1], mul(n, -R(f, 8, 20) * w / 3)), mul(t, R(f, -6, 6))); seam(f, [L[i + 1], lerp(L[i + 1], ct, 0.5), ct], w * 0.4, { glow: false }); }
  }
}

// ---------------------------------------------------------------- materials and bodies
function rope(f, pts, w, o = {}) {
  const col = o.col || '#7a6e58';
  f.line(pts, w + 2.2, INK, { k: o.k });
  f.line(pts, w, col, { k: o.k });
  f.line(pts.map(q => add(q, [w * 0.18, -w * 0.18])), Math.max(0.7, w * 0.22), mix(col, '#fff', 0.35), { op: 0.6, k: o.k });
  const n = pts.length; let acc = 0;
  for (let i = 0; i < n - 1; i++) { const a = pts[i], b = pts[i + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; for (let t = (acc % (w * 1.4)); t < L; t += w * 1.4) { const q = add(a, mul(d, t)); f.line([add(q, mul(nn, w * 0.5)), add(add(q, mul(nn, -w * 0.5)), mul(d, w * 0.6))], 0.9, INK, { op: 0.6, straight: true }); } acc += L; }
}
function chainLinks(f, pts, s, col = P.iron) {
  const C = []; for (let i = 0; i < pts.length - 1; i++) { const L = E.len(sub(pts[i + 1], pts[i])), n = Math.max(1, Math.round(L / (s * 0.8))); for (let k = 0; k < n; k++) C.push([lerp(pts[i], pts[i + 1], k / n), lerp(pts[i], pts[i + 1], (k + 1) / n)]); }
  C.forEach(([a, b], i) => {
    const m = lerp(a, b, 0.5), an = ang(a, b);
    if (i % 2) { f.line([add(m, rot([-s * 0.5, 0], an)), add(m, rot([s * 0.5, 0], an))], s * 0.26 + 1.6, INK, { straight: true }); f.line([add(m, rot([-s * 0.45, 0], an)), add(m, rot([s * 0.45, 0], an))], s * 0.22, mix(col, '#fff', 0.15), { straight: true }); }
    else { const e = ell(m, s * 0.58, s * 0.3, an, 12); f.line(e.concat([e[0]]), s * 0.2 + 1.6, INK); f.line(e.concat([e[0]]), s * 0.16, col); f.line(e.slice(7, 11), 0.9, mix(col, '#fff', 0.5), { op: 0.8 }); }
  });
}
// a soft tube shoulder to wrist (sleeve or bare arm), cut at the elbow. ws: widths at shoulder, elbow, wrist
function armRig(f, S0, E0, W0, ws, draw, sfx) {
  const de = elb(S0, E0, W0);
  return split(f, draw, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
}
// a leg tube hip to ankle, cut at the knee
function legRig(f, Hp, Kn, A, wK, draw, sfx) {
  const dk = elb(Hp, Kn, A);
  return split(f, draw, [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, side(Kn, dk, wK * 0.6)]]);
}
// a boot (or any foot drawing) cut at the ankle for the rig
function footRig(f, K0, A, s, draw, sfx) {
  const da = add(E.norm(sub(A, K0)), [0.6, 0]);
  return split(f, draw, [['shin' + sfx, side(A, mul(da, -1), s * 0.36)], ['foot' + sfx, side(A, da, s * 0.36)]]);
}
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  if (J.HN) f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  if (J.HF) f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), b = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], b + sign * a)), Wr];
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
function lumpy(f, pts, amp) { const c = pts.reduce((a, p) => add(a, mul(p, 1 / pts.length)), [0, 0]); return pts.map(p => { const d = E.norm(sub(p, c)), k = (f.r() - 0.4) * amp; return p[2] ? [...add(p, mul(d, k)), 1] : add(p, mul(d, k)); }); }
function splats(f, c, rx, ry, n, col = P.charS) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = 2 + f.r() * 5; f.flat(ell(p, r * 1.4, r, f.r() * 3, 8), col, { op: 0.8 }); } }
// a tapered tube through joint points with a rounded far end (one outline for a whole finger or claw)
function tube(pts, ws, capK = 0.9) {
  const o = K.chain(pts, ws, { steps: 6 }), n = o.length / 2, Pp = o.slice(0, n), Q = o.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = ws[ws.length - 1] / 2, cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(b, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * capK)))); }
  return [...Pp, ...cap, ...Q];
}
// a reaching, clawing open hand with knuckles and creases: wrist c, axis ang, length s; spread, curl per finger.
// o.look: part look; o.flip mirrors the thumb side; returns fingertip points.
function clawHand(f, c, ang0, s, o = {}) {
  const sg = o.flip ? -1 : 1, F = pts => pts.map(p => add(c, rot([p[0] * s, p[1] * s * sg], ang0)));
  const look = Object.assign({ cast: false }, o.look), dk = mix(look.shadow || '#000', '#000', 0.3), lt = mix(look.fill, '#fff', 0.4);
  const FG = [[0.42, -0.16, 0.36, 0.085], [0.47, -0.055, 0.46, 0.095], [0.48, 0.05, 0.5, 0.1], [0.45, 0.155, 0.45, 0.096]];
  const curl = o.curl ?? [0.4, 0.35, 0.3, 0.25], sp = o.spread ?? 0.16, tips = [];
  const palm = F([[-0.04, -0.15], [0.1, -0.2], [0.3, -0.215], [0.44, -0.2], [0.5, -0.1], [0.51, 0.04], [0.48, 0.18], [0.36, 0.23], [0.18, 0.25], [0.04, 0.21], [-0.04, 0.1]]);
  const fingers = () => FG.forEach(([u, v, L, w], i) => {
    let a = (i - 1.6) * sp, p = [u, v]; const segs = [p];
    for (let k = 0; k < 3; k++) { a += curl[i] * (k ? 0.9 : 0.3); p = add(p, rot([L * [0.46, 0.3, 0.24][k], 0], a)); segs.push(p); }
    const S = F(segs), W = w * s;
    f.part(tube(S, [W, W * 0.92, W * 0.82, W * 0.72]), Object.assign({}, look, { inkW: 1.3, inkHeavy: 2 }));
    for (const k of [1, 2]) { const q = S[k], dd = E.norm(sub(S[k + 1], S[k - 1])), nn = [-dd[1], dd[0]]; for (let j = 0; j < 2; j++) f.line([add(add(q, mul(dd, (j - 0.5) * W * 0.2)), mul(nn, W * 0.36)), add(q, mul(dd, (j - 0.5) * W * 0.2 - 1)), add(add(q, mul(dd, (j - 0.5) * W * 0.2)), mul(nn, -W * 0.36))], j ? 0.9 : 1.3, INK, { op: 0.6 }); }
    if (o.nails !== false) { const a2 = S[2], b2 = S[3]; f.flat([lp(a2, b2, 0.45, W * 0.25), lp(a2, b2, 1.0, W * 0.2), lp(a2, b2, 1.05, -W * 0.05), lp(a2, b2, 0.45, -W * 0.15)], o.nail || mix(look.fill, P.bone, 0.4), { op: 0.85 }); }
    f.flat(ell(S[1], W * 0.22, W * 0.15, 0, 8), lt, { op: 0.35 });
    tips.push(S[3]);
  });
  const thumb = () => { const ta = o.thumbAng ?? 0.95, b0 = [0.08, 0.17], b1 = add(b0, rot([0.25, 0], ta)), b2 = add(b1, rot([0.2, 0], ta - 0.3 + (o.thumbCurl ?? 0.2))); const S = F([add(b0, rot([-0.05, 0], ta)), b1, b2]); f.part(tube(S, [0.15 * s, 0.12 * s, 0.1 * s]), Object.assign({}, look, { inkW: 1.3, inkHeavy: 2 })); f.line([lp(S[1], S[2], -0.05, 0.05 * s), lp(S[1], S[2], 0.02, 0), lp(S[1], S[2], -0.05, -0.05 * s)], 1.2, INK, { op: 0.6 }); tips.push(S[2]); };
  if (o.back) { thumb(); f.part(palm, Object.assign({}, look, { inkW: 1.5, inkHeavy: 2.4 })); fingers(); }
  else { fingers(); f.part(palm, Object.assign({}, look, { inkW: 1.5, inkHeavy: 2.4 })); thumb(); }
  // knuckle bumps and tendons on the back of the hand
  for (const [u, v] of FG) { const k0 = F([[u, v]])[0]; f.flat(ell(k0, s * 0.045, s * 0.03, ang0, 8), lt, { op: 0.4 }); f.line([F([[0.06, v * 0.4]])[0], k0], 1, dk, { op: 0.45 }); }
  return tips;
}
// an obsidian plate: black glass with a glossy streak, conchoidal ripple arcs and a chipped edge.
// o.state: 'ice' (frosted, rime on the top edge), 'hot' (a glowing seam inside the glass) or none.
function glassPlate(f, pts, o = {}) {
  const look = Object.assign(OBS(f), o.look || {});
  if (o.state === 'ice') Object.assign(look, { fill: mix(P.obs, P.iceD, 0.35), light: P.iceL });
  const d = f.part(pts, Object.assign({ k: 0.4, inkW: o.inkW ?? 1.3, inkHeavy: o.inkH ?? 2.2 }, look));
  const bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], w = bb[2] - bb[0], h = bb[3] - bb[1], m = Math.min(w, h);
  clipDraw(f, d, () => {
    // glossy streak toward the key light (upper right for foes drawn facing right), and a second fainter one
    f.line([add(c, [w * 0.05, -h * 0.38]), add(c, [w * 0.32, -h * 0.1])], Math.max(1.2, m * 0.08), '#e8ecf4', { op: 0.75, straight: true });
    f.line([add(c, [-w * 0.2, -h * 0.1]), add(c, [w * 0.05, h * 0.2])], Math.max(0.8, m * 0.04), '#c8ccdc', { op: 0.45, straight: true });
    // conchoidal ripples: nested arcs from a strike point
    const sp = add(c, [-w * 0.3, h * 0.3]);
    for (let i = 1; i <= 3; i++) { const e = ell(sp, m * 0.22 * i, m * 0.18 * i, -0.6, 14).slice(9, 14); f.line(e, 0.8, '#8a8aa0', { op: 0.5 }); }
    if (o.state === 'ice') { f.raw(`<rect x="${bb[0] - 4}" y="${bb[1] - 4}" width="${w + 8}" height="${h + 8}" fill="url(#rime${f.o.seed})" opacity="0.55"/>`); }
    if (o.state === 'hot') seam(f, [add(c, [-w * 0.4, -h * 0.1]), add(c, [-w * 0.05, h * 0.05]), add(c, [w * 0.2, -h * 0.05]), add(c, [w * 0.45, h * 0.15])], Math.max(1, m * 0.06));
  });
  // a chip out of one corner: a pale scalloped bite
  if (o.chip !== false) { const q = lerp(pts[Math.floor(f.r() * pts.length)], c, 0.12); f.flat(ell(q, m * 0.07, m * 0.05, f.r() * 3, 8), '#8a8aa0', { op: 0.45 }); }
  if (o.state === 'ice' && o.crust !== false) { const top = pts.slice().sort((a, b) => a[1] - b[1]).slice(0, 2).sort((a, b) => a[0] - b[0]); if (E.len(sub(top[1], top[0])) > 10) rimeCrust(f, top, Math.max(3, m * 0.12), [-1, 0], { gap: 6, inkW: 0.8 }); }
  return d;
}
// shared looks
const SKI = (f, o = {}) => Object.assign({ fill: P.skinI, shadow: P.skinIS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o);
const SKC = (f, o = {}) => Object.assign({ fill: P.char, shadow: P.charS, light: P.charL, shade: 0.36, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o);
const ICE = (f, o = {}) => Object.assign({ fill: P.ice, shadow: P.iceS, light: P.iceL, shade: 0.34, tex: 'crack' + f.o.seed, texOp: 0.6 }, o);
const LEA = (f, o = {}) => Object.assign({ fill: P.leath, shadow: P.leathD, shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.3 }, o);
const FUR = (f, o = {}) => Object.assign({ fill: P.fur, shadow: P.furD, shade: 0.4, tex: 'fur' + f.o.seed, texOp: 0.7 }, o);
const WOOL = (f, o = {}) => Object.assign({ fill: P.wool, shadow: P.woolD, shade: 0.4, tex: 'weave' + f.o.seed, texOp: 0.5 }, o);
const OBS = (f, o = {}) => Object.assign({ fill: P.obs, shadow: P.obsS, light: P.obsL, shade: 0.42, hi: 0.14, tex: 'mottle' + f.o.seed, texOp: 0.4 }, o);
// look variants for the two sides of a split: rimed (pale, cold shadow, rime specks) and charred
const rimed = (look, k = 0.45) => Object.assign({}, look, { fill: mix(look.fill, P.ice, k), shadow: mix(look.shadow || '#222', P.iceS, 0.7), light: P.iceL });
const charred = (look, k = 0.6) => Object.assign({}, look, { fill: mix(look.fill, P.char, k), shadow: P.charS, light: mix(look.fill, P.charL, 0.6) });

module.exports = { P, base, textures, R, scatter, ang, elb, pd, glow, glowLine, seam, crackNet, hairline, flakes, ash, embers, steam, soot,
  icicle, icicles, rimeCrust, facets, frostCracks, melt, jag, halfRegion, regionD, clipDraw, sides, thermal, rift,
  rope, chainLinks, armRig, legRig, footRig, humanJoints, ik, spline, arcLen, at, lumpy, splats, tube, clawHand,
  SKI, SKC, ICE, LEA, FUR, WOOL, OBS, rimed, charred, split, side, glassPlate };
