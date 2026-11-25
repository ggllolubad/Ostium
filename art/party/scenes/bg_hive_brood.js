// World X, the Venom Spires: THE BROOD CHAMBER (`hive_brood`, round 2, new). Battle room, Living Ink.
// Place: under the plain road. The spiders' brood chamber, a hollow eaten out of the earth beneath the old paving (bible
// X: the plain's travellers' roads; the Brood Mother, the spiders' queen, her back crawling with young, egg sacs webbed to
// her; venom spiders weaving and waiting for food). Encounter: the Brood Chamber (something enormous with something small
// on its back).
// Kind of space: underground, low and deep: the road's paving is the ceiling, held up by roots and silk; earth piers
// stand in the dark; tunnels run off into blackness.
// Light: darkness with one lamp. A carter's lantern, hooked on a root by its last owner, still burns over the middle of
// the chamber: warm, low, small; it lights the silk sheets round it and a pool of the floor; everything else is black.
// Shapes: curves that hang: silk sheets in catenaries, egg sacs in clusters, roots; the ceiling's slabs seen from below.
// Palette key: the darkest room of the world, warm: earth brown-black, amber lamp, pale silk, venom green in the sacs.
// Depth planes (far): the ceiling slabs and silk drapes near (5-9 m); the earth piers with their egg-sac clusters and
// the lamp (10-14 m); the tunnel mouths and the back earth face (16-30 m), sinking into the dark.
// Lore placed: the road above (paving slabs with their bedding, a cart's iron tyre and a wheel hub poking through, a
// milestone's foot), the carter's lantern, cocooned prey (a traveller, a dog, a mule's leg), the travellers' shoes and a
// purse in the silk, strike-burned prey in the webs (spiders wait for the lightning to bring food), webs fused glassy
// where a strike came down a root, egg sacs swollen green.
// Mid: a fallen paving slab, a cocooned dog, an empty shoe, a pack split open.
// Fore: top: the near underside of the paving, roots hanging; left: an earth bank with roots and egg sacs; right: a
// hanging cocooned traveller and a silk sheet.
// No eyes (not a void world). No gold. No red.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'X');
const ROOM = 'hive_brood', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 10401, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1a120c' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#0c0806' });
const { line, pline, fillP, fillS, inkP, inkS, blob, lump, burn, fused, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#0c0806' });
const MV = require('./materials_v2')(S);
const { pool, frame, eggSac, roots, web } = G;

const EARTH = '#5a4630', EARTHD = '#2e2218', STONE = '#6a6458', SILK = '#d8d2c2', LAMP = '#ffc870', AMB = '#e8a040', VEN = '#93b24c', VEND = '#4e6a2a', VIO = '#d4c8f4', MURK = B.MURK;
const CEIL = 3.3, LX = 0.4, LY = 2.55, LZ = 11;           // the paving's underside; the lantern
const LP = P(LX, LY, LZ);
// light falloff from the lantern (screen distance, for tinting things toward amber or the dark)
const lit = (x, y, r = 260) => Math.max(0, 1 - Math.hypot((x - LP[0]) / r, (y - LP[1]) / (r * 0.7)));
const shade = (col, x, y, r) => { const l = lit(x, y, r * 0.8); return mix(mix(col, MURK, 0.78 * (1 - l)), AMB, 0.2 * l * l); };

// a silk sheet hung between two points with a sag (screen): a pale translucent catenary skin, threads along it, its
// lower edge torn into strands
function sheet(a, b, sag, drop, o = {}) {
  const top = [], bot = [], n = 16;
  for (let k = 0; k <= n; k++) { const t = k / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * sag; top.push([x, y]); bot.push([x + (R() - 0.5) * 3, y + drop * (0.35 + 0.65 * Math.sin(Math.PI * t)) * (0.8 + R() * 0.4)]); }
  const col = o.col || SILK; let s = fillS([...top, ...bot.slice().reverse()], col, o.op ?? 0.22, 0.4);
  let d = ''; for (let k = 0; k <= n; k += 1) { if (R() < 0.4) continue; d += `M${f1(top[k][0])} ${f1(top[k][1])} L${f1(bot[k][0])} ${f1(bot[k][1] + R() * drop * 0.2)} `; }
  for (let j = 1; j < 4; j++) { const q = top.map((p, k) => [p[0], p[1] + (bot[k][1] - p[1]) * j / 4]); d += 'M' + q.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' '; }
  s += `<path d="${d}" stroke="${col}" stroke-width="0.5" fill="none" opacity="${(o.op ?? 0.22) * 2}"/>` + line(top, 0.9, col, (o.op ?? 0.22) * 2.6);
  return s;
}
// a cocooned body hung by a thread: a long silk bundle, wrapped round and round, a shoe or a hoof showing
function bundle(x, y, len, Z, o = {}) {
  const w = len * (o.wide || 0.22), pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10, m = Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.85 + 0.15 * Math.sin(t * 9)); pts.push([x - w * m, y + len * t]); }
  for (let k = 10; k >= 0; k--) { const t = k / 10, m = Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.85 + 0.15 * Math.cos(t * 7)); pts.push([x + w * m, y + len * t]); }
  let s = pline([[x, y - (o.hang || len * 0.4)], [x, y + 2]], 0.7, o.thread || SILK, 0.8) + cel(pts, { Z, fill: o.col || SILK, band: w * 0.45, tex: 'url(#mottle)', texOp: 0.4 });
  for (let k = 0; k < 9; k++) { const yy = y + len * (0.08 + k * 0.1); s += `<path d="M${f1(x - w)} ${f1(yy + R() * 3)} Q${f1(x)} ${f1(yy + len * 0.05)} ${f1(x + w)} ${f1(yy - R() * 3)}" stroke="${mix(o.col || SILK, INK, 0.45)}" stroke-width="0.6" fill="none" opacity="0.55"/>`; }
  if (o.burn) s += burn(x - w * 0.2, y + len * 0.3, 1.2, len * 0.5, 1.1, { core: VIO, depth: 2 });
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the back: an earth face at 18-30 m with two tunnel mouths of different size and shape, going off into black
{
  const Z = 20; raw(`<path d="${pp([[-30, -1, Z], [30, -1, Z], [30, CEIL + 0.5, Z], [-30, CEIL + 0.5, Z]])}" fill="${mix(EARTHD, MURK, 0.55)}"/>` + pool(LP[0], LP[1] + 20, 200, 60, AMB, { n: 3, op: 0.05 }));
  // strata in the earth face: ragged bands, a stony layer, the road's bedding at the top
  for (let t = 0.1; t < CEIL; t += 0.25 + R() * 0.35) { const pts = []; for (let X = -30; X <= 30; X += 1.5) pts.push(P(X, t + Math.sin(X * 0.4 + t * 3) * 0.06, Z)); raw(line(pts, 0.8, INK, 0.5) + line(pts.map(([x, y]) => [x, y + 1]), 0.5, '#8a7050', 0.25)); }
  for (let k = 0; k < 80; k++) { const X = -28 + R() * 56, Y = R() * CEIL, p = P(X, Y, Z), r = 1 + R() * 3; raw(fillS(blob(p[0], p[1], r * 1.3, r, 7, 0.4), shade(STONE, p[0], p[1], 500), 0.7)); }
  // the tunnel mouths: irregular, black, a lip of earth and silk hanging across them
  for (const [X, w, h, sk] of [[-6.5, 3.6, 2.4, 0.3], [5.2, 2.6, 2.0, -0.2]]) { const pts = []; for (let k = 0; k <= 18; k++) { const a = Math.PI * k / 18, m = 0.85 + R() * 0.25; pts.push(P(X + Math.cos(a) * w / 2 * m + sk * Math.sin(a), Math.sin(a) * h * m, Z)); }
    const poly = [...pts, P(X - w / 2, -0.2, Z)];
    raw(fillP(poly, '#040302') + inkP(poly, 1.2));
    for (let k = 0; k < 3; k++) { const a = pts[2 + Math.floor(R() * 4)], b = pts[12 + Math.floor(R() * 4)]; raw(sheet(a, b, 12 + R() * 14, 8 + R() * 8, { op: 0.12 })); } }
  raw(hatch3((s, t) => [-30 + s, t, Z], 0, 60, 0, CEIL + 0.5, 0.7, { op: 0.4 }) + hatch3((s, t) => [-30 + s, t, Z], 0, 60, 0, CEIL + 0.5, -0.8, { op: 0.3, keep: s => Math.abs(s - 30.4) > 4 }));
}
// ---- the ceiling: the underside of the road. Slabs (of uneven size, their bedding of sand and gravel between), roots
// threading down through the joints; a cart's iron tyre and the hub of a wheel through a broken place
{
  const z0 = 4, z1 = 20.5; raw(`<path d="${pp([[-30, CEIL, z0], [30, CEIL, z0], [30, CEIL, z1], [-30, CEIL, z1]])}" fill="${shade('#241a12', 740, 120, 600)}"/>`);
  // slabs laid in rough courses across the road, each its own length and depth, the courses wandering, some slabs gone
  // (the bedding and roots showing), a few sunk or cracked
  const WXC = MV.begin((u, v) => [-16 + u, CEIL, z0 + v], 32, z1 - z0);
  let Z = z0; while (Z < z1) { const d = 0.6 + R() * 0.9; let X = -16 - R(); while (X < 16) { const w = 0.5 + R() * 1.4, xa = X, xb = X + w, za = Z + (R() - 0.5) * 0.25, zb = Z + d * (0.7 + R() * 0.5); X = xb + 0.04; if (R() < 0.1) continue;
      const q3 = [[xa + 0.04, CEIL, za + 0.04], [xb - 0.04, CEIL, za + 0.04 + (R() - 0.5) * 0.15], [xb - 0.04 + (R() - 0.5) * 0.1, CEIL, zb - 0.04], [xa + 0.04, CEIL, zb - 0.04 + (R() - 0.5) * 0.15]], q = q3.map(p => P(...p)), cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
      { const qc = chip(q, 0.5), fl = shade(S.tone('#4a443c', 0.2), cx, cy, 330); raw(cel(qc, { Z: za, fill: fl, band: Math.max(0.8, K(za) * 0.03), tex: 'url(#mottle)', texOp: 0.5, inkW: Math.max(0.4, inkW(za) * 0.6), hi: false })); WXC.stone(qc, za, fl, q3); }
      if (R() < 0.15) raw(pline([[cx - (q[1][0] - q[0][0]) * 0.3, cy], [cx, cy + 2], [cx + (q[1][0] - q[0][0]) * 0.2, cy - 1]], 0.7, INK, 0.7)); }
    Z += d; }
  raw(WXC.end({ plane: false }));
  raw(hatch3((s, t) => [-16 + s, CEIL - 0.001, z0 + t], 0, 32, 0, z1 - z0, 0.5, { op: 0.4, keep: (s, t) => lit(...P(-16 + s, CEIL, z0 + t), 320) < 0.5 }));
  raw(hatch3((s, t) => [-16 + s, CEIL - 0.001, z0 + t], 0, 32, 0, z1 - z0, -0.6, { op: 0.35, keep: (s, t) => lit(...P(-16 + s, CEIL, z0 + t), 320) < 0.2 }));
  // the cart wheel come through the road: iron tyre arc and hub hanging down out of a broken slab
  { const c = P(-3.4, CEIL - 0.2, 9), r = K(9) * 0.6; raw(fillS(blob(c[0], c[1] - r * 0.2, r * 1.2, r * 0.35, 10, 0.4), '#0a0706') + `<path d="M${f1(c[0] - r)} ${f1(c[1] - r * 0.2)} A${f1(r)} ${f1(r * 0.85)} 0 0 0 ${f1(c[0] + r)} ${f1(c[1] - r * 0.2)}" stroke="${INK}" stroke-width="${f1(r * 0.12)}" fill="none"/><path d="M${f1(c[0] - r)} ${f1(c[1] - r * 0.2)} A${f1(r)} ${f1(r * 0.85)} 0 0 0 ${f1(c[0] + r)} ${f1(c[1] - r * 0.2)}" stroke="${shade('#4a4440', c[0], c[1], 400)}" stroke-width="${f1(r * 0.06)}" fill="none"/>`);
    for (const a of [0.5, 1.3, 2.2]) raw(pline([[c[0], c[1] + r * 0.1], [c[0] + Math.cos(a) * r * 0.95, c[1] - r * 0.2 + Math.sin(a) * r * 0.8]], r * 0.07, shade('#4a3a28', c[0], c[1], 400)));
    raw(fillS(blob(c[0], c[1] + r * 0.12, r * 0.18, r * 0.14, 8, 0.2), shade('#5a4a34', c[0], c[1], 400)) + inkS(blob(c[0], c[1] + r * 0.12, r * 0.18, r * 0.14, 8, 0.2), 0.8)); }
  // roots threading down between the slabs at every depth
  for (const [Z, n, len] of [[18, 16, 30], [14, 14, 44], [11, 12, 60]]) { const y = P(0, CEIL, Z)[1]; raw(roots(-20 + 740 - 652 * 14 / Z, 740 + 652 * 14 / Z, y, Z, { n, len, w: 3 * 10 / Z, col: shade('#4a3a28', 740, y, 400) })); }
}
// ---- the earth piers left standing at 11-14 m, webbed over, hung with egg sacs; silk sheets between them and the roof
{
  const pier = (X, Z, w, o = {}) => { const pts = []; for (let k = 0; k <= 12; k++) { const t = k / 12, Y = CEIL * t, ww = w * (0.65 + 0.35 * Math.pow(Math.abs(t - 0.45) * 2, 2)) * (1 + (R() - 0.5) * 0.08); pts.push([P(X - ww / 2, Y, Z), P(X + ww / 2, Y, Z)]); }
    const poly = [...pts.map(p => p[0]), ...pts.map(p => p[1]).reverse()], c = P(X, CEIL / 2, Z);
    let s = cel(poly, { Z, fill: shade(EARTH, c[0], c[1], 520), band: K(Z) * w * 0.3, tex: 'url(#mottle)', texOp: 0.55 });
    const ck = S.id('pi'); s += `<clipPath id="${ck}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${ck})">`;
    for (let t = 0.2; t < CEIL; t += 0.3 + R() * 0.3) s += line([P(X - w, t, Z), P(X, t + 0.05, Z), P(X + w, t - 0.03, Z)], 0.7, INK, 0.5);
    for (let k = 0; k < 14; k++) { const p = P(X + (R() - 0.5) * w, R() * CEIL, Z), r = 1.5 + R() * 3; s += fillS(blob(p[0], p[1], r * 1.2, r, 7, 0.4), shade(STONE, p[0], p[1], 330), 0.8); }
    s += hatch3((u, t) => [X - w / 2 + u, t, Z], 0, w, 0, CEIL, 0.75, { op: 0.45, keep: u => o.lightLeft ? u > w * 0.3 : u < w * 0.7 }) + '</g>';
    const edge = (o.lightLeft ? pts.map(p => p[0]) : pts.map(p => p[1])).slice(1, 11); s += line(edge.map(([x, y]) => [x + (o.lightLeft ? 1.5 : -1.5), y]), 1.6, AMB, 0.55);
    return { svg: s, poly };
  };
  const pL = pier(-4.6, 12.5, 2.2, { lightLeft: false }), pR = pier(5.8, 13.5, 2.6, { lightLeft: true });
  raw(pL.svg + pR.svg);
  // the egg sacs: clusters webbed to the piers and hung from the roof, some swollen green, lit warm near the lamp
  for (const [X, Y, Z, n] of [[-5.0, 2.4, 12.2, 7], [6.2, 2.6, 13.2, 9], [-1.6, 3.2, 10.5, 4], [3.4, 3.2, 12.5, 5], [-9, 3.2, 13, 5]]) {
    for (let k = 0; k < n; k++) { const p = P(X + (R() - 0.5) * 1.2, Y - R() * 1.0, Z), r = K(Z) * (0.12 + R() * 0.1); raw(eggSac(p[0], p[1], r, Z, { col: shade(SILK, p[0], p[1], 320), green: R() < 0.3, hang: r * (0.5 + R() * 2) })); } }
  // silk sheets: from the roof to the piers and across between them, catching the lamp
  const roof = (X, Z) => P(X, CEIL, Z);
  for (const [a, b, sag, drop, op] of [[roof(-8, 12), roof(-3.5, 11.5), 22, 40, 0.2], [roof(-3, 11), roof(3, 11.5), 30, 26, 0.16], [roof(4, 13), roof(9, 13.5), 18, 46, 0.2], [P(-4.4, 2.6, 12.5), P(5.6, 2.8, 13.5), 40, 24, 0.12]])
    raw(sheet(a, b, sag, drop, { op, col: shade(SILK, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag, 320) }));
  // a web across the right tunnel side with strike-burned prey (the spiders wait for the lightning to bring food)
  raw(web(P(9.6, 1.9, 16), [P(8.2, CEIL, 16), P(11.6, CEIL, 16), P(8.4, 0.3, 16), P(11.2, 0.4, 16)], { r: 60, n: 16, op: 0.32, col: '#b8ae98', prey: 3, preySz: 4.5, preyCol: '#8a8070', Z: 16 }));
  // cocooned prey hung from the roof: a traveller (a shoe showing), a mule's leg, a smaller bundle
  for (const [X, Z, len, o] of [[-7.6, 14, 1.7, { burn: true }], [9.4, 14.5, 1.1, {}], [-2.4, 12, 0.8, { wide: 0.3 }]]) { const p = roof(X, Z); raw(bundle(p[0], p[1] + K(Z) * 0.3, K(Z) * len, Z, Object.assign({ col: shade(SILK, p[0], p[1] + 30, 320), hang: K(Z) * 0.3 }, o))); }
}
// ---- the floor: packed earth, fallen slabs and gravel converging into the dark, silk strands lying along it
{
  raw(`<path d="${pp([[-30, 0, 3.5], [30, 0, 3.5], [30, 0, 20], [-30, 0, 20]])}" fill="${shade(EARTHD, 740, 360, 500)}"/>`);
  raw(S.strew((s, t) => [s, 0, t], -14, 14, 4, 20, 900, { cols: ['#3a2c1e', '#4a3a28', '#2a2016', '#5a4a34'], len: 0.12, w: 0.03, spread: 3 }));
  for (let k = 0; k < 26; k++) { const X = -12 + R() * 24, Z = 6 + Math.pow(R(), 0.7) * 13, w = 0.4 + R() * 0.7, q = [[X, 0.02, Z], [X + w, 0.02, Z + (R() - 0.5) * 0.2], [X + w * 0.9, 0.02, Z + w * 0.7], [X + 0.1, 0.02, Z + w * 0.6]].map(p => P(...p)), c = q[0];
    raw(cel(chip(q, 0.4), { Z, fill: shade(S.tone('#5a5248', 0.15), c[0], c[1], 300), band: 1, inkW: Math.max(0.4, inkW(Z) * 0.6) })); }
  raw(G.bandFloor(-14, 14, { col: shade(EARTHD, 740, 400, 500), wear: shade('#6a5640', 740, 420, 500), debrisCol: shade('#5a5248', 740, 420, 500), wearOp: 0.3 }));
  // silk strands lying along the floor, drawn in from the tunnels: they converge on the dark
  for (let k = 0; k < 16; k++) { const X0 = -10 + R() * 20, pts = []; for (let Z = 4.5; Z < 19; Z += 0.8) pts.push(P(X0 * (1 - (Z - 4.5) / 22) + (R() - 0.5) * 0.15, 0.01, Z)); raw(line(pts, 0.6, SILK, 0.18)); }
  // bones of old prey: a ribcage and scattered long bones (low, dark except near the lamp)
  for (let k = 0; k < 8; k++) { const X = -8 + R() * 16, Z = 8 + R() * 9, a = P(X, 0.03, Z), b = P(X + (R() - 0.5) * 0.6, 0.03, Z + 0.3); raw(line([a, b], 2.2, INK) + line([a, b], 1.2, shade('#b8ae96', a[0], a[1], 300))); }
}
// ---- the lamp: a carter's horn lantern hooked on a root, still burning; its warm light the one source in the dark
{
  raw(pool(LP[0], LP[1] + 30, 360, 210, AMB, { n: 6, op: 0.045, jag: 0.3 }) + pool(LP[0], LP[1] + 4, 110, 90, LAMP, { n: 4, op: 0.08 }));
  raw(pool(LP[0], P(LX, 0, LZ)[1], 230, 26, AMB, { n: 4, op: 0.08 })); // its pool on the floor below
  const hook = P(LX, CEIL, LZ), k = K(LZ), x = LP[0], y = LP[1];
  raw(line([hook, [hook[0] + 3, hook[1] + 10], [x + 1, y - k * 0.24]], 2.2, INK) + line([hook, [hook[0] + 3, hook[1] + 10], [x + 1, y - k * 0.24]], 1.1, '#5a4430'));
  const body = [[x - k * 0.09, y - k * 0.17], [x + k * 0.09, y - k * 0.17], [x + k * 0.11, y + k * 0.12], [x - k * 0.11, y + k * 0.12]];
  raw(fillP(body, '#ffd890') + fillP([[x - k * 0.06, y - k * 0.12], [x + k * 0.06, y - k * 0.12], [x + k * 0.07, y + k * 0.08], [x - k * 0.07, y + k * 0.08]], '#fff4c8'));
  raw(inkP(body, 1.4) + pline([[x - k * 0.12, y - k * 0.17], [x, y - k * 0.26], [x + k * 0.12, y - k * 0.17]], 1.6, INK) + pline([[x - k * 0.12, y + k * 0.12], [x + k * 0.12, y + k * 0.12]], 2, INK) + pline([[x, y - k * 0.17], [x, y + k * 0.12]], 1, INK, 0.7));
}
raw(quiet([[236, 0.14], [266, 0.14], [300, 0.12], [350, 0.1]], { hop: 0.16 }));
raw(frame('#060403', { sides: [[200, 0.25], [120, 0.25], [60, 0.3]], top: [[60, 0.2]], bottom: [[40, 0.3]] }));

// ======================================================================== MID
layer('mid');
// a fallen paving slab, tipped against a stone, its worn top face (the road) toward us, a rut across it
{ const Z = 10.8, X = -4.4, q = [P(X - 0.8, 0, Z), P(X + 0.7, 0, Z - 0.1), P(X + 0.6, 0.55, Z + 0.15), P(X - 0.75, 0.6, Z + 0.2)], c = q[0];
  raw(cel(chip(q, 0.3), { Z, fill: shade('#5a5248', c[0], c[1], 280), band: 3, tex: 'url(#mottle)', texOp: 0.5 }) + line([[q[0][0] + 10, q[0][1] - 6], [q[1][0] - 10, q[1][1] - 9]], 2.6, INK, 0.5)); }
// a cocooned dog lying on its side, a paw out
{ const Z = 10, p = P(4.4, 0.25, Z), k = K(Z); raw(cel(blob(p[0], p[1], k * 0.42, k * 0.2, 14, 0.15), { Z, fill: shade(SILK, p[0], p[1], 260), band: 3 }));
  for (let i = 0; i < 6; i++) raw(`<path d="M${f1(p[0] - k * 0.4 + i * k * 0.14)} ${f1(p[1] - k * 0.18)} q${f1(k * 0.05)} ${f1(k * 0.2)} ${f1(-k * 0.02)} ${f1(k * 0.36)}" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.5"/>`);
  raw(line([[p[0] + k * 0.38, p[1] + k * 0.1], [p[0] + k * 0.5, p[1] + k * 0.17]], 2.6, INK) + line([[p[0] + k * 0.38, p[1] + k * 0.1], [p[0] + k * 0.5, p[1] + k * 0.17]], 1.4, shade('#6a5a44', p[0], p[1], 260))); }
// an empty shoe and a pack split open, comb and silk spilling out
{ const Z = 9, p = P(-1.6, 0.06, Z); raw(cel([[p[0] - 7, p[1] + 2], [p[0] + 6, p[1] + 2], [p[0] + 7, p[1] - 3], [p[0] - 2, p[1] - 5], [p[0] - 7, p[1] - 3]], { Z, fill: shade('#4a3624', p[0], p[1], 240), band: 2 }));
  const q = P(7.6, 0.2, 11.6); raw(cel(blob(q[0], q[1], 10, 8, 10, 0.25), { Z: 11.6, fill: shade('#4a3a2a', q[0], q[1], 300), band: 3 }) + fillS(blob(q[0] - 9, q[1] + 3, 7, 3, 8, 0.4), shade(SILK, q[0], q[1], 300), 0.6)); }

// ======================================================================== FORE
layer('fore');
// top: the near underside of the paving, slabs big and close, roots hanging down out of the joints
{ const Y = CEIL, pts = [[-10, -10], [W + 10, -10], [W + 10, 18], ...Array.from({ length: 24 }, (_, k) => [W - k * W / 23, 18 + Math.sin(k * 1.9) * 6 + R() * 8]), [-10, 22]];
  raw(fillP(pts, '#1a130d'));
  const ck = S.id('ct'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">`);
  let X = -10; while (X < 10) { const w = 0.8 + R(), q = [[X + 0.05, Y, 2.4], [X + w - 0.05, Y, 2.4], [X + w - 0.05, Y, 3.6], [X + 0.05, Y, 3.6]].map(p => P(...p)); raw(cel(chip(q, 0.3), { Z: 3, fill: S.tone('#3a342c', 0.15), band: 2, hi: false })); X += w; }
  raw(`<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.45"/></g>`);
  raw(roots(0, W, 22, 3.2, { n: 22, len: 90, w: 7, col: '#3a2c1e' }));
}
// left: an earth bank with roots and a cluster of egg sacs webbed to it
{ const pts = [[-10, H + 5], [-10, 20], [40, 26], [66, 90], [58, 170], [74, 260], [70, 330], [96, 410], [120, H + 5]];
  raw(cel(pts, { Z: 3.4, fill: '#2a2016', band: 12, tex: 'url(#mottle)', texOp: 0.6 }));
  const ck = S.id('eb'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})"><path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.45"/>`);
  for (let k = 0; k < 20; k++) { const x = R() * 110, y = 30 + R() * 440, r = 3 + R() * 6; raw(fillS(blob(x, y, r * 1.2, r, 7, 0.4), '#4a443a', 0.8) + inkS(blob(x, y, r * 1.2, r, 7, 0.4), 0.6, 0.4, 0.6)); }
  raw('</g>');
  for (let k = 0; k < 6; k++) raw(eggSac(56 + R() * 30, 120 + R() * 50, 8 + R() * 6, 3.4, { col: '#a89e88', green: R() < 0.4, hang: 4 + R() * 10 }));
  raw(sheet([20, 60], [90, 220], 10, 30, { op: 0.18, col: '#b8ae98' })); }
// right: a cocooned traveller hung from the roof, his shoe showing, and a silk sheet to the frame edge
{ raw(sheet([W - 140, 22], [W + 10, 60], 30, 70, { op: 0.2, col: '#b8ae98' }));
  raw(bundle(W - 66, 60, 170, 3.4, { col: '#8c8270', hang: 40, burn: true }));
  raw(cel([[W - 74, 232], [W - 54, 230], [W - 50, 240], [W - 72, 244]], { Z: 3.4, fill: '#3a2a1c', band: 2 })); }
raw(fillP([[-5, H + 5], [-5, H - 16], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 13 - Math.sin(k * 1.5) * 6 - R() * 5]), [W + 5, H - 16], [W + 5, H + 5]], '#0a0705', 0.94));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
