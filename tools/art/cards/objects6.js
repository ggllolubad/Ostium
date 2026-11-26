// The card object library, part six: the variety pass (L58). 466 object cards drew on 68 objects, so two cards of one
// calling often showed the same picture. These builders give each card a thing of its own, picked from the card's
// name and act (picks.json). Drawn for the 170 px thumbnail first (L45 to L47, L55, L56), same contract as objects4.js:
//   (f, o) => { focus, sig, hook?, grip?, mouth?, feat, ells }, with sig given as SB(F, box) in the object's frame.
// META carries each object's defaults (tilt, act, layouts, gold); samples.js registers them in objcomp's tables.
// Part six holds the Vessel's holy things and the shared helpers; objects7.js holds the Alchemist's and so on.
'use strict';
const K = require('./card_kit');
const SB = (F, b) => K.E.bbox(F([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]]));
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm, len } = E;

const C = { IRON: '#5e6064', IRONL: '#8a8c90', OAK: '#5b412a', OAKL: '#7a5a3a', LINEN: '#d8d0bc', STONE: '#7a766c', STONEL: '#9a968a', BRONZE: '#7a6a48',
  GILT: '#9a8450', GILTL: '#c8b47a', VELLUM: '#d8ccaa', WAX: '#7a1a12', PEWTER: '#8a8c86', CLAY: '#8a5e3e', COPPER: '#8a5a3a', IVORY: '#d8ccb0', HORN: '#8a6a44',
  GLASS: '#8a9a8a', TIN: '#9a9a94', RUST: '#5a2a12', VERD: '#4f7a66', TWINE: '#9a8460', LEATHER: '#5a3e28', BLOOD: '#5c0f0b' };
const INKS = { fire: '#8a3a26', frost: '#6a8494', lightning: '#857452', water: '#2e3e5a', toxin: '#5a6a34', void: '#3a2a44' };
const SIX = ['#8a3a26', '#6a8494', '#857452', '#2e3e5a', '#5a6a34', '#3a2a44'];
const T = (f, n) => n + f.o.seed;
const loop = pts => pts.concat([pts[0]]);
const L = (f, F, pts, w, col, o) => f.line(F(pts), w, col, o);
function P(f, F, pts, fill, o = {}) { const q = F(pts); f.part(q, Object.assign({ fill, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.6 }, o)); if (o.dress !== false) D.dress(f, q, Object.assign({ lw: 1.2, op: 0.45 }, o.dressO || {})); return q; }
// a turned body from a right-hand profile [[w, y], ...] top to bottom, closed on a base arc
const turned = (prof, k = 0.22) => { const right = prof.map(([w, y]) => [w, y]), left = prof.slice().reverse().map(([w, y]) => [-w, y]); const [wb, yb] = prof[prof.length - 1], arc = []; for (let i = 1; i < 10; i++) { const t = Math.PI * i / 10; arc.push([wb * Math.cos(t), yb + wb * k * Math.sin(t)]); } return [...right, ...arc, ...left]; };
const lit = (f, F, pts, w = 4, op = 0.55) => L(f, F, pts, w, '#f0e8d4', { op });   // a rim of light (L45)
// a stroked body (handle, strap, cord, tube): an ink outline, the fill, a lit line on the upper left
function tube(f, F, pts, w, col, o = {}) { L(f, F, pts, w + 7, INK); L(f, F, pts, w, col, o.dash ? { dash: o.dash } : undefined); if (o.lit !== false && w > 7) L(f, F, pts.map(p => add(p, [-w * 0.15, -w * 0.2])), Math.max(1.6, w * 0.16), o.litCol || '#f0e8d4', { op: o.litOp ?? 0.45 }); }
// an ellipse part: rims, openings, faces
const oval = (f, F, c, rx, ry, fill, o = {}) => f.part(F(ell(c, rx, ry, o.a || 0, o.n || 28)), Object.assign({ fill, shade: 0.3, inkW: 1.8, cast: false }, o));
const ring = (f, F, c, rx, ry, w, col, o = {}) => { f.line(F(loop(ell(c, rx, ry, o.a || 0, 28))), w + 6, INK); f.line(F(loop(ell(c, rx, ry, o.a || 0, 28))), w, col); };
// a tapered tube along a smoothed centreline (horns, handles, tails): the closed outline and its two sides
function sweep(cl, w0, w1, prof) {
  const c = K.catmull(cl, 6), n = c.length, A = [], B = [];
  for (let i = 0; i < n; i++) { const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], d = norm(sub(b, a)), nn = [-d[1], d[0]], t = i / (n - 1), w = (prof ? prof(t) : w0 + (w1 - w0) * t) / 2; A.push(add(c[i], mul(nn, w))); B.push(add(c[i], mul(nn, -w))); }
  return { poly: [...A, ...B.slice().reverse()], A, B, c };
}
// small dressings: chips along an edge, scratches, a stain
// cross-contour arcs over a turned body and hatching down its shadow side, clipped to the outline: big smooth fills read
// flat at card size (L3), so a body's form is carried in ink the way the bible's ink follows a form
function arcs(f, F, outline, ys, wOf, k = 0.22, o = {}) { D.contour(f, F(outline), ys.map(y => F(ell([0, y], wOf(y), wOf(y) * k, 0, 24).slice(1, 12))), { w: o.w || 1.5, op: o.op ?? 0.5, col: o.col }); }
function shadeR(f, F, outline, x0, x1, y0, y1, n = 10, o = {}) { const ls = []; for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * i / (n - 1); ls.push(F([[x, y0], [x + (o.slant ?? 6), (y0 + y1) / 2], [x + (o.slant ?? 6) * 2, y1]])); } D.contour(f, F(outline), ls, { w: o.w || 1.4, op: o.op ?? 0.45, col: o.col }); }
// fine diagonal grain over a whole part (dashed, light): a large smooth fill still reads flat at card size (L3), so it
// carries an even ground of ink lines the way an engraving does
function grain(f, F, outline, op = 0.25, step = 11, ang = 0.9, col = INK) { const bb = E.bbox(outline), d = [Math.cos(ang), Math.sin(ang)], n = [-d[1], d[0]], c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], R = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2, ls = []; for (let k = -R; k <= R; k += step) ls.push(F([add(c, add(mul(n, k), mul(d, -R))), add(c, add(mul(n, k), mul(d, R)))])); D.contour(f, F(outline), ls, { w: 1.1, op, col, dash: '12 5' }); }
function wear(f, F, pts, n = 3, ang = 0) { for (let i = 0; i < n; i++) D.chip(f, F([pts[i % pts.length]])[0], 7 + (i % 3) * 2, ang); }
const O = {}, META = {};

// ==== the Vessel's holy things (Cole: the Vessel is holy; worn gilt allowed on its cards)
O.oliphant = (f, o = {}) => { // an ivory hunting horn, its bell toward the light, gilt bands and a baldric strap: breath goes through it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const S = sweep([[-250, 150], [-120, 110], [10, 40], [120, -60], [190, -170]], 34, 150, t => 34 + 116 * Math.pow(t, 1.6));
  tube(f, F, [[-200, 136], [-150, 230], [40, 210], [110, -30]], 12, C.LEATHER, { lit: false });   // the strap, slung below
  P(f, F, S.poly, C.IVORY, { tex: T(f, 'mottle'), texOp: 0.7, dressO: { op: 0.3 } });
  L(f, F, S.A.slice(4, -3), 7, '#f8f2e4', { op: 0.55 });   // the lit upper flank
  for (let i = 0; i < 7; i++) { const k = 6 + i * 3; if (k < S.c.length) L(f, F, [S.A[k], lerp(S.A[k], S.B[k], 0.5), S.B[k]], 1.4, '#6a5a44', { op: 0.5 }); }   // growth rings round the ivory
  for (const t of [0.12, 0.55, 0.86]) { const k = Math.round(t * (S.c.length - 1)), a = S.A[k], b = S.B[k], d = norm(sub(b, a)), nn = [-d[1], d[0]], w = 14; P(f, F, [add(a, mul(nn, w)), add(b, mul(nn, w)), add(b, mul(nn, -w)), add(a, mul(nn, -w))], C.GILT, { dress: false, sharp: true }); L(f, F, [add(a, mul(nn, w - 4)), add(b, mul(nn, w - 4))], 2, C.GILTL, { op: 0.7 }); }
  const e = S.c[S.c.length - 1], d = norm(sub(e, S.c[S.c.length - 3])), ang = Math.atan2(d[1], d[0]) + Math.PI / 2;
  oval(f, F, e, 76, 26, C.GILT, { a: ang }); oval(f, F, add(e, mul(d, -2)), 62, 18, '#1a120c', { a: ang, hatch: false, shade: 0.1 });   // the bell's gilt rim and dark throat
  P(f, F, [[-262, 140], [-256, 170], [-236, 168], [-240, 136]], C.GILT, { dress: false });   // the mouthpiece
  D.crack(f, F([[-60, 70]])[0], -0.4, 60, { n: 4 }); D.stain(f, F([[0, 60]])[0], 30, '#5a4a30', { op: 0.3 }); f.scratches(F([[60, -10]])[0], 30, 6, '#fff8e8');
  K.fxReq(f, 'steam', F([add(e, mul(d, 30))])[0], 90, { col: '#c8c4b8' });
  return { focus: F([[60, 0]])[0], sig: SB(F, [-270, -220, 250, 180]), feat: [], ells: [26 / 76, 18 / 62] };
};
META.oliphant = { act: 'blow', gold: true };

O.organpipes = (f, o = {}) => { // six organ pipes standing in a mitre on their wind-chest: tin bodies, dark mouths with a lip, conical feet
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, H = [250, 320, 400, 380, 300, 236], X = [-225, -135, -45, 45, 135, 225];
  P(f, F, [[-290, 210], [290, 210], [300, 300], [-300, 300]], C.OAK, { tex: T(f, 'wood'), texOp: 0.9, sharp: true });   // the wind-chest
  f.part(F([[-290, 210], [290, 210], [310, 196], [-270, 196]]), { fill: C.OAKL, shade: 0.3, inkW: 1.6, cast: false, sharp: true });
  L(f, F, [[-300, 250], [300, 250]], 6, C.GILT); for (const x of [-250, -80, 80, 250]) f.rivet(F([[x, 276]])[0], 4, '#6a5a40');
  X.forEach((x, i) => { const w = 34 - Math.abs(i - 2.5) * 2, top = 150 - H[i], col = mix(C.TIN, '#5a5a56', (i % 2) * 0.25);
    P(f, F, [[x - w, top], [x + w, top], [x + w, 140], [x + 6, 204], [x - 6, 204], [x - w, 140]], col, { tex: T(f, 'mottle'), texOp: 0.5, dressO: { op: 0.35 } });
    oval(f, F, [x, top], w, w * 0.26, '#1a1612', { shade: 0.1 }); L(f, F, ell([x, top], w, w * 0.26, 0, 20).slice(10, 20), 2.4, '#e8e8e0', { op: 0.6 });
    const my = 140 - 26; f.part(F([[x - w * 0.6, my + 22], [x - w * 0.6, my], [x, my - 12], [x + w * 0.6, my], [x + w * 0.6, my + 22]]), { fill: '#14100c', shade: 0.1, inkW: 1.6, cast: false });   // the mouth
    L(f, F, [[x - w * 0.6, my + 24], [x + w * 0.6, my + 24]], 3, '#e8e8e0', { op: 0.7 });
    L(f, F, [[x - w + 7, top + 12], [x - w + 7, 130]], 5, '#f4f4ec', { op: 0.5 }); L(f, F, [[x + w - 9, top + 20], [x + w - 9, 130]], 6, '#2a2a28', { op: 0.35 }); });
  D.bloom(f, F([[150, 100]])[0], 16, '#5a5a4a', { n: 2, op: 0.4 }); D.chip(f, F([[-200, 212]])[0], 9, 0);
  return { focus: F([[0, -60]])[0], sig: SB(F, [-300, -260, 300, 300]), feat: [], ells: [0.26] };
};
META.organpipes = { act: 'blow', gold: true, only: ['close', 'ledge', 'niche', 'floor'] };

O.pulley = (f, o = {}) => { // a block and tackle: an oak-shelled pulley block on an iron strap and hook, the sheave showing, a rope rove over it, a cargo hook below
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  tube(f, F, [[0, -330], [0, -280]], 22, C.IRON); ring(f, F, [0, -350], 26, 26, 12, C.IRON);   // the top eye
  const shell = [[-100, -270], [100, -270], [128, -200], [130, -60], [100, 10], [-100, 10], [-130, -60], [-128, -200]];
  D.slab(f, F(shell), [12, 8]); P(f, F, shell, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  f.part(F([[-50, -250], [50, -250], [54, -20], [-54, -20]]), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false });   // the slot
  oval(f, F, [0, -140], 52, 88, '#6a6c70', { shade: 0.4 }); oval(f, F, [0, -140], 14, 14, C.IRONL); f.rivet(F([[0, -140]])[0], 5, '#c8c8c4');   // the sheave and its pin
  for (const s of [-1, 1]) { L(f, F, [[s * 120, -240], [s * 124, -20]], 14, INK); L(f, F, [[s * 120, -240], [s * 124, -20]], 9, C.IRON); for (const y of [-200, -60]) f.rivet(F([[s * 121, y]])[0], 4, '#9a9a96'); }
  tube(f, F, [[-50, -150], [-130, 90], [-250, 250]], 22, '#a89470', { dash: '10 4' }); tube(f, F, [[50, -150], [60, 60], [56, 150]], 22, '#a89470', { dash: '10 4' });
  for (let i = 0; i < 3; i++) { const c = [-240 - i * 10, 250 + i * 26]; f.part(F(ell(c, 120 - i * 10, 22, 0.05, 20)), { fill: '#a89470', shade: 0.4, inkW: 2, cast: false, tex: T(f, 'weave'), texOp: 0.6 }); }   // the fall of the rope coiled on the floor
  P(f, F, [[36, 150], [76, 150], [80, 190], [32, 190]], C.IRON, { dress: false });
  const hk = [[56, 190], [56, 250], [40, 300], [0, 310], [-30, 280], [-24, 250]]; tube(f, F, hk, 22, C.IRON);
  P(f, F, [[-40, 236], [-10, 250], [-24, 262]], C.IRONL, { dress: false, sharp: true });
  for (let i = 0; i < 3; i++) D.chip(f, F([[-90 + i * 80, -268]])[0], 8, 0); D.bloom(f, F([[30, 280]])[0], 14, C.RUST, { n: 2 });
  return { focus: F([[0, -140]])[0], sig: SB(F, [-370, -380, 140, 320]), hook: F([[0, -372]])[0], feat: [], ells: [] };
};
META.pulley = { act: 'swing' };

O.millstone = (f, o = {}) => { // a millstone stood on edge in three-quarter view: a thick dressed disc, its square eye and iron rynd, the harp furrows cut in its face
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, R = 250, ry = R, rx = R * 0.86, c = [-24, 0];
  const rim = [...ell([c[0] + 70, c[1]], rx, ry, 0, 40).slice(10, 31), ...ell(c, rx, ry, 0, 40).slice(10, 31).reverse()];
  P(f, F, rim, mix(C.STONE, '#000', 0.25), { sharp: false, tex: T(f, 'mottle'), texOp: 0.9 });   // the thickness, its edge to the right
  for (let i = 0; i < 9; i++) L(f, F, [add(c, [rx * Math.cos(-1 + i * 0.24), ry * Math.sin(-1 + i * 0.24)]), add(c, [70 + rx * Math.cos(-1 + i * 0.24), ry * Math.sin(-1 + i * 0.24)])], 1.6, INK, { op: 0.5 });
  const face = ell(c, rx, ry, 0, 48); P(f, F, face, C.STONEL, { tex: T(f, 'mottle'), texOp: 1, dressO: { op: 0.4 } });
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; for (let j = 0; j < 4; j++) { const a2 = a + j * 0.12, p0 = add(c, [Math.cos(a) * 70 * 0.86, Math.sin(a) * 70]), p1 = add(c, [Math.cos(a2 + 0.5) * (rx - 16), Math.sin(a2 + 0.5) * (ry - 16)]); L(f, F, [lerp(p0, p1, j * 0.18), p1], 3, INK, { op: 0.6 }); L(f, F, [lerp(p0, p1, j * 0.18), p1].map(q => add(q, [-2, -3])), 1.6, '#e8e4d8', { op: 0.4 }); } }   // the harp furrows
  L(f, F, ell(c, rx - 8, ry - 8, 0, 48).slice(20, 36), 6, '#f0ece0', { op: 0.45 });   // the lit upper-left edge
  oval(f, F, c, 64, 74, '#16120e', { sharp: false, hatch: false, shade: 0.1, inkW: 2.4 });   // the eye
  P(f, F, [[c[0] - 80, c[1] - 14], [c[0] + 80, c[1] - 14], [c[0] + 80, c[1] + 14], [c[0] - 80, c[1] + 14]], C.IRON, { dress: false });   // the rynd across it
  for (const x of [-70, 70]) f.rivet(F([[c[0] + x, c[1]]])[0], 5, '#9a9a96');
  D.chip(f, F([[c[0] - rx + 10, 40]])[0], 14, 1.6); D.chip(f, F([[c[0], -ry + 8]])[0], 12, 0); D.crack(f, F([[c[0] + 120, 60]])[0], 0.9, 110, { n: 5 }); D.bloom(f, F([[c[0] - 90, 140]])[0], 26, '#4a5a36', { n: 3, op: 0.4 });
  return { focus: F([c])[0], sig: SB(F, [-260, -250, 310, 250]), feat: [], ells: [] };
};
META.millstone = { act: 'press', only: ['close', 'ledge', 'floor', 'niche'] };

O.yoke = (f, o = {}) => { // a carrier's oak shoulder yoke, carved to the neck, two hooped buckets hanging from its ends on cords, water slopping
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const top = [[-330, -220], [-200, -250], [-80, -246], [-40, -210], [0, -196], [40, -210], [80, -246], [200, -250], [330, -220]];
  const bot = [[330, -186], [200, -206], [90, -200], [50, -170], [0, -156], [-50, -170], [-90, -200], [-200, -206], [-330, -186]];
  P(f, F, [...top, ...bot], C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 }); lit(f, F, top.slice(0, 4), 5, 0.5);
  for (const s of [-1, 1]) { const end = [s * 300, -200], b = [s * 300, 120];
    tube(f, F, [end, add(b, [-70, -100])], 7, C.TWINE, { lit: false }); tube(f, F, [end, add(b, [70, -100])], 7, C.TWINE, { lit: false });
    const bk = [[-92, -100], [92, -100], [78, 110], [-78, 110]].map(p => add(p, b));
    P(f, F, bk, C.OAK, { tex: T(f, 'wood'), texOp: 0.9 });
    for (let i = 1; i < 5; i++) L(f, F, [add(b, [-92 + i * 37, -100]), add(b, [-78 + i * 31, 110])], 1.8, INK, { op: 0.7 });
    for (const y of [-60, 70]) { L(f, F, [add(b, [-90, y]), add(b, [90, y])], 12, INK); L(f, F, [add(b, [-88, y]), add(b, [88, y])], 7, C.IRON); }
    oval(f, F, add(b, [0, -100]), 92, 22, mix(C.OAKL, '#fff', 0.1)); oval(f, F, add(b, [0, -96]), 80, 16, '#2e3e4a', { shade: 0.2 });   // the rim and the water
    L(f, F, ell(add(b, [0, -96]), 60, 10, 0, 16).slice(9, 14), 2, '#c8d4d8', { op: 0.7 });
    K.fxReq(f, 'drip', F([add(b, [s * 70, -96])])[0], 3, { col: '#2e3e4a' }); D.bloom(f, F([add(b, [30, 70])])[0], 12, C.RUST, { n: 2 }); }
  for (const x of [-300, 300]) f.rivet(F([[x, -210]])[0], 6, '#6a6a66');
  return { focus: F([[0, -100]])[0], sig: SB(F, [-400, -260, 400, 240]), feat: ['contents'], ells: [22 / 92, 16 / 80] };
};
META.yoke = { act: 'drip', only: ['close', 'floor', 'ledge'] };

O.aspergillum = (f, o = {}) => { // a holy-water sprinkler: a pierced gilt ball on a short thick grip, flicked, drops flying from its holes
  const F = frame([0, 0], o.ang ?? -0.7, 1), r = f.r;
  P(f, F, limb([0, 330], [0, 80], 46, 56, { capB: false }), C.OAK, { tex: T(f, 'wood'), texOp: 0.9 });
  for (let i = 0; i < 6; i++) L(f, F, [[-24, 300 - i * 34], [24, 290 - i * 34]], 3, INK, { op: 0.55 });   // the cord grip
  P(f, F, [[-40, 90], [40, 90], [34, 40], [-34, 40]], C.GILT, { dress: false });
  f.part(F(ell([0, 36], 44, 12, 0, 18)), { fill: C.GILTL, shade: 0.3, inkW: 1.4, cast: false });
  P(f, F, ell([0, -120], 150, 150, 0, 40), C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  L(f, F, ell([0, -120], 136, 136, 0, 40).slice(18, 30), 9, C.GILTL, { op: 0.6 });   // the lit shoulder
  for (const y of [-60, -170]) L(f, F, ell([0, y], 140 * Math.cos(Math.asin((y + 120) / 150)), 26, 0, 30).slice(0, 16), 3, INK, { op: 0.7 });
  for (let i = 0; i < 14; i++) { const a = -0.3 + (i % 7) * 0.5, y = i < 7 ? -100 : -190, rr = 150 * Math.cos(Math.asin((y + 120) / 150)) * 0.9, x = Math.sin(a) * rr; if (Math.cos(a) > 0.2) f.part(F(ell([x, y], 9 * Math.cos(a) + 3, 9, 0, 10)), { fill: '#120c08', shade: 0.1, inkW: 1.2, cast: false }); }
  P(f, F, [[-12, -270], [12, -270], [10, -300], [-10, -300]], C.GILT, { dress: false }); oval(f, F, [0, -306], 18, 14, C.GILT);
  f.scratches(F([[60, -80]])[0], 40, 8, '#f0e0a8'); D.bloom(f, F([[-60, -40]])[0], 20, '#3a3020', { n: 2, op: 0.5 }); D.chip(f, F([[110, -150]])[0], 8, 0.7);
  for (let i = 0; i < 7; i++) K.fxReq(f, 'drip', F([[-120 + i * 45, -260 + (i % 3) * 30]])[0], 3, { col: '#8aa4b4' });   // holy water flung off the ball, so it reads as a sprinkler (blind test: a perforated ball)
  return { focus: F([[0, -120]])[0], sig: SB(F, [-160, -320, 160, 180]), grip: { c: F([[0, 240]])[0], thumb: (o.ang ?? -0.7) - Math.PI / 2 }, feat: ['contents'], ells: [12 / 44] };
};
META.aspergillum = { act: 'fling', gold: true, ang: -0.7 };

O.swallow = (f, o = {}) => { // a swallow in flight from below and to the side: swept wings, the long forked tail, dark blue back, pale belly, rufous throat
  const F = frame([0, 0], o.ang ?? -0.12, 1), r = f.r, BK = '#1e2230', BE = '#d8d0bc', TH = '#8a4a2a';
  const wing = s => [[20, s * 10], [-10, s * 60], [-80, s * 170], [-190, s * 270], [-230, s * 300], [-200, s * 250], [-150, s * 150], [-90, s * 60], [-40, s * 20]];
  for (const s of [1, -1]) { const w = wing(s).map(([x, y]) => [x + (s > 0 ? 40 : 0), y]); P(f, F, w, s > 0 ? '#2a3040' : BK, { tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.3 } }); for (let k = 0; k < 6; k++) L(f, F, [[-20 - k * 22, s * (30 + k * 14)], [-90 - k * 26, s * (120 + k * 30)]], 1.6, '#6a7080', { op: 0.6 }); L(f, F, w.slice(0, 4), 3, '#8a90a0', { op: 0.6 }); }
  const tail = [[-120, -20], [-260, -70], [-340, -110], [-250, -30], [-230, 0], [-250, 30], [-340, 110], [-260, 70], [-120, 20]];
  P(f, F, tail, BK, { dressO: { op: 0.3 } }); for (const s of [-1, 1]) f.part(F(ell([-250, s * 40], 10, 5, s * 0.4, 8)), { fill: BE, shade: 0.3, inkW: 0.8, cast: false });
  const body = [[160, 0], [140, -34], [80, -50], [-20, -44], [-140, -20], [-150, 0], [-140, 20], [-20, 44], [80, 50], [140, 34]];
  P(f, F, body, BE, { tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.25 } });
  f.part(F([[160, 0], [140, -34], [80, -50], [40, -40], [70, -10], [100, 30], [140, 34]]), { fill: TH, shade: 0.35, inkW: 1.4, cast: false });   // the throat
  f.part(F([[160, -6], [200, 0], [160, 8]]), { fill: '#1a1410', shade: 0.2, inkW: 1.2, cast: false, sharp: true }); oval(f, F, [132, -14], 9, 9, '#0c0a08'); f.flat(F(ell([129, -17], 3, 3, 0, 6)), '#f0f0e8');
  L(f, F, [[150, -24], [60, -46], [-60, -40]], 4, '#f8f4ea', { op: 0.6 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-345, -305, 205, 305]), feat: [], ells: [] };
};
META.swallow = { act: 'fling', only: ['close'] };

O.spoon = (f, o = {}) => { // a carved horn spoon, its deep bowl brimming with one dark drop of the brew, the handle ending in a knop (objOpt pair: a second spoon crossed behind it, the second dose, L72)
  let back = null; if (o.pair) back = O.spoon(f, Object.assign({}, o, { pair: false, marks: 0, ang: (o.ang ?? -0.5) + 0.7 }));
  const F = frame([0, 0], o.ang ?? -0.5, 1), r = f.r, ink = INKS[o.course] || '#2a1e16', empty = (o.state || {}).empty;
  const bowl = ell([0, -150], 120, 165, 0, 40); P(f, F, bowl, C.HORN, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, bowl, 0.3);
  f.part(F(ell([6, -160], 96, 136, 0, 36)), { fill: mix(C.HORN, '#000', 0.35), shade: 0.4, inkW: 1.6, cast: false }); grain(f, F, ell([6, -160], 96, 136, 0, 36), 0.4, 8, -0.4, '#e8d0a8');   // the hollow
  if (!empty && o.fill) { f.part(F(ell([6, -160], 94, 132, 0, 36)), { fill: o.fill, shade: 0.25, inkW: 1.4, cast: false }); f.flat(F(ell([-30, -200], 30, 40, 0.2, 12)), '#f8ecc8', { op: 0.6 }); D.wax(f, F([[90, -110], [100, -80]]), o.fill, { thick: 8, drips: 1, dripL: 60 }); }   // objOpt fill: brimming over with a bright dose (L72 twin: Spoonful against the empty Tasting Spoon)
  else if (!empty) { f.part(F(ell([16, -130], 70, 90, 0, 30)), { fill: ink, shade: 0.2, inkW: 1.2, cast: false }); f.flat(F(ell([-6, -160], 24, 30, 0.2, 12)), '#9a96a0', { op: 0.5 }); }
  L(f, F, ell([0, -150], 110, 155, 0, 40).slice(14, 26), 7, '#f0dcb0', { op: 0.5 });
  const h = sweep([[0, 10], [6, 120], [10, 240], [8, 330]], 56, 34); P(f, F, h.poly, C.HORN, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, h.poly, 0.3, 10, -0.3);
  oval(f, F, [8, 350], 40, 36, mix(C.HORN, '#000', 0.15), { shade: 0.4 }); for (let i = 0; i < 4; i++) L(f, F, [[-20, 290 - i * 40], [30, 286 - i * 40]], 2, INK, { op: 0.5 });
  lit(f, F, h.A.slice(2, -2), 4, 0.45); D.crack(f, F([[60, -250]])[0], 1.4, 60, { n: 3 }); D.chip(f, F([[-110, -120]])[0], 8, -1.5); D.stain(f, F([[30, 150]])[0], 20, '#3a2414', { op: 0.3 });
  if (!empty) K.fxReq(f, 'drip', F([[100, -60]])[0], 2, { col: ink });
  if (o.marks) { for (let k = 0; k < o.marks; k++) { L(f, F, [[-34, 60 + k * 50], [34, 56 + k * 50]], 7, INK); L(f, F, [[-30, 64 + k * 50], [30, 60 + k * 50]], 2, '#f0dcb0', { op: 0.7 }); } if (!empty) f.part(F(ell([60, -230], 14, 18, 0, 10)), { fill: ink, shade: 0.3, inkW: 1.2, cast: false }); }   // a measuring spoon: one scored line per dose
  const sig = SB(F, [-125, -320, 125, 120]), both = back ? [Math.min(sig[0], back.sig[0]), Math.min(sig[1], back.sig[1]), Math.max(sig[2], back.sig[2]), Math.max(sig[3], back.sig[3])] : sig;
  return { focus: F([[0, -150]])[0], sig: both, grip: { c: F([[8, 260]])[0], thumb: (o.ang ?? -0.5) - Math.PI / 2 }, feat: empty ? [] : ['contents'], ells: [] };
};
META.spoon = { act: 'drip', ang: -0.5 };

O.diptych = (f, o = {}) => { // a hinged diptych stood open like a book: two gilt-framed leaves, a saint in each with a gilt nimbus, the two halves facing
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const leaf = (pts, s) => { D.slab(f, F(pts.map(p => [p[0], p[1], 1])), [s * 10, 8], '#3a2e14'); P(f, F, pts, C.GILT, { tex: T(f, 'mottle'), texOp: 1, sharp: true }); shadeR(f, F, pts.map(p => [p[0], p[1], 1]), -320, 300, -280, 260, 46, { slant: 20, op: 0.4, w: 1.3 }); for (let i = 0; i < 4; i++) L(f, F, [lerp(pts[i], pts[(i + 1) % 4], 0.08), lerp(pts[i], pts[(i + 1) % 4], 0.92)], 2.4, i < 2 ? C.GILTL : '#4a3a1c', { op: 0.7 }); };
  const Lf = [[-300, -200], [-10, -260], [-10, 240], [-300, 220]], Rt = [[10, -260], [280, -210], [280, 210], [10, 240]];
  leaf(Lf, -1); leaf(Rt, 1);
  const inset = (q, k) => { const c = q.reduce((a, b) => add(a, b), [0, 0]).map(v => v / 4); return q.map(p => lerp(p, c, k)); };
  for (const [q, dark, s] of [[Lf, '#2e3e5a', -1], [Rt, '#3a2a44', 1]]) { const pan = inset(q, 0.14).map(p => [p[0], p[1], 1]); f.part(F(pan), { fill: mix(dark, '#8a8a9a', 0.25), shade: 0.3, inkW: 1.8, cast: false, tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, pan, 0.45, 8, 0.9, '#0e0c10'); grain(f, F, pan, 0.3, 13, -0.6, '#e8e0d0');
    const c = pan.reduce((a, b) => add(a, b), [0, 0]).map(v => v / 4), head = add(c, [0, -90]);
    oval(f, F, head, 62, 66, C.GILTL, { shade: 0.3 }); ring(f, F, head, 62, 66, 3, C.GILT);   // the nimbus
    oval(f, F, add(head, [0, 6]), 28, 34, '#b8957a', { shade: 0.35 }); L(f, F, [add(head, [-10, 4]), add(head, [-4, 4])], 2, INK); L(f, F, [add(head, [6, 4]), add(head, [12, 4])], 2, INK);
    f.part(F([add(head, [-34, 40]), add(head, [34, 40]), add(head, [70, 230]), add(head, [-70, 230])]), { fill: s < 0 ? '#5a3a2a' : '#4a4a3a', shade: 0.4, inkW: 1.6, cast: false });
    for (let k = 0; k < 3; k++) L(f, F, [add(head, [-20 + k * 20, 60]), add(head, [-30 + k * 30, 220])], 2, INK, { op: 0.5 }); }
  for (const y of [-180, 150]) { P(f, F, [[-14, y], [14, y], [14, y + 40], [-14, y + 40]], C.IRON, { dress: false }); f.rivet(F([[0, y + 20]])[0], 4, '#c8c8c4'); }
  L(f, F, [[-296, -196], [-14, -254]], 4, C.GILTL, { op: 0.7 }); for (const q of [Lf, Rt]) for (let i = 0; i < 5; i++) D.chip(f, F([lerp(q[i % 4], q[(i + 1) % 4], 0.3 + 0.1 * i)])[0], 6, 0); D.chip(f, F([[-150, -226]])[0], 9, -0.2); D.chip(f, F([[200, 214]])[0], 9, 0); D.crack(f, F([[150, -100]])[0], 1.2, 70, { n: 4 });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-310, -270, 290, 250]), feat: [], ells: [] };
};
META.diptych = { act: 'open', gold: true, only: ['close', 'ledge', 'niche', 'table'] };

O.bucket = (f, o = {}) => { // an oak bucket with two iron hoops and a bail handle, brimming and slopping over the lip
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, w = o.course && INKS[o.course] ? mix(INKS[o.course], '#2e3e4a', 0.5) : '#2e3e4a', empty = (o.state || {}).empty;
  const body = [[-170, -150], [170, -150], [140, 200], [-140, 200]];
  P(f, F, [...body.slice(0, 2), ...turned([[170, -150], [140, 200]], 0.25).slice(1)], C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  for (let i = 1; i < 7; i++) { const t = i / 7; L(f, F, [[-170 + 340 * t, -150], [-140 + 280 * t, 206 + Math.sin(t * Math.PI) * 26]], 2, INK, { op: 0.75 }); }
  for (const [y, wd] of [[-100, 164], [150, 146]]) { const q = ell([0, y], wd, wd * 0.25, 0, 30).slice(0, 16); L(f, F, q, 16, INK); L(f, F, q, 10, C.IRON); for (let k = 2; k < 15; k += 4) f.rivet(F([q[k]])[0], 3, '#8a8a86'); }
  oval(f, F, [0, -150], 170, 42, mix(C.OAKL, '#fff', 0.12)); oval(f, F, [0, -146], 152, 32, empty ? '#1a120c' : w, { shade: 0.2 });
  if (!empty) L(f, F, ell([0, -146], 110, 20, 0, 20).slice(11, 17), 3, '#c8d4d8', { op: 0.7 });
  tube(f, F, [[-176, -130], [-150, -300], [0, -350], [150, -300], [176, -130]], 12, C.IRON); for (const s of [-1, 1]) oval(f, F, [s * 178, -126], 14, 14, C.IRON);
  if (!empty) { const sp = [[150, -150], [180, -110], [176, -40]]; L(f, F, sp, 18, INK); L(f, F, sp, 12, w); }
  D.bloom(f, F([[90, 120]])[0], 18, C.RUST, { n: 2 }); D.chip(f, F([[-140, -150]])[0], 9, 0); D.stain(f, F([[-60, 60]])[0], 40, '#2a1a0c', { op: 0.3 });
  return { focus: F([[0, -80]])[0], sig: SB(F, [-190, -360, 190, 230]), hook: F([[0, -352]])[0], grip: { c: F([[0, -345]])[0], thumb: (o.ang ?? 0) + Math.PI / 2 }, mouth: empty ? undefined : F([[176, -40]])[0], feat: empty ? [] : ['contents'], ells: [42 / 170, 32 / 152, 0.25] };
};
META.bucket = { act: 'pour' };

O.dividers = (f, o = {}) => { // iron wing dividers opened on a page: a round hinge head, two thick tapering legs, the quadrant wing and its screw
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const s of [-1, 1]) { const leg = [[s * 10, -240], [s * 84, -200], [s * 200, 300], [s * 160, 300]]; P(f, F, leg, C.IRON, { sharp: true, dressO: { op: 0.4 } }); lit(f, F, [[s * 18 - 6, -220], [s * 178 - 6, 290]], 3, 0.6); }
  const arc = K.arc([0, -230], 250, 250, 55, 125, 16); L(f, F, arc, 50, INK); L(f, F, arc, 40, C.IRONL); for (let i = 1; i < 16; i += 2) L(f, F, [arc[i], lerp(arc[i], [0, -230], 0.08)], 2, INK, { op: 0.7 });
  oval(f, F, [104, -10], 22, 22, C.IRON); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; L(f, F, [add([104, -10], [Math.cos(a) * 22, Math.sin(a) * 22]), add([104, -10], [Math.cos(a) * 30, Math.sin(a) * 30])], 4, INK); }
  oval(f, F, [0, -240], 100, 100, C.IRON, { shade: 0.45, tex: T(f, 'mottle'), texOp: 0.8 }); oval(f, F, [0, -240], 34, 34, C.IRONL); f.rivet(F([[0, -240]])[0], 8, '#c8c8c4');
  ring(f, F, [0, -342], 30, 26, 10, C.IRON);
  D.bloom(f, F([[60, 80]])[0], 16, C.RUST, { n: 2 }); D.bloom(f, F([[-120, 200]])[0], 12, C.RUST, { n: 2 }); D.chip(f, F([[-60, -250]])[0], 8, 0);
  return { focus: F([[0, -100]])[0], sig: SB(F, [-210, -380, 210, 305]), feat: [], ells: [] };
};
META.dividers = { act: 'press', only: ['close', 'table', 'ledge'] };

O.icon = (f, o = {}) => { // a small painted icon in a gilt frame with an arched top: a saint's head in a great gilt nimbus, dark robe, hands raised
  const F = frame([0, 0], o.ang ?? -0.05, 1), r = f.r;
  const arch = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; arch.push([-260 * Math.cos(t), -140 - 150 * Math.sin(t)]); }
  const out = [[-260, 280, 1], ...arch, [260, 280, 1]]; D.slab(f, F(out), [14, 10], '#3a2e14'); P(f, F, out, C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  const inner = out.map(([x, y]) => [x * 0.82, y > 0 ? y - 40 : y * 0.86 + 12]); f.part(F(inner), { fill: '#2a2234', shade: 0.3, inkW: 2, cast: false });
  oval(f, F, [0, -150], 130, 130, C.GILTL, { shade: 0.35, tex: T(f, 'mottle'), texOp: 0.5 }); ring(f, F, [0, -150], 130, 130, 4, C.GILT);
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; L(f, F, [add([0, -150], [Math.cos(a) * 80, Math.sin(a) * 80]), add([0, -150], [Math.cos(a) * 122, Math.sin(a) * 122])], 2, mix(C.GILT, '#000', 0.3), { op: 0.7 }); }   // tooled rays in the gilt
  f.part(F(ell([0, -146], 52, 70, 0, 22)), { fill: '#a8846a', shade: 0.4, inkW: 1.8, cast: false });
  L(f, F, [[-26, -150], [-10, -152]], 3, INK); L(f, F, [[10, -152], [26, -150]], 3, INK); L(f, F, [[0, -140], [-4, -116], [4, -112]], 1.6, INK, { op: 0.7 }); L(f, F, [[-12, -96], [12, -96]], 2, INK, { op: 0.8 });
  f.part(F([[-70, -66], [70, -66], [150, 120], [170, 254], [-170, 254], [-150, 120]]), { fill: '#3a3a52', shade: 0.4, inkW: 1.8, cast: false });
  for (let k = 0; k < 4; k++) L(f, F, [[-40 + k * 26, -40], [-90 + k * 60, 250]], 3, C.GILT, { op: 0.6 });   // gold hatching on the robe (chrysography)
  for (const s of [-1, 1]) f.part(F(ell([s * 96, 30], 26, 34, s * 0.3, 12)), { fill: '#a8846a', shade: 0.4, inkW: 1.4, cast: false });
  D.chip(f, F([[-150, 260]])[0], 10, 0); D.chip(f, F([[120, -250]])[0], 9, 0.8); D.crack(f, F([[90, 120]])[0], 1.2, 80, { n: 4 }); D.stain(f, F([[60, 200]])[0], 40, '#1a120c', { op: 0.3 });
  return { focus: F([[0, -150]])[0], sig: SB(F, [-270, -300, 275, 290]), feat: [], ells: [] };
};
META.icon = { act: 'glare', gold: true, only: ['close', 'niche', 'ledge'] };

O.sponge = (f, o = {}) => { // a sea sponge on the end of a hyssop reed, squeezed: a bold lobed outline, pitted with dark pores, liquid running from it
  const F = frame([0, 0], o.ang ?? -0.3, 1), r = f.r, col = '#b8985a', ink = INKS[o.course] || '#2a1e16';
  P(f, F, limb([0, 360], [0, 120], 30, 34, { capB: false }), '#7a7a4a', { tex: T(f, 'mottle'), texOp: 0.6 }); for (const y of [320, 230]) L(f, F, [[-18, y], [18, y - 6]], 4, INK, { op: 0.7 });
  const out = []; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, rr = (i % 2 ? 170 : 196) + (i % 5) * 6; out.push([Math.cos(a) * rr * 1.08, -60 + Math.sin(a) * rr * 0.9]); }
  P(f, F, out, col, { tex: T(f, 'mottle'), texOp: 0.9, dressO: { op: 0.35 } });
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 150, c = [Math.cos(a) * d * 1.05, -60 + Math.sin(a) * d * 0.85], s = 6 + r() * 12; f.part(F(ell(c, s, s * 0.8, r() * 3, 10)), { fill: '#2a1e10', shade: 0.1, inkW: 1, cast: false, hatch: false }); f.line(F(ell(c, s + 2, s * 0.8 + 2, 0, 10).slice(5, 9)), 1.4, '#f0e0b8', { op: 0.6 }); }
  L(f, F, out.slice(11, 17), 8, '#f0e0b8', { op: 0.45 });
  f.flat(F(ell([40, 80], 120, 50, 0, 18)), ink, { op: 0.55 });   // the soak in its lower half
  for (let i = 0; i < 3; i++) K.fxReq(f, 'drip', F([[-60 + i * 60, 100]])[0], 3, { col: ink });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-215, -240, 215, 200]), grip: { c: F([[0, 300]])[0], thumb: (o.ang ?? -0.3) - Math.PI / 2 }, feat: ['contents'], ells: [] };
};
META.sponge = { act: 'drip' };

O.thurible = (f, o = {}) => { // a censer swung on its three chains from a ring: a pierced domed lid over a round bowl on a foot, smoke pouring from the holes
  const F0 = frame([0, 0], o.ang ?? 0.12, 1), F = pts => F0(pts.map(p => p.length > 2 ? [p[0] * 1.4, p[1], p[2]] : [p[0] * 1.4, p[1]])), r = f.r;   // drawn wide: a tall thin censer could not fill the frame (L13)
  const top = [0, -300]; ring(f, F, top, 30, 24, 10, C.GILT);
  for (const x of [-150, 0, 150]) { const ch = [add(top, [x * 0.1, 20]), [x, -60]]; L(f, F, ch, 8, INK); L(f, F, ch, 5, C.GILT, { dash: '9 5' }); }
  const lid = turned([[12, -130], [40, -120], [70, -90], [110, -40], [140, 0]], 0.22); P(f, F, lid, C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  P(f, F, [[-20, -170], [20, -170], [14, -126], [-14, -126]], C.GILT, { dress: false }); oval(f, F, [0, -176], 26, 12, C.GILTL);
  for (let i = 0; i < 9; i++) { const a = -1 + i * 0.25, y = -60 + (i % 2) * 34, x = Math.sin(a) * (y < -40 ? 90 : 120); f.part(F([[x - 10, y + 10], [x, y - 14], [x + 10, y + 10]]), { fill: '#120c08', shade: 0.1, inkW: 1.2, cast: false, hatch: false, sharp: true }); }   // pierced trefoil holes
  const bowl = turned([[150, 0], [154, 30], [130, 100], [80, 140], [40, 150], [44, 190], [90, 216], [96, 232]]); P(f, F, bowl, C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  L(f, F, [[-140, 20], [-120, 90], [-70, 130]], 8, C.GILTL, { op: 0.55 }); L(f, F, [[-110, -36], [-60, -96]], 6, C.GILTL, { op: 0.55 });
  L(f, F, ell([0, 0], 152, 32, 0, 28).slice(0, 15), 10, INK); L(f, F, ell([0, 0], 152, 32, 0, 28).slice(0, 15), 6, C.GILTL);
  for (const x of [-120, 0, 120]) oval(f, F, [x, x ? 8 : 28], 12, 10, C.GILT);
  D.bloom(f, F([[60, 80]])[0], 20, '#2a2418', { n: 3, op: 0.5 }); f.scratches(F([[-40, 60]])[0], 30, 6, '#f0e0a8'); D.chip(f, F([[100, 216]])[0], 8, 0);
  K.fxReq(f, 'steam', F([[-40, -120]])[0], 140, { col: '#b8b4a8' }); K.fxReq(f, 'steam', F([[50, -100]])[0], 110, { col: '#b8b4a8' });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-160, -330, 160, 240]), hook: F([[0, -322]])[0], grip: { c: F([[0, -300]])[0], thumb: (o.ang ?? 0.12) + Math.PI / 2 }, feat: ['steam'], ells: [0.22 / 1.4, 32 / 152 / 1.4, 0.22 / 1.4] };
};
META.thurible = { act: 'blow', gold: true, noTurn: true };

O.funnel = (f, o = {}) => { // a tinned copper funnel, its wide mouth tipped toward the light, a ring handle riveted on, a stream running from the spout (dry when the card says empty)
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = INKS[o.course] || '#2a1e16', empty = (o.state || {}).empty;
  const body = [[-200, -150], [200, -150], [40, 90], [30, 310], [-30, 310], [-40, 90]]; P(f, F, body, C.COPPER, { tex: T(f, 'mottle'), texOp: 0.7 });
  L(f, F, [[-180, -130], [-30, 90], [-22, 300]], 8, '#f0d0a8', { op: 0.5 }); L(f, F, [[-40, 90], [40, 90]], 4, INK, { op: 0.7 }); for (let i = 0; i < 6; i++) f.rivet(F([[-30 + i * 12, 96]])[0], 2.5, '#c8a888');
  oval(f, F, [0, -150], 200, 52, mix(C.COPPER, '#fff', 0.2)); oval(f, F, [0, -146], 184, 42, empty ? '#1a120c' : ink, { shade: 0.2 }); if (!empty) f.flat(F(ell([-50, -150], 60, 8, 0, 12)), '#a8a0b0', { op: 0.5 });
  const hd = [[150, -60], [250, -30], [240, 40], [110, 20]]; tube(f, F, hd, 14, C.COPPER);
  if (!empty) { const st = [[0, 310], [4, 380], [-2, 440]]; L(f, F, st, 16, INK); L(f, F, st, 10, ink); }
  D.bloom(f, F([[80, -60]])[0], 22, C.VERD, { n: 3, op: 0.5 }); D.chip(f, F([[-160, -150]])[0], 8, 0); f.scratches(F([[-60, -40]])[0], 40, 8, '#f0d8b8');
  return { focus: F([[0, -60]])[0], sig: SB(F, [-210, -205, 260, 330]), mouth: empty ? undefined : F([[0, 430]])[0], feat: empty ? [] : ['contents'], ells: [52 / 200, 42 / 184] };
};
META.funnel = { act: 'drip' };

O.spigot = (f, o = {}) => { // a bronze tap driven into a cask head: the hooped oak face behind, the spout with its key, liquid running from the nose
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, ink = INKS[o.course] || '#3a2a1a';
  const head = ell([-140, 0], 190, 300, 0, 40); P(f, F, head, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 }); for (let i = -3; i <= 3; i++) L(f, F, [[-140 + i * 50, -296 + Math.abs(i) * 18], [-140 + i * 50, 296 - Math.abs(i) * 18]], 2, INK, { op: 0.6 });
  ring(f, F, [-140, 0], 186, 296, 12, C.IRON);
  P(f, F, [[-40, -50], [40, -50], [210, -36], [230, 20], [210, 40], [40, 50], [-40, 50]], C.BRONZE, { tex: T(f, 'mottle'), texOp: 0.6 });
  oval(f, F, [-40, 0], 30, 56, mix(C.BRONZE, '#000', 0.2)); lit(f, F, [[-30, -44], [200, -30]], 5, 0.5);
  P(f, F, [[200, 30], [240, 30], [250, 80], [196, 80]], C.BRONZE, { dress: false }); oval(f, F, [223, 80], 26, 8, '#120c08');   // the nose turned down
  P(f, F, [[80, -50], [120, -50], [116, -110], [84, -110]], C.BRONZE, { dress: false }); P(f, F, [[30, -170], [170, -170], [176, -116], [24, -116]], C.BRONZE, { sharp: true });   // the key
  for (const x of [40, 160]) oval(f, F, [x, -144], 12, 12, '#1a120c');
  const st = [[223, 84], [226, 200], [220, 300]]; L(f, F, st, 18, INK); L(f, F, st, 12, ink);
  D.bloom(f, F([[100, 20]])[0], 18, C.VERD, { n: 3, op: 0.55 }); D.chip(f, F([[-280, -100]])[0], 10, 1.6); D.stain(f, F([[-100, 150]])[0], 50, '#2a1a0c', { op: 0.35 }); f.rivet(F([[-140, -280]])[0], 5, '#6a6a66');
  return { focus: F([[100, 0]])[0], sig: SB(F, [-330, -300, 260, 300]), mouth: F([[220, 300]])[0], feat: ['contents'], ells: [] };
};
META.spigot = { act: 'drip', only: ['close', 'niche'] };

O.pincers = (f, o = {}) => { // a smith's pincers closed on a rivet: two round-backed jaws meeting at the pivot, the handles running away
  const F = frame([0, 0], o.ang ?? -0.4, 1), r = f.r;
  for (const s of [-1, 1]) { const jaw = [[0, 0], [s * 40, -40], [s * 120, -140], [s * 120, -230], [s * 70, -290], [s * 8, -300], [s * 4, -270], [s * 60, -250], [s * 70, -150], [s * 20, -60]];
    P(f, F, jaw, C.IRON, { sharp: false, dressO: { op: 0.4 } }); lit(f, F, [[s * 30, -50], [s * 108, -140], [s * 108, -226]], 4, 0.55);
    const h = [[s * 10, 20], [s * 50, 160], [s * 70, 360]]; tube(f, F, h, 30, C.IRON); }
  oval(f, F, [0, 0], 34, 34, C.IRONL); f.rivet(F([[0, 0]])[0], 8, '#c8c8c4');
  P(f, F, [[-18, -300], [18, -300], [16, -340], [-16, -340]], '#a8501e', { dress: false }); oval(f, F, [0, -342], 22, 10, '#d8803a');   // the hot rivet in the bite
  D.bloom(f, F([[40, 200]])[0], 16, C.RUST, { n: 2 }); D.bloom(f, F([[-80, -180]])[0], 14, C.RUST, { n: 2 }); D.chip(f, F([[-118, -200]])[0], 8, 1.6); D.chip(f, F([[118, -160]])[0], 8, -1.6);
  return { focus: F([[0, -180]])[0], sig: SB(F, [-135, -350, 135, 120]), grip: { c: F([[0, 300]])[0], thumb: (o.ang ?? -0.4) - Math.PI / 2 }, feat: [], ells: [] };
};
META.pincers = { act: 'press', ang: -0.4, only: ['close', 'table', 'ledge', 'floor'] };

O.lectern = (f, o = {}) => { // an oak lectern: a slanted desk on a turned post and a three-footed base, a great book open on it, ribbons hanging
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, turned([[30, -60], [40, 20], [26, 100], [46, 160], [30, 220], [36, 260]]), C.OAK, { tex: T(f, 'wood'), texOp: 0.9 });
  for (const [x, y] of [[-170, 300], [170, 300], [40, 330]]) tube(f, F, [[0, 250], [x, y]], 26, C.OAK);
  const desk = [[-260, -110], [260, -110], [230, -40], [-230, -40]]; D.slab(f, F(desk), [0, 22], '#2a1a10'); P(f, F, desk, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  const pageL = [[-250, -120], [-130, -150], [-4, -136], [-10, -260], [-130, -290], [-240, -250]], pageR = [[4, -136], [130, -150], [250, -120], [240, -250], [130, -290], [10, -260]];
  for (const pg of [pageL, pageR]) P(f, F, pg, C.VELLUM, { tex: T(f, 'mottle'), texOp: 0.5, shade: 0.3, dressO: { op: 0.2 } });
  L(f, F, [[-250, -120], [-130, -150], [0, -136], [130, -150], [250, -120]], 8, mix(C.VELLUM, '#5a4a30', 0.4)); L(f, F, [[0, -136], [0, -262]], 3, INK, { op: 0.7 });   // the page block's edge and gutter
  for (let k = 0; k < 7; k++) for (const s of [-1, 1]) L(f, F, [[s * 30, -158 - k * 16 + (s < 0 ? 0 : 0)], [s * 220, -134 - k * 16 - (k * 2)]], 2.2, k === 0 ? C.WAX : INK, { op: 0.7, dash: `${10 + (k * 7) % 12} 3 6 3` });
  f.part(F([[-200, -246], [-150, -252], [-150, -206], [-200, -200]]), { fill: '#2e3e5a', shade: 0.3, inkW: 1.4, cast: false });   // a painted initial
  for (const [x, col] of [[-30, '#3a2a44'], [20, C.GILT]]) { const rb = [[x, -136], [x + 6, -60], [x - 4, 20]]; L(f, F, rb, 10, INK); L(f, F, rb, 6, col); }
  D.chip(f, F([[-200, -42]])[0], 9, 0); D.chip(f, F([[180, -42]])[0], 9, 0); D.crack(f, F([[-10, 160]])[0], 1.5, 60, { n: 3 });
  return { focus: F([[0, -190]])[0], sig: SB(F, [-265, -300, 265, 335]), feat: [], ells: [] };
};
META.lectern = { act: 'turn', only: ['close', 'floor', 'niche'] };

O.masonslevel = (f, o = {}) => { // a mason's A-level: two oak legs and a crossbar pegged at the apex, a plumb line hanging to its mark
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const s of [-1, 1]) { const leg = [[s * 6, -300], [s * 50, -300], [s * 270, 290], [s * 220, 300]]; P(f, F, leg, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9, sharp: true }); lit(f, F, [[s * 10 - 4, -290], [s * 222 - 4, 290]], 3, 0.5); }
  const bar = [[-170, 60], [170, 60], [176, 110], [-176, 110]]; D.slab(f, F(bar), [0, 10]); P(f, F, bar, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9, sharp: true });
  for (let i = -4; i <= 4; i++) L(f, F, [[i * 30, 62], [i * 30, i ? 76 : 100]], i ? 2 : 4, INK, { op: 0.8 });
  oval(f, F, [0, -270], 40, 40, C.OAK); f.rivet(F([[0, -270]])[0], 7, '#8a8a86');
  L(f, F, [[0, -270], [2, 160]], 3, INK); P(f, F, [[-20, 160], [24, 160], [2, 230]], C.BRONZE, { sharp: true, dress: false }); oval(f, F, [2, 160], 22, 8, mix(C.BRONZE, '#fff', 0.2));
  for (const x of [-150, 150]) f.rivet(F([[x, 85]])[0], 5, '#6a5a40'); D.chip(f, F([[-240, 290]])[0], 9, 0); D.crack(f, F([[100, -100]])[0], 1.1, 70, { n: 3 }); D.stain(f, F([[-120, 160]])[0], 24, '#2a1a0c');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-280, -310, 280, 305]), feat: [], ells: [] };
};
META.masonslevel = { act: 'press', only: ['close', 'floor', 'ledge'] };

O.spindle = (f, o = {}) => { // a drop spindle hung on its thread: a fat cop of yarn wound in banded inks on the shaft, a wooden whorl below
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  L(f, F, [[0, -400], [0, -260]], 4, INK); L(f, F, [[0, -400], [0, -260]], 2.4, '#d8ccb0');
  P(f, F, limb([0, -280], [0, 320], 22, 18, { capB: true }), C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  const cop = []; for (let i = 0; i <= 20; i++) { const t = i / 20, y = -240 + t * 340, w = 150 * Math.pow(Math.sin(Math.PI * t), 0.8) + 18; cop.push([w, y]); }
  P(f, F, [...cop, ...cop.slice().reverse().map(([x, y]) => [-x, y])], '#b8ae96', { tex: T(f, 'weave'), texOp: 0.8, dressO: { op: 0.3 } });
  const bands = ['#7a4a36', '#6a7a84', '#5a6044', '#4a4258']; for (let k = 0; k < 4; k++) { const y0 = -150 + k * 60; f.part(F([[-150 + Math.abs(k - 1.5) * 20, y0], [150 - Math.abs(k - 1.5) * 20, y0 - 10], [146 - Math.abs(k - 1.5) * 20, y0 + 22], [-146 + Math.abs(k - 1.5) * 20, y0 + 32]]), { fill: bands[k], shade: 0.4, inkW: 1.2, cast: false }); }
  for (let i = 0; i < 18; i++) { const y = -220 + i * 17, w = 150 * Math.pow(Math.sin(Math.PI * (y + 240) / 340), 0.8); L(f, F, [[-w, y + 6], [w, y - 6]], 1.4, INK, { op: 0.5 }); }   // the wound turns
  L(f, F, cop.slice(3, 15).map(([x, y]) => [-x + 14, y]), 6, '#f0e8d4', { op: 0.45 });
  oval(f, F, [0, 200], 120, 34, C.OAK, { shade: 0.45 }); P(f, F, [[-120, 200], [120, 200], [116, 226], [-116, 226]], mix(C.OAK, '#000', 0.2), { dress: false }); L(f, F, ell([0, 200], 110, 28, 0, 24).slice(12, 22), 3, '#c8a878', { op: 0.6 });
  D.chip(f, F([[90, 214]])[0], 7, 0); D.stain(f, F([[30, 0]])[0], 30, '#3a2414', { op: 0.25 });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-160, -260, 160, 320]), hook: F([[0, -398]])[0], feat: [], ells: [34 / 120] };
};
META.spindle = { act: 'turn' };

O.column = (f, o = {}) => { // a stone column: square plinth and moulded base, a shaft with a crack, a carved cushion capital and its abacus
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const plinth = [[-160, 250], [160, 250], [160, 320], [-160, 320]]; D.slab(f, F(plinth), [18, -10], '#3a3630'); P(f, F, plinth, C.STONE, { sharp: true, tex: T(f, 'mottle'), texOp: 0.9 });
  P(f, F, turned([[110, 170], [140, 200], [146, 230], [130, 250]], 0.2), C.STONEL, { tex: T(f, 'mottle'), texOp: 0.9 });
  const shaft = [[-96, -190], [96, -190], [108, 170], [-108, 170]]; P(f, F, shaft, C.STONEL, { tex: T(f, 'mottle'), texOp: 1 });
  for (let i = -3; i <= 3; i++) L(f, F, [[i * 26, -186], [i * 29, 166]], i < 0 ? 3 : 2, INK, { op: i < 0 ? 0.35 : 0.6 }); lit(f, F, [[-84, -180], [-96, 160]], 8, 0.5);
  const cap = [[-100, -190], [100, -190], [170, -250], [176, -300], [-176, -300], [-170, -250]]; P(f, F, cap, C.STONE, { tex: T(f, 'mottle'), texOp: 0.9 });
  for (const s of [-1, 1]) f.part(F([[s * 30, -200], [s * 150, -280], [s * 70, -290]]), { fill: mix(C.STONE, '#000', 0.3), shade: 0.3, inkW: 1.4, cast: false });   // carved leaves
  const ab = [[-200, -300], [200, -300], [200, -350], [-200, -350]]; D.slab(f, F(ab), [16, -10], '#3a3630'); P(f, F, ab, C.STONEL, { sharp: true });
  D.crack(f, F([[30, -120]])[0], 1.4, 180, { n: 7, w: 2.6 }); D.chip(f, F([[-200, -330]])[0], 14, 1.6); D.chip(f, F([[150, 250]])[0], 12, 0); D.bloom(f, F([[-60, 120]])[0], 30, '#4a5a36', { n: 3, op: 0.45 });
  return { focus: F([[0, -100]])[0], sig: SB(F, [-210, -355, 180, 320]), feat: ['crack'], ells: [0.2] };
};
META.column = { act: 'press', only: ['close', 'floor', 'niche'] };

O.coffin = (f, o = {}) => { // an oak coffin seen from the foot, three-quarter, its lid slid half aside: six-sided, iron handles, a cross on the lid
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const box = [[-120, -320, 1], [120, -320, 1], [190, -140, 1], [130, 300, 1], [-130, 300, 1], [-190, -140, 1]];
  D.slab(f, F(box), [46, 34], '#2a1a10'); P(f, F, box, C.OAK, { tex: T(f, 'wood'), texOp: 0.9 });
  const lid = box.map(([x, y]) => [x * 0.94 + 40, y * 0.96 - 26, 1]); D.slab(f, F(lid), [8, 16], '#2a1a10'); P(f, F, lid, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  L(f, F, [[60, -240], [60, 170]], 14, INK); L(f, F, [[-40, -110], [160, -110]], 14, INK); L(f, F, [[60, -240], [60, 170]], 8, '#8a7a5a'); L(f, F, [[-40, -110], [160, -110]], 8, '#8a7a5a');
  lit(f, F, [[-110, -330], [100, -330]], 4, 0.5); lit(f, F, [[-160, -170], [-60, -330]], 4, 0.4);
  for (const y of [-40, 160]) { tube(f, F, [[-150 + (y > 0 ? 18 : 0), y], [-190 + (y > 0 ? 18 : 0), y + 30], [-150 + (y > 0 ? 18 : 0), y + 60]], 9, C.IRON, { lit: false }); f.rivet(F([[-150, y]])[0], 4, '#8a8a86'); }
  for (let i = 0; i < 6; i++) f.rivet(F([[lid[i % 6][0] * 0.92, lid[i % 6][1] * 0.92]])[0], 3.5, '#6a6a66');
  D.crack(f, F([[-80, 200]])[0], -1.4, 90, { n: 4 }); D.chip(f, F([[120, -320]])[0], 10, 0); D.bloom(f, F([[-60, 60]])[0], 30, '#3a4a2a', { n: 3, op: 0.4 });
  return { focus: F([[30, -60]])[0], sig: SB(F, [-200, -360, 270, 335]), feat: [], ells: [] };
};
META.coffin = { act: 'open', only: ['close', 'floor'] };

O.chair = (f, o = {}) => { // a high-backed oak choir chair in three-quarter view: a gabled back with a carved roundel, arms, a thick seat, four legs
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const back = [[-150, 40, 1], [-150, -250, 1], [-40, -340, 1], [70, -250, 1], [70, 40, 1]]; D.slab(f, F(back), [-20, 14], '#2a1a10'); P(f, F, back, C.OAK, { tex: T(f, 'wood'), texOp: 0.9 });
  oval(f, F, [-40, -170], 60, 60, mix(C.OAK, '#000', 0.25), { shade: 0.4 }); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; L(f, F, [[-40, -170], add([-40, -170], [Math.cos(a) * 54, Math.sin(a) * 54])], 4, C.OAKL); } oval(f, F, [-40, -170], 14, 14, C.OAKL);
  lit(f, F, [[-146, 30], [-146, -246], [-44, -330]], 4, 0.4);
  const seat = [[-150, 40], [70, 40], [180, 120], [-40, 120]]; P(f, F, seat, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9, sharp: true }); f.part(F([[-40, 120], [180, 120], [180, 150], [-40, 150]]), { fill: mix(C.OAK, '#000', 0.2), shade: 0.4, inkW: 1.6, cast: false });
  for (const [x0, y0, x1, y1] of [[-140, 60, -140, 300], [-30, 150, -30, 330], [170, 150, 170, 330], [60, 70, 60, 250]]) tube(f, F, [[x0, y0], [x1, y1]], 26, x0 === 60 ? mix(C.OAK, '#000', 0.3) : C.OAK);
  for (const [a, b] of [[[-150, -60], [-40, 0]], [[70, -60], [180, 20]]]) { tube(f, F, [a, b], 20, C.OAKL); tube(f, F, [b, add(b, [0, 110])], 18, C.OAK); }
  D.chip(f, F([[-40, -336]])[0], 10, 0); D.chip(f, F([[150, 122]])[0], 9, 0); D.crack(f, F([[-100, -60]])[0], 1.5, 80, { n: 4 }); D.stain(f, F([[20, 80]])[0], 30, '#1a120c');
  return { focus: F([[-20, -80]])[0], sig: SB(F, [-175, -345, 195, 335]), feat: [], ells: [] };
};
META.chair = { act: 'open', only: ['close', 'floor', 'niche'] };

O.cauldron = (f, o = {}) => { // a black iron cauldron on three stubby legs, lug ears and a bail, the brew bubbling over, steam standing up
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, brew = INKS[o.course] || '#4a3a22', frozen = (o.state || {}).frozen;
  for (const x of [-150, 0, 150]) P(f, F, [[x - 22, 130], [x + 22, 130], [x + 14, 260], [x - 14, 260]], '#2a2a2c', { dress: false });
  const body = turned([[250, -130], [262, -100], [270, -20], [240, 80], [170, 150], [60, 180]], 0.22); P(f, F, body, '#46474a', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, body, 0.3, 10); grain(f, F, body, 0.3, 15, -0.6, '#b0b0aa'); arcs(f, F, body, [-80, -40, 0, 40, 80, 120], y => 250 - Math.max(0, y) * 0.5, 0.22, { op: 0.45 }); shadeR(f, F, body, 90, 270, -120, 180, 14, { op: 0.5 });
  L(f, F, [[-230, -90], [-240, 20], [-200, 100]], 12, '#9a9a9a', { op: 0.45 }); L(f, F, ell([0, -60], 268, 50, 0, 30).slice(0, 16), 3, INK, { op: 0.6 });
  oval(f, F, [0, -130], 250, 56, '#4a4a4e'); oval(f, F, [0, -124], 226, 50, frozen ? '#c8d4d8' : brew, { shade: 0.2 });
  if (!frozen) for (let i = 0; i < 8; i++) { const c = [-160 + i * 46 + (i % 2) * 8, -124 + (i % 3 - 1) * 10]; oval(f, F, c, 14 + (i % 3) * 4, 6 + (i % 3) * 2, mix(brew, '#fff', 0.25), { inkW: 1 }); }
  for (const s of [-1, 1]) { ring(f, F, [s * 270, -110], 22, 30, 9, '#38393c'); }
  tube(f, F, [[-270, -130], [-200, -330], [0, -370], [200, -330], [270, -130]], 10, '#4a4c50');
  if (!frozen) { const sp = [[200, -110], [230, -60], [224, 20]]; L(f, F, sp, 18, INK); L(f, F, sp, 12, brew); }
  D.bloom(f, F([[100, 60]])[0], 26, C.RUST, { n: 3 }); D.bloom(f, F([[-120, 100]])[0], 20, C.RUST, { n: 2 }); f.scratches(F([[-60, 40]])[0], 40, 8, '#c8c8c4');
  if (!frozen) { K.fxReq(f, 'steam', F([[-60, -150]])[0], 130, { col: '#b8b4a8' }); K.fxReq(f, 'steam', F([[80, -140]])[0], 100, { col: '#b8b4a8' }); }
  return { focus: F([[0, -60]])[0], sig: SB(F, [-300, -380, 300, 265]), hook: F([[0, -372]])[0], mouth: F([[224, 20]])[0], feat: frozen ? ['rime'] : ['steam', 'contents'], ells: [56 / 250, 50 / 226, 0.22] };
};
META.cauldron = { act: 'pour' };

O.font = (f, o = {}) => { // a stone baptismal font: a wide octagonal bowl carved with arches on a thick stem and stepped foot, water brimming over
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, w = '#2e3e4a';
  P(f, F, [[-200, 250], [200, 250], [220, 320], [-220, 320]], C.STONE, { sharp: true, tex: T(f, 'mottle'), texOp: 0.9 });
  P(f, F, [[-80, 40], [80, 40], [100, 250], [-100, 250]], C.STONEL, { sharp: true, tex: T(f, 'mottle'), texOp: 0.9 }); lit(f, F, [[-72, 50], [-90, 240]], 6, 0.45);
  const bowl = [[-290, -150], [-220, -150], [220, -150], [290, -150], [250, 0], [200, 60], [-200, 60], [-250, 0]]; P(f, F, bowl, C.STONEL, { sharp: true, tex: T(f, 'mottle'), texOp: 1 });
  for (const x of [-190, -110, -30, 50, 130, 210]) { const a = [[x - 30, 40], [x - 30, -60], [x, -100], [x + 30, -60], [x + 30, 40]]; f.part(F(a), { fill: mix(C.STONE, '#000', 0.35), shade: 0.3, inkW: 1.6, cast: false }); }   // the carved arcade
  for (const x of [-250, 250]) L(f, F, [[x * 0.86, -150], [x * 0.8, 60]], 2.4, INK, { op: 0.7 });
  oval(f, F, [0, -150], 290, 54, mix(C.STONEL, '#fff', 0.1)); oval(f, F, [0, -146], 262, 42, w, { shade: 0.2 }); L(f, F, ell([0, -146], 200, 30, 0, 24).slice(12, 20), 3, '#c8d4d8', { op: 0.7 });
  for (const x of [-200, 150]) { const sp = [[x, -130], [x * 1.18, -60], [x * 1.12, 40]]; L(f, F, sp, 14, INK); L(f, F, sp, 9, w); }
  D.chip(f, F([[-280, -148]])[0], 12, 0); D.chip(f, F([[180, 60]])[0], 10, 0); D.crack(f, F([[100, 120]])[0], 1.4, 100, { n: 5 }); D.bloom(f, F([[-60, 200]])[0], 30, '#4a5a36', { n: 3, op: 0.45 });
  return { focus: F([[0, -100]])[0], sig: SB(F, [-295, -205, 295, 320]), mouth: F([[-236, 40]])[0], feat: ['contents'], ells: [54 / 290, 42 / 262] };
};
META.font = { act: 'pour', only: ['close', 'floor', 'niche'] };

O.padlock = (f, o = {}) => { // a heavy iron padlock, shut: a round-shouldered body with a keyhole under a swinging cover, a thick shackle
  const F = frame([0, 0], o.ang ?? -0.12, 1), r = f.r;
  const sh = [[-110, -40], [-110, -190], [-60, -290], [60, -290], [110, -190], [110, -40]]; L(f, F, sh, 66, INK); L(f, F, sh, 54, '#6a6c70'); L(f, F, sh.map(p => add(p, [-12, -10])), 10, '#c8c8c4', { op: 0.5 });
  const body = [[-200, -60], [200, -60], [210, 120], [130, 260], [-130, 260], [-210, 120]]; D.slab(f, F(body), [16, 12]); P(f, F, body, C.IRON, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, body, 0.4, 8, 0.8, '#c8c8c4'); grain(f, F, body, 0.3, 12, -0.7, '#16110e');
  lit(f, F, [[-190, -50], [-196, 110]], 6, 0.5); lit(f, F, [[-180, -66], [180, -66]], 4, 0.5);
  f.part(F([[-26, 50], [26, 50], [30, 90], [12, 100], [20, 190], [-20, 190], [-12, 100], [-30, 90]]), { fill: '#0a0806', shade: 0.1, inkW: 2, cast: false, hatch: false });   // the keyhole
  P(f, F, [[30, 0], [110, -10], [120, 60], [40, 70]], '#6a6c70', { dress: false }); f.rivet(F([[44, 10]])[0], 6, '#c8c8c4');   // the cover swung aside
  for (const [x, y] of [[-160, -30], [160, -30], [-100, 230], [100, 230]]) f.rivet(F([[x, y]])[0], 7, '#8a8a86');
  D.bloom(f, F([[110, 160]])[0], 30, C.RUST, { n: 4 }); D.bloom(f, F([[-140, 40]])[0], 20, C.RUST, { n: 2 }); D.chip(f, F([[0, 258]])[0], 10, 0); f.scratches(F([[-90, 120]])[0], 40, 8, '#c8c8c4');
  return { focus: F([[0, 60]])[0], sig: SB(F, [-215, -330, 215, 265]), feat: [], ells: [] };
};
META.padlock = { act: 'press' };

O.armreliquary = (f, o = {}) => { // an arm reliquary of worn gilt: a sleeve on a flared foot, ringed with six bands, a hand at the top raised in blessing, a crystal window showing bone
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, turned([[110, 220], [150, 280], [160, 310]], 0.25), C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  const sl = [[-90, -120], [90, -120], [110, 230], [-110, 230]]; P(f, F, sl, C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 }); lit(f, F, [[-80, -110], [-100, 220]], 8, 0.4);
  for (let k = 0; k < 6; k++) { const y = -90 + k * 52, w = 92 + k * 3; L(f, F, [[-w, y], [0, y + 14], [w, y]], 13, INK); L(f, F, [[-w, y], [0, y + 14], [w, y]], 8, mix(SIX[k], '#16110e', 0.45)); L(f, F, [[-w, y - 6], [0, y + 8], [w, y - 6]], 1.8, C.GILTL, { op: 0.8 }); }
  f.part(F([[-40, 0], [40, 0], [40, 70], [-40, 70]]), { fill: '#c8d4d0', shade: 0.25, inkW: 2, cast: false, opacity: 0.9 }); L(f, F, [[-26, 50], [24, 16]], 10, '#d8ccb0'); L(f, F, [[-34, 4], [-34, 66]], 3, '#f8f8f0', { op: 0.8 });   // the window and the relic
  const hand = [[-80, -120], [-90, -190], [-110, -250], [-96, -262], [-70, -220], [-60, -300], [-40, -310], [-30, -230], [-20, -360], [6, -364], [14, -240], [30, -350], [54, -344], [50, -220], [76, -250], [96, -240], [80, -150], [80, -120]];
  P(f, F, hand, C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 }); for (const x of [-38, 6, 44]) L(f, F, [[x, -200], [x + 2, -150]], 2, INK, { op: 0.6 });
  L(f, F, [[-56, -290], [-50, -230]], 4, C.GILTL, { op: 0.6 }); L(f, F, [[-8, -350], [-4, -250]], 4, C.GILTL, { op: 0.6 });
  D.chip(f, F([[100, 200]])[0], 8, 0); D.bloom(f, F([[50, 150]])[0], 16, '#3a3020', { n: 2, op: 0.5 }); f.scratches(F([[-30, 120]])[0], 30, 6, '#f0e0a8');
  return { focus: F([[0, -100]])[0], sig: SB(F, [-165, -370, 165, 320]), feat: [], ells: [0.25] };
};
META.armreliquary = { act: 'glare', gold: true, only: ['close', 'niche', 'ledge'] };

O.monstrance = (f, o = {}) => { // a gilt monstrance: a round crystal lunette holding the pale host, six great rays and short ones between, on a knopped stem and foot
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, -130];
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 - Math.PI / 2, big = i % 4 === 0, R1 = big ? 280 : 175 + (i % 2) * 25, w = big ? 0.13 : 0.07; f.part(F([add(c, [Math.cos(a - w) * 100, Math.sin(a - w) * 100]), add(c, [Math.cos(a) * R1, Math.sin(a) * R1]), add(c, [Math.cos(a + w) * 100, Math.sin(a + w) * 100])]), { fill: big ? C.GILT : mix(C.GILT, '#000', 0.2), shade: 0.4, inkW: big ? 2 : 1.4, cast: false, sharp: true }); if (big) L(f, F, [add(c, [Math.cos(a - 0.05) * 110, Math.sin(a - 0.05) * 110]), add(c, [Math.cos(a) * (R1 - 20), Math.sin(a) * (R1 - 20)])], 3, C.GILTL, { op: 0.7 }); }
  oval(f, F, c, 112, 112, C.GILT, { shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 }); oval(f, F, c, 84, 84, '#c8ccc4', { shade: 0.25 }); oval(f, F, c, 60, 60, '#ece4cc', { shade: 0.25 });
  L(f, F, [add(c, [-14, -30]), add(c, [-14, 30])], 4, '#c8a878'); L(f, F, [add(c, [-34, 0]), add(c, [6, 0])], 4, '#c8a878'); L(f, F, ell(c, 78, 78, 0, 28).slice(16, 24), 4, '#ffffff', { op: 0.6 });
  P(f, F, turned([[18, -18], [22, 40], [44, 80], [20, 110], [24, 200], [110, 260], [120, 280]]), C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  oval(f, F, [0, 80], 46, 16, mix(C.GILT, '#000', 0.25)); for (let i = 0; i < 6; i++) oval(f, F, [-34 + i * 14, 80], 4, 5, SIX[i], { inkW: 0.6 });
  D.chip(f, F([[90, 270]])[0], 7, 0); f.scratches(F([[-60, 230]])[0], 30, 6, '#f0e0a8'); D.bloom(f, F([[60, -60]])[0], 14, '#3a3020', { n: 2, op: 0.5 });
  return { focus: F([c])[0], sig: SB(F, [-290, -420, 290, 290]), feat: [], ells: [0.22] };
};
META.monstrance = { act: 'glare', gold: true, noTurn: true, only: ['close', 'niche', 'ledge'] };

O.wheel = (f, o = {}) => { // a wooden cartwheel stood on edge, three-quarter: an iron tyre, a thick felloe in six pieces, six spokes, the nave and its axle hole
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, R = 270, rx = R * 0.82, c = [0, 0];
  const back = ell(add(c, [40, 0]), rx, R, 0, 48); f.part(F(back), { fill: '#2a2a2c', shade: 0.3, inkW: 2, cast: false });   // the tyre's far edge, its thickness
  const tyreO = ell(c, rx, R, 0, 48), tyreI = ell(c, rx - 22, R - 26, 0, 48).reverse(); P(f, F, [...tyreO, tyreO[0], ...tyreI, tyreI[tyreI.length - 1]], '#4e5054', { dress: false });
  const fel = ell(c, rx - 22, R - 26, 0, 48), felI = ell(c, rx - 70, R - 84, 0, 48).reverse(); P(f, F, [...fel, fel[0], ...felI, felI[felI.length - 1]], C.OAKL, { tex: T(f, 'wood'), texOp: 0.9, dress: false });
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.26; L(f, F, [add(c, [Math.cos(a) * (rx - 70), Math.sin(a) * (R - 84)]), add(c, [Math.cos(a) * (rx - 22), Math.sin(a) * (R - 26)])], 3, INK); }
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; tube(f, F, [add(c, [Math.cos(a) * 56, Math.sin(a) * 66]), add(c, [Math.cos(a) * (rx - 70), Math.sin(a) * (R - 84)])], 24, C.OAK); }
  oval(f, F, c, 80, 92, C.OAKL, { shade: 0.45, tex: T(f, 'wood'), texOp: 0.8 }); ring(f, F, c, 70, 80, 6, C.IRON); oval(f, F, add(c, [6, 0]), 28, 32, '#0e0a08', { hatch: false, shade: 0.1 });
  L(f, F, ell(c, rx - 8, R - 10, 0, 48).slice(22, 36), 5, '#d8d8d0', { op: 0.5 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; f.rivet(F([add(c, [Math.cos(a) * (rx - 11), Math.sin(a) * (R - 13)])])[0], 3.5, '#8a8a86'); }
  D.bloom(f, F([add(c, [rx - 30, 120])])[0], 20, C.RUST, { n: 2 }); D.chip(f, F([add(c, [-rx + 40, -100])])[0], 10, 1.5); D.crack(f, F([add(c, [100, -150])])[0], -1, 60, { n: 3 });
  return { focus: F([c])[0], sig: SB(F, [-rx - 5, -R - 5, rx + 45, R + 5]), feat: [], ells: [] };
};
META.wheel = { act: 'turn', only: ['close', 'ledge', 'floor'] };

O.orb = (f, o = {}) => { // a gilt orb: a heavy sphere girdled by a jewelled band and a half meridian, a cross standing on top
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, 60], R = 210;
  P(f, F, ell(c, R, R, 0, 48), C.GILT, { tex: T(f, 'mottle'), texOp: 0.6 });
  f.flat(F(ell(add(c, [70, 70]), 150, 140, 0, 30)), '#3a3020', { op: 0.35 }); L(f, F, ell(c, R - 16, R - 16, 0, 48).slice(26, 40), 12, C.GILTL, { op: 0.5 });
  const eq = ell(add(c, [0, 20]), R, 50, 0, 40).slice(0, 21); L(f, F, eq, 34, INK); L(f, F, eq, 26, mix(C.GILT, '#000', 0.15)); for (let i = 2; i < 20; i += 3) oval(f, F, eq[i], 9, 7, SIX[(i / 3 | 0) % 6], { inkW: 1 });
  const me = [add(c, [0, -R]), add(c, [-44, -110]), add(c, [-56, 0]), add(c, [-44, 50])]; L(f, F, K.catmull(me, 6), 26, INK); L(f, F, K.catmull(me, 6), 18, mix(C.GILT, '#000', 0.15));
  P(f, F, [[-20, c[1] - R - 20], [20, c[1] - R - 20], [20, c[1] - R - 180], [-20, c[1] - R - 180]], C.GILT, { dress: false }); P(f, F, [[-70, c[1] - R - 130], [70, c[1] - R - 130], [70, c[1] - R - 96], [-70, c[1] - R - 96]], C.GILT, { dress: false });
  lit(f, F, [[-14, c[1] - R - 30], [-14, c[1] - R - 170]], 3, 0.6);
  D.chip(f, F([add(c, [150, -100])])[0], 9, 0.8); f.scratches(F([add(c, [-80, -60])])[0], 40, 8, '#f0e0a8'); D.bloom(f, F([add(c, [120, 120])])[0], 20, '#2a2418', { n: 3, op: 0.5 });
  return { focus: F([c])[0], sig: SB(F, [-215, c[1] - R - 185, 215, c[1] + R + 5]), feat: [], ells: [50 / R] };
};
META.orb = { act: 'press', gold: true, noTurn: true };

O.kettle = (f, o = {}) => { // a black iron kettle on its bail: round belly, a lid with a knob, a curved spout, steam from the spout
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, frozen = (o.state || {}).frozen;
  const body = turned([[150, -100], [200, -40], [220, 40], [190, 130], [120, 180]], 0.23); P(f, F, body, '#4a4b4e', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, body, 0.4, 8, 0.8, '#b8b8b4'); grain(f, F, body, 0.3, 12, -0.7);
  arcs(f, F, body, [-60, -20, 20, 60, 100, 140], y => 200 + 20 * Math.cos((y - 40) / 140), 0.23, { op: 0.45 }); shadeR(f, F, body, 70, 220, -100, 190, 12, { op: 0.5 });
  L(f, F, [[-190, -30], [-200, 60], [-160, 140]], 10, '#b0b0b0', { op: 0.5 }); L(f, F, [[-150, -70], [-120, -90]], 6, '#c0c0c0', { op: 0.5 });
  oval(f, F, [0, -100], 150, 34, '#4a4a4e'); oval(f, F, [0, -108], 110, 24, '#2e2f32'); P(f, F, [[-20, -110], [20, -110], [14, -150], [-14, -150]], '#2e2f32', { dress: false }); oval(f, F, [0, -154], 24, 12, '#4a4a4e');
  const sp = sweep([[170, 40], [250, -20], [300, -110], [330, -150]], 60, 22); P(f, F, sp.poly, '#3a3b3e', { dressO: { op: 0.4 } }); oval(f, F, [332, -152], 14, 8, '#0e0a08', { a: 0.6 });
  tube(f, F, [[-150, -90], [-120, -260], [0, -300], [120, -260], [150, -90]], 12, '#4a4c50');
  D.bloom(f, F([[80, 80]])[0], 24, C.RUST, { n: 3 }); D.bloom(f, F([[-100, 100]])[0], 18, C.RUST, { n: 2 }); f.scratches(F([[-60, 20]])[0], 40, 8, '#c8c8c4'); D.chip(f, F([[-140, -100]])[0], 8, 0);
  if (!frozen) K.fxReq(f, 'steam', F([[336, -160]])[0], 130, { col: '#c8c4b8' });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-225, -310, 345, 200]), hook: F([[0, -302]])[0], grip: { c: F([[0, -298]])[0], thumb: (o.ang ?? 0) + Math.PI / 2 }, mouth: F([[332, -152]])[0], feat: frozen ? ['rime'] : ['steam'], ells: [34 / 150, 0.23] };
};
META.kettle = { act: 'blow' };

O.fireshovel = (f, o = {}) => { // an iron fire shovel heaped with glowing coals: a deep square pan with raised sides, a twisted handle ending in a ring
  const F = frame([0, 0], o.ang ?? -0.25, 1), r = f.r;
  const pan = [[-210, -60], [210, -60], [240, 180], [-240, 180]]; D.slab(f, F(pan), [0, 18], '#1e1e20'); P(f, F, pan, C.IRON, { dressO: { op: 0.45 } });
  for (const s of [-1, 1]) f.part(F([[s * 210, -60], [s * 240, 180], [s * 250, 150], [s * 222, -90]]), { fill: '#4a4c50', shade: 0.4, inkW: 1.6, cast: false });
  f.part(F([[-200, 20], [-120, -40], [0, -70], [120, -40], [210, 10], [230, 160], [-230, 160]]), { fill: '#2a1a10', shade: 0.3, inkW: 1.4, cast: false });
  for (let i = 0; i < 22; i++) { const c = [-190 + (i % 7) * 63 + (i % 2) * 20, 140 - Math.floor(i / 7) * 50 - (i % 3) * 8], s = 26 + (i % 4) * 6; f.part(F(K.blob(r, c, s, 8, 0.4)), { fill: i % 3 ? '#a8501e' : '#2a1a10', shade: 0.4, inkW: 1.2, cast: false }); if (i % 3) f.flat(F(ell(add(c, [-4, -6]), s * 0.4, s * 0.3, 0, 8)), '#e8a050', { op: 0.6 }); }
  const h = [[0, -60], [0, -200], [0, -330]]; tube(f, F, h, 30, C.IRON); for (let i = 0; i < 6; i++) L(f, F, [[-14, -100 - i * 36], [14, -84 - i * 36]], 3, INK, { op: 0.7 });
  ring(f, F, [0, -370], 34, 34, 12, C.IRON);
  D.bloom(f, F([[140, 120]])[0], 20, C.RUST, { n: 2 }); D.chip(f, F([[-200, -60]])[0], 9, 0);
  K.fxReq(f, 'flame', F([[-40, 0]])[0], 90, { col: '#c86030' }); K.fxReq(f, 'flame', F([[80, 10]])[0], 70, { col: '#c86030' });
  return { focus: F([[0, 60]])[0], sig: SB(F, [-255, -100, 255, 200]), hook: F([[0, -400]])[0], grip: { c: F([[0, -260]])[0], thumb: (o.ang ?? -0.25) + Math.PI / 2 }, feat: ['fire'], ells: [] };
};
META.fireshovel = { act: 'burn', ang: -0.25 };

O.plumbbob = (f, o = {}) => { // a heavy bronze plumb bob hanging still on its cord: a tear-shaped bob, a capped top with a ring, a point
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  L(f, F, [[0, -400], [0, -250]], 7, INK); L(f, F, [[0, -400], [0, -250]], 4, '#a89470');
  ring(f, F, [0, -232], 22, 18, 8, C.BRONZE);
  P(f, F, [[-40, -210], [40, -210], [56, -170], [-56, -170]], C.BRONZE, { dress: false, sharp: true }); oval(f, F, [0, -210], 40, 10, mix(C.BRONZE, '#fff', 0.2));
  const bob = turned([[60, -170], [150, -110], [180, -20], [160, 60], [110, 140], [40, 230], [4, 290]], 0.1); P(f, F, bob, C.BRONZE, { tex: T(f, 'mottle'), texOp: 0.6 });
  L(f, F, [[-130, -110], [-160, -20], [-130, 80]], 12, '#e8d8a8', { op: 0.45 }); for (const y of [-130, -60]) L(f, F, ell([0, y], 150 + (y + 130) * 0.4, 22, 0, 24).slice(0, 13), 3, INK, { op: 0.6 });
  D.bloom(f, F([[60, 0]])[0], 30, C.VERD, { n: 4, op: 0.55 }); D.chip(f, F([[-150, -40]])[0], 9, 1.6); f.scratches(F([[-40, 60]])[0], 40, 8, '#f0e0b8'); D.stain(f, F([[80, 100]])[0], 30, '#2a1a0c');
  return { focus: F([[0, 0]])[0], sig: SB(F, [-185, -250, 185, 295]), hook: F([[0, -398]])[0], feat: [], ells: [10 / 40] };
};
META.plumbbob = { act: 'swing', noTurn: true };

O.settle = (f, o = {}) => { // an oak settle: a long bench with a tall panelled back and scrolled arms, seen three-quarter, a folded cloth on the seat
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const back = [[-360, 30, 1], [-360, -230, 1], [300, -230, 1], [300, 30, 1]]; D.slab(f, F(back), [-18, 12], '#2a1a10'); P(f, F, back, C.OAK, { tex: T(f, 'wood'), texOp: 0.9, sharp: true });
  for (let i = 0; i < 4; i++) { const x0 = -330 + i * 160; f.part(F([[x0, -200], [x0 + 130, -200], [x0 + 130, 0], [x0, 0]]), { fill: mix(C.OAK, '#000', 0.2), shade: 0.4, inkW: 1.6, cast: false, sharp: true }); L(f, F, [[x0 + 4, -196], [x0 + 126, -196]], 2, '#a88060', { op: 0.6 }); }
  P(f, F, [[-380, -260], [320, -260], [330, -230], [-390, -230]], C.OAKL, { sharp: true, tex: T(f, 'wood'), texOp: 0.9 });
  const seat = [[-360, 30], [300, 30], [380, 100], [-280, 100]]; P(f, F, seat, C.OAKL, { tex: T(f, 'wood'), texOp: 0.9, sharp: true }); f.part(F([[-280, 100], [380, 100], [380, 136], [-280, 136]]), { fill: mix(C.OAK, '#000', 0.2), shade: 0.4, inkW: 1.6, cast: false });
  for (const x of [-270, 370]) tube(f, F, [[x, 136], [x, 300]], 30, C.OAK); tube(f, F, [[-350, 60], [-350, 250]], 26, mix(C.OAK, '#000', 0.3));
  for (const [a, b] of [[[-360, -80], [-280, 60]], [[300, -80], [380, 70]]]) { tube(f, F, [a, add(a, [60, -10]), b], 24, C.OAKL); }
  f.part(F([[-120, 26], [60, 22], [100, 80], [-90, 86]]), { fill: '#7a7a8a', shade: 0.4, inkW: 1.6, cast: false, tex: T(f, 'weave'), texOp: 0.7 });
  lit(f, F, [[-380, -262], [320, -262]], 4, 0.55); D.chip(f, F([[0, -260]])[0], 10, 0); D.crack(f, F([[200, -120]])[0], 1.4, 80, { n: 4 }); D.stain(f, F([[-200, 60]])[0], 30, '#1a120c');
  return { focus: F([[0, -60]])[0], sig: SB(F, [-395, -265, 395, 305]), feat: [], ells: [] };
};
META.settle = { act: 'open', only: ['close', 'floor'] };

O.basket = (f, o = {}) => { // a wicker basket with a tall arched handle, the weave in rows, a cloth tucked in it and loaves or bottles showing
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, WK = '#a8885a';
  tube(f, F, [[-200, -40], [-190, -260], [0, -330], [190, -260], [200, -40]], 26, WK); for (let i = 0; i < 12; i++) { const p = K.catmull([[-200, -40], [-190, -260], [0, -330], [190, -260], [200, -40]], 3)[i + 1]; if (p) L(f, F, [add(p, [-8, -6]), add(p, [8, 8])], 2, INK, { op: 0.6 }); }
  const body = [[-250, -40], [250, -40], [210, 200], [-210, 200]]; P(f, F, [...body.slice(0, 2), ...turned([[250, -40], [210, 200]], 0.25).slice(1)], WK, { tex: T(f, 'weave'), texOp: 0.9 });
  for (let k = 0; k < 7; k++) { const y = -10 + k * 32, w = 246 - k * 6; L(f, F, ell([0, y], w, w * 0.2, 0, 30).slice(0, 16), 3, INK, { op: 0.65 }); }
  for (let i = -6; i <= 6; i++) L(f, F, [[i * 38, -30], [i * 32, 220]], 2, '#5a4a30', { op: 0.6 });
  oval(f, F, [0, -40], 250, 52, mix(WK, '#fff', 0.15)); oval(f, F, [0, -36], 226, 40, '#2a1e12', { shade: 0.2 });
  f.part(F([[-200, -40], [-120, -90], [-20, -70], [40, -40], [-60, -20], [-180, -20]]), { fill: '#c8bca0', shade: 0.4, inkW: 1.6, cast: false, tex: T(f, 'weave'), texOp: 0.6 });   // the cloth
  for (const [x, w] of [[90, 70], [170, 50]]) { f.part(F(ell([x, -70], w, w * 0.6, 0.2, 20)), { fill: '#8a5a30', shade: 0.45, inkW: 1.8, cast: false }); L(f, F, [[x - 20, -90], [x + 16, -84]], 3, INK, { op: 0.6 }); }   // loaves
  L(f, F, ell([0, -40], 240, 48, 0, 30).slice(16, 26), 4, '#f0e0b8', { op: 0.5 }); D.chip(f, F([[-200, 200]])[0], 9, 0);
  return { focus: F([[0, -40]])[0], sig: SB(F, [-255, -345, 255, 230]), hook: F([[0, -338]])[0], grip: { c: F([[0, -330]])[0], thumb: (o.ang ?? 0) + Math.PI / 2 }, feat: [], ells: [52 / 250, 40 / 226, 0.2] };
};
META.basket = { act: 'drip' };

O.robe = (f, o = {}) => { // a vestment hung on a cross-pole, its arms spread wide: a long undyed robe, orphrey band down the front, deep folds
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  L(f, F, [[-380, -250], [380, -250]], 26, INK); L(f, F, [[-380, -250], [380, -250]], 18, C.OAK); L(f, F, [[0, -330], [0, -250]], 22, INK); L(f, F, [[0, -330], [0, -250]], 14, C.OAK);
  const robe = [[-360, -260], [-120, -280], [0, -250], [120, -280], [360, -260], [370, -150], [200, -140], [190, 290], [80, 310], [0, 290], [-80, 310], [-190, 290], [-200, -140], [-370, -150]];
  P(f, F, robe, '#c8bca0', { tex: T(f, 'weave'), texOp: 0.7, dressO: { op: 0.3 } });
  for (let i = 0; i < 7; i++) { const x = -160 + i * 54; L(f, F, [[x, -120], [x + (i % 2 ? 10 : -6), 100], [x + (i % 2 ? -4 : 8), 290]], i % 2 ? 9 : 5, i % 2 ? '#8a826e' : '#f4f0e4', { op: i % 2 ? 0.45 : 0.55 }); }   // folds
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) L(f, F, [[s * (220 + i * 50), -250], [s * (230 + i * 46), -150]], 3, '#8a826e', { op: 0.5 });
  f.part(F([[-34, -250], [34, -250], [40, 296], [-40, 296]]), { fill: '#3a3a52', shade: 0.4, inkW: 1.6, cast: false }); for (let k = 0; k < 6; k++) oval(f, F, [0, -200 + k * 84], 14, 14, C.GILT, { inkW: 1.2 });
  f.part(F(ell([0, -262], 60, 18, 0, 18)), { fill: '#2a2418', shade: 0.2, inkW: 1.4, cast: false });   // the neck
  D.stain(f, F([[120, 160]])[0], 40, '#5a4a30', { op: 0.3 }); D.stain(f, F([[-140, 220]])[0], 30, '#3a2a44', { op: 0.3 }); for (let i = 0; i < 6; i++) L(f, F, [[-180 + i * 70, 292], [-176 + i * 70, 306]], 2, '#8a826e');
  return { focus: F([[0, -40]])[0], sig: SB(F, [-385, -335, 385, 312]), hook: F([[0, -330]])[0], feat: [], ells: [] };
};
META.robe = { act: 'drip', gold: true, only: ['close', 'hang', 'niche'] };

O.warmingpan = (f, o = {}) => { // a copper warming pan: a round lidded pan, the lid pierced and chased in a rose, a long turned oak handle, embers glowing through the holes
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r, c = [0, -120];
  P(f, F, [...ell(c, 220, 220, 0, 40).slice(0, 21), ...ell(add(c, [0, 40]), 220, 200, 0, 40).slice(0, 21).reverse()], mix(C.COPPER, '#000', 0.25), { dress: false });   // the pan's wall
  P(f, F, ell(c, 220, 200, 0, 48), C.COPPER, { tex: T(f, 'mottle'), texOp: 0.7 });
  ring(f, F, c, 210, 190, 6, mix(C.COPPER, '#fff', 0.15)); L(f, F, ell(c, 200, 180, 0, 48).slice(26, 40), 8, '#f0c8a0', { op: 0.5 });
  for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; f.part(F(ell(add(c, [Math.cos(a) * 80, Math.sin(a) * 72]), 40, 22, a, 14)), { fill: mix(C.COPPER, '#000', 0.2), shade: 0.4, inkW: 1.4, cast: false }); }   // the chased rose
  for (let i = 0; i < 30; i++) { const a = r() * 6.28, d = 30 + r() * 150, p = add(c, [Math.cos(a) * d, Math.sin(a) * d * 0.9]); f.part(F(ell(p, 6, 5, 0, 8)), { fill: i % 3 ? '#1a0e08' : '#d8803a', shade: 0.1, inkW: 0.8, cast: false, hatch: false }); }
  oval(f, F, c, 30, 28, C.COPPER); f.rivet(F([c])[0], 6, '#d8a878');
  P(f, F, [[-24, 80], [24, 80], [20, 130], [-20, 130]], C.COPPER, { dress: false });
  P(f, F, turned([[22, 120], [30, 160], [20, 200], [30, 240], [30, 360], [36, 380]], 0.2), C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  D.bloom(f, F([add(c, [120, 80])])[0], 24, C.VERD, { n: 3, op: 0.5 }); D.chip(f, F([add(c, [-200, 40])])[0], 9, 1.6); f.scratches(F([add(c, [-80, -100])])[0], 40, 8, '#f0d8b8');
  return { focus: F([c])[0], sig: SB(F, [-225, -330, 225, 150]), grip: { c: F([[0, 300]])[0], thumb: (o.ang ?? -0.35) - Math.PI / 2 }, feat: ['fire'], ells: [200 / 220] };
};
META.warmingpan = { act: 'burn', ang: -0.35 };

O.cruet = (f, o = {}) => { // an altar cruet: a small pear-bellied glass jug with a loop handle, a pinched lip and a stopper, wine or water in it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = o.brew || INKS[o.course] || '#4a2a24';
  const body = turned([[44, -230], [40, -170], [60, -110], [140, 0], [160, 80], [130, 160], [80, 200], [96, 230]]); P(f, F, body, C.GLASS, { tex: T(f, 'mottle'), texOp: 0.8, opacity: 0.92 }); arcs(f, F, body, [-60, -20, 40, 100, 150], y => y < 0 ? 100 : 150, 0.22, { op: 0.35, col: '#2a3a2a' });
  P(f, F, [[-150, 20], [-60, 10], [60, 14], [154, 30], [160, 80], [130, 160], [80, 200], [-80, 200], [-130, 160], [-160, 80]], liq, { shade: 0.5, dress: false, cast: false, inkW: 1.1 });
  L(f, F, [[-150, 20], [-60, 10], [60, 14], [154, 30]], 2, mix(liq, '#fff', 0.45), { op: 0.8 }); shadeR(f, F, body, 70, 150, 20, 190, 9, { op: 0.45 }); for (let i = 0; i < 12; i++) f.flat(F(ell([-60 + (i * 37) % 160, 60 + (i * 53) % 120], 4, 3, 0, 6)), '#e8ece0', { op: 0.5 });
  L(f, F, [[-120, -10], [-140, 80], [-110, 160]], 8, '#f4f4ec', { op: 0.55 }); L(f, F, [[-34, -220], [-30, -120]], 4, '#f4f4ec', { op: 0.5 });
  P(f, F, [[40, -236], [100, -270], [96, -250], [44, -214]], C.GLASS, { dress: false });   // the pinched lip
  const hd = [[-40, -200], [-150, -190], [-190, -60], [-140, 30]]; tube(f, F, hd, 18, C.GLASS, { litOp: 0.6 });
  P(f, F, [[-30, -230], [30, -230], [26, -290], [-26, -290]], '#6a5a44', { dress: false }); oval(f, F, [0, -292], 30, 12, '#8a7a5a');
  for (const y of [-120, 170]) L(f, F, ell([0, y], y < 0 ? 62 : 120, 14, 0, 20).slice(0, 11), 2, '#c8d0c8', { op: 0.6 });
  D.chip(f, F([[96, 230]])[0], 7, 0); D.stain(f, F([[60, 120]])[0], 20, '#1a120c', { op: 0.3 });
  return { focus: F([[0, 40]])[0], sig: SB(F, [-200, -300, 165, 245]), mouth: F([[100, -266]])[0], feat: ['contents'], ells: [0.22] };
};
META.cruet = { act: 'pour', only: ['close', 'ledge', 'table', 'niche'] };

O.onionbottle = (f, o = {}) => { // a squat green onion bottle: a wide flattened belly, a short neck with a string rim, the cork pulled, its stream running out
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, glass = '#3e5a44', liq = INKS[o.course] ? mix(INKS[o.course], '#2a3a2a', 0.4) : '#2a3a26', unstop = !!o.open;
  const body = turned([[40, -260], [44, -220], [40, -160], [60, -110], [180, -30], [230, 60], [210, 150], [120, 200], [140, 220]]); P(f, F, body, glass, { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, body, [-80, -30, 20, 80, 130, 180], y => y < -100 ? 60 : 210, 0.22, { op: 0.4, col: '#0e1a10' }); grain(f, F, body, 0.3, 10, 1.1, '#c8dcc8');
  f.part(F([[-200, 40], [-80, 24], [80, 30], [220, 50], [230, 60], [210, 150], [120, 200], [-120, 200], [-210, 150], [-228, 60]]), { fill: liq, shade: 0.5, inkW: 1, cast: false }); grain(f, F, [[-200, 40], [220, 50], [210, 150], [120, 200], [-120, 200], [-210, 150]], 0.3, 9, -0.6, '#c8dcc8');
  L(f, F, [[-200, 40], [-80, 24], [80, 30], [220, 50]], 2, '#8aa890', { op: 0.7 }); shadeR(f, F, body, 90, 220, -60, 200, 12, { op: 0.5 }); for (let i = 0; i < 14; i++) f.flat(F(ell([-150 + (i * 41) % 260, 70 + (i * 29) % 110], 4, 3, 0, 6)), '#c8dcc8', { op: 0.45 });
  L(f, F, [[-150, -40], [-200, 60], [-170, 150]], 12, '#e8f0e8', { op: 0.45 }); L(f, F, [[-26, -250], [-30, -150]], 5, '#e8f0e8', { op: 0.45 });
  ring(f, F, [0, -232], 48, 12, 6, mix(glass, '#000', 0.2)); oval(f, F, [0, -262], 40, 10, '#0e120e');
  if (!unstop) { P(f, F, [[-32, -262], [32, -262], [28, -320], [-28, -320]], '#8a6a44', { dress: false }); oval(f, F, [0, -322], 30, 10, '#a8885a'); D.wax(f, F([[-36, -270], [0, -278], [36, -270]]), '#3a2a20', { thick: 5, drips: 1, dripL: 30 }); }
  D.label(f, F([[10, 110]])[0], 120, 70, o.ang ?? 0, '#cdbb94', G => { for (let k = 0; k < 3; k++) f.line(G([[-46, -18 + k * 14], [40, -20 + k * 14]]), 1.2, INK, { op: 0.7, dash: '7 3 4 2' }); });
  D.chip(f, F([[120, 196]])[0], 8, 0); D.bloom(f, F([[-100, 120]])[0], 20, '#1a2a1a', { n: 2, op: 0.4 });
  return { focus: F([[0, 40]])[0], sig: SB(F, [-235, -330, 235, 230]), mouth: F([[0, -264]])[0], feat: ['contents'], ells: [12 / 48, 10 / 40, 0.22] };
};
META.onionbottle = { act: 'pour', only: ['close', 'ledge', 'table', 'niche'] };

O.umbrella = (f, o = {}) => { // an ombrellino, the canopy carried over holy things: a domed silk umbrella in alternate gores, a fringed hem, a gilt finial, a staff
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r, cols = ['#c8bca0', '#5a4a5e'];
  P(f, F, limb([0, -60], [0, 360], 26, 22, { capB: true }), C.OAK, { tex: T(f, 'wood'), texOp: 0.9 });
  const N = 8, rim = []; for (let i = 0; i <= N; i++) { const a = Math.PI + Math.PI * i / N; rim.push([Math.cos(a) * 330, -40 + Math.sin(a) * -30 + 60 * Math.abs(Math.cos(a))]); }
  const apex = [0, -300];
  for (let i = 0; i < N; i++) { const a = rim[i], b = rim[i + 1], m = lerp(a, b, 0.5); const g = [apex, add(lerp(apex, a, 0.55), [-(a[0]) * 0.08, 0]), a, add(m, [0, 24]), b, add(lerp(apex, b, 0.55), [-(b[0]) * 0.08, 0])]; P(f, F, g, cols[i % 2], { tex: T(f, 'weave'), texOp: 0.6, dressO: { op: 0.25 } }); }
  for (let i = 0; i <= N; i++) L(f, F, [apex, add(lerp(apex, rim[i], 0.55), [-rim[i][0] * 0.08, 0]), rim[i]], 3, INK, { op: 0.8 });
  const hem = []; for (let i = 0; i < N; i++) { const a = rim[i], b = rim[i + 1]; hem.push(a, add(lerp(a, b, 0.5), [0, 24])); } hem.push(rim[N]);
  for (let k = 0; k < hem.length - 1; k++) for (let j = 0; j < 4; j++) { const p = lerp(hem[k], hem[k + 1], j / 4); L(f, F, [p, add(p, [0, 34])], 4, C.GILT, { op: 0.9 }); }   // the fringe
  L(f, F, hem, 6, C.GILT); L(f, F, [[-300, -40], [-200, -170], [-60, -270]], 6, '#f8f0e0', { op: 0.4 });
  P(f, F, [[-16, -300], [16, -300], [10, -360], [-10, -360]], C.GILT, { dress: false }); oval(f, F, [0, -372], 24, 24, C.GILT); P(f, F, [[-6, -396], [6, -396], [0, -440]], C.GILT, { sharp: true, dress: false });
  D.stain(f, F([[120, -80]])[0], 40, '#2a1a0c', { op: 0.3 }); D.chip(f, F([[0, 340]])[0], 7, 0);
  return { focus: F([[0, -120]])[0], sig: SB(F, [-335, -445, 335, 60]), grip: { c: F([[0, 260]])[0], thumb: (o.ang ?? -0.15) - Math.PI / 2 }, feat: [], ells: [] };
};
META.umbrella = { act: 'open', gold: true, ang: -0.15 };

module.exports = { O, META, helpers: { C, INKS, SIX, T, loop, L, P, turned, lit, tube, oval, ring, sweep, wear, SB, arcs, shadeR, grain } };
