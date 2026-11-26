// The card object library, part five: round 6. The review-4 blind test misread 28 of 66 cards at 170 px, so these
// builders are drawn for the thumbnail first: one big, high-contrast silhouette the eye can name, a lit value against
// the dark grounds (L45), mass rather than sticks (L46), never a long plank (L47). It also holds the Vessel's own
// objects (Cole: the Vessel is holy; worn gold allowed). Same contract as objects4.js:
//   (f, o) => { focus, sig, hook?, grip?, mouth?, feat, ells }, with sig given as SB(F, box) in the object's frame.
'use strict';
const K = require('./card_kit');
const SB = (F, b) => K.E.bbox(F([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]]));
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;

const IRON = '#5e6064', IRONL = '#8a8c90', OAK = '#5b412a', OAKL = '#7a5a3a', LINEN = '#d8d0bc', STONE = '#7a766c', BRONZE = '#7a6a48',
  GILT = '#9a8450', GILTL = '#c8b47a', VELLUM = '#d8ccaa', WAX = '#7a1a12', PEWTER = '#8a8c86', CLAY = '#8a5e3e', BLOOD_D = '#4c0c08';
const INKS = { fire: '#8a3a26', frost: '#6a8494', lightning: '#857452', water: '#2e3e5a', toxin: '#5a6a34', void: '#3a2a44' };
const SIX = ['#8a3a26', '#6a8494', '#857452', '#2e3e5a', '#5a6a34', '#3a2a44'];   // the six held courses, pulled to ink (L14)
const T = (f, n) => n + f.o.seed;
const loop = pts => pts.concat([pts[0]]);
const L = (f, F, pts, w, col, o) => f.line(F(pts), w, col, o);
function P(f, F, pts, fill, o = {}) { const q = F(pts); f.part(q, Object.assign({ fill, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.6 }, o)); if (o.dress !== false) D.dress(f, q, Object.assign({ lw: 1.2, op: 0.45 }, o.dressO || {})); return q; }
// a turned body from a right-hand profile [[w, y], ...] top to bottom, closed on a base arc
const turned = prof => { const right = prof.map(([w, y]) => [w, y]), left = prof.slice().reverse().map(([w, y]) => [-w, y]); const [wb, yb] = prof[prof.length - 1], arc = []; for (let i = 1; i < 10; i++) { const t = Math.PI * i / 10; arc.push([wb * Math.cos(t), yb + wb * 0.22 * Math.sin(t)]); } return [...right, ...arc, ...left]; };
const lit = (f, F, pts, w = 4, op = 0.55) => L(f, F, pts, w, '#f0e8d4', { op });   // a rim of light: the subject must stand off a dark ground (L45)
const O = {};

// ==== the misreads, replaced or redrawn
O.wasp = (f, o = {}) => { // a wasp seen whole from above: striped abdomen and sting, waist, thorax, big-eyed head, two pairs of veined wings, six legs
  const F = frame([0, 0], o.ang ?? -0.25, 1), r = f.r, AMB = '#a8702c', BLK = '#1c1814';
  const legs = [[60, -40, -1], [100, -44, -1], [140, -40, -1], [60, 40, 1], [100, 44, 1], [140, 40, 1]];
  for (const [x, y, s] of legs) { const k = [x - 20 + (x - 100) * 0.6, y + s * 70], ft = [x - 50 + (x - 100) * 1.2, y + s * 130]; L(f, F, [[x, y], k, ft], 7, INK); L(f, F, [[x, y], k, ft], 4, '#8a5a24'); }
  for (const s of [-1, 1]) { // wings, the fore pair long, the hind pair short, glassy with dark veins
    const wf = [[110, s * 10], [40, s * 120], [-120, s * 170], [-190, s * 150], [-100, s * 70], [60, s * 20]], wh = [[90, s * 14], [0, s * 90], [-90, s * 110], [-110, s * 80], [20, s * 24]];
    for (const w of [wh, wf]) { f.part(F(w), { fill: '#c8d0cc', shade: 0.3, inkW: 1.4, cast: false, opacity: 0.62, tex: T(f, 'mottle'), texOp: 0.3 }); }
    for (let k = 0; k < 4; k++) L(f, F, [[100, s * 12], [-40 - k * 40, s * (60 + k * 26)]], 1.2, '#3a3a36', { op: 0.6 });
  }
  const ab = [[40, 0], [10, -60], [-80, -92], [-170, -80], [-250, -30], [-290, 0], [-250, 30], [-170, 80], [-80, 92], [10, 60]];
  P(f, F, ab, AMB, { tex: T(f, 'mottle'), texOp: 0.6 });
  for (let i = 0; i < 4; i++) { const x0 = -10 - i * 60, w0 = 92 - Math.max(0, i - 1) * 18; f.part(F([[x0, -w0], [x0 - 26, -w0 + 4], [x0 - 34, 0], [x0 - 26, w0 - 4], [x0, w0], [x0 + 8, 0]]), { fill: BLK, shade: 0.35, inkW: 1.2, cast: false }); }
  L(f, F, [[0, -40], [-200, -30]], 6, '#f0e0b0', { op: 0.4 }); // gloss
  f.part(F([[-288, -8], [-370, 0], [-288, 8]]), { fill: BLK, shade: 0.3, inkW: 1.2, cast: false, sharp: true }); // the sting
  f.part(F(ell([52, 0], 16, 12, 0, 10)), { fill: BLK, shade: 0.3, inkW: 1.2, cast: false }); // the waist
  P(f, F, ell([100, 0], 50, 46, 0, 18), BLK, { tex: T(f, 'mottle'), texOp: 0.5 }); f.part(F(ell([96, -16], 18, 6, 0.3, 10)), { fill: AMB, shade: 0.3, inkW: 0.8, cast: false });
  P(f, F, ell([170, 0], 40, 46, 0, 18), AMB, { dress: false }); for (const s of [-1, 1]) f.part(F(ell([176, s * 26], 18, 24, 0, 12)), { fill: BLK, shade: 0.3, inkW: 1.2, cast: false });
  for (const s of [-1, 1]) { L(f, F, [[200, s * 14], [250, s * 40], [300, s * 30]], 6, INK); L(f, F, [[200, s * 14], [250, s * 40], [300, s * 30]], 3, '#3a2a1a'); }
  K.fxReq(f, 'drip', F([[-372, 4]])[0], 2, { col: '#5a6a34' });
  return { focus: F([[-60, 0]])[0], sig: SB(F, [-380, -170, 310, 170]), feat: [], ells: [] };
};
O.shears = (f, o = {}) => { // a surgeon's iron shears, open, cutting a strip of linen: two blades crossing at a pivot, two ring handles
  const F = frame([0, 0], o.ang ?? -0.5, 1), r = f.r;
  const strip = [[-60, -260], [60, -250], [90, 60], [70, 280], [-50, 300], [-30, 60]];
  P(f, F, strip, LINEN, { tex: T(f, 'weave'), texOp: 0.8, dressO: { op: 0.25 } }); for (let i = 0; i < 6; i++) L(f, F, [[-40 + i * 3, -240 + i * 90], [70 + i * 2, -232 + i * 90]], 1, '#9a9280', { op: 0.5 });
  for (let i = 0; i < 8; i++) L(f, F, [[20 + i * 6, 20], [24 + i * 6, 34 + r() * 10]], 1, '#9a9280', { op: 0.8 }); // frayed cut
  const piv = [0, 0];
  for (const s of [-1, 1]) {
    const tip = [s * 70, -330], heel = [-s * 30, 40], ringC = [-s * 120, 230];
    f.part(F([heel, add(piv, [s * 18, -20]), tip, add(piv, [-s * 6, -30])]), { fill: IRONL, shade: 0.4, inkW: 2, sharp: true }); // blade
    L(f, F, [add(piv, [s * 14, -24]), add(tip, [-s * 2, 8])], 2.4, '#f0f0ea', { op: 0.75 }); // its ground edge
    L(f, F, [heel, ringC], 22, INK); L(f, F, [heel, ringC], 15, IRON); // shank
    f.line(F(loop(ell(ringC, 62, 50, s * 0.4, 22))), 26, INK); f.line(F(loop(ell(ringC, 62, 50, s * 0.4, 22))), 18, IRON); f.line(F(ell(ringC, 62, 50, s * 0.4, 22).slice(12, 20)), 6, IRONL, { op: 0.7 });
  }
  f.part(F(ell(piv, 16, 16, 0, 12)), { fill: IRONL, shade: 0.4, inkW: 1.6 }); f.rivet(F([piv])[0], 5, '#c8c8c4');
  D.bloom(f, F([[-80, 120]])[0], 16, '#5a2a12', { n: 3 });
  return { focus: F([[0, -100]])[0], sig: SB(F, [-200, -340, 200, 290]), feat: [], ells: [] };
};
O.laundry = (f, o = {}) => { // clean linen hung over a cord to dry: one sheet in deep folds, two wooden pegs, the cord sagging from a post
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, cord = [[-330, -250], [-120, -214], [100, -206], [330, -236]];
  L(f, F, cord, 7, INK); L(f, F, cord, 4, '#8a7a5a');
  const top = [[-230, -222], [-120, -212], [0, -208], [110, -206], [230, -218]], hem = [[-250, 230], [-170, 250], [-90, 222], [0, 256], [90, 226], [170, 256], [250, 232]];
  P(f, F, [...top, ...hem.slice().reverse()], LINEN, { tex: T(f, 'weave'), texOp: 0.6, shade: 0.4, dressO: { op: 0.2 } });
  for (let i = 0; i < 6; i++) { const x = -190 + i * 76; L(f, F, [[x, -200], [x + (i % 2 ? 14 : -10), 20], [x + (i % 2 ? -6 : 10), 230]], i % 2 ? 9 : 5, i % 2 ? '#a8a08c' : '#f4f0e4', { op: i % 2 ? 0.45 : 0.6 }); } // the folds: shadowed troughs, lit ridges
  f.part(F([[-230, -222], [230, -218], [236, -190], [-236, -192]]), { fill: mix(LINEN, '#fff', 0.15), shade: 0.3, inkW: 1.2, cast: false }); // the turned-over top
  for (const x of [-150, 150]) { P(f, F, [[x - 12, -250], [x + 12, -250], [x + 10, -170], [x - 10, -170]], OAKL, { dress: false }); L(f, F, [[x, -244], [x, -176]], 1.4, INK, { op: 0.6 }); }
  L(f, F, [[-330, -260], [-330, 300]], 18, INK); L(f, F, [[-330, -260], [-330, 300]], 12, OAK);
  return { focus: F([[0, 0]])[0], sig: SB(F, [-260, -230, 260, 256]), feat: [], ells: [] };
};
O.goldleaf = (f, o = {}) => { // a gilder's book open flat: cream tissue pages, a square of gold leaf on the right page, and one sheet lifting off into the air, crinkled, catching light
  const F = frame([0, 0], o.ang ?? -0.06, 1), r = f.r;
  for (const s of [-1, 1]) {
    P(f, F, [[0, 150], [s * 280, 130], [s * 290, -110], [0, -90]], '#4a3020', { sharp: true, tex: T(f, 'mottle'), texOp: 0.7 }); // the board
    P(f, F, [[0, 136], [s * 262, 118], [s * 268, -98], [0, -80]], '#ddd2b4', { sharp: true, tex: T(f, 'mottle'), texOp: 0.5, dressO: { op: 0.2 } }); // the page
    for (let k = 1; k < 4; k++) L(f, F, [[s * 262, 118 + k * 4], [s * 268 + s * k * 2, -98 + k * 4]], 1, INK, { op: 0.5 }); }
  L(f, F, [[0, -84], [0, 140]], 3, INK);
  const sq = [[40, -60], [220, -70], [226, 100], [44, 108]]; f.part(F(sq), { fill: GILT, shade: 0.35, inkW: 1.6, sharp: true, tex: T(f, 'mottle'), texOp: 0.4 });
  for (let i = 0; i < 10; i++) { const c = [56 + r() * 150, -50 + r() * 140], q = [c, add(c, [22, -4]), add(c, [10, 18])]; f.flat(F(q), r() < 0.5 ? '#ece0a8' : '#6a5420', { op: 0.7 }); }
  const sheet = [[-200, -150], [-60, -250], [70, -230], [60, -150], [-40, -120], [-150, -90]]; // lifting off the left page
  f.part(F(sheet), { fill: GILT, shade: 0.35, inkW: 1.8, sharp: true, tex: T(f, 'mottle'), texOp: 0.4 });
  for (let i = 0; i < 12; i++) { const c = [-170 + r() * 210, -230 + r() * 110], q = [c, add(c, [26, -6]), add(c, [12, 22])]; f.flat(F(q), r() < 0.5 ? '#f0e4b0' : '#5a4818', { op: 0.75 }); }
  L(f, F, [[-200, -150], [-60, -250], [70, -230]], 3, '#f4ecc4', { op: 0.8 });
  f.flat(F([[-180, -80], [40, -110], [60, -90], [-150, -60]]), '#1a120c', { op: 0.3 }); // its shadow on the page
  return { focus: F([[0, -150]])[0], sig: SB(F, [-290, -260, 290, 150]), feat: [], ells: [] };
};
O.urn = (f, o = {}) => { // a funerary urn of grey stoneware, lid pushed aside, a saint's ash spilling; two lug handles, a cross cut in its side
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const body = turned([[74, -170], [80, -150], [120, -126], [158, -80], [170, -20], [164, 40], [138, 110], [100, 160], [76, 186], [76, 200], [104, 214], [108, 236]]);
  P(f, F, body, '#8a867a', { sharp: true, tex: T(f, 'mottle'), texOp: 0.8 });
  for (const s of [-1, 1]) { f.line(F(ell([s * 172, -40], 26, 40, 0, 16).slice(s < 0 ? 8 : 0, s < 0 ? 17 : 9)), 18, INK); f.line(F(ell([s * 172, -40], 26, 40, 0, 16).slice(s < 0 ? 8 : 0, s < 0 ? 17 : 9)), 11, '#7a766a'); }
  L(f, F, [[-110, -120], [-150, 40], [-100, 170]], 8, '#f0e8d4', { op: 0.4 });
  L(f, F, [[0, -60], [0, 80]], 8, INK, { op: 0.7 }); L(f, F, [[-46, -10], [46, -10]], 8, INK, { op: 0.7 }); // the cut cross
  f.part(F(ell([0, -170], 70, 16, 0, 20)), { fill: '#3a3630', shade: 0.2, inkW: 1.4, cast: false });
  f.part(F(ell([10, -176], 54, 10, 0, 16)), { fill: '#b8b2a4', shade: 0.3, inkW: 0.8, cast: false }); // the ash at the mouth
  const lid = frame(F([[120, -220]])[0], 0.5, 1); f.part(lid(ell([0, 0], 80, 18, 0, 18)), { fill: '#7a766a', shade: 0.4, inkW: 1.6 }); f.part(lid([[-16, -6], [16, -6], [10, -40], [-10, -40]]), { fill: '#7a766a', shade: 0.4, inkW: 1.4 });
  for (let i = 0; i < 26; i++) f.flat(F(ell([60 + r() * 160, 200 + r() * 30], 3 + r() * 4, 2, 0, 6)), r() < 0.5 ? '#c8c2b4' : '#5a564e', { op: 0.85 }); // spilled ash
  K.fxReq(f, 'steam', F([[20, -190]])[0], 70, { col: '#a8a49a' });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-200, -240, 200, 240]), feat: ['contents'], ells: [16 / 70, 0.22] };
};
O.weights = (f, o = {}) => { // a heavy balance held level: an iron post, a thick beam, two deep pans; six iron weights, each stamped with a course seal, three a side
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-130, 270], [130, 270], [100, 220], [-100, 220]], OAK, { tex: T(f, 'wood'), texOp: 0.8 });
  P(f, F, limb([0, 230], [0, -220], 40, 28, { capB: false }), IRON, { dressO: { op: 0.45 } }); lit(f, F, [[-12, 200], [-10, -200]], 4, 0.4);
  const beam = [[-290, -210], [290, -210]]; L(f, F, beam, 30, INK); L(f, F, beam, 22, IRON); lit(f, F, [[-280, -218], [280, -218]], 3, 0.5);
  f.part(F(ell([0, -210], 26, 26, 0, 14)), { fill: GILT, shade: 0.4, inkW: 1.6 }); f.part(F([[-8, -236], [8, -236], [0, -290]]), { fill: GILT, shade: 0.4, inkW: 1.2, sharp: true }); // gilt boss and pointer: level
  for (const s of [-1, 1]) { const top = [s * 270, -200], pan = [s * 270, 60];
    for (const dx of [-90, 90]) { L(f, F, [top, add(pan, [dx, -14])], 7, INK); L(f, F, [top, add(pan, [dx, -14])], 4, IRONL, { dash: '8 4' }); }
    f.part(F([add(pan, [-110, -14]), add(pan, [110, -14]), add(pan, [80, 40]), add(pan, [-80, 40])]), { fill: '#6a6c6a', shade: 0.45, inkW: 2 });
    f.part(F(ell(add(pan, [0, -14]), 110, 18, 0, 22)), { fill: IRONL, shade: 0.3, inkW: 1.6, cast: false });
    [-60, 0, 60].forEach((dx, k) => { const c = add(pan, [dx, -30]), i = (s < 0 ? 0 : 3) + k; P(f, F, [add(c, [-24, 14]), add(c, [24, 14]), add(c, [18, -34]), add(c, [-18, -34])], '#4a4c50', { dress: false });
      f.part(F(ell(add(c, [0, -34]), 18, 6, 0, 10)), { fill: '#7a7c80', shade: 0.3, inkW: 1, cast: false }); f.part(F(ell(add(c, [0, -6]), 9, 9, 0, 10)), { fill: SIX[i], shade: 0.3, inkW: 1, cast: false }); f.line(F(loop(ell(add(c, [0, -6]), 10, 10, 0, 10))), 1.6, GILT); }); }
  return { focus: F([[0, -120]])[0], sig: SB(F, [-390, -300, 390, 280]), feat: [], ells: [18 / 110] };
};
O.initial = (f, o = {}) => { // an illuminated initial: a vellum leaf, a great gilt letter A in a ruled box, knotwork inside it, script running round it, a rubric line
  const F = frame([0, 0], o.ang ?? -0.06, 1), r = f.r;
  const leaf = [[-230, -290], [230, -296], [236, 250], [200, 290], [-226, 286]];
  D.slab(f, F(leaf), [10, 8], '#7a6a4a'); P(f, F, leaf, VELLUM, { tex: T(f, 'mottle'), texOp: 0.6, shade: 0.3, dressO: { op: 0.25 } });
  f.part(F([[236, 250], [200, 290], [190, 240]]), { fill: mix(VELLUM, '#000', 0.2), shade: 0.3, inkW: 1.2, cast: false }); // dog-ear
  f.part(F([[-190, -250], [60, -250], [60, 20], [-190, 20]]), { fill: '#2e3e5a', shade: 0.3, inkW: 2.2, cast: false, sharp: true }); // the box, in deep blue
  for (let i = 0; i < 6; i++) { const c = [-160 + (i % 3) * 90, -220 + Math.floor(i / 3) * 210]; f.line(F(loop(ell(c, 18, 18, 0, 10))), 3, mix(SIX[i], '#e8e0c8', 0.25), { op: 0.7 }); } // knot rings in the six inks
  const A = [[-160, 0], [-80, -230], [-30, -230], [50, 0], [0, 0], [-20, -60], [-90, -60], [-110, 0]]; // the letter
  D.slab(f, F(A), [6, 5], '#3a2e14'); f.part(F(A), { fill: GILT, shade: 0.4, inkW: 2.4, sharp: true, tex: T(f, 'mottle'), texOp: 0.5 });
  f.part(F([[-82, -110], [-55, -190], [-30, -110]]), { fill: '#2e3e5a', shade: 0.3, inkW: 1.6, cast: false, sharp: true }); // the counter
  L(f, F, [[-150, -6], [-78, -222]], 3, GILTL, { op: 0.8 }); for (let i = 0; i < 8; i++) { const c = [-140 + r() * 170, -220 + r() * 210]; f.flat(F(ell(c, 4, 3, r(), 6)), '#f0e4b0', { op: 0.8 }); } // burnish glints
  for (let k = 0; k < 9; k++) { const y = -230 + k * 28; L(f, F, [[80, y], [200, y]], 2.6, INK, { op: 0.75, dash: `${8 + (k * 7) % 12} 3 6 3` }); } // script beside
  for (let k = 0; k < 7; k++) { const y = 50 + k * 30; L(f, F, [[-190, y], [200, y]], 2.6, k === 0 ? WAX : INK, { op: 0.75, dash: `${10 + (k * 5) % 14} 3 5 3` }); } // script below, the first line in rubric
  return { focus: F([[-60, -110]])[0], sig: SB(F, [-236, -296, 236, 290]), feat: [], ells: [] };
};
O.seal = (f, o = {}) => { // a seal matrix standing on its gilt die beside the fresh wax seal it has just made: a tall turned handle, the die's face, the seal's impressed sigil
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const sealAt = (c, rad) => { const G = frame(F([c])[0], 0, 1); f.part(G(ell([0, 6], rad + 14, (rad + 14) * 0.32, 0, 22)), { fill: '#5a1a12', shade: 0.4, inkW: 1.8 }); f.part(G(ell([0, 0], rad, rad * 0.3, 0, 22)), { fill: WAX, shade: 0.4, inkW: 1.4, cast: false });
    f.line(G(loop(ell([0, 0], rad * 0.62, rad * 0.25, 0, 18))), 3, '#3a0a06'); f.line(G([[-rad * 0.34, 0], [rad * 0.34, 0]]), 3.4, '#3a0a06'); f.line(G([[0, -rad * 0.14], [0, rad * 0.14]]), 3.4, '#3a0a06'); f.line(G(ell([0, 0], rad, rad * 0.4, 0, 22).slice(12, 20)), 4, '#c86a50', { op: 0.6 });
    for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; f.part(G(ell([Math.cos(a) * (rad + 16), 6 + Math.sin(a) * (rad + 16) * 0.42], 10, 5, a, 8)), { fill: '#5a1a12', shade: 0.4, inkW: 1, cast: false }); } };   // wax squeezed out round it
  sealAt([150, 200], 90);
  const die = [-110, 190];
  f.part(F(ell(add(die, [0, 30]), 100, 30, 0, 24)), { fill: mix(GILT, '#000', 0.35), shade: 0.4, inkW: 2.2 });
  P(f, F, [[die[0] - 100, die[1] + 30], [die[0] - 100, die[1] - 16], [die[0] + 100, die[1] - 16], [die[0] + 100, die[1] + 30]], GILT, { dress: false, sharp: true });
  f.part(F(ell(add(die, [0, -16]), 100, 30, 0, 24)), { fill: GILTL, shade: 0.3, inkW: 1.8, cast: false });
  P(f, F, turned([[40, -40], [60, -90], [40, -150], [74, -250], [80, -330], [44, -380]]).map(([x, y]) => [x + die[0], y + die[1]]), OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  lit(f, F, [[die[0] - 30, die[1] - 80], [die[0] - 50, die[1] - 200], [die[0] - 60, die[1] - 330]], 8, 0.5);
  for (let i = 0; i < 3; i++) L(f, F, [[die[0] - 56, die[1] - 150 - i * 60], [die[0] + 56, die[1] - 150 - i * 60]], 2.4, INK, { op: 0.6 });
  return { focus: F([[150, 200]])[0], sig: SB(F, [-230, -200, 260, 250]), feat: [], ells: [0.3, 0.3] };
};
O.hearth = (f, o = {}) => { // a hearthstone: a low stone fireplace arch, a log fire burning in it, a kettle on the hook, warm light on the flags
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-330, 260], [-330, -200], [330, -200], [330, 260]], STONE, { sharp: true, tex: T(f, 'mottle'), texOp: 0.9 }); // the chimney breast
  for (let i = 0; i < 6; i++) L(f, F, [[-330, -140 + i * 70], [330, -140 + i * 70]], 3, INK, { op: 0.55 }); for (let i = 0; i < 24; i++) { const y = -170 + Math.floor(i / 4) * 70, x = -300 + (i % 4) * 160 + (Math.floor(i / 4) % 2) * 80; L(f, F, [[x, y], [x, y + 70]], 3, INK, { op: 0.5 }); }
  P(f, F, [[-360, -260], [360, -260], [370, -200], [-370, -200]], '#5a4a3a', { tex: T(f, 'wood'), texOp: 0.9 }); // the mantel beam
  const arch = [[-210, 260], [-210, -40], [-150, -110], [0, -140], [150, -110], [210, -40], [210, 260]];
  f.part(F(arch), { fill: '#120c08', shade: 0.1, inkW: 3, cast: false, hatch: false }); // the fire's mouth
  f.flat(F([[-200, 260], [-180, 60], [0, 0], [180, 60], [200, 260]]), '#6a2e14', { op: 0.55 }); f.flat(F(ell([0, 220], 170, 50, 0, 20)), '#b8642a', { op: 0.45 }); // glow
  for (const [a, b] of [[[-150, 230], [120, 200]], [[-110, 200], [150, 240]]]) { P(f, F, limb(a, b, 40, 36, { capK: 0.5 }), '#4a3420', { tex: T(f, 'wood'), texOp: 0.8 }); f.part(F(ell(b, 16, 18, 0, 10)), { fill: '#c8803a', shade: 0.3, inkW: 1.2, cast: false }); } // logs, their cut ends lit
  for (let i = 0; i < 9; i++) f.part(F(ell([-140 + i * 34, 252], 16, 9, 0, 8)), { fill: i % 2 ? '#a8501e' : '#2a1a10', shade: 0.4, inkW: 0.8, cast: false });
  K.fxReq(f, 'flame', F([[-30, 200]])[0], 150, { col: '#c86030' }); K.fxReq(f, 'flame', F([[60, 196]])[0], 110, { col: '#c86030' });
  L(f, F, [[110, -130], [110, -40]], 8, INK); f.part(F(turned([[40, -40], [70, -20], [80, 30], [60, 60]]).map(([x, y]) => [x + 110, y])), { fill: '#2a2a2c', shade: 0.4, inkW: 1.6 }); // the kettle on its hook
  f.part(F([[-400, 260], [400, 260], [430, 300], [-430, 300]]), { fill: '#8a8478', shade: 0.35, inkW: 1.6, cast: false, tex: T(f, 'mottle'), texOp: 0.7 }); // the hearthstone itself, warm-lit
  f.flat(F(ell([0, 272], 260, 18, 0, 20)), '#d8a060', { op: 0.35 });
  return { focus: F([[0, 150]])[0], sig: SB(F, [-370, -270, 370, 300]), feat: ['fire'], ells: [] };
};
O.chalice = (f, o = {}) => { // a holy chalice of worn gilt: a deep bowl brimming with dark ink that spills over the lip and runs down the stem
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = INKS[o.course] || '#1e1612', empty = (o.state || {}).empty;
  const body = turned([[150, -170], [140, -90], [96, -20], [30, 30], [22, 90], [40, 120], [24, 150], [30, 190], [120, 240], [130, 256]]);
  P(f, F, body, GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  L(f, F, [[-120, -150], [-100, -60], [-40, 10]], 9, GILTL, { op: 0.55 }); L(f, F, [[-110, 236], [-40, 200]], 5, GILTL, { op: 0.5 });
  f.part(F(ell([0, 105], 48, 16, 0, 16)), { fill: mix(GILT, '#000', 0.25), shade: 0.4, inkW: 1.6 }); // the knop
  for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.36; f.part(F(ell([Math.sin(a) * 46, 105], 6, 8, 0, 8)), { fill: SIX[i], shade: 0.3, inkW: 0.8, cast: false }); } // six stones in it
  f.part(F(ell([0, -170], 150, 34, 0, 28)), { fill: mix(GILT, '#000', 0.4), shade: 0.3, inkW: 2, cast: false });
  f.part(F(ell([0, -166], 136, 26, 0, 28)), { fill: empty ? '#3a2e1a' : ink, shade: 0.2, inkW: 1, cast: false }); f.flat(F(ell([-40, -170], 50, 6, 0, 12)), '#8a8a9a', { op: 0.35 });
  if (empty) f.line(F(loop(ell([0, -164], 110, 18, 0, 24))), 4, ink, { op: 0.8 }); // drained: only a ring of dregs
  else { const run = [[120, -150], [126, -100], [100, -40], [60, 0], [34, 60]]; L(f, F, run, 16, INK); L(f, F, run, 11, ink); } // the spill running down
  D.bloom(f, F([[-80, 200]])[0], 18, '#3a3020', { n: 3, op: 0.5 }); f.scratches(F([[60, -80]])[0], 40, 6, '#f0e0a8');
  return { focus: F([[0, -170]])[0], sig: SB(F, [-160, -210, 160, 260]), mouth: empty ? undefined : F([[130, -160]])[0], grip: { c: F([[0, 140]])[0], thumb: (o.ang ?? 0) - Math.PI / 2 }, feat: empty ? [] : ['contents'], ells: [34 / 150, 26 / 136] };
};
O.ewer = (f, o = {}) => { // a tall pewter ewer tipped to pour, a long spout and a looped handle, ink streaming from the spout
  const F = frame([0, 0], o.ang ?? 0.45, 1), r = f.r;
  const body = turned([[60, -220], [70, -170], [130, -40], [140, 60], [110, 160], [90, 200], [100, 230]]);
  P(f, F, body, PEWTER, { tex: T(f, 'mottle'), texOp: 0.7 });
  L(f, F, [[-100, -60], [-120, 60], [-96, 170]], 10, '#f0f0ea', { op: 0.45 }); for (const y of [-170, 160]) L(f, F, [[-70, y], [70, y]], 4, INK, { op: 0.6 });
  P(f, F, [[50, -150], [230, -290], [260, -296], [250, -270], [90, -110]], PEWTER, { dressO: { op: 0.3 } }); // the spout
  const hdl = [[-70, -180], [-200, -170], [-230, -40], [-130, 60]]; L(f, F, hdl, 26, INK); L(f, F, hdl, 18, PEWTER); L(f, F, hdl.slice(0, 3), 4, '#f0f0ea', { op: 0.4 });
  f.part(F(ell([0, -220], 60, 14, 0, 18)), { fill: '#2a2a2c', shade: 0.2, inkW: 1.6, cast: false });
  D.bloom(f, F([[60, 120]])[0], 20, '#4a4c48', { n: 3, op: 0.5 }); f.scratches(F([[-40, 0]])[0], 40, 8, '#f0f0ea');
  return { focus: F([[255, -290]])[0], sig: SB(F, [-240, -300, 270, 240]), mouth: F([[258, -294]])[0], feat: [], ells: [14 / 60, 0.22] };
};
O.offering = (f, o = {}) => { // an offering bowl seen from above: a wide wooden bowl on a low foot, its gilt rim worn, the six inks pooled and stained in rings inside
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const R = 300, ry = 120;
  P(f, F, [[-R, 0], [-R + 20, 70], [-200, 150], [0, 180], [200, 150], [R - 20, 70], [R, 0]], OAKL, { tex: T(f, 'wood'), texOp: 0.9 }); // the outer wall
  f.part(F([[-120, 170], [120, 170], [100, 210], [-100, 210]]), { fill: OAK, shade: 0.4, inkW: 1.6 }); // the foot
  f.part(F(ell([0, 0], R, ry, 0, 40)), { fill: GILT, shade: 0.35, inkW: 2.2, cast: false }); // the rim
  f.part(F(ell([0, 8], R - 24, ry - 16, 0, 40)), { fill: '#3a2a1c', shade: 0.3, inkW: 1.4, cast: false, tex: T(f, 'wood'), texOp: 0.7 }); // the hollow
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3, c = [Math.cos(a) * 130, 12 + Math.sin(a) * 52]; f.part(F(ell(c, 54, 22, 0, 18)), { fill: SIX[i], shade: 0.3, inkW: 1, cast: false }); f.line(F(loop(ell(c, 64, 27, 0, 18))), 2, mix(SIX[i], '#000', 0.3), { op: 0.6 }); f.flat(F(ell(add(c, [-14, -6]), 14, 4, 0, 8)), '#e8e4d8', { op: 0.35 }); } // six pools, a gloss on each
  f.part(F(ell([0, 12], 40, 16, 0, 14)), { fill: '#1e1612', shade: 0.2, inkW: 1, cast: false });
  L(f, F, ell([0, 0], R - 6, ry - 6, 0, 40).slice(22, 36), 5, GILTL, { op: 0.6 });
  return { focus: F([[0, 10]])[0], sig: SB(F, [-310, -130, 310, 210]), feat: ['contents'], ells: [ry / R, (ry - 16) / (R - 24)] };
};
// the Vessel's own hand, from its figure: drawn by the composition (heroPart), with ink bands and a gilt hairline over the wrist
O.palm = (f, o = {}) => {
  if (f.bb) { f.bb = [-170, -300, 170, 290]; f.parts.push(f.bb.slice()); }
  return { focus: [0, -120], sig: [-150, -290, 150, 260], heroPart: { mod: 'worlds/hero_vessel', key: 'vessel', only: ['forearm_n', 'hand_n'] }, feat: [], ells: [] };
};

// ==== redraws of review-4 misreads
O.doorajar = (f, o = {}) => { // a heavy arched door, frontal, standing ajar: planks, iron straps and a ring handle; a black gap down its edge, a thin stone arch round it
  const F = frame([0, 0], 0, 1), r = f.r;
  const arch = (w, top) => { const q = [[-w, 300]]; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; q.push([-w * Math.cos(t), top - Math.sin(t) * w]); } q.push([w, 300]); return q; };
  P(f, F, arch(250, -120), STONE, { tex: T(f, 'mottle'), texOp: 0.9 }); for (let i = 0; i < 9; i++) { const t = Math.PI * (i + 0.5) / 9; L(f, F, [[-210 * Math.cos(t), -120 - 210 * Math.sin(t)], [-250 * Math.cos(t), -120 - 250 * Math.sin(t)]], 3, INK, { op: 0.6 }); }
  f.part(F(arch(210, -120)), { fill: '#060508', shade: 0.1, inkW: 2.4, cast: false, hatch: false }); // the dark beyond
  const leaf = arch(200, -120).map(([x, y]) => [x * 0.86 - 22, y]); // the leaf, swung a little in: narrower, its hinge side at left
  P(f, F, leaf, '#6a4a2c', { tex: T(f, 'wood'), texOp: 0.9 });
  for (let i = 1; i < 6; i++) { const x = -194 + i * 58; L(f, F, [[x, 300], [x, -120 - Math.sqrt(Math.max(0, 172 * 172 - (x + 22) * (x + 22)))]], 3, INK, { op: 0.7 }); }
  L(f, F, leaf.slice(1, 13), 5, '#c8a878', { op: 0.35 });
  for (const y of [-100, 60, 220]) { const q = [[-194, y - 14], [150, y - 14], [150, y + 14], [-194, y + 14]]; P(f, F, q, '#2e2e30', { dress: false }); for (let k = 0; k < 6; k++) f.rivet(F([[-180 + k * 60, y]])[0], 4, '#8a8a86'); }
  f.line(F(loop(ell([110, 60], 30, 34, 0, 16))), 12, INK); f.line(F(loop(ell([110, 60], 30, 34, 0, 16))), 7, IRONL); f.part(F(ell([110, 26], 12, 10, 0, 10)), { fill: '#2e2e30', shade: 0.4, inkW: 1.2 }); // the ring handle
  f.flat(F([[150, 300], [200, 300], [320, 330], [180, 330]]), '#060508', { op: 0.6 });
  return { focus: F([[180, 60]])[0], sig: SB(F, [-250, -370, 250, 300]), feat: [], ells: [] };
};
O.anchor = (f, o = {}) => { // a ship's anchor, whole and upright: ring, cross stock, long shank, the curved crown with two broad flukes; pale with salt, rimed when it freezes
  const F = frame([0, 0], o.ang ?? 0.08, 1), r = f.r, st = o.state || {}, IR = '#8a8e92';
  f.line(F(loop(ell([0, -330], 40, 40, 0, 20))), 26, INK); f.line(F(loop(ell([0, -330], 40, 40, 0, 20))), 17, IR); // the ring
  P(f, F, [[-24, -290], [24, -290], [20, 170], [-20, 170]], IR, { dressO: { op: 0.4 } }); lit(f, F, [[-12, -280], [-10, 150]], 5, 0.5); // shank
  P(f, F, [[-210, -250], [210, -250], [214, -222], [-214, -222]], '#6a4a2c', { tex: T(f, 'wood'), texOp: 0.9 }); for (const x of [-200, 200]) f.part(F(ell([x, -236], 12, 20, 0, 10)), { fill: IR, shade: 0.4, inkW: 1.4 }); // the wooden stock, iron caps
  const crown = []; for (let i = 0; i <= 14; i++) { const t = Math.PI * i / 14; crown.push([-230 * Math.cos(t), 100 + 120 * Math.sin(t)]); }
  L(f, F, crown, 54, INK); L(f, F, crown, 44, IR); L(f, F, crown.slice(2, 12), 6, '#f0f0ea', { op: 0.4 });
  for (const s of [-1, 1]) f.part(F([[s * 230, 96], [s * 300, 40], [s * 250, 170], [s * 200, 150]]), { fill: IR, shade: 0.4, inkW: 2, sharp: true }); // flukes
  for (let i = 0; i < 12; i++) { const p = crown[1 + Math.floor(r() * 13)]; f.part(F(ell(add(p, [(r() - 0.5) * 20, (r() - 0.5) * 16]), 6, 5, 0, 8)), { fill: '#d8d4c4', shade: 0.3, inkW: 0.8, cast: false }); } // barnacles
  D.bloom(f, F([[0, 0]])[0], 24, '#4f7a66', { n: 3 }); D.bloom(f, F([[-150, 200]])[0], 20, '#5a2a12', { n: 3 });
  if (st.frozen) K.fxReq(f, 'rime', F([[-240, 140]])[0], 140, { to: F([[240, 140]])[0] });
  return { focus: F([[0, 60]])[0], sig: SB(F, [-300, -375, 300, 230]), hook: F([[0, -370]])[0], feat: st.frozen ? ['rime'] : [], ells: [] };
};
O.broth = (f, o = {}) => { // a deep wooden bowl of broth frozen solid, seen from above and in front: a thick rim, the ice inside cracked, bones and roots locked in it, icicles at the lip
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, st = o.state || {};
  P(f, F, turned([[230, -20], [230, 40], [190, 140], [120, 190], [110, 220]]), OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  for (const y of [40, 120]) L(f, F, [[-226, y - 30], [0, y], [226, y - 30]], 3, INK, { op: 0.45 });
  f.part(F(ell([0, -20], 230, 80, 0, 32)), { fill: mix(OAKL, '#fff', 0.15), shade: 0.3, inkW: 2.2, cast: false });
  f.part(F(ell([0, -14], 200, 64, 0, 32)), { fill: st.frozen ? '#c8d4d6' : '#7a6040', shade: 0.25, inkW: 1.2, cast: false, tex: T(f, 'mottle'), texOp: 0.5 });
  if (st.frozen) { for (let i = 0; i < 6; i++) D.crack(f, F([[-120 + i * 50, -10]])[0], r() * 6, 50 + r() * 30, { n: 3, lip: '#f4f8fa' }); for (let i = 0; i < 7; i++) { const x = -200 + i * 66; f.flat(F([[x - 8, 20 + Math.abs(x) * 0.02], [x + 8, 20], [x, 70 + r() * 30]]), '#eef4f6', { op: 0.95 }); } }
  for (const [x, y, a] of [[-80, -20, 0.3], [20, -10, -0.2], [100, -30, 0.5]]) { const G = frame(F([[x, y]])[0], a, 1); f.part(G([[-26, -7], [20, -8], [28, 0], [20, 8], [-26, 7]]), { fill: '#d4c8a8', shade: 0.35, inkW: 1.2, cast: false }); }
  for (const [x, y] of [[-140, -30], [60, 14]]) f.part(F(ell([x, y], 22, 10, 0.4, 10)), { fill: '#8a6a3a', shade: 0.35, inkW: 1, cast: false });
  if (st.frozen) K.fxReq(f, 'rime', F([[-230, -20]])[0], 120, { to: F([[230, -20]])[0] }); else K.fxReq(f, 'steam', F([[0, -40]])[0], 110);
  return { focus: F([[0, -14]])[0], sig: SB(F, [-235, -105, 235, 225]), feat: st.frozen ? ['rime', 'contents'] : ['steam', 'contents'], ells: [80 / 230, 64 / 200] };
};
O.rod = (f, o = {}) => { // close on a lightning rod's crown: a heavy iron spike and copper ball on a thick shaft with its stay-collar, struck; scorch spreading on the iron
  const F = frame([0, 0], o.ang ?? 0.05, 1), r = f.r, COP = '#9a6a4a';
  P(f, F, limb([0, 330], [0, -60], 70, 60, { capB: false }), '#6a6c70', { dressO: { op: 0.45 } }); lit(f, F, [[-24, 320], [-22, -40]], 8, 0.45);
  for (const y of [120, 220]) { P(f, F, [[-84, y - 18], [84, y - 18], [86, y + 18], [-86, y + 18]], '#3e3e42', { dress: false }); for (const x of [-60, 0, 60]) f.rivet(F([[x, y]])[0], 6, '#9a9a96'); L(f, F, [[86, y], [260, y + 80]], 14, INK); L(f, F, [[86, y], [260, y + 80]], 8, IRON); } // the stay collars, wires out
  f.part(F(ell([0, -110], 96, 96, 0, 28)), { fill: COP, shade: 0.45, inkW: 2.2, tex: T(f, 'mottle'), texOp: 0.6 }); f.part(F(ell([-30, -140], 30, 22, -0.5, 12)), { fill: '#d8a888', shade: 0.2, inkW: 0, cast: false, opacity: 0.6 }); // the copper ball
  D.bloom(f, F([[50, -80]])[0], 24, '#4f7a66', { n: 3 });
  P(f, F, [[-40, -190], [40, -190], [0, -420]], '#7a7c80', { sharp: true, dress: false }); lit(f, F, [[-14, -200], [-3, -400]], 4, 0.6); // the spike
  for (let i = 0; i < 4; i++) { const a = -1.5 + (i - 1.5) * 0.5; D.crack(f, F([[0, -200 + i * 20]])[0], a + Math.PI / 2, 60 + r() * 40, { n: 4, lip: '#1a1008' }); }
  return { focus: F([[0, -420]])[0], sig: SB(F, [-100, -425, 100, 330]), feat: [], ells: [] };
};
O.scourge = (f, o = {}) => { // a scourge mid-lash: a thick bound handle and three heavy knotted leather thongs, each ending in a lead ball, flung out in an arc
  const F = frame([0, 0], o.ang ?? 0.1, 1), r = f.r;
  P(f, F, limb([-330, 170], [-170, 50], 56, 46, { capK: 0.6 }), OAKL, { tex: T(f, 'wood'), texOp: 0.9 }); lit(f, F, [[-320, 150], [-180, 36]], 6, 0.4);
  for (let i = 0; i < 6; i++) { const p = E.lp([-330, 170], [-170, 50], 0.38 + i * 0.1, 0); L(f, F, [add(p, [-20, -24]), add(p, [20, 24])], 6, INK); L(f, F, [add(p, [-20, -24]), add(p, [20, 24])], 3.4, '#3a2a1a'); }
  for (let k = 0; k < 3; k++) { const pts = [[-170, 50]]; let p = [-170, 50], ang = -0.7 + k * 0.45; for (let i = 0; i < 6; i++) { ang += 0.1 + r() * 0.06; p = add(p, rot([80, 0], ang)); pts.push(p); }
    L(f, F, pts, 20, INK); L(f, F, pts, 13, '#6a4a2a'); L(f, F, pts, 3, '#a8845a', { op: 0.5 });
    for (let i = 2; i < pts.length; i += 2) f.part(F(ell(pts[i], 15, 12, ang, 10)), { fill: '#4a3420', shade: 0.4, inkW: 1.4, cast: false }); // knots
    const end = pts[pts.length - 1]; f.part(F(ell(end, 24, 24, 0, 14)), { fill: '#6a6c70', shade: 0.45, inkW: 1.8 }); f.flat(F(ell(add(end, [-8, -8]), 7, 5, 0, 8)), '#e8e8e4', { op: 0.6 }); }
  return { focus: F([[100, -40]])[0], sig: SB(F, [-360, -260, 330, 200]), grip: { c: F([[-280, 130]])[0], thumb: (o.ang ?? 0.1) - 0.6 }, feat: [], ells: [] };
};
O.ratsack = (f, o = {}) => { // a sack burst at the seam and three rats pouring out of it onto the floor, whole: bodies, pink tails and feet, whiskers
  const F = frame([0, 0], o.ang ?? -0.05, 1), r = f.r, FUR = '#7a6a5e', PINK = '#c8907e';
  P(f, F, [[-260, 200], [-290, 60], [-240, -80], [-160, -170], [-120, -230], [-40, -230], [-10, -170], [60, -80], [90, 60], [60, 200]], '#8a7a5a', { tex: T(f, 'weave'), texOp: 0.9 });
  D.twine(f, F([[-130, -216], [-130, -206]]), F([[-30, -216], [-30, -206]]), 4, '#9a8460', { knot: F([[-26, -210]])[0] });
  f.part(F([[30, -40], [96, -60], [110, 60], [60, 150], [20, 80]]), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false }); // the split
  const rat = (c, ang, s) => { const G = frame(F([c])[0], ang, s);
    const tl = [[-70, 6], [-130, 30], [-190, 10], [-240, 40]]; f.line(G(tl), 10, INK); f.line(G(tl), 6, PINK);
    f.part(G([[-74, -10], [-20, -46], [40, -40], [86, -14], [110, 0], [86, 14], [40, 36], [-20, 40], [-74, 16]]), { fill: FUR, shade: 0.45, inkW: 1.8, tex: T(f, 'mottle'), texOp: 0.7 });
    L(f, G, [[-50, -30], [40, -30]], 5, '#c8b8a8', { op: 0.45 });
    f.part(G([[104, -6], [122, 0], [104, 6]]), { fill: PINK, shade: 0.3, inkW: 1, cast: false }); f.flat(G(ell([74, -14], 6, 6, 0, 8)), '#080606'); f.flat(G(ell([72, -16], 2, 2, 0, 6)), '#ffffff', { op: 0.8 });
    f.part(G(ell([50, -36], 14, 16, -0.4, 10)), { fill: PINK, shade: 0.4, inkW: 1.2, cast: false });
    for (const [x, y] of [[-40, 40], [40, 36]]) f.part(G(ell([x, y + 6], 10, 6, 0, 8)), { fill: PINK, shade: 0.3, inkW: 1, cast: false });
    for (const s2 of [-1, 1]) for (let k = 0; k < 3; k++) f.line(G([[112, 0], [150, s2 * (6 + k * 8)]]), 1, '#e8e0d0', { op: 0.85 }); };
  rat([150, 40], -0.2, 1.1); rat([250, 180], 0.15, 1.0); rat([60, 230], -0.05, 0.9);
  return { focus: F([[150, 60]])[0], sig: SB(F, [-300, -240, 380, 260]), hook: F([[-80, -228]])[0], feat: [], ells: [] };
};
O.reliquary = (f, o = {}) => { // a reliquary casket in three-quarter view: a little gabled house of lead on four gilt feet, a crystal window in its long side showing a bone, a cross on the ridge
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, LEAD = '#7e8082', d = [130, -70];
  const fr = [[-200, 160], [-200, -40], [100, -40], [100, 160]], side = [[100, 160], [100, -40], [100 + d[0], -40 + d[1]], [100 + d[0], 160 + d[1]]];
  P(f, F, side, mix(LEAD, '#000', 0.25), { sharp: true }); P(f, F, fr, LEAD, { sharp: true, tex: T(f, 'mottle'), texOp: 0.9 });
  const roofF = [[-220, -40], [120, -40], [120 + d[0] * 0.5, -150 + d[1] * 0.5], [-220 + d[0] * 0.5, -150 + d[1] * 0.5]], roofS = [[120, -40], [120 + d[0], -40 + d[1]], [120 + d[0] * 0.5, -150 + d[1] * 0.5]];
  P(f, F, roofS, mix(LEAD, '#000', 0.35), { sharp: true, dress: false }); P(f, F, roofF, mix(LEAD, '#fff', 0.1), { sharp: true });
  for (let i = 0; i < 7; i++) L(f, F, [lerp(roofF[0], roofF[1], i / 6), lerp(roofF[3], roofF[2], i / 6)], 2, INK, { op: 0.45 }); // roof tiles
  for (const e of [[roofF[3], roofF[2]], [fr[1], fr[2]], [fr[0], fr[3]], [fr[2], side[2]]]) { L(f, F, e, 9, INK); L(f, F, e, 6, GILT); } // gilt edging, worn
  const cr = lerp(roofF[3], roofF[2], 0.5); L(f, F, [cr, add(cr, [0, -90])], 12, INK); L(f, F, [cr, add(cr, [0, -90])], 8, GILT); L(f, F, [add(cr, [-30, -60]), add(cr, [30, -60])], 12, INK); L(f, F, [add(cr, [-30, -60]), add(cr, [30, -60])], 8, GILT); // the cross
  f.part(F([[-150, 120], [-150, 0], [50, 0], [50, 120]]), { fill: '#2a2c30', shade: 0.2, inkW: 2, cast: false, sharp: true }); // the window
  f.part(F([[-120, 80], [-90, 40], [-40, 50], [10, 30], [30, 60], [-10, 80], [-60, 70], [-100, 100]]), { fill: '#e0d4b4', shade: 0.35, inkW: 1.4, cast: false }); // the bone
  f.flat(F([[-150, 0], [-60, 0], [-150, 90]]), '#e8eef0', { op: 0.25 }); D.crack(f, F([[30, 10]])[0], 2.2, 60, { n: 4, lip: '#e8eef0' });
  for (const p of [fr[0], fr[3], side[3]]) { f.part(F([add(p, [-14, 0]), add(p, [14, 0]), add(p, [10, 34]), add(p, [-10, 34])]), { fill: GILT, shade: 0.4, inkW: 1.4 }); } // feet
  return { focus: F([[-50, 60]])[0], sig: SB(F, [-225, -250, 235, 195]), feat: [], ells: [] };
};
O.bell = (f, o = {}) => { // a bronze bell hung from its oak headstock: a flared lip, a dark mouth showing the clapper, bright where it is struck, verdigris
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, BR = '#9a7e50';
  P(f, F, [[-170, -330], [170, -330], [170, -280], [-170, -280]], OAK, { tex: T(f, 'wood'), texOp: 0.9, sharp: true }); // headstock
  for (const x of [-60, 60]) { L(f, F, [[x, -280], [x * 0.8, -230]], 14, INK); L(f, F, [[x, -280], [x * 0.8, -230]], 9, IRON); }
  const prof = [[60, -240], [90, -220], [110, -150], [124, -40], [150, 60], [200, 130], [220, 150]];
  P(f, F, turned(prof), BR, { tex: T(f, 'mottle'), texOp: 0.7 });
  L(f, F, [[-70, -210], [-96, -100], [-120, 40], [-170, 130]], 12, '#e8d8a8', { op: 0.5 }); // the lit shoulder
  for (const y of [-180, 60]) L(f, F, [[-118 - (y > 0 ? 30 : 0), y], [0, y + 10], [118 + (y > 0 ? 30 : 0), y]], 3, INK, { op: 0.6 });
  f.part(F(ell([0, 150], 220, 48, 0, 30)), { fill: '#120c08', shade: 0.1, inkW: 2.4, cast: false, hatch: false });
  L(f, F, ell([0, 150], 220, 48, 0, 30).slice(0, 16), 6, '#d8c08a', { op: 0.7 });
  L(f, F, [[0, -40], [30, 140]], 10, INK); f.part(F(ell([34, 160], 26, 22, 0, 12)), { fill: IRON, shade: 0.4, inkW: 1.6 });
  D.bloom(f, F([[-80, -40]])[0], 26, '#4f7a66', { n: 4, op: 0.6 }); D.bloom(f, F([[110, 90]])[0], 20, '#4f7a66', { n: 3, op: 0.6 });
  return { focus: F([[0, 40]])[0], sig: SB(F, [-225, -280, 225, 200]), feat: [], ells: [48 / 220] };
};

module.exports = { O };
