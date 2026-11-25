// World VIII, the Sundered Rime: THE RIVEN GLACIER (boss room, Living Ink). Room key 'rime_boss'. Boss: The Riven Jarl
// ("Half his body froze in the fall, half burned. He rules the split between."), with an Obsidian Shieldmaiden.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430). The right 45 % of the frame is the boss's stage.
// The place: the split itself, at night. Where the jarl's hall fell, the glacier tore in two and its halves heaved apart.
// Polish round (Cole): FIRE LEFT, ICE RIGHT, to match the jarl's own split: on the left a cliff of black glass where the
// fire came up and froze, on the right a cliff of white glacier ice, rimed, leaning in. Between them the split runs away to the horizon, a gulf glowing orange from the magma far below, and from it a
// pillar of steam and ash climbs into the night, lit from underneath: the brightest light in the world, standing exactly
// behind the jarl's throne at the brink. The ground repeats his body: the left of the frame burned (black glass, seams, the hold's
// burnt standard), the right frozen (snow and rime under the throne); a crack runs from the throne across the floor toward
// the company and forks.
// Courses: FROST and FIRE everywhere, split. Palette: white ice, black obsidian, molten orange; no red, no gold, no eyes.
// Usage: node scenes/bg_rime_boss.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VIII');
const W = 1480, H = 480, ROOM = 'rime_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 8505, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#f0f4f8', shadowTint: '#100a0c' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#1a1e28', murk: '#0a0a0e' });
const { BK, BL, air, clouds, glare, ridge, plates, wedges, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, seam, seamTree, ash, steam, icicles, rime, char } = BK;

const ICE = '#c8dce6', ICE2 = '#7aa0b8', ICE3 = '#3a5a70', OBS = '#121016', OBS2 = '#2a2630', OR = '#ff8a2a', HOT = '#ffd98a', EMB = '#c24e14', FROST = '#dce8ee', MURK = '#0a0a0e';
const VX = 960, VY = 296;                        // the split's far end on the horizon (screen)

// ======================================================================== FAR
layer('far');
// ---- the night: black-blue, a few hard stars, the pillar of steam and ash rising from the split lit orange underneath
{
  raw(`<rect width="${W}" height="${H}" fill="#10141c"/>` + G.skyGrad([[0, '#06080c'], [0.45, '#0e121a'], [0.8, '#1a1e2a'], [1, '#2a2228']], { y0: 0, y1: 310 }));
  { let st = ''; for (let i = 0; i < 90; i++) { const x = R() * 900, y = R() * 220, r = 0.4 + Math.pow(R(), 3) * 1.4; st += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#dce4ee" opacity="${f1(0.3 + R() * 0.6)}"/>`; } raw(st); }
  // the pillar: soft billowing masses of steam and ash rising from the split behind the throne, lit orange from below,
  // darkening as they rise and spread into a canopy over the stage; wisps tearing off with the wind
  raw(G.radGlow(VX - 40, 280, 560, 260, OR, 0.45, { mid: 0.3, midOp: 0.5 }));
  raw(G.softSteam(VX - 20, 310, 320, 120, { n: 16, col: '#5a3a30', op: 1, drift: -0.45, wisps: 5 }));
  raw(G.softSteam(VX - 20, 310, 200, 80, { n: 10, col: '#e88a4a', op: 0.85, drift: -0.4, wisps: 3 }));
  raw(G.softSteam(VX - 10, 310, 90, 40, { n: 6, col: '#ffc890', op: 0.9, drift: -0.2, wisps: 0 }));
  for (let i = 0; i < 7; i++) raw(G.softCloud(VX - 360 + i * 110 + R() * 40, 30 + R() * 60, 240 + R() * 120, 50, { mid: '#1e1a1e', shade: '#3a2420', lit: '#2e2a2e', op: 0.9, inkOp: 0.08 }));
  raw(ash(70, VX - 400, VX + 260, 0, 280, { r: 1.8, op: 0.5 }));
  { let m = ''; for (let k = 0; k < 70; k++) m += `<circle cx="${f1(VX - 300 + R() * 520)}" cy="${f1(40 + R() * 260)}" r="${f1(0.5 + R() * 1)}" fill="${HOT}" opacity="${f1(0.4 + R() * 0.5)}"/>`; raw(EM(m)); }
}
// ---- the far glacier: the plain to the horizon on the left, pale under the night, mountains faint; the hold's ruin far
// off on the frozen side
{
  raw(fillP([[-10, 297], [W + 10, 297], [W + 10, 360], [-10, 360]], '#3a4a58'));
  raw(ridge(-40, 900, 300, 50, { peaks: [[0.2, 0.8], [0.45, 0.5], [0.7, 1]], rough: 0.25, iter: 5, col: '#242c38', snow: '#4a5a6c', shade: '#1a2028', Z: 300, inkOp: 0.3 }).svg);
  for (let i = 0; i < 20; i++) { const Z = 40 + Math.pow(R(), 0.6) * 200, X = -Z * 0.9 + R() * Z * 0.8, a = P(X, 0, Z), l = K(Z) * (6 + R() * 16); raw(line([[a[0] - l / 2, a[1]], [a[0] + l / 2, a[1]]], Math.max(0.6, K(Z) * 0.2), '#22303c', 0.6)); }
  // the hold's ruin: a split longhouse, its two halves fallen apart, one rimed one charred, small and dark
  { const Z = 70, b = P(-24, 0, Z), k = K(Z); raw(fillP([[b[0] - k * 6, b[1]], [b[0] - k * 5.5, b[1] - k * 2.6], [b[0] - k * 0.6, b[1] - k * 3.4], [b[0] - k * 0.2, b[1]]], '#4a5a66') + fillP([[b[0] + k * 0.6, b[1]], [b[0] + k * 1.2, b[1] - k * 3.0], [b[0] + k * 6, b[1] - k * 2.2], [b[0] + k * 6.4, b[1]]], '#1a1416') + EM(line([[b[0] + k * 1.2, b[1] - k * 2.8], [b[0] + k * 5.5, b[1] - k * 2.2]], 1, EMB, 0.7))); }
}
// ---- the split: running from the stage away to the horizon, its two lips, the walls dropping into the glow
{
  const lipL = [], lipR = []; for (let i = 0; i <= 20; i++) { const t = i / 20, Z = 12 + t * 120; lipL.push(P(6.4 - 3.5 * t + Math.sin(t * 9) * 0.4 - t * t * 2, 0, Z)); lipR.push(P(13.5 + 6 * t + Math.sin(t * 7) * 0.6, 0, Z)); }
  const gulf = [...lipL, ...lipR.slice().reverse()];
  raw(EM(fillP(gulf, '#6a2a10') + fillP(gulf.map(([x, y]) => [x, y + 3]), EMB, 0.8)));
  // the walls down into it: the glass wall (left lip) black, the ice wall (right lip) blue-white going down into orange
  raw(fillP([...lipL, ...lipL.slice().reverse().map(([x, y]) => [x + 10, y + 26])], OBS) + fillP([...lipR, ...lipR.slice().reverse().map(([x, y]) => [x - 12, y + 22])], ICE3) + line(lipR, 1.6, FROST, 0.9));
  raw(EM(line(lipL.map(([x, y]) => [x + 9, y + 24]), 3, OR, 0.8) + line(lipR.map(([x, y]) => [x - 11, y + 20]), 3, OR, 0.8)));
  for (let i = 0; i < 6; i++) { const t = R(), p = lipR[Math.floor(t * 20)]; raw(G.softSteam(p[0] - 20, p[1] + 10, 60 + R() * 60, 12, { n: 5, op: 0.25 })); }
}
// ---- the cliffs, the gate (flipped to match the jarl's own split: FIRE LEFT, ICE RIGHT): on the left of the stage a
// cliff of black glass where the fire came up and froze, leaning in, glowing seams in its cracks, its face toward the
// pillar rimmed orange; on the right a cliff of white glacier ice heaved up and leaning in from the frame edge, rimed,
// hung with icicles, steam at its foot
{
  const gc = [[590, 330], [620, 210], [650, 120], [698, 40], [730, -10], [820, -10], [790, 80], [774, 170], [760, 260], [770, 334]];
  raw(cel(gc, { Z: 20, fill: OBS, band: 10 }) + fillP(gc, 'url(#mottle)', 0.35) + fillP(gc, S.hatchA(16), 0.3));
  for (let i = 0; i < 8; i++) { const x = 640 + R() * 120, y = 40 + i * 36, r = 10 + R() * 16; raw(`<path d="M${f1(x - r)} ${f1(y)} Q${f1(x - r * 0.2)} ${f1(y - r * 0.9)} ${f1(x + r)} ${f1(y - r * 0.2)}" stroke="#6a7888" stroke-width="1" fill="none" opacity="0.6"/>`); }
  raw(EM(seam(jag([700, 40], [660, 300], 12, 8), 1.8, { glowOp: 0.16 }) + seam(jag([740, 120], [700, 220], 6, 4), 1.1, { glowOp: 0.12 }) + seam(jag([630, 220], [680, 320], 5, 3), 1.0, { glowOp: 0.1 })));
  raw(fillP([[760, 260], [774, 170], [790, 80], [820, -10], [830, -10], [802, 90], [786, 180], [774, 268]], '#ffb070', 0.6) + line([[774, 268], [786, 180], [802, 90], [830, -10]], 2.4, '#ffd098', 0.7));
  raw(ash(26, 600, 820, 20, 320, { r: 1.8, op: 0.5 }));
  // the ice cliff at the right edge
  const ic = [[1400, 340], [1420, 220], [1404, 120], [1430, 20], [1440, -10], [W + 10, -10], [W + 10, 345]];
  raw(cel(ic, { Z: 18, fill: ICE2, band: 8, shadow: ICE3 }) + fillP(ic, 'url(#mottle)', 0.35));
  for (let i = 0; i < 8; i++) { const y = 20 + i * 40, pts = [[1412, y + 12], [1450, y + 4 + R() * 6], [W + 10, y]]; raw(line(pts, 1.4, '#3a5a70', 0.6) + line(pts.map(([x, yy]) => [x, yy + 2]), 0.7, '#e8f4f8', 0.4)); }
  raw(line([[1400, 340], [1420, 220], [1404, 120], [1430, 20], [1440, -10]], 2.4, '#ffb070', 0.5) + rime([[1400, 340], [1420, 220], [1404, 120], [1430, 20], [1440, -10]], 18, { th: 5 }) + icicles([[1404, 122], [1430, 22]], 18, { len: 24, dens: 1 }) + icicles([[1420, 222], [1404, 124]], 18, { len: 18, dens: 1, ph: 2 }));
  raw(G.softSteam(1420, 340, 110, 24, { n: 6, op: 0.25 }));
}
// ---- the quiet band: stepped toward the night's murk behind the fighters
raw(BL.quiet(MURK, 240, 360, { steps: [0.1, 0.12, 0.15, 0.17], hop: 0.14 }));
// ---- the ground at the brink (flipped): the left of the frame burned (black glass, glowing seams, ash), the right frozen
// (snow, rime, cold) under the throne; the line between them follows the crack that runs from the throne toward the
// company and forks. Plates are broad and low-contrast, their joints soft, so the floor is not a tiling.
{
  const at = (s, t) => [-30 + s, 0, 4 + t], Lz = 28;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="#1c181a"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.4"/>`);
  const CR = Z => 4.6 + (Z - 4) * 0.14 + Math.sin(Z * 0.9) * 0.3;
  // burned half (left): black glass crust, broad plates with soft joints, glowing seams in some, ash drifts
  for (let i = 0; i < 46; i++) { const Z = 4.3 + Math.pow(R(), 0.8) * 22, X = -24 + R() * (CR(Z) + 22), w = 1.6 + R() * 3, d = 0.8 + R() * 2.2, q = [[X, 0.01, Z], [Math.min(CR(Z) - 0.2, X + w), 0.01, Z + (R() - 0.5) * 0.3], [Math.min(CR(Z + d) - 0.2, X + w * 0.9), 0.01, Z + d], [X + 0.1, 0.01, Z + d * 0.9]].map(p => P(...p)); raw(fillS(chip(q, 0.5), tone(OBS2, 0.12), 0.9, 0.3) + line([q[0], q[1]], 0.6, '#5a6070', 0.35) + (R() < 0.3 ? EM(seam([q[3], q[2]], Math.max(0.5, K(Z) * 0.012), { glowOp: 0.06 })) : '')); }
  for (let i = 0; i < 14; i++) { const Z = 4.6 + R() * 12, X = -20 + R() * 20, c = P(X, 0, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * (0.5 + R() * 0.8), k * 0.05, 10, 0.5), '#5a5658', 0.45)); }
  // frozen half (right): snow and rime under the throne, sastrugi, soft
  const right = []; for (let Z = 4; Z <= 32; Z += 1) right.push(P(CR(Z), 0.01, Z));
  raw(fillP([...right, P(30, 0, 32), P(30, 0, 4)], '#6a8094') + fillP([...right, P(30, 0, 32), P(30, 0, 4)], 'url(#mottle)', 0.3));
  for (let i = 0; i < 30; i++) { const Z = 4.3 + Math.pow(R(), 0.8) * 20, X = CR(Z) + 0.3 + R() * 12, a = P(X, 0.01, Z), l = K(Z) * (0.5 + R() * 1.4); raw(fillS([[a[0] - l / 2, a[1]], [a[0] - l * 0.1, a[1] - Math.max(1, K(Z) * 0.04)], [a[0] + l / 2, a[1]]], '#c8d8e4', 0.85)); }
  // the crack: from the throne toward the company, glowing at its root, frosted on its icy lip, forking
  { const pts = []; for (let Z = 12; Z >= 4.2; Z -= 0.5) pts.push(P(CR(Z), 0.02, Z)); raw(line(pts, 6, INK) + EM(seam(pts, 2.4, { glowW: 6, glowOp: 0.22 })) + rime(pts.slice(6).map(([x, y]) => [x + 4, y]), 8, { th: 3 }));
    for (const k of [6, 11]) { const p = pts[k], br = [p]; let x = p[0], y = p[1]; for (let j = 0; j < 6; j++) { x -= 18 + R() * 14; y += 3 + R() * 4; br.push([x, y]); } raw(line(br, 3, INK) + EM(seam(br, 1.2, { glowOp: 0.1 }))); } }
  raw(ash(40, 0, 900, 330, 470, { r: 1.6, op: 0.45 }));
  raw(occBand((s, t) => [-30 + s, 0, 4 + t], 60, 1.1, { op: 0.35 }));
}

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  // the jarl's housecarls' fallen gear on the frozen side: a split round shield half rimed, half charred, a broken spear
  const Z = 10.5, c = P(-5.2, 0.05, Z), k = K(Z);
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 0.45)}" ry="${f1(k * 0.09)}" fill="#5a646e" stroke="${INK}" stroke-width="1"/><path d="M${f1(c[0])} ${f1(c[1] - k * 0.09)} A${f1(k * 0.45)} ${f1(k * 0.09)} 0 0 1 ${f1(c[0])} ${f1(c[1] + k * 0.09)} Z" fill="#1a1416"/>` + EM(pline([[c[0], c[1] - k * 0.09], [c[0] + 1, c[1] + k * 0.09]], 1, EMB)));
  { const a = P(-3.4, 0.05, 9.8), b = P(-1.4, 0.08, 10.2); raw(line([a, b], 2.6, INK) + line([a, b], 1.4, '#5a4a3a') + rime([a, b], 9.8, { th: 1.4 })); }
  // obsidian boulders on the burned side, low, one dull seam each
  for (const [X, Z, r] of [[7.6, 11.2, 0.4], [10.5, 12.5, 0.5]]) { const c2 = P(X, r * 0.6, Z), rr = K(Z) * r; raw(lump(blob(c2[0], c2[1], rr, rr * 0.7, 10, 0.35), Z, OBS, { band: rr * 0.3 }) + EM(seam(jag([c2[0] - rr * 0.4, c2[1] - rr * 0.2], [c2[0] + rr * 0.3, c2[1] + rr * 0.3], 4, 1), 0.6, { glowOp: 0.05 }))); }
}

// ======================================================================== FORE: framing (left only; the stage is kept clear)
layer('fore');
{
  // left (the burned side): the hold's standard, planted at the edge and burned there: a tall pole charred and split with
  // seams, the cloth burnt to a ragged scrap with glowing edges, ash blowing off it; a scale cue (a man's height and more)
  const pole = [[44, H + 10], [56, -10]];
  raw(line(pole, 9, INK) + line(pole, 6, '#1e1614') + EM(seam(jag([48, 360], [54, 60], 10, 1.5), 1.2, { glowOp: 0.1 })));
  const fl = [[56, 30], [150, 40], [190, 70], [160, 92], [176, 126], [110, 112], [58, 132]];
  raw(cel(fl, { Z: 4, fill: '#2a2224', band: 6 }) + fillP(fl, 'url(#mottle)', 0.4) + EM(seam([[150, 40], [190, 70], [160, 92], [176, 126], [110, 112], [58, 132]], 1.4, { glowW: 4, glowOp: 0.16 })) + ash(20, 120, 300, 20, 160, { r: 2.2, op: 0.55 }));
  // obsidian shards and ash at the bottom left
  raw(plates([[-10, H + 6], [160, H + 4], [330, H + 8]], 9, { size: [20, 40], cols: ['#4a4e5a', OBS2, OBS], Z: 3.8, ink: 1.1, hatchOp: 0.3 }) + EM(seam(jag([20, H - 8], [260, H - 4], 8, 2), 1.4, { glowOp: 0.1 })));
  // bottom right (the frozen side): ice plates at the foot of the stage, rimed, low (they meet the throne's own ground)
  raw(plates([[960, H + 4], [1200, H + 2], [1490, H + 4]], 18, { size: [36, 62], cols: ['#e4ecf2', '#7a98ae', '#2a4458'], Z: 3.8, ink: 1.2, rime: FROST, hatchOp: 0.25 }));
  raw(ash(30, 0, 700, 0, H, { r: 2.4, op: 0.5 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
