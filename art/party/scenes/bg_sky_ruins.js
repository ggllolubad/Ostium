// World XV, the Torn Sky: THE FLOATING STAIR (battle room `sky_ruins`; finale-tier rebuild, 2026-11-24, kit
// battle_kit_xv.js). The processional stair of heaven, which climbed from the lower heavens to the summit where the Mother
// of Courses sat. When the void betrayed her and the sky tore, the stair broke: above the fighters' landing its flights
// have come apart and drift up and away along the stair's own line, each flight a little further from the last and a
// little more turned, so the break reads as one slow motion, never as scattered junk. The stair rides on arches whose
// piers have broken off; their lower drums sink below it in the same sequence. It climbs toward a rent in the storm at the
// upper left, where the light of heaven still pours through in broad warm shafts, and toward a cathedral island far up in
// that light. On the right a storm wall towers over the drop, and through a tear in it something looks in. Islands of
// heaven hang over the storm, waterfalls pouring off their lips, one moored to the stair by great chains. A building-sized
// halo, fallen from a statue at the stair's head, hangs broken over the upper flights, its broken arc drifting outward in
// order. Encounters: The Floating Steps (angels guard what is left of the stair), The Host's Last Stand (a knight and the
// lightning he serves). No war: the host died at its posts; nothing here fought.
// Lightning only as violet burns on surfaces; void as clean-rimmed absence with an eye; gold leaf only on the holy.
// Usage: node scenes/bg_sky_ruins.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XV');
const { S, B, G, X } = require('./battle_kit_xv').make(15211, '#1a1424', '#24182e', '#4a3a5a');
const { P, K, p2, f1, INK, raw, layer, cel, chip, mix, R, smooth, inkW, hatchA, hatchB } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, burn, fused, eye, quiet } = B;
const { W, H, GOLD, GOLDL, GOLDD, BLACK } = G;
const { fade, burnV, grad, rgrad, blurF, glowE, sky, softCloud, stormWall, cloudSea, shaftG, weather, stone, giltW, tearS, rain, island, halo, column, chainC, driftSeq } = X;
const MURK = B.MURK, LIGHT = '#ffd68a', STONE = '#b0a596', STONED = '#3a2e44';

// ======================================================================== FAR
layer('far');
// ---- the sky: deep indigo at the zenith, violet over the storm on the right, warm gold in the rent at the upper left
raw(sky([[0, '#140f20'], [0.25, '#271d38'], [0.5, '#3e2f4e'], [0.62, '#55425c'], [0.7, '#3a2e48'], [1, '#1e1828']], [
  [170, 40, 520, 260, '#f6c878', 0.75], [210, 20, 220, 120, '#fff0c8', 0.85], [520, 160, 700, 160, '#c08a6a', 0.25], [1250, 120, 500, 300, '#160e22', 0.6]]));
// high cloud cover framing the rent: dark masses whose edges toward the rent are lit gold
// the cloud sea far below, under everything
raw(cloudSea(300, 350, { col: '#4a3c56', lit: '#e0b494', dark: '#1a1424', rows: 7, big: 0.5, light: [-0.9, -0.4] }));
// the dark ceiling of the storm, its underside lit gold where the rent opens; a lit cumulus bank under the rent
raw(softCloud(780, 6, 1000, 120, { col: '#2a2038', lit: '#f0c080', dark: '#100a18', light: [-0.8, 0.6], flat: 0.5, peak: 0.6, fronts: 4, wisps: 4, rim: 10, inkOp: 0.2 }));
raw(softCloud(70, 190, 300, 80, { col: '#5a4458', lit: '#ffe0a8', dark: '#241a2c', light: [0.2, -1], fronts: 2, wisps: 3, rim: 9 }));
raw(softCloud(560, 236, 760, 70, { col: '#45364e', lit: '#f0c090', dark: '#1c1426', light: [-0.8, -0.6], flat: 0.6, peak: 0.6, fronts: 4, wisps: 3, rim: 7 }));
// ---- the cathedral island far up in the light, the stair's destination (low contrast, lost in the glow)
raw(island(255, 92, 210, { k: 0.72, col: '#8a7a70', depth: 0.6, build: [{ type: 'cathedral', u: -0.05, s: 0.55, lightWin: true }, { type: 'tower', u: 0.32, s: 0.25, h: 1.6 }, { type: 'dome', u: -0.35, s: 0.2 }], falls: [[-0.42, 0.025], [0.44, 0.02]], fallLen: 160, drops: 3 }));
// ---- the storm wall on the right: a towering wall of billows, violet-black, its flank lit by the heaven-light; rain
raw(stormWall(880, 1560, 300, -30, { rows: 5, col: '#261c32', edge: v => 1080 - v * 200 + Math.sin(v * 8) * 25, cloud: { lit: '#e8b080', dark: '#08050c', light: [-0.95, -0.3] } }));
// the tear in the storm, something looking in
{ const t = tearS(1290, 92, 230, 96, { mat: '#2a2036', edge: '#9a80c0', edgeOp: 0.55, tears: 2, tearLen: 0.3, teeth: 2, slivers: 7, flecks: 16 }); raw(t.svg); const cl = S.id('rt'); raw(`<clipPath id="${cl}"><path d="${p2(t.outline)}"/></clipPath><g clip-path="url(#${cl})">` + X.voidEye(t.center[0] + 6, t.center[1] + 4, 46, { open: 0.38, look: [-0.7, 0.3], lips: 1, lip: '#2a2036' }) + '</g>'); }
raw(softCloud(1235, 128, 200, 46, { col: '#2a1e36', lit: '#c89a88', dark: '#0a0610', light: [-0.95, -0.3], fronts: 1, wisps: 3, wind: -1, rim: 4 }));
raw(rain(880, 1480, 40, 330, 520, { ang: 0.18, len: 20, op: 0.2, col: '#c8b8e0' }));
// ---- the mid island over the storm (moored to the stair by chains)
raw(island(1090, 150, 300, { k: 0.3, col: '#7e6e72', depth: 0.55, build: [{ type: 'ruin', u: -0.22, s: 0.36 }, { type: 'hall', u: 0.12, s: 0.36 }, { type: 'tower', u: 0.36, s: 0.2, h: 1.3, brokenSpire: true }], falls: [[-0.47, 0.03], [0.05, 0.022], [0.46, 0.035]], fallLen: 200, drops: 3, baseFade: 0.8 }));

// ---- THE STAIR: a viaduct stair seen from its side, climbing to the left toward the light. Near face plane Z = ZA,
// far face ZB. Flights drift apart in sequence: flight k is moved up-left along the stair by D(k) and turned by k*TURN.
const ZA = 40, ZB = 47, RISE = 0.34, TRD = 0.62, T0 = 2.6; // T0: structural depth under the steps
const FL = [[16, 14, 0], [6.6, 14, 1], [-2.8, 14, 2], [-12.2, 14, 3], [-21.6, 14, 4], [-31.0, 14, 5]]; // [X at foot, steps, k]
const DIR = (() => { const a = P(14, 0, ZA), b = P(-30, 44 * RISE / TRD * 0 + 25, ZA); const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; })();
const STEPY = X0 => (14 - X0) / TRD * RISE; // the stair's line: Y at the foot of a flight
const drift = k => k * (k + 1) / 2 * 5, TURN = -0.018;
function flight(X0, n, k) {
  const Y0 = STEPY(X0), Xe = X0 - n * TRD, Ye = Y0 + n * RISE, Pd = 5.5 + (k % 2) * 2.2, xs = X0 - 1.9;
  const slope = x => STEPY(x) + RISE * 0.5;                       // the stair's line under the nosings
  // the near face as one outline in (X, Y): the pier at the foot (broken off below), the sawtooth of the steps, the
  // broken head, and the rampant arch springing from the pier and rising to the head under the flight
  const pr = [];
  pr.push([X0 + 0.3, Y0 - T0 - Pd]); pr.push([X0 + 0.3, Y0]);
  for (let i = 0; i < n; i++) { const x = X0 - i * TRD, y = Y0 + (i + 1) * RISE; pr.push([x, y]); pr.push([x - TRD, y]); }
  pr.push([Xe - 0.2, Ye]); pr.push([Xe - 0.2, Ye - T0 - 1.0]);
  const NA = 16, arch = []; for (let i = NA; i >= 0; i--) { const u = i / NA, x = xs + (Xe - 0.2 - xs) * u, y = slope(x) - T0 - 3.2 * Math.pow(1 - u, 1.6) - (u > 0.92 ? (u - 0.92) * 12 : 0); arch.push([x, y]); }
  const archI0 = pr.length; pr.push(...arch);
  pr.push([xs, Y0 - T0 - Pd + 0.5]);
  const c0 = P((X0 + Xe) / 2, (Y0 + Ye) / 2, ZA), mv = drift(k), ang = TURN * k;
  const T = ([x, y]) => { const dx = x - c0[0], dy = y - c0[1]; return [c0[0] + dx * Math.cos(ang) - dy * Math.sin(ang) + DIR[0] * mv, c0[1] + dx * Math.sin(ang) + dy * Math.cos(ang) + DIR[1] * mv]; };
  const near = pr.map(([x, y]) => T(P(x, y, ZA))), far = pr.map(([x, y]) => T(P(x, y, ZB)));
  let s = '';
  // the intrados of the arch and the pier's underside, seen from below (dark, hatched)
  for (let i = archI0; i < archI0 + NA; i++) { const q = [near[i], near[i + 1], far[i + 1], far[i]]; s += fillP(q, mix('#1a1222', '#4a3a50', (i - archI0) / NA * 0.4)); }
  { const q = [near[0], near[pr.length - 1], far[pr.length - 1], far[0]]; s += fillP(q, '#0e0a12'); }
  s += `<path d="${p2([...near.slice(archI0, archI0 + NA + 1), ...far.slice(archI0, archI0 + NA + 1).reverse()])}" fill="${hatchA(ZA)}" opacity="0.45"/>`;
  // the risers (faces toward +X: in shadow) and the head's break face
  for (let i = 0; i < n; i++) { const a = 2 + i * 2, q = [near[a - 1], near[a], far[a], far[a - 1]]; s += fillP(q, mix(STONED, '#7a5a70', 0.2)) + `<path d="${p2(q)}" fill="${hatchB(ZA)}" opacity="0.45"/>` + inkP(q, 0.5, 0.7); }
  { const q = [near[0], near[1], far[1], far[0]]; s += fillP(q, '#2a2030') + `<path d="${p2(q)}" fill="${hatchB(ZA)}" opacity="0.5"/>` + inkP(q, 0.6); }
  // the near face: weathered pale stone lit by the heaven-light
  const face = near.slice();
  const warm = 0.12 + 0.05 * (5 - k);
  s += stone(face, ZA, mix(STONE, '#e8b880', warm), { chip: false, band: 2.5, w: { op: 0.9, stainGap: 4, pitArea: 50, cracks: 1.5 } });
  const fc = S.id('ff'); s += `<clipPath id="${fc}"><path d="${p2(face)}"/></clipPath><g clip-path="url(#${fc})">`;
  // coursed ashlar: courses parallel to the stair line on the spandrel, level courses on the pier
  for (let j = 1; j < 7; j++) { const yy = j * 0.55; const pts = []; for (let i = 0; i <= 10; i++) { const x = X0 + 0.3 - (X0 + 0.5 - Xe) * i / 10; pts.push(T(P(x, slope(x) - yy, ZA))); } s += line(pts, 0.6, INK, 0.45); for (let i = 0; i < 9; i++) { const x = X0 - R() * (X0 - Xe); s += pline([T(P(x, slope(x) - yy, ZA)), T(P(x, slope(x) - yy + 0.55, ZA))], 0.5, INK, 0.35); } }
  for (let j = 1; j < 12; j++) { const yy = Y0 - T0 - j * 0.6; s += pline([T(P(X0 + 0.3, yy, ZA)), T(P(xs, yy, ZA))], 0.6, INK, 0.45); const xm = xs + (X0 + 0.3 - xs) * (j % 2 ? 0.4 : 0.65); s += pline([T(P(xm, yy, ZA)), T(P(xm, yy + 0.6, ZA))], 0.5, INK, 0.35); }
  // the voussoirs along the arch: a band of radiating joints, the arch ring's extrados line
  for (let i = 1; i < NA; i++) { const a = arch[NA - i], up = [a[0], a[1] + 0.9]; s += pline([T(P(a[0], a[1], ZA)), T(P(up[0] + 0.05, up[1], ZA))], 0.6, INK, 0.55); }
  s += line(arch.map(([x, y]) => T(P(x, y + 0.9, ZA))), 0.7, INK, 0.55);
  s += '</g>';
  s += inkP(face, 1.1);
  // the pier's broken foot: a jagged break face (dark) along its bottom edge
  { const a = near[0], b = near[pr.length - 1], bj = jag(b, a, 6, 3.5); s += fillP([...bj, [a[0], a[1] + 4], [b[0], b[1] + 5]], '#120c16') + inkP(bj, 1); }
  // the gilt nosings (holy stair), worn to black in places
  for (let i = 0; i < n; i++) { const a = near[2 + i * 2], b = near[3 + i * 2]; s += pline([a, b], 1.5, mix(GOLD, MURK, 0.15), 0.95) + (R() < 0.35 ? pline([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]], 1.5, BLACK, 0.8) : ''); }
  // the balustrade on the near edge: balusters and a rail following the slope; a gilt line on the rail
  const rail = []; for (let i = 0; i <= n; i += 1) { const x = X0 - i * TRD, y = Y0 + i * RISE + RISE; rail.push(T(P(x, y + 1.1, ZA - 0.1))); }
  for (let i = 0; i < n * 2; i++) { const x = X0 - i * TRD / 2, y = Y0 + Math.floor(i / 2) * RISE + RISE; if (k > 2 && i > n * 1.3 && i < n * 1.7) continue; const b0 = T(P(x - 0.1, y, ZA - 0.1)), b1 = T(P(x - 0.1, y + 1.1, ZA - 0.1)); s += line([b0, b1], 2.0, INK) + line([b0, b1], 1.0, mix(STONE, '#e8c090', 0.25)); }
  s += line(rail, 3.6, INK) + line(rail, 2.2, mix(STONE, '#f0c890', 0.3)) + line(rail.map(([a, b]) => [a, b - 0.6]), 0.8, mix(GOLD, MURK, 0.1), 0.9);
  // a kneeling guardian of the host on the flight's head newel, gilt worn over stone
  { const b = T(P(Xe + 0.2, Ye, ZA - 0.2)), u = K(ZA) * 1.1; s += guardian(b, u, ZA, k); }
  // burns: the strike ran down the stair, flight to flight
  { const a = T(P(X0 - n * TRD * 0.3, slope(X0 - n * TRD * 0.3) - 0.5, ZA)); const fc2 = S.id('fb'); s += `<clipPath id="${fc2}"><path d="${p2(face)}"/></clipPath><g clip-path="url(#${fc2})">${burnV(a[0], a[1], 0.5 + R() * 0.5, 80, 1.9, { depth: 4 })}</g>`; }
  // the clean break where this flight parted from the one below: black, a fresh pale rim
  if (k > 0) { const e = [near[1], near[0]]; s += pline(e, 2.4, '#0a0810') + pline(e.map(([a, b]) => [a - 1.4, b]), 0.9, mix(STONE, '#fff', 0.35), 0.8); }
  return s;
}
function guardian(b, u, Z, k) {
  // kneeling, wings folded up, spear upright; facing down the stair (to the right); smooth forms
  const T = (x, y) => [b[0] + x * u, b[1] - y * u], g = c => mix(c, MURK, 0.2 + k * 0.06);
  const sh = (pts, f, op = 1) => `<path d="${smooth(pts.map(p => T(...p)), true, 0.5)}" fill="${f}" opacity="${op}"/><path d="${smooth(pts.map(p => T(...p)), true, 0.5)}" fill="none" stroke="${INK}" stroke-width="0.8"/>`;
  let s = '';
  s += sh([[-0.1, 1.3], [-0.35, 1.9], [-0.42, 2.9], [-0.3, 3.2], [-0.15, 2.4], [0.05, 1.6]], g(mix(STONE, STONED, 0.4)));
  s += sh([[-0.05, 1.35], [-0.2, 2.0], [-0.15, 2.8], [-0.02, 3.0], [0.05, 2.2], [0.18, 1.5]], g(mix(STONE, '#e8c090', 0.2)));
  s += sh([[-0.35, 0], [0.45, 0], [0.5, 0.35], [0.25, 0.55], [0.22, 1.45], [-0.1, 1.5], [-0.3, 0.8]], g(mix(STONE, '#e8c090', 0.25)));
  s += sh([[0.0, 1.5], [0.18, 1.48], [0.22, 1.7], [0.08, 1.78], [-0.04, 1.68]], g(STONE));
  s += line([T(0.42, 0), T(0.44, 3.3)], 1.6, INK) + line([T(0.42, 0), T(0.44, 3.3)], 0.8, g(GOLDD)) + fillP([T(0.39, 3.3), T(0.49, 3.3), T(0.44, 3.65)], g(GOLD));
  s += `<ellipse cx="${f1(T(0.06, 1.9)[0])}" cy="${f1(T(0.06, 1.9)[1])}" rx="${f1(u * 0.26)}" ry="${f1(u * 0.24)}" fill="none" stroke="${g(GOLD)}" stroke-width="1.2" stroke-dasharray="${f1(u * 0.9)} ${f1(u * 0.15)}"/>`;
  return s;
}
raw(halo(420, 64, 165, 128, 24, { rot: 0.12, gap: [-1.25, -0.35], drift: 7, along: 5, turn: 0.035, dim: 0.1, n: 48, Z: 30, murk: '#4a3a5a', burns: 3 }).svg);
for (const [X0, n, k] of FL.slice().reverse()) raw(flight(X0, n, k));
// the chains mooring the stair to the mid island (great links, catenary), and one snapped, hanging
raw(chainC(P(9, STEPY(9) - 2.4, ZA), [985, 168], 26, 2.6, { op: 0.95 }));
raw(chainC(P(12.5, STEPY(12.5) - 2.6, ZA), [1010, 176], 20, 2.6, { op: 0.95 }));
raw(chainC(P(-6, STEPY(-6) - 1.4, ZA), [P(-6, STEPY(-6) - 1.4, ZA)[0] + 30, P(-6, STEPY(-6), ZA)[1] + 90], 6, 2.2, { op: 0.85 }));
// ---- the building-sized broken halo hanging over the upper flights in the light (seen obliquely), its broken arc
// drifting outward in order
// ---- the light of heaven: broad warm shafts from the rent, fanning down-right across the stair and the landing
raw(shaftG([[170, -10], [290, -10], [700, 480], [520, 480]], LIGHT, 0.5, { soft: 7, core: 0.6, motes: 40 }));
raw(shaftG([[300, -10], [350, -10], [960, 480], [870, 480]], LIGHT, 0.32, { soft: 6, motes: 20 }));
raw(shaftG([[90, -10], [150, -10], [330, 480], [210, 480]], LIGHT, 0.26, { soft: 6 }));

// ---- THE LANDING: the fighters' platform, a broken landing of the stair floating over the drop. Its far edge broke;
// the pieces that left it drift down and away from the edge in order, aligned to it.
{
  const edgeZ = X0 => 15.5 + Math.sin(X0 * 0.35) * 1.2 + (X0 > 6 ? -2.0 : 0);
  // the cloud sea's murk under the landing edge
  const ed = []; for (let x = -28; x <= 28; x += 1) ed.push([x, edgeZ(x)]);
  const edgeS = ed.map(([x, z]) => P(x, 0, z)), floorPoly = [...edgeS, [W + 20, H + 10], [-20, H + 10]];
  // the edge's thickness: the slab's broken front face seen below the edge, dark
  const lip = [...edgeS, ...edgeS.slice().reverse().map(([x, y]) => [x, y + 6])];
  raw(fillP(lip, '#1a1220') + `<path d="${p2(lip)}" fill="${hatchA(16)}" opacity="0.5"/>`);
  // the pieces that broke from the edge, below it in sequence (each lower, smaller, a little turned)
  for (const [x0, x1] of [[-14, -9], [9, 13]]) { const a = P(x0, 0, edgeZ(x0)), b = P(x1, 0, edgeZ(x1)), pcs = [];
    for (let i = 0; i < 3; i++) { const u = 0.15 + i * 0.25, c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + 8], w = (b[0] - a[0]) * 0.2; pcs.push([[c[0] - w, c[1]], [c[0] + w, c[1] - 1], [c[0] + w * 0.8, c[1] + w * 0.35], [c[0] - w * 0.9, c[1] + w * 0.3]]); }
    raw(driftSeq(pcs, [0.1, 1], 10, 0.07, (q, i) => stone(chip(q, 0.5), 20, mix('#5a4e5e', '#2a2030', i * 0.2), { band: 1.5, w: { op: 0.5 } }))); }
  // the floor: weathered pale flags with gilt processional bands, wet, the gold light lying across it
  raw(fillP(floorPoly, '#3a3040'));
  const cf = S.id('fl'); raw(`<clipPath id="${cf}"><path d="${p2(floorPoly)}"/></clipPath><g clip-path="url(#${cf})">`);
  // last touch-up: the landing is a worn processional floor, not a plain grid. Weathered flags of uneven size, some
  // sunk, cracked or lost; inlaid gilt bands modelled as leaf over a black channel (burnished where the rent's light lies
  // on them, the leaf lost to black at joints and cracks, broken where the slab cracked); long cracks running through
  // flags and bands toward the broken edge; puddles holding the gold rent and the violet storm; rubble, a fallen
  // baluster, chips and drifts of gold leaf; contact shadows under everything.
  raw(B.flags(-26, 26, 3.6, 18, '#76686e', { depth: 1.1, width: 1.4, vary: 0.26, cracks: 0.75, fogK: 0.5, joint: 0.62, missing: 0.07 }));
  // weathering over the flags: soft stain blooms and a worn path where the procession walked (the floor's centre)
  for (let i = 0; i < 22; i++) { const z = 4 + R() * 13, c = P(-22 + R() * 44, 0, z), rx = K(z) * (0.8 + R() * 1.8), ry = rx * 0.11; raw(`<path d="${smooth(blob(c[0], c[1], rx, ry, 10, 0.5), true, 0.5)}" fill="${R() < 0.6 ? '#2a2030' : '#9a8a84'}" opacity="${f1(0.12 + R() * 0.12)}" filter="${blurF(Math.max(0.6, ry * 0.4))}"/>`); }
  raw(`<path d="${p2([P(-5.2, 0, 17), P(5.2, 0, 17), P(6.6, 0, 3.6), P(-6.6, 0, 3.6)])}" fill="${grad([[0, '#b0a098', 0], [0.5, '#b0a098', 0.12], [1, '#b0a098', 0.05]], 0, P(0, 0, 17)[1], 0, H)}"/>`);
  // the inlaid gilt bands: segments of leaf in a black channel, burnished in the light, broken at the cracks
  const LZ = z => P(-6, 0, z), litAt = (x, z) => Math.max(0, 1 - Math.hypot((x + 6) / 9, (z - 8) / 6));   // the rent's light pool on the floor
  const band = (A, Bq, hw, Z, along) => { // A, Bq world [X, Z]; along: 'z' runs into depth, 'x' runs across
    let out = ''; const n = Math.max(2, Math.round(Math.hypot(Bq[0] - A[0], Bq[1] - A[1]) / 1.6)); let t = 0;
    const ch = along === 'z' ? [P(A[0] - hw * 1.4, 0, A[1]), P(A[0] + hw * 1.4, 0, A[1]), P(Bq[0] + hw * 1.4, 0, Bq[1]), P(Bq[0] - hw * 1.4, 0, Bq[1])] : [P(A[0], 0, A[1] - hw * 1.4), P(Bq[0], 0, Bq[1] - hw * 1.4), P(Bq[0], 0, Bq[1] + hw * 1.4), P(A[0], 0, A[1] + hw * 1.4)];
    out += fillP(ch, '#120c16', 0.9);
    for (let i = 0; i < n; i++) { const t0 = t, t1 = Math.min(1, t + (1 / n) * (0.75 + R() * 0.4)); t = t1 + 0.012 + R() * 0.02; if (R() < 0.12) continue;
      const pa = [A[0] + (Bq[0] - A[0]) * t0, A[1] + (Bq[1] - A[1]) * t0], pb = [A[0] + (Bq[0] - A[0]) * t1, A[1] + (Bq[1] - A[1]) * t1], zz = (pa[1] + pb[1]) / 2;
      const q = along === 'z' ? [P(pa[0] - hw, 0.004, pa[1]), P(pa[0] + hw, 0.004, pa[1]), P(pb[0] + hw, 0.004, pb[1]), P(pb[0] - hw, 0.004, pb[1])] : [P(pa[0], 0.004, pa[1] + hw), P(pb[0], 0.004, pb[1] + hw), P(pb[0], 0.004, pb[1] - hw), P(pa[0], 0.004, pa[1] - hw)];
      const L2 = litAt((pa[0] + pb[0]) / 2, zz); out += G.gilt(q, zz, { dim: 0.32 - L2 * 0.25, cracks: 1, lost: 1 + Math.floor(R() * 2) });
      if (L2 > 0.25) out += pline([q[0], q[1]].map(([x2, y2]) => [x2, y2 + 0.3]), Math.max(0.6, K(zz) * 0.03), '#fff2c8', Math.min(0.85, L2));
      if (t > 1) break; }
    return out; };
  for (const x of [-7.5, -2.5, 2.5, 7.5]) raw(band([x, 3.6], [x * 0.95, 17], 0.12, 10, 'z'));
  for (const z of [6.5, 10, 13.5]) raw(band([-26, z], [26, z], 0.1, z, 'x'));
  // long cracks running through flags and bands toward the broken edge, branching; a lit lip on their near side
  for (let i = 0; i < 9; i++) { let x = -20 + R() * 40, z = 4 + R() * 5; const pts = []; for (let j = 0; j < 9; j++) { pts.push(P(x, 0.005, z)); x += (R() - 0.5) * 1.6; z += 0.6 + R() * 1.1; if (z > 16) break; }
    raw(pline(pts, Math.max(0.6, K(8) * 0.02), '#0c0810', 0.85) + pline(pts.map(([a2, b2]) => [a2, b2 + 1]), 0.6, '#b0a098', 0.35));
    if (pts.length > 4) { const j = 2 + Math.floor(R() * (pts.length - 3)), br = [pts[j]]; let [bx, by] = pts[j]; for (let k = 0; k < 4; k++) { bx += (R() - 0.5) * 22; by -= 1 + R() * 3; br.push([bx, by]); } raw(pline(br, 0.7, '#0c0810', 0.7)); } }
  // the light lying on the floor (warm, soft) and the wet: puddles holding the gold rent (left) and the storm (right)
  raw(`<path d="${p2([P(-12, 0, 18), P(2, 0, 18), P(2, 0, 3.6), P(-16, 0, 3.6)])}" fill="${rgrad(...P(-6, 0, 7), 700, 160, [[0, LIGHT, 0.28], [1, LIGHT, 0]])}"/>`);
  for (const [x, z, w, d] of [[-9, 8, 3.2, 1.0], [-2, 11.5, 2.2, 0.7], [4.5, 7.2, 2.6, 0.8], [11, 9.5, 3.4, 0.9], [-15, 12, 2.4, 0.7], [16.5, 6.2, 2.8, 0.8], [-19, 5.6, 2.2, 0.7]]) { const c = P(x, 0, z), rx = K(z) * w / 2, ry = K(z) * d * 0.09, pb = blob(c[0], c[1], rx, ry, 14, 0.35), warm = x < 6;
    raw(`<path d="${smooth(pb.map(([a2, b2]) => [a2, b2 + 1]), true, 0.5)}" fill="#0c0810" opacity="0.55"/>`);
    raw(`<path d="${smooth(pb, true, 0.5)}" fill="${grad(warm ? [[0, '#ffe0a0', 0.85], [0.45, '#c89068', 0.8], [1, '#3a2e4a', 0.9]] : [[0, '#8a74a8', 0.8], [0.5, '#4a3a60', 0.85], [1, '#1e1628', 0.9]], 0, c[1] - ry, 0, c[1] + ry)}"/>`);
    raw(`<path d="${smooth(pb, true, 0.5)}" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.7"/><path d="${smooth(pb.slice(7, 14), false, 0.5)}" fill="none" stroke="${warm ? '#ffe8b0' : '#c8b8e0'}" stroke-width="0.6" opacity="0.6"/>`);
    // the reflection of the stair's piers or the storm streaked down in the water; rain rings on the storm side
    for (let j = 0; j < 3; j++) { const xx = c[0] + (R() - 0.5) * rx * 1.2; raw(line([[xx, c[1] - ry * 0.5], [xx + (R() - 0.5) * 2, c[1] + ry * 0.6]], Math.max(0.6, rx * 0.04), warm ? '#5a4658' : '#e0d4f0', 0.35)); }
    if (!warm) for (let j = 0; j < 3; j++) { const rc = [c[0] + (R() - 0.5) * rx, c[1] + (R() - 0.5) * ry * 0.6], rr = 1.5 + R() * 3; raw(`<ellipse cx="${f1(rc[0])}" cy="${f1(rc[1])}" rx="${f1(rr)}" ry="${f1(rr * 0.2)}" fill="none" stroke="#e0d4f0" stroke-width="0.5" opacity="0.5"/>`); } }
  // the strike point: a fused scar on the landing, violet burns branching from it
  { const c = P(1.5, 0, 12.5); raw(fused(c[0], c[1], 7, '#4a3a40', 12) ); for (let i = 0; i < 5; i++) raw(burnV(c[0], c[1], i / 5 * 6.28 + 0.3, 40 + R() * 50, 1.6, { depth: 4, haloOp: 0.25 })); }
  // debris: chips and broken coping stones with contact shadows, gathered along the joints and toward the broken edge
  for (let i = 0; i < 34; i++) { const z = 5 + Math.pow(R(), 0.7) * 11, x = -24 + R() * 48, c = P(x, 0, z), r = K(z) * (0.06 + R() * 0.16) * (R() < 0.15 ? 2.2 : 1), q = chip([[c[0] - r, c[1]], [c[0] - r * 0.6, c[1] - r * 0.7], [c[0] + r * 0.5, c[1] - r * 0.8], [c[0] + r, c[1] - r * 0.1], [c[0] + r * 0.3, c[1] + r * 0.15]], 0.3);
    raw(`<ellipse cx="${f1(c[0] + r * 0.3)}" cy="${f1(c[1] + r * 0.1)}" rx="${f1(r * 1.3)}" ry="${f1(r * 0.25)}" fill="#0c0810" opacity="0.45"/>` + fillP(q, '#8a7c80') + fillP([q[2], q[3], q[4], [c[0], c[1]]], '#3a3040', 0.6) + inkP(q, 0.6, 0.8)); }
  // a fallen baluster from the stair's rail, lying across a joint, and a broken coping block, both with contact shadows
  { const a = P(-15.5, 0.12, 9.2), b = P(-13.4, 0.12, 10.1), k = K(9.6); raw(`<path d="M${f1(a[0])} ${f1(a[1] + k * 0.1)} L${f1(b[0])} ${f1(b[1] + k * 0.1)}" stroke="#0c0810" stroke-width="${f1(k * 0.18)}" opacity="0.4" stroke-linecap="round"/>` + line([a, b], k * 0.2, INK) + line([a, b], k * 0.15, '#8a7c80') + line([[a[0], a[1] - k * 0.04], [b[0], b[1] - k * 0.04]], k * 0.04, '#c8b8a8', 0.7)); for (const u of [0.25, 0.5, 0.75]) { const m = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; raw(`<ellipse cx="${f1(m[0])}" cy="${f1(m[1])}" rx="${f1(k * 0.04)}" ry="${f1(k * 0.11)}" fill="#5a4c58" stroke="${INK}" stroke-width="0.6"/>`); } }
  { const c = P(13.6, 0, 14.2), k = K(14.2), q = [[c[0] - k * 0.6, c[1]], [c[0] - k * 0.55, c[1] - k * 0.32], [c[0] + k * 0.35, c[1] - k * 0.36], [c[0] + k * 0.62, c[1] - k * 0.1], [c[0] + k * 0.5, c[1]]]; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 0.8)}" ry="${f1(k * 0.08)}" fill="#0c0810" opacity="0.5"/>` + stone(q, 14, '#6a5c66', { band: 1.5, w: { op: 0.6 } }) + pline([q[1], q[2]], 1.2, mix(GOLD, '#3a3040', 0.3), 0.8)); }
  // fallen leaf (small angular flakes) gathered in the joints downwind, thicker in drifts against the debris
  { let m = ''; for (let i = 0; i < 110; i++) { const z = 5 + R() * 11, c = P(-20 + R() * 40, 0, z), r = 0.6 + R() * 1.3; m += `M${f1(c[0] - r)} ${f1(c[1])} l${f1(r * 1.3)} ${f1(-r * 0.5)} l${f1(r * 0.7)} ${f1(r * 0.6)} Z `; } raw(`<path d="${m}" fill="${GOLD}" opacity="0.6"/>`); }
  raw('</g>');
  raw(inkP(edgeS.concat([]), 1.2).replace(' Z"', '"'));
  raw(pline(edgeS.map(([x, y]) => [x, y - 0.9]), 1.6, mix(STONE, '#ffe0a0', 0.55), 0.85) + pline(edgeS.map(([x, y]) => [x, y + 2.5]), 3, '#120c18', 0.7));
  // familiar scale at the landing's back: a stone bench and an iron votive-lamp stand with its lamp still lit
  { const a = P(-12.2, 0, 13.2), b = P(-10.2, 0.45, 13.2); raw(stone([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], 13, '#6a5c66', { band: 1.5, w: { op: 0.6 } }) + stone([[a[0] - 2, b[1] - 3], [b[0] + 2, b[1] - 3], [b[0] + 2, b[1]], [a[0] - 2, b[1]]], 13, '#7a6c74', { band: 1 })); }
  { const a = P(9.2, 0, 12.4), b = P(9.2, 1.7, 12.4); raw(line([a, b], 2.2, INK) + line([a, b], 1, '#3a3438') + line([[a[0] - 5, a[1]], [a[0], a[1] - 4], [a[0] + 5, a[1]]], 1.4, INK)); raw(glowE(b[0], b[1] + 2, 26, 22, '#ffc870', 0.35) + `<path d="M${f1(b[0] - 3)} ${f1(b[1])} L${f1(b[0] + 3)} ${f1(b[1])} L${f1(b[0] + 2)} ${f1(b[1] + 6)} L${f1(b[0] - 2)} ${f1(b[1] + 6)} Z" fill="#ffd890" stroke="${INK}" stroke-width="0.7"/>`); }
}
// ---- the quiet zone: murk veils over the fighters' band (far steps toward murk)
raw(quiet([[262, 0.12], [300, 0.14], [338, 0.12], [380, 0.12]], { hop: 0.12, col: '#1e1628' }));

// ======================================================================== MID
layer('mid');
{ // low, dark, low-contrast things on the landing: a fallen spear of the host and its cracked halo ring, rubble at the
  // edge, a guardian's broken wing lying flat
  const a = P(-4.5, 0.05, 8.2), b = P(0.2, 0.05, 9.0); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, mix(GOLDD, '#2a2030', 0.45)));
  const c = P(-1.8, 0.02, 9.6); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(K(9.6) * 0.35)}" ry="${f1(K(9.6) * 0.06)}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-dasharray="40 6 30 9" opacity="0.8"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(K(9.6) * 0.35)}" ry="${f1(K(9.6) * 0.06)}" fill="none" stroke="${mix(GOLD, '#2a2030', 0.45)}" stroke-width="1.2" stroke-dasharray="40 6 30 9"/>`);
  for (const [x, z, r] of [[13.5, 10.5, 0.45], [14.6, 11.2, 0.3], [-19, 11, 0.5], [-17.8, 10.4, 0.3], [6, 15.2, 0.35]]) { const p = P(x, r * 0.5, z), rr = K(z) * r; raw(stone(blob(p[0], p[1], rr, rr * 0.6, 8, 0.4), z, '#3a3040', { band: 1.5, w: { op: 0.4 } })); }
}

// ======================================================================== FORE
layer('fore');
{ // left: the landing's great newel, cropped by the frame, and on it a kneeling guardian of the host, backlit by the
  // rent behind it: dark weathered stone, a warm rim of light along its edges, wings raised to the top of the frame
  const q = [[-10, 196], [44, 192], [50, H + 10], [-10, H + 10]];
  raw(stone(q, 3.5, '#3a3040', { band: 5, chip: 0.2, w: { op: 1, stainGap: 4, pitArea: 30, cracks: 2 } }) + `<path d="${p2([[22, 192], [50, 192], [50, H + 10], [22, H + 10]])}" fill="${hatchA(3.5)}" opacity="0.5"/>`);
  raw(stone([[-12, 178], [58, 174], [60, 198], [-12, 200]], 3.5, '#4a3e4c', { band: 4, w: { op: 0.8 } }) + pline([[-12, 177], [58, 173]], 2, mix(GOLD, '#3a3040', 0.3), 0.9));
  const cl = S.id('nw'); raw(`<clipPath id="${cl}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${cl})">${burnV(18, 230, 1.4, 240, 2.6, { depth: 5 })}</g>`);
  raw(X.colossus(-14, 178, 250, 1, { k: 0, col: '#5a4c5a', ink: 2.2, burn: true }));
  // the warm rim of the rent's light along the statue's upper edges (a thin glow)
  raw(`<path d="M-10 60 Q10 20 14 -10" stroke="${LIGHT}" stroke-width="2" fill="none" opacity="0.35" filter="${blurF(1.5)}"/>`);
}
G.write(OUT, 'sky_ruins');
