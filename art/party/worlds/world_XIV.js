// World XIV, The Blighted Garden (Toxin + Void, Blight). A fey garden, once the most beautiful place in the world. It
// rotted, and the rot grew minds. Toxin (dominant) covers bodies in fungus, bloom and spore: bracket shelves, gilled caps,
// puffballs, coral, mould bloom, pustules, peeling skin. Void gives the growth eyes (lidded, blinking out of time) and
// leaves clean-rimmed holes where things used to be. Everything here is overgrown: armour, deer, gardeners.
// Palette: sick pastel blooms (pink, lilac, pale yellow) over black loam, with eyes; plus ink black, bone and grey. The old
// entries' moss green, briar green, fawn and brown cloth are drawn as rotted near-black greens and loam browns (kit P.rot*,
// P.loam*) so the world stays inside its palette.
// Every creature is a foe: drawn facing right with kit.foeBase (key light upper right in drawing space) and flipped.
// Rigged from the start: joints first, f.bone() before each part, parts drawn whole, overlaps at the joints, shoulder
// growth on the torso. Seeds 1400 + index in the brief's order.
'use strict';
const K = require('../kit');
const X = require('./kit_XIV');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang, R, tube, clipDraw, softTone, crease, stains, spline, ribbon } = X;

// ------------------------------------------------------------------ FUNGAL HUSK (cast, human 1.0)
// An under-gardener the mushrooms grew into. He stands stiff, knees locked, arms hanging; the trowel he was working with
// still in his hand. His head is bent over onto the near shoulder, pushed by the great cluster of caps that has burst out
// of the far side of his neck; a crown of caps has split his cloth cap and grows from his skull. Caps split the jacket's
// shoulder seams; bracket shelves climb his back. Toxin: the growths, mould bloom on cloth and skin, hyphae furring every
// split seam, pustules, peeling skin, spore. Void: a clean round hole through the apron and jacket skirt; eyes opened in
// the brackets on his back and in the big neck cluster.
// Rig: standard humanoid + trowel (hand_n) + skirt (pelvis: the jacket skirt and apron) + crown (head).
// Motion: idle puffing spores (crown); attack a spore burst (torso and crown jerk forward).
function fungalHusk() {
  const [CW, CH] = TIERS.human, seed = 1403;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 98, gy = f.o.groundY;
  const skin = P.skin, skinS = P.skinS;
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.55 }, o);
  const JK = (o = {}) => Object.assign({ fill: P.loamB, shadow: P.loamBS, light: P.loamBL, shade: 0.4, tex: 'weave' + seed, texOp: 0.55 }, o);
  const TR = (o = {}) => Object.assign({ fill: mix(P.loamB, P.loam, 0.45), shadow: P.loamD, light: P.loamB, shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, o);
  const AP = (o = {}) => Object.assign({ fill: P.grey, shadow: P.greyS, light: P.greyL, shade: 0.4, tex: 'weave' + seed, texOp: 0.6 }, o);
  const N = [300, 266], C = [298, 368], Pv = [290, 480];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.18, 0.13), SF = S.at(0.46, 0.1);
  const EN = [272, 396], WN = [284, 494];               // near arm hanging stiff, the trowel in the fist
  const EF = [352, 390], WF = [372, 482];               // far arm hanging, the hand slack
  const HN = S.at(-0.2, 1.0), KN = [268, 632], AN = [258, 752];
  const HF = S.at(0.3, 1.0), KF = [330, 630], AF = [346, 750];
  const neck0 = S.at(0.12, -0.04), HC = [338, 214], hA = 0.5;
  const tA = 0.38, tD = [Math.cos(tA), Math.sin(tA)];   // the trowel: blade leaves the thumb side, forward and down
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('trowel', WN, 'hand_n').joint('skirt', S.at(0, 0.84), 'pelvis').joint('crown', add(HC, [-4, -40]), 'head');

  // ---- far arm, hanging behind the body: jacket sleeve, the slack hand
  f.bone('upperarm_f');
  f.part(X.jointLimb(SF, EF, WF, [54, 46, 40], { point: 0.3 }), JK({ fill: mix(P.loamB, P.loam, 0.25), maxShade: 16 }));
  f.bone('hand_f');
  X.openHand(f, lerp(EF, WF, 0.96), ang(EF, WF) + 0.15, 62, { look: SKN({ fill: mix(skin, P.skinS, 0.2) }), back: true, curl: 0.55, flip: true });
  X.pustules(f, add(WF, [6, 16]), 10, 8, 3, 2.4, 4);

  // ---- far leg (behind): trousers, gaiter, boot
  const legDraw = (Hp, Kn, A, sfx, tone) => {
    const look = TR({ fill: mix(mix(P.loamB, P.loam, 0.45), '#000', tone) }), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    const [c0, c1] = jcut(Hp, Kn, A, 26);
    split(f, () => f.part(X.jointLimb(Hp, Kn, lerp(Kn, A, 0.86), [72, 52, 42], { point: 0.25, mus0: 0.18, mus1: 0.2 }), Object.assign({ maxShade: 18 }, look)), [['thigh' + sfx, c0], ['shin' + sfx, c1]]);
    f.bone('thigh' + sfx);
    crease(f, [lp(Hp, Kn, 0.55, -20), lp(Hp, Kn, 0.7, -4), lp(Hp, Kn, 0.8, 14)], 2.2, { col: P.loamD, lit: P.loamBL });
    f.bone('shin' + sfx);
    // leather gaiter buttoned up the side, caked in loam
    const g0 = lerp(Kn, A, 0.42), gn = E.norm(sub(A, Kn)), gN = [-gn[1], gn[0]];
    const gait = [add(g0, mul(gN, 26)), add(g0, mul(gN, -25)), add(A, mul(gN, -25)), add(add(A, mul(gN, 26)), mul(gn, 6))];
    f.part(gait, { fill: mix(P.loamL, P.loamB, 0.3 - tone), shadow: P.loamD, light: P.loamBL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.3, k: 0.6 });
    for (let i = 0; i < 4; i++) f.rivet(lerp(add(g0, mul(gN, 18)), add(A, mul(gN, 20)), 0.12 + i * 0.25), 2.2, P.greyD);
    f.line([lerp(gait[0], gait[1], 0.5), lerp(gait[2], gait[3], 0.5)], 1, P.loamD, { op: 0.5 });
    split(f, () => B.boot(f, A, 1, 50, mix('#2a221c', '#000', tone), { shaft: 0.4, toe: 1.15, tex: 'mottle' + seed, strap: !tone }), [['shin' + sfx, side(A, mul(da, -1), 18)], ['foot' + sfx, side(A, da, 18)]]);
  };
  legDraw(HF, KF, AF, '_f', 0.25);

  // ---- the shelves on his back are drawn first so the jacket's edge sits over their roots
  f.bone('torso');
  // ink caps in clusters down the back: tall bells whose margins are blackening and curling, a few big, many small
  for (const [v, sz, n] of [[0.16, 70, 4], [0.4, 90, 5], [0.66, 60, 3]]) X.caps(f, S.at(-0.66, v), Math.PI + 0.9, sz, n, { shape: 'inkcap', w: 0.22, sw: 0.1, stemL: 0.5, cols: [mix(P.bone, P.grey, 0.3), mix(P.bone, P.lilac, 0.3), P.greyL], fan: 0.4 });
  X.eyes(f, [[S.at(-1.05, 0.33), 13, 0.2, 0.75], [S.at(-1.12, 0.58), 11, -0.1, 0.0], [S.at(-0.98, 0.78), 9, 0.1, 0.5]], { lid: P.yel, lidS: P.yelS });

  // ---- torso: shirt, then the jacket, split at the shoulder seams
  const torso = S.shape([[-0.06, 0.34, 0.32], [0.06, 0.7, 0.5], [0.2, 0.82, 0.62], [0.42, 0.78, 0.64], [0.62, 0.66, 0.6], [0.82, 0.7, 0.62], [1.0, 0.72, 0.62]]);
  f.part(torso, JK({ maxShade: 26 }));
  const tDs = E.smooth(torso);
  clipDraw(f, tDs, () => {
    softTone(f, tDs, [[[S.at(-0.9, 0.0), S.at(-0.4, 0.0), S.at(-0.3, 1.0), S.at(-0.9, 1.0)], '#000', 0.3, 12], [[S.at(0.2, 0.1), S.at(0.6, 0.1), S.at(0.6, 0.5), S.at(0.2, 0.5)], P.loamBL, 0.3, 10]]);
    stains(f, tDs, E.bbox(torso), P.loamD, 0.03, 2.6, -1.3, 11, 0.6);
    crease(f, [S.at(-0.3, 0.2), S.at(-0.36, 0.45), S.at(-0.3, 0.7)], 2.4, { col: P.loamD, lit: P.loamBL });
    crease(f, [S.at(0.2, 0.62), S.at(0.36, 0.7), S.at(0.52, 0.68)], 2.2, { col: P.loamD, lit: P.loamBL });
    // the shirt shows in the open collar
    f.part([S.at(0.0, -0.06), S.at(0.46, -0.02), S.at(0.52, 0.16), S.at(0.38, 0.4), S.at(0.24, 0.2)], { fill: P.greyL, shadow: P.greyS, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.2, cast: false });
    f.line([S.at(0.38, 0.4), S.at(0.5, 0.55), S.at(0.56, 0.78)], 1.6, INK, { op: 0.7 }); // the jacket's front edge
    for (let i = 0; i < 3; i++) f.rivet(S.at(0.5, 0.48 + i * 0.13), 2.6, P.loamBL); f.flat(ell(S.at(0.52, 0.86), 3, 2, 0, 6), P.loamD, { op: 0.8 }); // horn buttons, one torn off
    X.mould(f, S.at(-0.3, 0.32), 20, 26, { col: P.lilac });
    X.mould(f, S.at(0.36, 0.3), 12, 10, { col: P.yel, op: 0.6 });
  });
  // the shoulder seams split open, hyphae furring the lips, caps pushing out
  f.bone('torso');
  X.rotSplit(f, [S.at(-0.5, 0.06), S.at(-0.2, 0.0), S.at(0.1, 0.02)], 4);
  X.fungalFur(f, [S.at(-0.5, 0.04), S.at(-0.2, -0.02), S.at(0.1, 0.0)], 8, -1);
  X.caps(f, S.at(-0.3, 0.02), -Math.PI / 2 - 0.3, 66, 3, { cols: [P.pink, P.lilac, P.yel], fan: 0.45 });

  // ---- near leg
  legDraw(HN, KN, AN, '_n', 0);
  f.bone('shin_n');
  // a leather kneeling pad strapped on the near knee
  const kp = lp(HN, KN, 1.02, -4), kA = ang(HN, KN) - Math.PI / 2;
  f.part(ell(kp, 30, 22, kA, 14), { fill: P.loamL, shadow: P.loamD, light: P.loamBL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.4 });
  f.line(ell(kp, 22, 15, kA, 14).slice(2, 12), 1, P.loamBL, { op: 0.6, dash: '2 2' });
  f.part([add(kp, rot([-34, 16], kA)), add(kp, rot([34, 16], kA)), add(kp, rot([34, 22], kA)), add(kp, rot([-34, 22], kA))], { fill: P.loamD, shade: 0.3, inkW: 1, cast: false, sharp: true });
  f.flat(ell(add(kp, [6, 2]), 10, 7, 0, 8), P.loamD, { op: 0.4 });

  // ---- jacket skirt and sacking apron (pelvis > skirt), a clean hole through both
  f.bone('skirt');
  const jsk = [S.at(-0.74, 0.8), S.at(0.62, 0.8), add(S.at(0.68, 1.0), [6, 30]), [386, 586], [340, 596], [300, 590], [262, 600], [222, 588], add(S.at(-0.8, 1.0), [-6, 20])];
  const ap = [S.at(-0.1, 0.76), S.at(0.62, 0.76), [392, 560], [400, 648], [372, 652], [348, 662], [320, 654], [296, 660], [276, 650], [268, 580]];
  const hole = [[332, 600], 13];
  X.cutHoles(f, [hole], () => {
    f.part(jsk, JK({ maxShade: 20 }));
    clipDraw(f, E.smooth(jsk), () => { crease(f, [[250, 520], [244, 556], [236, 590]], 2.4, { col: P.loamD, lit: P.loamBL }); stains(f, E.smooth(jsk), [200, 480, 420, 620], P.loamD, 0.03, 2.6, -1.2, 13, 0.6); });
    f.part(ap, AP({ maxShade: 22 }));
    clipDraw(f, E.smooth(ap), () => {
      softTone(f, E.smooth(ap), [[[[268, 560], [300, 560], [296, 660], [268, 660]], '#000', 0.35, 10]]);
      stains(f, E.smooth(ap), [260, 480, 410, 670], P.loamD, 0.035, 2.8, -1.1, 15, 0.8); // loam ground in at the knees of the apron
      for (const q of [[[300, 520], [306, 590], [300, 650]], [[350, 520], [358, 590], [362, 650]]]) crease(f, q, 2.4, { col: P.greyS, lit: P.greyL });
      X.mould(f, [366, 620], 16, 14, { col: P.pink, op: 0.7 });
      // the front pocket: a seed packet and a dibber in it
      f.part([[296, 548], [356, 544], [358, 586], [298, 590]], AP({ fill: mix(P.grey, '#000', 0.15), inkW: 1.2, cast: false }));
      f.stitches([[296, 550], [356, 546]], P.greyL, 0.8);
    });
    f.part([[306, 526], [324, 522], [328, 552], [310, 556]].map(q => [...q, 1]), { fill: P.yelL, shadow: P.yelS, shade: 0.35, inkW: 1, cast: false }); // the seed packet
    f.line([[309, 532], [322, 530]], 1, P.loamD, { op: 0.6 }); f.flat(ell([316, 542], 4, 3, 0, 8), P.pinkD, { op: 0.7 });
    f.part(limb([340, 520], [346, 560], 7, 4, { steps: 4 }), { fill: P.loamBL, shadow: P.loamD, shade: 0.4, inkW: 1, cast: false, tex: 'grain' + seed }); // the dibber
  }, { shape: E.smooth(ap) });
  // apron strings round the waist, a twine ball hanging at the hip
  f.bone('pelvis');
  X.rope(f, [S.at(-0.7, 0.8), S.at(-0.1, 0.78), S.at(0.5, 0.76), S.at(0.66, 0.78)], 3.5, P.greyL, { lit: false });
  const tw = S.at(-0.55, 0.86); X.rope(f, [tw, add(tw, [-2, 22])], 2, P.yelD, { lit: false });
  f.part(ell(add(tw, [-2, 34]), 12, 11, 0, 12), { fill: P.yelD, shadow: P.yelS, shade: 0.45, inkW: 1.2, cast: false });
  for (let i = 0; i < 4; i++) f.line(ell(add(tw, [-2, 34]), 10 - i * 2, 9, 0.4 + i * 0.5, 10).slice(0, 6), 0.8, P.yelS, { op: 0.6 });

  // ---- the neck and head, lolled over toward the near shoulder by the cluster bursting from the far side of the neck
  const hF = frame(HC, hA, H);
  f.bone('head');
  // the great cluster behind the neck (drawn first: the head lies against it)
  X.caps(f, add(neck0, [-26, 6]), -Math.PI / 2 - 0.55, 120, 4, { cols: [P.lilac, P.yel, P.pink, P.lilac], fan: 0.35, w: 0.38 });
  X.eyes(f, [[add(neck0, [-58, -46]), 14, -0.4, 0.7], [add(neck0, [-34, -70]), 10, -0.2, 0.05]], { lid: P.lilac });
  f.part(limb(neck0, add(HC, [-20, 26]), 46, 40, { steps: 6 }), SKN({ maxShade: 12 }));
  X.pustules(f, add(neck0, [8, -12]), 10, 10, 4, 2.6, 4.4);
  const hp = B.head(f, HC, H, hA, {
    skin, jaw: 1.12, chin: -0.02, nose: 1.0, hook: 0.2, mouth: 'set', squint: -0.1, browDown: -0.01, faceShade: 0.8, jawShade: 0.5, age: true, gaunt: true,
    iris: '#c8bcc4', eyeWhite: '#ddd2cc', hairCol: '#4a4038',
    hairBack: [[-0.42, 0.24], [-0.5, -0.1], [-0.4, -0.38], [-0.2, -0.48], [-0.1, -0.2], [-0.3, 0.3]],
  });
  f.flat(hF([[0.17, 0.27], [0.25, 0.26], [0.31, 0.28], [0.3, 0.35], [0.24, 0.38], [0.18, 0.35]]), P.loamD); // the slack open mouth
  X.fungalFur(f, hF([[0.19, 0.33], [0.24, 0.36], [0.29, 0.33]]), 7, 1, { col: P.yelL });
  X.mould(f, hF([[0.05, 0.12]])[0], 12, 9, { col: P.lilac, op: 0.6 });
  X.peel(f, hF([[0.2, -0.3]])[0], 2, 0.8, 16);
  // the split felt cap: its two halves pushed apart by the crown
  f.part(hF([[-0.46, -0.08], [-0.48, -0.32], [-0.3, -0.5], [-0.12, -0.56], [-0.06, -0.4], [-0.2, -0.22], [-0.36, -0.06]]), { fill: P.loamL, shadow: P.loamD, light: P.loamB, shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.part(hF([[0.1, -0.52], [0.26, -0.48], [0.38, -0.34], [0.42, -0.24], [0.3, -0.26], [0.14, -0.38]]), { fill: P.loamL, shadow: P.loamD, light: P.loamB, shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.part(hF([[0.26, -0.32], [0.5, -0.27], [0.54, -0.2], [0.3, -0.22]]), { fill: mix(P.loamL, '#000', 0.2), shade: 0.3, inkW: 1.1, cast: false }); // the peak
  X.fungalFur(f, hF([[-0.2, -0.3], [-0.06, -0.5], [0.12, -0.46]]), 9, -1);
  f.bone('crown');
  const cr = hF([[-0.02, -0.46]])[0], up = hA - Math.PI / 2;
  X.cap(f, add(cr, [-14, 8]), up - 0.5, 118, { col: P.lilac, shape: 'conic', w: 0.26, sw: 0.13, stemL: 0.6 });
  X.cap(f, add(cr, [10, 4]), up + 0.3, 92, { col: P.pink, shape: 'convex', w: 0.38, sw: 0.14, stemL: 0.56 });
  X.cap(f, add(cr, [-2, 8]), up - 0.08, 150, { col: P.yel, shape: 'convex', w: 0.34, sw: 0.12, stemL: 0.62 });
  X.cap(f, add(cr, [22, 8]), up + 0.7, 48, { col: P.lilacL, shape: 'flat', w: 0.44, sw: 0.18 });
  X.caps(f, add(cr, [4, 10]), up + 0.1, 34, 4, { cols: [P.pinkL, P.yel, P.lilac], fan: 0.6, sw: 0.18, stemL: 0.45 }); // a knot of young caps at the root of the crown
  X.spores(f, add(cr, [10, -110]), 50, 30, 10);
  X.eyes(f, [[add(cr, [-6, -74]), 9, up + 1.6, 0.6]], { lid: P.yel });

  // ---- near arm, hanging: sleeve rolled to the elbow, bare forearm blotched with mould, the trowel in the fist
  f.bone('upperarm_n');
  f.part(X.jointLimb(SN, EN, lerp(EN, WN, 0.2), [58, 50, 50], { point: 0.3 }), JK({ maxShade: 16 }));
  f.part(K.ragLimb(f, lerp(SN, EN, 0.75), add(EN, [0, 14]), 58, 60, { depth: 6, teeth: 5 }), JK({ fill: mix(P.loamB, '#fff', 0.06), maxShade: 10, cast: false }));
  f.part([lp(SN, EN, 0.42, -24), lp(SN, EN, 0.42, 6), lp(SN, EN, 0.62, 8), lp(SN, EN, 0.62, -24)].map(q => [...q, 1]), JK({ fill: mix(P.loamL, P.loamB, 0.4), inkW: 1.1, cast: false })); // elbow patch
  f.stitches([lp(SN, EN, 0.42, -24), lp(SN, EN, 0.42, 6), lp(SN, EN, 0.62, 8), lp(SN, EN, 0.62, -24), lp(SN, EN, 0.42, -24)], P.loamBL, 0.8);
  f.bone('forearm_n');
  f.part(X.jointLimb(lerp(SN, EN, 0.7), EN, WN, [44, 42, 32], { point: 0.2 }), SKN({ maxShade: 12 }));
  f.part(K.ragLimb(f, lerp(SN, EN, 0.82), add(EN, [-1, 18]), 56, 58, { depth: 5, teeth: 5 }), JK({ fill: mix(P.loamB, '#fff', 0.08), maxShade: 10, cast: false })); // the rolled cuff over the elbow
  X.mould(f, lp(EN, WN, 0.5, -4), 10, 18, { col: P.lilac, op: 0.7 });
  X.pustules(f, lp(EN, WN, 0.35, 8), 6, 10, 3, 2.4, 4);
  X.peel(f, lp(EN, WN, 0.7, -2), 2, 0.8, 12);
  // the trowel: ash handle, iron ferrule and cranked neck, the pointed blade worn bright at the tip, loam caked on it
  f.bone('trowel');
  const tb = add(WN, mul(tD, -34)), tf = add(WN, mul(tD, 26)), tn = add(tf, [8, 14]), tbl = add(tn, mul(tD, 8));
  f.part(limb(tb, tf, 13, 15, { steps: 6 }), { fill: P.loamBL, shadow: P.loamBS, light: P.bone, shade: 0.4, tex: 'grain' + seed, texOp: 0.6 });
  f.part(limb(tf, add(tf, mul(tD, 10)), 16, 15, { steps: 3 }), { fill: P.steel, shadow: P.steelD, light: P.steelL, shade: 0.4, inkW: 1.2, cast: false });
  f.part(limb(add(tf, mul(tD, 8)), tn, 6, 6, { steps: 3 }), { fill: P.steel, shadow: P.steelD, shade: 0.4, inkW: 1.1, cast: false });
  const bF = frame(tbl, tA + 0.12, 1);
  const BL = { fill: '#8e8c8e', shadow: P.steelD, light: P.greyL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.3 };
  const blade = bF([[0, -8], [14, -20], [40, -22], [64, -12], [82, 0, 1], [64, 13], [40, 22], [14, 19], [0, 7]]);
  f.part(blade, BL);
  f.line(bF([[4, 0], [68, 0]]), 1.2, P.steelD, { op: 0.7 }); f.flat(bF([[40, 8], [60, 4], [62, 12], [44, 16]]), '#5a4030', { op: 0.5 }); // the spine of the blade, rust
  f.line(bF([[56, -7], [76, 0]]), 1.4, P.greyL, { op: 0.8 }); // worn bright
  f.flat(bF([[6, -8], [26, -16], [36, -6], [30, 6], [8, 6]]), P.loam, { op: 0.85 }); // loam caked on
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, tA, 24, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'husk trowel' });
  X.fistDetail(f, gN, 24, skin, { nail: P.loamL });
  X.pustules(f, add(WN, [-6, -8]), 6, 5, 2, 2, 3);

  f.bone('root');
  X.loamGround(f, 160, 460, gy, { depth: 14, petals: 3 });
  return f;
}

// ------------------------------------------------------------------ THORN KNIGHT (cast, large 1.4)
// A knight of the garden's guard, sworn to keep it. The garden grew through his armour: briar canes push out of every
// gap (the visor's slits and breaths, the armpits, the couters, the poleyns, between the faulds) and arc away from him,
// so his outline bristles; canes wind round both vambraces; a pink rose blooms from the crown of his bascinet. He stands
// square with his arming sword drawn, low and forward; the far gauntlet hangs open, clawed, wound with thorn.
// Toxin: the briars and their rotted leaves, moss packed into every plate seam, mould bloom on the rotting lilac livery,
// rust gone to loam. Void: a clean round hole through the livery skirt and a clean-rimmed hole in the breastplate with
// only dark inside; an eye opened in the tangle at the visor and one in the knot at the near elbow.
// Rig: standard humanoid + sword (hand_n) + skirt (pelvis) + rose (head).
// Motion: idle thorns creaking (canes on the torso and head shiver); attack a sword cut (near arm rises and cuts down).
function thornKnight() {
  const [CW, CH] = TIERS.large, seed = 1405;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 138, gy = f.o.groundY;
  const ST = (o = {}) => Object.assign({ fill: P.steel, shadow: P.steelD, light: P.steelL, shade: 0.45, tex: 'mottle' + seed, texOp: 0.55 }, o);
  const STD = (o = {}) => ST(Object.assign({ fill: mix(P.steel, '#000', 0.22) }, o));
  const HOSE = (o = {}) => Object.assign({ fill: P.loamL, shadow: P.loamD, shade: 0.4, tex: 'quilt' + seed, texOp: 0.6 }, o);
  const LV = (o = {}) => Object.assign({ fill: mix(P.lilac, P.loamB, 0.35), shadow: P.lilacS, light: P.lilac, shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const N = [452, 330], C = [446, 470], Pv = [432, 636];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.45, 0.1);
  const EN = [380, 500], WN = [468, 590];              // near arm low, the sword forward and down
  const EF = [560, 474], WF = [598, 566];              // far arm hanging forward, the gauntlet open
  const HN = S.at(-0.3, 1.0), KN = [384, 842], AN = [352, 1010];
  const HF = S.at(0.3, 1.0), KF = [512, 838], AF = [540, 1010];
  const neck0 = S.at(0.12, -0.04), HC = [484, 262];
  const bA = 0.52, bD = [Math.cos(bA), Math.sin(bA)];
  const guard = add(WN, mul(bD, 30)), tip = add(guard, mul(bD, 330)), pom = add(WN, mul(bD, -46));
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('sword', WN, 'hand_n').joint('skirt', S.at(0, 0.84), 'pelvis').joint('rose', add(HC, [-14, -96]), 'head');
  const cane = (pts, w, o = {}) => X.briar(f, pts, w, Object.assign({ leaves: 1 }, o));
  const mossy = (pts, d) => X.moss(f, pts, d, { stalks: false });
  // a burst of canes from one gap: n canes fanned round dir, each arcing (curl) and tapering, the outline bristling
  const burst = (b, dir, n, len, w, o = {}) => { for (let i = 0; i < n; i++) { const a = dir + (i - (n - 1) / 2) * (o.fan ?? 0.4) + R(f, -0.12, 0.12), l = len * R(f, 0.7, 1.15), cu = (o.curl ?? 0.5) * (i % 2 ? 1 : -1) * R(f, 0.6, 1.2); const pts = []; let q = b, aa = a; for (let k = 0; k < 5; k++) { pts.push(q); aa += cu * 0.3; q = add(q, rot([l / 4, 0], aa)); } cane(pts, w * R(f, 0.8, 1.15), { leaves: f.r() < 0.5 ? 1 : 0 }); } };

  // ---- far leg: arming hose, cuisse, poleyn, greave, sabaton; canes out of the knee
  const plateLeg = (Hp, Kn, A, sfx, tone) => {
    const look = o => ST(Object.assign({ fill: mix(P.steel, '#000', tone) }, o || {})), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    f.bone('thigh' + sfx);
    f.part(limb(Hp, Kn, 92, 64, { q: [[0.35, 0.16, 0.2]], p: [[0.4, 0.1, 0.2]] }), HOSE());
    f.part(plate(Hp, Kn, 0.1, 0.9, 88, 66, { bow: 4 }), look());
    f.line([lp(Hp, Kn, 0.12, 10), lp(Hp, Kn, 0.88, 8)], 1.6, P.steelL, { op: 0.5 });
    mossy([lp(Hp, Kn, 0.9, -30), lp(Hp, Kn, 0.92, 0), lp(Hp, Kn, 0.9, 30)], 7);
    f.bone('shin' + sfx);
    f.part(limb(Kn, A, 62, 44), HOSE());
    f.part(plate(Kn, A, 0.08, 0.95, 64, 46, { bow: 3 }), look());
    f.line([lp(Kn, A, 0.12, 12), lp(Kn, A, 0.9, 8)], 1.6, P.steelL, { op: 0.5 });
    f.flat(ell(lp(Kn, A, 0.5, -6), 10, 22, 0, 10), mix(P.loamB, '#000', 0.2), { op: 0.45 }); // rust gone to loam
    G.poleyn(f, Kn, ang(Hp, Kn) - Math.PI / 2 + 0.2, 40, mix(P.steel, '#000', tone - 0.05), mix(P.steel, '#000', tone + 0.2));
    // canes out of the gap behind the knee, curling forward round the poleyn
    burst(add(Kn, [-24, 10]), 2.2, 3, 110, 10, { fan: 0.5 }); burst(add(Kn, [24, -6]), -0.5, 2, 90, 9);
    split(f, () => B.boot(f, A, 1, 72, mix(P.steel, '#000', tone + 0.05), { shaft: 0.3, style: 'sabaton', toe: 1.18, tex: 'mottle' + seed }), [['shin' + sfx, side(A, mul(da, -1), 22)], ['foot' + sfx, side(A, da, 22)]]);
    f.bone('foot' + sfx);
    mossy([add(A, [-24, 14]), add(A, [30, 22]), add(A, [70, 36])], 6);
  };
  plateLeg(HF, KF, AF, '_f', 0.28);

  // ---- far arm: rerebrace, couter, vambrace wound with a cane; the gauntlet hanging open, clawed
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 62, 52), HOSE());
  f.part(plate(SF, EF, 0.15, 0.85, 62, 52, { bow: 3 }), STD());
  f.bone('forearm_f');
  f.part(limb(EF, WF, 54, 44), STD());
  G.poleyn(f, EF, ang(SF, EF) - Math.PI / 2, 30, mix(P.steel, '#000', 0.2), mix(P.steel, '#000', 0.4));
  { const d = E.norm(sub(WF, EF)), n = [-d[1], d[0]]; const zz = []; for (let i = 0; i <= 6; i++) zz.push(add(lerp(EF, WF, 0.1 + i * 0.13), mul(n, (i % 2 ? 1 : -1) * 26))); cane(zz, 6, { leaves: 0 }); }
  f.bone('hand_f');
  X.openHand(f, lerp(EF, WF, 0.95), ang(EF, WF) + 0.1, 80, { look: STD({ fill: mix(P.steel, '#000', 0.3), maxShade: 6 }), back: true, curl: 0.65, spread: 0.2, flip: true });
  cane([add(WF, [10, 30]), add(WF, [30, 60]), add(WF, [26, 96])], 5, { leaves: 1 });

  // ---- near leg
  plateLeg(HN, KN, AN, '_n', 0);

  // ---- torso: arming coat, breastplate with a void hole, faulds; canes between the lames
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.42, 0.42], [0.06, 0.84, 0.7], [0.22, 0.96, 0.92], [0.42, 0.84, 0.88], [0.62, 0.56, 0.6], [0.8, 0.6, 0.6], [0.96, 0.7, 0.66]]);
  f.part(torso, { fill: '#4c4e52', shadow: '#1a1a1c', shade: 0.4, tex: 'mail' + seed, texOp: 0.85 });
  // canes thrusting out of the armpits and up from the back of the gorget (behind the breastplate)
  burst(S.at(-0.5, 0.1), -2.3, 4, 230, 13, { fan: 0.42, curl: 0.6 }); burst(S.at(-0.6, 0.5), 3.0, 3, 170, 11, { fan: 0.5 }); burst(S.at(-0.1, -0.02), -1.75, 2, 150, 10, { fan: 0.5 });
  // the cuirass: a breastplate swelling over the chest and pinched at the waist, a plackart lapped over its lower half,
  // the faulds flaring over the hips, each lame lapping the one below with a lit lower lip
  const bp = S.shape([[0.06, 0.72, 0.56], [0.18, 0.88, 0.98], [0.32, 0.86, 1.06], [0.46, 0.68, 0.8], [0.56, 0.54, 0.62], [0.62, 0.54, 0.6]]);
  const vh = S.at(0.36, 0.24);
  f.part(bp, ST({ shade: 0.48, maxShade: 18 }));
  clipDraw(f, E.smooth(bp), () => {
    softTone(f, E.smooth(bp), [[[S.at(0.3, 0.1), S.at(0.7, 0.12), S.at(0.8, 0.34), S.at(0.4, 0.34)], P.steelL, 0.55, 12], [[S.at(-0.9, 0.36), S.at(1.1, 0.38), S.at(1.0, 0.5), S.at(-0.9, 0.5)], '#000', 0.45, 10], [[S.at(-0.9, 0.0), S.at(-0.4, 0.0), S.at(-0.4, 0.7), S.at(-0.9, 0.7)], '#000', 0.35, 14]]); // the chest's swell lit, the shadow under it, the flank turning away
    contourHatch(f, bp, [S.at(-0.6, 0.44), S.at(0.2, 0.48), S.at(0.9, 0.4)], -1, 30, 22, { w: 1, op: 0.45 });
    f.line([S.at(0.6, 0.14), S.at(0.72, 0.36), S.at(0.62, 0.62)], 2, INK, { op: 0.6 }); f.line([S.at(0.55, 0.16), S.at(0.66, 0.36), S.at(0.57, 0.6)], 1.4, P.steelL, { op: 0.6 });
    stains(f, E.smooth(bp), E.bbox(bp), P.loamB, 0.03, 2.6, -1.3, 81, 0.55); // rust gone to loam
    f.scratches(S.at(0.2, 0.3), 30, 7, P.steelL);
    X.mould(f, S.at(0.1, 0.56), 16, 12, { col: P.yel, op: 0.55 });
  });
  X.voidDisk(f, vh, 15, 17, 0.2);
  const pk = S.shape([[0.42, 0.64, 0.74], [0.5, 0.56, 0.64], [0.6, 0.54, 0.6], [0.67, 0.6, 0.66]]);
  f.part(pk, ST({ fill: mix(P.steel, '#fff', 0.05), shade: 0.5, maxShade: 10 }));
  f.line([S.at(-0.6, 0.43), S.at(0.0, 0.415), S.at(0.7, 0.43)], 2, P.steelL, { op: 0.7 }); // the plackart's rolled top edge
  for (const u of [-0.5, 0.5]) f.rivet(S.at(u, 0.47), 3, P.steelL);
  f.line([S.at(0.0, 0.44), S.at(0.04, 0.6)], 1.6, INK, { op: 0.5 });
  for (let i = 0; i < 3; i++) { const v0 = 0.64 + i * 0.075; const fl = [S.at(-0.62 - i * 0.07, v0), S.at(0.0, v0 + 0.01), S.at(0.64 + i * 0.07, v0 - 0.01), S.at(0.7 + i * 0.08, v0 + 0.1), S.at(0.0, v0 + 0.115), S.at(-0.68 - i * 0.08, v0 + 0.1)]; f.part(fl, ST({ fill: i % 2 ? mix(P.steel, '#000', 0.2) : P.steel, inkW: 1.4, maxShade: 6 })); f.line([fl[5], fl[4], fl[3]].map(q => add(q, [0, -3])), 1.6, P.steelL, { op: 0.6 }); f.rivet(S.at(0.5, v0 + 0.05), 2.6, P.steelL); f.rivet(S.at(-0.5, v0 + 0.05), 2.6, P.steelL); mossy([S.at(-0.7, v0 + 0.005), S.at(0.0, v0 + 0.005), S.at(0.7, v0 - 0.005)], 4); }

  // ---- the livery skirt: lilac, rotted, mouldy, a clean hole through it; canes hanging out from under the faulds
  f.bone('skirt');
  const sk = [S.at(-0.74, 0.9), S.at(0.0, 0.92), S.at(0.8, 0.9), [578, 760], [566, 800, 1], [548, 772], [530, 786, 1], [508, 768], [492, 812, 1], [470, 780], [440, 790, 1], [420, 770], [402, 818, 1], [380, 782], [352, 796, 1], [330, 770], [312, 768], [318, 700]];
  X.cutHoles(f, [[[470, 742], 15]], () => {
    f.part(sk, LV({ maxShade: 24 }));
    clipDraw(f, E.smooth(sk), () => {
      softTone(f, E.smooth(sk), [[[[312, 690], [360, 690], [356, 810], [312, 810]], '#000', 0.35, 10]]);
      for (const q of [[[380, 700], [376, 750], [372, 792]], [[440, 700], [444, 750], [446, 796]], [[510, 700], [520, 746], [528, 786]]]) crease(f, q, 3, { col: P.lilacS, lit: P.lilacL });
      stains(f, E.smooth(sk), [300, 660, 600, 820], P.loamD, 0.03, 2.6, -1.2, 83, 0.7);
      X.mould(f, [520, 760], 20, 14, { col: P.yel, op: 0.6 }); X.mould(f, [360, 720], 14, 18, { col: P.pink, op: 0.6 });
      bloomBadge(f, [450, 710]);
    });
    X.fungalFur(f, sk.slice(3, 13), 8, 1, { gaps: 0.4 });
  }, { shape: E.smooth(sk) });
  burst(S.at(-0.3, 0.84), 1.9, 3, 150, 9, { fan: 0.35 }); burst(S.at(0.55, 0.84), 1.3, 2, 140, 9, { fan: 0.5 });
  function bloomBadge(f2, c) { X.bloom(f2, c, 18, P.pinkD, { n: 5, sy: 0.9, ang: 0.3 }); } // the garden's rose, embroidered, faded

  // ---- the near arm: rerebrace, couter with a knot of canes and an eye, vambrace wound with thorn
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 66, 54), HOSE());
  f.part(plate(SN, EN, 0.2, 0.86, 64, 54, { bow: 3 }), ST());
  f.bone('forearm_n');
  f.part(limb(EN, WN, 54, 44), HOSE());
  f.part(plate(EN, WN, 0.12, 0.85, 56, 46, { bow: 2 }), ST());
  { const d = E.norm(sub(WN, EN)), n = [-d[1], d[0]]; const zz = []; for (let i = 0; i <= 6; i++) zz.push(add(lerp(EN, WN, 0.12 + i * 0.12), mul(n, (i % 2 ? 1 : -1) * 27))); cane(zz, 6, { leaves: 0 }); }
  f.part(ell(add(EN, [-4, 4]), 24, 18, ang(SN, EN) + 0.6, 14), STD({ k: 0.8 })); // couter
  burst(add(EN, [-14, 10]), 2.9, 3, 130, 10, { fan: 0.55 });
  X.eyes(f, [[add(EN, [-30, 14]), 13, 0.3, 0.7]], { lid: P.rotL, lidS: P.rotS, iris: P.yelD });

  // ---- the sword: wheel pommel, wrapped grip, straight cross, the blade rust-pitted, a cane twining up from the cross
  f.bone('sword');
  f.part(limb(guard, tip, 26, 6, { steps: 8, capK: 2.2 }), { fill: '#a8a8ac', maxShade: 5, shadow: P.steelD, light: P.greyL, shade: 0.35, inkW: 1.4, inkHeavy: 2.2, tex: 'mottle' + seed, texOp: 0.5 });
  f.line([lp(guard, tip, 0.02, 0), lp(guard, tip, 0.9, 0)], 1.6, P.steelD, { op: 0.7 }); f.line([lp(guard, tip, 0.04, -4), lp(guard, tip, 0.94, -1)], 1.2, P.greyL, { op: 0.8 }); // the fuller, the edge
  for (const t of [0.3, 0.55, 0.7]) f.flat(ell(lp(guard, tip, t, 3), 6, 3, bA, 8), P.loamB, { op: 0.6 });
  f.part(limb(pom, guard, 15, 14, { steps: 5 }), { fill: P.loamL, shadow: P.loamD, shade: 0.4, inkW: 1.2 });
  for (let i = 0; i < 5; i++) f.line([lp(pom, guard, 0.2 + i * 0.13, -8), lp(pom, guard, 0.26 + i * 0.13, 8)], 1.4, P.loamD, { straight: true });
  f.part(ell(add(pom, mul(bD, -6)), 14, 14, 0, 14), ST({ inkW: 1.3, cast: false }));
  f.flat(ell(add(pom, mul(bD, -6)), 6, 6, 0, 10), P.steelD, { op: 0.7 });
  const cg = [add(guard, mul([-bD[1], bD[0]], -46)), add(guard, mul([-bD[1], bD[0]], 46))];
  f.part(limb(cg[0], cg[1], 13, 13, { steps: 6 }), ST({ inkW: 1.4 }));
  cane([add(guard, mul(bD, 4)), add(guard, add(mul(bD, 60), [0, -14])), add(guard, add(mul(bD, 120), [8, 10])), add(guard, add(mul(bD, 170), [-4, -8]))], 5, { leaves: 1 });
  f.bone('hand_n');
  B.grip(f, WN, EN, -Math.PI / 2, 32, P.steel, { plate: true, cuff: true, inline: true, bend: bA - ang(EN, WN), name: 'knight sword' });

  // ---- the helm: a bascinet with a hounskull visor, the aventail, canes pouring from the slits and breaths, an eye in
  // the tangle, and the rose blooming from its crown
  f.bone('head');
  const hF = frame(HC, 0.04, 150);
  f.part([add(HC, [-64, 50]), add(HC, [44, 70]), S.at(0.72, 0.12), S.at(0.1, 0.18), S.at(-0.7, 0.14)], { fill: '#4c4e52', shadow: '#1a1a1c', shade: 0.4, tex: 'mail' + seed, texOp: 0.85 }); // aventail
  const skull = hF([[-0.46, 0.34], [-0.5, 0.0], [-0.42, -0.34], [-0.2, -0.58], [-0.06, -0.66, 1], [0.12, -0.56], [0.3, -0.4], [0.38, -0.1], [0.36, 0.3], [0.2, 0.44], [-0.2, 0.44]]);
  f.part(skull, ST({ shade: 0.5 }));
  clipDraw(f, E.smooth(skull), () => { stains(f, E.smooth(skull), E.bbox(skull).map((v, i) => v + (i < 2 ? -10 : 10)), P.loamB, 0.04, 2.6, -1.3, 87, 0.5); f.line(hF([[-0.32, -0.4], [-0.12, -0.56], [0.1, -0.5]]), 1.6, P.steelL, { op: 0.6 }); });
  for (let i = 0; i < 6; i++) f.rivet(hF([[-0.42 + i * 0.13, 0.36 - Math.abs(i - 2.5) * 0.01]])[0], 2.6, P.steelL);
  // the visor, snouted, on its pivot
  const vis = hF([[0.06, -0.36], [0.34, -0.36], [0.58, -0.18], [0.78, 0.06, 1], [0.62, 0.2], [0.44, 0.34], [0.16, 0.42], [0.08, 0.06]]);
  f.part(vis, ST({ fill: mix(P.steel, '#fff', 0.06), shade: 0.5 }));
  clipDraw(f, E.smooth(vis), () => { stains(f, E.smooth(vis), E.bbox(vis).map((v, i) => v + (i < 2 ? -10 : 10)), P.loamB, 0.05, 2.6, -1.3, 89, 0.45); f.line(hF([[0.1, -0.06], [0.4, -0.04], [0.74, 0.08]]), 2, INK, { op: 0.55 }); });
  f.rivet(hF([[0.04, -0.06]])[0], 4.5, P.steelL);
  const slit = [hF([[0.18, -0.2]])[0], hF([[0.5, -0.12]])[0]];
  f.flat([add(slit[0], [0, -4]), add(slit[1], [0, -4]), add(slit[1], [0, 4]), add(slit[0], [0, 4])], P.void);
  const brs = [[0.46, 0.08], [0.52, 0.16], [0.4, 0.2], [0.56, 0.04], [0.34, 0.14]].map(q => hF([q])[0]);
  for (const q of brs) f.flat(ell(q, 4, 5, 0, 8), P.void);
  X.eyes(f, [[lerp(slit[0], slit[1], 0.55), 22, 0.15, 0.6]], { lid: P.rotL, lidS: P.rotS, iris: P.yelD });
  burst(lerp(slit[0], slit[1], 0.75), -0.3, 3, 150, 11, { fan: 0.45, curl: 0.7 }); burst(brs[0], 0.7, 3, 120, 9, { fan: 0.5 }); burst(hF([[-0.2, -0.3]])[0], -2.0, 2, 120, 9);
  mossy(hF([[-0.42, 0.3], [-0.1, 0.44], [0.2, 0.42]]), 6);
  // ---- the pauldron (reviewer rebuild), on the torso bone but drawn over the aventail's hem so the whole plate reads:
  // a domed cap with a raised ridge over four lames that lap downward round the shoulder, each lame lit on its rolled
  // upper edge and riveted at its ends; worn bright on the cap's crown, rust gone to loam in the laps, moss packed into
  // the gaps, a void disk punched clean through the cap
  f.bone('torso');
  { const pc = add(SN, [-18, 20]), pa = -0.28, ps = 74, PF = frame(pc, pa, ps);
    for (let i = 3; i >= 0; i--) {
      const y0 = 0.36 + i * 0.27, wv = 1.04 - i * 0.07, top = [], bot = [];
      for (let k = 0; k <= 8; k++) { const x = -wv + 2 * wv * k / 8; top.push([x, y0 - 0.22 * (1 - x * x / (wv * wv))]); bot.push([x * 0.98, y0 + 0.3 - 0.2 * (1 - x * x / (wv * wv))]); }
      const lm = PF([...top, ...bot.reverse()]);
      f.part(lm, ST({ fill: i % 2 ? mix(P.steel, '#000', 0.12) : mix(P.steel, '#fff', 0.06), shade: 0.4, maxShade: 7, hi: 0, inkW: 1.5, inkHeavy: 2.6, cast: true, castOp: 0.45 }));
      f.line(PF(top.slice(1, -1).map(([x, y]) => [x, y + 0.05])), 2, P.steelL, { op: 0.75 }); // the rolled upper edge, lit
      for (const x of [-0.8 * wv, 0.8 * wv]) f.rivet(PF([[x, y0 + 0.05 - 0.22 * (1 - 0.64)]])[0], 3, P.steelL);
      f.flat(PF(ell([0.3 - i * 0.15, y0 + 0.2], 0.16, 0.05, 0, 8)), P.loamB, { op: 0.6 }); // rust in the lap
    }
    const cap = PF([[-1.02, 0.38, 1], [-0.88, -0.24], [-0.46, -0.62], [0.12, -0.72], [0.66, -0.52], [1.0, -0.06], [1.04, 0.4, 1], [0.4, 0.3], [-0.3, 0.3]]);
    X.cutHoles(f, [[PF([[-0.5, 0.0]])[0], 8]], () => {
      f.part(cap, ST({ fill: mix(P.steel, '#fff', 0.16), shade: 0.42, maxShade: 10, hi: 0, inkW: 1.8, inkHeavy: 3, cast: true, castOp: 0.5 }));
      clipDraw(f, cap, () => {
        softTone(f, E.smooth(cap), [[PF(ell([0.3, -0.36], 0.5, 0.22, -0.2, 12)), P.steelL, 0.75, 8], [PF([[-1.1, 0.0], [-0.4, 0.2], [0.4, 0.2], [1.1, 0.1], [1.1, 0.5], [-1.1, 0.5]]), P.steelD, 0.6, 8]]);
        stains(f, E.smooth(cap), E.bbox(cap), P.loamB, 0.04, 2.6, -1.3, 91, 0.5);
        f.scratches(PF([[0.1, -0.3]])[0], 26, 6, P.steelL);
      });
      f.line(PF([[-0.84, 0.1], [-0.5, -0.32], [0.0, -0.5], [0.5, -0.4]]), 2.6, INK, { op: 0.55 }); f.line(PF([[-0.82, 0.06], [-0.48, -0.36], [0.0, -0.54], [0.5, -0.44]]), 1.6, P.steelL, { op: 0.8 }); // the raised ridge
      for (const x of [-0.7, 0.0, 0.7]) f.rivet(PF([[x, 0.2]])[0], 3.2, P.steelL);
    }, { shape: E.smooth(cap) });
    mossy(PF([[-1.0, 0.42], [-0.4, 0.34], [0.3, 0.34], [0.9, 0.4]]), 5);
    X.briar(f, [PF([[1.0, 0.9]])[0], PF([[1.3, 0.6]])[0], PF([[1.6, 0.5]])[0]], 7, { leaves: 0 }); // a cane out from under the lowest lame, clear of the plate
  }
  f.bone('rose');
  const rs = hF([[-0.06, -0.64]])[0];
  cane([rs, add(rs, [-6, -30]), add(rs, [-12, -56])], 9, { leaves: 0 });
  X.leaf(f, add(rs, [-8, -36]), -2.6, 54); X.leaf(f, add(rs, [-10, -44]), -0.5, 50);
  X.bloom(f, add(rs, [34, -40]), 20, P.pinkL, { rose: true, sy: 1, tilt: 0.4 });
  X.bloom(f, add(rs, [-14, -100]), 52, P.pink, { rose: true, sy: 1, tilt: -0.1 });

  f.bone('root');
  X.loamGround(f, 260, 700, gy, { depth: 16, petals: 5 });
  return f;
}

// ------------------------------------------------------------------ SPORE DEER (cast, large 1.3)
// A red deer of the garden's park. The fungus grows from its antlers: the bony beams end a hand above the burrs and the
// rest is coral fungus, branching and forking like antler gone soft, tapering to points, in one dusky pink family that
// pales toward the tips. It is not the deer making the decisions now: it stands head-low with the coral presented forward,
// the neck kinked, the eyes clouded white. The shared cervid anatomy at 0.54 of the Mother's: withers hump, a deep chest
// below the elbow, the belly tucked into the flank, the ham, heavy upper legs tapering to thin cannons, knees and hocks
// angled, fetlocks bent, cloven hooves. Its fawn coat is drawn loam brown (the palette), paler under the belly.
// Toxin: the coral, mould bloom and rot stains on the coat, hide peeling to pink flesh, pustules on the throat, fungal fur
// along the spine. Void: clean round holes through the near ear and right through the flank, eyes at the coral forks.
// Rig: spine_1 (root, hindquarters) > spine_2 > neck > head > ear, antler_n, antler_f; tail; legs leg_<k>_1..3.
// Motion: idle a twitch (neck and head jerk); attack an antler charge (neck drops, head drives forward).
function sporeDeer() {
  const CW = 1100, CH = TIERS.large[1], seed = 1404;
  const f = new Fig(X.base(seed, CH, { grimeY: CH - 30 - 170 })); X.textures(f);
  const gy = f.o.groundY, sc = 0.54, M = p => [740 + (p[0] - 1150) * sc, gy - (1570 - p[1]) * sc];
  const coat = P.loamB, coatS = mix(P.loamBS, P.loamD, 0.3), coatL = P.loamBL;
  const poll = [846, 640], hA = 1.02, hF = frame(poll, hA, 0.56);
  const P0n = hF([[30, -56]])[0], P0f = hF([[58, -60]])[0];
  f.joint('spine_1', M([420, 700])).joint('spine_2', M([700, 700]), 'spine_1').joint('neck', [712, 630], 'spine_2').joint('head', poll, 'neck').joint('tail', M([290, 640]), 'spine_1');
  f.joint('antler_n', P0n, 'head').joint('antler_f', P0f, 'head').joint('ear', hF([[-10, -40]])[0], 'head').joint('jaw', hF([[60, 72]])[0], 'head');
  // the neck in the barrel's own outline (no seam where it runs into the shoulder), cut for the neck bone across its root;
  // its planes: the crest lit, the side of the neck mid, the throat and the kink under the jaw dark
  const NPATH = [[700, 522], [760, 552], [812, 592], [848, 626], [884, 690], [876, 744], [846, 768], [804, 758], [764, 742], [730, 736]];
  const dk = mix(coatS, P.loamD, 0.35);
  const NECK = { path: [[1075.9, 555.2], [1187.0, 610.7], [1283.3, 684.8], [1350.0, 747.8], [1416.7, 866.3], [1401.9, 966.3], [1346.3, 1010.7], [1268.5, 992.2], [1194.4, 962.6], [1131.5, 951.5]], cut: [[1098.1, 755.2], [0.98, -0.19], 231],
    tones: () => {
      const all = CERVID.barrel.slice(0, 8).map(M).concat(NPATH, CERVID.barrel.slice(13).map(M));
      softTone(f, E.smooth(all), [[[[660, 512], [760, 540], [840, 600], [830, 630], [750, 580], [670, 556]], coatL, 0.8, 10], [[[880, 700], [870, 760], [800, 770], [740, 750], [720, 720], [800, 730], [850, 700]], dk, 0.85, 12], [[[700, 600], [790, 620], [800, 680], [720, 700]], coatS, 0.35, 14]]);
      crease(f, [[690, 570], [750, 610], [810, 660]], 2.6, { col: dk, op: 0.45, lit: coatL }); // the long muscle's edge, running on into the shoulder
      crease(f, [[812, 694], [830, 716], [822, 742]], 2.6, { col: P.loamD, op: 0.6, lit: coatL }); // the kink
      contourHatch(f, all, [[876, 744], [846, 768], [804, 758], [764, 742], [730, 736]], 1, 30, 18, { w: 1, op: 0.5, jit: 0.8 });
    } };
  const body = cervidBody(f, M, sc, { coat, coatS, coatL, belly: mix(P.loamBL, P.bone, 0.25), dark: dk, stain: P.loam, holes: [[M([760, 780]), 22]], hoof: '#262022', neck: NECK, vk: 0.95, stock: mix(P.loamD, coat, 0.35) });
  const coralCols = [mix(P.pinkD, P.loamB, 0.35), P.pinkD, mix(P.pinkD, P.pink, 0.5), P.pink, P.pinkL];
  // ---- the antlers: short beaded bony beams from the burrs, then coral fungus branching where the antler went soft
  const antler = (P0, s2, tone, bone, alt) => {
    f.bone(bone);
    const lk = { fill: mix(P.loamBL, P.bone, 0.35 - tone * 0.3), shadow: P.loamD, light: P.bone, shade: 0.42, inkW: 1.4, inkHeavy: 2.2, cast: false, hatch: true, maxShade: 8, tex: 'mottle' + seed, texOp: 0.5 };
    const bm = (alt ? [[0, 0], [-14, -50], [-8, -100]] : [[0, 0], [-24, -54], [-26, -112]]).map(q => add(P0, mul(q, s2)));
    const C = spline(bm, 4), W = C.map((_, i) => (26 - 9 * i / (C.length - 1)) * s2);
    f.part(ribbon(C, W).map(q => add(q, [(f.r() - 0.5) * 3, (f.r() - 0.5) * 3])), lk);
    for (let i = 0; i < 10; i++) f.flat(ell(add(C[Math.floor(f.r() * C.length * 0.6)], [(f.r() - 0.5) * 14 * s2, 0]), 2.4, 1.8, 0, 6), P.loamD, { op: 0.6 }); // beading
    const br = []; for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 2, rr = (i % 2 ? 1.2 : 1); br.push(add(P0, [Math.cos(t) * 20 * s2 * rr, Math.sin(t) * 10 * s2 * rr])); }
    f.part(br, Object.assign({}, lk, { fill: mix(P.loamBL, P.bone, 0.15) })); // the burr
    const cols = tone ? coralCols.map(c => mix(c, P.loamD, 0.3)) : coralCols;
    const tp = C[C.length - 1], tipA = Math.atan2(tp[1] - C[C.length - 2][1], tp[0] - C[C.length - 2][0]);
    const co = (b, a, l, w, d) => X.coral(f, b, a, l * s2, w * s2, d, { cols, wander: 0.45, minW: 5, taper: 0.5, fork: 0.65, point: true });
    co(lerp(C[0], tp, 0.3), -0.5 - (alt ? 0.2 : 0), 120, 26, 1);
    co(tp, tipA - 0.4, 190, 34, 2);
    co(tp, tipA + 0.45, 170, 30, 2);
    co(lerp(C[0], tp, 0.7), tipA - 1.25, 110, 22, 1);
    X.eyes(f, [[add(tp, [8 * s2, -46 * s2]), 18 * s2, -0.3, tone ? 0.05 : 0.65]], { lid: cols[2], lidS: P.loamD, iris: P.loamD });
    X.spores(f, add(tp, [0, -180 * s2]), 70, 40, 8);
  };
  const ped = (P0, tone) => { const b = add(P0, rot([0, 20], hA - 0.4)); f.part([add(P0, [-13, 0]), add(P0, [13, 2]), add(b, [15, 4]), add(b, [-15, 2])], body.LOOK({ fill: mix(coat, coatS, tone), maxShade: 5, cast: false, inkW: 1.2 })); };

  // ---- far side first
  f.bone('head'); ped(P0f, 0.4);
  antler(P0f, 0.86, 1, 'antler_f', true);
  body.farLegs();
  body.nearUpper();
  f.bone('tail');
  const tl = [M([296, 626]), M([262, 640]), M([246, 690]), M([262, 726]), M([290, 700]), M([306, 660])];
  f.part(tl, body.LOOK({ fill: coatL, maxShade: 4 }));
  f.flat(tl.slice(1, 4).concat([M([290, 680])]), P.bone, { op: 0.5 });

  // ---- the barrel, with rot patches, peeling hide, the pale rump patch
  body.barrel(T => {
    softTone(f, E.smooth(CERVID.barrel.map(M)), [[ell(T([280, 720]), 30, 46, 0.1, 14), P.bone, 0.6, 8]]);
    X.mould(f, T([560, 700]), 30, 20, { col: P.lilac, op: 0.6 });
    X.mould(f, T([380, 760]), 18, 14, { col: P.yel, op: 0.55 });
    X.mould(f, T([960, 820]), 16, 22, { col: P.pink, op: 0.5 });
    const pl = [T([620, 820]), T([660, 800]), T([700, 812]), T([720, 850]), T([690, 880]), T([650, 870]), T([620, 860])];
    f.part(pl, { fill: P.pinkD, shadow: P.pinkS, shade: 0.45, inkW: 1.1, cast: false, hatch: true, tex: 'mottle' + seed, texOp: 0.5 });
    X.pustules(f, T([670, 840]), 14, 8, 4, 2.5, 4);
    f.line(pl.concat([pl[0]]), 2, coatL, { op: 0.6 });
    for (let i = 0; i < 4; i++) X.peel(f, T([R(f, 700, 1000), R(f, 650, 900)]), 2, 0.7, 14, coat);
    // the coat's own structure: a darker dorsal line along the spine, hair lying in clumped tracts (lit ridge, dark
    // trough) that sweep back and down over the barrel and fan round the shoulder, a pale line where the belly hair meets
    const all = CERVID.barrel.slice(0, 8).map(M).concat(NPATH, CERVID.barrel.slice(13).map(M));
    f.stroke([T([300, 652]), T([440, 600]), T([690, 630]), T([910, 590]), T([990, 560])], 16, dk, { op: 0.45 });
    X.furField(f, all, 170, 26, { dir: p => (p[0] > 690 ? [-0.2, 1] : [-0.7, 0.45]), w: 3.2, dark: dk, lite: coatL, op: 0.55, liteOp: 0.45 });
    f.line([T([1040, 990]), T([830, 966]), T([630, 925]), T([500, 905])], 2.4, mix(coatL, P.bone, 0.3), { op: 0.45 });
  });
  f.bone('spine_2');
  X.fungalFur(f, CERVID.barrel.slice(3, 9).map(M), 9, -1, { gaps: 0.4 });
  f.bone('spine_1');
  X.fungalFur(f, CERVID.barrel.slice(0, 4).map(M), 8, -1, { gaps: 0.4 });

  // ---- near legs in front of the body
  body.nearLower();

  // ---- the neck (drawn with the barrel as one outline): pustules on the throat, fungal fur along the crest
  f.bone('neck');
  X.pustules(f, [800, 744], 22, 10, 6, 3, 5);
  X.fungalFur(f, NPATH.slice(0, 4), 8, -1, { gaps: 0.3 });

  // ---- the head, low: the Mother's modelled skull at the deer's scale (pass 2: one skull, the jaw blended into the
  // cheek, a deep orbit, a soft muzzle; no grief marks), a clouded eye
  const hd = motherHead(f, hF, { hide: coat, hideS: coatS, hideL: coatL, dark: dk, seed, muzzle: mix(P.loamD, coatS, 0.3), s: 0.56, grief: false });
  f.bone('head');
  const ey = hd.socket;
  f.flat(ell(ey, 11, 7, hA - 0.1, 12), P.loamD);
  f.flat(ell(add(ey, [1, -1]), 8, 5, hA - 0.1, 12), '#c8bfbe', { op: 0.92 });
  f.flat(ell(add(ey, [2, -1]), 3.5, 2.5, 0, 8), P.greyD, { op: 0.45 });
  f.line([add(ey, rot([-12, -6], hA)), add(ey, rot([0, -9], hA)), add(ey, rot([12, -5], hA))], 1.8, INK);
  X.mould(f, hF([[60, 40]])[0], 12, 9, { col: P.lilac, op: 0.55 });
  f.bone('head'); ped(P0n, 0);
  antler(P0n, 0.92, 0, 'antler_n', false);

  f.bone('root');
  X.loamGround(f, 160, 940, gy, { depth: 22, petals: 6 });
  return f;
}

// ------------------------------------------------------------------ MOTH WITCH (cast, human 1.0)
// A pale woman of the garden's wise folk who went into the moth. Great moth wings stand from her shoulder blades, spread
// wide and high behind her: pointed forewings with dusty lilac bands and pale-yellow scale, rounded hindwings whose
// eye-spots are real eyes that blink (one shut, one half open, one watching), the rings of the old spot still round them.
// Furred feathery antennae rise from her brow; a ruff of moth fur sits on her shoulders; her hair hangs in pale hanks.
// She stands barefoot in a rotted lilac shift, the near hand lifted to her breast, fingers spread, the far hand hanging.
// Toxin: mould bloom on the shift and skin, the wings' scale dust falling (spore), fungal fur on the wing veins. Void: clean
// round holes through both wings (the ground shows through), the eyes.
// Rig: standard humanoid + wing_n, wing_f (torso) + antennae (head) + skirt (pelvis) + hair (head).
// Motion: idle the wings slowly opening and closing (wing_n, wing_f); attack a wing beat of dust (both wings sweep forward).
function mothWitch() {
  const CW = 900, CH = TIERS.human[1], seed = 1406;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 96, gy = f.o.groundY;
  const skin = mix(P.bone, P.skin, 0.5), skinS = P.skinS;
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const SH = (o = {}) => Object.assign({ fill: mix(P.bone, P.grey, 0.45), shadow: P.greyS, light: P.boneL, shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, o);
  const N = [446, 270], C = [440, 370], Pv = [432, 482];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.13), SF = S.at(0.42, 0.11);
  const EN = [410, 392], WN = [470, 352];               // near arm bent, the hand lifted to the breast
  const EF = [480, 384], WF = [492, 470];               // far arm hanging
  const HN = S.at(-0.2, 1.0), KN = [420, 636], AN = [404, 752];
  const HF = S.at(0.28, 1.0), KF = [474, 632], AF = [486, 750];
  const neck0 = S.at(0.12, -0.04), HC = [474, 210], hA = 0.12;
  const WR = S.at(-0.45, 0.2);                          // the wings' root between the shoulder blades
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('wing_n', WR, 'torso').joint('wing_f', add(WR, [30, -6]), 'torso').joint('antennae', add(HC, [20, -40]), 'head').joint('skirt', S.at(0, 0.84), 'pelvis').joint('hair', add(HC, [-20, -20]), 'head');

  // ---- a moth wing: the forewing (pointed apex, dusty bands, the cross-lines, veins, a fringed margin) and the hindwing
  // (rounded, the old eye-spot's rings round a real eye). pts in drawing space. Void holes cut right through.
  const wing = (root, fw, hw, tone, eyesL, holes) => {
    const WC = (c) => mix(c, P.lilacS, tone);
    const look = (c, o = {}) => Object.assign({ fill: WC(c), shadow: mix(P.lilacS, '#000', 0.2), light: mix(c, '#ffffff', 0.3), shade: 0.3, maxShade: 14, inkW: 1.3, inkHeavy: 2.2, cast: false, hatch: true, tex: 'scale' + seed, texOp: 0.55 }, o);
    X.cutHoles(f, holes, () => {
      // hindwing under the forewing
      f.part(hw.pts, look(P.lilac));
      clipDraw(f, hw.pts, () => {
        stains(f, E.smooth(hw.pts), E.bbox(hw.pts), WC(P.yel), 0.02, 3, -1.5, 31, 0.5);
        for (const v of hw.veins) f.line([root, lerp(root, v, 0.5), v], 1, mix(WC(P.lilacD), '#000', 0.2), { op: 0.6 });
        for (const [c, r] of hw.rings) { f.flat(ell(c, r * 1.9, r * 1.5, 0.3, 24), WC(P.loamL), { op: 0.85 }); f.flat(ell(c, r * 1.55, r * 1.2, 0.3, 24), WC(P.yel), { op: 0.95 }); f.flat(ell(c, r * 1.2, r * 0.9, 0.3, 24), WC(P.pinkD), { op: 0.9 }); }
        X.mould(f, hw.mould, 18, 14, { col: P.yel, op: 0.55 });
      });
      X.fungalFur(f, hw.edge, 7, 1, { gaps: 0.1, col: WC(P.lilacL), col2: WC(P.yelL) }); // the fringed margin
      // forewing
      f.part(fw.pts, look(mix(P.lilac, P.grey, 0.15)));
      clipDraw(f, fw.pts, () => {
        softTone(f, E.smooth(fw.pts), [[fw.band, WC(P.yel), 0.55, 8], [fw.dark, P.lilacS, 0.45, 10]]);
        for (const v of fw.veins) f.line([root, lerp(root, v, 0.45), v], 1.1, mix(WC(P.lilacD), '#000', 0.2), { op: 0.6 });
        for (const ln of fw.lines) crease(f, ln, 2.4, { col: mix(WC(P.loamL), '#000', 0.2), lit: WC(P.yelL), op: 0.7 }); // the cross-lines
        stains(f, E.smooth(fw.pts), E.bbox(fw.pts), WC(P.loamL), 0.025, 2.6, -1.4, 37, 0.45);
        X.mould(f, fw.mould, 16, 12, { col: P.pink, op: 0.5 });
      });
      X.fungalFur(f, fw.edge, 7, 1, { gaps: 0.1, col: WC(P.lilacL), col2: WC(P.yelL) });
    }, { shape: [...fw.pts] });
    X.eyes(f, eyesL, { lid: WC(P.pinkD), lidS: P.lilacS, iris: P.loamD, white: mix('#e9e0d3', P.lilacS, tone * 0.6), lashes: true });
    X.spores(f, lerp(fw.pts[0], hw.pts[Math.floor(hw.pts.length / 2)], 0.6), 60, 60, 10, 1.1);
  };
  // far wing: up and forward behind the head, foreshortened
  f.bone('wing_f');
  const r2 = add(WR, [30, -6]);
  wing(r2,
    { pts: [r2, [520, 210], [640, 110], [760, 52], [800, 70, 1], [776, 150], [720, 230], [640, 300], [540, 330]], veins: [[760, 64], [770, 130], [700, 240], [610, 300]], lines: [[[600, 140], [650, 210], [640, 300]], [[700, 90], [730, 170], [690, 250]]], band: [[660, 110], [740, 70], [760, 160], [690, 230]], dark: [[540, 220], [600, 160], [620, 300], [540, 320]], mould: [640, 240], edge: [[800, 70], [776, 150], [720, 230], [640, 300]] },
    { pts: [r2, [560, 330], [660, 340], [740, 380], [760, 440], [700, 480], [600, 460], [520, 410]], veins: [[740, 390], [700, 470], [600, 450]], rings: [[[680, 410], 22]], mould: [600, 420], edge: [[760, 440], [700, 480], [600, 460], [520, 410]] },
    0.35, [[[680, 410], 30, 0.3, 0.05]], [[[720, 150], 10], [[600, 440], 8]]);

  // ---- far leg and far arm behind the body
  const legLook = (tone) => SKN({ fill: mix(skin, skinS, tone) });
  const da = (K0, A0) => add(E.norm(sub(A0, K0)), [0.6, 0]);
  const legRig = (Hp, Kn, A, sfx, tone) => {
    const de = elb(Hp, Kn, A), dA = da(Kn, A);
    X.multi(f, () => X.fullLeg(f, Hp, Kn, A, 1, 40, 64, 44, legLook(tone), { swell: 0 }), [['thigh' + sfx, side(Kn, mul(de, -1), 22)], ['shin' + sfx, [side(Kn, de, 22), side(A, mul(dA, -1), 16)]], ['foot' + sfx, side(A, dA, 16)]]);
    f.bone('shin' + sfx);
    X.mould(f, lerp(Kn, A, 0.5), 10, 18, { col: P.lilac, op: 0.6 });
    f.flat(ell(add(A, [10, 30]), 28, 8, 0, 10), P.loamD, { op: 0.5 }); // loam on the foot
  };
  legRig(HF, KF, AF, '_f', 0.25);
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 34, 28, SKN({ fill: mix(skin, skinS, 0.2) }), '_f', { vein: false });
  f.bone('hand_f');
  X.openHand(f, lerp(EF, WF, 0.92), ang(EF, WF) + 0.05, 60, { look: SKN({ fill: mix(skin, skinS, 0.2) }), back: true, curl: 0.35, flip: true });

  // ---- near leg, torso and shift
  legRig(HN, KN, AN, '_n', 0);
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.3, 0.3], [0.06, 0.56, 0.42], [0.2, 0.66, 0.56], [0.4, 0.6, 0.6], [0.6, 0.5, 0.48], [0.8, 0.58, 0.54], [1.0, 0.66, 0.58]]);
  f.part(torso, SH({ maxShade: 20 }));
  clipDraw(f, E.smooth(torso), () => {
    softTone(f, E.smooth(torso), [[[S.at(-0.8, 0.0), S.at(-0.3, 0.0), S.at(-0.3, 1.0), S.at(-0.8, 1.0)], '#000', 0.3, 10]]);
    crease(f, [S.at(0.1, 0.34), S.at(0.3, 0.42), S.at(0.5, 0.4)], 2.2, { col: P.lilacS, lit: P.lilacL }); // under the breast
    crease(f, [S.at(-0.2, 0.5), S.at(-0.1, 0.7), S.at(0.0, 0.84)], 2, { col: P.lilacS, lit: P.lilacL });
    X.mould(f, S.at(-0.2, 0.62), 16, 14, { col: P.yel, op: 0.55 });
  });
  f.bone('skirt');
  const sk = [S.at(-0.6, 0.82), S.at(0.0, 0.86), S.at(0.56, 0.82), [520, 600], [532, 680], [516, 676, 1], [500, 700], [478, 684, 1], [456, 712], [432, 690, 1], [404, 706], [384, 684, 1], [366, 696], [370, 600]];
  X.cutHoles(f, [[[470, 640], 9]], () => {
    f.part(sk, SH({ maxShade: 20 }));
    clipDraw(f, E.smooth(sk), () => {
      softTone(f, E.smooth(sk), [[[[366, 560], [400, 560], [396, 700], [366, 700]], '#000', 0.35, 10]]);
      for (const q of [[[420, 540], [414, 610], [408, 690]], [[470, 540], [480, 610], [486, 680]]]) crease(f, q, 2.6, { col: P.lilacS, lit: P.lilacL });
      stains(f, E.smooth(sk), [360, 480, 540, 720], P.loamD, 0.035, 2.8, -1.3, 41, 0.75); // loam rising from the hem
      X.mould(f, [500, 600], 14, 12, { col: P.pink, op: 0.55 });
    });
    X.fungalFur(f, sk.slice(4, 13), 6, 1, { gaps: 0.4 });
  }, { shape: E.smooth(sk) });
  f.bone('pelvis');
  X.rope(f, [S.at(-0.6, 0.8), S.at(0.0, 0.84), S.at(0.56, 0.8)], 3, P.yelD, { lit: false });
  const kn = S.at(0.4, 0.82); X.rope(f, [kn, add(kn, [6, 30]), add(kn, [2, 58])], 2.4, P.yelD, { lit: false, fray: true });
  // a little bundle of dried flowers hanging at her girdle (her trade: a wise woman's herbs)
  f.part([add(kn, [-14, 4]), add(kn, [-4, 4]), add(kn, [2, 40]), add(kn, [-20, 40])], { fill: P.loamBL, shadow: P.loamBS, shade: 0.4, inkW: 1, cast: false, tex: 'grain' + seed });
  for (let i = 0; i < 3; i++) X.bloom(f, add(kn, [-16 + i * 8, 44 + (i % 2) * 6]), 6, [P.lilacD, P.yelD, P.pinkD][i], { n: 5, sy: 0.9 });

  // ---- near wing: back and up, the biggest shape; behind the near arm and the head's hair
  f.bone('wing_n');
  wing(WR,
    { pts: [WR, [360, 250], [250, 150], [110, 70], [70, 80, 1], [100, 170], [150, 260], [220, 330], [330, 350]], veins: [[90, 80], [110, 170], [170, 280], [260, 340]], lines: [[[290, 180], [240, 260], [270, 340]], [[190, 120], [160, 200], [200, 300]]], band: [[120, 80], [200, 110], [170, 210], [110, 160]], dark: [[300, 220], [360, 260], [340, 340], [280, 320]], mould: [230, 220], edge: [[70, 80], [100, 170], [150, 260], [220, 330]] },
    { pts: [WR, [330, 360], [230, 370], [150, 420], [140, 500], [200, 540], [300, 520], [370, 460]], veins: [[150, 430], [170, 520], [290, 520]], rings: [[[230, 450], 28]], mould: [300, 480], edge: [[150, 420], [140, 500], [200, 540], [300, 520]] },
    0, [[[230, 450], 40, -0.3, 0.75], [[210, 200], 24, -0.5, 0.35]], [[[170, 130], 11], [[300, 300], 9], [[180, 500], 10]]);

  // ---- the moth-fur ruff on the shoulders
  f.bone('torso');
  const ruff = [S.at(-0.62, 0.02), S.at(-0.4, -0.12), S.at(0.0, -0.16), S.at(0.5, -0.1), S.at(0.66, 0.06), S.at(0.5, 0.2), S.at(0.1, 0.22), S.at(-0.4, 0.2)].map((q, i) => add(q, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 6]));
  f.part(ruff, { fill: P.yelL, shadow: P.yelS, light: '#ffffff', shade: 0.4, tex: 'mfur' + seed, texOp: 0.9, inkW: 1.1, cast: true, k: 1, maxShade: 12 });
  X.fungalFur(f, [ruff[7], ruff[6], ruff[5], ruff[4]], 9, 1, { gaps: 0.05, col: P.yelL, col2: P.lilacL });
  X.fungalFur(f, [ruff[0], ruff[1], ruff[2], ruff[3]], 8, -1, { gaps: 0.05, col: P.yelL, col2: P.lilacL });

  // ---- head: a pale, long face, heavy lids, dark irises; pale hair in hanks; feathered antennae from the brow
  f.bone('head');
  f.part(limb(neck0, add(HC, [-14, 28]), 34, 28, { steps: 6 }), SKN({ maxShade: 10 }));
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin, jaw: 0.92, chin: 0.02, nose: 0.94, hook: 0.1, mouth: 'set', squint: 0.45, browDown: 0.02, faceShade: 0.68, faceHatch: false, jawShade: 0.22, lips: true, lashes: true, browW: 0.032,
    iris: P.loamD, eyeWhite: '#cfc4c4', hairCol: mix(P.bone, P.grey, 0.4), browCol: P.greyD,
    hairBack: [[-0.5, 0.5], [-0.56, 0.0], [-0.42, -0.42], [-0.1, -0.56], [0.2, -0.5], [0.0, -0.3], [-0.24, 0.1], [-0.3, 0.6]],
    hair: [[-0.4, -0.06], [-0.36, -0.36], [-0.12, -0.54], [0.16, -0.53], [0.32, -0.4], [0.24, -0.34], [0.04, -0.38], [-0.14, -0.28], [-0.24, -0.1], [-0.3, 0.06]],
  });
  f.flat(hF(ell([0.12, -0.02], 0.1, 0.045, 0, 10)), P.lilacS, { op: 0.4 }); // the dusky under-eye
  X.mould(f, hF([[-0.06, 0.2]])[0], 8, 7, { col: P.lilac, op: 0.5 });
  f.bone('hair');
  for (const [r0, l, w] of [[[-0.42, 0.0], 150, 18], [[-0.48, -0.2], 190, 20], [[-0.34, 0.2], 120, 14], [[-0.2, 0.3], 80, 12]]) X.hairClump(f, [hF([r0])[0], add(hF([r0])[0], [-6, l * 0.4]), add(hF([r0])[0], [-2, l * 0.75]), add(hF([r0])[0], [-8, l])], w, { pal: [mix(P.bone, P.grey, 0.4), mix(P.bone, P.grey, 0.6), P.greyL], n: 3 });
  f.bone('antennae');
  for (const [b0, tipP, tone] of [[hF([[0.14, -0.5]])[0], add(HC, [-30, -170]), 0.3], [hF([[0.24, -0.46]])[0], add(HC, [70, -160]), 0]]) {
    const ctrl = [b0, add(b0, [4, -40]), lerp(add(b0, [4, -40]), tipP, 0.6), tipP], Cn = spline(ctrl, 4), n = Cn.length;
    for (let i = 2; i < n - 1; i++) { const d = E.norm(sub(Cn[i + 1], Cn[i - 1])), nn = [-d[1], d[0]], l = 16 * Math.sin(Math.PI * i / n) + 3; for (const sd of [1, -1]) f.line([Cn[i], add(add(Cn[i], mul(nn, sd * l)), mul(d, l * 0.5))], 1.1, mix(P.yelD, P.loamD, tone), { op: 0.85 }); } // the feathered barbs
    f.stroke(Cn, 5, mix(P.loamL, P.loamD, tone));
    f.line(Cn.slice(1, -1).map(q => add(q, [1, -1])), 1, P.yelL, { op: 0.6 });
  }

  // ---- near arm: bent, the hand lifted to the breast, fingers spread
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 36, 30, SKN(), '_n', { vein: false });
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, SN, lerp(SN, EN, 0.45), 44, 40, { depth: 7, teeth: 5 }), SH({ maxShade: 10, cast: false })); // the shift's short sleeve
  f.bone('forearm_n');
  X.mould(f, lp(EN, WN, 0.5, 2), 8, 12, { col: P.lilac, op: 0.6 });
  f.bone('hand_n');
  X.openHand(f, lerp(EN, WN, 0.94), ang(EN, WN) - 0.5, 62, { look: SKN(), back: false, curl: 0.25, spread: 0.32 });
  X.spores(f, add(WN, [30, 0]), 30, 30, 6);

  f.bone('root');
  X.loamGround(f, 300, 600, gy, { depth: 14, petals: 3 });
  X.spores(f, [300, 700], 160, 40, 18, 1.1); // scale dust settling
  return f;
}

// ------------------------------------------------------------------ ROOT HORROR (cast, large 1.6)
// The garden's roots grew a mouth. A knot of black roots, braided and twisted round each other, rises out of the loam on
// buttress roots that dive back into the soil, and bends forward at the top like a lamprey rearing; its end opens into a
// ring-shaped mouth (seen three-quarters, facing the party) lined with three rings of thorn teeth curving into a throat
// that is simply gone. Free roots writhe up from the knot, one reaching forward to grab. Eyes have opened in the bark
// round the mouth and down the knot, blinking out of time; pastel buds swell along the roots.
// Toxin: buds and blooms, bracket shelves on the knot, mould bloom, fungal fur, galls. Void: the throat (flat black to a
// clean rim), a clean round hole right through one free root, the eyes.
// Rig: root (ground, buttress roots) ; trunk_1 > trunk_2 > head > lips ; arm_1..arm_4 (free roots on the trunk bones).
// Motion: idle the roots writhing (arms, trunk_2); attack a root grab and bite (arm_1 sweeps forward, head lunges).
function rootHorror() {
  const [CW, CH] = TIERS.large, seed = 1407;
  const f = new Fig(X.base(seed, CH, { grimeY: CH - 30 - 120 })); X.textures(f);
  const gy = f.o.groundY;
  const RT = (o = {}) => Object.assign({ col: mix(P.loam, P.loamL, 0.5), shadow: P.loamD, light: P.loamB, pow: 0.6, knot: 0.16 }, o);
  const EYE = { lid: P.pinkD, lidS: P.pinkS, iris: P.yelD };
  const trunk = [[420, gy + 10], [414, 930], [426, 790], [470, 640], [540, 520], [620, 430], [690, 380]];
  const TW = [250, 210, 170, 150, 150, 170, 196];
  const M = [722, 360], mA = -0.18, mrx = 70, mry = 136;  // the mouth: centre, tilt, half-axes (3/4 view facing +x)
  f.joint('trunk_1', [420, 1000]).joint('trunk_2', [460, 660], 'trunk_1').joint('head', [600, 470], 'trunk_2').joint('lips', M, 'head');
  f.joint('arm_1', [540, 560], 'trunk_2').joint('arm_2', [470, 650], 'trunk_2').joint('arm_3', [430, 820], 'trunk_1').joint('arm_4', [560, 500], 'head');
  const bud = (c, r, col) => { const pts = [add(c, [0, -r * 1.3]), add(c, [r * 0.8, -r * 0.2]), add(c, [r * 0.5, r * 0.7]), add(c, [-r * 0.5, r * 0.7]), add(c, [-r * 0.8, -r * 0.2])]; f.part(pts, { fill: col, shadow: mix(col, P.lilacS, 0.5), light: mix(col, '#ffffff', 0.4), shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, k: 1 }); f.line([add(c, [-r * 0.5, r * 0.5]), add(c, [0, -r * 1.1])], 0.8, mix(col, P.lilacS, 0.5), { op: 0.6 }); f.part([add(c, [-r * 0.7, r * 0.5]), add(c, [0, r * 0.2]), add(c, [r * 0.7, r * 0.5]), add(c, [0, r * 1.1])], { fill: P.rot, shadow: P.rotS, shade: 0.4, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); };
  const buds = (C, n) => { for (let i = 0; i < n; i++) { const q = C[Math.floor(R(f, 0.15, 0.9) * C.length)]; bud(add(q, [R(f, -6, 6), R(f, -10, -2)]), R(f, 5, 9), [P.pink, P.lilac, P.yel][i % 3]); } };
  // gnarl a root's path: densify it and kink it sideways so it never reads as a smooth tentacle
  const gnarl = pts => { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], d = E.norm(sub(b, a)), n = [-d[1], d[0]]; out.push(add(lerp(a, b, 0.5), mul(n, R(f, -14, 14)))); out.push(b); } return out; };
  const freeRoot = (bone, pts, w0, o = {}) => { f.bone(bone); const r = X.root(f, gnarl(pts), w0 * 1.25, 3, Object.assign(RT(), { rootlets: 7, ph: f.r() * 6, knot: 0.22 }, o)); buds(r.C, o.buds ?? 3); return r; };

  // ---- behind: free roots on the far side, the far buttress roots
  freeRoot('arm_4', [[560, 500], [520, 380], [470, 260], [500, 150], [570, 90], [640, 104]], 40);
  freeRoot('arm_3', [[420, 820], [330, 770], [240, 700], [170, 600], [150, 480], [190, 400]], 46);
  f.bone('root');
  for (const pts of [[[470, 1040], [560, 1030], [640, 1050], [700, gy + 4]], [[380, 1040], [300, 1030], [230, 1046], [170, gy + 4]]]) X.root(f, pts, 50, 10, RT({ col: P.loam, rootlets: 3 }));

  // ---- the knot: one mass, then braided strands winding round it so it reads as roots twisted together
  const TC = spline(trunk, 6), TWs = TC.map((_, i) => { const t = i / (TC.length - 1), k = t * (TW.length - 1), j = Math.min(TW.length - 2, Math.floor(k)); return TW[j] + (TW[j + 1] - TW[j]) * (k - j); });
  const mass = ribbon(TC, TWs);
  const draw = () => {
    f.part(mass, { fill: mix(P.loam, P.loamL, 0.5), shadow: P.loamD, light: P.loamB, shade: 0.42, tex: 'bark' + seed, texOp: 0.5, maxShade: 40, hatch: true });
    clipDraw(f, mass, () => {
      softTone(f, E.smooth(mass), [[[[300, 1000], [380, 900], [400, 700], [480, 560], [430, 560], [340, 700], [300, 900]], P.loamD, 0.6, 18], [[[520, 600], [600, 480], [680, 430], [620, 520], [540, 640]], P.loamBL, 0.35, 16]]);
      for (let k = 0; k < 4; k++) {
        const ph = k * Math.PI / 2, pts = TC.map((c, i) => { const t = i / (TC.length - 1), d = E.norm(sub(TC[Math.min(TC.length - 1, i + 1)], TC[Math.max(0, i - 1)])), n = [-d[1], d[0]]; return add(c, mul(n, Math.sin(t * 7 + ph) * TWs[i] * 0.38)); });
        // only the stretches where the strand passes in front (cos > 0) are drawn as raised strands
        let run = [];
        pts.forEach((q, i) => { const t = i / (TC.length - 1), front = Math.cos(t * 7 + ph) > -0.1; if (front) run.push([q, TWs[i] * 0.3]); if ((!front || i === pts.length - 1) && run.length > 3) { X.root(f, run.map(r => r[0]), run[0][1], run[run.length - 1][1], RT({ col: mix(P.loamL, P.loamB, 0.12 * k), cast: true, texOp: 0.4, pow: 1, knot: 0.06 })); run = []; } else if (!front) run = []; });
      }
      X.mould(f, [470, 760], 30, 40, { col: P.lilac, op: 0.6 });
      X.mould(f, [560, 560], 24, 18, { col: P.yel, op: 0.55 });
    });
  };
  X.multi(f, draw, [['trunk_1', side([450, 690], [0.2, 1], 60)], ['trunk_2', [side([450, 690], [-0.2, -1], 60), side([600, 470], [-0.6, 0.8], 50)]], ['head', side([600, 470], [0.6, -0.8], 50)]]);
  f.bone('trunk_1');
  for (const [c, r] of [[[352, 960], 26], [[330, 920], 16], [[372, 930], 12], [[340, 860], 20], [[356, 820], 11], [[322, 990], 13]]) X.puffball(f, c, r, { col: [mix(P.yel, P.loamB, 0.3), mix(P.bone, P.yelD, 0.4)][r % 2], smoke: r > 20 }); // a crop of puffballs on the knot
  X.pustules(f, [480, 900], 30, 40, 6, 5, 9, { col: P.pinkD });
  X.eyes(f, [[[480, 960], 36, -0.1, 0.6], [[520, 846], 24, 0.2, 0.05], [[446, 730], 28, -0.3, 0.8]], EYE);
  f.bone('trunk_2');
  X.eyes(f, [[[536, 610], 30, -0.6, 0.4], [[604, 520], 22, -0.6, 0.85]], EYE);
  X.fungalFur(f, [[340, 900], [360, 780], [410, 660], [480, 560], [560, 470]], 10, 1, { gaps: 0.3 });
  buds(TC.slice(10), 6);

  // ---- the mouth: a thick barked lip ringing a throat that is gone; three rings of thorn teeth curving in
  f.bone('lips');
  const eO = ell(M, mrx, mry, mA, 40), eI = ell(M, mrx * 0.7, mry * 0.74, mA, 40);
  f.flat(eI, P.void);
  // teeth: rings of hooked thorns pointing into the throat, smaller and darker deeper in; the far side's teeth show
  // their backs, the near side's their points
  for (const [k, n, L, tone] of [[0.98, 22, 30, 0], [0.8, 18, 22, 0.25], [0.6, 14, 15, 0.5]]) {
    for (let i = 0; i < n; i++) {
      const t = i / n * Math.PI * 2 + k * 0.3, b0 = add(M, rot([Math.cos(t) * mrx * 0.7 * k, Math.sin(t) * mry * 0.74 * k], mA)), inw = E.norm(sub(M, b0)), tg = [-inw[1], inw[0]];
      const l = L * R(f, 0.8, 1.2), w = l * 0.36, tipP = add(add(b0, mul(inw, l)), mul(tg, l * 0.25));
      f.part([add(b0, mul(tg, w)), add(add(b0, mul(inw, l * 0.5)), mul(tg, w * 0.8)), [...tipP, 1], add(b0, mul(tg, -w))], { fill: mix(P.bone, P.loamBL, 0.3 + tone * 0.5), shadow: P.loamD, shade: 0.4, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, k: 0.7 });
      f.line([lerp(b0, tipP, 0.3), lerp(b0, tipP, 0.85)], 0.8, P.boneL, { op: 0.6 - tone * 0.5 });
    }
  }
  f.line(ell(M, mrx * 0.4, mry * 0.44, mA, 30).concat([ell(M, mrx * 0.4, mry * 0.44, mA, 30)[0]]), 1.2, P.rim, { op: 0.8 }); // the throat's clean edge, where it stops being a throat
  // the lip itself: an annulus of bark, swollen, its rim worn pale, galls and buds on it
  const lipD = E.smooth(eO) + ' ' + E.smooth(eI.slice().reverse());
  f.part(lipD, { bbPts: eO, fill: P.loamL, shadow: P.loamD, light: P.loamBL, shade: 0.4, tex: 'bark' + seed, texOp: 0.5, maxShade: 18, inkW: 1.6, inkHeavy: 3 });
  clipDraw(f, lipD, () => {
    for (let i = 0; i < 26; i++) { const t = i / 26 * Math.PI * 2, a = add(M, rot([Math.cos(t) * mrx * 0.72, Math.sin(t) * mry * 0.76], mA)), b = add(M, rot([Math.cos(t) * mrx * 1.02, Math.sin(t) * mry * 1.02], mA)); f.line([a, lerp(a, b, 0.5), b], 1.1, P.loamD, { op: 0.6 }); } // radial bark furrows
    f.line(ell(M, mrx * 0.76, mry * 0.8, mA, 40).slice(24, 38), 2, P.loamBL, { op: 0.6 });
  });
  for (let i = 0; i < 7; i++) { const t = R(f, -1.2, 1.6); bud(add(M, rot([Math.cos(t) * mrx * 1.02, Math.sin(t) * mry * 1.02], mA)), R(f, 6, 10), [P.pink, P.lilac, P.yel][i % 3]); }
  f.bone('head');
  X.eyes(f, [[add(M, [-104, -112]), 34, -0.5, 0.7], [add(M, [-112, 40]), 26, 0.3, 0.0], [add(M, [-76, 150]), 28, 0.4, 0.55], [add(M, [-160, -40]), 20, -0.2, 0.9]], EYE);
  X.bloom(f, add(M, [-60, -150]), 16, P.pink, { n: 6, sy: 0.75, tilt: -0.4 });
  X.bloom(f, add(M, [-120, 100]), 12, P.lilacL, { n: 5, sy: 0.8 });

  // ---- free roots in front: one reaching forward to grab, one rising
  const r1 = freeRoot('arm_1', [[540, 560], [610, 610], [700, 640], [790, 610], [850, 540], [860, 470]], 48);
  f.bone('arm_2');
  X.cutHoles(f, [[[300, 520], 10]], () => { const r2 = X.root(f, gnarl([[470, 650], [390, 600], [320, 540], [290, 440], [320, 340], [380, 290]]), 56, 3, RT({ rootlets: 7, knot: 0.22 })); buds(r2.C, 3); }, { shape: null });

  // ---- the ground: loam heaped round the buttresses where they broke out
  f.bone('root');
  for (const pts of [[[360, 1000], [290, 1030], [220, 1052], [150, gy + 2]], [[490, 1000], [580, 1030], [660, 1050], [740, gy + 2]], [[400, 1020], [350, 1056], [320, gy + 6]], [[460, 1020], [510, 1060], [540, gy + 6]]]) X.root(f, pts, 86, 14, RT({ col: P.loam, rootlets: 4, cast: false }));
  X.loamGround(f, 120, 800, gy, { depth: 22, petals: 6 });
  for (const [x, w] of [[300, 120], [560, 140]]) f.part([[x - w / 2, gy + 2], [x - w * 0.3, gy - 18], [x, gy - 26], [x + w * 0.3, gy - 16], [x + w / 2, gy + 2]], { fill: P.loam, shadow: P.loamD, light: P.loamL, shade: 0.3, inkW: 1.1, cast: false, hatch: false, grime: false, tex: 'mottle' + seed, texOp: 0.6 }); // heaped loam
  return f;
}

// ------------------------------------------------------------------ BLIGHT DRYAD (elite 2.2)
// The spirit of an oak. The oak is dead; she is not. A tall, thin woman's shape of dead grey oak: below the hips she is
// still the trunk, a split skirt of bark flaring into roots that grip the loam; above, a narrow carved body, cracked and
// hollow. Her arms are the oak's dead limbs: the near one raised high, forking into branches and bare twigs above her;
// the far one reaching forward and down, its twig fingers spread. A carved-bark face, long and grieving, sap running from
// the knot-hole eyes; dead twigs sweep back from her head for hair. True size 2.2 (1408 px): the canvas is heightened to
// 1100 x 1500 at the same scale (guide section 2), and the raised branches break the frame top.
// Toxin: bracket fungus shelved on both shoulders and up the trunk, leaves of rot clinging to the twigs and girdling her
// hips, mould bloom and lichen, fungal fur in every split. Void: a clean round hole where her heart-wood was, right through
// her chest; eyes glinting in the rotten hollow of the trunk.
// Rig: trunk (root, at the base) > pelvis > torso > head ; arms upperarm/forearm/hand _n and _f (branches on the hands) ;
// roots (root). Motion: idle a creaking sway (trunk); attack roots bursting from the ground (roots; arms sweep down).
function blightDryad() {
  const CW = 1100, CH = 1500, seed = 1402;
  const f = new Fig(X.base(seed, CH, { grimeY: CH - 30 - 300 })); X.textures(f);
  const gy = f.o.groundY, H = 200;
  const WD = (o = {}) => Object.assign({ fill: P.grey, shadow: P.greyS, light: P.greyL, shade: 0.42, tex: 'bark' + seed, texOp: 0.45 }, o);
  const N = [556, 330], C = [494, 560], Pv = [520, 780];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.1), SF = S.at(0.36, 0.08);
  const EN = [430, 250], WN = [400, 120];               // near limb raised high behind the head
  const EF = [680, 520], WF = [786, 610];               // far limb reaching forward and down
  const neck0 = S.at(0.08, -0.06), HC = [590, 220], hA = 0.06;
  const base = [506, gy - 20];
  f.joint('trunk', base).joint('pelvis', Pv, 'trunk').joint('torso', S.at(0, 0.8), 'pelvis').joint('head', neck0, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('roots', [506, gy], null);
  const twigs = (b, a, len, w, depth, tone = 0) => X.coral(f, b, a, len, w, depth, { col: mix(P.grey, P.greyS, tone), point: true, wander: 0.3, minW: 1.6, taper: 0.72, fork: 0.85, look: { tex: 'bark' + seed, texOp: 0.35, shadow: P.greyS, light: P.greyL, shade: 0.4, maxShade: 6 } });
  const split2 = (pts, w) => { X.rotSplit(f, pts, w, { lip: P.greyS, inner: P.loamD, edge: P.greyL }); };
  // bark plates with depth: the furrows are the dark showing between plates; the plates are laid in columns that twist
  // (x shifts with y, o.twist), each lit on its upper-right lip; o.swell(p) widens plates over the body's forms
  // bark in Living Ink (reviewer rebuild): the body is treated as a twisting column. Each row's span across the shape
  // gives a centre and half-width, and bark columns are laid round it by angle (theta, -pi/2 at the far edge to +pi/2 at
  // the near), so plates foreshorten toward the edges. Column widths vary (0.45x to 1.8x), plate heights vary, and the
  // whole grain spirals round the twist of the body (o.twist rad per 100 px, plus o.wave). Plates bend round knots (the
  // grain parts and closes again), are shaded by the cylinder (lit on the right in drawing space, upper left after the
  // flip), lipped with light on their lit edge and dark under their lower end. Splits run along the grain; burls swell
  // over it with swirled grain; knots are rings with a rotten core; hoof fungus sits in the furrows.
  const barkPlates = (clip, bb, o = {}) => {
    const poly = typeof clip === 'string' ? null : clip;
    const span = y => { const xs = []; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; if ((a[1] - y) * (b[1] - y) <= 0 && a[1] !== b[1]) xs.push(a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])); } return xs.length >= 2 ? [Math.min(...xs), Math.max(...xs)] : null; };
    const knots = o.knots || [], tw = o.twist ?? 0.3, wave = o.wave ?? 0.25;
    const th0 = y => tw * (y - bb[1]) / 100 + wave * Math.sin((y - bb[1]) / 170);
    const map = (th, y) => { const sp = span(Math.max(bb[1] + 1, Math.min(bb[3] - 1, y))); if (!sp) return null; const cx = (sp[0] + sp[1]) / 2, hw = (sp[1] - sp[0]) / 2 * 1.04; let x = cx + hw * Math.sin(Math.max(-Math.PI / 2, Math.min(Math.PI / 2, th))); for (const [kc, kr] of knots) { const dx = x - kc[0], dy = y - kc[1], fall = Math.exp(-(dx * dx + dy * dy * 0.45) / (2 * (kr * 1.7) ** 2)); x += Math.sign(dx || 1) * kr * 1.1 * fall; } return [x, y]; };
    clipDraw(f, clip, () => {
      f.flat([[bb[0], bb[1]], [bb[2], bb[1]], [bb[2], bb[3]], [bb[0], bb[3]]], mix(P.greyS, P.loamD, 0.35), { op: o.furrowOp ?? 0.8 });
      const base = o.dth ?? 0.26, cols = []; let th = -Math.PI / 2 - 0.9;
      while (th < Math.PI / 2 + 0.9) { const w = base * (0.45 + 1.35 * Math.pow(f.r(), 1.4)); cols.push([th, th + w]); th += w; }
      for (const [ta, tb] of cols) {
        let y = bb[1] - R(f, 0, o.h1 ?? 90);
        while (y < bb[3]) {
          const h = R(f, o.h0 ?? 40, o.h1 ?? 110), y1 = y - h * R(f, 0.15, 0.35) + h, g = R(f, 1.2, 2.6);
          const L = [], Rr = [];
          const pinch = R(f, 0.25, 0.6), lean = R(f, -0.25, 0.25); for (let k = 0; k <= 6; k++) { const u = k / 6, yy = y + 2 + (h - 4) * u, off = th0(yy), pa = map(ta + off, yy), pb = map(tb + off, yy); if (!pa || !pb) continue; const m = (pa[0] + pb[0]) / 2 + (pb[0] - pa[0]) * lean * (u - 0.5), hw2 = Math.max(0.6, (pb[0] - pa[0]) / 2 - g) * (pinch + (1 - pinch) * Math.pow(Math.sin(Math.PI * u), 0.6)); L.push([m - hw2 + R(f, -1.2, 1.2), yy]); Rr.push([m + hw2 + R(f, -1.2, 1.2), yy]); } // a long ridge, pinched at both ends so neighbours braid
          if (L.length >= 2) {
            const tm = (ta + tb) / 2 + th0(y + h / 2), lit = 0.5 + 0.5 * Math.sin(tm + 0.55), pl = [...L, ...Rr.reverse()];
            const fill = mix(mix(P.greyS, P.greyL, 0.18 + 0.62 * lit), f.r() > 0.5 ? P.loamB : P.grey, R(f, 0, 0.22));
            f.part(pl, WD({ fill, shadow: mix(P.greyS, P.loamD, 0.3), maxShade: 4, inkW: 0.7, inkHeavy: 1.2, cast: false, texOp: 0.3, hatch: lit < 0.4, k: 0.55 }));
            const rr = pl.slice(L.length); f.line(rr.slice().reverse(), lit > 0.35 ? 1.2 : 0.8, P.greyL, { op: 0.25 + 0.45 * lit }); // the lit edge
            f.line([L[L.length - 1], rr[0]].map(q => add(q, [0, 1.5])), 1.4, P.loamD, { op: 0.6 }); // dark under the lower end
            if (f.r() < 0.35) { const q = lerp(L[1], rr[rr.length - 2], R(f, 0.3, 0.7)); f.line([q, add(q, [R(f, -2, 2), R(f, 6, 14)])], 1, P.loamD, { op: 0.6 }); } // a check across the plate
          }
          y = y1;
        }
      }
      // the column turning away: deep shade on the far (left) edge, a cool fill on the near
      if (poly) { const ys = []; for (let y = bb[1]; y <= bb[3]; y += 30) { const sp = span(y); if (sp) ys.push([y, sp]); } if (ys.length > 2) softTone(f, E.smooth(poly), [[[...ys.map(([y, sp]) => [sp[0] - 10, y]), ...ys.slice().reverse().map(([y, sp]) => [sp[0] + (sp[1] - sp[0]) * 0.28, y])], P.loamD, 0.55, 12]]); }
      // knots: a lip of bark rolled round a rotten core, rings, the grain parted round them
      for (const [kc, kr] of knots) { f.part(ell(kc, kr * 1.25, kr * 1.7, 0, 16).map(q => add(q, [R(f, -2, 2), R(f, -2, 2)])), WD({ fill: mix(P.grey, P.greyS, 0.25), maxShade: 6, cast: true, castOp: 0.4, inkW: 1.2, inkHeavy: 2 })); for (const k2 of [0.9, 0.65]) f.line(ell(kc, kr * k2, kr * k2 * 1.35, 0, 14).concat([ell(kc, kr * k2, kr * k2 * 1.35, 0, 14)[0]]), 1.2, P.greyS, { op: 0.7 }); f.flat(ell(add(kc, [-1, 2]), kr * 0.42, kr * 0.62, 0, 12), P.loamD); f.flat(ell(add(kc, [-2, 4]), kr * 0.24, kr * 0.36, 0, 10), P.void, { op: 0.85 }); f.line(ell(kc, kr * 1.2, kr * 1.65, 0, 16).slice(1, 6), 1.4, P.greyL, { op: 0.6 }); }
      // burls: the wood swelling in a lump, its grain swirled round, lit on top and casting a shadow under it
      for (const [bc, rx, ry] of (o.burls || [])) { const bp = ell(bc, rx, ry, 0.2, 18).map(q => add(q, [R(f, -rx * 0.08, rx * 0.08), R(f, -ry * 0.08, ry * 0.08)])); f.part(bp, WD({ fill: mix(P.grey, P.greyL, 0.15), maxShade: Math.min(rx, ry) * 0.4, cast: true, castOp: 0.5, inkW: 1.3, inkHeavy: 2.4, texOp: 0.3 })); clipDraw(f, bp, () => { for (let k = 1; k <= 4; k++) { const e = ell(add(bc, [R(f, -3, 3), R(f, -3, 3)]), rx * (1 - k * 0.2), ry * (1 - k * 0.2), 0.2 + k * 0.4, 14); f.line(e.slice(0, 11), 1.1, P.greyS, { op: 0.6 }); } softTone(f, E.smooth(bp), [[ell(add(bc, [rx * 0.3, -ry * 0.35]), rx * 0.5, ry * 0.4, 0, 10), P.greyL, 0.5, 5]]); for (let k = 0; k < 4; k++) f.flat(ell(add(bc, [R(f, -rx * 0.5, rx * 0.5), R(f, -ry * 0.5, ry * 0.5)]), 2.2, 1.8, 0, 6), P.loamD, { op: 0.8 }); }); }
      // splits along the grain, following the spiral
      for (const [thS, ya, yb, w] of (o.splits || [])) { const pts = []; for (let yy = ya; yy <= yb; yy += (yb - ya) / 6) { const q = map(thS + th0(yy), yy); if (q) pts.push(add(q, [R(f, -2, 2), 0])); } if (pts.length > 2) X.rotSplit(f, pts, w, { lip: P.greyS, inner: P.loamD, edge: P.greyL }); }
    });
    for (const [fc, fa, fw, fh] of (o.fungus || [])) X.bracket(f, fc, fa, fw, fh, { side: true, kind: 'hoof', col: mix(P.yelD, P.loamB, 0.3), droop: 0.08 });
  };
  const leaves = (q, n, s0) => { for (let i = 0; i < n; i++) X.leaf(f, add(q, [R(f, -10, 10), R(f, -6, 6)]), Math.PI / 2 + R(f, -0.8, 0.8), s0 * R(f, 0.7, 1.2), { col: [P.rot, P.loamB, P.rotL][i % 3] }); };

  // ---- far limb (behind the body): a dead oak limb reaching forward and down, twig fingers spread
  f.bone('upperarm_f');
  f.part(X.jointLimb(SF, EF, lerp(EF, WF, 0.6), [54, 40, 34], { point: 0.25 }), WD({ fill: mix(P.grey, P.greyS, 0.25), maxShade: 12 }));
  f.bone('forearm_f');
  f.part(limb(EF, WF, 42, 20, { steps: 10, p: [[0.25, 0.18, 0.15]], q: [[0.6, 0.1, 0.1]] }), WD({ fill: mix(P.grey, P.greyS, 0.25), maxShade: 8 }));
  for (const [q, r] of [[EF, 24], [WF, 20]]) { f.part(ell(q, r, r * 0.8, ang(SF, EF), 12).map(p2 => add(p2, [(f.r() - 0.5) * 4, (f.r() - 0.5) * 4])), WD({ fill: mix(P.grey, P.greyS, 0.3), maxShade: 6, cast: false })); f.line(ell(q, r * 0.5, r * 0.4, 0, 10).concat([ell(q, r * 0.5, r * 0.4, 0, 10)[0]]), 1.1, P.greyS, { op: 0.6 }); } // knuckle knots
  split2([lp(SF, EF, 0.2, 4), lp(SF, EF, 0.6, -6), lp(SF, EF, 0.9, 2)], 3);
  f.bone('hand_f');
  for (const [a, l] of [[0.2, 150], [0.75, 130], [-0.3, 110], [1.2, 100]]) twigs(WF, ang(EF, WF) + a - 0.3, l, 20, 2, 0.25);
  leaves(add(WF, [80, 60]), 2, 26);

  // ---- the trunk: a split skirt of bark from the hips to the ground, flaring into roots; a rotten hollow with eyes
  f.bone('trunk');
  const tr = [S.at(-0.52, 0.9), S.at(0.0, 0.96), S.at(0.5, 0.9), [636, 880], [632, 960], [606, 1060], [584, 1150], [588, 1250], [620, 1340], [700, 1404], [800, 1440], [880, gy - 2], [760, gy + 4], [690, gy - 30], [640, gy + 4], [560, gy - 24], [480, gy + 6], [420, gy - 26], [350, gy + 4], [200, gy - 2], [290, 1430], [370, 1380], [420, 1290], [440, 1180], [432, 1070], [410, 960], [402, 890]];
  const hol = [[492, 1086], [520, 1060], [548, 1080], [556, 1150], [540, 1210], [510, 1220], [486, 1180]];
  f.part(tr, WD({ maxShade: 40 }));
  clipDraw(f, tr, () => {
    softTone(f, E.smooth(tr), [[[[300, 900], [440, 900], [430, gy], [300, gy]], '#000', 0.4, 20], [[[560, 920], [620, 920], [650, 1300], [580, 1300]], P.greyL, 0.3, 16]]);
    barkPlates(tr, [200, 860, 900, gy + 10], { twist: 0.2, wave: 0.3, dth: 0.17, h0: 110, h1: 260, knots: [[[562, 990], 14], [[452, 1290], 18], [[600, 1380], 11]], burls: [[[470, 1150], 34, 26], [[640, 1420], 22, 16]], splits: [[-0.6, 900, 1260, 3.4], [0.5, 1000, 1400, 3], [0.05, 1180, 1440, 2.6]], fungus: [[[436, 1060], Math.PI + 0.2, 22, 44], [[612, 1236], -0.1, 20, 40]] });
    softTone(f, E.smooth(tr), [[[[400, 880], [520, 900], [520, 1040], [420, 1020]], P.greyL, 0.4, 20], [[[560, 1000], [640, 900], [640, 1100], [580, 1150]], '#000', 0.3, 16]]); // the hip swelling under the bark, the thigh turning away
    crease(f, [[600, 1110], [560, 1150], [520, 1160]], 3.4, { col: P.loamD, lit: P.greyL }); // the knee's fold in the trunk
    stains(f, E.smooth(tr), [290, 880, 780, gy + 10], P.loamD, 0.02, 2.6, -1.4, 51, 0.55);
    X.mould(f, [580, 1240], 30, 40, { col: P.lilac, op: 0.6 });
    X.mould(f, [430, 1000], 22, 30, { col: P.yel, op: 0.55 });
    X.moss(f, [[340, 1400], [460, 1420], [580, 1410], [700, 1420]], 9, { stalks: true });
  });
  f.flat(hol, P.loamD);
  f.flat(hol.map(q => add(lerp(q, [520, 1140], 0.3), [3, 4])), P.void);
  X.eyes(f, [[[512, 1120], 20, -0.1, 0.6], [[530, 1170], 14, 0.2, 0.85]], { lid: P.loamL, lidS: P.loamD, iris: P.yel });
  X.fungalFur(f, hol.concat([hol[0]]), 9, 1, { gaps: 0.2 });
  X.brackets(f, [[630, 960], [592, 1150], [604, 1290]], 5, -0.05, 46, 90, { side: true, kind: 'hoof', cols: [mix(P.yelD, P.loamB, 0.25), mix(P.yelD, P.grey, 0.3), mix(P.yel, P.loamB, 0.35)] });
  // ---- the roots, gripping the loam
  f.bone('roots');
  for (const pts of [[[380, 1400], [300, 1440], [220, gy - 2], [150, gy + 6]], [[640, 1400], [720, 1436], [820, gy - 4], [900, gy + 6]], [[470, 1430], [440, gy + 4], [420, gy + 14]], [[560, 1430], [600, gy + 2], [640, gy + 12]]]) X.root(f, pts, 90, 8, { col: P.grey, shadow: P.greyS, light: P.greyL, rootlets: 4, pow: 0.55, cast: false, knot: 0.2 });
  X.loamGround(f, 120, 940, gy, { depth: 22, petals: 6 });

  // ---- the body: a narrow carved woman's shape, cracked and hollow; the void where her heart-wood was
  f.bone('torso');
  const torso = S.shape([[-0.05, 0.22, 0.22], [0.08, 0.44, 0.38], [0.22, 0.46, 0.56], [0.34, 0.42, 0.52], [0.5, 0.3, 0.36], [0.64, 0.26, 0.3], [0.8, 0.4, 0.42], [0.94, 0.52, 0.5], [1.02, 0.5, 0.48]]);
  const vh = [S.at(0.06, 0.36), 30];
  X.cutHoles(f, [vh], () => {
    f.part(torso, WD({ maxShade: 26 }));
    clipDraw(f, E.smooth(torso), () => {
      softTone(f, E.smooth(torso), [[[S.at(-0.6, 0), S.at(-0.2, 0), S.at(-0.2, 1), S.at(-0.6, 1)], '#000', 0.35, 12], [[S.at(0.2, 0.15), S.at(0.5, 0.15), S.at(0.5, 0.5), S.at(0.2, 0.5)], P.greyL, 0.3, 10]]);
      barkPlates(torso, E.bbox(torso), { twist: -0.42, wave: 0.4, dth: 0.3, h0: 60, h1: 150, knots: [[S.at(-0.22, 0.6), 9], [S.at(0.3, 0.1), 7]], burls: [[S.at(0.26, 0.74), 15, 11]], splits: [[-0.9, S.at(0, 0.15)[1], S.at(0, 0.5)[1], 2.2]], fungus: [] });
      softTone(f, E.smooth(torso), [[ell(S.at(0.36, 0.28), 40, 34, 0, 14), P.greyL, 0.55, 10], [[S.at(0.1, 0.38), S.at(0.5, 0.4), S.at(0.5, 0.46), S.at(0.1, 0.44)], '#000', 0.45, 6]]); // the breast swelling under the bark, its shadow
      crease(f, [S.at(0.1, 0.36), S.at(0.3, 0.42), S.at(0.5, 0.38)], 3, { col: P.loamD, lit: P.greyL }); // the carved breast
      for (let i = 0; i < 4; i++) crease(f, [S.at(-0.3, 0.46 + i * 0.06), S.at(0.0, 0.5 + i * 0.06), S.at(0.26, 0.48 + i * 0.05)], 2.4, { col: P.loamD, lit: P.greyL, op: 0.5 }); // ribs under the bark
      crease(f, [S.at(-0.1, 0.62), S.at(0.0, 0.72), S.at(0.2, 0.76)], 2.2, { col: P.greyS, lit: P.greyL }); // the waist
      split2([S.at(-0.2, 0.06), S.at(-0.1, 0.3), S.at(-0.2, 0.55), S.at(-0.1, 0.8)], 3);
      split2([S.at(0.3, 0.5), S.at(0.2, 0.7), S.at(0.32, 0.92)], 2.4);
      stains(f, E.smooth(torso), E.bbox(torso), P.loamD, 0.03, 2.6, -1.4, 53, 0.5);
      X.mould(f, S.at(0.2, 0.62), 14, 18, { col: P.pink, op: 0.55 });
      // the heart-wood's rings round where it was, cut clean by the void
      for (const r of [40, 52]) f.line(ell(vh[0], r, r * 0.96, 0, 30).slice(4, 22), 1.2, P.greyS, { op: 0.5 });
    });
  }, { shape: E.smooth(torso) });
  // a girdle of rotted leaves at the hips
  f.bone('pelvis');
  // bindweed wound round the hips, its strands hanging at uneven lengths, dead leaves along them, a few pale trumpets
  X.briar(f, [S.at(-0.56, 0.86), S.at(-0.1, 0.92), S.at(0.3, 0.88), S.at(0.52, 0.84)], 6, { thorns: 0, leaves: 0, cast: true });
  for (let i = 0; i < 9; i++) {
    const r0 = add(lerp(S.at(-0.5, 0.88), S.at(0.48, 0.86), i / 8), [0, R(f, -6, 6)]), l = R(f, 50, 260), sw = R(f, -20, 20);
    const pts = [r0, add(r0, [sw * 0.3, l * 0.35]), add(r0, [sw * 0.8, l * 0.7]), add(r0, [sw, l])];
    X.briar(f, pts, 4, { thorns: 0, leaves: 0, cast: false });
    const C = spline(pts, 6); for (let k = 4; k < C.length; k += 6 + Math.floor(f.r() * 4)) X.leaf(f, C[k], Math.PI / 2 + (k % 2 ? 0.7 : -0.7) + R(f, -0.3, 0.3), R(f, 22, 34), { col: [P.loamB, P.rot, mix(P.loamB, P.yelD, 0.3)][k % 3] });
    if (f.r() < 0.4) X.bloom(f, C[C.length - 1], 9, mix(P.pinkL, P.bone, 0.4), { n: 5, sy: 0.6, tilt: 1.2 });
  }
  // brackets shelved on both shoulders
  f.bone('torso');
  X.bracket(f, S.at(-0.36, 0.06), Math.PI + 0.3, 40, 84, { side: true, kind: 'hoof', col: mix(P.yelD, P.loamB, 0.25), droop: 0.05 });
  X.bracket(f, S.at(-0.3, 0.14), Math.PI + 0.2, 26, 52, { side: true, kind: 'hoof', col: mix(P.yelD, P.grey, 0.3), droop: 0.1 });
  X.bracket(f, S.at(0.36, 0.06), -0.2, 34, 66, { side: true, kind: 'hoof', col: mix(P.yelD, P.loamB, 0.25), droop: 0.1 });

  // ---- head: a long carved-bark face, knot-hole eyes weeping sap; dead twigs swept back for hair
  f.bone('head');
  f.part(limb(neck0, add(HC, [-20, 60]), 56, 48, { steps: 6 }), WD({ maxShade: 12 }));
  const hF = frame(HC, hA, 190);
  for (const [r0, a, l] of [[[-0.3, -0.3], -2.6, 190], [[-0.36, -0.1], -2.9, 220], [[-0.2, -0.44], -2.3, 160], [[-0.38, 0.12], 3.0, 180], [[0.0, -0.5], -1.9, 130], [[-0.1, -0.52], -1.6, 90], [[-0.4, 0.3], 2.7, 150]]) twigs(hF([r0])[0], a, l, 16, 2, 0.15);
  const face = hF([[-0.3, 0.26], [-0.36, 0.0], [-0.4, -0.2, 1], [-0.3, -0.38], [-0.14, -0.5, 1], [0.04, -0.5], [0.18, -0.44, 1], [0.28, -0.3], [0.3, -0.16, 1], [0.27, -0.06], [0.36, 0.1, 1], [0.3, 0.16], [0.3, 0.26], [0.26, 0.36], [0.2, 0.46, 1], [0.1, 0.48], [0.02, 0.4], [-0.1, 0.36, 1], [-0.2, 0.36]]);
  f.part(face, WD({ fill: mix(P.grey, P.greyL, 0.3), maxShade: 14 }));
  clipDraw(f, face, () => {
    softTone(f, E.smooth(face), [[hF([[-0.4, -0.4], [-0.1, -0.3], [-0.12, 0.5], [-0.4, 0.4]]), '#000', 0.35, 10], [hF([[0.1, 0.05], [0.3, 0.1], [0.24, 0.3], [0.08, 0.24]]), P.greyS, 0.3, 6]]);
    crease(f, hF([[0.06, -0.16], [0.18, -0.2], [0.3, -0.15]]), 3, { col: P.greyS, lit: P.greyL }); // the brow ridge
    crease(f, hF([[0.27, -0.06], [0.33, 0.08], [0.3, 0.16], [0.24, 0.16]]), 2.6, { col: P.greyS, lit: P.greyL }); // the nose
    for (let i = 0; i < 3; i++) crease(f, hF([[0.06 + i * 0.03, -0.18 - i * 0.03], [0.1 + i * 0.03, -0.26 - i * 0.04], [0.18 + i * 0.02, -0.32 - i * 0.03]]), 2, { col: P.loamD, lit: P.greyL, op: 0.7 }); // the brow knotted up in grief
    crease(f, hF([[0.2, -0.24], [0.21, -0.14]]), 2.4, { col: P.loamD, lit: P.greyL, op: 0.7 }); // the furrow between the brows
    crease(f, hF([[0.02, 0.36], [0.12, 0.42], [0.2, 0.4]]), 1.8, { col: P.greyS, lit: P.greyL });
    split2(hF([[-0.1, -0.5], [-0.04, -0.2], [-0.14, 0.1]]), 2);
    crease(f, hF([[0.02, 0.06], [0.12, 0.14], [0.22, 0.16]]), 2.4, { col: P.greyS, lit: P.greyL }); // the cheekbone
    crease(f, hF([[-0.2, 0.0], [-0.1, 0.24], [0.02, 0.38]]), 2.6, { col: P.greyS, lit: P.greyL }); // the jaw's edge
    for (let i = 0; i < 5; i++) f.line(hF([[-0.34 + i * 0.05, -0.4 + i * 0.02], [-0.3 + i * 0.05, 0.2]]), 1.2, P.greyS, { op: 0.45 }); // grain down the skull
    for (const q of [[0.14, -0.04], [0.3, -0.06]]) { f.flat(hF(ell(q, q[0] > 0.2 ? 0.035 : 0.065, 0.045, 0.1, 12)), P.loamD); f.flat(hF(ell([q[0] + 0.01, q[1] + 0.005], q[0] > 0.2 ? 0.02 : 0.04, 0.025, 0.1, 10)), P.void); } // knot-hole eyes
    // sap tears: pale yellow runs from the knot-holes down the cheek
    for (const [x0, l] of [[0.13, 0.3], [0.16, 0.22], [0.29, 0.18]]) { const p0 = hF([[x0, 0.0]])[0], p1 = hF([[x0 - 0.01, l]])[0]; f.stroke([p0, lerp(p0, p1, 0.5), p1], 5, P.yel, { op: 0.85 }); f.flat(ell(add(p1, [0, 4]), 3.5, 4.5, 0, 8), P.yel); f.line([add(p0, [1.5, 2]), add(lerp(p0, p1, 0.6), [1.5, 0])], 1, P.yelL, { op: 0.8 }); }
    stains(f, E.smooth(face), E.bbox(face), P.loamD, 0.04, 2.6, -1.4, 55, 0.4);
    X.mould(f, hF([[-0.2, 0.2]])[0], 14, 12, { col: P.lilac, op: 0.5 });
    // the skull behind the face is still bark: plates grown over the back of the head
    barkPlates(hF([[-0.5, 0.5], [-0.5, -0.6], [-0.06, -0.6], [-0.02, -0.2], [-0.12, 0.1], [-0.18, 0.5]]), E.bbox(face), { twist: 0.35, wave: 0.2, dth: 0.4, h0: 40, h1: 90, knots: [[hF([[-0.3, -0.2]])[0], 6]] });
    softTone(f, E.smooth(face), [[hF([[0.0, 0.02], [0.2, 0.06], [0.2, 0.22], [0.02, 0.22]]), P.loamD, 0.35, 6]]); // the sunken cheek
  });
  // carved features standing proud of the face: the brow, the long nose, the lips, the chin
  const WF2 = (o = {}) => WD(Object.assign({ fill: mix(P.grey, P.greyL, 0.4), maxShade: 6, cast: false, inkW: 1.2, inkHeavy: 1.8 }, o));
  f.part(hF([[0.04, -0.17], [0.12, -0.24], [0.2, -0.28], [0.32, -0.2], [0.3, -0.12], [0.18, -0.16], [0.05, -0.12]]), WF2()); // the brow, drawn up at its inner end
  f.part(hF([[0.26, -0.14], [0.31, -0.04], [0.38, 0.1], [0.37, 0.15], [0.3, 0.16], [0.26, 0.12], [0.27, 0.0]]), WF2());
  f.part(hF([[0.12, 0.24], [0.2, 0.22], [0.3, 0.25], [0.32, 0.3], [0.3, 0.4], [0.22, 0.44], [0.14, 0.4], [0.11, 0.32]]), WF2({ fill: mix(P.grey, P.greyS, 0.3) })); // the lips, carved apart
  f.flat(hF([[0.15, 0.28], [0.22, 0.27], [0.28, 0.3], [0.28, 0.37], [0.22, 0.4], [0.16, 0.37]]), P.void); // the open mouth, a cry
  f.line(hF([[0.16, 0.28], [0.22, 0.27], [0.27, 0.29]]), 1.2, P.greyL, { op: 0.7 });
  f.part(hF([[0.12, 0.46], [0.22, 0.45], [0.22, 0.52], [0.12, 0.53]]), WF2());
  f.flat(hF([[0.0, 0.14], [0.14, 0.2], [0.16, 0.32], [0.02, 0.3]]), P.greyS, { op: 0.35 }); // the hollow under the cheekbone
  leaves(hF([[-0.5, -0.3]])[0], 2, 30);

  // ---- near limb, raised high behind the head, forking into branches and twigs
  f.bone('upperarm_n');
  f.part(X.jointLimb(SN, EN, lerp(EN, WN, 0.5), [66, 46, 36], { point: 0.3 }), WD({ maxShade: 10 }));
  split2([lp(SN, EN, 0.2, 6), lp(SN, EN, 0.6, -4), lp(SN, EN, 0.9, 4)], 2.6);
  f.bone('forearm_n');
  f.part(limb(EN, WN, 46, 22, { steps: 10, q: [[0.3, 0.16, 0.15]] }), WD({ maxShade: 8 }));
  for (const [q, r] of [[EN, 26], [WN, 22]]) { f.part(ell(q, r, r * 0.8, ang(SN, EN), 12).map(p2 => add(p2, [(f.r() - 0.5) * 4, (f.r() - 0.5) * 4])), WD({ maxShade: 6, cast: false })); f.line(ell(q, r * 0.5, r * 0.4, 0, 10).concat([ell(q, r * 0.5, r * 0.4, 0, 10)[0]]), 1.1, P.greyS, { op: 0.6 }); } // knuckle knots before the split
  X.mould(f, lp(EN, WN, 0.5, 0), 10, 14, { col: P.yel, op: 0.6 });
  f.bone('hand_n');
  for (const [a, l, w] of [[-0.5, 230, 24], [0.0, 260, 26], [0.45, 200, 22], [-1.1, 170, 18], [0.9, 150, 16]]) twigs(WN, ang(EN, WN) + a, l, w, 3, 0);
  leaves(add(WN, [-60, -160]), 2, 28); leaves(add(WN, [60, -180]), 2, 26);
  return f;
}

// ------------------------------------------------------------------ THE GARDENER (elite 2.0)
// The head gardener. He keeps the garden; he prunes what grows wrong. A big, heavy old man, a little stooped, in a linen
// smock overgrown with moss and a leather apron, a wide straw hat with flowers growing from its crown and brim. He holds
// his enormous hedge shears open in front of him in both fists, blades toward you. His face is kind and empty: soft,
// round, gently smiling, and where his eyes were, flowers grow. Fungus has grown from his back like a cloak: a cascade of
// bracket shelves and caps from the shoulders to the ground. True size 2.0 (1280 px) on the elite canvas.
// Toxin: the fungus cloak, the flowering hat, moss on the smock, mould bloom, pustules on the hands. Void: a clean round
// hole through the hat's brim, eyes opened among the shelves of the cloak.
// Rig: standard humanoid + shear_a (hand_n: the lower handle and upper blade) + shear_b (hand_f: the upper handle and
// lower blade), sharing the pivot + cloak (torso) + hat (head) + apron (pelvis).
// Motion: idle snipping the air (shear_a, shear_b about the pivot); attack a shear cut (arms drive forward, blades close).
function gardener() {
  const [CW, CH] = TIERS.elite, seed = 1401;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 196, gy = f.o.groundY;
  const skin = mix(P.skin, P.pink, 0.15), skinS = P.skinS;
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const SM = (o = {}) => Object.assign({ fill: mix(P.bone, P.grey, 0.4), shadow: P.greyS, light: P.boneL, shade: 0.4, tex: 'weave' + seed, texOp: 0.55 }, o);
  const LT = (o = {}) => Object.assign({ fill: P.loamB, shadow: P.loamBS, light: P.loamBL, shade: 0.42, tex: 'mottle' + seed, texOp: 0.55 }, o);
  const TRS = (o = {}) => Object.assign({ fill: mix(P.loamB, P.loam, 0.5), shadow: P.loamD, light: P.loamB, shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, o);
  // a cloth fold that reads at sheet size: a broad dark valley, its soft shadow spreading to one side, a lit ridge on
  // the side toward the key light
  const fold = (pts, w, o = {}) => { const C = spline(pts, 3), lt = mul(f.L, -1); f.stroke(C, w * 2.4, o.sh || P.greyS, { op: 0.28 }); f.stroke(C, w, o.dk || mix(P.greyS, P.loamD, 0.3), { op: o.op ?? 0.75 }); f.line(C.slice(1, -1).map(q => add(q, mul([-lt[0], lt[1] < 0 ? -lt[1] : lt[1]], 0) )).map(q => add(q, [w * 0.9, -w * 0.5])), Math.max(1, w * 0.4), o.lt || P.boneL, { op: 0.6 }); };
  const N = [524, 410], C = [462, 540], Pv = [480, 830];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.12), SF = S.at(0.44, 0.1);
  const piv = [800, 610];
  const EN = [540, 690], WN = [664, 716];               // near fist on the lower handle
  const EF = [610, 590], WF = [688, 494];               // far fist on the upper handle
  const HN = S.at(-0.2, 1.0), KN = [450, 1110], AN = [430, 1290];
  const HF = S.at(0.3, 1.0), KF = [560, 1104], AF = [590, 1286];
  const neck0 = S.at(0.14, -0.03), HC = [566, 312], hA = 0.2;
  const aA = ang(WN, piv), aB = ang(WF, piv);           // the handles' directions toward the pivot
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('shear_a', WN, 'hand_n').joint('shear_b', WF, 'hand_f').joint('cloak', S.at(-0.5, 0.1), 'torso').joint('hat', add(HC, [0, -60]), 'head').joint('apron', S.at(0, 0.8), 'pelvis');
  const shearHalf = (hand, hdir, bdir, blen, hlen, tone) => {
    // a handle of ash from behind the fist to the pivot, then the blade beyond the pivot on the other line
    const butt = add(hand, rot([-60, 0], hdir)), bTip = add(piv, rot([blen, 0], bdir));
    f.part(limb(butt, piv, 24, 22, { steps: 8 }), { fill: mix(P.loamBL, P.loamB, tone), shadow: P.loamBS, light: P.bone, shade: 0.4, tex: 'grain' + seed, texOp: 0.6 });
    f.part(ell(butt, 13, 13, 0, 12), { fill: P.steel, shadow: P.steelD, shade: 0.4, inkW: 1.2, cast: false }); // the iron cap on the butt
    f.part(limb(lerp(hand, piv, 0.62), piv, 26, 30, { steps: 4 }), { fill: P.steel, shadow: P.steelD, light: P.steelL, shade: 0.4, inkW: 1.3, cast: false }); // the iron ferrule and tang
    const bn = [-Math.sin(bdir), Math.cos(bdir)], edgeSide = tone ? 1 : -1;
    const blade = [add(piv, mul(bn, 18)), add(add(piv, rot([blen * 0.5, 0], bdir)), mul(bn, 20)), add(bTip, mul(bn, 6)), [...bTip, 1], add(add(piv, rot([blen * 0.6, 0], bdir)), mul(bn, -14)), add(piv, mul(bn, -18))];
    f.part(blade, { fill: '#9a989a', shadow: P.steelD, light: P.greyL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.4, inkHeavy: 2.4, maxShade: 6 });
    f.line([add(add(piv, rot([20, 0], bdir)), mul(bn, -12 * edgeSide)), add(bTip, mul(bn, -2 * edgeSide))], 1.6, P.boneL, { op: 0.75 }); // the honed edge
    for (const t of [0.3, 0.55, 0.75]) f.flat(ell(add(piv, rot([blen * t, 0], bdir)), 10, 5, bdir, 8), P.loamB, { op: 0.55 }); // rust gone to loam
    X.mould(f, add(piv, rot([blen * 0.4, 6], bdir)), 8, 6, { col: P.lilac, op: 0.55 });
  };

  // ---- the fungus cloak, behind everything: a mass from the shoulders to the ground at his back, shelved with brackets
  f.bone('cloak');
  const ck = [S.at(-0.5, 0.0), S.at(-0.2, -0.04), S.at(-0.3, 0.3), [400, 900], [430, 1180], [430, gy - 20], [360, gy - 4], [290, gy - 24], [210, gy - 50], [190, 1200], [200, 1000], [240, 760], [290, 560], [350, 440]];
  f.part(ck, { fill: P.loamL, shadow: P.loamD, light: P.loamBL, shade: 0.4, tex: 'mfur' + seed, texOp: 0.6, maxShade: 30 });
  clipDraw(f, ck, () => { softTone(f, E.smooth(ck), [[[[220, 700], [300, 700], [300, gy], [220, gy]], '#000', 0.4, 16]]); X.mould(f, [320, 900], 40, 60, { col: P.lilac, op: 0.6 }); X.mould(f, [340, 1150], 30, 50, { col: P.yel, op: 0.5 }); });
  // oyster shelves: smooth fans with their gills showing under the lip, in irregular clusters that run together down the
  // back (a few big, many small, some torn or sagging), pale at the crowded top, darker and older toward the ground;
  // shelves at the outer edge stand off it so the outline breaks
  const oy = [mix(P.bone, P.grey, 0.35), mix(P.yel, P.grey, 0.45), mix(P.pink, P.grey, 0.45), mix(P.bone, P.loamB, 0.4)];
  for (const [c, n, sz] of [[[[300, 470], [270, 560], [250, 640]], 7, 1.0], [[[300, 720], [240, 800], [230, 880]], 6, 1.3], [[[330, 900], [300, 980]], 4, 0.8], [[[240, 1000], [220, 1120], [230, 1200]], 6, 1.15], [[[330, 1120], [320, 1220]], 3, 0.9], [[[240, 1260], [280, 1320]], 4, 0.9]]) X.brackets(f, c, n, Math.PI / 2 + 0.3, 110 * sz, 64 * sz, { kind: 'oyster', cols: oy });
  for (const [b, h] of [[[262, 690], 96], [[238, 960], 120], [[200, 1190], 80]]) X.bracket(f, b, Math.PI - 0.1, h * 0.36, h, { side: true, col: oy[(h | 0) % 4], torn: h > 100, droop: 0.25 });
  X.caps(f, [370, 430], -2.2, 90, 3, { cols: [mix(P.pink, P.grey, 0.4), P.yelD, mix(P.bone, P.grey, 0.3)], fan: 0.5, shape: 'flat' });
  X.eyes(f, [[[230, 668], 26, 0.2, 0.7], [[214, 950], 22, 0.1, 0.05], [[220, 1100], 24, -0.1, 0.55], [[296, 820], 18, 0.2, 0.85]], { lid: P.pinkD, lidS: P.pinkS, iris: P.loamD });

  // ---- far leg and far arm
  const legDraw = (Hp, Kn, A, sfx, tone) => {
    const look = TRS({ fill: mix(mix(P.loamB, P.loam, 0.5), '#000', tone) }), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    const [c0, c1] = jcut(Hp, Kn, A, 40);
    split(f, () => f.part(X.jointLimb(Hp, Kn, lerp(Kn, A, 0.9), [118, 86, 70], { point: 0.22, mus0: 0.16, mus1: 0.2 }), Object.assign({ maxShade: 26 }, look)), [['thigh' + sfx, c0], ['shin' + sfx, c1]]);
    f.bone('shin' + sfx);
    crease(f, [lp(Kn, A, 0.1, -30), lp(Kn, A, 0.16, 0), lp(Kn, A, 0.1, 30)], 3, { col: P.loamD, lit: P.loamB });
    X.moss(f, [lp(Kn, A, 0.5, -30), lp(Kn, A, 0.7, -34), lp(Kn, A, 0.9, -30)], 9, { stalks: true });
    split(f, () => B.boot(f, A, 1, 84, mix('#2a221c', '#000', tone), { shaft: 0.6, toe: 1.15, tex: 'mottle' + seed, strap: true }), [['shin' + sfx, side(A, mul(da, -1), 30)], ['foot' + sfx, side(A, da, 30)]]);
  };
  legDraw(HF, KF, AF, '_f', 0.25);
  f.bone('upperarm_f');
  f.part(X.jointLimb(SF, EF, lerp(EF, WF, 0.5), [92, 76, 66], { point: 0.25 }), SM({ fill: mix(P.grey, P.greyS, 0.2), maxShade: 20 }));
  f.bone('forearm_f');
  f.part(X.jointLimb(lerp(SF, EF, 0.7), EF, WF, [80, 70, 54], { point: 0.2 }), SKN({ fill: mix(skin, skinS, 0.15), maxShade: 16 }));
  f.part(K.ragLimb(f, lerp(SF, EF, 0.7), add(EF, [6, -10]), 90, 92, { depth: 8, teeth: 6 }), SM({ fill: mix(P.grey, P.greyS, 0.15), maxShade: 10, cast: false }));

  // ---- the shears' far half (upper handle, lower blade), then the far fist on it
  f.bone('shear_b');
  shearHalf(WF, aB, aB, 300, 0, 0.2);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, aB, 40, mix(skin, skinS, 0.1), { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'gardener far' });
  X.fistDetail(f, gF, 40, skin, { nail: P.loamL });
  X.pustules(f, add(WF, [-14, -14]), 10, 8, 3, 3, 5);

  // ---- near leg, torso (smock), apron
  legDraw(HN, KN, AN, '_n', 0);
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.36, 0.34], [0.06, 0.8, 0.52], [0.22, 0.92, 0.66], [0.44, 0.8, 0.84], [0.64, 0.7, 0.98], [0.84, 0.74, 0.94], [1.0, 0.8, 0.78]]);
  f.part(torso, SM({ maxShade: 36 }));
  clipDraw(f, E.smooth(torso), () => {
    softTone(f, E.smooth(torso), [[[S.at(-0.9, 0), S.at(-0.4, 0), S.at(-0.4, 1.1), S.at(-0.9, 1.1)], '#000', 0.35, 16]]);
    for (const q of [[S.at(-0.3, 0.2), S.at(-0.36, 0.5), S.at(-0.3, 0.8)], [S.at(0.3, 0.3), S.at(0.42, 0.56), S.at(0.5, 0.8)]]) crease(f, q, 3, { col: P.greyS, lit: P.boneL });
    stains(f, E.smooth(torso), E.bbox(torso), P.loamD, 0.025, 2.6, -1.3, 61, 0.55);
    X.moss(f, [S.at(-0.7, 0.4), S.at(-0.5, 0.6), S.at(-0.6, 0.9)], 12, { stalks: true });
    X.moss(f, [S.at(0.1, 0.06), S.at(0.4, 0.12), S.at(0.6, 0.06)], 10, { stalks: false });
    X.mould(f, S.at(0.0, 0.4), 22, 18, { col: P.yel, op: 0.55 });
    // the smock's smocking at the yoke
    for (let i = 0; i < 6; i++) f.line([S.at(-0.2 + i * 0.12, 0.14), S.at(-0.18 + i * 0.12, 0.26)], 1.2, P.greyS, { op: 0.6 });
    // (reviewer) the smock worked like the reference cloth: its value turns with the barrel of the body, lit across the
    // shoulders, darker down the back and where it bags over the apron string; drag folds from the yoke and the armpit,
    // hanging folds down the back that break where the apron string cinches; a darned patch; a side pocket sagging with
    // his tools; sap and rot running plumb out of the shoulder where the fungus cloak roots; mud rising from the hem
    softTone(f, E.smooth(torso), [[[S.at(-0.4, -0.05), S.at(0.5, -0.05), S.at(0.4, 0.24), S.at(-0.4, 0.22)], P.boneL, 0.4, 16], [[S.at(-1.1, 0.0), S.at(-0.5, 0.05), S.at(-0.45, 1.1), S.at(-1.1, 1.1)], mix(P.greyS, P.loamD, 0.3), 0.55, 20], [[S.at(-1, 0.55), S.at(-0.3, 0.6), S.at(-0.3, 1.1), S.at(-1, 1.1)], P.loamD, 0.35, 18], [[S.at(-1, 0.3), S.at(-0.2, 0.34), S.at(-0.2, 0.42), S.at(-1, 0.4)], P.greyS, 0.5, 8]]);
    for (const [a, b, c, w] of [[[-0.1, 0.05], [-0.3, 0.2], [-0.42, 0.34], 3.2], [[0.3, 0.05], [0.12, 0.2], [0.0, 0.33], 2.8], [[-0.5, 0.1], [-0.62, 0.22], [-0.7, 0.34], 3], [[-0.3, 0.4], [-0.36, 0.6], [-0.32, 0.8], 3.4], [[-0.55, 0.42], [-0.62, 0.62], [-0.58, 0.86], 3.2], [[-0.75, 0.44], [-0.8, 0.64], [-0.86, 0.9], 2.8], [[-0.42, 0.5], [-0.48, 0.66], [-0.44, 0.74], 2.2], [[-0.66, 0.9], [-0.7, 0.98], [-0.62, 1.04], 2.6]]) fold([S.at(...a), S.at(...b), S.at(...c)], w * 1.8);
    for (let i = 0; i < 4; i++) crease(f, [S.at(-0.9 + i * 0.16, 0.38), S.at(-0.85 + i * 0.16, 0.42), S.at(-0.88 + i * 0.16, 0.47)], 2, { col: P.greyS, lit: P.boneL, op: 0.6 }); // gathered under the apron string
    stains(f, E.smooth(torso), E.bbox(torso), P.loamB, 0.05, 3, -1.6, 67, 0.5); // grime, sweat and sap blotches
    // the darned patch, a different cloth, its stitches crossing the edge
    const pt = [S.at(-0.78, 0.5), S.at(-0.5, 0.48), S.at(-0.46, 0.66), S.at(-0.76, 0.69)];
    f.part(pt, SM({ fill: mix(P.loamBL, P.lilacD, 0.3), maxShade: 6, inkW: 1.2, cast: false, tex: 'weave' + seed }));
    for (let i = 0; i < 6; i++) { const q = lerp(pt[0], pt[1], i / 5); f.line([add(q, [0, -5]), add(q, [2, 5])], 1, P.loamD, { op: 0.8 }); }
    for (let i = 0; i < 5; i++) { const q = lerp(pt[1], pt[2], i / 4); f.line([add(q, [-5, 0]), add(q, [5, 2])], 1, P.loamD, { op: 0.8 }); }
    // sap and rot: pale-yellow runs and brown rot streaks hanging plumb from the shoulder where the cloak roots
    for (const [u, v, l, c] of [[-0.82, 0.12, 120, P.yel], [-0.7, 0.18, 80, P.yel], [-0.9, 0.3, 160, mix(P.loamB, P.yelD, 0.4)], [-0.6, 0.06, 60, mix(P.loamB, P.yelD, 0.4)], [0.18, 0.1, 50, P.yel]]) { const q = S.at(u, v), tr = [q, add(q, [R(f, -2, 2), l * 0.4]), add(q, [R(f, -3, 3), l * 0.75]), add(q, [R(f, -2, 2), l])]; f.stroke(tr, 9, mix(c, P.loamD, 0.35), { op: 0.45 }); f.stroke(tr, 5, c, { op: 0.8 }); f.line(tr.slice(0, 3).map(p2 => add(p2, [1.5, 0])), 1, P.yelL, { op: 0.6 }); f.flat(ell(add(tr[3], [0, 4]), 3.4, 4.4, 0, 8), c, { op: 0.85 }); }
    stains(f, E.smooth(torso), [S.at(-1, 0.75)[0] - 40, S.at(0, 0.8)[1], S.at(1, 1)[0] + 40, S.at(0, 1.1)[1]], P.loamD, 0.03, 2.6, -1.0, 69, 0.55); // mud rising from the hem
  });
  // the side pocket on the smock, sagging with his tools: a dibber, a twine ball, the handle of a pruning saw
  { const pc = [S.at(-0.82, 0.76), S.at(-0.46, 0.74), S.at(-0.44, 0.96), S.at(-0.62, 1.0), S.at(-0.8, 0.96)];
    f.part(limb(S.at(-0.6, 0.78), add(S.at(-0.6, 0.78), [-26, -96]), 16, 12, { steps: 4 }), { fill: P.loamBL, shadow: P.loamBS, shade: 0.4, inkW: 1.2, cast: true, tex: 'grain' + seed }); // the dibber's handle
    f.part(ell(add(S.at(-0.6, 0.78), [-26, -100]), 12, 9, 0.3, 10), { fill: P.loamB, shadow: P.loamBS, shade: 0.4, inkW: 1.1, cast: false }); // its T-grip
    f.part(limb(S.at(-0.72, 0.8), add(S.at(-0.72, 0.8), [20, -70]), 22, 18, { steps: 4 }), { fill: P.loamL, shadow: P.loamD, shade: 0.4, inkW: 1.2, cast: true, tex: 'grain' + seed }); // the saw's handle
    f.flat(ell(add(S.at(-0.72, 0.8), [14, -50]), 6, 9, 0.3, 8), P.loamD); // its grip hole
    f.part(ell(add(S.at(-0.5, 0.8), [0, -16]), 18, 15, 0, 12), { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.1, cast: true }); // the twine ball
    for (let i = 0; i < 3; i++) f.line([add(S.at(-0.5, 0.8), [-14, -24 + i * 8]), add(S.at(-0.5, 0.8), [14, -20 + i * 8])], 0.9, P.yelS, { op: 0.7 });
    f.part(pc, SM({ fill: mix(P.grey, P.loamB, 0.45), maxShade: 10, inkW: 1.4, cast: true, castOp: 0.4 }));
    clipDraw(f, pc, () => { crease(f, [S.at(-0.78, 0.82), S.at(-0.66, 0.9), S.at(-0.5, 0.86)], 2.6, { col: P.greyS, lit: P.boneL }); stains(f, E.smooth(pc), E.bbox(pc), P.loamD, 0.05, 2.6, -1.2, 73, 0.6); });
    f.stitches([S.at(-0.8, 0.78), S.at(-0.47, 0.76)], P.loamD, 0.9);
    X.mould(f, S.at(-0.56, 0.95), 12, 9, { col: P.lilac, op: 0.6 }); }
  f.bone('apron');
  const ap = [S.at(-0.2, 0.36), S.at(0.62, 0.36), S.at(0.8, 0.8), [650, 1020], [636, 1080], [600, 1070], [560, 1090], [520, 1074], [480, 1086], [452, 1060], S.at(-0.3, 0.9)];
  f.part(ap, LT({ maxShade: 30 }));
  clipDraw(f, E.smooth(ap), () => {
    softTone(f, E.smooth(ap), [[[S.at(-0.3, 0.4), S.at(-0.1, 0.4), [470, 1080], [450, 1080]], '#000', 0.35, 14]]);
    for (const q of [[[520, 860], [524, 960], [520, 1060]], [[590, 860], [600, 960], [610, 1050]]]) crease(f, q, 3, { col: P.loamBS, lit: P.loamBL });
    stains(f, E.smooth(ap), E.bbox(ap), P.loamD, 0.03, 2.6, -1.2, 63, 0.6);
    f.part([[500, 860], [600, 852], [604, 920], [502, 928]], LT({ fill: mix(P.loamB, P.loam, 0.25), inkW: 1.3, cast: false })); // the pocket
    f.stitches([[500, 862], [600, 854]], P.loamBL, 0.9);
    X.moss(f, [[460, 1040], [540, 1060], [620, 1050]], 10, { stalks: true });
    X.mould(f, [600, 1000], 20, 16, { col: P.pink, op: 0.55 });
  });
  // pruning knife and a ball of bast in the pocket, the apron's neck strap
  f.part(limb([520, 850], [534, 790], 12, 10, { steps: 4 }), { fill: P.loamBL, shadow: P.loamBS, shade: 0.4, inkW: 1.1, cast: false, tex: 'grain' + seed });
  f.part(ell([572, 846], 18, 14, 0, 12), { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.1, cast: false });
  f.bone('torso');
  f.line([S.at(-0.2, 0.36), S.at(-0.1, 0.0), S.at(0.3, -0.06), S.at(0.62, 0.36)], 5, P.loamBS);

  // ---- head: soft, round, kind, empty; flowers growing in the eye sockets; the wide straw hat flowering
  f.bone('head');
  f.part(limb(neck0, add(HC, [-30, 50]), 84, 76, { steps: 6 }), SKN({ maxShade: 14 }));
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin, jaw: 1.18, chin: 0.0, nose: 1.12, hook: -0.1, mouth: 'smirk', squint: 0.0, browDown: -0.04, faceShade: 0.78, faceHatch: false, jawShade: 0.35, age: true, blind: true, lips: true,
    hairCol: mix(P.bone, P.grey, 0.5), beard: 'stubble', beardCol: mix(P.bone, P.grey, 0.6),
  });
  f.flat(hF(ell([0.12, 0.14], 0.12, 0.08, 0, 12)), P.pink, { op: 0.25 }); // the round cheek
  for (const [q, r, c] of [[[0.12, -0.06], 0.07, P.pink], [[0.3, -0.06], 0.04, P.yel]]) { f.flat(hF(ell(q, r * 1.1, r * 0.8, 0, 12)), P.loamD); X.bloom(f, hF([q])[0], r * H * 1.15, c, { n: 5, sy: 0.85, ang: 0.4 }); }
  X.fungalFur(f, hF([[0.05, -0.02], [0.12, 0.04], [0.2, -0.02]]), 6, 1, { gaps: 0.3 });
  X.pustules(f, hF([[-0.1, 0.2]])[0], 10, 8, 3, 3, 5);
  f.bone('hat');
  const hc = hF([[-0.02, -0.4]])[0], ht = hA - 0.05;
  const brim = ell(add(hc, [0, 6]), 230, 58, ht, 36), crown = [add(hc, rot([-96, 10], ht)), add(hc, rot([-90, -60], ht)), add(hc, rot([-50, -96], ht)), add(hc, rot([20, -104], ht)), add(hc, rot([80, -78], ht)), add(hc, rot([96, 6], ht))];
  const STR = (o = {}) => Object.assign({ fill: P.yel, shadow: P.yelS, light: P.yelL, shade: 0.4, tex: 'weave' + seed, texOp: 0.7 }, o);
  X.cutHoles(f, [[add(hc, rot([-170, 10], ht)), 14]], () => {
    f.part(brim, STR({ maxShade: 16 }));
    clipDraw(f, E.smooth(brim), () => { for (let k = 1; k < 5; k++) f.line(ell(add(hc, [0, 6]), 230 * (1 - k * 0.16), 58 * (1 - k * 0.16), ht, 36).concat([ell(add(hc, [0, 6]), 230 * (1 - k * 0.16), 58 * (1 - k * 0.16), ht, 36)[0]]), 1.2, P.yelD, { op: 0.6 }); for (let i = 0; i < 30; i++) { const t = i / 30 * Math.PI * 2; f.line([add(hc, rot([Math.cos(t) * 90, Math.sin(t) * 24 + 6], ht)), add(hc, rot([Math.cos(t) * 228, Math.sin(t) * 57 + 6], ht))], 0.8, P.yelD, { op: 0.4 }); } stains(f, E.smooth(brim), E.bbox(brim), P.loamD, 0.03, 2.6, -1.3, 65, 0.45); });
    f.line(brim.slice(14, 30), 2.2, P.yelS, { op: 0.6 }); // the frayed brim edge
  }, { shape: E.smooth(brim) });
  f.part(crown, STR({ maxShade: 20 }));
  clipDraw(f, crown, () => { for (let k = 0; k < 6; k++) f.line([add(hc, rot([-94, -10 - k * 16], ht)), add(hc, rot([0, -20 - k * 16], ht)), add(hc, rot([94, -6 - k * 14], ht))], 1.2, P.yelD, { op: 0.55 }); });
  f.part([add(hc, rot([-96, -8], ht)), add(hc, rot([96, -4], ht)), add(hc, rot([96, 8], ht)), add(hc, rot([-96, 6], ht))], { fill: P.lilacD, shadow: P.lilacS, shade: 0.4, inkW: 1.2, cast: false, k: 0.6 }); // the hat band
  // flowers and caps growing out of the straw
  for (const [u, v, r, c] of [[-60, -96, 34, P.pink], [10, -112, 28, P.yelL], [64, -84, 30, P.lilac], [-150, 10, 24, P.pinkL], [156, 30, 22, P.lilac], [-30, 24, 18, P.yelL], [90, 40, 18, P.pink]]) X.bloom(f, add(hc, rot([u, v], ht)), r, c, { n: 6, sy: 0.7, tilt: ht });
  X.caps(f, add(hc, rot([40, -96], ht)), -Math.PI / 2 + 0.4, 60, 2, { cols: [P.lilac, P.pink], fan: 0.6 });

  // ---- near arm: smock sleeve rolled; the near half of the shears (lower handle, upper blade) in the near fist
  f.bone('shear_a');
  shearHalf(WN, aA, aA, 300, 0, 0);
  f.part(ell(piv, 14, 14, 0, 12), { fill: P.steel, shadow: P.steelD, light: P.steelL, shade: 0.4, inkW: 1.4, cast: false }); f.rivet(piv, 6, P.steelL); // the pivot bolt
  f.bone('upperarm_n');
  { const sl = X.tube([lerp(EN, WN, 0.4), EN, add(SN, mul(E.norm(sub(SN, EN)), 6))], [64, 72, 82], 0.7); // capsule rounded into the shoulder, not a cut block
    f.part(sl, SM({ maxShade: 20 }));
    clipDraw(f, sl, () => { // the sleeve: folds twisting round the arm, a dark crook at the elbow, grime, a sap run
      softTone(f, E.smooth(sl), [[[lp(SN, EN, 0, 10), lp(SN, EN, 1.1, 10), lp(SN, EN, 1.1, 44), lp(SN, EN, 0, 44)], P.greyS, 0.5, 10], [[lp(SN, EN, 0, -20), lp(SN, EN, 0.9, -20), lp(SN, EN, 0.9, -40), lp(SN, EN, 0, -40)], P.boneL, 0.4, 8]]);
      for (const t of [0.22, 0.42, 0.6, 0.76]) fold([lp(SN, EN, t - 0.05, -40), lp(SN, EN, t + 0.03, 0), lp(SN, EN, t + 0.12, 40)], 6); // folds spiralling round the arm
      crease(f, [lp(SN, EN, 0.86, 30), lp(SN, EN, 0.95, 16), lp(SN, EN, 1.0, 26)], 3.4, { col: P.loamD, lit: P.boneL });
      stains(f, E.smooth(sl), E.bbox(sl), P.loamB, 0.05, 3, -1.6, 75, 0.55);
      const q = lp(SN, EN, 0.1, -16); f.stroke([q, add(q, [2, 40]), add(q, [-1, 80])], 5, P.yel, { op: 0.75 });
    }); }
  X.moss(f, [lp(SN, EN, 0.2, -40), lp(SN, EN, 0.5, -44)], 9, { stalks: false });
  f.bone('forearm_n');
  f.part(X.jointLimb(lerp(SN, EN, 0.7), EN, WN, [84, 72, 56], { point: 0.2 }), SKN({ maxShade: 16 }));
  f.part(K.ragLimb(f, lerp(SN, EN, 0.82), add(EN, [8, 6]), 82, 84, { depth: 8, teeth: 6 }), SM({ fill: mix(P.grey, P.boneL, 0.2), maxShade: 10, cast: false }));
  X.mould(f, lp(EN, WN, 0.5, -6), 14, 10, { col: P.lilac, op: 0.6 });
  X.pustules(f, lp(EN, WN, 0.6, 10), 10, 8, 3, 3, 5);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, aA, 42, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'gardener near', maxBend: 40 });
  X.fistDetail(f, gN, 42, skin, { nail: P.loamL });

  f.bone('root');
  X.loamGround(f, 180, 760, gy, { depth: 22, petals: 7 });
  for (let i = 0; i < 6; i++) X.leaf(f, [R(f, 600, 900), gy - R(f, 0, 6)], R(f, -0.3, 0.3), R(f, 30, 44), { col: [P.rot, P.loamB][i % 2] }); // clippings
  return f;
}

// ------------------------------------------------------------------ shared cervid anatomy (Mother, Spore Deer)
// Authored once in the Mother's space (ruler canvas, ground 1570, chest front near x 1150) and mapped onto each figure by
// M(p) = [ox + (p.x - 1150) sc, gy - (1570 - p.y) sc]. A real barrel: the withers hump, a dipping back, the loin, a croup
// sloping to the tail; the point of the buttock and the ham; a deep chest dropping below the elbow; the belly rising
// into a tucked flank and the stifle fold. Legs after the Silence Stag and the Plague Wolf: heavy upper legs tapering hard
// to thin cannons, the knee (carpus) and the hock angled, the fetlock bent, cloven hooves carrying the weight.
const CERVID = {
  barrel: [[300, 640], [360, 598], [440, 582], [560, 600], [690, 616], [810, 604], [910, 574], [990, 540], [1050, 546], [1104, 600], [1140, 690], [1138, 800], [1112, 900], [1072, 978], [1010, 1016], [930, 1006], [830, 978], [730, 960], [630, 936], [550, 906], [494, 918], [446, 944], [380, 934], [312, 884], [262, 806], [250, 724], [264, 672]],
  legs: {
    fn: { S: [1100, 770], E: [1030, 1000], K: [1040, 1268], F: [1036, 1458], Q: [1070, 1524] },
    ff: { S: [1150, 756], E: [1110, 986], K: [1176, 1250], F: [1196, 1446], Q: [1232, 1512] },
    hn: { S: [350, 700], E: [476, 930], K: [330, 1236], F: [352, 1458], Q: [388, 1524] },
    hf: { S: [400, 686], E: [540, 916], K: [440, 1224], F: [470, 1446], Q: [506, 1512] },
  },
  wsF: [230, 150, 62, 50, 40], wsH: [330, 200, 70, 52, 40],
};
// contour hatching: short curved ink strokes laid across a form from an edge inward (the belly, the back of the ham,
// under the neck), so the shadow side is drawn with the form rather than as flat tone. path: the edge; inward: +1/-1 normal
function contourHatch(f, clip, path, inward, len, n, o = {}) {
  const C = spline(path, 3), S = X.arcLen(C), Lt = S[S.length - 1];
  clipDraw(f, clip, () => {
    for (let k = 0; k < n; k++) {
      const u = Math.min(Lt, Math.max(0, (k + 0.5 + (o.jit ? (f.r() - 0.5) * o.jit : 0)) / n * Lt)); let i = S.findIndex(v => v >= u); if (i < 1) i = 1; if (i > C.length - 2) i = C.length - 2;
      const t = E.norm(sub(C[i + 1], C[i - 1])), nn = mul([-t[1], t[0]], inward), l = len * R(f, 0.6, 1.1) * (o.taper ? o.taper(k / n) : 1), bend = (o.bend ?? 0.18) * l;
      const p0 = add(C[i], mul(nn, -2)), p1 = add(add(p0, mul(nn, l * 0.5)), mul(t, bend)), p2 = add(add(p0, mul(nn, l)), mul(t, bend * 0.6));
      f.line([p0, p1, p2], o.w ?? 1.2, o.col || INK, { op: o.op ?? 0.55 });
    }
  });
}
function cervidBody(f, M, sc, o) {
  const seed = f.o.seed, L = Object.fromEntries(Object.entries(CERVID.legs).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([j, q]) => [j, M(q)]))]));
  const coat = o.coat, coatS = o.coatS, coatL = o.coatL, belly = o.belly, dark = o.dark;
  const LOOK = (x = {}) => Object.assign({ fill: coat, shadow: coatS, light: coatL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.45 }, x);
  for (const [k, Lk] of Object.entries(L)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, Lk.S, par).joint(`leg_${k}_2`, Lk.E, `leg_${k}_1`).joint(`leg_${k}_3`, Lk.K, `leg_${k}_2`); }
  const leg = (k, far, part) => {
    const front = k[0] === 'f', ws = (front ? CERVID.wsF : CERVID.wsH).map(w => w * sc), tone = far ? 0.7 : 0;
    const Lk = L[k];
    X.cervidLeg(f, Lk, k, ws, LOOK({ fill: mix(coat, dark, tone), maxShade: ws[1] * 0.12, hi: 0 }), { part, stock: o.stock ? (far ? mix(o.stock, dark, 0.45) : o.stock) : undefined, wrap: o.wraps ? o.wraps[k] : undefined, hs: 2.0 * sc / 0.98, sc: Math.max(0.8, sc * 1.5), furDark: coatS, furLite: far ? coatS : coatL, hoof: o.hoof || '#2e2a2c', gy: o.gyFor ? o.gyFor(k) : undefined, planes: o.planes ? (far ? 0.55 : 1) : 0,
      inside: shape => {
        // the back of the leg and the inside of the far legs in shadow, the upper leg shaded under its mass where it
        // meets the belly (the elbow, the stifle), the front edge lit; contour hatching down the back; rot stains
        const d = E.norm(sub(Lk.F, Lk.K)), nn = [-d[1], d[0]], du = E.norm(sub(Lk.E, Lk.S)), bk = 1;
        softTone(f, E.smooth(shape), [
          [[add(Lk.E, mul(nn, ws[1] * 0.1)), add(Lk.E, mul(nn, ws[1] * 0.7)), add(Lk.F, mul(nn, ws[3] * 0.7)), add(Lk.F, mul(nn, ws[3] * 0.0))], dark, Math.min(1, (0.55 + tone * 0.4) * (o.vk ?? 1)), 10 * sc],
          [[lp(Lk.S, Lk.E, 0.3, 0), lp(Lk.S, Lk.E, 0.3, bk * ws[0] * 0.6), lp(Lk.E, Lk.K, 0.35, bk * ws[1] * 0.6), lp(Lk.E, Lk.K, 0.35, 0)], dark, Math.min(1, (0.5 + tone * 0.4) * (o.vk ?? 1)), 18 * sc],
          [[lp(Lk.S, Lk.E, 0.0, -ws[0] * 0.7), lp(Lk.S, Lk.E, 0.0, ws[0] * 0.7), lp(Lk.S, Lk.E, front ? 0.72 : 0.92, ws[1] * 0.7), lp(Lk.S, Lk.E, front ? 0.6 : 0.8, -ws[1] * 0.7)], dark, Math.min(1, 0.55 * (o.vk ?? 1)), 16 * sc],
          ...(far ? [[shape, dark, 0.35, 6 * sc]] : [[[lp(Lk.S, Lk.E, 0.2, -bk * ws[0] * 0.5), lp(Lk.S, Lk.E, 0.9, -bk * ws[1] * 0.55), lp(Lk.E, Lk.K, 0.5, -bk * ws[2] * 0.6), lp(Lk.E, Lk.K, 0.5, -bk * ws[2] * 0.2), lp(Lk.S, Lk.E, 0.5, -bk * ws[1] * 0.1)], coatL, 0.5, 10 * sc]]),
        ]);
        contourHatch(f, shape, [Lk.S, Lk.E, Lk.K], 1, ws[1] * 0.5, 18, { w: 1.1, op: 0.4 });
        contourHatch(f, shape, [Lk.E, Lk.K, Lk.F], 1, ws[2] * 0.7, 16, { w: 1, op: 0.45, bend: 0.05 });
        stains(f, E.smooth(shape), E.bbox(shape), o.stain || P.loamB, 0.03 / sc, 2.6, -1.5, Math.round(Lk.K[0]) % 97, 0.5);
      } });
  };
  return { L, LOOK,
    farLegs: () => { leg('hf', true, 3); leg('ff', true, 3); },
    nearUpper: () => { leg('hn', false, 1); leg('fn', false, 1); },
    nearLower: () => { leg('hn', false, 2); leg('fn', false, 2); },
    // o.neck: { path, cut: [pivot, dir, r] } replaces the barrel's withers-to-brisket front with the neck's crest and throat,
    // so body and neck are ONE outline (no seam where the neck runs into the shoulder); the neck bone gets its own clipped
    // copy beyond the cut. o.vk scales the value range (light-to-shadow) of the modelling below.
    barrel: (extra) => {
      const nk = o.neck, vk = o.vk ?? 1;
      const B0 = nk ? [...CERVID.barrel.slice(0, 8), ...nk.path, ...CERVID.barrel.slice(13)].map(M) : CERVID.barrel.map(M), split0 = M([700, 760]);
      split(f, () => {
        const draw = () => {
          f.part(B0, LOOK({ maxShade: 14 * sc, inkW: 1.6, inkHeavy: 3.2, hi: 0 }));
          X.furField(f, B0, Math.round(260 * sc), 40 * sc, { dir: p => [-0.5, 0.5], w: 4 * sc, dark: coatS, lite: coatL, op: 0.35, liteOp: 0.4 });
          clipDraw(f, B0, () => {
            const T = q => M(q);
            // form, lit from the upper right (upper left after the flip): the top line catches the light; the barrel turns
            // under into a dark belly; the girth hollow behind the shoulder and elbow, the stifle under the ham and the back
            // of the ham turn away into shadow; the round of the quarter and the front of the shoulder stay lit.
            softTone(f, E.smooth(B0), [
              [[T([250, 770]), T([520, 790]), T([800, 820]), T([1160, 790]), T([1160, 1100]), T([240, 1100])], coatS, Math.min(1, 0.7 * vk), 44 * sc],
              [[T([470, 885]), T([700, 900]), T([900, 925]), T([1090, 915]), T([1090, 1060]), T([450, 1010])], dark, Math.min(1, 0.9 * vk), 24 * sc],
              [[T([890, 680]), T([1010, 690]), T([1040, 1010]), T([920, 1010]), T([860, 860])], dark, Math.min(1, 0.85 * vk), 26 * sc],
              [[T([380, 810]), T([540, 830]), T([600, 950]), T([400, 980])], dark, Math.min(1, 0.9 * vk), 22 * sc],
              [[T([236, 680]), T([300, 650]), T([318, 900]), T([236, 900])], dark, Math.min(1, 0.65 * vk), 24 * sc],
              [[T([300, 596]), T([440, 572]), T([700, 602]), T([910, 566]), T([1000, 528]), T([1040, 570]), T([980, 630]), T([700, 650]), T([440, 640]), T([300, 666])], coatL, 0.85, 20 * sc],
              [ell(T([460, 720]), 75 * sc, 95 * sc, 0.3, 14), coatL, 0.45, 30 * sc],
              [[T([1050, 600]), T([1130, 640]), T([1140, 790]), T([1070, 810])], coatL, 0.45, 26 * sc],
            ]);
            // the reflected light just inside the belly's edge, so the barrel reads round, not flat-bottomed
            f.line([T([1060, 990]), T([900, 1000]), T([700, 966]), T([520, 928])], 6 * sc, coatS, { op: 0.35 });
            if (nk && nk.tones) nk.tones(T);
            // the shoulder blade: its spine laid back from the withers to the point of the shoulder, the hollow behind it
            crease(f, [T([980, 570]), T([1020, 650]), T([1070, 740]), T([1100, 790])], 3.6 * sc, { col: dark, lit: coatL, op: 0.55 });
            softTone(f, E.smooth(B0), [[[T([940, 600]), T([990, 600]), T([1040, 800]), T([990, 860])], dark, 0.35, 16 * sc]]);
            crease(f, [T([1050, 800]), T([1030, 880]), T([1040, 960])], 3 * sc, { col: dark, lit: coatL, op: 0.5 }); // the elbow's edge
            // the ham: the seam between the thigh and the hamstring, the round of the quarter, the stifle fold
            crease(f, [T([340, 620]), T([360, 720]), T([400, 840]), T([450, 920])], 3.4 * sc, { col: dark, lit: coatL, op: 0.5 });
            crease(f, [T([280, 680]), T([300, 780]), T([350, 880])], 3 * sc, { col: dark, lit: coatL, op: 0.45 });
            crease(f, [T([560, 900]), T([520, 870]), T([490, 900])], 3.2 * sc, { col: dark, lit: coatL, op: 0.6 }); // the flank fold
            for (let i = 0; i < 7; i++) crease(f, [T([620 + i * 50, 680 + i * 4]), T([630 + i * 48, 790]), T([620 + i * 46, 900 - i * 6])], 2.8 * sc, { col: dark, lit: coatL, op: 0.32 }); // ribs under the hide
            // hatching laid with the form: cross-contours round the barrel from the belly edge, a second crossing pass in
            // the core shadow, verticals in the girth hollow, arcs round the back of the ham and under the stifle
            const hw = 1.2 * Math.max(1, sc);
            contourHatch(f, B0, [T([1050, 990]), T([830, 978]), T([630, 936]), T([494, 918])], -1, 150 * sc, 64, { w: hw, op: 0.5, bend: 0.22 }); // the belly turning under
            contourHatch(f, B0, [T([1040, 1000]), T([830, 980]), T([600, 930])], -1, 70 * sc, 46, { w: hw, op: 0.5, bend: -0.35 });
            contourHatch(f, B0, [T([920, 720]), T([950, 860]), T([960, 1000])], 1, 60 * sc, 22, { w: hw, op: 0.45, bend: 0.1 }); // behind the shoulder
            contourHatch(f, B0, [T([262, 820]), T([248, 724]), T([268, 660])], -1, 110 * sc, 24, { w: hw, op: 0.5 }); // the back of the ham
            contourHatch(f, B0, [T([400, 850]), T([480, 880]), T([560, 930])], 1, 60 * sc, 18, { w: hw, op: 0.5, bend: -0.2 }); // under the ham, the stifle
            stains(f, E.smooth(B0), E.bbox(B0).map((v, i) => v + (i < 2 ? -20 : 20)), o.stain || P.loamB, 0.012 / sc, 2.8, -1.6, seed % 89, 0.55); // rot staining
            if (extra) extra(T);
          });
        };
        if (o.holes) X.cutHoles(f, o.holes, draw, { shape: B0 }); else draw();
      }, nk ? [['spine_1', side(split0, [-1, 0], 70 * sc)], ['spine_2', [side(split0, [1, 0], 70 * sc), side(M(nk.cut[0]), mul(nk.cut[1], -1), nk.cut[2] * sc)]], ['neck', side(M(nk.cut[0]), nk.cut[1], nk.cut[2] * sc)]]
        : [['spine_1', side(split0, [-1, 0], 70 * sc)], ['spine_2', side(split0, [1, 0], 70 * sc)]]);
      return B0;
    },
  };
}
// a long cervid skull in its own frame (x forward along the face, px at scale 1 for the Mother): occiput, poll, the flat
// forehead, the brow ridge over a deep eye socket, the long nasal bridge, a soft rounded muzzle, the cheek and masseter,
// the jaw line. o.grief knots the brow upward and draws a tear track. Returns the frame and the socket centre.
function cervidHead(f, hF, look, o = {}) {
  const sk = hF([[-44, -28], [-12, -52], [40, -64], [96, -62], [132, -52], [160, -44], [206, -36], [264, -22], [322, -8], [356, 6], [374, 26], [372, 46], [352, 58], [300, 60], [232, 66], [164, 82], [100, 96], [40, 100], [-10, 86], [-42, 52], [-54, 12]]);
  f.part(sk, Object.assign({}, look, { maxShade: 10 * (o.s || 1) }));
  const cs = (o.s || 1) * (o.ink ?? 1), dark = o.dark, lite = o.lite;
  clipDraw(f, sk, () => {
    softTone(f, E.smooth(sk), [[hF([[-50, 40], [120, 70], [300, 66], [300, 110], [-50, 110]]), dark, 0.55, 12 * cs], [hF([[60, -70], [330, -20], [330, -4], [60, -40]]), lite, 0.45, 10 * cs], [hF(ell([118, -16], 46, 30, 0, 12)), dark, 0.6, 9 * cs], [hF([[-50, -20], [10, -30], [20, 60], [-50, 50]]), dark, 0.35, 12 * cs]]);
    crease(f, hF([[70, -46], [110, -50], [160, -38]]), 3.2 * cs, { col: dark, lit: lite }); // the brow ridge over the socket
    crease(f, hF([[90, 6], [130, 10], [168, 0]]), 2.4 * cs, { col: dark, lit: lite, op: 0.5 }); // the lower orbit
    crease(f, hF([[170, -24], [250, -12], [330, 10]]), 2.4 * cs, { col: dark, lit: lite, op: 0.45 }); // the side of the nasal bone
    f.line(hF([[150, -48], [250, -32], [340, -10]]), 1.6 * cs, lite, { op: 0.6 }); // the lit bridge
    crease(f, hF([[30, 40], [90, 70], [170, 62]]), 3 * cs, { col: dark, lit: lite, op: 0.55 }); // the masseter's edge
    crease(f, hF([[90, 20], [160, 30], [220, 24]]), 2.2 * cs, { col: dark, lit: lite, op: 0.4 }); // the zygomatic ridge
    contourHatch(f, sk, hF([[20, 98], [120, 92], [230, 66], [300, 60]]), 1, 34 * cs, 16, { w: 1 * cs, op: 0.4 });
    // the soft muzzle: darker, mottled, the nostril's comma, the upper lip's split
    f.flat(hF([[318, -8], [356, 4], [376, 26], [372, 48], [352, 58], [316, 58], [306, 30]]), o.muzzle || P.greyD, { op: 0.8 });
    for (let i = 0; i < 10; i++) f.flat(hF(ell([R(f, 320, 368), R(f, 8, 50)], 2.4, 2, 0, 6)), lite, { op: 0.35 });
    f.stroke(hF([[346, 10], [360, 16], [362, 28], [352, 30]]), 4 * cs, P.void);
    f.line(hF([[300, 60], [330, 58], [352, 58], [366, 50]]), 2 * cs, INK, { op: 0.75 });
    if (o.grief) {
      for (let i = 0; i < 3; i++) f.line(hF([[64 + i * 10, -38 + i * 3], [84 + i * 10, -54 + i * 2], [100 + i * 10, -62 + i * 2]]), 1.4 * cs, dark, { op: 0.6 }); // the inner brow knotted upward
      f.stroke(hF([[140, 0], [158, 24], [170, 56], [176, 82]]), 5 * cs, mix(look.fill, P.loamD, 0.55), { op: 0.7 }); // the tear track, stained
      for (let i = 0; i < 4; i++) f.line(hF([[150 + i * 6, -24 - i * 4], [170 + i * 8, -30 - i * 3]]), 1 * cs, dark, { op: 0.45 }); // crow's feet: age
      for (let i = 0; i < 8; i++) f.line(hF([[R(f, 300, 360), R(f, 40, 60)], [R(f, 300, 360), R(f, 62, 70)]]), 0.9, lite, { op: 0.6 }); // grey whiskers
    }
  });
  return { sk, socket: hF([[118, -16]])[0] };
}
// The Mother's head, modelled as one skull (reviewer rebuild): a curved forehead running into the nasal bone, a deep
// orbit under a brow ridge, the cheek muscle (masseter) as a lit mass with its shadow under it, the lower jaw blended into
// the cheek (the head and jaw outlines are not inked where they meet; both carry the same world-space tones, so the
// under-plane runs on across them), a soft muzzle with a flared nostril, a split upper lip and a lower lip, and ears with
// a shadowed inner cup. Grief: a heavy swollen upper lid, the inner brow drawn up, a wet tear track running plumb.
// No cel band on the skull (shade ~0): the planes are laid by soft tones and form-following hatching.
// hF: head frame (x forward along the face, y toward the jaw; light arrives from local -y). Bones: head, jaw, ear.
function motherHead(f, hF, o) {
  const { hide, hideS, hideL, dark, seed } = o, Q = pts => hF(pts), s = o.s ?? 1, z = v => v * s; // o.s: the frame's scale (1 for the Mother); pixel sizes follow it
  const look = (x = {}) => Object.assign({ fill: hide, shadow: hideS, light: hideL, shade: 0.0001, maxShade: 0.1, hi: 0, hatch: false, tex: 'mottle' + seed, texOp: 0.45, cast: false, inkW: 0, inkHeavy: 0 }, x);
  const skL = [[-52, 8], [-46, -26], [-14, -54], [36, -70], [92, -74], [140, -64], [196, -50], [256, -38], [310, -28], [346, -16], [374, 2], [388, 28], [382, 50], [364, 62], [330, 66], [288, 68], [246, 72], [200, 86], [150, 102], [110, 110], [60, 116], [18, 108], [-14, 84], [-40, 48]];
  const jwL = [[190, 60], [290, 60], [346, 62], [370, 66], [374, 76], [362, 88], [330, 98], [280, 104], [220, 110], [160, 114], [110, 116], [70, 104], [80, 72]];
  const sk = Q(skL), jw = Q(jwL), all = Q([...skL.slice(0, 16), [330, 72], [374, 76], [362, 88], [330, 98], [280, 104], [220, 110], [160, 114], [110, 114], ...skL.slice(20)]);
  // the planes, shared by skull and jaw so the under-plane runs on unbroken
  const tones = () => [
    [Q([[-30, -62], [100, -86], [250, -50], [350, -24], [352, -4], [250, -18], [100, -44], [-30, -30]]), hideL, 0.75, z(10)],   // the top plane: forehead, nasal bone
    [Q(ell([46, -44], 46, 22, 0, 12)), hideL, 0.5, z(12)],                                                                     // the dome of the forehead
    [Q([[-60, 40], [40, 60], [160, 70], [260, 62], [380, 64], [380, 130], [-60, 130]]), dark, 0.85, z(14)],                     // the under-plane of the cheek and jaw
    [Q([[-60, -10], [-20, -4], [-10, 90], [-60, 90]]), dark, 0.55, z(14)],                                                      // the back of the jaw turning away
    [Q(ell([112, -14], 54, 36, 0, 14)), dark, 0.9, z(9)],                                                                     // the orbit
    [Q([[70, -46], [150, -50], [150, -34], [70, -30]]), dark, 0.5, z(5)],                                                       // under the brow ridge
    [Q([[150, -8], [210, 6], [214, 26], [150, 14]]), dark, 0.45, z(6)],                                                         // the tear pit in front of the eye
    [Q(ell([64, 30], 62, 24, -0.1, 12)), hideL, 0.42, z(10)],                                                                  // the cheek muscle's lit top
    [Q([[180, 0], [320, 4], [330, 50], [180, 50]]), hideS, 0.55, z(14)],                                                     // the side of the face falling toward the lip
  ];
  const hatch = clip => {
    contourHatch(f, clip, Q([[0, 106], [60, 116], [120, 112], [200, 96], [260, 84]]), -1, z(40), 30, { w: 0.9, op: 0.38, bend: 0.15, jit: 0.9 });  // under the cheek
    contourHatch(f, clip, Q([[120, 112], [220, 108], [300, 102], [360, 90]]), -1, z(22), 18, { w: 0.9, op: 0.38, jit: 0.9, bend: -0.3 });                        // the under-jaw
    contourHatch(f, clip, Q([[-46, -20], [-50, 20], [-30, 64], [-10, 90]]), 1, z(30), 14, { w: 0.9, op: 0.38, jit: 0.9 });                       // behind the cheek
    contourHatch(f, clip, Q(ell([112, -14], 56, 36, 0, 16).slice(2, 11)), -1, z(14), 14, { w: 0.9, op: 0.42, jit: 0.8 });                           // round the orbit, low side
  };
  // ---- far ear behind the head (head bone), then the near ear (ear bone), the mouth's dark inside (head)
  f.bone('head');
  const fe = Q([[-6, -50]])[0], fear = [add(fe, mul([10, 8], s)), add(fe, mul([-10, -96], s)), add(fe, mul([-44, -170], s)), add(fe, mul([-80, -160], s)), add(fe, mul([-74, -84], s)), add(fe, mul([-30, 20], s))];
  f.part(fear, look({ fill: mix(hide, dark, 0.5), shade: 0.4, maxShade: 14, hatch: true, inkW: 1.4, inkHeavy: 2.4 }));
  f.part([lerp(fear[0], fear[2], 0.2), lerp(fear[1], fear[2], 0.5), lerp(fear[3], fear[2], 0.4), lerp(fear[4], fear[3], 0.3)], { fill: mix(P.pinkS, P.loamD, 0.4), shadow: P.loamD, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: true });
  f.bone('ear');
  const eb = Q([[-14, -36]])[0];
  const ear = [add(eb, mul([16, 10], s)), add(eb, mul([-34, -96], s)), add(eb, mul([-96, -170], s)), add(eb, mul([-150, -156], s)), add(eb, mul([-124, -84], s)), add(eb, mul([-40, 24], s))];
  const ec = mul(ear.reduce((a, q) => add(a, q), [0, 0]), 1 / ear.length), cup = [ear[0], ear[1], ear[2], ear[3], ear[4], ear[5]].map(q => add(add(ec, mul(sub(q, ec), 0.62)), mul(sub(ear[1], ec), 0.16)));
  X.cutHoles(f, [[add(eb, mul([-96, -112], s)), z(15)]], () => {
    f.part(ear, Object.assign(look({ inkW: 1.6, inkHeavy: 2.8, shade: 0.3, maxShade: 12, hatch: true })));
    clipDraw(f, ear, () => softTone(f, E.smooth(ear), [[[ear[0], ear[1], ear[2], lerp(ear[2], ear[3], 0.5)], hideL, 0.6, 10], [[ear[5], ear[4], ear[3], lerp(ear[3], ear[2], 0.4)], dark, 0.5, 10]]));
    // the inner cup: deep at the base, lilac-grey skin, the pale hair along its rim, folds
    f.part(cup, { fill: mix(P.pinkD, hide, 0.45), shadow: mix(P.pinkS, hideS, 0.4), shade: 0.45, maxShade: 14, hi: 0, inkW: 1.1, inkHeavy: 1.8, cast: false, hatch: true, tex: 'mottle' + seed, texOp: 0.4 });
    clipDraw(f, cup, () => { softTone(f, E.smooth(cup), [[[cup[0], cup[5], lerp(cup[4], cup[5], 0.5), lerp(cup[0], cup[1], 0.4)], P.loamD, 0.85, 12], [[lerp(cup[1], cup[2], 0.3), cup[2], lerp(cup[2], cup[3], 0.5)], hideL, 0.35, 8]]); for (let i = 0; i < 3; i++) f.line([lerp(cup[0], cup[1], 0.3 + i * 0.22), lerp(cup[1], cup[2], 0.2 + i * 0.25), lerp(cup[5], cup[4], 0.4 + i * 0.2)], 1.4, P.loamD, { op: 0.45 }); });
    { const d = E.norm(sub(ear[2], ear[0])); for (let i = 0; i < 16; i++) { const q = lerp(lerp(cup[0], cup[1], 0.5), lerp(cup[1], cup[2], 0.7), i / 15); f.line([q, add(q, rot(mul(d, z(R(f, 12, 24))), R(f, -0.5, -0.1)))], 1.1, hideL, { op: 0.8 }); } } // pale hair along the cup's front rim
    X.fungalFur(f, ear.slice(1, 4), z(10), 1, { col: hideL, col2: P.boneS });
  }, { shape: ear });
  f.bone('head');
  f.flat(Q([[210, 58], [360, 56], [372, 70], [350, 104], [220, 112], [180, 80]]), mix(P.pinkS, P.loamD, 0.6));
  // ---- the lower jaw: lower lip and chin under the split upper lip, the under-jaw running back under the cheek
  f.bone('jaw');
  f.part(jw, look());
  clipDraw(f, jw, () => {
    softTone(f, E.smooth(jw), tones());
    f.flat(Q([[300, 62], [372, 66], [376, 82], [356, 94], [300, 96]]), o.muzzle, { op: 0.55 }); // the soft lower lip
    f.line(Q([[250, 74], [310, 72], [360, 72]]), 2, hideL, { op: 0.55 }); // the lower lip's wet lit edge
    hatch(jw);
    for (let i = 0; i < 7; i++) f.line(Q([[R(f, 300, 360), R(f, 92, 100)], [R(f, 300, 360), R(f, 108, 116)]]), 0.9, hideL, { op: 0.6 }); // chin whiskers
  });
  f.line(Q([[370, 66], [376, 78], [362, 90], [330, 99], [280, 105], [220, 111], [160, 115], [116, 114]]), 2.6, INK, { op: 0.9 });
  // ---- the skull
  f.bone('head');
  f.part(sk, look());
  clipDraw(f, sk, () => {
    softTone(f, E.smooth(sk), tones());
    hatch(sk);
    stains(f, E.smooth(sk), E.bbox(sk), mix(P.loamB, P.yelD, 0.3), 0.02, 2.8, -1.6, 77, 0.35);
    crease(f, Q([[64, -48], [104, -54], [148, -42], [170, -30]]), 3.2, { col: dark, lit: hideL, op: 0.6 }); // the brow ridge's edge
    crease(f, Q([[150, -36], [200, -26], [260, -14], [320, 2]]), 2.2, { col: dark, lit: hideL, op: 0.4 }); // the side of the nasal bone
    crease(f, Q([[0, 30], [40, 64], [110, 88], [190, 84]]), 2.8, { col: dark, lit: hideL, op: 0.55 }); // the masseter's lower edge
    crease(f, Q([[40, 10], [100, 18], [170, 16]]), 2, { col: dark, lit: hideL, op: 0.35 }); // the zygomatic arch
    f.line(Q([[0, -58], [80, -70], [180, -52], [300, -26], [340, -12]]), 2, hideL, { op: 0.7 }); // the lit line of the forehead and bridge
    // the muzzle: soft, dark, mottled, the nose leather, the flared nostril with its lit wing, the split upper lip
    const mz = Q([[300, -24], [350, -14], [378, 4], [390, 30], [382, 54], [360, 64], [320, 66], [292, 40], [290, 4]]);
    softTone(f, E.smooth(sk), [[mz, o.muzzle, 0.75, 8], [Q([[320, -14], [372, 4], [362, 12], [320, 0]]), hideL, 0.35, 5]]);
    for (let i = 0; i < 14; i++) f.flat(Q(ell([R(f, 318, 372), R(f, 4, 56)], 2.2, 1.8, 0, 6)), hideL, { op: 0.3 });
    f.part(Q([[340, 4], [362, 4], [376, 16], [378, 30], [368, 36], [354, 28], [342, 18]]), { fill: mix(o.muzzle, '#000', 0.25), shadow: P.loamD, shade: 0.4, maxShade: 6, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false, tex: 'mottle' + seed, texOp: 0.6 }); // the nose leather
    f.stroke(Q([[352, 12], [366, 18], [370, 30], [360, 34]]), z(6), P.void); // the nostril
    f.line(Q([[336, 2], [356, 0], [372, 10]]), 2.2, hideL, { op: 0.7 }); // the lit wing over the nostril
    crease(f, Q([[338, 14], [342, 30], [352, 42]]), 2.2, { col: P.loamD, lit: hideL, op: 0.7 }); // the fold behind the wing
    f.line(Q([[376, 34], [372, 46], [366, 60]]), 1.8, INK, { op: 0.7 }); // the split of the upper lip
    f.line(Q([[300, 52], [330, 60], [360, 62]]), 1.6, mix(o.muzzle, '#000', 0.4), { op: 0.6 }); // the upper lip's fold
    for (let i = 0; i < 6; i++) f.flat(Q(ell([R(f, 320, 360), R(f, 40, 58)], 1.4, 1.4, 0, 5)), P.loamD, { op: 0.7 }); // whisker pores
    for (let i = 0; i < 8; i++) { const q = Q([[R(f, 316, 360), R(f, 44, 60)]])[0]; f.line([q, add(q, mul([R(f, 8, 18), R(f, 6, 14)], s))], 0.8, hideL, { op: 0.7 }); } // grey whiskers
    // grief: the inner brow (the front end, toward the muzzle) drawn up in folds
    if (o.grief !== false) {
    for (let i = 0; i < 3; i++) f.line(Q([[120 + i * 8, -40 - i * 4], [140 + i * 8, -50 - i * 3], [158 + i * 6, -50 - i * 2]]), 1.4, dark, { op: 0.6 });
    for (let i = 0; i < 4; i++) f.line(Q([[70 - i * 4, -16 - i * 6], [56 - i * 6, -22 - i * 7]]), 1, dark, { op: 0.45 }); // crow's feet at the outer corner: age
    }
  });
  // ink only on the true outline: the back of the head, the poll, forehead, bridge, nose and upper lip, the mouth line and
  // the jaw's angle; never along the seam where skull meets jaw
  f.stroke(Q([[110, 110], [60, 116], [18, 108], [-14, 84], [-40, 48], [-52, 8], [-46, -26]]), 3.6, INK, { op: 0.9 });
  f.line(Q([[-46, -26], [-14, -54], [36, -70], [92, -74], [140, -64], [196, -50], [256, -38], [310, -28], [346, -16], [374, 2], [388, 28], [382, 50], [364, 62]]), 1.8, INK);
  f.stroke(Q([[362, 62], [330, 67], [288, 69], [246, 72], [216, 80]]), 2.6, INK, { op: 0.85 }); // the mouth line, fading into the cheek
  return { socket: Q([[112, -16]])[0], Q, all };
}
// a heavy antler: a knobbled burr, a beam thick at the base, beaded and furrowed, tapering as it curves up, back and
// forward; tines leaving with fillets and curving up to their points; the crown forking. Hung with moss and strips of
// shed velvet. P0 the pedicel, sc scale, tone darkens it (far side). Returns the beam and the tines' bases.
function heavyAntler(f, P0, sc, tone, o = {}) {
  // (pass 2) the beam sweeps back and up, then forward into the crown; every tine leaves the FRONT of the beam, runs
  // forward a little and curves up and back (inward) to its point, each a different length; the base is furrowed
  // lengthwise and beaded (pearling) on the ridges; the burr is a ring of knobs round the beam's foot.
  const seed = f.o.seed, lk = { fill: mix(P.bone, P.boneS, tone), shadow: mix(P.boneD, P.loamD, 0.3), light: P.boneL, shade: 0.42, maxShade: 18 * sc, hatch: true, inkW: 1.8, inkHeavy: 3.2, tex: 'mottle' + seed, texOp: 0.5 };
  const bm = (o.path || [[0, 0], [-40, -110], [-130, -220], [-200, -340], [-210, -470], [-160, -590], [-120, -700]]).map(q => add(P0, mul(q, sc)));
  const C = spline(bm, 5), n = C.length, W = C.map((_, i) => { const t = i / (n - 1); return (78 - 56 * Math.pow(t, 0.7)) * sc; }), at = t => Math.min(n - 1, Math.round(t * (n - 1)));
  const rough = (pts, amp, upTo) => pts.map((q, i) => { const t = i / (pts.length - 1); return (t < upTo || t > 1 - upTo) ? add(q, [(f.r() - 0.5) * amp, (f.r() - 0.5) * amp]) : q; });
  // [t on the beam, length, how far the point curls back, sideways lean]
  const tines = o.tines || [[0.05, 270, 0.1, 0], [0.15, 196, 0.25, 0.1], [0.4, 240, 0.15, -0.05], [0.62, 150, 0.3, 0.08], [0.76, 186, 0.2, -0.1], [0.89, 122, 0.35, 0.05]];
  const tips = [];
  const drawTine = ([t, l, cu, lean]) => {
    const i = at(t), b0 = C[i], tg = E.norm(sub(C[Math.min(n - 1, i + 1)], C[Math.max(0, i - 1)])), nf0 = [-tg[1], tg[0]], nf = nf0[0] > 0 ? nf0 : mul(nf0, -1), up = [0, -1], L = l * sc;
    const tc = spline([add(b0, mul(nf, -W[i] * 0.2)), add(add(b0, mul(nf, L * 0.34)), mul(up, L * (0.06 + lean))), add(add(b0, mul(nf, L * 0.56)), mul(up, L * 0.38)), add(add(b0, mul(nf, L * (0.66 - cu * 0.25))), mul(up, L * 0.7)), add(add(b0, mul(nf, L * (0.64 - cu * 0.45))), mul(up, L * 0.94))], 6);
    const tw = tc.map((_, j) => { const u = j / (tc.length - 1); return Math.max(2.5, W[i] * (1.0 - 0.45 * Math.min(1, u * 3)) * Math.pow(1 - u, 0.75)); });
    const rb = ribbon(tc, tw), m = tc.length, tip = tc[m - 1];
    f.part([...rough(rb.slice(0, m), 4 * sc, 0.25), [...add(tip, mul(E.norm(sub(tip, tc[m - 2])), 3)), 1], ...rough(rb.slice(m), 4 * sc, 0.25)], Object.assign({}, lk, { k: 0.85 }));
    clipDraw(f, rb, () => { for (let j = 2; j < m - 3; j += 2) f.line([lp(tc[j], tc[j + 1], 0, -tw[j] * 0.3), lp(tc[j], tc[j + 2], 1, -tw[j] * 0.25)], 1.2, P.boneD, { op: 0.5 }); f.line(tc.slice(1, -1).map((q, j) => add(q, mul(f.L, -tw[j + 1] * 0.3))), Math.max(1, tw[0] * 0.08), P.boneL, { op: 0.55 }); softTone(f, E.smooth(rb), [[rb.slice(m), mix(P.boneD, P.loamD, 0.3), 0.35, 5 * sc]]); });
    for (let j = 0; j < 4; j++) { const q = lp(tc[1], tc[3], R(f, 0, 1), -tw[1] * R(f, 0.1, 0.4)); f.flat(ell(q, 3 * sc, 2.4 * sc, 0, 6), P.boneD, { op: 0.6 }); } // pearling at the tine's root
    tips.push([tc, tw]);
  };
  // the burr: a ring of knobs; the back half behind the beam, the front half over it
  // (ruler pass) a rough ring of irregular bony knobs, not a coiled rope: the knobs set at uneven steps round the ring and
  // at uneven distances from it, of very different sizes (a few great gnarls, many small), some long and leaning up the
  // beam, some bulging out sideways; each lit hard on its top facet with a dark crevice under it, on a rough bony collar
  const bA = o.burrA ?? -0.3, ring = []; { let a = R(f, 0, 6.3); const a0 = a; while (ring.length < 20 && a < a0 + Math.PI * 2) { a += R(f, 0.18, 0.5); const rr = R(f, 0.8, 1.2), big = f.r() < 0.25; ring.push([add(P0, rot([Math.cos(a) * 50 * sc * rr, Math.sin(a) * 21 * sc * rr - (big ? R(f, 2, 10) * sc : 0)], bA)), Math.sin(a), (big ? R(f, 15, 24) : R(f, 5, 13)) * sc, R(f, 0.55, 1.0), R(f, -1.2, 1.2)]); } }
  const knob = ([q, , r, el, ka]) => { const pts = ell(q, r, r * el, ka - Math.PI / 2 * 0.5, 10).map(p2 => add(p2, [R(f, -r * 0.18, r * 0.18), R(f, -r * 0.18, r * 0.18)]));
    f.raw(`<path d="${E.smooth(pts.map(p2 => add(p2, mul(f.L, -r * 0.35))))}" fill="${P.loamD}" opacity="0.7"/>`); // the crevice under it
    f.part(pts, Object.assign({}, lk, { fill: mix(P.bone, P.boneD, 0.3 + tone * 0.3), maxShade: r * 0.45, cast: false, inkW: 1, inkHeavy: 1.8, hatch: true, k: 0.8 }));
    f.flat([add(q, mul(f.L, r * 0.15)), add(q, add(mul(f.L, r * 0.75), rot([r * 0.4, 0], ka))), add(q, mul(f.L, r * 0.85)), add(q, add(mul(f.L, r * 0.75), rot([-r * 0.4, 0], ka)))].map(p2 => [...p2, 1]), P.boneL, { op: 0.55 }); // the lit top facet, hard-edged
    if (r > 12 * sc) f.line([add(q, rot([-r * 0.5, r * 0.1], ka)), add(q, rot([-r * 0.1, r * 0.3], ka)), add(q, rot([r * 0.3, r * 0.25], ka))], 1.2 * sc, P.loamD, { op: 0.6 }); }; // a crack across the big ones (no paired pits: they read as faces)
  { const col = ell(P0, 56 * sc, 25 * sc, bA, 22).map(p2 => add(p2, [R(f, -6, 6) * sc, R(f, -5, 5) * sc])); f.part(col, Object.assign({}, lk, { fill: mix(P.boneD, P.loamD, 0.3), maxShade: 8, cast: true, castOp: 0.5, k: 0.7 })); f.line(ell(P0, 50 * sc, 20 * sc, bA, 22).slice(12, 22), 2.4 * sc, P.loamD, { op: 0.7 }); }
  ring.filter(q => q[1] < 0).forEach(knob);
  for (const tn of tines.filter((_, j) => j % 2)) drawTine(tn);
  const rbB = ribbon(C, W);
  f.part([...rough(rbB.slice(0, n), 7 * sc, 0.45), ...rough(rbB.slice(n), 7 * sc, 0.45)], lk);
  clipDraw(f, rbB, () => {
    // furrows running lengthwise up the beam, strongest at the base, with beaded ridges between them
    for (const k of [-0.32, -0.12, 0.08, 0.26]) { const ln = X.offsetLine(C.slice(0, at(0.6)), t => W[0] * k * (1 - 0.6 * t) + Math.sin(t * 9 + k * 7) * 2 * sc); f.line(ln, 2.2 * sc, P.boneD, { op: 0.6 }); f.line(ln.map(q => add(q, mul(f.L, -2.5 * sc))), 1 * sc, P.boneL, { op: 0.45 }); }
    for (let i = 0; i < 90; i++) { const t = Math.pow(f.r(), 1.8) * 0.55, j = at(t), q = add(C[j], mul([-(C[Math.min(n - 1, j + 1)][1] - C[j][1]), C[Math.min(n - 1, j + 1)][0] - C[j][0]].map(v => v / (E.len(sub(C[Math.min(n - 1, j + 1)], C[j])) || 1)), W[j] * R(f, -0.42, 0.42))), r = R(f, 2.5, 6) * sc * (1 - t); f.flat(ell(q, r, r * 0.8, 0, 7), P.boneD, { op: 0.65 }); f.flat(ell(add(q, mul(f.L, -r * 0.4)), r * 0.55, r * 0.42, 0, 6), P.boneL, { op: 0.65 }); } // pearling
    softTone(f, E.smooth(rbB), [[[...rbB.slice(n)].slice(0, n), mix(P.boneD, P.loamD, 0.3), 0.45, 8 * sc]]);
  });
  for (const tn of tines.filter((_, j) => !(j % 2))) drawTine(tn);
  ring.filter(q => q[1] >= 0).forEach(knob);
  // moss on the upper faces, strips of shed velvet hanging plumb, torn at the ends
  for (const [a0, a1] of [[0.08, 0.24], [0.42, 0.56]]) X.moss(f, C.slice(at(a0), at(a1)).map((q, i) => add(q, [W[at(a0) + i] * 0.25, -W[at(a0) + i] * 0.4])), 9 * sc, { stalks: true, col: mix(P.rot, P.rotL, 0.6) }); // moss in patches on the beam's upper face
  for (const [tc, tw] of tips.slice(0, 2)) X.moss(f, tc.slice(1, Math.round(tc.length * 0.3)).map((q, j) => add(q, [0, -tw[j + 1] * 0.45])), 6 * sc, { stalks: false, col: P.rotL });
  const velvet = (q, l, w) => { const pts = [q, add(q, [R(f, -4, 4), l * 0.35]), add(q, [R(f, -8, 8), l * 0.7]), add(q, [R(f, -10, 10), l])], rb = ribbon(spline(pts, 4), spline(pts, 4).map((_, i, a) => w * (1 - 0.5 * i / a.length))); f.part(rb, { fill: mix(P.pinkD, P.loamB, 0.4 + tone * 0.2), shadow: P.loamD, light: P.pink, shade: 0.4, inkW: 1, inkHeavy: 1.5, cast: true, castOp: 0.3, hatch: true, tex: 'mfur' + seed, texOp: 0.6 }); const e = pts[3]; for (let k = -1; k <= 1; k++) f.line([e, add(e, [k * w * 0.3, R(f, 6, 14)])], 1, mix(P.pinkD, P.loamB, 0.4), { op: 0.8 }); };
  for (const t of [0.18, 0.4, 0.62]) velvet(add(C[at(t)], [W[at(t)] * 0.1, W[at(t)] * 0.3]), R(f, 80, 160) * sc, 12 * sc);
  for (const [tc] of tips.slice(0, 3)) velvet(tc[Math.round(tc.length * 0.4)], R(f, 50, 110) * sc, 8 * sc);
  return { C, W, at, tips };
}

// ------------------------------------------------------------------ THE ANTLERED MOTHER (ruler 4)
// The garden's heart: the white hind of the fey garden, grown through with fungus and eyes. She is the garden now. A
// colossal white hind, antlered though a doe, standing among her roots with her head raised; her heavy antlers run out of
// the frame top, beaded and furrowed, hung with moss and strips of shed velvet, and the Tooth is lodged in the fork of the
// near antler. Her hide is split open along the flank and over the haunch: rolled pink lips, a dark wet depth, and zoned
// bracket shelves erupting in irregular clusters, a few eyes opened among them. Roots spread from her hooves into the loam
// and climb her legs; great roots rise behind her toward the sky. A long, ancient, grieving face: the brow knotted, the
// socket deep, a stained tear track, human eyes too many. A garland of browned flowers is still round her neck.
// Scale 4 with the antlers: the body (shared cervid anatomy) stands with the withers at 1.6 humans; the antlers carry her
// to 4 and out of the frame, like a cathedral seen from inside.
// Toxin: zoned brackets in the wounds, moss, mould and rot stains, galls, peeling hide, browned blooms. Void: clean round
// holes through the near ear and the haunch (see-through), the eyes set into the growth and the face.
// Rig: spine_1 (root, hindquarters) > spine_2 > neck > head > jaw, ear, antler_n (> tooth), antler_f; tail; legs
// leg_<k>_1..3; roots (root). Motion: idle the eyes blinking in waves (eye sprites swapped open/shut by the engine);
// attack a spore exhalation (neck lifts, head tips up, jaw opens).
function antleredMother() {
  const [CW, CH] = TIERS.ruler, seed = 1400;
  const f = new Fig(X.base(seed, CH, { grimeY: CH - 30 - 260 })); X.textures(f);
  const gy = f.o.groundY, sc = 1, M = p => [p[0], p[1]];
  const hide = mix(P.bone, P.grey, 0.3), hideS = mix(P.boneS, P.lilacS, 0.45), hideL = P.boneL;
  const RT = (o = {}) => Object.assign({ col: mix(P.loam, P.loamL, 0.5), shadow: P.loamD, light: P.loamB, pow: 0.6, knot: 0.18 }, o);
  const EYE = { lid: mix(P.bone, P.pinkD, 0.45), lidS: hideS, iris: P.loamD, lashes: true };
  const poll = [1236, 470], hA = 0.6, HC = poll, hF = frame(HC, hA, 1);
  const P0n = hF([[30, -56]])[0], P0f = hF([[58, -60]])[0];
  f.joint('spine_1', [420, 700]).joint('spine_2', [700, 700], 'spine_1').joint('neck', [1105, 675], 'spine_2').joint('head', poll, 'neck').joint('tail', [290, 640], 'spine_1');
  f.joint('jaw', hF([[60, 72]])[0], 'head').joint('ear', hF([[-10, -40]])[0], 'head').joint('antler_n', P0n, 'head').joint('antler_f', P0f, 'head').joint('tooth', [0, 0], 'antler_n').joint('roots', [900, gy], null);
  // NECK: the crest from the withers up to the poll and the throat down to the brisket, in the barrel's own outline, cut
  // for the neck bone across its root. Its planes: the crest lit, the long muscle from behind the jaw to the point of the
  // shoulder lit along its top, the jugular groove under it, the throat's underside dark; the muscle runs on into the
  // shoulder with no line between them.
  const dkTone = mix(P.boneD, P.lilacS, 0.62);
  const NECK = { path: [[1046, 516], [1104, 482], [1160, 444], [1206, 414], [1250, 420], [1296, 470], [1306, 540], [1300, 600], [1284, 680], [1256, 756], [1214, 830], [1166, 890], [1116, 940]], cut: [[1105, 675], [0.6, -0.8], 195],
    tones: T => {
      softTone(f, E.smooth(CERVID.barrel.slice(0, 8).concat(NECK.path, CERVID.barrel.slice(13))), [
        [[[1000, 530], [1080, 490], [1170, 430], [1230, 410], [1240, 450], [1180, 490], [1090, 540], [1010, 580]], hideL, 0.85, 16],        // the crest catching the light
        [[[1200, 560], [1290, 560], [1310, 700], [1250, 830], [1170, 920], [1110, 950], [1150, 860], [1220, 740], [1250, 640]], dkTone, 0.85, 22], // the throat's underside
        [[[1090, 600], [1200, 520], [1240, 560], [1160, 680], [1120, 780], [1080, 760]], hideL, 0.45, 22],                                   // the long muscle's lit top
      ]);
      crease(f, [[1250, 600], [1220, 690], [1176, 780], [1130, 860]], 4.2, { col: dkTone, lit: hideL, op: 0.6 }); // the jugular groove
      crease(f, [[1200, 540], [1150, 620], [1120, 700], [1108, 790]], 3, { col: dkTone, lit: hideL, op: 0.35 }); // the muscle's back edge, flowing into the shoulder
      contourHatch(f, CERVID.barrel.slice(0, 8).concat(NECK.path, CERVID.barrel.slice(13)), [[1300, 600], [1284, 680], [1256, 756], [1214, 830], [1166, 890], [1116, 940]], -1, 80, 40, { w: 1.2, op: 0.55, bend: -0.15 }); // the throat turning under
      contourHatch(f, CERVID.barrel.slice(0, 8).concat(NECK.path, CERVID.barrel.slice(13)), [[1290, 640], [1250, 760], [1180, 870]], -1, 40, 24, { w: 1.1, op: 0.5, bend: 0.3 });
      stains(f, E.smooth(CERVID.barrel.slice(0, 8).concat(NECK.path, CERVID.barrel.slice(13))), [1000, 400, 1330, 960], mix(P.loamB, P.yelD, 0.3), 0.012, 2.8, -1.6, 71, 0.45);
    } };
  const body = cervidBody(f, M, sc, { coat: hide, coatS: hideS, coatL: hideL, belly: mix(P.boneS, P.lilacS, 0.3), dark: dkTone, stain: mix(P.loamB, P.yelD, 0.3), holes: [[[300, 760], 30]], neck: NECK, vk: 1.15, planes: true, // (ruler pass) hard-edged planes at the knees, hocks and fetlocks
    stock: mix(hideS, P.loamB, 0.35), // darker hair on the lower legs, as on a real deer, breaking the pale columns
    wraps: { hn: [{ turns: 2.3, w: 17, up: 0.95, phase: 0.4 }], fn: [{ turns: 2.0, w: 16, up: 0.85, phase: 1.6 }], hf: [{ turns: 1.7, w: 13, up: 0.7, phase: 2.4, col: P.loam }], ff: [{ turns: 1.5, w: 12, up: 0.6, phase: 0.9, col: P.loam }] } });

  // ---- behind: the great roots rising toward the sky, the far antler, the far legs, the tail
  f.bone('roots');
  for (const [pts, w] of [[[[90, gy], [70, 1200], [140, 800], [80, 400], [160, 0]], 120], [[[1500, gy], [1540, 1200], [1470, 900], [1550, 600], [1480, 200], [1540, -20]], 90]]) { const r = X.root(f, pts, w, 14, RT({ rootlets: 9, cast: false })); for (let i = 0; i < 3; i++) X.cap(f, r.C[Math.floor(R(f, 0.3, 0.9) * r.C.length)], -Math.PI / 2 + R(f, -0.6, 0.6), R(f, 40, 70), { col: [P.pink, P.yel][i % 2], shape: 'flat' }); X.eyes(f, [[r.C[Math.floor(r.C.length * 0.55)], 40, 0.2, 0.55]], EYE); }
  f.bone('antler_f');
  heavyAntler(f, P0f, 1.0, 0.4, { path: [[0, 0], [-10, -110], [-70, -230], [-110, -360], [-100, -500], [-50, -620]] });
  body.farLegs();
  body.nearUpper();
  f.bone('tail');
  f.part([[296, 626], [262, 640], [246, 690], [262, 726], [290, 700], [306, 660]], body.LOOK({ fill: hideL, maxShade: 8 }));
  f.flat([[270, 650], [288, 646], [288, 700], [272, 712]], P.loamB, { op: 0.6 });

  // ---- the barrel; the wounds; the rot
  body.barrel(T => {
    for (let i = 0; i < 4; i++) X.mould(f, T([R(f, 400, 900), R(f, 640, 820)]), R(f, 30, 60), R(f, 20, 34), { col: [P.lilac, P.yel, P.pink, P.lilacL][i], op: 0.35 });
    X.pustules(f, T([1080, 760]), 30, 40, 7, 6, 10, { col: P.pinkL });
    X.peel(f, T([980, 900]), 5, 2, 60, hide);
    for (let i = 0; i < 6; i++) f.stroke([T([R(f, 600, 900), 1000]), T([R(f, 600, 900), 980])].map((q, j) => add(q, [j * 8, 0])), 5, hideS, { op: 0.35 }); // old scars on the belly
    // (pass 2) the coat: a darker dorsal stripe; hair lying in tracts of short directional strokes that follow the form
    // (back along the barrel, down off the withers over the shoulder, down the thigh from a whorl at the flank, back and
    // down under the belly); moult patches where the coat has come away from grey skin, their rims tufted
    const all = CERVID.barrel.slice(0, 8).concat(NECK.path, CERVID.barrel.slice(13));
    softTone(f, E.smooth(all), [[[[290, 640], [440, 590], [700, 618], [910, 582], [1000, 548], [1010, 572], [910, 612], [700, 646], [440, 620], [300, 668]], mix(hideS, P.loamB, 0.25), 0.5, 10]]);
    const hairDir = p => { const [x, y] = p; if (y > 900) return [-0.75, 0.5]; if (x > 930) return [-0.25, 1]; if (x < 520) { const d = E.norm(sub(p, [470, 760])); return [d[0] * 0.4 - 0.2, 1]; } return [-1, 0.28 + (y - 700) / 600]; };
    X.furField(f, all, 900, 20, { dir: hairDir, w: 2.4, dark: dkTone, lite: hideL, op: 0.5, liteOp: 0.55 });
    for (const [c, rx, ry, a] of [[[620, 700], 34, 20, 0.2], [[880, 860], 26, 18, -0.3], [[420, 860], 22, 30, 0.4], [[1180, 760], 24, 16, -0.6], [[760, 900], 18, 12, 0]]) {
      const mp = ell(c, rx, ry, a, 14).map(q => add(q, [R(f, -rx * 0.18, rx * 0.18), R(f, -ry * 0.18, ry * 0.18)]));
      f.part(mp, { fill: mix(P.grey, P.lilacS, 0.3), shadow: mix(P.greyS, P.lilacS, 0.4), light: P.greyL, shade: 0.35, maxShade: 5, hi: 0, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + seed, texOp: 0.6 });
      for (let i = 0; i < mp.length; i++) { const q = mp[i], d = E.norm(sub(q, c)); f.line([add(q, mul(d, -2)), add(q, add(mul(d, R(f, 5, 10)), [-3, 4]))], 1.2, i % 2 ? hideL : dkTone, { op: 0.75 }); } // tufted rim
      f.line(mp.slice(8, 14), 1.4, dkTone, { op: 0.5 });
    }
  });
  const gash = (bone, pts, w, nb, eyesL) => {
    f.bone(bone);
    const Cs = spline(pts, 6), L = Cs.length;
    const up = X.offsetLine(Cs, t => -w * 5 * Math.sin(Math.PI * t) ** 0.7), dn = X.offsetLine(Cs, t => w * 4 * Math.sin(Math.PI * t) ** 0.7);
    const lens = [...up, ...dn.slice().reverse()];
    f.part(lens, { fill: P.pinkD, shadow: P.pinkS, light: P.pink, shade: 0.45, inkW: 1.6, inkHeavy: 2.6, cast: false, hatch: true, tex: 'mottle' + seed, texOp: 0.5, maxShade: w * 2 });
    f.flat([...X.offsetLine(Cs, t => -w * 2.6 * Math.sin(Math.PI * t) ** 0.7), ...X.offsetLine(Cs, t => w * 1.8 * Math.sin(Math.PI * t) ** 0.7).reverse()], P.pinkS, { op: 0.92 });
    f.line(up.slice(1, -1), 3.4, hideL, { op: 0.8 }); f.line(dn.slice(1, -1), 2.6, hideS, { op: 0.7 }); // the hide's torn edges
    X.fungalFur(f, up, 10, -1, { gaps: 0.2 });
    X.brackets(f, pts, nb, Math.PI / 2, 140, 84, { kind: 'zoned', cols: [P.yel, P.pink, mix(P.yel, P.bone, 0.4), P.lilac] });
    X.eyes(f, eyesL, EYE);
  };
  { const r0 = f.r; f.r = E.rng(seed * 31 + 3); // the wounds draw from their own generator, so edits elsewhere cannot re-roll them
  gash('spine_2', [[1000, 640], [940, 700], [860, 750], [770, 790], [690, 810]], 11, 14, [[[880, 700], 58, 0.3, 0.6], [[760, 760], 46, 0.1, 0.0], [[820, 800], 36, -0.2, 0.85]]);
  gash('spine_1', [[400, 640], [356, 700], [334, 780], [340, 840]], 10, 8, [[[372, 690], 48, 0.6, 0.45]]);
  f.r = r0; }

  // ---- near lower legs, roots from the hooves into the loam and climbing the legs
  body.nearLower();
  f.bone('roots');
  for (const k of ['hf', 'ff', 'hn', 'fn']) {
    const Q = body.L[k].Q, far = k[1] === 'f';
    for (const [dx, l, dy] of [[-1, 200, 10], [1, 220, 14], [0.3, 100, 30]]) X.root(f, [add(Q, [0, 30]), add(Q, [dx * l * 0.4, 46]), add(Q, [dx * l, 40 + dy]), add(Q, [dx * l * 1.3, 60 + dy])], far ? 24 : 32, 3, RT({ rootlets: 3, cast: false, col: far ? P.loam : mix(P.loam, P.loamL, 0.5) }));
  }
  f.bone('root');
  X.loamGround(f, 0, 1600, gy, { depth: 28, petals: 12 });

  // ---- the neck (drawn with the barrel as one outline, see NECK): the throat's ruff of long matted hair hanging plumb and
  // breaking the outline, moss matted into it, the browned garland, eyes opened in the hide
  f.bone('neck');
  { const thr = spline([[1300, 600], [1284, 680], [1256, 756], [1214, 830], [1166, 890], [1116, 940]], 6), Lt = thr.length;
    const pal = [mix(hide, dkTone, 0.72), mix(hide, dkTone, 0.58), mix(dkTone, P.loamB, 0.45), mix(hide, P.rot, 0.55)];
    // the ruff: one matted mass hanging plumb from the throat, its lower edge broken into clumped, pointed locks; dark at
    // the root under the throat, its front edge catching the light; strands follow each lock; a few loose locks in front
    const inner = [], tips = [];
    const NS = 15;
    for (let i = 0; i <= NS; i++) { const t = i / NS, k = Math.round(t * (Lt - 1)), q = thr[k], len = (40 + 110 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.8) * R(f, 0.8, 1.15);
      inner.push(add(q, [-46, -6]));
      if (i < NS) { const k2 = Math.round((t + 0.5 / NS) * (Lt - 1)), q2 = thr[k2]; tips.push([add(q, [6, len * 0.55]), [...add(q2, [R(f, 8, 18), len * R(f, 0.95, 1.1)]), 1]]); } }
    const mass = [...inner, ...tips.slice().reverse().flatMap(([v, tp]) => [tp, v])];
    f.part(mass, { fill: mix(hide, dkTone, 0.42), shadow: dkTone, light: hide, shade: 0.4, maxShade: 16, hi: 0, inkW: 1.4, inkHeavy: 2.6, cast: true, castOp: 0.4, hatch: true, tex: 'mfur' + seed, texOp: 0.5 });
    clipDraw(f, mass, () => {
      softTone(f, E.smooth(mass), [[inner.concat(inner.slice().reverse().map(q => add(q, [30, 50]))), P.loamD, 0.7, 14], [tips.map(([v, tp]) => add(tp, [8, -30])).concat(tips.slice().reverse().map(([v, tp]) => add(tp, [40, -60]))), hideL, 0.35, 12]]);
      for (const [v, tp] of tips) for (let k = 0; k < 7; k++) { const r0 = add(lerp(v, tp, 0) , [R(f, -46, -10), R(f, -90, -40)]), c1 = lerp(r0, tp, 0.5); f.line([r0, add(c1, [R(f, -6, 6), 0]), lerp(tp, v, R(f, 0, 0.3))], R(f, 0.8, 1.8), k % 3 ? mix(dkTone, P.loamD, 0.4) : mix(hide, hideL, 0.4), { op: 0.7 }); }
      stains(f, E.smooth(mass), E.bbox(mass), P.loamB, 0.03, 2.6, -1.4, 37, 0.5);
    });
    for (let i = 0; i < 7; i++) { const k = Math.floor(R(f, 0.15, 0.95) * (Lt - 1)), b0 = add(thr[k], [R(f, -34, -12), R(f, 0, 30)]), len = R(f, 60, 110); X.hairClump(f, [b0, add(b0, [6, len * 0.4]), add(b0, [14, len * 0.75]), add(b0, [10, len])], R(f, 14, 22), { pal: [mix(hide, dkTone, 0.5), mix(hide, dkTone, 0.3), mix(dkTone, P.loamB, 0.4)], sheen: mix(hide, hideL, 0.4), n: 4 }); }
    for (let i = 0; i < 6; i++) { const q = add(thr[Math.floor(R(f, 0.1, 0.9) * Lt)], [R(f, -30, 0), R(f, 20, 70)]); X.moss(f, [q, add(q, [R(f, -10, 10), 24])], 9, { stalks: i % 2 === 0 }); } // moss matted into the ruff
  }
  X.eyes(f, [[[1130, 640], 44, -0.6, 0.5], [[1214, 700], 34, -0.8, 0.05]], EYE);
  for (let i = 0; i < 9; i++) { const t = i / 8, q = add(lerp([1040, 640], [1290, 600], t), [0, Math.sin(t * Math.PI) * 70]); X.bloom(f, q, R(f, 16, 22), [mix(P.pink, P.loamB, 0.35), mix(P.yel, P.loamB, 0.35), mix(P.lilac, P.loamB, 0.35)][i % 3], { n: 6, sy: 0.8 }); } // the garland, browned
  f.line([[1040, 640], [1166, 710], [1290, 600]], 3, P.rotL, { op: 0.8 });

  // ---- the head, raised: one modelled skull, long, ancient, grieving (motherHead: far ear, near ear, jaw, skull)
  const hd = motherHead(f, hF, { hide, hideS, hideL, dark: dkTone, seed, muzzle: mix(P.greyD, P.lilacS, 0.35) });
  f.bone('head');
  // the eye: deep in its orbit, under a heavy swollen lid that has come down over half of it; the tear track runs from the
  // inner corner plumb down the cheek, wet and stained, to a drop at the jaw
  X.eye(f, hd.socket, 46, hA - 0.12, Object.assign({}, EYE, { open: 0.42, iris: P.lilacD, look: [0.12, 0.06] }));
  { const Q = hd.Q, lid = Q([[82, -30], [100, -40], [128, -40], [146, -28], [148, -18], [136, -16], [112, -22], [90, -20], [80, -24]]);
    f.part(lid, { fill: mix(hide, P.pinkD, 0.3), shadow: dkTone, light: hideL, shade: 0.4, maxShade: 6, hi: 0, inkW: 0.8, inkHeavy: 1.6, cast: true, castOp: 0.5, hatch: false, tex: 'mottle' + seed, texOp: 0.4 });
    f.line(Q([[86, -22], [112, -20], [138, -16], [148, -18]]), 2.6, INK, { op: 0.9 }); // the lid's heavy edge
    for (let i = 0; i < 6; i++) { const q = Q([[92 + i * 9, -20 + (i > 3 ? 2 : 0)]])[0]; f.line([q, add(q, rot([1, 7], hA))], 1, INK, { op: 0.8 }); } // lashes, hanging
    f.line(Q([[92, -34], [118, -38], [140, -30]]), 1.6, hideL, { op: 0.6 }); // the swollen lid's lit top
    const c0 = Q([[150, -6]])[0], tr = [c0, add(c0, [-4, 30]), add(c0, [-2, 64]), add(c0, [-8, 98]), add(c0, [-6, 128])];
    f.stroke(tr, 14, mix(hide, P.loamB, 0.55), { op: 0.7 }); // the stained track
    f.stroke(tr, 6, mix(dkTone, P.loamD, 0.4), { op: 0.8 });
    f.line(tr.slice(0, 4).map(q => add(q, [3.5, -1])), 1.2, '#ffffff', { op: 0.55 }); // wet
    const dr = add(tr[4], [0, 8]); f.flat([add(dr, [-4, -6]), add(dr, [0, -12]), add(dr, [4, -6]), add(dr, [3, 2]), add(dr, [-3, 2])], mix(hideL, P.lilacL, 0.3), { op: 0.9 }); f.line([add(dr, [-4, -5]), add(dr, [-3, 1]), add(dr, [3, 2])], 1, INK, { op: 0.7 }); f.flat(ell(add(dr, [1, -4]), 1.4, 1.4, 0, 6), '#ffffff', { op: 0.9 }); // the drop
  }
  X.eyes(f, [[hF([[196, 30]])[0], 22, hA, 0.35], [hF([[40, 40]])[0], 26, hA - 0.2, 0.7], [hF([[214, -34]])[0], 18, hA + 0.1, 0.05]], Object.assign({}, EYE, { iris: P.lilacD }));
  X.mould(f, hF([[10, 64]])[0], 22, 16, { col: P.lilac, op: 0.45 });
  // (ruler pass) the pedicle: a short furred column rising from the skull to the burr, flaring a little at its root; the
  // hide's hair runs up it in short strokes, lit on the side toward the key light, hard shadow on the other
  const pedD = rot([0, 1], hA - 0.4), P0nA = add(P0n, mul(pedD, -30)); // the burr sits up on its pedicle, clear of the skull
  const ped = (P0, tone) => { const d = pedD, nn = [-d[1], d[0]], b = add(P0, mul(d, 88));
    const col = [add(P0, mul(nn, -30)), add(P0, mul(nn, 31)), add(add(P0, mul(d, 44)), mul(nn, 34)), add(b, mul(nn, 46)), add(b, mul(nn, -44)), add(add(P0, mul(d, 44)), mul(nn, -33))];
    const cd = f.part(col, body.LOOK({ fill: mix(hide, hideS, tone + 0.1), maxShade: 10, cast: false, hi: 0, inkW: 0, inkHeavy: 0 }));
    f.line([col[1], col[2], col[3]], 1.8, INK); f.line([col[0], col[5], col[4]], 2.4, INK); // inked down its sides only: its foot runs into the skull
    clipDraw(f, col, () => {
      const lsg = nn[0] * f.L[0] + nn[1] * f.L[1] > 0 ? 1 : -1;
      f.flat([add(P0, mul(nn, -lsg * 34)), add(P0, mul(nn, -lsg * 6)), add(b, mul(nn, -lsg * 8)), add(b, mul(nn, -lsg * 46))].map(q => [...q, 1]), dkTone, { op: 0.55 }); // the shadow side, hard
      for (let i = 0; i < 34; i++) { const u = R(f, -0.95, 0.95), t = R(f, 0.1, 1), q = add(add(P0, mul(d, t * 88)), mul(nn, u * (32 + t * 8))); f.line([q, add(q, add(mul(d, -R(f, 8, 14)), mul(nn, u * 3)))], R(f, 1.2, 2), u * lsg > 0.2 ? hideL : (u * lsg < -0.2 ? mix(dkTone, P.loamD, 0.3) : hideS), { op: 0.75 }); } // the hair running up it
      f.line([add(P0, mul(nn, lsg * 26)), add(b, mul(nn, lsg * 36))], 2, hideL, { op: 0.5 }); });
    f.line([add(b, mul(nn, -44)), add(add(b, mul(d, 6)), mul(nn, 0)), add(b, mul(nn, 44))], 3, dkTone, { op: 0.45 }); }; // the fold where it rises from the skull
  ped(P0nA, 0);
  f.bone('antler_n');
  const an = heavyAntler(f, P0nA, 1.1, 0);
  X.eyes(f, [[add(an.C[an.at(0.3)], [16, 6]), 36, -0.8, 0.6]], EYE);

  // ---- the Tooth, lodged in the fork between the brow tine and the bez tine: a great molar, cusped crown, two roots,
  // a crack through it, moss in its fissures
  const tq = add(an.C[an.at(0.08)], [80, -64]);
  f.joints.tooth.pivot = [+tq[0].toFixed(1), +tq[1].toFixed(1)];
  f.bone('tooth');
  const TF = frame(tq, -0.4, 1.15);
  const tooth = TF([[-34, -40], [-18, -52], [-2, -42], [14, -54], [32, -42], [36, -6], [26, 10], [20, 56], [8, 60], [2, 20], [-6, 20], [-12, 58], [-26, 56], [-30, 8], [-38, -6]]);
  f.part(tooth, { fill: P.boneL, shadow: P.boneS, light: '#ffffff', shade: 0.42, inkW: 2, inkHeavy: 3.2, cast: true, castOp: 0.45, hatch: true, maxShade: 14, tex: 'mottle' + seed, texOp: 0.35 });
  f.line(TF([[-30, -20], [0, -26], [30, -20]]), 1.4, P.boneD, { op: 0.6 });
  f.line(TF([[-4, -44], [2, -10], [-4, 18]]), 2, INK, { op: 0.8 });
  X.moss(f, TF([[-26, -42], [-6, -40], [16, -44]]), 6, { stalks: false });
  return f;
}

module.exports = {
  heroes: [
    { key: 'antlered_mother', name: 'The Antlered Mother', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: antleredMother },
    { key: 'the_gardener', name: 'The Gardener', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: gardener },
    { key: 'fungal_husk', name: 'Fungal Husk', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: fungalHusk },
    { key: 'thorn_knight', name: 'Thorn Knight', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: thornKnight },
    { key: 'spore_deer', name: 'Spore Deer', tier: 'large', w: 1100, h: TIERS.large[1], flip: true, build: sporeDeer },
    { key: 'moth_witch', name: 'Moth Witch', tier: 'human', w: 900, h: TIERS.human[1], flip: true, build: mothWitch },
    { key: 'root_horror', name: 'Root Horror', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: rootHorror },
    { key: 'blight_dryad', name: 'Blight Dryad', tier: 'elite', w: 1100, h: 1500, flip: true, build: blightDryad },
  ],
};
