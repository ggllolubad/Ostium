// World IV, the Sulphur Pits: THE VENTS (round 2, group g2). Room key 'pits_vent'.
// Contract as the nave: 1480 x 480 (shown at 2x); pits_vent_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters here: Toad Pool (toads in the sulphur, an imp with a torch), The Deep Seam (crawlers in the dark, toads in the
// vents). The Burning Lung's fight has moved to pits_boss.
// The place (bible IV: "the air itself became fuel and every poison is a fuse"): below the last timbered workings the miners
// broke into a natural cavern where the brimstone was born. Nothing here is built. The company stands on a rock shelf
// crusted with sulphur at the edge of the toad pool, a hot ochre water held behind scalloped rimstone dams. Across it the
// vents breathe: a fumarole chimney grown of yellow crystal burns with a standing flame that lights the whole vault from
// below; lesser vents gutter along the far shore. Flowstone pillars and curtains hang from the vault, lit orange underneath.
// High in the far wall the deep seam's adit opens, its ladder hanging broken, a miner's lamp still burning in its mouth.
// Courses: FIRE (standing flames in the vents, soot fanned up the rock, ash rising, charred props of the old adit); TOXIN
// (sulphur crystal crowns, yellow crusts, gas blisters, the ochre haze that lies over the water).
// Light: firelight from BELOW (vents and pool); no daylight, no lamps but the one far away. High warm key, ochre air.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IV');
const W = 1480, H = 480, ROOM = 'pits_vent';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2624, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#2a1606' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#1a1008', AIR = '#7a5a28';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 10, airD: 30, airMax: 0.55 });
const rockH = (pts, Z, col, o = {}) => G.smoothRock(pts, Z, col, Object.assign({ dir: 'h', rib: 9, wave: 3, k: 0.3 }, o, { dir: 'h' }));
const { line, polyS, timber, oilLamp } = G;
const { ell } = require('../engine');
const SULF = '#d8c040', OCHRE = '#a08048', LAMP = '#e8902a', HOT = '#ff8a2a', ROCK = '#4a3820', SOOT = '#1a1008';
const VX = 1.2, VZ = 19;                                   // the great vent
const LT = G.lightTint([{ p: [VX, 2.5, VZ], col: '#e89a3a', r: 14, k: 0.7, zk: 0.6 }, { p: [9.5, 0.6, 15.5], col: '#e8902a', r: 6, k: 0.45 }, { p: [-10, 0.6, 22], col: '#d8902a', r: 7, k: 0.4 }, { p: [0, -0.5, 12], col: '#c8a040', r: 9, k: 0.35, yk: 0.4 }]);
const litCol = (col, X, Y, Z, k = 1) => { const t = LT([X, Y, Z]); return t ? mix(col, t[0], t[1] * k) : col; };

// a flowstone mass (pillar, curtain): smooth rock in vertical flows, lit orange underneath by the glow below
const flowstone = (pts, Z, col, o = {}) => G.smoothRock(pts, Z, col, Object.assign({ dir: 'v', rib: 7, ring: 2, flank: 0.35, rimCol: '#f0c070', rimOp: 0.55 }, o));
// a crystal crown: sulphur needles in a heap, lit facets
const crystals = (x, y, r, n, sz, col = SULF) => BK.sulphur(x, y, r, n, { size: sz, col });

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3: the cavern going back into the haze: bands of ochre air, darker high up, lit low where the vents are
for (const [y0, y1, col, op] of [[0, 320, '#2a1a0c', 1], [90, 320, '#3a2812', 0.9], [150, 320, '#5a3e1c', 0.7], [205, 320, '#7a5426', 0.55]]) raw(G.veil(y0, y1, op, col, { amp: 10, ph: y0 }));
raw(glow(P(VX, 3, 40)[0], 220, 520, 160, '#c87a30', 0.35));
// distant masses at ~40 m and ~30 m: smooth worn rock with haze laid over, each ridge its own outline
for (const [Z, yb, amp, col, air] of [[42, 196, 40, '#4a3418', 0.55], [32, 232, 70, '#3e2c16', 0.38]]) {
  const top = []; for (let x = -30; x <= W + 30; x += 30 + R() * 50) top.push([x, yb - amp * (0.3 + 0.7 * Math.abs(Math.sin(x * 0.006 + Z))) - R() * amp * 0.3]);
  raw(G.smoothRock([...top, [W + 30, 330], [-30, 330]], Z, col, { dir: 'h', rib: 9, flank: 0.2, airOp: air, airCol: '#6a4a20', rimCol: '#e8b060', rimOp: 0.4, under: 0.3, underOp: 0.12 }));
}
// a buttress at the left rising into the vault with the deep seam's adit high in it: a timbered mouth, a lamp burning in
// it, its ladder hanging broken
{
  raw(G.smoothRock([[120, 330], [150, 230], [170, 120], [210, 40], [190, -10], [470, -10], [440, 60], [450, 150], [430, 250], [460, 330]], 26, '#3a2814', { dir: 'h', rib: 10, flank: 0.4, airOp: 0.3, airCol: '#5a3e1c', rimCol: '#e8b060', rimOp: 0.4 }));
  const ax = -9.0, ay = 6.4, Za = 25.5;
  raw(`<path d="${pp([[ax - 0.8, ay, Za], [ax + 0.8, ay, Za], [ax + 0.8, ay + 1.8, Za], [ax - 0.8, ay + 1.8, Za]])}" fill="#0e0804"/>`);
  raw(timber([ax - 0.85, ay, Za - 0.1], [ax - 0.8, ay + 1.9, Za - 0.1], 0.22, { col: '#4a3a24', char: 0.5 }) + timber([ax + 0.85, ay, Za - 0.1], [ax + 0.8, ay + 1.9, Za - 0.1], 0.22, { col: '#4a3a24' }) + timber([ax - 1.1, ay + 1.9, Za - 0.12], [ax + 1.1, ay + 1.95, Za - 0.12], 0.26, { col: '#4a3a24' }));
  { const l = P(ax + 0.3, ay + 1.1, Za - 0.3); raw(oilLamp(l[0], l[1], 2.8, true, { gr: 6, gop: 0.45 })); }
  for (const dx of [-0.35, 0.3]) raw(line([P(ax + dx, ay, Za - 0.2), P(ax + dx + 0.1, ay - 2.6 - (dx > 0 ? 1.1 : 0), Za - 0.3)], 1.4, '#2a1e10', 1));
  for (let j = 1; j < 6; j++) { const Y = ay - j * 0.45; raw(line([P(ax - 0.35, Y, Za - 0.25), P(ax + 0.3, Y - 0.05, Za - 0.25)], 1.2, '#2a1e10', 1)); }
  raw(BK.rope([P(ax + 0.6, ay, Za - 0.3), P(ax + 0.9, ay - 2, Za - 0.3), P(ax + 0.7, ay - 3.5, Za - 0.3)], 0.8, '#5a4a30'));
}
// ---- the vault: a heavy flowstone ceiling, curtains hanging from it at different lengths, lit orange underneath where the
// vent's light reaches
{
  const bottom = []; for (let x = -20; x <= W + 20; x += 26 + R() * 30) { const d = Math.abs(x - 800) / 800; bottom.push([x, 36 + d * 80 + Math.sin(x * 0.017) * 16 + R() * 10]); }
  raw(G.smoothRock([[-20, -10], [W + 20, -10], ...bottom.slice().reverse()], 20, '#2e2010', { dir: 'h', rib: 12, flank: 0.25, under: 0.35, underOp: 0.22, rimOp: 0.2 }));
  for (const [x, w, l] of [[260, 64, 120], [560, 90, 64], [960, 50, 104], [1080, 96, 84], [1250, 46, 150], [1380, 70, 96], [120, 34, 70]]) {
    const top = 36 + Math.abs(x - 800) / 800 * 70, pts = [[x - w / 2, top - 6]];
    // a tapering curtain: the sides pull in as it hangs, the lower edge breaks into drips of different lengths
    const nd = 3 + Math.floor(R() * 3), bl = top + l * 0.55;
    pts.push([x - w * 0.42, top + l * 0.3]);
    for (let k = 0; k < nd; k++) { const u = (k + 0.5) / nd, xx = x - w * 0.36 + w * 0.72 * u, dl = l * (0.45 + R() * 0.55) * (1 - Math.abs(u - 0.4) * 0.6); pts.push([xx - w * 0.08, bl + (R() - 0.5) * 8], [xx, top + dl], [xx + w * 0.07, bl + (R() - 0.5) * 8]); }
    pts.push([x + w * 0.4, top + l * 0.25], [x + w / 2, top - 6]);
    raw(flowstone(pts, 16, '#3a2812', { rib: 5, under: 0.35, underOp: 0.35, ring: 1 }));
  }
}
// ---- plane 2: the far shore and the vents
{
  const shore = []; for (let X = -26; X <= 26; X += 1.4 + R()) shore.push(P(X, 0.3 + R() * 0.7, 21 + Math.sin(X * 0.3) * 2.5));
  raw(G.smoothRock([...shore, [W + 30, 340], [-30, 340]], 22, '#4a3418', { dir: 'h', rib: 5, flank: 0.15, rimCol: '#f0c070', rimOp: 0.7, under: 0.5, underOp: 0.12 }));
  for (const p of shore) if (R() < 0.4) raw(crystals(p[0], p[1] + 2, 8, 3, 2.2, '#c8b040'));
  for (const [X, Y, Z, w, h] of [[9.5, 0.6, 15.5, 0.6, 0.9], [-10, 0.7, 22, 0.5, 0.7], [-16, 0.8, 24, 0.4, 0.5]]) {
    const b = P(X, Y, Z), k = K(Z); raw(G.smoothRock([[b[0] - k * 1.1, b[1] + 6], [b[0] - k * 0.6, b[1] - k * 0.4], [b[0] - k * 0.2, b[1] - k * 0.55], [b[0] + k * 0.3, b[1] - k * 0.5], [b[0] + k * 0.9, b[1] + 6]], Z, litCol('#4a3418', X, Y, Z), { dir: 'v', rib: 4, flank: 0.35, rimCol: '#ffd080', rimOp: 0.7 }));
    raw(crystals(b[0], b[1] - k * 0.45, k * 0.4, 6, k * 0.1) + `<path d="${smooth([[b[0] - 14, b[1] - k * 1.2], [b[0] - 22, b[1] - k * 3.5], [b[0] + 4, b[1] - k * 4.4], [b[0] + 18, b[1] - k * 2.2]], true, 0.6)}" fill="${SOOT}" opacity="0.22"/>`);
    G.fireAt(X, Y + 0.5, Z, w, h, { n: 5, gr: 3, gop: 0.35 });
  }
  // the great fumarole: a knobbled chimney of crust and crystal, cracked, glowing in its seams, the standing flame on top
  const b = P(VX, 0, VZ), k = K(VZ), top = P(VX, 1.75, VZ);
  const chim = [[b[0] - k * 2.6, b[1] + 4], [b[0] - k * 2.2, b[1] - k * 0.35], [b[0] - k * 1.7, b[1] - k * 0.5], [b[0] - k * 1.45, b[1] - k * 0.95], [b[0] - k * 1.05, b[1] - k * 1.05], [top[0] - k * 0.75, top[1] + 6], [top[0] - k * 0.35, top[1] - 1], [top[0] + k * 0.3, top[1] + 1], [top[0] + k * 0.7, top[1] + 9], [b[0] + k * 1.0, b[1] - k * 1.25], [b[0] + k * 1.35, b[1] - k * 1.4], [b[0] + k * 1.7, b[1] - k * 1.1], [b[0] + k * 1.9, b[1] - k * 0.5], [b[0] + k * 2.5, b[1] - k * 0.3], [b[0] + k * 2.9, b[1] + 4]];
  raw(G.smoothRock(chim, VZ, '#3a2a14', { dir: 'v', rib: 6, ring: 4, flank: 0.4, rimCol: '#ffe0a0', rimOp: 0.8, under: 0.25, underOp: 0.2 }));
  for (let j = 0; j < 6; j++) { const y0 = top[1] + 10 + j * k * 0.38, x0 = b[0] + (R() - 0.5) * k * 1.3; raw(EM(line([[x0, y0], [x0 + (R() - 0.5) * 8, y0 + 8], [x0 + (R() - 0.5) * 10, y0 + 16]], 1.4, HOT, 0.9))); }
  raw(crystals(top[0], top[1] + 4, k * 0.5, 16, k * 0.16) + crystals(b[0] - k * 0.9, b[1] - k * 1.0, k * 0.3, 7, k * 0.12) + crystals(b[0] + k * 1.1, b[1] - k * 0.5, k * 0.35, 7, k * 0.1));
  // THE LIGHT FOCUS: the standing flame and its light thrown up onto the vault
  raw(glow(top[0], top[1] - 70, 460, 230, LAMP, 0.38) + glow(top[0], top[1] - 40, 150, 120, '#ffd890', 0.3));
  G.fireAt(VX, 1.65, VZ, 1.5, 3.6, { n: 9, licks: 8, gr: 2.5, gop: 0.3 });
  G.fireAt(VX + 1.45, 1.35, VZ - 0.2, 0.5, 1.1, { n: 5, gop: 0.2 });
  for (let i = 0; i < 40; i++) { const x = top[0] + (R() - 0.5) * 120, y = top[1] - 110 - R() * 110; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(-2 + R() * 2)} -3 ${f1(R() * 3)} ${f1(-6 - R() * 4)}" stroke="#c8b8a0" stroke-width="${f1(0.5 + R() * 0.6)}" fill="none" opacity="${f1(0.3 + R() * 0.3)}"/>`); }
}
raw(G.veil(130, 340, 0.12, AIR, { amp: 0 }));
// the value plan: dark frame edges (ragged steps of the murk into the top and both sides, away from the vent)
for (const [op, d] of [[0.34, 1], [0.3, 0.72], [0.26, 0.48]]) { const pts = [[-20, -20], [W + 20, -20], [W + 20, 340]]; for (let x = W + 20; x >= -20; x -= 40) { const u = Math.abs(x - P(VX, 0, VZ)[0]) / 760; pts.push([x, Math.max(-20, 340 * Math.pow(u, 1.4) * d - 120 * (1 - u) + (R() - 0.5) * 16)]); } pts.push([-20, 340]); raw(`<path d="${smooth(pts, true, 0.4)}" fill="${MURK}" opacity="${op}"/>`); }
// ---- the toad pool: hot ochre water held behind scalloped rimstone dams, the flames broken in it, gas blisters bursting
{
  const PY = -0.22, z0 = 8.4, z1 = 21;
  raw(BK.water(-26, 26, z0, z1, '#4a3814', { y: PY, n: 220, lite: '#c8a040', refl: [[P(VX, 0, VZ)[0], 60, '#f0a040', P(0, PY, 19)[1], P(0, PY, 9)[1]], [P(9.5, 0, 15.5)[0], 24, '#e8902a', P(0, PY, 15)[1], P(0, PY, 10)[1]]] }));
  for (let i = 0; i < 16; i++) { const X = -12 + R() * 24, Z = 9.5 + R() * 9, [x, y] = P(X, PY, Z); raw(BK.ripples(x, y, K(Z) * (0.2 + R() * 0.3), 2, '#d8b860', 0.4) + (R() < 0.5 ? `<ellipse cx="${f1(x)}" cy="${f1(y - 1)}" rx="${f1(K(Z) * 0.05)}" ry="${f1(K(Z) * 0.035)}" fill="#c8a838" stroke="${INK}" stroke-width="0.5"/>` : '')); }
  raw(G.steam(P(-4, 0, 14)[0], P(-4, 0, 14)[1], 80, 70, { col: '#d8c088', op: 0.12, n: 6 }) + G.steam(P(5, 0, 12)[0], P(5, 0, 12)[1], 60, 60, { col: '#d8c088', op: 0.12, n: 5 }));
}
raw(BK.quiet(MURK, 236, 360, { steps: [0.14, 0.18, 0.22, 0.26], hop: 0.18 }));
// ---- plane 1: the near flowstone: a pillar at the left joining floor and vault, a great curtain at the right hanging to
// a man's height, both lit orange beneath
{
  const xl = P(-6.6, 0, 9.4), kl = K(9.4);
  raw(flowstone([[xl[0] - kl * 0.9, xl[1] + 4], [xl[0] - kl * 0.55, xl[1] - kl * 1.2], [xl[0] - kl * 0.35, xl[1] - kl * 2.4], [xl[0] - kl * 0.5, 140], [xl[0] - kl * 0.95, 60], [xl[0] - kl * 1.4, -10], [xl[0] + kl * 1.1, -10], [xl[0] + kl * 0.4, 70], [xl[0] + kl * 0.25, 150], [xl[0] + kl * 0.38, xl[1] - kl * 2.2], [xl[0] + kl * 0.6, xl[1] - kl * 0.9], [xl[0] + kl * 1.0, xl[1] + 4]], 9.4, litCol(ROCK, -6, 1, 11, 0.6), { cell: 18, under: 0.2, underOp: 0.15, flank: 0.4 }));
  raw(crystals(xl[0] - kl * 0.2, xl[1] - kl * 0.1, kl * 0.5, 10, kl * 0.09));
  const xr = P(7.2, 2.4, 11.5), kr = K(11.5);
  raw(flowstone([[xr[0] - kr * 1.8, -10], [xr[0] + kr * 2.6, -10], [xr[0] + kr * 2.1, 90], [xr[0] + kr * 1.6, xr[1] - kr * 0.3], [xr[0] + kr * 1.1, xr[1] + kr * 0.15], [xr[0] + kr * 0.5, xr[1] - kr * 0.2], [xr[0], xr[1] + kr * 0.3], [xr[0] - kr * 0.6, xr[1] - kr * 0.4], [xr[0] - kr * 1.1, xr[1] - kr * 1.0], [xr[0] - kr * 1.5, 80]], 11.5, litCol(ROCK, 7, 1, 13, 0.7), { cell: 16, under: 0.3, underOp: 0.28 }));
}
// ---- the shelf: rock crusted with sulphur, the rimstone dams at its edge, cracks running out to the pool, small vents
{
  const at = (s, t) => [-30 + s, 0, 3.6 + t], Lz = 5.0;
  raw(G.hewnRock((s, t) => at(t, s), Lz, 60, '#3a2c18', { bed: 1.6, block: 1.6, pick: 0.1, spall: 0.3, tint: (q) => LT(q), streaks: 0 }));
  raw(G.floorCracks(at, 22, 38, 0.3, Lz, 8, { toward: 31, lip: '#c8a050' }));
  for (let i = 0; i < 22; i++) { const X = -12 + R() * 24, Z = 4 + R() * 4.4, [x, y] = P(X, 0, Z), r = K(Z) * (0.12 + R() * 0.3); raw(stain(x, y, r, '#a89030', 0.35) + (R() < 0.6 ? crystals(x, y, r * 0.6, 3 + Math.floor(R() * 4), Math.max(1, K(Z) * 0.04)) : '')); }
  // the rimstone dams: a scalloped lip of yellow-white crust; the drop to the water dark
  const lip = []; for (let X = -26; X <= 26; X += 0.35) lip.push([X, 8.4 + 0.35 * Math.abs(Math.sin(X * 1.3)) + Math.sin(X * 0.2) * 0.3]);
  const top = lip.map(([X, Z]) => P(X, 0.02, Z)), bot = lip.map(([X, Z]) => P(X, -0.22, Z + 0.05));
  raw(`<path d="${p2([...top, ...bot.slice().reverse()])}" fill="#2a1e0c"/><path d="${p2([...top, ...bot.slice().reverse()])}" fill="${S.hatchA(8)}" opacity="0.5"/>` + line(top, 2.4, INK, 1) + line(top.map(([x, y]) => [x, y - 1]), 1.4, '#e8d088', 0.8));
  for (let X = -10; X <= 10; X += 1.4 + R()) { const p = P(X, 0, 8.5); raw(crystals(p[0], p[1], 6, 2, 1.6, '#e0c850')); }
  // small vents in the shelf: cracks breathing a little flame and haze
  for (const [X, Z] of [[-3.4, 7.2], [2.8, 7.8]]) { G.fireAt(X, 0, Z, 0.25, 0.3, { n: 4, gop: 0.25 }); const p = P(X, 0, Z); raw(line([[p[0] - 12, p[1]], [p[0] - 2, p[1] - 1], [p[0] + 10, p[1] + 1]], 2.2, INK, 1) + '' + crystals(p[0] - 6, p[1], 6, 4, 2)); }
  raw(S.occBand((s, t) => [-30 + s, 0, 3.6 + Lz - t], 60, 0.6, { op: 0.25 }) + `<path d="${smooth([[-20, 520], [-20, 440], [300, 452], [740, 470], [1180, 452], [W + 20, 440], [W + 20, 520]], true, 0.5)}" fill="${MURK}" opacity="0.35"/>`);
}
// ---- ochre haze lying over the water and drifting up; ash rising from the vents
raw(G.bank(-10, W + 10, 300, 40, { col: '#c8a050', op: 0.14, soft: true, ph: 2 }) + G.bank(-10, W + 10, 250, 50, { col: '#c8a050', op: 0.08, soft: true, ph: 5 }));
for (let i = 0; i < 50; i++) { const x = R() * W, y = 40 + R() * 260; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(-2 + R() * 2)} -3 ${f1(R() * 3)} ${f1(-6 - R() * 4)}" stroke="#d8c8a8" stroke-width="${f1(0.5 + R() * 0.5)}" fill="none" opacity="${f1(0.25 + R() * 0.3)}"/>`); }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
{
  // the deep seam's leavings: a miner's cap and cold lamp, a broken pick, a crushed canary cage on the shelf edge; a stub of
  // charred ladder fallen from the adit lying in the shallows
  const Z = 8.0, k = K(Z);
  { const c = P(-2.4, 0, Z); raw(cel(ell([c[0], c[1] - k * 0.04], k * 0.14, k * 0.05, 0, 12), { Z, fill: '#2a2018', band: 1 }) + cel([[c[0] - k * 0.1, c[1] - k * 0.05], [c[0] - k * 0.08, c[1] - k * 0.13], [c[0] + k * 0.08, c[1] - k * 0.14], [c[0] + k * 0.1, c[1] - k * 0.05]], { Z, fill: '#34281c' }) + oilLamp(c[0] + k * 0.25, c[1] - 1, k * 0.06, false)); }
  { const a = P(4.2, 0.02, Z - 0.4), b = P(5.3, 0.04, Z - 0.8); raw(line([a, b], 2.4, INK, 1) + line([a, b], 1.2, '#4a3a26', 1)); }
  { const c = P(-9.2, 0, Z + 0.4); raw(G.cage(c[0], c[1] + 2, k * 0.22, { col: '#4a3a24' }).replace('<path', `<g transform="rotate(-70 ${f1(c[0])} ${f1(c[1])})"><path`) + '</g>'); }
  { raw(timber([6.0, -0.1, 9.2], [8.2, 0.15, 10.6], 0.14, { char: 0.3, col: '#3a2a18' })); }
  // scale cue: a miners' wooden ore barrow left on the shelf, its wheel iron-shod, heaped with sulphur lumps
  { const Z2 = 7.6, k2 = K(Z2), c = P(-5.6, 0, Z2); raw(cel([[c[0] - k2 * 0.55, c[1] - k2 * 0.5], [c[0] + k2 * 0.35, c[1] - k2 * 0.55], [c[0] + k2 * 0.3, c[1] - k2 * 0.22], [c[0] - k2 * 0.45, c[1] - k2 * 0.2]], { Z: Z2, fill: '#3a2a18', tex: 'url(#mottle)', texOp: 0.5, band: 2 }) + `<circle cx="${f1(c[0] + k2 * 0.42)}" cy="${f1(c[1] - k2 * 0.16)}" r="${f1(k2 * 0.16)}" fill="#2a2018" stroke="${INK}" stroke-width="1.4"/>` + line([[c[0] - k2 * 0.5, c[1] - k2 * 0.3], [c[0] - k2 * 0.95, c[1] - k2 * 0.15]], 2.2, INK, 1) + line([[c[0] - k2 * 0.4, c[1] - k2 * 0.2], [c[0] - k2 * 0.42, c[1]]], 2, INK, 1) + crystals(c[0] - k2 * 0.1, c[1] - k2 * 0.55, k2 * 0.3, 9, k2 * 0.06)); }
}

// ======================================================================== FORE: crystal-crusted rock below, a dripping curtain above
layer('fore');
{
  raw(flowstone([[W - 360, -10], [W + 20, -10], [W + 20, 120], [W - 40, 92], [W - 90, 140], [W - 150, 70], [W - 210, 96], [W - 260, 40], [W - 320, 52]], 3, '#2a1c0c', { cell: 22, under: 0.4, underCol: LAMP, underOp: 0.25, flank: 0.3 }));
  raw(rockH([[-20, H + 4], [-10, H - 64], [40, H - 82], [110, H - 70], [190, H - 40], [250, H + 4]], 3, '#3a2a14', { cell: 26, flank: 0.4, rimCol: '#f0c070', rimOp: 0.4 }));
  raw(crystals(70, H - 74, 44, 20, 9) + crystals(160, H - 44, 30, 10, 7) + BK.blisters(30, H - 40, 22, 10, '#b8a038', { size: 4 }));
  raw(rockH([[W - 220, H + 4], [W - 170, H - 30], [W - 90, H - 44], [W + 20, H - 26], [W + 20, H + 4]], 3, '#33240f', { cell: 22, flank: 0.35, rimOp: 0.3 }));
  raw(crystals(W - 110, H - 36, 30, 10, 6));
  for (let i = 0; i < 40; i++) { const x = R() * W, y = 60 + R() * 380; raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + R())}" fill="${R() < 0.6 ? '#e8d070' : '#c8b8a0'}" opacity="${f1(0.3 + R() * 0.35)}"/>`); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
