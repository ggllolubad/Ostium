// World XV, the Torn Sky: THE GATE OF HEAVEN (battle room `sky_gate`; finale-tier rebuild, 2026-11-24, kit
// battle_kit_xv.js). Heaven's rim, high above an endless sea of cloud under a cold sun. A causeway of pale paving runs out
// from the fighters to the gate of heaven: two towers of weathered stone a hundred metres tall, their faces carved with
// niches of the host and string-courses of gilt (modelled gilt only on the carved holy work, the stone itself bare and
// weathered). The arch between them broke at the crown when the sky tore; its voussoirs lift away from the break in
// order, each a little further. One gate leaf, a gilt grille forty metres tall, hangs from a fused hinge; the other lies
// flat on the causeway where it fell. Where the outer sky should be, the gateway is torn open: a clean-rimmed absence
// fills the arch and runs on behind the towers, and something enormous looks in. Along the rim, out over the clouds,
// the colossi of the host kneel on their columns facing the gate, heads bowed, at kilometre scale. Encounters: The Tear
// (hounds come through the rift), Between the Stars (something swims through the tear). No war: nothing here fought.
// Light: the high cold sun at the upper left; the light key of the world. Lightning only as violet burns on surfaces.
// Usage: node scenes/bg_sky_gate.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XV');
const { S, B, G, X } = require('./battle_kit_xv').make(15311, '#2a2a36', '#3a3a4c', '#c6cad8');
const { P, K, p2, f1, INK, raw, layer, cel, chip, mix, R, smooth, inkW, hatchA, hatchB } = S;
const { line, pline, fillP, fillS, inkP, blob, jag, fused, quiet } = B;
const { W, H, GOLD, GOLDL, GOLDD, BLACK } = G;
const { fade, burnV, grad, rgrad, blurF, glowE, sky, softCloud, cloudSea, shaftG, weather, stone, giltW, tearS, island, halo, colossus, chainC, driftSeq } = X;
const AIRC = '#c6cad8', STONE = '#cfc8bc', STONEK = '#8a8494', SUN = '#fffaf0';
const ZG = 110, GX = 9.8, HALF = 25, TW = 20;           // the gate: depth, centre X, half-opening, tower width (m)
const SPR = 22;                                        // the arch springs at 22 m; semicircular, crown at 47 m

// ======================================================================== FAR
layer('far');
raw(sky([[0, '#4a5470'], [0.3, '#7a849c'], [0.55, '#b4bac8'], [0.63, '#e4e6ec'], [0.66, '#f4f4f2'], [1, '#c8ccd6']], [[150, 30, 420, 260, '#ffffff', 0.85], [150, 30, 90, 70, SUN, 1], [150, 30, 40, 32, '#ffffff', 1]]));
// high thin cloud: long soft streaks across the upper sky, lit from the sun
for (const [x, y, w, h] of [[640, 40, 620, 18], [1150, 90, 500, 14], [380, 130, 400, 12], [1320, 20, 400, 16]]) raw(`<path d="${smooth(blob(x, y, w / 2, h, 16, 0.35, -0.03), true, 0.5)}" fill="#eef0f4" opacity="0.45" filter="${blurF(h * 0.5)}"/>`);
// far cumulus on the horizon, lit white from the upper left
raw(softCloud(300, 258, 520, 60, { col: '#b8bcca', lit: '#ffffff', dark: '#7a7e92', light: [-0.6, -0.8], fronts: 3, rim: 6, wisps: 2, inkOp: 0.15 }));
raw(softCloud(1260, 250, 560, 74, { col: '#aeb2c2', lit: '#ffffff', dark: '#6e7286', light: [-0.6, -0.8], fronts: 3, rim: 7, wisps: 2, inkOp: 0.15 }));
// the sea of cloud, glaring under the sun, to the horizon
raw(cloudSea(298, 480, { col: '#b0b4c4', lit: '#ffffff', dark: '#6a6e84', rows: 8, big: 1.6, light: [-0.6, -0.8] }));
// a far island of heaven low on the right horizon, waterfalls off its lip, small in the glare
raw(island(1390, 232, 150, { k: 0.62, col: '#b0a89c', depth: 0.5, build: [{ type: 'cathedral', u: 0.0, s: 0.5 }, { type: 'tower', u: 0.36, s: 0.2, h: 1.3 }], falls: [[-0.44, 0.03], [0.4, 0.025]], fallLen: 70, baseFade: 0.9 }));

// ---- the kneeling colossi of the host along the rim, on columns rising out of the clouds, facing the gate
{
  const pillar = (x, yTop, w, k) => { const q = [[x - w / 2, yTop], [x + w / 2, yTop], [x + w * 0.56, H + 5], [x - w * 0.56, H + 5]], c = fade(STONE, k), d = fade(mix(STONE, '#2a2a3a', 0.5), k);
    return fillP(q, c) + fillP([[x + w * 0.1, yTop], [x + w / 2, yTop], [x + w * 0.56, H + 5], [x + w * 0.12, H + 5]], d, 0.7) + `<path d="${p2(q)}" fill="url(#mottle)" opacity="0.3"/>` + inkP(q, 0.8, 1 - k * 0.6) + pline([[x - w * 0.55, yTop + 4], [x + w * 0.55, yTop + 4]], 1, fade(GOLD, k * 0.8), 1 - k * 0.5); };
  // far right pair member, then the far left, then the nearer ones (painter's order by depth)
  raw(pillar(470, 266, 70, 0.72) + colossus(470 - 30, 266, 200, 1, { k: 0.72, col: '#d4cec4', pose: 'headless' }));
  raw(pillar(190, 300, 120, 0.55) + colossus(190 - 40, 300, 320, 1, { k: 0.55, con: 0.5, col: '#ccc6c0' }));
  raw(pillar(1400, 298, 130, 0.5) + colossus(1400 + 60, 298, 380, -1, { k: 0.5, con: 0.7, col: '#d6d0c6', pose: 'voidface', wing: 'broken' }));
  // the haze the rim stands in: a veil over the colossi's feet
  raw(`<rect x="-10" y="230" width="${W + 20}" height="120" fill="${grad([[0, AIRC, 0], [0.6, AIRC, 0.45], [1, AIRC, 0.3]], 0, 230, 0, 350)}"/>`);
}

// ---- THE TEAR: the gateway torn open onto nothing, running on behind the towers; something enormous looks in
const gx = x => P(x, 0, ZG)[0], gy = y => P(0, y, ZG)[1], KG = K(ZG);
let tearPoly;
{
  const t = tearS(gx(GX), gy(30), (2 * HALF + 34) * KG, 52 * KG, { tears: 3, tearLen: 0.4, teeth: 2, slivers: 6, flecks: 30, mat: '#b8bccc', edge: '#9a86c8', edgeOp: 0.7, n: 90 });
  raw(t.svg); tearPoly = t.outline;
  // inside the black: one vast eye half open, turned down toward the causeway
  const cl = S.id('tv'); raw(`<clipPath id="${cl}"><path d="${p2(tearPoly)}"/></clipPath><g clip-path="url(#${cl})">`);
  // (no stars: the void is a clean absence)
  const ec = [t.center[0] + 95, t.center[1] - 12];
  raw(X.voidEye(ec[0], ec[1], 150, { open: 0.34, look: [-0.45, 0.55], rot: -0.05, lip: '#3a3246', skin: '#3a3044' }));
  raw('</g>');
}

// ---- THE GATE: two towers of weathered stone, carved with niches of the host, gilt only on the carved holy work
function tower(x0, x1, inner) {
  const Yt = 60, a = P(x0, 0, ZG), b = P(x1, Yt, ZG), face = [[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]];
  let s = '';
  // the side face toward the opening (thin, in shade on the right tower, lit on the left one)
  const xs = inner === 'right' ? x1 : x0, sideP = [P(xs, 0, ZG), P(xs, Yt, ZG), P(xs, Yt, ZG + 16), P(xs, 0, ZG + 16)];
  s += fillP(sideP, inner === 'right' ? mix(STONE, STONEK, 0.3) : mix(STONE, STONEK, 0.7)) + `<path d="${p2(sideP)}" fill="${hatchA(ZG)}" opacity="${inner === 'right' ? 0.15 : 0.5}"/>` + inkP(sideP, 0.8);
  // the face: coursed ashlar, weathered
  s += `<path d="${p2(face)}" fill="${STONE}"/>`;
  const at = (u, v) => [x0 + u, v, ZG];
  s += S.ashlar(at, x1 - x0, Yt, STONE, { scale: 2.2, vary: 0.18, lost: 0.12, spall: 0.25 });
  s += weather(face, { col: STONE, op: 1, stainGap: 3, pitArea: 25, cracks: 2, lichenN: 2 });
  // the light: the face toward the opening on the right tower is in its own shadow side; a soft shade band
  if (inner === 'left') s += `<path d="${p2([[b[0] - (b[0] - a[0]) * 0.25, b[1]], [b[0], b[1]], [b[0], a[1]], [b[0] - (b[0] - a[0]) * 0.25, a[1]]])}" fill="${hatchA(ZG)}" opacity="0.3"/>`;
  else s += `<path d="${p2(face)}" fill="${mix(STONEK, '#3a3a4a', 0.3)}" opacity="0.25"/><path d="${p2([[a[0] + (b[0] - a[0]) * 0.7, b[1]], [b[0], b[1]], [b[0], a[1]], [a[0] + (b[0] - a[0]) * 0.7, a[1]]])}" fill="${hatchA(ZG)}" opacity="0.35"/>`;
  // plinth and string courses (gilt run along the carved moulding, worn)
  for (const [y0, y1, gilt] of [[0, 3.2, false], [14, 15, true], [SPR - 1, SPR + 0.6, true], [36, 37.2, true], [50, 51, false]]) { const p = P(x0 - 0.8, y1, ZG), q = P(x1 + 0.8, y0, ZG), sq = [[p[0], p[1]], [q[0], p[1]], [q[0], q[1]], [p[0], q[1]]];
    s += gilt ? giltW(sq, ZG, { dim: 0.05, cracks: 4, lost: 2, wear: 0.9 }) : stone(sq, ZG, mix(STONE, '#fff', 0.1), { band: 2, w: { op: 0.8 } }); }
  // pilaster buttresses at both edges of the face (projecting strips, lit and shaded)
  for (const [u0, u1] of [[0, 2.2], [x1 - x0 - 2.2, x1 - x0]]) { const p = P(x0 + u0, Yt, ZG), q = P(x0 + u1, 0, ZG), sq = [[p[0], p[1]], [q[0], p[1]], [q[0], q[1]], [p[0], q[1]]]; s += stone(sq, ZG, mix(STONE, '#fff', 0.12), { band: 3, chip: false, w: { op: 0.9, stainGap: 3 } }) + `<path d="${p2([[q[0] - (q[0] - p[0]) * 0.35, p[1]], [q[0], p[1]], [q[0], q[1]], [q[0] - (q[0] - p[0]) * 0.35, q[1]]])}" fill="${hatchA(ZG)}" opacity="0.4"/>`; }
  // ONE colossal niche per tower, 30 m tall, with a standing angel of the host; on one tower the void has taken the
  // statue and left a clean-rimmed absence with an eye in it
  { const c = (x0 + x1) / 2, nw = (x1 - x0) * 0.62, v0 = 4.2, hh = 31, ol = G.pointed(-nw / 2, nw / 2, hh * 0.74, 12, 0.85).map(([u, v]) => P(c + u, v0 + v, ZG));
    s += fillP(ol, '#4e4a5a') + `<path d="${p2(ol)}" fill="${grad([[0, '#2a2632', 0.7], [1, '#6a6474', 0.1]], 0, ol[0][1] - KG * hh, 0, ol[0][1])}"/>` + `<path d="${p2(ol)}" fill="${hatchA(ZG)}" opacity="0.4"/>` + inkP(ol, 1.2);
    // the niche's moulded frame: a gilt fillet inside a stone roll
    s += line(ol.slice(1, -1).map(([x, y]) => [x - 2, y - 2]), 4, mix(STONE, '#fff', 0.15)) + line(ol.slice(1, -1).map(([x, y]) => [x - 2, y - 2]), 1.6, mix(GOLD, STONE, 0.1), 0.95) + line(ol.slice(1, -1), 1, INK, 0.8);
    const bx = P(c, v0, ZG), u = KG * hh * 0.82 / 3.2;
    if (inner === 'left') s += niche(bx, u, false);
    else { s += tearS(bx[0] + u * 0.1, bx[1] - u * 1.25, u * 1.1, u * 1.5, { tears: 3, tearLen: 0.35, teeth: 2, slivers: 5, flecks: 12, mat: STONE }).svg; const ec2 = [bx[0] + u * 0.1, bx[1] - u * 1.4]; s += X.voidEye(ec2[0], ec2[1], u * 0.34, { open: 0.4, look: [-0.5, 0.4], lips: 0, skin: '#2a2234' }); } }
  // above the niche: a gilt roundel carved with the god's glory (rays), weathered; then small high lancets (scale)
  { const c = P((x0 + x1) / 2, 43, ZG), r = KG * 4.4; let g = '';
    for (let i = 0; i < 16; i++) { const a0 = i / 16 * Math.PI * 2, a1 = a0 + Math.PI / 16 * 0.8; g += giltW([[c[0] + Math.cos(a0) * r * 0.42, c[1] + Math.sin(a0) * r * 0.42], [c[0] + Math.cos(a0) * r, c[1] + Math.sin(a0) * r], [c[0] + Math.cos(a1) * r, c[1] + Math.sin(a1) * r], [c[0] + Math.cos(a1) * r * 0.42, c[1] + Math.sin(a1) * r * 0.42]], ZG, { dim: 0.04 + (Math.sin(a0) + 1) * 0.1, cracks: 1, lost: 0, wear: 0.5, burnish: false }); }
    s += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 1.08)}" fill="${mix(STONE, STONEK, 0.4)}" stroke="${INK}" stroke-width="1"/>` + g + `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.4)}" fill="${BLACK}" stroke="${INK}" stroke-width="0.8"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.3)}" fill="none" stroke="${GOLD}" stroke-width="1"/>`;
    if (inner === 'left') { s += B.char(c[0] + r * 0.3, c[1] + r * 0.2, r * 0.9, r * 0.8, { op: 0.75, Z: ZG }) + burnV(c[0] + r * 0.3, c[1], 0.8, r * 3, 1.8, { depth: 4 }); }
    for (const du of [-5.5, -2, 2, 5.5]) { const ol = G.pointed(-0.7, 0.7, 2.8, 5, 0.9).map(([u, v]) => P((x0 + x1) / 2 + du, 52.5 + v, ZG)); s += fillP(ol, '#3a3644') + inkP(ol, 0.6); } }
  if (inner === 'left') { const q0 = P(x1, SPR + 6, ZG), pts = [q0, P(x1 - 3.5, SPR + 7.5, ZG), P(x1 - 4.5, SPR + 12, ZG), P(x1 - 2, SPR + 16, ZG), P(x1, SPR + 15, ZG)]; s += fillP(pts, '#5a5462') + `<path d="${p2(pts)}" fill="${hatchA(ZG)}" opacity="0.5"/>` + inkP(jag(pts[0], pts[3], 6, 3).concat([pts[4]]), 1.1); }
  else { const p = P(x1 - 1.1, 50, ZG); s += B.char(p[0], P(0, 30, ZG)[1], KG * 1.3, KG * 14, { op: 0.6, Z: ZG }); }
  // violet burns scarred down the face from the strike that broke the arch
  const cl = S.id('tw'); s += `<clipPath id="${cl}"><path d="${p2(face)}"/></clipPath><g clip-path="url(#${cl})">${burnV(inner === 'left' ? b[0] - 12 : a[0] + 14, gy(SPR + 1), Math.PI / 2 + (inner === 'left' ? 0.25 : -0.25), 160, 2.6, { depth: 5 })}</g>`;
  s += inkP(face, 1.2);
  return s;
}
function niche(b, u, headless) {
  const T = (x, y) => [b[0] + x * u, b[1] - y * u];
  const sh = (pts, f) => `<path d="${smooth(pts.map(p => T(...p)), true, 0.5)}" fill="${f}"/><path d="${smooth(pts.map(p => T(...p)), true, 0.5)}" fill="none" stroke="${INK}" stroke-width="0.8"/>`;
  let s = sh([[-0.1, 1.2], [-0.5, 1.5], [-0.62, 2.1], [-0.5, 2.7], [-0.36, 2.95], [-0.3, 2.5], [-0.14, 1.95]], mix(STONE, STONEK, 0.45)) + sh([[0.1, 1.2], [0.5, 1.5], [0.6, 2.1], [0.48, 2.75], [0.34, 3.0], [0.28, 2.5], [0.14, 1.95]], mix(STONE, STONEK, 0.2));
  for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) s += `<path d="${smooth([T(sx * 0.16, 1.4 + i * 0.32), T(sx * (0.36 + i * 0.03), 1.6 + i * 0.35), T(sx * (0.5 - i * 0.02), 1.75 + i * 0.36)], false, 0.5)}" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.5"/>`;
  s += sh([[-0.28, 0], [0.3, 0], [0.24, 0.9], [0.22, 1.85], [-0.22, 1.85], [-0.24, 0.9]], STONE);
  s += `<path d="${p2([T(0.04, 0), T(0.3, 0), T(0.22, 1.85), T(0.06, 1.85)])}" fill="${hatchA(ZG)}" opacity="0.45"/>`;
  for (const x of [-0.12, 0.02, 0.14]) s += pline([T(x, 0.05), T(x * 0.9, 1.4)], 0.6, INK, 0.5);
  s += line([T(0.0, 0.05), T(0.0, 1.5)], 1.6, INK) + line([T(0.0, 0.05), T(0.0, 1.5)], 0.8, mix(GOLD, STONE, 0.2)) + pline([T(-0.14, 1.45), T(0.14, 1.45)], 1.4, GOLD, 0.9);
  if (!headless) s += sh([[-0.1, 1.85], [0.1, 1.85], [0.12, 2.08], [0, 2.2], [-0.12, 2.08]], mix(STONE, '#fff', 0.1)) + `<ellipse cx="${f1(T(0, 2.1)[0])}" cy="${f1(T(0, 2.1)[1])}" rx="${f1(u * 0.2)}" ry="${f1(u * 0.2)}" fill="none" stroke="${GOLD}" stroke-width="1.1" stroke-dasharray="${f1(u * 0.7)} ${f1(u * 0.12)}"/>`;
  else s += fillP([T(-0.1, 1.85), T(0.1, 1.85), T(0.08, 1.93), T(-0.09, 1.92)], '#3a3644');
  return s;
}
raw(tower(GX - HALF - TW, GX - HALF, 'left'));
raw(tower(GX + HALF, GX + HALF + TW, 'right'));
// ---- the arch: a ring of voussoirs springing from both towers; broken at the crown; the voussoirs nearest the break
// lift away from it in order (each further and more turned), the gap widening toward the crown
{
  const Rr = HALF, th = 4.2, N = 23, at = (a, r) => P(GX + Math.cos(a) * r, SPR + Math.sin(a) * r, ZG);
  for (const side of [-1, 1]) { const lifted = [];
    for (let i = 0; i < N; i++) { const a0 = side < 0 ? Math.PI - i / (N * 2) * Math.PI * 2 * 0.5 : i / (N * 2) * Math.PI * 2 * 0.5, a1 = a0 + (side < 0 ? -1 : 1) * Math.PI / (N * 2) * 0.98 * 2 * 0.5; // each side covers 90 degrees
      const q = [at(a0, Rr), at(a1, Rr), at(a1, Rr + th), at(a0, Rr + th)];
      const brk = side < 0 ? 15 : 13;
      if (i < brk) s1(q, i, side); else if (i < N) lifted.push(q); }
    raw(driftSeq(lifted, side < 0 ? [0.35, -1] : [-0.3, -1], KG * 1.6, side * 0.05, (q, i) => vous(q, true) + fillP([q[1], q[2], [q[2][0] + side * 1.5, q[2][1] + 2], [q[1][0] + side * 1.5, q[1][1] + 2]], '#2a2834')));
  }
  function s1(q, i, side) { raw(vous(q, false)); }
  function vous(q, loose) { const c = chip(q, loose ? 0.5 : 0.2); let s = stone(c, ZG, mix(STONE, '#fff', 0.05), { band: 2.5, chip: false, w: { op: 0.8, stainGap: 3, pitArea: 20 } }); const m = [(q[0][0] + q[3][0]) / 2, (q[0][1] + q[3][1]) / 2], n = [(q[1][0] + q[2][0]) / 2, (q[1][1] + q[2][1]) / 2];
    s += pline([m, n], 0.6, INK, 0.4) + pline([[q[2][0], q[2][1]], [q[3][0], q[3][1]]], 1.6, mix(GOLD, STONE, 0.15), 0.9); return s; }
  // the intrados soffit seen from below, dark
}
// ---- the gate leaves: one hanging askew from a fused hinge on the left tower; the other fallen flat on the causeway
function grille(pts, Z, op = 1) {
  // pts: 4 corners (screen) of a gilt grille: frame, bars, and a band of quatrefoils; gold over black, crazed
  const [a, b, c, d] = pts, L = (u, v) => { const tp = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], bt = [d[0] + (c[0] - d[0]) * u, d[1] + (c[1] - d[1]) * u]; return [tp[0] + (bt[0] - tp[0]) * v, tp[1] + (bt[1] - tp[1]) * v]; };
  let s = ''; const bar = (p, q, w) => line([p, q], w + 1.4, INK, op) + line([p, q], w, mix(GOLD, '#4a4050', 0.2), op) + line([p, q], Math.max(0.4, w * 0.35), GOLDL, 0.6 * op);
  for (let i = 0; i <= 9; i++) s += bar(L(i / 9, 0), L(i / 9, 1), 1.6);
  for (const v of [0, 0.12, 0.5, 0.62, 1]) s += bar(L(0, v), L(1, v), 2.4);
  for (let i = 0; i < 9; i++) { const c0 = L((i + 0.5) / 9, 0.56); s += `<circle cx="${f1(c0[0])}" cy="${f1(c0[1])}" r="${f1(Math.hypot(b[0] - a[0], b[1] - a[1]) / 9 * 0.32)}" fill="none" stroke="${GOLD}" stroke-width="1.3" opacity="${op}"/>`; }
  return s;
}
{ // the hanging leaf: from the left tower's inner edge, its lower hinge sheared, swung and twisted
  const hx = gx(GX - HALF), top = gy(SPR - 1), bot = gy(1.5), w = (2 * HALF * 0.45) * KG;
  const pts = [[hx, top], [hx + w * 0.82, top + 30], [hx + w * 0.7, bot + 40], [hx - 4, bot]];
  raw(grille(pts, ZG) + fused(hx + 2, top + 6, 8, mix(GOLDD, '#3a3040', 0.3), ZG) + burnV(hx + 20, top + 20, 0.9, 60, 1.6, { depth: 3 }));
}

// ---- THE CAUSEWAY: pale weathered paving from the fighters out to the gate, its left edge open to the drop with a
// broken balustrade; the sentry booth of the porter near the fighters; the fallen leaf flat on it before the gate
{
  const XL = -9, XR = 34;
  const edge = []; for (let z = 3; z <= ZG; z += 1) edge.push(P(XL + Math.sin(z * 0.5) * 0.15, 0, z));
  const fl = [...edge, P(XR, 0, ZG), [W + 20, H + 10], [-20, H + 10]];
  // the causeway's side face below the left edge (the drop), and its underside in shadow
  const side = [...edge, ...edge.slice().reverse().map(([x, y], i) => [x, y + 6 + (1 - i / edge.length) * 30])];
  raw(fillP(side, '#7a7686') + `<path d="${p2(side)}" fill="${hatchA(20)}" opacity="0.45"/>` + inkP(side, 0.8));
  raw(fillP(fl, '#a8a4a8'));
  const cf = S.id('cw'); raw(`<clipPath id="${cf}"><path d="${p2(fl)}"/></clipPath><g clip-path="url(#${cf})">`);
  raw(B.flags(-12, 40, 3.5, ZG, '#b4b0b2', { depth: 1.3, width: 1.6, vary: 0.14, cracks: 0.3, fogK: 0.25, joint: 0.45, missing: 0.03, hi: true }));
  // gilt processional bands down the causeway to the gate
  for (const x of [GX - 12, GX - 4, GX + 4]) { const a = P(x, 0, 3.6), b2 = P(x, 0, ZG); raw(pline([a, b2], 2.4, INK, 0.7) + pline([a, b2], 1.4, mix(GOLD, '#a8a4a8', 0.25), 0.9)); }
  // the gate's shadow lying long toward us? (the sun is high left behind the viewer: no) -- instead the tear's cold on
  // the paving near the gate: a faint violet chill
  raw(`<path d="${p2([P(XL, 0, 60), P(XR, 0, 60), P(XR, 0, ZG), P(XL, 0, ZG)])}" fill="${grad([[0, '#6a5a8a', 0], [1, '#6a5a8a', 0.25]], 0, P(0, 0, 60)[1], 0, P(0, 0, ZG)[1])}"/>`);
  // the fallen leaf flat on the causeway before the gate (foreshortened grille)
  { const C = [[-3.6, 11.2], [3.0, 12.0], [4.2, 20.6], [-2.6, 19.8]], Y = [0.22, 0.22, 0.9, 0.3];
    const top = C.map(([x, z], i) => P(x, Y[i], z)), bot = C.map(([x, z]) => P(x, 0, z));
    raw(`<path d="${p2([P(-4.0, 0, 10.9), P(3.6, 0, 11.8), P(5.0, 0, 21.2), P(-3.0, 0, 20.3)])}" fill="#3a3848" opacity="0.45" filter="${blurF(2)}"/>`);
    raw(fillP([bot[0], bot[1], top[1], top[0]], '#6a5a3a') + fillP([bot[1], bot[2], top[2], top[1]], '#4a4030') + inkP([bot[0], bot[1], top[1], top[0]], 0.8));
    raw(grille([top[3], top[2], top[1], top[0]], 14, 1));
    raw(burnV((top[0][0] + top[2][0]) / 2, (top[0][1] + top[2][1]) / 2, 0.3, 80, 1.6, { depth: 3 })); }
  // hound prints: small clean holes in the paving, wandering from the gate toward the fighters
  { let x = 14, z = 40; for (let i = 0; i < 26; i++) { z -= 1.25; x += Math.sin(i * 0.7) * 0.6 - 0.12; for (const dx of [-0.25, 0.25]) { const c = P(x + dx, 0, z + (dx > 0 ? 0.3 : 0)); const r = K(z) * 0.09; if (c[1] < 440) raw(tearS(c[0], c[1], r * 2.2, r * 0.9, { tears: 1, tearLen: 0.2, teeth: 1, slivers: 0, flecks: 2, mat: '#a8a4a8', n: 16 }).svg); } } }
  // the strike: a fused scar with violet burns where the bolt that broke the arch came down the causeway
  { const c = P(6, 0, 22); raw(fused(c[0], c[1], 9, '#6a6070', 20)); for (let i = 0; i < 6; i++) raw(burnV(c[0], c[1], i / 6 * 6.28 + 0.2, 50 + R() * 60, 1.8, { depth: 4, haloOp: 0.2 })); }
  // gold leaf blown across the paving from the gate, gathered in the joints
  { let m = ''; for (let i = 0; i < 90; i++) { const z = 5 + R() * 40, c = P(-8 + R() * 40, 0, z), r = 0.5 + R() * 1.2; m += `M${f1(c[0] - r)} ${f1(c[1])} l${f1(r * 1.3)} ${f1(-r * 0.5)} l${f1(r * 0.7)} ${f1(r * 0.6)} Z `; } raw(`<path d="${m}" fill="${GOLD}" opacity="0.7"/>`); }
  raw('</g>');
  raw(pline(edge.map(([x, y]) => [x + 1, y - 0.6]), 1.4, '#fffaf0', 0.7));
  // the balustrade along the left edge: posts with a rail, broken in two runs; small kneeling figures on the posts
  for (let z = 6; z < ZG; z += 2.4) { if ((z > 20 && z < 31) || (z > 55 && z < 66)) continue; const a = P(XL + 0.2, 0, z), b2 = P(XL + 0.2, 1.1, z); raw(line([a, b2], Math.max(1, K(z) * 0.22), INK) + line([a, b2], Math.max(0.6, K(z) * 0.16), mix(STONE, '#fff', 0.15))); }
  for (const [z0, z1] of [[6, 20], [31, 55], [66, ZG]]) { const a = P(XL + 0.2, 1.15, z0), b2 = P(XL + 0.2, 1.15, z1); raw(line([a, b2], Math.max(1.4, K(z0) * 0.2), INK) + line([a, b2], Math.max(0.8, K(z0) * 0.13), mix(STONE, '#fff', 0.2)) + pline([[a[0], a[1] - 1], [b2[0], b2[1] - 0.5]], 0.8, GOLD, 0.8)); }
  // the porter's lodge at the causeway's edge (scale): a small gothic stone lodge, its side wall toward the centre, a
  // steep gable with a gilt finial, a studded door under a carved key, a lancet, a buttress, a lantern bracket, a step
  { const z = 18, zb = 21.2, x0 = XL + 0.5, x1 = XL + 3.6, h0 = 3.0, hr = 5.0;
    const side = [P(x1, 0, z), P(x1, 0, zb), P(x1, h0, zb), P(x1, h0, z)];
    raw(stone(side, z, '#9a94a0', { band: 2, chip: false, w: { op: 0.9 } }) + `<path d="${p2(side)}" fill="${hatchA(z)}" opacity="0.35"/>`);
    raw(S.ashlar((u, v) => [x1, v, z + u], zb - z, h0, '#a49ea8', { scale: 0.5, vary: 0.15 }).replace(/^/, ''));
    { const ol = G.pointed(-0.3, 0.3, 1.2, 5, 0.9).map(([u, v]) => P(x1, 1.3 + v, z + 1.6 + u)); raw(fillP(ol, '#1a1620') + inkP(ol, 0.7)); }
    const eave = [P(x1 + 0.25, h0, z - 0.25), P(x1 + 0.25, h0, zb + 0.2), P(x1 + 0.25, h0 - 0.18, zb + 0.2), P(x1 + 0.25, h0 - 0.18, z - 0.25)]; raw(fillP(eave, '#2a2630') + inkP(eave, 0.6));
    const ridge = [P((x0 + x1) / 2, hr, z - 0.25), P((x0 + x1) / 2, hr, zb + 0.2), P(x1 + 0.25, h0, zb + 0.2), P(x1 + 0.25, h0, z - 0.25)]; raw(fillP(ridge, '#6a6478') + `<path d="${p2(ridge)}" fill="${hatchA(z)}" opacity="0.4"/>` + inkP(ridge, 0.7));
    for (let i = 1; i < 6; i++) { const zz = z - 0.25 + (zb + 0.45 - z) * i / 6; raw(pline([P((x0 + x1) / 2, hr, zz), P(x1 + 0.25, h0, zz)], 0.6, INK, 0.5)); }
    const front = [P(x0, 0, z), P(x1, 0, z), P(x1, h0, z), P((x0 + x1) / 2, hr, z), P(x0, h0, z)];
    raw(stone(front, z, '#c4beb8', { band: 2.5, chip: false, w: { op: 0.9 } }) + S.ashlar((u, v) => [x0 + u, v, z - 0.01], x1 - x0, h0, '#c4beb8', { scale: 0.5, vary: 0.15 }));
    raw(line([P(x0 - 0.25, h0 - 0.15, z - 0.26), P((x0 + x1) / 2, hr + 0.1, z - 0.26), P(x1 + 0.25, h0 - 0.15, z - 0.26)], Math.max(2, K(z) * 0.16), INK) + line([P(x0 - 0.25, h0 - 0.15, z - 0.26), P((x0 + x1) / 2, hr + 0.1, z - 0.26), P(x1 + 0.25, h0 - 0.15, z - 0.26)], Math.max(1.2, K(z) * 0.1), '#7a7488'));
    { const ft = P((x0 + x1) / 2, hr + 0.1, z - 0.26); raw(line([ft, [ft[0], ft[1] - K(z) * 0.6]], 2, INK) + line([ft, [ft[0], ft[1] - K(z) * 0.6]], 1.1, GOLD) + `<circle cx="${f1(ft[0])}" cy="${f1(ft[1] - K(z) * 0.6)}" r="${f1(K(z) * 0.09)}" fill="${GOLD}" stroke="${INK}" stroke-width="0.6"/>`); }
    const dcx = (x0 + x1) / 2, dr = G.pointed(-0.55, 0.55, 1.75, 8, 0.9).map(([u, v]) => P(dcx + u, 0.18 + v, z - 0.02));
    raw(fillP(dr, '#3a2a20') + `<path d="${p2(dr)}" fill="url(#mottle)" opacity="0.4"/>`); for (let i = 1; i < 4; i++) raw(pline([P(dcx - 0.55 + i * 0.275, 0.2, z - 0.02), P(dcx - 0.55 + i * 0.275, 1.85, z - 0.02)], 0.6, INK, 0.6));
    for (let i = 0; i < 8; i++) { const sp = P(dcx - 0.4 + (i % 4) * 0.27, 0.6 + Math.floor(i / 4) * 0.7, z - 0.03); raw(`<circle cx="${f1(sp[0])}" cy="${f1(sp[1])}" r="0.9" fill="#1a1416"/>`); }
    raw(line(dr.slice(1, -1).map(([x, y]) => [x, y - 1.2]), 2.2, '#8a8494') + inkP(dr, 1));
    { const kc = P(dcx, 2.35, z - 0.03), u = K(z) * 0.22; raw(line([[kc[0] - u, kc[1]], [kc[0] + u * 0.7, kc[1]]], 2.2, INK) + line([[kc[0] - u, kc[1]], [kc[0] + u * 0.7, kc[1]]], 1.2, GOLD) + `<circle cx="${f1(kc[0] - u)}" cy="${f1(kc[1])}" r="${f1(u * 0.35)}" fill="none" stroke="${GOLD}" stroke-width="1.3"/>` + fillP([[kc[0] + u * 0.4, kc[1]], [kc[0] + u * 0.7, kc[1]], [kc[0] + u * 0.7, kc[1] + u * 0.45], [kc[0] + u * 0.55, kc[1] + u * 0.45], [kc[0] + u * 0.55, kc[1] + u * 0.25], [kc[0] + u * 0.4, kc[1] + u * 0.25]], GOLD)); }
    raw(stone([P(dcx - 0.8, 0, z - 0.45), P(dcx + 0.8, 0, z - 0.45), P(dcx + 0.8, 0.18, z - 0.45), P(dcx - 0.8, 0.18, z - 0.45)], z, '#aaa4a8', { band: 1.2 }));
    { const bt = [P(x1 - 0.05, 0, z - 0.4), P(x1 + 0.35, 0, z - 0.4), P(x1 + 0.35, 2.0, z - 0.4), P(x1 - 0.05, 2.6, z - 0.4)]; raw(stone(bt, z, '#b4aeb0', { band: 1.5, chip: false })); }
    { const lb = P(x0 + 0.1, 2.3, z - 0.3); raw(line([lb, [lb[0] - K(z) * 0.35, lb[1]], [lb[0] - K(z) * 0.35, lb[1] + 4]], 1.8, INK) + `<path d="M${f1(lb[0] - K(z) * 0.35 - 4)} ${f1(lb[1] + 4)} L${f1(lb[0] - K(z) * 0.35 + 4)} ${f1(lb[1] + 4)} L${f1(lb[0] - K(z) * 0.35 + 3)} ${f1(lb[1] + 13)} L${f1(lb[0] - K(z) * 0.35 - 3)} ${f1(lb[1] + 13)} Z" fill="#3a3640" stroke="${INK}" stroke-width="0.8"/>`); }
    raw(burnV(P(x1 - 0.4, 2.4, z)[0], P(0, 2.4, z)[1], 1.9, 46, 1.4, { depth: 3 })); }
}
// the quiet zone (light key): pale veils of the rim's air over the far band, so the dark fighters stand clear
raw(quiet([[250, 0.14], [292, 0.14], [330, 0.1]], { hop: 0.06, col: AIRC }));

// ======================================================================== MID
layer('mid');
{ // the porter's great key fallen on the paving (low), a dropped grille bar, the chip of a voussoir
  const a = P(-3.5, 0.06, 8.6), b = P(-1.2, 0.06, 9.4); raw(line([a, b], 3.2, INK, 0.8) + line([a, b], 1.8, mix(GOLDD, '#6a6070', 0.4), 0.9));
  const r = P(-1.0, 0.06, 9.45); raw(`<ellipse cx="${f1(r[0] + 4)}" cy="${f1(r[1])}" rx="7" ry="2.6" fill="none" stroke="${INK}" stroke-width="2.4" opacity="0.8"/><ellipse cx="${f1(r[0] + 4)}" cy="${f1(r[1])}" rx="7" ry="2.6" fill="none" stroke="${mix(GOLDD, '#6a6070', 0.4)}" stroke-width="1.2"/>`);
  const w = P(-3.7, 0.06, 8.5); raw(fillP([[w[0] - 4, w[1] - 3], [w[0] + 2, w[1] - 3], [w[0] + 2, w[1] + 2], [w[0] - 4, w[1] + 2]], mix(GOLDD, '#6a6070', 0.4), 0.9));
  for (const [x, z, r2] of [[16, 11, 0.5], [17, 12, 0.3], [-6, 13, 0.4]]) { const p = P(x, r2 * 0.5, z), rr = K(z) * r2; raw(stone(blob(p[0], p[1], rr, rr * 0.6, 8, 0.4), z, '#8a8690', { band: 1.5, w: { op: 0.4 } })); }
}

// ======================================================================== FORE
layer('fore');
{ // left: the near balustrade's end pier, cropped by the frame: weathered pale stone with a gilt lamp-bracket, its lamp
  // dark; a violet burn up its face
  const q = [[-10, 232], [40, 228], [46, H + 10], [-10, H + 10]];
  raw(stone(q, 3.5, '#9a96a0', { band: 5, chip: 0.2, w: { op: 1, stainGap: 4, pitArea: 30, cracks: 2 } }) + `<path d="${p2([[20, 228], [46, 228], [46, H + 10], [20, H + 10]])}" fill="${hatchA(3.5)}" opacity="0.4"/>`);
  raw(stone([[-12, 212], [56, 208], [58, 232], [-12, 234]], 3.5, '#b4b0b4', { band: 4, w: { op: 0.8 } }) + giltW([[-12, 204], [52, 200], [56, 210], [-12, 214]], 3.5, { dim: 0.05, cracks: 3, lost: 2 }));
  raw(line([[44, 300], [70, 296], [74, 310]], 3.2, INK) + line([[44, 300], [70, 296], [74, 310]], 1.8, GOLD) + `<path d="M66 310 L82 310 L78 334 L70 334 Z" fill="#3a3640" stroke="${INK}" stroke-width="1.4"/>`);
  const cl = S.id('fp'); raw(`<clipPath id="${cl}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${cl})">${burnV(14, 470, -1.5, 200, 2.4, { depth: 5 })}</g>`);
  // top right: a loose voussoir of the broken arch drifting high through the frame (part of the same sequence's line)
}

G.write(OUT, 'sky_gate');
