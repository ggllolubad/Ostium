// World VI, the Stormwrack Coast: THE WHALE'S ROADS, boss room of the Thunder Whale (round 2, group g2). Room key 'coast_boss'.
// Contract as the nave: 1480 x 480 (shown at 2x); coast_boss_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounter: The Thunder Whale (shock_eel, thunder_whale). "The storm on the coast is its song." An old bull whale the
// wreckers harpooned and failed to kill; its hide hung with their rusted harpoons, which draw the storm.
// The place: the wreckers' whaling slip at the foot of the point, where they hauled up what the sea gave them and where they
// tried to take the bull. A timber slipway runs from the company's rock shelf down into the surf; the try-works stand at
// the left, two iron try-pots on their brick furnace, cold; the harpoon rack is half empty (the rest are in the whale);
// the flensing gantry leans over the slip with its chain, and the jawbone of a lesser whale stands as an arch beside it.
// Out on the right, two sea stacks make a gate to the open sea. Between them the storm breaks: a white glare behind the
// gate, rain in sheets, the surf thrown white. The bull breaches in the gate.
// Composition: the right 45% is the boss's stage; the stacks frame the giant, the glare sits behind his head, the slipway
// and the gantry lead the eye from the company out to him.
// Courses: LIGHTNING (burns ferned on the stacks and down the gantry post, the harpoon rack's irons fused, a fulgurite on the
// shelf; no bolt is drawn: rain, wet light, scorch); WATER (surf, spray, barnacles, kelp, everything streaming).
// Light: the most dramatic in the world: the white glare behind the gate, black stacks, white surf.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VI');
const W = 1480, H = 480, ROOM = 'coast_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2836, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#10161a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#0a0e10', AIR = '#5a666c';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 10, airD: 80, airMax: 0.6 });
const { line, polyS, timber } = G;
const { ell } = require('../engine');
const SLATE = '#3a4248', SURF = '#eef2f0', LAMPY = '#e8c860', WET = '#c8d4d8', KELP = '#2e3624', WOOD = '#2e2a26', GL = [960, 130], GLARE = '#f4f8f6';

// ======================================================================== FAR
layer('far');
// ---- the sky: black storm cloud heavy at the top, breaking open behind the gate in a white glare (stepped, no gradient)
raw(`<rect width="${W}" height="${H}" fill="#1a2024"/>`);
raw(G.skyGrad(0, 320, [[0, '#14191c'], [0.5, '#262e32'], [1, '#3a464c']]));
// the break in the storm behind the gate: a tall soft rent of white light, not a disc; shafts falling from it to the sea;
// torn cloud edges crossing it
raw(G.radial(GL[0], GL[1] + 60, 300, 420, [[0, '#ffffff', 0.95], [0.25, '#e4ecea', 0.85], [0.55, '#94a2a6', 0.5], [1, '#3a464c', 0]], { rot: -8 }) + G.radial(GL[0] - 20, GL[1] + 20, 90, 220, [[0, '#ffffff', 0.9], [1, '#f4f8f6', 0]], { rot: -8 }));
for (const [dx, w, op] of [[-120, 60, 0.12], [-30, 90, 0.16], [70, 50, 0.1], [150, 70, 0.08]]) raw(`<path d="M${f1(GL[0] + dx - w * 0.3)} ${f1(GL[1] + 60)} L${f1(GL[0] + dx + w * 0.3)} ${f1(GL[1] + 60)} L${f1(GL[0] + dx * 1.6 + w)} 305 L${f1(GL[0] + dx * 1.6 - w)} 305 Z" fill="#f4f8f6" opacity="${op}" filter="url(#${G.blurId(8)})"/>`);
for (const [x, y, w, h, op] of [[GL[0] - 260, GL[1] - 40, 380, 70, 0.9], [GL[0] + 220, GL[1] + 10, 340, 80, 0.85], [GL[0] - 40, GL[1] - 120, 300, 50, 0.7], [GL[0] + 60, GL[1] + 170, 260, 36, 0.55]]) raw(G.softMass(x, y, w, h, '#1e262a', { lit: '#e4ecea', dark: '#0a0e10', op, litOp: 0.55 }));// heavy cloud: torn masses over the top, lit along their lower lips by the glare
// heavy cloud: torn sheets over the top and down the sides (ragged veils, never lobes), their lower lips lit by the glare
for (const [y0, y1, op, ph] of [[-20, 60, 0.85, 1], [-20, 110, 0.5, 3], [-20, 150, 0.3, 5]]) { const bot = []; for (let x = -20; x <= W + 20; x += 24 + R() * 30) { const d = Math.abs(x - GL[0]) / 700; bot.push([x, y0 + (y1 - y0) * (0.3 + d * 1.4) + (R() - 0.5) * 18]); } raw(`<path d="${smooth([[-20, -20], [W + 20, -20], ...bot.slice().reverse()], true, 0.5)}" fill="#0e1214" opacity="${op}"/>` + line(bot, 1.2, '#c8d4d4', 0.35 * op)); }
raw(BK.rain(900, { x0: 0, x1: W, y0: 0, y1: 305, slant: 0.32, len: 20, col: GLARE, op: 0.32, dens: (x, y) => 0.35 + 0.65 * Math.max(0, 1 - Math.hypot(x - GL[0], (y - GL[1]) * 1.6) / 600) }));
// ---- plane 3: the open sea to the horizon, the glare laid on it in a broken path, a far stack in the haze
{
  raw(G.sea(-300, 300, 50, 900, '#3a464c', { y: -0.4, lit: '#c8d4d4', foam: 0.1, amp: 0.16, step: 0.06 }));
  for (let y = 301; y < 340; y += 1.5 + R() * 2) { const u = (y - 300) / 40, w = 30 + u * 260; raw(`<path d="M${f1(GL[0] - w * 0.4 + (R() - 0.5) * w * 0.6)} ${f1(y)} l${f1(w * (0.1 + R() * 0.3))} 0" stroke="${GLARE}" stroke-width="${f1(0.8 + u)}" opacity="${f1(0.4 + R() * 0.3)}"/>`); }
  raw(G.smoothRock([[960, 302], [972, 270], [990, 262], [1004, 276], [1012, 302]], 90, '#4a565c', { dir: 'h', rib: 4, rim: false, airOp: 0.4, airCol: '#8a989c' }));
}
// ---- plane 2: the two sea stacks of the gate, black against the glare, their glare-side edges wet-lit, burns on them,
// surf breaking round their feet; the wreckers' lamp on the left one
{
  const stack = (pts, Z, col) => raw(G.smoothRock(pts, Z, col, { dir: 'h', rib: 9, wave: 4, flank: 0.55, rimCol: GLARE, rimOp: 0.3, rimW: 1.2, k: 0.2 }));
  const L = [[700, 312], [712, 250], [704, 196], [726, 150], [736, 112], [752, 98], [768, 102], [782, 88], [798, 104], [806, 126], [820, 170], [816, 226], [834, 272], [846, 312]];
  stack(L, 34, '#1e2428');
  // the glare's edge on the gate-facing flank
  raw(line(L.slice(6, 11).map(([x, y]) => [x - 2, y]), 2, GLARE, 0.6));
  raw(BK.scorch((s2, t) => [s2, t, 33.9], 2.8, 6, 3.6, -Math.PI / 2 - 0.2, { w: 0.08, depth: 4, col: '#06080a', halo: '#a8b4b8', haloOp: 0.25 }));
  { const t = [768, 100]; raw(line([t, [t[0] + 2, t[1] - 34]], 2.4, INK, 1) + line([[t[0] + 2, t[1] - 34], [t[0] + 12, t[1] - 36]], 1.6, INK, 1) + G.lantern(t[0] + 12, t[1] - 26, 7, { r: 7, gop: 0.4 })); }
  const Rr = [[1360, 314], [1372, 240], [1360, 170], [1380, 110], [1374, 50], [1400, -10], [W + 20, -10], [W + 20, 314]];
  stack(Rr, 30, '#1a2024');
  raw(line(Rr.slice(1, 5).map(([x, y]) => [x - 2, y]), 2, GLARE, 0.55));
  // surf breaking white round the stacks' feet
  for (const [x0, x1] of [[680, 870], [1330, W + 20]]) { const base = []; for (let x = x0; x <= x1; x += 10) base.push([x, 306 + Math.sin(x * 0.05) * 2]); raw(line(base, 3, SURF, 0.85)); for (let i = 0; i < 26; i++) { const [x, y] = base[Math.floor(R() * base.length)], l = 8 + R() * 26; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(l * 0.3)} ${f1(-l * 0.9)} ${f1(l)} ${f1(-l * 1.1)}" stroke="${SURF}" stroke-width="${f1(1 + R())}" fill="none" opacity="${f1(0.35 + R() * 0.35)}" stroke-linecap="round"/>`); } }
}
raw(G.veil(250, 320, 0.15, AIR, { amp: 6 }));
// ---- the land at the left: the foot of the point, slate, barnacled, the try-works and the gantry on the shelf below it
{
  raw(G.smoothRock([[-20, 330], [-20, -20], [180, -20], [230, 40], [210, 110], [260, 170], [300, 250], [340, 300], [380, 330]], 16, '#262e32', { dir: 'h', rib: 8, wave: 6, flank: 0.3, rimCol: '#a8b4b8', rimOp: 0.45 }));
  raw(BK.scorch((s2, t) => [s2, t, 16], -9.6, 5, 3, -1.2, { w: 0.06, depth: 4, col: '#06080a', halo: '#a8b4b8', haloOp: 0.22 }));
  // the try-works: a brick furnace with two great iron pots, cold, rain standing in them, the chimney leaning
  const Zt = 12.6, k = K(Zt); const b0 = P(-9.6, 0, Zt), b1 = P(-6.4, 1.1, Zt);
  raw(cel([[b0[0], b0[1]], [b1[0], b0[1]], [b1[0], b1[1]], [b0[0], b1[1]]], { Z: Zt, fill: '#3a2a24', tex: 'url(#mottle)', texOp: 0.5, band: 3 }));
  for (let Y = 0.18; Y < 1.1; Y += 0.18) raw(line([P(-9.6, Y, Zt), P(-6.4, Y, Zt)], 0.7, INK, 0.6));
  for (let i = 0; i < 2; i++) { const c = P(-8.8 + i * 1.6, 1.1, Zt); raw(`<path d="M${f1(c[0] - k * 0.6)} ${f1(c[1])} Q${f1(c[0] - k * 0.6)} ${f1(c[1] + k * 0.1)} ${f1(c[0])} ${f1(c[1] + k * 0.1)} Q${f1(c[0] + k * 0.6)} ${f1(c[1] + k * 0.1)} ${f1(c[0] + k * 0.6)} ${f1(c[1])} Z" fill="#1a1a1c" stroke="${INK}" stroke-width="1.2"/>` + cel(ell(c, k * 0.62, k * 0.1, 0, 14), { Z: Zt, fill: '#24282a', band: 1.5 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 0.5)}" ry="${f1(k * 0.07)}" fill="#4a5a60"/>` + line([[c[0] - k * 0.4, c[1] - 1], [c[0] - k * 0.1, c[1] - 1.5]], 0.8, GLARE, 0.5)); }
  raw(G.timber([-6.7, 1.0, Zt + 0.4], [-6.5, 4.2, Zt + 0.4], 0.3, { col: '#3a2a24' }));
  // the jawbone arch of a lesser whale, standing beside the slip; and the flensing gantry leaning over the slip with its
  // chain and hook, a burn down its post
  { const Zj = 11.4, k = K(Zj); for (const sg of [-1, 1]) { const pts = []; for (let u = 0; u <= 1.001; u += 0.1) { const X = -4.2 + sg * (1.0 * (1 - u) + 0.12) + sg * Math.sin(u * Math.PI) * 0.35, Y = u * 4.2; pts.push([X, Y]); }
      const L = pts.map(([X, Y], i) => P(X - 0.12 * (1 - i / 10) - 0.04, Y, Zj)), Rr = pts.map(([X, Y], i) => P(X + 0.12 * (1 - i / 10) + 0.04, Y, Zj)).reverse();
      raw(cel([...L, ...Rr], { Z: Zj, fill: sg < 0 ? '#8a8476' : '#7a7468', tex: 'url(#mottle)', texOp: 0.5, band: k * 0.1 }) + line(L.slice(2, 9).map(([x, y]) => [x + 1.5, y]), 0.9, GLARE, 0.4)); }
    const t = P(-4.2, 4.1, Zj); raw(line([[t[0] - 10, t[1] + 4], [t[0] + 10, t[1] + 2]], 3, '#5a4a30', 1) + line([[t[0] - 10, t[1] + 8], [t[0] + 10, t[1] + 6]], 2.4, '#5a4a30', 1)); }
  { const Zg = 13.8, p0 = P(-2.2, 0, Zg), p1 = P(-0.6, 5.8, Zg - 0.4), arm = P(2.6, 5.4, Zg); raw(G.timber([-2.2, 0, Zg], [-0.6, 5.8, Zg - 0.4], 0.32, { col: WOOD, wet: WET }) + G.timber([-2.4, 0, Zg + 1.2], [-0.6, 5.6, Zg - 0.3], 0.26, { col: WOOD }) + G.timber([-0.9, 5.7, Zg - 0.4], [2.6, 5.4, Zg], 0.26, { col: WOOD, wet: WET }));
    raw(BK.chain(arm, P(2.5, 2.2, Zg), 0, 2.4, '#3a3e40', { rigid: true }) + `<path d="M${f1(P(2.5, 2.2, Zg)[0] - 6)} ${f1(P(2.5, 2.2, Zg)[1])} q6 12 12 0" stroke="${INK}" stroke-width="3" fill="none"/>`);
    raw(BK.scorch((s2, t) => [-1.9 + s2 * 0.25, t, Zg - 0.15], 0.1, 4.4, 3.4, -Math.PI / 2, { w: 0.03, depth: 3, col: '#06080a', halo: '#a8b4b8', haloOp: 0.25 })); }
  // the harpoon rack: posts and a rail, three harpoons left in it, the empty slots; the irons fused to the rail
  { const Zr = 10.8; raw(G.timber([-11.6, 0, Zr], [-11.6, 2.0, Zr], 0.16, { col: WOOD }) + G.timber([-9.8, 0, Zr], [-9.8, 2.0, Zr], 0.16, { col: WOOD }) + G.timber([-11.8, 1.8, Zr], [-9.6, 1.8, Zr], 0.12, { col: WOOD }));
    for (const X of [-11.3, -11.0, -10.1]) { const a = P(X, 0.1, Zr + 0.2), b = P(X + 0.25, 2.6, Zr - 0.1); raw(line([a, b], 1.6, '#4a3a2a', 1) + `<path d="M${f1(b[0] - 3)} ${f1(b[1] + 4)} L${f1(b[0])} ${f1(b[1] - 6)} L${f1(b[0] + 3)} ${f1(b[1] + 4)}" fill="#1a1a1c" stroke="${INK}" stroke-width="0.6"/>`); } }
}
// ---- the near sea between the slip and the gate: heaving swells, foam streaks, the surf running in white
raw(G.sea(-60, 60, 8, 50, '#2e3a40', { y: -0.25, lit: '#c8d4d4', foam: 0.22, amp: 0.14, step: 0.06 }));
for (let i = 0; i < 6; i++) { const Z = 9 + i * 4 + R() * 2, pts = []; for (let X = -2 + i; X <= 30; X += 0.6) pts.push(P(X, -0.2, Z + Math.sin(X * 0.4 + i) * 0.6)); raw(line(pts, Math.max(1.2, K(Z) * 0.05), SURF, 0.55 - i * 0.06)); }
raw(G.frameDark(GL[0], GL[1] + 40, 900, 360, [[1.0, 0.22], [0.82, 0.16]]));
raw(BK.quiet('#141c20', 240, 352, { steps: [0.1, 0.12, 0.16, 0.2], hop: 0.12 }));
// ---- the slipway and the shelf: a ramp of planks on runners down into the surf, iron-strapped, slimed; the company's rock
// shelf at the top of it, wet, barnacled, a fulgurite; to the right the shelf drops into the surf
{
  const at = (s, t) => [-30 + s, 0, 3.6 + t];
  // the shelf: slate rock with the wet sheen, rising to the land at the left, dropping into the sea at the right
  const edge = []; for (let Z = 3.6; Z <= 12; Z += 0.5) edge.push(P(1.2 - (Z - 3.6) * 0.55 + Math.sin(Z * 2) * 0.2, 0, Z));
  const shelf = [P(-30, 0, 3.6), ...edge.slice().reverse().reverse(), P(-30, 0, 12)];
  raw(`<path d="${p2([P(-30, 0, 3.6), P(1.2, 0, 3.6), ...edge, P(-30, 0, 12)])}" fill="#2e3438"/>`);
  const cid = S.id('sh'); raw(`<clipPath id="${cid}"><path d="${p2([P(-30, 0, 3.6), P(1.2, 0, 3.6), ...edge, P(-30, 0, 12)])}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(G.stoneCells(at, 34, 8.4, '#353c40', { cw: 2.0, rh: 0.8, joint: 0.02, mortar: 0.4, inkOp: 0.3, proud: 0.2, band: 0.02, tint: (q) => q[0] > -6 ? ['#8a989c', 0.15] : null }));
  for (let i = 0; i < 20; i++) { const X = -14 + R() * 14, Z = 4 + R() * 7; raw(G.puddle(at, X + 30, Z - 3.6, 0.6 + R() * 1.4, 0.3 + R() * 0.4, { col: '#1a2226', refl: [GLARE], ringCol: GLARE })); }
  raw('</g>');
  raw(line(edge, 2.4, INK, 1) + line(edge.map(([x, y]) => [x + 1.5, y]), 1.2, SURF, 0.6));
  for (let i = 0; i < 30; i++) { const [x, y] = edge[Math.floor(R() * edge.length)], l = 6 + R() * 18; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(l * 0.4)} ${f1(-l * 0.6)} ${f1(l)} ${f1(-l * 0.4)}" stroke="${SURF}" stroke-width="1.2" fill="none" opacity="${f1(0.3 + R() * 0.3)}"/>`); }
  // the slipway: planks on two runners from the shelf down into the water, iron straps, weed at the waterline
  const sl = (u, s2) => { const X = -6.0 + u * 7.6 + s2 * 0.8, Z = 5.4 + u * 9.2 - s2 * 0.2, Y = 0.15 - u * 0.55; return [X, Y, Z]; };
  for (const s2 of [-1, 1]) { const pts = []; for (let u = 0; u <= 1.001; u += 0.05) pts.push(P(...sl(u, s2))); raw(line(pts, 4, INK, 1) + line(pts, 2.4, WOOD, 1)); }
  for (let u = 0; u <= 1; u += 0.035) { const a = P(...sl(u, -1.1)), b = P(...sl(u, 1.1)), Zm = sl(u, 0)[2]; raw(cel([a, b, P(...sl(u + 0.028, 1.1)), P(...sl(u + 0.028, -1.1))], { Z: Zm, fill: tone(u > 0.7 ? '#24302a' : '#3a342c', 0.12), band: 1, inkW: 0.6, hi: false })); if (u > 0.68 && R() < 0.5) raw(line([b, [b[0] + 2, b[1] + 6 + R() * 8]], 1.4, KELP, 0.9)); }
  raw(BK.scorch((s2, t) => [s2, 0.01, t], -8.6, 6.2, 1.2, 0.4, { w: 0.05, depth: 3, col: '#1a1a18', halo: '#a8b0a8', haloOp: 0.25 }));
  raw(S.occBand((s2, t) => [-30 + s2, 0, 3.6 + t], 34, 0.8, { op: 0.22 }));
}

// ======================================================================== MID: wreckers' gear on the shelf, low
layer('mid');
{
  const Z = 8.8, k = K(Z);
  { const c = P(-8.4, 0, Z); for (let j = 0; j < 4; j++) raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - j * 2.2)}" rx="${f1(k * (0.4 - j * 0.05))}" ry="${f1(k * 0.08)}" fill="none" stroke="#5a4a30" stroke-width="2.4"/>`); }
  { const a = P(-5.6, 0.04, Z - 0.3), b = P(-4.0, 0.06, Z - 0.8); raw(line([a, b], 2.4, INK, 1) + line([a, b], 1.2, '#4a3a2a', 1) + `<path d="M${f1(b[0] - 2)} ${f1(b[1] + 3)} L${f1(b[0] + 6)} ${f1(b[1] - 2)} L${f1(b[0])} ${f1(b[1] - 4)} Z" fill="#1a1a1c" stroke="${INK}" stroke-width="0.6"/>`); }
}

// ======================================================================== FORE: the broken capstan and a coil of harpoon line at the bottom left;
// surf thrown up white across the bottom right (round the whale's water); rain
layer('fore');
{
  raw(G.smoothRock([[-20, H + 10], [-20, 360], [60, 350], [150, 380], [230, 430], [260, H + 10]], 3, '#1a2024', { dir: 'h', rib: 7, flank: 0.4, rimCol: '#a8b4b8', rimOp: 0.4 }) + BK.blisters(110, 430, 80, 26, '#7a7e74', { size: 3 }));
  { const c = [140, 372]; raw(cel([[c[0] - 30, c[1]], [c[0] + 30, c[1]], [c[0] + 26, c[1] - 56], [c[0] - 26, c[1] - 56]], { Z: 3, fill: '#2a2622', tex: 'url(#mottle)', texOp: 0.5, band: 8 }) + cel(ell([c[0], c[1] - 56], 30, 8, 0, 14), { Z: 3, fill: '#3a342c', band: 3 }) + line([[c[0] - 10, c[1] - 60], [c[0] - 70, c[1] - 76]], 6, INK, 1) + line([[c[0] - 10, c[1] - 60], [c[0] - 70, c[1] - 76]], 3.6, '#4a3e32', 1) + line([[c[0] + 8, c[1] - 58], [c[0] + 40, c[1] - 66]], 6, INK, 1)); }
  for (let j = 0; j < 4; j++) raw(`<ellipse cx="80" cy="${448 - j * 4}" rx="${46 - j * 5}" ry="10" fill="none" stroke="#5a4a30" stroke-width="4"/>`);
  for (let i = 0; i < 0; i++) { const x = 980 + R() * 520, y = H - R() * 70, l = 10 + R() * 40; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(l * 0.2)} ${f1(-l * 0.8)} ${f1(l * 0.7)} ${f1(-l)}" stroke="${SURF}" stroke-width="${f1(1.2 + R() * 1.8)}" fill="none" opacity="${f1(0.25 + R() * 0.4)}" stroke-linecap="round"/>`); }
  // a wave breaking across the front of the boss's stage: a dark curling face, a white crest tumbling, lace and spray
  { const TP = x => Math.max(0, 960 - x) * 0.32, TW = x => Math.min(1, Math.max(0.05, (x - 780) / 180)); const crest = []; for (let x = 780; x <= W + 30; x += 14) crest.push([x, 376 + TP(x) + Math.sin(x * 0.018) * 10 + Math.sin(x * 0.07) * 4 + (R() - 0.5) * 5]);
    // the wave's face: dark green-slate water, streaked and laced with foam, darker toward the trough
    raw(`<path d="${smooth([[780, H + 10], ...crest.map(([x, y]) => [x, y + 8]), [W + 30, H + 10]], true, 0.5)}" fill="#2a3a40"/>`);
    for (let j = 0; j < 7; j++) { const pts = crest.map(([x, y]) => [x, y + 20 + j * 13 + Math.sin(x * 0.025 + j * 1.7) * 5]); raw(line(pts, 1 + j * 0.2, j % 2 ? '#c8d4d4' : '#14202a', j % 2 ? 0.35 : 0.6)); }
    for (let i = 0; i < 40; i++) { const x = 880 + R() * 600, y = 400 + R() * 80, l = 10 + R() * 30; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(l / 2)} ${f1(-3)} ${f1(l)} 0" stroke="${SURF}" stroke-width="1" fill="none" opacity="${f1(0.3 + R() * 0.3)}"/>`); }
    // the crest: one tumbling band of foam with a scalloped top, curls drawn into it, a grey underside, spray blown back
    const top = [], bot = []; for (let x = 780; x <= W + 30; x += 6) { const y = 376 + TP(x) + Math.sin(x * 0.018) * 10 + Math.sin(x * 0.07) * 4, tw = TW(x); top.push([x, y - (8 + Math.abs(Math.sin(x * 0.085)) * 8 + R() * 2) * tw]); bot.push([x, y + (8 + Math.sin(x * 0.05) * 2) * tw]); }
    raw(`<path d="${smooth([...top, ...bot.slice().reverse()], true, 0.5)}" fill="${SURF}" opacity="0.88"/>` + line(bot, 2, '#7a8a90', 0.6) + line(top, 0.8, '#9aa8ac', 0.5));
    for (let x = 900; x < W; x += 30 + R() * 20) { const y = 376 + TP(x) + Math.sin(x * 0.018) * 10; raw(`<path d="M${f1(x)} ${f1(y + 4)} q8 -10 18 -2" stroke="#9aaab0" stroke-width="1" fill="none" opacity="0.7"/>`); }
    for (let i = 0; i < top.length; i += 3) { const [x, y] = top[i], l = 10 + R() * 26; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(l * 0.2)} ${f1(-l * 0.9)} ${f1(l * 0.8)} ${f1(-l)}" stroke="${SURF}" stroke-width="${f1(0.8 + R() * 1.2)}" fill="none" opacity="${f1(0.2 + R() * 0.35)}" stroke-linecap="round"/>`); } }
  raw(BK.rain(300, { x0: -20, x1: W, y0: -10, y1: H, slant: 0.32, len: 34, w: 1.0, col: WET, op: 0.25 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, note: 'right 45% kept for the ruler; the sea stacks frame it' } }, null, 1));
console.log(ROOM + ' layers written');
