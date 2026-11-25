// World I, the Drowned Kingdom: THE BELFRY (boss room `belfry`, The Bell Below), Living Ink, round 2 (group g1).
// Lore (bible + LORE_CHANGES 2026-11-23): the abbey church has no bell. Its bell was dropped through the first door and became
// the Bell Below; it rings for every soul that drowned. It hangs here, in the drowned cathedral's bell tower, from a broken
// chain that rises out of a torn absence in the tower wall: the way it came. The tower's ringing floors have fallen; the
// ringers' ropes hang cut at every height; the toll has pressed rings into the silt round its lip.
// Space: vertical and vast: the foot of a round tower, its curved wall wrapping the stage, the joists of the fallen floors
// jutting overhead. Light: the most dramatic in the world: hard cold shafts from the louvred bell openings high on the left,
// crossing the shaft and striking the curved wall and the bell's stage. Shapes: curves (the tower's coursing bends round),
// verticals of hanging ropes. Boss stage: the right 45%, the curved wall and the absence behind the bell's crown, uncluttered.
// Also hosts "The Drowned Belfry" (bellringer, choirboy, thrall).
// Courses: water (silt, kelp, barnacles, verdigris drips), void (the torn absence; one rope cut clean by a smaller one).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'I');
const W = 1480, H = 480, ROOM = 'belfry';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2331, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141c22' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, ashlar } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, I = G.I;
const MURK = '#0a1216', STONE = '#4e5a5c', SH = '#d4e8e0';
const XC = 1.5, ZC = 11, RAD = 14;                 // the tower: centre and radius (m)
const TH0 = Math.PI * 0.99, TH1 = Math.PI * 1.99;     // the visible arc, left (near) round the back to the right
const wallAt = (s, t) => { const th = TH0 + s / RAD; return [XC + RAD * Math.cos(th), t, ZC - RAD * Math.sin(th)]; };
const ARC = (TH1 - TH0) * RAD;
// facing of the wall at arc position s: lit where it faces the key light (from the left), dark where it faces away
const faceLit = s => { const th = TH0 + s / RAD, nx = -Math.cos(th); return nx; };   // inward normal x: >0 faces right (away from the light)

layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the tower wall: coursed ashlar bent round the curve; courses read as curves; tide and salt bands; dark where it turns away
{
  raw(ashlar(wallAt, ARC, 15, STONE, { scale: 1.0, rough: true, roughP: 0.3, vary: 0.26, mortar: 0.6, lost: 0.2, spall: 0.25, weather: { algae: 0.25, salt: 0.35, saltCol: '#b4bcb0' }, barnBands: [[0.0, 0.6, 140], [3.4, 3.8, 90]], barnCol: '#8a8c80' }));
  // shading by facing: the left of the arc faces away from the light (heavy crosshatch), the back half-lit, the right lit
  const n = 40; for (let i = 0; i < n; i++) { const s0 = ARC * i / n, s1 = ARC * (i + 1) / n, f = faceLit((s0 + s1) / 2); if (f > -0.2) raw(hatch3(wallAt, s0, s1 + 0.05, 0, 15, 0.75, { op: Math.min(0.6, 0.25 + f * 0.4), ragged: 0.15 })); if (f > 0.35) raw(hatch3(wallAt, s0, s1 + 0.05, 0, 15, -0.8, { op: Math.min(0.5, f * 0.45), ragged: 0.15 })); }
  // a dark band low on the wall (the fighters' quiet band), stepped
  for (const [y, op] of [[3.2, 0.12], [2.4, 0.14], [1.6, 0.16], [0.8, 0.16]]) { const pts = []; for (let k = 0; k <= 40; k++) pts.push(P(...wallAt(ARC * k / 40, y + Math.sin(k * 1.3) * 0.1))); raw(`<path d="${p2([...pts, P(...wallAt(ARC, -0.5)), P(...wallAt(0, -0.5))])}" fill="${MURK}" opacity="${op}"/>`); }
  // the sockets of the fallen ringing floor: square holes in a course round the tower, snapped joists in some, kelp from them
  for (let k = 1; k < 18; k++) { const s = ARC * k / 18 + (R() - 0.5) * 0.4, Y = 5.6 + (R() - 0.5) * 0.1, a = wallAt(s - 0.14, Y), b = wallAt(s + 0.14, Y + 0.3); const q = [P(a[0], a[1], a[2]), P(b[0], a[1], b[2]), P(b[0], b[1], b[2]), P(a[0], b[1], a[2])]; raw(`<path d="${p2(q)}" fill="#05090b" stroke="${INK}" stroke-width="1"/>`);
    if (R() < 0.5) { const c = wallAt(s, Y + 0.15), l = 0.6 + R() * 1.2, dx = XC - c[0], dz = ZC - c[2], d = Math.hypot(dx, dz), e = [c[0] + dx / d * l, Y + 0.15 - l * 0.15, c[2] + dz / d * l]; raw(line([P(...c), P(...e)], Math.max(2, K(c[2]) * 0.26), INK, 1) + line([P(...c), P(...e)], Math.max(1, K(c[2]) * 0.18), '#3a3026', 1)); }
    if (R() < 0.35) raw(I.kelp(wallAt(s, 0)[0], Y, wallAt(s, 0)[2] - 0.1, 0.6 + R() * 1.6, { w: 0.06 })); }
  // a second, higher course of sockets, half seen at the top of the frame
  for (let k = 0; k < 14; k++) { const s = ARC * (k + 0.5) / 14, a = wallAt(s - 0.15, 9.0), b = wallAt(s + 0.15, 9.3); raw(`<path d="${p2([P(a[0], a[1], a[2]), P(b[0], a[1], b[2]), P(b[0], b[1], b[2]), P(a[0], b[1], a[2])])}" fill="#05090b"/>`); }
  // verdigris runs from the iron cramps
  for (let i = 0; i < 18; i++) { const s = R() * ARC, top = 4 + R() * 4, A = P(...wallAt(s, top)), B = P(...wallAt(s, top - 1.5 - R() * 2)); raw(line([A, B], 1.5 + R() * 2.5, I.VERD, 0.18 + R() * 0.15)); }
}
// ---- the way it came: a torn absence in the tower wall, high behind the bell's crown; the chain rises out of it
{
  const s0 = ARC * 0.585;   // polish: left of the bell's shoulder, above the heads, where it stays visible
  raw(BK.tornVoid((s, t) => wallAt(s0 + (s - 0), t), 0, 9.2, 3.6, 2.4, { n: 56, rot: 0.15, lobes: [[3.5, 1.0, 0.5], [0.3, 0.8, 0.45], [5.0, 0.6, 0.35], [1.7, 0.7, 0.3]], fray: [[3.3, 6, 0.5], [0.0, 5, 0.45], [4.6, 4, 0.35]], fraySize: 0.35, depth: 0.9, dir: [0.4, 0, 1], cut: '#1c2628', fissures: 5, fissLen: 1.0, fissW: 0.04, violet: true, lip: '#c8d4cc' }).svg);
  // a rope cut clean where a smaller absence crossed it: its upper part simply not there
  const rx = wallAt(ARC * 0.2, 0)[0] + 2.4, rz = 9.5, cut = 4.4; raw(line([P(rx, 12, rz), P(rx + 0.02, cut + 0.25, rz)], Math.max(1.6, K(rz) * 0.05), INK, 1) + line([P(rx, 12, rz), P(rx + 0.02, cut + 0.25, rz)], Math.max(0.8, K(rz) * 0.03), '#5a4a34', 1));
  raw(BK.tornVoid((s, t) => [rx - 0.3 + s, t, rz + 0.01], 0.3, cut, 0.16, 0.22, { rot: 0.4, fray: [[0.2, 3, 0.1]], depth: 0.1, cut: '#1c2628', fissures: 0 }).svg);
  raw(line([P(rx + 0.02, cut - 0.22, rz), P(rx, 1.7, rz)], Math.max(1.6, K(rz) * 0.05), INK, 1) + line([P(rx + 0.02, cut - 0.22, rz), P(rx, 1.7, rz)], Math.max(0.8, K(rz) * 0.03), '#5a4a34', 1));
}
// ---- the ringers' ropes: hanging out of the dark above, cut at every height; one with its woollen sally; a ladder
for (const [X, Z, end, sally] of [[-5.2, 11, 2.2, true], [-3.1, 12.5, 3.4, false], [-1.0, 13.5, 1.0, false], [1.2, 12.2, 4.6, false]]) {
  const top = P(X + 0.1, 12, Z), e = P(X, end, Z); raw(line([top, e], Math.max(1.6, K(Z) * 0.05), INK, 1) + line([top, e], Math.max(0.8, K(Z) * 0.03), '#5a4a34', 1));
  for (let k = 0; k < 5; k++) raw(line([e, [e[0] + (k - 2) * 1.2, e[1] + 4 + R() * 4]], 0.7, '#7a6a4c', 0.8));
  if (sally) { const a = P(X, end + 1.3, Z), b = P(X, end + 0.5, Z); raw(line([a, b], Math.max(4, K(Z) * 0.14), INK, 1) + line([a, b], Math.max(2.6, K(Z) * 0.1), '#3a4a5a', 1) + line([a, b], Math.max(2.6, K(Z) * 0.1), '#c8c0a8', 0.6, ' stroke-dasharray="2 3"')); }
}
{ // a ladder leaning to the fallen floor's sockets, rungs gone in places
  const a0 = P(-6.6, 0, 12.4), a1 = P(-6.0, 5.6, 13.6), b0 = P(-5.9, 0, 12.2), b1 = P(-5.4, 5.6, 13.4);
  raw(line([a0, a1], 3.4, INK, 1) + line([a0, a1], 1.8, '#3a3026', 1) + line([b0, b1], 3.4, INK, 1) + line([b0, b1], 1.8, '#3a3026', 1));
  for (let k = 1; k < 14; k++) { if (k === 5 || k === 9 || k === 10) continue; const u = k / 14; raw(line([[a0[0] + (a1[0] - a0[0]) * u, a0[1] + (a1[1] - a0[1]) * u], [b0[0] + (b1[0] - b0[0]) * u, b0[1] + (b1[1] - b0[1]) * u]], 2.4, INK, 1)); }
}
raw(`<rect width="${W}" height="${H}" fill="${MURK}" opacity="0.34"/>` + G.edges(MURK, { l: 380, t: 140, steps: [0.14, 0.14, 0.16, 0.18] }));
// ---- the shafts from the bell openings above the left: hard, cold, crossing the tower to the right wall and the stage
for (const [x, w, len, op, sk] of [[180, 70, 520, 0.32, 1.25], [320, 110, 560, 0.36, 1.2], [470, 60, 520, 0.26, 1.15], [40, 40, 420, 0.2, 1.3]]) raw(G.shaft(x, -10, w, len, sk, SH, { op, fill: 0.09, spread: 40, gap: 4 }));
// where the shafts strike the curved wall: pale lit patches, stepped
for (const [s, y, w, h] of [[ARC * 0.62, 3.6, 2.4, 2.2], [ARC * 0.72, 2.4, 3.0, 2.0], [ARC * 0.9, 1.4, 2.2, 1.6]]) { const pts = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283, m = 0.8 + R() * 0.3; pts.push(P(...wallAt(s + Math.cos(a) * w / 2 * m + Math.sin(a) * 0.5, y + Math.sin(a) * h / 2 * m))); } raw(S.GLOW(`<path d="${smooth(pts, true, 0.5)}" fill="${SH}" opacity="0.14"/>`)); }
raw(I.motes(220, 0, 400, '#c8dcd4') + I.bubbles(26, 0, W, 20, 300, 1.4));
raw(G.edges(MURK, { l: 240, r: 60, t: 50, steps: [0.16, 0.18, 0.2, 0.22] }));
// ---- the floor: flags under drifted silt; the toll's rings pressed into the silt round the bell's lip; rope ends, a fallen sally
{
  raw(G.flags(-12, 16, 3.2, 14, '#4a5250', { size: 0.95, cracks: 14, vary: 0.18 }));
  // silt over most of it, thinning toward the front, its surface rippled in rings round the bell's stage (X 9, Z 6.6)
  const bx = 9.2, bz = 6.8;
  for (let r = 1.2; r < 9; r += 0.55 + r * 0.06) { const pts = []; for (let k = 0; k <= 48; k++) { const a = Math.PI * 0.95 + k / 48 * Math.PI * 1.1, X = bx + Math.cos(a) * r * 1.4, Z = bz - Math.sin(a) * r * 0.8; if (Z < 3.4) continue; pts.push(P(X, 0.01, Z)); } if (pts.length > 3) raw(line(pts, Math.max(0.8, 2.2 - r * 0.15), INK, 0.45) + line(pts.map(([x, y]) => [x, y - 1.2]), 1, '#a8b8b0', 0.35)); }
  raw(`<path d="${pp([[-12, 0.005, 9.5], [16, 0.005, 9.5], [16, 0.005, 14], [-12, 0.005, 14]])}" fill="#7a8278" opacity="0.18"/>`);
  for (let i = 0; i < 8; i++) { const X = -11 + R() * 26, Z = 4 + R() * 9; raw(G.puddle(X, Z, 0.6 + R() * 0.8, 0.3, '#0c1416', '#9ab4aa')); }
  raw(S.occBand((s, t) => [-12 + s, 0, 3.2 + t], 28, 1.0, { op: 0.4 }));
  for (const [z1, op] of [[14, 0.18], [8, 0.14], [5.5, 0.14], [4.2, 0.16]]) raw(`<path d="${pp([[-14, 0, 3.0], [18, 0, 3.0], [18, 0, z1], [-14, 0, z1]])}" fill="${MURK}" opacity="${op}"/>`);
}

// ======================================================================== MID: the fallen ringing floor heaped low at the left
layer('mid');
{
  const Z = 10.2; const pts = []; for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push(P(-8 + t * 7, Math.sin(t * Math.PI) * (0.9 - t * 0.4) + (R() - 0.5) * 0.06, Z)); }
  raw(`<path d="${smooth([P(-8.3, 0, Z), ...pts, P(-0.8, 0, Z)], true, 0.4)}" fill="#1a1c1a" stroke="${INK}" stroke-width="1"/>`);
  for (let k = 0; k < 9; k++) { const X = -7.8 + R() * 6, Y = R() * 0.6, l = 1.5 + R() * 2.5, a = (R() - 0.5) * 0.9, A = P(X, Y, Z - 0.3), B = P(X + Math.cos(a) * l, Y + Math.sin(a) * l * 0.4 + 0.2, Z - 0.3 + R()); raw(line([A, B], K(Z) * 0.2, INK, 1) + line([A, B], K(Z) * 0.13, '#2e2820', 1)); }
  raw(I.kelp(-5, 0.5, Z - 0.4, -0.5, { w: 0.05, col: '#141c14' }) + I.barnacles(...P(-4, 0.3, Z - 0.5), 12, 8, Z, '#5a5c54'));
  // a ringer's hand bell dropped in the silt, verdigris; a coil of rope
  const c = P(-0.6, 0.1, 9.0), k = K(9); raw(cel([[c[0] - k * 0.12, c[1]], [c[0] + k * 0.12, c[1]], [c[0] + k * 0.08, c[1] - k * 0.18], [c[0], c[1] - k * 0.22], [c[0] - k * 0.08, c[1] - k * 0.18]], { Z: 9, fill: '#2e4a40', band: 1 }));
}

// ======================================================================== FORE: joists of the first floor overhead, the stair turret door at the left
layer('fore');
{
  // the first floor's joists, snapped, jutting from the near wall over the top of the frame; a hanging board, kelp
  const ZN = 4.2;
  for (const [x0, y0, l, a, w] of [[-4.6, 2.6, 1.7, 0.1, 0.26], [-4.6, 3.0, 1.1, -0.05, 0.24], [-4.6, 2.25, 2.3, 0.18, 0.28], [4.8, 2.85, 0.8, Math.PI - 0.1, 0.26]]) {
    const A = [x0, y0], B = [x0 + Math.cos(a) * l, y0 + Math.sin(a) * l * 0.3], q = [[A[0], A[1]], [B[0], B[1]], [B[0], B[1] + w], [A[0], A[1] + w]].map(([x, y]) => P(x, y, ZN));
    raw(cel(q, { Z: ZN, fill: '#1c1812', tex: 'url(#mottle)', texOp: 0.5, band: 5 }) + `<path d="${p2(q)}" fill="${S.hatchA(3)}" opacity="0.45"/>`);
    const e = P(B[0], B[1] + w / 2, ZN); raw(`<path d="M${f1(e[0])} ${f1(e[1] - 12)} l${f1(Math.cos(a) * 14)} 4 l${f1(-Math.cos(a) * 6)} 4 l${f1(Math.cos(a) * 12)} 5 l${f1(-Math.cos(a) * 14)} 3 Z" fill="#6a5a40" stroke="${INK}" stroke-width="1"/>`);
    raw(I.kelp(B[0] - Math.cos(a) * 0.4, B[1], ZN - 0.05, 0.3 + R() * 0.4, { w: 0.04, col: '#141c14' }));
  }
  // the stair turret's door at the left edge: a round-headed dark doorway, the newel steps winding up inside, ashlar jamb
  const Zd = 4.6, at = (s, t) => [-6.4 + s, t, Zd];
  raw(ashlar(at, 1.6, 4.5, '#2a3234', { scale: 0.7, rough: true, vary: 0.2 }) + hatch3(at, 0, 1.6, 0, 4.5, 0.8, { op: 0.45 }) + hatch3(at, 0, 1.6, 0, 4.5, -0.7, { op: 0.35 }));
  const dq = G.arch(-6.2, -5.15, 1.8, 'round', { n: 6 }).map(([x, y]) => P(x, y, Zd)); raw(`<path d="${p2(dq)}" fill="#05080a" stroke="${INK}" stroke-width="2.4"/>`);
  for (let k = 0; k < 5; k++) { const y = 2.0 - k * 0.32, A = P(-6.15, y, Zd + 0.5), B = P(-5.4 - k * 0.08, y + 0.1, Zd + 0.5); raw(line([A, B], 2, '#3a4446', 0.8)); }
  raw(I.barnacles(...P(-5.6, 0.3, Zd), 30, 16, Zd, '#5a5c54'));
  for (const [cx, sd] of [[60, -1], [W - 50, 1]]) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([cx + sd * (t - 0.5) * 180, H - 10 - Math.sin(t * Math.PI) * (20 + R() * 8)]); } raw(G.rockMass([[cx - 100, H + 4], ...pts, [cx + 100, H + 4]], 3.5, '#121a1c', { fiss: 3, hop: 0.6 })); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, x_to: 1480, note: 'right 45%: ruler centred about x 1165 at 1x' } }, null, 1));
console.log(ROOM, 'layers written');
