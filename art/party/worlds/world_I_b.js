// World I, The Drowned Kingdom (Water + Void), batch b: Hollow Tidewarden, Abbess of Salt, Pearl Diver,
// Barnacle Knight, Anchor Brute, Wreck Crab. Foes: drawn facing right with kit.foeBase, flipped on render.
// Each figure is authored in human space (ground 790, a 1.0 human ~640 px) and mapped by kit_I_b.space onto its tier
// canvas at its true bible scale, so ink and hatching stay at the cast's pixel scale.
'use strict';
const K = require('../kit');
const X = require('./kit_I_b');
const { E, B, G, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { PAL } = X;
const WORLD = { shadowTint: '#2a2a38', mud: '#1e2a24' }; // the Drowned Thrall's world look

// ------------------------------------------------------------------ HOLLOW TIDEWARDEN (elite, 2.0)
// A cathedral door guard grown into the sea: upright, heavy, halberd planted beside him, a clean void hole through the
// chest that you can see straight through, and a pale feelered thing living in its wall.
function tidewarden() {
  const [Wc, Hc] = K.TIERS.elite, GY = Hc - 30;
  const sp = X.space(2.0, 540, GY), { Z, ZZ, W, k } = sp;
  const f = new Fig(K.foeBase(110, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 600])[1] })));
  const steel = '#6c7676', steelD = '#4e5858', steelL = '#8a9494', mail = '#4f5556', tab = PAL.bb, flesh = '#a8a898', fleshS = '#6a667a';
  const PL = (o = {}) => Object.assign({ fill: steel, tex: 'mottle110', texOp: 0.55 }, o);
  const FL = (o = {}) => Object.assign({ fill: flesh, shadow: fleshS, shade: 0.3, tex: 'mottle110', texOp: 0.6 }, o);
  const S = B.spine(Z([304, 250]), Z([300, 345]), Z([292, 458]), W(100));
  const P = Z([292, 458]);
  const SN = S.at(-0.46, 0.13), SF = S.at(0.74, 0.12);
  const HN = S.at(-0.28, 1.0), HF = S.at(0.3, 0.98);
  const KN = Z([254, 612]), AN = Z([240, 742]), KF = Z([338, 608]), AF = Z([352, 740]);
  const EN = Z([214, 404]), WN = Z([268, 470]);
  const EF = Z([388, 382]);
  const hx = y => 446 - 6 * (792 - y) / 680; // halberd haft x at a human-space height
  const hb = Z([hx(792), 792]), ht = Z([hx(150), 150]), hA = Math.atan2(ht[1] - hb[1], ht[0] - hb[0]);
  const WF = Z([hx(410), 410]);
  const HC = Z([320, 202]), hAng = 0.1;

  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.2, -0.04), 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('halberd', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('sword', S.at(-0.5, 0.95), 'pelvis');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('tabard', S.at(0.3, 0.92), 'pelvis').joint('skirt_back', S.at(-0.6, 0.92), 'pelvis');

  X.puddle(f, Z([300, 794]), W(150)); // root layer: the ground never moves with the rig
  f.bone('pelvis');
  // ---- back flap of the tabard, behind the legs
  f.bone('skirt_back');
  f.part([S.at(-0.85, 0.9), S.at(-0.2, 0.92), Z([262, 640]), [...Z([250, 676]), 1], Z([236, 650]), [...Z([222, 690]), 1], Z([212, 640]), Z([214, 560])], { fill: mix(tab, '#000', 0.2), tex: 'weave110', texOp: 0.5, shadow: '#07090e' });

  // ---- far arm, behind the torso: rerebrace down to the elbow, forearm out to the haft
  f.bone('upperarm_f');
  f.part(limb(SF, EF, W(44), W(38)), FL());
  f.part(plate(SF, EF, 0.2, 0.92, W(46), W(40), { bow: W(3) }), PL({ fill: steelD }));
  f.bone('forearm_f');
  f.part(limb(EF, WF, W(38), W(30)), PL({ fill: steelD }));
  f.part(plate(EF, WF, 0.1, 0.85, W(40), W(32), { bow: W(2) }), PL());
  X.verd(f, lerp(EF, WF, 0.5), W(20), W(8), 5);
  f.part(ell(add(EF, [-W(4), W(6)]), W(17), W(13), 0.4, 14), PL({ fill: steelD, k: 0.8 }));
  X.coral(f, add(EF, [W(4), W(10)]), 1.9, W(26), W(7));

  // ---- legs: cuisses, articulated knee cops grown over with coral, greaves crusted with barnacles, sabatons
  const leg = (H0, Kp, A, ang, col, colD, side) => {
    const th = side > 0 ? 'thigh_f' : 'thigh_n', sh = side > 0 ? 'shin_f' : 'shin_n', ft = side > 0 ? 'foot_f' : 'foot_n';
    f.bone(th);
    f.part(limb(H0, Kp, W(70), W(50), side > 0 ? { q: [[0.35, 0.16, 0.2]] } : { p: [[0.4, 0.14, 0.22]] }), { fill: mail, tex: 'mail110', texOp: 0.8 });
    f.part(plate(H0, Kp, 0.32, 0.94, W(62), W(50), { bow: W(4) }), PL({ fill: col }));
    f.line([lp(H0, Kp, 0.36, W(4)), lp(H0, Kp, 0.92, W(2))], 1.6, INK, { op: 0.5 });
    // swollen flesh pushing out of the gap behind the knee
    f.part(ell(lp(H0, Kp, 0.95, -side * W(22)), W(16), W(12), 0.3, 12), FL({ cast: false }));
    X.livid(f, lp(H0, Kp, 0.95, -side * W(22)), W(10), W(8), 3);
    f.bone(sh);
    f.part(limb(Kp, A, W(48), W(34), side > 0 ? { p: [[0.3, 0.2, 0.18]] } : { q: [[0.3, 0.22, 0.18]] }), PL({ fill: colD }));
    f.part(plate(Kp, A, 0.06, 0.94, W(50), W(36), { bow: W(3) }), PL({ fill: col }));
    f.line([lp(Kp, A, 0.12, W(6)), lp(Kp, A, 0.9, W(4))], 1.4, steelL, { op: 0.5 });
    X.verd(f, lerp(Kp, A, 0.55), W(14), W(30), 7);
    X.barnacles(f, lerp(Kp, A, 0.72), W(14), W(16), 7, W(5));
    f.scratches(lerp(Kp, A, 0.35), W(12), 4);
    G.poleyn(f, Kp, side > 0 ? 0.12 : -0.28, W(31), col, colD);
    X.coral(f, add(Kp, [W(6), -W(6)]), side > 0 ? -0.5 : -2.4, W(30), W(8));
    f.bone(ft);
    B.boot(f, A, 1, W(56), mix(col, '#2a3a36', 0.25), { tex: 'mottle110', shaft: 0.2, style: 'sabaton', toe: 1.2 });
    X.barnacles(f, add(A, [W(14), W(30)]), W(14), W(6), 5, W(4));
    X.kelp(f, add(A, [-W(10), -W(4)]), W(30), W(5), W(6));
  };
  leg(HF, KF, AF, 0, steelD, mix(steelD, '#000', 0.2), 1);
  leg(HN, KN, AN, 0, steel, steelD, -1);

  // ---- torso: drowned flesh and mail under the plate (drawn whole, so the rig never shows a gap), then the plate
  const iHole = f.out.length;
  f.bone('torso');
  f.part(S.shape([[-0.06, 0.36, 0.34], [0.05, 0.94, 0.66], [0.18, 1.06, 0.94], [0.4, 0.94, 0.98], [0.62, 0.74, 0.84], [0.85, 0.66, 0.7], [1.02, 0.72, 0.66], [1.1, 0.6, 0.5]]), FL());
  f.part(S.shape([[0.05, 0.96, 0.68], [0.18, 1.08, 0.94], [0.4, 0.96, 0.98], [0.62, 0.76, 0.84], [0.8, 0.7, 0.74]]), { fill: mail, tex: 'mail110', texOp: 0.8 });
  f.bone('pelvis');
  const sk = [S.at(-0.74, 0.8), S.at(0.76, 0.8), add(S.at(0.8, 1.0), [W(8), W(18)]), Z([380, 548]), [...Z([360, 568]), 1], Z([330, 552]), [...Z([300, 574]), 1], Z([270, 554]), [...Z([240, 572]), 1], Z([218, 548]), add(S.at(-0.8, 1.0), [-W(6), W(16)])];
  f.part(sk, { fill: mail, tex: 'mail110', texOp: 0.85 });
  X.verd(f, Z([300, 556]), W(60), W(10), 8);
  // ---- tabard: blue-black, rotted to strips, drowned-gold trim
  f.bone('tabard');
  const tb = [S.at(0.08, 0.84), S.at(0.56, 0.83), Z([360, 560]), Z([364, 600]), [...Z([358, 652]), 1], Z([348, 626]), [...Z([340, 664]), 1], Z([330, 618]), [...Z([318, 656]), 1], Z([312, 604]), Z([308, 556])];
  f.part(tb, { fill: tab, tex: 'weave110', texOp: 0.5, shadow: '#07090e' });
  f.line([S.at(0.12, 0.9), Z([312, 560]), Z([314, 604])], W(2.2), PAL.gold, { op: 0.75 });
  f.line([S.at(0.52, 0.9), Z([358, 560]), Z([360, 598])], W(2.2), PAL.gold, { op: 0.75 });
  f.stroke([Z([340, 520]), Z([346, 570]), Z([342, 612])], W(2), '#07090e'); f.stroke([Z([320, 530]), Z([324, 580])], W(1.6), '#07090e');
  for (const [x, y, r] of [[326, 590, 4.5], [350, 612, 3.2]]) f.flat(ell(Z([x, y]), W(r), W(r * 1.3), 0.3, 10), '#05070a'); // moth- and worm-eaten holes

    X.verd(f, Z([334, 600]), W(26), W(30), 6, '#3a5a50');
  X.kelp(f, Z([352, 560]), W(80), W(6), W(4));

  f.bone('torso');
  // backplate edge and the globose breastplate, its lower plackart riveted over it
  f.part(S.shape([[0.08, 0.9, 0.0], [0.3, 0.98, 0.0], [0.6, 0.78, 0.0], [0.8, 0.7, 0.0]]), PL({ fill: steelD }));
  const bp = S.shape([[0.1, 0.78, 0.72], [0.3, 0.9, 1.02], [0.5, 0.8, 0.98], [0.7, 0.66, 0.8]]);
  f.part(bp, PL({ shade: 0.45, k: 0.75 }));
  f.part(S.shape([[0.52, 0.74, 0.88], [0.62, 0.7, 0.82], [0.74, 0.64, 0.74], [0.8, 0.62, 0.7]]), PL({ fill: mix(steel, steelD, 0.4) }));
  f.line([S.at(-0.2, 0.6), S.at(0.3, 0.6), S.at(0.8, 0.56)], 1.4, INK, { op: 0.6 });
  for (const u of [-0.5, 0.0, 0.5]) f.rivet(S.at(u, 0.6), W(2.4));
  f.line([S.at(0.62, 0.16), S.at(0.7, 0.3)], 1.6, INK, { op: 0.6 }); // medial ridge above the hole
  f.line([S.at(0.0, 0.16), S.at(-0.4, 0.3)], 2, steelL, { op: 0.6 }); // worn-bright edge
  f.flat(ell(S.at(-0.3, 0.44), W(14), W(9), -0.4), '#262c2e', { op: 0.5 }); // dent
  f.scratches(S.at(-0.2, 0.34), W(26), 8);
  X.pits(f, S.at(0.1, 0.4), W(60), W(50), 40);
  for (let i = 0; i < 6; i++) f.rivet(S.at(-0.5 + i * 0.22, 0.1 + Math.abs(i - 2.5) * 0.01), W(2.2));
  X.verd(f, S.at(0.1, 0.3), W(46), W(40), 16);
  X.barnacles(f, S.at(-0.45, 0.22), W(16), W(14), 6, W(5));
  // drowned-gold cathedral door emblem, half eaten by the hole
  const em = S.at(-0.2, 0.5);
  f.part([[...add(em, [-W(12), W(16)]), 1], add(em, [-W(12), -W(2)]), add(em, [-W(6), -W(11)]), add(em, [0, -W(14)]), add(em, [W(6), -W(11)]), add(em, [W(12), -W(2)]), [...add(em, [W(12), W(16)]), 1]], { fill: PAL.gold, shade: 0.35, inkW: 1.2, cast: false, tex: 'mottle110' });
  f.flat([[...add(em, [-W(5), W(14)]), 1], add(em, [-W(5), W(1)]), add(em, [0, -W(6)]), add(em, [W(5), W(1)]), [...add(em, [W(5), W(14)]), 1]], '#14100c'); f.line([add(em, [-W(12), W(16)]), add(em, [W(12), W(16)])], W(1.6), PAL.goldL, { op: 0.7 });
  X.verd(f, em, W(8), W(10), 3);
  // faulds: three lames
  for (let i = 0; i < 3; i++) {
    const v0 = 0.72 + i * 0.07;
    f.part([S.at(-0.68 - i * 0.04, v0), S.at(0.74 + i * 0.04, v0 - 0.01), S.at(0.77 + i * 0.04, v0 + 0.09), S.at(-0.71 - i * 0.04, v0 + 0.09)], PL({ fill: i % 2 ? steelD : steel, shade: 0.5, inkW: 1.4, sharp: true }));
    f.rivet(S.at(0.6, v0 + 0.045), W(2.4)); f.rivet(S.at(-0.5, v0 + 0.045), W(2.4));
    f.line([S.at(-0.6, v0 + 0.01), S.at(0.6, v0 + 0.005)], 1, steelL, { op: 0.45 });
  }
  X.verd(f, S.at(0.2, 0.8), W(50), W(10), 8);
  // sword belt, rotted, a mussel cluster at the buckle, a rusted door key on a ring
  f.part([S.at(-0.82, 0.93), S.at(0.84, 0.92), S.at(0.85, 0.99), S.at(-0.84, 1.01)], { fill: '#2e2a22', shade: 0.4, tex: 'mottle110' });
  f.part([S.at(0.36, 0.92), S.at(0.54, 0.92), S.at(0.54, 1.0), S.at(0.36, 1.0)], { fill: PAL.rust, shade: 0.4, inkW: 1.2, sharp: true });
  for (const [u, a] of [[0.3, 0.4], [0.6, -0.3], [0.5, 1.2]]) X.mussel(f, S.at(u, 1.0), a, k * 0.9);
  const kr = S.at(-0.55, 1.02);
  X.chainLinks(f, [kr, add(kr, [W(2), W(16)])], W(4), '#3e3430');
  f.part([add(kr, [-W(3), W(18)]), add(kr, [W(3), W(18)]), add(kr, [W(3), W(50)]), add(kr, [W(9), W(50)]), add(kr, [W(9), W(56)]), add(kr, [-W(3), W(56)])], { fill: PAL.rust, inkW: 1.2, cast: false, sharp: true });
  f.part(ell(add(kr, [0, W(16)]), W(6), W(6), 0, 10), { fill: PAL.rust, inkW: 1.2, cast: false });
  // the hole: front opening (a clean rim cut through plate, mail and flesh), its inner wall, then see-through
  const hc = S.at(0.3, 0.42), rx = W(30), ry = W(37);
  f.part(ell(hc, rx, ry, 0, 28), { fill: '#202838', shade: 0.25, inkW: 0, hatch: false, cast: false });
  f.flat(ell(add(hc, [rx * 0.18, 0]), rx * 0.86, ry * 0.92, 0, 28), PAL.bb);
  f.flat(ell(add(hc, [rx * 0.02, 0]), rx * 0.96, ry * 0.98, 0, 28), PAL.bb, { op: 0.6 });
  // cut layers seen on the wall: steel lip, mail, grey flesh, then nothing
  f.line(ell(hc, rx * 0.97, ry * 0.97, 0, 28).slice(-8).concat(ell(hc, rx * 0.97, ry * 0.97, 0, 28).slice(0, 9)), W(3), steelL, { op: 0.85 });
  f.line(ell(add(hc, [rx * 0.06, 0]), rx * 0.9, ry * 0.92, 0, 28).slice(-7).concat(ell(add(hc, [rx * 0.06, 0]), rx * 0.9, ry * 0.92, 0, 28).slice(0, 8)), W(2.5), mix(flesh, fleshS, 0.5), { op: 0.7 });
  const holeIn = ell(add(hc, [-rx * 0.3, 0]), rx * 0.68, ry * 0.91, 0, 28);
  f.line(ell(hc, rx, ry, 0, 28).concat([ell(hc, rx, ry, 0, 28)[0]]), W(1.6), '#e8e2d8', { op: 0.9 }); // the clean pale rim
  f.line(ell(hc, rx + 1.5, ry + 1.5, 0, 28).concat([ell(hc, rx + 1.5, ry + 1.5, 0, 28)[0]]), 1.4, INK);
  X.punch(f, iHole, f.out.length, holeIn);
  // ---- the thing that lives in the hole: pale, segmented, clinging to the far wall, feelers testing the water
  f.bone('feelers');
  f.joint('feelers', add(hc, [rx * 0.55, -ry * 0.5]), 'torso');
  const cb = add(hc, [rx * 0.62, -ry * 0.1]);
  for (let i = 0; i < 6; i++) { const c = add(cb, [-i * W(1.2), -W(18) + i * W(7)]), w = W(14 - i * 1.4); f.part(ell(c, w * 0.6, W(4.6), 0.2, 12), { fill: mix('#e4dccb', PAL.bb, i * 0.15), shade: 0.3, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false }); }
  for (let i = 0; i < 4; i++) f.line([add(cb, [-W(6), -W(14) + i * W(8)]), add(cb, [-W(14), -W(10) + i * W(8)]), add(cb, [-W(16), -W(4) + i * W(8)])], 1.6, '#d8d0bf', { op: 0.85 }); // legs gripping
  const fh = add(cb, [W(2), -W(24)]);
  f.part(ell(fh, W(7), W(5.5), -0.3, 10), { fill: '#ece4d4', shade: 0.25, inkW: 1.2, cast: false, hatch: false });
  f.flat(ell(add(fh, [W(3), -W(1)]), W(1.4), W(1.4), 0, 6), PAL.voidC);
  for (const [a1, a2, l] of [[-0.9, -1.8, 1], [-1.9, -2.6, 0.85], [-2.6, -2.1, 0.7], [-0.5, 0.2, 0.6]]) {
    const p1 = add(fh, rot([W(30) * l, 0], a1)), p2 = add(p1, rot([W(36) * l, 0], a2)), p3 = add(p2, rot([W(26) * l, 0], a2 + 0.5));
    f.line([fh, p1, p2, p3], 2.6, INK, { op: 0.9 }); f.line([fh, p1, p2, p3], 1.4, '#e8e0d0');
  }

  // ---- head: bevor over the chin, a closed sallet with the visor rusted shut, water running from the sights
  f.bone('head');
  const hF = frame(HC, hAng, W(114));
  // swollen grey flesh bulging between the bevor and the breastplate
  f.part(hF([[-0.42, 0.42], [-0.1, 0.52], [0.3, 0.58], [0.36, 0.72], [-0.1, 0.74], [-0.44, 0.62]]), FL());
  X.livid(f, hF([[-0.05, 0.62]])[0], W(16), W(5), 4);
  f.part(hF([[0.48, 0.06], [0.52, 0.3], [0.4, 0.56], [0.08, 0.66], [-0.22, 0.58], [-0.34, 0.32], [-0.12, 0.2], [0.2, 0.12]]), PL({ fill: steelD }));
  for (let i = 0; i < 2; i++) f.line(hF([[-0.28 + i * 0.04, 0.42 + i * 0.1], [0.42 - i * 0.04, 0.44 + i * 0.1]]), 1.4, INK, { op: 0.55 });
  f.rivet(hF([[-0.2, 0.36]])[0], W(2.4));
  const sal = [[0.46, 0.12, 1], [0.52, -0.1], [0.42, -0.36], [0.18, -0.52], [-0.12, -0.55], [-0.38, -0.44], [-0.54, -0.18], [-0.62, 0.06], [-0.82, 0.26], [-0.98, 0.42, 1], [-0.66, 0.4], [-0.4, 0.3], [-0.12, 0.22], [0.2, 0.17]];
  f.part(hF(sal), PL({ shade: 0.5 }));
  f.line(hF([[-0.1, -0.54], [0.2, -0.46], [0.4, -0.28]]), 2.2, INK, { op: 0.6 }); // comb ridge
  f.line(hF([[-0.2, -0.5], [0.12, -0.46], [0.32, -0.32]]), 1.6, steelL, { op: 0.6 });
  // visor: the upper face plate, its pivot rivet, the sight slit rusted half closed
  f.line(hF([[0.5, -0.26], [0.24, -0.28], [0.02, -0.2], [0.0, 0.0], [0.04, 0.14]]), 1.8, INK, { op: 0.75 }); // visor seam
  f.line(hF([[0.48, -0.23], [0.24, -0.25], [0.05, -0.18]]), 1.4, steelL, { op: 0.55 });
  f.rivet(hF([[-0.04, -0.04]])[0], W(3.2), '#8a7a62');
  f.flat(hF([[0.14, -0.12], [0.43, -0.124], [0.43, -0.092], [0.14, -0.085]]), '#050404'); // sight slit, kept inside the helm's outline
  f.flat(hF([[0.3, -0.122], [0.36, -0.12], [0.355, -0.085], [0.29, -0.088]]), '#3e2a1e'); // rust bridging the slit shut
  f.flat(hF([[0.27, -0.08], [0.4, -0.082], [0.37, -0.04], [0.3, -0.05]]), PAL.rust, { op: 0.5 });
  f.flat(hF(ell([0.3, -0.38], 0.07, 0.04, 0.3, 10)), '#3e4a48', { op: 0.45 }); // dent
  X.verd(f, hF([[-0.2, -0.2]])[0], W(40), W(26), 14);
  X.pits(f, hF([[-0.1, -0.2]])[0], W(40), W(26), 24);
  X.barnacles(f, hF([[-0.5, 0.16]])[0], W(16), W(10), 7, W(5));
  X.barnacles(f, hF([[0.02, -0.36]])[0], W(10), W(4), 3, W(4));
  f.scratches(hF([[0.2, -0.3]])[0], W(16), 5);
  // water running from the sights, down the visor and the bevor, dripping off
  for (const [x0, l, sw, wd] of [[0.22, 0.5, -0.03, 1.2], [0.46, 0.84, 0.05, 1.6]]) {
    const a0 = hF([[x0, -0.08]])[0], pts = [a0, add(a0, [W(sw * 30), W(l * 40)]), add(a0, [W(sw * 70) + W(3), W(l * 80)]), add(a0, [W(sw * 90) + W(4), W(l * 114)])];
    f.line(pts, W(wd * 2.2), '#4a6a7a', { op: 0.55 }); f.line(pts, W(wd), PAL.water, { op: 0.85 }); X.drip(f, add(pts[3], [0, W(8)]), k); X.drip(f, add(pts[3], [W(2), W(22)]), k * 0.7);
  }
  X.coral(f, hF([[-0.72, 0.36]])[0], 2.2, W(22), W(6));

  // ---- sword sheathed at the near hip, hilt up and forward, his near hand resting on it
  f.bone('sword');
  const hd = [Math.cos(-1.22), Math.sin(-1.22)], gd = add(WN, mul(hd, -W(24))), pm = add(WN, mul(hd, W(24))), se = add(gd, mul(hd, -W(286)));
  f.part(limb(gd, se, W(17), W(13), { steps: 8 }), { fill: '#2a2620', tex: 'mottle110', texOp: 0.6, shadow: '#0e0c0a' });
  const fr = S.at(-0.6, 0.97), th = lerp(gd, se, 0.06);
  f.part([add(fr, [-W(5), 0]), add(fr, [W(5), 0]), add(th, [W(6), 0]), add(th, [-W(6), 0])], { fill: '#2e2a22', tex: 'mottle110', inkW: 1.2, cast: false }); // frog strap: belt to scabbard
  f.rivet(th, W(2.4), '#6a5a42');
  f.part(limb(lerp(gd, se, 0.86), se, W(19), W(16), { steps: 4 }), PL({ fill: '#5a5a4a', inkW: 1.3 })); // chape
  for (const t of [0.1, 0.4]) f.line([lp(gd, se, t, -W(10)), lp(gd, se, t + 0.02, W(10))], W(3), '#1a1612', { straight: true });
  X.barnacles(f, lerp(gd, se, 0.65), W(8), W(20), 6, W(4.5));
  X.kelp(f, lerp(gd, se, 0.3), W(50), W(4), W(4));
  X.verd(f, se, W(8), W(10), 4);
  f.part([add(gd, rot([-W(30), -W(4)], -1.22 + Math.PI / 2)), add(gd, rot([W(30), -W(4)], -1.22 + Math.PI / 2)), add(gd, rot([W(30), W(4)], -1.22 + Math.PI / 2)), add(gd, rot([-W(30), W(4)], -1.22 + Math.PI / 2))].map(q => [...q, 1]), PL({ fill: steelD, inkW: 1.3, cast: false })); // cross
  f.part(limb(gd, pm, W(11), W(10), { steps: 4 }), { fill: '#2a2018', shade: 0.4, inkW: 1.1, cast: false });
  f.part(ell(add(pm, mul(hd, W(6))), W(11), W(11), 0, 12), PL({ fill: mix(steel, steelD, 0.3), inkW: 1.2, cast: false })); // wheel pommel
  f.flat(ell(add(pm, mul(hd, W(6))), W(4), W(4), 0, 8), '#2a2e2e');
  // ---- near arm: elbow out behind, the gauntlet resting on the sword grip
  f.bone('upperarm_n');
  f.part(limb(SN, EN, W(46), W(38), { p: [[0.45, 0.15, 0.2]] }), FL());
  f.part(plate(SN, EN, 0.3, 0.9, W(48), W(40), { bow: W(3) }), PL());
  X.verd(f, lerp(SN, EN, 0.6), W(14), W(18), 5);
  f.bone('forearm_n');
  f.part(limb(EN, WN, W(40), W(32)), PL({ fill: steelD }));
  f.part(plate(EN, WN, 0.12, 0.88, W(42), W(34), { bow: W(2) }), PL());
  f.part(ell(add(EN, [-W(2), W(4)]), W(18), W(13), 2.2, 14), PL({ fill: steelD, k: 0.8 }));
  f.line([add(EN, [-W(12), -W(4)]), add(EN, [W(6), W(12)])], 1.3, INK, { op: 0.6 });
  X.coral(f, add(EN, [-W(10), W(6)]), 2.5, W(26), W(7));
  X.barnacles(f, lerp(EN, WN, 0.45), W(12), W(14), 5, W(5));
  f.scratches(lerp(EN, WN, 0.6), W(10), 4);
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.atan2(-hd[1], -hd[0]), W(25), steel, { plate: true, cuff: true, name: 'tidewarden sword hand' });
  X.verd(f, WN, W(10), W(8), 3);
  X.drip(f, add(WN, [W(6), W(30)]), k);

  // ---- near pauldron (torso bone: it stays put when the arm lifts), barnacled, coral in the lames, flesh in the gap
  f.bone('torso');
  f.part(ell(add(SN, [W(12), W(24)]), W(20), W(14), 0.6, 12), FL());
  X.livid(f, add(SN, [W(12), W(24)]), W(12), W(8), 3);
  G.pauldron(f, add(SN, [W(4), -W(6)]), W(48), -0.22, steel, steelD, 3);
  X.barnacles(f, add(SN, [-W(4), -W(2)]), W(20), W(8), 9, W(5.5));
  X.verd(f, add(SN, [W(4), W(6)]), W(30), W(16), 9);
  X.coral(f, add(SN, [-W(34), W(22)]), 2.5, W(30), W(8));

  // ---- the halberd, planted: wet ash haft, a langeted socket, axe blade forward, back fluke, top spike
  f.bone('halberd');
  f.part(limb(hb, ht, W(13), W(12), { steps: 10 }), { fill: '#3e3428', tex: 'wood110', shadow: '#1a1612' });
  f.line([lp(hb, ht, 0.02, -W(3)), lp(hb, ht, 0.98, -W(3))], 1.2, '#8a7a5a', { op: 0.45, straight: true });
  for (let i = 0; i < 7; i++) f.line([lp(hb, ht, 0.5 + i * 0.016, -W(7)), lp(hb, ht, 0.51 + i * 0.016, W(7))], W(1.6), '#1e1610', { straight: true }); // grip wrap
  X.barnacles(f, lerp(hb, ht, 0.05), W(8), W(16), 5, W(4));
  X.verd(f, lerp(hb, ht, 0.2), W(6), W(40), 5, '#3a5a50');
  const HX = (y, dx) => Z([hx(y) + dx, y]);
  // langets and socket
  f.part([HX(330, -5), HX(330, 5), HX(232, 7), HX(232, -7)].map(p => [...p, 1]), PL({ fill: steelD, inkW: 1.4 }));
  for (const y of [250, 280, 310]) f.rivet(HX(y, 0), W(2.2));
  // back fluke, hooked down
  f.part([HX(188, -4), HX(186, -20), HX(190, -34), [...HX(206, -44), 1], HX(200, -30), HX(204, -16), HX(208, -4)], PL({ shade: 0.5 }));
  // axe blade: concave neck off the socket, two horns, a convex edge with chips bitten out of it, worn bright
  const blade = [HX(178, 4), HX(170, 22), HX(160, 40), [...HX(146, 56), 1], HX(162, 64), HX(184, 70), [...HX(190, 62), 1], [...HX(196, 70), 1], HX(214, 70), [...HX(222, 64), 1], [...HX(226, 69), 1], HX(240, 64), [...HX(262, 54), 1], HX(246, 38), HX(234, 22), HX(228, 4)];
  f.part(blade, PL({ shade: 0.5, k: 0.8 }));
  f.line([HX(150, 55), HX(166, 63), HX(184, 68)], W(2), '#b8c0c0', { op: 0.7 });
  f.line([HX(198, 68), HX(214, 68)], W(2), '#b8c0c0', { op: 0.7 }); f.line([HX(228, 67), HX(240, 62), HX(258, 54)], W(2), '#b8c0c0', { op: 0.7 });
  f.line([HX(176, 8), HX(204, 14), HX(228, 8)], 1.4, INK, { op: 0.5 }); // socket shoulder
  // pierced quatrefoil: the four lobes now merge into one cut with a rust rim (four separate dots read as a face)
  for (const [y, dx] of [[203, 28], [208, 32], [213, 28], [208, 24]]) f.flat(ell(HX(y, dx), W(4.6), W(4.6), 0, 10), PAL.rust, { op: 0.8 });
  for (const [y, dx] of [[203, 28], [208, 32], [213, 28], [208, 24]]) f.flat(ell(HX(y, dx), W(3.4), W(3.4), 0, 10), '#0d0e10');
  f.flat(ell(HX(208, 28), W(3), W(3), 0, 8), '#0d0e10');
  f.flat([HX(224, 44), HX(230, 52), HX(236, 46), HX(232, 40)], '#0d0e10', { op: 0.9 }); // a rust-eaten hole further down the blade
  f.part([HX(172, -6), [...HX(114, 0), 1], HX(172, 6)], PL({ shade: 0.45 })); // top spike
  X.verd(f, HX(200, 36), W(28), W(36), 12);
  X.barnacles(f, HX(232, 24), W(16), W(8), 6, W(4.5));
  f.scratches(HX(190, 40), W(14), 5);
  // kelp draped over the lower horn and hanging plumb, dripping
  const kh = HX(258, 54);
  f.stroke([add(kh, [-W(10), -W(4)]), kh, add(kh, [W(4), W(6)])], W(8), PAL.kelp);
  for (const [l, sw] of [[110, 8], [76, -6], [140, 2]]) X.drip(f, add(X.kelp(f, add(kh, [W(sw * 0.3), W(2)]), W(l), W(6), W(sw)), [0, W(7)]), k);
  X.kelp(f, HX(330, -4), W(60), W(5), -W(6));
  // ---- far gauntlet on the haft: thumb toward the blade, back of the hand toward the elbow
  f.bone('hand_f');
  B.grip(f, WF, EF, hA, W(26), steel, { plate: true, cuff: true, name: 'tidewarden halberd' });
  X.verd(f, WF, W(12), W(10), 3);

  return f;
}

// ------------------------------------------------------------------ ABBESS OF SALT (elite, 1.9)
// Very straight, a salt-stiff habit that stands like carved stone, a blue-black cope open at the front, hands clasped on
// a drowned-gold crosier. Once an Ostiarius: the order sent her through the first door to seal it from the far side; she
// failed and came back once, and the order sewed her mouth shut with the abbey's own waxed linen cord (pale, heavy cross
// stitches, the lips puckered round them) and sent her back. The eyes are open and fervent. Where the salt crust has
// cracked away her Ostiarii habit shows under it: undyed grey-brown wool at the cuffs and hem, windows of the black
// scapular down her front, the knotted rope belt with its ends hanging, and the order's iron key ring.
// a window where the salt crust has cracked away and the cloth under it shows: the cloth, a dark band where the crust's
// broken edge throws shadow into it (on the lit side), the crust's lit lip just outside, crystals along the rim and
// hairline cracks running on into the crust
function jag(f, pts, amp) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], d = E.norm(sub(b, a)), n = [-d[1], d[0]];
    out.push([a[0], a[1], a[2] ? 1 : 0]);
    if (a[2] && b[2]) continue; // a flagged edge (a hem: the cloth's own edge, not the crust's) stays as drawn
    for (const t of [0.33, 0.66]) out.push([...add(lerp(a, b, t), mul(n, (f.r() - 0.5) * 2 * amp)), 0]);
  }
  return out;
}
function crackWindow(f, poly, look, X, W, o = {}) {
  const jp = jag(f, poly, W(o.amp ?? 3)), pts = jp.map(q => [q[0], q[1]]), L = f.L || [0.6, -0.8];
  f.part(pts, Object.assign({ inkW: 1, inkHeavy: 1.4, cast: false }, look));
  if (o.under) o.under(pts);
  // the crust's edge: every run of edges that is not the cloth's own (flagged) edge
  const runs = []; let cur = [];
  for (let i = 0; i <= jp.length; i++) { const a = jp[i % jp.length], b = jp[(i + 1) % jp.length]; if (i < jp.length && !(a[2] && b[2])) { if (!cur.length) cur.push(pts[i % jp.length]); cur.push(pts[(i + 1) % jp.length]); } else if (cur.length) { runs.push(cur); cur = []; } }
  for (const r of runs) {
    f.line(r.map(q => add(q, mul(L, -W(1.6)))), W(3), '#1a1c24', { op: 0.32 }); // the crust's shadow falling into the window
    f.line(r.map(q => add(q, mul(L, W(1.4)))), W(1.6), '#f2efe6', { op: 0.7 }); // the crust's broken lip, lit
    f.line(r, 1, '#2a2a30', { op: 0.75 });
  }
  for (let i = 0; i < pts.length; i += 3) if (!jp[i][2]) X.salt(f, pts[i], W(5), W(4), 2, W(1.6), { crust: false });
  for (let i = 1; i < pts.length; i += 4) { const q = pts[i], d = E.norm(sub(q, pts[0])), e = add(q, mul(rot(d, (f.r() - 0.5) * 1.2), W(8 + f.r() * 10))); f.line([q, lerp(q, e, 0.5), e], 0.9, '#3a3640', { op: 0.6 }); }
  return pts;
}
function abbess() {
  const [Wc, Hc] = K.TIERS.elite, GY = Hc - 30;
  const { Z, ZZ, W, k } = X.space(1.9, 540, GY);
  const f = new Fig(K.foeBase(111, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 640])[1] })));
  const habit = '#c9c4b8', habitS = '#5a6274', cope = '#1c2433', copeS = '#0a0d14', skin = '#c4c0b2', skinS = '#6a6a7a';
  const HB = (o = {}) => Object.assign({ fill: habit, shadow: habitS, tex: 'weave111', texOp: 0.35 }, o);
  // the Ostiarii habit under the crust (the keepers' dress): undyed grey-brown wool, the black scapular, the rope belt
  const wool = '#6c6152', woolD = '#4a4238', scap = '#24221f', rope = '#8a7a56', ropeD = '#5e5238';
  const WL = (o = {}) => Object.assign({ fill: wool, shadow: woolD, tex: 'weave111', texOp: 0.5, shade: 0.4 }, o);
  const SCP = (o = {}) => Object.assign({ fill: scap, shadow: '#0e0d0c', tex: 'weave111', texOp: 0.4, shade: 0.4 }, o);
  const CP = (o = {}) => Object.assign({ fill: cope, shadow: copeS, tex: 'mottle111', texOp: 0.5 }, o);
  const GD = (o = {}) => Object.assign({ fill: PAL.gold, shadow: PAL.goldD, tex: 'mottle111', texOp: 0.5 }, o);
  const P = Z([300, 458]), HC = Z([314, 196]), hAng = -0.05, HH = W(96);
  const SN = Z([262, 286]), EN = Z([258, 394]), WN = Z([378, 414]);
  const SF = Z([342, 290]), EF = Z([334, 378]), WF = Z([379, 366]);
  const cx = y => 384 - 8 * (790 - y) / 690, cb = Z([cx(790), 790]), ct = Z([cx(176), 176]);
  const HNp = Z([282, 466]), KNp = Z([280, 620]), ANp = Z([288, 764]), HFp = Z([322, 466]), KFp = Z([336, 620]), AFp = Z([352, 764]);

  f.joint('pelvis', P).joint('torso', Z([300, 440]), 'pelvis').joint('head', Z([306, 252]), 'torso').joint('veil', Z([286, 176]), 'head');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('crosier', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('cope', Z([290, 274]), 'torso');
  f.joint('thigh_n', HNp, 'pelvis').joint('shin_n', KNp, 'thigh_n').joint('foot_n', ANp, 'shin_n');
  f.joint('thigh_f', HFp, 'pelvis').joint('shin_f', KFp, 'thigh_f').joint('foot_f', AFp, 'shin_f');

  X.puddle(f, Z([300, 794]), W(140));
  f.bone('pelvis');
  // ---- legs under the habit (drawn whole for the rig): dark hose, salt-white shoes; only a toe shows at rest
  for (const [H0, K0, A0, s] of [[HNp, KNp, ANp, 'n'], [HFp, KFp, AFp, 'f']]) {
    f.bone('thigh_' + s); f.part(limb(H0, K0, W(54), W(42)), { fill: '#2a2e38', tex: 'weave111' });
    f.bone('shin_' + s); f.part(limb(K0, A0, W(40), W(28)), { fill: '#2a2e38', tex: 'weave111' });
    f.bone('foot_' + s); B.boot(f, A0, 1, W(38), '#3a3a3e', { shaft: 0.3, tex: 'mottle111' });
    X.salt(f, add(A0, [W(24), W(14)]), W(14), W(6), 6, W(2));
  }
  // ---- far arm, mostly behind her: habit sleeve, salt-crusted
  f.bone('upperarm_f');
  f.part(limb(SF, EF, W(40), W(36)), HB());
  f.bone('forearm_f');
  f.part(limb(EF, WF, W(36), W(30)), HB({ fill: mix(habit, habitS, 0.2) }));
  // ---- cope, back panel: behind the body, hem to mid-calf, tide lines and salt along its edge
  f.bone('cope');
  const copeBack = [Z([238, 258]), Z([204, 320]), Z([182, 440]), Z([164, 560]), Z([148, 680]), [...Z([136, 738]), 1], Z([170, 728]), Z([206, 744]), Z([244, 730]), Z([290, 740]), Z([340, 728]), Z([380, 736]), Z([386, 600]), Z([374, 460]), Z([364, 330]), Z([352, 282]), Z([300, 258])];
  f.part(copeBack, CP());
  for (let i = 0; i < 4; i++) { const y0 = 560 + i * 44, x1 = 206 + f.r() * 26; f.line(ZZ([[164 - i * 4, y0], [176, y0 + 3 + f.r() * 4], [190, y0 + 1], [204, y0 + 6 + f.r() * 4], [x1, y0 + 3]]), W(1.1 + f.r() * 0.6), '#c8c8c0', { op: 0.25 + f.r() * 0.15 }); } // tide lines, wavering and broken
  f.stroke(ZZ([[214, 330], [190, 480], [170, 620], [160, 730]]), W(5), copeS); f.stroke(ZZ([[226, 380], [212, 540], [196, 700]]), W(3.4), copeS);
  f.line(ZZ([[208, 340], [184, 480], [166, 620]]), W(1.4), '#4a5468', { op: 0.6 });
  X.salt(f, Z([170, 718]), W(20), W(6), 14, W(2.2));
  X.salt(f, Z([226, 330]), W(12), W(14), 10, W(2.2));
  X.voidHole(f, Z([180, 640]), W(9), W(11), 0.1); // a clean round void hole eaten through the velvet
  X.voidHole(f, Z([196, 694]), W(5), W(6), 0.1, false);
  // ---- habit skirt: a rigid bell of salt-stiff wool, carved folds, pleated hem, kelp and barnacles at the hem
  f.bone('pelvis');
  const skirt = [Z([240, 446]), Z([368, 444]), Z([380, 540]), Z([392, 640]), Z([402, 740]), [...Z([408, 784]), 1], Z([382, 790]), Z([368, 778]), Z([352, 792]), Z([336, 780]), Z([318, 792]), Z([298, 778]), Z([278, 790]), Z([258, 778]), Z([238, 790]), Z([220, 778]), [...Z([206, 786]), 1], Z([214, 700]), Z([226, 580]), Z([236, 500])];
  f.part(skirt, HB({ k: 0.85 }));
  // carved folds: deep shadow troughs rising from each hem pleat, lit ridges crusted with salt
  for (const [x0, top, w] of [[384, 600, 2.4], [366, 520, 2.8], [348, 470, 3.4], [326, 540, 2.6], [298, 480, 3.2], [258, 540, 2.8], [228, 620, 2.2]]) {
    f.stroke(ZZ([[x0 - 2, 786], [x0 - 1, (784 + top) / 2], [x0 + 1, top]]), W(w * 2.4), mix(habitS, '#000', 0.25), { op: 0.8 });
    f.flat(ZZ([[x0 + 1, 784], [x0 + 1, top + 40], [x0 + 6, top + 70], [x0 + 7, 784]]), habitS, { op: 0.35 }); // shadowed flank of each carved fold
    f.line(ZZ([[x0 + 11, 776], [x0 + 10, (784 + top) / 2 + 10], [x0 + 8, top + 30]]), W(1.8), '#f2efe6', { op: 0.65 });
    X.salt(f, Z([x0 + 11, 700]), W(5), W(70), 9, W(2.2));
  }
  f.flat(ZZ([[214, 560], [226, 520], [232, 600], [222, 700], [212, 760]]), habitS, { op: 0.4 });
  for (const [x, y] of [[312, 600], [342, 680], [276, 700], [360, 560]]) f.flat(ell(Z([x, y]), W(10 + f.r() * 8), W(6 + f.r() * 4), f.r(), 10), '#8a8a7c', { op: 0.25 }); // water stains
  f.line(ZZ([[236, 520], [300, 512], [372, 518]]), W(1.4), '#7a8090', { op: 0.45 });
  f.line(ZZ([[206, 760], [260, 754], [320, 762], [396, 756]]), W(2), '#7a8090', { op: 0.5 }); // tide line
  f.line(ZZ([[210, 730], [280, 724], [330, 730], [392, 722]]), W(1.4), '#7a8090', { op: 0.4 });
  // lore change 2026-11-23: where the crust has cracked off the hem, the undyed wool of her Ostiarii habit shows, its
  // pleats running on down to the real hem; down the front, windows of the black scapular
  crackWindow(f, ZZ([[262, 752], [300, 744], [330, 750], [362, 740], [392, 748], [404, 742], [408, 784, 1], [382, 790, 1], [368, 778, 1], [352, 792, 1], [336, 780, 1], [318, 792, 1], [298, 778, 1], [278, 790, 1], [258, 778, 1]]), WL(), X, W, { amp: 4, under: () => {
    for (const x0 of [384, 366, 348, 326, 298]) f.stroke(ZZ([[x0 - 2, 786], [x0, 760], [x0 + 1, 748]]), W(4), woolD, { op: 0.7 });
    for (const x0 of [376, 356, 338, 310, 286]) f.line(ZZ([[x0, 780], [x0 + 1, 752]]), W(1.2), '#8a7e6c', { op: 0.6 });
    f.line(ZZ([[264, 776], [320, 772], [400, 770]]), W(1.6), '#4a4238', { op: 0.5 }); // the old wet line in the wool
  } });
  for (const poly of [[[330, 548], [352, 544], [356, 590], [350, 626], [334, 630], [328, 590]], [[338, 670], [356, 666], [360, 702], [340, 712]]]) crackWindow(f, ZZ(poly), SCP(), X, W, { amp: 3, under: () => f.line(ZZ([[poly[0][0] + 6, poly[0][1] + 6], [poly[3][0] + 6, poly[3][1] - 6]]), W(1.2), '#3a3632', { op: 0.6 }) });
  for (const [x, y, a] of [[238, 776, 0.3], [252, 770, -0.4], [318, 778, 0.2]]) X.mussel(f, Z([x, y]), a, k);
  X.barnacles(f, Z([376, 772]), W(14), W(8), 6, W(4));
  X.kelp(f, Z([282, 770]), W(24), W(5), W(5)); X.kelp(f, Z([350, 776]), W(16), W(4), -W(3));
  f.part(ZZ([[300, 640], [326, 638], [328, 668], [302, 670]]), HB({ fill: mix(habit, '#8a8070', 0.3), sharp: true, inkW: 1.1 })); // darned patch
  f.stitches(ZZ([[300, 640], [326, 638], [328, 668], [302, 670], [300, 640]]), '#5a5040', 0.9);
  // ---- habit bodice
  f.bone('torso');
  f.part(ZZ([[268, 262], [300, 256], [336, 264], [354, 292], [360, 340], [364, 400], [368, 456], [240, 458], [242, 400], [244, 330], [250, 284]]), HB());
  f.stroke(ZZ([[330, 300], [336, 360], [340, 440]]), W(4), habitS, { op: 0.6 });
  crackWindow(f, ZZ([[322, 322], [344, 318], [348, 344], [344, 366], [326, 368], [320, 344]]), SCP(), X, W, { amp: 2.6 }); // the scapular under the crust
  // ---- near upper arm, under the cope
  f.bone('upperarm_n');
  f.part(limb(SN, EN, W(44), W(40)), HB());
  // ---- cope front: near panel drapes down her near side, a narrow far edge shows at the front; drowned-gold orphreys
  f.bone('cope');
  const copeN = [Z([244, 266]), Z([280, 272]), Z([302, 290]), Z([306, 340]), Z([300, 440]), Z([296, 540]), Z([292, 640]), [...Z([292, 718]), 1], Z([262, 728]), Z([232, 718]), Z([222, 600]), Z([226, 460]), Z([232, 340])];
  f.part(copeN, CP());
  f.part(ZZ([[302, 290], [312, 292], [316, 340], [310, 440], [306, 540], [302, 640], [302, 720, 1], [292, 718, 1], [292, 640], [296, 540], [300, 440], [306, 340]]), GD({ inkW: 1.2 }));
  for (let y = 310; y < 710; y += 34) { const p = Z([304 - (y - 300) * 0.02, y]); f.flat([add(p, [-W(4), W(10)]), add(p, [-W(4), 0]), add(p, [0, -W(5)]), add(p, [W(4), 0]), add(p, [W(4), W(10)])], '#2a2012', { op: 0.8 }); } // embroidered doors
  f.part(ZZ([[352, 288], [362, 300], [372, 420], [382, 560], [390, 720], [378, 728], [366, 560], [358, 420], [350, 300]]), GD({ inkW: 1.2, fill: mix(PAL.gold, '#000', 0.2) }));
  f.stroke(ZZ([[256, 300], [262, 420], [254, 560], [258, 700]]), W(3), copeS); f.stroke(ZZ([[280, 330], [284, 460], [278, 620]]), W(2.4), copeS);
  for (let i = 0; i < 5; i++) { const y0 = 480 + i * 50, xs = 226 + i * 2 + f.r() * 10, xe = 262 + f.r() * 28; f.line(ZZ([[xs, y0], [xs + 12, y0 + 4 + f.r() * 4], [(xs + xe) / 2, y0 + 2], [xe - 8, y0 + 7 + f.r() * 3], [xe, y0 + 4]]), W(1 + f.r() * 0.6), '#c8c8c0', { op: 0.22 + f.r() * 0.15 }); } // tide lines, wavering and broken
  X.salt(f, Z([268, 300]), W(22), W(10), 16, W(2.4)); // salt crusted on the shoulders
  X.salt(f, Z([258, 716]), W(30), W(6), 12, W(2.4));
  X.verd(f, Z([306, 500]), W(6), W(120), 8);
  // far forearm comes forward past the cope edge to the upper hand
  f.bone('forearm_f');
  f.part(limb(lerp(EF, WF, 0.1), WF, W(40), W(32), { capB: true }), HB({ fill: mix(habit, habitS, 0.15) }));
  crackWindow(f, [lp(EF, WF, 0.3, -W(17)), lp(EF, WF, 0.64, -W(17)), lp(EF, WF, 0.64, W(16)), lp(EF, WF, 0.36, W(16))].map((q, i) => i === 1 || i === 2 ? [q[0], q[1], 1] : q), WL(), X, W, { amp: 2.4 }); // the wool cuff of her old habit
  X.salt(f, lp(EF, WF, 0.5, -W(14)), W(12), W(6), 6, W(2));
  f.bone('cope');
  // morse: a drowned-gold clasp at the breast, a door in relief
  const mo = Z([330, 300]);
  f.part(ell(mo, W(20), W(17), 0, 16), GD({ inkW: 1.4 }));
  f.part(ell(mo, W(14), W(12), 0, 14), GD({ fill: PAL.goldD, inkW: 1 }));
  f.flat([add(mo, [-W(5), W(9)]), add(mo, [-W(5), -W(1)]), add(mo, [0, -W(7)]), add(mo, [W(5), -W(1)]), add(mo, [W(5), W(9)])], '#140f08');
  for (let i = 0; i < 8; i++) f.rivet(add(mo, rot([W(17), 0], i * Math.PI / 4)), W(1.6), PAL.goldL);
  X.verd(f, mo, W(12), W(10), 4);
  // ---- cord belt and the Ostiarii key ring on the near hip, hanging plumb
  f.bone('pelvis');
  // the Ostiarii rope belt: twisted rope, salt in its lay, knotted at the front, both ends hanging plumb past the sleeve
  // with a knot near each tip and the fibres frayed below it
  f.part(ZZ([[300, 445, 1], [366, 443], [368, 457, 1], [300, 459]]), { fill: rope, shadow: ropeD, tex: 'hatch111', texOp: 0.45, k: 0.6, inkW: 1.3 });
  for (let x = 304; x < 366; x += 6) f.line(ZZ([[x, 445], [x + 4, 458]]), 1, INK, { op: 0.5 });
  for (const [pts, w, kn] of [[[[336, 458], [334, 500], [336, 546], [334, 590]], 5, 576], [[[344, 458], [350, 498], [352, 536], [350, 562]], 4.4, 550]]) {
    const C = ZZ(pts); f.line(C, W(w) + 2.4, INK); f.line(C, W(w), rope);
    for (let y = 466; y < kn - 4; y += 7) { const q = lp(C[0], C[C.length - 1], (y - pts[0][1]) / (pts[pts.length - 1][1] - pts[0][1])); f.line([add(q, [-W(w) * 0.45, -W(2)]), add(q, [W(w) * 0.45, W(2)])], 0.9, INK, { op: 0.5 }); }
    const kq = Z([pts[pts.length - 1][0], kn]); f.part(ell(kq, W(w * 1.3), W(w * 1.2), 0.3, 10), { fill: rope, shadow: ropeD, inkW: 1.2, cast: false, k: 0.8 }); f.line([add(kq, [-W(3), -W(2)]), add(kq, [W(3), W(2)])], 0.9, INK, { op: 0.6 });
    const tip = C[C.length - 1]; for (let i = -2; i <= 2; i++) f.line([add(kq, [i * W(1.2), W(w)]), add(tip, [i * W(1.6), W(8 + Math.abs(i) * -1.4)])], 1, ropeD, { op: 0.8 }); // frayed fibres
    X.salt(f, lerp(C[1], C[2], 0.5), W(5), W(10), 4, W(1.6), { crust: false });
  }
  f.part(ell(Z([338, 456]), W(9), W(7), 0.4, 10), { fill: rope, shadow: ropeD, inkW: 1.3, cast: false, k: 0.8 }); // the belt knot
  f.line(ZZ([[332, 452], [344, 460]]), 1, INK, { op: 0.6 });
  const kr = Z([278, 520]);
  f.line([Z([300, 456]), Z([290, 486]), add(kr, [0, -W(14)])], W(2.2), '#2a2018');
  K.ring(f, kr, W(16), W(14), W(4) + 2.4, INK); K.ring(f, kr, W(16), W(14), W(4), '#4a4440');
  for (const [dx, l, a] of [[-12, 70, 0.12], [-4, 86, 0.04], [6, 62, -0.05], [12, 78, -0.12], [0, 54, 0]]) {
    const top = add(kr, [W(dx), W(12)]), d = [Math.sin(a), Math.cos(a)], tip = add(top, mul(d, W(l)));
    f.part(limb(top, tip, W(4.4), W(4), { steps: 4 }), { fill: '#3a3634', inkW: 1.1, inkHeavy: 1.6, cast: false });
    f.part(ell(add(top, mul(d, W(4))), W(6), W(7), a, 10), { fill: '#3a3634', inkW: 1.1, cast: false });
    f.flat(ell(add(top, mul(d, W(4))), W(2.4), W(3), a, 8), '#0a0808');
    f.part([add(tip, rot([-W(2), -W(14)], -a)), add(tip, rot([W(9), -W(14)], -a)), add(tip, rot([W(9), -W(4)], -a)), add(tip, rot([W(5), -W(4)], -a)), add(tip, rot([W(5), 0], -a)), add(tip, rot([-W(2), 0], -a))].map(q => [...q, 1]), { fill: '#3a3634', inkW: 1.1, cast: false }); // bit
    if (f.r() > 0.4) f.flat(ell(lerp(top, tip, 0.5), W(2), W(4), a, 6), PAL.rust, { op: 0.7 });
  }
  X.salt(f, add(kr, [0, W(40)]), W(16), W(30), 8, W(1.8), { crust: false }); // crystals only: a crust patch here read as a grey blob over the keys

  // ---- veil: blue-black over the wimple, stiff with salt, flaring down her back (hangs plumb)
  f.bone('veil');
  const hS = frame(HC, 0, HH);
  f.part(hS([[0.3, -0.5], [0.06, -0.66], [-0.32, -0.66], [-0.62, -0.4], [-0.78, 0.2], [-0.92, 0.9], [-1.12, 1.6], [-0.86, 1.66, 1], [-0.62, 1.5], [-0.44, 1.62, 1], [-0.32, 1.1], [-0.3, 0.4], [-0.2, -0.3], [0.1, -0.52]]), CP({ k: 0.9 }));
  f.stroke(hS([[-0.5, -0.4], [-0.68, 0.4], [-0.86, 1.4]]), W(4), copeS);
  f.stroke(hS([[-0.36, -0.3], [-0.46, 0.6], [-0.56, 1.5]]), W(3), copeS);
  X.salt(f, hS([[-0.62, 0.3]])[0], W(10), W(22), 10, W(2.2));
  X.salt(f, hS([[-0.76, 1.4]])[0], W(12), W(6), 8, W(2));
  // ---- head: barbe (pleated chin cloth) over the breast, the face, the wimple round it, mouth sewn shut
  f.bone('head');
  const hF = frame(HC, hAng, HH);
  f.part(hF([[-0.4, 0.3], [0.0, 0.62], [0.36, 0.6], [0.6, 0.96], [0.5, 1.2], [0.0, 1.24], [-0.5, 1.12], [-0.6, 0.7]]), HB({ fill: '#ddd9ce' }));
  for (let i = 0; i < 5; i++) f.line(hF([[-0.4 + i * 0.2, 0.66 + i * 0.02], [-0.42 + i * 0.22, 1.16]]), W(1.4), habitS, { op: 0.55 });
  X.salt(f, hF([[0.0, 1.1]])[0], W(30), W(6), 10, W(2));
  B.head(f, HC, HH, hAng, { skin, jaw: 0.94, chin: 0.02, nose: 0.96, mouth: 'set', squint: -0.35, browDown: -0.04, glint: true, iris: '#2a3a4a', eyeWhite: '#e8e4da', faceShade: 0.7, noEar: true, lashes: true, browCol: '#6a6a66', hairCol: '#4a4a48' });
  // mouth sewn shut with the abbey's own waxed linen cord: the lips pinched and puckered in toward the seam, four
  // heavy cross stitches of pale waxed cord, each through a dark puncture above and below, the cord knotted off at the
  // back corner with its waxed tail hanging
  f.flat(hF([[0.15, 0.272], [0.24, 0.255], [0.33, 0.266], [0.325, 0.302], [0.24, 0.316], [0.16, 0.298]]), '#9e98a0', { op: 0.75 });
  f.line(hF([[0.15, 0.284], [0.24, 0.282], [0.33, 0.283]]), W(1), '#3a3238', { op: 0.8 }); // the seam of the lips, pressed shut
  const sx = [0.176, 0.232, 0.288], sy0 = 0.244, sy1 = 0.324, hw = 0.021;
  for (const x of sx) {
    for (const [y, dy] of [[sy0, -1], [sy1, 1]]) {
      for (const dx of [-hw, hw]) {
        const h = [x + dx, y]; f.flat(hF(ell(h, 0.007, 0.006, 0, 6)), '#3a1e1a', { op: 0.85 });
        f.line(hF([[h[0] + dx * 0.6, y + dy * 0.012], [h[0] + dx * 1.2, y + dy * 0.036]]), 0.9, '#5a5464', { op: 0.6 }); // the skin puckered toward the hole
      }
    }
    for (const [a, b] of [[[x - hw, sy0], [x + hw, sy1]], [[x + hw, sy0], [x - hw, sy1]]]) {
      const C = hF([a, lerp(a, b, 0.5).map((v, i) => i ? v : v), b]);
      f.line(C, W(1.6) + 1.8, '#4a3e36'); f.line(C, W(1.6), '#d8caa4'); f.line(C.map(q => add(q, [W(0.4), -W(0.4)])), W(0.7), '#f6f0dc', { op: 0.8 }); // pale waxed cord, a waxy shine
    }
  }
  for (let i = 0; i < sx.length - 1; i++) { const m = (sx[i] + sx[i + 1]) / 2; f.line(hF([[m, 0.262], [m + 0.004, 0.276]]), 0.9, '#4a4454', { op: 0.6 }); f.line(hF([[m, 0.292], [m - 0.004, 0.306]]), 0.9, '#4a4454', { op: 0.6 }); } // the pucker between stitches
  const kn = hF([[0.148, 0.3]])[0];
  f.part(ell(kn, W(2.8), W(2.4), 0.4, 8), { fill: '#d4c8a8', shadow: '#8a8068', inkW: 1.1, cast: false, k: 0.8 });
  const tl = [add(kn, [-W(1), W(1)]), add(kn, [-W(2.2), W(5)])]; f.line(tl, W(1.4) + 2, INK); f.line(tl, W(1.4), '#cfc2a2'); // the cut end of the cord
  // salt crust on the skin, cracked: brow, cheek, jaw
  for (const pts of [[[0.08, 0.04], [0.14, 0.12], [0.12, 0.2], [0.18, 0.26]], [[0.26, -0.22], [0.2, -0.17], [0.24, -0.12]], [[0.1, 0.38], [0.16, 0.44], [0.24, 0.46]], [[0.14, 0.12], [0.2, 0.1]]]) f.line(hF(pts), W(1.1), '#3a3640', { op: 0.75 });
  X.salt(f, hF([[0.12, 0.02]])[0], W(8), W(5), 5, W(1.4));
  X.salt(f, hF([[0.2, 0.44]])[0], W(8), W(3), 4, W(1.2));
  // wimple: stiff linen framing the face, covering head, ears and throat; salt crust along its folds
  f.part(hF([[0.38, -0.22], [0.42, -0.32], [0.28, -0.5], [-0.08, -0.56], [-0.4, -0.44], [-0.5, -0.1], [-0.46, 0.3], [-0.3, 0.58], [0.0, 0.7], [0.3, 0.7], [0.44, 0.62], [0.38, 0.52], [0.2, 0.5], [0.08, 0.42], [0.0, 0.18], [0.0, -0.08], [0.08, -0.2], [0.24, -0.23]]), HB({ fill: '#e2ded4', k: 0.9, shade: 0.28 }));
  f.line(hF([[0.36, -0.24], [0.08, -0.22], [0.0, -0.06], [0.02, 0.2], [0.1, 0.44], [0.22, 0.52], [0.4, 0.56]]), W(1.6), habitS, { op: 0.7 });
  f.stroke(hF([[-0.3, -0.4], [-0.42, 0.0], [-0.34, 0.4]]), W(3), habitS, { op: 0.5 });
  f.stroke(hF([[-0.1, 0.48], [0.1, 0.62], [0.3, 0.66]]), W(2.4), habitS, { op: 0.5 });
  for (let i = 0; i < 6; i++) f.line(hF([[-0.3 + i * 0.12, 0.5 + Math.abs(i - 2.5) * 0.01], [-0.32 + i * 0.13, 0.69]]), W(1.2), habitS, { op: 0.5 }); // starched pleats, so the throat reads as folded linen, not a roll
  X.salt(f, hF([[-0.3, 0.3]])[0], W(8), W(14), 8, W(2));
  // the veil comes forward over the crown and frames the wimple from above
  f.part(hF([[0.42, -0.3], [0.44, -0.4], [0.3, -0.58], [-0.08, -0.68], [-0.46, -0.56], [-0.6, -0.2], [-0.6, 0.24], [-0.5, 0.5], [-0.4, 0.2], [-0.36, -0.16], [-0.2, -0.38], [0.1, -0.42], [0.32, -0.36]]), CP({ k: 0.9 }));
  f.line(hF([[0.4, -0.36], [0.1, -0.5], [-0.3, -0.5], [-0.5, -0.2]]), W(1.6), '#4a5468', { op: 0.7 });
  X.salt(f, hF([[-0.06, -0.56]])[0], W(14), W(5), 9, W(2));
  f.line(hF([[0.12, -0.36], [0.4, -0.3]]), W(1.4), '#7a7a80', { op: 0.5 }); // tide stain on the band

  // ---- crosier: a drowned-gold crook on an iron-shod staff, a stiff salted sudarium hanging from the knop
  f.bone('crosier');
  f.part(limb(cb, ct, W(11), W(10), { steps: 10 }), GD({ fill: mix(PAL.gold, '#3a3020', 0.45), tex: 'wood111', texOp: 0.6 }));
  for (let i = 0; i < 9; i++) f.line([lp(cb, ct, 0.1 + i * 0.09, -W(5.5)), lp(cb, ct, 0.12 + i * 0.09, W(5.5))], W(1.4), PAL.goldD, { op: 0.8, straight: true }); // spiral binding
  f.part(limb(cb, lp(cb, ct, 0.04), W(13), W(12), { steps: 3 }), { fill: '#3a3634', inkW: 1.2, cast: false }); // iron ferrule
  const CX = (x, y) => Z([cx(y) + x, y]);
  // knop and the crook: a volute curling forward and back into itself, crockets along its back
  f.part([CX(-14, 196), CX(14, 196), CX(18, 184), CX(12, 172), CX(-12, 172), CX(-18, 184)], GD({ k: 0.9 }));
  f.part([CX(-10, 210), CX(10, 210), CX(12, 198), CX(-12, 198)], GD({ fill: PAL.goldD }));
  const vol = []; for (let i = 0; i <= 26; i++) { const t = i / 26, a = Math.PI * (1.0 - 2.2 * t), r = 40 * (1 - 0.62 * t); vol.push([cx(176) + 34 + Math.cos(a) * r, 128 - Math.sin(a) * r * 1.05]); }
  const volS = [[cx(176) - 6, 176], [cx(176) - 6, 150], ...vol.slice(0, 1)];
  const crook = [...volS, ...vol.slice(1)];
  f.line(ZZ(crook), W(12) + 3.6, INK, { k: 0.9 }); f.line(ZZ(crook), W(12), PAL.gold, { k: 0.9 }); f.line(ZZ(crook).map(q => add(q, [-W(2), -W(2)])), W(3), PAL.goldL, { op: 0.6 });
  for (const i of [3, 7, 11]) { const q = Z(vol[i]), c0 = Z([cx(176) + 34, 128]), d = E.norm(sub(q, c0)), tg = rot(d, -Math.PI / 2); f.part([add(q, mul(tg, W(6))), add(q, add(mul(d, W(10)), mul(tg, W(6)))), add(q, add(mul(d, W(16)), mul(tg, -W(2)))), add(q, add(mul(d, W(10)), mul(tg, -W(8)))), add(q, add(mul(d, W(4)), mul(tg, -W(4))))], GD({ inkW: 1.2, cast: false, k: 1 })); f.flat(ell(add(q, mul(d, W(10))), W(2.2), W(2.2), 0, 6), PAL.goldD); } // curled crockets
  X.voidHole(f, Z([cx(176) + 34, 130]), W(9), W(9), 0, true); // the crook closes round a clean void
  X.verd(f, Z([cx(176) + 20, 120]), W(26), W(30), 9);
  X.verd(f, CX(0, 190), W(10), W(10), 4);
  // sudarium: a stiff blue-black scarf from the knop, salt-crusted, fringed
  f.part([CX(-8, 206), CX(6, 206), CX(4, 260), CX(10, 330), [...CX(2, 344), 1], CX(-6, 332), [...CX(-12, 340), 1], CX(-16, 300), CX(-12, 250)], CP({ inkW: 1.4 }));
  for (let i = 0; i < 4; i++) f.line([CX(-12 + i * 5, 334), CX(-13 + i * 5, 350)], W(1.2), '#2a3242');
  X.salt(f, CX(-4, 230), W(8), W(16), 6, W(1.8));
  X.barnacles(f, CX(0, 760), W(8), W(16), 5, W(4));
  // ---- far hand on the staff, the near hand clasped just below it
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, W(22), skin, { shadow: skinS, tex: 'mottle111', name: 'abbess far' });
  X.salt(f, add(WF, [-W(4), -W(4)]), W(10), W(8), 5, W(1.6));
  for (let i = 0; i < 3; i++) f.line([add(WF, [W(6), -W(10) + i * W(8)]), add(WF, [W(12), -W(6) + i * W(8)])], W(1), '#3a3640', { op: 0.7 }); // cracked knuckles
  f.bone('forearm_n');
  // bell sleeve, stiff with salt: forearm cuff, then the sleeve mouth hanging below the wrist
  // independent review: the first sleeve was one flat L-shaped slab. Now a heavy bell that hangs from the forearm in
  // two weighted points, its folds fanning from the elbow, the mouth open at the wrist, the hem stained and crusted.
  const SL = (t0, off, dy = 0) => add(lp(EN, WN, t0, off), [0, W(dy)]), A2a = Math.atan2(WN[1] - EN[1], WN[0] - EN[0]);
  const sl = [SL(0.0, -W(20)), SL(0.45, -W(24)), SL(0.82, -W(30)), SL(0.93, -W(22)), SL(0.96, W(6)), SL(0.95, W(26), 40), [...SL(0.9, W(30), 86), 1], SL(0.8, W(30), 70), [...SL(0.7, W(28), 80), 1], SL(0.56, W(26), 50), SL(0.4, W(24), 26), SL(0.18, W(22), 8), SL(0.02, W(20), 2), SL(-0.05, 0)];
  f.part(sl, HB({ k: 0.85 }));
  f.flat([SL(0.86, -W(20)), SL(0.93, -W(6)), SL(0.94, W(16)), SL(0.9, W(26), 28), SL(0.82, W(22), 12), SL(0.8, -W(10))], '#2a3040'); // sleeve mouth
  for (const [t0, t1, dy, w] of [[0.22, 0.88, 82, 4.4], [0.3, 0.72, 76, 4], [0.24, 0.56, 50, 3.2], [0.5, 0.94, 50, 3]]) f.stroke([SL(t0, W(14)), SL((t0 + t1) / 2, W(24), dy * 0.5), SL(t1, W(28), dy - 6)], W(w), '#3a4252', { op: 0.7 }); // folds fanning from the elbow
  for (const [t0, t1, dy] of [[0.3, 0.8, 66], [0.36, 0.62, 60]]) f.line([SL(t0, W(10)), SL((t0 + t1) / 2, W(22), dy * 0.45), SL(t1, W(26), dy - 8)], W(1.6), '#f2efe6', { op: 0.6 }); // lit ridges between them
  X.creases(f, SL(0.04, W(10)), A2a + 1.4, W(18), 3, '#3a4252', 0.7); // bunched at the elbow
  f.line([SL(0.9, W(30), 84), SL(0.8, W(30), 68), SL(0.7, W(28), 78), SL(0.56, W(26), 48)], W(3), '#7a8090', { op: 0.45 }); // stained hem
  f.line([lp(EN, WN, 0.1, -W(20)), lp(EN, WN, 0.8, -W(26))], W(1.4), '#f2efe6', { op: 0.6 });
  X.salt(f, lp(EN, WN, 0.5, -W(18)), W(30), W(8), 14, W(2.2));
  X.salt(f, add(lp(EN, WN, 0.7, W(28)), [0, W(58)]), W(14), W(5), 7, W(2));
  for (let i = 0; i < 4; i++) f.flat(ell(add(lp(EN, WN, 0.55 + i * 0.08, W(26)), [W(f.r() * 6), W(70 + i * 9)]), W(2.2), W(2.2), 0.7, 4), '#eeebe2', { op: 0.85 }); // flakes falling from the sleeve
  crackWindow(f, [SL(0.8, -W(12)), SL(0.9, -W(6)), [...SL(0.92, W(12)), 1], [...SL(0.86, W(18), 14), 1], SL(0.8, W(8), 6)], WL(), X, W, { amp: 2 }); // the wool under-sleeve inside the bell's mouth, the crust cracked off it
  f.bone('hand_n');
  B.grip(f, WN, EN, -Math.PI / 2, W(22), skin, { shadow: skinS, tex: 'mottle111', name: 'abbess near' });
  X.salt(f, add(WN, [-W(2), -W(6)]), W(10), W(8), 5, W(1.6));
  for (let i = 0; i < 3; i++) f.line([add(WN, [W(6), -W(10) + i * W(8)]), add(WN, [W(12), -W(6) + i * W(8)])], W(1), '#3a3640', { op: 0.7 });
  f.line([add(WN, [-W(14), W(6)]), add(WN, [-W(6), W(12)]), add(WN, [W(2), W(10)])], W(1.1), '#3a3640', { op: 0.7 });
  return f;
}

// ------------------------------------------------------------------ PEARL DIVER (elite, 1.8, crouched)
// Rebuilt in the independent review. The king's best diver, drowned and still hunting: a sprinter's set crouch, hips
// higher than the shoulders, the rear leg cocked to drive, the front foot under the chest, both on the balls of the feet.
// The near fist is planted knuckles-down on the stones round the diving knife, blade forward; the far fist holds the
// stone weight's cord out ahead of him, the stone swinging. Head up on a straining neck, milky eyes on the back rank,
// lips pulled off the teeth. Lean ropey muscle, ribs and spine under wrinkled, waterlogged grey-blue skin with pooled
// lividity on the undersides, a nacre crust of pearls grown along the spine and shoulder blades.
function pearlDiver() {
  const [Wc, Hc] = K.TIERS.elite, GY = Hc - 30;
  const { Z, ZZ, W, k } = X.space(1.8, 550, GY, 348);
  const f = new Fig(K.foeBase(112, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 690])[1] })));
  X.skinDefs(f);
  const skin = '#9ca6a6', skinS = '#454b5a', skinL = '#c8d0cc', liv = '#5c4a62', livG = '#56604e', vein = '#45487a', cloth = '#6a6454', rope = '#8a7a58', web = '#b8cccc';
  const dk = mix(skinS, '#000', 0.3), sock = '#3a3448';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'flesh112', texOp: 0.55 }, o);
  const SKF = (o = {}) => SK(Object.assign({ fill: mix(skin, skinS, 0.2) }, o));
  // flesh part: creases run across the limb, lividity pools on the side nearest the ground
  const flesh = (pts, ang, look, pools = [], wr = 0.4) => f.part(pts, Object.assign({}, look, { over: X.skinOver(f, pts, ang, { wr, pools }) }));
  const A = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  const pool = (c, rx, ry, op = 0.45, col = liv) => [c, rx, ry, col, op];

  // ---- pose (human space, facing right; ground 790)
  const S = B.spine(Z([440, 574]), Z([345, 516]), Z([250, 540]), W(100));
  const P = Z([250, 540]);
  const HN = Z([252, 544]), KN = Z([204, 683]), AN = Z([88, 738]), BN = Z([120, 784]);
  const HF = Z([260, 550]), KF = Z([388, 620]), AF = Z([352, 748]), BF = Z([388, 784]);
  const SN = Z([424, 582]), EN = Z([398, 684]), WN = Z([453, 752]), FN = Z([459, 769]);
  const SF = Z([452, 568]), EF = Z([498, 656]), WF = Z([572, 628]), FF = Z([590, 622]);
  const HC = Z([502, 516]), hAng = -0.12, HH = W(92);
  const stone = Z([600, 734]), cordTop = Z([592, 640]);
  const kA = -0.1, kb = add(FN, rot([W(20), 0], kA)), kp = add(FN, rot([W(86), 0], kA)), kpom = add(FN, rot([-W(30), 0], kA));

  f.joint('pelvis', P).joint('torso', S.at(0, 0.85), 'pelvis').joint('head', S.at(0.05, -0.02), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('knife', FN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('weight', FF, 'hand_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('loincloth', S.at(0.3, 0.9), 'pelvis');

  X.puddle(f, Z([340, 794]), W(200));

  // ---- a leg: hip, knee and ankle in one continuous outline (no doll-joint caps), split at the knee for the rig.
  // The thigh's top tucks under the torso, so the groin and hip fold come from the torso's own edge.
  // calfSide: +1 when the calf is on the shin's +normal side; quadSide: the thigh side the quadriceps are on.
  const leg = (s2, H0, Kp, Ap, Bp, look, thighP, thighQ, shinP, shinQ, calfSide, quadSide) => {
    f.bone('foot_' + s2);
    tiptoe(f, Ap, Bp, W(30), look);
    footDetail(f, Ap, Bp, W(30), look);
    const kd = X.jdir(H0, Kp, Ap), ad = X.jdir(Kp, Ap, Bp);
    const lg = X.mchain([H0, Kp, Ap], [[thighP, thighQ], [shinP, shinQ]], { knob: [1.08] });
    X.split(f, () => flesh(lg, A(H0, Kp), look, [pool(lp(H0, Kp, 0.5, -quadSide * W(20)), W(40), W(14), 0.4), pool(lp(Kp, Ap, 0.35, calfSide * W(14)), W(26), W(12), 0.35)], 0.32),
      [['thigh_' + s2, X.side(Kp, mul(kd, -1), W(24))], ['shin_' + s2, [X.side(Kp, kd, W(24)), X.side(Ap, mul(ad, -1), W(12))]]]);
    f.bone('thigh_' + s2);
    // quad separation (rectus / vastus), the teardrop above the knee, the hamstring groove, wet sheen on top
    X.groove(f, [lp(H0, Kp, 0.15, quadSide * W(12)), lp(H0, Kp, 0.5, quadSide * W(16)), lp(H0, Kp, 0.8, quadSide * W(10))], W(3), dk, 0.4);
    f.line([lp(H0, Kp, 0.62, quadSide * W(27)), lp(H0, Kp, 0.82, quadSide * W(23)), lp(H0, Kp, 0.93, quadSide * W(14))], 1.4, dk, { op: 0.55 });
    X.groove(f, [lp(H0, Kp, 0.3, -quadSide * W(16)), lp(H0, Kp, 0.65, -quadSide * W(14)), lp(H0, Kp, 0.88, -quadSide * W(9))], W(2.6), dk, 0.38);
    X.wet(f, [lp(H0, Kp, 0.15, quadSide * W(27)), lp(H0, Kp, 0.4, quadSide * W(30)), lp(H0, Kp, 0.7, quadSide * W(25))], 1.4);
    f.bone('shin_' + s2);
    // knee: patella as a soft plane (no separate ball), the tibial head, crease fan behind the knee
    const kc = lp(Kp, H0, 0.04, -quadSide * W(15));
    f.flat(ell(kc, W(11), W(9), A(H0, Kp), 12), skinL, { op: 0.3 });
    f.line([add(kc, rot([-W(10), W(6)], A(H0, Kp))), add(kc, rot([0, W(10)], A(H0, Kp))), add(kc, rot([W(10), W(6)], A(H0, Kp)))], 1.3, dk, { op: 0.6 });
    f.line([lp(Kp, Ap, 0.1, -calfSide * W(15)), lp(Kp, Ap, 0.17, -calfSide * W(10))], 1.2, dk, { op: 0.6 }); // tibial tuberosity
    X.creases(f, lp(Kp, H0, 0.0, quadSide * W(14)), A(H0, Kp) + 1.2, W(14), 3, dk, 0.6);
    // calf belly edge, the tibia's lit ridge, the Achilles tendon
    X.groove(f, [lp(Kp, Ap, 0.14, calfSide * W(14)), lp(Kp, Ap, 0.32, calfSide * W(18)), lp(Kp, Ap, 0.55, calfSide * W(10))], W(2.8), dk, 0.45);
    f.line([lp(Kp, Ap, 0.14, -calfSide * W(11)), lp(Kp, Ap, 0.5, -calfSide * W(9)), lp(Kp, Ap, 0.86, -calfSide * W(6))], 1.6, skinL, { op: 0.55 });
    f.line([lp(Kp, Ap, 0.62, calfSide * W(9)), lp(Kp, Ap, 0.95, calfSide * W(6))], 1.2, dk, { op: 0.6 });
    X.veins(f, lerp(Kp, Ap, 0.55), W(8), W(16), 2);
  };
  const TH = (sc = 1) => [[[0, W(37 * sc)], [0.3, W(35 * sc)], [0.6, W(29 * sc)], [0.88, W(21)], [1, W(20)]], [[0, W(35 * sc)], [0.3, W(37 * sc)], [0.62, W(33 * sc)], [0.84, W(29)], [0.95, W(22)], [1, W(21)]]];
  const SH2 = () => [[[0, W(20)], [0.2, W(28)], [0.38, W(28)], [0.62, W(19)], [0.86, W(11)], [1, W(10.5)]], [[0, W(21)], [0.12, W(18)], [0.5, W(15)], [0.85, W(10.5)], [1, W(10.5)]]];

  // ---- far leg (front leg, under the chest), behind everything
  leg('f', HF, KF, AF, BF, SKF(), ...TH(0.95), ...SH2(), 1, -1);

  // ---- far arm: reaching ahead, the cord wound round the wrist and gripped, the stone hanging and swinging
  const ARM = (Sx, Ex, Wx, look, uaP, uaQ, faP, faQ, triSide, pools) => {
    const ed = X.jdir(Sx, Ex, Wx), am = X.mchain([Sx, Ex, Wx], [[uaP, uaQ], [faP, faQ]], { knob: [1.15] });
    const ub = Sx === SN ? 'n' : 'f';
    X.split(f, () => flesh(am, A(Sx, Ex), look, pools, 0.34), [['upperarm_' + ub, X.side(Ex, mul(ed, -1), W(16))], ['forearm_' + ub, X.side(Ex, ed, W(16))]]);
    f.bone('upperarm_' + ub);
    X.groove(f, [lp(Sx, Ex, 0.35, triSide * W(9)), lp(Sx, Ex, 0.62, triSide * W(11)), lp(Sx, Ex, 0.88, triSide * W(7))], W(2.4), dk, 0.42); // triceps / biceps division
    f.bone('forearm_' + ub);
    X.creases(f, lp(Ex, Sx, 0.0, -triSide * W(11)), A(Sx, Ex) + 1.3, W(13), 3, dk, 0.55); // inside of the elbow
    X.groove(f, [lp(Ex, Wx, 0.08, -triSide * W(9)), lp(Ex, Wx, 0.35, -triSide * W(11)), lp(Ex, Wx, 0.7, -triSide * W(5))], W(2.4), dk, 0.42); // brachioradialis edge
    for (let i = 0; i < 3; i++) f.line([lp(Ex, Wx, 0.62 + i * 0.1, -W(4)), lp(Ex, Wx, 0.68 + i * 0.1, W(2))], 1, skinL, { op: 0.45 }); // tendons to the wrist
    X.veins(f, lerp(Ex, Wx, 0.45), W(9), W(9), 3);
  };
  const UA = [[[0, W(25)], [0.3, W(24)], [0.6, W(21)], [0.88, W(16)], [1, W(15)]], [[0, W(23)], [0.25, W(18)], [0.6, W(22)], [0.86, W(16)], [1, W(15)]]];
  const FA = [[[0, W(15)], [0.2, W(19.5)], [0.5, W(15)], [0.85, W(10.5)], [1, W(10)]], [[0, W(15)], [0.18, W(19.5)], [0.45, W(16)], [0.85, W(10.5)], [1, W(10)]]];
  ARM(SF, EF, WF, SKF(), ...UA, ...FA, 1, [pool(lp(SF, EF, 0.6, W(12)), W(14), W(22), 0.4), pool(lp(EF, WF, 0.4, W(10)), W(24), W(8), 0.4)]);
  f.bone('forearm_f');
  for (let i = 0; i < 3; i++) f.line([lp(EF, WF, 0.8 + i * 0.06, -W(11)), lp(EF, WF, 0.82 + i * 0.06, W(11))], W(3), rope, { straight: true }); // cord wound round the wrist
  for (let i = 0; i < 3; i++) f.line([lp(EF, WF, 0.8 + i * 0.06, -W(11)), lp(EF, WF, 0.82 + i * 0.06, W(11))], 0.9, INK, { straight: true, op: 0.6 });
  f.bone('weight');
  f.line([cordTop, add(stone, [0, -W(36)])], W(3) + 2.2, INK); f.line([cordTop, add(stone, [0, -W(36)])], W(3), rope);
  for (let i = 0; i < 6; i++) { const q = lerp(cordTop, add(stone, [0, -W(36)]), 0.1 + i * 0.15); f.line([q, add(q, [W(2), W(3)])], 1, INK, { op: 0.6 }); }
  const st = [[-30, -28], [-8, -38], [18, -34], [32, -10], [30, 16], [14, 32], [-12, 33], [-30, 12]].map(q => add(stone, [W(q[0]), W(q[1])]));
  f.part(st, { fill: '#5a5e5a', shadow: '#1e2228', tex: 'mottle112', texOp: 0.75, k: 0.75 });
  f.line([add(stone, [W(-20), W(-24)]), add(stone, [W(-2), W(-31)]), add(stone, [W(18), W(-26)])], 1.6, '#9aa09a', { op: 0.5 });
  f.flat(ell(add(stone, [0, -W(20)]), W(6), W(4.5), 0, 10), '#0c0c0c'); // bored hole for the cord
  f.line([add(stone, [0, -W(36)]), add(stone, [-W(5), -W(27)]), add(stone, [0, -W(20)]), add(stone, [W(5), -W(27)]), add(stone, [0, -W(36)])], W(2.6), rope);
  f.line([add(stone, [W(8), W(4)]), add(stone, [W(16), W(10)]), add(stone, [W(12), W(22)])], 1.2, INK, { op: 0.6 }); // chip
  X.barnacles(f, add(stone, [W(8), W(12)]), W(14), W(12), 6, W(4.5));
  X.verd(f, add(stone, [-W(14), -W(4)]), W(8), W(10), 3, '#4a6a5a');
  for (let i = 0; i < 3; i++) { const r = W(122 + i * 9); f.line([0.14, 0.07, 0.0].map(a => add(cordTop, [Math.sin(a + 0.14 + i * 0.05) * r, Math.cos(a + 0.14 + i * 0.05) * r])), 1.2, '#c8d4d8', { op: 0.38 - i * 0.1 }); } // the swing, a faint arc behind the stone
  X.drip(f, add(stone, [W(10), W(42)]), k); X.drip(f, add(stone, [-W(6), W(58)]), k * 0.7);
  f.bone('hand_f');
  const gF = B.grip(f, FF, EF, -Math.PI / 2, W(24), mix(skin, skinS, 0.15), { shadow: skinS, tex: 'flesh112', name: 'diver cord' });
  X.fistDetail(f, gF, W(24), mix(skin, skinS, 0.15), { web });
  f.line([add(FF, [0, -W(16)]), add(FF, [W(2), -W(4)])], W(2.6), rope, { op: 0.9 }); // cord entering the top of the fist

  // ---- near leg (rear, driving leg): drawn before the torso so the hip fold is the torso's own edge
  leg('n', HN, KN, AN, BN, SK(), ...TH(1), ...SH2(), 1, -1);

  // ---- torso: long and lean, arched over the knees; ribs, serratus, lats and the spine's knobs under thin skin
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.26, 0.3], [0.0, 0.44, 0.4], [0.1, 0.52, 0.54], [0.25, 0.54, 0.6], [0.42, 0.48, 0.56], [0.6, 0.42, 0.4], [0.76, 0.46, 0.42], [0.9, 0.56, 0.44], [1.02, 0.52, 0.36], [1.1, 0.3, 0.16]]);
  flesh(torso, A(S.at(0, 1), S.at(0, 0)), SK(), [pool(S.at(0.45, 0.35), W(70), W(26), 0.5), pool(S.at(0.38, 0.75), W(40), W(20), 0.45, livG), pool(S.at(0.3, 0.95), W(30), W(18), 0.4)], 0.3);
  // ribs: lit ridges with a shadow under each, running from the spine forward and down
  for (let i = 0; i < 5; i++) { const v = 0.2 + i * 0.08 + (f.r() - 0.5) * 0.02, u0 = -0.05 + f.r() * 0.12, u1 = 0.3 + i * 0.03; f.stroke([S.at(u0, v - 0.03), S.at((u0 + u1) / 2, v + 0.01), S.at(u1, v + 0.06)], W(2 + i * 0.3), dk, { op: 0.28 + i * 0.05 }); f.line([S.at(u0 + 0.04, v - 0.05), S.at((u0 + u1) / 2, v - 0.015), S.at(u1 - 0.04, v + 0.035)], 1.1, skinL, { op: 0.4 }); }
  // serratus: short shadowed slips under the armpit
  for (let i = 0; i < 3; i++) { const v = 0.12 + i * 0.07; f.stroke([S.at(0.32, v + 0.03), S.at(0.42, v + 0.035), S.at(0.5, v + 0.05)], W(2.4), dk, { op: 0.35 }); }
  X.groove(f, [S.at(0.42, 0.08), S.at(0.12, 0.3), S.at(0.0, 0.58)], W(3.4), dk, 0.5); // lat edge
  X.groove(f, [S.at(0.3, 0.6), S.at(0.36, 0.72), S.at(0.3, 0.86)], W(3), dk, 0.45); // the sucked-in belly under the ribs
  f.line([S.at(0.38, 0.78), S.at(0.41, 0.8), S.at(0.38, 0.82)], 1.4, INK, { op: 0.6 }); // navel
  // shoulder blade: a raised plate with its medial border in shadow
  f.part([S.at(-0.44, 0.04), S.at(-0.2, 0.0), S.at(-0.05, 0.12), S.at(-0.2, 0.3), S.at(-0.42, 0.26)], SK({ cast: false, inkW: 0, shade: 0.35, fill: mix(skin, skinL, 0.15), over: X.skinOver(f, [S.at(-0.44, 0.04), S.at(-0.05, 0.3)], 0, { wr: 0.25 }) }));
  X.groove(f, [S.at(-0.44, 0.27), S.at(-0.3, 0.3), S.at(-0.16, 0.3)], W(3), dk, 0.5);
  X.groove(f, [S.at(-0.4, 0.4), S.at(-0.36, 0.6), S.at(-0.4, 0.84)], W(4), dk, 0.4); // the long back muscles
  // spine: vertebral knobs along the top line
  for (let i = 0; i < 12; i++) { const v = 0.02 + i * 0.075, c = S.at(-0.47, v); f.flat(ell(c, W(5), W(3.4), A(S.at(0, v), S.at(0, v + 0.05)), 8), skinL, { op: 0.5 }); f.line([add(c, [W(3), W(3)]), add(c, [-W(3), W(4)])], 1, dk, { op: 0.5 }); }
  X.wet(f, [S.at(-0.48, 0.1), S.at(-0.5, 0.3), S.at(-0.46, 0.5), S.at(-0.44, 0.7), S.at(-0.5, 0.9)], 1.6);
  X.veins(f, S.at(0.25, 0.45), W(30), W(20), 4);
  X.peel(f, S.at(0.2, 0.62), 3, k);
  // nacre crust: clusters of pearls grown into the skin along the spine and over the shoulder blades, some half sunk
  const nacre = (u, v, rx, ry, n, r0) => {
    const c = S.at(u, v), cr = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, rr = 0.7 + f.r() * 0.45; cr.push(add(c, [Math.cos(a) * rx * rr, Math.sin(a) * ry * rr])); }
    f.flat(cr, '#cfd2cc', { op: 0.42 }); f.line(cr.concat([cr[0]]), 1, '#e8e6dc', { op: 0.4 });
    for (let i = 0; i < n; i++) { const a = f.r() * Math.PI * 2, rr = Math.sqrt(f.r()) * 0.8, p = add(c, [Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]), r = W(r0 * (0.5 + f.r() * 0.7)); f.flat(ell(add(p, [0, r * 0.3]), r * 1.25, r * 0.9, 0, 10), dk, { op: 0.35 }); X.pearl(f, p, r); if (f.r() > 0.6) f.line([add(p, [-r, r * 0.3]), add(p, [0, r * 0.65]), add(p, [r, r * 0.3])], 1.2, mix(skin, skinS, 0.3), { op: 0.9 }); }
  };
  nacre(-0.46, 0.08, W(26), W(16), 9, 5.5);
  nacre(-0.3, 0.16, W(30), W(18), 10, 4.8);
  nacre(-0.48, 0.36, W(20), W(14), 7, 5);
  nacre(-0.5, 0.58, W(16), W(12), 5, 4.6);
  nacre(-0.5, 0.78, W(12), W(10), 4, 4);
  for (const [u, v, r] of [[-0.36, 0.26, 5.5], [-0.46, 0.48, 4.5]]) X.voidHole(f, S.at(u, v), W(r), W(r * 0.85), 0, false); // empty sockets, clean-rimmed

  // ---- loincloth: a wrap round the hips and a flap hanging plumb between the legs, sodden and dripping
  f.bone('loincloth');
  const lb = S.at(0.42, 0.92);
  f.part([S.at(0.2, 0.86), S.at(0.5, 0.84), add(lb, [W(16), W(24)]), add(lb, [W(12), W(62)]), [...add(lb, [W(4), W(86)]), 1], add(lb, [-W(4), W(66)]), [...add(lb, [-W(12), W(82)]), 1], add(lb, [-W(16), W(50)]), add(lb, [-W(14), W(16)])], { fill: cloth, tex: 'weave112', texOp: 0.5, shadow: '#26241e' });
  f.stroke([add(lb, [0, W(8)]), add(lb, [W(2), W(48)]), add(lb, [-W(2), W(72)])], W(2.4), '#34322a');
  X.verd(f, add(lb, [W(4), W(50)]), W(8), W(14), 2, '#4a6a5a'); X.drip(f, add(lb, [W(4), W(94)]), k); X.drip(f, add(lb, [-W(12), W(88)]), k * 0.7);
  f.bone('pelvis');
  const wrap = S.shape([[0.8, 0.47, 0.44], [0.92, 0.52, 0.45], [1.02, 0.49, 0.37], [1.08, 0.33, 0.22]]);
  f.part(wrap, { fill: mix(cloth, '#2a2a30', 0.25), tex: 'weave112', texOp: 0.5, shadow: '#1e1e1c' });
  for (let i = 0; i < 5; i++) f.stroke([S.at(-0.4 + i * 0.18, 0.86), S.at(-0.36 + i * 0.18, 0.95), S.at(-0.42 + i * 0.18, 1.04)], W(2.6), '#1a1a18', { op: 0.5 });
  X.verd(f, S.at(-0.1, 0.95), W(30), W(12), 3, '#4a6a5a');
  for (let i = 0; i < 4; i++) f.line([S.at(-0.4 + i * 0.22, 0.84), S.at(-0.36 + i * 0.22, 0.95), S.at(-0.4 + i * 0.22, 1.04)], 1.2, '#2e2c26', { op: 0.6 }); // folds
  f.part([S.at(-0.5, 0.77), S.at(0.0, 0.79), S.at(0.46, 0.83), S.at(0.45, 0.865), S.at(0.0, 0.825), S.at(-0.52, 0.805)], { fill: rope, tex: 'hatch112', texOp: 0.5, k: 0.8, shade: 0.4 });
  for (let i = 0; i < 9; i++) { const u = -0.46 + i * 0.11, v = 0.775 + (u + 0.5) * 0.05; f.line([S.at(u, v), S.at(u + 0.04, v + 0.035)], 1, INK, { op: 0.55 }); }
  f.part(ell(S.at(0.1, 0.81), W(7), W(6), 0, 10), { fill: rope, inkW: 1.1, cast: false, tex: 'hatch112' }); // knot
  f.stroke([S.at(0.1, 0.83), add(S.at(0.12, 0.83), [W(-2), W(26)]), add(S.at(0.12, 0.83), [W(2), W(40)])], W(3), rope); f.stroke([S.at(0.12, 0.83), add(S.at(0.14, 0.83), [W(6), W(20)])], W(2.6), mix(rope, '#000', 0.2));
  // two net bags of pearls hanging from the belly side of the belt, over the front thigh
  for (const [u, l, w] of [[0.36, 44, 28], [0.5, 34, 22]]) {
    const top = S.at(u, 0.82), c = add(top, [0, W(l * 0.62)]);
    f.line([top, add(c, [0, -W(l * 0.3)])], W(1.6), rope);
    const bag = [add(c, [-W(w * 0.4), -W(l * 0.35)]), add(c, [W(w * 0.4), -W(l * 0.35)]), add(c, [W(w * 0.55), W(l * 0.1)]), add(c, [W(w * 0.4), W(l * 0.4)]), add(c, [0, W(l * 0.48)]), add(c, [-W(w * 0.42), W(l * 0.38)]), add(c, [-W(w * 0.55), W(l * 0.08)])];
    f.part(bag, { fill: '#34342f', shade: 0.3, inkW: 1.3, cast: false });
    for (let i = 0; i < 7; i++) X.pearl(f, add(c, [W((f.r() - 0.5) * w * 0.8), W((f.r() - 0.3) * l * 0.6)]), W(3.6 + f.r() * 2));
    for (let i = -2; i <= 2; i++) { f.line([add(c, [W(i * w * 0.18), -W(l * 0.35)]), add(c, [W(i * w * 0.12 + w * 0.15), W(l * 0.45)])], 1, rope, { op: 0.9 }); f.line([add(c, [W(i * w * 0.18), -W(l * 0.35)]), add(c, [W(i * w * 0.12 - w * 0.15), W(l * 0.45)])], 1, rope, { op: 0.9 }); }
    X.drip(f, add(c, [0, W(l * 0.6)]), k * 0.8);
  }
  // the cathedral-blessed diver's token: the only gold on him
  const tk = add(S.at(0.5, 0.8), [0, W(22)]);
  f.line([S.at(0.5, 0.8), add(tk, [0, -W(8)])], W(1.4), '#2a2018');
  f.part(ell(tk, W(8), W(9), 0, 14), { fill: PAL.gold, shadow: PAL.goldD, shade: 0.4, inkW: 1.2, cast: false, tex: 'mottle112' });
  f.flat([[...add(tk, [-W(3), W(5)]), 1], add(tk, [-W(3), -W(1)]), add(tk, [0, -W(4.5)]), add(tk, [W(3), -W(1)]), [...add(tk, [W(3), W(5)]), 1]], '#1a140a');

  f.bone('thigh_n');
  { const c0 = lp(HN, KN, 0.15, W(20)), c1 = lp(HN, KN, 0.5, W(30)); for (let i = 0; i < 4; i++) { const c = lerp(c0, c1, i / 3); f.flat(ell(add(c, [0, W(3)]), W(5), W(4), 0, 8), dk, { op: 0.35 }); X.pearl(f, c, W(3.4 + f.r() * 1.6)); } }

  // ---- head and neck: the neck strains forward and up out of the shoulders, the head lifted to watch the back rank
  f.bone('head');
  const neck = ZZ([[408, 544], [440, 524], [466, 506], [486, 502], [520, 544], [526, 562], [496, 580], [458, 604], [424, 608]]);
  flesh(neck, -0.6, SK(), [pool(Z([470, 576]), W(30), W(12), 0.4)], 0.45);
  X.groove(f, ZZ([[468, 524], [470, 552], [442, 592]]), W(3.4), dk, 0.5); // the long neck muscle from behind the ear to the breastbone
  f.line(ZZ([[476, 532], [474, 558], [450, 594]]), 1.4, skinL, { op: 0.5 });
  f.flat(ell(Z([508, 568]), W(7), W(5), -0.6, 8), skinL, { op: 0.4 }); f.line(ZZ([[502, 574], [508, 572], [514, 564]]), 1.2, dk, { op: 0.6 }); // larynx
  X.creases(f, Z([500, 580]), -0.5, W(18), 3, dk, 0.5);
  X.groove(f, ZZ([[436, 520], [420, 538], [402, 552]]), W(3), dk, 0.4); // trapezius ridge
  const hF = frame(HC, hAng, HH);
  B.head(f, HC, HH, hAng, { skin, jaw: 1.06, chin: 0.01, nose: 0.82, hook: -0.25, browOut: 0.03, mouth: 'snarl', squint: 0.15, browDown: 0.1, faceShade: 0.38, noEar: true, gaunt: true, age: true, jawShade: 0.34, iris: '#c8d0ce', eyeWhite: '#c0c8c8', browCol: '#3a4050', hairCol: '#2a3038', browW: 0.03 });
  // skull: the cranium and occiput drawn over the back edge of the face plate with no ink, then inked only along its
  // outer contour, so the shaved head reads as one bone mass and never as a mask strapped onto a ball
  const skull = hF([[0.16, -0.47], [-0.1, -0.54], [-0.36, -0.46], [-0.5, -0.26], [-0.53, -0.02], [-0.44, 0.18], [-0.3, 0.3], [-0.2, 0.26], [-0.14, 0.06], [-0.16, -0.2], [-0.04, -0.4]]);
  flesh(skull, hAng, SK({ inkW: 0, cast: false, shade: 0.22 }), [pool(hF([[-0.4, 0.14]])[0], W(16), W(10), 0.3)], 0.3);
  f.line(hF([[0.14, -0.475], [-0.1, -0.545], [-0.36, -0.465], [-0.5, -0.27], [-0.535, -0.02], [-0.45, 0.18], [-0.3, 0.31]]), 2.2, INK);
  f.line(hF([[-0.3, 0.3], [-0.24, 0.27], [-0.21, 0.27]]), 1.4, INK, { op: 0.7 });
  f.flat(hF([[-0.5, -0.2], [-0.52, 0.0], [-0.44, 0.17], [-0.32, 0.27], [-0.38, 0.06], [-0.44, -0.14]]), skinS, { op: 0.45 }); // shadow side of the occiput
  for (let i = 0; i < 22; i++) { const q = [-0.42 + f.r() * 0.5, -0.5 + f.r() * 0.3]; f.line(hF([q, [q[0] + 0.012, q[1] + 0.01]]), 1, '#2a3038', { op: 0.35 }); } // stubble on the shaved crown
  // waterlogged face: the face plane carries the same crease texture and pooled colour
  f.flat(hF([[0.04, -0.15], [0.36, -0.17], [0.38, -0.11], [0.04, -0.1]]), sock, { op: 0.45 }); // heavy brow ridge shadow
  f.line(hF([[0.06, -0.165], [0.2, -0.19], [0.36, -0.16]]), 1.6, skinL, { op: 0.55 }); // lit brow ridge
  for (let i = 0; i < 4; i++) f.line(hF([[0.0 + i * 0.02, -0.25 - i * 0.055], [0.1, -0.27 - i * 0.055], [0.2, -0.25 - i * 0.055], [0.3, -0.26 - i * 0.05]]), 1, dk, { op: 0.55 }); // forehead creases
  for (const x of [0.25, 0.28]) f.line(hF([[x, -0.2], [x + 0.01, -0.13]]), 1.1, dk, { op: 0.65 }); // frown
  f.flat(hF(ell([-0.02, -0.14], 0.09, 0.12, 0.2, 10)), sock, { op: 0.3 }); // sunken temple
  f.line(hF([[-0.05, -0.28], [0.0, -0.2], [-0.04, -0.1]]), 1, vein, { op: 0.6 }); // temple vein
  f.flat(hF([[0.1, 0.06], [0.26, 0.08], [0.22, 0.14], [0.12, 0.12]]), skinL, { op: 0.35 }); // cheekbone
  for (let i = 0; i < 3; i++) f.line(hF([[0.03, -0.03 + i * 0.04], [-0.05, -0.01 + i * 0.05]]), 0.9, dk, { op: 0.5 }); // crow's feet
  // ear worn to a smooth nub with an open canal
  f.part(hF([[-0.19, -0.08], [-0.24, -0.06], [-0.26, 0.02], [-0.24, 0.1], [-0.19, 0.12], [-0.17, 0.03]]), SK({ fill: mix(skin, skinS, 0.12), cast: false, inkW: 1, inkHeavy: 1.2, shade: 0.4 }));
  f.line(hF([[-0.2, -0.05], [-0.23, 0.0], [-0.22, 0.07]]), 1, dk, { op: 0.7 }); // what is left of the helix
  f.flat(hF(ell([-0.195, 0.05], 0.01, 0.016, 0.3, 6)), '#141018', { op: 0.9 });
  // milky eyes: a film of nacre over the whole eye, a ghost of an iris, no pupil
  f.flat(hF([[0.065, -0.058], [0.115, -0.088], [0.168, -0.064], [0.115, -0.038]]), '#dfe3de', { op: 0.95 });
  f.flat(hF(ell([0.128, -0.062], 0.022, 0.02, 0, 10)), '#a8b2b4', { op: 0.55 });
  f.flat(hF(ell([0.12, -0.07], 0.01, 0.006, 0, 6)), '#ffffff', { op: 0.85 });
  f.line(hF([[0.06, -0.06], [0.115, -0.09], [0.172, -0.066]]), 1.6, INK);
  f.flat(hF([[0.27, -0.062], [0.296, -0.08], [0.312, -0.066], [0.292, -0.052]]), '#d8dcd6', { op: 0.95 });
  f.line(hF([[0.07, -0.035], [0.12, -0.03], [0.16, -0.045]]), 1, dk, { op: 0.6 }); // lower lid, swollen
  // lips pulled back off the teeth: blue lips, a row of worn teeth, a gum line
  f.flat(hF([[0.17, 0.268], [0.25, 0.256], [0.325, 0.27], [0.31, 0.302], [0.23, 0.312], [0.18, 0.296]]), '#18141a');
  for (let i = 0; i < 5; i++) { const x = 0.19 + i * 0.026; f.flat(hF([[x, 0.262 - (i === 2 ? 0.004 : 0)], [x + 0.022, 0.262], [x + 0.02, 0.284 - (i % 2) * 0.004], [x + 0.002, 0.286]]), i === 3 ? '#8a8270' : '#c4bca4', { op: 0.95 }); }
  for (let i = 0; i < 4; i++) { const x = 0.2 + i * 0.028; f.flat(hF([[x, 0.3], [x + 0.022, 0.3], [x + 0.02, 0.288], [x + 0.002, 0.288]]), '#aaa28c', { op: 0.85 }); }
  f.stroke(hF([[0.16, 0.262], [0.24, 0.246], [0.33, 0.262]]), HH * 0.026, '#46526a'); // upper lip, drawn up
  f.stroke(hF([[0.18, 0.31], [0.25, 0.32], [0.31, 0.302]]), HH * 0.022, '#46526a');
  f.line(hF([[0.27, 0.12], [0.22, 0.2], [0.16, 0.25]]), 1.3, INK, { op: 0.8 }); // deep nasolabial fold, pulled by the snarl
  f.line(hF([[0.33, 0.27], [0.36, 0.33]]), 1, INK, { op: 0.6 });
  for (const [x, y, r] of [[-0.3, -0.32, 0.034], [-0.38, -0.14, 0.03], [-0.42, 0.04, 0.026], [-0.18, -0.46, 0.028], [-0.04, -0.52, 0.02], [-0.44, -0.24, 0.022]]) { f.flat(hF(ell([x, y + 0.012], r * 1.2, r * 0.9, 0, 8)), dk, { op: 0.35 }); X.pearl(f, hF([[x, y]])[0], HH * r); }
  X.wet(f, hF([[-0.2, -0.52], [0.05, -0.55], [0.2, -0.5], [0.3, -0.36]]), 1.6);
  X.drip(f, hF([[0.26, 0.4]])[0], k * 0.8);

  // ---- near arm: planted straight down, the fist knuckles-down on the stones round the knife
  ARM(SN, EN, WN, SK(), ...UA, ...FA, 1, [pool(lp(SN, EN, 0.7, -W(6)), W(10), W(26), 0.32), pool(lp(EN, WN, 0.7, 0), W(14), W(20), 0.38)]);
  f.bone('upperarm_n');
  const delt = [lp(SN, EN, -0.2, 0), lp(SN, EN, -0.1, W(25)), lp(SN, EN, 0.2, W(26)), [...lp(SN, EN, 0.46, W(6)), 1], lp(SN, EN, 0.24, -W(21)), lp(SN, EN, -0.08, -W(23))];
  flesh(delt, A(SN, EN), SK({ shade: 0.3, inkW: 0, cast: false }), [], 0.25); // the deltoid over the shoulder joint, no outline of its own
  f.line([lp(SN, EN, -0.1, W(25)), lp(SN, EN, 0.2, W(26)), lp(SN, EN, 0.46, W(6))], 1.6, INK, { op: 0.8 });
  X.groove(f, [lp(SN, EN, 0.18, -W(19)), lp(SN, EN, 0.34, -W(10)), lp(SN, EN, 0.44, W(3))], W(2.4), dk, 0.5);
  f.line([lp(SN, EN, 0.5, -W(14)), lp(SN, EN, 0.7, -W(16)), lp(SN, EN, 0.85, -W(11))], 1.4, skinL, { op: 0.55 }); // biceps catching light
  X.wet(f, [lp(SN, EN, -0.05, -W(22)), lp(SN, EN, 0.3, -W(19)), lp(SN, EN, 0.6, -W(19))], 1.4);
  for (let i = 0; i < 6; i++) { const c = add(lp(SN, EN, -0.08 + f.r() * 0.16, W(8 + f.r() * 12)), [0, 0]), r = W(3 + f.r() * 2.4); f.flat(ell(add(c, [0, r * 0.3]), r * 1.25, r * 0.9, 0, 8), dk, { op: 0.35 }); X.pearl(f, c, r); } // pearls in the skin over the back of the shoulder
  f.bone('forearm_n');
  for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.78 + i * 0.06, -W(12)), lp(EN, WN, 0.8 + i * 0.06, W(12))], W(2.4), rope, { straight: true }); // cord wrist wrap
  for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.78 + i * 0.06, -W(12)), lp(EN, WN, 0.8 + i * 0.06, W(12))], 0.8, INK, { straight: true, op: 0.55 });
  f.bone('knife');
  f.part([add(kb, rot([0, -W(6)], kA)), add(kb, rot([W(46), -W(5)], kA)), kp, add(kb, rot([W(52), W(3)], kA)), add(kb, rot([0, W(6)], kA))], { fill: '#7a8080', shadow: '#2a2e34', shade: 0.4, inkW: 1.3, cast: false });
  f.line([add(kb, rot([W(4), -W(3)], kA)), add(kb, rot([W(56), -W(1)], kA))], W(1.4), '#d0d4d4', { op: 0.7 });
  f.part(limb(kpom, kb, W(9), W(10), { steps: 4 }), { fill: '#d8d0bc', shadow: '#6a6250', inkW: 1.2, cast: false }); // bone grip
  f.part([add(kb, rot([-W(2), -W(11)], kA)), add(kb, rot([W(4), -W(11)], kA)), add(kb, rot([W(4), W(11)], kA)), add(kb, rot([-W(2), W(11)], kA))].map(q => [...q, 1]), { fill: '#4a4640', inkW: 1.1, cast: false });
  X.pits(f, lerp(kb, kp, 0.5), W(18), W(3), 6);
  f.bone('hand_n');
  const gN = B.grip(f, FN, EN, kA, W(24), skin, { shadow: skinS, tex: 'flesh112', name: 'diver knife' });
  X.fistDetail(f, gN, W(24), skin, { web });
  f.flat(ell(Z([458, 790]), W(26), W(3), 0, 10), '#0e1012', { op: 0.5 }); // contact shadow on the stones
  return f;
}
// the near edge of a foot on its ball: wrinkled sole, nail beds, toe joints
function footDetail(f, ankle, ball, s, look) {
  const gy = f.o.groundY, dk = mix(look.fill, '#1a1424', 0.5);
  for (let i = 0; i < 3; i++) f.line([[ball[0] - s * (0.1 + i * 0.12), gy - s * 0.42], [ball[0] - s * (0.04 + i * 0.12), gy - s * 0.2]], 0.9, dk, { op: 0.5 });
  f.line([add(ankle, [-s * 0.5, s * 0.1]), lerp(ankle, ball, 0.5), add(ball, [-s * 0.2, -s * 0.36])], 1, mix(look.fill, '#fff', 0.35), { op: 0.5 }); // instep tendon
  f.flat(ell([ball[0] + s * 0.9, gy - s * 0.06], s * 0.5, s * 0.06, 0, 8), '#0e1012', { op: 0.5 });
}
// a tapered string of pearls along a line (nacre crust down the back of a limb)
function pearlLine(f, a, b, n, r) { for (let i = 0; i < n; i++) { const c = lerp(a, b, i / (n - 1)), rr = r * (0.6 + f.r() * 0.6); f.flat(ell(c, rr * 1.3, rr * 1.15, 0, 10), '#c8cccc', { op: 0.6 }); X.pearl(f, c, rr); } }
// webbed hand splayed flat on the ground, fingers forward, webbing between them
function webHand(f, c, ang, s, col, sh) {
  const r = B.hand(f, c, ang, s, col, { spread: 0.75, curl: -0.15, shadow: sh });
  const base = r.F([[0.42, -0.34], [0.42, -0.11], [0.42, 0.12], [0.42, 0.33]]);
  for (let i = 0; i < 3; i++) { const a = base[i], b = base[i + 1], ta = r.tips[i], tb = r.tips[i + 1]; f.flat([a, lerp(a, ta, 0.62), lerp(lerp(a, ta, 0.55), lerp(b, tb, 0.55), 0.5), lerp(b, tb, 0.62), b], '#b8c4c4', { op: 0.55 }); f.line([lerp(a, ta, 0.62), lerp(lerp(a, ta, 0.5), lerp(b, tb, 0.5), 0.5), lerp(b, tb, 0.62)], 1, INK, { op: 0.6 }); }
  return r;
}
// a foot on its ball: heel lifted, toes bent flat on the ground. ankle -> ball of the foot
function tiptoe(f, ankle, ball, s, look) {
  const gy = f.o.groundY, d = E.norm(sub(ball, ankle)), n = [-d[1], d[0]], toe = [ball[0] + s * 1.2, gy];
  const heel = add(ankle, add(mul(d, -s * 0.2), mul(n, -s * 0.55)));
  const pts = [add(ankle, mul(n, s * 0.5)), add(lerp(ankle, ball, 0.5), mul(n, s * 0.46)), add(ball, mul(n, s * 0.46)), [ball[0] + s * 0.3, gy - s * 0.56], [toe[0] - s * 0.1, gy - s * 0.44], [toe[0] + s * 0.06, gy - s * 0.18], [toe[0], gy, 1], [ball[0] - s * 0.2, gy, 1], add(ball, mul(n, -s * 0.42)), add(lerp(ankle, ball, 0.45), mul(n, -s * 0.5)), heel, add(heel, mul(d, -s * 0.12))];
  f.part(pts, Object.assign({ k: 0.9 }, look));
  // smaller toes as separate pads, the big toe nail, the crease where the toes bend flat
  for (let i = 0; i < 3; i++) { const tx = toe[0] - s * (0.18 + i * 0.2); f.part(ell([tx, gy - s * 0.14], s * 0.12, s * 0.14, 0, 8), Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false, shade: 0.45, fill: mix(look.fill, '#3a3040', 0.12 + i * 0.05) })); }
  f.flat([[toe[0] - s * 0.22, gy - s * 0.4], [toe[0] - s * 0.02, gy - s * 0.32], [toe[0] + s * 0.02, gy - s * 0.16], [toe[0] - s * 0.2, gy - s * 0.2]], '#c8ccc8', { op: 0.8 }); // nail
  f.line([[ball[0] + s * 0.2, gy - s * 0.52], [ball[0] + s * 0.36, gy - s * 0.04]], 1.2, INK, { op: 0.7 }); // toe crease
  f.line([add(ankle, mul(n, -s * 0.3)), add(heel, mul(d, s * 0.2))], 1.1, mix(look.fill, '#000', 0.45), { op: 0.7 }); // Achilles
  f.flat(ell(add(ankle, mul(n, s * 0.05)), s * 0.12, s * 0.15, 0, 8), mix(look.fill, '#fff', 0.2), { op: 0.5 }); // ankle bone
}
// bare shin and flat foot (kit.bareLeg) with world-local defaults
function bareLegK(f, top, ankle, dir, s, wt, look, o) { return K.bareLeg(f, top, ankle, dir, s, wt, look, o); }

// ------------------------------------------------------------------ BARNACLE KNIGHT (large, 1.4)
// A knight of the cathedral's order, kept in his armour by the sea: so crusted with barnacles, mussels and coral that
// he reads as rock, broader than any man. Only the helm crest, the sword and the order's cross survive the growth.
// Braced behind a heater shield held forward, sword shouldered, waiting.
function barnacleKnight() {
  const [Wc, Hc] = K.TIERS.large, GY = Hc - 30;
  const { Z, ZZ, W, k } = X.space(1.4, 440, GY);
  const f = new Fig(K.foeBase(113, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 620])[1] })));
  const crust = '#9a968a', crustD = '#6a685e', crustL = '#bdb8aa', steel = '#6a7272', steelD = '#4a5252';
  const CR = (o = {}) => Object.assign({ fill: crust, shadow: '#3a3a40', tex: 'mottle113', texOp: 0.75 }, o);
  const S = B.spine(Z([298, 270]), Z([290, 362]), Z([284, 470]), W(100));
  const P = Z([284, 470]), HC = Z([316, 214]);
  const SN = S.at(-0.52, 0.12), SF = S.at(0.6, 0.12);
  const EN = Z([232, 384]), WN = Z([290, 340]);
  const EF = Z([360, 432]), WF = Z([396, 456]);
  const HN = S.at(-0.36, 1.0), KN = Z([222, 616]), AN = Z([192, 742]);
  const HF = S.at(0.34, 0.98), KF = Z([354, 612]), AF = Z([378, 742]);
  const sA = Math.atan2(160 - 342, 150 - 290); // blade direction: up and back over the near shoulder
  const shC = Z([414, 470]);

  // crust a shape: lumpy outline, rock-grey with dark crevices, barnacles and mussels sown over it
  const crusted = (pts, amp, o = {}) => { const L = X.lumpy(f, pts, amp * 1.4, o.n || 12); f.part(L, CR(o)); return L; };
  // rock nodules: low shaded lumps of old growth that break up every surface
  const nod = (c, rx, ry, n, r0) => { for (let i = 0; i < n; i++) { const a = f.r() * 6.28, rr = Math.sqrt(f.r()), p = add(c, [Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]), r = r0 * (0.6 + f.r() * 0.8); f.part(X.lumpy(f, ell(p, r, r * 0.8, f.r() * 3, 8), r * 0.25, 8), CR({ fill: mix(crustL, crustD, f.r() * 0.6), inkW: 1.1, inkHeavy: 1.8, cast: false, shade: 0.5 })); } };
  const sow = (c, rx, ry, nb, nm, r0) => { X.barnacles(f, c, rx, ry, nb, r0); for (let i = 0; i < nm; i++) X.mussel(f, add(c, [(f.r() - 0.5) * rx * 1.6, (f.r() - 0.5) * ry * 1.6]), f.r() * 3, k * (0.9 + f.r() * 0.5)); };
  const crev = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.stroke([p, add(p, [W(4 + f.r() * 8), W(2 + f.r() * 6)]), add(p, [W(10 + f.r() * 10), W(f.r() * 8)])], W(2.4), '#24222a', { op: 0.7 }); } };

  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.2, -0.04), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('sword', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('shield', WF, 'hand_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');

  X.puddle(f, Z([290, 794]), W(180));
  // ---- far arm behind the shield
  f.bone('upperarm_f');
  crusted(limb(SF, EF, W(54), W(46)), W(5));
  f.bone('forearm_f');
  crusted(limb(EF, WF, W(48), W(40)), W(4));
  // ---- legs: wide, braced, knees bent under the weight; crusted greaves, sabatons that read as boulders
  const leg = (H0, Kp, A, side) => {
    const s2 = side > 0 ? 'f' : 'n';
    f.bone('thigh_' + s2);
    crusted(limb(H0, Kp, W(78), W(56), { q: [[0.4, 0.1, 0.2]] }), W(8), side > 0 ? { fill: mix(crust, crustD, 0.25) } : {});
    nod(lerp(H0, Kp, 0.5), W(20), W(30), 4, W(11));
    crev(lerp(H0, Kp, 0.5), W(20), W(30), 4);
    sow(lerp(H0, Kp, 0.4), W(22), W(30), 9, 2, W(5.5));
    f.bone('shin_' + s2);
    crusted(limb(Kp, A, W(62), W(40), { p: [[0.3, 0.14, 0.18]], q: [[0.28, 0.08, 0.18]] }), W(7), side > 0 ? { fill: mix(crust, crustD, 0.25) } : {});
    // a strip of greave still bare down the shin, so the leg keeps the shape of armour under the rock
    f.part([lp(Kp, A, 0.3, -W(12)), lp(Kp, A, 0.3, -W(22)), lp(Kp, A, 0.8, -W(16)), lp(Kp, A, 0.8, -W(8))], { fill: side > 0 ? steelD : steel, shadow: steelD, tex: 'mottle113', inkW: 1.2, cast: false });
    f.rivet(lp(Kp, A, 0.4, -W(16)), W(2.2)); X.pits(f, lp(Kp, A, 0.6, -W(14)), W(5), W(20), 6);
    const kc = X.lumpy(f, ell(Kp, W(34), W(30), 0, 10), W(6), 8); f.part(kc, CR({ fill: crustL })); // the knee cop under its crust
    nod(lerp(Kp, A, 0.45), W(14), W(30), 4, W(10));
    crev(lerp(Kp, A, 0.5), W(14), W(30), 4);
    sow(lerp(Kp, A, 0.55), W(20), W(36), 10, 3, W(5));
    X.coral(f, add(Kp, [W(20), W(4)]), -0.6 + side * 0.2, W(26), W(7));
    f.bone('foot_' + s2);
    B.boot(f, A, 1, W(60), crustD, { tex: 'mottle113', shaft: 0.25, style: 'sabaton', toe: 1.15 });
    sow(add(A, [W(18), W(30)]), W(24), W(10), 7, 2, W(4.5));
    X.kelp(f, add(A, [-W(14), -W(10)]), W(36), W(5), W(4));
  };
  leg(HF, KF, AF, 1);
  leg(HN, KN, AN, -1);
  // ---- torso: a mass of growth over plate; the shape of the breastplate is gone
  f.bone('pelvis');
  crusted([S.at(-0.92, 0.78), S.at(0.9, 0.78), add(S.at(0.94, 1.0), [W(6), W(24)]), Z([380, 552]), Z([340, 566]), Z([300, 556]), Z([256, 568]), Z([212, 548]), add(S.at(-0.94, 1.0), [-W(6), W(20)])], W(7));
  nod(Z([290, 535]), W(80), W(18), 7, W(12));
  sow(Z([290, 540]), W(90), W(18), 16, 5, W(5));
  crev(Z([290, 540]), W(80), W(16), 6);
  f.bone('torso');
  const torso = crusted(S.shape([[-0.08, 0.44, 0.38], [0.05, 1.08, 0.72], [0.2, 1.2, 1.0], [0.45, 1.08, 1.02], [0.7, 0.98, 0.94], [0.9, 0.96, 0.88], [1.04, 0.92, 0.78], [1.1, 0.72, 0.6]]), W(9));
  nod(S.at(-0.2, 0.4), W(70), W(80), 12, W(16));
  crev(S.at(0, 0.45), W(60), W(70), 12);
  sow(S.at(-0.4, 0.4), W(40), W(70), 26, 6, W(6));
  sow(S.at(0.4, 0.6), W(40), W(50), 14, 4, W(5.5));
  X.verd(f, S.at(0.2, 0.35), W(50), W(50), 10);
  // a strip of original plate where the crust has broken away: steel, pitted
  f.part([S.at(-0.1, 0.62), S.at(0.3, 0.6), S.at(0.34, 0.7), S.at(-0.06, 0.74)], { fill: steel, shadow: steelD, tex: 'mottle113', inkW: 1.4 });
  X.pits(f, S.at(0.12, 0.67), W(20), W(6), 12);
  // belt: a sword belt gone to rope-like weed, a rusted buckle
  f.part([S.at(-0.86, 0.9), S.at(0.84, 0.9), S.at(0.85, 0.97), S.at(-0.87, 0.99)], { fill: '#2a2e24', tex: 'hatch113', texOp: 0.5 });
  f.part([S.at(0.2, 0.89), S.at(0.38, 0.89), S.at(0.38, 0.98), S.at(0.2, 0.98)], { fill: PAL.rust, shade: 0.4, inkW: 1.2, sharp: true });
  for (const u of [-0.7, -0.3, 0.6]) X.kelp(f, S.at(u, 0.96), W(40 + f.r() * 30), W(5), W(4));
  // ---- head: a great helm so overgrown it is a boulder; one round void where an eye-slit was; the gilded crest survives
  f.bone('head');
  const hF = frame(HC, 0.12, W(118));
  crusted(hF([[-0.5, 0.55], [-0.56, 0.0], [-0.48, -0.42], [-0.1, -0.56], [0.32, -0.5], [0.5, -0.2], [0.52, 0.2], [0.44, 0.55], [0.0, 0.66]]), W(7));
  f.part(hF([[0.08, -0.12], [0.2, -0.16], [0.3, -0.1], [0.42, -0.15], [0.5, -0.08], [0.48, 0.06], [0.36, 0.02], [0.24, 0.07], [0.12, 0.02]]), { fill: steel, shadow: steelD, tex: 'mottle113', inkW: 1.3, cast: false, k: 0.6 }); // a broken patch of the visor still bare
  f.flat(hF([[0.1, -0.06], [0.24, -0.06], [0.24, -0.02], [0.1, -0.02]]), '#060505'); // what is left of the eye-slit
  X.voidHole(f, hF([[0.38, -0.04]])[0], W(9), W(9), 0, true); // a clean round void where the other eye should be
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) f.flat(hF(ell([0.32 + c * 0.07, 0.14 + r * 0.08], 0.013, 0.017, 0, 6)), '#060505'); // breaths
  nod(hF([[-0.2, 0.0]])[0], W(30), W(36), 5, W(12));
  sow(hF([[-0.2, 0.0]])[0], W(30), W(40), 20, 4, W(5.5));
  crev(hF([[-0.1, 0.2]])[0], W(30), W(30), 6);
  X.verd(f, hF([[0.3, 0.2]])[0], W(16), W(20), 6);
  X.coral(f, hF([[-0.5, 0.4]])[0], 2.6, W(26), W(7));
  for (const [x, l, sw] of [[-0.3, 50, -6], [0.0, 36, 4]]) X.drip(f, add(X.kelp(f, hF([[x, 0.6]])[0], W(l), W(5), W(sw)), [0, W(6)]), k);
  // crest: the order's cross itself, standing on the helm in drowned gold; one arm snapped short
  const cx0 = hF([[-0.06, -0.5]])[0], up = rot([0, -1], 0.12), rt = rot([1, 0], 0.12);
  const C2 = (u, v) => add(cx0, add(mul(rt, W(u)), mul(up, W(v))));
  f.part([C2(-9, 0), C2(9, 0), C2(8, 64), C2(30, 66), C2(30, 82), C2(8, 82), C2(7, 108), [...C2(0, 116), 1], C2(-7, 108), C2(-8, 82), C2(-18, 82), [...C2(-22, 78), 1], [...C2(-17, 72), 1], C2(-18, 66), C2(-8, 64)], { fill: PAL.gold, shadow: PAL.goldD, tex: 'mottle113', texOp: 0.6, inkW: 1.6, k: 0.6 });
  f.line([C2(-4, 6), C2(-4, 104)], W(1.4), PAL.goldL, { op: 0.6 }); f.line([C2(10, 70), C2(28, 70)], W(1.2), PAL.goldL, { op: 0.6 });
  f.flat(ell(C2(0, 73), W(5), W(5), 0, 8), PAL.goldD); f.flat(ell(C2(0, 73), W(2.2), W(2.2), 0, 6), '#140f08');
  const cr = C2(0, 30);
  X.verd(f, cr, W(10), W(40), 8);
  sow(C2(0, 6), W(22), W(8), 9, 1, W(5));
  // ---- the heater shield held forward on the far arm: crusted to a slab, the order's cross faint through the growth
  f.bone('shield');
  const sh = [add(shC, [-W(56), -W(150)]), add(shC, [W(54), -W(158)]), add(shC, [W(58), -W(40)]), add(shC, [W(40), W(70)]), [...add(shC, [W(4), W(140)]), 1], add(shC, [-W(40), W(72)]), add(shC, [-W(58), -W(40)])];
  f.part([add(shC, [-W(58), -W(146)]), add(shC, [-W(70), -W(140)]), add(shC, [-W(70), -W(40)]), add(shC, [-W(50), W(76)]), add(shC, [-W(40), W(72)]), add(shC, [-W(58), -W(40)])], CR({ fill: crustD })); // shield edge, its thickness
  crusted(sh, W(7), { fill: mix(crust, '#8a8678', 0.3) });
  // the cross, raised and faintly gilt, half buried
  const xc = add(shC, [0, -W(30)]);
  f.part([add(xc, [-W(10), -W(110)]), add(xc, [W(10), -W(112)]), add(xc, [W(10), -W(18)]), add(xc, [W(44), -W(20)]), add(xc, [W(44), W(2)]), add(xc, [W(10), W(2)]), add(xc, [W(8), W(130)]), add(xc, [-W(8), W(132)]), add(xc, [-W(10), W(4)]), add(xc, [-W(46), W(6)]), add(xc, [-W(46), -W(16)]), add(xc, [-W(10), -W(16)])].map(q => [...q, 1]), { fill: mix(PAL.gold, crust, 0.62), shadow: '#3a3a30', tex: 'mottle113', texOp: 0.8, inkW: 0.9, inkHeavy: 1.2, cast: false, opacity: 0.8 });
  X.verd(f, xc, W(30), W(80), 10);
  nod(add(xc, [W(6), W(30)]), W(20), W(60), 6, W(12)); nod(add(xc, [-W(30), -W(4)]), W(10), W(10), 2, W(10));
  sow(add(shC, [-W(20), -W(90)]), W(26), W(30), 14, 3, W(6));
  sow(add(shC, [W(24), W(30)]), W(24), W(50), 16, 4, W(6));
  sow(add(shC, [-W(30), W(30)]), W(14), W(30), 8, 2, W(5));
  crev(add(shC, [0, 0]), W(40), W(100), 10);
  X.coral(f, add(shC, [W(30), -W(140)]), -1.2, W(30), W(8));
  for (const [dx, l, sw] of [[-10, 70, -6], [12, 46, 5], [2, 96, 0]]) X.drip(f, add(X.kelp(f, add(shC, [W(dx), W(120)]), W(l), W(6), W(sw)), [0, W(6)]), k);
  // ---- near arm: the sword shouldered, blade back over the pauldron; the only clean steel on him
  f.bone('upperarm_n');
  crusted(limb(SN, EN, W(58), W(48)), W(6));
  sow(lerp(SN, EN, 0.5), W(20), W(30), 9, 2, W(5));
  f.bone('forearm_n');
  crusted(limb(EN, WN, W(50), W(40)), W(5));
  sow(lerp(EN, WN, 0.4), W(16), W(14), 6, 1, W(4.5));
  // ---- near pauldron: the biggest lump of all, on the torso bone; drawn before the sword so the blade visibly lies on top of it (independent review)
  f.bone('torso');
  const pd = crusted(ell(add(SN, [W(6), -W(4)]), W(50), W(40), -0.3, 12), W(9), { fill: crustL });
  nod(add(SN, [0, -W(6)]), W(36), W(24), 7, W(13));
  sow(add(SN, [0, -W(10)]), W(40), W(26), 18, 5, W(6.5));
  crev(SN, W(30), W(20), 5);
  X.coral(f, add(SN, [-W(36), -W(14)]), -2.4, W(34), W(9));
  X.verd(f, add(SN, [W(10), W(10)]), W(30), W(16), 6);
  f.bone('sword');
  const tip = add(WN, rot([W(262), 0], sA)), gd = add(WN, rot([W(16), 0], sA)), pom = add(WN, rot([-W(30), 0], sA));
  f.part([add(gd, rot([0, -W(10)], sA)), add(gd, rot([W(210), -W(7)], sA)), tip, add(gd, rot([W(210), W(7)], sA)), add(gd, rot([0, W(10)], sA))], { fill: steel, shadow: steelD, tex: 'mottle113', texOp: 0.5, inkW: 1.5 });
  f.line([add(gd, rot([W(4), 0], sA)), add(gd, rot([W(200), 0], sA))], 1.6, INK, { op: 0.6 }); // fuller
  f.line([add(gd, rot([W(4), -W(6)], sA)), add(gd, rot([W(200), -W(5)], sA))], W(1.2), '#c8d0d0', { op: 0.6 });
  X.pits(f, lerp(gd, tip, 0.5), W(60), W(10), 16);
  X.barnacles(f, lerp(gd, tip, 0.78), W(8), W(6), 4, W(3.5)); // a few barnacles even on the blade
  f.part([add(gd, rot([0, -W(34)], sA)), add(gd, rot([W(6), -W(34)], sA)), add(gd, rot([W(6), W(34)], sA)), add(gd, rot([0, W(34)], sA))].map(q => [...q, 1]), { fill: steelD, tex: 'mottle113', inkW: 1.3 }); // cross guard
  f.part(limb(pom, gd, W(13), W(12), { steps: 4 }), { fill: '#2a2620', inkW: 1.2, cast: false });
  f.part(ell(pom, W(12), W(12), 0, 12), { fill: steelD, tex: 'mottle113', inkW: 1.3, cast: false });
  X.verd(f, pom, W(8), W(8), 3);
  f.bone('hand_n');
  B.grip(f, WN, EN, sA, W(28), crustD, { plate: true, cuff: true, tex: 'mottle113', texOp: 0.7, name: 'knight sword' });
  X.barnacles(f, WN, W(12), W(10), 5, W(4));
  return f;
}

// ------------------------------------------------------------------ ANCHOR BRUTE (large, 1.6)
// A drowned dock porter grown huge: a hump of shoulder and back, a small head sunk low between them, the near fist down
// on its knuckles. An anchor chain runs through the meat of his far forearm, in at the wrist and out at the elbow; the
// anchor lies in front of him on its slack, ready to be dragged and swung. The tail of the chain loops over his back.
function anchorBrute() {
  const [Wc, Hc] = K.TIERS.large, GY = Hc - 30;
  const { Z, ZZ, W, k } = X.space(1.6, 292, GY);
  const f = new Fig(K.foeBase(114, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 640])[1] })));
  const skin = '#aaac9e', skinS = '#575b6a', skinL = '#c4c4b4', iron = '#3e3632', leather = '#4a3626', canvas = '#5e5a48';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'flesh114', texOp: 0.55 }, o);
  X.skinDefs(f);
  const dk = mix(skinS, '#000', 0.3), vein = '#4a4c7a', liv = '#5e4c66', scar = '#cdc4b4';
  const A = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  const flesh = (pts, ang, look, pools = [], wr = 0.4) => f.part(pts, Object.assign({}, look, { over: X.skinOver(f, pts, ang, { wr, pools }) }));
  const pool = (c, rx, ry, op = 0.4, col = liv) => [c, rx, ry, col, op];
  // massive porter's arms from muscle profiles: deltoid, biceps and triceps bellies, a narrow elbow with its point,
  // a forearm swelling hard below the elbow and tapering to a thick wrist. One outline per arm, split at the elbow.
  const UAp = [[0, W(50)], [0.22, W(52)], [0.48, W(44)], [0.72, W(41)], [0.92, W(32)], [1, W(30)]], UAq = [[0, W(46)], [0.2, W(39)], [0.38, W(38)], [0.6, W(45)], [0.82, W(36)], [1, W(30)]];
  const FAp = [[0, W(30)], [0.15, W(41)], [0.35, W(40)], [0.7, W(30)], [1, W(25)]], FAq = [[0, W(30)], [0.12, W(43)], [0.3, W(41)], [0.65, W(31)], [1, W(25)]];
  const ARM = (Sx, Ex, Wx, ub, look, pools) => {
    const ed = X.jdir(Sx, Ex, Wx), am = X.mchain([Sx, Ex, Wx], [[UAp, UAq], [FAp, FAq]], { knob: [1.1] });
    X.split(f, () => flesh(am, A(Sx, Ex), look, pools, 0.36), [['upperarm_' + ub, X.side(Ex, mul(ed, -1), W(30))], ['forearm_' + ub, X.side(Ex, ed, W(30))]]);
    f.bone('upperarm_' + ub);
    const del = [lp(Sx, Ex, -0.16, 0), lp(Sx, Ex, -0.06, W(54)), lp(Sx, Ex, 0.24, W(56)), [...lp(Sx, Ex, 0.5, W(10)), 1], lp(Sx, Ex, 0.26, -W(44)), lp(Sx, Ex, -0.04, -W(48))];
    flesh(del, A(Sx, Ex), Object.assign({}, look, { inkW: 0, cast: false, shade: 0.28 }), [], 0.3);
    f.line([lp(Sx, Ex, 0.24, W(56)), lp(Sx, Ex, 0.42, W(30)), lp(Sx, Ex, 0.5, W(10)), lp(Sx, Ex, 0.36, -W(26)), lp(Sx, Ex, 0.26, -W(44))], 1.8, INK, { op: 0.75 }); // deltoid's lower edge
    X.groove(f, [lp(Sx, Ex, 0.5, W(14)), lp(Sx, Ex, 0.7, W(18)), lp(Sx, Ex, 0.9, W(10))], W(4), dk, 0.45); // biceps / triceps division
    f.line([lp(Sx, Ex, 0.52, -W(36)), lp(Sx, Ex, 0.68, -W(40)), lp(Sx, Ex, 0.84, -W(32))], 1.8, mix(look.fill, '#fff', 0.35), { op: 0.5 }); // biceps catching light
    f.stroke([lp(Sx, Ex, 0.3, -W(30)), lp(Sx, Ex, 0.55, -W(24)), lp(Sx, Ex, 0.7, -W(14)), lp(Sx, Ex, 0.78, -W(2))], W(3), vein, { op: 0.55 }); // cephalic vein
    for (let i = 0; i < 4; i++) f.line([lp(Sx, Ex, 0.3 + i * 0.07, W(14)), lp(Sx, Ex, 0.34 + i * 0.07, W(40))], 1, '#e8e4d8', { op: 0.45 }); // stretch marks
    f.bone('forearm_' + ub);
    f.flat(ell(lp(Ex, Sx, 0.0, W(26)), W(14), W(12), 0, 10), mix(look.fill, '#fff', 0.25), { op: 0.35 }); // elbow point
    X.creases(f, lp(Ex, Sx, 0.02, W(22)), A(Sx, Ex) + 1.4, W(22), 4, dk, 0.6);
    X.creases(f, lp(Ex, Sx, 0.0, -W(22)), A(Sx, Ex) + 1.2, W(20), 3, dk, 0.55); // inside of the elbow
    X.groove(f, [lp(Ex, Wx, 0.06, -W(18)), lp(Ex, Wx, 0.3, -W(24)), lp(Ex, Wx, 0.62, -W(12))], W(3.4), dk, 0.45); // brachioradialis
    X.groove(f, [lp(Ex, Wx, 0.1, W(16)), lp(Ex, Wx, 0.4, W(18)), lp(Ex, Wx, 0.72, W(8))], W(3), dk, 0.4);
    f.stroke([lp(Ex, Wx, 0.1, -W(6)), lp(Ex, Wx, 0.35, -W(12)), lp(Ex, Wx, 0.58, -W(4)), lp(Ex, Wx, 0.82, -W(8))], W(3.2), vein, { op: 0.6 }); // a rope of vein down the forearm
    f.stroke([lp(Ex, Wx, 0.35, -W(12)), lp(Ex, Wx, 0.5, -W(20)), lp(Ex, Wx, 0.66, -W(18))], W(2.2), vein, { op: 0.5 });
    for (let i = 0; i < 3; i++) f.line([lp(Ex, Wx, 0.72 + i * 0.08, -W(10) + i * W(8)), lp(Ex, Wx, 0.96, -W(8) + i * W(8))], 1.3, mix(look.fill, '#fff', 0.35), { op: 0.5 }); // wrist tendons
  };
  // an old scar: a raised pale welt with stitch ticks
  const scarL = pts => { f.line(pts, W(3.4), scar, { op: 0.8 }); f.line(pts, 1, '#5a3a36', { op: 0.7 }); for (let i = 1; i < pts.length; i++) { const q = lerp(pts[i - 1], pts[i], 0.5), d = E.norm(sub(pts[i], pts[i - 1])), n = [-d[1], d[0]]; f.line([add(q, mul(n, W(4))), add(q, mul(n, -W(4)))], 1, '#3a2420', { op: 0.7 }); } };
  const S = B.spine(Z([352, 340]), Z([246, 318]), Z([250, 524]), W(100));
  const P = Z([250, 524]), HC = Z([410, 364]), hAng = 0.16, HH = W(92);
  const SN = S.at(-0.24, 0.18), SF = S.at(0.7, 0.22);
  const EN = Z([300, 536]), WN = Z([350, 726]), FNk = Z([358, 758]);
  const EF = Z([430, 506]), WF = Z([458, 640]);
  const HN = S.at(-0.4, 0.98), KN = Z([212, 650]), AN = Z([202, 756]);
  const HF = S.at(0.36, 0.96), KF = Z([314, 648]), AF = Z([326, 756]);
  const ringP = Z([502, 708]), crown = Z([630, 778]);

  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.3, 0.02), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('chain', WF, 'forearm_f').joint('anchor', ringP, 'chain').joint('chain_tail', EF, 'forearm_f').joint('chain_back', Z([350, 330]), 'torso');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');

  X.puddle(f, Z([330, 794]), W(200));
  // ---- the chain's tail, out of the elbow, up over the hump and down his back (behind everything)
  f.bone('chain_back');
  X.chainLinks(f, ZZ([[350, 330], [270, 236], [196, 262], [160, 340], [150, 440], [156, 540], [146, 640]]), W(9), iron, { rust: PAL.rust });
  f.bone('chain_tail');
  X.chainLinks(f, ZZ([[424, 500], [400, 440], [356, 340]]), W(9), iron, { rust: PAL.rust });
  // ---- far leg: short, bowed, trousers rolled to the knee, bare swollen foot
  const leg = (H0, Kp, A, side, tint) => {
    const s2 = side > 0 ? 'f' : 'n';
    f.bone('shin_' + s2);
    K.bareLeg(f, lerp(Kp, A, 0.3), A, 1, W(62), W(56), SK({ fill: mix(skin, skinS, tint) }), { swell: 1 });
    X.livid(f, lerp(Kp, A, 0.62), W(16), W(20), 5); X.veins(f, lerp(Kp, A, 0.55), W(14), W(16), 3);
    f.bone('thigh_' + s2);
    f.part(K.chain([H0, Kp, lerp(Kp, A, 0.36)], [W(92), W(70), W(64)], side > 0 ? { bq: [[0, 0.3, 0.14]] } : { bp: [[0, 0.3, 0.14]] }), { fill: side > 0 ? mix(canvas, '#000', 0.15) : canvas, tex: 'weave114', shadow: '#2a281c' });
    const cu = lerp(Kp, A, 0.34), d = E.norm(sub(A, Kp)), n = [-d[1], d[0]];
    f.part([add(cu, mul(n, W(38))), add(cu, mul(n, -W(38))), add(add(cu, mul(n, -W(36))), mul(d, W(14))), [...add(add(cu, mul(n, -W(10))), mul(d, W(10))), 1], add(add(cu, mul(n, W(10))), mul(d, W(16))), [...add(add(cu, mul(n, W(36))), mul(d, W(12))), 1]], { fill: mix(canvas, '#fff', 0.08), tex: 'weave114', shadow: '#2a281c' }); // rolled, torn cuff
    f.stroke([lp(H0, Kp, 0.8, -W(24) * side), lp(H0, Kp, 0.98, 0), lp(Kp, A, 0.12, W(22) * side)], W(2.6));
    X.mussel(f, add(cu, [-W(10), -W(4)]), 0.4, k); X.mussel(f, add(cu, [W(8), -W(6)]), -0.3, k);
  };
  leg(HF, KF, AF, 1, 0.12);
  // ---- far arm, the chain arm: hangs forward; chain in at the wrist, out at the elbow
  ARM(SF, EF, WF, 'f', SK({ fill: mix(skin, skinS, 0.12) }), [pool(lp(SF, EF, 0.5, W(24)), W(30), W(40), 0.4), pool(lp(EF, WF, 0.5, W(18)), W(24), W(36), 0.4)]);
  f.bone('forearm_f');
  // the links show as a ridge under the skin between the wounds
  // a torn split along the forearm where the links show through the meat
  const fa = Math.atan2(WF[1] - EF[1], WF[0] - EF[0]);
  f.part([lp(EF, WF, 0.12, -W(4)), lp(EF, WF, 0.3, -W(10)), lp(EF, WF, 0.55, -W(12)), lp(EF, WF, 0.8, -W(8)), lp(EF, WF, 0.9, -W(2)), lp(EF, WF, 0.8, W(8)), lp(EF, WF, 0.55, W(11)), lp(EF, WF, 0.3, W(9))], { fill: '#5a2a26', shadow: '#1a0a0a', shade: 0.5, inkW: 1.3, cast: false, hatch: false });
  X.chainLinks(f, [lp(EF, WF, 0.14, 0), lp(EF, WF, 0.88, 0)], W(6.5), iron, { rust: PAL.rust });
  for (let i = 0; i < 7; i++) { const t = 0.16 + i * 0.11, sd2 = i % 2 ? 1 : -1; f.line([lp(EF, WF, t, sd2 * W(9)), lp(EF, WF, t + 0.03, sd2 * W(15))], 1.2, INK, { op: 0.7 }); } // torn skin edges
  f.flat(ell(lp(EF, WF, 0.5, W(2)), W(10), W(60), Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) + 1.57, 12), PAL.rust, { op: 0.3 }); // rust bleeding through the skin
  const wound = (c, a) => { f.part(ell(c, W(15), W(11), a, 12), SK({ fill: '#8a6a62', cast: false })); f.flat(ell(c, W(9), W(6), a, 12), '#2a1414'); for (let i = 0; i < 6; i++) { const q = add(c, rot([W(14), 0], a + i * 1.05)); f.line([q, add(c, rot([W(9), 0], a + i * 1.05))], 1.2, INK, { op: 0.7 }); } };
  wound(lp(EF, WF, 0.06, 0), 0.3);
  // ---- torso: a mountain of drowned muscle; leather porter's pad over the hump, harness strap across the chest
  f.bone('torso');
  const torso = S.shape([[-0.24, 0.34, 0.4], [-0.08, 0.96, 0.8], [0.08, 1.24, 1.08], [0.26, 1.24, 1.22], [0.46, 1.0, 1.16], [0.66, 0.82, 1.06], [0.84, 0.76, 0.92], [1.0, 0.76, 0.7], [1.06, 0.6, 0.5]]);
  flesh(torso, -1.2, SK(), [pool(S.at(0.6, 0.6), W(60), W(40), 0.4), pool(S.at(0.7, 0.9), W(50), W(20), 0.45), pool(S.at(-0.4, 0.7), W(40), W(30), 0.3)], 0.32);
  // the hump is muscle, not a dome: trapezius slab, the shoulder blade's ridge, the spine's groove, lats, a fat fold
  X.groove(f, [S.at(-0.98, -0.02), S.at(-1.2, 0.2), S.at(-1.18, 0.46), S.at(-1.02, 0.7), S.at(-0.84, 0.9)], W(5), dk, 0.4); // spine groove
  X.groove(f, [S.at(-0.3, 0.12), S.at(-0.62, 0.2), S.at(-0.9, 0.36)], W(4.4), dk, 0.45); // trapezius's lower edge
  X.groove(f, [S.at(-0.6, 0.26), S.at(-0.76, 0.42), S.at(-0.66, 0.56), S.at(-0.44, 0.6)], W(4), dk, 0.42); // shoulder blade
  f.line([S.at(-0.66, 0.28), S.at(-0.8, 0.42), S.at(-0.72, 0.52)], 1.8, mix(skin, '#fff', 0.35), { op: 0.5 });
  X.groove(f, [S.at(-0.2, 0.5), S.at(-0.3, 0.68), S.at(-0.6, 0.82)], W(4), dk, 0.4); // lat
  for (let i = 0; i < 3; i++) f.stroke([S.at(0.3 + i * 0.12, 0.84 + i * 0.02), S.at(0.5 + i * 0.1, 0.88 + i * 0.02), S.at(0.7 + i * 0.06, 0.86 + i * 0.02)], W(2.6), dk, { op: 0.4 }); // fat folds over the apron
  X.wet(f, [S.at(-1.0, 0.0), S.at(-1.18, 0.16), S.at(-1.22, 0.36), S.at(-1.14, 0.56)], 1.8);
  scarL([S.at(-0.4, 0.38), S.at(-0.2, 0.44), S.at(0.0, 0.42)]);
  f.stroke([S.at(0.7, 0.2), S.at(0.6, 0.4), S.at(0.76, 0.56)], W(3.4), mix(skinS, '#000', 0.2), { op: 0.55 }); // pec edge
  f.stroke([S.at(0.86, 0.62), S.at(0.8, 0.8), S.at(0.6, 0.94)], W(3), mix(skinS, '#000', 0.2), { op: 0.5 }); // belly overhang
  for (let i = 0; i < 4; i++) f.line([S.at(0.88 - i * 0.05, 0.64 + i * 0.05), S.at(0.96 - i * 0.05, 0.7 + i * 0.05)], 1, '#e8e4d8', { op: 0.5 }); // stretch marks
  f.line([S.at(0.92, 0.72), S.at(0.96, 0.76), S.at(0.92, 0.8)], 1.6, INK, { op: 0.7 }); // navel
  X.livid(f, S.at(0.4, 0.6), W(60), W(50), 12); X.veins(f, S.at(0.6, 0.5), W(40), W(40), 6); X.peel(f, S.at(0.2, 0.7), 4, k);
  X.livid(f, S.at(-0.5, 0.4), W(50), W(60), 14); X.veins(f, S.at(-0.4, 0.5), W(40), W(50), 6); X.peel(f, S.at(-0.6, 0.6), 4, k);
  for (let i = 0; i < 3; i++) f.stroke([S.at(-0.2 + i * 0.12, 0.0), S.at(0.0 + i * 0.12, 0.3 + i * 0.02), S.at(0.3 + i * 0.1, 0.56)], W(2.2), '#c8b8a8', { op: 0.5 }); // old rope-burn scars where the loads rode
  for (const [u, v, a] of [[-0.3, 0.7, 0.4], [-0.2, 0.74, 1.2], [0.1, 0.84, -0.3]]) X.mussel(f, S.at(u, v), a, k);
  for (const [u, v, r] of [[-0.8, 0.5, 16], [-0.9, 0.2, 12], [-0.6, 0.66, 10], [-1.0, 0.36, 9]]) f.flat(ell(S.at(u, v), W(r), W(r * 0.7), f.r() * 3, 10), '#6e6a8e', { op: 0.45 }); // pooled lividity on the hump
  for (let i = 0; i < 3; i++) f.stroke([S.at(-1.0 + i * 0.06, 0.56 + i * 0.08), S.at(-0.8 + i * 0.06, 0.6 + i * 0.08), S.at(-0.6 + i * 0.06, 0.58 + i * 0.08)], W(2.4), mix(skinS, '#000', 0.25), { op: 0.5 }); // swollen folds of the back
  X.barnacles(f, S.at(-1.04, 0.14), W(14), W(30), 9, W(6));
  // porter's pad: thick stitched leather over the hump, a strap to a ring at the chest
  const pad = [S.at(-1.0, 0.06), S.at(-0.84, -0.12), S.at(-0.3, -0.16), S.at(0.16, -0.08), S.at(0.24, 0.08), S.at(-0.1, 0.16), S.at(-0.6, 0.22), S.at(-0.98, 0.22)];
  f.part(pad, { fill: leather, shadow: '#1e140e', tex: 'mottle114', texOp: 0.6 });
  f.stitches([S.at(-0.9, 0.0), S.at(-0.5, -0.1), S.at(0.06, -0.04)], '#a08a60', 1);
  f.stitches([S.at(-0.9, 0.16), S.at(-0.4, 0.12), S.at(0.1, 0.06)], '#a08a60', 1);
  f.part([S.at(-0.5, -0.06), S.at(-0.24, -0.08), S.at(-0.24, 0.08), S.at(-0.5, 0.1)], { fill: mix(leather, '#000', 0.25), inkW: 1.1, cast: false, sharp: true }); // patch
  X.barnacles(f, S.at(-0.9, 0.3), W(26), W(30), 12, W(6.5)); // crusting the hump of the back
  X.barnacles(f, S.at(-0.6, -0.06), W(20), W(8), 6, W(5));
  X.voidHole(f, S.at(-0.7, 0.44), W(11), W(10), 0.2, true); // a clean round hole through the back
  f.part([S.at(0.14, -0.04), S.at(0.26, 0.0), S.at(0.86, 0.5), S.at(0.76, 0.54)], { fill: leather, shadow: '#1e140e', inkW: 1.2, cast: false }); // strap across the chest
  K.ring(f, S.at(0.8, 0.5), W(9), W(9), W(3) + 2, INK); K.ring(f, S.at(0.8, 0.5), W(9), W(9), W(3), iron);
  f.stroke([S.at(-0.6, 0.3), S.at(-0.8, 0.5), S.at(-0.7, 0.72)], W(3), mix(skinS, '#000', 0.2), { op: 0.45 }); // lat edge
  // sackcloth apron and rope belt slung under the belly; a porter's hook on the belt
  f.bone('pelvis');
  f.part([S.at(-1.0, 0.86), S.at(0.7, 0.92), add(S.at(0.7, 1.0), [W(10), W(30)]), [...Z([360, 612]), 1], Z([330, 596]), [...Z([300, 620]), 1], Z([264, 600]), [...Z([230, 618]), 1], Z([196, 590]), add(S.at(-1.0, 1.0), [-W(6), W(16)])], { fill: '#6e6650', tex: 'weave114', texOp: 0.5, shadow: '#2a281c' });
  f.part([S.at(-1.0, 0.84), S.at(0.78, 0.9), S.at(0.79, 0.97), S.at(-1.0, 0.93)], { fill: '#8a7a58', tex: 'hatch114', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 12; i++) f.line([S.at(-0.94 + i * 0.15, 0.84 + i * 0.005), S.at(-0.9 + i * 0.15, 0.93 + i * 0.004)], 1, INK, { op: 0.6 });
  const hk0 = S.at(-0.7, 0.92);
  f.part(limb(hk0, add(hk0, [0, W(30)]), W(14), W(12), { steps: 4 }), { fill: '#5a4030', tex: 'wood114', inkW: 1.2, cast: false }); // hook handle
  f.line([add(hk0, [0, W(30)]), add(hk0, [0, W(46)]), add(hk0, [W(10), W(62)]), add(hk0, [W(22), W(56)]), add(hk0, [W(20), W(46)])], W(4) + 2, INK); f.line([add(hk0, [0, W(30)]), add(hk0, [0, W(46)]), add(hk0, [W(10), W(62)]), add(hk0, [W(22), W(56)]), add(hk0, [W(20), W(46)])], W(4), iron); // porter's hook
  for (const [u, a] of [[0.4, 0.3], [0.5, -0.5], [-0.2, 0.9]]) X.mussel(f, S.at(u, 0.95), a, k);
  X.verd(f, Z([280, 600]), W(60), W(14), 6, '#4a6a5a');
  // ---- near leg
  leg(HN, KN, AN, -1, 0);
  // ---- head: small, sunk low between the shoulders, swollen, jaw slack; a sodden porter's rag tied round the skull
  f.bone('head');
  { const nk = limb(S.at(0.2, 0.0), add(HC, [-W(20), W(16)]), W(84), W(62)); flesh(nk, 0.5, SK(), [pool(add(HC, [-W(10), W(46)]), W(30), W(10), 0.4)], 0.5); }
  X.groove(f, [S.at(0.1, -0.02), add(HC, [-W(30), W(30)]), add(HC, [-W(12), W(36)])], W(3), dk, 0.45); // the thick neck muscle
  const hF = frame(HC, hAng, HH);
  B.head(f, HC, HH, hAng, { skin, jaw: 1.45, chin: 0.04, nose: 1.0, hook: 0.08, browOut: 0.05, mouth: 'set', squint: 0.45, noEar: false, browDown: 0.14, browW: 0.06, faceShade: 0.45, jawShade: 0.45, age: true, iris: '#c8cec6', eyeWhite: '#d6d8ce', browCol: '#3a3a32', hairCol: '#3a3a30', scar: [[0.06, -0.32], [0.14, -0.14], [0.2, 0.06], [0.24, 0.2]] });
  // skull drawn over the face plate's back edge with no ink of its own: a low, broad brute's skull, not a ball
  const skull = hF([[0.2, -0.44], [-0.1, -0.5], [-0.4, -0.42], [-0.56, -0.2], [-0.58, 0.08], [-0.5, 0.3], [-0.34, 0.4], [-0.2, 0.3], [-0.14, 0.04], [-0.16, -0.24], [0.0, -0.38]]);
  flesh(skull, hAng, SK({ inkW: 0, cast: false, shade: 0.22 }), [pool(hF([[-0.44, 0.2]])[0], W(16), W(12), 0.35)], 0.35);
  f.line(hF([[-0.42, -0.42], [-0.57, -0.2], [-0.59, 0.08], [-0.5, 0.31], [-0.34, 0.41]]), 2.2, INK);
  f.flat(hF([[-0.55, -0.12], [-0.57, 0.1], [-0.48, 0.3], [-0.36, 0.38], [-0.42, 0.12], [-0.48, -0.06]]), skinS, { op: 0.4 });
  // jowls and the swollen slab of the jaw, a thick fold of neck under it
  f.part(hF([[-0.2, 0.3], [0.0, 0.46], [0.18, 0.54], [0.3, 0.56], [0.2, 0.64], [-0.04, 0.6], [-0.24, 0.46]]), SK({ cast: false, inkW: 0, shade: 0.4, fill: mix(skin, skinS, 0.15) }));
  f.line(hF([[-0.04, 0.6], [0.2, 0.64], [0.3, 0.57]]), 1.6, INK, { op: 0.7 });
  // cauliflower ear: lumpy, thickened by years of loads on the shoulder
  f.part(hF([[-0.17, -0.1], [-0.24, -0.11], [-0.29, -0.04], [-0.27, 0.02], [-0.3, 0.08], [-0.25, 0.15], [-0.18, 0.13], [-0.16, 0.03]]), SK({ fill: mix(skin, '#8a6a6a', 0.18), cast: false, inkW: 1.2, inkHeavy: 1.6, shade: 0.45 }));
  f.line(hF([[-0.19, -0.07], [-0.25, -0.05], [-0.24, 0.02], [-0.26, 0.08], [-0.21, 0.1]]), 1.2, dk, { op: 0.75 }); // cauliflower ear: the helix thickened into lumps
  f.flat(hF(ell([-0.2, 0.03], 0.012, 0.02, 0.2, 6)), '#1a1418', { op: 0.85 });
  // brow ridge like a shelf over small sunk eyes, a flattened broken nose, the swollen cheek
  f.flat(hF([[0.04, -0.15], [0.38, -0.165], [0.36, -0.12], [0.06, -0.11]]), '#2a2830', { op: 0.28 });
  f.line(hF([[0.04, -0.18], [0.22, -0.21], [0.42, -0.17]]), 2, mix(skin, '#fff', 0.3), { op: 0.55 });
  for (const x of [0.26, 0.29, 0.32]) f.line(hF([[x, -0.25], [x + 0.01, -0.17]]), 1.1, dk, { op: 0.6 });
  for (let i = 0; i < 3; i++) f.line(hF([[0.02, -0.3 - i * 0.06], [0.18, -0.32 - i * 0.06], [0.34, -0.3 - i * 0.05]]), 1, dk, { op: 0.5 });
  f.line(hF([[0.36, -0.02], [0.4, 0.04], [0.37, 0.08]]), 1.4, INK, { op: 0.7 }); // the old break in the nose
  f.flat(hF(ell([0.08, 0.16], 0.15, 0.12, 0, 12)), '#d4d6c8', { op: 0.25 }); // swollen cheek
  // the slack mouth: blue lips hanging open on a few teeth, water running out of it
  f.flat(hF([[0.15, 0.27], [0.24, 0.262], [0.33, 0.276], [0.31, 0.34], [0.22, 0.352], [0.16, 0.32]]), '#5a6478');
  f.flat(hF([[0.17, 0.284], [0.24, 0.278], [0.3, 0.29], [0.29, 0.32], [0.23, 0.33], [0.18, 0.31]]), '#0c1012');
  for (const q of [[0.2, 0.29], [0.255, 0.288]]) f.flat(hF(ell(q, 0.012, 0.013, 0, 6)), '#a8a28a'); // a couple of teeth left
  f.stroke(hF([[0.16, 0.33], [0.23, 0.36], [0.31, 0.335]]), HH * 0.03, '#4a5266'); // heavy hanging lower lip
  for (let i = 0; i < 26; i++) { const q = [-0.05 + f.r() * 0.32, 0.36 + f.r() * 0.18]; f.line(hF([q, [q[0] + 0.01, q[1] + 0.012]]), 1, '#3a3a34', { op: 0.4 }); } // stubble
  X.livid(f, hF([[0.0, 0.1]])[0], W(14), W(10), 4);
  f.part(hF([[-0.46, 0.08], [-0.54, -0.2], [-0.38, -0.46], [-0.04, -0.56], [0.26, -0.5], [0.38, -0.3], [0.22, -0.27], [-0.04, -0.32], [-0.26, -0.18], [-0.32, 0.14]]), { fill: '#5a5442', tex: 'weave114', texOp: 0.5, shadow: '#26241a' }); // rag
  for (let i = 0; i < 4; i++) f.stroke(hF([[-0.3 + i * 0.16, -0.5], [-0.24 + i * 0.16, -0.38], [-0.28 + i * 0.16, -0.26]]), W(2.4), '#26241a', { op: 0.5 });
  f.part(hF([[-0.5, -0.06], [-0.64, 0.02], [-0.76, 0.3], [-0.66, 0.34], [-0.58, 0.12], [-0.48, 0.08]]), { fill: '#5a5442', tex: 'weave114', inkW: 1.1 }); // knot tail, hanging
  X.drip(f, hF([[0.24, 0.48]])[0], k); X.drip(f, hF([[-0.66, 0.4]])[0], k);
  X.barnacles(f, S.at(0.1, -0.06), W(16), W(8), 5, W(5));
  // ---- the anchor, stood on its crown with one fluke bitten into the ground, held up by the chain: shank, stock,
  // ring, two flukes; rusted, barnacled
  f.bone('anchor');
  const sd = E.norm(sub(crown, ringP)), sn = [-sd[1], sd[0]], sL = E.len(sub(crown, ringP));
  const A2 = (u, v) => add(add(ringP, mul(sd, u * sL)), mul(sn, v * sL));
  f.part(X.mlimb(A2(0.04, 0), A2(0.9, 0), [[0, W(19)], [0.1, W(17)], [0.5, W(19)], [0.85, W(24)], [1, W(24)]], [[0, W(19)], [0.1, W(17)], [0.5, W(19)], [0.85, W(24)], [1, W(24)]]), { fill: iron, shadow: '#100c0c', tex: 'mottle114', texOp: 0.7 });
  f.line([A2(0.12, -0.05), A2(0.5, -0.06), A2(0.84, -0.075)], 2, '#8a7a6a', { op: 0.5 }); // worn edge catching light
  for (let i = 0; i < 5; i++) { const q = A2(0.2 + i * 0.14, 0.02); f.line([q, add(q, [W(2), W(16 + f.r() * 14)])], W(2), PAL.rust, { op: 0.5 }); } // rust weeping down the shank
  f.part([A2(0.08, -0.46), A2(0.08, 0.46), A2(0.15, 0.48), A2(0.15, -0.48)].map(q => [...q, 1]), { fill: '#4a3a2c', tex: 'wood114', inkW: 1.4 }); // wooden stock
  for (const v of [-0.36, 0.36]) f.part([A2(0.07, v - 0.04), A2(0.07, v + 0.04), A2(0.16, v + 0.04), A2(0.16, v - 0.04)].map(q => [...q, 1]), { fill: iron, inkW: 1.1, cast: false }); // iron bands
  // arms curving up from the crown to spade-shaped flukes
  const arm = side => [A2(0.86, 0), A2(0.98, side * 0.16), A2(0.94, side * 0.34), A2(0.8, side * 0.48), A2(0.62, side * 0.54), [...A2(0.5, side * 0.6), 1], A2(0.56, side * 0.44), A2(0.66, side * 0.32), A2(0.6, side * 0.26), A2(0.76, side * 0.3), A2(0.86, side * 0.18), A2(0.82, 0)];
  f.part(arm(1), { fill: mix(iron, '#000', 0.2), shadow: '#141010', tex: 'mottle114', texOp: 0.7 });
  f.part(arm(-1), { fill: iron, shadow: '#141010', tex: 'mottle114', texOp: 0.7 });
  f.part(ell(A2(0.94, 0), W(27), W(23), 0, 12), { fill: iron, shadow: '#100c0c', tex: 'mottle114' });
  K.ring(f, A2(-0.06, 0), W(24), W(18), W(9) + 2.4, INK, { ang: Math.atan2(sd[1], sd[0]) }); K.ring(f, A2(-0.06, 0), W(24), W(18), W(9), iron, { ang: Math.atan2(sd[1], sd[0]) });
  X.verd(f, A2(0.45, 0), W(30), W(10), 6, PAL.rust); X.verd(f, A2(0.78, -0.34), W(10), W(10), 3, PAL.rust); // rust blooms, weeping
  X.pits(f, A2(0.45, 0), W(10), W(40), 20);
  X.barnacles(f, A2(0.84, -0.3), W(20), W(14), 9, W(5));
  X.barnacles(f, A2(0.5, 0.0), W(8), W(16), 4, W(4));
  X.voidHole(f, A2(0.66, 0.46), W(7), W(6), 0, false); // a clean void hole through one fluke
  X.kelp(f, A2(0.12, -0.44), W(50), W(6), W(4)); X.kelp(f, A2(0.12, 0.4), W(36), W(5), -W(3));
  f.flat(ell(Z([600, 790]), W(80), W(6), 0, 12), '#1a1814', { op: 0.55 }); // the furrow it has dragged in the floor
  for (const [x0, l] of [[540, 70], [556, 50], [572, 60]]) f.line([Z([x0, 788]), Z([x0 + l, 789])], 1.2, '#5a5a52', { op: 0.6 }); // scrape marks
  for (const [x, y] of [[652, 782], [664, 786], [600, 784], [690, 788]]) f.part(ZZ([[x - 5, y + 2], [x - 2, y - 4], [x + 5, y - 2], [x + 4, y + 3]]), { fill: '#4a4a44', inkW: 1, inkHeavy: 1.2, cast: false, sharp: true }); // flagstone chips kicked up where the fluke bit
  // ---- the chain from the wrist down to the anchor ring, slack, a loop on the ground
  f.bone('chain');
  X.chainLinks(f, ZZ([[462, 652], [482, 682], [496, 700]]), W(9), iron, { rust: PAL.rust }); // taut: the anchor leans on its crown, its ring held up by the chain
  // far hand: swollen fist round the chain where it goes in
  f.bone('hand_f');
  wound(lp(EF, WF, 0.94, 0), 0.3);
  B.grip(f, add(WF, [W(4), W(26)]), EF, Math.PI / 2 + 0.2, W(32), mix(skin, skinS, 0.1), { shadow: skinS, tex: 'mottle114', inline: true, name: 'brute chain hand' }); // the chain runs on through the closed fist
  X.peel(f, add(WF, [0, W(26)]), 3, k);
  // ---- near arm: hangs to the ground, the fist down on its knuckles (it now reaches the stones)
  ARM(SN, EN, WN, 'n', SK(), [pool(lp(SN, EN, 0.55, W(26)), W(30), W(50), 0.45), pool(lp(EN, WN, 0.6, W(16)), W(26), W(44), 0.45)]);
  f.bone('upperarm_n');
  X.barnacles(f, lp(SN, EN, 0.1, W(28)), W(20), W(14), 8, W(6));
  scarL([lp(SN, EN, 0.4, -W(20)), lp(SN, EN, 0.52, -W(4)), lp(SN, EN, 0.6, W(16))]); // an old hook gash, stitched
  X.peel(f, lp(SN, EN, 0.75, W(10)), 3, k);
  f.bone('forearm_n');
  for (let i = 0; i < 3; i++) f.stroke([lp(EN, WN, 0.2 + i * 0.12, -W(34)), lp(EN, WN, 0.28 + i * 0.12, 0), lp(EN, WN, 0.34 + i * 0.12, W(30))], W(3), scar, { op: 0.45 }); // rope-burn scars
  for (let i = 0; i < 5; i++) f.line([lp(EN, WN, 0.74 + i * 0.045, -W(26)), lp(EN, WN, 0.76 + i * 0.045, W(26))], W(3.2), '#8a7a58', { straight: true }); // porter's rope wrist wrap
  for (let i = 0; i < 5; i++) f.line([lp(EN, WN, 0.74 + i * 0.045, -W(26)), lp(EN, WN, 0.76 + i * 0.045, W(26))], 1, INK, { straight: true, op: 0.5 });
  X.barnacles(f, lp(EN, WN, 0.1, W(14)), W(16), W(12), 6, W(5.5));
  X.peel(f, lerp(EN, WN, 0.5), 3, k);
  f.bone('hand_n');
  const gK = B.grip(f, FNk, EN, 0, W(34), skin, { shadow: skinS, tex: 'flesh114', inline: true, bend: 0.12, name: 'brute knuckles' }); // knuckles down on the stones, the fist following the forearm
  X.fistDetail(f, gK, W(34), skin, { nail: '#8a8a9a' });
  for (let i = 0; i < 3; i++) f.line([add(FNk, [-W(16) + i * W(12), W(24)]), add(FNk, [-W(12) + i * W(12), W(30)])], 1.4, '#3a1414', { op: 0.65 }); // split knuckles
  f.flat(ell(Z([362, 791]), W(34), W(4), 0, 10), '#0e1012', { op: 0.55 }); // weight on the stones
  for (let i = 0; i < 4; i++) f.line([Z([330 + i * 18, 790]), Z([336 + i * 18, 786])], 1.2, '#4a4a44', { op: 0.6 }); // grit kicked up under the fist
  // ---- near shoulder barnacles over the top (torso bone, stays put)
  f.bone('torso');
  X.barnacles(f, add(SN, [-W(10), -W(26)]), W(30), W(12), 10, W(6));
  X.kelp(f, add(SN, [-W(30), W(10)]), W(60), W(6), W(4));
  return f;
}

// ------------------------------------------------------------------ WRECK CRAB (large, 1.3 wide)
// A shore crab grown fat inside a wreck, wearing what it ate: its carapace is a fused section of hull, planks, copper
// sheathing, a porthole (something looks out of it) and a broken mast stump; a figurehead's face stares up off its back.
// Claws of barnacled shell, the near one a crusher raised. Own skeleton: body, mast, eyes, claws in four segments,
// eight walking legs.
function wreckCrab() {
  const [Wc, Hc] = K.TIERS.large, GY = Hc - 30;
  const { Z, ZZ, W, k } = X.space(1.3, 424, GY);
  const f = new Fig(K.foeBase(115, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 700])[1] })));
  const wood = '#3e3024', woodL = '#6a5640', shell = '#5a3428', shellD = '#3a2018', shellL = '#8a5a44', copper = '#4c7f6e', iron = '#3a3430';
  const SH = (o = {}) => Object.assign({ fill: shell, shadow: '#1e100c', tex: 'mottle115', texOp: 0.6 }, o);
  const WD = (o = {}) => Object.assign({ fill: wood, shadow: '#140e0a', tex: 'wood115', texOp: 0.6 }, o);
  const BODY = Z([230, 670]);
  // a jointed crab segment: flattened tube with a spine row and a joint knuckle
  // a jointed crab segment (independent review: the first legs were straight sticks): flared distal socket, lit
  // ridge, spines along the leading edge, setae along the trailing edge, a pale joint membrane
  const seg = (a, b, wa, wb, look, spines = 0, o = {}) => X.crabSeg(f, a, b, wa, wb, look, Object.assign({ spines, hairs: 6 }, o));
  const tipSeg = (a, b, w, look) => f.part([add(a, mul([-(b[1] - a[1]), b[0] - a[0]].map(v => v / E.len(sub(b, a))), w / 2)), b.concat([1]), add(a, mul([-(b[1] - a[1]), b[0] - a[0]].map(v => v / E.len(sub(b, a))), -w / 2))], Object.assign({ k: 0.7 }, look));
  // walking legs: base under the hull rim -> merus rising to a high knee -> carpus -> propodus down -> dactyl planted.
  // Front legs reach forward, back legs back, all splayed so the hull's weight sits inside them.
  const legs = {
    n1: [[332, 700], [404, 642], [436, 660], [458, 728], [470, 790]], n2: [[282, 704], [334, 636], [364, 654], [378, 726], [384, 790]],
    n3: [[204, 704], [160, 638], [136, 656], [122, 726], [114, 790]], n4: [[142, 698], [80, 634], [54, 654], [38, 724], [26, 790]],
    f1: [[350, 690], [424, 630], [456, 646], [482, 720], [494, 786]], f2: [[302, 694], [362, 626], [392, 642], [408, 718], [414, 786]],
    f3: [[222, 694], [192, 624], [170, 642], [160, 718], [156, 786]], f4: [[156, 690], [106, 620], [84, 640], [70, 716], [60, 786]],
  };
  f.joint('body', BODY, null).joint('mast', Z([196, 476]), 'body').joint('eyes', Z([418, 656]), 'body');
  for (const [key, pts] of Object.entries(legs)) { const P2 = ZZ(pts); f.joint(`leg_${key}_1`, P2[0], 'body').joint(`leg_${key}_2`, P2[1], `leg_${key}_1`).joint(`leg_${key}_3`, P2[2], `leg_${key}_2`).joint(`leg_${key}_4`, P2[3], `leg_${key}_3`); }
  const CN = ZZ([[372, 690], [470, 650], [508, 600], [584, 578]]), CF = ZZ([[352, 700], [430, 714], [470, 700], [526, 716]]);
  f.joint('claw_n_1', CN[0], 'body').joint('claw_n_2', CN[1], 'claw_n_1').joint('claw_n_3', CN[2], 'claw_n_2').joint('claw_n_4', CN[3], 'claw_n_3');
  f.joint('claw_f_1', CF[0], 'body').joint('claw_f_2', CF[1], 'claw_f_1').joint('claw_f_3', CF[2], 'claw_f_2').joint('claw_f_4', CF[3], 'claw_f_3');

  X.puddle(f, Z([250, 794]), W(260));
  // ---- far legs and far claw: behind the body, darker
  const SHF = o => SH(Object.assign({ fill: mix(shell, '#000', 0.3) }, o));
  const drawLeg = (key, look, w0) => {
    const P2 = ZZ(legs[key]), fwd = P2[1][0] > P2[0][0] ? 1 : -1; // spines on the upper edge of the merus, toward the tip
    const up = (a, b) => { const d = E.norm(sub(b, a)); return -d[0] * fwd >= 0 ? 1 : -1; };
    f.bone(`leg_${key}_4`); X.dactyl(f, P2[3], P2[4], W(w0 * 0.58), look, fwd * 0.3);
    f.bone(`leg_${key}_3`); seg(P2[2], P2[3], W(w0 * 0.74), W(w0 * 0.62), look, 2, { spineSide: -fwd });
    f.bone(`leg_${key}_2`); seg(P2[1], P2[2], W(w0 * 0.88), W(w0 * 0.76), look, 1, { spineSide: fwd });
    f.bone(`leg_${key}_1`);
    f.part(ell(P2[0], W(w0 * 0.66), W(w0 * 0.52), 0, 12), Object.assign({}, look, { cast: false, inkW: 1.2, shade: 0.5, fill: mix(look.fill, '#000', 0.25) })); // coxa socket under the rim
    seg(P2[0], P2[1], W(w0 * 1.12), W(w0 * 0.92), look, 4, { spineSide: up(P2[0], P2[1]) });
    if (f.r() > 0.4) X.barnacles(f, lerp(P2[0], P2[1], 0.55), W(6), W(6), 2, W(3.5));
    f.flat(ell(add(P2[4], [0, W(1)]), W(w0 * 0.5), W(2.4), 0, 8), '#0e0c0c', { op: 0.6 }); // the tip bites the floor
  };
  for (const key of ['f4', 'f3', 'f2', 'f1']) drawLeg(key, SHF(), 30);
  f.bone('claw_f_1'); seg(CF[0], CF[1], W(34), W(30), SHF(), 3);
  f.bone('claw_f_2'); seg(CF[1], CF[2], W(30), W(30), SHF(), 1);
  f.bone('claw_f_3');
  f.part([add(CF[2], [-W(6), -W(18)]), add(CF[2], [W(40), -W(22)]), add(CF[3], [W(4), -W(10)]), add(CF[3], [W(30), W(14)]), [...add(CF[3], [W(40), W(30)]), 1], add(CF[3], [W(10), W(20)]), add(CF[2], [W(30), W(22)]), add(CF[2], [-W(6), W(16)])], SHF());
  f.bone('claw_f_4');
  f.part([add(CF[3], [-W(2), -W(8)]), add(CF[3], [W(30), -W(4)]), [...add(CF[3], [W(46), W(12)]), 1], add(CF[3], [W(26), W(4)]), add(CF[3], [0, W(4)])], SHF());
  // ---- the crab under the hull: pale underside, the front of the true shell with its spines, mouthparts
  f.bone('body');
  f.part(ell(Z([240, 694]), W(180), W(30), 0, 20), SH({ fill: '#9a8a74', shadow: '#3a2e24' }));
  for (let i = 0; i < 6; i++) f.line(ZZ([[110 + i * 44, 684], [118 + i * 44, 708]]), 1.2, INK, { op: 0.5 });
  f.part(ZZ([[372, 640], [412, 630], [440, 646], [446, 672], [430, 696], [390, 704], [366, 690]]), SH());
  for (const [x, y] of [[418, 636], [436, 650], [444, 668]]) f.part(ZZ([[x - 4, y], [x + 10, y - 4], [x + 2, y + 6]]), SH({ inkW: 1, cast: false })); // carapace teeth
  for (let i = 0; i < 3; i++) f.part(ZZ([[420 + i * 4, 676 + i * 6], [446 + i * 2, 674 + i * 7], [446 + i * 2, 682 + i * 7], [420 + i * 4, 684 + i * 6]]), SH({ fill: '#7a5a48', inkW: 1, cast: false })); // mouthparts
  X.drip(f, Z([440, 704]), k);
  // ---- carapace: a section of hull. strakes following the dome, tarred seams, treenails, worn edges
  const iHull = f.out.length;
  const hull = ZZ([[30, 652], [42, 574], [94, 508], [190, 470], [300, 474], [372, 512], [412, 580], [420, 648], [360, 688], [250, 698], [140, 692], [58, 680]]);
  f.part(hull, WD({ k: 0.9 }));
  // strakes: smooth bands between the dome's top line and the sheathing, compressing toward the waterline
  const topY = x => 470 + Math.pow(Math.abs(x - 236) / 190, 2.2) * 150, botY = x => 664 + Math.sin((x - 30) / 390 * Math.PI) * 18;
  const xEnd = (t, side) => side < 0 ? 44 - t * 6 + Math.pow(1 - t, 3) * 50 : 414 - Math.pow(1 - t, 3) * 44;
  for (let i = 1; i <= 6; i++) {
    const t = Math.pow(i / 7, 0.85), x0 = xEnd(t, -1), x1 = xEnd(t, 1), L = [];
    for (let j = 0; j <= 12; j++) { const x = x0 + (x1 - x0) * j / 12; L.push(Z([x, topY(x) + (botY(x) - topY(x)) * t])); }
    f.line(L, 3.2, '#140e0a', { op: 0.85 }); f.line(L.map(q => add(q, [0, 2.6])), 1.2, woodL, { op: 0.45 });
    for (let j = 1; j < 12; j += 2) f.rivet(add(L[j], [0, W(8)]), W(1.7), '#7a6a50');
  }
  // butt joints between plank ends
  for (const [x, y] of [[160, 496], [262, 514], [356, 556], [116, 572], [214, 600], [300, 640], [86, 626], [390, 612]]) f.line(ZZ([[x, y], [x + 1, y + 18]]), 2.2, '#140e0a', { op: 0.8 });
  f.line(ZZ([[94, 508], [190, 470], [300, 474], [372, 512]]), W(2.2), woodL, { op: 0.6 }); // worn top edge
  X.verd(f, Z([250, 520]), W(80), W(20), 6, '#4a5a48');
  // copper sheathing along the lower edge, gone to verdigris, nailed
  f.part(ZZ([[40, 640], [140, 668], [250, 676], [360, 668], [416, 636], [420, 648], [360, 688], [250, 698], [140, 692], [58, 680], [34, 660]]), { fill: copper, shadow: '#1e3a32', tex: 'mottle115', texOp: 0.6 });
  for (let i = 0; i < 18; i++) { const x = 50 + i * 20, y = 672 + Math.sin((x - 40) / 380 * Math.PI) * 14; f.flat(ell(Z([x, y]), W(1.6), W(1.6), 0, 6), '#1a2a24'); }
  for (let i = 0; i < 5; i++) f.line(ZZ([[60 + i * 70, 660], [64 + i * 70, 690]]), 1.3, INK, { op: 0.6 });
  X.barnacles(f, Z([240, 684]), W(170), W(10), 28, W(6));
  X.barnacles(f, Z([60, 600]), W(20), W(40), 10, W(6));
  for (const [x, y, a] of [[100, 676, 0.3], [180, 690, -0.2], [320, 684, 0.6], [372, 664, 1.2]]) X.mussel(f, Z([x, y]), a, k);
  // broken plank ends at the rear, splintered
  f.part(ZZ([[30, 652], [16, 640, 1], [34, 626], [22, 606, 1], [44, 590], [34, 566, 1], [52, 560]]), WD({ fill: woodL, inkW: 1.4 }));
  // a clean round void hole through the planks: nothing behind it
  // porthole: a bronze rim gone green, bolts, and an eye in the black glass looking out
  const ph = Z([310, 584]);
  f.part(ell(ph, W(36), W(34), 0, 20), { fill: '#6a5a3a', shadow: '#2a2416', tex: 'mottle115', inkW: 1.6 });
  for (let i = 0; i < 8; i++) f.rivet(add(ph, rot([W(30), 0], i * Math.PI / 4)), W(2.4), '#8a7a54');
  X.verd(f, ph, W(30), W(28), 8);
  f.flat(ell(ph, W(24), W(23), 0, 20), PAL.voidC);
  // independent review: a round staring eye in the glass read as a cartoon face on the hull. Now the crab's own pale
  // soft body presses against the inside of the cracked, fouled glass; the eyestalks stay its only eyes.
  f.flat([add(ph, [-W(16), W(16)]), add(ph, [-W(8), W(2)]), add(ph, [W(6), -W(4)]), add(ph, [W(18), W(4)]), add(ph, [W(20), W(16)]), add(ph, [W(4), W(22)])], '#8a7e70', { op: 0.85 });
  f.flat([add(ph, [-W(10), W(14)]), add(ph, [-W(4), W(6)]), add(ph, [W(8), W(2)]), add(ph, [W(14), W(10)]), add(ph, [W(4), W(16)])], '#b4a894', { op: 0.6 });
  for (let i = 0; i < 4; i++) f.line([add(ph, [-W(8) + i * W(6), W(6) + i * W(2)]), add(ph, [-W(4) + i * W(6), W(14)])], 1, '#4a3e34', { op: 0.6 });
  f.flat(ell(add(ph, [-W(4), -W(12)]), W(16), W(7), -0.2, 12), '#1a2a28', { op: 0.6 }); // weed fouling the glass
  f.line([add(ph, [-W(20), -W(6)]), add(ph, [-W(4), -W(2)]), add(ph, [W(6), -W(14)]), add(ph, [W(18), -W(18)])], 1.2, '#c8d0d0', { op: 0.55 }); // crack
  f.line([add(ph, [-W(4), -W(2)]), add(ph, [W(2), W(10)]), add(ph, [-W(2), W(22)])], 1, '#c8d0d0', { op: 0.45 });
  f.line([add(ph, [-W(18), -W(14)]), add(ph, [-W(6), -W(20)])], 1.4, '#c8d0d0', { op: 0.5 }); // glint on the glass
  // void: a clean round bite taken out of the hull's shoulder, planks and sheathing cut as if by a lathe
  const bc = Z([352, 520]), br = W(36);
  X.punch(f, iHull, f.out.length, ell(bc, br, br * 0.95, 0, 28));
  const arc = ell(bc, br, br * 0.95, 0, 28).filter(q => q[0] < bc[0] + br * 0.2 || q[1] > bc[1]);
  // the pale rim only where the bite actually cuts the planks (the first rim ran on into the air past the hull)
  const inHull = q => { let c = false; for (let i = 0, j = hull.length - 1; i < hull.length; j = i++) { const [xi, yi] = hull[i], [xj, yj] = hull[j]; if ((yi > q[1]) !== (yj > q[1]) && q[0] < (xj - xi) * (q[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const rim = ell(bc, br, br * 0.95, 0, 40).filter(q => inHull(add(q, [0, 0])) && inHull(add(bc, mul(sub(q, bc), 1.1))));
  const hc0 = hull.reduce((q, h) => add(q, mul(h, 1 / hull.length)), [0, 0]), aOut = Math.atan2(bc[1] - hc0[1], bc[0] - hc0[0]), rel = q => { const v = Math.atan2(q[1] - bc[1], q[0] - bc[0]) - aOut; return Math.atan2(Math.sin(v), Math.cos(v)) + (Math.sin(v) < 0 && Math.cos(v) < 0 ? 0 : 0); };
  rim.sort((p1, p2) => ((rel(p1) + 2 * Math.PI) % (2 * Math.PI)) - ((rel(p2) + 2 * Math.PI) % (2 * Math.PI)));
  if (rim.length > 2) { f.line(rim, W(2.4), '#e8e2d8', { op: 0.9 }); f.line(rim.map(q => add(bc, mul(sub(q, bc), 1.04))), 1.4, INK); }
  // the figurehead's face on its back: carved, paint flaked, staring up and back
  const fh = Z([126, 524]), fF = frame(fh, -2.0, W(74));
  f.part(fF([[-0.4, -0.45], [0.1, -0.55], [0.42, -0.36], [0.5, 0.0], [0.42, 0.36], [0.1, 0.56], [-0.3, 0.5], [-0.5, 0.1]]), { fill: '#a89a80', shadow: '#3a3226', tex: 'wood115', texOp: 0.5, inkW: 1.6 });
  f.flat(fF([[-0.1, -0.3], [0.1, -0.36], [0.16, -0.18], [-0.04, -0.14]]), '#2a2018'); f.flat(fF([[-0.1, 0.12], [0.1, 0.1], [0.16, 0.28], [-0.04, 0.3]]), '#2a2018'); // eye hollows
  f.flat(fF([[0.08, -0.26], [0.13, -0.24], [0.11, -0.2]]), '#d8d0b8'); f.flat(fF([[0.08, 0.18], [0.13, 0.2], [0.11, 0.24]]), '#d8d0b8');
  f.part(fF([[0.0, -0.06], [0.42, -0.02], [0.44, 0.06], [0.02, 0.06]]), { fill: '#9a8c72', inkW: 1.1, cast: false }); // nose ridge
  f.line(fF([[0.28, -0.16], [0.34, 0.0], [0.28, 0.16]]), W(1.8), '#2a1a14'); // lips, set
  for (let i = 0; i < 5; i++) f.line(fF([[-0.5 + i * 0.05, -0.5 + i * 0.22], [-0.8 - i * 0.02, -0.44 + i * 0.24]]), W(2.4), woodL, { op: 0.8 }); // carved hair flowing into the planks
  for (const [x, y] of [[0.2, -0.4], [-0.2, 0.36], [0.3, 0.3]]) f.flat(fF(ell([x, y], 0.08, 0.05, 0.4, 8)), wood, { op: 0.8 }); // flaked paint
  f.line(fF([[-0.3, -0.5], [-0.1, -0.1], [-0.24, 0.3]]), 1.2, INK, { op: 0.6 }); // crack
  // ---- mast stump: broken, splintered, an iron band, a lashed yard with a rag of sail, shrouds gone slack
  f.bone('mast');
  const m0 = Z([196, 480]), m1 = Z([170, 330]);
  f.part(limb(m0, m1, W(34), W(28), { steps: 8, capB: false }), WD({ fill: '#4a3a2a' }));
  f.part([lp(m0, m1, 0.98, W(14)), add(m1, [W(6), -W(26)]), lp(m0, m1, 1.02, W(4)), add(m1, [-W(2), -W(18)]), lp(m0, m1, 1.0, -W(6)), add(m1, [-W(12), -W(10)]), lp(m0, m1, 0.97, -W(14))], WD({ fill: woodL, inkW: 1.4 })); // splinters
  for (const t of [0.2, 0.62]) f.part([lp(m0, m1, t, W(19)), lp(m0, m1, t + 0.06, W(18)), lp(m0, m1, t + 0.06, -W(18)), lp(m0, m1, t, -W(19))], { fill: iron, inkW: 1.2, cast: false, tex: 'mottle115' });
  f.flat(ell(lp(m0, m1, 0.66, 0), W(12), W(6), 0, 8), PAL.rust, { op: 0.6 });
  const yd = lp(m0, m1, 0.78, 0);
  f.part(limb(add(yd, [-W(70), W(8)]), add(yd, [W(54), -W(10)]), W(12), W(10), { steps: 6 }), WD({ fill: '#4a3a2a' })); // broken yard
  for (let i = 0; i < 4; i++) f.line([add(yd, [-W(8) + i * W(4), -W(12)]), add(yd, [-W(4) + i * W(4), W(12)])], W(2), '#8a7a58', { straight: true }); // lashing
  f.part([add(yd, [-W(60), W(10)]), add(yd, [-W(10), W(4)]), add(yd, [-W(4), W(46)]), [...add(yd, [-W(16), W(80)]), 1], add(yd, [-W(26), W(58)]), [...add(yd, [-W(40), W(92)]), 1], add(yd, [-W(48), W(52)]), [...add(yd, [-W(62), W(64)]), 1]], { fill: '#7a7464', shadow: '#2a2a28', tex: 'weave115', texOp: 0.5 }); // sail rag
  f.flat(ell(add(yd, [-W(30), W(40)]), W(6), W(8), 0, 10), '#1a1814', { op: 0.85 }); // hole in the rag
  f.line([add(m1, [0, W(30)]), Z([70, 560])], 1.6, '#8a7a58'); f.line([add(m1, [W(4), W(40)]), Z([110, 520]), Z([104, 556])], 1.4, '#8a7a58'); // shrouds, one parted and hanging
  X.kelp(f, add(yd, [W(40), -W(6)]), W(70), W(6), W(4)); X.kelp(f, lp(m0, m1, 0.4, -W(14)), W(46), W(5), -W(4));
  X.barnacles(f, lp(m0, m1, 0.1, 0), W(18), W(16), 7, W(5));
  // ---- eyestalks under the front lip
  f.bone('eyes');
  for (const [b0, t0] of [[[404, 648], [420, 614]], [[420, 652], [444, 618]]]) { const a2 = Z(b0), b2 = Z(t0); f.part(limb(a2, b2, W(9), W(8), { steps: 4 }), SH()); f.part(ell(b2, W(9), W(8), 0, 10), { fill: '#0c0a0a', inkW: 1.2, cast: false }); f.flat(ell(add(b2, [-W(2), -W(3)]), W(2.4), W(2), 0, 6), '#c8c0b0'); }
  // ---- near walking legs
  for (const key of ['n4', 'n3', 'n2', 'n1']) drawLeg(key, SH(), 35);
  // ---- near claw: a crusher, barnacled, raised and a little open
  f.bone('claw_n_1'); seg(CN[0], CN[1], W(46), W(40), SH(), 3);
  X.barnacles(f, lerp(CN[0], CN[1], 0.5), W(16), W(10), 6, W(4.5));
  f.bone('claw_n_2'); seg(CN[1], CN[2], W(40), W(40), SH(), 2);
  f.bone('claw_n_3');
  const hand = [add(CN[2], [-W(14), -W(22)]), add(CN[2], [W(40), -W(40)]), add(CN[3], [W(6), -W(12)]), add(CN[3], [W(26), W(6)]), add(CN[3], [W(46), W(30)]), [...add(CN[3], [W(58), W(54)]), 1], add(CN[3], [W(26), W(38)]), add(CN[3], [-W(10), W(34)]), add(CN[2], [W(30), W(34)]), add(CN[2], [-W(12), W(22)])];
  f.part(hand, SH({ k: 0.9 }));
  f.line([add(CN[3], [W(8), W(22)]), add(CN[3], [W(30), W(30)]), add(CN[3], [W(50), W(48)])], 1.4, INK, { op: 0.7 }); // fixed finger edge
  for (let i = 0; i < 4; i++) f.part([add(CN[3], [W(12 + i * 10), W(24 + i * 6)]), add(CN[3], [W(18 + i * 10), W(18 + i * 6)]), add(CN[3], [W(20 + i * 10), W(26 + i * 6)])], SH({ fill: '#a89a80', inkW: 0.9, cast: false })); // crushing teeth
  X.barnacles(f, add(CN[2], [W(30), -W(4)]), W(30), W(18), 16, W(5.5));
  X.verd(f, add(CN[2], [W(40), W(10)]), W(20), W(10), 3, '#4a6a5a');
  for (const [x, y, a] of [[20, 20, 0.4], [44, 14, -0.3]]) X.mussel(f, add(CN[2], [W(x), W(y)]), a, k);
  f.flat(ell(add(CN[2], [W(10), -W(16)]), W(12), W(6), -0.4, 10), shellL, { op: 0.4 });
  f.bone('claw_n_4');
  f.part([add(CN[3], [-W(4), -W(10)]), add(CN[3], [W(30), -W(10)]), add(CN[3], [W(54), W(4)]), [...add(CN[3], [W(66), W(24)]), 1], add(CN[3], [W(44), W(10)]), add(CN[3], [W(20), W(8)]), add(CN[3], [-W(2), W(6)])], SH({ fill: mix(shell, shellL, 0.2) }));
  for (let i = 0; i < 3; i++) f.part([add(CN[3], [W(18 + i * 12), W(6)]), add(CN[3], [W(24 + i * 12), W(14)]), add(CN[3], [W(28 + i * 12), W(6)])], SH({ fill: '#a89a80', inkW: 0.9, cast: false }));
  X.barnacles(f, add(CN[3], [W(20), -W(4)]), W(14), W(4), 4, W(4));
  return f;
}

module.exports = {
  heroes: [
    { key: 'hollow_tidewarden', name: 'Hollow Tidewarden', tier: 'elite', w: K.TIERS.elite[0], h: K.TIERS.elite[1], flip: true, build: tidewarden },
    { key: 'abbess_of_salt', name: 'Abbess of Salt', tier: 'elite', w: K.TIERS.elite[0], h: K.TIERS.elite[1], flip: true, build: abbess },
    { key: 'pearl_diver', name: 'Pearl Diver', tier: 'elite', w: K.TIERS.elite[0], h: K.TIERS.elite[1], flip: true, build: pearlDiver },
    { key: 'barnacle_knight', name: 'Barnacle Knight', tier: 'large', w: K.TIERS.large[0], h: K.TIERS.large[1], flip: true, build: barnacleKnight },
    { key: 'anchor_brute', name: 'Anchor Brute', tier: 'large', w: K.TIERS.large[0], h: K.TIERS.large[1], flip: true, build: anchorBrute },
    { key: 'wreck_crab', name: 'Wreck Crab', tier: 'large', w: K.TIERS.large[0], h: K.TIERS.large[1], flip: true, build: wreckCrab },
  ],
};
