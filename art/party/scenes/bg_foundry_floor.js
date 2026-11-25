// World V, the Storm Foundry: THE ANVIL LINE (round 2, group g2). Room key 'foundry_floor'.
// Contract as the nave: 1480 x 480 (shown at 2x); foundry_floor_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters here: The Anvil Line (slaves at the hammers, sparks everywhere), Bronze Watch (an automaton and the smith who
// keeps it running). The Anvil Titan's fight has moved to foundry_boss.
// The place (bible V: "a smiths' guild-city that forged bells, armour and automata... the smiths never stop"): the forging
// shop, a long low hall seen down its length. Hearths stand in bays down both sides under their hoods, each with its anvil
// and its trip hammer, the hammers' helves driven by belts from the line shafts that run the length of the roof; a slave's
// neck-chain runs from ring to ring down the middle of the floor, the anvil line. Some hearths roar, the nearest have gone
// cold. At the far end the great doors stand open on the yard, where it is raining.
// Courses: FIRE (the hearths, soot up every hood, embers, sparks off the anvils); LIGHTNING (branching burns scorched up the
// hoods and across the floor plates where the storm came down the shafting; a line shaft's coupling fused into one lump; a
// helve's iron strap welded to its hammer head). No lightning is drawn: only rain, wet light, scorch and fused metal.
// Light: firelight in pools receding down the hall; the cold grey slot of the open door at the vanishing point.
// Shapes: converging diagonals (shafts, belts, helves, plate joints), a rhythm of hoods that is never even.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'V');
const W = 1480, H = 480, ROOM = 'foundry_floor';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2715, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1a100a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#120d0a', AIR = '#4e3626';   // last touch-up: warmer, lighter smoke air lifts the mid and far values
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 10, airD: 34, airMax: 0.62 });
const { line, polyS, timber } = G;
const { ell } = require('../engine');
const BRONZE = '#9a6a32', WG = '#f4e6b0', SOOT = '#16110c', IRON = '#34343a', HOT = '#ffb050', ORANGE = '#f08a2a', WET = '#c8d0d8', STONE = '#5e4c3e';
let YARD = '';
const XW = 7.6, RY = 6.6, ZE = 46;             // side walls, tie-beam height, far end
const HL = [[-1, 9.2, 'cold'], [-1, 15.4, 'roar'], [-1, 22.4, 'roar'], [-1, 29.6, 'low'], [-1, 37.5, 'roar'], [1, 10.6, 'embers'], [1, 17.2, 'roar'], [1, 24.6, 'low'], [1, 31.2, 'roar'], [1, 39.0, 'roar']];
const lights = [[-1, 15.4, 'roar'], [-1, 29.6, 'low'], [1, 10.6, 'embers'], [1, 24.6, 'roar'], [1, 39.0, 'roar']].map(([sg, Z, st]) => ({ p: [sg * 6.2, 1.6, Z], col: '#e8802a', r: st === 'roar' ? 5.5 : 3, k: st === 'roar' ? 0.75 : 0.4 }));
const LT = G.lightTint([...lights, { p: [0, 3, ZE], col: '#8a94a4', r: 8, k: 0.4 }]);
const burn = (at, s, t, len, ang, o = {}) => BK.scorch(at, s, t, len, ang, Object.assign({ w: 0.05, depth: 4, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.2 }, o));
const box3 = (x0, x1, y0, y1, z0, z1, col, o = {}) => {
  // a box with its near (z0) face, the face toward the hall's middle and its top if below the eye
  const sg = (x0 + x1) / 2 < 0 ? 1 : -1, inner = sg > 0 ? x1 : x0, Zc = (z0 + z1) / 2; let s = '';
  s += cel([P(inner, y0, z0), P(inner, y0, z1), P(inner, y1, z1), P(inner, y1, z0)], { Z: Zc, fill: G.dim(o.side || mix(col, INK, 0.25), Zc), tex: 'url(#mottle)', texOp: 0.4, band: 1 });
  if (y1 < 1.2) s += cel([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], { Z: Zc, fill: G.dim(mix(col, '#c8a070', 0.15), Zc), band: 1 });
  s += cel([P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)], { Z: z0, fill: G.dim(col, z0), tex: 'url(#mottle)', texOp: 0.45, band: Math.max(1, K(z0) * 0.04) });
  return s;
};

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3: the far end: the great doors open on the yard in the rain; the yard's crane and stacked castings beyond,
// grey and wet; the cold light lying in along the floor
{
  const d0 = -2.6, d1 = 2.6, dh = 6.0, op = [P(d0, 0, ZE), P(d1, 0, ZE), P(d1, dh, ZE), P(d0, dh, ZE)];
  // last touch-up: the yard is a real rainy exterior seen through the doorway, in four planes that recede into the rain:
  // the near yard (wet setts, puddles holding the sky, the warm spill of the casting shed), the yard crane's gantry, the
  // casting shed across the yard with its doors open on a working hearth (the smiths never stop), the guild-city's roofs
  // and stacks smoking into the rain; mist laid between the planes; rain in three depths with splashes on the setts.
  const cid = S.id('dr'); raw(`<clipPath id="${cid}"><path d="${p2(op)}"/></clipPath><g clip-path="url(#${cid})"><g id="yardview">`);
  raw(G.skyGrad(op[2][1] - 2, op[0][1] + 2, [[0, '#2a303c'], [0.45, '#5a6474'], [0.8, '#aab4c2'], [1, '#c8d0da']], { x: op[0][0] - 4, w: op[1][0] - op[0][0] + 8 }));
  raw(G.cloudSoft(P(-1.5, 9, 140)[0], P(0, 9, 140)[1], 70, 14, '#5a6474', { lit: '#c8d0dc', dark: '#3e4654', n: 4 }) + G.cloudSoft(P(2.5, 12, 160)[0], P(0, 12, 160)[1], 60, 10, '#4e5868', { lit: '#b0bac8', dark: '#3a4250', n: 3 }));
  // plane 4: the guild-city's roofs and stacks, grey in the rain, two late windows lit
  { const Z = 220, sky = []; let X = -40; sky.push(P(-40, 0, Z)); while (X < 40) { const w = 2.5 + R() * 4, h = 8 + R() * 9; sky.push(P(X, h, Z), P(X + w * 0.5, h + 3 + R() * 2, Z), P(X + w, h, Z)); X += w; if (R() < 0.35) { sky.push(P(X, h + 6 + R() * 6, Z), P(X + 0.8, h + 6 + R() * 6, Z)); X += 0.8; } } sky.push(P(40, 0, Z));
    raw(`<path d="${p2(sky)}" fill="#5e6876"/>`);
    for (const [Xs, Ys] of [[-6, 24], [3, 20], [9, 26]]) { const c = P(Xs, Ys, Z); raw(`<path d="${pp([[Xs - 0.6, 0, Z], [Xs + 0.6, 0, Z], [Xs + 0.5, Ys, Z], [Xs - 0.5, Ys, Z]])}" fill="#5e6876"/>` + G.steam(c[0], c[1], 22, 10, { col: '#7a8290', op: 0.35, drift: 0.3, n: 5 })); }
    for (const [Xw, Yw] of [[-4.2, 7], [5.5, 9.5]]) { const c = P(Xw, Yw, Z); raw(`<rect x="${f1(c[0])}" y="${f1(c[1])}" width="1.2" height="1.6" fill="#e8a050" opacity="0.8"/>`); } }
  raw(G.skyGrad(P(0, 6, 120)[1], P(0, 0, 120)[1] + 1, [[0, '#a8b2c0', 0], [1, '#a8b2c0', 0.4]], { x: op[0][0] - 4, w: op[1][0] - op[0][0] + 8 }));
  // plane 3: the casting shed across the yard: rough wall, a pitched roof, its great door open on a working hearth
  { const Z = 92, X0 = -7, X1 = 1.6, Hw = 6.5, Hr = 9.5;
    raw(`<path d="${pp([[X0, 0, Z], [X1, 0, Z], [X1, Hw, Z], [(X0 + X1) / 2, Hr, Z], [X0, Hw, Z]])}" fill="#363c48"/>` + `<path d="${pp([[X0 - 0.4, Hw - 0.1, Z], [(X0 + X1) / 2, Hr + 0.3, Z], [X1 + 0.4, Hw - 0.1, Z]])}" fill="none" stroke="#1e232a" stroke-width="2"/>`);
    for (let Y = 0.7; Y < Hw; Y += 0.55 + R() * 0.2) raw(line([P(X0, Y, Z), P(X1, Y, Z)], 0.5, '#262c34', 0.5));
    const d0 = P(-4.0, 0, Z), d1 = P(-1.2, 3.4, Z); raw(`<rect x="${f1(d0[0])}" y="${f1(d1[1])}" width="${f1(d1[0] - d0[0])}" height="${f1(d0[1] - d1[1])}" fill="#8a4a1c"/>` + G.radial((d0[0] + d1[0]) / 2, d0[1] - 2, (d1[0] - d0[0]) * 0.55, (d0[1] - d1[1]) * 0.8, [[0, '#fff0b8', 1], [0.5, '#f0a040', 0.8], [1, '#c06a28', 0]]) + `<rect x="${f1(d0[0] + 1)}" opacity="0" y="${f1(d1[1] + (d0[1] - d1[1]) * 0.45)}" width="${f1((d1[0] - d0[0]) * 0.5)}" height="${f1((d0[1] - d1[1]) * 0.55)}" fill="#ffd890"/>`);
    { const sm = P(-3.0, 1.2, Z); raw(`<path d="M${f1(sm[0] - 2)} ${f1(d0[1])} l1 -4 l1.2 4 Z M${f1(sm[0] + 2)} ${f1(d0[1])} l0.8 -3 l1 3 Z" fill="${INK}" opacity="0.8"/>`); }   // two smiths at the shed's hearth
    raw(G.radial((d0[0] + d1[0]) / 2, (d0[1] + d1[1]) / 2, (d1[0] - d0[0]) * 1.6, (d0[1] - d1[1]) * 1.1, [[0, '#f09040', 0.55], [1, '#f09040', 0]]));
    for (const Xw of [-6.2, 0.2]) { const a = P(Xw, 2.2, Z), b = P(Xw + 1.0, 3.6, Z); raw(`<rect x="${f1(a[0])}" y="${f1(b[1])}" width="${f1(b[0] - a[0])}" height="${f1(a[1] - b[1])}" fill="#c06a28" opacity="0.85"/>` + line([[(a[0] + b[0]) / 2, b[1]], [(a[0] + b[0]) / 2, a[1]]], 0.5, INK, 0.8)); }
    raw(`<path d="${pp([[-0.6, Hw, Z], [0.2, Hw, Z], [0.2, Hw + 5, Z], [-0.6, Hw + 5, Z]])}" fill="#3e4654"/>` + G.steam(P(-0.2, Hw + 5, Z)[0], P(-0.2, Hw + 5, Z)[1], 20, 8, { col: '#8a7a6a', op: 0.4, drift: 0.4, n: 5 })); }
  raw(G.skyGrad(P(0, 3, 80)[1], P(0, 0, 80)[1] + 1, [[0, '#9aa4b2', 0], [1, '#9aa4b2', 0.28]], { x: op[0][0] - 4, w: op[1][0] - op[0][0] + 8 }));
  // plane 2: the yard's ground: wet setts in perspective, the shed's warm light streaked in them, puddles of sky
  raw(`<path d="${pp([[d0 - 9, 0, ZE + 0.1], [d1 + 9, 0, ZE + 0.1], [d1 + 9, 0, 92], [d0 - 9, 0, 92]])}" fill="#5a6472"/>`);
  for (let Z = ZE + 0.6; Z < 92; Z *= 1.035) raw(line([P(d0 - 9, 0, Z), P(d1 + 9, 0, Z)], Z < 58 ? 0.7 : 0.45, '#262c34', 0.7) + line([P(d0 - 9, 0, Z + 0.15), P(d1 + 9, 0, Z + 0.15)], 0.4, '#8a94a2', 0.3));
  for (let X = -6; X <= 6; X += 0.9) raw(line([P(X, 0, ZE), P(X, 0, 92)], 0.35, '#262c34', 0.35));
  { const t = P(-2.6, 0, 91), b = P(-1.6, 0, ZE + 0.5); raw(G.radial(t[0], (t[1] + b[1]) / 2 + 2, 6, (b[1] - t[1]) * 0.6, [[0, '#e89040', 0.6], [1, '#e89040', 0]])); for (let i = 0; i < 7; i++) { const x = t[0] + (R() - 0.5) * 9; raw(line([[x, t[1] + 2 + R() * 3], [x + (R() - 0.5), b[1] - R() * 4]], 0.5 + R() * 0.6, '#f0a050', 0.25 + R() * 0.3)); } }
  for (const [X, Z, w] of [[1.6, 50, 1.6], [-1.4, 56, 1.4], [0.6, 66, 2.2]]) { const c = P(X, 0, Z), k = K(Z); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * w * 0.5)}" ry="${f1(Math.max(0.6, k * w * 0.08))}" fill="#a8b4c4" opacity="0.6"/><ellipse cx="${f1(c[0] - k * 0.1)}" cy="${f1(c[1])}" rx="${f1(k * w * 0.3)}" ry="${f1(Math.max(0.4, k * w * 0.04))}" fill="#d8e0ea" opacity="0.5"/>`); }
  // plane 2b: the yard crane's gantry: two braced legs and a beam with its crab and a hanging chain; a bell on a sledge
  { const Z = 63; for (const X of [-3.4, 3.0]) raw(`<path d="${pp([[X - 0.18, 0, Z], [X + 0.18, 0, Z], [X + 0.14, 7.6, Z], [X - 0.14, 7.6, Z]])}" fill="#2a3038"/>` + line([P(X, 0.4, Z), P(X + (X < 0 ? 1.4 : -1.4), 2.4, Z)], 1, '#2a3038', 1));
    raw(`<path d="${pp([[-3.8, 7.3, Z], [3.4, 7.3, Z], [3.4, 7.9, Z], [-3.8, 7.9, Z]])}" fill="#262c34"/>` + `<path d="${pp([[0.4, 6.9, Z], [1.2, 6.9, Z], [1.2, 7.3, Z], [0.4, 7.3, Z]])}" fill="#262c34"/>` + line([P(0.8, 6.9, Z), P(0.8, 2.6, Z)], 0.7, '#262c34', 1) + `<path d="M${f1(P(0.8, 2.6, Z)[0] - 1.5)} ${f1(P(0.8, 2.6, Z)[1])} q1.5 3 3 0" stroke="#262c34" stroke-width="0.8" fill="none"/>`); }
  { const c = P(-1.9, 0, 55), k = K(55); raw(`<path d="M${f1(c[0] - k * 0.7)} ${f1(c[1])} Q${f1(c[0] - k * 0.6)} ${f1(c[1] - k * 1.2)} ${f1(c[0])} ${f1(c[1] - k * 1.3)} Q${f1(c[0] + k * 0.6)} ${f1(c[1] - k * 1.2)} ${f1(c[0] + k * 0.7)} ${f1(c[1])} Z" fill="#333842"/>` + line([[c[0] - k * 0.5, c[1] - k * 1.05], [c[0] + k * 0.1, c[1] - k * 1.25]], 0.8, '#9aa4b2', 0.6) + `<path d="${pp([[-2.8, 0, 54.6], [-1.0, 0, 54.6], [-1.0, 0.15, 55.4], [-2.8, 0.15, 55.4]])}" fill="#2a2e36"/>`); }
  { const c = P(2.2, 0, 52), k = K(52); raw(`<path d="M${f1(c[0] - k * 0.6)} ${f1(c[1])} l${f1(k * 0.2)} ${f1(-k * 0.8)} l${f1(k * 0.9)} 0 l${f1(k * 0.2)} ${f1(k * 0.8)} Z" fill="#2e333c"/>` + line([[c[0] - k * 0.35, c[1] - k * 0.8], [c[0] + k * 0.45, c[1] - k * 0.8]], 0.7, '#9aa4b2', 0.55)); }   // castings stacked under a wet tarpaulin
  // rain in three depths, splashes on the setts, mist rolling at the door's foot
  raw(BK.rain(120, { x0: op[0][0], x1: op[1][0], y0: op[2][1], y1: op[0][1], slant: 0.12, len: 4, col: '#c8d0da', op: 0.2, w: 0.4 }));
  raw(BK.rain(70, { x0: op[0][0], x1: op[1][0], y0: op[2][1], y1: op[0][1], slant: 0.14, len: 9, col: '#e8eef4', op: 0.4, w: 0.6 }));
  for (let i = 0; i < 26; i++) { const X = (R() - 0.5) * 5, Z = ZE + 1 + R() * 14, c = P(X, 0, Z); raw(`<path d="M${f1(c[0] - 1)} ${f1(c[1])} l0.5 -1.2 M${f1(c[0] + 1)} ${f1(c[1])} l-0.5 -1.2" stroke="#dce4ee" stroke-width="0.4" opacity="0.6"/>`); }
  raw(G.bank(op[0][0] - 10, op[1][0] + 10, op[0][1] - 3, 6, { col: '#b0bac6', op: 0.16, soft: true }));
  raw('</g></g>');
  YARD = `<g clip-path="url(#${cid})" opacity="0.5"><use href="#yardview"/></g>`;
  // the doorway's reveal: the end wall's thickness on both jambs and a worn threshold stone catching the wet light
  for (const sg of [-1, 1]) raw(`<path d="${pp([[sg * 2.6, 0, ZE], [sg * 2.6, 0, ZE - 0.9], [sg * 2.6, dh, ZE - 0.9], [sg * 2.6, dh, ZE]])}" fill="${sg < 0 ? '#3a3e44' : '#262422'}"/>`);
  raw(`<path d="${pp([[-2.6, dh, ZE - 0.9], [2.6, dh, ZE - 0.9], [2.6, dh, ZE], [-2.6, dh, ZE]])}" fill="#1a1612"/>` + `<path d="${pp([[-2.7, 0.0, ZE - 0.9], [2.7, 0.0, ZE - 0.9], [2.7, 0.16, ZE - 0.2], [-2.7, 0.16, ZE - 0.2]])}" fill="#5a5e64"/>` + line([P(-2.6, 0.16, ZE - 0.2), P(2.6, 0.16, ZE - 0.2)], 1, '#c8d0da', 0.7));
  raw(`<path d="${p2(op)}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + glow(P(0, 2.5, ZE)[0], P(0, 2.5, ZE)[1], 130, 110, '#b8c4d4', 0.12));
  // the cold light spilling in on the floor plates
  raw(G.radial(P(0, 0, ZE - 4)[0], P(0, 0, ZE - 4)[1], 110, 16, [[0, '#a8b4c4', 0.4], [1, '#a8b4c4', 0]]));
  // the doors themselves, swung back against the end wall, iron-strapped planks
  for (const sg of [-1, 1]) { const x0 = sg * 2.6, x1 = sg * 5.2; raw(cel([P(x0, 0, ZE - 1.6), P(x1, 0, ZE - 0.1), P(x1, dh, ZE - 0.1), P(x0, dh, ZE - 1.6)], { Z: ZE, fill: G.dim('#3a2a1c', ZE), band: 1 })); for (const Y of [1.0, 3.0, 5.0]) raw(line([P(x0, Y, ZE - 1.6), P(x1, Y, ZE - 0.1)], 1.2, INK, 0.8)); }
  // the end wall round the doors
  const cid2 = S.id('ew'); raw(`<clipPath id="${cid2}"><path clip-rule="evenodd" d="${pp([[-XW, 0, ZE], [XW, 0, ZE], [XW, 10, ZE], [-XW, 10, ZE]])} ${p2(op)}"/></clipPath><g clip-path="url(#${cid2})">`);
  raw(G.builtWall((s, t) => [-XW + s, t, ZE], XW * 2, 10, G.dim(STONE, ZE), { ashlar: { scale: 0.8 } }));
  raw('</g>');
}
// ---- the side walls: rubble, black with soot, a burn fern up each hood; and the roof: boards over trusses, a broken
// stretch where the rain comes through
for (const sg of [-1, 1]) {
  const at = (s, t) => [sg * XW, t, 4 + s];
  raw(`<path d="${pp([at(0, 0), at(ZE - 4, 0), at(ZE - 4, 9), at(0, 9)])}" fill="${G.dim('#3e3228', 30)}"/><path d="${pp([at(0, 0), at(ZE - 4, 0), at(ZE - 4, 9), at(0, 9)])}" fill="url(#mottle)" opacity="0.5"/>` + G.builtWall(at, 24, 9, G.dim(STONE, 14), { ashlar: { scale: 1.4, wscale: 1.8, roughP: 0.8, vary: 0.3 } }));
  for (let Z = 28; Z < ZE; Z += 0.9) raw(line([P(sg * XW, 0, Z), P(sg * XW, 9, Z)], 0.6, INK, 0.35));
  raw(`<path d="${pp([at(0, 0), at(ZE - 4, 0), at(ZE - 4, 9), at(0, 9)])}" fill="${SOOT}" opacity="0.18"/>`);
}
// last touch-up: the firelight washing the walls round every live hearth (warm, falling off up the wall and along it)
for (const [sg, Z, st] of HL) { if (st === 'cold') continue; const k = K(Z), c = P(sg * XW, 2.4, Z), f = st === 'roar' ? 1 : st === 'low' ? 0.6 : 0.4;
  raw(`<g opacity="${f}">` + G.radial(c[0], c[1], k * 3.4, k * 3.0, [[0, '#f0a050', 0.42], [0.5, '#d07030', 0.2], [1, '#d07030', 0]]) + '</g>'); }
{
  const at = (s, t) => [-XW + s, RY + 0.9, 4 + t];
  raw(`<path d="${pp([at(0, 0), at(XW * 2, 0), at(XW * 2, ZE - 4), at(0, ZE - 4)])}" fill="#1a120c"/>`);
  for (let X = -XW; X < XW; X += 0.28 + R() * 0.06) { if (X > 1.0 && X < 2.6) continue; raw(line([P(X, RY + 0.9, 4), P(X, RY + 0.9, ZE)], 0.6, INK, 0.6)); }
  // the hole in the roof boards: rain falling through it in a sheet onto the floor
  const hq = [P(1.0, RY + 0.9, 13), P(2.6, RY + 0.9, 13), P(2.8, RY + 0.9, 19), P(0.9, RY + 0.9, 19)]; raw(`<path d="${p2(hq)}" fill="#4a525e"/>` + `<path d="${p2(hq)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 6; k++) { const a = hq[0][0] + R() * (hq[1][0] - hq[0][0]); raw(line([[a, hq[0][1]], [a + (R() - 0.5) * 6, hq[0][1] + 6 + R() * 8]], 1.6, INK, 1)); }
}
// ---- trusses: tie beams across at uneven spacing with king posts and braces, iron-strapped, one scorched
for (const Z of [8.0, 12.6, 16.4, 21.8, 26.0, 31.4, 36.0, 41.5]) {
  raw(timber([-XW, RY, Z], [XW, RY, Z], 0.34, { col: '#3a2818', char: Z === 16.4 ? 0.55 : undefined, hot: false }));
  raw(timber([0, RY, Z], [0, RY + 0.95, Z], 0.24, { col: '#33241a' }) + timber([-XW + 0.5, RY + 0.05, Z], [-0.2, RY + 0.85, Z], 0.18, { col: '#33241a' }) + timber([XW - 0.5, RY + 0.05, Z], [0.2, RY + 0.85, Z], 0.18, { col: '#33241a' }));
  if (Z === 16.4) raw(burn((s, t) => [s, RY - 0.17, Z - 0.2], -2.4, 0, 2.6, 0.05, { w: 0.04, core: WG, coreOp: 0.4 }));
}
// ---- the line shafts: an iron shaft down each side under the trusses, on hangers, with a pulley over each hammer; one
// coupling fused into a lump where the storm ran along it
for (const sg of [-1, 1]) {
  const X = sg * 4.8, Y = 5.6, a = P(X, Y, 5), b = P(X, Y, ZE - 2);
  raw(line([a, b], K(8) * 0.07 + 2, INK, 1) + line([a, b], K(8) * 0.07, '#4a4a50', 1) + line([a, b].map(([x, y]) => [x, y - 1]), 0.8, '#9a9aa0', 0.5));
  for (const Z of [8.0, 12.6, 16.4, 21.8, 26.0, 31.4, 36.0, 41.5]) raw(line([P(X, Y, Z), P(X, RY, Z)], Math.max(1, K(Z) * 0.04), INK, 1));
  { const c = P(X, Y, 19.2), k = K(19.2); raw(cel(ell(c, k * 0.18, k * 0.14, 0, 10), { Z: 19, fill: '#2a2a2e', band: 2 }) + burn((s, t) => [X - 0.3 + s, Y - 0.1 + t, 19.1], 0.3, 0.1, 0.9, Math.PI / 2 - 0.2, { w: 0.03, depth: 3, core: WG, coreOp: 0.45 })); }
}
// ---- smoke and heat haze lying under the roof down the hall (recession: farther = lower contrast, toward the air)
raw(G.veil(P(0, RY, 24)[1] - 30, P(0, 0, 24)[1], 0.16, '#6a4830', { amp: 4 }) + G.veil(P(0, RY, 34)[1] - 10, P(0, 0, 34)[1] + 4, 0.18, '#6a4830', { amp: 3 }).replace('opacity="0.18"', 'opacity="0.12"'));
raw(G.bank(-10, W + 10, 120, 40, { col: '#8a6448', op: 0.16, soft: true, ph: 1 }));
raw(G.frameDark(740, 250, 800, 280, [[1.0, 0.16], [0.8, 0.1], [0.6, 0.06]]));
// ---- the bays (Cole's note: every wall object must read as what it is). Three kinds of bay, never in a regular rhythm:
//   HEARTH: a stone hearth with an ash-pit arch and its tuyere; over it a riveted iron hood hung on chains, its plates
//     sooted, a chalk tally on it; an iron flue pipe banded and riveted, with a damper lever and its pull-chain; the anvil
//     and a quench trough in front.
//   HAMMER: a tilt hammer seen side-on: the helve across the bay on its trunnion posts, iron-hooped, the head over its
//     anvil; at the tail the cam wheel face-on with its iron tappets, belt-driven from the line shaft above.
//   RACK: a free-standing tool rack of tongs, hammers and pokers, a quench trough with steam off it, a chalked tally board.
const BAYS = [[-1, 9.2, 'hammer'], [-1, 15.4, 'hearth', 'roar'], [-1, 22.4, 'rack'], [-1, 29.6, 'hearth', 'low'], [-1, 37.5, 'hammer'], [1, 10.6, 'hearth', 'embers'], [1, 17.2, 'hammer'], [1, 24.6, 'hearth', 'roar'], [1, 31.2, 'rack'], [1, 39.0, 'hearth', 'roar']];
const RIV = (A, B, n, r) => { let s = ''; for (let i = 0; i <= n; i++) { const x = A[0] + (B[0] - A[0]) * i / n, y = A[1] + (B[1] - A[1]) * i / n; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${INK}"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.4)}" fill="#8a8a86" opacity="0.6"/>`; } return s; };
const chalk = (x, y, k, n) => { let d = ''; for (let i = 0; i < n; i++) d += `M${f1(x + i * k * 0.035)} ${f1(y)} l${f1(k * 0.008)} ${f1(k * 0.1)} `; d += `M${f1(x - k * 0.01)} ${f1(y + k * 0.08)} L${f1(x + Math.min(n, 5) * k * 0.035)} ${f1(y + k * 0.02)}`; return `<path d="${d}" stroke="#e0dcd0" stroke-width="${f1(Math.max(0.6, k * 0.008))}" opacity="0.75" fill="none" stroke-linecap="round"/>`; };
function anvil(X, Z) { const k = K(Z); let s = box3(X - 0.22, X + 0.22, 0, 0.5, Z - 0.25, Z + 0.15, '#2e2418');
  const t = P(X, 0.5, Z - 0.25), w = k * 0.42; s += cel([[t[0] - w * 0.9, t[1] - k * 0.22], [t[0] + w * 0.5, t[1] - k * 0.22], [t[0] + w * 1.25, t[1] - k * 0.19], [t[0] + w * 0.55, t[1] - k * 0.12], [t[0] + w * 0.3, t[1]], [t[0] - w * 0.3, t[1]], [t[0] - w * 0.5, t[1] - k * 0.12], [t[0] - w * 0.9, t[1] - k * 0.15]], { Z, fill: G.dim(IRON, Z), band: 1.5 }) + line([[t[0] - w * 0.85, t[1] - k * 0.21], [t[0] + w * 0.5, t[1] - k * 0.21]], 0.9, '#a8a8b0', 0.6); return s; }
function trough(X0, X1, Z, o = {}) { const k = K(Z); let s = box3(X0, X1, 0, 0.55, Z - 0.3, Z + 0.3, o.col || '#3a2c1e');
  const a = P(X0 + 0.05, 0.5, Z - 0.28), b = P(X1 - 0.05, 0.5, Z - 0.28), c = P(X1 - 0.05, 0.5, Z + 0.28), d = P(X0 + 0.05, 0.5, Z + 0.28);
  s += `<path d="${p2([a, b, c, d])}" fill="#14181c"/>` + line([[a[0] + 2, a[1] - 1], [b[0] - 2, b[1] - 1]], 0.8, '#c8d0d8', 0.5) + line([[a[0] + 4, (a[1] + d[1]) / 2], [b[0] - 6, (b[1] + c[1]) / 2]], 0.8, ORANGE, 0.4);
  for (const X of [X0 + 0.15, X1 - 0.15]) s += line([P(X, 0.02, Z - 0.31), P(X, 0.53, Z - 0.31)], Math.max(1, k * 0.03), '#1a1a1e', 1);
  if (o.steam) s += G.steam(P((X0 + X1) / 2, 0.55, Z)[0], P(0, 0.55, Z)[1], k * 1.4, k * 0.5, { col: '#d8d0c8', op: 0.16, n: 5 });
  return s; }
for (const [sg, Z, kind, st] of BAYS.slice().sort((a, b) => b[1] - a[1])) {
  const k = K(Z), xo = sg * XW;
  if (kind === 'hearth') {
    // the chimney breast: stone built out from the wall up into the roof
    raw(box3(Math.min(sg * 6.3, xo), Math.max(sg * 6.3, xo), 0, RY + 1, Z - 1.25, Z + 1.25, '#3a3028'));
    raw(G.builtWall((s, t) => [Math.min(sg * 6.3, xo) + s, t, Z - 1.26], Math.abs(XW - 6.3), RY + 1, G.dim('#3e342a', Z), { ashlar: { scale: 0.7, roughP: 0.7 } }) + `<path d="${pp([[Math.min(sg * 6.3, xo), 0, Z - 1.26], [Math.max(sg * 6.3, xo), 0, Z - 1.26], [Math.max(sg * 6.3, xo), RY + 1, Z - 1.26], [Math.min(sg * 6.3, xo), RY + 1, Z - 1.26]])}" fill="${SOOT}" opacity="0.35"/>`);
    // the hearth: stone, its ash-pit arch dark with a glow, a tuyere pipe entering its side; the fire on its bed
    const h0 = Math.min(sg * 5.2, xo), h1 = Math.max(sg * 5.2, xo); raw(box3(h0, h1, 0, 0.95, Z - 1.05, Z + 1.05, '#4a3c30'));
    { const a = P(sg * 5.6, 0, Z - 1.06), b = P(sg * 6.6, 0, Z - 1.06), c = P(sg * 6.1, 0.55, Z - 1.06); const pit = `M${f1(a[0])} ${f1(a[1])} L${f1(a[0])} ${f1(c[1] + (a[1] - c[1]) * 0.4)} Q${f1(c[0])} ${f1(c[1] - 3)} ${f1(b[0])} ${f1(c[1] + (a[1] - c[1]) * 0.4)} L${f1(b[0])} ${f1(b[1])} Z`; raw(`<path d="${pit}" fill="#0c0806" stroke="${INK}" stroke-width="1"/>` + (st !== 'cold' ? EM(`<path d="M${f1(a[0] + 3)} ${f1(a[1] - 1)} L${f1(b[0] - 3)} ${f1(b[1] - 1)}" stroke="${ORANGE}" stroke-width="${f1(Math.max(1, k * 0.04))}" opacity="0.7"/>`) : '')); }
    raw(line([P(sg * 5.15, 0.75, Z + 0.4), P(sg * 4.7, 0.95, Z + 0.9), P(sg * 4.6, 2.0, Z + 1.0)], Math.max(2, k * 0.09), INK, 1) + line([P(sg * 5.15, 0.75, Z + 0.4), P(sg * 4.7, 0.95, Z + 0.9), P(sg * 4.6, 2.0, Z + 1.0)], Math.max(1, k * 0.06), '#5a3e22', 1));
    if (st === 'roar') { G.fireAt(sg * 6.2, 0.95, Z, 1.15, 1.0, { n: 7, gr: 3, gop: 0.42, gcol: ORANGE }); raw(G.radial(P(sg * 6.2, 1.3, Z)[0], P(sg * 6.2, 1.3, Z)[1], k * 1.2, k * 0.8, [[0, '#fff0c0', 0.6], [1, ORANGE, 0]])); raw(glow(P(sg * 6.0, 2.2, Z)[0], P(sg * 6.0, 2.2, Z)[1], k * 2.2, k * 1.0, ORANGE, 0.42)); }
    else if (st !== 'cold') { const c = P(sg * 6.2, 0.97, Z); for (let j = 0; j < 12; j++) raw(EM(`<circle cx="${f1(c[0] + (R() - 0.5) * k * 0.9)}" cy="${f1(c[1] - R() * k * 0.08)}" r="${f1(Math.max(0.6, k * 0.03))}" fill="${R() < 0.5 ? HOT : ORANGE}" opacity="0.85"/>`)); raw(glow(c[0], c[1], k * 1.2, k * 0.5, ORANGE, st === 'low' ? 0.28 : 0.16)); }
    // the hood: riveted iron plates, front plate a trapezoid flaring at its mouth, hung on two chains from the tie beam
    const hb = 2.25, ht = 3.55, f0 = P(sg * 5.0, hb, Z - 1.1), f1_ = P(xo, hb, Z - 1.1), f2 = P(xo, ht, Z - 0.8), f3 = P(sg * 6.5, ht, Z - 0.8);
    const front = sg < 0 ? [f1_, f0, f3, f2] : [f0, f1_, f2, f3];
    raw(`<path d="${pp([[sg * 5.0, hb, Z - 1.1], [sg * 5.0, hb, Z + 1.1], [sg * 6.5, ht, Z + 0.8], [sg * 6.5, ht, Z - 0.8]])}" fill="${G.dim(st === 'cold' ? '#2e2824' : '#4a3426', Z)}"/><path d="${pp([[sg * 5.0, hb, Z - 1.1], [sg * 5.0, hb, Z + 1.1], [sg * 6.5, ht, Z + 0.8], [sg * 6.5, ht, Z - 0.8]])}" fill="${S.hatchB(Z)}" opacity="0.3"/>`);
    raw(cel(front, { Z, fill: G.dim(st === 'cold' ? '#4a423c' : '#6a5444', Z, 0.35), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(1.5, k * 0.06) }));
    // the fire's light on the hood's plates: warm from the mouth upward, strongest at the live hearths
    if (st !== 'cold') { const m = [(f0[0] + f1_[0]) / 2, (f0[1] + f1_[1]) / 2], hw = Math.abs(f1_[0] - f0[0]); raw(`<g opacity="${st === 'roar' ? 1 : st === 'low' ? 0.7 : 0.5}">` + G.radial(m[0], m[1] - k * 0.45, hw * 0.95, k * 1.25, [[0, '#ffd890', 0.75], [0.4, '#f8a048', 0.45], [1, ORANGE, 0]]) + G.radial(m[0] + sg * hw * 0.15, m[1] - k * 1.6, hw * 0.6, k * 1.6, [[0, '#f8a048', 0.35], [1, ORANGE, 0]]) + '</g>'); }
    { const fl = (u, v) => { const L0 = [f0[0] + (f3[0] - f0[0]) * v, f0[1] + (f3[1] - f0[1]) * v], L1 = [f1_[0] + (f2[0] - f1_[0]) * v, f1_[1] + (f2[1] - f1_[1]) * v]; return [L0[0] + (L1[0] - L0[0]) * u, L0[1] + (L1[1] - L0[1]) * u]; };
      for (const v of [0.36, 0.7]) raw(line([fl(0, v), fl(1, v)], 1, INK, 0.8) + RIV(fl(0.04, v), fl(0.96, v), 7, Math.max(0.6, k * 0.018)));
      raw(line([fl(0.5, 0), fl(0.5, 1)], 1, INK, 0.8) + RIV(fl(0.5, 0.05), fl(0.5, 0.95), 4, Math.max(0.6, k * 0.018)));
      // the flared mouth: a rolled iron lip lit from below by the fire
      raw(line([fl(-0.02, 0), fl(1.02, 0)], Math.max(2.5, k * 0.07), INK, 1) + (st === 'roar' || st === 'low' ? line([fl(0, 0), fl(1, 0)].map(([x, y]) => [x, y + 1.5]), Math.max(1, k * 0.025), ORANGE, 0.8) : ''));
      // soot fanned up the plates, a chalk tally of the day's work
      raw(`<path d="${p2([fl(0.1, 0.05), fl(0.9, 0.05), fl(0.7, 1), fl(0.3, 1)])}" fill="#0c0a08" opacity="0.35"/>` + chalk(...fl(0.12, 0.45), k, 4 + Math.floor(R() * 5)));
      // hanging chains from the tie beam to the hood's corners, and a hook chain with a pair of tongs hung on it
      for (const u of [0.1, 0.9]) { const a = fl(u, 1), top = P(sg * (u < 0.5 ? 6.6 : 7.3), RY - 0.15, Z - 0.8); raw(BK.chain([a[0], a[1]], top, 0, Math.max(1, k * 0.025), '#3a3a40')); } }
    // the flue: an iron pipe rising from the hood through the roof, banded and riveted, a damper lever and its pull-chain
    { const X = sg * 6.95, r = 0.32, a = P(X - r, ht, Z - 0.5), b = P(X + r, RY + 1, Z - 0.5), w = b[0] - a[0];
      raw(cel([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], { Z, fill: G.dim('#2a2826', Z), tex: 'url(#mottle)', texOp: 0.5, band: w * 0.38 }) + line([[a[0] + w * 0.22, b[1]], [a[0] + w * 0.22, a[1]]], Math.max(0.8, w * 0.08), '#8a8680', 0.45));
      for (let Y = ht + 0.5; Y < RY; Y += 0.9 + R() * 0.4) { const c = P(X, Y, Z - 0.5); raw(`<path d="M${f1(a[0] - 1)} ${f1(c[1])} Q${f1(c[0])} ${f1(c[1] + w * 0.12)} ${f1(b[0] + 1)} ${f1(c[1])}" stroke="${INK}" stroke-width="${f1(Math.max(1.4, k * 0.035))}" fill="none"/>` + RIV([a[0] + w * 0.15, c[1] + 1], [b[0] - w * 0.15, c[1] + 1], 3, Math.max(0.5, k * 0.012))); }
      const dm = P(X, ht + 0.8, Z - 0.5), dl = [dm[0] - sg * k * 0.55, dm[1] - k * 0.05]; raw(line([dm, dl], Math.max(2, k * 0.05), INK, 1) + line([dm, dl], Math.max(1, k * 0.025), '#5a5650', 1) + cel(ell(dm, w * 0.28, w * 0.16, 0, 8), { Z, fill: '#3a3632', band: 1 }) + BK.chain(dl, [dl[0], dl[1] + k * 1.1], 0, Math.max(0.8, k * 0.02), '#3a3a40') + `<circle cx="${f1(dl[0])}" cy="${f1(dl[1] + k * 1.15)}" r="${f1(k * 0.05)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`); }
    if (R() < 0.7) raw(burn((s, t) => [sg * 6.29, t, Z - 1.2 + s], 0.6, 0.2, 2.0, Math.PI / 2 + (R() - 0.5) * 0.3, { w: 0.04, core: st === 'roar' ? WG : false, coreOp: 0.4 }));
    raw(anvil(sg * 4.0, Z - 0.3) + trough(sg < 0 ? -4.9 : 4.1, sg < 0 ? -4.1 : 4.9, Z + 1.0, { steam: st === 'roar' }));
    if (st === 'roar') { const c = P(sg * 4.0, 0.75, Z - 0.3); raw(G.sparks(12, c[0] - k * 0.4, c[0] + k * 0.4, c[1] - k * 0.6, c[1] - k * 0.1, [WG, HOT], { len: k * 0.08 })); }
  } else if (kind === 'hammer') {
    // the tilt hammer: posts, the helve across the bay (iron-hooped), the head over the anvil; the cam wheel at the tail
    const Y = 1.25, xt = sg * 7.05, xp = sg * 5.9, xh = sg * 3.95, up = R() < 0.5;
    raw(box3(Math.min(sg * 7.6, sg * 6.4), Math.max(sg * 7.6, sg * 6.4), 0, 0.5, Z - 0.7, Z + 0.7, '#3a3028'));
    // the cam wheel: face-on, spoked, four iron tappets on its rim, a belt pulley on its axle; the belt up to the shaft
    { const c = P(sg * 6.95, 0.95, Z - 0.75), r = k * 0.5; raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${G.dim('#3a2c1e', Z)}" stroke="${INK}" stroke-width="${f1(Math.max(1.4, k * 0.05))}"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.82)}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + 0.3; raw(line([c, [c[0] + Math.cos(a) * r * 0.8, c[1] + Math.sin(a) * r * 0.8]], Math.max(1, k * 0.035), INK, 0.9)); }
      for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283 + 0.9, x = c[0] + Math.cos(a) * r, y = c[1] + Math.sin(a) * r; raw(cel([[x - Math.sin(a) * r * 0.12, y + Math.cos(a) * r * 0.12], [x + Math.cos(a) * r * 0.22 - Math.sin(a) * r * 0.12, y + Math.sin(a) * r * 0.22 + Math.cos(a) * r * 0.12], [x + Math.cos(a) * r * 0.22 + Math.sin(a) * r * 0.12, y + Math.sin(a) * r * 0.22 - Math.cos(a) * r * 0.12], [x + Math.sin(a) * r * 0.12, y - Math.cos(a) * r * 0.12]], { Z, fill: '#3a3a40', band: 1 })); }
      raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.28)}" fill="#2a2a2e" stroke="${INK}" stroke-width="1.2"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.08)}" fill="${INK}"/>` + line([[c[0] - r * 0.6, c[1] - r * 0.55], [c[0] - r * 0.1, c[1] - r * 0.78]], 0.9, '#c8a070', 0.5));
      const top = P(sg * 6.95, 5.6, Z - 0.75); raw(line([[c[0] - r * 0.28, c[1]], [top[0] - k * 0.12, top[1]]], Math.max(1.2, k * 0.04), INK, 0.95) + line([[c[0] + r * 0.28, c[1]], [top[0] + k * 0.12, top[1]]], Math.max(1.2, k * 0.04), INK, 0.95) + `<ellipse cx="${f1(top[0])}" cy="${f1(top[1])}" rx="${f1(k * 0.14)}" ry="${f1(k * 0.14)}" fill="#2a2a2e" stroke="${INK}" stroke-width="1"/>`); }
    // trunnion posts, braced
    raw(timber([xp, 0, Z - 0.45], [xp, Y + 0.2, Z - 0.45], 0.28, { col: '#3e2c1a' }) + timber([xp - sg * 0.6, 0, Z - 0.45], [xp, Y - 0.1, Z - 0.45], 0.14, { col: '#33241a' }));
    // the helve: tail over the cam, pivot, head end over the anvil; iron hoops; the head a block of iron with its pallet
    const hy = up ? Y + 0.45 : Y - 0.18, A = P(xt, Y - (up ? 0.25 : -0.12), Z - 0.55), M = P(xp, Y, Z - 0.55), Bh = P(xh, hy, Z - 0.55);
    raw(line([A, M, Bh], Math.max(4, k * 0.2), INK, 1) + line([A, M, Bh], Math.max(2.6, k * 0.16), G.dim('#4a3420', Z), 1) + line([A, M, Bh].map(([x, y]) => [x, y - k * 0.05]), Math.max(0.8, k * 0.025), '#a88a60', 0.45));
    for (const u of [0.2, 0.55, 0.8]) { const x = M[0] + (Bh[0] - M[0]) * u, y = M[1] + (Bh[1] - M[1]) * u; raw(line([[x, y - k * 0.09], [x, y + k * 0.09]], Math.max(1.6, k * 0.04), '#1a1a1e', 1)); }
    raw(cel([[Bh[0] - k * 0.16, Bh[1] - k * 0.14], [Bh[0] + k * 0.16, Bh[1] - k * 0.14], [Bh[0] + k * 0.14, Bh[1] + k * 0.36], [Bh[0] - k * 0.14, Bh[1] + k * 0.36]], { Z, fill: G.dim('#3a3a40', Z), band: 2 }) + `<circle cx="${f1(M[0])}" cy="${f1(M[1])}" r="${f1(k * 0.06)}" fill="${INK}"/>`);
    raw(anvil(xh, Z - 0.55 + 0.25));
    if (!up) { const c = P(xh, 0.75, Z - 0.3); raw(G.sparks(14, c[0] - k * 0.5, c[0] + k * 0.5, c[1] - k * 0.5, c[1], [WG, HOT], { len: k * 0.1 })); }
    raw(burn((s, t) => [sg * 6.39, t, Z - 0.7 + s], 0.3, 0.05, 0.9, Math.PI / 2, { w: 0.03 }));
  } else {
    // the rack: two posts and rails facing the aisle, tongs hung by their reins, hammers by their heads, pokers; a tally
    // board chalked with the hall's count; a quench trough before it, steaming
    const x0 = Math.min(sg * 7.2, sg * 5.0), x1 = Math.max(sg * 7.2, sg * 5.0), z = Z - 0.4;
    raw(timber([x0, 0, z], [x0, 2.6, z], 0.18, { col: '#3e2c1a' }) + timber([x1, 0, z], [x1, 2.6, z], 0.18, { col: '#3e2c1a' }) + timber([x0 - 0.1, 2.4, z], [x1 + 0.1, 2.4, z], 0.14, { col: '#4a3420' }) + timber([x0 - 0.1, 1.4, z], [x1 + 0.1, 1.4, z], 0.12, { col: '#4a3420' }));
    for (let i = 0; i < 9; i++) { const X = x0 + 0.2 + i * (x1 - x0 - 0.4) / 8, top = P(X, 2.38, z - 0.05), kind2 = i % 3;
      if (kind2 === 0) { const b = P(X + 0.05, 1.5, z - 0.05), j = P(X - 0.03, 1.55, z - 0.05); raw(line([top, b], Math.max(1, k * 0.025), INK, 1) + line([top, j], Math.max(1, k * 0.025), INK, 1) + line([b, [b[0] + k * 0.04, b[1] + k * 0.12]], Math.max(1.2, k * 0.03), INK, 1) + line([j, [j[0] - k * 0.03, j[1] + k * 0.12]], Math.max(1.2, k * 0.03), INK, 1)); }
      else if (kind2 === 1) { const b = P(X, 1.7, z - 0.05); raw(line([top, b], Math.max(1.2, k * 0.03), '#5a4028', 1) + cel([[top[0] - k * 0.07, top[1] - k * 0.02], [top[0] + k * 0.08, top[1] - k * 0.02], [top[0] + k * 0.07, top[1] + k * 0.06], [top[0] - k * 0.07, top[1] + k * 0.06]], { Z, fill: '#3a3a40', band: 1 })); }
      else { const b = P(X, 1.45, z - 0.05); raw(line([top, b], Math.max(1, k * 0.02), '#2a2a2e', 1) + line([b, [b[0] + k * 0.05, b[1] - k * 0.04]], Math.max(1, k * 0.02), '#2a2a2e', 1)); } }
    for (let i = 0; i < 4; i++) { const X = x0 + 0.3 + i * 0.5, a = P(X, 1.38, z - 0.05); raw(line([a, P(X + 0.12, 0.6, z - 0.05)], Math.max(1, k * 0.025), INK, 1) + cel([[a[0] - k * 0.05, a[1]], [a[0] + k * 0.05, a[1]], [a[0] + k * 0.04, a[1] + k * 0.1], [a[0] - k * 0.04, a[1] + k * 0.1]], { Z, fill: '#3a3a40', band: 1 })); }
    { const b = P(sg * 6.0, 3.1, z - 0.02), kk = k; raw(cel([[b[0] - kk * 0.4, b[1] - kk * 0.28], [b[0] + kk * 0.4, b[1] - kk * 0.28], [b[0] + kk * 0.4, b[1] + kk * 0.28], [b[0] - kk * 0.4, b[1] + kk * 0.28]], { Z, fill: '#2a2622', band: 1.5 }) + chalk(b[0] - kk * 0.32, b[1] - kk * 0.2, kk, 9) + chalk(b[0] - kk * 0.32, b[1] + kk * 0.02, kk, 6) + line([P(sg * 6.0, 3.4, z), P(sg * 6.0, 4.2, z)], 1, INK, 0.8)); }
    raw(trough(sg < 0 ? -4.9 : 3.8, sg < 0 ? -3.8 : 4.9, Z + 0.5, { steam: true, col: '#3a3a3e' }));
  }
}
// ---- bronze castings hung to cool from the tie beams over the aisle: two small bells and a cast grille on chains
{
  const bell = (X, Y, Z, Hb) => { const k = K(Z), prof = [[0, 0.86], [0.08, 0.8], [0.25, 0.62], [0.5, 0.53], [0.8, 0.5], [0.95, 0.4], [1, 0.22]], Lp = prof.map(([u, w]) => P(X - w * Hb * 0.55, Y + u * Hb, Z)), Rp = prof.map(([u, w]) => P(X + w * Hb * 0.55, Y + u * Hb, Z)).reverse();
    return BK.chain(P(X, Y + Hb, Z), P(X, RY, Z), 0, Math.max(1, k * 0.025), '#3a3a40', { rigid: true }) + cel([...Lp, ...Rp], { Z, fill: G.dim('#8a5a2a', Z), tex: 'url(#mottle)', texOp: 0.45, band: k * Hb * 0.25 }) + line(Lp.slice(1, 5).map(([x, y]) => [x + 2, y]), 1.2, '#f0c080', 0.6) + line([[Lp[1][0], Lp[1][1]], [Rp[Rp.length - 2][0], Rp[Rp.length - 2][1]]], 0.8, INK, 0.7) + glow(P(X, Y + Hb * 0.4, Z)[0], P(X, Y + Hb * 0.4, Z)[1], k * Hb * 0.8, k * Hb * 0.6, ORANGE, 0.18); };
  raw(bell(-2.6, 4.0, 12.6, 0.9) + bell(2.3, 4.3, 21.8, 0.7) + bell(-1.8, 4.6, 31.4, 0.6));
  { const Z = 16.4, k = K(Z), c = P(2.9, 4.6, Z); raw(BK.chain(c, P(2.9, RY, Z), 0, Math.max(1, k * 0.025), '#3a3a40', { rigid: true }) + cel([[c[0] - k * 0.5, c[1]], [c[0] + k * 0.5, c[1]], [c[0] + k * 0.5, c[1] + k * 0.7], [c[0] - k * 0.5, c[1] + k * 0.7]], { Z, fill: '#7a5428', band: 2 })); for (let i = 1; i < 5; i++) raw(line([[c[0] - k * 0.5 + i * k * 0.2, c[1] + 2], [c[0] - k * 0.5 + i * k * 0.2, c[1] + k * 0.68]], 1.4, INK, 0.9)); raw(line([[c[0] - k * 0.48, c[1] + k * 0.35], [c[0] + k * 0.48, c[1] + k * 0.35]], 1.4, INK, 0.9)); }
}
// ---- the floor: cast plates on black sand converging to the door, the anvil line's chain down the middle from ring to
// ring, wet in the stretch under the roof hole (the door's light lying in it), scorch ferns, slag, embers
{
  const at = (s, t) => [-XW + s, 0, 3.6 + t], Lz = ZE - 3.6;
  raw(`<path d="${pp([at(0, 0), at(XW * 2, 0), at(XW * 2, Lz), at(0, Lz)])}" fill="#3a322c"/><path d="${pp([at(0, 0), at(XW * 2, 0), at(XW * 2, Lz), at(0, Lz)])}" fill="url(#speck)" opacity="0.5"/>`);
  for (let Z = 3.8; Z < ZE;) { const d = (0.9 + R() * 0.6) * (1 + (Z - 4) / 30); for (let X = -3.4 + (R() - 0.5) * 0.4; X < 3.4;) { const w = 1.0 + R() * 0.7, q = [P(X + 0.03, 0.005, Z + d - 0.03), P(X + w - 0.03, 0.005, Z + d - 0.03), P(X + w - 0.03, 0.005, Z + 0.03), P(X + 0.03, 0.005, Z + 0.03)], lt = LT([X + w / 2, 0, Z + d / 2]);
      raw(cel(chip(q, 0.2), { Z, fill: tone(lt ? mix('#4a443e', lt[0], lt[1] * 0.75) : '#4a443e', 0.15), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(0.8, K(Z) * 0.015), inkW: 0.6, heavy: 0.9 }));
      for (const [u, v] of [[0.1, 0.15], [0.9, 0.15], [0.1, 0.85], [0.9, 0.85]]) { const c = P(X + w * u, 0.01, Z + d * v); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(Math.max(0.5, K(Z) * 0.025))}" ry="${f1(Math.max(0.35, K(Z) * 0.01))}" fill="${INK}"/>`); }
      X += w; } Z += d; }
  // the anvil line's chain: rings let into the plates every few metres, the chain run between them
  const rings = []; for (let Z = 5.2; Z < ZE - 2; Z += 2.6 + R()) rings.push(P(0.15 * Math.sin(Z), 0.01, Z));
  for (let i = 0; i < rings.length - 1; i++) raw(BK.chain(rings[i], rings[i + 1], 2, Math.max(1, K(5 + i * 3) * 0.035), '#4a4a50'));
  for (const r of rings) raw(`<ellipse cx="${f1(r[0])}" cy="${f1(r[1])}" rx="${f1(Math.max(1.2, (r[1] - 300) * 0.05))}" ry="${f1(Math.max(0.6, (r[1] - 300) * 0.02))}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  // the wet stretch under the roof hole and its rain
  for (const [X, Z, w] of [[1.6, 15, 1.6], [2.4, 17.6, 1.2], [0.6, 13.2, 1.0]]) raw(G.puddle(at, X + XW, Z - 3.6, w, w * 0.5, { refl: ['#b8c4d4', ORANGE] }));
  raw(BK.rain(260, { x0: P(1.0, 6, 13)[0], x1: P(2.8, 6, 19)[0] + 20, y0: P(0, RY + 0.9, 13)[1], y1: P(0, 0, 16)[1], slant: 0.08, len: 10, col: WET, op: 0.35 }));
  for (let i = 0; i < 5; i++) { const X0 = (R() - 0.5) * 5, Z0 = 8 + R() * 18; raw(burn((s, t) => [s, 0.012, t], X0, Z0, 1.6 + R() * 1.6, R() * 6.28, { w: 0.04, depth: 4 })); }
  for (let i = 0; i < 40; i++) { const X = (R() - 0.5) * 8, Z = 4 + R() * 20, [x, y] = P(X, 0.01, Z), r = K(Z) * (0.03 + R() * 0.06); raw(`<path d="${smooth(S.blobST(x, y, r * 2, r * 0.6, 8, 0.6), true, 0.6)}" fill="#141210" stroke="${INK}" stroke-width="0.5"/>` + (R() < 0.3 ? EM(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(0.6, r * 0.25))}" fill="${HOT}"/>`) : '')); }
}
// last touch-up: pools of firelight thrown across the floor plates from the live hearths, reaching toward the anvil line
for (const [sg, Z, st] of HL) { if (st === 'cold') continue; const c = P(sg * 3.8, 0, Z + 0.3), k = K(Z), f = st === 'roar' ? 1 : st === 'low' ? 0.55 : 0.35;
  raw(`<g opacity="${f}">` + G.radial(c[0], c[1], k * 3.6, k * 0.55, [[0, '#f8b060', 0.5], [0.55, '#e07a30', 0.22], [1, '#e07a30', 0]]) + '</g>'); }
raw(BK.quiet(MURK, 232, 352, { steps: [0.07, 0.08, 0.1, 0.12], hop: 0.12 }));
// the yard seen through the door is the room's cold light focus at the vanishing point: half of it again over the quiet band
raw(YARD);

// ======================================================================== MID: low dark things behind the fighters
layer('mid');
{
  // the slaves' neck-chain staples by the nearest anvils, a dropped cage-lock, a quench tub, a basket of nails
  const Z = 10.4, k = K(Z);
  { const c = P(-2.6, 0, Z); raw(cel([[c[0] - k * 0.35, c[1]], [c[0] + k * 0.35, c[1]], [c[0] + k * 0.38, c[1] - k * 0.42], [c[0] - k * 0.38, c[1] - k * 0.42]], { Z, fill: '#2a2018', tex: 'url(#mottle)', texOp: 0.5 }) + line([[c[0] - k * 0.36, c[1] - k * 0.4], [c[0] + k * 0.36, c[1] - k * 0.4]], 1, WET, 0.45) + line([[c[0] - k * 0.37, c[1] - k * 0.2], [c[0] + k * 0.37, c[1] - k * 0.2]], 1.6, '#1a1a1e', 1)); }
  { const c = P(3.0, 0, Z + 0.6); raw(cel([[c[0] - k * 0.22, c[1]], [c[0] + k * 0.22, c[1]], [c[0] + k * 0.26, c[1] - k * 0.26], [c[0] - k * 0.26, c[1] - k * 0.26]], { Z, fill: '#3a2a1a', tex: 'url(#mottle)', texOp: 0.5 }) + BK.sulphur(c[0], c[1] - k * 0.27, k * 0.18, 6, { size: k * 0.03, col: '#5a5a60' })); }
}

// ======================================================================== FORE: the near hood's corner at the left, a near line shaft and belt at the top
layer('fore');
{
  const ZN = 4.4;
  // a near pier of the hall at the left edge (built masonry, sooted), a hoist chain and hook hanging from the near shaft
  raw(G.builtWall((s, t) => [-5.6 + s, t, ZN], 0.75, 6, '#2a221c', { ashlar: { scale: 0.7 } }) + `<path d="${pp([[-4.85, 0, ZN], [-4.85, 0, ZN + 0.6], [-4.85, 6, ZN + 0.6], [-4.85, 6, ZN]])}" fill="#120c08"/>`);
  raw(BK.chain([250, 26], [252, 150], 0, 4, '#2a2a30', { rigid: true }) + `<path d="M244 150 q8 18 16 2" stroke="${INK}" stroke-width="5" fill="none"/><path d="M244 150 q8 18 16 2" stroke="#3a3a40" stroke-width="2.6" fill="none"/>`);
  // the near line shaft across the top and a belt running down out of frame at the right
  raw(line([[-20, 26], [W + 20, 20]], 12, INK, 1) + line([[-20, 26], [W + 20, 20]], 8, '#3a3a40', 1) + line([[-20, 23], [W + 20, 17]], 1.4, '#9a9aa0', 0.5));
  raw(cel(ell([1180, 22], 18, 36, 0, 14), { Z: 3, fill: '#2a2a2e', band: 4 }) + line([[1166, 40], [1240, H + 10]], 5, INK, 1) + line([[1194, 40], [1268, H + 10]], 5, INK, 1) + line([[1180, 40], [1254, H + 10]], 2, '#4a3420', 0.6));
  raw(`<path d="${smooth([[W + 10, H + 2], [W - 30, H - 34], [W - 110, H - 30], [W - 180, H - 10], [W - 220, H + 2]], true, 0.5)}" fill="#14120f" stroke="${INK}" stroke-width="1.6"/>`);
  raw(G.sparks(40, 300, 1300, 120, 360, [WG, HOT], { len: 6 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
