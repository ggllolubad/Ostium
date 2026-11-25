// The Sacristy in Living Ink. Same room as grim/int_sacristy.js: same camera, room box (8 x 6.8 x 3.6, a barrel vault
// springing at 2.5 m with one transverse rib at 5.0), door, window, keeper spot, hotspots (exit, reliquary, keeper), light
// count and positions. Sister Ide's cold stone lean-to against the church: rimed with frost, a vestment press against the back
// wall, an altar shelf with its frontal, a sanctuary lamp gone dark, and before it all her case.
// Lore (2026-11-23, item 5): the case holds the Teeth brought home. Each world's ruler carries a Tooth, a shard of the Mother;
// all fifteen niches are drawn filled here, each Tooth different and marked by its world's two courses, and warm: the only
// warm light near the front of the room comes up out of the case (she says they are warm; her bare hand rests on its glass).
// Changes from grim, kept to what the lore asks: the case is a sloped-lid vitrine at the height her hand rests on (her Living
// Ink figure lays her hand flat on its glass), and its light is warm, not cold. The altar's warm light is now two lit candles
// on the altar (the casket on it is the Teeths' travelling casket, shut). Light positions and count are grim's.
// Usage: node scenes/int_sacristy.js [outDir]   (default out/scenes/hub/sacristy)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'sacristy');
const I = require('./int_shell')('sacristy', { width: 8, depth: 6.8, height: 3.6, vault: true, spring: 2.5, wall: '#504a44', wall2: '#58524a', vaultCol: '#4a4640', floorCol: '#3c3834', floor: 'stone', stone: 'ashlar', seed: 6619, panel: 'reliquary', ribs: [5.0],
  wallOpts: { dampCol: '#2a3036', rough: true, courses: [1.1, 0.45, 0.8, 1.3, 0.38, 0.38, 0.95, 0.6, 1.2, 0.5, 0.75], wscale: 0.6 } });   // v4 (2026-11-24): coursed rubble as the later rooms
const S = I;
const { P, K, sc, pp, p2, f1, INK, raw, layer, PLW, EM, cel, hatch3, mix, hot, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell, lerp, add } = E;
const DR = require('./dress_li')(I);
const WOOD = '#3e2e20', WOODL = '#5a4632', FROST = '#c8dcec', GOLD = '#b08a3a', GOLDL = '#e2c472';
const KEEPER = { X: 1.2, Z: 4.0, h: (790 - 179) / (640 / 1.75), sprite: 'ide', label: 'Sister Ide', figure: [179, 790], flip: true };
const CASE = { x0: -0.7, x1: 0.95, z0: 3.85, z1: 4.35, y0: 0.86, lo: 0.94, hi: 1.2 };

I.shell();
I.door(5.0, 5.8, { side: -1, ts: 1.85 });   // seen facing west: the sacristy's south door, onto the garth, is on the left
I.backWindow(-0.3, 0.3, 2.5, 3.3, { I: 0.85, range: 7, sky: '#5a6064', bars: 2 });

// ------------------------------------------------------------------ cold: rime along the wall feet and in the vault, icicles on the rib,
// damp blooming where the frost melts by day, old cracks
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, { bloom: [[0.4, 0.35, 0.9, 0.6], [7.6, 0.4, 0.8, 0.5], [2.4, 2.3, 0.9, 0.5]], bloomCol: '#3e4a46', cracks: [[3.75, 2.48, 0.9, 2.3], [4.25, 2.48, 0.8, 0.9], [6.6, 0.1, 1.0, 1.5], [1.2, 2.7, 0.6, -0.4]], soot: [[5.0, 5.6, 1.6, 2.6, 0.16]] });
  const rime = (at, Ls, n, h = 0.14) => { let s = ''; for (let i = 0; i < n; i++) { const a = R() * Ls, t = R() * h, A = P(...at(a, t)), L = 3 + R() * 9; s += `<path d="M${f1(A[0])} ${f1(A[1])} l${f1((R() - 0.5) * 5)} ${f1(-L)}" stroke="${FROST}" stroke-width="${f1(0.8 + R() * 0.8)}" opacity="${f1(0.35 + R() * 0.35)}" stroke-linecap="round"/>`; } return s; };
  raw(PLW(BP, rime(atB, 2 * HW, 220) + `<path d="${p2([atB(0, 0), atB(2 * HW, 0), atB(2 * HW, 0.08), atB(0, 0.1)])}" fill="${FROST}" opacity="0.18"/>`));
  for (const at of [I.atL, I.atR]) raw(PLW([at(0, 0), at(1, 0), at(0, 1)], rime(at, D1 - D0, 120, 0.12)));
  // icicles hanging from the rib's soffit: short, pointing down, a drop at the tip
  let ic = ''; for (let i = 0; i < 16; i++) { const X = -HW + 0.4 + R() * (2 * HW - 0.8), d = 0.24 * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2))), [x, y] = P(X, I.Yv(X) - d, 5.0), l = 5 + R() * 20, w = 1.4 + R() * 1.6;
    ic += `<path d="M${f1(x - w)} ${f1(y)} L${f1(x + w * 0.2)} ${f1(y + l)} L${f1(x + w)} ${f1(y)} Z" fill="#d8e8f0" stroke="${INK}" stroke-width="0.6" opacity="0.9"/><path d="M${f1(x - w * 0.4)} ${f1(y + 1)} L${f1(x)} ${f1(y + l * 0.7)}" stroke="#ffffff" stroke-width="0.6" opacity="0.6"/>`; }
  raw(PLW([[0, 0, 5], [1, 0, 5], [0, 1, 5]], ic));
}

// ------------------------------------------------------------------ the vestment press: a tall cupboard, one door swung open on the copes and chasubles
prop(D1 - 0.55, () => {
  const x0 = -2.7, x1 = -1.0, z = D1 - 0.55, ht = 2.3;
  I.woodBox(x0, x1, 0, ht, z, D1 - 0.02, WOOD, { bw: 0.2 });
  const op = [[x0 + 0.85, 0.12, z - 0.01], [x1 - 0.06, 0.12, z - 0.01], [x1 - 0.06, ht - 0.12, z - 0.01], [x0 + 0.85, ht - 0.12, z - 0.01]];
  through(op, () => {
    raw(`<path d="${pp(op)}" fill="#140e0a"/>` + hatch3((s, t) => [x0 + 0.85 + s, 0.12 + t, z + 0.4], 0, 0.8, 0, 2.1, 0.8, { op: 0.5 }));
    // vestments hung on a rail: a red cope, a green chasuble, a gold-orphreyed one, a white alb; each its own folds and wear
    figProp(x0 + 1.25, ht - 0.25, z + 0.25, (f, u) => {
      f.line([[-0.42 * u, 0], [0.42 * u, 0]], 4, '#2a2622');
      [['#5a1a14', -0.3, 1.6], ['#2e3a2a', -0.1, 1.25], ['#6a5430', 0.1, 1.85], ['#a8a090', 0.3, 1.0]].forEach(([col, dx, len], k) => {
        const x = dx * u, L = len * u * 0.9, w = 0.13 * u;
        f.line([[x - w * 0.6, 4], [x, -6], [x + w * 0.6, 4]], 2.2, '#1a120c');
        f.part([[x - w * 0.5, 2], [x + w * 0.5, 2], [x + w * 1.1, L * 0.3], [x + w * 0.9, L * 0.75], [x + w * 1.0, L], [x - w * 0.9, L * 0.98], [x - w * 1.05, L * 0.6], [x - w * 1.1, L * 0.25]], { fill: col, tex: PR.T(f, 'weave'), texOp: 0.45, shade: 0.5 });
        for (const kk of [-0.5, 0.1, 0.6]) f.line([[x + w * kk, 10], [x + w * (kk - 0.1), L * 0.5], [x + w * (kk + 0.08), L * 0.95]], 1.3, '#140c06', { op: 0.55 });
        if (k < 3) { f.flat([[x - w * 0.12, 6], [x + w * 0.12, 6], [x + w * 0.16, L * 0.96], [x - w * 0.16, L * 0.96]], k === 2 ? '#c8a04a' : GOLD, { op: 0.9 }); for (let j = 0; j < 6; j++) f.line([[x - w * 0.1, L * (0.12 + j * 0.14)], [x + w * 0.1, L * (0.12 + j * 0.14)]], 1, '#3a2a10', { op: 0.6 }); }
        f.line([[x - w, L * 0.97], [x + w, L]], 2.2, mix(col, '#c8b890', 0.3), { op: 0.5 });
      });
    }, { tag: false });
  });
  // the closed left leaf and the open right leaf, swung out toward us on its hinges
  I.woodFace([[x0 + 0.06, ht - 0.12, z - 0.02], [x0 + 0.84, ht - 0.12, z - 0.02], [x0 + 0.84, 0.12, z - 0.02], [x0 + 0.06, 0.12, z - 0.02]], '#4a3624', { bw: 0.13 });
  const a = 1.1, hx = x1 - 0.06, hz = z - 0.02, ez = hz - 0.78 * Math.sin(a);
  I.woodFace([[hx, ht - 0.12, hz], [hx + 0.78 * Math.cos(a), ht - 0.12, ez], [hx + 0.78 * Math.cos(a), 0.12, ez], [hx, 0.12, hz]], '#4a3624', { bw: 0.13 });
  for (const t of [0.4, 1.8]) raw(I.rod([x0 + 0.06, t, z - 0.03], [x0 + 0.84, t, z - 0.03], '#2a2826', 3));
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0, x1, 0, ht, z, D1), [0, 1, 0], 0), z, { op: 0.28 })));
});

// ------------------------------------------------------------------ the altar shelf: stone, arched niches in its face, a red frontal with
// gilt lozenges, the missal on its cushion, the Teeths' travelling casket (shut), an altar cross and two lit candles
prop(D1 - 0.5, () => {
  const x0 = 1.0, x1 = 3.5, z0 = D1 - 0.5, top = 1.0;
  I.stoneBox(x0, x1, 0, top, z0, D1 - 0.02, '#5a544a', { course: 0.33, block: 0.5 });
  for (let k = 0; k < 4; k++) { const xa = x0 + 0.2 + k * 0.6, xb = xa + 0.4, q = [[xa, 0.12, z0 - 0.005], [xa, 0.5, z0 - 0.005], [xa + 0.2, 0.66, z0 - 0.005], [xb, 0.5, z0 - 0.005], [xb, 0.12, z0 - 0.005]];
    raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], `<path d="${smooth3(q)}" fill="#1e1a16" stroke="${INK}" stroke-width="1.4"/>` + hatch3((s, t) => [xa + s, 0.12 + t, z0 - 0.006], 0, 0.4, 0, 0.5, 0.8, { op: 0.4 }))); }
  // the linen on top, then the frontal hanging over the front edge
  raw(PLW([[0, top, 1], [1, top, 1], [0, top, 2]], cel([[x0 - 0.05, top, z0 - 0.06], [x1 + 0.05, top, z0 - 0.06], [x1 + 0.05, top, D1], [x0 - 0.05, top, D1]].map(p => P(...p)), { Z: z0, fill: '#c8c0b0', tex: 'url(#mottle)', texOp: 0.4 })));
  const fr = [P(x0 - 0.05, top, z0 - 0.06), P(x1 + 0.05, top, z0 - 0.06), P(x1 + 0.03, top - 0.35, z0 - 0.07), P((x0 + x1) / 2, top - 0.32, z0 - 0.07), P(x0 - 0.03, top - 0.36, z0 - 0.07)];
  let fx = cel(fr, { Z: z0, fill: '#6a1a14', tex: 'url(#mottle)', texOp: 0.5 });
  for (let k = 0; k < 9; k++) { const [ox, oy] = P(x0 + 0.15 + k * 0.28, top - 0.16, z0 - 0.07), s = K(z0); fx += `<path d="M${f1(ox)} ${f1(oy - s * 0.06)} l${f1(s * 0.05)} ${f1(s * 0.06)} l${f1(-s * 0.05)} ${f1(s * 0.06)} l${f1(-s * 0.05)} ${f1(-s * 0.06)} Z" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity="0.85"/><circle cx="${f1(ox)}" cy="${f1(oy)}" r="1.6" fill="${GOLDL}"/>`; }
  { const s = K(z0); fx += `<path d="M${f1(fr[0][0])} ${f1(fr[0][1] + s * 0.05)} L${f1(fr[1][0])} ${f1(fr[1][1] + s * 0.05)}" stroke="${GOLD}" stroke-width="2.6"/>` + S.stain(...P(1.6, top - 0.2, z0), s * 0.15, '#140806', 0.45);
    for (const X of [1.4, 2.0, 2.8, 3.2]) { const A = P(X, top, z0 - 0.07); fx += `<path d="M${f1(A[0])} ${f1(A[1])} l2 ${f1(s * 0.3)}" stroke="#1a0404" stroke-width="1.4" opacity="0.6"/>`; }
    let fringe = ''; for (let X = x0; X < x1; X += 0.04) { const [a1, b1] = P(X, top - 0.33 - Math.sin(X * 3) * 0.02, z0 - 0.07); fringe += `M${f1(a1)} ${f1(b1)} l0 ${f1(s * 0.03)} `; } fx += `<path d="${fringe}" stroke="${GOLD}" stroke-width="1.1" opacity="0.8"/>`;
    fx += hatch3((s2, t) => [x0 + s2, top - 0.35 + t, z0 - 0.07], 0, x1 - x0, 0, 0.12, 0.6, { op: 0.35 }); }
  raw(PLW([[0, 0, z0 - 0.07], [1, 0, z0 - 0.07], [0, 1, z0 - 0.07]], fx));
  // the missal open on its cushion
  figProp(1.45, top, D1 - 0.35, (f, u) => { f.part([[-0.17 * u, 0], [0.17 * u, 0], [0.15 * u, -0.05 * u], [-0.15 * u, -0.05 * u]], { fill: '#5a2a3a', shade: 0.4, inkW: 1.2, tex: PR.T(f, 'weave'), texOp: 0.4 }); f.part([[-0.15 * u, -0.05 * u], [0, -0.07 * u], [0.15 * u, -0.05 * u], [0.14 * u, -0.11 * u], [0, -0.13 * u], [-0.14 * u, -0.11 * u]], { fill: '#d8ccb0', shade: 0.3, inkW: 1, cast: false }); for (let k = 0; k < 4; k++) { f.line([[-0.12 * u, -0.1 * u + k * 2], [-0.03 * u, -0.105 * u + k * 2]], 0.9, k ? '#3a3026' : '#8a1a14'); f.line([[0.03 * u, -0.105 * u + k * 2], [0.12 * u, -0.1 * u + k * 2]], 0.9, '#3a3026'); } });
  // the casket the Teeth came home in, shut: gilt, pitched lid, rock-crystal windows gone dark (they are in the case now)
  figProp(2.3, top, D1 - 0.28, (f, u) => { const w = 0.3 * u, h = 0.24 * u; f.part([[-w, 0], [w, 0], [w, -h], [-w, -h]], { fill: GOLD, light: GOLDL, shade: 0.45, inkW: 1.6, tex: PR.T(f, 'mottle'), texOp: 0.4 }); f.part([[-w * 1.08, -h], [0, -h * 1.7, 1], [w * 1.08, -h]], { fill: GOLDL, shade: 0.4, inkW: 1.6, cast: false }); for (let k = 0; k < 3; k++) { const x = -w * 0.62 + k * w * 0.62; f.part([[x - 0.045 * u, -h * 0.25], [x + 0.045 * u, -h * 0.25], [x + 0.045 * u, -h * 0.8], [x - 0.045 * u, -h * 0.8]], { fill: '#3a2a22', shade: 0.3, inkW: 1.1, cast: false, hatch: false }); } f.rivet([0, -h * 1.45], 2, GOLDL); f.flat(ell([w * 0.6, -h * 0.5], 4, 3, 0, 6), '#4f6a4a', { op: 0.4 }); });
  // the altar cross and two candles, lit
  figProp(2.3, top, D1 - 0.1, (f, u) => { f.part([[-0.012 * u, 0], [0.012 * u, 0], [0.012 * u, -0.5 * u], [-0.012 * u, -0.5 * u]], { fill: GOLD, shade: 0.4, inkW: 1.2, cast: false }); f.part([[-0.1 * u, -0.38 * u], [0.1 * u, -0.38 * u], [0.1 * u, -0.355 * u], [-0.1 * u, -0.355 * u]], { fill: GOLD, shade: 0.4, inkW: 1.2, cast: false }); f.part([[-0.06 * u, 0], [0.06 * u, 0], [0.03 * u, -0.04 * u], [-0.03 * u, -0.04 * u]], { fill: GOLD, shade: 0.4, inkW: 1.2, cast: false }); });
  for (const X of [1.75, 2.85]) figProp(X, top, D1 - 0.2, (f, u) => { f.part([[-0.05 * u, 0], [0.05 * u, 0], [0.012 * u, -0.05 * u], [0.012 * u, -0.16 * u], [-0.012 * u, -0.16 * u], [-0.012 * u, -0.05 * u]], { fill: GOLD, shade: 0.4, inkW: 1.1, cast: false }); KK.candle(f, [0, -0.16 * u], 0.18 * u, 0.035 * u, { drips: 2, fs: 5 }); });
  addLight(2.3, top + 0.2, D1 - 0.63, 0.65, 4.0, [1.0, 0.64, 0.3]);
  layer('fx'); for (const X of [1.75, 2.85]) raw(glow(...P(X, top + 0.42, D1 - 0.2), K(D1) * 0.5, K(D1) * 0.45, '#ffb060', 0.35)); layer('bg');
  raw(PLW([[0, 0, D1], [1, 0, D1], [0, 1, D1]], S.soot(I.atB, 5.65, 6.95, top + 0.5, top + 1.5, { op: 0.12 })));
});
function smooth3(q) { return p2(q.map(p => P(...p))); }
// a sanctuary lamp on chains from the rib, its red glass dark
prop(4.9, () => {
  const top = I.Yv(-1.9) - 0.2, [tx, ty] = P(-1.9, top, 4.9), [lx, ly] = P(-1.9, 2.1, 4.9);
  raw(`<path d="M${f1(tx)} ${f1(ty)} L${f1(lx)} ${f1(ly)}" stroke="${INK}" stroke-width="2.6" stroke-dasharray="3 1.5"/><path d="M${f1(tx)} ${f1(ty)} L${f1(lx)} ${f1(ly)}" stroke="#6a5a3a" stroke-width="1.2" stroke-dasharray="3 1.5"/>`);
  figProp(-1.9, 2.1, 4.9, (f, u) => { for (const dx of [-0.08, 0.08]) f.line([[0, 0], [dx * u, 0.1 * u]], 1.3, '#1a120c'); f.part([[-0.09 * u, 0.1 * u], [0.09 * u, 0.1 * u], [0.06 * u, 0.2 * u], [0, 0.24 * u], [-0.06 * u, 0.2 * u]], { fill: '#4a1a14', light: '#7a2a20', shade: 0.4, inkW: 1.5 }); f.line([[-0.09 * u, 0.1 * u], [0.09 * u, 0.1 * u]], 2.4, GOLD); f.flat(ell([-0.03 * u, 0.15 * u], 3, 5, 0.3, 6), '#c86a5a', { op: 0.4 }); }, { tag: false });
});
// the thurible hung from the vault on its chains, cold, and the processional cross and staves leaned in the back-right corner
prop(5.2, () => {
  const X = 2.1, Z = 5.2, top = I.Yv(X) - 0.05; for (const dx of [-0.05, 0, 0.05]) raw(I.rod([X, top, Z], [X + dx, 1.98, Z], '#3a3026', 0.9));
  figProp(X, 1.98, Z, (f, u) => { f.part([[-0.07 * u, 0], [0.07 * u, 0], [0.08 * u, 0.06 * u], [0.04 * u, 0.12 * u], [-0.04 * u, 0.12 * u], [-0.08 * u, 0.06 * u]], { fill: '#8a6a2a', light: '#c8a050', shade: 0.45, inkW: 1.4 }); f.part([[-0.06 * u, 0], [0, -0.07 * u, 1], [0.06 * u, 0]], { fill: '#8a6a2a', shade: 0.4, inkW: 1.3, cast: false }); for (let k = 0; k < 5; k++) f.flat(ell([(-0.04 + k * 0.02) * u, -0.02 * u], 1.2, 1.2, 0, 5), '#140c06'); f.line([[-0.07 * u, 0.02 * u], [0.07 * u, 0.02 * u]], 1.4, '#3a2a10'); f.flat(ell([0.03 * u, 0.07 * u], 3, 2, 0, 6), '#4f6a4a', { op: 0.5 }); }, { tag: false });
});
prop(D1 - 0.3, () => {
  const zc = D1 - 0.25;
  raw(I.rod([3.55, 0, zc - 0.3], [3.8, 2.45, zc], '#5a4430', 3.5) + I.rod([3.25, 0, zc - 0.35], [3.65, 2.2, zc], '#4a3624', 3) + I.rod([3.4, 0, zc - 0.32], [3.72, 2.0, zc], '#6a5038', 2.6));
  figProp(3.8, 2.45, zc, (f, u) => { f.part([[-0.015 * u, 0.02 * u], [0.015 * u, 0.02 * u], [0.015 * u, -0.08 * u], [0.06 * u, -0.08 * u], [0.06 * u, -0.105 * u], [0.015 * u, -0.105 * u], [0.015 * u, -0.17 * u], [-0.015 * u, -0.17 * u], [-0.015 * u, -0.105 * u], [-0.06 * u, -0.105 * u], [-0.06 * u, -0.08 * u], [-0.015 * u, -0.08 * u]].map(p => [p[0], p[1], 1]), { fill: GOLD, light: GOLDL, shade: 0.4, inkW: 1.3, cast: false }); }, { tag: false });
  figProp(3.65, 2.2, zc, (f, u) => { f.line([[0, 0], [0.06 * u, -0.05 * u], [0.05 * u, -0.13 * u], [-0.02 * u, -0.12 * u]], 4.4, '#1a120c'); f.line([[0, 0], [0.06 * u, -0.05 * u], [0.05 * u, -0.13 * u], [-0.02 * u, -0.12 * u]], 2.6, '#a8842a'); }, { tag: false });
  // a box of new candles and a bundle of wrapped plate
  I.woodBox(2.55, 3.15, 0, 0.3, zc - 0.55, zc - 0.15, '#4a3624', { bw: 0.1 });
  figProp(2.85, 0.3, zc - 0.35, (f, u) => { for (let k = 0; k < 7; k++) f.part([[(-0.22 + k * 0.065) * u, 0], [(-0.19 + k * 0.065) * u, 0], [(-0.19 + k * 0.065) * u, -0.05 * u], [(-0.22 + k * 0.065) * u, -0.05 * u]], { fill: KK.P.wax, shadow: KK.P.waxD, shade: 0.35, inkW: 0.9, cast: false, hatch: false }); });
  figProp(2.2, 0, zc - 0.5, (f, u) => { for (const [dy, col, w] of [[0, '#6a6050', 0.32], [-0.07, '#4a1a14', 0.28], [-0.13, '#8a8068', 0.24]]) f.part([[-w * u, dy * u], [w * u, dy * u], [w * 0.92 * u, (dy - 0.07) * u], [-w * 0.95 * u, (dy - 0.07) * u]], { fill: col, tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.4 }); f.line([[0, 0], [0, -0.2 * u]], 1.6, KK.P.rope); });
});
// the floor at the back: an iron-bound coffer of plate, a cold brazier, a bucket of sand for the candles
prop(5.9, () => {
  I.woodBox(-3.3, -2.5, 0, 0.45, 5.9, 6.35, '#3a2a1c', { bw: 0.11 });
  for (const X of [-3.14, -2.66]) raw(I.rod([X, 0.01, 5.89], [X, 0.45, 5.89], '#2a2826', 3.5));
  figProp(-2.9, 0.3, 5.89, (f, u) => { f.part([[-0.04 * u, -0.04 * u], [0.04 * u, -0.04 * u], [0.04 * u, 0.04 * u], [-0.04 * u, 0.04 * u]].map(p => [p[0], p[1], 1]), { fill: '#4a4644', shade: 0.4, inkW: 1.3, cast: false }); f.flat(ell([0, 0.01 * u], 0.012 * u, 0.018 * u, 0, 8), '#140c06'); }, { tag: false });
});
prop(5.4, () => {
  figProp(-0.3, 0, 5.4, (f, u) => { const w = 0.1 * u, h = 0.22 * u; f.part([[-w, -h], [w, -h], [w * 0.85, 0], [-w * 0.85, 0]], { fill: '#5a4430', shade: 0.45, tex: PR.T(f, 'wood'), texOp: 0.5 }); for (const t of [0.25, 0.75]) f.line([[-w * (1 - t * 0.15), -h * t], [w * (1 - t * 0.15), -h * t]], 2.2, '#2a2826'); f.part(ell([0, -h], w, 0.025 * u, 0, 12), { fill: '#8a7a5a', shade: 0.3, inkW: 1, cast: false, hatch: false }); f.line([[-0.02 * u, -h], [0.01 * u, -h - 0.05 * u]], 1.4, '#d8ccb0'); });
});
prop(4.6, () => {
  figProp(2.9, 0, 4.6, (f, u) => { for (const [a, b] of [[[-0.15, 0], [-0.08, -0.7]], [[0.15, 0], [0.08, -0.7]], [[0.0, 0.04], [0.0, -0.7]]]) { f.line([[a[0] * u, a[1] * u], [b[0] * u, b[1] * u]], 5, '#1a120c'); f.line([[a[0] * u, a[1] * u], [b[0] * u, b[1] * u]], 3, '#2a2826'); } f.part([[-0.2 * u, -0.7 * u], [0.2 * u, -0.7 * u], [0.12 * u, -0.6 * u], [-0.12 * u, -0.6 * u]], { fill: '#3a3836', shade: 0.45, inkW: 1.6 }); f.part(ell([0, -0.7 * u], 0.2 * u, 0.035 * u, 0, 14), { fill: '#1a1816', shade: 0.2, inkW: 1.2, cast: false, hatch: false }); for (let k = 0; k < 6; k++) f.flat(ell([(f.r() - 0.5) * 0.3 * u, -0.71 * u], 2 + f.r() * 2, 1.5, 0, 6), '#5a5654'); });
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(2.7, 3.1, 0, 0.7, 4.5, 4.7), [0, 1, 0], 0), 4.6, { op: 0.25 })));
});

// ------------------------------------------------------------------ the case of the Teeth (the panel): a sloped-lid vitrine on a stand, its
// lid at the height Ide's hand rests on. Fifteen niches in dark velvet, three rows of five; in each a Tooth on its cradle,
// warm. The glass misted with frost at its corners, except where her hand has lain on it. A shelf under it holds the older
// relics (a skull on a cushion, a silver arm reliquary, finger bones in a dish).
prop(CASE.z0, () => {
  const { x0, x1, z0, z1, y0, lo, hi } = CASE, Ys = zz => lo + (hi - lo) * (zz - z0) / (z1 - z0);
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0, x1, 0, hi, z0, z1), [0, 1, 0], 0), z0, { op: 0.3 })));
  // the stand: four square legs, a stretcher, the shelf of older relics
  for (const [X, Z] of [[x0 + 0.06, z1 - 0.06], [x1 - 0.06, z1 - 0.06]]) I.beam(X - 0.03, X + 0.03, 0, y0, Z - 0.03, Z + 0.03, WOOD);
  I.woodBox(x0 + 0.04, x1 - 0.04, 0.3, 0.34, z0 + 0.05, z1 - 0.05, WOODL, { cast: false, boards: 1, topBoards: 2, segs: 1 });
  figProp(x0 + 0.35, 0.34, (z0 + z1) / 2, (f, u) => { f.part([[-0.13 * u, 0], [0.13 * u, 0], [0.1 * u, -0.04 * u], [-0.1 * u, -0.04 * u]], { fill: '#6a1a14', shade: 0.4, inkW: 1.1, tex: PR.T(f, 'weave'), texOp: 0.4 }); f.part([[-0.05 * u, -0.04 * u], [-0.1 * u, -0.1 * u], [-0.09 * u, -0.19 * u], [0, -0.23 * u], [0.08 * u, -0.19 * u], [0.08 * u, -0.1 * u], [0.03 * u, -0.07 * u], [0.03 * u, -0.04 * u]], { fill: '#b8ae94', shade: 0.4, inkW: 1.3 }); f.flat(ell([-0.045 * u, -0.13 * u], 0.024 * u, 0.022 * u, 0, 8), '#14100c'); f.flat([[-0.085 * u, -0.085 * u], [-0.072 * u, -0.06 * u], [-0.06 * u, -0.085 * u]], '#14100c'); for (let k = 0; k < 4; k++) f.line([[(-0.07 + k * 0.025) * u, -0.055 * u], [(-0.07 + k * 0.025) * u, -0.04 * u]], 0.8, '#14100c'); });
  figProp(x0 + 0.85, 0.34, (z0 + z1) / 2, (f, u) => { f.part([[-0.05 * u, 0], [0.05 * u, 0], [0.04 * u, -0.28 * u], [0.07 * u, -0.34 * u], [-0.05 * u, -0.36 * u], [-0.04 * u, -0.28 * u]], { fill: '#a8b0b4', light: '#e0e8ec', shade: 0.4, inkW: 1.3 }); f.line([[-0.02 * u, -0.05 * u], [-0.02 * u, -0.3 * u]], 1.2, '#f0f4f4', { op: 0.6 }); for (let k = 0; k < 4; k++) f.line([[(-0.04 + k * 0.025) * u, -0.36 * u], [(-0.04 + k * 0.03) * u, -0.42 * u]], 2.2, '#a8b0b4'); });
  figProp(x1 - 0.35, 0.34, (z0 + z1) / 2, (f, u) => { f.part(ell([0, -0.01 * u], 0.1 * u, 0.025 * u, 0, 12), { fill: '#8a7a4a', shade: 0.35, inkW: 1 }); for (let k = 0; k < 5; k++) f.line([[(-0.06 + k * 0.03) * u, -0.02 * u], [(-0.04 + k * 0.03) * u, -0.05 * u]], 2.6, '#d8ccb0'); });
  for (const [X, Z] of [[x0 + 0.06, z0 + 0.06], [x1 - 0.06, z0 + 0.06]]) I.beam(X - 0.035, X + 0.035, 0, y0, Z - 0.035, Z + 0.035, WOOD);
  // the box of the case: its front board and ends, dark oak with brass at the corners
  I.woodFace([[x0, lo, z0], [x1, lo, z0], [x1, y0, z0], [x0, y0, z0]], WOODL, { boards: 1, segs: 1 });
  // the velvet bed under the glass, sloping up to the back; the fifteen niches; the Teeth
  const at = (s, t) => [x0 + 0.05 + s, Ys(z0 + 0.04 + t) + 0.002, z0 + 0.04 + t], Lw = x1 - x0 - 0.1, Ld = z1 - z0 - 0.08;
  const bed = [at(0, 0), at(Lw, 0), at(Lw, Ld), at(0, Ld)];
  raw(PLW([bed[0], bed[1], bed[3]], cel(bed.map(p => P(...p)), { Z: z0, fill: '#3a1018', tex: 'url(#mottle)', texOp: 0.5, band: 2 })));
  const rows = 3, cols = 5;
  for (let r = rows - 1; r >= 0; r--) for (let c = 0; c < cols; c++) {
    const s0 = Lw * (c + 0.08) / cols, s1 = Lw * (c + 0.92) / cols, t0 = Ld * (r + 0.1) / rows, t1 = Ld * (r + 0.9) / rows;
    const q = [at(s0, t0), at(s1, t0), at(s1, t1), at(s0, t1)];
    raw(PLW([bed[0], bed[1], bed[3]], `<path d="${pp(q)}" fill="#22080e" stroke="${INK}" stroke-width="0.8"/><path d="${pp([at(s0, t1 - (t1 - t0) * 0.2), at(s1, t1 - (t1 - t0) * 0.2), at(s1, t1), at(s0, t1)])}" fill="#14060a" opacity="0.7"/>`));
    const idx = (rows - 1 - r) * cols + c, T = PR.TEETH[idx], m = at((s0 + s1) / 2, (t0 + t1) / 2);
    figProp(m[0], m[1], m[2], (f, u) => { f.flat(ell([0, 0.004 * u], 0.07 * u, 0.016 * u, 0, 12), '#ffb060', { op: 0.22 }); f.raw(`<g transform="rotate(-76)">`); PR.tooth(f, -0.005 * u, 0.065 * u, 0.13 * u, T, { bg: '#22080e' }); f.raw('</g>'); }, { tag: false });
  }
  // the warm light up out of the case
  addLight(0, 1.35, 3.8, 0.5, 3.2, [1.0, 0.7, 0.4]);
  layer('fx'); raw(glow(...P((x0 + x1) / 2, hi, (z0 + z1) / 2), K(z0) * 1.0, K(z0) * 0.4, '#ffb060', 0.35) + glow(...P((x0 + x1) / 2, hi + 0.25, (z0 + z1) / 2), K(z0) * 1.4, K(z0) * 0.9, '#ffa850', 0.14)); layer('bg');
  // the glass lid: faint, with reflections, frost feathering in from the corners and the clear print of her hand at the right
  const lid = [[x0, lo + 0.02, z0], [x1, lo + 0.02, z0], [x1, hi + 0.02, z1], [x0, hi + 0.02, z1]], lidS = lid.map(p => P(...p));
  let gl = `<path d="${p2(lidS)}" fill="#c8dcec" opacity="0.1"/>`;
  for (const t of [0.12, 0.2, 0.55]) { const A = P(x0 + t * (x1 - x0), hi + 0.02, z1), B = P(x0 + (t - 0.12) * (x1 - x0), lo + 0.02, z0); gl += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#eef6ff" stroke-width="${t === 0.2 ? 1 : 2.2}" opacity="0.3"/>`; }
  for (let i = 0; i < 70; i++) { const corner = i % 3, X = corner === 0 ? x0 + R() * 0.3 : corner === 1 ? x0 + R() * 0.25 : x1 - 0.5 - R() * 0.3, Zz = corner === 1 ? z1 - R() * 0.12 : z0 + R() * 0.12, Y = lo + (hi - lo) * (Zz - z0) / (z1 - z0) + 0.022, [x, y] = P(X, Y, Zz); gl += `<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 9)} ${f1((R() - 0.5) * 4)}" stroke="#e8f2fa" stroke-width="0.8" opacity="0.5"/>`; }
  gl += `<path d="${p2(lidS)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
  raw(PLW([lid[0], lid[1], lid[3]], gl));
  // the lid's frame: oak rails, brass corner mounts, a lock plate on the front rail
  for (const [p, q] of [[lid[0], lid[1]], [lid[3], lid[2]], [lid[0], lid[3]], [lid[1], lid[2]]]) raw(I.rod(p, q, WOODL, 3.2));
  for (const p of lid) figProp(p[0], p[1], p[2], (f, u) => { f.part(ell([0, 0], 0.025 * u, 0.018 * u, 0, 8), { fill: GOLD, light: GOLDL, shade: 0.3, inkW: 1, cast: false, hatch: false }); }, { tag: false });
  figProp((x0 + x1) / 2 - 0.2, lo - 0.02, z0 - 0.005, (f, u) => { f.part([[-0.03 * u, -0.03 * u], [0.03 * u, -0.03 * u], [0.03 * u, 0.03 * u], [-0.03 * u, 0.03 * u]].map(p => [p[0], p[1], 1]), { fill: GOLD, light: GOLDL, shade: 0.35, inkW: 1.1, cast: false }); f.flat([[-0.006 * u, -0.01 * u], [0.006 * u, -0.01 * u], [0.004 * u, 0.015 * u], [-0.004 * u, 0.015 * u]], '#14100c'); }, { tag: false });
  hot('reliquary', 'The relic case', [P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x1, hi + 0.04, z1), P(x0, hi + 0.04, z1), P(x0, lo + 0.04, z0)]);
});

// ================================================================== MID: nothing stands between Ide's legs and her hands here; the layer
// is kept (empty) for the game's draw order
layer('mid'); raw('');

// ================================================================== FG: the prie-dieu, the holy-water stoup skinned with ice, wax, the corporal, frost on the flags
layer('fg');
prop(3.3, () => {
  const xa = -1.75, xb = -1.15, zk = 3.3, zb = 3.65;
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(xa, xb, 0, 0.97, zk, zb), [0, 1, 0], 0), zk, { op: 0.28 })));
  for (const X of [xa + 0.04, xb - 0.04]) I.beam(X - 0.035, X + 0.035, 0, 0.9, zb - 0.035, zb + 0.035, WOODL);
  I.beam(xa + 0.04, xb - 0.04, 0.42, 0.48, zb - 0.03, zb + 0.03, WOODL);
  I.woodFace([[xa - 0.04, 0.97, zb + 0.02], [xb + 0.04, 0.97, zb + 0.02], [xb + 0.04, 0.86, zb - 0.18], [xa - 0.04, 0.86, zb - 0.18]], mix(WOODL, '#8a6a4a', 0.3), { bw: 0.08 });
  I.woodFace([[xa - 0.04, 0.86, zb - 0.18], [xb + 0.04, 0.86, zb - 0.18], [xb + 0.04, 0.8, zb - 0.18], [xa - 0.04, 0.8, zb - 0.18]], WOODL, { boards: 1, segs: 1 });
  I.woodBox(xa, xb, 0, 0.14, zk, zk + 0.28, WOODL, { boards: 1 });
  figProp((xa + xb) / 2, 0.14, zk + 0.06, (f, u) => { const w = 0.27 * u; f.part([[-w, 0], [w, 0], [w * 0.95, -0.08 * u], [0, -0.095 * u], [-w * 0.95, -0.08 * u]], { fill: '#7a1e16', shade: 0.45, tex: PR.T(f, 'weave'), texOp: 0.45 }); f.line([[-w * 0.7, -0.05 * u], [-w * 0.2, -0.065 * u]], 1.4, '#14060a', { op: 0.5 }); f.flat(ell([w * 0.2, -0.06 * u], w * 0.25, 0.015 * u, 0, 10), '#3a0a08', { op: 0.5 }); });
});
prop(3.5, () => {
  // the stoup: a stone bowl on a shaft, its water a skin of ice with a crack in it, frost round the rim
  const X = 2.4, Z = 3.5;
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(X - 0.24, X + 0.24, 0, 0.95, Z - 0.24, Z + 0.24), [0, 1, 0], 0), Z, { op: 0.28 })));
  figProp(X, 0, Z, (f, u) => {
    f.part([[-0.12 * u, 0], [0.12 * u, 0], [0.08 * u, -0.1 * u], [0.06 * u, -0.8 * u], [-0.06 * u, -0.8 * u], [-0.08 * u, -0.1 * u]], { fill: '#6a645a', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.6 });
    for (const t of [0.15, 0.5, 0.78]) f.line([[-0.07 * u, -t * u], [0.07 * u, -t * u]], 1.2, '#2a2622', { op: 0.6 });
    f.part([[-0.25 * u, -0.95 * u], [0.25 * u, -0.95 * u], [0.18 * u, -0.84 * u], [0.06 * u, -0.79 * u], [-0.06 * u, -0.79 * u], [-0.18 * u, -0.84 * u]], { fill: '#7a746a', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5 });
    f.part(ell([0, -0.95 * u], 0.25 * u, 0.06 * u, 0, 18), { fill: '#a8c0d0', light: '#e8f4ff', shade: 0.3, inkW: 1.6, cast: false, hatch: false });
    f.line([[-0.12 * u, -0.955 * u], [-0.02 * u, -0.94 * u], [0.06 * u, -0.96 * u]], 1.1, '#5a7080');
    for (let k = 0; k < 14; k++) { const a = k / 14 * 6.28; f.line([[Math.cos(a) * 0.25 * u, -0.95 * u + Math.sin(a) * 0.06 * u], [Math.cos(a) * 0.28 * u, -0.95 * u + Math.sin(a) * 0.07 * u - 2]], 1, '#e8f4ff', { op: 0.8 }); }
    f.flat(ell([0.05 * u, -0.5 * u], 0.03 * u, 0.06 * u, 0, 8), '#2a3a24', { op: 0.4 });
  });
});
prop(3.0, () => {
  // spilled wax in pools, a dropped linen corporal with its red cross, frost feathered on the flags
  let o = '';
  for (let k = 0; k < 7; k++) { const [x, y] = P(-1.5 + R() * 4, 0, 3.0 + R() * 1.0); o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(3 + R() * 6)}" ry="${f1(1.5 + R() * 2)}" fill="#a89e84" stroke="${INK}" stroke-width="0.6" opacity="0.9"/>`; }
  for (let k = 0; k < 140; k++) { const [x, y] = P(-3.5 + R() * 7, 0, 2.6 + R() * 1.6); o += `<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 9)} ${f1(-1 - R() * 3)}" stroke="${FROST}" stroke-width="1" opacity="0.45"/>`; }
  const lq = [[0.2, 0.004, 3.15], [0.75, 0.004, 3.1], [0.85, 0.004, 3.45], [0.25, 0.004, 3.5]];
  o += cel(lq.map(p => P(...p)), { Z: 3.1, fill: '#c8c0b0', tex: 'url(#mottle)', texOp: 0.4, band: 2 });
  { const A = P(0.5, 0.005, 3.22), B = P(0.5, 0.005, 3.42), C = P(0.4, 0.005, 3.32), D = P(0.62, 0.005, 3.32); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} M${f1(C[0])} ${f1(C[1])} L${f1(D[0])} ${f1(D[1])}" stroke="#8a1a14" stroke-width="1.8"/>`; }
  raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], o));
});

// ================================================================== write
I.write(KEEPER, {}, OUT, { veil: { op: 0.55, cut: 0.32 } });
