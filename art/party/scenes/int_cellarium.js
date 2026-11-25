// The Cellarium in Living Ink. Same room as grim/int_cellarium.js: same camera, room box (11 x 9 x 4.2, a barrel vault
// springing at 2.7 m with transverse ribs at 6.2 and 3.9), door (arched, in the right wall: the cellarium's garth door faces
// east), keeper spot, hotspots (exit, tally, keeper), the five lights in grim's order and values, draw order bg/keeper/mid/fg.
// Godric's stores under the west range: a cold vault of uneven ashlar, casks racked two high along the back wall (big tuns,
// small kegs, one tapped with its cup under the spigot, gaps where stock went out), candles counted onto a rack at the left with
// new ones hung by their joined wicks to harden, sacks of grain heaped, hams, onions, garlic, dried fish and a sausage string
// hung from the vault, loaves on a board slung out of the rats' reach. Godric stands hugging his candles beside the tally
// board (the panel), where every candle and loaf is notched on a stick.
// Deliberate change from grim, for the Living Ink keeper: the tally board stands 0.75 m to the right (x -0.9..0.3, was
// -1.65..-0.45; same size and height) so the one good finger of Godric's far hand, which his figure lays on the board's edge,
// reaches it. Its click polygon follows. The tally candle's light stays at grim's place: the candle stands on a keg there.
// Usage: node scenes/int_cellarium.js [outDir]   (default out/scenes/hub/cellarium)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'cellarium');
const I = require('./int_shell')('cellarium', { width: 11, depth: 9, height: 4.2, vault: true, spring: 2.7, wall: '#4e483e', wall2: '#555046', vaultCol: '#48423a', floorCol: '#3a342c', floor: 'stone', stone: 'ashlar', seed: 5813, panel: 'tally', ribs: [6.2, 3.9],
  vaultPlan: [1.3, 0.55, 1.0, 0.42, 1.25, 0.8, 0.5, 1.1, 0.65],
  wallOpts: { dampCol: '#2a2a20', rough: true, courses: [1.1, 0.45, 0.8, 1.3, 0.38, 0.38, 0.95, 0.6, 1.2, 0.5, 0.75], wscale: 0.6 },
  floorOpts: { courses: [1.0, 0.5, 0.85, 1.3, 0.45, 0.95, 0.6, 1.15], wscale: 0.6 } });
const S = I;
const { P, K, pp, p2, f1, INK, raw, layer, PLW, cel, hatch3, mix, hot, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell, add } = E;
const DR = require('./dress_li')(I);
const H = require('./props_hub')(I);
const WOOD = '#4a3624', WOODL = '#6a5034', WAX = KK.P.wax, WAXD = KK.P.waxD;
const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];
const KEEPER = { X: 0.6, Z: 4.45, h: (790 - 196) / (640 / 1.75), sprite: 'godric', label: 'Godric', figure: [196, 790], flip: true };
const TB = { x0: -0.9, x1: 0.3, z: 4.2, y0: 0.8, y1: 1.85 };
const fxL = s => { const l = S.curLayer(); layer('fx'); raw(s); layer(l); };
const Yv = I.Yv;

// ---- a cask seen end on: the head of boards inside the chime, the stave ends round it, iron hoops, a bung, chalk marks; o.tap
function caskHead(X, Y, Z, r, o = {}) {
  figProp(X, Y, Z, (f, u) => {
    const R0 = r * u, col = o.col || mix('#5a4430', f.r() < 0.5 ? '#7a5a3a' : '#3a2a1a', f.r() * 0.5);
    f.part(ell([0, 0], R0, R0, 0, 30), { fill: mix(col, '#000', 0.25), shade: 0.45, inkW: 1.8, tex: PR.T(f, 'wood'), texOp: 0.4 });
    const n = Math.max(10, Math.round(r * 46)); for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2; f.line([[Math.cos(a) * R0 * 0.82, Math.sin(a) * R0 * 0.82], [Math.cos(a) * R0, Math.sin(a) * R0]], 1, '#140c06', { op: 0.7 }); }
    f.part(ell([0, 0], R0 * 0.8, R0 * 0.8, 0, 26), { fill: col, light: mix(col, '#c8a878', 0.3), shade: 0.4, inkW: 1.2, cast: false, tex: PR.T(f, 'wood'), texOp: 0.5 });
    for (const d of [-0.42, -0.14, 0.15, 0.44]) { const h = Math.sqrt(Math.max(0, 0.64 - d * d)) * R0; f.line([[d * R0, -h], [d * R0, h]], 1.1, '#140c06', { op: 0.7 }); }
    f.line(ell([0, 0], R0 * 0.94, R0 * 0.94, 0, 30).concat([ell([0, 0], R0 * 0.94, R0 * 0.94, 0, 30)[0]]), Math.max(2.4, R0 * 0.07), '#2e2c2a');
    f.line(ell([0, 0], R0 * 0.94, R0 * 0.94, 0, 30).slice(14, 24), 1, '#8a8680', { op: 0.5 });
    if (f.r() < 0.7) f.flat(ell([R0 * (f.r() - 0.5), R0 * 0.85], R0 * 0.18, R0 * 0.06, 0, 8), '#5a2a14', { op: 0.5 });
    // chalk: a tally and a mark of what is in it
    if (f.r() < 0.75) { const cx = -R0 * 0.3, cy = -R0 * 0.25; for (let k = 0; k < 2 + Math.floor(f.r() * 4); k++) f.line([[cx + k * R0 * 0.08, cy], [cx + k * R0 * 0.08, cy + R0 * 0.18]], 1.1, '#e0dccc', { op: 0.6 }); f.line([[cx - R0 * 0.04, cy + R0 * 0.16], [cx + R0 * 0.3, cy + R0 * 0.02]], 1.1, '#e0dccc', { op: 0.5 }); }
    f.flat(ell([R0 * 0.22, R0 * 0.25], R0 * 0.06, R0 * 0.06, 0, 8), '#1a120c', { op: 0.8 });
    if (o.tap) { f.part([[-R0 * 0.06, R0 * 0.5], [R0 * 0.06, R0 * 0.5], [R0 * 0.05, R0 * 0.8], [-R0 * 0.05, R0 * 0.8]], { fill: '#6a5034', shade: 0.35, inkW: 1.1, cast: false }); f.part([[-R0 * 0.03, R0 * 0.78], [R0 * 0.03, R0 * 0.78], [R0 * 0.025, R0 * 0.95], [-R0 * 0.025, R0 * 0.95]], { fill: '#5a4430', shade: 0.3, inkW: 1, cast: false }); f.flat(ell([0, R0 * 1.0], 1.6, 2.4, 0, 6), '#3a1a10', { op: 0.8 }); }
  }, { tag: false });
}
// ---- a bundle of candles tied with a cord: standing (n of them, uneven lengths) or lying
function candleBundle(X, Y, Z, o = {}) {
  figProp(X, Y, Z, (f, u) => {
    if (o.lay) { for (let k = 0; k < 5; k++) { const y = -0.012 * u - (k % 2) * 0.02 * u - Math.floor(k / 2) * 0.012 * u, x = (k % 2 ? 0.01 : 0) * u; f.part([[-0.14 * u + x, y - 0.011 * u], [0.13 * u + x, y - 0.011 * u], [0.14 * u + x, y + 0.009 * u], [-0.14 * u + x, y + 0.009 * u]], { fill: mix(WAX, '#fff4e0', f.r() * 0.3), shadow: WAXD, shade: 0.35, inkW: 0.8, cast: false, hatch: false }); } f.line([[-0.03 * u, -0.06 * u], [-0.03 * u, 0]], 2.2, KK.P.rope); return; }
    const n = o.n || 5;
    for (let k = 0; k < n; k++) { const x = (k - (n - 1) / 2) * 0.022 * u, h = (0.16 + f.r() * 0.1) * u; f.part([[x - 0.01 * u, 0], [x + 0.01 * u, 0], [x + 0.009 * u, -h], [x, -h - 0.004 * u], [x - 0.009 * u, -h]], { fill: mix(WAX, '#fff4e0', f.r() * 0.3), shadow: WAXD, shade: 0.35, inkW: 0.8, cast: false, hatch: false }); f.line([[x, -h - 0.004 * u], [x + 0.002 * u, -h - 0.014 * u]], 0.8, '#1a120c'); }
    f.line([[-(n / 2) * 0.022 * u, -0.06 * u], [(n / 2) * 0.022 * u, -0.06 * u]], 2.4, KK.P.rope);
  }, { tag: false });
}
// ---- stores hung from the vault on a cord: ham, onions, garlic, dried fish, sausage
function hanging(X, Z, kind) {
  const top = Yv(X) - 0.02, drop = 0.35 + R() * 0.4, Y = top - drop;
  raw(I.rod([X, top, Z], [X, Y, Z], '#8a7a56', 0.9));
  figProp(X, Y, Z, (f, u) => {
    if (kind === 'ham') { f.line([[0, 0], [0, 0.04 * u]], 1.6, '#8a7a56'); f.part([[-0.03 * u, 0.04 * u], [0.03 * u, 0.04 * u], [0.1 * u, 0.2 * u], [0.12 * u, 0.36 * u], [0.04 * u, 0.44 * u], [-0.06 * u, 0.42 * u], [-0.12 * u, 0.3 * u], [-0.08 * u, 0.16 * u]], { fill: f.r() < 0.5 ? '#7a3a24' : '#6a4a2a', light: '#a86a4a', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.6 }); f.line([[-0.05 * u, 0.36 * u], [0.06 * u, 0.4 * u]], 1.4, '#e0c8a0', { op: 0.6 }); f.flat(ell([-0.02 * u, 0.25 * u], 0.04 * u, 0.06 * u, 0.3, 8), '#3a1a10', { op: 0.4 }); f.line([[-0.03 * u, 0.06 * u], [0.03 * u, 0.1 * u]], 2, '#8a7a56'); }
    else if (kind === 'onions' || kind === 'garlic') { const c = kind === 'onions' ? ['#9a6a3a', '#b8844a', '#8a5a2a'] : ['#d8ccb0', '#c8bca0', '#e0d8c4'], rr = kind === 'onions' ? 0.035 : 0.026; f.line([[0, 0], [0.01 * u, 0.5 * u]], 2, '#8a7a56'); for (let k = 0; k < 11; k++) { const y = (0.06 + k * 0.04) * u, x = (k % 2 ? 0.03 : -0.03) * u * (1 - k / 14); f.part(ell([x, y], rr * u, rr * 1.1 * u, 0, 10), { fill: c[k % 3], shade: 0.4, inkW: 0.9, cast: false }); f.line([[x, y - rr * u], [x + 0.005 * u, y - rr * 1.6 * u]], 0.8, '#6a5a3a'); } }
    else if (kind === 'fish') { f.line([[0, 0], [0, 0.03 * u]], 1.4, '#8a7a56'); for (let k = 0; k < 4; k++) { const x = (k - 1.5) * 0.04 * u, l = (0.28 + f.r() * 0.1) * u; f.part([[x - 0.015 * u, 0.03 * u], [x + 0.015 * u, 0.03 * u], [x + 0.03 * u, l * 0.5], [x + 0.01 * u, l * 0.9], [x + 0.03 * u, l], [x - 0.03 * u, l], [x - 0.01 * u, l * 0.9], [x - 0.03 * u, l * 0.5]], { fill: '#8a8270', light: '#b8b09a', shade: 0.4, inkW: 1, cast: false, tex: PR.T(f, 'mottle'), texOp: 0.5 }); } }
    else { const pts = []; for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push([Math.sin(t * Math.PI * 3) * 0.06 * u, t * 0.45 * u]); } f.line(pts, 9, '#1a120c'); f.line(pts, 6.4, '#6a2a1a'); for (let k = 2; k < 16; k += 3) f.line([[pts[k][0] - 3, pts[k][1]], [pts[k][0] + 3, pts[k][1]]], 1.2, '#2a1a10'); f.line(pts, 1.2, '#a8644a', { op: 0.5 }); }
  }, { tag: false });
}

I.shell();
I.door(6.7, 7.7, { side: 1, ts: 1.95 });                                          // light 1

// ------------------------------------------------------------------ the walls worn: damp in the vault's feet, saltpetre bloom, cracks from the
// rib springers, soot over the lantern, nails with things on them
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, { bloom: [[0.6, 0.4, 1.2, 0.6], [10.4, 0.5, 1.0, 0.7], [5.6, 3.6, 1.6, 0.5]], bloomCol: '#5a5a46', cracks: [[2.2, 3.1, 1.0, 2.0], [8.6, 3.0, 0.9, 1.1], [1.0, 0.1, 0.9, 1.3]], patches: [[9.6, 1.6, 0.8, 0.6, '#5e584c', true]] });
  for (const [at] of [[I.atL], [I.atR]]) I.wear(at, [at(0, 0), at(1, 0), at(0, 1)], { bloom: [[1.2, 0.4, 1.8, 0.6], [5.6, 0.5, 1.2, 0.6]], bloomCol: '#5a5a46', cracks: [[3.4, 2.6, 1.0, 2.1]] });
  DR.nailHang(-HW + 0.01, 2.0, 4.6, 'rope');
}
// ------------------------------------------------------------------ the cask racks along the back wall, two tiers
{
  const z = D1 - 0.55, zc = z - 0.4;
  prop(z, () => {
    for (const X of [-3.75, -1.75, 0.55, 2.95, 4.9]) I.woodBox(X - 0.07, X + 0.07, 0, 2.1, zc - 0.06, zc + 0.06, mix(WOOD, '#000', 0.1), { knots: 0.2, cast: false, boards: 1, segs: 1 });
    for (const Y of [0.1, 1.05]) I.woodFace([[-3.82, Y + 0.13, zc - 0.08], [4.97, Y + 0.13, zc - 0.08], [4.97, Y, zc - 0.08], [-3.82, Y, zc - 0.08]], mix(WOOD, '#2a1e14', R() * 0.3), { boards: 1, knots: 0.6, segs: 3 });
    for (const [X, r, o] of [[-3.25, 0.47], [-2.27, 0.41], [-1.2, 0.46, { tap: true }], [0.0, 0.44], [1.06, 0.4], [2.42, 0.47], [3.52, 0.43], [4.45, 0.32]]) caskHead(X, 0.23 + r, zc - 0.12, r, o || {});
    for (const [X, r] of [[-3.25, 0.31], [-2.62, 0.3], [-1.55, 0.43], [0.42, 0.45], [1.42, 0.3], [2.05, 0.31], [3.1, 0.46]]) caskHead(X, 1.18 + r, zc - 0.12, r);
    // the empty berth at the top right: a crock and a candle end left on the cradle (lit)
    figProp(4.2, 1.18, zc - 0.12, (f, u) => H.crock(f, u), { tag: false });
    H.candles(4.6, zc - 0.12, 1, 1.18, 0.05);                                          // light 2
    // the tapped cask's cup on the floor under its spigot, the wet spreading out from it
    raw(PLW(FLOOR, S.stain(...P(-1.0, 0, zc - 0.35), K(zc) * 0.22, '#1a0a06', 0.5)));
    figProp(-1.0, 0, zc - 0.35, (f, u) => PR.cup(f, 0, 0.1 * u, '#6a5a48'), { tag: false });
  });
  // at the rack's foot: a stack of cheese wheels, crocks, bottles
  prop(7.55, () => {
    figProp(1.75, 0, 7.55, (f, u) => { for (let k = 0; k < 3; k++) { f.raw(`<g transform="translate(${f1((f.r() - 0.5) * 4)},${f1(-k * 0.065 * u)})">`); PR.cheese(f, 0, (0.28 - k * 0.025) * u); f.raw('</g>'); } }, { tag: false });
    figProp(2.4, 0, 7.6, (f, u) => H.crock(f, u)); figProp(2.62, 0, 7.45, (f, u) => H.crock(f, u, '#6a5a48'));
    figProp(-2.8, 0, 7.55, (f, u) => H.bottle(f, u, '#3a5a2a')); figProp(-2.62, 0, 7.5, (f, u) => H.bottle(f, u));
  });
}
// ------------------------------------------------------------------ the candle rack on the left: three shelves stocked unevenly, dipping rods
// under them with pairs of new candles hung by their joined wicks to harden
prop(6.0, () => {
  const x0 = -5.45, x1 = -4.1, z0 = 6.0, z1 = 6.5;
  for (const X of [x0 + 0.05, x1 - 0.05]) I.woodBox(X - 0.05, X + 0.05, 0, 1.95, z0 - 0.05, z0 + 0.05, mix(WOOD, '#000', 0.1), { knots: 0.2, cast: false, boards: 1, segs: 1 });
  const stock = [[{ X: -5.28, n: 7 }, { X: -5.0, n: 5 }, { X: -4.7, lay: true }, { X: -4.35, n: 4 }], [{ X: -5.3, n: 3 }, { X: -5.1, n: 8 }, { X: -4.6, box: true }, { X: -4.25, n: 6 }], [{ X: -5.25, n: 5 }, { X: -4.95, lay: true }, { X: -4.55, crock: true }, { X: -4.3, n: 9 }]];
  [0.5, 1.05, 1.6].forEach((Y, i) => {
    I.woodBox(x0, x1, Y - 0.05, Y, z0, z1, mix(WOODL, '#2a1e14', R() * 0.3), { cast: false, boards: 1, topBoards: 3, segs: 1 });
    for (const it of stock[i]) {
      if (it.box) { I.woodBox(it.X - 0.14, it.X + 0.14, Y, Y + 0.12, z0 + 0.12, z0 + 0.32, '#5a4430', { knots: 0, cast: false, boards: 1, segs: 1 }); figProp(it.X, Y + 0.12, z0 + 0.2, (f, u) => { for (let k = 0; k < 9; k++) { const x = (f.r() - 0.5) * 0.22 * u, h = (0.03 + f.r() * 0.05) * u, a = (f.r() - 0.5) * 0.9; f.raw(`<g transform="rotate(${f1(a * 57)} ${f1(x)} 0)">`); f.part([[x - 0.01 * u, 0], [x + 0.01 * u, 0], [x + 0.01 * u, -h], [x - 0.01 * u, -h]], { fill: mix(WAX, '#8a7a5a', f.r() * 0.4), shade: 0.3, inkW: 0.6, cast: false, hatch: false }); f.raw('</g>'); } }, { tag: false }); }
      else if (it.crock) figProp(it.X, Y, z0 + 0.2, (f, u) => H.crock(f, u), { tag: false });
      else candleBundle(it.X, Y, z0 + 0.15, { n: it.n, lay: it.lay });
    }
    if (i > 0) { const Yr = Y - 0.09; raw(I.rod([x0 + 0.08, Yr, z0 + 0.06], [x1 - 0.08, Yr, z0 + 0.06], WOODL, 3));
      for (let X = x0 + 0.16; X < x1 - 0.12; X += 0.11 + R() * 0.06) { if (R() < 0.2) continue; const l = 0.16 + R() * 0.06;
        figProp(X, Yr, z0 + 0.06, (f, u) => { const cw = 0.022 * u; f.line([[-cw, 3], [0, -3], [cw, 3]], 0.9, INK); for (const d of [-1, 1]) f.part([[d * cw - cw * 0.45, 3], [d * cw + cw * 0.45, 3], [d * cw + cw * 0.3, 3 + l * u], [d * cw, 6 + l * u], [d * cw - cw * 0.3, 3 + l * u]], { fill: mix(WAX, '#fff4e0', f.r() * 0.3), shadow: WAXD, shade: 0.35, inkW: 0.7, cast: false, hatch: false }); }, { tag: false }); } }
  });
});
// ------------------------------------------------------------------ the hanging board out of the rats' reach: loaves round, long and cut, a cheese, a crock
prop(6.0, () => {
  const z = 6.0, Y = 2.0, x0 = 1.0, x1 = 2.8;
  for (const X of [x0 + 0.1, x1 - 0.1]) raw(I.rod([X, Y, z], [X, Yv(X) - 0.05, z], '#3a3026', 1.6));
  I.woodBox(x0, x1, Y - 0.06, Y, z - 0.25, z + 0.25, WOODL, { cast: false, boards: 1, topBoards: 2, segs: 2 });
  figProp(1.2, Y, z, (f, u) => PR.loaf(f, 0, 0.26 * u, '#8a6a3e'), { tag: false });
  figProp(1.62, Y, z + 0.05, (f, u) => PR.loaf(f, 0, 0.4 * u, '#7a5a32'), { tag: false });
  figProp(2.05, Y, z - 0.05, (f, u) => PR.loaf(f, 0, 0.24 * u, '#8a6a3e', { cut: true }), { tag: false });
  figProp(2.38, Y, z, (f, u) => PR.cheese(f, 0, 0.22 * u), { tag: false });
  figProp(2.66, Y, z + 0.08, (f, u) => H.crock(f, u), { tag: false });
});
// ------------------------------------------------------------------ stores hung from the vault
for (const [X, Z, kind] of [[-1.3, 6.3, 'ham'], [-0.6, 6.4, 'onions'], [1.9, 5.3, 'fish'], [-2.9, 5.0, 'saus'], [3.1, 4.6, 'ham'], [-2.2, 6.6, 'garlic'], [4.3, 6.9, 'onions']]) prop(Z, () => hanging(X, Z, kind));
// ------------------------------------------------------------------ the lantern hung from the vault over the tally, and the left lantern
prop(4.3, () => H.lantern(1.35, Yv(1.35) - 0.05, 2.15, 4.3, { light: [1.35, 2.1, 4.25, 1.3, 5.5, [1.0, 0.68, 0.36]] }));   // light 3
prop(5.4, () => H.lantern(-3.6, Yv(-3.6) - 0.02, 1.88, 5.4, { size: 0.8 }));
// ------------------------------------------------------------------ sacks of grain heaped at the left, the top one open; grain spilled
prop(5.75, () => figProp(-4.55, 0, 5.75, (f, u) => PR.sack(f, 0, 0.9 * u, { col: '#7a6a4c' })));
prop(5.6, () => figProp(-3.85, 0, 5.55, (f, u) => PR.sack(f, 0, 0.85 * u, { col: '#6e6248' })));
prop(5.55, () => figProp(-4.2, 0.38, 5.62, (f, u) => { PR.sack(f, 0, 0.8 * u, { col: '#857452' }); f.part([[-0.2 * u, -0.3 * u], [-0.05 * u, -0.42 * u], [0.12 * u, -0.4 * u], [0.24 * u, -0.28 * u], [0.05 * u, -0.26 * u]], { fill: '#b8a060', light: '#d8c890', shade: 0.4, inkW: 1.1, cast: false, tex: PR.T(f, 'mottle'), texOp: 0.6 }); for (let k = 0; k < 14; k++) f.flat(ell([(f.r() - 0.4) * 0.4 * u, -0.3 * u + f.r() * 0.08 * u], 1.6, 1, 0, 5), '#e0d0a0'); }));
prop(5.3, () => figProp(-3.15, 0, 5.3, (f, u) => PR.sack(f, 0, 0.8 * u, { col: '#7a6e50' })));
prop(5.4, () => { let o = ''; for (let k = 0; k < 70; k++) { const [x, y] = P(-2.95 + R() * 0.55 * R(), 0, 5.0 + R() * 0.4); o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.4 + R())}" ry="${f1(0.7 + R() * 0.5)}" fill="${mix('#c8b070', '#8a7040', R() * 0.5)}" stroke="${INK}" stroke-width="0.4"/>`; } raw(PLW(FLOOR, o)); });
// ------------------------------------------------------------------ the floor: straw along the walls, the trodden path to the door
{
  const atF = I.atF;
  for (const [Xc, Zc, w, h] of [[-5.0, 4.5, 0.8, 2.6], [4.9, 4.4, 0.9, 2.0], [0.5, 8.2, 3.5, 0.5]]) DR.drift(atF, Xc + HW, Zc - D0, w, h, { base: '#4a4026' });
}
// the ladder leaned against the rack
prop(5.85, () => {
  raw(I.rod([-0.4, 0, 5.75], [-0.05, 2.55, 6.55], WOOD, 6) + I.rod([0.05, 0, 5.75], [0.4, 2.55, 6.55], WOOD, 6));
  for (let k = 1; k < 8; k++) { const t = k / 8; raw(I.rod([-0.4 + 0.35 * t, 2.55 * t, 5.75 + 0.8 * t], [0.05 + 0.35 * t, 2.55 * t, 5.75 + 0.8 * t], WOODL, 4)); }
  raw(PLW(FLOOR, shadowPoly([P(-0.4, 0, 5.75), P(0.05, 0, 5.75), P(0.9, 0, 6.9), P(0.6, 0, 6.95)], 6, { op: 0.22 })));
});

// ================================================================== MID: nothing stands between Godric and the board; kept empty for the order
layer('mid'); raw('');

// ================================================================== FG: the tally board (the panel), and the near floor
layer('fg');
prop(TB.z, () => {
  const { x0, x1, z, y0, y1 } = TB;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(x0, x1, 0, y1, z - 0.2, z + 0.2), [0, 1, 0], 0), z, { op: 0.28 })));
  raw('<g class="panel">');
  // the trestle: two splayed legs each side
  for (const [X, d] of [[x0 + 0.15, -0.12], [x1 - 0.15, 0.12]]) raw(I.rod([X - d, 0, z + 0.2], [X, y0 + 0.2, z + 0.02], WOOD, 6) + I.rod([X + d, 0, z - 0.2], [X, y0 + 0.2, z - 0.02], WOOD, 6));
  // the board, its ledge, the hazel tally sticks on pegs (a row per store), notched; a chalked count down the side
  I.woodFace([[x0, y1, z], [x1, y1, z], [x1, y0, z], [x0, y0, z]], '#5a4430', { bw: 0.25, stains: 0.5, segs: 1 });
  I.woodBox(x0 - 0.05, x1 + 0.05, y0 - 0.04, y0 - 0.02, z - 0.15, z, WOODL, { cast: false, boards: 1, topBoards: 1, segs: 1 });
  for (let r = 0; r < 2; r++) { const Y = y1 - 0.12 - r * 0.48;
    for (let k = 0; k < 5; k++) { const X = x0 + 0.17 + k * 0.215;
      raw(S.peg(X, Y, z - 0.01, { wood: true }));
      figProp(X, Y - 0.01, z - 0.02, (f, u) => { const len = (0.22 + f.r() * 0.08) * u, w = 0.026 * u; f.part([[-w / 2, 0], [w / 2, 0], [w / 2 + 1, len], [-w / 2 + 1, len + 2]], { fill: '#b8a074', light: '#e0c8a0', shade: 0.35, inkW: 1.1, cast: false, tex: PR.T(f, 'wood'), texOp: 0.4 }); for (let n = 0; n < 3 + Math.floor(f.r() * 6); n++) { const y = 0.03 * u + n * len / 9; f.line([[-w / 2, y], [w * 0.15, y - 1.5]], 1.6, '#1a120a'); } }, { tag: false });
    } }
  { let ch = ''; const s = K(z);
    for (let rr = 0; rr < 8; rr++) { const [cx, cy] = P(x1 - 0.14, y1 - 0.15 - rr * 0.07, z - 0.012); for (let k = 0; k < 4; k++) ch += `<path d="M${f1(cx - s * 0.06 + k * 4)} ${f1(cy)} l0 ${f1(s * 0.05)}" stroke="#e8e0d0" stroke-width="1.5" opacity="${rr < 5 ? 0.8 : 0.45}"/>`; ch += `<path d="M${f1(cx - s * 0.07)} ${f1(cy + s * 0.04)} l${f1(s * 0.08)} ${f1(-s * 0.03)}" stroke="#e8e0d0" stroke-width="1.5" opacity="${rr < 5 ? 0.8 : 0.45}"/>`; }
    raw(PLW([[0, 0, z], [1, 0, z], [0, 1, z]], ch)); }
  raw('</g>');
  hot('tally', 'The tally board', [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);
});
// the keg by the board with the tally candle stood on it (the light at grim's place)
prop(4.12, () => {
  figProp(-1.35, 0, 4.12, (f, u) => PR.barrel(f, 0, 0.17 * u, 0.78 * u, '#4a3a28'));
  H.candles(-1.35, 4.12, 1, 0.78, 0.05, { light: false });
  addLight(-1.35, 1.08, 3.97, 0.17, 2.4, [1.0, 0.74, 0.44]);                       // light 4 (grim's tally candle)
});
// a cask lying on its side on chocks
prop(3.3, () => {
  const X = 2.2, Z = 3.4, r = 0.3, L = 1.05;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - L / 2, X + L / 2, 0, 2 * r, Z - r, Z + r), [0, 1, 0], 0), Z, { op: 0.3 })));
  figProp(X, 0, Z, (f, u) => {
    const l = L / 2 * u, rr = r * u, bl = rr * 0.16, cy = -rr - 0.06 * u, top = x => cy - rr - bl * (1 - (x / l) ** 2), bot = x => cy + rr + bl * (1 - (x / l) ** 2);
    for (const d of [-0.3, 0.3]) f.part([[d * u - 0.09 * u, 0], [d * u + 0.09 * u, 0], [d * u + 0.05 * u, -0.07 * u], [d * u - 0.05 * u, -0.07 * u]].map(p => [p[0], p[1], 1]), { fill: WOOD, shade: 0.4, inkW: 1.2, tex: PR.T(f, 'wood'), texOp: 0.4 });
    const N = 12, up = [], dn = []; for (let k = 0; k <= N; k++) { const x = -l + 2 * l * k / N; up.push([x, top(x)]); dn.push([x, bot(x)]); }
    f.part([...up, ...dn.reverse()], { fill: '#5a4430', light: '#8a6a48', shade: 0.5, tex: PR.T(f, 'wood'), texOp: 0.5 });
    for (let j = 1; j < 6; j++) { const v = -1 + 2 * j / 6, pts = []; for (let k = 0; k <= N; k++) { const x = -l + 2 * l * k / N, t = top(x), b2 = bot(x); pts.push([x, (t + b2) / 2 + v * (b2 - t) / 2]); } f.line(pts, 1, '#1a120c', { op: 0.55 }); }
    for (const t of [-0.82, -0.55, 0.55, 0.82]) { const x = t * l, x2 = x + (t < 0 ? 5 : -5); f.part([[x, top(x)], [x2, top(x2)], [x2 + (t < 0 ? 2 : -2), cy], [x2, bot(x2)], [x, bot(x)], [x + (t < 0 ? 2 : -2), cy]], { fill: '#2e2c2a', light: '#5a5652', shade: 0.4, inkW: 1, cast: false }); if (f.r() < 0.7) f.flat(ell([x, cy + rr * 0.6], 3, 5, 0, 6), '#5a2a14', { op: 0.5 }); }
    // the head toward us at the left end: the chime, the head boards, a chalk mark
    f.part(ell([-l, cy], rr * 0.3, rr, 0, 18), { fill: '#6a5034', light: '#8a6a48', shade: 0.35, inkW: 1.5, cast: false, tex: PR.T(f, 'wood'), texOp: 0.5 });
    f.part(ell([-l - rr * 0.02, cy], rr * 0.24, rr * 0.82, 0, 16), { fill: '#7a5a3a', shade: 0.3, inkW: 1, cast: false, hatch: false });
    for (const d of [-0.4, 0, 0.4]) f.line([[-l - rr * 0.22 * Math.sqrt(1 - d * d), cy + d * rr * 0.8], [-l + rr * 0.18 * Math.sqrt(1 - d * d), cy + d * rr * 0.8]], 0.9, '#1a120c', { op: 0.6 });
    f.line([[-l - rr * 0.08, cy - rr * 0.3], [-l - rr * 0.08, cy + rr * 0.1]], 1.1, '#e0dccc', { op: 0.6 });
    });
});
// near left: a barrel, a crate of turnips; near right: a rat trap and the rat at it
prop(3.0, () => {
  figProp(-2.95, 0, 3.95, (f, u) => PR.barrel(f, 0, 0.28 * u, 0.85 * u, '#5a4430'));
  I.woodBox(-2.3, -1.8, 0, 0.32, 2.85, 3.2, '#5a4430', { bw: 0.11, knots: 0.4 });
  for (let k = 0; k < 16; k++) { const X = -2.24 + R() * 0.38, Z = 2.95 + R() * 0.15, Y = 0.3 + (k > 9 ? 0.05 : 0);
    figProp(X, Y, Z, (f, u) => { const rr = (0.035 + f.r() * 0.02) * u, purple = f.r() < 0.55; f.part(ell([0, -rr * 0.7], rr, rr * 0.85, 0, 12), { fill: purple ? mix('#9a6a8a', '#6a3a5a', f.r()) : '#c8b0a0', light: '#e8d0c0', shade: 0.45, inkW: 1.1, cast: false }); f.line([[0, -rr * 1.5], [-0.01 * u, -rr * 1.5 - 0.04 * u]], 1.6, '#4a5a2a'); f.line([[0, -rr * 1.5], [0.012 * u, -rr * 1.5 - 0.035 * u]], 1.6, '#5a6a32'); f.line([[0, rr * 0.1], [0.004 * u, rr * 0.4]], 0.8, '#8a7a6a'); }, { tag: false }); }
});
prop(3.2, () => {
  figProp(1.15, 0, 3.2, (f, u) => {
    f.part([[-0.12 * u, 0], [0.12 * u, 0], [0.12 * u, -0.04 * u], [-0.12 * u, -0.04 * u]].map(p => [p[0], p[1], 1]), { fill: WOOD, shade: 0.35, inkW: 1.2, tex: PR.T(f, 'wood'), texOp: 0.5 });
    f.line([[-0.1 * u, -0.04 * u], [-0.05 * u, -0.12 * u], [0.05 * u, -0.12 * u], [0.1 * u, -0.04 * u]], 3.2, '#1a1816'); f.line([[-0.1 * u, -0.04 * u], [-0.05 * u, -0.12 * u], [0.05 * u, -0.12 * u], [0.1 * u, -0.04 * u]], 1.6, '#4a4644');
    // the rat, nose to the bait: grey-brown, a naked tail, a dark bead of an eye
    f.part([[0.15 * u, 0], [0.17 * u, -0.045 * u], [0.24 * u, -0.07 * u], [0.31 * u, -0.05 * u], [0.35 * u, -0.02 * u], [0.33 * u, 0]], { fill: '#4a403a', light: '#6a5e54', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5, inkW: 1.2 });
    f.part([[0.13 * u, -0.01 * u], [0.15 * u, -0.045 * u], [0.19 * u, -0.05 * u], [0.18 * u, -0.01 * u]], { fill: '#4a403a', shade: 0.4, inkW: 1, cast: false });
    f.flat(ell([0.16 * u, -0.04 * u], 0.006 * u, 0.006 * u, 0, 6), '#0a0806');
    f.line([[0.34 * u, -0.01 * u], [0.42 * u, -0.02 * u], [0.5 * u, 0.01 * u]], 1.6, '#8a6a64'); f.line([[0.12 * u, -0.03 * u], [0.09 * u, -0.035 * u]], 0.6, '#c8c0b0');
  });
});
// the near floor: straw and spilled grain, wax drips, a coil of rope, a dropped mitten
prop(3.6, () => {
  raw(PLW(FLOOR, S.strew(I.atF, 2.5, 8.5, 0.2, 2.0, 110, { len: 0.14 })));
  let o = ''; for (let k = 0; k < 40; k++) { const [x, y] = P(-0.8 + R() * 1.6, 0, 4.6 + R() * 0.5); o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2" ry="0.9" fill="#c8b070"/>`; }
  for (let k = 0; k < 8; k++) { const [x, y] = P(-1.2 + R() * 2.4, 0, 3.6 + R() * 1.0); o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(3 + R() * 4)}" ry="${f1(1.5 + R() * 1.5)}" fill="${WAX}" stroke="${INK}" stroke-width="0.6"/>`; }
  raw(PLW(FLOOR, o));
  figProp(1.0, 0, 3.0, (f, u) => H.ropeCoil(f, u * 1.4));
  figProp(-0.3, 0, 3.2, (f, u) => { f.part([[-0.07 * u, 0], [-0.08 * u, -0.03 * u], [-0.02 * u, -0.05 * u], [0.05 * u, -0.04 * u], [0.09 * u, -0.01 * u], [0.06 * u, 0]], { fill: '#5c5448', shade: 0.4, inkW: 1.1, tex: PR.T(f, 'weave'), texOp: 0.6 }); f.part([[-0.03 * u, -0.045 * u], [-0.01 * u, -0.075 * u], [0.02 * u, -0.07 * u], [0.02 * u, -0.045 * u]], { fill: '#5c5448', shade: 0.4, inkW: 1, cast: false }); });
});
addLight(-3.6, 1.7, 5.2, 0.6, 4.0, [1.0, 0.72, 0.42]);                            // light 5 (the left lantern)

// ================================================================== write
I.write(KEEPER, {}, OUT, { veil: { op: 0.55, cut: 0.32 } });
