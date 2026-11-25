// Hero path variants, batch B: Alchemist, Oracle and Hexweaver, three paths each (bible/01_company.md "Paths:").
// Each builder is a copy of its base in dirAC2.js (same body, face, scale, stance family, badge and rubric strip) with
// the path's listed changes branched in. Base bones are always declared; new held objects get their own bones.
// Seeds 7200-7208. Heroes face right.
'use strict';
const K = require('../kit');
const { E, B, G, INK, base, ring, rubric, chain, ragLimb, bareLeg } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { split, side } = require('../dirAC');

// dull metals: brass and copper stay greener and duller than gold (gold is for holy things only)
const BRASS = '#857446', BRASS_D = '#4a3e22', BRASS_L = '#b8a874', VERD = '#5a7a64', COPPER = '#74462a', COPPER_L = '#c08a5a';
const IRON = '#46484a', IRON_D = '#26282a';
const BLOOD = '#6e1410', BLOOD_F = '#8a1a12';
// pseudo-script: words of slanted minims, small loops, ascenders and descenders along a baseline (rubric writing).
// pts: baseline (any direction; "up" is to the left of travel), h: x-height
function script(f, pts, h, col, o = {}) {
  const w = o.w || 1.1, op = o.op || 0.9;
  for (let s = 0; s < pts.length - 1; s++) {
    const a = pts[s], b = pts[s + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), n = [d[1], -d[0]];
    const P = (u, x, y) => add(add(a, mul(d, u + x)), mul(n, y));
    let u = 1 + f.r() * 3;
    while (u < L - 4) {
      const letters = 2 + Math.floor(f.r() * 5);
      for (let k = 0; k < letters && u < L - 2; k++) {
        const r = f.r();
        if (r < 0.55) { f.line([P(u, 0, 0), P(u, h * 0.22, h)], w, col, { op, straight: true }); u += h * 0.45; }
        else if (r < 0.72) { const e = ell(P(u, h * 0.35, h * 0.5), h * 0.32, h * 0.45, Math.atan2(d[1], d[0]), 8); f.line(e.concat([e[0]]), w * 0.9, col, { op }); u += h * 0.8; }
        else if (r < 0.86) { f.line([P(u, 0, 0), P(u, h * 0.4, h * 1.9), P(u, h * 0.7, h * 1.7)], w, col, { op }); u += h * 0.5; }
        else { f.line([P(u, h * 0.2, h), P(u, 0, 0), P(u, -h * 0.2, -h * 0.8)], w, col, { op }); u += h * 0.5; }
      }
      u += h * (0.9 + f.r() * 0.8); // word gap
    }
  }
}
// an iron chain from a to b: touching oval links, alternately seen flat and edge-on
function chainLinks(f, a, b, w = 4, col = IRON) {
  const L = E.len(sub(b, a)), n = Math.max(2, Math.round(L / (w * 1.5))), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  for (let i = 0; i < n; i++) {
    const p = lerp(a, b, (i + 0.5) / n);
    if (i % 2) f.line([add(p, rot([-w * 0.95, 0], ang)), add(p, rot([w * 0.95, 0], ang))], w * 0.55, INK, { straight: true });
    else { const e = ell(p, w * 1.0, w * 0.62, ang, 10); f.line(e.concat([e[0]]), 2.2, INK); f.line(e.concat([e[0]]), 1.1, col); }
  }
}
// small straw poppet hanging from a cord at `top` (belt charms)
function smallPoppet(f, top, s, S, o = {}) {
  const c = add(top, [0, 18 * s]);
  f.line([top, add(c, [0, -10 * s])], 1.2, '#3a2a1a');
  f.part([add(c, [-6 * s, -6 * s]), add(c, [6 * s, -6 * s]), add(c, [7 * s, 0]), add(c, [15 * s, 4 * s]), add(c, [14 * s, 9 * s]), add(c, [6 * s, 6 * s]), add(c, [8 * s, 24 * s]), add(c, [2 * s, 25 * s]), add(c, [0, 12 * s]), add(c, [-2 * s, 25 * s]), add(c, [-8 * s, 24 * s]), add(c, [-6 * s, 6 * s]), add(c, [-14 * s, 9 * s]), add(c, [-15 * s, 4 * s]), add(c, [-7 * s, 0])], { fill: o.fill || '#a68e4e', tex: 'hatch' + S, texOp: 0.5, inkW: 1.2, cast: false });
  f.part(ell(add(c, [0, -10 * s]), 7 * s, 7.5 * s, 0, 10), { fill: '#d0c098', tex: 'weave' + S, inkW: 1.1, cast: false });
  f.line([add(c, [-7 * s, 2 * s]), add(c, [7 * s, 2 * s])], 1.6, '#6a5428', { straight: true });
  f.flat(ell(add(c, [-2.4 * s, -11 * s]), 1.3, 1.3, 0, 6), INK); f.flat(ell(add(c, [2.4 * s, -11 * s]), 1.3, 1.3, 0, 6), INK);
  if (o.blood) { f.flat([add(c, [-5 * s, -2 * s]), add(c, [4 * s, -4 * s]), add(c, [6 * s, 8 * s]), add(c, [1 * s, 14 * s]), add(c, [-4 * s, 9 * s])], BLOOD, { op: 0.75 }); f.flat([add(c, [1 * s, 14 * s]), add(c, [3 * s, 14 * s]), add(c, [2.4 * s, 22 * s]), add(c, [1.4 * s, 22 * s])], BLOOD, { op: 0.7 }); }
  if (o.pin) f.line([add(c, [-9 * s, -16 * s]), add(c, [4 * s, -4 * s])], 1.2, '#5e6266');
}

// ================================================================== ALCHEMIST
// path: 'transmuter' | 'plaguewright' | 'apothecary'
function alchemist(path, seed) {
  const f = new Fig(base(seed));
  const S = seed, T = n => n + S;
  const TR = path === 'transmuter', PL = path === 'plaguewright', AP = path === 'apothecary';
  const H = 96;
  const apron = '#57452c', shirt = '#ada188', glove = '#3e2a1a', breech = '#4a3f33', copper = COPPER, skin = '#c99a76', skinS = '#7a4a3e';
  const coat = '#3a3c40', coatS = '#121418', coatL = '#8a929c', coatHi = '#646a72';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: T('mottle'), texOp: 0.4 }, o);
  const SHT = (o = {}) => PL ? Object.assign({ fill: coat, tex: T('mottle'), texOp: 0.5, shadow: coatS, light: coatHi }, o) : Object.assign({ fill: shirt, tex: T('weave'), texOp: 0.5 }, o);
  const SN = [252, 306];
  // near arm: base fist on the hip; transmuter lets it hang back with the crucible; plaguewright points the cane;
  // apothecary lets it fall relaxed and forward with a bandage roll
  const EN = TR ? [204, 402] : PL ? [222, 414] : AP ? [236, 410] : [206, 404];
  const WN = TR ? [196, 490] : PL ? [312, 470] : AP ? [286, 478] : [254, 472];
  // far arm: raised flask (base, transmuter, plaguewright); apothecary holds it lower and out in front at eye level
  const SF = [346, 300], EF = AP ? [442, 282] : PL ? [404, 374] : [468, 231], GF = AP ? [504, 232] : PL ? [478, 352] : [404, 160], WF = lerp(GF, EF, 0.16);
  const KN = [242, 628], AN = [226, 746], KF = [338, 624], AF = [354, 746];
  const HNp = [254, 520], HFp = [322, 524];
  const knee = (H0, K0, A) => E.norm(add(E.norm(sub(K0, H0)), E.norm(sub(A, K0))));
  const ankle = (K0, A) => add(E.norm(sub(A, K0)), [0.6, 0]);
  const apC = [312, 488], apD = E.norm(rot([392 - 232, 476 - 488], Math.PI / 2));
  const hA = PL ? -0.04 : AP ? 0.2 : -0.24;

  f.joint('pelvis', [290, 515]).joint('torso', [300, 490], 'pelvis').joint('head', [306, 296], 'torso').joint('still', [240, 252], 'torso').joint('apron', apC, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('flask', GF, 'hand_f');
  f.joint('thigh_f', HFp, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HNp, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  if (TR) f.joint('crucible', WN, 'hand_n');
  if (PL) f.joint('cane', WN, 'hand_n').joint('skirt', [300, 492], 'pelvis');
  if (AP) f.joint('bandage', WN, 'hand_n').joint('herb_bag', [222, 500], 'pelvis');

  // ---- the pot still on his back
  const st = [204, 262];
  f.bone('still');
  f.part([[st[0] - 34, st[1] + 10], [st[0] - 30, st[1] - 24], [st[0] - 4, st[1] - 40], [st[0] + 30, st[1] - 32], [st[0] + 42, st[1] + 4], [st[0] + 44, st[1] + 120], [st[0] + 30, st[1] + 136], [st[0] - 20, st[1] + 138], [st[0] - 38, st[1] + 120]], { fill: copper, tex: T('mottle'), texOp: 0.55, shadow: '#3a1a0c' });
  for (let i = 0; i < 3; i++) f.line([[st[0] - 36, st[1] + 30 + i * 40], [st[0] + 4, st[1] + 36 + i * 40], [st[0] + 43, st[1] + 30 + i * 40]], 1.4, INK, { op: 0.7 });
  for (let i = 0; i < 3; i++) for (let k = 0; k < 4; k++) f.rivet([st[0] - 28 + k * 22, st[1] + 34 + i * 40 + (k === 1 || k === 2 ? 4 : 0)], 1.8, COPPER_L);
  f.line([[st[0] - 26, st[1] - 14], [st[0] - 6, st[1] - 30], [st[0] + 22, st[1] - 26]], 2, '#e8b080', { op: 0.6 });
  for (const [x, y] of [[st[0] - 30, st[1] + 70], [st[0] + 34, st[1] + 104], [st[0] - 10, st[1] + 128]]) f.flat([[x, y], [x + 8, y - 2], [x + 6, y + 16], [x + 2, y + 22], [x - 1, y + 12]], '#4e8a6a', { op: 0.75 });
  if (TR) {
    // more brass: two brass hoops round the boiler and a brass sight-glass gauge
    for (const y of [st[1] + 50, st[1] + 92]) { f.part([[st[0] - 38, y - 4], [st[0] + 4, y + 2], [st[0] + 44, y - 4], [st[0] + 44, y + 5], [st[0] + 4, y + 11], [st[0] - 38, y + 5]], { fill: BRASS, shade: 0.4, inkW: 1.2, cast: false, tex: T('mottle'), texOp: 0.4 }); f.line([[st[0] - 30, y - 2], [st[0] + 2, y + 3]], 1, BRASS_L, { op: 0.6 }); }
    const gg = [st[0] + 26, st[1] + 6];
    f.part(ell(gg, 11, 11, 0, 14), { fill: BRASS, shade: 0.45, inkW: 1.3, cast: false });
    f.part(ell(gg, 7, 7, 0, 12), { fill: '#c8c4b0', shade: 0.2, inkW: 1, cast: false, hatch: false });
    f.line([gg, add(gg, [4, -4])], 1.2, INK); f.flat(ell(add(gg, [-3, 3]), 2, 1.4, 0.5, 6), VERD, { op: 0.8 });
  }
  f.part(limb([st[0] - 4, st[1] - 36], [st[0] + 6, st[1] - 70], 16, 12, { steps: 4 }), { fill: copper, tex: T('mottle'), shadow: '#3a1a0c' });
  if (TR) { // brass valve wheel on the helm neck
    const vw = [st[0] + 16, st[1] - 54];
    f.line([add(vw, [-10, 2]), vw], 3, BRASS_D);
    ring(f, vw, 8, 3.4, 4.4, INK, { ang: -1.2 }); ring(f, vw, 8, 3.4, 2.4, BRASS, { ang: -1.2 });
    f.line([add(vw, [-1, -7]), add(vw, [1, 7])], 1.6, BRASS, { straight: true });
  }
  const lyne = [[st[0] + 6, st[1] - 70], [st[0] - 4, st[1] - 86], [st[0] - 30, st[1] - 84], [st[0] - 50, st[1] - 56], [st[0] - 56, st[1] + 20], [st[0] - 54, st[1] + 100], [st[0] - 34, st[1] + 134]];
  f.line(lyne, 7, INK); f.line(lyne, 4, '#6a4026'); f.line(lyne.slice(0, 4).map(q => add(q, [1, -1.5])), 1.2, '#e0a070', { op: 0.55 });
  for (const t of [2, 4]) f.line([add(lyne[t], [-6, 0]), add(lyne[t], [6, 0])], 2.4, TR ? BRASS : '#2a2620', { straight: true });
  f.flat(ell([st[0] - 56, st[1] + 40], 4, 6, 0, 6), '#4e8a6a', { op: 0.8 });
  const cw = [st[0] + 2, st[1] + 160];
  f.part([[cw[0] - 30, cw[1] - 24], [cw[0] + 28, cw[1] - 24], [cw[0] + 30, cw[1] + 38], [cw[0] - 32, cw[1] + 38]], { fill: '#4e4a40', tex: T('mottle'), sharp: true });
  f.part(ell([cw[0] - 1, cw[1] - 24], 30, 6, 0, 14), { fill: '#5e5a50', inkW: 1.2, cast: false });
  for (let i = 0; i < 2; i++) f.line([[cw[0] - 30, cw[1] - 4 + i * 26], [cw[0] + 30, cw[1] - 4 + i * 26]], 2.4, TR ? BRASS : '#2a2620', { straight: true });
  for (let i = 0; i < 4; i++) { const c = add(cw, [0, -14 + i * 15]), e = ell(c, 36, 7, 0.08, 18); f.line(e.slice(9).concat([e[0]]), 5, INK); f.line(e.slice(9).concat([e[0]]), 3, mix(copper, '#000', 0.35)); }
  for (let i = 0; i < 4; i++) { const c = add(cw, [0, -14 + i * 15]), e = ell(c, 36, 7, 0.08, 18); f.line(e.slice(0, 10), 6.5, INK); f.line(e.slice(0, 10), 4, '#6e4228'); f.line(e.slice(1, 6), 1.2, '#e0a070', { op: 0.55 }); }
  f.line([add(cw, [-36, 38]), add(cw, [-40, 60]), add(cw, [-32, 72])], 6, INK); f.line([add(cw, [-36, 38]), add(cw, [-40, 60]), add(cw, [-32, 72])], 3.6, '#8a4e2a');
  f.bone('torso');
  f.line([[st[0] + 36, st[1] - 10], [272, 300], [300, 300]], 7, '#2e1e12'); f.line([[st[0] + 36, st[1] - 10], [272, 300], [300, 300]], 1, '#8a6a4a', { op: 0.6, dash: '3 3' });

  // ---- legs
  split(f, () => f.part(chain([HFp, KF, lerp(KF, AF, 0.3)], [64, 50, 44], { bq: [[0, 0.3, 0.12]] }), { fill: breech, tex: T('weave'), texOp: 0.4 }), [['thigh_f', side(KF, mul(knee(HFp, KF, AF), -1), 25)], ['shin_f', side(KF, knee(HFp, KF, AF), 25)]]);
  split(f, () => B.boot(f, AF, 1, 52, '#3a2a1c', { knee: lp(KF, AF, 0.22), kneeW: 46, strap: true, tex: T('mottle') }), [['shin_f', side(AF, mul(ankle(KF, AF), -1), 18)], ['foot_f', side(AF, ankle(KF, AF), 18)]]);
  split(f, () => f.part(chain([HNp, KN, lerp(KN, AN, 0.3)], [68, 52, 46], { bp: [[0, 0.3, 0.12]] }), { fill: breech, tex: T('weave'), texOp: 0.4 }), [['thigh_n', side(KN, mul(knee(HNp, KN, AN), -1), 26)], ['shin_n', side(KN, knee(HNp, KN, AN), 26)]]);
  split(f, () => B.boot(f, AN, 1, 54, '#33251a', { knee: lp(KN, AN, 0.22), kneeW: 48, strap: true, tex: T('mottle') }), [['shin_n', side(AN, mul(ankle(KN, AN), -1), 19)], ['foot_n', side(AN, ankle(KN, AN), 19)]]);

  // ---- plaguewright: the black waxed coat's long skirts, behind the apron and over the legs
  if (PL) {
    f.bone('skirt');
    const back = [[232, 482], [216, 520], [204, 590], [190, 670], [172, 760, 1], [196, 772], [214, 764, 1], [236, 774], [252, 766, 1], [250, 690], [246, 600], [246, 520]];
    f.part(back, { fill: coat, tex: T('mottle'), texOp: 0.5, shadow: coatS, light: coatHi, k: 0.85 });
    for (const q of [[[222, 540], [208, 640], [192, 750]], [[238, 560], [230, 660], [222, 760]], [[212, 600], [200, 680], [196, 740]]]) f.stroke(q, 2.2, '#000');
    f.part([[206, 640], [224, 638], [226, 664], [204, 666]], { fill: mix(coat, '#3a2a1a', 0.3), inkW: 1.1, sharp: true, cast: false }); f.stitches([[206, 640], [224, 638], [226, 664], [204, 666], [206, 640]], '#8a7a5a', 0.8); // patch
    f.line([[214, 560], [200, 660], [186, 740]], 1.3, coatL, { op: 0.6 }); // waxed sheen
    f.line([[244, 600], [240, 700]], 1.1, coatL, { op: 0.45 });
    f.flat([[180, 730], [252, 730], [252, 774], [172, 770]], '#2a2014', { op: 0.35 }); // mud on the hem
    const front = [[388, 486], [402, 540], [412, 620], [424, 700], [440, 768, 1], [418, 774], [404, 766, 1], [402, 680], [398, 590], [392, 520]];
    f.part(front, { fill: coat, tex: T('mottle'), texOp: 0.5, shadow: coatS, light: coatHi, k: 0.85 });
    f.line([[404, 560], [412, 650], [424, 740]], 1.2, coatL, { op: 0.55 });
  }

  // ---- torso
  f.bone('torso');
  const torso = [[300, 284], [326, 290], [352, 300], [372, 330], [380, 372], [388, 420], [392, 466], [384, 506], [360, 530], [300, 538], [244, 530], [222, 500], [214, 450], [216, 392], [224, 340], [244, 304], [272, 288]];
  f.part(torso, SHT());
  f.stroke([[250, 340], [262, 380], [258, 420]], 2); f.stroke([[352, 330], [364, 370], [372, 410]], 2);
  if (PL) { // coat buttoned up the front, waxed sheen, a standing collar
    for (let i = 0; i < 4; i++) f.part(ell([300 + i * 2, 318 + i * 26], 3, 3, 0, 8), { fill: '#3a3632', inkW: 1, cast: false });
    f.line([[236, 330], [228, 400], [226, 470]], 1.3, coatL, { op: 0.55 });
    for (const q of [[[232, 350], [244, 400], [238, 450]], [[256, 310], [268, 350], [262, 384]], [[226, 420], [236, 460], [232, 500]]]) f.stroke(q, 2.4, '#000');
    f.line([[246, 300], [236, 360], [230, 430], [228, 492]], 1.2, '#8a7a5a', { dash: '3 2.5', op: 0.6 }); // back seam
    f.part([[218, 452], [246, 456], [246, 472], [216, 468]], { fill: coat, inkW: 1.1, cast: false, sharp: true, shadow: coatS }); f.rivet([224, 462], 2, '#5a5a56'); // half-belt
    f.line([[224, 300], [218, 360]], 1.4, coatL, { op: 0.5 }); f.scratches([236, 400], 16, 4, '#8a8a7c', 0.8);
    f.flat([[218, 470], [244, 478], [246, 530], [222, 520]], '#000', { op: 0.25 });
  }
  // ---- waxed apron
  const ap = [[300, 330], [356, 324], [370, 370], [382, 430], [390, 480], [398, 540], [402, 610], [404, 668, 1], [372, 674], [340, 668, 1], [310, 676], [280, 670, 1], [252, 676], [236, 670, 1], [234, 600], [236, 520], [242, 470], [264, 420], [286, 372]];
  split(f, () => f.part(ap, { fill: apron, tex: T('mottle'), texOp: 0.6, k: 0.85, shadow: '#1e140a' }), [['apron', side(add(apC, mul(apD, -44)), apD)], ['torso', side(apC, mul(apD, -1))]]);
  f.bone('apron');
  for (const q of [[[300, 480], [296, 580], [296, 670]], [[352, 470], [362, 570], [366, 668]], [[262, 520], [254, 600], [254, 672]]]) f.stroke(q, 2.2, '#1a180e');
  for (const q of [[[312, 470], [310, 560], [312, 650]], [[372, 520], [380, 600]]]) f.line(q, 1.3, '#a8a07a', { op: 0.55 });
  f.bone('torso');
  f.line([[322, 360], [334, 420]], 1.3, '#a8a07a', { op: 0.55 });
  f.bone('apron');
  f.stroke([[340, 600], [356, 616], [370, 610]], 1.8, '#1a180e');
  for (const [x, y, r] of [[330, 600], [270, 560], [356, 520], [300, 640], [380, 640]].map((q, i) => [...q, [8, 5, 6, 7, 4][i]])) { f.flat(ell([x, y], r, r * 0.7, 0.4, 10), '#140e08', { op: 0.75 }); f.line(ell([x, y], r + 2, r * 0.7 + 2, 0.4, 10), 1, '#8a7a4a', { op: 0.5 }); }
  f.flat([[250, 600], [262, 596], [268, 650], [256, 660]], AP ? '#6a7a4a' : '#5a8a3a', { op: 0.35 });
  if (TR) { f.flat([[318, 610], [330, 606], [334, 628], [322, 634]], '#9aa0a0', { op: 0.45 }); f.flat([[376, 560], [384, 558], [386, 580], [378, 582]], VERD, { op: 0.4 }); } // quicksilver and verdigris spills
  f.bone('torso');
  f.flat([[344, 440], [360, 436], [362, 470], [350, 486], [342, 466]], '#5a3a6a', { op: 0.35 });
  f.line([[300, 330], [304, 296], [326, 290]], 3.5, '#2a1c12');
  f.part([[232, 488], [392, 476], [394, 488], [232, 500]], { fill: '#2a1c12', sharp: true });
  f.bone('pelvis');
  f.stroke([[238, 494], [226, 520], [232, 552]], 3.2, '#2a1c12'); f.stroke([[240, 496], [248, 520], [244, 540]], 3, '#2a1c12');
  // belt hang: pestle, pouch, badge
  f.part(limb([236, 500], [226, 560], 12, 16, { steps: 4 }), { fill: '#b8b0a0', inkW: 1.2 });
  f.part([[262, 496], [296, 494], [298, 530], [264, 534]], { fill: '#4a301c', sharp: true, tex: T('mottle') });
  f.part([[260, 494], [298, 492], [296, 508], [278, 512], [262, 508]], { fill: '#3a2414', inkW: 1.2 });
  if (TR) { // a small copper retort tied at the belt beside the pouch
    const rt = [318, 512];
    f.line([[318, 486], rt], 1.2, '#2b2119');
    f.part([add(rt, [-3, 0]), add(rt, [3, 0]), add(rt, [4, 8]), add(rt, [12, 14]), add(rt, [12, 28]), add(rt, [0, 34]), add(rt, [-12, 28]), add(rt, [-12, 14]), add(rt, [-4, 8])], { fill: COPPER, tex: T('mottle'), shade: 0.4, inkW: 1.2, cast: false });
    f.line([add(rt, [-6, 16]), add(rt, [-7, 26])], 1, COPPER_L, { op: 0.6 }); f.flat(ell(add(rt, [6, 26]), 3, 2, 0, 6), VERD, { op: 0.8 });
  }
  if (AP) {
    // dried herb bundles hung head-down from the apron string: sage, tansy, lavender, yarrow
    const bundle = (top, l, col, col2, ang) => {
      const F = frame(top, ang, 1), Q = pts => F(pts);
      f.line(Q([[0, -4], [0, 6]]), 1.3, '#5a4a2a');
      for (let i = 0; i < 4; i++) f.line(Q([[-3 + i * 2, 4], [-4 + i * 2.6, 14]]), 1.2, '#7a6a3a'); // stems
      f.part(Q([[-5, 12], [5, 12], [9, l * 0.5], [10, l * 0.85], [4, l, 1], [0, l * 0.9], [-5, l * 0.98, 1], [-10, l * 0.8], [-8, l * 0.45]]), { fill: col, tex: T('hatch'), texOp: 0.45, inkW: 1.2, cast: false, k: 0.8 });
      for (let i = 0; i < 5; i++) f.line(Q([[-6 + i * 3, l * 0.35], [-7 + i * 3.4, l * 0.8]]), 0.9, mix(col, '#000', 0.4), { op: 0.7 });
      for (let i = 0; i < 4; i++) f.flat(ell(Q([[-6 + i * 4, l * (0.6 + (i % 2) * 0.2)]])[0], 2.2, 2.2, 0, 6), col2, { op: 0.9 });
      f.line(Q([[-6, 10], [6, 10]]), 2.4, '#8a7a4a', { straight: true }); // twine
    };
    f.bone('torso');
    bundle([284, 496], 46, '#6a7a52', '#8a9a6a', 0.06); bundle([330, 492], 52, '#8a7a4a', '#a8964e', -0.04); bundle([360, 490], 42, '#5e5068', '#7a6a8a', 0.05); bundle([392, 486], 50, '#7a8458', '#c8c0a0', -0.12);
  }
  f.bone('pelvis');
  f.line([[372, 488], [374, 504]], 1.2, '#2b2119');
  G.badge(f, [AP ? 376 : 374, 504], 10, '#74777b', -0.08);

  // ---- bandolier of flasks
  f.bone('torso');
  const b0 = [352, 312], b1 = [236, 482];
  f.part(limb(b0, b1, 20, 20, { steps: 8, capK: 0.3 }), { fill: '#3a2618', tex: T('mottle') });
  f.stitches([lp(b0, b1, 0.02, 7), lp(b1, b0, 0.02, -7)]);
  const glass = TR ? ['#b8862a', '#8a8e8c', '#7a2e3a', '#3a6a8a', '#9a9a8e', '#5a7a2a'] : ['#b8862a', '#4a8a4a', '#7a2e3a', '#3a6a8a', '#8a8a7a', '#5a7a2a'];
  for (let i = 0; i < 6; i++) {
    const c = lerp(b0, b1, 0.1 + i * 0.155), sh = i % 3;
    if (AP && (i === 1 || i === 4)) { // linen bandage rolls in two of the loops
      const ax = E.norm(sub(b1, b0)), F = frame(c, Math.atan2(ax[1], ax[0]), 1);
      f.part(F([[-11, -9], [11, -9], [12, 9], [-11, 9]]), { fill: '#d8ccb0', tex: T('weave'), texOp: 0.4, inkW: 1.2, shade: 0.4, cast: false });
      f.part(F(ell([11.5, 0], 3.4, 9, 0, 10)), { fill: '#e0d6bc', inkW: 1, shade: 0.3, cast: false, hatch: false });
      f.line(F([[11.5, -6], [13.4, 0], [11.5, 5], [10, 1]]), 0.9, '#8a7a5a');
      f.line(F([[-6, -9], [-5, 9]]), 0.9, '#a89a7a', { op: 0.8 });
      f.line([add(c, [-11, -2]), add(c, [11, -4])], 2.2, '#2a1a10', { straight: true });
      continue;
    }
    const pts = sh === 0 ? [add(c, [-4, -8]), add(c, [4, -8]), add(c, [11, 4]), add(c, [9, 16]), add(c, [-9, 16]), add(c, [-11, 4])] : sh === 1 ? [add(c, [-7, -8]), add(c, [7, -8]), add(c, [8, 16]), add(c, [-8, 16])] : [add(c, [-4, -10]), add(c, [4, -10]), add(c, [6, -2]), add(c, [10, 14]), add(c, [-10, 14]), add(c, [-6, -2])];
    f.part(pts, { fill: glass[i], shade: 0.3, inkW: 1.2, k: 0.6, hatch: false });
    f.flat([add(c, [-7, 6]), add(c, [7, 6]), add(c, [7, 14]), add(c, [-7, 14])], mix(glass[i], '#fff', 0.25), { op: 0.6 });
    f.line([add(c, [-4, -4]), add(c, [-5, 10])], 1.3, '#fff', { op: 0.6 });
    f.part([add(c, [-4, -14]), add(c, [4, -14]), add(c, [4, -8]), add(c, [-4, -8])], { fill: '#8a6a4a', inkW: 1, sharp: true, cast: false });
    f.line([add(c, [-11, -2]), add(c, [11, -4])], 2.2, '#2a1a10', { straight: true });
  }
  if (TR) for (const t of [0.04, 0.5]) { const c = lerp(b0, b1, t); f.part([add(c, [-7, -6]), add(c, [7, -6]), add(c, [7, 6]), add(c, [-7, 6])], { fill: BRASS, sharp: true, inkW: 1.1, shade: 0.4, cast: false }); f.flat([add(c, [-3, -2]), add(c, [3, -2]), add(c, [3, 2]), add(c, [-3, 2])], '#2a1a10'); } // brass buckles
  f.part([add(lerp(b0, b1, 0.92), [-8, -6]), add(lerp(b0, b1, 0.92), [6, -8]), add(lerp(b0, b1, 0.92), [10, 30]), add(lerp(b0, b1, 0.92), [2, 34]), add(lerp(b0, b1, 0.92), [-2, 10])], { fill: rubric, inkW: 1.1, cast: false }); // rubric strip tied on

  // ---- near arm
  if (TR) {
    // hanging back, the crucible's iron bail through the fist, the crucible swinging below on two short chains
    f.bone('crucible');
    const R = [WN[0] - 2, WN[1] + 84], hk0 = add(WN, [-18, 1]), hk1 = add(WN, [17, -1]), rg = add(WN, [-2, 36]);
    const lugs = [add(R, [-30, -2]), add(R, [30, -2]), add(R, [2, -8])];
    chainLinks(f, add(WN, [-1, 12]), rg, 4); // short chain from the hook to the ring
    chainLinks(f, rg, lugs[2], 3.4); // back leg
    // the crucible: thick fireclay, wide open mouth tapering to a rounded foot, a pouring lip; charred low down
    f.raw(`<ellipse cx="${R[0]}" cy="${R[1] - 4}" rx="24" ry="12" fill="#d0762a" opacity="0.16" filter="url(#soft${S})"/>`);
    f.part([add(R, [-31, 0]), add(R, [31, 0]), add(R, [29, 14]), add(R, [22, 36]), add(R, [12, 50]), add(R, [0, 53]), add(R, [-12, 50]), add(R, [-22, 36]), add(R, [-29, 14])], { fill: '#5e4c40', tex: T('mottle'), texOp: 0.6, shadow: '#1e1612' });
    f.flat([add(R, [-24, 30]), add(R, [24, 30]), add(R, [12, 50]), add(R, [0, 53]), add(R, [-12, 50])], '#1e1612', { op: 0.55 }); // char
    f.part([add(R, [26, -4]), add(R, [42, -10]), add(R, [40, -3]), add(R, [30, 6])], { fill: '#6e5a4a', inkW: 1.2, cast: false, shade: 0.35 }); // pouring lip
    f.part(ell(R, 31, 8, 0, 20), { fill: '#7a6656', inkW: 1.3, cast: false, shade: 0.2, hatch: false, tex: T('mottle'), texOp: 0.4 }); // the thick rim
    f.part(ell(add(R, [1, 0.5]), 22, 5, 0, 18), { fill: '#b0561e', inkW: 0.9, cast: false, shade: 0.1, hatch: false }); // molten metal, at the mouth only
    f.flat(ell(add(R, [4, 0.5]), 12, 2.4, 0, 12), '#e09a40', { op: 0.9 });
    for (const [x, y] of [[-12, 1], [8, -1.5], [15, 1.5]]) f.flat(ell(add(R, [x, y]), 2.4, 1, 0, 6), '#3a2014', { op: 0.8 }); // crust on the melt
    f.flat([add(R, [32, -6]), add(R, [38, -8]), add(R, [34, 12]), add(R, [30, 22]), add(R, [28, 8])], '#6e7a5a', { op: 0.8 }); // slag run from the lip
    f.flat([add(R, [-29, 4]), add(R, [-24, 4]), add(R, [-22, 20]), add(R, [-26, 16])], '#8a7a6a', { op: 0.5 });
    f.line([add(R, [-12, 14]), add(R, [-8, 30])], 1, '#9a8a7a', { op: 0.5 }); f.line([add(R, [6, 18]), add(R, [12, 12]), add(R, [14, 22])], 1, INK, { op: 0.55 }); // crack
    for (const p of lugs.slice(0, 2)) f.part(ell(p, 4.4, 5, 0, 8), { fill: '#6e5a4a', inkW: 1, cast: false }); // clay ears
    chainLinks(f, rg, lugs[0], 3.4); chainLinks(f, rg, lugs[1], 3.4); // front legs
    ring(f, rg, 6, 6, 3, IRON);
    f.part(limb(hk0, hk1, 6, 6, { steps: 4 }), { fill: IRON, inkW: 1.1, shade: 0.4, cast: false }); // iron hook-bar through the fist
    f.line([add(WN, [-1, 2]), add(WN, [-1, 14]), add(WN, [3, 16])], 3, IRON);
  }
  if (PL) {
    // pointer cane, held like a baton: it runs on from the forearm through the palm and points down at the patient
    const cd = E.norm(rot(E.norm(sub(WN, EN)), 0.26)), c0 = add(WN, mul(cd, -24)), c1 = add(WN, mul(cd, 236));
    f.bone('cane');
    f.part(limb(c0, c1, 7.5, 5, { steps: 8, capK: 1 }), { fill: '#3a2a1c', tex: T('wood'), texOp: 0.4, inkW: 1.3, inkHeavy: 2, shade: 0.4 });
    f.line([lp(c0, c1, 0.05, -1.6), lp(c0, c1, 0.95, -1.4)], 1, '#8a6a4a', { op: 0.6, straight: true });
    f.part(ell(add(c0, mul(cd, -3)), 6, 6, 0, 10), { fill: '#b8ad94', inkW: 1.1, cast: false, shade: 0.4 }); // bone knob
    f.part(limb(add(c1, mul(cd, -16)), add(c1, mul(cd, 4)), 6, 2, { steps: 4, capK: 1.6 }), { fill: IRON, inkW: 1, cast: false }); // iron ferrule
  }
  f.bone('upperarm_n');
  if (PL) f.part(chain([SN, EN], [52, 46], { bp: [[0, 0.4, 0.1]] }), SHT());
  else f.part(ragLimb(f, SN, lerp(SN, EN, 0.85), 50, 46, { p: [[0.4, 0.12, 0.2]], depth: 5, teeth: 4 }), SHT());
  if (!PL) f.part(ell(lerp(SN, EN, 0.86), 25, 9, Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) + Math.PI / 2, 12), SHT({ fill: mix(shirt, '#000', 0.12) }));
  if (PL) {
    split(f, () => f.part(chain([lerp(SN, EN, 0.8), EN, lerp(EN, WN, 0.55)], [46, 44, 38], { bq: [[1, 0.3, 0.1]] }), SHT()), [['upperarm_n', side(EN, mul(knee(SN, EN, WN), -1), 23)], ['forearm_n', side(EN, knee(SN, EN, WN), 23)]]);
    f.bone('forearm_n');
    f.stroke([lp(SN, EN, 0.95, -14), lp(EN, WN, 0.1, -4), lp(EN, WN, 0.2, 12)], 2, '#000');
  } else split(f, () => f.part(chain([lerp(SN, EN, 0.9), EN, lerp(EN, WN, 0.5)], [40, 42, 38]), SKN()), [['upperarm_n', side(EN, mul(knee(SN, EN, WN), -1), 21)], ['forearm_n', side(EN, knee(SN, EN, WN), 21)]]);
  f.bone('forearm_n');
  if (!PL) f.line([lp(EN, WN, 0.15, -6), lp(EN, WN, 0.4, -8)], 1, mix(skin, '#000', 0.4), { op: 0.5 });
  f.part(chain([lerp(EN, WN, 0.42), WN], [44, 40]), { fill: glove, tex: T('mottle'), shadow: '#140a06' });
  f.part(plate(EN, WN, 0.36, 0.52, 52, 48), { fill: mix(glove, '#000', 0.1), tex: T('mottle') });
  if (TR) { f.part(plate(EN, WN, 0.5, 0.78, 46, 44), { fill: COPPER, tex: T('mottle'), shade: 0.45 }); for (const t of [0.56, 0.72]) f.rivet(lp(EN, WN, t, 0), 1.8, COPPER_L); f.line([lp(EN, WN, 0.52, -18), lp(EN, WN, 0.76, -17)], 1.1, COPPER_L, { op: 0.6 }); }
  if (AP) {
    // a bandage roll in the loose fist, its tail unwinding and hanging plumb
    f.bone('bandage');
    const gB = B.gripAngle(WN, EN, 0.2, { quiet: true }), ax = [Math.cos(gB.axis), Math.sin(gB.axis)];
    const r0 = add(WN, mul(ax, -20)), r1 = add(WN, mul(ax, 22));
    f.part(limb(r0, r1, 26, 26, { steps: 4, capK: 0.35 }), { fill: '#e2d8c0', tex: T('weave'), texOp: 0.4, inkW: 1.2, shade: 0.35 });
    f.part(ell(r1, 5, 13, gB.axis, 10), { fill: '#ece4d0', inkW: 1, cast: false, hatch: false, shade: 0.2 });
    const tail = [add(r1, [0, 10]), add(r1, [5, 50]), add(r1, [-3, 92]), add(r1, [4, 124])];
    f.part(chain(tail, [15, 14, 13, 12]), { fill: '#e2d8c0', tex: T('weave'), texOp: 0.4, inkW: 1.1, shade: 0.35, cast: false });
    f.line([add(r1, [-4, 50]), add(r1, [-8, 92])], 0.9, '#9a8a6a', { op: 0.7 }); f.line([add(r1, [3, 30]), add(r1, [6, 60])], 0.9, '#9a8a6a', { op: 0.6 });
    f.flat(ell(add(r1, [2, 104]), 4, 3, 0, 6), '#8a6a4a', { op: 0.5 }); // an old stain
  }
  f.bone('hand_n');
  if (TR) B.grip(f, WN, EN, 0, 22, glove, { tex: T('mottle'), shadow: '#140a06', name: 'crucible bail' });
  else if (PL) B.grip(f, WN, EN, Math.atan2(WN[1] - EN[1], WN[0] - EN[0]) + 0.26, 22, glove, { tex: T('mottle'), shadow: '#140a06', inline: true, bend: 0.26 });
  else if (AP) B.grip(f, WN, EN, 0.2, 21, glove, { tex: T('mottle'), shadow: '#140a06', name: 'bandage roll' });
  else B.fist(f, WN, 1.15, 22, glove, { tex: T('mottle'), shadow: '#140a06' });

  // ---- far arm (the plaguewright's goes behind his beak: drawn before the head)
  function farArm() {
  f.bone('upperarm_f');
  if (PL) f.part(chain([SF, lerp(SF, EF, 0.85)], [52, 48], { bq: [[0, 0.5, 0.14]] }), SHT());
  else {
    f.part(chain([SF, lerp(SF, EF, 0.85)], [48, 46], { bq: [[0, 0.5, 0.14]] }), SHT());
    f.part(ell(lerp(SF, EF, 0.86), 24, 9, Math.atan2(EF[1] - SF[1], EF[0] - SF[0]) + Math.PI / 2, 12), SHT({ fill: mix(shirt, '#000', 0.12) }));
  }
  if (PL) split(f, () => f.part(chain([lerp(SF, EF, 0.8), EF, lerp(EF, WF, 0.5)], [48, 46, 40]), SHT()), [['upperarm_f', side(EF, mul(knee(SF, EF, WF), -1), 23)], ['forearm_f', side(EF, knee(SF, EF, WF), 23)]]);
  else split(f, () => f.part(chain([lerp(SF, EF, 0.88), EF, lerp(EF, WF, 0.45)], [38, 40, 36]), SKN()), [['upperarm_f', side(EF, mul(knee(SF, EF, WF), -1), 20)], ['forearm_f', side(EF, knee(SF, EF, WF), 20)]]);
  f.bone('forearm_f');
  if (PL) { f.stroke([lp(EF, WF, 0.05, 10), lp(EF, WF, 0.22, -2), lp(EF, WF, 0.36, 12)], 2, '#000'); f.bone('upperarm_f'); f.stroke([lp(SF, EF, 0.3, -14), lp(SF, EF, 0.5, 2), lp(SF, EF, 0.66, -12)], 2, '#000'); f.line([lp(SF, EF, 0.1, -18), lp(SF, EF, 0.8, -20)], 1.3, coatL, { op: 0.6 }); f.bone('forearm_f'); }
  else f.flat(ell(lp(EF, WF, 0.3, 4), 7, 4, -1.4, 8), mix(skin, '#e8c0a8', 0.5), { op: 0.85 });
  f.part(chain([lerp(EF, WF, 0.4), lerp(EF, WF, 0.55), WF], [52, 40, 34]), { fill: glove, tex: T('mottle'), shadow: '#140a06' });
  f.line([lp(EF, WF, 0.5, 20), lp(EF, WF, 0.5, -20)], 1.2, '#8a6a4a', { op: 0.5, dash: '3 2' });
  if (TR) { // riveted copper bracer over the gauntlet cuff
    f.part(plate(EF, WF, 0.16, 0.42, 44, 50), { fill: COPPER, tex: T('mottle'), shade: 0.45 });
    for (const t of [0.22, 0.36]) f.rivet(lp(EF, WF, t, -14), 1.8, COPPER_L);
    f.line([lp(EF, WF, 0.18, 16), lp(EF, WF, 0.4, 18)], 1.2, COPPER_L, { op: 0.6 });
    f.flat(ell(lp(EF, WF, 0.3, 8), 4, 2.6, 0.4, 6), VERD, { op: 0.8 });
  }
  const gF = B.gripAngle(GF, EF, -Math.PI / 2, { name: 'alchemist flask' });
  const FL = frame(GF, gF.axis + Math.PI / 2, 1), q = (x, y) => FL([[x + 4, y + 28]])[0], Q = pts => pts.map(([x, y]) => q(x, y)), fl = q(0, 0);
  f.bone('flask');
  if (TR) {
    // the alembic, held upright by its brass waist: the copper still-head and its beak above the fist (clear of the
    // forearm), the glass cucurbit of quicksilver below it
    const cuc = f.part(Q([[-9, -22], [9, -22], [13, 2], [24, 16], [26, 34], [18, 48], [0, 52], [-18, 48], [-26, 34], [-24, 16], [-13, 2]]), { fill: '#a6b2ac', shade: 0.25, inkW: 1.4, k: 0.7, hatch: false, opacity: 0.92 }); // cucurbit
    { // quicksilver: filled below a level line inside the glass, its meniscus turned down at the walls
      const qid = f.id('qs'), lv = fl[1] + 30, E2 = (v) => v.toFixed(1);
      f.defs.push(`<clipPath id="${qid}"><path d="${cuc}"/></clipPath>`);
      f.raw(`<g clip-path="url(#${qid})"><rect x="${E2(fl[0] - 40)}" y="${E2(lv)}" width="80" height="40" fill="#8e9696" opacity="0.85"/><path d="M${E2(fl[0] - 30)},${E2(lv + 3)} Q${E2(fl[0] - 22)},${E2(lv - 1)} ${E2(fl[0])},${E2(lv - 1)} T${E2(fl[0] + 30)},${E2(lv + 3)}" fill="none" stroke="#e8ece8" stroke-width="1.8" opacity="0.85"/></g>`);
    }
    f.line(Q([[-16, 8], [-20, 32]]), 1.6, '#fff', { op: 0.6 });
    f.flat(ell(q(8, 20), 2, 2, 0, 6), '#d0d6d0', { op: 0.8 }); f.flat(ell(q(-4, 12), 1.5, 1.5, 0, 6), '#d0d6d0', { op: 0.8 }); // condensate beads
    // copper still-head: a round helm with a thin tapering pipe off its lower rim, sloping forward over the forearm
    const pipe = [q(18, -60), q(46, -54), q(76, -44), q(100, -34)];
    f.part(chain(pipe, [9, 7, 5.5, 4.5]), { fill: COPPER, tex: T('mottle'), shade: 0.4, inkW: 1.3, cast: false, shadow: '#3a1a0c' });
    f.line([q(22, -63), q(50, -57), q(78, -47)], 1, COPPER_L, { op: 0.6 });
    f.part(Q([[-4, -104], [4, -104], [14, -100], [24, -90], [30, -76], [29, -62], [22, -56], [-22, -56], [-29, -62], [-30, -76], [-24, -90], [-14, -100]]), { fill: COPPER, tex: T('mottle'), shade: 0.45, inkW: 1.4, shadow: '#3a1a0c' });
    f.line(Q([[-20, -84], [-10, -96], [2, -99]]), 1.4, COPPER_L, { op: 0.6 });
    f.line(Q([[-28, -70], [0, -66], [28, -70]]), 1, INK, { op: 0.5 }); // raised seam
    f.part(Q([[-4, -112], [4, -112], [5, -103], [-5, -103]]), { fill: BRASS, inkW: 1.1, cast: false, sharp: true }); // finial
    f.part(Q([[-27, -60], [27, -60], [26, -54], [-26, -54]]), { fill: BRASS, shade: 0.4, inkW: 1.1, cast: false, sharp: true });
    for (const x of [-18, -6, 6, 18]) f.rivet(q(x, -57), 1.4, BRASS_L);
    f.flat(ell(q(-14, -78), 4, 3, 0.3, 6), VERD, { op: 0.85 }); f.flat(ell(q(64, -48), 3, 2, 0.5, 6), VERD, { op: 0.8 });
    f.flat(ell(add(q(101, -34), [0, 6]), 2, 3, 0, 6), '#c8ccc8'); // a bead of distillate at the pipe's end
    // brass waist joining head and cucurbit: the fist closes round it
    f.part(Q([[-11, -56], [11, -56], [12, -20], [-12, -20]]), { fill: BRASS, shade: 0.4, inkW: 1.2, cast: false, tex: T('mottle'), texOp: 0.4 });
    f.line(Q([[-11, -24], [11, -24]]), 1, BRASS_D, { straight: true });
  } else {
    f.raw(`<circle cx="${fl[0]}" cy="${fl[1]}" r="34" fill="#c8e06a" opacity="0.2" filter="url(#soft${S})"/>`);
    f.part(Q([[-4, -40], [4, -40], [5, -16], [18, 2], [16, 22], [-16, 22], [-18, 2], [-5, -16]]), { fill: '#8ab04a', shade: 0.25, inkW: 1.4, k: 0.7, hatch: false });
    f.flat([add(fl, [-17, 6]), add(fl, [17, 6]), add(fl, [15, 20]), add(fl, [-15, 20])], '#c8e070', { op: 0.75 });
    f.flat(ell(add(fl, [4, 12]), 2, 2, 0, 6), '#f0ffc0'); f.flat(ell(add(fl, [-6, 16]), 1.5, 1.5, 0, 6), '#f0ffc0');
    f.line(Q([[-9, -2], [-11, 14]]), 1.6, '#fff', { op: 0.65 });
    f.part(Q([[-5, -48], [5, -48], [5, -40], [-5, -40]]), { fill: '#8a6a4a', sharp: true, inkW: 1 });
  }
  f.bone('hand_f');
  B.fist(f, GF, gF.ang, 18, glove, { tex: T('mottle'), shadow: '#140a06', flip: gF.flip });

  }
  if (PL) farArm();
  // ---- head
  const HC = [316, 226];
  f.bone('head');
  if (PL) f.part(limb([306, 296], add(HC, [-6, 32]), 46, 42), SHT()); // hood over the neck
  else f.part(limb([306, 296], add(HC, [-6, 32]), 44, 40), SKN());
  f.bone('torso');
  if (PL) { // standing coat collar
    f.part([[258, 298], [276, 270], [300, 268], [340, 280], [356, 300], [330, 318], [296, 320], [264, 314]], SHT({ k: 0.7 }));
    f.stroke([[272, 300], [300, 304], [334, 298]], 1.8, '#000');
  } else {
    f.part([[262, 296], [300, 284], [346, 290], [352, 304], [324, 316], [294, 318], [266, 312]], { fill: '#8e8470', tex: T('weave'), k: 0.7 });
    f.stroke([[276, 304], [302, 306], [330, 300]], 1.8);
  }
  f.bone('head');
  let hf;
  if (PL) {
    hf = frame(HC, hA, H);
    // in profile: a cloth hood falling to the shoulders, a waxed leather mask strapped over the face, a long curved beak
    // pointed at the foe, a wide-brimmed hat over the hood
    const lea = '#6a5038', leaS = '#1e140c';
    f.part(hf([[-0.46, -0.42], [-0.2, -0.53], [0.06, -0.5], [0.2, -0.44], [0.12, 0.0], [0.2, 0.5], [0.42, 0.72], [0.18, 0.96], [-0.24, 1.0], [-0.64, 0.9], [-0.74, 0.66], [-0.5, 0.44], [-0.56, 0.16], [-0.58, -0.16]]), SHT({ k: 0.9 })); // hood: round over the skull, in at the nape, flaring onto the shoulders
    for (const q of [[[-0.46, 0.5], [-0.58, 0.68], [-0.6, 0.88]], [[-0.24, 0.5], [-0.3, 0.74], [-0.22, 0.96]], [[0.0, 0.56], [0.1, 0.76], [0.06, 0.94]], [[-0.4, -0.3], [-0.5, 0.0], [-0.44, 0.3]]]) f.stroke(hf(q), 2.2, '#000');
    f.line(hf([[-0.5, -0.3], [-0.54, 0.0], [-0.5, 0.3], [-0.62, 0.62]]), 1.2, coatL, { op: 0.6 });
    f.line(hf([[-0.1, -0.5], [-0.24, -0.2], [-0.2, 0.2], [-0.12, 0.5]]), 1, '#8a8a7a', { dash: '2.5 2', op: 0.6 }); // hood seam
    // the mask: the face plate of waxed leather, its stitched edge inside the hood's mouth
    const mask = [[0.0, -0.44], [0.24, -0.4], [0.38, -0.24], [0.42, 0.04], [0.42, 0.36], [0.26, 0.54], [0.06, 0.52], [0.02, 0.22], [-0.04, -0.1]];
    f.part(hf(mask), { fill: lea, tex: T('mottle'), texOp: 0.55, shadow: leaS });
    f.line(hf([[0.04, -0.4], [-0.0, -0.1], [0.06, 0.22], [0.08, 0.48]]), 1, '#c8b48a', { dash: '2.5 2', op: 0.8 }); // stitched edge
    // tie-straps round the back of the hood, buckled
    for (const [y0, y1] of [[-0.2, -0.14], [0.3, 0.28]]) {
      f.part(hf([[0.04, y0 - 0.035], [-0.6, y1 - 0.035], [-0.6, y1 + 0.035], [0.04, y0 + 0.035]]), { fill: '#2a1c12', inkW: 1, cast: false, shade: 0.3 });
      f.part(hf([[-0.34, (y0 + y1) / 2 - 0.06], [-0.24, (y0 + y1) / 2 - 0.06], [-0.24, (y0 + y1) / 2 + 0.06], [-0.34, (y0 + y1) / 2 + 0.06]]), { fill: '#6a6a66', inkW: 1, cast: false, sharp: true });
      f.line(hf([[-0.4, y1 + 0.02], [-0.5, y1 + 0.14]]), 2.2, '#2a1c12'); // loose tongue
    }
    // the beak: two halves sewn along a seam, a long downward curve
    const beak = [[0.34, -0.2], [0.62, -0.12], [0.92, 0.0], [1.2, 0.18], [1.42, 0.4], [1.52, 0.56, 1], [1.36, 0.5], [1.1, 0.42], [0.82, 0.42], [0.56, 0.46], [0.38, 0.48]];
    f.part(hf(beak), { fill: '#9c8058', tex: T('mottle'), texOp: 0.5, shadow: leaS, k: 0.9 });
    f.flat(hf([[0.5, 0.3], [0.86, 0.3], [1.16, 0.36], [1.4, 0.46], [1.36, 0.5], [1.1, 0.42], [0.82, 0.42], [0.56, 0.46], [0.42, 0.46]]), leaS, { op: 0.45 }); // underside in shadow
    f.line(hf([[0.4, 0.16], [0.7, 0.18], [1.0, 0.24], [1.26, 0.36], [1.48, 0.52]]), 1.6, INK, { op: 0.85 }); // the seam
    f.line(hf([[0.42, 0.13], [0.72, 0.15], [1.02, 0.21], [1.26, 0.32]]), 1, '#d0bc90', { dash: '2 2', op: 0.85 });
    f.line(hf([[0.42, -0.15], [0.7, -0.06], [1.0, 0.06], [1.26, 0.22]]), 1.5, '#d8c49a', { op: 0.6 }); // waxed sheen along the top
    for (const q of [[1.2, 0.26], [1.28, 0.31]]) f.flat(hf(ell(q, 0.016, 0.011, 0.5, 6)), '#0a0606'); // breathing holes
    f.part(hf([[0.32, -0.22], [0.4, -0.22], [0.44, 0.5], [0.34, 0.5]]), { fill: '#2a2018', inkW: 1.1, cast: false, shade: 0.3 }); // band the beak is sewn to
    for (let i = 0; i < 4; i++) f.rivet(hf([[0.38, -0.12 + i * 0.17]])[0], 1.5, '#6a6a66');
    const sp = hf([[0.52, 0.48]])[0];
    f.line([sp, add(sp, [4, 10]), add(sp, [2, 18])], 1.2, '#5a6a3a'); f.flat(ell(add(sp, [5, 9]), 3, 1.6, 0.8, 6), '#6a7a4a'); f.flat(ell(add(sp, [-1, 15]), 3, 1.6, -0.6, 6), '#6a7a4a'); // herb sprig from the stuffing
    // the lens: smoked glass in an iron rim on the side of the mask, a cold streak and no pupil
    const lens = hf([[0.22, -0.1]])[0], lr = 0.11 * H;
    f.part(ell(lens, lr, lr * 1.05, hA, 16), { fill: IRON, shade: 0.4, inkW: 1.5, cast: false });
    f.part(ell(lens, lr * 0.74, lr * 0.78, hA, 16), { fill: '#46524c', shade: 0.25, inkW: 1, cast: false, hatch: false, tex: T('mottle'), texOp: 0.4 });
    f.line([add(lens, [-lr * 0.45, lr * 0.15]), add(lens, [-lr * 0.05, -lr * 0.45])], 2, '#b8c2ba', { op: 0.55 });
    f.flat(ell(add(lens, [lr * 0.22, lr * 0.25]), lr * 0.38, lr * 0.28, 0.6, 10), '#1e2622', { op: 0.5 });
    for (let i = 0; i < 6; i++) f.rivet(add(lens, rot([lr * 0.9, 0], i * 1.05)), 1.1, '#7a7a76');
    // wide-brimmed hat over the hood
    const hat = '#2e3034', hatHi = '#5a6068';
    f.part(ell(hf([[-0.02, -0.44]])[0], 1.02 * H, 0.15 * H, hA - 0.06, 28), { fill: hat, tex: T('mottle'), texOp: 0.5, shadow: '#0c0d10', light: hatHi });
    f.part(hf([[-0.44, -0.46], [-0.44, -0.76], [-0.22, -0.9], [0.18, -0.9], [0.38, -0.78], [0.4, -0.46]]), { fill: hat, tex: T('mottle'), texOp: 0.5, shadow: '#0c0d10', light: hatHi });
    f.part(hf([[-0.44, -0.58], [0.4, -0.58], [0.4, -0.48], [-0.44, -0.48]]), { fill: '#1a1a1c', inkW: 1.1, cast: false, shade: 0.3 }); // hat band
    f.part(hf([[-0.3, -0.6], [-0.18, -0.6], [-0.18, -0.46], [-0.3, -0.46]]), { fill: '#6a6a66', inkW: 1, cast: false, sharp: true }); // buckle
    const fb = ell(hf([[-0.02, -0.44]])[0], 1.02 * H, 0.15 * H, hA - 0.06, 28);
    f.line(fb.slice(2, 12), 1.4, hatHi, { op: 0.7 }); // the front edge of the brim, catching the light
    f.stroke(hf([[-0.3, -0.84], [-0.04, -0.8], [0.2, -0.86]]), 2, '#0c0d10'); // dent in the crown
    f.line(hf([[0.62, -0.44], [0.9, -0.42]]), 1, '#000', { op: 0.6 }); // brim wear
  } else {
    hf = B.head(f, HC, H, hA, {
      skin, jaw: 1.16, chin: 0.0, nose: 1.18, hook: 0.0, mouth: 'set', squint: AP ? 0.45 : 0.8, browDown: AP ? 0.0 : 0.06, age: true,
      hairCol: '#5a4030', beard: 'short', beardCol: '#6a4a34',
      hair: [[-0.4, 0.12], [-0.44, -0.1], [-0.3, -0.12], [-0.26, 0.12]],
    });
  }
  if (!PL) {
  f.part(hf([[-0.46, -0.16], [-0.4, -0.5], [-0.08, -0.66], [0.26, -0.58], [0.4, -0.36], [0.34, -0.28], [0.0, -0.32], [-0.3, -0.2]]), { fill: '#4a3a2a', tex: T('mottle') }); // felt cap
  f.part(hf([[-0.46, -0.24], [0.4, -0.34], [0.42, -0.26], [-0.46, -0.14]]), { fill: '#3a2a1c', k: 0.6 });
  f.flat(hf(ell([0.0, -0.5], 0.08, 0.05, 0, 8)), '#2a1a10', { op: 0.5 });
  }
  if (!PL) {
    const rim = TR ? BRASS : '#4a4038';
    for (const [c, r] of [[[0.06, -0.42], 0.1], [[0.27, -0.44], 0.08]]) { const p = hf([c])[0]; f.part(ell(p, r * H * 0.95, r * H * 0.75, hA, 12), { fill: '#9ab0a8', shade: 0.2, inkW: 0, cast: false, hatch: false, opacity: 0.55 }); ring(f, p, r * H * 0.95, r * H * 0.75, TR ? 3 : 2.4, rim, { ang: hA }); }
    f.line(hf([[0.15, -0.43], [0.19, -0.44]]), 2, rim); f.line(hf([[-0.03, -0.41], [-0.22, -0.36]]), 1.6, rim);
    if (!AP) f.line(hf([[0.1, -0.12], [0.22, -0.08]]), 1.1, INK, { op: 0.6 });
  }

  if (!PL) farArm();
  // ---- apothecary: the herb bag slung at the back hip, sprigs poking from under the flap
  if (AP) {
    f.bone('herb_bag');
    const hb = [204, 548];
    f.line([[226, 494], add(hb, [8, -34])], 3, '#3a2a1a'); f.line([[240, 494], add(hb, [24, -30])], 3, '#3a2a1a');
    for (const [dx, col, l] of [[-12, '#6a7a52', 26], [-2, '#8a7a4a', 32], [8, '#5e5068', 22], [16, '#7a8458', 28]]) { const b0p = add(hb, [dx, -24]); f.line([b0p, add(b0p, [dx * 0.3 - 2, -l])], 1.4, '#6a5a32'); f.flat(ell(add(b0p, [dx * 0.3 - 2, -l]), 4, 6, dx * 0.04, 8), col, { op: 0.95 }); f.flat(ell(add(b0p, [dx * 0.2 - 4, -l * 0.6]), 3, 1.8, -0.6, 6), col); }
    f.part([add(hb, [-28, -26]), add(hb, [24, -30]), add(hb, [30, 0]), add(hb, [28, 30]), add(hb, [8, 38]), add(hb, [-22, 34]), add(hb, [-32, 6])], { fill: '#6a6248', tex: T('weave'), texOp: 0.55, shadow: '#2a2618' });
    f.part([add(hb, [-30, -28]), add(hb, [26, -32]), add(hb, [28, -6]), add(hb, [2, 4]), add(hb, [-26, -4])], { fill: '#5a523a', tex: T('weave'), texOp: 0.55, k: 0.8, shadow: '#2a2618' }); // flap
    f.part([add(hb, [-4, -2]), add(hb, [4, -2]), add(hb, [4, 10]), add(hb, [-4, 10])], { fill: '#8a7a5a', inkW: 1, cast: false, sharp: true }); // toggle
    f.stitches([add(hb, [-26, -2]), add(hb, [2, 6]), add(hb, [26, -4])], '#c8b890', 0.8);
    f.stroke([add(hb, [-16, 10]), add(hb, [-12, 24]), add(hb, [-16, 32])], 1.6, '#2a2618'); f.stroke([add(hb, [14, 10]), add(hb, [18, 22])], 1.6, '#2a2618');
    f.flat(ell(add(hb, [6, 22]), 6, 4, 0.3, 8), '#4a5a2a', { op: 0.45 }); // green stain where the herbs sweat through
  }
  return f;
}

// ================================================================== ORACLE
// path: 'chronomancer' | 'augur' | 'fatebinder'
function oracle(path, seed) {
  const f = new Fig(base(seed));
  const S = seed, T = n => n + S;
  const CH = path === 'chronomancer', AU = path === 'augur', FB = path === 'fatebinder';
  const H = 94;
  const robe = '#2f2538', robeD = '#211a29', under = '#3e3a3a', lining = '#d2c3a0', skin = '#d4c0ae', skinS = '#7a6672';
  const RB = (o = {}) => Object.assign({ fill: robe, tex: T('weave'), texOp: 0.5, shadow: '#120e18' }, o);
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: T('mottle'), texOp: 0.4 }, o);
  const SN = [262, 352];
  // near arm: base lifts the hourglass by its chain; chronomancer grips the pendulum staff out in front, fatebinder holds
  // the quill up at the breast. Both wear the hourglass on its chain round the wrist (bible), so it hangs from the wrist.
  const EN = CH ? [326, 414] : FB ? [302, 414] : [316, 394];
  const WN = CH ? [432, 380] : FB ? [398, 382] : [394, 300];
  const SF = [352, 346], EF = [388, 420], WF = [428, 482];
  const HC = [328, 262], hA = 0.36;
  const BC = [296, 476];
  const AF = [350, 752], AN = [234, 754];
  const wrist = CH || FB;
  const ch0 = wrist ? lp(EN, WN, 0.72, 10) : add(WN, [6, 12]);
  const hg = wrist ? add(ch0, [-2, 46]) : [408, 362];

  f.joint('pelvis', [296, 490]).joint('torso', BC, 'pelvis').joint('head', [300, 330], 'torso').joint('cape', [300, 322], 'torso').joint('skirt', BC, 'pelvis');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('robe_front', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('hourglass', ch0, wrist ? 'forearm_n' : 'hand_n');
  f.joint('thigh_f', [330, 490], 'pelvis').joint('shin_f', [340, 622], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [262, 490], 'pelvis').joint('shin_n', [248, 622], 'thigh_n').joint('foot_n', AN, 'shin_n');
  if (CH) f.joint('staff', WN, 'hand_n');
  if (FB) f.joint('quill', WN, 'hand_n');

  // ---- hood shell behind the head
  const hF = frame(HC, hA, H);
  f.bone('head');
  f.part(hF([[-0.66, 0.56], [-0.72, 0.0], [-0.56, -0.5], [-0.2, -0.72], [0.2, -0.68], [0.44, -0.48], [0.4, -0.2], [0.0, 0.2], [-0.3, 0.62]]), RB({ fill: robeD }));
  // ---- bare feet under the hem
  f.bone('foot_f');
  B.bareFoot(f, AF, 1, 44, skin, { shadow: skinS, tex: T('mottle') });
  f.bone('foot_n');
  B.bareFoot(f, AN, 1, 44, mix(skin, '#6a5a5a', 0.15), { shadow: skinS, tex: T('mottle') });
  f.bone('foot_f'); f.flat(ell([380, 786], 22, 4, 0, 10), '#2a2016', { op: 0.5 });
  f.bone('foot_n'); f.flat(ell([266, 786], 22, 4, 0, 10), '#2a2016', { op: 0.5 });
  if (FB) { f.bone('foot_f'); script(f, [[362, 762], [384, 766]], 4, rubric, { w: 0.9 }); } // script on the instep
  // ---- near panel of the robe
  const near = [[296, 316], [254, 332], [228, 362], [216, 424], [212, 486], [206, 566], [196, 652], [184, 716], [164, 764], [192, 772], [222, 764, 1], [252, 772], [286, 762, 1], [318, 770], [346, 760, 1], [372, 766], [366, 640], [358, 540], [356, 470], [352, 400], [338, 330]];
  split(f, () => f.part(near, RB()), [['skirt', side([296, 440], [0, 1])], ['torso', side(BC, [0, -1])]]);
  f.bone('skirt');
  for (const q of [[[244, 500], [232, 620], [222, 760]], [[290, 520], [288, 640], [292, 762]], [[328, 520], [334, 640], [340, 760]], [[214, 600], [200, 700], [186, 760]], [[268, 560], [262, 650], [264, 740]], [[350, 560], [356, 660], [362, 760]]]) f.stroke(q, 2.4, '#0e0a12');
  f.stroke([[300, 600], [318, 612], [334, 606]], 1.8, '#0e0a12'); f.stroke([[240, 700], [262, 712], [280, 706]], 1.8, '#0e0a12');
  f.line([[300, 540], [304, 640], [306, 740]], 1, '#6a5a7a', { op: 0.5 });
  f.part([[250, 640], [276, 636], [280, 668], [252, 672]], RB({ fill: mix(robe, '#4a3a2a', 0.3), inkW: 1.1, sharp: true }));
  f.stitches([[250, 640], [276, 636], [280, 668], [252, 672], [250, 640]], '#8a7a9a', 0.8);
  f.flat([[170, 730], [372, 726], [374, 772], [168, 772]], '#1e160d', { op: 0.4 });
  if (FB) {
    // red rubric script written across the skirt in sagging rows and down the front edge
    const rows = [[516, 232, 330], [532, 230, 336], [548, 228, 334], [564, 226, 322], [598, 222, 344], [614, 220, 346], [630, 218, 316]];
    for (const [y, x0, x1] of rows) script(f, [[x0 + 6, y], [(x0 + x1) / 2, y + 4], [x1, y + 1]], 6, rubric, { w: 1.5 });
    script(f, [[178, 748], [230, 754], [290, 750], [366, 752]], 7, rubric, { w: 1.6 }); // a band along the hem
    script(f, [[340, 498], [344, 600], [350, 700]], 4.5, rubric, { w: 1 }); // down the front edge
    f.flat([[300, 640], [304, 640], [305, 652], [302, 656], [300, 650]], rubric, { op: 0.8 }); // a run of ink
  }
  // ---- the opening: underdress, then the far panel turned out
  f.part([[352, 470], [384, 470], [400, 560], [410, 660], [412, 760, 1], [386, 768], [372, 766], [366, 640], [358, 540]], { fill: under, tex: T('weave'), texOp: 0.5 });
  f.stroke([[376, 520], [388, 640], [394, 750]], 1.8, '#1a1618');
  f.bone('robe_front');
  const lin = [[380, 470], [422, 478], [440, 540], [452, 620], [462, 700], [470, 750, 1], [450, 744], [432, 760, 1], [412, 750], [404, 660], [396, 560]];
  f.part(lin, { fill: lining, tex: T('weave'), texOp: 0.3, shadow: '#6a5a6a' });
  const stars = [[404, 512], [418, 530], [412, 556], [428, 574], [420, 604], [436, 628], [428, 662], [444, 688], [432, 716], [448, 734]];
  f.line(stars.slice(0, 4), 1, '#3a2a4a', { straight: true, op: 0.75 }); f.line(stars.slice(4, 7), 1, '#3a2a4a', { straight: true, op: 0.75 }); f.line(stars.slice(7), 1, '#3a2a4a', { straight: true, op: 0.75 });
  for (const st of stars) { f.line([add(st, [-3.5, 0]), add(st, [3.5, 0])], 1.2, '#2a1a3a', { straight: true }); f.line([add(st, [0, -3.5]), add(st, [0, 3.5])], 1.2, '#2a1a3a', { straight: true }); }
  ring(f, [424, 642], 14, 14, 1, '#3a2a4a', { op: 0.6 }); f.line([[410, 642], [438, 642]], 0.8, '#3a2a4a', { op: 0.5 });
  f.flat([[436, 500], [446, 508], [444, 522], [438, 512]], '#3a2a4a', { op: 0.7 });
  for (const q of [[[410, 520], [420, 600], [418, 690]], [[432, 560], [446, 650], [452, 740]]]) f.stroke(q, 1.8, '#5a4a52');
  f.part([[422, 478], [434, 476], [452, 540], [466, 620], [478, 700], [484, 752], [470, 750, 1], [462, 700], [452, 620], [440, 540]], RB({ inkW: 1.4 }));
  // ---- rope belt, wax tablet, badge, knotted prayer cord
  f.bone('torso');
  f.part([[212, 466], [290, 474], [356, 470], [384, 466], [384, 476], [356, 480], [290, 484], [212, 478]], { fill: '#6e5a3a', tex: T('hatch'), texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 9; i++) f.line([[218 + i * 18, 467 + (i < 4 ? i * 2 : 8)], [224 + i * 18, 478 + (i < 4 ? i * 2 : 8)]], 1, INK, { op: 0.55 });
  f.stroke([[366, 476], [370, 520], [364, 566]], 4, '#6e5a3a'); f.stroke([[372, 476], [380, 512], [382, 540]], 3.5, '#5e4a2e');
  for (const y of [500, 524, 548]) f.part(ell([368, y], 4.4, 4.4, 0, 8), { fill: '#6e5a3a', inkW: 1, cast: false });
  f.line([[236, 476], [232, 500]], 2, '#3a2618');
  f.part([[208, 498], [252, 494], [256, 556], [212, 560]], { fill: '#6a4a2a', tex: T('wood'), sharp: true, inkW: 1.4 });
  f.part([[214, 504], [248, 500], [250, 550], [218, 554]], { fill: '#c09858', sharp: true, inkW: 1 });
  for (let i = 0; i < 4; i++) f.line([[220, 512 + i * 10], [244, 509 + i * 10]], 0.9, '#5a3a1a', { op: 0.8 });
  f.part(limb([200, 520], [266, 508], 4, 3, { steps: 4, capK: 2 }), { fill: '#b8b0a0', inkW: 1, inkHeavy: 1.4, cast: false });
  f.line([[302, 480], [304, 500]], 1.2, '#2b2119');
  G.badge(f, [304, 500], 10, '#74777b', 0.08);
  if (AU) {
    // a pouch of knucklebones on the belt, more knucklebones knotted to its drawstring
    const pc = [338, 512];
    f.line([[334, 480], add(pc, [-4, -24])], 1.6, '#3a2618'); f.line([[342, 480], add(pc, [6, -24])], 1.6, '#3a2618');
    f.part([add(pc, [-12, -24]), add(pc, [12, -24]), add(pc, [18, -8]), add(pc, [20, 14]), add(pc, [10, 26]), add(pc, [-10, 26]), add(pc, [-19, 12]), add(pc, [-17, -10])], { fill: '#5a3e26', tex: T('mottle'), texOp: 0.6, shadow: '#1e140a' });
    f.stroke([add(pc, [-12, -16]), add(pc, [0, -12]), add(pc, [13, -16])], 2, '#1e140a');
    for (const q of [[[-8, -10], [-10, 14]], [[6, -8], [8, 18]]]) f.stroke(q.map(v => add(pc, v)), 1.6, '#1e140a');
    f.flat(ell(add(pc, [-6, 4]), 4, 6, 0.2, 8), '#7a5a3a', { op: 0.6 });
    const kb = (c, a) => { const F = frame(c, a, 1); f.part(F([[-6, -4], [-2, -6], [2, -4], [6, -6], [7, 0], [6, 5], [2, 3], [-2, 5], [-6, 4], [-7, 0]]), { fill: '#cfc4a6', inkW: 1.1, shade: 0.4, cast: false }); f.line(F([[-2, -3], [-1, 3]]), 0.9, '#7a6a50', { op: 0.8 }); };
    for (const [dx, l, a] of [[-10, 30, 0.3], [2, 40, -0.2], [12, 26, 0.6]]) { const t0 = add(pc, [dx, -20]), t1 = add(pc, [dx * 1.3, -20 + l + 18]); f.line([t0, t1], 1, '#3a2618'); kb(add(t1, [0, 5]), a); }
  }
  if (FB) {
    // ink horn of red rubric hung from the belt: a cow-horn pot, plugged, red run down its side
    const ih = [378, 482];
    f.line([ih, add(ih, [2, 14])], 1.6, '#3a2618');
    const horn = [add(ih, [-8, 14]), add(ih, [10, 12]), add(ih, [12, 24]), add(ih, [10, 44]), add(ih, [16, 62]), add(ih, [22, 72]), add(ih, [14, 70]), add(ih, [2, 56]), add(ih, [-6, 36]), add(ih, [-10, 22])];
    f.part(horn, { fill: '#b8a888', tex: T('hatch'), texOp: 0.3, shade: 0.4, inkW: 1.3 });
    for (let i = 0; i < 4; i++) f.line([add(ih, [-8 + i, 26 + i * 9]), add(ih, [10 + i * 0.6, 24 + i * 9])], 0.9, '#6a5a40', { op: 0.6 });
    f.flat([add(ih, [16, 60]), add(ih, [22, 72]), add(ih, [14, 70]), add(ih, [10, 62])], '#2a2016', { op: 0.85 }); // dark tip
    f.part(ell(add(ih, [1, 13]), 10, 3.5, -0.1, 12), { fill: '#3a1410', inkW: 1.1, cast: false, hatch: false });
    f.flat(ell(add(ih, [1, 13]), 7, 2, -0.1, 10), rubric);
    f.flat([add(ih, [8, 14]), add(ih, [11, 15]), add(ih, [10, 30]), add(ih, [8, 34]), add(ih, [7, 24])], rubric, { op: 0.9 }); // red run
    f.line([add(ih, [-4, 16]), add(ih, [-5, 22])], 1, '#fff', { op: 0.4 });
  }
  const drip = ([x, y]) => f.flat([[x, y], [x + 4, y], [x + 5, y + 10], [x + 2, y + 14], [x - 1, y + 9]], '#d8d0c0', { op: 0.75 });
  f.bone('skirt'); drip([320, 560]); drip([326, 590]);
  f.bone('torso'); drip([270, 430]);
  // ---- far arm in its wide sleeve, fist gripping the robe's edge
  const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
  split(f, () => f.part(chain([SF, EF, WF], [46, 44, 40], { bq: [[1, 0.5, 0.18]] }), RB()), [['upperarm_f', side(EF, mul(elb(SF, EF, WF), -1), 22)], ['forearm_f', side(EF, elb(SF, EF, WF), 22)]]);
  f.bone('forearm_f');
  f.part([lp(EF, WF, 0.45, 22), lp(EF, WF, 0.9, 26), [WF[0] - 2, WF[1] + 18, 1], [WF[0] - 18, WF[1] + 40], [WF[0] - 36, WF[1] + 46, 1], [EF[0] + 4, EF[1] + 44], lp(EF, WF, 0.4, -20)], RB({ fill: robeD }));
  f.flat([[WF[0] - 4, WF[1] - 14], [WF[0] - 2, WF[1] + 14], [WF[0] - 14, WF[1] + 30], [WF[0] - 14, WF[1] - 6]], '#0a080c', { op: 0.85 });
  if (FB) { f.bone('upperarm_f'); script(f, [lp(SF, EF, 0.3, 10), lp(SF, EF, 0.85, 12)], 5, rubric, { w: 1.1 }); f.bone('forearm_f'); script(f, [lp(EF, WF, 0.5, 12), lp(EF, WF, 0.9, 16)], 5, rubric, { w: 1.1 }); }
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 19, skin, { shadow: skinS, tex: T('mottle'), quiet: true });
  if (FB) for (let i = 0; i < 3; i++) f.line([add(WF, [-14 + i * 3, -10 + i * 7]), add(WF, [-6 + i * 3, -12 + i * 7]), add(WF, [-2 + i * 3, -8 + i * 7])], 1, rubric, { op: 0.9 }); // script on the back of the hand
  f.bone('robe_front');
  f.part([add(WF, [6, -18]), add(WF, [14, -20]), add(WF, [16, -6]), add(WF, [8, -4])], RB({ inkW: 1.1, cast: false }));
  // ---- head
  f.bone('head');
  f.part(limb([300, 330], add(HC, [-14, 32]), 30, 28), SKN());
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 0.9, chin: -0.01, nose: 1.02, hook: 0.15, mouth: 'set', squint: 0.0, blind: true, gaunt: true, lips: true, faceHatch: false,
    hairCol: '#3a302a', noEar: true, browCol: '#3a302a',
  });
  f.part(hf([[-0.3, -0.2], [0.42, -0.21], [0.45, -0.02], [-0.3, 0.02]]), { fill: '#d8ccb0', tex: T('weave'), k: 0.6, shadow: '#7a6a6a' }); // blindfold
  f.line(hf([[-0.28, -0.11], [0.44, -0.12]]), 0.9, '#8a7a6a', { op: 0.6 });
  const pe = hf([[0.17, -0.1]])[0];
  f.line(hf(ell([0.17, -0.1], 0.07, 0.04, 0, 14).concat([ell([0.17, -0.1], 0.07, 0.04, 0, 14)[0]])), 1.5, '#3a1e52');
  f.flat(ell(pe, 3.4, 3.4, 0, 8), '#3a1e52'); f.flat(ell(add(pe, [-1, -1]), 1, 1, 0, 6), '#d8ccb0');
  f.line(hf([[0.08, -0.16], [0.17, -0.18], [0.26, -0.155]]), 1.2, '#3a1e52', { op: 0.8 });
  f.flat(hf([[0.2, -0.02], [0.215, 0.06], [0.205, 0.09], [0.195, 0.05]]), '#3a1e52', { op: 0.6 });
  if (FB) { script(f, hf([[-0.24, -0.06], [-0.02, -0.05]]), 3, rubric, { w: 0.8 }); script(f, hf([[0.02, 0.34], [0.18, 0.42]]), 3, rubric, { w: 0.8 }); } // rubric on the band and the jaw
  {
    // hood front
    f.flat(hf([[-0.3, -0.42], [-0.08, -0.5], [0.24, -0.42], [0.34, -0.3], [0.1, -0.34], [-0.16, -0.3], [-0.24, 0.0], [-0.2, 0.36], [-0.34, 0.4], [-0.38, 0.0]]), '#0c0810', { op: 0.85 });
    f.part(hF([[0.52, -0.3, 1], [0.46, -0.5], [0.2, -0.72], [-0.22, -0.76], [-0.6, -0.52], [-0.76, 0.0], [-0.72, 0.5], [-0.62, 0.92], [-0.2, 1.02], [0.22, 0.88], [0.34, 0.7, 1], [0.18, 0.62], [-0.06, 0.52], [-0.22, 0.3], [-0.28, 0.0], [-0.24, -0.3], [-0.08, -0.48], [0.14, -0.5], [0.34, -0.38]]), RB());
    f.stroke(hF([[0.1, 0.72], [-0.1, 0.84], [-0.4, 0.86]]), 2, '#0e0a12'); f.stroke(hF([[-0.3, 0.5], [-0.5, 0.62], [-0.56, 0.84]]), 1.8, '#0e0a12');
    f.stroke(hF([[-0.48, -0.3], [-0.54, 0.0], [-0.5, 0.36]]), 2.4, '#0e0a12'); f.stroke(hF([[-0.1, -0.62], [0.16, -0.58], [0.34, -0.46]]), 1.8, '#0e0a12');
  }
  if (AU) {
    // feathers tucked into the hair at the brow, swept back over the crown of the hood: owl, gull, rook
    const fr = hf([[0.06, -0.44]])[0];
    f.part(hf([[-0.04, -0.47], [0.2, -0.47], [0.26, -0.36], [0.06, -0.34]]), { fill: '#7a7064', tex: T('mottle'), inkW: 1, cast: false }); // grey hair at the brow
    feather(f, add(fr, [-2, 2]), -2.75, 84, '#2c2830', false, S);
    feather(f, fr, -2.55, 100, '#8a8478', true, S);
    feather(f, add(fr, [3, 3]), -2.35, 76, '#c8c2b2', false, S);
    f.line([add(fr, [-4, -2]), add(fr, [4, 6])], 2.4, '#b8a888'); // thread wound round the quills
  }
  if (FB) script(f, hF([[-0.6, 0.86], [-0.2, 0.98], [0.2, 0.86]]), 5, rubric, { w: 1.1 });
  // ---- near upper arm under the cape
  f.bone('upperarm_n');
  f.part(limb(SN, lerp(SN, EN, 0.62), 40, 40, { steps: 6 }), RB());
  // ---- shoulder cape
  f.bone('cape');
  f.part([[296, 312], [252, 326], [222, 352], [208, 396, 1], [224, 386], [236, 400, 1], [262, 392], [282, 414, 1], [294, 396], [318, 402, 1], [344, 388], [360, 398, 1], [370, 360], [350, 330], [322, 314]], RB({ fill: mix(robe, '#000', 0.08) }));
  f.stroke([[250, 340], [244, 372], [240, 396]], 2, '#0e0a12'); f.stroke([[300, 334], [304, 368], [300, 392]], 2, '#0e0a12');
  if (FB) script(f, [[218, 380], [262, 380], [300, 388], [348, 380]], 5, rubric, { w: 1.1 });
  if (AU) {
    // long uncut ash-grey hair falling out of the hood's mouth in loose locks over the cape, feathers and bird bones tied in
    f.bone('head');
    const hair = '#7a7064', hairL = '#b4a898', hairD = '#2e2822';
    const lock = (p0, l, waves, w0) => {
      const pts = [p0]; for (let i = 1; i <= 5; i++) pts.push(add(p0, [waves[i - 1], l * i / 5]));
      f.part(chain(pts, [w0, w0 * 0.8, w0 * 0.95, w0 * 0.6, w0 * 0.55, 3], { steps: 6 }), { fill: hair, tex: T('mottle'), texOp: 0.5, shadow: hairD, inkW: 1.2, inkHeavy: 2, cast: false });
      for (const o of [-0.25, 0.1, 0.3]) f.line(pts.map((q, i) => add(q, [o * w0 * (1 - i / 7) + (i % 2 ? 1.5 : -1.5), 0])), 0.9, hairL, { op: 0.6 }); f.line(pts.map((q, i) => add(q, [-0.05 * w0, 0])), 1, hairD, { op: 0.5 }); // strands
      f.line([add(pts[5], [-2, -6]), add(pts[5], [-4, 4])], 1, hair); f.line([add(pts[5], [2, -6]), add(pts[5], [3, 6])], 1, hair); // split ends
      return pts;
    };
    const L1 = lock(hf([[-0.42, -0.06]])[0], 176, [-9, -2, -10, -3, -8], 18);
    const L3 = lock(hf([[-0.22, 0.38]])[0], 96, [5, -2, 4, -1, 3], 12);
    const L2 = lock(hf([[-0.34, 0.2]])[0], 150, [6, -3, 7, 0, 5], 15);
    // bird bones: vertebra beads, a wishbone, a finch skull; feathers knotted into the ends
    for (const t of [0.42, 0.5, 0.58]) f.part(ell(add(L1[0], [-2, 168 * t]), 4.4, 3.2, 0, 8), { fill: '#d6ccb2', inkW: 1, cast: false, shade: 0.3 });
    const wb = add(L2[0], [2, 62]);
    f.line([add(wb, [-7, -2]), add(wb, [0, 14]), add(wb, [7, -2])], 2.4, '#d6ccb2'); f.line([add(wb, [-7, -2]), add(wb, [0, 14]), add(wb, [7, -2])], 0.8, INK, { op: 0.5 });
    const sk = add(L3[0], [-2, 56]);
    f.part([add(sk, [-6, -5]), add(sk, [4, -6]), add(sk, [8, 0]), add(sk, [17, 3]), add(sk, [6, 4]), add(sk, [-4, 5])], { fill: '#d6ccb2', inkW: 1.1, cast: false, shade: 0.35 }); f.flat(ell(add(sk, [0, -1]), 2, 2, 0, 6), '#1a1410');
    for (const [L, a, l, col, bars] of [[L1, 1.42, 52, '#8a8478', true], [L2, 1.72, 44, '#c8c2b2', false], [L3, 1.3, 38, '#2c2830', false]]) {
      const e = L[5]; feather(f, add(e, [0, -10]), a, l, col, bars, S);
      f.line([add(e, [-6, -10]), add(e, [6, -11])], 2.2, '#b8a888', { straight: true }); // thread knot over the quill
    }
    feather(f, add(L2[0], [-4, 96]), 2.5, 30, '#9a9284', true, S);
  }
  // ---- chronomancer: the brass clock face hung on the chest by a chain round the neck
  if (CH) {
    f.bone('torso');
    const cc = [322, 366], cr = 26;
    chainLinks(f, [300, 326], add(cc, [-14, -cr + 4]), 3, '#6a6a66'); chainLinks(f, [334, 332], add(cc, [8, -cr + 2]), 3, '#6a6a66');
    f.part(ell(add(cc, [-3, 3]), cr + 1, cr + 2, 0, 24), { fill: BRASS_D, inkW: 1.4, shade: 0.5 }); // case depth
    f.part(ell(cc, cr, cr, 0, 24), { fill: BRASS, tex: T('mottle'), texOp: 0.5, shade: 0.45, inkW: 1.5 });
    f.part(ell(cc, cr - 5, cr - 5, 0, 22), { fill: '#c4b894', tex: T('mottle'), texOp: 0.4, shade: 0.3, inkW: 1.1, cast: false, hatch: false }); // bone enamel dial
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, r0 = cr - 7, r1 = cr - (i % 3 ? 10 : 13); f.line([add(cc, [Math.cos(a) * r0, Math.sin(a) * r0]), add(cc, [Math.cos(a) * r1, Math.sin(a) * r1])], i % 3 ? 1 : 1.8, INK, { straight: true }); }
    f.line([cc, add(cc, rot([0, -15], 0.6))], 2.4, IRON_D, { straight: true }); f.line([cc, add(cc, rot([0, -9], 2.3))], 3, IRON_D, { straight: true }); // hands stopped
    f.part(ell(cc, 2.6, 2.6, 0, 8), { fill: IRON_D, inkW: 0.8, cast: false });
    f.line([add(cc, [-cr + 8, -6]), add(cc, [-4, 2]), add(cc, [6, 0]), add(cc, [cr - 8, 10])], 1, '#f0eee4', { op: 0.65 }); // cracked glass
    f.line([add(cc, [-4, 2]), add(cc, [-8, 14])], 0.9, '#f0eee4', { op: 0.55 });
    f.line([add(cc, [-cr + 4, -10]), add(cc, [-cr + 10, -cr + 6])], 1.4, BRASS_L, { op: 0.6 });
    f.flat(ell(add(cc, [16, 18]), 5, 3, 0.6, 8), VERD, { op: 0.8 }); f.flat(ell(add(cc, [-20, 12]), 3, 2, 0.2, 6), VERD, { op: 0.7 });
    f.part(ell(add(cc, [0, -cr - 3]), 4, 4, 0, 8), { fill: BRASS, inkW: 1, cast: false }); // bow
  }
  // ---- near arm
  split(f, () => f.part(chain([lerp(SN, EN, 0.55), EN, lerp(EN, WN, 0.7)], [40, 42, 36]), RB()), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 21)], ['forearm_n', side(EN, elb(SN, EN, WN), 21)]]);
  f.bone('forearm_n');
  const slv = FB ? 0.52 : 0.78; // the fatebinder's sleeve is pushed back to show the script on her forearm
  f.part(ragLimb(f, EN, lerp(EN, WN, slv), 38, 46, { depth: 5, teeth: 4 }), RB({ fill: robeD }));
  f.part(limb(lerp(EN, WN, slv - 0.08), WN, FB ? 24 : 20, 18), SKN({ cast: false }));
  if (FB) { script(f, [lp(EN, WN, 0.56, -4), lp(EN, WN, 0.86, -3)], 4, rubric, { w: 1 }); script(f, [lp(EN, WN, 0.58, 5), lp(EN, WN, 0.84, 4)], 4, rubric, { w: 1 }); }
  if (CH) {
    // the broken pendulum as a staff: an iron rod, its brass bob carried at the top, the snapped end planted
    f.bone('staff');
    const s0 = [450, 786], s1 = [423, 200], bob = [421, 170];
    f.part(limb(s0, s1, 11, 10, { steps: 10, capK: 0.4 }), { fill: IRON, tex: T('mottle'), texOp: 0.4, shade: 0.4, inkW: 1.3 });
    f.line([lp(s0, s1, 0.02, -2.5), lp(s0, s1, 0.98, -2.5)], 1, '#9a9c9e', { op: 0.55, straight: true });
    for (const t of [0.22, 0.48, 0.7]) f.flat(ell(lp(s0, s1, t, 1), 3, 6, 0, 6), '#5a3a22', { op: 0.6 }); // rust
    // snapped suspension spring at the planted end: a bent steel strip and a torn hook
    f.part([add(s0, [-5, -8]), add(s0, [6, -10]), add(s0, [8, -2]), add(s0, [12, 2]), add(s0, [3, 2]), add(s0, [-2, 0]), add(s0, [-6, 2])], { fill: '#5a5c5e', inkW: 1.1, cast: false, sharp: true });
    f.line([add(s0, [6, -22]), add(s0, [16, -30]), add(s0, [22, -26])], 2, '#8a8c8e'); f.line([add(s0, [6, -22]), add(s0, [16, -30]), add(s0, [22, -26])], 0.8, INK, { op: 0.6 });
    // rating nut under the bob
    f.part([add(bob, [-7, 26]), add(bob, [7, 26]), add(bob, [7, 38]), add(bob, [-7, 38])], { fill: BRASS, inkW: 1.1, shade: 0.4, cast: false, sharp: true });
    for (let i = 0; i < 3; i++) f.line([add(bob, [-7, 29 + i * 3.5]), add(bob, [7, 29 + i * 3.5])], 0.8, BRASS_D, { straight: true });
    // the bob: a heavy lens of brass, dented, worn bright at the rim
    f.part(ell(add(bob, [-2, 3]), 32, 29, 0, 24), { fill: BRASS_D, shade: 0.5, inkW: 1.4 });
    f.part(ell(bob, 31, 28, 0, 24), { fill: BRASS, tex: T('mottle'), texOp: 0.55, shade: 0.5, inkW: 1.6 });
    ring(f, bob, 19, 17, 1.2, BRASS_D, { op: 0.8 });
    f.line([add(bob, [-24, -10]), add(bob, [-16, -22]), add(bob, [-2, -27])], 2, BRASS_L, { op: 0.6 });
    f.flat(ell(add(bob, [10, 8]), 5, 3, 0.4, 8), BRASS_D, { op: 0.6 }); f.line(ell(add(bob, [10, 8]), 5, 3, 0.4, 8).slice(0, 5), 0.9, BRASS_L, { op: 0.6 }); // dent
    f.flat(ell(add(bob, [-14, 14]), 6, 4, 0.2, 8), VERD, { op: 0.75 }); f.flat(ell(add(bob, [20, -6]), 3, 4, 0, 6), VERD, { op: 0.7 });
    f.line([add(bob, [-4, -1]), add(bob, [4, 1])], 0.9, BRASS_D, { op: 0.8 }); f.line([add(bob, [0, -5]), add(bob, [0, 5])], 0.9, BRASS_D, { op: 0.8 }); // maker's cross, struck
    for (let i = 0; i < 5; i++) f.line([lp(s0, s1, 0.48 + i * 0.012, -6), lp(s0, s1, 0.49 + i * 0.012, 6)], 1.8, '#6e5a3a', { straight: true }); // cord grip
  }
  if (FB) {
    // the quill, held upright at the breast, its nib dipped red
    f.bone('quill');
    const qa = -1.36, qd = [Math.cos(qa), Math.sin(qa)], q0 = add(WN, mul(qd, -24));
    f.part(limb(q0, add(WN, mul(qd, 10)), 3, 3.4, { steps: 4, capK: 1.5 }), { fill: '#d8d0bc', inkW: 1, cast: false, shade: 0.3 });
    f.part(limb(add(q0, mul(qd, -6)), q0, 1, 3, { steps: 3, capK: 2 }), { fill: rubric, inkW: 0.9, cast: false }); // red nib
    const F = frame(add(WN, mul(qd, 10)), qa, 1);
    f.part(F([[0, -2], [30, -8], [70, -12], [100, -10], [112, -4], [114, 0, 1], [100, 3], [70, 7], [36, 6], [0, 2]]), { fill: '#d8d2c4', tex: T('hatch'), texOp: 0.3, shade: 0.35, inkW: 1.2 });
    f.line(F([[0, 0], [60, -1], [112, -2]]), 1.1, '#8a8274');
    for (let i = 0; i < 9; i++) f.line(F([[16 + i * 10, -1], [26 + i * 10, -9 + (i > 6 ? 4 : 0)]]), 0.8, '#8a8274', { op: 0.7 });
    f.line(F([[50, -11], [56, -15]]), 1, '#d8d2c4'); f.line(F([[84, 5], [90, 10]]), 1, '#d8d2c4'); // split barbs
  }
  // the hourglass on its chain (on the wrist for the chronomancer and fatebinder, pinched in the fingers otherwise)
  f.bone('hourglass');
  if (wrist) { const wr = lp(EN, WN, 0.72, 0); ring(f, wr, 5, 13, 2.4, '#8a8a86', { ang: Math.atan2(WN[1] - EN[1], WN[0] - EN[0]) }); f.line([ch0, add(ch0, [1, 16]), add(hg, [0, -28])], 1.6, '#8a8a86', { dash: '3 1.5' }); }
  else f.line([ch0, add(ch0, [2, 14]), add(hg, [0, -28])], 1.6, '#8a8a86', { dash: '3 1.5' });
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
  if (CH) B.grip(f, WN, EN, -Math.PI / 2, 18, skin, { shadow: skinS, tex: T('mottle'), name: 'pendulum staff' });
  else if (FB) B.grip(f, WN, EN, -1.36, 17, skin, { shadow: skinS, tex: T('mottle'), name: 'quill' });
  else B.grip(f, WN, EN, -Math.PI / 2, 18, skin, { shadow: skinS, tex: T('mottle'), quiet: true });
  f.line(ell(add(WN, [6, -2]), 3, 4, 0, 8).concat([ell(add(WN, [6, -2]), 3, 4, 0, 8)[0]]), 1.6, '#cfc8b8'); // bone ring
  if (FB) f.flat(ell(add(WN, [10, 6]), 3, 2, 0.4, 6), rubric, { op: 0.8 }); // ink on the fingers
  return f;
}
// a feather from its quill end p0, pointing along ang: shaft, two vanes of uneven width, barbs, a split or two
function feather(f, p0, ang, l, col, bars, S) {
  const F = frame(p0, ang, 1), dk = mix(col, '#000', 0.45);
  f.part(F([[0, 0], [l * 0.25, -l * 0.08], [l * 0.6, -l * 0.12], [l * 0.92, -l * 0.07], [l, 0, 1], [l * 0.88, l * 0.06], [l * 0.55, l * 0.09], [l * 0.3, l * 0.06], [l * 0.12, l * 0.02]]), { fill: col, tex: 'hatch' + S, texOp: 0.25, shade: 0.35, inkW: 1.1, inkHeavy: 1.6, cast: false });
  f.line(F([[-l * 0.08, 0], [l * 0.5, -l * 0.01], [l * 0.98, 0]]), 1, mix(col, '#fff', 0.4), { op: 0.8 });
  for (let i = 1; i < 7; i++) f.line(F([[l * i * 0.13, -l * 0.005], [l * (i * 0.13 + 0.07), -l * 0.085]]), 0.7, dk, { op: 0.6 });
  if (bars) for (let i = 1; i < 5; i++) f.flat(F([[l * (i * 0.18), -l * 0.1], [l * (i * 0.18 + 0.05), -l * 0.11], [l * (i * 0.18 + 0.07), l * 0.07], [l * (i * 0.18 + 0.02), l * 0.07]]), dk, { op: 0.55 });
  f.line(F([[l * 0.55, -l * 0.115], [l * 0.6, -l * 0.15]]), 0.9, col);
}

// ================================================================== HEXWEAVER
// path: 'pactbound' | 'doomsayer' | 'mirrorhex'
function hexweaver(path, seed) {
  const f = new Fig(base(seed));
  const S = seed, T = n => n + S;
  const PB = path === 'pactbound', DS = path === 'doomsayer', MH = path === 'mirrorhex';
  const H = 94;
  const rag = '#2a3226', ragL = '#3c4636', ragM = '#33302a', bone = '#cbbf9f', skin = '#c4a88a', skinS = '#6e5048', hair = '#2c2622', wax = '#2a2622';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, tex: T('mottle'), texOp: 0.45 }, o);
  const RG = (fill, o = {}) => Object.assign({ fill, tex: T('weave'), texOp: 0.5, shadow: '#10140e' }, o);
  const HC = [370, 350], hA = DS ? 0.62 : 0.55;
  const SN = [280, 410];
  // near arm: base holds the poppet out; the doomsayer lifts the handbell higher to ring it under her bowed face
  const EN = DS ? [330, 470] : [300, 496], WN = DS ? [440, 404] : [422, 484];
  const SF = [348, 404], EF = [391, 272], WF = [466, 300];
  const HFp = [326, 568], KF = [406, 618], AF = [382, 744];
  const HNp = [252, 572], KN = [226, 672], AN = [198, 748];
  const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
  const ankle = (K0, A) => add(E.norm(sub(A, K0)), [0.6, 0]);
  const WB = [290, 542];

  f.joint('pelvis', [290, 566]).joint('torso', WB, 'pelvis').joint('head', [318, 400], 'torso').joint('skirt', WB, 'pelvis');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('pin', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('poppet', add(WN, [2, -4]), 'hand_n');
  f.joint('thigh_f', HFp, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HNp, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  if (DS) f.joint('staff', WF, 'hand_f').joint('handbell', WN, 'hand_n');
  if (MH) f.joint('mirror', WF, 'hand_f');
  const strips = (a, b, n, len, fill, o = {}) => { for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, c = lerp(a, b, t), l = len * (0.55 + f.r() * 0.7), w = len * 0.22 + f.r() * 6, sw = (f.r() - 0.5) * 8; f.part([add(c, [-w / 2, -4]), add(c, [w / 2, -4]), add(c, [w / 2 + sw * 0.5, l * 0.7]), [...add(c, [w * 0.2 + sw, l]), 1], add(c, [-w * 0.1 + sw, l * 0.82]), [...add(c, [-w / 2 + sw * 0.6, l * 0.92]), 1]], RG(fill, Object.assign({ inkW: 1.2, inkHeavy: 2, cast: false }, o))); } };

  // ---- matted hair falling down the back
  const hF = frame(HC, hA, H), hG = frame(HC, 0.2, H);
  f.bone('head');
  f.part(hG([[-0.2, -0.5], [-0.56, -0.36], [-0.74, 0.0], [-0.8, 0.5], [-0.9, 0.9], [-0.7, 1.0], [-0.66, 0.74], [-0.52, 0.96], [-0.4, 0.7], [-0.3, 0.3]]), { fill: hair, tex: T('hatch'), texOp: 0.35 });
  if (MH) { // the hood's back, behind the head
    f.part(hF([[-0.66, 0.46], [-0.82, 0.0], [-0.7, -0.46], [-0.32, -0.7], [0.1, -0.7], [0.38, -0.54], [0.44, -0.3], [0.0, 0.0], [-0.3, 0.5]]), RG('#1e241c'));
  }
  if (DS) {
    // the long staff topped with a small iron bell, planted ahead of her front foot; behind the raised arm
    f.bone('staff');
    const s0 = [474, 788], s1 = [462, 104];
    f.part(limb(s0, s1, 13, 11, { steps: 12, capK: 0.5, p: [[0.3, 0.12, 0.03], [0.62, 0.1, 0.03]], q: [[0.45, 0.1, 0.03]] }), { fill: '#3e3226', tex: T('wood'), texOp: 0.5, shade: 0.4, inkW: 1.4 });
    f.line([lp(s0, s1, 0.03, -3), lp(s0, s1, 0.97, -3)], 1, '#7a6a52', { op: 0.55, straight: true });
    for (const t of [0.3, 0.62]) f.flat(ell(lp(s0, s1, t, 0), 4, 3, 0, 8), '#1e160e', { op: 0.8 }); // knots in the wood
    for (const t of [0.12, 0.84]) for (let i = 0; i < 4; i++) f.line([lp(s0, s1, t + i * 0.008, -7), lp(s0, s1, t + i * 0.008 + 0.004, 7)], 1.8, '#8a7a5a', { straight: true }); // cord bindings
    // the crook: the top bent forward into a hook, the bell hung from it on a short chain
    const ck = [[462, 108], [464, 86], [476, 74], [492, 76], [500, 90]];
    f.line(ck, 13, INK); f.line(ck, 9.5, '#3e3226'); f.line(ck.slice(0, 3).map(q => add(q, [-2, -1])), 1.2, '#7a6a52', { op: 0.6 });
    for (let i = 0; i < 5; i++) f.line([add(ck[0], [-7, 6 + i * 2.4]), add(ck[0], [7, 4 + i * 2.4])], 1.6, '#7a6a52', { straight: true });
    chainLinks(f, [500, 92], [500, 112], 3, IRON);
    const bl = [500, 114];
    f.part([add(bl, [-5, 0]), add(bl, [5, 0]), add(bl, [9, 6]), add(bl, [11, 18]), add(bl, [16, 28]), add(bl, [17, 32, 1]), add(bl, [-17, 32, 1]), add(bl, [-16, 28]), add(bl, [-11, 18]), add(bl, [-9, 6])], { fill: IRON, tex: T('mottle'), texOp: 0.5, shade: 0.45, inkW: 1.4 });
    f.part(ell(add(bl, [0, 32]), 17, 4, 0, 14), { fill: '#141210', inkW: 1.1, cast: false, hatch: false });
    f.part(ell(add(bl, [2, 34]), 3.4, 3.4, 0, 8), { fill: IRON_D, inkW: 0.9, cast: false }); // clapper
    f.line([add(bl, [-8, 8]), add(bl, [-12, 26])], 1.2, '#8a8c8e', { op: 0.55 });
    f.flat(ell(add(bl, [8, 18]), 4, 3, 0.4, 8), '#5a3a22', { op: 0.7 }); // rust
    // rag strips knotted under the crook, hanging plumb
    for (const [dx, l, col] of [[-4, 40, ragL], [2, 54, '#4a4436'], [7, 34, ragM]]) { const t0 = add(ck[0], [dx, 18]); f.part([add(t0, [-3, 0]), add(t0, [3, 0]), add(t0, [4, l * 0.6]), [...add(t0, [2, l]), 1], add(t0, [-1, l * 0.8]), [...add(t0, [-3, l * 0.9]), 1]], RG(col, { inkW: 1.1, cast: false })); }
    f.part(ell(add(ck[0], [0, 20]), 6, 4, 0, 8), RG(ragL, { inkW: 1, cast: false }));
  }
  // ---- far arm raised high in front
  f.bone('upperarm_f');
  f.part(ragLimb(f, SF, lerp(SF, EF, 0.95), 38, 40, { depth: 6, teeth: 4 }), RG(ragL));
  split(f, () => f.part(chain([lerp(SF, EF, 0.85), EF, WF], [32, 34, 28], { bq: [[1, 0.3, 0.12]] }), SKN()), [['upperarm_f', side(EF, mul(elb(SF, EF, WF), -1), 17)], ['forearm_f', side(EF, elb(SF, EF, WF), 17)]]);
  f.bone('forearm_f');
  for (let i = 0; i < 4; i++) f.line([lp(EF, WF, 0.18 + i * 0.13, -15), lp(EF, WF, 0.24 + i * 0.13, 15)], 2.2, '#8a7a5a', { straight: true });
  f.part(ell(lp(EF, WF, 0.3, 14), 4, 4, 0, 8), { fill: '#8a7a5a', inkW: 1, cast: false });
  const pp = [WN[0] + 4, WN[1] - 40];
  const pa = Math.atan2(pp[1] - 34 - WF[1], pp[0] - WF[0]);
  if (PB) {
    // the bone knife: a long blade ground from a rib, nicked, bloodied at the edge and point; cord-bound grip, knucklebone pommel
    f.bone('pin');
    const d = [Math.cos(pa), Math.sin(pa)], n = [-d[1], d[0]], K = (x, y) => add(add(WF, mul(d, x)), mul(n, y));
    f.part([K(-30, -6), K(-14, -8), K(-14, 8), K(-30, 6)], { fill: '#4a3a28', inkW: 1.2, cast: false, shade: 0.4 });
    f.part(ell(K(-33, 0), 7, 6, pa, 10), { fill: '#d6ccb0', inkW: 1.1, cast: false, shade: 0.4 }); // knucklebone pommel
    f.part([K(10, -7), K(34, -8.5), K(58, -7), K(76, -3), K(88, 2, 1), K(70, 4), K(46, 6), K(22, 6.5), K(10, 7)], { fill: '#d8ccae', tex: T('hatch'), texOp: 0.25, shade: 0.4, inkW: 1.4 });
    f.line([K(14, 0), K(50, -1), K(80, 1)], 1, '#9a8c70', { op: 0.7 }); // the rib's groove
    for (const x of [30, 44, 62]) f.flat([K(x, 6.5), K(x + 3, 3.5), K(x + 6, 6)], '#2a2016'); // nicks in the edge
    f.flat([K(54, 4), K(76, 0), K(88, 2), K(70, 4.6), K(56, 6.2)], BLOOD, { op: 0.85 }); f.flat([K(80, 1), K(88, 2), K(82, 3)], BLOOD_F);
    f.flat([K(64, 6), K(66, 6), K(65.5, 14), K(64.4, 14)], BLOOD, { op: 0.8 }); // a drop hanging from the edge
    f.part([K(-14, -8), K(10, -9), K(12, 9), K(-14, 8)], { fill: '#3a2a1c', inkW: 1.2, cast: false, shade: 0.4 }); // grip
    for (let i = 0; i < 5; i++) f.line([K(-12 + i * 5, -8), K(-9 + i * 5, 8)], 1.6, '#8a7a5a', { straight: true });
  } else if (MH) {
    // the cracked hand mirror, held up and turned on the foe, its cord looped round the wrist
    f.bone('mirror');
    const gM = B.gripAngle(WF, EF, -Math.PI / 2, { name: 'mirror handle' }), ax = [Math.cos(gM.axis), Math.sin(gM.axis)];
    const h0 = add(WF, mul(ax, -26)), h1 = add(WF, mul(ax, 34)), mc = add(WF, mul(ax, 64)), ma = gM.axis + Math.PI / 2;
    f.part(limb(h0, h1, 10, 12, { steps: 6, capK: 0.6 }), { fill: '#3a2c20', tex: T('wood'), texOp: 0.4, shade: 0.4, inkW: 1.3 });
    f.part(ell(h0, 6, 5, ma, 10), { fill: '#5a5c58', inkW: 1, cast: false });
    // cord from the handle's end, round the wrist, a loop hanging
    f.line([h0, add(h0, [-6, 14]), add(h0, [-14, 20]), lp(EF, WF, 0.78, 12)], 1.6, '#8a7a5a');
    f.line([add(h0, [-6, 14]), add(h0, [-4, 34]), add(h0, [6, 40]), add(h0, [8, 22])], 1.4, '#8a7a5a');
    // frame: dark horn rim seen three-quarter, its back edge showing
    f.part(ell(add(mc, [-3, 1]), 33, 23, ma - Math.PI / 2 + 0.12, 24), { fill: '#2a2018', shade: 0.5, inkW: 1.4 });
    f.part(ell(mc, 32, 22, ma - Math.PI / 2 + 0.12, 24), { fill: '#4a3a2a', tex: T('mottle'), texOp: 0.5, shade: 0.45, inkW: 1.5 });
    // the glass: dim and cold, only reflecting; cracked across, one shard gone
    const gl = ell(add(mc, [1.5, 0]), 26, 16, ma - Math.PI / 2 + 0.12, 22);
    f.part(gl, { fill: '#6e7a80', shade: 0.3, inkW: 1.1, cast: false, hatch: false, tex: T('mottle'), texOp: 0.35 });
    f.flat([add(mc, [-11, -10]), add(mc, [-5, -20]), add(mc, [-1, -18]), add(mc, [-8, -6])], '#aeb8bc', { op: 0.5 }); // a cold sheen, dull
    f.line([add(mc, [-10, 10]), add(mc, [-4, 0]), add(mc, [4, -6])], 1.4, '#c4ccd0', { op: 0.4 });
    const ck = mc;
    for (const q of [[[0, 0], [8, -14], [9, -22]], [[0, 0], [-11, 5], [-13, 10]], [[0, 0], [3, 14], [1, 22]], [[0, 0], [-5, -10], [-7, -18]], [[3, 14], [10, 10]]]) { const P = q.map(v => add(ck, v)); f.line(P, 1.3, INK, { op: 0.85 }); f.line(P.map(v => add(v, [0.8, 0.8])), 0.7, '#d0d8dc', { op: 0.5 }); }
    f.flat([add(ck, [0, 0]), add(ck, [8, -14]), add(ck, [12, -6]), add(ck, [6, 2])], '#1a1c1e', { op: 0.9 }); // the missing shard
    f.line(ell(mc, 32, 22, ma - Math.PI / 2 + 0.12, 24).slice(14, 22), 1.4, '#8a7a62', { op: 0.6 }); // worn rim
    f.part(ell(add(mc, rot([-34, 0], ma - Math.PI / 2 + 0.12)), 4, 4, 0, 8), { fill: '#5a5c58', inkW: 1, cast: false }); // pewter knob
  } else if (!DS) {
    const pin0 = add(WF, rot([-12, 0], pa)), pin1 = add(WF, rot([74, 0], pa));
    f.bone('pin');
    f.part(limb(pin0, pin1, 6, 1.5, { steps: 6, capK: 2 }), { fill: '#5e6266', inkW: 1.1, inkHeavy: 1.6, cast: false });
    f.line([add(pin0, rot([10, -1], pa)), add(pin0, rot([76, -0.5], pa))], 0.8, '#c8ccd0', { op: 0.7 });
    f.part(ell(pin0, 5, 5, 0, 8), { fill: '#3a3a3a', inkW: 1, cast: false });
  }
  f.bone('hand_f');
  if (DS) B.grip(f, WF, EF, -Math.PI / 2, 19, skin, { shadow: skinS, tex: T('mottle'), name: 'bell staff' });
  else if (MH) B.grip(f, WF, EF, -Math.PI / 2, 19, skin, { shadow: skinS, tex: T('mottle'), name: 'mirror handle' });
  else B.grip(f, WF, EF, pa + Math.PI, 19, skin, { shadow: skinS, tex: T('mottle'), name: 'hexweaver pin' });
  // ---- legs
  const shin = (K0, A, wt, tint, sfx) => {
    const top = lerp(K0, A, 0.12);
    split(f, () => bareLeg(f, top, A, 1, 44, wt, SKN({ fill: mix(skin, '#4a3a2a', tint) })), [['shin' + sfx, side(A, mul(ankle(K0, A), -1), 17)], ['foot' + sfx, side(A, ankle(K0, A), 17)]]);
    f.bone('shin' + sfx);
    f.part([lp(top, A, 0.0, -wt * 0.56), lp(top, A, 0.0, wt * 0.56), lp(top, A, 0.62, wt * 0.5), lp(top, A, 0.7, -wt * 0.58)], RG('#5a5040', { inkW: 1.3, cast: false, k: 0.4 }));
    for (let i = 0; i < 4; i++) f.line([lp(top, A, 0.06 + i * 0.15 + f.r() * 0.03, -wt * 0.56), lp(top, A, 0.16 + i * 0.15, wt * 0.5)], 1.3, INK, { op: 0.6 });
    f.line([lp(top, A, 0.3, -wt * 0.2), lp(top, A, 0.4, wt * 0.1)], 1, '#8a7c60', { op: 0.6 });
    f.stroke([lp(top, A, 0.66, -10), lp(top, A, 0.76, -16), lp(top, A, 0.86, -10)], 2.4, '#5a5040');
  };
  shin(KF, AF, 40, 0.3, '_f');
  split(f, () => f.part(chain([HFp, KF, lerp(KF, AF, 0.14)], [56, 46, 40], { bq: [[0, 0.5, 0.14]] }), RG(rag)), [['thigh_f', side(KF, mul(elb(HFp, KF, AF), -1), 23)], ['shin_f', side(KF, elb(HFp, KF, AF), 23)]]);
  shin(KN, AN, 42, 0.2, '_n');
  split(f, () => f.part(chain([HNp, KN, lerp(KN, AN, 0.14)], [60, 48, 42], { bp: [[0, 0.5, 0.14]] }), RG(rag)), [['thigh_n', side(KN, mul(elb(HNp, KN, AN), -1), 24)], ['shin_n', side(KN, elb(HNp, KN, AN), 24)]]);
  // ---- skirt and torso
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
  // knotted cord belt hung with charms
  f.part([[210, 528], [288, 540], [370, 536], [372, 546], [288, 550], [208, 538]], { fill: '#7a6c50', tex: T('hatch'), texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 7; i++) f.part(ell([220 + i * 24, 534 + (i < 3 ? i * 3 : 7)], 4.6, 4.6, 0, 8), { fill: '#6a5c40', inkW: 1, cast: false });
  f.line([[230, 538], [226, 556]], 1.2, '#3a2a1a');
  f.part([[218, 554], [234, 554], [238, 600], [228, 608], [216, 600]], { fill: '#5a6a3a', tex: T('hatch'), inkW: 1.2 }); f.line([[214, 562], [240, 562]], 2, '#6a5428');
  f.line([[262, 544], [262, 560]], 1.2, '#3a2a1a');
  f.part([[252, 560], [272, 558], [276, 572], [266, 582], [256, 576]], { fill: bone, inkW: 1.2, cast: false }); f.flat(ell([262, 568], 3, 3, 0, 6), '#1a1410'); f.part([[270, 572], [284, 582], [270, 578]], { fill: bone, inkW: 1, cast: false });
  if (PB || DS) {
    // straw poppets hung from the belt (the pactbound's smeared with her blood)
    smallPoppet(f, [296, 548], 1.15, S, { blood: PB, pin: DS });
    smallPoppet(f, [372, 542], 1.0, S, { blood: PB, fill: '#968048' });
  } else {
    f.line([[296, 548], [296, 562]], 1.2, '#3a2a1a');
    f.part([[290, 562], [302, 562], [306, 590], [286, 590]], { fill: '#3a5a4a', shade: 0.3, inkW: 1.2, hatch: false }); f.part([[292, 556], [300, 556], [300, 563], [292, 563]], { fill: '#8a6a4a', sharp: true, inkW: 1, cast: false });
  }
  f.part([[328, 548], [356, 546], [358, 580], [330, 582]], { fill: '#3a2a1c', tex: T('mottle'), k: 0.6 }); f.flat(ell([344, 582], 9, 3, 0, 8), '#2a1a10', { op: 0.6 });
  f.line([[316, 546], [318, 562]], 1.2, '#2b2119');
  G.badge(f, [318, 562], 9, '#74777b', 0);
  // ---- bone-white shawl
  f.part([[256, 408], [298, 392], [346, 396], [374, 420], [372, 450], [354, 464, 1], [336, 450], [318, 480, 1], [300, 458], [278, 484, 1], [260, 462], [236, 474, 1], [232, 436]], RG(bone, { texOp: 0.45, shadow: '#5a5040' }));
  for (let i = 0; i < 6; i++) f.line([[240 + i * 20, 468 + (i % 2) * 8], [238 + i * 20, 482 + (i % 2) * 8]], 1.2, '#7a6a4a');
  f.flat([[280, 426], [310, 420], [312, 436], [282, 442]], '#5a4a2a', { op: 0.25 });
  f.part(ell([362, 440], 9, 8, 0.3, 10), RG(mix(bone, '#000', 0.12), { inkW: 1.2 }));
  f.stroke([[360, 446], [368, 472], [362, 496]], 5, mix(bone, '#000', 0.1));
  // ---- head
  f.bone('head');
  f.part(limb([318, 400], add(HC, [-18, 24]), 32, 28), SKN());
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 0.96, chin: 0.04, nose: 1.24, hook: 0.9, mouth: 'smirk', squint: 0.6, browDown: 0.07, age: true, gaunt: true, glint: true, iris: '#3a4a2a',
    hairCol: hair, noEar: true,
    hair: [[-0.52, 0.42], [-0.62, 0.06], [-0.54, -0.28], [-0.32, -0.5], [-0.04, -0.58], [0.2, -0.5], [0.34, -0.36], [0.24, -0.3], [0.2, -0.2], [0.08, -0.3], [-0.04, -0.22], [-0.16, -0.32], [-0.24, -0.08], [-0.3, 0.2], [-0.38, 0.5]],
    hairLines: [[[-0.46, -0.1], [-0.3, -0.34], [-0.06, -0.46]], [[-0.52, 0.2], [-0.44, -0.02], [-0.3, -0.22]], [[-0.4, 0.4], [-0.34, 0.1]]],
  });
  f.flat(hf([[0.2, 0.265], [0.33, 0.215], [0.34, 0.25], [0.24, 0.29]]), '#2a0e0a');
  f.flat(hf([[0.25, 0.257], [0.27, 0.25], [0.275, 0.27], [0.255, 0.275]]), '#d8ccb0'); f.flat(hf([[0.3, 0.236], [0.32, 0.228], [0.325, 0.248], [0.305, 0.255]]), '#c8bc98');
  f.line(hf([[0.33, 0.2], [0.36, 0.17]]), 1.1, INK, { op: 0.7 });
  f.flat(hf(ell([0.25, 0.08], 0.02, 0.02, 0, 6)), '#4a3020');
  if (MH) {
    // a ragged rag hood, slumped forward at the peak; mirror shards stitched on, catching a dim cold light
    const hood = [[0.5, -0.28, 1], [0.5, -0.46], [0.3, -0.66], [-0.06, -0.78], [-0.46, -0.68], [-0.74, -0.32], [-0.84, 0.16], [-0.76, 0.56], [-0.66, 0.84, 1], [-0.6, 0.62], [-0.5, 0.86, 1], [-0.44, 0.6], [-0.34, 0.74, 1], [-0.3, 0.44], [-0.26, 0.1], [-0.26, -0.24], [-0.1, -0.44], [0.16, -0.5], [0.34, -0.4]];
    f.part(hF(hood), RG('#262e22', { shadow: '#0c100a' }));
    f.stroke(hF([[-0.58, -0.4], [-0.64, 0.0], [-0.6, 0.4]]), 2.4, '#0a0c08'); f.stroke(hF([[-0.2, -0.64], [0.1, -0.6], [0.36, -0.46]]), 2, '#0a0c08'); f.stroke(hF([[-0.42, -0.2], [-0.46, 0.2], [-0.42, 0.56]]), 1.8, '#0a0c08');
    f.part(hF([[0.3, -0.42], [0.48, -0.42], [0.56, -0.3], [0.52, -0.2], [0.42, -0.28], [0.3, -0.34]]), RG('#2e3628', { inkW: 1.1, cast: false })); // the slumped peak's fold
    f.part(hF([[-0.5, -0.16], [-0.38, -0.2], [-0.36, 0.02], [-0.52, 0.04]]), RG('#3a3428', { inkW: 1, cast: false, sharp: true })); f.stitches(hF([[-0.5, -0.16], [-0.38, -0.2], [-0.36, 0.02], [-0.52, 0.04], [-0.5, -0.16]]), '#8a7a5a', 0.8); // a patch
    const shards = [[[-0.62, -0.18], 0.4, 0.1], [[-0.36, -0.52], -0.3, 0.09], [[-0.08, -0.62], 0.2, 0.08], [[0.2, -0.56], -0.5, 0.075], [[-0.6, 0.26], 0.9, 0.085], [[-0.44, 0.46], -0.2, 0.07], [[-0.7, 0.58], 0.3, 0.06], [[-0.22, -0.34], 0.6, 0.06]];
    for (const [c, a, r] of shards) {
      const P = frame(hF([c])[0], a + hA, r * H), pts = P([[-1, -0.4], [0.2, -1], [1, -0.2], [0.4, 0.8], [-0.6, 0.6]]);
      f.part(pts, { fill: '#7c888e', shade: 0.35, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, sharp: true });
      f.line(P([[-0.6, -0.3], [0.2, -0.8]]), 1.2, '#c8d0d4', { op: 0.45 }); // a dim sheen on the edge
      f.flat(P([[0.2, -0.2], [1, -0.2], [0.4, 0.8]]), '#2a3034', { op: 0.5 }); // the dark it reflects
      for (const q of [[-1, -0.4], [1, -0.2], [0.4, 0.8]]) { const p0 = P([q])[0]; f.line([add(p0, [-2.2, -2.2]), add(p0, [2.2, 2.2])], 0.8, '#6e624a'); f.line([add(p0, [-2.2, 2.2]), add(p0, [2.2, -2.2])], 0.8, '#6e624a'); } // cross-stitches holding it
    }
  }
  for (const [p0, l, sw2, w] of [[[0.12, -0.42], 0.34, 0.06, 6], [[-0.1, -0.5], 0.5, 0.0, 7], [[-0.34, -0.36], 0.9, -0.06, 8], [[-0.46, -0.1], 0.86, -0.04, 9]]) { if (MH && p0[1] < -0.45) continue; const r0 = hf([MH ? [p0[0] + 0.08, p0[1] + 0.1] : p0])[0]; f.stroke([r0, add(r0, [sw2 * H, l * 0.5 * H]), add(r0, [sw2 * 0.4 * H, l * H])], w, hair); }
  if (MH) {
    f.part(hF([[-0.62, -0.06], [-0.1, -0.74], [-0.06, -0.7], [-0.58, -0.02]]), { fill: bone, inkW: 1 }); f.part(hF(ell([-0.08, -0.74], 0.035, 0.035, 0, 8)), { fill: bone, inkW: 1 }); // bone pin through the hood
    f.part(hF([[-0.74, 0.1], [-0.86, 0.14], [-0.94, 0.44], [-0.84, 0.48], [-0.8, 0.26], [-0.72, 0.22]]), { fill: rubric, inkW: 1.1, cast: false }); // rubric rag tied on the hood
  } else {
    f.part(hf([[-0.3, -0.3], [0.1, -0.7], [0.13, -0.66], [-0.27, -0.26]]), { fill: bone, inkW: 1 });
    f.part(hf(ell([0.12, -0.7], 0.035, 0.035, 0, 8)), { fill: bone, inkW: 1 });
    f.part(hf([[-0.5, -0.14], [-0.6, -0.1], [-0.72, 0.18], [-0.64, 0.22], [-0.58, 0.02], [-0.48, -0.04]]), { fill: rubric, inkW: 1.1, cast: false });
  }
  // ---- wax shoulder plate with three black tallow candles
  const sc = [268, 402];
  f.bone('torso');
  f.part(G.lame(sc, 62, 22, -0.28, 10), { fill: wax, tex: T('mottle') });
  f.line([add(sc, [-26, 14]), add(sc, [-6, 30]), add(sc, [14, 40])], 3, '#3a2618');
  for (let i = 0; i < 3; i++) {
    const c = add(sc, rot([-20 + i * 18, -4 - (i === 1 ? 6 : 0)], -0.28)), h = [30, 44, 22][i];
    f.part([add(c, [-5, 0]), add(c, [5, 0]), add(c, [4, -h]), add(c, [-4, -h])], { fill: '#1e1a18', inkW: 1.2, sharp: true });
    f.flat([add(c, [-5, -h + 4]), add(c, [-7, -h + 16]), add(c, [-5, -h + 22])], '#3a3632');
    const fl = add(c, [0, -h - 2]);
    f.raw(`<circle cx="${fl[0]}" cy="${fl[1] - 6}" r="16" fill="#ffb84a" opacity="0.22" filter="url(#soft${S})"/>`);
    f.flat([add(fl, [-4, 0]), add(fl, [0, -15]), add(fl, [4, 0]), add(fl, [0, 3])], '#f0a03a');
    f.flat([add(fl, [-2, 0]), add(fl, [0, -7]), add(fl, [2, 0])], '#ffe8a0');
    f.line([add(fl, [0, -15]), add(fl, [3, -24]), add(fl, [-1, -32])], 1, '#2a2622', { op: 0.5 });
  }
  for (let i = 0; i < 5; i++) f.flat([add(sc, [-30 + i * 12, 10]), add(sc, [-26 + i * 12, 10]), add(sc, [-27 + i * 12, 22 + (i % 2) * 12]), add(sc, [-29 + i * 12, 22 + (i % 2) * 12])], '#2e2a26');
  // ---- near arm
  f.bone('upperarm_n');
  f.part(ragLimb(f, SN, lerp(SN, EN, 0.95), 40, 40, { depth: 6, teeth: 4 }), RG(ragL));
  split(f, () => f.part(chain([lerp(SN, EN, 0.85), EN, WN], [32, 34, 28], { bp: [[1, 0.3, 0.12]] }), SKN()), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 17)], ['forearm_n', side(EN, elb(SN, EN, WN), 17)]]);
  f.bone('forearm_n');
  if (PB) {
    // the bandaged forearm, always freshly cut: linen turns soaked through, a new cut open at the wrist, blood running
    f.part(chain([lerp(EN, WN, 0.1), lerp(EN, WN, 0.45), lerp(EN, WN, 0.74)], [38, 36, 32], { bp: [[0, 0.5, 0.06]], bq: [[1, 0.4, 0.05]] }), { fill: '#b6aa8e', tex: T('weave'), texOp: 0.45, shade: 0.4, inkW: 1.3, cast: false, shadow: '#4a4030' });
    for (let i = 0; i < 7; i++) { const t = 0.13 + i * 0.087; f.line([lp(EN, WN, t, -18), lp(EN, WN, t + 0.03, -4), lp(EN, WN, t + 0.07, 17)], 1.2, INK, { op: 0.7 }); f.line([lp(EN, WN, t + 0.012, -16), lp(EN, WN, t + 0.04, -4)], 0.9, '#e2d8c0', { op: 0.6 }); } // spiral turns
    f.flat([lp(EN, WN, 0.12, 12), lp(EN, WN, 0.7, 10), lp(EN, WN, 0.7, 16), lp(EN, WN, 0.12, 18)], '#3a3020', { op: 0.3 }); // grime on the underside
    f.flat([lp(EN, WN, 0.28, 4), lp(EN, WN, 0.4, -6), lp(EN, WN, 0.56, -3), lp(EN, WN, 0.7, 6), lp(EN, WN, 0.66, 14), lp(EN, WN, 0.48, 10), lp(EN, WN, 0.34, 14)], '#6a2418', { op: 0.55 }); f.flat([lp(EN, WN, 0.6, -2), lp(EN, WN, 0.7, 0), lp(EN, WN, 0.72, 10), lp(EN, WN, 0.62, 8)], '#8a2a1a', { op: 0.6 }); // blood soaked through
    f.flat(ell(lp(EN, WN, 0.42, 10), 5, 3, 0, 8), '#5a2a1a', { op: 0.6 }); // old brown stain
    f.stroke([lp(EN, WN, 0.76, -8), lp(EN, WN, 0.8, 0), lp(EN, WN, 0.84, 10)], 2.6, BLOOD_F); // the fresh cut
    f.line([lp(EN, WN, 0.76, -8), lp(EN, WN, 0.84, 10)], 0.8, '#e8c0a8', { op: 0.6 });
    const under = lp(EN, WN, 0.82, 15);
    f.flat([add(under, [-3, -4]), add(under, [3, -4]), add(under, [2.5, 10]), add(under, [0, 16]), add(under, [-2.5, 10])], BLOOD_F, { op: 0.9 }); // running and dripping
    f.flat(ell(add(under, [0, 30]), 2.2, 3.4, 0, 8), BLOOD_F, { op: 0.85 });
    f.stroke([lp(EN, WN, 0.12, 17), lp(EN, WN, 0.06, 24), lp(EN, WN, 0.02, 30)], 3, '#cfc4a8'); // a loose bandage end
  } else for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.2 + i * 0.14, -14), lp(EN, WN, 0.26 + i * 0.14, 14)], 2, '#8a7a5a', { straight: true });
  if (DS) {
    // the handbell: a turned wooden handle up through the fist, a dark bronze bell below, its clapper hanging still
    f.bone('handbell');
    const gB = B.gripAngle(WN, EN, -Math.PI / 2, { name: 'handbell' }), ax = [Math.cos(gB.axis), Math.sin(gB.axis)];
    const t0 = add(WN, mul(ax, 26)), t1 = add(WN, mul(ax, -16)), bt = add(WN, mul(ax, -16));
    f.part(limb(t1, t0, 11, 9, { steps: 6, capK: 0.9, p: [[0.75, 0.25, 0.06]], q: [[0.75, 0.25, 0.06]] }), { fill: '#4a3624', tex: T('wood'), texOp: 0.4, shade: 0.4, inkW: 1.2 });
    const F = frame(bt, gB.axis + Math.PI / 2, 1);
    f.part(F([[-6, 0], [6, 0], [11, 6], [13, 18], [17, 30], [21, 36, 1], [-21, 36, 1], [-17, 30], [-13, 18], [-11, 6]]), { fill: '#5e5238', tex: T('mottle'), texOp: 0.5, shade: 0.45, inkW: 1.4 });
    f.part(F(ell([0, 36], 21, 5, 0, 14)), { fill: '#120e0a', inkW: 1.1, cast: false, hatch: false });
    f.part(F(ell([3, 40], 4, 4, 0, 8)), { fill: IRON_D, inkW: 0.9, cast: false });
    f.line(F([[-9, 8], [-14, 30]]), 1.4, '#9a8e6a', { op: 0.55 }); f.line(F([[-16, 30], [16, 30]]), 1, INK, { op: 0.5 });
    f.flat(F(ell([8, 22], 4, 3, 0.3, 8)), VERD, { op: 0.75 }); f.line(F([[4, 10], [8, 24]]), 1, INK, { op: 0.6 }); // verdigris, a crack
  }
  if (!DS) {
    f.bone('poppet');
    f.raw(`<circle cx="${pp[0]}" cy="${pp[1]}" r="26" fill="#6a8a4a" opacity="0.14" filter="url(#soft${S})"/>`);
    f.part([add(pp, [-9, -22]), add(pp, [9, -22]), add(pp, [11, -10]), add(pp, [24, -4]), add(pp, [22, 4]), add(pp, [10, 2]), add(pp, [13, 32]), add(pp, [3, 34]), add(pp, [0, 14]), add(pp, [-3, 34]), add(pp, [-13, 32]), add(pp, [-10, 2]), add(pp, [-22, 4]), add(pp, [-24, -4]), add(pp, [-11, -10])], { fill: '#b89a52', tex: T('hatch'), texOp: 0.55, inkW: 1.4 });
    for (let i = 0; i < 4; i++) f.line([add(pp, [-8 + i * 5, -8]), add(pp, [-6 + i * 5, 12])], 0.9, '#6a5428', { op: 0.8 });
    f.part([add(pp, [-11, -6]), add(pp, [11, -6]), add(pp, [12, 12]), add(pp, [-12, 12])], { fill: '#5a4a3a', tex: T('weave'), inkW: 1.1, cast: false });
    f.part(ell(add(pp, [0, -30]), 11, 12, 0, 12), { fill: '#d8c8a0', tex: T('weave'), inkW: 1.3 });
    f.line([add(pp, [-12, -8]), add(pp, [12, -8])], 2.4, '#6a5428', { straight: true }); f.line([add(pp, [-12, 14]), add(pp, [12, 14])], 2, '#6a5428', { straight: true });
    f.flat(ell(add(pp, [-4, -31]), 2.2, 2.2, 0, 6), INK); f.flat(ell(add(pp, [4, -31]), 2.2, 2.2, 0, 6), INK);
    f.line([add(pp, [-4, -24]), add(pp, [4, -24])], 1, INK, { dash: '1.5 1.5' });
    f.line([add(pp, [-6, -41]), add(pp, [-10, -48])], 1, '#2a2018'); f.line([add(pp, [2, -42]), add(pp, [4, -50])], 1, '#2a2018');
    if (PB) { // smeared with her blood: a hand-wipe across the body, a red thumbprint on the face, a run down one leg
      f.flat([add(pp, [-12, -8]), add(pp, [6, -12]), add(pp, [14, -2]), add(pp, [10, 10]), add(pp, [-4, 6]), add(pp, [-12, 4])], BLOOD, { op: 0.8 });
      f.flat(ell(add(pp, [2, -27]), 4.5, 3.4, 0.3, 8), BLOOD, { op: 0.75 });
      f.flat([add(pp, [6, 10]), add(pp, [10, 12]), add(pp, [9, 30]), add(pp, [7, 30])], BLOOD, { op: 0.8 });
    }
  }
  f.bone('hand_n');
  if (DS) B.grip(f, WN, EN, -Math.PI / 2, 19, skin, { shadow: skinS, tex: T('mottle'), name: 'handbell' });
  else B.fist(f, add(WN, [2, -4]), -0.15, 19, skin, { shadow: skinS, tex: T('mottle') });
  if (PB) { f.flat([add(WN, [-14, 2]), add(WN, [-2, 4]), add(WN, [-4, 12]), add(WN, [-12, 10])], BLOOD, { op: 0.6 }); }
  else f.line([add(WN, [-12, 4]), add(WN, [-6, 10])], 1.4, '#6a2a1a');
  return f;
}

module.exports = { heroes: [], script, smallPoppet, BRASS, BRASS_D, BRASS_L, VERD, IRON, IRON_D, BLOOD, BLOOD_F };
module.exports.heroes.push(
  { key: 'alchemist_transmuter', name: 'Alchemist: Transmuter', tier: 'human', build: () => alchemist('transmuter', 7200) },
  { key: 'alchemist_plaguewright', name: 'Alchemist: Plaguewright', tier: 'human', build: () => alchemist('plaguewright', 7201) },
  { key: 'alchemist_apothecary', name: 'Alchemist: Apothecary', tier: 'human', build: () => alchemist('apothecary', 7202) },
  { key: 'oracle_chronomancer', name: 'Oracle: Chronomancer', tier: 'human', build: () => oracle('chronomancer', 7203) },
  { key: 'oracle_augur', name: 'Oracle: Augur', tier: 'human', build: () => oracle('augur', 7204) },
  { key: 'oracle_fatebinder', name: 'Oracle: Fatebinder', tier: 'human', build: () => oracle('fatebinder', 7205) },
  { key: 'hexweaver_pactbound', name: 'Hexweaver: Pactbound', tier: 'human', build: () => hexweaver('pactbound', 7206) },
  { key: 'hexweaver_doomsayer', name: 'Hexweaver: Doomsayer', tier: 'human', build: () => hexweaver('doomsayer', 7207) },
  { key: 'hexweaver_mirrorhex', name: 'Hexweaver: Mirrorhex', tier: 'human', build: () => hexweaver('mirrorhex', 7208) },
);
