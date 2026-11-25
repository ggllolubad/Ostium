// World XIII, the Black Pyre: THE STAKE FIELD (battle room `pyre_stake`, round 2, Living Ink).
// The burning ground outside the cathedral, where the condemned were burned in rows for nine hundred years; the
// cathedral black on the horizon, its crossing tower burned hollow and still pouring the Saint's black smoke. Encounters:
// The Stake Field (hounds sniff the ashes of the burned: their ashprints run everywhere), The Fallen Seraph (it came to
// put out the fire: the long furrow it ploughed through the stakes when it fell, its burned feathers standing in the ash).
// Kind of space: open, vast, flat, low horizon. Light: dusk, a low sallow sun in the ash haze behind the smoke columns;
// the sky is the light focus, the plain dark. Shapes: horizontals (plain, smoke banks, horizon) cut by the irregular
// rhythm of thin stakes. Black flame gives no light: it reads as black against the pale sky.
// No gold (the Saint's halo is the world's only gold): the seraph's halo fragment is burned black. Red: rubric on the
// sentence placards only.
// Usage: node scenes/bg_pyre_stake.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIII');
const { S, B, G } = require('./battle_kit_g5').make(13301, '#141114', '#2a2224', '#a89c8c');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, seam, ash, char, chain, tornVoid, quiet, skyBands } = B;
const { W, H, air, blackFlame, cloud, pointed } = G;
const VIO = '#9a6ad8', VIOD = '#4a2e6a', RUB = '#8a2a1e', IRON = '#2e2a2a', MURK = B.MURK, SKYL = '#e2d6bc';

// a stake: charred post with a crosspiece, chains hanging open, faggots heaped at its foot (o.burn: black flame on them)
function stake(X, Z, h, o = {}) {
  const k = K(Z), lean = o.lean ?? (R() < 0.25 ? (R() < 0.5 ? -1 : 1) * (0.15 + R() * 0.2) : (R() - 0.5) * 0.1), a = P(X, 0, Z), b = P(X + lean * h, h, Z), w = Math.max(1.1, k * 0.13), dk = o.dk ?? 0;
  const col = mix('#221c1c', MURK, dk), cp = P(X + lean * (h - 0.6), h - 0.6, Z);
  let s = '';
  // faggots heaped at the foot
  for (let i = 0; i < (o.faggots ?? 9); i++) { const ang = (R() - 0.5) * 1.0, c = P(X + (R() - 0.5) * 1.0, 0.1 + R() * 0.32, Z - 0.3 + R() * 0.4), l = k * (0.5 + R() * 0.35); s += line([[c[0] - Math.cos(ang) * l / 2, c[1] - Math.sin(ang) * l / 2], [c[0] + Math.cos(ang) * l / 2, c[1] + Math.sin(ang) * l / 2]], Math.max(1.6, k * 0.06), INK) + line([[c[0] - Math.cos(ang) * l / 2, c[1] - Math.sin(ang) * l / 2], [c[0] + Math.cos(ang) * l / 2, c[1] + Math.sin(ang) * l / 2]], Math.max(0.8, k * 0.035), mix('#3a302a', MURK, dk)); }
  if (o.snap) { const t = P(X + lean * o.snap, o.snap, Z); s += cel([[a[0] - w, a[1]], [a[0] + w, a[1]], [t[0] + w * 0.8, t[1] + 2], [t[0] + w * 0.2, t[1] - 3], [t[0] - w * 0.6, t[1] + 1]], { Z, fill: col, band: w * 0.6 }); const lay = P(X + 1.2, 0.15, Z - 0.6); s += line([[t[0] + 2, a[1] - 2], [lay[0] + k * 1.6, lay[1]]], w * 2.2, INK) + line([[t[0] + 2, a[1] - 2], [lay[0] + k * 1.6, lay[1]]], w * 1.4, col); return s; }
  s += cel([[a[0] - w, a[1]], [a[0] + w, a[1]], [b[0] + w * 0.75, b[1]], [b[0] - w * 0.75, b[1] - 2]], { Z, fill: col, band: w * 0.6 });
  s += line([[a[0] - w * 0.6, a[1] - k * 0.3], [b[0] - w * 0.5, b[1] + 3]], Math.max(0.5, w * 0.18), mix('#7a7270', MURK, dk), 0.6);
  for (let i = 0; i < 5; i++) { const y = a[1] + (b[1] - a[1]) * (0.2 + R() * 0.7); s += pline([[a[0] - w, y], [a[0] - w * 0.1, y + 1.2]], 0.7, mix('#6a6064', MURK, dk), 0.5); }
  // an iron collar-ring near the top where the neck chain was made fast; the top split and charred to a point
  s += pline([[cp[0] - w * 1.3, cp[1] - 1], [cp[0] + w * 1.3, cp[1] + 1]], Math.max(1, w * 0.5), IRON) + fillS([[b[0] - w * 0.75, b[1] + 1], [b[0] - w * 0.6, b[1] - w * 0.5], [b[0] - w * 0.1, b[1] - w * 0.75], [b[0] + w * 0.5, b[1] - w * 0.45], [b[0] + w * 0.75, b[1] + 1]], col, 1, 0.5);
  for (const Y of [1.4, 0.6]) { const c = P(X + lean * Y, Y, Z - 0.05); s += chain([[c[0] - w, c[1]], [c[0] - w * 3, c[1] + k * 0.22], [c[0] - w * 2.5, c[1] + k * 0.5]], Math.max(0.9, k * 0.03), IRON) + chain([[c[0] + w, c[1]], [c[0] + w * 2.2, c[1] + k * 0.32]], Math.max(0.9, k * 0.03), IRON); }
  if (o.remains) { const c = P(X + lean, 1.1, Z - 0.08); s += cel(blob(c[0], c[1], w * 1.7, k * 0.5, 12, 0.25), { Z, fill: mix('#141012', MURK, dk), band: 2 }) + fillS(blob(c[0] + 1, c[1] - k * 0.58, w * 1.05, w * 1.1, 10, 0.2), '#141012') + inkS(blob(c[0] + 1, c[1] - k * 0.58, w * 1.05, w * 1.1, 10, 0.2), 0.8); }
  if (o.placard) { const c = P(X + lean * 1.9, 1.9, Z - 0.1), pw = k * 0.32, ph = k * 0.2; s += cel([[c[0] - pw, c[1] - ph], [c[0] + pw, c[1] - ph * 0.8], [c[0] + pw * 0.9, c[1] + ph], [c[0] - pw, c[1] + ph * 0.9]], { Z, fill: '#a89a80', band: 1.5 }); for (let j = 0; j < 3; j++) s += pline([[c[0] - pw * 0.8, c[1] - ph * 0.5 + j * ph * 0.45], [c[0] + pw * (0.3 + R() * 0.4), c[1] - ph * 0.5 + j * ph * 0.45]], Math.max(0.6, ph * 0.12), j === 0 ? RUB : '#3a2a22'); }
  if (o.burn) s += blackFlame(a[0], a[1] - k * 0.12, k * 1.1, k * o.burn, { lean: 0.2, n: 2 });
  return s;
}
const smoke = G.smoke;

// ======================================================================== FAR
layer('far');
raw(G.gradSky([[0, '#34303a'], [0.15, '#4a434a'], [0.32, '#6a5e5a'], [0.45, '#9a8c7a'], [0.55, '#cdbd9e'], [0.63, '#e2d4b4'], [1, '#e8dcbc']]));
raw(`<rect width="${W}" height="70" fill="${S.hatchA(30)}" opacity="0.25"/>`);
// ---- the low sun in the ash haze, stepped rings, half behind the smoke banks
raw(G.glow(520, 214, 360, 160, '#f4e6c4', 0.7) + G.glow(520, 214, 80, 70, '#fcf4e0', 0.95) + `<circle cx="520" cy="214" r="17" fill="#fdf8ea"/>`);
// ---- ash cloud banks: long and low, lit on their undersides by the low sun
for (const [cx, cy, w, h, col, dr] of [[240, 90, 680, 60, '#4e464c', 1], [1060, 64, 860, 74, '#4a4248', 1.4], [800, 170, 520, 30, '#7a6e66', 2], [1320, 190, 380, 24, '#8a7e72', 1.5], [130, 196, 300, 20, '#8a7e72', 1]]) raw(G.softCloud(cx, cy, w, h, col, { lit: '#f0dcbc', litK: 0.4, dark: '#2a2228', darkK: 0.4, op: 0.85, wisps: 5, drift: dr, n: Math.max(4, Math.round(w / h * 0.9)) }));
// ---- distance: the cathedral on the horizon, black against the glow; its north tower's top unmade by the void; the
// crossing tower burned hollow, pouring the Saint's black smoke
{
  const Z = 300, k = K(Z), base = P(0, 0, Z)[1], X0 = 40;
  const sil = '#2a2428', at = (s, t) => [X0 + s, t, Z];
  const pts = [[-30, 0], [-30, 26], [-26, 34], [-22, 26], [-22, 22], [-14, 24], [-14, 52], [-12.6, 60], [-11.2, 52], [-11.2, 26], [-4, 26], [-4, 52], [-2.6, 60], [-1.2, 52], [-1.2, 24], [10, 30], [14, 30], [14, 48], [22, 48], [22, 30], [36, 30], [46, 22], [46, 0]];
  raw(fillP(pts.map(([s, t]) => P(...at(s, t))), sil) + inkP(pts.map(([s, t]) => P(...at(s, t))), 0.9));
  // flying buttresses along the nave, roof ridge, lancets dim
  for (let i = 0; i < 6; i++) { const s0 = 16 + i * 4.6; raw(pline([P(...at(s0, 30)), P(...at(s0 + 1.6, 22)), P(...at(s0 + 2.2, 10))], 1.6, sil) + pline([P(...at(s0 + 2.2, 0)), P(...at(s0 + 2.2, 24))], 2.2, sil)); }
  for (let i = 0; i < 7; i++) { const s0 = 15 + i * 4.2, o = pointed(s0, s0 + 1.1, 18, 4, 1).map(([s, t]) => P(...at(s, t < 0.1 ? 12 : t))); raw(fillP(o, '#4a4044')); }
  // the west front's great rose, burned out (black)
  { const c = P(...at(-7.6, 34)); raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(k * 4.2)}" fill="#0c0a0c" stroke="#4a4044" stroke-width="1"/>`); }
  // the void has unmade the top of the north tower: the sky shows through a clean-rimmed absence
  raw(tornVoid((s, t) => at(s, t), -12.6, 49, 5.6, 9, { depth: 0, mat: sil, voidCol: '#050407', halo: false, tears: 3, tearLen: 0.4, teeth: 2, slivers: 5, flecks: 8, n: 40 }).svg);
  // the crossing tower, hollow, and the black smoke of the Saint's fire rising out of it, bending downwind
  { const c = P(...at(18, 48)); raw(G.softSmoke(c[0], c[1], 210, 26, { lean: 0.6, air: '#8a7e74' })); raw(blackFlame(c[0], c[1] + 2, k * 7, k * 9, { n: 3 })); }
  raw(fillP([[0, base], [W, base], [W, base + 3], [0, base + 3]], '#1e1a1c'));
}
// ---- the far rows of stakes on the plain, tiny, and the smoke of a few still burning
for (let r = 0; r < 4; r++) { const Z = 80 + r * 45; for (let X = -110; X < 110; X += 3.4 + R() * 3) { if (R() < 0.35) continue; const a = P(X, 0, Z), b = P(X, 4.2, Z); raw(pline([a, b], Math.max(0.8, K(Z) * 0.2), air('#2a2224', Z, 0.4, 7, 260)) + pline([[b[0] - K(Z) * 0.4, b[1] + K(Z) * 0.5], [b[0] + K(Z) * 0.45, b[1] + K(Z) * 0.5]], Math.max(0.6, K(Z) * 0.12), air('#2a2224', Z, 0.4, 7, 260))); } }
for (const [X, Z, h] of [[-40, 70, 130], [62, 90, 100]]) { const c = P(X, 0, Z); raw(G.softSmoke(c[0], c[1], h, 12, { lean: 0.5, air: '#a89c8c', op: 0.7 })); }
// ---- the plain: ash, crust cracked into plates, ruts running to the cathedral, ashprints; dark toward us
{
  raw(fillP([[0, 300], [W, 300], [W, H], [0, H]], '#3e3836'));
  for (const [z0, col] of [[60, '#4e4644'], [30, '#3a3434'], [16, '#2c2828'], [9, '#221e20']]) raw(fillP([P(-400, 0, z0), P(400, 0, z0), P(400, 0, 3.5), P(-400, 0, 3.5)].map(([x, y]) => [Math.max(-20, Math.min(W + 20, x)), y]), col));
  // crust plates: irregular cells laid in the ground plane
  const cells = B.voronoi(B.seedsIn(-30, 30, 4, 40, 2.6, 2.2, 0.9), -30, 30, 4, 40);
  for (const c of cells) { const Zc = c.seed[1]; const q = c.poly.map(([x, z]) => P(x, 0, z)); if (Math.max(...q.map(p => p[1])) < 300) continue; raw(`<path d="${p2(q)}" fill="${mix(R() < 0.5 ? '#4a4240' : '#2e2828', MURK, Math.min(0.6, 3 / Zc))}" opacity="0.55" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Zc) * 0.6))}"/>`); }
  // cart ruts converging on the cathedral
  for (const dx of [-0.8, 0.8]) { const pts = []; for (let z = 4; z < 200; z *= 1.18) pts.push(P(1.5 + dx + Math.sin(z * 0.08) * 1.5 + z * 0.12, 0, z)); raw(line(pts, 2.2, '#141012', 0.7) + line(pts.map(([x, y]) => [x + 1.5, y + 1]), 0.8, '#6a6060', 0.5)); }
  // the hounds' ashprints wandering between the stakes
  for (let tr = 0; tr < 5; tr++) { let X = -18 + R() * 36, Z = 6 + R() * 16, a = R() * 6.28; for (let i = 0; i < 16; i++) { a += (R() - 0.5) * 0.8; X += Math.cos(a) * 0.5; Z += Math.sin(a) * 0.5; if (Z < 5) Z = 5; const c = P(X + (i % 2 ? 0.12 : -0.12), 0, Z), r = Math.max(0.6, K(Z) * 0.04); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r)}" ry="${f1(r * 0.35)}" fill="#0c0a0c" opacity="0.7"/>`); } }
  // the seraph's furrow: ploughed through the ash from the right, stakes snapped along it, ending in a crater
  const fz = [[16, 34], [12, 26], [7, 20], [3.5, 15.5], [1.0, 13]];
  const L = fz.map(([x, z], i) => P(x - 0.5 - i * 0.1, 0, z - 0.6)), Rr = fz.map(([x, z], i) => P(x + 0.5 + i * 0.1, 0, z + 0.6));
  raw(fillP([...L, ...Rr.slice().reverse()], '#141012', 0.85) + line(L, 1.4, '#8a8078', 0.6) + line(Rr, 1.2, INK, 0.8));
  for (const [x, z] of fz) { const c = P(x, 0.15, z), r = K(z) * 0.4; raw(fillS(blob(c[0], c[1] - r * 0.3, r * 1.8, r * 0.4, 10, 0.5), '#5a5250', 0.8) + line([[c[0] - r * 1.6, c[1] - r * 0.2], [c[0], c[1] - r * 0.6], [c[0] + r * 1.7, c[1] - r * 0.1]], 1, INK, 0.6)); }
  { const c = P(0.4, 0, 12.6), r = K(12.6) * 1.6; raw(fillS(blob(c[0], c[1], r * 1.3, r * 0.22, 14, 0.25), '#0e0c0e') + fillS(blob(c[0] - r * 0.2, c[1] - r * 0.1, r * 1.6, r * 0.32, 14, 0.25), '#4a4240', 0.6)); }
}
// ---- the middle rows of stakes, irregular, receding; some burning black, some holding remains, some snapped by the fall
const rows = [];
// the rows were planted in lines once, but nine hundred years have broken them: gaps, doubled stakes, stakes leaning or down
for (const [Z, gap] of [[13, 7], [18, 5.5], [24, 4.4], [31, 3.8], [40, 3.4]]) { let X = -30 + R() * 3; while (X < 30) { if (R() < 0.2) { X += gap * 1.8; continue; } rows.push([X + (R() - 0.5) * 1.6, Z + (R() - 0.5) * 3]); if (R() < 0.12) rows.push([X + 0.7, Z + 0.5]); X += gap * (0.5 + R() * 1.1); } }
rows.sort((a, b) => b[1] - a[1]);
for (const [X, Z] of rows) { const onFurrow = Math.abs(X - (Z - 12.5) * 0.75) < 1.4 && Z > 12 && Z < 30; if (Math.abs(X) < 1.6 && Z < 14) continue;
  raw(stake(X, Z, R() < 0.3 ? 1.2 + R() * 1.2 : 2.6 + R() * 1.6, { dk: Math.min(0.5, Z / 60), snap: onFurrow ? 0.8 + R() * 0.8 : 0, remains: R() < 0.35, placard: R() < 0.25, burn: !onFurrow && R() < 0.22 ? 2.0 + R() * 0.6 : 0, faggots: 6 + Math.floor(R() * 5) }));
}
// the seraph's burned feathers standing up out of the ash at the crater, and its halo ring, burned black, half sunk
{ const Z = 13.2; const root = P(1.4, 0.25, Z), k = K(Z);
  // a burned wing lying half buried at the end of the furrow: the arm bones, the long pinions fanned, vanes charred to lace
  const elbow = [root[0] - k * 0.9, root[1] - k * 0.45], wrist = [root[0] - k * 2.1, root[1] - k * 0.2];
  raw(line([root, elbow, wrist], Math.max(2, k * 0.09), INK) + line([root, elbow, wrist], Math.max(1, k * 0.05), '#b8b0a8'));
  for (let i = 0; i < 9; i++) { const u = i / 8, base = [elbow[0] + (wrist[0] - elbow[0]) * u, elbow[1] + (wrist[1] - elbow[1]) * u], a = -2.2 + u * 1.5 + (R() - 0.5) * 0.1, l = k * (1.0 + u * 1.2), tip = [base[0] + Math.cos(a) * l, base[1] + Math.sin(a) * l * 0.55];
    const nx = -Math.sin(a), ny = Math.cos(a) * 0.55, vw = k * 0.11, v = [base, [base[0] + (tip[0] - base[0]) * 0.5 + nx * vw, base[1] + (tip[1] - base[1]) * 0.5 + ny * vw], tip, [base[0] + (tip[0] - base[0]) * 0.5 - nx * vw * 0.6, base[1] + (tip[1] - base[1]) * 0.5 - ny * vw * 0.6]];
    raw(fillS(v, i % 2 ? '#2a2426' : '#3a3434', 1, 0.5) + inkS(v, 0.8, 0.5) + line([base, tip], Math.max(0.8, k * 0.02), '#a8a098'));
    for (let j = 1; j < 6; j++) { const t = j / 6, m = [base[0] + (tip[0] - base[0]) * t, base[1] + (tip[1] - base[1]) * t]; raw(pline([m, [m[0] + nx * vw * 0.8 + 2, m[1] + ny * vw * 0.8]], 0.6, VIO, 0.6)); } }
  raw(fillS(blob(root[0] - k * 0.4, root[1] + k * 0.12, k * 1.6, k * 0.18, 12, 0.4), '#3a3434', 0.9));
  const h = P(-2.4, 0.1, Z + 0.3); raw(`<ellipse cx="${f1(h[0])}" cy="${f1(h[1])}" rx="${f1(K(Z) * 0.55)}" ry="${f1(K(Z) * 0.16)}" fill="none" stroke="${INK}" stroke-width="${f1(K(Z) * 0.08)}"/><ellipse cx="${f1(h[0])}" cy="${f1(h[1])}" rx="${f1(K(Z) * 0.55)}" ry="${f1(K(Z) * 0.16)}" fill="none" stroke="#2a2420" stroke-width="${f1(K(Z) * 0.04)}" stroke-dasharray="6 3 2 4"/>`); }
raw(quiet([[236, 0.1], [272, 0.12], [306, 0.12], [350, 0.12]], { hop: 0.14 }));
// the near ground in the fighters' band: ash drifted in low ridges (lit crests toward the sun), cracks in the crust
// running to the horizon, scattered charred faggot sticks and bone, a trodden path where the condemned were led
for (let k = 0; k < 16; k++) { const Z = 4.5 + R() * 8, X = (R() - 0.5) * Z * 2.2, w = 1 + R() * 2.5, pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push(P(X + w * u, Math.sin(u * Math.PI) * 0.06, Z + Math.sin(u * 3) * 0.2)); } raw(line(pts, 1.4, '#6a6260', 0.55) + line(pts.map(([x, y]) => [x, y + 2]), 1, '#0a0809', 0.5)); }
for (let k = 0; k < 10; k++) { const X0 = (R() - 0.5) * 16, pts = []; let X = X0; for (let Z = 4.5; Z < 12; Z += 0.8) { X += (R() - 0.5) * 0.5; pts.push(P(X, 0, Z)); } raw(pline(pts, 0.8, '#0a0809', 0.55)); }
for (let k = 0; k < 22; k++) { const Z = 5 + R() * 7, c = P((R() - 0.5) * Z * 2, 0.02, Z), l = K(Z) * (0.15 + R() * 0.3), a = (R() - 0.5) * 0.6; raw(line([[c[0] - l / 2, c[1] - a * l / 2], [c[0] + l / 2, c[1] + a * l / 2]], Math.max(1.5, K(Z) * 0.03), R() < 0.3 ? '#8a8278' : '#1a1416', 0.85)); }
raw(ash(160, 0, W, 10, 290, { r: 1.8, op: 0.55, col: '#3a3436' }));

// ======================================================================== MID
layer('mid');
{ // the tumbril that carried the condemned to the stakes: a two-wheeled cart standing tipped back on its tail, shafts up (a familiar size: wheels 1.3 m)
  const Z = 10.4, X = 4.2, k = K(Z); const bed = [P(X - 1.0, 0.5, Z), P(X + 1.1, 1.0, Z), P(X + 1.1, 1.35, Z), P(X - 1.0, 0.85, Z)]; raw(cel(bed, { Z, fill: mix('#3a302a', MURK, 0.3), band: 2 })); for (let i = 1; i < 5; i++) { const u = i / 5; raw(pline([[bed[0][0] + (bed[1][0] - bed[0][0]) * u, bed[0][1] + (bed[1][1] - bed[0][1]) * u], [bed[3][0] + (bed[2][0] - bed[3][0]) * u, bed[3][1] + (bed[2][1] - bed[3][1]) * u]], 0.8, INK, 0.6)); }
  const wc = P(X, 0.65, Z - 0.3), wr = k * 0.65; raw(`<circle cx="${f1(wc[0])}" cy="${f1(wc[1])}" r="${f1(wr)}" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="${f1(wc[0])}" cy="${f1(wc[1])}" r="${f1(wr)}" fill="none" stroke="${mix('#4a3c30', MURK, 0.3)}" stroke-width="2"/>`); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; raw(pline([wc, [wc[0] + Math.cos(a) * wr, wc[1] + Math.sin(a) * wr]], 1.2, mix('#4a3c30', MURK, 0.3))); }
  for (const dz of [-0.2, 0.2]) raw(line([P(X + 1.1, 1.2, Z + dz), P(X + 2.4, 2.6, Z + dz)], 2.4, INK) + line([P(X + 1.1, 1.2, Z + dz), P(X + 2.4, 2.6, Z + dz)], 1.2, mix('#4a3c30', MURK, 0.3))); }
{ // a hound-gnawed heap of charred bones by a fallen faggot bundle; a dropped iron pricker and a rubric placard in the ash
  const Z = 9.2, c = P(-2.8, 0.03, Z); for (let k = 0; k < 7; k++) { const p = [c[0] + (R() - 0.5) * 40, c[1] + (R() - 0.5) * 4], l = K(Z) * (0.16 + R() * 0.18), a = (R() - 0.5) * 0.6; raw(line([[p[0] - l / 2, p[1] - a * l], [p[0] + l / 2, p[1] + a * l]], 3, INK) + line([[p[0] - l / 2, p[1] - a * l], [p[0] + l / 2, p[1] + a * l]], 1.6, mix('#c8c0ac', MURK, 0.55))); }
  const Z2 = 10.4, q = P(3.4, 0.05, Z2), pw = K(Z2) * 0.3; raw(cel([[q[0] - pw, q[1] - 4], [q[0] + pw, q[1] - 6], [q[0] + pw * 1.1, q[1] + 2], [q[0] - pw * 0.9, q[1] + 3]], { Z: Z2, fill: mix('#8a7e68', MURK, 0.4), band: 1.5 }) + pline([[q[0] - pw * 0.7, q[1] - 2], [q[0] + pw * 0.5, q[1] - 3]], 1.4, mix(RUB, MURK, 0.3)));
}

// ======================================================================== FORE
layer('fore');
{ // left: a near stake right at the frame edge, its chain hanging, a sentence placard in rubric nailed to it
  const x = 30, pts = [[x - 18, H + 5], [x + 16, H + 5], [x + 10, -5], [x - 14, -5]]; raw(cel(pts, { Z: 3.4, fill: '#1e1818', band: 8, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.45"/>`);
  for (let y = 20; y < 480; y += 26 + R() * 20) raw(pline([[x - 16, y], [x - 4, y + 3]], 1.4, '#6a6064', 0.6));
  raw(B.char(x, 260, 22, 60, { Z: 4, op: 0.5 }) + chain([[x + 12, 150], [x + 44, 210], [x + 52, 300], [x + 40, 330]], 5, IRON));
  const pc = [x + 6, 92], pw = 34, ph = 22; raw(cel([[pc[0] - pw, pc[1] - ph], [pc[0] + pw, pc[1] - ph * 0.8], [pc[0] + pw * 0.9, pc[1] + ph], [pc[0] - pw, pc[1] + ph * 0.9]], { Z: 3.4, fill: '#a89a80', band: 3 }) + `<path d="${p2([[pc[0] - pw, pc[1] - ph], [pc[0] + pw, pc[1] - ph * 0.8], [pc[0] + pw * 0.9, pc[1] + ph], [pc[0] - pw, pc[1] + ph * 0.9]])}" fill="url(#mottle)" opacity="0.5"/>`);
  for (let j = 0; j < 4; j++) raw(`<path d="M${f1(pc[0] - pw * 0.8)} ${f1(pc[1] - ph * 0.55 + j * ph * 0.38)} L${f1(pc[0] + pw * (0.3 + R() * 0.45))} ${f1(pc[1] - ph * 0.55 + j * ph * 0.38)}" stroke="${j === 0 ? RUB : '#3a2a22'}" stroke-width="${j === 0 ? 3 : 1.6}" stroke-dasharray="${j === 0 ? '7 2 3 2' : '4 2 2 2 6 2'}"/>`);
  raw(B.char(pc[0] + pw * 0.4, pc[1] + ph * 0.7, 18, 6, { Z: 4 }) + `<circle cx="${pc[0] - pw + 5}" cy="${pc[1] - ph + 5}" r="2.4" fill="${IRON}"/>`);
}
{ // right: a drift of ash and a toppled faggot bundle burning black, smoke falling across the corner
  const d = [[W - 190, H + 5], [W - 150, 440], [W - 90, 418], [W - 30, 404], [W + 5, 400], [W + 5, H + 5]]; raw(cel(d, { Z: 3.6, fill: '#2a2626', band: 5, tex: 'url(#mottle)', texOp: 0.5 }) + line(d.slice(1, 5).map(([x, y]) => [x, y + 3]), 1.5, '#8a8280', 0.6));
  for (let i = 0; i < 7; i++) { const ang = -0.2 + (R() - 0.5) * 0.5, c = [W - 90 + (R() - 0.5) * 70, 420 + R() * 20], l = 80 + R() * 40; raw(line([[c[0] - Math.cos(ang) * l / 2, c[1] - Math.sin(ang) * l / 2], [c[0] + Math.cos(ang) * l / 2, c[1] + Math.sin(ang) * l / 2]], 9, INK) + line([[c[0] - Math.cos(ang) * l / 2, c[1] - Math.sin(ang) * l / 2], [c[0] + Math.cos(ang) * l / 2, c[1] + Math.sin(ang) * l / 2]], 5, '#3a302a')); }
  raw(blackFlame(W - 80, 418, 120, 110, { lean: 0.35 }) + G.softSmoke(W - 70, 340, 300, 36, { lean: 0.25, air: '#4a4246', op: 0.8 }));
}
raw(ash(40, 0, W, 0, 470, { r: 2.6, op: 0.6, col: '#3a3436' }));

G.write(OUT, 'pyre_stake');
