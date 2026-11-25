// World VII, the Icebound Fleet: WHERE IT ROSE (boss room, Living Ink). Room key 'fleet_boss'. Boss: The Leviathan in the
// Ice ("The fleet sailed to kill it. It froze the sea around them all."), with a Frozen Whaler.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430). The right 45 % of the frame is the boss's stage.
// The place: the heart of the battle, where the leviathan broke up through the sea and the sea froze round it. The ice is
// heaved into a crater of upthrust plates three and four storeys high; a ship of the line caught at the crater's edge is
// rolled and pitched by the heave, stern down in the black water, bow lifted, keel still in the ice (polish round); the rest stands
// ringed round in the dark. Storm overhead, black; one tear of cold low sun breaks under the cloud deck exactly behind
// the boss's head, so the head, the jaw and the slabs round it are rimmed white: the most dramatic light in the world.
// The ice under the company is cracked in long radiating fissures that all run back to the stage.
// Courses: FROST (the heaved ice, rime, icicles, the sea stopped mid-heave); WATER (black water in the cracks, the drowned
// crew on the tipped ship, barnacled hull). Palette: black, ice white, grey-blue; no warm colour, no eyes (the boss's own
// eye is its figure, not the room), no gold, no red.
// Usage: node scenes/bg_fleet_boss.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VII');
const W = 1480, H = 480, ROOM = 'fleet_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 7404, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#eef4f8', shadowTint: '#0a0e14' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW } = S;
const G = require('./battle_kit_g3')(S, { air: '#3c4654', murk: '#0e1218' });
const { BK, BL, air, clouds, glare, wedges, plates, snowfall, ship, ridgePts } = G;
const { line, pline, fillP, fillS, inkP, blob } = BK;

const BREAK = '#eef4f8', RIME = '#d8e2ea', SNOW = '#e4ecf0', MURK = '#0e1218', STORM = '#161c24';
const BX = 980, BY = 200;                           // the centre of the tear of light behind the boss's head

// ======================================================================== FAR
layer('far');
// ---- the storm: a smooth dark gradient sky, a heavy cloud deck of soft masses lowering over it; the tear of low sun under
// the deck, a smooth white glow behind the boss's head, the cloud undersides lit round it, virga hanging across it
{
  raw(`<rect width="${W}" height="${H}" fill="${STORM}"/>` + G.skyGrad([[0, '#0a0d12'], [0.25, '#121820'], [0.45, '#2a3440'], [0.58, '#7a8a9a'], [0.66, '#5a6878']], { y0: 0, y1: 310 }));
  raw(G.radGlow(BX, BY + 10, 560, 120, '#f4f8fa', 0.85, { mid: 0.3, midOp: 0.5 }) + G.radGlow(BX + 40, BY + 20, 260, 50, '#ffffff', 0.8));
  for (let i = 0; i < 40; i++) { const x = 600 + R() * 880, y = BY - 40 + R() * 30, l = 30 + R() * 70; raw(`<path d="M${f1(x)} ${f1(y)} l${f1(l * 0.3)} ${f1(l)}" stroke="#8a9aaa" stroke-width="${f1(1 + R() * 1.4)}" opacity="0.2" filter="url(#soft)"/>`); }
  // the deck: heavy soft masses, their undersides lit where they hang over the tear
  for (let i = 0; i < 14; i++) { const x = -60 + i * 115 + (R() - 0.5) * 60, y = 40 + R() * 90, w = 220 + R() * 220, near = Math.max(0, 1 - Math.abs(x - BX) / 600); raw(G.softCloud(x, y, w, w * 0.28, { mid: '#1a2029', shade: mix('#0c1016', '#8a9cb0', near * 0.5), lit: mix('#2a323e', '#5a6a7a', near), op: 0.95, inkOp: 0.12 })); }
  { const pts = []; for (let x = -20; x <= W + 20; x += 40 + R() * 30) pts.push([x, 132 + Math.sin(x * 0.006) * 10 + (x > 560 ? -8 : 0) + (R() - 0.5) * 10]); raw(G.softMass(740, 60, 900, 90, '#0e1218', 0.6) + line(pts.filter(p => p[0] > 560), 3, '#c8d6e2', 0.45, ' filter="url(#soft)"')); }
  // rags of lit cloud crossing the tear
  for (let i = 0; i < 6; i++) raw(G.softCloud(640 + R() * 820, BY - 20 + R() * 50, 120 + R() * 140, 24, { mid: '#7a8a9a', shade: '#4a5664', lit: '#e8f0f4', op: 0.7, inkOp: 0.1, wisps: 2 }));
}
// ---- the fleet ringed round in the dark on the left: hulls and masts at 70..140 m, rimmed by the tear's light
{
  for (const [X, Z, l] of [[-72, 140, 30], [-48, 100, 32], [-26, 76, 30]]) {
    const a = P(X, 0, Z), b = P(X + l, 0, Z), hy = K(Z) * 6.5, col = air('#0c0e12', Z, { z0: 40, z1: 200, max: 0.5 });
    raw(fillS([[a[0], a[1]], [a[0] - 1, a[1] - hy * 1.1], [(a[0] + b[0]) / 2, a[1] - hy * 0.85], [b[0] + 2, a[1] - hy], [b[0], a[1]]], col) + pline([[(a[0] + b[0]) / 2, a[1] - hy * 0.85], [b[0] + 2, a[1] - hy]], 1, '#8a9aaa', 0.6));
    for (let j = 0; j < 3; j++) { const mx = a[0] + (b[0] - a[0]) * (0.22 + j * 0.27), mh = hy * (3.6 + (j === 1 ? 0.8 : 0)); raw(line([[mx, a[1] - hy * 0.8], [mx, a[1] - mh]], Math.max(0.8, K(Z) * 0.5), col)); for (const fr of [0.55, 0.78]) raw(pline([[mx - hy * 0.55, a[1] - mh * fr], [mx + hy * 0.55, a[1] - mh * fr]], 1, col)); }
  }
  // the far ice to the horizon on the left, dark, with pressure ridges
  raw(fillP([[-10, 296], [760, 296], [760, 340], [-10, 340]], '#2a323c'));
  for (const Z of [70, 50]) raw(wedges(Array.from({ length: 8 }, (_, i) => P(-60 + i * 9, 0, Z + Math.sin(i) * 4)), 18, { size: [K(Z) * 0.4, K(Z) * 1.2], cols: ['#5a6878', '#3a4656', '#20262e'], hatch: false, ink: 0.5 }));
}
// ---- the crater's far rim first, then the ship in the sea ice at the crater's edge: a ship of the line caught by the
// heave, rolled and pitched (stern down into the black water the leviathan broke open, bow lifted on the heaved plates),
// keel still in the ice; its masts splayed against the tear. Plates and floes are heaped along its waterline in front.
{
  raw(plates(Array.from({ length: 10 }, (_, i) => P(-6 + 50 * i / 9, 0, 66 + Math.sin(i * 1.3) * 3)), 20, { size: [22, 56], cols: ['#e8f0f4', '#5a6878', '#1a2028'], rime: SNOW, lit: '#ffffff', Z: 66, ink: 1, icicles: true }));
  // the open water the heave broke: a black lead along the crater's edge, floes in it, under the ship's stern
  const lead = []; for (let i = 0; i <= 20; i++) { const X = -14 + 40 * i / 20; lead.push(P(X, 0, 50 + Math.sin(i * 0.8) * 1.2)); }
  const leadB = lead.map(([x, y], i) => [x, y + 7 + Math.sin(i * 1.7) * 2]);
  raw(fillP([...lead, ...leadB.slice().reverse()], '#06090c') + pline(leadB, 1.2, '#c8d6e0', 0.6));
  for (let i = 0; i < 8; i++) { const t = R(), p = lead[Math.floor(t * 20)]; raw(fillS(blob(p[0], p[1] + 3, 6 + R() * 10, 1.6, 8, 0.4), '#8a9aaa', 0.9)); }
  const Z = 50, sh = ship(-8, 18, Z, { masts: [[-2, 20, 5.5], [6, 23, 6.2], [13.5, 18, 5]], ports: [12, 11], trim: 0, gunners: true, fog: 0.25, air: '#3c4654', hull: '#101216', hull2: '#1e2228', sprit: 8 });
  const pv = P(5, 0, Z), ang = -9, dy = K(Z) * 1.2;
  raw(`<g transform="translate(0 ${f1(dy)}) rotate(${ang} ${f1(pv[0])} ${f1(pv[1])})">${sh.svg}</g>`);
  // the rotated waterline: plates and floes shoved up against it along its whole length, heaped high under the lifted bow
  const rot = ([x, y]) => { const c = Math.cos(ang * Math.PI / 180), sn = Math.sin(ang * Math.PI / 180), dx = x - pv[0], dy2 = y - pv[1]; return [pv[0] + dx * c - dy2 * sn, pv[1] + dx * sn + dy2 * c + dy]; };
  const wl = Array.from({ length: 12 }, (_, i) => rot(P(-9 + 28 * i / 11, 0.2, Z)));
  raw(plates(wl, 26, { size: [14, 34], cols: ['#eef4f8', '#7a8a9a', '#1e252e'], rime: SNOW, lit: '#ffffff', Z, ink: 1, icicles: true }));
  raw(plates(wl.slice(7).map(([x, y]) => [x, y + 6]), 10, { size: [18, 40], cols: ['#e4ecf0', '#5a6878', '#161c24'], rime: SNOW, Z, ink: 1 }));
  // black water still showing round the stern where it went under, a skin of new ice on it
  { const c = rot(P(-8, 0, Z)); raw(fillS(blob(c[0] + 6, c[1] + 4, 34, 5, 10, 0.3), '#06090c') + pline([[c[0] - 20, c[1] + 4], [c[0] + 30, c[1] + 5]], 0.8, '#8a9aaa', 0.6)); }
}
// ---- the crater: ice plates heaved up three and four storeys round the stage, slabs leaning every way, their edges facing
// the tear lit white; the tallest at the right edge (the right post of the gate)
{
  const rim = (Z, x0, x1, n, sz, cols) => plates(Array.from({ length: 10 }, (_, i) => P(x0 + (x1 - x0) * i / 9, 0, Z + Math.sin(i * 1.3) * 3)), n, { size: sz, cols, rime: SNOW, lit: '#ffffff', Z, ink: 1, icicles: true });
  raw(rim(44, 22, 40, 10, [34, 80], ['#ffffff', '#4e5c6c', '#161c24']));
  // the right post: a great slab of sea ice tipped up at the right edge, its face in shadow, its rim lit, icicles
  const sl = [[1300, 340], [1350, 40], [1420, -10], [W + 10, -10], [W + 10, 345]];
  raw(cel(sl, { Z: 30, fill: '#1e262e', band: 10 }) + fillP(sl, S.hatchA(20), 0.45) + fillP(sl, S.hatchB(20), 0.3));
  raw(BL.rimeEdge([[1300, 340], [1350, 40], [1420, -10]], { w: 5, col: SNOW }) + line([[1302, 330], [1352, 42], [1420, -8]], 3, '#ffffff', 0.7));
  for (let i = 0; i < 7; i++) { const y = 60 + i * 38, x = 1350 - (y - 40) * 0.17 + 30 + R() * 80; raw(pline([[x, y], [x + 30 + R() * 40, y + 6 + R() * 10]], 1.2, '#5a6a7a', 0.6)); }
  // strata of the old sea ice in the slab (it froze in layers), and black water frozen in its cracks
  for (let i = 0; i < 5; i++) { const y = 100 + i * 48; raw(line([[1345 - (y - 40) * 0.17, y], [1400, y + 10], [W + 10, y + 4]], 1, '#3a4656', 0.7)); }
}
// ---- the quiet band: stepped toward the storm's murk behind the fighters
raw(BL.quiet(MURK, 240, 360, { steps: [0.12, 0.14, 0.16, 0.18], hop: 0.16 }));
// ---- the ice the company stands on: dark storm ice, glazed toward the light, cracks radiating from the stage
{
  const at = (s, t) => [-30 + s, 0, 4 + t], Lz = 30;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="#5e6c7a"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.2"/>`);
  // ice plates: big flat plates of their own tones, ink between, tilted a little
  for (let i = 0; i < 70; i++) { const X = -22 + R() * 44, Z = 4.4 + Math.pow(R(), 0.8) * 22, w = 1 + R() * 3, d = 0.6 + R() * 2, q = [[X, 0.01, Z], [X + w, 0.01, Z + (R() - 0.5) * 0.3], [X + w * 0.9, 0.01, Z + d], [X + 0.1, 0.01, Z + d * 0.9]].map(p => P(...p)); raw(cel(chip(q, 0.4), { Z, fill: mix(tone('#62707e', 0.12), '#a8b6c2', Math.max(0, Math.min(0.6, (q[0][0] - 500) / 900))), band: Math.max(0.6, K(Z) * 0.02), hi: false, inkW: 0.5, heavy: 0.8 })); }
  // the glaze: the tear's light lying on the ice in broken streaks, brighter toward the right (under the light)
  for (let i = 0; i < 120; i++) { const Z = 6 + Math.pow(R(), 0.8) * 22, X = -10 + R() * 30, a = P(X, 0.01, Z), l = K(Z) * (0.3 + R() * 1.2), br = Math.max(0, Math.min(1, (a[0] - 500) / 700)); raw(`<path d="M${f1(a[0] - l / 2)} ${f1(a[1])} l${f1(l)} 0" stroke="#d8e4ec" stroke-width="${f1(Math.max(0.6, K(Z) * 0.012))}" opacity="${f1(0.08 + br * 0.5 * R())}"/>`); }
  // the radiating cracks: from the stage out across the ice toward the company, black water frozen in them, white lips
  const O = [8.5, 0, 16];
  for (let i = 0; i < 6; i++) { let ang = Math.PI * (0.6 + i * 0.09) + (R() - 0.5) * 0.1; let x = O[0], z = O[2]; const pts = []; for (let j = 0; j < 26; j++) { pts.push(P(x, 0.01, z)); const st = 0.6 + R() * 0.5; ang += (R() - 0.5) * 0.5; x += Math.cos(ang) * st * 1.6; z -= Math.abs(Math.sin(ang)) * st * 0.9 + 0.05; if (z < 4.3) break; }
    const w = 1.8 - i * 0.15; raw(line(pts, w + 2, INK, 0.9) + line(pts, w * 0.6, '#0a1016', 1) + line(pts.map(([x2, y2]) => [x2, y2 + w * 0.5 + 0.6]), 0.9, '#c8d6e0', 0.6));
    for (let j = 2; j < pts.length - 1; j += 2) if (R() < 0.6) { const a = pts[j], b = [a[0] + (R() - 0.5) * 60, a[1] + (R() - 0.2) * 14]; raw(line([a, b], 1.4, INK, 0.7)); } }
  // a heaved ridge of plates where the radiating cracks pile up behind the fighters, low
  raw(plates(Array.from({ length: 8 }, (_, i) => P(-14 + i * 3.2, 0, 15 + Math.sin(i) * 1.5)), 16, { size: [8, 22], cols: ['#c8d4dc', '#4a5866', '#1e252e'], rime: SNOW, Z: 15 }));
  raw(occBand((s, t) => [-30 + s, 0, 4 + t], 60, 1.3, { op: 0.4, cross: true }));
}
// storm snow driven across the far
raw(snowfall(220, { len: 6, slant: 1.6, op: 0.35, col: '#c8d4e0', w: 1, y1: 330 }));

// ======================================================================== MID: low things on the ice behind the fighters
layer('mid');
{
  // a harpoon boat thrown up on its side by the heave, its harpoons scattered, a coil of whale line frozen in a snarl
  const Z = 11.5, k = K(Z), c = P(-8.6, 0, Z);
  const hull = [[c[0] - k * 1.4, c[1]], [c[0] - k * 1.2, c[1] - k * 0.6], [c[0] + k * 0.6, c[1] - k * 0.75], [c[0] + k * 1.5, c[1] - k * 0.3], [c[0] + k * 1.3, c[1]]];
  raw(cel(hull, { Z, fill: '#22282e', band: 3, tex: 'url(#mottle)', texOp: 0.4 }) + BL.rimeEdge(hull.slice(1, 4), { w: 2, col: SNOW }) + BL.icicles(hull[0], hull[4], 9, { max: k * 0.3, col: RIME }));
  for (let i = 0; i < 4; i++) raw(pline([[c[0] - k * 1.0 + i * k * 0.6, c[1] - k * 0.6], [c[0] - k * 0.9 + i * k * 0.6, c[1] - k * 0.05]], 0.8, INK, 0.6));
  for (let i = 0; i < 3; i++) { const a = P(-4.5 + i * 1.6, 0.03, 10.6 + i * 0.4), b = P(-3.1 + i * 1.6, 0.04, 10.3 + i * 0.5); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, '#4a4a48')); }
  // the walrus haul-out is not here: low slabs and a broken spar only
  { const a = P(3.0, 0.1, 12.8), b = P(6.4, 0.2, 12.0); raw(line([a, b], K(12) * 0.12 + 2, INK) + line([a, b], K(12) * 0.12, '#2a3038') + BL.rimeEdge([a, b], { w: 2, col: SNOW })); }
}

// ======================================================================== FORE: framing (left only; the stage is kept clear)
layer('fore');
{
  // left: a near upthrust slab of sea ice leaning in from the edge, its face in shadow, its edge toward the light rimed
  // white; a harpoon driven into it with its line trailing away across the bottom
  const sl = [[-10, 30], [26, 0], [58, 130], [62, 300], [50, H + 10], [-10, H + 10]];
  raw(cel(sl, { Z: 4, fill: '#1a2028', band: 10 }) + fillP(sl, S.hatchA(4), 0.4) + BL.rimeEdge([[26, 0], [58, 130], [62, 300]], { w: 5, col: SNOW }) + line([[28, 4], [60, 132], [64, 300]], 2, '#ffffff', 0.5));
  for (let i = 0; i < 5; i++) { const y = 80 + i * 70; raw(line([[0, y], [40, y + 10]], 1.2, '#3a4656', 0.7)); }
  raw(BL.icicles([26, 2], [58, 130], 5, { max: 30, col: RIME }));
  { const a = [50, 150], b = [-10, 110]; raw(line([a, b], 6, INK) + line([a, b], 3.6, '#4a4844') + fillP([[b[0], b[1] - 5], [b[0] + 22, b[1] - 12], [b[0] + 4, b[1] + 6]], '#5a6068') + inkP([[b[0], b[1] - 5], [b[0] + 22, b[1] - 12], [b[0] + 4, b[1] + 6]], 1.2));
    raw(line([a, [66, 260], [40, 380], [80, H + 6]], 3.6, INK) + line([a, [66, 260], [40, 380], [80, H + 6]], 2, '#7a8694')); }
  // the stage's foot: heaved plates banked against the boss's ice at its left and along the bottom, so the boss's own ice
  // grows out of the room's (the boss is mostly beneath the ice)
  raw(plates([[985, H + 6], [990, 420], [1000, 340], [1004, 280]], 12, { size: [26, 62], cols: ['#eef4f8', '#8a9cac', '#2a3440'], rime: SNOW, Z: 6, ink: 1.2 }));
  raw(plates([[960, H + 2], [1200, H], [1490, H + 2]], 16, { size: [30, 58], cols: ['#e4ecf0', '#8a9cac', '#2a3440'], rime: SNOW, Z: 5, ink: 1.2 }));
  // bottom right: broken plates at the stage's foot, low, so the boss's own ice reads in front of them
  raw(wedges([[W - 220, H + 10], [W - 120, H + 6], [W + 20, H + 8]], 8, { size: [14, 36], cols: ['#8a9aaa', '#3e4a58', '#161c24'], rime: SNOW, Z: 3.6 }));
  // storm snow driven hard from the left, across everything
  raw(snowfall(160, { len: 12, slant: 1.8, op: 0.45, col: '#d8e2ea', w: 1.4 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
