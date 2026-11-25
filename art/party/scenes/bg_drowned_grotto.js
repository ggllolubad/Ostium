// World I, the Drowned Kingdom: THE BRINE GROTTO (boss room `brine_grotto`, Mother of Brine), Living Ink, round 2 (g1).
// Lore: "Every siren is her daughter. Every drowned child is hers." She was the harbour's fishwife and midwife, who
// delivered the kingdom's children. This is the sea cave under the harbour wall where the fishwives kept their boats and
// she kept her birthing pool: a black pool under a cleft in the cave roof (a sea-chimney) whose cold light falls straight
// down onto the water where she rises. On the rock shelf where the company stands: the midwives' things the tide has left,
// wicker cradles and a cradle-boat, a line of swaddling strung across the cave, small shoes set on a ledge as offerings,
// nets on poles, a string of drowned gold coins (money). No built architecture: organic curves only.
// Space: natural cave, the pool open on the right (the boss stage: the cleft's light behind her, the cave's curved walls
// framing). Light: a cold glow down the chimney, the most dramatic in the world, its light broken on the black pool.
// Courses: water (salt drips, kelp curtains, barnacles, wet shingle), void (a torn absence through the cave wall).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'I');
const W = 1480, H = 480, ROOM = 'brine_grotto';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2351, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#121a24' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, I = G.I;
const MURK = '#090f14', ROCK = '#3a4448', SALT = '#c8ccc4', GLOW = '#d0e4e4', GOLD = I.GOLD, WATER = '#060a0e';
// the rock shelf in the floor plane (X,Z): the company's side; everything else is the black pool
const SHELF = [[-16, 3.0], [0.4, 3.0], [0.95, 4.2], [0.55, 5.6], [1.0, 6.8], [0.2, 8.0], [-1.6, 9.2], [-4, 10.4], [-8, 12], [-16, 13.5]];
// a salt drip (stalactite) hanging from screen (x,y): uneven, knuckled, a wet bright edge on the left
const drip = (x, y, l0, w0) => { const l = l0 * (1 + R()), w = Math.max(0.8, w0 * 0.45); return `<path d="M${f1(x - w)} ${f1(y)} Q${f1(x - w * 0.6)} ${f1(y + l * 0.5)} ${f1(x + (R() - 0.5) * w * 0.4)} ${f1(y + l)} Q${f1(x + w * 0.7)} ${f1(y + l * 0.45)} ${f1(x + w)} ${f1(y)} Z" fill="${mix(SALT, MURK, 0.6 + R() * 0.2)}" stroke="${INK}" stroke-width="0.7"/><path d="M${f1(x - w * 0.5)} ${f1(y + 1)} L${f1(x - w * 0.15)} ${f1(y + l * 0.7)}" stroke="#eef4f0" stroke-width="0.6" opacity="0.5"/>` + (R() < 0.4 ? `<ellipse cx="${f1(x)}" cy="${f1(y + l + 1.5)}" rx="${f1(w * 0.6)}" ry="${f1(w * 0.8)}" fill="#c8d4d0" opacity="0.6"/>` : ''); };

layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- distance: the cave's back, a hollow vault of rock, faintly lit from the chimney; then the chimney itself
{
  raw(G.rockMass([[-20, 330], [-20, -20], [W + 20, -20], [W + 20, 330]], 30, '#1e262c', { fiss: 8, hop: 0.4, rim: false, round: 0.1 }));
  // the chimney: a tall ragged cleft through the roof right of centre, the sky-water beyond it bright and cold
  const cl = [[1035, -10], [1210, -10], [1195, 40], [1215, 90], [1180, 150], [1150, 205], [1120, 232], [1092, 210], [1060, 160], [1070, 110], [1040, 60]];
  raw(`<path d="${smooth(cl, true, 0.4)}" fill="#e8f2ee"/>`);
  S.DEFS.push(`<clipPath id="grch"><path d="${smooth(cl, true, 0.4)}"/></clipPath>`);
  raw(G.bands([[60, '#d4e6e2'], [120, '#bcd4d0'], [170, '#a4bcba'], [210, '#8aa4a2']], { amp: 5 }).replace(/<path /g, '<path clip-path="url(#grch)" '));
  raw(`<path d="${smooth(cl, true, 0.4)}" fill="none" stroke="${INK}" stroke-width="2.4"/>`);
  // the chimney's walls seen edge-on: lit lips, salt crust, kelp trailing down into the light
  for (let k = 0; k < 6; k++) { const p = cl[1 + Math.floor(R() * 9)]; raw(line([[p[0], p[1]], [p[0] + (R() - 0.5) * 8, p[1] + 30 + R() * 40]], 2.4, '#1a2418', 0.9)); }
  for (let k = 0; k < 12; k++) { const u = R(), x = 1040 + u * 170, y = 30 + Math.sin(u * 3) * 40 + R() * 60; raw(drip(x, y, 6 + R() * 14, 1.6 + R() * 1.4)); }
}
// ---- middle: the cave walls curving round the pool: left wall mass, the right wall mass, a rib of rock between, a void
{
  const L = [[-20, 360], [-20, 40], [60, 20], [180, 60], [300, 120], [420, 190], [520, 250], [600, 300], [640, 330], [700, 345], [-20, 345]];
  raw(G.rockMass(L, 16, ROCK, { fiss: 10, hop: 0.55 }));
  const Rr = [[W + 20, 360], [W + 20, 0], [1280, -10], [1250, 60], [1290, 140], [1310, 210], [1360, 270], [1420, 320], [1440, 345], [W + 20, 345]];
  raw(G.rockMass(Rr, 16, mix(ROCK, MURK, 0.2), { fiss: 6, hop: 0.6 }));
  // a farther rib of rock under the chimney, catching the light on its upper left edges
  const M = [[820, 330], [840, 260], [900, 230], [960, 250], [1010, 240], [1060, 265], [1110, 255], [1170, 280], [1230, 300], [1260, 330]];
  raw(G.rockMass(M, 24, '#46545a', { fiss: 4, hop: 0.45 }));
  raw(line([[840, 262], [900, 232], [960, 252], [1010, 242], [1060, 266]], 1.6, GLOW, 0.5));
  // banded strata and salt crusts running along the walls (curves following the cave)
  for (let k = 0; k < 9; k++) { const y0 = 60 + k * 30, pts = []; for (let x = -10; x < 560 - k * 10; x += 30) pts.push([x, y0 + x * (0.32 + k * 0.02) + Math.sin(x * 0.03 + k) * 5]); raw(line(pts, 1.1, INK, 0.45) + line(pts.map(([x, y]) => [x, y - 2]), 0.8, SALT, 0.18)); }
  for (let k = 0; k < 7; k++) { const y0 = 30 + k * 40, pts = []; for (let x = W + 10; x > 1290 + k * 12; x -= 30) pts.push([x, y0 - (W - x) * 0.25 + Math.sin(x * 0.04 + k) * 4]); raw(line(pts, 1.1, INK, 0.45)); }
  // salt drips from the cave roof edges
  for (let k = 0; k < 7; k++) { const t = R(), x = 60 + t * 520, y = 20 + t * 290 * 0.95; raw(drip(x, y, 8 + R() * 24, 2 + R() * 2.5)); }
  for (let k = 0; k < 6; k++) { const t = R(), x = 1260 + t * 200, y = 60 + (1 - t) * 160; raw(drip(x, y, 6 + R() * 18, 2 + R() * 2)); }
  // kelp curtains hanging from the left wall's overhang
  for (let k = 0; k < 14; k++) { const t = 0.2 + R() * 0.7, x = 60 + t * 500, y = 30 + t * 270; const X = (x - 740) * 16 / 652, Y = 1.2 - (y - 300) * 16 / 652; raw(I.kelp(X, Y, 16, 1.0 + R() * 2.2, { w: 0.1, col: '#141c14' })); }
  // the void: a torn absence in the left wall, the rock simply not there
  raw(BK.tornVoid((s, t) => [-12 + s, t, 16], 2.6, 4.4, 0.9, 0.6, { rot: -0.4, lobes: [[3.6, 0.5, 0.5], [0.4, 0.3, 0.5]], fray: [[3.3, 5, 0.3], [0.3, 3, 0.25]], depth: 0.8, cut: '#1c2428', fissures: 3, violet: true }).svg);
  // a ledge on the left wall with the offerings: small shoes in a row, a string of drowned gold coins hung from a peg
  { const Z = 13, a = P(-9.4, 1.6, Z), b = P(-6.4, 1.7, Z); raw(cel([[a[0], a[1]], [b[0], b[1]], [b[0] + 4, b[1] + 8], [a[0] - 2, a[1] + 9]], { Z, fill: '#3e484c', band: 2 }));
    for (let k = 0; k < 6; k++) { const x = a[0] + 10 + k * (b[0] - a[0] - 20) / 5, y = a[1] - 1 + (b[1] - a[1]) * k / 5, w = 5 + R() * 2; raw(`<path d="M${f1(x - w)} ${f1(y)} Q${f1(x - w)} ${f1(y - 5)} ${f1(x - 1)} ${f1(y - 5)} L${f1(x + w * 0.6)} ${f1(y - 3)} Q${f1(x + w)} ${f1(y - 1)} ${f1(x + w)} ${f1(y)} Z" fill="${['#4a3a2a', '#3a3a3e', '#5a4a3a'][k % 3]}" stroke="${INK}" stroke-width="0.7"/>`); }
    const c0 = P(-7.0, 3.0, Z); let cs = line([[c0[0] - 22, c0[1]], [c0[0], c0[1] + 16], [c0[0] + 22, c0[1]]], 0.8, INK, 1); for (let k = 0; k < 9; k++) { const u = k / 8, x = c0[0] - 22 + 44 * u, y = c0[1] + 16 * Math.sin(u * Math.PI); cs += `<circle cx="${f1(x)}" cy="${f1(y + 2)}" r="2.2" fill="${GOLD}" stroke="${INK}" stroke-width="0.6"/>`; } raw(cs); }
}
// ---- the cold light: shafts straight down from the chimney onto the pool, spreading
raw(G.shaft(1050, 60, 150, 300, -0.12, GLOW, { op: 0.34, fill: 0.12, spread: 70, gap: 4 }) + G.shaft(1090, 60, 70, 300, -0.08, '#f0faf6', { op: 0.3, fill: 0.1, spread: 30, gap: 3 }));
raw(I.motes(120, 40, 360, '#c8dcd8') + I.bubbles(20, 700, 1400, 60, 300, 1.4));
raw(BK.quiet(MURK, 300, 390, { steps: [0.08, 0.1, 0.12, 0.14], hop: 0.1 }));
raw(G.edges(MURK, { l: 200, r: 160, t: 80, steps: [0.14, 0.16, 0.18, 0.2] }));
// ---- the black pool: still, the chimney's light broken on it in a long glade, rings spreading round where she rises
{
  raw(BK.water(-40, 60, 3.0, 60, WATER, { y: 0, n: 300, lite: '#4a5a60', refl: [[1120, 120, '#c8dcd8', 300, 420], [1120, 50, '#f0faf6', 300, 380]] }));
  for (let r = 0.8; r < 6; r += 0.7 + r * 0.1) raw(BK.ripples(...P(4.1, 0, 7.2 + r * 0.3), K(7) * r * 0.6, 1, '#7a9294', 0.4));
  // the shelf: wet rock and shingle; its edge into the water a dark lip with a lit rim; tide pools; pebbles converge
  const sh = SHELF.map(([x, z]) => P(x, 0, z)), d = smooth(sh, true, 0.4);
  raw(`<path d="${d}" fill="#30383c"/><path d="${d}" fill="url(#mottle)" opacity="0.5"/>`);
  const cid = S.id('sh'); raw(`<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`);
  for (let k = 0; k < 420; k++) { const X = -16 + R() * 21, Z = 3.3 + Math.pow(R(), 1.4) * 11, [x, y] = P(X, 0, Z), r = K(Z) * (0.015 + R() * 0.035); raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.3)}" ry="${f1(r * 0.45)}" fill="${tone('#363e42', 0.18)}" stroke="${INK}" stroke-width="${f1(Math.max(0.3, r * 0.15))}" opacity="0.8"/>`); }
  for (const [X, Z, w] of [[-9, 5.0, 1.6], [-2.5, 7.4, 1.4], [-12, 8.5, 2]]) raw(G.puddle(X, Z, w, 0.5, '#0a1218', '#a8c0c0'));
  for (let i = 0; i < 10; i++) { let X = -14 + R() * 16, Z = 3.4; const pts = [P(X, 0, Z)]; for (let k = 0; k < 6; k++) { X += (R() - 0.5) * 0.4 + X * 0.02; Z += 0.8 + R() * 0.6; pts.push(P(X, 0, Z)); } raw(line(pts, 1, INK, 0.5)); }
  raw(S.occBand((s, t) => [-16 + s, 0, 3.2 + t], 22, 1.0, { op: 0.45 }) + '</g>');
  raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + line(sh.slice(1, 8).map(([x, y]) => [x, y - 1.5]), 1, '#9ab0b0', 0.4));
  raw(I.barnacles(...P(2.6, 0, 6.6), 16, 12, 6.6, '#7a7e78'));
}

// ======================================================================== MID: the midwives' things the tide left on the shelf
layer('mid');
{
  // a cradle-boat (a little coracle-cradle of wicker and tarred hide) stranded at the shelf's edge, tipped
  const c = P(1.2, 0.1, 8.6), k = K(8.6); raw(cel([[c[0] - k * 0.5, c[1] - k * 0.2], [c[0] + k * 0.45, c[1] - k * 0.28], [c[0] + k * 0.38, c[1] + k * 0.02], [c[0] - k * 0.42, c[1] + k * 0.06]], { Z: 8.6, fill: '#2e2a22', band: 2, tex: 'url(#mottle)', texOp: 0.5 }));
  for (let j = 1; j < 5; j++) raw(line([[c[0] - k * 0.45 + j * k * 0.18, c[1] - k * 0.22], [c[0] - k * 0.42 + j * k * 0.17, c[1] + k * 0.04]], 0.7, INK, 0.7));
  // a wicker cradle on its side, a hood of rotted linen; a swaddling band trailing into the water
  const c2 = P(-4.6, 0.05, 9.6), k2 = K(9.6); raw(cel([[c2[0] - k2 * 0.35, c2[1]], [c2[0] + k2 * 0.3, c2[1]], [c2[0] + k2 * 0.36, c2[1] - k2 * 0.25], [c2[0] - k2 * 0.3, c2[1] - k2 * 0.3]], { Z: 9.6, fill: '#3a3226', band: 1.5 }) + line([[c2[0] + k2 * 0.3, c2[1] - k2 * 0.1], [c2[0] + k2 * 0.7, c2[1] + 2], [c2[0] + k2 * 1.1, c2[1] - 1]], 2, '#6a6a60', 0.8));
  // nets hung to dry on two poles, sagging, weed in the mesh
  const n0 = P(-9.5, 0, 10.5), n1 = P(-9.5, 2.2, 10.5), m0 = P(-6.5, 0, 11), m1 = P(-6.5, 2.0, 11);
  raw(line([n0, n1], 3, INK, 1) + line([n0, n1], 1.6, '#3a3024', 1) + line([m0, m1], 3, INK, 1) + line([m0, m1], 1.6, '#3a3024', 1));
  let net = ''; for (let j = 0; j < 7; j++) { const y0 = n1[1] + j * 4; net += `M${f1(n1[0])} ${f1(y0)} Q${f1((n1[0] + m1[0]) / 2)} ${f1(y0 + 18 - j)} ${f1(m1[0])} ${f1(m1[1] + j * 4)} `; } for (let j = 0; j < 9; j++) { const x = n1[0] + (m1[0] - n1[0]) * j / 8; net += `M${f1(x)} ${f1(n1[1] + Math.sin(j / 8 * Math.PI) * 14)} l${f1((R() - 0.5) * 3)} ${f1(26 + R() * 10)} `; } raw(`<path d="${net}" stroke="#3a3a34" stroke-width="0.8" fill="none" opacity="0.9"/>`);
  raw(I.kelp(-8, 1.6, 10.7, 0.8, { w: 0.04, col: '#141c14' }));
}

raw(G.barrel(-2.2, 8.4, { side: true, col: '#2e3430', hoop: '#22282a', extra: I.barnacles(...P(-2.2, 0.3, 8.4), 10, 6, 8.4) }));   // scale cue: a fishwife's salt cask
// ======================================================================== FORE: the cave mouth: overhang over the top left, the wall at the left, swaddling line
layer('fore');
{
  const ov = [[-20, -20], [980, -20], [940, 8], [860, 18], [760, 30], [640, 46], [520, 62], [400, 88], [280, 120], [180, 170], [110, 240], [70, 330], [50, 420], [40, 500], [-20, 500]];
  raw(G.rockMass(ov, 3.5, '#141a1e', { fiss: 10, hop: 0.65, rim: false }));
  for (let k = 0; k < 12; k++) { const t = R(), i = 1 + Math.floor(t * 9), A = ov[i], B = ov[i + 1], u = R(), x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u; if (y > 200) continue; raw(drip(x, y - 2, 14 + R() * 30, 2 + R() * 2)); }
  for (let k = 0; k < 7; k++) { const x = 300 + R() * 600, y = 30 + (900 - x) * 0.05; const X = (x - 740) * 3.5 / 652, Y = 1.2 - (y - 300) * 3.5 / 652; raw(I.kelp(X, Y, 3.5, 0.25 + R() * 0.35, { w: 0.04, col: '#0e140e' })); }
  // a line of swaddling strung from the overhang across toward the light: bands and a small shift, drowned grey
  const A = [430, 76], B = [960, 14], sag = 40; raw(G.hang(A, B, sag, 1.2, '#4a4a42'));
  for (const [u, w, h, kind] of [[0.16, 26, 40, 'band'], [0.37, 34, 52, 'shift'], [0.62, 22, 60, 'band'], [0.82, 30, 34, 'cap']]) { const x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u + Math.sin(u * Math.PI) * sag;
    const pts = kind === 'shift' ? [[x - w / 2, y], [x + w / 2, y + 1], [x + w * 0.62, y + h * 0.3], [x + w * 0.4, y + h * 0.32], [x + w * 0.45, y + h], [x + w * 0.1, y + h * 0.9], [x - w * 0.15, y + h + 4], [x - w * 0.45, y + h * 0.95], [x - w * 0.4, y + h * 0.3], [x - w * 0.62, y + h * 0.28]] : kind === 'cap' ? [[x - w / 2, y], [x + w / 2, y], [x + w * 0.35, y + h * 0.8], [x, y + h], [x - w * 0.4, y + h * 0.75]] : [[x - w * 0.3, y], [x + w * 0.3, y], [x + w * 0.25, y + h * 0.6], [x + w * 0.4, y + h], [x + w * 0.05, y + h * 0.95], [x - w * 0.2, y + h * 0.55]];
    raw(cel(pts, { Z: 3.5, fill: ['#4a4e4a', '#545650', '#42464a', '#4e4c46'][Math.floor(u * 4)], band: 3, tex: 'url(#mottle)', texOp: 0.45 }) + line([[x - w * 0.2, y + h * 0.3], [x - w * 0.1, y + h * 0.8]], 0.8, INK, 0.6) + line([[x + w * 0.1, y + h * 0.2], [x + w * 0.15, y + h * 0.7]], 0.8, INK, 0.6)); }
  // barnacled rocks along the bottom
  for (const [cx, sd] of [[90, -1], [W - 40, 1]]) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([cx + sd * (t - 0.5) * 190, H - 10 - Math.sin(t * Math.PI) * (26 + R() * 8)]); } raw(G.rockMass([[cx - 110, H + 4], ...pts, [cx + 110, H + 4]], 3.5, '#10161a', { fiss: 3, hop: 0.6 }) + I.barnacles(cx, H - 20, 40, 14, 3.5, '#4a4e4a')); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, x_to: 1480 } }, null, 1));
console.log(ROOM, 'layers written');
