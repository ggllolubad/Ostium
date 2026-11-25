// World III, the Boiling Baths: THE DRAINED CISTERN (room key `baths_cistern`), Living Ink, round 2 (group g1).
// The temple's great open reservoir on the hill above the pools, fed by the aqueduct and let down into the baths through
// the sluices. It has been drained: the company stands on its bed of sludge, under its high buttressed walls, ringed with
// the tide marks of every level the hot water stood at, cooked red-brown at the old boiling line and crusted white with
// scale below. Across the far wall's top the aqueduct still marches against the steam-white sky, one span fallen; its
// outfall, dry now, has left a frozen cascade of scale down the wall. The brute fed the leeches here.
// Encounter: "The Drained Cistern" (bath leeches, boiled brute).
// Space: open exterior, vast, below the ground line, in the empty basin; the walls converge on all three sides.
// Light: white steam-hazed noon, cool and flat; the light focus is the bright haze seen through the aqueduct's arches
// over the far wall. Shapes: aqueduct arches against the sky, buttressed walls, the sludge's curving runnels.
// Palette: light key, cool grey-green sludge, scale white, marble muted; boiled red only on the cooked tide line.
// Courses: fire (the cooked tide line, crazed and spalled marble, a baked crust on the sludge), water (scale, sludge, steam).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'III');
const W = 1480, H = 480, ROOM = 'baths_cistern';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2523, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#2a2a2a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, ashlar } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G;
const HAZE = '#c8ccc4', SKY = '#dfe2da', SLUDGE = '#5e6252', MURK = '#2a2c26';
const fog = G.fogger(HAZE, 12, 120, 0.7);
const T = G.III(fog);
const ZF = 42, XL = -18, XR = 22, TOPY = 8;           // far wall, side walls, wall top
// tide marks on a wall plane at(s,t) of length L: stained bands at each old level; the boiling line cooked red-brown,
// scale crust white under it, dried weed above the lowest
function tides(at, L, o = {}) {
  let s = '';
  for (const [y, c, w, op] of [[6.4, '#8a8a7a', 0.08, 0.5], [5.0, '#6a6a5a', 0.1, 0.5], [3.3, T.BOIL, 0.14, 0.6], [1.6, '#5a5e4e', 0.12, 0.55]]) { const pts = []; for (let k = 0; k <= 40; k++) pts.push(P(...at(L * k / 40, y + Math.sin(k * 1.3) * 0.04))); s += line(pts, Math.max(1, K(at(L / 2, 0)[2]) * w * 0.5), c, op); }
  // the white scale crust below the boiling line, ragged-edged
  const top = [], bot = []; for (let k = 0; k <= 40; k++) { top.push(P(...at(L * k / 40, 3.2 - R() * 0.15))); bot.push(P(...at(L * k / 40, 2.3 + R() * 0.3))); } s += `<path d="${p2([...top, ...bot.reverse()])}" fill="${T.SCALE}" opacity="0.35"/>`;
  return s;
}

layer('far');
// ---- the sky: steam-white haze, brighter low; thin drifts of steam from the baths below rising across it
raw(`<rect width="${W}" height="${H}" fill="${SKY}"/>`);
raw(G.bands([[-20, '#bcc0b8'], [50, '#c6cac2'], [110, '#d0d4cc'], [160, '#dadcd4'], [200, '#e4e6de']], { amp: 10 }));
for (let i = 0; i < 6; i++) raw(G.softSteam(100 + i * 260 + R() * 80, 260, 260, 70, { n: 8, op: 0.18, inkOp: 0.18, drift: 0.2, col: '#f4f4ee' }));
// ---- the aqueduct over the far wall (Z 70): two tiers of arches marching across, each span its own width; one fallen
{
  const Z = 72, y0 = TOPY - 2, h1 = 9, h2 = 6, spans = []; let X = -60; while (X < 70) { const w = 4.2 + R() * 3.3; spans.push([X, X + w]); X += w; }
  const BREAKS = [[3, 1, 0.5], [9, 2, 0.95], [14, 1, 0.35]];   // [first span, count, depth of the break into the upper tier]
  const col = fog('#a89a92', Z);
  for (const [tier, yb, h] of [[0, y0, h1], [1, y0 + h1 + 0.6, h2]]) {
    const ops = spans.map(([a, b], i) => (tier === 1 && BREAKS.some(([f, n]) => i >= f && i < f + n)) ? null : G.arch(a + 0.6, b - 0.6, yb + h * 0.55, 'round', { rise: (b - a - 1.2) / 2, n: 8 }).map(([x, y]) => [x, y === 0 ? yb : y]));
    const outer = [[-60, yb], [X, yb], [X, yb + h + 0.6], [-60, yb + h + 0.6]].map(([x, y]) => P(x, y, Z));
    const holes = ops.filter(Boolean).map(o => p2(o.map(([x, y]) => P(x, y, Z)))).join(' ');
    // the fallen span: on the upper tier two arches gone, the channel broken off in a ragged edge
    let body = `<path fill-rule="evenodd" d="${p2(outer)} ${holes}" fill="${col}" stroke="${fog(INK, Z, 0.8)}" stroke-width="0.8"/>`;
    if (tier === 1) for (const [f, n, dep] of BREAKS) { const a = spans[f][0], b = spans[f + n - 1][1], yl = yb + h * (1 - dep); const gap = [[a + 0.3, yl], [a + 0.7, yl + h * 0.3 * dep], [a + 0.4, yb + h + 0.8], [b - 0.2, yb + h + 0.8], [b - 0.9, yl + h * 0.4 * dep], [b - 0.3, yl - 0.2], [(a + b) / 2, yl - 0.4]].map(([x, y]) => P(x, y, Z)); body += `<path d="${p2(gap)}" fill="${SKY}"/>`; for (let k = 0; k < 4; k++) { const x = a + R() * (b - a), c = P(x, yl + R() * 0.5, Z); body += `<path d="M${f1(c[0])} ${f1(c[1])} l0 ${f1(4 + R() * 8)}" stroke="${fog('#ece8de', Z)}" stroke-width="1.5"/>`; } }
    raw(body);
    raw(hatch3((s2, t) => [-60 + s2, yb + t, Z], 0, X + 60, 0, h, 0.7, { op: 0.18 }));
  }
  // the channel's lip along the top, weeds and a scale beard where it leaked
  raw(cel([P(-60, y0 + h1 + h2 + 0.6, Z), P(X, y0 + h1 + h2 + 0.6, Z), P(X, y0 + h1 + h2 + 1.1, Z), P(-60, y0 + h1 + h2 + 1.1, Z)], { Z, fill: fog('#b4a8a0', Z), band: 1, hi: false }));
  // the haze glowing through the arches: the light focus, stepped
  raw(S.GLOW(`<ellipse cx="760" cy="150" rx="420" ry="90" fill="#ffffff" opacity="0.22"/><ellipse cx="760" cy="160" rx="240" ry="55" fill="#ffffff" opacity="0.25"/>`));
}
// ---- the far wall (Z 42): rough ashlar, buttressed, its top coping lit; tide marks; the dry outfall with its scale cascade
{
  const at = (s2, t) => [-40 + s2, t, ZF];
  raw(ashlar(at, 80, TOPY, fog('#9a8a82', ZF), { scale: 1.1, rough: true, roughP: 0.4, vary: 0.22, mortar: 0.5, spall: 0.25 }));
  raw(tides(at, 80) + hatch3(at, 0, 80, 0, 2.2, 0.8, { op: 0.25 }));
  raw(cel([P(-40, TOPY, ZF - 0.2), P(40, TOPY, ZF - 0.2), P(40, TOPY + 0.35, ZF - 0.2), P(-40, TOPY + 0.35, ZF - 0.2)], { Z: ZF, fill: fog('#d0c4bc', ZF), band: 1 }));
  // buttresses: stepped counterforts standing out from the wall at uneven spacing, each with its own weathering
  for (const X of [-14.5, -6.8, 7.6, 15.2]) { const d = 1.6, w = 1.5; for (const [y0, y1, dd] of [[0, 3.4, d], [3.4, 6.2, d * 0.7], [6.2, TOPY, d * 0.4]]) { const fr = [P(X, y0, ZF - dd), P(X + w, y0, ZF - dd), P(X + w, y1, ZF - dd), P(X, y1, ZF - dd)], sd = X < 0 ? [P(X + w, y0, ZF - dd), P(X + w, y0, ZF), P(X + w, y1, ZF), P(X + w, y1, ZF - dd)] : [P(X, y0, ZF - dd), P(X, y0, ZF), P(X, y1, ZF), P(X, y1, ZF - dd)];
      raw(cel(sd, { Z: ZF, fill: fog(X < 0 ? '#7a6c66' : '#b0a29a', ZF), tex: 'url(#mottle)', texOp: 0.4, band: 1 }) + cel(fr, { Z: ZF, fill: fog('#a09088', ZF), tex: 'url(#mottle)', texOp: 0.4, band: 1 })); }
    raw(tides((s2, t) => [X + s2, t, ZF - d - 0.01], w)); }
  // the dry outfall: a round-headed culvert near the top, its frozen cascade of scale down the wall to a cone of crust
  const ox = 0.6, op = G.arch(ox - 1.3, ox + 1.3, 5.6, 'round', { n: 8 }).map(([x, y]) => [x, y === 0 ? 4.6 : y]);
  raw(`<path d="${p2(op.map(([x, y]) => P(x, y, ZF - 0.05)))}" fill="${fog('#3a3a34', ZF)}" stroke="${INK}" stroke-width="1"/>` + G.ring(op, ZF - 0.06, 0.4, fog('#b4a8a0', ZF), { v: 0.4 }));
  const cas = []; for (let k = 0; k <= 10; k++) { const t = k / 10; cas.push(P(ox - 1.1 - t * 0.9 + Math.sin(k * 2.1) * 0.15, 4.6 - t * 4.6, ZF - 0.08)); } for (let k = 10; k >= 0; k--) { const t = k / 10; cas.push(P(ox + 1.1 + t * 1.1 + Math.sin(k * 1.7) * 0.15, 4.6 - t * 4.6, ZF - 0.08)); }
  raw(`<path d="${smooth(cas, true, 0.4)}" fill="${fog('#e8e6da', ZF)}" stroke="${fog(INK, ZF, 0.7)}" stroke-width="0.8"/>`);
  for (let k = 0; k < 9; k++) { const x = ox - 1 + k * 0.28, A = P(x, 4.5, ZF - 0.09), B = P(x + (R() - 0.5) * 0.4, 0.3 + R() * 1.2, ZF - 0.09); raw(line([A, B], 1, fog('#b8b4a8', ZF), 0.7)); }
}
// ---- the side walls receding: the left in shade (it faces away from the light), the right lit; tide marks converge
{
  const atL = (s2, t) => [XL, t, ZF - s2], atR = (s2, t) => [XR, t, ZF - s2], L = ZF - 8;
  raw(ashlar(atL, L, TOPY + 0.5, fog('#6a6e62', 25), { scale: 0.7, rough: true, roughP: 0.7, vary: 0.3, mortar: 0.6, lost: 0.3, spall: 0.35 }) + tides(atL, L) + hatch3(atL, 0, L, 0, TOPY + 0.5, 0.8, { op: 0.4 }) + hatch3(atL, 0, L, 0, TOPY + 0.5, -0.7, { op: 0.3 }));
  raw(ashlar(atR, L, TOPY + 0.5, fog('#a89890', 25), { scale: 1.6, vary: 0.15, mortar: 0.4, spall: 0.3 }) + T.marble(atR, L, 2.3, fog('#b8a29c', 25), { rows: 0.8, slab: 1.8, craze: 0.4 }) + tides(atR, L) + hatch3(atR, 0, L, 0, 2, 0.8, { op: 0.2 }));
  // the keepers' stair down the left wall: a ramp of steps descending toward us, its parapet a diagonal band
  for (let k = 0; k < 40; k++) { const z = 34 - k * 0.42, y = TOPY - k * 0.2; if (y < 0) break; const q = [P(XL, y, z), P(XL + 1.2, y, z), P(XL + 1.2, y, z - 0.42), P(XL, y, z - 0.42)]; raw(`<path d="${p2(q)}" fill="${fog('#8a7c74', z)}" stroke="${fog(INK, z, 0.6)}" stroke-width="0.5"/>`); }
  // (the stair's parapet is gone: only its treads remain)
  // the wall tops: a coping, figures of statues long gone (empty plinths) along the right wall
  raw(line([P(XL, TOPY + 0.5, ZF), P(XL, TOPY + 0.5, 10)], 3, fog('#5a504a', 25), 1) + line([P(XR, TOPY + 0.5, ZF), P(XR, TOPY + 0.5, 10)], 3, fog('#c8bcb4', 25), 1));
  for (const z of [36, 28, 20]) { const b = [P(XR, TOPY + 0.5, z), P(XR, TOPY + 1.4, z), P(XR, TOPY + 1.4, z - 1), P(XR, TOPY + 0.5, z - 1)]; raw(cel(b, { Z: z, fill: fog('#b8aca4', z), band: 1 })); }
}
raw(BK.quiet(MURK, 300, 370, { steps: [0.05, 0.06, 0.08, 0.1], hop: 0.06 }));
raw(G.edges('#3a3c34', { l: 160, r: 120, t: 0, steps: [0.12, 0.14, 0.16, 0.18] }));
// ---- the sludge bed: grey-green muck, wetter toward the middle; a baked cracked crust near the walls; runnels curving to the
// central sump; puddles holding the white sky; leech trails; scale rings where pools dried
{
  const at = (s2, t) => [XL + s2, 0, 3 + t], Lx = XR - XL, Lz = ZF - 3;
  raw(`<path d="${pp([at(0, 0), at(Lx, 0), at(Lx, Lz), at(0, Lz)])}" fill="${SLUDGE}"/><path d="${pp([at(0, 0), at(Lx, 0), at(Lx, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.6"/>`);
  // the baked crust: polygon cracks in the drying mud, bigger near us
  for (let k = 0; k < 140; k++) { const near = R() < 0.5, X = near ? (R() < 0.5 ? XL + R() * 5 : XR - R() * 5) : XL + R() * Lx, Z = 3.2 + Math.pow(R(), 1.2) * 30, sz = 0.35 + R() * 0.8; if (Math.abs(X - 1) < 2 + Z * 0.1 && Z > 9) continue; const pts = []; for (let j = 0; j < 5; j++) { const a = j / 5 * 6.283 + R() * 0.4; pts.push(P(X + Math.cos(a) * sz * 0.5, 0.002, Z + Math.sin(a) * sz * 0.4)); } raw(`<path d="${p2(pts)}" fill="none" stroke="${fog('#2e3026', Z)}" stroke-width="${f1(Math.max(0.5, K(Z) * 0.012))}" opacity="0.32"/>`); }
  // runnels: shallow wet channels curving in from both sides to the sump in the middle distance
  const sump = [1, 22];
  for (let k = 0; k < 7; k++) { const sx = XL + 2 + k * (Lx - 4) / 6, sz = 4 + R() * 3, pts = []; for (let j = 0; j <= 12; j++) { const u = j / 12; pts.push(P(sx + (sump[0] - sx) * u + Math.sin(u * 3 + k) * 1.2 * (1 - u), 0.003, sz + (sump[1] - sz) * Math.pow(u, 0.8))); } raw(line(pts, Math.max(1.5, 6 - k * 0.2), '#3a3e32', 0.7) + line(pts.map(([x, y]) => [x, y - 0.8]), 1, '#e0e4da', 0.35)); }
  { const c = P(sump[0], 0.004, sump[1]), k = K(sump[1]); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 1.3)}" ry="${f1(k * 0.2)}" fill="#1a1c16" stroke="${INK}" stroke-width="1"/>`); for (let j = -3; j <= 3; j++) raw(line([[c[0] + j * k * 0.33, c[1] - k * 0.18], [c[0] + j * k * 0.36, c[1] + k * 0.18]], 1.6, '#3a3a36', 1)); }
  for (const [X, Z, w] of [[-6, 7.2, 2.4], [5.2, 8.0, 2.0], [-1.2, 11.5, 2.8], [8.5, 13, 1.8], [-10, 12, 2.2]]) raw(G.puddle(X, Z, w, w * 0.32, '#8a9088', '#f4f6ee'));
  // leech trails: sinuous furrows across the sludge
  for (let k = 0; k < 10; k++) { let X = -10 + R() * 20, Z = 4 + R() * 9; const pts = [], a = R() * 6.28; for (let j = 0; j < 14; j++) { X += Math.cos(a + Math.sin(j * 0.9) * 0.8) * 0.25; Z += Math.sin(a + Math.sin(j * 0.9) * 0.8) * 0.18; pts.push(P(X, 0.004, Z)); } raw(line(pts, Math.max(1, K(Z) * 0.03), '#3a3c30', 0.6)); }
  raw(S.occBand((s2, t) => [XL + s2, 0, 3 + t], Lx, 1.0, { op: 0.3 }));
}

// ======================================================================== MID: the brute's trough, a broken sluice gate, low and dark
layer('mid');
{
  // the feeding trough: a marble sarcophagus-like trough sunk in the sludge, bones and offal crusted in it, leeches on its lip
  const Z = 9.6, x0 = -7.2, x1 = -4.4, q = [P(x0, 0, Z), P(x1, 0, Z), P(x1, 0.55, Z), P(x0, 0.55, Z)]; raw(cel(q, { Z, fill: '#8a7e76', tex: 'url(#mottle)', texOp: 0.4, band: 1.5 }) + hatch3((s2, t) => [x0 + s2, t, Z], 0, x1 - x0, 0, 0.55, 0.8, { op: 0.3 }));
  raw(cel([P(x0, 0.55, Z), P(x1, 0.55, Z), P(x1 - 0.1, 0.55, Z + 0.7), P(x0 + 0.1, 0.55, Z + 0.7)], { Z, fill: '#3a2a24', band: 1, hi: false }));
  for (let k = 0; k < 7; k++) { const c = P(x0 + 0.3 + R() * 2.2, 0.6, Z + 0.3), l = 4 + R() * 5; raw(line([[c[0] - l / 2, c[1] - 1], [c[0] + l / 2, c[1] - 2]], 2.4, INK, 1) + line([[c[0] - l / 2, c[1] - 1], [c[0] + l / 2, c[1] - 2]], 1.2, '#d0c8b4', 1)); }
  // a fallen sluice gate: oak boards bound in iron, lying tilted, its chain still running up out of sight
  const z2 = 10.2, g = [P(3.6, 0, z2), P(6.4, 0, z2 + 0.4), P(6.3, 0.55, z2 + 0.4), P(3.7, 0.7, z2)]; raw(cel(g, { Z: z2, fill: '#3e3428', band: 1.5, tex: 'url(#mottle)', texOp: 0.5 }) + line([P(3.8, 0.35, z2), P(6.3, 0.3, z2 + 0.4)], 2.4, '#2a2a2a', 0.9));
}

raw(G.barrel(1.2, 9.2, { side: true, col: '#5a5444', hoop: '#3a3a36' }));   // scale cue: a sludge-crusted cask
// ======================================================================== FORE: the foot of the side stair at the left with its sluice wheel; a sludge heap right
layer('fore');
{
  // left: the bottom landing of a stair down the near wall, steps rising out of frame; a bronze sluice wheel on its post
  for (let k = 0; k < 6; k++) { const y = H - k * 46, x1 = 200 - k * 34; raw(cel([[-10, y], [x1, y], [x1 - 10, y - 46], [-10, y - 46]], { Z: 3, fill: tone('#6a5e58', 0.1), band: 6, tex: 'url(#mottle)', texOp: 0.4 }) + `<path d="M-10 ${y - 46} L${x1 - 10} ${y - 46} L${x1 - 4} ${y - 40} L-10 ${y - 40} Z" fill="#8a7e76"/>`); }
  raw(`<path d="M-10 ${H - 46 * 6} L60 ${H - 46 * 6} L60 -10 L-10 -10 Z" fill="#4a403c" stroke="${INK}" stroke-width="2"/>` + hatch3((s2, t) => [-3.6 + s2, t, 3], 0, 0.5, 0, 6, 0.8, { op: 0.4 }));
  const wc = [118, 196], wr = 34; raw(line([[wc[0], wc[1]], [wc[0] + 2, H - 230]], 7, INK, 1) + line([[wc[0], wc[1]], [wc[0] + 2, H - 230]], 4, '#4a3a2a', 1) + `<circle cx="${wc[0]}" cy="${wc[1]}" r="${wr}" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="${wc[0]}" cy="${wc[1]}" r="${wr}" fill="none" stroke="${T.BRONZE}" stroke-width="4"/>`);
  for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + 0.3; raw(line([[wc[0], wc[1]], [wc[0] + Math.cos(a) * wr, wc[1] + Math.sin(a) * wr]], 3, INK, 1) + line([[wc[0], wc[1]], [wc[0] + Math.cos(a) * wr, wc[1] + Math.sin(a) * wr]], 1.6, T.BRONZE, 1)); }
  // right: a heap of dredged sludge, crusted white, a broken amphora in it, leeches dried on it
  const pts = []; for (let k = 0; k <= 9; k++) { const t = k / 9; pts.push([W - 260 + t * 280, H - 8 - Math.sin(t * Math.PI) * (54 + R() * 10) * (0.6 + t * 0.5)]); } raw(G.rockMass([[W - 270, H + 4], ...pts, [W + 20, H + 4]], 3.2, '#4a4c40', { fiss: 4, hop: 0.45 }));
  raw(line(pts.slice(2, 8).map(([x, y]) => [x, y + 3]), 2.2, T.SCALE, 0.5));
  const am = [W - 120, H - 52]; raw(cel([[am[0] - 14, am[1]], [am[0] + 10, am[1] - 18], [am[0] + 24, am[1] - 10], [am[0] + 4, am[1] + 14]], { Z: 3.2, fill: T.CLAY, band: 4 }) + `<path d="M${am[0] + 10} ${am[1] - 18} l8 -12 l6 4 l-2 8 Z" fill="${T.CLAY}" stroke="${INK}" stroke-width="1.2"/>`);
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
