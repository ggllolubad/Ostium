// The Undercroft smithy in Living Ink. Same room as grim/int_smithy.js: same camera, room box (10 x 8, a barrel vault springing
// at 2.6 m and rising 1.1), the low arcade on two squat round pillars at 6.0 m, the round-headed door in the right wall with
// the stair rising out of it, keeper spot, hotspots (exit with its treads, anvil, keeper), the twelve lights, and the layers
// grim had: bg and fg only (no mid), draw order bg, keeper, fg.
// Mother Hild's forge under the east range: the forge and its hood fill the back right bay, burning Storm Foundry coal; racks
// of half-made steel and the rune bench in the back left; the order's niche, tools on pegs and the coal bunker in the back
// centre; the anvil (the panel) in the front bay with a billet cooling on it.
// Lightning ruling (2026-11-23): no arcs or bolts are drawn. Grim drew white-blue static jumping from the fire up the hood;
// here the Storm Foundry coal shows its course only as marks: blue tongues in the fire, blue glints in the coal, and branching
// burns scorched into the hood and the vault above it (as on Hild's arms). The blue light stays in the light file, so the
// engine can spawn the static as an effect there.
// Usage: node scenes/int_smithy.js [outDir]   (default out/scenes/hub/smithy)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'smithy');
const I = require('./int_shell')('smithy', { width: 10, depth: 8, height: 3.7, vault: true, spring: 2.6, wall: '#4a433a', wall2: '#524a40', vaultCol: '#433c34', floorCol: '#3a342c', floor: 'stone', stone: 'ashlar', seed: 5150, panel: 'anvil',
  wallOpts: { dampCol: '#22201a' } });
const S = I;
const { P, K, sc, pp, p2, f1, INK, raw, layer, PLW, cel, hatch3, mix, hot, outline, HOT, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT, SPR } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell, lerp } = E;
const DR = require('./dress_li')(I);
const WOOD = '#4a3624', IRON = '#3e3c3a', STEEL = '#6a6e72', STEELD = '#3e4246';
const AZ = 6.0, AD = 0.35, PIL = [-2.6, 2.6], PRAD = 0.35, ASP = 2.3;
const KEEPER = { X: 1.0, Z: 4.62, h: (790 - 227) / (640 / 1.75), sprite: 'hild', label: 'Mother Hild', figure: [227, 790], flip: true };
const ANVIL = { X: -0.05, Z: 4.5 };
const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];
const DOOR = { z0: 6.55, z1: 7.55, ts: 1.95, rise: 0.5 };
const Yv = I.Yv;

I.shell();
// ------------------------------------------------------------------ the way out: a round-headed door in the right wall, the stair climbing away beyond it
{
  const za = DOOR.z0 - 0.22, zb = DOOR.z1 + 0.22, sz0 = DOOR.z0 - 0.1, sz1 = DOOR.z1 + 0.1, rw = (zb - za) / 2, zm = (za + zb) / 2, arc = [];
  for (let i = 0; i <= 16; i++) { const th = Math.PI * (1 - i / 16); arc.push([HW - 0.02, DOOR.ts + Math.sin(th) * (DOOR.rise + 0.22), zm + Math.cos(th) * rw]); }
  const ol = [[[[HW - 0.02, 0.36, za], ...arc, [HW - 0.02, 0.36, zb], [HW - 0.02, 0.37, sz1], [HW - 0.26, 0.37, sz1], [HW - 0.26, 0.19, sz1], [HW - 0.51, 0.19, sz1], [HW - 0.51, 0, sz1], [HW - 0.51, 0, sz0], [HW - 0.51, 0.19, sz0], [HW - 0.26, 0.19, sz0], [HW - 0.26, 0.37, sz0], [HW - 0.02, 0.37, sz0]], true]];
  I.door(DOOR.z0, DOOR.z1, { side: 1, ts: DOOR.ts, rise: DOOR.rise, threshold: false, light: [HW + 0.3, 1.6, (DOOR.z0 + DOOR.z1) / 2, 1.0, 4.5, [0.62, 0.66, 0.74]], outline: ol, ring: '#524a40',
    beyond: () => {
      // the passage: its far wall takes the Grey falling from the walk above; the stair climbs away to the right, every tread lit
      const zf = DOOR.z1 + 0.15, zs = DOOR.z1 + 0.05;
      const wallq = [[HW - 0.2, -0.1, zf], [HW + 3, -0.1, zf], [HW + 3, 3.4, zf], [HW - 0.2, 3.4, zf]];
      raw(PLW([[HW, 0, zf], [HW + 3, 0, zf], [HW, 3, zf]], `<g class="em">${cel(wallq.map(p => P(...p)), { Z: zf, fill: '#8a8880', band: 0, ink: false })}</g>` + S.masonry((s, t) => [HW - 0.2 + s, -0.1 + t, zf], 3.2, 3.5, '#6a6862', { course: 0.3, block: 0.5, vary: 0.15, mortar: 0.4 }) + hatch3((s, t) => [HW - 0.2 + s, -0.1 + t, zf], 0, 3.2, 0, 1.6, 0.8, { op: 0.45 })));
      for (let k = 9; k >= 0; k--) { const X0 = HW + 0.3 * k, Y1 = 0.19 * (k + 1);
        raw(PLW([[HW, 0, zs], [HW + 1, 0, zs], [HW, 1, zs]], cel([[X0, Y1 - 0.19, zs], [X0, Y1, zs], [X0 + 0.3, Y1, zs], [X0 + 0.3, Y1 - 0.19, zs]].map(p => P(...p)), { Z: zs, fill: mix('#2e2a24', '#6a665e', k / 10), band: 1.5 }) + `<g class="em"><path d="M${f1(P(X0, Y1, zs)[0])} ${f1(P(X0, Y1, zs)[1])} L${f1(P(X0 + 0.3, Y1, zs)[0])} ${f1(P(X0 + 0.3, Y1, zs)[1])}" stroke="#c8c4ba" stroke-width="2.4" opacity="${f1(0.4 + k * 0.05)}"/></g>`)); }
      raw(PLW([[HW, 0, DOOR.z1], [HW + 0.6, 0, DOOR.z1], [HW, 2, DOOR.z1]], S.masonry((s, t) => [HW + s, t, DOOR.z1], 0.6, DOOR.ts + 0.4, '#3a342e', { course: 0.3, block: 0.3 }) + hatch3((s, t) => [HW + s, t, DOOR.z1], 0, 0.6, 0, DOOR.ts + 0.4, 0.8, { op: 0.5 })));
    } });
  // the bottom of the stair comes out through the door into the room: two worn treads
  for (let k = 1; k >= 0; k--) {
    const xe = HW - 0.25 * (2 - k), y1 = 0.18 * (k + 1), y0 = 0.18 * k, z0 = DOOR.z0 - 0.05, z1 = DOOR.z1 + 0.05, col = mix('#5a5248', '#0e0a08', k * 0.08);
    raw(PLW([[xe, y0, z0], [xe, y0, z1], [xe, y1, z0]], cel([[xe, y0, z0], [xe, y0, z1], [xe, y1, z1], [xe, y1, z0]].map(p => P(...p)), { Z: z0, fill: mix(col, S.SHT, 0.3) }) + hatch3((s, t) => [xe, y0 + t, z0 + s], 0, z1 - z0, 0, 0.18, 0.7, { op: 0.45 })));
    raw(PLW([[HW, y1, z0], [xe, y1, z0], [HW, y1, z1]], cel(S.chip([[HW, y1, z0], [xe, y1, z0], [xe, y1, z1], [HW, y1, z1]].map(p => P(...p)), 0.3), { Z: z0, fill: col, tex: 'url(#mottle)', texOp: 0.4 }) + (() => { const A = P(xe + 0.04, y1, z0 + 0.2), B = P(xe + 0.04, y1, z1 - 0.3); return `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#8a8274" stroke-width="2" opacity="0.5"/>`; })()));
    raw(PLW([[HW, y0, z0], [xe, y0, z0], [HW, y1, z0]], cel([[HW, y0, z0], [xe, y0, z0], [xe, y1, z0], [HW, y1, z0]].map(p => P(...p)), { Z: z0, fill: mix(col, '#000', 0.1) })));
  }
}
// ------------------------------------------------------------------ the back wall worn: soot over the forge, bloom low, cracks; the right wall darker
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, { bloom: [[0.4, 0.4, 0.8, 0.6], [5.0, 0.35, 0.8, 0.4]], cracks: [[2.2, 3.3, 1.0, -1.2], [4.6, 0.15, 0.7, 1.4], [9.0, 2.9, 0.9, -2.0]], soot: [[5.8, 9.6, 1.6, 3.6, 0.32], [3.8, 4.8, 1.8, 2.8, 0.16]] });
}
// ------------------------------------------------------------------ the back left bay: the rack of steel on the wall, the rune bench below it
prop(D1 - 0.1, () => {
  const x0 = -4.7, x1 = -3.0, zr = D1 - 0.06;
  for (const X of [x0, x1]) I.beam(X - 0.06, X + 0.06, 0.9, 2.55, zr - 0.05, zr, WOOD, { knots: 0.5 });
  for (const Y of [1.3, 1.95, 2.45]) I.beam(x0 - 0.1, x1 + 0.1, Y - 0.04, Y + 0.04, zr - 0.09, zr - 0.05, WOOD);
  // blades hung point-down from the top rail: finished and bright, black from the fire, one only a bar
  for (let i = 0; i < 7; i++) {
    const X = x0 + 0.18 + i * 0.22, raw0 = i === 2 || i === 5, len = 0.75 + R() * 0.25;
    figProp(X, 2.42, zr - 0.12, (f, u) => { const w = (raw0 ? 0.03 : 0.04) * u, l = len * u, steel = raw0 ? '#2a2624' : mix(STEEL, '#1a1816', R() * 0.4);
      f.part([[-w, 0], [w, 0], [w * 0.4, l - w], [0, l, 1], [-w * 0.4, l - w]], { fill: steel, light: raw0 ? '#4a4440' : '#c8ccd0', shade: 0.4, inkW: 1.1, cast: false });
      if (!raw0) f.line([[0, 4], [0, l - w * 2]], 0.8, '#e8eaec', { op: 0.6 });
      f.line([[-0.06 * u, -2], [0.06 * u, -2]], 4, '#1a120c'); f.line([[0, -2], [0, -0.14 * u]], 4.4, '#1a120c'); f.line([[0, -2], [0, -0.14 * u]], 2.6, '#5a4028');
      if (R() < 0.4) f.flat(ell([w * 0.2, l * 0.5], w * 0.8, w * 1.6, 0, 8), '#5a2a14', { op: 0.5 }); }, { tag: false });
  }
  // a mail shirt hung by its shoulders, a sallet on a peg
  figProp(-4.15, 1.95, zr - 0.14, (f, u) => { f.part([[-0.38 * u, 0], [0.38 * u, 0], [0.42 * u, 0.15 * u], [0.36 * u, 0.7 * u], [0.1 * u, 0.72 * u], [-0.12 * u, 0.68 * u], [-0.4 * u, 0.7 * u], [-0.44 * u, 0.14 * u]], { fill: STEELD, tex: PR.T(f, 'mail'), texOp: 0.9, shade: 0.45 }); f.flat(ell([0.2 * u, 0.5 * u], 0.08 * u, 0.06 * u, 0, 10), '#5a2a14', { op: 0.55 }); f.line([[-0.38 * u, 0.05 * u], [0.38 * u, 0.05 * u]], 3, '#2a2826'); }, { tag: false });
  figProp(-3.2, 2.2, zr - 0.15, (f, u) => { f.part([[-0.16 * u, 0.06 * u], [-0.14 * u, -0.1 * u], [0, -0.16 * u], [0.16 * u, -0.08 * u], [0.28 * u, 0.06 * u], [0.1 * u, 0.1 * u]], { fill: STEEL, light: '#c8ccd0', shade: 0.45, inkW: 1.4 }); f.line([[-0.15 * u, 0], [0.1 * u, -0.01 * u]], 2.2, '#1a120c'); });
});
prop(6.85, () => {
  const bx0 = -4.45, bx1 = -3.05, bz0 = 6.85, bz1 = 7.55, bt = 0.88;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(bx0, bx1, 0, bt, bz0, bz1), [0, 1, 0], 0), bz0, { op: 0.28 })));
  for (const X of [bx0 + 0.12, bx1 - 0.12]) { I.beam(X - 0.05, X + 0.05, 0, bt - 0.09, bz0 + 0.05, bz0 + 0.12, WOOD); }
  I.woodFace([[bx0, bt, bz1], [bx1, bt, bz1], [bx1, bt, bz0], [bx0, bt, bz0]], mix(WOOD, '#8a7a60', 0.15), { bw: 0.14, stains: 0.8 });
  I.woodFace([[bx0, bt, bz0], [bx1, bt, bz0], [bx1, bt - 0.09, bz0], [bx0, bt - 0.09, bz0]], WOOD, { boards: 1, segs: 1 });
  // the plate upright in a little vice, its runes cut and faintly alive
  const pl = [[-3.95, bt + 0.08, 7.2], [-3.55, bt + 0.08, 7.2], [-3.55, bt + 0.42, 7.2], [-3.95, bt + 0.42, 7.2]];
  raw(PLW(pl.slice(0, 3), cel(pl.map(p => P(...p)), { Z: 7.2, fill: STEELD, tex: 'url(#mottle)', texOp: 0.4 })));
  let rn = ''; for (let i = 0; i < 4; i++) { const [x, y] = P(-3.89 + i * 0.09, bt + 0.32, 7.19), s = K(7.2) * 0.05; rn += `<path d="M${f1(x)} ${f1(y)} l0 ${f1(s * 2.6)} M${f1(x)} ${f1(y + s * 0.6)} l${f1(s)} ${f1(-s * 0.6)} M${f1(x)} ${f1(y + s * 1.4)} l${f1(s * 0.9)} ${f1(s * 0.5)}" stroke="#a8d8ff" stroke-width="1.5" fill="none"/>`; }
  raw(S.EM(rn));
  addLight(-3.75, bt + 0.3, 7.0, 0.12, 1.2, [0.6, 0.8, 1.0]);
  I.woodBox(-3.98, -3.52, bt, bt + 0.1, 7.15, 7.25, IRON, { cast: false, boards: 1 });
  figProp(-4.15, bt, 7.05, (f, u) => { for (let i = 0; i < 4; i++) { const x = (i * 0.07) * u; f.line([[x, 0], [x + 0.18 * u, -0.01 * u]], 3.2, '#1a120c'); f.line([[x, 0], [x + 0.18 * u, -0.01 * u]], 1.8, i % 2 ? STEEL : '#5a4028'); } f.part([[0.3 * u, 0], [0.42 * u, 0], [0.42 * u, -0.06 * u], [0.3 * u, -0.06 * u]], { fill: '#5a4028', shade: 0.4, inkW: 1.1, cast: false }); });
  figProp(-4.25, bt, 7.35, (f, u) => { for (const [x, h] of [[-0.08, 0.14], [0, 0.1], [0.08, 0.16]]) KK.candle(f, [x * u, 0], h * u, 0.03 * u, { drips: 2, fs: 4 }); });
  addLight(-4.25, bt + 0.3, 7.2, 0.31, 2.4, [1.0, 0.74, 0.44]);
  layer('fx'); raw(glow(...P(-4.25, bt + 0.2, 7.35), K(7.3) * 0.6, K(7.3) * 0.5, '#ffb060', 0.35)); layer('bg');
});
// ------------------------------------------------------------------ the back centre: the order's niche, tools on pegs, the coal bunker
{
  const atN = (s, t) => [s, t, D1 - 0.03];
  const niche = I.archPts(atN, -1.05, -0.45, 1.35, 1.85, 0.3, 8);
  raw(PLW([niche[0], niche[1], niche[2]], cel(niche.map(p => P(...p)), { Z: D1, fill: '#2e261c', band: 3 }) + hatch3((s, t) => [s, t, D1 - 0.03], -1.05, -0.45, 1.6, 2.15, 0.7, { op: 0.4 })));
  raw(I.archRing(atN, -1.05, -0.45, 1.85, 0.3, 0.1, '#524a40', 5));
  addLight(-0.75, 1.55, D1 - 0.35, 0.22, 1.6, [1.0, 0.74, 0.44]);
  figProp(-0.75, 1.6, D1 - 0.05, (f, u) => { const s = 0.06 * u; f.line([[-s, s * 1.6], [-s, 0], [0, -s * 1.2], [s, 0], [s, s * 1.6]], 3.6, '#1a120c'); f.line([[-s, s * 1.6], [-s, 0], [0, -s * 1.2], [s, 0], [s, s * 1.6]], 2, '#8a8a86'); }, { tag: false });
  figProp(-0.75, 1.37, D1 - 0.1, (f, u) => KK.candle(f, [0, 0], 0.1 * u, 0.03 * u, { drips: 3, fs: 4 }), { tag: false });
  addLight(-0.75, 1.67, D1 - 0.25, 0.17, 2.4, [1.0, 0.74, 0.44]);
  raw(PLW([[0, 0, D1], [1, 0, D1], [0, 1, D1]], S.soot(I.atB, 3.95, 4.55, 2.0, 2.9, { op: 0.2 })));
  layer('fx'); raw(glow(...P(-0.75, 1.5, D1 - 0.1), K(D1) * 0.4, K(D1) * 0.35, '#ffb060', 0.4)); layer('bg');
  // the peg board: hammers by size head up, tongs of every bite jaws down
  I.woodFace([[-0.25, 2.1, D1 - 0.04], [1.25, 2.1, D1 - 0.04], [1.25, 1.05, D1 - 0.04], [-0.25, 1.05, D1 - 0.04]], WOOD, { bw: 0.21 });
  for (let i = 0; i < 5; i++) figProp(-0.1 + i * 0.16, 2.0, D1 - 0.08, (f, u) => { const hl = (0.32 + i * 0.03) * u, hw = (0.06 + i * 0.012) * u; f.rivet([0, -4], 2, '#5a5650'); f.line([[0, 0], [0, hl]], 4.6, '#1a120c'); f.line([[0, 0], [0, hl]], 2.8, '#6a4a2a'); f.part([[-hw, -0.01 * u], [hw, -0.01 * u], [hw, 0.035 * u], [-hw, 0.035 * u]], { fill: IRON, light: '#8a8a88', shade: 0.4, inkW: 1.2, cast: false }); }, { tag: false });
  for (let i = 0; i < 4; i++) figProp(0.72 + i * 0.13, 2.02, D1 - 0.08, (f, u) => { const l = (0.5 + R() * 0.15) * u, j = 0.02 * u; for (const sg of [-1, 1]) { f.line([[sg * j, 0], [sg * j * 0.5, l * 0.7], [sg * j * 2.2, l]], 3.4, '#1a120c'); f.line([[sg * j, 0], [sg * j * 0.5, l * 0.7], [sg * j * 2.2, l]], 1.6, '#4a4644'); } f.rivet([0, l * 0.7], 1.6, '#6a6660'); }, { tag: false });
  // the coal bunker: a boarded crib heaped with Storm Foundry coal, blue glints in it
  prop(D1 - 0.6, () => {
    I.woodFace([[-2.2, 0.55, D1 - 0.75], [-0.6, 0.55, D1 - 0.75], [-0.6, 0, D1 - 0.75], [-2.2, 0, D1 - 0.75]], WOOD, { bw: 0.18 });
    figProp(-1.42, 0.5, D1 - 0.55, (f, u) => { const pts = [[-0.82 * u, 0.02 * u]]; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([(-0.82 + 1.64 * t) * u, -(Math.sin(t * Math.PI) * 0.42 + (f.r() - 0.5) * 0.05) * u]); } pts.push([0.82 * u, 0.02 * u]); f.part(pts, { fill: '#1e1c1c', light: '#3a3838', shade: 0.4, inkW: 1.4 });
      for (let k = 0; k < 34; k++) { const t = f.r(), x = (-0.75 + 1.5 * t) * u, y = -f.r() * Math.sin(t * Math.PI) * 0.38 * u; f.part(ell([x, y], 4 + f.r() * 5, 3 + f.r() * 3, f.r() * 3, 6), { fill: f.r() < 0.14 ? '#6a98d0' : f.r() < 0.5 ? '#2e2c2c' : '#121010', shade: 0.3, inkW: 0.7, cast: false, hatch: false }); } }, { tag: false });
  });
}
// ------------------------------------------------------------------ the forge: a stone hearth, the hood climbing into the vault, the fire, the bellows
const FORGE = { x0: 1.45, x1: 4.35, z0: 7.0, z1: 7.9, top: 0.95, fire: [2.9, 1.05, 7.4] };
prop(FORGE.z0, () => {
  const { x0, x1, z0, z1, top } = FORGE;
  // the hood: a sooted stone cone on iron brackets, tapering into the flue in the vault; branching burns scorched into it
  const hood = [[x0 + 0.1, 1.75, z0 + 0.2], [x1 - 0.1, 1.75, z0 + 0.2], [x1 - 0.7, 2.9, z0 + 0.55], [x1 - 0.95, Yv(x1 - 0.95) + 0.1, z0 + 0.75], [x0 + 0.95, Yv(x0 + 0.95) + 0.1, z0 + 0.75], [x0 + 0.7, 2.9, z0 + 0.55]];
  const atH = (s, t) => [x0 + 0.1 + s, 1.75 + t, z0 + 0.2 + t * 0.3];
  through(hood, () => raw(PLW([hood[0], hood[1], hood[5]], S.masonry(atH, x1 - x0 - 0.2, 2.2, '#3e352e', { course: 0.28, block: 0.55, vary: 0.25 }) + hatch3(atH, 0, x1 - x0 - 0.2, 0, 2.2, 0.7, { op: 0.4 }) + S.soot(atH, 0.2, x1 - x0 - 0.4, 0.0, 2.2, { op: 0.35 }))));
  raw(PLW([hood[0], hood[1], hood[5]], `<path d="${pp(hood)}" fill="none" stroke="${INK}" stroke-width="2.4"/>`));
  { let sc2 = ''; const fern = (x, y, ang, len, d) => { let px = x, py = y, path0 = `M${f1(px)} ${f1(py)}`; for (let i = 0; i < 5; i++) { const t = ang + (R() - 0.5) * 0.9; px += Math.cos(t) * len / 5; py += Math.sin(t) * len / 5; path0 += ` L${f1(px)} ${f1(py)}`; if (d > 0 && R() < 0.7) fern(px, py, ang + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.5), len * 0.5, d - 1); } sc2 += `<path d="${path0}" stroke="#0a0806" stroke-width="${f1(0.6 + d * 0.5)}" fill="none" opacity="0.6" stroke-linecap="round"/><path d="${path0}" stroke="#5a7a9a" stroke-width="${f1(0.3 + d * 0.15)}" fill="none" opacity="0.25" transform="translate(-0.6,-0.6)"/>`; };
    for (let i = 0; i < 4; i++) { const [x, y] = P(x0 + 0.6 + R() * 1.6, 1.85, z0 + 0.22); fern(x, y, -Math.PI / 2 + (R() - 0.5) * 0.9, 40 + R() * 30, 3); }
    raw(PLW([hood[0], hood[1], hood[5]], sc2)); }
  raw(PLW([hood[0], hood[1], hood[5]], cel([[x0 + 0.05, 1.72, z0 + 0.19], [x1 - 0.05, 1.72, z0 + 0.19], [x1 - 0.05, 1.86, z0 + 0.19], [x0 + 0.05, 1.86, z0 + 0.19]].map(p => P(...p)), { Z: z0, fill: IRON })));
  for (const X of [x0 + 0.3, x1 - 0.3]) raw(I.rod([X, 1.74, z0 + 0.2], [X, 1.3, z0 + 0.6], IRON, 2.6) + I.rod([X, 1.3, z0 + 0.6], [X, 1.3, z1 - 0.1], IRON, 2.6));
  // the back of the fire pit glowing, the cheeks, the hearth block of stone, its top
  raw(S.EM(cel([[x0 + 0.25, top, z1 - 0.05], [x1 - 0.2, top, z1 - 0.05], [x1 - 0.3, 1.74, z1 - 0.05], [x0 + 0.35, 1.74, z1 - 0.05]].map(p => P(...p)), { Z: z1, fill: '#2a1008', band: 0 })) + `<path d="${pp([[x0 + 0.25, top, z1 - 0.05], [x1 - 0.2, top, z1 - 0.05], [x1 - 0.3, 1.2, z1 - 0.05], [x0 + 0.35, 1.2, z1 - 0.05]])}" fill="#6a2a0c" opacity="0.8"/>` + hatch3((s, t) => [x0 + 0.3 + s, 1.3 + t, z1 - 0.05], 0, x1 - x0 - 0.5, 0, 0.44, 0.8, { op: 0.5 }));
  for (const X of [x0 + 0.25, x1 - 0.2]) raw(PLW([[X, top, z0 + 0.2], [X, top, z1], [X, 1.7, z0 + 0.2]], cel([[X, top, z0 + 0.2], [X, top, z1 - 0.05], [X, 1.74, z1 - 0.05], [X, 1.74, z0 + 0.2]].map(p => P(...p)), { Z: z0, fill: X < 2 ? '#3a2014' : '#1e140e' })));
  I.stoneBox(x0, x1, 0, top, z0, z1, '#5a4e42', { course: 0.32, block: 0.55, cast: false });
  // the fire bed: coals heaped in the pit, orange with blue tongues among them (Storm Foundry coal)
  const fc = [FORGE.fire[0], top + 0.02, FORGE.fire[2] - 0.15];
  figProp(...fc, (f, u) => { const pts = []; for (let i = 0; i <= 12; i++) { const th = Math.PI * i / 12; pts.push([Math.cos(th) * 0.7 * u, -Math.sin(th) * 0.16 * u]); } f.part(pts, { fill: '#c84a14', shade: 0.2, inkW: 1.6, cast: false, hatch: false }); for (let k = 0; k < 26; k++) f.part(ell([(f.r() - 0.5) * 1.2 * u, -f.r() * 0.13 * u], 3 + f.r() * 4, 2 + f.r() * 3, f.r() * 3, 6), { fill: f.r() < 0.4 ? '#ffd27a' : f.r() < 0.5 ? '#1a0e08' : '#ff8a3a', shade: 0.2, inkW: 0.5, cast: false, hatch: false }); }, { em: true, tag: false });
  figProp(fc[0], fc[1] + 0.05, fc[2], (f, u) => PR.fire(f, 1.1 * u, 0.62 * u, { n: 8 }), { em: true, tag: false });
  figProp(fc[0] + 0.1, fc[1] + 0.05, fc[2] - 0.05, (f, u) => { const blue = c => ({ '#8a2410': '#1e3a7a', '#d8541c': '#5a8ad8', '#ffa83a': '#bfe6ff', '#fff0b0': '#ffffff' })[c] || c; const of = f.flat.bind(f); f.flat = (pts, c, o) => of(pts, blue(c), o); PR.fire(f, 0.5 * u, 0.42 * u, { n: 5 }); f.flat = of; }, { em: true, tag: false });
  addLight(FORGE.fire[0], 1.2, FORGE.fire[2] - 0.35, 1.5, 7.5, [1.0, 0.52, 0.2]);
  addLight(FORGE.fire[0] - 0.3, 1.65, FORGE.fire[2] - 0.6, 0.9, 5.0, [0.6, 0.8, 1.0]);
  addLight(FORGE.x0 + 0.1, 1.1, FORGE.z0 - 0.3, 0.55, 3.0, [1.0, 0.55, 0.24]);
  layer('fx'); raw(glow(...P(fc[0], 1.25, fc[2] - 0.2), K(7.3) * 2.0, K(7.3) * 1.5, '#ff8a3a', 0.45) + glow(...P(fc[0], 1.35, fc[2] - 0.2), K(7.3) * 0.8, K(7.3) * 0.7, '#c8e0ff', 0.3) + glow(...P(fc[0], 0.05, z0 - 1.0), K(z0) * 2.6, K(z0) * 0.8, '#ffa050', 0.18)); layer('bg');
});
// a cask of quench oil at the left wall behind the arcade, bar stock stood up in it
prop(6.3, () => {
  figProp(-4.55, 0, 6.3, (f, u) => { for (let k = 0; k < 5; k++) { const x = (-0.15 + k * 0.07) * u, t = (0.5 + f.r() * 0.4) * u; f.line([[x, -0.7 * u], [x + (f.r() - 0.5) * 0.1 * u, -0.7 * u - t]], 5.5, '#1a120c'); f.line([[x, -0.7 * u], [x + (f.r() - 0.5) * 0.1 * u, -0.7 * u - t]], 3, k % 2 ? '#4a4644' : '#4a3a32'); } PR.barrel(f, 0, 0.3 * u, 0.72 * u, '#4a3a28'); f.part(ell([0, -0.72 * u], 0.29 * u, 0.06 * u, 0, 14), { fill: '#141210', shade: 0.2, inkW: 1, cast: false, hatch: false }); });
});
// the quench trough at the left of the front bay: a stone trough of black water, tongs left in it, steam
prop(4.6, () => {
  const x0 = -3.75, x1 = -2.25, z0 = 4.6, z1 = 5.25, ht = 0.62;
  I.stoneBox(x0, x1, 0, ht, z0, z1, '#5a5246', { course: 0.31, block: 0.52 });
  const wat = [[x0 + 0.1, ht - 0.03, z0 + 0.1], [x1 - 0.1, ht - 0.03, z0 + 0.1], [x1 - 0.1, ht - 0.03, z1 - 0.1], [x0 + 0.1, ht - 0.03, z1 - 0.1]];
  raw(PLW([wat[0], wat[1], wat[3]], cel(wat.map(p => P(...p)), { Z: z0, fill: '#141a1e', band: 3 }) + (() => { const A = P(x0 + 0.3, ht - 0.03, z0 + 0.3), B = P(x1 - 0.5, ht - 0.03, z0 + 0.32); return `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#6a7a88" stroke-width="1.2" opacity="0.5"/>`; })()));
  raw(I.rod([x0 + 0.5, ht + 0.4, z0 + 0.3], [x0 + 0.75, ht - 0.02, z0 + 0.35], '#3a3634', 2.2) + I.rod([x0 + 0.56, ht + 0.4, z0 + 0.3], [x0 + 0.8, ht - 0.02, z0 + 0.35], '#3a3634', 2.2));
  layer('fx'); for (let k = 0; k < 3; k++) raw(glow(...P(x0 + 0.7 + k * 0.05, ht + 0.25 + k * 0.25, z0 + 0.4), K(z0) * 0.15, K(z0) * 0.2, '#d8d8d8', 0.25)); layer('bg');
});

// ------------------------------------------------------------------ the arcade: soffits, the face with its stones clipped round the openings, voussoirs, pillars
const atA = (s, t) => [s, t, AZ];
const ARCH = [[-HW, -PIL[1] - PRAD, 0.5], [PIL[0] + PRAD, PIL[1] - PRAD, 1.15], [PIL[1] + PRAD, HW, 0.5]];
{
  for (const [s0, s1, rise] of ARCH) {
    const n = 16, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2;
    let o = ''; for (let i = 0; i < n; i++) { const th0 = Math.PI * i / n, th1 = Math.PI * (i + 1) / n, A = th => [sm + Math.cos(th) * rw, ASP + Math.sin(th) * rise];
      const [p0, p1] = [A(th0), A(th1)], q = [[p0[0], p0[1], AZ], [p1[0], p1[1], AZ], [p1[0], p1[1], AZ + AD], [p0[0], p0[1], AZ + AD]];
      o += cel(q.map(p => P(...p)), { Z: AZ, fill: mix('#3a322a', '#0e0a08', R() * 0.3), band: 0.8 }); }
    raw(PLW([[0, 0, AZ], [1, 0, AZ], [0, 0, AZ + 1]], o + hatch3((s, t) => [s0 + s, ASP + rise * 0.5, AZ + t], 0, s1 - s0, 0, AD, 0.5, { op: 0.4 })));
  }
  const top = []; for (let i = 0; i <= 24; i++) { const X = HW - 2 * HW * i / 24; top.push([X, Yv(X) + 0.02, AZ]); }
  const outer = [];
  for (const [s0, s1, rise] of ARCH) { const n = 18, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2; for (let i = 0; i <= n; i++) { const th = Math.PI * (1 - i / n); outer.push([sm + Math.cos(th) * rw, ASP + Math.sin(th) * rise, AZ]); } }
  outer.push(...top);
  through(outer, () => {
    raw(PLW([atA(0, 0), atA(1, 0), atA(0, 1)], S.ashlar((s, t) => [-HW + s, ASP + t, AZ], 2 * HW, SPR + 1.3 - ASP, '#524a40', { scale: 0.42, wscale: 0.5, vary: 0.24, chip: 0.5, mortar: 0.55, lost: 0.12, spall: 0.12, courses: [0.9, 0.7, 0.55, 0.8, 1.05, 0.6] }) + S.planeShade(atA, 2 * HW, 4, [0, 0, -1])));
    I.grade((s, t) => [-HW + s, ASP + t, AZ], 2 * HW, 1.5, [atA(0, 0), atA(1, 0), atA(0, 1)], { bias: 0.15 });
    raw(PLW([atA(0, 0), atA(1, 0), atA(0, 1)], S.soot((s, t) => [-HW + s, ASP + t, AZ], 4.8, 8.0, 0.4, 1.4, { op: 0.28 })));
  });
  for (const [s0, s1, rise] of ARCH) raw(I.archRing(atA, s0, s1, ASP, rise, 0.24, '#524a40', s1 - s0 > 3 ? 13 : 7));
  raw(`<path d="${S.smooth(top.map(p => P(...p)), false, 0.5)}" stroke="${INK}" stroke-width="2.4" fill="none"/>`);
}
// squat round pillars: drum courses curving with the eye, a cushion capital, a square plinth, chalk tallies of work owed
for (const X of PIL) prop(AZ, () => {
  const Zc = AZ + PRAD * 0.5;
  const ring = y => { const o = []; for (let i = 0; i <= 12; i++) { const th = Math.PI * i / 12, Xx = X + Math.cos(th) * PRAD, Zz = Zc - Math.sin(th) * PRAD; o.push(P(Xx, y, Zz)); } return o; };
  const drum = [...ring(0.2), ...ring(ASP - 0.25).reverse()];
  let o = cel(drum, { Z: AZ, fill: mix('#524a40', '#8a8070', 0.12), tex: 'url(#mottle)', texOp: 0.45, band: K(AZ) * PRAD * 0.5 });
  // the round shading: a lit stripe left of centre, the right third in crosshatch
  { const lit = [P(X - PRAD * 0.55, 0.2, Zc - PRAD * 0.83), P(X - PRAD * 0.15, 0.2, Zc - PRAD), P(X - PRAD * 0.15, ASP - 0.25, Zc - PRAD), P(X - PRAD * 0.55, ASP - 0.25, Zc - PRAD * 0.83)]; o += `<path d="${p2(lit)}" fill="#e8dcc0" opacity="0.12"/>`;
    const dk = [P(X + PRAD * 0.35, 0.2, Zc - PRAD * 0.93), P(X + PRAD, 0.2, Zc), P(X + PRAD, ASP - 0.25, Zc), P(X + PRAD * 0.35, ASP - 0.25, Zc - PRAD * 0.93)]; o += `<path d="${p2(dk)}" fill="${S.hatchA(AZ)}" opacity="0.5"/><path d="${p2(dk)}" fill="${S.hatchB(AZ)}" opacity="0.4"/>`; }
  for (let y = 0.48; y < ASP - 0.3; y += 0.28 + R() * 0.08) o += `<path d="${S.smooth(ring(y), false, 0.5)}" stroke="${INK}" stroke-width="1.3" fill="none" opacity="0.8"/>`;
  for (let i = 0; i < 6; i++) { const y = 0.3 + R() * 1.6, th = 0.3 + R() * 2.4, p0 = P(X + Math.cos(th) * PRAD, y, Zc - Math.sin(th) * PRAD), p1 = P(X + Math.cos(th + 0.25) * PRAD, y + 0.08, Zc - Math.sin(th + 0.25) * PRAD); o += `<path d="M${f1(p0[0])} ${f1(p0[1])} L${f1(p1[0])} ${f1(p1[1])}" stroke="${INK}" stroke-width="0.8" opacity="0.7"/>`; }
  o += S.stain(...P(X, 0.45, AZ), K(AZ) * 0.3, '#0e0a08', 0.45);
  raw(PLW([[0, 0, AZ], [1, 0, AZ], [0, 1, AZ]], o));
  // cushion capital and abacus, plinth
  raw(PLW([[0, 0, AZ - 0.1], [1, 0, AZ - 0.1], [0, 1, AZ - 0.1]], cel([P(X - PRAD - 0.05, ASP - 0.25, AZ), P(X + PRAD + 0.05, ASP - 0.25, AZ), P(X + PRAD + 0.14, ASP - 0.08, AZ - 0.1), P(X + PRAD + 0.14, ASP, AZ - 0.1), P(X - PRAD - 0.14, ASP, AZ - 0.1), P(X - PRAD - 0.14, ASP - 0.08, AZ - 0.1)], { Z: AZ, fill: mix('#524a40', '#a89a80', 0.15), tex: 'url(#mottle)', texOp: 0.4 }) +
    cel([P(X - PRAD - 0.12, 0, AZ - 0.1), P(X + PRAD + 0.12, 0, AZ - 0.1), P(X + PRAD + 0.12, 0.2, AZ - 0.1), P(X - PRAD - 0.12, 0.2, AZ - 0.1)], { Z: AZ, fill: mix('#524a40', '#000', 0.1), tex: 'url(#mottle)', texOp: 0.4 })));
  if (X > 0) { let t = ''; const [cx, cy] = P(X - 0.12, 1.25, AZ - 0.02); for (let g = 0; g < 3; g++) { for (let i = 0; i < 4; i++) t += `<path d="M${f1(cx + g * 14 + i * 3)} ${f1(cy)} l0.5 10" stroke="#d8d0c0" stroke-width="1.1" opacity="0.4"/>`; t += `<path d="M${f1(cx + g * 14 - 1)} ${f1(cy + 8)} l13 -6" stroke="#d8d0c0" stroke-width="1.1" opacity="0.4"/>`; } raw(t); }
});
// a torch in an iron bracket on the left pillar, lit
prop(AZ - 0.1, () => {
  const X = PIL[0], Y = 1.65, Z = AZ - 0.02;
  figProp(X + 0.05, Y, Z - 0.2, (f, u) => { f.line([[-0.06 * u, 0.12 * u], [0.04 * u, 0.0]], 4.6, '#1a120c'); f.line([[-0.06 * u, 0.12 * u], [0.04 * u, 0.0]], 2.8, IRON); f.part([[0.0, 0.02 * u], [0.06 * u, 0.02 * u], [0.07 * u, -0.06 * u], [-0.01 * u, -0.06 * u]], { fill: '#2a2420', shade: 0.4, inkW: 1.2, cast: false }); f.line([[0.03 * u, 0.12 * u], [0.04 * u, -0.08 * u]], 5, '#1a120c'); f.line([[0.03 * u, 0.12 * u], [0.04 * u, -0.08 * u]], 3.4, '#4a3626'); });
  figProp(X + 0.09, Y + 0.08, Z - 0.22, (f, u) => PR.fire(f, 0.18 * u, 0.36 * u, { n: 5 }), { em: true, tag: false });
  addLight(X + 0.08, Y + 0.3, Z - 0.4, 1.3, 6.5, [1.0, 0.56, 0.24]);
  layer('fx'); raw(glow(...P(X + 0.09, Y + 0.25, Z - 0.22), K(Z) * 1.1, K(Z) * 1.0, '#ff9a40', 0.4)); layer('bg');
  raw(PLW([[0, 0, AZ], [1, 0, AZ], [0, 1, AZ]], S.soot((s, t) => [X - 0.3 + s, Y + 0.3 + t, AZ - 0.02], 0, 0.6, 0, 0.6, { op: 0.25 })));
});
// the pierced iron lantern hung from the vault on a chain over the anvil
prop(5.0, () => {
  const [tx, ty] = P(-1.55, Yv(-1.55), 5.0), [lx, ly] = P(-1.55, 2.35, 5.0);
  raw(`<path d="M${f1(tx)} ${f1(ty)} L${f1(lx)} ${f1(ly - 14)}" stroke="${INK}" stroke-width="3" stroke-dasharray="4 2"/><path d="M${f1(tx)} ${f1(ty)} L${f1(lx)} ${f1(ly - 14)}" stroke="#4a4644" stroke-width="1.4" stroke-dasharray="4 2"/>`);
  figProp(-1.55, 2.4, 5.0, (f, u) => { f.part([[-0.07 * u, 0.04 * u], [0.07 * u, 0.04 * u], [0.06 * u, 0.24 * u], [-0.06 * u, 0.24 * u]], { fill: '#2a2826', shade: 0.4, inkW: 1.4 }); f.raw('<g class="em">'); f.flat([[-0.045 * u, 0.07 * u], [0.045 * u, 0.07 * u], [0.04 * u, 0.21 * u], [-0.04 * u, 0.21 * u]], '#ffd486'); f.raw('</g>'); for (const x of [-0.02, 0.02]) f.line([[x * u, 0.07 * u], [x * u, 0.21 * u]], 1.6, '#1a1816'); f.part([[-0.09 * u, 0.04 * u], [0, -0.02 * u, 1], [0.09 * u, 0.04 * u]], { fill: '#2a2622', shade: 0.3, inkW: 1.2, cast: false }); f.part([[-0.08 * u, 0.24 * u], [0.08 * u, 0.24 * u], [0.06 * u, 0.28 * u], [-0.06 * u, 0.28 * u]], { fill: '#2a2622', shade: 0.3, inkW: 1.1, cast: false }); }, { tag: false });
  addLight(-1.55, 2.3, 4.95, 0.95, 4.5, [1.0, 0.68, 0.36]);
  layer('fx'); raw(glow(...P(-1.55, 2.25, 5.0), K(5) * 1.0, K(5) * 0.9, '#ffb060', 0.4)); layer('bg');
});
// the floor: soot trodden in from the forge, scale and slag round the anvil and the hearth, a wet patch from the trough
{
  let o = '';
  for (let i = 0; i < 9; i++) o += S.stain(...P(1.6 + R() * 2.6, 0, 6.4 + R() * 1.4), K(7) * (0.25 + R() * 0.3), '#0a0806', 0.3);
  for (let i = 0; i < 6; i++) o += S.stain(...P(ANVIL.X + (R() - 0.5) * 1.2, 0, ANVIL.Z + 0.1 + (R() - 0.5) * 0.6), K(4.6) * (0.15 + R() * 0.2), '#0e0a08', 0.3);
  o += S.stain(...P(-3.0, 0, 4.4), K(4.4) * 0.45, '#0a0c10', 0.4);
  for (let i = 0; i < 90; i++) { const X = (R() - 0.5) * 4 + (i < 45 ? ANVIL.X : 2.6), Z = (i < 45 ? ANVIL.Z + 0.2 : 7.0) + (R() - 0.5) * 1.4, [x, y] = P(X, 0, Z), r = K(Z) * (0.008 + R() * 0.02); o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.4)}" ry="${f1(r * 0.6)}" fill="${R() < 0.3 ? '#3a2a20' : '#14100c'}" stroke="${INK}" stroke-width="0.4"/>`; }
  raw(PLW(FLOOR, o));
  DR.drift(I.atF, 0.5, 4.5, 0.8, 1.8, { base: '#2e2820', cols: ['#4a4038', '#3a3028', '#5a4a3a'], len: 0.08 });
}

// ================================================================== FG (in front of the keeper)
layer('fg');
// ---- the anvil on its elm stump: the panel object. A billet cooling on the face, a hammer laid across the heel.
{
  const { X: AX, Z: AZn } = ANVIL, base = 0.52;
  const prof = [[-0.32, 0], [0.36, 0], [0.32, 0.06], [0.17, 0.1], [0.15, 0.22], [0.22, 0.27], [0.45, 0.28], [0.46, 0.38], [-0.18, 0.38], [-0.27, 0.375], [-0.52, 0.34], [-0.66, 0.31], [-0.5, 0.29], [-0.24, 0.25], [-0.15, 0.2], [-0.13, 0.11], [-0.25, 0.07]];
  const at = (u, v, dz = 0) => [AX + u, base + v, AZn + dz];
  prop(AZn, () => {
    raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(AX - 0.66, AX + 0.46, 0, base + 0.38, AZn - 0.05, AZn + 0.3), [0, 1, 0], 0), AZn, { op: 0.35 })));
    // the stump: a squat elm round, iron-banded, split and scorched
    figProp(AX - 0.02, 0, AZn + 0.15, (f, u) => { const r = 0.34 * u, h = base * u; f.part([[-r, 0.02 * u, 1], [-r * 1.02, -h * 0.5], [-r * 0.96, -h, 1], [r * 0.96, -h, 1], [r * 1.02, -h * 0.5], [r, 0.02 * u, 1]], { fill: '#4e3c2c', shade: 0.45, tex: PR.T(f, 'wood'), texOp: 0.4, k: 0.3 }); for (const k of [0.25, 0.8]) { f.line([[-r, -h * k], [0, -h * k + 0.03 * u], [r, -h * k]], 3.6, '#1a120c'); f.line([[-r, -h * k], [0, -h * k + 0.03 * u], [r, -h * k]], 2, '#3a3836'); } f.line([[r * 0.3, -h], [r * 0.25, -h * 0.5], [r * 0.32, -h * 0.3]], 1.4, '#1a120c'); f.flat([[-r * 0.8, -h * 0.95], [-r * 0.2, -h * 0.98], [-r * 0.5, -h * 0.7]], '#0a0604', { op: 0.4 }); f.part(ell([0, -h], r * 0.96, 0.07 * u, 0, 18), { fill: '#3a2c20', shade: 0.3, inkW: 1.6, cast: false, hatch: false }); });
    // the anvil: its top face from above, the side of the horn, the profile; worn bright along the face, pitted, a hardy hole
    const topQ = [at(-0.18, 0.38), at(0.46, 0.38), at(0.46, 0.38, 0.24), at(-0.18, 0.38, 0.24)];
    raw(PLW([topQ[0], topQ[1], topQ[3]], cel(topQ.map(p => P(...p)), { Z: AZn, fill: '#6a6866', band: 2 }) + (() => { const A = P(...at(-0.1, 0.38, 0.06)), B = P(...at(0.4, 0.38, 0.06)); return `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#d8d8d4" stroke-width="2" opacity="0.5"/>`; })()));
    raw(cel([at(-0.18, 0.38), at(-0.18, 0.38, 0.24), at(-0.62, 0.32, 0.12)].map(p => P(...p)), { Z: AZn, fill: '#4a4846', band: 1.5 }));
    const ps = prof.map(([u, v]) => P(...at(u, v)));
    raw(PLW([at(0, 0), at(1, 0), at(0, 1)], cel(ps, { Z: AZn, fill: '#3c3a3a', tex: 'url(#mottle)', texOp: 0.4, band: K(AZn) * 0.04 }) + hatch3((u, v) => at(-0.3 + u, v), 0, 0.7, 0, 0.24, 0.8, { op: 0.45 }) +
      (() => { const A = P(...at(-0.55, 0.335)), B = P(...at(-0.2, 0.37)), C = P(...at(0.44, 0.375)); return `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} L${f1(C[0])} ${f1(C[1])}" stroke="#c8c8c4" stroke-width="1.6" opacity="0.55" fill="none"/>`; })() +
      S.stain(...P(...at(0.0, 0.12)), K(AZn) * 0.12, '#5a2a14', 0.35) + `<circle cx="${f1(P(...at(0.36, 0.33))[0])}" cy="${f1(P(...at(0.36, 0.33))[1])}" r="${f1(K(AZn) * 0.018)}" fill="#0a0808"/>`));
    // the billet: a bar of steel still glowing dull orange, scale lifting off it
    figProp(...at(0.11, 0.4, 0.12), (f, u) => { f.raw('<g class="em">'); f.part([[-0.19 * u, -0.012 * u], [0.19 * u, -0.022 * u], [0.19 * u, 0.012 * u], [-0.19 * u, 0.02 * u]], { fill: '#e8602a', light: '#ffc070', shade: 0.25, inkW: 1.4, cast: false, hatch: false }); f.line([[-0.15 * u, -0.004 * u], [0.14 * u, -0.012 * u]], 2, '#ffd890', { op: 0.9 }); f.raw('</g>'); for (let k = 0; k < 5; k++) f.flat(ell([(-0.15 + k * 0.07) * u, 0.0], 2.4, 1.4, 0, 6), '#3a1a0c', { op: 0.7 }); }, { tag: false });
    addLight(AX + 0.1, base + 0.55, AZn - 0.1, 0.95, 3.2, [1.0, 0.5, 0.2]);
    layer('fx'); raw(glow(...P(...at(0.11, 0.42, 0.12)), K(AZn) * 0.45, K(AZn) * 0.3, '#ff7a2a', 0.45)); layer('fg');
    // a hand hammer laid across the heel, its haft toward us
    figProp(...at(0.3, 0.4, 0.0), (f, u) => { f.line([[0, 0], [-0.12 * u, 0.07 * u]], 5.4, '#1a120c'); f.line([[0, 0], [-0.12 * u, 0.07 * u]], 3.6, '#6a4a2a'); f.part([[-0.05 * u, -0.05 * u], [0.06 * u, -0.05 * u], [0.06 * u, 0.0], [-0.05 * u, 0.0]].map(p => [p[0], p[1], 1]), { fill: IRON, light: '#8a8a88', shade: 0.4, inkW: 1.4, cast: false }); }, { tag: false });
  });
  HOT.anvil = { label: 'The anvil', poly: [P(AX - 0.38, 0, AZn + 0.15), P(AX + 0.34, 0, AZn + 0.15), P(AX + 0.48, base + 0.4, AZn), P(AX - 0.68, base + 0.4, AZn)].map(q => q.map(v => +v.toFixed(1))) };
  const dz = -0.12, up = ([u, v]) => [u, v > 0.36 ? v + 0.05 : v];
  const loop = [[AX - 0.36, 0, AZn + dz], [AX - 0.34, base, AZn + dz], ...prof.slice(13, 17).reverse().map(([u, v]) => at(u, v, dz)), ...prof.slice(5, 13).reverse().map(q => { const [u, v] = up(q); return at(u, v, dz); }), ...prof.slice(2, 5).reverse().map(([u, v]) => at(u, v, dz)), [AX + 0.32, base, AZn + dz], [AX + 0.33, 0, AZn + dz]];
  outline('anvil', [[loop, true]]);
}
// a chain and hook for lifting, hung from a ring in the vault
prop(3.8, () => {
  const [tx, ty] = P(-0.95, Yv(-0.95), 3.8), [bx, by] = P(-0.95, 1.95, 3.8), s = K(3.8);
  let o = ''; for (let y = ty; y < by; y += s * 0.055) { const odd = Math.round((y - ty) / (s * 0.055)) % 2; o += odd ? `<rect x="${f1(bx - s * 0.008)}" y="${f1(y)}" width="${f1(s * 0.016)}" height="${f1(s * 0.06)}" rx="2" fill="#4a4644" stroke="${INK}" stroke-width="1.4"/>` : `<ellipse cx="${f1(bx)}" cy="${f1(y + s * 0.03)}" rx="${f1(s * 0.018)}" ry="${f1(s * 0.032)}" fill="none" stroke="${INK}" stroke-width="${f1(s * 0.012 + 1.5)}"/><ellipse cx="${f1(bx)}" cy="${f1(y + s * 0.03)}" rx="${f1(s * 0.018)}" ry="${f1(s * 0.032)}" fill="none" stroke="#5a5654" stroke-width="${f1(s * 0.008)}"/>`; }
  raw(o);
  figProp(-0.95, 1.95, 3.8, (f, u) => { const pts = [[0, 0], [0.02 * u, 0.08 * u], [-0.02 * u, 0.14 * u], [-0.08 * u, 0.12 * u], [-0.1 * u, 0.07 * u]]; f.line(pts, 0.03 * u + 3, '#1a120c'); f.line(pts, 0.03 * u, '#4a4644'); f.line([[0.0, 0.02 * u], [0.015 * u, 0.08 * u]], 1.2, '#8a8a86', { op: 0.6 }); }, { tag: false });
});
// a dented breastplate on the floor before the anvil, waiting its turn; a leather bucket of slack water; a stool
prop(4.15, () => {
  figProp(-1.05, 0.02, 4.15, (f, u) => { f.part([[-0.22 * u, 0], [-0.26 * u, -0.1 * u], [-0.12 * u, -0.2 * u], [0.1 * u, -0.21 * u], [0.25 * u, -0.12 * u], [0.22 * u, 0]], { fill: STEELD, light: '#a8acb0', shade: 0.45, inkW: 1.8 }); f.line([[-0.12 * u, -0.16 * u], [0, -0.2 * u], [0.12 * u, -0.15 * u]], 1.6, '#d8d8d8', { op: 0.5 }); f.line([[-0.02 * u, -0.2 * u], [0, 0]], 1.2, '#14100c'); f.flat([[0.07 * u, -0.07 * u], [0.13 * u, -0.08 * u], [0.14 * u, -0.04 * u], [0.08 * u, -0.03 * u]], '#4a2410', { op: 0.5 }); f.line([[0.06 * u, -0.12 * u], [0.09 * u, -0.08 * u], [0.07 * u, -0.04 * u]], 1.4, '#14100c'); });
  figProp(1.95, 0, 4.05, (f, u) => { const w = 0.14 * u, h = 0.3 * u; f.part([[-w, -h], [w, -h], [w * 0.85, 0], [-w * 0.85, 0]], { fill: '#4a3020', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.line([[-w * 0.95, -h * 0.8], [w * 0.95, -h * 0.8]], 2, '#2a2826'); f.part(ell([0, -h], w, 0.03 * u, 0, 14), { fill: '#141a1e', shade: 0.2, inkW: 1.6, cast: false, hatch: false }); f.line([[-w, -h], [0, -h - 0.2 * u], [w, -h]], 2.6, '#1a120c'); });
  figProp(-0.75, 0, 3.95, (f, u) => { for (const k of [-1, 0.2, 1]) { f.line([[k * 0.1 * u, -0.45 * u], [k * 0.2 * u, 0]], 5, '#1a120c'); f.line([[k * 0.1 * u, -0.45 * u], [k * 0.2 * u, 0]], 3, WOOD); } f.part(ell([0, -0.46 * u], 0.15 * u, 0.04 * u, 0, 14), { fill: mix(WOOD, '#8a7a60', 0.2), shade: 0.35, inkW: 1.6, tex: PR.T(f, 'wood'), texOp: 0.5 }); });
});
// near left: a cut-down cask full of scrap and broken blades waiting for the fire
prop(2.9, () => {
  figProp(-1.75, 0, 2.9, (f, u) => {
    const w = 0.32 * u, h = 0.56 * u;
    PR.barrel(f, 0, w, h, '#5a4430');
    // the open top: the dark inside, then the scrap standing in it, then the near half of the rim over their feet
    f.part(ell([0, -h], w * 0.96, 0.065 * u, 0, 18), { fill: '#120c08', shade: 0.2, inkW: 1.6, cast: false, hatch: false });
    for (let i = 0; i < 11; i++) { const bx = -w * 0.7 + f.r() * w * 1.4, ang = (f.r() - 0.5) * 0.8, l = (0.3 + f.r() * 0.45) * u, tx = bx + Math.sin(ang) * l, ty = -h - Math.cos(ang) * l * 0.9, bw = (0.016 + f.r() * 0.018) * u, y0 = -h + 0.02 * u;
      if (f.r() < 0.2) { f.line([[bx, y0], [tx, ty]], bw * 2.2 + 2, '#1a120c'); f.line([[bx, y0], [tx, ty]], bw * 2.2, '#3a3430'); continue; }
      f.part([[bx - bw, y0], [tx - bw * 0.6, ty + bw], [tx + (f.r() - 0.5) * bw * 3, ty - bw * (f.r() < 0.5 ? 0 : 2), 1], [tx + bw * 0.6, ty + bw], [bx + bw, y0]], { fill: mix(STEELD, '#2a2622', f.r() * 0.5), light: '#c8ccd0', shade: 0.4, inkW: 1.3, cast: false });
      if (f.r() < 0.5) { const m = [bx + (tx - bx) * (0.3 + f.r() * 0.4), y0 + (ty - y0) * (0.3 + f.r() * 0.4)]; f.flat([[m[0] - bw * 0.6, m[1]], [m[0] + bw * 0.5, m[1] - bw], [m[0] + bw * 0.7, m[1] + bw * 1.2], [m[0] - bw * 0.4, m[1] + bw * 1.6]], '#4a2410', { op: 0.6 }); }
      if (f.r() < 0.35) { f.line([[bx - 0.05 * u, y0 - 0.06 * u], [bx + 0.05 * u, y0 - 0.065 * u]], 0.02 * u + 2, '#1a120c'); f.line([[bx - 0.05 * u, y0 - 0.06 * u], [bx + 0.05 * u, y0 - 0.065 * u]], 0.02 * u, '#5a5650'); } }
    const rim = ell([0, -h], w * 0.98, 0.07 * u, 0, 24).filter(p => p[1] >= -h - 0.5);
    f.line(rim, 5, '#1a120c'); f.line(rim, 3, '#6a5238');
  });
});
// near right: the coal heap spilling from a split sack, a shovel driven into it, blue glints in the coal
prop(3.0, () => {
  figProp(1.85, 0, 3.0, (f, u) => {
    const pts = [[-0.85 * u, 0.01 * u]]; for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([(-0.82 + 1.6 * t) * u, -(Math.sin(t * Math.PI) * 0.32 * (0.85 + f.r() * 0.3)) * u]); } pts.push([0.82 * u, 0.01 * u]);
    f.part(pts, { fill: '#1c1a1a', light: '#3a3838', shade: 0.4, inkW: 2 });
    f.raw('<g class="em">'); for (let k = 0; k < 7; k++) f.flat(ell([(-0.6 + f.r() * 1.2) * u, -f.r() * 0.22 * u], 1.6 + f.r() * 1.5, 1.6 + f.r() * 1.2, 0, 6), f.r() < 0.5 ? '#a8d0ff' : '#e8f6ff'); f.raw('</g>');
    for (let k = 0; k < 50; k++) { const t = f.r(), x = (-0.75 + 1.5 * t) * u, y = -f.r() * Math.sin(t * Math.PI) * 0.28 * u; f.part(ell([x, y], 4 + f.r() * 6, 3 + f.r() * 4, f.r() * 3, 6), { fill: f.r() < 0.06 ? '#4a6890' : f.r() < 0.5 ? '#2e2c2c' : '#121010', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); }
    f.part([[0.4 * u, 0], [0.75 * u, -0.02 * u], [0.8 * u, -0.18 * u], [0.55 * u, -0.22 * u]], { fill: '#5a4a34', tex: PR.T(f, 'weave'), texOp: 0.6, shade: 0.4 });
    f.line([[-0.1 * u, -0.25 * u], [-0.35 * u, -1.15 * u]], 0.035 * u + 3, '#1a120c'); f.line([[-0.1 * u, -0.25 * u], [-0.35 * u, -1.15 * u]], 0.035 * u, '#6a4a2a');
    f.line([[-0.42 * u, -1.15 * u], [-0.28 * u, -1.12 * u]], 0.03 * u + 2, '#1a120c');
    f.part([[-0.22 * u, -0.29 * u], [0.02 * u, -0.27 * u], [0.0, -0.13 * u], [-0.2 * u, -0.14 * u]].map(p => [p[0], p[1], 1]), { fill: IRON, light: '#7a7a78', shade: 0.4, inkW: 2, cast: false });
  });
  addLight(2.5, 0.3, 2.9, 0.12, 1.4, [0.6, 0.8, 1.0]);
});
// scale, slag and bar ends kicked about the front of the floor; a second chain hanging into the near left
prop(3.6, () => {
  let o = ''; for (let i = 0; i < 50; i++) { const X = -1.4 + R() * 4.2, Z = 2.7 + R() * 1.6, [x, y] = P(X, 0, Z), r = K(Z) * (0.008 + R() * 0.018), k = R(); o += k < 0.6 ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.6)}" ry="${f1(r * 0.6)}" fill="${R() < 0.5 ? '#2a2420' : '#3a2a20'}" stroke="${INK}" stroke-width="0.6"/>` : `<path d="M${f1(x)} ${f1(y)} l${f1(r * 4)} ${f1(-r * 0.6)}" stroke="${INK}" stroke-width="${f1(r * 1.2 + 1.2)}" stroke-linecap="round"/><path d="M${f1(x)} ${f1(y)} l${f1(r * 4)} ${f1(-r * 0.6)}" stroke="#4a4644" stroke-width="${f1(r * 1.2)}" stroke-linecap="round"/>`; }
  raw(PLW(FLOOR, o));
});

// ================================================================== write (the smithy has no mid layer, as in grim)
I.write(KEEPER, {}, OUT, { layers: ['bg', 'fg'], drawOrder: ['bg', 'keeper', 'fg'], veil: { op: 0.5, cut: 0.3 } });
// the keeper entry as grim's contract has it: the scene's own placement fields (X, Z, h, label) are not written
{ const fs = require('fs'), hp = path.join(OUT, 'smithy_hotspots.json'), J = JSON.parse(fs.readFileSync(hp, 'utf8')); for (const k of ['X', 'Z', 'h', 'label']) delete J.keeper[k]; fs.writeFileSync(hp, JSON.stringify(J, null, 1)); }
