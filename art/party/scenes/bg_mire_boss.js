// World II, the Rotmire: THE MOTHER'S MERE (boss room `mire_boss`, The Mire Mother), Living Ink, round 2 (group g1).
// Lore: "The fen's oldest drowned head, swollen to the size of a house. The hags call her Mother." She was drowned as an
// offering centuries before the Breaking; the hags tie their lanterns in her reeds. Here at the heart of the fen her head
// rises to the chin out of a wide black mere ringed by the hags' offering posts: tanned bog-oak, notched and carved, hung
// with lanterns and cords. Two great posts and their lintel stand as a gate before her; she fills it. The company comes up
// the old stone causeway, its slabs heaped with offerings (antlers, pots, bound bundles, carved wooden dolls).
// Space: vast open water; the post ring and its gate frame her (boss stage: right 45%). Light: the most dramatic in the
// world: a lurid bile-green afterglow low behind her and scores of amber lanterns round the ring, doubled in the water.
// Shapes: the ring of posts (verticals at every size) and the gate's lintel, lantern garlands sagging between.
// Courses: toxin (bile glow, mould on the posts, toadstools, blistered offerings), water (tanned posts, nothing rots).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'II');
const W = 1480, H = 480, ROOM = 'mire_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2432, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141410' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, II = G.II;
const MURK = '#0c0e0a', BILEG = '#9aa83e', AMB = II.AMBER, WATER = '#0e120c', WY = -0.1;
const fog = G.fogger('#2a3020', 10, 120, 0.7);
const LAMPS = [];
const lamp = (X, Y, Z, s = 1) => { const [x, y] = P(X, Y, Z); LAMPS.push([x, y, Z]); return II.hornLantern(x, y, Math.max(2.2, K(Z) * 0.22 * s), { r: 4.5, gop: 0.24 }); };

layer('far');
// ---- the sky: heavy dark cloud above; low behind her a lurid bile-green afterglow in stepped bands (the light focus)
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
raw(G.sky([[0, '#121410'], [0.25, '#171a12'], [0.4, '#1e2214'], [0.5, '#2a3018'], [0.56, '#3e4820'], [0.6, '#5e6a28'], [0.63, '#8a9838'], [1, '#2a3018']]));   // polish: smooth gradient
{ // the afterglow concentrated behind the gate, stepped ragged lobes
  S.DEFS.push(`<radialGradient id="aglow"><stop offset="0" stop-color="#d4e070" stop-opacity="0.75"/><stop offset="0.3" stop-color="#9aac3c" stop-opacity="0.5"/><stop offset="0.7" stop-color="#5a6624" stop-opacity="0.2"/><stop offset="1" stop-color="#3a4418" stop-opacity="0"/></radialGradient>`); raw(S.GLOW(`<ellipse cx="1110" cy="298" rx="620" ry="170" fill="url(#aglow)"/>`));   // polish: a smooth afterglow
  // cloud masses: dark, low-bellied, lit along their lower edges by the glow; each its own shape
  for (let i = 0; i < 11; i++) { const cy = 40 + R() * 190, cx = R() * W, w = 160 + R() * 420, h = 22 + R() * 34, col = mix('#101209', '#262c16', cy / 240); raw(G.softCloud(cx, cy, w, h, col, { op: 0.85, lit: mix(BILEG, col, 0.55), dark: '#0a0b07' })); }   // polish: soft cloud masses lit from below by the glow
}
// ---- the far fen at the horizon: reed beds, the far side of the ring's posts small against the glow
{
  raw(`<path d="${smooth([[-10, 300], ...Array.from({ length: 40 }, (_, i) => [i * 38, 297 - R() * 5]), [W + 10, 300], [W + 10, 312], [-10, 312]], true, 0.6)}" fill="#14160e"/>`);
  let rb = ''; for (let i = 0; i < 800; i++) { const x = R() * W, y = 298 + R() * 8, h = 2 + R() * 7; rb += `M${f1(x)} ${f1(y)} l${f1((R() - 0.3) * 1.5)} ${f1(-h)} `; } raw(`<path d="${rb}" stroke="#0c0e08" stroke-width="0.7" opacity="0.8"/>`);
}
raw(BK.water(-90, 90, 3.0, 150, WATER, { y: WY, n: 320, lite: '#4a5428', refl: [[1110, 300, '#8a9838', 302, 330], [1110, 160, '#c8d468', 302, 316]] }));
// ---- the ring of offering posts round the mere (centre X 9, Z 30, radius 15): far ones small against the glow, near ones
// tall; each notched or carved; lantern garlands sagging between neighbours; lanterns doubled in the water
{
  const posts = []; for (let k = 0; k < 22; k++) { const a = k / 22 * 6.283 + 0.1, X = 9 + Math.cos(a) * 15 * 1.3, Z = 30 + Math.sin(a) * 15; if (Z < 13) continue; posts.push([X, Z, 3 + R() * 3.5]); }
  posts.sort((a, b) => b[1] - a[1]);
  for (const [X, Z, h] of posts) { raw(II.post(X, WY, h, Z, 0.45, fog('#1a140c', Z), { carve: 5, snap: R() < 0.3, lean: (R() - 0.5) * 0.15, shelf: R() < 0.5 ? 0.5 : 0 })); const rp = P(X, WY, Z), rt = P(X, h, Z); raw(line([[rp[0], rp[1]], [rp[0], 2 * rp[1] - rt[1]]], Math.max(1.2, K(Z) * 0.4), '#060805', 0.6)); raw(lamp(X + 0.3, h * 0.7, Z - 0.2)); if (R() < 0.6) raw(lamp(X - 0.3, h * 0.4, Z - 0.2, 0.8)); }
  // garlands of cords and small lanterns between the far posts, sagging
  for (let k = 0; k < posts.length - 1; k++) { const [X0, Z0, h0] = posts[k], [X1, Z1, h1] = posts[k + 1]; if (Math.abs(X0 - X1) > 14 || R() < 0.3) continue; const A = P(X0, h0 * 0.85, Z0), B = P(X1, h1 * 0.85, Z1); raw(G.hang(A, B, K((Z0 + Z1) / 2) * 0.6, 0.6, '#3a3020')); const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + K((Z0 + Z1) / 2) * 0.45]; const [x, y] = m; LAMPS.push([x, y, Z0]); raw(II.hornLantern(x, y + 4, Math.max(2, K(Z0) * 0.16), { r: 4, gop: 0.2 })); }
}
// ---- the gate before her: two great bog-oak posts and a lintel, carved with notches and rings, hung with lanterns,
// cords and bundles; she fills the opening (the boss stage)
{
  const Zg = 16;
  for (const [X, lean] of [[1.6, -0.05], [17.4, 0.08]]) { raw(II.post(X, WY, 9, Zg, 1.0, '#1c160e', { carve: 9, lean, shelf: 0.62 }) + hatch3((s2, t) => [X - 0.5 + s2, t, Zg], 0, 1.0, 0, 9, 0.8, { op: 0.4 }));
    const rp = P(X, WY, Zg), rt = P(X, 6, Zg); raw(line([[rp[0], rp[1]], [rp[0] + 3, 2 * rp[1] - rt[1]]], K(Zg) * 0.9, '#060805', 0.7));
    for (let k = 0; k < 4; k++) raw(lamp(X + (X < 9 ? 0.6 : -0.6), 2 + k * 1.6, Zg - 0.4, 1.2));
    for (let k = 0; k < 3; k++) { const c = P(X, 2.5 + k * 2.2, Zg - 0.5), w = K(Zg) * 0.55; raw(`<path d="M${f1(c[0] - w)} ${f1(c[1])} q${f1(w)} ${f1(w * 0.25)} ${f1(w * 2)} 0" stroke="${INK}" stroke-width="3.2" fill="none"/><path d="M${f1(c[0] - w)} ${f1(c[1])} q${f1(w)} ${f1(w * 0.25)} ${f1(w * 2)} 0" stroke="#7a6a48" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>`); }
    raw(BK.toadstools(...P(X + 0.3, 0.6, Zg - 0.5), K(Zg) * 0.18, 4, '#b0a070')); }
  // the lintel, partly above the frame: a split bog-oak beam lashed on, bundles and charms hanging from it
  const l0 = P(0.4, 8.3, Zg), l1 = P(18.6, 8.6, Zg); raw(cel([[l0[0], l0[1]], [l1[0], l1[1]], [l1[0], l1[1] + K(Zg) * 0.8], [l0[0], l0[1] + K(Zg) * 0.75]], { Z: Zg, fill: '#1c160e', tex: 'url(#mottle)', texOp: 0.5, band: 6 }));
  for (let k = 0; k < 9; k++) { const u = 0.08 + k * 0.105, x = l0[0] + (l1[0] - l0[0]) * u, y = l0[1] + (l1[1] - l0[1]) * u + K(Zg) * 0.75, l = 20 + R() * 60; raw(line([[x, y], [x + (R() - 0.5) * 4, y + l]], 1.2, '#4a3a26', 0.9)); if (k % 3 === 0) { LAMPS.push([x, y + l, Zg]); raw(II.hornLantern(x, y + l + 6, 7, { r: 4, gop: 0.24 })); } else raw(cel([[x - 6, y + l], [x + 6, y + l], [x + 4, y + l + 14], [x - 5, y + l + 12]], { Z: Zg, fill: '#3a3020', band: 2 })); }
}
// ---- the lanterns doubled in the still water: broken amber streaks under each
for (const [x, y, Z] of LAMPS) { if (y > 300) continue; const yr = 300 + (300 - y) * 0.9; let r = ''; for (let yy = 302; yy < Math.min(400, yr + 6); yy += 2 + R() * 3) { const ww = Math.max(2, K(Z) * (0.1 + R() * 0.3)); r += `M${f1(x - ww / 2 + (R() - 0.5) * 3)} ${f1(yy)} l${f1(ww)} 0 `; } raw(S.GLOW(`<path d="${r}" stroke="${AMB}" stroke-width="1" opacity="0.4"/>`)); }
raw(G.softBank(-10, W + 10, 302, 16, { col: '#5a6430', op: 0.2, ph: 2, below: 6 }));
// lantern gnats in the air over the water
{ let g = ''; for (let i = 0; i < 200; i++) g += `<circle cx="${f1(R() * W)}" cy="${f1(80 + R() * 230)}" r="${f1(0.5 + R() * 0.7)}" fill="${R() < 0.25 ? AMB : '#0a0a06'}" opacity="0.7"/>`; raw(g); }
raw(BK.quiet(MURK, 300, 390, { steps: [0.06, 0.08, 0.1, 0.12], hop: 0.08 }));
raw(G.edges(MURK, { l: 240, r: 60, t: 60, steps: [0.16, 0.18, 0.2, 0.22] }));
// ---- the stone causeway: big flat slabs laid across the mere toward the gate, water lapping their edges; offerings on them
{
  const half = z => 4.6 - (z - 3) * 0.26, cx = z => -3 + (z - 3) * 0.25;
  const SL = []; for (let i = 0; i < 70; i++) { const z = 3 + Math.pow(R(), 1.2) * 10.5, x0 = cx(z) - half(z) - 3 + R() * (half(z) * 2 + 3); SL.push([z, x0]); } SL.sort((a, b) => b[0] - a[0]); for (const [z, x] of SL) { { const w = 0.7 + R() * 1.6, d = 0.45 + R() * 0.55, tilt = R() < 0.2 ? 0.12 : 0; const q = [[x + 0.05, WY + 0.08, z + d], [x + w - 0.05, WY + 0.08 + tilt, z + d - (R() - 0.5) * 0.3], [x + w - 0.05, WY + 0.08 + tilt, z + (R() - 0.5) * 0.2], [x + 0.05, WY + 0.08, z]].map(p => P(...p));
      raw(cel(chip(q, 0.5), { Z: z, fill: tone('#3a3a30', 0.2), tex: 'url(#mottle)', texOp: 0.45, band: Math.max(0.8, K(z) * 0.03), inkW: 0.6, heavy: 1 })); if (R() < 0.25) raw(BK.blisters(...P(x + w / 2, WY + 0.09, z + d / 2), K(z) * 0.2, 4, II.BILE, { size: Math.max(0.8, K(z) * 0.02) })); } }
  // the slabs' edges into the water: wet dark lips; ripples
  for (let k = 0; k < 8; k++) { const z = 4 + k * 1.2, c = P(cx(z) + half(z) + 0.3, WY, z); raw(BK.ripples(c[0], c[1], K(z) * 0.8, 2, '#4a5428', 0.4)); }
  raw(S.occBand((s, t) => [-14 + s, WY + 0.08, 3 + t], 26, 1.0, { op: 0.4 }));
}

// ======================================================================== MID: offerings heaped on the causeway behind the fighters
layer('mid');
{
  const Z = 10.2;
  // antlers, a pot, bound bundles and carved wooden dolls, heaped low by the causeway's edge
  for (const [X, kind] of [[-4.8, 'pot'], [-3.6, 'bundle'], [-2.4, 'doll'], [0.4, 'antler'], [1.4, 'bundle'], [2.6, 'doll'], [-6.2, 'antler']]) { const c = P(X, WY + 0.08, Z + (R() - 0.5)), k = K(Z);
    if (kind === 'pot') raw(cel([[c[0] - k * 0.16, c[1]], [c[0] + k * 0.16, c[1]], [c[0] + k * 0.2, c[1] - k * 0.2], [c[0] + k * 0.1, c[1] - k * 0.32], [c[0] - k * 0.1, c[1] - k * 0.32], [c[0] - k * 0.2, c[1] - k * 0.2]], { Z, fill: '#3a2a1a', band: 1 }));
    if (kind === 'bundle') { raw(cel([[c[0] - k * 0.25, c[1]], [c[0] + k * 0.25, c[1]], [c[0] + k * 0.2, c[1] - k * 0.2], [c[0] - k * 0.22, c[1] - k * 0.22]], { Z, fill: '#2e2a1c', band: 1 }) + line([[c[0], c[1]], [c[0] + 1, c[1] - k * 0.22]], 1.2, '#7a6a48', 0.9)); }
    if (kind === 'doll') raw(cel([[c[0] - k * 0.05, c[1]], [c[0] + k * 0.05, c[1]], [c[0] + k * 0.06, c[1] - k * 0.35], [c[0] + k * 0.08, c[1] - k * 0.42], [c[0], c[1] - k * 0.5], [c[0] - k * 0.08, c[1] - k * 0.42], [c[0] - k * 0.06, c[1] - k * 0.35]], { Z, fill: '#3a2c1a', band: 1 }));
    if (kind === 'antler') { const pts = [[c[0] - k * 0.3, c[1]], [c[0] - k * 0.1, c[1] - k * 0.15], [c[0] + k * 0.15, c[1] - k * 0.22], [c[0] + k * 0.32, c[1] - k * 0.18]]; raw(line(pts, 3, INK, 1) + line(pts, 1.6, '#8a8268', 1)); for (let j = 0; j < 3; j++) { const p = pts[1 + j]; raw(line([p, [p[0] + 2, p[1] - k * 0.12]], 2.6, INK, 1) + line([p, [p[0] + 2, p[1] - k * 0.12]], 1.2, '#8a8268', 1)); } } }
  raw(BK.toadstools(...P(-1, WY + 0.08, 10), K(10) * 0.1, 5, '#a09060'));
}

raw(G.barrel(-1.6, 9.8, { Y: WY + 0.08, col: '#2e2618', hoop: '#1a1a16' }));   // scale cue: an offering cask
// ======================================================================== FORE: an offering pole at the left edge, a lantern garland across the top left
layer('fore');
{
  const pb = P(-2.9, WY, 3.0), pt = [pb[0] + 8, -10]; raw(line([pb, pt], 18, INK, 1) + line([pb, pt], 13, '#1a140c', 1) + line([[pb[0] - 3, pb[1]], [pt[0] - 3, pt[1]]], 2, '#3a2c1c', 0.6));
  for (let k = 0; k < 6; k++) { const y = 60 + k * 50; raw(`<path d="M${f1(pb[0] - 6)} ${f1(y)} q8 6 16 0" stroke="${INK}" stroke-width="3" fill="none"/>`); }
  const A = [pt[0] - 2, 40], B = [700, -6]; raw(G.hang(A, B, 60, 1.4, '#3a3020'));
  for (const u of [0.22, 0.48, 0.74]) { const x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u + Math.sin(u * Math.PI) * 60; raw(II.hornLantern(x, y + 26, 13, { r: 4, gop: 0.24 })); }
  for (const u of [0.1, 0.35, 0.6, 0.86]) { const x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u + Math.sin(u * Math.PI) * 60; let c = line([[x, y], [x + 1, y + 30]], 0.8, '#8a7a58', 1); for (let j = 0; j < 4; j++) c += `<path d="M${f1(x)} ${f1(y + 6 + j * 6)} l${f1(4 + R() * 2)} 2" stroke="#d8d0b0" stroke-width="1.6" stroke-linecap="round"/>`; raw(c); }
  for (const [x, n] of [[30, 20], [W - 40, 22], [W - 140, 10]]) raw(II.reeds(x, H + 4, 80 + R() * 40, n, '#1e2214', { heads: 0.3 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, x_to: 1480 } }, null, 1));
console.log(ROOM, 'layers written');
