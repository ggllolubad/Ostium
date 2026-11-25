// World XIII, the Black Pyre: THE APSE OF THE SAINT (boss room `pyre_boss`, round 2, Living Ink). Boss: The Saint
// Unending ("She was burned for heresy. She has been burning for nine hundred years, and she has not stopped praying.").
// Where she belongs: the cathedral's sanctuary, where her pyre was built under the crossing before the high altar, so
// that the whole cathedral could watch. The apse rises behind her: seven tall lancets blazing with white ash-light, the
// brightest light in the world; the axial lancet behind her head has been unmade by the void, so her gold halo (her
// figure's, the world's only gold) stands against black. A shaft of grey daylight falls on her from the burned-out
// crossing tower. The sanctuary pavement's circle of inlay radiates from her pyre, ringed with scorch; banks of votive
// candles still burn black for her on the sanctuary steps. The left of the frame is the dark crossing and transept
// (the fallen corona, the burned choir), where the heroes stand.
// Composition: the right 45% is her stage (the apse framing a 3.5x figure, uncluttered behind her silhouette).
// Palette: white ash-glare against black, ash grey, violet edges. No gold drawn by the room. Red: none.
// Usage: node scenes/bg_pyre_boss.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIII');
const { S, B, G } = require('./battle_kit_g5').make(13501, '#0c0a0d', '#1a161c', '#2a262c');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, seam, ash, char, chain, tornVoid, quiet } = B;
const { W, H, air, blackFlame, shaft, pointed } = G;
const VIO = '#9a6ad8', VIOD = '#4a2e6a', IRON = '#2a2628', WAX = '#d0c8b4', GLARE = '#f2f0ea', MURK = B.MURK;
const XC = 10.5, ZCn = 17, RA = 7, NS = 7;

// a candle (pale wax, black flame)
function candle(x, y, h, wd, Z) {
  let s = cel([[x - wd, y], [x + wd, y], [x + wd * 0.9, y - h], [x - wd * 0.9, y - h]], { Z, fill: WAX, band: Math.max(0.6, wd * 0.5), inkW: Math.max(0.4, wd * 0.25) });
  return s + blackFlame(x, y - h, wd * 2.4, wd * 6, { n: 1, lick: 0.3, lean: (R() - 0.5) * 0.4 });
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- beyond the apse windows: the white glare of the ash sky (stepped, hotter toward the middle)
raw(fillP([[700, -5], [W + 5, -5], [W + 5, 330], [700, 330]], '#d8d4cc') + fillP([[780, -5], [1440, -5], [1440, 320], [780, 320]], '#e6e2da') + fillP([[860, -5], [1340, -5], [1340, 300], [860, 300]], GLARE));
// ---- the apse: seven bays round the curve, far to near; each lancet blazing, the walls between black and backlit
{
  const segs = []; for (let i = 0; i < NS; i++) { const ta = i / NS * Math.PI, tb = (i + 1) / NS * Math.PI; segs.push([ta, tb, ZCn + RA * Math.sin((ta + tb) / 2)]); }
  segs.sort((a, b) => b[2] - a[2]);
  for (const [ta, tb, zm] of segs) {
    const A = [XC + RA * Math.cos(ta), ZCn + RA * Math.sin(ta)], Bp = [XC + RA * Math.cos(tb), ZCn + RA * Math.sin(tb)];
    const at = (s, t) => [A[0] + (Bp[0] - A[0]) * s, t, A[1] + (Bp[1] - A[1]) * s];          // s: 0..1 along the chord
    const tm = (ta + tb) / 2, unmade = Math.abs(tm - 1.12) < 0.25;
    // the wall: black stone, backlit; ashlar courses read as faint lines; a rim of light where it meets each window
    raw(fillP([P(...at(0, 0)), P(...at(1, 0)), P(...at(1, 30)), P(...at(0, 30))], '#1a1618') + S.ashlar(at, 1, 20, '#2a2628', { vary: 0.2, chip: 0.3, mortar: 0.5, scale: 1.2, wscale: 0.12 }) + hatch3(at, 0, 1, 0, 20, 0.8, { op: 0.4 }));
    // the lancet: pointed, glazing burned out to the leads; grey-white sky through it
    const w0 = 0.22, w1 = 0.78, sill = 2.4;
    const SP = 9.2, op = pointed(w0, w1, SP, 8, 1).map(([s, t]) => P(...at(s, t < 0.01 ? sill : t + (t > SP ? (t - SP) * 5.5 : 0))));
    if (unmade) {
      // the axial lancet behind her head has been unmade: a torn, clean-rimmed absence where the window and the wall
      // round it were, black beyond (her halo will stand against it)
      raw(fillP(op, '#dcd8d0'));
      const tv = tornVoid((s, t) => at(s, t), 0.5, 10.5, 0.95, 8.5, { depth: 0.6, dir: [0, 0, 1], cut: '#3a3638', mat: '#1a1618', tears: 2, tearLen: 0.22, teeth: 2, slivers: 6, flecks: 10, edge: VIOD, edgeOp: 0.6, halo: false });
      raw(tv.svg);
    } else {
      raw(fillP(op, '#e2ded6') + fillP(op.slice(0, Math.ceil(op.length / 2) + 1).concat([P(...at(0.5, sill))]), GLARE, 0.8));
      for (let y = sill + 0.9; y < 9.2; y += 0.9 + R() * 0.15) { const a = P(...at(w0, y)), b = P(...at(w1, y + (R() - 0.5) * 0.1)); if (R() < 0.82) raw(pline([a, b], Math.max(0.6, K(zm) * 0.03), '#3a3436', 0.85)); }
      raw(pline([P(...at(0.5, sill)), P(...at(0.5, 9.6))], Math.max(1, K(zm) * 0.07), '#1a1618'));
      // the head's tracery: two pointed lights and a foiled circle, charred
      for (const [a0, a1] of [[w0, 0.5], [0.5, w1]]) { const t2 = pointed(a0, a1, 9.2, 5, 1).slice(1, -1).map(([s, t]) => P(...at(s, 9.2 + (t - 9.2) * 5.5))); raw(line(t2, Math.max(1, K(zm) * 0.06), '#1a1618')); }
      { const c = P(...at(0.5, 9.2 + 2.4)), r = (P(...at(w1, 0))[0] - P(...at(w0, 0))[0]) * 0.22; raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(Math.abs(r))}" fill="none" stroke="#1a1618" stroke-width="${f1(Math.max(1, K(zm) * 0.06))}"/>`); }
      // the jambs: a bright lip where the glare spills round the black stone
      for (const s0 of [w0, w1]) raw(pline([P(...at(s0, sill)), P(...at(s0, 9.2))], Math.max(1, K(zm) * 0.04), '#8a8682', 0.8));
      raw(inkP(op, Math.max(0.8, inkW(zm) * 1.2)));
      // the light pouring forward and down off each window onto the sanctuary floor (stepped)
      const f0 = [A[0] + (Bp[0] - A[0]) * w0, 0, A[1] + (Bp[1] - A[1]) * w0 - 4.5], f1_ = [A[0] + (Bp[0] - A[0]) * w1, 0, A[1] + (Bp[1] - A[1]) * w1 - 4.5];
      raw(shaft([P(...at(w0, 9)), P(...at(w1, 9)), P(...f1_), P(...f0)], '#f4f2ec', 0.05));
    }
    raw(fillP([P(...at(0, 0)), P(...at(1, 0)), P(...at(1, sill)), P(...at(0, sill))], '#141214'));
    raw(cel([P(...at(0, 17.6)), P(...at(1, 17.6)), P(...at(1, 18.1)), P(...at(0, 18.1))], { Z: zm, fill: '#3a3638', band: 1 }));
  }
}
// ---- the left: the choir arcade receding toward the apse, its piers and pointed openings dark (the ambulatory behind
// is unlit but for its own dim lancets), soot-black from the floor up
{
  const XW = -3.5, Z0 = 4.2, Ls = 26, at = (s, t) => [XW, t, Z0 + s], ps = [9, 14.2, 19.6, 25];
  // the end wall of the ambulatory beyond, and its dim lancets seen through the openings
  raw(S.ashlar((u, t) => [-14 + u, t, 31], 18, 24, '#2e2a2e', { vary: 0.2, chip: 0.4, mortar: 0.6, rough: true, roughP: 0.35, scale: 1.2 }) + `<path d="${pp([[-14, 0, 31], [4, 0, 31], [4, 24, 31], [-14, 24, 31]])}" fill="#120e12" opacity="0.45"/>`)
  // the burned choir screen standing across the ambulatory: a black traceried silhouette, its doorway dark
  ; { const at = (u, t) => [-12 + u, t, 30.5]; const scr = [P(...at(0, 0)), P(...at(0, 6.2)), P(...at(3, 7.4)), P(...at(6, 6.8)), P(...at(9, 7.8)), P(...at(12, 6.4)), P(...at(14, 6.4)), P(...at(14, 0))]; raw(fillP(scr, '#0e0b0e') + inkP(scr, 1)); for (let k = 0; k < 9; k++) { const o2 = pointed(0.5 + k * 1.5, 1.5 + k * 1.5, 4.4, 5, 1).map(([u, t]) => P(...at(u, t < 0.01 ? 2.2 : t))); raw(fillP(o2, '#2a2428') + inkP(o2, 0.6)); } }
  raw(`<path d="${pp([[-14, 0, 31], [4, 0, 31], [4, 24, 31], [-14, 24, 31]])}" fill="${S.hatchA(20)}" opacity="0.4"/>` + fillP([P(-8.6, 0, 4), P(-8.6, 0, 31), P(-8.6, 9, 31), P(-8.6, 9, 4)], '#262226') + S.ashlar((u, t) => [-8.6, t, 4 + u], 27, 9, '#3a3638', { vary: 0.2, chip: 0.4, mortar: 0.6, scale: 1.1 }) + hatch3((u, t) => [-8.6, t, 4 + u], 0, 27, 0, 9, 0.8, { op: 0.5 }));
  for (const [X, Z] of [[-8.5, 12], [-8.5, 17.5], [-8.5, 23], [-1.5, 31]]) { const plane = X < -5; const o = pointed(-0.55, 0.55, 5.6, 5, 1).map(([u, t]) => plane ? P(X, t < 0.01 ? 2.2 : t, Z + u) : P(X + u, t < 0.01 ? 2.2 : t, Z)); raw(fillP(o, '#7a7a7a') + fillP(o.slice(0, 5), '#9a9a98', 0.6) + inkP(o, 0.9)); const m0 = plane ? P(X, 2.2, Z) : P(X, 2.2, Z), m1 = plane ? P(X, 6.0, Z) : P(X, 6.0, Z); raw(pline([m0, m1], 1.2, '#2a2628')); for (const y of [3.4, 4.6]) raw(pline(plane ? [P(X, y, Z - 0.55), P(X, y, Z + 0.55)] : [P(X - 0.55, y, Z), P(X + 0.55, y, Z)], 0.8, '#2a2628', 0.8)); }
  const holes = []; const bnd = [Z0 - 3, ...ps, 30.5]; for (let i = 0; i < bnd.length - 1; i++) holes.push(pointed(bnd[i] + 0.45 - Z0, bnd[i + 1] - 0.45 - Z0, 3.2, 10, 0.72));
  const outer = pp([at(0, 0), at(Ls, 0), at(Ls, 22), at(0, 22)]), hs = holes.map(o => p2(o.map(([u, t]) => P(...at(u, t))))).join(' ');
  const cid = S.id('ca'); raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${hs}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(S.ashlar(at, Ls, 22, '#4a4648', { vary: 0.22, chip: 0.5, mortar: 0.6, lost: 0.2, rough: true, roughP: 0.3 }) + hatch3(at, 0, Ls, 0, 22, 0.75, { op: 0.45 }) + hatch3(at, 0, Ls, 0, 22, -0.8, { op: 0.35 }));
  for (const z of ps) raw(S.soot(at, z - Z0 - 1.5, z - Z0 + 1.5, 2, 12, { op: 0.55 }));
  for (const y of [8.4, 9.0]) raw(cel([P(...at(0, y)), P(...at(Ls, y)), P(...at(Ls, y + 0.22)), P(...at(0, y + 0.22))], { Z: 14, fill: '#3a3638', band: 1 }));
  raw('</g>');
  for (const z of ps.slice().reverse()) raw(box(XW, XW + 0.5, 0, 3.2, z - 0.45, z + 0.45, { col: '#4a4648', shadeOp: 0.5 }) + box(XW + 0.5, XW + 0.75, 0, 16, z - 0.15, z + 0.15, { col: '#4a4648', shadeOp: 0.4 }));
  for (const o of holes) for (let i = 1; i < o.length - 2; i++) { const q = [at(...o[i]), at(...o[i + 1]), at(o[i + 1][0], o[i + 1][1] + 0.35), at(o[i][0], o[i][1] + 0.35)]; if (q[0][2] < 4.5) continue; raw(cel(chip(q.map(p => P(...p)), 0.3), { Z: q[0][2], fill: S.tone('#3e3a3c', 0.2), band: 1 })); }
  // the choir stalls burned along the crossing's left, canopies charred into points, receding
  for (let k = 0; k < 9; k++) { const Z = 11 + k * 1.6, X = -3.2, a = P(X - 0.35, 0, Z), b = P(X + 0.35, 2.6 + (k % 3) * 0.35, Z), hh = R() < 0.4 ? 0.6 : 1; raw(fillP([[a[0], a[1]], [b[0], a[1]], [b[0], a[1] + (b[1] - a[1]) * hh + 4], [(a[0] + b[0]) / 2, a[1] + (b[1] - a[1]) * hh - 4], [a[0], a[1] + (b[1] - a[1]) * hh + 4]], mix('#1a1618', MURK, k / 12)) + inkP([[a[0], a[1]], [b[0], a[1]], [b[0], a[1] + (b[1] - a[1]) * hh + 4], [(a[0] + b[0]) / 2, a[1] + (b[1] - a[1]) * hh - 4], [a[0], a[1] + (b[1] - a[1]) * hh + 4]], 0.7)); }
}
// ---- the great crossing pier and the chancel arch's left jamb: a clustered pier rising out of the frame, between the dark
// transept and the blazing apse (it overlaps the apse's left edge)
{
  const X = 3.0, Z = 13.5;
  for (const [dx, r, col] of [[-0.9, 0.5, '#2a2628'], [0, 0.65, '#3a3638'], [0.85, 0.45, '#2e2a2c']]) { const a = P(X + dx - r, 0, Z + Math.abs(dx) * 0.2), b = P(X + dx + r, 30, Z + Math.abs(dx) * 0.2); const q = [[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]];
    raw(cel(q, { Z, fill: col, band: (b[0] - a[0]) * 0.2, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2([[a[0] + (b[0] - a[0]) * 0.5, b[1]], [b[0], b[1]], [b[0], a[1]], [a[0] + (b[0] - a[0]) * 0.5, a[1]]])}" fill="${S.hatchA(Z)}" opacity="0.55"/>`);
    raw(pline([[b[0] - 1, b[1]], [b[0] - 1, a[1]]], 1.6, '#a8a49e', 0.7)); }
  raw(S.soot((s, t) => [X - 1.4 + s, t, Z - 0.6], 0, 2.8, 0, 10, { op: 0.5 }));
  raw(seam(jag(P(X + 0.6, 6.5, Z - 0.7), P(X + 0.2, 10, Z - 0.7), 6, 2), 1.2, { core: VIOD, hot: VIO, glowOp: 0 }));
  // the void has taken a piece out of the pier's face, an eye looking out toward the pyre
  raw(tornVoid((s, t) => [X - 1.4 + s, t, Z - 0.75], 1.1, 7.4, 0.9, 1.3, { depth: 0.6, cut: '#4a4648', mat: '#2a2628', tears: 3, teeth: 2, slivers: 5, flecks: 7, eyes: [[0.15, 0.05, 0.36]], eyeO: { white: '#cfc8bc', iris: '#6a5a7a', open: 0.45, look: [0.5, 0.2] }, edge: VIOD, edgeOp: 0.5 }).svg);
}
// ---- the sanctuary steps before the apse, banks of votive candles still burning black on them for her
{
  for (let k = 0; k < 3; k++) { const Z = 11.0 + k * 0.45, y0 = k * 0.18, y1 = (k + 1) * 0.18; raw(cel([P(4.0, y1, Z), P(19, y1, Z), P(19, y0, Z), P(4.0, y0, Z)], { Z, fill: '#3a3638', band: 1 }) + cel([P(4.0, y1, Z), P(19, y1, Z), P(19, y1, Z + 0.45), P(4.0, y1, Z + 0.45)], { Z, fill: '#5a5658', band: 1, hi: true })); }
  for (let i = 0; i < 34; i++) { const X = 4.6 + R() * 13.8, Z = 11.1 + Math.floor(R() * 3) * 0.45 + 0.15, Y = (Math.round((Z - 11) / 0.45) + 1) * 0.18, c = P(X, Y, Z); raw(candle(c[0], c[1], K(Z) * (0.12 + R() * 0.2), K(Z) * 0.025, Z)); }
}
// ---- the sanctuary floor: a great circle of inlay radiating from where the pyre stands, ringed with scorch; the
// crossing's flags beyond it, converging
{
  raw(B.flags(-24, 20, 3.6, 26, '#3a3638', { depth: 1.1, width: 1.3, vary: 0.14, cracks: 0.25, fogK: 0.3, joint: 0.6 }));
  const C = [12.0, 7.2];   // the pyre's place (world X,Z of the boss's feet line, a little behind)
  for (const [r, col, w] of [[2.4, '#6a6462', 3], [4.0, '#5a5452', 2.4], [5.8, '#4a4644', 2]]) { const pts = []; for (let k = 0; k <= 48; k++) { const a = k / 48 * 6.283; pts.push(P(C[0] + Math.cos(a) * r, 0.01, C[1] + Math.sin(a) * r)); } raw(line(pts, w + 1.5, INK, 0.8) + line(pts, w, col, 0.8)); }
  for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283, p = P(C[0] + Math.cos(a) * 2.4, 0.01, C[1] + Math.sin(a) * 2.4), q = P(C[0] + Math.cos(a) * 5.8, 0.01, C[1] + Math.sin(a) * 5.8); if (q[1] < 300) continue; raw(pline([p, q], 1, INK, 0.55)); }
  for (const [r, op] of [[3.2, 0.35], [4.8, 0.25], [6.8, 0.18]]) { const pts = []; for (let k = 0; k <= 30; k++) { const a = k / 30 * 6.283, rr = r * (1 + (R() - 0.5) * 0.15); pts.push(P(C[0] + Math.cos(a) * rr, 0.01, C[1] + Math.sin(a) * rr)); } raw(fillS(pts, '#060407', op, 0.5)); }
  raw(S.occBand((s, t) => [-30 + s, 0, 26 - t], 60, 1.2, { op: 0.4, cross: true }));
}
// ---- the fallen corona of the crossing: a great iron hoop chandelier lying on the floor at left, cold, its candles
// broken off; dark and low (behind the heroes)
{ const c = P(-4.6, 0.25, 11.5), rx = K(11.5) * 2.0, ry = K(11.5) * 0.3; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${INK}" stroke-width="6"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="#3a3436" stroke-width="3" stroke-dasharray="14 3 4 3"/>`);
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283, p = [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry]; raw(pline([p, [p[0], p[1] - 6 - R() * 6]], 2, INK)); } raw(chain([[c[0] + rx * 0.3, c[1] - ry], [c[0] + rx * 0.5, c[1] - ry - 40], [c[0] + rx * 0.4, c[1] - ry - 120]], 3, IRON)); }
// ---- the shaft from the burned-out crossing tower falling onto the pyre from the upper left (the boldest light)
// a darkening over the crossing between the arcade and the apse, so the blazing apse reads as the one focus
raw(`<rect x="560" y="-5" width="420" height="490" fill="${G.radGrad('#0a080c', 1, [[0, 0.55], [0.6, 0.4], [1, 0]])}"/>`);
raw(G.shaftG([[640, -5], [820, -5], [1250, 440], [1040, 440]], '#f0eee8', 0.3, 1));
raw(ash(70, 600, 1300, 0, 400, { r: 1.6, op: 0.6, col: '#e4e2dc' }));
// the hero side kept dark and quiet; the stage behind the boss left clear
raw(quiet([[232, 0.16], [266, 0.16], [300, 0.14], [345, 0.14]], { hop: 0.18, x1: 900 }));
raw(quiet([[300, 0.12], [345, 0.12]], { hop: 0.1, x0: 900 }));

// ======================================================================== MID
layer('mid');
{ // a pew of the crossing knocked over in the panic, lying on its back, charred (a familiar size: 2.4 m long)
  const Z = 9.8, X = -3.0, k = K(Z); raw(B.box(X - 1.2, X + 1.2, 0, 0.12, Z - 0.25, Z + 0.25, { col: mix('#2a2224', MURK, 0.2), shadeOp: 0.5 }) + B.box(X - 1.2, X + 1.2, 0.12, 0.55, Z + 0.15, Z + 0.25, { col: mix('#3a3032', MURK, 0.2), shadeOp: 0.5 })); for (const dx of [-1.0, 1.0]) raw(line([P(X + dx, 0.15, Z - 0.1), P(X + dx + 0.1, 0.45, Z - 0.5)], 3, INK) + line([P(X + dx, 0.15, Z - 0.1), P(X + dx + 0.1, 0.45, Z - 0.5)], 1.6, '#3a3032')); raw(B.char(P(X, 0.3, Z)[0], P(X, 0.3, Z)[1], k * 0.6, k * 0.12, { Z })); }
{ // ash heaps where the crowd stood; a dropped rosary of charred beads; the inquisitors' trampled hymnal
  for (const [X, Z] of [[-2.6, 9.4], [1.8, 10.2]]) { const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(P(X - 0.9 + u * 1.8, Math.sin(u * Math.PI) * 0.15, Z)); } raw(fillS([P(X - 0.9, 0, Z), ...pts, P(X + 0.9, 0, Z)], '#3a3436', 0.9) + line(pts, 0.6, INK, 0.4)); }
  const c = P(-0.6, 0.02, 9.0); for (let k = 0; k < 14; k++) { const a = k / 14 * 5.2; raw(`<circle cx="${f1(c[0] + Math.cos(a) * 14)}" cy="${f1(c[1] + Math.sin(a) * 3)}" r="1.4" fill="#1a1416" stroke="${INK}" stroke-width="0.4"/>`); }
}

// ======================================================================== FORE
layer('fore');
{ // top left: the charred rood beam across the chancel, its cross gone (snapped stub), chains hanging; left: the
  // chancel arch's near jamb
  const bm = [[-10, 20], [760, 4], [762, 34], [-10, 56]]; raw(cel(bm, { Z: 3.6, fill: '#1e1a1c', band: 8, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(bm)}" fill="${S.hatchA(4)}" opacity="0.5"/>`);
  for (let x = 40; x < 740; x += 30 + R() * 30) raw(pline([[x, 22 - x * 0.02], [x + 10, 50 - x * 0.03]], 1.2, '#5a5456', 0.6));
  raw(fillP([[762, 4], [790, 0], [800, 30], [762, 34]], '#1e1a1c') + inkP([[762, 4], [790, 0], [800, 30], [762, 34]], 1.6));
  const st = [[330, 18], [362, 16], [356, -10], [340, -10]]; raw(cel(st, { Z: 3.6, fill: '#221e20', band: 4 }) + fillP([[338, -10], [356, -10], [350, -2], [344, 2]], '#060407'));
  raw(chain([[150, 44], [156, 140], [150, 210]], 4, IRON) + chain([[560, 34], [566, 110]], 4, IRON) + B.char(400, 30, 60, 10, { Z: 4 }));
  const jb = [[-10, -5], [40, -5], [52, H + 5], [-10, H + 5]]; raw(cel(jb, { Z: 3.4, fill: '#221e20', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(jb)}" fill="${S.hatchA(4)}" opacity="0.5"/>`);
  for (let y = 60; y < H; y += 44 + R() * 30) raw(pline([[-10, y], [46, y + 2]], 1.2, INK, 0.6));
}
{ // right edge: a tall iron hearse (the triangular candle-stand of the night office), its candles all burning black
  const x = W - 30, b = [x, H + 5]; raw(line([b, [x, 120]], 7, INK) + line([b, [x, 120]], 4, IRON));
  const tri = [[x - 60, 220], [x + 40, 220], [x - 10, 80]]; raw(line([...tri, tri[0]], 6, INK) + line([...tri, tri[0]], 3.4, IRON));
  for (const [e0, e1] of [[tri[0], tri[2]], [tri[1], tri[2]]]) for (let k = 0; k < 6; k++) { const u = k / 6, p = [e0[0] + (e1[0] - e0[0]) * u, e0[1] + (e1[1] - e0[1]) * u]; if (p[0] > W - 4) continue; raw(candle(p[0], p[1], 22, 3.6, 3.6)); }
  raw(candle(tri[2][0], tri[2][1], 26, 4, 3.6));
}
raw(ash(30, 0, W, 0, 470, { r: 2.4, op: 0.55 }));

G.write(OUT, 'pyre_boss');
