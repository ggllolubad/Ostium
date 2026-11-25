// World VIII, the Sundered Rime: THE GLACIER (battle room, Living Ink). Room key 'rime_glacier'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Cracked Floe (thralls hacking at the ice; something moves beneath it), Two-Faced Oracle (she speaks in
// fire and frost).
// The place: the open glacier above the hold at dusk. The ice runs away to a chain of mountains; behind them a fissure
// in the glacier breathes fire, and its ash plume climbs into the sky with its underside lit orange from below: the
// room's light. Nearer, a field of seracs tilts out of the ice, and columns of steam stand up from fissures across the
// glacier, orange at their roots. On a rock outcrop far off the hold's turf roofs and its headframe. Under the company the
// floe is cracked into plates; the thralls' cutting runs across it (a trench hacked into the ice, blocks stacked, picks
// left in it, a sledge); under a clear patch a long dark shape lies in the ice with a glowing wake (the fissure worm). At
// the left stands the seeress's rune-stone, one face frosted and one charred.
// Courses: FROST (the glacier, seracs, rime, icicles, wind-carved snow); FIRE (the fissures, steam, the plume, ash, char).
// Palette: white and blue ice, orange glow, black obsidian; no red, no gold, no eyes, no lightning.
// Usage: node scenes/bg_rime_glacier.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VIII');
const W = 1480, H = 480, ROOM = 'rime_glacier';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 8303, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#f4f8fc', shadowTint: '#1a2a3a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#8a9cb0', murk: '#1c2834' });
const { BK, BL, air, clouds, glare, ridge, plates, wedges, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, seam, seamTree, ash, steam, icicles, rime, box, post, beam, char } = BK;

const SNOW = '#e8f0f4', ICE = '#c8dce6', ICE2 = '#8ab0c4', ICE3 = '#4a7890', OBS = '#16131a', OR = '#ff8a2a', HOT = '#ffd98a', EMB = '#c24e14', MURK = '#1c2834';
const PX = 980;                                   // the plume's root on the horizon (screen x)

// ======================================================================== FAR
layer('far');
// ---- the dusk sky: cold slate above, paler toward the horizon; the ash plume climbing from behind the mountains, its
// underside lit orange by the fire under it, grey and black above; ash falling out of it
{
  raw(`<rect width="${W}" height="${H}" fill="#6a7a8c"/>` + G.skyGrad([[0, '#2a3442'], [0.35, '#3e4a5a'], [0.7, '#6e7c8a'], [0.9, '#8a96a0']], { y0: 0, y1: 300 }));
  for (let i = 0; i < 7; i++) raw(G.softCloud(-60 + R() * 760, 40 + R() * 160, 260 + R() * 260, 40, { mid: '#4a5666', shade: '#36404e', lit: '#7a8898', op: 0.7, inkOp: 0.08 }));
  // the plume: soft billowing masses climbing from the fissure behind the mountains, leaning with the wind, their
  // undersides lit orange by the fire; spreading into a dark anvil overhead, ash falling out of it in veils
  raw(G.radGlow(PX, 280, 420, 130, OR, 0.5, { mid: 0.3, midOp: 0.5 }));
  raw(G.softSteam(PX, 290, 280, 110, { n: 16, col: '#3a3438', op: 1, drift: 0.9, wisps: 5 }));
  raw(G.softSteam(PX, 290, 150, 80, { n: 9, col: '#d8743a', op: 0.75, drift: 0.6, wisps: 2 }));
  for (let i = 0; i < 8; i++) raw(G.softCloud(PX + 40 + i * 70 + R() * 30, 50 + R() * 40, 220 + R() * 100, 50, { mid: '#2c2a30', shade: mix('#2c2a30', '#c86a34', 0.4), lit: '#4a4448', op: 0.92, inkOp: 0.08 }));
  for (let i = 0; i < 40; i++) { const x = PX - 60 + R() * 560, y = 80 + R() * 60, l = 40 + R() * 90; raw(`<path d="M${f1(x)} ${f1(y)} l${f1(-l * 0.15)} ${f1(l)}" stroke="#4a4448" stroke-width="${f1(1 + R() * 2)}" opacity="0.25" filter="url(#soft)"/>`); }
}
// ---- the mountains: a far chain (palest, bluest) and a nearer ridge, snow on the faces toward the light, the near
// ridge's crest rimmed by the plume's glow; the plume's root behind them
{
  raw(G.mountains(-40, W + 40, 300, 110, { peaks: [[0.08, 0.5], [0.24, 1], [0.42, 0.45], [0.6, 0.7], [0.78, 0.35], [0.93, 0.8]], rough: 0.25, iter: 5, e0: 0.1, e1: 0.15, col: '#7a8a9c', snow: '#b8c6d2', shade: '#6a7888', Z: 400, inkOp: 0.35 }).svg);
  const r2 = G.mountains(-40, W + 40, 300, 54, { peaks: [[0.15, 0.9], [0.38, 0.35], [0.56, 1], [0.86, 0.5]], rough: 0.3, iter: 5, e0: 0.05, e1: 0.05, col: '#5a6878', snow: '#a8b8c6', shade: '#4a5666', Z: 200, inkOp: 0.5 });
  raw(r2.svg + line(r2.top.filter(p => Math.abs(p[0] - PX) < 300), 2, '#e0884a', 0.55));
}
// ---- the hold far off on a rock outcrop: turf-roofed longhouses, the headframe, a thread of smoke
{
  const Z = 160, b = P(-46, 0, Z), k = K(Z);
  raw(fillS([[b[0] - k * 14, b[1] + 2], [b[0] - k * 8, b[1] - k * 5], [b[0] + k * 4, b[1] - k * 7], [b[0] + k * 16, b[1] - k * 2], [b[0] + k * 20, b[1] + 2]], '#3a4250'));
  for (const [dx, w] of [[-6, 9], [5, 11]]) { const x = b[0] + k * dx, y = b[1] - k * 6.5; raw(fillP([[x - k * w / 2, y], [x - k * w * 0.42, y - k * 2], [x + k * w * 0.42, y - k * 2.2], [x + k * w / 2, y]], '#4a4a3e') + line([[x - k * w * 0.42, y - k * 2], [x + k * w * 0.42, y - k * 2.2]], 1.4, '#8a9aa8', 0.7)); }
  raw(line([[b[0] + k * 13, b[1] - k * 2], [b[0] + k * 15, b[1] - k * 9], [b[0] + k * 17, b[1] - k * 2]], 1, '#2a2a28') + line([[b[0] + k * 5, b[1] - k * 8.5], [b[0] + k * 8, b[1] - k * 20], [b[0] + k * 4, b[1] - k * 34]], 1.2, '#8a9098', 0.4));
}
// ---- the glacier to the mountains' feet: banded with crevasse lines, the seracs tilting out of it in a field on the
// right, steam columns standing up from fissures, orange at their roots
{
  raw(fillP([[-10, 296], [W + 10, 296], [W + 10, 360], [-10, 360]], '#b8c8d4'));
  for (let i = 0; i < 26; i++) { const Z = 40 + Math.pow(R(), 0.6) * 300, X = (R() - 0.5) * Z * 2.6, a = P(X, 0, Z), l = K(Z) * (6 + R() * 20); raw(line([[a[0] - l / 2, a[1]], [a[0] + l / 2, a[1] + (R() - 0.5) * 2]], Math.max(0.6, K(Z) * 0.25), '#6a8496', 0.6)); }
  // seracs: tilted blocks of glacier ice, far ones small and blue, standing in rows
  for (const [Z, x0, x1, n] of [[90, 2, 60, 14], [60, 8, 40, 12], [40, 10, 30, 9]]) raw(plates(Array.from({ length: 8 }, (_, i) => P(x0 + (x1 - x0) * i / 7, 0, Z + Math.sin(i * 1.7) * 6)), n, { size: [K(Z) * 1.5, K(Z) * 4.5], cols: [air('#f0f6fa', Z, { z0: 20, z1: 200, max: 0.4 }), air('#9cc0d4', Z, { z0: 20, z1: 200, max: 0.4 }), air('#4a7890', Z, { z0: 20, z1: 200, max: 0.4 })], rime: '#ffffff', Z, ink: 0.7, hatchOp: 0.15 }));
  // the fissures' steam: columns rising, their roots orange, bending with the wind
  for (const [X, Z, h] of [[-30, 70, 120], [-12, 46, 150], [16, 85, 110], [-44, 110, 90]]) { const c = P(X, 0, Z); raw(EM(seam([[c[0] - K(Z) * 1.5, c[1]], [c[0], c[1] + 0.6], [c[0] + K(Z) * 1.5, c[1]]], 1.2, { glowW: 10, glowOp: 0.3 })) + G.softSteam(c[0], c[1] - 4, h, 18 + h * 0.08, { col: '#e8e4e0', op: 0.4, n: 9, drift: 0.35, hotN: 2, hot: '#f0a060' })); }
}
// ---- the quiet band: stepped toward a cold murk behind the fighters
raw(BL.quiet(MURK, 244, 350, { steps: [0.05, 0.07, 0.09, 0.11], hop: 0.1 }));
// ---- the floe the company stands on: plates of glacier ice, cracked, wind-carved snow on them, the cracks converging
{
  const at = (s, t) => [-30 + s, 0, 4 + t], Lz = 34;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="#c4d4de"/>`);
  for (let i = 0; i < 80; i++) { const X = -24 + R() * 48, Z = 4.4 + Math.pow(R(), 0.85) * 30, w = 1.2 + R() * 3.6, d = 0.8 + R() * 2.4, q = [[X, 0.01, Z], [X + w, 0.01, Z + (R() - 0.5) * 0.4], [X + w * 0.92, 0.01, Z + d], [X + 0.08, 0.01, Z + d * 0.92]].map(p => P(...p)); raw(cel(chip(q, 0.4), { Z, fill: air(tone(R() < 0.5 ? '#dce8ee' : '#b8ccd8', 0.06), Z, { z0: 10, z1: 60, max: 0.3 }), band: Math.max(0.6, K(Z) * 0.025), shadow: '#7a9aae', hi: false, inkW: 0.5, heavy: 0.8 })); }
  // sastrugi running with the wind toward the mountains (converge)
  for (let i = 0; i < 50; i++) { const X = -18 + R() * 36, Z = 4.4 + Math.pow(R(), 0.9) * 14, dz = 1 + R() * 2.4, A = P(X, 0, Z), B2 = P(X, 0, Z + dz), h = Math.max(0.8, K(Z) * 0.045); raw(`<path d="M${f1(A[0] - h)} ${f1(A[1])} L${f1(B2[0])} ${f1(B2[1])} L${f1(A[0] + h)} ${f1(A[1])} Z" fill="${SNOW}" opacity="0.85"/><path d="M${f1(A[0] + h * 0.3)} ${f1(A[1])} L${f1(B2[0])} ${f1(B2[1])}" stroke="#7a94a6" stroke-width="${f1(Math.max(0.5, h * 0.5))}" opacity="0.6"/>`); }
  // the long cracks of the floe running away, black water frozen in them, a warm seam in one (fire under the ice)
  for (let i = 0; i < 6; i++) raw(crack((s, t) => [s, 0.003, t], -16 + R() * 32, 4.6 + R() * 3, 6 + R() * 8, Math.PI / 2 + (R() - 0.5) * 0.7, { w: 1.1, lip: '#f4f8fc', op: 0.75 }));
  { const pts = []; for (let i = 0; i <= 12; i++) pts.push(P(5 + i * 0.9 + Math.sin(i) * 0.3, 0.01, 16 + i * 1.4)); raw(EM(seam(pts, 1.4, { glowW: 6, glowOp: 0.2 })) + steam(pts[4][0], pts[4][1], 40, { n: 2, op: 0.2 })); }
  // the thralls' cutting: a trench hacked across the floe behind the fighters, its far wall faceted with pick scars, ice
  // blocks stacked at its lip, picks and a wedge left in it
  { const z0 = 13.2, z1 = 14.4, x0 = -15, x1 = 9, dep = 1.1;
    raw(fillP([P(x0, 0, z0), P(x1, 0, z0), P(x1, 0, z1), P(x0, 0, z1)], '#2a4658'));
    raw(fillP([P(x0, -dep, z1), P(x1, -dep, z1), P(x1, 0, z1), P(x0, 0, z1)], '#7aa0b6') + hatch3((s, t) => [x0 + s, -dep + t, z1], 0, x1 - x0, 0, dep, 0.9, { op: 0.3 }));
    for (let i = 0; i < 14; i++) { const X = x0 + 1 + R() * (x1 - x0 - 2), c = P(X, -dep * 0.5, z1); raw(BK.pickScars(c[0], c[1] - 3, K(z1) * 0.25, 3 + Math.floor(R() * 3), 1.2 + (R() - 0.5) * 0.5, { w: 0.9, op: 0.6 })); }
    raw(pline([P(x0, 0, z0), P(x1, 0, z0)], 1.4, INK) + pline([P(x0, 0, z1), P(x1, 0, z1)], 1.0, INK, 0.7) + BL.rimeEdge([P(x0, 0.02, z0), P(x1, 0.02, z0)], { w: 1.4, col: SNOW }));
    for (const [X, n] of [[-13, 3], [-6.5, 2], [5.5, 3]]) for (let j = 0; j < n; j++) { const bx = X + j * 0.75, by = (j % 2) * 0.4; raw(BK.box(bx, bx + 0.7, by, by + 0.4, z0 - 0.9, z0 - 0.4, { col: '#a8c4d4', shadeOp: 0.35 })); }
    for (const X of [-9.8, 1.6]) { const a = P(X, 0, z0 + 0.4), b = P(X + 0.3, 0.9, z0 + 0.3); raw(line([a, b], 2.4, INK) + line([a, b], 1.3, '#4a3a2a') + pline([[b[0] - 5, b[1] + 3], [b[0], b[1]], [b[0] + 6, b[1] + 2]], 3, INK) + pline([[b[0] - 5, b[1] + 3], [b[0], b[1]], [b[0] + 6, b[1] + 2]], 1.6, '#3a3838')); } }
  raw(occBand((s, t) => [-30 + s, 0, 4 + t], 60, 1.0, { op: 0.25 }));
}
// ---- the seeress's rune-stone at the left: a tall standing stone, its windward face frosted white, its other face
// charred black with a glowing seam in the cut runes; the split between them steaming
{
  const Z = 12.5, X = 0.4, k = K(Z), b = P(X, 0, Z);
  const st = [[b[0] - k * 0.5, b[1] + 1], [b[0] - k * 0.58, b[1] - k * 0.8], [b[0] - k * 0.46, b[1] - k * 1.7], [b[0] - k * 0.5, b[1] - k * 2.2], [b[0] - k * 0.22, b[1] - k * 2.62], [b[0] + k * 0.08, b[1] - k * 2.5], [b[0] + k * 0.34, b[1] - k * 2.2], [b[0] + k * 0.44, b[1] - k * 1.3], [b[0] + k * 0.54, b[1] - k * 0.5], [b[0] + k * 0.46, b[1] + 1]];
  const half = [[b[0] - k * 0.02, b[1] + 1], [b[0] + k * 0.06, b[1] - k * 0.9], [b[0] - k * 0.04, b[1] - k * 1.7], [b[0] + k * 0.02, b[1] - k * 2.52], ...st.slice(5)];
  raw(cel(st, { Z, fill: '#7a868e', band: 3, tex: 'url(#mottle)', texOp: 0.6 }) + fillP(st.slice(0, 5).concat([[b[0], b[1] + 1]]), '#c8d4dc', 0.45) + fillP(half, '#1e1a1c') + fillP(half, 'url(#mottle)', 0.5) + fillP(half, S.hatchA(Z), 0.3) + EM(seam([half[3], half[2], half[1], half[0]], 1.2, { glowW: 5, glowOp: 0.2 })) + rime(st.slice(0, 5).reverse(), Z, { th: 3 }) + inkP(st, 1.2));
  for (let i = 0; i < 3; i++) raw(crack((s2, t2) => [X - 0.4 + s2, t2, Z - 0.05], 0.05, 0.4 + i * 0.7, 0.3, 0.3 + (R() - 0.5), { w: 0.8, op: 0.6, lip: '#c8d4dc', branch: 0 }));
  // runes: a serpent band on each face, cut lines; glowing in the charred face
  { let d = ''; { const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([b[0] - k * 0.3 + Math.sin(t * 9) * k * 0.08, b[1] - k * (0.4 + t * 1.9)]); } d += 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' '; for (let i = 0; i < 6; i++) { const y = b[1] - k * (0.55 + i * 0.3); d += `M${f1(b[0] - k * 0.38)} ${f1(y)} l${f1(k * 0.06)} ${f1(-k * 0.08)} `; } } raw(`<path d="${d}" stroke="${INK}" stroke-width="1" fill="none" opacity="0.8"/>`); let e = ''; for (let i = 0; i < 6; i++) { const y = b[1] - k * (0.45 + i * 0.32); e += `M${f1(b[0] + k * 0.12)} ${f1(y)} l${f1(k * 0.1)} ${f1(-k * 0.14)} M${f1(b[0] + k * 0.28)} ${f1(y)} l0 ${f1(-k * 0.16)} `; } raw(EM(`<path d="${e}" stroke="${OR}" stroke-width="1.2" fill="none" opacity="0.85"/>`)); }
  raw(G.softSteam(b[0], b[1] - k * 2.6, 50, 8, { n: 5, op: 0.3 }) + BL.icicles([st[1][0], st[1][1]], [st[2][0], st[2][1]], 3, { max: 8, col: SNOW }));
  // the seeress's offerings at its foot: a ring of stones round a cold fire, burnt bones, a frozen bowl
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, c = P(X + 1.4 + Math.cos(a) * 0.7, 0.05, Z - 0.6 + Math.sin(a) * 0.5); raw(lump(blob(c[0], c[1], 3.4, 2, 7, 0.4), Z, '#4a4a50', { band: 1 })); }
  { const c = P(X + 1.4, 0.02, Z - 0.6); raw(char(c[0], c[1], 12, 3, { Z }) + EM(fillS(blob(c[0], c[1], 4, 1.2, 7, 0.4), EMB, 0.8))); }
}
// falling ash and fine snow together
raw(ash(50, 700, W, 60, 290, { r: 1.6, op: 0.4 }) + snowfall(100, { len: 2, slant: 0.5, op: 0.45, y1: 330 }));

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  // the thing under the ice: a clear patch of black glacier ice, and under it a long pale segmented shape lying curled,
  // a dull orange wake melted behind it (the fissure worm moving beneath)
  const Z = 9.6, c = P(3.4, 0, Z), k = K(Z);
  const ol = S.blobST(c[0], c[1], k * 4.4, k * 0.34, 16, 0.25);
  raw(fillS(ol, '#2a4a5e', 0.95) + inkP(ol, 0.9, 0.7));
  { const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([c[0] - k * 1.8 + k * 3.4 * t, c[1] + Math.sin(t * 5) * k * 0.06]); } raw(EM(line(pts.slice(0, 7), k * 0.06, '#a8401a', 0.55)) + `<g opacity="0.55">${line(pts.slice(5), k * 0.1, '#c8c0b0')}${pts.slice(6).map(([x, y], i) => i % 2 ? '' : pline([[x, y - k * 0.04], [x, y + k * 0.04]], 0.8, INK)).join('')}</g>`); }
  raw(fillS(ol, '#c8dce6', 0.15) + pline(ol.slice(9, 14), 1, '#f4f8fc', 0.6));
  // the thralls' sledge, low, with a block of ice and a coil of rope, rimed
  const Z2 = 11, k2 = K(Z2), s0 = P(-6.4, 0, Z2);
  raw(line([[s0[0] - k2 * 0.9, s0[1]], [s0[0] + k2 * 0.9, s0[1]], [s0[0] + k2 * 1.05, s0[1] - k2 * 0.15]], 2.6, INK) + line([[s0[0] - k2 * 0.9, s0[1]], [s0[0] + k2 * 0.9, s0[1]], [s0[0] + k2 * 1.05, s0[1] - k2 * 0.15]], 1.4, '#5a4a36'));
  raw(BK.box(-7.2, -6.0, 0.2, 0.62, Z2 - 0.3, Z2 + 0.3, { col: '#a8c4d4', shadeOp: 0.35 }) + BK.box(-7.3, -5.9, 0.12, 0.2, Z2 - 0.35, Z2 + 0.35, { col: '#4a3c2c', shadeOp: 0.5 }));
}

// ======================================================================== FORE: framing
layer('fore');
{
  // left: a serac leaning in at the frame edge, its face blue, its edge toward the light white, icicles, a pick driven in
  const sl = [[-10, 120], [26, 96], [56, 180], [64, 330], [52, H + 10], [-10, H + 10]];
  raw(cel(sl, { Z: 4, fill: '#6a94ac', band: 12, shadow: '#2a4a5e' }) + fillP(sl, S.hatchA(4), 0.25) + BL.rimeEdge([[26, 96], [56, 180], [64, 330]], { w: 5, col: SNOW }) + rime([[-10, 120], [26, 96]], 4, { th: 6 }));
  for (let i = 0; i < 5; i++) { const y = 160 + i * 60; raw(line([[0, y], [44, y + 8 + R() * 10]], 1.4, '#3a6078', 0.6)); }
  raw(BL.icicles([26, 98], [-10, 122], 4, { max: 30, col: SNOW }));
  // bottom right: the thralls' second sledge, loaded with cut blocks, its runner curling up at the front, low in the corner
  const by = H + 2; raw(line([[W - 300, by + 10], [W + 10, by + 6]], 8, INK) + line([[W - 300, by + 10], [W + 10, by + 6]], 5, '#4a3a28') + line([[W - 300, by + 10], [W - 330, by - 8], [W - 318, by - 20]], 8, INK) + line([[W - 300, by + 10], [W - 330, by - 8], [W - 318, by - 20]], 5, '#4a3a28'));
  for (let j = 0; j < 3; j++) { const x = W - 200 + j * 70, q = [[x, by + 2], [x + 64, by + 2], [x + 62, by - 30 - (j % 2) * 6], [x + 4, by - 28 - (j % 2) * 6]]; raw(cel(q, { Z: 3.6, fill: tone('#a8c4d4', 0.08), band: 6, shadow: '#5a7c90' }) + BL.rimeEdge([q[3], q[2]], { w: 3, col: SNOW }) + BK.pickScars(x + 20, by - 30, 30, 3, 1.2, { w: 1.2, op: 0.5 })); }
  // a wind-drift across the bottom left
  { const bank = []; for (let k = 0; k <= 10; k++) bank.push([k * 34 - 10, H - 8 - Math.sin(k / 10 * Math.PI) * 18 - R() * 5]); raw(cel([[-10, H + 4], ...bank, [330, H + 4]], { Z: 3.6, fill: '#d0dde6', band: 4, shadow: '#8aa4b6' }) + BL.rimeEdge(bank, { w: 3, col: '#ffffff' })); }
  raw(ash(26, 600, W, 0, 300, { r: 2.4, op: 0.5 }) + snowfall(80, { len: 4, slant: 0.5, op: 0.5, w: 1.6 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
