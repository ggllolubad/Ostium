// World XIII, the Black Pyre: THE CANDLE CRYPT (battle room `pyre_crypt`, round 2, Living Ink).
// The undercroft under the choir: the ossuary crypt where the burned saints' bones were laid and candles kept burning for
// them, and where the inquisition's tribunal sat to read the names. Encounters: Candle Crypt (a knight keeps the candles
// burning), The Tribunal (the inquisitor reads your names aloud).
// Kind of space: underground, low and tight: squat round piers with cushion capitals, round groin vaults just over
// head height, a grid of bays receding into darkness. Light: darkness with one source: a shaft of grey daylight down
// through an iron grating in the vault (the nave floor above) onto the tribunal desk. The candles burn black and light
// nothing: the wax shows pale, the flames black against the lit pool. Shapes: curves (round arches, vault webs, drums of
// the piers, skull niches). Palette: near black, cold grey pool, bone, red rubric on the sentence boards and the roll.
// Usage: node scenes/bg_pyre_crypt.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIII');
const { S, B, G } = require('./battle_kit_g5').make(13401, '#0a090b', '#18141a', '#1a181c');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, seam, ash, char, chain, tornVoid, quiet } = B;
const { W, H, air, blackFlame, shaft } = G;
const MV = require('./materials_v2')(S);
const VIO = '#9a6ad8', VIOD = '#4a2e6a', RUB = '#8a2a1e', IRON = '#2a2628', BONE = '#c8bea8', WAX = '#cfc6b2', MURK = B.MURK;
const STN = '#6a6662', ZB = 25, SPR = 2.0;
const XS = [-11.5, -7.2, -2.9, 2.9, 6.6, 11], ZS = [5.2, 9.6, 15.2, 19.6, ZB];
// light from the grating: lit factor at a point (for picking a lighter tone near the pool)
const GR = [-2.0, 4.6, 12.6], LD = (() => { const d = [0.55, -0.62, 0.56], l = Math.hypot(...d); return d.map(v => v / l); })();
const FOOT = [GR[0] + LD[0] * GR[1] / -LD[1], 0, GR[2] + LD[2] * GR[1] / -LD[1]];
const litK = (X, Z) => Math.max(0, 1 - Math.hypot(X - FOOT[0], (Z - FOOT[2]) * 0.8) / 7.5);
const tint = (col, X, Z, k = 0.35) => { const l = litK(X, Z); return mix(mix(col, MURK, 0.78 * (1 - l)), '#c8ccd0', l * l * k * 1.6); };

// a round arch band in a plane at(s,t): s from a to b, springing t0; ring depth d (m); voussoirs
function roundArch(at, a, b, t0, d, col, Z, o = {}) {
  const r = (b - a) / 2, c = (a + b) / 2, n = 7 + Math.floor(R() * 5), drop = R() < (o.drop ?? 0.25) ? 1 + Math.floor(R() * (n - 2)) : -1, sag = R() < 0.3 ? r * 0.05 : 0; let s = '';
  for (let i = 0; i < n; i++) { if (i === drop) { const a0 = Math.PI - i / n * Math.PI, q = P(...at(c + Math.cos(a0) * r, t0 + Math.sin(a0) * r)); s += fillP([q, P(...at(c + Math.cos(a0 - Math.PI / n) * r, t0 + Math.sin(a0 - Math.PI / n) * r)), P(...at(c + Math.cos(a0 - Math.PI / n) * (r + d), t0 + Math.sin(a0 - Math.PI / n) * (r + d))), P(...at(c + Math.cos(a0) * (r + d), t0 + Math.sin(a0) * (r + d)))], '#050406'); continue; } const a0 = Math.PI - i / n * Math.PI, a1 = Math.PI - (i + 1) / n * Math.PI, Q = (ang, rr) => P(...at(c + Math.cos(ang) * rr, t0 + Math.sin(ang) * rr - sag * Math.sin(ang) * Math.sin(ang)));
    { const q = chip([Q(a0, r), Q(a1, r), Q(a1, r + d), Q(a0, r + d)], 0.3), fl = S.tone(col, 0.18); s += cel(q, { Z, fill: fl, band: 1, tex: 'url(#mottle)', texOp: 0.4 }) + MV.stoneMarks(q, Z, fl, { wy0: t0 + 1 }); } }
  return s;
}
// a squat round pier: drum shaded as a cylinder by the key light (lit left, cross-hatched right), cushion capital, base
function pier(X, Z, r, col) {
  const a = P(X - r, 0, Z), b = P(X + r, SPR - 0.25, Z), w = b[0] - a[0], c0 = tint(col, X, Z);
  let s = cel([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], { Z, fill: c0, band: w * 0.18, tex: 'url(#mottle)', texOp: 0.5 }) + MV.stoneMarks([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], Z, c0, { wy0: 0 });
  s += fillP([[a[0] + w * 0.08, b[1]], [a[0] + w * 0.3, b[1]], [a[0] + w * 0.3, a[1]], [a[0] + w * 0.08, a[1]]], mix(c0, '#e8e4dc', 0.25), 0.6);
  s += `<path d="${p2([[a[0] + w * 0.55, b[1]], [b[0], b[1]], [b[0], a[1]], [a[0] + w * 0.55, a[1]]])}" fill="${S.hatchA(Z)}" opacity="0.55"/><path d="${p2([[a[0] + w * 0.75, b[1]], [b[0], b[1]], [b[0], a[1]], [a[0] + w * 0.75, a[1]]])}" fill="${S.hatchB(Z)}" opacity="0.5"/>`;
  // drum courses (curved joints, as the drum is round)
  for (let y = 0.35; y < SPR - 0.3; y += 0.32 + R() * 0.1) { const p0 = P(X - r, y, Z), p1 = P(X + r, y, Z); s += `<path d="M${f1(p0[0])} ${f1(p0[1])} Q${f1((p0[0] + p1[0]) / 2)} ${f1(p0[1] + w * 0.12)} ${f1(p1[0])} ${f1(p1[1])}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.6))}" fill="none" opacity="0.7"/>`; }
  // cushion capital: a block whose lower face rounds down onto the drum
  const k0 = P(X - r * 1.35, SPR, Z - 0.1), k1 = P(X + r * 1.35, SPR - 0.28, Z - 0.1);
  s += cel([[k0[0], k0[1]], [k1[0], k0[1]], [k1[0], k1[1] - w * 0.05], [b[0], k1[1] + w * 0.08], [(a[0] + b[0]) / 2, k1[1] + w * 0.16], [a[0], k1[1] + w * 0.08], [k0[0], k1[1] - w * 0.05]], { Z, fill: tint(mix(col, '#2a2628', 0.3), X, Z), band: 2, tex: 'url(#mottle)', texOp: 0.45 });
  s += cel([[a[0] - w * 0.12, a[1]], [b[0] + w * 0.12, a[1]], [b[0] + w * 0.06, a[1] - w * 0.14], [a[0] - w * 0.06, a[1] - w * 0.14]], { Z, fill: mix(col, MURK, 0.3), band: 1.5 });
  s += S.soot((ss, t) => [X - r + ss, t, Z - 0.01], 0, 2 * r, 0.1, SPR, { op: 0.35 });
  return s;
}
// a tallow candle burning black: pale wax with drips and a puddle, a small black flame with violet edge
function candle(x, y, h, wd, o = {}) {
  let s = cel([[x - wd, y], [x + wd, y], [x + wd * 0.9, y - h], [x - wd * 0.9, y - h]], { Z: o.Z || 8, fill: o.wax || WAX, band: Math.max(0.6, wd * 0.5), inkW: Math.max(0.4, wd * 0.25) });
  for (let k = 0; k < 2; k++) { const dx = (R() - 0.5) * wd * 1.4; s += fillS([[x + dx - wd * 0.2, y - h], [x + dx + wd * 0.2, y - h], [x + dx + wd * 0.15, y - h + h * (0.3 + R() * 0.4)], [x + dx - wd * 0.1, y - h + h * 0.3]], o.wax || WAX); }
  s += fillS(blob(x, y + wd * 0.1, wd * 2, wd * 0.5, 8, 0.3), mix(o.wax || WAX, '#3a3430', 0.3), 0.8);
  s += blackFlame(x, y - h, wd * 2.2, wd * 5.5, { n: 1, lick: 0.3, lean: (R() - 0.5) * 0.4 });
  return s;
}
// a skull in a niche: cranium, sockets, cheek, teeth, lit from the upper left
function skull(x, y, r, col = BONE) {
  let s = cel(blob(x, y, r, r * 0.86, 10, 0.08), { Z: 10, fill: col, band: r * 0.25, inkW: Math.max(0.4, r * 0.1) });
  for (const dx of [-0.38, 0.32]) s += fillS(blob(x + dx * r, y + r * 0.1, r * 0.24, r * 0.2, 7, 0.2), '#0a0809');
  s += fillP([[x - r * 0.05, y + r * 0.35], [x + r * 0.08, y + r * 0.35], [x + r * 0.02, y + r * 0.52]], '#0a0809') + fillP([[x - r * 0.45, y + r * 0.62], [x + r * 0.45, y + r * 0.62], [x + r * 0.38, y + r * 0.9], [x - r * 0.38, y + r * 0.9]], mix(col, INK, 0.2));
  for (let k = 0; k < 5; k++) s += pline([[x - r * 0.35 + k * r * 0.18, y + r * 0.64], [x - r * 0.35 + k * r * 0.18, y + r * 0.86]], 0.4, INK, 0.8);
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the vault: the whole ceiling, webs dark and hatched, round arches across and along, the grating's hole
{
  raw(fillP([[0, 0], [W, 0], [W, 300], [0, 300]], '#151216'));
  // web cells: each bay's four cells as their own planes (crown lighter near the grating)
  for (let zi = ZS.length - 2; zi >= 0; zi--) for (let xi = 0; xi < XS.length - 1; xi++) {
    const xa = XS[xi], xb = XS[xi + 1], za = ZS[zi], zb = ZS[zi + 1], xm = (xa + xb) / 2, zm = (za + zb) / 2, top = SPR + Math.max(xb - xa, zb - za) / 2;
    const cr = [xm, top, zm], cs = [[xa, SPR, za], [xb, SPR, za], [xb, SPR, zb], [xa, SPR, zb]];
    const tn = [0.25, 0.4, 0.15, 0.55];
    for (let k = 0; k < 4; k++) { const p0 = cs[k], p1 = cs[(k + 1) % 4], mid = [(p0[0] + p1[0]) / 2, k % 2 ? SPR + (zb - za) / 2 : SPR + (xb - xa) / 2, (p0[2] + p1[2]) / 2]; const poly = [p0, mid, p1, cr].map(p => P(...p));
      raw(cel(poly, { Z: zm, fill: tint(mix('#4a4644', '#080608', tn[k]), xm, zm, 0.4), band: 1, hi: false }) + `<path d="${p2(poly)}" fill="${S.hatchA(zm)}" opacity="${0.35 + tn[k] * 0.6}"/>`);
      for (let j = 1; j < 5; j++) { const u = j / 5, A = [p0[0] + (cr[0] - p0[0]) * u, p0[1] + (cr[1] - p0[1]) * u, p0[2] + (cr[2] - p0[2]) * u], Bq = [p1[0] + (cr[0] - p1[0]) * u, p1[1] + (cr[1] - p1[1]) * u, p1[2] + (cr[2] - p1[2]) * u], M = [(A[0] + Bq[0]) / 2 + (mid[0] - (p0[0] + p1[0]) / 2) * (1 - u), (A[1] + Bq[1]) / 2 + (mid[1] - SPR) * (1 - u) * 0.9, (A[2] + Bq[2]) / 2 + (mid[2] - (p0[2] + p1[2]) / 2) * (1 - u)]; raw(line([P(...A), P(...M), P(...Bq)], 0.6, INK, 0.45)); } }
    // groins: the diagonal arrises
    for (const p of cs) raw(line([P(...p), P((p[0] + cr[0]) / 2, (SPR + top) / 2 + 0.25, (p[2] + cr[2]) / 2), P(...cr)], 0.8, '#3a3638', 0.7));
  }
  // the grating in the vault: square hole, iron bars, the daylight beyond
  const g = [[GR[0] - 0.9, GR[1], GR[2] - 0.8], [GR[0] + 0.9, GR[1], GR[2] - 0.8], [GR[0] + 0.9, GR[1], GR[2] + 0.8], [GR[0] - 0.9, GR[1], GR[2] + 0.8]].map(p => P(...p));
  raw(fillP(g, '#dadcde') + fillP(g.slice(0, 3).concat([g[2]]), '#f2f2f0', 0.5));
  for (let k = 1; k < 5; k++) { const u = k / 5; raw(pline([[g[0][0] + (g[1][0] - g[0][0]) * u, g[0][1]], [g[3][0] + (g[2][0] - g[3][0]) * u, g[3][1]]], 3, INK) + pline([[g[0][0] + (g[3][0] - g[0][0]) * u, g[0][1] + (g[3][1] - g[0][1]) * u], [g[1][0] + (g[2][0] - g[1][0]) * u, g[1][1] + (g[2][1] - g[1][1]) * u]], 2.4, INK)); }
  raw(inkP(g, 2.4) + `<path d="${p2(g.map(([x, y]) => [x, y + 6]))}" fill="none" stroke="#3a3436" stroke-width="5" opacity="0.8"/>`);
  // ash sifting down through the grating
}
// ---- the back wall: tiers of burial niches (loculi), skulls and candle stubs in them, lit low by the pool
{
  const at = (s, t) => [-14 + s, t, ZB];
  raw(S.ashlar(at, 28, 6, '#4a4644', { vary: 0.2, chip: 0.5, mortar: 0.6, rough: true, roughP: 0.4, scale: 0.7 }) + hatch3(at, 0, 28, 0, 6, 0.8, { op: 0.4 }));
  for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) { const X = -12.6 + i * 1.65 + (row % 2) * 0.5, Y = 0.35 + row * 0.95; if (R() < 0.08) continue; const q = [P(X, Y, ZB), P(X + 1.1, Y, ZB), P(X + 1.1, Y + 0.62, ZB), P(X, Y + 0.62, ZB)]; raw(fillP(q, '#060507') + inkP(q, 0.8) + pline([q[0], q[1]], 1.2, tint('#6a6662', X, ZB, 0.5), 0.7));
    const c = P(X + 0.55, Y + 0.24, ZB + 0.3), lk = litK(X, ZB); if (R() < 0.55) raw(skull(c[0] - 3, c[1], K(ZB) * 0.13, mix(BONE, MURK, 0.55 - lk * 0.5))); if (R() < 0.45) raw(candle(c[0] + 7, P(X, Y, ZB)[1], K(ZB) * 0.18, K(ZB) * 0.03, { wax: mix(WAX, MURK, 0.4 - lk * 0.3), Z: ZB })); }
  // the passage on in the centre: a low round arch onto the next aisle of bays, receding into black
  const ar = []; for (let k = 0; k <= 12; k++) { const a = Math.PI - k / 12 * Math.PI; ar.push(P(1.4 * Math.cos(a) + 0.3, SPR + 0.8 + 1.4 * Math.sin(a), ZB)); }
  const op = [P(-1.1, 0, ZB), ...ar, P(1.7, 0, ZB)]; raw(fillP(op, '#050406') + inkP(op, 1.2));
  for (const z of [31, 37]) { const c = P(0.3, 0, z); raw(fillP([P(-1.0, 0, z), P(-1.0, 2.6, z), P(1.6, 2.6, z), P(1.6, 0, z)], '#0c0a0c') + inkP([P(-1.0, 0, z), P(-1.0, 2.6, z), P(1.6, 2.6, z), P(1.6, 0, z)], 0.6, 0.6)); raw(skull(c[0] - 4, c[1] - K(z) * 1.3, K(z) * 0.12, '#3a3632')); }
}
// ---- the side walls of the undercroft: ossuary stacks of long bones and skulls in the outer bays
for (const sx of [-1, 1]) for (const z of [10, 15, 20]) { const X = sx * 13.5; for (let row = 0; row < 7; row++) { const y = 0.2 + row * 0.24; const a = P(X, y, z - 2.2), b = P(X, y, z + 2.2); if (row % 3 === 2) { for (let k = 0; k < 6; k++) { const u = (k + 0.5) / 6, c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; raw(skull(c[0], c[1] - 1, K(z + (u - 0.5) * 4) * 0.1, mix(BONE, MURK, 0.6))); } } else raw(line([a, b], K(z) * 0.08, mix(BONE, MURK, 0.65)) + line([a, b], 0.6, INK, 0.5)); } }
// ---- the piers, far to near
for (let zi = ZS.length - 2; zi >= 1; zi--) for (const X of XS) { if (Math.abs(X) > 12) continue; raw(pier(X, ZS[zi], 0.48, '#7a7670')); }
// ---- arches: across (in Z planes) and along (in X planes), on the capitals
for (let zi = ZS.length - 2; zi >= 1; zi--) { const z = ZS[zi]; for (let xi = 0; xi < XS.length - 1; xi++) { const xa = XS[xi] + 0.35, xb = XS[xi + 1] - 0.35; raw(roundArch((s, t) => [s, t, z - 0.25], xa, xb, SPR, 0.38, tint('#5a5652', (xa + xb) / 2, z, 0.5), z)); } }
for (const X of [-7, -2.9, 2.9, 7]) for (let zi = ZS.length - 2; zi >= 1; zi--) { const za = ZS[zi] + 0.35, zb = ZS[zi + 1] - 0.35; if (zb > ZB - 0.5) continue; raw(roundArch((s, t) => [X, t, s], za, zb, SPR, 0.3, tint('#4a4644', X, (za + zb) / 2, 0.4), (za + zb) / 2)); }
// ---- the floor: worn flags, tomb slabs, a puddle under the grating holding the light, wax heaps
{
  raw(B.flags(-14, 14, 3.8, ZB, '#3a3638', { depth: 0.8, width: 1.0, vary: 0.16, cracks: 0.3, fogK: 0.3, joint: 0.65 }));
  for (const [X, Z] of [[-5, 12.5], [4.8, 13], [-4.6, 18], [5.4, 17.6]]) { const q = [P(X - 0.6, 0.01, Z - 1.1), P(X + 0.6, 0.01, Z - 1.1), P(X + 0.6, 0.01, Z + 1.1), P(X - 0.6, 0.01, Z + 1.1)]; raw(cel(q, { Z, fill: tint('#4a4646', X, Z), band: 1 }) + pline([P(X, 0.01, Z - 0.8), P(X, 0.01, Z + 0.8)], 0.8, INK, 0.6) + pline([P(X - 0.3, 0.01, Z - 0.4), P(X + 0.3, 0.01, Z - 0.4)], 0.8, INK, 0.6)); }
  const pc = P(FOOT[0] - 0.6, 0, FOOT[2] - 1.6), pw = K(FOOT[2]) * 1.6; raw(fillS(blob(pc[0], pc[1], pw, pw * 0.08, 14, 0.3), '#8e9498', 0.85) + line([[pc[0] - pw * 0.8, pc[1] - 1], [pc[0] + pw * 0.5, pc[1] - 1.5]], 1, '#e0e2e4', 0.7));
}
// ---- the light shaft from the grating down onto the tribunal (stepped), ash turning in it
{ const g = [[GR[0] - 0.9, GR[1], GR[2] - 0.8], [GR[0] + 0.9, GR[1], GR[2] - 0.8], [GR[0] + 0.9, GR[1], GR[2] + 0.8], [GR[0] - 0.9, GR[1], GR[2] + 0.8]], fl = g.map(p => { const t = p[1] / -LD[1]; return [p[0] + LD[0] * t, 0, p[2] + LD[2] * t]; });
  const sp = S.hull([...g, ...fl].map(p => P(...p))); raw(shaft(sp, '#d8dcde', 0.13) + fillP(S.hull(fl.map(p => P(...p))), '#d8dcde', 0.35)); raw(ash(26, Math.min(...sp.map(p => p[0])), Math.max(...sp.map(p => p[0])), Math.min(...sp.map(p => p[1])) + 20, Math.max(...sp.map(p => p[1])) - 10, { r: 1.3, op: 0.6, col: '#e0e0dc' })); }
// ---- THE TRIBUNAL in the pool of light: a long desk on a dais, three high seats, the inquisitor's lectern with the book
// of judgements, the roll of names hanging to the floor in rubric, sentence boards on the wall behind, black candles
{
  const Z = 18.2, X0 = -1.0;
  raw(box(X0 - 3.4, X0 + 3.4, 0, 0.35, Z - 0.9, Z + 0.9, { col: tint('#3a3436', X0, Z), shadeOp: 0.5 }));
  for (const dx of [-2.2, 0, 2.2]) raw(box(X0 + dx - 0.4, X0 + dx + 0.4, 0.35, 2.3 + (dx === 0 ? 0.4 : 0), Z + 0.45, Z + 0.7, { col: tint('#2a2426', X0 + dx, Z, 0.4), shadeOp: 0.5 }));
  raw(box(X0 - 3.0, X0 + 3.0, 0.35, 1.25, Z - 0.5, Z - 0.1, { col: tint('#3a3032', X0, Z, 0.45), shadeOp: 0.45 }));
  const top = [P(X0 - 3.1, 1.25, Z - 0.6), P(X0 + 3.1, 1.25, Z - 0.6), P(X0 + 3.1, 1.25, Z), P(X0 - 3.1, 1.25, Z)]; raw(cel(top, { Z, fill: tint('#4a4042', X0, Z, 0.5), band: 1 }));
  // the book of judgements open on the desk, its pages catching the light; the roll of names spilling to the floor
  const bk = [P(X0 - 0.5, 1.28, Z - 0.5), P(X0 + 0.5, 1.28, Z - 0.5), P(X0 + 0.5, 1.36, Z - 0.1), P(X0 - 0.5, 1.36, Z - 0.1)]; raw(cel(bk, { Z, fill: '#e0d8c4', band: 1 }) + pline([P(X0, 1.3, Z - 0.5), P(X0, 1.37, Z - 0.1)], 0.8, INK));
  const r0 = P(X0 + 1.6, 1.25, Z - 0.6), r1 = P(X0 + 1.9, 0.0, Z - 1.6); const roll = [[r0[0] - 8, r0[1]], [r0[0] + 8, r0[1]], [r1[0] + 10, r1[1] - 6], [r1[0] + 18, r1[1]], [r1[0] - 6, r1[1] + 2], [r1[0] - 4, r1[1] - 8]];
  raw(cel(roll, { Z, fill: '#d6ccb4', band: 1.5 }) + `<path d="${p2(roll)}" fill="url(#mottle)" opacity="0.5"/>`);
  for (let k = 0; k < 9; k++) { const u = 0.08 + k * 0.1, y = r0[1] + (r1[1] - r0[1]) * u, x = r0[0] + (r1[0] - r0[0]) * u; raw(pline([[x - 5, y], [x + 4 + R() * 3, y]], 0.7, k % 4 === 0 ? RUB : '#3a2a22')); }
  // black candles along the desk, pale wax, black flames against the lit wall
  for (const dx of [-2.6, -1.8, 1.1, 2.6]) { const c = P(X0 + dx, 1.25, Z - 0.3); raw(candle(c[0], c[1], K(Z) * 0.32, K(Z) * 0.035, { Z })); }
  // sentence boards hung on the wall behind, lettered in red rubric, burnt at their edges
  for (const [dx, y] of [[-2.4, 2.9], [0.2, 3.25], [2.6, 2.8]]) { const q = [P(X0 + dx - 0.75, y + 0.5, ZB - 0.05), P(X0 + dx + 0.75, y + 0.5, ZB - 0.05), P(X0 + dx + 0.72, y - 0.35, ZB - 0.05), P(X0 + dx - 0.75, y - 0.3, ZB - 0.05)];
    raw(cel(q, { Z: ZB, fill: tint('#8a806c', X0 + dx, ZB, 0.4), band: 1.2 }) + `<path d="${p2(q)}" fill="url(#mottle)" opacity="0.5"/>`); for (let k = 0; k < 4; k++) { const y0 = q[0][1] + 3 + k * (q[3][1] - q[0][1] - 4) / 4; raw(pline([[q[0][0] + 3, y0], [q[1][0] - 3 - R() * 6, y0]], k === 0 ? 1.4 : 0.8, k === 0 ? RUB : '#3a2a22')); } raw(B.char((q[2][0] + q[3][0]) / 2, q[2][1] - 1, (q[1][0] - q[0][0]) * 0.4, 2.5, { Z: ZB })); }
}
// the void in the crypt: a pier's drum unmade at mid height (the capital stands on nothing at one side), with an eye
raw(tornVoid((s, t) => [7 - 0.48 + s, t, 15 - 0.5], 0.5, 1.0, 0.8, 0.9, { depth: 0.8, cut: '#6a6662', mat: '#5a5652', tears: 3, teeth: 2, slivers: 5, flecks: 7, eyes: [[0.1, 0.1, 0.36]], eyeO: { white: '#bdb6aa', iris: '#6a5a7a', open: 0.4, look: [-0.5, 0.1] }, edge: VIOD, edgeOp: 0.5 }).svg);
// candle-trees: iron stands with black candles in the aisles (the knight keeps them burning)
for (const [X, Z] of [[-8.6, 13], [8.8, 11.5], [-9.2, 19]]) { const a = P(X, 0, Z), b = P(X, 1.6, Z), k = K(Z); raw(line([a, b], 3, INK) + line([a, b], 1.6, IRON) + pline([[a[0] - k * 0.25, a[1]], [a[0], a[1] - k * 0.12], [a[0] + k * 0.25, a[1]]], 2, INK)); for (const [dx, dy] of [[-0.35, 1.3], [0, 1.6], [0.35, 1.3]]) { const c = P(X + dx, dy, Z); raw(pline([[b[0], b[1] + k * 0.2], [c[0], c[1]]], 1.4, INK) + candle(c[0], c[1], k * 0.25, k * 0.03, { Z, wax: mix(WAX, MURK, 0.35) })); } }
// darkness closing in round the one pool of light: stepped, ragged veils (never a gradient)
for (const [rx, op] of [[820, 0.2], [620, 0.2], [460, 0.16]]) { const e = blob(790, 240, rx, rx * 0.5, 22, 0.12); raw(`<path fill-rule="evenodd" d="M-10 -10 H${W + 10} V${H + 10} H-10 Z ${p2(e)}" fill="${MURK}" opacity="${op}"/>`); }
raw(quiet([[232, 0.14], [262, 0.14], [300, 0.14], [345, 0.14]], { hop: 0.2 }));
// the shaft's ash drifting
raw(ash(30, 400, 760, 60, 220, { r: 1.4, op: 0.5, col: '#c8c8c4' }));

// ======================================================================== MID
layer('mid');
{ // the iron-bound door of the stair up to the choir, in the left bay, ajar on black (a familiar size: 1.9 m)
  const Z = 11.2, X = -10.8; const d = [P(X, 0, Z), P(X + 1.0, 0, Z), P(X + 1.0, 1.9, Z), P(X + 0.5, 2.15, Z), P(X, 1.9, Z)]; raw(fillP(d, '#050405') + inkP(d, 1.2)); const lf = [P(X + 1.0, 0, Z), P(X + 1.5, 0, Z - 0.6), P(X + 1.5, 1.9, Z - 0.6), P(X + 1.0, 1.9, Z)]; raw(cel(lf, { Z, fill: mix('#3a2e26', MURK, 0.4), band: 1.5 })); for (const y of [0.4, 1.0, 1.6]) raw(pline([P(X + 1.0, y, Z), P(X + 1.5, y, Z - 0.6)], 1.6, mix(IRON, MURK, 0.2))); }
{ // heaps of old wax on the flags with stubs still burning black; a skull fallen from a niche; a dropped iron candle-ring
  for (const [X, Z] of [[-3.4, 9.2], [2.6, 10.4]]) { const c = P(X, 0, Z), k = K(Z); raw(fillS(blob(c[0], c[1] - k * 0.05, k * 0.4, k * 0.1, 12, 0.4), mix(WAX, MURK, 0.5)) + inkS(blob(c[0], c[1] - k * 0.05, k * 0.4, k * 0.1, 12, 0.4), 0.7, 0.5, 0.6));
    for (let i = 0; i < 4; i++) raw(candle(c[0] + (i - 1.5) * k * 0.15, c[1] - k * 0.08, k * (0.08 + R() * 0.12), k * 0.03, { Z, wax: mix(WAX, MURK, 0.45) })); }
  const s = P(-0.6, 0.08, 9.8); raw(skull(s[0], s[1], K(9.8) * 0.09, mix(BONE, MURK, 0.5)));
  const rg = P(4.4, 0.02, 9.4); raw(`<ellipse cx="${f1(rg[0])}" cy="${f1(rg[1])}" rx="${f1(K(9.4) * 0.22)}" ry="${f1(K(9.4) * 0.05)}" fill="none" stroke="${INK}" stroke-width="3"/><ellipse cx="${f1(rg[0])}" cy="${f1(rg[1])}" rx="${f1(K(9.4) * 0.22)}" ry="${f1(K(9.4) * 0.05)}" fill="none" stroke="${mix(IRON, MURK, 0.2)}" stroke-width="1.4"/>`);
}

// ======================================================================== FORE: the near bay's arch and piers
layer('fore');
{
  const edge = []; for (let k = 0; k <= 40; k++) { const u = k / 40, a = Math.PI - u * Math.PI; edge.push([740 + Math.cos(a) * 690, 250 - Math.sin(a) * 215]); }
  const poly = [[-10, -10], [W + 10, -10], [W + 10, 250], ...edge.slice().reverse(), [-10, 250]];
  raw(cel(poly, { Z: 4, fill: '#1a161a', band: 6 }) + `<path d="${p2(poly)}" fill="${S.hatchA(4)}" opacity="0.55"/><path d="${p2(poly)}" fill="${S.hatchB(4)}" opacity="0.3"/>`);
  for (let k = 1; k < 14; k++) { const i = Math.round(k / 14 * 40), a = edge[i], c = [740, 250], dx = a[0] - c[0], dy = a[1] - c[1], l = Math.hypot(dx, dy); raw(pline([a, [a[0] + dx / l * 30, a[1] + dy / l * 30]], 1.6, INK, 0.8)); }
  raw(line(edge, 3, INK) + line(edge.map(([x, y]) => [x + 1, y - 3]), 1.4, '#4a4446', 0.7));
  // the near piers at the edges, drums soot-dark
  for (const [x0, x1] of [[-10, 56], [W - 52, W + 10]]) { const q = [[x0, 236], [x1, 236], [x1, H + 5], [x0, H + 5]]; raw(cel(q, { Z: 4, fill: '#2a2628', band: 8, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(q)}" fill="${S.hatchA(4)}" opacity="0.5"/>`); for (let y = 260; y < H; y += 34 + R() * 10) raw(`<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y + 8} ${x1} ${y}" stroke="${INK}" stroke-width="1.4" fill="none"/>`);
    raw(cel([[x0 - 14, 218], [x1 + 14, 218], [x1 + 14, 240], [x1, 250], [x0, 250], [x0 - 14, 240]], { Z: 4, fill: '#221e20', band: 4 })); }
  // a candle on the near left pier's capital, burning black against the arch
  raw(candle(30, 218, 46, 6, { Z: 4 }) + candle(46, 218, 30, 5, { Z: 4 }));
}
raw(ash(16, 0, W, 240, 470, { r: 2.4, op: 0.5 }));

G.write(OUT, 'pyre_crypt');
