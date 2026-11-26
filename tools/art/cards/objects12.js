// The card object library, part twelve: the one-object-per-card pass for the Vessel (L72). The matching testers split
// the names of twin cards (one object, two names) by coin flip, so every Vessel object card now has an object of its
// own, drawn to its proposed name (docs/design/names/renames.csv, picture column): the paten for Communion, a curfew
// over banked coals, a firedog, a straw skep of honey, marked palms, a hyssop sprig, Pentecost's tongues of flame, a
// pulpit, the triple oil stock of Last Rites, a set of pan pipes, a cradle. Also the redraws the blind testers asked for:
// the ewer (read as a cloth bag on a cord), the pitch torch (no flame showed) and the quill (the feather did not read).
// Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const O = {}, META = {};
const FLAME = ['#f0dcb0', '#c86a2a', '#7a2a14'];   // the core kept pale: a saturated yellow counts as gold (L14)

// a solid flame (three nested tongues, dark to light), drawn as part of the object so it shows in every course and at
// every layout (a fxReq flame is a dry-brush wisp and vanished on the Vessel's torch at thumbnail size)
function flame(f, F, base, h, w, lean = 0) {
  const tongue = (k, hh, ww) => { const q = []; for (let i = 0; i <= 12; i++) { const t = i / 12, y = -hh * t, wv = ww * Math.sin(Math.PI * Math.pow(t, 0.7)) * (1 - t * 0.35); q.push([wv + lean * t * t * hh, y]); } for (let i = 12; i >= 0; i--) { const t = i / 12, y = -hh * t, wv = ww * Math.sin(Math.PI * Math.pow(t, 0.7)) * (1 - t * 0.35); q.push([-wv * 0.9 + lean * t * t * hh + Math.sin(t * 9 + k) * ww * 0.08, y]); } return q.map(p => add(base, p)); };
  f.part(F(tongue(0, h, w)), { fill: FLAME[2], shade: 0.15, inkW: 1.8, cast: false });
  f.part(F(tongue(1, h * 0.78, w * 0.7)), { fill: FLAME[1], shade: 0.1, inkW: 1.2, cast: false });
  f.part(F(tongue(2, h * 0.5, w * 0.38)), { fill: FLAME[0], shade: 0.05, inkW: 1, cast: false });
}
// a plain open hand, palm up toward the viewer: the palm, four fingers and a thumb, a crease line (used by the marked palms)
function hand(f, F, c, a, s, skin, side = 1) {
  const G = pts => F(pts.map(p => add(c, rot(mul([p[0] * side, p[1]], s), a))));
  const palm = [[-70, 60], [-80, -40], [-60, -90], [60, -96], [80, -40], [74, 70], [30, 120], [-30, 120]];
  P(f, G, palm, skin, { tex: T(f, 'mottle'), texOp: 0.6, dressO: { op: 0.25 } });
  [[-52, -96, -66, -230], [-16, -100, -18, -270], [22, -100, 30, -262], [58, -92, 78, -212]].forEach(([x0, y0, x1, y1]) => f.part(G(limb([x0, y0], [x1, y1], 34, 26, { capK: 0.5 })), { fill: skin, shade: 0.4, inkW: 1.6 }));
  f.part(G(limb([-74, 10], [-160, -80], 40, 30, { capK: 0.5 })), { fill: skin, shade: 0.4, inkW: 1.6 });
  f.line(G([[-50, 0], [0, 20], [60, 0]]), 1.6, '#5a3a2a', { op: 0.6 }); f.line(G([[-40, 60], [10, 40], [50, 70]]), 1.4, '#5a3a2a', { op: 0.5 });
  return G;
}

// ==== the Vessel
O.paten = (f, o = {}) => { // Communion: a gilt paten on a folded linen corporal, the round host laid on it, a cross pressed into the bread
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const cl = [[-300, -40], [290, -70], [330, 230], [-290, 260]]; P(f, F, cl, C.LINEN, { tex: T(f, 'weave'), texOp: 0.8 }); for (const x of [-110, 100]) L(f, F, [[x, -50], [x + 14, 250]], 2, '#a89c84', { op: 0.6 });   // the corporal, folded
  L(f, F, [[-230, 200], [-180, 200]], 2.4, '#7a2418', { op: 0.7 }); L(f, F, [[-205, 180], [-205, 222]], 2.4, '#7a2418', { op: 0.7 });
  const rim = ell([0, 40], 250, 170, 0, 40); f.part(F(rim.map(p => add(p, [0, 22]))), { fill: '#5a4a2c', shade: 0.3, inkW: 2, cast: false }); P(f, F, rim, C.GILT, { tex: T(f, 'mottle'), texOp: 0.7 });
  oval(f, F, [0, 44], 196, 130, '#8a7444', { shade: 0.45, tex: T(f, 'mottle'), texOp: 0.6 }); arcs(f, F, ell([0, 44], 196, 130, 0, 30), [-20, 40, 100], () => 180, 0.5, { op: 0.4 });
  L(f, F, ell([0, 40], 244, 164, 0, 40).slice(22, 37), 5, C.GILTL, { op: 0.7 });
  const host = ell([10, 20], 140, 96, 0, 32); f.part(F(host.map(p => add(p, [0, 12]))), { fill: '#8a7a5c', shade: 0.3, inkW: 1.4, cast: false }); P(f, F, host, '#ece2c8', { tex: T(f, 'mottle'), texOp: 0.5, dressO: { op: 0.2 } });
  L(f, F, [[10, -50], [10, 90]], 6, '#b8a880'); L(f, F, [[-80, 20], [100, 20]], 6, '#b8a880'); L(f, F, loop(ell([10, 20], 120, 80, 0, 28)), 1.6, '#b8a880', { op: 0.7 });
  f.scratches(F([[-150, 70]])[0], 40, 6, '#f8f0d8'); D.chip(f, F([[220, 70]])[0], 8, 0);
  return { focus: F([[10, 20]])[0], sig: SB(F, [-310, -140, 335, 265]), feat: [], ells: [170 / 250, 130 / 196, 96 / 140] };
};
META.paten = { act: 'glare', noTurn: true, gold: true, only: ['close', 'table', 'ledge', 'niche'] };

O.firecover = (f, o = {}) => { // a curfew: the bronze fire cover set over the banked coals for the night, a half dome open at the back, a looped handle, the coals still red at its foot
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-340, 230], [340, 230], [320, 290], [-320, 290]], C.STONE, { tex: T(f, 'mottle'), texOp: 1, sharp: true });   // the hearthstone
  for (let i = 0; i < 9; i++) { const x = -260 + i * 64; f.part(F(ell([x, 222 - (i % 2) * 8], 34, 20, 0, 12)), { fill: i % 3 ? '#3a1a10' : '#a83a1a', shade: 0.3, inkW: 1.2, cast: false }); }   // coals peeping out
  const dome = [[-290, 230]]; for (let i = 0; i <= 16; i++) { const t = Math.PI * i / 16; dome.push([-290 * Math.cos(t), 230 - 330 * Math.sin(t)]); } dome.push([290, 230]);
  P(f, F, dome, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, dome, [0, 60, 120, 180], y => 290 - Math.max(0, (y - 230)) * 0, 0.18, { op: 0.45 }); shadeR(f, F, dome, 80, 280, -60, 220, 10, { op: 0.5 });
  for (const y of [40, 140]) L(f, F, [[-270 + (230 - y) * 0.02, y], [-140, y - 40], [0, y - 50], [140, y - 40], [270, y]], 6, '#4a3e2a', { op: 0.6 });   // hammered ribs
  for (let i = 0; i < 7; i++) { const a = Math.PI * (i + 1) / 8; f.rivet(F([[-250 * Math.cos(a), 220 - 280 * Math.sin(a)]])[0], 6, '#c8b07a'); }
  tube(f, F, [[-70, -96], [-80, -170], [0, -200], [80, -170], [70, -96]], 18, C.IRON);   // the handle
  L(f, F, [[-230, 120], [-200, -20], [-110, -70]], 8, '#f0e0b8', { op: 0.5 }); D.bloom(f, F([[120, 120]])[0], 26, C.VERD, { n: 3 }); D.chip(f, F([[260, 200]])[0], 10, 0);
  f.part(F([[-290, 230], [-320, 240], [-300, 252]]), { fill: '#c84a1a', shade: 0.2, inkW: 1, cast: false });
  return { focus: F([[0, 60]])[0], sig: SB(F, [-340, -210, 340, 290]), feat: ['fire'], ells: [] };
};
META.firecover = { act: 'burn', noTurn: true, only: ['close', 'floor', 'niche'] };

O.firedog = (f, o = {}) => { // a wrought-iron firedog at the fireside: an upright with a ring finial and splayed feet, a split log across it burning with a low flame
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-340, 250], [340, 250], [330, 300], [-330, 300]], C.STONE, { tex: T(f, 'mottle'), texOp: 1, sharp: true });
  const up = [[-150, 250], [-110, 120], [-130, -150], [-110, -200], [-90, -150], [-60, 120], [-30, 250]]; P(f, F, up, C.IRON, { tex: T(f, 'mottle'), texOp: 1 });   // the upright on its feet
  ring(f, F, [-110, -240], 46, 46, 12, C.IRON); f.part(F(ell([-110, -186], 22, 18, 0, 12)), { fill: C.IRONL, shade: 0.4, inkW: 1.4, cast: false });
  tube(f, F, [[-100, 150], [300, 170]], 20, C.IRON);   // the billet bar
  const log = [[-260, 60], [280, 30], [320, 70], [310, 130], [-250, 160], [-290, 110]]; P(f, F, log, C.OAK, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, log, 0.35, 10, 0.05);
  oval(f, F, [-270, 110], 30, 50, C.OAKL); for (let k = 1; k < 4; k++) ring(f, F, [-270, 110], 30 * k / 4, 50 * k / 4, 1, '#3a2a1a');
  for (const [x, h, w] of [[-120, 170, 52], [10, 230, 62], [140, 190, 54], [250, 130, 40]]) flame(f, F, [x, 50], h, w, (x % 3) * 0.1);
  for (let i = 0; i < 6; i++) f.part(F(ell([-200 + i * 80, 236], 30, 14, 0, 10)), { fill: i % 2 ? '#3a1a10' : '#9a3a1a', shade: 0.3, inkW: 1, cast: false });
  D.bloom(f, F([[-100, 0]])[0], 18, C.RUST, { n: 3 }); D.chip(f, F([[200, 150]])[0], 9, 0);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-340, -290, 330, 300]), feat: ['fire'], ells: [] };
};
META.firedog = { act: 'burn', noTurn: true, only: ['close', 'floor', 'niche'] };

O.skep = (f, o = {}) => { // a straw bee skep on its board: coiled straw rings bound with bramble, the dark entrance, honey welling from under the rim, two bees
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, STRAW = '#a8946a';
  P(f, F, [[-320, 220], [320, 220], [300, 280], [-300, 280]], C.OAKL, { tex: T(f, 'wood'), texOp: 1, sharp: true });
  const prof = []; for (let i = 0; i <= 14; i++) { const t = i / 14; prof.push([260 * Math.sin(Math.PI / 2 * Math.pow(t, 0.8)) + 10, -300 + 520 * t]); }
  const body = turned(prof, 0.18); P(f, F, body, STRAW, { tex: T(f, 'weave'), texOp: 0.9 });
  for (let k = 1; k < 11; k++) { const y = -300 + k * 48, w = 260 * Math.sin(Math.PI / 2 * Math.pow((y + 300) / 520, 0.8)) + 6; L(f, F, ell([0, y], w, w * 0.18, 0, 24).slice(0, 13), 4, '#6a5020', { op: 0.75 }); for (let j = 0; j < 7; j++) { const x = -w * 0.86 + j * w * 0.29; L(f, F, [[x, y - 8], [x + 10, y + 8]], 2.4, '#5a3a18', { op: 0.6 }); } }
  shadeR(f, F, body, 60, 250, -200, 210, 10, { op: 0.45 });
  f.part(F(ell([0, 196], 52, 26, 0, 16)), { fill: '#120c08', shade: 0.1, inkW: 1.8, cast: false });   // the entrance
  D.wax(f, F([[100, 214], [150, 210], [200, 206]]), '#c8902a', { thick: 10, drips: 2, dripL: 60 }); f.part(F(ell([160, 248], 60, 16, 0, 14)), { fill: '#c8902a', shade: 0.3, inkW: 1.2, cast: false });
  for (const [x, y, a] of [[-200, -120, 0.3], [180, -60, -0.4]]) { const G = pts => F(pts.map(p => add([x, y], rot(p, a)))); f.part(G(ell([0, 0], 22, 13, 0, 12)), { fill: '#3a2a10', shade: 0.3, inkW: 1.2, cast: false }); for (const dx of [-6, 6]) L(f, G, [[dx, -12], [dx, 12]], 3, '#c8a040'); for (const s of [-1, 1]) f.part(G(ell([0, s * 18], 16, 9, 0.4 * s, 10)), { fill: '#d8dce0', shade: 0.2, inkW: 1, cast: false, op: 0.85 }); }
  L(f, F, [[-200, -220], [-240, -60], [-220, 100]], 9, '#f0dca0', { op: 0.45 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-320, -310, 320, 280]), feat: [], ells: [0.18] };
};
META.skep = { act: 'drip', noTurn: true, only: ['close', 'floor', 'table', 'ledge'] };

O.stigmata = (f, o = {}) => { // Stigmata: two open palms raised side by side, each pierced through the middle with a red wound, a thin line of blood to the wrist
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, skin = '#c8a07c';
  for (const s of [-1, 1]) { const G = hand(f, F, [s * 150, 60], s * 0.12, 0.95, skin, s); f.part(G(ell([0, 10], 22, 26, 0, 14)), { fill: C.BLOOD, shade: 0.2, inkW: 1.4, cast: false }); f.part(G(ell([0, 10], 9, 12, 0, 10)), { fill: '#1a0604', shade: 0.1, inkW: 0.8, cast: false }); L(f, G, [[4, 34], [10, 90], [4, 140]], 5, C.BLOOD, { op: 0.9 });
    f.part(G([[-66, 110], [70, 110], [62, 230], [-58, 230]]), { fill: '#d8ccb0', shade: 0.4, inkW: 1.6, tex: T(f, 'weave'), texOp: 0.5 }); }   // the sleeves
  return { focus: F([[0, 60]])[0], sig: SB(F, [-320, -230, 320, 290]), feat: [], ells: [] };
};
META.stigmata = { act: 'drip', noTurn: true, only: ['close', 'niche', 'ledge'] };

O.hyssop = (f, o = {}) => { // a hyssop sprig used to sprinkle: woody stems bound with red thread, narrow paired leaves and blue flower spikes, water flicking from the tips
  const F = frame([0, 0], o.ang ?? -0.4, 1), r = f.r;
  const stems = [[[0, 330], [-10, 100], [-60, -150], [-110, -330]], [[4, 330], [10, 80], [30, -170], [60, -340]], [[2, 330], [0, 120], [-10, -120], [-20, -300]]];
  for (const s of stems) { L(f, F, s, 12, INK); L(f, F, s, 7, '#6a5a34'); }
  stems.forEach((s, j) => { const c = K.catmull(s, 6); for (let i = 8; i < c.length - 2; i += 2) { const p = c[i], d = norm(sub(c[i + 1], c[i - 1])), n = [-d[1], d[0]]; for (const side of [-1, 1]) { const tip = add(p, add(mul(n, side * 52), mul(d, -18))); f.part(F([p, add(lerp(p, tip, 0.5), mul(d, -10)), tip, add(lerp(p, tip, 0.5), mul(d, 8))]), { fill: (i + j) % 3 ? '#4a6a34' : '#5a7a3e', shade: 0.35, inkW: 1.1, cast: false }); } }
    const tip = c[c.length - 1], d = norm(sub(c[c.length - 1], c[c.length - 4])); for (let k = 0; k < 6; k++) f.part(F(ell(add(tip, mul(d, -k * 20)), 13 - k, 9, Math.atan2(d[1], d[0]), 8)), { fill: k % 2 ? '#4a5a6a' : '#5a6a7a', shade: 0.3, inkW: 1, cast: false }); });
  L(f, F, [[-30, 200], [34, 196]], 14, INK); L(f, F, [[-26, 200], [30, 196]], 9, C.TWINE); L(f, F, [[-26, 230], [30, 226]], 9, C.TWINE);
  K.fxReq(f, 'drip', F([[-110, -340]])[0], 3, { col: '#5a7a9a' });
  return { focus: F([[0, -140]])[0], sig: SB(F, [-180, -410, 160, 340]), grip: { c: F([[0, 280]])[0], thumb: (o.ang ?? -0.4) - Math.PI / 2 }, feat: [], ells: [] };
};
META.hyssop = { act: 'fling', ang: -0.4 };

O.pentecost = (f, o = {}) => { // Pentecost: the white dove descending, wings spread, and below it seven tongues of flame standing in the air in a row
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, W = '#e8e4da';
  const glory = [[-30, -120], [30, -120], [300, 170], [-300, 170]]; P(f, F, glory, '#a8946a', { tex: T(f, 'mottle'), texOp: 0.6, dress: false, opacity: 0.9 }); for (let i = 0; i < 9; i++) L(f, F, [[-20 + i * 5, -110], [-290 + i * 72, 165]], 3, '#e8dcb8', { op: 0.6 });   // the glory poured down from the dove
  for (const s of [-1, 1]) { const wing = [[s * 30, -230], [s * 120, -330], [s * 240, -360], [s * 330, -330], [s * 280, -290], [s * 300, -260], [s * 230, -240], [s * 240, -210], [s * 150, -200], [s * 60, -170]]; P(f, F, wing, W, { tex: T(f, 'mottle'), texOp: 0.5, dressO: { op: 0.25 } }); for (let k = 0; k < 6; k++) L(f, F, [[s * (70 + k * 40), -200 - k * 6], [s * (110 + k * 40), -300 - k * 6]], 2, '#9a968c', { op: 0.7 }); }
  P(f, F, [[-50, -250], [0, -290], [50, -250], [40, -130], [0, -90], [-40, -130]], W, { dressO: { op: 0.25 } });   // the body, head down
  P(f, F, [[-34, -110], [34, -110], [20, -60], [0, -40], [-20, -60]], W, { dress: false }); f.part(F([[-8, -48], [8, -48], [0, -26]]), { fill: '#c88a4a', shade: 0.3, inkW: 1, cast: false }); for (const x of [-16, 16]) f.part(F(ell([x, -70], 5, 5, 0, 6)), { fill: '#1a1210', shade: 0.1, inkW: 0.6, cast: false });
  P(f, F, [[-40, -290], [0, -350], [40, -290]], W, { dress: false });   // the fanned tail
  for (let i = 0; i < 7; i++) { const x = -270 + i * 90, y = 200 + Math.abs(i - 3) * 6; flame(f, F, [x, y], 150 - Math.abs(i - 3) * 14, 36, (i - 3) * 0.06); }
  return { focus: F([[0, 120]])[0], sig: SB(F, [-330, -360, 330, 250]), feat: ['fire'], ells: [] };
};
META.pentecost = { act: 'burn', noTurn: true, gold: true, only: ['close', 'niche', 'ledge'] };

O.pulpit = (f, o = {}) => { // a carved oak pulpit: a six-sided tub on a stem with linenfold panels, a sounding board above, a great book open on the desk
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-60, 120], [60, 120], [70, 300], [110, 330], [-110, 330], [-70, 300]], C.OAK, { tex: T(f, 'wood'), texOp: 1 });   // the stem and foot
  const tub = [[-240, -120], [240, -120], [210, 130], [-210, 130]]; P(f, F, tub, C.OAKL, { tex: T(f, 'wood'), texOp: 1 });
  for (const x of [-150, -50, 50, 150]) { const pn = [[x - 40, -90], [x + 40, -90], [x + 36, 100], [x - 36, 100]]; f.part(F(pn), { fill: C.OAK, shade: 0.5, inkW: 1.6, cast: false }); for (const dx of [-16, 0, 16]) L(f, F, [[x + dx, -80], [x + dx * 0.9, 90]], 2.4, '#2a1a10', { op: 0.6 }); }   // linenfold
  P(f, F, [[-270, -150], [270, -150], [250, -120], [-250, -120]], C.OAK, { sharp: true });   // the rail
  const bk = [[-140, -150], [0, -190], [140, -150], [140, -170], [0, -214], [-140, -170]]; P(f, F, [[-160, -150], [160, -150], [130, -230], [-130, -230]], '#4a2e1c', { dress: false });
  P(f, F, [[-150, -236], [0, -262], [150, -236], [150, -250], [0, -282], [-150, -250]], C.VELLUM, { tex: T(f, 'mottle'), texOp: 0.6, dress: false }); for (let k = 0; k < 4; k++) { L(f, F, [[-130, -246 + k * 0 - k * 4], [-20, -270 - k * 4]], 1.4, '#5a4a30', { op: 0.6 }); L(f, F, [[20, -270 - k * 4], [130, -246 - k * 4]], 1.4, '#5a4a30', { op: 0.6 }); }
  tube(f, F, [[220, -120], [220, -330]], 16, C.OAK); const sb = [[-280, -330], [300, -330], [260, -370], [-240, -370]]; P(f, F, sb, C.OAK, { tex: T(f, 'wood'), texOp: 1, sharp: true });   // the sounding board on its post
  f.part(F([[-20, -400], [20, -400], [10, -370], [-10, -370]]), { fill: C.GILT, shade: 0.3, inkW: 1.2, cast: false }); L(f, F, [[0, -440], [0, -396]], 6, C.GILT); L(f, F, [[-18, -424], [18, -424]], 6, C.GILT);
  grain(f, F, tub, 0.25, 11, 1.57); D.chip(f, F([[200, 100]])[0], 9, 0); D.crack(f, F([[-180, 60]])[0], 1.5, 80, { n: 4 });
  return { focus: F([[0, -100]])[0], sig: SB(F, [-280, -445, 300, 330]), feat: [], ells: [] };
};
META.pulpit = { act: 'ring', noTurn: true, only: ['close', 'floor', 'niche'] };

O.oilstock = (f, o = {}) => { // Last Rites: the triple silver oil stock, three capped cylinders joined side by side, lettered O.I., S.C., O.S., one cap off with a wad of cotton wet with oil
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r, SIL = '#a8aaa8';
  ['O.I.', 'S.C.', 'O.S.'].forEach((lab, i) => { const x = -170 + i * 170, open = i === 2;
    const body = [[x - 74, -120], [x + 74, -120], [x + 74, 200], [x - 74, 200]]; P(f, F, body, SIL, { tex: T(f, 'mottle'), texOp: 0.7 }); shadeR(f, F, body, x + 20, x + 70, -110, 190, 6, { op: 0.45 }); L(f, F, [[x - 52, -100], [x - 52, 186]], 7, '#f4f4f0', { op: 0.55 });
    oval(f, F, [x, 200], 74, 18, '#6a6c6a');
    for (const y of [-60, 140]) L(f, F, [[x - 74, y], [x + 74, y]], 3, INK, { op: 0.6 });
    L(f, F, [[x - 36, 40], [x + 36, 40]], 1, INK, { op: 0 }); f.part(F([[x - 40, 20], [x + 40, 20], [x + 40, 64], [x - 40, 64]]), { fill: '#d8d8d2', shade: 0.2, inkW: 1, cast: false }); for (let k = 0; k < 3; k++) L(f, F, [[x - 26 + k * 22, 30], [x - 18 + k * 22, 54]], 4, '#3a3a3a');
    if (!open) { const cap = [[x - 80, -200], [x + 80, -200], [x + 80, -120], [x - 80, -120]]; P(f, F, cap, '#8a8c8a', { sharp: true }); for (let k = 0; k < 6; k++) L(f, F, [[x - 70 + k * 28, -194], [x - 70 + k * 28, -126]], 2, INK, { op: 0.5 }); oval(f, F, [x, -200], 80, 18, '#b8bab8'); f.part(F([[x - 12, -230], [x + 12, -230], [x + 8, -200], [x - 8, -200]]), { fill: '#b8bab8', shade: 0.3, inkW: 1.2, cast: false }); L(f, F, [[x, -270], [x, -228]], 5, C.GILT); L(f, F, [[x - 16, -254], [x + 16, -254]], 5, C.GILT); }
    else { oval(f, F, [x, -120], 74, 18, '#2a2620'); f.part(F(ell([x, -136], 50, 30, 0, 14)), { fill: '#e8dcb0', shade: 0.3, inkW: 1.4, cast: false, tex: T(f, 'weave'), texOp: 0.6 }); f.part(F(ell([x + 10, -142], 22, 10, 0, 10)), { fill: '#c8a040', shade: 0.2, inkW: 0.8, cast: false });
      const cap = [[x + 100, 150], [x + 250, 170], [x + 240, 250], [x + 90, 230]]; P(f, F, cap, '#8a8c8a', { sharp: true }); oval(f, F, [x + 170, 160], 76, 16, '#b8bab8', { a: 0.13 }); } });
  L(f, F, [[-244, -40], [174, -40]], 10, INK); L(f, F, [[-244, -40], [174, -40]], 5, C.GILT);
  f.scratches(F([[-100, 100]])[0], 40, 8, '#f8f8f4'); D.bloom(f, F([[160, 160]])[0], 14, '#4a4c48', { n: 2, op: 0.5 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-250, -275, 400, 255]), feat: [], ells: [18 / 74] };
};
META.oilstock = { act: 'drip', noTurn: true, gold: true, only: ['close', 'table', 'ledge', 'niche'] };

O.panpipes = (f, o = {}) => { // a shepherd's pan pipe: six cane reeds of falling length bound across with two wraps of cord, a breath of steam at the longest mouth
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r, CANE = '#b89a5a';
  for (let i = 0; i < 6; i++) { const x = -230 + i * 92, h = 520 - i * 64, top = -260, bot = top + h, w = 38;
    const reed = [[x - w, top], [x + w, top], [x + w, bot], [x - w, bot + 10]]; P(f, F, reed, mix(CANE, '#6a5228', (i % 2) * 0.2), { tex: T(f, 'wood'), texOp: 0.8, dressO: { op: 0.3 } });
    oval(f, F, [x, top], w, 12, '#1a120a', { shade: 0.1 }); L(f, F, [[x - w + 8, top + 16], [x - w + 8, bot - 8]], 5, '#f0e0b0', { op: 0.5 }); L(f, F, [[x + w - 8, top + 20], [x + w - 8, bot - 8]], 6, '#3a2a10', { op: 0.35 });
    for (const ny of [top + 140, top + 320]) if (ny < bot - 20) L(f, F, [[x - w, ny], [x + w, ny + 4]], 3, '#5a4220', { op: 0.8 }); }
  for (const y of [-180, 0]) { L(f, F, [[-280, y], [280, y + 14]], 22, INK); L(f, F, [[-280, y], [280, y + 14]], 15, '#6a3a1a'); for (let k = 0; k < 14; k++) L(f, F, [[-270 + k * 40, y - 6], [-262 + k * 40, y + 10]], 2, '#2a1408', { op: 0.6 }); }
  K.fxReq(f, 'steam', F([[-230, -290]])[0], 70, { col: '#c8c4b8' });
  D.chip(f, F([[-50, 150]])[0], 8, 0); D.stain(f, F([[60, -100]])[0], 30, '#5a4220', { op: 0.3 });
  return { focus: F([[-60, -60]])[0], sig: SB(F, [-280, -275, 280, 270]), grip: { c: F([[160, 40]])[0], thumb: (o.ang ?? -0.2) }, feat: [], ells: [] };
};
META.panpipes = { act: 'blow', ang: -0.2 };

O.cradle = (f, o = {}) => { // the Mother's place: an oak rocking cradle with a hooded head, a white swaddled child asleep in it under a red coverlet, the rockers on the floor
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const rock = [[-330, 210], [-180, 270], [0, 286], [180, 270], [330, 210], [330, 240], [180, 300], [0, 316], [-180, 300], [-330, 240]]; P(f, F, rock, C.OAK, { tex: T(f, 'wood'), texOp: 1 });
  const box = [[-280, -40], [260, -40], [240, 230], [-260, 230]]; P(f, F, box, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, box, 0.28, 11, 0.02);
  for (const x of [-180, -60, 60, 180]) f.part(F([[x - 40, 10], [x + 40, 10], [x + 36, 190], [x - 36, 190]]), { fill: C.OAK, shade: 0.5, inkW: 1.4, cast: false });
  const hood = [[-300, -40], [-300, -250], [-240, -300], [-80, -300], [-60, -40]]; P(f, F, hood, C.OAK, { tex: T(f, 'wood'), texOp: 1 }); f.part(F([[-260, -60], [-260, -240], [-220, -270], [-100, -270], [-90, -60]]), { fill: '#1a120c', shade: 0.1, inkW: 1.6, cast: false });
  P(f, F, [[-220, -60], [-100, -96], [180, -80], [240, -40], [-240, -30]], '#4a5a7a', { tex: T(f, 'weave'), texOp: 0.8 });   // the coverlet
  P(f, F, ell([-170, -110], 66, 58, 0, 20), '#e8dcc8', { tex: T(f, 'weave'), texOp: 0.6, dressO: { op: 0.2 } }); f.part(F(ell([-160, -104], 38, 34, 0, 16)), { fill: '#d8b090', shade: 0.35, inkW: 1.2, cast: false }); L(f, F, [[-178, -108], [-166, -104]], 2, INK); L(f, F, [[-152, -108], [-140, -104]], 2, INK);
  ring(f, F, [-170, -220], 70, 20, 4, C.GILT);   // a thin nimbus over the hood
  for (const x of [-280, 260]) f.part(F(ell([x, -50], 18, 18, 0, 10)), { fill: C.OAKL, shade: 0.4, inkW: 1.4, cast: false });
  D.chip(f, F([[200, 200]])[0], 9, 0); D.crack(f, F([[100, 100]])[0], 1.4, 70, { n: 4 });
  return { focus: F([[-120, -80]])[0], sig: SB(F, [-330, -305, 330, 316]), feat: [], ells: [] };
};
META.cradle = { act: 'glare', noTurn: true, only: ['close', 'floor', 'niche'] };

O.steelyard = (f, o = {}) => { // the weighing: a steelyard hung from its hook, the long notched beam level, a pan on chains at the short end and the pear-shaped poise slid out along the long arm
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  tube(f, F, [[-120, -360], [-120, -200]], 12, C.IRON); ring(f, F, [-120, -230], 26, 26, 12, C.IRON);
  const beam = [[-300, -214], [330, -200], [330, -180], [-300, -186]]; P(f, F, beam, C.IRON, { dress: false }); for (let k = 0; k < 14; k++) L(f, F, [[-60 + k * 27, -206], [-60 + k * 27, -192]], 2, '#d8d8d0', { op: 0.8 });
  f.part(F(ell([-300, -200], 22, 22, 0, 10)), { fill: C.IRON, shade: 0.4, inkW: 1.4, cast: false });
  for (const dx of [-90, 0, 90]) tube(f, F, [[-260, -190], [-260 + dx, 150]], 6, '#6a6a66', { lit: false });
  const pan = [[-400, 150], [-120, 150], [-150, 210], [-260, 236], [-370, 210]]; P(f, F, pan, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); oval(f, F, [-260, 150], 140, 26, '#8a7a50');
  for (const [x, y] of [[-300, 130], [-230, 126], [-262, 108]]) f.part(F(ell([x, y], 30, 20, 0, 10)), { fill: C.GILT, shade: 0.35, inkW: 1.2, cast: false });
  tube(f, F, [[200, -186], [200, -100]], 10, C.IRON); const poise = [[200, -110], [240, -60], [250, 30], [200, 70], [150, 30], [160, -60]]; P(f, F, poise, '#5a5c60', { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, [[178, -60], [170, 20]], 5, '#e8e8e0', { op: 0.5 });
  D.bloom(f, F([[-200, 200]])[0], 20, C.VERD, { n: 3 });
  return { focus: F([[-120, -190]])[0], sig: SB(F, [-405, -365, 335, 240]), hook: F([[-120, -360]])[0], feat: [], ells: [26 / 140] };
};
META.steelyard = { act: 'swing', noTurn: true, gold: true, only: ['close', 'hang', 'niche'] };

O.waxseal = (f, o = {}) => { // a seal set: a strip of parchment with a fat red (objOpt black: black) wax seal pressed on its tail, the turned brass seal matrix still standing in the wax
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const sheet = [[-320, -60], [240, -110], [300, 120], [-280, 180]]; P(f, F, sheet, C.VELLUM, { tex: T(f, 'mottle'), texOp: 0.8 }); for (let k = 0; k < 5; k++) L(f, F, [[-270, -20 + k * 34], [-60, -40 + k * 34]], 3, '#4a3a2a', { op: 0.6 });
  P(f, F, [[60, 60], [150, 50], [170, 230], [120, 240], [80, 120]], C.VELLUM, { dressO: { op: 0.3 } });   // the tag the seal hangs on
  const wax = []; for (let i = 0; i <= 24; i++) { const t = Math.PI * 2 * i / 24; wax.push([110 + Math.cos(t) * (120 + (i % 3) * 8), 120 + Math.sin(t) * (84 + (i % 2) * 6)]); }
  const WX = o.black ? ['#2a2420', '#1a1614'] : ['#7a1a12', '#5a1a12']; P(f, F, wax, WX[0], { tex: T(f, 'mottle'), texOp: 0.8 }); oval(f, F, [110, 116], 80, 54, WX[1], { shade: 0.45 }); L(f, F, ell([110, 116], 70, 46, 0, 20).slice(11, 19), 4, o.black ? '#8a8480' : '#c86a5a', { op: 0.5 });
  const m = turned([[40, -300], [54, -270], [34, -200], [40, -130], [66, -60], [70, 0]], 0.25).map(p => add(p, [110, 100])); P(f, F, m, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, m, [-150, -80, -20], () => 60, 0.25, { op: 0.45 }); L(f, F, [[80, -170], [74, 80]], 6, '#f0e0b0', { op: 0.5 });
  return { focus: F([[110, 60]])[0], sig: SB(F, [-320, -205, 300, 240]), feat: [], ells: [0.25] };
};
META.waxseal = { act: 'press', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

// ==== redraws (blind tests, 2026-11-26)
O.ewer = (f, o = {}) => { // a pewter ewer, upright and tipping to pour: a bellied body on a flared foot, a hinged lid with a thumb-piece, a long spout from the belly, a heavy C handle (read as a bag on a cord before)
  const F = frame([0, 0], o.ang ?? 0.35, 1), r = f.r, PW = '#8a8c86';
  const body = turned([[70, -230], [64, -190], [96, -110], [150, -10], [150, 80], [110, 160], [60, 200], [60, 230], [120, 270]], 0.2);
  P(f, F, body, PW, { tex: T(f, 'mottle'), texOp: 0.8 }); arcs(f, F, body, [-130, -60, 0, 60, 120], y => 150 - Math.abs(y - 30) * 0.25, 0.2, { op: 0.5 }); shadeR(f, F, body, 50, 150, -120, 190, 9, { op: 0.45 });
  L(f, F, [[-110, -60], [-128, 40], [-96, 140]], 12, '#f4f4ee', { op: 0.5 }); for (const y of [-180, 180]) L(f, F, [[-70, y], [70, y]], 5, INK, { op: 0.6 });
  const sp = [[120, 20], [260, -180], [300, -250], [320, -244], [290, -170], [150, 80]]; P(f, F, sp, PW, { dressO: { op: 0.3 } }); L(f, F, [[140, 0], [278, -200]], 4, '#f4f4ee', { op: 0.5 });
  const lid = [[-80, -240], [80, -240], [60, -290], [0, -310], [-60, -290]]; P(f, F, lid, '#9a9c96', { dressO: { op: 0.3 } }); f.part(F(ell([-90, -290], 26, 18, 0, 10)), { fill: '#6a6c66', shade: 0.4, inkW: 1.4, cast: false });
  const hdl = [[-80, -210], [-230, -230], [-270, -80], [-200, 40], [-130, 70]]; tube(f, F, hdl, 34, PW); L(f, F, [[-232, -200], [-256, -90]], 5, '#f4f4ee', { op: 0.5 });
  f.part(F(ell([-130, 70], 20, 26, 0, 10)), { fill: PW, shade: 0.4, inkW: 1.4, cast: false });
  D.bloom(f, F([[60, 120]])[0], 20, '#4a4c48', { n: 3, op: 0.5 }); f.scratches(F([[-40, 0]])[0], 40, 8, '#f0f0ea');
  return { focus: F([[300, -250]])[0], sig: SB(F, [-285, -315, 325, 275]), mouth: F([[310, -250]])[0], grip: { c: F([[-260, -90]])[0], thumb: (o.ang ?? 0.35) }, feat: [], ells: [0.2] };
};

O.torch = (f, o = {}) => { // a pitch torch: a stave wrapped in tarred rags bound with iron, the head burning with a tall solid flame and dripping black pitch
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r;
  P(f, F, limb([0, 380], [0, -60], 46, 52, { capB: false }), C.OAK, { tex: T(f, 'wood'), texOp: 0.9 }); lit(f, F, [[-16, 360], [-18, -40]], 4, 0.45);
  const head = [[-90, -40], [-110, -140], [-100, -230], [-70, -260], [70, -260], [100, -230], [110, -140], [90, -40]]; P(f, F, head, '#2a2018', { tex: T(f, 'weave'), texOp: 1 });
  for (let k = 0; k < 5; k++) { const y = -60 - k * 42; L(f, F, [[-104, y + 10], [0, y - 8], [104, y + 12]], 5, '#5a4a38', { op: 0.8 }); }
  for (const y of [-40, -180]) { L(f, F, [[-100, y], [100, y]], 18, INK); L(f, F, [[-96, y], [96, y]], 11, C.IRON); f.rivet(F([[0, y]])[0], 4, '#9a9a96'); }
  flame(f, F, [-10, -250], 330, 120, 0.12); flame(f, F, [-70, -240], 160, 50, -0.2); flame(f, F, [70, -240], 190, 54, 0.3);
  for (let i = 0; i < 3; i++) K.fxReq(f, 'drip', F([[-60 + i * 50, -30]])[0], 3, { col: '#120c08' });
  D.bloom(f, F([[40, 200]])[0], 16, '#1a120c', { n: 2 }); D.chip(f, F([[20, 340]])[0], 8, 0);
  return { focus: F([[0, -280]])[0], sig: SB(F, [-130, -590, 140, 380]), grip: { c: F([[0, 260]])[0], thumb: (o.ang ?? -0.35) - Math.PI / 2 }, feat: ['fire'], ells: [] };
};

O.quill = (f, o = {}) => { // a goose quill cut as a pen: a long narrow feather, barbs combed out on both sides of the shaft and split in two places, the bare barrel and slit nib black-wet with the course's ink
  const F = frame([0, 0], o.ang ?? 0.5, 1), r = f.r, ink = INKS[o.course] || '#1e1612';   // the course's ink, as objects8.js
  const sh = K.catmull([[0, 360], [6, 160], [24, -60], [60, -260], [120, -430]], 6), n = sh.length;
  const side = (s, w0) => sh.map((p, i) => { const t = i / (n - 1); if (t < 0.36) return p; const d = norm(sub(sh[Math.min(n - 1, i + 1)], sh[Math.max(0, i - 1)])), nn = [-d[1] * s, d[0] * s], w = w0 * Math.sin(Math.PI * Math.min(1, (t - 0.36) / 0.66)) ** 0.6; return add(p, mul(nn, w)); });
  const A = side(1, 92), B = side(-1, 60);
  for (const [edge, s] of [[A, 1], [B, -1]]) { const poly = [...sh, ...edge.slice().reverse()]; P(f, F, poly, s > 0 ? '#e0d8c4' : '#cfc6b0', { shade: 0.2, tex: T(f, 'mottle'), texOp: 0.35, dressO: { op: 0.2 } });
    for (let i = Math.round(n * 0.38); i < n - 1; i += 1) L(f, F, [sh[i], lerp(sh[i], edge[Math.min(n - 1, i + 2)], 1)], 1.3, '#7a7262', { op: 0.55 }); }
  for (const [i, e] of [[Math.round(n * 0.55), A], [Math.round(n * 0.72), B]]) f.part(F([sh[i], e[i + 1], e[i + 3], lerp(sh[i + 2], e[i + 2], 0.3)]), { fill: '#3a3428', shade: 0.2, inkW: 1, cast: false });   // splits in the vane
  L(f, F, sh, 12, INK); L(f, F, sh, 7, '#f4ecd8');
  const nib = [[-16, 250], [16, 250], [6, 340], [0, 370], [-6, 340]]; f.part(F(nib), { fill: '#e8dcc0', shade: 0.3, inkW: 1.6, cast: false, sharp: true }); f.part(F([[-12, 300], [12, 300], [4, 350], [0, 368], [-4, 350]]), { fill: ink, shade: 0.2, inkW: 1, cast: false }); L(f, F, [[0, 310], [0, 366]], 1.6, INK);
  K.fxReq(f, 'drip', F([[0, 372]])[0], 3, { col: ink });
  return { focus: F([[0, 300]])[0], sig: SB(F, [-110, -440, 160, 375]), grip: { c: F([[6, 210]])[0], thumb: (o.ang ?? 0.5) + Math.PI / 2 }, feat: ['contents'], ells: [] };
};

module.exports = { O, META, helpers: { flame, hand } };
