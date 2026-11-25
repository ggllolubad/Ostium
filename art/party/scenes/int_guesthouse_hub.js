// The Guesthouse in Living Ink, v3 (2026-11-24): the pilot (int_guesthouse.js, out/scenes/pilot, kept untouched) brought up
// to the later rooms: rough coursed-rubble walls (the limewash long gone), a rubble hearth whose oldest stones by
// the mouth carry masons' marks, the firebox back of fire-reddened rubble, and the floor and corners as full as the
// Almonry's and the Cellarium's (the company's gear heaped by the desk, an ash pail and shovel, a broom and staves by
// the door, a chamber pot under the bunks). Lights, hotspots, keeper and roster spots are the pilot's (grim's) unchanged.
// Was: the Guesthouse in Living Ink (pilot A). Same room as grim/int_guesthouse.js: same camera, room box, door, hearth,
// bunks, table, desk, keeper spot, roster spots, hotspots and lights. Only the drawing changed.
// Where the hired company sleeps between descents: a warm, low room of boards and limewash, the one generous fire in
// the abbey in a deep hearth at the back right, double bunks against the back wall at the left, a long table with
// benches, packs and boots and drying cloaks. The Hosteller stands by the standing desk with the guest book.
// Lore (2026-11-23, hints only, never stated): the guest book is far older than the abbey's books (oak boards, iron
// bosses, gatherings added over centuries, the oldest leaves brown); a heavy old hand-forged iron key hangs on the desk;
// the oldest hearth stones carry masons' marks. His broken, callused mason's hands are on his figure (worlds/keepers.js).
// Usage: node scenes/int_guesthouse_hub.js [outDir]   (default out/scenes/hub/guesthouse)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'guesthouse');
const I = require('./int_shell')('guesthouse', { width: 10, depth: 7.6, height: 3.6, wall: '#5a5244', wall2: '#605848', stone: 'ashlar', floorCol: '#4e3c2a', ceilCol: '#4e3c2a', beamCol: '#64503a', seed: 9907, panel: 'guestbook', beamGap: 1.3,
  wallOpts: { dampCol: '#2a2a20', rough: true, courses: [1.1, 0.45, 0.8, 1.3, 0.38, 0.38, 0.95, 0.6, 1.2, 0.5, 0.75], wscale: 0.6 },
  // the boards worn pale along the path from the door to the hearth and the desk
  wearPath: atF => { let s = ''; const S = I; for (let k = 0; k < 2; k++) { const pts = []; for (let i = 0; i <= 14; i++) { const u = i / 14, X = -4.8 + u * (k ? 5.6 : 8.0), Z = 6.4 - u * (k ? 2.0 : 0.3) + Math.sin(u * 3) * 0.2; pts.push([X, 0, Z + 0.45]); } for (let i = 14; i >= 0; i--) { const u = i / 14, X = -4.8 + u * (k ? 5.6 : 8.0), Z = 6.4 - u * (k ? 2.0 : 0.3) + Math.sin(u * 3) * 0.2; pts.push([X, 0, Z - 0.45]); } s += `<path d="${S.smooth(pts.map(p => S.P(...p)), true, 0.8)}" fill="#e8c89a" opacity="0.08"/>`; } for (let i = 0; i < 40; i++) { const X = -4.5 + I.R() * 8.5, Z = 5.6 + I.R() * 1.1, A = S.P(X, 0, Z), B = S.P(X + 0.25 + I.R() * 0.3, 0, Z + (I.R() - 0.5) * 0.05); s += `<path d="M${S.f1(A[0])} ${S.f1(A[1])} L${S.f1(B[0])} ${S.f1(B[1])}" stroke="#d8b888" stroke-width="0.8" opacity="0.25"/>`; } return s; } });
const S = I;
const { P, K, sc, pp, p2, f1, INK, raw, layer, PLW, EM, cel, masonry, boards, hatch3, occBand, planeShade, normalOf, lam, mix, hot, addLight, through, R, castOn, shadowPoly, figProp, M, glow, soot, prop, HW, D0, D1, HT, mark } = S;
const H = require('./props_hub')(S);
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { add, ell, lerp } = E;
const WOOD = '#4e3826', WOODL = '#6a5034', OAKD = '#3a2818';
const KEEPER = { X: 2.05, Z: 4.55, h: 646 / (640 / 1.75), sprite: 'hosteller', label: 'The Hosteller', figure: [144, 790], flip: true };
// the roster's rest spots (feet and depth). height_px keeps the loader's old formula (scale = height_px / 620) and is set so
// a Living Ink figure (640 px = 1.75 m) comes out at true size at that depth.
const ROSTER = [{ X: -3.75, Z: 6.25, name: 'hexweaver', flip: false }, { X: -1.75, Z: 6.0, name: 'alchemist', flip: false }, { X: 4.3, Z: 6.0, name: 'duelist', flip: false }];

I.shell();
I.door(5.95, 6.85, { side: -1, square: true, ts: 1.9 });
const DR = require('./dress_li')(I);

// ------------------------------------------------------------------ v2: the walls worn by use, the floor lived on
// Back wall (s from X -5, t up): newer wash slapped over the worst places, a square of fresh plaster where a beam hole was
// filled, cracks from the bunk posts' fixings and up from the floor, damp blooming low in the corners and under the roof.
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, {
    // the old limewash is gone to a few dark scraps; the rubble shows everywhere
    patches: [[3.4, 3.15, 0.5, 0.25, '#6e6656'], [8.6, 3.2, 0.4, 0.2, '#6a6252']],
    bloom: [[0.45, 0.4, 0.9, 0.6], [1.2, 3.35, 1.4, 0.45], [9.75, 3.3, 0.5, 0.6], [5.6, 0.25, 0.8, 0.35], [8.0, 3.45, 0.9, 0.25]],
    cracks: [[4.45, 2.25, 1.0, 2.2], [6.3, 3.5, 0.9, -1.75], [0.25, 1.5, 0.8, 0.25], [5.4, 0.12, 0.7, 1.35], [2.0, 3.55, 0.5, -1.2]],
    soot: [[5.55, 5.95, 2.55, 3.45, 0.22], [6.2, 6.55, 3.0, 3.6, 0.18], [9.45, 9.75, 3.0, 3.6, 0.18]],
  });
  // a snuffed rushlight sconce, its soot climbing the wash above it (no light: it is not lit)
  figProp(0.75, 2.45, D1 - 0.02, (f, u) => { f.part([[-0.03 * u, 0], [0.03 * u, 0], [0.025 * u, 0.08 * u], [-0.025 * u, 0.08 * u]].map(p => [p[0], p[1], 1]), { fill: '#2e2a26', shade: 0.4, inkW: 1.2, cast: false }); f.line([[0, 0.04 * u], [0.1 * u, 0.04 * u], [0.12 * u, -0.02 * u]], 2.6, '#2e2a26'); f.part(ell([0.12 * u, -0.02 * u], 0.035 * u, 0.012 * u, 0, 10), { fill: '#3a3634', shade: 0.3, inkW: 1, cast: false }); f.part([[0.105 * u, -0.025 * u], [0.135 * u, -0.025 * u], [0.13 * u, -0.07 * u], [0.11 * u, -0.07 * u]], { fill: '#c8bc9a', shade: 0.35, inkW: 1, cast: false }); f.line([[0.12 * u, -0.07 * u], [0.121 * u, -0.085 * u]], 1.2, '#14100c'); f.flat([[0.115 * u, 0.0], [0.125 * u, 0.0], [0.124 * u, 0.05 * u], [0.116 * u, 0.05 * u]], '#d8ccb0', { op: 0.8 }); }, { tag: false });
  // a peg rail between the bunks and the hearth: herbs drying, a lantern (cold), a ladle, a satchel; a horseshoe over the bunks
  DR.pegRail((s, t) => atB(s, t), 4.5, 6.2, 1.85, ['herbs', 'lantern', 'ladle', null, 'bag'], { col: '#4a3624' });
  DR.nailHang(-2.45, 2.62, D1 - 0.02, 'horseshoe');
  DR.nailHang(-4.65, 1.75, D1 - 0.02, 'sickle');
}
{
  // the left wall (in shadow): a patch, a crack up from the door frame, bloom low at the front and high at the back
  const atL = I.atL;
  I.wear(atL, [atL(0, 0), atL(1, 0), atL(0, 1)], { patches: [], bloom: [[0.9, 0.3, 1.4, 0.5], [4.7, 3.25, 0.7, 0.6]], cracks: [[3.35, 2.05, 0.9, 2.4], [1.2, 3.5, 0.7, -1.3]] });
  // the right wall: pegs by the beds' end with the company's things on them, bloom, a long crack
  const atR = I.atR;
  I.wear(atR, [atR(0, 0), atR(1, 0), atR(0, 1)], { patches: [], bloom: [[0.6, 0.35, 1.0, 0.5], [4.9, 3.3, 0.5, 0.5]], cracks: [[2.4, 3.55, 1.1, -1.45]] });
  DR.pegRail((s, t) => atR(s, t), 3.5, 4.9, 1.9, ['hat', 'belt', 'cloak', 'bag'], { col: '#4a3624', dir: [-0.3, 0] });
}
// the floor: rushes strewn on the boards (banked along the walls and under the table, kicked thin on the path from the door to
// the hearth), straw spilled from the ticks under the bunks, a rag rug before the fire with its rucks and a kicked-up corner
{
  const atF = I.atF;
  const onPath = (s, t) => { const X = -HW + s, Z = D0 + t; return Math.abs(Z - (6.4 - (X + 4.8) / 8 * 0.3)) < 0.5 && X < 3.5; };
  const dens = (s, t) => { const X = -HW + s, Z = D0 + t; let d = 0.5; if (Z > D1 - 0.8 || X < -4.2 || X > 4.3) d = 0.95; if (X > -3.7 && X < -0.5 && Z > 4.6 && Z < 5.8) d = 0.9; if (onPath(s, t)) d = 0.08; if (X > 1.3 && X < 4.4 && Z > 6.4) d = 0.12; return d; };
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], I.strew(atF, 0, 2 * HW, 0.0, D1 - D0, 5200, { dens, len: 0.17, w: 0.0065, cols: ['#7a6a3a', '#6a5a32', '#8a7a48', '#5a4a2a', '#94844e', '#6e5e38', '#4e4228'] })));
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], I.strew(atF, 0.6, 4.4, 3.3, D1 - D0, 1100, { cols: ['#b8984e', '#a08442', '#c8aa5e', '#8a6e36'], len: 0.12, w: 0.0035, dens: (s, t) => 0.4 + 0.6 * (t - 3.3) / 1.8 })));
  // drifts banked along the walls, round the table legs and the bunks, in the corners by the door
  for (const [X, Z, w, h] of [[-4.55, 4.0, 0.9, 2.2], [-4.4, 7.2, 1.2, 0.7], [-2.2, 7.35, 2.2, 0.5], [-2.1, 5.25, 2.6, 1.0], [-0.2, 7.3, 1.3, 0.5], [4.6, 7.2, 0.8, 0.6], [4.7, 4.6, 0.6, 1.6], [-3.6, 3.0, 1.6, 0.8], [0.9, 2.85, 1.2, 0.5], [3.4, 3.2, 1.4, 0.7]]) DR.drift(atF, X + HW, Z - D0, w, h);
  DR.ragRug([2.3, 5.4], 1.1, 1.9, -1.5, { floorCol: '#3a2a1c' });
}

// ------------------------------------------------------------------ the hearth: a deep stone fireplace, chimney breast to the beams
{
  const x0 = 1.4, x1 = 4.4, z = D1 - 0.55, ht = 1.5, mx0 = x0 + 0.4, mx1 = x1 - 0.4;
  // the breast's left side (faces the key light) and front; the oldest stones by the mouth carry masons' marks
  const HR = { rough: true, roughP: 0.5, scale: 0.3, wscale: 0.5, vary: 0.3, chip: 0.55, mortar: 0.6, lost: 0.14, spall: 0.14, damp: 0.25, courses: [0.9, 0.55, 1.1, 0.45, 0.8, 1.0, 0.5, 0.7] };
  I.stoneFace([[x0, 0, z], [x0, 0, D1], [x0, HT, D1], [x0, HT, z]], '#615849', { ashlar: HR });
  // the oldest stones, low either side of the mouth, carry masons' marks: a few cut deep and worn, the rest faint
  const MM = [[0.16, 0.42, 1], [0.24, 0.95, 0.8], [0.12, 1.3, 0.7], [x1 - x0 - 0.18, 0.55, 1], [x1 - x0 - 0.26, 1.1, 0.8], [x1 - x0 - 0.14, 1.42, 0.6], [1.1, ht + 0.55, 0.6], [1.9, ht + 0.8, 0.5]];
  I.stoneFace([[x0, 0, z], [x1, 0, z], [x1, HT, z], [x0, HT, z]], '#615849', { ashlar: HR,   // no skip: rubble stones are long, and the firebox is drawn over the mouth anyway
    after: (at) => MM.map(([s0, t0, k]) => { const [x, y] = P(...at(s0, t0)); return `<g opacity="${k}">${mark(x, y, Math.max(3, K(z) * 0.045), z)}</g>`; }).join('') });
  // soot: hatched black climbing from the mouth up the breast
  raw(PLW([[x0, 0, z], [x1, 0, z], [x0, 1, z]], soot((s, t) => [x0 + s, ht + 0.3 + t, z], 0.55, x1 - x0 - 0.55, 0, 1.1, { op: 0.16 })));
  const mouth = [[mx0, 0.12, z - 0.01], [mx1, 0.12, z - 0.01], [mx1, ht, z - 0.01], [mx0, ht, z - 0.01]];
  through(mouth, () => {
    // the firebox: back of old brick, cheeks, a black throat. Deep recess: solid black at the top.
    const zb = D1 - 0.02;
    raw(`<path d="${pp(mouth)}" fill="#0c0806"/>`);
    const atBk = (s, t) => [mx0 - 0.1 + s, t, zb];
    // the firebox back: rubble reddened and cracked by the fire, black with soot toward the throat
    let br = S.ashlar(atBk, mx1 - mx0 + 0.2, ht, '#4a2416', { rough: true, roughP: 0.5, scale: 0.24, wscale: 0.45, vary: 0.3, chip: 0.5, mortar: 0.72, lost: 0.2, spall: 0.1 });
    br += `<path d="${pp([atBk(0, ht * 0.4), atBk(mx1 - mx0 + 0.2, ht * 0.4), atBk(mx1 - mx0 + 0.2, ht), atBk(0, ht)])}" fill="#0e0604" opacity="0.55"/><path d="${pp([atBk(0, ht * 0.7), atBk(mx1 - mx0 + 0.2, ht * 0.7), atBk(mx1 - mx0 + 0.2, ht), atBk(0, ht)])}" fill="#0e0604" opacity="0.6"/>`;
    raw(PLW([[0, 0, zb], [1, 0, zb], [0, 1, zb]], br + hatch3(atBk, 0, mx1 - mx0 + 0.2, ht * 0.45, ht, 0.8, { op: 0.6 }) + hatch3(atBk, 0, mx1 - mx0 + 0.2, ht * 0.65, ht, -0.7, { op: 0.6 })));
    // cheeks, in shadow on the right (faces away), lit on the left
    for (const [X, nrm] of [[mx0, 1], [mx1, -1]]) raw(PLW([[X, 0, z], [X, 0, zb], [X, 1, z]], cel([[X, 0.12, z], [X, 0.12, zb], [X, ht, zb], [X, ht, z]].map(p => P(...p)), { Z: z, fill: nrm > 0 ? '#2a1a12' : '#4a2a1a' }) + hatch3((s, t) => [X, t, z + s], 0, 0.53, 0.12, ht, 0.6, { op: nrm > 0 ? 0.7 : 0.35 })));
    // the hearth floor: ash and embers
    raw(PLW([[0, 0.12, 1], [1, 0.12, 1], [0, 0.12, 2]], cel([[mx0, 0.12, z], [mx1, 0.12, z], [mx1, 0.12, zb], [mx0, 0.12, zb]].map(p => P(...p)), { Z: z, fill: '#4a4440', tex: 'url(#speck)', texOp: 0.6 })));
    // firedogs, the logs, the fire
    const cxm = (x0 + x1) / 2;
    figProp(cxm, 0.12, z + 0.25, (f, u) => {
      for (const dx of [-0.55, 0.55]) { const x = dx * u; f.part([[x - 6, 0], [x - 4, -0.32 * u], [x + 4, -0.34 * u], [x + 6, 0]], { fill: '#2a2826', shade: 0.4, inkW: 1.6 }); f.part(ell([x, -0.36 * u], 9, 9, 0, 10), { fill: '#3a3634', shade: 0.4, inkW: 1.4, cast: false }); }
      for (let k = 0; k < 3; k++) { const y = -(0.1 + k * 0.08) * u, l = (0.7 - k * 0.12) * u; f.part(E.limb([-l, y + 4], [l, y - 2], 0.11 * u, 0.1 * u, { steps: 6 }), { fill: '#2a1a10', shade: 0.45, inkW: 1.8, tex: PR.T(f, 'wood'), texOp: 0.6 }); f.line([[-l * 0.9, y + 2], [l * 0.3, y - 1]], 3, '#ff7a2a', { op: 0.9 }); f.line([[-l * 0.5, y + 0.04 * u], [l * 0.7, y + 0.03 * u]], 1.5, '#ffb050', { op: 0.7 }); }
    });
    figProp(cxm, 0.25, z + 0.24, (f, u) => PR.fire(f, 1.05 * u, 0.62 * u, { n: 8 }), { em: true });
    // a pot on a crane over the fire
    figProp(cxm, 0.95, z + 0.3, (f, u) => {
      f.line([[-0.95 * u, -0.45 * u], [0, -0.45 * u]], 6, '#1a120c', { straight: true }); f.line([[-0.95 * u, -0.45 * u], [0, -0.45 * u]], 3.4, '#3a3634', { straight: true });
      f.line([[0, -0.45 * u], [0, -0.05 * u]], 3, '#2a2826', { straight: true });
      f.part([[-0.2 * u, 0], [-0.22 * u, 0.18 * u], [-0.12 * u, 0.3 * u], [0.12 * u, 0.3 * u], [0.22 * u, 0.18 * u], [0.2 * u, 0]], { fill: '#2e2c2a', shade: 0.5, inkW: 2 });
      f.part(ell([0, 0], 0.21 * u, 0.04 * u, 0, 12), { fill: '#141210', shade: 0.2, inkW: 1.4, cast: false });
      f.line([[-0.2 * u, 0], [0, -0.06 * u], [0.2 * u, 0]], 1.4, '#1a120c', { op: 0.9 });
      f.flat(ell([0.08 * u, 0.12 * u], 0.08 * u, 0.04 * u, 0, 8), '#5a2a14', { op: 0.4 });
    });
  });
  // the hearthstone before the mouth: one great worn slab
  raw(PLW([[0, 0.02, 1], [1, 0.02, 1], [0, 0.02, 2]], cel(S.chip([[mx0 - 0.25, 0.02, z - 0.45], [mx1 + 0.25, 0.02, z - 0.45], [mx1 + 0.25, 0.02, z], [mx0 - 0.25, 0.02, z]].map(p => P(...p)), 0.3), { Z: z, fill: '#6a6256', tex: 'url(#mottle)', texOp: 0.5 })));
  // the lintel: a great sooted oak beam, and the mantel shelf on it
  I.beam(x0 + 0.25, x1 - 0.25, ht, ht + 0.3, z - 0.05, z, '#2e2218');
  I.woodBox(x0 + 0.15, x1 - 0.15, ht + 0.3, ht + 0.36, z - 0.2, z, '#4a3624', { cast: false, boards: 1, topBoards: 1, segs: 1 });
  // things on the mantel: tankards, a crock, a bottle, a plate stood on edge, a candle; a ladle and a toasting fork on hooks
  const my = ht + 0.36, mz = z - 0.1;
  figProp(x0 + 0.5, my, mz, (f, u) => { PR.tankard(f, 0, 0.16 * u, '#6a6460', { dent: true }); PR.crock(f, 0.3 * u, 0.15 * u); PR.bottle(f, 0.55 * u, 0.24 * u, '#3a5a2a'); PR.tankard(f, 0.8 * u, 0.14 * u, '#5a4430'); });
  figProp(x0 + 1.75, my, mz + 0.06, (f, u) => { f.part(ell([0, -0.13 * u], 0.12 * u, 0.13 * u, 0, 16), { fill: '#7a7670', shade: 0.4, inkW: 1.5 }); f.line(ell([0, -0.13 * u], 0.07 * u, 0.08 * u, 0, 12).concat([ell([0, -0.13 * u], 0.07 * u, 0.08 * u, 0, 12)[0]]), 1, '#3a3632', { op: 0.6 }); });
  figProp(x0 + 2.15, my, mz, (f, u) => { PR.candleStub(f, 0, 0.12 * u, 0.035 * u); PR.crock(f, 0.25 * u, 0.12 * u, '#6a5a44'); PR.tankard(f, 0.47 * u, 0.15 * u, '#7a7068'); });
  addLight(x0 + 2.15, 2.1, mz - 0.15, 0.17, 2.4, [1.0, 0.74, 0.44]);
  figProp(x0 + 0.62, ht + 0.02, z - 0.04, (f, u) => { f.line([[0, 0], [0, 0.36 * u]], 2.6, '#2a2826'); f.part(ell([0, 0.38 * u], 0.05 * u, 0.025 * u, 0, 10), { fill: '#5a5650', shade: 0.4, inkW: 1.2 }); f.rivet([0, -2], 2.4, '#5a5650'); });
  figProp(x1 - 0.58, ht + 0.02, z - 0.04, (f, u) => { f.line([[0, 0], [0.02 * u, 0.48 * u]], 2.4, '#2a2826'); for (const dx of [-5, 0, 5]) f.line([[0.02 * u + dx * 0.6, 0.48 * u], [0.02 * u + dx, 0.6 * u]], 1.6, '#3a3634'); f.rivet([0, -2], 2.4, '#5a5650'); });
  // a log pile against the breast's left side: ends of different girth, split and whole
  figProp(x0 - 0.3, 0, z - 0.25, (f, u) => { for (const [row, n] of [[0, 4], [1, 3], [2, 2]]) for (let i = 0; i < n; i++) { const x = (-0.3 + i * 0.2 + row * 0.1 + (f.r() - 0.5) * 0.03) * u, y = -(0.08 + row * 0.15) * u, r = (0.065 + f.r() * 0.03) * u; PR.logEnd(f, x, y, r, f.r() < 0.3); } });
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0 - 0.62, x0, 0, 0.45, z - 0.35, z - 0.15), [0, 1, 0], 0), z, { op: 0.25 })));
  addLight((x0 + x1) / 2, 0.8, z - 0.5, 1.5, 8.0, [1.0, 0.56, 0.24]);
  layer('fx'); raw(glow(...P((x0 + x1) / 2, 0.5, z - 0.3), K(z) * 2.6, K(z) * 1.9, '#ff8a3a', 0.42) + glow(...P((x0 + x1) / 2, 0.05, z - 1.2), K(z) * 2.4, K(z) * 0.7, '#ffa050', 0.2)); layer('bg');
}

// ------------------------------------------------------------------ the bunks against the back wall at the left: two double bunks
const blanketCols = ['#5a3a2a', '#3e4a3a', '#4a4a5a', '#6a5a3a', '#5a2a24', '#3a3a30'];
for (const [x0, x1] of [[-4.3, -2.55], [-2.4, -0.65]]) prop(D1 - 1.0, () => {
  const z0 = D1 - 1.0, z1 = D1 - 0.03;
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0, x1, 0, 1.47, z0, z1), [0, 1, 0], 0), z0, { op: 0.28 })));
  // the bunk's shadow thrown on the limewash behind it, and the back posts against the wall
  for (const Y of [0.35, 1.35]) { const sh = castOn(S.boxPts(x0, x1, Y, Y + 0.32, z0, z1 - 0.2), [0, 0, 1], D1); raw(PLW([[0, 0, D1], [1, 0, D1], [0, 1, D1]], shadowPoly(sh, D1, { op: 0.3 }))); }
  for (const X of [x0, x1]) I.beam(X - 0.04, X + 0.04, 0, 2.25, z1 - 0.1, z1 - 0.02, WOOD, { knots: 0.5 });
  for (const Y of [0.35, 1.35]) {
    // the bed frame: side rail, the boards under the mattress
    I.woodBox(x0, x1, Y, Y + 0.12, z0, z1, WOOD, { boards: 1, cast: false });
    // the straw tick (mattress) and a rumpled blanket, a bolster
    const midX = (x0 + x1) / 2, col = blanketCols[Math.floor(R() * 6)];
    figProp(midX, Y + 0.12, z0 + 0.02, (f, u) => {
      const w = (x1 - x0) * u / 2;
      f.part([[-w + 4, 0], [-w + 2, -0.07 * u], [-w * 0.3, -0.09 * u], [w * 0.4, -0.08 * u], [w - 2, -0.07 * u], [w - 4, 0]], { fill: '#8a7a5a', tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.35 });
      for (let k = 0; k < 9; k++) { const x = (-0.9 + f.r() * 1.8) * w; f.line([[x, -2], [x + (f.r() - 0.5) * 10, 6 + f.r() * 8]], 1, '#b09a54', { op: 0.85 }); }
      // the blanket: rumpled on top, thrown back at the head, hanging over the rail in heavy folds, one corner lower
      const bl = [[-w + 6, -0.06 * u]]; for (let k = 0; k <= 8; k++) { const t = k / 8; bl.push([-w + 10 + (2 * w - 0.32 * u) * t, -(0.1 + Math.sin(k * 1.3) * 0.035 + f.r() * 0.02) * u]); }
      const lowC = f.r() < 0.5 ? -1 : 1;
      bl.push([w - 0.22 * u, -0.04 * u], [w - 0.2 * u, (lowC > 0 ? 0.24 : 0.13) * u], [w * 0.55, 0.15 * u], [w * 0.1, 0.17 * u], [-w * 0.35, 0.14 * u], [-w + 0.3 * u, (lowC < 0 ? 0.26 : 0.12) * u], [-w + 0.12 * u, 0.12 * u], [-w + 4, 0.02 * u]);
      f.part(bl, { fill: col, tex: PR.T(f, 'weave'), texOp: 0.55, shade: 0.5 });
      // drape folds: each a crease line with its own shadow wedge
      for (let k = 0; k < 7; k++) { const x = -w + 0.2 * u + (2 * w - 0.5 * u) * (k + 0.3 + f.r() * 0.4) / 7, d = (f.r() - 0.5) * 14;
        f.flat([[x, -0.03 * u], [x + 7, -0.02 * u], [x + d + 6, 0.13 * u], [x + d - 2, 0.14 * u]], '#1a120c', { op: 0.22 });
        f.line([[x, -0.05 * u], [x + d * 0.4, 0.05 * u], [x + d, 0.14 * u]], 1.4, '#1a120c', { op: 0.6 }); }
      // the top: hollows where a body lay, the turned-back edge at the head
      f.line([[-w * 0.6, -0.085 * u], [-w * 0.2, -0.06 * u], [w * 0.3, -0.075 * u]], 1.2, '#1a120c', { op: 0.45 });
      f.part([[w - 0.42 * u, -0.1 * u], [w - 0.2 * u, -0.08 * u], [w - 0.2 * u, -0.03 * u], [w - 0.44 * u, -0.05 * u]], { fill: mix(col, '#c8b890', 0.3), tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.35, inkW: 1.2, cast: false });
      // a worn, fraying hem along the hanging edge
      for (let k = 0; k < 10; k++) { const x = -w * 0.8 + k * w * 0.16; f.line([[x, 0.14 * u + (k % 3) * 2], [x + 2, 0.16 * u + (k % 2) * 3]], 1, mix(col, '#c8b890', 0.3), { op: 0.7 }); }
      f.line([[-w + 0.1 * u, 0.115 * u], [w * 0.2, 0.15 * u]], 2, mix(col, '#c8b890', 0.4), { op: 0.5 });
      if (f.r() < 0.7) { const px = (f.r() - 0.5) * w; f.part([[px, -0.02 * u], [px + 0.12 * u, -0.025 * u], [px + 0.11 * u, 0.07 * u], [px - 0.01 * u, 0.075 * u]], { fill: mix(col, '#8a7a5a', 0.5), tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.3, inkW: 1, cast: false }); f.stitches([[px, -0.02 * u], [px + 0.12 * u, -0.025 * u], [px + 0.11 * u, 0.07 * u]], '#c8b890'); }
      if (f.r() < 0.6) f.stitches([[-w * 0.3, -0.04 * u], [-w * 0.05, 0.04 * u], [-w * 0.3, 0.1 * u]], '#c8b890');
      f.part([[w - 0.3 * u, -0.06 * u], [w - 0.28 * u, -0.17 * u], [w - 0.12 * u, -0.2 * u], [w - 0.04 * u, -0.14 * u], [w - 0.05 * u, -0.04 * u]], { fill: '#c8bea4', tex: PR.T(f, 'weave'), texOp: 0.45, shade: 0.4 });
    });
    I.woodFace([[x1, Y + 0.48, z0], [x1, Y + 0.48, z1], [x1, Y, z1], [x1, Y, z0]], WOOD, { bw: 0.16 });
    if (Y > 1 && x0 < -3) figProp(x0 + 0.45, Y + 0.12, z0 + 0.3, (f, u) => PR.sack(f, 0, 0.6 * u, { col: '#6a5a40' }));
  }
  // corner posts last (in front of the bed rails)
  for (const X of [x0, x1]) I.beam(X - 0.045, X + 0.045, 0, 2.25, z0 - 0.045, z0 + 0.045, WOOD, { knots: 0.5 });
  // a pack and a sword hung on the bunk post
  figProp(x1 + 0.05, 1.95, z0 - 0.06, (f, u) => {
    f.line([[0, 0], [0.01 * u, 0.08 * u]], 2.4, '#3a2a18');
    f.part([[-0.02 * u, 0.06 * u], [0.035 * u, 0.06 * u], [0.035 * u, 0.82 * u], [0.005 * u, 0.9 * u], [-0.02 * u, 0.82 * u]], { fill: '#3a2a1a', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5, inkW: 1.6 });
    f.part([[-0.1 * u, 0.06 * u], [0.12 * u, 0.06 * u], [0.12 * u, 0.09 * u], [-0.1 * u, 0.09 * u]], { fill: '#4a4640', shade: 0.4, inkW: 1.3 });
    f.part([[-0.008 * u, -0.1 * u], [0.022 * u, -0.1 * u], [0.022 * u, 0.06 * u], [-0.008 * u, 0.06 * u]], { fill: '#3a2818', shade: 0.4, inkW: 1.2, cast: false });
    f.part(ell([0.007 * u, -0.115 * u], 0.025 * u, 0.025 * u, 0, 10), { fill: '#5a5650', shade: 0.4, inkW: 1.2, cast: false });
    f.line([[0.03 * u, 0.15 * u], [0.03 * u, 0.7 * u]], 1, '#8a7a5a', { op: 0.5 });
  });
  if (x0 < -3) figProp(x0 - 0.05, 1.9, z0 - 0.06, (f, u) => {
    f.line([[0, -4], [0, 0.06 * u]], 2.4, '#3a2a18');
    f.part([[-0.16 * u, 0.04 * u], [0.14 * u, 0.04 * u], [0.18 * u, 0.24 * u], [0.15 * u, 0.42 * u], [-0.15 * u, 0.44 * u], [-0.19 * u, 0.24 * u]], { fill: '#5a4a34', tex: PR.T(f, 'weave'), texOp: 0.55, shade: 0.45 });
    f.part([[-0.16 * u, 0.04 * u], [0.14 * u, 0.04 * u], [0.13 * u, 0.17 * u], [0, 0.2 * u], [-0.15 * u, 0.17 * u]], { fill: '#4a3a28', shade: 0.4, inkW: 1.3, tex: PR.T(f, 'mottle'), texOp: 0.5 });
    f.part([[-0.02 * u, 0.15 * u], [0.03 * u, 0.15 * u], [0.03 * u, 0.22 * u], [-0.02 * u, 0.22 * u]], { fill: '#6a6460', shade: 0.3, inkW: 1, cast: false });
    f.line([[-0.1 * u, 0.04 * u], [-0.12 * u, 0.44 * u]], 3, '#3a2a18', { op: 0.9 });
    f.stitches([[0.02 * u, 0.28 * u], [0.12 * u, 0.36 * u]], '#c8b890');
    f.part([[-0.18 * u, 0.36 * u], [0.17 * u, 0.36 * u], [0.17 * u, 0.46 * u], [-0.18 * u, 0.46 * u]], { fill: '#6a2a20', tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.4, inkW: 1.3 });
  });
});
// a pair of boots by the bunk, a chamber of packs
figProp(-3.3, 0, 6.35, (f, u) => PR.boots(f, 0, 0.5 * u));
// v3: the room lived in. A chamber pot pushed under the lower bunk; the ash pail with its shovel by the log pile; a broom and
// two pilgrims' staves leaned in the corner by the door; a stool kicked back from the table's far end
prop(6.9, () => {
  figProp(-1.5, 0, 6.95, (f, u) => { f.part([[-0.11 * u, 0], [-0.13 * u, -0.1 * u], [-0.1 * u, -0.13 * u], [0.1 * u, -0.13 * u], [0.13 * u, -0.1 * u], [0.11 * u, 0]], { fill: '#6a5a44', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.part(ell([0, -0.13 * u], 0.11 * u, 0.025 * u, 0, 12), { fill: '#1a140e', shade: 0.2, inkW: 1.2, cast: false }); f.line([[0.12 * u, -0.1 * u], [0.17 * u, -0.08 * u], [0.13 * u, -0.04 * u]], 3, '#5a4a36'); });
  figProp(0.62, 0, 6.95, (f, u) => { f.part([[-0.13 * u, 0], [-0.15 * u, -0.3 * u], [0.15 * u, -0.3 * u], [0.13 * u, 0]].map(p => [p[0], p[1], 1]), { fill: '#5a4632', shade: 0.45, tex: PR.T(f, 'wood'), texOp: 0.5 }); for (const y of [-0.06, -0.24]) f.line([[-0.14 * u, y * u], [0.14 * u, y * u]], 3, '#2a2622', { straight: true }); f.part(ell([0, -0.3 * u], 0.15 * u, 0.035 * u, 0, 12), { fill: '#7a7670', shade: 0.3, inkW: 1.2, cast: false, tex: PR.T(f, 'mottle'), texOp: 0.6 }); f.line([[0.05 * u, -0.31 * u], [0.22 * u, -0.75 * u]], 4.4, '#3a2a1a'); f.part([[0.0, -0.32 * u], [0.12 * u, -0.34 * u], [0.1 * u, -0.22 * u], [0.02 * u, -0.22 * u]], { fill: '#3e3c3a', shade: 0.4, inkW: 1.2, cast: false }); });
});
prop(5.0, () => {
  // broom and staves leaned in the corner by the door
  figProp(-4.9, 0, 5.3, (f, u) => { f.line([[0, -0.02 * u], [0.12 * u, -1.35 * u]], 4.2, '#5a4430'); f.part([[-0.1 * u, 0], [0.1 * u, 0], [0.06 * u, -0.32 * u], [-0.02 * u, -0.32 * u]], { fill: '#8a7a48', shade: 0.4, tex: PR.T(f, 'weave'), texOp: 0.4 }); for (let k = 0; k < 6; k++) f.line([[-0.08 * u + k * 0.032 * u, 0], [-0.02 * u + k * 0.016 * u, -0.28 * u]], 1, '#4a3e24', { op: 0.7 }); f.line([[-0.02 * u, -0.3 * u], [0.07 * u, -0.3 * u]], 2.4, '#3a2a18'); });
  figProp(-4.88, 0, 4.7, (f, u) => { for (const [dx, lean, col] of [[0, 0.16, '#6a5034'], [0.06, 0.22, '#4e3826']]) { f.line([[dx * u, 0], [(dx + lean) * u, -1.65 * u]], 5.4, INK); f.line([[dx * u, 0], [(dx + lean) * u, -1.65 * u]], 3.4, col); } f.part(ell([0.17 * u, -1.5 * u], 0.03 * u, 0.04 * u, 0, 8), { fill: '#c8bca0', shade: 0.3, inkW: 1, cast: false }); f.line([[0.18 * u, -1.46 * u], [0.24 * u, -1.2 * u]], 1.2, '#8a7a56'); });
});


// cloaks and wet socks on a line before the hearth, hung from the beam by two cords
prop(5.8, () => {
  const xs = -0.6, xe = 4.6, Y = 2.4, Z = 5.8, pts3 = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts3.push([xs + (xe - xs) * t, Y - Math.sin(t * Math.PI) * 0.25, Z]); }
  const bz = D1 - 0.4 - 1.3; // the beam the line hangs from (z 5.9)
  for (const X of [xs, xe]) { const A = P(X, HT - 0.3, bz), B = P(X, Y, Z); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="2.2"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#8a7a56" stroke-width="1" stroke-dasharray="2 1.5"/>`); }
  const pts = pts3.map(p => P(...p));
  raw(`<path d="${S.smooth(pts, false, 0.5)}" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="${S.smooth(pts, false, 0.5)}" stroke="#8a7a56" stroke-width="1.1" fill="none" stroke-dasharray="2 1.5"/>`);
  const cols = { cloak: '#3a3a34', shirt: '#8a826e' };
  for (const [i, kind] of [[2, 'cloak'], [4, 'sock'], [5, 'sock'], [7, 'shirt'], [9, 'sock']]) figProp(...pts3[i], (f, u) => PR.hung(f, 0, kind, cols[kind] || ['#6a5a4a', '#5a5a5a', '#7a5a3a'][i % 3]));
});

// ================================================================== MID: the long table, in front of the resting heroes' legs
layer('mid');
prop(4.9, () => {
  const x0 = -3.6, x1 = -0.6, z0 = 4.9, z1 = 5.6, top = 0.78;
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0, x1, top - 0.07, top, z0, z1), [0, 1, 0], 0), z0, { op: 0.3 })));
  for (const [X, Z] of [[x0 + 0.15, z1 - 0.1], [x1 - 0.15, z1 - 0.1]]) I.beam(X - 0.04, X + 0.04, 0, top - 0.07, Z - 0.04, Z + 0.04, WOOD);
  // a stretcher between the legs, low down
  I.beam(x0 + 0.15, x1 - 0.15, 0.14, 0.2, z0 + 0.36, z0 + 0.42, OAKD);
  I.woodFace([[x0, top, z1], [x1, top, z1], [x1, top, z0], [x0, top, z0]], WOODL, { bw: 0.18, stains: 0.5 });
  I.woodFace([[x0, top, z0], [x1, top, z0], [x1, top - 0.07, z0], [x0, top - 0.07, z0]], WOOD, { boards: 1, segs: 1 });
  for (const [X, Z] of [[x0 + 0.15, z0 + 0.1], [x1 - 0.15, z0 + 0.1]]) I.beam(X - 0.045, X + 0.045, 0, top - 0.07, Z - 0.045, Z + 0.045, WOOD);
  // the bench before it
  I.woodBox(x0 + 0.6, x1, 0.4, 0.47, z0 - 0.45, z0 - 0.2, WOOD, { bw: 0.12, cast: false });
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0 + 0.6, x1, 0.4, 0.47, z0 - 0.45, z0 - 0.2), [0, 1, 0], 0), z0, { op: 0.3 })));
  for (const X of [x0 + 0.8, x1 - 0.2]) I.beam(X - 0.035, X + 0.035, 0, 0.4, z0 - 0.36, z0 - 0.29, WOOD);
  // on the table: bread, a crock, a bottle, a plate of crumbs, cups, dice, cheese, a jug, a knife, a candle in its own wax
  figProp(-3.25, top, 5.25, (f, u) => { PR.loaf(f, 0, 0.24 * u); PR.loaf(f, 0.3 * u, 0.2 * u, '#7a5a34', { cut: true }); PR.crock(f, 0.65 * u, 0.14 * u); PR.bottle(f, 0.9 * u, 0.24 * u, '#5a3a1a'); });
  figProp(-2.85, top, 5.05, (f, u) => PR.plate(f, 0, 0.26 * u));
  figProp(-2.15, top, 5.12, (f, u) => { PR.cup(f, 0, 0.09 * u, '#6a6460'); PR.candleStub(f, 0.15 * u, 0.13 * u, 0.04 * u); PR.cup(f, 0.32 * u, 0.08 * u, '#5a4430'); PR.dice(f, 0.52 * u); });
  figProp(-1.35, top, 5.35, (f, u) => { PR.cheese(f, 0, 0.16 * u); PR.knife(f, -0.3 * u, 0.2 * u); PR.jug(f, 0.35 * u, 0.24 * u); });
  addLight(-2.0, 1.08, 5.05, 0.17, 2.4, [1.0, 0.74, 0.44]);
  addLight(-2.0, 1.1, 5.1, 0.35, 3.0, [1.0, 0.72, 0.42]);
  layer('fx'); raw(glow(...P(-2.0, 1.05, 5.12), K(5.1) * 0.7, K(5.1) * 0.55, '#ffb060', 0.35)); layer('mid');
});

// ================================================================== FG: the standing desk with the guest book, clutter by the door
layer('fg');
prop(4.25, () => {
  const X = 0.95, Z = 4.25, lo = 1.05, hi = 1.2;
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(X - 0.4, X + 0.4, lo, hi, Z - 0.12, Z + 0.25), [0, 1, 0], 0), Z, { op: 0.28 })));
  // a heavy turned post on a cross-foot
  I.woodBox(X - 0.3, X + 0.3, 0, 0.1, Z - 0.05, Z + 0.3, WOOD, { boards: 1, segs: 1 });
  I.beam(X - 0.06, X + 0.06, 0.1, lo, Z + 0.04, Z + 0.16, WOOD, { knots: 0.6 });
  const KEYDRAW = () => figProp(X - 0.24, lo - 0.03, Z - 0.125, (f, u) => {
    f.rivet([0, 0], 2.6, '#5a5650');
    f.line([[0, 0], [-4, 0.05 * u], [4, 0.05 * u], [0, 0]], 1.8, '#3a2414');
    PR.oldKey(f, [0, 0.06 * u], Math.PI / 2 - 0.08, 0.33 * u, 0.034 * u);
  });
  // (the heavy old iron key is drawn after the apron board, below)
  // the sloped top: a thick oak board
  const tp = [[X - 0.4, lo, Z - 0.12], [X + 0.4, lo, Z - 0.12], [X + 0.4, hi, Z + 0.25], [X - 0.4, hi, Z + 0.25]];
  I.woodFace([tp[3], tp[2], tp[1], tp[0]], WOODL, { bw: 0.12, stains: 0.6 });
  I.woodFace([[X - 0.4, lo, Z - 0.12], [X + 0.4, lo, Z - 0.12], [X + 0.4, lo - 0.05, Z - 0.12], [X - 0.4, lo - 0.05, Z - 0.12]], WOOD, { boards: 1, segs: 1 });
  KEYDRAW();
  raw('<g class="panel">');
  // ---- the guest book: far older than anything in the abbey's library.
  // Oak boards for covers with iron corner bosses; a page block a hand thick, built of gatherings sewn in over
  // centuries (the edge shows bands: brown and cockled at the bottom, paler above); open near the end; a crude strap
  // and iron clasp hanging over the front; a ribbon and loose slips; a column of names in one hand.
  const Y = zz => lo + (hi - lo) * (zz - Z + 0.12) / 0.37;
  const on = (x, zz, up) => [x, Y(zz) + up, zz];       // a point on the desk top, raised by `up`
  const bx0 = X - 0.37, bx1 = X + 0.37, bz0 = Z - 0.09, bz1 = Z + 0.22, th = 0.13, gx = X - 0.03;
  const face = (q, fill, o2 = {}) => raw(PLW([q[0], q[1], q[q.length - 1]], cel(q.map(p => P(...p)), Object.assign({ Z, fill }, o2))));
  // the lower board (cover) under everything, its front edge thick
  face([on(bx0 - 0.02, bz0 - 0.02, 0), on(bx1 + 0.02, bz0 - 0.02, 0), on(bx1 + 0.02, bz1 + 0.02, 0), on(bx0 - 0.02, bz1 + 0.02, 0)], '#3e2a1a', { tex: 'url(#mottle)', texOp: 0.6 });
  face([on(bx0 - 0.02, bz0 - 0.02, 0), on(bx1 + 0.02, bz0 - 0.02, 0), on(bx1 + 0.02, bz0 - 0.02, 0.022), on(bx0 - 0.02, bz0 - 0.02, 0.022)], '#4a3220');
  // the page block's front edge: bands of gatherings of different age (left block thick, right block thin)
  const lTh = th, rTh = th * 0.35;
  const bands = [['#6a4a2a', 0.18], ['#7a5a36', 0.14], ['#8a6c44', 0.16], ['#a08458', 0.14], ['#b49a6c', 0.14], ['#c8b490', 0.12], ['#d6c8a6', 0.12]];
  let acc = 0.03;
  for (const [col, fr] of bands) { const h = lTh * fr, xe = gx - 0.08 + 0.05 * Math.max(0, 1 - (acc + h) / lTh); face([on(bx0, bz0, acc), on(xe, bz0, acc), on(xe, bz0, acc + h), on(bx0, bz0, acc + h)], col, { band: 1, hi: false });
    for (let k = 1; k < 4; k++) { const A = P(...on(bx0 + 0.01, bz0, acc + h * k / 4)), B = P(...on(xe - 0.01, bz0, acc + h * k / 4)); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(col, INK, 0.5)}" stroke-width="0.6" opacity="0.7"/>`); }
    acc += h; }
  face([on(gx - 0.08, bz0, 0.03), on(gx, bz0, 0.03), on(gx - 0.035, bz0, lTh * 0.6), on(gx - 0.08, bz0, lTh + 0.028)], '#d6c8a6', { band: 1, hi: false });
  face([on(gx, bz0, 0.03), on(bx1, bz0, 0.03), on(bx1, bz0, 0.03 + rTh), on(gx + 0.04, bz0, 0.03 + rTh)], '#d2c4a0', { band: 1 });
  // the open pages: the left leaf high on its thick block, bowing down into the gutter; the right leaf low
  const leafL = [on(bx0, bz0, lTh + 0.03), on(gx - 0.08, bz0, lTh + 0.028), on(gx - 0.035, bz0, lTh * 0.6), on(gx - 0.01, bz0, 0.03), on(gx - 0.01, bz1, 0.03), on(gx - 0.035, bz1, lTh * 0.6), on(gx - 0.08, bz1, lTh + 0.028), on(bx0, bz1, lTh + 0.03)];
  const leafR = [on(gx + 0.01, bz0, 0.03), on(gx + 0.04, bz0, rTh + 0.028), on(bx1, bz0, rTh + 0.03), on(bx1, bz1, rTh + 0.03), on(gx + 0.04, bz1, rTh + 0.028), on(gx + 0.01, bz1, 0.03)];
  face(leafL, '#bca679', { tex: 'url(#mottle)', texOp: 0.6 });
  face(leafR, '#dccfae', { tex: 'url(#mottle)', texOp: 0.35 });
  // foxing and a water stain on the old leaf
  raw(S.stain(...P(...lerp3(leafL[0], leafL[6], 0.35)), K(Z) * 0.04, '#7a5a30', 0.35));
  // the hands that wrote here: ruled margins and a column of names, old faded ink on the left, fresh on the right
  { let t = ''; const rule = (p, q, col, w, op) => { const A = P(...p), B = P(...q); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${col}" stroke-width="${w}" opacity="${op}" stroke-linecap="round"/>`; };
    const onL = (u, v) => lerp3(lerp3(leafL[0], leafL[1], u), lerp3(leafL[7], leafL[6], u), v), onR = (u, v) => lerp3(lerp3(leafR[1], leafR[2], u), lerp3(leafR[4], leafR[3], u), v);
    rule(onL(0.12, 0.05), onL(0.12, 0.95), '#9a2a1e', 0.8, 0.5);
    for (let r = 0; r < 10; r++) { const v = 0.1 + r * 0.085; rule(onL(0.16, v), onL(0.16 + 0.35 + R() * 0.35, v), '#4a3a2a', 0.9, 0.55); }
    rule(onL(0.04, 0.12), onL(0.1, 0.12), '#9a2a1e', 1.6, 0.6);
    rule(onR(0.1, 0.05), onR(0.1, 0.95), '#9a2a1e', 0.8, 0.5);
    for (let r = 0; r < 5; r++) { const v = 0.1 + r * 0.085; rule(onR(0.14, v), onR(0.14 + 0.3 + R() * 0.4, v), '#1a120c', 1.0, 0.85); }
    raw(PLW([leafL[0], leafL[1], leafL[7]], t)); }
  // the gutter shadow and a ribbon marker, a slip of a newer paper tucked into the old block
  { const A = P(...on(gx, bz0, 0.032)), B = P(...on(gx, bz1, 0.032)); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="2.4" opacity="0.8"/>`); }
  face([on(gx - 0.005, bz0 + 0.01, 0.03), on(gx + 0.02, bz0 + 0.01, 0.028), on(gx + 0.03, bz0 - 0.07, 0.0), on(gx + 0.005, bz0 - 0.08, 0.0)], '#6a1e18', { band: 1 });
  face([on(bx0 + 0.06, bz0 + 0.002, lTh * 0.62), on(bx0 + 0.16, bz0 + 0.002, lTh * 0.62), on(bx0 + 0.15, bz0 - 0.035, lTh * 0.56), on(bx0 + 0.07, bz0 - 0.035, lTh * 0.58)], '#e4dcc4', { band: 1 });
  // iron corner bosses on the board, worn bright on their high points
  for (const [x, zz] of [[bx0 - 0.02, bz0 - 0.02], [bx1 + 0.02, bz0 - 0.02]]) figProp(x, Y(zz) + 0.012, zz, (f, u) => { f.part([[-0.025 * u, -0.02 * u], [0.025 * u, -0.02 * u], [0.03 * u, 0.012 * u], [-0.03 * u, 0.012 * u]].map(p => [p[0], p[1], 1]), { fill: '#3a3a3c', shade: 0.4, inkW: 1.2, cast: false }); f.rivet([0, -0.004 * u], 2, '#6e6e70'); }, { tag: false });
  // the strap with its iron clasp hanging over the front edge
  figProp(X + 0.18, Y(bz0) + 0.02, bz0 - 0.03, (f, u) => {
    f.part([[-0.025 * u, 0], [0.025 * u, 0], [0.028 * u, 0.12 * u], [-0.022 * u, 0.12 * u]].map(p => [p[0], p[1], 1]), { fill: '#3a2414', shade: 0.4, inkW: 1.2, cast: false, tex: PR.T(f, 'mottle'), texOp: 0.5 });
    f.part([[-0.035 * u, 0.11 * u], [0.035 * u, 0.11 * u], [0.03 * u, 0.17 * u], [-0.03 * u, 0.17 * u]], { fill: '#3e3e40', shade: 0.4, inkW: 1.3, cast: false });
    f.rivet([0, 0.14 * u], 2, '#6e6e70'); f.flat(ell([0.01 * u, 0.16 * u], 4, 2, 0, 6), '#5a2a14', { op: 0.6 });
  }, { tag: false });
  // a quill and an ink horn by the book
  figProp(X + 0.3, Y(Z + 0.15) + 0.005, Z + 0.15, (f, u) => { f.part([[0, 0], [0.04 * u, 0], [0.035 * u, -0.08 * u], [0.005 * u, -0.08 * u]], { fill: '#2a2420', shade: 0.4, inkW: 1.2, cast: false }); f.line([[0.02 * u, -0.07 * u], [0.1 * u, -0.28 * u]], 1.2, '#1a120c'); f.part([[0.1 * u, -0.28 * u], [0.14 * u, -0.25 * u], [0.06 * u, -0.12 * u], [0.04 * u, -0.13 * u]], { fill: '#d8d0bc', shade: 0.3, inkW: 0.9, cast: false }); }, { tag: false });
  raw('</g>');
  hot('guestbook', 'The guest book', [P(X - 0.4, lo, Z - 0.12), P(X + 0.4, lo, Z - 0.12), P(X + 0.4, hi, Z + 0.25), P(X - 0.4, hi, Z + 0.25)]);
});
function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
// the Hosteller's lantern, held out over the desk; the fire's heat on his back; the alchemist's flame
addLight(KEEPER.X - 0.45, 1.0, KEEPER.Z - 0.2, 0.7, 3.5, [1.0, 0.72, 0.42]);
addLight(KEEPER.X + 0.4, 1.1, KEEPER.Z + 0.9, 0.7, 3.0, [1.0, 0.56, 0.26]);
addLight(-1.95, 1.9, 5.8, 0.35, 3.0, [1.0, 0.62, 0.3]);
// a dropped blanket, mugs on the boards, a bucket of ash by the hearth, ash spilled in a fan
prop(3.7, () => {
  // a cloak dropped where its owner shrugged it off, and one boot kicked over on its side
  DR.droppedCloak([-0.75, 3.6], 0.85, 0.3, '#3a3e34');
  figProp(-1.45, 0, 3.35, (f, u) => { const s = 0.5 * u; f.part([[-0.2 * s, 0], [-0.22 * s, -0.09 * s], [0.12 * s, -0.11 * s], [0.18 * s, -0.16 * s], [0.34 * s, -0.15 * s], [0.36 * s, -0.04 * s], [0.3 * s, 0.01 * s]], { fill: '#3e2a1c', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.part(ell([0.27 * s, -0.095 * s], 0.06 * s, 0.05 * s, 0, 10), { fill: '#140c08', shade: 0.2, inkW: 1.2, cast: false }); f.line([[-0.21 * s, -0.01 * s], [0.3 * s, 0.0]], 2.4, '#140c06', { op: 0.8 }); f.line([[0.0, -0.1 * s], [0.12 * s, -0.11 * s]], 1.2, '#7a6a5a', { op: 0.5 }); f.flat(ell([-0.05 * s, -0.02 * s], 0.1 * s, 0.03 * s, 0, 8), '#2a2014', { op: 0.5 }); });
  for (const [X, Z, tip] of [[0.1, 3.0, false], [0.45, 3.3, true], [-2.0, 4.2, false]]) figProp(X, 0, Z, (f, u) => {
    if (!tip) PR.tankard(f, 0, 0.13 * u, '#6a6460');
    else { f.part([[-0.06 * u, 0], [0.07 * u, -0.01 * u], [0.075 * u, -0.08 * u], [-0.055 * u, -0.075 * u]], { fill: '#6a6460', shade: 0.4, inkW: 1.4 }); f.part(ell([0.075 * u, -0.045 * u], 0.012 * u, 0.04 * u, 0, 10), { fill: '#2a1a10', shade: 0.2, inkW: 1, cast: false }); f.flat(ell([0.16 * u, 0.005 * u], 0.08 * u, 0.012 * u, 0, 10), '#3a1a10', { op: 0.6 }); }
  });
  // ash spilled in a fan from the hearth
  let ash = ''; for (let k = 0; k < 60; k++) { const [x, y] = P(2.2 + R() * 1.6, 0, 6.0 + R() * 0.8); ash += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.8 + R() * 1.6)}" fill="${R() < 0.5 ? '#7a7670' : '#2a2826'}" opacity="0.8"/>`; }
  layer('bg'); raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], ash)); layer('fg');
});
// v3: the company's gear heaped in the front right corner: a pack with a kettle helm on it, a mail shirt in a heap, a coil
// of rope, a bundle of folded blankets
prop(3.45, () => {
  figProp(2.95, 0, 3.55, (f, u) => H.mail(f, u));
  figProp(2.55, 0, 3.75, (f, u) => H.pack(f, u, '#5a4a34'));
  figProp(2.1, 0, 3.85, (f, u) => H.helm(f, u, 'kettle', '#5a5e62'));
  figProp(2.25, 0, 3.45, (f, u) => H.ropeCoil(f, u));
  figProp(-0.2, 0, 3.05, (f, u) => H.folded(f, u, 3, ['#4a4a3a', '#5a3a2a', '#3e4a3a']));
});
// sacks and boots dumped by the door, a barrel
prop(3.2, () => {
  figProp(-2.75, 0, 3.25, (f, u) => PR.sack(f, 0, 0.62 * u));
  figProp(-2.2, 0, 3.4, (f, u) => PR.sack(f, 0, 0.55 * u, { open: true, contents: '#3a3a30', col: '#6a5a3e' }));
  figProp(-1.75, 0, 3.15, (f, u) => PR.boots(f, 0, 0.55 * u, '#4a3222'));
});
prop(3.0, () => {
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(3.3, 3.9, 0, 0.85, 2.9, 3.3), [0, 1, 0], 0), 3.1, { op: 0.3 })));
  figProp(3.6, 0, 3.1, (f, u) => PR.barrel(f, 0, 0.31 * u, 0.84 * u));
});

// ================================================================== write
const f = n => +(+n).toFixed(1);
I.write(KEEPER, { roster: ROSTER.map((r, i) => ({ slot: i, name: r.name, flip: r.flip, feet: P(r.X, 0, r.Z).map(f), height_px: f(620 * sc(r.Z)), z: r.Z })) }, OUT, { veil: { op: 0.6 } });
