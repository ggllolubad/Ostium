// World VII, the Icebound Fleet: THE BATTLE LINE IN THE ICE (round 2 upgrade), in Living Ink. Room key 'fleet_ice'.
// Contract as the nave: 1480 x 480 (shown at 2x); fleet_ice_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera of nave.camera.json (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Lore (bible/world_VII_icebound_fleet.md): a war fleet sailed north to kill a leviathan; the sea froze mid-battle and the
// crews are still at their posts. Encounters here: the Ice Holes (eels under the ice, a walrus on top), the Selkie's Floe.
// The place: the open sea ice between the ships of the battle line, at noon under a high thin overcast. The line runs
// off to the horizon; the two nearest ships lie locked in the white, gunports open, wales rimed and icicled; between them
// the first broadside's shot-splashes stand frozen as they rose. A lead of black water crosses the ice behind the company
// (where the selkie sings); eel holes are cut in the near ice; a drowned sailor lies under a clear patch.
// Round 2 (director notes): the hulls are curved (sheer, tumblehome strakes, wales casting shadows, quarter gallery,
// beakhead, channels breaking the port rows), ports are small and in every state; three depth planes with recession
// (near ship, splashes and second ship, the line on the horizon); the light focus is the bright sky behind the gap
// between the ships, with its glare path on the far ice; floor cues converge; fore: bowsprit and jib at the top left,
// a frozen hawser down the left edge, a heaped ice ridge and a broken mast stump at the right.
// Courses: FROST (rime, icicles, splashes stopped mid-air, pressure ice); WATER (the drowned sailor, black water, barnacles).
// Palette: white sea, black hulls, grey-blue rigging. No warm colour, no eyes, no gold, no red.
// Usage: node scenes/bg_fleet_ice.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VII');
const W = 1480, H = 480, ROOM = 'fleet_ice';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2907, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#f4f8fc', shadowTint: '#1a2430' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack } = S;
const G = require('./battle_kit_g3')(S, { air: '#c4ccd2', murk: '#2a323c' });
const { BK, BL, air, clouds, glare, wedges, snowfall, ship } = G;
const { line, pline, fillP, fillS, inkP, blob } = BK;

const ICE = '#d8e0e6', SNOW = '#eef2f4', RIME = '#e4ecf0', RIG = '#7a8a9c', MURK = '#2a323c', BLACKW = '#0a0e12', SAIL = '#a8b0b4';

// a frozen shot-splash: a lumpy tower of thrown water stopped as it rose, its crown curling outward in thick lips with
// stopped droplets beside them, a translucent spray veil round it; lit rime-white on the left, blue-grey on the right
function splash(X, Z, h, w, o = {}) {
  // a shot-splash frozen as it rose, as glass ice, not cloud: a translucent column flaring into a bell, its rim thrown out
  // into a crown of thin sheets that curl over and down, each sheet's edge fringed with icicles; flow lines run up the
  // column; frozen beads stand in the air round the crown; a churned foot of slabs
  const k = K(Z), b = P(X, 0, Z), fz = c => air(c, Z, { z0: 14, z1: 80, max: 0.5 }); let s = '';
  const col = [], n = 12; for (let i = 0; i <= n; i++) { const t = i / n, ww = k * w * (0.22 + 0.12 * Math.sin(t * 7 + X) + Math.pow(t, 2.2) * 1.5); col.push([t, ww]); }
  const Lp = col.map(([t, ww]) => [b[0] - ww, b[1] - k * h * 0.78 * t]), Rp = col.map(([t, ww]) => [b[0] + ww * 0.95, b[1] - k * h * 0.78 * t]);
  // the crown: sheets curling out and down from the rim
  const rimY = b[1] - k * h * 0.78, rimW = col[n][1], crown = [];
  const nc = 7; for (let j = 0; j <= nc; j++) { const u = j / nc - 0.5, x0 = b[0] + u * 2 * rimW, out = u * 2, up = k * h * (0.12 + 0.1 * Math.cos(u * 3) + R() * 0.08); crown.push([[x0, rimY], [x0 + out * k * w * 0.4, rimY - up], [x0 + out * k * w * 0.85, rimY - up * 0.6], [x0 + out * k * w * 1.05, rimY + k * h * (0.05 + R() * 0.08)]]); }
  const body = [...Lp, ...crown.map(c => c[1]), ...Rp.slice().reverse()];
  s += `<path d="${smooth(body, true, 0.35)}" fill="${fz('#c8dce8')}" opacity="0.88"/>`;
  // the shadow side and the core: blue-grey on the right, a deeper blue core where the ice is thickest
  s += `<path d="${smooth([...Rp.map(([x, y], i) => [x - (Rp[i][0] - Lp[i][0]) * 0.35, y]), ...Rp.slice().reverse()], true, 0.35)}" fill="${fz('#7e98ac')}" opacity="0.7"/>`;
  s += `<path d="${smooth([...Lp.map(([x, y], i) => [x + (Rp[i][0] - Lp[i][0]) * 0.4, y]), ...Rp.slice().reverse().map(([x, y], i) => [x - (Rp[n - i][0] - Lp[n - i][0]) * 0.42, y])], true, 0.35)}" fill="${fz('#a8c4d8')}" opacity="0.6"/>`;
  // flow lines up the column, curving out into the crown sheets
  for (let j = 0; j < 9; j++) { const u = (j + 0.5) / 9 - 0.5, pts = col.map(([t, ww], i) => [b[0] + u * 2 * ww * 0.9, b[1] - k * h * 0.78 * t]); pts.push([pts[n][0] + u * k * w * 0.8, rimY - k * h * 0.1]); s += line(pts, 0.7, j < 4 ? '#ffffff' : fz('#4e6a80'), j < 4 ? 0.7 : 0.5); }
  // the crown sheets: each a thin curled sheet with its lit upper face and an icicle fringe at its lip
  for (const [a0, a1, a2, a3] of crown) { s += line([a0, a1, a2, a3], Math.max(1, k * w * 0.1), fz('#dceaf2'), 0.95) + line([a0, a1, a2, a3], 0.8, INK, 0.7) + line([[a1[0] - 1, a1[1] - 1], [a2[0] - 1, a2[1] - 1]], 0.8, '#ffffff', 0.9) + BL.icicle(a3[0], a3[1], k * (0.12 + R() * 0.22), Math.max(1, k * 0.035), { col: fz(RIME) }); }
  s += `<path d="${smooth(body, true, 0.35)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.7, S.inkW(Z)))}" opacity="0.85"/>`;
  for (let i = 0; i < 18; i++) { const a = -Math.PI / 2 + (R() - 0.5) * 2.4, d = k * w * (1.2 + R() * 1.6), x = b[0] + Math.cos(a) * d * 1.3, y = rimY - k * h * 0.05 + Math.sin(a) * d * 0.7, r = Math.max(0.6, k * w * (0.03 + R() * 0.05)); s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 1.4)}" fill="${fz('#e8f2f8')}" stroke="${INK}" stroke-width="0.45"/>`; }
  s += wedges(Array.from({ length: 7 }, (_, i) => [b[0] - k * w * 1.6 + k * w * 3.2 * i / 6, b[1] + (Math.sin(i) * 0.5)]), 9, { size: [k * 0.25, k * 0.7], cols: [fz('#e4ecf0'), fz('#c4d0da'), fz('#8aa0b0')], rime: fz(SNOW), Z });
  return s;
}
// a hole in the ice: black water skinned with new ice, the rim broken into slabs, slush, a ring of trampled snow
function iceHole(X, Z, w, o = {}) {
  const k = K(Z), c = P(X, 0, Z), rx = k * w / 2, ry = rx * (P(0, 0, Z + w / 2)[1] - P(0, 0, Z - w / 2)[1]) / (k * w) * 1.0;
  const ol = S.blobST(c[0], c[1], rx * 2, Math.max(4, ry * 2), 16, 0.3);
  let s = fillS(S.blobST(c[0], c[1], rx * 2.6, Math.max(5, ry * 2.6), 14, 0.35), o.trod || '#c4ced6', 0.7);
  s += fillS(ol, BLACKW) + `<path d="${smooth(ol, true, 0.5)}" fill="none" stroke="${INK}" stroke-width="1"/>`;
  s += fillS(S.blobST(c[0] - rx * 0.2, c[1] + ry * 0.1, rx * 1.1, Math.max(2, ry * 0.7), 10, 0.4), '#2a3a48', 0.6);
  for (let i = 0; i < 4; i++) s += pline([[c[0] - rx * 0.6 + R() * rx, c[1] - ry * 0.3 + R() * ry * 0.6], [c[0] - rx * 0.3 + R() * rx, c[1] - ry * 0.2 + R() * ry * 0.6]], 0.6, '#8aa0b0', 0.6);
  // rim slabs
  for (let i = 0; i < 7; i++) { const a = R() * Math.PI * 2, x = c[0] + Math.cos(a) * rx * 1.05, y = c[1] + Math.sin(a) * ry * 1.05, ww = k * (0.15 + R() * 0.2), hh = ww * (0.3 + R() * 0.4); const q = [[x - ww, y], [x - ww * 0.6, y - hh], [x + ww * 0.7, y - hh * 0.7], [x + ww, y]]; s += cel(q, { Z, fill: tone('#c8d4dc', 0.08), band: 1 }) + BL.rimeEdge([q[1], q[2]], { w: 1, col: SNOW }); }
  return s;
}

// ======================================================================== FAR
layer('far');
// ---- the sky: a high thin overcast, brightest where the sun stands behind it (between the ships, above the line), colder
// and darker toward the top; separate cloud masses (stratocumulus), smaller and flatter toward the horizon
{
  raw(`<rect width="${W}" height="${H}" fill="#b4c0ca"/>` + G.skyGrad([[0, '#8a96a2'], [0.35, '#a8b4be'], [0.62, '#ccd4da'], [0.7, '#d8dee2']], { y0: 0, y1: 320 }));
  // the bright sky where the sun stands behind the thin cloud, over the gap between the ships: the room's light focus
  raw(G.radGlow(930, 150, 300, 150, '#f8fbfc', 0.85, { mid: 0.3, midOp: 0.55 }));
  // soft stratocumulus, smaller and flatter toward the horizon, thinning round the sun
  for (let i = 0; i < 16; i++) { const y = 20 + Math.pow(R(), 0.9) * 230, x = R() * W, sc2 = 1 - (y - 20) / 330, w = (180 + R() * 260) * sc2 + 60, near = Math.max(0, 1 - Math.hypot(x - 930, (y - 150) * 2) / 400); raw(G.softCloud(x, y, w, w * 0.22, { mid: mix('#9aa6b0', '#d8e0e6', near), shade: mix('#7a8692', '#b8c4cc', near), lit: '#eef3f6', op: 0.85 - near * 0.4, inkOp: 0.12 })); }
}
// ---- the distance: the far ice to the horizon, tabular bergs, the rest of the battle line as grey shapes, pressure ridges
{
  raw(`<path d="M-10 297 L${W + 10} 297 L${W + 10} 340 L-10 340 Z" fill="#cdd6dc"/>`);
  // tabular bergs on the horizon, palest (farthest)
  for (const [x, w, h] of [[60, 160, 9], [310, 90, 6], [1180, 220, 11], [1420, 120, 7]]) { const q = [[x - w / 2, 298], [x - w / 2 + 4, 298 - h], [x + w * 0.2, 298 - h - 1], [x + w / 2 - 6, 298 - h * 0.8], [x + w / 2, 298]]; raw(fillP(q, '#bcc6ce') + fillP([q[2], q[3], q[4], [x + w * 0.2, 298]], '#a8b4be', 0.8) + inkP(q, 0.5, 0.35)); }
  // the line of battle going away: ships at 90..200 m, hull and three masts, greyer with distance
  for (const [X, Z, l] of [[-70, 200, 34], [-30, 150, 30], [26, 120, 32], [60, 170, 28], [96, 230, 30]]) {
    const a = P(X, 0, Z), b = P(X + l, 0, Z), hy = K(Z) * 6.5, col = air('#1c1e22', Z, { z0: 20, z1: 260, max: 0.72 });
    raw(fillS([[a[0], a[1]], [a[0] - 1, a[1] - hy * 1.05], [(a[0] + b[0]) / 2, a[1] - hy * 0.85], [b[0] + 2, a[1] - hy * 0.95], [b[0], a[1]]], col));
    for (let j = 0; j < 3; j++) { const mx = a[0] + (b[0] - a[0]) * (0.22 + j * 0.27), mh = hy * (3.6 + (j === 1 ? 0.8 : 0)); raw(line([[mx, a[1] - hy * 0.8], [mx, a[1] - mh]], Math.max(0.7, K(Z) * 0.5), col, 0.9)); for (const fr of [0.55, 0.78]) raw(pline([[mx - hy * 0.5, a[1] - mh * fr], [mx + hy * 0.5, a[1] - mh * fr]], 0.8, col, 0.8)); }
    raw(line([[b[0], a[1] - hy], [b[0] + hy * 1.6, a[1] - hy * 1.8]], 0.7, col, 0.8));
  }
  // far pressure ridges: broken lines of plates across the ice, converging
  for (const [Z, x0, x1] of [[80, -60, 40], [60, -40, 30], [48, -36, 34]]) raw(wedges(Array.from({ length: 10 }, (_, i) => P(x0 + (x1 - x0) * i / 9, 0, Z + Math.sin(i) * 3)), 26, { size: [K(Z) * 0.3, K(Z) * 0.9], cols: [air('#e8eef2', Z), air('#c4d0da', Z), air('#8a9eae', Z)], hatch: false, ink: 0.5 }));
  // the glare path: the bright sky lies on the far ice under it in broken stepped strokes
  for (let i = 0; i < 60; i++) { const y = 300 + Math.pow(R(), 1.6) * 34, x = 930 + (R() - 0.5) * (60 + (y - 300) * 6), l = 6 + R() * 30; raw(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="#f4f8fa" stroke-width="${f1(0.8 + R() * 1.2)}" opacity="${f1(0.3 + R() * 0.4)}"/>`); }
}
// ---- the middle: the second ship (stern left, bow right), the frozen splashes, the near ship
const shipB = ship(10, 40, 44, { masts: [[16, 21, 5.5], [25, 24, 6.2], [33, 19, 5]], ports: [13, 12], trim: 0.5, fog: 0.22, air: '#c4ccd2', sprit: 8 });
raw(shipB.svg);
raw(splash(14.5, 58, 4.4, 0.6) + splash(4.0, 48, 4.8, 0.65));
const shipA = ship(-37, -8, 30, { masts: [[-31, 22, 6], [-22.5, 25, 6.6], [-14.5, 20, 5.2]], ports: [12, 11], trim: -0.4, gunners: true, burst: true, fog: 0.06, air: '#c4ccd2', sprit: 9 });
raw(shipA.svg);
// the near splash, in the gap between the company and their foes (far side of them in depth)
raw(splash(1.0, 25, 5.4, 0.7));
// the hulls' cold shadows on the ice in front of them (the light is behind our left shoulder: they fall back and right)
raw(fillP([P(-37, 0, 30.2), P(-6, 0, 30.2), P(-3, 0, 33), P(-34, 0, 33)], '#5a6a7a', 0.25));
// ---- the lead: a crack of black water across the ice behind the fighters, floes in it, the selkie's floe at the right
{
  const z0 = 19.5, top = [], bot = [];
  for (let i = 0; i <= 30; i++) { const X = -26 + 52 * i / 30, wv = 0.7 + 0.5 * Math.sin(i * 0.7) + R() * 0.3; top.push(P(X, 0, z0 + wv + Math.sin(i * 0.33) * 0.8)); bot.push(P(X, 0, z0 - 1.4 - wv * 0.6 + Math.sin(i * 0.33) * 0.8)); }
  raw(fillP([...top, ...bot.slice().reverse()], '#141c24') + pline(bot, 1, INK, 0.7) + pline(bot.map(([x, y]) => [x, y + 1.2]), 1, SNOW, 0.6));
  for (let i = 0; i < 22; i++) { const t = R(), p = [top[Math.floor(t * 30)][0], (top[Math.floor(t * 30)][1] + bot[Math.floor(t * 30)][1]) / 2], w = 6 + R() * 16; raw(`<path d="M${f1(p[0] - w / 2)} ${f1(p[1])} l${f1(w)} 0" stroke="#5a6a7a" stroke-width="0.8" opacity="0.6"/>`); }
  for (const [X, w] of [[-12, 1.6], [6, 2.4], [12.5, 3.2]]) { const c = P(X, 0.1, z0 + 0.3), k = K(z0); const q = [[c[0] - k * w / 2, c[1]], [c[0] - k * w * 0.4, c[1] - k * 0.18], [c[0] + k * w * 0.45, c[1] - k * 0.16], [c[0] + k * w / 2, c[1]], [c[0] + k * w * 0.3, c[1] + k * 0.06], [c[0] - k * w * 0.35, c[1] + k * 0.05]]; raw(cel(q, { Z: z0, fill: '#c8d2da', band: 1.2 }) + BL.rimeEdge([q[1], q[2]], { w: 1.2, col: SNOW })); }
}
// ---- the quiet band: stepped toward a cold murk behind the fighters
raw(BL.quiet(MURK, 236, 352, { steps: [0.07, 0.09, 0.12, 0.15], hop: 0.1 }));
// ---- the sea ice the company stands on
{
  const at = (s, t) => [-30 + s, 0, 4 + t], Lz = 13.6;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="${ICE}"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.14"/>`);
  // sastrugi: wind-carved snow ridges, long and parallel, running away from us (they converge on the vanishing point)
  for (let i = 0; i < 46; i++) { const X = -18 + R() * 36, Z = 4.4 + Math.pow(R(), 0.9) * 13, dz = 0.8 + R() * 2.4, A = P(X, 0, Z), B2 = P(X + (R() - 0.5) * 0.4, 0, Z + dz), h = Math.max(0.8, K(Z) * 0.05);
    raw(`<path d="M${f1(A[0] - h * 1.2)} ${f1(A[1])} L${f1(B2[0])} ${f1(B2[1])} L${f1(A[0] + h * 1.2)} ${f1(A[1])} Z" fill="${SNOW}" opacity="0.85"/><path d="M${f1(A[0] + h * 0.3)} ${f1(A[1])} L${f1(B2[0])} ${f1(B2[1])}" stroke="#8a9aac" stroke-width="${f1(Math.max(0.5, h * 0.5))}" opacity="0.65"/>`); }
  // pressure cracks running away from us and across, with a lit lower lip
  for (let i = 0; i < 7; i++) raw(crack((s, t) => [s, 0.002, t], -14 + R() * 28, 4.6 + R() * 5, 3 + R() * 5, Math.PI / 2 + (R() - 0.5) * 0.9, { w: 0.9, lip: '#f4f8fc', op: 0.7 }));
  for (let i = 0; i < 3; i++) raw(crack((s, t) => [s, 0.002, t], -16 + R() * 10, 9 + R() * 6, 6 + R() * 6, (R() - 0.5) * 0.3, { w: 0.8, lip: '#f4f8fc', op: 0.55 }));
  // the clear patch: glazed black ice, and under it the drowned sailor, pale and swollen, face up, hands spread
  { const Z = 7.4, c = P(-1.8, 0, Z), k = K(Z), rx = k * 1.3, ry = k * 0.17;
    raw(fillS(S.blobST(c[0], c[1], rx * 2, ry * 2, 14, 0.25), '#2a3a48'));
    const fz = [c[0] - rx * 0.35, c[1] - ry * 0.05];
    raw(`<g opacity="0.6">${fillS([[fz[0] - k * 0.2, fz[1]], [fz[0] - k * 0.12, fz[1] - k * 0.07], [fz[0] + k * 0.12, fz[1] - k * 0.07], [fz[0] + k * 0.22, fz[1]], [fz[0] + k * 0.12, fz[1] + k * 0.06], [fz[0] - k * 0.12, fz[1] + k * 0.06]], '#a8b4b8')}` +
      `<path d="M${f1(fz[0] - k * 0.05)} ${f1(fz[1] - k * 0.02)} l${f1(k * 0.04)} 0 M${f1(fz[0] + k * 0.05)} ${f1(fz[1] - k * 0.02)} l${f1(k * 0.04)} 0 M${f1(fz[0])} ${f1(fz[1] + k * 0.03)} l${f1(k * 0.06)} 0" stroke="#4a5458" stroke-width="0.8"/>` +
      fillS([[fz[0] + k * 0.22, fz[1] - k * 0.03], [fz[0] + k * 0.9, fz[1] - k * 0.06], [fz[0] + k * 1.05, fz[1]], [fz[0] + k * 0.9, fz[1] + k * 0.07], [fz[0] + k * 0.22, fz[1] + k * 0.04]], '#6a7a84') +
      [[-0.35, -0.08], [0.55, -0.1], [0.5, 0.1]].map(([dx, dy]) => `<ellipse cx="${f1(fz[0] + k * dx)}" cy="${f1(fz[1] + k * dy)}" rx="${f1(k * 0.09)}" ry="${f1(k * 0.03)}" fill="#a8b4b8"/>`).join('') + `</g>`);
    raw(fillS(S.blobST(c[0], c[1], rx * 2, ry * 2, 14, 0.25), '#c8d8e4', 0.18) + `<path d="${smooth(S.blobST(c[0], c[1], rx * 2, ry * 2, 14, 0.25), true, 0.6)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`);
    for (let j = 0; j < 5; j++) raw(`<path d="M${f1(c[0] - rx * 0.8 + R() * rx * 1.4)} ${f1(c[1] - ry * 0.6 + R() * ry)} l${f1(k * 0.3)} 0" stroke="#f4f8fc" stroke-width="0.8" opacity="0.55"/>`); }
  // things frozen into the ice: a spar, a cask, a coil of rope
  { const Z = 11.5, k = K(Z); const a = P(-10.5, 0.03, Z), b = P(-7.8, 0.05, Z + 0.8); raw(line([a, b], k * 0.1 + 2, INK) + line([a, b], k * 0.1, '#5a626a') + BL.rimeEdge([a, b], { w: 2.2, col: SNOW })); }
  { const c = P(8.4, 0, 9.4), k = K(9.4); raw(cel([[c[0] - k * 0.28, c[1]], [c[0] + k * 0.28, c[1]], [c[0] + k * 0.3, c[1] - k * 0.25], [c[0] - k * 0.3, c[1] - k * 0.25]], { Z: 9.4, fill: '#3a3a3c', band: 1.5 }) + BL.rimeEdge([[c[0] - k * 0.3, c[1] - k * 0.25], [c[0] + k * 0.3, c[1] - k * 0.25]], { w: 2, col: SNOW })); }
  { const c = P(4.2, 0.01, 12.2), k = K(12.2); for (let j = 0; j < 4; j++) raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - j * 1.2)}" rx="${f1(k * (0.35 - j * 0.06))}" ry="${f1(k * (0.06 - j * 0.008))}" fill="none" stroke="${INK}" stroke-width="2"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1] - j * 1.2)}" rx="${f1(k * (0.35 - j * 0.06))}" ry="${f1(k * (0.06 - j * 0.008))}" fill="none" stroke="#6a7480" stroke-width="1"/>`); }
  // the front of the floor below the feet: a cold shadow band (the near ridge's shadow) hatched raggedly
  raw(occBand((s, t) => [-30 + s, 0, 4 + t], 60, 1.2, { op: 0.28 }));
}

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  const Z = 10.6, k = K(Z);
  // eel holes cut in the ice (the Ice Holes), black water skinned with new ice, trampled snow round them
  raw(iceHole(-4.2, 9.6, 1.4) + iceHole(5.6, 11.4, 1.1));
  // a ship's boat frozen in keel up, its oars standing; a broken topmast lying with its rigging frozen over the ice
  { const c = P(-10.8, 0, Z + 2); const hull = [[c[0] - k * 1.2, c[1]], [c[0] - k * 1.0, c[1] - k * 0.35], [c[0] + k * 0.9, c[1] - k * 0.4], [c[0] + k * 1.3, c[1] - k * 0.08], [c[0] + k * 1.2, c[1]]];
    raw(cel(hull, { Z, fill: '#4a525a', tex: 'url(#mottle)', texOp: 0.4, band: 2 }) + `<path d="${smooth([hull[0], [hull[1][0], hull[1][1] - 3], [hull[2][0], hull[2][1] - 4], hull[3], [hull[3][0] - k * 0.2, hull[3][1] + k * 0.15], [hull[0][0] + k * 0.3, hull[0][1] - k * 0.2]], true, 0.5)}" fill="${SNOW}" stroke="${INK}" stroke-width="0.7"/>` + BL.icicles([c[0] - k * 1.5, c[1] - k * 0.05], [c[0] + k * 1.5, c[1] - k * 0.05], 10, { max: k * 0.3 }));
    for (const dx of [1.9, 2.3]) raw(line([[c[0] + k * dx, c[1]], [c[0] + k * (dx + 0.15), c[1] - k * 1.3]], 2.4, INK) + line([[c[0] + k * dx, c[1]], [c[0] + k * (dx + 0.15), c[1] - k * 1.3]], 1.2, '#4a4a4c') + BL.rimeEdge([[c[0] + k * dx - 1, c[1] - k * 0.2], [c[0] + k * (dx + 0.15) - 1, c[1] - k * 1.3]], { w: 1.2, col: SNOW })); }
  { const a = P(8.0, 0.08, Z + 2.5), b = P(11.6, 0.15, Z + 1.6); raw(line([a, b], k * 0.11 + 2, INK) + line([a, b], k * 0.11, '#4a525a') + BL.rimeEdge([a, b], { w: 2, col: SNOW }));
    for (let j = 0; j < 5; j++) { const u = 0.15 + j * 0.17, p = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; raw(line([p, [p[0] - k * 0.3, p[1] + k * 0.12]], 0.8, RIG, 0.9)); } }
  // the walrus's haul-out: churned snow and a slab broken up at an eel hole's edge (low)
  raw(wedges([P(4.4, 0, 11.6), P(6.8, 0, 11.4)], 5, { size: [6, 12], cols: ['#c8d4dc', '#a8b8c6', '#6a7e8e'], rime: SNOW, Z: 11 }));
}

// ======================================================================== FORE: framing over the fighters
layer('fore');
{
  // top left: the near ship's bowsprit and jib-boom coming in across the top, rimed, hung with icicles; its frozen jib a
  // stiff grey slab with its sheet frozen in a curve
  const A = [-20, 52], B = [W * 0.48, -20];
  raw(line([A, B], 24, INK) + line([A, B], 19, '#24262a') + line([[A[0], A[1] - 6], [B[0], B[1] - 6]], 3, '#3a3e44', 0.8) + BL.rimeEdge([[A[0], A[1] - 10], [B[0], B[1] - 10]], { w: 6, col: SNOW }));
  { const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u + 9]); } for (let i = 0; i < 30; i++) { const p = pts[i]; raw(BL.icicle(p[0] + R() * 12, p[1], 6 + Math.pow(R(), 1.8) * 44, 3 + R() * 2, {})); } }
  { const sl = [[40, 56], [330, 30], [262, 128], [120, 150]]; raw(cel(sl, { Z: 4, fill: SAIL, tex: 'url(#mottle)', texOp: 0.4, band: 6 }) + `<path d="${p2(sl)}" fill="${S.hatchA(4)}" opacity="0.25"/>` + BL.icicles(sl[3], sl[2], 12, { max: 30 }) + BL.rimeEdge([sl[0], sl[1]], { w: 4, col: SNOW })); for (let j = 0; j < 4; j++) raw(line([[70 + j * 60, 54 - j * 6], [130 + j * 40, 146 - j * 4]], 1, '#6a7480', 0.6)); }
  // the left edge: a frozen hawser coming down from the bowsprit into the ice, stiff as a bar, icicled along its length
  { const a = [70, 40], b = [14, H + 10]; raw(line([a, b], 13, INK) + line([a, b], 10, '#6a7078') + line([[a[0] - 2, a[1]], [b[0] - 2, b[1]]], 10, '#5a6068', 1, ' stroke-dasharray="5 7"') + BL.rimeEdge([[a[0] - 6, a[1]], [b[0] - 6, b[1]]], { w: 4, col: SNOW })); for (let i = 0; i < 12; i++) { const u = 0.1 + i * 0.075, p = [a[0] + (b[0] - a[0]) * u + 4, a[1] + (b[1] - a[1]) * u]; raw(BL.icicle(p[0], p[1], 6 + R() * 16, 2.5, {})); } }
  // the right edge: pressure ice heaped against a broken mast stump standing out of the ice, rimed, with a shroud
  { const x = W - 52; raw(cel([[x - 18, H + 5], [x - 16, 150], [x - 4, 138], [x + 6, 152], [x + 12, 144], [x + 18, H + 5]], { Z: 3.6, fill: '#1e2024', band: 6 }) + BL.rimeEdge([[x - 18, 260], [x - 16, 150], [x - 4, 138]], { w: 6, col: SNOW }));
    for (let i = 0; i < 6; i++) raw(pline([[x - 16, 170 + i * 46], [x + 16, 168 + i * 46]], 1.2, INK, 0.6));
    raw(line([[x - 6, 150], [x - 160, H + 10]], 2.4, RIG) + BL.icicles([x - 40, 220], [x - 120, 400], 9, { max: 20 }));
    raw(wedges([[W - 280, H + 8], [W - 200, H + 4], [W - 90, H + 2], [W + 20, H + 2]], 14, { size: [18, 54], cols: ['#b8c8d4', '#7e94a6', '#4a5e70'], rime: SNOW, Z: 3.8 })); }
  // a low front drift across the bottom left: snow banked by the wind
  { const bank = []; for (let k = 0; k <= 10; k++) bank.push([k * 30 - 10, H - 10 - Math.sin(k / 10 * Math.PI) * 16 - R() * 5]); raw(cel([[-10, H + 4], ...bank, [290, H + 4]], { Z: 3.6, fill: '#c8d4dc', band: 4 }) + BL.rimeEdge(bank, { w: 3, col: SNOW })); }
  // fine snow in the air
  raw(snowfall(150, { len: 2.4, slant: 0.5, op: 0.5 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
