// The Almonry in Living Ink. Same room as grim/int_almonry.js: same camera, room box (8.4 x 6.6 x 3.4, boarded floor, flat
// ceiling on beams 1.2 m apart), door (square, in the right wall: the almonry's garth door faces east), dole hatch, keeper spot,
// hotspots (exit, ledger, keeper), the six lights in grim's order and values, draw order bg / keeper / mid / fg.
// Brother Fenn's store: a low, crammed room of plaster over rubble stone, the back wall shelved to the beams with what the dead
// left and the living will pay for (flasks, helms, boots, packs, rope, mail, bowls); cloaks for sale hung from the beams; an
// iron-bound strongbox chained to the wall; the dole hatch in the right wall open on the garth, where the queue waits in the
// brazier light. Fenn stands behind his counter, his soft hands spread on the open ledger (the panel).
// Lore (2026-11-23, item 9; a hint only, never stated): Fenn was a ledger clerk in the Sulphur Pits. His oldest ledger lies
// closed at the end of the counter under the dish of ostia, its page edges stained sulphur yellow with a tide line where the
// damp of the pits got in, a few sulphur crystals in the edge (as on his figure, worlds/keepers.js).
// Rulings kept: gold only on holy things (grim's gilt balance, gold coin and gilt pack rivet are bronze, lead ostia and iron
// here); red only for blood, doom and rubric (grim's red-painted shield is a faded blue one with old blood on it).
// Deliberate changes from grim, for the Living Ink keeper: the counter top is 0.96 m (was 0.86; Fenn's figure leans on a 0.95 m
// counter, so with grim's height his hands floated over the back edge) and the ledger sits 0.25 m to the right (X 0.95, was
// 0.7) so his spread hands land on its pages; cutY/cutZ follow (the ledger's front edge). Lights unchanged.
// Usage: node scenes/int_almonry.js [outDir]   (default out/scenes/hub/almonry)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'almonry');
const I = require('./int_shell')('almonry', { width: 8.4, depth: 6.6, height: 3.4, wall: '#4e463a', wall2: '#544a3e', floorCol: '#4a3a2a', floor: 'boards', ceilCol: '#2e2218', beamCol: '#3a2c1e', seed: 4471, panel: 'ledger', beamGap: 1.2,
  lime: '#8a8270', limeOpts: { flakeStone: 'ashlar', flakes: 4, flakeT: [0.3, 2.5], stone: '#5a5244', damp: 0.5 } });
const S = I;
const { P, K, pp, p2, f1, INK, raw, layer, PLW, cel, hatch3, mix, hot, outline, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell } = E;
const DR = require('./dress_li')(I);
const H = require('./props_hub')(I);
const WOOD = '#4a3624', WOODL = '#6a5034', VELLUM = '#d8ccae', SUL = '#c8b040', SULD = '#8a7428';
const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];
const KEEPER = { X: 1.45, Z: 4.35, h: (790 - 197) / (640 / 1.75), sprite: 'fenn', label: 'Brother Fenn', cutY: 0.98, cutZ: 3.82, figure: [197, 790], flip: true };
const CTR = { x0: -0.45, x1: 2.3, z0: 3.75, z1: 4.15, top: 0.96 };
const LEDGER = { X: 0.95, Z: 3.95 };
const fxL = s => { const l = S.curLayer(); layer('fx'); raw(s); layer(l); };

I.shell();
I.door(5.35, 6.1, { side: 1, square: true, ts: 1.85 });                         // light 1 (grim's)

// ------------------------------------------------------------------ the plaster worn: flaked back to the ashlar, patched, cracked over the
// door head, damp rising behind the strongbox, soot above where the lanterns hang
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, { patches: [[0.55, 2.5, 0.8, 0.6, '#948c78', false], [1.1, 0.9, 0.9, 0.7, '#7e7664', false]], bloom: [[0.5, 0.35, 1.0, 0.6], [1.6, 0.3, 0.7, 0.4]], cracks: [[0.9, 3.35, 0.8, 1.9], [1.3, 1.6, 0.6, 2.6]], soot: [[0.75, 1.55, 1.9, 3.1, 0.18]] });
  const atR = I.atR, RP = [atR(0, 0), atR(1, 0), atR(0, 1)];
  I.wear(atR, RP, { patches: [[1.2, 2.6, 0.9, 0.5, '#a09884', true]], bloom: [[0.4, 0.4, 0.9, 0.6], [3.6, 0.3, 0.6, 0.4]], cracks: [[2.22, 2.15, 0.8, -1.2], [3.0, 2.05, 0.6, -0.3]], soot: [[2.1, 2.75, 1.9, 2.9, 0.12]] });
  const atL = I.atL, LP = [atL(0, 0), atL(1, 0), atL(0, 1)];
  I.wear(atL, LP, { bloom: [[3.6, 0.4, 0.9, 0.6]], cracks: [[1.5, 3.3, 0.9, 2.0]], patches: [[2.4, 1.4, 0.9, 0.7, '#6a6454', false]] });
}

// ------------------------------------------------------------------ the strongbox: iron-bound, padlocked, chained to a ring in the wall
prop(5.5, () => {
  const x0 = -2.75, x1 = -1.75, z0 = 5.5, z1 = 6.0, h = 0.62;
  I.woodBox(x0, x1, 0, h, z0, z1, '#3e2e1e', { bw: 0.15 });
  for (const t of [0.12, 0.5, 0.88]) raw(I.rod([x0 + (x1 - x0) * t, 0.01, z0 - 0.01], [x0 + (x1 - x0) * t, h, z0 - 0.01], '#2e2c2a', 4) + I.rod([x0 + (x1 - x0) * t, h + 0.005, z0], [x0 + (x1 - x0) * t, h + 0.005, z1], '#2e2c2a', 3));
  for (let i = 0; i < 10; i++) raw(S.peg(x0 + (x1 - x0) * (0.12 + (i % 5) / 4 * 0.76), i < 5 ? 0.08 : h - 0.06, z0 - 0.012, { r: 0.008 }));
  figProp((x0 + x1) / 2, h - 0.1, z0 - 0.02, (f, u) => {
    f.line(ell([0, -0.03 * u], 0.028 * u, 0.03 * u, 0, 16).slice(8, 17), 3.6, '#1a1816');
    f.part([[-0.042 * u, -0.03 * u], [0.042 * u, -0.03 * u], [0.04 * u, 0.04 * u], [-0.04 * u, 0.04 * u]], { fill: '#3a3a3c', light: '#6a6a6c', shade: 0.4, inkW: 1.3, cast: false });
    f.flat([[-0.006 * u, 0.0], [0.006 * u, 0.0], [0.004 * u, 0.022 * u], [-0.004 * u, 0.022 * u]], '#0e0c0a'); f.flat(ell([0.02 * u, 0.02 * u], 0.012 * u, 0.008 * u, 0, 6), '#5a2a14', { op: 0.6 });
  }, { tag: false });
  // the dog-chain from the hasp to a ring leaded into the wall
  const ch = []; for (let k = 0; k <= 12; k++) { const t = k / 12; ch.push(P(-2.25 + (-HW + 0.02 + 2.25) * t, 0.5 - Math.sin(t * Math.PI) * 0.35 + t * 0.25, z0 - 0.02 + (5.75 - z0 + 0.02) * t)); }
  raw(`<path d="${S.smooth(ch, false, 0.5)}" stroke="${INK}" stroke-width="5" fill="none" stroke-dasharray="4 2"/><path d="${S.smooth(ch, false, 0.5)}" stroke="#4a4644" stroke-width="2.8" fill="none" stroke-dasharray="4 2"/>`);
  raw(S.peg(-HW + 0.01, 0.75, 5.75, { r: 0.016 }));
});

// ------------------------------------------------------------------ the back wall: shelves to the beams, crammed; posts in front
{
  const z = D1 - 0.34, zz = D1 - 0.17, rows = [0.0, 1.0, 1.6, 2.2, 2.8];
  const HELMC = ['#4a4e52', '#5a5450', '#4a3a2a', '#3a3a3e', '#6a4a30', '#2a2622'], LEATH = ['#3a2618', '#3a2a1e', '#5a3a22', '#2a2018', '#6a4a2a'], PACKC = ['#5a4a32', '#4a4a36', '#6a5038', '#3a3a2e'];
  const pick = a => a[Math.floor(R() * a.length)];
  const ITEMS = {
    helm: () => { const kind = pick(['kettle', 'cap', 'nasal', 'kettle', 'cap']), col = pick(HELMC); return [0.3 + (kind === 'kettle' ? 0.12 : 0), (f, u) => H.helm(f, u, kind, col), kind === 'kettle' ? 0.21 : 0.15]; },
    boots: () => { const col = pick(LEATH); return [0.34, (f, u) => H.bootPair(f, u, col), 0.17]; },
    pack: () => { const col = pick(PACKC); return [0.38, (f, u) => H.pack(f, u, col), 0.19]; },
    rope: () => [0.34, (f, u) => H.ropeCoil(f, u), 0.17],
    mail: () => [0.44, (f, u) => H.mail(f, u), 0.22],
    bowls: () => [0.24, (f, u) => H.bowls(f, u), 0.12],
    flasks: () => { const n = 2 + Math.floor(R() * 5), xs = []; let w = 0; for (let k = 0; k < n; k++) { xs.push([w, (R() - 0.5) * 0.06]); w += 0.07 + R() * 0.05; } return [w + 0.06, (f, u) => { for (const [dx] of xs) { f.raw(`<g transform="translate(${f1(dx * u)},0)">`); H.bottle(f, u); f.raw('</g>'); } }, 0.03]; },
    crock: () => [0.18, (f, u) => H.crock(f, u), 0.09],
    folds: () => { const n = 2 + Math.floor(R() * 3); return [0.48, (f, u) => H.folded(f, u, n), 0.24]; },
    lamp: () => [0.24, (f, u) => { f.line([[0, -0.3 * u], [0, -0.27 * u]], 1.4, '#1a1816'); f.part([[-0.06 * u, -0.25 * u], [0.06 * u, -0.25 * u], [0.065 * u, -0.02 * u], [-0.065 * u, -0.02 * u]], { fill: '#2a2826', shade: 0.4, inkW: 1.3 }); f.flat([[-0.045 * u, -0.22 * u], [0.045 * u, -0.22 * u], [0.045 * u, -0.05 * u], [-0.045 * u, -0.05 * u]], '#4a4436'); f.part([[-0.08 * u, -0.02 * u], [0.08 * u, -0.02 * u], [0.07 * u, 0], [-0.07 * u, 0]], { fill: '#2a2622', shade: 0.3, inkW: 1, cast: false }); f.part([[-0.08 * u, -0.25 * u], [0, -0.31 * u], [0.08 * u, -0.25 * u]], { fill: '#2a2622', shade: 0.3, inkW: 1.1, cast: false }); }, 0.12],
  };
  const stock = (Y, list) => {
    for (let X = -2.75; X < HW - 0.35;) {
      if (R() < 0.12) { X += 0.2 + R() * 0.3; continue; }
      const [w, draw, ax] = ITEMS[pick(list)](X);
      if (X + w > HW - 0.1) break;
      figProp(X + (ax ?? w / 2), Y + 0.001, zz + (R() - 0.5) * 0.06, draw, { tag: false });
      X += w * (0.95 + R() * 0.3);
    }
  };
  const lists = [[ 'pack', 'rope', 'boots', 'folds'], ['boots', 'boots', 'pack', 'mail', 'folds'], ['flasks', 'flasks', 'flasks', 'crock', 'bowls'], ['helm', 'helm', 'helm', 'mail', 'bowls'], ['pack', 'rope', 'folds', 'bowls', 'lamp']];
  prop(z, () => {
    // the wall behind the shelving, darker for the shade of the stock
    raw(PLW([I.atB(0, 0), I.atB(1, 0), I.atB(0, 1)], hatch3((s, t) => [-2.95 + s, t, D1 - 0.005], 0, HW + 2.95, 0, HT, 0.8, { op: 0.35, ragged: 0.3 })));
    rows.forEach((Y, i) => {
      const board = () => { if (i > 0) I.woodBox(-2.95, HW, Y - 0.06, Y, z, D1 - 0.01, mix(WOODL, '#3a2a1a', R() * 0.3), { bw: 0.12, knots: 0.3, cast: false, boards: 1, topBoards: 2, segs: 3 }); };
      if (Y <= 1.6) { board(); stock(Y, lists[i]); } else { stock(Y, lists[i]); board(); }
      // the shadow each shelf throws on the wall under it
      if (i > 0) raw(PLW([I.atB(0, 0), I.atB(1, 0), I.atB(0, 1)], hatch3((s, t) => [-2.95 + s, Y - 0.06 - t, D1 - 0.006], 0, HW + 2.95, 0, 0.22, 0.6, { op: 0.4, ragged: 0.4 })));
    });
    for (const X of [-2.95, -0.3, 2.2, HW - 0.05]) I.woodBox(X - 0.05, X + 0.05, 0, HT, z - 0.04, D1 - 0.01, mix(WOOD, '#000', 0.1), { boards: 1, knots: 0.5, cast: false, segs: 1 });
    // the price slate hooked to a post: rows of chalk marks and tallies
    figProp(-0.28, 1.5, z - 0.07, (f, u) => {
      f.line([[0, -0.24 * u], [-0.03 * u, -0.2 * u]], 1.4, '#8a7a56'); f.line([[0, -0.24 * u], [0.03 * u, -0.2 * u]], 1.4, '#8a7a56');
      f.part([[-0.14 * u, -0.2 * u], [0.14 * u, -0.2 * u], [0.14 * u, 0.18 * u], [-0.14 * u, 0.18 * u]].map(p => [p[0], p[1], 1]), { fill: '#5a4430', shade: 0.35, inkW: 1.6, cast: false, tex: PR.T(f, 'wood'), texOp: 0.4 });
      f.part([[-0.12 * u, -0.18 * u], [0.12 * u, -0.18 * u], [0.12 * u, 0.16 * u], [-0.12 * u, 0.16 * u]].map(p => [p[0], p[1], 1]), { fill: '#2a2a2c', shade: 0.2, inkW: 1, cast: false, hatch: false });
      for (let r = 0; r < 5; r++) { const y = -0.14 * u + r * 0.065 * u; f.line([[-0.1 * u, y], [-0.02 * u, y]], 1, '#c8c0b0', { op: 0.7 }); for (let k = 0; k < 1 + (r * 7) % 4; k++) f.line([[0.01 * u + k * 0.02 * u, y - 0.015 * u], [0.01 * u + k * 0.02 * u, y + 0.015 * u]], 1, '#c8c0b0', { op: 0.75 }); }
      f.flat(ell([0.05 * u, 0.1 * u], 0.05 * u, 0.02 * u, 0.2, 8), '#a8aaa4', { op: 0.12 });
    }, { tag: false });
  });
}
// ------------------------------------------------------------------ the left lantern on the shelf post (drawn here, its light registered last)
prop(6.15, () => H.lantern(-2.95, 2.2, 1.98, 6.15, { size: 0.8 }));
// ------------------------------------------------------------------ hung from the beams: cloaks for sale, each its own wool and wear
prop(5.6, () => {
  for (const [X, col, L] of [[-2.4, '#3a3a34', 1.05], [-1.75, '#5a3a2a', 0.85], [-1.2, '#2a3036', 0.95]]) {
    raw(I.rod([X, HT - 0.3, 5.6], [X, HT - 0.4, 5.6], '#2a2826', 1.4));
    figProp(X, HT - 0.4, 5.6, (f, u) => {
      const l = L * u, sh = 0.1 * u, he = 0.27 * u, lean = (f.r() - 0.5) * 0.04 * u;
      f.line([[0, -0.02 * u], [0, 0.02 * u]], 2, '#1a1816');
      // the body of the cloak: gathered at the neck on the hook, falling and widening to a ragged hem
      const body = [[-sh * 0.4, 0.02 * u], [sh * 0.4, 0.02 * u], [sh, 0.1 * u], [he * 0.8 + lean, l * 0.55], [he + lean, l * 0.95], [he * 0.5 + lean, l * 0.99], [lean, l * 0.94], [-he * 0.45 + lean, l], [-he + lean, l * 0.96], [-he * 0.8 + lean, l * 0.5], [-sh, 0.1 * u]];
      f.part(body, { fill: col, tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.45 });
      for (const k of [-0.6, -0.2, 0.25, 0.6]) f.line([[sh * k * 0.8, 0.08 * u], [he * k * 0.7 + lean * 0.5, l * 0.5], [he * k * 0.9 + lean, l * 0.95]], 1.4, '#140c06', { op: 0.55 });
      // the hood hanging down the back, its dark mouth, and a mud line along the hem
      f.part([[-sh * 0.9, 0.06 * u], [sh * 0.9, 0.06 * u], [sh * 1.1, 0.22 * u], [0, 0.3 * u], [-sh * 1.1, 0.22 * u]], { fill: mix(col, '#000', 0.12), shade: 0.4, inkW: 1.3, cast: false, tex: PR.T(f, 'weave'), texOp: 0.4 });
      f.flat([[-sh * 0.5, 0.07 * u], [sh * 0.5, 0.07 * u], [0, 0.13 * u]], '#0e0a08', { op: 0.45 });
      f.line([[-he + lean, l * 0.93], [lean, l * 0.9], [he + lean, l * 0.92]], 3, '#2a2014', { op: 0.45 });
      if (f.r() < 0.7) f.stitches([[-he * 0.3, l * 0.6], [-he * 0.05, l * 0.72]], '#a89a7a');
    }, { tag: false });
  }
});
// ------------------------------------------------------------------ the dole hatch in the right wall: shutters thrown back into the room, the
// garth beyond at dusk with the queue waiting in the brazier light
{
  const atR = (s, t) => [HW, t, s], z0 = 4.72, z1 = 5.15, y0 = 0.95, y1 = 2.05;
  const hole = [atR(z0, y0), atR(z1, y0), atR(z1, y1), atR(z0, y1)];
  through(hole, () => {
    const XF = HW + 3, fp = (Z, Y) => [XF, Y, Z];
    const far = [fp(z0 - 1.5, y0 - 1.5), fp(z1 + 7, y0 - 1.5), fp(z1 + 7, y1 + 2.5), fp(z0 - 1.5, y1 + 2.5)];   // the far side of the garth: seen through the hatch only far back (the hatch is seen very obliquely)
    raw(PLW([far[0], far[1], far[3]], `<g class="em">${cel(far.map(p => P(...p)), { Z: 7, fill: '#6a4a30', band: 0, ink: false })}<path d="${pp(far)}" fill="url(#mottle)" opacity="0.5"/></g>` + hatch3((s, t) => fp(z0 - 1.5 + s, y1 + t), 0, 9, 0, 2.5, 0.2, { op: 0.4, ragged: 0.3 })));
    // the brazier out in the garth: its fire and its glow on the trodden ground
    figProp(HW + 2.2, 0.55, 7.5, (f, u) => { f.part([[-0.2 * u, 0], [0.2 * u, 0], [0.16 * u, 0.12 * u], [-0.16 * u, 0.12 * u]], { fill: '#2a2622', shade: 0.4, inkW: 1.4, cast: false }); PR.fire(f, 0.36 * u, 0.42 * u, { n: 6 }); }, { em: true, tag: false });
    raw(glow(...P(HW + 2.2, 0.8, 7.5), K(7.5) * 0.9, K(7.5) * 0.8, '#ffb050', 0.5));
    // the queue: a hooded woman nearest, holding up her bowl; a man behind her; a child's head at the sill
    figProp(HW + 0.8, 0, 5.9, (f, u) => {
      f.part([[-0.3 * u, 0], [-0.28 * u, -0.9 * u], [-0.22 * u, -1.25 * u], [-0.12 * u, -1.42 * u], [0.02 * u, -1.6 * u, 1], [0.16 * u, -1.46 * u], [0.22 * u, -1.24 * u], [0.3 * u, -0.9 * u], [0.32 * u, 0]], { fill: '#1e1a16', shade: 0.25, inkW: 2, cast: false, tex: PR.T(f, 'weave'), texOp: 0.4 });
      f.part([[-0.1 * u, -1.36 * u], [0.0, -1.5 * u], [0.12 * u, -1.38 * u], [0.1 * u, -1.24 * u], [-0.08 * u, -1.24 * u]], { fill: '#0e0c0a', shade: 0.1, inkW: 1.2, cast: false, hatch: false });
      f.line([[0.24 * u, -1.0 * u], [-0.1 * u, -1.12 * u], [-0.24 * u, -1.1 * u]], 9, '#1e1a16'); f.part(ell([-0.3 * u, -1.1 * u], 0.035 * u, 0.025 * u, 0, 8), { fill: '#8a6a50', shade: 0.4, inkW: 1, cast: false });
      f.part([[-0.46 * u, -1.12 * u], [-0.28 * u, -1.12 * u], [-0.31 * u, -1.06 * u], [-0.43 * u, -1.06 * u]], { fill: '#6a5440', shade: 0.4, inkW: 1.2, cast: false });
      f.line([[0.2 * u, -1.42 * u], [0.27 * u, -1.0 * u]], 1.6, '#c87a3a', { op: 0.7 });
    }, { tag: false });
    figProp(HW + 1.4, 0, 6.6, (f, u) => { f.part([[-0.32 * u, 0], [-0.3 * u, -1.2 * u], [-0.14 * u, -1.5 * u], [0.06 * u, -1.72 * u, 1], [0.2 * u, -1.5 * u], [0.32 * u, -1.2 * u], [0.34 * u, 0]], { fill: '#16120e', shade: 0.2, inkW: 1.6, cast: false }); f.line([[0.24 * u, -1.5 * u], [0.32 * u, -1.1 * u]], 1.6, '#c87a3a', { op: 0.6 }); }, { tag: false });
    // the reveal: the wall's thickness, coursed rubble on its far side, the sill in the light
    raw(PLW([[HW, 0, z1], [HW + 1, 0, z1], [HW, 1, z1]], S.ashlar((s, t) => [HW + s, y0 + t, z1], 0.16, y1 - y0, '#4a443a', { scale: 0.3, wscale: 0.3 }) + hatch3((s, t) => [HW + s, y0 + t, z1], 0, 0.16, 0, y1 - y0, 0.8, { op: 0.45 })));   // a thin wall: the hatch is cut through the timber-framed east range
    raw(PLW([[HW, y0, z0], [HW + 1, y0, z0], [HW, y0, z1]], cel([[HW, y0, z0], [HW + 0.16, y0, z0], [HW + 0.16, y0, z1], [HW, y0, z1]].map(p => P(...p)), { Z: 5, fill: '#6a5440', tex: 'url(#mottle)', texOp: 0.5 })));
  });
  // the frame, the sill board and the two shutters folded back against the inside of the wall
  for (const [p, q] of [[[z0 - 0.08, y0 - 0.06], [z0, y1 + 0.08]], [[z1, y0 - 0.06], [z1 + 0.08, y1 + 0.08]], [[z0 - 0.08, y1], [z1 + 0.08, y1 + 0.1]]]) I.woodFace([atR(p[0], q[1]), atR(q[0], q[1]), atR(q[0], p[1]), atR(p[0], p[1])], '#3e2e20', { boards: 1, knots: 0.3, segs: 1 });
  I.woodBox(HW - 0.25, HW, y0 - 0.06, y0, z0 - 0.12, z1 + 0.12, '#6a5440', { cast: false, boards: 1, topBoards: 1, segs: 1 });
  I.woodFace([[HW - 0.02, y1, z0 - 0.1], [HW - 0.04, y1, z0 - 0.31], [HW - 0.04, y0, z0 - 0.31], [HW - 0.02, y0, z0 - 0.1]], '#4a3826', { bw: 0.1, segs: 1 });
  for (const Y of [y0 + 0.15, y1 - 0.15]) raw(I.rod([HW - 0.03, Y, z0 - 0.3], [HW - 0.02, Y, z0 - 0.06], '#2e2c2a', 2.4));
  addLight(HW - 0.35, 1.45, (z0 + z1) / 2, 0.9, 4.5, [1.0, 0.62, 0.32]);         // light 2
  layer('fx'); raw(glow(...P(HW - 0.4, 1.4, (z0 + z1) / 2), K(4.9) * 1.6, K(4.9) * 1.3, '#ff9a4a', 0.3)); layer('bg');
  prop(5.0, () => figProp(HW - 0.12, y0, 5.08, (f, u) => { f.part([[-0.1 * u, -0.045 * u], [0.1 * u, -0.045 * u], [0.07 * u, 0], [-0.07 * u, 0]], { fill: '#6a5440', shade: 0.4, inkW: 1.3 }); f.flat(ell([0, -0.045 * u], 0.08 * u, 0.012 * u, 0, 10), '#2a1a10'); }));
}
// ------------------------------------------------------------------ the lantern on its hook over the counter
prop(4.4, () => H.lantern(-0.3, HT - 0.3, 2.25, 4.4, { light: [-0.3, 2.2, 4.35, 1.1, 4.5, [1.0, 0.68, 0.36]] }));   // light 3
// ------------------------------------------------------------------ the floor: straw and grit trodden in, drifts against the walls and under
// the shelving, scuffs where the queue's feet come in by the hatch
{
  const atF = I.atF;
  for (const [Xc, Zc, w, h] of [[-3.8, 4.2, 0.7, 2.4], [-0.5, 6.2, 3.0, 0.4], [3.7, 4.0, 0.8, 1.4], [3.6, 6.3, 1.0, 0.4]]) DR.drift(atF, Xc + HW, Zc - D0, w, h, { base: '#4e4428', n: Math.round(w * h * 300) });
  let o = ''; for (let i = 0; i < 7; i++) o += S.stain(...P(-1 + R() * 4.5, 0, 4.4 + R() * 1.6), K(5) * (0.2 + R() * 0.3), '#140c06', 0.22);
  raw(PLW(FLOOR, o + S.strew(atF, 0.5, 2 * HW - 0.5, 0.3, D1 - D0 - 0.3, 160, { len: 0.12 })));
}

// ================================================================== MID: the counter, the open ledger, the old ledger under the dish of ostia
layer('mid');
prop(CTR.z0, () => {
  const { x0, x1, z0, z1, top } = CTR;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(x0, x1, 0, top, z0, z1), [0, 1, 0], 0), z0, { op: 0.32 })));
  // a heavy boarded counter: front boards, iron strap, a lock plate on the alms box; scarred where coin is slapped down
  I.woodFace([[x0, top - 0.06, z0], [x1, top - 0.06, z0], [x1, 0.02, z0], [x0, 0.02, z0]], '#4a3624', { bw: 0.2, stains: 0.4 });
  for (const XX of [x0 + 0.03, x1 - 0.03]) I.beam(XX - 0.04, XX + 0.04, 0, top - 0.06, z0 - 0.03, z0 + 0.05, WOOD, { knots: 0.5 });
  raw(I.rod([x0 + 0.05, 0.34, z0 - 0.012], [x1 - 0.05, 0.34, z0 - 0.012], '#2e2c2a', 4));
  {
    let sc = ''; for (let k = 0; k < 20; k++) { const [gx, gy] = P(x0 + 0.1 + R() * (x1 - x0 - 0.2), 0.45 + R() * 0.4, z0 - 0.01); sc += `<path d="M${f1(gx)} ${f1(gy)} l${f1(5 + R() * 14)} ${f1((R() - 0.5) * 6)}" stroke="#140c06" stroke-width="${f1(1 + R() * 1.4)}" opacity="0.7"/><path d="M${f1(gx)} ${f1(gy + 1.4)} l${f1(5 + R() * 10)} ${f1((R() - 0.5) * 5)}" stroke="#a8845a" stroke-width="0.7" opacity="0.45"/>`; }
    raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], sc));
    // a price notice nailed to the front: a scrap of vellum, his hand, red at the head
    const nt = [[0.05, 0.5, z0 - 0.014], [0.5, 0.52, z0 - 0.014], [0.49, 0.82, z0 - 0.014], [0.06, 0.8, z0 - 0.014]];
    let n = cel(nt.map(p => P(...p)), { Z: z0, fill: '#b8aa88', tex: 'url(#mottle)', texOp: 0.4, band: 1.2 });
    for (let r = 0; r < 6; r++) { const A = P(0.09, 0.76 - r * 0.045, z0 - 0.015), B = P(0.44 - R() * 0.1, 0.76 - r * 0.045, z0 - 0.015); n += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${r ? '#3a3028' : '#8a1a14'}" stroke-width="${r ? 0.9 : 1.4}" opacity="0.75"/>`; }
    raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], n)); raw(S.peg(0.08, 0.78, z0 - 0.016, { r: 0.006 }) + S.peg(0.47, 0.8, z0 - 0.016, { r: 0.006 }));
    // the alms box's lock plate and slot, toward Fenn's end
    figProp(1.7, 0.62, z0 - 0.015, (f, u) => { f.part([[-0.07 * u, -0.06 * u], [0.07 * u, -0.06 * u], [0.07 * u, 0.06 * u], [-0.07 * u, 0.06 * u]].map(p => [p[0], p[1], 1]), { fill: '#3a3a3c', light: '#6a6a6c', shade: 0.35, inkW: 1.2, cast: false }); f.flat([[-0.012 * u, -0.025 * u], [0.012 * u, -0.025 * u], [0.012 * u, 0.025 * u], [-0.012 * u, 0.025 * u]], '#0e0c0a'); for (const [x, y] of [[-0.055, -0.045], [0.055, -0.045], [-0.055, 0.045], [0.055, 0.045]]) f.rivet([x * u, y * u], 1.8, '#6a6a6a'); }, { tag: false });
  }
  // the top: a moulded edge, then the boards along the counter, worn pale where the coin is pushed across
  I.woodFace([[x0 - 0.06, top, z0 - 0.06], [x1 + 0.06, top, z0 - 0.06], [x1 + 0.06, top - 0.06, z0 - 0.06], [x0 - 0.06, top - 0.06, z0 - 0.06]], mix(WOODL, '#000', 0.15), { boards: 1, segs: 2 });
  I.woodFace([[x0 - 0.06, top, z1], [x1 + 0.06, top, z1], [x1 + 0.06, top, z0 - 0.06], [x0 - 0.06, top, z0 - 0.06]], WOODL, { bw: 0.11, stains: 0.5, segs: 2 });
  raw(PLW([[0, top, 1], [1, top, 1], [0, top, 2]], S.stain(...P(0.95, top, 3.88), K(3.9) * 0.3, '#e8d0a0', 0.12) + `<path d="M${f1(P(-0.15, top + 0.001, z0 - 0.04)[0])} ${f1(P(-0.15, top + 0.001, z0 - 0.04)[1])} L${f1(P(0.6, top + 0.001, z1)[0])} ${f1(P(0.6, top + 0.001, z1)[1])}" stroke="#140c06" stroke-width="1" opacity="0.4"/>`));
  const tp = [[0, top, 1], [1, top, 1], [0, top, 2]];
  // ---- his oldest ledger, closed at the left end of the counter, the dish of ostia set on it. Thick, its boards scuffed through
  // at the corners; the page block's fore-edge toward us stained sulphur yellow, darkest in a tide line, crystals in the edge
  {
    const bx0 = -0.4, bx1 = -0.02, bz0 = 3.86, bz1 = 4.1, t0 = top + 0.004, t1 = top + 0.1, bd = 0.016;
    const face = (q, fill, o2 = {}) => raw(PLW(tp, cel(q.map(p => P(...p)), Object.assign({ Z: bz0, fill, band: 1.2 }, o2))));
    face([[bx0, t0, bz0], [bx1, t0, bz0], [bx1, t0 + bd, bz0], [bx0, t0 + bd, bz0]], '#3a2618');
    const fe = [[bx0 + 0.008, t0 + bd, bz0 + 0.004], [bx1 - 0.008, t0 + bd, bz0 + 0.004], [bx1 - 0.008, t1 - bd, bz0 + 0.004], [bx0 + 0.008, t1 - bd, bz0 + 0.004]];
    let s = cel(fe.map(p => P(...p)), { Z: bz0, fill: '#cdbf98', band: 0.8, hi: false });
    // the leaves, the stain soaked up from below, its tide line, a bloom higher up, the crystals
    for (let i = 1; i < 9; i++) { const y = t0 + bd + (t1 - t0 - 2 * bd) * i / 9, A = P(bx0 + 0.01, y, bz0 + 0.003), B = P(bx1 - 0.01, y + (R() - 0.5) * 0.002, bz0 + 0.003); s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#6a5a3a" stroke-width="0.6" opacity="0.5"/>`; }
    const tide = []; for (let i = 0; i <= 14; i++) { const u = i / 14; tide.push(P(bx0 + 0.01 + (bx1 - bx0 - 0.02) * u, t0 + bd + 0.016 + 0.008 * Math.sin(u * 9 + 1) + 0.004 * Math.sin(u * 23) + (u > 0.75 ? 0.01 : 0), bz0 + 0.003)); }
    const lowEdge = [P(bx1 - 0.01, t0 + bd, bz0 + 0.003), P(bx0 + 0.01, t0 + bd, bz0 + 0.003)];
    s += `<path d="${p2([...tide, ...lowEdge])}" fill="${SUL}" opacity="0.5"/><path d="${S.smooth(tide, false, 0.5)}" stroke="${SULD}" stroke-width="1.1" fill="none" opacity="0.85"/>`;
    s += `<ellipse cx="${f1(P(bx1 - 0.06, t1 - 0.03, bz0)[0])}" cy="${f1(P(bx1 - 0.06, t1 - 0.03, bz0)[1])}" rx="4" ry="1.6" fill="${SUL}" opacity="0.45"/>`;
    for (const u of [0.18, 0.33, 0.86]) { const [x, y] = P(bx0 + (bx1 - bx0) * u, t0 + bd + 0.012, bz0 + 0.002); s += `<path d="M${f1(x)} ${f1(y)} l1.6 -1.8 l1.6 1.8 l-1.6 1.4 Z" fill="#e8d468" stroke="${SULD}" stroke-width="0.4"/>`; }
    raw(PLW(tp, s));
    face([[bx0 - 0.005, t1 - bd, bz0 - 0.004], [bx1 + 0.005, t1 - bd, bz0 - 0.004], [bx1 + 0.005, t1, bz0 - 0.004], [bx0 - 0.005, t1, bz0 - 0.004]], '#3e2a1a');
    face([[bx0 - 0.005, t1, bz0 - 0.004], [bx1 + 0.005, t1, bz0 - 0.004], [bx1 + 0.005, t1, bz1], [bx0 - 0.005, t1, bz1]], '#4a3020', { tex: 'url(#mottle)', texOp: 0.6 });
    let c = ''; for (const [X, Z] of [[bx0 + 0.02, bz0 + 0.01], [bx1 - 0.02, bz0 + 0.01], [bx0 + 0.02, bz1 - 0.02]]) { const [x, y] = P(X, t1 + 0.001, Z); c += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="4.5" ry="1.8" fill="#7a5a3a" opacity="0.8"/>`; }
    { const [x, y] = P((bx0 + bx1) / 2 - 0.05, t1 + 0.001, bz0 + 0.02); c += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="7" ry="1.6" fill="${SUL}" opacity="0.5"/>`; }
    raw(PLW(tp, c));
    // the pewter dish of lead ostia on it
    figProp((bx0 + bx1) / 2 + 0.02, t1, (bz0 + bz1) / 2, (f, u) => {
      f.part(ell([0, -0.012 * u], 0.13 * u, 0.04 * u, -0.03, 18), { fill: '#7a7a74', light: '#a8a8a0', shadow: '#3a3a38', shade: 0.4, inkW: 1.3 });
      f.part(ell([0, -0.016 * u], 0.1 * u, 0.026 * u, -0.03, 16), { fill: '#5e5e5a', shade: 0.25, inkW: 0.9, cast: false, hatch: false });
      for (const [x, y] of [[-0.05, -0.016], [0.0, -0.022], [0.05, -0.014], [-0.02, -0.01], [0.03, -0.028]]) { f.raw(`<g transform="translate(${f1(x * u)},${f1(y * u)}) scale(0.9)">`); H.ostia(f, u, 1); f.raw('</g>'); }
    }, { tag: false });
  }
  // ---- the balance in bronze at the back, stacks of lead ostia in front of it
  figProp(0.22, top, 4.08, (f, u) => H.balance(f, u), { tag: false });
  for (const [X, Z, n] of [[0.28, 3.86, 6], [0.38, 3.9, 3], [0.45, 3.84, 8], [0.12, 3.82, 4]]) figProp(X, top, Z, (f, u) => H.ostia(f, u, n), { tag: false });
  // ---- the open ledger (the panel): red leather boards, the page block, two pages ruled in red and black, a red margin
  {
    const { X, Z } = LEDGER, w = 0.42, d = 0.3, t = top + 0.04;
    const L = [[X - w, t, Z - d / 2], [X, t + 0.02, Z - d / 2], [X, t + 0.02, Z + d / 2], [X - w, t, Z + d / 2]], Rr = [[X, t + 0.02, Z - d / 2], [X + w, t, Z - d / 2], [X + w, t, Z + d / 2], [X, t + 0.02, Z + d / 2]];
    raw(PLW(tp, cel([[X - w - 0.02, top + 0.005, Z - d / 2 - 0.02], [X + w + 0.02, top + 0.005, Z - d / 2 - 0.02], [X + w + 0.02, top + 0.005, Z + d / 2 + 0.02], [X - w - 0.02, top + 0.005, Z + d / 2 + 0.02]].map(p => P(...p)), { Z, fill: '#4e1a12', tex: 'url(#mottle)', texOp: 0.5, band: 1.4 })));
    raw(PLW(tp, cel([[X - w - 0.01, top + 0.006, Z - d / 2 - 0.015], [X + w + 0.01, top + 0.006, Z - d / 2 - 0.015], [X + w + 0.01, t, Z - d / 2 - 0.015], [X - w - 0.01, t, Z - d / 2 - 0.015]].map(p => P(...p)), { Z, fill: '#c8b890', band: 0.6 })));
    for (const pg of [L, Rr]) {
      let s = cel(pg.map(p => P(...p)), { Z, fill: '#d6c8a6', tex: 'url(#mottle)', texOp: 0.35, band: 1.4 });
      for (let r = 0; r < 8; r++) { const zz = Z - d / 2 + 0.03 + r * 0.033, xa = pg[0][0] + 0.03, xb = pg[1][0] - 0.03, A = P(xa, t + 0.012, zz), B = P(xb - R() * 0.04, t + 0.012, zz); s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${r === 0 ? '#8a1a14' : '#3a3028'}" stroke-width="${r === 0 ? 1.6 : 0.9}" opacity="0.75"${r ? ' stroke-dasharray="4 1.2 6 1.2 2 1.2"' : ''}/>`; }
      for (const u of [0.07, 0.72]) { const A = P(pg[0][0] + (pg[1][0] - pg[0][0]) * u, t + 0.012, Z - d / 2 + 0.015), B = P(pg[0][0] + (pg[1][0] - pg[0][0]) * u, t + 0.012, Z + d / 2 - 0.015); s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#8a1a14" stroke-width="0.9" opacity="0.6"/>`; }
      raw(PLW(tp, s));
    }
    { const A = P(X, t + 0.022, Z - d / 2), B = P(X, t + 0.022, Z + d / 2); raw(PLW(tp, `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="1.8" opacity="0.8"/>`)); }
    { const A = P(X - 0.05, t + 0.02, Z - d / 2), B = P(X - 0.04, t - 0.045, Z - d / 2 - 0.03); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="4"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#6a1a14" stroke-width="2.4"/>`); }
  }
  // inkhorn and quill, his purse fat with ostia, two candles at Fenn's end
  figProp(LEDGER.X + 0.54, top, 3.9, (f, u) => { f.part([[-0.03 * u, 0], [-0.04 * u, -0.07 * u], [0.04 * u, -0.07 * u], [0.03 * u, 0]], { fill: '#2a1e14', shade: 0.4, inkW: 1.3 }); f.flat(ell([0, -0.07 * u], 0.035 * u, 0.01 * u, 0, 8), '#0a0a0e'); f.line([[0, -0.07 * u], [0.08 * u, -0.22 * u], [0.2 * u, -0.3 * u]], 1.6, '#e8e0d0'); f.line([[0.08 * u, -0.2 * u], [0.2 * u, -0.3 * u]], 3, '#d8d0bc', { op: 0.8 }); }, { tag: false });
  figProp(1.72, top, 4.07, (f, u) => { f.part([[-0.12 * u, 0], [-0.13 * u, -0.08 * u], [-0.05 * u, -0.15 * u], [0.07 * u, -0.14 * u], [0.13 * u, -0.06 * u], [0.11 * u, 0]], { fill: '#5a3a22', shadow: '#2a1810', shade: 0.4, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.part([[-0.06 * u, -0.14 * u], [0.06 * u, -0.14 * u], [0.04 * u, -0.17 * u], [-0.04 * u, -0.17 * u]], { fill: '#4a2e1a', shade: 0.3, inkW: 1.1, cast: false }); f.line([[-0.06 * u, -0.06 * u], [0.04 * u, -0.1 * u]], 1.1, '#8a6a4a', { op: 0.5 }); f.part(ell([0.02 * u, -0.06 * u], 0.012 * u, 0.01 * u, 0, 8), { fill: H.LEAD, inkW: 0.8, cast: false, hatch: false }); }, { tag: false });
  H.candles(2.0, 4.05, 2, top, 0.18, { light: false });
  addLight(2.0, 1.16, 3.9, 0.24, 2.4, [1.0, 0.74, 0.44]);                          // light 4 (grim's candles)
  addLight(1.8, 1.25, 3.95, 0.45, 2.6, [1.0, 0.72, 0.42]);                          // light 5
});
{
  const { X, Z } = LEDGER, w = 0.44, d = 0.32, t = CTR.top + 0.06;
  hot('ledger', 'The ledger', [P(X - w - 0.05, t, Z - d / 2 - 0.05), P(X + w + 0.05, t, Z - d / 2 - 0.05), P(X + w + 0.05, t, Z + d / 2 + 0.05), P(X - w - 0.05, t, Z + d / 2 + 0.05)]);
  outline('ledger', [[[[X - w - 0.03, t, Z - d / 2 - 0.03], [X + w + 0.03, t, Z - d / 2 - 0.03], [X + w + 0.03, t, Z + d / 2 + 0.03], [X - w - 0.03, t, Z + d / 2 + 0.03]], true]]);
}

// ================================================================== FG
layer('fg');
// near left: spears leaned on a crate of salvage, a cracked shield (faded blue, old blood) against it
prop(3.1, () => {
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(-2.6, -2.0, 0, 0.45, 3.1, 3.5), [0, 1, 0], 0), 3.1, { op: 0.28 })));
  for (const [a, b] of [[[-2.75, 0, 3.25], [-2.35, 1.4, 3.45]], [[-2.6, 0, 3.25], [-2.1, 1.45, 3.5]], [[-2.5, 0, 3.2], [-2.45, 1.55, 3.5]]]) {
    raw(I.rod(a, b, WOOD, 4));
    figProp(...b, (f, u) => { const dx = (b[0] - a[0]), dy = (b[1] - a[1]), l = Math.hypot(dx, dy), ux = dx / l, uy = -dy / l, nx = -uy, ny = ux, L = 0.16 * u, W = 0.025 * u; f.part([[nx * W, ny * W], [ux * L, uy * L, 1], [-nx * W, -ny * W], [-ux * 0.03 * u - nx * W * 0.6, -uy * 0.03 * u - ny * W * 0.6], [-ux * 0.03 * u + nx * W * 0.6, -uy * 0.03 * u + ny * W * 0.6]], { fill: '#5a5e62', light: '#9aa0a4', shade: 0.4, inkW: 1.2, cast: false }); f.flat(ell([ux * L * 0.4, uy * L * 0.4], W * 0.5, W * 0.3, 0, 6), '#5a2a14', { op: 0.6 }); }, { tag: false });
  }
  I.woodBox(-2.6, -2.0, 0, 0.45, 3.1, 3.5, '#5a4430', { bw: 0.11, cast: false });
  figProp(-2.3, 0.45, 3.3, (f, u) => { H.folded(f, u, 2, ['#3a3a34', '#5a4a3a']); }, { tag: false });
  figProp(-1.9, 0.0, 2.95, (f, u) => {
    const s = u;
    const sh = [[-0.3 * s, -0.66 * s], [0.3 * s, -0.66 * s], [0.28 * s, -0.3 * s], [0, 0], [-0.28 * s, -0.3 * s]];
    f.part(sh, { fill: '#3a4a5a', shadow: '#1e2630', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.6, inkW: 2.2 });
    f.flat([[-0.29 * s, -0.42 * s], [0, -0.56 * s], [0.29 * s, -0.42 * s], [0.285 * s, -0.33 * s], [0, -0.47 * s], [-0.28 * s, -0.33 * s]], '#8a8268', { op: 0.85 }); f.line([[-0.29 * s, -0.42 * s], [0, -0.56 * s], [0.29 * s, -0.42 * s]], 1, INK, { op: 0.6 }); f.line([[-0.28 * s, -0.33 * s], [0, -0.47 * s], [0.285 * s, -0.33 * s]], 1, INK, { op: 0.6 });
    f.line(sh.concat([sh[0]]), 3.4, '#5a4430', { op: 0.9 });
    f.line([[-0.05 * s, -0.66 * s], [0.08 * s, -0.26 * s], [-0.02 * s, -0.06 * s]], 2.4, '#0a0806');
    for (let k = 0; k < 9; k++) { const x = (f.r() - 0.5) * 0.45 * s, y = -0.15 * s - f.r() * 0.45 * s; f.line([[x, y], [x + (f.r() - 0.5) * 0.12 * s, y + (f.r() - 0.3) * 0.06 * s]], 1.2, '#d8c8a8', { op: 0.5 }); }
    // the charge: a worn roundel in dull ochre paint (not red: red is kept for blood, doom and rubric), flaked to the blue
    f.flat(ell([0.02 * s, -0.25 * s], 0.085 * s, 0.085 * s, 0, 16), '#7a5e30', { op: 0.9 }); f.line(ell([0.02 * s, -0.25 * s], 0.085 * s, 0.085 * s, 0, 16).concat([[0.105 * s, -0.25 * s]]), 1.2, INK, { op: 0.55 });
    for (let k = 0; k < 3; k++) { const a = 0.6 + k * 1.9 + f.r() * 0.6; f.flat(ell([0.02 * s + Math.cos(a) * 0.075 * s, -0.25 * s + Math.sin(a) * 0.075 * s], 0.026 * s, 0.012 * s, a + 1.57, 7), '#3a4a5a', { op: 0.95 }); }   // chips knocked out of the rim
    for (const [rx, ry] of [[-0.24, -0.6], [0.24, -0.6], [-0.22, -0.34], [0.22, -0.34]]) f.rivet([rx * s, ry * s], 2.6, '#6a6a6a');
  }, { tag: false });
});
// the floor in front: straw, a few lead ostia dropped and not picked up (never gold coin), a tread of mud from the hatch
prop(3.5, () => {
  let o = S.strew(I.atF, 1.5, 7.5, 0.2, 1.2, 90, { len: 0.14 });
  raw(PLW(FLOOR, o));
  for (let k = 0; k < 4; k++) figProp(0.3 + R() * 1.6, 0, 3.0 + R() * 0.6, (f, u) => { f.raw(`<g transform="rotate(${f1((R() - 0.5) * 60)})">`); H.ostia(f, u, 1); f.raw('</g>'); }, { tag: false });
});
// hung from the front beam: a basket of tallow dips, a string of old shoes, a cold lantern for sale
for (const [X, Z, k] of [[-1.0, 4.6, 0], [0.9, 5.3, 1], [2.5, 4.9, 2]]) prop(Z, () => {
  const top = HT - 0.3; raw(I.rod([X, top, Z], [X, top - 0.3, Z], '#2a2826', 1.2));
  if (k === 2) return H.lantern(X, top - 0.3, top - 0.32, Z, { lit: false, size: 0.9 });
  figProp(X, top - 0.3, Z, (f, u) => {
    if (k === 0) { f.line([[-0.22 * u, 0.04 * u], [0, 0], [0.22 * u, 0.04 * u]], 1.2, '#2a2018'); f.line([[-0.24 * u, 0.04 * u], [0.24 * u, 0.04 * u]], 4.4, '#1a120c'); f.line([[-0.24 * u, 0.04 * u], [0.24 * u, 0.04 * u]], 2.6, WOODL); for (let i = 0; i < 7; i++) { const x = (-0.2 + i * 0.065) * u, l = (0.14 + f.r() * 0.06) * u; f.line([[x - 0.012 * u, 0.06 * u], [x, 0.035 * u], [x + 0.012 * u, 0.06 * u]], 0.8, '#2a2018'); for (const d of [-0.012, 0.012]) f.part([[x + d * u - 0.006 * u, 0.06 * u], [x + d * u + 0.006 * u, 0.06 * u], [x + d * u + 0.004 * u, 0.06 * u + l], [x + d * u, 0.065 * u + l], [x + d * u - 0.004 * u, 0.06 * u + l]], { fill: KK.P.wax, shadow: KK.P.waxD, shade: 0.3, inkW: 0.7, cast: false, hatch: false }); } }
    else for (let i = 0; i < 3; i++) { const x = (-0.1 + i * 0.1) * u, y = (0.05 + i * 0.04) * u; f.line([[0, 0], [x, y]], 1.2, '#8a7a56'); f.part([[x - 0.035 * u, y], [x + 0.035 * u, y], [x + 0.045 * u, y + 0.22 * u], [x - 0.045 * u, y + 0.22 * u]], { fill: i % 2 ? '#3a2618' : '#3a2a1e', shade: 0.45, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.part([[x - 0.045 * u, y + 0.22 * u], [x + 0.045 * u, y + 0.22 * u], [x + 0.06 * u, y + 0.3 * u], [x - 0.04 * u, y + 0.3 * u]], { fill: '#2a2018', shade: 0.4, inkW: 1.1, cast: false }); }
  }, { tag: false });
});
// near: an open sack of boots and a pair stood on it
prop(3.3, () => {
  figProp(-1.05, 0, 3.3, (f, u) => { PR.sack(f, 0, 0.7 * u, { open: true, contents: '#2a1e14' }); f.part([[-0.02 * u, -0.38 * u], [0.06 * u, -0.46 * u], [0.14 * u, -0.44 * u], [0.13 * u, -0.38 * u], [0.06 * u, -0.36 * u]], { fill: '#3a2618', shade: 0.4, inkW: 1.2, cast: false, tex: PR.T(f, 'mottle'), texOp: 0.5 }); f.line([[0.07 * u, -0.45 * u], [0.13 * u, -0.43 * u]], 1, '#8a6a4a', { op: 0.5 }); });
  figProp(-0.55, 0, 3.15, (f, u) => H.bootPair(f, u, '#4a3020'));
});
addLight(-2.95, 1.8, 5.9, 0.65, 4.5, [1.0, 0.72, 0.42]);                           // light 6 (the left lantern, drawn above)

// ================================================================== write
I.write(KEEPER, {}, OUT, { veil: { op: 0.52, cut: 0.32 } });
