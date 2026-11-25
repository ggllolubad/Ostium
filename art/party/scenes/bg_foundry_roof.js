// World V, the Storm Foundry: THE BELLOWS ROOF (round 2, group g2). Room key 'foundry_roof'.
// Contract as the nave: 1480 x 480 (shown at 2x); foundry_roof_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters here: The Bellows Roof (imps working the great bellows under the storm), Talos at the Gate (a bronze giant,
// with its heel to the wall).
// The place (bible V: "the forge fire caught a storm and kept it; the foundry sits inside a thunderhead"): the lead flats of
// the foundry roof, up among the stacks, in the rain. Behind the company the great bellows lie in their timber cradle under
// a lean-to, their leather pleats black with wet, the rocking beam over them on its post, the chains slack; the furnace
// stacks smoke at the left; beyond the parapet the guild-city goes off in roofs and chimneys to its wall, where the bronze
// gate stands between its towers. Over everything the Storm-Catcher's iron spire climbs into the thunderhead, its copper
// cables sagging down to the foundry on their clay insulators. The light is the thunderhead's own wet glare breaking
// through over the city (no bolt is drawn anywhere).
// Courses: FIRE (the stacks' smoke and the glow down their throats, soot on everything, hot slag cooling in the gutter);
// LIGHTNING (burns branching over the lead and up the bellows' post, the spire's cables fused at their clamps, a weathervane
// welded solid, rain).
// Light: cold storm daylight, light key, grey-blue; bronze accents.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'V');
const W = 1480, H = 480, ROOM = 'foundry_roof';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2725, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141820' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM, ashlar } = S;
const BK = require('./battle_li')(S);
const MURK = '#1a1e26', AIR = '#7a8494';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 12, airD: 70, airMax: 0.72 });
const { line, polyS, timber } = G;
const { ell } = require('../engine');
const BRONZE = '#9a6a32', WG = '#f4e6b0', SOOT = '#16130f', LEAD = '#5a6068', WET = '#d8e0e8', SKY = '#8a94a4', COPPER = '#a8643a', HOT = '#ffb050';
const RIVS = (X, Y0, Y1, Z, kk) => { let o = ''; for (let Y = Y0 + 0.15; Y < Y1; Y += 0.32) { const c = P(X + 0.025, Y, Z); o += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(Math.max(0.7, kk * 0.02))}" fill="#8a8a86"/>`; } return o; };
const burn = (at, s, t, len, ang, o = {}) => BK.scorch(at, s, t, len, ang, Object.assign({ w: 0.04, depth: 4, col: '#14161a', halo: '#c8ccd0', haloOp: 0.18 }, o));
const ZP = 13.5;                                  // the parapet

// ======================================================================== FAR
layer('far');
// ---- the sky: the thunderhead in heavy masses, its glare breaking through over the city (the light focus)
raw(`<rect width="${W}" height="${H}" fill="${SKY}"/>`);
raw(G.skyGrad(0, 330, [[0, '#3a404c'], [0.35, '#5a6270'], [0.7, '#7a8494'], [1, '#9aa4b0']]));
const GL = [980, 120];
raw(glow(GL[0], GL[1], 380, 170, '#e8eef4', 0.55) + glow(GL[0], GL[1], 170, 80, '#ffffff', 0.5));
for (const [x, y, w, h, col] of [[200, 40, 520, 110, '#3a404c'], [620, 10, 460, 90, '#4a505c'], [1320, 30, 460, 120, '#3a404c']]) raw(G.cloudMass(x, y, w, h, col, { lit: '#e0e6ee', dark: '#262a32', n: Math.round(w / 70) }));
// the glare's edge lit on the cloud lips round it; rain in long sheets across the sky
raw(BK.rain(700, { x0: 0, x1: W, y0: 0, y1: 300, slant: 0.22, len: 18, col: '#e8eef4', op: 0.3, dens: (x, y) => 0.4 + 0.6 * Math.abs(Math.sin(x * 0.004 + 1)) }));
// ---- plane 3 (distance): the guild-city: roofs and chimneys to the wall, the gate between its towers, smoke leaning
{
  const city = (Z, n, hmax, col, seed) => { let x = -40; const pts = [[-40, 340]]; while (x < W + 40) { const w = (14 + R() * 30) * 40 / Z, h = (6 + R() * hmax) * 40 / Z, b = P(0, -6, Z)[1]; pts.push([x, b - h * 0.5]); if (R() < 0.5) pts.push([x + w * 0.5, b - h]); else pts.push([x, b - h], [x + w, b - h]); if (R() < 0.35) { const cx = x + w * (0.2 + R() * 0.6), ch = h + (10 + R() * 18) * 40 / Z; pts.push([cx - 2, b - h * 0.7], [cx - 2, b - ch], [cx + 3, b - ch], [cx + 3, b - h * 0.7]); } pts.push([x + w, b - h * 0.5]); x += w; } pts.push([W + 40, 340]); return `<path d="${p2(pts)}" fill="${col}"/>` + line(pts.slice(1, -1).map(([a, b]) => [a + 0.5, b + 0.5]), 0.6, '#c8d0d8', 0.35); };
  raw(city(120, 0, 26, '#5a626e') + city(80, 0, 22, '#4a525e'));
  // smoke from the city's stacks, leaning with the wind
  for (let i = 0; i < 9; i++) { const x = R() * W, y = 250 + R() * 30; raw(G.steam(x, y, 70 + R() * 50, 30, { col: '#3a3e46', op: 0.2, n: 5, drift: 0.6, inkOp: 0.15 })); }
  // the city wall and the bronze gate between its two towers, at the right
  const Zg = 60, wy = -4.5, k = K(Zg);
  raw(`<path d="${pp([[2, wy, Zg], [40, wy, Zg], [40, 3.5, Zg], [2, 3.5, Zg]])}" fill="#4e5662"/>`);
  for (let X = 2; X < 40; X += 1.4) raw(`<path d="${pp([[X, 3.5, Zg], [X + 0.8, 3.5, Zg], [X + 0.8, 4.3, Zg], [X, 4.3, Zg]])}" fill="#4e5662"/>`);
  for (const X of [17.5, 25.5]) { const pts = [P(X - 2, wy, Zg), P(X + 2, wy, Zg), P(X + 2, 8.5, Zg), P(X + 1.2, 10.5, Zg), P(X, 11.6, Zg), P(X - 1.2, 10.5, Zg), P(X - 2, 8.5, Zg)]; raw(`<path d="${p2(pts)}" fill="#46505c"/>` + line([pts[1], pts[2], pts[3], pts[4]], 0.8, '#c8d0d8', 0.4) + line([P(X - 0.3, 6, Zg), P(X - 0.3, 7, Zg)], 1.2, '#2a2e36', 1)); }
  { const a = P(19.5, wy, Zg), b = P(23.5, 2.5, Zg); raw(`<path d="M${f1(a[0])} ${f1(a[1])} L${f1(a[0])} ${f1(b[1] + 6)} Q${f1((a[0] + b[0]) / 2)} ${f1(b[1] - 8)} ${f1(b[0])} ${f1(b[1] + 6)} L${f1(b[0])} ${f1(a[1])} Z" fill="#7a5a34"/>` + line([[a[0] + 2, a[1]], [a[0] + 2, b[1] + 6]], 0.8, '#c8a070', 0.6)); }
  raw(G.skyGrad(200, 345, [[0, AIR, 0], [1, AIR, 0.55]]));
}
// ---- plane 2: the Storm-Catcher's spire: a riveted iron mast climbing into the cloud, cross-arms with clay insulators,
// cables sagging away down to the foundry; burns ferned up it from its foot; a welded weathervane fallen on a ledge
{
  const Xs = -4.5, Zs = 48, k = K(Zs), b = P(Xs, -3, Zs), t = P(Xs, 40, Zs);
  raw(`<path d="${p2([[b[0] - k * 1.3, b[1]], [b[0] + k * 1.3, b[1]], [t[0] + k * 0.2, t[1]], [t[0] - k * 0.2, t[1]]])}" fill="#3a3e46"/>`);
  for (let Y = -2; Y < 36; Y += 2.4) { const w = 1.3 - (Y + 3) / 43 * 1.1, a = P(Xs - w, Y, Zs), c = P(Xs + w, Y + 2.4, Zs), a2 = P(Xs + w, Y, Zs), c2 = P(Xs - w, Y + 2.4, Zs); raw(line([a, c], 0.8, '#262a30', 0.9) + line([a2, c2], 0.8, '#262a30', 0.9)); }
  raw(line([[b[0] - k * 1.3, b[1]], [t[0] - k * 0.2, t[1]]], 0.9, '#c8d0d8', 0.45));
  for (const Y of [14, 22, 29]) { const w = 1.3 - (Y + 3) / 43 * 1.1 + 1.4, a = P(Xs - w, Y, Zs), c = P(Xs + w, Y, Zs); raw(line([a, c], 1.6, '#262a30', 1)); for (const p of [a, c]) raw(`<rect x="${f1(p[0] - 1.5)}" y="${f1(p[1])}" width="3" height="4" fill="#8a8a7a" stroke="${INK}" stroke-width="0.4"/>`); }
  // the cables: sagging from the arms down to the foundry's roof at the right, copper going green
  for (const [Y, dx] of [[14, 1], [22, 1], [29, -1]]) { const w = 1.3 - (Y + 3) / 43 * 1.1 + 1.4, a = P(Xs + dx * w, Y, Zs), e = P(9.5, 7.5 + Y * 0.05, 15), pts = []; for (let u = 0; u <= 1.001; u += 0.05) pts.push([a[0] + (e[0] - a[0]) * u, a[1] + (e[1] - a[1]) * u + Math.sin(u * Math.PI) * 40]); raw(line(pts, 2.4, INK, 1) + line(pts, 1.2, COPPER, 0.9)); }
  raw(burn((s, t2) => [Xs - 1.2 + s, -2 + t2, Zs - 0.5], 1.2, 0, 8, Math.PI / 2, { w: 0.12, depth: 4 }));
  raw(G.veil(0, 300, 0.18, AIR, { amp: 0 }));
}
// ---- plane 1b: the foundry's own furnace stacks at the left and centre, round, iron-banded, smoking; the glow in their
// throats; burns down their flanks
for (const [X, Z, r, h] of [[-15, 44, 1.5, 15], [-8.5, 34, 1.2, 12.5], [9, 52, 1.3, 13]]) {
  const b = P(X, -4, Z), t = P(X, h, Z), k = K(Z), w = r * k;
  raw(cel([[b[0] - w, b[1]], [b[0] + w, b[1]], [t[0] + w * 0.8, t[1]], [t[0] - w * 0.8, t[1]]], { Z, fill: G.dim('#4a3c34', Z), tex: 'url(#mottle)', texOp: 0.5, band: w * 0.55 }));
  raw(`<path d="${p2([[b[0] + w * 0.1, b[1]], [b[0] + w, b[1]], [t[0] + w * 0.8, t[1]], [t[0] + w * 0.05, t[1]]])}" fill="${S.hatchA(Z)}" opacity="0.45"/>` + line([[b[0] - w * 0.6, b[1]], [t[0] - w * 0.5, t[1]]], 1, '#d8dde4', 0.4));
  for (let Y = 0; Y < h; Y += 2.6 + R()) { const c = P(X, Y, Z), ww = w * (1 - (Y + 4) / (h + 4) * 0.2); raw(`<path d="M${f1(c[0] - ww)} ${f1(c[1])} Q${f1(c[0])} ${f1(c[1] + ww * 0.18)} ${f1(c[0] + ww)} ${f1(c[1])}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, k * 0.12))}" fill="none"/>`); }
  raw(cel(ell([t[0], t[1]], w * 0.85, w * 0.2, 0, 14), { Z, fill: '#1a1410', band: 1 }) + EM(`<ellipse cx="${f1(t[0])}" cy="${f1(t[1] + 1)}" rx="${f1(w * 0.55)}" ry="${f1(w * 0.1)}" fill="${HOT}" opacity="0.7"/>`));
  raw(G.steam(t[0], t[1] - 4, 140 + h * 4, w * 3, { col: '#2a2a2e', op: 0.35, n: 8, drift: 0.7, inkOp: 0.25 }));
  raw(burn((s, t2) => [X - r * 0.6 + s, t2, Z - r], 0.3, h - 1, 4, -Math.PI / 2 - 0.1, { w: 0.06 }));
}
// ---- the parapet: a low stone wall with a lead coping running across behind the bellows, its gutter running with rain
{
  const at = (s, t) => [-40 + s, t, ZP];
  raw(G.builtWall(at, 80, 0.9, '#5a5450', { damp: 0.3, ashlar: { scale: 0.55, wscale: 1.3, roughP: 0.7, vary: 0.28 } }));
  raw(cel([P(-40, 0.9, ZP - 0.1), P(40, 0.9, ZP - 0.1), P(40, 1.0, ZP - 0.1), P(-40, 1.0, ZP - 0.1)], { Z: ZP, fill: '#6a7078', band: 1 }) + line([P(-40, 1.0, ZP - 0.1), P(40, 1.0, ZP - 0.1)], 1, WET, 0.6));
  for (let X = -18; X < 18; X += 3.6 + R() * 2) { const c = P(X, 0.95, ZP - 0.1); raw(`<path d="M${f1(c[0])} ${f1(c[1])} l1 ${f1(10 + R() * 14)}" stroke="${WET}" stroke-width="1" opacity="0.45"/>`); }
}
// ---- the bellows lean-to and the great bellows (behind the company, left of centre): a timber cradle, the leather pleated
// in folds, the iron-shod nozzle into the stack's foot, the rocking beam over it on its post with chains to the board
{
  const Zb = 10.8, x0 = -3.6, x1 = 2.4, k = K(Zb);
  // the lean-to: posts and a slate roof, its eave dripping
  raw(timber([x0 - 0.5, 0, Zb + 1.2], [x0 - 0.5, 4.0, Zb + 1.2], 0.26, { col: '#3e3024', wet: WET }) + timber([x1 + 0.8, 0, Zb + 1.2], [x1 + 0.8, 3.6, Zb + 1.2], 0.26, { col: '#3e3024', wet: WET }));
  raw(cel([P(x0 - 1.0, 4.1, Zb + 1.5), P(x1 + 1.3, 3.7, Zb + 1.5), P(x1 + 1.3, 3.4, Zb - 0.4), P(x0 - 1.0, 3.8, Zb - 0.4)], { Z: Zb, fill: '#3a3e44', tex: 'url(#mottle)', texOp: 0.5, band: 2 }));
  for (let u = 0.05; u < 1; u += 0.06) { const a = P(x0 - 1.0 + (x1 + 2.3 - x0) * u, 3.8 - 0.4 * u, Zb - 0.4), b = P(x0 - 1.0 + (x1 + 2.3 - x0) * u, 4.1 - 0.4 * u, Zb + 1.5); raw(line([a, b], 0.6, INK, 0.55)); }
  for (let u = 0.05; u < 1; u += 0.08) { const e = P(x0 - 1.0 + (x1 + 2.3 - x0) * u, 3.4 - 0.4 * u, Zb - 0.4); raw(`<path d="M${f1(e[0])} ${f1(e[1] + 2)} l0 ${f1(4 + R() * 8)}" stroke="${WET}" stroke-width="0.9" opacity="0.55"/>`); }
  // the great bellows, stood on edge in their cradle so the board faces us: the classic pear-shaped board with its iron-shod
  // nozzle pointing right into the stack's tuyere; the leather in deep pleats round the board's edge, wet and patched; the
  // board's handle-iron and the rocking lever above it on its post, the chain taut; the cradle's timber feet
  {
    const cx = (x0 + x1) / 2 - 0.4, cy = 1.55, a = 2.4, b = 1.25, kk = K(Zb);
    const pear = []; for (let i = 0; i <= 40; i++) { const t = i / 40 * Math.PI * 2, wx = Math.cos(t), wy = Math.sin(t) * (1 - 0.42 * Math.max(0, Math.cos(t))); pear.push([cx - 0.5 + wx * a * (wx > 0 ? 1.15 : 0.85), cy + wy * b]); }
    const ps = pear.map(([X, Y]) => P(X, Y, Zb)), pl = pear.map(([X, Y]) => P(X + (X - cx) * 0.1, Y + (Y - cy) * 0.26 - (Y < cy ? 0.08 : 0), Zb + 0.35));
    // the leather: the board's outline offset outward in pleats (folds seen at the rim), dark wet hide
    raw(cel(pl, { Z: Zb, fill: '#2a1e16', tex: 'url(#mottle)', texOp: 0.5, band: 6 }));
    for (let i = 0; i < pl.length - 1; i += 2) { const A = ps[i], B = pl[i]; raw(line([A, B], 1.2, INK, 0.8) + line([[(A[0] + B[0]) / 2 - 1, (A[1] + B[1]) / 2 - 1], [B[0] - 1, B[1] - 1]], 0.8, '#a89070', 0.4)); }
    // the board: oak planks banded with iron straps, a worn hole round the valve flap, a handle-iron at the narrow end
    raw(cel(ps, { Z: Zb, fill: '#5a4028', tex: 'url(#mottle)', texOp: 0.5, band: 5 }));
    const cid = S.id('bw2'); raw(`<clipPath id="${cid}"><path d="${p2(ps)}"/></clipPath><g clip-path="url(#${cid})">`);
    for (let Y = cy - b; Y < cy + b; Y += 0.28) raw(line([P(cx - a * 1.2, Y, Zb), P(cx + a * 1.4, Y + 0.01, Zb)], 0.9, INK, 0.6) + line([P(cx - a * 1.2, Y + 0.03, Zb), P(cx + a * 1.4, Y + 0.04, Zb)], 0.6, '#a88a60', 0.35));
    for (const X of [cx - 1.4, cx - 0.2, cx + 0.9]) raw(line([P(X, cy - b, Zb), P(X + 0.05, cy + b, Zb)], Math.max(2, kk * 0.06), '#24242a', 1) + RIVS(X, cy - b, cy + b, Zb, kk));
    raw('</g>');
    { const v = P(cx - 1.0, cy, Zb); raw(`<ellipse cx="${f1(v[0])}" cy="${f1(v[1])}" rx="${f1(kk * 0.22)}" ry="${f1(kk * 0.16)}" fill="#14100c" stroke="${INK}" stroke-width="1.2"/>` + cel([[v[0] - kk * 0.2, v[1] - kk * 0.14], [v[0] + kk * 0.05, v[1] - kk * 0.16], [v[0] + kk * 0.04, v[1] + kk * 0.05], [v[0] - kk * 0.18, v[1] + kk * 0.06]], { Z: Zb, fill: '#4a3424', band: 1 })); }
    // the nozzle: iron-shod, tapering to the right into the stack foot's tuyere
    const n0 = P(cx - 0.5 + a * 1.1, cy, Zb), n1 = P(cx - 0.5 + a * 1.1 + 1.1, cy - 0.12, Zb);
    raw(cel([[n0[0], n0[1] - kk * 0.18], [n1[0], n1[1] - kk * 0.06], [n1[0], n1[1] + kk * 0.06], [n0[0], n0[1] + kk * 0.18]], { Z: Zb, fill: '#3a3a40', band: 2 }) + line([[n0[0] + 2, n0[1] - kk * 0.15], [n1[0], n1[1] - kk * 0.05]], 1, '#a8a8b0', 0.5));
    for (const u of [0.15, 0.5, 0.85]) { const x = n0[0] + (n1[0] - n0[0]) * u, h2 = kk * (0.18 - 0.12 * u); raw(line([[x, n0[1] - h2], [x, n0[1] + h2]], 1.6, INK, 1)); }
    // the cradle: two timber feet and a sill under the board
    raw(G.timber([cx - 1.5, 0, Zb + 0.3], [cx - 1.3, 0.55, Zb + 0.3], 0.22, { col: '#3a2a1c' }) + G.timber([cx + 1.2, 0, Zb + 0.3], [cx + 1.0, 0.55, Zb + 0.3], 0.22, { col: '#3a2a1c' }) + G.timber([cx - 2.3, 0.4, Zb + 0.32], [cx + 2.2, 0.4, Zb + 0.32], 0.16, { col: '#3a2a1c', wet: WET }));
    // the handle-iron at the board's narrow end and the lever: post, beam rocking on it, the chain taut to the iron
    const hi = P(cx - 0.5 - a * 0.85, cy + 0.2, Zb - 0.05); raw(line([hi, [hi[0] - kk * 0.25, hi[1] - kk * 0.35]], Math.max(2, kk * 0.05), INK, 1));
    raw(G.timber([cx - 0.4, 0, Zb + 0.7], [cx - 0.4, 3.6, Zb + 0.7], 0.3, { col: '#3e3024' }) + G.timber([cx - 3.6, 3.85, Zb + 0.7], [cx + 1.6, 3.35, Zb + 0.7], 0.26, { col: '#4a3628', wet: WET }));
    raw(BK.chain([hi[0] - kk * 0.25, hi[1] - kk * 0.35], P(cx - 3.3, 3.8, Zb + 0.7), 0, 1.8, '#3a3a40', { rigid: true }));
    raw(burn((s, t2) => [cx - 0.54 + s, t2, Zb + 0.55], 0.1, 0.1, 2.2, Math.PI / 2 + 0.1, { w: 0.03 }));
  }
  // the welded weathervane fallen on the lean-to roof: a bronze cockerel on its rod, run solid
  { const c = P(x0 + 0.6, 4.05, Zb + 0.6); raw(line([c, [c[0] + k * 0.5, c[1] - k * 0.3]], 2, INK, 1) + cel([[c[0] + k * 0.4, c[1] - k * 0.3], [c[0] + k * 0.7, c[1] - k * 0.45], [c[0] + k * 0.75, c[1] - k * 0.3], [c[0] + k * 0.55, c[1] - k * 0.22]], { Z: Zb, fill: BRONZE, band: 1.2 })); }
}
// ---- the lead flats: sheets laid in bays with rolled seams running back to the parapet (the perspective), wet, puddled
// with the sky's glare, a gutter of cooling slag, burns branching over the lead
{
  const at = (s, t) => [-40 + s, 0, 3.6 + t], Lz = ZP - 3.6;
  raw(`<path d="${pp([at(0, 0), at(80, 0), at(80, Lz), at(0, Lz)])}" fill="${LEAD}"/><path d="${pp([at(0, 0), at(80, 0), at(80, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.5"/>`);
  for (let X = -20; X <= 20; X += 0.75) { const a = P(X, 0.03, 3.6), b = P(X, 0.03, ZP); raw(line([a, b], Math.max(1, K(5) * 0.025), INK, 0.7) + line([a, b].map(([x, y]) => [x - 1.2, y]), 0.8, '#b8c0c8', 0.45)); }
  for (let Z = 5.2; Z < ZP; Z += 1.9 + R() * 0.4) raw(line([P(-20, 0.005, Z), P(20, 0.005, Z)], 0.7, INK, 0.45));
  for (const [X, Z, w] of [[-2, 7.2, 2.4], [3.6, 9.6, 1.8], [-6.5, 8.8, 1.6], [6.8, 6.4, 2.0], [0.8, 11.6, 1.4]]) raw(G.puddle(at, X + 40, Z - 3.6, w, w * 0.4, { col: '#6a7888', op: 0.7, refl: ['#e8eef4', '#ffffff'], ringCol: WET }));
  raw(BK.splashes(at, 30, 50, 0.4, Lz, 140, WET));
  for (const [X, Z, a] of [[1.8, 8.6, -2.6], [-4.4, 10.8, -0.4], [5.6, 11.4, 2.8]]) raw(burn((s, t) => [s, 0.006, t], X, Z, 2.4, a, { w: 0.05, core: WG, coreOp: 0.3 }));
  // the gutter along the parapet's foot: a lead channel, slag dropped in it from the stacks cooling black, steam off it
  raw(cel([P(-40, 0, ZP - 0.25), P(40, 0, ZP - 0.25), P(40, -0.1, ZP - 0.02), P(-40, -0.1, ZP - 0.02)], { Z: ZP, fill: '#3a4048', band: 1 }));
  for (let X = -12; X < 12; X += 1.5 + R() * 2) { const c = P(X, -0.04, ZP - 0.15); raw(`<path d="${smooth(S.blobST(c[0], c[1], 10 + R() * 10, 3, 8, 0.5), true, 0.6)}" fill="#141210" stroke="${INK}" stroke-width="0.6"/>` + (R() < 0.3 ? EM(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="1.2" fill="${HOT}"/>`) : '')); }
}
raw(G.frameDark(GL[0] - 160, GL[1] + 60, 900, 380, [[1.0, 0.16], [0.82, 0.12]]));
raw(BK.quiet('#3a4250', 236, 352, { steps: [0.12, 0.14, 0.16, 0.18], hop: 0.1 }));

// ======================================================================== MID
layer('mid');
{
  // a dropped bellows-pole, a leather bucket, a coil of rope, a bronze nozzle off its bellows: low and dark
  const Z = 9.6, k = K(Z);
  { const a = P(-0.6, 0.03, Z - 0.6), b = P(1.8, 0.05, Z - 0.2); raw(line([a, b], 2.6, INK, 1) + line([a, b], 1.3, '#4a3a28', 1)); }
  { const c = P(4.4, 0, Z); raw(cel([[c[0] - k * 0.15, c[1]], [c[0] + k * 0.15, c[1]], [c[0] + k * 0.18, c[1] - k * 0.28], [c[0] - k * 0.18, c[1] - k * 0.28]], { Z, fill: '#3a2a1c', band: 1.4 }) + line([[c[0] - k * 0.17, c[1] - k * 0.27], [c[0] + k * 0.17, c[1] - k * 0.27]], 0.8, WET, 0.6)); }
}

// ======================================================================== FORE: a higher roof's eave at the top left pouring rain; an iron
// conductor post with its fused clamp at the right edge; rain sheets in the near air
layer('fore');
{
  raw(cel([[-20, -10], [300, -10], [270, 40], [-20, 60]], { Z: 3, fill: '#2a2e34', tex: 'url(#mottle)', texOp: 0.5, band: 8 }));
  for (let x = 0; x < 280; x += 22) raw(line([[x, -10], [x - 6, 58 - x * 0.06]], 0.8, INK, 0.5));
  raw(cel([[-20, 56], [280, 38], [284, 50], [-20, 70]], { Z: 3, fill: '#4a4e56', band: 3 }) + line([[-20, 56], [280, 38]], 1.2, WET, 0.6));
  // water pouring off the eave's broken gutter in a rope, splashing below
  raw(line([[60, 54], [64, 160], [66, 300], [68, 480]], 5, '#c8d0d8', 0.35) + line([[60, 54], [64, 160], [66, 300], [68, 480]], 1.6, '#f4f8fa', 0.5));
  for (let i = 0; i < 22; i++) { const x = 20 + R() * 260, l = 6 + R() * 30; raw(`<path d="M${f1(x)} ${f1(56 - x * 0.06)} l0 ${f1(l)}" stroke="${WET}" stroke-width="1" opacity="0.5"/>`); }
  // the conductor post at the right edge: iron, riveted, its copper strap fused into the clamp, a burn fern down it
  raw(cel([[W - 56, -10], [W - 20, -10], [W - 18, H + 10], [W - 60, H + 10]], { Z: 3, fill: '#2a2c32', tex: 'url(#mottle)', texOp: 0.5, band: 10 }));
  for (let y = 30; y < H; y += 70 + R() * 30) raw(cel([[W - 64, y], [W - 14, y], [W - 14, y + 10], [W - 64, y + 10]], { Z: 3, fill: '#3a3c42', band: 3 }));
  raw(line([[W - 40, -10], [W - 38, 200]], 6, INK, 1) + line([[W - 40, -10], [W - 38, 200]], 3.6, COPPER, 1));
  raw(cel([[W - 52, 186], [W - 24, 184], [W - 20, 212], [W - 30, 220], [W - 54, 214]], { Z: 3, fill: '#1a1816', band: 3 }) + burn((s, t) => [s, t, 3], 2.8 - 0.2, -1.0, 1.4, -Math.PI / 2 - 0.1, { w: 0.03 }));
  raw(BK.rain(320, { x0: -20, x1: W, y0: -10, y1: H, slant: 0.22, len: 34, w: 1.0, col: WET, op: 0.28 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
