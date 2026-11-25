// A+C expansion: the other three callings, the Drowned Thrall (foe) and Mother Hild (keeper).
// A's heavy 6.4-head bodies and lived-in posture, C's Living Ink rendering.
'use strict';
const E = require('./engine');
const B = require('./body');
const G = require('./gear');
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { split, side } = require('./dirAC'); // rig helpers: cut one shape that spans a joint between two bones

const INK = '#1a120c';
const base = (seed, o = {}) => Object.assign({ mode: 'ink', seed, ink: INK, shadowTint: '#2a1f2a', keyTint: '#fff3d8', rim: null, grimeY: 640, groundY: 790, mud: '#3a2a18', wobble: 1.8, inkW: 1.6, inkHeavy: 3.6 }, o);
const ring = (f, c, rx, ry, w, col, o = {}) => { const e = ell(c, rx, ry, o.ang || 0, 14); f.line(e.concat([e[0]]), w, col, o); };
const rubric = '#9a2a1e';

// a soft tube along a polyline with no caps at the joints (sleeves, trouser legs, bare limbs).
// pts: joint points, ws: width at each joint, o.bp/o.bq: [[segment, t, amp]] bulges on the P (+normal) / Q side.
function chain(pts, ws, o = {}) {
  const P = [], Q = [], n = o.steps || 8;
  const samples = [];
  for (let s = 0; s < pts.length - 1; s++) for (let i = 0; i <= n; i++) { if (s > 0 && i === 0) continue; const t = i / n; samples.push({ c: lerp(pts[s], pts[s + 1], t), w: ws[s] + (ws[s + 1] - ws[s]) * t, s, t }); }
  samples.forEach((q, i) => {
    const a = samples[Math.max(0, i - 1)].c, b = samples[Math.min(samples.length - 1, i + 1)].c, d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
    const bump = arr => (arr || []).reduce((acc, [bs, bt, amp, sg]) => acc + (bs === q.s ? amp * Math.exp(-((q.t - bt) ** 2) / (2 * (sg || 0.2) ** 2)) : 0), 0);
    P.push(add(q.c, mul(nn, q.w / 2 * (1 + bump(o.bp))))); Q.push(add(q.c, mul(nn, -q.w / 2 * (1 + bump(o.bq)))));
  });
  return [...P, ...Q.reverse()];
}
// a limb whose far end is a ragged, torn or frayed hem instead of a round cap (rolled or torn sleeves)
function ragLimb(f, a, b, wa, wb, o = {}) {
  const steps = 10, pts = limb(a, b, wa, wb, Object.assign({ steps }, o, { capB: false }));
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], rag = [], k = o.teeth || 5;
  for (let i = 1; i < k; i++) { const u = wb / 2 - wb * i / k; rag.push([...add(add(b, mul(n, u)), mul(d, (i % 2 ? 1 : -0.3) * (o.depth || 9) * (0.6 + f.r() * 0.6))), 1]); }
  return [...pts.slice(0, steps + 1), ...rag, ...pts.slice(steps + 1)];
}
// bare lower leg and foot in one outline: calf, shin, ankle, Achilles, heel, arch, ball, big toe. dir +1 = toes right.
// top: centre of the leg where it leaves the cloth, wt: width there; s: foot length unit. Returns the outline.
function bareLeg(f, top, ankle, dir, s, wt, look, o = {}) {
  const gy = f.o.groundY, ax = ankle[0], ay = ankle[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir * u * s;
  const d = E.norm(sub(ankle, top)), nn = [d[1] * dir, -d[0] * dir];
  const at = (t, off) => add(lerp(top, ankle, t), mul(nn, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    at(0, wt / 2), at(0.35, wt * 0.46), at(0.7, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    at(0.72, -(wa * 0.62 + 2)), at(0.32, -wt * 0.5 * (1.14 + sw * 0.1)), at(0, -wt / 2),
  ];
  // far toes peeking past the big toe
  for (let i = 3; i >= 1; i--) { const tx = 1.0 - i * 0.075; f.part([[X(tx - 0.12), gy - h * (0.3 + i * 0.02)], [X(tx + 0.05), gy - h * (0.32 + i * 0.02)], [X(tx + 0.13), gy - h * 0.14], [X(tx + 0.1), gy - 1], [X(tx - 0.08), gy - 1]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.5, fill: mix(look.fill, '#2a2030', 0.15) })); }
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const ink = f.o.ink, dk = mix(look.fill, '#2a1c22', 0.5), lt = mix(look.fill, '#fff', 0.35);
  // anatomy lines: shin edge, ankle knob, Achilles, instep tendon, toe crease, nail
  f.line([at(0.1, wt * 0.3), at(0.5, wt * 0.3), at(0.8, wa * 0.4)], 1, lt, { op: 0.5 });
  f.line([[X(-0.06), ay + h * 0.2], [X(0.05), ay + h * 0.12], [X(0.12), ay + h * 0.26]], 1.1, ink, { op: 0.5 });
  f.line([[X(-0.25), ay - h * 0.1], [X(-0.27), gy - h * 0.42]], 1, dk, { op: 0.7 });
  f.line([[X(0.36), ay + h * 0.36], [X(0.64), gy - h * 0.5], [X(0.9), gy - h * 0.38]], 1, lt, { op: 0.6 });
  f.part([[X(1.0), gy - h * 0.35], [X(1.13), gy - h * 0.3], [X(1.23), gy - h * 0.18], [X(1.24), gy - h * 0.07], [X(1.13), gy - h * 0.05], [X(1.03), gy - h * 0.15]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.4, cast: false, shade: 0.35 }));
  f.flat([[X(1.13), gy - h * 0.27], [X(1.21), gy - h * 0.19], [X(1.22), gy - h * 0.11], [X(1.14), gy - h * 0.15]], o.nail || mix(look.fill, '#e8e0cc', 0.5), { op: 0.9 });
  f.line([[X(0.92), gy - 2], [X(1.02), gy - h * 0.13]], 1, ink, { op: 0.6 });
  f.line([[X(-0.18), gy - 2], [X(0.06), gy - 2]], 1.6, dk, { op: 0.6, straight: true });
  if (sw > 0) for (let i = 0; i < 3; i++) f.line([[X(0.46 + i * 0.13), gy - h * (0.42 - i * 0.05)], [X(0.5 + i * 0.13), gy - h * (0.28 - i * 0.05)]], 0.9, ink, { op: 0.45 });
  return pts;
}

// ------------------------------------------------------------------ ALCHEMIST: "The Brewer"
// Stocky distiller, fist on the hip, head tipped back squinting at a flask he holds up by the neck.
// A copper pot still rides on his back; a bandolier of glass crosses a barrel chest; waxed apron to mid-shin.
function alchemist() {
  const f = new Fig(base(51));
  const H = 96;
  const apron = '#57452c', apronD = '#3e301e', shirt = '#ada188', glove = '#3e2a1a', breech = '#4a3f33', copper = '#74462a', skin = '#c99a76', skinS = '#7a4a3e';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: 'mottle51', texOp: 0.4 }, o);
  const SHT = (o = {}) => Object.assign({ fill: shirt, tex: 'weave51', texOp: 0.5 }, o);
  const SN = [252, 306], EN = [206, 404], WN = [254, 472];
  const SF = [346, 300], EF = [468, 231], GF = [404, 160], WF = lerp(GF, EF, 0.16); // far arm reaches forward and up: elbow out in front, fist on the flask neck above eye level
  const KN = [242, 628], AN = [226, 746], KF = [338, 624], AF = [354, 746];
  const HNp = [254, 520], HFp = [322, 524];
  const knee = (H0, K, A) => E.norm(add(E.norm(sub(K, H0)), E.norm(sub(A, K)))); // cut square to the bisector of the bend
  const ankle = (K, A) => add(E.norm(sub(A, K)), [0.6, 0]); // ankle cut: the instep goes with the foot
  const apC = [312, 488], apD = E.norm(rot([392 - 232, 476 - 488], Math.PI / 2)); // apron string: the apron skirt hangs from it

  // skeleton: pelvis is the root; the still rides on the torso, the apron skirt swings from the apron string
  f.joint('pelvis', [290, 515]).joint('torso', [300, 490], 'pelvis').joint('head', [306, 296], 'torso').joint('still', [240, 252], 'torso').joint('apron', apC, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('flask', GF, 'hand_f');
  f.joint('thigh_f', HFp, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HNp, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');

  // ---- the pot still on his back: riveted copper boiler, coiled worm below, swan neck over the shoulder
  const st = [204, 262];
  f.bone('still');
  f.part([[st[0] - 34, st[1] + 10], [st[0] - 30, st[1] - 24], [st[0] - 4, st[1] - 40], [st[0] + 30, st[1] - 32], [st[0] + 42, st[1] + 4], [st[0] + 44, st[1] + 120], [st[0] + 30, st[1] + 136], [st[0] - 20, st[1] + 138], [st[0] - 38, st[1] + 120]], { fill: copper, tex: 'mottle51', texOp: 0.55, shadow: '#3a1a0c' });
  for (let i = 0; i < 3; i++) f.line([[st[0] - 36, st[1] + 30 + i * 40], [st[0] + 4, st[1] + 36 + i * 40], [st[0] + 43, st[1] + 30 + i * 40]], 1.4, INK, { op: 0.7 });
  for (let i = 0; i < 3; i++) for (let k = 0; k < 4; k++) f.rivet([st[0] - 28 + k * 22, st[1] + 34 + i * 40 + (k === 1 || k === 2 ? 4 : 0)], 1.8, '#c08a5a');
  f.line([[st[0] - 26, st[1] - 14], [st[0] - 6, st[1] - 30], [st[0] + 22, st[1] - 26]], 2, '#e8b080', { op: 0.6 });
  for (const [x, y] of [[st[0] - 30, st[1] + 70], [st[0] + 34, st[1] + 104], [st[0] - 10, st[1] + 128]]) f.flat([[x, y], [x + 8, y - 2], [x + 6, y + 16], [x + 2, y + 22], [x - 1, y + 12]], '#4e8a6a', { op: 0.75 }); // verdigris runs
  f.part(limb([st[0] - 4, st[1] - 36], [st[0] + 6, st[1] - 70], 16, 12, { steps: 4 }), { fill: copper, tex: 'mottle51', shadow: '#3a1a0c' }); // helm neck
  // lyne arm: from the helm over and down the back of the boiler into the worm, so the plumbing closes
  const lyne = [[st[0] + 6, st[1] - 70], [st[0] - 4, st[1] - 86], [st[0] - 30, st[1] - 84], [st[0] - 50, st[1] - 56], [st[0] - 56, st[1] + 20], [st[0] - 54, st[1] + 100], [st[0] - 34, st[1] + 134]];
  f.line(lyne, 7, INK); f.line(lyne, 4, '#6a4026'); f.line(lyne.slice(0, 4).map(q => add(q, [1, -1.5])), 1.2, '#e0a070', { op: 0.55 });
  for (const t of [2, 4]) f.line([add(lyne[t], [-6, 0]), add(lyne[t], [6, 0])], 2.4, '#2a2620', { straight: true }); // pipe clamps
  f.flat(ell([st[0] - 56, st[1] + 40], 4, 6, 0, 6), '#4e8a6a', { op: 0.8 });
  // the worm: copper pipe coiled four times round a cooling can
  const cw = [st[0] + 2, st[1] + 160];
  f.part([[cw[0] - 30, cw[1] - 24], [cw[0] + 28, cw[1] - 24], [cw[0] + 30, cw[1] + 38], [cw[0] - 32, cw[1] + 38]], { fill: '#4e4a40', tex: 'mottle51', sharp: true });
  f.part(ell([cw[0] - 1, cw[1] - 24], 30, 6, 0, 14), { fill: '#5e5a50', inkW: 1.2, cast: false }); // can rim
  for (let i = 0; i < 2; i++) f.line([[cw[0] - 30, cw[1] - 4 + i * 26], [cw[0] + 30, cw[1] - 4 + i * 26]], 2.4, '#2a2620', { straight: true }); // hoops
  for (let i = 0; i < 4; i++) { const c = add(cw, [0, -14 + i * 15]), e = ell(c, 36, 7, 0.08, 18); f.line(e.slice(9).concat([e[0]]), 5, INK); f.line(e.slice(9).concat([e[0]]), 3, mix(copper, '#000', 0.35)); }
  for (let i = 0; i < 4; i++) { const c = add(cw, [0, -14 + i * 15]), e = ell(c, 36, 7, 0.08, 18); f.line(e.slice(0, 10), 6.5, INK); f.line(e.slice(0, 10), 4, '#6e4228'); f.line(e.slice(1, 6), 1.2, '#e0a070', { op: 0.55 }); }
  f.line([add(cw, [-36, 38]), add(cw, [-40, 60]), add(cw, [-32, 72])], 6, INK); f.line([add(cw, [-36, 38]), add(cw, [-40, 60]), add(cw, [-32, 72])], 3.6, '#8a4e2a'); // drip spout
  // carrying frame straps over the shoulders
  f.bone('torso');
  f.line([[st[0] + 36, st[1] - 10], [272, 300], [300, 300]], 7, '#2e1e12'); f.line([[st[0] + 36, st[1] - 10], [272, 300], [300, 300]], 1, '#8a6a4a', { op: 0.6, dash: '3 3' });
  // ---- far leg forward (the breeches tube runs from hip to shin, so it is cut at the knee; the tall boot at the ankle)
  split(f, () => f.part(chain([HFp, KF, lerp(KF, AF, 0.3)], [64, 50, 44], { bq: [[0, 0.3, 0.12]] }), { fill: breech, tex: 'weave51', texOp: 0.4 }), [['thigh_f', side(KF, mul(knee(HFp, KF, AF), -1), 25)], ['shin_f', side(KF, knee(HFp, KF, AF), 25)]]);
  split(f, () => B.boot(f, AF, 1, 52, '#3a2a1c', { knee: lp(KF, AF, 0.22), kneeW: 46, strap: true, tex: 'mottle51' }), [['shin_f', side(AF, mul(ankle(KF, AF), -1), 18)], ['foot_f', side(AF, ankle(KF, AF), 18)]]);
  // ---- near leg, weight on it
  split(f, () => f.part(chain([HNp, KN, lerp(KN, AN, 0.3)], [68, 52, 46], { bp: [[0, 0.3, 0.12]] }), { fill: breech, tex: 'weave51', texOp: 0.4 }), [['thigh_n', side(KN, mul(knee(HNp, KN, AN), -1), 26)], ['shin_n', side(KN, knee(HNp, KN, AN), 26)]]);
  split(f, () => B.boot(f, AN, 1, 54, '#33251a', { knee: lp(KN, AN, 0.22), kneeW: 48, strap: true, tex: 'mottle51' }), [['shin_n', side(AN, mul(ankle(KN, AN), -1), 19)], ['foot_n', side(AN, ankle(KN, AN), 19)]]);
  // ---- torso: barrel chest and belly in a rolled-sleeve shirt
  f.bone('torso');
  const torso = [[300, 284], [326, 290], [352, 300], [372, 330], [380, 372], [388, 420], [392, 466], [384, 506], [360, 530], [300, 538], [244, 530], [222, 500], [214, 450], [216, 392], [224, 340], [244, 304], [272, 288]];
  f.part(torso, SHT());
  f.stroke([[250, 340], [262, 380], [258, 420]], 2); f.stroke([[352, 330], [364, 370], [372, 410]], 2);
  // ---- waxed apron: bib to the breastbone, straight stiff skirt to mid-shin, side edge and tie at the back
  const ap = [[300, 330], [356, 324], [370, 370], [382, 430], [390, 480], [398, 540], [402, 610], [404, 668, 1], [372, 674], [340, 668, 1], [310, 676], [280, 670, 1], [252, 676], [236, 670, 1], [234, 600], [236, 520], [242, 470], [264, 420], [286, 372]];
  // one apron shape, cut at the string: the bib stays on the torso, the stiff skirt swings below the string. The skirt copy
  // reaches up under the bib, and the bib copy stops at the middle of the string, which covers the cut.
  split(f, () => f.part(ap, { fill: apron, tex: 'mottle51', texOp: 0.6, k: 0.85, shadow: '#1e140a' }), [['apron', side(add(apC, mul(apD, -44)), apD)], ['torso', side(apC, mul(apD, -1))]]);
  f.bone('apron');
  for (const q of [[[300, 480], [296, 580], [296, 670]], [[352, 470], [362, 570], [366, 668]], [[262, 520], [254, 600], [254, 672]]]) f.stroke(q, 2.2, '#1a180e');
  for (const q of [[[312, 470], [310, 560], [312, 650]], [[372, 520], [380, 600]]]) f.line(q, 1.3, '#a8a07a', { op: 0.55 }); // waxed sheen
  f.bone('torso');
  f.line([[322, 360], [334, 420]], 1.3, '#a8a07a', { op: 0.55 }); // waxed sheen on the bib
  f.bone('apron');
  f.stroke([[340, 600], [356, 616], [370, 610]], 1.8, '#1a180e'); // knee pushing the apron
  for (const [x, y, r] of [[330, 600], [270, 560], [356, 520], [300, 640], [380, 640]].map((q, i) => [...q, [8, 5, 6, 7, 4][i]])) { f.flat(ell([x, y], r, r * 0.7, 0.4, 10), '#140e08', { op: 0.75 }); f.line(ell([x, y], r + 2, r * 0.7 + 2, 0.4, 10), 1, '#8a7a4a', { op: 0.5 }); } // acid pocks
  f.flat([[250, 600], [262, 596], [268, 650], [256, 660]], '#5a8a3a', { op: 0.35 }); // green spill
  f.bone('torso');
  f.flat([[344, 440], [360, 436], [362, 470], [350, 486], [342, 466]], '#5a3a6a', { op: 0.35 }); // violet stain
  f.line([[300, 330], [304, 296], [326, 290]], 3.5, '#2a1c12'); // neck strap
  f.part([[232, 488], [392, 476], [394, 488], [232, 500]], { fill: '#2a1c12', sharp: true }); // apron string at the waist
  f.bone('pelvis');
  f.stroke([[238, 494], [226, 520], [232, 552]], 3.2, '#2a1c12'); f.stroke([[240, 496], [248, 520], [244, 540]], 3, '#2a1c12');
  // belt hang: pestle in a loop, pouch, iron funnel, badge
  f.part(limb([236, 500], [226, 560], 12, 16, { steps: 4 }), { fill: '#b8b0a0', inkW: 1.2 });
  f.part([[262, 496], [296, 494], [298, 530], [264, 534]], { fill: '#4a301c', sharp: true, tex: 'mottle51' });
  f.part([[260, 494], [298, 492], [296, 508], [278, 512], [262, 508]], { fill: '#3a2414', inkW: 1.2 });
  f.line([[372, 488], [374, 504]], 1.2, '#2b2119');
  G.badge(f, [374, 504], 10, '#74777b', -0.08);
  // ---- bandolier of flasks: far shoulder, across the chest, to the near hip
  f.bone('torso');
  const b0 = [352, 312], b1 = [236, 482];
  f.part(limb(b0, b1, 20, 20, { steps: 8, capK: 0.3 }), { fill: '#3a2618', tex: 'mottle51' });
  f.stitches([lp(b0, b1, 0.02, 7), lp(b1, b0, 0.02, -7)]);
  const glass = ['#b8862a', '#4a8a4a', '#7a2e3a', '#3a6a8a', '#8a8a7a', '#5a7a2a'];
  for (let i = 0; i < 6; i++) {
    const c = lerp(b0, b1, 0.1 + i * 0.155), sh = i % 3;
    const pts = sh === 0 ? [add(c, [-4, -8]), add(c, [4, -8]), add(c, [11, 4]), add(c, [9, 16]), add(c, [-9, 16]), add(c, [-11, 4])] : sh === 1 ? [add(c, [-7, -8]), add(c, [7, -8]), add(c, [8, 16]), add(c, [-8, 16])] : [add(c, [-4, -10]), add(c, [4, -10]), add(c, [6, -2]), add(c, [10, 14]), add(c, [-10, 14]), add(c, [-6, -2])];
    f.part(pts, { fill: glass[i], shade: 0.3, inkW: 1.2, k: 0.6, hatch: false });
    f.flat([add(c, [-7, 6]), add(c, [7, 6]), add(c, [7, 14]), add(c, [-7, 14])], mix(glass[i], '#fff', 0.25), { op: 0.6 }); // liquid line
    f.line([add(c, [-4, -4]), add(c, [-5, 10])], 1.3, '#fff', { op: 0.6 });
    f.part([add(c, [-4, -14]), add(c, [4, -14]), add(c, [4, -8]), add(c, [-4, -8])], { fill: '#8a6a4a', inkW: 1, sharp: true, cast: false }); // cork
    f.line([add(c, [-11, -2]), add(c, [11, -4])], 2.2, '#2a1a10', { straight: true }); // loop
  }
  f.part([add(lerp(b0, b1, 0.92), [-8, -6]), add(lerp(b0, b1, 0.92), [6, -8]), add(lerp(b0, b1, 0.92), [10, 30]), add(lerp(b0, b1, 0.92), [2, 34]), add(lerp(b0, b1, 0.92), [-2, 10])], { fill: rubric, inkW: 1.1, cast: false }); // rubric strip tied on
  // ---- near arm: fist planted on the hip, elbow out behind
  f.bone('upperarm_n');
  f.part(ragLimb(f, SN, lerp(SN, EN, 0.85), 50, 46, { p: [[0.4, 0.12, 0.2]], depth: 5, teeth: 4 }), SHT());
  f.part(ell(lerp(SN, EN, 0.86), 25, 9, Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) + Math.PI / 2, 12), SHT({ fill: mix(shirt, '#000', 0.12) })); // rolled cuff
  split(f, () => f.part(chain([lerp(SN, EN, 0.9), EN, lerp(EN, WN, 0.5)], [40, 42, 38]), SKN()), [['upperarm_n', side(EN, mul(knee(SN, EN, WN), -1), 21)], ['forearm_n', side(EN, knee(SN, EN, WN), 21)]]);
  f.bone('forearm_n');
  f.line([lp(EN, WN, 0.15, -6), lp(EN, WN, 0.4, -8)], 1, mix(skin, '#000', 0.4), { op: 0.5 });
  f.part(chain([lerp(EN, WN, 0.42), WN], [44, 40]), { fill: glove, tex: 'mottle51', shadow: '#140a06' }); // gauntlet glove
  f.part(plate(EN, WN, 0.36, 0.52, 52, 48), { fill: mix(glove, '#000', 0.1), tex: 'mottle51' }); // flared cuff
  f.bone('hand_n');
  B.fist(f, WN, 1.15, 22, glove, { tex: 'mottle51', shadow: '#140a06' }); // knuckles continue the forearm down into the hip
  // ---- head tipped back, squinting up at the flask; spectacles pushed up on a felt cap; mask pulled down
  const HC = [316, 226];
  f.bone('head');
  f.part(limb([306, 296], add(HC, [-6, 32]), 44, 40), SKN());
  f.bone('torso');
  f.part([[262, 296], [300, 284], [346, 290], [352, 304], [324, 316], [294, 318], [266, 312]], { fill: '#8e8470', tex: 'weave51', k: 0.7 }); // cloth mask round the neck
  f.stroke([[276, 304], [302, 306], [330, 300]], 1.8);
  f.bone('head');
  const hf = B.head(f, HC, H, -0.24, {
    skin, jaw: 1.16, chin: 0.0, nose: 1.18, hook: 0.0, mouth: 'set', squint: 0.8, browDown: 0.06, age: true,
    hairCol: '#5a4030', beard: 'short', beardCol: '#6a4a34',
    hair: [[-0.4, 0.12], [-0.44, -0.1], [-0.3, -0.12], [-0.26, 0.12]],
  });
  f.part(hf([[-0.46, -0.16], [-0.4, -0.5], [-0.08, -0.66], [0.26, -0.58], [0.4, -0.36], [0.34, -0.28], [0.0, -0.32], [-0.3, -0.2]]), { fill: '#4a3a2a', tex: 'mottle51' }); // felt cap
  f.part(hf([[-0.46, -0.24], [0.4, -0.34], [0.42, -0.26], [-0.46, -0.14]]), { fill: '#3a2a1c', k: 0.6 });
  f.flat(hf(ell([0.0, -0.5], 0.08, 0.05, 0, 8)), '#2a1a10', { op: 0.5 }); // scorch on the cap
  for (const [c, r] of [[[0.06, -0.42], 0.1], [[0.27, -0.44], 0.08]]) { const p = hf([c])[0]; f.part(ell(p, r * H * 0.95, r * H * 0.75, -0.24, 12), { fill: '#9ab0a8', shade: 0.2, inkW: 0, cast: false, hatch: false, opacity: 0.55 }); ring(f, p, r * H * 0.95, r * H * 0.75, 2.4, '#4a4038', { ang: -0.24 }); }
  f.line(hf([[0.15, -0.43], [0.19, -0.44]]), 2, '#4a4038'); f.line(hf([[-0.03, -0.41], [-0.22, -0.36]]), 1.6, '#4a4038');
  f.line(hf([[0.1, -0.12], [0.22, -0.08]]), 1.1, INK, { op: 0.6 }); // squint crease
  // ---- far arm raised: rolled sleeve, gauntlet, fingers round the flask's neck, the flask held to the light
  f.bone('upperarm_f');
  f.part(chain([SF, lerp(SF, EF, 0.85)], [48, 46], { bq: [[0, 0.5, 0.14]] }), SHT());
  f.part(ell(lerp(SF, EF, 0.86), 24, 9, Math.atan2(EF[1] - SF[1], EF[0] - SF[0]) + Math.PI / 2, 12), SHT({ fill: mix(shirt, '#000', 0.12) }));
  split(f, () => f.part(chain([lerp(SF, EF, 0.88), EF, lerp(EF, WF, 0.45)], [38, 40, 36]), SKN()), [['upperarm_f', side(EF, mul(knee(SF, EF, WF), -1), 20)], ['forearm_f', side(EF, knee(SF, EF, WF), 20)]]);
  f.bone('forearm_f');
  f.flat(ell(lp(EF, WF, 0.3, 4), 7, 4, -1.4, 8), mix(skin, '#e8c0a8', 0.5), { op: 0.85 }); // old acid burn
  f.part(chain([lerp(EF, WF, 0.4), lerp(EF, WF, 0.55), WF], [52, 40, 34]), { fill: glove, tex: 'mottle51', shadow: '#140a06' }); // gauntlet with a flared cuff
  f.line([lp(EF, WF, 0.5, 20), lp(EF, WF, 0.5, -20)], 1.2, '#8a6a4a', { op: 0.5, dash: '3 2' });
  // the flask hangs from the little-finger side of the fist, along the knuckle row; the fist is square to the forearm
  const gF = B.gripAngle(GF, EF, -Math.PI / 2, { name: 'alchemist flask' });
  const FL = frame(GF, gF.axis + Math.PI / 2, 1), q = (x, y) => FL([[x + 4, y + 28]])[0], Q = pts => pts.map(([x, y]) => q(x, y)), fl = q(0, 0);
  f.bone('flask');
  f.raw(`<circle cx="${fl[0]}" cy="${fl[1]}" r="34" fill="#c8e06a" opacity="0.2" filter="url(#soft51)"/>`);
  f.part(Q([[-4, -40], [4, -40], [5, -16], [18, 2], [16, 22], [-16, 22], [-18, 2], [-5, -16]]), { fill: '#8ab04a', shade: 0.25, inkW: 1.4, k: 0.7, hatch: false });
  f.flat([add(fl, [-17, 6]), add(fl, [17, 6]), add(fl, [15, 20]), add(fl, [-15, 20])].map(p => [p[0], p[1] + (p[0] - fl[0]) * 0]), '#c8e070', { op: 0.75 }); // liquid stays level whatever the tilt
  f.flat(ell(add(fl, [4, 12]), 2, 2, 0, 6), '#f0ffc0'); f.flat(ell(add(fl, [-6, 16]), 1.5, 1.5, 0, 6), '#f0ffc0'); // bubbles
  f.line(Q([[-9, -2], [-11, 14]]), 1.6, '#fff', { op: 0.65 });
  f.part(Q([[-5, -48], [5, -48], [5, -40], [-5, -40]]), { fill: '#8a6a4a', sharp: true, inkW: 1 });
  f.bone('hand_f');
  B.fist(f, GF, gF.ang, 18, glove, { tex: 'mottle51', shadow: '#140a06', flip: gF.flip });
  return f;
}

// ------------------------------------------------------------------ ORACLE: "The Anchorite"
// Blindfolded, head bowed and cocked toward the hourglass she lifts on its chain, listening to the sand.
// The far hand draws the robe open below the belt on the star charts sewn into its lining.
function oracle() {
  const f = new Fig(base(52));
  const H = 94;
  const robe = '#2f2538', robeD = '#211a29', under = '#3e3a3a', lining = '#d2c3a0', skin = '#d4c0ae', skinS = '#7a6672';
  const RB = (o = {}) => Object.assign({ fill: robe, tex: 'weave52', texOp: 0.5, shadow: '#120e18' }, o);
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: 'mottle52', texOp: 0.4 }, o);
  const SN = [262, 352], EN = [316, 394], WN = [394, 300];
  const SF = [352, 346], EF = [388, 420], WF = [428, 482];
  const HC = [328, 262], hA = 0.36;
  const BC = [296, 476]; // middle of the rope belt: the robe is cut here into the torso and the skirt
  const AF = [350, 752], AN = [234, 754];

  // skeleton: pelvis is the root. The far hand holds the turned-out front panel, so that panel hangs from the hand.
  f.joint('pelvis', [296, 490]).joint('torso', BC, 'pelvis').joint('head', [300, 330], 'torso').joint('cape', [300, 322], 'torso').joint('skirt', BC, 'pelvis');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('robe_front', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('hourglass', add(WN, [6, 12]), 'hand_n');
  f.joint('thigh_f', [330, 490], 'pelvis').joint('shin_f', [340, 622], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [262, 490], 'pelvis').joint('shin_n', [248, 622], 'thigh_n').joint('foot_n', AN, 'shin_n');

  // ---- hood shell behind the head
  const hF = frame(HC, hA, H);
  f.bone('head');
  f.part(hF([[-0.66, 0.56], [-0.72, 0.0], [-0.56, -0.5], [-0.2, -0.72], [0.2, -0.68], [0.44, -0.48], [0.4, -0.2], [0.0, 0.2], [-0.3, 0.62]]), RB({ fill: robeD }));
  // ---- bare feet under the hem
  f.bone('foot_f');
  B.bareFoot(f, AF, 1, 44, skin, { shadow: skinS, tex: 'mottle52' });
  f.bone('foot_n');
  B.bareFoot(f, AN, 1, 44, mix(skin, '#6a5a5a', 0.15), { shadow: skinS, tex: 'mottle52' });
  f.bone('foot_f'); f.flat(ell([380, 786], 22, 4, 0, 10), '#2a2016', { op: 0.5 }); // dirt on the soles
  f.bone('foot_n'); f.flat(ell([266, 786], 22, 4, 0, 10), '#2a2016', { op: 0.5 });
  // ---- near panel of the robe: back silhouette to the closed front edge, a short train on the floor
  const near = [[296, 316], [254, 332], [228, 362], [216, 424], [212, 486], [206, 566], [196, 652], [184, 716], [164, 764], [192, 772], [222, 764, 1], [252, 772], [286, 762, 1], [318, 770], [346, 760, 1], [372, 766], [366, 640], [358, 540], [356, 470], [352, 400], [338, 330]];
  // one panel from shoulder to hem, cut at the belt: the skirt copy reaches up under the torso copy, which stops under the belt
  split(f, () => f.part(near, RB()), [['skirt', side([296, 440], [0, 1])], ['torso', side(BC, [0, -1])]]);
  f.bone('skirt');
  for (const q of [[[244, 500], [232, 620], [222, 760]], [[290, 520], [288, 640], [292, 762]], [[328, 520], [334, 640], [340, 760]], [[214, 600], [200, 700], [186, 760]], [[268, 560], [262, 650], [264, 740]], [[350, 560], [356, 660], [362, 760]]]) f.stroke(q, 2.4, '#0e0a12');
  f.stroke([[300, 600], [318, 612], [334, 606]], 1.8, '#0e0a12'); f.stroke([[240, 700], [262, 712], [280, 706]], 1.8, '#0e0a12'); // cloth catching on the knee and dragging
  f.line([[300, 540], [304, 640], [306, 740]], 1, '#6a5a7a', { op: 0.5 }); // a lit fold edge
  f.part([[250, 640], [276, 636], [280, 668], [252, 672]], RB({ fill: mix(robe, '#4a3a2a', 0.3), inkW: 1.1, sharp: true })); // patch
  f.stitches([[250, 640], [276, 636], [280, 668], [252, 672], [250, 640]], '#8a7a9a', 0.8);
  f.flat([[170, 730], [372, 726], [374, 772], [168, 772]], '#1e160d', { op: 0.4 }); // wet dirty hem
  // ---- the opening: underdress, then the far panel turned out to show its lining
  f.part([[352, 470], [384, 470], [400, 560], [410, 660], [412, 760, 1], [386, 768], [372, 766], [366, 640], [358, 540]], { fill: under, tex: 'weave52', texOp: 0.5 });
  f.stroke([[376, 520], [388, 640], [394, 750]], 1.8, '#1a1618');
  f.bone('robe_front'); // the far panel, turned out by the far hand to show the star charts on its lining
  const lin = [[380, 470], [422, 478], [440, 540], [452, 620], [462, 700], [470, 750, 1], [450, 744], [432, 760, 1], [412, 750], [404, 660], [396, 560]];
  f.part(lin, { fill: lining, tex: 'weave52', texOp: 0.3, shadow: '#6a5a6a' });
  // star charts in violet ink: constellations, a ruled circle, a crescent
  const stars = [[404, 512], [418, 530], [412, 556], [428, 574], [420, 604], [436, 628], [428, 662], [444, 688], [432, 716], [448, 734]];
  f.line(stars.slice(0, 4), 1, '#3a2a4a', { straight: true, op: 0.75 }); f.line(stars.slice(4, 7), 1, '#3a2a4a', { straight: true, op: 0.75 }); f.line(stars.slice(7), 1, '#3a2a4a', { straight: true, op: 0.75 });
  for (const s of stars) { f.line([add(s, [-3.5, 0]), add(s, [3.5, 0])], 1.2, '#2a1a3a', { straight: true }); f.line([add(s, [0, -3.5]), add(s, [0, 3.5])], 1.2, '#2a1a3a', { straight: true }); }
  ring(f, [424, 642], 14, 14, 1, '#3a2a4a', { op: 0.6 }); f.line([[410, 642], [438, 642]], 0.8, '#3a2a4a', { op: 0.5 });
  f.flat([[436, 500], [446, 508], [444, 522], [438, 512]], '#3a2a4a', { op: 0.7 }); // crescent
  for (const q of [[[410, 520], [420, 600], [418, 690]], [[432, 560], [446, 650], [452, 740]]]) f.stroke(q, 1.8, '#5a4a52');
  // outer face of the panel shows along its turned edge
  f.part([[422, 478], [434, 476], [452, 540], [466, 620], [478, 700], [484, 752], [470, 750, 1], [462, 700], [452, 620], [440, 540]], RB({ inkW: 1.4 }));
  // ---- rope belt, wax tablet, badge, knotted prayer cord
  f.bone('torso');
  f.part([[212, 466], [290, 474], [356, 470], [384, 466], [384, 476], [356, 480], [290, 484], [212, 478]], { fill: '#6e5a3a', tex: 'hatch52', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 9; i++) f.line([[218 + i * 18, 467 + (i < 4 ? i * 2 : 8)], [224 + i * 18, 478 + (i < 4 ? i * 2 : 8)]], 1, INK, { op: 0.55 });
  f.stroke([[366, 476], [370, 520], [364, 566]], 4, '#6e5a3a'); f.stroke([[372, 476], [380, 512], [382, 540]], 3.5, '#5e4a2e');
  for (const y of [500, 524, 548]) f.part(ell([368, y], 4.4, 4.4, 0, 8), { fill: '#6e5a3a', inkW: 1, cast: false }); // knots
  // wax tablet: two wooden leaves on a thong at the back hip, stylus through the binding
  f.line([[236, 476], [232, 500]], 2, '#3a2618');
  f.part([[208, 498], [252, 494], [256, 556], [212, 560]], { fill: '#6a4a2a', tex: 'wood52', sharp: true, inkW: 1.4 });
  f.part([[214, 504], [248, 500], [250, 550], [218, 554]], { fill: '#c09858', sharp: true, inkW: 1 });
  for (let i = 0; i < 4; i++) f.line([[220, 512 + i * 10], [244, 509 + i * 10]], 0.9, '#5a3a1a', { op: 0.8 });
  f.part(limb([200, 520], [266, 508], 4, 3, { steps: 4, capK: 2 }), { fill: '#b8b0a0', inkW: 1, inkHeavy: 1.4, cast: false });
  f.line([[302, 480], [304, 500]], 1.2, '#2b2119');
  G.badge(f, [304, 500], 10, '#74777b', 0.08);
  const drip = ([x, y]) => f.flat([[x, y], [x + 4, y], [x + 5, y + 10], [x + 2, y + 14], [x - 1, y + 9]], '#d8d0c0', { op: 0.75 }); // candle wax dripped on the robe
  f.bone('skirt'); drip([320, 560]); drip([326, 590]);
  f.bone('torso'); drip([270, 430]);
  // ---- far arm in its wide sleeve, fist gripping the robe's edge (one sleeve tube, cut at the elbow)
  const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
  split(f, () => f.part(chain([SF, EF, WF], [46, 44, 40], { bq: [[1, 0.5, 0.18]] }), RB()), [['upperarm_f', side(EF, mul(elb(SF, EF, WF), -1), 22)], ['forearm_f', side(EF, elb(SF, EF, WF), 22)]]);
  f.bone('forearm_f');
  f.part([lp(EF, WF, 0.45, 22), lp(EF, WF, 0.9, 26), [WF[0] - 2, WF[1] + 18, 1], [WF[0] - 18, WF[1] + 40], [WF[0] - 36, WF[1] + 46, 1], [EF[0] + 4, EF[1] + 44], lp(EF, WF, 0.4, -20)], RB({ fill: robeD })); // sleeve mouth hanging
  f.flat([[WF[0] - 4, WF[1] - 14], [WF[0] - 2, WF[1] + 14], [WF[0] - 14, WF[1] + 30], [WF[0] - 14, WF[1] - 6]], '#0a080c', { op: 0.85 });
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 19, skin, { shadow: skinS, tex: 'mottle52', quiet: true }); // cloth is soft: the hand stays within a wrist's bend of the forearm
  f.bone('robe_front');
  f.part([add(WF, [6, -18]), add(WF, [14, -20]), add(WF, [16, -6]), add(WF, [8, -4])], RB({ inkW: 1.1, cast: false })); // the robe's edge gathered in the fingers
  // ---- head: bowed and cocked, linen blindfold with one painted eye, hood framing the face in shadow
  f.bone('head');
  f.part(limb([300, 330], add(HC, [-14, 32]), 30, 28), SKN());
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 0.9, chin: -0.01, nose: 1.02, hook: 0.15, mouth: 'set', squint: 0.0, blind: true, gaunt: true, lips: true, faceHatch: false,
    hairCol: '#3a302a', noEar: true, browCol: '#3a302a',
  });
  f.part(hf([[-0.3, -0.2], [0.42, -0.21], [0.45, -0.02], [-0.3, 0.02]]), { fill: '#d8ccb0', tex: 'weave52', k: 0.6, shadow: '#7a6a6a' }); // blindfold
  f.line(hf([[-0.28, -0.11], [0.44, -0.12]]), 0.9, '#8a7a6a', { op: 0.6 });
  const pe = hf([[0.17, -0.1]])[0];
  f.line(hf(ell([0.17, -0.1], 0.07, 0.04, 0, 14).concat([ell([0.17, -0.1], 0.07, 0.04, 0, 14)[0]])), 1.5, '#3a1e52');
  f.flat(ell(pe, 3.4, 3.4, 0, 8), '#3a1e52'); f.flat(ell(add(pe, [-1, -1]), 1, 1, 0, 6), '#d8ccb0');
  f.line(hf([[0.08, -0.16], [0.17, -0.18], [0.26, -0.155]]), 1.2, '#3a1e52', { op: 0.8 }); // painted lid
  f.flat(hf([[0.2, -0.02], [0.215, 0.06], [0.205, 0.09], [0.195, 0.05]]), '#3a1e52', { op: 0.6 }); // a violet tear run from the paint
  // hood front: inner shadow first, then the rim, peaked over the brow
  f.flat(hf([[-0.3, -0.42], [-0.08, -0.5], [0.24, -0.42], [0.34, -0.3], [0.1, -0.34], [-0.16, -0.3], [-0.24, 0.0], [-0.2, 0.36], [-0.34, 0.4], [-0.38, 0.0]]), '#0c0810', { op: 0.85 });
  f.part(hF([[0.52, -0.3, 1], [0.46, -0.5], [0.2, -0.72], [-0.22, -0.76], [-0.6, -0.52], [-0.76, 0.0], [-0.72, 0.5], [-0.62, 0.92], [-0.2, 1.02], [0.22, 0.88], [0.34, 0.7, 1], [0.18, 0.62], [-0.06, 0.52], [-0.22, 0.3], [-0.28, 0.0], [-0.24, -0.3], [-0.08, -0.48], [0.14, -0.5], [0.34, -0.38]]), RB());
  f.stroke(hF([[0.1, 0.72], [-0.1, 0.84], [-0.4, 0.86]]), 2, '#0e0a12'); f.stroke(hF([[-0.3, 0.5], [-0.5, 0.62], [-0.56, 0.84]]), 1.8, '#0e0a12');
  f.stroke(hF([[-0.48, -0.3], [-0.54, 0.0], [-0.5, 0.36]]), 2.4, '#0e0a12'); f.stroke(hF([[-0.1, -0.62], [0.16, -0.58], [0.34, -0.46]]), 1.8, '#0e0a12');
  // ---- the near upper arm under the cape (hidden in the rest pose; completes the arm for the rig)
  f.bone('upperarm_n');
  f.part(limb(SN, lerp(SN, EN, 0.62), 40, 40, { steps: 6 }), RB());
  // ---- shoulder cape off the hood, ragged hem
  f.bone('cape');
  f.part([[296, 312], [252, 326], [222, 352], [208, 396, 1], [224, 386], [236, 400, 1], [262, 392], [282, 414, 1], [294, 396], [318, 402, 1], [344, 388], [360, 398, 1], [370, 360], [350, 330], [322, 314]], RB({ fill: mix(robe, '#000', 0.08) }));
  f.stroke([[250, 340], [244, 372], [240, 396]], 2, '#0e0a12'); f.stroke([[300, 334], [304, 368], [300, 392]], 2, '#0e0a12');
  // ---- near arm: forearm rising from under the cape, chain pinched in the fingers, the hourglass hanging and turning
  split(f, () => f.part(chain([lerp(SN, EN, 0.55), EN, lerp(EN, WN, 0.7)], [40, 42, 36]), RB()), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 21)], ['forearm_n', side(EN, elb(SN, EN, WN), 21)]]);
  f.bone('forearm_n');
  f.part(ragLimb(f, EN, lerp(EN, WN, 0.78), 38, 46, { depth: 5, teeth: 4 }), RB({ fill: robeD })); // sleeve fallen back to the wrist
  f.part(limb(lerp(EN, WN, 0.7), WN, 20, 18), SKN({ cast: false }));
  const hg = [408, 362], ch0 = add(WN, [6, 12]);
  f.bone('hourglass');
  f.line([ch0, add(ch0, [2, 14]), add(hg, [0, -28])], 1.6, '#8a8a86', { dash: '3 1.5' });
  f.part([add(ch0, [-3, 4]), add(ch0, [5, 6]), add(ch0, [10, 26]), add(ch0, [4, 30]), add(ch0, [6, 46]), add(ch0, [0, 46]), add(ch0, [-2, 24])], { fill: rubric, shade: 0.4, inkW: 1.1, cast: false }); // rubric strip tied on the chain
  f.part([add(hg, [-16, -28]), add(hg, [16, -28]), add(hg, [16, -21]), add(hg, [-16, -21])], { fill: '#4a3020', sharp: true, inkW: 1.2 });
  f.part([add(hg, [-16, 21]), add(hg, [16, 21]), add(hg, [16, 28]), add(hg, [-16, 28])], { fill: '#4a3020', sharp: true, inkW: 1.2 });
  f.part([add(hg, [-12, -21]), add(hg, [12, -21]), add(hg, [2, 0]), add(hg, [12, 21]), add(hg, [-12, 21]), add(hg, [-2, 0])], { fill: '#c8d4d8', shade: 0.25, inkW: 1.2, sharp: true, hatch: false });
  f.flat([add(hg, [-8, -12]), add(hg, [8, -12]), add(hg, [1, -1]), add(hg, [-1, -1])], '#cdbb92');
  f.flat([add(hg, [-10, 20]), add(hg, [10, 20]), add(hg, [0, 9])], '#cdbb92');
  f.line([add(hg, [0, -1]), add(hg, [0, 10])], 1, '#cdbb92');
  f.line([add(hg, [-9, -18]), add(hg, [-4, -8])], 1.2, '#fff', { op: 0.7 });
  for (const x of [-14, 14]) f.line([add(hg, [x, -21]), add(hg, [x, 21])], 2.2, '#4a3020', { straight: true });
  f.bone('hand_n');
  B.grip(f, WN, EN, -Math.PI / 2, 18, skin, { shadow: skinS, tex: 'mottle52', quiet: true }); // chain runs out of the little-finger side and then hangs plumb
  f.line(ell(add(WN, [6, -2]), 3, 4, 0, 8).concat([ell(add(WN, [6, -2]), 3, 4, 0, 8)[0]]), 1.6, '#cfc8b8'); // bone ring
  return f;
}



// ------------------------------------------------------------------ HEXWEAVER: "The Cunning Woman"
// Crouched low and hunched over the poppet she holds out, grinning crookedly, the iron pin poised above it.
// Black tallow candles burn on a slab of wax strapped to her shoulder. Rags on rags, cord, bone, charms.
function hexweaver() {
  const f = new Fig(base(53));
  const H = 94;
  const rag = '#2a3226', ragL = '#3c4636', ragM = '#33302a', bone = '#cbbf9f', skin = '#c4a88a', skinS = '#6e5048', hair = '#2c2622', wax = '#2a2622';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: 'mottle53', texOp: 0.45 }, o);
  const RG = (fill, o = {}) => Object.assign({ fill, tex: 'weave53', texOp: 0.5, shadow: '#10140e' }, o);
  const HC = [370, 350], hA = 0.55; // bowed down over the poppet so her eyes are on it
  const SN = [280, 410], EN = [300, 496], WN = [422, 484];
  const SF = [348, 404], EF = [391, 272], WF = [466, 300]; // far arm raised beside the head, forearm square to the pin, fist above the poppet
  const HFp = [326, 568], KF = [406, 618], AF = [382, 744];
  const HNp = [252, 572], KN = [226, 672], AN = [198, 748];
  const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
  const ankle = (K, A) => add(E.norm(sub(A, K)), [0.6, 0]); // ankle cut: the instep goes with the foot
  const WB = [290, 542]; // the cord belt

  // skeleton: pelvis is the root; the torn skirt strips swing from the belt
  f.joint('pelvis', [290, 566]).joint('torso', WB, 'pelvis').joint('head', [318, 400], 'torso').joint('skirt', WB, 'pelvis');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('pin', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('poppet', add(WN, [2, -4]), 'hand_n');
  f.joint('thigh_f', HFp, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HNp, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  // ragged strip hem: n strips across [a..b] with lengths varying
  const strips = (a, b, n, len, fill, o = {}) => { for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, c = lerp(a, b, t), l = len * (0.55 + f.r() * 0.7), w = len * 0.22 + f.r() * 6, sw = (f.r() - 0.5) * 8; f.part([add(c, [-w / 2, -4]), add(c, [w / 2, -4]), add(c, [w / 2 + sw * 0.5, l * 0.7]), [...add(c, [w * 0.2 + sw, l]), 1], add(c, [-w * 0.1 + sw, l * 0.82]), [...add(c, [-w / 2 + sw * 0.6, l * 0.92]), 1]], RG(fill, Object.assign({ inkW: 1.2, inkHeavy: 2, cast: false }, o))); } };

  // ---- matted hair falling down the back (behind everything)
  const hF = frame(HC, hA, H), hG = frame(HC, 0.2, H); // hG: the hanging hair keeps falling straight down when the head bows
  f.bone('head');
  f.part(hG([[-0.2, -0.5], [-0.56, -0.36], [-0.74, 0.0], [-0.8, 0.5], [-0.9, 0.9], [-0.7, 1.0], [-0.66, 0.74], [-0.52, 0.96], [-0.4, 0.7], [-0.3, 0.3]]), { fill: hair, tex: 'hatch53', texOp: 0.35 });
  // ---- far arm raised high in front, the iron pin pinched and pointed down at the poppet
  f.bone('upperarm_f');
  f.part(ragLimb(f, SF, lerp(SF, EF, 0.95), 38, 40, { depth: 6, teeth: 4 }), RG(ragL));
  split(f, () => f.part(chain([lerp(SF, EF, 0.85), EF, WF], [32, 34, 28], { bq: [[1, 0.3, 0.12]] }), SKN()), [['upperarm_f', side(EF, mul(elb(SF, EF, WF), -1), 17)], ['forearm_f', side(EF, elb(SF, EF, WF), 17)]]);
  f.bone('forearm_f');
  for (let i = 0; i < 4; i++) f.line([lp(EF, WF, 0.18 + i * 0.13, -15), lp(EF, WF, 0.24 + i * 0.13, 15)], 2.2, '#8a7a5a', { straight: true }); // knotted cord wound round the wrist
  f.part(ell(lp(EF, WF, 0.3, 14), 4, 4, 0, 8), { fill: '#8a7a5a', inkW: 1, cast: false });
  const pp = [WN[0] + 4, WN[1] - 40];
  const pa = Math.atan2(pp[1] - 34 - WF[1], pp[0] - WF[0]), pin0 = add(WF, rot([-12, 0], pa)), pin1 = add(WF, rot([74, 0], pa));
  f.bone('pin');
  f.part(limb(pin0, pin1, 6, 1.5, { steps: 6, capK: 2 }), { fill: '#5e6266', inkW: 1.1, inkHeavy: 1.6, cast: false });
  f.line([add(pin0, rot([10, -1], pa)), add(pin0, rot([76, -0.5], pa))], 0.8, '#c8ccd0', { op: 0.7 });
  f.part(ell(pin0, 5, 5, 0, 8), { fill: '#3a3a3a', inkW: 1, cast: false });
  f.bone('hand_f');
  B.grip(f, WF, EF, pa + Math.PI, 19, skin, { shadow: skinS, tex: 'mottle53', name: 'hexweaver pin' }); // stabbing grip: pin head at the thumb, point out of the little-finger side
  // ---- legs: deep crouch, front knee high, rag-bound shins, bare filthy feet
  const shin = (K, A, wt, tint, sfx) => {
    const top = lerp(K, A, 0.12);
    // shin and bare foot are one outline: cut at the ankle
    split(f, () => bareLeg(f, top, A, 1, 44, wt, SKN({ fill: mix(skin, '#4a3a2a', tint) })), [['shin' + sfx, side(A, mul(ankle(K, A), -1), 17)], ['foot' + sfx, side(A, ankle(K, A), 17)]]);
    f.bone('shin' + sfx);
    f.part([lp(top, A, 0.0, -wt * 0.56), lp(top, A, 0.0, wt * 0.56), lp(top, A, 0.62, wt * 0.5), lp(top, A, 0.7, -wt * 0.58)], RG('#5a5040', { inkW: 1.3, cast: false, k: 0.4 })); // rag binding
    for (let i = 0; i < 4; i++) f.line([lp(top, A, 0.06 + i * 0.15 + f.r() * 0.03, -wt * 0.56), lp(top, A, 0.16 + i * 0.15, wt * 0.5)], 1.3, INK, { op: 0.6 }); // spiral turns
    f.line([lp(top, A, 0.3, -wt * 0.2), lp(top, A, 0.4, wt * 0.1)], 1, '#8a7c60', { op: 0.6 });
    f.stroke([lp(top, A, 0.66, -10), lp(top, A, 0.76, -16), lp(top, A, 0.86, -10)], 2.4, '#5a5040'); // loose end
  };
  shin(KF, AF, 40, 0.3, '_f');
  split(f, () => f.part(chain([HFp, KF, lerp(KF, AF, 0.14)], [56, 46, 40], { bq: [[0, 0.5, 0.14]] }), RG(rag)), [['thigh_f', side(KF, mul(elb(HFp, KF, AF), -1), 23)], ['shin_f', side(KF, elb(HFp, KF, AF), 23)]]);
  shin(KN, AN, 42, 0.2, '_n');
  split(f, () => f.part(chain([HNp, KN, lerp(KN, AN, 0.14)], [60, 48, 42], { bp: [[0, 0.5, 0.14]] }), RG(rag)), [['thigh_n', side(KN, mul(elb(HNp, KN, AN), -1), 24)], ['shin_n', side(KN, elb(HNp, KN, AN), 24)]]);
  // ---- skirt layers: torn strips draping over the front thigh and hanging between the knees
  f.bone('skirt');
  strips([214, 574], [306, 588], 5, 92, ragM);
  strips([304, 584], [408, 612], 4, 66, ragM);
  f.bone('torso');
  const torso = [[352, 398], [376, 426], [380, 476], [372, 522], [360, 560], [316, 586], [256, 588], [216, 574], [206, 534], [212, 488], [228, 446], [252, 414], [290, 396], [326, 390]];
  f.part(torso, RG(rag));
  f.bone('skirt');
  strips([208, 538], [370, 552], 8, 46, ragL);
  f.bone('torso');
  f.stroke([[244, 446], [254, 486], [250, 524]], 2, '#10140e'); f.stroke([[346, 430], [360, 470], [356, 510]], 2, '#10140e');
  // knotted cord belt hung with charms: herb bundle, bird skull, stoppered bottle, pouch, badge
  f.part([[210, 528], [288, 540], [370, 536], [372, 546], [288, 550], [208, 538]], { fill: '#7a6c50', tex: 'hatch53', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 7; i++) f.part(ell([220 + i * 24, 534 + (i < 3 ? i * 3 : 7)], 4.6, 4.6, 0, 8), { fill: '#6a5c40', inkW: 1, cast: false });
  f.line([[230, 538], [226, 556]], 1.2, '#3a2a1a');
  f.part([[218, 554], [234, 554], [238, 600], [228, 608], [216, 600]], { fill: '#5a6a3a', tex: 'hatch53', inkW: 1.2 }); f.line([[214, 562], [240, 562]], 2, '#6a5428');
  f.line([[262, 544], [262, 560]], 1.2, '#3a2a1a');
  f.part([[252, 560], [272, 558], [276, 572], [266, 582], [256, 576]], { fill: bone, inkW: 1.2, cast: false }); f.flat(ell([262, 568], 3, 3, 0, 6), '#1a1410'); f.part([[270, 572], [284, 582], [270, 578]], { fill: bone, inkW: 1, cast: false }); // bird skull
  f.line([[296, 548], [296, 562]], 1.2, '#3a2a1a');
  f.part([[290, 562], [302, 562], [306, 590], [286, 590]], { fill: '#3a5a4a', shade: 0.3, inkW: 1.2, hatch: false }); f.part([[292, 556], [300, 556], [300, 563], [292, 563]], { fill: '#8a6a4a', sharp: true, inkW: 1, cast: false });
  f.part([[328, 548], [356, 546], [358, 580], [330, 582]], { fill: '#3a2a1c', tex: 'mottle53', k: 0.6 }); f.flat(ell([344, 582], 9, 3, 0, 8), '#2a1a10', { op: 0.6 });
  f.line([[316, 546], [318, 562]], 1.2, '#2b2119');
  G.badge(f, [318, 562], 9, '#74777b', 0);
  // ---- bone-white shawl over the shoulders, knotted at the breast, fringed
  f.part([[256, 408], [298, 392], [346, 396], [374, 420], [372, 450], [354, 464, 1], [336, 450], [318, 480, 1], [300, 458], [278, 484, 1], [260, 462], [236, 474, 1], [232, 436]], RG(bone, { texOp: 0.45, shadow: '#5a5040' }));
  for (let i = 0; i < 6; i++) f.line([[240 + i * 20, 468 + (i % 2) * 8], [238 + i * 20, 482 + (i % 2) * 8]], 1.2, '#7a6a4a');
  f.flat([[280, 426], [310, 420], [312, 436], [282, 442]], '#5a4a2a', { op: 0.25 });
  f.part(ell([362, 440], 9, 8, 0.3, 10), RG(mix(bone, '#000', 0.12), { inkW: 1.2 })); // knot
  f.stroke([[360, 446], [368, 472], [362, 496]], 5, mix(bone, '#000', 0.1));
  // ---- head: thrust forward and bowed over the poppet; matted hair, bone pin, crooked grin
  f.bone('head');
  f.part(limb([318, 400], add(HC, [-18, 24]), 32, 28), SKN());
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 0.96, chin: 0.04, nose: 1.24, hook: 0.9, mouth: 'smirk', squint: 0.6, browDown: 0.07, age: true, gaunt: true, glint: true, iris: '#3a4a2a',
    hairCol: hair, noEar: true,
    hair: [[-0.52, 0.42], [-0.62, 0.06], [-0.54, -0.28], [-0.32, -0.5], [-0.04, -0.58], [0.2, -0.5], [0.34, -0.36], [0.24, -0.3], [0.2, -0.2], [0.08, -0.3], [-0.04, -0.22], [-0.16, -0.32], [-0.24, -0.08], [-0.3, 0.2], [-0.38, 0.5]],
    hairLines: [[[-0.46, -0.1], [-0.3, -0.34], [-0.06, -0.46]], [[-0.52, 0.2], [-0.44, -0.02], [-0.3, -0.22]], [[-0.4, 0.4], [-0.34, 0.1]]],
  });
  // crooked grin: one corner hitched up, a gap where a tooth should be
  f.flat(hf([[0.2, 0.265], [0.33, 0.215], [0.34, 0.25], [0.24, 0.29]]), '#2a0e0a');
  f.flat(hf([[0.25, 0.257], [0.27, 0.25], [0.275, 0.27], [0.255, 0.275]]), '#d8ccb0'); f.flat(hf([[0.3, 0.236], [0.32, 0.228], [0.325, 0.248], [0.305, 0.255]]), '#c8bc98');
  f.line(hf([[0.33, 0.2], [0.36, 0.17]]), 1.1, INK, { op: 0.7 });
  f.flat(hf(ell([0.25, 0.08], 0.02, 0.02, 0, 6)), '#4a3020'); // wart
  // loose locks hanging over the brow and down past the jaw
  for (const [p0, l, sw2, w] of [[[0.12, -0.42], 0.34, 0.06, 6], [[-0.1, -0.5], 0.5, 0.0, 7], [[-0.34, -0.36], 0.9, -0.06, 8], [[-0.46, -0.1], 0.86, -0.04, 9]]) { const r0 = hf([p0])[0]; f.stroke([r0, add(r0, [sw2 * H, l * 0.5 * H]), add(r0, [sw2 * 0.4 * H, l * H])], w, hair); } // locks hang with gravity, not with the head
  f.part(hf([[-0.3, -0.3], [0.1, -0.7], [0.13, -0.66], [-0.27, -0.26]]), { fill: bone, inkW: 1 }); // bone pin through the knot
  f.part(hf(ell([0.12, -0.7], 0.035, 0.035, 0, 8)), { fill: bone, inkW: 1 });
  f.part(hf([[-0.5, -0.14], [-0.6, -0.1], [-0.72, 0.18], [-0.64, 0.22], [-0.58, 0.02], [-0.48, -0.04]]), { fill: rubric, inkW: 1.1, cast: false }); // rubric rag tied in the hair
  // ---- wax shoulder plate on the near shoulder: three black tallow candles, wax running down the back
  const sc = [268, 402];
  f.bone('torso'); // the wax plate sits on the shoulder, so it stays with the torso when the arm moves
  f.part(G.lame(sc, 62, 22, -0.28, 10), { fill: wax, tex: 'mottle53' });
  f.line([add(sc, [-26, 14]), add(sc, [-6, 30]), add(sc, [14, 40])], 3, '#3a2618'); // strap under the arm
  for (let i = 0; i < 3; i++) {
    const c = add(sc, rot([-20 + i * 18, -4 - (i === 1 ? 6 : 0)], -0.28)), h = [30, 44, 22][i];
    f.part([add(c, [-5, 0]), add(c, [5, 0]), add(c, [4, -h]), add(c, [-4, -h])], { fill: '#1e1a18', inkW: 1.2, sharp: true });
    f.flat([add(c, [-5, -h + 4]), add(c, [-7, -h + 16]), add(c, [-5, -h + 22])], '#3a3632');
    const fl = add(c, [0, -h - 2]);
    f.raw(`<circle cx="${fl[0]}" cy="${fl[1] - 6}" r="16" fill="#ffb84a" opacity="0.22" filter="url(#soft53)"/>`);
    f.flat([add(fl, [-4, 0]), add(fl, [0, -15]), add(fl, [4, 0]), add(fl, [0, 3])], '#f0a03a');
    f.flat([add(fl, [-2, 0]), add(fl, [0, -7]), add(fl, [2, 0])], '#ffe8a0');
    f.line([add(fl, [0, -15]), add(fl, [3, -24]), add(fl, [-1, -32])], 1, '#2a2622', { op: 0.5 }); // greasy smoke
  }
  for (let i = 0; i < 5; i++) f.flat([add(sc, [-30 + i * 12, 10]), add(sc, [-26 + i * 12, 10]), add(sc, [-27 + i * 12, 22 + (i % 2) * 12]), add(sc, [-29 + i * 12, 22 + (i % 2) * 12])], '#2e2a26'); // wax runs
  // ---- near arm across the body, the poppet held out in the fist
  f.bone('upperarm_n');
  f.part(ragLimb(f, SN, lerp(SN, EN, 0.95), 40, 40, { depth: 6, teeth: 4 }), RG(ragL));
  split(f, () => f.part(chain([lerp(SN, EN, 0.85), EN, WN], [32, 34, 28], { bp: [[1, 0.3, 0.12]] }), SKN()), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 17)], ['forearm_n', side(EN, elb(SN, EN, WN), 17)]]);
  f.bone('forearm_n');
  for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.2 + i * 0.14, -14), lp(EN, WN, 0.26 + i * 0.14, 14)], 2, '#8a7a5a', { straight: true });
  f.bone('poppet');
  f.raw(`<circle cx="${pp[0]}" cy="${pp[1]}" r="26" fill="#6a8a4a" opacity="0.14" filter="url(#soft53)"/>`);
  f.part([add(pp, [-9, -22]), add(pp, [9, -22]), add(pp, [11, -10]), add(pp, [24, -4]), add(pp, [22, 4]), add(pp, [10, 2]), add(pp, [13, 32]), add(pp, [3, 34]), add(pp, [0, 14]), add(pp, [-3, 34]), add(pp, [-13, 32]), add(pp, [-10, 2]), add(pp, [-22, 4]), add(pp, [-24, -4]), add(pp, [-11, -10])], { fill: '#b89a52', tex: 'hatch53', texOp: 0.55, inkW: 1.4 }); // straw poppet
  for (let i = 0; i < 4; i++) f.line([add(pp, [-8 + i * 5, -8]), add(pp, [-6 + i * 5, 12])], 0.9, '#6a5428', { op: 0.8 }); // straw grain
  f.part([add(pp, [-11, -6]), add(pp, [11, -6]), add(pp, [12, 12]), add(pp, [-12, 12])], { fill: '#5a4a3a', tex: 'weave53', inkW: 1.1, cast: false }); // scrap of the victim's cloth
  f.part(ell(add(pp, [0, -30]), 11, 12, 0, 12), { fill: '#d8c8a0', tex: 'weave53', inkW: 1.3 });
  f.line([add(pp, [-12, -8]), add(pp, [12, -8])], 2.4, '#6a5428', { straight: true }); f.line([add(pp, [-12, 14]), add(pp, [12, 14])], 2, '#6a5428', { straight: true });
  f.flat(ell(add(pp, [-4, -31]), 2.2, 2.2, 0, 6), INK); f.flat(ell(add(pp, [4, -31]), 2.2, 2.2, 0, 6), INK);
  f.line([add(pp, [-4, -24]), add(pp, [4, -24])], 1, INK, { dash: '1.5 1.5' });
  f.line([add(pp, [-6, -41]), add(pp, [-10, -48])], 1, '#2a2018'); f.line([add(pp, [2, -42]), add(pp, [4, -50])], 1, '#2a2018'); // a few real hairs bound in
  f.bone('hand_n');
  B.fist(f, add(WN, [2, -4]), -0.15, 19, skin, { shadow: skinS, tex: 'mottle53' });
  f.line([add(WN, [-12, 4]), add(WN, [-6, 10])], 1.4, '#6a2a1a'); // fresh cut on the knuckle
  return f;
}

// ------------------------------------------------------------------ DROWNED THRALL (foe, faces left)
// Drawn facing right with the light from the upper right, then mirrored. Slumped over a bloated belly,
// weight sunk on the back foot, head hanging, the boat hook hauled across the body like an oar.
function thrall() {
  const f = new Fig(base(54, { light: [0.6, -0.8], shadowTint: '#2a2a38', mud: '#1e2a24', grimeY: 600 }));
  const H = 98;
  const skin = '#b6b6a4', skinS = '#6e6a7e', blotch = '#8a86a2', green = '#7a8c6c', stripeA = '#4c6480', stripeB = '#a2a39c', canvas = '#706a54', canvasD = '#585240', kelp = '#262a16', kelpL = '#6a7040';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle54', texOp: 0.6 }, o);
  f.defs.push(`<pattern id="stripe54" patternUnits="userSpaceOnUse" width="40" height="22" patternTransform="rotate(-8)"><rect width="40" height="10" fill="${stripeA}"/></pattern>`);
  const STR = `<rect x="0" y="0" width="600" height="820" fill="url(#stripe54)" opacity="0.85"/>`;
  const SH = (o = {}) => Object.assign({ fill: stripeB, tex: 'weave54', texOp: 0.45, over: STR, shadow: '#3e4250' }, o);
  // lividity blotches and marbled veins inside a skin region
  const livid = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.flat(ell(p, 3 + f.r() * 7, 2 + f.r() * 4, f.r() * 3, 8), f.r() > 0.45 ? blotch : green, { op: 0.4 }); } };
  const veins = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.line([p, add(p, [3 + f.r() * 6, 5 + f.r() * 5]), add(p, [f.r() * 12, 12 + f.r() * 8])], 0.9, '#57527e', { op: 0.6 }); } };
  const peel = (c, n) => { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * 22, (f.r() - 0.5) * 18]); f.flat([p, add(p, [7, -2]), add(p, [9, 3]), add(p, [3, 4])], '#e2e0d2', { op: 0.85 }); f.line([p, add(p, [7, -2])], 0.8, INK, { op: 0.6 }); } };
  // barnacles: low irregular cones in clusters, a dark slit at the top, never neat teeth
  const barnacle = (c, r) => { const j = () => (f.r() - 0.5) * r * 0.5; f.part([add(c, [-r + j(), r * 0.4]), add(c, [-r * 0.5 + j(), -r * 0.35 + j()]), add(c, [r * 0.4 + j(), -r * 0.45 + j()]), add(c, [r + j(), r * 0.4])], { fill: mix('#a9a596', '#6e6a5e', f.r() * 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.9, hatch: false }); f.line([add(c, [-r * 0.3, -r * 0.3]), add(c, [r * 0.25, -r * 0.35])], 1.4, '#1c1a1a'); };
  const mussel = (c, a) => { f.part(ell(c, 7, 3.6, a, 10), { fill: '#1d2332', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false }); f.line([add(c, rot([-5, -1], a)), add(c, rot([5, -1], a))], 0.9, '#6a7a9a', { op: 0.7 }); };

  const ellCap = (c, r) => ell(c, r, r, 0, 12);
  const pole0 = [96, 574], pole1 = [496, 352], pA = Math.atan2(pole1[1] - pole0[1], pole1[0] - pole0[0]);
  const gN = lerp(pole0, pole1, 0.31), gF = lerp(pole0, pole1, 0.74); // far fist just past the belly, where its forearm can reach it
  const SN = [236, 338], EN = [196, 428], SF = [306, 334], EF = [326, 380]; // far elbow hidden behind the chest, so the forearm comes down onto the pole
  const HN = [240, 538], KN = [224, 642], AN = [214, 744];
  const HF = [318, 546], KF = [350, 642], AF = [370, 744];
  const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
  const ankle = (K, A) => add(E.norm(sub(A, K)), [0.6, 0]); // ankle cut: the instep goes with the foot

  // skeleton (drawn facing right, mirrored by the renderer): pelvis is the root. The boat hook hangs on the near hand;
  // the far fist holds it too, so in the game the far arm follows the pole (two-bone IK onto the hook's far grip).
  f.joint('pelvis', [280, 540]).joint('torso', [285, 520], 'pelvis').joint('head', [292, 318], 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', gF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', gN, 'forearm_n').joint('boat_hook', gN, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');

  // ---- far arm, behind the belly: only the sleeve at the shoulder shows
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 50, 44), SH());
  f.bone('forearm_f');
  f.part(limb(EF, gF, 44, 40), SK());
  // ---- legs: canvas trousers rolled to mid-shin, bare swollen calves, bare splayed feet
  const cuff = (c, a2, w) => { const d = E.norm(a2), n = [-d[1], d[0]], P2 = (u, v) => add(c, add(mul(n, u), mul(d, v)));
    f.part([P2(w / 2 + 3, -10), P2(w / 4, -13), P2(-w / 4, -11), P2(-w / 2 - 4, -9), P2(-w / 2 - 5, 4), [...P2(-w / 3, 10), 1], P2(-w / 6, 6), [...P2(0, 12), 1], P2(w / 5, 7), [...P2(w / 2 + 2, 9), 1]], { fill: mix(canvas, '#fff', 0.08), tex: 'weave54', k: 0.8, shadow: '#3a3628' });
    f.line([P2(w / 2, -1), P2(0, 1), P2(-w / 2, -1)], 1.2, INK, { op: 0.55 }); f.line([P2(w / 4, -9), P2(w / 6, -2)], 1, INK, { op: 0.5 }); };
  const leg = (Hp, K, A, cut, wt, tint, sw, col, sd, sfx) => {
    const cu = lerp(K, A, cut);
    // the swollen calf and bare foot are one outline: cut at the ankle
    split(f, () => bareLeg(f, add(cu, [0, -12]), A, 1, 56, wt, SK({ fill: mix(skin, '#6e6a7e', tint) }), { swell: sw }), [['shin' + sfx, side(A, mul(ankle(K, A), -1), 20)], ['foot' + sfx, side(A, ankle(K, A), 20)]]);
    f.flat(ell(add(A, [14, 36]), 40, 9, 0, 14), '#4a3a6a', { op: 0.16 }); // blood pooled in the soles
    f.bone('shin' + sfx);
    livid(lerp(cu, A, 0.5), 14, 18, 6); veins(lerp(cu, A, 0.45), 12, 16, 4);
    // trouser tube from hip to mid-shin, cut at the knee
    split(f, () => f.part(chain([Hp, K, cu], [72, 56, wt + 8], sd > 0 ? { bq: [[0, 0.3, 0.12]] } : { bp: [[0, 0.3, 0.12]] }), { fill: col, tex: 'weave54', shadow: '#33301f' }), [['thigh' + sfx, side(K, mul(elb(Hp, K, A), -1), 28)], ['shin' + sfx, side(K, elb(Hp, K, A), 28)]]);
    f.stroke([lp(Hp, K, 0.86, -18 * sd), lp(Hp, K, 0.98, 0), lp(K, cu, 0.18, 16 * sd)], 2.2); // knee creases (the knee goes with the shin)
    f.stroke([lp(K, cu, 0.4, -14), lp(K, cu, 0.55, 2), lp(K, cu, 0.62, 16)], 1.8);
    cuff(cu, sub(A, K), wt + 10);
    return cu;
  };
  leg(HF, KF, AF, 0.5, 50, 0.12, 0.8, canvasD, 1, '_f');
  const cuN = leg(HN, KN, AN, 0.48, 54, 0.0, 1, canvas, -1, '_n');
  mussel(add(cuN, [-14, -4]), 0.3); mussel(add(cuN, [2, -6]), -0.2); mussel(add(cuN, [12, -2]), 0.5);
  f.bone('thigh_n');
  f.stroke([lp(HN, KN, 0.55, 20), lp(HN, KN, 0.7, 6), lp(HN, KN, 0.78, -14)], 2.2); // knee drag folds
  f.bone('thigh_f');
  f.stroke([lp(HF, KF, 0.5, -16), lp(HF, KF, 0.66, -2), lp(HF, KF, 0.74, 14)], 2);
  f.part([[300, 590], [318, 588], [320, 612], [302, 614]], { fill: mix(canvas, '#3a2a1a', 0.35), sharp: true, inkW: 1.1 }); // patch
  f.stitches([[300, 590], [318, 588], [320, 612], [302, 614], [300, 590]], '#b8ae90', 0.8);
  // ---- seat of the trousers and the belly: a pear, not a barrel
  f.bone('pelvis');
  f.part([[204, 494], [262, 512], [330, 520], [366, 518], [360, 566], [318, 578], [268, 576], [222, 566], [198, 540]], { fill: canvas, tex: 'weave54' });
  f.bone('torso');
  const torso = [[300, 300], [322, 316], [336, 344], [344, 374], [362, 402], [382, 436], [390, 470], [384, 500], [366, 524], [330, 534], [276, 530], [226, 520], [200, 500], [192, 464], [188, 420], [190, 376], [200, 338], [222, 308], [260, 292]];
  f.part(torso, SK());
  // shirt: rides up over the belly, hem torn into tatters
  const shirt = [[300, 300], [322, 316], [336, 344], [344, 374], [360, 400], [374, 424], [370, 440], [360, 432, 1], [354, 446], [344, 440, 1], [332, 474], [318, 452, 1], [306, 466], [296, 458, 1], [284, 482], [270, 470, 1], [252, 476], [240, 490, 1], [226, 484], [214, 496, 1], [200, 498], [192, 464], [188, 420], [190, 376], [200, 338], [222, 308], [260, 292]];
  f.part(shirt, SH());
  f.stroke([[224, 336], [240, 380], [236, 430]], 2.2); f.stroke([[300, 340], [314, 380], [330, 418]], 2); f.stroke([[268, 420], [286, 446], [282, 470]], 2);
  // a tear on the back shows grey skin
  f.part([[204, 404], [220, 398], [228, 420], [218, 442], [206, 436]], SK({ inkW: 1.2, cast: false }));
  f.line([[204, 404], [198, 398]], 1, INK); f.line([[218, 442], [222, 450]], 1, INK);
  // belly: stretch marks, navel, lividity pooled low
  livid([352, 492], 24, 18, 7);
  for (let i = 0; i < 4; i++) f.line([[338 + i * 9, 470 + i * 3], [346 + i * 9, 492 + i * 4]], 1, '#e8e4d8', { op: 0.55 });
  f.line([[372, 486], [376, 492], [372, 498]], 1.6, INK, { op: 0.8 });
  f.stroke([[330, 520], [356, 516], [380, 500]], 2.2, mix(skinS, '#000', 0.3)); // belly overhang shadow line
  // rope belt slung under the belly, knotted, a mussel cluster on the knot
  f.bone('pelvis');
  f.part([[198, 500], [262, 516], [330, 526], [362, 524], [362, 534], [330, 536], [262, 528], [198, 512]], { fill: '#8a7a58', tex: 'hatch54', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 9; i++) f.line([[206 + i * 18, 503 + i * 2.6], [212 + i * 18, 514 + i * 2.4]], 1, INK, { op: 0.6 });
  f.part(ell([228, 514], 9, 8, 0, 10), { fill: '#7a6a4a', tex: 'hatch54', inkW: 1.2 });
  f.stroke([[226, 520], [222, 548], [228, 580]], 4.5, '#7a6a4a'); f.stroke([[232, 520], [240, 546], [238, 566]], 4, '#6a5a3c');
  mussel([214, 520], 0.9); mussel([222, 528], 1.3); mussel([244, 526], -0.4);
  f.bone('torso');
  mussel([300, 452], 0.4); mussel([200, 486], 1.1);
  // barnacles crusting the hump of the back and the nape
  for (const [x, y, r] of [[226, 316, 7], [240, 304, 6], [212, 332, 6], [252, 296, 5], [204, 352, 5], [236, 324, 4], [222, 346, 4], [264, 298, 4], [198, 372, 4], [276, 292, 4.5]]) barnacle([x, y], r);
  // ---- head hanging forward and low: puffy, white-eyed, slack-mouthed
  const HC = [354, 282], hA = 0.55, HH = H * 1.04, hF = frame(HC, hA, HH);
  f.bone('head');
  f.part(limb([292, 318], add(HC, [-24, 22]), 50, 46), SK());
  for (const [x, y, r] of [[296, 300, 5], [306, 292, 4], [288, 310, 4]]) barnacle([x, y], r);
  const hf = B.head(f, HC, HH, hA, {
    skin, jaw: 1.38, chin: -0.04, nose: 1.0, hook: -0.2, mouth: 'set', squint: -0.25, browDown: -0.03, faceShade: 0.7, jawShade: 0.3,
    iris: '#c8cec6', eyeWhite: '#e4e6de', hairCol: kelp, browCol: '#4a5240',
  });
  f.flat(hF(ell([0.1, 0.12], 0.17, 0.12, 0, 12)), '#d4d6c8', { op: 0.3 }); // swollen cheek
  f.flat(hF(ell([0.11, -0.03], 0.1, 0.04, 0, 10)), '#7a7898', { op: 0.5 }); // puffy lower lid
  livid(hF([[0.0, 0.1]])[0], 14, 10, 4);
  // slack open mouth, blue lips
  f.flat(hF([[0.17, 0.26], [0.25, 0.25], [0.31, 0.27], [0.3, 0.37], [0.24, 0.41], [0.18, 0.38]]), '#4f6a8e');
  f.flat(hF([[0.19, 0.28], [0.25, 0.275], [0.29, 0.29], [0.28, 0.35], [0.23, 0.38], [0.2, 0.35]]), '#0c1012');
  f.flat(hF(ell([0.24, 0.38], 0.016, 0.03, 0, 6)), '#9ec0d0', { op: 0.9 }); // water running from the mouth
  // kelp hair: a sodden mat on the scalp, strands hanging straight down over the face
  f.part(hF([[-0.42, 0.18], [-0.48, -0.14], [-0.36, -0.42], [-0.08, -0.56], [0.2, -0.52], [0.34, -0.36], [0.26, -0.3], [0.2, -0.38], [0.1, -0.3], [-0.04, -0.4], [-0.16, -0.26], [-0.26, -0.1], [-0.3, 0.16]]), { fill: kelp, tex: 'hatch54', texOp: 0.35, shadow: '#141a10' });
  const strand = (t0, len, w, sway) => { const p0 = hF([t0])[0], pts = [p0, add(p0, [sway * 0.4, len * 0.35]), add(p0, [sway, len * 0.7]), add(p0, [sway * 0.6, len])]; f.stroke(pts, w, kelp); f.line(pts.slice(0, 3).map(q => add(q, [-w * 0.18, 0])), 1, kelpL, { op: 0.7 }); return pts[3]; };
  const ends = [];
  for (const [t0, l, w, s] of [[[-0.42, -0.1], 124, 11, -8], [[-0.34, -0.34], 140, 8, 6], [[-0.16, -0.48], 118, 10, 12], [[0.3, -0.36], 58, 7, 4], [[0.12, -0.5], 104, 9, -10], [[-0.02, -0.54], 84, 5, 16]]) ends.push(strand(t0, l, w, s));
  for (const e of ends) f.flat(ell(add(e, [0, 7]), 2, 3.4, 0, 6), '#9ec0d0', { op: 0.85 }); // drips
  // ---- the boat hook: wet ash pole with rope wraps, rusted iron socket, spike and recurved hook
  f.bone('boat_hook');
  f.part(limb(pole0, pole1, 14, 13, { steps: 8 }), { fill: '#5a4a34', tex: 'wood54', shadow: '#2a2620' });
  f.line([lp(pole0, pole1, 0.02, -3), lp(pole0, pole1, 0.98, -3)], 1, '#9a8a6a', { op: 0.45, straight: true });
  for (const t of [0.08, 0.5, 0.54]) f.line([lp(pole0, pole1, t, -8), lp(pole0, pole1, t + 0.015, 8)], 3, '#7a6a48', { straight: true });
  const hk = frame(pole1, pA, 1);
  f.part(hk([[-8, 6], [8, 9], [24, 20], [26, 36], [14, 46], [-4, 44, 1], [10, 36], [14, 26], [8, 17], [-8, 14]]), { fill: '#6a4632', tex: 'mottle54', texOp: 0.7, shadow: '#2a1a14' });
  f.part(hk([[4, -5], [50, -2], [64, 0, 1], [50, 3], [4, 6]]), { fill: '#6e4a34', shadow: '#2a1a14', inkW: 1.3 });
  f.part(hk([[-38, -10, 1], [2, -9], [8, 0], [2, 9], [-38, 10, 1]]), { fill: '#5e3e2c', tex: 'mottle54', texOp: 0.7, shadow: '#2a1a14' });
  f.flat(hk([[-30, -6], [-6, -6], [-6, 6], [-30, 6]]), '#8a4a22', { op: 0.45 }); // rust bloom
  for (const [x, y] of [[-24, -3], [-12, 4], [16, 0], [12, 30], [30, -1]]) f.flat(ell(hk([[x, y]])[0], 2.6, 2, 0, 6), '#3e6a5a', { op: 0.7 }); // verdigris and pits
  const kh = hk([[14, 44]])[0]; f.stroke([kh, add(kh, [-6, 22]), add(kh, [2, 42]), add(kh, [-2, 60])], 6, kelp); f.flat(ell(add(kh, [-2, 66]), 2, 3.4, 0, 6), '#9ec0d0');
  // ---- far fist on the pole, swollen fingers wrapped round it
  f.bone('hand_f');
  B.grip(f, gF, EF, pA, 28, mix(skin, '#6e6a7e', 0.1), { tex: 'mottle54', texOp: 0.5, shadow: skinS, name: 'thrall far' });
  for (let i = 0; i < 3; i++) f.line([add(gF, [-14 + i * 5, -6 + i * 4]), add(gF, [-8 + i * 5, -2 + i * 4])], 0.9, INK, { op: 0.5 });
  peel(gF, 2);
  // ---- near arm: torn sleeve, swollen forearm with the void hole clean through it
  // forearm first, rising out of the sleeve, so the elbow is a soft bend and not a cut-off tube
  f.bone('upperarm_n');
  split(f, () => f.part(chain([lerp(SN, EN, 0.55), EN, gN], [44, 50, 46], { bp: [[1, 0.3, 0.14]], bq: [[1, 0.45, 0.1]] }), SK()), [['upperarm_n', side(EN, mul(elb(SN, EN, gN), -1), 25)], ['forearm_n', side(EN, elb(SN, EN, gN), 25)]]);
  f.bone('upperarm_n');
  f.part(ellCap(lerp(SN, EN, 0.55), 22), SK({ inkW: 0, cast: false }));
  const aA = Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) * 57.3 + 90;
  f.defs.push(`<pattern id="stripeArm54" patternUnits="userSpaceOnUse" width="40" height="22" patternTransform="rotate(${aA.toFixed(1)})"><rect width="40" height="10" fill="${stripeA}"/></pattern>`);
  f.part(ragLimb(f, SN, lerp(SN, EN, 0.86), 60, 58, { p: [[0.4, 0.12, 0.2]], depth: 10, teeth: 6 }), SH({ over: `<rect x="0" y="0" width="600" height="820" fill="url(#stripeArm54)" opacity="0.85"/>` }));
  for (const [t, o2, l] of [[0.84, 18, 24], [0.86, -14, 16]]) { const q = lp(SN, EN, t, o2); f.part([add(q, [-5, -4]), add(q, [5, -4]), add(q, [3, l]), add(q, [-1, l + 4]), add(q, [-4, l - 2])], SH({ inkW: 1.1, inkHeavy: 1.6, cast: false })); } // shreds hanging off the torn sleeve
  for (const [x, y, r] of [[226, 332, 6], [214, 344, 5], [240, 318, 5]]) barnacle([x, y], r);
  f.bone('forearm_n');
  livid(lerp(EN, gN, 0.5), 16, 16, 4); veins(lerp(EN, gN, 0.3), 10, 12, 3);
  const vh = lp(EN, gN, 0.52, 2), va = Math.atan2(gN[1] - EN[1], gN[0] - EN[0]);
  f.raw(`<ellipse cx="${vh[0]}" cy="${vh[1]}" rx="22" ry="18" fill="#6a4aa0" opacity="0.28" filter="url(#soft54)"/>`);
  f.part(ell(vh, 15, 12, va, 18), { fill: '#e8e2d8', shade: 0.2, inkW: 1.4, inkHeavy: 1.4, cast: false, hatch: false }); // clean pale edge of the wound
  f.flat(ell(add(vh, [1, 1]), 12, 9.5, va, 18), '#06050a');
  f.flat(ell(add(vh, [3, 2]), 5, 4, va, 10), '#2a1c44', { op: 0.9 }); // the void, faintly violet at its heart
  f.bone('hand_n');
  B.grip(f, gN, EN, pA, 28, skin, { tex: 'mottle54', texOp: 0.5, shadow: skinS, name: 'thrall near' });
  for (let i = 0; i < 3; i++) f.line([add(gN, [-14 + i * 5, -6 + i * 4]), add(gN, [-8 + i * 5, -2 + i * 4])], 0.9, INK, { op: 0.5 });
  peel(gN, 3);
  for (const d of [add(gN, [8, 26]), add(gN, [18, 34])]) f.flat(ell(d, 2, 3.4, 0, 6), '#9ec0d0', { op: 0.85 }); // dripping
  // standing water round the feet: on the ground, so on no bone
  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 44]), 46, 5, 0, 14), '#3a4a4a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ MOTHER HILD, THE SMITH (keeper)
// Short, square and powerful: shoulders wider than the hips, a low centre of gravity, hammer on the shoulder,
// tongs holding a bar still glowing. Habit, black scapular, leather apron: three layers, each with its own edge.
function smith() {
  const f = new Fig(base(55, { keyTint: '#ffd8a0', shadowTint: '#2e1e1a', grimeY: 650 }));
  const H = 94;
  const habit = '#75695a', habitD = '#5e5446', scap = '#262220', apron = '#5a3a24', skin = '#c89474', skinS = '#7a4a3e', boot = '#2e2218';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: 'mottle55', texOp: 0.45 }, o);
  const HB = (o = {}) => Object.assign({ fill: habit, tex: 'weave55', texOp: 0.55 }, o);
  const SN = [234, 362], EN = [228, 462], WN = [300, 408];
  const SF = [358, 360], EF = [382, 452], WF = [424, 498];
  const hh = [200, 296], hEnd = [318, 424], hA = Math.atan2(hh[1] - hEnd[1], hh[0] - hEnd[0]);
  const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
  const AF = [352, 746], AN = [240, 748], WB = [290, 494], dW = [0, 1]; // ankles; the waist, on the rope belt
  const ankleCut = A => side(A, [0.45, 0.89], 20), shinCut = A => side(A, [-0.45, -0.89], 20); // the instep goes with the foot

  // skeleton: pelvis is the root. Legs are hidden under the habit; the boots carry the shins and feet.
  f.joint('pelvis', [292, 510]).joint('torso', WB, 'pelvis').joint('head', [300, 344], 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [236, 352], 'torso').joint('apron', [326, 492], 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('tongs', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('hammer', lerp(hEnd, hh, 0.12), 'hand_n');
  f.joint('thigh_f', [338, 520], 'pelvis').joint('shin_f', [346, 636], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [252, 520], 'pelvis').joint('shin_n', [244, 638], 'thigh_n').joint('foot_n', AN, 'shin_n');

  // ---- hammer head behind the near shoulder (the haft is drawn later, over the shoulder)
  const HF2 = frame(hh, hA + Math.PI / 2, 1);
  f.bone('hammer');
  f.part(HF2([[-34, -15, 1], [28, -17, 1], [36, -12], [38, 12], [28, 17, 1], [-34, 15, 1], [-42, 8], [-42, -8]]), { fill: '#4a4c50', tex: 'mottle55', texOp: 0.5 });
  f.part(HF2([[28, -17, 1], [36, -12], [38, 12], [28, 17, 1], [30, 0]]), { fill: '#6a6c70', inkW: 1.1, cast: false }); // striking face, worn bright
  f.line(HF2([[-30, -11], [24, -13]]), 1.4, '#d8c8b0', { op: 0.5 });
  f.flat(HF2([[36, -6], [39, -2], [36, 2]]), '#1a1a1a'); // chipped edge
  // ---- far arm: sleeve pushed above the elbow, thick bare forearm, tongs
  f.bone('upperarm_f');
  f.part(ragLimb(f, SF, lerp(SF, EF, 0.92), 56, 60, { q: [[0.5, 0.12, 0.2]], depth: 6, teeth: 5 }), HB({ fill: habitD }));
  split(f, () => f.part(chain([lerp(SF, EF, 0.8), EF, WF], [46, 50, 40], { bp: [[1, 0.3, 0.14]] }), SKN()), [['upperarm_f', side(EF, mul(elb(SF, EF, WF), -1), 24)], ['forearm_f', side(EF, elb(SF, EF, WF), 24)]]);
  f.bone('forearm_f');
  for (let i = 0; i < 4; i++) f.flat(ell(lp(EF, WF, 0.2 + i * 0.17, (i % 2 ? 8 : -6)), 6, 3.4, 0.6, 8), mix(skin, '#e8c0a8', 0.5), { op: 0.8 }); // shiny old burn scars
  f.part(plate(EF, WF, 0.68, 0.98, 46, 44), { fill: '#3a2a1c', tex: 'mottle55' }); // leather wrist guard
  f.line([lp(EF, WF, 0.75, 22), lp(EF, WF, 0.75, -22)], 1.2, '#8a7a5a', { op: 0.7 });
  // tongs: two reins into the fist, a pivot rivet, curved jaws closed on the bar
  const tp = [486, 566], ta = Math.atan2(tp[1] - WF[1], tp[0] - WF[0]), T = frame(tp, ta, 1);
  f.bone('tongs');
  f.part(T([[-86, -6], [0, -4], [4, 0], [0, 4], [-86, 3]]), { fill: '#2e2e30', inkW: 1.1, inkHeavy: 1.6, cast: false });
  f.part(T([[-88, 3], [-2, 2], [2, 8], [-4, 10], [-88, 10]]), { fill: '#3a3a3c', inkW: 1.1, inkHeavy: 1.6, cast: false });
  f.part(T([[-4, -5], [14, -9], [28, -8], [30, -3], [16, -3], [2, 2]]), { fill: '#2e2e30', inkW: 1.1, cast: false });
  f.part(T([[-4, 8], [14, 13], [28, 11], [30, 6], [16, 6], [2, 4]]), { fill: '#3a3a3c', inkW: 1.1, cast: false });
  f.rivet(tp, 3.2, '#6a6a6a');
  const bc = T([[28, 1]])[0];
  f.raw(`<ellipse cx="${bc[0]}" cy="${bc[1]}" rx="54" ry="34" fill="#ff8a2a" opacity="0.3" filter="url(#soft55)"/>`);
  const BR = frame(bc, ta + 1.25, 1);
  f.part(BR([[-6, -30, 1], [6, -30, 1], [6, 30, 1], [-6, 30, 1]]), { fill: '#e0702a', shade: 0.2, inkW: 1.4, hatch: false });
  f.flat(BR([[-3, -26], [3, -26], [3, 26], [-3, 26]]), '#ffd27a');
  f.flat(BR([[-6, 18], [6, 18], [6, 30], [-6, 30]]), '#9a3a1a', { op: 0.6 }); // cooling end
  for (let i = 0; i < 6; i++) { const a = -2.2 + i * 0.42; f.line([add(bc, rot([12, 0], a)), add(bc, rot([22 + (i % 3) * 6, 0], a))], 1.2, '#ffc060', { straight: true }); }
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 26, skin, { shadow: skinS, tex: 'mottle55', texOp: 0.4, inline: true }); // tongs run on from the forearm through the palm, thumb on top
  // ---- legs in wool hose under the habit: hidden in the rest pose, there for the rig when the skirt swings or she strides
  for (const [sfx, Hp, K, A] of [['_f', [338, 520], [346, 636], AF], ['_n', [252, 520], [244, 638], AN]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, K, 50, 42, { steps: 8 }), { fill: '#5a5046', tex: 'weave55' });
    f.bone('shin' + sfx); f.part(limb(K, lerp(K, A, 0.6), 42, 38, { steps: 8 }), { fill: '#5a5046', tex: 'weave55' });
  }
  // ---- legs: short, wide, heavy boots under a mid-calf hem (each boot cut at the ankle into shin and foot)
  split(f, () => B.boot(f, AF, 1, 56, boot, { shaft: 1.0, strap: true, tex: 'mottle55' }), [['shin_f', shinCut(AF)], ['foot_f', ankleCut(AF)]]);
  split(f, () => B.boot(f, AN, 1, 56, mix(boot, '#000', 0.1), { shaft: 1.0, strap: true, tex: 'mottle55' }), [['shin_n', shinCut(AN)], ['foot_n', ankleCut(AN)]]);
  f.bone('shin_n');
  f.part([[218, 690], [262, 688], [262, 712], [218, 714]], { fill: '#5a5046', tex: 'weave55', inkW: 1.2 }); // wool hose above the boot
  f.bone('shin_f');
  f.part([[330, 690], [374, 688], [374, 712], [330, 714]], { fill: '#5a5046', tex: 'weave55', inkW: 1.2 });
  // ---- back panel of the scapular, hanging behind
  f.bone('robe_back');
  f.part([[238, 348], [206, 370], [194, 460], [186, 560], [176, 668], [186, 684], [198, 674], [208, 684], [214, 560], [226, 450]], { fill: scap, tex: 'weave55', texOp: 0.4 });
  // ---- habit: square shoulders, belted waist, skirt flaring over the hips, front knee pushing the cloth
  const hab = [[318, 334], [342, 340], [366, 352], [380, 380], [380, 432], [370, 486], [380, 528], [392, 580], [400, 636], [406, 700, 1],
    [380, 708], [354, 700, 1], [324, 712], [296, 702, 1], [266, 710], [236, 700, 1], [208, 708], [180, 700, 1], [184, 640], [194, 584], [204, 530], [214, 494], [204, 450], [202, 400], [214, 366], [240, 346], [282, 332]];
  // one habit shape, cut at the rope belt: the skirt copy reaches up under the torso copy, which stops at the belt
  split(f, () => f.part(hab, HB()), [['skirt', side([290, 450], dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('skirt');
  for (const q of [[[216, 540], [204, 620], [196, 698]], [[244, 548], [240, 630], [244, 704]], [[388, 590], [396, 650], [398, 700]], [[222, 500], [228, 530], [226, 560]]]) f.stroke(q, 2.2);
  f.stroke([[358, 600], [376, 640], [380, 690]], 1.8);
  f.flat([[184, 640], [404, 640], [406, 712], [180, 712]], '#2a1e12', { op: 0.25 }); // wet, muddy hem
  f.line([[204, 702], [240, 696], [268, 704], [296, 698], [322, 706], [350, 696], [372, 702], [392, 698]], 1, '#cfc0a0', { op: 0.5, dash: '2 3' }); // frayed hem threads
  f.part([[214, 600], [238, 598], [240, 630], [216, 632]], { fill: mix(habit, '#3a3020', 0.3), tex: 'weave55', inkW: 1.1, sharp: true }); // darn patch
  f.stitches([[214, 600], [238, 598], [240, 630], [216, 632], [214, 600]], '#b8a888', 0.8);
  // ---- scapular front: over the shoulder and down the side of the apron to below the knee
  // cut at the waist under the apron: the lower half swings with the skirt
  split(f, () => f.part([[300, 334], [338, 338], [356, 352], [354, 420], [350, 500], [356, 600], [360, 640, 1], [316, 644, 1], [314, 600], [310, 500], [300, 420], [292, 360]], { fill: scap, tex: 'weave55', texOp: 0.4 }), [['skirt', side([290, 450], dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('torso');
  f.line([[330, 360], [330, 384]], 1.4, '#9a9080'); f.line([[322, 370], [338, 370]], 1.4, '#9a9080'); // stitched grey cross on the scapular at the breast
  // ---- leather apron: bib to the chest, stiff skirt to the knee, scorched
  // the stiff leather apron is one piece: it rides on the torso and can swing a little about the waist
  f.bone('apron');
  const ap = [[312, 396], [358, 390], [366, 440], [368, 492], [380, 540], [388, 600], [392, 652, 1], [362, 660], [330, 654, 1], [300, 664], [272, 656, 1], [270, 600], [272, 540], [284, 492], [296, 440]];
  f.part(ap, { fill: apron, tex: 'mottle55', texOp: 0.6, k: 0.8, shadow: '#2a1810' });
  f.line([[316, 400], [354, 394]], 1, '#a07a50', { op: 0.6, dash: '3 2' });
  f.bone('torso');
  f.line([[300, 400], [306, 340], [328, 330]], 3.5, '#3a2618'); // neck strap
  f.bone('apron');
  for (const [x, y, r] of [[340, 560], [366, 610], [318, 628], [300, 560], [350, 470], [330, 520]]) { f.flat(ell([x, y], r, r * 0.7, 0.4, 10), '#140a06', { op: 0.75 }); f.line(ell([x, y], r + 2, r * 0.7 + 2, 0.4, 10), 1, '#a0784a', { op: 0.45 }); }
  for (const r of [3, 4, 2.5, 3.5]) f.flat(ell([300 + r * 16, 600 - r * 22], r * 0.7, r * 0.5, 0, 8), '#140a06', { op: 0.75 }); // spark pocks
  f.stroke([[332, 500], [340, 580], [338, 650]], 2.2, '#24140a'); f.stroke([[296, 520], [290, 590], [288, 650]], 1.8, '#24140a');
  // pocket on the apron: a file and a stick of chalk
  f.part([[288, 540], [326, 536], [328, 578], [290, 582]], { fill: mix(apron, '#000', 0.2), tex: 'mottle55', sharp: true, inkW: 1.3 });
  f.part([[296, 520], [302, 518], [306, 540], [300, 542]], { fill: '#5a5a5c', sharp: true, inkW: 1 });
  f.part([[312, 528], [318, 526], [320, 540], [314, 542]], { fill: '#e0dcd0', sharp: true, inkW: 1 });
  f.stitches([[290, 544], [324, 540]], '#a08060', 0.8);
  // ---- rope belt over the habit, apron ties knotted behind, key ring on the hip, lead badge on a cord
  f.bone('torso');
  f.part([[210, 486], [276, 492], [276, 504], [208, 500]], { fill: '#8a7a56', tex: 'hatch55', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 5; i++) f.line([[214 + i * 13, 487 + i], [220 + i * 13, 500 + i]], 1, INK, { op: 0.6 });
  f.stroke([[214, 498], [206, 530], [210, 566]], 4, '#3a2618'); f.stroke([[218, 498], [228, 524], [224, 548]], 3.5, '#3a2618'); // apron ties
  const kr = [244, 540];
  f.line([[246, 502], kr], 2, '#3a2a1a');
  ring(f, kr, 13, 13, 3.4, '#3a3a3c'); ring(f, kr, 13, 13, 1, '#8a8a88', { op: 0.6 });
  for (let i = 0; i < 4; i++) { const a = 1.25 + i * 0.2, k0 = add(kr, rot([12, 0], a)), k1 = add(kr, rot([42 - i * 4, 0], a)); f.line([k0, k1], 3.6, '#3e3e40', { straight: true }); f.line([k1, add(k1, rot([0, 7], a)), add(k1, rot([-5, 7], a))], 3, '#3e3e40', { straight: true }); f.part(ell(k0, 4.6, 4.6, 0, 8), { fill: '#4a4a4c', inkW: 1, cast: false }); }
  f.line([[282, 500], [286, 530]], 1.2, '#2b2119');
  G.badge(f, [286, 530], 10, '#74777b', 0.05);
  // ---- head: broad face, set mouth, cropped grey hair lifting with static, a burn on the cheek
  const HC = [314, 290];
  f.bone('head');
  f.part(limb([300, 344], add(HC, [-6, 30]), 50, 46), SKN());
  // folded-down cowl round the neck
  f.bone('torso');
  f.part([[262, 344], [290, 326], [330, 326], [350, 340], [346, 356], [320, 360], [290, 362], [266, 360]], HB({ fill: habitD, k: 0.8 }));
  f.stroke([[276, 346], [300, 350], [326, 346]], 2);
  f.bone('head');
  const hf = B.head(f, HC, H, 0.04, {
    skin, jaw: 1.04, chin: 0.01, nose: 1.08, hook: -0.1, mouth: 'set', squint: 0.4, browDown: 0.05, age: true, glint: true, lips: true, lashes: true, faceShade: 0.85, faceHatch: false,
    hairCol: '#8e877c', browCol: '#6a625a', browW: 0.05,
    hair: [[-0.4, 0.12], [-0.46, -0.18], [-0.32, -0.46], [-0.04, -0.58], [0.22, -0.52], [0.34, -0.36], [0.26, -0.3], [0.14, -0.38], [0.0, -0.32], [-0.14, -0.36], [-0.22, -0.2], [-0.26, 0.04], [-0.32, 0.18]],
    hairLines: [[[-0.36, -0.1], [-0.22, -0.36], [0.02, -0.48]], [[-0.3, 0.06], [-0.3, -0.18], [-0.12, -0.42]], [[0.06, -0.48], [0.2, -0.44], [0.28, -0.36]]],
  });
  // frizz lifting off the crown with static: short wavy wisps, uneven, densest at the back
  for (let i = 0; i < 16; i++) { const a = -2.8 + i * 0.13 + (f.r() - 0.5) * 0.1, b0 = hf([[Math.cos(a) * 0.38, Math.sin(a) * 0.46 - 0.12]])[0], l = 4 + f.r() * (i < 9 ? 9 : 5), w = (f.r() - 0.5) * 0.8; f.line([b0, add(b0, rot([l * 0.5, 2], a + w)), add(b0, rot([l, -1], a - w * 0.5))], 0.9 + f.r() * 0.5, i % 3 ? '#a8a094' : '#6e675c', { op: 0.85 }); }
  f.part(hf([[-0.46, -0.12], [-0.6, -0.2], [-0.62, -0.02], [-0.52, 0.06], [-0.42, 0.0]]), { fill: '#8e877c', tex: 'hatch55', texOp: 0.4, inkW: 1.2 }); // short braid tucked at the back
  f.flat(hf(ell([0.04, 0.16], 0.08, 0.05, 0.3, 10)), mix(skin, '#e8c0a8', 0.5), { op: 0.85 }); // burn scar on the cheek
  f.line(hf([[0.0, 0.14], [0.08, 0.18]]), 0.9, INK, { op: 0.5 });
  // ---- near arm: sleeve bunched above the elbow, fist round the haft near its end
  split(f, () => f.part(chain([lerp(SN, EN, 0.82), EN, WN], [50, 54, 44], { bq: [[1, 0.3, 0.14]] }), SKN()), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 26)], ['forearm_n', side(EN, elb(SN, EN, WN), 26)]]);
  f.bone('forearm_n');
  for (let i = 0; i < 3; i++) f.flat(ell(lp(EN, WN, 0.3 + i * 0.2, (i % 2 ? 6 : -8)), 6, 3.4, 0.4, 8), mix(skin, '#e8c0a8', 0.5), { op: 0.8 });
  f.line([lp(EN, WN, 0.25, -10), lp(EN, WN, 0.6, -12)], 1, mix(skin, '#000', 0.4), { op: 0.5 }); // tendon
  f.bone('upperarm_n');
  f.part(ragLimb(f, SN, lerp(SN, EN, 0.88), 60, 64, { p: [[0.5, 0.12, 0.2]], depth: 6, teeth: 5 }), HB());
  f.part(ell(lerp(SN, EN, 0.86), 33, 12, Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) + Math.PI / 2, 14), HB({ fill: habitD })); // bunched roll of sleeve
  f.stroke([lp(SN, EN, 0.3, 18), lp(SN, EN, 0.5, 6), lp(SN, EN, 0.66, 16)], 2);
  // haft over the shoulder, rubric thread wound round it (the abbey's mark on its tools)
  f.bone('hammer');
  f.part(limb(hEnd, hh, 14, 13, { steps: 6 }), { fill: '#5a3e26', tex: 'wood55' });
  f.line([lp(hEnd, hh, 0.05, -3), lp(hEnd, hh, 0.95, -3)], 1, '#a08050', { op: 0.5, straight: true });
  for (let i = 0; i < 3; i++) f.line([lp(hEnd, hh, 0.5 + i * 0.035, -8), lp(hEnd, hh, 0.52 + i * 0.035, 8)], 2.2, rubric, { straight: true });
  f.bone('hand_n');
  B.grip(f, lerp(hEnd, hh, 0.12), EN, hA, 27, skin, { shadow: skinS, tex: 'mottle55', texOp: 0.4, name: 'smith hammer' }); // thumb toward the head, knuckles away from the elbow
  return f;
}

module.exports = {
  heroes: [
    { key: 'alchemist', build: alchemist },
    { key: 'oracle', build: oracle },
    { key: 'hexweaver', build: hexweaver },
    { key: 'thrall', build: thrall, flip: true },
    { key: 'smith', build: smith },
  ],
};
