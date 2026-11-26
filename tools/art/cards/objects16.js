// The card object library, part sixteen: the one-object-per-card pass (L72) for the Bulwark: an iron maiden, a mail
// hauberk grown through with briars, a palisade of sharpened stakes, a fur pelt mantle, a crenellated rampart under
// ice, a spiked buckler, a pavise, a yule log. Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const { flame } = require('./objects12').helpers;
const O = {}, META = {};
const ICE = '#d8e4ea', ICED = '#9ab4c4';
const frost = (f, F, x0, x1, y, n = 8) => { for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + 0.5) / n, h = 30 + ((i * 37) % 5) * 12; f.part(F([[x - 12, y], [x + 12, y], [x + 2, y + h]]), { fill: ICE, shade: 0.3, inkW: 1, cast: false, sharp: true }); } };

O.ironmaiden = (f, o = {}) => { // an iron maiden standing open: a tall coffin-shaped iron cabinet with a painted face, its two doors swung wide, rows of spikes inside the doors and the back
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const shell = [[-120, -330], [120, -330], [150, -230], [150, 320], [-150, 320], [-150, -230]]; P(f, F, shell, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, shell, 0.4, 9, 0.9, '#c8c8c4'); f.part(F(shell.map(p => mul(p, 0.84))), { fill: '#1a1612', shade: 0.15, inkW: 1.6, cast: false });
  P(f, F, ell([0, -260], 70, 60, 0, 18), '#c8a07c', { dress: false }); for (const x of [-24, 24]) f.part(F(ell([x, -270], 10, 6, 0, 8)), { fill: '#0a0806', shade: 0.1, inkW: 0.6, cast: false }); L(f, F, [[-20, -224], [20, -224]], 3, '#5a1a12');
  for (let y = -150; y < 280; y += 60) for (let x = -90; x <= 90; x += 60) f.part(F([[x - 9, y], [x + 9, y], [x, y - 22]]), { fill: '#b8bab6', shade: 0.3, inkW: 1, cast: false, sharp: true });
  for (const s of [-1, 1]) { const door = [[s * 150, -230], [s * 330, -280], [s * 330, 330], [s * 150, 320]]; P(f, F, door, '#4a4c50', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, door, 0.4, 9, s * 0.9, '#c8c8c4');
    for (let y = -200; y < 300; y += 60) for (let k = 0; k < 2; k++) { const x = s * (200 + k * 70); f.part(F([[x, y - 9], [x, y + 9], [x - s * 26, y]]), { fill: '#b8bab6', shade: 0.3, inkW: 1, cast: false, sharp: true }); }
    for (const y of [-180, 250]) f.part(F([[s * 140, y - 16], [s * 170, y - 16], [s * 170, y + 16], [s * 140, y + 16]]), { fill: '#2a2a2a', shade: 0.3, inkW: 1, cast: false }); }
  D.bloom(f, F([[-60, 100]])[0], 22, C.RUST, { n: 3 }); f.flat(F(ell([30, 60], 16, 26, 0, 10)), '#5c0f0b', { op: 0.6 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-335, -335, 335, 335]), feat: [], ells: [] };
};
META.ironmaiden = { act: 'open', noTurn: true, only: ['close', 'floor', 'niche'] };

O.hauberk = (f, o = {}) => { // briar mail: a riveted mail hauberk laid out flat, short sleeves and split skirt, thorned briar stems woven through its rings
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const sh = [[-120, -300], [-60, -260], [60, -260], [120, -300], [300, -220], [280, -100], [160, -140], [170, 300], [20, 300], [0, 200], [-20, 300], [-170, 300], [-160, -140], [-280, -100], [-300, -220]];
  P(f, F, sh, '#6a6c70', { tex: T(f, 'weave'), texOp: 1 });
  for (let y = -240; y < 290; y += 22) L(f, F, [[-290 + Math.max(0, y + 100) * 0.4, y], [290 - Math.max(0, y + 100) * 0.4, y]], 1.4, '#2a2a2c', { op: 0.6, dash: '8 6' });
  f.part(F(ell([0, -270], 60, 26, 0, 14)), { fill: '#1a1612', shade: 0.1, inkW: 1.4, cast: false });
  const stems = [[[-280, -160], [-100, -60], [80, -120], [260, -150]], [[-150, 260], [-40, 120], [60, 40], [140, -60]], [[-160, 60], [-60, 140], [60, 200], [150, 280]]];
  for (const s of stems) { const c = K.catmull(s, 6); L(f, F, c, 12, INK); L(f, F, c, 7, '#4a3a22'); for (let i = 2; i < c.length - 1; i += 2) { const d = norm(sub(c[i + 1], c[i - 1])), n = [-d[1], d[0]], side = i % 4 ? 1 : -1; f.part(F([add(c[i], mul(d, -9)), add(c[i], mul(n, side * 28)), add(c[i], mul(d, 9))]), { fill: '#3a2a18', shade: 0.2, inkW: 1, cast: false, sharp: true }); } for (const t of [0.3, 0.7]) { const p = c[Math.round(t * (c.length - 1))]; f.part(F(ell(add(p, [12, -16]), 22, 12, 0.6, 10)), { fill: '#4a5a30', shade: 0.3, inkW: 1, cast: false }); } }
  L(f, F, [[-260, -200], [-120, -250]], 6, '#e8e8e0', { op: 0.45 }); D.bloom(f, F([[100, 200]])[0], 24, C.RUST, { n: 3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-305, -305, 305, 305]), feat: [], ells: [] };
};
META.hauberk = { act: 'press', noTurn: true, only: ['close', 'floor', 'table', 'ledge'] };

O.stakes = (f, o = {}) => { // a palisade: a row of sharpened stakes driven into an earth bank, leaning outward, lashed with a rail, their points fire-hardened black
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-340, 180], [-200, 130], [200, 120], [340, 180], [340, 320], [-340, 320]], '#5a4430', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, [[-340, 180], [340, 180], [340, 320], [-340, 320]], 0.25, 10, 0.3);
  for (let i = 0; i < 7; i++) { const x = -270 + i * 90, lean = (i - 3) * 0.03 + 0.12, top = -300 + (i % 3) * 40, G = pts => F(pts.map(p => add([x, 200], rot(sub(p, [0, 200]), lean))));
    const st = [[-34, 200], [34, 200], [34, top + 80], [0, top], [-34, top + 80]]; P(f, G, st, i % 2 ? C.OAK : C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); f.part(G([[-34, top + 80], [34, top + 80], [0, top]]), { fill: '#1a120c', shade: 0.2, inkW: 1.4, cast: false, sharp: true }); L(f, G, [[-14, 180], [-14, top + 100]], 4, '#c8a070', { op: 0.4 }); }
  for (const y of [-40, 80]) { L(f, F, [[-320, y], [320, y - 10]], 18, INK); L(f, F, [[-320, y], [320, y - 10]], 12, C.OAK); for (let i = 0; i < 7; i++) { const x = -270 + i * 90; L(f, F, [[x - 30, y - 14], [x + 30, y + 10]], 4, C.TWINE); } }
  return { focus: F([[0, -120]])[0], sig: SB(F, [-340, -320, 340, 320]), feat: [], ells: [] };
};
META.stakes = { act: 'press', noTurn: true, only: ['close', 'floor'] };

O.pelt = (f, o = {}) => { // a fur mantle: a whole wolf pelt worn as a cloak, the head with its ears over the crown, the forelegs knotted at the chest, a bronze brooch, frost in the fur
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, FUR = '#6a6058';
  const cloak = [[-120, -200], [120, -200], [260, -60], [320, 300], [-320, 300], [-260, -60]]; P(f, F, cloak, FUR, { tex: T(f, 'weave'), texOp: 1 });
  for (let i = 0; i < 40; i++) { const x = -300 + (i * 61) % 600, y = -150 + ((i * 97) % 440); if (Math.abs(x) < 120 + (y + 200) * 0.45) L(f, F, [[x, y], [x + 8, y + 30]], 2.4, i % 3 ? '#3a342e' : '#a8a098', { op: 0.6 }); }
  const head = [[-110, -200], [-130, -270], [-90, -360], [-60, -300], [60, -300], [90, -360], [130, -270], [110, -200], [40, -150], [0, -120], [-40, -150]]; P(f, F, head, '#7a7068', { tex: T(f, 'weave'), texOp: 1 }); for (const x of [-46, 46]) f.part(F(ell([x, -220], 14, 8, 0, 8)), { fill: '#0a0806', shade: 0.1, inkW: 0.8, cast: false }); f.part(F(ell([0, -132], 18, 12, 0, 8)), { fill: '#1a1410', shade: 0.2, inkW: 0.8, cast: false });
  for (const s of [-1, 1]) tube(f, F, [[s * 200, -40], [s * 80, 40], [s * 20, 60]], 40, '#5a524a'); f.part(F(ell([0, 60], 40, 40, 0, 16)), { fill: C.BRONZE, shade: 0.4, inkW: 1.6, cast: false }); ring(f, F, [0, 60], 26, 26, 4, '#c8b07a');
  frost(f, F, -300, 300, 300, 12); L(f, F, [[-200, -40], [-260, 120], [-280, 280]], 10, ICE, { op: 0.4 });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-325, -365, 325, 345]), feat: [], ells: [] };
};
META.pelt = { act: 'freeze', noTurn: true, only: ['close', 'floor', 'niche', 'table'] };

O.merlon = (f, o = {}) => { // an ice rampart: a stretch of crenellated wall, merlons and embrasures, sheathed in thick ice with long icicles hanging off the parapet
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const wall = [[-340, -120], [-200, -120], [-200, -260], [-60, -260], [-60, -120], [60, -120], [60, -260], [200, -260], [200, -120], [340, -120], [340, 320], [-340, 320]];
  P(f, F, wall, C.STONE, { tex: T(f, 'mottle'), texOp: 1 }); for (const y of [-40, 60, 160, 260]) { L(f, F, [[-340, y], [340, y]], 2.6, INK, { op: 0.6 }); for (let x = -300 + (y % 120 ? 60 : 0); x < 340; x += 120) L(f, F, [[x, y - 100], [x, y]], 2.6, INK, { op: 0.6 }); }
  f.part(F([[-340, -140], [-200, -140], [-200, -280], [-60, -280], [-60, -140], [60, -140], [60, -280], [200, -280], [200, -140], [340, -140], [340, -100], [-340, -100]]), { fill: ICE, shade: 0.3, inkW: 1.8, cast: false, opacity: 0.85 });
  for (let i = 0; i < 13; i++) { const x = -320 + i * 53, h = 60 + ((i * 41) % 5) * 30; f.part(F([[x - 16, -110], [x + 16, -110], [x + 2, -110 + h]]), { fill: ICE, shade: 0.35, inkW: 1.2, cast: false, sharp: true }); }
  L(f, F, [[-320, 20], [-200, 240]], 10, ICED, { op: 0.5 }); L(f, F, [[150, 0], [260, 200]], 8, ICED, { op: 0.5 });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-340, -285, 340, 320]), feat: [], ells: [] };
};
META.merlon = { act: 'freeze', noTurn: true, only: ['close', 'floor'] };

O.buckler = (f, o = {}) => { // a barbed buckler: a small round steel fist-shield, its domed boss drawn out into a long spike, a ring of short barbs round the rim
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; f.part(F([[Math.cos(a - 0.08) * 240, Math.sin(a - 0.08) * 240], [Math.cos(a) * 310, Math.sin(a) * 310], [Math.cos(a + 0.08) * 240, Math.sin(a + 0.08) * 240]]), { fill: '#8a8c90', shade: 0.3, inkW: 1.2, cast: false, sharp: true }); }
  const disc = ell([0, 0], 250, 250, 0, 40); D.slab(f, F(disc), [10, 12]); P(f, F, disc, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); ring(f, F, [0, 0], 220, 220, 8, '#4a4c50'); shadeR(f, F, disc, 60, 240, -180, 230, 10, { op: 0.45 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; f.rivet(F([[Math.cos(a) * 200, Math.sin(a) * 200]])[0], 7, '#a8aaa6'); }
  oval(f, F, [0, 0], 100, 100, '#7a7c80', { shade: 0.45 }); P(f, F, [[-40, -20], [40, -20], [0, -230]], '#b8bab6', { dress: false, sharp: true }); L(f, F, [[-10, -40], [-4, -200]], 3, '#f4f4f0', { op: 0.7 });
  L(f, F, ell([0, 0], 236, 236, 0, 40).slice(22, 32), 6, '#e8e8e0', { op: 0.5 }); D.bloom(f, F([[120, 120]])[0], 24, C.RUST, { n: 3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-315, -315, 315, 315]), grip: { c: F([[0, 0]])[0], thumb: 0 }, feat: [], ells: [] };
};
META.buckler = { act: 'press', noTurn: true };

O.pavise = (f, o = {}) => { // a pavise: a tall standing shield propped on its strut for the back rank, painted with a red cross on white, its foot dug in, arrows stuck in its face
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const sh = [[-170, -330], [170, -330], [190, -280], [200, 300], [-200, 300], [-190, -280]]; D.slab(f, F(sh), [10, 12]); P(f, F, sh, '#d8d0bc', { tex: T(f, 'weave'), texOp: 0.8 });
  P(f, F, [[-40, -300], [40, -300], [40, 270], [-40, 270]], '#7a2418', { dress: false }); P(f, F, [[-170, -90], [170, -90], [170, -10], [-170, -10]], '#7a2418', { dress: false });
  for (const y of [-330, 300]) L(f, F, [[-200, y], [200, y]], 8, '#4a3a2a');
  tube(f, F, [[150, 100], [300, 330]], 16, C.OAK);   // the strut
  for (const [x, y, a] of [[-110, -200, 0.3], [90, 120, -0.2], [-80, 180, 0.5]]) { const t = add([x, y], [Math.cos(a) * 150, Math.sin(a) * 150 - 40]); L(f, F, [[x, y], t], 7, INK); L(f, F, [[x, y], t], 4, '#8a7050'); f.part(F([add(t, [-14, -18]), add(t, [26, -10]), add(t, [14, 14]), add(t, [-20, 10])]), { fill: '#e8e4dc', shade: 0.3, inkW: 1, cast: false }); f.part(F(ell([x, y], 9, 9, 0, 8)), { fill: '#1a1410', shade: 0.1, inkW: 0.8, cast: false }); }
  D.chip(f, F([[180, 0]])[0], 12, 0); D.stain(f, F([[60, 240]])[0], 40, '#4a3a2a', { op: 0.4 }); D.crack(f, F([[-150, 60]])[0], 1.4, 90, { n: 4 });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-205, -335, 305, 335]), feat: [], ells: [] };
};
META.pavise = { act: 'press', noTurn: true, only: ['close', 'floor', 'niche'] };

O.yulelog = (f, o = {}) => { // midwinter: the great yule log on the hearth, a whole knotted trunk with its bark, holly and a red ribbon bound round it, burning at one end, frost on the hearthstone
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-340, 200], [340, 200], [330, 290], [-330, 290]], C.STONE, { tex: T(f, 'mottle'), texOp: 1, sharp: true }); frost(f, F, -320, 320, 288, 14);
  const log = [[-300, 20], [260, -20], [300, 30], [300, 150], [-280, 190], [-320, 120]]; P(f, F, log, '#4a3a2a', { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, log, 0.35, 10, -0.05); for (const [x, y] of [[-120, 60], [100, 100]]) { f.part(F(ell([x, y], 30, 18, 0, 12)), { fill: '#2a1e14', shade: 0.3, inkW: 1.4, cast: false }); ring(f, F, [x, y], 42, 26, 3, '#5a4632'); }
  oval(f, F, [-300, 110], 40, 86, '#b8946a'); for (let k = 1; k < 5; k++) ring(f, F, [-300, 110], 40 * k / 5, 86 * k / 5, 1, '#5a3a1a');
  for (const x of [-60, -20]) { L(f, F, [[x, 0], [x - 10, 190]], 14, INK); L(f, F, [[x, 0], [x - 10, 190]], 9, '#7a2418'); }
  for (const [x, y, a] of [[40, -10, -0.6], [90, -20, 0.3], [60, -40, -0.1]]) { const G = pts => F(pts.map(p => add([x, y], rot(p, a)))); P(f, G, [[0, 0], [30, -30], [50, -20], [70, -50], [90, -30], [70, 0], [90, 20], [50, 30], [20, 20]], '#2e4a2a', { dress: false }); }
  for (const [x, y] of [[50, 10], [70, 0], [62, 22]]) f.part(F(ell([x, y], 12, 12, 0, 8)), { fill: '#a83020', shade: 0.3, inkW: 1, cast: false });
  flame(f, F, [240, 0], 220, 70, -0.1); flame(f, F, [170, 10], 150, 50, 0.1);
  return { focus: F([[0, 80]])[0], sig: SB(F, [-345, -230, 340, 295]), feat: ['fire'], ells: [] };
};
META.yulelog = { act: 'burn', noTurn: true, only: ['close', 'floor', 'niche'] };

O.mitten = (f, o = {}) => { // numbing cold: a frozen fur-lined leather mitten dropped on the snow, stiff with rime, icicles at its cuff
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r;
  const m = [[-140, 260], [-170, 40], [-160, -160], [-90, -280], [40, -290], [130, -220], [150, -60], [230, -120], [290, -60], [240, 60], [150, 120], [140, 260]]; P(f, F, m, '#5a4434', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, m, 0.4, 9, 0.6, '#d8c8b0');
  L(f, F, [[150, 120], [60, 40], [40, -60]], 3, '#2a1a10', { op: 0.7 }); f.stitches(F([[-150, 0], [-140, -150], [-80, -260]]), '#c8b890', 1.6);
  const cuff = [[-170, 200], [170, 200], [180, 320], [-180, 320]]; P(f, F, cuff, '#c8beb0', { tex: T(f, 'weave'), texOp: 1 }); for (let i = 0; i < 12; i++) L(f, F, [[-160 + i * 28, 210], [-166 + i * 28, 310]], 2.4, '#7a7064', { op: 0.6 });
  frost(f, F, -170, 170, 320, 9); for (const [x, y] of [[-60, -200], [60, -100], [-100, 60], [200, -60]]) f.part(F([[x - 30, y], [x, y - 14], [x + 30, y], [x, y + 14]]), { fill: ICE, shade: 0.2, inkW: 1, cast: false, opacity: 0.85 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-185, -295, 295, 370]), feat: [], ells: [] };
};
META.mitten = { act: 'freeze', noTurn: true, only: ['close', 'table', 'floor', 'ledge'] };

module.exports = { O, META };
