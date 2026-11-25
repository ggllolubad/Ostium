// Drowned Kingdom battle room: THE NAVE, in Living Ink (pilot B). Replaces grim/bg_drowned.js room 'nave'.
// Same output contract as the grim room: three layers at 1480 x 480 (shown at 2x):
//   far  (opaque): the north arcade seen across the nave, the aisle beyond, the nave floor
//   mid  (transparent): low things on the floor behind the fighters (quiet, low contrast)
//   fore (transparent): near-black framing at the edges, drawn over the fighters
// Battle camera (new, recorded so every room shares it): horizon 300, eye 1.2 m (a standing human's chest), focal 652,
// cx 740. Fighters stand at depth 6 m, feet on y 430; a 1.0 human (640 figure px, 1.75 m) is 190 px tall at 1x.
// World I lore (bible/world_I_drowned_kingdom.md): a coastal cathedral kingdom sunk under the sea. Water marks: kelp,
// barnacles, verdigris, silt. Void marks: clean-rimmed round holes where stone should be. Palette: deep blue-black,
// verdigris, drowned (tarnished) gold, plus ink, bone and grey. Details: a sailors' votive ship hung in a bay, a drowned
// sanctuary lamp, the cathedral's bell rope hanging cut (its bell is the Bell Below), ledger slabs in the floor.
// No lightning anywhere in the room (engine effects only).
// v2 (2026-11-24, director's critique): the walls are weathered ashlar of uneven sizes (mixed courses, spalled faces, salt
// crust, barnacle bands at the old water levels, mortar washed out of the joints), not regular bricks; every bay differs
// (one arch collapsed onto a rubble heap, one choked with kelp, one with a sunken tomb in the aisle, one silted, slipped and
// dropped voussoirs, a different damage in every lancet, different growths on every pier); the void is a ragged bite eaten
// into the masonry with clean rims, the stone round it cracked from the cusps and shaded, never a floating disc.
// v3 (2026-11-24): the void is now an irregular torn absence (battle_li.js tornVoid): no circles, no cracks, no glow.
// Usage: node scenes/bg_drowned_nave.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'pilot');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2301, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9 });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, masonry, ashlar, voidBite, hatch3, occBand, mix, R, figProp, glow, stain, smooth, chip, tone } = S;
const E = require('../engine');
const { ell, add, lerp } = E;
const PR = require('./props_li');
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), I = G.I;

const MURK = '#0f171c', STONE = '#4b5759', VERD = '#4f7d6c', GOLD = '#8a7840', KELP = '#25301f', WL = '#a9c4b8', BONE = '#c8bea4';
const fog = (col, Z, k = 1) => mix(col, MURK, Math.max(0, Math.min(0.66, (Z - 6) / 24)) * k);
const ZA = 15.4, ZB = 16.6, ZW = 22.5;                 // arcade front, arcade back, aisle wall
const PIERS = [-15.4, -10.2, -5.8, -0.8, 3.6, 8.8, 13.6], PW = 0.7, SPR = 4.2;   // round 2: uneven bays (spans 3.0 to 3.8 m)
// a pointed (equilateral) arch opening between xa and xb, springing at ys, as [X,Y] points
const arch = (xa, xb, ys, n = 10) => { const w = xb - xa, o = [[xa, 0]]; for (let i = 0; i <= n; i++) { const th = Math.PI - i / n * Math.PI / 3; o.push([xb + w * Math.cos(th), ys + w * Math.sin(th)]); } for (let i = 1; i <= n; i++) { const th = Math.PI / 3 - i / n * Math.PI / 3; o.push([xa + w * Math.cos(th), ys + w * Math.sin(th)]); } o.push([xb, 0]); return o; };
const OPEN = []; for (let i = 0; i < PIERS.length - 1; i++) OPEN.push(arch(PIERS[i] + PW, PIERS[i + 1] - PW, SPR)); OPEN.unshift(arch(-20 + PW, PIERS[0] - PW, SPR)); OPEN.push(arch(PIERS[PIERS.length - 1] + PW, 18.6 - PW, SPR));
// what happened to each bay (by its centre X) and to the lancet behind it
const BAY = { '-12.5': { state: 'collapsed' }, '-7.5': { state: 'kelp' }, '-2.5': { ring: 'slipped' }, '2.5': { state: 'tomb' }, '7.5': {}, '12.5': { state: 'silted', ring: 'keystone' } };
const BAYI = [{}, { state: 'collapsed' }, { state: 'kelp' }, { ring: 'slipped' }, { state: 'tomb' }, {}, { state: 'silted', ring: 'keystone' }, {}];
const bayOf = op => BAYI[OPEN.indexOf(op)] || {};
const LANCET = { '-17.5': 'dark', '-12.5': 'gone', '-7.5': 'dark', '-2.5': 'broken', '2.5': 'intact', '7.5': 'bite', '12.5': 'mullion', '17.5': 'gone' };
const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const at3 = Z => (s, t) => [-20 + s, t, Z];
const line = (pts, w, col, op = 1, extra = '') => `<path d="${smooth(pts, false, 0.6)}" stroke="${col}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"${extra}/>`;
// a kelp strand hanging plumb from a point, heavy and wet: a tapering dark ribbon with a pale midrib, swaying a little
function kelp(X, Y, Z, len, o = {}) {
  const pts = [], n = 10, sway = (R() - 0.5) * 0.25;
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push([X + Math.sin(t * 5 + R()) * 0.06 + sway * t * t, Y - len * t, Z]); }
  const ps = pts.map(p => P(...p)), w = Math.max(1.0, K(Z) * (o.w || 0.08)), L = [], Rr = [];
  for (let i = 0; i < ps.length; i++) { const a = ps[Math.max(0, i - 1)], b = ps[Math.min(ps.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = w * (1 - i / ps.length * 0.7) * (0.7 + 0.3 * Math.sin(i * 1.7)); L.push([ps[i][0] - dy / l * ww, ps[i][1] + dx / l * ww]); Rr.push([ps[i][0] + dy / l * ww, ps[i][1] - dx / l * ww]); }
  const col = fog(o.col || '#2c3a24', Z, 0.4);
  return `<path d="${smooth([...L, ...Rr.reverse()], true, 0.6)}" fill="${col}" stroke="${INK}" stroke-width="${f1(S.inkW(Z) * 0.7)}"/>` + line(ps.slice(1, -2), Math.max(0.4, w * 0.25), mix(col, WL, 0.35), o.mid ?? 0.55);
}
// barnacles: little cones with dark mouths and a lit rim on the upper left
function barnacles(cx, cy, r, n, Z) {
  let s = ''; for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.6, b = Math.max(0.9, K(Z) * (0.025 + R() * 0.03));
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(b)}" ry="${f1(b * 0.85)}" fill="${fog('#b4b0a0', Z, 0.7)}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, b * 0.25))}"/><ellipse cx="${f1(x + b * 0.1)}" cy="${f1(y + b * 0.1)}" rx="${f1(b * 0.42)}" ry="${f1(b * 0.32)}" fill="${INK}"/><path d="M${f1(x - b * 0.7)} ${f1(y - b * 0.2)} A${f1(b)} ${f1(b * 0.85)} 0 0 1 ${f1(x + b * 0.1)} ${f1(y - b * 0.8)}" stroke="#efe8d8" stroke-width="${f1(Math.max(0.3, b * 0.18))}" fill="none" opacity="0.6"/>`; }
  return s;
}
function bubbles(n, x0, x1, y0, y1, rmax) { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), r = 0.6 + R() * rmax; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${WL}" fill-opacity="0.12" stroke="${mix(WL, INK, 0.3)}" stroke-width="${f1(Math.max(0.35, r * 0.25))}" opacity="0.7"/><circle cx="${f1(x - r * 0.35)}" cy="${f1(y - r * 0.35)}" r="${f1(r * 0.28)}" fill="#e8f0ea" opacity="0.7"/>`; } return s; }
function motes(n, y0, y1) { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${f1(R() * W)}" cy="${f1(y0 + R() * (y1 - y0))}" r="${f1(0.4 + R() * 0.8)}" fill="${WL}" opacity="${f1(0.15 + R() * 0.3)}"/>`; return s; }

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the aisle beyond the arcade: its back wall with tall lancets letting in the sea's light, its vault, its floor
{
  const atW = at3(ZW);
  // round 2: the aisle wall has burst behind the fourth bay. Through the breach: the cathedral close in the sea's light,
  // the chapter house, a run of the cloister arcade, the far town: the room's light focus and its third depth plane
  const BR = [[-1.5, 0], [-1.7, 1.8], [-1.2, 3.4], [-1.6, 4.9], [-0.7, 6.2], [0.2, 7.5], [1.1, 7.0], [2.0, 8.1], [3.0, 7.3], [3.9, 6.4], [4.6, 4.9], [4.3, 3.0], [4.9, 1.4], [5.1, 0]];
  {
    const fogO = (c, Z) => mix(c, '#7a9890', Math.min(0.75, (Z - 25) / 60));
    raw(`<path d="${pp([[-8, -1, 90], [12, -1, 90], [12, 30, 90], [-8, 30, 90]])}" fill="#9ab8ae"/>`);
    raw(G.bands([[60, '#a8c4ba'], [140, '#98b4aa'], [210, '#88a49a'], [262, '#748e86'], [300, '#5a7068']], { amp: 6 }).replace(/<path /g, `<path clip-path="url(#nvbr)" `));
    S.DEFS.push(`<clipPath id="nvbr"><path d="${pp([[-3, 0, ZW], [7, 0, ZW], [7, 9, ZW], [-3, 9, ZW]])}"/></clipPath>`);
    // the far town and a tower in the haze, then the chapter house with its tall windows, then the cloister arcade
    for (const [X, w, h, Z] of [[-6, 3, 9, 70], [-1, 4, 5, 64], [4, 2.4, 14, 75], [7, 3, 6, 60]]) raw(cel([[X, -1], [X + w, -1], [X + w, h], [X + w / 2, h + w * 0.4], [X, h]].map(([x, y]) => P(x, y, Z)), { Z, fill: fogO('#4a5e5a', Z), band: 0.6, inkW: 0.5, hi: false }));
    { const Z = 40, X0 = -3.5, X1 = 4.5, top = 7.5; raw(cel([[X0, -0.5], [X1, -0.5], [X1, top], [X1 - 1.2, top + 2.2], [X0 + 1.2, top + 2.2], [X0, top]].map(([x, y]) => P(x, y, Z)), { Z, fill: fogO('#4e625e', Z), band: 0.9, tex: 'url(#mottle)', texOp: 0.4 }));
      for (const X of [X0 + 1.0, X0 + 3.4, X0 + 5.8]) raw(`<path d="${p2(G.arch(X, X + 1.0, 4.2, 'point', { n: 5 }).map(([x, y]) => P(x, y ? y : 1.6, Z)))}" fill="${fogO('#1e2a2a', Z)}" stroke="${INK}" stroke-width="0.6"/>`);
      raw(BK.tornVoid((s2, t) => [X0 + s2, t, Z - 0.02], 6.4, 6.0, 0.5, 0.7, { rot: 0.3, fray: [[0.4, 3, 0.3]], depth: 0.4, cut: fogO('#2a3634', Z), fissures: 1 }).svg); }
    { const Z = 31; for (let k = 0; k < 6; k++) { const X = -3.2 + k * 1.55 + (k === 3 ? 0.25 : 0), q = G.arch(X, X + 1.2 + (k % 2) * 0.1, 1.5, 'round', { n: 6 }); raw(`<path d="${p2([[X - 0.25, 0], [X + 1.45, 0], [X + 1.45, 2.4], [X - 0.25, 2.4]].map(([x, y]) => P(x, y, Z)))}" fill="${fogO('#46585a', Z)}" stroke="${INK}" stroke-width="0.6"/><path d="${p2(q.map(([x, y]) => P(x, y, Z)))}" fill="${fogO('#7a948c', Z + 8)}" stroke="${INK}" stroke-width="0.6"/>`); }
      raw(cel([P(-3.6, 2.4, Z), P(6.4, 2.4, Z), P(6.4, 3.2, Z + 1.5), P(-3.6, 3.2, Z + 1.5)], { Z, fill: fogO('#34444a', Z), band: 0.8 })); }
    for (let k = 0; k < 12; k++) raw(I.kelp(-2 + R() * 7, 0, 27 + R() * 6, -(1.5 + R() * 3), { w: 0.07, col: fogO('#2a3a28', 30) }));
    raw(G.shaft(...P(-1.2, 9, ZW), 70, 260, 0.5, '#d8ece4', { op: 0.3, fill: 0.1, spread: 20 }));
  }
  const brCid = S.id('nb'); raw(`<clipPath id="${brCid}"><path clip-rule="evenodd" d="${pp([[-21, -1, ZW], [21, -1, ZW], [21, 11, ZW], [-21, 11, ZW]])} ${p2(BR.map(([x, y]) => P(x, y, ZW)))}"/></clipPath><g clip-path="url(#${brCid})">`);
  raw(ashlar(atW, 40, 10, mix('#34403f', MURK, 0.8), { scale: 1.5, vary: 0.2, chip: 0.5, mortar: 0.22, lost: 0.12, spall: 0.18 }));
  raw(hatch3(atW, 0, 40, 0, 10, 0.75, { op: 0.5 }) + hatch3(atW, 0, 40, 0, 10, -0.8, { op: 0.42 }) + `<path d="${pp([atW(0, 0), atW(40, 0), atW(40, 3.3), atW(0, 3.3)])}" fill="${MURK}" opacity="0.5"/>`);
  for (let i = -4; i < 4; i++) {
    const xc = i * 5 + 2.5, xa = xc - 0.75, xb = xc + 0.75, ys = 5.4, kind = LANCET[String(xc)] || 'intact';
    const win = arch(xa, xb, ys, 6).map(([x, y]) => [x, y < 0.5 ? 3.4 : y, ZW]);
    const ps = win.map(p => P(...p));
    // glass: pale water light at the top, sinking to murk. Each lancet has met a different end.
    const g = S.id('wg'), top = kind === 'gone' || kind === 'broken' ? mix(WL, '#ffffff', 0.3) : kind === 'dark' ? mix(WL, MURK, 0.35) : mix(WL, '#ffffff', 0.15);
    S.DEFS.push(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="0.55" stop-color="${mix(WL, MURK, kind === 'dark' ? 0.65 : 0.45)}"/><stop offset="1" stop-color="${mix(WL, MURK, 0.78)}"/></linearGradient>`);
    raw(`<path d="${p2(ps)}" fill="url(#${g})" stroke="${INK}" stroke-width="1.2"/>`);
    const leadRows = (y0, y1, wob = 0) => { let leads = ''; for (let k = 1; k < 6; k++) { const Y = 3.4 + k * 0.62; if (Y < y0 || Y > y1) continue; const A = P(xa, Y, ZW), B = P(xb, Y + (R() - 0.5) * 0.1 + wob * (R() - 0.3), ZW); leads += `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} `; } return leads; };
    if (kind === 'intact' || kind === 'dark') {
      let leads = leadRows(0, 99); const A = P(xc, 3.4, ZW), B = P(xc, 6.6, ZW); leads += `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}`;
      raw(`<path d="${leads}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.8"/>`);
      for (let k = 0; k < (kind === 'dark' ? 6 : 1); k++) { const Y = 3.4 + Math.floor(R() * 5) * 0.62, xx = R() < 0.5 ? xa : xc; raw(`<path d="${pp([[xx, Y, ZW], [xx + 0.75, Y, ZW], [xx + 0.75, Y + 0.62, ZW], [xx, Y + 0.62, ZW]])}" fill="${MURK}" opacity="0.8"/>`); }
    } else if (kind === 'broken') {
      // the upper panes gone: open water light; the lower leads still hold, with shards standing in them; a lead strip dangles
      let leads = leadRows(0, 4.8); const A = P(xc, 3.4, ZW), B = P(xc, 4.9, ZW); leads += `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}`;
      raw(`<path d="${leads}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.8"/>`);
      for (let k = 0; k < 5; k++) { const X = xa + 0.1 + k * 0.3, Y = 4.86, h = 0.15 + R() * 0.3; raw(`<path d="${pp([[X, Y, ZW], [X + 0.08 + R() * 0.08, Y + h, ZW], [X + 0.2, Y, ZW]])}" fill="${mix(WL, MURK, 0.4)}" stroke="${INK}" stroke-width="0.5" opacity="0.85"/>`); }
      raw(line([P(xc, 4.9, ZW), P(xc + 0.08, 5.3, ZW), P(xc + 0.02, 5.7, ZW)], 0.8, INK, 0.8));
    } else if (kind === 'gone') {
      // no glass left at all: kelp grows in through the empty frame from the sill
      for (let k = 0; k < 3; k++) raw(kelp(xa + 0.3 + k * 0.45, 3.4, ZW - 0.05, -(1.0 + R() * 1.3), { w: 0.05, col: '#1e2a1c' }));
    } else if (kind === 'mullion') {
      // the centre mullion broke and fell: its stub on the sill, the leads warped and sagging, silt drifted in on the sill
      let leads = ''; for (let k = 1; k < 6; k++) { const Y = 3.4 + k * 0.62, A = P(xa, Y, ZW), M = P(xc, Y - 0.25 - k * 0.03, ZW), B = P(xb, Y - 0.05, ZW); leads += `M${f1(A[0])} ${f1(A[1])} Q${f1(M[0])} ${f1(M[1] + 6)} ${f1(B[0])} ${f1(B[1])} `; }
      raw(`<path d="${leads}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.75"/>`);
      raw(cel([P(xc - 0.06, 3.4, ZW), P(xc + 0.06, 3.4, ZW), P(xc + 0.05, 3.85, ZW), P(xc - 0.02, 3.95, ZW)], { Z: ZW, fill: fog('#5a6466', ZW, 0.8) }));
      raw(`<path d="${smooth([P(xa, 3.4, ZW), P(xa + 0.3, 3.62, ZW), P(xc + 0.3, 3.55, ZW), P(xb, 3.45, ZW), P(xb, 3.4, ZW)], true, 0.5)}" fill="${fog('#6e7066', ZW, 0.8)}" opacity="0.8"/>`);
    } else if (kind === 'bite') {
      let leads = leadRows(0, 99); raw(`<path d="${leads}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.8"/>`);
    }
    raw(hatch3(atW, xa + 20, xb + 20, 3.4, 5.0, 0.9, { op: 0.4 }));
    // v3: the void has taken a torn piece out of the lancet's glass, its mullion and the wall beside it, cut straight across
    // leads and stones alike; tongues run out along the beds and thin into slivers
    if (kind === 'bite') raw(BK.tornVoid(atW, xc + 20 + 0.3, 5.45, 0.42, 0.55, { rot: 0.35, lobes: [[3.4, 0.25, 0.7]], fray: [[0.2, 4, 0.25], [4.5, 3, 0.2]], depth: 0.8, cut: '#26302f', fissures: 2, fissLen: 0.4 }).svg);
    // the deep reveal round each lancet
    raw(`<path d="${p2(ps)}" fill="none" stroke="${fog('#3a4446', ZW)}" stroke-width="3" opacity="0.8"/>`);
    raw(glow(...P(xc, 6.2, ZW), K(ZW) * 2.2, K(ZW) * 2.6, WL, kind === 'gone' || kind === 'broken' ? 0.14 : 0.08));
  }
  raw('</g>');
  // the breach's broken edges: course ends jutting, a heap of fallen wall in the aisle below it
  for (let k = 0; k < BR.length - 1; k++) { const [x0, y0] = BR[k], [x1, y1] = BR[k + 1]; if (y0 < 0.3 && y1 < 0.3) continue; const X = (x0 + x1) / 2, Y = (y0 + y1) / 2, inw = X < 1.7 ? 0.3 : -0.3; raw(cel(chip([P(X, Y, ZW), P(X + inw, Y + 0.05, ZW), P(X + inw * 0.8, Y + 0.32, ZW), P(X, Y + 0.3, ZW)], 0.6), { Z: ZW, fill: fog('#4a5454', ZW), band: 0.8 })); }
  raw(G.rubble(1.7, ZW - 0.6, 7.5, 1.6, fog('#3e4848', ZW), { n: 26, stone: 0.2 }));
  // the aisle vault: dark, crosshatched, its transverse ribs springing from the piers
  const atV = (s, t) => [-20 + s, 8.2, ZB + t];
  raw(`<path d="${pp([atV(0, 0), atV(40, 0), atV(40, ZW - ZB), atV(0, ZW - ZB)])}" fill="${fog('#2a3436', 18)}"/>` + hatch3(atV, 0, 40, 0, ZW - ZB, 0.5, { op: 0.5 }) + hatch3(atV, 0, 40, 0, ZW - ZB, -0.9, { op: 0.45 }));
  for (const X of PIERS) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(P(X, SPR + 3.9 * Math.sin(t * Math.PI / 2) + 0.1, ZB + (ZW - ZB) * t)); } raw(line(pts, 4, INK, 0.9) + line(pts, 2.2, fog('#4a5456', 19), 0.9)); }
  // the aisle floor, silted
  raw(`<path d="${pp([[-20, 0, ZB], [20, 0, ZB], [20, 0, ZW], [-20, 0, ZW]])}" fill="${fog('#3e4844', 19)}"/>` + hatch3((s, t) => [-20 + s, 0, ZB + t], 0, 40, 0, ZW - ZB, 0.1, { op: 0.35 }));
  // a knight's tomb in the aisle behind the fourth bay, sunk at one end into the silt and tipped: the chest, the effigy on its
  // lid (hands joined, feet on a hound), barnacles on the effigy, silt banked against it. Low and dark: it is in the fighters' band.
  {
    const Zt = 18.6, tc = (X, Y) => P(X, Y, Zt), sink = X => (X - 1.2) * 0.12;
    const x0 = 1.15, x1 = 3.85, top = X => 0.85 - sink(X);
    raw(cel([tc(x0, 0), tc(x1, 0), tc(x1, top(x1)), tc(x0, top(x0))], { Z: Zt, fill: mix(fog('#4a5452', Zt, 1.1), MURK, 0.3), tex: 'url(#mottle)', texOp: 0.4 }) + hatch3((s2, t) => [x0 + s2, t, Zt], 0, x1 - x0, 0, 0.85, 0.8, { op: 0.4 }));
    for (let k = 0; k < 4; k++) { const X = x0 + 0.3 + k * 0.62; raw(`<path d="${p2([tc(X, 0.15), tc(X + 0.4, 0.15), tc(X + 0.4, top(X + 0.4) - 0.15), tc(X, top(X) - 0.15)])}" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.6"/>`); }
    raw(cel([tc(x0 - 0.05, top(x0)), tc(x1 + 0.05, top(x1)), tc(x1 + 0.05, top(x1) + 0.1), tc(x0 - 0.05, top(x0) + 0.1)], { Z: Zt, fill: mix(fog('#5a6462', Zt, 1.1), MURK, 0.3) }));
    const ef = []; for (let i = 0; i <= 10; i++) { const X = x0 + 0.25 + (x1 - x0 - 0.5) * i / 10, hgt = [0.22, 0.26, 0.3, 0.27, 0.34, 0.3, 0.24, 0.2, 0.18, 0.22, 0.26][i]; ef.push(tc(X, top(X) + 0.1 + hgt)); }
    raw(`<path d="${smooth([tc(x0 + 0.25, top(x0 + 0.25) + 0.1), ...ef, tc(x1 - 0.25, top(x1 - 0.25) + 0.1)], true, 0.5)}" fill="${mix(fog('#6a7270', Zt, 1.1), MURK, 0.3)}" stroke="${INK}" stroke-width="0.9"/>`);
    raw(barnacles(...tc(2.3, top(2.3) + 0.35), 9, 7, Zt) + kelp(3.0, top(3.0) + 0.3, Zt - 0.05, -0.6, { w: 0.04 }));
    const silt = []; for (let k = 0; k <= 10; k++) { const X = 0.3 + 4.4 * k / 10; silt.push(tc(X, Math.max(0, 0.35 - Math.abs(X - 3.9) * 0.18) + Math.sin(k) * 0.03)); }
    raw(`<path d="${smooth([tc(0.3, 0), ...silt, tc(4.7, 0)], true, 0.5)}" fill="${mix(fog('#6e7066', Zt, 1.1), MURK, 0.3)}" opacity="0.85"/>`);
  }
}
// ---- the arcade: soffits and jambs inside each opening, then the wall with its openings cut out
for (const op of OPEN) {
  // the soffit: the arch's underside between the front and back faces, facing down (shadow)
  const front = op.slice(1, -1).map(([x, y]) => P(x, y, ZA)), back = op.slice(1, -1).map(([x, y]) => P(x, y, ZB));
  raw(`<path d="${p2([...front, ...back.reverse()])}" fill="${fog('#2a3234', ZA)}" stroke="${INK}" stroke-width="0.8"/>`);
  raw(`<path d="${p2([...front, ...back.slice().reverse()])}" fill="${S.hatchA(ZA)}" opacity="0.5"/>`);
  const xa = op[0][0], xb = op[op.length - 1][0];
  for (const [X, sgn] of [[xa, 1], [xb, -1]]) {
    // the jamb faces of the piers inside the opening (seen only on the side facing the centre)
    if ((sgn > 0 && X < 0) || (sgn < 0 && X > 0)) continue;
    const q = [[X, 0, ZA], [X, 0, ZB], [X, SPR, ZB], [X, SPR, ZA]], lit = sgn < 0;
    raw(masonry((s, t) => [X, t, ZA + s], ZB - ZA, SPR, fog(lit ? '#4a5456' : '#2e3638', ZA), { course: 0.45, block: 0.4, vary: 0.2 }) + (lit ? '' : hatch3((s, t) => [X, t, ZA + s], 0, ZB - ZA, 0, SPR, 0.7, { op: 0.5 })));
  }
  raw(hatch3((s, t) => [xa + s, SPR + t, ZA + 0.6], 0, xb - xa, 0, 3.2, 0.3, { op: 0.35, keep: (s, t) => inPoly(xa + s, SPR + t, op) }));
}
{
  // the wall plane with the openings cut out (evenodd clip), coursed stone, the wall darker toward the floor
  const outer = pp([[-20, 0, ZA], [20, 0, ZA], [20, 10, ZA], [-20, 10, ZA]]), holes = OPEN.map(o => p2(o.map(([x, y]) => P(x, y, ZA)))).join(' ');
  const cid = S.id('ar'); raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${holes}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(ashlar(at3(ZA), 40, 10, fog(STONE, ZA), { vary: 0.24, chip: 0.45, mortar: 0.62, lost: 0.22, spall: 0.26, weather: { algae: 0.25, salt: 0.38, saltCol: '#c4c8bc' }, barnBands: [[0.0, 0.7, 120], [4.75, 5.25, 220], [7.95, 8.3, 120]], barnCol: '#9a9a8c', skip: (s0, s1, t0, t1) => OPEN.some(o => inPoly(-20 + (s0 + s1) / 2, (t0 + t1) / 2, o)) }));
  for (const [yt, op] of [[3.6, 0.14], [3.0, 0.13], [2.4, 0.12], [1.8, 0.12], [1.2, 0.12], [0.6, 0.12]]) { const pts = []; for (let k = 0; k <= 40; k++) pts.push([-20 + k, yt + Math.sin(k * 1.3) * 0.12, ZA]); raw(`<path d="${pp([[-20, 0, ZA], [20, 0, ZA], ...pts.reverse()])}" fill="${MURK}" opacity="${op}"/>`); }
  raw(hatch3(at3(ZA), 0, 40, 0, 3.4, 0.8, { op: 0.42, ragged: 0.2 }) + hatch3(at3(ZA), 0, 40, 0, 1.8, -0.8, { op: 0.38, ragged: 0.3 }));
  // verdigris streaks from the bronze fittings, salt and silt tide line low on the wall
  for (let i = 0; i < 14; i++) { const X = -18 + R() * 36, top = 4.4 + R() * 3, A = P(X, top, ZA), B = P(X + (R() - 0.5) * 0.1, top - 1 - R() * 2.5, ZA); raw(line([A, lerp(A, B, 0.5).map((v, k) => v + (k ? 0 : 1)), B], 1.5 + R() * 3, VERD, 0.18 + R() * 0.15)); }
  // the string course above the arches
  const sc0 = [[-20, 7.6, ZA - 0.15], [20, 7.6, ZA - 0.15], [20, 7.9, ZA - 0.15], [-20, 7.9, ZA - 0.15]];
  raw(cel(sc0.map(p => P(...p)), { Z: ZA, fill: fog('#6a7272', ZA) }) + hatch3((s, t) => [-20 + s, 7.6 + t * 0.3, ZA - 0.15], 0, 40, 0, 1, 0.4, { op: 0.3 }));
  raw('</g>');
}
// arch rings: wedge-shaped voussoirs round each opening. Bay by bay: one ring half fallen (the breach above it open into the
// dark of the aisle roof), one with a voussoir slipped from its bed, one whose keystone has dropped
for (const op of OPEN) {
  const xa = op[0][0], xb = op[op.length - 1][0], w = xb - xa, ys = SPR, dep = 0.42, n = 6, B = bayOf(op);
  if (B.state === 'collapsed') {
    // the breach: the left half of the ring and the wall over it fell into the opening; a ragged dark hole into the aisle roof
    const br = [[xa - 0.2, 4.6], [xa + 0.3, 5.9], [xa + 0.9, 6.6], [xa + 1.6, 7.05], [xa + 2.0, 6.7], [xa + 1.75, 6.1], [xa + 1.9, 5.5], [xa + 1.2, 4.9], [xa + 0.7, 4.2]].map(([x, y]) => P(x, y, ZA));
    raw(`<path d="${p2(br)}" fill="${mix(MURK, '#000', 0.4)}" stroke="${INK}" stroke-width="1.2"/>` + `<path d="${p2(br)}" fill="${S.hatchA(ZA)}" opacity="0.5"/>`);
    // broken stones standing proud round the breach
    // broken course ends jutting into the breach: blocks still bedded in the wall, their outer ends snapped off
    const brW = [[xa - 0.2, 4.6], [xa + 0.3, 5.9], [xa + 0.9, 6.6], [xa + 1.6, 7.05], [xa + 2.0, 6.7], [xa + 1.75, 6.1], [xa + 1.9, 5.5], [xa + 1.2, 4.9], [xa + 0.7, 4.2]];
    for (let k = 0; k < brW.length - 1; k++) { const [x0b, y0b] = brW[k], [x1b, y1b] = brW[k + 1]; for (let j = 0; j < 2; j++) { const t = (j + 0.3 + R() * 0.4) / 2, X = x0b + (x1b - x0b) * t, Y = y0b + (y1b - y0b) * t, inward = (X < xa + 0.9 ? 1 : -1) * (0.2 + R() * 0.25), h = 0.28 + R() * 0.15;
      const q = [P(X - (inward < 0 ? 0.35 : 0), Y, ZA), P(X + inward, Y + (R() - 0.5) * 0.08, ZA), P(X + inward * 0.8, Y + h, ZA), P(X - (inward < 0 ? 0.35 : 0) + (inward > 0 ? -0.35 : 0), Y + h, ZA)];
      raw(cel(chip(q, 0.7), { Z: ZA, fill: fog(tone('#5e6868', 0.15), ZA, 1.1), band: 1.2, tex: 'url(#mottle)', texOp: 0.3 })); } }
    raw(S.crack(at3(ZA), xa + 22.0, 7.0, 1.4, 0.9, { w: 1.1 }) + S.crack(at3(ZA), xa + 21.9, 5.5, 1.0, -0.3, { w: 1 }));
  }
  for (const [cx, th0, th1, half] of [[xb, Math.PI, Math.PI * 2 / 3, 'L'], [xa, Math.PI / 3, 0, 'R']]) for (let i = 0; i < n; i++) {
    if (B.state === 'collapsed' && half === 'L' && i < 4) continue;
    let dy = 0, dx = 0, gap = false;
    if (B.ring === 'slipped' && half === 'R' && i === 2) { dy = -0.16; dx = 0.04; gap = true; }
    if (B.ring === 'keystone' && ((half === 'L' && i === n - 1) || (half === 'R' && i === 0))) { dy = -0.22; gap = true; }
    const a0 = th0 + (th1 - th0) * i / n, a1 = th0 + (th1 - th0) * (i + 1) / n, Q = (a, r) => P(cx + r * Math.cos(a) + dx, ys + r * Math.sin(a) + dy, ZA - 0.05);
    if (gap) { const G = (a, r) => P(cx + r * Math.cos(a), ys + r * Math.sin(a), ZA - 0.05); raw(`<path d="${p2([G(a0, w), G(a1, w), G(a1, w + dep), G(a0, w + dep)])}" fill="${mix(fog(STONE, ZA), MURK, 0.75)}"/><path d="${p2([G(a0, w), G(a1, w), G(a1, w + dep), G(a0, w + dep)])}" fill="${S.hatchA(ZA)}" opacity="0.5"/>`); }
    raw(cel(chip([Q(a0, w), Q(a1, w), Q(a1, w + dep), Q(a0, w + dep)], 0.3), { Z: ZA, fill: fog(tone('#687272', 0.2), ZA), tex: 'url(#mottle)', texOp: 0.3 }));
    if (gap) raw(S.crack(at3(ZA), cx + 20 + (w + dep) * Math.cos((a0 + a1) / 2), ys + (w + dep) * Math.sin((a0 + a1) / 2), 1.1, 1.3, { w: 1 }));
  }
}
// piers: an engaged shaft on each, a carved capital with drowned leaves, a plinth crusted with barnacles
for (const X of PIERS) {
  const Zs = ZA - 0.18, sw = 0.24, b0 = P(X - sw, 0.5, Zs), b1 = P(X + sw, SPR - 0.25, Zs);
  raw(cel([[b0[0], b1[1]], [b1[0], b1[1]], [b1[0], b0[1]], [b0[0], b0[1]]], { Z: ZA, fill: fog('#5a6466', ZA), band: (b1[0] - b0[0]) * 0.38, tex: 'url(#mottle)', texOp: 0.3 }));
  for (let k = 1; k < 9; k++) { const y = b0[1] + (b1[1] - b0[1]) * k / 9; raw(`<path d="M${f1(b0[0])} ${f1(y)} Q${f1((b0[0] + b1[0]) / 2)} ${f1(y + 1.2)} ${f1(b1[0])} ${f1(y)}" stroke="${INK}" stroke-width="0.55" fill="none" opacity="0.55"/>`); }
  raw([3.6, 3.0, 2.4, 1.8, 1.2].map(yt => `<path d="${p2([[b0[0], P(0, yt, Zs)[1]], [b1[0], P(0, yt, Zs)[1]], [b1[0], b0[1]], [b0[0], b0[1]]])}" fill="${MURK}" opacity="0.12"/>`).join('') + hatch3((s2, t) => [X - sw + s2, 0.5 + t, Zs], 0, sw * 2, 0, 2.9, 0.8, { op: 0.35 }));
  // capital: a flaring block; carved leaves gone soft under weed
  const c0 = P(X - 0.55, SPR + 0.15, ZA - 0.2), c1 = P(X + 0.55, SPR + 0.15, ZA - 0.2), c2 = P(X + 0.26, SPR - 0.3, ZA - 0.2), c3 = P(X - 0.26, SPR - 0.3, ZA - 0.2);
  raw(cel([c0, c1, c2, c3], { Z: ZA, fill: fog('#6e7676', ZA), tex: 'url(#mottle)', texOp: 0.35 }));
  for (let k = 0; k < 4; k++) { const x = c3[0] + (c2[0] - c3[0]) * (k + 0.5) / 4; raw(`<path d="M${f1(x - 3)} ${f1(c3[1])} Q${f1(x - 4)} ${f1(c0[1] + 3)} ${f1(x)} ${f1(c0[1] + 1)} Q${f1(x + 4)} ${f1(c0[1] + 3)} ${f1(x + 3)} ${f1(c3[1])}" stroke="${INK}" stroke-width="0.7" fill="${fog(VERD, ZA, 0.8)}" fill-opacity="0.35"/>`); }
  raw(cel([P(X - 0.62, SPR + 0.15, ZA - 0.22), P(X + 0.62, SPR + 0.15, ZA - 0.22), P(X + 0.62, SPR + 0.28, ZA - 0.22), P(X - 0.62, SPR + 0.28, ZA - 0.22)], { Z: ZA, fill: fog('#747c7a', ZA) }));
  // plinth
  const p0 = P(X - 0.85, 0, ZA - 0.3), p1 = P(X + 0.85, 0.5, ZA - 0.3);
  raw(cel([[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]], [p0[0], p0[1]]], { Z: ZA, fill: fog('#3e4848', ZA), tex: 'url(#mottle)', texOp: 0.4 }) + `<path d="${p2([[p0[0], p1[1]], [p1[0], p1[1]], [p1[0], p0[1]], [p0[0], p0[1]]])}" fill="${S.hatchA(ZA)}" opacity="0.35"/>`);
  raw(barnacles((p0[0] + p1[0]) / 2 - 4, p1[1] + 6, K(ZA) * 0.7, 9, ZA));
  raw(stain((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, K(ZA) * 0.5, '#243026', 0.35));
  // weed hanging off the capital
  for (let k = 0; k < 2 + Math.floor(R() * 2); k++) raw(kelp(X - 0.5 + R(), SPR + 0.15, ZA - 0.25, 0.5 + R() * 1.0, { w: 0.05 }));
  // each pier its own growth: mussel beds, anemones, a sponge on the capital, a rotten mooring rope, a broken capital
  const kind = ['mussels', 'anemone', 'sponge', 'rope', 'broken', 'mussels', 'anemone'][PIERS.indexOf(X)];
  if (kind === 'mussels') { for (let k = 0; k < 22; k++) { const x = (p0[0] + p1[0]) / 2 + (R() - 0.5) * (p1[0] - p0[0]) * 0.9, y = p1[1] - R() * 8 + 2, r2 = 1.4 + R() * 1.6, a = R() * 3; raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r2 * 1.6)}" ry="${f1(r2)}" transform="rotate(${f1(a * 57)} ${f1(x)} ${f1(y)})" fill="${fog('#1e2632', ZA, 0.5)}" stroke="${INK}" stroke-width="0.5"/><path d="M${f1(x - r2)} ${f1(y - 0.3)} l${f1(r2 * 1.4)} 0" stroke="#6a7a8a" stroke-width="0.4" opacity="0.6"/>`); } }
  if (kind === 'anemone') { for (let k = 0; k < 5; k++) { const x = b0[0] + R() * (b1[0] - b0[0]), y = P(0, 2.2 + R() * 1.4, Zs)[1], r2 = 2 + R() * 2; let fr = ''; for (let j = 0; j < 9; j++) { const a = j / 9 * 6.28; fr += `M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * r2 * 1.8)} ${f1(Math.sin(a) * r2 * 1.3 - 1)} `; } raw(`<path d="${fr}" stroke="${fog('#7a9a88', ZA, 0.5)}" stroke-width="0.7" opacity="0.8"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r2 * 0.7)}" fill="${fog('#4f7d6c', ZA, 0.5)}" stroke="${INK}" stroke-width="0.5"/>`); } }
  if (kind === 'sponge') { const x = (c0[0] + c1[0]) / 2 + 6, y = c0[1] - 2; raw(cel(chip(ell([x, y], 7, 5, 0.2, 9), 0.6), { Z: ZA, fill: fog('#8a7a48', ZA, 0.6), band: 1.5 }) + Array.from({ length: 6 }, () => `<circle cx="${f1(x + (R() - 0.5) * 9)}" cy="${f1(y + (R() - 0.5) * 6)}" r="0.8" fill="${INK}"/>`).join('')); }
  if (kind === 'rope') { const pts = [P(X - 0.3, SPR + 0.05, ZA - 0.25), P(X - 0.05, SPR - 0.6, ZA - 0.25), P(X + 0.25, SPR - 0.2, ZA - 0.25), P(X + 0.32, SPR - 1.3, ZA - 0.25)]; raw(line(pts, 3.6, INK, 1) + line(pts, 2.2, fog('#6a5a3e', ZA, 0.6), 1) + line(pts, 2.2, '#2a2014', 0.5, ' stroke-dasharray="1.4 1.8"')); raw(kelp(X + 0.32, SPR - 1.3, ZA - 0.26, 0.4, { w: 0.03 })); }
  if (kind === 'broken') { raw(`<path d="${p2([c0, lerp(c0, c1, 0.35), [lerp(c0, c1, 0.3)[0] + 3, c0[1] + 6], lerp(c3, c2, 0.25), c3])}" fill="${mix(MURK, '#000', 0.3)}" stroke="${INK}" stroke-width="0.8"/>`); }
}
// kelp hanging plumb from the arch rings into the openings; one bay choked with it from crown to floor, holdfasts rising
for (const op of OPEN) { const xa = op[0][0], xb = op[op.length - 1][0], B = bayOf(op), choked = B.state === 'kelp';
  for (let k = 0; k < (choked ? 26 : B.state === 'collapsed' ? 2 : 5); k++) { const u = choked ? 0.04 + R() * 0.92 : 0.12 + R() * 0.76, X = xa + (xb - xa) * u; let Yt = SPR; for (const [x, y] of op) if (Math.abs(x - X) < 0.3 && y > Yt) Yt = y; raw(kelp(X, Yt - 0.1, ZA - 0.1 - (choked ? R() * 0.6 : 0), choked ? Yt * (0.75 + R() * 0.25) : 0.8 + R() * 1.7 * (1 - Math.abs(u - 0.5)), { w: choked ? 0.06 + R() * 0.09 : 0.09, col: choked ? ['#141c14', '#1a2418', '#1e281a', '#18201a'][Math.floor(R() * 4)] : undefined, mid: choked ? 0.15 : undefined })); }
  if (choked) for (let k = 0; k < 9; k++) raw(kelp(xa + 0.2 + R() * (xb - xa - 0.4), 0, ZA - 0.3 - R() * 0.5, -(1.0 + R() * 2.0), { w: 0.1, col: '#1a2418' }));
}
// the void: a bite eaten out of the spandrel over the pier at X -5 and into the rings of the arches on either side. Several
// overlapping round bites, clean-rimmed; the cut runs back through the wall's thickness; the stone round it cracked and shaded.
// v3 (director: the round bites read as a cartoon blob): one irregular absence with a torn, uneven outline. It cuts straight
// across the spandrel's courses and both arch rings without breaking them (no cracks, no rubble: the stone is simply not
// there), reaches down the left ring in a broad lobe, and at three edges breaks up into ever smaller detached pieces of
// absence that end in nothing.
// Two fragments of the ring stand inside it, holding to nothing. A thin violet line at the back of the cut (as on the King).
raw(BK.tornVoid(at3(ZA - 0.06), 14.2, 6.0, 1.15, 0.72, { n: 48, rot: -0.3, lobes: [[3.85, 0.7, 0.7], [0.45, 0.45, 0.5], [1.7, 0.25, 0.4]], fray: [[0.1, 5, 0.4], [4.4, 4, 0.35], [2.2, 3, 0.3]], fraySize: 0.5, depth: 0.42, cut: fog('#33403f', ZA), islands: [[14.4, 5.75, 0.24], [15.7, 6.25, 0.15], [15.15, 5.55, 0.09]], islandCol: fog('#6a7878', ZA), fissures: 4, fissLen: 0.8, fissW: 0.03, violet: true, lip: '#b8c4bc' }).svg);
// a sailors' votive ship hung in a bay on a chain from out of frame: a model carrack, barnacled, its rigging rotted
{
  const X = 7.4, Y = 5.5, Z = 14.4, top = P(X, Y + 0.95 * 1.45, Z);
  raw(line([[top[0], 0], [top[0] + 0.5, top[1] * 0.5], top], 2.6, INK, 1) + line([[top[0], 0], [top[0] + 0.5, top[1] * 0.5], top], 1.2, fog('#5a5650', Z), 1, ' stroke-dasharray="2 1.2"'));
  figProp(X, Y, Z, (f, u) => {
    const hull = [[-0.75 * u, 0.12 * u], [-0.62 * u, 0.32 * u], [-0.2 * u, 0.42 * u], [0.45 * u, 0.4 * u], [0.82 * u, 0.22 * u], [0.9 * u, 0.06 * u], [0.55 * u, 0.12 * u], [-0.3 * u, 0.14 * u]];
    for (const [x0, x1, h] of [[-0.25, -0.25, 1.0], [0.25, 0.25, 0.8]]) { f.line([[x0 * u, 0.14 * u], [x1 * u, (0.14 - h) * u]], 9, '#1a120c'); f.line([[x0 * u, 0.14 * u], [x1 * u, (0.14 - h) * u]], 5, '#5a4630'); for (const yy of [0.25, 0.55]) f.line([[(x0 - 0.2 * (1 - yy)) * u, (0.14 - h * yy - 0.2) * u], [(x0 + 0.2 * (1 - yy)) * u, (0.14 - h * yy - 0.2) * u]], 6, '#3a2a1a'); }
    f.part(hull, { fill: '#4a3624', tex: PR.T(f, 'wood'), texOp: 0.55, shade: 0.45 });
    for (let k = 1; k < 4; k++) f.line([[-0.68 * u, (0.14 + k * 0.06) * u], [0.1 * u, (0.17 + k * 0.065) * u], [0.78 * u, (0.12 + k * 0.05) * u]], 1, '#1a120c', { op: 0.6 });
    f.part([[0.55 * u, 0.12 * u], [0.9 * u, 0.06 * u], [0.92 * u, -0.12 * u], [0.6 * u, -0.06 * u]], { fill: '#5a4430', shade: 0.4, inkW: 1.3, cast: false });
    f.part([[-0.75 * u, 0.12 * u], [-0.62 * u, -0.05 * u], [-0.38 * u, -0.02 * u], [-0.35 * u, 0.13 * u]], { fill: '#5a4430', shade: 0.4, inkW: 1.3, cast: false });
    for (let k = 0; k < 5; k++) f.line([[(-0.25 + (k % 2) * 0.5) * u, (-0.6 - k * 0.05) * u], [(-0.7 + k * 0.35) * u, 0.12 * u]], 2, '#2a2018', { op: 0.7 });
    for (let k = 0; k < 10; k++) { const x = (-0.5 + f.r() * 1.2) * u, y = (0.25 + f.r() * 0.12) * u; f.part(ell([x, y], 6, 5, 0, 8), { fill: '#b4b0a0', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); f.flat(ell([x + 1, y + 1], 2.4, 2, 0, 6), '#1a120c'); }
    f.flat([[-0.1 * u, 0.42 * u], [0.3 * u, 0.41 * u], [0.25 * u, 0.6 * u], [0.1 * u, 0.75 * u], [-0.02 * u, 0.6 * u]], KELP, { op: 0.95 });
    f.line([[0.15 * u, 0.12 * u], [0.6 * u, -0.06 * u]], 1, VERD, { op: 0.5 });
  }, { tag: false, scale: 1.45 });
}
// a drowned sanctuary lamp of tarnished gold on three chains
{
  const X = -3.3, Y = 5.0, Z = 14.0, top = P(X, Y + 1.1 * 1.35, Z);
  raw(line([[top[0], 0], top], 2.4, INK, 1) + line([[top[0], 0], top], 1.1, fog('#6a6440', Z), 1, ' stroke-dasharray="2 1.2"'));
  figProp(X, Y, Z, (f, u) => {
    for (const dx of [-0.32, 0, 0.32]) { f.line([[0, -1.1 * u], [dx * u, -0.05 * u]], 1.8, '#1a120c'); f.line([[0, -1.1 * u], [dx * u, -0.05 * u]], 0.8, GOLD, { op: 0.9, dash: '3 2' }); }
    f.part([[-0.36 * u, 0], [0.36 * u, 0], [0.26 * u, 0.2 * u], [0.06 * u, 0.3 * u], [-0.06 * u, 0.3 * u], [-0.26 * u, 0.2 * u]], { fill: GOLD, shade: 0.5, tex: PR.T(f, 'mottle'), texOp: 0.55 });
    f.part(ell([0, 0], 0.37 * u, 0.06 * u, 0, 14), { fill: mix(GOLD, '#000', 0.25), shade: 0.3, inkW: 1.2, cast: false });
    f.part([[-0.05 * u, 0.3 * u], [0.05 * u, 0.3 * u], [0.02 * u, 0.42 * u], [-0.02 * u, 0.42 * u]], { fill: GOLD, shade: 0.4, inkW: 1, cast: false });
    for (let k = 0; k < 5; k++) f.flat(ell([(-0.25 + k * 0.12) * u, (0.08 + (k % 2) * 0.06) * u], 0.04 * u, 0.022 * u, 0, 8), VERD, { op: 0.8 });
    f.line([[-0.28 * u, 0.04 * u], [-0.18 * u, 0.18 * u]], 1.2, '#e2d08a', { op: 0.4 });
  }, { tag: false, scale: 1.35 });
}
// ---- the nave floor: flags in perspective, worn ledger slabs in the middle, silt drifted against the arcade
{
  const rows = []; for (let Z = 4.2; Z < ZA; Z += 1.0 + (Z - 4) * 0.05) rows.push(Z); rows.push(ZA);
  let fl = `<path d="${pp([[-30, 0, 4.0], [30, 0, 4.0], [30, 0, ZA], [-30, 0, ZA]])}" fill="${mix('#3a4442', INK, 0.4)}"/>`;
  for (let r = 0; r < rows.length - 1; r++) {
    const z0 = rows[r], z1 = rows[r + 1], off = (r % 2) * 0.5 + R() * 0.3;
    for (let X = -26 + off; X < 26; X += 1.35 + R() * 0.3) {
      const x1 = X + 1.3 + R() * 0.25, ledger = Math.abs(X) < 3 && z0 > 8 && z0 < 12.5;
      if (ledger) continue;
      const q = [[X + 0.02, 0, z1 - 0.02], [x1 - 0.02, 0, z1 - 0.02], [x1 - 0.02, 0, z0 + 0.02], [X + 0.02, 0, z0 + 0.02]].map(p => P(...p));
      if (q[1][0] < -5 || q[0][0] > W + 5) continue;
      fl += cel(chip(q, 0.25), { Z: z0, fill: fog(tone('#3c4644', 0.08), z0, 0.8), band: Math.max(0.6, K(z0) * 0.015), tex: 'url(#mottle)', texOp: 0.3, inkW: 0.5, heavy: 0.8, hi: false });
    }
  }
  // ledger slabs: long grave stones, incised crosses and worn lettering, one cracked, one with a clean round void bite
  for (const [x0, x1, z0, z1, bite] of [[-2.8, -0.9, 8.4, 12.2, false], [-0.6, 1.2, 8.6, 12.4, true], [1.5, 2.9, 8.3, 11.8, false]]) {
    const q = [[x0, 0, z1], [x1, 0, z1], [x1, 0, z0], [x0, 0, z0]].map(p => P(...p));
    fl += cel(q, { Z: z0, fill: fog('#4a5250', z0, 0.7), tex: 'url(#mottle)', texOp: 0.3, band: 1, inkW: 0.6, heavy: 0.9 });
    const cxm = (x0 + x1) / 2, a = P(cxm, 0, z1 - 0.5), b = P(cxm, 0, z0 + 0.9), c = P(x0 + 0.4, 0, z1 - 1.2), d = P(x1 - 0.4, 0, z1 - 1.2);
    fl += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} M${f1(c[0])} ${f1(c[1])} L${f1(d[0])} ${f1(d[1])}" stroke="${INK}" stroke-width="1" opacity="0.6"/>`;
    for (let k = 0; k < 3; k++) { const A = P(x0 + 0.3, 0, z0 + 0.4 + k * 0.25), B = P(x1 - 0.3 - R() * 0.5, 0, z0 + 0.4 + k * 0.25); fl += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.7" opacity="0.4" stroke-dasharray="3 1.5 1 1.5"/>`; }
    // v3: a torn absence in the slab, not a round bite: it takes the incised cross's foot and part of the lettering
    if (bite) fl += BK.tornVoid((s2, t) => [x1 - 0.6 + s2, 0.002, z0 + t], -0.2, 1.7, 0.4, 0.8, { rot: 0.3, lobes: [[1.4, 0.35, 0.5]], fray: [[1.7, 4, 0.2], [5.2, 3, 0.15]], depth: 0.45, dir: [0, -1, 0], cut: fog('#2e3836', z0, 0.7), fissures: 2, fissLen: 0.4, violet: true }).svg;
  }
  // silt: pale drifts banked against the arcade and the plinths, rippled; low contrast
  for (let i = 0; i < 10; i++) { const X = -16 + i * 3.6 + R(), Z = ZA - 0.4 - R() * 1.6, w = 1.5 + R() * 2.5, pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push(P(X + w * t, 0, Z + Math.sin(t * Math.PI) * 0.6)); } for (let k = 10; k >= 0; k--) { const t = k / 10; pts.push(P(X + w * t, 0, Z - Math.sin(t * Math.PI) * 0.3)); } fl += `<path d="${smooth(pts, true, 0.6)}" fill="${fog('#6e7066', Z)}" opacity="0.45"/>`;
    for (let k = 0; k < 3; k++) { const A = P(X + w * 0.2, 0, Z + 0.1 - k * 0.15), B = P(X + w * 0.8, 0, Z + 0.1 - k * 0.15); fl += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + B[0]) / 2)} ${f1(A[1] - 1.2)} ${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.35"/>`; } }
  // round 2: cracks and silt runnels running back toward the arcade (perspective), a dropped flag, puddles of silt-water
  for (let i = 0; i < 20; i++) { let X = -14 + R() * 28, Z = 4.2 + R() * 3; const pts = [P(X, 0, Z)]; for (let k = 0; k < 8; k++) { X += (R() - 0.5) * 0.3 + X * 0.012; Z += 0.5 + R() * 0.5; pts.push(P(X, 0, Z)); } fl += line(pts, 0.9, INK, 0.55); }
  for (let i = 0; i < 14; i++) { const X = -12 + R() * 24, Z = 5 + R() * 8; fl += line([P(X, 0.003, Z), P(X * 1.04, 0.003, Z + 1.5 + R() * 2)], 2.2, '#6e7066', 0.22); }
  fl += occBand((s, t) => [-30 + s, 0, ZA - t], 60, 1.6, { op: 0.4, cross: true });
  fl += `<path d="${pp([[-30, 0, 4.0], [30, 0, 4.0], [30, 0, ZA], [-30, 0, ZA]])}" fill="${MURK}" opacity="0.25"/>` + hatch3((s, t) => [-30 + s, 0, 4.0 + t], 0, 60, 0, 1.6, 0.25, { op: 0.3, ragged: 0.3 });
  raw(fl);
}
// the collapsed bay's rubble: the fallen voussoirs and wall stones heaped in the opening and spilled out onto the nave floor;
// the silted bay: a bank of pale silt filling its foot, rippled. Both kept dark and quiet: they sit in the fighters' band.
for (const op of OPEN) {
  const xa = op[0][0], xb = op[op.length - 1][0], B = bayOf(op), xm = (xa + xb) / 2;
  if (B.state === 'collapsed') {
    const hp = []; for (let k = 0; k <= 14; k++) { const t = k / 14, X = xa - 1.0 + (xb - xa + 1.6) * t; hp.push(P(X, Math.max(0, Math.sin(t * Math.PI) * (1.9 - t * 0.7)) + (R() - 0.5) * 0.12, ZA - 0.5 - Math.sin(t * Math.PI) * 0.8)); }
    raw(`<path d="${smooth([P(xa - 1.0, 0, ZA - 1.2), ...hp, P(xb + 0.6, 0, ZA - 1.2)], true, 0.4)}" fill="${fog('#2c3436', 12)}" stroke="${INK}" stroke-width="1"/>` + `<path d="${smooth([P(xa - 1.0, 0, ZA - 1.2), ...hp, P(xb + 0.6, 0, ZA - 1.2)], true, 0.4)}" fill="${S.hatchA(ZA)}" opacity="0.45"/>`);
    for (let k = 0; k < 26; k++) { const t = R(), X = xa - 0.8 + (xb - xa + 1.2) * t, Y = R() * Math.max(0.1, Math.sin(t * Math.PI) * (1.7 - t * 0.7)), Z = ZA - 0.6 - R() * 1.2, [x, y] = P(X, Y, Z), r2 = K(Z) * (0.12 + R() * 0.16);
      const ww = r2 * (1.1 + R() * 0.9), hh = r2 * (0.5 + R() * 0.35), an = (R() - 0.5) * 0.7, ca2 = Math.cos(an), sa2 = Math.sin(an), blk = [[-ww, -hh], [ww * (0.7 + R() * 0.3), -hh * (0.8 + R() * 0.4)], [ww, hh], [-ww * (0.8 + R() * 0.2), hh]].map(([u, v]) => [x + u * ca2 - v * sa2, y + u * sa2 + v * ca2]);
      raw(cel(chip(blk, 0.6), { Z, fill: mix(fog(tone('#4a5456', 0.15), 11, 1.3), MURK, 0.25), band: 1.2, inkW: 0.6, heavy: 0.9 })); }
    // a whole voussoir lying on the nave floor in front of the heap, its wedge shape plain
    { const c = P(xa + 0.4, 0.15, ZA - 2.2), k2 = K(ZA - 2.2); raw(cel([[c[0] - k2 * 0.3, c[1] + k2 * 0.12], [c[0] + k2 * 0.36, c[1] + k2 * 0.1], [c[0] + k2 * 0.25, c[1] - k2 * 0.16], [c[0] - k2 * 0.2, c[1] - k2 * 0.18]], { Z: ZA - 2.2, fill: fog('#5a6464', 12, 1.2), tex: 'url(#mottle)', texOp: 0.4 }) + barnacles(c[0], c[1] - 2, 6, 5, 13)); }
  }
  if (B.state === 'silted') {
    const sp = []; for (let k = 0; k <= 12; k++) { const t = k / 12, X = xa - 0.4 + (xb - xa + 0.8) * t; sp.push(P(X, Math.max(0, 1.3 * Math.sin(t * Math.PI * 0.9 + 0.2)) + Math.sin(k * 1.9) * 0.04, ZA + 0.3)); }
    raw(`<path d="${smooth([P(xa - 1.4, 0, ZA - 1.6), ...sp, P(xb + 1.2, 0, ZA - 1.4)], true, 0.5)}" fill="${mix(fog('#5a5c54', 14, 1.15), MURK, 0.35)}" stroke="${INK}" stroke-width="0.8"/>`);
    for (let k = 0; k < 6; k++) { const y0 = 0.15 + k * 0.18, A = P(xa - 0.2 + k * 0.1, y0, ZA), B2 = P(xb - k * 0.15, y0 + 0.05, ZA); raw(`<path d="M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + B2[0]) / 2)} ${f1(A[1] - 2)} ${f1(B2[0])} ${f1(B2[1])}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.4"/>`); }
    raw(hatch3((s2, t) => [xa - 0.4 + s2, t, ZA], 0, xb - xa + 0.8, 0, 1.2, 0.4, { op: 0.3 }));
  }
}
// light from the surface far above: pale shafts falling from the upper left, made of fine parallel lines, no gradient fill
for (const [x, w] of [[140, 60], [560, 90], [980, 70]]) {
  const sk = 0.62, d = `M${x} 0 L${x + w} 0 L${x + w + 330 * sk} 330 L${x + 330 * sk - w * 0.2} 330 Z`;
  raw(`<path d="${d}" fill="${WL}" opacity="0.07"/>`);
  let ln = ''; for (let k = 0; k < w / 6; k++) { const xx = x + k * 6 + R() * 3, l = 120 + R() * 180; ln += `M${f1(xx)} 0 L${f1(xx + l * sk)} ${f1(l)} `; }
  raw(`<path d="${ln}" stroke="${WL}" stroke-width="0.6" opacity="0.2" fill="none"/>`);
}
raw(bubbles(26, 0, W, 10, 240, 1.6) + motes(140, 0, 360));

// ======================================================================== MID: low things on the floor behind the fighters
layer('mid');
// a toppled pew at the left, rotted, barnacled; a pew standing broken at the right; a fallen bronze corona between them
{
  const Z = 9.6, x0 = -8.2, x1 = -5.2, q = (X, Y) => P(X, Y, Z);
  raw(cel([q(x0, 0), q(x1, 0), q(x1 - 0.1, 0.42), q(x0 + 0.05, 0.45)], { Z, fill: fog('#3e3022', Z, 0.7), tex: 'url(#mottle)', texOp: 0.4 }));
  for (let k = 1; k < 3; k++) { const A = q(x0 + 0.05, k * 0.14), B = q(x1 - 0.1, k * 0.14 - 0.01); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.6" opacity="0.6"/>`); }
  raw(cel([q(x0 + 0.05, 0.45), q(x1 - 0.1, 0.42), q(x1 - 0.3, 0.62), q(x0 + 0.2, 0.64)], { Z, fill: fog('#4a3a28', Z, 0.7) }));
  raw(barnacles(...q(x0 + 1.2, 0.2), 10, 7, Z) + stain(...q(x0 + 2.2, 0.2), 10, '#243026', 0.4));
  raw(kelp(x0 + 0.8, 0.0, Z, -0.6, { w: 0.05 }) + kelp(x1 - 0.4, 0.0, Z, -0.45, { w: 0.05 }));
  raw(hatch3((s, t) => [x0 + s, t, Z], 0, x1 - x0, 0, 0.42, 0.8, { op: 0.35 }));
}
{
  const Z = 10.4, x0 = 5.8, x1 = 8.6, q = (X, Y) => P(X, Y, Z);
  raw(cel([q(x0, 0.4), q(x1, 0.36), q(x1, 0.46), q(x0, 0.5)], { Z, fill: fog('#4a3a28', Z, 0.7) }));
  raw(cel([q(x0 + 0.1, 0.5), q(x0 + 1.6, 0.46), q(x0 + 1.4, 0.95), q(x0 + 0.1, 1.0)], { Z, fill: fog('#3e3022', Z, 0.7), tex: 'url(#mottle)', texOp: 0.4 }));
  for (const X of [x0 + 0.15, x1 - 0.2]) raw(cel([q(X - 0.05, 0), q(X + 0.05, 0), q(X + 0.05, 0.4), q(X - 0.05, 0.4)], { Z, fill: fog('#2e2418', Z, 0.7) }));
  raw(cel([q(x1 - 0.2, 0), q(x1 + 0.6, 0.0), q(x1 + 0.5, 0.08), q(x1 - 0.15, 0.1)], { Z, fill: fog('#3e3022', Z, 0.7) }));
  raw(barnacles(...q(x0 + 0.6, 0.48), 8, 6, Z));
}
{
  // the bronze corona: a candle wheel fallen flat, verdigris, its prickets bent, its chain coiled beside it
  const X = 2.6, Z = 12.4, c = P(X, 0.05, Z), rx = K(Z) * 0.95, ry = rx * 0.1;
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${INK}" stroke-width="3.2"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${fog(VERD, Z, 0.6)}" stroke-width="1.8"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1] - 0.6)}" rx="${f1(rx * 0.97)}" ry="${f1(ry * 0.9)}" fill="none" stroke="${fog('#9ab8a8', Z, 0.6)}" stroke-width="0.5" opacity="0.6"/>`);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, x = c[0] + Math.cos(a) * rx, y = c[1] + Math.sin(a) * ry; raw(`<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 3)} ${f1(-3 - R() * 3)}" stroke="${INK}" stroke-width="1.2"/>`); }
  let ch = ''; for (let k = 0; k < 9; k++) { const a = k * 0.8, x = c[0] + rx + 8 + Math.cos(a) * 6, y = c[1] + Math.sin(a) * 1.6; ch += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2" ry="1.2" fill="none" stroke="${INK}" stroke-width="0.9"/>`; }
  raw(ch);
}
raw(bubbles(6, 200, 1300, 300, 380, 1.0));

// ======================================================================== FORE: near-black framing at the edges, over the fighters
layer('fore');
{
  const ZN = 4.6, NEAR = '#151c20';
  for (const [xa, xb] of [[-6.6, -5.0], [5.0, 6.6]]) {
    const outer = xa < 0 ? xb : xa, q = (X, Y) => P(X, Y, ZN);
    // the pier's front face
    const at = (s, t) => [xa + s, t, ZN];
    raw(ashlar(at, xb - xa, 6, mix(STONE, NEAR, 0.8), { scale: 0.85, vary: 0.12, chip: 0.5, mortar: 0.55, lost: 0.25, spall: 0.3, weather: { algae: 0.3, salt: 0.3, saltCol: '#7a8480' }, barnBands: [[0.0, 0.5, 40], [3.0, 3.35, 30]], barnCol: '#6a6c64', bandCol: '#1a2420' }));
    raw(hatch3(at, 0, xb - xa, 0, 6, 0.75, { op: 0.45 }) + hatch3(at, 0, xb - xa, 0, 6, -0.8, { op: 0.35 }));
    // the inner side face, receding (left pier: faces away from the light; right pier: faces it, still deep in shadow)
    const X = outer, back = ZN + 0.55, lit = xa > 0;
    raw(ashlar((s, t) => [X, t, ZN + s], back - ZN, 6, mix(STONE, NEAR, lit ? 0.74 : 0.85), { scale: 0.85, vary: 0.14, spall: 0.2 }) + (lit ? hatch3((s, t) => [X, t, ZN + s], 0, back - ZN, 0, 6, 0.6, { op: 0.3 }) : hatch3((s, t) => [X, t, ZN + s], 0, back - ZN, 0, 6, 0.6, { op: 0.5 }) + hatch3((s, t) => [X, t, ZN + s], 0, back - ZN, 0, 6, -0.7, { op: 0.45 })));
    const edge = [q(outer, 0), q(outer, 6)];
    raw(`<path d="M${f1(edge[0][0])} ${f1(edge[0][1])} L${f1(edge[1][0])} ${f1(edge[1][1])}" stroke="${INK}" stroke-width="2.6"/>`);
    if (lit) raw(`<path d="M${f1(edge[0][0] + 1.5)} ${f1(edge[0][1])} L${f1(edge[1][0] + 1.5)} ${f1(edge[1][1])}" stroke="${mix(STONE, '#fff3d8', 0.3)}" stroke-width="0.8" opacity="0.4"/>`);
    // barnacles and weed at its foot, kelp hanging from a ledge high up
    const bx = (q(xa, 0)[0] + q(xb, 0)[0]) / 2; raw(barnacles(bx, q(0, 0.25)[1], K(ZN) * 0.6, 16, ZN));
    for (let k = 0; k < 3; k++) raw(kelp(xa + 0.2 + R() * (xb - xa - 0.4), 3.4 + R() * 0.6, ZN - 0.05, 0.9 + R() * 0.8, { w: 0.06, col: '#1c241a' }));
  }
  // round 2: a strainer arch thrown across the nave between the near piers, low and segmental, its soffit seen from below,
  // kelp and a drowned banner's rag hanging from it: the top frame
  { const Zs = 4.5, op = G.arch(-5.0, 5.0, 2.55, 'seg', { rise: 0.7, n: 12 });
    raw(G.soffit(op, Zs, Zs + 0.45, '#18222a') + G.ring(op, Zs - 0.02, 0.3, '#2c363a', { v: 0.4 }));
    // polish: the heavy dark band over the ring is gone; only the thin ring and its soffit frame the top
    for (let k = 0; k < 7; k++) { const X = -4.2 + k * 1.3 + R() * 0.4, Y = 2.55 + 0.7 * Math.sin((X + 5) / 10 * Math.PI); raw(kelp(X, Y, Zs - 0.1, 0.25 + R() * 0.45, { w: 0.04, col: '#141c14' })); }
  }
  // the cathedral's bell rope, hanging out of the dark above, cut and frayed: its bell went down long ago
  {
    const X = -3.9, Z = 5.2, A = P(X, 2.95, Z), top = [A[0] + 6, 0];
    const pts = [top, [A[0] + 2, A[1] * 0.5], A];
    raw(line(pts, 6.4, INK, 1) + line(pts, 4.2, '#6a5a3e', 1) + line(pts, 4.2, '#2a2014', 0.6, ' stroke-dasharray="1.6 2.2"'));
    raw(`<path d="M${f1(A[0] - 3)} ${f1(A[1] - 6)} L${f1(A[0] + 3)} ${f1(A[1] - 6)}" stroke="${INK}" stroke-width="2"/>`);
    for (let k = 0; k < 7; k++) { const dx = (k - 3) * 1.1; raw(line([[A[0] + dx * 0.5, A[1] - 2], [A[0] + dx, A[1] + 6 + R() * 4], [A[0] + dx * 1.4 + (R() - 0.5) * 2, A[1] + 11 + R() * 7]], 0.9, '#8a7a56', 0.9)); }
    raw(kelp(X + 0.06, 3.3, Z - 0.02, 0.3, { w: 0.025 }));
  }
  // rubble and silt in the bottom corners: a broken capital, barnacled stones
  for (const [side, cx] of [[-1, 40], [1, W - 50]]) {
    const pts = []; for (let k = 0; k <= 9; k++) { const t = k / 9; pts.push([cx - side * 10 + side * (t - 0.5) * 220, H - 20 - Math.sin(t * Math.PI) * (36 + R() * 10)]); }
    raw(`<path d="${smooth([[cx - 130, H + 2], ...pts, [cx + 130, H + 2]], true, 0.6)}" fill="#1a2226" stroke="${INK}" stroke-width="1.6"/>`);
    raw(`<path d="${smooth([[cx - 130, H + 2], ...pts, [cx + 130, H + 2]], true, 0.6)}" fill="${S.hatchA(3)}" opacity="0.5"/>`);
    for (let k = 0; k < 5; k++) { const x = cx + (R() - 0.5) * 180, y = H - 14 - R() * 18, r = 6 + R() * 9; raw(cel(chip(ell([x, y], r * 1.3, r * 0.8, (R() - 0.5) * 0.6, 7), 0.5), { Z: 4.4, fill: tone('#2a3236', 0.2), band: 2 })); }
    raw(barnacles(cx + side * 30, H - 30, 22, 10, 4.4));
  }
  raw(bubbles(14, 20, W - 20, 30, H - 40, 2.2));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `nave_${l}.svg`), S.svgLayer(l));
// the battle camera, written beside the layers so the game and later rooms can place fighters on the same floor
fs.writeFileSync(path.join(OUT, 'nave.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log('nave layers written');
