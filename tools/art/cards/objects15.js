// The card object library, part fifteen: the one-object-per-card pass (L72) for the Oracle and the Duelist.
// Oracle: a tangled skein, a raven, a stilled pendulum, a rider's spur, a coiled mainspring, an armillary sphere.
// Duelist: a scabbard, a headsman's axe, a barber's fleam, a bleeding porringer, a plumed hat doffed in salute, a gallows.
// Same contract and META as objects6.js.
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const { C, INKS, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = require('./objects6').helpers;
const O = {}, META = {};

// ==== the Oracle
O.skein = (f, o = {}) => { // a tangle: a skein of red wool pulled into a snarl, loops crossing and knotting, one loose end trailing
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, RED = '#8e1f17';   // a rubric red (L14)
  const loops = []; for (let k = 0; k < 9; k++) { const a = k * 0.7, rx = 150 + (k % 3) * 50, ry = 90 + (k % 4) * 30, c = [Math.cos(k * 1.9) * 50, Math.sin(k * 1.3) * 40]; loops.push(ell(c, rx, ry, a, 30)); }
  for (const lp of loops) { L(f, F, loop(lp), 16, INK); L(f, F, loop(lp), 10, RED); L(f, F, loop(lp).slice(3, 12), 3, '#e8a090', { op: 0.5 }); }
  for (let i = 0; i < 8; i++) { const p = [Math.cos(i * 2.3) * 120, Math.sin(i * 1.7) * 90]; f.part(F(ell(p, 22, 18, i, 10)), { fill: '#7a1a12', shade: 0.4, inkW: 1.4, cast: false }); }   // knots
  const end = [[180, 60], [260, 160], [220, 260], [300, 320]]; L(f, F, end, 16, INK); L(f, F, end, 10, RED); for (let k = 0; k < 4; k++) L(f, F, [[300, 320], [300 + (k - 1.5) * 14, 350]], 2, RED);
  return { focus: F([[0, 0]])[0], sig: SB(F, [-260, -220, 320, 355]), feat: [], ells: [] };
};
META.skein = { act: 'unspool', noTurn: true };

O.raven = (f, o = {}) => { // a raven, the bird of prophecy: perched side-on on a bleached post, heavy bill open as if speaking, glossed blue-black feathers, a bright eye
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, BK = '#1a1c24';
  P(f, F, [[-60, 200], [60, 200], [50, 340], [-50, 340]], '#a8a090', { tex: T(f, 'wood'), texOp: 1 }); oval(f, F, [0, 200], 60, 16, '#c8c0b0');
  const body = [[-260, 60], [-200, -20], [-60, -90], [60, -110], [140, -160], [190, -200], [220, -180], [200, -120], [160, -60], [120, 40], [40, 140], [-80, 170], [-180, 150], [-330, 170]];
  P(f, F, body, BK, { tex: T(f, 'weave'), texOp: 0.8, dressO: { op: 0.3 } }); for (let k = 0; k < 7; k++) L(f, F, [[-200 + k * 40, 30 - k * 6], [-260 + k * 40, 140 - k * 4]], 2.4, '#4a5a7a', { op: 0.55 });   // wing feathers
  L(f, F, [[-160, 20], [0, -60], [120, -120]], 6, '#6a7a9a', { op: 0.5 });
  P(f, F, [[200, -200], [320, -190], [240, -165]], '#2a2a2a', { dress: false, sharp: true }); P(f, F, [[200, -160], [300, -150], [220, -140]], '#2a2a2a', { dress: false, sharp: true });   // the open bill
  f.part(F(ell([170, -170], 12, 12, 0, 10)), { fill: '#c8c0a0', shade: 0.2, inkW: 1, cast: false }); f.part(F(ell([172, -170], 6, 6, 0, 8)), { fill: '#0a0a0a', shade: 0.1, inkW: 0.4, cast: false });
  for (const x of [-30, 30]) { L(f, F, [[x, 160], [x, 200]], 7, '#3a3a3a'); for (const dx of [-20, 0, 20]) L(f, F, [[x, 200], [x + dx, 214]], 4, '#3a3a3a'); }
  return { focus: F([[100, -100]])[0], sig: SB(F, [-330, -205, 320, 340]), feat: [], ells: [] };
};
META.raven = { act: 'blow', only: ['close', 'ledge', 'floor', 'niche'] };

O.pendulum = (f, o = {}) => { // a stopped clock's pendulum: a long brass rod with a heavy bob hanging dead still from its bracket on the wall, a hand's shadow holding it, the arc it no longer swings scored in the wood
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const wall = [[-300, -360], [300, -360], [300, 340], [-300, 340]]; P(f, F, wall, '#4a3222', { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, wall, 0.2, 11, 1.57);
  L(f, F, ell([0, -300], 230, 520, 0, 40).slice(6, 15), 3, '#2a1a10', { op: 0.6, dash: '14 8' });   // the scored arc
  P(f, F, [[-80, -330], [80, -330], [60, -280], [-60, -280]], C.BRONZE, { sharp: true }); f.rivet(F([[0, -306]])[0], 8, '#c8b07a');
  tube(f, F, [[0, -290], [0, 150]], 16, C.BRONZE); L(f, F, [[-4, -280], [-4, 140]], 3, '#f8e8b8', { op: 0.6 });
  const bob = ell([0, 220], 110, 110, 0, 32); D.slab(f, F(bob), [8, 10]); P(f, F, bob, C.BRONZE, { tex: T(f, 'mottle'), texOp: 0.8 }); ring(f, F, [0, 220], 80, 80, 3, '#6a5a30'); shadeR(f, F, bob, 30, 100, 130, 320, 8, { op: 0.45 }); L(f, F, ell([0, 220], 96, 96, 0, 24).slice(12, 18), 8, '#f8e8b8', { op: 0.6 });
  f.part(F(ell([0, 220], 34, 34, 0, 14)), { fill: '#3a2a10', shade: 0.2, inkW: 1, cast: false }); for (const a of [0, 1.57]) L(f, F, [add([0, 220], [Math.cos(a) * 30, Math.sin(a) * 30]), add([0, 220], [-Math.cos(a) * 30, -Math.sin(a) * 30])], 3, '#c8b07a');
  D.bloom(f, F([[60, 260]])[0], 18, C.VERD, { n: 3 }); D.chip(f, F([[-200, 200]])[0], 9, 0);
  return { focus: F([[0, 200]])[0], sig: SB(F, [-300, -360, 300, 340]), feat: [], ells: [] };
};
META.pendulum = { act: 'press', noTurn: true, only: ['close'] };

O.spur = (f, o = {}) => { // a rider's spur: a forged iron heel band with a long neck and a spiked rowel, buckle and strap still on it, the rowel bright from use
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r;
  const cl = []; for (let i = 0; i <= 24; i++) { const t = 0.3 + i / 24 * (Math.PI * 2 - 0.6); cl.push([Math.cos(t + Math.PI) * 200, Math.sin(t + Math.PI) * 120]); }
  const band = sweep(cl, 34, 34); P(f, F, band.poly, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, band.A.slice(4, 20), 4, '#e8e8e0', { op: 0.5 });
  for (const [x, y] of [[-186, -36], [-186, 36]]) f.rivet(F([[x, y]])[0], 12, '#9a9a96');   // the strap studs at the band's ends
  tube(f, F, [[200, 0], [415, -48]], 22, C.IRON);   // the neck, into the rowel's hub
  const c = [420, -50]; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; f.part(F([add(c, [Math.cos(a - 0.12) * 20, Math.sin(a - 0.12) * 20]), add(c, [Math.cos(a) * 90, Math.sin(a) * 90]), add(c, [Math.cos(a + 0.12) * 20, Math.sin(a + 0.12) * 20])]), { fill: '#a8aaa6', shade: 0.3, inkW: 1.4, cast: false, sharp: true }); }
  f.part(F(ell(c, 22, 22, 0, 12)), { fill: C.IRON, shade: 0.4, inkW: 1.4, cast: false }); f.rivet(F([c])[0], 7, '#d8d8d0');
  D.bloom(f, F([[-180, 40]])[0], 22, C.RUST, { n: 3 });
  return { focus: F([c])[0], sig: SB(F, [-320, -235, 515, 235]), feat: [], ells: [] };
};
META.spur = { act: 'turn', only: ['close', 'table', 'ledge', 'floor'] };

O.mainspring = (f, o = {}) => { // a clock's mainspring drawn out of its barrel: a long coil of blued steel wound tight in its brass drum, the outer end sprung loose, the winding arbor square in the middle
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const drum = ell([0, 30], 260, 260, 0, 40); D.slab(f, F(drum), [8, 10]); P(f, F, drum, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); oval(f, F, [0, 30], 236, 236, '#1a1612', { shade: 0.1 });
  const sp = []; for (let i = 0; i <= 260; i++) { const t = i / 260 * Math.PI * 2 * 6.5, rr = 34 + t * 5.0; sp.push([Math.cos(t) * rr, 30 + Math.sin(t) * rr]); }
  L(f, F, sp, 10, INK); L(f, F, sp, 6, '#3a4a6a'); L(f, F, sp.slice(40), 1.6, '#a8b8d8', { op: 0.6 });
  const last = sp[sp.length - 1], loose = [last, add(last, [80, -60]), add(last, [180, -40]), add(last, [240, -120])]; L(f, F, loose, 12, INK); L(f, F, loose, 7, '#3a4a6a');
  P(f, F, [[-26, 4], [26, 4], [26, 56], [-26, 56]], '#c8b07a', { dress: false, sharp: true });
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; f.part(F([add([0, 30], [Math.cos(a - 0.08) * 258, Math.sin(a - 0.08) * 258]), add([0, 30], [Math.cos(a) * 284, Math.sin(a) * 284]), add([0, 30], [Math.cos(a + 0.08) * 258, Math.sin(a + 0.08) * 258])]), { fill: C.BRONZE, shade: 0.3, inkW: 1, cast: false }); }   // the barrel's teeth
  L(f, F, ell([0, 30], 250, 250, 0, 40).slice(22, 34), 6, '#f0e0b0', { op: 0.5 });
  return { focus: F([[0, 30]])[0], sig: SB(F, [-285, -255, 330, 315]), feat: [], ells: [] };
};
META.mainspring = { act: 'unspool', noTurn: true };

O.armillary = (f, o = {}) => { // an armillary sphere on its stand: interlocking brass rings, the ecliptic band marked with the signs, a small earth at the centre, the meridian ring tipped
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-40, 210], [40, 210], [30, 300], [120, 330], [-120, 330], [-30, 300]], C.OAK, { tex: T(f, 'wood'), texOp: 1 }); oval(f, F, [0, 330], 120, 20, C.OAK);
  const c = [0, -20];
  for (const [rx, ry, a, w, col] of [[250, 250, 0, 14, C.GILT], [250, 70, 0, 12, C.BRONZE], [250, 100, 0.42, 30, C.GILT], [70, 250, 0, 12, C.BRONZE], [200, 200, 0.8, 8, C.BRONZE]]) { const q = loop(ell(c, rx, ry, a, 40)); L(f, F, q, w + 7, INK); L(f, F, q, w, col); }
  for (let i = 0; i < 12; i++) { const t = i / 12 * Math.PI * 2, p = add(c, rot([Math.cos(t) * 250, Math.sin(t) * 100], 0.42)); f.part(F(ell(p, 5, 9, t, 6)), { fill: '#3a2e18', shade: 0.2, inkW: 0.5, cast: false }); }   // the signs on the ecliptic
  tube(f, F, [[0, -300], [0, 210]], 10, C.IRON); const e = ell(c, 54, 54, 0, 20); P(f, F, e, '#3a5a6a', { dress: false }); f.part(F([[-30, -40], [10, -60], [30, -10], [0, 10], [-20, 0]]), { fill: '#6a7a4a', shade: 0.3, inkW: 1, cast: false });
  L(f, F, ell(c, 246, 246, 0, 40).slice(24, 34), 5, '#f8e8b8', { op: 0.5 }); D.bloom(f, F([[160, 80]])[0], 20, C.VERD, { n: 3 });
  return { focus: F([c])[0], sig: SB(F, [-260, -310, 260, 335]), feat: [], ells: [] };
};
META.armillary = { act: 'turn', noTurn: true, gold: true, only: ['close', 'table', 'niche', 'ledge'] };

O.astragali = (f, o = {}) => { // knucklebones cast on a cloth: five sheep's knucklebones in a heap, each showing a different face, one marked red, the cloth gathering them into one
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const cl = [[-330, 120], [-200, 40], [60, 30], [300, 80], [330, 220], [120, 280], [-200, 270]]; P(f, F, cl, '#5a4a3a', { tex: T(f, 'weave'), texOp: 1 }); grain(f, F, cl, 0.3, 9, 0.4, '#a89070');
  const kb = (c, a, s, face) => { const G = pts => F(pts.map(p => add(c, rot(mul(p, s), a)))); const b = [[-110, -40], [-60, -80], [0, -60], [60, -90], [110, -40], [100, 30], [120, 80], [50, 90], [0, 60], [-60, 90], [-120, 70], [-100, 10]];
    P(f, G, b, '#ddd2b6', { tex: T(f, 'mottle'), texOp: 0.8 }); grain(f, G, b, 0.3, 9, 0.5, '#6a5a40');
    if (face === 0) f.part(G(ell([0, 0], 40, 28, 0, 12)), { fill: '#9a8a6a', shade: 0.4, inkW: 1.4, cast: false }); else if (face === 1) L(f, G, [[-70, 0], [0, 20], [70, 0]], 5, '#6a5a40'); else if (face === 2) f.part(G(ell([0, 10], 30, 22, 0, 12)), { fill: '#7a1a12', shade: 0.3, inkW: 1, cast: false }); else L(f, G, [[0, -50], [0, 60]], 5, '#6a5a40'); };
  kb([-170, 150], 0.2, 0.95, 0); kb([0, 120], -0.3, 1, 1); kb([170, 160], 0.5, 0.9, 3); kb([-60, 40], 0.9, 0.85, 2); kb([90, 30], -0.7, 0.85, 0);
  return { focus: F([[0, 100]])[0], sig: SB(F, [-330, -60, 330, 285]), feat: [], ells: [] };
};
META.astragali = { act: 'burst', noTurn: true, only: ['close', 'table', 'floor', 'ledge'] };

// ==== the Duelist
O.scabbard = (f, o = {}) => { // a sword going home: the long leather scabbard with its steel chape and locket, the hilt and crossguard just above the throat as the blade slides in
  const F = frame([0, 0], o.ang ?? 0.6, 1), r = f.r;
  const sc = [[-36, -200], [36, -200], [30, 330], [0, 380], [-30, 330]]; P(f, F, sc, C.LEATHER, { tex: T(f, 'weave'), texOp: 0.7 }); L(f, F, [[-18, -190], [-14, 320]], 5, '#a8886a', { op: 0.5 });
  P(f, F, [[-40, -210], [40, -210], [40, -140], [-40, -140]], '#a8aaa6', { dress: false }); P(f, F, [[-32, 300], [32, 300], [0, 385]], '#a8aaa6', { dress: false, sharp: true });   // locket and chape
  for (const y of [-120, 60]) { L(f, F, [[-38, y], [38, y]], 12, INK); L(f, F, [[-36, y], [36, y]], 7, '#8a7a5a'); }
  P(f, F, [[-14, -210], [14, -210], [12, -260], [-12, -260]], '#c8ccd0', { dress: false });   // a hand's breadth of blade
  tube(f, F, [[-130, -270], [130, -270]], 18, '#7a7c80'); for (const s of [-1, 1]) f.part(F(ell([s * 140, -270], 16, 16, 0, 10)), { fill: '#7a7c80', shade: 0.4, inkW: 1.4, cast: false });
  P(f, F, [[-20, -280], [20, -280], [18, -400], [-18, -400]], '#3a2418', { tex: T(f, 'weave'), texOp: 0.8 }); for (let k = 0; k < 6; k++) L(f, F, [[-20, -290 - k * 18], [20, -298 - k * 18]], 2.4, '#c8b07a', { op: 0.8 });
  f.part(F(ell([0, -420], 30, 28, 0, 14)), { fill: '#7a7c80', shade: 0.4, inkW: 1.6, cast: false });
  return { focus: F([[0, -240]])[0], sig: SB(F, [-160, -450, 160, 390]), grip: { c: F([[0, 100]])[0], thumb: (o.ang ?? 0.6) - Math.PI / 2 }, feat: [], ells: [] };
};
META.scabbard = { act: 'press', ang: 0.6, long: true };

O.axe = (f, o = {}) => { // a headsman's axe: a broad bearded blade on a long ash haft, the edge ground bright, a dark notch of old work in it
  const F = frame([0, 0], o.ang ?? -0.3, 1), r = f.r;
  P(f, F, limb([0, 200], [0, -330], 34, 40, { capB: false }), '#8a6a44', { tex: T(f, 'wood'), texOp: 1 }); lit(f, F, [[-12, 380], [-14, -300]], 4, 0.45);
  const head = [[20, -340], [80, -360], [160, -400], [260, -420], [280, -300], [260, -160], [200, -150], [120, -200], [60, -230], [20, -230]]; P(f, F, head, '#7a7c80', { tex: T(f, 'mottle'), texOp: 0.9 }); shadeR(f, F, head, 80, 250, -390, -180, 8, { op: 0.4 });
  L(f, F, [[262, -410], [280, -300], [262, -170]], 10, '#e8ecf0', { op: 0.7 }); f.part(F([[276, -310], [258, -300], [276, -286]]), { fill: '#2a2a2c', shade: 0.1, inkW: 1, cast: false });
  P(f, F, [[-30, -360], [30, -360], [30, -210], [-30, -210]], '#5a5c60', { dress: false });
  for (let k = 0; k < 5; k++) L(f, F, [[-32, 300 + k * 18], [32, 306 + k * 18]], 3, '#3a2418', { op: 0.8 });
  D.bloom(f, F([[120, -260]])[0], 20, C.RUST, { n: 3 }); f.flat(F(ell([230, -250], 14, 30, 0, 10)), '#5c0f0b', { op: 0.6 });
  return { focus: F([[200, -290]])[0], sig: SB(F, [-45, -425, 285, 405]), grip: { c: F([[0, 300]])[0], thumb: (o.ang ?? -0.3) - Math.PI / 2 }, feat: [], ells: [] };
};
META.axe = { act: 'swing', ang: -0.3, long: true };

O.fleam = (f, o = {}) => { // a barber-surgeon's fleam: a folding brass case with three fanned-out blades of different sizes, each a little hooked point for opening a vein
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const cs = [[-300, -40], [60, -60], [100, -20], [60, 30], [-300, 40], [-330, 0]]; P(f, F, cs, C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 }); for (let k = 0; k < 5; k++) L(f, F, [[-280 + k * 70, -40], [-290 + k * 70, 34]], 2, '#4a3a1e', { op: 0.6 }); L(f, F, [[-300, -24], [60, -44]], 5, '#f0e0b0', { op: 0.5 });
  f.rivet(F([[60, -10]])[0], 12, '#d8c890');
  for (const [a, len, w] of [[-0.9, 300, 60], [-0.35, 340, 80], [0.25, 260, 50]]) { const d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]], b0 = [60, -10], tip = add(b0, mul(d, len));
    P(f, F, [add(b0, mul(n, 12)), add(tip, mul(n, 12)), add(add(tip, mul(d, 20)), mul(n, w * 0.3)), add(add(tip, mul(d, w * 0.6)), mul(n, -w * 0.6)), add(tip, mul(n, -w * 0.5)), add(b0, mul(n, -12))], '#b8bcc0', { dress: false, sharp: true });
    L(f, F, [add(b0, mul(n, 6)), add(tip, mul(n, 6))], 2, '#f0f4f8', { op: 0.7 }); }
  f.flat(F(ell([380, -140], 10, 8, 0, 8)), '#5c0f0b', { op: 0.8 });
  return { focus: F([[200, -100]])[0], sig: SB(F, [-330, -320, 420, 160]), grip: { c: F([[-180, 0]])[0], thumb: 0 }, feat: [], ells: [] };
};
META.fleam = { act: 'drip', only: ['close', 'table', 'ledge'] };

O.porringer = (f, o = {}) => { // a bleeding porringer: a shallow pewter bowl with one flat pierced handle, graduated rings inside marking the ounces, filled to a mark with dark blood
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, PW = '#9a9c96';
  const ear = [[200, -40], [360, -70], [380, -20], [350, 30], [200, 20]]; P(f, F, ear, PW, { dressO: { op: 0.3 } }); for (const [x, y] of [[300, -24], [340, -30], [320, 4]]) f.part(F(ell([x, y], 12, 9, 0, 8)), { fill: '#2a2a28', shade: 0.1, inkW: 0.8, cast: false });
  const bowl = [[-240, -30], [-220, 90], [-120, 170], [0, 190], [120, 170], [220, 90], [240, -30]]; P(f, F, bowl, PW, { tex: T(f, 'mottle'), texOp: 0.8 }); arcs(f, F, bowl, [30, 80, 130], y => 230 - y * 0.6, 0.3, { op: 0.45 }); shadeR(f, F, bowl, 60, 230, -20, 170, 8, { op: 0.45 });
  oval(f, F, [0, -30], 240, 130, '#b8bab4'); oval(f, F, [0, -20], 210, 108, '#5c0f0b', { shade: 0.35 }); L(f, F, ell([-30, -28], 150, 70, 0, 20).slice(11, 19), 4, '#c86a5a', { op: 0.6 });
  for (const rr of [0.72, 0.5]) L(f, F, loop(ell([0, -20], 210 * rr, 108 * rr, 0, 24)), 2, '#2a0806', { op: 0.6 });
  f.scratches(F([[100, 60]])[0], 30, 6, '#f8f8f2');
  return { focus: F([[0, -24]])[0], sig: SB(F, [-245, -165, 385, 195]), grip: { c: F([[320, -20]])[0], thumb: 0 }, feat: ['contents'], ells: [130 / 240, 108 / 210] };
};
META.porringer = { act: 'pour', noTurn: true };

O.plumedhat = (f, o = {}) => { // a salute: a broad-brimmed felt hat swept off in a bow, a long white plume curling from the band, the brim tipped toward the viewer
  const F = frame([0, 0], o.ang ?? -0.25, 1), r = f.r, FELT = '#2a2a34';
  const brim = ell([0, 60], 320, 110, 0, 40); P(f, F, brim, FELT, { tex: T(f, 'weave'), texOp: 0.8 }); L(f, F, ell([0, 60], 312, 104, 0, 40).slice(0, 20), 4, '#5a5a6a', { op: 0.6 });
  const crown = [[-150, 50], [-160, -60], [-120, -160], [0, -190], [120, -160], [160, -60], [150, 50]]; P(f, F, crown, '#32323e', { tex: T(f, 'weave'), texOp: 0.8 }); shadeR(f, F, crown, 40, 150, -160, 40, 8, { op: 0.45 });
  P(f, F, [[-152, 0], [152, 0], [150, 46], [-150, 46]], '#7a2418', { dress: false }); f.part(F(ell([110, 24], 26, 30, 0, 12)), { fill: '#8a8c86', shade: 0.3, inkW: 1.2, cast: false });
  const cl = [[100, 20], [180, -120], [260, -240], [200, -330], [100, -300]]; const pl = sweep(cl, 30, 70, t => 30 + 90 * Math.sin(Math.PI * t)); P(f, F, pl.poly, '#ece6da', { tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.2 } });
  for (let i = 2; i < pl.c.length - 1; i += 1) { L(f, F, [pl.c[i], pl.A[i]], 1.4, '#9a948a', { op: 0.6 }); L(f, F, [pl.c[i], pl.B[i]], 1.4, '#9a948a', { op: 0.6 }); }
  L(f, F, pl.c, 3, '#c8c0b0');
  return { focus: F([[0, -40]])[0], sig: SB(F, [-325, -340, 325, 175]), grip: { c: F([[-260, 60]])[0], thumb: 0.2 }, feat: [], ells: [110 / 320] };
};
META.plumedhat = { act: 'swing', ang: -0.25 };

O.gallows = (f, o = {}) => { // a hanging day: a timber gallows on its mound, upright and crossbeam braced, the noose hanging empty and turning, a ladder leaning on the post
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const mound = [[-330, 300], [-200, 220], [200, 220], [330, 300], [330, 340], [-330, 340]]; P(f, F, mound, '#4a3a2a', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, mound, 0.5, 7, 0.4, '#a8906a');
  const beam = (pts, w) => { const s = sweep(pts, w, w); P(f, F, s.poly, '#5a4430', { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, s.poly, 0.5, 7, Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]), '#c8a880'); L(f, F, s.A, 3, '#a88a68', { op: 0.5 }); };   // hewn timbers, grained (L3)
  beam([[-160, 260], [-160, -340]], 50); beam([[-200, -320], [240, -320]], 46); beam([[-160, -180], [-20, -320]], 26); grain(f, F, [[-330, 300], [330, 300], [330, 340], [-330, 340]], 0.4, 8, 0.3);
  const rope = [[180, -300], [184, -120]]; L(f, F, rope, 11, INK); L(f, F, rope, 7, C.TWINE);
  ring(f, F, [184, -40], 46, 70, 9, C.TWINE); for (let k = 0; k < 5; k++) L(f, F, [[168, -136 + k * 12], [200, -132 + k * 12]], 4, '#5a4a2a');
  for (const x of [-40, 40]) tube(f, F, [[x - 120, 230], [x - 60, -150]], 12, C.OAKL); for (let k = 0; k < 6; k++) { const t = k / 6; tube(f, F, [[-160 + t * 60 - 40, 200 - t * 330], [-160 + t * 60 + 40, 200 - t * 330]], 8, C.OAKL); }
  D.crack(f, F([[-160, 0]])[0], 1.57, 120, { n: 5 }); D.chip(f, F([[200, -320]])[0], 9, 0);
  return { focus: F([[184, -60]])[0], sig: SB(F, [-330, -345, 330, 340]), feat: [], ells: [] };
};
META.gallows = { act: 'swing', noTurn: true, only: ['close', 'floor'] };

O.magpie = (f, o = {}) => { // an ill omen: one magpie on a fence rail, black and white, long wedge tail cocked, head turned to look at the viewer
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, BK = '#1a1c24';
  tube(f, F, [[-340, 200], [340, 180]], 40, '#6a6058'); grain(f, F, [[-340, 180], [340, 160], [340, 220], [-340, 240]], 0.4, 8, 0.05);
  const tail = [[-120, 60], [-340, -40], [-360, -10], [-130, 110]]; P(f, F, tail, BK, { dressO: { op: 0.3 } }); L(f, F, [[-140, 70], [-340, -24]], 4, '#3a6a6a', { op: 0.6 });
  const body = [[-140, 60], [-60, -40], [60, -80], [140, -140], [200, -150], [230, -110], [200, -60], [150, 20], [80, 120], [-40, 150], [-130, 120]]; P(f, F, body, BK, { tex: T(f, 'weave'), texOp: 0.8 });
  const belly = [[-40, 40], [60, -20], [130, 10], [80, 110], [-30, 130]]; P(f, F, belly, '#ece8e0', { dress: false }); grain(f, F, belly, 0.3, 9, 0.6, '#5a5a5a');
  P(f, F, [[-60, -10], [60, -50], [20, 10], [-50, 40]], '#ece8e0', { dress: false });   // the white shoulder
  P(f, F, [[220, -140], [300, -130], [226, -112]], '#2a2a2a', { dress: false, sharp: true }); f.part(F(ell([190, -126], 9, 9, 0, 8)), { fill: '#0a0a0a', shade: 0.1, inkW: 0.6, cast: false }); f.flat(F(ell([187, -130], 3, 3, 0, 6)), '#f0f0e8', { op: 0.9 });
  for (const x of [20, 60]) { L(f, F, [[x, 130], [x, 166]], 7, '#2a2a2a'); for (const dx of [-16, 0, 16]) L(f, F, [[x, 166], [x + dx, 178]], 4, '#2a2a2a'); }
  return { focus: F([[60, -20]])[0], sig: SB(F, [-360, -155, 340, 230]), feat: [], ells: [] };
};
META.magpie = { act: 'blow', noTurn: true, only: ['close', 'ledge', 'floor', 'niche'] };

O.embroidery = (f, o = {}) => { // needlework: a round wooden embroidery hoop holding linen half worked with a red pattern, the needle stuck through with its thread running to the stitches
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const cl = ell([0, 0], 260, 200, 0, 40); P(f, F, cl, '#ddd4c0', { tex: T(f, 'weave'), texOp: 1 }); grain(f, F, cl, 0.25, 9, 0.8);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; f.stitches(F([[0, 0], [Math.cos(a) * 80, Math.sin(a) * 60], [Math.cos(a + 0.3) * 140, Math.sin(a + 0.3) * 110]]), '#8e1f17', 2.6); }
  f.part(F(ell([0, 0], 30, 24, 0, 12)), { fill: '#8e1f17', shade: 0.3, inkW: 1.2, cast: false });
  ring(f, F, [0, 0], 262, 202, 22, C.OAKL); ring(f, F, [0, 0], 280, 218, 12, C.OAK); P(f, F, [[250, -110], [320, -130], [330, -90], [262, -70]], C.IRON, { dress: false }); f.rivet(F([[300, -104]])[0], 8, '#a8aaa6');
  const nd = [[60, -140], [200, -40]]; L(f, F, nd, 8, INK); L(f, F, nd, 4, '#a8aaa6'); L(f, F, [[200, -40], [160, 40], [110, 80]], 3, '#8e1f17');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-285, -225, 335, 225]), feat: [], ells: [200 / 260] };
};
META.embroidery = { act: 'unspool', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

O.manacles = (f, o = {}) => { // shackles: two heavy iron cuffs, one open on its hinge, joined by a short chain of big links, a staple to drag them by
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r;
  const cuff = (c, open) => { const s = sweep(ell(c, 120, 100, 0, 30).slice(0, open ? 22 : 31), 44, 44); D.slab(f, F(s.poly), [8, 10]); P(f, F, s.poly, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, s.A.slice(2, 12), 5, '#e8e8e0', { op: 0.5 }); f.rivet(F([add(c, [0, -100])])[0], 10, '#9a9a96'); };
  cuff([-190, 80], false); cuff([190, 80], true);
  for (let k = 0; k < 4; k++) { const x = -80 + k * 54; ring(f, F, [x, -20 + (k % 2) * 6], 34, k % 2 ? 12 : 22, 12, C.IRONL); }
  D.bloom(f, F([[-200, 140]])[0], 24, C.RUST, { n: 3 }); D.bloom(f, F([[180, 0]])[0], 20, C.RUST, { n: 3 });
  return { focus: F([[0, 40]])[0], sig: SB(F, [-335, -60, 335, 205]), feat: [], ells: [] };
};
META.manacles = { act: 'swing', noTurn: true };

module.exports = { O, META };
