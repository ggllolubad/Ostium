// The card object library, part fourteen: the one-object-per-card pass (L72) for the Hexweaver and the Elementalist.
// Hexweaver: a wax heart stuck with pins, two poppets bound face to face, a horseshoe nailed up against witches, a great
// cracked bell on the ground, a bell-cote, a lych gate, a tally stick of grudges, a carved false face, a hag's finger
// and a hall of mirrors. Elementalist: a brass fire squirt, a knapped flint, a sigil talisman on a cord. Same contract
// and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const O = {}, META = {};
const BR = '#9a7e50', STRAW = '#a8946a', SACK = '#8a7a5a';

// ==== the Hexweaver
O.waxheart = (f, o = {}) => { // a heart of dark red wax stuck through with pins and a coffin nail, wound with black thread: the ill-wisher's charm
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const heart = []; for (let i = 0; i <= 40; i++) { const t = Math.PI * 2 * i / 40; heart.push([16 * Math.pow(Math.sin(t), 3) * 16, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 16 + 20]); }
  P(f, F, heart, '#7a1a12', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, heart, 0.45, 9, 0.8, '#e8a090'); arcs(f, F, heart, [-80, 0, 80], y => 200 - Math.abs(y) * 0.5, 0.3, { op: 0.4 }); shadeR(f, F, heart, 60, 240, -150, 200, 10, { op: 0.5 });
  L(f, F, [[-150, -150], [-200, -40], [-140, 80]], 10, '#d8a090', { op: 0.45 });
  for (let k = 0; k < 4; k++) L(f, F, [[-230 + k * 10, -80 + k * 40], [230 - k * 14, -40 + k * 50]], 3, '#120c0a', { op: 0.85 });   // the black thread
  for (const [x, y, a, len] of [[-120, -100, -2.2, 150], [80, -140, -1.1, 160], [0, 40, -1.6, 140], [140, 40, -0.6, 130], [-90, 80, -2.6, 120]]) { const t = add([x, y], [Math.cos(a) * len, Math.sin(a) * len]); L(f, F, [[x, y], t], 6, INK); L(f, F, [[x, y], t], 3, '#a8aaa6'); f.part(F(ell(t, 12, 12, 0, 8)), { fill: '#d8d0b8', shade: 0.3, inkW: 1, cast: false }); f.flat(F(ell([x, y], 6, 6, 0, 6)), '#3a0806', { op: 0.9 }); }
  const nh = [-30, -260]; L(f, F, [nh, [10, -60]], 16, INK); L(f, F, [nh, [10, -60]], 10, C.IRON); f.part(F(ell(nh, 30, 14, -0.2, 10)), { fill: C.IRON, shade: 0.4, inkW: 1.4, cast: false });   // the coffin nail
  D.wax(f, F([[60, 200], [90, 190]]), '#7a1a12', { thick: 8, drips: 2, dripL: 60 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-270, -320, 280, 290]), feat: [], ells: [] };
};
META.waxheart = { act: 'press', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

O.twinpoppet = (f, o = {}) => { // two straw poppets bound face to face with red thread, one curse on the pair, a single long pin through both
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const s of [-1, 1]) { const cx = s * 100, G = pts => F(pts.map(p => add([cx, 0], [p[0] * s, p[1]])));
    for (const [a, b] of [[[-30, 60], [-70, 240]], [[30, 60], [60, 240]], [[-40, -60], [-160, 20]]]) f.part(G(limb(a, b, 40, 28, { capK: 0.4 })), { fill: STRAW, shade: 0.45, tex: T(f, 'wood'), texOp: 0.6 });
    P(f, G, [[-70, -90], [70, -90], [86, 30], [96, 110], [-90, 114], [-80, 30]], s < 0 ? SACK : '#6a5a4a', { tex: T(f, 'weave'), texOp: 0.7 });
    P(f, G, ell([0, -160], 66, 72, 0, 20), mix(SACK, '#fff', 0.15), { tex: T(f, 'weave'), texOp: 0.7 });
    for (const x of [-26, 24]) { L(f, G, [[x - 10, -180], [x + 10, -160]], 3, INK); L(f, G, [[x + 10, -180], [x - 10, -160]], 3, INK); }
    f.stitches(G([[-30, -126], [0, -120], [30, -128]]), '#2a1a10', 1.6); }
  for (const y of [-40, 50]) { L(f, F, [[-200, y], [200, y + 10]], 11, INK); L(f, F, [[-200, y], [200, y + 10]], 6, '#a82a1a'); }
  L(f, F, [[-300, -10], [260, 10]], 8, INK); L(f, F, [[-300, -10], [260, 10]], 4, '#a8aaa6'); f.part(F(ell([-300, -10], 14, 14, 0, 8)), { fill: '#2a2a2a', shade: 0.3, inkW: 1, cast: false });
  D.stain(f, F([[60, 60]])[0], 26, '#3a2414', { op: 0.35 });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-310, -240, 300, 250]), feat: [], ells: [] };
};
META.twinpoppet = { act: 'press', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

O.horseshoe = (f, o = {}) => { // an iron horseshoe nailed points-up over a cottage door to keep witches out: worn bright where it was trodden, its nail holes, the plank behind
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const dr = [[-320, -320], [320, -320], [320, 320], [-320, 320]]; P(f, F, dr, '#6a5034', { tex: T(f, 'wood'), texOp: 1 }); for (const x of [-160, 0, 160]) L(f, F, [[x, -320], [x, 320]], 2.6, INK, { op: 0.7 }); grain(f, F, dr, 0.2, 10, 1.57);
  const cl = []; for (let i = 0; i <= 30; i++) { const t = -0.35 + i / 30 * (Math.PI + 0.7); cl.push([Math.cos(t) * 190, 40 + Math.sin(t) * 220]); }
  const s = sweep(cl, 76, 76); D.slab(f, F(s.poly), [8, 10]); P(f, F, s.poly, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, s.B.slice(8, 24), 6, '#e8e8e0', { op: 0.5 });
  for (const i of [4, 9, 21, 26]) { const p = lerp(s.A[i], s.B[i], 0.5); f.part(F(ell(p, 9, 13, 0, 8)), { fill: '#0e0c0a', shade: 0.1, inkW: 1, cast: false }); f.rivet(F([p])[0], 6, '#8a8a86'); }
  D.bloom(f, F([[-150, 120]])[0], 26, C.RUST, { n: 4 }); D.bloom(f, F([[160, 60]])[0], 20, C.RUST, { n: 3 }); f.scratches(F([[0, 250]])[0], 40, 6, '#f0f0ea');
  return { focus: F([[0, 160]])[0], sig: SB(F, [-325, -325, 325, 325]), feat: [], ells: [] };
};
META.horseshoe = { act: 'press', only: ['close'] };

O.greatbell = (f, o = {}) => { // the great bell taken down: a huge bronze bell sitting on timber baulks on the ground, a long crack up its waist and a chunk broken out of the lip lying beside it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const x of [-200, 200]) P(f, F, [[x - 120, 250], [x + 120, 250], [x + 110, 300], [x - 110, 300]], C.OAK, { tex: T(f, 'wood'), texOp: 1, sharp: true });
  const prof = [[70, -300], [110, -280], [150, -200], [170, -60], [200, 80], [270, 200], [300, 240]];
  const body = turned(prof, 0.2); P(f, F, body, BR, { tex: T(f, 'mottle'), texOp: 0.9 }); arcs(f, F, body, [-200, -100, 0, 100, 180], y => 170 + Math.max(0, y) * 0.5, 0.2, { op: 0.45 }); shadeR(f, F, body, 80, 280, -260, 230, 12, { op: 0.5 });
  f.part(F([[140, 240], [200, 150], [240, 170], [270, 250]]), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false });   // the broken lip
  P(f, F, [[300, 250], [380, 230], [400, 290], [320, 300]], BR, { dress: false });
  P(f, F, [[-110, -310], [110, -310], [90, -380], [-90, -380]], BR, { dress: false }); for (const s of [-1, 1]) ring(f, F, [s * 50, -380], 34, 30, 12, BR);   // the crown and canons
  for (const y of [-220, 120, 180]) L(f, F, [[-170 - Math.max(0, y) * 0.5, y], [0, y + 14], [170 + Math.max(0, y) * 0.5, y]], 3, INK, { op: 0.6 });
  for (let i = 0; i < 9; i++) f.part(F(ell([-120 + i * 30, -140], 9, 12, 0, 6)), { fill: mix(BR, '#2a2010', 0.4), shade: 0.3, inkW: 0.8, cast: false });   // a lettered band
  D.crack(f, F([[160, 220]])[0], -2.0, 340, { n: 8, w: 3 });
  L(f, F, [[-90, -250], [-130, -60], [-200, 120]], 12, '#e8d8a8', { op: 0.5 }); D.bloom(f, F([[-60, 40]])[0], 34, C.VERD, { n: 5, op: 0.7 }); D.bloom(f, F([[100, -100]])[0], 24, C.VERD, { n: 3, op: 0.6 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-330, -415, 405, 300]), feat: ['crack'], ells: [0.2] };
};
META.greatbell = { act: 'ring', noTurn: true, only: ['close', 'floor', 'niche'] };

O.belfry = (f, o = {}) => { // a timber bell-cote on the churchyard wall: two posts and a steep shingled roof sheltering a small bell, its rope hanging down to a striped sally
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-260, 200], [260, 200], [260, 320], [-260, 320]], C.STONE, { tex: T(f, 'mottle'), texOp: 1, sharp: true }); for (const x of [-130, 0, 130]) L(f, F, [[x, 200], [x, 320]], 2.4, INK, { op: 0.6 }); L(f, F, [[-260, 260], [260, 260]], 2.4, INK, { op: 0.6 });
  for (const s of [-1, 1]) tube(f, F, [[s * 170, 200], [s * 170, -160]], 34, C.OAK); tube(f, F, [[-200, -150], [200, -150]], 26, C.OAK); tube(f, F, [[-160, 180], [-60, -140]], 14, C.OAK); tube(f, F, [[160, 180], [60, -140]], 14, C.OAK);
  const roof = [[-300, -130], [0, -380], [300, -130], [260, -110], [0, -330], [-260, -110]]; P(f, F, [[-300, -130], [0, -380], [300, -130]], '#4a3a2c', { tex: T(f, 'wood'), texOp: 1 }); for (let k = 1; k < 6; k++) { const t = k / 6; L(f, F, [lerp([-300, -130], [0, -380], t), lerp([300, -130], [0, -380], t)], 2.4, '#1a120c', { op: 0.6 }); }
  const b = turned([[30, -140], [44, -130], [52, -90], [60, -40], [90, 0]], 0.22).map(p => add(p, [0, 0])); P(f, F, b, BR, { tex: T(f, 'mottle'), texOp: 0.8 }); f.part(F(ell([0, 0], 90, 20, 0, 20)), { fill: '#120c08', shade: 0.1, inkW: 1.8, cast: false });
  L(f, F, [[20, 0], [30, 120], [20, 240]], 8, INK); L(f, F, [[20, 0], [30, 120], [20, 240]], 4.4, C.TWINE); P(f, F, [[4, 120], [44, 120], [44, 180], [4, 180]], '#7a2418', { dress: false }); for (const y of [134, 150, 166]) L(f, F, [[4, y], [44, y]], 3, '#e8dcc0');
  D.bloom(f, F([[-40, -60]])[0], 14, C.VERD, { n: 2 }); D.chip(f, F([[200, 290]])[0], 9, 0);
  return { focus: F([[0, -60]])[0], sig: SB(F, [-305, -385, 305, 320]), feat: [], ells: [0.22] };
};
META.belfry = { act: 'ring', noTurn: true, only: ['close', 'floor', 'niche'] };

O.lychgate = (f, o = {}) => { // a lych gate at the churchyard: a roofed oak gateway on four posts, the coffin rest stone beneath, the gate leaves standing open on the path, a yew behind
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  f.part(F(ell([0, -60], 230, 230, 0, 24)), { fill: '#1e2a1e', shade: 0.4, inkW: 1.6, cast: false, tex: T(f, 'weave'), texOp: 0.8 });   // the yew
  P(f, F, [[-330, 260], [330, 260], [330, 320], [-330, 320]], '#5a5040', { tex: T(f, 'mottle'), texOp: 1, sharp: true });
  for (const x of [-250, 250]) tube(f, F, [[x, 260], [x, -110]], 36, C.OAK); tube(f, F, [[-270, -110], [270, -110]], 28, C.OAK); for (const x of [-160, 160]) tube(f, F, [[x, -110], [x * 0.3, -200]], 14, C.OAK);
  const roof = [[-340, -100], [0, -330], [340, -100], [300, -80], [0, -280], [-300, -80]]; P(f, F, [[-350, -96], [0, -340], [350, -96]], '#5a4434', { tex: T(f, 'wood'), texOp: 1 }); for (let k = 1; k < 7; k++) { const t = k / 7; L(f, F, [lerp([-350, -96], [0, -340], t), lerp([350, -96], [0, -340], t)], 2.4, '#1a120c', { op: 0.6 }); }
  P(f, F, [[-130, 160], [130, 160], [130, 230], [-130, 230]], C.STONEL, { tex: T(f, 'mottle'), texOp: 1, sharp: true });   // the coffin rest
  for (const s of [-1, 1]) { const g = [[s * 230, 250], [s * 120, 270], [s * 120, 30], [s * 230, 10]]; P(f, F, g, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); for (let k = 1; k < 4; k++) L(f, F, [[s * (230 - k * 28), 250 + k * 5], [s * (230 - k * 28), 10 + k * 5]], 4, '#2a1a10', { op: 0.7 }); L(f, F, [[s * 230, 140], [s * 120, 150]], 8, '#2a1a10', { op: 0.8 }); }
  P(f, F, [[-12, -280], [12, -280], [12, -200], [-12, -200]], C.OAK, { dress: false }); P(f, F, [[-40, -260], [40, -260], [40, -240], [-40, -240]], C.OAK, { dress: false });
  D.chip(f, F([[250, 100]])[0], 9, 0); D.crack(f, F([[0, 200]])[0], 0.2, 80, { n: 4 });
  return { focus: F([[0, 60]])[0], sig: SB(F, [-350, -345, 350, 320]), feat: [], ells: [] };
};
META.lychgate = { act: 'open', noTurn: true, only: ['close', 'floor'] };

O.tallystick = (f, o = {}) => { // a grudge kept on a tally stick: a split hazel stick cut with a long row of notches, the second half bound to it with red thread, a blood mark on the last cut
  const F = frame([0, 0], o.ang ?? -0.5, 1), r = f.r;
  for (const [dx, col] of [[-36, '#8a6a44'], [36, '#7a5a3a']]) { const st = [[dx - 34, -380], [dx + 34, -380], [dx + 30, 380], [dx - 30, 380]]; P(f, F, st, col, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, st, 0.3, 9, 1.57); }
  for (let i = 0; i < 13; i++) { const y = -340 + i * 50, w = i % 5 === 4 ? 70 : 44; f.part(F([[-70, y - 10], [-70 + w, y], [-70, y + 10]]), { fill: '#2a1a10', shade: 0.1, inkW: 1.2, cast: false }); f.part(F([[70, y - 10], [70 - w, y], [70, y + 10]]), { fill: '#2a1a10', shade: 0.1, inkW: 1.2, cast: false }); }
  f.flat(F(ell([-40, 260], 16, 10, 0, 8)), '#5c0f0b', { op: 0.9 });
  for (const y of [-200, 120]) { L(f, F, [[-76, y], [76, y + 8]], 11, INK); L(f, F, [[-76, y], [76, y + 8]], 6, '#9a2a1a'); }
  oval(f, F, [0, -380], 70, 20, '#b8946a'); L(f, F, [[-20, -390], [20, -372]], 1.4, '#5a3a1a');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-80, -400, 80, 385]), grip: { c: F([[0, 300]])[0], thumb: (o.ang ?? -0.5) - Math.PI / 2 }, feat: [], ells: [] };
};
META.tallystick = { act: 'press', ang: -0.5, long: true };

O.mask = (f, o = {}) => { // glamour: a carved and painted wooden false face with a fair smiling look, its strings hanging, and behind it the shadowed grimace it hides
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const face = (c, s, col) => { const q = []; for (let i = 0; i <= 28; i++) { const t = Math.PI * 2 * i / 28; q.push(add(c, [Math.cos(t) * 170 * s * (Math.sin(t) > 0 ? 0.85 : 1), Math.sin(t) * 230 * s])); } return q; };
  const back = face([120, -40], 0.9, '#3a2e2a'); P(f, F, back, '#3a2e2a', { tex: T(f, 'mottle'), texOp: 1 }); for (const x of [70, 180]) f.part(F([[x - 30, -100], [x + 30, -110], [x, -60]]), { fill: '#0a0606', shade: 0.1, inkW: 1, cast: false }); f.part(F([[60, 70], [190, 60], [170, 120], [80, 120]]), { fill: '#0a0606', shade: 0.1, inkW: 1.2, cast: false }); for (let k = 0; k < 5; k++) L(f, F, [[80 + k * 24, 70], [84 + k * 24, 116]], 3, '#c8bfa8');
  const fr = face([-80, 0], 1, '#e0ccb0'); P(f, F, fr, '#e0ccb0', { tex: T(f, 'wood'), texOp: 0.7 }); arcs(f, F, fr, [-100, 0, 100], y => 160 - Math.abs(y) * 0.3, 0.4, { op: 0.35 }); shadeR(f, F, fr, 0, 90, -180, 200, 9, { op: 0.4 });
  for (const x of [-150, -10]) { f.part(F(ell([x, -50], 36, 20, 0, 14)), { fill: '#0e0a08', shade: 0.1, inkW: 1.4, cast: false }); L(f, F, [[x - 40, -84], [x, -96], [x + 40, -84]], 4, '#3a2418'); }
  f.part(F(ell([-170, 40], 30, 18, 0, 10)), { fill: '#b88a7a', shade: 0.2, inkW: 0, cast: false, opacity: 0.7 }); f.part(F(ell([10, 40], 30, 18, 0, 10)), { fill: '#b88a7a', shade: 0.2, inkW: 0, cast: false, opacity: 0.7 });
  P(f, F, [[-90, -20], [-60, 50], [-110, 50]], '#d0bca0', { dress: false }); L(f, F, [[-150, 110], [-80, 140], [-10, 110]], 7, '#7a2418');
  for (const s of [-1, 1]) L(f, F, [[-80 + s * 168, -10], [-80 + s * 200, 120], [-80 + s * 180, 260]], 4, C.TWINE);
  L(f, F, [[-210, -120], [-220, 40]], 8, '#f8eedc', { op: 0.5 }); D.crack(f, F([[-40, -180]])[0], 1.4, 90, { n: 4 });
  return { focus: F([[-80, 0]])[0], sig: SB(F, [-255, -235, 280, 270]), feat: [], ells: [] };
};
META.mask = { act: 'glare', noTurn: true, only: ['close', 'niche', 'table', 'ledge'] };

O.finger = (f, o = {}) => { // a hag's finger: a long withered finger, knuckled and grey, with a black hooked nail, crooked to beckon, a ring of twine at its base
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r, SK = '#9a9480';
  const cl = [[0, 340], [10, 160], [-10, 0], [30, -150], [110, -280], [200, -330]];
  const s = sweep(cl, 92, 52, t => 92 - 36 * t + (Math.abs(t - 0.35) < 0.06 || Math.abs(t - 0.68) < 0.06 ? 16 : 0));
  P(f, F, s.poly, SK, { tex: T(f, 'mottle'), texOp: 1 }); for (const t of [0.35, 0.68]) { const k = Math.round(t * (s.c.length - 1)); for (let j = -1; j <= 1; j++) L(f, F, [lerp(s.A[k + j * 2], s.B[k + j * 2], 0.1), lerp(s.A[k + j * 2], s.B[k + j * 2], 0.6)], 2, '#4a4434', { op: 0.7 }); }
  L(f, F, s.A.slice(2, -3), 6, '#d8d4c0', { op: 0.4 }); shadeR(f, F, s.poly, 0, 100, -250, 300, 8, { op: 0.3 });
  const tip = s.c[s.c.length - 1], d = norm(sub(tip, s.c[s.c.length - 3])), n = [-d[1], d[0]];
  P(f, F, [add(tip, mul(n, 28)), add(tip, add(mul(d, 70), mul(n, 10))), add(tip, add(mul(d, 110), mul(n, -40))), add(tip, add(mul(d, 40), mul(n, -26))), add(tip, mul(n, -26))], '#1a1410', { dress: false, sharp: true });
  for (let k = 0; k < 3; k++) L(f, F, [[-50, 240 + k * 16], [56, 236 + k * 16]], 5, C.TWINE);
  f.part(F(ell([0, 345], 46, 16, 0, 12)), { fill: '#5a1a12', shade: 0.3, inkW: 1.4, cast: false });
  return { focus: F([[60, -150]])[0], sig: SB(F, [-50, -380, 320, 360]), grip: { c: F([[0, 300]])[0], thumb: (o.ang ?? -0.35) - Math.PI / 2 }, feat: [], ells: [] };
};
META.finger = { act: 'press', ang: -0.35 };

O.mirrorhall = (f, o = {}) => { // a hall of mirrors: three tall arched looking glasses in a row, angled to one another, each showing the next one smaller inside it, on and on
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const arch = (cx, w, top, bot) => { const q = [[cx - w, bot]]; for (let i = 0; i <= 10; i++) { const t = Math.PI * i / 10; q.push([cx - w * Math.cos(t), top - Math.sin(t) * w * 0.7]); } q.push([cx + w, bot]); return q; };
  for (const [cx, w, sk] of [[-230, 110, 0.85], [230, 110, 0.85], [0, 140, 1]]) {
    const fr = arch(cx, w, -200 * sk, 300); P(f, F, fr, C.GILT, { tex: T(f, 'mottle'), texOp: 0.8 });
    for (let k = 0; k < 4; k++) { const ww = w * (0.82 - k * 0.18), q = arch(cx, ww, -200 * sk + 40 + k * 60, 290 - k * 40); f.part(F(q), { fill: mix('#8a949a', '#2a3036', k * 0.25), shade: 0.25, inkW: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 0.5 }); }
    L(f, F, [[cx - w * 0.6, -100 * sk], [cx - w * 0.2, 240]], 8, '#e8ecee', { op: 0.4 }); }
  P(f, F, [[-350, 300], [350, 300], [350, 340], [-350, 340]], C.OAK, { tex: T(f, 'wood'), texOp: 1, sharp: true });
  D.crack(f, F([[-20, -120]])[0], 1.0, 200, { n: 6 }); D.bloom(f, F([[240, 120]])[0], 20, '#2a2a2a', { n: 3, op: 0.4 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-350, -310, 350, 340]), feat: [], ells: [] };
};
META.mirrorhall = { act: 'glare', noTurn: true, gold: true, only: ['close', 'floor', 'niche'] };

// ==== the Elementalist
O.squirt = (f, o = {}) => { // a brass fire squirt: a long-barrelled hand syringe, a ring handle on the plunger, the jet of the course's ink shooting from the nozzle
  const F = frame([0, 0], o.ang ?? -0.3, 1), r = f.r, ink = INKS[o.course] || '#2e3e5a';
  const bar = [[-200, -86], [180, -86], [180, 86], [-200, 86]]; P(f, F, bar, C.BRONZE, { tex: T(f, 'mottle'), texOp: 0.9 }); shadeR(f, F, [[-200, 0], [180, 0], [180, 86], [-200, 86]], -200, 180, 10, 86, 14, { op: 0.4, slant: 0 }); grain(f, F, bar, 0.35, 9, 0.9, '#2a1e0e'); L(f, F, [[-190, -60], [170, -60]], 8, '#f0e0b0', { op: 0.55 });
  for (const x of [-180, 0, 170]) { L(f, F, [[x, -94], [x, 94]], 16, INK); L(f, F, [[x, -92], [x, 92]], 10, '#9a8a5a'); }
  P(f, F, [[180, -60], [330, -14], [330, 14], [180, 60]], C.BRONZE, { dress: false }); oval(f, F, [334, 0], 6, 12, '#1a120a');
  tube(f, F, [[-200, 0], [-280, 0]], 22, '#8a8a86'); ring(f, F, [-320, 0], 44, 52, 16, C.BRONZE);   // the plunger and its ring
  for (const s of [-1, 1]) ring(f, F, [-150, s * 116], 26, 26, 12, C.BRONZE);
  const jet = [[330, -14], [420, -60], [480, -80], [500, -60], [470, -40], [420, -16], [330, 14]]; f.part(F(jet), { fill: ink, shade: 0.2, inkW: 1.4, cast: false });
    D.bloom(f, F([[60, 20]])[0], 20, C.VERD, { n: 3 }); f.scratches(F([[-60, -20]])[0], 30, 6, '#f8f0d8');
  return { focus: F([[330, 0]])[0], sig: SB(F, [-370, -145, 505, 145]), grip: { c: F([[-150, 0]])[0], thumb: (o.ang ?? -0.3) }, feat: ['contents'], ells: [] };
};
META.squirt = { act: 'fling', ang: -0.3 };

O.flint = (f, o = {}) => { // a knapped flint: a black nodule with its chalky white rind, the struck face flaked in shell-shaped scars with a sharp edge, a spark jumping off it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const out = [[-280, 60], [-250, -90], [-150, -200], [0, -240], [140, -190], [250, -60], [290, 70], [220, 200], [40, 240], [-160, 210]];
  P(f, F, out, '#d8d0c0', { tex: T(f, 'mottle'), texOp: 1 });
  const face = [[-200, 40], [-170, -80], [-60, -170], [80, -160], [200, -50], [230, 60], [160, 160], [0, 190], [-140, 160]]; f.part(F(face), { fill: '#24262a', shade: 0.4, inkW: 2, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
  for (const [c, a] of [[[-100, -60], 0.4], [[40, -80], -0.3], [[120, 40], 0.8], [[-60, 100], -0.6], [[40, 120], 0.2]]) { for (let k = 1; k < 4; k++) L(f, F, ell(c, 30 * k, 18 * k, a, 14).slice(0, 8), 2, k % 2 ? '#5a5e66' : '#0e0e10', { op: 0.75 }); }
  L(f, F, [[-170, -80], [-60, -170], [80, -160]], 5, '#e8ecf0', { op: 0.7 });
  for (const [x, y] of [[-70, -230], [-30, -290], [10, -260], [-100, -300]]) f.part(F([[x, y - 18], [x + 6, y], [x, y + 18], [x - 6, y]]), { fill: '#f0e4c4', shade: 0.1, inkW: 1, cast: false });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-285, -310, 295, 245]), feat: [], ells: [] };
};
META.flint = { act: 'burst', only: ['close', 'table', 'ledge', 'floor'] };

O.talisman = (f, o = {}) => { // a sigil talisman: a round brass disc on a leather cord, a six-pointed seal engraved in it filled with the course's ink, letters round the rim
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = INKS[o.course] || '#3a2a44';
  L(f, F, [[-200, -330], [-120, -230], [-40, -140]], 9, INK); L(f, F, [[-200, -330], [-120, -230], [-40, -140]], 5, C.LEATHER); L(f, F, [[200, -330], [120, -230], [40, -140]], 9, INK); L(f, F, [[200, -330], [120, -230], [40, -140]], 5, C.LEATHER);
  ring(f, F, [0, -140], 26, 22, 10, C.BRONZE);
  const disc = ell([0, 80], 210, 210, 0, 40); D.slab(f, F(disc), [8, 10]); P(f, F, disc, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); shadeR(f, F, disc, 60, 200, -100, 270, 10, { op: 0.45 });
  ring(f, F, [0, 80], 180, 180, 4, '#5a4a2a');
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; f.part(F(ell([Math.cos(a) * 196, 80 + Math.sin(a) * 196], 6, 9, a, 6)), { fill: '#3a2e18', shade: 0.2, inkW: 0.6, cast: false }); }
  for (const a0 of [0, Math.PI / 3]) { const tri = [0, 1, 2].map(k => [Math.cos(a0 + Math.PI / 2 + k * 2.094) * 140, 80 + Math.sin(a0 + Math.PI / 2 + k * 2.094) * 140]); L(f, F, loop(tri), 14, INK); L(f, F, loop(tri), 8, ink); }
  f.part(F(ell([0, 80], 30, 30, 0, 14)), { fill: ink, shade: 0.2, inkW: 1.4, cast: false });
  L(f, F, ell([0, 80], 200, 200, 0, 40).slice(22, 34), 6, '#f0e0b0', { op: 0.5 }); D.bloom(f, F([[120, 180]])[0], 24, C.VERD, { n: 3 });
  return { focus: F([[0, 80]])[0], sig: SB(F, [-215, -335, 215, 295]), feat: ['contents'], ells: [] };
};
META.talisman = { act: 'glare', noTurn: true };

O.sixring = (f, o = {}) => { // a ring of six inks: a heavy bronze hoop seen aslant, six round bezels set round it, each stone one course's colour, the near one catching the light
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, SIXC = ['#8a3a26', '#6a8494', '#857452', '#2e3e5a', '#5a6a34', '#3a2a44'].map(c => mix(c, '#5a5450', 0.55));   // muted, as the abacus beads (L14: four hue clusters on the attuned variants at 0.3)
  const back = ell([0, 30], 230, 120, 0, 40), bk = sweep(loop(back).slice(20, 41), 56, 56), fr = sweep(loop(back).slice(0, 21), 62, 62);
  P(f, F, bk.poly, mix(C.BRONZE, '#1a120a', 0.35), { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, bk.poly, 0.45, 7, 1.2, '#c8b07a');
  P(f, F, fr.poly, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, fr.poly, 0.45, 7, -1.0, '#2a1e0e'); shadeR(f, F, fr.poly, -230, 230, 120, 200, 16, { op: 0.4, slant: 0 }); L(f, F, ell([0, 30], 230, 120, 0, 40).slice(2, 18).map(p => add(p, [0, 22])), 6, '#f0e0b0', { op: 0.5 });
  for (let i = 0; i < 6; i++) { const t = Math.PI * (0.08 + i * 0.168), c = [Math.cos(t) * 230, 30 + Math.sin(t) * 120 - 10];
    f.part(F(ell(c, 46, 40, 0, 16)), { fill: '#5a4a30', shade: 0.4, inkW: 1.6, cast: false }); f.part(F(ell(add(c, [0, -6]), 34, 28, 0, 16)), { fill: SIXC[i], shade: 0.35, inkW: 1.2, cast: false }); f.flat(F(ell(add(c, [-10, -16]), 10, 6, 0, 8)), '#f0ece0', { op: 0.6 }); }
  for (let i = 0; i < 30; i++) { const t = Math.PI * (0.02 + i * 0.033), p = [Math.cos(t) * 230, 30 + Math.sin(t) * 120]; L(f, F, [add(p, [0, -24]), add(p, [6, 24])], 2, '#3a2e18', { op: 0.6 }); }   // tooling on the hoop (L3)
  for (let i = 0; i < 12; i++) { const t = Math.PI * (1.05 + i * 0.075), p = [Math.cos(t) * 230, 30 + Math.sin(t) * 120]; L(f, F, [add(p, [0, -22]), add(p, [-6, 22])], 2, '#1a120a', { op: 0.6 }); }
  D.bloom(f, F([[-150, -40]])[0], 20, C.VERD, { n: 3 }); f.scratches(F([[120, 120]])[0], 30, 6, '#f0e0b0');
  return { focus: F([[0, 120]])[0], sig: SB(F, [-270, -130, 270, 200]), feat: [], ells: [120 / 230] };
};
META.sixring = { act: 'turn', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

O.hagstone = (f, o = {}) => { // a hag stone: a flint pebble with a hole worn right through it, hung on a red-and-white cord with a sprig of rowan berries, to keep the hag off (objOpt bone: a knucklebone charm instead of the stone)
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const cord = [[0, -330], [-10, -200], [0, -120]]; tube(f, F, cord, 10, '#d8d0c0', { lit: false }); for (let k = 0; k < 8; k++) L(f, F, [[-6, -320 + k * 26], [6, -306 + k * 26]], 4, '#7a2418');
  if (o.bone) { const b = [[-170, -60], [-90, -130], [-20, -100], [30, -140], [110, -110], [170, -40], [150, 60], [170, 150], [90, 190], [20, 140], [-40, 180], [-120, 170], [-160, 90], [-200, 40]]; P(f, F, b, '#d8ccb0', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, b, 0.35, 9, 0.6, '#5a4a30'); f.part(F(ell([-20, 30], 46, 38, 0, 16)), { fill: '#8a7a5a', shade: 0.4, inkW: 1.6, cast: false }); L(f, F, [[-120, -40], [-140, 60]], 6, '#f8f0dc', { op: 0.5 }); f.flat(F(ell([90, 80], 16, 12, 0, 8)), '#7a1a12', { op: 0.8 }); }
  else { const st = []; for (let i = 0; i <= 26; i++) { const t = Math.PI * 2 * i / 26; st.push([Math.cos(t) * (200 + (i % 4) * 8), 40 + Math.sin(t) * (170 + (i % 3) * 8)]); } P(f, F, st, '#7a7672', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, st, 0.4, 9, 0.5, '#d8d4cc'); shadeR(f, F, st, 60, 190, -100, 190, 9, { op: 0.45 });
    f.part(F(ell([-10, 10], 54, 46, 0.3, 18)), { fill: '#0e0c0a', shade: 0.1, inkW: 2, cast: false }); L(f, F, ell([-10, 10], 60, 52, 0.3, 18).slice(9, 17), 4, '#d8d4cc', { op: 0.6 }); L(f, F, [[-150, -40], [-170, 80]], 8, '#e8e4dc', { op: 0.45 }); }
  tube(f, F, [[0, -120], [-10, -10]], 8, '#d8d0c0', { lit: false });   // through the hole
  for (const [x, y] of [[60, -150], [84, -136], [70, -122], [94, -160]]) f.part(F(ell([x, y], 14, 14, 0, 8)), { fill: '#a83020', shade: 0.3, inkW: 1, cast: false });
  for (const a of [-0.6, 0.2, 0.9]) f.part(F([[30, -140], add([30, -140], [Math.cos(a) * 90, Math.sin(a) * 40 - 30]), add([30, -140], [Math.cos(a) * 60, Math.sin(a) * 30 - 10])]), { fill: '#4a6a34', shade: 0.3, inkW: 1, cast: false });
  return { focus: F([[0, 40]])[0], sig: SB(F, [-210, -335, 210, 230]), hook: F([[0, -330]])[0], feat: [], ells: [] };
};
META.hagstone = { act: 'swing', noTurn: true, only: ['close', 'hang', 'niche'] };

O.beetle = (f, o = {}) => { // a death-watch beetle on old oak: the small dark beetle drawn large, ridged wing cases, head tucked under its hood, ticking in its bore holes in the beam
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const beam = [[-340, 120], [340, 80], [340, 300], [-340, 320]]; P(f, F, beam, C.OAK, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, beam, 0.35, 9, -0.05); for (const [x, y] of [[-250, 200], [-180, 260], [200, 180], [270, 240], [120, 260]]) f.part(F(ell([x, y], 12, 10, 0, 8)), { fill: '#0e0a06', shade: 0.1, inkW: 1, cast: false });
  for (const s of [-1, 1]) for (const [a, b, c] of [[[s * 60, -60], [s * 180, -120], [s * 230, -60]], [[s * 70, 10], [s * 200, 20], [s * 250, 100]], [[s * 60, 70], [s * 160, 140], [s * 180, 220]]]) L(f, F, [a, b, c], 10, INK);
  const el = [[-120, -80], [120, -80], [140, 40], [100, 160], [0, 200], [-100, 160], [-140, 40]]; P(f, F, el, '#3a2a1e', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, el, 0.45, 8, 1.57, '#b89a7a'); L(f, F, [[0, -80], [0, 200]], 4, INK); for (const x of [-70, 70]) L(f, F, [[x, -70], [x * 0.9, 170]], 2.4, '#1a120c', { op: 0.6 }); L(f, F, [[-90, -60], [-110, 100]], 6, '#a8907a', { op: 0.45 });
  const hood = ell([0, -120], 110, 70, 0, 20); P(f, F, hood, '#4a3826', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, hood, 0.4, 8, 0.4, '#b89a7a');
  for (const s of [-1, 1]) L(f, F, [[s * 30, -180], [s * 70, -250], [s * 110, -260]], 6, INK);
  return { focus: F([[0, 0]])[0], sig: SB(F, [-260, -265, 260, 320]), feat: [], ells: [] };
};
META.beetle = { act: 'press', noTurn: true, only: ['close', 'table', 'ledge', 'floor'] };

module.exports = { O, META };
