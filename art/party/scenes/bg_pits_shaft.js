// World IV, the Sulphur Pits: THE SHAFT BOTTOM (round 2 upgrade, group g2). Room key 'pits_shaft'.
// Contract as the nave: 1480 x 480 (shown at 2x); pits_shaft_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters here: The Upper Gallery (miners still working the seam), The Powder Store (an ogre among the kegs).
// The place: the chamber at the foot of the winding shaft, where every load came up and every shift went down. Over the
// middle the shaft opens in the roof, its cage gone and its guides splintered; grey daylight still falls down it in a cold
// beam onto the Owner's broad hat on the floor (he came down once, to see the gas for himself). Two galleries run off on
// their rails: the left one to the working face, lamps still burning at the seam; at the right, the powder store, a
// timbered bay behind a barred gate with its kegs stacked to the cap, a horn-screened lamp hung outside it, a chalked slate
// forbidding naked flame. In the rock wall: the lamp-room hatch with its numbered lamps (gaps where lamps never came back),
// the shrine niche (a little gilded holy figure: the only gold). At the right edge a gas vent burns in a crack.
// Courses: FIRE chars and cracks (props charred and split with glowing seams, the vent, ash rising); TOXIN swells and
// crusts (sulphur in the joints, gas blisters, sulphur bloom on timber, ochre smoke).
// Palette: sulphur yellow, ochre smoke, lamp orange; the cold grey of the daylight. No eyes, no red.
// Round 2 (director): the low-poly facets are gone (Voronoi rock in strata, kit g2); three depth planes (near sets at 8.6 m,
// the back wall at 15 m, the galleries going off to 34 m) with recession; the shaft beam is the light focus; lamps warmer;
// the floor carries perspective (rails, cracks, puddles); the fore frames with a near set and the powder kegs.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IV');
const W = 1480, H = 480, ROOM = 'pits_shaft';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2614, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e1608' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#120e08', AIR = '#1c1710';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 8, airD: 26, airMax: 0.6 });
const rockH = (pts, Z, col, o = {}) => G.smoothRock(pts, Z, col, Object.assign({ dir: 'h', rib: 9, wave: 3, k: 0.3 }, o, { dir: 'h' }));
const { line, polyS, timber, oilLamp } = G;
const { ell } = require('../engine');

const SULF = '#d8c040', OCHRE = '#a08048', LAMP = '#e8902a', PINE = '#4e3e28', SOOT = '#14100a', HOT = '#ff8a2a', DAY = '#d4d8cc';
const ZW = 15, RY = 4.3, sx0 = -1.9, sx1 = 1.1, sz0 = 9.2, sz1 = 11.6;
// the light the rock takes: cold daylight round the shaft foot, lamp orange at the lamps and the vent
const LT = G.lightTint([
  { p: [-0.4, 1.5, 10.4], col: '#a8aca0', r: 7, k: 0.55, yk: 0.5 },
  { p: [-10.6, 2.0, 14.8], col: '#c87a30', r: 3.4, k: 0.5 }, { p: [9.6, 2.0, 14.8], col: '#c87a30', r: 3.2, k: 0.45 },
  { p: [13.2, 0.8, 14.8], col: '#d8782a', r: 4.2, k: 0.55 }, { p: [-6.0, 1.8, 14.9], col: '#b87a34', r: 3, k: 0.35 }]);
const smoke = (y, h, op, ph) => G.bank(-10, W + 10, y, h, { col: OCHRE, op, ph, soft: true, below: h * 0.8 });

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3 (distance): the galleries going off into the dark on their rails. The left one runs to the working face,
// where lamps burn on the seam; the right one is the powder store bay
const GL = [-12.5, -8.6], PS = [7.4, 11.4];
{
  const [g0, g1] = GL;
  for (let Z = 34; Z >= ZW; Z -= 1.5 + R() * 0.4) {
    const d = Math.min(1, (Z - ZW) / 19), col = mix(PINE, MURK, 0.3 + d * 0.6);
    raw(timber([g0 + 0.2, 0, Z], [g0 + 0.32, 2.3, Z], 0.24, { col, noDim: true }) + timber([g1 - 0.2, 0, Z], [g1 - 0.3 - R() * 0.1, 2.3, Z], 0.24, { col, noDim: true }) + timber([g0 + 0.05, 2.3, Z], [g1 - 0.05, 2.36 - R() * 0.1, Z], 0.24, { col, noDim: true }));
    for (let X = g0 + 0.3; X < g1 - 0.2; X += 0.3 + R() * 0.08) raw(`<path d="${pp([[X, 2.42, Z], [X + 0.24, 2.42, Z], [X + 0.24, 2.42, Z + 1.5], [X, 2.42, Z + 1.5]])}" fill="${mix('#2a2014', MURK, d)}" stroke="${INK}" stroke-width="0.5"/>`);
  }
  // the working face at the far end: lamp-lit rock with a sulphur seam, a pick left in it
  const at = (s, t) => [g0 + 0.2 + s, t, 34];
  raw(G.hewnRock(at, g1 - g0 - 0.4, 2.4, '#5a4a2a', { bed: 0.3, block: 0.9, pick: 0.8, tint: () => [LAMP, 0.35], streaks: 0 }));
  { const a = P(g0 + 0.5, 1.2, 33.9), b = P(g1 - 0.5, 1.0, 33.9); raw(line([a, [(a[0] + b[0]) / 2, a[1] + 2], b], 3, '#c8b040', 0.9)); }
  for (const X of [g0 + 0.9, g1 - 1.0]) { const l = P(X, 1.7, 33.6); raw(oilLamp(l[0], l[1], 2.2, true, { gr: 7, gop: 0.35 })); }
  const gm = (g0 + g1) / 2; for (const dx of [-0.35, 0.35]) raw(line([P(gm + dx, 0.06, ZW), P(gm + dx, 0.06, 34)], 1.4, '#5a5650', 0.8));
  for (let Z = ZW + 0.5; Z < 34; Z += 0.8) raw(line([P(gm - 0.6, 0.02, Z), P(gm + 0.6, 0.02, Z)], Math.max(0.6, K(Z) * 0.1), mix('#2a2014', MURK, 0.5), 0.9));
  raw(G.veil(P(0, 2.5, 20)[1], P(0, 0, 20)[1], 0.25, AIR, { amp: 0 }));
}
// the powder store: a timbered bay, plank walls, kegs stacked three high to the cap, a barred gate half open
{
  const [g0, g1] = PS, Zb = ZW + 2.6;
  raw(`<path d="${pp([[g0, 0, ZW], [g1, 0, ZW], [g1, 2.6, ZW], [g0, 2.6, ZW]])}" fill="#0c0a06"/>`);
  raw(S.boards((s, t) => [g0 + s, t, Zb], g1 - g0, 2.5, '#3a2c1a', { bw: 0.22 }));
  raw(`<path d="${pp([[g0, 0, Zb], [g1, 0, Zb], [g1, 2.5, Zb], [g0, 2.5, Zb]])}" fill="${MURK}" opacity="0.35"/>`);
  for (const [X, Zk, Y] of [[g0 + 0.6, Zb - 0.5, 0], [g0 + 1.35, Zb - 0.45, 0], [g0 + 2.1, Zb - 0.5, 0], [g0 + 2.85, Zb - 0.55, 0], [g0 + 0.95, Zb - 0.5, 0.74], [g0 + 1.75, Zb - 0.48, 0.74], [g0 + 2.5, Zb - 0.5, 0.74], [g0 + 1.35, Zb - 0.5, 1.48], [g0 + 2.15, Zb - 0.5, 1.48], [g0 + 3.4, Zb - 1.2, 0]]) {
    const b = P(X, Y, Zk), t = P(X, Y + 0.72, Zk); raw(G.keg(b[0], b[1], b[1] - t[1], { Z: Zk, col: mix('#5a4228', MURK, 0.25), mark: R() < 0.5 })); }
  // the gate: an iron-barred timber frame, one leaf swung in
  raw(timber([g0 + 0.05, 0, ZW + 0.05], [g0 + 0.05, 2.5, ZW + 0.05], 0.22, {}) + timber([g1 - 0.05, 0, ZW + 0.05], [g1 - 0.05, 2.5, ZW + 0.05], 0.22, {}) + timber([g0 - 0.25, 2.56, ZW], [g1 + 0.25, 2.62, ZW], 0.32, { bloom: 0.5 }));
  for (let X = g0 + 0.3; X < g0 + 1.9; X += 0.24) raw(line([P(X, 0.05, ZW + 0.08), P(X, 2.35, ZW + 0.08)], 1.4, INK, 1) + line([P(X, 0.05, ZW + 0.08), P(X, 2.35, ZW + 0.08)].map(([x, y]) => [x - 0.6, y]), 0.5, '#6a645a', 0.6));
  raw(line([P(g0 + 0.2, 1.9, ZW + 0.08), P(g0 + 1.95, 1.9, ZW + 0.08)], 2.4, '#3a3632', 1) + line([P(g0 + 0.2, 0.45, ZW + 0.08), P(g0 + 1.95, 0.45, ZW + 0.08)], 2.4, '#3a3632', 1));
  { const a = [P(g0 + 2.0, 0.05, ZW + 0.1), P(g0 + 2.9, 0.05, ZW + 0.9), P(g0 + 2.9, 2.35, ZW + 0.9), P(g0 + 2.0, 2.35, ZW + 0.1)]; raw(`<path d="${p2(a)}" fill="#2a2014" opacity="0.5" stroke="${INK}" stroke-width="1.2"/>`);
    for (let u = 0.12; u < 1; u += 0.15) raw(line([[a[0][0] + (a[1][0] - a[0][0]) * u, a[0][1] + (a[1][1] - a[0][1]) * u], [a[3][0] + (a[2][0] - a[3][0]) * u, a[3][1] + (a[2][1] - a[3][1]) * u]], 1.2, INK, 1)); }
  // the chalked slate beside the gate: a lamp struck through (no naked flame); the horn-screened lamp hung well away
  { const c = P(g1 + 0.55, 1.75, ZW - 0.05); raw(cel([[c[0] - 9, c[1] - 7], [c[0] + 9, c[1] - 7], [c[0] + 9, c[1] + 7], [c[0] - 9, c[1] + 7]], { Z: ZW, fill: '#2a2a2a', band: 1 }) + `<path d="M${f1(c[0] - 3)} ${f1(c[1] + 3)} l2 -6 l2 0 l2 6 Z M${f1(c[0] - 6)} ${f1(c[1] + 5)} L${f1(c[0] + 6)} ${f1(c[1] - 5)}" stroke="#d8d4c8" stroke-width="0.8" fill="none" opacity="0.85"/>`); }
  { const l = P(g0 - 0.7, 2.1, ZW - 0.2); raw(G.lantern(l[0], l[1], 7, { col: '#e8a040', r: 9, gop: 0.3 })); }
}
// ---- plane 2: the back wall of hewn rock, its mouths cut out; strata ledges; the lamp room, the shrine, the vent
{
  const at = (s, t) => [-32 + s, t, ZW], cid = S.id('rw'), outer = pp([at(0, 0), at(64, 0), at(64, 8), at(0, 8)]);
  const holes = [GL, PS].map(([g0, g1]) => pp([[g0, 0, ZW], [g1, 0, ZW], [g1, 2.6, ZW], [g0, 2.6, ZW]])).join(' ');
  raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${holes}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(G.hewnRock(at, 64, 8, '#3c3424', { bed: 0.5, block: 3.2, pick: 0.6, tint: LT }));
  // strata: broad ledges with a lit lip and a shadow band under each (the structure the stones sit in)
  for (const [t0, ph] of [[3.4, 0.4], [4.5, 2.1], [2.5, 4.2], [5.6, 1.0]]) { const top = [], bot = []; for (let k = 0; k <= 44; k++) { const ss = k * 1.5, tt = t0 + Math.sin(ss * 0.13 + ph) * 0.25 + Math.sin(ss * 0.5) * 0.06; top.push(P(...at(ss, tt))); bot.push(P(...at(ss, tt - 0.18 - Math.abs(Math.sin(ss * 0.3 + ph)) * 0.22))); }
    raw(`<path d="${p2([...top, ...bot.slice().reverse()])}" fill="${MURK}" opacity="0.55"/><path d="${p2([...top, ...bot.slice().reverse()])}" fill="${S.hatchB(ZW)}" opacity="0.45"/>` + line(top, 1.4, INK, 0.9) + line(top.map(([x, y]) => [x, y - 1.2]), 0.8, '#c8b888', 0.35)); }
  // sulphur in the joints of two beds; gas blisters swelling out of the rock
  for (const [t0, ph] of [[3.05, 0.4], [1.95, 2.2]]) for (let s = 0; s < 64; s += 0.5 + R() * 1.4) { const [x, y] = P(...at(s, t0 + Math.sin(s * 0.15 + ph) * 0.3)); if (R() < 0.45) raw(stain(x, y, K(ZW) * 0.18, '#8a7a30', 0.35) + BK.sulphur(x, y, K(ZW) * 0.12, 2 + Math.floor(R() * 2), { size: K(ZW) * 0.05, col: '#c0a83a' })); }
  for (const [s0, t0, r] of [[20.6, 3.4, 0.4], [36, 2.0, 0.3], [44.5, 3.6, 0.45], [26.2, 4.6, 0.3]]) { const [x, y] = P(...at(s0, t0)); raw(stain(x, y, K(ZW) * r * 1.3, '#a89030', 0.45) + BK.blisters(x, y, K(ZW) * r, Math.round(6 + r * 18), '#b8a038', { size: Math.max(1.2, K(ZW) * 0.05), flat: 0.85 })); }
  raw(hatch3(at, 0, 64, 0, 1.2, 0.7, { op: 0.32, ragged: 0.3 }));
  raw('</g>');
  for (const [g0, g1] of [GL]) raw(timber([g0, 0, ZW - 0.1], [g0 + 0.1, 2.6, ZW - 0.1], 0.32, { char: 0.55, bloom: 0.3 }) + timber([g1, 0, ZW - 0.1], [g1 - 0.1, 2.6, ZW - 0.1], 0.32, { bloom: 0.6 }) + timber([g0 - 0.3, 2.62, ZW - 0.12], [g1 + 0.3, 2.68, ZW - 0.12], 0.34, { char: 0.0 }));
  // the lamp-room hatch: a squared cut with a pegboard of numbered lamps, a few lit, gaps where lamps never came back
  { const x0 = -7.4, x1 = -4.4, y0 = 1.0, y1 = 2.6;
    raw(cel([P(x0, y0, ZW - 0.05), P(x1, y0, ZW - 0.05), P(x1, y1, ZW - 0.05), P(x0, y1, ZW - 0.05)], { Z: ZW, fill: '#2a2014', tex: 'url(#mottle)', texOp: 0.5 }));
    for (let r = 0; r < 2; r++) for (let k = 0; k < 8; k++) { const X = x0 + 0.3 + k * 0.34, Y = y1 - 0.25 - r * 0.72, [x, y] = P(X, Y, ZW - 0.1); raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="1" fill="${INK}"/>`); if ((k * 7 + r * 3) % 5 !== 1) raw(oilLamp(x, y + 5, 2.6, (k + r) % 4 === 0, { gr: 4 })); raw(`<path d="M${f1(x - 2)} ${f1(y + 12)} l${f1(1 + R())} -2 l1 2 M${f1(x + 1)} ${f1(y + 12)} l0 -2.5" stroke="#d8d0c0" stroke-width="0.6" opacity="0.7"/>`); }
    raw(timber([x0 - 0.15, y1 + 0.1, ZW - 0.12], [x1 + 0.15, y1 + 0.12, ZW - 0.12], 0.2, {}) + timber([x0 - 0.15, y0 - 0.1, ZW - 0.12], [x1 + 0.15, y0 - 0.12, ZW - 0.12], 0.16, {})); }
  // the shrine niche: a round-headed cut, the little gilded holy figure (holy), candle stubs; a dead canary in its cage
  { const nx = -3.1, ny = 1.7, nw = 0.7, nh = 0.9, arc = []; for (let k = 0; k <= 10; k++) { const a = Math.PI - k / 10 * Math.PI; arc.push(P(nx + Math.cos(a) * nw / 2, ny + nh + Math.sin(a) * nw / 2, ZW)); }
    const nic = [P(nx - nw / 2, ny, ZW), ...arc, P(nx + nw / 2, ny, ZW)]; raw(`<path d="${p2(nic)}" fill="#1a140a" stroke="${INK}" stroke-width="1"/><path d="${p2(nic)}" fill="${S.hatchA(ZW)}" opacity="0.4"/>` + glow(P(nx, ny + 0.4, ZW)[0], P(nx, ny + 0.4, ZW)[1], 30, 28, LAMP, 0.3));
    const f = P(nx, ny + 0.05, ZW - 0.05), k = K(ZW); raw(`<path d="${smooth([[f[0] - k * 0.07, f[1]], [f[0] - k * 0.08, f[1] - k * 0.3], [f[0] - k * 0.04, f[1] - k * 0.42], [f[0], f[1] - k * 0.5], [f[0] + k * 0.04, f[1] - k * 0.42], [f[0] + k * 0.08, f[1] - k * 0.3], [f[0] + k * 0.07, f[1]]], true, 0.5)}" fill="#b8963a" stroke="${INK}" stroke-width="0.7"/><path d="M${f1(f[0] - k * 0.03)} ${f1(f[1] - k * 0.45)} l0 ${f1(k * 0.35)}" stroke="#f0d890" stroke-width="0.8" opacity="0.8"/>`);
    for (const dx of [-0.24, 0.2, 0.28]) { const c = P(nx + dx, ny, ZW - 0.08); raw(`<rect x="${f1(c[0] - 1.2)}" y="${f1(c[1] - 5)}" width="2.4" height="5" fill="#d8ccb0" stroke="${INK}" stroke-width="0.5"/>` + (dx < 0.25 ? EM(`<path d="M${f1(c[0])} ${f1(c[1] - 5)} q-1.5 -3 0 -6 q1.5 3 0 6" fill="${LAMP}"/>`) : '')); }
    const cg = P(nx - 0.75, ny + 1.2, ZW - 0.2); raw(G.cage(cg[0], cg[1], 11, { col: '#7a6a40' })); }
  // the gas vent at the right: a crack burning with a steady low flame; soot fanned above it
  { const v = P(13.2, 0.75, ZW - 0.02); raw(`<path d="${smooth([[v[0] - 30, v[1] + 4], [v[0] - 12, v[1] - 80], [v[0] + 14, v[1] - 100], [v[0] + 36, v[1] - 40], [v[0] + 30, v[1] + 4]], true, 0.6)}" fill="${SOOT}" opacity="0.6"/>`);
    raw(line([[v[0] - 14, v[1] + 2], [v[0] - 3, v[1] - 1], [v[0] + 6, v[1] + 1], [v[0] + 16, v[1] - 2]], 3, INK, 1));
    raw(G.flame(v[0], v[1], 24, 22, { n: 4, lean: -0.15, gr: 3.5, gop: 0.35 })); }
}
// ---- the roof: hewn rock low overhead, black with soot, the shaft opening over the middle
{
  const atR = (s, t) => [-32 + s, RY, 3.6 + t], Lz = ZW - 3.6;
  raw(G.hewnRock(atR, 64, Lz, '#2a2419', { bed: 0.9, block: 4, pick: 0.35, tint: LT, streaks: 0 }));
  raw(hatch3(atR, 0, 64, 0, Lz, 0.3, { op: 0.4 }));
  for (let k = 0; k < 26; k++) { const s = R() * 64, t = R() * Lz, [x, y] = P(...atR(s, t)); raw(stain(x, y, K(atR(s, t)[2]) * (0.6 + R()), SOOT, 0.4)); }
  const q = [[sx0, RY, sz0], [sx1, RY, sz0], [sx1, RY, sz1], [sx0, RY, sz1]].map(p => P(...p));
  raw(`<path d="${p2(q)}" fill="#0a0806"/>`);
  { const up = 9, cid = S.id('sh'); raw(`<clipPath id="${cid}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${cid})">`);
    // the lining going up; daylight from the top catching the far lining, paler higher up
    for (let Y = RY; Y < RY + up; Y += 0.32) { const u = (Y - RY) / up; raw(`<path d="${pp([[sx0, Y, sz1], [sx1, Y, sz1], [sx1, Y + 0.28, sz1], [sx0, Y + 0.28, sz1]])}" fill="${mix(mix(PINE, MURK, 0.5), '#9a9c90', u * 0.75)}" stroke="${INK}" stroke-width="0.6"/>`); }
    for (const X of [sx0, sx1]) for (let Y = RY; Y < RY + up; Y += 0.32) { const u = (Y - RY) / up; raw(`<path d="${pp([[X, Y, sz0], [X, Y, sz1], [X, Y + 0.28, sz1], [X, Y + 0.28, sz0]])}" fill="${mix(mix('#3a2c1a', MURK, 0.4), '#7a7c70', u * (X === sx0 ? 0.7 : 0.4))}" stroke="${INK}" stroke-width="0.6"/>`); }
    raw('</g>'); }
  raw(`<path d="${p2(q)}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  raw(timber([sx0 - 0.4, RY - 0.15, sz0 - 0.1], [sx1 + 0.4, RY - 0.15, sz0 - 0.1], 0.4, { char: 0.6 }) + timber([sx0 - 0.4, RY - 0.15, sz1 + 0.1], [sx1 + 0.4, RY - 0.15, sz1 + 0.1], 0.4, {}));
  raw(timber([sx1 + 0.1, RY - 0.2, sz0 + 0.4], [sx1 + 0.6, RY - 1.6, sz0 + 0.7], 0.22, { char: 0.7 }));
  for (const X of [sx0 + 0.35, sx1 - 0.35]) { raw(timber([X, RY + 1, sz0 + 0.3], [X, RY - 1.2, sz0 + 0.3], 0.2, {})); const e = P(X, RY - 1.2, sz0 + 0.3); raw(`<path d="M${f1(e[0] - 4)} ${f1(e[1])} l2 9 l2 -6 l2 8 l2 -11" fill="${PINE}" stroke="${INK}" stroke-width="0.6"/>`); }
  raw(BK.chain(P(-0.4, RY + 3, 10.3), P(-0.35, 2.6, 10.3), 0, K(10.3) * 0.05, '#5a5650', { rigid: true }));
  { const e = P(-0.35, 2.6, 10.3); raw(`<path d="M${f1(e[0] - 3)} ${f1(e[1])} l3 7 l3 -7" stroke="${INK}" stroke-width="2.2" fill="none"/>`); }
}
// ---- plane 1 (near structure): the timber set at 8.6 m: props under its cap, one charred and split; and the cap beams
for (const Z of [8.6, 12.6]) raw(timber([-32, RY - 0.18, Z], [32, RY - 0.2, Z], 0.34, { char: Z === 8.6 ? 0.42 : undefined, bloom: Z === 12.6 ? 0.55 : undefined }));
raw(timber([-6.9, 0, 8.6], [-6.8, RY - 0.3, 8.6], 0.32, { char: 0.55, hotP: 0.4 }) + timber([6.4, 0, 8.6], [6.3, RY - 0.3, 8.6], 0.32, { bloom: 0.4 }) + timber([-6.9, RY - 0.6, 8.6], [-5.9, RY - 0.25, 8.6], 0.18, {}) + timber([6.4, RY - 0.6, 8.6], [5.4, RY - 0.25, 8.6], 0.18, {}));
// lamps hung on the gallery set and the near props, warm pools on the rock
for (const [X, Y, Z, s] of [[-10.6, 2.0, 14.8, 6], [-6.6, 2.4, 8.5, 7]]) { const l = P(X, Y, Z); raw(glow(l[0] + 4, l[1] - 2, 130, 100, LAMP, 0.3) + oilLamp(l[0], l[1], s, true, { gr: 4 })); }
// ---- THE LIGHT FOCUS: grey daylight down the shaft, a cold beam in stepped sheets with dust in it, a pale patch on the floor
{
  const top = [P(sx0 + 0.2, RY, sz0 + 0.4), P(sx1 - 0.2, RY, sz0 + 0.4)], fl = [P(sx0 - 0.1, 0, 10.0), P(sx1 + 0.3, 0, 10.9)];
  for (const [w, op] of [[1.25, 0.1], [0.95, 0.13], [0.65, 0.16], [0.35, 0.2]]) {
    const cx0 = (top[0][0] + top[1][0]) / 2, cx1 = (fl[0][0] + fl[1][0]) / 2, h0 = (top[1][0] - top[0][0]) / 2 * w, h1 = (fl[1][0] - fl[0][0]) / 2 * w;
    raw(GLOWp(`<path d="${p2([[cx0 - h0, top[0][1]], [cx0 + h0, top[0][1]], [cx1 + h1 + 6, fl[0][1]], [cx1 - h1 - 4, fl[0][1]]])}" fill="${DAY}" opacity="${op}"/>`));
  }
  for (let i = 0; i < 60; i++) { const u = R(), x = (top[0][0] + top[1][0]) / 2 + (R() - 0.5) * (40 + u * 60), y = top[0][1] + u * (fl[0][1] - top[0][1]); raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.4 + R() * 0.7)}" fill="#e8e8dc" opacity="${f1(0.3 + R() * 0.4)}"/>`); }
}
function GLOWp(s) { return s; }
// ---- ochre smoke under the roof; the quiet band; ash drifting upward
raw(G.radial(P(-0.4, RY, 10.4)[0], P(-0.4, RY, 10.4)[1] + 10, 70, 30, [[0, '#f4f4e8', 0.8], [1, '#f4f4e8', 0]]) + G.radial(P(-0.4, 0, 10.5)[0], P(-0.4, 0, 10.5)[1], 110, 22, [[0, '#e8e8dc', 0.45], [1, '#e8e8dc', 0]]));
raw(smoke(118, 40, 0.14, 1) + smoke(170, 30, 0.12, 3));
raw(BK.quiet(MURK, 230, 352, { steps: [0.26, 0.28, 0.3, 0.32], hop: 0.22 }));
for (let i = 0; i < 60; i++) { const x = R() * W, y = 40 + R() * 300; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(-2 + R() * 2)} -3 ${f1(R() * 3)} ${f1(-6 - R() * 4)}" stroke="#9a9080" stroke-width="${f1(0.5 + R() * 0.6)}" fill="none" opacity="${f1(0.3 + R() * 0.3)}"/>`); }
// ---- the floor: trodden rock and spilt ore, the rails from both bays curving to the shaft foot, cracks running in, yellow
// puddles taking the daylight; the weighing platform; the Owner's hat in the beam
{
  const at = (s, t) => [-32 + s, 0, 3.6 + t], Lz = ZW - 3.6;
  raw(`<path d="${pp([at(0, 0), at(64, 0), at(64, Lz), at(0, Lz)])}" fill="#2e281c"/><path d="${pp([at(0, 0), at(64, 0), at(64, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.6"/><path d="${pp([at(0, 0), at(64, 0), at(64, Lz), at(0, Lz)])}" fill="url(#speck)" opacity="0.4"/>`);
  for (let i = 0; i < 16; i++) { const X = -14 + R() * 28, Z = 4.2 + R() * 9.5, [x, y] = P(X, 0, Z); raw(stain(x, y, K(Z) * (0.3 + R() * 0.5), R() < 0.4 ? '#5a5024' : SOOT, 0.25)); }
  for (let i = 0; i < 9; i++) { const X = -12 + R() * 24, Z = 4.6 + R() * 8, w = 0.8 + R() * 1.6, d = 0.4 + R() * 0.7, lt = LT([X, 0, Z]); const q = S.blobST(X, Z, w, d, 9, 0.4).map(([a, b]) => P(a, 0.005, b)); raw(cel(q, { Z, fill: tone(lt ? mix('#3e3628', lt[0], lt[1] * 0.6) : '#3e3628', 0.15), tex: 'url(#mottle)', texOp: 0.4, band: Math.max(0.8, K(Z) * 0.02), inkW: 0.6 })); }
  for (let i = 0; i < 200; i++) { const X = -16 + R() * 32, Z = 3.8 + Math.pow(R(), 0.8) * (Lz - 0.4), [x, y] = P(X, 0, Z), r = K(Z) * (0.03 + R() * 0.08); raw(cel(chip(ell([x, y - r * 0.3], r, r * 0.45, (R() - 0.5) * 0.4, 7), 0.6), { Z, fill: tone(R() < 0.18 ? '#8a7a32' : '#3e3628', 0.2), band: 0.7, inkW: 0.4, heavy: 0.6, hi: false })); }
  raw(G.floorCracks(at, 20, 44, 0.4, Lz, 9, { toward: 32 }));
  for (const [X, Z, w] of [[-3.2, 9.2, 1.4], [2.4, 7.8, 1.1], [-8.0, 11.4, 1.6], [5.6, 12.2, 1.2]]) raw(G.puddle(at, X + 32, Z - 3.6, w, w * 0.5, { col: '#2a2814', refl: [DAY, '#c8b040'], rings: false }));
  for (const [g0, g1] of [GL, PS]) { const gm = (g0 + g1) / 2;
    for (const dx of [-0.35, 0.35]) { const pts = []; for (let k = 0; k <= 12; k++) { const u = k / 12, Z = ZW - u * 4.6, X = gm + (-0.4 - gm) * Math.pow(u, 1.6) + dx; pts.push(P(X, 0.05, Z)); } raw(line(pts, 2, INK, 1) + line(pts.map(([x, y]) => [x, y - 0.6]), 0.9, '#8a8680', 0.9)); }
    for (let k = 0; k <= 10; k++) { const u = k / 10, Z = ZW - u * 4.6, X = gm + (-0.4 - gm) * Math.pow(u, 1.6); raw(line([P(X - 0.6, 0.02, Z), P(X + 0.6, 0.02, Z)], Math.max(1, K(Z) * 0.1), '#2a2014', 0.95)); } }
  raw(S.boards((s, t) => [3.2 + s, 0.01, 10.2 + t], 2.2, 1.6, '#4a3a26', { bw: 0.2, segs: 1 }));
  // the beam's pale patch and the Owner's broad hat in it, crown dented, brim burnt through
  { const c = P(-0.3, 0, 10.45), k = K(10.45); raw(`<path d="${smooth(ell(c, k * 1.15, k * 0.18, 0, 16), true, 0.6)}" fill="${DAY}" opacity="0.1"/><path d="${smooth(ell(c, k * 0.7, k * 0.11, 0, 14), true, 0.6)}" fill="${DAY}" opacity="0.1"/>`); }
  { const Z = 10.6, h = P(-0.7, 0, Z), k = K(Z); raw(cel(ell([h[0], h[1]], k * 0.34, k * 0.075, 0, 16), { Z, fill: '#2e2822', band: 1 }) + cel([[h[0] - k * 0.15, h[1] - k * 0.02], [h[0] - k * 0.13, h[1] - k * 0.17], [h[0] + k * 0.12, h[1] - k * 0.18], [h[0] + k * 0.16, h[1] - k * 0.02]], { Z, fill: '#3a342c' }) + line([[h[0] - k * 0.13, h[1] - k * 0.16], [h[0] + k * 0.02, h[1] - k * 0.19]], 0.8, '#a8a89c', 0.7) + EM(`<path d="M${f1(h[0] + k * 0.2)} ${f1(h[1] + k * 0.01)} l${f1(k * 0.1)} ${f1(-k * 0.02)}" stroke="${HOT}" stroke-width="0.9" opacity="0.7"/>`)); }
  raw(occBand((s, t) => [-32 + s, 0, ZW - t], 64, 1.4, { op: 0.32, cross: true }));
}

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  const Z = 10.2, k = K(Z);
  // the overturned ore tub spilling sulphur ore across the rails
  { const c = P(-7.0, 0, Z); raw(cel([[c[0] - k * 0.5, c[1] - k * 0.75], [c[0] + k * 0.45, c[1] - k * 0.62], [c[0] + k * 0.42, c[1] - k * 0.05], [c[0] - k * 0.55, c[1] - k * 0.1]], { Z, fill: '#3e3020', tex: 'url(#mottle)', texOp: 0.5 }));
    for (let j = 0; j < 3; j++) raw(line([[c[0] - k * 0.53, c[1] - k * (0.15 + j * 0.25)], [c[0] + k * 0.44, c[1] - k * (0.1 + j * 0.22)]], 1.6, '#2a2620', 1));
    for (const dy of [0.2, 0.62]) raw(`<circle cx="${f1(c[0] + k * 0.5)}" cy="${f1(c[1] - k * dy)}" r="${f1(k * 0.12)}" fill="#2a2620" stroke="${INK}" stroke-width="0.8"/>`);
    raw(stain(c[0] - k * 0.9, c[1] - 2, k * 0.5, '#6a5c28', 0.5) + BK.sulphur(c[0] - k * 0.9, c[1] - 2, k * 0.45, 12, { size: k * 0.05, col: '#8a7a34' })); }
  // the weighman's steelyard over the platform
  { raw(timber([2.9, 0, Z + 0.4], [2.9, 2.5, Z + 0.4], 0.2, { bloom: 0.4 }) + timber([2.7, 2.45, Z + 0.4], [5.8, 2.45, Z + 0.4], 0.18, {}));
    const hk = P(4.4, 2.35, Z + 0.4), bar0 = [hk[0] - k * 0.5, hk[1] + k * 0.35], bar1 = [hk[0] + k * 0.9, hk[1] + k * 0.28];
    raw(line([hk, [hk[0], hk[1] + k * 0.3]], 1, INK, 1) + line([bar0, bar1], 3.2, INK, 1) + line([bar0, bar1], 1.6, '#4a4642', 1));
    raw(cel(ell([bar1[0] - k * 0.25, bar1[1] + k * 0.12], k * 0.07, k * 0.1, 0, 10), { Z, fill: '#3a3632', band: 1 }));
    raw(line([bar0, [bar0[0] - k * 0.12, bar0[1] + k * 0.5]], 0.7, INK, 1) + line([bar0, [bar0[0] + k * 0.12, bar0[1] + k * 0.5]], 0.7, INK, 1) + cel([[bar0[0] - k * 0.2, bar0[1] + k * 0.5], [bar0[0] + k * 0.2, bar0[1] + k * 0.5], [bar0[0] + k * 0.15, bar0[1] + k * 0.58], [bar0[0] - k * 0.15, bar0[1] + k * 0.58]], { Z, fill: '#4a4642' })); }
  { const a = P(-3.2, 0.03, Z - 0.5), b = P(-2.0, 0.05, Z - 0.9); raw(line([a, b], 2.4, INK, 1) + line([a, b], 1.2, '#5a4630', 1) + `<path d="M${f1(b[0] - 4)} ${f1(b[1] - 6)} q5 2 8 10" stroke="${INK}" stroke-width="2.4" fill="none"/>`); }
  // a dropped fuse coil and two kegs rolled out of the store, low and dark
  { const c = P(8.2, 0, 11.6), kk = K(11.6); raw(G.keg(c[0], c[1], kk * 0.7, { Z: 11.6, col: '#3e2e1c' }) + G.keg(c[0] + kk * 0.62, c[1] + 1, kk * 0.66, { Z: 11.6, col: '#3a2a1a' })); }
}

// ======================================================================== FORE: the near set and the powder kegs
layer('fore');
{
  const ZN = 4.3;
  raw(timber([-4.85, -0.5, ZN], [-4.7, RY, ZN], 0.42, { char: 0.45, bloom: 0.25, hotP: 0.35 }) + timber([4.9, -0.5, ZN], [4.8, RY, ZN], 0.42, { bloom: 0.5, cap: true }));
  raw(timber([-32, RY - 0.25, ZN + 0.2], [32, RY - 0.22, ZN + 0.2], 0.5, { char: 0.3 }));
  // lagging boards over the near cap: the top edge of the frame, dark, a few sagging
  for (let X = -6.2; X < 6.2; X += 0.34 + R() * 0.06) { const a = P(X, RY + 0.05, ZN + 0.2), b = P(X + 0.3, RY + 0.05, ZN + 0.2); raw(cel([[a[0], -4], [b[0], -4], [b[0], a[1] + (R() < 0.15 ? 8 : 0)], [a[0], a[1]]], { Z: ZN, fill: tone('#24190e', 0.1), band: 2 })); }
  // the top edge: a split lagging board and a rope hanging from the near cap (out of frame above), a cold lamp on it
  raw(cel([[150, -6], [196, -6], [214, 52], [200, 58], [176, 20]], { Z: 3, fill: '#2a1e12', tex: 'url(#mottle)', texOp: 0.5, band: 4 }) + line([[188, 2], [204, 50]], 1, INK, 0.7));
  raw(BK.rope([[1210, -6], [1206, 40], [1208, 88]], 2.2, '#5a4a30') + oilLamp(1208, 100, 9, false));
  { const c = P(-4.8, RY - 0.4, ZN); raw(stain(c[0] + 60, c[1] + 8, 22, '#5a5020', 0.3) + BK.sulphur(c[0] + 60, c[1] + 8, 22, 6, { size: 4, col: '#b8a038' })); }
  // rock at the bottom left, crusted; powder kegs and a fuse coil at the bottom right
  raw(rockH([[-10, H + 4], [6, H - 38], [60, H - 54], [128, H - 40], [176, H - 18], [220, H + 4]], 3, '#2a2216', { cell: 26, flank: 0.4, rim: true, rimOp: 0.3 }));
  raw(stain(90, H - 36, 36, '#5a5020', 0.3) + BK.sulphur(90, H - 40, 34, 9, { size: 4, col: '#b8a038' }));
  raw(G.keg(W - 70, H + 8, 92, { Z: 3, col: '#3a2a18', mark: true }) + G.keg(W - 150, H + 14, 78, { Z: 3, col: '#33251a' }));
  raw(line([[W - 210, H - 4], [W - 180, H - 14], [W - 150, H - 8], [W - 166, H + 2], [W - 196, H - 2]], 2.2, '#5a4a30', 1) + line([[W - 210, H - 4], [W - 180, H - 14], [W - 150, H - 8]], 0.8, INK, 0.7));
  { const c = P(4.85, 2.7, ZN - 0.2); raw(G.cage(c[0] - 40, c[1] + 16, 32, { col: '#5a4a30', dead: false, bird: '#2a2418' })); }
  { const c = P(-4.75, 2.3, ZN - 0.25); raw(oilLamp(c[0] + 34, c[1], 8, true, { gr: 5, gop: 0.3 })); }
  for (let i = 0; i < 36; i++) { const x = R() * W, y = 60 + R() * 380; raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + R())}" fill="${R() < 0.5 ? '#d8c870' : '#8a8478'}" opacity="${f1(0.3 + R() * 0.3)}"/>`); }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
