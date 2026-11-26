// The card object library, part ten: the variety pass for the Oracle (L58). The Chronomancer, the Augur and the Fatebinder
// drew mostly on the hourglass, clock, cord and knucklebones; these add a pocket watch, a cog with a missing tooth, a
// sundial, an orrery and an astrolabe, a painted blindfold, a weathervane, a bird skull on red thread, a wax tablet and a
// hanging tapestry. Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, SIX, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const O = {}, META = {};
const RED = '#7a1a12';   // the Fatebinder's thread: doom (L14 role)

O.pocketwatch = (f, o = {}) => { // a brass pocket watch sprung open: the hinged lid standing up, the white dial with its hands, the crown and bow, a chain looping away
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r, c = [0, 60], R = 200;
  const lid = ell(add(c, [0, -2 * R + 30]), R, R * 0.92, 0, 40); P(f, F, lid, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, lid, 0.3); for (let k = 0; k < 3; k++) ring(f, F, add(c, [0, -2 * R + 30]), R * (0.8 - k * 0.2), R * 0.92 * (0.8 - k * 0.2), 2, '#5a4a30');
  P(f, F, ell(add(c, [8, 10]), R, R, 0, 44), mix(C.BRONZE, '#000', 0.3), { dress: false }); P(f, F, ell(c, R, R, 0, 44), C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 });
  oval(f, F, c, R * 0.84, R * 0.84, '#e8e0cc', { shade: 0.3 }); for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; L(f, F, [add(c, [Math.cos(a) * R * 0.7, Math.sin(a) * R * 0.7]), add(c, [Math.cos(a) * R * 0.8, Math.sin(a) * R * 0.8])], k % 3 ? 3 : 7, INK); }
  L(f, F, [c, add(c, [60, -90])], 9, INK); L(f, F, [c, add(c, [-20, -140])], 6, INK); L(f, F, [c, add(c, [110, 40])], 2.4, RED); oval(f, F, c, 12, 12, INK);
  P(f, F, [add(c, [-22, -R - 40]), add(c, [22, -R - 40]), add(c, [18, -R + 4]), add(c, [-18, -R + 4])], C.BRONZE, { dress: false }); ring(f, F, add(c, [0, -R - 70]), 40, 30, 10, C.BRONZE);
  tube(f, F, [add(c, [40, -R - 80]), add(c, [200, -R - 40]), add(c, [260, 0]), add(c, [230, 160])], 8, C.BRONZE, { dash: '10 4', lit: false });
  L(f, F, ell(c, R - 6, R - 6, 0, 44).slice(24, 36), 7, '#f0e0b0', { op: 0.5 }); D.crack(f, F([add(c, [-60, 30])])[0], 0.4, 90, { n: 4 }); D.bloom(f, F([add(c, [120, 120])])[0], 20, C.VERD, { n: 2, op: 0.5 });
  return { focus: F([c])[0], sig: SB(F, [-205, c[1] - 2 * R - 170, 270, c[1] + R + 10]), feat: ['crack'], ells: [] };
};
META.pocketwatch = { act: 'crack', only: ['close', 'table', 'ledge', 'niche'] };

O.cog = (f, o = {}) => { // a heavy iron clock wheel stood on edge, one of its teeth snapped clean off, the spokes and hub, a pinion behind
  const F = frame([0, 0], o.ang ?? 0.1, 1), r = f.r, c = [0, 0], R = 230, N = 18, gap = 5;
  const out = []; for (let i = 0; i < N; i++) { const a0 = i / N * Math.PI * 2, a1 = (i + 0.5) / N * Math.PI * 2, rr = i === gap ? R : R + 46; out.push(add(c, [Math.cos(a0) * R, Math.sin(a0) * R]), add(c, [Math.cos(a0 + 0.04) * rr, Math.sin(a0 + 0.04) * rr]), add(c, [Math.cos(a1 - 0.04) * rr, Math.sin(a1 - 0.04) * rr]), add(c, [Math.cos(a1) * R, Math.sin(a1) * R])); }
  P(f, F, ell(add(c, [180, 160]), 110, 110, 0, 24), '#4a4c50', { dress: false });   // the pinion behind
  P(f, F, out.map(p => [p[0], p[1], 1]), '#6a6c70', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, out, 0.3);
  for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.4; f.part(F([add(c, [Math.cos(a - 0.5) * 60, Math.sin(a - 0.5) * 60]), add(c, [Math.cos(a - 0.3) * (R - 40), Math.sin(a - 0.3) * (R - 40)]), add(c, [Math.cos(a + 0.3) * (R - 40), Math.sin(a + 0.3) * (R - 40)]), add(c, [Math.cos(a + 0.5) * 60, Math.sin(a + 0.5) * 60])]), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false }); }   // the spoke windows
  oval(f, F, c, 56, 56, C.IRONL); oval(f, F, c, 18, 18, '#120c08');
  const ga = (gap + 0.25) / N * Math.PI * 2; f.part(F(ell(add(c, [Math.cos(ga) * (R + 8), Math.sin(ga) * (R + 8)]), 18, 8, ga, 10)), { fill: '#c8c8c4', shade: 0.3, inkW: 1.4, cast: false });   // the bright break
  L(f, F, ell(c, R - 10, R - 10, 0, 40).slice(22, 34), 6, '#d8d8d0', { op: 0.5 }); D.bloom(f, F([add(c, [100, -80])])[0], 30, C.RUST, { n: 3 }); D.crack(f, F([add(c, [Math.cos(ga) * (R - 20), Math.sin(ga) * (R - 20)])])[0], ga + Math.PI, 80, { n: 4 });
  return { focus: F([add(c, [Math.cos(ga) * R, Math.sin(ga) * R])])[0], sig: SB(F, [-280, -280, 295, 280]), feat: ['crack'], ells: [] };
};
META.cog = { act: 'turn', only: ['close', 'ledge', 'floor', 'niche'] };

O.sundial = (f, o = {}) => { // a stone sundial on a short column: the round dial plate seen from above, hour lines cut in it, the bronze gnomon throwing its shadow
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, -80];
  P(f, F, [[-90, -40], [90, -40], [110, 240], [-110, 240]], C.STONEL, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, [[-90, -40], [90, -40], [110, 240], [-110, 240]], 0.3); P(f, F, [[-150, 240], [150, 240], [170, 300], [-170, 300]], C.STONE, { sharp: true });
  f.part(F([...ell(c, 280, 90, 0, 40).slice(0, 21), ...ell(add(c, [0, 40]), 280, 90, 0, 40).slice(0, 21).reverse()]), { fill: mix(C.STONE, '#000', 0.25), shade: 0.3, inkW: 2, cast: true });
  P(f, F, ell(c, 280, 90, 0, 48), C.STONEL, { tex: T(f, 'mottle'), texOp: 1 });
  for (let k = 0; k <= 12; k++) { const a = Math.PI * (1 + k / 12); L(f, F, [add(c, [Math.cos(a) * 60, Math.sin(a) * 20]), add(c, [Math.cos(a) * 250, Math.sin(a) * 80])], 2.4, INK, { op: 0.75 }); L(f, F, [add(c, [Math.cos(a) * 258, Math.sin(a) * 83]), add(c, [Math.cos(a) * 270, Math.sin(a) * 86])], 5, INK); }
  f.flat(F([add(c, [0, 0]), add(c, [230, 40]), add(c, [240, 60]), add(c, [0, 10])]), '#16110e', { op: 0.6 });   // the shadow
  f.part(F([add(c, [-10, 0]), add(c, [10, 0]), add(c, [10, -150]), add(c, [-140, -10])]), { fill: C.BRONZE, shade: 0.4, inkW: 2, cast: false, sharp: true }); L(f, F, [add(c, [-136, -14]), add(c, [6, -146])], 3, '#f0e0b0', { op: 0.7 });
  D.chip(f, F([add(c, [-270, 20])])[0], 12, 1.6); D.bloom(f, F([add(c, [100, 40])])[0], 30, '#4a5a36', { n: 3, op: 0.45 }); D.crack(f, F([[40, 100]])[0], 1.4, 90, { n: 4 });
  return { focus: F([c])[0], sig: SB(F, [-285, -240, 285, 305]), feat: [], ells: [90 / 280] };
};
META.sundial = { act: 'turn', only: ['close', 'floor', 'niche'] };

O.orrery = (f, o = {}) => { // a brass orrery: a lamp-sun on its pillar, two crossed rings, small planets on arms, one planet passing before the sun (the eclipse)
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, -60];
  P(f, F, turned([[30, 40], [40, 120], [30, 200], [130, 260], [140, 280]], 0.22), C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 });
  for (const [rx, ry, a] of [[300, 90, -0.12], [220, 70, 0.3]]) { L(f, F, loop(ell(c, rx, ry, a, 40)), 16, INK); L(f, F, loop(ell(c, rx, ry, a, 40)), 10, C.BRONZE); L(f, F, ell(c, rx, ry, a, 40).slice(22, 32), 3, '#f0e0b0', { op: 0.6 }); }
  oval(f, F, c, 70, 70, '#c8a060', { shade: 0.35 }); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; L(f, F, [add(c, [Math.cos(a) * 74, Math.sin(a) * 74]), add(c, [Math.cos(a) * 96, Math.sin(a) * 96])], 6, C.BRONZE); }
  oval(f, F, add(c, [26, 10]), 50, 50, '#16110e', { shade: 0.2 });   // the dark body passing
  for (const [p, rr, col] of [[add(c, [-290, 30]), 34, '#6a7a84'], [add(c, [200, 60]), 26, '#7a5a44'], [add(c, [-120, -80]), 20, '#5a6044']]) { L(f, F, [c, p], 4, C.BRONZE); oval(f, F, p, rr, rr, col, { shade: 0.45, inkW: 1.6 }); f.flat(F(ell(add(p, [-rr * 0.3, -rr * 0.3]), rr * 0.3, rr * 0.25, 0, 8)), '#f0ece0', { op: 0.6 }); }
  D.bloom(f, F([[60, 200]])[0], 20, C.VERD, { n: 2, op: 0.5 }); D.chip(f, F([[120, 270]])[0], 8, 0);
  return { focus: F([c])[0], sig: SB(F, [-330, -170, 315, 285]), feat: [], ells: [0.3] };
};
META.orrery = { act: 'turn', noTurn: true, only: ['close', 'table', 'niche'] };

O.astrolabe = (f, o = {}) => { // a brass astrolabe hung from its ring: the thick round mater, the pierced star rete laid over it, the rule across, the throne at the top
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, 40], R = 220;
  ring(f, F, [0, -R - 80 + 40], 30, 30, 10, C.BRONZE); P(f, F, [[-60, c[1] - R - 50], [60, c[1] - R - 50], [80, c[1] - R + 10], [-80, c[1] - R + 10]], C.BRONZE, { dress: false });
  P(f, F, ell(add(c, [8, 10]), R, R, 0, 44), mix(C.BRONZE, '#000', 0.35), { dress: false }); P(f, F, ell(c, R, R, 0, 44), C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 });
  oval(f, F, c, R * 0.84, R * 0.84, '#3a3428', { shade: 0.3 }); for (let k = 0; k < 24; k++) { const a = k / 24 * 6.28; L(f, F, [add(c, [Math.cos(a) * R * 0.86, Math.sin(a) * R * 0.86]), add(c, [Math.cos(a) * R * 0.96, Math.sin(a) * R * 0.96])], k % 2 ? 2 : 4, INK); }
  for (let k = 0; k < 4; k++) L(f, F, loop(ell(add(c, [0, 30 - k * 20]), R * (0.7 - k * 0.12), R * (0.5 - k * 0.08), 0, 30)), 2, '#9a8a64', { op: 0.8 });   // the plate's almucantars
  L(f, F, loop(ell(add(c, [40, -20]), 130, 120, 0, 30)), 10, INK); L(f, F, loop(ell(add(c, [40, -20]), 130, 120, 0, 30)), 6, C.BRONZE);   // the rete's ecliptic ring
  for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28 + 0.3, p = add(c, [Math.cos(a) * 150, Math.sin(a) * 150]); L(f, F, [c, p], 5, C.BRONZE); f.part(F([p, add(p, [10 * Math.cos(a + 1.6), 10 * Math.sin(a + 1.6)]), add(p, [26 * Math.cos(a), 26 * Math.sin(a)])]), { fill: C.BRONZE, shade: 0.3, inkW: 1.2, cast: false, sharp: true }); }   // star pointers
  tube(f, F, [add(c, [-R * 0.9, 60]), add(c, [R * 0.9, -60])], 18, '#a8946a'); oval(f, F, c, 16, 16, C.BRONZE); f.rivet(F([c])[0], 6, '#d8c8a0');
  L(f, F, ell(c, R - 6, R - 6, 0, 44).slice(24, 36), 6, '#f0e0b0', { op: 0.5 }); D.bloom(f, F([add(c, [120, 140])])[0], 22, C.VERD, { n: 3, op: 0.5 }); D.chip(f, F([add(c, [-R + 10, 60])])[0], 8, 1.6);
  return { focus: F([c])[0], sig: SB(F, [-225, c[1] - R - 90, 230, c[1] + R + 12]), hook: F([[0, -R - 70]])[0], feat: [], ells: [] };
};
META.astrolabe = { act: 'turn', only: ['close', 'niche', 'table'] };

O.blindfold = (f, o = {}) => { // the Oracle's blindfold: a band of undyed linen knotted at the back, long tails hanging, an eye painted on its front in dark ink
  const F = frame([0, 0], o.ang ?? -0.05, 1), r = f.r;
  const band = [[-320, -110], [-160, -150], [0, -160], [160, -150], [320, -110], [330, 20], [160, -10], [0, -20], [-160, -10], [-330, 30]]; P(f, F, band, C.LINEN, { tex: T(f, 'weave'), texOp: 1 }); grain(f, F, band, 0.25, 9, 0.1);
  for (let k = 0; k < 4; k++) L(f, F, [[-310, -80 + k * 26], [-150, -116 + k * 30], [0, -128 + k * 32], [150, -116 + k * 30], [310, -80 + k * 26]], 2, '#8a826e', { op: 0.6 });   // folds along the band
  const eye = [[-130, -80], [-60, -130], [60, -130], [130, -80], [60, -36], [-60, -36]]; f.part(F(eye), { fill: '#f0ece0', shade: 0.25, inkW: 3.4, cast: false });
  oval(f, F, [0, -84], 44, 44, '#2a2234'); oval(f, F, [0, -84], 18, 18, '#0a0808'); f.flat(F(ell([-14, -98], 9, 7, 0, 8)), '#ffffff', { op: 0.9 });
  for (let k = 0; k < 7; k++) L(f, F, [[-110 + k * 36, -126 + Math.abs(k - 3) * 6], [-118 + k * 38, -160 + Math.abs(k - 3) * 6]], 3, INK);   // painted lashes
  oval(f, F, [340, -40], 50, 44, C.LINEN, { shade: 0.45, tex: T(f, 'weave'), texOp: 0.8 });
  for (const [a, b] of [[[350, -20], [300, 250]], [[370, -20], [420, 280]]]) { const t = sweep([a, lerp(a, b, 0.5).map((v, i) => v + (i ? 0 : 20)), b], 50, 34); P(f, F, t.poly, C.LINEN, { tex: T(f, 'weave'), texOp: 1 }); grain(f, F, t.poly, 0.25, 9); }
  D.stain(f, F([[-200, -40]])[0], 34, '#5a4a30', { op: 0.35 }); D.stain(f, F([[200, -70]])[0], 24, '#3a2a44', { op: 0.3 });
  return { focus: F([[0, -84]])[0], sig: SB(F, [-335, -165, 430, 290]), feat: [], ells: [] };
};
META.blindfold = { act: 'drip', only: ['close', 'table', 'niche'] };

O.weathervane = (f, o = {}) => { // an iron weathervane: a cockerel cut from sheet iron on a spindle over the four arms of the compass, swinging round
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  tube(f, F, [[0, 330], [0, -100]], 26, C.IRON);
  for (const [dx, dy, ch] of [[-200, 140, 'W'], [200, 140, 'E'], [-90, 200, 'S'], [90, 80, 'N']]) { L(f, F, [[0, 140], [dx * 0.9, 140 + (dy - 140) * 0.4]], 10, INK); L(f, F, [[0, 140], [dx * 0.9, 140 + (dy - 140) * 0.4]], 6, C.IRON); }
  for (const [x, y] of [[-200, 140], [200, 140]]) f.part(F([[x - 20, y - 26], [x + 20, y - 26], [x, y + 20]]), { fill: C.IRON, shade: 0.4, inkW: 1.6, cast: false, sharp: true });
  oval(f, F, [0, -100], 26, 26, C.IRON);
  const bird = [[-200, -140], [-150, -230], [-100, -170], [-40, -200], [20, -300], [60, -330], [100, -300], [90, -260], [130, -250], [90, -230], [110, -180], [60, -120], [-60, -110], [-150, -100]];
  D.slab(f, F(bird), [8, 6]); P(f, F, bird, '#4a4c50', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, bird, 0.3, 10);
  for (let k = 0; k < 4; k++) L(f, F, [[-180 + k * 14, -150 + k * 10], [-140 + k * 10, -220 + k * 14]], 3, '#2a2a2c');   // the tail's feathers cut out
  f.part(F([[60, -330], [80, -360], [100, -340], [96, -320]]), { fill: '#5c0f0b', shade: 0.3, inkW: 1.2, cast: false }); oval(f, F, [70, -290], 8, 8, '#d8d8d0');   // comb, eye
  lit(f, F, [[-150, -230], [20, -300], [60, -330]], 4, 0.55); D.bloom(f, F([[-40, -150]])[0], 30, C.RUST, { n: 4 }); D.bloom(f, F([[0, 200]])[0], 16, C.RUST, { n: 2 });
  return { focus: F([[-20, -200]])[0], sig: SB(F, [-210, -365, 215, 220]), feat: [], ells: [] };
};
META.weathervane = { act: 'turn', only: ['close', 'niche'] };

O.birdskull = (f, o = {}) => { // a crow's skull charm on red thread: a long beak and big empty eye socket, the thread knotted round it and hanging with a knucklebone bead
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r, BN = '#d8ccb0';
  L(f, F, [[-120, -380], [-60, -120]], 7, INK); L(f, F, [[-120, -380], [-60, -120]], 4, RED);
  const cran = ell([-60, -20], 160, 130, 0, 36); P(f, F, cran, BN, { tex: T(f, 'mottle'), texOp: 1 }); shadeR(f, F, cran, -20, 100, -150, 110, 10, { op: 0.45 });
  const beak = [[60, -80], [200, -40], [400, 20], [420, 40], [380, 50], [200, 50], [70, 60]]; P(f, F, beak, mix(BN, '#5a4a30', 0.2), { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, [[70, 0], [380, 36]], 3, INK, { op: 0.8 });
  f.part(F(ell([-30, -30], 64, 58, 0, 24)), { fill: '#120c08', shade: 0.1, inkW: 2.4, cast: false, hatch: false }); f.part(F(ell([80, 20], 18, 12, 0.2, 12)), { fill: '#120c08', shade: 0.1, inkW: 1.4, cast: false, hatch: false });
  for (let i = 0; i < 6; i++) L(f, F, [[-140 + i * 8, -80 + i * 20], [-100 + i * 8, -100 + i * 20]], 6, RED);   // the thread wound round
  L(f, F, [[-120, 60], [-140, 200], [-110, 300]], 7, INK); L(f, F, [[-120, 60], [-140, 200], [-110, 300]], 4, RED); oval(f, F, [-110, 320], 40, 26, BN, { shade: 0.45 });
  D.crack(f, F([[-120, -90]])[0], 0.7, 60, { n: 3 }); D.stain(f, F([[0, 60]])[0], 24, '#5a4a30');
  return { focus: F([[0, -20]])[0], sig: SB(F, [-225, -160, 425, 345]), hook: F([[-120, -378]])[0], feat: [], ells: [] };
};
META.birdskull = { act: 'swing', only: ['close', 'table', 'niche'] };

O.waxtablet = (f, o = {}) => { // the Fatebinder's wax tablet: a hinged pair of oak boards, the dark wax inside, one red word cut into it, the bone stylus laid across
  const F = frame([0, 0], o.ang ?? -0.08, 1), r = f.r;
  for (const [x0, k] of [[-330, 0], [10, 1]]) { const b = [[x0, -230, 1], [x0 + 320, -230 + k * 10, 1], [x0 + 320, 220 + k * 14, 1], [x0, 220, 1]]; D.slab(f, F(b), [10, 12]); P(f, F, b, C.OAKL, { tex: T(f, 'wood'), texOp: 1 });
    const w = [[x0 + 30, -200, 1], [x0 + 290, -200 + k * 10, 1], [x0 + 290, 190 + k * 12, 1], [x0 + 30, 190, 1]]; f.part(F(w), { fill: '#3a2e1e', shade: 0.3, inkW: 2, cast: false, tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, w, 0.3, 10, 0.2, '#6a5a3a');
    for (let i = 0; i < 6; i++) L(f, F, [[x0 + 50, -170 + i * 60], [x0 + 270, -170 + i * 60 + k * 8]], 3, '#8a7a5a', { op: 0.7, dash: `${16 + (i * 7) % 20} 6 8 5` }); }
  L(f, F, [[60, -60], [100, -100], [150, -40], [200, -100], [250, -60]], 9, RED);   // the one red word
  for (const y of [-160, 150]) { P(f, F, [[-12, y], [22, y], [22, y + 40], [-12, y + 40]], C.IRON, { dress: false }); f.rivet(F([[5, y + 20]])[0], 4, '#c8c8c4'); }
  tube(f, F, [[-300, 260], [200, 120]], 18, '#d8ccb0'); f.part(F([[200, 120], [270, 96], [206, 132]]), { fill: '#d8ccb0', shade: 0.3, inkW: 1.4, cast: false, sharp: true });
  D.chip(f, F([[-330, 0]])[0], 9, 1.6); D.crack(f, F([[-150, 210]])[0], 0.1, 60, { n: 3 });
  return { focus: F([[150, -70]])[0], sig: SB(F, [-335, -240, 345, 265]), feat: [], ells: [] };
};
META.waxtablet = { act: 'press', only: ['close', 'table', 'ledge', 'niche'] };

O.tapestry = (f, o = {}) => { // a hanging tapestry on its pole: a woven red-bordered field of the company's deeds in blocky figures, the hem fringed and frayed, deep folds
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  tube(f, F, [[-330, -290], [330, -290]], 26, C.OAK); for (const x of [-340, 340]) oval(f, F, [x, -290], 24, 24, C.OAKL);
  const cloth = [[-290, -280], [290, -280], [300, 240], [200, 260], [100, 236], [0, 262], [-100, 236], [-200, 260], [-300, 240]];
  P(f, F, cloth.map(p => [p[0], p[1], 1]), '#6a4a3a', { tex: T(f, 'weave'), texOp: 1 }); grain(f, F, cloth, 0.3, 8, 0);
  f.part(F([[-250, -240], [250, -240], [256, 200], [-256, 200]]), { fill: '#4a4a3a', shade: 0.4, inkW: 1.6, cast: false, tex: T(f, 'weave'), texOp: 1 });
  L(f, F, [[-270, -260], [270, -260], [276, 220], [-276, 220], [-270, -260]], 14, RED, { op: 0.9, straight: true });
  for (const [x, col] of [[-170, '#c8bca0'], [-40, '#8a8270'], [90, '#c8bca0'], [200, '#6a7a84']]) { f.part(F([[x - 30, -60], [x + 30, -60], [x + 40, 140], [x - 40, 140]]), { fill: col, shade: 0.4, inkW: 1.4, cast: false }); oval(f, F, [x, -100], 26, 30, col, { inkW: 1.4 }); L(f, F, [[x + 30, -40], [x + 70, -160]], 6, '#3a3a3c'); }   // the figures, weapons raised
  for (let k = 0; k < 5; k++) L(f, F, [[-230 + k * 110, -200], [-220 + k * 110, 180]], 9, '#2a2018', { op: 0.35 });   // folds
  for (let i = 0; i < 30; i++) { const x = -290 + i * 20; L(f, F, [[x, 246 + (i % 5) * 3], [x + 2, 290 + (i % 3) * 10]], 3, '#8a7a5a'); }
  D.stain(f, F([[150, 100]])[0], 50, '#2a1a0c', { op: 0.35 });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-345, -315, 345, 300]), hook: F([[0, -300]])[0], feat: [], ells: [] };
};
META.tapestry = { act: 'drip', only: ['close', 'niche'] };

module.exports = { O, META };
