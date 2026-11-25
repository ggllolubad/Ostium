// The Infirmarium in Living Ink. Same room as grim/int_infirmarium.js: same camera, room box (10 x 9 x 4.6, flagged floor,
// flat ceiling on beams 1.5 m apart), back window, door (arched, in the left wall: the infirmarium's garth door faces west),
// keeper spot with its over_cut, hotspots (exit, table with its 3D outline, keeper), the six lights in grim's order and
// values, draw order bg / keeper / mid / fg.
// Sister Wenna's long ward: limewash flaking off rubble ashlar, a high barred window letting in the Grey, the sick in a row of
// beds along the back wall between linen screens (one of them dead, the sheet drawn up), herbs drying from the beams, the
// herb brazier smoking vinegar-sweet at the left, shelves of remedies, the aumbry, the pegs of the dead. Wenna leans her
// weight on the treatment table (the panel) on two straight arms.
// Deliberate change from grim, for the Living Ink keeper: the table runs 0.25 m further right (x1 1.7, was 1.45) so Wenna's
// flat hands (her figure leans on a table at 0.82 m, grim's height, kept) land on its top and not past its corner; the table's
// click polygon and outline follow, and cutZ is 4.55 (was 4.7) so her hands come back over the top's back edge.
// Usage: node scenes/int_infirmarium.js [outDir]   (default out/scenes/hub/infirmarium)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'infirmarium');
const I = require('./int_shell')('infirmarium', { width: 10, depth: 9, height: 4.6, wall: '#585044', wall2: '#5e564a', floorCol: '#3e382e', floor: 'stone', ceilCol: '#34281c', beamCol: '#3e3022', seed: 3301, jambFix: true, panel: 'table', beamGap: 1.5,
  floorOpts: { courses: [1.1, 0.45, 0.8, 1.35, 0.5, 0.95, 0.4, 1.2, 0.7], wscale: 0.6 },
  lime: '#8c8676', limeOpts: { flakeStone: 'ashlar', flakes: 6, flakeT: [0.3, 3.2], stone: '#5a5244', damp: 0.6 } });
const S = I;
const { P, K, pp, p2, f1, INK, raw, layer, PLW, cel, hatch3, mix, hot, outline, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell } = E;
const DR = require('./dress_li')(I);
const H = require('./props_hub')(I);
const LINEN = '#a89e86', LINEND = '#6e6656', WOOD = '#4a3624', WOODL = '#6a5034', BLOOD = '#5a1410';
const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];
const KEEPER = { X: 1.75, Z: 4.85, h: (790 - 177) / (640 / 1.75), sprite: 'wenna', label: 'Sister Wenna', cutY: 0.82, cutZ: 4.55, figure: [177, 790], flip: true };
const TABLE = { x0: -1.0, x1: 1.7, z0: 4.05, z1: 4.7, top: 0.82 };
const fxL = s => { const l = S.curLayer(); layer('fx'); raw(s); layer(l); };

I.shell();
I.backWindow(-0.6, 0.6, 2.5, 4.15, { I: 0.75, range: 7.5, sky: '#5a5854', bars: 5 });   // light 1
I.door(6.0, 7.0, { side: -1, ts: 1.95 });                                               // light 2

// ------------------------------------------------------------------ the walls: limewash flaking to the ashlar, damp, cracks from the window,
// soot over the brazier; the order's iron cross over the window with rust run down from it; a chalked list of the dead
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, { patches: [[8.3, 1.7, 0.9, 0.8, '#7e786a', false]], bloom: [[0.5, 0.4, 1.1, 0.6], [9.4, 0.5, 0.9, 0.7], [6.0, 3.9, 1.2, 0.5]], cracks: [[4.4, 4.2, 0.9, 2.2], [5.6, 4.2, 0.8, 0.8], [7.0, 0.1, 1.0, 1.3]] });
  const atL = I.atL, LP = [atL(0, 0), atL(1, 0), atL(0, 1)];
  I.wear(atL, LP, { bloom: [[1.2, 0.4, 1.6, 0.6]], cracks: [[2.0, 3.4, 1.0, 2.3]], soot: [[2.6, 3.8, 1.0, 3.0, 0.16]] });
  const atR = I.atR, RP = [atR(0, 0), atR(1, 0), atR(0, 1)];
  I.wear(atR, RP, { patches: [[2.2, 2.4, 1.1, 0.8, '#968e7c', false]], bloom: [[5.6, 0.4, 1.2, 0.6]], cracks: [[3.4, 4.4, 1.1, 1.9]] });
  // the iron cross with its rust streak
  figProp(-1.0, 2.75, D1 - 0.03, (f, u) => { const a = 0.12 * u, b = 0.08 * u; f.line([[0, -a], [0, a]], 6, '#1a1816'); f.line([[-b, -0.04 * u], [b, -0.04 * u]], 6, '#1a1816'); f.line([[0, -a], [0, a]], 3.6, '#4a3a30'); f.line([[-b, -0.04 * u], [b, -0.04 * u]], 3.6, '#4a3a30'); f.line([[-1, -a + 3], [-1, a - 3]], 1, '#8a7a6a', { op: 0.5 }); f.flat([[-2, a], [2, a], [3, a + 0.18 * u], [0, a + 0.24 * u], [-2.5, a + 0.16 * u]], '#5a3020', { op: 0.35 }); f.rivet([0, -0.04 * u], 2.2, '#5a5452'); }, { tag: false });
  // the chalked list of names beside the pegs: nine lines, the older ones fainter, each struck through
  let ch = '';
  for (let r = 0; r < 9; r++) { const y = 2.42 - r * 0.13, w = 0.35 + R() * 0.25, pts = []; for (let k = 0; k <= 7; k++) pts.push(P(2.25 + w * k / 7, y + (R() - 0.5) * 0.012, D1 - 0.005)); ch += `<path d="M${pts.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L')}" stroke="#d0c8b4" stroke-width="1.1" fill="none" opacity="${r < 6 ? 0.55 : 0.3}"/>`; if (r < 6) { const A = P(2.23, y + 0.01, D1 - 0.005), B = P(2.27 + w, y - 0.005, D1 - 0.005); ch += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#d0c8b4" stroke-width="0.9" opacity="0.4"/>`; } }
  raw(PLW(BP, ch));
}

// ------------------------------------------------------------------ the left wall: shelves of remedies, every jar its own; gaps where one was used
prop(7.4, () => {
  const z0 = 7.45, z1 = 8.5, X = -HW + 0.38;
  for (const z of [z0, z1]) I.woodBox(-HW, X + 0.02, 0, 2.9, z - 0.025, z + 0.025, '#3e2e20', { cast: false, boards: 1, segs: 1 });
  for (const Y of [0.5, 1.15, 1.8, 2.45]) {
    I.woodBox(-HW, X, Y - 0.05, Y, z0, z1, '#4e3a28', { cast: false, boards: 1, topBoards: 2, segs: 1, nails: false });
    for (let z = z1 - 0.06; z > z0 + 0.06; z -= 0.08 + R() * 0.08) {
      const k = R();
      if (k < 0.12) continue;
      figProp(X - 0.14, Y, z, (f, u) => {
        if (k > 0.9) { f.part(ell([0, -0.05 * u], 0.05 * u, 0.05 * u, 0, 14), { fill: '#d0c8b4', shade: 0.35, inkW: 1.1 }); f.line(ell([0, -0.05 * u], 0.03 * u, 0.03 * u, 0, 12), 0.8, '#8a8270'); }
        else if (k > 0.78) H.crock(f, u); else H.bottle(f, u);
      }, { tag: false });
    }
  }
});

// linen screens on frames between the beds, stained, one drawn half across
for (const [X, Z] of [[-2.83, 7.0], [3.45, 7.0]]) prop(Z, () => {
  const z0 = Z, z1 = Z + 1.5;
  for (const z of [z0, z1]) raw(I.rod([X, 0, z], [X, 1.85, z], WOOD, 3));
  raw(I.rod([X, 1.85, z0], [X, 1.85, z1], WOOD, 3));
  const top = [], bot = []; for (let k = 0; k <= 10; k++) { const z = z0 + (z1 - z0) * k / 10; top.push([X + (k % 2 ? 0.035 : -0.035), 1.82, z]); bot.push([X + (k % 2 ? 0.05 : -0.05), 0.28 + R() * 0.06, z]); }
  const poly = [...top, ...bot.reverse()].map(p => P(...p));
  let o = cel(poly, { Z, fill: mix(LINEN, '#6a6050', R() * 0.4), tex: 'url(#mottle)', texOp: 0.45, band: 2 });
  for (let k = 1; k < 10; k++) { const z = z0 + (z1 - z0) * k / 10, A = P(X, 1.8, z), B = P(X, 0.32, z + (R() - 0.5) * 0.05); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${k % 2 ? '#3a3428' : '#d8d0bc'}" stroke-width="${k % 2 ? 1.1 : 0.8}" opacity="${k % 2 ? 0.5 : 0.35}"/>`; }
  o += hatch3((s, t) => [X, 0.3 + t, z0 + s], 0, z1 - z0, 0, 0.5, 0.8, { op: 0.3, ragged: 0.5 });
  o += S.stain(...P(X, 0.55, z0 + 0.7), K(Z) * 0.35, '#4a3a20', 0.35) + S.stain(...P(X, 1.2, z0 + 0.3), K(Z) * 0.1, BLOOD, 0.4);
  raw(PLW([[X, 0, z0], [X, 0, z1], [X, 1, z0]], o));
});
// ------------------------------------------------------------------ the beds along the back wall: the sick under grey wool
const beds = [-2.05, 2.55, 4.35], sick = [{ dead: true }, { sit: true }, { cough: true }];
beds.forEach((X, i) => prop(6.85, () => {
  const z0 = 6.85, z1 = 8.85, x0 = X - 0.5, x1 = X + 0.5, who = sick[i], hb = [0.95, 1.15, 0.8][i];
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(x0, x1, 0, 0.55, z0, z1), [0, 1, 0], 0), z0, { op: 0.28 })));
  I.woodBox(x0 - 0.04, x1 + 0.04, 0, hb, z1 - 0.06, z1, ['#3e2e20', '#4a3626', '#352a1e'][i], { bw: 0.2, cast: false });
  I.woodBox(x0, x1, 0, 0.36, z0, z1 - 0.06, [WOOD, '#5a4430', '#3e3024'][i], { bw: 0.12, cast: false });
  // the straw tick: ticking stripes on its front edge, lumpy
  const tk = [[x0 + 0.03, 0.36, z0 + 0.02], [x1 - 0.03, 0.36, z0 + 0.02], [x1 - 0.03, 0.44, z0 + 0.03], [x0 + 0.03, 0.44, z0 + 0.03]];
  let t = cel(tk.map(p => P(...p)), { Z: z0, fill: '#8a8068', band: 1 });
  for (let k = 1; k < 8; k++) { const A = P(x0 + 0.03 + (x1 - x0 - 0.06) * k / 8, 0.37, z0 + 0.02), B = P(x0 + 0.03 + (x1 - x0 - 0.06) * k / 8, 0.43, z0 + 0.03); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#4a4436" stroke-width="1" opacity="0.6"/>`; }
  raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], t));
  // the blanket over the body, seen from above: a tented top (lit left half, shaded and hatched right half) running from the
  // foot to under the bolster, with the body's ridge, the knees and the feet; its foot end hanging down; the side drape we see
  const zEnd = z1 - 0.62, N = 12, col = who.dead ? '#9a927e' : ['#5a5040', '#5e5a4c', '#4e4a42'][i];
  const ridgeH = u => 0.5 + (who.sit ? 0.12 : 0.09) + Math.sin(u * Math.PI * 1.7) * 0.035 + (u > 0.5 && u < 0.78 ? 0.035 : 0) + (u < 0.1 ? 0.05 : 0);
  const zz = k => z0 + 0.05 + (zEnd - z0 - 0.05) * k / N, rH = k => ridgeH(k / N), eH = 0.47, rX = k => X + 0.02 + Math.sin(k * 0.7) * 0.02;
  const Lp = [], Mp = [], Rp = [];
  for (let k = 0; k <= N; k++) { Lp.push([x0 - 0.03, eH, zz(k)]); Mp.push([rX(k), rH(k), zz(k)]); Rp.push([x1 + 0.03, eH, zz(k)]); }
  const side = X < 0 ? 1 : -1, sx = side > 0 ? x1 + 0.03 : x0 - 0.03;
  let b = cel([[sx, 0.3, z0 + 0.04], [sx, eH, zz(0)], [sx, eH, zEnd], [sx, 0.36, zEnd + 0.1]].map(p => P(...p)), { Z: z0, fill: mix(col, side > 0 ? S.SHT : '#000', 0.25), tex: 'url(#mottle)', texOp: 0.4, band: 1.5 });
  for (let k = 1; k < N; k += 2) { const A = P(sx, eH, zz(k)), B = P(sx, 0.32, zz(k) + 0.05); b += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#140c06" stroke-width="1" opacity="0.45"/>`; }
  const Lpoly = [...Lp, ...Mp.slice().reverse()].map(p => P(...p)), Rpoly = [...Mp, ...Rp.slice().reverse()].map(p => P(...p));
  b += cel(Lpoly, { Z: z0, fill: mix(col, S.KEY, 0.12), tex: 'url(#mottle)', texOp: 0.45, band: 1.2 });
  b += cel(Rpoly, { Z: z0, fill: mix(col, S.SHT, 0.35), tex: 'url(#mottle)', texOp: 0.45, band: 1.2 }) + `<path d="${p2(Rpoly)}" fill="${S.hatchA(z0)}" opacity="0.3"/>`;
  b += `<path d="${S.smooth(Mp.map(p => P(...p)), false, 0.5)}" stroke="${mix(col, S.KEY, 0.5)}" stroke-width="1.6" fill="none" opacity="0.6"/>`;
  for (const k of [3, 7, 10]) { const A = P(...Mp[k]), B = P(x0 - 0.02, eH, zz(k) + 0.12), C = P(x1 + 0.02, eH, zz(k) - 0.1); b += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + B[0]) / 2)} ${f1((A[1] + B[1]) / 2 + 2)} ${f1(B[0])} ${f1(B[1])} M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + C[0]) / 2)} ${f1((A[1] + C[1]) / 2 + 2)} ${f1(C[0])} ${f1(C[1])}" stroke="#140c06" stroke-width="0.9" fill="none" opacity="0.35"/>`; }
  // two woven bands across the blanket near its foot (a sheet on the dead one: no bands, a darned tear)
  if (!who.dead) for (const k of [1, 2]) { const q = [P(x0 - 0.03, eH, zz(k) - 0.04), P(...Mp[k].map((v, j) => j === 2 ? v - 0.04 : v)), P(x1 + 0.03, eH, zz(k) - 0.04), P(x1 + 0.03, eH, zz(k)), P(...Mp[k]), P(x0 - 0.03, eH, zz(k))]; b += `<path d="${p2(q)}" fill="#2a2420" opacity="0.55"/>`; }
  // the foot end hanging down over the tick, the two feet tenting it
  const ft = [[x0 - 0.03, 0.29, z0 + 0.03], [x1 + 0.03, 0.3, z0 + 0.03], [x1 + 0.03, eH, zz(0)], [rX(0), rH(0), zz(0)], [x0 - 0.03, eH, zz(0)]];
  b += cel(ft.map(p => P(...p)), { Z: z0, fill: col, tex: 'url(#mottle)', texOp: 0.45, band: 2 });
  for (const dx of [-0.12, 0.12]) { const A = P(X + dx, rH(0) - 0.02, zz(0)), B = P(X + dx * 1.2, 0.32, z0 + 0.03); b += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#140c06" stroke-width="1.1" opacity="0.5"/><path d="M${f1(A[0] - 1.2)} ${f1(A[1])} L${f1(B[0] - 1.2)} ${f1(B[1])}" stroke="${mix(col, S.KEY, 0.5)}" stroke-width="0.9" opacity="0.5"/>`; }
  { const hm = []; for (let k = 0; k <= 10; k++) hm.push(P(x0 - 0.03 + (x1 - x0 + 0.06) * k / 10, 0.3 + (k % 2) * 0.015, z0 + 0.03)); b += `<path d="${S.smooth(hm, false, 0.5)}" stroke="#2a2014" stroke-width="2.4" fill="none" opacity="0.5"/>`; }
  if (who.cough) b += S.stain(...P(X - 0.1, rH(N) - 0.02, zEnd - 0.1), K(z1) * 0.06, BLOOD, 0.65);
  raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], b));
  // the bolster and the head on it
  const hz = z1 - 0.45;
  { const bq = [[x0 + 0.04, 0.47, hz + 0.18], [x1 - 0.04, 0.47, hz + 0.18], [x1 - 0.04, 0.6, hz + 0.24], [x0 + 0.04, 0.6, hz + 0.24]]; raw(PLW([[0, 0, hz], [1, 0, hz], [0, 1, hz]], cel(bq.map(p => P(...p)), { Z: hz, fill: LINEN, tex: 'url(#mottle)', texOp: 0.4, band: 1.5 }) + `<path d="M${f1(P(x0 + 0.08, 0.59, hz + 0.24)[0])} ${f1(P(x0 + 0.08, 0.59, hz + 0.24)[1])} L${f1(P(x1 - 0.08, 0.59, hz + 0.24)[0])} ${f1(P(x1 - 0.08, 0.59, hz + 0.24)[1])}" stroke="#e8e0cc" stroke-width="1.2" opacity="0.5"/>`)); }
  figProp(X, who.sit ? 0.86 : 0.64, hz + 0.05, (f, u) => {
    f.raw('<g transform="scale(1.25)">');
    if (who.dead) { // the sheet drawn up over the face: the nose and the brow push it up
      f.part([[-0.16 * u, 0.04 * u], [-0.13 * u, -0.08 * u], [-0.04 * u, -0.12 * u], [0.02 * u, -0.16 * u], [0.06 * u, -0.11 * u], [0.14 * u, -0.08 * u], [0.17 * u, 0.04 * u]], { fill: LINEN, shadow: LINEND, shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.4 });
      f.line([[0.02 * u, -0.15 * u], [0.0, -0.06 * u], [-0.03 * u, 0.02 * u]], 1, '#3a3428', { op: 0.6 }); f.raw('</g>'); return;
    }
    if (who.sit) { // propped up in a linen shift, a stain of coughed blood at the breast
      f.part([[-0.24 * u, 0.24 * u], [-0.2 * u, -0.02 * u], [0.2 * u, -0.02 * u], [0.24 * u, 0.24 * u]], { fill: LINEN, shadow: LINEND, shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.4 });
      f.flat(ell([0.08 * u, 0.08 * u], 0.04 * u, 0.03 * u, 0.3, 8), BLOOD, { op: 0.65 }); f.line([[-0.12 * u, 0.02 * u], [-0.14 * u, 0.22 * u]], 1, '#3a3428', { op: 0.5 });
    }
    f.part([[-0.1 * u, 0], [-0.12 * u, -0.1 * u], [-0.06 * u, -0.19 * u], [0.04 * u, -0.2 * u], [0.11 * u, -0.13 * u], [0.1 * u, -0.02 * u], [0.04 * u, 0.03 * u], [-0.05 * u, 0.03 * u]], { fill: '#a8907a', shadow: '#6a5040', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5, inkW: 1.3 });
    f.part([[-0.12 * u, -0.08 * u], [-0.1 * u, -0.18 * u], [-0.02 * u, -0.23 * u], [0.08 * u, -0.2 * u], [0.12 * u, -0.12 * u], [0.06 * u, -0.15 * u], [-0.04 * u, -0.15 * u]], { fill: '#3a2e24', shade: 0.35, inkW: 1.1, cast: false, tex: PR.T(f, 'mottle'), texOp: 0.4 });
    f.line([[-0.06 * u, -0.07 * u], [-0.025 * u, -0.068 * u]], 1.4, '#2a1a14'); f.line([[0.02 * u, -0.068 * u], [0.055 * u, -0.072 * u]], 1.4, '#2a1a14');
    f.flat(ell([-0.04 * u, -0.06 * u], 0.03 * u, 0.012 * u, 0, 8), '#5a4038', { op: 0.5 }); f.flat(ell([0.04 * u, -0.06 * u], 0.03 * u, 0.012 * u, 0, 8), '#5a4038', { op: 0.5 });
    f.line([[-0.02 * u, -0.01 * u], [0.02 * u, -0.012 * u]], 1.1, '#4a2a24');
    f.raw('</g>');
  }, { tag: false });
  // a stool by the middle bed with a cup and a candle stub (lit)
  if (i === 1) { const sx = X - 0.75; for (const lx of [sx - 0.13, sx + 0.13]) I.beam(lx - 0.02, lx + 0.02, 0, 0.4, 7.43, 7.47, WOOD); I.woodBox(sx - 0.17, sx + 0.17, 0.4, 0.45, 7.3, 7.6, WOODL, { cast: false, boards: 1, topBoards: 2, segs: 1 });
    figProp(sx + 0.08, 0.45, 7.42, (f, u) => PR.cup(f, 0, 0.08 * u, '#6a5a48'), { tag: false });
    H.candles(sx, 7.45, 1, 0.45, 0.1); }                                           // light 3
}));
// ------------------------------------------------------------------ the back wall between the beds: the aumbry of remedies, one leaf hanging open
// on a broken hinge; the pegs with the cloaks and habits of the ones who did not leave
prop(D1 - 0.45, () => {
  const x0 = -1.42, x1 = -0.52, z = D1 - 0.42, ht = 2.15;
  I.woodBox(x0, x1, 0, ht, z, D1 - 0.02, '#3e2c1c', { bw: 0.18 });
  const dr = [[x0 + 0.05, 0.1, z - 0.01], [x1 - 0.05, 0.1, z - 0.01], [x1 - 0.05, ht - 0.1, z - 0.01], [x0 + 0.05, ht - 0.1, z - 0.01]];
  through(dr, () => {
    raw(`<path d="${pp(dr)}" fill="#160f0a"/>` + hatch3((s, t) => [x0 + 0.05 + s, 0.1 + t, z + 0.3], 0, 0.8, 0, ht - 0.2, 0.8, { op: 0.5 }));
    for (const Y of [0.6, 1.1, 1.6]) { I.woodBox(x0 + 0.05, x1 - 0.05, Y - 0.03, Y, z, z + 0.35, '#3a2a1c', { cast: false, boards: 1, topBoards: 1, segs: 1, nails: false });
      for (let X = x0 + 0.12; X < x1 - 0.1;) { const k = R(); if (k < 0.15) { X += 0.15; continue; } figProp(X, Y, z + 0.18, (f, u) => (k < 0.55 ? H.bottle(f, u) : H.crock(f, u)), { tag: false }); X += 0.12 + R() * 0.1; } }
  });
  I.woodFace([[x0 + 0.05, ht - 0.1, z - 0.02], [x0 + 0.47, ht - 0.1, z - 0.02], [x0 + 0.47, 0.1, z - 0.02], [x0 + 0.05, 0.1, z - 0.02]], '#4a3422', { bw: 0.15, segs: 1 });
  I.woodFace([[x1 - 0.05, ht - 0.15, z - 0.02], [x1 - 0.05 + 0.27, ht - 0.2, z - 0.38], [x1 - 0.05 + 0.27, 0.12, z - 0.38], [x1 - 0.05, 0.15, z - 0.02]], '#4a3422', { bw: 0.15, segs: 1 });
});
prop(D1 - 0.1, () => {
  for (let k = 0; k < 3; k++) {
    const X = 1.0 + k * 0.38, col = ['#3a3430', '#4a3a2a', '#3a3a3e'][k];
    raw(S.peg(X, 1.75, D1 - 0.02, { wood: true }));
    figProp(X, 1.74, D1 - 0.06, (f, u) => {
      const l = (0.85 + k * 0.1) * u;
      f.part([[-0.05 * u, 0], [0.05 * u, 0], [0.16 * u, 0.5 * u], [0.14 * u, l], [-0.12 * u, l * 1.02], [-0.15 * u, 0.45 * u]], { fill: col, shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.5 });
      for (const kk of [-0.4, 0.1, 0.5]) f.line([[kk * 0.05 * u, 0.06 * u], [kk * 0.12 * u, l * 0.6], [kk * 0.14 * u, l * 0.98]], 1.2, '#140c06', { op: 0.5 });
      f.part([[-0.09 * u, 0.02 * u], [-0.06 * u, -0.06 * u], [0.06 * u, -0.06 * u], [0.1 * u, 0.04 * u], [0.05 * u, 0.2 * u], [-0.07 * u, 0.2 * u]], { fill: mix(col, '#000', 0.1), shade: 0.4, inkW: 1.2, cast: false, tex: PR.T(f, 'weave'), texOp: 0.4 });
      f.flat([[-0.05 * u, 0.0], [0.05 * u, 0.0], [0.0, 0.1 * u]], '#0e0a08', { op: 0.4 });
      if (k === 1) { f.line([[0.05 * u, 0.3 * u], [0.06 * u, 0.55 * u]], 1.6, KK.P.rope); }
    }, { tag: false });
  }
});
// ------------------------------------------------------------------ the herb brazier at the left: an iron bowl on three legs, embers, a bundle of
// sage half burnt across it, thin smoke
const BRZ = [-2.3, 5.7];
prop(BRZ[1], () => {
  const [X, Z] = BRZ;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - 0.3, X + 0.3, 0, 0.78, Z - 0.3, Z + 0.3), [0, 1, 0], 0), Z, { op: 0.25 })));
  figProp(X, 0, Z, (f, u) => {
    for (const k of [-1, 0, 1]) { const a = [k * 0.12 * u, -0.72 * u], b = [k * 0.26 * u, 0]; f.line([a, [k * 0.21 * u, -0.38 * u], b], 6.4, '#1a1816'); f.line([a, [k * 0.21 * u, -0.38 * u], b], 4, '#3a3836'); f.flat(ell([b[0], -0.004 * u], 0.03 * u, 0.008 * u, 0, 6), '#1a1816'); }
    f.part([[-0.3 * u, -0.83 * u], [0.3 * u, -0.83 * u], [0.22 * u, -0.72 * u], [0.1 * u, -0.67 * u], [-0.1 * u, -0.67 * u], [-0.22 * u, -0.72 * u]], { fill: '#3a3836', light: '#6a6662', shade: 0.45, inkW: 1.8, tex: PR.T(f, 'mottle'), texOp: 0.5 });
    f.flat(ell([0.1 * u, -0.74 * u], 0.06 * u, 0.025 * u, 0, 8), '#5a2a14', { op: 0.55 });
    f.raw('<g class="em">');
    f.part(ell([0, -0.83 * u], 0.29 * u, 0.05 * u, 0, 18), { fill: '#8a2a10', shade: 0.2, inkW: 1.4, cast: false, hatch: false });
    for (let k = 0; k < 16; k++) f.flat(ell([(f.r() - 0.5) * 0.46 * u, -0.83 * u + (f.r() - 0.5) * 0.05 * u], (0.008 + f.r() * 0.012) * u, (0.005 + f.r() * 0.006) * u, 0, 6), f.r() < 0.45 ? '#ffb050' : '#3a2a1a');
    f.raw('</g>');
    f.line([[-0.2 * u, -0.87 * u], [0.15 * u, -0.9 * u]], 7, '#1a1816'); f.line([[-0.2 * u, -0.87 * u], [0.15 * u, -0.9 * u]], 5, '#6a7a52');
    for (let k = 0; k < 6; k++) f.line([[(-0.16 + k * 0.05) * u, -0.89 * u], [(-0.18 + k * 0.05) * u, -0.93 * u]], 1.4, '#4a5a3a');
    f.raw('<g class="em">'); f.flat([[-0.02 * u, -0.86 * u], [0.02 * u, -0.92 * u], [0.0, -0.97 * u], [-0.03 * u, -0.92 * u]], '#ffa83a'); f.flat([[0.08 * u, -0.86 * u], [0.1 * u, -0.9 * u], [0.085 * u, -0.94 * u], [0.065 * u, -0.9 * u]], '#ffd27a'); f.raw('</g>');
    // smoke: a few thin grey ribbons rising, curling, thinning
    for (let k = 0; k < 3; k++) { const pts = []; let x = (k - 1) * 0.05 * u; for (let j = 0; j <= 10; j++) { x += Math.sin(j * 0.9 + k * 2) * 0.025 * u; pts.push([x, -0.92 * u - j * 0.09 * u]); } f.line(pts, 3.6 - k * 0.6, k % 2 ? '#7a7e74' : '#8a8a80', { op: 0.22 }); f.line(pts.slice(3), 1.4, '#a8a89c', { op: 0.18 }); }
  });
  addLight(X, 1.0, Z - 0.1, 0.7, 4.5, [1.0, 0.6, 0.3]);                              // light 4
  fxL(glow(...P(X, 0.95, Z), K(Z) * 0.9, K(Z) * 0.75, '#ff9a4a', 0.4));
});
// herbs hung to dry from the beams: clustered, never in a row, each bunch a different plant
for (const [Z, xs] of [[D1 - 1.9, [-4.3, -3.95, -3.7, -1.6, -1.35, 1.9, 2.3, 2.45, 4.1]], [D1 - 3.4, [-4.1, -3.8, -2.2, -0.2, 0.15, 3.2, 3.55, 3.75]]]) prop(Z, () => {
  for (const X0 of xs) { const X = X0 + (R() - 0.5) * 0.1, drop = 0.05 + R() * 0.15; raw(I.rod([X, HT - 0.3, Z], [X, HT - 0.3 - drop, Z], '#8a7a56', 0.9)); figProp(X, HT - 0.3 - drop, Z, (f, u) => { f.raw(`<g transform="scale(${f1(0.8 + f.r() * 0.5)})">`); DR.HUNG.herbs(f, u); f.raw('</g>'); }, { tag: false }); }
});
// behind Wenna: a stretcher leaned on the wall, a wash basin on its stand with red water, bowls stacked
prop(5.9, () => {
  raw(I.rod([4.1, 0, 6.3], [4.5, 2.1, 6.9], WOOD, 4) + I.rod([4.6, 0, 6.3], [5.0, 2.1, 6.9], WOOD, 4));
  const cv = [[4.15, 0.25, 6.38], [4.6, 0.25, 6.38], [4.95, 1.9, 6.85], [4.5, 1.9, 6.85]];
  raw(PLW([cv[0], cv[1], cv[3]], cel(cv.map(p => P(...p)), { Z: 6.5, fill: '#7a6a4e', tex: 'url(#mottle)', texOp: 0.5 }) + S.stain(...P(4.5, 1.0, 6.6), K(6.5) * 0.2, BLOOD, 0.45) + S.stain(...P(4.6, 1.4, 6.7), K(6.5) * 0.15, '#3a2a1a', 0.45)));
  for (const lx of [3.55, 3.85]) I.beam(lx - 0.03, lx + 0.03, 0, 0.5, 5.87, 5.93, WOOD);
  figProp(3.7, 0.5, 5.9, (f, u) => { f.part([[-0.24 * u, -0.02 * u], [0.24 * u, -0.02 * u], [0.16 * u, 0.06 * u], [-0.16 * u, 0.06 * u]], { fill: '#7a6a52', light: '#a8987a', shade: 0.4, inkW: 1.4 }); f.part(ell([0, -0.02 * u], 0.24 * u, 0.045 * u, 0, 18), { fill: '#5a1a12', shade: 0.2, inkW: 1.2, cast: false, hatch: false }); f.line([[-0.12 * u, -0.025 * u], [0.04 * u, -0.03 * u]], 1.2, '#a84a3a', { op: 0.6 }); }, { tag: false });
  figProp(3.15, 0, 5.75, (f, u) => H.bowls(f, u), { tag: false });
});

// ================================================================== MID: the treatment table (Wenna's hands rest on it)
layer('mid');
prop(TABLE.z0, () => {
  const { x0, x1, z0, z1, top } = TABLE;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(x0, x1, 0, top, z0, z1), [0, 1, 0], 0), z0, { op: 0.3 })));
  for (const [lx, lz] of [[x0 + 0.1, z1 - 0.08], [x1 - 0.1, z1 - 0.08]]) I.beam(lx - 0.04, lx + 0.04, 0, top - 0.06, lz - 0.04, lz + 0.04, mix(WOOD, '#000', 0.15));
  I.beam(x0 + 0.1, x1 - 0.1, 0.16, 0.22, z0 + 0.06, z0 + 0.1, mix(WOOD, '#000', 0.15));
  for (const [lx, lz] of [[x0 + 0.1, z0 + 0.08], [x1 - 0.1, z0 + 0.08]]) I.beam(lx - 0.045, lx + 0.045, 0, top - 0.06, lz - 0.045, lz + 0.045, mix(WOOD, '#000', 0.15), { knots: 0.6 });
  // the top: a scrubbed board
  I.woodFace([[x0, top, z1], [x1, top, z1], [x1, top, z0], [x0, top, z0]], '#6a5440', { bw: 0.32, stains: 0.5, segs: 2 });
  I.woodFace([[x0, top, z0], [x1, top, z0], [x1, top - 0.08, z0], [x0, top - 0.08, z0]], mix(WOOD, '#000', 0.1), { boards: 1, segs: 2 });
  const tp = [[0, top, 1], [1, top, 1], [0, top, 2]];
  // the stained linen sheet on it, hanging over the front edge and bloodied at the hem
  const sh = [[x0 + 0.15, top + 0.004, z0 + 0.03], [x1 - 0.65, top + 0.004, z0 + 0.02], [x1 - 0.6, top + 0.004, z1 - 0.05], [x0 + 0.1, top + 0.004, z1 - 0.06]];
  raw(PLW(tp, cel(sh.map(p => P(...p)), { Z: z0, fill: LINEN, tex: 'url(#mottle)', texOp: 0.4, band: 1.4 }) + S.stain(...P(-0.2, top, 4.4), K(4.4) * 0.26, BLOOD, 0.55) + S.stain(...P(0.3, top, 4.3), K(4.3) * 0.13, '#4a1008', 0.5) + S.stain(...P(-0.7, top, 4.45), K(4.4) * 0.12, '#5a3a20', 0.45)));
  const hang = [P(x0 + 0.15, top, z0), P(x1 - 0.65, top, z0), P(x1 - 0.63, top - 0.28, z0 - 0.02), P(0.3, top - 0.24, z0 - 0.02), P(-0.2, top - 0.32, z0 - 0.02), P(x0 + 0.16, top - 0.26, z0 - 0.02)];
  let hs = cel(hang, { Z: z0, fill: LINEN, tex: 'url(#mottle)', texOp: 0.4, band: 2 });
  for (const X of [-0.75, -0.4, -0.05, 0.3, 0.7]) { const A = P(X, top - 0.01, z0 - 0.02), B = P(X + (R() - 0.5) * 0.05, top - 0.25, z0 - 0.02); hs += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${R() < 0.5 ? '#3a3428' : '#e8e0cc'}" stroke-width="1.2" opacity="0.5"/>`; }
  hs += S.stain(...P(-0.2, top - 0.22, z0), K(z0) * 0.1, BLOOD, 0.55);
  { const [dx, dy] = P(-0.16, top - 0.3, z0 - 0.02); hs += `<path d="M${f1(dx)} ${f1(dy)} q1 6 0 12" stroke="${BLOOD}" stroke-width="2.4" fill="none" opacity="0.7"/><circle cx="${f1(dx)}" cy="${f1(dy + 15)}" r="1.8" fill="${BLOOD}" opacity="0.7"/>`; }
  raw(PLW([[0, 0, z0 - 0.02], [1, 0, z0 - 0.02], [0, 1, z0 - 0.02]], hs));
  // leather straps hanging off the front
  for (const X of [x0 + 0.3, x1 - 0.4]) figProp(X, top, z0 - 0.025, (f, u) => { f.line([[0, 0], [0.01 * u, 0.18 * u], [-0.005 * u, 0.32 * u]], 5, '#1a120c'); f.line([[0, 0], [0.01 * u, 0.18 * u], [-0.005 * u, 0.32 * u]], 3, '#3a2618'); f.part([[-0.02 * u, 0.3 * u], [0.02 * u, 0.3 * u], [0.02 * u, 0.34 * u], [-0.02 * u, 0.34 * u]], { fill: '#4a4644', shade: 0.3, inkW: 0.9, cast: false }); }, { tag: false });
  // on the table: a basin of red water, a tray of instruments, the cup of vinegar, two candles
  figProp(-0.55, top, 4.5, (f, u) => { f.part([[-0.2 * u, -0.06 * u], [0.2 * u, -0.06 * u], [0.13 * u, 0.0], [-0.13 * u, 0.0]], { fill: '#7a7468', light: '#a8a296', shade: 0.4, inkW: 1.4 }); f.part(ell([0, -0.06 * u], 0.2 * u, 0.035 * u, 0, 18), { fill: '#5a1610', shade: 0.2, inkW: 1.2, cast: false, hatch: false }); f.line([[-0.1 * u, -0.065 * u], [0.02 * u, -0.07 * u]], 1, '#c87a6a', { op: 0.6 }); }, { tag: false });
  { const tr = [[0.15, top + 0.01, 4.3], [0.75, top + 0.01, 4.3], [0.75, top + 0.01, 4.55], [0.15, top + 0.01, 4.55]];
    let o = cel(tr.map(p => P(...p)), { Z: 4.3, fill: '#4a4844', band: 1.2 });
    for (let k = 0; k < 6; k++) { const X = 0.22 + k * 0.09, A = P(X, top + 0.02, 4.35), B = P(X + 0.03, top + 0.02, 4.51); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${k % 3 ? '#a8acb0' : '#5a4230'}" stroke-width="1.4"/>`; }
    raw(PLW(tp, o)); }
  figProp(1.0, top, 4.2, (f, u) => { f.part([[-0.04 * u, 0], [-0.05 * u, -0.1 * u], [0.05 * u, -0.1 * u], [0.04 * u, 0]], { fill: '#5a4a3a', shade: 0.4, inkW: 1.3 }); f.flat(ell([0, -0.1 * u], 0.045 * u, 0.012 * u, 0, 8), '#8a7a3a'); }, { tag: false });
  H.candles(-0.1, 4.62, 2, top, 0.2);                                                 // light 5
});
{
  const { x0, x1, z0, z1, top } = TABLE;
  hot('table', 'The treatment table', [P(x0, 0, z0), P(x1, 0, z0), P(x1, top, z0), P(x1, top, z1), P(x0, top, z1), P(x0, top, z0)]);
  outline('table', [[[[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]], true], [[[x0 + 0.1, 0, z0 + 0.08], [x0 + 0.1, top, z0 + 0.08]], false], [[[x1 - 0.1, 0, z0 + 0.08], [x1 - 0.1, top, z0 + 0.08]], false]]);
}

// ================================================================== FG: nearer than the table
layer('fg');
prop(4.3, () => H.lantern(0.7, HT - 0.3, 2.35, 4.4, { light: [0.7, 2.3, 4.35, 1.25, 4.8, [1.0, 0.68, 0.36]] }));   // light 6
// a bucket of soiled linen, a bandage trailing off it across the flags
prop(3.7, () => {
  figProp(0.35, 0, 3.7, (f, u) => { const w = 0.17 * u, h = 0.22 * u; f.part([[-w, -h], [w, -h], [w * 0.85, 0], [-w * 0.85, 0]], { fill: '#6a6460', light: '#8a8680', shade: 0.45, tex: PR.T(f, 'wood'), texOp: 0.4 }); for (const t of [0.15, 0.85]) f.line([[-w * (1 - t * 0.15), -h * t], [w * (1 - t * 0.15), -h * t]], 2.4, '#2a2826'); for (let k = 0; k < 4; k++) f.part(ell([(k - 1.5) * 0.07 * u, -h - 0.02 * u], 0.06 * u, 0.04 * u, f.r(), 9), { fill: k % 2 ? '#7a2a1a' : LINEN, shade: 0.4, inkW: 1.2, cast: false, tex: PR.T(f, 'weave'), texOp: 0.4 }); });
  const b = [[0.55, 0.005, 3.72], [0.7, 0.005, 3.85], [0.95, 0.005, 3.75], [1.15, 0.005, 3.95], [1.3, 0.005, 3.85]];
  raw(PLW(FLOOR, `<path d="${S.smooth(b.map(p => P(...p)), false, 0.5)}" stroke="${INK}" stroke-width="${f1(K(3.7) * 0.05 + 2)}" fill="none" stroke-linecap="round"/><path d="${S.smooth(b.map(p => P(...p)), false, 0.5)}" stroke="${LINEN}" stroke-width="${f1(K(3.7) * 0.05)}" fill="none" stroke-linecap="round"/>` + S.stain(...P(0.95, 0, 3.78), K(3.7) * 0.04, BLOOD, 0.6)));
});
// near left: a chest with clean blankets stacked on it, a crock and a bottle beside, rushes strewn across the floor
prop(3.6, () => {
  const atF = I.atF;
  DR.drift(atF, -3.5 + HW, 4.2 - D0, 1.0, 2.6, { base: '#4e4428' });
  raw(PLW(FLOOR, S.strew(atF, 1.2, 8.2, 0.3, 3.2, 140)));
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(-3.0, -2.05, 0, 0.5, 3.9, 4.4), [0, 1, 0], 0), 3.9, { op: 0.28 })));
  I.woodBox(-3.0, -2.05, 0, 0.5, 3.9, 4.4, '#4a3424', { bw: 0.12, cast: false });
  figProp(-2.52, 0.38, 3.89, (f, u) => { f.part([[-0.06 * u, 0], [-0.06 * u, -0.05 * u], [0.06 * u, -0.05 * u], [0.06 * u, 0]], { fill: '#3a3836', shade: 0.35, inkW: 1.2, cast: false }); f.flat(ell([0, -0.02 * u], 0.01 * u, 0.015 * u, 0, 6), '#0e0c0a'); }, { tag: false });
  figProp(-2.55, 0.5, 4.15, (f, u) => H.folded(f, u, 5, ['#8a8068', '#6a6050', '#a89e86', '#5a5040', '#7a7060']), { tag: false });
  figProp(-1.8, 0, 3.85, (f, u) => H.crock(f, u, '#7a5a3a')); figProp(-1.62, 0, 4.0, (f, u) => H.bottle(f, u, '#6a6a5a'));
});
// near right: a bucket of slops with a mop leaned in it
prop(3.3, () => {
  figProp(2.35, 0, 3.3, (f, u) => { const w = 0.15 * u, h = 0.32 * u; f.part([[-w, -h], [w, -h], [w * 0.85, 0], [-w * 0.85, 0]], { fill: '#4a3a28', shade: 0.45, tex: PR.T(f, 'wood'), texOp: 0.5 }); for (const t of [0.2, 0.75]) f.line([[-w, -h * t], [w, -h * t]], 3, '#2a2826'); f.part(ell([0, -h], w, 0.03 * u, 0, 14), { fill: '#2a1a14', shade: 0.2, inkW: 1.4, cast: false, hatch: false }); });
  raw(I.rod([2.42, 0.3, 3.32], [2.75, 1.5, 3.6], WOOD, 5));
});
// near middle: a low stool with a bowl of leeches
prop(3.2, () => {
  figProp(1.45, 0, 3.05, (f, u) => {
    for (const k of [-1, 0.2, 1]) { f.line([[k * 0.12 * u, -0.3 * u], [k * 0.2 * u, 0]], 5.6, '#1a120c'); f.line([[k * 0.12 * u, -0.3 * u], [k * 0.2 * u, 0]], 3.6, WOOD); }
    f.part(ell([0, -0.31 * u], 0.17 * u, 0.04 * u, 0, 14), { fill: '#5a4632', shade: 0.35, inkW: 1.4, tex: PR.T(f, 'wood'), texOp: 0.5 });
    f.part([[-0.1 * u, -0.38 * u], [0.1 * u, -0.38 * u], [0.06 * u, -0.32 * u], [-0.06 * u, -0.32 * u]], { fill: '#6a665e', shade: 0.4, inkW: 1.4, cast: false });
    f.part(ell([0, -0.38 * u], 0.1 * u, 0.02 * u, 0, 14), { fill: '#1a1a14', shade: 0.2, inkW: 1.1, cast: false, hatch: false });
    for (let k = 0; k < 3; k++) f.line([[(-0.06 + k * 0.05) * u, -0.383 * u], [(-0.04 + k * 0.05) * u, -0.392 * u], [(-0.02 + k * 0.05) * u, -0.383 * u]], 2.4, '#2a1a1a');
  });
});

// ================================================================== write
I.write(KEEPER, {}, OUT, { veil: { op: 0.52, cut: 0.32 } });
