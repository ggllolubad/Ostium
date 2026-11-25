// World VI, the Stormwrack Coast: THE WRECKERS' STRAND, in Living Ink. Replaces grim/bg_worlds.js room 'coast_cliffs'.
// Contract as the nave: 1480 x 480 (shown at 2x); coast_cliffs_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera of nave.camera.json (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Lore (bible/world_VI_stormwrack_coast.md): a wreckers' coast that lived by luring ships onto the rocks. The storm never
// ends, and the false lights became true lightning. Wreckage from the Drowned Kingdom washes up here.
// The place: the strand under the wreckers' cliff, in the storm that never ends. The company stands on wet sand and
// shingle. Up the cliff at the left the wreckers' false lamp burns on its pole on a ledge, where a ship would take it for a
// harbour light; out on the headland at the right the gibbet stands against the sky with its wrecker in irons (the highest
// metal for miles), and beyond it on the far point a lighthouse burns in the wrong place. Behind the company lie the black
// ribs of a wreck broken on the rocks, its iron knees fused, and the wreckers' salvage heaped above the tide line: casks,
// bales, a stove chest, a grapnel on its line, and a verdigris-green bronze lantern from a Drowned Kingdom ship.
// Courses: LIGHTNING scars and fuses (branching burns on the cliff, the wreck's planks and the gibbet post; the ribs' iron
// knees and the gibbet's irons fused into black welds; fulgurites, glassy tubes of fused sand, branching in the beach);
// WATER soaks and barnacles (surf, spray, rain, kelp heaped on the tide line, barnacles on every rock and rib, everything
// running wet). The storm is shown by rain, spray and wet light: NO lightning is drawn anywhere (2026-11-23 ruling).
// Palette: slate grey, white surf, lamp yellow. No eyes, no gold, no red.
// Round 2 (group g2, director's notes): the wreck now reads as a ship (a whole planked stern with wale, gunport, transom,
// rudder and mizzen stump; bare frames only amidships; the bow's stem lying apart), not as ribs; the cliff is built of
// slate blocks with real ledges that stand out and cast shadow, and the harpies' roost is on them (driftwood nests with
// bones, rope and wreck-rag, feathers, guano streaks) for The Harpy Rocks and The Matron's Roost; the strand carries ripple
// marks and runnels converging to the sea, shells, and the wreckers' boot tracks to the salvage.
// Usage: node scenes/bg_coast_cliffs.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VI');
const W = 1480, H = 480, ROOM = 'coast_cliffs';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2806, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141a20' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, glow, stain, smooth, chip, tone, EM, crack } = S;
const BK = require('./battle_li')(S);
const { line, polyS } = BK;
const G = require('./battle_kit_g2')(S, BK, { murk: '#121619', air: '#6a747a', air0: 10, airD: 90, airMax: 0.7 });
const { ell } = require('../engine');

// ============================================================================ WORLD KIT VI (the Stormwrack Coast)
const SLATE = '#4a5258', SLATED = '#262c32', SURF = '#e8ecea', LAMPY = '#e8c860', SAND = '#6a665a', WET = '#c8d0d4', MURK = '#121619', SKY = '#5a646c', KELP = '#2e3624', WOOD = '#2e2a26', VERD = '#4f7d6c';
const haze = (col, Z, k = 1) => mix(col, '#6a747a', Math.max(0, Math.min(0.75, (Z - 10) / 90)) * k);   // rain haze lifts the distance
// a slate rock mass from screen polygon points: faceted, laminated (slate's cleavage lines slanting), barnacle band low,
// wet sheen on the lit facets
function slateRock(pts, Z, o = {}) {
  const col = haze(o.col || SLATE, Z);
  let s = cel(chip(pts, 0.4), { Z, fill: tone(col, 0.12), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(1.5, K(Z) * 0.12) });
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), cid = S.id('sr');
  s += `<clipPath id="${cid}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${cid})">`;
  for (let k = 0; k < (x1 - x0) / 7 + 3; k++) { const x = x0 + R() * (x1 - x0); s += `<path d="M${f1(x)} ${f1(y0)} l${f1((y1 - y0) * 0.55)} ${f1(y1 - y0)}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, K(Z) * 0.01))}" opacity="${f1(0.25 + R() * 0.3)}"/>`; }
  if (o.facets) for (let k = 0; k < o.facets; k++) { const cx = x0 + R() * (x1 - x0), cy = y0 + R() * (y1 - y0), w = 20 + R() * 70, h = 15 + R() * 50, q = [[cx - w / 2, cy - h * 0.3], [cx + w * 0.2, cy - h / 2], [cx + w / 2, cy + h * 0.1], [cx - w * 0.1, cy + h / 2]], t = R();
    s += `<path d="${p2(chip(q, 0.5))}" fill="${t > 0.6 ? mix(col, '#c8d0d4', 0.12) : mix(col, INK, 0.25)}" stroke="${INK}" stroke-width="0.6" stroke-opacity="0.6"/>` + (t < 0.4 ? `<path d="${p2(q)}" fill="${S.hatchA(Z)}" opacity="0.35"/>` : `<path d="M${f1(q[0][0] + 1)} ${f1(q[0][1] + 1)} L${f1(q[1][0])} ${f1(q[1][1] + 1)}" stroke="${WET}" stroke-width="0.8" opacity="0.4"/>`); }
  s += `<path d="${p2([[x0 + (x1 - x0) * 0.55, y0], [x1, y0], [x1, y1], [x0 + (x1 - x0) * 0.35, y1]])}" fill="${S.hatchA(Z)}" opacity="0.4"/>`;
  if (o.barn) { const by = y1 - (y1 - y0) * o.barn; s += `<rect x="${f1(x0)}" y="${f1(by)}" width="${f1(x1 - x0)}" height="${f1(y1 - by)}" fill="#1a2018" opacity="0.4"/>` + BK.blisters((x0 + x1) / 2, (by + y1) / 2, (x1 - x0) * 0.45, Math.round((x1 - x0) / 5), '#6e6e64', { size: Math.max(0.6, K(Z) * 0.014), flat: 0.25 }); }
  s += `</g>`;
  for (let k = 0; k < 3; k++) { const i = Math.floor(R() * (pts.length - 1)); if (pts[i][1] < y0 + (y1 - y0) * 0.5) s += `<path d="M${f1(pts[i][0] + 2)} ${f1(pts[i][1] + 2)} L${f1(pts[i + 1][0] + 1)} ${f1(pts[i + 1][1] + 2)}" stroke="${WET}" stroke-width="0.9" opacity="0.45"/>`; }
  return s;
}
// a surf line: a breaking wave's white crest along screen points, foam spilling forward, spray thrown up and blown right
function surf(pts, h, o = {}) {
  let s = ''; const top = pts.map(([x, y], i) => [x, y - h * (0.6 + 0.4 * Math.sin(i * 1.3 + (o.ph || 0))) * (0.7 + R() * 0.5)]);
  s += `<path d="${smooth([...top, ...pts.slice().reverse()], true, 0.6)}" fill="${o.col || SURF}" opacity="${o.op ?? 0.85}"/>`;
  s += `<path d="${smooth(top, false, 0.6)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.5" stroke-dasharray="10 4 3 5"/>`;
  s += `<path d="${smooth(pts.map(([x, y]) => [x, y - 1]), false, 0.6)}" stroke="${mix(SLATED, INK, 0.3)}" stroke-width="${f1(Math.max(1, h * 0.25))}" fill="none" opacity="0.6"/>`;
  for (let k = 0; k < pts.length * (o.spray ?? 2); k++) { const i = Math.floor(R() * top.length), [x, y] = top[i], l = h * (0.6 + R() * 1.4); s += `<path d="M${f1(x)} ${f1(y)} q${f1(l * 0.2)} ${f1(-l * 0.8)} ${f1(l * 0.9)} ${f1(-l * 0.9)}" stroke="${SURF}" stroke-width="${f1(Math.max(0.5, h * 0.12))}" fill="none" opacity="${f1(0.2 + R() * 0.3)}" stroke-linecap="round"/>`; }
  return s;
}
// a wreckers' lantern on a pole: a horn-paned iron lantern, lit lamp yellow, glow (painted, dropped by the lit passes)
function lantern(x, y, s, o = {}) {
  let out = `<path d="M${f1(x)} ${f1(y - s * 1.2)} L${f1(x)} ${f1(y - s * 0.6)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.1))}"/>`;
  out += `<path d="M${f1(x - s * 0.4)} ${f1(y - s * 0.6)} L${f1(x + s * 0.4)} ${f1(y - s * 0.6)} L${f1(x)} ${f1(y - s * 0.95)} Z" fill="#2a2a2c" stroke="${INK}" stroke-width="0.6"/>`;
  out += EM(`<rect x="${f1(x - s * 0.33)}" y="${f1(y - s * 0.6)}" width="${f1(s * 0.66)}" height="${f1(s * 0.9)}" fill="${LAMPY}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.08))}"/><path d="M${f1(x - s * 0.15)} ${f1(y - s * 0.5)} l0 ${f1(s * 0.7)}" stroke="#fff4c8" stroke-width="${f1(Math.max(0.5, s * 0.1))}" opacity="0.8"/>`);
  out += `<path d="M${f1(x)} ${f1(y - s * 0.6)} L${f1(x)} ${f1(y + s * 0.3)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.07))}"/>`;
  out += glow(x, y - s * 0.15, s * (o.r || 5), s * (o.r || 5) * 0.8, LAMPY, o.gop ?? 0.25);
  return out;
}
// fulgurite: lightning-fused sand, a glassy branching tube lying in the beach plane at(s,t): dark crusted outside, glassy
// grey-green where broken open; ends in fine roots
function fulgurite(at, s0, t0, len, ang) {
  let out = '';
  const go = (s, t, a, l, w, d) => { let cs = s, ct = t; const n = 4; for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.8; const ns = cs + Math.cos(a) * l / n, nt = ct + Math.sin(a) * l / n, A = P(...at(cs, ct)), B = P(...at(ns, nt)), Z = at(cs, ct)[2], px = Math.max(0.8, K(Z) * w * (1 - i / n * 0.4));
      out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="${f1(px + 1.2)}" stroke-linecap="round"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#4a4a40" stroke-width="${f1(px)}" stroke-linecap="round"/><path d="M${f1(A[0] - px * 0.2)} ${f1(A[1] - px * 0.25)} L${f1(B[0] - px * 0.2)} ${f1(B[1] - px * 0.25)}" stroke="#a8b8b0" stroke-width="${f1(Math.max(0.4, px * 0.3))}" opacity="0.7"/>`;
      if (d > 0 && R() < 0.5) go(ns, nt, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), l * 0.45, w * 0.6, d - 1); cs = ns; ct = nt; } };
  go(s0, t0, ang, len, 0.05, 3);
  return out;
}

// ======================================================================== FAR
layer('far');
// ---- the storm sky: heavy slate cloud lowering over the sea, a pale wet glare where the light breaks through (no bolt),
// rain hanging from the cloud base in slanting curtains
{
  raw(`<rect width="${W}" height="${H}" fill="${SKY}"/>`);
  raw(G.skyGrad(0, 320, [[0, '#262c32'], [0.3, '#38424a'], [0.65, '#5a646c'], [1, '#7e888c']]));
  raw(glow(980, 210, 320, 90, '#d8e0e4', 0.35) + glow(1000, 230, 140, 40, '#f0f4f4', 0.3));
  // cloud masses: dark, low, torn; lit rims toward the glare; rain curtains hanging from their bellies
  for (let i = 0; i < 6; i++) { const cy = 30 + Math.pow(R(), 0.8) * 190, cx = -60 + i * 300 + R() * 120, d = cy / 240, w = (760 - d * 360) * (0.7 + R() * 0.5), h = (110 - d * 50) * (0.7 + R() * 0.4); raw(G.softMass(cx, cy, w, h, mix('#1a2024', '#5a646a', d), { lit: '#c8d0d2', dark: '#101418', op: 0.85, litOp: 0.4, wisps: 2 }));
    if (R() < 0.6) raw(BK.rain(120, { x0: cx - w * 0.4, x1: cx + w * 0.4, y0: cy, y1: 300, slant: 0.35, len: 18, col: '#8a949a', op: 0.35 })); }
}
// ---- the sea: slate, heaving, streaked with foam; the far headland with the gibbet and the lighthouse in the wrong place
{
  // the far point and the lighthouse (lit, lamp yellow, burning where no harbour is)
  { const pts = [[1180, 302], [1220, 288], [1290, 282], [1350, 286], [1420, 296], [1490, 300], [1490, 304]]; raw(`<path d="${smooth(pts, true, 0.5)}" fill="${haze('#2a3036', 120)}"/>`);
    const lx = 1330, ly = 282; raw(`<path d="M${lx - 4} ${ly} L${lx - 3} ${ly - 26} L${lx + 3} ${ly - 26} L${lx + 4} ${ly} Z" fill="${haze('#3a4044', 110)}" stroke="${haze(INK, 110, 0.6)}" stroke-width="0.6"/>` + EM(`<rect x="${lx - 3}" y="${ly - 31}" width="6" height="5" fill="${LAMPY}"/>`) + `<path d="M${lx - 4} ${ly - 31} L${lx + 4} ${ly - 31} L${lx} ${ly - 35} Z" fill="${haze(INK, 110, 0.6)}"/>` + glow(lx, ly - 28, 30, 18, LAMPY, 0.4)); }
  // the headland at the right with the gibbet: a crooked post and arm, the iron cage hanging with its wrecker, fused
  { const pts = [[880, 300], [930, 270], [1000, 248], [1080, 236], [1140, 242], [1190, 262], [1230, 290], [1240, 302]]; raw(`<path d="${smooth(pts, true, 0.5)}" fill="${haze('#2a3034', 60)}" stroke="${haze(INK, 60, 0.5)}" stroke-width="0.8"/>`);
    raw(`<path d="${smooth(pts.slice(1, 5), false, 0.5)}" stroke="${haze('#8a9498', 60)}" stroke-width="1" fill="none" opacity="0.5"/>`);
    const gx = 1072, gy = 237; raw(line([[gx, gy], [gx + 1, gy - 46]], 3.2, haze('#1a1c1e', 60), 1) + line([[gx - 2, gy - 44], [gx + 22, gy - 46]], 2.6, haze('#1a1c1e', 60), 1) + line([[gx + 1, gy - 30], [gx + 12, gy - 45]], 1.6, haze('#1a1c1e', 60), 1));
    raw(line([[gx + 20, gy - 46], [gx + 20, gy - 38]], 0.9, INK, 1) + `<path d="M${gx + 15} ${gy - 38} L${gx + 25} ${gy - 38} L${gx + 24} ${gy - 18} L${gx + 20} ${gy - 13} L${gx + 16} ${gy - 18} Z" fill="${haze('#2a2c2e', 60)}" stroke="${INK}" stroke-width="0.8"/>` + [17, 20, 23].map(x => `<path d="M${gx + x} ${gy - 38} L${gx + x} ${gy - 15}" stroke="${INK}" stroke-width="0.6"/>`).join('') + `<path d="M${gx + 18} ${gy - 36} q2 -1 4 0 l0 6 q-2 3 -4 0 Z" fill="${haze('#5a5a54', 60)}"/>`);
    raw(`<path d="M${gx + 1} ${gy - 44} l-2 10 l3 6 l-2 10 M${gx + 1} ${gy - 34} l4 4" stroke="#0a0a0a" stroke-width="0.8" fill="none"/>`); }
  // the open sea: slate, foam streaks laid along the swells, swells darker on their lee
  raw(BK.water(-120, 120, 15.5, 200, '#3a4248', { y: -0.2, n: 360, lite: '#a8b4b8' }));
  for (let i = 0; i < 40; i++) { const Z = 20 + Math.pow(R(), 0.7) * 160, X = -80 + R() * 160, [x, y] = P(X, -0.2, Z), l = K(Z) * (2 + R() * 5); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} q${f1(l / 2)} ${f1(-Math.max(1, K(Z) * 0.15))} ${f1(l)} 0" stroke="${SURF}" stroke-width="${f1(Math.max(0.6, K(Z) * 0.04))}" fill="none" opacity="${f1(0.3 + R() * 0.3)}"/>`); }
  // breakers on the reef rocks offshore, and the rocks
  for (const [X, Z, w, h] of [[-16, 40, 5, 2.4], [-4, 46, 3, 1.6], [7, 36, 4, 2.0], [16, 48, 6, 2.6]]) { const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push(P(X + w * u, -0.2 + Math.sin(u * Math.PI) * h * (0.7 + R() * 0.5), Z)); } raw(slateRock([...pts, P(X + w, -0.2, Z), P(X, -0.2, Z)], Z, { barn: 0.3 })); const base = []; for (let k = 0; k <= 10; k++) base.push(P(X - 1.5 + (w + 3) * k / 10, -0.2, Z - 0.6)); raw(surf(base, K(Z) * 0.7, { spray: 1.2, op: 0.7 })); }
}
// ---- the cliff at the left: slate rising out of frame, laminated, wet; the wreckers' path cut across it to a ledge where
// their false lamp burns on its pole; burns branched across the rock where the storm has found the lamp's iron
{
  const Zc = 19, k = K(Zc), edge = [[-40, -0.3], [-14.8, -0.3], [-14.2, 0.9], [-13.1, 1.6], [-13.6, 3.0], [-14.4, 3.6], [-13.4, 5.0], [-12.1, 5.9], [-12.6, 7.4], [-13.5, 7.9], [-12.8, 9.6], [-11.3, 11.4], [-12.0, 13.2], [-10.9, 15.0], [-11.4, 16], [-40, 16]];
  const pts = edge.map(([X, Y]) => P(X, Y, Zc + (X + 14) * -0.1));
  raw(G.smoothRock(pts, Zc, '#3e464c', { dir: 'h', rib: 7, wave: 4, k: 0.15, flank: 0.3, rimCol: '#c8d0d4', rimOp: 0.45, ring: 0 }));
  { const cid = S.id('cl2'); raw(`<clipPath id="${cid}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${cid})">`); for (let k2 = 0; k2 < 60; k2++) { const x = R() * 560 - 40, y = R() * 300, l = 20 + R() * 60; raw(line([[x, y], [x + l * 0.35, y + l]], 0.8, INK, 0.45) + line([[x - 1.2, y], [x + l * 0.35 - 1.2, y + l]], 0.6, '#a8b0b4', 0.3)); } raw('</g>'); }
  // ledges: slabs of slate standing out of the face, each its own length and depth, lit on top, a cast shadow beneath;
  // the harpies' nests on three of them: driftwood, rope and wreck-rag, bones, a feather or two, guano streaking below
  const NEST = [[-15.6, 9.8], [-19.2, 12.6], [-16.4, 14.4]];
  for (const [X1, Y, l, nest] of [[-14.4, 2.2, 3.2], [-13.4, 4.6, 2.6, 1], [-15.4, 6.6, 4.0, 1], [-17.6, 8.4, 3.0, 1], [-18.6, 3.4, 2.4], [-20.4, 5.4, 3.4], [-13.2, 9.2, 1.8]]) {
    const a2 = P(X1 - l, Y, Zc - 0.6), b2 = P(X1, Y + 0.1, Zc - 0.6), d = K(Zc) * (0.12 + R() * 0.1);
    raw(`<path d="${p2([[a2[0], a2[1] + 2], [b2[0], b2[1] + 2], [b2[0] - 4, b2[1] + d * 3], [a2[0] + 10, a2[1] + d * 2.6]])}" fill="${INK}" opacity="0.45"/>`);
    raw(cel([[a2[0], a2[1]], [b2[0] + 3, b2[1]], [b2[0] + 2, b2[1] + d], [a2[0] + 4, a2[1] + d * 1.2]], { Z: Zc, fill: tone('#4e565c', 0.12), band: 2, tex: 'url(#mottle)', texOp: 0.4 }) + line([[a2[0] + 2, a2[1] + 1], [b2[0], b2[1] + 1]], 0.9, WET, 0.5));
    if (nest) { const c = [(a2[0] + b2[0]) / 2 + (R() - 0.5) * 20, (a2[1] + b2[1]) / 2], w2 = K(Zc) * 0.9;
      for (let j = 0; j < 14; j++) { const x = c[0] + (R() - 0.5) * w2, y = c[1] - R() * w2 * 0.2; raw(line([[x - w2 * 0.15, y], [x + w2 * 0.15, y - (R() - 0.5) * 6]], 1.4, j % 4 ? '#5a5048' : '#8a8070', 1)); }
      raw(`<path d="M${f1(c[0] - w2 * 0.5)} ${f1(c[1])} Q${f1(c[0])} ${f1(c[1] - w2 * 0.35)} ${f1(c[0] + w2 * 0.5)} ${f1(c[1])}" stroke="${INK}" stroke-width="1" fill="none"/>`);
      raw(`<circle cx="${f1(c[0] - w2 * 0.15)}" cy="${f1(c[1] - w2 * 0.15)}" r="${f1(w2 * 0.06)}" fill="#d8d4c4" stroke="${INK}" stroke-width="0.5"/>` + line([[c[0] + w2 * 0.1, c[1] - w2 * 0.12], [c[0] + w2 * 0.3, c[1] - w2 * 0.2]], 1.2, '#d8d4c4', 1) + line([[c[0] + w2 * 0.3, c[1] - w2 * 0.05], [c[0] + w2 * 0.5, c[1] - w2 * 0.35]], 0.9, '#9aa0a4', 0.9));
      for (let j = 0; j < 3; j++) { const x = c[0] + (R() - 0.5) * w2 * 0.8; raw(`<path d="M${f1(x)} ${f1(c[1] + d)} l${f1((R() - 0.5) * 3)} ${f1(4 + R() * 12)}" stroke="#c8c8bc" stroke-width="${f1(0.8 + R())}" opacity="0.35" stroke-linecap="round"/>`); } }
  }
  // rain running down in dark streaks
  for (let k2 = 0; k2 < 30; k2++) { const x = R() * P(-13, 0, Zc)[0], y = R() * 280; raw(`<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 2)} ${f1(10 + R() * 30)}" stroke="${WET}" stroke-width="0.6" opacity="0.3"/>`); }
  // the ledge, the pole and the false lamp
  const L = P(-14.6, 7.2, Zc - 0.5), Lb = P(-14.6, 5.5, Zc - 0.5); raw(cel([[L[0] - 40, Lb[1]], [L[0] + 18, Lb[1] + 2], [L[0] + 14, Lb[1] + 8], [L[0] - 40, Lb[1] + 10]], { Z: Zc, fill: '#2a3034', band: 2 }));
  raw(line([Lb, [L[0], L[1] - 4]], 2.6, INK, 1) + line([Lb, [L[0], L[1] - 4]], 1.4, '#4a3e30', 1) + line([[L[0], L[1] - 4], [L[0] + 10, L[1] - 6]], 1.6, INK, 1) + lantern(L[0] + 10, L[1] + 8, 10, { r: 7, gop: 0.3 }));
  // (round 2 polish: the old burn fern up here read as a bare tree against the sky; the lamp's burn is now on its ledge)
  raw(BK.scorch((s, t) => [-14.6 + s * 0.3, 5.5 + t * 0.15, Zc - 0.55], -1.2, 0, 2.2, 0.05, { w: 0.04, depth: 2, col: '#0a0c0e', halo: '#a8b0b4', haloOp: 0.22 }));
  // the wreckers' path zig-zagging down the cliff to the beach, a rope handline on stakes
  const path_ = [[-15.0, 5.5], [-20, 4.2], [-15.6, 2.8], [-21, 1.4], [-16.5, 0.2]].map(([X, Y]) => P(X, Y, Zc - 0.4)); raw(line(path_, 2.6, '#22282c', 0.9) + line(path_.map(([x, y]) => [x, y - 1.5]), 0.8, '#8a9498', 0.4));
}
// ---- the quiet band, then the beach and its tide line
raw(BK.quiet(MURK, 236, 330, { steps: [0.12, 0.14, 0.16, 0.18], hop: 0.1 }));
{
  // the surf running up the strand: the last spent waves, foam lace, the wet sand mirror behind them
  const Zs = 13.5; raw(BK.water(-40, 40, Zs, 15.6, '#4a545a', { y: -0.05, n: 90, lite: '#c8d0d0' }));
  for (const [Z, op] of [[15.3, 0.5], [14.4, 0.38], [13.7, 0.3]]) { const pts = []; for (let k = 0; k <= 30; k++) pts.push(P(-30 + k * 2, -0.04, Z + Math.sin(k * 0.8 + Z) * 0.25)); raw(surf(pts, K(Z) * 0.18, { op, spray: 0.4, ph: Z })); }
  // the strand: wet sand and shingle, the sand mirror taking the sky's glare, pebbles, kelp on the tide line, rain rings
  const at = (s, t) => [-30 + s, 0, 3.6 + t], Lz = Zs - 3.6;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="${SAND}"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.5"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#speck)" opacity="0.4"/>`);
  { const wet = []; for (let k = 0; k <= 30; k++) wet.push(P(-30 + k * 2, 0.001, 10.6 + Math.sin(k * 0.6) * 0.5)); raw(`<path d="${p2([...wet, P(30, 0.001, Zs), P(-30, 0.001, Zs)])}" fill="#3a4044" opacity="0.6"/>`); for (let y = P(0, 0, 10.6)[1] - 6; y > P(0, 0, Zs)[1]; y -= 2) raw(`<path d="M${f1(900 + (R() - 0.5) * 120)} ${f1(y)} l${f1(40 + R() * 60)} 0" stroke="#d8e0e4" stroke-width="0.8" opacity="${f1(0.15 + R() * 0.2)}"/>`); }
  for (let i = 0; i < 300; i++) { const X = -16 + R() * 32, Z = 3.8 + Math.pow(R(), 0.8) * (Lz - 0.3), [x, y] = P(X, 0, Z), r = K(Z) * (0.025 + R() * 0.06); raw(cel(ell([x, y - r * 0.3], r, r * 0.5, (R() - 0.5) * 0.5, 7), { Z, fill: tone(R() < 0.6 ? '#5a5e60' : '#7a766a', 0.25), band: 0.6, inkW: 0.4, heavy: 0.6 })); }
  // the tide line: a wrack of kelp, cord, splinters and a dead gull, wandering across the beach
  { const wr = []; for (let k = 0; k <= 40; k++) wr.push([-20 + k, 9.6 + Math.sin(k * 0.5) * 0.4 + (R() - 0.5) * 0.2]); for (const [X, Z] of wr) { const [x, y] = P(X, 0.01, Z), l = K(Z) * (0.3 + R() * 0.5); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} q${f1(l / 3)} ${f1(-2)} ${f1(l)} ${f1(R() * 2)}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, K(Z) * 0.07))}" fill="none"/><path d="M${f1(x - l / 2)} ${f1(y)} q${f1(l / 3)} ${f1(-2)} ${f1(l)} ${f1(R() * 2)}" stroke="${KELP}" stroke-width="${f1(Math.max(0.8, K(Z) * 0.045))}" fill="none"/>`); } }
  // ripple marks left by the ebb, running across the strand and closing up with distance; runnels draining to the sea
  for (let Z = 4.0; Z < 10.4; Z *= 1.03 + R() * 0.03) { let X = -16 + R() * 2; while (X < 16) { const L = 0.6 + R() * 2.2, pts = []; for (let x2 = X; x2 <= X + L; x2 += 0.2) pts.push(P(x2, 0.003, Z + Math.sin(x2 * 2.3 + Z * 5) * 0.05 + Math.sin(x2 * 0.5 + Z) * 0.1)); raw(line(pts, Math.max(0.5, K(Z) * 0.01), '#3a3a34', 0.4) + line(pts.map(([x, y]) => [x, y - 0.8]), 0.5, '#a8a494', 0.3)); X += L + 0.4 + R() * 1.6; } }
  for (const X0 of [-7.5, 2.2, 9.4]) { const pts = []; let X = X0; for (let Z = 4; Z < 11; Z += 0.5) { pts.push(P(X, 0.004, Z)); X += (R() - 0.5) * 0.5 + (0 - X0) * 0.01; } raw(line(pts, 3, '#3a4044', 0.6) + line(pts, 1.2, '#b8c4c8', 0.45)); }
  for (let i = 0; i < 40; i++) { const X = -14 + R() * 28, Z = 4 + R() * 6, [x, y] = P(X, 0, Z), r = K(Z) * 0.03; raw(`<path d="M${f1(x - r)} ${f1(y)} Q${f1(x)} ${f1(y - r * 1.2)} ${f1(x + r)} ${f1(y)} Z" fill="#c8c4b4" stroke="${INK}" stroke-width="0.4"/>`); }
  for (let i = 0; i < 16; i++) { const u = i / 16, X = -6 + u * 13 + (i % 2 ? 0.2 : -0.2), Z = 5.2 + u * 4.2, [x, y] = P(X, 0.002, Z), r = K(Z) * 0.07; raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.3)}" fill="#3a3c38" opacity="0.55"/>`); }
  // fulgurites in the sand: branching glassy tubes where strikes hit the beach
  raw(fulgurite((s, t) => [s, 0.01, t], -3.2, 7.4, 1.4, 0.4) + fulgurite((s, t) => [s, 0.01, t], 6.8, 5.6, 1.1, 2.6) + fulgurite((s, t) => [s, 0.01, t], -10.5, 4.8, 0.9, -0.3));
  raw(BK.splashes(at, 14, 46, 0.5, 9, 150, WET));
  for (let i = 0; i < 18; i++) { const X = -14 + R() * 28, Z = 4 + R() * 6, [x, y] = P(X, 0, Z); raw(stain(x, y, K(Z) * (0.2 + R() * 0.4), '#2a3034', 0.35)); }
  raw(occBand((s, t) => [-30 + s, 0, 3.6 + t], 60, 1.2, { op: 0.25 }));
}
// ---- the wreck behind the company (round 2: it must read as a ship, not as ribs): a merchantman broken on the strand, her
// bow gone, lying heeled toward us. The stern stands whole: planked strakes following her sheer, a heavy wale, a gunport,
// the raked stern post with its rudder hanging on one pintle, the transom with its windows stove in, the mizzen's stump
// with its shrouds; amidships the planking is torn off and the frames stand bare, futtocks scarfed and snapped at
// different heights; barnacles and kelp to the tide mark; the iron knees fused into black welds; burns across the planks
{
  const Zr = 18.5, k = K(Zr), sheer = X => 1.3 + Math.pow(Math.max(0, X + 1.5) / 10, 1.8) * 3.2, bot = X => 0.15 + Math.max(0, X - 5) * 0.03;
  const at = (X, Y) => P(X, Y, Zr - (Y / 4) * 0.9);            // heeled toward us: higher is nearer
  // amidships: bare frames from the keel, futtock joints, snapped tops; a few strakes hanging on
  for (let i = 0; i < 9; i++) { const X = -1.2 + i * 0.68, hTop = sheer(X) * (0.55 + R() * 0.45), pts = []; for (let j = 0; j <= 6; j++) { const u = j / 6; pts.push(at(X - Math.sin(u * 1.4) * 0.35, bot(X) + u * hTop)); }
    raw(line(pts, k * 0.17 + 2, INK, 1) + line(pts, k * 0.17, haze(WOOD, Zr), 1) + line(pts.map(([x, y]) => [x - k * 0.04, y]), Math.max(0.6, k * 0.03), '#8a8070', 0.35));
    const jn = pts[3]; raw(line([[jn[0] - k * 0.1, jn[1] + 1], [jn[0] + k * 0.1, jn[1] - 1]], 1, INK, 0.9));
    const t = pts[6]; raw(`<path d="M${f1(t[0] - k * 0.09)} ${f1(t[1] + 1)} l${f1(k * 0.04)} ${f1(-k * 0.16)} l${f1(k * 0.05)} ${f1(k * 0.1)} l${f1(k * 0.04)} ${f1(-k * 0.06)}" fill="${haze('#6a6050', Zr)}" stroke="${INK}" stroke-width="0.6"/>`);
    if (i % 3 === 1) { const kn = pts[2]; raw(`<path d="M${f1(kn[0] - k * 0.16)} ${f1(kn[1] + k * 0.06)} l${f1(k * 0.26)} ${f1(-k * 0.03)} l${f1(-k * 0.03)} ${f1(-k * 0.22)}" stroke="#141414" stroke-width="${f1(k * 0.09 + 1)}" fill="none"/>`); }
    if (R() < 0.5) raw(line([pts[3], [pts[3][0] + (R() - 0.5) * 5, pts[3][1] + k * (0.5 + R() * 0.6)]], Math.max(1, k * 0.04), KELP, 0.9)); }
  for (const [Y, x0, x1] of [[0.7, -1.4, 3.6], [1.15, -0.6, 2.4], [1.6, 1.4, 4.2]]) { const pts = []; for (let X = x0; X <= x1; X += 0.4) pts.push(at(X, Y + Math.max(0, X - 1) * 0.08)); raw(line(pts, k * 0.16 + 2, INK, 1) + line(pts, k * 0.16, haze('#3a342e', Zr), 1)); }
  // the stern: planked whole, strakes following the sheer, a wale, a gunport; the stern post raked, the rudder hanging
  const sx0 = 4.6, sx1 = 8.6, outl = [];
  for (let X = sx0; X <= sx1 + 0.01; X += 0.25) outl.push(at(X, sheer(X))); outl.push(at(sx1 + 0.5, sheer(sx1) - 0.2), at(sx1 + 0.1, bot(sx1)));
  for (let X = sx1; X >= sx0 - 0.01; X -= 0.5) outl.push(at(X, bot(X)));
  // the broken forward edge of the planking: ragged, strakes ending at different frames
  const rag = []; for (let Y = bot(sx0); Y < sheer(sx0); Y += 0.3) rag.push(at(sx0 - R() * 0.7, Y));
  const hull = [...outl, ...rag];
  raw(cel(hull, { Z: Zr, fill: haze('#2e2a26', Zr), tex: 'url(#mottle)', texOp: 0.5, band: k * 0.12 }));
  const cid = S.id('hl'); raw(`<clipPath id="${cid}"><path d="${p2(hull)}"/></clipPath><g clip-path="url(#${cid})">`);
  for (let j = 1; j < 10; j++) { const v = j / 10, pts = []; for (let X = sx0 - 1; X <= sx1 + 0.6; X += 0.3) { const Y = bot(X) + (sheer(Math.min(X, sx1)) - bot(X)) * v; pts.push(at(X, Y)); } raw(line(pts, 0.9, INK, 0.75) + line(pts.map(([x, y]) => [x, y - 1]), 0.6, '#8a8478', 0.3)); }
  { const pts = []; for (let X = sx0 - 1; X <= sx1 + 0.6; X += 0.3) pts.push(at(X, bot(X) + (sheer(Math.min(X, sx1)) - bot(X)) * 0.62)); raw(line(pts, k * 0.12 + 2, INK, 1) + line(pts, k * 0.12, '#24201c', 1) + line(pts.map(([x, y]) => [x, y - 1.5]), 0.8, '#a8a090', 0.4)); }
  { const g = [at(6.4, 2.2), at(7.0, 2.25), at(7.0, 2.75), at(6.4, 2.7)]; raw(`<path d="${p2(g)}" fill="#0a0a0a" stroke="${INK}" stroke-width="1"/>` + line([g[3], [g[3][0] - 3, g[3][1] - 10]], 1.6, INK, 1)); }
  raw(`<rect x="0" y="${f1(at(0, 0.9)[1])}" width="${W}" height="60" fill="#1a2018" opacity="0.4"/>` + BK.blisters(at(6.6, 0.5)[0], at(6.6, 0.5)[1], k * 1.4, 26, '#6e6e64', { size: Math.max(0.6, k * 0.02), flat: 0.25 }));
  raw(BK.scorch((s2, t) => [5 + s2, 1.2 + t, Zr - 0.35], 1.0, 0.4, 1.8, 0.4, { w: 0.03, depth: 3, col: '#0a0a0a', halo: '#8a8478', haloOp: 0.22 }));
  raw('</g>');
  raw(line(outl.slice(0, 18), 1.4, '#9aa0a0', 0.4));
  // the transom: a narrow face at the stern, its windows stove in, a carved rail
  { const t0 = at(sx1 + 0.5, sheer(sx1) - 0.2), t1 = at(sx1 + 0.5, sheer(sx1) - 1.6), q = [t0, [t0[0] + k * 0.45, t0[1] + k * 0.18], [t1[0] + k * 0.42, t1[1] + k * 0.22], t1]; raw(cel(q, { Z: Zr, fill: haze('#3a342e', Zr), band: 2 })); for (let j = 0; j < 3; j++) { const u = 0.2 + j * 0.25, c = [t0[0] + k * 0.22, t0[1] + (t1[1] - t0[1]) * u + k * 0.1]; raw(`<rect x="${f1(c[0] - k * 0.08)}" y="${f1(c[1] - k * 0.07)}" width="${f1(k * 0.16)}" height="${f1(k * 0.13)}" fill="#0a0a0a" stroke="${INK}" stroke-width="0.6"/>`); } }
  // the rudder hanging askew on one pintle
  { const a = at(sx1 + 0.35, 1.6), b = at(sx1 + 0.75, 0.15); raw(cel([a, [a[0] + k * 0.32, a[1] + k * 0.1], [b[0] + k * 0.36, b[1]], b], { Z: Zr, fill: haze('#2a2622', Zr), band: 1.5 }) + line([a, [a[0] + k * 0.2, a[1] + 2]], 2, '#141414', 1)); }
  // the mizzen stump: a mast rising from the stern deck, snapped, a crosstree hanging, shrouds slack to the rail
  { const m0 = at(6.4, sheer(6.4)), m1 = P(6.9, 8.2, Zr - 1.2); raw(line([m0, m1], k * 0.2 + 2, INK, 1) + line([m0, m1], k * 0.2, haze('#3a3028', Zr), 1)); raw(`<path d="M${f1(m1[0] - 4)} ${f1(m1[1] + 2)} l3 -7 l3 5 l3 -4 l2 6" fill="${haze('#6a6050', Zr)}" stroke="${INK}" stroke-width="0.7"/>`);
    const ct = P(6.75, 6.6, Zr - 1.0); raw(line([[ct[0] - k * 0.6, ct[1] + k * 0.15], [ct[0] + k * 0.5, ct[1] - k * 0.05]], k * 0.08 + 1.4, INK, 1));
    for (const X of [5.2, 5.7, 7.6, 8.1]) raw(line([ct, [ct[0] + (P(X, 0, Zr)[0] - ct[0]) * 0.5, (ct[1] + at(X, sheer(X))[1]) / 2 + 6], at(X, sheer(X))], 0.8, INK, 0.8)); }
  // the bow: gone; its stem lies across the sand at the left, barnacled
  { const a = P(-3.2, 0.1, Zr - 0.4), b = P(-1.6, 1.4, Zr - 0.6); raw(line([a, b], k * 0.2 + 2, INK, 1) + line([a, b], k * 0.2, haze(WOOD, Zr), 1)); }
}
// ======================================================================== MID: the salvage above the tide line, low
layer('mid');
{
  const Z = 10.2, k = K(Z);
  // casks, a bale in sodden sacking, the stove sea chest, a grapnel on its line, a Drowned Kingdom bronze lantern gone green
  for (const [X, w, h] of [[-8.6, 0.55, 0.8], [-7.8, 0.5, 0.75]]) { const c = P(X, 0, Z); raw(cel([[c[0] - k * w / 2, c[1]], [c[0] + k * w / 2, c[1]], [c[0] + k * w / 2 * 1.08, c[1] - k * h / 2], [c[0] + k * w / 2, c[1] - k * h], [c[0] - k * w / 2, c[1] - k * h], [c[0] - k * w / 2 * 1.08, c[1] - k * h / 2]], { Z, fill: '#3a3028', tex: 'url(#mottle)', texOp: 0.5 })); for (const u of [0.15, 0.85]) raw(line([[c[0] - k * w / 2, c[1] - k * h * u], [c[0] + k * w / 2, c[1] - k * h * u]], 1.4, '#1a1a1a', 1)); }
  { const c = P(-6.4, 0, Z - 0.2); raw(cel([[c[0] - k * 0.5, c[1]], [c[0] + k * 0.5, c[1]], [c[0] + k * 0.45, c[1] - k * 0.5], [c[0] - k * 0.4, c[1] - k * 0.55]], { Z, fill: '#4a4438', tex: 'url(#mottle)', texOp: 0.5, band: 2 })); raw(line([[c[0] - k * 0.1, c[1]], [c[0] - k * 0.05, c[1] - k * 0.53]], 0.9, INK, 0.7) + line([[c[0] - k * 0.45, c[1] - k * 0.3], [c[0] + k * 0.47, c[1] - k * 0.25]], 0.9, INK, 0.7)); }
  { const c = P(5.6, 0, Z); raw(cel([[c[0] - k * 0.5, c[1]], [c[0] + k * 0.5, c[1]], [c[0] + k * 0.5, c[1] - k * 0.32], [c[0] - k * 0.5, c[1] - k * 0.32]], { Z, fill: '#3e2e20', tex: 'url(#mottle)', texOp: 0.5 }) + cel([[c[0] - k * 0.52, c[1] - k * 0.32], [c[0] + k * 0.52, c[1] - k * 0.32], [c[0] + k * 0.4, c[1] - k * 0.5], [c[0] - k * 0.6, c[1] - k * 0.44]], { Z, fill: '#4a3624' }) + `<path d="M${f1(c[0] - k * 0.1)} ${f1(c[1] - k * 0.32)} l${f1(k * 0.12)} ${f1(-k * 0.05)} l${f1(-k * 0.02)} ${f1(k * 0.2)}" stroke="${INK}" stroke-width="1.2" fill="none"/>`); }
  { const g = P(7.4, 0.02, Z - 0.4); raw(`<path d="M${f1(g[0])} ${f1(g[1])} l0 ${f1(-k * 0.35)} M${f1(g[0])} ${f1(g[1] - k * 0.05)} q${f1(-k * 0.2)} ${f1(-k * 0.02)} ${f1(-k * 0.2)} ${f1(-k * 0.15)} M${f1(g[0])} ${f1(g[1] - k * 0.05)} q${f1(k * 0.2)} ${f1(-k * 0.02)} ${f1(k * 0.2)} ${f1(-k * 0.15)}" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${f1(g[0])} ${f1(g[1])} l0 ${f1(-k * 0.35)}" stroke="#3a3a3c" stroke-width="1.4"/>` + line([[g[0], g[1] - k * 0.35], [g[0] + k * 0.6, g[1] - k * 0.1], [g[0] + k * 1.6, g[1] + 2]], 1.4, '#6a5a40', 1)); }
  { const c = P(-4.6, 0, Z - 0.6); raw(cel([[c[0] - k * 0.14, c[1]], [c[0] + k * 0.14, c[1]], [c[0] + k * 0.12, c[1] - k * 0.32], [c[0] - k * 0.12, c[1] - k * 0.32]], { Z, fill: VERD, band: 1.5 }) + `<path d="M${f1(c[0] - k * 0.16)} ${f1(c[1] - k * 0.32)} L${f1(c[0] + k * 0.16)} ${f1(c[1] - k * 0.32)} L${f1(c[0])} ${f1(c[1] - k * 0.45)} Z" fill="#3a6a5a" stroke="${INK}" stroke-width="0.7"/>` + [-0.06, 0.06].map(d => `<path d="M${f1(c[0] + d * k)} ${f1(c[1] - k * 0.04)} l0 ${f1(-k * 0.26)}" stroke="${INK}" stroke-width="0.6"/>`).join('')); }
}

// ======================================================================== FORE: framing over the fighters
layer('fore');
{
  // black slate rocks rising at both edges, barnacled and weeded, streaming wet; a wreckers' lantern on a pole stuck in the
  // sand at the right, lit; a stove-in boat's bow at the bottom left; driving rain across the whole near air
  raw(slateRock([[-10, H + 4], [-10, 90], [30, 70], [62, 120], [80, 210], [96, 300], [140, 380], [190, 440], [230, H + 4]], 4.2, { col: '#2a3034', barn: 0.3 }));
  raw(slateRock([[W + 10, H + 4], [W + 10, 140], [W - 26, 150], [W - 54, 220], [W - 64, 320], [W - 110, 400], [W - 170, H + 4]], 4.2, { col: '#2a3034', barn: 0.25 }));
  for (let i = 0; i < 12; i++) { const x = R() < 0.5 ? 10 + R() * 80 : W - 60 + R() * 50, y = 160 + R() * 260; raw(line([[x, y], [x + (R() - 0.5) * 8, y + 20 + R() * 30]], 2.2, KELP, 0.9)); }
  raw(BK.scorch((s, t) => [s, t, 4.2], -4.7, 2.2, 1.0, 0.9, { w: 0.03, depth: 3, col: '#06080a', halo: '#8a949a', haloOp: 0.25 }));
  { const p = [W - 200, H - 8], top = [W - 206, 250]; raw(line([p, top], 5, INK, 1) + line([p, top], 3, '#4a3e30', 1) + line([[top[0], top[1] + 6], [top[0] - 18, top[1] + 2]], 2.4, INK, 1) + lantern(top[0] - 18, top[1] + 22, 16, { r: 6, gop: 0.28 })); }
  raw(BK.rain(700, { x0: -40, x1: W, y0: -20, y1: H, slant: 0.35, len: 26, w: 0.8, col: WET, op: 0.22, dens: (x, y) => y > 230 && y < 430 ? 0.35 : 1 }));
  for (let i = 0; i < 40; i++) { const x = R() < 0.5 ? R() * 200 : W - 200 + R() * 200, y = R() * H; raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.8 + R() * 1.5)}" fill="${SURF}" opacity="${f1(0.15 + R() * 0.25)}"/>`); }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
