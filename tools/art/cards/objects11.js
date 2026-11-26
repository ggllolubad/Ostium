// The card object library, part eleven: the variety pass for the Bulwark and the Duelist (L58). The Bulwark drew 25 cards
// on the church door and the Duelist 10 on the knife; these give the door's parts and the Bulwark's kit their own cards
// (drawbar, knocker, strap hinge, portcullis, great helm, breastplate, gauntlet, icicles, bramble, caltrops, iron rose,
// banner, crown of thorns) and the Duelist's salle and surgery theirs (headsman's block, noose, cupping glass, tabor
// drum, bone saw, razor, main gauche). Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, SIX, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const O = {}, META = {};
const BLOOD = '#5c0f0b', PINE = '#7a5a3a';
const planks = (f, F, x0, x1, y0, y1, n) => { for (let i = 1; i < n; i++) { const x = x0 + (x1 - x0) * i / n; L(f, F, [[x, y0], [x, y1]], 2.4, INK, { op: 0.8 }); } };

// ==== the Bulwark
O.drawbar = (f, o = {}) => { // a heavy oak drawbar dropped across the closed door into two iron brackets: the planks behind, the bar's end grain, the brackets' bolts
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const dr = [[-300, -320, 1], [300, -320, 1], [300, 320, 1], [-300, 320, 1]]; P(f, F, dr, PINE, { tex: T(f, 'wood'), texOp: 1 }); planks(f, F, -300, 300, -320, 320, 6); grain(f, F, dr, 0.2, 10, 1.57);
  for (const s of [-1, 1]) { const br = [[s * 230 - 50, -80, 1], [s * 230 + 50, -80, 1], [s * 230 + 50, 80, 1], [s * 230 - 50, 80, 1]]; D.slab(f, F(br), [10, 10]); P(f, F, br, C.IRON, { dress: false }); for (const y of [-60, 60]) f.rivet(F([[s * 230, y]])[0], 7, '#9a9a96'); }
  const bar = [[-390, -60, 1], [390, -40, 1], [390, 50, 1], [-390, 40, 1]]; D.slab(f, F(bar), [0, 22], '#2a1a10'); P(f, F, bar, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, bar, 0.3, 9, 0.02);
  oval(f, F, [390, 5], 22, 46, C.OAK); for (let k = 1; k < 4; k++) ring(f, F, [390, 5], 22 * k / 4, 46 * k / 4, 1, '#3a2a1a');
  for (const s of [-1, 1]) { P(f, F, [[s * 230 - 56, -50], [s * 230 + 56, -46], [s * 230 + 56, -36], [s * 230 - 56, -40]], C.IRON, { dress: false }); }
  lit(f, F, [[-380, -62], [380, -42]], 5, 0.5); D.chip(f, F([[-200, 40]])[0], 10, 0); D.crack(f, F([[0, 200]])[0], 1.6, 120, { n: 5 }); D.bloom(f, F([[230, 60]])[0], 20, C.RUST, { n: 3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-395, -325, 415, 325]), feat: [], ells: [] };
};
META.drawbar = { act: 'press', only: ['close'] };

O.knocker = (f, o = {}) => { // an iron ring knocker on the church door: a lion-mask boss bolted to the planks, the heavy ring hanging from its jaws, the striking plate below worn bright
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const dr = [[-320, -330, 1], [320, -330, 1], [320, 330, 1], [-320, 330, 1]]; P(f, F, dr, PINE, { tex: T(f, 'wood'), texOp: 1 }); planks(f, F, -320, 320, -330, 330, 5); grain(f, F, dr, 0.2, 10, 1.57);
  P(f, F, [[-60, 160], [60, 160], [60, 260], [-60, 260]], C.IRON, { dress: false }); f.part(F(ell([0, 210], 40, 34, 0, 16)), { fill: '#b8b8b0', shade: 0.3, inkW: 1.4, cast: false });   // the worn striking plate
  const boss = ell([0, -150], 130, 130, 0, 36); D.slab(f, F(boss), [10, 10]); P(f, F, boss, '#5a5c60', { tex: T(f, 'mottle'), texOp: 1 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; f.part(F([add([0, -150], [Math.cos(a - 0.15) * 90, Math.sin(a - 0.15) * 90]), add([0, -150], [Math.cos(a) * 128, Math.sin(a) * 128]), add([0, -150], [Math.cos(a + 0.15) * 90, Math.sin(a + 0.15) * 90])]), { fill: '#4a4c50', shade: 0.4, inkW: 1.2, cast: false }); }   // the mane
  oval(f, F, [0, -150], 78, 84, '#6a6c70', { shade: 0.45 }); for (const s of [-1, 1]) f.part(F(ell([s * 30, -175], 16, 10, 0, 10)), { fill: '#120c08', shade: 0.1, inkW: 1.2, cast: false }); f.part(F([[-30, -120], [30, -120], [0, -96]]), { fill: '#2a2a2c', shade: 0.3, inkW: 1.2, cast: false });
  ring(f, F, [0, 40], 140, 150, 26, '#5a5c60'); L(f, F, ell([0, 40], 140, 150, 0, 28).slice(14, 22), 6, '#c8c8c4', { op: 0.6 });
  for (const [x, y] of [[-110, -260], [110, -260], [-110, -40], [110, -40]]) f.rivet(F([[x, y]])[0], 8, '#8a8a86');
  D.bloom(f, F([[90, -90]])[0], 24, C.RUST, { n: 3 }); D.bloom(f, F([[-120, 120]])[0], 20, C.RUST, { n: 2 }); D.crack(f, F([[220, 100]])[0], 1.6, 120, { n: 5 });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-180, -290, 180, 270]), feat: [], ells: [] };
};
META.knocker = { act: 'swing', only: ['close'] };

O.hinge = (f, o = {}) => { // a long forged strap hinge across the pine planks, ending in a split fleur, its barrel on the pintle, nail heads down its length, frost or rust in its seams
  const F = frame([0, 0], o.ang ?? -0.06, 1), r = f.r, st = o.state || {};
  const dr = [[-300, -260, 1], [380, -260, 1], [380, 260, 1], [-300, 260, 1]]; P(f, F, dr, PINE, { tex: T(f, 'wood'), texOp: 1 }); planks(f, F, -300, 380, -260, 260, 6); grain(f, F, dr, 0.2, 10, 1.57);
  const strap = [[-330, -60, 1], [200, -50, 1], [240, -110, 1], [300, -60, 1], [360, -100, 1], [340, 0, 1], [360, 100, 1], [300, 60, 1], [240, 110, 1], [200, 50, 1], [-330, 60, 1]];
  D.slab(f, F(strap), [8, 10]); P(f, F, strap, C.IRON, { sharp: true, tex: T(f, 'mottle'), texOp: 1 }); lit(f, F, [[-320, -58], [200, -48]], 4, 0.55);
  oval(f, F, [-330, 0], 50, 76, '#4a4c50', { shade: 0.45 }); P(f, F, [[-360, -170], [-300, -170], [-300, 170], [-360, 170]], '#3a3c40', { dress: false });   // the barrel on its pintle
  for (let i = 0; i < 6; i++) f.rivet(F([[-240 + i * 80, 0]])[0], 9, '#9a9a96');
  if (st.frozen) { for (let i = 0; i < 8; i++) f.part(F([[-260 + i * 70, 60], [-246 + i * 70, 60], [-252 + i * 70, 100 + (i % 3) * 20]]), { fill: '#d8e4ea', shade: 0.3, inkW: 1, cast: false, sharp: true }); }
  else { D.bloom(f, F([[100, 40]])[0], 30, C.RUST, { n: 4 }); D.bloom(f, F([[-150, -40]])[0], 20, C.RUST, { n: 2 }); }
  D.crack(f, F([[100, 180]])[0], 0.1, 140, { n: 5 }); D.chip(f, F([[300, -100]])[0], 9, 0);
  return { focus: F([[0, 0]])[0], sig: SB(F, [-365, -175, 365, 175]), feat: [], ells: [] };
};
META.hinge = { act: 'press', only: ['close'] };

O.portcullis = (f, o = {}) => { // a portcullis half lowered in its stone arch: a lattice of iron-shod oak bars, the spiked feet hanging over the threshold
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const arch = [[-340, 340, 1], [-340, -180], [-240, -300], [0, -350], [240, -300], [340, -180], [340, 340, 1]]; P(f, F, arch, C.STONE, { tex: T(f, 'mottle'), texOp: 1 });
  f.part(F([[-260, 340, 1], [-260, -140], [-180, -240], [0, -280], [180, -240], [260, -140], [260, 340, 1]]), { fill: '#120c08', shade: 0.1, inkW: 2.4, cast: false, hatch: false });
  for (let i = 0; i < 6; i++) { const x = -220 + i * 88; tube(f, F, [[x, -280], [x, 150]], 30, C.OAK); P(f, F, [[x - 18, 150], [x + 18, 150], [x, 230]], C.IRON, { sharp: true, dress: false }); }
  for (let k = 0; k < 4; k++) { const y = -200 + k * 100; tube(f, F, [[-250, y], [250, y]], 26, C.OAKL); for (let i = 0; i < 6; i++) f.rivet(F([[-220 + i * 88, y]])[0], 6, '#9a9a96'); }
  for (let i = 0; i < 9; i++) { const t = i / 9 * Math.PI; L(f, F, [[-300 * Math.cos(t), -170 - 160 * Math.sin(t)], [-340 * Math.cos(t), -190 - 170 * Math.sin(t)]], 3, INK, { op: 0.7 }); }
  D.bloom(f, F([[100, 0]])[0], 30, C.RUST, { n: 3 }); D.chip(f, F([[-330, 0]])[0], 14, 1.6); D.crack(f, F([[300, 100]])[0], 1.6, 100, { n: 4 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-345, -355, 345, 345]), feat: [], ells: [] };
};
META.portcullis = { act: 'press', only: ['close'] };

O.greathelm = (f, o = {}) => { // a great helm, flat-topped and riveted, the eye slit black, breathing holes in a cross, a dent and the lead-patched split, breath smoking from the slit
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const helm = [[-200, -250], [200, -250], [230, -200], [240, 120], [210, 250], [-210, 250], [-240, 120], [-230, -200]];
  P(f, F, helm.map(p => [p[0], p[1], 1]), '#6a6c70', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, helm, 0.3, 10); shadeR(f, F, helm, 60, 240, -250, 250, 14, { op: 0.45 });
  oval(f, F, [0, -250], 200, 40, '#7a7c80'); L(f, F, [[0, -250], [0, 250]], 26, INK); L(f, F, [[0, -250], [0, 250]], 18, '#5a5c60');   // the crown plate and the ridge
  f.part(F([[-200, -60], [-30, -66], [-30, -36], [-200, -30]]), { fill: '#0a0806', shade: 0.1, inkW: 2, cast: false, hatch: false }); f.part(F([[30, -66], [200, -60], [200, -30], [30, -36]]), { fill: '#0a0806', shade: 0.1, inkW: 2, cast: false, hatch: false });
  for (let i = 0; i < 9; i++) { const p = i < 5 ? [90, 60 + i * 30] : [30 + (i - 5) * 40 + (i > 6 ? 20 : 0), 120]; f.part(F(ell(p, 6, 6, 0, 8)), { fill: '#0a0806', shade: 0.1, inkW: 1, cast: false, hatch: false }); }
  for (let i = 0; i < 8; i++) f.rivet(F([[-210 + i * 60, -200]])[0], 6, '#a8a8a4'); for (let i = 0; i < 8; i++) f.rivet(F([[-200 + i * 57, 220]])[0], 6, '#a8a8a4');
  f.part(F([[-170, 40], [-80, 30], [-70, 180], [-160, 190]]), { fill: '#8a8c90', shade: 0.3, inkW: 1.6, cast: false }); for (let i = 0; i < 4; i++) L(f, F, [[-160 + i * 22, 50], [-150 + i * 20, 170]], 1.4, INK, { op: 0.6 });   // the lead patch
  lit(f, F, [[-220, -190], [-230, 110]], 7, 0.5); D.bloom(f, F([[150, 160]])[0], 24, C.RUST, { n: 3 }); D.chip(f, F([[200, -240]])[0], 10, 0);
  const frozen = (o.state || {}).frozen;   // a frozen helm rimes at the slit instead of smoking (L21)
  if (frozen) K.fxReq(f, 'rime', F([[-200, -30]])[0], 40, { to: F([[200, -30]])[0] }); else { K.fxReq(f, 'steam', F([[-120, -60]])[0], 100, { col: '#d8dce0' }); K.fxReq(f, 'steam', F([[120, -60]])[0], 80, { col: '#d8dce0' }); }
  return { focus: F([[0, -50]])[0], sig: SB(F, [-245, -295, 245, 255]), grip: { c: F([[0, 250]])[0], thumb: (o.ang ?? 0) - Math.PI / 2 }, feat: frozen ? ['rime'] : ['steam'], ells: [0.2] };
};
META.greathelm = { act: 'blow', only: ['close', 'ledge', 'niche', 'table', 'held'] };

O.breastplate = (f, o = {}) => { // a battered breastplate on its stand: a ridged steel chest, arm and neck openings rolled, a split down the middle smeared with blood and patched with lead
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const bp = [[-230, -240], [-120, -280], [-60, -200], [60, -200], [120, -280], [230, -240], [260, -60], [220, 140], [140, 260], [0, 290], [-140, 260], [-220, 140], [-260, -60]];
  P(f, F, bp, '#7a7c80', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, bp, 0.3, 10); shadeR(f, F, bp, 40, 260, -260, 290, 16, { op: 0.45 });
  L(f, F, [[-60, -200], [0, -170], [60, -200]], 14, INK); L(f, F, [[-60, -200], [0, -170], [60, -200]], 9, '#9a9ca0');   // the rolled neck
  for (const s of [-1, 1]) { L(f, F, [[s * 120, -280], [s * 210, -200], [s * 250, -80]], 14, INK); L(f, F, [[s * 120, -280], [s * 210, -200], [s * 250, -80]], 9, '#9a9ca0'); }
  L(f, F, [[0, -170], [0, 280]], 4, INK, { op: 0.6 }); lit(f, F, [[-30, -160], [-30, 260]], 8, 0.4); lit(f, F, [[-230, -60], [-200, 140]], 6, 0.5);
  f.part(F([[-10, -100], [14, -40], [-6, 30], [16, 120], [-4, 180], [-20, 100], [0, 20], [-24, -40]]), { fill: '#0a0806', shade: 0.1, inkW: 1.6, cast: false, hatch: false });   // the split
  f.part(F([[30, -20], [150, -30], [160, 100], [40, 110]]), { fill: '#8a8c90', shade: 0.3, inkW: 1.6, cast: false }); for (const [x, y] of [[40, -10], [140, -20], [150, 90], [50, 100]]) f.rivet(F([[x, y]])[0], 5, '#c8c8c4');
  D.bloom(f, F([[-80, 60]])[0], 30, BLOOD, { n: 3, op: 0.7 }); L(f, F, [[-120, 20], [-40, 60], [-60, 140]], 10, BLOOD, { op: 0.75 });
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) f.rivet(F([[s * (200 - i * 10), -100 + i * 90]])[0], 6, '#a8a8a4');
  D.chip(f, F([[220, 140]])[0], 10, 0); f.scratches(F([[-120, -80]])[0], 50, 10, '#e8e8e0');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-265, -285, 265, 295]), feat: ['blood', 'crack'], ells: [] };
};
META.breastplate = { act: 'crack', only: ['close', 'niche', 'ledge'] };

O.gauntlet = (f, o = {}) => { // an empty steel gauntlet thrown down, palm up: the flared cuff, the lames over the back of the hand, the jointed fingers curled, a barb at each knuckle
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r;
  const cuff = [[-320, -150], [-120, -110], [-100, 110], [-320, 170]]; P(f, F, cuff, '#6a6c70', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, cuff, 0.3, 10); f.part(F(ell([-320, 10], 40, 160, 0, 20)), { fill: '#1a1612', shade: 0.2, inkW: 2, cast: false });
  for (let k = 0; k < 4; k++) { const x = -110 + k * 46; P(f, F, [[x, -110 + k * 6], [x + 56, -104 + k * 6], [x + 56, 104 - k * 6], [x, 110 - k * 6]], k % 2 ? '#7a7c80' : '#6a6c70', { dress: false }); f.rivet(F([[x + 28, -90 + k * 6]])[0], 4, '#c8c8c4'); }
  for (let i = 0; i < 4; i++) { const y = -90 + i * 58, pts = [[80, y], [170, y - 10], [240, y + 10], [270, y + 50]]; tube(f, F, pts, 40, '#7a7c80'); for (let j = 1; j < 4; j++) L(f, F, [add(pts[j], [-6, -20]), add(pts[j], [6, 20])], 3, INK, { op: 0.8 }); f.part(F([add(pts[1], [-10, -22]), add(pts[1], [10, -22]), add(pts[1], [0, -56])]), { fill: '#5a5c60', shade: 0.3, inkW: 1.2, cast: false, sharp: true }); }
  tube(f, F, [[60, 120], [140, 170], [190, 160]], 44, '#7a7c80');
  lit(f, F, [[-300, -146], [-120, -108]], 5, 0.5); D.bloom(f, F([[0, 40]])[0], 24, C.RUST, { n: 3 }); D.chip(f, F([[-200, 160]])[0], 9, 0);
  if ((o.state || {}).frozen) K.fxReq(f, 'rime', F([[-300, 160]])[0], 40, { to: F([[200, 140]])[0] });
  return { focus: F([[100, 0]])[0], sig: SB(F, [-345, -170, 300, 200]), grip: { c: F([[-300, 0]])[0], thumb: (o.ang ?? -0.2) }, feat: (o.state || {}).frozen ? ['rime'] : [], ells: [] };
};
META.gauntlet = { act: 'swing', only: ['close', 'table', 'floor', 'ledge', 'held'] };

O.icicles = (f, o = {}) => { // a fringe of thick icicles hanging from the iron-bound top of the door, hoar frost blooming on the planks behind, one breaking off
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const dr = [[-360, -200, 1], [360, -200, 1], [360, 320, 1], [-360, 320, 1]]; P(f, F, dr, '#6a6a6e', { tex: T(f, 'wood'), texOp: 1 }); planks(f, F, -360, 360, -200, 320, 6); grain(f, F, dr, 0.25, 10, 1.57, '#e8f0f4');
  tube(f, F, [[-380, -200], [380, -200]], 50, C.IRON); for (let i = 0; i < 7; i++) f.rivet(F([[-330 + i * 110, -200]])[0], 7, '#c8d0d4');
  const lens = [260, 140, 330, 180, 220, 300, 160, 240, 120, 280, 200];
  lens.forEach((h, i) => { const x = -330 + i * 66, w = 22 + (i % 3) * 6; f.part(F([[x - w, -176], [x + w, -176], [x + w * 0.3, -176 + h * 0.6], [x, -176 + h]]), { fill: '#c8d8e0', shade: 0.35, inkW: 1.8, cast: true, sharp: true }); L(f, F, [[x - w * 0.6, -170], [x - 4, -176 + h * 0.8]], 3, '#ffffff', { op: 0.7 }); });
  f.part(F([[90, 170], [130, 160], [116, 290]]), { fill: '#c8d8e0', shade: 0.35, inkW: 1.6, cast: false, sharp: true });   // the one falling
  for (let i = 0; i < 40; i++) f.flat(F(ell([-340 + (i * 53) % 680, 140 + (i * 37) % 170], 8, 6, 0, 8)), '#e8f0f4', { op: 0.6 });   // hoar on the planks
  K.fxReq(f, 'rime', F([[-360, 320]])[0], 40, { to: F([[360, 316]])[0] });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-385, -230, 385, 330]), feat: ['rime'], ells: [] };
};
META.icicles = { act: 'freeze', only: ['close'] };

O.bramble = (f, o = {}) => { // a briar cane bent into a hoop and lashed: a thick green-black stem, hooked thorns all along it, a few hard red hips, torn cloth snagged on a thorn
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ST = '#3a4030';
  const cane = K.catmull([[-330, 250], [-300, 0], [-160, -220], [60, -280], [260, -170], [320, 60], [220, 240], [40, 260]], 6);
  L(f, F, cane, 46, INK); L(f, F, cane, 36, ST); L(f, F, cane.map(p => add(p, [-6, -8])), 6, '#7a8a5a', { op: 0.5 });
  const C2 = K.catmull([[-250, 280], [-120, 120], [100, 60], [220, -100]], 6); L(f, F, C2, 30, INK); L(f, F, C2, 22, ST);
  for (const line of [cane, C2]) for (let i = 2; i < line.length - 1; i += 2) { const a = line[i], d = norm(sub(line[i + 1], line[i - 1])), n = [-d[1], d[0]], s = i % 4 ? 1 : -1; f.part(F([add(a, mul(n, s * 14)), add(a, add(mul(n, s * 52), mul(d, -18))), add(a, add(mul(n, s * 14), mul(d, 16)))]), { fill: '#6a5a3a', shade: 0.3, inkW: 1.4, cast: false, sharp: true }); }
  for (const c of [[-100, -150], [180, 180], [-260, 100]]) { oval(f, F, c, 18, 22, '#7a2418', { shade: 0.4, inkW: 1.4 }); f.flat(F(ell(add(c, [-5, -6]), 5, 4, 0, 6)), '#e8a090', { op: 0.8 }); }
  f.part(F([[290, -60], [360, -40], [330, 40], [370, 90], [300, 60]]), { fill: '#8a826e', shade: 0.4, inkW: 1.4, cast: false, tex: T(f, 'weave'), texOp: 0.8 });   // the snagged rag
  for (let i = 0; i < 4; i++) { const p = cane[6 + i * 7]; if (p) L(f, F, [add(p, [-20, 0]), add(p, [20, 6])], 8, C.TWINE); }
  return { focus: F([[0, -100]])[0], sig: SB(F, [-355, -310, 375, 300]), feat: [], ells: [] };
};
META.bramble = { act: 'swing', only: ['close', 'floor', 'niche'] };

O.caltrops = (f, o = {}) => { // one big forged caltrop on the flagstones: four iron spikes welded at the centre so one always stands up, barbed and rusted
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, 40];
  const tips = [[0, -320], [-280, 220], [280, 200], [40, 150]];
  tips.slice().sort((a, b) => a[1] - b[1]).forEach(t => { const d = norm(sub(t, c)), n = [-d[1], d[0]], w = t[1] > 100 && t[0] > 0 && t[0] < 100 ? 60 : 88; f.part(F([add(c, mul(n, w)), t, add(c, mul(n, -w))]), { fill: '#6a6c70', shade: 0.45, inkW: 2.2, cast: true, sharp: true, tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, [add(c, mul(n, w)), t, add(c, mul(n, -w))], 0.4, 8, Math.atan2(d[1], d[0]), '#c8c8c4'); L(f, F, [add(c, mul(n, w * 0.5)), lerp(c, t, 0.9)], 3, '#c8c8c4', { op: 0.6 }); const b = lerp(c, t, 0.6); f.part(F([add(b, mul(n, w * 0.4)), add(b, add(mul(n, w * 0.4 + 30), mul(d, -30))), add(b, add(mul(n, w * 0.3), mul(d, 20)))]), { fill: '#4a4c50', shade: 0.3, inkW: 1.2, cast: false, sharp: true }); });
  oval(f, F, c, 80, 70, '#4a4c50', { shade: 0.45 });
  D.bloom(f, F([[60, 0]])[0], 30, C.RUST, { n: 4 }); D.bloom(f, F([[-140, 140]])[0], 20, C.RUST, { n: 2 }); f.flat(F(ell([0, -280], 10, 14, 0, 8)), BLOOD, { op: 0.8 });
  return { focus: F([c])[0], sig: SB(F, [-285, -325, 285, 225]), feat: ['blood'], ells: [] };
};
META.caltrops = { act: 'crack', only: ['close', 'floor', 'table', 'ledge'] };

O.ironrose = (f, o = {}) => { // a rose forged from iron: curled sheet petals around a tight bud, a barbed iron stem with two leaves, hammer marks on every petal
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r, c = [0, -140];
  tube(f, F, [[0, -60], [-20, 120], [10, 360]], 26, C.IRON); for (const [y, s] of [[40, -1], [180, 1], [280, -1]]) f.part(F([[s * 10, y], [s * 60, y - 20], [s * 16, y + 14]]), { fill: '#4a4c50', shade: 0.3, inkW: 1.2, cast: false, sharp: true });
  for (const [p, a] of [[[-14, 100], 2.6], [[6, 220], 0.4]]) f.part(F(ell(add(p, [Math.cos(a) * 70, Math.sin(a) * 30]), 80, 30, a, 16)), { fill: '#5a5c60', shade: 0.4, inkW: 1.6, cast: true });
  for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, p = add(c, [Math.cos(a) * 120, Math.sin(a) * 80]); P(f, F, ell(p, 110, 80, a, 20), k % 2 ? '#6a6c70' : '#5e6064', { tex: T(f, 'mottle'), texOp: 1, dressO: { op: 0.4 } }); L(f, F, ell(p, 100, 72, a, 20).slice(12, 18), 4, '#c8c8c4', { op: 0.55 }); }
  for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 + 0.6; P(f, F, ell(add(c, [Math.cos(a) * 50, Math.sin(a) * 34]), 70, 54, a, 18), '#7a7c80', { tex: T(f, 'mottle'), texOp: 1, dress: false }); }
  oval(f, F, c, 46, 40, '#6a6c70', { shade: 0.45 }); L(f, F, K.catmull([add(c, [-30, 0]), add(c, [0, -24]), add(c, [24, 6]), add(c, [0, 20])], 4), 4, INK);
  for (let i = 0; i < 20; i++) f.flat(F(ell(add(c, [(i * 37) % 240 - 120, (i * 23) % 160 - 80]), 5, 3, 0, 6)), '#2a2a2c', { op: 0.6 });   // hammer marks
  D.bloom(f, F([add(c, [80, 40])])[0], 24, C.RUST, { n: 3 });
  return { focus: F([c])[0], sig: SB(F, [-235, -265, 235, 365]), grip: { c: F([[0, 280]])[0], thumb: (o.ang ?? -0.15) - Math.PI / 2 }, feat: [], ells: [] };
};
META.ironrose = { act: 'press', only: ['close', 'niche', 'table', 'held'] };

O.banner = (f, o = {}) => { // a torn war banner on a pole, still flying: a tall swallow-tailed cloth slashed and holed, a black door blazon, the pole's iron finial
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  tube(f, F, [[-260, -380], [-260, 380]], 26, C.OAK); P(f, F, [[-276, -380], [-244, -380], [-260, -440]], C.IRON, { sharp: true, dress: false }); tube(f, F, [[-260, -330], [200, -320]], 14, C.OAK);
  const cl = [[-250, -330, 1], [190, -320, 1], [240, -150], [200, 40], [260, 240], [120, 160], [20, 280], [-40, 140], [-250, 200, 1]];
  P(f, F, cl, '#5a5a46', { tex: T(f, 'weave'), texOp: 1 }); grain(f, F, cl, 0.35, 8, 0); grain(f, F, cl, 0.35, 11, 1.3, '#d8d0b8');
  for (let k = 0; k < 4; k++) L(f, F, [[-200 + k * 100, -320], [-170 + k * 100, 0], [-210 + k * 110, 180]], 9, k % 2 ? '#2a2a20' : '#7a7a68', { op: 0.45 });   // the cloth's waves
  f.part(F([[-120, -200, 1], [40, -200, 1], [40, 60, 1], [-120, 60, 1]]), { fill: '#16110e', shade: 0.2, inkW: 1.6, cast: false }); for (const y of [-140, -10]) L(f, F, [[-120, y], [40, y]], 6, '#6a6a60');   // the door blazon
  for (const [x, y, w] of [[100, -100, 40], [150, 80, 30], [-180, 120, 26]]) f.part(F(K.blob(r, [x, y], w, 9, 0.5)), { fill: '#120c08', shade: 0.1, inkW: 1.6, cast: false, hatch: false });   // holes
  f.part(F([[60, -330], [110, -326], [90, -200]]), { fill: '#120c08', shade: 0.1, inkW: 1.4, cast: false, hatch: false });   // a slash
  D.stain(f, F([[-60, 150]])[0], 40, BLOOD, { op: 0.5 });
  return { focus: F([[-40, -80]])[0], sig: SB(F, [-285, -440, 265, 285]), grip: { c: F([[-260, 300]])[0], thumb: (o.ang ?? 0) - Math.PI / 2 }, feat: ['blood'], ells: [] };
};
META.banner = { act: 'swing' };

O.crown = (f, o = {}) => { // a crown of welded iron barbs: a thick forged band seen from a little above, spikes and hooked thorns standing all round it, blood on the points
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, 60], rx = 280, ry = 90;
  const back = ell(c, rx, ry, 0, 40).slice(20, 41);
  for (let k = 0; k < 14; k++) { const a = Math.PI + k / 13 * Math.PI, p = add(c, [Math.cos(a) * rx, Math.sin(a) * ry]); f.part(F([add(p, [-18, 0]), add(p, [0, -150 - (k % 3) * 40]), add(p, [18, 0])]), { fill: '#4a4c50', shade: 0.4, inkW: 1.6, cast: true, sharp: true }); }
  L(f, F, back, 54, INK); L(f, F, back, 44, '#4a4c50');
  const front = ell(c, rx, ry, 0, 40).slice(0, 21); L(f, F, front, 60, INK); L(f, F, front, 50, '#6a6c70'); L(f, F, front.map(p => add(p, [0, -14])), 6, '#c8c8c4', { op: 0.5 });
  for (let k = 0; k < 12; k++) { const a = (k + 0.5) / 12 * Math.PI, p = add(c, [Math.cos(a) * rx, Math.sin(a) * ry - 20]), h = 170 + (k % 3) * 50; f.part(F([add(p, [-22, 0]), add(p, [0, -h]), add(p, [22, 0])]), { fill: '#6a6c70', shade: 0.45, inkW: 2, cast: true, sharp: true, tex: T(f, 'mottle'), texOp: 1 }); L(f, F, [add(p, [-10, -10]), add(p, [-2, -h + 20])], 3, '#d8d8d0', { op: 0.6 }); if (k % 3 === 0) f.flat(F(ell(add(p, [0, -h + 12]), 7, 12, 0, 8)), BLOOD, { op: 0.85 }); }
  for (let k = 0; k < 8; k++) { const a = (k + 0.3) / 8 * Math.PI, p = add(c, [Math.cos(a) * rx, Math.sin(a) * ry + 10]); f.part(F([add(p, [-10, 0]), add(p, [30, 30]), add(p, [10, 0])]), { fill: '#5a5c60', shade: 0.3, inkW: 1.2, cast: false, sharp: true }); }
  D.bloom(f, F([add(c, [120, 70])])[0], 26, C.RUST, { n: 3 }); D.bloom(f, F([add(c, [-160, 60])])[0], 20, C.RUST, { n: 2 });
  return { focus: F([c])[0], sig: SB(F, [-305, -250, 305, 185]), feat: ['blood'], ells: [ry / rx] };
};
META.crown = { act: 'press', only: ['close', 'table', 'niche', 'ledge'] };

// ==== the Duelist
O.block = (f, o = {}) => { // the headsman's block: a squat log of oak on the scaffold boards, a chin notch cut in its top, deep axe scores, old blood soaked dark
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const side = [[-280, -60], [280, -60], [270, 220], [-270, 220]]; P(f, F, [...side.slice(0, 2), ...turned([[280, -60], [270, 220]], 0.22).slice(1)], C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, side, 0.3, 9, 1.57);
  shadeR(f, F, side, 100, 280, -60, 240, 12, { op: 0.45 }); for (let i = 0; i < 4; i++) L(f, F, [[-200 + i * 140, -50], [-210 + i * 140, 230]], 3, INK, { op: 0.5 });   // the bark's cracks
  const top = ell([0, -60], 280, 70, 0, 40); f.part(F(top), { fill: '#b89a70', shade: 0.3, inkW: 2, cast: false, tex: T(f, 'wood'), texOp: 1 });
  for (let k = 1; k < 6; k++) ring(f, F, [20, -56], 280 * k / 6, 70 * k / 6, 1, '#6a4a2a');
  f.part(F([[-90, -130], [-40, -60], [40, -60], [90, -130], [60, -40], [-60, -40]]), { fill: '#3a2414', shade: 0.2, inkW: 2, cast: false });   // the chin notch
  for (const [x, a] of [[-180, 0.3], [120, -0.2], [190, 0.5]]) L(f, F, [[x - 40, -60 + Math.sin(a) * 20], [x + 40, -60 - Math.sin(a) * 20]], 7, '#16110e');   // axe scores
  D.stain(f, F([[60, -40]])[0], 90, '#3a0e0a', { op: 0.55, sq: 0.3 }); D.bloom(f, F([[0, 40]])[0], 40, '#4c0c08', { n: 3, op: 0.6 }); L(f, F, [[40, -10], [50, 80], [30, 180]], 10, '#4c0c08', { op: 0.7 });
  P(f, F, [[-380, 220], [380, 220], [400, 300], [-400, 300]], C.OAK, { sharp: true, tex: T(f, 'wood'), texOp: 1 }); planks(f, F, -400, 400, 220, 300, 5);
  return { focus: F([[0, -60]])[0], sig: SB(F, [-400, -135, 400, 300]), feat: ['blood'], ells: [70 / 280, 0.22] };
};
META.block = { act: 'crack', only: ['close', 'niche'] };

O.noose = (f, o = {}) => { // a hangman's noose on the gallows beam: a thick rope, the coiled hangman's knot, the open loop hanging still, the beam and its iron hook
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, RP = '#a89470';
  const beam = [[-380, -380, 1], [380, -380, 1], [380, -300, 1], [-380, -300, 1]]; D.slab(f, F(beam), [0, 14]); P(f, F, beam, C.OAK, { tex: T(f, 'wood'), texOp: 1 });
  tube(f, F, [[0, -300], [0, -120]], 36, RP, { dash: '12 5' });
  const knot = [[-46, -130], [46, -130], [44, 80], [-44, 80]]; P(f, F, knot, RP, { tex: T(f, 'weave'), texOp: 1 }); for (let k = 0; k < 11; k++) { const y = -120 + k * 18; L(f, F, [[-46, y], [0, y + 8], [46, y]], 4, INK, { op: 0.75 }); }   // the thirteen turns
  const loopP = K.catmull([[-30, 80], [-160, 160], [-200, 300], [-80, 380], [80, 380], [200, 300], [160, 160], [30, 80]], 6); L(f, F, loopP, 44, INK); L(f, F, loopP, 34, RP); L(f, F, loopP, 34, '#6a5a40', { dash: '10 6' });
  L(f, F, loopP.slice(2, 14).map(p => add(p, [-6, -8])), 5, '#f0e0b8', { op: 0.5 });
  tube(f, F, [[40, 80], [70, 160], [56, 220]], 16, RP);   // the tail
  f.rivet(F([[-300, -340]])[0], 8, '#8a8a86'); f.rivet(F([[300, -340]])[0], 8, '#8a8a86'); D.crack(f, F([[200, -330]])[0], 0, 120, { n: 4 }); D.stain(f, F([[0, 360]])[0], 30, '#2a1a0c');
  return { focus: F([[0, 200]])[0], sig: SB(F, [-230, -390, 230, 410]), feat: [], ells: [] };
};
META.noose = { act: 'swing', only: ['close'] };

O.cuppingglass = (f, o = {}) => { // a bell-shaped cupping glass with a burning spill under its mouth: thick glass, the flame drawing the air, a bead of blood risen inside
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const gl = turned([[60, -260], [110, -220], [160, -120], [190, 0], [200, 120], [210, 160]], 0.22);
  P(f, F, gl, '#a8b4ac', { tex: T(f, 'mottle'), texOp: 0.5, opacity: 0.9 }); grain(f, F, gl, 0.25, 11, 1.1, '#1a2420'); shadeR(f, F, gl, 100, 210, -220, 180, 10, { op: 0.4 });
  L(f, F, [[-150, -100], [-180, 20], [-170, 130]], 12, '#f4f8f4', { op: 0.6 }); L(f, F, [[-40, -240], [-80, -180]], 6, '#f4f8f4', { op: 0.6 });
  oval(f, F, [0, -262], 60, 14, '#c8d0c8'); oval(f, F, [0, 160], 210, 46, '#b8c4bc', { opacity: 0.85 });
  f.part(F(ell([0, 150], 170, 36, 0, 24)), { fill: '#a8786a', shade: 0.4, inkW: 1.4, cast: false }); oval(f, F, [0, 120], 70, 40, '#6a1810', { shade: 0.3 });   // the drawn skin and the blood risen in it
  tube(f, F, [[150, 260], [330, 330]], 14, '#c8a870'); K.fxReq(f, 'flame', F([[160, 250]])[0], 90, { col: '#c86030' });
  D.chip(f, F([[180, 160]])[0], 7, 0);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-215, -280, 335, 340]), feat: ['blood', 'fire'], ells: [14 / 60, 46 / 210, 0.22] };
};
META.cuppingglass = { act: 'burn', only: ['close', 'table', 'ledge'] };

O.drum = (f, o = {}) => { // a tabor drum on its strap: a deep wooden shell laced with zig-zag cords, a calfskin head seen from above, two sticks crossed on it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const sh = [[-240, -120], [240, -120], [240, 160], [-240, 160]]; P(f, F, [...sh.slice(0, 2), ...turned([[240, -120], [240, 160]], 0.3).slice(1)], '#7a4a2a', { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, sh, 0.25, 10, 1.57); shadeR(f, F, sh, 100, 240, -120, 220, 12, { op: 0.45 });
  for (let k = 0; k < 9; k++) { const t = 0.1 + k * 0.1, x0 = -240 + 480 * t, x1 = x0 + 52; L(f, F, [[x0, -110 + Math.sin(t * Math.PI) * 30], [x1, 200 + Math.sin(t * Math.PI) * 40 - 30]], 5, '#d8c8a0'); L(f, F, [[x1, -110 + Math.sin(t * Math.PI) * 30], [x0 + 104, 190]], 3, '#a89470', { op: 0.8 }); }
  for (const y of [-120, 160]) { const q = ell([0, y], 244, 72, 0, 30).slice(0, 16); L(f, F, q, 20, INK); L(f, F, q, 13, '#5a3a20'); }
  oval(f, F, [0, -120], 240, 72, '#d8c8a8', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, ell([0, -120], 240, 72, 0, 30), 0.2, 12, 0.3, '#6a5a40'); f.flat(F(ell([-30, -130], 80, 20, 0, 16)), '#f0e8d4', { op: 0.4 });
  tube(f, F, [[-200, -220], [120, -60]], 16, C.OAKL); tube(f, F, [[200, -230], [-80, -70]], 16, C.OAKL); for (const p of [[120, -60], [-80, -70]]) oval(f, F, p, 18, 16, C.OAK);
  tube(f, F, [[-240, -60], [-330, -220], [-220, -330]], 12, '#5a3e28', { lit: false });
  D.chip(f, F([[200, 160]])[0], 8, 0); D.stain(f, F([[60, -110]])[0], 40, '#5a4a30', { op: 0.3 });
  return { focus: F([[0, -120]])[0], sig: SB(F, [-340, -335, 250, 235]), feat: [], ells: [72 / 240, 0.3] };
};
META.drum = { act: 'ring', only: ['close', 'table', 'floor', 'ledge'] };

O.saw = (f, o = {}) => { // a surgeon's bone saw: a deep toothed steel blade in a bow frame, a turned ebony handle, blood in the teeth
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r;
  const blade = [[-300, 20], [260, 20], [260, 110], [-300, 110]]; P(f, F, blade.map(p => [p[0], p[1], 1]), '#a8aaac', { tex: T(f, 'mottle'), texOp: 0.8 }); grain(f, F, blade, 0.25, 8, 0);
  for (let i = 0; i < 28; i++) { const x = -300 + i * 20; f.part(F([[x, 110], [x + 20, 110], [x + 4, 150]]), { fill: '#a8aaac', shade: 0.3, inkW: 1.2, cast: false, sharp: true }); if (i % 4 === 1) f.flat(F(ell([x + 8, 128], 5, 8, 0, 6)), BLOOD, { op: 0.85 }); }
  lit(f, F, [[-290, 26], [250, 26]], 4, 0.7);
  const bow = [[-300, 20], [-320, -120], [-200, -220], [100, -220], [240, -160], [260, 20]]; tube(f, F, bow, 30, '#5a5c60'); for (const x of [-300, 260]) { P(f, F, [[x - 16, -10], [x + 16, -10], [x + 16, 40], [x - 16, 40]], '#5a5c60', { dress: false }); f.rivet(F([[x, 14]])[0], 6, '#c8c8c4'); }
  P(f, F, turned([[30, 0], [40, 40], [34, 100], [44, 160], [40, 200]], 0.2).map(([x, y]) => [x - 330, y + 20]), '#2a2422', { tex: T(f, 'wood'), texOp: 1 });
  D.bloom(f, F([[0, 60]])[0], 24, BLOOD, { n: 3, op: 0.6 }); D.bloom(f, F([[150, -200]])[0], 16, C.RUST, { n: 2 });
  return { focus: F([[0, 80]])[0], sig: SB(F, [-340, -240, 275, 225]), grip: { c: F([[-330, 140]])[0], thumb: (o.ang ?? -0.15) }, feat: ['blood'], ells: [] };
};
META.saw = { act: 'swing', ang: -0.15 };

O.razor = (f, o = {}) => { // a barber's straight razor opened out: a broad hollow-ground blade with a bright edge, the tang's thumb notch, the horn scales on their pin
  const F = frame([0, 0], o.ang ?? -0.3, 1), r = f.r;
  const blade = [[-60, -30], [260, -40], [330, -20], [340, 60], [300, 110], [-60, 60]]; P(f, F, blade.map(p => [p[0], p[1], 1]), '#b8babc', { tex: T(f, 'mottle'), texOp: 0.8 }); grain(f, F, blade, 0.25, 8, 0);
  f.part(F([[-40, -10], [300, -20], [320, 0], [-40, 10]]), { fill: '#8a8c90', shade: 0.3, inkW: 1, cast: false }); L(f, F, [[-60, 60], [300, 110]], 4, '#ffffff', { op: 0.85 });   // the spine and the edge
  for (let i = 0; i < 4; i++) L(f, F, [[-50 + i * 10, -26], [-50 + i * 10, -14]], 2, INK);
  const scales = [[-80, 0], [-120, -30], [-420, -60], [-440, -20], [-420, 20], [-120, 30]]; P(f, F, scales, '#4a3a2e', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, scales, 0.3, 9, 0.1, '#c8a878');
  f.rivet(F([[-90, 0]])[0], 9, '#c8c8c4'); f.rivet(F([[-400, -20]])[0], 7, '#c8c8c4');
  f.flat(F(ell([280, 80], 16, 6, 0.2, 8)), BLOOD, { op: 0.85 }); D.bloom(f, F([[120, 60]])[0], 14, '#4a4c50', { n: 2, op: 0.4 });
  K.fxReq(f, 'drip', F([[300, 110]])[0], 2, { col: BLOOD });
  return { focus: F([[150, 30]])[0], sig: SB(F, [-445, -65, 345, 115]), grip: { c: F([[-300, -20]])[0], thumb: (o.ang ?? -0.3) }, feat: ['blood'], ells: [] };
};
META.razor = { act: 'swing', ang: -0.3 };

O.maingauche = (f, o = {}) => { // a main gauche, the parrying dagger: a short stout blade, a wide shell guard curving over the knuckles, long quillons bent forward to trap a blade
  const F = frame([0, 0], o.ang ?? -0.7, 1), r = f.r;
  const blade = [[-40, -60], [40, -60], [28, -300], [0, -400], [-28, -300]]; P(f, F, blade.map(p => [p[0], p[1], 1]), '#b0b2b4', { tex: T(f, 'mottle'), texOp: 0.8 }); L(f, F, [[0, -70], [0, -390]], 3, '#5a5c60'); L(f, F, [[-30, -80], [-20, -300]], 4, '#ffffff', { op: 0.7 });
  const shell = [[-170, -40], [-120, -110], [0, -130], [120, -110], [170, -40], [140, 30], [0, 50], [-140, 30]]; D.slab(f, F(shell), [8, 10]); P(f, F, shell, '#7a7c80', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, shell, 0.3, 9);
  for (let k = 0; k < 9; k++) { const a = Math.PI * (1.1 + k * 0.1); f.part(F(ell([Math.cos(a) * 110, -40 + Math.sin(a) * 50], 6, 6, 0, 8)), { fill: '#120c08', shade: 0.1, inkW: 0.8, cast: false, hatch: false }); }   // the shell's piercings
  for (const s of [-1, 1]) tube(f, F, [[s * 100, -60], [s * 230, -90], [s * 270, -170]], 22, '#6a6c70');
  P(f, F, [[-30, 40], [30, 40], [26, 220], [-26, 220]], '#3a2a22', { tex: T(f, 'wood'), texOp: 1 }); for (let i = 0; i < 8; i++) L(f, F, [[-28, 50 + i * 22], [28, 62 + i * 22]], 3, '#8a7a5a');   // the wire-bound grip
  oval(f, F, [0, 236], 40, 34, '#6a6c70');
  D.bloom(f, F([[60, -20]])[0], 20, C.RUST, { n: 2 }); f.scratches(F([[-60, -60]])[0], 40, 8, '#e8e8e0');
  return { focus: F([[0, -80]])[0], sig: SB(F, [-285, -405, 285, 275]), grip: { c: F([[0, 140]])[0], thumb: (o.ang ?? -0.7) - Math.PI / 2 }, feat: [], ells: [] };
};
META.maingauche = { act: 'swing', ang: -0.7 };

module.exports = { O, META };
