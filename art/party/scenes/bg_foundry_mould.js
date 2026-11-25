// World V, the Storm Foundry: THE BELL PIT, in Living Ink. Replaces grim/bg_worlds.js room 'foundry_mould'.
// Contract as the nave: 1480 x 480 (shown at 2x); foundry_mould_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera of nave.camera.json (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Lore (bible/world_V_storm_foundry.md): a smiths' guild-city that forged bells, armour and automata. The forge fire caught
// a storm and kept it; the foundry sits inside a thunderhead and the smiths never stop.
// The place: the casting hall where the great bell was being poured when the storm struck. Behind the company the bell pit
// is sunk in the floor, the crown of the half-cast bell standing out of its loam mould with the clay runner cup beside it
// and a ladder down; over it the casting crane's jib, its chains fused by the storm into one rigid welded bar ending in the
// empty yoke where the great crucible hung. At the right, the Storm-Catcher's copper cables come down the wall on glazed clay
// insulators into the furnaces, which still burn white-gold. Through the tall broken windows the thunderhead; through the
// broken roof the rain falls into the hall in sheets, hissing on hot iron.
// Courses: FIRE blackens and glows (soot over every wall, the furnace mouths, the hot runner, slag drips like wax, embers);
// LIGHTNING scars and fuses (branching Lichtenberg burns scorched into the walls, the crane mast, the iron columns and the
// floor plates, every one clipped to its surface; chains welded rigid, a hammer welded to its anvil). The storm itself is
// shown only by rain, wet light and scorch: NO lightning is drawn anywhere (2026-11-23 ruling).
// Palette: bronze, white-gold burns and sparks, soot. No eyes, no gold (white-gold is the colour of the burns), no red.
// Round 2 (group g2, director's notes): a finished bell hangs in its frame over the anvil line so the hall reads as a bell
// foundry at a glance (the pit's crown alone read as a dome); four windows each of its own size and ruin (walled half up,
// open, barred and bent, burst) with the guild-city's roofs and chimneys beyond them (a third depth plane); pilasters and
// the founders' gallery break the flat wall into bays; the cupola stands clear of the wall with fire licking from its
// charging door and a glowing runner from its tap-hole to the pit; the floor carries plates, puddles and scorch in
// perspective. Encounters: The Casting Pit, The Master Smith (the cyclops at its great anvil).
// Usage: node scenes/bg_foundry_mould.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'V');
const W = 1480, H = 480, ROOM = 'foundry_mould';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2705, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141018' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, glow, stain, smooth, chip, tone, EM, crack, ashlar } = S;
const BK = require('./battle_li')(S);
const { line, polyS } = BK;
const G = require('./battle_kit_g2')(S, BK, { murk: '#100e0e', air: '#16141a', air0: 8, airD: 24, airMax: 0.5 });
const { ell } = require('../engine');

// ============================================================================ WORLD KIT V (the Storm Foundry)
const BRONZE = '#9a6a32', BRONZED = '#5a3e20', WG = '#f4e6b0', SOOT = '#16130f', IRON = '#34343a', STONE = '#4a4440', MURK = '#100e0e', SKY = '#3a3e48',
  WET = '#c8d0d8', HOT = '#ffb050', SAND = '#2e2620';
const dim = (col, Z, k = 1) => mix(col, MURK, Math.max(0, Math.min(0.55, (Z - 6) / 24)) * k);
// a scorch tree on a plane, burned in from the point where the strike landed (o.core: the hot white-gold core on metal)
const burn = (at, s, t, len, ang, o = {}) => BK.scorch(at, s, t, len, ang, Object.assign({ w: 0.05, depth: 4, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.2 }, o));
// a cast-iron column with riveted collars at X,Z from Y0 to Y1, radius r; struck: a scorch fern climbs it from the foot
function ironColumn(X, Z, Y0, Y1, r, o = {}) {
  const a = P(X - r, Y0, Z), b = P(X + r, Y1, Z), k = K(Z), col = dim(o.col || IRON, Z);
  let s = cel([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], { Z, fill: col, tex: 'url(#mottle)', texOp: 0.4, band: (b[0] - a[0]) * 0.35 });
  s += `<path d="M${f1(a[0] + (b[0] - a[0]) * 0.22)} ${f1(b[1])} L${f1(a[0] + (b[0] - a[0]) * 0.22)} ${f1(a[1])}" stroke="#8a90a0" stroke-width="${f1(Math.max(0.6, k * r * 0.18))}" opacity="0.35"/>`;
  for (let Y = Y0 + 0.4; Y < Y1; Y += 1.6 + R() * 0.6) { const c = P(X, Y, Z); s += cel([[a[0] - k * 0.05, c[1] - k * 0.07], [b[0] + k * 0.05, c[1] - k * 0.07], [b[0] + k * 0.05, c[1] + k * 0.07], [a[0] - k * 0.05, c[1] + k * 0.07]], { Z, fill: tone(col, 0.1), band: 1 }); for (let j = 0; j < 4; j++) s += `<circle cx="${f1(a[0] + (b[0] - a[0]) * (0.15 + j * 0.23))}" cy="${f1(c[1])}" r="${f1(Math.max(0.6, k * 0.025))}" fill="${INK}"/>`; }
  if (o.burn) s += burn((u, v) => [X - r + u, v, Z - r * 0.9], r * 0.9, Y0 + 0.1, o.burn, Math.PI / 2 + 0.15, { core: WG, coreOp: 0.5, w: 0.05 });
  if (o.wet) for (let j = 0; j < 4; j++) { const x = a[0] + (b[0] - a[0]) * (0.2 + R() * 0.6); s += `<path d="M${f1(x)} ${f1(b[1] + R() * (a[1] - b[1]) * 0.3)} l0 ${f1((a[1] - b[1]) * (0.2 + R() * 0.4))}" stroke="${WET}" stroke-width="0.6" opacity="0.35"/>`; }
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
const ZW = 18;
// ---- the hall's back wall: soot-black coursed stone, tall arched windows onto the thunderhead (no bolts: only the cloud's
// own wet light and the rain), copper cables coming down on insulators to the furnaces at the right
{
  const at = (s, t) => [-30 + s, t, ZW];
  // four windows, each its own size and ruin: walled up to half its height; open, its glass all gone; barred, the bars bent
  // by a strike; burst, its tracery hanging out and a fern burned round it
  const WIN = [[-13.8, -11.4, 3.0, 7.4, 'bricked'], [-7.4, -4.0, 2.4, 8.6, 'open'], [0.6, 2.6, 3.6, 7.0, 'bars'], [5.6, 8.0, 2.8, 8.0, 'burst']];
  const winPts = ([x0, x1, y0, y1]) => { const arc = []; for (let k = 0; k <= 14; k++) { const a = Math.PI - k / 14 * Math.PI; arc.push(P((x0 + x1) / 2 + Math.cos(a) * (x1 - x0) / 2, y1 + Math.sin(a) * (x1 - x0) / 2 * 1.1, ZW)); } return [P(x0, y0, ZW), ...arc, P(x1, y0, ZW)]; };
  const inWin = (X, Y) => WIN.some(([x0, x1, y0, y1]) => X > x0 && X < x1 && Y > y0 && Y < y1 + (x1 - x0) / 2 * 1.1 * Math.sqrt(Math.max(0, 1 - Math.pow((X - (x0 + x1) / 2) / ((x1 - x0) / 2), 2))));
  for (const w of WIN) {
    const [x0, x1, y0, y1, st] = w, op = winPts(w), cid = S.id('wn');
    raw(`<path d="${p2(op)}" fill="${SKY}"/><clipPath id="${cid}"><path d="${p2(op)}"/></clipPath><g clip-path="url(#${cid})">`);
    const c = P((x0 + x1) / 2, (y0 + y1) / 2 + 1, ZW);
    // the thunderhead's own wet glare (no bolt), cloud masses lit from within, rain streaking
    raw(G.cloudMass(c[0] + (R() - 0.5) * 30, c[1] - 30, 150, 60, '#4a5260', { lit: '#c8d0dc', dark: '#22262e', n: 4 }) + G.cloudMass(c[0] + 20, c[1] + 40, 130, 40, '#3a3e48', { lit: '#a8b0c0', dark: '#1a1c22', n: 3 }));
    raw(glow(c[0] - 10, c[1] - 30, 60, 60, '#c8d4e8', 0.4));
    // distance plane: the guild-city's roofs and chimneys beyond, black and wet, smoke leaning off them
    const base = P(0, y0 + 0.4, ZW)[1]; let rx = c[0] - 80; const roof = [[rx, base + 40]];
    while (rx < c[0] + 90) { const w2 = 10 + R() * 18, h = 6 + R() * 16; roof.push([rx, base - h * 0.4], [rx + w2 * 0.5, base - h], [rx + w2, base - h * 0.4]); if (R() < 0.4) roof.push([rx + w2 * 0.6, base - h - 4], [rx + w2 * 0.6, base - h - 14 - R() * 10], [rx + w2 * 0.75, base - h - 14 - R() * 10], [rx + w2 * 0.75, base - h * 0.5]); rx += w2; }
    roof.push([rx, base + 40]); raw(`<path d="${p2(roof)}" fill="#1a1c22"/>` + line(roof.slice(1, -1).map(([x, y]) => [x + 0.6, y + 0.6]), 0.6, '#8a94a4', 0.4));
    raw(BK.rain(90, { x0: c[0] - 70, x1: c[0] + 70, y0: 0, y1: P(0, y0, ZW)[1], slant: 0.25, len: 12, col: WET, op: 0.4 }));
    if (st === 'bricked') { const yb = y0 + (y1 - y0) * 0.55; raw(G.builtWall((s, t) => [x0 + s, y0 + t, ZW - 0.02], x1 - x0, yb - y0, '#3a302a', { ashlar: { scale: 0.4, roughP: 0.8 } })); const sk = P(x0 + 0.4, yb + 0.25, ZW); raw(cel([[sk[0], sk[1] - 6], [sk[0] + 14, sk[1] - 9], [sk[0] + 18, sk[1] + 2], [sk[0] + 2, sk[1] + 4]], { Z: ZW, fill: '#5a4a3a', band: 1.2 })); }
    raw('</g>');
    raw(`<path d="${p2(op)}" fill="none" stroke="${INK}" stroke-width="2.4"/>`);
    const m = (x0 + x1) / 2;
    if (st === 'open') raw(line([P(m - 0.55, y0, ZW), P(m - 0.55, y1 + 1.4, ZW)], 2.2, INK, 1) + line([P(m + 0.55, y0, ZW), P(m + 0.55, y1 + 1.4, ZW)], 2.2, INK, 1) + line([P(x0, y0 + 2.2, ZW), P(x1, y0 + 2.2, ZW)], 2, INK, 1) + line([P(x0, y0 + 4.4, ZW), P(x1, y0 + 4.4, ZW)], 2, INK, 1));
    if (st === 'bricked') raw(line([P(m, y0 + (y1 - y0) * 0.55, ZW), P(m, y1 + 1.2, ZW)], 2.2, INK, 1));
    if (st === 'bars') { for (let i = 1; i < 6; i++) { const X = x0 + (x1 - x0) * i / 6; if (i === 4) continue; const bend = i === 3 ? 0.35 : (R() - 0.5) * 0.08; raw(line([P(X, y0, ZW), P(X + bend, (y0 + y1) / 2, ZW), P(X, y1 + 0.8, ZW)], 1.6, INK, 1) + line([P(X, y0, ZW), P(X + bend, (y0 + y1) / 2, ZW), P(X, y1 + 0.8, ZW)].map(([x, y]) => [x - 0.6, y]), 0.6, '#8a8a90', 0.6)); } raw(BK.scorch(at, 30 + x1 - 0.5, (y0 + y1) / 2, 1.4, 0.2, { w: 0.05, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.2 })); }
    if (st === 'burst') { raw(line([P(m, y0, ZW), P(m + 0.3, y0 + 2.4, ZW), P(m + 1.0, y0 + 3.2, ZW - 0.6)], 2.4, INK, 1) + line([P(x0, y0 + 3.8, ZW), P(x0 + 0.9, y0 + 3.6, ZW), P(x0 + 1.4, y0 + 2.6, ZW - 0.4)], 2, INK, 1) + line([P(m + 0.2, y1 + 0.8, ZW), P(m - 0.2, y1 - 0.4, ZW - 0.3)], 1.8, INK, 1)); raw(BK.scorch(at, 30 + x0 + 0.1, y1, 2.0, -2.2, { w: 0.06, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.22 }) + BK.scorch(at, 30 + x1 - 0.1, y0 + 1, 1.6, 0.4, { w: 0.05, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.2 })); }
    // rain blown in over the sill: a wet dark streak down the wall, glinting
    const sl = P(x0 + 0.3, y0, ZW), sr = P(x1 - 0.3, y0, ZW), fl = P(0, 0, ZW); raw(`<path d="${p2([sl, sr, [sr[0] + 6, fl[1]], [sl[0] - 4, fl[1]]])}" fill="#08080a" opacity="0.35"/>`);
    for (let j = 0; j < 8; j++) { const x = sl[0] + R() * (sr[0] - sl[0]); raw(`<path d="M${f1(x)} ${f1(sl[1] + 2)} l${f1((R() - 0.5) * 2)} ${f1((fl[1] - sl[1]) * (0.3 + R() * 0.6))}" stroke="${WET}" stroke-width="0.6" opacity="0.3"/>`); }
  }
  const cid = S.id('bw'); const outer = pp([at(0, 0), at(60, 0), at(60, 12), at(0, 12)]);
  const holes = WIN.map(w => p2(winPts(w))).join(' ');
  raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${holes}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(G.builtWall(at, 60, 12, '#463830', { ashlar: { scale: 1.25, wscale: 1.5, roughP: 0.65, vary: 0.26 } }));
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, 12), at(0, 12)])}" fill="${SOOT}" opacity="0.35"/>` + hatch3(at, 0, 60, 0, 3.2, 0.8, { op: 0.45, ragged: 0.3 }) + hatch3(at, 0, 60, 8.5, 12, -0.7, { op: 0.4, ragged: 0.3 }));
  raw(burn(at, 41.4, 7.8, 2.6, -1.9, { w: 0.07 }) + burn(at, 18.6, 9.4, 2.2, -1.3, { w: 0.06 }) + burn(at, 24.8, 2.4, 1.6, -0.3, { w: 0.05 }) + burn(at, 33.2, 9.6, 1.8, -2.0, { w: 0.05 }));
  raw('</g>');
  for (const [x0, x1, y0] of WIN) raw(cel([P(x0 - 0.25, y0 - 0.2, ZW - 0.15), P(x1 + 0.25, y0 - 0.2, ZW - 0.15), P(x1 + 0.25, y0, ZW - 0.15), P(x0 - 0.25, y0, ZW - 0.15)], { Z: ZW, fill: dim('#5a524c', ZW) }) + line([P(x0, y0 - 0.02, ZW - 0.2), P(x1, y0 - 0.02, ZW - 0.2)], 0.8, WET, 0.45));
  // pilasters between the windows: stone piers standing proud of the wall, their inner sides in shadow; they break the wall
  // into bays and carry the roof trusses
  for (const X of [-9.6, -1.7, 4.2]) { const w = 0.9, d = 0.7, zf = ZW - d, sx = X < 0 ? X + w / 2 : X - w / 2;
    raw(`<path d="${pp([[sx, 0, zf], [sx, 0, ZW], [sx, 11, ZW], [sx, 11, zf]])}" fill="${dim('#2a221c', ZW)}"/><path d="${pp([[sx, 0, zf], [sx, 0, ZW], [sx, 11, ZW], [sx, 11, zf]])}" fill="${S.hatchB(ZW)}" opacity="0.55"/>`);
    raw(ashlar((s, t) => [X - w / 2 + s, t, zf], w, 11, dim('#6a5848', ZW), { scale: 1.5, vary: 0.15, chip: 0.4, mortar: 0.6, courses: [0.6, 0.6, 0.55, 0.65] }));
    raw(`<path d="${pp([[X - w / 2, 0, zf], [X + w / 2, 0, zf], [X + w / 2, 11, zf], [X - w / 2, 11, zf]])}" fill="${SOOT}" opacity="0.3"/>` + line([P(X - w / 2, 0, zf), P(X - w / 2, 11, zf)].map(([x, y]) => [x + 1.2, y]), 0.9, '#c8a888', 0.35) + burn((s, t) => [X - w / 2 + s, t, zf - 0.01], 0.4, 0.1, 2.2 + R(), Math.PI / 2 + (R() - 0.5) * 0.4, { w: 0.05 }));
  }
  // the founders' gallery: a timber walkway along the wall at 5.2 m with an iron rail, where the masters watched the pour
  { const Yg = 5.2, z0 = ZW - 0.2, z1 = ZW - 1.3;
    raw(`<path d="${pp([[-30, Yg, z1], [30, Yg, z1], [30, Yg - 0.25, z1], [-30, Yg - 0.25, z1]])}" fill="#2a1e14" stroke="${INK}" stroke-width="1"/>`);
    for (let X = -26; X < 26; X += 1.6) { const a = P(X, Yg - 0.25, z1), b = P(X, Yg - 1.0, z0); raw(line([a, b], 1.6, INK, 1)); }
    raw(line([P(-30, Yg + 1.0, z1), P(30, Yg + 1.0, z1)], 1.8, INK, 1) + line([P(-30, Yg + 1.0, z1), P(30, Yg + 1.0, z1)].map(([x, y]) => [x, y - 0.8]), 0.7, '#8a8a90', 0.5));
    for (let X = -28; X < 28; X += 2.2) raw(line([P(X, Yg, z1), P(X, Yg + 1.0, z1)], 1.3, INK, 1));
    raw(line([P(-30, Yg, z1), P(30, Yg, z1)], 1, '#7a6048', 0.6)); }
  // the cupola furnace at the right: a tall stone tower banded with iron, rising into the roof; its charging door high up
  // burns white-gold (above the fighters), the tap-hole at its foot glows low and dull; soot fanned up its face
  { const x0 = 9.4, x1 = 13.4, Zf = ZW - 1.4, k = K(Zf);
    raw(ashlar((s2, t) => [x0 + s2, t, Zf], x1 - x0, 10, '#4a3a30', { rough: true, scale: 0.6, vary: 0.2, chip: 0.5, mortar: 0.7, spall: 0.2 }));
    raw(`<path d="${pp([[x0, 0, Zf], [x1, 0, Zf], [x1, 10, Zf], [x0, 10, Zf]])}" fill="${SOOT}" opacity="0.3"/>` + hatch3((s2, t) => [x0 + s2, t, Zf], 0, x1 - x0, 0, 10, 0.8, { op: 0.3 }));
    raw(`<path d="${pp([[x1, 0, Zf], [x1, 0, ZW], [x1, 10, ZW], [x1, 10, Zf]])}" fill="#1a1410"/><path d="${pp([[x1, 0, Zf], [x1, 0, ZW], [x1, 10, ZW], [x1, 10, Zf]])}" fill="${S.hatchB(Zf)}" opacity="0.5"/><path d="${pp([[x1, 0, ZW], [x1 + 1.2, 0, ZW], [x1 + 1.2, 10, ZW], [x1, 10, ZW]])}" fill="${SOOT}" opacity="0.45"/>` + line([P(x0, 0, Zf), P(x0, 10, Zf)], 2.4, INK, 1) + line([P(x1, 0, Zf), P(x1, 10, Zf)], 2.4, INK, 1) + line([P(x0, 0, Zf), P(x0, 10, Zf)].map(([x, y]) => [x + 2, y]), 0.8, '#c8a070', 0.4));
    for (const Y of [1.6, 3.8, 7.0, 8.8]) raw(cel([P(x0 - 0.08, Y, Zf - 0.05), P(x1 + 0.08, Y, Zf - 0.05), P(x1 + 0.08, Y + 0.2, Zf - 0.05), P(x0 - 0.08, Y + 0.2, Zf - 0.05)], { Z: Zf, fill: '#2a2a2e', band: 1.5 }));
    const d0 = P(10.6, 4.5, Zf - 0.05), d1 = P(12.2, 6.0, Zf - 0.05);
    raw(`<path d="${p2([[d0[0], d1[1]], [d1[0], d1[1]], [d1[0], d0[1]], [d0[0], d0[1]]])}" fill="#1a0e06"/>` + EM(`<path d="${p2([[d0[0] + 3, d1[1] + 5], [d1[0] - 3, d1[1] + 5], [d1[0] - 3, d0[1] - 2], [d0[0] + 3, d0[1] - 2]])}" fill="${HOT}"/><path d="${p2([[d0[0] + 8, d1[1] + 10], [d1[0] - 8, d1[1] + 10], [d1[0] - 8, d0[1] - 4], [d0[0] + 8, d0[1] - 4]])}" fill="${WG}"/>`) + `<path d="${p2([[d0[0], d1[1]], [d1[0], d1[1]], [d1[0], d0[1]], [d0[0], d0[1]]])}" fill="none" stroke="${INK}" stroke-width="2"/>`);
    raw(glow((d0[0] + d1[0]) / 2, (d0[1] + d1[1]) / 2, 140, 110, HOT, 0.34) + glow((d0[0] + d1[0]) / 2, (d0[1] + d1[1]) / 2, 60, 50, WG, 0.3));
    // the hanging iron door, open on its chain, and the charging platform's beam under it
    raw(cel([[d1[0] + 2, d1[1] + 2], [d1[0] + k * 0.9, d1[1] - k * 0.3], [d1[0] + k * 0.95, d0[1] - k * 0.2], [d1[0] + 2, d0[1]]], { Z: Zf, fill: '#2e2e34', band: 2 }));
    raw(cel([P(x0 - 1.2, 4.3, Zf - 0.6), P(x1 + 1.0, 4.3, Zf - 0.6), P(x1 + 1.0, 4.5, Zf - 0.6), P(x0 - 1.2, 4.5, Zf - 0.6)], { Z: Zf, fill: '#3a2a1a', band: 1 }));
    for (let j = 0; j < 22; j++) { const x = d0[0] + R() * (d1[0] - d0[0]), y = d1[1] - R() * 60; raw(EM(`<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 4)} ${f1(-3 - R() * 6)}" stroke="${R() < 0.5 ? WG : HOT}" stroke-width="0.8"/>`)); }
    const tp = P(11.4, 0.4, Zf - 0.05); raw(EM(`<ellipse cx="${f1(tp[0])}" cy="${f1(tp[1])}" rx="5" ry="3" fill="${HOT}" opacity="0.6"/>`) + `<ellipse cx="${f1(tp[0])}" cy="${f1(tp[1])}" rx="5" ry="3" fill="none" stroke="${INK}" stroke-width="1"/>`);
    raw(BK.scorch((s2, t) => [x0 + s2, t, Zf - 0.06], 1.9, 8.8, 2.4, -1.7, { w: 0.06, halo: '#8a7c68', haloOp: 0.22 })); }
  // the Storm-Catcher's copper cables: two thick cables down the wall from out of frame on glazed clay insulators, into the
  // furnace crown; fused to the wall brackets where the strikes ran; burns spreading from every bracket
  for (const [X, ph] of [[11.3, 0], [12.7, 1]]) {
    const pts = []; for (let Y = 12; Y >= 6.2; Y -= 0.5) pts.push(P(X + Math.sin(Y * 0.7 + ph) * 0.06, Y, ZW - 1.5));
    raw(line(pts, K(ZW) * 0.1 + 2, INK, 1) + line(pts, K(ZW) * 0.1, '#8a5a30', 1) + line(pts.map(([x, y]) => [x - 0.8, y]), 0.8, '#d8a070', 0.5));
    for (const Y of [10.4, 8.1]) { const c = P(X, Y, ZW - 1.55); raw(cel([[c[0] - 5, c[1] - 3], [c[0] + 5, c[1] - 3], [c[0] + 4, c[1] + 3], [c[0] - 4, c[1] + 3]], { Z: ZW, fill: '#6a6a5a', band: 1 }) + `<path d="M${f1(c[0] - 4)} ${f1(c[1] - 1)} l8 0 M${f1(c[0] - 4)} ${f1(c[1] + 1)} l8 0" stroke="${INK}" stroke-width="0.5"/>` + BK.scorch((u, v) => [X + u, Y + v, ZW - 1.45], 0, 0, 0.9, -0.6 - R() * 2, { w: 0.03, depth: 3, col: '#0c0a08', halo: '#8a7c68', haloOp: 0.2 })); }
  }
  // the roof: timber trusses with iron straps along the top of the frame, torn open; rain falls through
  for (let X = -26; X < 26; X += 4.5) { const a = P(X, 9.2, ZW - 0.5), b = P(X + 4.5, 9.2, ZW - 0.5); raw(line([a, b], K(ZW) * 0.3, INK, 1) + line([a, b], K(ZW) * 0.22, dim('#3a2a1a', ZW), 1)); raw(line([P(X, 9.2, ZW - 0.5), P(X + 2.25, 11.5, ZW - 0.5)], K(ZW) * 0.2, INK, 1)); }
}
// ---- the casting crane: a great oak mast on the left of the pit rising out of frame, its jib running right over the pit;
// the chains fused by the storm into one rigid welded bar hanging plumb; the empty yoke of the crucible at its foot
{
  const Zc = 13.5, MX = -6.2, k = K(Zc);
  raw(S.cel([P(MX - 0.3, 0, Zc), P(MX + 0.3, 0, Zc), P(MX + 0.27, 14, Zc), P(MX - 0.27, 14, Zc)], { Z: Zc, fill: dim('#4a3420', Zc), tex: 'url(#mottle)', texOp: 0.5, band: k * 0.2 }));
  for (let Y = 0.8; Y < 10; Y += 2.2) { const c = P(MX, Y, Zc); raw(cel([[c[0] - k * 0.33, c[1] - k * 0.06], [c[0] + k * 0.33, c[1] - k * 0.06], [c[0] + k * 0.33, c[1] + k * 0.06], [c[0] - k * 0.33, c[1] + k * 0.06]], { Z: Zc, fill: IRON, band: 1 })); }
  raw(burn((u, v) => [MX - 0.28 + u, v, Zc - 0.3], 0.3, 6.8, 3.6, -1.55, { w: 0.06, depth: 5 }));
  // the jib: a heavy beam from the mast to over the pit, with a raking strut
  const j0 = P(MX, 7.0, Zc), j1 = P(1.9, 7.0, Zc); raw(cel([[j0[0], j0[1] - k * 0.22], [j1[0], j1[1] - k * 0.2], [j1[0], j1[1] + k * 0.2], [j0[0], j0[1] + k * 0.22]], { Z: Zc, fill: dim('#4a3420', Zc), tex: 'url(#mottle)', texOp: 0.5 }));
  raw(line([P(MX, 3.8, Zc), P(MX + 3.0, 6.8, Zc)], k * 0.26 + 2, INK, 1) + line([P(MX, 3.8, Zc), P(MX + 3.0, 6.8, Zc)], k * 0.26, dim('#3e2c1a', Zc), 1));
  // the pulley block and the fused chains: three falls welded into one rigid mass, the links run together, scorched
  const pb = P(0.6, 6.7, Zc); raw(cel([[pb[0] - k * 0.25, pb[1] - k * 0.1], [pb[0] + k * 0.25, pb[1] - k * 0.1], [pb[0] + k * 0.2, pb[1] + k * 0.45], [pb[0] - k * 0.2, pb[1] + k * 0.45]], { Z: Zc, fill: IRON, band: 2 }) + `<circle cx="${f1(pb[0])}" cy="${f1(pb[1] + k * 0.15)}" r="${f1(k * 0.13)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  for (const dx of [-0.12, 0, 0.12]) raw(BK.chain([pb[0] + dx * k, pb[1] + k * 0.45], [pb[0] + dx * k * 0.6, P(0, 3.2, Zc)[1]], 0, k * 0.07, '#3a3a40', { rigid: true }));
  { const t = P(0.6, 3.25, Zc), b = P(0.6, 5.6, Zc); raw(`<path d="M${f1(t[0] - k * 0.2)} ${f1(t[1])} L${f1(t[0] + k * 0.2)} ${f1(t[1])} L${f1(b[0] + k * 0.1)} ${f1(b[1])} L${f1(b[0] - k * 0.1)} ${f1(b[1])} Z" fill="#1a1a1e" opacity="0.6"/>`);
    raw(BK.scorch((u, v) => [0.45 + u, 3.3 + v, Zc - 0.1], 0.1, 0, 2.2, 1.5, { w: 0.03, depth: 2, col: '#0c0a08', core: WG, coreOp: 0.6 })); }
  // the yoke where the crucible hung: an iron bail, empty, its trunnion hooks open
  const y0 = P(0.6, 3.2, Zc); raw(`<path d="M${f1(y0[0] - k * 0.9)} ${f1(y0[1] + k * 0.9)} L${f1(y0[0] - k * 0.85)} ${f1(y0[1] + k * 0.1)} Q${f1(y0[0])} ${f1(y0[1] - k * 0.35)} ${f1(y0[0] + k * 0.85)} ${f1(y0[1] + k * 0.1)} L${f1(y0[0] + k * 0.9)} ${f1(y0[1] + k * 0.9)}" stroke="${INK}" stroke-width="${f1(k * 0.14 + 2)}" fill="none"/><path d="M${f1(y0[0] - k * 0.9)} ${f1(y0[1] + k * 0.9)} L${f1(y0[0] - k * 0.85)} ${f1(y0[1] + k * 0.1)} Q${f1(y0[0])} ${f1(y0[1] - k * 0.35)} ${f1(y0[0] + k * 0.85)} ${f1(y0[1] + k * 0.1)} L${f1(y0[0] + k * 0.9)} ${f1(y0[1] + k * 0.9)}" stroke="${IRON}" stroke-width="${f1(k * 0.14)}" fill="none"/>`);
  for (const sg of [-1, 1]) raw(`<path d="M${f1(y0[0] + sg * k * 0.9)} ${f1(y0[1] + k * 0.9)} q${f1(sg * k * 0.15)} ${f1(k * 0.15)} 0 ${f1(k * 0.25)}" stroke="${INK}" stroke-width="${f1(k * 0.08)}" fill="none"/>`);
}
// ---- the finished bell hanging in its frame (left, above the anvil line): the hall reads as a bell foundry from here. A
// heavy timber frame, the bell on its headstock, bronze with a green bloom, an inscription band, a struck fern burned down
// its waist; the clapper hanging below the lip
{
  const Zb = 12.4, Xb = -9.4, k = K(Zb), lip = 3.3, Hb = 1.55, top = lip + Hb;
  raw(G.timber([Xb - 1.6, 0, Zb], [Xb - 1.55, 6.0, Zb], 0.36, { col: '#4a3420' }) + G.timber([Xb + 1.6, 0, Zb], [Xb + 1.55, 6.0, Zb], 0.36, { col: '#4a3420' }) + G.timber([Xb - 2.0, 5.9, Zb], [Xb + 2.0, 5.95, Zb], 0.42, { col: '#4a3420' }) + G.timber([Xb - 1.55, 4.6, Zb], [Xb - 0.6, 5.9, Zb], 0.22, { col: '#3e2c1a' }) + G.timber([Xb + 1.55, 4.6, Zb], [Xb + 0.6, 5.9, Zb], 0.22, { col: '#3e2c1a' }));
  raw(G.timber([Xb - 0.7, top + 0.3, Zb - 0.1], [Xb + 0.7, top + 0.3, Zb - 0.1], 0.3, { col: '#3a2818' }) + line([P(Xb - 0.25, top + 0.3, Zb - 0.12), P(Xb - 0.25, 5.9, Zb - 0.12)], 2, INK, 1) + line([P(Xb + 0.25, top + 0.3, Zb - 0.12), P(Xb + 0.25, 5.9, Zb - 0.12)], 2, INK, 1));
  const prof = [[0, 0.86], [0.05, 0.84], [0.12, 0.74], [0.25, 0.62], [0.42, 0.55], [0.6, 0.52], [0.78, 0.5], [0.9, 0.45], [0.97, 0.36], [1.0, 0.2]];
  const L = prof.map(([u, w]) => P(Xb - w * Hb * 0.55, lip + u * Hb, Zb)), Rr = prof.map(([u, w]) => P(Xb + w * Hb * 0.55, lip + u * Hb, Zb)).reverse();
  const outl = [...L, ...Rr];
  raw(cel(outl, { Z: Zb, fill: '#7a5428', tex: 'url(#mottle)', texOp: 0.45, band: k * 0.18 }));
  raw(`<path d="${p2([...prof.map(([u, w]) => P(Xb + w * Hb * 0.12, lip + u * Hb, Zb)), ...Rr.slice().reverse().reverse()])}" fill="${S.hatchA(Zb)}" opacity="0.45"/>`);
  raw(line(L.slice(1, 8).map(([x, y]) => [x + 2.5, y]), 1.6, '#e8c088', 0.55));
  for (const u of [0.07, 0.11, 0.82, 0.88]) { const a = P(Xb - (u < 0.5 ? 0.8 : 0.48) * Hb * 0.55, lip + u * Hb, Zb), b = P(Xb + (u < 0.5 ? 0.8 : 0.48) * Hb * 0.55, lip + u * Hb, Zb); raw(`<path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2)} ${f1(a[1] + k * 0.05)} ${f1(b[0])} ${f1(b[1])}" stroke="${INK}" stroke-width="1" fill="none" opacity="0.75"/>`); }
  { const a = P(Xb - 0.42 * Hb, lip + 0.85 * Hb, Zb); let d = ''; for (let i = 0; i < 9; i++) d += `M${f1(a[0] + 4 + i * k * 0.07)} ${f1(a[1] + k * 0.02)} l${f1(k * 0.02)} ${f1(-k * 0.035)} l${f1(k * 0.02)} ${f1(k * 0.035)} `; raw(`<path d="${d}" stroke="#2a1c0c" stroke-width="0.8" fill="none" opacity="0.8"/>`); }
  for (let j = 0; j < 6; j++) { const x = L[3][0] + R() * (Rr[3][0] - L[3][0]); raw(`<path d="M${f1(x)} ${f1(P(0, lip + 0.9 * Hb, Zb)[1])} q2 ${f1(k * 0.3)} -1 ${f1(k * 0.7)}" stroke="#3a5a3a" stroke-width="${f1(1 + R())}" fill="none" opacity="0.5"/>`); }
  raw(BK.scorch((s, t) => [Xb - 0.3 + s, lip + t, Zb - 0.6], 0.2, Hb * 0.95, 1.2, -1.45, { w: 0.03, depth: 3, col: '#140c06', halo: '#3a2a18', haloOp: 0.3, core: WG, coreOp: 0.45 }));
  raw(cel(ell(P(Xb, lip + Hb + 0.06, Zb), k * 0.26, k * 0.08, 0, 12), { Z: Zb, fill: '#5a3e20', band: 2 }));
  for (const dx of [-0.15, 0.15]) { const c = P(Xb + dx, lip + Hb + 0.1, Zb); raw(`<path d="M${f1(c[0] - k * 0.07)} ${f1(c[1])} q${f1(k * 0.07)} ${f1(-k * 0.28)} ${f1(k * 0.14)} 0" stroke="${INK}" stroke-width="${f1(k * 0.07 + 1.6)}" fill="none"/><path d="M${f1(c[0] - k * 0.07)} ${f1(c[1])} q${f1(k * 0.07)} ${f1(-k * 0.28)} ${f1(k * 0.14)} 0" stroke="#6a4a24" stroke-width="${f1(k * 0.07)}" fill="none"/>`); }
  { const a = P(Xb, lip + 0.2, Zb - 0.3), b = P(Xb + 0.05, lip - 0.25, Zb - 0.3); raw(line([a, b], 2.4, INK, 1) + cel(ell([b[0], b[1]], k * 0.07, k * 0.1, 0, 10), { Z: Zb, fill: '#3a3634', band: 1 })); }
}
// ---- the cupola's tap-hole running: a clay runner across the floor from the furnace foot to the pit, its bronze still
// glowing dull under a black crust; fire licking out of the charging door above
{
  const pts = []; for (let u = 0; u <= 1.001; u += 0.1) pts.push(P(11.4 + (2.9 - 11.4) * u, 0.02, 16.4 + (12.4 - 16.4) * u + Math.sin(u * 3) * 0.4));
  raw(line(pts, 6, '#2a1c12', 1) + line(pts, 3.2, INK, 1) + EM(line(pts, 1.6, HOT, 0.7)) + line(pts.map(([x, y]) => [x, y - 2.5]), 0.8, '#8a6a48', 0.5));
  G.fireAt(11.4, 6.0, 16.5, 1.2, 1.1, { n: 6, gr: 2.5, gop: 0.3, gcol: HOT });
}
// ---- rain falling in through the broken roof in sheets, wet light on it; splashes and puddles where it lands
raw(BK.rain(900, { x0: 300, x1: 1300, y0: 0, y1: 360, slant: 0.18, len: 16, col: WET, op: 0.3, dens: (x, y) => (0.35 + 0.65 * Math.max(0, Math.sin((x - 300) / 1000 * Math.PI * 3))) * (y < 230 ? 1 : 0.45) }));
// ---- the quiet band behind the fighters
raw(G.frameDark(1000, 170, 820, 300, [[1.0, 0.22], [0.8, 0.18]]));
raw(BK.quiet(MURK, 230, 350, { steps: [0.22, 0.22, 0.24, 0.26], hop: 0.2 }));
// ---- the casting floor: black moulding sand packed hard, iron plates laid over it in the walkways, wet in the patch under
// the broken roof (puddles taking the furnace glow and the cold window light), scorch ferns burned across the plates, slag
{
  const at = (s, t) => [-30 + s, 0, 3.6 + t], Lz = ZW - 3.6;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="${SAND}"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#speck)" opacity="0.5"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.5"/>`);
  // the iron plates: a walkway of rough cast plates of differing size, bolted, edges lifted
  for (let Z = 3.8; Z < 10.6;) { const d = 0.9 + R() * 0.6; for (let X = -14 + R() * 0.6; X < 14;) { const w = 1.1 + R() * 0.9, q = [P(X + 0.03, 0.005, Z + d - 0.03), P(X + w - 0.03, 0.005, Z + d - 0.03), P(X + w - 0.03, 0.005, Z + 0.03), P(X + 0.03, 0.005, Z + 0.03)];
      raw(cel(chip(q, 0.2), { Z, fill: tone('#34302e', 0.18), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(0.8, K(Z) * 0.015), inkW: 0.6, heavy: 0.9 }));
      for (const [u, v] of [[0.1, 0.15], [0.9, 0.15], [0.1, 0.85], [0.9, 0.85]]) { const c = P(X + w * u, 0.01, Z + d * v); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(Math.max(0.6, K(Z) * 0.025))}" ry="${f1(Math.max(0.4, K(Z) * 0.01))}" fill="${INK}"/>`); }
      X += w; } Z += d; }
  // puddles in the wet patch: dark mirrors with the window light and the furnace glow broken in them, rain rings
  for (let i = 0; i < 12; i++) { const X = -9 + R() * 18, Z = 5 + R() * 6, [x, y] = P(X, 0.01, Z), rx = K(Z) * (0.5 + R() * 1.2);
    raw(`<path d="${smooth(S.blobST(x, y, rx * 2, rx * 0.35, 12, 0.4), true, 0.6)}" fill="#0a0c10" opacity="0.7"/>`);
    for (let j = 0; j < 3; j++) raw(`<path d="M${f1(x - rx * 0.6 + R() * rx)} ${f1(y - rx * 0.05 + j * 2)} l${f1(rx * 0.4)} 0" stroke="${R() < 0.5 ? WET : HOT}" stroke-width="0.8" opacity="0.4"/>`);
    raw(BK.ripples(x + (R() - 0.5) * rx, y, rx * 0.3, 2, WET, 0.45)); }
  raw(BK.splashes(at, 14, 46, 1.5, 8, 120, WET));
  // scorch ferns burned across the plates from strikes that came down the crane and the columns
  raw(burn((s, t) => [s, 0.012, t], -5.0, 11.8, 3.2, -1.9, { w: 0.06, depth: 5, core: WG, coreOp: 0.35 }) + burn((s, t) => [s, 0.012, t], 8.6, 9.4, 2.6, -2.6, { w: 0.05 }) + burn((s, t) => [s, 0.012, t], -11.5, 8.2, 2.2, -0.6, { w: 0.05 }));
  // slag: drips and splashes of black glassy metal, some still glowing at the heart; spark embers
  for (let i = 0; i < 40; i++) { const X = -13 + R() * 26, Z = 4 + R() * 12, [x, y] = P(X, 0.01, Z), r = K(Z) * (0.04 + R() * 0.1); raw(`<path d="${smooth(S.blobST(x, y, r * 2, r * 0.6, 8, 0.6), true, 0.6)}" fill="#141210" stroke="${INK}" stroke-width="0.5"/>` + (R() < 0.25 ? EM(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(0.6, r * 0.25))}" fill="${HOT}"/>`) : `<path d="M${f1(x - r * 0.5)} ${f1(y - r * 0.15)} l${f1(r * 0.5)} 0" stroke="#8a8a90" stroke-width="0.5" opacity="0.6"/>`)); }
  raw(occBand((s, t) => [-30 + s, 0, ZW - t], 60, 2, { op: 0.4, cross: true }) + glow(P(11, 0, 13)[0], P(11, 0, 13)[1], 260, 40, HOT, 0.14));
}
// ---- the bell pit behind the fighters (kept low and dark: it is in their band): a round pit in the floor, its rim of
// rammed loam, the crown of the half-cast bell standing out of the mould with its canons, a crack glowing; the runner cup;
// a ladder down into it
{
  const Zp = 12.4, cx = 1.0, k = K(Zp), c = P(cx, 0, Zp), rx = k * 2.4, ry = rx * (652 * 1.2 / Zp / Zp) / k * 0.5 + 3;
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx + 6)}" ry="${f1(ry + 3)}" fill="#3a2e24" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1] + 1)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#060505"/>`);
  // the bell's crown: shoulder and canons (the hanging loops) of bronze, dark with fire, one canon fused and scorched
  const bc = [c[0], c[1] - 1], bw = k * 1.15;
  // the shoulder rises from the loam as a dome (cast mouth-down), the crown plate on top, two thick canons; dark bronze
  // with a black-green bloom, lit only along its upper-left rim
  const dome = []; for (let j = 0; j <= 16; j++) { const u = j / 16, a = Math.PI - u * Math.PI; dome.push([bc[0] + Math.cos(a) * bw, bc[1] - Math.sin(a) * k * 0.62 * (1 - 0.25 * Math.pow(Math.cos(a), 4))]); }
  raw(cel([...dome, [bc[0] + bw, bc[1] + 3], [bc[0] - bw, bc[1] + 3]], { Z: Zp, fill: '#4a3620', tex: 'url(#mottle)', texOp: 0.5, band: bw * 0.3 }));
  raw(`<path d="${p2([...dome.slice(8), [bc[0] + bw, bc[1] + 3], [bc[0], bc[1] + 3]])}" fill="${S.hatchA(Zp)}" opacity="0.5"/>` + line(dome.slice(2, 8).map(([x, y]) => [x + 2, y + 2]), 1, '#c89a58', 0.55));
  raw(cel([[bc[0] - bw * 0.32, bc[1] - k * 0.6], [bc[0] + bw * 0.32, bc[1] - k * 0.6], [bc[0] + bw * 0.3, bc[1] - k * 0.68], [bc[0] - bw * 0.3, bc[1] - k * 0.68]], { Z: Zp, fill: '#3e2e1a', band: 1 }));
  for (const dx of [-0.14, 0.14]) raw(`<path d="M${f1(bc[0] + dx * k - k * 0.07)} ${f1(bc[1] - k * 0.68)} q${f1(k * 0.07)} ${f1(-k * 0.3)} ${f1(k * 0.14)} 0" stroke="${INK}" stroke-width="${f1(k * 0.08 + 1.6)}" fill="none"/><path d="M${f1(bc[0] + dx * k - k * 0.07)} ${f1(bc[1] - k * 0.68)} q${f1(k * 0.07)} ${f1(-k * 0.3)} ${f1(k * 0.14)} 0" stroke="#3e2e1a" stroke-width="${f1(k * 0.08)}" fill="none"/>`);
  for (let j = 0; j < 5; j++) { const x = bc[0] - bw * 0.7 + j * bw * 0.35; raw(`<path d="M${f1(x)} ${f1(bc[1] - k * 0.45)} q${f1(2)} ${f1(k * 0.2)} ${f1(-1)} ${f1(k * 0.42)}" stroke="#2a3a2a" stroke-width="${f1(1 + R())}" fill="none" opacity="0.5"/>`); }
  
  raw(BK.scorch((u, v) => [cx - 0.8 + u, 0.3 + v, Zp - 0.2], 0.2, 0.1, 1.2, 0.2, { w: 0.025, depth: 3, col: '#0c0a08', core: WG, coreOp: 0.4 }));
  raw(EM(line([[bc[0] + bw * 0.3, bc[1] - k * 0.38], [bc[0] + bw * 0.4, bc[1] - k * 0.2], [bc[0] + bw * 0.35, bc[1]]], 1.2, HOT, 0.8)));
  // the runner cup: a clay funnel standing on the mould's rim, bronze overflow frozen down its side like wax
  const rc = P(cx + 2.0, 0, Zp - 0.3); raw(cel([[rc[0] - k * 0.25, rc[1] - k * 0.45], [rc[0] + k * 0.25, rc[1] - k * 0.45], [rc[0] + k * 0.12, rc[1]], [rc[0] - k * 0.12, rc[1]]], { Z: Zp, fill: '#5a4030', band: 1.5 }) + `<path d="M${f1(rc[0] + k * 0.1)} ${f1(rc[1] - k * 0.45)} q${f1(k * 0.08)} ${f1(k * 0.2)} ${f1(k * 0.02)} ${f1(k * 0.4)}" stroke="${mix(BRONZE, MURK, 0.2)}" stroke-width="${f1(k * 0.06)}" fill="none"/>`);
  // the ladder leaning down into the pit
  raw(line([P(cx - 1.9, 1.3, Zp - 0.5), [c[0] - rx * 0.55, c[1] + 2]], 2, INK, 1) + line([P(cx - 1.6, 1.35, Zp - 0.5), [c[0] - rx * 0.4, c[1] + 2]], 2, INK, 1));
  for (let j = 1; j < 5; j++) { const u = j / 5, A = P(cx - 1.9, 1.3, Zp - 0.5), B = P(cx - 1.6, 1.35, Zp - 0.5), A2 = [c[0] - rx * 0.55, c[1] + 2], B2 = [c[0] - rx * 0.4, c[1] + 2]; raw(line([[A[0] + (A2[0] - A[0]) * u, A[1] + (A2[1] - A[1]) * u], [B[0] + (B2[0] - B[0]) * u, B[1] + (B2[1] - B[1]) * u]], 1.4, '#3a2a1a', 1)); }
  raw(glow(bc[0] + bw * 0.4, bc[1] - k * 0.2, k * 0.6, k * 0.3, HOT, 0.2));
}

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  // the anvil line at the left: two anvils on their blocks, the slaves' neck chains run to a ring in the floor; one hammer
  // welded to its anvil by a strike, a fern burned across both; a quench trough with rain in it; tongs; a mould half-broken
  const Z = 10.4, k = K(Z);
  for (const [X, fused] of [[-9.6, true], [-6.9, false]]) {
    const c = P(X, 0, Z); raw(cel([[c[0] - k * 0.22, c[1]], [c[0] + k * 0.22, c[1]], [c[0] + k * 0.2, c[1] - k * 0.5], [c[0] - k * 0.2, c[1] - k * 0.5]], { Z, fill: '#3a2c20', tex: 'url(#mottle)', texOp: 0.5 }));
    const t = c[1] - k * 0.5; raw(cel([[c[0] - k * 0.45, t - k * 0.25], [c[0] + k * 0.3, t - k * 0.25], [c[0] + k * 0.62, t - k * 0.2], [c[0] + k * 0.3, t - k * 0.12], [c[0] + k * 0.15, t], [c[0] - k * 0.15, t], [c[0] - k * 0.3, t - k * 0.12]], { Z, fill: '#2e2e34', band: 2 }));
    if (fused) { raw(line([[c[0] - k * 0.1, t - k * 0.28], [c[0] + k * 0.4, t - k * 0.75]], k * 0.06 + 1.5, INK, 1) + cel([[c[0] - k * 0.2, t - k * 0.36], [c[0] + k * 0.05, t - k * 0.36], [c[0] + k * 0.05, t - k * 0.24], [c[0] - k * 0.2, t - k * 0.24]], { Z, fill: '#3a3a40' }));
      raw(EM(`<path d="M${f1(c[0] - k * 0.15)} ${f1(t - k * 0.25)} l${f1(k * 0.15)} 0" stroke="${WG}" stroke-width="1.2" opacity="0.7"/>`) + BK.scorch((u, v) => [X - 0.3 + u, 0.5 + v, Z - 0.25], 0.25, 0.0, 0.7, -1.5, { w: 0.02, depth: 3, col: '#0c0a08' })); }
    raw(BK.chain([c[0] + k * 0.2, c[1] - k * 0.1], [c[0] + k * 1.1, c[1] + 2], k * 0.06, k * 0.04, '#3a3a40'));
  }
  { const c = P(-3.6, 0, Z - 0.3); raw(cel([[c[0] - k * 0.6, c[1]], [c[0] + k * 0.6, c[1]], [c[0] + k * 0.62, c[1] - k * 0.32], [c[0] - k * 0.62, c[1] - k * 0.32]], { Z, fill: '#3a2c1e', tex: 'url(#mottle)', texOp: 0.5 }) + line([[c[0] - k * 0.58, c[1] - k * 0.3], [c[0] + k * 0.58, c[1] - k * 0.3]], 1, WET, 0.5)); }
  // a broken loam mould for a small bell, its halves split open, the dark cope inside
  { const c = P(6.6, 0, Z + 0.2); raw(cel([[c[0] - k * 0.5, c[1]], [c[0] - k * 0.45, c[1] - k * 0.5], [c[0] - k * 0.1, c[1] - k * 0.6], [c[0] - k * 0.05, c[1]]], { Z, fill: '#5a4434', tex: 'url(#mottle)', texOp: 0.5 }) + cel([[c[0] + k * 0.05, c[1]], [c[0] + k * 0.15, c[1] - k * 0.55], [c[0] + k * 0.5, c[1] - k * 0.4], [c[0] + k * 0.55, c[1]]], { Z, fill: '#4a3628', tex: 'url(#mottle)', texOp: 0.5 })); }
}

// ======================================================================== FORE: framing over the fighters
layer('fore');
{
  const ZN = 4.3;
  // two cast-iron hall columns at the edges, riveted, wet, the left one struck: a white-gold fern burned up it from the
  // floor; a fused chain hanging rigid at the top left; rain sheeting past in the near air at the top
  raw(ironColumn(-4.95, ZN, -0.5, 6, 0.3, { burn: 2.6, wet: true }) + ironColumn(4.9, ZN, -0.5, 6, 0.3, { wet: true }));
  raw(BK.chain([200, -5], [212, 120], 0, 5, '#2a2a30', { rigid: true }) + BK.scorch((u, v) => [u, v, ZN], -3.6, 3.6, 0.0001, 0, { w: 0.001, depth: 0 }));
  { const e = [212, 120]; raw(`<path d="M${f1(e[0] - 8)} ${f1(e[1])} q8 14 16 0" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${f1(e[0] - 8)} ${f1(e[1])} q8 14 16 0" stroke="#2a2a30" stroke-width="2.6" fill="none"/>`); }
  raw(BK.rain(260, { x0: 0, x1: W, y0: -10, y1: 200, slant: 0.2, len: 28, w: 0.9, col: WET, op: 0.25 }));
  // slag heaps at the bottom corners, crusted black and glassy, a pourer's wooden clog fallen by the right one
  raw(`<path d="${smooth([[-10, H + 2], [20, H - 34], [90, H - 46], [170, H - 24], [240, H + 2]], true, 0.5)}" fill="#14120f" stroke="${INK}" stroke-width="1.6"/><path d="${smooth([[W + 10, H + 2], [W - 30, H - 40], [W - 110, H - 36], [W - 200, H - 14], [W - 250, H + 2]], true, 0.5)}" fill="#14120f" stroke="${INK}" stroke-width="1.6"/>`);
  for (let i = 0; i < 16; i++) { const x = R() < 0.5 ? 20 + R() * 200 : W - 230 + R() * 210, y = H - 10 - R() * 28; raw(`<path d="M${f1(x - 6)} ${f1(y)} l${f1(5 + R() * 6)} ${f1(-2 - R() * 3)}" stroke="#8a8a90" stroke-width="0.8" opacity="0.5"/>` + (R() < 0.3 ? EM(`<circle cx="${f1(x)}" cy="${f1(y)}" r="1.4" fill="${HOT}"/>`) : '')); }
  { const c = [W - 150, H - 36]; raw(cel([[c[0] - 22, c[1]], [c[0] + 20, c[1] - 2], [c[0] + 24, c[1] - 10], [c[0] - 10, c[1] - 14], [c[0] - 24, c[1] - 8]], { Z: 4, fill: '#4a3420', band: 2 })); }
  // sparks: short hot streaks off the furnaces' draught, never arcs
  for (let i = 0; i < 30; i++) { const x = 1000 + R() * 460, y = 120 + R() * 220, l = 3 + R() * 6; raw(EM(`<path d="M${f1(x)} ${f1(y)} l${f1(-l * 0.4)} ${f1(-l)}" stroke="${R() < 0.5 ? WG : HOT}" stroke-width="${f1(0.6 + R() * 0.6)}" opacity="0.8"/>`)); }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
