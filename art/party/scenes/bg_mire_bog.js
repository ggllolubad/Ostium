// World II, the Rotmire: THE PEAT BOG (room key `mire_bog`), Living Ink, polish round (group g1; replaces the round 2
// "peat cutting" trench on Cole's note). The open moss away from the stilt villages: wet hummocky bog to the horizon,
// eroded peat hags standing up out of it with black pools between them, cut turf stacked to dry in clamps, the old timber
// trackway winding out across it on its posts with a little bridge over a channel; cotton-grass, sphagnum, sedge. The bog
// keeps everything it is given: a tanned face and hand show in a hag's eroded face, a body lies under a pool's skin.
// Encounters: "The Sunken Path" (bog bodies, leeches), "The Peat Cutting" (bog body, fen hag, mire toad), "Under the
// Bridge" (leeches, bog troll).
// Space: open exterior, flat and wide, low horizon, no walls. Light: pale foggy daylight, the sun a haze low behind the
// middle (light key). Shapes: the hags' low broken banks, the trackway's line of posts, flat pools; horizontals.
// Courses: toxin (bile scum, toadstools, mould on the turf), water (tanned bodies, black pools, nothing rots).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'II');
const W = 1480, H = 480, ROOM = 'mire_bog';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2442, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1c1a10' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, II = G.II;
const FOG = '#b4b8a4', MURK = '#24261a', SPH = '#6a6a34', PEATC = '#2e2216';
const fog = G.fogger(FOG, 8, 90, 0.85);
const SUNX = 820, SUNY = 214;

// cotton-grass: thin stalks with white tufted heads
const cotton = (x, y, h, n) => { let s = ''; for (let i = 0; i < n; i++) { const dx = (R() - 0.5) * h * 0.6, hh = h * (0.6 + R() * 0.5), tip = [x + dx + (R() - 0.5) * h * 0.2, y - hh]; s += line([[x + dx * 0.3, y], tip], 0.6, '#3a3a22', 0.9) + `<ellipse cx="${f1(tip[0])}" cy="${f1(tip[1] - h * 0.04)}" rx="${f1(Math.max(0.7, h * 0.035))}" ry="${f1(Math.max(0.9, h * 0.05))}" fill="#dcdcca" stroke="${INK}" stroke-width="0.35"/>`; } return s; };
// a peat hag: an eroded island of peat standing above the bog, its top an irregular sward overhanging, its near face a
// steep dark bank with strata and roots; o.body: a tanned face and hand in the face
function hag(X, Z, w, d, h, o = {}) {
  const top = [], n = 16; for (let k = 0; k < n; k++) { const a = k / n * 6.283, m = 0.75 + R() * 0.35 + 0.1 * Math.sin(a * 3 + X); top.push([X + Math.cos(a) * w / 2 * m, Z + Math.sin(a) * d / 2 * m]); }
  const front = top.filter(([, z]) => z <= Z + d * 0.1).sort((a, b) => a[0] - b[0]);
  const ft = front.map(([x, z]) => P(x, h * (0.7 + R() * 0.4), z)), fb = front.map(([x, z]) => P(x + (R() - 0.5) * 0.2, 0, z - 0.15 - R() * 0.2)).reverse();
  let s = `<path d="${smooth([...ft, ...fb], true, 0.3)}" fill="${fog(PEATC, Z)}"/><path d="${smooth([...ft, ...fb], true, 0.3)}" fill="url(#mottle)" opacity="0.55"/>`;
  const cid = S.id('hg'); s += `<clipPath id="${cid}"><path d="${smooth([...ft, ...fb], true, 0.3)}"/></clipPath><g clip-path="url(#${cid})">`;
  for (const [t, c] of [[0.25, '#3a2a1a'], [0.55, '#4a3622'], [0.8, '#5a462c']]) s += line(front.map(([x, z]) => P(x, h * t + (R() - 0.5) * 0.05, z - 0.05)), Math.max(1, K(Z) * 0.08), fog(c, Z), 0.6);
  s += `<path d="${smooth([...ft, ...fb], true, 0.3)}" fill="${S.hatchA(Z)}" opacity="0.45"/>`;
  for (let k = 0; k < 6; k++) { const i = Math.floor(R() * (ft.length - 1)), a = ft[i], l = K(Z) * (0.15 + R() * 0.3); s += line([a, [a[0] + 2, a[1] + l], [a[0] - 1, a[1] + l * 1.6]], Math.max(0.5, K(Z) * 0.012), '#1e140c', 0.8); }
  if (o.body) { const i = Math.floor(ft.length / 2), c = [(ft[i][0] + fb[fb.length - 1 - i][0]) / 2, (ft[i][1] * 0.6 + fb[fb.length - 1 - i][1] * 0.4)]; s += II.peatBody(c[0], c[1], K(Z), 'face', fog(II.TAN, Z, 0.6)) + II.peatBody(c[0] + K(Z) * 0.45, c[1] + K(Z) * 0.1, K(Z), 'hand', fog(II.TAN, Z, 0.6)); }
  s += `</g><path d="${smooth([...ft, ...fb], true, 0.3)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.6, K(Z) * 0.025))}"/>`;
  // the top sward: sedge and heather overhanging the edge, sphagnum, cotton-grass
  const tp = top.map(([x, z]) => P(x, h, z)); s += `<path d="${smooth(tp, true, 0.4)}" fill="${fog(SPH, Z)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, K(Z) * 0.02))}"/><path d="${smooth(tp, true, 0.4)}" fill="url(#mottle)" opacity="0.5"/>`;
  { const lip = ft.map(([x, y]) => [x + (R() - 0.5) * 2, y + K(Z) * (0.1 + R() * 0.12)]); s += `<path d="${smooth([...ft.map(([x, y]) => [x, y - K(Z) * 0.04]), ...lip.slice().reverse()], true, 0.4)}" fill="${fog('#3a3a1e', Z)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, K(Z) * 0.02))}"/>`;
    { const xs = lip.map(p => p[0]), yl = lip.reduce((a, p) => a + p[1], 0) / lip.length; s += require('./materials_v2')(S).hangRoots(Math.min(...xs) + 2, Math.max(...xs) - 2, yl, Z, { n: Math.max(4, Math.round(w * 1.5)), len: K(Z) * 0.35, w: Math.max(0.8, K(Z) * 0.025), col: '#2a1e12', depth: 1, seed: Math.round(X * 31 + Z * 7) + 3 }); }   // materials v2 roots
    if (o.cut) { const fx0 = front[0][0], fx1 = front[front.length - 1][0]; for (let x = fx0 + 0.15; x < fx1 - 0.1; x += 0.12 + R() * 0.06) { const A = P(x, h * (0.15 + R() * 0.1), Z - 0.2), B = P(x, h * (0.6 + R() * 0.15), Z - 0.2); s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.6" opacity="0.4"/>`; } } }
  for (let k = 0; k < Math.max(3, w * 2); k++) { const [x, z] = top[Math.floor(R() * top.length)], c = P(X + (x - X) * R(), h, Z + (z - Z) * R()); s += II.reeds(c[0], c[1], K(Z) * (0.25 + R() * 0.25), 3, fog(R() < 0.5 ? '#5a5a36' : '#6a5a34', Z), { heads: 0 }); }
  for (let k = 0; k < w; k++) { const c = P(X + (R() - 0.5) * w * 0.7, h, Z + (R() - 0.5) * d * 0.5); s += cotton(c[0], c[1], K(Z) * 0.35, 3); }
  if (R() < 0.5) { const c = P(X + (R() - 0.5) * w * 0.4, h, Z); s += BK.toadstools(c[0], c[1], Math.max(1.5, K(Z) * 0.07), 3, fog('#b0a070', Z)); }
  return s;
}
// a black bog pool in the floor plane: dark, the pale sky lying on it in broken strokes, a scum skin, a rim of sphagnum
function pool(X, Z, w, d, o = {}) {
  const pts = []; for (let k = 0; k < 18; k++) { const a = k / 18 * 6.283, m = 0.75 + R() * 0.35; pts.push(P(X + Math.cos(a) * w / 2 * m, 0.002, Z + Math.sin(a) * d / 2 * m)); }
  let s = `<path d="${smooth(pts, true, 0.5)}" fill="${fog('#3a4234', Z, 0.6)}" stroke="${fog('#4a4a2c', Z)}" stroke-width="${f1(Math.max(1, K(Z) * 0.08))}"/>`;
  const c = P(X, 0.002, Z), k = K(Z); for (let i = 0; i < 10 + w * 4; i++) { const yy = c[1] + (R() - 0.5) * k * d * 0.3, ww = k * w * (0.1 + R() * 0.35); s += `<path d="M${f1(c[0] - ww / 2 + (R() - 0.5) * k * w * 0.5)} ${f1(yy)} l${f1(ww)} 0" stroke="${R() < 0.6 ? '#d8dac8' : '#1a1e14'}" stroke-width="${f1(Math.max(0.6, k * 0.012))}" opacity="${f1(0.3 + R() * 0.4)}"/>`; }
  if (o.scum) s += `<ellipse cx="${f1(c[0] + k * w * 0.15)}" cy="${f1(c[1])}" rx="${f1(k * w * 0.18)}" ry="${f1(k * d * 0.05)}" fill="${II.BILE}" opacity="0.4"/>`;
  if (o.body) { const b = P(X - w * 0.1, 0.004, Z); s += `<path d="${smooth([[b[0] - k * 0.8, b[1]], [b[0] - k * 0.3, b[1] - k * 0.05], [b[0] + k * 0.5, b[1] - k * 0.04], [b[0] + k * 0.7, b[1] + k * 0.02], [b[0], b[1] + k * 0.06]], true, 0.5)}" fill="${II.TAN}" opacity="0.5" stroke="${INK}" stroke-width="0.6" stroke-opacity="0.5"/>`; }
  return s;
}
// a turf clamp: turves stacked crosswise into a low ridge to dry, mould-furred, its top capped with sods
function clamp(X, Z, l, o = {}) {
  let s = ''; const rows = 3 + Math.floor(R() * 2);
  for (let r = 0; r < rows; r++) for (let k = 0; k < Math.round(l / 0.38) - r; k++) { const x0 = X + k * 0.38 + r * 0.19, y = r * 0.17, q = [P(x0, y, Z), P(x0 + 0.36, y, Z), P(x0 + 0.36, y + 0.16, Z), P(x0, y + 0.16, Z)]; s += cel(chip(q, 0.5), { Z, fill: fog(tone('#3a2a1a', 0.25), Z), band: 0.7, tex: 'url(#mottle)', texOp: 0.5, inkW: Math.max(0.4, K(Z) * 0.008) }); }
  return s + `<path d="${pp([[X, 0, Z], [X + l, 0, Z], [X + l, 0, Z + 0.8], [X, 0, Z + 0.8]])}" fill="${fog('#2a2014', Z)}" opacity="0.5"/>`;
}

layer('far');
// ---- the sky: a smooth pale fog gradient, the sun a haze low behind the middle, soft cloud masses
raw(`<rect width="${W}" height="${H}" fill="#8e9282"/>`);
raw(G.sky([[0, '#7c806c'], [0.3, '#90947e'], [0.5, '#a6aa94'], [0.62, '#bcbea8'], [0.7, '#c8cab4'], [1, '#9a9c86']]));
raw(S.GLOW(`<ellipse cx="${SUNX}" cy="${SUNY}" rx="240" ry="120" fill="url(#sunh)"/>`)); S.DEFS.push(`<radialGradient id="sunh"><stop offset="0" stop-color="#f4f4e4" stop-opacity="0.85"/><stop offset="0.3" stop-color="#e4e6d2" stop-opacity="0.4"/><stop offset="1" stop-color="#d8dac8" stop-opacity="0"/></radialGradient>`);
raw(`<circle cx="${SUNX}" cy="${SUNY}" r="12" fill="#f6f6ea" opacity="0.85"/>`);
for (let i = 0; i < 8; i++) { const cy = 40 + R() * 150, cx = R() * W, w = 160 + R() * 380, h = 24 + R() * 40; raw(G.softCloud(cx, cy, w, h, mix('#70745e', '#a4a892', cy / 200), { op: 0.7, lit: '#d4d6c4', dark: '#5e6250' })); }
// ---- distance: the flat bog to the horizon: low hummock lines in layers, a far row of turf clamps, stunted birches, a
// line of the hags' marker posts, mist lying on it
{
  for (const [y, c, a] of [[298, '#5e604a', 3], [302, '#4e5038', 5], [308, '#3e3e2a', 7]]) raw(`<path d="${smooth([[-10, y + 10], ...Array.from({ length: 34 }, (_, i) => [i * 45, y - R() * a - Math.sin(i * 0.9) * a * 0.5]), [W + 10, y + 10], [W + 10, 330], [-10, 330]], true, 0.6)}" fill="${c}"/>`);
  for (const [X, Z] of [[-38, 70], [-30, 62], [26, 66], [40, 74], [55, 80]]) { const t = G.otree(X, -0.3, Z, 3 + R() * 2.5, { kind: 'birch', col: fog('#8a8a7a', Z), roots: false }); raw(t.svg); }
  for (let i = 0; i < 9; i++) { const X = -30 + i * 7.5 + R() * 3, Z = 55 + R() * 15; raw(clamp(X, Z, 2 + R() * 2)); }
  for (let i = 0; i < 7; i++) { const X = 6 + i * 2.8, Z = 30 + i * 6; raw(II.post(X, 0, 1.4, Z, 0.12, fog('#1e1810', Z))); }
  raw(G.softBank(-10, W + 10, 300, 16, { col: '#c8cab6', op: 0.32, below: 8 }));
}
raw(BK.quiet(MURK, 300, 390, { steps: [0.04, 0.05, 0.06, 0.08], hop: 0.06 }));
// ---- the bog itself (floor plane Y 0, Z 3 to the horizon): sphagnum and sedge, hummocks, worn wet hollows
{
  const at = (s2, t) => [-60 + s2, 0, 3 + t];
  raw(`<path d="${pp([at(0, 0), at(120, 0), at(120, 140), at(0, 140)])}" fill="#4a4a2c"/><path d="${pp([at(0, 0), at(120, 0), at(120, 140), at(0, 140)])}" fill="url(#mottle)" opacity="0.6"/>`);
  for (const [z1, op] of [[60, 0.22], [35, 0.18], [22, 0.14], [14, 0.1]]) raw(`<path d="${pp([at(0, z1 - 3), at(120, z1 - 3), at(120, 140), at(0, 140)])}" fill="${FOG}" opacity="${op}"/>`);
  // hummocks: low mounds of sphagnum and sedge, everywhere, smaller and paler with distance
  for (let i = 0; i < 160; i++) { const Z = 3.5 + Math.pow(R(), 1.6) * 45, X = -30 + R() * 60, k = K(Z), c = P(X, 0, Z), w = k * (0.4 + R() * 0.6), h = k * (0.1 + R() * 0.15);
    raw(`<path d="${smooth([[c[0] - w, c[1]], [c[0] - w * (0.5 + R() * 0.3), c[1] - h * (0.6 + R() * 0.4)], [c[0] + (R() - 0.5) * w * 0.4, c[1] - h], [c[0] + w * (0.5 + R() * 0.3), c[1] - h * (0.5 + R() * 0.4)], [c[0] + w, c[1]], [c[0] + w * 0.3, c[1] + h * 0.15], [c[0] - w * 0.4, c[1] + h * 0.12]], true, 0.5)}" fill="${fog(R() < 0.5 ? '#56562e' : '#4e4a2a', Z)}" opacity="0.9"/>` + line([[c[0] - w * 0.6, c[1] - h * 0.7], [c[0], c[1] - h * 1.02], [c[0] + w * 0.5, c[1] - h * 0.75]], Math.max(0.6, k * 0.015), fog('#7a7a46', Z), 0.5));
    if (R() < 0.3) raw(II.reeds(c[0], c[1] - h * 0.5, k * 0.3, 3, fog('#5a5a36', Z), { heads: 0 })); if (R() < 0.1) raw(cotton(c[0], c[1] - h, k * 0.35, 2)); }
}
// ---- the middle: peat hags standing out of the bog, black pools between them, turf clamps, the trackway and its bridge
{
  const T = [];
  for (const [X, Z, w, d, h, o] of [[-8.8, 10.6, 6.5, 2.4, 1.9, {}], [9.5, 12.8, 4.5, 2, 1.45, { cut: true, body: true }], [-14, 22, 7, 3, 1.6, { body: true }], [-4, 30, 5, 2.5, 1.2, {}], [9, 26, 6, 2.8, 1.8, {}], [18, 19, 5, 2.4, 1.4, {}], [-22, 34, 6, 3, 1.3, {}], [24, 36, 7, 3, 1.5, {}], [-9, 44, 6, 2.6, 1.1, {}], [3, 17.5, 3.5, 1.6, 0.9, {}], [-30, 26, 5, 2, 1.0, {}], [32, 28, 6, 2.4, 1.2, {}], [-1, 52, 8, 3, 1.0, {}]]) T.push([Z, () => hag(X, Z, w, d, h, o)]);
  for (const [X, Z, w, d, o] of [[-6, 16, 5, 1.6, { scum: true }], [5, 21, 8, 2.4, { body: true }], [-16, 27, 5, 1.8, {}], [14, 30, 9, 2.6, { scum: true }], [-2, 37, 12, 3, {}], [-20, 15, 3, 1, {}], [1, 14.5, 2, 0.6, {}], [20, 24, 4, 1.2, {}], [-26, 40, 10, 2.5, {}], [12, 46, 14, 3, {}]]) T.push([Z + 0.01, () => pool(X, Z, w, d, o)]);
  for (const [X, Z, l] of [[-11, 13, 2.4], [6.5, 12.5, 1.9], [12, 17, 2.6], [-19, 19, 2.2], [-3.6, 13.6, 2.2], [-3.4, 15.0, 2.6], [-3.0, 16.4, 2.0], [1.2, 19.5, 2.4], [1.6, 21, 2.0], [-12, 24, 2.8]]) T.push([Z, () => clamp(X, Z, l)]);   // clamps in rows by the track
  for (const [X, Z, h] of [[-19, 18, 4.2], [-17.5, 19.5, 3.0], [14, 21, 3.6], [22, 29, 4.4], [-6, 26, 3.2], [27, 33, 3.0]]) T.push([Z + 0.02, () => G.otree(X, 0, Z, h, { kind: 'birch', col: fog('#c8c4b4', Z), lean: (R() - 0.5) * 0.3 }).svg]);   // stunted birches, rooted
  for (const [x0, x1, y, h] of [[300, 900, 312, 8], [700, 1300, 318, 10], [-20, 500, 322, 9], [1000, 1500, 309, 7]]) T.push([40 - y / 20, () => G.softBank(x0, x1, y, h, { col: '#d0d2c0', op: 0.35, below: 4 })]);   // mist in the hollows
  // the trackway: planks laid across split rails on short posts, winding out from the near left into the bog
  const path = []; for (let z = 9; z < 60; z += 0.7) path.push([-6 + Math.sin(z * 0.12) * 4 + (z - 9) * 0.18, z]);
  for (let i = path.length - 2; i >= 0; i--) { const [x, z] = path[i], [x2, z2] = path[i + 1]; T.push([z, () => { const y = 0.35; const q = [P(x - 0.6, y, z), P(x + 0.6, y, z), P(x2 + 0.6, y, z2), P(x2 - 0.6, y, z2)]; let s2 = cel(q, { Z: z, fill: fog(tone('#4a3a26', 0.15), z), band: 0.6, inkW: Math.max(0.4, K(z) * 0.01), hi: false }); if (i % 2 === 0) s2 += II.post(x - 0.55, -0.1, y, z, 0.1, fog('#2a2016', z)) + II.post(x + 0.55, -0.1, y, z, 0.1, fog('#2a2016', z)); return s2; }]); }
  // the little bridge where the trackway crosses a channel: handrails, the deck humped, posts deep in black mud
  T.push([14.2, () => { const Z = 14, y = 0.6, xb = path.find(([, z]) => z >= 14)[0]; let s2 = ''; for (const dz of [0, 1.4]) s2 += II.post(xb - 0.7, -0.4, y + 0.9, Z + dz, 0.16, fog('#1e1810', Z)) + II.post(xb + 0.7, -0.4, y + 0.9, Z + dz, 0.16, fog('#1e1810', Z));
    s2 += line([P(xb - 0.7, y + 0.85, Z), P(xb - 0.7, y + 0.85, Z + 1.4)], Math.max(1.4, K(Z) * 0.06), fog('#2a2016', Z), 1) + line([P(xb + 0.7, y + 0.85, Z), P(xb + 0.7, y + 0.85, Z + 1.4)], Math.max(1.4, K(Z) * 0.06), fog('#2a2016', Z), 1);
    const ch = []; for (let x = -30; x <= 30; x += 2) ch.push([x, 14.7 + Math.sin(x * 0.3) * 0.3]); s2 = `<path d="${p2([...ch.map(([x, z]) => P(x, 0.001, z - 0.4)), ...ch.reverse().map(([x, z]) => P(x, 0.001, z + 0.4))])}" fill="#14160e" opacity="0.85"/>` + s2; return s2; }]);
  T.sort((a, b) => b[0] - a[0]); for (const [, fn] of T) raw(fn());
}
// ---- bog-cotton patches: dense white clusters in the wet hollows, smaller with distance
for (const [X, Z, n] of [[-3, 12, 14], [7, 15, 18], [-12, 18, 16], [15, 23, 20], [-4, 24, 14], [3, 33, 20], [-18, 30, 16]]) for (let i = 0; i < n; i++) { const c = P(X + (R() - 0.5) * 3, 0, Z + (R() - 0.5) * 1.2); raw(cotton(c[0], c[1], K(Z) * (0.25 + R() * 0.15), 2)); }
// ---- the near ground in the fighters' band: wet sphagnum, a worn path of trodden black peat, puddles, cut turves
{
  for (let i = 0; i < 20; i++) { const X = -12 + R() * 24, Z = 4 + R() * 6, [x, y] = P(X, 0.003, Z), l = K(Z) * (0.3 + R() * 0.8); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="#1e1a10" stroke-width="${f1(Math.max(0.8, K(Z) * 0.03))}" opacity="0.4"/>`); }
  for (let i = 0; i < 90; i++) { const X = -14 + R() * 28, Z = 3.4 + Math.pow(R(), 1.3) * 7, c = P(X, 0, Z), k = K(Z); if (R() < 0.5) raw(II.reeds(c[0], c[1], k * (0.12 + R() * 0.18), 4 + Math.floor(R() * 4), R() < 0.5 ? '#5a5a30' : '#4a4626', { heads: 0.05 })); else raw(stain(c[0], c[1], k * (0.2 + R() * 0.4), R() < 0.5 ? '#6a5a2a' : '#2a2a16', 0.35)); }
  const wp = []; for (let z = 3.2; z < 9.5; z += 0.5) wp.push([-1 + Math.sin(z * 0.6) * 1.5, z]); raw(`<path d="${p2([...wp.map(([x, z]) => P(x - 1.2, 0.002, z)), ...wp.slice().reverse().map(([x, z]) => P(x + 1.2, 0.002, z))])}" fill="#2a2216" opacity="0.6"/>`);
  for (const [X, Z, w] of [[-6.5, 6.8, 1.6], [4.6, 7.6, 1.8], [-1.5, 8.6, 1.2], [8.5, 5.5, 1.4]]) raw(G.puddle(X, Z, w, 0.5, '#1a1e14', '#d8dac8'));
  for (let i = 0; i < 12; i++) { const X = -10 + R() * 20, Z = 4 + R() * 5, c = P(X, 0, Z), k = K(Z); raw(cel(chip([[c[0] - k * 0.18, c[1]], [c[0] + k * 0.18, c[1]], [c[0] + k * 0.16, c[1] - k * 0.1], [c[0] - k * 0.17, c[1] - k * 0.1]], 0.5), { Z, fill: tone('#2e2216', 0.2), band: 1 })); }
  raw(S.occBand((s2, t) => [-20 + s2, 0, 3 + t], 40, 1.0, { op: 0.3 }));
}

// ======================================================================== MID: low things in the fighters' band
layer('mid');
{
  // a turf barrow (scale cue: 1.5 m long) loaded with fresh turves, its wheel sunk; a turf spade stuck upright by it
  const Z = 9.2, a = P(-8.4, 0.05, Z), b = P(-6.9, 0.45, Z), k = K(Z); raw(cel([[a[0], a[1] - k * 0.35], [b[0], b[1] - k * 0.15], [b[0], b[1] + k * 0.05], [a[0] + k * 0.1, a[1] - k * 0.1]], { Z, fill: '#3a2c1c', band: 1.5 }));
  raw(`<ellipse cx="${f1(b[0])}" cy="${f1(b[1] + k * 0.1)}" rx="${f1(k * 0.18)}" ry="${f1(k * 0.18)}" fill="none" stroke="${INK}" stroke-width="2"/>` + line([[a[0], a[1] - k * 0.25], [a[0] - k * 0.5, a[1] - k * 0.05]], 2, INK, 1));
  for (let j = 0; j < 4; j++) { const x = a[0] + k * 0.15 + j * k * 0.28; raw(cel([[x, a[1] - k * 0.36 - j * 2], [x + k * 0.26, a[1] - k * 0.38 - j * 2], [x + k * 0.26, a[1] - k * 0.5 - j * 2], [x, a[1] - k * 0.48 - j * 2]], { Z, fill: '#2a1e12', band: 0.8 })); }
  const sp = P(-5.9, 0, 9.4); raw(line([sp, [sp[0] + 4, sp[1] - K(9.4) * 1.2]], 2.4, INK, 1) + line([sp, [sp[0] + 4, sp[1] - K(9.4) * 1.2]], 1.2, '#5a4a30', 1));
  // a peat-cutter's sledge abandoned on the bog, runners sunk, a few turves still on it, the slane (turf spade) across it
  { const Z = 10.4, a = P(2.0, 0.02, Z), b = P(4.2, 0.02, Z), k = K(Z); raw(line([[a[0] - k * 0.1, a[1] - k * 0.15], a, b, [b[0] + k * 0.15, b[1] - k * 0.12]], 3, INK, 1) + line([[a[0] - k * 0.1, a[1] - k * 0.15], a, b, [b[0] + k * 0.15, b[1] - k * 0.12]], 1.6, '#4a3a26', 1));
    raw(cel([[a[0], a[1] - k * 0.12], [b[0], b[1] - k * 0.12], [b[0], b[1] - k * 0.2], [a[0], a[1] - k * 0.2]], { Z, fill: '#3a2c1c', band: 1 }));
    for (let j = 0; j < 4; j++) { const x = a[0] + k * 0.2 + j * k * 0.45; raw(cel([[x, a[1] - k * 0.2], [x + k * 0.38, a[1] - k * 0.2], [x + k * 0.38, a[1] - k * 0.34], [x, a[1] - k * 0.34]], { Z, fill: '#2a1e12', band: 0.8 })); }
    raw(line([[a[0] + k * 0.3, a[1] - k * 0.45], [b[0] + k * 0.4, b[1] - k * 0.25]], 2.4, INK, 1) + line([[a[0] + k * 0.3, a[1] - k * 0.45], [b[0] + k * 0.4, b[1] - k * 0.25]], 1.2, '#5a4a30', 1) + `<path d="M${f1(b[0] + k * 0.4)} ${f1(b[1] - k * 0.3)} l${f1(k * 0.2)} 2 l-2 ${f1(k * 0.12)} l${f1(-k * 0.2)} -2 Z" fill="#4a4a46" stroke="${INK}" stroke-width="0.8"/>`); }
  // the troll's churned wallow by the bridge, black, a boot and bones in it
  const c = P(4.8, 0.004, 13.4), kk = K(13.4); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(kk * 2.2)}" ry="${f1(kk * 0.35)}" fill="#0e0e08" stroke="${INK}" stroke-width="0.8"/>`);
}

// ======================================================================== FORE: a near hummock with cotton-grass and a hag's charm stake; reeds
layer('fore');
{
  for (const [cx, sd, h] of [[120, -1, 80], [W - 80, 1, 64]]) { const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([cx + sd * (t - 0.5) * 300, H - 4 - Math.sin(Math.pow(t, sd < 0 ? 0.7 : 1.4) * Math.PI) * h * (0.85 + R() * 0.2)]); }
    raw(G.rockMass([[cx - 170, H + 6], ...pts, [cx + 170, H + 6]], 2.8, '#3e3c22', { fiss: 2, hop: 0.45 }));
    for (let k = 0; k < 10; k++) { const p = pts[1 + Math.floor(R() * 8)]; raw(II.reeds(p[0], p[1] + 3, 40 + R() * 40, 5, '#3a3a22', { heads: 0.2 })); }
    for (let k = 0; k < 4; k++) { const p = pts[1 + Math.floor(R() * 8)]; raw(cotton(p[0] + (R() - 0.5) * 20, p[1] + 2, 50 + R() * 30, 3)); } }
  const st = [200, H + 4]; raw(line([st, [210, 330]], 5, INK, 1) + line([st, [210, 330]], 3, '#3a2a1a', 1));
  let ch = line([[210, 332], [216, 372], [211, 400]], 0.8, '#8a7a58', 1); for (let k = 0; k < 6; k++) { const y = 340 + k * 10; ch += `<path d="M${f1(212 + (k % 2) * 2)} ${f1(y)} l${f1(4 + R() * 3)} ${f1(2 + R() * 2)}" stroke="#d8d0b0" stroke-width="1.6" stroke-linecap="round"/>`; } raw(ch);
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
