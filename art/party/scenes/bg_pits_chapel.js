// World IV, the Sulphur Pits: THE CANARY CHAPEL (round 2, group g2). Room key 'pits_chapel'.
// Contract as the nave: 1480 x 480 (shown at 2x); pits_chapel_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters here: The Canary Chapel (the priests sing to the gas), The Choking Chapel (the matriarch hangs over the altar).
// The place (bible IV: the mine's chaplains, the canary priests, "sing to the gas the way miners once listened to canaries.
// The gas listens"): a chapel cut out of the living rock, down the nave from its chancel. Rough round arches open on dark
// aisles where candles burn in wall niches; a rock-cut barrel vault with transverse ribs overhead. From the vault hang the
// canary cages, dozens of them on chains at every height, every bird dead. The chancel arch frames the apse: the altar on
// its steps, banks of votive candles on rock ledges, a little gilded holy figure in its niche (holy: the only gold), and in
// front of it the lamp-crown hanging on its chains. The miners' offerings: lamps hung on nails, tally tokens, prayer slips.
// Under the vault the yellow gas has pooled and lies there, lit by the candles: the gas listens.
// Courses: FIRE (candle soot climbing the rock in fans, charred prayer slips, a scorched rib where the gas once flashed);
// TOXIN (sulphur bloom in the joints, yellow crust on the cages, the gas haze lying under the vault).
// Light: candlelight (warm focus at the apse, centre back), everything else dark. Dark key, warm amber.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IV');
const W = 1480, H = 480, ROOM = 'pits_chapel';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2634, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1a1008' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#0e0a06', AIR = '#1a120a';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 8, airD: 20, airMax: 0.5 });
const { line, polyS, timber, oilLamp } = G;
const { ell } = require('../engine');
const SULF = '#d8c040', LAMP = '#e8902a', CANDLE = '#f0b048', SOOT = '#120c06', ROCK = '#2e2418', GOLD = '#c89a3a';
const XA = 5.2, ZC = 16, ZA = 19.6, VS = 5.0, VR = 1.9;      // arcade plane, chancel wall, apse wall, vault spring and rise
const LT = G.lightTint([{ p: [0, 2.6, 18.5], col: '#d08a3a', r: 9, k: 0.6, zk: 0.7 }, { p: [0, 3.8, 15], col: '#c88a3a', r: 6, k: 0.4 }, { p: [-7, 1.6, 11], col: '#b8742a', r: 3, k: 0.4 }, { p: [7, 1.6, 9], col: '#b8742a', r: 3, k: 0.4 }, { p: [-7, 1.6, 14.5], col: '#b8742a', r: 2.6, k: 0.35 }]);
// a votive candle (screen): a tallow stick with a wax beard, a small flame, a warm halo
function candle(x, y, h, o = {}) {
  const w = Math.max(1, h * 0.22);
  let s = `<path d="M${f1(x - w / 2)} ${f1(y)} L${f1(x - w / 2)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y)} Z" fill="#e0d4b0" stroke="${INK}" stroke-width="${f1(Math.max(0.35, w * 0.18))}"/><path d="M${f1(x + w * 0.1)} ${f1(y - h)} q${f1(w * 0.3)} ${f1(h * 0.3)} ${f1(w * 0.1)} ${f1(h * 0.55)}" stroke="#f4ecd0" stroke-width="${f1(Math.max(0.4, w * 0.35))}" fill="none"/>`;
  if (o.lit !== false) s += EM(`<path d="M${f1(x)} ${f1(y - h - w * 2.6)} q${f1(w * 0.75)} ${f1(w * 1.4)} 0 ${f1(w * 2.4)} q${f1(-w * 0.75)} ${f1(-w * 1.0)} 0 ${f1(-w * 2.4)} Z" fill="${CANDLE}"/><path d="M${f1(x)} ${f1(y - h - w * 1.5)} l0 ${f1(w * 1.2)}" stroke="#fff4d0" stroke-width="${f1(Math.max(0.4, w * 0.35))}"/>`) + (o.glow === false ? '' : glow(x, y - h - w, w * 9, w * 8, CANDLE, o.gop ?? 0.22));
  return s;
}
// a rock ledge cut into a wall plane at Z with candles standing on it (X0..X1 at height Y)
function ledge(X0, X1, Y, Z, n, o = {}) {
  const a = P(X0, Y, Z), b = P(X1, Y, Z), k = K(Z);
  let s = cel([[a[0], a[1] - k * 0.03], [b[0], b[1] - k * 0.03], [b[0], b[1] + k * 0.08], [a[0], a[1] + k * 0.08]], { Z, fill: tone(mix(ROCK, '#c89050', 0.25), 0.1), band: Math.max(1, k * 0.05) });
  s += `<path d="${smooth([[a[0], a[1]], [b[0], b[1]], [b[0] + k * 0.1, a[1] - k * 1.1], [a[0] - k * 0.1, a[1] - k * 1.2]], true, 0.5)}" fill="${SOOT}" opacity="0.3"/>`;
  for (let i = 0; i < n; i++) { const u = (i + 0.5) / n + (R() - 0.5) * 0.5 / n, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u; s += candle(x, y - 0.5, k * (0.08 + R() * 0.12), { lit: R() < (o.lit ?? 0.8), gop: o.gop ?? 0.18 }); }
  // wax runs over the lip
  for (let i = 0; i < n / 2; i++) { const x = a[0] + (b[0] - a[0]) * R(); s += `<path d="M${f1(x)} ${f1(a[1] + k * 0.05)} l0 ${f1(k * (0.05 + R() * 0.12))}" stroke="#d8ccb0" stroke-width="${f1(Math.max(0.6, k * 0.025))}" stroke-linecap="round" opacity="0.8"/>`; }
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3 (distance): the apse beyond the chancel arch: its wall, the niche with the gilded figure, ledges of candles,
// the altar on its steps
{
  const at = (s, t) => [-6 + s, t, ZA];
  raw(G.hewnRock(at, 12, 8, '#4a3826', { bed: 0.42, block: 1.4, pick: 0.6, tint: LT, streaks: 4 }));
  // soot fans climbing from the candle ledges
  for (const X of [-2.2, -0.9, 0.9, 2.3]) { const b = P(X, 1.7, ZA - 0.05); raw(`<path d="${smooth([[b[0] - 18, b[1]], [b[0] - 10, b[1] - 70], [b[0] + 4, b[1] - 110], [b[0] + 16, b[1] - 60], [b[0] + 20, b[1]]], true, 0.6)}" fill="${SOOT}" opacity="0.35"/>`); }
  // the niche: round-headed, deep, the gilded figure (a saint of the miners with his lamp held up), candles at his feet
  { const nx = 0, ny = 2.75, nw = 0.9, nh = 1.0, arc = []; for (let k = 0; k <= 12; k++) { const a = Math.PI - k / 12 * Math.PI; arc.push(P(nx + Math.cos(a) * nw / 2, ny + nh + Math.sin(a) * nw / 2, ZA)); }
    const nic = [P(nx - nw / 2, ny, ZA), ...arc, P(nx + nw / 2, ny, ZA)]; raw(`<path d="${p2(nic)}" fill="#2a1a0c" stroke="${INK}" stroke-width="1.4"/><path d="${p2(nic)}" fill="${S.hatchA(ZA)}" opacity="0.3"/>`);
    raw(glow(P(nx, ny + 0.6, ZA)[0], P(nx, ny + 0.6, ZA)[1], 60, 60, CANDLE, 0.45));
    const f = P(nx, ny + 0.04, ZA - 0.1), k = K(ZA);
    const body = [[f[0] - k * 0.12, f[1]], [f[0] - k * 0.14, f[1] - k * 0.35], [f[0] - k * 0.1, f[1] - k * 0.6], [f[0] - k * 0.05, f[1] - k * 0.68], [f[0] + k * 0.06, f[1] - k * 0.68], [f[0] + k * 0.1, f[1] - k * 0.58], [f[0] + k * 0.13, f[1] - k * 0.3], [f[0] + k * 0.12, f[1]]];
    raw(cel(body, { Z: 8, fill: GOLD, band: 2.5 }) + cel(ell([f[0], f[1] - k * 0.78], k * 0.06, k * 0.075, 0, 10), { Z: 8, fill: '#d8aa48', band: 1.5 }));
    raw(line([[f[0] - k * 0.11, f[1] - k * 0.5], [f[0] - k * 0.22, f[1] - k * 0.72]], 2.6, INK, 1) + line([[f[0] - k * 0.11, f[1] - k * 0.5], [f[0] - k * 0.22, f[1] - k * 0.72]], 1.4, GOLD, 1) + oilLamp(f[0] - k * 0.24, f[1] - k * 0.7, k * 0.06, true, { gr: 3, gop: 0.3 }));
    raw(line([[f[0] - k * 0.04, f[1] - k * 0.6], [f[0] - k * 0.03, f[1] - k * 0.06]], 1, '#f8e4a0', 0.8) + line([[f[0] + k * 0.08, f[1] - k * 0.5], [f[0] + k * 0.05, f[1] - k * 0.1]], 0.7, INK, 0.6));
    raw(ledge(-0.42, 0.42, ny, ZA - 0.15, 5, { gop: 0.15 })); }
  raw(ledge(-3.0, -1.0, 1.7, ZA - 0.2, 9) + ledge(1.0, 3.0, 1.7, ZA - 0.2, 9) + ledge(-2.6, -1.2, 2.4, ZA - 0.2, 6) + ledge(1.3, 2.7, 2.35, ZA - 0.2, 6));
  // the altar: a block of the living rock on three steps, a linen frontal with an ink-drawn cross and ochre border, candles
  { const st = (Y0, Y1, z0, X0, X1) => cel([P(X0, Y1, z0), P(X1, Y1, z0), P(X1, Y0, z0), P(X0, Y0, z0)], { Z: z0, fill: tone(mix('#4a3a26', '#a87038', LT([0, Y1, z0])?.[1] * 0.6 || 0), 0.1), tex: 'url(#mottle)', texOp: 0.4 }) + cel([P(X0, Y1, z0), P(X1, Y1, z0), P(X1, Y1, z0 + 0.4), P(X0, Y1, z0 + 0.4)], { Z: z0, fill: '#6a5034', band: 0.8 });
    raw(st(0, 0.15, 17.2, -2.8, 2.8) + st(0.15, 0.3, 17.6, -2.4, 2.4) + st(0.3, 0.45, 18.0, -2.0, 2.0));
    raw(cel([P(-1.3, 1.45, 18.3), P(1.3, 1.45, 18.3), P(1.3, 0.45, 18.3), P(-1.3, 0.45, 18.3)], { Z: 18, fill: '#4a3a26', tex: 'url(#mottle)', texOp: 0.4 }) + cel([P(-1.4, 1.45, 18.3), P(1.4, 1.45, 18.3), P(1.4, 1.45, 18.9), P(-1.4, 1.45, 18.9)], { Z: 18, fill: '#7a6040', band: 0.8 }));
    const fr = [P(-1.1, 1.4, 18.28), P(1.1, 1.4, 18.28), P(1.1, 0.62, 18.28), P(-1.1, 0.62, 18.28)]; raw(cel(fr, { Z: 18, fill: '#b8aa88', tex: 'url(#mottle)', texOp: 0.4 }) + `<path d="${p2(fr)}" fill="none" stroke="#a07a34" stroke-width="2.2" opacity="0.8"/>`);
    const c = P(0, 1.02, 18.27); raw(`<path d="M${f1(c[0])} ${f1(c[1] - 12)} l0 24 M${f1(c[0] - 7)} ${f1(c[1] - 4)} l14 0" stroke="${INK}" stroke-width="1.6"/>`);
    for (const X of [-1.1, -0.7, 0.7, 1.15]) { const b = P(X, 1.45, 18.6); raw(candle(b[0], b[1], K(18.6) * 0.3, { gop: 0.28 })); } }
}
// ---- plane 2: the chancel wall with its arch, the arch ring carved, the lamp-crown hanging before it
{
  const at = (s, t) => [-14 + s, t, ZC], ys = 3.4, r = 3.0, cid = S.id('cw');
  const arc = []; for (let k = 0; k <= 24; k++) { const a = Math.PI - k / 24 * Math.PI; arc.push([Math.cos(a) * r, ys + Math.sin(a) * r * 0.95]); }
  const hole = [[-r, 0], ...arc, [r, 0]];
  raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${pp([at(0, 0), at(28, 0), at(28, 9), at(0, 9)])} ${pp(hole.map(([x, y]) => [x, y, ZC]))}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(G.hewnRock(at, 28, 9, ROCK, { bed: 0.5, block: 2.0, pick: 0.55, tint: LT }));
  for (const [X, Y] of [[-6, 4.5], [6.5, 4.2], [-4.2, 6.6], [4.6, 6.8]]) raw(ledge(X - 0.6, X + 0.6, Y, ZC - 0.05, 4, { lit: 0.6 }));
  raw('</g>');
  // the arch's soffit (cut through the rock's thickness) and the carved ring: a roll moulding with a lit lip, chisel-fluted
  const th = 1.2, ring = arc.map(([x, y]) => P(x, y, ZC)), ringB = arc.map(([x, y]) => P(x * 0.97, y, ZC + th));
  raw(`<path d="${p2([...ring, ...ringB.slice().reverse()])}" fill="${mix(ROCK, '#c08040', 0.25)}"/><path d="${p2([...ring.slice(12), ...ringB.slice(12).reverse()])}" fill="${S.hatchA(ZC)}" opacity="0.5"/>`);
  for (const xs of [-r, r]) raw(`<path d="${pp([[xs, 0, ZC], [xs, ys, ZC], [xs * 0.97, ys, ZC + th], [xs * 0.97, 0, ZC + th]])}" fill="${mix(ROCK, xs < 0 ? '#c08040' : INK, xs < 0 ? 0.2 : 0.35)}" stroke="${INK}" stroke-width="0.8"/>`);
  const ringO = arc.map(([x, y]) => P(x * 1.1 + (x < 0 ? -0.05 : 0.05), y * 1.03 + 0.15, ZC - 0.05));
  raw(`<path d="${p2([...ringO, ...ring.slice().reverse()])}" fill="#5a4630" stroke="${INK}" stroke-width="1.6"/>` + line(ringO.slice(2, 12).map(([x, y]) => [x + 1, y + 1.5]), 1.2, '#e8b870', 0.55));
  for (let k = 1; k < 24; k += 1) { const a = ring[k], b = ringO[k]; raw(`<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="${INK}" stroke-width="0.7" opacity="0.6"/>`); }
  // imposts: a carved band at the springing on each side
  for (const sg of [-1, 1]) { const x0 = sg * r, x1 = sg * (r + 0.8); raw(cel([P(Math.min(x0, x1) - 0.1, ys + 0.2, ZC - 0.1), P(Math.max(x0, x1) + 0.1, ys + 0.2, ZC - 0.1), P(Math.max(x0, x1) + 0.1, ys - 0.05, ZC - 0.1), P(Math.min(x0, x1) - 0.1, ys - 0.05, ZC - 0.1)], { Z: ZC, fill: '#5a4630', band: 1.4 })); }
  // a scorched rib of soot over the arch where the gas once flashed along the vault
  raw(`<path d="${smooth([...ringO.slice(6, 19).map(([x, y]) => [x, y - 4]), [ringO[18][0] + 20, ringO[18][1] - 40], [ringO[6][0] - 20, ringO[6][1] - 50]], true, 0.6)}" fill="${SOOT}" opacity="0.35"/>`);
  raw(glow(P(0, 2.4, ZA)[0], P(0, 2.4, ZA)[1], 260, 160, CANDLE, 0.3));
}
// ---- the aisles behind the arcades: dark, candles burning in niches on their outer walls, a tomb, a heap of rubble
for (const sg of [-1, 1]) {
  const XO = sg * (XA + 2.6), at = (s, t) => [XO, t, 6 + s];
  raw(G.hewnRock(at, 11, 5, mix(ROCK, MURK, 0.3), { bed: 0.5, block: 2.4, pick: 0.4, tint: LT }));
  for (const Z of sg < 0 ? [8.4, 11.2, 14.6] : [7.6, 9.4, 13.2]) { const a = P(XO, 1.4, Z - 0.35), b = P(XO, 1.4, Z + 0.35); raw(`<path d="${p2([a, b, P(XO, 2.1, Z + 0.35), P(XO, 2.1, Z - 0.35)])}" fill="#1a0e06" stroke="${INK}" stroke-width="0.8"/>`); const c = P(XO, 1.42, Z); raw(candle(c[0], c[1], K(Z) * 0.12, { gop: 0.3 }) + candle(c[0] + sg * 4, c[1] + 1, K(Z) * 0.08, { gop: 0.15 })); }
  raw(`<path d="${pp([[XO, 0, 6], [XA * sg, 0, 6], [XA * sg, 0, 17], [XO, 0, 17]])}" fill="#1e160c"/>`);
}
// ---- plane 1: the arcades, rock-cut: the face of the living rock with round arches of uneven span opened in it, the soffits
// lit by the aisle candles; imposts; offerings hung on the piers
for (const sg of [-1, 1]) {
  const X = sg * XA, spans = sg < 0 ? [[6.2, 8.8], [9.6, 12.4], [13.1, 15.6]] : [[5.8, 7.9], [8.8, 11.9], [12.7, 15.4]], ys = 2.3;
  const archPts = ([z0, z1]) => { const zc = (z0 + z1) / 2, r = (z1 - z0) / 2, o = [[z0, 0]]; for (let k = 0; k <= 14; k++) { const a = Math.PI - k / 14 * Math.PI; o.push([zc + Math.cos(a) * r, ys + Math.sin(a) * r * 0.9]); } o.push([z1, 0]); return o; };
  // soffits: the arch cut through the rock's thickness, seen on the far side of each opening
  for (const sp of spans) { const a = archPts(sp); const A = a.map(([z, y]) => P(X, y, z)), B = a.map(([z, y]) => P(X + sg * 1.0, y, z)); raw(`<path d="${p2([...A, ...B.slice().reverse()])}" fill="${mix(ROCK, '#b87838', 0.18)}"/><path d="${p2([...A, ...B.slice().reverse()])}" fill="${S.hatchB(10)}" opacity="0.35"/>`); }
  const cid = S.id('ar'), at = (s, t) => [X, t, 3.6 + s];
  raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${pp([at(0, 0), at(12.5, 0), at(12.5, VS + 0.2), at(0, VS + 0.2)])} ${spans.map(sp => pp(archPts(sp).map(([z, y]) => [X, y, z]))).join(' ')}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(G.hewnRock(at, 12.5, VS + 0.2, ROCK, { bed: 0.45, block: 1.7, pick: 0.55, tint: LT }));
  raw(hatch3(at, 0, 12.5, 0, 1.2, 0.7, { op: 0.35, ragged: 0.3 }));
  raw('</g>');
  for (const sp of spans) { const a = archPts(sp).slice(1, -1).map(([z, y]) => P(X, y, z)); raw(line(a, 1.8, INK, 1) + line(a.map(([x, y]) => [x + sg * -1, y + 1.4]), 0.9, '#d8a060', 0.4)); }
  // imposts: a cut band at the springing along each pier
  for (let i = 0; i <= spans.length; i++) { const z0 = i === 0 ? 3.6 : spans[i - 1][1], z1 = i === spans.length ? 16 : spans[i][0]; raw(cel([P(X, ys + 0.12, z0), P(X, ys + 0.12, z1), P(X, ys - 0.08, z1), P(X, ys - 0.08, z0)], { Z: (z0 + z1) / 2, fill: '#4e3c28', band: 1 })); }
  // offerings on the piers: miners' lamps on nails, a string of tally tokens, prayer slips (charred at the edges)
  for (const [z, kind] of sg < 0 ? [[9.2, 'lamp'], [12.75, 'tok'], [5.0, 'slip']] : [[8.35, 'slip'], [12.3, 'lamp'], [5.0, 'tok']]) {
    const c = P(X, 1.75, z), k = K(z);
    if (kind === 'lamp') raw(oilLamp(c[0], c[1], k * 0.07, R() < 0.5, { gr: 4 }) + oilLamp(c[0], c[1] + k * 0.25, k * 0.06, false));
    if (kind === 'tok') { for (let j = 0; j < 6; j++) raw(`<circle cx="${f1(c[0] + (j - 2.5) * k * 0.03)}" cy="${f1(c[1] + Math.sin(j / 5 * Math.PI) * k * 0.08)}" r="${f1(Math.max(0.8, k * 0.018))}" fill="#7a7060" stroke="${INK}" stroke-width="0.5"/>`); }
    if (kind === 'slip') for (let j = 0; j < 4; j++) { const x = c[0] + (j - 1.5) * k * 0.05 * sg, y = c[1] + (R() - 0.5) * k * 0.1; raw(cel([[x - k * 0.02, y - k * 0.05], [x + k * 0.02, y - k * 0.05], [x + k * 0.025, y + k * 0.06], [x - k * 0.02, y + k * 0.05]], { Z: z, fill: '#c8bc98', band: 0.6, inkW: 0.5 }) + line([[x - k * 0.015, y], [x + k * 0.012, y + 1]], 0.4, INK, 0.6)); }
  }
}
// ---- the vault: a rock-cut barrel, its transverse ribs over the piers, black with soot and gas-bloom
{
  const Yv = X => VS + VR * Math.sqrt(Math.max(0, 1 - Math.pow(X / XA, 2))), at = (s, t) => { const X = -XA + s; return [X, Yv(X), 3.6 + t]; };
  raw(G.hewnRock(at, XA * 2, ZC - 3.6, '#1e170e', { bed: 0.7, block: 2.6, pick: 0.3, tint: LT, streaks: 0 }));
  for (const Z of [6.0, 9.2, 12.55]) { const pts = [], pts2 = []; for (let X = -XA; X <= XA + 0.01; X += 0.4) { pts.push(P(X, Yv(X) - 0.02, Z)); pts2.push(P(X, Yv(X) - 0.3, Z)); } raw(`<path d="${p2([...pts, ...pts2.reverse()])}" fill="#3a2c1c" stroke="${INK}" stroke-width="1.2"/>` + line(pts.slice(0, 12).map(([x, y]) => [x, y + 2]), 0.9, '#c89050', 0.35)); }
  raw(stain(P(0, 6.6, 12)[0], P(0, 6.6, 12)[1], 160, SOOT, 0.4));
}
// ---- the gas: a yellow haze lying in sheets under the vault, lit by the candles (the gas listens)
raw(G.bank(-10, W + 10, 120, 50, { col: '#c8a838', op: 0.14, soft: true, ph: 1 }) + G.bank(-10, W + 10, 70, 40, { col: '#d8b840', op: 0.12, soft: true, ph: 4 }) + G.bank(200, 1280, 170, 26, { col: '#c8a838', op: 0.08, soft: true, ph: 2 }));
// ---- the cages: dozens of canary cages on chains from the vault, at every height and depth, every bird dead
{
  const Yv = X => VS + VR * Math.sqrt(Math.max(0, 1 - Math.pow(X / XA, 2)));
  const cs = []; for (let i = 0; i < 46; i++) { const Z = 6.5 + R() * 9, X = (R() - 0.5) * 2 * (XA - 0.6), Y = 2.6 + R() * (Yv(X) - 3.2); cs.push([X, Y, Z]); }
  cs.sort((a, b) => b[2] - a[2]);
  for (const [X, Y, Z] of cs) { const c = P(X, Y, Z), top = P(X, Yv(X), Z), k = K(Z), t = LT([X, Y, Z]); raw(line([[top[0], top[1]], [c[0], c[1] - k * 0.4]], Math.max(0.5, k * 0.008), '#3a3430', 0.9) + G.cage(c[0], c[1], k * 0.26, { col: t ? mix('#5a4a30', '#d8a050', t[1] * 0.7) : '#4a3c28', bird: '#c8b038' })); }
}
// ---- the lamp-crown hanging before the chancel arch: an iron hoop on three chains, oil lamps lit round it
{
  const Z = 14.6, Yc = 3.9, k = K(Z), c = P(0, Yc, Z), top = P(0, 6.9, Z), rx = k * 0.9, ry = k * 0.14;
  for (const a of [0.4, 2.5, 4.4]) raw(line([top, [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry]], 1, INK, 0.9));
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${INK}" stroke-width="3.2"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="#4a4038" stroke-width="1.4"/>`);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2, x = c[0] + Math.cos(a) * rx, y = c[1] + Math.sin(a) * ry; raw(oilLamp(x, y, k * 0.05, i % 3 !== 1, { gr: 5, gop: 0.25, col: CANDLE })); }
  raw(glow(c[0], c[1], 180, 90, CANDLE, 0.25));
}
raw(G.radial(P(0, 3.1, ZA)[0], P(0, 3.1, ZA)[1], 70, 80, [[0, '#fff0c8', 0.75], [0.4, '#f0b048', 0.4], [1, '#f0b048', 0]]) + G.radial(P(0, 1.6, ZA)[0], P(0, 1.6, ZA)[1], 160, 50, [[0, '#ffe0a0', 0.5], [1, '#f0b048', 0]]));
raw(G.frameDark(P(0, 2.6, 18)[0], P(0, 2.6, 18)[1] - 20, 620, 300, [[1.0, 0.24], [0.78, 0.22], [0.56, 0.16]]));
raw(BK.quiet(MURK, 234, 352, { steps: [0.2, 0.22, 0.24, 0.28], hop: 0.2 }));
// ---- the floor: dressed rock, worn hollow down the middle where the procession walked, grave slabs of the dead miners
// with their names chalked (scribbles), the chancel steps; wax spilt, cracks running in
{
  const at = (s, t) => [-XA + s, 0, 3.6 + t], Lz = ZC - 3.6;
  raw(S.ashlar(at, XA * 2, Lz, '#2c2218', { scale: 1.3, wscale: 1.4, rough: true, roughP: 0.35, vary: 0.2, chip: 0.6, mortar: 0.55, lost: 0.25, spall: 0.2 }));
  raw(`<path d="${pp([[-1.1, 0.002, 3.6], [1.1, 0.002, 3.6], [0.8, 0.002, ZC], [-0.8, 0.002, ZC]])}" fill="#120c06" opacity="0.22"/>`);
  for (const [X, Z] of [[-3.2, 9.6], [2.8, 11.0], [-2.6, 13.4], [3.4, 7.6]]) { const q = [P(X - 0.45, 0.004, Z - 0.9), P(X + 0.45, 0.004, Z - 0.9), P(X + 0.45, 0.004, Z + 0.9), P(X - 0.45, 0.004, Z + 0.9)]; raw(cel(q, { Z, fill: '#4a4034', band: 1, tex: 'url(#mottle)', texOp: 0.4 })); const c = P(X, 0.005, Z); raw(`<path d="M${f1(c[0] - K(Z) * 0.25)} ${f1(c[1])} l${f1(K(Z) * 0.1)} -1 l${f1(K(Z) * 0.08)} 1.5 l${f1(K(Z) * 0.1)} -1.2 M${f1(c[0] - K(Z) * 0.2)} ${f1(c[1] + 3)} l${f1(K(Z) * 0.25)} 0" stroke="#d8d0b8" stroke-width="0.6" opacity="0.6"/>`); }
  raw(G.floorCracks(at, 1, XA * 2 - 1, 0.3, Lz, 6, { toward: XA }));
  for (let i = 0; i < 18; i++) { const X = (R() - 0.5) * 9, Z = 4 + R() * 10, [x, y] = P(X, 0, Z); raw(stain(x, y, K(Z) * (0.03 + R() * 0.05), '#a89c80', 0.3)); }
  raw(S.occBand((s, t) => [-XA + s, 0, ZC - t], XA * 2, 1.0, { op: 0.3 }));
}

// ======================================================================== MID: rough benches, low and dark
layer('mid');
{
  for (const [X0, X1, Z] of [[-4.6, -1.4, 9.4], [1.3, 4.6, 9.8], [-4.5, -1.5, 12.0], [1.6, 4.5, 12.4]]) {
    const a = P(X0, 0.45, Z), b = P(X1, 0.45, Z), k = K(Z);
    raw(cel([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + k * 0.08], [a[0], a[1] + k * 0.08]], { Z, fill: '#2e2416', band: 1.2, tex: 'url(#mottle)', texOp: 0.5 }));
    for (const X of [X0 + 0.2, X1 - 0.2]) { const t = P(X, 0.42, Z), f = P(X, 0, Z); raw(cel([[t[0] - k * 0.04, t[1]], [t[0] + k * 0.04, t[1]], [f[0] + k * 0.05, f[1]], [f[0] - k * 0.05, f[1]]], { Z, fill: '#261c10', band: 1 })); }
  }
  // a toppled candle-stand and a spilt pool of wax
  { const c = P(-1.0, 0, 8.4), k = K(8.4); raw(line([[c[0] - k * 0.5, c[1] - 2], [c[0] + k * 0.4, c[1] - 6]], 2.6, INK, 1) + line([[c[0] - k * 0.5, c[1] - 2], [c[0] + k * 0.4, c[1] - 6]], 1.2, '#4a4038', 1) + stain(c[0], c[1], k * 0.12, '#8a7e64', 0.35)); }
}

// ======================================================================== FORE: a rock-cut pier at the left; cages hanging at the top right; bench ends
layer('fore');
{
  raw(G.smoothRock([[-20, -10], [96, -10], [88, 60], [102, 120], [92, 260], [110, 380], [96, H + 10], [-20, H + 10]], 3, '#1e160c', { dir: 'h', rib: 10, flank: 0.5, rimCol: '#d89850', rimOp: 0.5 }));
  raw(candle(78, 250, 26, { gop: 0.3 }) + candle(62, 254, 18, { gop: 0.2 }) + cel([[40, 252], [104, 252], [108, 262], [36, 262]], { Z: 3, fill: '#2a2014', band: 2 }));
  for (const [x, y, s] of [[W - 60, 80, 46], [W - 150, 46, 38], [W - 230, 104, 30], [W - 20, 190, 40]]) raw(line([[x, -10], [x, y - s * 1.5]], 1.4, INK, 1) + G.cage(x, y, s, { col: '#3a2e1e', bird: '#a89030' }));
  raw(cel([[W - 260, H + 10], [W - 250, H - 40], [W + 10, H - 46], [W + 10, H + 10]], { Z: 3, fill: '#1e160c', tex: 'url(#mottle)', texOp: 0.5, band: 5 }) + line([[W - 250, H - 38], [W, H - 44]], 1.4, '#a87840', 0.4));
  for (let i = 0; i < 30; i++) { const x = R() * W, y = 40 + R() * 300; raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + R() * 0.8)}" fill="#d8c060" opacity="${f1(0.2 + R() * 0.3)}"/>`); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
