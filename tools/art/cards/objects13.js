// The card object library, part thirteen: the one-object-per-card pass for the Alchemist (L72), drawn to the proposed
// names (renames.csv): a brine ladle, a leech jar, a wassail bowl, a fox-head stirrup cup, a bronze posnet, a medicine
// chest, a bundle of ironbark, bulrushes with a marsh light, a bottle of aqua fortis eating its plate, an ouroboros, a
// rat swarm, a pewter quaich (the dram), a bursting puffball, a lime pit of skulls, a blowfly and a cordial glass. Same
// contract and META as objects6.js; glass as objects7.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const { glass, cork, clipBelow } = require('./objects7').helpers;
const { flame } = require('./objects12').helpers;
const O = {}, META = {};
const liqOf = (o, dflt) => o.brew || (INKS[o.course] ? mix(INKS[o.course], '#2a1a10', 0.25) : dflt);

O.ladle = (f, o = {}) => { // a long iron brine ladle swung to throw: a deep round bowl on a long hooked handle, brine slopping over the lip, salt crusted white round the rim
  const F = frame([0, 0], o.ang ?? -0.5, 1), r = f.r;
  tube(f, F, [[0, 380], [10, 100], [30, -120], [70, -200]], 22, C.IRON); P(f, F, [[-20, 380], [20, 380], [30, 420], [0, 450], [-30, 420]], C.IRON, { dress: false });   // the handle and its hook end
  const bowl = []; for (let i = 0; i <= 16; i++) { const t = Math.PI * i / 16; bowl.push([-220 * Math.cos(t), -230 + 200 * Math.sin(t)]); } const bw = bowl.map(p => add(p, [70, 0]));
  P(f, F, bw, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, bw, [-190, -150, -110, -70], () => 210, 0.3, { op: 0.5 }); shadeR(f, F, bw, 140, 290, -220, -40, 9, { op: 0.5 });
  oval(f, F, [70, -230], 220, 56, '#2e3e5a', { shade: 0.4 }); L(f, F, ell([70, -232], 196, 44, 0, 24).slice(13, 24), 3, '#c8d8e0', { op: 0.6 });
  L(f, F, loop(ell([70, -230], 222, 58, 0, 28)), 6, '#e8e8e0', { op: 0.6, dash: '6 10' });   // the salt crust
  P(f, F, [[-140, -250], [-200, -330], [-150, -380], [-90, -300], [-40, -270]], '#3e5272', { dress: false });   // brine slopping over the lip, joined to the bowl (L56)
  D.bloom(f, F([[90, -150]])[0], 20, C.RUST, { n: 3 });
  return { focus: F([[70, -230]])[0], sig: SB(F, [-210, -390, 300, 450]), grip: { c: F([[6, 250]])[0], thumb: (o.ang ?? -0.5) - Math.PI / 2 }, feat: ['contents'], ells: [40 / 170] };
};
META.ladle = { act: 'fling', ang: -0.5 };

O.leechjar = (f, o = {}) => { // an apothecary's leech jar: a tall glazed jar with a pierced lid so they can breathe, black leeches crawling up the glass inside and one out over the lid
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const body = turned([[110, -210], [130, -170], [170, -60], [170, 120], [140, 220], [150, 260]], 0.2);
  glass(f, F, body, { level: -80, liq: '#4a5a44', glass: '#8aa29a', arcs: [[-120, -20, 60, 140], y => 170], shade: [60, 160, -160, 240], hi: [[[-130, -120], [-150, 40], [-120, 180]]], bubbles: 6 });
  const leech = (pts, w) => { const s = sweep(pts, w, w * 0.6, t => w * (0.6 + 0.6 * Math.sin(Math.PI * t))); f.part(F(s.poly), { fill: '#1a1410', shade: 0.3, inkW: 1.2, cast: false }); for (let i = 3; i < s.c.length - 2; i += 3) L(f, F, [s.A[i], s.B[i]], 1.2, '#5a4a3a', { op: 0.6 }); L(f, F, s.A.slice(2, -2), 1.4, '#7a6a5a', { op: 0.5 }); };
  leech([[-120, 180], [-90, 60], [-110, -40]], 30); leech([[60, 200], [100, 90], [70, -20]], 26); leech([[-20, 100], [10, 20], [-10, -60]], 24);
  P(f, F, [[-140, -210], [140, -210], [120, -260], [-120, -260]], C.PEWTER, { dress: false }); oval(f, F, [0, -260], 120, 22, '#a8aaa4'); for (let i = 0; i < 7; i++) f.part(F(ell([-90 + i * 30, -262], 6, 4, 0, 6)), { fill: '#1a120a', shade: 0.1, inkW: 0.6, cast: false });
  L(f, F, [[-150, -230], [150, -230]], 8, '#4a4c48'); leech([[40, -270], [120, -300], [180, -250], [190, -170]], 26);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-175, -300, 200, 265]), feat: ['contents'], ells: [0.2, 22 / 120] };
};
META.leechjar = { act: 'open', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

O.wassail = (f, o = {}) => { // a wassail bowl: a great turned wooden bowl on a stemmed foot, brimming with spiced ale, roasted apples floating, ribbons tied to its rim
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const bowl = [[-320, -60], [-290, 60], [-200, 150], [-70, 190], [70, 190], [200, 150], [290, 60], [320, -60]];
  P(f, F, [[-80, 180], [80, 180], [60, 250], [140, 300], [-140, 300], [-60, 250]], C.OAK, { tex: T(f, 'wood'), texOp: 1 }); oval(f, F, [0, 300], 140, 22, C.OAK);
  P(f, F, bowl, '#7a5432', { tex: T(f, 'wood'), texOp: 1 }); arcs(f, F, bowl, [0, 50, 100, 150], y => 310 - y * 0.6, 0.22, { op: 0.45 }); grain(f, F, bowl, 0.25, 11, 0.05);
  for (const y of [30, 110]) L(f, F, [[-300 + y * 0.6, y], [0, y + 30], [300 - y * 0.6, y]], 4, '#3a2410', { op: 0.6 });
  oval(f, F, [0, -60], 320, 66, '#9a6a3a'); oval(f, F, [0, -56], 296, 54, '#6a3a1a', { shade: 0.45 }); grain(f, F, ell([0, -56], 296, 54, 0, 28), 0.3, 10, 0.1, '#d8a060');
  for (const [x, y, s] of [[-150, -60, 46], [-30, -40, 50], [100, -64, 44], [210, -50, 34]]) { f.part(F(ell([x, y], s, s * 0.7, 0, 14)), { fill: '#a84a24', shade: 0.4, inkW: 1.4, cast: false }); L(f, F, [[x - s * 0.3, y - s * 0.4], [x, y - s * 0.1]], 3, '#f0c890', { op: 0.6 }); f.part(F([[x - 4, y - s * 0.5], [x + 4, y - s * 0.5], [x + 2, y - s * 0.8]]), { fill: '#3a2a10', shade: 0.2, inkW: 0.8, cast: false }); }
  for (const [x, col] of [[-300, '#7a2418'], [300, '#4a6a3a']]) { const s = Math.sign(x); P(f, F, [[x, -50], [x + s * 30, 40], [x + s * 10, 140], [x + s * 40, 220], [x + s * 20, 230], [x - s * 10, 140], [x + s * 6, 40], [x - s * 14, -40]], col, { dress: false }); }
  D.chip(f, F([[260, 40]])[0], 10, 0); D.crack(f, F([[-200, 100]])[0], 1.3, 60, { n: 4 }); K.fxReq(f, 'steam', F([[0, -100]])[0], 80, { col: '#c8c0b0' });
  return { focus: F([[0, -50]])[0], sig: SB(F, [-345, -130, 345, 322]), feat: ['contents'], ells: [66 / 320, 54 / 296] };
};
META.wassail = { act: 'pour', noTurn: true, only: ['close', 'table', 'ledge', 'floor'] };

O.stirrupcup = (f, o = {}) => { // a silver stirrup cup in the shape of a fox's head, held up mouth-first: pricked ears, a narrow snout, the rim a band at the neck, the last of the drink inside
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r, SIL = '#a8aaa4';
  const head = [[-160, -140], [-120, -230], [-90, -320], [-50, -220], [50, -220], [90, -320], [120, -230], [160, -140], [150, 0], [90, 140], [40, 260], [0, 300], [-40, 260], [-90, 140], [-150, 0]];
  P(f, F, head, SIL, { tex: T(f, 'mottle'), texOp: 0.8 }); shadeR(f, F, head, 40, 150, -180, 240, 10, { op: 0.45 }); grain(f, F, head, 0.22, 12, 1.2);
  for (const s of [-1, 1]) { f.part(F([[s * 90, -300], [s * 112, -236], [s * 70, -230]]), { fill: '#4a4c48', shade: 0.3, inkW: 1.2, cast: false }); f.part(F(ell([s * 60, -40], 26, 14, s * 0.35, 12)), { fill: '#1a1a18', shade: 0.1, inkW: 1.2, cast: false }); f.flat(F(ell([s * 54, -44], 6, 4, 0, 6)), '#f0f0e8', { op: 0.8 }); }
  for (let i = 0; i < 6; i++) { L(f, F, [[-120 + i * 8, 40 + i * 30], [-60 + i * 4, 60 + i * 30]], 2, '#4a4c48', { op: 0.5 }); L(f, F, [[120 - i * 8, 40 + i * 30], [60 - i * 4, 60 + i * 30]], 2, '#4a4c48', { op: 0.5 }); }   // chased fur
  f.part(F(ell([0, 280], 30, 18, 0, 10)), { fill: '#1a1a18', shade: 0.1, inkW: 1, cast: false });   // the nose
  oval(f, F, [0, -150], 160, 40, '#c8cac4'); oval(f, F, [0, -146], 138, 30, '#5a2a1a', { shade: 0.5 }); L(f, F, ell([0, -150], 156, 38, 0, 24).slice(13, 24), 4, '#f4f4ee', { op: 0.6 });
  L(f, F, [[-130, -60], [-110, 80], [-60, 200]], 8, '#f8f8f2', { op: 0.5 }); f.scratches(F([[60, 60]])[0], 40, 8, '#f8f8f2');
  return { focus: F([[0, -100]])[0], sig: SB(F, [-165, -325, 165, 305]), grip: { c: F([[80, 120]])[0], thumb: (o.ang ?? -0.15) + 0.4 }, feat: ['contents'], ells: [40 / 160, 30 / 138] };
};
META.stirrupcup = { act: 'pour', ang: -0.15 };

O.posnet = (f, o = {}) => { // a bronze posnet over the fire: a round-bellied cooking pot on three tall legs with a long straight handle, the brew bubbling over, flames licking up between the legs
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const [x0, x1] of [[-140, -190], [0, 0], [140, 190]]) tube(f, F, [[x0, 60], [x1, 280]], 24, C.BRONZE);
  flame(f, F, [-60, 280], 150, 56, 0.1); flame(f, F, [70, 280], 120, 44, -0.15);
  const body = [[-230, -110], [-240, -20], [-200, 60], [-100, 110], [100, 110], [200, 60], [240, -20], [230, -110]]; P(f, F, body, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, body, [-60, 0, 60], y => 240 - Math.abs(y) * 0.6, 0.22, { op: 0.5 }); shadeR(f, F, body, 80, 230, -90, 90, 9, { op: 0.5 });
  tube(f, F, [[220, -80], [460, -150]], 28, C.BRONZE); f.part(F(ell([470, -152], 18, 22, 0, 10)), { fill: C.BRONZE, shade: 0.4, inkW: 1.4, cast: false });   // the handle
  oval(f, F, [0, -112], 232, 44, '#8a7a50'); oval(f, F, [0, -108], 210, 34, liqOf(o, '#5a3a1a'), { shade: 0.5 });
  for (const [x, s] of [[-80, 26], [40, 20], [120, 16]]) { f.part(F(ell([x, -114], s, s * 0.6, 0, 10)), { fill: mix(liqOf(o, '#5a3a1a'), '#d8c8a0', 0.3), shade: 0.3, inkW: 1, cast: false }); }
  D.wax(f, F([[-200, -96], [-160, -90]]), liqOf(o, '#5a3a1a'), { thick: 8, drips: 2, dripL: 70 }); L(f, F, [[-200, -60], [-210, 20]], 7, '#e8d8a8', { op: 0.5 }); D.bloom(f, F([[120, 40]])[0], 22, C.VERD, { n: 3 });
  K.fxReq(f, 'steam', F([[0, -150]])[0], 90, { col: '#c8c0b0' });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-245, -160, 490, 290]), feat: ['contents', 'fire'], ells: [44 / 232, 34 / 210] };
};
META.posnet = { act: 'burn', only: ['close', 'floor', 'niche'] };

O.medchest = (f, o = {}) => { // a physician's medicine chest standing open: an iron-bound oak box, its lid thrown back with a painted label, rows of stoppered bottles in their slots, one gone
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const lid = [[-300, -60], [300, -60], [280, -330], [-280, -330]]; P(f, F, lid, C.OAK, { tex: T(f, 'wood'), texOp: 1 }); f.part(F([[-240, -100], [240, -100], [224, -290], [-224, -290]]), { fill: '#3e2e3a', shade: 0.45, inkW: 1.6, cast: false, tex: T(f, 'weave'), texOp: 0.6 });
  f.part(F([[-120, -230], [120, -230], [120, -170], [-120, -170]]), { fill: C.VELLUM, shade: 0.2, inkW: 1.2, cast: false }); for (let k = 0; k < 3; k++) L(f, F, [[-96, -214 + k * 18], [96, -214 + k * 18]], 2.4, '#4a3a2a', { op: 0.6 });
  const box = [[-320, -40], [320, -40], [320, 250], [-320, 250]]; P(f, F, box, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, box, 0.3, 11, 0.02);
  f.part(F([[-290, -40], [290, -40], [290, 60], [-290, 60]]), { fill: '#1e140c', shade: 0.1, inkW: 1.6, cast: false });
  const cols = ['#5a7a6a', '#7a3a26', '#8a9a8a', '#5a4a6a', '#9a7a3a', '#4a6a8a', '#6a7a4a'];
  for (let i = 0; i < 7; i++) { if (i === 4) continue; const x = -250 + i * 83, h = 150 + (i % 3) * 30, body = turned([[18, -h], [20, -h + 30], [34, -h + 70], [34, 30]], 0.25).map(p => add(p, [x, 30]));
    glass(f, F, body, { level: 30 - h * 0.5, liq: cols[i], glass: '#9aa89a', bubbles: 2 }); cork(f, F, [x, 30 - h], 20, 26); }
  for (const x of [-320, 320]) for (const y of [-40, 250]) f.part(F([[x - 30, y - 30], [x + 30, y - 30], [x + 30, y + 30], [x - 30, y + 30]]), { fill: C.IRON, shade: 0.4, inkW: 1.4, cast: false });
  f.part(F([[-40, 100], [40, 100], [40, 170], [-40, 170]]), { fill: C.IRON, shade: 0.4, inkW: 1.4, cast: false }); f.part(F(ell([0, 132], 10, 14, 0, 8)), { fill: '#0a0806', shade: 0.1, inkW: 0.8, cast: false });
  D.chip(f, F([[280, 200]])[0], 10, 0); D.crack(f, F([[-200, 180]])[0], 1.5, 80, { n: 4 });
  return { focus: F([[0, -10]])[0], sig: SB(F, [-350, -335, 350, 280]), feat: ['contents'], ells: [] };
};
META.medchest = { act: 'open', noTurn: true, only: ['close', 'table', 'floor'] };

O.barkbundle = (f, o = {}) => { // ironbark: curled strips of dark iron-hard bark tied in a bundle with twine, a little stoppered bottle of the tincture tucked in the binding
  const F = frame([0, 0], o.ang ?? -0.25, 1), r = f.r;
  for (let i = 0; i < 6; i++) { const x = -150 + i * 58, y0 = 300 - (i % 2) * 30, y1 = -300 + (i % 3) * 30; const s = [[x - 30, y1], [x + 34, y1 + 10], [x + 30, y0], [x - 34, y0 - 10]]; P(f, F, s, i % 2 ? '#3a2e24' : '#4a3a2c', { tex: T(f, 'wood'), texOp: 1, dressO: { op: 0.4 } }); for (let k = 0; k < 4; k++) L(f, F, [[x - 20 + k * 12, y1 + 20], [x - 22 + k * 13, y0 - 20]], 1.8, '#1a120c', { op: 0.6 }); oval(f, F, [x, y1], 32, 12, '#a87a4a'); L(f, F, ell([x, y1], 26, 8, 0, 14).slice(0, 8), 2, '#5a3a1a'); }
  for (const y of [-120, 140]) { L(f, F, [[-200, y], [200, y + 10]], 14, INK); L(f, F, [[-200, y], [200, y + 10]], 8, C.TWINE); for (let k = 0; k < 8; k++) L(f, F, [[-190 + k * 50, y - 4], [-180 + k * 50, y + 10]], 1.4, '#4a3a20', { op: 0.7 }); }
  const b = turned([[16, -90], [18, -70], [44, -30], [44, 90]], 0.25).map(p => add(p, [210, 40])); glass(f, F, b, { level: 60, liq: '#6a4a2a', glass: '#8a9a7a', bubbles: 2 }); cork(f, F, [210, -50], 18, 26);
  D.stain(f, F([[0, 0]])[0], 40, '#1a120c', { op: 0.3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-200, -310, 260, 310]), grip: { c: F([[0, 200]])[0], thumb: (o.ang ?? -0.25) - Math.PI / 2 }, feat: [], ells: [] };
};
META.barkbundle = { act: 'press', ang: -0.25 };

O.bulrush = (f, o = {}) => { // marsh lights: a clump of bulrushes standing in black water, brown cat's-tail heads on tall stems, and a pale will-o'-the-wisp flame floating among them
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  f.part(F(ell([0, 270], 330, 60, 0, 30)), { fill: '#1a1e1a', shade: 0.3, inkW: 2, cast: false }); L(f, F, ell([0, 270], 300, 50, 0, 30).slice(16, 28), 3, '#6a7a6a', { op: 0.6 });
  const stems = [[-200, 280, -230, -150], [-120, 280, -110, -300], [-40, 280, -60, -200], [50, 280, 70, -330], [140, 280, 160, -180], [220, 280, 260, -90]];
  stems.forEach(([x0, y0, x1, y1], i) => { L(f, F, [[x0, y0], [x1, y1]], 12, INK); L(f, F, [[x0, y0], [x1, y1]], 7, '#5a6a3a');
    if (i % 2 === 0) { const leaf = [[x0 + 6, y0], [x0 + 40 + i * 6, y0 - 200], [x0 + 90, y0 - 340], [x0 + 30, y0 - 190]]; P(f, F, leaf, '#4a5a30', { dress: false }); }
    if (i !== 5) { const d = norm(sub([x1, y1], [x0, y0])), c = add([x1, y1], mul(d, -70)); f.part(F(limb(add(c, mul(d, -50)), add(c, mul(d, 50)), 40, 40, { capK: 0.9 })), { fill: '#5a3a1e', shade: 0.45, inkW: 1.6, tex: T(f, 'weave'), texOp: 0.6 }); L(f, F, [add(c, mul(d, -40)), add(c, mul(d, 40))].map(p => add(p, [-10, 0])), 3, '#8a6a40', { op: 0.6 }); } });
  const wisp = [-20, -40]; for (const [k, rr, col, op] of [[0, 90, '#5a7a6a', 0.35], [1, 56, '#a8c8a8', 0.6], [2, 30, '#e8f0d8', 0.9]]) f.part(F(ell(wisp, rr, rr * 1.3, 0, 18)), { fill: col, shade: 0, inkW: k === 0 ? 0 : 0.8, cast: false, opacity: op });
  return { focus: F(wisp && [wisp])[0], sig: SB(F, [-330, -340, 330, 330]), feat: ['fire'], ells: [60 / 330] };
};
META.bulrush = { act: 'glare', noTurn: true, only: ['close', 'floor', 'niche'] };

O.aquafortis = (f, o = {}) => { // aqua fortis: a squat stoppered bottle of yellow acid tipped over a copper plate, the plate eaten through in a ragged hole where it pooled, fumes rising
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const plate = [[-320, 150], [300, 110], [330, 250], [-300, 290]]; P(f, F, plate, C.COPPER, { tex: T(f, 'mottle'), texOp: 1, sharp: true }); grain(f, F, plate, 0.3, 9, 0.2);
  const hole = [[-40, 180], [20, 166], [90, 178], [110, 210], [60, 240], [-10, 238], [-60, 220]]; f.part(F(hole), { fill: '#0a0806', shade: 0.1, inkW: 2, cast: false }); f.line(F(loop(hole.map(p => lerp(p, [30, 205], -0.25)))), 6, '#5a8a5a', { op: 0.8 }); f.line(F(loop(hole.map(p => lerp(p, [30, 205], -0.5)))), 3, '#3a6a4a', { op: 0.5 });
  const G = pts => F(pts.map(p => add([-150, -20], rot(p, -0.55))));
  const body = turned([[30, -170], [34, -140], [130, -70], [140, 50], [100, 120]], 0.25); glass(f, G, body, { level: 0, liq: '#a8a83a', glass: '#9aaa8a', arcs: [[-40, 20, 80], () => 140], hi: [[[-110, -40], [-120, 60]]], bubbles: 5 });
  cork(f, G, [0, -170], 30, 40); f.part(G([[-30, -210], [30, -210], [24, -190], [-24, -190]]), { fill: '#5a4a3a', shade: 0.3, inkW: 1, cast: false });
  f.part(F([[-60, 130], [60, 176], [10, 200], [-80, 170]]), { fill: '#a8a83a', shade: 0.3, inkW: 1.2, cast: false, opacity: 0.85 });
  K.fxReq(f, 'steam', F([[30, 170]])[0], 110, { col: '#a8b87a' }); K.fxReq(f, 'steam', F([[100, 140]])[0], 70, { col: '#a8b87a' });
  D.bloom(f, F([[220, 200]])[0], 30, C.VERD, { n: 4 }); D.bloom(f, F([[-220, 230]])[0], 22, C.VERD, { n: 3 });
  return { focus: F([[20, 190]])[0], sig: SB(F, [-330, -230, 335, 295]), feat: ['contents'], ells: [0.25] };
};
META.aquafortis = { act: 'drip', noTurn: true, only: ['close', 'table', 'ledge', 'floor'] };

O.ouroboros = (f, o = {}) => { // solve et coagula: a bronze ouroboros, the scaled serpent biting its own tail in a ring, a dissolving drop above and a crystal below
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const cl = []; for (let i = 0; i <= 40; i++) { const t = 0.2 + i / 40 * 2 * Math.PI * 0.94; cl.push([Math.cos(t) * 250, Math.sin(t) * 250]); }
  const s = sweep(cl, 40, 90, t => 40 + 70 * Math.sin(Math.PI * Math.min(1, t * 1.1)) * (t < 0.95 ? 1 : 0.6));
  P(f, F, s.poly, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 2; i < s.c.length - 3; i += 2) { const m = lerp(s.A[i], s.B[i], 0.5); L(f, F, [s.A[i], add(m, mul(norm(sub(s.c[i + 1], s.c[i])), 18)), s.B[i]], 1.8, '#3a2e18', { op: 0.6 }); }   // scales
  L(f, F, s.B.slice(4, -4), 5, C.GILTL, { op: 0.5 });
  const h = s.c[s.c.length - 1], d = norm(sub(h, s.c[s.c.length - 4])), n = [-d[1], d[0]];
  const head = [add(h, mul(n, 60)), add(h, add(mul(d, 120), mul(n, 30))), add(h, add(mul(d, 110), mul(n, -10))), add(h, add(mul(d, 60), mul(n, -10))), add(h, add(mul(d, 120), mul(n, -40))), add(h, mul(n, -60))];
  P(f, F, head, '#8a7a50', { dressO: { op: 0.3 } }); f.part(F(ell(add(h, add(mul(d, 40), mul(n, 34))), 12, 10, 0, 8)), { fill: '#c8a02a', shade: 0.2, inkW: 1, cast: false }); f.part(F(ell(add(h, add(mul(d, 42), mul(n, 34))), 4, 8, Math.atan2(d[1], d[0]), 6)), { fill: '#0a0806', shade: 0.1, inkW: 0.5, cast: false });
  D.bloom(f, F([[200, 100]])[0], 24, C.VERD, { n: 3 }); f.scratches(F([[-180, -100]])[0], 40, 6, '#f0e0b0');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-310, -310, 310, 310]), feat: [], ells: [] };
};
META.ouroboros = { act: 'turn', noTurn: true, gold: true, only: ['close', 'niche', 'ledge', 'table'] };

O.rats = (f, o = {}) => { // a rat swarm: four brown rats piled and running over one another, long naked tails, one rearing with its teeth bared
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const rat = (c, a, s, col) => { const G = pts => F(pts.map(p => add(c, rot(mul(p, s), a))));
    const tail = [[-120, 20], [-220, 50], [-300, 10], [-360, 60]]; L(f, G, tail, 10 * s, INK); L(f, G, tail, 6 * s, '#c8907a');
    const body = [[-130, 0], [-110, -60], [-20, -90], [70, -70], [130, -30], [170, 0], [130, 20], [60, 40], [-60, 44], [-120, 30]]; P(f, G, body, col, { tex: T(f, 'weave'), texOp: 0.7, dressO: { op: 0.3 } }); grain(f, G, body, 0.45, 8, 1.2, '#c8b0a0');
    for (let i = 0; i < 6; i++) L(f, G, [[-90 + i * 34, -40], [-80 + i * 34, -10]], 1.6, '#1a120c', { op: 0.5 });
    f.part(G(ell([90, -70], 26, 20, 0, 10)), { fill: '#c8907a', shade: 0.3, inkW: 1.2, cast: false }); f.part(G(ell([136, -22], 7, 7, 0, 6)), { fill: '#0a0806', shade: 0.1, inkW: 0.6, cast: false }); f.part(G(ell([172, 0], 6, 5, 0, 6)), { fill: '#c8907a', shade: 0.2, inkW: 0.6, cast: false });
    for (const x of [-80, 60]) L(f, G, [[x, 30], [x - 6, 70], [x + 12, 76]], 6 * s, '#c8907a'); for (let k = -1; k <= 1; k++) L(f, G, [[160, 0], [210, k * 16]], 1, INK, { op: 0.6 }); };
  rat([-60, 200], 0.05, 1.05, '#5a4434'); rat([110, 110], -0.25, 0.95, '#4a3a2e'); rat([-120, 40], 0.3, 0.9, '#6a5040'); rat([60, -110], -0.75, 1, '#4e3c30');
  f.part(F([[140, -230], [156, -200], [170, -236]]), { fill: '#f0ead8', shade: 0.2, inkW: 0.8, cast: false });
  return { focus: F([[20, 40]])[0], sig: SB(F, [-330, -290, 290, 290]), feat: [], ells: [] };
};
META.rats = { act: 'burst', noTurn: true, only: ['close', 'floor', 'ledge'] };

O.quaich = (f, o = {}) => { // a dram: a small pewter quaich, a shallow two-eared drinking dish, a dram of spirit in it catching the light, held out by one ear
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, PW = '#9a9c96';
  for (const s of [-1, 1]) { const ear = [[s * 180, -50], [s * 330, -70], [s * 340, -30], [s * 320, 10], [s * 190, 10]]; P(f, F, ear, PW, { dressO: { op: 0.3 } }); f.part(F(ell([s * 290, -30], 14, 10, 0, 8)), { fill: '#3a3a36', shade: 0.2, inkW: 1, cast: false }); L(f, F, [[s * 200, -50], [s * 320, -64]], 3, '#f4f4ee', { op: 0.5 }); }
  const bowl = [[-220, -40], [-200, 50], [-120, 110], [0, 124], [120, 110], [200, 50], [220, -40]]; P(f, F, bowl, PW, { tex: T(f, 'mottle'), texOp: 0.8 }); arcs(f, F, bowl, [0, 40, 80], y => 210 - y, 0.3, { op: 0.45 }); shadeR(f, F, bowl, 60, 210, -30, 100, 8, { op: 0.45 });
  P(f, F, [[-80, 116], [80, 116], [100, 160], [-100, 160]], PW, { dress: false }); oval(f, F, [0, 160], 100, 18, '#6a6c66');
  oval(f, F, [0, -40], 220, 60, '#b8bab4'); oval(f, F, [0, -34], 190, 46, '#a8782a', { shade: 0.35 }); L(f, F, ell([-20, -38], 140, 30, 0, 20).slice(11, 19), 4, '#f8e8b8', { op: 0.7 });
  for (let i = 0; i < 6; i++) L(f, F, [[-200 + i * 80, 0], [-180 + i * 72, 90]], 2, '#4a4c48', { op: 0.4 });   // staves engraved
  f.scratches(F([[100, 40]])[0], 30, 6, '#f8f8f2');
  return { focus: F([[0, -34]])[0], sig: SB(F, [-345, -105, 345, 180]), grip: { c: F([[310, -30]])[0], thumb: 0 }, feat: ['contents'], ells: [60 / 220, 46 / 190] };
};
META.quaich = { act: 'pour', noTurn: true };

O.puffball = (f, o = {}) => { // a giant puffball on the turf, split open and bursting: the cracked white skin peeling back, a brown cloud of spores pouring out of the tear
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  f.part(F([[-320, 250], [-200, 210], [0, 220], [200, 206], [320, 250], [320, 290], [-320, 290]]), { fill: '#3a4a2a', shade: 0.4, inkW: 1.6, cast: false, tex: T(f, 'weave'), texOp: 0.6 });
  for (let i = 0; i < 14; i++) L(f, F, [[-300 + i * 46, 250], [-310 + i * 46 + (i % 3) * 10, 200]], 3, '#5a6a3a', { op: 0.8 });
  const ball = []; for (let i = 0; i <= 30; i++) { const t = Math.PI * 2 * i / 30; ball.push([Math.cos(t) * 230, 10 + Math.sin(t) * 200 * (Math.sin(t) > 0 ? 1.08 : 1)]); }
  P(f, F, ball, '#e0d8c4', { tex: T(f, 'mottle'), texOp: 0.8 }); arcs(f, F, ball, [-120, -40, 40, 120], y => 230 - Math.abs(y) * 0.7, 0.3, { op: 0.4 }); shadeR(f, F, ball, 80, 220, -140, 190, 10, { op: 0.45 });
  for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.6; f.part(F(ell([Math.cos(a) * 150, 30 + Math.sin(a) * 130], 18, 12, a, 8)), { fill: '#c8bea8', shade: 0.3, inkW: 1, cast: false }); }   // the cracked skin
  const tear = [[-110, -150], [-40, -200], [30, -170], [100, -210], [140, -140], [60, -110], [-20, -130], [-80, -100]]; f.part(F(tear), { fill: '#5a4026', shade: 0.3, inkW: 1.8, cast: false });
  for (const s of [-1, 1]) P(f, F, [[s * 120, -150], [s * 190, -230], [s * 150, -130]], '#e8e0cc', { dress: false });
  for (const [x, y, rr] of [[0, -260, 70], [-70, -330, 56], [60, -350, 60], [-10, -420, 44], [120, -290, 40], [-130, -260, 36]]) f.part(F(ell([x, y], rr, rr * 0.8, 0, 16)), { fill: '#7a5a36', shade: 0.25, inkW: 1.2, cast: false, opacity: 0.85, tex: T(f, 'mottle'), texOp: 0.8 });
  return { focus: F([[0, -160]])[0], sig: SB(F, [-320, -460, 320, 290]), feat: [], ells: [] };
};
META.puffball = { act: 'burst', noTurn: true, only: ['close', 'floor', 'ledge'] };

O.plaguepit = (f, o = {}) => { // a plague pit: a raw trench in the earth seen from its lip, white lime thrown over the dead, skulls and a ribcage showing through, a spade stuck in the spoil heap
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const earth = [[-340, -60], [340, -80], [340, 280], [-340, 280]]; P(f, F, earth, '#5a4430', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, earth, 0.3, 10, 0.4);
  const pit = [[-280, 0], [-120, -30], [100, -20], [280, 10], [250, 200], [60, 230], [-160, 220], [-270, 180]]; f.part(F(pit), { fill: '#1a140e', shade: 0.2, inkW: 2.4, cast: false });
  const lime = pit.map(p => lerp(p, [0, 110], 0.18)); f.part(F(lime), { fill: '#d8d4c8', shade: 0.4, inkW: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, lime, 0.25, 12, -0.6, '#6a6458');
  for (const [x, y, s, a] of [[-150, 80, 1, 0.2], [20, 130, 0.9, -0.3], [150, 70, 0.85, 0.5]]) { const G = pts => F(pts.map(p => add([x, y], rot(mul(p, s), a)))); P(f, G, ell([0, 0], 56, 50, 0, 18), '#c8bfa8', { dress: false }); for (const dx of [-20, 20]) f.part(G(ell([dx, -2], 14, 16, 0, 10)), { fill: '#1a120c', shade: 0.1, inkW: 1, cast: false }); f.part(G([[-6, 20], [6, 20], [0, 32]]), { fill: '#1a120c', shade: 0.1, inkW: 0.8, cast: false }); L(f, G, [[-24, 42], [24, 42]], 4, '#5a5040'); }
  for (let k = 0; k < 5; k++) L(f, F, [[-60 + k * 26, 150], [-80 + k * 26, 196]], 7, '#c8bfa8');   // ribs
  const heap = [[-340, -60], [-260, -170], [-160, -200], [-60, -150], [20, -60]]; P(f, F, heap, '#6a5038', { tex: T(f, 'mottle'), texOp: 1 });
  tube(f, F, [[-180, -150], [-120, -400]], 20, C.OAK); P(f, F, [[-220, -170], [-140, -150], [-150, -60], [-230, -80]], C.IRON, { dress: false });   // the spade
  return { focus: F([[0, 110]])[0], sig: SB(F, [-340, -410, 340, 280]), feat: [], ells: [] };
};
META.plaguepit = { act: 'burst', noTurn: true, only: ['close', 'floor'] };

O.blowfly = (f, o = {}) => { // a blowfly, drawn large: the metallic green-black body, red compound eyes, veined glassy wings held out, bristled legs on a scrap of rotten meat
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, GRN = '#2e4a3a';
  P(f, F, [[-260, 230], [-120, 170], [100, 180], [260, 230], [200, 290], [-200, 290]], '#5a1a12', { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, [[-140, 210], [120, 214]], 4, '#c8a090', { op: 0.5 });   // the meat
  for (const [a, b, c] of [[[-60, 20], [-160, 100], [-190, 200]], [[-20, 40], [-70, 140], [-90, 210]], [[20, 40], [70, 140], [90, 210]], [[60, 20], [160, 100], [190, 200]], [[-50, -10], [-190, -20], [-250, 60]], [[50, -10], [190, -20], [250, 60]]]) { L(f, F, [a, b, c], 9, INK); for (let k = 0; k < 3; k++) L(f, F, [lerp(b, c, 0.3 + k * 0.2), add(lerp(b, c, 0.3 + k * 0.2), [10, -14])], 1.6, INK); }
  for (const s of [-1, 1]) { const w = [[s * 30, -60], [s * 200, -230], [s * 330, -260], [s * 350, -200], [s * 230, -90], [s * 60, -20]]; f.part(F(w), { fill: '#b8c4c8', shade: 0.2, inkW: 1.6, cast: false, opacity: 0.6 }); grain(f, F, w, 0.35, 10, s * 0.7); for (const t of [0.3, 0.55, 0.8]) L(f, F, [[s * 40, -50], [s * 340 * t + s * 20, -240 * t + 10]], 1.4, '#3a4448', { op: 0.6 }); L(f, F, [[s * 120, -150], [s * 240, -100]], 1.2, '#3a4448', { op: 0.5 }); }
  const ab = ell([0, 60], 90, 120, 0, 24); P(f, F, ab, GRN, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, ab, 0.4, 9, 0.9, '#a8c8b0'); for (const y of [20, 70, 120]) L(f, F, ell([0, y], 86 - Math.abs(y - 60) * 0.3, 20, 0, 16).slice(0, 9), 2.4, '#0e1a14', { op: 0.7 }); L(f, F, [[-50, 0], [-60, 80]], 6, '#a8c8b0', { op: 0.5 });
  P(f, F, ell([0, -60], 80, 60, 0, 20), '#1e2a24', { dress: false }); for (let i = 0; i < 10; i++) L(f, F, [[-70 + i * 15, -100], [-74 + i * 15, -124]], 1.4, INK);   // thorax and bristles
  f.part(F(ell([0, -140], 70, 46, 0, 18)), { fill: '#1a1a18', shade: 0.3, inkW: 1.6, cast: false }); for (const s of [-1, 1]) { f.part(F(ell([s * 48, -150], 40, 44, 0, 16)), { fill: '#7a1a12', shade: 0.4, inkW: 1.4, cast: false, tex: T(f, 'weave'), texOp: 0.8 }); f.flat(F(ell([s * 40, -170], 10, 7, 0, 8)), '#f0c8b8', { op: 0.6 }); }
  return { focus: F([[0, -40]])[0], sig: SB(F, [-355, -265, 355, 290]), feat: [], ells: [] };
};
META.blowfly = { act: 'blow', noTurn: true, only: ['close', 'table', 'ledge', 'floor'] };

O.cordial = (f, o = {}) => { // a cordial glass: a small thick-stemmed glass with a knop and a wide foot, the little bowl full to the brim with a red cordial, a drop running down
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const bowl = turned([[150, -260], [140, -170], [100, -90], [40, -60]], 0.25); glass(f, F, bowl, { level: -230, liq: liqOf(o, '#7a1a12'), glass: '#a8b0a8', arcs: [[-200, -140], () => 130], hi: [[[-110, -220], [-90, -120]]], bubbles: 3 });
  oval(f, F, [0, -260], 150, 30, '#c8d0c8', { opacity: 0.8 }); oval(f, F, [0, -256], 132, 22, liqOf(o, '#7a1a12'), { shade: 0.3 });
  const stem = [[-34, -66], [34, -66], [26, 40], [60, 80], [26, 120], [30, 230], [-30, 230], [-26, 120], [-60, 80], [-26, 40]]; P(f, F, stem, '#b8c0b8', { tex: T(f, 'mottle'), texOp: 0.4, opacity: 0.9, dressO: { op: 0.2 } }); L(f, F, [[-12, -50], [-14, 200]], 5, '#f4f4ec', { op: 0.6 });
  for (let k = 0; k < 4; k++) f.flat(F(ell([0, -20 + k * 60], 6, 4, 0, 6)), '#f4f4ec', { op: 0.7 });   // air tears in the stem
  oval(f, F, [0, 236], 170, 34, '#a8b0a8', { opacity: 0.9 }); L(f, F, ell([0, 236], 160, 28, 0, 24).slice(13, 24), 3, '#f4f4ec', { op: 0.6 });
  D.wax(f, F([[110, -250], [120, -230]]), liqOf(o, '#7a1a12'), { thick: 6, drips: 1, dripL: 90 });
  return { focus: F([[0, -200]])[0], sig: SB(F, [-175, -295, 175, 272]), feat: ['contents'], ells: [30 / 150, 34 / 170] };
};
META.cordial = { act: 'pour', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

// ==== redraws of unused library objects (L56: the old crucible hung over loose coals, the old alembic's receiver stood apart)
O.crucible = (f, o = {}) => { // a clay crucible sunk in a bed of coals, glowing at the mouth with molten gold, slag on its three-cornered lip, the tongs resting on it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const bed = [[-330, 160], [-260, 90], [-120, 70], [120, 70], [260, 90], [330, 160], [300, 260], [-300, 260]]; P(f, F, bed, '#2a1a12', { tex: T(f, 'mottle'), texOp: 1 });
  for (let i = 0; i < 16; i++) { const x = -280 + (i % 8) * 80 + (i > 7 ? 40 : 0), y = i > 7 ? 200 : 120; f.part(F(ell([x, y], 40, 24, 0, 12)), { fill: i % 3 ? '#3a1e12' : '#a83a1a', shade: 0.35, inkW: 1.2, cast: false }); }
  const body = [[-170, -230], [170, -230], [130, 40], [80, 130], [-80, 130], [-130, 40]]; P(f, F, body, '#9a6a4a', { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, body, [-150, -80, -10, 60], y => 170 - (y + 230) * 0.25, 0.25, { op: 0.5 }); shadeR(f, F, body, 40, 160, -210, 110, 9, { op: 0.5 });
  for (let k = 0; k < 4; k++) L(f, F, [[-120 + k * 20, 0 + k * 26], [120 - k * 20, 0 + k * 26]], 3, '#c84a1a', { op: 0.6 });   // the glow through the clay
  oval(f, F, [0, -230], 170, 48, '#6a4a32'); oval(f, F, [0, -226], 146, 36, '#d8b050', { shade: 0.2 }); L(f, F, ell([-10, -228], 100, 22, 0, 20).slice(11, 19), 5, '#f8ecc0', { op: 0.8 });
  P(f, F, [[150, -250], [220, -290], [200, -230]], '#6a4a32', { dress: false }); D.wax(f, F([[-150, -220], [-130, -200]]), '#3a3a3a', { thick: 8, drips: 1, dripL: 40 });
  tube(f, F, [[60, -240], [260, -420]], 12, C.IRON); tube(f, F, [[100, -240], [300, -400]], 12, C.IRON);
  return { focus: F([[0, -200]])[0], sig: SB(F, [-330, -430, 330, 260]), feat: ['fire'], ells: [48 / 170, 36 / 146] };
};
META.crucible = { act: 'burn', noTurn: true, gold: true, only: ['close', 'floor', 'niche'] };

O.alembic = (f, o = {}) => { // an alembic on its brick furnace: the round cucurbit of brew, the beaked head on it, the long beak running down into a receiving flask that stands on the furnace step
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const fur = [[-260, 80], [60, 80], [60, 160], [300, 160], [300, 300], [-260, 300]]; P(f, F, fur, '#7a5444', { tex: T(f, 'mottle'), texOp: 1 }); for (const y of [130, 190, 250]) L(f, F, [[-260, y], [y < 160 ? 60 : 300, y]], 2.4, INK, { op: 0.6 });
  f.part(F(ell([-100, 220], 60, 40, 0, 14)), { fill: '#c84a1a', shade: 0.2, inkW: 1.4, cast: false });
  const cuc = []; for (let i = 0; i <= 28; i++) { const t = Math.PI * 2 * i / 28; cuc.push([-100 + Math.cos(t) * 150, -30 + Math.sin(t) * 130]); }
  glass(f, F, cuc, { level: 0, liq: liqOf(o, '#6a4a2a'), glass: '#9aa89a', arcs: [[-80, -20, 40], () => 140], hi: [[[-200, -90], [-210, 10]]], bubbles: 5 });
  const head = [[-150, -150], [-150, -230], [-100, -280], [-50, -230], [-50, -150]]; glass(f, F, head, { glass: '#a8b4a8', bubbles: 0 });
  const beak = [[-60, -250], [40, -230], [180, -60], [200, 40], [176, 44], [150, -40], [30, -200], [-60, -210]]; P(f, F, beak, '#a8b4a8', { opacity: 0.94, dressO: { op: 0.25 } });
  const rec = turned([[24, -100], [26, -70], [70, -20], [76, 40], [60, 70]], 0.22).map(p => add(p, [210, 90])); glass(f, F, rec, { level: 100, liq: liqOf(o, '#6a4a2a'), glass: '#9aa89a', bubbles: 2 });
  K.fxReq(f, 'drip', F([[195, 44]])[0], 3, { col: liqOf(o, '#6a4a2a') });
  return { focus: F([[-100, -40]])[0], sig: SB(F, [-260, -290, 300, 300]), feat: ['contents', 'fire'], ells: [] };
};
META.alembic = { act: 'drip', noTurn: true, only: ['close', 'floor', 'table', 'niche'] };

O.coalpan = (f, o = {}) => { // superheat: a shallow iron pan heaped with coals blown white-hot at the heart, on a long handle wrapped in scorched cloth, the iron rim glowing (redraw: the old pan read flat, L3)
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r;
  tube(f, F, [[200, 0], [460, -80]], 20, C.IRON); const wrap = [[330, -66], [450, -100], [466, -60], [346, -26]]; P(f, F, wrap, '#5a4a3a', { tex: T(f, 'weave'), texOp: 1 }); for (let k = 0; k < 6; k++) L(f, F, [[340 + k * 20, -70 - k * 6], [350 + k * 20, -30 - k * 6]], 2.4, '#1a120c', { op: 0.7 });
  const pan = [[-290, -20], [-260, 70], [-150, 120], [150, 120], [260, 70], [290, -20]]; P(f, F, pan, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, pan, 0.45, 8, 0.4, '#c8c8c4'); shadeR(f, F, pan, 60, 280, -10, 110, 10, { op: 0.5 });
  oval(f, F, [0, -20], 290, 70, '#4a3a30');
  for (let i = 0; i < 18; i++) { const a = (i * 2.4) % 6.28, rr = 40 + (i * 37) % 200, c = [Math.cos(a) * rr * 1.1, -40 + Math.sin(a) * rr * 0.28 - (200 - rr) * 0.25]; f.part(F(ell(c, 46 - rr * 0.08, 30 - rr * 0.05, a, 12)), { fill: rr < 90 ? '#f0dcb0' : rr < 150 ? '#c86a2a' : '#3a1e12', shade: 0.35, inkW: 1.2, cast: false }); }
  L(f, F, ell([0, -20], 286, 66, 0, 30).slice(0, 15), 6, '#c86a2a', { op: 0.6 });
  K.fxReq(f, 'steam', F([[0, -90]])[0], 90, { col: '#8a8078' });
  return { focus: F([[0, -50]])[0], sig: SB(F, [-295, -130, 470, 125]), grip: { c: F([[400, -66]])[0], thumb: (o.ang ?? -0.15) }, feat: ['fire'], ells: [70 / 290] };
};
META.coalpan = { act: 'burn', ang: -0.15 };

O.casebottle = (f, o = {}) => { // fen water: a square green case bottle full of murky marsh water, duckweed floating at the top, a strand of weed and a tadpole inside, a rag stopper
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const body = [[-130, -170], [-90, -210], [-50, -230], [-46, -300], [46, -300], [50, -230], [90, -210], [130, -170], [140, 250], [-140, 250]];
  glass(f, F, body, { level: -150, liq: '#4a5a3a', glass: '#7a9a6a', hi: [[[-110, -140], [-116, 220]]], shade: [60, 130, -150, 240], bubbles: 6 });
  for (let i = 0; i < 9; i++) f.part(F(ell([-110 + i * 27, -146 + (i % 2) * 6], 14, 6, 0, 8)), { fill: '#7a9a3a', shade: 0.3, inkW: 0.8, cast: false });
  L(f, F, [[-60, 240], [-80, 120], [-40, 20], [-70, -80]], 5, '#3a4a1e', { op: 0.9 }); f.part(F(ell([50, 80], 18, 13, 0.4, 10)), { fill: '#1a1a12', shade: 0.2, inkW: 0.8, cast: false }); L(f, F, [[64, 88], [100, 110], [118, 100]], 3, '#1a1a12');
  for (const x of [-140, 140]) L(f, F, [[x, -170], [x, 250]], 6, '#3a4a30', { op: 0.6 });
  P(f, F, [[-50, -300], [50, -300], [60, -350], [20, -380], [-30, -370], [-60, -340]], '#8a7a5a', { tex: T(f, 'weave'), texOp: 1 }); L(f, F, [[-54, -310], [56, -310]], 8, C.TWINE);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-145, -385, 145, 255]), feat: ['contents'], ells: [] };
};
META.casebottle = { act: 'drip', noTurn: true, only: ['close', 'table', 'ledge', 'niche', 'floor'] };

module.exports = { O, META };
