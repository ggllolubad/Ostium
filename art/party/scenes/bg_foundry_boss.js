// World V, the Storm Foundry: THE GREAT ANVIL, boss room of the Anvil Titan (round 2, group g2). Room key 'foundry_boss'.
// Contract as the nave: 1480 x 480 (shown at 2x); foundry_boss_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounter: The Anvil Titan (bronze_automaton, anvil_titan). "The foundry's first work. Its makers built it to strike the
// anvil forever. It found something softer." A riveted bronze colossus at the great anvil, a lightning rod spike on its
// back, seams glowing white-gold where the storm runs inside.
// The place: the guild's first forge, the round smithy where the Titan was cast and set to work: a hall built like a
// chapter house, its piers running round in a ring, the roof's ribs climbing to an oculus where the storm comes in. Behind
// the anvil's plinth the great hearth opens in the wall like an apse, white-gold, the size of a church door; the Titan
// stands in it. Round the ring, in the bays, the guild's first trials: a spare bronze hand on a trestle, the mould of a
// helm, tongs as long as a man, the broken chains that once held the Titan to the anvil. Down through the oculus falls a
// column of rain, cold and grey, hissing to steam on the hot plates. Before the plinth, hammered flat into the iron, a
// breastplate and a helm: what it found that was softer (old blood dark in the seams).
// Composition: the right 45% is the boss's stage; the hearth's arch frames the giant, its blaze behind his silhouette.
// Courses: FIRE (the hearth, soot fanned up the arch, slag, embers); LIGHTNING (burns ferned up every pier from the floor,
// the chains fused, a fused fern across the plates to the anvil; the oculus rain). No lightning is drawn.
// Light: the most dramatic in the world: the hearth's white-gold blaze behind the boss and the cold rain column at the left.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'V');
const W = 1480, H = 480, ROOM = 'foundry_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2735, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141018' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM, ashlar } = S;
const BK = require('./battle_li')(S);
const MURK = '#0c0a0c', AIR = '#1c1818';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 8, airD: 26, airMax: 0.5 });
const { line, polyS, timber } = G;
const { ell } = require('../engine');
const BRONZE = '#9a6a32', WG = '#f4e6b0', SOOT = '#14110e', IRON = '#34343a', HOT = '#ffb050', WET = '#c8d4e0', STONE = '#463c36', RAIN = '#b8c8d8';
const burn = (at, s, t, len, ang, o = {}) => BK.scorch(at, s, t, len, ang, Object.assign({ w: 0.05, depth: 4, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.2 }, o));
const ZH = 21, HX0 = 5.4, HX1 = 17.2, HS = 4.2;            // the hearth wall, the hearth's span and its springing
const HC = P((HX0 + HX1) / 2, 5, ZH);
const RING = [[-13.4, 11.0], [-10.6, 15.2], [-6.8, 18.6], [-2.4, 20.8]];   // piers round the ring (X, Z)
const LT = G.lightTint([{ p: [(HX0 + HX1) / 2, 4, ZH - 1], col: '#c87a34', r: 10, k: 0.45 }, { p: [-3.6, 2, 13], col: '#8a9cb0', r: 4, k: 0.45 }]);

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3: inside the great hearth: the coal bed blazing white-gold, the back of the hearth glowing in steps
{
  const arc = []; for (let k = 0; k <= 24; k++) { const a = Math.PI - k / 24 * Math.PI; arc.push(P((HX0 + HX1) / 2 + Math.cos(a) * (HX1 - HX0) / 2, HS + Math.sin(a) * (HX1 - HX0) / 2 * 0.9, ZH)); }
  const op = [P(HX0, 0, ZH), ...arc, P(HX1, 0, ZH)], cid = S.id('hh');
  raw(`<path d="${p2(op)}" fill="#3a1a08"/><clipPath id="${cid}"><path d="${p2(op)}"/></clipPath><g clip-path="url(#${cid})">`);
  const core = P((HX0 + HX1) / 2, 1.6, ZH + 3);
  raw(G.radial(core[0], core[1] - 40, 600, 420, [[0, '#fff8e0'], [0.12, '#fce4a0'], [0.3, '#f8b850'], [0.5, '#e8902e'], [0.72, '#b8541a'], [1, '#5a240c']]));  // the hearth's back wall: firebrick courses glowing through, burnt black at the top edge
  raw(`<g opacity="0.3">${G.builtWall((s, t) => [HX0 + s, t, ZH + 4], HX1 - HX0, 9, '#8a3a14', { ashlar: { scale: 0.6, rough: false } })}</g>`);
  // the coal bed: a heap of coke along the hearth floor, black lumps with white-gold between
  for (let i = 0; i < 120; i++) { const X = HX0 + 0.5 + R() * (HX1 - HX0 - 1), Z = ZH + 0.5 + R() * 3, Y = 0.3 + R() * 0.9 * (1 - Math.abs(X - (HX0 + HX1) / 2) / 7), [x, y] = P(X, Y, Z), r = K(Z) * (0.06 + R() * 0.1); raw(cel(chip(ell([x, y], r, r * 0.7, R(), 7), 0.5), { Z, fill: R() < 0.3 ? '#fff0c0' : R() < 0.5 ? '#f0a040' : '#1a1410', band: 0.8, inkW: 0.5 })); }
  G.fireAt((HX0 + HX1) / 2 - 1.5, 1.0, ZH + 2, 3.0, 3.2, { n: 9, licks: 9, gop: 0.25, gcol: HOT });
  G.fireAt((HX0 + HX1) / 2 + 2.2, 1.0, ZH + 2.5, 2.2, 2.4, { n: 7, gop: 0.2, gcol: HOT });
  raw(G.sparks(60, core[0] - 260, core[0] + 260, core[1] - 300, core[1] - 40, [WG, HOT, '#ffffff'], { len: 8 }));
  raw('</g>');
  // the hearth wall round it: huge rough-coursed stone, soot fanned up from the arch
  const at = (s, t) => [0 + s, t, ZH], cid2 = S.id('hw');
  raw(`<clipPath id="${cid2}"><path clip-rule="evenodd" d="${pp([at(0, 0), at(30, 0), at(30, 20), at(0, 20)])} ${p2(op)}"/></clipPath><g clip-path="url(#${cid2})">`);
  raw(G.builtWall(at, 30, 20, '#3a302a', { ashlar: { scale: 1.3, wscale: 1.5, roughP: 0.6 } }));
  raw(`<path d="${smooth([P(HX0 - 1, HS + 2, ZH), P(HX0 + 1, HS + 9, ZH), P((HX0 + HX1) / 2, 22, ZH), P(HX1 - 1, HS + 9, ZH), P(HX1 + 1, HS + 2, ZH), P(HX1 + 3, 22, ZH), P(HX0 - 3, 22, ZH)], true, 0.5)}" fill="${SOOT}" opacity="0.55"/>`);
  raw(burn(at, 2.0, 0.2, 5, Math.PI / 2 + 0.1, { w: 0.08 }) + burn(at, 29, 0.2, 4.5, Math.PI / 2 - 0.15, { w: 0.07 }));
  raw('</g>');
  // the arch: voussoirs of dressed stone, each its own width, iron straps; a white-gold lip where the heat licks it
  { const R0 = (HX1 - HX0) / 2, cx = (HX0 + HX1) / 2; let a = Math.PI;
    while (a > 0.02) { const da = 0.09 + R() * 0.06, a1 = Math.max(0, a - da), d = 1.3 + R() * 0.3, q = [[a, R0], [a1, R0], [a1, R0 + d], [a, R0 + d]].map(([aa, rr]) => P(cx + Math.cos(aa) * rr, HS + Math.sin(aa) * rr * 0.9, ZH - 0.05));
      raw(cel(chip(q, 0.3), { Z: ZH, fill: tone(mix('#5a4a3e', '#d88a40', 0.35 * Math.sin(a)), 0.15), tex: 'url(#mottle)', texOp: 0.45, band: 2 })); a = a1; }
    const lip = []; for (let k = 0; k <= 30; k++) { const aa = Math.PI - k / 30 * Math.PI; lip.push(P(cx + Math.cos(aa) * (R0 + 0.06), HS + Math.sin(aa) * (R0 + 0.06) * 0.9, ZH - 0.06)); }
    raw(EM(line(lip, 2.2, '#ffe0a0', 0.8)));
    for (const sg of [-1, 1]) { const X = cx + sg * (R0 + 0.65); raw(cel([P(X - 0.75, 0, ZH - 0.05), P(X + 0.75, 0, ZH - 0.05), P(X + 0.75, HS, ZH - 0.05), P(X - 0.75, HS, ZH - 0.05)], { Z: ZH, fill: mix('#5a4a3e', '#c87a38', 0.25), tex: 'url(#mottle)', texOp: 0.5, band: 3 })); } }
  raw(glow(HC[0], HC[1], 560, 300, HOT, 0.35) + glow(HC[0], P(0, 2, ZH)[1], 300, 130, WG, 0.3));
}
// ---- plane 2: the ring of piers round the hall, the bays between with the guild's first trials in them; the ribs
// climbing to the oculus (out of frame above)
{
  // the bays' back walls between the piers
  for (let i = 0; i < RING.length - 1; i++) {
    const [xa, za] = RING[i], [xb, zb] = RING[i + 1], at = (s, t) => { const u = s / 1; return [xa + (xb - xa) * u, t, za + (zb - za) * u]; };
    raw(G.builtWall((s, t) => at(s / Math.hypot(xb - xa, zb - za), t), Math.hypot(xb - xa, zb - za), 18, STONE, { ashlar: { scale: 1.1, wscale: 1.4 } }));
    raw(`<path d="${pp([at(0, 0), at(1, 0), at(1, 18), at(0, 18)])}" fill="${MURK}" opacity="0.3"/>`);
  }
  // the trials: a spare bronze hand on a trestle (bay 1), the helm's mould (bay 2), tongs and a chain hung (bay 3)
  { const c = P(-11.6, 1.3, 14.2), k = K(14.2); raw(G.timber([-12.4, 0, 14], [-12.4, 1.2, 14], 0.14, { col: '#3a2a1c' }) + G.timber([-10.8, 0, 14.4], [-10.8, 1.2, 14.4], 0.14, { col: '#3a2a1c' }) + G.timber([-12.6, 1.2, 14.1], [-10.6, 1.25, 14.4], 0.18, { col: '#3a2a1c' }));
    const hand = [[c[0] - k * 0.9, c[1] - k * 0.05], [c[0] - k * 0.6, c[1] - k * 0.45], [c[0] - k * 0.2, c[1] - k * 0.55], [c[0] - k * 0.1, c[1] - k * 1.0], [c[0] + k * 0.05, c[1] - k * 1.05], [c[0] + k * 0.1, c[1] - k * 0.6], [c[0] + k * 0.25, c[1] - k * 1.1], [c[0] + k * 0.4, c[1] - k * 1.05], [c[0] + k * 0.42, c[1] - k * 0.55], [c[0] + k * 0.6, c[1] - k * 0.95], [c[0] + k * 0.75, c[1] - k * 0.85], [c[0] + k * 0.65, c[1] - k * 0.3], [c[0] + k * 0.5, c[1] - k * 0.02]];
    raw(cel(hand, { Z: 14, fill: G.dim(BRONZE, 14), tex: 'url(#mottle)', texOp: 0.45, band: k * 0.15 }) + line(hand.slice(1, 5).map(([x, y]) => [x + 1.5, y + 1]), 1, '#e8c080', 0.5));
    for (let j = 0; j < 6; j++) raw(`<circle cx="${f1(c[0] - k * 0.5 + j * k * 0.2)}" cy="${f1(c[1] - k * 0.12)}" r="${f1(Math.max(0.8, k * 0.025))}" fill="${INK}"/>`); }
  { const c = P(-8.8, 0, 17.3), k = K(17.3); raw(G.smoothRock([[c[0] - k * 0.8, c[1]], [c[0] - k * 0.75, c[1] - k * 0.9], [c[0] - k * 0.4, c[1] - k * 1.4], [c[0] + k * 0.3, c[1] - k * 1.45], [c[0] + k * 0.75, c[1] - k * 0.9], [c[0] + k * 0.8, c[1]]], 17, G.dim('#5a4436', 17), { dir: 'v', rib: 4, flank: 0.4, rimCol: '#d8a070', rimOp: 0.4 }) + `<path d="M${f1(c[0] - k * 0.05)} ${f1(c[1] - k * 1.4)} L${f1(c[0] + k * 0.02)} ${f1(c[1])}" stroke="${INK}" stroke-width="1.4"/><path d="M${f1(c[0] - k * 0.35)} ${f1(c[1] - k * 0.75)} l${f1(k * 0.25)} 0" stroke="${INK}" stroke-width="2.4"/>`); }
  { const a = P(-4.8, 4.6, 19.6), k = K(19.6); raw(BK.chain(a, P(-4.6, 1.0, 19.6), 0, Math.max(1.2, k * 0.08), '#3a3a40', { rigid: true }) + BK.chain(P(-4.0, 4.6, 19.6), P(-3.3, 2.2, 19.6), 14, Math.max(1.2, k * 0.08), '#3a3a40')); for (const dx of [-5.6, -5.4]) raw(line([P(dx, 4.2, 19.4), P(dx - 0.2, 0.4, 19.4)], 2.4, INK, 1)); }
  // the piers: massive dressed-stone shafts, each struck: a burn ferned up from its foot
  for (const [X, Z] of RING) { const w = 0.9, k = K(Z);
    raw(ashlar((s, t) => [X - w / 2 + s, t, Z - 0.5], w, 16, G.dim('#5a4c42', Z), { scale: 1.3, vary: 0.18, chip: 0.4, mortar: 0.6, courses: [0.7, 0.65, 0.75, 0.6] }));
    raw(`<path d="${pp([[X + w / 2, 0, Z - 0.5], [X + w / 2, 0, Z + 0.5], [X + w / 2, 16, Z + 0.5], [X + w / 2, 16, Z - 0.5]])}" fill="${G.dim('#2a221c', Z)}"/>` + line([P(X - w / 2, 0, Z - 0.5), P(X - w / 2, 16, Z - 0.5)].map(([x, y]) => [x + 1, y]), 0.9, '#c8a888', 0.35));
    raw(burn((s, t) => [X - w / 2 + s, t, Z - 0.51], 0.45, 0.05, 3 + R() * 2, Math.PI / 2 + (R() - 0.5) * 0.3, { w: 0.06, core: WG, coreOp: 0.35 }));
    const lt = LT([X, 3, Z]); if (lt) raw(`<path d="${pp([[X - w / 2, 0, Z - 0.5], [X + w / 2, 0, Z - 0.5], [X + w / 2, 16, Z - 0.5], [X - w / 2, 16, Z - 0.5]])}" fill="${lt[0]}" opacity="${f1(lt[1] * 0.35)}"/>`);
  }
  // the ribs: from each pier and the hearth wall up toward the oculus, curving in
  for (const [X, Z] of [...RING, [HX0 - 1.2, ZH - 0.2], [HX1 + 1.4, ZH - 0.2]]) { const pts = []; for (let u = 0; u <= 1; u += 0.1) { const Y = 9 + u * 14, XX = X + (-2 - X) * Math.pow(u, 1.6), ZZ = Z + (14 - Z) * Math.pow(u, 1.6); pts.push(P(XX, Y, ZZ)); } raw(line(pts, Math.max(4, K(Z) * 0.6), INK, 1) + line(pts, Math.max(2.5, K(Z) * 0.45), '#3a302a', 1) + line(pts.map(([x, y]) => [x - 1.2, y]), 0.9, '#c8a070', 0.3)); }
}
// ---- the oculus's rain: a cold grey column falling from out of frame onto the plates at the left of centre, stepped
// sheets with streaks; steam boiling up where it hits the hot iron
{
  const top = [P(-5.4, 20, 13.5), P(-1.6, 20, 13.5)], bot = [P(-5.0, 0, 13.0), P(-2.0, 0, 13.0)];
  for (const [w, op] of [[1.3, 0.07], [1.0, 0.08], [0.72, 0.09], [0.45, 0.08]]) { const cx0 = (top[0][0] + top[1][0]) / 2, cx1 = (bot[0][0] + bot[1][0]) / 2, h0 = (top[1][0] - top[0][0]) / 2 * w, h1 = (bot[1][0] - bot[0][0]) / 2 * w; raw(`<path d="${p2([[cx0 - h0, -20], [cx0 + h0, -20], [cx1 + h1, bot[0][1]], [cx1 - h1, bot[0][1]]])}" fill="${RAIN}" opacity="${op}"/>`); }
  raw(BK.rain(420, { x0: bot[0][0] - 20, x1: bot[1][0] + 20, y0: -10, y1: bot[0][1], slant: 0.03, len: 16, col: '#e0eaf4', op: 0.45 }));
  raw(BK.splashes((s, t) => [s, 0, t], -5.2, -1.8, 12.2, 13.8, 50, '#e0eaf4'));
  raw(G.steam(P(-3.5, 0, 13)[0], P(-3.5, 0, 13)[1], 130, 90, { col: '#d8dde4', op: 0.2, n: 7, drift: 0.4 }));
}
raw(G.frameDark(HC[0] - 300, HC[1] + 10, 860, 340, [[1.0, 0.26], [0.8, 0.22], [0.62, 0.16]]));
raw(BK.quiet(MURK, 238, 352, { steps: [0.14, 0.18, 0.2, 0.22], hop: 0.18 }));
// ---- the floor: great iron plates laid in rings round the anvil's plinth (the joints converge), the wet ring under the
// oculus, a fern burned across the plates to the anvil, slag; the plinth's three steps; and what it found softer
{
  const at = (s, t) => [-24 + s, 0, 3.6 + t], Lz = ZH - 3.6, AC = [8.6, 9.6];
  raw(`<path d="${pp([at(0, 0), at(48, 0), at(48, Lz), at(0, Lz)])}" fill="#22201e"/><path d="${pp([at(0, 0), at(48, 0), at(48, Lz), at(0, Lz)])}" fill="url(#speck)" opacity="0.5"/>`);
  // plates in rings: radial joints and ring joints round the plinth centre
  for (let r = 2.4; r < 22; r += 1.6 + r * 0.05) { const pts = []; for (let a = -Math.PI; a <= 0.01; a += 0.04) { const X = AC[0] + Math.cos(a) * r, Z = AC[1] + Math.sin(a) * r * 0.9; if (Z > 3.7) pts.push(P(X, 0.005, Z)); else if (pts.length) break; } if (pts.length > 1) raw(line(pts, 1, INK, 0.7) + line(pts.map(([x, y]) => [x, y - 0.8]), 0.6, '#8a8480', 0.35)); }
  for (let a = -Math.PI; a < 0; a += 0.13 + R() * 0.04) { const A = P(AC[0] + Math.cos(a) * 2.4, 0.005, AC[1] + Math.sin(a) * 2.2), Bz = AC[1] + Math.sin(a) * 20, Bx = AC[0] + Math.cos(a) * 20; if (Bz < 3.7) { const u = (AC[1] - 3.7) / (AC[1] - Bz); raw(line([A, P(AC[0] + Math.cos(a) * 20 * u, 0.005, 3.7)], 0.9, INK, 0.6)); } else raw(line([A, P(Bx, 0.005, Bz)], 0.9, INK, 0.6)); }
  for (let i = 0; i < 60; i++) { const X = -10 + R() * 22, Z = 4 + R() * 14, [x, y] = P(X, 0.01, Z); if (R() < 0.5) raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.max(0.6, K(Z) * 0.025))}" ry="${f1(Math.max(0.35, K(Z) * 0.01))}" fill="${INK}"/>`); }
  // the plinth: three broad steps round the anvil, dressed stone, the front edge lit by the hearth
  for (const [r, Y] of [[3.6, 0.15], [3.0, 0.3], [2.4, 0.45]]) { const pts = [], pts2 = []; for (let a = -Math.PI; a <= 0.01; a += 0.08) { pts.push(P(AC[0] + Math.cos(a) * r, Y, AC[1] + Math.sin(a) * r * 0.8)); pts2.push(P(AC[0] + Math.cos(a) * r, Y - 0.15, AC[1] + Math.sin(a) * r * 0.8)); } raw(`<path d="${p2([...pts, ...pts2.reverse()])}" fill="#3a302a" stroke="${INK}" stroke-width="1"/>` + line(pts, 1, '#e8a860', 0.45)); }
  // the wet ring under the oculus, puddles holding the cold light and the hearth's glow
  for (const [X, Z, w] of [[-3.4, 12.6, 2.6], [-2.2, 11.0, 1.6], [-5.0, 14.4, 1.4]]) raw(G.puddle(at, X + 24, Z - 3.6, w, w * 0.4, { col: '#141a22', refl: [RAIN, HOT], ringCol: '#e0eaf4' }));
  // the fern burned across the plates from the oculus to the anvil
  raw(burn((s, t) => [s, 0.012, t], -3.2, 12.4, 9, -0.15, { w: 0.08, depth: 5, core: WG, coreOp: 0.4 }));
  for (let i = 0; i < 30; i++) { const X = -8 + R() * 20, Z = 4 + R() * 14, [x, y] = P(X, 0.01, Z), r = K(Z) * (0.04 + R() * 0.08); raw(`<path d="${smooth(S.blobST(x, y, r * 2, r * 0.6, 8, 0.6), true, 0.6)}" fill="#141210" stroke="${INK}" stroke-width="0.5"/>` + (R() < 0.3 ? EM(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(0.6, r * 0.25))}" fill="${HOT}"/>`) : '')); }
  raw(glow(HC[0], P(0, 0, 17)[1], 520, 40, HOT, 0.22));
}

// ======================================================================== MID: what it found softer, low and dark before the plinth
layer('mid');
{
  const Z = 9.4, k = K(Z), c = P(2.6, 0, Z);
  // a breastplate hammered flat into the plate, its rim splayed; a helm beaten to a disc beside it; old blood dark
  raw(stain(c[0] + k * 0.1, c[1] - 1, k * 0.7, '#3a0e0a', 0.55));
  raw(cel([[c[0] - k * 0.45, c[1] - k * 0.02], [c[0] - k * 0.3, c[1] - k * 0.08], [c[0] + k * 0.2, c[1] - k * 0.09], [c[0] + k * 0.5, c[1] - k * 0.03], [c[0] + k * 0.42, c[1] + k * 0.03], [c[0] - k * 0.4, c[1] + k * 0.03]], { Z, fill: '#4a4a52', band: 1 }) + line([[c[0] - k * 0.3, c[1] - k * 0.07], [c[0] + k * 0.2, c[1] - k * 0.08]], 0.8, '#a8acb4', 0.6));
  raw(cel(ell([c[0] + k * 0.9, c[1] - k * 0.02], k * 0.2, k * 0.05, 0.05, 12), { Z, fill: '#3a3a42', band: 1 }));
  { const a = P(-1.4, 0.02, Z - 0.4), b = P(0.2, 0.04, Z - 0.9); raw(line([a, b], 2.6, INK, 1) + line([a, b], 1.2, '#4a3a28', 1)); }
}

// ======================================================================== FORE: a near pier at the left, the broken binding chain hanging across
// the top, slag low at the right
layer('fore');
{
  raw(ashlar((s, t) => [-4.9 + s, t, 4.0], 0.7, 8, '#2a221e', { scale: 1.2, vary: 0.15, chip: 0.4, mortar: 0.6, courses: [0.7, 0.6, 0.75] }));
  raw(`<path d="${pp([[-4.2, -1, 4.0], [-4.2, -1, 4.6], [-4.2, 8, 4.6], [-4.2, 8, 4.0]])}" fill="#120e0c"/>` + burn((s, t) => [-4.9 + s, t, 3.99], 0.35, -0.3, 3.6, Math.PI / 2 + 0.1, { w: 0.07, core: WG, coreOp: 0.3 }));
  raw(BK.chain([P(-4.2, 3.6, 4)[0], 40], [620, 96], 60, 6, '#2a2a30') + BK.chain([620, 96], [700, 150], 0, 6, '#2a2a30', { rigid: true }));
  raw(cel([[690, 142], [714, 146], [716, 166], [696, 170]], { Z: 3, fill: '#1a1a1e', band: 3 }));
  // the near step of the anvil's plinth, crossing the boss's stage: dressed stone, its top lip lit by the hearth, chipped
  { const top = [[958, H + 4], [968, 436], [1100, 432], [1260, 430], [1400, 431], [W + 10, 432], [W + 10, H + 4]];
    raw(cel(top, { Z: 4, fill: '#2a221c', tex: 'url(#mottle)', texOp: 0.5, band: 6 }) + line(top.slice(1, 6).map(([x, y]) => [x, y + 1.5]), 1.6, '#e8a860', 0.6));
    for (let x = 1000; x < W; x += 90 + R() * 70) raw(line([[x, 434], [x + (R() - 0.5) * 8, H + 4]], 1.2, INK, 0.7));
    raw(BK.blisters(1120, 452, 60, 6, '#141210', { size: 4, flat: 0.4 })); }
  raw(G.sparks(50, 900, 1480, 60, 400, [WG, HOT], { len: 6 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, note: 'right 45% kept for the ruler; the great hearth frames it' } }, null, 1));
console.log(ROOM + ' layers written');
