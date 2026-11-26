// The card object library, part nine: the variety pass for the Hexweaver (L58). Its cards drew 11 on the bell and 16 on
// the mirror, so the Doomsayer, the Mirrorhex and the Pactbound get their own things: a bell on a crook staff, a wheel of
// bells, a candle snuffer, a standing cheval glass, a witch ball, a scrying bowl, a goat's skull, a rowan cross, a grave
// spade and a bearded witch bottle full of pins. Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, SIX, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR } = require('./objects6').helpers;
const O = {}, META = {};
const inkOf = o => INKS[o.course] || '#1e1612';
// a small bronze bell, mouth down: used on the staff and the wheel
function bellAt(f, F, c, s, o = {}) {
  const G = frame(F([c])[0], 0, s), BR = o.col || '#7a6a48';
  const prof = turned([[20, -100], [44, -90], [56, -40], [70, 30], [100, 80], [104, 96]], 0.22); f.part(G(prof), { fill: BR, shade: 0.45, inkW: 2 / Math.max(0.5, s), cast: true, tex: T(f, 'mottle'), texOp: 0.7 });
  f.line(G([[-40, -70], [-52, 0], [-80, 70]]), 6, '#e8d8a8', { op: 0.5 }); f.part(G(ell([0, 96], 100, 22, 0, 24)), { fill: '#120c08', shade: 0.1, inkW: 1.6, cast: false, hatch: false });
  f.line(G(ell([0, 92], 100, 20, 0, 24).slice(0, 13)), 4, '#c8b080', { op: 0.6 }); f.part(G(ell([10, 110], 14, 14, 0, 10)), { fill: '#3a3a3c', shade: 0.4, inkW: 1.2, cast: false });
  f.part(G([[-18, -100], [18, -100], [14, -130], [-14, -130]]), { fill: BR, shade: 0.4, inkW: 1.4, cast: false });
}

O.staffbell = (f, o = {}) => { // the Doomsayer's bell staff: a tall blackthorn crook, a bronze bell hung from the crook's end on an iron link, the staff's foot shod in iron
  const F = frame([0, 0], o.ang ?? -0.12, 1), r = f.r;
  const st = [[-60, 420], [-50, 100], [-40, -200], [-20, -330], [60, -400], [160, -390], [210, -320], [200, -250]]; tube(f, F, st, 40, '#3a2a22'); for (let i = 0; i < 6; i++) { const p = K.catmull(st, 3)[2 + i * 2]; if (p) f.part(F(ell(add(p, [18, 0]), 10, 6, 0.6, 8)), { fill: '#3a2a22', shade: 0.4, inkW: 1.2, cast: false }); }   // the thorns' stubs
  P(f, F, [[-82, 380], [-38, 380], [-40, 430], [-80, 430]], C.IRON, { dress: false });
  ring(f, F, [200, -228], 16, 22, 7, C.IRON); bellAt(f, F, [200, -80], 1.5);
  for (let i = 0; i < 3; i++) { const y = -60 + i * 60; tube(f, F, [[-48, y], [-120, y + 30 + i * 10], [-140, y + 90 + i * 20]], 6, i === 1 ? '#5c0f0b' : '#2a2a2a', { lit: false }); }   // black and red rags tied on
  D.bloom(f, F([[240, 0]])[0], 24, C.VERD, { n: 3, op: 0.5 }); D.chip(f, F([[-50, 200]])[0], 8, 0);
  return { focus: F([[200, -60]])[0], sig: SB(F, [-160, -410, 360, 120]), grip: { c: F([[-46, 150]])[0], thumb: (o.ang ?? -0.12) - Math.PI / 2 }, feat: [], ells: [0.22] };
};
META.staffbell = { act: 'ring' };

O.bellwheel = (f, o = {}) => { // a sanctus wheel: an iron-bound oak wheel on its wall bracket, bronze bells hung all round its rim, turned to ring them all together
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, -40], R = 220;
  tube(f, F, [[0, 300], [0, -40]], 34, C.OAK); P(f, F, [[-120, 290], [120, 290], [140, 340], [-140, 340]], C.OAK, { sharp: true });
  L(f, F, loop(ell(c, R, R * 0.4, 0, 40)), 30, INK); L(f, F, loop(ell(c, R, R * 0.4, 0, 40)), 22, C.OAKL); L(f, F, ell(c, R, R * 0.4, 0, 40).slice(20, 34), 4, '#c8a878', { op: 0.6 });
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; L(f, F, [c, add(c, [Math.cos(a) * R, Math.sin(a) * R * 0.4])], 12, C.OAK); }
  oval(f, F, c, 40, 20, C.IRON); f.rivet(F([c])[0], 6, '#c8c8c4');
  const pos = []; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + 0.2; pos.push([add(c, [Math.cos(a) * R, Math.sin(a) * R * 0.4]), Math.sin(a)]); }
  pos.sort((a, b) => a[1] - b[1]).forEach(([p, z]) => { L(f, F, [p, add(p, [0, 40])], 5, INK); bellAt(f, F, add(p, [0, 100]), 0.55 + z * 0.08); });
  D.chip(f, F([[-200, -40]])[0], 9, 0); D.bloom(f, F([[100, 60]])[0], 20, C.VERD, { n: 2, op: 0.5 });
  return { focus: F([c])[0], sig: SB(F, [-280, -160, 280, 345]), feat: [], ells: [0.4] };
};
META.bellwheel = { act: 'ring', noTurn: true, only: ['close', 'niche', 'floor'] };

O.snuffer = (f, o = {}) => { // a candle snuffer brought down on a black tallow candle: a pierced brass cone on a long handle, the wick's last smoke escaping round it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-70, -40], [70, -40], [74, 280], [-74, 280]], '#2a2622', { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 0; i < 4; i++) L(f, F, [[-60 + i * 36, -30], [-56 + i * 30, 40 + i * 30], [-58 + i * 34, 90 + i * 40]], 8, '#3a3632', { op: 0.9 });   // the runs of black tallow
  oval(f, F, [0, -40], 70, 18, '#3a3632'); lit(f, F, [[-62, -20], [-66, 260]], 5, 0.35);
  P(f, F, [[-200, 280], [200, 280], [180, 330], [-180, 330]], C.BRONZE, { dress: false }); oval(f, F, [0, 280], 200, 40, mix(C.BRONZE, '#fff', 0.15));   // the drip pan
  const cone = turned([[16, -260], [40, -200], [80, -100], [110, -30]], 0.22); P(f, F, cone, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); oval(f, F, [0, -30], 110, 24, '#120c08');
  for (let i = 0; i < 5; i++) f.part(F(ell([-50 + i * 25, -120 + (i % 2) * 30], 6, 8, 0, 8)), { fill: '#120c08', shade: 0.1, inkW: 0.8, cast: false, hatch: false });
  tube(f, F, [[40, -200], [200, -330], [360, -440]], 16, C.BRONZE); oval(f, F, [380, -456], 30, 24, C.BRONZE);
  L(f, F, [[-70, -180], [-100, -60]], 6, '#f0e0b0', { op: 0.5 }); D.bloom(f, F([[60, -100]])[0], 16, C.VERD, { n: 2, op: 0.5 }); D.chip(f, F([[150, 300]])[0], 8, 0);
  K.fxReq(f, 'steam', F([[-90, -60]])[0], 120, { col: '#8a8478' }); K.fxReq(f, 'steam', F([[100, -50]])[0], 90, { col: '#8a8478' });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-205, -470, 410, 335]), feat: ['steam'], ells: [24 / 110, 0.22, 40 / 200] };
};
META.snuffer = { act: 'press', noTurn: true, only: ['close', 'ledge', 'table', 'niche'] };

O.chevalmirror = (f, o = {}) => { // a tall cheval glass on its swinging frame: two turned posts on splayed feet, the glass tilted, cracked across, a face that is not the viewer's in it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const s of [-1, 1]) { tube(f, F, [[s * 230, -330], [s * 230, 300]], 30, C.OAK); tube(f, F, [[s * 230, 300], [s * 320, 340]], 26, C.OAK); tube(f, F, [[s * 230, 300], [s * 150, 340]], 26, C.OAK); oval(f, F, [s * 230, -340], 24, 24, C.OAKL); }
  const fr = [[-200, -300, 1], [200, -300, 1], [210, 230, 1], [-190, 230, 1]]; D.slab(f, F(fr), [10, 10]); P(f, F, fr, '#4a3222', { tex: T(f, 'wood'), texOp: 1 });
  const gl = fr.map(([x, y]) => [x * 0.84, y * 0.9 - 6, 1]); f.part(F(gl), { fill: '#8a949a', shade: 0.3, inkW: 2, cast: false, tex: T(f, 'mottle'), texOp: 0.8 });
  for (let i = 0; i < 4; i++) L(f, F, [[-150 + i * 40, -250], [-30 + i * 40, 180]], 10 - i * 2, '#e8ecee', { op: 0.35 });
  f.part(F(ell([20, -60], 70, 90, 0, 22)), { fill: '#5a606a', shade: 0.3, inkW: 1.2, cast: false, opacity: 0.7 }); for (const x of [-4, 44]) f.part(F(ell([x, -70], 9, 5, 0, 8)), { fill: '#16110e', shade: 0.1, inkW: 0.8, cast: false });   // the face in the glass
  D.crack(f, F([[-160, -200]])[0], 0.9, 360, { n: 8, w: 2.6 }); D.crack(f, F([[60, -10]])[0], 2.2, 140, { n: 5 });
  for (const s of [-1, 1]) f.rivet(F([[s * 216, -40]])[0], 9, '#8a7a5a');
  D.bloom(f, F([[120, 120]])[0], 30, '#2a2a2a', { n: 3, op: 0.4 }); D.chip(f, F([[-200, 0]])[0], 8, 1.6);
  return { focus: F([[0, -40]])[0], sig: SB(F, [-330, -360, 330, 345]), feat: ['crack'], ells: [] };
};
META.chevalmirror = { act: 'crack', only: ['close', 'floor', 'niche'] };

O.witchball = (f, o = {}) => { // a witch ball hung in a window to turn curses back: a great silvered glass sphere on a cord, the room bent round in it, a dark star of a crack
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, 40], R = 230;
  L(f, F, [[0, -380], [0, -220]], 7, INK); L(f, F, [[0, -380], [0, -220]], 4, '#2a2a2a'); P(f, F, [[-30, -230], [30, -230], [26, -180], [-26, -180]], '#5a5c60', { dress: false }); ring(f, F, [0, -246], 16, 12, 6, '#5a5c60');
  P(f, F, ell(c, R, R, 0, 48), '#7a848c', { tex: T(f, 'mottle'), texOp: 0.6 });
  f.flat(F([...ell(c, R - 6, R - 6, 0, 48).slice(26, 46), add(c, [0, 30])]), '#3a3e44', { op: 0.6 });   // the room reflected in a band of dark
  for (let k = 0; k < 4; k++) L(f, F, ell(c, R * (0.86 - k * 0.12), R * (0.5 - k * 0.06), 0, 40).slice(0, 21), 2, '#2a2e34', { op: 0.6 });
  for (let i = 0; i < 5; i++) { const x = -150 + i * 70; L(f, F, [add(c, [x * 0.9, -100 + Math.abs(x) * 0.4]), add(c, [x, 80 - Math.abs(x) * 0.3])], 4, '#c8ccd0', { op: 0.5 }); }   // the bent window bars
  f.flat(F(ell(add(c, [-90, -110]), 60, 36, -0.6, 18)), '#f8fafc', { op: 0.8 }); f.flat(F(ell(add(c, [-40, -150]), 16, 10, -0.6, 10)), '#ffffff', { op: 0.9 });
  ring(f, F, c, R, R, 3, '#4a5058');
  D.crack(f, F([add(c, [80, 60])])[0], -2, 90, { n: 4 }); D.crack(f, F([add(c, [80, 60])])[0], 0.6, 100, { n: 4 }); D.crack(f, F([add(c, [80, 60])])[0], 2.4, 70, { n: 3 });
  return { focus: F([c])[0], sig: SB(F, [-235, -385, 235, 275]), hook: F([[0, -378]])[0], feat: ['crack'], ells: [] };
};
META.witchball = { act: 'glare', noTurn: true, only: ['close', 'niche'] };

O.scryingbowl = (f, o = {}) => { // a black scrying bowl on a tripod: a wide dark bronze bowl brimming with still black water, a pale face of light on it, rings spreading
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = inkOf(o);
  for (const x of [-180, 0, 180]) tube(f, F, [[x * 0.7, 60], [x, 300]], 22, C.IRON);
  const bowl = turned([[300, -60], [290, -10], [240, 50], [150, 90], [60, 100]], 0.22); P(f, F, bowl, '#4a4030', { tex: T(f, 'mottle'), texOp: 1 }); shadeR(f, F, bowl, 120, 300, -60, 110, 12, { op: 0.5 });
  for (let i = 0; i < 8; i++) { const a = 0.2 + i * 0.34; f.part(F(ell([-Math.cos(a) * 250, 10 + Math.sin(a) * 30], 10, 8, 0, 8)), { fill: '#6a5a3a', shade: 0.4, inkW: 1, cast: false }); }   // studs
  oval(f, F, [0, -60], 300, 66, '#5a5040'); oval(f, F, [0, -56], 276, 54, mix(ink, '#0a0a0c', 0.7), { shade: 0.15 });
  for (let k = 1; k < 4; k++) L(f, F, loop(ell([40, -50], 60 * k, 13 * k, 0, 30)), 1.8, '#8a92a0', { op: 0.6 - k * 0.12 });
  f.flat(F(ell([40, -50], 44, 12, 0, 16)), '#d8dce4', { op: 0.6 }); L(f, F, ell([0, -60], 290, 62, 0, 40).slice(22, 34), 5, '#c8b890', { op: 0.5 });
  D.chip(f, F([[-280, -40]])[0], 9, 0); D.bloom(f, F([[100, 60]])[0], 24, C.VERD, { n: 3, op: 0.45 });
  return { focus: F([[40, -50]])[0], sig: SB(F, [-305, -130, 305, 305]), feat: ['contents'], ells: [66 / 300, 54 / 276, 0.22] };
};
META.scryingbowl = { act: 'glare', only: ['close', 'floor', 'niche', 'ledge'] };

O.ramskull = (f, o = {}) => { // a goat's skull, the scapegoat's: long face of bone, empty sockets, the horns curling back and round, a red thread wound round one horn
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, BN = '#d4c8a8';
  for (const s of [-1, 1]) { const h = sweep([[s * 60, -200], [s * 170, -290], [s * 300, -250], [s * 330, -120], [s * 260, -30], [s * 190, -90]], 110, 34); P(f, F, h.poly, '#8a7a5a', { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 2; i < h.c.length - 2; i += 2) L(f, F, [h.A[i], h.B[i]], 2.4, '#3a2e1e', { op: 0.65 }); L(f, F, h.A.slice(1, -3), 5, '#e8dcc0', { op: 0.45 }); }
  const face = [[-130, -220], [130, -220], [150, -120], [110, 40], [70, 200], [40, 300], [-40, 300], [-70, 200], [-110, 40], [-150, -120]]; P(f, F, face, BN, { tex: T(f, 'mottle'), texOp: 1 });
  shadeR(f, F, face, 30, 150, -220, 300, 12, { op: 0.45 });
  for (const s of [-1, 1]) f.part(F([[s * 30, -110], [s * 120, -130], [s * 110, -40], [s * 50, -40]]), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false });   // sockets
  f.part(F([[-30, 180], [30, 180], [20, 250], [-20, 250]]), { fill: '#16110e', shade: 0.1, inkW: 1.6, cast: false, hatch: false });
  for (let i = 0; i < 5; i++) L(f, F, [[-50 + i * 25, 300], [-48 + i * 25, 320]], 6, '#c8bc98');
  L(f, F, [[0, -220], [6, 60], [0, 170]], 2, INK, { op: 0.6 }); D.crack(f, F([[60, 0]])[0], 1.2, 80, { n: 4 });
  for (let i = 0; i < 5; i++) L(f, F, [[-170 - i * 18, -250 + i * 22], [-130 - i * 18, -300 + i * 22]], 5, '#5c0f0b');   // the red thread
  D.stain(f, F([[-40, 100]])[0], 30, '#5a4a30');
  return { focus: F([[0, -80]])[0], sig: SB(F, [-340, -310, 340, 325]), feat: [], ells: [] };
};
META.ramskull = { act: 'crack', only: ['close', 'niche', 'ledge', 'floor'] };

O.rowan = (f, o = {}) => { // a rowan cross charm: two forked rowan twigs bound across each other with red thread, red berries still on one end, hung from a nail
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, BK = '#6a5040';
  tube(f, F, [[0, -330], [0, 330]], 56, BK); tube(f, F, [[-300, -30], [300, -50]], 50, BK);
  for (const [a, b] of [[[0, 260], [-70, 340]], [[0, 260], [60, 350]], [[260, -48], [330, -110]], [[260, -48], [330, 10]], [[-260, -32], [-320, 30]]]) tube(f, F, [a, b], 16, BK, { lit: false });
  for (let i = 0; i < 10; i++) L(f, F, [[-40 + (i % 2) * 6, -80 + i * 10], [40 - (i % 2) * 6, -20 + i * 6 - 60]], 6, '#5c0f0b');   // the binding
  L(f, F, [[-40, -10], [50, -90]], 7, '#5c0f0b'); L(f, F, [[-40, -90], [50, -10]], 7, '#5c0f0b');
  for (let i = 0; i < 9; i++) { const c = [-320 + (i % 3) * 22 + (i > 5 ? 10 : 0), 50 + Math.floor(i / 3) * 22]; oval(f, F, c, 13, 13, '#7a2418', { shade: 0.4, inkW: 1.2 }); f.flat(F(ell(add(c, [-4, -4]), 4, 3, 0, 6)), '#e8a090', { op: 0.8 }); }
  for (const [x, y] of [[100, -300], [-120, 200]]) f.part(F(ell([x, y], 40, 14, 0.7, 12)), { fill: '#5a6a3a', shade: 0.4, inkW: 1.2, cast: false });   // a leaf left on
  oval(f, F, [0, -340], 14, 14, C.IRON); L(f, F, [[0, -340], [0, -390]], 8, C.IRON);
  for (let i = 0; i < 8; i++) L(f, F, [[-10 + (i % 2) * 20, -300 + i * 70], [10 - (i % 2) * 20, -290 + i * 70]], 2, '#3a2a1e', { op: 0.6 });
  return { focus: F([[0, -50]])[0], sig: SB(F, [-335, -390, 335, 355]), hook: F([[0, -388]])[0], feat: [], ells: [] };
};
META.rowan = { act: 'swing', only: ['close', 'niche'] };

O.spade = (f, o = {}) => { // a gravedigger's spade driven into a heap of dark grave earth: an iron-shod oak blade, a long shaft with a T grip, clods falling
  const F = frame([0, 0], o.ang ?? -0.08, 1), r = f.r;
  const heap = [[-330, 320], [-240, 200], [-100, 140], [60, 150], [220, 190], [330, 320]]; P(f, F, heap, '#3a2e24', { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 0; i < 14; i++) f.part(F(ell([-260 + (i * 41) % 520, 200 + (i * 23) % 100], 18, 12, 0, 8)), { fill: i % 3 ? '#4a3a2e' : '#5a4a30', shade: 0.4, inkW: 1, cast: false });
  const blade = [[-120, -40, 1], [120, -40, 1], [110, 200, 1], [-110, 200, 1]]; D.slab(f, F(blade), [10, 6]); P(f, F, blade, C.OAKL, { tex: T(f, 'wood'), texOp: 1 });
  f.part(F([[-114, 120], [114, 120], [110, 200], [-110, 200]]), { fill: C.IRON, shade: 0.4, inkW: 1.6, cast: false }); for (const x of [-80, 0, 80]) f.rivet(F([[x, 140]])[0], 4, '#9a9a96');
  P(f, F, [[-50, -40], [50, -40], [30, -80], [-30, -80]], C.OAK, { dress: false }); tube(f, F, [[0, -80], [0, -400]], 40, C.OAK); tube(f, F, [[-90, -420], [90, -420]], 36, C.OAKL);
  P(f, F, [[-110, 180], [110, 180], [120, 240], [-120, 240]], '#3a2e24', { dress: false });   // the blade bitten into the earth
  lit(f, F, [[-110, -30], [-104, 120]], 5, 0.5); D.chip(f, F([[100, -40]])[0], 8, 0); D.crack(f, F([[40, 40]])[0], 1.5, 80, { n: 4 });
  for (let i = 0; i < 5; i++) f.part(F(ell([180 + i * 20, 80 + i * 26], 12, 9, 0, 8)), { fill: '#4a3a2e', shade: 0.4, inkW: 1, cast: false });   // clods falling
  return { focus: F([[0, 80]])[0], sig: SB(F, [-335, -445, 335, 325]), feat: [], ells: [] };
};
META.spade = { act: 'fling', only: ['close', 'floor'] };

O.witchbottle = (f, o = {}) => { // a witch bottle: a brown salt-glazed bellarmine jug with a bearded face on its neck, stoppered, its belly cracked to show the bent pins inside
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, GZ = '#7a5a36';
  const body = turned([[50, -300], [56, -260], [70, -200], [170, -120], [220, 0], [210, 140], [150, 230], [120, 250]], 0.22); P(f, F, body, GZ, { tex: T(f, 'mottle'), texOp: 1 });
  arcs(f, F, body, [-60, 0, 60, 120, 180], y => 215, 0.22, { op: 0.4 }); shadeR(f, F, body, 100, 220, -140, 240, 12, { op: 0.45 });
  for (let i = 0; i < 40; i++) f.flat(F(ell([-180 + (i * 47) % 360, -100 + (i * 31) % 320], 4, 3, 0, 6)), i % 2 ? '#a88a5a' : '#4a3420', { op: 0.6 });   // the glaze's pitting
  const face = [[-60, -210], [60, -210], [70, -120], [40, -60], [0, -40], [-40, -60], [-70, -120]]; f.part(F(face), { fill: mix(GZ, '#fff', 0.1), shade: 0.4, inkW: 1.8, cast: false });   // the bearded face
  for (const s of [-1, 1]) oval(f, F, [s * 24, -170], 10, 7, '#2a1a0c'); L(f, F, [[-20, -140], [0, -130], [20, -140]], 3, INK); for (let i = 0; i < 6; i++) L(f, F, [[-40 + i * 16, -120], [-30 + i * 12, -60]], 2.4, INK, { op: 0.7 });
  tube(f, F, [[56, -250], [130, -240], [150, -150], [120, -110]], 20, GZ);
  oval(f, F, [0, -300], 50, 12, '#3a2614'); P(f, F, [[-34, -300], [34, -300], [30, -350], [-30, -350]], '#8a6a44', { dress: false });
  const crack = [[40, 40], [140, 20], [180, 100], [120, 160], [50, 130]]; f.part(F(crack), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false });
  for (let i = 0; i < 7; i++) { const a = [60 + i * 16, 60 + (i % 3) * 20], b = add(a, [20 - (i % 2) * 30, 40]); L(f, F, [a, lerp(a, b, 0.6), add(b, [10, -6])], 3, '#c8c8c4'); }   // the bent pins
  D.chip(f, F([[-150, 200]])[0], 9, 0);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-225, -355, 225, 265]), feat: ['crack'], ells: [12 / 50, 0.22] };
};
META.witchbottle = { act: 'crack', only: ['close', 'ledge', 'floor', 'niche'] };

module.exports = { O, META };
