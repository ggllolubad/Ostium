// World XIV, the Blighted Garden: THE HEDGE MAZE (battle room `garden_hedge`, round 2 + polish; renamed from `garden_walk`,
// POLISH (Cole): the maze walls are solids a little under eye height (1.05 m tall, 0.9 m thick) so each shows a lit
// clipped top plane, a lit face, a lit or shadowed side, clipped-leaf texture, gaps, dead stretches and overgrowth,
// receding in perspective; a tall yew outer wall closes the back; the shed stands in a clearing inside the maze.
// whose outputs and script are left in place). The fey lady's yew maze beside the formal walk: the camera looks down a
// maze corridor between 3.6 m hedge walls to its lit turning; on the left the hedge breaks onto a clearing where the
// head gardener's potting shed stands, door open. Encounters: The Hedge Maze (a knight guards the turning), The
// Gardener's Shed (he is pruning).
// Lore (bible/world_XIV_blighted_garden.md): toxin covers everything in fungus, bloom and spore; void gives the growth
// eyes and clips clean holes where things used to be. Eyes in the leaves are expected. Palette: sick pastel blooms
// (pink, lilac, pale yellow) over black loam, with eyes.
// Kind of space: exterior but enclosed: a corridor of hedge receding to a turning. Light: flat overcast noon, a pale
// lilac sky; the lit turning at the end of the corridor is the focus; the left hedge face is in shade, the right lit.
// Shapes: rectilinear clipped walls gone shaggy, a clipped hedge archway, topiary, the shed's gable.
// Usage: node scenes/bg_garden_hedge.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIV');
const { S, B, G } = require('./battle_kit_g5').make(14201, '#141016', '#2a2230', '#b8acc0');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, mould, bracket, caps, tornVoid, eye, quiet, skyBands } = B;
const { W, H, air, rose, foliage, bigCap, tree, cloud } = G;
const MV = require('./materials_v2')(S);
const PINK = '#d4a0b2', LILAC = '#b4a0cc', YEL = '#ded68e', LOAM = '#1a1512', YEW = '#232a20', YEWL = '#3a4634', YEWD = '#121612', MOULD = '#8a8098', BONE = '#d4ccb8', MURK = B.MURK;
const HW = 6.5, HH = 3.6, ZE = 42;

// a hedge face in the plane X = const (o.face: +1 faces +X, -1 faces -X), from za to zb, height h; shaggy top, foliage
// texture laid in the plane, dead stretches, eyes, clipped absences. Shade by facing (lit or in shade).
function hedgeX(X, za, zb, h, o = {}) {
  const lit = o.lit, base = lit ? mix(YEW, YEWL, 0.35) : mix(YEW, YEWD, 0.3), at = (s, t) => [X, t, za + s], L = zb - za;
  const top = []; for (let k = 0; k <= Math.ceil(L * 2); k++) { const s0 = Math.min(L, k / 2); top.push(P(...at(s0, h + Math.sin(k * 1.3) * 0.12 + (R() - 0.5) * 0.18 + (k % 7 === 3 ? 0.25 : 0)))); }
  const poly = [P(...at(0, 0)), ...top, P(...at(L, 0))];
  let s = fillP(poly, air(base, (za + zb) / 2, 0.6)) + `<path d="${p2(poly)}" fill="url(#mottle)" opacity="0.5"/>`;
  const cid = S.id('hx'); s += `<clipPath id="${cid}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${cid})">`;
  // foliage strokes laid in the plane: denser and smaller with distance
  let dk = '', lt = ''; const n = Math.round(L * h * 26);
  for (let i = 0; i < n; i++) { const s0 = R() * L, t = R() * (h + 0.3), p = P(...at(s0, t)), Z = za + s0, l = K(Z) * (0.07 + R() * 0.06), a = -0.9 + (R() - 0.5) * 1.6; const seg = `M${f1(p[0])} ${f1(p[1])} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; if (R() < (lit ? 0.32 : 0.12)) lt += seg; else dk += seg; }
  s += `<path d="${dk}" stroke="${INK}" stroke-width="${f1(o.fw || 1)}" opacity="0.55" stroke-linecap="round"/><path d="${lt}" stroke="${mix(YEWL, '#8a9a7a', 0.4)}" stroke-width="${f1(o.fw || 1)}" opacity="0.7" stroke-linecap="round"/>`;
  // dead stretches: black, furred grey-lilac, shelved with brackets
  for (const [d0, d1] of o.dead || []) { const q = [P(...at(d0, 0)), P(...at(d0 + 0.2, h * 0.9)), P(...at((d0 + d1) / 2, h + 0.1)), P(...at(d1, h * 0.8)), P(...at(d1 - 0.1, 0))]; s += fillS(q, YEWD, 0.95, 0.4); const c = P(...at((d0 + d1) / 2, h * 0.6)), Z = za + (d0 + d1) / 2; s += mould(c[0], c[1], Math.abs(q[3][0] - q[0][0]) * 0.4, K(Z) * 0.5, { col: MOULD, n: 60 }); for (let k = 0; k < 3; k++) { const b = P(...at(d0 + R() * (d1 - d0), 0.6 + R() * 2.2)); s += bracket(b[0], b[1], K(Z) * (0.18 + R() * 0.12), Z, { col: mix(BONE, LILAC, 0.3) }); } }
  if (!lit) s += hatch3(at, 0, L, 0, h + 0.5, 0.8, { op: 0.4, ragged: 0.1 }) + hatch3(at, 0, L, 0, h * 0.5, -0.7, { op: 0.3, ragged: 0.3 });
  s += S.occBand((ss, t) => at(ss, t), L, 0.5, { op: 0.4 });
  s += '</g>' + line(top, 1.2, INK, 0.9);
  // tufts breaking the clipped top line
  let tf = ''; for (let i = 0; i < L * 10; i++) { const k = Math.floor(R() * (top.length - 1)), u = R(), x = top[k][0] + (top[k + 1][0] - top[k][0]) * u, y = top[k][1] + (top[k + 1][1] - top[k][1]) * u, Z = za + k / 2, l = K(Z) * (0.08 + R() * 0.1), a = -1.6 + (R() - 0.5) * 1.4; tf += `M${f1(x)} ${f1(y + 1)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; } s += `<path d="${tf}" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity="0.85"/>`;
  // eyes opened in the foliage, different sizes, out of time
  for (const [s0, t, r] of o.eyes || []) { const c = P(...at(s0, t)), Z = za + s0, rr = K(Z) * r; s += fillS(blob(c[0], c[1], rr * 1.5, rr, 10, 0.4), YEWD, 0.9) + eye(c[0], c[1], rr, { white: '#d8d0c0', iris: R() < 0.5 ? '#7a6a8a' : '#8a8a6a', open: 0.15 + R() * 0.45 }); }
  // roses gone over climbing the face
  for (let i = 0; i < (o.roses || 0); i++) { const s0 = R() * L, t = 0.3 + R() * (h - 0.6), c = P(...at(s0, t)), Z = za + s0; s += rose(c[0], c[1], K(Z) * (0.07 + R() * 0.05), R() < 0.5 ? PINK : LILAC, { eye: R() < 0.05 }); }
  // the void's clipping: clean absences through the hedge's thickness, cut stems showing in the cut
  for (const [s0, t, w, hh, ey] of o.voids || []) { const tv = tornVoid(at, s0, t, w, hh, { depth: 0.9, dir: [-o.face, 0, 0], cut: '#1c221a', mat: base, tears: 2, tearLen: 0.5, teeth: 1, slivers: 3, flecks: 4, halo: false, eyes: ey, eyeO: { white: '#ddd4c4', iris: '#6a5a7a', open: 0.45 } }); s += tv.svg;
    for (let k = 0; k < 10; k++) { const q = tv.outline[Math.floor(R() * tv.outline.length)]; s += `<circle cx="${f1(q[0] + (tv.center[0] - q[0]) * 0.08)}" cy="${f1(q[1] + (tv.center[1] - q[1]) * 0.08)}" r="${f1(Math.max(0.6, K(za + s0) * 0.015))}" fill="#a8a088" stroke="${INK}" stroke-width="0.4"/>`; } }
  return s;
}
// a hedge face in the plane Z = const (facing the camera), from xa to xb
function hedgeZ(Z, xa, xb, h, o = {}) {
  const at = (s, t) => [xa + s, t, Z], L = xb - xa, base = mix(YEW, YEWL, 0.25);
  const top = []; for (let k = 0; k <= Math.ceil(L * 2); k++) top.push(P(...at(Math.min(L, k / 2), h + Math.sin(k * 1.7) * 0.12 + (R() - 0.5) * 0.2)));
  const poly = [P(...at(0, 0)), ...top, P(...at(L, 0))];
  let s = fillP(poly, air(base, Z, 0.7)) + `<path d="${p2(poly)}" fill="url(#mottle)" opacity="0.4"/>` + foliage(poly[0][0], top[0][1], poly[poly.length - 1][0], poly[0][1], Math.round(L * h * 22), { l: K(Z) * 0.1, lit: 0.25, w: 0.8, litCol: air(mix(YEWL, '#8a9a7a', 0.4), Z, 0.5), dkOp: 0.45 });
  s += line(top, 1, INK, 0.8);
  for (const [s0, t, r] of o.eyes || []) { const c = P(...at(s0, t)), rr = K(Z) * r; s += eye(c[0], c[1], rr, { white: '#d8d0c0', iris: '#7a6a8a', open: 0.3 + R() * 0.3 }); }
  return s;
}

// ======================================================================== FAR
const FLR = -3.0;   // the maze lies in a sunken garden 3 m below the terrace the company stands on
layer('far');
raw(G.gradSky([[0, '#b4aabc'], [0.35, '#c8c0ce'], [0.62, '#ddd6e2'], [1, '#ece6ee']]));
for (const [cx, cy, w, h, col] of [[300, 60, 620, 60, '#c4bccc'], [1150, 44, 700, 70, '#beb4c6'], [760, 150, 420, 34, '#d4cedc'], [1340, 180, 300, 26, '#dad4e0']]) raw(G.softCloud(cx, cy, w, h, col, { lit: '#fbf8fc', litK: 0.5, dark: '#8a7e92', darkK: 0.25, op: 0.85 }));
{ let m = ''; for (let k = 0; k < 140; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 260)}" r="${f1(0.5 + R() * 1.2)}" fill="${R() < 0.5 ? YEL : '#f4eef4'}" opacity="${f1(0.3 + R() * 0.4)}"/>`; raw(m); }
// ---- the distance: the great dead trees and pale caps of the wild garden beyond the maze, faded in the haze
for (const [X, Z, h] of [[-34, 75, 22], [-12, 90, 26], [20, 80, 22], [44, 95, 18]]) { const b = P(X, 0, Z); raw(`<g opacity="0.5">${tree(b[0], b[1], K(Z) * h, Z, { col: '#8a8092', tw: K(Z) * 1.2, depth: 2 }).svg}</g>`); }
for (const [X, Z, h] of [[-22, 85, 14], [6, 100, 20], [33, 72, 11]]) { const b = P(X, 0, Z); raw(`<g opacity="0.55">${bigCap(b[0], b[1], K(Z) * h, Z, { col: '#c4b6cc', stem: '#b8acb4' }).svg}</g>`); }
// ---- the maze's tall outer wall of yew at the back (tall: we see its face only), clipped topiary on it, eyes
{
  const ZO = 50, at = (s, t) => [-50 + s, t, ZO], top = []; for (let k = 0; k <= 100; k++) top.push(P(-50 + k, FLR + 4.8 + Math.sin(k * 0.8) * 0.1 + (R() - 0.5) * 0.15, ZO));
  const poly = [P(-50, FLR, ZO), ...top, P(50, FLR, ZO)]; raw(fillP(poly, air(mix(YEW, YEWL, 0.2), ZO, 0.7)) + foliage(0, top[0][1] - 6, W, P(0, FLR, ZO)[1], 1400, { l: K(ZO) * 0.12, lit: 0.25, w: 0.7, litCol: air('#6a7a5a', ZO, 0.5), dkOp: 0.35 }) + line(top, 1, INK, 0.6));
  for (const [X, kind] of [[-20, 'ball'], [-4, 'cone'], [11, 'peacock'], [27, 'ball']]) { const b = P(X, FLR + 4.8, ZO), k = K(ZO), c = air(mix(YEW, YEWL, 0.3), ZO, 0.6);
    if (kind === 'ball') raw(line([b, [b[0], b[1] - k * 0.6]], k * 0.12, INK) + cel(blob(b[0], b[1] - k * 1.2, k * 0.75, k * 0.7, 14, 0.15), { Z: ZO, fill: c, band: k * 0.15 }));
    if (kind === 'cone') raw(fillS([[b[0] - k * 0.8, b[1]], [b[0] - k * 0.3, b[1] - k * 1.8], [b[0] + k * 0.05, b[1] - k * 3.0], [b[0] + k * 0.4, b[1] - k * 1.7], [b[0] + k * 0.9, b[1]]], c, 1, 0.5) + inkS([[b[0] - k * 0.8, b[1]], [b[0] - k * 0.3, b[1] - k * 1.8], [b[0] + k * 0.05, b[1] - k * 3.0], [b[0] + k * 0.4, b[1] - k * 1.7], [b[0] + k * 0.9, b[1]]], 0.8, 0.5));
    if (kind === 'peacock') raw(cel(blob(b[0], b[1] - k * 0.6, k * 0.8, k * 0.5, 12, 0.3), { Z: ZO, fill: c, band: 2 }) + cel(blob(b[0] + k * 0.5, b[1] - k * 1.4, k * 0.2, k * 0.5, 10, 0.3), { Z: ZO, fill: c, band: 1 })); }
  for (const [X, Y, r] of [[-30, 1.8, 0.2], [-12, 1.2, 0.16], [18, 2.0, 0.18], [36, 1.4, 0.15]]) { const c = P(X, FLR + Y + 1, ZO - 0.05); raw(eye(c[0], c[1], K(ZO) * r, { white: '#d8d0c0', iris: '#7a6a8a', open: 0.35 })); }
}
// ---- the maze's old heart-tree: a great dead oak rising out of the maze's middle, hung with blooms, a landmark
{ const b = P(10, FLR, 46), k = K(46); const t = tree(b[0], b[1], k * 20, 46, { col: '#6a6066', tw: k * 1.4, depth: 3, limbs: 4 }); raw(t.svg); for (const [pts] of t.limbs.slice(0, 16)) { const p = pts[pts.length - 1]; raw(rose(p[0], p[1] + 3, k * 0.25, R() < 0.5 ? PINK : LILAC)); } }
// ---- the ground of the maze: gravel paths rotted with loam
{
  raw(fillP([P(-80, FLR, 8), P(80, FLR, 8), P(80, FLR, 50), P(-80, FLR, 50)], mix('#7a7268', MURK, 0.35)) + `<path d="${pp([[-80, FLR, 8], [80, FLR, 8], [80, FLR, 50], [-80, FLR, 50]])}" fill="url(#mottle)" opacity="0.6"/>`);
  let gv = ''; for (let k = 0; k < 900; k++) { const Z = 12 + Math.pow(R(), 1.3) * 36, X = (R() - 0.5) * Z * 2.4, c = P(X, FLR, Z), r = Math.max(0.5, K(Z) * 0.012 * (0.5 + R())); if (c[0] < -5 || c[0] > W + 5) continue; gv += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${R() < 0.5 ? '#a8a094' : '#5a544c'}" opacity="0.6"/>`; } raw(gv);
}
// ---- THE MAZE: clipped yew walls a little under eye height, so their tops read: each wall a solid with a lit top,
// a lit face toward us, a lit left-facing side and a shadowed right-facing side, clipped-leaf texture laid in each face,
// shaggy overgrowth on the edges, gaps where the void clipped them, dead stretches, roses, eyes
const HM = 2.1, TH = 1.0;
function leaves(at, Ls, Lt, Z, col, n, o = {}) {
  // clipped-leaf texture: small leaf marks laid in the face plane (scaled by depth), lit ones and dark ones
  let d1 = '', d2 = '', d3 = '';
  for (let i = 0; i < n; i++) { const s0 = R() * Ls, t = R() * Lt, p = P(...at(s0, t)), z = at(s0, t)[2], l = Math.max(0.8, K(z) * 0.05), a = (o.ang ?? -0.7) + (R() - 0.5) * 1.8; const seg = `M${f1(p[0])} ${f1(p[1])} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; const r = R(); if (r < (o.lit ?? 0.3)) d1 += seg; else if (r < 0.85) d2 += seg; else d3 += `M${f1(p[0] - l * 0.4)} ${f1(p[1])} a${f1(l * 0.4)} ${f1(l * 0.25)} 0 1 0 ${f1(l * 0.8)} 0 a${f1(l * 0.4)} ${f1(l * 0.25)} 0 1 0 ${f1(-l * 0.8)} 0 `; }
  return `<path d="${d2}" stroke="${mix(col, INK, 0.6)}" stroke-width="${f1(o.w || 0.9)}" stroke-linecap="round" opacity="0.7"/><path d="${d1}" stroke="${mix(col, '#c8d8b0', 0.35)}" stroke-width="${f1(o.w || 0.9)}" stroke-linecap="round" opacity="0.75"/><path d="${d3}" fill="${mix(col, '#0a0c08', 0.4)}" opacity="0.6"/>`;
}
function hedgeBox(x0, x1, z0, z1, o = {}) {
  const yb = FLR, h = o.h || HM, yt = yb + h, Zc = (z0 + z1) / 2, fogk = 0.45;
  const TOP = air('#6a7e50', z0, fogk), FRONT = air('#2e3a26', z0, fogk), LITS = air('#46583a', z0, fogk), SHAD = air('#161c12', z0, fogk);
  let s = '';
  const face = (pts3, at, Ls, Lt, col, Z, extra = '') => { const poly = pts3.map(p => P(...p)), cid = S.id('hb'); s += `<path d="${p2(poly)}" fill="${col}"/><clipPath id="${cid}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${cid})"><path d="${p2(poly)}" fill="url(#mottle)" opacity="0.45"/>${leaves(at, Ls, Lt, Z, col, Math.min(900, Math.round(Ls * Lt * 120 * Math.max(0.3, 14 / Z))))}${extra}</g>` + inkP(poly, Math.max(0.5, inkW(Z) * 0.7), 0.8); };
  if (x0 > 0.05) face([[x0, yb, z0], [x0, yb, z1], [x0, yt, z1], [x0, yt, z0]], (s2, t) => [x0, yb + t, z0 + s2], z1 - z0, h, LITS, Zc);
  if (x1 < -0.05) face([[x1, yb, z0], [x1, yb, z1], [x1, yt, z1], [x1, yt, z0]], (s2, t) => [x1, yb + t, z0 + s2], z1 - z0, h, SHAD, Zc, hatch3((s2, t) => [x1, yb + t, z0 + s2], 0, z1 - z0, 0, h, 0.8, { op: 0.45 }));
  face([[x0, yb, z0], [x1, yb, z0], [x1, yt, z0], [x0, yt, z0]], (s2, t) => [x0 + s2, yb + t, z0], x1 - x0, h, FRONT, z0, S.occBand((s2, t) => [x0 + s2, yb + t, z0], x1 - x0, 0.35, { op: 0.4 }));
  face([[x0, yt, z0], [x1, yt, z0], [x1, yt, z1], [x0, yt, z1]], (s2, t) => [x0 + s2, yt, z0 + t], x1 - x0, z1 - z0, TOP, Zc);
  let tf = ''; const edge = (a, b, n) => { for (let i = 0; i < n; i++) { const u = R(), p = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u], q = P(...p), l = K(p[2]) * (0.05 + R() * 0.09), an = -1.6 + (R() - 0.5) * 1.6; tf += `M${f1(q[0])} ${f1(q[1] + 1)} l${f1(Math.cos(an) * l)} ${f1(Math.sin(an) * l)} `; } };
  edge([x0, yt, z0], [x1, yt, z0], Math.round((x1 - x0) * 6)); edge([x0, yt, z1], [x1, yt, z1], Math.round((x1 - x0) * 3)); if (x0 > 0.05) edge([x0, yt, z0], [x0, yt, z1], Math.round((z1 - z0) * 4)); if (x1 < -0.05) edge([x1, yt, z0], [x1, yt, z1], Math.round((z1 - z0) * 4));
  s += `<path d="${tf}" stroke="${air('#2a3622', z0, fogk)}" stroke-width="1" stroke-linecap="round" opacity="0.9"/>`;
  if (o.dead) { const [a, b] = o.dead, q = [P(x0 + a, yb, z0 - 0.01), P(x0 + b, yb, z0 - 0.01), P(x0 + b - 0.1, yt - 0.1, z0 - 0.01), P(x0 + (a + b) / 2, yt + 0.05, z0 - 0.01), P(x0 + a + 0.1, yt - 0.2, z0 - 0.01)]; s += fillS(q, YEWD, 0.95, 0.4); const c = P(x0 + (a + b) / 2, yb + h * 0.5, z0); s += mould(c[0], c[1], Math.abs(q[1][0] - q[0][0]) * 0.35, K(z0) * 0.3, { col: MOULD, n: 30 }); for (let k = 0; k < 4; k++) s += pline([P(x0 + a + (b - a) * (0.2 + k * 0.2), yb + 0.1, z0 - 0.02), P(x0 + a + (b - a) * (0.2 + k * 0.2) + 0.05, yt - 0.2, z0 - 0.02)], 1, '#3a3634', 0.8); const tq = [P(x0 + a, yt, z0), P(x0 + b, yt, z0), P(x0 + b, yt, z1), P(x0 + a, yt, z1)]; s += fillP(tq, YEWD, 0.9) + mould((tq[0][0] + tq[2][0]) / 2, (tq[0][1] + tq[2][1]) / 2, Math.abs(tq[1][0] - tq[0][0]) * 0.3, 3, { col: MOULD, n: 20 }); }
  for (let i = 0; i < (o.roses || 0); i++) { const c = P(x0 + R() * (x1 - x0), yb + 0.3 + R() * (h - 0.5), z0 - 0.02); s += rose(c[0], c[1], K(z0) * (0.07 + R() * 0.04), R() < 0.5 ? PINK : LILAC); }
  for (const [u, v, r] of o.eyes || []) { const c = P(x0 + (x1 - x0) * u, yb + h * v, z0 - 0.02); s += eye(c[0], c[1], K(z0) * r, { white: '#d8d0c0', iris: R() < 0.5 ? '#7a6a8a' : '#8a8a6a', open: 0.2 + R() * 0.4 }); }
  if (o.caps) { const c = P(x0 + (x1 - x0) * 0.6, yt, (z0 + z1) / 2); s += caps(c[0], c[1], K(z0) * 0.25, z0, { col: YEL, n: 3 }); }
  if (o.gap) { const [a, b] = o.gap, q = [P(x0 + a, yb, z0 - 0.02), P(x0 + b, yb, z0 - 0.02), P(x0 + b, yt + 0.02, z0 - 0.02), P(x0 + a, yt + 0.02, z0 - 0.02), P(x0 + a, yt + 0.02, z1), P(x0 + b, yt + 0.02, z1)]; s += fillP([q[0], q[1], q[2], q[5], q[4], q[3]], air('#1e1a16', z0, 0.5)); }
  return s;
}
// the maze plan: walls in rows (along X) and columns (along Z); gaps, dead stretches and a clipped void absence
const WALLS = [
  [-26, -9.5, 12.5, 13.5, { roses: 5, eyes: [[0.7, 0.55, 0.12]], gap: [5, 6.2] }], [3.0, 26, 12.5, 13.5, { dead: [4, 7], roses: 4 }],
  [-10.5, -9.5, 13.5, 17, {}], [3.0, 4.0, 13.5, 21, { roses: 2 }],
  [-18, -4.5, 17, 18, { eyes: [[0.3, 0.5, 0.1]], caps: true }], [8.5, 22, 17, 18, { dead: [3, 5] }],
  [-4.5, -3.5, 18, 22.5, {}], [13, 14, 18, 27, {}],
  [-26, -14, 22.5, 23.5, { roses: 2 }], [-8, 3.5, 22.5, 23.5, { eyes: [[0.65, 0.45, 0.09]], dead: [6, 8] }], [8, 20, 22.5, 23.5, { caps: true, gap: [5, 6] }],
  [2.5, 3.5, 23.5, 27.5, {}], [-14.5, -13.5, 23.5, 28, {}],
  [-8.5, 0.5, 27.5, 28.5, { roses: 2 }], [5, 12, 27.5, 28.5, { eyes: [[0.4, 0.5, 0.08]] }],
  [-26, -17, 33, 34, {}], [-7, 9, 33, 34, { dead: [3, 5], roses: 3 }], [14, 26, 33, 34, {}],
  [-20, -6, 38, 39, {}], [5, 22, 38, 39, { roses: 2 }], [-24, -9, 42, 43, {}], [-2, 18, 42, 43, {}],
];
// draw far to near: by z0 descending, then by distance from the centre line (outer first)
const order = WALLS.slice().sort((a, b) => (b[2] - a[2]) || (Math.abs((b[0] + b[1]) / 2) - Math.abs((a[0] + a[1]) / 2)));
// the clearing with the head gardener's potting shed (behind the row at Z 24.5, left), drawn in its depth order
const shed = () => {
  const X0 = -13.2, X1 = -9.0, Z0 = 29.2, Z1 = 31.8, F = FLR, eave = FLR + 2.4, ridge = FLR + 4.2;
  raw(box(X0, X1, F, eave, Z0, Z1, { col: '#6a5e4c', shadeOp: 0.45, top: false }));
  for (let y = F + 0.25; y < eave; y += 0.22) raw(pline([P(X0, y, Z0), P(X1, y, Z0)], 0.6, INK, 0.5));
  const dq = [P(X0 + 1.4, F, Z0 - 0.01), P(X0 + 2.4, F, Z0 - 0.01), P(X0 + 2.4, F + 1.95, Z0 - 0.01), P(X0 + 1.4, F + 1.95, Z0 - 0.01)]; raw(fillP(dq, '#0c0a0a') + inkP(dq, 1));
  const lf = [P(X0 + 1.4, F, Z0), P(X0 + 0.6, F, Z0 - 0.8), P(X0 + 0.6, F + 1.95, Z0 - 0.8), P(X0 + 1.4, F + 1.95, Z0)]; raw(cel(lf, { Z: Z0, fill: '#5a5040', band: 1.5 }));
  const g = [P(X0, eave, Z0), P((X0 + X1) / 2, ridge, Z0), P(X1, eave, Z0)]; raw(cel(g, { Z: Z0, fill: '#5e5444', band: 1.5 }));
  const rf = [P(X0 - 0.3, eave - 0.1, Z0 - 0.3), P((X0 + X1) / 2, ridge + 0.15, Z0 - 0.3), P((X0 + X1) / 2, ridge + 0.15, Z1 + 0.3), P(X0 - 0.3, eave - 0.1, Z1 + 0.3)]; raw(cel(rf, { Z: Z0, fill: '#4a5040', band: 2 }) + mould((rf[0][0] + rf[1][0]) / 2, (rf[0][1] + rf[1][1]) / 2, 18, 6, { col: MOULD, n: 40 }));
  const rf2 = [P((X0 + X1) / 2, ridge + 0.15, Z0 - 0.3), P(X1 + 0.3, eave - 0.1, Z0 - 0.3), P(X1 + 0.3, eave - 0.1, Z0 - 0.1), P((X0 + X1) / 2, ridge, Z0 - 0.1)]; raw(cel(rf2, { Z: Z0, fill: '#3a3e32', band: 1 }));
  raw(caps(P((X0 + X1) / 2, ridge + 0.2, Z0)[0], P((X0 + X1) / 2, ridge + 0.2, Z0)[1], 10, Z0, { col: YEL, n: 4 }));
  for (const [x, l] of [[X1 - 0.5, 1.7], [X1 - 0.9, 1.5]]) raw(line([P(x, F + 2.1, Z0 - 0.05), P(x + 0.1, F + 2.1 - l, Z0 - 0.05)], 1.6, INK) + line([P(x, F + 2.1, Z0 - 0.05), P(x + 0.1, F + 2.1 - l, Z0 - 0.05)], 0.8, '#8a7a5a'));
  { const c = P(X1 - 1.5, F + 1.6, Z0 - 0.05); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(K(Z0) * 0.3)}" ry="${f1(K(Z0) * 0.08)}" fill="#c8b478" stroke="${INK}" stroke-width="0.7"/>` + caps(c[0] + 2, c[1] - 2, 5, Z0, { col: PINK, n: 2 })); }
  for (let k = 0; k < 5; k++) { const c = P(X0 + 0.4 + (k % 3) * 0.3, F + 0.18 + Math.floor(k / 3) * 0.3, Z0 - 0.4); raw(cel([[c[0] - 4, c[1] - 4], [c[0] + 4, c[1] - 4], [c[0] + 3, c[1] + 4], [c[0] - 3, c[1] + 4]], { Z: Z0, fill: '#9a6a4a', band: 1 })); }
  { const b = P(-17.5, FLR, 31); raw(tree(b[0], b[1], K(31) * 8, 31, { col: '#5a5058', tw: K(31) * 0.45, depth: 3 }).svg); }
};
// the hedge archway at the turning, tall, clipped over an iron frame (the knight's post), at the far end of the centre
const archway = () => {
  const Z = 36.5, F = FLR, xa = -3.6, xb = 3.6, ow = 1.5, at = (s, t) => [s, t, Z];
  const outer = [P(xa, F, Z), P(xa, F + 4.0, Z), P(0, F + 4.8, Z), P(xb, F + 4.0, Z), P(xb, F, Z)];
  const inner = []; for (let k = 0; k <= 14; k++) { const a = Math.PI - k / 14 * Math.PI; inner.push(P(Math.cos(a) * ow, F + 2.2 + Math.sin(a) * ow * 0.9, Z)); }
  const holeP = [P(-ow, F, Z), ...inner, P(ow, F, Z)];
  const cid = S.id('ha'); raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${p2(outer)} ${p2(holeP)}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(fillP(outer, mix(YEW, YEWL, 0.2)) + foliage(P(xa, F, Z)[0], P(0, F + 4.9, Z)[1], P(xb, F, Z)[0], P(0, F, Z)[1], 900, { l: K(Z) * 0.1, lit: 0.25, w: 0.8 }) + hatch3((u, t) => [u, F + t, Z], xa, xb, 0, 4.9, 0.8, { op: 0.18 }));
  raw(fillS(blob(P(-1.9, F + 3.0, Z)[0], P(-1.9, F + 3.0, Z)[1], K(Z) * 0.6, K(Z) * 0.5, 12, 0.3), YEWD, 0.95));
  for (let k = 0; k < 3; k++) raw(pline([P(-2.4 + k * 0.35, F + 2.6, Z), P(-2.3 + k * 0.35, F + 3.4, Z)], 1.2, '#3a3634'));
  raw('</g>' + line(inner, 1.1, INK) + line(outer.slice(1, 4), 1.1, INK));
  // its thickness: the arch's side seen in depth
  raw(fillP([outer[3], P(xb, F + 4.0, Z + 1.0), P(xb, F, Z + 1.0), outer[4]], air('#2a3424', Z, 0.6)) + fillP([outer[1], outer[2], outer[3], P(xb, F + 4.0, Z + 1.0), P(0, F + 4.8, Z + 1.0), P(xa, F + 4.0, Z + 1.0)], air('#5e6e4a', Z, 0.6)));
  for (const [x, y, r] of [[1.9, 3.3, 0.1], [-2.8, 1.6, 0.09]]) { const c = P(x, F + y, Z); raw(eye(c[0], c[1], K(Z) * r, { white: '#d8d0c0', iris: '#7a6a8a', open: 0.35 })); }
  for (let i = 0; i < 10; i++) { const p = inner[Math.floor(R() * inner.length)]; raw(rose(p[0] + (R() - 0.5) * 8, p[1] - 3 + (R() - 0.5) * 6, K(Z) * (0.08 + R() * 0.05), R() < 0.5 ? PINK : LILAC)); }
};
let shedDone = false, archDone = false;
for (const [x0, x1, z0, z1, o] of order) {
  if (!archDone && z0 < 36.5) { archway(); archDone = true; }
  if (!shedDone && z0 < 29.2) { shed(); shedDone = true; }
  raw(hedgeBox(x0, x1, z0, z1, o));
  // the void has clipped one wall clean through: an absence with the cut stems showing
  if (x0 === -8 && z0 === 22.5) raw(tornVoid((s2, t) => [x0 + s2, FLR + t, z0 - 0.02], 3.2, 1.1, 1.8, 1.4, { depth: 0.9, cut: '#1c221a', mat: '#34402c', tears: 2, tearLen: 0.4, teeth: 1, slivers: 3, flecks: 4, halo: false, eyes: [[0.1, 0.0, 0.32]], eyeO: { white: '#ddd4c4', iris: '#6a5a7a', open: 0.45 } }).svg);
}
// ---- the terrace the company stands on: gravel, a worn path, its stone kerb along the drop to the sunken maze, a stair
// leading down in the middle; scale: the kerb 0.3 m, the treads 0.35 m
{
  const ZK = 7.0;
  raw(fillP([P(-60, 0, 3.6), P(60, 0, 3.6), P(60, 0, ZK), P(-60, 0, ZK)], mix('#8a8278', MURK, 0.35)) + `<path d="${pp([[-60, 0, 3.6], [60, 0, 3.6], [60, 0, ZK], [-60, 0, ZK]])}" fill="url(#mottle)" opacity="0.6"/>`);
  let gv = ''; for (let k = 0; k < 500; k++) { const Z = 3.8 + R() * (ZK - 3.9), X = (R() - 0.5) * 30, c = P(X, 0, Z), r = Math.max(0.6, K(Z) * 0.012 * (0.5 + R())); gv += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${R() < 0.5 ? '#a8a094' : '#5a544c'}" opacity="0.6"/>`; } raw(gv);
  for (let k = 0; k < 7; k++) { const z = 5.2 + k * 0.25, pts = [P(-14, 0, z), P(-4, 0, z + 0.08), P(6, 0, z - 0.05), P(16, 0, z)]; raw(line(pts, 1, k % 3 ? '#6a6458' : '#9a9488', 0.35)); }
  // the kerb: dressed stone blocks of their own lengths, chipped, a few missing; lit top, its face falling away
  for (let X = -30; X < 30; X += 0.7 + R() * 0.9) { const x1 = X + 0.6 + R() * 0.8; if (Math.abs((X + x1) / 2) < 1.4) continue; if (R() < 0.06) continue; { const qt = chip([P(X + 0.02, 0.3, ZK), P(x1 - 0.02, 0.3, ZK), P(x1 - 0.02, 0.3, ZK + 0.35), P(X + 0.02, 0.3, ZK + 0.35)], 0.4), qf = chip([P(X + 0.02, 0, ZK), P(x1 - 0.02, 0, ZK), P(x1 - 0.02, 0.3, ZK), P(X + 0.02, 0.3, ZK)], 0.4), ft = S.tone('#5e5a54', 0.18), ff = S.tone('#3e3a36', 0.18); raw(cel(qt, { Z: ZK, fill: ft, band: 1 }) + MV.stoneMarks(qt, ZK, ft, { wy0: 0.3 }) + cel(qf, { Z: ZK, fill: ff, band: 1 }) + MV.stoneMarks(qf, ZK, ff, { wy0: 0 })); } raw('' + (R() < 0.3 ? B.mould((P(X, 0.3, ZK)[0] + P(x1, 0.3, ZK)[0]) / 2, P(X, 0.3, ZK)[1], 8, 2, { col: MOULD, n: 8 }) : '')); }
  // the stair down into the maze, its treads falling away from us
  // the head of the stair down into the maze: a gap in the kerb between two newel posts topped with stone balls
  for (const X of [-1.5, 1.5]) { raw(box(X - 0.18, X + 0.18, 0, 0.5, ZK, ZK + 0.36, { col: '#4e4a46', shadeOp: 0.45 })); const c = P(X, 0.6, ZK + 0.18), r = K(ZK) * 0.11; raw(cel(blob(c[0], c[1], r, r * 0.95, 12, 0.06), { Z: ZK, fill: '#5e5a54', band: r * 0.3 }) + B.mould(c[0], c[1] + r * 0.3, r * 0.7, r * 0.3, { col: MOULD, n: 12 })); }
  for (let k = 0; k < 10; k++) { const c = P((R() - 0.5) * 12, 0, 4.2 + R() * 2.6), w = 20 + R() * 40; let pt = ''; for (let j = 0; j < 24; j++) { const x = c[0] + (R() - 0.5) * w, y = c[1] + (R() - 0.5) * 4, col = R() < 0.5 ? PINK : LILAC; pt += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1 + R() * 1.6)}" ry="${f1(0.5 + R() * 0.6)}" fill="${mix(col, '#5a4040', R() * 0.5)}" opacity="0.75"/>`; } raw(pt); }
  raw(S.occBand((s2, t) => [-60 + s2, 0, 3.6 + t], 120, 1.0, { op: 0.35, ang: 0.25 }));
}
raw(quiet([[300, 0.08], [350, 0.1]], { hop: 0.1 }));

// ======================================================================== MID
layer('mid');
{ // a heap of fresh clippings (the gardener is pruning) with dropped shears; a fairy ring of caps on the gravel
  const Z = 9.8, c = P(3.2, 0, Z); raw(cel(blob(c[0], c[1] - 6, K(Z) * 0.7, 8, 14, 0.4), { Z, fill: mix(YEW, MURK, 0.2), band: 2 }) + foliage(c[0] - K(Z) * 0.6, c[1] - 13, c[0] + K(Z) * 0.6, c[1], 60, { l: 3, lit: 0.2 }));
  const a = P(1.6, 0.03, Z - 0.4), b = P(2.4, 0.03, Z - 0.6); raw(line([a, b], 3, INK) + line([a, b], 1.6, mix('#6a6664', MURK, 0.3)) + line([[a[0] + 4, a[1] - 3], [b[0] + 2, b[1] + 3]], 3, INK) + line([[a[0] + 4, a[1] - 3], [b[0] + 2, b[1] + 3]], 1.6, mix('#6a6664', MURK, 0.3)));
  // the gardener's wheelbarrow tipped on its nose beside the clippings (a familiar size: a 1.4 m barrow)
  { const Zb = 9.4, k = K(Zb), w0 = P(4.6, 0.35, Zb), w1 = P(5.9, 0.62, Zb + 0.1); raw(cel([[w0[0] - k * 0.1, w0[1] - k * 0.05], [w1[0], w1[1] - k * 0.25], [w1[0] + k * 0.1, w1[1] + k * 0.05], [w0[0] + k * 0.1, w0[1] + k * 0.25]], { Z: Zb, fill: mix('#5a4a38', MURK, 0.3), band: 2 }));
    raw(`<ellipse cx="${f1(w0[0] - k * 0.05)}" cy="${f1(w0[1] + k * 0.2)}" rx="${f1(k * 0.16)}" ry="${f1(k * 0.2)}" fill="${mix('#3a3028', MURK, 0.3)}" stroke="${INK}" stroke-width="1.2"/>` + line([w1, [w1[0] + k * 0.5, w1[1] + k * 0.45]], 2.4, INK) + line([[w1[0] + k * 0.05, w1[1] + k * 0.1], [w1[0] + k * 0.55, w1[1] + k * 0.55]], 2.2, INK)); }
  const Z2 = 10.4; for (let i = 0; i < 9; i++) { const a2 = i / 9 * 6.283, p = P(-3.6 + Math.cos(a2) * 0.8, 0, Z2 + Math.sin(a2) * 0.45); raw(caps(p[0], p[1], K(Z2) * (0.08 + R() * 0.06), Z2, { col: mix(BONE, MURK, 0.35), n: 2 })); }
}

// ======================================================================== FORE
layer('fore');
{ // left: the hedge's near clipped end, a shaggy wall of yew at the frame edge, a lead plant label on a wire, an eye
  const pts = [[-10, -5], [70, -5], [62, 60], [78, 140], [64, 260], [80, 380], [70, H + 5], [-10, H + 5]];
  raw(fillS(pts, '#1a2018', 1, 0.3) + foliage(-10, -5, 85, H, 700, { l: 7, lit: 0.12, w: 1.6 }));
  raw(eye(40, 210, 14, { white: '#d0c8b8', iris: '#7a6a8a', open: 0.4 }) + mould(30, 330, 30, 40, { col: MOULD, n: 60 }));
  raw(pline([[60, 120], [86, 128]], 1, '#6a6664') + cel([[84, 124], [112, 128], [110, 140], [82, 137]], { Z: 4, fill: '#8a8a88', band: 1.5 }) + pline([[88, 132], [104, 133]], 0.8, '#3a3a3a'));
}
{ // right: a clipped yew ball on a stem in a cracked stone planter, gone shaggy and half dead, an eye open in it
  const c = [W - 40, 120], r = 88; raw(line([[W - 44, 230], [W - 40, H + 5]], 18, INK) + line([[W - 44, 230], [W - 40, H + 5]], 13, '#3a3028'));
  raw(cel(blob(c[0], c[1], r, r * 0.92, 18, 0.18), { Z: 4, fill: '#232a20', band: 10 }) + foliage(c[0] - r, c[1] - r, c[0] + r, c[1] + r, 500, { l: 7, lit: 0.18, w: 1.5 }));
  raw(fillS([[c[0] - r * 0.9, c[1] + r * 0.2], [c[0] - r * 0.3, c[1] + r * 0.45], [c[0] + 10, c[1] + r * 0.9], [c[0] - r * 0.6, c[1] + r * 0.7]], YEWD, 0.95) + mould(c[0] - r * 0.5, c[1] + r * 0.55, 26, 14, { col: MOULD, n: 50 }) + bracket(c[0] - r * 0.6, c[1] + r * 0.62, 36, 4, { col: YEL }));
  raw(eye(c[0] - 46, c[1] - 34, 13, { white: '#d8d0c0', iris: '#8a8a6a', open: 0.4 }));
  const pl = [[W - 128, H + 5], [W - 116, 420], [W - 100, 402], [W - 40, 394], [W + 5, 398], [W + 5, H + 5]]; raw(cel(pl, { Z: 4, fill: '#6a6670', band: 6, tex: 'url(#mottle)', texOp: 0.5 }) + pline([[W - 80, 398], [W - 70, 440], [W - 84, H]], 1.6, INK));
}
{ let m = ''; for (let k = 0; k < 40; k++) { const x = R() * W, y = R() * H, col = [PINK, LILAC, YEL][k % 3]; m += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.5 + R() * 2)}" ry="${f1(0.8 + R())}" transform="rotate(${f1(R() * 180)} ${f1(x)} ${f1(y)})" fill="${col}" stroke="${INK}" stroke-width="0.4" opacity="0.7"/>`; } raw(m); }

G.write(OUT, 'garden_hedge');
