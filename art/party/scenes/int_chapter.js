// The Chapter House in Living Ink. Same room as grim/int_chapter.js: same camera, room box (11 x 9.5 x 5.6, a tall barrel
// vault springing at 3.6 m with transverse ribs at 7.6 and 5.2), door (arched, in the left wall: the chapter house's garth
// door faces west), the lancet over the seat, keeper spot, hotspots (exit, charter, keeper), the twelve lights in grim's
// order and values, draw order bg / keeper / mid / fg.
// Prior Aldric's hall, the one clean room in the abbey: dressed ashlar in mixed courses, a stone bench round the walls where
// the chapter sits (worn cushions, a psalter, a cup, a rolled brief, a guttered stub left on it), the Prior's canopied seat of
// black oak on its step under the order's two red banners (the door and the keys), abbots' tomb slabs in the floor, tall iron
// candle stands, the armarium in the back wall open on rolled charters, the memorial board of the brothers dead in the Grey.
// The charter (the panel) lies on the lectern; Aldric stands beside it with the ledger of the dead (his burn scars are on his
// figure, worlds/keepers.js).
// Rulings kept: gold only on holy things. The order's sigils on the banners and the seat, and the charter's illumination,
// are gilt; grim's gold runner border, cushion tassels and memorial-board heading are ochre wool and paint here.
// Usage: node scenes/int_chapter.js [outDir]   (default out/scenes/hub/chapter)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'chapter');
const I = require('./int_shell')('chapter', { width: 11, depth: 9.5, height: 5.6, vault: true, spring: 3.6, wall: '#56504a', wall2: '#5e5850', vaultCol: '#4e4842', floorCol: '#46423c', floor: 'stone', stone: 'ashlar', seed: 7307, jambFix: true, panel: 'charter', ribs: [7.6, 5.2],
  vaultPlan: [1.25, 0.6, 0.95, 0.45, 1.15, 0.75, 1.35, 0.5],
  wallOpts: { dampCol: '#2e2c26', rough: true, roughP: 0.35, courses: [1.2, 0.5, 0.85, 0.36, 1.0, 0.6, 1.3, 0.45, 0.9], wscale: 0.62, lost: 0.06, spall: 0.08, mortar: 0.45, vary: 0.34, joint: 0.022 },
  floorOpts: { courses: [1.0, 0.55, 0.85, 1.25, 0.5, 0.95, 0.7, 1.15], wscale: 0.62 } });
const S = I;
const { P, K, pp, p2, f1, INK, raw, layer, PLW, cel, hatch3, mix, hot, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell } = E;
const DR = require('./dress_li')(I);
const H = require('./props_hub')(I);
const WOOD = '#3a2a1e', WOODL = '#5a4632', STONE = '#6a6458', RED = '#6a1612', REDL = '#8a2a1e', GOLD = KK.P.gold, GOLDL = KK.P.goldL, OCHRE = '#9a7a3a';
const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];
const KEEPER = { X: 1.05, Z: 4.75, h: (790 - 120) / (640 / 1.75), sprite: 'aldric', label: 'Prior Aldric', figure: [120, 790], flip: true };
const LECT = { X: -0.75, Z: 4.35 };
const fxL = s => { const l = S.curLayer(); layer('fx'); raw(s); layer(l); };
const Yv = I.Yv;

I.shell();
I.door(6.8, 7.8, { side: -1, ts: 2.1 });                                          // light 1

// ------------------------------------------------------------------ the walls: clean, but old: a crack from the window, damp at the feet, soot
// over the candle stands
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, { bloom: [[0.6, 0.5, 1.0, 0.6], [10.5, 0.5, 0.9, 0.6]], cracks: [[5.2, 3.85, 1.0, 2.2], [6.0, 3.85, 0.7, 0.9]], soot: [[1.6, 2.4, 1.9, 3.4, 0.08]] });
  for (const at of [I.atL, I.atR]) I.wear(at, [at(0, 0), at(1, 0), at(0, 1)], { bloom: [[3.0, 0.5, 1.6, 0.6]], cracks: [[2.2, 3.4, 1.0, 2.0]], soot: [[3.6, 4.6, 1.6, 3.2, 0.1]] });
}
// ------------------------------------------------------------------ abbots' tomb slabs in the floor: incised effigies, names worn off, cracked
function tombSlab(X, Z, w, d, fg) {
  const q = [[X - w / 2, 0.005, Z], [X + w / 2, 0.005, Z], [X + w / 2, 0.005, Z + d], [X - w / 2, 0.005, Z + d]];
  let o = cel(S.chip(q.map(p => P(...p)), 0.3), { Z, fill: fg ? '#44403a' : '#4e4a44', tex: 'url(#mottle)', texOp: 0.55, band: 1.5 });
  const inc = (pts, wd = fg ? 2 : 1.3) => `<path d="${p2(pts.map(p => P(...p)))}" fill="none" stroke="#24221c" stroke-width="${wd}"/><path d="${p2(pts.map(p => P(p[0] + 0.004, p[1], p[2] - 0.006)))}" fill="none" stroke="#8a8478" stroke-width="${f1(wd * 0.5)}" opacity="0.4"/>`;
  const e = (u, v) => [X + u * w, 0.006, Z + v * d];
  // the effigy: a robed figure, hands joined, a crozier along it; feet toward us
  o += inc([e(-0.12, 0.15), e(0.12, 0.15), e(0.17, 0.7), e(0.1, 0.8), e(0, 0.86), e(-0.1, 0.8), e(-0.17, 0.7)]);
  o += inc([e(-0.06, 0.83), e(0.06, 0.83), e(0.07, 0.92), e(-0.07, 0.92)], 1.1);
  { const A = P(...e(0.22, 0.2)), B = P(...e(0.2, 0.86)), C = P(...e(0.27, 0.92)); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} Q${f1(C[0])} ${f1(C[1] - 3)} ${f1(B[0] + 3)} ${f1(B[1] - 2)}" stroke="#24221c" stroke-width="1.2" fill="none"/>`; }
  o += inc([e(-0.43, 0.06), e(0.43, 0.06), e(0.43, 0.94), e(-0.43, 0.94)], 1);
  for (let k = 0; k < 11; k++) { const v = 0.1 + k * 0.075; if (R() < 0.35) continue; const A = P(...e(-0.4, v)), B = P(...e(-0.4, v + 0.04)); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#2a2620" stroke-width="1.1" opacity="0.7"/>`; }
  o += S.crack((s, t) => e(s, t), -0.3 + R() * 0.2, 0.5, 0.6, 0.6 + R(), { w: 0.7, branch: 1 });
  o += S.stain(...P(X + (R() - 0.5) * w * 0.5, 0, Z + d * 0.4), K(Z) * 0.08, '#2a2620', 0.4);
  if (fg) o += S.hatch3((s2, t) => [X - w / 2 + s2, 0.006, Z + t], 0, w, 0, d, 0.7, { op: 0.38, ragged: 0.2 }) + S.hatch3((s2, t) => [X - w / 2 + s2, 0.006, Z + t], 0, w, 0, d * 0.55, -0.8, { op: 0.3, ragged: 0.3 });
  raw(PLW(FLOOR, o));
}
for (const [X, Z] of [[-1.1, 5.9], [1.1, 5.9], [-1.1, 7.5], [1.1, 7.5]]) tombSlab(X, Z, 0.9, 1.0);
// ------------------------------------------------------------------ the red runner from the lectern to the seat: frayed, patched, its ochre
// border pattern trodden grey down the middle
{
  const x0 = -0.42, x1 = 0.42, z0 = 4.75, z1 = D1 - 1.0, q = [[x0, 0.007, z0], [x1, 0.007, z0], [x1, 0.007, z1], [x0, 0.007, z1]];
  let o = cel(q.map(p => P(...p)), { Z: z0, fill: '#5a1a14', tex: 'url(#mottle)', texOp: 0.55, band: 1.2 }) + `<path d="${pp(q)}" fill="url(#speck)" opacity="0.4"/>`;
  for (const X of [x0 + 0.06, x1 - 0.06]) { const A = P(X, 0.008, z0 + 0.05), B = P(X, 0.008, z1 - 0.05); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${OCHRE}" stroke-width="1.8" opacity="0.55" stroke-dasharray="6 3"/>`; }
  for (let z = z0 + 0.25; z < z1 - 0.1; z += 0.45) o += `<path d="${pp([[-0.12, 0.008, z], [0, 0.008, z + 0.12], [0.12, 0.008, z], [0, 0.008, z - 0.12]])}" fill="none" stroke="${OCHRE}" stroke-width="1.4" opacity="0.4"/>`;
  o += `<path d="${pp([[-0.2, 0.008, z0], [0.2, 0.008, z0], [0.16, 0.008, z1], [-0.16, 0.008, z1]])}" fill="#3a2a26" opacity="0.4"/>` + hatch3((s, t) => [-0.18 + s, 0.008, z0 + t], 0, 0.36, 0, z1 - z0, 0.2, { op: 0.25, ragged: 0.3 });
  o += cel([[0.15, 0.009, 6.1], [0.35, 0.009, 6.1], [0.35, 0.009, 6.5], [0.15, 0.009, 6.5]].map(p => P(...p)), { Z: 6.1, fill: '#4a2a1e', band: 0.8 }) + `<path d="${pp([[0.15, 0.009, 6.1], [0.35, 0.009, 6.1], [0.35, 0.009, 6.5], [0.15, 0.009, 6.5]])}" fill="none" stroke="#c8b890" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.6"/>`;
  let fr = ''; for (let X = x0; X <= x1; X += 0.035) { const [fx, fy] = P(X, 0.008, z0); fr += `M${f1(fx)} ${f1(fy)} l${f1((R() - 0.5) * 3)} ${f1(K(z0) * 0.03)} `; }
  raw(PLW(FLOOR, o + `<path d="${fr}" stroke="#6a2a1a" stroke-width="1.2"/>`));
}
// ------------------------------------------------------------------ the stone bench round the back and side walls (dressed ashlar)
const bench = (x0, x1, z0, z1) => I.stoneBox(x0, x1, 0, 0.48, z0, z1, STONE, { ashlar: { scale: 0.3, wscale: 0.5, courses: [0.9, 0.55, 1.0] } });
prop(D1 - 0.3, () => { bench(-HW, HW, D1 - 0.5, D1 - 0.01); });
prop(6.0, () => { bench(HW - 0.5, HW, 4.5, D1 - 0.5); for (const [z0, z1] of [[4.5, 6.55], [8.05, D1 - 0.5]]) bench(-HW, -HW + 0.5, z0, z1); });
// what the chapter left on the bench: cushions worn flat, a cloak, a psalter, a cup, a rolled brief with its seal, a guttered stub
{
  const bz = D1 - 0.25, by = 0.48;
  prop(bz, () => {
    for (const [X, col] of [[-4.6, '#4a1a14'], [-3.1, '#3a3a30'], [2.7, '#5a3a2a'], [4.3, '#4a1a14']]) figProp(X, by, bz, (f, u) => { const w = (0.22 + f.r() * 0.08) * u; f.part([[-w, 0], [-w * 1.02, -0.05 * u], [-w * 0.7, -0.08 * u], [w * 0.7, -0.075 * u], [w, -0.04 * u], [w * 0.98, 0]], { fill: col, shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.5 }); f.line([[-w * 0.7, -0.04 * u], [0, -0.02 * u], [w * 0.7, -0.04 * u]], 0.9, '#140c06', { op: 0.5 }); for (const dx of [-w, w]) f.line([[dx, -0.03 * u], [dx + Math.sign(dx) * 4, -0.01 * u]], 2, OCHRE); });
    figProp(-2.2, by, bz - 0.05, (f, u) => H.folded(f, u, 2, ['#2a2a30', '#3a3a34']));
    figProp(3.4, by, bz - 0.1, (f, u) => { f.part([[-0.12 * u, 0], [0.12 * u, 0], [0.12 * u, -0.05 * u], [-0.12 * u, -0.05 * u]].map(p => [p[0], p[1], 1]), { fill: '#3a1a14', shade: 0.35, inkW: 1.2, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.part([[-0.115 * u, -0.01 * u], [0.115 * u, -0.01 * u], [0.115 * u, -0.04 * u], [-0.115 * u, -0.04 * u]].map(p => [p[0], p[1], 1]), { fill: '#d8ccb0', shade: 0.2, inkW: 0.6, cast: false, hatch: false }); f.line([[0.1 * u, -0.05 * u], [0.11 * u, 0.04 * u]], 1.6, '#7a1a14'); });
    figProp(3.85, by, bz - 0.1, (f, u) => H.crock(f, u), { tag: false });
    figProp(-3.8, by, bz - 0.1, (f, u) => { f.line([[-0.15 * u, -0.03 * u], [0.15 * u, -0.035 * u]], 0.06 * u + 2.4, INK); f.line([[-0.15 * u, -0.03 * u], [0.15 * u, -0.035 * u]], 0.06 * u, '#d8ccb0'); f.line([[0, -0.06 * u], [0, 0.02 * u]], 2, '#8a1a14'); f.part(ell([0, 0.035 * u], 0.022 * u, 0.02 * u, 0, 10), { fill: '#6a120e', shade: 0.35, inkW: 0.9, cast: false }); });
  });
  H.candles(-1.6, bz - 0.1, 1, by, 0.05);                                           // light 2
}
// ------------------------------------------------------------------ the memorial board of the brothers dead in the Grey: names painted, painted
// over, a few struck through in red; the newest at the foot, brightest
prop(D1 - 0.03, () => {
  const X = -3.6, Y = 1.2, w = 0.9, h = 1.3, z = D1 - 0.03;
  I.woodFace([[X - w / 2, Y + h, z], [X + w / 2, Y + h, z], [X + w / 2, Y, z], [X - w / 2, Y, z]], '#2e2018', { bw: h / 3, knots: 0.2, segs: 1 });
  const inner = [[X - w / 2 + 0.06, Y + 0.06, z - 0.003], [X + w / 2 - 0.06, Y + 0.06, z - 0.003], [X + w / 2 - 0.06, Y + h - 0.16, z - 0.003], [X - w / 2 + 0.06, Y + h - 0.16, z - 0.003]];
  let t = cel(inner.map(p => P(...p)), { Z: z, fill: '#1a1410', band: 1 });
  { const A = P(X - w / 2 + 0.1, Y + h - 0.1, z - 0.004), B = P(X + w / 2 - 0.1, Y + h - 0.1, z - 0.004); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#8a1a14" stroke-width="2.2"/>`; }
  const n = 14; for (let r = 0; r < n; r++) { const yy = Y + h - 0.22 - r * (h - 0.32) / n, len = (w - 0.2) * (0.4 + R() * 0.55), A = P(X - w / 2 + 0.1, yy, z - 0.004), B = P(X - w / 2 + 0.1 + len, yy, z - 0.004); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${r > n - 4 ? '#e8e0d0' : '#c8b890'}" stroke-width="1.1" opacity="${r > n - 4 ? 0.9 : 0.55}" stroke-dasharray="${f1(2 + R() * 3)} 1.2"/>`; if (R() < 0.15) t += `<path d="M${f1(A[0] - 1)} ${f1(A[1] + 1)} L${f1(B[0] + 2)} ${f1(B[1] - 1)}" stroke="#8a1a14" stroke-width="1.1"/>`; }
  raw(PLW([[0, 0, z], [1, 0, z], [0, 1, z]], t));
  raw(S.peg(X - w / 2 + 0.03, Y + h - 0.03, z - 0.01, {}) + S.peg(X + w / 2 - 0.03, Y + h - 0.03, z - 0.01, {}));
});
// ------------------------------------------------------------------ the armarium in the back wall: a deep cupboard, one leaf open on rolled
// charters and a seal box
prop(D1 - 0.05, () => {
  const x0 = 2.9, x1 = 4.0, y0 = 0.9, y1 = 2.4, z = D1 - 0.02, hole = [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
  through(hole, () => {
    raw(`<path d="${pp(hole)}" fill="#140e0a"/>` + hatch3((s, t) => [x0 + s, y0 + t, z + 0.4], 0, x1 - x0, 0, y1 - y0, 0.8, { op: 0.5 }));
    for (const Y of [1.4, 1.9]) I.woodBox(x0, x1, Y - 0.03, Y, z, z + 0.4, '#3a2a1c', { cast: false, boards: 1, topBoards: 1, segs: 1, nails: false });
    for (const [Y, n] of [[y0, 6], [1.4, 4], [1.9, 3]]) for (let k = 0; k < n; k++) { const X = x0 + 0.12 + k * 0.16 + (R() - 0.5) * 0.04;
      figProp(X, Y + 0.06, z + 0.2, (f, u) => { const c = mix('#b8a880', '#6a5a40', f.r() * 0.6); f.part(ell([0, 0], 0.05 * u, 0.05 * u, 0, 14), { fill: c, shade: 0.35, inkW: 1, cast: false }); f.line(ell([0, 0], 0.03 * u, 0.03 * u, 0, 12).slice(0, 10), 0.8, '#6a5a40'); f.line(ell([0, 0], 0.015 * u, 0.015 * u, 0, 10).slice(0, 8), 0.7, '#6a5a40'); if (f.r() < 0.4) { f.line([[0, 0.05 * u], [0, 0.12 * u]], 1, '#c8b890'); f.part(ell([0, 0.14 * u], 0.02 * u, 0.02 * u, 0, 8), { fill: '#6a120e', shade: 0.3, inkW: 0.7, cast: false }); } }, { tag: false }); }
  });
  for (const [p, q] of [[[x0 - 0.1, y0 - 0.1], [x0, y1 + 0.1]], [[x1, y0 - 0.1], [x1 + 0.1, y1 + 0.1]], [[x0 - 0.1, y1], [x1 + 0.1, y1 + 0.12]], [[x0 - 0.1, y0 - 0.12], [x1 + 0.1, y0]]]) I.woodFace([[p[0], q[1], z - 0.01], [q[0], q[1], z - 0.01], [q[0], p[1], z - 0.01], [p[0], p[1], z - 0.01]], '#2e2018', { boards: 1, knots: 0.3, segs: 1 });
  I.woodFace([[x0, y1, z - 0.02], [x0 - 0.12, y1, z - 0.5], [x0 - 0.12, y0, z - 0.5], [x0, y0, z - 0.02]], '#3a2a1c', { bw: 0.18, segs: 1 });
  figProp(x0 - 0.1, 1.6, z - 0.45, (f, u) => { const r = ell([0, 0], 0.03 * u, 0.03 * u, 0, 14); f.line(r.concat([r[0]]), 3.4, '#1a1816'); f.line(r.concat([r[0]]), 1.8, '#4a4644'); }, { tag: false });
});
// ------------------------------------------------------------------ the floor: a stool knocked over, a coffer of charters at the lectern's foot,
// rushes scattered thin
prop(5.6, () => {
  raw(PLW(FLOOR, S.strew(I.atF, 3.0, 8.3, 1.7, 5.3, 90, { cols: ['#5a5030', '#6a6038', '#4a4228'] })));
  I.woodBox(-2.05, -1.45, 0, 0.35, 5.05, 5.45, '#3a2a1c', { bw: 0.1 });
  raw(I.rod([-2.03, 0.36, 5.05], [-1.47, 0.36, 5.05], '#2a2826', 3));
  figProp(-1.75, 0.35, 5.2, (f, u) => { for (let k = 0; k < 3; k++) { const x = (-0.18 + k * 0.18) * u; f.part([[x - 0.06 * u, 0], [x + 0.06 * u, 0], [x + 0.05 * u, -0.04 * u], [x - 0.05 * u, -0.04 * u]], { fill: '#d8ccb0', shade: 0.35, inkW: 0.9, cast: false }); } }, { tag: false });
  figProp(2.3, 0, 5.6, (f, u) => {
    f.part([[-0.18 * u, -0.02 * u], [0.18 * u, -0.06 * u], [0.2 * u, -0.01 * u], [-0.16 * u, 0.03 * u]], { fill: '#4a3624', shade: 0.4, inkW: 1.3, tex: PR.T(f, 'wood'), texOp: 0.5 });
    for (const [a, b] of [[[-0.12, -0.03], [-0.36, -0.12]], [[0.04, -0.05], [-0.18, -0.2]], [[0.15, -0.05], [0.05, -0.28]]]) { f.line([[a[0] * u, a[1] * u], [b[0] * u, b[1] * u]], 0.025 * u + 2, INK); f.line([[a[0] * u, a[1] * u], [b[0] * u, b[1] * u]], 0.025 * u, '#4a3624'); }
  });
});
// ------------------------------------------------------------------ the Prior's seat: a tall canopied chair of black oak on a stone step, blind
// tracery across its back, crockets up the gable, the order's door and key carved and gilt; the banners either side
prop(D1 - 0.6, () => {
  const z = D1 - 0.6;
  I.stoneBox(-1.0, 1.0, 0, 0.25, z - 0.4, D1 - 0.02, STONE, { ashlar: { scale: 0.25, wscale: 0.5 } });
  // the back and its gable
  const zb = D1 - 0.1;
  I.woodFace([[-0.62, 0.75, zb], [-0.62, 3.2, zb], [0.62, 3.2, zb], [0.62, 0.75, zb]], WOOD, { bw: 0.31, knots: 0.2, segs: 1 });
  for (const [a, b] of [[[-0.62, 0.75], [-0.62, 3.2]], [[0.62, 0.75], [0.62, 3.2]], [[-0.62, 3.2], [0.62, 3.2]], [[-0.62, 2.7], [0.62, 2.7]]]) raw(I.rod([a[0], a[1], zb - 0.01], [b[0], b[1], zb - 0.01], '#2a1e14', 4));
  raw(PLW([[0, 0, zb], [1, 0, zb], [0, 1, zb]], cel([[-0.66, 3.2, zb], [0.66, 3.2, zb], [0, 3.62, zb]].map(p => P(...p)), { Z: zb, fill: WOOD, tex: 'url(#mottle)', texOp: 0.4 })));
  { let tr = '';
    for (let k = 0; k < 4; k++) { const xa = -0.52 + k * 0.27, xb = xa + 0.22; tr += cel([[xa, 2.75, zb - 0.005], [xb, 2.75, zb - 0.005], [xb, 3.0, zb - 0.005], [xa + 0.11, 3.12, zb - 0.005], [xa, 3.0, zb - 0.005]].map(p => P(...p)), { Z: zb, fill: '#140c08', band: 1 }); }
    for (let k = 1; k < 6; k++) { const t = k / 6; for (const sd of [-1, 1]) { const [qx, qy] = P(sd * 0.64 * (1 - t), 3.2 + 0.42 * t, zb); tr += `<path d="M${f1(qx)} ${f1(qy)} q${f1(sd * 3)} -6 ${f1(sd * 7)} -4" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="M${f1(qx)} ${f1(qy)} q${f1(sd * 3)} -6 ${f1(sd * 7)} -4" stroke="${WOODL}" stroke-width="1" fill="none"/>`; } }
    // the order's door and key, carved and gilt (a holy sigil: gilt is right here)
    const s = K(zb), [cx, cy] = P(0, 2.2, zb - 0.01);
    tr += `<path d="M${f1(cx - s * 0.2)} ${f1(cy + s * 0.4)} L${f1(cx - s * 0.2)} ${f1(cy - s * 0.1)} Q${f1(cx)} ${f1(cy - s * 0.35)} ${f1(cx + s * 0.2)} ${f1(cy - s * 0.1)} L${f1(cx + s * 0.2)} ${f1(cy + s * 0.4)}" stroke="${INK}" stroke-width="4" fill="none"/><path d="M${f1(cx - s * 0.2)} ${f1(cy + s * 0.4)} L${f1(cx - s * 0.2)} ${f1(cy - s * 0.1)} Q${f1(cx)} ${f1(cy - s * 0.35)} ${f1(cx + s * 0.2)} ${f1(cy - s * 0.1)} L${f1(cx + s * 0.2)} ${f1(cy + s * 0.4)}" stroke="${GOLD}" stroke-width="2.2" fill="none"/>`;
    tr += `<circle cx="${f1(cx)}" cy="${f1(cy + s * 0.08)}" r="${f1(s * 0.035)}" fill="none" stroke="${GOLD}" stroke-width="2"/><path d="M${f1(cx)} ${f1(cy + s * 0.115)} l0 ${f1(s * 0.14)} l${f1(s * 0.04)} 0" stroke="${GOLD}" stroke-width="2" fill="none"/><path d="M${f1(cx - s * 0.19)} ${f1(cy - s * 0.08)} Q${f1(cx)} ${f1(cy - s * 0.32)} ${f1(cx + s * 0.1)} ${f1(cy - s * 0.2)}" stroke="${GOLDL}" stroke-width="1" fill="none" opacity="0.7"/>`;
    raw(PLW([[0, 0, zb], [1, 0, zb], [0, 1, zb]], tr)); }
  for (const X of [-0.66, 0.66]) figProp(X, 3.2, zb, (f, u) => { f.part([[-0.03 * u, 0], [0.03 * u, 0], [0, -0.2 * u, 1]], { fill: WOOD, shade: 0.4, inkW: 1.3, cast: false }); f.part(ell([0, -0.2 * u], 0.015 * u, 0.015 * u, 0, 8), { fill: WOODL, inkW: 0.8, cast: false, hatch: false }); }, { tag: false });
  // the seat box, its arms, the red cushion worn thin
  I.woodBox(-0.6, 0.6, 0.25, 0.75, z - 0.1, D1 - 0.1, WOOD, { bw: 0.12 });
  for (const X of [-0.66, 0.54]) I.woodBox(X, X + 0.12, 0.75, 1.15, z - 0.1, D1 - 0.12, WOOD, { bw: 0.06, cast: false });
  figProp(0, 0.76, z - 0.05, (f, u) => { f.part([[-0.52 * u, 0], [0.52 * u, 0], [0.5 * u, -0.1 * u], [0.1 * u, -0.09 * u], [-0.5 * u, -0.1 * u]], { fill: RED, light: REDL, shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.45 }); f.flat(ell([0.05 * u, -0.06 * u], 0.25 * u, 0.025 * u, 0, 12), '#3a0a08', { op: 0.45 }); f.line([[-0.45 * u, -0.08 * u], [-0.1 * u, -0.085 * u]], 1, '#c87a6a', { op: 0.35 }); }, { tag: false });
  for (const X of [-0.6, 0.6]) I.beam(X - 0.035, X + 0.035, 0.75, 1.4, D1 - 0.24, D1 - 0.16, WOOD);
  // the banners: long red cloths hung from iron rods, the order's sigils in faded gilt, frayed and stained at the foot
  for (const [X, bot, w, dev] of [[-1.7, 1.6, 0.42, 'door'], [1.75, 2.0, 0.38, 'keys']]) {
    const top = 4.4, zz = D1 - 0.06;
    raw(I.rod([X - w - 0.1, top, D1 - 0.05], [X + w + 0.1, top, D1 - 0.05], '#2a2826', 3));
    for (const dx of [-w - 0.08, w + 0.08]) raw(S.peg(X + dx, top + 0.02, D1 - 0.03, { r: 0.012 }));
    const pts = [[X - w, top, zz], [X + w, top, zz]]; for (let k = 6; k >= 0; k--) { const t = k / 6; pts.push([X - w + 2 * w * t, bot + (k % 2 ? 0.15 : 0) + R() * 0.05, zz]); }
    let b = cel(pts.map(p => P(...p)), { Z: zz, fill: dev === 'door' ? '#6a1612' : '#5a1410', tex: 'url(#mottle)', texOp: 0.5, band: 2.5 }) + `<path d="${pp(pts)}" fill="url(#speck)" opacity="0.3"/>`;
    for (const t of [-0.55, -0.15, 0.3, 0.7]) { const A = P(X + w * t, top - 0.05, zz), B = P(X + w * t * 1.08, bot + 0.15, zz); b += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + B[0]) / 2 + 3)} ${f1((A[1] + B[1]) / 2)} ${f1(B[0])} ${f1(B[1])}" stroke="#1a0404" stroke-width="1.6" fill="none" opacity="0.5"/>`; }
    b += hatch3((s, t) => [X - w + s, bot + t, zz], 0, 2 * w, 0, (top - bot) * 0.35, 0.8, { op: 0.35, ragged: 0.4 });
    const [bx, by] = P(X, 3.1, zz), s2 = K(D1);
    if (dev === 'keys') b += [-1, 1].map(sd => `<g transform="rotate(${sd * 35} ${f1(bx)} ${f1(by)})"><path d="M${f1(bx)} ${f1(by - s2 * 0.4)} L${f1(bx)} ${f1(by + s2 * 0.3)} l${f1(s2 * 0.08)} 0 m${f1(-s2 * 0.08)} ${f1(-s2 * 0.08)} l${f1(s2 * 0.06)} 0" stroke="${GOLD}" stroke-width="2.6" fill="none" opacity="0.85"/><circle cx="${f1(bx)}" cy="${f1(by - s2 * 0.46)}" r="${f1(s2 * 0.07)}" fill="none" stroke="${GOLD}" stroke-width="2.6" opacity="0.85"/></g>`).join('');
    else b += `<path d="M${f1(bx - s2 * 0.18)} ${f1(by + s2 * 0.4)} L${f1(bx - s2 * 0.18)} ${f1(by - s2 * 0.1)} Q${f1(bx)} ${f1(by - s2 * 0.38)} ${f1(bx + s2 * 0.18)} ${f1(by - s2 * 0.1)} L${f1(bx + s2 * 0.18)} ${f1(by + s2 * 0.4)}" stroke="${GOLD}" stroke-width="2.6" fill="none" opacity="0.75"/><path d="M${f1(bx - s2 * 0.1)} ${f1(by + s2 * 0.4)} L${f1(bx - s2 * 0.1)} ${f1(by)} Q${f1(bx)} ${f1(by - s2 * 0.16)} ${f1(bx + s2 * 0.1)} ${f1(by)} L${f1(bx + s2 * 0.1)} ${f1(by + s2 * 0.4)}" fill="#2a0606" opacity="0.6"/>`;
    b += S.stain(bx + s2 * 0.1, by + s2 * 0.6, s2 * 0.18, '#1a0604', 0.45);
    let fr = ''; for (let k = 0; k <= 12; k++) { const [fx, fy] = P(X - w + 2 * w * k / 12, top - 0.04, zz - 0.005); fr += `M${f1(fx)} ${f1(fy)} l0 5 `; } b += `<path d="${fr}" stroke="${GOLD}" stroke-width="1.3" opacity="0.6"/>`;
    raw(PLW([[0, 0, zz], [1, 0, zz], [0, 1, zz]], b));
  }
});
// ------------------------------------------------------------------ tall iron candle stands: a three-branched one burning, and one with a single fat
// candle guttered into a beard of wax
for (const [X, kind, Z] of [[-3.0, 'three', 6.5], [3.7, 'fat', 7.6]]) prop(Z, () => {
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - 0.22, X + 0.22, 0, 1.45, Z - 0.05, Z + 0.15), [0, 1, 0], 0), Z, { op: 0.22 })));
  raw(I.rod([X, 0, Z], [X, 1.45, Z], '#2a2826', 5));
  for (const d of [-0.2, 0, 0.2]) raw(I.rod([X, 0.12, Z], [X + d, 0, Z + (d === 0 ? 0.18 : -0.03)], '#2a2826', 4));
  raw(I.rod([X - 0.05, 0.75, Z], [X + 0.05, 0.75, Z], '#2a2826', 7));
  if (kind === 'three') {
    for (const d of [-0.22, 0.22]) raw(I.rod([X, 1.3, Z], [X + d, 1.38, Z], '#2a2826', 3) + I.rod([X + d, 1.38, Z], [X + d, 1.45, Z], '#2a2826', 3));
    H.candles(X - 0.22, Z, 1, 1.46, 0.05); H.candles(X + 0.22, Z, 1, 1.46, 0.05); H.candles(X, Z, 1, 1.47, 0.05);   // lights 3, 4, 5
  } else {
    figProp(X, 1.45, Z, (f, u) => {
      f.part([[-0.1 * u, 0], [0.1 * u, 0], [0.06 * u, -0.02 * u], [-0.06 * u, -0.02 * u]], { fill: '#2a2826', shade: 0.35, inkW: 1.2, cast: false });
      f.part([[-0.045 * u, -0.02 * u], [0.045 * u, -0.02 * u], [0.045 * u, -0.22 * u], [-0.045 * u, -0.22 * u]], { fill: KK.P.wax, shadow: KK.P.waxD, shade: 0.4, inkW: 1.2, cast: false });
      for (let k = 0; k < 7; k++) { const dx = (f.r() - 0.5) * 0.1 * u, l = (0.05 + f.r() * 0.2) * u; f.line([[dx, -0.02 * u], [dx + 1, -0.02 * u + l * 0.5], [dx, -0.02 * u + l]], 4.2, INK); f.line([[dx, -0.02 * u], [dx + 1, -0.02 * u + l * 0.5], [dx, -0.02 * u + l]], 2.6, '#e0d4b8'); }
    }, { tag: false });
    H.candles(X, Z, 1, 1.66, 0.02);                                                  // light 7
  }
  addLight(X, 1.7, Z - 0.15, kind === 'three' ? 1.05 : 0.8, 4.5, [1.0, 0.72, 0.42]);   // lights 6, 8
  fxL(glow(...P(X, 1.6, Z), K(Z) * 1.0, K(Z) * 0.9, '#ffb060', 0.35));
});
// ------------------------------------------------------------------ the lancet high in the back wall over the seat; the lamp burning before the seat
I.backWindow(-0.35, 0.35, 3.9, 5.2, { I: 0.75, range: 8, sky: '#5e5e5a', bars: 1 });     // light 9
prop(8.3, () => {
  const top = Yv(0) - 0.05; raw(I.rod([0, top, 8.3], [0, 3.32, 8.3], '#3a3026', 1.2));
  figProp(0, 3.3, 8.3, (f, u) => { for (const dx of [-0.07, 0.07]) f.line([[0, -0.02 * u], [dx * u, 0.06 * u]], 1.2, '#1a120c'); f.part([[-0.08 * u, 0.06 * u], [0.08 * u, 0.06 * u], [0.05 * u, 0.14 * u], [0, 0.17 * u], [-0.05 * u, 0.14 * u]], { fill: '#6a4a2a', light: '#9a7448', shade: 0.4, inkW: 1.3 }); f.flat(ell([0.03 * u, 0.12 * u], 3, 2, 0, 6), '#4f6a4a', { op: 0.5 }); f.raw('<g class="em">'); f.flat([[-0.01 * u, 0.06 * u], [0.012 * u, 0.06 * u], [0.004 * u, 0.0]], '#ffd27a'); f.raw('</g>'); }, { tag: false });
  addLight(0, 3.2, 8.3, 0.5, 4, [1.0, 0.7, 0.4]);                                    // light 10
  fxL(glow(...P(0, 3.3, 8.3), K(8.3) * 0.8, K(8.3) * 0.7, '#ffb060', 0.3));
});

// ================================================================== MID: nothing between Aldric and the lectern; kept empty for the draw order
layer('mid'); raw('');

// ================================================================== FG: the lectern and the charter (the panel), its candle, a near slab, benches
layer('fg');
prop(LECT.Z, () => {
  const { X, Z } = LECT;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - 0.4, X + 0.4, 0, 1.32, Z - 0.1, Z + 0.3), [0, 1, 0], 0), Z, { op: 0.28 })));
  raw('<g class="panel">');
  I.stoneBox(X - 0.3, X + 0.3, 0, 0.12, Z - 0.05, Z + 0.3, STONE, { cast: false, ashlar: { scale: 0.2, wscale: 0.4 } });
  I.beam(X - 0.06, X + 0.06, 0.12, 1.1, Z + 0.04, Z + 0.16, WOOD, { knots: 0.5 });
  figProp(X, 1.1, Z + 0.04, (f, u) => { f.part([[-0.1 * u, 0], [0.1 * u, 0], [0.06 * u, 0.06 * u], [-0.06 * u, 0.06 * u]], { fill: WOOD, shade: 0.4, inkW: 1.2, cast: false }); }, { tag: false });
  // the slope and the charter on it: a long sheet of vellum, black letter in two columns, a red rule, seals hanging on cords
  I.woodFace([[X - 0.4, 1.32, Z + 0.25], [X + 0.4, 1.32, Z + 0.25], [X + 0.4, 1.12, Z - 0.1], [X - 0.4, 1.12, Z - 0.1]], WOODL, { bw: 0.18, segs: 1 });
  I.woodFace([[X - 0.4, 1.12, Z - 0.1], [X + 0.4, 1.12, Z - 0.1], [X + 0.4, 1.08, Z - 0.1], [X - 0.4, 1.08, Z - 0.1]], WOOD, { boards: 1, segs: 1 });
  const ch = [[X - 0.3, 1.14, Z - 0.06], [X + 0.3, 1.14, Z - 0.06], [X + 0.3, 1.33, Z + 0.22], [X - 0.3, 1.33, Z + 0.22]];
  let t = cel(ch.map(p => P(...p)), { Z, fill: '#d8cca8', tex: 'url(#mottle)', texOp: 0.4, band: 1.2 });
  for (let r = 0; r < 8; r++) { const zz = Z - 0.03 + r * 0.03, yy = 1.15 + (zz - Z + 0.06) / 0.28 * 0.19 + 0.005; for (const [a, b] of [[-0.26, -0.02], [0.02, 0.26 - R() * 0.06]]) { const A = P(X + a, yy, zz), B = P(X + b, yy, zz); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#2a201a" stroke-width="1" opacity="0.75" stroke-dasharray="4 1.5 7 1.5"/>`; } }
  { const A = P(X, 1.15, Z - 0.03), B = P(X, 1.32, Z + 0.2); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#7a1a14" stroke-width="1.2" opacity="0.6"/>`; }
  { const A = P(X - 0.28, 1.325, Z + 0.2), B = P(X + 0.28, 1.325, Z + 0.2); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${GOLD}" stroke-width="1.4" opacity="0.8"/>`; }
  raw(PLW(ch.slice(0, 3), t));
  for (const [dx, col, dy] of [[-0.2, '#4a120e', 0.85], [-0.06, '#3a1a10', 0.92], [0.1, '#4a120e', 0.88], [0.22, '#2a2a1a', 0.95]]) {
    const [sx, sy] = P(X + dx, 1.13, Z - 0.07), [ex, ey] = P(X + dx, dy, Z - 0.08);
    raw(`<path d="M${f1(sx)} ${f1(sy)} L${f1(ex)} ${f1(ey)}" stroke="#c8b890" stroke-width="1.2"/>`);
    figProp(X + dx, dy, Z - 0.08, (f, u) => { f.part(ell([0, 0.03 * u], 0.03 * u, 0.032 * u, 0, 12), { fill: col, light: mix(col, '#c86a5a', 0.4), shade: 0.4, inkW: 1.2, cast: false }); f.line(ell([0, 0.03 * u], 0.016 * u, 0.017 * u, 0, 10).slice(0, 9), 0.8, '#1a0806'); }, { tag: false });
  }
  raw('</g>');
  hot('charter', 'The charter', [P(X - 0.4, 0.8, Z - 0.1), P(X + 0.4, 0.8, Z - 0.1), P(X + 0.4, 1.32, Z + 0.25), P(X - 0.4, 1.32, Z + 0.25)]);
  addLight(X - 0.6, 1.5, Z - 0.2, 0.35, 2.5, [1.0, 0.72, 0.42]);                    // light 11
  // the lectern's candle on its own iron stand
  raw(I.rod([X - 0.6, 0, Z - 0.05], [X - 0.6, 1.1, Z - 0.05], '#2a2826', 3));
  for (const d of [-0.12, 0.12]) raw(I.rod([X - 0.6, 0.08, Z - 0.05], [X - 0.6 + d, 0, Z - 0.05 + (d > 0 ? 0.06 : -0.02)], '#2a2826', 3));
  figProp(X - 0.6, 1.1, Z - 0.05, (f, u) => f.part([[-0.05 * u, 0], [0.05 * u, 0], [0.03 * u, -0.02 * u], [-0.03 * u, -0.02 * u]], { fill: '#2a2826', shade: 0.35, inkW: 1.1, cast: false }), { tag: false });
  H.candles(X - 0.6, Z - 0.05, 1, 1.12, 0.05);                                     // light 12
});
tombSlab(0.3, 2.65, 1.1, 1.1, true);
// two benches near the front, a cloak thrown over the right one
for (const X of [-3.2, 3.2]) prop(3.4, () => {
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - 0.9, X + 0.9, 0, 0.48, 3.2, 3.55), [0, 1, 0], 0), 3.4, { op: 0.26 })));
  for (const d of [-0.75, 0.75]) I.woodBox(X + d - 0.05, X + d + 0.05, 0, 0.4, 3.25, 3.5, mix(WOOD, '#000', 0.1), { boards: 1, cast: false, segs: 1 });
  I.woodBox(X - 0.9, X + 0.9, 0.4, 0.48, 3.2, 3.55, WOOD, { bw: 0.12, cast: false, segs: 2 });
  if (X > 0) figProp(X - 0.72, 0.48, 3.22, (f, u) => { f.part([[-0.35 * u, -0.03 * u], [0.2 * u, -0.05 * u], [0.28 * u, 0.02 * u], [0.22 * u, 0.38 * u], [-0.05 * u, 0.42 * u], [-0.1 * u, 0.12 * u], [-0.38 * u, 0.05 * u]], { fill: '#2e2e34', light: '#4a4a52', shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.5 }); for (const x of [0, 0.12]) f.line([[x * u, 0], [x * u + 0.05 * u, 0.2 * u], [x * u + 0.02 * u, 0.38 * u]], 1.3, '#0e0e12', { op: 0.5 }); }, { tag: false });
});

// ================================================================== write
I.write(KEEPER, {}, OUT, { veil: { op: 0.55, cut: 0.32 } });
