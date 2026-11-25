// Hero path variants, batch A: Bulwark, Duelist, Elementalist (three paths each).
// Each builder is a copy of the accepted base in dirAC.js (same body, face, scale, stance family, bones, badge and
// rubric strip) with only what the path lists changed (bible/01_company.md "Paths:"). Seeds 7100-7108.
'use strict';
const { E, B, G, INK, base } = require('../kit');
const { split, side } = require('../dirAC');
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;

// ------------------------------------------------------------------ shared path helpers
// points every `step` px along a polyline, with the unit tangent and normal there
function along(pts, step) {
  const res = [];
  for (let s = 0; s < pts.length - 1; s++) {
    const a = pts[s], b = pts[s + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), n = [-d[1], d[0]];
    for (let u = s ? 0 : 0; u < L; u += step) res.push({ p: add(a, mul(d, u)), d, n });
  }
  return res;
}
// twisted rope: dark body, lighter strand, diagonal lay ticks
function rope(f, pts, w, col = '#8f7a52', o = {}) {
  f.line(pts, w + 2, INK, { straight: o.straight });
  f.line(pts, w, col, { straight: o.straight });
  f.line(pts.map(p => add(p, [-0.6, -w * 0.22])), Math.max(0.8, w * 0.3), mix(col, '#fff', 0.35), { straight: o.straight, op: 0.7 });
  for (const q of along(pts, w * 0.9)) f.line([add(q.p, mul(q.n, w * 0.5)), add(add(q.p, mul(q.n, -w * 0.5)), mul(q.d, w * 0.55))], 0.9, mix(col, '#000', 0.6), { straight: true, op: 0.8 });
}
// a frayed rope end hanging plumb from p
function ropeEnd(f, p, len, w, col = '#8f7a52', sway = 3) {
  const pts = [p, add(p, [sway, len * 0.5]), add(p, [sway * 0.4, len])];
  rope(f, pts, w, col);
  for (let k = -1; k <= 1; k++) f.line([pts[2], add(pts[2], [k * 2.5, 7])], 0.9, col, { op: 0.9 });
}
// icicle hanging plumb from p: faceted, lit facet, dark facet
function icicle(f, p, len, w) {
  const tip = add(p, [0.5, len]);
  f.part([[...add(p, [-w / 2, 0]), 1], add(lerp(p, tip, 0.45), [-w * 0.28, 0]), [...tip, 1], add(lerp(p, tip, 0.4), [w * 0.3, 0]), [...add(p, [w / 2, 0]), 1]], { fill: '#c6d6de', shadow: '#7f97a6', light: '#f4f8fa', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, gritOp: 0.2, k: 0.7 });
  f.line([add(p, [w * 0.12, 1]), add(lerp(p, tip, 0.7), [w * 0.04, 0])], Math.max(0.8, w * 0.18), '#ffffff', { op: 0.8, straight: true });
}
function icicles(f, edge, n, l0, l1) {
  const C = along(edge, 2), m = C.length;
  for (let i = 0; i < n; i++) { const q = C[Math.min(m - 1, Math.floor((i + 0.3 + f.r() * 0.4) / n * m))].p, l = l0 + (l1 - l0) * f.r() * (i % 3 === 1 ? 1.25 : 1); icicle(f, add(q, [0, -2]), l, Math.max(3, l * 0.24)); }
}
// rime crust: a lumpy pale band along a polyline, feathers growing into the wind (dir)
function rime(f, pts, w, dir = [1, -0.15]) {
  // feathered accretion: lumpy pale growths set just inside the edge (pts), biggest on the windward edge and thinning
  // inward; each lump has a blue-grey shadow under it and ink only on its shadow side; short feathers grow into the wind
  const wd = E.norm(dir), inw = mul(wd, -1), C = along(pts, Math.max(4, w * 0.75)), lumps = [];
  const ph = f.r() * 6;
  C.forEach((q, i) => {
    // growths come in clumps where the wind piles them, with bare metal or wood between: never an even band
    const m = 0.5 + 0.5 * Math.sin(i * 0.62 + ph) * Math.sin(i * 0.23 + ph * 0.5);
    if (m < 0.28 && f.r() < 0.8) return;
    const rA = w * (0.3 + m * 0.42 + f.r() * 0.12);
    lumps.push({ c: add(add(q.p, mul(inw, rA * 0.9 + 1.5)), mul(q.d, (f.r() - 0.5) * 2)), rx: rA * (1 + f.r() * 0.3), ry: rA * (0.7 + f.r() * 0.25), a: Math.atan2(q.d[1], q.d[0]), edge: true });
    if (f.r() < 0.35 + m * 0.5) { const rB = w * (0.16 + m * 0.18 + f.r() * 0.1); lumps.push({ c: add(q.p, mul(inw, rA * 1.8 + rB + 2)), rx: rB * 1.2, ry: rB * 0.8, a: Math.atan2(q.d[1], q.d[0]) + (f.r() - 0.5), edge: false }); }
  });
  const shape = L => ell(L.c, L.rx, L.ry, L.a, 10).map((p, k) => add(p, [(f.r() - 0.5) * L.ry * 0.25, (f.r() - 0.5) * L.ry * 0.25]));
  for (const L of lumps) L.pts = shape(L);
  for (const L of lumps) f.flat(L.pts.map(p => add(p, [1.4, 1.8])), '#7f96a6', { op: 0.85 });
  for (const L of lumps) f.flat(L.pts, L.edge ? '#e2eaee' : '#cfdbe1');
  for (const L of lumps) {
    // ink on the shadow (lower right) side only
    const sh = L.pts.map((p, k) => ({ p, d: E.norm(sub(p, L.c)) })).filter(o => o.d[0] * 0.6 + o.d[1] * 0.8 > 0.25).map(o => o.p);
    if (sh.length > 1) f.line(sh, 0.9, INK, { op: 0.6 });
    f.flat(ell(add(L.c, [-L.rx * 0.3, -L.ry * 0.35]), L.rx * 0.28, L.ry * 0.22, 0, 6), '#ffffff', { op: 0.9 });
  }
  for (const L of lumps) if (L.edge && f.r() < 0.6) { const b = add(L.c, mul(wd, L.ry * 0.5)), l = 1.5 + f.r() * 2; f.line([b, add(b, mul(wd, l))], 0.9, '#f4f8fa', { op: 0.8, straight: true }); }
}
// hoarfrost dusting: tiny pale flecks over an area (inside the silhouette)
function frostDust(f, c, rx, ry, n) { n = Math.round(n * 0.3); for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * 2 * rx, (f.r() - 0.5) * 2 * ry]); f.flat(ell(p, 0.9 + f.r() * 1.3, 0.7 + f.r(), f.r() * 3, 5), '#c8d4da', { op: 0.55 }); } }
// welded iron barb: a hooked thorn rooted at p, pointing along dir, with a bright weld bead at its root
function barb(f, p, dir, len, w, col = '#3c3a38') {
  len *= 1.4; w *= 1.25;
  const d = E.norm(dir), n = [-d[1], d[0]], tip = add(add(p, mul(d, len)), mul(n, len * 0.22));
  f.part([[...add(p, mul(n, w / 2)), 1], add(add(p, mul(d, len * 0.55)), mul(n, w * 0.32)), [...tip, 1], add(add(p, mul(d, len * 0.5)), mul(n, -w * 0.12)), [...add(p, mul(n, -w / 2)), 1]], { fill: col, shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false, k: 0.8 });
  f.line([add(p, mul(n, w * 0.3)), add(add(p, mul(d, len * 0.6)), mul(n, w * 0.25))], 0.9, '#a8a6a0', { op: 0.7 });
  f.line([add(p, mul(n, w * 0.62)), add(p, mul(n, -w * 0.62))], 2.4, '#8a6a4a', { op: 0.8, straight: true }); // weld bead, heat-blued
  f.line([add(p, mul(n, w * 0.55)), add(p, mul(n, -w * 0.55))], 0.9, '#c8c0b0', { op: 0.7, straight: true });
}
// hammered lead patch: soft irregular sheet with heavy rivets
function leadPatch(f, c, rx, ry, a, seed) {
  // a cut sheet, not a disc: four hammered corners, one dog-eared, edges dented in
  const F = frame(c, a, 1), j = () => (f.r() - 0.5) * 0.18;
  const pts = F([[-rx, -ry * (0.8 + j())], [-rx * 0.1, -ry * (1 + j()), 1], [rx * (0.95 + j()), -ry * 0.9, 1], [rx * (1 + j()), ry * 0.1], [rx * 0.8, ry, 1], [-rx * 0.2, ry * (0.9 + j())], [-rx * (1 + j()), ry * 0.85, 1], [-rx * 0.92, 0]]);
  f.part(pts, { fill: '#5f6163', shade: 0.35, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.6, k: 0.5, cast: false });
  f.flat(F([[rx * 0.95, -ry * 0.9], [rx * 0.55, -ry * 0.95], [rx * 0.9, -ry * 0.45]]), '#8a8c8e', { op: 0.7 }); // turned-up corner
  f.line(F([[-rx * 0.7, -ry * 0.3], [-rx * 0.1, -ry * 0.1], [rx * 0.4, ry * 0.3]]), 0.9, '#3a3c3e', { op: 0.6 });
  for (const q of [[-0.75, -0.6], [0.7, -0.55], [0.65, 0.65], [-0.7, 0.6]]) f.rivet(F([[q[0] * rx, q[1] * ry]])[0], 2.3, '#8c8e90');
}

// ------------------------------------------------------------------ BULWARK (base: dirAC.js bulwark)
// path: 'last_bastion' | 'ironwarden' | 'thornguard'
function bulwark(path, seed) {
  const f = new Fig(base(seed));
  const T = t => t + seed;
  const LB = path === 'last_bastion', IW = path === 'ironwarden', TG = path === 'thornguard';
  const H = 100;
  const steel = TG ? '#6d7177' : IW ? '#7d858e' : '#7b8189', steelD = TG ? '#4f5358' : IW ? '#5d646c' : '#5c6168';
  const gamb = '#6e5c43', oak = IW ? '#8a7656' : '#5b412a', leather = '#46301f', mail = '#5d6064', red = '#8e1f17';
  const barbC = '#4a4642';
  const N = [306, 248], C = [270, 338], P = [270, 470];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.42, 0.13), SF = S.at(0.5, 0.1);
  const HN = S.at(-0.25, 1.0), HF = S.at(0.3, 0.98);
  const KF = [368, 604], AF = [376, 734], KN = [208, 612], AN = [146, 742];
  const EN = [252, 418], WN = [336, 408];
  const EF = [402, 372], WF = [430, 420];

  // skeleton: identical to the base
  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.25, -0.08), 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('mace', WN, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('door', [470, 420], 'hand_f').joint('bedroll', S.at(-0.75, -0.12), 'torso');

  f.bone('upperarm_f');
  f.part(limb(SF, EF, 44, 36, { q: [[0.4, 0.15, 0.2]] }), { fill: gamb, tex: T('quilt') });
  f.part(plate(SF, EF, 0.15, 0.75, 46, 40), { fill: steelD });
  if (TG) for (let i = 0; i < 3; i++) barb(f, lp(SF, EF, 0.25 + i * 0.22, 20), E.norm(add([-(EF[1] - SF[1]), EF[0] - SF[0]], [0, 0])), 12, 7, barbC);

  // far leg
  f.bone('thigh_f');
  f.part(limb(HF, KF, 62, 44, { q: [[0.35, 0.18, 0.2]] }), { fill: gamb, tex: T('quilt') });
  f.bone('shin_f');
  f.part(limb(KF, AF, 42, 30, { p: [[0.3, 0.2, 0.18]] }), { fill: gamb });
  f.part(plate(KF, AF, 0.05, 0.95, 44, 34, { bow: 3 }), { fill: steelD });
  if (IW) rime(f, [lp(KF, AF, 0.15, -15), lp(KF, AF, 0.5, -14), lp(KF, AF, 0.85, -12)], 9);
  G.poleyn(f, KF, 0.15, 30, steel, steelD);
  if (IW) { rime(f, [add(KF, [-6, -28]), add(KF, [8, -24]), add(KF, [16, -14])], 8); icicles(f, [add(KF, [-12, 30]), add(KF, [16, 28])], 3, 8, 16); }
  if (LB) leadPatch(f, lerp(KF, AF, 0.45), 13, 18, 0.1, seed);
  f.bone('foot_f');
  B.boot(f, AF, 1, 54, '#5d6268', { tex: T('mottle'), shaft: 0.2, style: 'sabaton', toe: 1.2 });
  if (IW) rime(f, [add(AF, [18, 18]), add(AF, [42, 32]), add(AF, [58, 44])], 7);

  // near leg
  f.bone('thigh_n');
  f.part(limb(HN, KN, 66, 46, { p: [[0.4, 0.15, 0.25]] }), { fill: gamb, tex: T('quilt') });
  f.part(plate(HN, KN, 0.55, 0.95, 52, 44, { bow: 4 }), { fill: steel });
  f.bone('shin_n');
  f.part(limb(KN, AN, 44, 30, { q: [[0.3, 0.25, 0.18]] }), { fill: gamb });
  f.part(plate(KN, AN, 0.06, 0.92, 46, 33, { bow: 3 }), { fill: steel });
  if (LB) leadPatch(f, lerp(KN, AN, 0.55), 14, 20, -0.4, seed);
  G.poleyn(f, KN, -0.35, 31, steel, steelD);
  f.scratches(lerp(KN, AN, 0.5), 14, 5);
  if (IW) { rime(f, [lp(KN, AN, 0.1, -16), lp(KN, AN, 0.5, -14), lp(KN, AN, 0.85, -11)], 9); icicles(f, [add(KN, [-14, 30]), add(KN, [14, 32])], 3, 8, 15); }
  f.bone('foot_n');
  B.boot(f, AN, 1, 54, '#666b72', { tex: T('mottle'), shaft: 0.2, style: 'sabaton', toe: 1.2 });

  // bedroll
  f.bone('bedroll');
  f.part(limb(S.at(-0.95, -0.02), S.at(-0.55, -0.22), 46, 46, { steps: 6, capK: 0.5 }), { fill: '#6b5a3e', tex: T('weave'), texOp: 0.5 });
  f.part(ell(S.at(-0.55, -0.22), 14, 23, -0.5, 12), { fill: '#7a684a', shade: 0.3 });
  f.line(ell(S.at(-0.55, -0.22), 7, 12, -0.5, 10), 1, INK, { op: 0.6 });
  for (const tt of [0.3, 0.72]) f.line([lp(S.at(-0.95, -0.02), S.at(-0.55, -0.22), tt, -24), lp(S.at(-0.95, -0.02), S.at(-0.55, -0.22), tt, 24)], 4, '#2b1c12', { straight: true });
  if (IW) rime(f, [S.at(-0.92, -0.28), S.at(-0.75, -0.33), S.at(-0.52, -0.35)], 8, [0.3, -1]);

  // gambeson torso
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.3], [0.05, 0.78, 0.55], [0.18, 0.92, 0.8], [0.4, 0.86, 0.86], [0.62, 0.74, 0.8], [0.85, 0.78, 0.76], [1.02, 0.8, 0.68], [1.1, 0.62, 0.5]]);
  f.part(torso, { fill: gamb, tex: T('quilt'), texOp: 0.6 });
  if (TG) {
    // hair shirt: coarse goat-hair cloth worn against the skin, its collar standing out of the gambeson at the throat
    const hs = [S.at(0.1, -0.04), S.at(0.5, 0.0), S.at(0.78, 0.1), S.at(0.8, 0.22), S.at(0.55, 0.24), S.at(0.25, 0.18), S.at(0.05, 0.12)];
    f.part(hs.map((q, i) => i % 2 ? add(q, [0, 3]) : q), { fill: '#3d3127', tex: T('mottle'), texOp: 0.7, shade: 0.45, k: 0.5 });
    for (let i = 0; i < 26; i++) { const t = i / 25, q = lerp(S.at(0.15 + t * 0.6, 0.0 + t * 0.08), S.at(0.15 + t * 0.6, 0.2 + t * 0.02), f.r()); const a = -1.2 + f.r() * 2.2; f.line([q, add(q, rot([5 + f.r() * 4, 0], a))], 0.9, i % 3 ? '#1a140f' : '#7a6a58', { straight: true, op: 0.85 }); }
    for (let i = 0; i < 9; i++) { const q = lerp(S.at(0.3, 0.21), S.at(0.8, 0.23), i / 8); f.line([q, add(q, [(f.r() - 0.5) * 4, 5 + f.r() * 4])], 1, '#2a2018', { straight: true }); } // frayed hem bristles
  }

  // mail skirt
  f.bone('pelvis');
  const sk = [S.at(-0.82, 0.8), S.at(0.8, 0.8), add(S.at(0.85, 1.0), [10, 30]), [395, 560], [372, 586, 1], [330, 556], [300, 590, 1], [262, 560], [225, 590, 1], [200, 556], add(S.at(-0.85, 1.0), [-8, 26])];
  f.part(sk, { fill: mail, tex: T('mail'), texOp: 0.8 });
  f.line([[332, 556], [300, 590], [262, 560], [225, 590]], 1.2, '#2a2a2a', { op: 0.6 });
  if (IW) { icicles(f, [[262, 562], [300, 590], [330, 558], [372, 586]], 5, 8, 18); frostDust(f, [350, 520], 30, 30, 26); }
  if (LB) { f.flat([[300, 486], [310, 484], [314, 540], [306, 578], [300, 576], [304, 530]], '#4a0c08', { op: 0.7 }); f.spatter([290, 540], 30, 16); } // his own blood running from under the faulds

  f.bone('torso');
  const bp = S.shape([[0.12, 0.7, 0.62], [0.3, 0.8, 0.9], [0.5, 0.74, 0.88], [0.64, 0.7, 0.78]]);
  f.part(bp, { fill: steel, shade: 0.45, k: 0.7 });
  f.line([S.at(0.55, 0.14), S.at(0.62, 0.35), S.at(0.55, 0.6)], 1.6, INK, { op: 0.6 });
  f.flat(ell(S.at(0.2, 0.38), 14, 9, -0.4), '#2b2e33', { op: 0.5 });
  f.line([S.at(0.05, 0.33), S.at(0.3, 0.42)], 1.2, '#e6e2d8', { op: 0.7 });
  f.part([S.at(-0.45, 0.42), S.at(-0.1, 0.4), S.at(-0.05, 0.56), S.at(-0.48, 0.58)], { fill: '#6d6f70', shade: 0.3, inkW: 1.2 });
  for (const q of [[-0.42, 0.44], [-0.1, 0.43], [-0.08, 0.54], [-0.45, 0.55]]) f.rivet(S.at(q[0], q[1]), 2.4, '#999');
  f.scratches(S.at(0.3, 0.3), 30, 8);
  if (LB) {
    // a hole punched through the breastplate, sheeted over with lead; a split along the medial ridge stitched with wire
    leadPatch(f, S.at(0.35, 0.3), 20, 15, 0.3, seed);
    leadPatch(f, S.at(0.0, 0.2), 13, 10, -0.2, seed);
    f.line([S.at(0.55, 0.42), S.at(0.62, 0.5), S.at(0.56, 0.6)], 2.6, '#151517');
    for (let i = 0; i < 4; i++) { const q = lerp(S.at(0.55, 0.44), S.at(0.57, 0.6), i / 3); f.line([add(q, [-5, -2]), add(q, [5, 2])], 1.2, '#9a9a96', { straight: true }); }
    f.spatter(S.at(0.4, 0.5), 26, 14);
  }
  if (TG) {
    // the hair shirt's frayed collar standing up out of the gambeson and over the breastplate's neck edge
    const hs = [S.at(0.12, -0.02), S.at(0.4, 0.0), S.at(0.66, 0.06), S.at(0.78, 0.14), S.at(0.74, 0.2), S.at(0.5, 0.17), S.at(0.25, 0.14), S.at(0.1, 0.1)];
    f.part(hs, { fill: '#5e4c3a', tex: T('mottle'), texOp: 0.7, shade: 0.4, k: 0.6, shadow: '#2a2018' });
    for (let i = 0; i < 40; i++) { const t = f.r(), q = lerp(S.at(0.14 + t * 0.6, 0.0 + t * 0.06), S.at(0.12 + t * 0.6, 0.15 + t * 0.04), f.r()); const a = -1.4 + f.r() * 2.6; f.line([q, add(q, rot([4 + f.r() * 4, 0], a))], 0.9, i % 3 ? '#1e1610' : '#a8957a', { straight: true, op: 0.85 }); }
    for (let i = 0; i < 12; i++) { const q = lerp(S.at(0.2, 0.15), S.at(0.76, 0.2), i / 11); f.line([q, add(q, [(f.r() - 0.5) * 5, 5 + f.r() * 5])], 1.1, i % 2 ? '#2a2018' : '#7a6650', { straight: true }); }
  }
  if (TG) {
    // scratched penitential lines: rows of short strokes gouged into the plate, like a tally of sins
    for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { const q = S.at(0.0 + i * 0.09, 0.26 + r * 0.075); f.line([q, add(q, [2, 7])], 1, '#d8d4c8', { straight: true, op: 0.6 }); }
  }
  if (IW) { rime(f, [S.at(0.58, 0.2), S.at(0.72, 0.34), S.at(0.76, 0.55)], 9); frostDust(f, S.at(0.55, 0.4), 22, 34, 28); }
  // faulds
  for (let i = 0; i < 3; i++) {
    const v0 = 0.64 + i * 0.075;
    f.part([S.at(-0.72 - i * 0.03, v0), S.at(0.8 + i * 0.03, v0 - 0.01), S.at(0.82 + i * 0.03, v0 + 0.1), S.at(-0.75 - i * 0.03, v0 + 0.1)], { fill: i % 2 ? steelD : steel, shade: 0.5, inkW: 1.4, sharp: true });
    f.rivet(S.at(0.6, v0 + 0.05), 2.4); f.rivet(S.at(-0.5, v0 + 0.05), 2.4);
  }
  if (IW) icicles(f, [S.at(0.2, 0.86), S.at(0.85, 0.85)], 3, 7, 13);
  // belt, pouch, badge
  f.part([S.at(-0.82, 0.86), S.at(0.82, 0.85), S.at(0.83, 0.93), S.at(-0.84, 0.95)], { fill: leather, shade: 0.4 });
  f.part([S.at(0.3, 0.85), S.at(0.48, 0.85), S.at(0.48, 0.95), S.at(0.3, 0.95)], { fill: '#8c7a52', shade: 0.4, inkW: 1.2 });
  f.part([S.at(-0.7, 0.9), S.at(-0.4, 0.91), S.at(-0.38, 1.1), S.at(-0.68, 1.11)], { fill: '#563a24', shade: 0.4, tex: T('mottle'), sharp: true });
  f.part([S.at(-0.72, 0.89), S.at(-0.38, 0.9), S.at(-0.4, 0.99), S.at(-0.55, 1.01), S.at(-0.7, 0.98)], { fill: '#4a301c', shade: 0.4, inkW: 1.2 });
  f.rivet(S.at(-0.55, 0.98), 2.2, '#a08a5a');
  f.line([S.at(0.05, 0.93), S.at(0.1, 1.02), S.at(0.06, 1.08)], 1.2, '#2b2119');
  G.badge(f, S.at(0.06, 1.08), 11, '#74777b', 0.08);
  if (TG) {
    // flagellant's cord: a short wooden handle thrust through the belt, five knotted cords hanging plumb, dark with old blood
    const h0 = S.at(0.58, 0.82), h1 = S.at(0.7, 1.02);
    f.part(limb(h0, h1, 9, 8, { steps: 4 }), { fill: '#4a3424', tex: T('wood'), shade: 0.4, inkW: 1.2, cast: false });
    for (let k = 0; k < 3; k++) f.line([lp(h0, h1, 0.55 + k * 0.12, -5), lp(h0, h1, 0.58 + k * 0.12, 5)], 1.2, '#1c120a', { straight: true });
    for (let i = 0; i < 5; i++) {
      const top = add(h1, [-6 + i * 3, 2]), len = 70 + (i % 2) * 14 + i * 3, sw = (i - 2) * 3;
      const pts = [top, add(top, [sw * 0.4, len * 0.35]), add(top, [sw * 0.9, len * 0.7]), add(top, [sw, len])];
      f.line(pts, 3.4, INK); f.line(pts, 2, i % 2 ? '#5a4632' : '#4a3a2a');
      for (const t of [0.35, 0.7, 1.0]) { const q = add(top, [sw * t, len * t]); f.part(ell(q, 3.4, 3, 0, 8), { fill: '#3a2a1c', inkW: 1, inkHeavy: 1.2, cast: false, shade: 0.4 }); }
      f.flat(ell(add(top, [sw, len + 4]), 1.6, 2.4, 0, 6), '#4a0c08', { op: 0.8 });
    }
    f.part(ell(h1, 7, 6, 0, 10), { fill: '#3a2a1c', inkW: 1.1, cast: false, shade: 0.4 }); // the binding knot
    f.spatter(add(h1, [0, 40]), 16, 8);
  }

  if (IW) {
    // fur mantle over the shoulders and back: wolf pelt, clumped and matted, rimed on the top
    const fur = '#6a5d4c', furD = '#4a4036';
    const mt = [S.at(-0.55, -0.22), S.at(-0.1, -0.2), S.at(0.35, -0.1), S.at(0.7, 0.05), S.at(0.78, 0.18), S.at(0.62, 0.26), S.at(0.52, 0.22), S.at(0.4, 0.3), S.at(0.2, 0.26), S.at(-0.1, 0.34), S.at(-0.4, 0.4), S.at(-0.62, 0.5), S.at(-0.8, 0.58), S.at(-0.92, 0.5), S.at(-1.0, 0.55), S.at(-1.04, 0.38), S.at(-1.0, 0.15), S.at(-0.85, -0.08)];
    f.part(mt.map((q, i) => i > 4 && i < 16 && i % 2 ? [...q, 1] : q), { fill: fur, shade: 0.45, tex: T('hatch'), texOp: 0.25, shadow: '#2e2822' });
    for (let i = 0; i < 34; i++) { const u = -0.95 + (i % 17) * 0.1, v = 0.0 + Math.floor(i / 17) * 0.2 + f.r() * 0.15 + Math.max(0, -u) * 0.25; const q = S.at(u, v), l = 10 + f.r() * 10; f.stroke([q, add(q, [-2 + f.r() * 3, l * 0.5]), add(q, [-4 + f.r() * 3, l])], 3.2, i % 3 ? furD : '#8a7c68'); }
    for (let i = 0; i < 8; i++) { const q = S.at(-0.92 + i * 0.22, 0.42 + (i % 2) * 0.05 - i * 0.04); f.stroke([add(q, [0, -6]), add(q, [-2, 6]), add(q, [-1, 14])], 3, '#3a322a'); }
    rime(f, [S.at(-0.7, -0.2), S.at(-0.2, -0.2), S.at(0.3, -0.1), S.at(0.62, 0.04)], 10, [0.3, -1]);
    frostDust(f, S.at(-0.2, 0.0), 40, 14, 30);
    f.line([S.at(0.45, 0.06), S.at(0.6, 0.18)], 2.4, '#4a3a2a'); // thong closing it at the throat
    f.part(ell(S.at(0.55, 0.14), 5, 5, 0, 8), { fill: '#6a6a66', inkW: 1, cast: false, shade: 0.4 }); // iron cloak pin
  }
  // aventail
  f.bone('head');
  const HC = [328, 198];
  if (TG) f.part([add(HC, [-46, 30]), add(HC, [30, 32]), S.at(0.35, 0.02), S.at(0.15, 0.12), S.at(-0.2, 0.22), S.at(-0.72, 0.12)], { fill: mail, tex: T('mail'), texOp: 0.85 }); // the throat left open on the hair shirt
  else f.part([add(HC, [-46, 30]), add(HC, [40, 32]), S.at(0.7, 0.12), S.at(0.45, 0.2), S.at(-0.2, 0.22), S.at(-0.72, 0.12)], { fill: mail, tex: T('mail'), texOp: 0.85 });
  const hF = frame(HC, 0.1, 112);
  if (LB) {
    // bandage wound round the head under the helm: a linen band shows under the rim, two blood-browned tails hang plumb at the back
    const lin = '#cbbf9f';
    f.part(hF([[-0.47, 0.36], [0.4, 0.42], [0.43, 0.7], [0.2, 0.74], [-0.2, 0.7], [-0.46, 0.66]]), { fill: lin, tex: T('weave'), texOp: 0.6, shade: 0.4, inkW: 1.2, cast: false });
    f.flat(hF(ell([0.12, 0.62], 0.14, 0.06, 0.1, 10)), '#6a1a12', { op: 0.6 });
    for (const x of [-0.3, -0.05, 0.2]) f.line(hF([[x, 0.56], [x + 0.08, 0.7]]), 0.9, '#8a7a5a', { op: 0.7 });
    // the wrapping's knot pushed out from under the helm's lower rim, two short tails hanging plumb from it, frayed and bloodied
    const kq = hF([[-0.12, 0.62]])[0];
    f.part([add(kq, [16, -2]), add(kq, [4, 4]), add(kq, [-2, 16]), add(kq, [-6, 30]), add(kq, [1, 32]), add(kq, [6, 18]), add(kq, [18, 6])], { fill: lin, tex: T('weave'), texOp: 0.5, shade: 0.45, inkW: 1.2 });
    f.part([add(kq, [18, 2]), add(kq, [17, 16]), add(kq, [21, 28]), add(kq, [28, 26]), add(kq, [26, 14]), add(kq, [24, 2])], { fill: mix(lin, '#000', 0.1), tex: T('weave'), texOp: 0.5, shade: 0.45, inkW: 1.2 });
    f.part(ell(add(kq, [14, 0]), 9, 7, 0.2, 10), { fill: lin, shade: 0.4, inkW: 1.2, cast: false, tex: T('weave'), texOp: 0.5 });
    f.flat([add(kq, [-2, 20]), add(kq, [2, 19]), add(kq, [0, 30]), add(kq, [-5, 29])], '#6a1a12', { op: 0.6 });
    for (const e of [add(kq, [-3, 31]), add(kq, [24, 27])]) for (let k = -1; k <= 1; k++) f.line([e, add(e, [k * 2, 5])], 0.8, '#a89878', { op: 0.9 });
    // blood run from under the wrapping down the mail and the breastplate
    { const b0 = hF([[0.16, 0.72]])[0]; f.stroke([b0, add(b0, [3, 18]), add(b0, [1, 34]), add(b0, [5, 52])], 4, '#4e0c08', { op: 0.8 }); f.stroke([add(b0, [8, 2]), add(b0, [10, 14]), add(b0, [9, 26])], 3, '#4e0c08', { op: 0.7 }); f.flat(ell(add(b0, [5, 56]), 2, 3, 0, 6), '#4e0c08'); }
  }

  if (IW) {
    // a grey beard spilling from under the helm over the aventail, frozen into clumps, rime on the tips
    const bc = '#aaa69e', bq = u => hF([[u, 0.5]])[0];
    // clumps frozen stiff where the breath froze them: tip points alternate with notches, the longest under the chin
    const clumps = [[0.44, 14, 4], [0.38, 34, 2], [0.32, 26, -1], [0.26, 50, -4], [0.2, 32, -3], [0.14, 44, -6], [0.08, 24, -5], [0.0, 14, -6]];
    const bd = [bq(-0.04), bq(0.46)];
    clumps.forEach(([u, l, dx], k) => { bd.push([...add(bq(u), [dx, l]), 1]); if (k < clumps.length - 1) bd.push(add(bq(u - 0.03), [dx * 0.7, l * 0.45])); });
    f.part(bd, { fill: bc, shade: 0.45, tex: T('hatch'), texOp: 0.3, k: 0.7, shadow: '#4a4a4c' });
    for (const [u, l, dx] of clumps) { const q = bq(u); f.line([add(q, [0, 4]), add(q, [dx * 0.5, l * 0.5]), add(q, [dx * 0.9, l * 0.92])], 1.1, '#3a3632', { op: 0.75 }); f.line([add(q, [2, 6]), add(q, [dx * 0.5 + 2, l * 0.5])], 1, '#d8dcdc', { op: 0.6 }); }
    frostDust(f, add(hF([[0.25, 0.5]])[0], [0, 24]), 16, 18, 22);
    for (const [x, y, l] of [[[0.3, 0.5], 50, 12], [[0.14, 0.5], 46, 9], [[0.42, 0.5], 36, 8]]) { const q = hF([x])[0]; icicle(f, add(q, [-3, y - 2]), l, 3.2); }
    }
  // great helm
  f.part(hF([[-0.42, -0.5], [-0.1, -0.6, 1], [0.3, -0.6, 1], [0.44, -0.38], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [-0.3, 0.53], [-0.45, 0.38, 1], [-0.47, -0.1]]), { fill: steel, shade: 0.5 });
  f.part(hF([[0.2, -0.6, 1], [0.3, -0.6, 1], [0.44, -0.38], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [0.22, 0.53, 1], [0.24, 0.1]]), { fill: steelD, shade: 0.4, inkW: 1.2 });
  f.part(hF([[-0.43, -0.31], [0.44, -0.33], [0.46, -0.22], [-0.46, -0.2]]), { fill: steelD, shade: 0.4, inkW: 1.2, sharp: true });
  for (let i = 0; i < 6; i++) if (!(LB && i === 2)) f.rivet(hF([[-0.38 + i * 0.16, -0.255]])[0], 2.6);
  f.flat(hF([[-0.02, -0.17], [0.21, -0.17], [0.21, -0.07], [-0.02, -0.08]]), '#050404');
  f.flat(hF([[0.27, -0.17], [0.46, -0.17], [0.46, -0.08], [0.27, -0.08]]), '#050404');
  f.flat(hF(ell([0.12, -0.12], 0.025, 0.018, 0, 8)), '#f2c46e');
  f.part(hF([[0.21, -0.36], [0.27, -0.36], [0.28, 0.5], [0.22, 0.5]]), { fill: '#8a9099', shade: 0.4, inkW: 1 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) f.flat(hF(ell([0.31 + c * 0.05, 0.1 + r * 0.08], 0.012, 0.016, 0, 6)), '#050404');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) f.flat(hF(ell([0.05 + c * 0.07, 0.12 + r * 0.08], 0.013, 0.018, 0, 6)), '#050404');
  f.flat(hF([[-0.18, -0.02], [0.4, 0.3], [0.38, 0.33], [-0.19, 0.01]]), '#1b1c1f');
  f.line(hF([[-0.18, -0.03], [0.41, 0.28]]), 1.2, '#e8e8e8', { op: 0.8 });
  f.scratches(hF([[-0.2, 0.25]])[0], 22, 6);
  f.spatter(hF([[0.35, 0.35]])[0], 20, 14);
  for (let i = 0; i < 5; i++) f.rivet(hF([[-0.35 + i * 0.17, 0.46]])[0], 2.3);
  if (LB) {
    // a second gash, a caved-in crown and a lead plug over a hole in the skull plate
    f.flat(hF([[-0.38, -0.44], [0.05, -0.36], [0.04, -0.33], [-0.39, -0.41]]), '#1b1c1f');
    f.line(hF([[-0.38, -0.45], [0.05, -0.37]]), 1.1, '#e8e8e8', { op: 0.7 });
    f.flat(hF([[-0.1, -0.6], [0.12, -0.6], [0.06, -0.5], [-0.06, -0.5]]), '#2b2e33', { op: 0.6 });
    f.line(hF([[-0.12, -0.6], [0.0, -0.52], [0.14, -0.6]]), 1.6, INK);
    leadPatch(f, hF([[-0.25, 0.14]])[0], 14, 8, 0.1, seed);
    f.spatter(hF([[0.1, 0.4]])[0], 18, 10);
  }
  if (IW) {
    rime(f, hF([[0.26, -0.56], [0.4, -0.4], [0.43, -0.24]]), 9);
    rime(f, hF([[0.46, -0.04], [0.47, 0.2], [0.44, 0.42]]), 8);
    rime(f, hF([[-0.38, -0.54], [-0.1, -0.58], [0.2, -0.58]]), 8, [0.3, -1]);
    frostDust(f, hF([[0.3, 0.15]])[0], 14, 26, 24);
    icicles(f, hF([[-0.1, -0.2], [0.18, -0.19]]), 2, 5, 8);
    icicles(f, hF([[-0.3, 0.55], [0.0, 0.56]]), 2, 6, 10);
  }

  // ------------------------------------------------ the door
  f.bone('door');
  if (IW) {
    // iron-bound pine from a northern chapel: round-headed, pale weathered planks, three full-width iron bands and an
    // iron arch band, a carved ring-cross in the head; rimed on its windward face, icicles under every band
    const TL = [404, 280], TR = [524, 264], BR = [530, 786], BL = [412, 789];
    const arch = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + Math.PI * i / 12; arch.push([464 + Math.cos(a) * 60 + (i / 12) * 0, 272 + Math.sin(a) * 52 - (i / 12) * 8 + (i ? 0 : 0)]); }
    const outline = [...arch.map((p, i) => (i === 0 || i === 12) ? [...p, 1] : p), [...BR, 1], [...BL, 1]];
    const edge = [[390, 288], ...arch.slice(0, 4).map(p => add(p, [-14, 6])).reverse().reverse(), TL, BL, [398, 790]];
    f.part([[390, 292, 1], [393, 252], [406, 230], arch[2], arch[1], [...arch[0], 1], [...BL, 1], [398, 790, 1]], { fill: '#5a4a34', shade: 0.3, inkW: 1.4, k: 0.8 }); // the door's thickness on the hinge side
    f.part(outline, { fill: oak, tex: T('wood'), texOp: 0.6, shade: 0.35, k: 1 });
    for (let i = 1; i < 5; i++) { const t = i / 5, x0 = 404 + t * 120; f.line([[x0, 272 - Math.sqrt(Math.max(0, 1 - ((x0 - 464) / 60) ** 2)) * 52 - t * 8 + 2], [412 + t * 118, 789]], 2, INK, { straight: true, op: 0.85 }); }
    f.line(arch, 2, '#c8b890', { op: 0.6 });
    // weathered silver grain
    for (let i = 0; i < 8; i++) { const x = 414 + i * 14; f.line([[x, 330 + (i % 3) * 30], [x + 2, 420 + (i % 2) * 40]], 0.9, '#c9bfa8', { op: 0.45 }); }
    // iron arch band and ring-cross carved in the head
    { const o1 = arch.map(p => lerp(p, [464, 300], 0.06)), i1 = arch.map(p => lerp(p, [464, 300], 0.2)); f.part([...o1, ...i1.reverse()], { fill: '#2f3033', shade: 0.4, inkW: 1.3, cast: true }); f.line(arch.map(p => lerp(p, [464, 300], 0.09)), 1.1, '#7a7c80', { op: 0.6 }); }
    for (let i = 1; i < 12; i += 2) f.rivet(lerp(arch[i], [464, 300], 0.13), 2.2, '#888');
    f.line(ell([466, 268], 17, 17, 0, 18).concat([ell([466, 268], 17, 17, 0, 18)[0]]), 2.4, '#3a2c1c');
    f.line([[466, 246], [466, 290]], 2.4, '#3a2c1c', { straight: true }); f.line([[444, 270], [488, 266]], 2.4, '#3a2c1c', { straight: true });
    f.line(ell([466, 268], 17, 17, 0, 18).slice(9, 15), 1, '#d8ccb0', { op: 0.6 });
    // iron bands right across
    for (const y of [350, 520, 690]) {
      f.part([[402, y - 8], [526, y - 22], [527, y - 6], [403, y + 8]], { fill: '#2f3033', shade: 0.4, inkW: 1.4, sharp: true, cast: true });
      for (let k = 0; k < 6; k++) f.rivet([410 + k * 22, y - k * 2.7], 2.4, '#7a7a7a');
      f.flat([[420, y + 9], [500, y - 2], [500, y + 2], [420, y + 13]], '#5a2a12', { op: 0.4 });
      rime(f, [[406, y - 9], [470, y - 17], [524, y - 23]], 6, [0.3, -1]);
      icicles(f, [[408, y + 8], [526, y - 6]], 6, 8, 22);
    }
    // windward face rimed: crust along the right edge and the head
    rime(f, [lerp(arch[7], [464, 300], 0.04), lerp(arch[9], [464, 300], 0.04), lerp(arch[11], [464, 300], 0.04), [522, 300], [524, 400], [526, 560], [527, 720]], 13);
    frostDust(f, [500, 460], 26, 180, 90);
    frostDust(f, [470, 300], 40, 30, 30);
    // tally kept from the old door: re-cut into this one
    for (let i = 0; i < 7; i++) f.line([[436 + i * 6, 398 + i * -0.7], [433 + i * 6, 430]], 1.3, '#4a3a24', { straight: true, op: 0.85 });
    f.line([[431, 423], [478, 402]], 1.3, '#4a3a24', { straight: true, op: 0.85 });
    // keyhole plate, ring handle, rubric strip
    f.part([[410, 560], [432, 558], [434, 610], [412, 612]], { fill: '#2f2f31', shade: 0.4, inkW: 1.2, sharp: true });
    f.flat([[420, 576], [424, 576], [425, 590], [419, 590]], '#000');
    f.part(ell([496, 452], 9, 9), { fill: '#3a3a3a', shade: 0.4 });
    f.line(ell([497, 478], 15, 22, 0.1, 18).concat([ell([497, 478], 15, 22, 0.1, 18)[0]]), 4, '#2b2b2b', { k: 1 });
    f.line(ell([497, 478], 15, 22, 0.1, 18).slice(10, 16), 1.5, '#9a9a9a', { op: 0.8 });
    f.part([[505, 494], [516, 496], [522, 560], [514, 600], [506, 598], [510, 556]], { fill: red, shade: 0.45, inkW: 1.2 });
    f.part([[500, 488], [514, 490], [512, 504], [500, 502]], { fill: mix(red, '#000', 0.2), shade: 0.4, inkW: 1 });
    rime(f, [[507, 520], [516, 560], [514, 596]], 3);
    icicle(f, [510, 600], 12, 4);
    f.flat([[452, 640], [470, 638], [474, 660], [466, 690], [458, 692], [454, 660]], '#4a0c08', { op: 0.6 });
  } else {
    // the church door (base), cracked and roped for the Last Bastion, barbed for the Thornguard
    const TL = [404, 262], TR = [524, 246], BR = [530, 786], BL = [412, 789];
    f.part([[390, 270], TL, BL, [398, 790]], { fill: '#3a2818', shade: 0.3, inkW: 1.4, sharp: true });
    if (LB) {
      // the top right corner smashed away: a jagged bite with split, pale ends of plank
      const face = [TL, [452, 256], [470, 252], [478, 270], [486, 262], [494, 284], [506, 280], [512, 300], [527, 298], BR, BL];
      f.part(face.map(p => [...p, 1]), { fill: oak, tex: T('wood'), texOp: 0.7, shade: 0.35 });
      for (const sp of [[[470, 252], [474, 264], [478, 270]], [[486, 262], [490, 276], [494, 284]], [[506, 280], [509, 292], [512, 300]]]) f.line(sp, 2.2, '#b8986a', { op: 0.9 });
    } else f.part([TL, TR, BR, BL].map(p => [...p, 1]), { fill: oak, tex: T('wood'), texOp: 0.7, shade: 0.35 });
    for (let i = 1; i < 4; i++) { const t = i / 4; f.line([lerp(TL, TR, t), lerp(BL, BR, t)], 2.2, INK, { straight: true, op: 0.9 }); }
    if (!LB) f.line([TL, TR], 2, '#a98a62', { straight: true, op: 0.7 }); else f.line([TL, [452, 256]], 2, '#a98a62', { straight: true, op: 0.7 });
    f.flat([[470, 300], [500, 290], [495, 296], [468, 306]], '#1c120a');
    f.flat([[430, 610], [452, 640], [447, 642], [426, 614]], '#1c120a');
    if (LB) {
      // the door split down its middle seam, the crack opening wider at the top
      const cr = [[478, 270], [474, 330], [480, 380], [470, 450], [476, 520], [468, 600], [472, 660]];
      f.flat([...cr, ...cr.slice(0, -1).reverse().map((p, i) => add(p, [-5 + i * 0.6, 0]))], '#0a0705');
      f.line(cr.map(p => add(p, [1.6, 0])), 1.2, '#b8986a', { op: 0.75 });
    }
    for (const y of [318, 498, 678]) {
      const a = [402, y + 3], b = [508, y - 12];
      if (LB && y === 498) {
        // middle hinge snapped: a stub, its spear end gone, the torn rivet holes left in the wood
        f.part([[396, y - 9], [446, y - 12], [452, y - 2], [444, y + 8], [396, y + 13]], { fill: '#2f2f31', shade: 0.4, inkW: 1.4, sharp: true });
        f.part(ell([392, y + 2], 9, 13, 0), { fill: '#2f2f31', shade: 0.4, inkW: 1.2 });
        f.rivet(lerp(a, b, 0.12), 2.6, '#777'); f.rivet(lerp(a, b, 0.36), 2.6, '#777');
        for (const k of [0.6, 0.84]) f.flat(ell(lerp(a, b, k), 2.4, 2.4, 0, 6), '#0a0705');
        f.flat([[452, y - 6], [508, y - 18], [508, y - 6], [452, y + 6]], '#2a1a0e', { op: 0.45 }); // ghost of the strap
        continue;
      }
      f.part([[396, y - 9], [b[0] - 8, b[1] - 8], [b[0] + 14, b[1]], [b[0] - 8, b[1] + 8], [396, y + 13]], { fill: '#2f2f31', shade: 0.4, inkW: 1.4, sharp: true });
      f.part(ell([392, y + 2], 9, 13, 0), { fill: '#2f2f31', shade: 0.4, inkW: 1.2 });
      for (let k = 0; k < 4; k++) f.rivet(lerp(a, b, 0.12 + k * 0.24), 2.6, '#777');
      f.flat([[420, y + 10], [470, y + 4], [470, y + 7], [420, y + 13]], '#5a2a12', { op: 0.5 });
    }
    for (let i = 0; i < 7; i++) f.line([[436 + i * 6, 380 + i * -0.7], [433 + i * 6, 412]], 1.3, '#c8ab80', { straight: true, op: 0.85 });
    f.line([[431, 405], [478, 384]], 1.3, '#c8ab80', { straight: true, op: 0.85 });
    f.part([[410, 540], [432, 538], [434, 590], [412, 592]], { fill: '#2f2f31', shade: 0.4, inkW: 1.2, sharp: true });
    f.flat([[420, 556], [424, 556], [425, 570], [419, 570]], '#000');
    f.part(ell([496, 452], 9, 9), { fill: '#3a3a3a', shade: 0.4 });
    f.line(ell([497, 478], 15, 22, 0.1, 18).concat([ell([497, 478], 15, 22, 0.1, 18)[0]]), 4, '#2b2b2b', { k: 1 });
    f.line(ell([497, 478], 15, 22, 0.1, 18).slice(10, 16), 1.5, '#9a9a9a', { op: 0.8 });
    f.part([[505, 494], [516, 496], [522, 560], [514, 600], [506, 598], [510, 556]], { fill: red, shade: 0.45, inkW: 1.2 });
    f.part([[500, 488], [514, 490], [512, 504], [500, 502]], { fill: mix(red, '#000', 0.2), shade: 0.4, inkW: 1 });
    f.line([[470, 345], [448, 330]], 3.2, '#3a2a1a', { straight: true });
    f.line([[448, 330], [443, 326], [446, 322]], 2, '#3a2a1a', { straight: true });
    f.flat([[466, 342], [474, 346], [471, 350]], '#000');
    f.flat([[452, 620], [470, 618], [474, 640], [466, 700], [458, 702], [454, 650]], '#4a0c08', { op: 0.75 });
    f.spatter([480, 560], 40, 26);
    if (LB) {
      // more broken shafts in the planks, and the whole door lashed back together with rope: three turns round it,
      // each passing round the hinge edge, knotted on the face with the ends left hanging
      for (const [p0, p1] of [[[446, 440], [420, 420]], [[500, 640], [478, 616]], [[430, 720], [404, 712]]]) { f.line([p0, p1], 3, '#3a2a1a', { straight: true }); f.flat(ell(p0, 3, 2, 0.5, 6), '#000'); }
      f.spatter([440, 470], 30, 18);
      for (const y of [400, 590, 740]) {
        const y2 = y - 15;
        rope(f, [[388, y + 4], [404, y + 1], [466, y2 + 7], [528, y2 - 1]], 5, '#9a8458', { straight: true });
        rope(f, [[390, y + 12], [404, y + 9], [466, y2 + 15], [529, y2 + 7]], 5, '#8a7448', { straight: true });
        f.part(ell([480, y2 + 9], 7, 8, 0.3, 10), { fill: '#8a7448', shade: 0.45, inkW: 1.1, cast: false, tex: T('hatch'), texOp: 0.4 });
        if (y !== 740) { ropeEnd(f, [480, y2 + 14], 26, 3.6, '#9a8458', 2); ropeEnd(f, [484, y2 + 14], 18, 3.6, '#8a7448', 5); }
        // the turn round the far edge: a short loop over the plank end, in silhouette
        rope(f, [[528, y2 - 1], [535, y2 + 3], [529, y2 + 7]], 4.4, '#9a8458');
      }
    }
    if (TG) {
      // iron barbs welded on: a row along the outer edge sticking out in silhouette, more studded over the face
      for (let i = 0; i < 10; i++) { const y = 268 + i * 54; barb(f, [526 + (y - 246) / 540 * 6, y], [1, -0.25 + (i % 2) * 0.15], 18, 9, barbC); }
      for (let i = 0; i < 6; i++) { const x = 410 + i * 22; barb(f, [x, 262 - (x - 404) * 0.13], [0.1, -1], 15, 8, barbC); }
      for (const [x, y] of [[440, 360], [488, 352], [430, 450], [470, 560], [440, 640], [496, 620], [452, 740], [500, 730], [476, 420]]) barb(f, [x, y], [0.85, 0.5], 13, 8, barbC);
    }
  }

  // ------------------------------------------------ near arm
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 46, 38, { p: [[0.45, 0.15, 0.2]] }), { fill: gamb, tex: T('quilt') });
  f.part(plate(SN, EN, 0.25, 0.85, 46, 40, { bow: 3 }), { fill: steel });
  if (TG) for (let i = 0; i < 4; i++) { const q = lp(SN, EN, 0.3 + i * 0.16, 23), d = E.norm(sub(EN, SN)); barb(f, q, add(mul([d[1], -d[0]], -1), mul(d, -0.3)), 15, 8, barbC); }
  f.bone('torso');
  if (LB) {
    // two broken arrow shafts still stuck in the back plate and the pauldron
    for (const [p0, p1] of [[S.at(-0.7, 0.3), add(S.at(-0.7, 0.3), [-38, -30])], [S.at(-0.6, 0.12), add(S.at(-0.6, 0.12), [-30, -44])]]) {
      f.line([p0, p1], 3.6, '#3a2a1a', { straight: true });
      f.line([p1, add(p1, [-4, -2]), add(p1, [-2, -6])], 2, '#3a2a1a', { straight: true });
      f.flat(ell(p0, 3.2, 2.2, 0.6, 6), '#000');
    }
  }
  if (IW) {
    // the mantle spilling over the back of the near arm and down below the pauldron, clumped wolf fur
    const fur = '#6a5d4c', furD = '#463c32';
    const fl = [S.at(-0.6, -0.12), add(SN, [16, -10]), add(SN, [22, 18]), lp(SN, EN, 0.42, -6), lp(SN, EN, 0.5, 6), [...lp(SN, EN, 0.62, 12), 1], lp(SN, EN, 0.56, 22), [...lp(SN, EN, 0.7, 28), 1], lp(SN, EN, 0.6, 36), [...S.at(-0.95, 0.62), 1], S.at(-1.0, 0.5), [...S.at(-1.12, 0.56), 1], S.at(-1.1, 0.3), S.at(-1.0, 0.05)];
    f.part(fl, { fill: fur, shade: 0.45, tex: T('hatch'), texOp: 0.25, shadow: '#2a241e', k: 0.8 });
    for (let i = 0; i < 26; i++) { const t = f.r(), q = lerp(lerp(S.at(-0.95, 0.1), lp(SN, EN, 0.2, 10), t), lerp(S.at(-1.0, 0.45), lp(SN, EN, 0.5, 24), t), f.r()), l = 9 + f.r() * 10; f.stroke([q, add(q, [-1 + f.r() * 2, l * 0.5]), add(q, [-2 + f.r() * 2, l])], 3, i % 3 ? furD : '#8c7e6a'); }
    for (const q of [lp(SN, EN, 0.62, 12), lp(SN, EN, 0.7, 28), S.at(-0.95, 0.62), S.at(-1.12, 0.56)]) f.stroke([add(q, [2, -16]), add(q, [0, -6]), add(q, [1, 2])], 3, '#30281f');
    rime(f, [S.at(-1.02, 0.08), S.at(-0.85, -0.06), S.at(-0.6, -0.1)], 8, [0.3, -1]);
  }
  G.pauldron(f, add(SN, [6, -4]), 42, -0.28, steel, steelD, LB ? 2 : 3);
  if (LB) { leadPatch(f, add(SN, [-10, -2]), 16, 11, -0.3, seed); f.flat(add(SN, [14, 14]) && ell(add(SN, [16, 14]), 8, 5, -0.3, 8), '#1b1c1f', { op: 0.7 }); }
  if (TG) { const PF = frame(add(SN, [6, -4]), -0.28, 42); for (const [u, v, a] of [[-0.95, 0.2, [-1, -0.5]], [-0.6, -0.4, [-0.6, -1]], [-0.05, -0.66, [0, -1]], [0.5, -0.55, [0.6, -1]], [0.95, 0.0, [1, -0.5]]]) barb(f, PF([[u, v]])[0], a, 15, 8, barbC); }
  if (IW) { rime(f, frame(add(SN, [6, -4]), -0.28, 42)([[-0.8, -0.22], [-0.3, -0.55], [0.3, -0.58], [0.75, -0.34]]), 9, [0.3, -1]); icicles(f, frame(add(SN, [6, -4]), -0.28, 42)([[-0.5, 1.2], [0.6, 1.0]]), 3, 8, 16); }
  f.scratches(add(SN, [0, -8]), 18, 5);
  f.spatter(add(SN, [20, 4]), 18, LB ? 22 : 10);
  f.bone('forearm_n');
  f.part(limb(EN, WN, 40, 32, { q: [[0.3, 0.2, 0.2]] }), { fill: gamb });
  f.part(plate(EN, WN, 0.12, 0.88, 42, 34, { bow: 2 }), { fill: steel });
  if (TG) for (let i = 0; i < 4; i++) { const q = lp(EN, WN, 0.25 + i * 0.18, -19); barb(f, q, [-0.3, 1], 14, 8, barbC); }
  if (IW) rime(f, [lp(EN, WN, 0.15, 14), lp(EN, WN, 0.5, 14), lp(EN, WN, 0.85, 12)], 7, [0.3, -1]);
  f.part(ell(add(EN, [4, 10]), 22, 13, 0.3, 12), { fill: gamb, tex: T('quilt'), shade: 0.5, cast: false });
  const uA = Math.atan2(EN[1] - SN[1], EN[0] - SN[0]);
  f.part(ell(add(EN, [-6, 6]), 17, 12, uA + 0.6, 14), { fill: steelD, shade: 0.5, k: 0.8 });
  f.line([lp(add(EN, [-6, 6]), add(EN, [10, -8]), -0.6, 0), lp(add(EN, [-6, 6]), add(EN, [10, -8]), 0.4, 0)], 1.2, INK, { op: 0.6 });
  f.rivet(add(EN, [-10, 10]), 2);
  if (TG) barb(f, add(EN, [-14, 14]), [-1, 0.6], 14, 8, barbC); // the couter's own spike
  f.bone('mace');
  const mH = [500, 236], mP = [318, 424];
  f.part(limb(mP, mH, 11, 10, { steps: 6 }), { fill: '#3c2a1c', shade: 0.4, tex: T('wood') });
  for (let i = 0; i < 5; i++) f.line([lp(mP, mH, 0.04 + i * 0.03, -6), lp(mP, mH, 0.06 + i * 0.03, 6)], 1.4, '#1a120b', { straight: true });
  const mA = Math.atan2(mH[1] - mP[1], mH[0] - mP[0]);
  G.maceHead(f, mH, mA, 30);
  if (IW) { rime(f, [add(mH, [-22, -10]), add(mH, [-4, -20]), add(mH, [16, -18])], 7, [0.3, -1]); }
  f.spatter(mH, 18, 14);
  f.line([lp(mP, mH, 0.02, -4), [302, 430], [312, 438], lp(mP, mH, 0.04, 6)], 2, '#2a1a10');
  f.bone('hand_n');
  B.grip(f, WN, EN, mA, 26, steel, { plate: true, cuff: true, maxBend: 40, name: 'bulwark mace' });
  if (TG) for (let i = 0; i < 3; i++) barb(f, add(WN, [-8 + i * 9, -20 + i * 2]), [0.2, -1], 10, 6, barbC); // knuckle spikes on the gauntlet's back
  return f;
}

// ------------------------------------------------------------------ DUELIST (base: dirAC.js duelist)
// Lichtenberg burn: a trunk that forks and forks again, as a surface mark (no glow, nothing in the air)
function scorch(f, p, ang, len, col = '#4a3a22') {
  const br = (q, a, l, w, d) => {
    if (d > 2 || l < 2.5) return;
    const e = add(q, rot([l, 0], a)), m = add(lerp(q, e, 0.5), rot([0, (f.r() - 0.5) * l * 0.35], a));
    f.line([q, m, e], w, col, { op: 0.85 });
    br(m, a + 0.6 + f.r() * 0.3, l * 0.5, w * 0.7, d + 1); br(e, a - 0.5 - f.r() * 0.3, l * 0.55, w * 0.7, d + 1); br(e, a + 0.15, l * 0.45, w * 0.7, d + 1);
  };
  br(p, ang, len, 1.2, 0);
}
// draw with fn(), then clip everything it drew to the path d (stripes on a sleeve)
function clipped(f, d, fn) {
  const i0 = f.out.length; fn(); const body = f.out.splice(i0).join('\n'), id = f.id('cl');
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
}
// barber's stripes: red bands winding round a limb from a to b
function barberStripes(f, a, b, wa, wb, n, d, seed) {
  clipped(f, d, () => {
    for (let k = 0; k < n; k++) {
      const t0 = (k + 0.15) / n - 0.1, t1 = t0 + 0.45 / n, sk = 0.18;
      f.part([lp(a, b, t0, wa * 0.8), lp(a, b, t1, wa * 0.8), lp(a, b, t1 + sk, -wb * 0.8), lp(a, b, t0 + sk, -wb * 0.8)], { fill: '#8e1f17', shade: 0.35, inkW: 0.8, inkHeavy: 1, cast: false, tex: 'weave' + seed, texOp: 0.4, sharp: true });
    }
  });
  f.raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`);
}

// path: 'bladedancer' | 'executioner' | 'bloodletter'
function duelist(path, seed) {
  const f = new Fig(base(seed));
  const T = t => t + seed;
  const BD = path === 'bladedancer', EX = path === 'executioner', BL = path === 'bloodletter';
  const H = 96;
  const leath = '#3b302a', leathL = '#4d4038', linen = '#8d877b', breech = '#4a4038', boot = '#3a2a1f', red = '#8e1f17', skin = '#c79a78';
  const shirt = '#b4ab97', shirtD = '#968c78';
  const N = [276, 266], C = [304, 366], P = [282, 466];
  const S = B.spine(N, C, P, H);
  const SN = S.at(0.15, 0.1), SF = S.at(-0.35, 0.08);
  const HN = S.at(0.15, 1.0), HF = S.at(-0.2, 0.98);
  const KN = [372, 606], AN = [402, 742], KF = [214, 602], AF = [156, 744];
  // the heading sword is held in both hands, low and in line, so the far arm comes forward onto the grip
  const bA2 = 0.86, bd2 = [Math.cos(bA2), Math.sin(bA2)], GH2 = [392, 402], L2 = 288;
  let EN = [366, 352], WN = [432, 388], EF = [148, 272], WF = [207, 238];
  if (EX) { WN = sub(GH2, mul(bd2, 17)); WF = sub(GH2, mul(bd2, 52)); EN = [312, 378]; EF = [282, 376]; }
  const HC = [296, 210];
  const RW = EX ? WN : add(WN, [-4, -2]);

  // skeleton: identical names and parents to the base
  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.05, -0.05), 'torso').joint('hair_queue', add(HC, [-42, -8]), 'head');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('dagger', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('rapier', RW, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('cape', S.at(-0.45, 0.02), 'torso');
  const ankle = (K, A) => add(E.norm(sub(A, K)), [0.6, 0]);

  // half cape (the Bladedancer goes without it: lighter clothes)
  if (!BD) {
    f.bone('cape');
    f.part([S.at(-0.2, -0.02), S.at(-0.7, 0.05), [150, 380], [128, 470], [150, 520], [178, 486], [200, 510], [226, 470], S.at(-0.6, 0.62)], { fill: '#24201f', tex: T('weave'), texOp: 0.4 });
    f.line([[200, 330], [165, 450], [150, 515]], 1.3, INK, { op: 0.7 });
    f.line([[228, 340], [190, 470], [200, 508]], 1.3, INK, { op: 0.7 });
    f.part([S.at(-0.68, 0.06), [146, 384], [122, 474], [130, 482], [160, 392]], { fill: red, shade: 0.4, inkW: 1 });
  }

  // far arm
  f.bone('upperarm_f');
  if (BD) { f.part(limb(SF, EF, 44, 36, { p: [[0.45, 0.25, 0.22]], q: [[0.5, 0.2, 0.2]], folds: [[0.3, 'q', 0.25], [0.7, 'p', 0.2]] }), { fill: shirtD, tex: T('weave') }); for (const t of [0.3, 0.55, 0.78]) f.stroke([lp(SF, EF, t, -16), lp(SF, EF, t + 0.06, 0), lp(SF, EF, t + 0.02, 15)], 1.8, mix(shirtD, '#1e1610', 0.72)); }
  else f.part(limb(SF, EF, 34, 28, { p: [[0.4, 0.2, 0.2]] }), { fill: linen, tex: T('weave') });
  f.bone('forearm_f');
  if (BD) {
    f.part(limb(EF, WF, 40, 30, { p: [[0.4, 0.3, 0.2]], folds: [[0.5, 'q', 0.3]] }), { fill: shirtD, tex: T('weave') });
    f.part(plate(EF, WF, 0.78, 0.98, 26, 24), { fill: '#7a705e', shade: 0.4, inkW: 1.2 }); // gathered cuff
  } else f.part(limb(EF, WF, 28, 22), { fill: leath });
  if (BD) {
    // second blade: a slim side-sword raised behind, point up and back, clear of the head
    const dA = Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) - Math.PI / 2 + 0.2, DG = frame(WF, dA, 1);
    f.bone('dagger');
    const g2 = DG([[18, 0]])[0], t2 = DG([[232, 0]])[0];
    G.rapierHilt(f, g2, dA, 20, '#6e6a62', { only: 'back', side: -1 });
    f.part(limb(g2, t2, 8, 2.4, { steps: 6, capK: 2 }), { fill: '#c0c6cc', shade: 0.35, inkW: 1.2, inkHeavy: 1.8 });
    f.line([lp(g2, t2, 0.05, 0), lp(g2, t2, 0.92, 0)], 0.8, '#eef2f5', { straight: true, op: 0.9 });
    scorch(f, lp(g2, t2, 0.3, 0), dA + 0.2, 10);
    f.bone('hand_f');
    B.grip(f, WF, EF, dA, 20, leathL, { name: 'bladedancer second blade' });
    f.bone('dagger');
    G.rapierHilt(f, g2, dA, 20, '#6e6a62', { only: 'front', side: -1 });
  } else if (!EX) {
    const dA = Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) - Math.PI / 2 + 0.2, DG = frame(WF, dA, 1);
    f.bone('dagger');
    f.part(DG([[-30, -4], [-22, -5], [-22, 5], [-30, 4]]), { fill: '#5a4a32', shade: 0.4, inkW: 1.1, cast: false });
    f.part(DG([[20, -9], [108, 0], [20, 9]]), { fill: '#b6bcc2', shade: 0.4, inkW: 1.2, sharp: true });
    f.line(DG([[26, 0], [100, 0]]), 0.8, '#eef', { op: 0.8 });
    f.part(DG([[15, -17], [21, -17], [21, 17], [15, 17]]), { fill: '#5a4a32', shade: 0.4, inkW: 1.2, sharp: true });
    f.bone('hand_f');
    B.grip(f, WF, EF, dA, 20, leathL, { name: 'duelist dagger' });
  }

  // far leg back
  f.bone('thigh_f');
  f.part(limb(HF, KF, 56, 34, { q: [[0.3, 0.2, 0.2]], p: [[0.25, 0.12, 0.2]], folds: [[0.85, 'q', 0.35]] }), { fill: breech, tex: T('weave'), texOp: 0.3 });
  f.bone('shin_f');
  f.part(limb(KF, AF, 38, 24, { q: [[0.25, 0.3, 0.16]], folds: [[0.75, 'p', 0.25], [0.55, 'q', 0.2]] }), { fill: boot, tex: T('mottle') });
  split(f, () => B.boot(f, AF, 1, 50, boot, { tex: T('mottle'), knee: add(KF, [-2, 8]), kneeW: 40, cuff: true, strap: true }), [['shin_f', side(AF, mul(ankle(KF, AF), -1), 17)], ['foot_f', side(AF, ankle(KF, AF), 17)]]);

  // torso
  f.bone('torso');
  if (BD) {
    // open linen shirt, loose and bloused over the sash; the neck open to the breastbone
    const torso = S.shape([[-0.05, 0.34, 0.32], [0.06, 0.68, 0.48], [0.2, 0.68, 0.74], [0.42, 0.6, 0.7], [0.62, 0.56, 0.62], [0.8, 0.62, 0.6], [0.92, 0.66, 0.6], [1.0, 0.6, 0.52]]);
    f.part(torso, { fill: shirt, tex: T('weave'), texOp: 0.5 });
    const vn = [S.at(0.3, -0.07), S.at(0.6, -0.05), S.at(0.74, 0.12), S.at(0.72, 0.28), S.at(0.64, 0.46), S.at(0.56, 0.3), S.at(0.42, 0.08)];
    f.part(vn, { fill: skin, shade: 0.45, tex: T('mottle'), texOp: 0.4, k: 0.8 });
    f.line([S.at(0.42, 0.04), S.at(0.55, 0.08), S.at(0.7, 0.06)], 1.1, mix(skin, '#000', 0.5), { op: 0.6 }); // collarbone
    f.line([S.at(0.66, 0.14), S.at(0.65, 0.28), S.at(0.62, 0.4)], 1.2, mix(skin, '#000', 0.5), { op: 0.5 }); // breastbone
    for (let i = 0; i < 14; i++) { const q = lerp(S.at(0.56, 0.1), S.at(0.7, 0.3), f.r()); f.line([q, add(q, [1.5 + f.r() * 2, 3 + f.r() * 2])], 0.9, '#3a2a20', { op: 0.7, straight: true }); } // chest hair
    // the open collar flaps lying back, laces hanging loose from their eyelets
    f.part([S.at(0.28, -0.1), S.at(0.44, 0.1), S.at(0.56, 0.32), S.at(0.48, 0.34), S.at(0.32, 0.16), S.at(0.14, -0.02)], { fill: shirt, shade: 0.4, tex: T('weave'), texOp: 0.4, inkW: 1.3 });
    f.part([S.at(0.6, -0.07), S.at(0.78, 0.08), S.at(0.76, 0.24), S.at(0.7, 0.14)], { fill: mix(shirt, '#fff', 0.1), shade: 0.4, inkW: 1.2 });
    for (const q of [S.at(0.5, 0.24), S.at(0.45, 0.16)]) f.part(ell(q, 1.8, 1.8, 0, 6), { fill: '#3a3026', inkW: 0.8, cast: false });
    f.line([S.at(0.5, 0.24), S.at(0.46, 0.4), S.at(0.5, 0.56)], 1.4, '#4a3a2a');
    f.line([S.at(0.45, 0.16), S.at(0.36, 0.3), S.at(0.38, 0.48)], 1.4, '#4a3a2a');
    // folds and wear: drag folds from the shoulder to the bloused waist, a sweat stain, a darn
    for (const l of [[[-0.1, 0.2], [0.0, 0.45], [0.05, 0.7]], [[0.2, 0.36], [0.3, 0.55], [0.25, 0.72]], [[-0.25, 0.3], [-0.3, 0.55], [-0.2, 0.74]]]) f.stroke(l.map(([u, v]) => S.at(u, v)), 2.2, mix(shirt, '#1e1610', 0.75));
    f.stroke([S.at(0.0, 0.62), S.at(0.25, 0.66), S.at(0.5, 0.62)], 2, mix(shirt, '#1e1610', 0.72));
    for (const l of [[[-0.45, 0.12], [-0.5, 0.35], [-0.42, 0.6]], [[-0.05, 0.08], [-0.12, 0.3], [-0.05, 0.52]], [[0.1, 0.42], [0.0, 0.58], [-0.1, 0.72]], [[-0.4, 0.55], [-0.3, 0.64], [-0.15, 0.66]]]) f.stroke(l.map(([u, v]) => S.at(u, v)), 1.8, mix(shirt, '#1e1610', 0.72));
    for (const l of [[[-0.3, 0.15], [-0.32, 0.3]], [[0.15, 0.5], [0.12, 0.62]]]) f.line(l.map(([u, v]) => S.at(u, v)), 1, '#f0e8d8', { op: 0.55 });
    f.flat(ell(S.at(-0.2, 0.42), 14, 18, 0.3, 10), '#6a5a40', { op: 0.3 });
    f.flat(ell(S.at(0.05, 0.25), 8, 6, 0.2, 8), '#6a5a40', { op: 0.25 });
    f.part([S.at(-0.5, 0.22), S.at(-0.36, 0.2), S.at(-0.35, 0.33), S.at(-0.5, 0.35)], { fill: '#8a8270', shade: 0.4, tex: T('weave'), texOp: 0.5, inkW: 1.1, sharp: true, cast: false }); // a patch on the back
    f.stitches([S.at(-0.5, 0.22), S.at(-0.36, 0.2), S.at(-0.35, 0.33), S.at(-0.5, 0.35), S.at(-0.5, 0.22)], '#4a3a2a', 0.8);
    f.stitches([S.at(-0.32, 0.5), S.at(-0.18, 0.56), S.at(-0.05, 0.5)], '#5a4a3a', 0.9);
  } else {
    const torso = S.shape([[-0.05, 0.3, 0.32], [0.06, 0.62, 0.45], [0.2, 0.6, 0.72], [0.42, 0.52, 0.66], [0.65, 0.45, 0.5], [0.85, 0.55, 0.5], [1.05, 0.6, 0.52], [1.12, 0.5, 0.42]]);
    f.part(torso, { fill: leath, tex: T('mottle'), texOp: 0.5 });
    f.stroke([S.at(-0.1, 0.12), S.at(0.25, 0.2), S.at(0.55, 0.32)], 2.4);
    f.stroke([S.at(0.0, 0.48), S.at(0.3, 0.46), S.at(0.6, 0.38)], 2);
    f.line([S.at(0.38, 0.02), S.at(0.62, 0.22), S.at(0.5, 0.55), S.at(0.42, 0.8)], 1.6, INK);
    for (let i = 0; i < 7; i++) f.rivet(S.at(0.6 - i * 0.025, 0.2 + i * 0.085), 2, '#8a7c6c');
    f.part([S.at(-0.32, -0.1), S.at(0.38, -0.08), S.at(0.45, 0.04), S.at(-0.35, 0.06)], { fill: linen, shade: 0.4, inkW: 1.2 });
    f.stitches([S.at(-0.2, 0.3), S.at(0.1, 0.38), S.at(0.4, 0.5)]);
  }

  // sash, belt and hangings on the hips
  f.bone('pelvis');
  if (BD) {
    // the shirt's tail flaring out under the sash at the back
    f.part([S.at(-0.6, 0.76), S.at(-0.2, 0.8), S.at(-0.35, 1.0), S.at(-0.55, 1.06), S.at(-0.72, 1.0), S.at(-0.8, 0.9)], { fill: shirtD, tex: T('weave'), texOp: 0.4, shade: 0.45 });
  }
  f.part([S.at(-0.58, 0.66), S.at(-0.1, 0.68), S.at(0.52, 0.64), S.at(0.56, 0.71), S.at(0.53, 0.79), S.at(0.0, 0.8), S.at(-0.6, 0.82), S.at(-0.62, 0.74)], { fill: red, shade: 0.45, tex: T('weave'), texOp: 0.4, k: 0.5 });
  for (let i = 0; i < 4; i++) f.stroke([S.at(-0.45 + i * 0.25, 0.8), S.at(-0.32 + i * 0.25, 0.73), S.at(-0.2 + i * 0.25, 0.67)], 2.4, mix(red, '#000', 0.55));
  if (BD) {
    // long sash tails thrown back by the last turn, still swinging
    f.part([S.at(-0.55, 0.72), [200, 498], [160, 512], [112, 534], [96, 552], [110, 560], [148, 548], [186, 534], [168, 566], [136, 604], [124, 628], [140, 632], [176, 600], [214, 556], [236, 520], S.at(-0.35, 0.82)], { fill: mix(red, '#000', 0.15), shade: 0.45, tex: T('weave'), texOp: 0.35 });
    f.stroke([[200, 506], [160, 522], [118, 546]], 1.8, mix(red, '#000', 0.6)); f.stroke([[210, 540], [176, 580], [140, 620]], 1.8, mix(red, '#000', 0.6));
    for (const e of [[100, 556], [128, 630]]) for (let k = -1; k <= 1; k++) f.line([e, add(e, [-5 + k * 2, 6 + k * 3])], 0.9, mix(red, '#000', 0.3)); // fringe
  } else f.part([S.at(-0.55, 0.72), [212, 520], [190, 590], [205, 596], [222, 560], [215, 610], [234, 612], [240, 540], S.at(-0.35, 0.82)], { fill: mix(red, '#000', 0.15), shade: 0.45 });
  f.part([S.at(-0.6, 0.84), S.at(0.55, 0.82), S.at(0.56, 0.89), S.at(-0.61, 0.91)], { fill: '#1d1612', shade: 0.4, sharp: true });
  f.part([S.at(0.3, 0.82), S.at(0.44, 0.82), S.at(0.44, 0.91), S.at(0.3, 0.91)], { fill: '#a08858', shade: 0.4, inkW: 1, sharp: true });
  if (BD) f.part([S.at(-0.4, 0.88), S.at(-0.26, 0.9), [196, 616], [186, 612]], { fill: '#2a201a', shade: 0.3, sharp: true }); // the second blade's empty scabbard
  f.part([S.at(-0.5, 0.88), S.at(-0.35, 0.9), [180, 610], [170, 604]], { fill: '#1d1612', shade: 0.3, sharp: true });
  if (BL) {
    // lancet case: a flat tooled-leather case on a thong, three lancet scales showing at its mouth
    const lc = S.at(-0.12, 0.9), LF = frame(lc, 0.18, 1);
    f.line([S.at(-0.12, 0.84), lc], 1.6, '#2b2119');
    for (const [x, c] of [[-4, '#d8ccb0'], [0, '#6a3a1a'], [4, '#c8bca0']]) f.part(LF([[x - 2, 2], [x + 2, 2], [x + 2.5, 10], [x - 2.5, 10]]), { fill: c, inkW: 0.9, inkHeavy: 1, cast: false, shade: 0.3 });
    f.part(LF([[-8, 8], [8, 8], [9, 48], [0, 52], [-9, 48]]), { fill: '#5a3a22', shade: 0.4, tex: T('mottle'), texOp: 0.5, inkW: 1.2 });
    f.line(LF([[-5, 14], [5, 14]]), 1, '#2a1a10', { op: 0.8, straight: true });
    f.stitches(LF([[-7, 12], [-7, 46], [0, 49], [7, 46], [7, 12]]), '#b8a888', 0.8);
    f.rivet(LF([[0, 22]])[0], 2, '#8a8a86');
  }
  f.line([S.at(0.1, 0.9), S.at(0.15, 0.98)], 1.2, '#2b2119');
  G.badge(f, S.at(0.15, 0.98), 9, '#74777b', 0.1);

  // near leg
  f.bone('thigh_n');
  f.part(limb(HN, KN, 58, 36, { p: [[0.3, 0.18, 0.2]], q: [[0.3, 0.2, 0.22]], folds: [[0.88, 'p', 0.35], [0.5, 'p', 0.15]] }), { fill: breech, tex: T('weave'), texOp: 0.3 });
  f.stroke([lp(HN, KN, 0.86, 14), lp(HN, KN, 0.78, 2), lp(HN, KN, 0.7, -6)], 2.2);
  f.stroke([lp(HN, KN, 0.45, -18), lp(HN, KN, 0.55, -6), lp(HN, KN, 0.6, 6)], 1.8);
  f.line([lerp(HN, KN, 0.3), lerp(HN, KN, 0.55)], 1.1, INK, { op: 0.5 });
  f.bone('shin_n');
  f.part(limb(KN, AN, 40, 26, { p: [[0.25, 0.3, 0.16]], folds: [[0.7, 'q', 0.25], [0.55, 'p', 0.2]] }), { fill: boot, tex: T('mottle') });
  f.stroke([lp(KN, AN, 0.68, -12), lp(KN, AN, 0.72, 0), lp(KN, AN, 0.66, 10)], 2);
  split(f, () => B.boot(f, AN, 1, 50, boot, { tex: T('mottle'), knee: add(KN, [0, 8]), kneeW: 42, cuff: true }), [['shin_n', side(AN, mul(ankle(KN, AN), -1), 17)], ['foot_n', side(AN, ankle(KN, AN), 17)]]);
  f.bone('shin_n');
  f.scratches(lerp(KN, AN, 0.5), 10, 4, '#7a6650');

  if (EX) {
    // headsman's apron: heavy leather from the belt to the knee, hanging over the forward thigh, stiff with old blood
    f.bone('pelvis');
    const ap = [S.at(0.0, 0.8), S.at(0.55, 0.78), [356, 478], [370, 530], [384, 584], [392, 620, 1], [366, 626], [338, 630], [312, 624], [296, 628, 1], [292, 580], [288, 520]];
    f.part(ap, { fill: '#4e3828', shade: 0.45, tex: T('mottle'), texOp: 0.6, k: 0.8 });
    for (const l of [[[318, 480], [322, 560], [318, 624]], [[344, 482], [356, 560], [360, 626]], [[300, 500], [298, 570], [300, 622]]]) f.stroke(l, 2.4, '#24180f');
    f.line([[372, 540], [386, 600]], 1.2, '#8a6a4e', { op: 0.6 }); // worn-bright edge over the thigh
    f.flat([[316, 560], [340, 556], [352, 590], [336, 612], [318, 606]], '#3a0a06', { op: 0.55 });
    f.flat([[300, 600], [314, 596], [316, 622], [302, 624]], '#3a0a06', { op: 0.5 });
    f.spatter([346, 540], 24, 14, '#4a0c08');
    f.stitches([[294, 624], [338, 628], [390, 618]], '#a08868', 0.9);
    f.part([S.at(-0.05, 0.79), S.at(0.6, 0.77), S.at(0.6, 0.82), S.at(-0.05, 0.84)], { fill: '#2a1c12', shade: 0.4, sharp: true, inkW: 1.1 }); // its waist strap
    f.rivet(S.at(0.5, 0.8), 2.2, '#8a8a86');
  }

  if (EX) {
    // the hood's shoulder cape over the doublet, hem worn ragged
    f.bone('torso');
    const mc = [S.at(-0.5, -0.12), S.at(0.0, -0.14), S.at(0.45, -0.06), S.at(0.66, 0.08), S.at(0.7, 0.28), [S.at(0.6, 0.42)[0], S.at(0.6, 0.42)[1], 1], S.at(0.44, 0.36), S.at(0.3, 0.44), S.at(0.1, 0.38), [...S.at(-0.1, 0.46), 1], S.at(-0.3, 0.38), S.at(-0.5, 0.42), [...S.at(-0.66, 0.34), 1], S.at(-0.7, 0.1)];
    f.part(mc, { fill: '#332e2e', tex: T('weave'), texOp: 0.45, shade: 0.42, shadow: '#141010', maxShade: 30 });
    for (const l of [[[0.2, 0.0], [0.25, 0.2], [0.2, 0.4]], [[-0.2, 0.0], [-0.15, 0.2], [-0.1, 0.42]], [[0.5, 0.1], [0.55, 0.25], [0.5, 0.38]]]) f.stroke(l.map(([u, v]) => S.at(u, v)), 2.2, '#0e0b0b');
    f.line([S.at(-0.4, -0.08), S.at(0.1, -0.1), S.at(0.5, -0.02)], 1.1, '#5a5454', { op: 0.5 });
  }

  // head
  f.bone('head');
  f.part(limb(S.at(0.05, -0.05), add(HC, [-4, 30]), 34, 30), { fill: skin, shade: 0.5 });
  const hF = frame(HC, -0.1, H);
  if (EX) {
    // headsman's hood: black wool pulled over the whole head, cloth tented over the brow, nose and chin,
    // two eye holes cut and hemmed; the eyes are only shadow inside them
    const hood = '#3a3434', hoodD = '#221d1d';
    f.part(hF([[-0.46, 0.5], [-0.5, 0.1], [-0.44, -0.28], [-0.24, -0.52], [0.06, -0.57], [0.28, -0.47], [0.37, -0.28], [0.35, -0.13], [0.37, -0.02], [0.43, 0.1], [0.38, 0.17], [0.37, 0.3], [0.34, 0.44], [0.27, 0.54], [0.22, 0.64], [0.3, 0.86], [-0.3, 0.86]]), { fill: hood, tex: T('weave'), texOp: 0.45, shade: 0.42, shadow: '#171313', maxShade: 26 });
    f.flat(hF([[0.14, 0.22], [0.36, 0.2], [0.34, 0.44], [0.2, 0.5], [0.06, 0.36]]), hoodD, { op: 0.6 }); // the cloth sinking into the cheek and mouth
    f.flat(hF([[0.22, -0.2], [0.36, -0.2], [0.36, 0.04], [0.26, 0.0]]), '#000', { op: 0.25 }); // socket shadow beside the bridge
    f.stroke(hF([[0.36, -0.28], [0.24, -0.4], [0.04, -0.44]]), 2, '#0e0b0b'); // fold over the brow
    f.line(hF([[0.06, -0.62], [-0.06, -0.3], [-0.12, 0.1], [-0.14, 0.5]]), 1.2, '#4a4444', { op: 0.6 }); // centre seam from crown to nape
    f.stitches(hF([[0.06, -0.6], [-0.04, -0.3], [-0.1, 0.1]]), '#5a5454', 0.8);
    for (const l of [[[0.24, 0.6], [0.1, 0.7], [-0.04, 0.82]], [[0.0, 0.52], [-0.18, 0.64], [-0.26, 0.82]], [[-0.36, 0.0], [-0.42, 0.3], [-0.4, 0.6]]]) f.stroke(hF(l), 2.2, '#0e0b0b');
    f.line(hF([[0.3, -0.4], [0.37, -0.2]]), 1.1, '#6a6262', { op: 0.6 }); // lit brow edge
    // eye holes: hemmed almond cuts, black inside, the lower lid a dark sliver of skin, nothing lit
    const eh = hF(ell([0.135, -0.075], 0.085, 0.04, -0.12, 14));
    f.flat(eh, '#060404');
    f.flat(hF([[0.07, -0.05], [0.13, -0.04], [0.2, -0.06], [0.14, -0.05]]), '#3a2218', { op: 0.6 });
    f.line(eh.concat([eh[0]]), 1.4, '#3e3838');
    f.line(hF([[0.05, -0.1], [0.13, -0.125], [0.22, -0.1]]), 1.6, '#0e0b0b');
    f.flat(hF(ell([0.31, -0.075], 0.022, 0.032, 0, 8)), '#060404');
    f.spatter(hF([[0.2, 0.62]])[0], 10, 5, '#3a0a06');
  } else {
    B.head(f, HC, H, -0.1, {
      skin, jaw: 1.08, chin: 0.03, nose: 1.05, hook: 0.6, mouth: 'smirk', squint: 0.45, browDown: 0.03, age: true, glint: true,
      hairCol: '#2a2420', moustache: true, beard: 'stubble', beardCol: '#3a3430',
      scar: [[0.05, 0.02], [0.17, 0.12], [0.26, 0.2]],
      hair: [[-0.38, -0.12], [-0.33, -0.36], [-0.12, -0.54], [0.12, -0.53], [0.3, -0.4], [0.26, -0.33], [0.06, -0.36], [-0.12, -0.28], [-0.22, -0.12], [-0.3, 0.02]],
      hairLines: [[[-0.25, -0.35], [-0.05, -0.47], [0.2, -0.45]], [[-0.3, -0.2], [-0.15, -0.38], [0.05, -0.43]]],
    });
  }
  f.bone('hair_queue');
  if (EX) {
    // the hood's back point hangs plumb down the nape
    const q0 = add(HC, [-40, -6]);
    f.part([q0, add(q0, [-14, 10]), add(q0, [-20, 44]), add(q0, [-16, 78]), add(q0, [-8, 50]), add(q0, [4, 20])], { fill: '#2b2626', tex: T('weave'), texOp: 0.4, shade: 0.4, shadow: '#0e0b0b' });
    f.line([add(HC, [-38, 50]), add(HC, [-46, 66])], 2.5, red); // the company's rubric strip, tied round the hood's tail
    f.part([add(HC, [-44, 60]), add(HC, [-40, 62]), add(HC, [-46, 90]), add(HC, [-52, 88])], { fill: red, shade: 0.4, inkW: 1, cast: false });
  } else {
    f.part([add(HC, [-36, -18]), add(HC, [-58, -6]), add(HC, [-70, 30]), add(HC, [-60, 52]), add(HC, [-52, 20]), add(HC, [-38, 0])], { fill: '#2a2420', shade: 0.4 });
    f.line([add(HC, [-50, -16]), add(HC, [-44, -2])], 2.5, red);
    f.bone('head');
    f.line(ell(add(HC, [-17, 21]), 3.5, 4.5, 0, 8).concat([ell(add(HC, [-17, 21]), 3.5, 4.5, 0, 8)[0]]), 1.6, '#8a8680');
  }
  // near arm
  f.bone('upperarm_n');
  let sleeveD = null;
  if (BD) {
    f.part(limb(SN, EN, 46, 42, { p: [[0.4, 0.22, 0.18]], q: [[0.55, 0.22, 0.18]], folds: [[0.25, 'q', 0.3], [0.5, 'p', 0.25], [0.72, 'q', 0.3], [0.9, 'p', 0.3]] }), { fill: shirt, tex: T('weave') });
    f.stroke([lp(SN, EN, 0.3, -16), lp(SN, EN, 0.45, -2), lp(SN, EN, 0.62, 14)], 2, mix(shirt, '#1e1610', 0.72));
    f.stroke([lp(SN, EN, 0.62, -18), lp(SN, EN, 0.75, -4), lp(SN, EN, 0.85, 12)], 1.8, mix(shirt, '#1e1610', 0.72));
    f.stroke([lp(SN, EN, 0.12, -14), lp(SN, EN, 0.2, 0), lp(SN, EN, 0.3, 16)], 1.6, mix(shirt, '#1e1610', 0.72));
    f.line([lp(SN, EN, 0.4, 8), lp(SN, EN, 0.6, 12)], 1, '#f0e8d8', { op: 0.5 });
  } else if (BL) {
    // barber-surgeon's sleeve: white linen wound with red, the barber's pole
    sleeveD = f.part(limb(SN, EN, 46, 34, { p: [[0.3, 0.22, 0.2]], q: [[0.35, 0.2, 0.2]], folds: [[0.9, 'q', 0.3]] }), { fill: '#d4ccbc', tex: T('weave') });
    barberStripes(f, SN, EN, 23, 17, 4, sleeveD, seed);
  } else {
    f.part(limb(SN, EN, 44, 30, { p: [[0.3, 0.28, 0.2]], q: [[0.35, 0.2, 0.2]], folds: [[0.9, 'q', 0.3]] }), { fill: leath, tex: T('mottle') });
    for (const off of [-9, 0, 9]) f.part(limb(lp(SN, EN, 0.18, off), lp(SN, EN, 0.75, off * 0.7), 5, 4, { steps: 5 }), { fill: linen, shade: 0.35, inkW: 1, inkHeavy: 1.5, cast: false });
  }
  f.bone('forearm_n');
  if (BD) {
    f.part(limb(EN, WN, 46, 30, { p: [[0.35, 0.3, 0.2]], q: [[0.5, 0.25, 0.2]], folds: [[0.2, 'q', 0.3], [0.6, 'p', 0.2]] }), { fill: shirt, tex: T('weave') });
    f.stroke([lp(EN, WN, 0.2, 18), lp(EN, WN, 0.4, 4), lp(EN, WN, 0.6, -14)], 1.8, mix(shirt, '#1e1610', 0.72));
  } else if (BL) {
    const fd = f.part(limb(EN, WN, 36, 26, { p: [[0.25, 0.25, 0.2]], folds: [[0.15, 'q', 0.3]] }), { fill: '#d4ccbc', tex: T('weave') });
    barberStripes(f, EN, WN, 18, 13, 3, fd, seed);
    f.spatter(lerp(EN, WN, 0.6), 14, 8);
  } else f.part(limb(EN, WN, 34, 24, { p: [[0.25, 0.25, 0.2]], folds: [[0.15, 'q', 0.3]] }), { fill: leath, tex: T('mottle') });
  f.bone('torso');
  if (!BD && !EX) {
    f.part(ell(add(SN, [8, -2]), 26, 18, -0.4, 14), { fill: leathL, shade: 0.5 });
    f.stitches([lp(SN, EN, 0.05, -14), lp(SN, EN, 0.08, 14)]);
  }
  if (BD) f.stroke([add(SN, [-14, -10]), add(SN, [4, -16]), add(SN, [22, -8])], 2.2, mix(shirt, '#1e1610', 0.72)); // shoulder seam
  f.bone('forearm_n');
  f.part(plate(EN, WN, BD ? 0.74 : 0.55, 1.0, 34, 38), { fill: '#241c17', shade: 0.4 });

  // the main blade
  f.bone('rapier');
  if (EX) {
    // heading sword: broad, straight, square-tipped; a short fuller, an engraved wheel, long two-hand grip, pear pommel
    const BF = frame(GH2, bA2, 1), tipC = add(GH2, mul(bd2, L2));
    f.part(BF([[-82, -5], [-6, -5], [-6, 5], [-82, 5]]), { fill: '#2a1c14', shade: 0.4, inkW: 1.1, cast: false });
    for (let i = 0; i < 8; i++) f.line(BF([[-74 + i * 9, -5], [-70 + i * 9, 5]]), 1.2, '#140c08', { straight: true });
    f.part(BF(ell([-88, 0], 9, 8, 0, 10)), { fill: '#5a5a58', shade: 0.45, inkW: 1.2, cast: false });
    f.part(BF([[2, -15], [L2, -13.5, 1], [L2 + 3, -6], [L2 + 3, 6], [L2, 13.5, 1], [2, 15]]), { fill: '#9ea5ac', shade: 0.4, inkW: 1.3, inkHeavy: 2.2, tex: T('mottle'), texOp: 0.4 });
    f.line(BF([[6, -11], [L2 - 2, -10]]), 1, '#eef2f5', { straight: true, op: 0.8 }); // bevel
    f.line(BF([[10, 0], [L2 * 0.42, 0]]), 2.2, '#6a7078', { straight: true }); // fuller
    f.line(BF([[10, -1.4], [L2 * 0.42, -1.4]]), 0.8, '#e0e4e8', { straight: true, op: 0.7 });
    const wc = BF([[L2 * 0.56, 0]])[0];
    f.line(ell(wc, 6, 6, 0, 12).concat([ell(wc, 6, 6, 0, 12)[0]]), 1, '#4a5058', { op: 0.85 });
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; f.line([wc, add(wc, [Math.cos(a) * 6, Math.sin(a) * 6])], 0.8, '#4a5058', { straight: true, op: 0.8 }); } // the breaking wheel
    for (let k = 0; k < 3; k++) f.line(BF([[L2 * 0.66 + k * 9, -5], [L2 * 0.66 + k * 9 + 5, 4]]), 0.9, '#4a5058', { straight: true, op: 0.7 }); // worn engraved script
    scorch(f, BF([[L2 * 0.3, 6]])[0], bA2 + 0.3, 12);
    scorch(f, BF([[L2 * 0.8, -4]])[0], bA2 - 0.4, 10);
    f.spatter(tipC, 20, 10);
    f.part(BF([[-3, -34], [4, -33], [5, 33], [-3, 34], [-6, 30], [-5, -30]]), { fill: '#5a5652', shade: 0.45, inkW: 1.3 });
    f.part(BF(ell([0, -36], 4, 5, 0, 8)), { fill: '#5a5652', inkW: 1, cast: false }); f.part(BF(ell([0, 36], 4, 5, 0, 8)), { fill: '#5a5652', inkW: 1, cast: false });
    f.bone('hand_f');
    B.grip(f, WF, EF, bA2, 20, leathL, { name: 'executioner pommel hand', maxBend: 38 });
    f.bone('hand_n');
    const fa = Math.atan2(WN[1] - EN[1], WN[0] - EN[0]);
    B.grip(f, WN, EN, bA2 - Math.PI / 2, 20, '#2a201a', { cuff: true, inline: true, bend: bA2 - fa });
  } else if (BL) {
    // short curved blade: a single-edged barber's hanger, the back near straight, the edge sweeping up to the point
    const gh = [444, 396], bA = Math.atan2(518 - 396, 588 - 446), BF = frame(gh, bA, 1);
    const bl = [[2, -5], [44, -6], [82, -9], [110, -15], [128, -27, 1], [118, -12], [98, 2], [66, 9], [32, 9], [2, 6]];
    f.part(BF(bl), { fill: '#bcc2c8', shade: 0.38, inkW: 1.2, inkHeavy: 2 });
    f.line(BF([[8, 4], [40, 5.5], [76, 3], [104, -5], [122, -20]]), 1, '#eef2f5', { op: 0.8 }); // edge bevel
    f.line(BF([[6, -3], [80, -6]]), 1.6, '#6a7078', { op: 0.7 });
    scorch(f, BF([[30, 2]])[0], bA - 0.3, 11); scorch(f, BF([[70, 0]])[0], bA + 0.4, 8);
    f.spatter(BF([[100, 0]])[0], 16, 10);
    f.part(BF([[-4, -15], [3, -14], [4, 14], [-2, 16], [-6, 12], [-5, -10]]), { fill: '#6a645c', shade: 0.45, inkW: 1.2 });
    f.part(BF(ell([-38, 0], 6, 5, 0, 8)), { fill: '#6a645c', shade: 0.4, inkW: 1.1, cast: false });
    f.bone('hand_n');
    B.grip(f, add(WN, [-4, -2]), EN, -Math.PI / 2, 20, '#2a201a', { cuff: true, inline: true });
    scorch(f, add(WN, [-10, -8]), -0.4, 9, '#5a3a22'); // the burn on the sword hand
  } else {
    const bA = Math.atan2(518 - 396, 588 - 446), tip = [588, 518], gh = [444, 396];
    f.part(limb(gh, tip, 8.5, 2.5, { steps: 6, capK: 2 }), { fill: '#c6ccd2', shade: 0.35, inkW: 1.2, inkHeavy: 1.8 });
    f.line([lp(gh, tip, 0.05, 0), lp(gh, tip, 0.95, 0)], 0.8, '#eef2f5', { straight: true, op: 0.9 });
    for (const tt of [0.35, 0.6]) f.line([lp(gh, tip, tt, -2), lp(gh, tip, tt + 0.03, 3), lp(gh, tip, tt + 0.06, -1)], 1, '#5b4a2c', { op: 0.8, straight: true });
    G.rapierHilt(f, gh, bA, 19, '#7a746a', { only: 'back' });
    f.bone('hand_n');
    B.grip(f, add(WN, [-4, -2]), EN, -Math.PI / 2, 20, '#2a201a', { cuff: true, inline: true });
    f.bone('rapier');
    G.rapierHilt(f, gh, bA, 19, '#7a746a', { only: 'front' });
  }
  if (BL) {
    // the bleeding bowl: pewter, hung by its flat handle from a cord at the front hip, its hollow stained, still dripping
    f.bone('pelvis');
    const hp = S.at(0.42, 0.86), bc = add(hp, [8, 50]);
    f.line([hp, add(hp, [3, 18]), add(bc, [-2, -28])], 1.6, '#2b2119');
    f.part([add(bc, [-6, -32]), add(bc, [6, -32]), add(bc, [7, -22]), add(bc, [-7, -22])], { fill: '#8a8c88', shade: 0.4, inkW: 1.1, cast: false });
    f.flat(ell(add(bc, [0, -28]), 2.4, 2, 0, 6), '#121010');
    f.part(ell(bc, 15, 24, 0.1, 18), { fill: '#7c7e7a', shade: 0.5, inkW: 1.4, tex: T('mottle'), texOp: 0.5 }); // the convex back of the bowl
    f.part(ell(add(bc, [6, 0]), 8, 21, 0.1, 16), { fill: '#a4a6a0', shade: 0.3, inkW: 1.1, inkHeavy: 1.3, cast: false }); // the rim seen edge-on
    f.part(ell(add(bc, [7, 1]), 5.5, 17, 0.1, 14), { fill: '#4e100b', shade: 0.35, inkW: 0.8, inkHeavy: 1, cast: false }); // the stained hollow
    f.flat(ell(add(bc, [8, 7]), 3, 8, 0.1, 10), '#2a0604', { op: 0.85 });
    f.line([add(bc, [-8, -14]), add(bc, [-11, 0]), add(bc, [-8, 14])], 1, '#c8c8c4', { op: 0.5 }); // lit curve of the back
    f.flat(ell(add(bc, [-12, -16]), 2.4, 3.5, 0, 8), '#2a2a28'); // the rim notch for the arm
    f.flat([add(bc, [2, 23]), add(bc, [6, 23]), add(bc, [4, 34])], '#5a0c08');
    f.flat(ell(add(bc, [4, 40]), 1.6, 2.4, 0, 6), '#5a0c08');
    f.scratches(bc, 10, 3, '#d8d8d4');
  }
  return f;
}
// ------------------------------------------------------------------ ELEMENTALIST (base: dirAC.js elementalist)
// the base's sign() is not exported, so the fire sign is drawn here exactly as the base draws it
function fireSign(f, fx, ink6) {
  const s = f.o.seed, X = (dx, dy) => [fx[0] + dx, fx[1] + dy];
  f.line([X(6, 30), X(0, 22), X(4, 14)], 1.4, '#3a2a40', { op: 0.6 });
  f.raw(`<circle cx="${fx[0]}" cy="${fx[1]}" r="46" fill="#ff9c3a" opacity="0.16" filter="url(#soft${s})"/>`);
  f.flat([X(-10, 26), X(-14, 4), X(-4, -20), X(2, -34), X(6, -14), X(14, 6), X(10, 26)], '#e0662a', { op: 0.95 });
  f.flat([X(-5, 24), X(-6, 6), X(0, -10), X(6, 8), X(5, 24)], '#ffd27a');
  for (const [dx, dy] of [[-8, -40], [10, -46], [2, -54]]) f.flat(ell(X(dx, dy), 2, 1.2, 0.6, 6), '#3a3030', { op: 0.7 });
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + Math.PI / 6 + i * Math.PI / 3, q = add(fx, [Math.cos(a) * 46, Math.sin(a) * 34 - 2]), r = i === 0 ? 5 : 3;
    if (i === 0) f.raw(`<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="${ink6[i]}" opacity="0.3" filter="url(#soft${s})"/>`);
    f.flat(ell(q, r, r, 0, 8), ink6[i]);
  }
}
// a small course glyph in one ink: ring plus the course's stroke (used for the ward sigils and the hood's embroidery)
function glyph(f, c, r, col, k, w = 1.3, o = {}) {
  const e = ell(c, r, r, 0, 12); f.line(e.concat([e[0]]), w, col, o);
  const X = (dx, dy) => add(c, [dx * r, dy * r]);
  const m = [[[X(-0.5, 0.5), X(0, -0.6), X(0.5, 0.5)]], [[X(0, -0.7), X(0, 0.7)], [X(-0.6, 0), X(0.6, 0)]], [[X(-0.3, -0.7), X(0.2, -0.1), X(-0.2, 0.1), X(0.3, 0.7)]], [[X(-0.6, -0.1), X(-0.2, 0.2), X(0.2, -0.2), X(0.6, 0.1)]], [[X(-0.5, -0.5), X(0.5, 0.5)], [X(-0.1, 0.4), X(0.4, -0.1)]], [[X(-0.4, 0), X(0.4, 0)]]][k];
  for (const l of m) f.line(l, w * 0.85, col, Object.assign({ straight: true }, o));
}

// path: 'accumulator' | 'catalyst' | 'prismatic'
function elementalist(path, seed) {
  const f = new Fig(base(seed));
  const T = t => t + seed;
  const AC = path === 'accumulator', CA = path === 'catalyst', PR = path === 'prismatic';
  const H = 94;
  const wool = '#7c705d', woolD = '#5f5546', leather = '#4b3322', skin = '#c4a184', ink6 = ['#b8341f', '#8fb2c9', '#c9a43a', '#2f4f8f', '#7d9a3a', '#4b2a5c'];
  // the upper body turns about the hips: the Accumulator bowed forward under the vessel, the Catalyst drawn back
  const th = AC ? 0.28 : CA ? -0.1 : 0, Q = [266, 486];
  const R = p => add(Q, rot(sub(p, Q), th)), Rp = a => a.map(R);
  const N = AC ? add(R([312, 280]), [-4, 14]) : CA ? add(R([312, 280]), [-6, -8]) : R([312, 280]), C = AC ? add(R([256, 362]), [-30, -6]) : CA ? add(R([256, 362]), [24, 0]) : R([256, 362]), P = [266, 486];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.25, 0.14), SF = S.at(0.42, 0.12);
  // the Catalyst: sign hand lifted to eye level, off hand thrown out from the body mid-ward, book clamped under the far arm
  const EN = CA ? [334, 366] : R([317, 395]), WN = CA ? [392, 286] : R([368, 318]);
  const EF = CA ? [346, 410] : R([350, 425]), WF = CA ? [418, 364] : R([396, 416]);
  const AF = [356, 752], AN = [214, 754], KF = [326, 628], KN = [228, 630], HF = S.at(0.3, 1.0), HN = S.at(-0.2, 1.0);
  const WB = S.at(0, 0.82), dW = S.T(0.82);
  const SG = CA ? add(WN, [26, -48]) : R([394, 270]), BK = CA ? [344, 424] : R([412, 410]);

  f.joint('pelvis', P).joint('torso', S.at(0, 0.85), 'pelvis').joint('head', S.at(0.15, -0.05), 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('book', BK, CA ? 'upperarm_f' : 'hand_f'); // Catalyst: the book is clamped under the far arm, so it hangs from the upper arm
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('sign', SG, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('skirt', WB, 'pelvis').joint('satchel', [268, 568], 'torso');
  if (AC) f.joint('vessel', S.at(-0.7, 0.3), 'torso');

  // ---- Accumulator: the brass vessel rides high on the back, drawn first so the body and straps lie over it
  let VF = null;
  if (AC) {
    const ang = Math.PI / 2 + 0.3; // leaning forward with the bowed back, but nearer upright than the spine: it sits on the shoulders and the small of the back
    VF = frame(S.at(-1.0, 0.42), ang, 1); // local x runs down the back, local -y toward the body
    const brass = '#857750', brassD = '#625836', verd = '#5f7d62';
    f.bone('vessel');
    // ash-wood carrying frame behind it
    for (const y of [-40, 40]) f.part(limb(VF([[-150, y]])[0], VF([[110, y * 0.9]])[0], 9, 9, { steps: 6 }), { fill: '#5a4630', tex: T('wood'), shade: 0.4, inkW: 1.2 });
    const prof = [[-150, 14], [-138, 20], [-122, 22], [-104, 40], [-80, 54], [-40, 60], [10, 60], [50, 54], [76, 46], [86, 48], [92, 40]];
    const body = [...prof.map(([x, y]) => [x, -y]), ...prof.slice().reverse().map(([x, y]) => [x, y])];
    f.part(VF(body), { fill: brass, shade: 0.42, tex: T('mottle'), texOp: 0.35, shadow: '#3e3622', k: 0.9 });
    // verdigris in the seams and under the bands, worn-bright where the hand grabs it
    for (const x of [-78, -6, 62]) {
      f.part(VF([[x - 6, -61], [x + 6, -61], [x + 6, 61], [x - 6, 61]]).map((q, i) => i % 2 ? [...q, 1] : q), { fill: '#4a4438', shade: 0.4, inkW: 1.2, cast: false, sharp: true }); // iron hoops
      for (let k = -2; k <= 2; k++) f.rivet(VF([[x, k * 22]])[0], 2.2, '#8a8a7a');
      f.flat(VF([[x + 7, -30], [x + 11, -28], [x + 10, 30], [x + 7, 36]]), verd, { op: 0.45 });
    }
    f.line(VF([[-100, -34], [-60, -54], [40, -56]]), 1.6, '#d8d0a0', { op: 0.55 }); // the lit shoulder of the brass
    f.flat(VF([[-20, 40], [20, 42], [28, 56], [-14, 58]]), verd, { op: 0.3 });
    f.scratches(VF([[0, -20]])[0], 30, 8, '#e0d8b0');
    f.flat(VF(ell([20, 30], 10, 7, 0, 8)), '#3a3420', { op: 0.5 }); // a dent
    // sight-glass let into the belly: the stored Focus turning inside, six inks marbling in the dark
    const sg = VF([[-50, -30], [24, -30], [24, -12], [-50, -12]]);
    f.part(sg, { fill: '#1a1620', shade: 0.3, inkW: 1.4, sharp: true, cast: false, hatch: false });
    for (let k = 0; k < 6; k++) f.line(VF([[-46 + k * 2, -27 + k * 2.4], [-24 + k * 6, -14 - k * 1.4], [-4 + k * 4, -26 + k], [20, -16 - k * 1.6]]), 1.4, ink6[k], { op: 0.8 });
    f.line(VF([[-48, -26], [20, -26]]), 0.9, '#c8d0d8', { op: 0.5, straight: true });
    for (const q of VF([[-52, -32], [26, -32], [26, -10], [-52, -10]])) f.rivet(q, 2, '#8a8a7a');
    // neck, sealed stopper: lead cap, wax, a twist of cord
    f.part(VF([[-162, -20], [-146, -24], [-146, 24], [-162, 20]]), { fill: '#6a6c6c', shade: 0.4, inkW: 1.3, tex: T('mottle'), texOp: 0.5 });
    f.part(VF([[-170, -12], [-162, -16], [-162, 16], [-170, 12]]), { fill: '#7a2a1c', shade: 0.4, inkW: 1.1, cast: false });
    f.line(VF([[-150, -24], [-150, 24]]), 2.2, '#3a2a1a');
    // a stopcock near the foot, its key tied down
    f.part(VF([[56, -58], [70, -58], [70, -76], [62, -82], [56, -76]]), { fill: brassD, shade: 0.4, inkW: 1.2, cast: false });
    f.part(VF(ell([63, -84], 7, 4, 0, 8)), { fill: brass, shade: 0.4, inkW: 1, cast: false });
    f.flat(VF([[66, -78], [70, -86], [72, -96]]), '#3a2a1a', { op: 0.0 });
    // a drip of ink-dark residue run down from the stopper
    f.stroke(VF([[-140, 22], [-120, 30], [-100, 44], [-80, 52]]), 3, '#2a1a30', { op: 0.7 });
  }

  // far arm
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 36, 30), { fill: woolD, tex: T('weave') });
  f.bone('foot_f');
  { const i0 = f.out.length; B.boot(f, AF, 1, 44, '#3d2d1f', { shaft: 0.3, toe: 1.15, strap: true });
    if (CA) { const g = f.out.splice(i0).join(''), tx = AF[0] + 44 * 1.1; f.raw(`<g transform="rotate(24 ${tx} 788)">${g}</g>`); } } // Catalyst: up on the toes of the front foot
  f.bone('foot_n');
  B.boot(f, AN, 1, 44, '#35271b', { shaft: 0.3, toe: 1.15 });
  // robe
  const prof = [[-0.05, 0.36, 0.34], [0.08, 0.66, 0.5], [0.3, 0.7, 0.72], [0.6, 0.66, 0.72], [0.9, 0.78, 0.74]];
  const robe = [...S.shape(prof).slice(0, 5), [392, 560], [418, 690], [408, 748, 1], [380, 740], [350, 756, 1], [310, 742], [270, 760, 1], [230, 744], [186, 758, 1], [168, 690], [184, 560], ...S.shape(prof).slice(5)];
  split(f, () => f.part(robe, { fill: wool, tex: T('weave'), texOp: 0.5 }), [['skirt', side(S.at(0, 0.66), dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('skirt');
  for (const [a, b2, c] of [[[300, 520], [320, 640], [312, 740]], [[250, 540], [232, 650], [236, 740]], [[350, 560], [378, 660], [386, 740]], [[205, 600], [198, 700], [192, 750]]]) f.line([a, b2, c], 1.5, INK, { op: 0.65 });
  for (let i = 0; i < 6; i++) {
    const x = 194 + i * 37, y = 722 - (i % 2) * 6;
    const ring = ell([x, y], 8, 8, 0, 9).concat([ell([x, y], 8, 8, 0, 9)[0]]);
    f.line(ring, 3.6, '#a89c84', { op: 0.35 });
    f.line(ring, 2, i === 5 ? '#5e3a74' : ink6[i], { op: 0.95 });
    f.line([[x - 6, y + 6], [x + 6, y - 6]], 1.6, i === 5 ? '#5e3a74' : ink6[i], { straight: true });
  }
  f.line([[180, 712], [400, 700]], 1.2, '#2a2016', { op: 0.6 });
  f.line([[176, 742], [404, 730]], 1.2, '#2a2016', { op: 0.6 });
  f.flat([[170, 730], [410, 716], [412, 750], [170, 760]], '#1e160d', { op: 0.45 });
  if (AC) for (const l of [[[220, 480], [206, 520], [200, 560]], [[330, 470], [346, 500], [360, 540]]]) f.stroke(l, 2.2, '#2a2016'); // the robe dragged tight across the bent back and hips

  f.bone('torso');
  const belt = [[-0.8, 0.775], [-0.4, 0.79], [0.0, 0.8], [0.4, 0.8], [0.76, 0.785], [0.76, 0.845], [0.4, 0.86], [0.0, 0.86], [-0.4, 0.85], [-0.81, 0.835]].map(([u, v]) => S.at(u, v));
  f.part(belt.map((q, i) => (i === 0 || i === 4 || i === 5 || i === 9) ? [...q, 1] : q), { fill: '#8a7552', shade: 0.4, tex: T('hatch'), texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 14; i++) f.line([S.at(-0.76 + i * 0.11, 0.785), S.at(-0.71 + i * 0.11, 0.85)], 1, INK, { op: 0.55, straight: true });
  const kn = S.at(0.42, 0.83);
  f.part(ell(kn, 9, 8, 0.3, 10), { fill: '#7c6848', shade: 0.45, tex: T('hatch'), texOp: 0.5 });
  f.stroke([add(kn, [-2, 4]), add(kn, [-8, 40]), add(kn, [-4, 84])], 6, '#7c6848');
  f.stroke([add(kn, [3, 4]), add(kn, [8, 34]), add(kn, [12, 66])], 5.5, '#6e5c3e');
  for (const e of [add(kn, [-4, 84]), add(kn, [12, 66])]) for (let k = -1; k <= 1; k++) f.line([e, add(e, [k * 3, 9])], 1, '#8a7552');
  f.line([S.at(0.2, 0.84), [300, 560], [296, 600]], 2.2, '#8a7552');
  f.part(ell([296, 616], 16, 16, 0, 14), { fill: '#a5713a', shade: 0.5, inkW: 1.3 });
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; f.part(ell(add([296, 616], [Math.cos(a) * 12, Math.sin(a) * 12]), 3, 3, 0, 6), { fill: ink6[i], shade: 0.3, inkW: 0.8 }); }
  f.part(ell([296, 616], 6, 6, 0, 8), { fill: '#6b4520', shade: 0.4, inkW: 1 });
  const strap = [S.at(0.35, 0.05), S.at(-0.2, 0.4), S.at(-0.72, 0.8), [262, 540], [268, 568]];
  f.line(strap, 6, '#3a2618');
  f.line(strap, 1, '#7a5a3a', { op: 0.6, dash: '3 3' });
  f.bone('satchel');
  f.line([[176, 572], [180, 530], S.at(-0.86, 0.88)], 6, '#2e1e12');
  f.bone('torso');
  if (AC) {
    // the vessel's harness: two broad straps over the shoulders and one round the waist, buckled, biting into the wool
    const st = (pts, w) => { f.line(pts, w + 2.4, INK); f.line(pts, w, '#4a3020'); f.line(pts, 1, '#8a6a48', { op: 0.6, dash: '3 3' }); };
    st([VF([[-110, 40]])[0], S.at(-0.4, -0.08), S.at(0.1, -0.02), S.at(0.5, 0.14), S.at(0.55, 0.36), S.at(0.3, 0.55), S.at(-0.6, 0.58)], 8);
    st([VF([[60, 50]])[0], S.at(-0.8, 0.7), S.at(-0.2, 0.72), S.at(0.6, 0.7)], 7);
    for (const q of [S.at(0.53, 0.26), S.at(0.2, 0.71)]) { f.part(ell(q, 6, 7, 0, 8), { fill: '#6a6a60', shade: 0.4, inkW: 1.1, cast: false }); f.line([add(q, [-3, 0]), add(q, [3, 0])], 1.4, INK, { straight: true }); }
    for (const l of [[[0.1, 0.0], [0.05, 0.1]], [[0.45, 0.12], [0.36, 0.2]]]) f.stroke(l.map(([u, v]) => S.at(u, v)), 2, '#2a2016'); // wool bunched under the strap
  }
  const rk = R([212, 468]);
  f.part([add(rk, [-7, -6]), add(rk, [7, -9]), add(rk, [8, 4]), add(rk, [-6, 7])], { fill: '#8e1f17', shade: 0.4, inkW: 1.1, cast: false });
  f.part([add(rk, [-2, 4]), add(rk, [-10, 34]), add(rk, [-4, 38]), add(rk, [4, 6])], { fill: '#8e1f17', shade: 0.4, inkW: 1.1 });
  f.part([add(rk, [3, 4]), add(rk, [10, 26]), add(rk, [15, 24]), add(rk, [7, 3])], { fill: '#6e1610', shade: 0.4, inkW: 1.1 });
  f.bone('satchel');
  for (let i = 0; i < 4; i++) f.part(limb([172 + i * 14, 545 - i * 3], [184 + i * 12, 600], 13, 13, { steps: 4 }), { fill: '#d1c09a', shade: 0.4, inkW: 1.1 });
  f.part([[140, 570], [240, 566], [246, 650], [232, 666], [150, 668], [136, 650]].map(q => add(q, [22, 0])), { fill: leather, shade: 0.45, tex: T('mottle'), k: 0.6 });
  f.part([[136, 566], [244, 562], [240, 610], [190, 622], [140, 606]].map(q => add(q, [22, 0])), { fill: '#3e2a1b', shade: 0.4, k: 0.6 });
  f.rivet([212, 612], 3, '#a08a5a');
  f.part([[260, 562], [276, 562], [276, 578], [260, 578]], { fill: '#6a5a3a', shade: 0.3, inkW: 1, cast: false });
  f.bone('torso');
  f.line([S.at(-0.28, 0.85), S.at(-0.26, 0.92)], 1.2, '#2b2119');
  G.badge(f, S.at(-0.26, 0.92), 10, '#74777b', -0.06);
  f.bone('satchel');
  f.stitches([[168, 650], [258, 648]]);
  f.spatter([232, 640], 18, 6, '#2f4f8f');

  // hood: down on the back (base), or up over the coif with the six sigils worked round it (Prismatic)
  f.bone('torso');
  if (!PR && !CA) {
    f.part([S.at(-0.55, -0.12), S.at(-0.1, -0.16), S.at(0.45, -0.04), S.at(0.55, 0.14), S.at(0.3, 0.24), S.at(0.0, 0.2), S.at(-0.4, 0.34), S.at(-0.78, 0.3), S.at(-0.85, 0.1)], { fill: woolD, tex: T('weave'), k: 0.7 });
    f.stroke([S.at(-0.5, 0.0), S.at(-0.3, 0.12), S.at(-0.2, 0.28)], 2.2);
    f.stroke([S.at(0.0, -0.05), S.at(0.15, 0.08), S.at(0.25, 0.2)], 2);
  } else if (PR) {
    // the hood's fall over the shoulders, cut to sit under the up-turned hood
    f.part([S.at(-0.6, -0.04), S.at(0.0, -0.1), S.at(0.5, 0.0), S.at(0.6, 0.16), S.at(0.3, 0.26), S.at(0.0, 0.22), S.at(-0.4, 0.32), S.at(-0.8, 0.26), S.at(-0.85, 0.08)], { fill: woolD, tex: T('weave'), k: 0.7 });
    f.stroke([S.at(-0.5, 0.06), S.at(-0.3, 0.16), S.at(-0.2, 0.28)], 2.2);
  }
  const HC = AC ? add(R([338, 232]), [-4, 6]) : R([338, 232]), hA = CA ? 0.04 : 0.4 + th + (AC ? -0.06 : 0); // Catalyst: chin up, looking level along the arm at the sign
  const cF = frame(HC, hA, H);
  f.bone('head');
  if (PR) {
    // hood shell behind the head
    f.part(cF([[-0.7, 0.62], [-0.78, 0.0], [-0.6, -0.52], [-0.22, -0.76], [0.2, -0.72], [0.46, -0.5], [0.42, -0.2], [0.0, 0.2], [-0.3, 0.66]]), { fill: mix(woolD, '#000', 0.1), tex: T('weave'), k: 0.8 });
  }
  f.part(limb(S.at(0.15, -0.05), add(HC, [-6, 28]), 26, 24), { fill: skin, shade: 0.5 });
  B.head(f, HC, H, hA, {
    skin, jaw: 0.92, chin: -0.01, nose: 1.12, hook: 0.3, mouth: CA ? 'grim' : 'set', squint: CA ? 0.0 : PR ? 0.55 : 0.05, browDown: CA ? -0.05 : -0.02, gaunt: true, age: true, glint: !PR,
    iris: PR ? '#b4b0a6' : '#2a1d10', eyeWhite: PR ? '#a89e8c' : undefined, hairCol: CA ? '#8d8272' : '#8a8170', beard: 'stubble', beardCol: '#6a6258', browCol: '#5a544a', noEar: !CA,
    hair: CA ? [[-0.44, 0.12], [-0.42, -0.24], [-0.22, -0.5], [0.06, -0.55], [0.26, -0.46], [0.3, -0.36], [0.14, -0.38], [0.04, -0.3], [-0.06, -0.16], [-0.1, -0.08], [-0.17, -0.13], [-0.27, -0.1], [-0.3, 0.02], [-0.32, 0.16]] : [[-0.42, 0.0], [-0.38, -0.36], [-0.14, -0.57], [0.14, -0.57], [0.33, -0.42], [0.31, -0.3], [0.12, -0.36], [0.0, -0.3], [-0.06, -0.12], [-0.04, 0.12], [-0.02, 0.36], [-0.12, 0.42], [-0.3, 0.36], [-0.42, 0.2]],
  });
  if (!CA) {
  f.line(cF([[-0.15, -0.55], [-0.2, -0.2], [-0.24, 0.3]]), 1.2, INK, { op: 0.6 });
  f.stitches(cF([[-0.13, -0.5], [-0.17, -0.2], [-0.21, 0.28]]), '#d8cbb0', 0.8);
  for (const l of [[[0.02, -0.33], [0.1, -0.24], [0.06, -0.14]], [[-0.02, -0.28], [0.04, -0.16], [0.0, -0.06]]]) f.line(cF(l), 1.1, '#9a948a', { op: 0.85 });
  f.flat(cF(ell([0.02, 0.2], 0.06, 0.05, 0.2, 8)), '#3a1d24', { op: 0.3 });
  f.stroke(cF([[-0.06, 0.38], [0.04, 0.52], [0.1, 0.6]]), 3.4, '#8a8170');
  f.stroke(cF([[0.08, 0.56], [0.06, 0.72], [0.0, 0.82]]), 3, '#7a7262');
  } else {
    // close-cropped scalp: stubble grain following the skull, a nick, the skull's planes showing through
    for (let i = 0; i < 60; i++) { const u = -0.4 + f.r() * 0.62, v = -0.5 + f.r() * 0.42; if (u * u * 1.6 + (v + 0.12) * (v + 0.12) > 0.17) continue; const q = cF([[u, v]])[0]; f.line([q, add(q, rot([2.2, 0], hA + 2.4 + u))], 0.8, '#2e2a24', { op: 0.7, straight: true }); }
    f.line(cF([[-0.36, -0.2], [-0.2, -0.44], [0.06, -0.5]]), 1, '#b8ac98', { op: 0.5 }); // lit crown
    f.line(cF([[-0.2, -0.3], [-0.14, -0.26]]), 1.2, '#7a3a2a', { op: 0.8 }); // razor nick
  }
  f.flat(cF(ell([0.12, 0.03], 0.07, 0.025, 0.1, 8)), '#3a1d24', { op: 0.35 });
  f.line(cF([[0.08, 0.13], [0.2, 0.17]]), 2, '#2f4f8f', { op: 0.7 });
  if (PR) {
    // the clouded eye: a milky film over the iris, the lid hanging lower over it; small, under the brow
    f.flat(cF(ell([0.132, -0.056], 0.022, 0.012, 0, 8)), '#c8c6be', { op: 0.75 });
    f.flat(cF(ell([0.14, -0.054], 0.01, 0.008, 0, 6)), '#9aa4aa', { op: 0.5 });
    f.line(cF([[0.06, -0.064], [0.11, -0.074], [0.165, -0.066]]), 2, INK);
  }
  if (CA) {
    // ward sigils inked on the face: a ring-and-bar on the brow, three ticks under the eye, a line down the jaw
    // a chain of wards from the temple up over the scalp, and down the side of the neck to the collar
    const chainS = [[0.1, -0.3], [-0.02, -0.4], [-0.16, -0.46], [-0.3, -0.38]], ch = cF(chainS);
    f.line(ch, 1.3, '#4b2a5c', { op: 0.9 });
    ch.forEach((c, k) => glyph(f, c, 5.2, ink6[[5, 0, 3, 1][k]], [5, 0, 3, 1][k], 1.8));
    const n0 = cF([[-0.12, 0.3]])[0], n1 = S.at(0.12, -0.02), nk = [n0, lerp(n0, n1, 0.5), n1];
    f.line(nk, 1.3, '#4b2a5c', { op: 0.9 });
    glyph(f, lerp(n0, n1, 0.2), 4.6, ink6[4], 4, 1.6); glyph(f, lerp(n0, n1, 0.65), 4.6, ink6[2], 2, 1.6);
    for (let k = 0; k < 3; k++) f.line(cF([[0.08 + k * 0.05, 0.04], [0.1 + k * 0.05, 0.1]]), 1.3, ink6[3], { straight: true });
    f.line(cF([[-0.08, 0.14], [-0.04, 0.3], [0.06, 0.42]]), 1.3, ink6[4], { op: 0.9 });
    f.flat(cF(ell([0.24, 0.0], 0.02, 0.015, 0, 6)), '#d8e4ea', { op: 0.6 }); // a bead of sweat
  }
  if (CA) {
    // the hood pushed back off the head: a fallen cowl bunched round the neck, its empty bag hanging down the back
    f.bone('torso');
    const cw = [S.at(0.5, -0.03), S.at(0.66, 0.08), S.at(0.6, 0.2), S.at(0.38, 0.24), S.at(0.1, 0.2), S.at(-0.3, 0.32), S.at(-0.6, 0.48), [...S.at(-0.82, 0.5), 1], S.at(-0.98, 0.34), S.at(-0.92, 0.1), S.at(-0.66, -0.06), S.at(-0.3, -0.1), S.at(0.1, -0.06)];
    f.part(cw, { fill: woolD, tex: T('weave'), texOp: 0.5, k: 0.8, shadow: '#2a2418' });
    f.stroke([S.at(0.48, 0.02), S.at(0.3, 0.1), S.at(0.0, 0.08), S.at(-0.3, 0.04)], 2.6, '#241e14'); // the roll's under-fold
    f.stroke([S.at(-0.5, 0.06), S.at(-0.62, 0.22), S.at(-0.7, 0.4)], 2.2, '#241e14');
    f.stroke([S.at(-0.82, 0.12), S.at(-0.88, 0.28)], 1.8, '#241e14');
    f.line([S.at(-0.6, -0.04), S.at(0.0, -0.06), S.at(0.45, 0.0)], 1.1, '#a89a80', { op: 0.6 }); // lit top of the roll
    f.line([S.at(-0.78, 0.46), S.at(-0.92, 0.32)], 1, '#cfc3a8', { op: 0.5, dash: '2 2' }); // frayed hood rim
    f.bone('head');
  }
  if (PR) {
    // hood front: deep shadow inside, then the rim framing the face
    f.flat(cF([[-0.3, -0.44], [-0.06, -0.52], [0.24, -0.46], [0.36, -0.34], [0.12, -0.38], [-0.14, -0.34], [-0.22, 0.0], [-0.18, 0.36], [-0.32, 0.42], [-0.38, 0.0]]), '#120e0c', { op: 0.85 });
    const rim = [[0.52, -0.32, 1], [0.46, -0.52], [0.2, -0.74], [-0.22, -0.78], [-0.62, -0.54], [-0.78, 0.0], [-0.74, 0.52], [-0.62, 0.92], [-0.2, 1.02], [0.2, 0.88], [0.32, 0.7, 1], [0.16, 0.62], [-0.08, 0.5], [-0.22, 0.3], [-0.28, 0.0], [-0.24, -0.32], [-0.08, -0.5], [0.14, -0.52], [0.36, -0.4]];
    f.part(cF(rim), { fill: woolD, tex: T('weave'), texOp: 0.5, shadow: '#2a2418' });
    for (const l of [[[0.1, 0.72], [-0.1, 0.84], [-0.4, 0.86]], [[-0.3, 0.5], [-0.5, 0.62], [-0.56, 0.84]], [[-0.66, -0.2], [-0.7, 0.1], [-0.66, 0.4]]]) f.stroke(cF(l), 2, '#2a2418');
    // six course sigils embroidered in a ring round the face, linked by a couched thread: a halo of the Courses
    const hc = [0.0, -0.02], hr = 0.56, angs = [-62, -98, -134, -170, -206, -242];
    const arc = []; for (let a = -50; a >= -254; a -= 8) arc.push(cF([[hc[0] + Math.cos(a * Math.PI / 180) * hr, hc[1] + Math.sin(a * Math.PI / 180) * hr * 1.08]])[0]);
    f.line(arc, 2.6, '#3a3022', { op: 0.6 }); f.line(arc, 1.4, '#b8ab8a', { dash: '2 1.6' });
    angs.forEach((a, k) => {
      const c = cF([[hc[0] + Math.cos(a * Math.PI / 180) * hr, hc[1] + Math.sin(a * Math.PI / 180) * hr * 1.08]])[0];
      f.part(ell(c, 8.5, 8.5, 0, 14), { fill: mix(woolD, '#000', 0.25), shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
      glyph(f, c, 6.2, ink6[k], k, 2.2);
      glyph(f, add(c, [-0.6, -0.6]), 6.2, mix(ink6[k], '#fff', 0.35), k, 0.7, { op: 0.7 }); // the thread's sheen
    });
  }

  // far forearm and the book
  if (CA) {
    // the book shut and clamped in the crook of the far elbow against the belly
    f.bone('book');
    const BKF = frame(BK, -0.35, 1);
    f.part(BKF([[-26, -32], [24, -36], [28, 30], [-22, 34]]), { fill: '#5a2a1c', sharp: true, tex: T('mottle'), shade: 0.4 });
    f.part(BKF([[24, -36], [33, -32], [37, 28], [28, 30]]), { fill: '#dccaa0', sharp: true, shade: 0.25, inkW: 1.1 }); // page edges
    for (let k = 1; k < 3; k++) f.line(BKF([[24 + k * 3, -35], [28 + k * 3, 29]]), 0.7, '#7a6a48', { op: 0.7, straight: true });
    f.line(BKF([[-20, -26], [18, -29], [22, 24], [-16, 28], [-20, -26]]), 1, '#2a120a', { straight: true, op: 0.8 });
    f.line(BKF([[0, 30], [-4, 44], [2, 52]]), 2, '#b8341f'); // ribbon marker hanging out
  }
  f.bone('forearm_f');
  if (CA) {
    // sleeve shoved up to the elbow: a thick roll of wool, then the bare thin forearm written over with wards
    f.part(limb(EF, WF, 30, 22, { p: [[0.35, 0.18, 0.2]], q: [[0.6, -0.12, 0.15]] }), { fill: skin, shade: 0.45, tex: T('mottle'), texOp: 0.4 });
    f.part(limb(lp(EF, WF, 0.6), add(WF, [2, -1]), 20, 17), { fill: mix(skin, '#2f4f8f', 0.25), shade: 0.45, tex: T('mottle'), cast: false });
    for (let k = 0; k < 3; k++) glyph(f, lp(EF, WF, 0.24 + k * 0.17, k % 2 ? -2 : 2), 5.4, ink6[(k * 2) % 6], (k * 2) % 6, 1.8);
    f.line([lp(EF, WF, 0.12, 10), lp(EF, WF, 0.6, 9)], 1, ink6[5], { op: 0.8 });
    f.part(plate(EF, WF, -0.12, 0.16, 38, 34, { bow: 3 }), { fill: woolD, tex: T('weave'), shade: 0.45 }); // the rolled sleeve: a thick band of turned-back wool
    f.line([lp(EF, WF, 0.02, 17), lp(EF, WF, 0.04, -16)], 1.6, '#2a2016', { op: 0.8 });
  } else {
    f.part(limb(EF, WF, 32, 24, { folds: [[0.3, 'q', 0.25]] }), { fill: woolD, tex: T('weave') });
    f.part(limb(lp(EF, WF, 0.7), add(WF, [2, -1]), 18, 16), { fill: mix(skin, '#2f4f8f', 0.25), shade: 0.45, tex: T('mottle'), cast: false });
  }
  const sT = R([420, 312]), sB = R([432, 398]);
  if (!CA) {
  f.bone('book');
  const cT = R([380, 322]), cB = R([390, 406]);
  f.part(Rp([[360, 330], [374, 324], [384, 408], [370, 412]]), { fill: '#3a1a10', sharp: true, inkW: 1.3 });
  f.part(Rp([[372, 324], [384, 320], [394, 406], [382, 408]]), { fill: '#dccaa0', sharp: true, shade: 0.25, inkW: 1.2 });
  for (let k = 1; k < 4; k++) f.line(Rp([[372 + k * 3, 324 - k], [382 + k * 3, 408 - k * 0.5]]), 0.8, '#7a6a48', { op: 0.75, straight: true });
  f.part(Rp([[374, 318], [416, 308], [422, 314], [384, 322]]), { fill: '#e4d6b0', sharp: true, shade: 0.2, inkW: 1.1 });
  f.part([cT, sT, sB, cB], { fill: '#5a2a1c', sharp: true, tex: T('mottle'), shade: 0.4 });
  f.line(Rp([add([380, 322], [6, 6]), add([420, 312], [-6, 6]), add([432, 398], [-6, -6]), add([390, 406], [6, -6]), add([380, 322], [6, 6])]), 1.1, '#2a120a', { straight: true, op: 0.8 });
  f.flat(ell(lerp(lerp(cT, sT, 0.5), lerp(cB, sB, 0.5), 0.5), 9, 12, 0.12 + th, 10), '#3a160c', { op: 0.7 });
  for (const [c0, sg] of [[[380, 322], 1], [[390, 406], -1]]) f.part(Rp([c0, add(c0, [10, -2]), add(c0, [11, sg * 10]), add(c0, [1, sg * 12])]), { fill: '#6e6a62', sharp: true, inkW: 1 });
  f.part(Rp([[420, 312], [430, 314], [442, 396], [432, 398]]), { fill: '#4a2216', sharp: true, shade: 0.35, inkW: 1.3 });
  for (let k = 0; k < 4; k++) { const a = lerp([420, 312], [432, 398], 0.15 + k * 0.23); f.line(Rp([a, add(a, [11, 1])]), 2.4, '#2a120a', { straight: true }); }
  f.line(Rp([[386, 322], [380, 352], [386, 376], [380, 398]]), 2, '#b8341f');
  f.part(Rp([[384, 318], [396, 284], [410, 278], [404, 314]]), { fill: '#e6d9b8', shade: 0.3, inkW: 1 });
  }
  f.bone('hand_f');
  if (CA) B.hand(f, WF, -0.85, 21, mix(skin, '#2f4f8f', 0.15), { spread: 0.85, curl: 0.12, fingerCols: [mix(skin, ink6[5], 0.4), mix(skin, ink6[4], 0.4), mix(skin, ink6[3], 0.4), mix(skin, ink6[2], 0.4)], tipCols: [ink6[5], ink6[4], ink6[3], ink6[2]], thumbTip: ink6[1] }); // thrown out mid-ward, fingers splayed
  else B.hand(f, R([412, 414]), -0.22 + th, 20, skin, { spread: 0.15, curl: -0.55, tipCols: [ink6[3], ink6[4], ink6[5], ink6[5]] });

  // near arm
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 40, 36, { p: [[0.5, 0.18, 0.2]], q: [[0.3, 0.1, 0.2]], folds: [[0.85, 'q', 0.3], [0.45, 'p', 0.2]] }), { fill: wool, tex: T('weave') });
  f.stroke([lp(SN, EN, 0.6, -14), lp(SN, EN, 0.72, -2), lp(SN, EN, 0.86, 8)], 2);
  f.bone('forearm_n');
  if (CA) {
    // bare forearm with the ward sigils written up it in all six inks; the rolled sleeve sits at the elbow
    const fd = f.part(limb(EN, WN, 30, 20, { p: [[0.3, 0.2, 0.2]], q: [[0.55, -0.1, 0.15]] }), { fill: skin, shade: 0.45, tex: T('mottle'), texOp: 0.4 });
    f.line([lp(EN, WN, 0.15, -6), lp(EN, WN, 0.8, -4)], 1, mix(skin, '#000', 0.4), { op: 0.5 }); // the ulna's edge
    for (let k = 0; k < 4; k++) glyph(f, lp(EN, WN, 0.2 + k * 0.16, k % 2 ? 3 : -2), 5.6, ink6[k + 1], k + 1, 1.9);
    f.line([lp(EN, WN, 0.1, 9), lp(EN, WN, 0.5, 10), lp(EN, WN, 0.9, 8)], 1.1, ink6[0], { op: 0.9 });
    f.line([lp(EN, WN, 0.12, -10), lp(EN, WN, 0.72, -9)], 1, ink6[5], { op: 0.85, dash: '4 2' });
    f.part(limb(lp(EN, WN, 0.82), WN, 18, 16), { fill: mix(skin, '#2f4f8f', 0.35), shade: 0.45, tex: T('mottle'), cast: false });
    f.part(plate(EN, WN, -0.14, 0.2, 42, 36, { bow: 3 }), { fill: wool, tex: T('weave'), shade: 0.45 }); // the rolled sleeve: a thick band of turned-back wool
    f.line([lp(EN, WN, 0.0, 19), lp(EN, WN, 0.03, -18)], 1.8, '#2a2016', { op: 0.8 });
    f.line([lp(EN, WN, 0.1, 18), lp(EN, WN, 0.13, -17)], 1.2, '#2a2016', { op: 0.6 });
  } else {
    const sleeve = [lp(EN, WN, -0.08, 18), lp(EN, WN, 0.4, 19), lp(EN, WN, 0.78, 21), [WN[0] - 10, WN[1] - 20, 1], [WN[0] - 4, WN[1] + 4], [WN[0] - 14, WN[1] + 36], [WN[0] - 26, WN[1] + 66, 1], [WN[0] - 52, WN[1] + 72], [EN[0] + 26, EN[1] + 44], [EN[0] - 2, EN[1] + 20], lp(EN, WN, -0.12, -14)];
    f.part(sleeve, { fill: wool, tex: T('weave'), k: 0.8 });
    f.flat([[WN[0] - 10, WN[1] - 16], [WN[0] - 5, WN[1] + 4], [WN[0] - 14, WN[1] + 32], [WN[0] - 20, WN[1] + 10]], '#1a1410', { op: 0.85 });
    f.stroke([[EN[0] + 20, EN[1] + 12], [EN[0] + 46, EN[1] + 40], [WN[0] - 40, WN[1] + 62]], 2.2);
    f.stroke([[EN[0] + 40, EN[1] + 4], [WN[0] - 36, WN[1] + 22], [WN[0] - 28, WN[1] + 50]], 1.8);
    f.line([[WN[0] - 50, WN[1] + 70], [WN[0] - 28, WN[1] + 64]], 1, '#cfc3a8', { op: 0.5, dash: '2 2' });
    f.flat(ell([WN[0] - 30, WN[1] + 46], 7, 4, 0.4, 8), '#2f4f8f', { op: 0.5 });
    f.part(limb(lp(EN, WN, 0.82), WN, 20, 18), { fill: mix(skin, '#2f4f8f', 0.35), shade: 0.45, tex: T('mottle'), cast: false });
  }
  f.bone('sign');
  fireSign(f, SG, ink6);
  f.bone('hand_n');
  B.hand(f, WN, CA ? -0.95 : -0.78 + th, 24, skin, { spread: CA ? 0.75 : 0.45, curl: CA ? 0.3 : 0.5, fingerCols: [mix(skin, ink6[0], 0.5), mix(skin, ink6[1], 0.5), mix(skin, ink6[2], 0.5), mix(skin, ink6[3], 0.5)], tipCols: [ink6[0], ink6[1], ink6[2], ink6[3]], thumbTip: ink6[4] });
  return f;
}

const PATHS = [
  ['bulwark', 'last_bastion', 'The Last Bastion', bulwark, 7100],
  ['bulwark', 'ironwarden', 'The Ironwarden', bulwark, 7101],
  ['bulwark', 'thornguard', 'The Thornguard', bulwark, 7102],
  ['duelist', 'bladedancer', 'The Bladedancer', duelist, 7103],
  ['duelist', 'executioner', 'The Executioner', duelist, 7104],
  ['duelist', 'bloodletter', 'The Bloodletter', duelist, 7105],
  ['elementalist', 'accumulator', 'The Accumulator', elementalist, 7106],
  ['elementalist', 'catalyst', 'The Catalyst', elementalist, 7107],
  ['elementalist', 'prismatic', 'The Prismatic', elementalist, 7108],
];

module.exports = {
  heroes: PATHS.map(([calling, path, name, fn, seed]) => ({ key: `${calling}_${path}`, name, tier: 'human', w: 600, h: 820, flip: false, build: () => fn(path, seed) })),
  along, rope, ropeEnd, icicle, icicles, rime, frostDust, barb, leadPatch,
};
