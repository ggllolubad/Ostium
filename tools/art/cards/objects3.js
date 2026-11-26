// The card object library, part three: objects the audit of all 408 object cards showed were missing, and the
// redrawn bandage and suture. Same contract as objects2.js: (f, o) => { focus, grip? }, drawn with kit.base, dressed.
'use strict';
const K = require('./card_kit');
const G = require('../gear');
const { E, D, INK, BONE } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb } = E;

const IRON = '#4d4f52', OAK = '#5b412a', OAKL = '#7a5a3a', LEATHER = '#5a3e28', LINEN = '#c8bca0', SACK = '#8a7a5a', BRASS = '#9a7a3a',
  BONEC = '#d4c8a8', TWINE = '#9a8460', RUST = '#5a2a12', VERD = '#4f7a66', GLASS = '#6a7a72', SKIN = '#b89a7c', COPPER = '#8a5a34';
const SIX = ['#b8341f', '#8fb2c9', '#c9a43a', '#2f4f8f', '#7d9a3a', '#4b2a5c'];
const T = (f, n) => n + f.o.seed;
const loop = pts => pts.concat([pts[0]]);
function P(f, F, pts, fill, o = {}) {
  const q = F(pts);
  f.part(q, Object.assign({ fill, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 }, o));
  if (o.dress !== false) D.dress(f, q, Object.assign({ lw: 1.2, op: 0.45 }, o.dressO || {}));
  return q;
}
const L = (f, F, pts, w, col, o) => f.line(F(pts), w, col, o);
// a turned profile [[halfwidth, y], ...] from the base up, closed with the front arc of the base ellipse, because the
// viewpoint is a little above the object (Form checklist: openings and bases are ellipses)
const turned = prof => { const [w0, y0] = prof[0], arc = []; for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; arc.push([w0 * Math.cos(t), y0 + w0 * 0.2 * Math.sin(t)]); } return [...prof.map(([w, y]) => [-w, y]).reverse().reverse(), ...prof.slice().reverse().map(([w, y]) => [w, y]), ...arc]; };
const O = {};

// ==== redrawn
O.bandage = (f, o = {}) => { // a roll of linen lying on its side, three-quarter view from above: spiral end, soft body sagging onto the
  // surface, the loose strip leaving the outer turn underneath and lying flat across the boards in two folds, frayed
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, cloth = LINEN, under = mix(LINEN, '#5a4a38', 0.35);
  const C = [-40, 0], RX = 66, RY = 120, A = 0.12, d = [0.96, -0.3], Lx = 170, C2 = add(C, mul(d, Lx));
  const e = (c, k, t) => add(c, rot([Math.cos(t) * RX * k, Math.sin(t) * RY * k], A));
  // cast shadow on the surface, then the strip lying on it (ground plane squashed to 0.42 in y)
  f.flat(F([[C[0] - 40, C[1] + RY + 4], [C2[0] + 40, C2[1] + RY + 8], [C2[0] + 20, C2[1] + RY + 34], [C[0] - 10, C[1] + RY + 30]]), '#120c08', { op: 0.35 });
  const gy = C[1] + RY - 6, path = [[C[0] + 60, gy - 4], [-40, gy + 34], [-150, gy + 20], [-240, gy + 54], [-340, gy + 40], [-400, gy + 60]];
  const P2 = K.catmull(path, 6), Wd = 46, segs = [];
  for (let i = 0; i < P2.length - 1; i++) { const n = E.norm(sub(P2[i + 1], P2[i])), nn = [-n[1], n[0]]; segs.push([add(P2[i], mul(nn, Wd / 2)), add(P2[i + 1], mul(nn, Wd / 2)), add(P2[i + 1], mul(nn, -Wd / 2)), add(P2[i], mul(nn, -Wd / 2))]); }
  const folds = [Math.round(segs.length * 0.38), Math.round(segs.length * 0.7)];
  let face = 0, start = 0;
  [...folds, segs.length].forEach((end, k) => { const q = segs.slice(start, end); if (q.length) { const pts = [...q.map(s => s[0]), q[q.length - 1][1], q[q.length - 1][2], ...q.slice().reverse().map(s => s[3])]; P(f, F, pts, face ? under : cloth, { tex: T(f, 'weave'), texOp: 0.7, dressO: { op: 0.3 } }); } if (end < segs.length) { const s = segs[end]; L(f, F, [s[0], s[3]], 2.4, INK); L(f, F, [add(s[0], [3, 2]), add(s[3], [3, 2])], 1.2, '#f0e8d4', { op: 0.6 }); } face ^= 1; start = end; });
  const tip = P2[P2.length - 1]; for (let i = 0; i < 8; i++) L(f, F, [add(tip, [0, -Wd / 2 + i * Wd / 7]), add(tip, [-14 - r() * 16, -Wd / 2 + i * Wd / 7 + r() * 4])], 1, '#a89c80');
  f.flat(F(ell([-150, gy + 22], 22, 7, 0.1, 10)), '#6a1810', { op: 0.55 });
  // the body: a soft cylinder from the near end back along its axis, its underside flattened where it rests
  const body = [e(C, 1, -Math.PI / 2), e(C2, 1, -Math.PI / 2), e(C2, 1, -Math.PI / 4), e(C2, 1, 0), e(C2, 1, Math.PI / 4), e(C2, 0.98, Math.PI / 2), add(e(C, 0.97, Math.PI / 2), [0, 2])];
  P(f, F, body, mix(cloth, '#000', 0.04), { tex: T(f, 'weave'), texOp: 0.7, shade: 0.5, dressO: { op: 0.4, dir: Math.atan2(d[1], d[0]) } });
  for (let k = 0; k < 4; k++) L(f, F, [e(C, 1, -Math.PI / 2 + 0.5 + k * 0.6), e(C2, 1, -Math.PI / 2 + 0.5 + k * 0.6)], 1, INK, { op: 0.25 }); // the weave runs round the turns
  L(f, F, [e(C2, 1, -0.9), add(e(C2, 1, -0.9), mul(d, -70)), e(C, 1, 1.0)], 1.6, INK, { op: 0.5 }); // the outer turn's edge
  f.flat(F([add(C, [60, -60]), add(C, [150, -100]), add(C, [170, -20]), add(C, [80, 10])]), '#6a1810', { op: 0.42 }); f.flat(F(ell(add(C, [110, -50]), 22, 14, -0.3, 10)), '#4c0c08', { op: 0.5 }); // blood through the turns
  // the spiral end, facing us: turns of cloth wound to a dark core, frayed threads at the rim
  f.part(F(ell(C, RX, RY, A, 30)), { fill: mix(cloth, '#fff', 0.1), shade: 0.35, inkW: 1.8, tex: T(f, 'weave'), texOp: 0.4 });
  const sp = []; for (let i = 0; i <= 130; i++) { const t = i / 130 * Math.PI * 2 * 5.2, k = 0.95 - i / 130 * 0.8; sp.push(e(C, k, t - Math.PI / 2)); }
  L(f, F, sp, 1.5, INK, { op: 0.6 });
  f.part(F(ell(C, RX * 0.13, RY * 0.13, A, 12)), { fill: '#241a10', shade: 0.2, inkW: 1.2, cast: false });
  for (let i = 0; i < 14; i++) { const t = r() * Math.PI * 2, p = e(C, 1, t); L(f, F, [p, add(p, rot([Math.cos(t) * 10, Math.sin(t) * 10], A))], 1, '#a89c80', { op: 0.8 }); }
  f.flat(F([e(C, 0.9, -0.6), e(C, 0.95, -0.1), e(C, 0.6, -0.2)]), '#6a1810', { op: 0.35 });
  L(f, F, [add(C, [30, -90]), add(C, [130, -20])], 4, INK); L(f, F, [add(C, [30, -90]), add(C, [130, -20])], 2, '#9a9c96'); f.part(F(ell(add(C, [26, -94]), 8, 8, 0, 8)), { fill: '#7a7a76', shade: 0.4, inkW: 1, cast: false });
  return { focus: F([C])[0] };
};
O.book = (f, o = {}) => { // an open book seen from the front and above: pages fanned up off a sunken gutter, the page block's
  // thickness at the edges, the boards under it following the same curve with their own thickness, the rounded spine below
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, page = '#d6c8a2', board = LEATHER;
  // a page surface for one side (s = -1 left, 1 right): near edge, outer edge, far edge, gutter; pages rise off the gutter
  const side = s => { const gN = [s * 6, 92], mN = [s * 120, 40], oN = [s * 238, 66], oF = [s * 214, -112], mF = [s * 110, -142], gF = [s * 4, -96]; return { gN, mN, oN, oF, mF, gF }; };
  const shift = (pts, dx, dy) => pts.map(p => [p[0] + dx, p[1] + dy]);
  for (const s of [-1, 1]) { const q = side(s), b = [[s * 0, 118], [s * 130, 74], [s * 262, 98], [s * 236, -96], [s * 120, -128], [s * 0, -84]];
    P(f, F, s < 0 ? b : b.slice().reverse(), board, { tex: T(f, 'mottle'), texOp: 0.7, dressO: { op: 0.35 } }); // the board, curving with the block
    f.part(F([[s * 0, 118], [s * 130, 74], [s * 262, 98], [s * 262, 112], [s * 130, 90], [s * 0, 134]].map((p, i) => s < 0 ? p : p)), { fill: mix(board, '#000', 0.35), shade: 0.3, inkW: 1.4, cast: false }); // its thickness
    f.rivet(F([[s * 236, 96]])[0], 4, '#8a8a86'); f.rivet(F([[s * 222, -84]])[0], 4, '#8a8a86');
    const blk = [q.gN, q.mN, q.oN, add(q.oN, [s * 2, 20]), add(q.mN, [0, 22]), add(q.gN, [0, 18])];
    f.part(F(s < 0 ? blk : blk.slice().reverse()), { fill: mix(page, '#5a4a30', 0.25), shade: 0.35, inkW: 1.3, cast: false }); // page block, near edge
    for (let k = 1; k < 5; k++) L(f, F, [add(q.gN, [0, k * 4]), add(q.mN, [0, k * 4.4]), add(q.oN, [0, k * 4])], 0.8, INK, { op: 0.45 });
    f.part(F([q.oN, q.oF, add(q.oF, [s * 4, 14]), add(q.oN, [s * 2, 20])]), { fill: mix(page, '#5a4a30', 0.35), shade: 0.3, inkW: 1.2, cast: false }); // fore-edge
    const surf = [q.gN, q.mN, q.oN, q.oF, q.mF, q.gF];
    P(f, F, s < 0 ? surf : surf.slice().reverse(), page, { tex: T(f, 'mottle'), texOp: 0.6, dressO: { op: 0.2, from: s < 0 ? 0.55 : 0.3 } });
    for (let k = 0; k < 9; k++) { const t = 0.12 + k * 0.085; if (s > 0 && k > 6) continue; const a = lerp(q.gN, q.gF, t), m = lerp(q.mN, q.mF, t), z = lerp(q.oN, q.oF, t); L(f, F, [lerp(a, m, 0.25), m, lerp(m, z, 0.85)], 1.3, INK, { op: 0.65, dash: `${(8 + r() * 14).toFixed(0)} 3 5 3` }); }
    L(f, F, [q.gN, q.gF], 2.4, INK); // the gutter
  }
  f.part(F([[-18, 108], [18, 108], [26, 128], [0, 142], [-26, 128]]), { fill: mix(board, '#000', 0.2), shade: 0.4, inkW: 1.4 }); // rounded spine below the gutter
  for (const x of [-10, 10]) L(f, F, [[x, 112], [x * 1.4, 136]], 1.4, mix(board, '#fff', 0.3), { op: 0.5 });
  f.flat(F([[-190, -90], [-160, -88], [-162, -60], [-192, -62]]), '#7a1a12', { op: 0.9 }); // rubric initial
  f.part(F([[150, -60], [206, -72], [214, 30], [186, 10], [164, 26], [150, -10]]), { fill: mix(board, '#000', 0.1), shade: 0.3, inkW: 1.2, cast: false }); // a torn-out corner shows the board
  f.part(F([[-5, -10], [5, -10], [8, 92], [14, 150], [8, 172], [2, 152], [-4, 92]]), { fill: '#2e3a2a', shade: 0.4, inkW: 1.1, cast: false }); // ribbon marker from the gutter, over the near edge
  D.stain(f, F([[-110, -20]])[0], 34, '#5a3a18', { op: 0.28 }); f.spatter(F([[90, -90]])[0], 30, 12, INK);
  for (const s of [-1, 1]) { const t = [[s * 250, 104], [s * 280, 140], [s * 266, 180]]; L(f, F, t, 4, INK); L(f, F, t, 2.2, '#3a2a1a'); }
  return { focus: F([[0, -30]])[0] };
};

O.suture = (f, o = {}) => { // close on a curved needle and gut thread drawing a stitched gash shut in a stretched hide
  const F = frame([0, 0], o.ang ?? -0.08, 1), r = f.r;
  P(f, F, [[-320, -40], [-120, -70], [100, -56], [320, -80], [330, 200], [-330, 210]], '#b08c6a', { tex: T(f, 'mottle'), texOp: 0.9 });
  for (let i = 0; i < 18; i++) f.flat(F(ell([-300 + r() * 600, -40 + r() * 230], 1.6, 1.2, 0, 6)), '#5a3a20', { op: 0.6 }); // pores
  // the gash: puckered lips, dark inside, blood beaded along it
  const gash = [[-240, 100], [-120, 82], [0, 92], [120, 78], [230, 92]];
  f.part(F([...gash.map(p => add(p, [0, -12])), ...gash.slice().reverse().map(p => add(p, [0, 12]))]), { fill: '#3a0e0a', shade: 0.2, inkW: 2, cast: false });
  L(f, F, gash.map(p => add(p, [0, -13])), 2, '#d8b49a', { op: 0.7 });
  for (let i = 0; i < 6; i++) { const p = gash[1 + (i % 3)], q = F([add(p, [(r() - 0.5) * 60, 14])])[0]; f.flat(ell(q, 4, 6, 0, 8), '#5c0f0b'); f.flat([add(q, [-3, 4]), add(q, [3, 4]), add(q, [0, 24 + r() * 20])], '#5c0f0b'); }
  // stitches already pulled through
  for (let i = 0; i < 4; i++) { const x = -200 + i * 70; L(f, F, [[x - 14, 56], [x + 14, 128]], 7, INK); L(f, F, [[x - 14, 56], [x + 14, 128]], 4, '#e0d0a8'); f.part(F(ell([x - 14, 54], 8, 6, 0, 8)), { fill: '#e0d0a8', shade: 0.3, inkW: 1.1, cast: false }); }
  // the needle: a heavy curved needle mid-stitch, thread trailing back from its eye
  const nd = []; for (let i = 0; i <= 12; i++) { const a = E.deg(190 + i * 13); nd.push([140 + Math.cos(a) * 150, 40 + Math.sin(a) * 150]); }
  L(f, F, nd, 15, INK); L(f, F, nd, 10, '#8a8c8a'); L(f, F, nd.slice(2, 9), 2.4, '#f0f0ea', { op: 0.85 });
  f.flat(F(ell(nd[12], 6, 4, 0, 8)), '#0a0a0a'); D.bloom(f, F([nd[4]])[0], 10, RUST, { n: 2, specks: 4 });
  const th = [nd[12], [330, -60], [260, -150], [120, -170], [-40, -120], [-130, 50]];
  L(f, F, th, 7, INK); L(f, F, th, 4, '#e0d0a8'); for (let i = 1; i < th.length; i++) L(f, F, [lerp(th[i - 1], th[i], 0.4), lerp(th[i - 1], th[i], 0.45)], 1.4, INK, { op: 0.7 });
  f.spatter(F([[40, 130]])[0], 50, 16); D.wear(f, F([[0, 0]])[0], 260, 60, 30);
  return { focus: F([[60, 80]])[0] };
};

// ==== cloth, sacks and gear
O.hood = (f, o = {}) => { // a limp sacking hood, soaked through and steaming, its drawstring hanging
  const F = frame([0, 0], o.ang ?? 0.08, 1), r = f.r;
  const out = [[-150, 200], [-180, 60], [-160, -80], [-90, -190], [10, -220], [110, -180], [170, -60], [190, 80], [160, 200], [80, 170], [0, 200], [-80, 176]];
  P(f, F, out, SACK, { tex: T(f, 'weave'), texOp: 0.9 });
  L(f, F, [[-120, -100], [-40, -170], [60, -180]], 2, INK, { op: 0.6 }); L(f, F, [[-60, 120], [-80, 0], [-50, -110]], 2.4, INK, { op: 0.6 }); L(f, F, [[60, 150], [90, 20], [70, -120]], 2.4, INK, { op: 0.6 }); // folds where it slumps
  f.stitches(F([[-160, 60], [-150, -80], [-90, -180]]), '#d8cbb0', 1.4);
  P(f, F, [[-130, 150], [150, 150], [146, 186], [-140, 190]], mix(SACK, '#000', 0.15), { tex: T(f, 'weave'), texOp: 0.7, dress: false }); // hem
  const ds = [[100, 170], [140, 230], [120, 290]]; L(f, F, ds, 5, INK); L(f, F, ds, 3, '#6a5a40'); f.part(F(ell([120, 296], 10, 8, 0, 8)), { fill: '#6a5a40', shade: 0.4, inkW: 1, cast: false });
  for (const [a, b2] of [[[-20, -200], [-70, 140]], [[30, -200], [40, 150]], [[80, -170], [130, 120]]]) { L(f, F, [a, lerp(a, b2, 0.5), b2], 3, INK, { op: 0.5 }); L(f, F, [add(a, [-5, 4]), add(lerp(a, b2, 0.5), [-6, 0]), add(b2, [-5, 0])], 1.6, mix(SACK, '#fff', 0.3), { op: 0.5 }); }
  f.part(F([[-120, 120], [120, 116], [128, 150], [-128, 154]]), { fill: mix(SACK, '#000', 0.2), shade: 0.4, inkW: 1.2, cast: false }); for (let i = 0; i < 12; i++) L(f, F, [[-118 + i * 20, 122], [-122 + i * 20, 150]], 1.2, INK, { op: 0.6 }); // gathered at the neck
  f.flat(F([[-180, 60], [-160, -80], [-100, -40], [-120, 100]]), '#2a2014', { op: 0.35 }); // wet dark
  for (let i = 0; i < 6; i++) { const x = -120 + i * 50; f.flat(F([[x - 3, 196], [x + 3, 196], [x, 220 + r() * 20]]), '#3a4a52', { op: 0.8 }); }
  for (let i = 0; i < 4; i++) L(f, F, [[-60 + i * 40, -230], [-50 + i * 40, -270], [-64 + i * 40, -310]], 2.4, '#d8d4c8', { op: 0.5 });
  return { focus: F([[0, 0]])[0], top: F([[10, -220]])[0] };
};
O.sack = (f, o = {}) => { // a tied sack, patched, spilling: dirt, powder, rats' gnawed corner
  const F = frame([0, 0], o.ang ?? -0.05, 1), r = f.r;
  P(f, F, [[-160, 180], [-190, 60], [-150, -60], [-70, -120], [-40, -170], [40, -170], [70, -120], [160, -50], [190, 70], [160, 180]], SACK, { tex: T(f, 'weave'), texOp: 0.9 });
  P(f, F, [[-50, -170], [-80, -230], [-30, -260], [10, -220], [50, -260], [80, -224], [50, -170]], mix(SACK, '#fff', 0.08), { tex: T(f, 'weave'), texOp: 0.8 });
  D.twine(f, F([[-50, -176], [-50, -168]]), F([[50, -176], [50, -168]]), 4, TWINE, { knot: F([[54, -172]])[0], ends: [F([[80, -140], [90, -100]])] });
  f.part(F([[40, 0], [120, -10], [126, 70], [44, 80]]), { fill: mix(SACK, '#5a4a30', 0.5), shade: 0.4, inkW: 1.2, tex: T(f, 'weave'), texOp: 0.7 }); f.stitches(F([[40, 0], [120, -10], [126, 70], [44, 80], [40, 0]]), '#d8cbb0', 1);
  L(f, F, [[-120, 100], [-140, -20], [-100, -100]], 2.2, INK, { op: 0.55 }); L(f, F, [[100, 150], [130, 60]], 2.2, INK, { op: 0.55 });
  const spill = o.course === 'toxin' ? '#7a7a3a' : o.course === 'fire' ? '#d8d0b8' : '#3a2a1a';
  f.part(F([[150, 150], [190, 120], [230, 140], [340, 180], [300, 200], [170, 200]]), { fill: spill, shade: 0.3, inkW: 1.2, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
  f.flat(F([[150, 120], [176, 100], [190, 130], [166, 150]]), '#120c08'); // the gnawed hole it spills from
  for (let i = 0; i < 30; i++) f.flat(F(ell([180 + r() * 180, 170 + r() * 40], 1.4 + r() * 2, 1.2, 0, 6)), spill, { op: 0.9 });
  D.stain(f, F([[-80, 120]])[0], 40, '#3a2a14', { op: 0.35 });
  return { focus: F([[0, 0]])[0], top: F([[0, -250]])[0] };
};
O.barbs = (f, o = {}) => { // a coil of barbed flagellant's cord: knotted cord with iron barbs bound in, blood on the points
  const F = frame([0, 0], o.ang ?? 0.1, 1), r = f.r, pts = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * Math.PI * 4.4, R = 200 - t * 90; pts.push([Math.cos(a) * R, Math.sin(a) * R * 0.55 + t * 40]); }
  L(f, F, pts, 13, INK); L(f, F, pts, 8, '#4a3a2a'); for (let i = 2; i < pts.length; i += 2) L(f, F, [lerp(pts[i - 1], pts[i], 0.3), lerp(pts[i - 1], pts[i], 0.6)], 1.4, '#8a7454', { op: 0.8 });
  for (let i = 3; i < pts.length - 1; i += 4) { const p = pts[i], d = E.norm(sub(pts[i + 1], pts[i - 1])), n = [-d[1], d[0]];
    for (const s of [1, -1]) { const q = add(p, mul(n, s * 34)); f.part(F([add(p, mul(d, -5)), q, add(p, mul(d, 5))]), { fill: '#6a6a6c', shade: 0.4, inkW: 1.2, cast: false, sharp: true }); if (r() < 0.4) f.flat(F(ell(q, 3, 4, 0, 6)), '#5c0f0b'); }
    f.part(F(ell(p, 10, 8, 0, 8)), { fill: '#3a2a1a', shade: 0.4, inkW: 1.1, cast: false }); }
  const tail = [pts[60], [60, 200], [140, 250], [240, 230]]; L(f, F, tail, 13, INK); L(f, F, tail, 8, '#4a3a2a');
  f.spatter(F([[0, 40]])[0], 120, 26); D.bloom(f, F([[-80, 0]])[0], 30, RUST, { n: 3 });
  return { focus: F([[0, 30]])[0] };
};
O.feather = (f, o = {}) => { // a black flight feather, ragged, a drop of blood on its quill, a small bone tied to it
  const F = frame([0, 0], o.ang ?? -0.7, 1), r = f.r;
  const vane = []; for (let i = 0; i <= 14; i++) { const t = i / 14; vane.push([-250 + t * 480, -Math.sin(Math.PI * Math.pow(t, 0.8)) * 70 - 6]); }
  for (let i = 14; i >= 0; i--) { const t = i / 14; vane.push([-250 + t * 480, Math.sin(Math.PI * Math.pow(t, 0.9)) * 52 + 6]); }
  P(f, F, vane, '#24222a', { tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.25, lt: '#9a98a8' } });
  for (let i = 0; i < 26; i++) { const x = -230 + i * 17, up = r() < 0.5; L(f, F, [[x, 0], [x + 26, up ? -50 : 40]], 1.2, '#6a6878', { op: 0.6 }); }
  for (const x of [-60, 90]) f.flat(F([[x, -4], [x + 30, -70], [x + 42, -66], [x + 10, 0]]), mix('#5a4a38', '#000', 0.1)); // splits in the vane
  L(f, F, [[-310, 4], [240, 0]], 6, INK); L(f, F, [[-310, 4], [240, 0]], 3.4, '#d8d0bc');
  f.flat(F(ell([-300, 8], 6, 8, 0, 8)), '#5c0f0b'); f.flat(F([[-304, 14], [-296, 14], [-300, 40]]), '#5c0f0b');
  D.twine(f, F([[-280, -6], [-276, -6]]), F([[-280, 14], [-276, 14]]), 3, '#3a2a1a', { knot: F([[-270, 20]])[0], ends: [F([[-276, 60], [-260, 80]])] });
  f.part(F(limb([-260, 80], [-200, 110], 18, 14, { capK: 0.9 })), { fill: BONEC, shade: 0.4, inkW: 1.2 });
  return { focus: F([[0, 0]])[0] };
};
O.bellrope = (f, o = {}) => { // a belfry rope coming down out of the dark, its striped woollen grip (the sally) worn bare, the tail coiled
  const F = frame([0, 0], o.ang ?? 0.04, 1), r = f.r;
  L(f, F, [[0, -400], [4, -140]], 14, INK); L(f, F, [[0, -400], [4, -140]], 9, '#7a6a4a'); for (let y = -390; y < -140; y += 14) L(f, F, [[-5, y], [7, y + 8]], 1.4, INK, { op: 0.7 });
  P(f, F, limb([4, -140], [6, 80], 46, 46, { capK: 0.4 }), '#7a2a20', { tex: T(f, 'weave'), texOp: 0.8 });
  for (let i = 0; i < 6; i++) f.part(F([[-23, -120 + i * 36], [27, -124 + i * 36], [28, -108 + i * 36], [-22, -104 + i * 36]]), { fill: i % 2 ? '#d0c6a8' : '#2f4f6f', shade: 0.4, inkW: 1, cast: false });
  f.flat(F([[-23, -40], [10, -46], [12, 20], [-20, 26]]), '#6a5a40', { op: 0.6 }); // worn by hands
  const tail = [[6, 80], [10, 160], [-60, 230], [-140, 220], [-160, 170], [-80, 150], [40, 190], [120, 240], [60, 280]];
  L(f, F, tail, 14, INK); L(f, F, tail, 9, '#7a6a4a'); for (let i = 1; i < tail.length; i++) L(f, F, [lerp(tail[i - 1], tail[i], 0.5), add(lerp(tail[i - 1], tail[i], 0.5), [6, 6])], 1.4, INK, { op: 0.7 });
  for (let i = 0; i < 5; i++) L(f, F, [[56 + i * 4, 280], [50 + i * 7, 300 + r() * 10]], 1.4, '#7a6a4a');
  return { focus: F([[4, -40]])[0], top: F([[0, -400]])[0] };
};

// ==== the alchemist's apparatus
O.alembic = (f, o = {}) => { // a glass alembic on its stand: the bulb of brew, the head, the long beak dripping into a flask
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = o.course === 'physical' ? '#7a5a2a' : mix(K.INK6[o.course] || '#7a5a2a', '#4a3a20', 0.4);
  for (const [a, b] of [[[-110, 60], [-150, 210]], [[110, 60], [150, 210]], [[0, 80], [0, 220]]]) { L(f, F, [a, b], 12, INK); L(f, F, [a, b], 8, IRON); }
  P(f, F, [[-130, 50], [130, 50], [120, 80], [-120, 80]], IRON, { dressO: { op: 0.4 } });
  P(f, F, ell([0, -20], 120, 96, 0, 28), GLASS, { tex: T(f, 'mottle'), texOp: 0.3 });
  f.part(F([[-112, 10], [-60, 0], [0, 8], [60, -2], [112, 12], [80, 60], [0, 74], [-80, 60]]), { fill: liq, shade: 0.45, inkW: 1.1, cast: false });
  for (let i = 0; i < 8; i++) f.line(F(loop(ell([-60 + r() * 120, 20 + r() * 40], 4, 4, 0, 8))), 1, '#e8e0c0', { op: 0.6 });
  L(f, F, [[-80, -80], [-96, -30]], 5, '#e8ecd8', { op: 0.5 });
  P(f, F, turned([[30, -100], [26, -150], [56, -190], [50, -230], [20, -250]]), GLASS, { tex: T(f, 'mottle'), texOp: 0.3, dressO: { op: 0.3 } });
  const beak = [[40, -210], [180, -160], [300, -90], [330, -70]]; L(f, F, beak, 22, INK); L(f, F, beak, 16, GLASS); L(f, F, beak, 2, '#e8ecd8', { op: 0.6 });
  for (let i = 0; i < 3; i++) f.flat(F(ell([332, -40 + i * 26], 5, 7, 0, 8)), liq);
  P(f, F, turned([[46, 150], [52, 100], [20, 60], [16, 30]]).map(p => [p[0] + 330, p[1]]), GLASS, { tex: T(f, 'mottle'), texOp: 0.3 });
  f.flat(F([[294, 120], [366, 120], [374, 148], [286, 148]]), liq, { op: 0.9 });
  D.wax(f, F([[-24, -98], [0, -104], [24, -98]]), '#6a1a12', { thick: 4, drips: 1, dripL: 24 });
  D.label(f, F([[60, 40]])[0], 50, 40, 0.1, '#cdbb94', G2 => f.line(G2([[-16, 0], [14, -2]]), 1.2, INK, { op: 0.7 }));
  for (let i = 0; i < 4; i++) L(f, F, [[-40 + i * 26, -260], [-30 + i * 26, -300], [-44 + i * 26, -340]], 2.4, '#d8d4c8', { op: 0.5 });
  return { focus: F([[0, -20]])[0] };
};
O.crucible = (f, o = {}) => { // a clay crucible hung glowing on its chain over coals, the melt in it bright, slag on its lip
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (let i = 0; i < 5; i++) { const c = [i % 2 ? 4 : 0, -330 + i * 40]; const e = ell(c, i % 2 ? 10 : 16, i % 2 ? 18 : 12, 0, 12); f.line(F(loop(e)), 9, INK); f.line(F(loop(e)), 5, IRON); }
  L(f, F, [[0, -140], [-110, -60]], 7, INK); L(f, F, [[0, -140], [110, -60]], 7, INK); L(f, F, [[0, -140], [-110, -60]], 4, IRON); L(f, F, [[0, -140], [110, -60]], 4, IRON);
  P(f, F, [[-130, -70], [130, -70], [110, 60], [60, 110], [-60, 110], [-110, 60]], '#8a6a52', { tex: T(f, 'mottle'), texOp: 0.8 });
  f.part(F(ell([0, -70], 130, 24, 0, 20)), { fill: '#2a1a12', shade: 0.2, inkW: 1.6, cast: false });
  f.flat(F(ell([0, -66], 114, 16, 0, 20)), o.course === 'void' ? '#140c18' : '#d8682a'); f.flat(F(ell([-20, -68], 60, 7, 0, 16)), o.course === 'void' ? '#6a4a8a' : '#f8c87a', { op: 0.9 });
  for (let i = 0; i < 5; i++) f.part(F(ell([-110 + i * 50, -78], 14, 8, 0, 8)), { fill: '#3a2a20', shade: 0.4, inkW: 1, cast: false }); // slag on the lip
  f.flat(F([[-130, -70], [-60, -40], [-40, 60], [-110, 60]]), '#1a0e08', { op: 0.4 }); f.flat(F([[-90, -20], [-60, -10], [-70, 40]]), '#e8904a', { op: 0.35 }); // the glow through a crack
  D.crack(f, F([[-80, -40]])[0], 1.4, 90, { n: 5, lip: '#e8904a' });
  for (let i = 0; i < 9; i++) f.part(F(ell([-140 + i * 34, 170 - r() * 20], 22, 15, r(), 10)), { fill: i % 3 ? '#2a1a14' : '#9a4a1e', shade: 0.4, inkW: 1.2, cast: false });
  for (let i = 0; i < 12; i++) f.flat(F(ell([(r() - 0.5) * 260, -100 - r() * 160], 1.6, 1.6, 0, 6)), r() < 0.5 ? '#e8904a' : '#3a3030', { op: 0.85 });
  return { focus: F([[0, -60]])[0], top: F([[0, -340]])[0] };
};
O.mortar = (f, o = {}) => { // a brass mortar and pestle, a horn spoon, ground powder spilled round it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, limb([10, -40], [150, -260], 40, 32, { capK: 0.9 }), '#8a7458', { tex: T(f, 'wood'), texOp: 0.7 });
  P(f, F, turned([[110, 160], [130, 130], [150, 20], [168, -40], [176, -56]]), BRASS, { tex: T(f, 'mottle'), texOp: 0.7 });
  f.part(F(ell([0, -56], 176, 32, 0, 24)), { fill: '#2a1e12', shade: 0.2, inkW: 1.6, cast: false });
  f.flat(F(ell([0, -50], 150, 22, 0, 24)), o.course === 'physical' ? '#c8b890' : mix(K.INK6[o.course] || '#c8b890', '#d8d0b8', 0.5));
  for (const y of [40, 100]) L(f, F, [[-150 + (y - 40) * 0.2, y], [0, y + 10], [150 - (y - 40) * 0.2, y]], 2.4, mix(BRASS, '#000', 0.4));
  D.bloom(f, F([[-80, 120]])[0], 22, VERD, { n: 3, specks: 8 }); f.flat(F(ell([60, 60], 16, 10, 0.3, 10)), '#2a1a0c', { op: 0.45 });
  f.part(F([[160, 130], [300, 100], [320, 112], [300, 124], [190, 150]]), { fill: '#3a2e22', shade: 0.4, inkW: 1.2 });
  f.part(F(ell([330, 112], 30, 18, -0.2, 12)), { fill: '#3a2e22', shade: 0.4, inkW: 1.2 }); // the horn spoon
  for (let i = 0; i < 24; i++) f.flat(F(ell([-200 + r() * 420, 160 + r() * 30], 1.6, 1.2, 0, 6)), '#c8b890', { op: 0.85 });
  return { focus: F([[0, -50]])[0] };
};
O.bellows = (f, o = {}) => { // a pair of leather bellows, the boards cracked, a patched bag, fumes coming off the nozzle
  const F = frame([0, 0], o.ang ?? -0.15, 1), r = f.r;
  P(f, F, [[-260, -110], [80, -40], [80, 40], [-260, 110], [-300, 60], [-300, -60]], LEATHER, { tex: T(f, 'mottle'), texOp: 0.8 });
  for (let i = 1; i < 5; i++) L(f, F, [[-260 + i * 60, -100 + i * 14], [-270 + i * 60, 100 - i * 14]], 2, INK, { op: 0.7 });
  P(f, F, [[-300, -130], [90, -52], [100, -30], [-300, -86]], OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  P(f, F, [[-300, 86], [100, 30], [90, 52], [-300, 130]], OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  for (const s of [-1, 1]) P(f, F, limb([-300, s * 108], [-400, s * 150], 26, 22, { capK: 0.7 }), OAKL, { tex: T(f, 'wood'), texOp: 0.8, dress: false });
  P(f, F, [[90, -20], [250, -8], [250, 8], [90, 20]], BRASS, { dressO: { op: 0.4 } });
  for (let i = 0; i < 6; i++) f.rivet(F([[-260 + i * 64, -110 + i * 13]])[0], 3, '#6a6a66');
  f.part(F([[-160, -30], [-100, -40], [-96, 20], [-156, 30]]), { fill: mix(LEATHER, '#c8b08a', 0.3), shade: 0.4, inkW: 1.1 }); f.stitches(F([[-160, -30], [-100, -40], [-96, 20], [-156, 30], [-160, -30]]), '#c8b08a', 1);
  D.crack(f, F([[-200, -100]])[0], 0.3, 90, { n: 4, forks: false, lip: '#a88a62' });
  return { focus: F([[260, 0]])[0], grip: { c: F([[-380, -140]])[0], thumb: (o.ang ?? -0.15) + Math.PI / 2 } };
};
O.vessel = (f, o = {}) => { // the Accumulator's brass vessel: banded, gauged, a wax stopper, seams leaking light
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, turned([[110, 200], [140, 150], [150, 0], [130, -110], [70, -170], [56, -200]]), BRASS, { tex: T(f, 'mottle'), texOp: 0.7 });
  for (const y of [-120, -20, 80, 160]) { L(f, F, [[-148 + Math.abs(y) * 0.05, y], [0, y + 10], [148 - Math.abs(y) * 0.05, y]], 10, INK); L(f, F, [[-146 + Math.abs(y) * 0.05, y], [0, y + 10], [146 - Math.abs(y) * 0.05, y]], 6, mix(BRASS, '#000', 0.25)); for (const x of [-110, -40, 40, 110]) f.rivet(F([[x, y + 6]])[0], 2.6, '#c8a860'); }
  f.part(F(ell([60, 30], 40, 40, 0, 18)), { fill: '#d8d0b8', shade: 0.3, inkW: 2.4, cast: false }); for (let i = 0; i < 9; i++) { const a = E.deg(200 + i * 18); L(f, F, [[60 + Math.cos(a) * 30, 30 + Math.sin(a) * 30], [60 + Math.cos(a) * 38, 30 + Math.sin(a) * 38]], 1.2, INK); }
  L(f, F, [[60, 30], [84, 6]], 3, '#6a1a12'); f.flat(F(ell([60, 30], 4, 4, 0, 6)), INK);
  P(f, F, [[-50, -200], [50, -200], [44, -250], [-44, -250]], '#8a6a44', { tex: T(f, 'mottle'), texOp: 0.8, dress: false });
  D.wax(f, F([[-60, -238], [-30, -256], [0, -260], [30, -256], [60, -238]]), '#c8b890', { thick: 6, drips: 1, dripL: 40 });
  const glow = o.course && o.course !== 'physical' ? K.INK6[o.course] : '#f0e0a0';
  for (const [a, b] of [[[-140, 40], [-120, -10]], [[-90, 140], [-60, 120]], [[130, 120], [110, 160]]]) { L(f, F, [a, b], 4, glow, { op: 0.9 }); L(f, F, [a, b], 1, '#ffffff', { op: 0.7 }); }
  D.bloom(f, F([[-80, 60]])[0], 26, VERD, { n: 3, specks: 8 }); D.bloom(f, F([[90, -80]])[0], 18, VERD, { n: 2 });
  return { focus: F([[0, -40]])[0] };
};

// ==== the duelist's and executioner's blades
O.sword = (f, o = {}) => { // a long blade: the executioner's square-tipped sword, or with o.rapier the swept hilt
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r, rap = !!o.rapier;
  const tip = rap ? [[300, -6], [360, 0], [300, 6]] : [[300, -24], [330, -24], [330, 24], [300, 24]];
  P(f, F, [[-60, rap ? -10 : -26], ...tip.slice(0, rap ? 2 : 2), ...tip.slice(2), [-60, rap ? 10 : 26]], '#aab0b4', { sharp: !rap, dressO: { op: 0.35 } });
  L(f, F, [[-50, 0], [rap ? 340 : 320, 0]], rap ? 1.6 : 3, mix('#aab0b4', '#000', 0.45)); L(f, F, [[-50, rap ? -7 : -18], [300, rap ? -4 : -20]], 1.2, '#f0f2f2', { op: 0.8 });
  if (!rap) { for (const x of [60, 160]) f.flat(F(ell([x, 0], 6, 6, 0, 8)), '#1a1a1a'); L(f, F, [[200, -10], [260, 12]], 2, '#4c0c08', { op: 0.7 }); }
  for (const x of [80, 140, 230]) D.chip(f, F([[x, rap ? -9 : -24]])[0], 5, (o.ang ?? -0.35) + Math.PI);
  f.scratches(F([[120, 0]])[0], 50, 8, '#f0f0ea');
  if (rap) G.rapierHilt(f, F([[-60, 0]])[0], (o.ang ?? -0.35), 34, '#7a746a', {});
  else { P(f, F, [[-80, -80], [-60, -80], [-60, 80], [-80, 80]], IRON, { sharp: true, dressO: { op: 0.4 } }); P(f, F, [[-220, -16], [-80, -14], [-80, 14], [-220, 16]], '#2a2018', { tex: T(f, 'mottle'), texOp: 0.6 }); for (let i = 0; i < 8; i++) L(f, F, [[-210 + i * 16, -16], [-200 + i * 16, 16]], 2, '#6a5a44'); f.part(F(ell([-240, 0], 26, 22, 0, 12)), { fill: IRON, shade: 0.45, inkW: 1.4 }); }
  f.spatter(F([[220, 0]])[0], 50, 14);
  return { focus: F([[150, 0]])[0], grip: { c: F([[rap ? -90 : -150, 0]])[0], thumb: (o.ang ?? -0.35) } };
};
O.rapier = (f, o) => O.sword(f, Object.assign({ rapier: true }, o));

// ==== the oracle's tools
O.clock = (f, o = {}) => { // a brass clock face, its glass cracked, the hands stopped together, a winding key in it
  const F = frame([0, 0], o.ang ?? -0.08, 1), r = f.r;
  D.slab(f, F(ell([0, 0], 200, 200, 0, 36)), [16, 12], mix(BRASS, '#000', 0.5));
  P(f, F, ell([0, 0], 200, 200, 0, 36), BRASS, { tex: T(f, 'mottle'), texOp: 0.7 });
  f.part(F(ell([0, 0], 164, 164, 0, 36)), { fill: '#d8ccb0', shade: 0.35, inkW: 1.8, tex: T(f, 'mottle'), texOp: 0.5 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; L(f, F, [[Math.cos(a) * 140, Math.sin(a) * 140], [Math.cos(a) * 156, Math.sin(a) * 156]], i % 3 ? 2 : 5, INK); }
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; f.flat(F(ell([Math.cos(a) * 150, Math.sin(a) * 150], 1, 1, 0, 6)), INK); }
  const ha = E.deg(-90 + (o.hour ?? 0) * 30); L(f, F, [[0, 0], [Math.cos(ha) * 110, Math.sin(ha) * 110]], 9, INK); L(f, F, [[0, 0], [Math.cos(ha) * 140, Math.sin(ha) * 140]], 5, INK);
  f.part(F(ell([0, 0], 14, 14, 0, 12)), { fill: BRASS, shade: 0.4, inkW: 1.4 });
  for (let i = 0; i < 4; i++) D.crack(f, F([[40, -60]])[0], i * 1.6 + 0.4, 90 + r() * 50, { n: 4, lip: '#f0f0ea' });
  f.flat(F([[-140, -60], [-60, -140], [-40, -100], [-110, -30]]), '#ffffff', { op: 0.15 });
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; f.rivet(F([[Math.cos(a) * 182, Math.sin(a) * 182]])[0], 3, '#c8a860'); }
  P(f, F, limb([150, 150], [260, 260], 16, 16), BRASS, { dress: false }); f.line(F(loop(ell([280, 280], 34, 24, 0.8, 14))), 10, INK); f.line(F(loop(ell([280, 280], 34, 24, 0.8, 14))), 6, BRASS);
  D.bloom(f, F([[-150, 120]])[0], 24, VERD, { n: 3 }); f.flat(F(ell([120, -140], 20, 10, 0.6, 10)), '#2a1a0c', { op: 0.45 });
  if (o.course === 'frost') for (let i = 0; i < 20; i++) f.flat(F(ell([(r() - 0.5) * 300, (r() - 0.5) * 300], 3, 1.4, r(), 6)), '#eef4f6', { op: 0.8 });
  return { focus: F([[0, 0]])[0] };
};
O.knuckles = (f, o = {}) => { // knucklebones cast from an open pouch, one standing on end, a cord and a red-marked bone
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-260, 60], [-300, -40], [-240, -120], [-150, -130], [-100, -60], [-120, 60]], LEATHER, { tex: T(f, 'mottle'), texOp: 0.8 });
  f.part(F(ell([-130, -20], 30, 70, 0.3, 14)), { fill: '#1e140c', shade: 0.2, inkW: 1.4, cast: false });
  D.twine(f, F([[-240, -120], [-232, -116]]), F([[-150, -130], [-146, -124]]), 3, '#2a2420', { knot: F([[-150, -136]])[0], ends: [F([[-120, -170], [-80, -180]])] });
  const kb = (c, a, s, mark) => { const G2 = frame(F([c])[0], a + (o.ang ?? 0), s); f.part(G2([[-30, -14], [-10, -22], [10, -20], [30, -12], [34, 8], [14, 18], [-12, 16], [-34, 6]]), { fill: BONEC, shade: 0.45, inkW: 1.4, tex: T(f, 'mottle'), texOp: 0.6 }); f.flat(G2(ell([0, 0], 8, 5, 0, 8)), '#8a7a60', { op: 0.7 }); f.line(G2([[-20, -4], [20, -6]]), 1, INK, { op: 0.5 }); if (mark) f.line(G2([[-10, -10], [10, 8]]), 3, '#7a1a12', { op: 0.9 }); };
  [[-30, 10, 0.3, 1.6], [60, -30, -0.6, 1.5], [140, 30, 1.2, 1.7], [220, -10, 2.4, 1.4], [40, 90, 1.9, 1.6], [180, 110, 0.4, 1.5]].forEach(([x, y, a, s], i) => kb([x, y], a, s, i === 2));
  P(f, F, [[90, -110], [110, -150], [130, -110], [124, -40], [96, -40]], BONEC, { dress: false }); // one stands on end
  for (let i = 0; i < 12; i++) f.flat(F(ell([-40 + r() * 300, 140 + r() * 30], 2, 1.4, 0, 6)), '#3a2a1a', { op: 0.7 });
  return { focus: F([[80, 20]])[0] };
};
O.lens = (f, o = {}) => { // round iron spectacles, one lens cracked and fogged, a bent arm, a cord to hang them by
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r;
  for (const x of [-120, 120]) { f.part(F(ell([x, 0], 100, 92, 0, 30)), { fill: '#7a8a8a', shade: 0.25, inkW: 2, hatch: false, opacity: 0.55, tex: T(f, 'mottle'), texOp: 0.3 }); f.line(F(loop(ell([x, 0], 102, 94, 0, 30))), 16, INK); f.line(F(loop(ell([x, 0], 102, 94, 0, 30))), 10, IRON); f.line(F(ell([x, 0], 102, 94, 0, 30).slice(16, 24)), 2.4, '#a8a8a4', { op: 0.7 }); f.line(F([[x - 60, -40], [x - 30, -64]]), 5, '#f0f2f2', { op: 0.5 }); }
  for (let i = 0; i < 4; i++) D.crack(f, F([[140, 10]])[0], i * 1.5 + 0.3, 60 + r() * 30, { n: 4, lip: '#f0f2f2' });
  f.flat(F(ell([110, 30], 60, 40, 0, 16)), '#e0e4e0', { op: 0.3 });
  L(f, F, [[-20, -10], [0, -30], [20, -10]], 14, INK); L(f, F, [[-20, -10], [0, -30], [20, -10]], 8, IRON);
  for (const s of [-1, 1]) { const arm = [[s * 222, -10], [s * 290, -16], [s * 330, s > 0 ? 30 : -20], [s * 340, s > 0 ? 70 : -60]]; L(f, F, arm, 10, INK); L(f, F, arm, 6, IRON); }
  L(f, F, [[-340, -60], [-300, 120], [-100, 180], [100, 170], [340, 70]], 2, '#2a2420');
  D.bloom(f, F([[-200, 60]])[0], 14, RUST, { n: 2 }); f.scratches(F([[-120, 20]])[0], 50, 6, '#f0f2f2');
  return { focus: F([[-120, 0]])[0] };
};

// ==== coins, scales, hands, rings and brushes
O.coins = (f, o = {}) => { // a short stack of worn coins, one rolled away on its edge, a clipped one; gold is for money
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (let i = 0; i < 7; i++) { const c = [(r() - 0.5) * 16, 120 - i * 26], rim = []; for (let k = 0; k <= 12; k++) { const t = Math.PI * k / 12; rim.push([c[0] + 110 * Math.cos(t), c[1] + 28 * Math.sin(t)]); }
    f.part(F([[c[0] + 110, c[1] - 24], ...rim, [c[0] - 110, c[1] - 24]]), { fill: '#a8842a', shade: 0.5, inkW: 1.4, cast: false }); for (let k = 1; k < 12; k++) { const p = rim[k]; L(f, F, [add(p, [0, -22]), add(p, [0, -2])], 1, '#5a4210', { op: 0.6 }); } }
  const top = [0, 120 - 7 * 26 + 2]; f.part(F(ell(top, 110, 28, 0, 24)), { fill: '#c8a03a', shade: 0.35, inkW: 1.6, cast: false });
  f.line(F(ell(top, 70, 18, 0, 18).slice(0, 12)), 1.4, '#5a4210', { op: 0.8 }); f.flat(F(ell([-10, top[1] - 2], 18, 6, 0, 10)), '#6a4a12', { op: 0.6 });
  const ed = [230, 80]; f.part(F(ell(ed, 30, 104, 0.12, 24)), { fill: '#b8902e', shade: 0.45, inkW: 1.6 }); f.line(F(ell(ed, 18, 70, 0.12, 18).slice(0, 10)), 1.2, '#5a4210', { op: 0.8 });
  f.part(F([[-260, 150], [-170, 140], [-150, 164], [-180, 176], [-260, 172]]), { fill: '#a8842a', shade: 0.4, inkW: 1.3, cast: false }); // a clipped coin lying flat
  for (let i = 0; i < 4; i++) f.flat(F(ell([-100 + r() * 300, 150 + r() * 20], 5, 2, 0, 6)), '#3a2a10', { op: 0.6 });
  return { focus: F([[0, 0]])[0] };
};
O.scales = (f, o = {}) => { // a pair of iron scales on a post, the pans hanging on chains, one tipped by what is in it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, tilt = o.level ? 0 : 0.14;
  P(f, F, limb([0, 230], [0, -200], 26, 18, { capB: false }), IRON, { dressO: { op: 0.45 } });
  P(f, F, [[-110, 260], [110, 260], [90, 224], [-90, 224]], OAK, { tex: T(f, 'wood'), texOp: 0.8 });
  const beam = [[-240, -200 + 240 * tilt], [240, -200 - 240 * tilt]];
  L(f, F, beam, 16, INK); L(f, F, beam, 10, IRON); f.part(F(ell([0, -200], 18, 18, 0, 12)), { fill: IRON, shade: 0.4, inkW: 1.4 }); f.rivet(F([[0, -200]])[0], 5, '#8a8a86');
  for (const [b, s] of [[beam[0], -1], [beam[1], 1]]) { const pan = add(b, [0, 220]); for (const dx of [-60, 60]) { L(f, F, [b, add(pan, [dx, -10])], 3, INK); L(f, F, [b, add(pan, [dx, -10])], 1.6, '#8a8a86', { dash: '6 3' }); } f.part(F([add(pan, [-80, -12]), add(pan, [80, -12]), add(pan, [60, 20]), add(pan, [-60, 20])]), { fill: '#6a6c6a', shade: 0.45, inkW: 1.5 }); if (s < 0) for (let i = 0; i < 5; i++) f.part(F(ell(add(pan, [-30 + i * 14, -22 - (i % 2) * 10]), 14, 6, 0, 10)), { fill: '#a8842a', shade: 0.4, inkW: 1, cast: false }); else f.part(F(ell(add(pan, [0, -26]), 20, 16, 0, 12)), { fill: o.course && o.course !== 'physical' ? K.INK6[o.course] : '#5c0f0b', shade: 0.45, inkW: 1.2, cast: false }); }
  D.bloom(f, F([[0, 100]])[0], 18, RUST, { n: 2 }); f.scratches(F([[0, 0]])[0], 20, 5, '#d8d8d4');
  return { focus: F([[0, -100]])[0] };
};
O.hand = (f, o = {}) => { // a carved wooden votive hand, palm out, banded at the wrist in the six inks, a seal pressed in its palm
  const F = frame([0, 0], o.ang ?? -0.05, 1), r = f.r, wood = '#a8865e';
  P(f, F, [[-90, 260], [-100, 120], [100, 120], [90, 260]], wood, { tex: T(f, 'wood'), texOp: 0.7 });
  SIX.forEach((c, i) => f.part(F([[-98, 130 + i * 20], [98, 126 + i * 20], [98, 142 + i * 20], [-98, 146 + i * 20]]), { fill: mix(c, '#3a2a1a', 0.3), shade: 0.4, inkW: 1, cast: false }));
  D.slab(f, F([[-120, 120], [-140, 0], [-130, -80], [130, -80], [140, 0], [120, 120]]), [12, 8], mix(wood, '#000', 0.5));
  P(f, F, [[-120, 120], [-140, 0], [-130, -80], [130, -80], [140, 0], [120, 120]], wood, { tex: T(f, 'wood'), texOp: 0.7 });
  [[-110, -60, -0.12, 150], [-40, -80, -0.04, 200], [30, -80, 0.04, 210], [100, -60, 0.12, 170]].forEach(([x, y, a, l]) => { P(f, F, limb([x, y], add([x, y], rot([0, -l], a)), 50, 40, { capK: 0.9 }), wood, { tex: T(f, 'wood'), texOp: 0.6, dressO: { op: 0.35 } }); for (const t of [0.35, 0.68]) L(f, F, [add([x - 18, y], rot([0, -l * t], a)), add([x + 18, y], rot([0, -l * t], a))], 1.4, INK, { op: 0.7 }); });
  P(f, F, limb([-130, 40], [-230, -60], 50, 40, { capK: 0.9 }), wood, { tex: T(f, 'wood'), texOp: 0.6, dressO: { op: 0.35 } });
  const c = o.course && o.course !== 'physical' ? K.INK6[o.course] : '#7a1a12'; f.part(F(ell([0, 30], 44, 40, 0, 16)), { fill: c, shade: 0.45, inkW: 1.6, cast: false }); f.line(F(loop(ell([0, 30], 28, 26, 0, 14))), 1.4, mix(c, '#000', 0.4));
  L(f, F, [[-80, 90], [0, 70], [90, 92]], 1.6, INK, { op: 0.6 }); L(f, F, [[-70, -30], [-10, 0], [60, -20]], 1.6, INK, { op: 0.6 });
  D.crack(f, F([[60, 240]])[0], -1.6, 120, { n: 5 }); D.stain(f, F([[-60, -40]])[0], 30, '#3a2414', { op: 0.3 });
  return { focus: F([[0, 0]])[0] };
};
O.ring = (f, o = {}) => { // the Elementalist's copper sigil ring, six course stones set round it, worn and verdigrised
  const F = frame([0, 0], o.ang ?? 0, 1);
  f.line(F(loop(ell([0, 30], 190, 130, 0, 40))), 66, INK); f.line(F(loop(ell([0, 30], 190, 130, 0, 40))), 58, COPPER);
  f.line(F(ell([0, 30], 190, 130, 0, 40).slice(22, 34)), 20, mix(COPPER, '#fff', 0.25), { op: 0.7 }); f.line(F(ell([0, 30], 190, 130, 0, 40).slice(2, 14)), 36, mix(COPPER, '#1a0c04', 0.4), { op: 0.6 });
  SIX.forEach((c, i) => { const a = E.deg(200 + i * 28), p = [Math.cos(a) * 190, 30 + Math.sin(a) * 130]; f.part(F(ell(p, 22, 22, 0, 12)), { fill: mix(c, '#2a1a10', 0.2), shade: 0.4, inkW: 1.6 }); f.flat(F(ell(add(p, [-6, -6]), 5, 5, 0, 8)), '#ffffff', { op: 0.45 }); });
  for (const [x, y] of [[-160, 120], [120, 140], [0, 160]]) D.bloom(f, F([[x, y]])[0], 18, VERD, { n: 3 });
  for (let i = 0; i < 14; i++) { const a = E.deg(20 + i * 10); f.line(F([[Math.cos(a) * 176, 30 + Math.sin(a) * 120], [Math.cos(a) * 204, 30 + Math.sin(a) * 140]]), 1.2, INK, { op: 0.6 }); } // engraved script
  return { focus: F([[0, -100]])[0] };
};
O.brush = (f, o = {}) => { // a scribe's brush loaded with ink, a drop about to fall, the handle stained in six colours
  const F = frame([0, 0], o.ang ?? -0.6, 1), r = f.r, ink = o.course && o.course !== 'physical' ? mix(K.INK6[o.course], '#16110e', 0.5) : '#16121a';
  P(f, F, limb([-300, 0], [60, 0], 22, 30, { capK: 0.6 }), '#6a4a2a', { tex: T(f, 'wood'), texOp: 0.8 });
  SIX.forEach((c, i) => f.flat(F(ell([-220 + i * 44, (i % 2 ? 6 : -6)], 14, 7, 0.4, 8)), mix(c, '#2a1a10', 0.2), { op: 0.85 }));
  P(f, F, [[60, -18], [100, -20], [100, 20], [60, 18]], BRASS, { sharp: true, dressO: { op: 0.4 } });
  for (let i = 0; i < 3; i++) L(f, F, [[68 + i * 10, -18], [68 + i * 10, 18]], 1.4, INK, { op: 0.7 });
  P(f, F, [[100, -20], [180, -30], [270, -6], [300, 0], [270, 12], [180, 30], [100, 20]], ink, { tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.3, lt: '#8a8aa0' } });
  for (let i = 0; i < 8; i++) L(f, F, [[110 + i * 10, -16 + i * 3], [260 + r() * 30, -4 + i]], 1, '#3a3a4a', { op: 0.7 });
  f.flat(F([[296, -2], [308, 2], [306, 40], [298, 40]]), ink); f.flat(F(ell([302, 54], 9, 13, 0, 10)), ink); f.flat(F(ell([298, 48], 3, 4, 0, 6)), '#ffffff', { op: 0.5 });
  f.line(F(loop(ell([-300, 0], 12, 12, 0, 10))), 3, '#2a2420'); L(f, F, [[-310, 10], [-330, 60], [-316, 100]], 2, '#2a2420');
  f.spatter(F([[250, 80]])[0], 60, 14, ink);
  return { focus: F([[250, 0]])[0] };
};

// ==== denser versions of plain objects from objects2.js (same frame, more secondary details on top)
const O2 = require('./objects2').O;
O.bowl = (f, o = {}) => { // the bowl, with staples across an old crack, a notched rim, dribbles, steam, a burnt spoon; o.blood fills it with blood
  const r = f.r, F = frame([0, 0], o.ang || 0, 1);
  const p = O2.bowl(f, Object.assign({}, o, o.blood ? { course: 'physical' } : {}));
  if (o.blood) { f.flat(F(ell([0, 6], 184, 30, 0, 24)), '#4c0c08', { op: 0.95 }); f.flat(F(ell([-60, 0], 50, 6, 0, 12)), '#a83020', { op: 0.5 }); for (const x of [-150, 120, 170]) { L(f, F, [[x, 20], [x - 4, 70], [x, 104]], 5, '#4c0c08', { op: 0.9 }); } }
  for (const x of [-140, -110]) { P(f, F, [[x - 8, 56], [x + 8, 56], [x + 8, 96], [x - 8, 96]], IRON, { dress: false, sharp: true }); f.rivet(F([[x, 60]])[0], 2.6, '#6a6a66'); f.rivet(F([[x, 92]])[0], 2.6, '#6a6a66'); }
  for (let i = 0; i < 6; i++) L(f, F, [[-180 + i * 12, -6], [-178 + i * 12, 8]], 1.6, INK, { op: 0.7 }); // tally notches on the rim
  for (const x of [-60, 40, 140]) { f.flat(F([[x - 6, 40], [x + 6, 40], [x + 2, 90 + r() * 20], [x - 2, 90]]), '#2a1a0c', { op: 0.45 }); }
  D.bloom(f, F([[120, 90]])[0], 20, '#2a1a0c', { n: 3, op: 0.4 }); f.flat(F([[140, -210], [160, -230], [170, -214]]), '#1a0c06', { op: 0.8 });
  for (let i = 0; i < 4; i++) L(f, F, [[-80 + i * 40, -30], [-70 + i * 40, -80], [-84 + i * 40, -130]], 2.4, '#d8d4c8', { op: 0.45 });
  return p;
};
O.inkpot = (f, o = {}) => { // the inkpot, with its cork on a string, a stained rag, a chipped lip, spatter and a scratched mark
  const r = f.r, F = frame([0, 0], o.ang || 0, 1), p = O2.inkpot(f, o);
  P(f, F, [[-260, 160], [-170, 120], [-120, 150], [-150, 190], [-250, 196]], '#b8ac90', { tex: T(f, 'weave'), texOp: 0.7, dressO: { op: 0.3 } });
  for (const [x, y] of [[-200, 150], [-160, 170]]) f.flat(F(ell([x, y], 14, 8, 0.3, 10)), '#16121a', { op: 0.7 });
  L(f, F, [[54, -80], [110, -60], [150, -10]], 1.6, '#3a2a18'); P(f, F, [[140, -14], [176, -20], [180, 10], [146, 16]], '#8a6a44', { dress: false });
  D.chip(f, F([[40, -84]])[0], 8, Math.PI); D.chip(f, F([[-46, -82]])[0], 6, Math.PI);
  f.spatter(F([[60, 40]])[0], 80, 20, '#16121a'); L(f, F, [[-80, 20], [-50, 60], [-20, 20]], 2, INK, { op: 0.7 }); L(f, F, [[-50, 60], [-50, 100]], 2, INK, { op: 0.7 });
  D.label(f, F([[70, 80]])[0], 50, 36, 0.12, '#cdbb94', G2 => f.line(G2([[-16, 0], [14, -2]]), 1.2, INK, { op: 0.7 }));
  return p;
};
O.stinger = (f, o = {}) => { // the stinger, with barbs along its shaft, a torn wing scrap, plate rims, venom running from the point
  const r = f.r, F = frame([0, 0], o.ang ?? -0.6, 1), p = O2.stinger(f, o);
  for (let i = 0; i < 6; i++) { const x = 60 + i * 28, y = -32 + i * 4.6; f.part(F([[x, y], [x + 22, y - 18], [x + 14, y + 2]]), { fill: '#3a3428', shade: 0.4, inkW: 1, cast: false, sharp: true }); }
  for (const x of [-160, -100, -40]) L(f, F, [[x, -64], [x + 8, -40]], 2.4, '#c8c8a0', { op: 0.6 });
  P(f, F, [[-200, -60], [-260, -180], [-150, -230], [-90, -150], [-120, -70]], '#8a8a7a', { opacity: 0.6, tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.2 } });
  for (let i = 0; i < 5; i++) L(f, F, [[-190, -70], [-230 + i * 30, -200 + i * 8]], 1, INK, { op: 0.6 });
  L(f, F, [[-200, 0], [-60, 4], [120, 0], [230, 0]], 2, '#7d9a3a', { op: 0.6 });
  for (let i = 0; i < 4; i++) { const q = F([[270 + i * 6, 30 + i * 24]])[0]; f.flat(ell(q, 4, 6, 0, 8), '#7d9a3a'); }
  for (let i = 0; i < 14; i++) L(f, F, [[-200 + i * 26, 50], [-204 + i * 26, 64]], 1, '#3a3428', { op: 0.8 }); // bristles
  return p;
};
O.salt = (f, o = {}) => { // the salt sack, with a wooden scoop in it, a branded mark, a patch, a lead seal and the poured line
  const r = f.r, F = frame([0, 0], o.ang || 0, 1), p = O2.salt(f, o);
  P(f, F, limb([10, -150], [150, -300], 24, 20, { capK: 0.8 }), OAKL, { tex: T(f, 'wood'), texOp: 0.8, dress: false });
  f.part(F(ell([-10, -140], 40, 18, 0.5, 12)), { fill: OAKL, shade: 0.4, inkW: 1.3 });
  L(f, F, [[-50, 0], [30, 60]], 5, '#3a2414', { op: 0.8 }); L(f, F, [[30, 0], [-50, 60]], 5, '#3a2414', { op: 0.8 }); f.line(F(loop(ell([-10, 30], 54, 48, 0, 16))), 3, '#3a2414', { op: 0.7 });
  f.part(F([[60, 60], [120, 50], [126, 110], [66, 118]]), { fill: mix(SACK, '#5a4a30', 0.5), shade: 0.4, inkW: 1.2 }); f.stitches(F([[60, 60], [120, 50], [126, 110], [66, 118], [60, 60]]), '#d8cbb0', 1);
  L(f, F, [[80, -116], [100, -60], [96, -30]], 1.6, '#3a2a18'); f.part(F(ell([96, -20], 12, 11, 0, 10)), { fill: '#6e7072', shade: 0.4, inkW: 1.1 });
  for (let i = 0; i < 20; i++) f.flat(F(ell([-130 + r() * 260, 150 + r() * 30], 1.4, 1.2, 0, 6)), '#f4f0e4', { op: 0.9 });
  return p;
};

module.exports = { O };
