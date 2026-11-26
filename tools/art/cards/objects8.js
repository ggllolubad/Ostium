// The card object library, part eight: the variety pass for the Elementalist (L58). Its cards drew 18 of 41 on the scroll.
// Most of its cards are attuned: their art is redrawn in each of the six courses (`<id>~<course>`), so these objects hold
// or throw the course's ink (a nib, a quill, a pigment shell, a sigil stone, an inkhorn, an inkwell, the brass reservoir)
// and read differently in every course. Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, SIX, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR } = require('./objects6').helpers;
const { glass, cork } = require('./objects7').helpers;
const O = {}, META = {};
const inkOf = o => INKS[o.course] || '#1e1612';                   // the course's ink, pulled to ink (L14)
const wetOf = o => mix(inkOf(o), '#f0ece0', 0.35);                // its lit wet highlight

O.reedpen = (f, o = {}) => { // close on a cut reed pen: the split nib loaded with the course's ink, the stroke it has just laid running off under it
  const F = frame([0, 0], o.ang ?? -0.55, 1), r = f.r, ink = inkOf(o);
  const stroke = [[-120, 330], [-40, 260], [60, 200], [200, 170], [360, 180]]; L(f, F, stroke, 70, INK, { op: 0.9 }); L(f, F, stroke, 58, ink); L(f, F, stroke.map(p => add(p, [-4, -14])), 6, wetOf(o), { op: 0.5 });
  const shaft = [[-60, -340], [60, -340], [62, 40], [-62, 40]]; P(f, F, shaft, '#a09070', { tex: T(f, 'wood'), texOp: 0.8 }); for (const y of [-260, -120]) L(f, F, [[-62, y], [62, y + 4]], 6, '#6a5434'); lit(f, F, [[-48, -330], [-50, 30]], 6, 0.5);
  const nib = [[-62, 40], [62, 40], [40, 150], [6, 250], [-6, 250], [-40, 150]]; P(f, F, nib, '#c8b080', { sharp: true, tex: T(f, 'mottle'), texOp: 0.8 });
  f.part(F([[-48, 60], [48, 60], [30, 150], [4, 236], [-4, 236], [-30, 150]]), { fill: ink, shade: 0.3, inkW: 1.4, cast: false });   // the loaded ink
  L(f, F, [[0, 120], [0, 246]], 3, INK); oval(f, F, [0, 112], 8, 8, '#1a120c'); L(f, F, [[-30, 70], [-14, 180]], 4, wetOf(o), { op: 0.6 });
  D.crack(f, F([[20, -200]])[0], 1.5, 60, { n: 3 }); D.chip(f, F([[56, -300]])[0], 7, 0); D.stain(f, F([[0, -40]])[0], 30, ink, { op: 0.4 });
  K.fxReq(f, 'drip', F([[0, 252]])[0], 3, { col: ink });
  return { focus: F([[0, 150]])[0], sig: SB(F, [-80, -100, 80, 260]), grip: { c: F([[0, -200]])[0], thumb: (o.ang ?? -0.55) + Math.PI / 2 }, feat: ['contents'], ells: [] };
};
META.reedpen = { act: 'drip', ang: -0.55 };

O.quill = (f, o = {}) => { // a goose quill cut as a pen: a broad curved vane stripped near the barrel, the slit nib black-wet with the course's ink, a drop falling
  const F = frame([0, 0], o.ang ?? 0.5, 1), r = f.r, ink = inkOf(o);
  const rach = [[0, 330], [10, 140], [30, -60], [70, -230], [130, -360]];
  const vane = [[12, 120], [-90, 40], [-150, -80], [-150, -220], [-80, -330], [60, -370], [130, -360], [150, -280], [140, -160], [100, -40], [50, 80]];
  P(f, F, vane, '#d8d0bc', { tex: T(f, 'mottle'), texOp: 0.8, dressO: { op: 0.25 } });
  for (let i = 0; i < 16; i++) { const t = i / 16, p = lerp([12, 110], [120, -350], t); L(f, F, [p, add(p, [-120 + t * 30, -40 - t * 20])], 1.6, '#8a8270', { op: 0.6 }); L(f, F, [p, add(p, [50 - t * 10, -60])], 1.2, '#8a8270', { op: 0.5 }); }
  f.part(F([[-150, -150], [-100, -130], [-130, -100]]), { fill: '#3a3428', shade: 0.2, inkW: 1, cast: false }); f.part(F([[140, -200], [100, -190], [130, -230]]), { fill: '#3a3428', shade: 0.2, inkW: 1, cast: false });   // splits in the vane
  L(f, F, rach, 14, INK); L(f, F, rach, 9, '#f0e8d4');
  const nib = [[-16, 240], [16, 240], [6, 330], [0, 360], [-6, 330]]; f.part(F(nib), { fill: '#e8dcc0', shade: 0.3, inkW: 1.6, cast: false, sharp: true }); f.part(F([[-12, 290], [12, 290], [4, 340], [0, 358], [-4, 340]]), { fill: ink, shade: 0.2, inkW: 1, cast: false }); L(f, F, [[0, 300], [0, 356]], 1.6, INK);
  D.stain(f, F([[-40, -60]])[0], 30, '#5a4a30', { op: 0.25 });
  K.fxReq(f, 'drip', F([[0, 362]])[0], 3, { col: ink });
  return { focus: F([[0, 300]])[0], sig: SB(F, [-155, -375, 155, 365]), grip: { c: F([[6, 200]])[0], thumb: (o.ang ?? 0.5) + Math.PI / 2 }, feat: ['contents'], ells: [] };
};
META.quill = { act: 'drip', ang: 0.5 };

O.shell = (f, o = {}) => { // a scribe's mussel shell used as a paint dish: the ridged dark outside, the pearly hollow pooled with the course's ink, a dab of a second colour at the lip
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r, ink = inkOf(o);
  const out = [[-300, 40], [-260, -80], [-160, -170], [0, -200], [160, -170], [270, -90], [310, 30], [260, 120], [120, 170], [-60, 170], [-220, 130]];
  P(f, F, out, '#2e2a34', { tex: T(f, 'mottle'), texOp: 1 }); for (let k = 1; k < 6; k++) L(f, F, out.map(p => lerp(p, [-280, 120], k * 0.14)).slice(0, 8), 2.4, '#5a5664', { op: 0.6 });   // growth ridges
  const hol = out.map(p => lerp(p, [10, -20], 0.16)); f.part(F(hol), { fill: '#c8c4c8', shade: 0.35, inkW: 2, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
  for (let i = 0; i < 6; i++) L(f, F, [[-200 + i * 70, -120], [-150 + i * 60, 100]], 3, i % 2 ? '#e8e8f0' : '#a8a0b0', { op: 0.5 });   // nacre
  const pool = [[-200, 30], [-120, -60], [40, -90], [180, -40], [220, 50], [100, 110], [-100, 110]]; f.part(F(pool), { fill: ink, shade: 0.25, inkW: 1.6, cast: false }); L(f, F, [[-130, -30], [20, -60]], 6, wetOf(o), { op: 0.6 }); f.flat(F(ell([-60, 0], 40, 12, -0.2, 12)), '#f0f0f0', { op: 0.35 });
  f.part(F(ell([240, -60], 34, 20, 0.4, 14)), { fill: mix(SIX[(Math.round((o.variant || 0)) + 2) % 6], '#16110e', 0.4), shade: 0.3, inkW: 1.2, cast: false });
  L(f, F, [[-290, 30], [-250, -80], [-150, -165]], 5, '#a8a4b0', { op: 0.6 }); D.chip(f, F([[300, 30]])[0], 9, 0); D.chip(f, F([[-60, 168]])[0], 8, 0);
  K.fxReq(f, 'drip', F([[250, 110]])[0], 3, { col: ink });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-305, -205, 315, 175]), feat: ['contents'], ells: [] };
};
META.shell = { act: 'drip', only: ['close', 'table', 'ledge', 'floor'] };

O.firesteel = (f, o = {}) => { // a C-shaped fire steel struck down a flint: the curled iron striker, the grey-white flint flaked sharp, sparks of the course's ink flying
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r;
  const st = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * (0.15 + 1.7 * i / 16); st.push([Math.cos(a) * 220, -40 + Math.sin(a) * 120]); }
  L(f, F, st, 64, INK); L(f, F, st, 52, C.IRON); L(f, F, st.slice(8, 15).map(p => add(p, [0, -16])), 8, '#c8c8c4', { op: 0.55 });
  for (const s of [-1, 1]) { const c = add(st[s < 0 ? 0 : 16], [s * -6, 0]); oval(f, F, c, 40, 40, C.IRON); f.part(F(ell(c, 16, 16, 0, 10)), { fill: '#120c08', shade: 0.1, inkW: 1.4, cast: false, hatch: false }); }   // the curled ends
  const fl = [[-120, 120], [-60, 40], [40, 20], [140, 60], [170, 160], [100, 260], [-40, 270], [-130, 220]]; P(f, F, fl, '#b8b4a8', { sharp: true, tex: T(f, 'mottle'), texOp: 1 });
  for (const [a, b] of [[[-60, 40], [0, 160]], [[40, 20], [40, 150]], [[140, 60], [80, 160]], [[0, 160], [80, 160]], [[0, 160], [-40, 270]]]) L(f, F, [a, b], 2, INK, { op: 0.7 });
  f.part(F([[-60, 40], [40, 20], [40, 150], [0, 160]]), { fill: '#d8d4c8', shade: 0.3, inkW: 1.2, cast: false });
  D.bloom(f, F([[150, -100]])[0], 20, C.RUST, { n: 3 }); D.chip(f, F([[140, 170]])[0], 8, 0);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-260, -190, 260, 275]), feat: [], ells: [] };
};
META.firesteel = { act: 'burst', only: ['close', 'table', 'ledge'] };

O.sigilstone = (f, o = {}) => { // a round slate sigil stone, thick and chipped, a six-armed sigil painted on its face in the course's ink, still wet and running
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = inkOf(o), c = [0, 0], R = 230, ry = 190;
  f.part(F([...ell(c, R, ry, 0, 40).slice(0, 21), ...ell(add(c, [0, 50]), R, ry, 0, 40).slice(0, 21).reverse()]), { fill: '#2a2c30', shade: 0.3, inkW: 2, cast: true });
  P(f, F, ell(c, R, ry, 0, 48), '#4e525a', { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 0; i < 6; i++) L(f, F, [[-200 + i * 70, -120], [-190 + i * 70, 140]], 1.4, '#3a3c42', { op: 0.6 });   // the slate's grain
  L(f, F, ell(c, R - 10, ry - 10, 0, 48).slice(26, 40), 6, '#c8ccd4', { op: 0.5 });
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.3, p = add(c, [Math.cos(a) * 150, Math.sin(a) * 124]); L(f, F, [add(c, [Math.cos(a) * 30, Math.sin(a) * 24]), p], 26, ink); f.part(F(ell(p, 22, 18, 0, 12)), { fill: ink, shade: 0.2, inkW: 1.2, cast: false }); }
  L(f, F, loop(ell(c, 70, 58, 0, 24)), 20, ink); L(f, F, ell(c, 70, 58, 0, 24).slice(12, 20), 4, wetOf(o), { op: 0.6 });
  for (let i = 0; i < 3; i++) L(f, F, [add(c, [-100 + i * 90, 40]), add(c, [-96 + i * 90, 160 + i * 12])], 7, ink, { op: 0.8 });   // the wet runs
  D.chip(f, F([[-R + 10, 30]])[0], 14, 1.6); D.chip(f, F([[120, -ry + 14]])[0], 12, 0); D.crack(f, F([[100, 80]])[0], 0.8, 80, { n: 4 });
  return { focus: F([c])[0], sig: SB(F, [-235, -195, 235, 245]), feat: ['contents'], ells: [ry / R] };
};
META.sigilstone = { act: 'drip', only: ['close', 'ledge', 'table', 'floor', 'niche'] };

O.inkhorn = (f, o = {}) => { // a scribe's inkhorn on its cord with the pen case: a curved cow horn plugged with a wooden base, its mouth brimming with the course's ink
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = inkOf(o);
  const S = sweep([[-40, 270], [-60, 120], [-30, -40], [40, -170]], 90, 170, t => 90 + 80 * t);
  P(f, F, S.poly, '#9a7a54', { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, S.A.slice(2, -2), 8, '#f0dcb8', { op: 0.45 });
  for (let i = 0; i < 6; i++) { const k = 3 + i * 3; if (k < S.c.length) L(f, F, [S.A[k], lerp(S.A[k], S.B[k], 0.5), S.B[k]], 2, '#4a3420', { op: 0.55 }); }
  const e = S.c[S.c.length - 1], d = norm(sub(e, S.c[S.c.length - 3])), ang = Math.atan2(d[1], d[0]) + Math.PI / 2;
  oval(f, F, e, 86, 30, '#7a5a3a', { a: ang }); oval(f, F, e, 72, 22, ink, { a: ang, shade: 0.2 }); f.flat(F(ell(add(e, [-14, -6]), 26, 6, ang, 10)), wetOf(o), { op: 0.6 });
  oval(f, F, [-40, 270], 48, 20, C.OAKL); for (const t of [0.3, 0.7]) { const k = Math.round(t * (S.c.length - 1)), a = S.A[k], b = S.B[k]; L(f, F, [a, b], 14, INK); L(f, F, [a, b], 8, C.BRONZE); }
  const pc = [[60, 280], [200, -40], [250, -20], [110, 300]]; D.slab(f, F(pc), [8, 6]); P(f, F, pc, '#5a3e28', { tex: T(f, 'mottle'), texOp: 1 }); oval(f, F, [225, -30], 26, 10, '#3a2618', { a: 0.4 });   // the pen case beside, bound to it
  tube(f, F, [[-80, 140], [80, 160]], 7, C.TWINE, { lit: false }); tube(f, F, [[-40, -20], [150, 30]], 7, C.TWINE, { lit: false });
  const run = [add(e, [60, 10]), add(e, [80, 70]), add(e, [64, 150])]; L(f, F, run, 14, INK); L(f, F, run, 9, ink);
  D.crack(f, F([[-60, 60]])[0], 1.4, 60, { n: 3 }); D.chip(f, F([[-80, 200]])[0], 8, 0);
  return { focus: F([e])[0], sig: SB(F, [-140, -230, 260, 300]), feat: ['contents'], ells: [30 / 86, 22 / 72] };
};
META.inkhorn = { act: 'drip', only: ['close', 'table', 'ledge', 'niche'] };

O.inkwell = (f, o = {}) => { // a square glass inkwell, thick-walled and bevelled, filled to the brim with the course's ink, a pewter hinged lid thrown back
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = inkOf(o);
  const front = [[-190, -60, 1], [130, -60, 1], [150, 200, 1], [-170, 200, 1]], side = [[130, -60, 1], [230, -120, 1], [250, 130, 1], [150, 200, 1]], top = [[-190, -60, 1], [-90, -130, 1], [230, -120, 1], [130, -60, 1]];
  P(f, F, side, mix(ink, '#202428', 0.5), { tex: T(f, 'mottle'), texOp: 0.5, dress: false }); P(f, F, front, mix(ink, '#3a4448', 0.35), { tex: T(f, 'mottle'), texOp: 0.6 }); P(f, F, top, '#8a949a', { dress: false });
  shadeR(f, F, front, 20, 140, -50, 200, 8, { op: 0.4 }); L(f, F, [[-170, -40], [-152, 180]], 8, '#f0f4f4', { op: 0.55 }); L(f, F, [[-160, -48], [120, -48]], 3, '#f0f4f4', { op: 0.6 });
  oval(f, F, [20, -96], 76, 22, '#3a3e42'); oval(f, F, [20, -96], 58, 15, ink, { shade: 0.2 }); f.flat(F(ell([4, -100], 22, 5, 0, 10)), wetOf(o), { op: 0.7 });
  const lid = [[-40, -100], [-80, -220], [40, -260], [100, -150]]; P(f, F, lid, C.PEWTER, { tex: T(f, 'mottle'), texOp: 0.8 }); oval(f, F, [-50, -110], 16, 12, C.PEWTER);
  const run = [[100, -80], [130, -30], [140, 80]]; L(f, F, run, 14, INK); L(f, F, run, 9, ink);
  D.chip(f, F([[-190, 100]])[0], 9, 1.6); D.chip(f, F([[140, 200]])[0], 8, 0); D.stain(f, F([[-40, 210]])[0], 40, ink, { op: 0.5 });
  return { focus: F([[20, -96]])[0], sig: SB(F, [-200, -265, 255, 210]), feat: ['contents'], ells: [22 / 76, 15 / 58] };
};
META.inkwell = { act: 'drip', only: ['close', 'table', 'ledge', 'niche'] };

O.reservoir = (f, o = {}) => { // the Accumulator's brass reservoir: a riveted brass tank in hammered bands, a round gauge at its shoulder, a valve, light of the course's ink seeping at the seams
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = inkOf(o), glow = mix(ink, '#f0e8d0', 0.55);
  const body = turned([[120, -250], [180, -200], [200, -100], [200, 160], [180, 220], [150, 250]], 0.22); P(f, F, body, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 });
  arcs(f, F, body, [-60, 40, 120], y => 200, 0.22, { op: 0.35 }); shadeR(f, F, body, 100, 200, -220, 250, 12, { op: 0.45 });
  for (const y of [-160, -20, 120, 210]) { const q = ell([0, y], 202, 44, 0, 30).slice(0, 16); L(f, F, q, 18, INK); L(f, F, q, 12, '#8a7a54'); for (let k = 1; k < 16; k += 3) f.rivet(F([q[k]])[0], 3.5, '#c8b888'); L(f, F, q.map(p => add(p, [0, 10])), 4, glow, { op: 0.7 }); }   // bands, and light at each seam
  oval(f, F, [0, -250], 120, 26, mix(C.BRONZE, '#fff', 0.15)); P(f, F, [[-30, -250], [30, -250], [26, -320], [-26, -320]], C.BRONZE, { dress: false }); P(f, F, [[-70, -320], [70, -320], [70, -340], [-70, -340]], C.IRON, { dress: false, sharp: true });   // the valve wheel
  oval(f, F, [-90, 50], 64, 64, '#e8e0c8', { shade: 0.3 }); ring(f, F, [-90, 50], 64, 64, 8, '#8a7a54'); for (let k = 0; k < 9; k++) { const a = Math.PI * (0.8 + k * 0.175); L(f, F, [add([-90, 50], [Math.cos(a) * 44, Math.sin(a) * 44]), add([-90, 50], [Math.cos(a) * 56, Math.sin(a) * 56])], 2.4, INK); } L(f, F, [[-90, 50], [-50, 10]], 5, ink); oval(f, F, [-90, 50], 7, 7, INK);   // the gauge, its needle high
  L(f, F, [[-170, -180], [-190, 0], [-180, 180]], 10, '#f0e0b8', { op: 0.4 }); D.bloom(f, F([[120, 60]])[0], 30, C.VERD, { n: 4, op: 0.5 }); D.chip(f, F([[180, -200]])[0], 9, 0);
  K.fxReq(f, 'steam', F([[0, -350]])[0], 80, { col: '#c8c4b8' });
  return { focus: F([[-90, 50]])[0], sig: SB(F, [-205, -345, 205, 260]), feat: [], ells: [26 / 120, 0.22] };
};
META.reservoir = { act: 'glare', only: ['close', 'floor', 'niche', 'ledge'] };

O.abacus = (f, o = {}) => { // an oak counting frame: heavy rails and posts, rods strung with beads, each rod a different course's ink, beads pushed to count
  const F = frame([0, 0], o.ang ?? -0.08, 1), r = f.r;
  const fr = [[-330, -230, 1], [330, -230, 1], [330, 230, 1], [-330, 230, 1]]; D.slab(f, F(fr), [12, 10]);
  for (const [a, b] of [[[-330, -230], [330, -230]], [[-330, 230], [330, 230]]]) tube(f, F, [a, b], 44, C.OAKL); for (const x of [-330, 330]) tube(f, F, [[x, -250], [x, 250]], 40, C.OAK);
  for (let k = 0; k < 6; k++) { const y = -170 + k * 68; L(f, F, [[-310, y], [310, y]], 5, INK); L(f, F, [[-310, y], [310, y]], 3, '#a89470'); const n = 1 + (k * 5) % 7; const col = mix(SIX[k], '#d8ccb0', 0.15);
    for (let i = 0; i < 8; i++) { const x = i < n ? -280 + i * 52 : 280 - (7 - i) * 52; oval(f, F, [x, y], 26, 28, col, { shade: 0.45, inkW: 1.6 }); f.flat(F(ell([x - 8, y - 10], 8, 6, 0, 8)), '#f0ece0', { op: 0.55 }); } }
  for (const [x, y] of [[-330, -230], [330, -230], [-330, 230], [330, 230]]) f.rivet(F([[x, y]])[0], 6, '#8a8a86');
  D.chip(f, F([[0, -250]])[0], 9, 0); D.crack(f, F([[-200, 240]])[0], 0.1, 60, { n: 3 }); D.stain(f, F([[200, 230]])[0], 24, '#1a120c');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-355, -255, 355, 255]), feat: [], ells: [] };
};
META.abacus = { act: 'press', only: ['close', 'table', 'ledge', 'niche'] };

O.match = (f, o = {}) => { // a sulphur match the size of the hand: a split pine spill, its blob of sulphur flaring, the head blistered, smoke curling
  const F = frame([0, 0], o.ang ?? -0.7, 1), r = f.r;
  P(f, F, [[-40, 360], [40, 360], [44, -100], [-44, -100]], '#c8a870', { tex: T(f, 'wood'), texOp: 1 }); for (let i = 0; i < 4; i++) L(f, F, [[-30 + i * 20, 350], [-32 + i * 22, -90]], 1.4, '#6a5434', { op: 0.6 }); lit(f, F, [[-30, 340], [-34, -90]], 5, 0.5);
  f.part(F([[-44, -100], [44, -100], [40, -80], [-40, -80]]), { fill: '#3a2a1a', shade: 0.3, inkW: 1.4, cast: false });   // the charred band
  const head = ell([0, -190], 96, 120, 0, 28); P(f, F, head, '#9a9460', { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 0; i < 8; i++) f.part(F(ell([-50 + (i * 37) % 100, -260 + (i * 29) % 140], 12, 10, 0, 8)), { fill: '#5a4a1a', shade: 0.3, inkW: 1, cast: false });
  L(f, F, ell([0, -190], 84, 108, 0, 28).slice(14, 22), 8, '#f0e8b0', { op: 0.5 });
  D.chip(f, F([[30, 350]])[0], 7, 0);
  K.fxReq(f, 'flame', F([[0, -300]])[0], 220, { col: '#c8a030' });
  return { focus: F([[0, -200]])[0], sig: SB(F, [-100, -310, 100, 120]), grip: { c: F([[0, 260]])[0], thumb: (o.ang ?? -0.7) - Math.PI / 2 }, feat: ['fire'], ells: [] };
};
META.match = { act: 'burn', ang: -0.7 };

module.exports = { O, META };
