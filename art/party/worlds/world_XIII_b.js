// World XIII, The Black Pyre (Fire + Void, Hollow Flame), second batch: the eleven later entries of the bible file.
// Matches the first batch (world_XIII.js, reviewed): its kit (kit_XIII through kit_XIII_b), its palette (black flame
// with violet edges, ash grey, char; plus ink black, bone and grey; red only for doom and rubric; gold only on holy
// things), its black flame (joined, curling tongues, never rows of triangles), its fire marks (skin, wood and iron split
// into violet-lipped seams, charred lips, ash curling up, hems burnt into curled tongues) and void marks (clean round
// holes with clean rims; eyes only where the bible entry calls for them).
// Foes face left: every figure is drawn facing right with kit.foeBase (through kit_XIII.base) and flipped.
// Built for the rig: joints first, f.bone() before every part, parts drawn whole, overlaps at the joints.
// Seeds 1320 + index in the bible order: Iron Bull 1320, Confessor 1321, Questioner 1322, Bellows Sister 1323,
// Recanter 1324, Belfry Bats 1325, Familiar 1326, Faggot-Bearer 1327, Scold 1328, Ash Pardoner 1329, Destrier 1330.
'use strict';
const K = require('../kit');
const X = require('./kit_XIII_b');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P, split, side, elb, ang, R, splitDraw } = X;
const SACK = (seed, o = {}) => Object.assign({ fill: P.sack, shadow: '#24211d', light: P.sackL, shade: 0.38, tex: 'weave' + seed, texOp: 0.6 }, o);

// ------------------------------------------------------------------ RECANTER (cast, human 1.0; 1.3 to the hat's tip)
// A heretic who recanted and was spared the fire, sentenced to wear the penitent's coat and carry the candle until he
// dies; he has not died. Shuffling, stooped from the upper back, the shaven head bowed under a tall pasteboard cone hat
// painted with flames; a fat black candle held before him in both hands, burning black, his downcast eyes on its flame.
// Weight on the back foot, the front foot barely touching, as if afraid to arrive. A sackcloth tabard (the sanbenito)
// over a ragged grey shift: a red saltire (doom) on its front and black flames painted pointing down (the mark of the
// spared), its hem charred into curled tongues; a rope noose round the neck, its tail hanging; a placard of his sentence
// on a cord at the hip; a wooden rosary wound round the near wrist; knees scabbed from kneeling. Fire: skin charred in
// patches where the candle has dripped, the knuckles split into violet-lipped seams. Void: where the black wax lands it
// leaves clean round holes in the flesh, rimmed like a punch (back of the near hand, the near forearm, the near foot).
// Rig: standard humanoid + candle (parent hand_n; both hands hold it: the far hand needs IK onto it) + hat (head) +
// skirt (tabard below the girdle, pelvis) + noose_tail (torso) + placard (pelvis).
// Motion: idle a shuffle forward and back, the candle dripping; attack tipping the candle (black wax onto a hero).
function recanter() {
  const CW = 600, CH = 1000, seed = 1324;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 94, gy = f.o.groundY; // 970
  const skin = '#8a807a', skinS = '#30262c', skinL = '#b2a8a0';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const SHF = (o = {}) => Object.assign({ fill: '#6e6a66', shadow: '#22201f', light: '#9a948c', shade: 0.38, tex: 'weave' + seed, texOp: 0.5 }, o);
  const SK = (o = {}) => SACK(seed, Object.assign({ fill: '#8a8478', light: '#b0a998' }, o));
  const N = [312, 458], C = [254, 520], Pv = [262, 650];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.12, 0.1), SF = S.at(0.36, 0.06);
  const HC = [358, 414], hA = 0.3, neck0 = S.at(0.16, -0.06);
  const cBot = [432, 580], cTop = [428, 480];                      // the candle, upright, its flame below his eyes
  const WN = [430, 556], EN = [340, 598];                          // near hand low on the candle, elbow at the side
  const WF = [430, 514], EF = [364, 566];                          // far hand above it, behind the candle
  const HN = S.at(0.12, 1.0), KN = [318, 806], AN = [338, 930];    // near leg forward, light on its toes
  const HF = S.at(-0.22, 1.0), KF = [238, 808], AF = [218, 932];   // far leg back, straight, carrying the weight
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('candle', WN, 'hand_n').joint('hat', add(HC, [-4, -40]), 'head').joint('skirt', S.at(0, 0.84), 'pelvis').joint('noose_tail', S.at(0.3, 0.06), 'torso').joint('placard', S.at(-0.3, 0.86), 'pelvis');
  const hz = frame(HC, hA, H);

  // ---- far arm: shift sleeve to the elbow, a bare forearm, the hand round the candle above the near hand
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 32, 26, SKP({ fill: mix(skin, '#000', 0.2) }), '_f', { vein: false });
  f.bone('upperarm_f'); f.part(K.ragLimb(f, lerp(SF, EF, -0.1), lerp(SF, EF, 0.82), 42, 38, { depth: 7, teeth: 4 }), SHF({ fill: mix('#6e6a66', '#000', 0.2), maxShade: 9 }));
  f.bone('forearm_f'); X.soot(f, lp(EF, WF, 0.5, 4), 10, 6, 0.6, ang(EF, WF));

  // ---- far leg: bare, straight, the weight on it
  X.bareLegRig(f, HF, KF, AF, 40, 54, 38, SKP({ fill: mix(skin, '#000', 0.2) }), '_f', { swell: 0.05, nail: P.ashD, after: () => { X.ashCake(f, lerp(KF, AF, 0.7), 10, 30, 3, 0.8); } });
  f.bone('shin_f'); for (const [t, o2] of [[0.05, 4]]) { const q = lp(KF, AF, t, o2); f.flat(ell(q, 7, 5, 0.3, 8), P.rawD, { op: 0.8 }); } // a knee scab

  // ---- torso under the shift (whole)
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.28, 0.3], [0.08, 0.44, 0.38], [0.25, 0.48, 0.44], [0.45, 0.42, 0.4], [0.65, 0.38, 0.36], [0.85, 0.42, 0.4], [1.04, 0.44, 0.42]]);
  f.part(torso, SHF({ maxShade: 18 }));

  // ---- near leg: forward, the knee soft, the toes just touching (the heel lifted)
  X.bareLegRig(f, HN, KN, AN, 42, 56, 40, SKP(), '_n', { swell: 0.05, nail: P.ashD, after: () => {
    X.ashCake(f, lerp(KN, AN, 0.75), 10, 26, 3, 0.8);
    X.soot(f, lp(KN, AN, 0.55, -6), 9, 18, 0.6, ang(KN, AN)); // a charred patch where the wax ran
  } });
  f.bone('shin_n');
  for (const [t, o2, r] of [[0.04, 6, 8], [0.1, -6, 6]]) { const q = lp(KN, AN, t, o2); f.flat(ell(q, r, r * 0.75, 0.3, 8), P.rawD, { op: 0.85 }); f.flat(ell(add(q, [-1, -1]), r * 0.55, r * 0.4, 0.3, 8), P.raw, { op: 0.75 }); } // knees scabbed
  f.bone('foot_n'); X.voidDisk(f, [AN[0] + 30, gy - 22], 4.2, 3.4, 0.2); // a wax hole through the instep

  // ---- the shift below the tabard, ragged at mid-thigh (skirt)
  f.bone('skirt');
  const shHem = X.charHem(f, [206, 744], [356, 734], 8, 14, [0, 1]);
  const shSk = [S.at(-0.5, 0.82), S.at(0.5, 0.82), [352, 700], ...shHem.slice().reverse(), [210, 700]];
  f.part(shSk, SHF({ maxShade: 18 }));
  X.charEdge(f, shHem, 4, { gap: 6 });

  // ---- the tabard: front and back panels over the shoulders, belted, falling to the knee; a red saltire and black
  // flames painted pointing down; the hem charred into curled tongues; the side open so the shift shows
  f.bone('torso');
  const tbTop = S.shape([[-0.08, 0.3, 0.32], [0.1, 0.48, 0.42], [0.3, 0.5, 0.48], [0.55, 0.46, 0.46], [0.8, 0.48, 0.5], [0.86, 0.5, 0.52]]);
  f.part(tbTop, SK({ maxShade: 22 }));
  X.clipDraw(f, E.smooth(tbTop), () => {
    X.softTone(f, E.smooth(tbTop), [[[S.at(-0.6, 0.1), S.at(-0.2, 0.1), S.at(-0.2, 0.9), S.at(-0.6, 0.9)], '#000', 0.3, 8]]);
    X.folds(f, [S.at(0.1, 0.2), S.at(0.3, 0.3), S.at(-0.3, 0.2), S.at(-0.1, 0.1), S.at(-0.4, 0.4)], 90, 2.4, '#2a2620', P.sackL);
    X.crease(f, [S.at(-0.5, 0.55), S.at(-0.2, 0.62), S.at(0.2, 0.6)], 2.2, { col: '#2a2620', lit: P.sackL }); // the drag of the girdle
    f.part([S.at(-0.36, 0.3), S.at(-0.12, 0.28), S.at(-0.1, 0.46), S.at(-0.34, 0.48)].map(q => [...q, 1]), SK({ fill: '#6e685c', inkW: 1.1, cast: false, maxShade: 4 })); f.stitches([S.at(-0.36, 0.3), S.at(-0.12, 0.28), S.at(-0.1, 0.46), S.at(-0.34, 0.48), S.at(-0.36, 0.3)], P.sackL, 0.8); // a patch
    X.ashCake(f, S.at(-0.3, 0.2), 30, 20, 5, 0.9);
    X.stains(f, E.smooth(tbTop), E.bbox(tbTop), P.charS, 0.035, 2.4, -1.3, 13, 0.45);
  });
  f.bone('skirt');
  const tbHem = X.charHem(f, [218, 790], [392, 776], 9, 18, [0, 1]);
  const tbSk = [S.at(-0.6, 0.8), S.at(0.62, 0.8), [372, 700], [386, 744], ...tbHem.slice().reverse(), [222, 750], [226, 700]];
  X.cutHoles(f, [], () => f.part(tbSk, SK({ maxShade: 24 })));
  X.clipDraw(f, E.smooth(tbSk), () => {
    X.softTone(f, E.smooth(tbSk), [[[[214, 640], [244, 640], [236, 800], [210, 800]], '#000', 0.35, 9], [[[340, 650], [366, 650], [380, 790], [352, 790]], '#fff', 0.12, 8]]);
    // the red saltire (doom), brushed on, cracked and flaking, crossing at the belly
    const sx = [[246, 668], [380, 772]], sy = [[366, 666], [244, 780]];
    for (const [a, b] of [sx, sy]) { f.stroke([a, lerp(a, b, 0.5), b], 26, P.rubric, { op: 0.88 }); f.line([lerp(a, b, 0.05), lerp(a, b, 0.95)].map(q => add(q, [0, -6])), 1.2, '#c05a48', { op: 0.4 }); for (let i = 0; i < 6; i++) f.flat(ell(lerp(a, b, R(f, 0.1, 0.9)), R(f, 2, 5), R(f, 1.5, 3), 0.5, 7), P.sack, { op: 0.8 }); }
    // black flames painted pointing down, toward the hem (the spared): one joined band of tongues
    X.paintedFlames(f, [[226, 722], [300, 718], [376, 712]], 7, 50, 18, [0, 1], { ground: '#8a8478', band: 0.1 });
    X.folds(f, [[250, 680], [292, 684], [336, 680], [362, 690]], 100, 2.6, '#2a2620', P.sackL);
    X.stains(f, E.smooth(tbSk), [200, 640, 400, 800], P.charS, 0.03, 2.8, -1.4, 19, 0.7);
    X.burnHole(f, [356, 740], 6, 0.4);
  });
  X.charEdge(f, tbHem, 6, { gap: 6 });
  // rope girdle
  f.bone('pelvis');
  X.rope(f, [S.at(-0.62, 0.8), S.at(0.0, 0.83), S.at(0.62, 0.8)], 6, P.sackL);
  const kn = S.at(-0.3, 0.83); f.part(ell(kn, 7, 6, 0, 8), { fill: P.sackL, shadow: '#3a3630', shade: 0.4, inkW: 1, cast: false });
  // the placard on a cord from the girdle: his sentence in rubric
  f.bone('placard');
  const pc = add(kn, [-26, 62]);
  X.rope(f, [kn, add(kn, [14, 20]), add(pc, [-12, -20])], 2.2, '#4a4038', { lit: false }); X.rope(f, [kn, add(kn, [22, 14]), add(pc, [12, -22])], 2.2, '#4a4038', { lit: false });
  X.placard(f, pc, 52, 40, -0.12);

  // ---- noose: round the neck, the knot under the near jaw, its tail hanging down the chest behind the arms
  f.bone('noose_tail');
  const nk = S.at(0.32, 0.04);
  X.rope(f, [nk, add(nk, [6, 40]), add(nk, [2, 90]), add(nk, [10, 150]), add(nk, [4, 196])], 7, '#6a6050', { fray: true });

  // ---- head: shaven, gaunt, bowed; eyes downcast on the flame, lips moving
  f.bone('head');
  f.part(limb(neck0, add(HC, [-16, 26]), 34, 28, { p: [[0.5, -0.08, 0.3]] }), SKP({ maxShade: 6 }));
  X.crease(f, [add(neck0, [8, -6]), add(neck0, [20, -26]), add(HC, [6, 34])], 1.6, { op: 0.5, lit: skinL }); // the neck's tendon
  const hd = B.head(f, HC, H, hA, { skin, jaw: 0.96, chin: 0.0, nose: 1.08, hook: 0.2, mouth: 'set', squint: 0.78, browDown: -0.03, age: true, gaunt: true, faceShade: 0.8, faceHatch: false, jawShade: 0.5, hairCol: '#2a2426', browCol: '#3a3234', browW: 0.03 });
  X.greyFace(f, hd, skin, 1.08);
  f.flat(hd([[0.06, -0.058], [0.11, -0.068], [0.17, -0.062], [0.165, -0.05], [0.11, -0.052]]), mix(skin, '#000', 0.3), { op: 0.9 }); // the lowered lid
  f.flat(hd(ell([0.25, 0.3], 0.04, 0.018, 0, 8)), '#1a0e0e', { op: 0.85 }); // lips parted on the words
  f.flat(hd([[-0.36, -0.2], [-0.22, -0.44], [0.1, -0.5], [0.26, -0.36], [0.1, -0.4], [-0.2, -0.36], [-0.34, -0.12]]), '#2a2426', { op: 0.35 }); // shaven stubble
  X.soot(f, hd([[0.02, 0.2]])[0], 10, 7, 0.45, hA); // a dripped char patch on the cheek
  X.hairline(f, hd([[-0.06, 0.12], [0.0, 0.2], [-0.03, 0.3]]), 1);
  // the noose round the neck (front of the neck, under the jaw)
  f.bone('torso');
  X.rope(f, [add(neck0, [-22, -12]), add(neck0, [0, 6]), add(neck0, [24, 0]), nk], 7, '#6a6050');
  for (let i = 0; i < 4; i++) f.line([add(nk, [-7, -8 + i * 6]), add(nk, [7, -6 + i * 6])], 2, '#3a3428');
  f.part(ell(add(nk, [0, 6]), 8, 16, 0.15, 12), { fill: '#6a6050', shadow: '#2a241c', shade: 0.4, inkW: 1.1, cast: false }); for (let i = 0; i < 5; i++) f.line([add(nk, [-7, -6 + i * 6]), add(nk, [1, -4 + i * 6]), add(nk, [8, -6 + i * 6])], 1.6, '#2a241c', { op: 0.8 }); // the hangman's coil

  // ---- the cone hat: pasteboard, crushed a little and bent at the tip, painted with flames pointing down, scorched
  f.bone('hat');
  const hat = hz([[-0.44, -0.24], [-0.36, -0.6], [-0.22, -1.2], [-0.08, -1.8], [0.02, -2.3], [0.14, -2.62, 1], [0.12, -2.38], [0.1, -1.8], [0.2, -1.2], [0.3, -0.62], [0.36, -0.36], [0.06, -0.3], [-0.2, -0.26]]);
  f.part(hat, { fill: '#8e887e', shadow: '#2a2624', light: '#bab4a8', shade: 0.38, tex: 'weave' + seed, texOp: 0.35, maxShade: 30 });
  X.clipDraw(f, E.smooth(hat), () => {
    X.softTone(f, E.smooth(hat), [[hz([[-0.5, -0.2], [-0.2, -2.4], [0.0, -2.4], [-0.2, -0.2]]), '#000', 0.4, 8]]);
    // flames painted rising from a band round the hat's foot (the coroza's flames), joined, of mixed sizes
    X.paintedFlames(f, hz([[-0.4, -0.36], [-0.06, -0.4], [0.3, -0.46]]), 6, 0.72 * H, 0.2 * H, rot([0, -1], hA), { ground: '#8e887e', rise: 0.2 });
    X.paintedFlames(f, hz([[-0.16, -1.4], [0.04, -1.42], [0.16, -1.44]]), 3, 0.42 * H, 0.14 * H, rot([0, -1], hA), { ground: '#8e887e', rise: 0.2 });
    X.crease(f, hz([[0.24, -0.6], [0.14, -1.2], [0.08, -1.9]]), 1.6, { col: '#1e1c18', lit: '#c8c2b6' }); // the glued seam
    X.crease(f, hz([[-0.1, -1.7], [0.06, -1.82], [0.12, -1.9]]), 1.6, { col: '#1e1c18', lit: '#c8c2b6' }); // a crushed dent
    X.stains(f, E.smooth(hat), E.bbox(hat).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 2.6, -1.4, 41, 0.6);
    X.burnHole(f, hz([[0.16, -0.8]])[0], 5, hA);
  });
  // the hat's lower rim sits on the skull, its edge lit, pressing the brow
  f.line(hz([[-0.44, -0.24], [-0.2, -0.26], [0.06, -0.3], [0.36, -0.36]]), 3.4, INK);
  f.line(hz([[-0.4, -0.28], [0.06, -0.34], [0.32, -0.4]]), 1.6, '#cec8ba', { op: 0.6 });
  X.charEdge(f, hz([[0.1, -1.6], [0.12, -2.0], [0.14, -2.5]]), 3, { gap: 5 });

  // ---- the candle: fat black wax, burning black, held upright before him
  f.bone('candle');
  const wick = X.candle(f, cBot, cTop, 25, { runs: 6 });
  X.blackFlame(f, wick, 96, 30, { lean: -0.08, edgeW: 2 });
  // wax dripping off the hand to the floor in two black beads
  f.flat(ell(add(cBot, [6, 24]), 3, 4.5, 0, 8), '#0c0a0e'); f.flat(ell(add(cBot, [3, 50]), 2.4, 3.6, 0, 8), '#0c0a0e');

  // far hand on the candle above the near one (behind the wax, the fingers wrapping round the front)
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, -Math.PI / 2, 25, mix(skin, '#000', 0.15), { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'recanter far' });
  X.fistDetail(f, gF, 25, skin, { nail: '#4a4044' });
  X.seam(f, gF.F([[0.3, -0.5], [0.36, 0.0], [0.32, 0.5]]), 1.2); // knuckles split

  // ---- near arm: shift sleeve to the elbow, the forearm charred where the wax ran, a wax hole through it
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 34, 27, SKP(), '_n', { vein: false });
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, lerp(SN, EN, -0.14), lerp(SN, EN, 0.8), 46, 40, { depth: 7, teeth: 4 }), SHF({ maxShade: 9 }));
  X.crease(f, [lp(SN, EN, 0.1, 10), lp(SN, EN, 0.4, 14), lp(SN, EN, 0.7, 8)], 2, { col: '#22201f', lit: '#9a948c' });
  f.bone('forearm_n');
  X.soot(f, lp(EN, WN, 0.55, -4), 14, 7, 0.7, ang(EN, WN)); X.flakes(f, lp(EN, WN, 0.55, -4), 12, 5, 3, 0.6);
  X.voidDisk(f, lp(EN, WN, 0.4, 5), 4.4, 4, 0);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, -Math.PI / 2, 26, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'recanter near' });
  X.fistDetail(f, gN, 26, skin, { nail: '#4a4044' });
  X.seam(f, gN.F([[0.3, -0.5], [0.38, -0.1], [0.34, 0.4]]), 1.3);
  X.voidDisk(f, gN.F([[-0.2, 0.1]])[0], 3.6, 3.2, 0);
  f.stroke([add(WN, [-2, -16]), add(WN, [6, -2]), add(WN, [4, 12])], 6, '#0c0a0e'); // black wax run over the knuckles
  // the wooden rosary wound round the near wrist, a loop hanging plumb with a small cross
  const rw = lp(EN, WN, 0.86, 0), beads = [];
  for (let i = 0; i < 7; i++) beads.push(add(rw, [-6 + Math.sin(i * 0.9) * 8, 14 + i * 8]));
  f.line(beads, 1.1, '#2a2020');
  for (let k = -2; k <= 2; k++) f.part(ell(add(rw, [k * 5, k * 2 - 2]), 4, 4.2, 0, 8), { fill: '#5a4a3a', shadow: '#1a120c', shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false });
  beads.forEach(q => f.part(ell(q, 3.8, 3.6, 0, 8), { fill: '#5a4a3a', shadow: '#1a120c', shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }));
  { const cr = add(beads[6], [0, 6]); f.part([[-2, 0], [2, 0], [2, 4], [6, 4], [6, 7], [2, 7], [2, 16], [-2, 16], [-2, 7], [-6, 7], [-6, 4], [-2, 4]].map(q => [...add(cr, q), 1]), { fill: '#5a4a3a', shadow: '#1a120c', shade: 0.3, inkW: 0.9, cast: false }); }

  f.bone('root');
  X.ashprint(f, [AF[0] + 28, gy + 4], 1.2);
  f.flat(ell([cBot[0] + 4, gy + 2], 7, 2.2, 0, 8), '#0c0a0e', { op: 0.9 }); // the wax spattered on the floor
  return f;
}

// ------------------------------------------------------------------ THE SCOLD (cast, human 1.0)
// A lay brother who cried out in the nave that the saint was innocent, sentenced to the shame mask and the neck-fiddle
// and to walk the cathedral before every pyre. Shuffling forward, stooped from the upper back, weight on the front foot
// as if still being led. The head inside a sheet-iron shame mask: a mocking face with a long hooked snout, tall tin ears,
// spectacles beaten into the brow, a slot mouth barred with lip-bars, hinged at the jaw and padlocked at the nape over
// the scorched tonsure; behind its eye holes his own eyes, red-rimmed and wide (the bible calls for them). The neck and
// both wrists locked in a black oak fiddle board held out level at chin height, iron-banded and padlocked at its end, the
// charred hands sticking up through its holes, clenched with the strain. Fire: hands and forearms charred and split into
// violet-lipped seams, ash curling off the knuckles; the iron tongue-plate burnt into his mouth, black flame leaking
// between the lip-bars. Void: a clean round hole through the near shoulder. Gear: a bell on the snout's tip, a placard
// of his offence nailed to the board in rubric, a sackcloth shift scorched at the hem, a rope girdle, a wooden rosary
// tangled round one wrist hole, bare blistered feet, ash caked in the board's holes.
// Rig: standard humanoid + fiddle (parent head: the board is locked on the neck) + bell (head) + skirt (pelvis).
// The wrists are locked in the board: the forearms must follow the fiddle (IK the hands to the holes).
// Motion: idle a muffled straining at the gag, the bell tinkling; attack a choked cry, black flame from the mouth slot.
function scold() {
  const CW = 700, CH = 820, seed = 1328;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 94, gy = f.o.groundY; // 790
  const skin = '#9a8682', skinS = '#3a2a2e', skinL = '#c4b2aa';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const CHR = (o = {}) => Object.assign({ fill: '#4a4042', shadow: '#120e10', light: '#7a6e6e', shade: 0.38, tex: 'craze' + seed, texOp: 0.55 }, o);
  const SK = (o = {}) => SACK(seed, o);
  const OAK = (o = {}) => Object.assign({ fill: '#2e2624', shadow: '#0c0909', light: '#5a4c48', shade: 0.38, tex: 'grain' + seed, texOp: 0.6 }, o);
  const N = [318, 326], C = [248, 372], Pv = [246, 492];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.1, 0.12), SF = S.at(0.4, 0.06);
  const HC = [366, 246], hA = 0.18, neck0 = S.at(0.14, -0.04);
  const bY = 300, bT = 24, bX0 = 286, bX1 = 504;                   // the fiddle: top edge, thickness, back and front ends
  const WN = [440, 302], EN = [388, 394];                          // near wrist locked in its hole, elbow below and behind
  const WF = [464, 298], EF = [410, 384];
  const HN = S.at(0.2, 1.0), KN = [330, 636], AN = [326, 752];     // near leg forward, straight under the weight
  const HF = S.at(-0.24, 1.0), KF = [214, 640], AF = [168, 750];   // far leg trailing, the heel up
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('fiddle', add(neck0, [10, -20]), 'head').joint('bell', [0, 0], 'head').joint('skirt', S.at(0, 0.84), 'pelvis');
  const hz = frame(HC, hA, H);
  const snTip = hz([[1.22, 0.26]])[0];
  f.joints.bell.pivot = [Math.round(snTip[0]), Math.round(snTip[1])];

  // ---- far arm: bare, the forearm rising to its hole in the board, charred
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.94), 30, 24, SKP({ fill: mix(skin, '#000', 0.22) }), '_f', { vein: false });
  f.bone('forearm_f');
  X.clipDraw(f, E.smooth(limb(EF, WF, 34, 26)), () => { X.stains(f, E.smooth(limb(EF, WF, 34, 26)), E.bbox([EF, WF]).map((v, i) => v + (i < 2 ? -30 : 30)), P.charS, 0.04, 3, -1.2, 5, 0.9); });
  X.seam(f, [lp(EF, WF, 0.3, 3), lp(EF, WF, 0.6, -2), lp(EF, WF, 0.85, 2)], 1.6);
  // ---- far leg, trailing
  X.bareLegRig(f, HF, KF, AF, 40, 54, 38, SKP({ fill: mix(skin, '#000', 0.22) }), '_f', { swell: 0.1, nail: P.ashD, after: () => X.ashCake(f, lerp(KF, AF, 0.7), 10, 30, 3, 0.8) });
  // ---- torso (whole), the shift over it
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.28, 0.3], [0.1, 0.44, 0.4], [0.28, 0.46, 0.44], [0.48, 0.4, 0.4], [0.68, 0.36, 0.36], [0.88, 0.42, 0.42], [1.04, 0.46, 0.44]]);
  f.part(torso, SK({ maxShade: 20 }));
  X.clipDraw(f, E.smooth(torso), () => {
    X.softTone(f, E.smooth(torso), [[[S.at(-0.6, 0.1), S.at(-0.2, 0.1), S.at(-0.2, 1), S.at(-0.6, 1)], '#000', 0.28, 8]]);
    X.folds(f, [S.at(0.2, 0.3), S.at(0.0, 0.25), S.at(-0.25, 0.3), S.at(0.3, 0.5), S.at(-0.1, 0.5), S.at(-0.35, 0.55)], 70, 2.4, '#24211d', P.sackL);
    f.part([S.at(-0.3, 0.6), S.at(-0.05, 0.58), S.at(-0.04, 0.74), S.at(-0.3, 0.76)].map(q => [...q, 1]), SK({ fill: '#5a5850', inkW: 1.1, cast: false, maxShade: 4 })); f.stitches([S.at(-0.3, 0.6), S.at(-0.05, 0.58), S.at(-0.04, 0.74), S.at(-0.3, 0.76), S.at(-0.3, 0.6)], P.sackL, 0.8);
    X.burnHole(f, S.at(0.2, 0.7), 6, 0.3);
    X.crease(f, [S.at(-0.4, 0.2), S.at(-0.1, 0.12), S.at(0.3, 0.16)], 2.2, { col: '#24211d', lit: P.sackL }); // the shift dragged by the board's weight
    X.stains(f, E.smooth(torso), E.bbox(torso), P.charS, 0.035, 2.4, -1.3, 13, 0.5);
    X.ashCake(f, S.at(0.1, 0.2), 30, 20, 6, 0.9);
  });
  // ---- near leg: forward, straight, carrying him; the foot blistered
  X.bareLegRig(f, HN, KN, AN, 42, 56, 40, SKP(), '_n', { swell: 0.1, nail: P.ashD, after: () => { X.ashCake(f, lerp(KN, AN, 0.75), 10, 26, 3, 0.8); } });
  f.bone('foot_n');
  for (const [u, r] of [[18, 5], [40, 4], [-6, 4.5]]) { const q = [AN[0] + u, gy - 14 - (u > 30 ? 4 : 0)]; f.part(ell(q, r, r * 0.8, 0, 8), SKP({ fill: '#b8aca2', inkW: 0.9, inkHeavy: 1, cast: false, hatch: false, maxShade: 2 })); f.flat(ell(add(q, [1, -1]), r * 0.4, r * 0.3, 0, 6), '#e8e0d4', { op: 0.6 }); } // blisters from the nave floor
  // ---- the shift below the girdle, scorched at the hem
  f.bone('skirt');
  const hem = X.charHem(f, [178, 588], [372, 586], 9, 16, [0, 1]);
  const sk = [S.at(-0.6, 0.82), S.at(0.56, 0.82), [362, 548], ...hem.slice().reverse(), [184, 546]];
  f.part(sk, SK({ maxShade: 22 }));
  X.clipDraw(f, E.smooth(sk), () => { X.softTone(f, E.smooth(sk), [[[[176, 500], [214, 500], [204, 600], [172, 600]], '#000', 0.35, 9]]); X.folds(f, [[220, 500], [262, 506], [306, 504], [344, 500]], 90, 2.6, '#24211d', P.sackL); X.stains(f, E.smooth(sk), [160, 460, 400, 620], P.charS, 0.03, 2.8, -1.3, 23, 0.85); });
  X.charEdge(f, hem, 6, { gap: 6 });
  f.bone('pelvis');
  X.rope(f, [S.at(-0.62, 0.8), S.at(0.0, 0.83), S.at(0.6, 0.8)], 6, P.sackL);
  { const kn = S.at(0.42, 0.83); X.rope(f, [kn, add(kn, [4, 30]), add(kn, [-2, 66])], 5, P.sackL, { fray: true }); f.part(ell(kn, 7, 6, 0, 8), { fill: P.sackL, shadow: '#3a3630', shade: 0.4, inkW: 1, cast: false }); }

  // ---- head: the neck and the back of the scorched tonsured skull under the mask's strap
  f.bone('head');
  f.part(limb(neck0, add(HC, [-14, 30]), 34, 30, { p: [[0.5, -0.08, 0.3]] }), SKP({ maxShade: 6 }));
  const skull = hz([[-0.5, -0.1], [-0.44, -0.38], [-0.2, -0.54], [0.1, -0.52], [0.1, 0.4], [-0.2, 0.42], [-0.42, 0.24]]);
  f.part(skull, SKP({ fill: mix(skin, '#000', 0.12), maxShade: 12 }));
  X.clipDraw(f, E.smooth(skull), () => { for (let i = 0; i < 26; i++) { const q = hz([[R(f, -0.48, 0.0), R(f, -0.5, -0.1)]])[0]; f.line([q, add(q, [R(f, -2, 2), -3])], 1.1, '#2a2224', { op: 0.7 }); } X.soot(f, hz([[-0.2, -0.36]])[0], 20, 10, 0.55, hA); X.hairline(f, hz([[-0.36, -0.3], [-0.26, -0.2], [-0.3, -0.06]]), 1); });
  B.head(f, HC, H, hA, { skin, jaw: 1.0, mouth: 'set', faceShade: 0.8, faceHatch: false, noEar: true, hairCol: '#2a2224' }); // the face under the mask (shows when the jaw swings)
  // the mask: hammered sheet iron in a mocking face; drawn after so it covers the face
  const IR = (o = {}) => X.IRON(f, Object.assign({ fill: '#56545c', light: '#9a96a2', shade: 0.42, maxShade: 14 }, o));
  // tin ears: long, flared, one bent back; riveted to the mask's sides
  for (const [b0, tip, w, dim] of [[[0.0, -0.36], [-0.3, -1.14], 0.42, 0.25], [[-0.16, -0.3], [-0.98, -0.66], 0.46, 0]]) {
    const a = hz([b0])[0], t = hz([tip])[0], d = E.norm(sub(t, a)), n = [-d[1], d[0]], L = E.len(sub(t, a)), W = w * H;
    const ear = [add(a, mul(n, W * 0.3)), add(add(a, mul(d, L * 0.45)), mul(n, W * 0.55)), add(add(a, mul(d, L * 0.85)), mul(n, W * 0.3)), [...t, 1], add(add(a, mul(d, L * 0.8)), mul(n, -W * 0.32)), add(add(a, mul(d, L * 0.4)), mul(n, -W * 0.45)), add(a, mul(n, -W * 0.3))];
    f.part(ear, IR({ fill: mix('#6a6670', '#000', dim), light: '#a8a4ae', maxShade: 8 }));
    f.flat([add(add(a, mul(d, L * 0.15)), mul(n, W * 0.05)), add(add(a, mul(d, L * 0.5)), mul(n, W * 0.28)), add(add(a, mul(d, L * 0.82)), mul(n, W * 0.08)), add(add(a, mul(d, L * 0.45)), mul(n, -W * 0.15))], '#141216', { op: 0.75 }); // the hollow of the ear
    f.line([add(add(a, mul(d, L * 0.3)), mul(n, W * 0.4)), add(add(a, mul(d, L * 0.7)), mul(n, W * 0.32))], 1.4, '#c4c0ca', { op: 0.55 });
    f.rivet(add(a, mul(d, 6)), 2.8, P.ironL);
    X.charEdge(f, [add(add(a, mul(d, L * 0.6)), mul(n, -W * 0.38)), add(add(a, mul(d, L * 0.82)), mul(n, -W * 0.3)), t], 2.4, { gap: 5, s: 0.5 });
  }
  const mask = hz([[-0.1, -0.5], [0.12, -0.56], [0.3, -0.44], [0.4, -0.24], [0.44, -0.06], [0.44, 0.22], [0.4, 0.42], [0.22, 0.56], [0.0, 0.56], [-0.14, 0.44], [-0.16, 0.1], [-0.16, -0.24]]);
  f.part(mask, IR({ maxShade: 16 }));
  X.clipDraw(f, E.smooth(mask), () => {
    X.softTone(f, E.smooth(mask), [[hz([[-0.2, -0.5], [0.04, -0.5], [0.04, 0.6], [-0.2, 0.6]]), '#000', 0.4, 6], [hz([[0.3, -0.4], [0.46, -0.2], [0.46, 0.2], [0.34, 0.1]]), '#c8c4d0', 0.25, 4]]);
    for (let i = 0; i < 14; i++) { const q = hz([[R(f, -0.1, 0.4), R(f, -0.45, 0.5)]])[0]; f.flat(ell(q, R(f, 3, 6), R(f, 2, 4), f.r() * 3, 8), f.r() < 0.5 ? '#2a282e' : '#6a6670', { op: 0.5 }); } // hammer dents
    X.heatBloom(f, hz([[0.3, 0.3]])[0], 26, 18);
    X.stains(f, E.smooth(mask), E.bbox(mask).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.05, 2.6, -1.3, 37, 0.6);
    // the jaw's hinge line, separating the hinged lower plate
    f.line(hz([[-0.14, 0.22], [0.1, 0.24], [0.44, 0.2]]), 2.4, '#0a090b');
    f.line(hz([[-0.12, 0.25], [0.1, 0.27], [0.42, 0.23]]), 1, '#a8a4ae', { op: 0.5 });
  });
  // spectacles beaten into the brow: two raised rings, a bridge; the eye holes behind them showing his own eyes
  for (const [c, r, sq] of [[[0.14, -0.16], 0.1, 1], [[0.36, -0.15], 0.07, 0.6]]) {
    const e = hz(ell(c, r * sq, r, 0, 16));
    f.flat(hz(ell([c[0] - 0.01, c[1] + 0.01], r * 0.7 * sq, r * 0.52, 0.1, 12)), '#070506');
    if (sq === 1) { const ec = hz([[c[0] + 0.01, c[1] + 0.01]])[0]; f.flat(ell(ec, 6.4, 4.2, hA, 10), '#cfc4b6'); f.flat(ell(add(ec, [1.4, 0.4]), 2.6, 2.6, 0, 8), '#120c0c'); f.line(ell(ec, 7.4, 5, hA, 12).slice(0, 7), 1.6, '#a03a2e', { op: 0.85 }); f.line(ell(ec, 7.2, 4.8, hA, 12).slice(6, 12), 1.2, '#7a2a22', { op: 0.7 }); }
    else { const ec = hz([[c[0], c[1] + 0.01]])[0]; f.flat(ell(ec, 3, 3.6, hA, 8), '#a89c90', { op: 0.8 }); f.flat(ell(ec, 1.4, 1.8, 0, 6), '#120c0c'); }
    f.line([...e, e[0]], 4.2, '#0a090b'); f.line([...e, e[0]].slice(9, 15), 2, '#a8a4ae', { op: 0.6 });
  }
  f.line(hz([[0.24, -0.17], [0.27, -0.2], [0.3, -0.18]]), 3, '#0a090b');
  // the slot mouth with lip-bars; the iron tongue-plate inside; black flame leaking between the bars
  const mo = hz([[0.2, 0.32], [0.42, 0.3], [0.42, 0.38], [0.2, 0.39]]);
  f.flat(mo, '#050405');
  f.bone('head');
  for (const u of [0.25, 0.31, 0.37]) { const a = hz([[u, 0.3]])[0], b = hz([[u + 0.005, 0.4]])[0]; X.blackFlame(f, add(lerp(a, b, 0.5), [4, 0]), R(f, 16, 26), 7, { dir: rot([1, -0.4], hA), noFork: true, single: true, edgeW: 1.4, wisps: false, scraps: false }); }
  for (const u of [0.24, 0.3, 0.36, 0.42]) f.line(hz([[u, 0.29], [u + 0.004, 0.41]]), 3, '#3a383e');
  // the long hooked snout, hammered from one sheet, a seam along its top, the bell hanging from its tip
  const snout = hz([[0.38, -0.12], [0.6, -0.1], [0.86, -0.04], [1.08, 0.06], [1.22, 0.18], [1.27, 0.32], [1.2, 0.42, 1], [1.14, 0.32], [1.04, 0.26], [0.84, 0.26], [0.6, 0.27], [0.42, 0.28]]);
  f.part(snout, IR({ maxShade: 10 }));
  X.clipDraw(f, E.smooth(snout), () => {
    f.flat(hz([[0.4, 0.12], [0.8, 0.12], [1.1, 0.18], [1.2, 0.3], [1.1, 0.26], [0.8, 0.24], [0.4, 0.26]]), '#000', { op: 0.4 });
    f.line(hz([[0.42, -0.04], [0.7, -0.02], [0.98, 0.04], [1.18, 0.16]]), 2, '#b4b0ba', { op: 0.55 }); // the lit top seam
    X.plateSeam(f, hz([[0.4, 0.04], [0.8, 0.07], [1.12, 0.14]]), { t: 2, lipOp: 0.4 });
    f.flat(hz(ell([0.84, 0.08], 0.03, 0.02, 0, 8)), '#000', { op: 0.8 }); f.flat(hz(ell([0.98, 0.12], 0.025, 0.018, 0, 8)), '#000', { op: 0.8 }); // nostril holes punched through
    X.flakes(f, hz([[0.7, 0.1]])[0], 30, 6, 3, 0.6);
  });
  for (const q of [[0.42, -0.02], [0.42, 0.2], [-0.12, -0.38], [-0.12, 0.34], [0.2, -0.46]]) f.rivet(hz([q])[0], 3, P.ironL);
  // the hinge at the jaw (a knuckle and pin) and the strap over the crown to the padlock at the nape
  f.part(ell(hz([[-0.12, 0.23]])[0], 6, 9, hA, 10), IR({ inkW: 1.2, cast: false, maxShade: 4 })); f.rivet(hz([[-0.12, 0.23]])[0], 2.4, P.ironL);
  f.part(X.ribbon(hz([[-0.06, -0.48], [-0.3, -0.5], [-0.5, -0.3], [-0.54, -0.06]]), [14, 14, 13, 12]), IR({ fill: '#3a383e', maxShade: 4 }));
  { const pl = hz([[-0.56, 0.04]])[0]; f.part(X.ribbon([add(pl, [-6, -10]), add(pl, [-10, -2]), add(pl, [-6, 6])], [3, 3, 3]), IR({ cast: false })); f.part([add(pl, [-14, 2]), add(pl, [2, 2]), add(pl, [3, 24]), add(pl, [-15, 24])].map(q => [...q, 1]), IR({ fill: '#2e2c32', cast: false, maxShade: 4 })); f.flat(ell(add(pl, [-6, 14]), 2, 3, 0, 6), '#000'); }

  // ---- the near arm, rising to its hole: bare, charred from the board down, a clean void hole through the shoulder
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.94), 32, 25, SKP(), '_n', { vein: false });
  f.bone('upperarm_n'); X.voidDisk(f, lp(SN, EN, 0.16, 2), 9, 8, 0.3); X.ashCake(f, lerp(SN, EN, 0.5), 10, 18, 3, 0.8);
  f.bone('forearm_n');
  X.clipDraw(f, E.smooth(limb(EN, WN, 38, 28)), () => { X.stains(f, E.smooth(limb(EN, WN, 38, 28)), E.bbox([EN, WN]).map((v, i) => v + (i < 2 ? -30 : 30)), P.charS, 0.04, 3, -1.1, 7, 0.95); });
  X.seam(f, [lp(EN, WN, 0.35, -4), lp(EN, WN, 0.6, -7), lp(EN, WN, 0.88, -3)], 2);
  X.seam(f, [lp(EN, WN, 0.55, 6), lp(EN, WN, 0.8, 8)], 1.4);
  X.ash(f, lp(EN, WN, 0.7, -10), 6, 20, 50, 0.7);

  // ---- the neck-fiddle: black oak, iron-banded, held out level at chin height; seen a little from below (its near
  // long face and a sliver of its underside); the neck through the back hole, the wrists through the front two
  f.bone('fiddle');
  const fid = [[bX0, bY - 6], [bX0 + 30, bY - 10], [bX1 - 20, bY - 8], [bX1, bY], [bX1, bY + bT], [bX1 - 14, bY + bT + 10], [bX0 + 16, bY + bT + 12], [bX0 - 4, bY + bT + 2]];
  f.part(fid.map(q => [...q, 1]), OAK({ maxShade: 20 }));
  X.clipDraw(f, E.smooth(fid.map(q => [...q, 1])), () => {
    f.flat([[bX0 - 10, bY + bT], [bX1 + 10, bY + bT], [bX1 + 10, bY + bT + 20], [bX0 - 10, bY + bT + 20]], '#000', { op: 0.55 }); // the underside, in shadow
    f.line([[bX0, bY - 4], [bX1 - 10, bY - 6]], 2.4, '#7a6a64', { op: 0.5 }); // the worn top arris
    for (let i = 0; i < 6; i++) { const y = bY + 3 + i * 3.6; f.line([[bX0 + R(f, 0, 30), y], [bX1 - R(f, 0, 30), y + R(f, -1, 1)]], 0.9, '#000', { op: 0.5 }); }
    X.seam(f, [[bX0 + 60, bY + 8], [bX0 + 120, bY + 10], [bX0 + 170, bY + 6]], 1.6);
    X.stains(f, E.smooth(fid.map(q => [...q, 1])), [bX0 - 10, bY - 20, bX1 + 10, bY + 50], P.ashL, 0.04, 2.4, -1.4, 51, 0.35);
  });
  // iron bands round the board, riveted; the padlock hanging at the front end
  for (const x of [bX0 + 44, bX1 - 22]) { f.part([[x - 9, bY - 12], [x + 9, bY - 12], [x + 10, bY + bT + 13], [x - 8, bY + bT + 13]].map(q => [...q, 1]), IR({ maxShade: 4, cast: false })); f.rivet([x, bY - 2], 2.6, P.ironL); f.rivet([x + 1, bY + bT], 2.6, P.ironL); }
  { const hp = [bX1 - 6, bY + bT + 6]; f.part(X.ribbon([add(hp, [-8, 0]), add(hp, [-10, 12]), add(hp, [0, 16]), add(hp, [8, 12]), add(hp, [6, 0])], [4, 4, 4, 4, 4]), IR({ cast: false })); f.part([add(hp, [-16, 14]), add(hp, [16, 14]), add(hp, [14, 40]), add(hp, [-14, 40])].map(q => [...q, 1]), IR({ fill: '#2e2c32', maxShade: 6 })); f.flat(ell(add(hp, [0, 27]), 2.4, 4, 0, 6), '#000'); f.line([add(hp, [-12, 18]), add(hp, [12, 18])], 1.2, P.ironL, { op: 0.5 }); }
  // the placard of his offence nailed to the board's face, hanging below it
  X.placard(f, [bX0 + 116, bY + bT + 30], 70, 36, 0.04, { rows: 3 });
  for (const q of [[bX0 + 88, bY + bT + 8], [bX0 + 146, bY + bT + 10]]) f.rivet(q, 3, '#5a565e');
  // ash caked round the holes; the wrist holes as dark rims on the board's top edge where the wrists pass
  for (const W0 of [WN, WF]) { f.flat(ell([W0[0], bY - 7], 18, 5, 0, 10), '#0a0708'); X.ashCake(f, [W0[0], bY - 9], 16, 4, 4, 0.7, 0.7); }
  f.flat(ell([bX0 + 30, bY - 9], 30, 6, 0, 12), '#0a0708'); X.ashCake(f, [bX0 + 30, bY - 10], 24, 4, 5, 0.7, 0.6);

  // ---- hands sticking up through the holes, clenched against the strain, charred black, the knuckles split
  f.bone('hand_f');
  { const g = B.grip(f, add(WF, [2, -32]), WF, 0, 26, mix('#3e3436', '#000', 0.2), { shadow: '#0a0708', tex: 'craze' + seed, texOp: 0.5, quiet: true, maxBend: 40 }); X.fistDetail(f, g, 26, '#3e3436', { nail: '#2a2224' }); X.seam(f, g.F([[0.32, -0.5], [0.4, 0.0], [0.34, 0.5]]), 1.2); }
  f.part(limb(WF, add(WF, [2, -22]), 26, 24, { steps: 4 }), CHR({ fill: '#3a3032', cast: false, maxShade: 4 }));
  f.bone('hand_n');
  f.part(limb(add(WN, [0, 4]), add(WN, [2, -24]), 30, 27, { steps: 4 }), CHR({ cast: false, maxShade: 4 }));
  { const g = B.grip(f, add(WN, [3, -38]), WN, 0, 28, '#4a4042', { shadow: '#0a0708', tex: 'craze' + seed, texOp: 0.5, quiet: true, maxBend: 40 }); X.fistDetail(f, g, 28, '#4a4042', { nail: '#2a2224' }); X.seam(f, g.F([[0.3, -0.55], [0.38, -0.05], [0.32, 0.5]]), 1.4); X.seam(f, g.F([[-0.5, -0.3], [-0.1, -0.2]]), 1); X.ash(f, g.F([[0.3, -0.2]])[0], 8, 30, 70, 0.8); }
  // the wooden rosary tangled round the near wrist hole, a loop hanging off the board's edge
  { const r0 = [WN[0] - 16, bY - 8], beads = []; for (let i = 0; i < 9; i++) { const t = i / 8; beads.push(add(r0, [Math.sin(t * Math.PI) * 30 + t * 14, t * 52 + Math.sin(t * Math.PI) * 18])); } f.line(beads, 1.2, '#2a2020'); beads.forEach(q => f.part(ell(q, 3.8, 3.6, 0, 8), { fill: '#5a4a3a', shadow: '#1a120c', shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false })); for (let k = 0; k < 4; k++) f.part(ell(add(r0, [6 + k * 8, -2 + (k % 2) * 3]), 3.8, 3.6, 0, 8), { fill: '#5a4a3a', shadow: '#1a120c', shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); }

  // ---- the bell on the snout's tip (its own bone, hanging plumb)
  f.bone('bell');
  { const t = snTip, bc = add(t, [0, 26]); f.line([t, add(t, [0, 10])], 2, '#2a282e'); f.part([add(bc, [-6, -14]), add(bc, [6, -14]), add(bc, [9, 2]), add(bc, [13, 8, 1]), add(bc, [-13, 8, 1]), add(bc, [-9, 2])], IR({ fill: '#5a5660', light: '#aaa6b0', maxShade: 4 })); f.flat(ell(add(bc, [0, 8]), 11, 3, 0, 10), '#050405'); f.part(ell(add(bc, [1, 12]), 3, 3, 0, 8), IR({ cast: false })); }

  f.bone('root');
  X.ashprint(f, [AF[0] + 30, gy + 4], 1.2); X.ashprint(f, [AN[0] + 40, gy + 4], 1.2);
  return f;
}

// ------------------------------------------------------------------ ASH PARDONER (cast, human 0.95)
// A pardoner who sold the burned saints' ashes to pilgrims on the cathedral steps: a pinch of saint's ash, sealed in
// lead, for every sin. Stooped and wheedling, leaning in to sell, weight on the front foot. The far hand holds a tall pole
// planted beside him, its crosspiece hung with clinking lead ampullae and pardons sealed in grey wax; the near hand held
// out palm up, its fingertips split and smouldering black with violet edges where the ash has eaten them. A neck tray at
// his belly of little lead vials, a horn scoop and a fake finger-bone relic in a little box. A hooded coat of patched grey
// wool, the hood down, the hems charred; a fat purse; a forged bull on a cord with a lead seal; a pilgrim's broad hat
// hanging at his back. A narrow, ratty face, a wide wheedling smile, a broken front tooth; one cheek holed clean through
// by the void, the teeth showing in it.
// Rig: standard humanoid + pole (parent hand_f) + tray (torso) + skirt (pelvis) + hat (torso).
// Motion: idle shaking the pole so the vials clink, the hand held out; attack a pinch of saint's ash flung in a face.
function ashPardoner() {
  const CW = 600, CH = 1000, seed = 1329;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 90, gy = f.o.groundY; // 970
  const skin = '#968a80', skinS = '#33282c', skinL = '#bcb0a4';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const WOOL = (o = {}) => Object.assign({ fill: '#6a6866', shadow: '#1e1c1e', light: '#94908c', shade: 0.4, tex: 'weave' + seed, texOp: 0.55 }, o);
  const LEAD = (o = {}) => Object.assign({ fill: '#6c6c72', shadow: '#26262a', light: '#a4a4aa', shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.1, inkHeavy: 1.6, cast: false, maxShade: 4 }, o);
  const N = [326, 486], C = [262, 540], Pv = [252, 668];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.12, 0.12), SF = S.at(0.38, 0.06);
  const HC = [372, 432], hA = 0.14, neck0 = S.at(0.16, -0.05);
  const pBase = [178, 968], pTop = [232, 150];                     // the pole, planted at his far side, a little behind
  const pAt = y => lerp(pBase, pTop, (pBase[1] - y) / (pBase[1] - pTop[1]));
  const WF = pAt(604), EF = [298, 612];                            // far hand on the pole at the hip, forearm back to it
  const EN = [352, 616], WN = [444, 600];                          // near hand held out, palm up
  const HN = S.at(0.2, 1.0), KN = [334, 816], AN = [332, 934];     // near leg forward, bent, the weight on it
  const HF = S.at(-0.24, 1.0), KF = [216, 818], AF = [182, 936];   // far leg back, the heel lifting
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('pole', WF, 'hand_f').joint('tray', S.at(0.3, 0.6), 'torso').joint('skirt', S.at(0, 0.84), 'pelvis').joint('hat', S.at(-0.4, 0.0), 'torso');

  // ---- the pilgrim's hat hanging at his back on its cord (behind everything)
  f.bone('hat');
  { const hc = S.at(-0.7, 0.3); f.part(ell(hc, 64, 26, -0.5, 24), WOOL({ fill: '#3e3a38', light: '#6a6460', maxShade: 10 })); f.part(ell(add(hc, [6, -6]), 30, 18, -0.5, 16), WOOL({ fill: '#2e2a2a', cast: false, maxShade: 6 })); X.charEdge(f, ell(hc, 64, 26, -0.5, 24).slice(14, 22), 3, { gap: 5 }); }
  // ---- the pole: ash wood, a crosspiece lashed near the top, hung with lead ampullae and sealed pardons
  f.bone('pole');
  f.part(limb(pBase, pTop, 16, 13, { steps: 10 }), { fill: '#4a403a', shadow: '#151110', light: '#7a6e64', shade: 0.4, tex: 'grain' + seed, texOp: 0.5, maxShade: 6 });
  f.line([lp(pBase, pTop, 0.02, -4), lp(pBase, pTop, 0.98, -3)], 1.4, '#9a8c80', { op: 0.45 });
  const cy = 210, cx0 = 92, cx1 = 372, cA = -0.04;
  const cpt = t => add(lerp([cx0, cy + (cx0 - 232) * cA], [cx1, cy + (cx1 - 232) * cA], t), [0, 0]);
  f.part(limb(cpt(0), cpt(1), 13, 12, { steps: 8 }), { fill: '#4a403a', shadow: '#151110', light: '#7a6e64', shade: 0.4, tex: 'grain' + seed, texOp: 0.5, maxShade: 5 });
  X.rope(f, [add(pAt(cy), [-12, -10]), add(pAt(cy), [10, 8])], 4, '#5a5048', { lit: false }); X.rope(f, [add(pAt(cy), [10, -10]), add(pAt(cy), [-12, 8])], 4, '#5a5048', { lit: false });
  // the hangings: lead ampullae on cords (a flat flask, a neck, a stamped face) and pardons (rolled, sealed in grey wax)
  const hang = [[0.04, 70, 'amp'], [0.12, 120, 'par'], [0.2, 54, 'amp'], [0.28, 96, 'amp'], [0.36, 140, 'par'], [0.62, 64, 'amp'], [0.7, 110, 'par'], [0.78, 80, 'amp'], [0.86, 130, 'amp'], [0.95, 62, 'par']];
  for (const [t, l, kind] of hang) {
    const a = cpt(t), b = add(a, [R(f, -3, 3), l]);
    f.line([a, lerp(a, b, 0.5), b], 1.3, '#2a2420');
    if (kind === 'amp') { const c = add(b, [0, 16]); f.part([add(c, [-4, -16]), add(c, [4, -16]), add(c, [5, -8]), add(c, [12, -2]), add(c, [12, 10]), add(c, [0, 16]), add(c, [-12, 10]), add(c, [-12, -2]), add(c, [-5, -8])], LEAD()); f.line([add(c, [-5, 0]), add(c, [5, 6])], 1, '#2a2a2e', { op: 0.7 }); f.flat(ell(add(c, [-1, 3]), 4, 4, 0, 8), '#4a4a50', { op: 0.6 }); }
    else { const c = add(b, [0, 26]); f.part(limb(add(c, [0, -24]), add(c, [0, 24]), 14, 13, { steps: 4 }), { fill: '#c8beb0', shadow: '#5a524a', shade: 0.38, tex: 'weave' + seed, texOp: 0.3, inkW: 1.1, inkHeavy: 1.6, cast: false, maxShade: 4 }); X.charEdge(f, [add(c, [-7, 20]), add(c, [0, 24]), add(c, [7, 20])], 2.4, { gap: 4 }); f.line([add(c, [-6, -8]), add(c, [6, -6])], 0.9, P.rubric, { op: 0.8 }); f.part(ell(add(c, [2, 6]), 8, 7, 0, 10), { fill: '#7a7670', shadow: '#2e2c2a', light: '#aaa49c', shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(ell(add(c, [3, 6]), 3.4, 3, 0, 8), '#4a4844', { op: 0.6 }); }
  }
  f.part(ell(pTop, 10, 9, 0, 10), LEAD({ fill: '#4a403a', light: '#7a6e64' })); // the pole's knob
  // ---- far arm: wool sleeve, the hand round the pole
  f.bone('upperarm_f'); f.part(limb(SF, EF, 50, 42, { p: [[0.4, 0.1, 0.2]] }), WOOL({ fill: mix('#6a6866', '#000', 0.25), maxShade: 10 }));
  f.bone('forearm_f'); f.part(K.ragLimb(f, EF, lerp(EF, WF, 0.8), 44, 40, { depth: 6, teeth: 4 }), WOOL({ fill: mix('#6a6866', '#000', 0.25), maxShade: 8 }));
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, -Math.PI / 2, 21, mix(skin, '#000', 0.18), { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'pardoner pole' });
  X.fistDetail(f, gF, 21, skin, { nail: '#4a4044' });
  // ---- legs under the coat: hose wrapped in sacking, worn shoes
  for (const [Hp, Kn, A, sfx, tone] of [[HF, KF, AF, '_f', 0.25], [HN, KN, AN, '_n', 0]]) {
    const look = WOOL({ fill: mix('#4e4a46', '#000', tone), maxShade: 10 });
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 58, 42, { steps: 8, p: [[0.4, 0.1, 0.2]] }), look);
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.92), 42, 30, { steps: 8, q: [[0.25, 0.14, 0.18]] }), look);
    X.wraps(f, lerp(Kn, A, 0.3), lerp(Kn, A, 0.95), 42, 32, 6, mix('#7a7468', '#000', tone));
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => B.boot(f, A, 1, 40, mix('#3a3230', '#000', tone), { shaft: 0.2, tex: 'craze' + seed, toe: 1.15, style: 'shoe' }), [['shin' + sfx, side(A, mul(da, -1), 14)], ['foot' + sfx, side(A, da, 14)]]);
  }
  // ---- the coat: patched grey wool, long to the calf, the hems charred; the skirt swings on its own bone
  f.bone('skirt');
  const cHem = X.charHem(f, [164, 862], [404, 846], 11, 18, [0, 1]);
  const cSk = [S.at(-0.66, 0.78), S.at(0.6, 0.78), [372, 740], [398, 810], ...cHem.slice().reverse(), [168, 820], [182, 740]];
  f.part(cSk, WOOL({ maxShade: 24 }));
  X.clipDraw(f, E.smooth(cSk), () => {
    X.softTone(f, E.smooth(cSk), [[[[160, 680], [210, 680], [196, 870], [160, 870]], '#000', 0.4, 10], [[[330, 700], [360, 700], [380, 860], [346, 860]], '#fff', 0.12, 8]]);
    X.folds(f, [[208, 700], [240, 704], [276, 700], [316, 698], [350, 702]], 150, 3, '#1a181a', '#a4a09a');
    f.line([[302, 690], [306, 780], [312, 856]], 2.4, '#141214', { op: 0.8 }); // the coat's front opening
    f.part([[214, 760], [258, 756], [262, 800], [216, 806]].map(q => [...q, 1]), WOOL({ fill: '#5a5652', inkW: 1.1, cast: false, maxShade: 4 })); f.stitches([[214, 760], [258, 756], [262, 800], [216, 806], [214, 760]], '#a8a49c', 0.8);
    f.part([[330, 800], [364, 798], [366, 832], [332, 834]].map(q => [...q, 1]), WOOL({ fill: '#7a7670', inkW: 1.1, cast: false, maxShade: 4 })); f.stitches([[330, 800], [364, 798], [366, 832], [332, 834], [330, 800]], '#4a4644', 0.8);
    X.stains(f, E.smooth(cSk), [150, 660, 420, 880], P.charS, 0.03, 2.8, -1.4, 29, 0.85);
    X.burnHole(f, [272, 836], 7, 0.3);
  });
  X.charEdge(f, cHem, 6, { gap: 6 });
  // ---- torso: the coat's body, the hood down round the shoulders
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.34], [0.1, 0.52, 0.44], [0.3, 0.56, 0.52], [0.52, 0.5, 0.5], [0.72, 0.5, 0.5], [0.9, 0.56, 0.54]]);
  f.part(torso, WOOL({ maxShade: 22 }));
  X.clipDraw(f, E.smooth(torso), () => {
    X.softTone(f, E.smooth(torso), [[[S.at(-0.7, 0.1), S.at(-0.2, 0.1), S.at(-0.2, 1), S.at(-0.7, 1)], '#000', 0.3, 8]]);
    X.folds(f, [S.at(0.1, 0.2), S.at(-0.2, 0.3), S.at(0.3, 0.4)], 70, 2.4, '#1a181a', '#a4a09a');
    X.stains(f, E.smooth(torso), E.bbox(torso), P.charS, 0.035, 2.4, -1.4, 33, 0.45);
  });
  const hood = [S.at(-0.6, -0.06), S.at(-0.2, -0.16), S.at(0.3, -0.12), S.at(0.5, 0.04), S.at(0.2, 0.14), S.at(-0.2, 0.2), S.at(-0.7, 0.26), S.at(-0.84, 0.1)];
  f.part(hood, WOOL({ fill: '#5e5c5a', maxShade: 10 }));
  X.crease(f, [S.at(-0.6, 0.04), S.at(-0.3, 0.1), S.at(0.1, 0.06)], 2.6, { col: '#141214', lit: '#a4a09a' }); X.crease(f, [S.at(-0.72, 0.14), S.at(-0.4, 0.18)], 2, { col: '#141214', lit: '#a4a09a' });
  X.charEdge(f, [S.at(-0.7, 0.26), S.at(-0.2, 0.2), S.at(0.2, 0.14)], 4, { gap: 6 });
  // belt, the fat purse, the forged bull on its cord with a lead seal
  f.bone('pelvis');
  f.part(X.ribbon([S.at(-0.6, 0.78), S.at(0.0, 0.8), S.at(0.58, 0.77)], [14, 14, 14]), { fill: P.leather, shadow: P.leatherD, light: P.leatherL, shade: 0.4, inkW: 1.2, cast: false, maxShade: 4 });
  { const pc = S.at(-0.3, 0.9); f.line([S.at(-0.3, 0.79), pc], 2, P.leatherD); f.part([add(pc, [-16, -4]), add(pc, [16, -6]), add(pc, [22, 20]), add(pc, [10, 34]), add(pc, [-12, 34]), add(pc, [-22, 18])], { fill: '#4a3e38', shadow: '#140f0e', light: '#7a6a5e', shade: 0.42, tex: 'craze' + seed, texOp: 0.4, maxShade: 8 }); f.line([add(pc, [-14, 0]), add(pc, [0, 6]), add(pc, [14, -2])], 1.6, '#140f0e'); f.flat(ell(add(pc, [4, 20]), 5, 3, 0, 8), '#8a7a6a', { op: 0.5 }); }
  { const bc = S.at(0.4, 0.79), d0 = add(bc, [6, 64]); f.line([bc, add(bc, [4, 30]), d0], 1.4, '#3a3028'); f.part([add(d0, [-18, -2]), add(d0, [18, -4]), add(d0, [20, 24]), add(d0, [-16, 26])].map(q => [...q, 1]), { fill: '#bab0a0', shadow: '#5a524a', shade: 0.35, tex: 'weave' + seed, texOp: 0.3, inkW: 1.1, inkHeavy: 1.5, cast: false, maxShade: 4 }); for (let i = 0; i < 3; i++) f.line([add(d0, [-12, 4 + i * 6]), add(d0, [12, 3 + i * 6])], 1, P.rubric, { op: 0.75 }); f.part(ell(add(d0, [2, 34]), 9, 9, 0, 10), LEAD()); f.flat(ell(add(d0, [2, 34]), 4, 4, 0, 8), '#3a3a3e', { op: 0.6 }); }

  // ---- the head: narrow and ratty, a wide wheedling smile, a broken front tooth; the void hole through the near cheek
  f.bone('head');
  f.part(limb(neck0, add(HC, [-14, 28]), 32, 28, { p: [[0.5, -0.08, 0.3]] }), SKP({ maxShade: 6 }));
  const hd = B.head(f, HC, H, hA, { skin, jaw: 0.84, chin: -0.02, nose: 1.16, hook: 0.3, mouth: 'smirk', squint: 0.6, browDown: -0.04, age: true, gaunt: true, faceShade: 0.8, faceHatch: false, jawShade: 0.5, hairCol: '#3a3436', browCol: '#3a3436', browW: 0.035,
    hairBack: [[-0.36, 0.3], [-0.46, 0.0], [-0.42, -0.3], [-0.2, -0.48], [0.04, -0.5], [-0.1, -0.36], [-0.3, -0.1], [-0.28, 0.2]],
    hair: [[-0.36, 0.1], [-0.38, -0.2], [-0.26, -0.44], [0.0, -0.52], [0.14, -0.46], [-0.04, -0.4], [-0.18, -0.22], [-0.24, 0.06]] });
  X.greyFace(f, hd, skin, 1.16);
  // the wide smile: the mouth pulled up at the corner, teeth showing, the broken front tooth
  f.flat(hd([[0.17, 0.27], [0.26, 0.29], [0.32, 0.26], [0.33, 0.235], [0.28, 0.31], [0.2, 0.31]]), '#1a0e0e');
  for (const [u, broken] of [[0.215, false], [0.245, false], [0.275, true], [0.3, false]]) f.flat(hd(broken ? [[u - 0.012, 0.278], [u + 0.012, 0.28], [u + 0.01, 0.29], [u - 0.01, 0.286]] : [[u - 0.012, 0.276], [u + 0.012, 0.278], [u + 0.01, 0.298], [u - 0.012, 0.296]]), '#c8bea8', { op: 0.95 });
  f.line(hd([[0.12, 0.2], [0.17, 0.27]]), 1.3, INK, { op: 0.7 }); // the smile line
  // the cheek holed clean through: a clean rim, the dark, the back teeth showing in it
  { const c = hd([[0.1, 0.17]])[0]; X.voidDisk(f, c, 6.5, 6.5, 0); for (let i = 0; i < 3; i++) f.flat(ell(add(c, [-3 + i * 3, 2]), 1.1, 2, 0, 6), '#b8ae98', { op: 0.9 }); }
  for (let i = 0; i < 5; i++) X.hairClump(f, hd([[-0.3 + i * 0.05, -0.3], [-0.36 + i * 0.05, 0.0], [-0.34 + i * 0.05, 0.22]]), 5, { pal: ['#2a2426', '#3a3436', '#4a4446'], gap: false, n: 2 }); // lank greasy hair
  // ---- the neck tray: a shallow box on a strap round the neck, seen a little from above; lead vials, a horn scoop, a
  // little box with a fake finger-bone
  f.bone('tray');
  { const t0 = S.at(0.26, 0.56), tw = 130, th = 22, dp = [26, -14];
    f.line([neck0, add(t0, [-6, -6])], 3, P.leatherD); f.line([add(neck0, [20, -6]), add(t0, [tw - 10, -12])], 3, P.leatherD);
    const top = [t0, add(t0, [tw, 0]), add(add(t0, [tw, 0]), dp), add(t0, dp)];
    f.part(top.map(q => [...q, 1]), { fill: '#3a302c', shadow: '#120e0c', shade: 0.4, tex: 'grain' + seed, texOp: 0.5, inkW: 1.2, cast: false, maxShade: 4 });
    for (let i = 0; i < 6; i++) { const q = add(t0, [16 + i * 15, -4 + (i % 2) * -6]); f.part([add(q, [-5, 0]), add(q, [-5, -14]), add(q, [-2, -18]), add(q, [-2, -22]), add(q, [2, -22]), add(q, [2, -18]), add(q, [5, -14]), add(q, [5, 0])], LEAD()); }
    f.part(limb(add(t0, [96, -8]), add(t0, [146, -26]), 12, 6, { steps: 4 }), { fill: '#a89878', shadow: '#4a3e30', shade: 0.35, inkW: 1, cast: false, hatch: false, maxShade: 3 }); // the horn scoop
    const bx = add(t0, [100, 2]); f.part([add(bx, [-14, -2]), add(bx, [14, -2]), add(bx, [14, -14]), add(bx, [-14, -14])].map(q => [...q, 1]), { fill: '#4a3a30', shadow: '#140e0c', shade: 0.35, inkW: 1, cast: false, maxShade: 3 }); f.part(limb(add(bx, [-9, -9]), add(bx, [9, -9]), 5, 4, { steps: 3 }), { fill: P.bone, shadow: P.boneS, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); f.flat(ell(add(bx, [-2, -9]), 1.2, 2, 0, 6), P.boneS);
    const front = [t0, add(t0, [tw, 0]), add(t0, [tw, th]), add(t0, [0, th])];
    f.part(front.map(q => [...q, 1]), { fill: '#4a3e38', shadow: '#140f0e', light: '#7a6a5e', shade: 0.4, tex: 'grain' + seed, texOp: 0.6, inkW: 1.3, maxShade: 6 });
    X.charEdge(f, [add(t0, [0, th]), add(t0, [tw * 0.5, th]), add(t0, [tw, th])], 3, { gap: 6 }); X.ashCake(f, add(t0, [tw / 2, -4]), 50, 4, 6, 0.6, 0.6); }
  // ---- near arm, held out, palm up: wool sleeve, the hand's fingertips split and smouldering black
  f.bone('upperarm_n'); f.part(limb(SN, EN, 54, 46, { p: [[0.4, 0.12, 0.2]] }), WOOL({ maxShade: 10 })); X.crease(f, [lp(SN, EN, 0.3, 12), lp(SN, EN, 0.6, 16), lp(SN, EN, 0.85, 10)], 2.4, { col: '#141214', lit: '#a4a09a' });
  f.bone('forearm_n'); f.part(K.ragLimb(f, EN, lerp(EN, WN, 0.84), 48, 46, { depth: 7, teeth: 5 }), WOOL({ maxShade: 10 })); X.charEdge(f, [lp(EN, WN, 0.84, 23), lp(EN, WN, 0.86, 0), lp(EN, WN, 0.84, -23)], 4, { gap: 4 });
  f.part(limb(lerp(EN, WN, 0.6), WN, 30, 26, { steps: 4 }), SKP({ maxShade: 4 }));
  f.bone('hand_n');
  { const tip = '#1a1416', hn = X.openHand(f, WN, -0.1, 78, { look: SKP(), flip: true, curl: 0.3, spread: 0.1, tips: tip, thumbAng: 0.6, bend: [0.05, 0.0, -0.06, -0.12] });
    for (const g of hn.fing) { X.hairline(f, [g.k2, lerp(g.k2, g.k3, 0.6)], 1.2); X.ash(f, g.k3, 3, 10, 40, 0.6); } }

  f.bone('root');
  X.ashprint(f, [AF[0] + 30, gy + 4], 1.2);
  return f;
}

// ------------------------------------------------------------------ FAGGOT-BEARER (cast, large 1.5)
// A lay brother who carried firewood to the pyres: enough for nine hundred years of them. Immense and thick-limbed, bent
// forward under a towering stack of bundled black sticks on a back-frame, both hands on the shoulder straps, legs braced
// wide, weight forward over the front foot. A small head pushed forward under the load, the tonsure burned to stubble,
// a dull, patient face. Fire: his back and shoulders charred where the burning load rests on them, the skin split into
// violet-lipped seams across the shoulder blades, ash curling off him; the topmost bundles burning black. Void: a clean
// round hole through the near calf (cut through, the ground showing), and he walks on it anyway. Dress: a short lay habit
// of sackcloth kilted up through a rope belt, burned through at the shoulders; a leather pad over the shoulders; the
// back-frame of ash poles lashed with withies; a hatchet in the belt; a coil of willow binding at the hip; wooden clogs;
// sacking wrapped round the legs; a cord with a knot for every pyre, long enough to drag.
// Rig: standard humanoid + frame (parent torso: the frame and its stack) > load_top (the burning top bundles) + skirt
// (pelvis) + cord_1 > cord_2 (pelvis). Both hands hold the straps (they follow the torso; no IK needed for the idle).
// Motion: idle hitching the load higher, ash falling; attack tipping the burning top bundles onto a hero (torso and
// frame pitch forward, load_top slides off).
function faggotBearer() {
  const CW = 900, CH = 1250, seed = 1327, DY = 100; // drawn in a space 100 px higher, then moved down onto the ground
  const f = new Fig(X.base(seed, CH, { grimeY: 900 })); X.textures(f);
  const H = 116, gy = f.o.groundY - DY; // 1120 in drawing space, 1220 on the canvas
  const skin = '#8a7e78', skinS = '#2e2428', skinL = '#b0a49a';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const SK = (o = {}) => SACK(seed, o);
  const WOOD = (o = {}) => Object.assign({ fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.38, tex: 'grain' + seed, texOp: 0.55 }, o);
  const POLE = (o = {}) => Object.assign({ fill: '#4a403a', shadow: '#151110', light: '#7a6e64', shade: 0.4, tex: 'grain' + seed, texOp: 0.5 }, o);
  const N = [600, 452], C = [470, 500], Pv = [404, 680];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(0.1, 0.1), SF = S.at(0.5, 0.0);
  const HC = [686, 452], hA = -0.2, neck0 = S.at(0.3, -0.02);
  const HN = S.at(0.32, 1.0), KN = [590, 886], AN = [566, 1064];   // near leg forward, knee over the foot, the weight on it
  const HF = S.at(-0.3, 1.0), KF = [326, 884], AF = [262, 1066];   // far leg back, straighter, driving
  // the shoulder straps come over the shoulders from the frame; the hands grip them in front of the chest
  const WN = S.at(0.92, 0.22), EN = [482, 566]; // the elbow back at his side, the forearm square to the strap
  const WF = add(S.at(0.95, 0.12), [26, -14]), EF = add(S.at(0.8, 0.5), [34, -6]);
  // the back-frame: two ash rails up the back, leaning a little forward; the stack built on it
  const FB = S.at(-0.78, 1.0), fd = E.norm([0.3, -1]), fn = [-fd[1], fd[0]]; // fn points back (away from him)
  const FR = (u, v) => add(add(FB, mul(fd, u)), mul(fn, v)); // u up the frame, v back from the rails
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('frame', S.at(-0.6, 0.5), 'torso').joint('load_top', FR(640, 120), 'frame').joint('skirt', S.at(0, 0.82), 'pelvis');
  f.joint('cord_1', S.at(-0.5, 0.86), 'pelvis').joint('cord_2', [250, 980], 'cord_1');

  // ---- the knotted cord, dragging behind him on the floor (behind everything)
  f.bone('cord_1');
  const cd = [S.at(-0.5, 0.86), [300, 820], [258, 940], [236, 1040]];
  X.rope(f, cd, 4, '#5a5248');
  f.bone('cord_2');
  const cd2 = [[236, 1040], [212, 1100], [150, gy - 4], [60, gy - 2], [8, gy - 6]];
  X.rope(f, cd2, 4, '#5a5248', { fray: true });
  for (const [pts, b] of [[cd, 'cord_1'], [cd2, 'cord_2']]) { f.bone(b); const C2 = X.spline(pts, 4); for (let i = 3; i < C2.length - 1; i += 9 + Math.floor(f.r() * 8)) f.part(ell(C2[i], 5, 4.4, 0, 8), { fill: '#6a6054', shadow: '#2a241c', shade: 0.4, inkW: 1, cast: false, hatch: false }); }

  // ---- far arm: thick, the sleeve pushed up, the hand on the far strap
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.92), 62, 52, SKP({ fill: mix(skin, '#000', 0.22) }), '_f', { vein: false });
  f.bone('upperarm_f'); f.part(K.ragLimb(f, lerp(SF, EF, -0.1), lerp(SF, EF, 0.7), 74, 66, { depth: 8, teeth: 4 }), SK({ fill: mix(P.sack, '#000', 0.25), maxShade: 10 }));
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, ang(WF, S.at(0.5, -0.12)), 30, mix(skin, '#000', 0.2), { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, quiet: true, maxBend: 45 });
  X.fistDetail(f, gF, 30, skin, { nail: '#4a4044' });
  // ---- far leg: wrapped in sacking, a wooden clog
  const legW = (Hp, Kn, A, sfx, tone, hole) => {
    const look = SK({ fill: mix('#6a665c', '#000', tone), maxShade: 14 });
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 112, 76, { steps: 10, p: [[0.4, 0.12, 0.2]], q: [[0.5, 0.06, 0.2]] }), SKP({ fill: mix(skin, '#000', tone), maxShade: 16 }));
    f.bone('shin' + sfx);
    const shin = limb(Kn, lerp(Kn, A, 0.96), 80, 50, { steps: 10, q: [[0.28, 0.2, 0.18]] });
    X.cutHoles(f, hole ? [hole] : [], () => {
      f.part(shin, look);
      X.wraps(f, lerp(Kn, A, 0.08), lerp(Kn, A, 0.95), 78, 52, 8, mix('#7a7468', '#000', tone), { stain: 0.4 });
      X.clipDraw(f, E.smooth(shin), () => X.stains(f, E.smooth(shin), E.bbox(shin), P.charS, 0.04, 2.6, -1.3, 61, 0.6));
    }, { shape: E.smooth(shin) });
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => {
      // the clog: a block of black wood, a thick sole, a rounded toe, worn pale at the toe
      const s = 64, X0 = u => A[0] + u * s, clog = [[X0(-0.5), gy, 1], [X0(1.3), gy, 1], [X0(1.42), gy - 18], [X0(1.3), gy - 40], [X0(0.8), gy - 56], [X0(0.3), A[1] + 6], [X0(-0.36), A[1] + 4], [X0(-0.56), gy - 30]];
      f.part(clog, WOOD({ fill: mix('#3a302c', '#000', tone), maxShade: 12 }));
      f.line([[X0(-0.5), gy - 14], [X0(1.36), gy - 14]], 2, '#0a0808', { op: 0.8 });
      f.line([[X0(1.0), gy - 46], [X0(1.32), gy - 32]], 2.4, '#8a7c70', { op: 0.5 });
      X.ashCake(f, [X0(0.4), gy - 6], 40, 6, 4, 0.7, 0.5);
    }, [['shin' + sfx, side(A, mul(da, -1), 20)], ['foot' + sfx, side(A, da, 20)]]);
  };
  legW(HF, KF, AF, '_f', 0.25, null);

  // ---- the back-frame and its stack (behind the torso's back edge, on the frame bone)
  f.bone('frame');
  // rails and cross-bars, lashed with withies
  for (const v of [-10, 40]) f.part(limb(FR(-20, v), FR(640, v + 20), 22, 18, { steps: 10 }), POLE({ fill: v > 0 ? '#3a322e' : '#4a403a', maxShade: 6 }));
  // the bundles, cut ends toward us: an oval of many stick ends, a withy band round each, charred black at the rim
  const bundle = (c, rx, ry, a, o = {}) => {
    const outline = ell(c, rx, ry, a, 22).map(q => add(q, [R(f, -3, 3), R(f, -3, 3)]));
    f.part(outline, WOOD({ fill: '#1a1416', maxShade: 8, cast: true, castOp: 0.5 }));
    X.clipDraw(f, outline, () => {
      for (let i = 0; i < Math.round(rx * ry / 50); i++) { const t = f.r() * 6.283, rr = Math.sqrt(f.r()) * 0.92, q = add(c, rot([Math.cos(t) * rx * rr, Math.sin(t) * ry * rr], a)), r = R(f, 4, 8); f.part(ell(q, r, r * R(f, 0.8, 1), f.r() * 3, 7), { fill: f.r() < 0.35 ? '#2a2224' : f.r() < 0.6 ? '#5a4c48' : '#6e605a', shadow: P.charS, shade: 0.4, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false, maxShade: 2 }); if (f.r() < 0.3) f.flat(ell(q, r * 0.3, r * 0.3, 0, 5), '#1a1416'); }
      X.softTone(f, E.smooth(outline), [[ell(add(c, rot([-rx * 0.4, ry * 0.4], a)), rx * 0.6, ry * 0.5, a, 10), '#000', 0.45, 8]]);
    });
    // a twisted withy band across the bundle's face (round its girth, seen at the end as a band near the rim)
    X.rope(f, ell(c, rx * 1.02, ry * 1.02, a, 22).slice(o.band ?? 2, (o.band ?? 2) + 9), 6, '#4a4038', { lit: false });
    if (o.seam) X.seam(f, [add(c, rot([-rx * 0.5, -ry * 0.2], a)), c, add(c, rot([rx * 0.4, ry * 0.3], a))], 1.6);
    return outline;
  };
  // long bundles lying along the frame on top, the sticks seen along their length, sticking out fore and aft
  const longB = (a, b, w, n) => {
    const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
    f.part(limb(a, b, w, w * 0.9, { steps: 8 }), { fill: '#0e0a0c', shade: 0.2, inkW: 1.4, cast: true, hatch: false, maxShade: 2 });
    for (let i = 0; i < n; i++) { const o2 = (i / (n - 1) - 0.5) * w * 0.8, aa = add(add(a, mul(nn, o2)), mul(d, R(f, -10, 16))), bb = add(add(b, mul(nn, o2 * 0.95)), mul(d, R(f, -20, 14))), sw = R(f, 7, 11); f.part(limb(aa, bb, sw, sw * 0.8, { steps: 5 }), WOOD({ inkW: 0.9, inkHeavy: 1.3, cast: false, maxShade: 3, fill: ['#2a2224', '#352d2a', '#40363a'][Math.floor(f.r() * 3)] })); f.line([lp(aa, bb, 0.05, -sw * 0.22), lp(aa, bb, 0.9, -sw * 0.18)], 0.9, P.woodL, { op: 0.45 }); if (f.r() < 0.3) { const k = lp(aa, bb, R(f, 0.2, 0.8), 0); f.line([k, add(k, rot(mul(d, 18), R(f, -1.4, 1.4)))], 1.8, P.wood); } for (const e of [aa, bb]) f.part(ell(e, sw * 0.32, sw * 0.46, ang(aa, bb), 7), { fill: f.r() < 0.4 ? '#3a3032' : '#6a5c56', shadow: P.charS, shade: 0.35, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false, maxShade: 2 }); }
    for (const tt of [0.25, 0.72]) { const c = lerp(a, b, tt), wd = w * 0.52; X.rope(f, [add(c, mul(nn, -wd)), add(c, mul(d, 4)), add(c, mul(nn, wd))], 5, '#4a4038', { lit: false }); }
  };
  // the stack: two columns of end-on bundles rising up the frame, the back column a little higher, ash on the ledges
  const col = [[50, 62, 0], [138, 58, 1], [222, 60, 0], [304, 56, 1], [384, 58, 0], [462, 54, 1]];
  for (const [u, r, k] of col) bundle(FR(u + 30, 150 + (k ? 6 : -4)), r * 1.05, r * 0.92, 0.1 + R(f, -0.1, 0.1), { band: Math.floor(R(f, 0, 6)) });
  for (const [u, r, k] of col) bundle(FR(u, 64 + (k ? -6 : 4)), r, r * 0.9, 0.1 + R(f, -0.1, 0.1), { band: Math.floor(R(f, 0, 6)), seam: k === 1 });
  for (const [u] of col) X.ashCake(f, FR(u + 36, 40), 26, 6, 3, 0.8, 0.5);
  // the frame's cross lashing over the bundles (withies binding the stack to the rails)
  for (const u of [110, 300]) X.rope(f, [FR(u, -20), FR(u + 30, 90), FR(u + 50, 200)], 5, '#4a4038', { lit: false });
  longB(FR(530, -90), FR(556, 250), 62, 11);
  // the burning top bundles (their own bone: the attack tips them off)
  f.bone('load_top');
  longB(FR(592, -120), FR(616, 210), 58, 10);
  longB(FR(648, -70), FR(664, 230), 54, 10);
  { const a = FR(676, -80), b = FR(690, 220); X.flameSheet(f, [a, lerp(a, b, 0.5), b], [[a[0] + 10, 110, 36, -0.2], [lerp(a, b, 0.3)[0], 170, 44, -0.1], [lerp(a, b, 0.55)[0], 120, 38, 0.05], [lerp(a, b, 0.8)[0], 200, 46, 0.12], [b[0] - 6, 90, 30, 0.2]], { edgeW: 2.2 }); }
  X.ash(f, FR(690, 80), 14, 160, 160, 1.1);

  // ---- torso: huge and bent, the habit burned through over the shoulders, the charred back split across the blades
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.5, 0.42], [0.1, 0.84, 0.66], [0.3, 0.94, 0.86], [0.5, 0.9, 0.9], [0.7, 0.84, 0.88], [0.88, 0.86, 0.84], [1.04, 0.84, 0.8]]);
  f.part(torso, SK({ maxShade: 30 }));
  const tD = E.smooth(torso);
  X.clipDraw(f, tD, () => {
    X.softTone(f, tD, [[[S.at(0.3, 0.3), S.at(1, 0.3), S.at(1, 1), S.at(0.3, 1)], '#000', 0.35, 12]]);
    // the burned-through back: charred skin from the nape across the shoulder blades, the habit's edge burnt round it
    const back = [S.at(-0.9, -0.1), S.at(0.2, -0.2), S.at(0.3, 0.12), S.at(0.0, 0.3), S.at(-0.4, 0.46), S.at(-0.94, 0.5)];
    f.part(back, SKP({ fill: '#4a3e40', shadow: '#120c0e', light: '#7a6c6a', tex: 'craze' + seed, texOp: 0.6, cast: false, maxShade: 10 }));
    X.clipDraw(f, E.smooth(back), () => {
      X.stains(f, E.smooth(back), E.bbox(back).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 3, -1.2, 63, 0.9);
      X.crease(f, [S.at(-0.3, 0.06), S.at(-0.5, 0.22), S.at(-0.42, 0.38)], 3, { op: 0.6, lit: skinL }); // the shoulder blade's edge
      X.crackNet(f, S.at(-0.6, 0.12), 0.2, 90, 2.4, { depth: 2 }); X.crackNet(f, S.at(-0.3, 0.3), -0.5, 70, 2, { depth: 1 });
      X.flakes(f, S.at(-0.4, 0.2), 50, 30, 7, 1);
    });
    X.charEdge(f, [S.at(-0.94, 0.5), S.at(-0.4, 0.46), S.at(0.0, 0.3), S.at(0.3, 0.12)], 6, { gap: 6 });
    X.folds(f, [S.at(0.5, 0.4), S.at(0.2, 0.5), S.at(0.7, 0.6), S.at(-0.3, 0.6)], 90, 3, '#24211d', P.sackL, { lean: 0.3 });
    X.stains(f, tD, E.bbox(torso), P.charS, 0.03, 2.6, -1.4, 65, 0.45);
    X.ashCake(f, S.at(-0.5, 0.3), 50, 40, 10, 1.1);
  });
  X.ash(f, S.at(-0.6, 0.2), 14, 60, 150, 1.1);
  // the leather pad over the shoulders, and the straps from the frame over the shoulder to the hands
  f.part([S.at(-0.7, -0.04), S.at(0.1, -0.16), S.at(0.5, 0.0), S.at(0.4, 0.22), S.at(-0.1, 0.2), S.at(-0.72, 0.18)], { fill: P.leather, shadow: P.leatherD, light: P.leatherL, shade: 0.4, tex: 'craze' + seed, texOp: 0.5, maxShade: 10 });
  f.stitches([S.at(-0.66, 0.12), S.at(-0.1, 0.14), S.at(0.36, 0.16)], '#8a7a6a', 0.9);
  for (const [a, b, c2] of [[S.at(-0.5, -0.1), S.at(0.3, -0.14), WN], [S.at(-0.3, -0.16), S.at(0.5, -0.12), WF]]) f.part(X.ribbon(X.spline([a, b, lerp(b, c2, 0.5), c2], 6), X.spline([a, b, lerp(b, c2, 0.5), c2], 6).map(() => 20)), { fill: '#3a3230', shadow: '#120e0c', light: '#6a5e58', shade: 0.4, inkW: 1.2, cast: false, maxShade: 4 });
  // ---- near leg: thick, wrapped, the knee over the foot; a clean void hole through the calf
  legW(HN, KN, AN, '_n', 0, [lp(KN, AN, 0.34, -8), 15]);
  // ---- the habit's skirt, kilted up through the rope belt, short over the thighs, the hem charred
  f.bone('skirt');
  const hem = X.charHem(f, [324, 812], [596, 784], 11, 18, [0, 1]);
  const sk = [S.at(-0.9, 0.8), S.at(0.92, 0.8), [612, 740], ...hem.slice().reverse(), [316, 760]];
  f.part(sk, SK({ maxShade: 26 }));
  X.clipDraw(f, E.smooth(sk), () => {
    X.softTone(f, E.smooth(sk), [[[[300, 680], [360, 680], [340, 820], [300, 820]], '#000', 0.4, 10]]);
    X.folds(f, [[372, 704], [420, 710], [470, 716], [520, 712], [566, 706]], 90, 3, '#24211d', P.sackL, { lean: 0.15 });
    for (const q of [[[356, 700], [420, 690], [480, 702]], [[470, 700], [540, 690], [600, 704]]]) X.crease(f, q, 2.6, { col: '#24211d', lit: P.sackL }); // the kilted bunching
    X.stains(f, E.smooth(sk), [290, 640, 640, 830], P.charS, 0.03, 2.8, -1.4, 67, 0.8);
  });
  X.charEdge(f, hem, 6, { gap: 6 });
  f.bone('pelvis');
  X.rope(f, [S.at(-0.94, 0.8), S.at(0.0, 0.84), S.at(0.94, 0.8)], 8, P.sackL);
  // the hatchet thrust through the belt; the coil of willow binding at the hip
  { const hb = S.at(-0.2, 0.84), ht = add(hb, [-40, 110]); f.part(limb(add(hb, [12, -30]), ht, 14, 12, { steps: 6 }), POLE({ maxShade: 4 })); const hh = add(hb, [14, -36]); f.part([add(hh, [-24, -4]), add(hh, [24, -12]), add(hh, [30, 4]), add(hh, [26, 20]), add(hh, [-16, 10])], X.IRON(f, { maxShade: 6, inkW: 1.3 })); f.line([add(hh, [28, -8]), add(hh, [28, 16])], 2, P.ironL, { op: 0.6 }); }
  { const wc = add(S.at(-0.6, 0.86), [-10, 60]); f.line([S.at(-0.6, 0.84), add(wc, [0, -26])], 3, '#3a3028'); for (let k = 0; k < 5; k++) { const e = ell(add(wc, [k * 3 - 6, k * 2 - 4]), 34 - k * 2, 22 - k, 0.5 + k * 0.08, 20); f.line(e.concat([e[0]]), 7, '#1a1410'); f.line(e.concat([e[0]]), 4.6, k % 2 ? '#5a4c3a' : '#7a6a52'); } f.line([add(wc, [24, 14]), add(wc, [40, 44]), add(wc, [34, 66])], 4, '#6a5c48'); } // the coil of willow binding, hung at the hip

  // ---- head: small, pushed forward under the load; the tonsure burned to stubble; dull, patient
  f.bone('head');
  f.part(limb(neck0, add(HC, [-20, 26]), 64, 52, { p: [[0.5, 0.06, 0.3]] }), SKP({ maxShade: 10 }));
  X.crease(f, [add(neck0, [10, 20]), add(neck0, [40, 26]), add(HC, [0, 46])], 2, { op: 0.5, lit: skinL });
  const hd = B.head(f, HC, H, hA, { skin, jaw: 1.14, chin: 0.02, nose: 1.0, hook: 0.0, mouth: 'set', squint: 0.6, browDown: 0.02, age: true, faceShade: 0.8, faceHatch: false, jawShade: 0.5, hairCol: '#2a2224', browCol: '#3a3234', browW: 0.04 });
  X.greyFace(f, hd, skin, 1.0);
  f.flat(hd([[0.06, -0.06], [0.11, -0.072], [0.17, -0.064], [0.165, -0.052], [0.11, -0.054]]), mix(skin, '#000', 0.3), { op: 0.85 }); // heavy lids
  f.part(hd(ell([-0.1, -0.4], 0.26, 0.12, -0.15, 14)), SKP({ fill: mix(skin, '#000', 0.18), inkW: 1, cast: false, maxShade: 4 })); // the shaved crown
  for (let i = 0; i < 40; i++) { const q = hd([[R(f, -0.4, 0.14), R(f, -0.5, -0.24)]])[0]; f.line([q, add(q, [R(f, -1, 1), -2.6])], 1.1, '#1e1818', { op: 0.75 }); } // burned stubble
  X.soot(f, hd([[-0.2, -0.36]])[0], 18, 9, 0.5, hA);
  X.hairline(f, hd([[-0.06, -0.3], [0.0, -0.2], [-0.04, -0.1]]), 1);
  X.ash(f, hd([[-0.1, -0.5]])[0], 6, 30, 80, 0.8);

  // ---- near arm: thick, the sleeve pushed up, the hand round the near strap
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.92), 66, 56, SKP(), '_n', { vein: true });
  f.bone('upperarm_n'); f.part(K.ragLimb(f, lerp(SN, EN, -0.12), lerp(SN, EN, 0.68), 80, 72, { depth: 8, teeth: 4 }), SK({ maxShade: 12 }));
  X.charEdge(f, [lp(SN, EN, 0.66, 36), lp(SN, EN, 0.7, 0), lp(SN, EN, 0.66, -36)], 4);
  f.bone('forearm_n'); X.seam(f, [lp(EN, WN, 0.2, -12), lp(EN, WN, 0.45, -16), lp(EN, WN, 0.7, -10)], 2.2); X.ashCake(f, lerp(EN, WN, 0.5), 14, 20, 4, 0.9);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, ang(WN, S.at(0.3, -0.14)), 32, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, quiet: true, maxBend: 45 });
  X.fistDetail(f, gN, 32, skin, { nail: '#4a4044' });

  f.bone('root');
  X.ashprint(f, [AF[0] + 60, gy + 4], 1.6); X.ashprint(f, [AN[0] + 70, gy + 4], 1.6);
  X.placeFigure(f, 0, 1, [0, 0], [0, DY], Object.keys(f.joints));
  return f;
}

// ------------------------------------------------------------------ THE QUESTIONER (elite 2.0)
// The inquisition's questioner, who put heretics to the question in the undercroft. He asks each question once; he has a
// great many irons in the fire. Broad and heavy, standing square beside a brazier on an iron tripod, weight on the back
// leg, belly forward; long tongs raised in the near hand gripping a black-burning iron, the far forearm resting on the
// brazier's rim. A huge, thick-necked man with bare arms: the fire has worked on him slowly, the forearms' skin split
// along the muscle into seams with violet edges, charred black at the lips of each split, ash curling off them. The far
// hand is gone at the wrist, the stump a clean void rim; it rests on the brazier and does not burn. Bald and heavy, a
// burn-shiny jaw, no eyebrows, small patient eyes, a mouth set in professional boredom.
// Dress: a long leather apron scorched stiff; a sackcloth shirt with the sleeves torn off; a leather skullcap; heavy boots
// wrapped in leather; a scorched hood hanging down his back; a key on a thong round his neck; old burn scars over both
// shins; a belt hung with pincers, a thumbscrew, a knotted cord and a small hammer; the brazier, an iron bowl on a
// three-legged stand, half a dozen irons standing in its black coals, their handles wrapped in rag; a leather bucket of
// water that has never been used.
// Rig: standard humanoid + tongs (parent hand_n) > iron + apron (pelvis) + hood (torso) + tools (pelvis); brazier and
// bucket on root. Motion: idle turning an iron in the coals and lifting it to look at it; attack pressing the iron to a
// hero (the near arm drives forward and down, the tongs level).
function questioner() {
  const [CW, CH] = TIERS.elite, seed = 1322;
  const f = new Fig(X.base(seed, CH, { grimeY: 1150 })); X.textures(f);
  const H = 196, gy = f.o.groundY; // 1370
  const skin = '#8e8078', skinS = '#30242a', skinL = '#b8aa9e';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const LTH = (o = {}) => Object.assign({ fill: '#4a3e38', shadow: '#140f0e', light: '#7a6a5e', shade: 0.4, tex: 'craze' + seed, texOp: 0.45 }, o);
  const SK = (o = {}) => SACK(seed, o);
  const IR = (o = {}) => X.IRON(f, o);
  const N = [470, 360], C = [540, 560], Pv = [440, 770];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.24, 0.1), SF = S.at(0.44, 0.06);
  const HC = [500, 214], hA = 0.06, neck0 = S.at(0.1, -0.06);
  const EN = [622, 470], WN = [668, 318];                          // near arm raised: elbow out in front, fist ahead of the face
  const EF = [610, 640], WF = [742, 660];                          // far forearm laid on the brazier's rim; the stump at the end
  const HN = S.at(0.34, 1.0), KN = [560, 1060], AN = [586, 1300];  // near leg forward, easy
  const HF = S.at(-0.3, 1.0), KF = [410, 1064], AF = [370, 1302];  // far leg back, straight under the weight
  const tA = -0.92, tD = [Math.cos(tA), Math.sin(tA)];             // the tongs run on from the forearm, up and forward
  const BZ = [836, 668];                                           // the brazier: the bowl's rim centre
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const jaws = add(WN, mul(tD, 300));
  f.joint('tongs', WN, 'hand_n').joint('iron', jaws, 'tongs').joint('apron', S.at(0.3, 0.8), 'pelvis').joint('hood', S.at(-0.5, 0.0), 'torso').joint('tools', S.at(0.2, 0.86), 'pelvis');

  // ---- the hood, scorched, hanging down his back behind everything
  f.bone('hood');
  { const h0 = S.at(-0.5, -0.02); const hood = [add(h0, [60, -10]), add(h0, [-30, -20]), add(h0, [-90, 40]), add(h0, [-96, 140]), add(h0, [-60, 220]), ...X.charHem(f, add(h0, [-50, 230]), add(h0, [40, 200]), 4, 16, [0.3, 1]), add(h0, [60, 120])]; f.part(hood, LTH({ fill: '#3a302c', maxShade: 16 })); X.clipDraw(f, E.smooth(hood), () => { X.folds(f, [add(h0, [-60, 30]), add(h0, [-20, 20]), add(h0, [20, 30])], 160, 3, '#0e0a0a', '#6a5a50'); X.stains(f, E.smooth(hood), E.bbox(hood).map((v, i) => v + (i < 2 ? -10 : 10)), P.charS, 0.04, 2.6, -1.2, 71, 0.8); }); }
  // ---- the bucket of water, never used, on the floor beyond the brazier
  f.bone('root');
  { const bc = [990, gy], w = 96, h = 110; const body = [[bc[0] - w / 2, bc[1] - h], [bc[0] + w / 2, bc[1] - h], [bc[0] + w / 2 - 8, bc[1], 1], [bc[0] - w / 2 + 8, bc[1], 1]]; f.part(body, LTH({ maxShade: 16 })); X.clipDraw(f, E.smooth(body), () => { for (const y of [0.25, 0.7]) f.line([[bc[0] - w / 2, bc[1] - h + h * y], [bc[0] + w / 2, bc[1] - h + h * y]], 6, '#1e1614'); f.stitches([[bc[0] - 4, bc[1] - h], [bc[0] - 2, bc[1]]], '#8a7a6a', 1); X.stains(f, E.smooth(body), [bc[0] - w, bc[1] - h - 10, bc[0] + w, bc[1] + 10], P.ashL, 0.05, 2.4, -1.4, 73, 0.4); });
    f.part(ell([bc[0], bc[1] - h], w / 2, 12, 0, 18), LTH({ fill: '#2a2220', cast: false, maxShade: 4 })); f.flat(ell([bc[0] + 2, bc[1] - h + 2], w / 2 - 7, 8, 0, 16), '#7a7a80'); f.line(ell([bc[0] - 8, bc[1] - h + 1], 24, 3, 0, 10).slice(5, 9), 1.2, '#c8c8cc', { op: 0.6 }); X.ashCake(f, [bc[0] + 4, bc[1] - h + 2], 26, 4, 5, 0.6, 0.6); // still water, filmed with ash
    X.rope(f, [[bc[0] - w / 2 + 4, bc[1] - h + 8], [bc[0] - 20, bc[1] - h - 50], [bc[0] + 24, bc[1] - h - 46], [bc[0] + w / 2 - 4, bc[1] - h + 8]], 5, '#5a5048'); }

  // ---- the brazier: an iron bowl on a three-legged stand, irons standing in black coals, black fire
  f.bone('root');
  const bw = 230, bd = 92, leg3 = [[BZ[0] - 104, BZ[1] + 60, BZ[0] - 170, gy], [BZ[0] + 96, BZ[1] + 60, BZ[0] + 160, gy], [BZ[0] - 10, BZ[1] + 80, BZ[0] + 6, gy - 6]];
  for (const [x0, y0, x1, y1] of leg3) { f.part(limb([x0, y0], [x1, y1], 22, 16, { steps: 10 }), IR({ maxShade: 6 })); f.part(ell([x1, y1 - 4], 18, 8, 0, 10), IR({ cast: false, maxShade: 3 })); }
  f.part(limb([BZ[0] - 140, BZ[1] + 300], [BZ[0] + 130, BZ[1] + 300], 12, 12, { steps: 6 }), IR({ maxShade: 3 })); // the stretcher ring
  X.ashHeap(f, [BZ[0], gy], 280, 30);
  // the irons standing in the coals (behind the bowl's front lip), their handles wrapped in rag
  for (const [dx, a, l] of [[-80, -1.9, 300], [-40, -1.7, 340], [10, -1.45, 320], [60, -1.25, 300], [100, -1.1, 260]]) { const b0 = [BZ[0] + dx, BZ[1] + 10], t = add(b0, [Math.cos(a) * l, Math.sin(a) * l]); f.part(limb(b0, t, 12, 10, { steps: 6 }), IR({ maxShade: 3 })); f.part(limb(lerp(b0, t, 0.62), t, 22, 20, { steps: 5 }), { fill: '#6a645a', shadow: '#22201c', shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.2, cast: false, maxShade: 4 }); for (let k = 0; k < 5; k++) f.line([lp(b0, t, 0.64 + k * 0.07, -11), lp(b0, t, 0.67 + k * 0.07, 11)], 1.2, '#2a2620', { op: 0.7 }); }
  // the black fire on the coals
  X.flameSheet(f, [[BZ[0] - bw / 2 + 20, BZ[1] + 4], [BZ[0], BZ[1] - 2], [BZ[0] + bw / 2 - 20, BZ[1] + 4]], [[BZ[0] - 80, 120, 46, -0.1], [BZ[0] - 20, 190, 56, 0.0], [BZ[0] + 40, 150, 50, 0.08], [BZ[0] + 90, 100, 40, 0.15]], { edgeW: 2.2 });
  // the bowl (drawn over the coals' foot): wrought iron, riveted, a thick rolled rim, heat-blackened and flaking
  const bowl = [[BZ[0] - bw / 2, BZ[1]], [BZ[0] + bw / 2, BZ[1]], [BZ[0] + bw / 2 - 18, BZ[1] + bd * 0.6], [BZ[0] + 40, BZ[1] + bd], [BZ[0] - 40, BZ[1] + bd], [BZ[0] - bw / 2 + 18, BZ[1] + bd * 0.6]];
  f.part(bowl, IR({ maxShade: 26 }));
  X.clipDraw(f, E.smooth(bowl), () => { X.heatBloom(f, [BZ[0], BZ[1] + 30], 80, 30); X.rivetRow(f, [[BZ[0] - bw / 2 + 12, BZ[1] + 22], [BZ[0], BZ[1] + 26], [BZ[0] + bw / 2 - 12, BZ[1] + 22]], 34, 4.5, { popped: 0.2 }); X.plateSeam(f, [[BZ[0] - 30, BZ[1] + 8], [BZ[0] - 26, BZ[1] + 90]], { t: 3 }); X.scale(f, [BZ[0] + 20, BZ[1] + 50], 80, 24, 10, 0.8); X.seam(f, [[BZ[0] + 50, BZ[1] + 20], [BZ[0] + 60, BZ[1] + 50], [BZ[0] + 52, BZ[1] + 80]], 1.8); });
  f.part(limb([BZ[0] - bw / 2 - 6, BZ[1]], [BZ[0] + bw / 2 + 6, BZ[1]], 20, 20, { steps: 8 }), IR({ fill: '#4a484c', light: '#8a868e', maxShade: 5 })); // the rolled rim
  for (const x of [-1, 1]) { const rc = [BZ[0] + x * (bw / 2 + 12), BZ[1] + 16]; f.line(ell(rc, 12, 16, 0, 10).concat([ell(rc, 12, 16, 0, 10)[0]]), 5, P.iron); } // carrying rings

  // ---- far arm: bare, the shirt's torn shoulder, the forearm laid along the brazier's rim; the hand gone at the wrist
  X.muscleArm(f, SF, EF, WF, 116, 92, SKP({ fill: mix(skin, '#000', 0.2) }), '_f', { vein: true });
  f.bone('upperarm_f'); f.part(K.ragLimb(f, lerp(SF, EF, -0.12), lerp(SF, EF, 0.34), 136, 128, { depth: 12, teeth: 5 }), SK({ fill: mix(P.sack, '#000', 0.25), maxShade: 14 }));
  f.bone('forearm_f');
  X.seam(f, [lp(EF, WF, 0.12, 20), lp(EF, WF, 0.4, 28), lp(EF, WF, 0.7, 20)], 3); X.seam(f, [lp(EF, WF, 0.3, -10), lp(EF, WF, 0.6, -18)], 2.2);
  X.ash(f, lp(EF, WF, 0.5, 30), 8, 30, 90, 1);
  f.bone('hand_f');
  // the stump: the wrist ends in a clean round cut, rimmed pale, the dark inside (void), resting on the rim
  { const d = E.norm(sub(WF, EF)), c = add(WF, mul(d, -4)); f.part(ell(c, 12, 38, ang(EF, WF), 22), { fill: P.ashW, shade: 0.1, inkW: 1.3, inkHeavy: 1.4, cast: false, hatch: false }); f.flat(ell(c, 9, 34, ang(EF, WF), 22), '#040306'); f.flat(ell(add(c, [1, 2]), 4, 14, ang(EF, WF), 12), P.vioS, { op: 0.9 }); }

  // ---- far leg (back, straight, carrying him): breeches to the knee, the bare shin scarred, a leather-wrapped boot
  const leg = (Hp, Kn, A, sfx, tone) => {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 170, 112, { steps: 10, p: [[0.4, 0.12, 0.2]], q: [[0.45, 0.08, 0.2]] }), SK({ fill: mix('#5a564e', '#000', tone), maxShade: 24 }));
    f.bone('shin' + sfx);
    const shin = limb(Kn, lerp(Kn, A, 0.9), 104, 64, { steps: 10, q: [[0.3, 0.22, 0.18]] });
    f.part(shin, SKP({ fill: mix(skin, '#000', tone), maxShade: 16 }));
    X.clipDraw(f, E.smooth(shin), () => { // old burn scars: shiny pale welts and dark puckers over the shin
      for (let i = 0; i < 5; i++) { const q = lp(Kn, A, R(f, 0.15, 0.6), R(f, -24, 30)); f.flat(ell(q, R(f, 8, 16), R(f, 5, 10), R(f, -0.5, 0.5), 9), mix(skin, '#e8dcd0', 0.4), { op: 0.7 }); f.line(ell(q, R(f, 6, 12), R(f, 3, 6), 0.2, 8).slice(0, 5), 1.2, '#3a2a2a', { op: 0.6 }); }
      X.ashCake(f, lerp(Kn, A, 0.7), 20, 30, 4, 1);
    });
    f.part(K.ragLimb(f, lerp(Hp, Kn, 0.6), lerp(Hp, Kn, 1.06), 140, 116, { depth: 10, teeth: 4 }), SK({ fill: mix('#5a564e', '#000', tone), maxShade: 14 }));
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => { B.boot(f, A, 1, 96, mix('#3a302c', '#000', tone), { shaft: 0.5, tex: 'craze' + seed, toe: 1.12 }); X.wraps(f, add(A, [0, -60]), add(A, [6, 20]), 100, 104, 4, mix('#5a4a40', '#000', tone)); f.line([add(A, [-48, -50]), add(A, [-60, -10])], 3, '#2a201c'); }, [['shin' + sfx, side(A, mul(da, -1), 30)], ['foot' + sfx, side(A, da, 30)]]);
  };
  leg(HF, KF, AF, '_f', 0.25);
  // ---- torso: barrel chest, belly forward, the shirt with its sleeves torn off
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.5, 0.46], [0.08, 0.86, 0.64], [0.26, 0.96, 0.8], [0.44, 0.84, 0.94], [0.62, 0.7, 1.1], [0.78, 0.66, 1.16], [0.92, 0.72, 1.06], [1.04, 0.8, 0.9]]);
  f.part(torso, SK({ maxShade: 34 }));
  X.clipDraw(f, E.smooth(torso), () => { X.softTone(f, E.smooth(torso), [[[S.at(-1, 0), S.at(-0.4, 0), S.at(-0.4, 1), S.at(-1, 1)], '#000', 0.35, 14]]); X.folds(f, [S.at(-0.4, 0.2), S.at(-0.1, 0.3), S.at(0.3, 0.2)], 160, 3.4, '#24211d', P.sackL); X.stains(f, E.smooth(torso), E.bbox(torso), P.charS, 0.03, 2.6, -1.4, 75, 0.5); });
  f.part(K.ragLimb(f, lerp(SN, EN, -0.14), lerp(SN, EN, 0.32), 150, 140, { depth: 12, teeth: 5 }), SK({ maxShade: 14 })); // the near torn shoulder (on the torso: it does not swing)
  // ---- near leg
  leg(HN, KN, AN, '_n', 0);
  // ---- the leather apron, scorched stiff: a bib on the chest, a long skirt to mid-shin standing out over the belly
  f.bone('torso');
  const bib = [S.at(0.3, 0.12), S.at(0.8, 0.14), S.at(0.98, 0.44), S.at(1.18, 0.7), S.at(1.12, 0.84), S.at(0.3, 0.84)];
  f.part(bib, LTH({ maxShade: 22 }));
  X.clipDraw(f, E.smooth(bib), () => { X.softTone(f, E.smooth(bib), [[[S.at(0.3, 0.1), S.at(0.5, 0.1), S.at(0.5, 0.9), S.at(0.3, 0.9)], '#000', 0.3, 10]]); X.stains(f, E.smooth(bib), E.bbox(bib).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 3, -1.3, 77, 0.8); X.burnHole(f, S.at(0.8, 0.5), 9, 0.3); X.crackNet(f, S.at(0.7, 0.3), 1.3, 60, 1.6, { depth: 1 }); });
  f.line([S.at(0.36, 0.12), add(neck0, [10, -30]), S.at(0.8, 0.12)], 6, '#2a201c'); // the neck strap
  // the key on its thong round his neck, lying on the bib
  { const k0 = S.at(0.7, 0.3); f.line([add(neck0, [14, -20]), lerp(add(neck0, [14, -20]), k0, 0.5), k0], 1.6, '#2a201c'); f.part(X.ribbon([k0, add(k0, [6, 56])], [7, 7]), IR({ maxShade: 3, cast: false })); f.part(ell(k0, 11, 11, 0, 12), IR({ maxShade: 3, cast: false })); f.flat(ell(k0, 5, 5, 0, 8), '#2a2224'); f.part([add(k0, [6, 40]), add(k0, [20, 40]), add(k0, [20, 52]), add(k0, [6, 52])].map(q => [...q, 1]), IR({ maxShade: 3, cast: false })); }
  f.bone('apron');
  const aHem = X.charHem(f, [480, 1180], [760, 1160], 9, 20, [0.1, 1]);
  const apron = [S.at(0.26, 0.8), S.at(1.1, 0.8), [760, 900], [780, 1050], ...aHem.slice().reverse(), [470, 1040], [470, 900]];
  f.part(apron, LTH({ maxShade: 30 }));
  X.clipDraw(f, E.smooth(apron), () => {
    X.softTone(f, E.smooth(apron), [[[[460, 860], [540, 860], [530, 1190], [460, 1190]], '#000', 0.4, 14], [[[680, 860], [740, 860], [770, 1150], [700, 1150]], '#fff', 0.12, 10]]);
    for (const q of [[[560, 880], [570, 1000], [584, 1160]], [[640, 880], [660, 1020], [680, 1160]], [[520, 900], [516, 1040], [512, 1170]]]) X.crease(f, q, 4, { col: '#0e0a0a', lit: '#8a7a6e' }); // stiff, broad folds
    X.stains(f, E.smooth(apron), [440, 820, 800, 1200], P.charS, 0.025, 3, -1.25, 79, 0.9);
    for (let i = 0; i < 4; i++) X.burnHole(f, [R(f, 520, 720), R(f, 940, 1140)], R(f, 5, 9), 0.4);
    X.seam(f, [[600, 980], [620, 1040], [612, 1100]], 1.8);
  });
  X.charEdge(f, aHem, 7, { gap: 6 });
  // ---- the belt and its tools: pincers, a thumbscrew, a knotted cord, a small hammer
  f.bone('tools');
  f.part(X.ribbon([S.at(-0.84, 0.82), S.at(0.2, 0.86), S.at(1.0, 0.8)], [26, 26, 26]), LTH({ fill: '#2e2420', maxShade: 4 }));
  f.part([S.at(0.5, 0.8), S.at(0.62, 0.8), S.at(0.62, 0.88), S.at(0.5, 0.88)].map(q => [...q, 1]), IR({ maxShade: 3, cast: false })); // the buckle
  { const p0 = S.at(-0.4, 0.86); f.part(limb(p0, add(p0, [-14, 150]), 12, 9, { steps: 5 }), IR({ maxShade: 3 })); f.part(limb(add(p0, [6, 0]), add(p0, [18, 148]), 12, 9, { steps: 5 }), IR({ maxShade: 3 })); f.part([add(p0, [-26, 150]), add(p0, [-6, 146]), add(p0, [-2, 176]), add(p0, [-14, 182])], IR({ maxShade: 3, cast: false })); f.part([add(p0, [10, 146]), add(p0, [28, 150]), add(p0, [24, 180]), add(p0, [12, 176])], IR({ maxShade: 3, cast: false })); f.rivet(add(p0, [2, 18]), 4, P.ironL); } // pincers
  { const t0 = S.at(-0.1, 0.9); f.line([S.at(-0.1, 0.86), t0], 2, '#2a201c'); f.part([add(t0, [-22, 0]), add(t0, [22, 0]), add(t0, [22, 14]), add(t0, [-22, 14])].map(q => [...q, 1]), IR({ maxShade: 3, cast: false })); f.part([add(t0, [-22, 30]), add(t0, [22, 30]), add(t0, [22, 42]), add(t0, [-22, 42])].map(q => [...q, 1]), IR({ maxShade: 3, cast: false })); f.line([add(t0, [0, -10]), add(t0, [0, 50])], 4, P.ironL); f.part(limb(add(t0, [-16, -12]), add(t0, [16, -12]), 7, 7, { steps: 3 }), IR({ cast: false })); } // thumbscrew
  X.rope(f, [S.at(0.1, 0.86), add(S.at(0.1, 0.86), [-6, 70]), add(S.at(0.1, 0.86), [4, 130])], 4, '#5a5048', { fray: true }); for (const t of [40, 80, 120]) f.part(ell(add(S.at(0.1, 0.86), [0, t]), 6, 5, 0, 8), { fill: '#6a6054', inkW: 1, cast: false, hatch: false }); // knotted cord
  { const h0 = S.at(-0.7, 0.86); f.part(limb(h0, add(h0, [-6, 140]), 14, 12, { steps: 5 }), LTH({ fill: '#5a4a3e', tex: 'grain' + seed, maxShade: 4 })); f.part([add(h0, [-30, -10]), add(h0, [28, -14]), add(h0, [30, 14]), add(h0, [-30, 16])], IR({ maxShade: 4 })); } // small hammer, head up through a loop

  // ---- head: bald and heavy, the leather skullcap, the burn-shiny jaw, no eyebrows, small patient eyes
  f.bone('head');
  f.part(limb(neck0, add(HC, [-30, 50]), 150, 120, { p: [[0.6, 0.06, 0.3]] }), SKP({ maxShade: 18 }));
  X.crease(f, [add(neck0, [40, -20]), add(neck0, [70, -60]), add(HC, [40, 80])], 2.6, { op: 0.5, lit: skinL }); // the thick neck's cord
  const hd = B.head(f, HC, H, hA, { skin, jaw: 1.22, chin: 0.03, nose: 1.06, hook: 0.1, mouth: 'set', squint: 0.72, browDown: 0.0, browW: 0.0001, age: true, faceShade: 0.82, faceHatch: false, jawShade: 0.55, iris: '#2a2224', browCol: skin });
  X.greyFace(f, hd, skin, 1.06);
  f.flat(hd([[0.06, 0.16], [0.24, 0.2], [0.33, 0.36], [0.28, 0.5], [0.08, 0.5], [-0.12, 0.36]]), '#d8ccc0', { op: 0.25 }); // the burn-shiny jaw
  f.line(hd([[0.0, 0.3], [0.14, 0.44], [0.28, 0.46]]), 2.4, '#efe6dc', { op: 0.4 });
  f.line(hd([[0.2, 0.33], [0.3, 0.33]]), 1.2, '#3a2a2a', { op: 0.5 }); // the bored, slack lower lip
  const cap = hd([[-0.42, -0.08], [-0.42, -0.34], [-0.24, -0.54], [0.04, -0.6], [0.24, -0.5], [0.3, -0.38], [0.04, -0.34], [-0.24, -0.24], [-0.36, -0.02]]);
  f.part(cap, LTH({ maxShade: 10 })); f.stitches(hd([[-0.36, -0.2], [-0.06, -0.48], [0.22, -0.46]]), '#8a7a6a', 1); f.line(hd([[-0.4, -0.06], [-0.2, -0.26], [0.04, -0.34], [0.3, -0.38]]), 3, '#1a1210');
  X.soot(f, hd([[0.1, 0.0]])[0], 14, 10, 0.3, hA);

  // ---- near arm: raised, bare, the forearm split along the muscle into violet-lipped seams; the tongs in the fist
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.92), 124, 100, SKP(), '_n', { vein: true });
  f.bone('upperarm_n'); X.ashCake(f, lerp(SN, EN, 0.5), 24, 30, 5, 1);
  // the upper arm's muscle, not a tube: the deltoid's edge, the groove between biceps and triceps, a lit biceps belly
  X.clipDraw(f, E.smooth(limb(SN, EN, 124, 100)), () => { X.softTone(f, E.smooth(limb(SN, EN, 124, 100)), [[ell(lp(SN, EN, 0.55, -18), 70, 26, ang(SN, EN), 12), skinL, 0.3, 10], [ell(lp(SN, EN, 0.5, 36), 80, 20, ang(SN, EN), 12), '#000', 0.3, 10]]); X.crease(f, [lp(SN, EN, 0.25, -50), lp(SN, EN, 0.35, -10), lp(SN, EN, 0.45, 30)], 3.4, { col: '#1a1416', lit: skinL, op: 0.55 }); X.crease(f, [lp(SN, EN, 0.4, 14), lp(SN, EN, 0.65, 10), lp(SN, EN, 0.9, 4)], 3, { col: '#1a1416', lit: skinL, op: 0.5 }); f.line([lp(SN, EN, 0.45, -30), lp(SN, EN, 0.6, -36), lp(SN, EN, 0.8, -30)], 1.6, mix(skin, '#3e4a44', 0.4), { op: 0.5 }); });
  f.bone('forearm_n');
  X.seam(f, [lp(EN, WN, 0.1, -24), lp(EN, WN, 0.4, -32), lp(EN, WN, 0.72, -24)], 3.2); X.seam(f, [lp(EN, WN, 0.2, 10), lp(EN, WN, 0.5, 4), lp(EN, WN, 0.8, 10)], 2.4); X.seam(f, [lp(EN, WN, 0.3, -6), lp(EN, WN, 0.5, -14)], 1.6);
  X.ash(f, lp(EN, WN, 0.5, -40), 10, 40, 110, 1.1);
  // the tongs: two long iron reins through the fist, a pivot rivet, curved jaws closed on the iron
  f.bone('tongs');
  const tB = add(WN, mul(tD, -60)), piv = add(WN, mul(tD, 230)), tn = [-tD[1], tD[0]];
  for (const s2 of [-1, 1]) { f.part(limb(add(tB, mul(tn, s2 * 6)), add(piv, mul(tn, s2 * 4)), 12, 11, { steps: 8 }), IR({ maxShade: 3 })); f.part(X.ribbon([add(piv, mul(tn, s2 * 4)), add(add(piv, mul(tD, 40)), mul(tn, s2 * 14)), add(jaws, mul(tn, s2 * 8))], [12, 11, 10]), IR({ maxShade: 3, cast: false })); }
  f.rivet(piv, 6, P.ironL);
  f.bone('iron');
  { const iA = tA + 1.6, iD = [Math.cos(iA), Math.sin(iA)], i0 = add(jaws, mul(iD, -60)), i1 = add(jaws, mul(iD, 120)); f.part(limb(i0, i1, 14, 12, { steps: 8 }), IR({ fill: '#2a282c', maxShade: 3 })); f.part(limb(add(i1, mul(iD, -10)), add(i1, mul(iD, 26)), 34, 30, { steps: 4 }), IR({ fill: '#1a181c', maxShade: 4 })); X.blackFlame(f, add(i1, mul(iD, 12)), 120, 40, { lean: -0.1, edgeW: 2.2 }); X.heatBloom(f, i1, 40, 30); }
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, tA, 40, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, inline: true, name: 'questioner tongs' });
  X.fistDetail(f, gN, 40, skin, { nail: '#4a4044' });
  X.seam(f, gN.F([[0.3, -0.5], [0.38, 0.0], [0.32, 0.5]]), 1.6);

  return f;
}

// ------------------------------------------------------------------ THE BELLOWS SISTER (elite 1.9)
// The lay sister who kept the pyre's fire fed: nine hundred years at the bellows. Big-boned and stooped forward, weight
// low in the hips, feet wide, working a pair of bellows as long as she is tall, braced against her hip with a hand on each
// handle, the iron nozzle aimed at the party. The bellows seen from the side: two oak boards hinged at the nozzle block,
// the pleated leather sides between them patched many times and nailed with studs, the top board's face showing a little
// (we look down on it). A broad woman with forearms like hams; fire has crazed the skin of her face and hands into a net
// of violet-edged seams; her hands charred black to the wrists where they grip the handles; ash lifting from her
// shoulders. A clean round hole passes through her side (cut through) and the bellows' draught blows ash through it.
// Dress: a lay sister's grey habit kilted up through the belt, sleeves pinned back to the shoulder; a leather apron
// scorched through; a wimple charred down to its band, the veil long burned off; iron pattens; a poker and fire-iron at
// her belt; a bundle of tinder tied at her hip; a sack of charcoal slung on her back; a rosary of charred beads wound
// round one wrist; a burn scar across one cheek older than the rest. A broad, square face, eyebrows burned off, lips
// pursed as if to blow, eyes narrowed against the heat.
// Rig: standard humanoid + bellows (parent root: braced on the floor line through her hip; the hands follow it with IK) >
// bellows_top (the top board, pivot at the nozzle hinge) + skirt (pelvis) + sack (torso) + apron (pelvis).
// Motion: idle a slow pump (bellows_top lifts and closes) puffing ash from the nozzle; attack a hard pump, black fire
// roaring from the nozzle (an engine effect).
function bellowsSister() {
  const CW = 1600, CH = 1400, seed = 1323;
  const f = new Fig(X.base(seed, CH, { grimeY: 1150 })); X.textures(f);
  const H = 186, gy = f.o.groundY; // 1370
  const skin = '#8a7e78', skinS = '#30242a', skinL = '#b4a89c', charH = '#2e2628';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const HAB = (o = {}) => Object.assign({ fill: '#76736e', shadow: '#22201f', light: '#a29e96', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, o);
  const LTH = (o = {}) => Object.assign({ fill: '#4a3e38', shadow: '#140f0e', light: '#7a6a5e', shade: 0.4, tex: 'craze' + seed, texOp: 0.45 }, o);
  const OAK = (o = {}) => Object.assign({ fill: '#3e3430', shadow: '#110d0c', light: '#6e605a', shade: 0.38, tex: 'grain' + seed, texOp: 0.6 }, o);
  const N = [520, 560], C = [420, 640], Pv = [410, 860];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.16, 0.1), SF = S.at(0.42, 0.04);
  const HC = [604, 488], hA = 0.12, neck0 = S.at(0.16, -0.06);
  // the bellows (side view): back end at x 660, hinge block at the nozzle end, the nozzle aimed at the party
  const BT0 = [672, 700], BT1 = [1380, 872], BB0 = [672, 964], BB1 = [1380, 928], NZ = [1586, 912];
  const WN = [628, 694], EN = [574, 590];                          // near hand on the top handle, pressing down: the elbow up and out toward us (foreshortened)
  const WF = [630, 962], EF = [520, 800];                          // far hand on the bottom handle, behind the board
  const HN = S.at(0.3, 1.0), KN = [600, 1100], AN = [640, 1300];   // feet wide, knees bent, weight low
  const HF = S.at(-0.36, 1.0), KF = [300, 1100], AF = [210, 1300];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('bellows', lerp(BB0, BB1, 0.02)).joint('bellows_top', lerp(BT1, BB1, 0.4), 'bellows').joint('skirt', S.at(0, 0.84), 'pelvis').joint('sack', S.at(-0.6, 0.2), 'torso').joint('apron', S.at(0.3, 0.84), 'pelvis');
  const patY = 26; // the pattens lift her shoes off the floor

  // ---- the sack of charcoal slung on her back (behind)
  f.bone('sack');
  { const c = S.at(-0.9, 0.2); const sk = [add(c, [40, -110]), add(c, [-20, -126]), add(c, [-80, -84]), add(c, [-104, 10]), add(c, [-90, 96]), add(c, [-30, 126]), add(c, [40, 96]), add(c, [56, 0])]; f.part(sk, Object.assign(SACK(seed, { fill: '#56524c', light: '#8a867e', maxShade: 22 }))); X.clipDraw(f, E.smooth(sk), () => { for (let i = 0; i < 9; i++) { const q = add(X.scatter(f, add(c, [-10, 30]), 60, 70), [0, 0]); X.crease(f, [add(q, [-16, -10]), add(q, [0, 4]), add(q, [16, -8])], 4, { col: '#141210', lit: '#8a867e', op: 0.45 }); } X.folds(f, [add(c, [-60, -120]), add(c, [0, -140]), add(c, [-90, -40])], 160, 3, '#0e0c0a', '#6a6660'); X.stains(f, E.smooth(sk), E.bbox(sk), '#0a0808', 0.04, 2.6, -1.2, 81, 0.7); X.burnHole(f, add(c, [-60, 60]), 12, 0.3); });
    X.rope(f, [add(c, [30, -150]), add(c, [10, -190]), add(c, [-20, -170])], 7, '#5a5048'); for (let i = 0; i < 5; i++) f.part(ell(add(c, [-4 + i * 14, -150 + (i % 2) * 6]), 11, 8, f.r() * 3, 8), { fill: '#1e1a1a', shadow: '#050404', light: '#4a4442', shade: 0.4, inkW: 1, cast: false, hatch: false, maxShade: 4 }); } // charcoal at the sack's gathered mouth
  // ---- far arm: bare from the pinned sleeve, the forearm like a ham, down to the bottom handle
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.92), 104, 96, SKP({ fill: mix(skin, '#000', 0.22) }), '_f', { vein: false });
  f.bone('upperarm_f'); f.part(K.ragLimb(f, lerp(SF, EF, -0.14), lerp(SF, EF, 0.2), 118, 118, { depth: 10, teeth: 5 }), HAB({ fill: mix('#76736e', '#000', 0.25), maxShade: 10 }));
  f.bone('forearm_f'); X.stains(f, E.smooth(limb(EF, WF, 100, 80)), E.bbox([EF, WF]).map((v, i) => v + (i < 2 ? -60 : 60)), P.charS, 0.03, 3, -1.1, 83, 0.0);
  // ---- far leg: hose, a shoe on an iron patten
  const leg = (Hp, Kn, A, sfx, tone) => {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 160, 112, { steps: 10, p: [[0.4, 0.14, 0.2]] }), HAB({ fill: mix('#5a5652', '#000', tone), maxShade: 20 }));
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.94), 108, 66, { steps: 10, q: [[0.3, 0.22, 0.18]] }), HAB({ fill: mix('#4e4a46', '#000', tone), tex: 'weave' + seed, maxShade: 14 }));
    X.wraps(f, lerp(Kn, A, 0.55), lerp(Kn, A, 0.95), 84, 68, 4, mix('#6a645a', '#000', tone));
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => {
      B.boot(f, A, 1, 82, mix('#3a302c', '#000', tone), { shaft: 0.25, tex: 'craze' + seed, toe: 1.1, style: 'shoe', groundY: gy - patY });
      // the patten: an iron ring under the sole on two iron stilts, a wooden sole-plate strapped on
      f.part([[A[0] - 40, gy - patY - 4], [A[0] + 112, gy - patY - 4], [A[0] + 112, gy - patY + 6], [A[0] - 40, gy - patY + 6]].map(q => [...q, 1]), OAK({ fill: mix('#2e2624', '#000', tone), cast: false, maxShade: 3 }));
      for (const x of [A[0] - 4, A[0] + 74]) f.part([[x - 6, gy - patY + 4], [x + 6, gy - patY + 4], [x + 4, gy - 10], [x - 4, gy - 10]].map(q => [...q, 1]), X.IRON(f, { cast: false, maxShade: 2 }));
      f.part(X.ribbon([[A[0] - 20, gy - 6], [A[0] + 36, gy - 2], [A[0] + 94, gy - 6]], [10, 9, 10]), X.IRON(f, { cast: false, maxShade: 2 }));
    }, [['shin' + sfx, side(A, mul(da, -1), 26)], ['foot' + sfx, side(A, da, 26)]]);
  };
  leg(HF, KF, AF, '_f', 0.25);
  // ---- torso: broad, stooped; the habit; a clean round hole through her side, cut through, ash blowing through it
  f.bone('torso');
  const hole = [S.at(-0.5, 0.62), 32];
  const torso = S.shape([[-0.1, 0.5, 0.5], [0.1, 0.86, 0.7], [0.3, 0.94, 0.9], [0.5, 0.86, 0.9], [0.7, 0.8, 0.84], [0.88, 0.86, 0.86], [1.04, 0.9, 0.86]]);
  X.cutHoles(f, [hole], () => {
    f.part(torso, HAB({ maxShade: 34 }));
    X.clipDraw(f, E.smooth(torso), () => { X.softTone(f, E.smooth(torso), [[[S.at(-1, 0), S.at(-0.4, 0), S.at(-0.4, 1), S.at(-1, 1)], '#000', 0.35, 14]]); X.folds(f, [S.at(-0.4, 0.2), S.at(0.0, 0.3), S.at(0.4, 0.24), S.at(-0.6, 0.5), S.at(-0.7, 0.1), S.at(-0.2, 0.06)], 150, 3.2, '#1a1818', '#b0aca4'); X.ashCake(f, S.at(-0.4, 0.1), 60, 30, 10, 1.1); X.burnHole(f, S.at(-0.7, 0.3), 10, 0.3); X.softTone(f, E.smooth(torso), [[[S.at(-0.9, -0.05), S.at(0.2, -0.05), S.at(0.2, 0.25), S.at(-0.9, 0.3)], '#c4c0b8', 0.22, 20]]); for (const [a, b, c2] of [[[-0.5, 0.05], [-0.62, 0.4], [-0.66, 0.8]], [[-0.2, 0.1], [-0.3, 0.45], [-0.3, 0.82]], [[-0.8, 0.15], [-0.86, 0.45], [-0.9, 0.75]], [[0.1, 0.2], [0.05, 0.5], [0.1, 0.82]]]) X.crease(f, [S.at(...a), S.at(...b), S.at(...c2)], 7, { col: '#1a1818', lit: '#b0aca4', op: 0.65 }); X.stains(f, E.smooth(torso), E.bbox(torso), P.charS, 0.03, 2.6, -1.4, 85, 0.5); });
  }, { shape: E.smooth(torso) });
  // ash blown through the hole by the draught, streaming back
  for (let i = 0; i < 12; i++) { const q = add(hole[0], [-R(f, 0, 140), R(f, -26, 26)]); f.flat(ell(q, R(f, 2, 5), R(f, 1.2, 2.6), R(f, -0.3, 0.3), 6), f.r() < 0.5 ? P.ashL : '#2a2426', { op: 0.8 }); }
  X.ash(f, S.at(-0.4, 0.04), 14, 120, 160, 1.2); X.ash(f, S.at(0.3, 0.0), 8, 60, 120, 1);
  // ---- near leg
  leg(HN, KN, AN, '_n', 0);
  // ---- the habit kilted up through the belt: the skirt hitched to the knee, bunched over the belt
  f.bone('skirt');
  const hem = X.charHem(f, [250, 1100], [690, 1080], 12, 22, [0, 1]);
  const sk = [S.at(-0.96, 0.8), S.at(0.96, 0.8), [700, 960], [720, 1040], ...hem.slice().reverse(), [240, 1040], [260, 960]];
  f.part(sk, HAB({ maxShade: 30 }));
  X.clipDraw(f, E.smooth(sk), () => { X.softTone(f, E.smooth(sk), [[[[230, 900], [320, 900], [300, 1110], [230, 1110]], '#000', 0.4, 12]]); X.folds(f, [[310, 890], [380, 900], [450, 910], [520, 900], [600, 900], [660, 910]], 170, 3.6, '#1a1818', '#b0aca4'); for (const q of [[[300, 880], [380, 860], [470, 880]], [[480, 880], [560, 862], [660, 884]]]) X.crease(f, q, 3.4, { col: '#1a1818', lit: '#b0aca4' }); X.stains(f, E.smooth(sk), [220, 820, 740, 1120], P.charS, 0.03, 2.8, -1.4, 87, 0.8); f.part([[360, 960], [420, 954], [424, 1010], [362, 1016]].map(q => [...q, 1]), HAB({ fill: '#6a665e', inkW: 1.1, cast: false, maxShade: 4 })); f.stitches([[360, 960], [420, 954], [424, 1010], [362, 1016], [360, 960]], '#c0bab0', 1); });
  X.charEdge(f, hem, 7, { gap: 6 });
  // ---- the apron, scorched through
  f.bone('apron');
  { const ap = [S.at(0.2, 0.74), S.at(0.98, 0.74), [700, 1000], ...X.charHem(f, [706, 1040], [480, 1060], 7, 20, [0, 1]), [470, 960]]; f.part(ap, LTH({ maxShade: 20 })); X.clipDraw(f, E.smooth(ap), () => { X.stains(f, E.smooth(ap), E.bbox(ap).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 3, -1.25, 89, 0.9); for (let i = 0; i < 4; i++) X.burnHole(f, [R(f, 500, 680), R(f, 900, 1020)], R(f, 8, 14), 0.4); X.folds(f, [[520, 880], [600, 880], [660, 890]], 140, 3, '#0e0a0a', '#8a7a6e'); }); X.charEdge(f, ap.slice(3, ap.length - 1), 5); }
  // belt, the poker and fire-iron, the bundle of tinder
  f.bone('pelvis');
  f.part(X.ribbon([S.at(-0.96, 0.8), S.at(0.0, 0.84), S.at(0.96, 0.8)], [26, 26, 26]), LTH({ fill: '#2e2420', maxShade: 4 }));
  { const p0 = S.at(-0.6, 0.82); f.part(limb(add(p0, [10, -40]), add(p0, [-70, 300]), 14, 11, { steps: 8 }), X.IRON(f, { maxShade: 3 })); f.part(ell(add(p0, [12, -46]), 14, 12, 0, 10), X.IRON(f, { cast: false })); f.part(limb(add(p0, [40, -30]), add(p0, [-10, 280]), 12, 10, { steps: 8 }), X.IRON(f, { maxShade: 3, fill: '#2e2c30' })); f.part([add(p0, [-20, 270]), add(p0, [10, 274]), add(p0, [6, 300]), add(p0, [-24, 296])], X.IRON(f, { cast: false })); }
  { const t0 = S.at(-0.2, 0.92); for (let i = 0; i < 14; i++) f.line([add(t0, [R(f, -20, 20), -10]), add(t0, [R(f, -30, 30), R(f, 70, 110)])], R(f, 2, 3.4), ['#6a5a44', '#4a3e30', '#8a7a5e'][i % 3]); X.rope(f, [add(t0, [-26, 10]), add(t0, [0, 14]), add(t0, [26, 10])], 5, '#4a4038', { lit: false }); X.rope(f, [add(t0, [-24, 60]), add(t0, [0, 64]), add(t0, [26, 60])], 4, '#4a4038', { lit: false }); f.line([S.at(-0.2, 0.84), add(t0, [0, 10])], 2, '#2a201c'); }

  // ---- head: broad, square, crazed with violet seams; the wimple charred down to its band; lips pursed to blow
  f.bone('head');
  f.part(limb(neck0, add(HC, [-24, 44]), 120, 100, { p: [[0.6, 0.06, 0.3]] }), SKP({ maxShade: 14 }));
  const hd = B.head(f, HC, H, hA, { skin, jaw: 1.2, chin: 0.02, nose: 1.0, hook: 0.0, mouth: 'set', squint: 0.8, browDown: 0.0, browW: 0.0001, age: true, faceShade: 0.8, faceHatch: false, jawShade: 0.55, iris: '#2a2224', browCol: skin, hairCol: '#6a6664',
    hair: [[-0.36, 0.0], [-0.38, -0.26], [-0.24, -0.46], [0.02, -0.52], [0.16, -0.46], [-0.06, -0.4], [-0.24, -0.22], [-0.28, 0.02]] });
  X.greyFace(f, hd, skin, 1.0);
  // lips pursed as if to blow: pushed forward into a small round
  f.part(hd([[0.27, 0.256], [0.33, 0.25], [0.345, 0.28], [0.33, 0.314], [0.28, 0.316], [0.26, 0.29]]), SKP({ fill: mix(skin, '#3a2a30', 0.3), inkW: 1.2, inkHeavy: 1.6, cast: false, maxShade: 3 }));
  f.flat(hd(ell([0.334, 0.284], 0.008, 0.013, 0, 8)), '#120a0c');
  f.line(hd([[0.24, 0.2], [0.28, 0.24]]), 1.2, INK, { op: 0.6 }); f.line(hd([[0.24, 0.36], [0.28, 0.33]]), 1.2, INK, { op: 0.6 }); // pucker lines
  // the face crazed into a net of violet-edged seams; the old burn scar across the near cheek
  X.hairline(f, hd([[0.04, -0.3], [0.1, -0.2], [0.06, -0.08], [0.12, 0.02]]), 1.4); X.hairline(f, hd([[0.18, 0.06], [0.12, 0.16], [0.16, 0.3], [0.1, 0.42]]), 1.3); X.hairline(f, hd([[-0.1, 0.1], [-0.02, 0.2], [-0.08, 0.32]]), 1.2); X.hairline(f, hd([[0.22, -0.3], [0.26, -0.2]]), 1.1);
  f.line(hd([[-0.04, 0.06], [0.06, 0.12], [0.18, 0.14]]), 6, mix(skin, '#e8dcd0', 0.45), { op: 0.7 }); f.line(hd([[-0.04, 0.06], [0.06, 0.12], [0.18, 0.14]]), 1.2, '#4a2a28', { op: 0.6 });
  // the wimple, charred down to its band: a linen band round the brow and a scorched rag of it under the jaw
  f.part(X.ribbon(hd([[-0.42, -0.2], [-0.2, -0.4], [0.1, -0.46], [0.3, -0.34]]), [26, 28, 28, 24]), { fill: '#b8b2a6', shadow: '#5a544c', light: '#e0dace', shade: 0.38, tex: 'weave' + seed, texOp: 0.3, inkW: 1.3, cast: false, maxShade: 6 });
  X.charEdge(f, hd([[-0.42, -0.14], [-0.2, -0.33], [0.1, -0.4], [0.28, -0.3]]), 4, { gap: 5 });
  { const rag = [...hd([[-0.3, 0.2], [-0.1, 0.44], [0.12, 0.56]]), ...X.charHem(f, hd([[0.14, 0.62]])[0], hd([[-0.36, 0.5]])[0], 5, 22, rot([0, 1], hA))]; f.part(rag, { fill: '#a8a296', shadow: '#4a443c', light: '#d4cec2', shade: 0.38, tex: 'weave' + seed, texOp: 0.3, inkW: 1.2, cast: false, maxShade: 8 }); X.charEdge(f, rag.slice(3), 4, { gap: 4 }); }

  // ---- the bellows, braced against her hip, aimed at the party
  f.bone('bellows');
  // the bottom board (edge-on), the leather sides, then the top board (its face foreshortened, seen from above)
  const lower = [[BB0[0] - 4, BB0[1] - 20], [BB1[0], BB1[1] - 8], [BB1[0], BB1[1] + 14], [BB0[0] - 4, BB0[1] + 20]];
  f.part(lower.map(q => [...q, 1]), OAK({ maxShade: 10 }));
  f.line([[BB0[0], BB0[1] + 14], [BB1[0], BB1[1] + 10]], 1.6, '#000', { op: 0.6 });
  // the bottom handle (her far hand grips it, behind)
  f.part(limb([BB0[0] - 70, BB0[1] + 6], [BB0[0] + 10, BB0[1]], 36, 36, { steps: 6 }), OAK({ maxShade: 8 }));
  // the leather sides: pleats folding in a wedge, patched, nailed to both boards with studs (on the fixed bellows bone;
  // the leather runs on up under the top board, so lifting the top board shows more leather, never a gap)
  const lth = [[BT0[0], BT0[1] - 50], [BT1[0] - 40, BT1[1] - 4], [BT1[0], BT1[1] + 10], [BB1[0], BB1[1] - 8], [BB0[0], BB0[1] - 18]];
  f.part(lth.map(q => [...q, 1]), LTH({ maxShade: 30 }));
  X.clipDraw(f, E.smooth(lth.map(q => [...q, 1])), () => {
    const np = 7;
    for (let i = 1; i <= np; i++) { const t = i / (np + 1), tt = Math.pow(t, 0.8); const a = lerp(lerp(BT0, BT1, 0), lerp(BB0, BB1, 0), t), b = lerp(BT1, BB1, t); const mid = lerp(lerp(BT0, BB0, t), lerp(BT1, BB1, t), 0.5); const pa = lerp(BT0, BB0, t), pb = lerp(BT1, BB1, t); const k = (i % 2 ? 1 : -1) * 22 * (1 - tt * 0.3); f.stroke([pa, lerp(pa, pb, 0.3), lerp(pa, pb, 0.7), pb].map((q, j) => add(q, [k * (1 - j / 3) * 0.4, 0])), 9, '#0c0808', { op: 0.75 }); f.line([pa, lerp(pa, pb, 0.5), pb].map(q => add(q, [0, -5])), 2.2, '#8a7a6e', { op: 0.45 }); }
    for (const [c, w, h] of [[[880, 830], 90, 60], [[1120, 880], 70, 40], [[760, 860], 60, 70]]) { const pq = [add(c, [-w / 2, -h / 2]), add(c, [w / 2, -h / 2 + 4]), add(c, [w / 2 + 2, h / 2]), add(c, [-w / 2, h / 2 - 2])]; f.part(pq.map(q => [...q, 1]), LTH({ fill: '#5a4a40', inkW: 1.1, cast: false, maxShade: 4 })); f.stitches([...pq, pq[0]], '#9a8a7a', 1); }
    X.stains(f, E.smooth(lth.map(q => [...q, 1])), [650, 680, 1400, 980], P.charS, 0.03, 2.8, -1.3, 91, 0.8);
    X.burnHole(f, [1000, 880], 9, 0.2);
  });
  for (const [a, b] of [[BB0, BB1]]) X.rivetRow(f, [add(a, [6, -22]), add(b, [-10, -12])], 34, 5, { col: '#4a4850' });
  f.bone('bellows_top');
  // the top board: its edge, and its face seen from above as a long pear, nail-studded round the leather's edge
  const topFace = [[BT0[0] - 6, BT0[1] - 2], [BT0[0] + 40, BT0[1] - 60], [BT0[0] + 260, BT0[1] - 40], [BT1[0] - 120, BT1[1] - 26], [BT1[0], BT1[1] - 14], [BT1[0], BT1[1] + 2]];
  f.part(topFace, OAK({ fill: '#4a3e3a', maxShade: 14 }));
  X.clipDraw(f, E.smooth(topFace), () => { X.stains(f, E.smooth(topFace), E.bbox(topFace).map((v, i) => v + (i < 2 ? -10 : 10)), P.charS, 0.03, 3, -1.3, 93, 0.7); f.line([[BT0[0] + 30, BT0[1] - 44], [BT0[0] + 260, BT0[1] - 30], [BT1[0] - 40, BT1[1] - 14]], 2.4, '#8a7c72', { op: 0.45 }); X.seam(f, [[800, 690], [900, 716], [1000, 760]], 1.8); });
  X.rivetRow(f, [[BT0[0] + 30, BT0[1] - 40], [BT0[0] + 250, BT0[1] - 24], [BT1[0] - 30, BT1[1] - 10]], 40, 5, { col: '#4a4850', popped: 0.15 });
  const upper = [[BT0[0] - 4, BT0[1] - 4], [BT1[0], BT1[1] - 8], [BT1[0], BT1[1] + 10], [BT0[0] - 4, BT0[1] + 16]];
  f.part(upper.map(q => [...q, 1]), OAK({ maxShade: 8 }));
  X.rivetRow(f, [add(BT0, [6, 12]), add(BT1, [-10, 8])], 34, 5, { col: '#4a4850' });
  f.part(limb([BT0[0] - 74, BT0[1] - 6], [BT0[0] + 10, BT0[1] + 4], 36, 36, { steps: 6 }), OAK({ maxShade: 8 })); // the top handle
  f.bone('bellows');
  // the hinge block and the iron nozzle, sooted at the mouth
  const blk = [[BT1[0] - 20, BT1[1] - 20], [BT1[0] + 50, BT1[1] - 14], [BB1[0] + 50, BB1[1] + 18], [BB1[0] - 20, BB1[1] + 24]];
  f.part(blk.map(q => [...q, 1]), OAK({ fill: '#2e2624', maxShade: 8 }));
  f.part(X.ribbon([[BT1[0] - 10, BT1[1] - 16], [BB1[0] - 10, BB1[1] + 20]], [12, 12]), X.IRON(f, { cast: false, maxShade: 3 }));
  const nz = [[BT1[0] + 46, BT1[1] + 4], [NZ[0], NZ[1] - 9], [NZ[0] + 4, NZ[1] + 2], [NZ[0], NZ[1] + 10], [BB1[0] + 46, BB1[1] + 2]];
  f.part(nz, X.IRON(f, { maxShade: 10 }));
  X.clipDraw(f, E.smooth(nz), () => { X.heatBloom(f, NZ, 60, 24); X.scale(f, lerp(BT1, NZ, 0.6), 50, 6, 5, 0.6); f.line([[BT1[0] + 60, BT1[1] + 10], [NZ[0] - 10, NZ[1] - 4]], 2, P.ironL, { op: 0.45 }); });
  for (const x of [BT1[0] + 70, BT1[0] + 140]) { const y = lerp([BT1[0] + 46, (BT1[1] + BB1[1]) / 2 + 3], NZ, (x - BT1[0] - 46) / (NZ[0] - BT1[0] - 46))[1]; f.part([[x - 7, y - 22], [x + 7, y - 20], [x + 7, y + 22], [x - 7, y + 20]].map(q => [...q, 1]), X.IRON(f, { cast: false, maxShade: 3 })); }
  f.flat(ell(NZ, 4, 8, 0, 8), '#050405');
  X.sootStreaks(f, add(NZ, [-30, -4]), 4, 60, 20, { lean: -1.6, op: 0.5 });
  X.ash(f, add(NZ, [20, 0]), 10, 60, 90, 1); // ash puffed from the nozzle

  // ---- hands on the handles: charred black to the wrists, crazed; the rosary of charred beads round the near wrist
  f.bone('hand_f');
  { const g = B.grip(f, WF, EF, Math.PI, 40, charH, { shadow: '#0a0708', tex: 'craze' + seed, texOp: 0.6, quiet: true, maxBend: 45 }); X.fistDetail(f, g, 40, '#4a3e40', { nail: '#2a2224' }); }
  // ---- near arm: bare from the pinned sleeve, a ham of a forearm, charred to the wrist, the hand on the top handle
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.92), 112, 104, SKP(), '_n', { vein: true });
  f.bone('upperarm_n'); { const sl = K.ragLimb(f, lerp(SN, EN, -0.16), lerp(SN, EN, 0.2), 124, 126, { depth: 10, teeth: 5 }); f.part(sl, HAB({ maxShade: 10 })); X.clipDraw(f, E.smooth(sl), () => { for (let i = 0; i < 4; i++) X.crease(f, [lp(SN, EN, -0.1 + i * 0.07, 60), lp(SN, EN, -0.06 + i * 0.07, 0), lp(SN, EN, -0.1 + i * 0.07, -60)], 3, { col: '#1a1818', lit: '#b0aca4' }); X.stains(f, E.smooth(sl), E.bbox(sl), P.charS, 0.05, 2.6, -1.3, 97, 0.6); }); }
  X.rope(f, [lp(SN, EN, 0.26, 66), lp(SN, EN, 0.24, 0), lp(SN, EN, 0.26, -66)], 4, '#4a4038', { lit: false }); f.rivet(lp(SN, EN, 0.2, 40), 4, '#8a868e'); // the sleeve pinned back
  f.bone('forearm_n');
  { const fo = limb(EN, WN, 110, 86); X.clipDraw(f, E.smooth(fo), () => { f.flat([lp(EN, WN, 0.55, -80), lp(EN, WN, 0.55, 80), lp(EN, WN, 1.1, 80), lp(EN, WN, 1.1, -80)], charH, { op: 0.85 }); X.stains(f, E.smooth(fo), E.bbox([EN, WN]).map((v, i) => v + (i < 2 ? -60 : 60)), P.charS, 0.03, 3, -1.1, 95, 0.8); }); X.crackNet(f, lp(EN, WN, 0.6, -10), ang(EN, WN), 70, 2, { depth: 2 }); X.crackNet(f, lp(EN, WN, 0.4, 20), ang(EN, WN) + 0.4, 50, 1.6, { depth: 1 }); X.ash(f, lp(EN, WN, 0.5, -30), 8, 40, 100, 1); }
  { const rw = lp(EN, WN, 0.84, 0); for (let k = -3; k <= 3; k++) f.part(ell(add(rw, rot([k * 9, Math.abs(k) * 2 - 30 + (k % 2) * 4], ang(EN, WN) + Math.PI / 2)), 6, 6, 0, 8), { fill: k % 3 ? P.charL : P.char, shadow: P.charS, shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); const tail = [add(rw, [0, 30]), add(rw, [-4, 60]), add(rw, [2, 86])]; tail.forEach(q => f.part(ell(q, 5.4, 5.4, 0, 8), { fill: P.char, shadow: P.charS, shade: 0.4, inkW: 1, cast: false, hatch: false })); }
  f.bone('hand_n');
  { const g = B.grip(f, WN, EN, Math.PI, 42, charH, { shadow: '#0a0708', tex: 'craze' + seed, texOp: 0.6, quiet: true, maxBend: 45 }); X.fistDetail(f, g, 42, '#4a3e40', { nail: '#2a2224' }); X.hairline(f, g.F([[0.3, -0.5], [0.36, 0.0], [0.3, 0.5]]), 1.4); X.hairline(f, g.F([[-0.5, -0.3], [-0.1, 0.0], [0.1, 0.3]]), 1.2); }

  f.bone('root');
  X.ashprint(f, [AF[0] + 60, gy + 4], 1.8); X.ashprint(f, [AN[0] + 70, gy + 4], 1.8);
  X.ashHeap(f, [NZ[0] - 40, gy], 160, 18);
  return f;
}

// ------------------------------------------------------------------ THE FAMILIAR (cast, small 0.6 reared)
// A black nanny goat, the pet of a woman condemned for heresy, tried by the inquisition as her familiar and burned on the
// same pyre. It walked out of the ash first. Reared on its hind legs, forelegs folded, the head tucked down with the
// forehead and the horn bases toward the party, about to butt; weight on the hind hooves; a burnt tether trailing from
// its neck to a stub of charred stake. Rebuilt in the independent review: the body is a goat's (a deep chest and a
// barrel that tucks up into the flank, the spine's line, the hip's point and the haunch), the legs are thin but jointed
// with the thigh and forearm muscled (stifle, hock, knee, fetlock, cloven hooves), and the head is a modelled goat skull
// (flat forehead and the bony brow, the eye set high on the side under it, a straight nasal bone, a narrow muzzle with a
// split lip, the round of the cheek, the jaw's straight floor, the beard hanging from the chin). Value range: the black
// hair has a strong sheen on the planes that face the light (the back, the haunch, the forehead, the shoulder), the hide
// where the hair burned off is ash grey, the horns are ringed grey-brown, the eye and the caked ash are pale, so the
// figure carries light, mid and dark at game size. Fire: hair burned off in patches, the hide split into violet-edged
// seams along the ribs and the haunch; the beard smouldering, ash curling up from it. Void: clean round holes through
// the near ear and the flank (cut through). Gear: a placard of its sentence in red rubric on a cord round the neck, charred
// at the corners; the tether burned through, the stake stub dragging; a leather collar with a little bell (clapper burned
// away); pyre straw caught on the horns; the inquisition's black-flame brand on the haunch; a shrunken, scorched udder;
// horns ringed and flaking; split hooves.
// Rig: spine_1 (root, hips) > spine_2 (chest) > neck > head > jaw; tail (spine_1); legs leg_[f|h][n|f]_1..3; tether
// (neck) > stake (tether); placard (neck). Motion: idle a stamp and a bleat (jaw, a hind hoof); attack a rearing butt
// (spine_2 and neck drive forward and down, horns first).
function familiar() {
  const [CW, CH] = TIERS.small, seed = 1326;
  const f = new Fig(X.base(seed, CH, { grimeY: 700 })); X.textures(f);
  const gy = f.o.groundY; // 790
  const hair = '#38323a', hairL = '#a0969c', bare = '#6a6064', bareL = '#a89ca0';
  const HR = (o = {}) => Object.assign({ fill: hair, shadow: '#0a0709', light: hairL, shade: 0.42, tex: 'fur' + seed, texOp: 0.6, maxShade: 16 }, o);
  const BR = (o = {}) => Object.assign({ fill: bare, shadow: '#1a1216', light: bareL, shade: 0.4, tex: 'craze' + seed, texOp: 0.5, maxShade: 10 }, o);
  const HRN = (o = {}) => Object.assign({ fill: '#6a5e54', shadow: '#1a1410', light: '#b0a490', shade: 0.42, tex: 'grain' + seed, texOp: 0.4, maxShade: 8 }, o);
  // the head frame: u from the poll down the face to the muzzle, v across (+v toward the jaw and the throat)
  const PL = [424, 316], hA = 1.42, HF0 = frame(PL, hA, 1), hp = (u, v) => HF0([[u, v]])[0], HP = pts => pts.map(([u, v, k]) => k ? [...hp(u, v), 1] : hp(u, v));
  const HIP = [290, 566], WTH = [332, 418], CHST = [404, 438];
  const LEG = {
    hf: { A: [284, 586], B: [318, 650], C: [262, 708], D: [288, 768], T: [296, gy], hind: true },
    hn: { A: [300, 596], B: [338, 656], C: [284, 712], D: [308, 770], T: [320, gy], hind: true },
    ff: { A: [372, 452], B: [380, 500], C: [432, 486], D: [404, 530], T: [416, 550] },
    fn: { A: [386, 462], B: [392, 512], C: [446, 504], D: [418, 548], T: [432, 566] },
  };
  f.joint('spine_1', HIP).joint('spine_2', [328, 500], 'spine_1').joint('neck', [370, 420], 'spine_2').joint('head', hp(-4, 18), 'neck').joint('jaw', hp(40, 34), 'head');
  f.joint('tail', [262, 560], 'spine_1').joint('tether', [392, 388], 'neck').joint('stake', [110, gy - 14], 'tether').joint('placard', [392, 388], 'neck');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.A, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.B, `leg_${k}_1`).joint(`leg_${k}_3`, L.C, `leg_${k}_2`);

  // the tether: from the collar down to the floor and back to the stake stub it dragged out of the fire
  f.bone('tether');
  X.rope(f, [[392, 388], [370, 470], [336, 600], [300, 720], [220, gy - 8], [150, gy - 12]], 4, '#6a6058');
  X.charEdge(f, [[300, 720], [250, gy - 6], [190, gy - 10]], 3, { gap: 6 });
  f.bone('stake');
  { const s0 = [44, gy - 10], s1 = [128, gy - 22]; f.part(limb(s0, s1, 26, 24, { steps: 6 }), { fill: '#2a2222', shadow: '#060405', light: '#5a4c48', shade: 0.4, tex: 'craze' + seed, texOp: 0.6, maxShade: 6 }); f.part(ell(s1, 8, 13, ang(s0, s1), 10), { fill: '#7a6a60', shadow: P.charS, shade: 0.4, inkW: 1, cast: false, hatch: false }); f.part([s0, add(s0, [-24, 6]), add(s0, [-4, 12])], { fill: '#141012', inkW: 1, cast: false }); X.rope(f, [add(s1, [-20, -14]), add(s1, [-14, 12])], 4, '#6a6058'); X.charEdge(f, [add(s0, [0, -12]), add(s0, [40, -16])], 3, { gap: 5 }); X.ash(f, s1, 6, 20, 50, 0.8); }

  // a goat's leg in one outline through its joints, cut for the rig; a small cloven hoof at the end
  const leg = (k, far) => {
    const L = LEG[k], fr = !L.hind, tone = far ? 0.4 : 0;
    const look = HR({ fill: mix(hair, '#000', tone), light: mix(hairL, '#000', tone * 1.3) });
    const ws = fr ? [40, 24, 14, 12] : [56, 26, 14, 12];
    const shape = K.chain([L.A, L.B, L.C, L.D], ws, { steps: 9, bp: fr ? [[0, 0.4, 0.2, 0.25], [1, 0.0, 0.2, 0.1], [2, 0.0, 0.2, 0.12]] : [[0, 0.4, 0.22, 0.25], [1, 0.0, 0.42, 0.07], [2, 0.0, 0.2, 0.12]], bq: fr ? [[0, 0.3, 0.16, 0.2], [2, 0.0, 0.18, 0.12]] : [[0, 0.5, 0.16, 0.2], [1, 0.3, 0.14, 0.2], [2, 0.0, 0.16, 0.12]] });
    const d2 = elb(L.A, L.B, L.C), d3 = elb(L.B, L.C, L.D);
    split(f, () => {
      f.part(shape, look);
      X.clipDraw(f, E.smooth(shape), () => {
        X.softTone(f, E.smooth(shape), [[[lp(L.A, L.B, 0, -24), lp(L.A, L.B, 1, -14), lp(L.B, L.C, 1, -8), lp(L.B, L.C, 1, -2), lp(L.A, L.B, 0, -4)], hairL, far ? 0.08 : 0.34, 4]]);
        f.line([lp(L.B, L.C, 0.1, fr ? 4 : -4), lp(L.B, L.C, 0.9, fr ? 3 : -3)], 1.2, hairL, { op: 0.45 }); // the tendon's light
        if (!far && !fr) { const c = lerp(L.A, L.B, 0.5); X.seam(f, [add(c, [-10, -6]), add(c, [0, 2]), add(c, [8, 10])], 1.6); X.soot(f, add(c, [4, 6]), 8, 6, 0.4); } // the hide split on the thigh
      });
      // the cloven hoof: two toes, split, blackened, the dewclaw behind
      const hd2 = E.norm(sub(L.T, L.D)), hn = [-hd2[1], hd2[0]], hb = lerp(L.D, L.T, 0.25);
      const hoof = [add(hb, mul(hn, 8)), add(L.T, mul(hn, 10)), add(add(L.T, mul(hd2, 7)), mul(hn, 2)), add(add(L.T, mul(hd2, 5)), mul(hn, -8)), add(hb, mul(hn, -8))];
      f.part(hoof, { fill: '#1a1416', shadow: '#000', light: '#6a6264', shade: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, maxShade: 3 });
      f.line([lerp(hb, L.T, 0.3), add(L.T, mul(hd2, 6))], 1.4, '#8a8286', { op: 0.6 }); // the cleft
      f.part(ell(add(L.D, mul(hn, fr ? 8 : -8)), 4, 3, 0, 6), { fill: '#1a1416', inkW: 0.9, cast: false, hatch: false }); // the dewclaw
    }, [[`leg_${k}_1`, side(L.B, mul(d2, -1), ws[1] / 2)], [`leg_${k}_2`, [side(L.B, d2, ws[1] / 2), side(L.C, mul(d3, -1), ws[2] / 2)]], [`leg_${k}_3`, [side(L.C, d3, ws[2] / 2)]]]);
  };
  // ---- far legs, behind the body
  leg('hf', true); leg('ff', true);
  // ---- tail: short, flicked up, scorched
  f.bone('tail');
  f.part([[266, 556], [240, 520], [232, 528], [252, 566]], HR({ maxShade: 4 }));
  X.charEdge(f, [[240, 520], [232, 528]], 2.4);
  // ---- body: the rump and the haunch, the loin, the back up to the withers, a deep chest; the belly tucks up into the
  // flank; split for the rig at the waist
  const body = [[262, 600], [254, 560], [262, 516], [280, 474], [302, 440], [326, 412], [350, 404], [384, 418], [420, 438], [442, 468], [438, 510], [416, 548], [388, 578], [366, 604], [348, 630], [320, 644], [288, 636]];
  const bD = E.smooth(body);
  const fh = [[[300, 520], 11]];
  splitDraw(f, () => {
    X.cutHoles(f, fh, () => f.part(body, HR({ maxShade: 26 })), { shape: bD });
    X.clipDraw(f, bD, () => {
      // light on the back, the hip and the shoulder (the planes turned up and toward the light); the belly in shadow
      X.softTone(f, bD, [[[[254, 600], [262, 520], [300, 450], [336, 404], [370, 414], [330, 440], [296, 500], [280, 560], [276, 610]], '#c0b6bc', 0.32, 10], [ell([290, 590], 30, 36, 0, 12), '#c0b6bc', 0.2, 10], [ell([380, 440], 24, 22, 0, 10), '#c0b6bc', 0.2, 8], [[[360, 440], [420, 460], [380, 560], [340, 640], [320, 600]], '#000', 0.4, 10]]);
      X.crease(f, [[268, 540], [282, 580], [300, 620]], 2.2, { lit: hairL, op: 0.5 }); // the haunch's muscle line
      X.crease(f, [[346, 420], [364, 460], [376, 500]], 2.2, { lit: hairL, op: 0.5 }); // the shoulder's back edge
      f.line([[258, 570], [270, 512], [300, 452], [336, 410]], 2.4, hairL, { op: 0.5 }); // the spine's line in the light
      f.part(ell([274, 552], 8, 6, 0.3, 8), HR({ fill: '#4a444a', cast: false, maxShade: 2, inkW: 1 })); // the hip's point
      // hair burned off in patches: ash-grey hide, the ribs under it split into violet-edged seams
      for (const [c, rx, ry, a] of [[[362, 492], 26, 34, 0.5], [[290, 598], 14, 18, 0.2]]) { const pt = ell(c, rx, ry, a, 18).map((q, k) => add(q, mul(sub(q, c), k % 2 ? R(f, -0.25, -0.05) : R(f, 0.0, 0.2)))); f.part(pt, BR({ cast: false })); f.line([...pt, pt[0]], 2, '#0a0708', { op: 0.6 }); }
      for (let i = 0; i < 4; i++) X.seam(f, [[344 + i * 8, 470 + i * 10], [362 + i * 8, 476 + i * 12], [378 + i * 6, 484 + i * 12]], 1.6); // the ribs split
      X.seam(f, [[280, 590], [292, 600], [298, 614]], 1.8);
      X.flakes(f, [360, 500], 16, 20, 3, 0.7); X.ashCake(f, [300, 470], 20, 30, 6, 0.6, 0.5);
      // the inquisition's black-flame brand on the haunch
      { const list = []; X.tongue(f, list, [284, 580], 28, 14, { dir: [0, -1], curl: 0.8, noFork: true }); for (const t of list) { f.flat(t.poly, '#0a080a', { op: 0.9 }); f.line([...t.poly, t.poly[0]], 1.2, P.vio, { op: 0.6 }); } }
    });
    // the udder, shrunk and scorched, between the hind legs
    f.part([[330, 622], [344, 616], [350, 632], [340, 644], [328, 640]], BR({ fill: '#5a4e52', maxShade: 4 }));
    f.part([[338, 642], [342, 654], [336, 652]], BR({ fill: '#4a3e42', cast: false, maxShade: 1 }));
  }, [['spine_1', side([320, 520], [-0.6, 0.8], 40)], ['spine_2', side([320, 520], [0.6, -0.8], 40)]]);
  // ---- near hind leg
  leg('hn', false);
  // ---- the neck: thin, arched forward and down to the tucked head; the collar and its bell; the placard on its cord
  f.bone('neck');
  const neck = [[330, 416], [338, 366], [358, 324], [388, 298], [412, 292], hp(-12, 6), hp(24, 44), [404, 420], [414, 442], [384, 438]];
  const nD = E.smooth(neck);
  f.part(neck, HR({ maxShade: 14 }));
  X.clipDraw(f, nD, () => { X.softTone(f, nD, [[[[330, 414], [338, 364], [360, 322], [390, 296], [372, 330], [352, 380], [344, 420]], '#c0b6bc', 0.34, 8], [[[384, 340], [410, 360], [420, 440], [390, 440]], '#000', 0.4, 8]]); X.crease(f, [[356, 384], [372, 404], [388, 424]], 1.6, { lit: hairL, op: 0.4 }); X.seam(f, [[346, 396], [356, 410], [364, 420]], 1.4); });
  { const C = X.spline([[338, 372], [366, 376], [396, 390]], 4), col = X.ribbon(C, C.map(() => 10)); f.part(col, { fill: '#3a302c', shadow: '#0e0a0a', light: '#6a5a50', shade: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, maxShade: 3 }); f.rivet(C[Math.floor(C.length / 2)], 2.4, '#8a8286');
    const bc = add(C[Math.floor(C.length * 0.7)], [2, 14]); f.part([add(bc, [-7, -8]), add(bc, [7, -8]), add(bc, [10, 8]), add(bc, [-10, 8])], { fill: '#4a4448', shadow: '#0e0c0e', light: '#9a949a', shade: 0.4, inkW: 1.1, cast: false, maxShade: 3 }); f.flat(ell(add(bc, [0, 8]), 9, 3, 0, 8), '#050405'); } // the bell, its mouth empty
  f.bone('placard');
  { const p0 = [392, 388], pc = [p0[0] + 14, p0[1] + 92]; X.rope(f, [p0, add(pc, [-16, -26])], 2, '#5a5048'); X.rope(f, [p0, add(pc, [16, -26])], 2, '#5a5048'); X.placard(f, pc, 46, 36, 0.04, { rows: 3, fill: '#8a8276' }); }
  // ---- the head: a goat skull, tucked down; the far horn behind, then the skull, the near ear, the near horn
  f.bone('head');
  const horn = (b0, pts, w0, dim) => { const C = X.spline([b0, ...pts], 4), sh = X.ribbon(C, C.map((_, i) => w0 * (1 - i / C.length * 0.82))); f.part(sh, HRN({ fill: mix('#6a5e54', '#000', dim), light: mix('#b0a490', '#000', dim) })); X.clipDraw(f, E.smooth(sh), () => { X.softTone(f, E.smooth(sh), [[X.offsetLine(C, () => w0 * 0.3).concat(X.offsetLine(C, () => 0).reverse()), '#d8ccb8', 0.3 * (1 - dim), 3]]); for (let i = 2; i < C.length - 2; i += 2) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]], w = w0 * (1 - i / C.length * 0.82) * 0.55; f.line([add(C[i], mul(n, w)), add(add(C[i], mul(d, -2)), mul(n, -w))], 1.4, '#1a1410', { op: 0.6 }); } X.flakes(f, C[Math.floor(C.length * 0.4)], 6, 6, 2, 0.5); }); return C; };
  horn(hp(4, -16), [hp(-22, -8), hp(-48, 6), hp(-66, 28), hp(-72, 52)], 16, 0.4);
  const skull = HP([[-10, 6], [-4, -14], [12, -22], [34, -25], [64, -18], [92, -13], [106, -8], [112, 2], [106, 10], [108, 18], [96, 24], [70, 26], [44, 32], [22, 34], [4, 28]]);
  const sD = E.smooth(skull);
  f.part(skull, HR({ maxShade: 14 }));
  X.clipDraw(f, sD, () => {
    // the planes of the skull: the flat forehead and the bridge of the nose facing the light, the cheek's round, the
    // jaw's floor in shadow, the muzzle narrowing
    X.softTone(f, sD, [[HP([[0, -26], [104, -14], [104, -4], [0, -10]]), '#c8bec4', 0.42, 4], [HP([[0, 20], [106, 14], [106, 34], [0, 40]]), '#000', 0.45, 5], [HP([[16, 4], [44, 6], [44, 24], [16, 24]]), '#c0b6bc', 0.2, 5]]);
    X.crease(f, HP([[8, 0], [26, 6], [46, 12], [58, 20]]), 1.8, { lit: hairL, op: 0.55 }); // the cheekbone's ridge
    X.crease(f, HP([[22, 12], [34, 24], [28, 32]]), 1.4, { col: '#0a0708', op: 0.5, light: false }); // the cheek's back edge
    f.line(HP([[40, -21], [70, -16], [100, -11]]), 1.6, hairL, { op: 0.55 }); // the nasal bone in the light
    // a burned-off patch on the face: grey hide, a seam
    { const c = hp(70, 4), pt = ell(c, 10, 6, hA, 10).map(q => add(q, [R(f, -2, 2), R(f, -2, 2)])); f.part(pt, BR({ cast: false, maxShade: 3 })); X.hairline(f, [add(c, [-6, -2]), add(c, [4, 2])], 1); }
  });
  // the brow ridge over the eye; the eye set high on the side, gone ash pale, a dark horizontal slit; the lid's edge
  { const ec = hp(28, -7); f.part(ell(add(ec, rot([-2, -8], hA)), 13, 6, hA - 1.57, 10), HR({ fill: '#4a444a', light: '#b0a6ac', cast: true, castOp: 0.3, maxShade: 3, inkW: 1.1, inkHeavy: 1.4 }));
    f.flat(ell(ec, 6, 3.6, hA - 1.57 + 0.15, 10), '#a8a09e'); f.flat(ell(ec, 4, 1.1, hA - 1.57 + 0.15, 8), '#1a1214'); f.line(ell(ec, 6.6, 4.2, hA - 1.57 + 0.15, 10).slice(5, 10), 1.8, INK); f.line(ell(ec, 8.5, 6, hA - 1.57 + 0.15, 10).slice(0, 5), 1, '#0a0708', { op: 0.6 }); }
  // the nostril and the split upper lip; the mouth line
  { const nc = hp(100, -2); f.flat(ell(nc, 4, 2.4, hA - 1.2, 8), '#0a0708'); f.line(HP([[100, 4], [105, 9], [107, 14]]), 1.2, INK, { op: 0.8 }); f.line(HP([[84, 19], [96, 17], [105, 14]]), 1.4, INK, { op: 0.8 }); }
  // the near ear, drooping back from under the horn, a clean round void hole through it (cut through)
  { const e0 = hp(6, 8), tip = hp(34, 54); const ear = [add(e0, rot([0, -8], hA)), lerp(e0, tip, 0.5).map((v, i) => v + (i ? -2 : -6)), tip, lerp(e0, tip, 0.55).map((v, i) => v + (i ? 4 : 6)), add(e0, rot([0, 8], hA))]; X.cutHoles(f, [[lerp(e0, tip, 0.74), 4]], () => { f.part(ear, HR({ fill: '#2e282e', maxShade: 6 })); f.flat([lerp(e0, tip, 0.15), lerp(e0, tip, 0.5).map((v, i) => v + (i ? 1 : -3)), lerp(e0, tip, 0.85)], '#5a4e54', { op: 0.6 }); }, { shape: E.smooth(ear) }); }
  // the near horn: ringed, flaking, back-swept from the poll, pyre straw caught on it
  { const C = horn(hp(2, -22), [hp(-24, -18), hp(-52, -4), hp(-74, 20), hp(-82, 46)], 20, 0); for (let i = 0; i < 4; i++) { const q = C[Math.floor(C.length * (0.3 + i * 0.12))]; f.line([add(q, [R(f, -12, -4), R(f, -8, 8)]), add(q, [R(f, 6, 14), R(f, -6, 10)])], 1.4, '#b8a46a', { op: 0.85 }); } }
  // the jaw and the beard hanging plumb from the chin, smouldering, ash curling up off it
  f.bone('jaw');
  f.part(HP([[44, 30], [70, 24], [96, 22], [100, 28], [80, 34], [52, 37]]), HR({ fill: '#2e282e', cast: false, maxShade: 3, inkW: 1.1, inkHeavy: 1.4 }));
  { const ch = hp(86, 32); for (let i = 0; i < 4; i++) X.hairClump(f, [add(ch, [i * 3 - 4, 0]), add(ch, [i * 2 - 6 + R(f, -2, 2), 22]), add(ch, [i * 2 - 8 + R(f, -3, 3), 40 + R(f, -4, 4)])], 7, { pal: ['#141012', '#3a3436', '#6a6266'], n: 2 }); X.charEdge(f, [add(ch, [-10, 40]), add(ch, [0, 44])], 2, { gap: 4 }); X.ash(f, add(ch, [-4, 30]), 10, 20, 70, 0.7); X.smoke(f, add(ch, [-6, 30]), 60, 12, { sway: 8, op: 0.3, col: '#2a2430', line: P.ashL, lineOp: 0.3, drift: -10 }); }
  // ---- near foreleg, folded, in front of the chest
  leg('fn', false);
  // ---- ashprints and a scuffed heap under the hind hooves
  f.bone('root');
  X.ashprint(f, [380, gy + 4], 1.4); X.ashHeap(f, [310, gy], 120, 12);
  return f;
}

// ------------------------------------------------------------------ BELFRY BATS (cast, small, a swirl about 0.6 across)
// Bats of the cathedral belfry: the bell tower burned and they did not leave. A dozen bats in a swirling loop, each in
// its own pose (wing up, down, spread, folded, banking, seen from above, below or the side) and size by depth, so no two
// are clones. Wings burned to the finger bones, the membranes charred into lace with violet edges, clean round void
// holes punched through several wings; bodies cinder grey, ash flaking off them, fur smoking at the edges; small
// pug-nosed faces, ears scorched to stubs, mouths open in a shriek, eyes small and dark. Details: one bat with no head,
// the neck a clean rim, still flying; a strand of bell rope tangled round one; a scrap of burned hymn page in one's claw;
// one clinging to another's back; a fleck of black flame riding on a wing.
// Rig: bat_1..bat_12 (one bone per bat, each pivot at its body; the rider is parented to its carrier) + root.
// Motion: idle a swirling loop that sheds ash; attack the swirl diving through the back rank.
function belfryBats() {
  const [CW, CH] = TIERS.small, seed = 1325;
  const f = new Fig(X.base(seed, CH, { grimeY: 2000 })); X.textures(f);
  const gy = f.o.groundY;
  const fur = '#5a5456', furL = '#8a8486', furD = '#2a2628';
  // one bat. c: body centre, a: heading (screen radians), k: scale, o.up 0..1 wing raise (0 down-stroke, 1 up),
  // o.view 'top' (wings spread to both sides) or 'side' (both wings on the up side, the far one foreshortened)
  const bat = (c, a, k, o = {}) => {
    const F = frame(c, a, k), dim = o.dim || 0, up = o.up ?? 0.5, side2 = o.view === 'side';
    const sg = o.belly ? -1 : 1; // which side is 'near wing up' in the local frame
    // a wing in local space: shoulder at [6, s*5], elbow, wrist forward, four digits fanning back, the flank point
    const wingLocal = (s, span, sweep) => {
      const Sx = [4, s * 4], Ex = [-6, s * 30 * span], Wx = [14 + sweep * 8, s * 60 * span];
      const tipsL = [[44 + sweep * 12, s * 104 * span], [8, s * 124 * span], [-26, s * 108 * span], [-42, s * 70 * span]];
      return { S: Sx, E: Ex, W: Wx, tips: tipsL, Fk: [-18, s * 5] };
    };
    const toW = (wl, dimW, holes, tr) => {
      const S0 = F([wl.S])[0], E0 = F([wl.E])[0], W0 = F([wl.W])[0], Fk = F([wl.Fk])[0];
      const digits = wl.tips.map(t => { const T = F([t])[0]; return [ang(W0, T), E.len(sub(T, W0)), 0]; });
      return X.batWing(f, S0, E0, W0, digits, Fk, { dim: dimW, holes: (holes || []).map(([u, v, r]) => [F([[u, v]])[0], r * k]), s: k, tr, lace: o.lace ?? 4, rag: k });
    };
    // up: the wings' span on the up side; for a top view one wing each side
    const spanN = 0.45 + 0.55 * (side2 ? 1 : 1 - Math.abs(up - 0.5)), spanF = side2 ? 0.55 : spanN;
    const sN = side2 ? -sg : -sg, sF = side2 ? -sg : sg;
    // far wing first, then the body, then the near wing
    toW(wingLocal(sF, spanF * (side2 ? 0.7 : 1) * (up < 0.3 && !side2 ? 0.8 : 1), 0.5), Math.min(0.7, dim + 0.3), o.holesF, -sF);
    if (o.flameF) X.blackFlame(f, F([o.flameF])[0], 26 * k, 9 * k, { noFork: true, edgeW: 1.4, wisps: false, scraps: false });
    // the body: furred, cinder grey, the fur smoking at the edges; feet trailing with a tail membrane between
    const bd = F([[-22, 0], [-14, -8], [2, -10], [13, -7], [18, 0], [13, 7], [2, 10], [-14, 8]]);
    f.part(F([[-20, 4], [-38, 12], [-40, 2], [-35, -8], [-20, -4]]), { fill: mix('#3a3236', '#000', dim), shadow: '#08060a', shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, maxShade: 3 }); // the tail membrane
    for (const s2 of [-1, 1]) f.line(F([[-20, s2 * 5], [-32, s2 * 9], [-37, s2 * 8]]), 1.6 * k, '#141012');
    if (o.page) { const pg = F([[-52, 6], [-30, 14], [-34, 36], [-58, 28]]); f.part(pg, { fill: '#b8b0a0', shadow: '#5a5248', shade: 0.35, inkW: 1, cast: false, maxShade: 3 }); X.clipDraw(f, E.smooth(pg), () => { for (let i = 0; i < 4; i++) f.line(F([[-52, 12 + i * 5], [-34, 18 + i * 5]]), 0.9, i === 0 ? P.rubric : '#2a2420', { op: 0.8 }); }); X.charEdge(f, F([[-34, 36], [-58, 28], [-52, 6]]), 2.4, { gap: 4 }); }
    f.part(bd, { fill: mix(fur, '#000', dim), shadow: furD, light: mix(furL, '#000', dim), shade: 0.4, tex: 'fur' + seed, texOp: 0.7, inkW: 1.1, inkHeavy: 1.6, maxShade: 6 * k });
    X.clipDraw(f, E.smooth(bd), () => { X.stains(f, E.smooth(bd), E.bbox(bd).map((v, i) => v + (i < 2 ? -6 : 6)), P.charS, 0.08, 3, -1.3, Math.round(c[0]) % 60, 0.8); for (let i = 0; i < 4; i++) f.line(F([[R(f, -20, 10), R(f, -6, 6)], [R(f, -20, 10) - 6, R(f, -6, 6)]]), 0.8, furL, { op: 0.5 }); });
    X.smoke(f, F([[-10, -10]])[0], 18 * k, 6 * k, { sway: 4, op: 0.3, col: '#3a3440', line: P.ashD, lineOp: 0.3 });
    if (o.rope) { X.rope(f, [F([[-6, -14]])[0], F([[0, 0]])[0], F([[-10, 14]])[0], F([[-40, 30]])[0], add(F([[-60, 40]])[0], [0, 40])], 3 * k, '#6a5e4e', { fray: true }); }
    // the head: pug-nosed, ears scorched to stubs, the mouth open in a shriek; or gone, the neck a clean rim
    if (o.headless) { X.voidDisk(f, F([[18, 0]])[0], 5 * k, 6 * k, a); }
    else {
      const hc = F([[20, 0]])[0], H0 = frame(hc, a, k), hd = H0([[-6, -8], [6, -9], [14, -4], [17, 2], [12, 8], [2, 10], [-6, 7]]);
      f.part(H0([[-2, -6], [-8, -16], [-2, -14]]), { fill: '#2a2428', inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); f.part(H0([[-2, 6], [-8, 16], [-2, 14]]), { fill: '#2a2428', inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); // ear stubs
      f.part(hd, { fill: mix(fur, '#000', dim * 0.6), shadow: furD, light: furL, shade: 0.4, tex: 'fur' + seed, texOp: 0.6, inkW: 1, inkHeavy: 1.4, cast: false, maxShade: 3 });
      f.flat(H0([[10, -2], [18, -1], [15, 5], [9, 4]]), '#1a0e10'); // the open mouth
      f.line(H0([[11, -1], [16, 0]]), 0.9, '#d8d0c0', { op: 0.9 }); f.line(H0([[10, 3.5], [14, 4]]), 0.9, '#d8d0c0', { op: 0.9 });
      f.flat(H0(ell([15, -4], 2.2, 1.6, 0, 6)), '#2a2226'); // the pug nose
      f.flat(H0(ell([6, -4], 1.6, 1.3, 0, 6)), '#060405'); // a small dark eye under the brow
    }
    // the near wing over the body
    toW(wingLocal(sN, spanN, 0.5), dim, o.holesN, -sN);
    if (o.flameN) X.blackFlame(f, F([o.flameN])[0], 30 * k, 10 * k, { noFork: true, edgeW: 1.4, wisps: false, scraps: false });
    X.ash(f, F([[-30, 0]])[0], 4, 20 * k, 40 * k, 0.6 * k);
    return F;
  };
  // the swirl: a loop round [300, 470], bats heading along it, far ones (top of the loop) smaller and dimmer
  const opts = [
    { up: 0.9, view: 'side', dim: 0.4 }, { up: 0.5, dim: 0.45, holesN: [[0, -80, 6]] }, { up: 0.2, dim: 0.35, headless: true },
    { up: 0.8, view: 'side', dim: 0.2, flameN: [10, -80] }, { up: 0.3, dim: 0.1, rope: true }, { up: 0.6, holesN: [[-6, -90, 7], [10, -64, 4]] },
    { up: 0.1, view: 'side', page: true }, { up: 0.5, dim: 0.05, belly: true, holesF: [[0, 80, 5]] }, { up: 1.0, view: 'side', dim: 0.3 },
    { up: 0.4, dim: 0.15, holesF: [[-10, 84, 6]] }, { up: 0.7, dim: 0.5, view: 'side' },
  ];
  // the loop: an ellipse leaning a little, the bats heading round it clockwise; those at the top of the loop are farther
  const list = opts.map((o, i) => { const t = i / opts.length * 6.283 + 0.3 + R(f, -0.12, 0.12), c = [300 + Math.cos(t) * 132 + R(f, -12, 12), 480 + Math.sin(t) * 98 + R(f, -12, 12)]; return [c, t + Math.PI / 2 + R(f, -0.4, 0.4), 0.54 + 0.24 * (Math.sin(t) + 1) / 2 + R(f, -0.05, 0.05), Object.assign(o, { dim: Math.max(0, (o.dim || 0) * 0.5 + (1 - (Math.sin(t) + 1) / 2) * 0.35) })]; });
  // draw order: dimmer (farther) first
  const order = list.map((b, i) => [b, i]).sort((x, y) => (y[0][3].dim || 0) - (x[0][3].dim || 0));
  for (const [[c], i] of order) f.joint('bat_' + (i + 1), c);
  f.joint('bat_12', add(list[5][0], [-6, -14]), 'bat_6');
  for (const [[c, a, k, o], i] of order) {
    f.bone('bat_' + (i + 1));
    const F = bat(c, a, k, o);
    if (i === 5) { f.bone('bat_12'); bat(F([[-4, -12]])[0], a + 0.5, 0.55, { up: 0.95, view: 'side', dim: 0.05 }); } // a small bat clinging to this one's back
  }
  // ash shed by the swirl, drifting down
  f.bone('root');
  for (let i = 0; i < 30; i++) { const q = [R(f, 120, 500), R(f, 380, 760)], r = R(f, 1.2, 3.4); f.flat([add(q, [-r * 1.4, 0]), add(q, [0, -r * 0.7]), add(q, [r * 1.4, -r * 0.2]), add(q, [r * 0.3, r * 0.5])], f.r() < 0.5 ? P.ashL : '#2a2426', { op: 0.7 }); }
  return f;
}

// ------------------------------------------------------------------ CHARRED DESTRIER (cast, large, 1.7 at the head)
// A warhorse of the inquisition's knights: it carried them to the pyre and still knows the way. A great destrier standing
// riderless, head high and turned toward the party, the near forehoof lifted, pawing; weight back on the haunches.
// Rebuilt in the independent review with the Dray Horse's habits: a deep, rounded barrel (withers 780 px, the girth
// 45 percent of that), the back dipping behind the withers to the saddle and rising over the loin to a rounded croup;
// a crested, muscled neck that arches back off the poll (so the throat stays in front of the crest) and broadens into the
// shoulder; the haunch and the thigh as one great mass over a gaskin that tapers to the hock's point; forearms muscled to
// a bony knee; flat cannons with the tendon behind; round fetlocks; sloped pasterns; shod hooves. The head is a long,
// tapered skull: a flat forehead under the chanfron, the big round of the cheek and jowl, the jaw tapering to a narrow
// muzzle with soft lips, a flared nostril, a small eye under the brow (a violet ember). Fire: the hide burned away in
// patches to charred muscle, split along the neck and flanks into violet-edged seams; the mane burned to smoking stubs.
// Void: a clean round hole through the base of the neck (cut through). Gear: a caparison of ash-grey cloth burned to
// tatters in two pieces (a trapper over the quarters hanging down the haunch, a peytral cloth over the chest and
// shoulder), the barrel between them bare where the cloth burned away; folds hang from the croup and the withers, the
// hems burned into curled tongues, windows burned through, scorch rising from the hem; the inquisition's black flame
// embroidered on the quarter; a chanfron of blackened steel with a spike and eye cups; a high-cantled war saddle; the
// rider's legs in the stirrups, cut off clean at the hip by the void; reins trailing; an iron bit; a crupper; a girth;
// an empty scabbard; iron shoes.
// Rig: spine_1 (root, hips) > spine_2 (barrel, chest, saddle, rider's legs, peytral) > neck > head > jaw; tail
// (spine_1); legs leg_[f|h][n|f]_1..3; reins (head); scabbard (spine_2). Motion: idle a stamp and a head toss that sheds
// ash; attack rearing and striking down with both forehooves (spine_2 up about the hips, forelegs fold and strike).
function charredDestrier() {
  const CW = 1300, CH = 1250, seed = 1330;
  const f = new Fig(X.base(seed, CH, { grimeY: 1000 })); X.textures(f);
  const gy = f.o.groundY; // 1220
  const hide = '#4e4649', hideL = '#8e8286', burnt = '#1e1719', burntL = '#4a3c3e';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#0c090b', light: hideL, shade: 0.42, tex: 'fur' + seed, texOp: 0.45, maxShade: 30 }, o);
  const BU = (o = {}) => Object.assign({ fill: burnt, shadow: '#050304', light: burntL, shade: 0.42, tex: 'craze' + seed, texOp: 0.55, maxShade: 20 }, o);
  const CAP = (o = {}) => Object.assign({ fill: '#7e7a74', shadow: '#24221f', light: '#b0aca4', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 }, o);
  const ST = (o = {}) => Object.assign({ fill: '#3a3c42', shadow: '#0e0e12', light: '#7a7c86', shade: 0.42, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const LTH = (o = {}) => Object.assign({ fill: '#3a302c', shadow: '#0e0a0a', light: '#6a5a50', shade: 0.4, tex: 'craze' + seed, texOp: 0.45 }, o);
  // the head frame: u from the poll down the face to the muzzle, v across (+v toward the jaw, -v the forehead's front)
  const PL = [1000, 142], hA = 0.86, HF0 = frame(PL, hA, 1), hp = (u, v) => HF0([[u, v]])[0], HP = pts => pts.map(([u, v, k]) => k ? [...hp(u, v), 1] : hp(u, v));
  const LEG = {
    hf: { A: [290, 620], B: [318, 800], C: [244, 968], D: [262, 1140], T: [284, gy], hind: true },
    hn: { A: [340, 630], B: [372, 806], C: [300, 974], D: [320, 1146], T: [344, gy], hind: true },
    ff: { A: [850, 700], B: [846, 830], C: [856, 994], D: [864, 1148], T: [884, gy] },
    fn: { A: [890, 700], B: [884, 820], C: [986, 926], D: [962, 1058], T: [990, 1100], lifted: true },
  };
  f.joint('spine_1', [330, 600]).joint('spine_2', [580, 620], 'spine_1').joint('neck', [880, 560], 'spine_2').joint('head', hp(10, 40), 'neck').joint('jaw', hp(150, 50), 'head');
  f.joint('tail', [206, 486], 'spine_1').joint('reins', hp(282, 34), 'head').joint('scabbard', [600, 540], 'spine_2');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.A, L.hind ? 'spine_1' : 'spine_2').joint(`leg_${k}_2`, L.B, `leg_${k}_1`).joint(`leg_${k}_3`, L.C, `leg_${k}_2`);

  // burnt patches on a hide region: charred black muscle with the hair's scorched edge round it, a seam through it
  const patches = (shapeD, list) => X.clipDraw(f, shapeD, () => { for (const [c, rx, ry, a] of list) { const pt = ell(c, rx, ry, a || 0, 14).map(q => add(q, [R(f, -10, 10), R(f, -10, 10)])); f.part(pt, BU({ cast: false, maxShade: 8 })); f.line([...pt, pt[0]], 3, '#0a0808', { op: 0.6 }); for (let i = 0; i < 3; i++) X.crease(f, [add(c, [-rx * 0.6, -ry * 0.5 + i * ry * 0.4]), add(c, [0, -ry * 0.4 + i * ry * 0.4]), add(c, [rx * 0.6, -ry * 0.45 + i * ry * 0.4])], 2, { col: '#050304', lit: burntL, op: 0.5 }); X.crackNet(f, c, (a || 0) + R(f, -0.5, 0.5), Math.max(rx, ry) * 1.2, 2, { depth: 1 }); X.flakes(f, c, rx * 0.6, ry * 0.6, 3, 0.8); } });
  // cloth folds as form, not stripes: each fold a soft dark valley with a lit ridge on its light side and a thin crease at
  // its bottom; folds start along the hanging edge at different points and fall plumb, some ending part-way
  const drape = (clipD, list, lit = '#d8d4cc') => { const tones = []; for (const [pts, w] of list) { const C = X.spline(pts, 6); tones.push([X.ribbon(C, C.map((_, i) => w * Math.sin(Math.PI * (0.1 + 0.8 * i / (C.length - 1))))), '#000', 0.4, Math.max(3, w * 0.35)]); tones.push([X.ribbon(X.offsetLine(C, () => w * 0.9), C.map((_, i) => w * 0.7 * Math.sin(Math.PI * (0.1 + 0.8 * i / (C.length - 1))))), lit, 0.18, Math.max(3, w * 0.3)]); } X.softTone(f, clipD, tones); for (const [pts, w] of list) X.crease(f, X.spline(pts, 8), w * 0.22, { col: '#14120f', op: 0.45, light: false }); };
  // a horse leg in one outline (the forearm or the gaskin's muscle, the knee or the hock, the flat cannon, the round
  // fetlock, the sloped pastern) cut for the rig at the two lower joints; the shod hoof at the end
  const leg = (k, far) => {
    const L = LEG[k], tone = far ? 0.38 : 0, look = HD({ fill: mix(hide, '#000', tone), light: mix(hideL, '#000', tone) });
    const hindL = !!L.hind, P5 = lerp(L.D, L.T, 0.6);
    const ws = hindL ? [230, 128, 86, 76, 56] : [190, 138, 82, 76, 56];
    const shape = K.chain([L.A, L.B, L.C, L.D, P5], ws, { steps: 12,
      bp: hindL ? [[0, 0.6, 0.18, 0.25], [1, 0.3, 0.34, 0.22], [2, 0.0, 0.4, 0.07], [2, 0.5, -0.12, 0.2], [3, 0.0, 0.16, 0.1]] : [[1, 0.3, 0.16, 0.25], [2, 0.0, 0.12, 0.08], [2, 0.5, -0.12, 0.2], [3, 0.0, 0.18, 0.1]],
      bq: hindL ? [[1, 0.2, 0.18, 0.2], [2, 0.5, -0.1, 0.2], [3, 0.0, 0.1, 0.1]] : [[1, 0.25, 0.3, 0.22], [2, 0.0, 0.14, 0.08], [2, 0.5, -0.12, 0.2], [3, 0.0, 0.1, 0.1]] });
    const d2 = elb(L.A, L.B, L.C), d3 = elb(L.B, L.C, L.D);
    split(f, () => {
      f.part(shape, look);
      X.clipDraw(f, E.smooth(shape), () => {
        X.softTone(f, E.smooth(shape), [[[lp(L.A, L.B, 0, -70), lp(L.A, L.B, 1, -50), lp(L.B, L.C, 1, -24), lp(L.B, L.C, 1, -6), lp(L.A, L.B, 0, -10)], hideL, far ? 0.1 : 0.34, 10], [[lp(L.A, L.B, 0.3, 40), lp(L.B, L.C, 0, 50), lp(L.C, L.D, 1, 26), lp(L.C, L.D, 1, 8), lp(L.B, L.C, 0, 10)], '#000', 0.4, 10]]);
        // muscle: the forearm's or gaskin's belly and its groove; the tendon down the back of the flat cannon
        X.crease(f, [lp(L.B, L.C, 0.05, hindL ? 30 : -20), lp(L.B, L.C, 0.4, hindL ? 22 : -24), lp(L.B, L.C, 0.75, hindL ? 10 : -14)], 2.6, { col: '#0a0808', lit: hideL, op: 0.5 });
        if (hindL) X.crease(f, [lp(L.A, L.B, 0.2, -20), lp(L.A, L.B, 0.6, -40), lp(L.A, L.B, 0.95, -30)], 3, { col: '#0a0808', lit: hideL, op: 0.5 }); // the stifle's fold
        f.line([lp(L.C, L.D, 0.12, hindL ? 22 : -22), lp(L.C, L.D, 0.88, hindL ? 20 : -20)], 2.2, '#0a0808', { op: 0.55 });
        f.line([lp(L.C, L.D, 0.12, hindL ? -18 : 18), lp(L.C, L.D, 0.85, hindL ? -16 : 16)], 2, hideL, { op: 0.35 });
        if (!far) { X.seam(f, [lp(L.A, L.B, 0.3, 10), lp(L.A, L.B, 0.6, -8), lp(L.B, L.C, 0.1, 4)], 2.2); X.soot(f, lerp(L.B, L.C, 0.5), 20, 30, 0.35, ang(L.B, L.C)); }
        X.ashCake(f, lerp(L.D, L.T, 0.1), 22, 20, 5, 1, 0.5);
        // the bony knee or the point of the hock; the fetlock's round
        if (hindL) { f.line([add(L.C, mul(d3, -34)), add(L.C, mul(d3, -26)), add(add(L.C, mul(d3, -10)), [0, 24])], 2.4, '#0a0808', { op: 0.55 }); } else { f.line(ell(L.C, 30, 32, ang(L.B, L.C), 12).slice(2, 8), 2, '#0a0808', { op: 0.55 }); }
        f.line(ell(L.D, 34, 28, 0, 12).slice(1, 6), 2, '#0a0808', { op: 0.5 });
        // the fetlock's tuft of hair, singed
        X.hairClump(f, [add(L.D, mul(d3, -8)), add(L.D, add(mul(d3, -30), [0, 24])), add(L.D, add(mul(d3, -34), [0, 44]))], 16, { pal: ['#141012', '#2a2426', '#3a3436'], n: 3 });
      });
      const hd2 = E.norm(sub(L.T, L.D)), ha = L.lifted ? ang(L.D, L.T) - Math.PI / 2 + 0.2 : 0;
      X.hoof(f, frame(L.lifted ? add(L.T, mul(hd2, 30)) : [L.T[0] + 6, gy], ha, 1), 50, { fill: mix('#2a2426', '#000', tone), shadow: '#050304', light: '#6a6264', shade: 0.4, tex: 'craze' + seed, texOp: 0.4, inkW: 1.4, inkHeavy: 2 }, { shoe: true, split: k === 'hn' });
    }, [[`leg_${k}_1`, side(L.B, mul(d2, -1), ws[1] / 2)], [`leg_${k}_2`, [side(L.B, d2, ws[1] / 2), side(L.C, mul(d3, -1), ws[2] / 2)]], [`leg_${k}_3`, [side(L.C, d3, ws[2] / 2)]]]);
  };
  // ---- far legs
  leg('hf', true); leg('ff', true);
  // ---- the tail: burned short, a smouldering stub of hanks
  f.bone('tail');
  for (let i = 0; i < 7; i++) X.hairClump(f, [add([206, 486], [0, i * 4]), add([182, 560], [R(f, -14, 8), i * 6]), add([168, 650], [R(f, -20, 10), R(f, -20, 30)])], 16, { pal: ['#141012', '#2a2426', '#3a3436'], n: 3 });
  X.smoke(f, [168, 660], 120, 30, { sway: 16, op: 0.4, col: '#2a2430', line: P.ashL, lineOp: 0.35, drift: -30 });
  // ---- the body: withers, the back dipping to the saddle, the loin, a rounded croup over the haunch, the buttock; a deep
  // barrel rounding under to the girth; the broad chest and the point of the shoulder
  const body = [[206, 480], [250, 452], [330, 440], [420, 456], [530, 472], [620, 478], [710, 466], [790, 432], [860, 444], [930, 510], [984, 600], [996, 690], [968, 770], [896, 812], [760, 832], [610, 838], [490, 822], [410, 786], [372, 800], [300, 822], [226, 782], [184, 700], [170, 600], [180, 524]];
  const bD = E.smooth(body);
  splitDraw(f, () => {
    f.part(body, HD({ maxShade: 70 }));
    X.clipDraw(f, bD, () => {
      X.softTone(f, bD, [
        [[[180, 700], [1000, 680], [1000, 850], [180, 850]], '#000', 0.45, 24], // the barrel rounding under
        [[[230, 470], [420, 460], [620, 490], [800, 450], [900, 500], [800, 540], [600, 540], [420, 520], [240, 540]], hideL, 0.32, 18], // the back in the light
        [ell([300, 600], 110, 120, 0, 14), hideL, 0.22, 24], // the haunch's round
        [ell([900, 620], 70, 110, 0.2, 14), hideL, 0.26, 18], // the shoulder's front, toward the light
        [ell([480, 640], 60, 90, 0, 12), '#000', 0.28, 20]]); // the flank's hollow in front of the stifle
      X.crease(f, [[330, 500], [290, 620], [330, 760]], 3.4, { lit: hideL, op: 0.55 }); // the haunch's muscle groove
      X.crease(f, [[790, 470], [840, 600], [860, 740]], 3.4, { lit: hideL, op: 0.55 }); // the shoulder's back edge
      X.crease(f, [[940, 560], [900, 640], [880, 720]], 2.6, { lit: hideL, op: 0.45 }); // the point of the shoulder
      for (let i = 0; i < 6; i++) X.crease(f, [[560 + i * 36, 620], [566 + i * 36, 700], [560 + i * 36, 790]], 2.2, { lit: hideL, op: 0.4 }); // ribs under the hide
      X.crease(f, [[420, 690], [520, 760], [640, 790]], 2.6, { lit: hideL, op: 0.4 }); // the belly's line
      f.line([[230, 470], [330, 446], [480, 466], [620, 482], [720, 470], [790, 440]], 4, hideL, { op: 0.45 }); // the topline in the light
    });
    patches(bD, [[[620, 700], 70, 60, 0.2], [[900, 680], 40, 60, 0.2], [[460, 600], 40, 30, 0.4]]);
    X.seam(f, [[520, 640], [580, 700], [640, 760], [700, 790]], 2.6); X.seam(f, [[900, 600], [920, 660], [912, 720]], 2);
  }, [['spine_1', side([520, 620], [-1, 0], 80)], ['spine_2', side([520, 620], [1, 0], 80)]]);
  // ---- near hind leg
  leg('hn', false);
  // ---- the trapper over the quarters: hung from the croup and the loin, the cloth breaking over the hip and falling in
  // fanned folds down the haunch; its hem burned into curled tongues and long tatters, windows burned through to the
  // hide, scorch rising from the hem; the black flame embroidered on the quarter
  const trTop = [[540, 470], [430, 456], [330, 440], [250, 452], [206, 482]];
  const trHem = [...X.charHem(f, [180, 720], [300, 820], 7, 34, [0, 1]), ...X.charHem(f, [300, 820], [440, 770], 8, 46, [0, 1]).slice(1), ...X.charHem(f, [440, 770], [560, 700], 6, 30, [0, 1]).slice(1)];
  const tr = [...trTop, [176, 560], ...trHem, [566, 600]];
  const trD = E.smooth(tr);
  splitDraw(f, () => {
    X.cutHoles(f, [[[430, 600], 20]], () => f.part(tr, CAP({ maxShade: 40 })), { shape: trD });
    X.clipDraw(f, trD, () => {
      X.softTone(f, trD, [[[[170, 700], [580, 640], [580, 840], [170, 840]], '#000', 0.4, 18], [[[230, 460], [450, 460], [430, 520], [240, 530]], '#fff', 0.14, 14], [[[170, 520], [240, 520], [240, 760], [170, 760]], '#000', 0.3, 16]]);
      // folds fanning down from the croup's high point (the cloth hangs from there), deep valleys, lit ridges
      drape(trD, [[[[520, 478], [528, 600], [546, 690]], 22], [[[472, 468], [482, 600], [500, 740]], 30], [[[418, 460], [418, 600], [436, 770]], 26], [[[372, 452], [356, 560], [348, 700], [358, 800]], 34], [[[318, 446], [296, 560], [286, 700], [296, 810]], 28], [[[268, 452], [246, 560], [228, 700], [236, 780]], 30], [[[224, 470], [200, 560], [190, 680]], 22], [[[452, 560], [460, 650]], 16], [[[322, 620], [318, 700]], 14], [[[262, 600], [254, 690]], 14]]);
      for (const pts of [[[250, 520], [300, 540], [360, 530]], [[390, 520], [440, 534], [496, 528]]]) X.crease(f, pts, 4, { col: '#1a1816', lit: '#c8c4ba', op: 0.45 }); // the cloth breaking over the hip
      // scorch rising from the hem: a soft dark band and licks of char
      X.softTone(f, trD, [[[...trHem.map(q => add(q, [0, -90])), ...trHem.slice().reverse().map(q => add(q, [0, 10]))], P.charS, 0.55, 24]]);
      X.sootStreaks(f, [360, 780], 10, 160, 160, { op: 0.4 });
      // a burned-out window showing the charred hide; small burn holes
      { const c = [270, 660], w = ell(c, 34, 56, 0.2, 14).map(q => add(q, [R(f, -8, 8), R(f, -8, 8)])); f.part(w, BU({ fill: '#2a2224', cast: false, maxShade: 8 })); X.charEdge(f, [...w, w[0]], 4, { gap: 6 }); X.crackNet(f, c, 1.2, 30, 1.8, { depth: 1 }); }
      for (const [c, r] of [[[470, 640], 10], [[350, 720], 12], [[220, 560], 8]]) X.burnHole(f, c, r, 0.3);
      // the inquisition's black flame embroidered on the quarter, stitched, the stitching half burned
      { const list = []; X.tongue(f, list, [390, 590], 110, 52, { dir: [0, -1], curl: 0.9, noFork: false }); for (const t of list) { f.flat(t.poly, '#141014', { op: 0.92 }); f.line([...t.poly, t.poly[0]], 1.6, P.vio, { op: 0.55 }); f.line(t.poly, 1, '#c8c4ba', { op: 0.35, dash: '2 3' }); } }
      X.stains(f, trD, [160, 430, 600, 860], P.charS, 0.022, 2.8, -1.35, 101, 0.7);
      X.ashCake(f, [360, 470], 140, 14, 10, 1.2);
    });
    X.charEdge(f, trHem, 7, { gap: 6 });
    X.charEdge(f, [[566, 600], [540, 470]], 5, { gap: 8 }); // the front edge, burned back from the saddle
  }, [['spine_1', side([520, 620], [-1, 0], 80)], ['spine_2', side([520, 620], [1, 0], 80)]]);
  f.bone('spine_1');
  f.part(X.ribbon([[560, 470], [440, 452], [330, 436], [250, 452], [214, 488]], [20, 20, 20, 20, 18]), LTH({ maxShade: 4, cast: false })); // the crupper strap
  X.rivetRow(f, [[540, 466], [430, 450], [320, 436], [250, 452]], 50, 5, { col: '#4a4850' });
  // ---- the empty scabbard hanging from the saddle
  f.bone('scabbard');
  { const s0 = [600, 540], s1 = [420, 840]; f.part(limb(s0, s1, 30, 22, { steps: 8 }), LTH({ fill: '#2a2220', maxShade: 6 })); f.part(limb(lerp(s0, s1, 0.92), add(s1, mul(E.norm(sub(s1, s0)), 12)), 26, 22, { steps: 3 }), ST({ cast: false, maxShade: 3 })); f.part(ell(s0, 18, 10, ang(s0, s1), 10), ST({ cast: false })); f.flat(ell(add(s0, [2, 2]), 10, 5, ang(s0, s1), 8), '#050405'); for (const t of [0.2, 0.5]) f.part(X.ribbon([lp(s0, s1, t, -18), lp(s0, s1, t, 18)], [8, 8]), ST({ cast: false, maxShade: 2 })); f.line([[610, 500], s0], 4, '#2a201c'); }
  // ---- the war saddle, the girth, the rider's legs in the stirrups cut off clean at the hip
  f.bone('spine_2');
  const sad = [[530, 476], [566, 400], [596, 410], [616, 470], [700, 468], [742, 420], [772, 430], [774, 496], [726, 540], [566, 546]];
  f.part(sad, LTH({ maxShade: 20 }));
  X.clipDraw(f, E.smooth(sad), () => { X.stains(f, E.smooth(sad), [510, 390, 800, 560], P.charS, 0.04, 2.6, -1.3, 103, 0.8); f.stitches([[550, 480], [610, 490], [700, 486], [752, 476]], '#8a7a6a', 1); X.burnHole(f, [660, 512], 8, 0.2); });
  f.part(X.ribbon([[566, 402], [596, 412], [618, 470]], [14, 12, 10]), ST({ cast: false, maxShade: 3 })); f.part(X.ribbon([[742, 422], [772, 432], [774, 496]], [12, 12, 10]), ST({ cast: false, maxShade: 3 }));
  X.rivetRow(f, [[540, 478], [626, 482], [722, 474], [764, 450]], 30, 4.5, { col: '#4a4850' });
  f.part(X.ribbon([[680, 540], [690, 700], [700, 836]], [26, 26, 26]), LTH({ maxShade: 4 })); f.part([[678, 770], [712, 768], [714, 800], [678, 802]].map(q => [...q, 1]), ST({ cast: false, maxShade: 2 }));
  { const Hr = [660, 480], Kr = [714, 660], Ar = [676, 830];
    f.part(limb(Kr, Ar, 70, 50, { steps: 10, q: [[0.25, 0.2, 0.2]] }), ST({ maxShade: 12 }));
    f.part(limb(Hr, Kr, 96, 74, { steps: 10, p: [[0.4, 0.1, 0.2]] }), ST({ maxShade: 14 }));
    X.clipDraw(f, E.smooth(limb(Hr, Kr, 96, 74)), () => { for (const t of [0.3, 0.6]) f.line([lp(Hr, Kr, t, 50), lp(Hr, Kr, t + 0.04, -50)], 2.4, '#0e0e12', { op: 0.8 }); X.scale(f, lerp(Hr, Kr, 0.5), 30, 40, 5, 0.7); f.line([lp(Hr, Kr, 0.1, 30), lp(Hr, Kr, 0.9, 24)], 3, '#9a9ca6', { op: 0.4 }); });
    G.poleyn(f, Kr, ang(Hr, Kr) + 0.2, 58, '#3a3c42', '#1a1a1e');
    f.part(ell(Hr, 50, 16, ang(Hr, Kr) - Math.PI / 2, 22), { fill: P.ashW, shade: 0.1, inkW: 1.3, inkHeavy: 1.4, cast: false, hatch: false }); f.flat(ell(Hr, 45, 12, ang(Hr, Kr) - Math.PI / 2, 22), '#040306'); f.flat(ell(add(Hr, [4, 2]), 18, 5, ang(Hr, Kr) - Math.PI / 2, 12), P.vioS);
    f.part(X.ribbon([[650, 500], [662, 680], [672, 820]], [16, 16, 16]), LTH({ maxShade: 3, cast: false }));
    B.boot(f, Ar, 1, 64, '#3a3c42', { style: 'sabaton', groundY: Ar[1] + 46, toe: 1.2 });
    f.part(X.ribbon([[632, 880], [652, 840], [702, 840], [724, 880]], [10, 10, 10, 10]), ST({ cast: false, maxShade: 2 })); f.part([[628, 876], [728, 876], [728, 888], [628, 888]].map(q => [...q, 1]), ST({ cast: false, maxShade: 2 })); }
  // ---- the neck: crested and muscled, arching back off the poll and broadening into the shoulder; the clean void hole
  // at its base (cut through)
  f.bone('neck');
  const neck = [[780, 450], [790, 360], [812, 270], [850, 196], [910, 150], hp(-20, -6), hp(0, -24), hp(30, 40), hp(40, 96), [968, 330], [986, 450], [996, 560], [984, 640], [900, 600], [820, 520]];
  const nD = E.smooth(neck);
  X.cutHoles(f, [[[870, 400], 24]], () => {
    f.part(neck, HD({ maxShade: 50 }));
    X.clipDraw(f, nD, () => {
      X.softTone(f, nD, [[[[800, 420], [820, 260], [900, 160], [980, 180], [920, 300], [860, 430]], hideL, 0.32, 14], [[[940, 300], [1000, 300], [1000, 640], [930, 600]], '#000', 0.3, 18], [[[780, 450], [840, 450], [860, 560], [780, 520]], '#000', 0.3, 16]]);
      X.crease(f, [hp(40, 90), [940, 300], [960, 420], [976, 540]], 3, { lit: hideL, op: 0.5 }); // the jugular groove
      X.crease(f, [hp(20, 30), [900, 260], [890, 380], [900, 520]], 3.2, { lit: hideL, op: 0.5 }); // the muscle from the jaw to the shoulder
      X.crease(f, [[830, 260], [870, 300], [900, 290]], 2.4, { lit: hideL, op: 0.4 }); X.crease(f, [[810, 360], [850, 400], [890, 400]], 2.4, { lit: hideL, op: 0.4 }); // the crest's folds
      patches(nD, [[[920, 470], 40, 60, 0.6], [[850, 240], 26, 40, 0.8]]);
      X.seam(f, [[812, 300], [850, 360], [880, 430], [900, 500]], 2.6); X.seam(f, [[940, 360], [960, 420], [966, 480]], 2);
    });
  }, { shape: nD });
  // the mane burned short: stubs of hair along the crest, smoking, ash curling up
  { const C = X.spline([[786, 446], [792, 360], [814, 270], [852, 196], [912, 150], hp(-14, -8)], 6); for (let i = 0; i < 16; i++) { const t = i / 15, b0 = C[Math.floor(t * (C.length - 1))], d = rot([-0.8, -0.6], R(f, -0.4, 0.4)), l = R(f, 12, 34) * (i % 3 === 1 ? 1.5 : 1); X.hairClump(f, [b0, add(b0, mul(d, l * 0.5)), add(add(b0, mul(d, l)), [R(f, -8, 8), R(f, -4, 4)])], R(f, 14, 24), { pal: ['#141012', '#2a2426', '#4a4244'], n: 3 }); f.line(ell(add(b0, mul(d, l + 3)), 4, 3, 0, 6).slice(0, 5), 1.6, '#050304'); } }
  X.smoke(f, [830, 260], 140, 40, { sway: 20, op: 0.35, col: '#2a2430', line: P.ashL, lineOp: 0.35, big: true }); X.ash(f, [840, 260], 14, 120, 160, 1.1);
  // ---- the head: a long, tapered skull; the ears pricked under the chanfron's crown
  f.bone('head');
  for (const [u, v, a, s] of [[4, 16, -0.15, 0.85], [-2, -6, 0.1, 1]]) { const b0 = hp(u, v), tip = add(b0, rot([0, -86 * s], a + 0.2)); const ear = [add(b0, [-16, 4]), add(lerp(b0, tip, 0.5), [-16, 0]), tip, add(lerp(b0, tip, 0.5), [14, 4]), add(b0, [18, 6])]; f.part(ear, HD({ fill: s < 1 ? mix(hide, '#000', 0.35) : hide, maxShade: 10 })); f.flat([lerp(b0, tip, 0.15), add(lerp(b0, tip, 0.5), [-6, 0]), lerp(b0, tip, 0.85), add(lerp(b0, tip, 0.5), [6, 2])], '#140e10', { op: 0.7 }); X.charEdge(f, [add(lerp(b0, tip, 0.5), [14, 4]), tip], 3, { gap: 5 }); }
  const head = HP([[-16, 12], [0, -24], [60, -40], [140, -38], [220, -30], [270, -22], [298, -8], [302, 14], [286, 30], [292, 44], [272, 58], [222, 56], [160, 66], [110, 94], [64, 108], [24, 100], [-8, 74]]);
  const hD = E.smooth(head);
  f.part(head, HD({ maxShade: 26 }));
  X.clipDraw(f, hD, () => {
    X.softTone(f, hD, [[HP([[0, 60], [280, 20], [290, 70], [0, 120]]), '#000', 0.38, 12], [HP([[20, -20], [260, -26], [260, -6], [20, 0]]), hideL, 0.3, 8]]);
    // the cheek's big round and the jowl, the jaw tapering to the chin, the bone of the face down to the muzzle
    X.crease(f, HP([[24, 40], [60, 18], [112, 30], [130, 62], [100, 96]]), 3, { lit: hideL, op: 0.6 });
    f.flat(ell(hp(78, 56), 34, 28, hA, 12), hideL, { op: 0.22 });
    X.crease(f, HP([[150, 46], [200, 30], [250, 22]]), 2.4, { lit: hideL, op: 0.45 });
    X.crease(f, HP([[246, 44], [272, 46], [284, 36]]), 2, { col: '#0a0607', op: 0.6, light: false }); // the lips' parting
    X.crease(f, HP([[258, 54], [268, 60]]), 1.6, { col: '#0a0607', op: 0.5, light: false }); // the chin's groove
    patches(hD, [[hp(120, 60), 22, 16, hA]]);
    X.hairline(f, HP([[170, 60], [200, 44], [230, 40]]), 1.4);
  });
  // the nostril, flared and smoking black
  { const nc = hp(268, 6); f.flat(ell(nc, 11, 6, hA + 0.5, 12).map((q, k) => k < 4 ? add(q, rot([0, -4], hA)) : q), '#050304'); f.line(ell(nc, 14, 9, hA + 0.5, 12).slice(0, 8), 2.2, INK); f.line(HP([[250, -6], [262, -14], [278, -10]]), 1.6, '#0a0607', { op: 0.6 }); f.line(ell(nc, 22, 15, hA + 0.5, 12).slice(1, 6), 1.4, hideL, { op: 0.4 }); X.smoke(f, add(nc, [14, 4]), 70, 22, { sway: 14, op: 0.5, col: '#140f16', line: P.ashD, drift: 40 }); }
  // the chanfron: a steel plate down the face from the poll to the nose, tapering with the face, a spike forward from
  // the brow, a flanged cup round the small eye
  const chf = HP([[-4, -30], [50, -48], [140, -46], [222, -36], [250, -24], [244, -8], [150, -14], [92, -10], [46, -4], [10, -10]]);
  f.part(chf, ST({ maxShade: 12 }));
  X.clipDraw(f, E.smooth(chf), () => { X.heatBloom(f, hp(130, -26), 50, 20, hA); X.scale(f, hp(130, -26), 60, 14, 8, 0.7); X.seam(f, HP([[150, -40], [176, -28], [204, -32]]), 1.6); f.line(HP([[10, -36], [140, -44], [226, -34]]), 3, '#9a9ca6', { op: 0.45 }); X.plateSeam(f, HP([[104, -48], [108, -12]]), { t: 3 }); });
  X.rivetRow(f, HP([[10, -26], [100, -38], [214, -30]]), 34, 4, { col: '#5a5c64' });
  { const b0 = hp(62, -46), d = rot([1, 0], hA - Math.PI / 2 + 0.5); f.part([add(b0, rot([0, -14], hA)), add(b0, mul(d, 70)), add(b0, rot([0, 14], hA))], ST({ maxShade: 4 })); } // the spike
  { const ec = hp(56, -14); f.part(ell(ec, 24, 18, hA, 14), ST({ cast: false, maxShade: 6 })); f.flat(ell(ec, 14, 9, hA, 12), '#050405'); f.flat(ell(add(ec, [2, 1]), 7, 3.6, hA - 0.2, 8), P.vioD); f.flat(ell(add(ec, [2, 1]), 3, 1.8, hA - 0.2, 6), P.vio); f.line(ell(ec, 16, 10, hA, 12).slice(7, 12), 1.6, '#0a0606'); } // the eye: small, an ember under the brow
  // the jaw (it drops a little when the horse tosses its head)
  f.bone('jaw');
  f.part(HP([[160, 54], [222, 52], [272, 54], [292, 44], [282, 64], [240, 72], [170, 74]]), HD({ fill: mix(hide, '#000', 0.3), light: mix(hideL, '#000', 0.3), maxShade: 6, cast: false, inkW: 1.2, inkHeavy: 1.6 }));
  f.flat(HP([[250, 46], [284, 40], [282, 52], [248, 56]]), '#120a0c');
  // the bit and the bridle
  f.bone('head');
  { const bc = hp(278, 34); f.part(ell(bc, 14, 14, 0, 12), ST({ cast: false, maxShade: 3 })); f.flat(ell(bc, 7, 7, 0, 10), '#050405'); f.part(X.ribbon([hp(0, -20), hp(30, 50), hp(140, 50), bc], [12, 12, 12, 12]), LTH({ cast: false, maxShade: 3 })); f.part(X.ribbon([hp(200, -32), hp(230, 30), bc], [10, 10, 10]), LTH({ cast: false, maxShade: 3 })); f.part(X.ribbon([hp(30, -26), hp(40, 60)], [10, 10]), LTH({ cast: false, maxShade: 3 })); }
  f.bone('reins');
  { const bc = hp(278, 34); X.rope(f, [bc, add(bc, [-30, 140]), add(bc, [-80, 340]), add(bc, [-120, 560]), [1060, gy - 4], [980, gy - 2]], 7, '#3a302c', { lit: false }); f.part(X.ribbon([bc, add(bc, [-10, 60])], [10, 10]), LTH({ cast: false, maxShade: 2 })); }
  // ---- the peytral cloth over the chest and shoulder, hung from the neck's base: folds from the top, the hem burned
  // into tongues, a window burned through
  f.bone('spine_2');
  { const pHem = [...X.charHem(f, [1000, 700], [930, 830], 5, 30, [0, 1]), ...X.charHem(f, [930, 830], [800, 760], 6, 36, [0, 1]).slice(1)];
    const pc = [[790, 450], [860, 470], [930, 530], [978, 600], [1002, 660], ...pHem, [780, 600]];
    const pD = E.smooth(pc);
    f.part(pc, CAP({ maxShade: 30 }));
    X.clipDraw(f, pD, () => {
      X.softTone(f, pD, [[[[780, 600], [1010, 680], [1010, 840], [780, 840]], '#000', 0.38, 16], [[[860, 470], [990, 600], [960, 640], [850, 520]], '#fff', 0.14, 12]]);
      drape(pD, [[[[812, 466], [806, 600], [816, 740]], 26], [[[862, 480], [872, 620], [874, 790]], 30], [[[912, 520], [932, 640], [926, 810]], 28], [[[958, 572], [976, 660], [972, 740]], 20], [[[890, 640], [896, 720]], 14]]);
      X.softTone(f, pD, [[[...pHem.map(q => add(q, [0, -70])), ...pHem.slice().reverse().map(q => add(q, [0, 10]))], P.charS, 0.5, 20]]);
      { const c = [900, 700], w = ell(c, 26, 40, 0.3, 12).map(q => add(q, [R(f, -6, 6), R(f, -6, 6)])); f.part(w, BU({ fill: '#2a2224', cast: false, maxShade: 6 })); X.charEdge(f, [...w, w[0]], 3, { gap: 5 }); }
      X.burnHole(f, [840, 560], 9, 0.3); X.stains(f, pD, [770, 440, 1010, 840], P.charS, 0.022, 2.8, -1.35, 107, 0.7);
    });
    X.charEdge(f, pHem, 6, { gap: 6 }); X.charEdge(f, [[780, 600], [790, 450]], 4, { gap: 8 });
    f.part(X.ribbon([[790, 452], [870, 466], [940, 520], [984, 590]], [16, 16, 16, 16]), LTH({ cast: false, maxShade: 3 })); X.rivetRow(f, [[800, 452], [940, 520]], 40, 4, { col: '#4a4850' }); } // the breast strap it hangs from
  // ---- near foreleg, lifted, pawing
  leg('fn', false);
  // ---- ash on the floor, scuffed by the pawing hoof
  f.bone('root');
  X.ashHeap(f, [960, gy], 200, 14); X.ashprint(f, [400, gy + 4], 2); X.ashprint(f, [880, gy + 4], 2);
  return f;
}

// ------------------------------------------------------------------ THE IRON BULL (ruler, 3.5 at the shoulder)
// The inquisition's iron bull, a hollow engine of execution heated from beneath, and the heretics who died in it: they
// were put inside to be heard and they are still being heard. Rebuilt in the independent review so it reads as a brazen
// bull and not a horse-headed barrel on columns.
// True size: 3.5 at the shoulder (2240 px). The canvas is heightened to 2400 x 2300 at the same pixel scale (GUIDE
// section 2) so the hump rises out of the frame top instead of being cut off above the belly; the hindquarters run out of
// the frame on the far side from the party. Seen from a standing man's chest, below the belly and a little in front:
//   - the barrel rounds away from us toward the hindquarters: the top line drops and the belly line rises toward the
//     back, cast ring seams curve with their bellies toward the rear (the chest end is the visible end) and turn under
//     the belly onto a dark underside plane; the back is lit along its top, the flank falls into shadow;
//   - a massive shoulder hump over a cast shoulder plate (scapula, point of the shoulder, triceps), a short thick neck
//     with heavy crest folds, and a deep dewlap hanging in folds from the throat to between the forelegs;
//   - a broad, short bull's head lowered and turned toward the party: a wide flat forehead with cast poll curls, horns
//     from wide ringed bosses (the far horn sweeping out and up, the near horn snapped off short), ears set out under the
//     horns, a brow ridge over each empty socket, a broad square muffle with flared nostrils fitted with iron pipes, an
//     iron ring through the septum, the jaw hinged and hanging open on black fire;
//   - bull legs cast in bronze: heavy forearm and gaskin masses, a bony knee, the hock's point, flat cannons, fetlocks
//     with dewclaws, cloven hooves; a casting parting line down each leg, flash, sprue stubs, pits and green in the
//     crevices. The far legs stand higher on the hearth's top face and darker.
// Fire splits the plate seams into violet-lipped cracks with black fire inside; the void has bitten clean round holes
// through the flank and the faces of the condemned press against the iron from inside, eyes open (eyes: bible).
// Gear: hatch with bar, strap hinges and a melted padlock; nostril pipes; nose ring and chain to a floor staple; horns
// (one snapped); a band of judgement round the neck in red rubric, half burned; ladder to the hatch; hearth of firebricks
// with two arches and two bellows nozzles; popped rivets, ash heaps, charred bones and a skull; a poker; floor rings.
// Rig (the Motion line): root (hearth, floor, fire, ladder, poker) ; body (the bull, legs, neck band) > head > jaw,
// nose_ring > nose_chain, pipe_smoke. Idle: smoke curling from the pipes, the iron ticking (body shudders a degree);
// attack: a bellow (head lifts, jaw drops, the pipes blast black fire as an engine effect).
function ironBull() {
  const CW = 2400, CH = 2300, seed = 1320;
  const f = new Fig(X.base(seed, CH, { grimeY: 1900 })); X.textures(f);
  const gy = f.o.groundY; // 2270
  const IRN = (o = {}) => Object.assign({ fill: '#3a383c', shadow: '#09080a', light: '#77737c', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2.2, inkHeavy: 4.4 }, o);
  const BRZ = (o = {}) => Object.assign({ fill: '#3c322c', shadow: '#0a0706', light: '#76624f', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2.2, inkHeavy: 4.4 }, o); // blackened cast bronze
  const WOOD = (o = {}) => Object.assign({ fill: '#3a302a', shadow: '#0e0a08', light: '#6a5a4e', shade: 0.4, tex: 'grain' + seed, texOp: 0.55 }, o);
  const hTop = 2040; // the hearth's front top edge
  const PL = [1990, 800], hd = (x, y) => [PL[0] + x, PL[1] + y * 0.86]; // the poll; head points are offsets from it
  const H = pts => pts.map(([x, y, k]) => k ? [...hd(x, y), 1] : hd(x, y));
  const jawHinge = hd(-226, 380);
  f.joint('body', [900, 900]).joint('head', [1860, 700], 'body').joint('jaw', jawHinge, 'head').joint('nose_ring', hd(25, 622), 'head').joint('nose_chain', hd(25, 730), 'nose_ring').joint('pipe_smoke', hd(30, 600), 'head');

  // ================= root: the floor, the hearth
  f.bone('root');
  for (const [c, r] of [[[2050, gy - 6], 46], [[2290, gy - 12], 40], [[1960, gy + 8], 34]]) { const e = ell(c, r, r * 0.26, 0, 22); f.line(e.concat([e[0]]), 13, '#0a080a'); f.line(e.concat([e[0]]), 9, '#3a383c'); f.line(e.slice(12, 20), 3, '#77737c', { op: 0.5 }); f.part([add(c, [-12, -r * 0.26 - 6]), add(c, [12, -r * 0.26 - 6]), add(c, [10, -r * 0.26 + 6]), add(c, [-10, -r * 0.26 + 6])], IRN({ cast: false, inkW: 1.4, inkHeavy: 2 })); X.soot(f, c, r * 1.6, r * 0.5, 0.45); }
  const hx0 = -80, hx1 = 1820;
  X.hearth(f, hx0, hx1, hTop, gy, 170, { bh: 34, bw: 104 });
  for (const [ax, aw] of [[520, 260], [1120, 300]]) { const arch = [[ax - aw / 2, gy], [ax - aw / 2, gy - 120], [ax - aw * 0.36, gy - 170], [ax, gy - 192], [ax + aw * 0.36, gy - 170], [ax + aw / 2, gy - 120], [ax + aw / 2, gy]]; f.flat(arch, '#040305'); X.clipDraw(f, arch, () => { X.flameSheet(f, [[ax - aw / 2, gy], [ax, gy - 4], [ax + aw / 2, gy]], [[ax - aw * 0.3, 150, 60, -0.05], [ax, 190, 70, 0.0], [ax + aw * 0.28, 140, 56, 0.08]], { edgeW: 2.4, wisps: false, scraps: false }); }); f.line(arch, 6, '#0a0808'); X.rivetRow(f, [[ax - aw / 2 - 16, gy - 120], [ax - aw * 0.38, gy - 186], [ax, gy - 208], [ax + aw * 0.38, gy - 186], [ax + aw / 2 + 16, gy - 120]], 34, 6, { col: '#3a383c' }); }
  for (const [x, y] of [[820, gy - 70], [1520, gy - 64]]) { const nz = [[x - 60, y - 30], [x + 40, y - 18], [x + 40, y + 18], [x - 60, y + 30], [x - 110, y + 36], [x - 110, y - 36]]; f.part(nz, IRN({ maxShade: 10 })); f.part(ell([x + 40, y], 12, 20, 0, 12), IRN({ cast: false, maxShade: 3 })); f.flat(ell([x + 42, y], 6, 12, 0, 10), '#050405'); X.rivetRow(f, [[x - 100, y - 30], [x - 100, y + 30]], 20, 4, { col: '#3a383c' }); X.sootStreaks(f, [x + 20, y - 20], 4, 120, 30, { op: 0.5 }); }

  // ---- a bull's leg cast in bronze, in one outline. pts: elbow/stifle (inside the body), forearm/gaskin, knee/hock,
  // cannon, fetlock, coronet; ws: widths; base: the y the hoof stands on; dim: darkening for the far legs
  const castLeg = (pts, ws, dim, o = {}) => {
    const look = BRZ({ fill: mix('#3c322c', '#000', dim), light: mix('#7a6654', '#000', dim), maxShade: 60 });
    const shape = K.chain(pts, ws, { steps: 12, bp: o.bp, bq: o.bq });
    // the cloven hoof under the coronet: the far claw a little behind and darker, then the near claw, the cleft between
    const T = pts[pts.length - 1], hw = ws[ws.length - 1] * 1.3, hh = Math.max(110, o.base - T[1] + 46), base = o.base;
    const claw = (c, w, h, fill) => { const q = [[c[0] - w * 0.42, base, 1], [c[0] + w * 0.78, base, 1], [c[0] + w * 0.6, base - h * 0.3], [c[0] + w * 0.08, base - h, 1], [c[0] - w * 0.42, base - h * 0.82], [c[0] - w * 0.58, base - h * 0.4], [c[0] - w * 0.5, base - h * 0.1]]; f.part(q, BRZ({ fill, light: mix('#8e7864', '#000', dim), maxShade: 14, cast: false })); X.clipDraw(f, q, () => { for (let i = 0; i < 3; i++) f.line([[c[0] - w * 0.5, base - h * (0.3 + i * 0.2)], [c[0] + w * 0.5, base - h * (0.2 + i * 0.22)]], 1.6, '#050404', { op: 0.5 }); f.line([[c[0] + w * 0.2, base - h * 0.95], [c[0] + w * 0.5, base - h * 0.3]], 3, '#a88e78', { op: 0.35 * (1 - dim) }); }); return q; };
    claw([T[0] + hw * 0.22, 0], hw * 0.5, hh * 0.9, mix('#2e2620', '#000', dim));
    f.part(shape, look);
    const D = E.smooth(shape);
    X.clipDraw(f, D, () => {
      const nrm = (i, k) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], d = E.norm(sub(b, a)); return add(pts[i], mul([-d[1], d[0]], k * ws[i])); };
      // form: the lit front (toward the light), the dark back, the muscle masses modelled
      X.softTone(f, D, [[pts.map((_, i) => nrm(i, -0.48)).concat(pts.map((_, i) => nrm(i, -0.1)).reverse()), '#c0a488', 0.16 * (1 - dim), 18], [pts.map((_, i) => nrm(i, 0.52)).concat(pts.map((_, i) => nrm(i, 0.18)).reverse()), '#000', 0.5, 20]]);
      if (o.muscle) for (const [c, rx, ry, a] of o.muscle) { X.softTone(f, D, [[ell(add(c, [rx * 0.25, -ry * 0.25]), rx * 0.7, ry * 0.6, a, 14), '#c8ac90', 0.18 * (1 - dim), 22], [ell(add(c, [-rx * 0.35, ry * 0.3]), rx * 0.8, ry * 0.7, a, 14), '#000', 0.3, 22]]); X.crease(f, ell(c, rx, ry, a, 16).slice(9, 15), 3.4, { col: '#050404', lit: '#a88e78', op: 0.55 }); }
      // the casting's parting line down the side, with a thin fin of flash
      const pl = pts.map((_, i) => nrm(i, -0.06));
      f.line(pl, 4.6, '#050404', { op: 0.55 }); f.line(pl.map(q => add(q, [-3, -2])), 2, '#b09478', { op: 0.4 * (1 - dim) });
      X.sootStreaks(f, add(T, [0, -10]), 7, 520, ws[3] * 0.4, { op: 0.45 });
      X.stains(f, D, E.bbox(shape).map((v, i) => v + (i < 2 ? -20 : 20)), '#2a3a30', 0.03, 2.4, -1.5, Math.round(pts[0][0]) % 97, 0.35); // green in the casting's crevices
      X.scale(f, lerp(pts[1], pts[2], 0.5), ws[1] * 0.3, 120, 8, 1.4);
      for (let i = 0; i < 6; i++) { const q = lerp(pts[1], pts[4], f.r()); f.flat(ell(add(q, [R(f, -20, 20), 0]), R(f, 2, 5), R(f, 2, 4), 0, 6), '#050404', { op: 0.7 }); } // casting pits
      // knee or hock: bony, creased across the front; the fetlock creased
      for (const k of [2, 4]) { X.crease(f, [nrm(k, -0.45), add(pts[k], [0, 8]), nrm(k, 0.4)], 4, { col: '#050404', lit: '#a88e78', op: 0.6 }); X.crease(f, [add(nrm(k, -0.4), [0, -26]), add(pts[k], [0, -18]), add(nrm(k, 0.3), [0, -24])], 2.4, { col: '#050404', op: 0.4, light: false }); }
      if (o.crack) X.seam(f, o.crack, 4);
    });
    // dewclaws at the back of the fetlock; a sprue stub left on the casting
    const back = add(pts[4], [-ws[4] * 0.55, 14]); f.part([add(back, [6, -18]), add(back, [-22, -4]), add(back, [-18, 18]), add(back, [8, 12])], BRZ({ fill: mix('#2e2620', '#000', dim), cast: false, maxShade: 4, inkW: 1.4 }));
    if (o.sprue) { const s0 = add(pts[2], [-ws[2] * 0.52, -40]); f.part([add(s0, [6, -12]), add(s0, [-24, -10]), add(s0, [-26, 10]), add(s0, [6, 12])], BRZ({ fill: mix('#5a4a3e', '#000', dim), cast: false, maxShade: 4, inkW: 1.4 })); f.flat(ell(add(s0, [-25, 0]), 3, 9, 0, 8), '#a08a72', { op: 0.5 }); }
    const near = claw([T[0] - hw * 0.08, 0], hw * 0.62, hh, mix('#3a302a', '#000', dim));
    f.stroke([[T[0] + hw * 0.14, base - hh * 0.9], [T[0] + hw * 0.18, base - hh * 0.5], [T[0] + hw * 0.2, base]], 7, '#050404'); // the cleft
    X.ashCake(f, [T[0], base - 6], hw * 0.7, 6, 6, 1.1, 0.6);
    return near;
  };

  // ================= the far legs (body bone), higher on the hearth's top face and darker
  f.bone('body');
  castLeg([[1270, 1100], [1282, 1350], [1296, 1610], [1300, 1720], [1304, 1820], [1324, 1894]], [360, 300, 168, 122, 150, 136], 0.45, { base: hTop - 78, bq: [[0, 0.7, 0.14, 0.25], [2, 0.0, 0.1, 0.1], [4, 0.0, 0.1, 0.12]], bp: [[0, 0.5, 0.1, 0.25], [2, 0.05, 0.12, 0.08], [4, 0.0, 0.16, 0.12]] });
  castLeg([[560, 1060], [530, 1300], [466, 1580], [476, 1700], [496, 1800], [518, 1884]], [340, 290, 156, 116, 144, 130], 0.45, { base: hTop - 86, bp: [[0, 0.55, 0.24, 0.22], [2, 0.0, 0.32, 0.07]], bq: [[0, 0.2, 0.1, 0.2], [4, 0.0, 0.1, 0.12]] });

  // ================= root: black fire on the hearth top under the belly (it gives no light); ash, bone and rivets
  f.bone('root');
  X.flameSheet(f, [[380, hTop - 50], [700, hTop - 66], [1000, hTop - 70], [1250, hTop - 60]], [[440, 300, 96, -0.05], [640, 430, 120, 0.0], [850, 360, 110, 0.05], [1060, 480, 126, -0.02], [1220, 330, 100, 0.06]], { edgeW: 2.6 });
  for (const [c, w, h] of [[[1500, hTop - 4], 300, 50], [[300, hTop - 4], 260, 46], [[1680, hTop - 76], 200, 34], [[700, hTop - 2], 220, 30]]) X.ashHeap(f, c, w, h, { n: 8 });
  for (const [a, b] of [[[1320, hTop - 28], [1400, hTop - 48]], [[1640, hTop - 18], [1720, hTop - 30]], [[100, hTop - 22], [180, hTop - 38]]]) { f.part(limb(a, b, 16, 13, { steps: 4 }), { fill: P.boneD, shadow: P.boneS, light: P.bone, shade: 0.35, inkW: 1.4, inkHeavy: 2, cast: false, maxShade: 4 }); f.part(ell(b, 11, 13, 0, 8), { fill: P.boneD, shadow: P.boneS, shade: 0.35, inkW: 1.2, cast: false, hatch: false }); f.flat(ell(lerp(a, b, 0.5), 10, 4, ang(a, b), 8), P.charS, { op: 0.8 }); }
  { const sk = [1600, hTop - 40]; f.part([add(sk, [-26, 10]), add(sk, [-30, -14]), add(sk, [-8, -32]), add(sk, [20, -26]), add(sk, [30, -4]), add(sk, [20, 14])], { fill: P.boneD, shadow: P.boneS, light: P.bone, shade: 0.35, inkW: 1.4, cast: false, maxShade: 4 }); f.flat(ell(add(sk, [8, -12]), 6, 5, 0, 8), '#0a0808'); f.flat(ell(add(sk, [-10, -10]), 5, 5, 0, 8), '#0a0808'); }
  for (const q of [[1380, hTop - 12], [1560, hTop - 10], [1590, hTop - 56], [360, hTop - 10], [190, hTop - 60], [1740, hTop - 70], [880, hTop - 8]]) { f.part(ell(q, 9, 5, 0, 10), IRN({ cast: false, inkW: 1.2, inkHeavy: 1.4, maxShade: 3 })); f.part(limb(add(q, [0, -2]), add(q, [14, 6]), 6, 5, { steps: 3 }), IRN({ cast: false, inkW: 1, inkHeavy: 1, maxShade: 2 })); }

  // ================= the near legs, drawn before the body so the barrel's lower edge overlaps their tops
  f.bone('body');
  castLeg([[260, 1060], [236, 1340], [168, 1650], [182, 1770], [208, 1880], [240, 1958]], [420, 340, 172, 130, 164, 148], 0, { base: hTop - 14, bp: [[0, 0.55, 0.3, 0.24], [2, 0.0, 0.42, 0.07]], bq: [[0, 0.15, 0.14, 0.18], [4, 0.0, 0.1, 0.12]], muscle: [[[220, 1300], 140, 210, 0.2]] });
  castLeg([[1450, 1100], [1462, 1380], [1476, 1680], [1480, 1790], [1484, 1890], [1514, 1966]], [460, 380, 200, 146, 180, 162], 0, { base: hTop, crack: [[1430, 1320], [1446, 1430], [1438, 1530]], bq: [[0, 0.65, 0.16, 0.26], [2, 0.0, 0.12, 0.1], [4, 0.0, 0.1, 0.12]], bp: [[0, 0.45, 0.12, 0.25], [2, 0.05, 0.14, 0.08], [4, 0.0, 0.18, 0.12]], muscle: [[[1500, 1360], 150, 210, 0.05], [[1396, 1370], 84, 190, -0.05]] });

  // ================= the barrel
  const body = [[-200, 360], [150, 250], [500, 140], [850, 20], [1100, -150], [1380, -340], [1640, -180], [1780, 120], [1860, 420], [1900, 700], [1880, 1000], [1840, 1220], [1720, 1270], [1600, 1250], [1500, 1220], [1300, 1250], [1000, 1246], [700, 1200], [480, 1140], [380, 1150], [200, 1160], [-200, 1120]];
  const bD = E.smooth(body);
  const holes = [[[420, 600], 92], [[1150, 830], 60]];
  const under = [[1600, 1010], [1300, 1030], [1000, 1036], [700, 1000], [480, 966], [300, 990], [-200, 990], [-200, 1120], [200, 1120], [380, 1094], [480, 1076], [700, 1124], [1000, 1162], [1300, 1162], [1500, 1130], [1600, 1150]];
  X.cutHoles(f, holes, () => {
    f.part(body, IRN({ maxShade: 110 }));
    X.clipDraw(f, bD, () => {
      // form: the back lit along its top, the shoulder dome and the hip turned to the light; the flank falls into shadow
      // toward the belly and toward the hindquarters, which recede
      X.softTone(f, bD, [
        [[[-200, 380], [150, 270], [500, 160], [850, 40], [1100, -130], [1380, -320], [1640, -160], [1700, 0], [1300, 60], [900, 200], [500, 320], [100, 430], [-200, 520]], '#b4b0be', 0.26, 50],
        [ell([1560, 360], 200, 300, 0.1, 18), '#c4c0cc', 0.2, 60],
        [ell([150, 560], 200, 190, 0, 16), '#aeaab8', 0.15, 50],
        [[[-200, 820], [1700, 860], [1700, 1300], [-200, 1300]], '#000', 0.4, 60],
        [[[-200, 300], [60, 300], [60, 1200], [-200, 1200]], '#000', 0.3, 60],
        [ell([1290, 760], 120, 260, 0.1, 16), '#000', 0.4, 40],
        [ell([620, 360], 160, 110, 0.3, 14), '#000', 0.25, 40]]); // the flank's hollow in front of the hip
      X.heatBloom(f, [900, 360], 260, 160); X.heatBloom(f, [1500, 520], 140, 160);
      X.sootStreaks(f, [700, 1100], 22, 520, 900, { op: 0.4 });
      X.stains(f, bD, [-220, -360, 1920, 1200], P.charS, 0.012, 3, -1.5, 111, 0.4);
      // the cast shoulder plate: scapula from under the hump to the point of the shoulder, the triceps behind, the elbow
      const shoulder = [[1420, -60], [1640, -120], [1720, 300], [1700, 700], [1610, 1000], [1450, 1130], [1300, 1020], [1260, 620], [1300, 200]];
      X.plateSeam(f, X.spline(shoulder.concat([shoulder[0]]), 12), { t: 8, rivets: 54, rr: 8, popped: 0.12, side: -1 });
      X.crease(f, [[1520, 0], [1500, 340], [1440, 640]], 6, { col: '#050404', lit: '#a8a4ae', op: 0.55 }); // the spine of the scapula
      // the hip plate and the hook bone standing out under it
      X.plateSeam(f, [[-200, 430], [60, 340], [300, 380], [460, 620], [430, 900], [380, 1070]], { t: 7, rivets: 52, rr: 8, popped: 0.2, side: 1 });
      f.part(ell([170, 400], 70, 52, -0.3, 16), IRN({ fill: '#46444a', light: '#9a96a2', cast: true, maxShade: 18, inkW: 1.8, inkHeavy: 3 }));
      // ring seams round the barrel, curving with their bellies toward the rear (the chest end is the visible end),
      // tighter toward the back; each turns under the belly onto the underside plane
      for (const [pts, und] of [[[[1060, -110], [980, 300], [960, 700], [1010, 1110]], [[1010, 1100], [1050, 1250]]], [[[690, 60], [600, 400], [590, 760], [650, 1080]], [[650, 1070], [690, 1200]]], [[[330, 190], [210, 520], [210, 830], [280, 1050]], [[280, 1040], [310, 1150]]]]) { X.plateSeam(f, pts, { t: 7, rivets: 50, rr: 8, popped: 0.18 }); X.plateSeam(f, und, { t: 5, rivets: 0 }); }
      // the long seam along the barrel's widest line, converging toward the back
      X.plateSeam(f, [[-200, 680], [300, 660], [800, 650], [1270, 690]], { t: 7, rivets: 56, rr: 8, popped: 0.15, side: -1 });
      // the hump: heavy cast folds of the crest over the withers
      for (const [a, b, c] of [[[1180, -100], [1300, -170], [1440, -150]], [[1150, 10], [1290, -50], [1450, -20]], [[1200, 120], [1330, 80], [1470, 110]]]) X.crease(f, [a, b, c], 8, { col: '#050404', lit: '#b4b0bc', op: 0.6 });
      X.scale(f, [700, 520], 600, 260, 60, 2.2); X.scale(f, [1560, 400], 100, 300, 16, 2);
      // the underside: the barrel turning under, seen from below, falls to near black; a faint lit turn where it rounds
      X.softTone(f, bD, [[[[-200, 1060], [480, 1050], [700, 1100], [1000, 1130], [1300, 1130], [1600, 1110], [1600, 1300], [-200, 1300]], '#050406', 0.6, 24]]);
      f.line([[1560, 1110], [1300, 1120], [1000, 1122], [700, 1090], [480, 1046], [300, 1066], [-200, 1060]], 2.4, '#77737c', { op: 0.22 });
      X.rivetRow(f, [[-200, 1090], [300, 1100], [700, 1140], [1300, 1180], [1580, 1170]], 58, 7, { col: '#28262a', popped: 0.25 });
      // seams split by the heat: violet-lipped cracks with black fire inside
      for (const crack of [[[1000, 200], [990, 380], [976, 540]], [[620, 540], [602, 700], [610, 860], [630, 990]], [[1480, 300], [1520, 460], [1500, 620]]]) X.seam(f, crack, 9);
      X.flames(f, [[1000, 210], [990, 380], [978, 530]], 6, 50, 130, 40, { side: 1, rise: 0.7, edgeW: 2.4, band: true });
      X.flames(f, [[620, 560], [604, 700], [610, 850]], 5, 40, 110, 34, { side: 1, rise: 0.7, edgeW: 2.4, band: true });
      // the hatch: an iron door in perspective (the nearer, right edge taller), on two strap hinges, barred, padlocked
      const door = [[640, 420], [930, 396], [936, 706], [646, 714]], hc = [790, 558];
      f.flat(door.map(q => add(q, [-12, 14])), '#000', { op: 0.6 });
      f.part(door.map(q => [...q, 1]), IRN({ fill: '#46444a', maxShade: 30 }));
      f.part([door[2], add(door[2], [14, 10]), add(door[3], [14, 10]), door[3]].map(q => [...q, 1]), IRN({ fill: '#121014', cast: false, maxShade: 3 }));
      f.part([door[1], add(door[1], [14, 10]), add(door[2], [14, 10]), door[2]].map(q => [...q, 1]), IRN({ fill: '#1a181c', cast: false, maxShade: 3 }));
      X.clipDraw(f, door.map(q => [...q, 1]), () => { X.heatBloom(f, hc, 120, 90); X.scale(f, hc, 120, 90, 12, 1.4); f.line([door[0], door[1]].map(q => add(q, [0, 8])), 4, '#8a8690', { op: 0.5 }); X.rivetRow(f, [add(door[0], [20, 20]), add(door[1], [-20, 16]), add(door[2], [-20, -16]), add(door[3], [20, -20]), add(door[0], [20, 30])], 46, 7, { col: '#3a383c' }); });
      for (const y of [hc[1] - 80, hc[1] + 76]) { f.part([[560, y - 18], [830, y - 18], [830, y + 14], [560, y + 18]].map(q => [...q, 1]), IRN({ fill: '#2e2c30', maxShade: 6 })); f.part(ell([636, y], 18, 26, 0, 12), IRN({ cast: false, maxShade: 4 })); f.rivet([600, y], 6, '#77737c'); f.rivet([800, y - 2], 6, '#77737c'); }
      f.part([[590, hc[1] - 24], [990, hc[1] - 40], [990, hc[1] - 4], [590, hc[1] + 12]].map(q => [...q, 1]), IRN({ fill: '#2a282c', maxShade: 8 }));
      for (const x of [612, 966]) f.part(X.ribbon([[x - 20, hc[1] - 44], [x - 20, hc[1] + 24], [x + 20, hc[1] + 24], [x + 20, hc[1] - 44]], [12, 12, 12, 12]), IRN({ cast: false, maxShade: 3 }));
      { const lk = [870, hc[1] + 20]; f.part([add(lk, [-30, -20]), add(lk, [30, -22]), add(lk, [36, 30]), add(lk, [20, 60]), add(lk, [10, 96]), add(lk, [0, 60]), add(lk, [-14, 80]), add(lk, [-24, 44]), add(lk, [-36, 30])], IRN({ fill: '#3e3c42', light: '#8a8690', maxShade: 10 })); f.line([add(lk, [-20, -10]), add(lk, [10, -8]), add(lk, [24, 20])], 2.4, '#a8a4ae', { op: 0.5 }); X.heatBloom(f, add(lk, [0, 20]), 40, 40); }
      X.ashCake(f, [700, 200], 700, 40, 34, 1.6, 0.5);
    });
  }, { shape: bD });
  // in the void holes: the dark inside the bull, and the faces of the condemned pressed against the iron from inside
  for (const [[c, r], faces] of [[holes[0], [[-40, -20, 0.9], [44, 30, 0.7], [-10, 56, 0.55]]], [holes[1], [[-14, 6, 0.8], [30, -26, 0.5]]]]) {
    X.clipDraw(f, ell(c, r, r, 0, 40), () => {
      f.flat(ell(c, r + 4, r + 4, 0, 32), '#030204');
      f.flat(ell(add(c, [r * 0.2, r * 0.2]), r * 0.6, r * 0.5, 0, 16), P.vioS, { op: 0.7 });
      for (const [dx, dy, k] of faces) {
        const fc = add(c, [dx, dy]), s2 = r * 0.6 * k, F = frame(fc, 0.1 + dx * 0.004, s2);
        f.part(F([[-0.5, -0.6], [0.1, -0.8], [0.5, -0.5], [0.6, 0.1], [0.4, 0.7], [0.0, 0.9], [-0.45, 0.6], [-0.6, 0.0]]), { fill: mix('#6a6264', '#000', 0.6 - k * 0.4), shadow: '#060405', light: '#9a9094', shade: 0.4, tex: 'mottle' + seed, texOp: 0.4, inkW: 1.4, inkHeavy: 2, cast: false, maxShade: s2 * 0.3 });
        for (const ex of [-0.22, 0.24]) { f.flat(F(ell([ex, -0.12], 0.15, 0.1, 0, 10)), '#a49c9a', { op: 0.85 }); f.flat(F(ell([ex + 0.02, -0.12], 0.06, 0.06, 0, 8)), '#0a0608'); f.line(F([[ex - 0.18, -0.24], [ex, -0.3], [ex + 0.18, -0.22]]), 1.6, INK, { op: 0.8 }); }
        f.flat(F(ell([0.0, 0.46], 0.16, 0.2, 0, 10)), '#080406');
        f.line(F([[0.0, -0.1], [0.06, 0.18], [-0.04, 0.24]]), 1.4, INK, { op: 0.6 });
        for (const hx of [-0.6, 0.62]) f.part(F([[hx, 0.4], [hx * 1.4, 0.2], [hx * 1.5, 0.6], [hx * 1.1, 0.8]]), { fill: mix('#5a5254', '#000', 0.6 - k * 0.4), inkW: 1, inkHeavy: 1.2, cast: false, hatch: false, maxShade: 3 });
      }
      f.flat(ell(add(c, [-r * 0.3, -r * 0.3]), r * 1.1, r * 0.9, 0, 18), '#000', { op: 0.35 });
    });
  }
  for (const x of [100, 400, 700, 1000]) X.ash(f, [x, 300 - x * 0.28], 10, 120, 200, 1.6);

  // ---- the neck: short and thick, heavy crest folds; the band of judgement round it in red rubric, half burned
  X.clipDraw(f, bD, () => {
    for (const [a, b, c] of [[[1660, 160], [1730, 260], [1780, 380]], [[1620, 300], [1700, 420], [1750, 560]], [[1640, 600], [1720, 700], [1800, 760]], [[1660, 820], [1730, 900], [1810, 950]]]) X.crease(f, [a, b, c], 7, { col: '#050404', lit: '#a8a4ae', op: 0.55 });
    const C = X.spline([[1480, 40], [1620, 330], [1700, 640], [1730, 940], [1780, 1220]], 6), band = X.ribbon(C, C.map((_, i) => 130 - 30 * Math.abs(i / C.length - 0.45)));
    f.line(X.offsetLine(C, () => -70), 16, '#050405', { op: 0.7 }); // the step down behind the band (its thickness)
    f.part(band, IRN({ fill: '#2e2c30', light: '#6a666e', maxShade: 24 }));
    X.clipDraw(f, E.smooth(band), () => {
      X.softTone(f, E.smooth(band), [[X.offsetLine(C, () => 70).concat(X.offsetLine(C, () => 20).reverse()), '#a8a4b0', 0.25, 14], [X.offsetLine(C, () => -20).concat(X.offsetLine(C, () => -70).reverse()), '#000', 0.5, 16]]);
      for (let i = 4; i < C.length - 4; i += 5) { if (f.r() < 0.3) continue; const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; for (let k = 0; k < 2; k++) f.line([add(add(C[i], mul(d, k * 14)), mul(n, -36)), add(add(C[i], mul(d, k * 14 + R(f, -6, 6))), mul(n, 30))], 7, P.rubric, { op: 0.92 }); f.line([add(add(C[i], mul(d, -4)), mul(n, -36)), add(add(C[i], mul(d, 22)), mul(n, -36))], 6, P.rubric, { op: 0.9 }); }
      for (const k of [0.22, 0.62, 0.8]) { const c = C[Math.floor(C.length * k)]; X.soot(f, c, 50, 34, 0.6, 1.2); X.scale(f, c, 50, 40, 6, 1.4); } // burned away: the lettering gone under scale and soot
      X.rivetRow(f, X.offsetLine(C, () => 52), 54, 7, { col: '#3a383c' }); X.rivetRow(f, X.offsetLine(C, () => -52), 54, 7, { col: '#3a383c', popped: 0.2 });
    });
    f.line(X.offsetLine(C, () => 64), 3, '#9a96a2', { op: 0.45 }); // the lit lip toward the head
    X.charEdge(f, X.offsetLine(C.slice(20, 40), () => -58), 6, { gap: 6 });
  });
  // ---- the dewlap: a deep fold of cast iron hanging from the throat to between the forelegs
  { const dw = [[1880, 960], [1890, 1140], [1850, 1300], [1780, 1420], [1700, 1450], [1630, 1400], [1590, 1300], [1570, 1200], [1610, 1140], [1700, 1150], [1800, 1060]];
    f.part(dw, IRN({ fill: '#343236', maxShade: 40 }));
    X.clipDraw(f, E.smooth(dw), () => {
      X.softTone(f, E.smooth(dw), [[[[1800, 900], [1900, 900], [1900, 1350], [1800, 1350]], '#a8a4b0', 0.16, 30], [[[1560, 1280], [1760, 1340], [1720, 1460], [1560, 1460]], '#000', 0.45, 30]]);
      for (const [a, b] of [[[1630, 1180], [1660, 1390]], [[1700, 1160], [1730, 1430]], [[1770, 1120], [1790, 1380]], [[1840, 1060], [1860, 1280]]]) X.crease(f, [a, lerp(a, b, 0.5).map((v, i) => v + (i ? 0 : 8)), b], 8, { col: '#050404', lit: '#a8a4ae', op: 0.6 });
      X.scale(f, [1720, 1280], 100, 80, 10, 1.6); X.sootStreaks(f, [1700, 1440], 6, 260, 100, { op: 0.4 });
      X.seam(f, [[1740, 1180], [1760, 1280], [1750, 1370]], 5);
    });
  }

  // ================= root: the ladder against the flank up to the hatch, the poker on the hearth
  f.bone('root');
  { const L0 = [690, hTop + 10], L1 = [790, 730], d = E.norm(sub(L1, L0)), n = [-d[1], d[0]], w = 50;
    for (const s2 of [-1, 1]) f.part(limb(add(L0, mul(n, s2 * w)), add(L1, mul(n, s2 * w)), 20, 18, { steps: 12 }), WOOD({ fill: s2 > 0 ? '#2e2620' : '#3a302a', maxShade: 6 }));
    for (let t = 0.06; t < 0.98; t += 0.075) { const a = add(lerp(L0, L1, t), mul(n, -w)), b = add(lerp(L0, L1, t + 0.01), mul(n, w)); f.part(limb(a, b, 14, 14, { steps: 4 }), WOOD({ cast: false, maxShade: 3 })); }
    X.clipDraw(f, E.smooth(limb(L0, L1, w * 2 + 30, w * 2 + 30)), () => { X.stains(f, E.smooth(limb(L0, L1, w * 2 + 30, w * 2 + 30)), [500, 600, 900, 2100], P.charS, 0.03, 2.6, -1.3, 113, 0.9); });
    X.charEdge(f, [add(L0, mul(n, -w - 10)), add(lerp(L0, L1, 0.3), mul(n, -w - 10))], 5, { gap: 7 }); }
  f.part(limb([2150, gy], [1830, hTop - 360], 22, 18, { steps: 12 }), IRN({ maxShade: 6 })); f.part(ell([1830, hTop - 360], 22, 26, 0, 12).map((q, i) => i % 3 ? q : add(q, [6, -4])), IRN({ cast: false, maxShade: 4 })); f.part([[2150, gy], [2180, gy - 40], [2190, gy - 6]], IRN({ cast: false }));

  // ================= the head: broad and short, lowered and turned toward the party
  f.bone('head');
  // the far ear and the far horn (out sideways from its wide ringed boss, then up and forward)
  { const e0 = hd(160, 110), tip = hd(330, 170); f.part([add(e0, [0, -40]), lerp(e0, tip, 0.5).map((v, i) => v + (i ? -34 : 0)), tip, lerp(e0, tip, 0.6).map((v, i) => v + (i ? 30 : 0)), add(e0, [0, 40])], IRN({ fill: '#2e2c30', maxShade: 16 })); f.flat([lerp(e0, tip, 0.2), lerp(e0, tip, 0.55).map((v, i) => v + (i ? -12 : 0)), lerp(e0, tip, 0.85), lerp(e0, tip, 0.5).map((v, i) => v + (i ? 14 : 0))], '#0a080a', { op: 0.7 }); }
  const horn = (pts, w0, w1, o = {}) => {
    const C = X.spline(pts, 6), sh = X.ribbon(C, C.map((_, i) => w0 + (w1 - w0) * Math.pow(i / (C.length - 1), 0.8)));
    f.part(sh, IRN({ fill: o.fill || '#424046', light: '#a4a0ac', maxShade: 34 }));
    X.clipDraw(f, E.smooth(sh), () => {
      X.softTone(f, E.smooth(sh), [[X.offsetLine(C, () => w0 * 0.3).concat(X.offsetLine(C, () => w0 * 0.05).reverse()), '#c4c0cc', 0.25, 10], [X.offsetLine(C, () => -w0 * 0.5).concat(X.offsetLine(C, () => -w0 * 0.15).reverse()), '#000', 0.45, 12]]);
      for (let i = 3; i < C.length - 3; i += 3) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]], w = (w0 + (w1 - w0) * i / C.length) * 0.55; f.line([add(C[i], mul(n, w)), add(add(C[i], mul(d, -6)), mul(n, 0)), add(C[i], mul(n, -w))], 3, '#050404', { op: 0.55 }); }
      X.scale(f, C[Math.floor(C.length * 0.4)], 40, 40, 8, 1.2); X.heatBloom(f, C[Math.floor(C.length * 0.5)], 50, 40);
    });
    return { C, sh };
  };
  f.part(ell(hd(170, 12), 88, 74, -0.3, 20), IRN({ fill: '#3a383e', maxShade: 20 })); // the far boss
  horn([hd(170, 10), hd(270, -26), hd(336, -110), hd(346, -236), hd(296, -350)], 130, 16);
  // the jaw: hinged at the cheek, hanging open on a dark mouth with black fire deep in it
  f.bone('jaw');
  { const mouth = H([[-120, 636], [170, 640], [160, 720], [40, 762], [-90, 730]]);
    f.flat(mouth, '#030203');
    X.clipDraw(f, mouth, () => X.blackFlame(f, hd(30, 760), 140, 90, { noFork: true, edgeW: 2.2, wisps: false, scraps: false }));
    const jaw = H([[-232, 380], [-206, 540], [-150, 690], [-60, 800], [40, 830], [130, 806], [178, 736], [160, 716], [40, 760], [-90, 732], [-150, 620], [-196, 470]]);
    f.part(jaw, IRN({ fill: '#36343a', maxShade: 30 }));
    X.clipDraw(f, E.smooth(jaw), () => { X.softTone(f, E.smooth(jaw), [[H([[-240, 380], [-120, 600], [-60, 840], [-240, 840]]), '#000', 0.45, 20], [H([[40, 760], [180, 730], [150, 830], [40, 830]]), '#b0acb8', 0.18, 16]]); X.plateSeam(f, H([[-190, 470], [-120, 680], [-20, 770], [130, 760]]), { t: 5, rivets: 40, rr: 6, side: -1 }); X.scale(f, hd(-60, 760), 80, 30, 6, 1.4); for (let i = 0; i < 3; i++) f.line(H([[-40 + i * 50, 790], [-36 + i * 50, 818]]), 1.6, '#050404', { op: 0.5 }); });
  }
  f.bone('head');
  // the head mass: the near cheek and jowl (turned from the light), then the forehead plane
  const head = H([[-200, -10], [-120, -46], [0, -56], [110, -46], [178, -4], [184, 90], [168, 230], [150, 360], [162, 470], [182, 560], [176, 640], [80, 668], [-40, 664], [-130, 640], [-200, 540], [-246, 420], [-262, 280], [-246, 120]]);
  f.part(head, IRN({ fill: '#38363c', maxShade: 80 }));
  const forehead = H([[-150, 20], [-90, -22], [0, -36], [100, -28], [162, 4], [172, 90], [156, 220], [136, 360], [148, 470], [166, 560], [160, 636], [60, 660], [-40, 656], [-112, 626], [-104, 520], [-84, 400], [-110, 270], [-152, 140]]);
  X.clipDraw(f, E.smooth(head), () => {
    X.softTone(f, E.smooth(head), [[H([[-262, 100], [-150, 100], [-130, 640], [-262, 640]]), '#000', 0.5, 30]]);
    f.part(forehead, IRN({ fill: '#525058', light: '#a8a4b0', cast: false, maxShade: 40, inkW: 1.8, inkHeavy: 2.4 }));
    X.clipDraw(f, E.smooth(forehead), () => {
      X.softTone(f, E.smooth(forehead), [[H([[0, -40], [170, -10], [160, 300], [40, 300]]), '#c8c4d0', 0.22, 40], [H([[-120, 300], [0, 330], [0, 520], [-110, 520]]), '#000', 0.3, 30]]);
      // the curly poll between the horns: rows of cast knobs, lit on top, sooted beneath
      for (let i = 0; i < 16; i++) { const c = hd(R(f, -120, 130), R(f, -30, 70) + (i % 3) * 8), rr = R(f, 15, 28), a0 = f.r() * 6; f.part(ell(c, rr, rr * 0.8, a0, 12).map((q, k) => k % 3 ? q : add(q, [R(f, -4, 4), R(f, -4, 4)])), IRN({ fill: '#4a4850', light: '#a8a4b0', cast: true, castOp: 0.3, inkW: 1.4, inkHeavy: 2, maxShade: 8 })); const sp = []; for (let k = 0; k < 7; k++) { const t2 = a0 + k * 0.9, r2 = rr * (0.8 - k * 0.1); sp.push(add(c, [Math.cos(t2) * r2, Math.sin(t2) * r2 * 0.8])); } f.line(sp, 2.2, '#050404', { op: 0.6 }); }
      // the forehead's broad flat (slightly dished) plane, the bridge, the cast mould line down the middle
      X.crease(f, H([[-40, 120], [-20, 260], [10, 420], [20, 540]]), 4, { col: '#050404', lit: '#b4b0bc', op: 0.4 });
      X.plateSeam(f, H([[100, 110], [80, 300], [70, 480]]), { t: 5, rivets: 44, rr: 6, side: -1 });
      X.heatBloom(f, hd(20, 260), 120, 80); X.scale(f, hd(0, 380), 100, 140, 14, 1.4);
      X.seam(f, H([[60, 140], [74, 220], [60, 300]]), 5); X.seam(f, H([[-60, 420], [-40, 480], [-56, 540]]), 4);
      // the muffle: broad, square, wrinkled, the flared nostrils
      X.crease(f, H([[-100, 520], [30, 506], [150, 520]]), 5, { col: '#050404', lit: '#b4b0bc', op: 0.6 });
      for (let i = 0; i < 4; i++) f.line(H([[-90, 560 + i * 20], [30, 552 + i * 22], [150, 562 + i * 20]]), 1.6, '#050404', { op: 0.4 });
    });
    // the near cheek: the jowl and the masseter as cast bulges in the shadow
    X.crease(f, H([[-150, 140], [-210, 260], [-220, 400], [-160, 560]]), 6, { col: '#050404', lit: '#77737c', op: 0.6 });
    X.crease(f, H([[-130, 380], [-190, 430], [-200, 520]]), 4, { col: '#050404', op: 0.5, light: false });
    X.plateSeam(f, H([[-240, 140], [-250, 300], [-230, 440]]), { t: 5, rivets: 40, rr: 6, side: 1 });
    X.scale(f, hd(-200, 300), 40, 120, 10, 1.4);
  });
  // brow ridges over the empty sockets; black flame burning behind them
  for (const [u, v, rx, ry, a] of [[-118, 236, 40, 30, -0.3], [150, 226, 16, 28, 0.1]]) {
    const c = hd(u, v), e = ell(c, rx, ry, a, 16);
    f.part(ell(add(c, [u < 0 ? 6 : -4, -ry * 0.9]), rx * 1.3, ry * 0.55, a, 14), IRN({ fill: '#4e4c54', light: '#a8a4b0', cast: true, maxShade: 8, inkW: 1.6, inkHeavy: 2.4 }));
    f.flat(ell(c, rx + 10, ry + 8, a, 16), '#050404', { op: 0.6 }); f.flat(e, '#030203');
    X.clipDraw(f, e, () => X.blackFlame(f, add(c, [0, ry * 0.8]), ry * 2.4, rx * 0.9, { noFork: true, edgeW: 2, wisps: false, scraps: false }));
    f.line([...e.slice(8), e[0]], 2.6, '#9a96a2', { op: 0.45 });
  }
  // the near ear, set out sideways under the near horn, and the near boss with its snapped horn
  { const e0 = hd(-190, 100), tip = hd(-390, 190); const ear = [add(e0, [0, -46]), lerp(e0, tip, 0.5).map((v, i) => v + (i ? -40 : 0)), tip, lerp(e0, tip, 0.6).map((v, i) => v + (i ? 36 : 0)), add(e0, [0, 46])]; f.part(ear, IRN({ fill: '#3e3c42', maxShade: 20 })); f.flat([lerp(e0, tip, 0.15), lerp(e0, tip, 0.55).map((v, i) => v + (i ? -18 : 0)), lerp(e0, tip, 0.88), lerp(e0, tip, 0.5).map((v, i) => v + (i ? 16 : 0))], '#0a080a', { op: 0.75 }); X.charEdge(f, [lerp(e0, tip, 0.6).map((v, i) => v + (i ? 30 : 0)), tip], 4, { gap: 6 }); }
  f.part(ell(hd(-168, 26), 100, 82, 0.3, 20), IRN({ fill: '#424046', light: '#a4a0ac', maxShade: 24 }));
  for (let i = 0; i < 3; i++) f.line(ell(hd(-168, 26), 100 - i * 18, 82 - i * 15, 0.3, 20).slice(10, 18), 3, '#050404', { op: 0.5 }); // the boss's rings
  { const hn = horn([hd(-170, 20), hd(-266, -10), hd(-320, -84), hd(-330, -150)], 150, 92, { fill: '#46444c' });
    const end = hn.C[hn.C.length - 1], d = E.norm(sub(end, hn.C[hn.C.length - 4])), n = [-d[1], d[0]];
    const br = [add(end, mul(n, 46)), add(add(end, mul(n, 30)), mul(d, 30)), add(add(end, mul(n, 8)), mul(d, 12)), add(add(end, mul(n, -10)), mul(d, 40)), add(add(end, mul(n, -30)), mul(d, 18)), add(end, mul(n, -46)), add(add(end, mul(d, -10)), mul(n, -10)), add(add(end, mul(d, -4)), mul(n, 20))];
    f.part(br, IRN({ fill: '#77737c', light: '#b8b4c0', cast: false, maxShade: 6, inkW: 1.6, inkHeavy: 2 })); // the snapped face, pale fractured iron
    X.hairline(f, [add(end, mul(n, 10)), add(add(end, mul(n, 4)), mul(d, -30)), add(add(end, mul(n, 12)), mul(d, -60))], 2.4); f.line([add(add(end, mul(n, 30)), mul(d, 4)), add(add(end, mul(n, -6)), mul(d, 14))], 2, '#3a383e', { op: 0.7 }); // the fracture's ridges
  }
  // the iron pipes fitted in the nostrils, short flared trumpets pointing at the party
  for (const [u, v, s2] of [[-50, 588, 1.4], [104, 594, 1.6]]) { const b0 = hd(u, v), d = E.norm([0.72, 0.7]), tip = add(b0, mul(d, 100 * s2)), n = [-d[1], d[0]]; f.flat(ell(b0, 30, 22, 0.4, 12), '#050404'); const pipe = [add(b0, mul(n, 18)), add(lerp(b0, tip, 0.7), mul(n, 16)), add(tip, mul(n, 30 * s2)), add(tip, mul(n, -30 * s2)), add(lerp(b0, tip, 0.7), mul(n, -16)), add(b0, mul(n, -18))]; f.part(pipe, IRN({ fill: '#46444a', maxShade: 12 })); f.part(ell(tip, 12 * s2, 30 * s2, Math.atan2(d[1], d[0]), 14), IRN({ fill: '#2a282c', cast: false, maxShade: 4 })); f.flat(ell(add(tip, mul(d, 3)), 7 * s2, 22 * s2, Math.atan2(d[1], d[0]), 12), '#030203'); X.rivetRow(f, [add(b0, mul(n, 16)), add(b0, mul(n, -16))], 16, 5, { col: '#3a383c' }); X.sootStreaks(f, add(b0, [0, -10]), 3, 120, 20, { op: 0.4 }); }
  f.bone('pipe_smoke');
  for (const [u, v, s2] of [[-50, 588, 1.4], [104, 594, 1.6]]) { const tip = add(hd(u, v), mul(E.norm([0.72, 0.7]), 110 * s2)); X.smoke(f, tip, 300, 60, { sway: 30, op: 0.5, col: '#140f16', line: P.ashD, big: true, drift: 60 }); }
  f.bone('head');
  f.part(ell(jawHinge, 34, 40, 0.3, 16), IRN({ fill: '#2e2c30', cast: false, maxShade: 8 })); f.part(ell(jawHinge, 14, 14, 0, 12), IRN({ cast: false, maxShade: 3 })); f.flat(ell(jawHinge, 5, 5, 0, 8), '#050404');
  // the nose ring through the septum, swinging, its chain down to a staple in the floor
  f.bone('nose_ring');
  { const nr = hd(25, 690); const e = ell(nr, 46, 60, 0.1, 22); f.line(e.concat([e[0]]), 22, '#060507'); f.line(e.concat([e[0]]), 15, '#3e3c42'); f.line(e.slice(14, 21), 4, '#9a96a2', { op: 0.55 }); f.line(e.slice(2, 7), 3, '#050404', { op: 0.6 }); }
  f.bone('nose_chain');
  { const nr = hd(30, 752); X.ironChain(f, X.spline([nr, add(nr, [60, 200]), add(nr, [130, 420]), [2270, gy - 30]], 10), 60, 14, '#3a383c'); f.part([[2240, gy - 36], [2304, gy - 36], [2310, gy], [2234, gy]].map(q => [...q, 1]), IRN({ cast: false, maxShade: 4 })); }
  return f;
}

// ------------------------------------------------------------------ THE CONFESSOR (ruler, 4)
// The cathedral's confessor, who heard every heretic's last confession, and the great confessional he sat in: confess,
// and be forgiven; then burn, to be certain. A confessional the size of a chapel, black oak carved like a small
// cathedral in three bays: the confessor's curtained seat in the middle, a penitent's kneeler and grille on each side.
// Its pinnacles rise out of the frame top (true size 4.0, 2560 px; canvas widened to 2000 x 1800). Seen from a little
// to the right and below (a standing man's chest), so the booth has a front face and a right side receding, the steps
// show their treads, the canopies overhang. Inside the middle bay the confessor sits huge and charred, filling it like a
// man in a coffin, head bowed under a charred cowl in the booth's shadow, the lips burned away from the teeth, the jaw
// still moving in absolution, the eyes closed; black flame burns inside the booth and comes out through every hole in
// the carving. One charred hand rests out through the curtain on the armrest, a rosary of burned beads hanging from it.
// The oak is split along the grain into violet-edged seams; the carved tracery chars and curls upward into ash; the void
// has opened clean round holes in the woodwork and eyes look out of some of them (the bible calls for them). Two
// penitents kneel at the side grilles, charred to their kneelers, their fingers hooked through the pierced oak, still
// whispering. Gear: a violet stole with its fringe burned to stubs; a charred rope girdle; the curtain burned to rags; a
// list of sins nailed to the door in red rubric; a hanging lamp burning black flame; iron door hinges warped by heat; a
// poor-box slot in the base; a slate of penances chalked in a column; a bell-pull hanging from the canopy; heaps of ash
// on the steps; the penitents' caps and rosaries; kneelers worn hollow.
// Rig (the Motion line): root (the booth, steps) ; curtain ; head > jaw (the confessor) ; arm > hand (the reach) ;
// penitent_l > penitent_l_head ; penitent_r > penitent_r_head ; lamp ; bell_pull. Idle: the curtain stirring, the jaw
// murmuring, the penitents' heads nodding. Attack: the hand reaches out to draw a hero to the grille.
function confessor() {
  const CW = 2000, CH = 1800, seed = 1321;
  const f = new Fig(X.base(seed, CH, { grimeY: 1450 })); X.textures(f);
  const gy = f.o.groundY; // 1770
  const OAK = (o = {}) => Object.assign({ fill: '#2e2624', shadow: '#0a0707', light: '#5e504a', shade: 0.4, tex: 'grain' + seed, texOp: 0.6, inkW: 2, inkHeavy: 4 }, o);
  const CHR = (o = {}) => Object.assign({ fill: '#3a3234', shadow: '#080506', light: '#6a5e5e', shade: 0.4, tex: 'craze' + seed, texOp: 0.55 }, o);
  const base = 1630, dv = [170, -104]; // the booth stands on the steps at y 1630; its right side recedes up and to the right
  const x0 = 200, x1 = 1700, xa = 660, xb = 1240; // outer posts and the two inner posts
  const GH = [990, 640], GH_A = 0.32, H = 270; // the confessor's head (bowed), head height
  const SHO = [1150, 860], ELB = [1196, 1090], WR = [1290, 1158]; // his near arm to the armrest
  f.joint('curtain', [960, 300]).joint('head', [960, 800]).joint('jaw', frame(GH, GH_A, H)([[-0.08, 0.3]])[0], 'head').joint('arm', SHO).joint('hand', WR, 'arm');
  f.joint('penitent_l', [430, 1440]).joint('penitent_l_head', [440, 1120], 'penitent_l').joint('penitent_r', [1470, 1440]).joint('penitent_r_head', [1456, 1120], 'penitent_r');
  f.joint('lamp', [960, 180]).joint('bell_pull', [740, 300]);

  // ================= root: the steps, the booth's back and its dark insides
  f.bone('root');
  // the steps: two treads seen from above, edges worn bright, ash heaped on them
  for (const [y0, y1, xl, xr] of [[1690, gy, 60, 1940], [base, 1690, 130, 1880]]) { f.part([[xl, y0], [xr, y0], add([xr, y0], [60, -30]), add([xl, y0], [60, -30])].map(q => [...q, 1]), OAK({ fill: '#3a302c', maxShade: 10, cast: false })); f.part([[xl, y0], [xr, y0], [xr, y1], [xl, y1]].map(q => [...q, 1]), OAK({ fill: '#241e1c', maxShade: 20 })); f.line([[xl, y0 + 2], [xr, y0 + 2]], 3, '#7a6a60', { op: 0.45 }); X.clipDraw(f, [[xl, y0], [xr, y0], [xr, y1], [xl, y1]], () => { for (let x = xl + 40; x < xr; x += R(f, 120, 240)) f.line([[x, y0], [x + R(f, -4, 4), y1]], 2, '#0a0707', { op: 0.7 }); X.seam(f, [[xl + 300, y0 + 20], [xl + 600, y0 + 30], [xl + 900, y0 + 24]], 2); }); }
  // the booth's right side, receding (drawn first; the front overlaps its edge)
  const sideW = [[x1, base], add([x1, base], dv), add([x1, -900], dv), [x1, -900]];
  f.part(sideW.map(q => [...q, 1]), OAK({ fill: '#1e1918', maxShade: 40 }));
  X.clipDraw(f, sideW.map(q => [...q, 1]), () => { for (let y = base - 140; y > -900; y -= 300) { f.part([[x1 + 20, y], add([x1 + 20, y], mul(dv, 0.8)), add([x1 + 20, y - 220], mul(dv, 0.8)), [x1 + 20, y - 220]].map(q => [...q, 1]), OAK({ fill: '#262020', cast: false, maxShade: 6, inkW: 1.4 })); } X.stains(f, E.smooth(sideW.map(q => [...q, 1])), [x1, -900, x1 + 200, base], P.charS, 0.02, 2.8, -1.4, 121, 0.8); X.seam(f, [[x1 + 60, 300], [x1 + 70, 700], [x1 + 60, 1100]], 3); });
  // the dark inside the three bays, with black fire burning in it (it gives no light)
  const bayIn = (xl, xr, top, peak) => [[xl, base - 60, 1], [xl, top, 1], [xl + (xr - xl) * 0.2, top - (peak - 0) * 0.6], [(xl + xr) / 2, top - peak], [xr - (xr - xl) * 0.2, top - peak * 0.6], [xr, top, 1], [xr, base - 60, 1]];
  const bL = bayIn(x0 + 70, xa - 30, 640, 160), bC = bayIn(xa + 40, xb - 40, 380, 240), bR = bayIn(xb + 30, x1 - 70, 640, 160);
  for (const b of [bL, bC, bR]) f.flat(b, '#060405');
  X.clipDraw(f, bC, () => { X.flameSheet(f, [[700, 1500], [960, 1480], [1220, 1500]], [[720, 700, 120, -0.05], [840, 900, 140, 0.0], [1080, 860, 140, 0.04], [1200, 640, 110, 0.06]], { edgeW: 2.4, wisps: false }); f.flat(bC, '#000', { op: 0.35 }); });
  for (const b of [bL, bR]) X.clipDraw(f, b, () => { const cx = (b[0][0] + b[6][0]) / 2; X.flameSheet(f, [[b[0][0], 1560], [cx, 1550], [b[6][0], 1560]], [[cx - 120, 360, 90, -0.05], [cx + 60, 440, 100, 0.05]], { edgeW: 2.2, wisps: false }); f.flat(b, '#000', { op: 0.45 }); });

  // ================= the confessor, seated huge in the middle bay (rebuilt in the independent review: he is the focal
  // point). The booth's inside stays black, but he is ash-grey char and takes the key light where the curtain is open,
  // so he separates by value (the black fire behind him gives no light). A deep charred cowl over a bowed, modelled face:
  // closed lids, the brow knotted, the lips burned off the teeth, the jaw a little open on the absolution; a charred habit
  // draped over vast shoulders and a lap, folds pulling from the knees; the violet stole down both sides; the rope girdle;
  // the far hand on the lap holding the stole's end; the near arm out through the curtain to the armrest (drawn later).
  const RB = (o = {}) => Object.assign({ fill: '#4e4648', shadow: '#0c0809', light: '#8e8486', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 }, o);
  const SKN = (o = {}) => Object.assign({ fill: '#6e6466', shadow: '#1a1214', light: '#aca2a0', shade: 0.4, tex: 'craze' + seed, texOp: 0.45 }, o);
  X.clipDraw(f, bC, () => {
    // the dark of the booth is not flat: a dim grey hollow behind him so his outline reads (ambient, not a glow)
    X.softTone(f, E.smooth(bC.map(q => q.slice(0, 2))), [[ell([980, 760], 260, 420, 0, 18), '#2a2426', 0.7, 80]]);
    // the robe: shoulders under the cowl's drape, the chest, the belly over the girdle, the lap and knees toward us
    const robe = [[700, 900], [740, 800], [850, 770], [1000, 780], [1120, 800], [1190, 860], [1210, 980], [1196, 1110], [1230, 1200], [1256, 1290], [1250, 1400], [1236, 1540], [690, 1540]];
    const rD = E.smooth(robe);
    f.part(robe, RB({ maxShade: 70 }));
    X.clipDraw(f, rD, () => {
      X.softTone(f, rD, [
        [[[700, 780], [860, 800], [820, 1540], [690, 1540]], '#000', 0.55, 40], // the far side, away from the light
        [[[1060, 820], [1200, 860], [1210, 1080], [1080, 1060]], '#c4bab8', 0.22, 30], // the chest's front plane
        [[[900, 1200], [1250, 1230], [1250, 1300], [900, 1290]], '#c4bab8', 0.28, 22], // the top of the thighs, facing up
        [[[880, 1310], [1250, 1320], [1250, 1540], [880, 1540]], '#000', 0.35, 30]]); // under the knees
      // folds: from the shoulders down the chest to the girdle; tension folds from the knees back to the hips; deep
      // valleys hanging from the knees; the habit bunched over the girdle
      for (const pts of [[[820, 820], [840, 980], [860, 1130]], [[900, 800], [930, 960], [940, 1130]], [[980, 790], [1010, 900], [1000, 1000], [1030, 1130]], [[1040, 800], [1080, 930], [1070, 1030], [1110, 1120]], [[1130, 830], [1160, 960], [1150, 1110]], [[1190, 900], [1196, 1000], [1186, 1100]]]) X.crease(f, pts, 11, { col: '#050304', lit: '#aca2a2', op: 0.8 });
      for (const pts of [[[960, 1000], [1000, 1060], [1080, 1080]], [[1020, 900], [1060, 960], [1130, 980]], [[880, 1060], [940, 1100], [1000, 1110]]]) X.crease(f, pts, 6, { col: '#050304', lit: '#aca2a2', op: 0.55 }); // cross folds sagging between the hanging ones
      for (const pts of [[[1230, 1260], [1080, 1230], [900, 1240]], [[1230, 1300], [1060, 1290], [880, 1300]], [[1200, 1240], [1100, 1210], [960, 1210]]]) X.crease(f, pts, 8, { col: '#0a0607', lit: '#b0a6a6', op: 0.65 });
      for (const pts of [[[1240, 1330], [1236, 1430], [1244, 1540]], [[1150, 1330], [1140, 1440], [1150, 1540]], [[1010, 1320], [990, 1430], [1000, 1540]], [[880, 1320], [860, 1430], [870, 1540]]]) X.crease(f, pts, 12, { col: '#050304', lit: '#8a8082', op: 0.75 });
      X.stains(f, rD, [680, 760, 1270, 1560], P.charS, 0.02, 2.8, -1.35, 141, 0.75);
      X.crackNet(f, [1150, 1000], 1.6, 120, 3, { depth: 2 }); X.crackNet(f, [1180, 1380], 1.4, 110, 2.6, { depth: 1 });
      X.flakes(f, [1000, 1000], 200, 200, 14, 1.6); X.ashCake(f, [1080, 1240], 150, 30, 14, 1.4, 0.45);
      for (const [c, r] of [[[940, 1420], 22], [[1200, 950], 16]]) X.burnHole(f, c, r, 0.3);
    });
    X.charHem(f, [1236, 1540], [690, 1540], 7, 40, [0, 1]);
    // the rope girdle, knotted, its end hanging over the lap
    X.rope(f, [[700, 1150], [900, 1170], [1100, 1160], [1200, 1130]], 18, '#4a4038'); X.rope(f, [[1080, 1162], [1100, 1240], [1090, 1330], [1110, 1400]], 13, '#4a4038', { fray: true });
    f.part(ell([1080, 1164], 22, 18, 0.3, 12), { fill: '#4a4038', shadow: '#120e0c', light: '#7a6e62', shade: 0.4, inkW: 1.4, cast: false, maxShade: 6 });
    // the violet stole, hanging from the neck down both sides of the chest onto the lap, crosses stitched, fringe
    // burned to stubs
    for (const [C0, w] of [[[[880, 800], [870, 1000], [880, 1150], [920, 1270], [940, 1330]], 62], [[[1100, 810], [1120, 980], [1140, 1150], [1180, 1250], [1200, 1320]], 70]]) {
      const C = X.spline(C0, 6), st = X.ribbon(C, C.map(() => w));
      f.part(st, { fill: '#563270', shadow: '#140a1c', light: '#8e6aac', shade: 0.42, tex: 'weave' + seed, texOp: 0.45, maxShade: 22 });
      X.clipDraw(f, E.smooth(st), () => {
        X.softTone(f, E.smooth(st), [[X.offsetLine(C, () => -w * 0.5).concat(X.offsetLine(C, () => -w * 0.05).reverse()), '#000', 0.4, 8]]);
        X.stains(f, E.smooth(st), E.bbox(st).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 2.8, -1.35, Math.round(C0[0][0]), 0.85);
        for (const t of [0.25, 0.62]) { const c = C[Math.floor(C.length * t)]; f.line([add(c, [-w * 0.28, 0]), add(c, [w * 0.28, 0])], 4, '#a888c4', { op: 0.6 }); f.line([add(c, [0, -w * 0.32]), add(c, [0, w * 0.32])], 4, '#a888c4', { op: 0.6 }); }
        for (const t of [0.15, 0.45, 0.8]) { const c = C[Math.floor(C.length * t)]; X.crease(f, [add(c, [-w / 2, -6]), add(c, [0, 4]), add(c, [w / 2, -4])], 3, { col: '#0a0410', lit: '#a888c4', op: 0.5 }); }
      });
      const e = C[C.length - 1]; for (let i = 0; i < 7; i++) f.line([add(e, [-w / 2 + 4 + i * (w - 8) / 6, 0]), add(e, [-w / 2 + 4 + i * (w - 8) / 6 + R(f, -3, 3), R(f, 6, 16)])], 4, '#2a1a34');
      X.charEdge(f, [add(e, [-w / 2, 0]), add(e, [w / 2, 0])], 5);
    }
    // the far hand resting on the lap, the back of it toward us, holding the stole's end between finger and thumb
    { const h = X.openHand(f, [900, 1268], 0.9, 190, { look: SKN(), back: true, curl: 0.62, spread: 0.1, bend: [0.1, 0.15, 0.2, 0.3], thumbAng: 0.5, flip: true, tips: '#1a1214' });
      X.hairline(f, [add([900, 1268], [20, -10]), add([900, 1268], [60, 20])], 1.6); X.flakes(f, [920, 1300], 30, 20, 3, 1); }
  });
  const hz = frame(GH, GH_A, H), F = frame(GH, GH_A, H);
  f.bone('head');
  X.clipDraw(f, bC, () => {
    // the cowl's back and its drape over the shoulders (behind the head)
    const cowlB = hz([[0.2, -0.72], [-0.3, -0.72], [-0.66, -0.36], [-0.8, 0.2], [-0.84, 0.7], [-0.7, 1.0], [0.3, 1.0], [0.62, 0.7], [0.66, 0.2], [0.58, -0.36]]);
    f.part(cowlB, RB({ fill: '#332c2e', light: '#5e5658', maxShade: 40 }));
    X.clipDraw(f, E.smooth(cowlB), () => { for (const pts of [hz([[0.3, -0.7], [0.1, -0.2], [0.2, 0.6]]), hz([[-0.2, -0.72], [-0.5, -0.2], [-0.6, 0.7]]), hz([[0.6, 0.0], [0.5, 0.5], [0.3, 0.95]])]) X.crease(f, pts, 10, { col: '#050304', lit: '#6e6466', op: 0.6 }); });
    f.flat(hz([[0.5, -0.5], [0.1, -0.62], [-0.3, -0.5], [-0.46, 0.0], [-0.4, 0.6], [0.4, 0.7], [0.56, 0.2]]), '#080506', { op: 0.92 }); // the cowl's dark inside
    // the head: bowed, charred, modelled (face shading 0.8), eyes closed, the lips burned off the teeth
    const hd = B.head(f, GH, H, GH_A, { skin: '#6e6466', jaw: 1.06, chin: 0.02, nose: 1.1, hook: 0.25, mouth: 'set', squint: 1, browDown: 0.04, age: true, gaunt: true, blind: true, faceShade: 0.8, faceHatch: false, jawShade: 0.6, noEar: true, browCol: '#2a2224', browW: 0.03 });
    // the closed lids: a lid's curve over each eye, lashes burned off, a crease above, the brow knotted
    for (const [ex, w] of [[0.115, 0.06], [0.292, 0.03]]) { f.flat(F(ell([ex, -0.058], w, 0.026, 0.05, 10)), '#4a4042', { op: 0.9 }); f.line(F([[ex - w, -0.056], [ex, -0.04], [ex + w, -0.052]]), 2.2, '#0a0606'); f.line(F([[ex - w * 0.9, -0.08], [ex, -0.088], [ex + w * 0.9, -0.078]]), 1.2, '#1a1214', { op: 0.7 }); }
    f.line(F([[0.2, -0.15], [0.22, -0.11]]), 1.6, '#1a1214', { op: 0.8 }); f.line(F([[0.23, -0.16], [0.24, -0.12]]), 1.3, '#1a1214', { op: 0.7 }); // the knot between the brows
    // the mouth: lips burned away, the upper teeth and gums bare, the dark of the open mouth
    f.flat(F([[0.16, 0.255], [0.33, 0.262], [0.335, 0.33], [0.17, 0.335]]), '#0a0506');
    f.flat(F([[0.16, 0.25], [0.33, 0.255], [0.33, 0.268], [0.16, 0.266]]), '#4a2c30', { op: 0.9 }); // the shrunken gum
    for (let i = 0; i < 6; i++) { const u = 0.17 + i * 0.026; f.part(F([[u, 0.262], [u + 0.022, 0.263], [u + 0.02, 0.292 - (i % 2) * 0.004], [u + 0.003, 0.29]]), { fill: '#a89e8c', shadow: '#4a4236', shade: 0.4, inkW: 0.8, inkHeavy: 0.8, cast: false, hatch: false, maxShade: 2 }); }
    X.charEdge(f, F([[0.15, 0.24], [0.24, 0.236], [0.34, 0.245]]), 3, { gap: 5 }); // the burnt lip edge
    // char and cracks on the face, the cheekbone lit, the temple hollow
    X.clipDraw(f, F([[-0.3, -0.4], [0.2, -0.47], [0.36, -0.13], [0.33, 0.29], [0.13, 0.54], [-0.1, 0.48], [-0.3, 0.0]]), () => {
      X.softTone(f, E.smooth(F([[-0.3, -0.4], [0.2, -0.47], [0.36, -0.13], [0.33, 0.29], [0.13, 0.54], [-0.1, 0.48], [-0.3, 0.0]])), [[F([[-0.3, -0.5], [0.4, -0.5], [0.4, -0.16], [-0.3, -0.2]]), '#000', 0.45, 10], [F(ell([0.2, 0.1], 0.08, 0.05, 0.3, 10)), '#c8bebc', 0.35, 6]]); // the cowl's shadow over the brow; the lit cheekbone
      X.crackNet(f, F([[0.05, 0.1]])[0], 1.2, H * 0.22, 1.8, { depth: 1 }); X.hairline(f, F([[0.26, -0.3], [0.3, -0.2], [0.27, -0.12]]), 1.4);
      X.stains(f, E.smooth(F([[-0.3, -0.4], [0.2, -0.47], [0.36, -0.13], [0.33, 0.29], [0.13, 0.54], [-0.1, 0.48], [-0.3, 0.0]])), E.bbox(F([[-0.3, -0.5], [0.4, 0.6]])).map((v, i) => v + (i < 2 ? -10 : 10)), P.charS, 0.05, 2.6, -1.2, 171, 0.45);
      X.flakes(f, F([[0.1, 0.36]])[0], 20, 14, 4, 1);
    });
  });
  // the jaw, a little open on the absolution: lower teeth, the chin's char
  f.bone('jaw');
  X.clipDraw(f, bC, () => { const J = F([[0.17, 0.33], [0.33, 0.33], [0.33, 0.37], [0.3, 0.47], [0.13, 0.54], [0.0, 0.48], [0.1, 0.36]]);
      f.part(J, SKN({ fill: '#625a5c', light: '#8e8484', cast: false, maxShade: 10, inkW: 1.2, inkHeavy: 1.6 }));
      for (let i = 0; i < 5; i++) { const u = 0.18 + i * 0.026; f.part(F([[u, 0.336], [u + 0.022, 0.336], [u + 0.021, 0.31 + (i % 2) * 0.004], [u + 0.002, 0.312]]), { fill: '#968c7a', shadow: '#3a3228', shade: 0.4, inkW: 0.8, inkHeavy: 0.8, cast: false, hatch: false, maxShade: 2 }); }
      X.clipDraw(f, J, () => { X.softTone(f, E.smooth(J), [[F([[0.0, 0.42], [0.33, 0.42], [0.33, 0.56], [0.0, 0.56]]), '#000', 0.4, 6]]); });
  });
  f.bone('head');
  X.clipDraw(f, bC, () => {
    // the cowl's front edge framing the face, charred and curling, ash rising off it
    const rim = hz([[0.5, -0.44], [0.32, -0.68], [-0.1, -0.76], [-0.52, -0.56], [-0.7, -0.1], [-0.66, 0.42], [-0.46, 0.8], [-0.2, 0.62], [-0.16, 0.2], [-0.08, -0.26], [0.14, -0.5], [0.38, -0.47]]);
    f.part(rim, RB({ fill: '#3e3638', light: '#7a7072', maxShade: 30 }));
    X.clipDraw(f, E.smooth(rim), () => { X.softTone(f, E.smooth(rim), [[hz([[-0.7, -0.2], [-0.3, -0.2], [-0.3, 0.8], [-0.7, 0.8]]), '#000', 0.5, 14]]); X.crease(f, hz([[0.3, -0.6], [-0.1, -0.66], [-0.44, -0.46]]), 6, { col: '#0a0607', lit: '#a49a9a', op: 0.6 }); X.crease(f, hz([[-0.5, -0.2], [-0.52, 0.2], [-0.4, 0.6]]), 6, { col: '#0a0607', op: 0.6, light: false }); X.stains(f, E.smooth(rim), E.bbox(rim).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 3, -1.3, 131, 0.8); X.burnHole(f, hz([[-0.5, 0.3]])[0], 12, 0.3); });
    X.charEdge(f, hz([[0.38, -0.47], [0.14, -0.5], [-0.08, -0.26], [-0.16, 0.2]]), 7, { gap: 7 });
    X.ash(f, hz([[0.3, -0.7]])[0], 12, 100, 200, 1.6);
  });
  f.bone('root');
  // ================= the curtain, burned to rags, hanging from its rod across the middle bay
  f.bone('curtain');
  { const rodY = 300; f.part(limb([xa + 30, rodY], [xb - 30, rodY], 18, 18, { steps: 8 }), X.IRON(f, { maxShade: 4 }));
    for (const [cx, w, len] of [[730, 90, 1000], [800, 60, 300], [860, 44, 160], [1090, 50, 200], [1166, 90, 760]]) {
      const hem = X.charHem(f, [cx + w / 2, rodY + len], [cx - w / 2, rodY + len * R(f, 0.85, 1.05)], 4, 60, [0, 1]);
      const rag = [[cx - w / 2, rodY + 6], [cx + w / 2, rodY + 6], [cx + w / 2 + R(f, -10, 10), rodY + len * 0.5], ...hem, [cx - w / 2 + R(f, -10, 10), rodY + len * 0.5]];
      f.part(rag, { fill: '#33222e', shadow: '#0a0408', light: '#5a3e50', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, maxShade: 20 });
      X.clipDraw(f, E.smooth(rag), () => { X.folds(f, [[cx - w * 0.3, rodY + 10], [cx, rodY + 10], [cx + w * 0.3, rodY + 10]], len * 0.9, 4, '#0a0408', '#7a5a6c'); X.stains(f, E.smooth(rag), [cx - w, rodY, cx + w, rodY + len + 60], P.charS, 0.03, 2.8, -1.3, Math.round(cx), 0.85); });
      X.charEdge(f, hem, 6, { gap: 6 });
      for (const q of [[cx - w * 0.3, rodY], [cx + w * 0.3, rodY]]) { const e = ell(q, 10, 14, 0, 10); f.line(e.concat([e[0]]), 4, '#2a282c'); }
    }
    // black flame coming out through the rags
    X.flames(f, [[760, 1100], [800, 980], [860, 900]], 4, 60, 160, 40, { up: [0, -1], edgeW: 2.2 }); }
  // the hanging lamp burning black flame, on its chain from the canopy
  f.bone('lamp');
  { const top = [960, 180], lc = [960, 350]; X.ironChain(f, [top, add(lc, [0, -40])], 22, 5, P.iron); const lp2 = [add(lc, [-40, -40]), add(lc, [40, -40]), add(lc, [30, 20]), add(lc, [0, 40]), add(lc, [-30, 20])]; f.part(lp2, X.IRON(f, { maxShade: 10 })); X.rivetRow(f, [add(lc, [-34, -30]), add(lc, [34, -30])], 16, 4); X.blackFlame(f, add(lc, [0, -42]), 110, 34, { edgeW: 2 }); }
  // the bell-pull hanging from the canopy, a tassel at its end
  f.bone('bell_pull');
  { X.rope(f, [[740, 300], [744, 600], [738, 900], [742, 1040]], 9, '#4a2a40'); f.part(ell([742, 1044], 14, 12, 0, 10), { fill: '#3a2232', shadow: '#10080e', shade: 0.4, inkW: 1.2, cast: false, maxShade: 3 }); for (let i = 0; i < 9; i++) f.line([[730 + i * 3, 1054], [716 + i * 7 + R(f, -3, 3), 1090 + R(f, 0, 30)]], 3.4, i % 2 ? '#2a1a28' : '#4a2a40'); X.charEdge(f, [[712, 1096], [742, 1112], [776, 1100]], 3, { gap: 5 }); }

  // ================= the booth's carved front: posts with pinnacles, gables of charred tracery, panels, the base
  f.bone('root');
  // the panelled front below each bay (the seat front, the kneelers' boards), with the poor-box slot
  for (const [xl, xr, top] of [[x0, xa, 1500], [xa, xb, 1420], [xb, x1, 1500]]) {
    const pn = [[xl, top], [xr, top], [xr, base], [xl, base]];
    f.part(pn.map(q => [...q, 1]), OAK({ maxShade: 30 }));
    X.clipDraw(f, pn.map(q => [...q, 1]), () => { for (let x = xl + 30; x < xr - 60; x += 140) { const pp = [[x + 10, top + 24], [x + 120, top + 24], [x + 120, base - 20], [x + 10, base - 20]]; f.part(pp.map(q => [...q, 1]), OAK({ fill: '#261e1c', cast: false, maxShade: 6, inkW: 1.4 })); f.line([[x + 12, top + 26], [x + 118, top + 26]], 2.4, '#6a5a50', { op: 0.5 }); } X.stains(f, E.smooth(pn.map(q => [...q, 1])), [xl, top, xr, base], P.charS, 0.03, 2.8, -1.4, Math.round(xl), 0.8); X.seam(f, [[xl + 40, top + 40], [xl + 120, top + 90], [xl + 220, top + 70]], 2.6); });
  }
  { const pb = [954, 1520]; f.part([[pb[0] - 70, pb[1] - 26], [pb[0] + 70, pb[1] - 26], [pb[0] + 70, pb[1] + 26], [pb[0] - 70, pb[1] + 26]].map(q => [...q, 1]), X.IRON(f, { maxShade: 6 })); f.flat([[pb[0] - 46, pb[1] - 5], [pb[0] + 46, pb[1] - 5], [pb[0] + 46, pb[1] + 5], [pb[0] - 46, pb[1] + 5]], '#030202'); X.rivetRow(f, [[pb[0] - 60, pb[1] - 16], [pb[0] + 60, pb[1] - 16]], 30, 4); X.rivetRow(f, [[pb[0] - 60, pb[1] + 16], [pb[0] + 60, pb[1] + 16]], 30, 4); } // the poor-box slot
  // the kneelers inside the side bays: boards worn hollow where the knees go
  for (const [xl, xr] of [[x0 + 90, xa - 60], [xb + 60, x1 - 90]]) { f.part([[xl, 1440], [xr, 1440], [xr, 1500], [xl, 1500]].map(q => [...q, 1]), OAK({ fill: '#3a302c', maxShade: 6 })); f.flat(ell([(xl + xr) / 2, 1446], (xr - xl) * 0.3, 7, 0, 14), '#0e0a0a', { op: 0.7 }); f.line([[xl + 10, 1442], [xr - 10, 1442]], 2.4, '#7a6a60', { op: 0.5 }); }
  // the pierced oak grilles in the side bays' back walls (the partition's openings to the confessor), and the
  // penitents kneeling to them with their backs to us, charred to their kneelers, fingers hooked through the grille
  const grille = (cx) => { const g = [[cx - 70, 880, 1], [cx + 70, 880, 1], [cx + 70, 1120, 1], [cx - 70, 1120, 1]]; f.part(g, OAK({ fill: '#3a302c', maxShade: 10 })); X.clipDraw(f, g, () => { for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const q = [cx - 48 + c * 32, 906 + r * 46]; f.flat(ell(q, 9, 15, 0, 10), '#050304'); f.flat(ell(add(q, [2, 6]), 5, 6, 0, 8), P.vioS, { op: 0.6 }); } X.stains(f, E.smooth(g), [cx - 80, 870, cx + 80, 1130], P.charS, 0.05, 2.6, -1.3, Math.round(cx), 0.6); }); f.line([[cx - 72, 878], [cx + 72, 878]], 4, '#6a5a50', { op: 0.4 }); };
  grille(430); grille(1470);
  // the penitents kneel to the grilles with their backs to us (the grille is in the bay's back wall), charred to their
  // kneelers. Rebuilt in the independent review as people, not blocks: a bare charred back (spine furrow, shoulder blades
  // lifted by the raised arms, ribs and lats on the flanks), muscled arms raised to the grille with the hands' backs
  // toward us and the fingers hooked through the holes, a head bowed to the grille and turned in lost profile toward the
  // confessor's bay (ear, jaw line, cheek edge and brow tip), a charred skull cap; the sackcloth shift pulled down to the
  // waist and roped, its hem charred over the thighs; the soles of the feet toward us, fused to the board.
  const penitent = (pfx, cx, dir, bow) => {
    const SK2 = (o = {}) => Object.assign({ fill: '#5e5658', shadow: '#2c2426', light: '#9a9092', shade: 0.4, tex: 'craze' + seed, texOp: 0.5, inkW: 1.5, inkHeavy: 2.6 }, o);
    f.bone(pfx);
    const lean = dir * 18, sy = 1146;
    // the feet: soles toward us under the hips, heels, arches and toe pads, charred into the kneeler's board
    for (const sx of [-46, 40]) { const c = [cx + sx, 1452], sole = [add(c, [-22, -6]), add(c, [-16, -40]), add(c, [0, -50]), add(c, [16, -40]), add(c, [22, -6]), add(c, [10, 8]), add(c, [-10, 8])]; f.part(sole, SK2({ fill: '#4a4244', maxShade: 8, cast: false })); f.line([add(c, [-12, -34]), add(c, [0, -42]), add(c, [12, -34])], 1.6, '#0a0607', { op: 0.6 }); X.soot(f, add(c, [0, 2]), 22, 8, 0.8); X.hairline(f, [add(c, [-10, -10]), add(c, [2, -22]), add(c, [8, -30])], 1.1); }
    // the back and flanks, bare and charred, tapering from the shoulders to the waist
    const back = [[cx - 96, 1300], [cx - 104 + lean * 0.4, 1240], [cx - 116 + lean, 1170], [cx - 104 + lean, 1128], [cx - 50 + lean, 1110], [cx + 50 + lean, 1110], [cx + 104 + lean, 1128], [cx + 116 + lean, 1170], [cx + 104 + lean * 0.4, 1240], [cx + 96, 1300]];
    const bD = E.smooth(back);
    f.part(back, SK2({ maxShade: 30 }));
    X.clipDraw(f, bD, () => {
      X.softTone(f, bD, [[[[cx - 130, 1100], [cx - 30, 1100], [cx - 40, 1310], [cx - 130, 1310]], '#000', 0.4, 16], [[[cx + 20 + lean, 1118], [cx + 112 + lean, 1130], [cx + 100, 1250], [cx + 30, 1240]], '#b4aaa8', 0.28, 14]]);
      const sp = [[cx + lean, 1120], [cx + lean * 0.7, 1180], [cx + lean * 0.3, 1240], [cx + 2, 1300]];
      X.crease(f, sp, 4.4, { col: '#0a0607', lit: '#a49a9a', op: 0.7 }); // the spine's furrow
      for (const sd of [-1, 1]) { const s0 = [cx + lean + sd * 30, 1130]; X.crease(f, [add(s0, [sd * 14, 4]), add(s0, [sd * 46, 30]), add(s0, [sd * 72, 26]), add(s0, [sd * 80, -2])], 3.2, { col: '#0a0607', lit: '#aca2a2', op: 0.6 }); f.flat(ell(add(s0, [sd * 46, 12]), 26, 16, sd * 0.3, 10), '#c0b6b4', { op: sd * dir > 0 ? 0.18 : 0.08 }); } // the shoulder blades, lifted
      for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) X.crease(f, [[cx + sd * (70 - i * 4), 1196 + i * 22], [cx + sd * (90 - i * 2), 1206 + i * 22], [cx + sd * (100 - i * 2), 1220 + i * 22]], 2, { col: '#0a0607', op: 0.45, light: false }); // ribs on the flanks
      X.crackNet(f, [cx - 50, 1200], 1.0, 80, 2.2, { depth: 2 }); X.crackNet(f, [cx + 60 + lean, 1160], 2.2, 50, 1.8, { depth: 1 });
      X.soot(f, [cx - 70, 1270], 40, 26, 0.6); X.soot(f, [cx + 30, 1150], 30, 18, 0.45);
      X.flakes(f, [cx, 1230], 70, 50, 7, 1); X.ashCake(f, [cx, 1280], 70, 14, 8, 0.9, 0.5);
    });
    X.ash(f, [cx + lean, 1112], 10, 80, 140, 1.1);
    // the shift, pulled down to the waist, roped; charred hem over the thighs and onto the kneeler
    const sh = [[cx - 100, 1290], [cx + 100, 1290], [cx + 122, 1360], [cx + 126, 1440], [cx - 126, 1440], [cx - 122, 1360]];
    f.part(sh, SACK(seed, { fill: '#55514a', maxShade: 20 }));
    X.clipDraw(f, E.smooth(sh), () => { X.softTone(f, E.smooth(sh), [[[[cx - 130, 1290], [cx - 20, 1290], [cx - 30, 1440], [cx - 130, 1440]], '#000', 0.4, 14]]); X.crease(f, [[cx - 4, 1300], [cx - 2, 1360], [cx + 2, 1440]], 6, { col: '#14100e', lit: '#8e897d', op: 0.6 }); for (const sd of [-1, 1]) X.crease(f, [[cx + sd * 30, 1300], [cx + sd * 60, 1370], [cx + sd * 76, 1440]], 4, { col: '#14100e', lit: '#8e897d', op: 0.5 }); X.stains(f, E.smooth(sh), [cx - 130, 1280, cx + 130, 1450], P.charS, 0.04, 2.6, -1.3, Math.round(cx) + 7, 0.75); X.burnHole(f, [cx + 70, 1400], 10, 0.3); });
    X.charEdge(f, [[cx - 126, 1438], [cx, 1444], [cx + 126, 1438]], 5, { gap: 6 });
    X.rope(f, [[cx - 104, 1292], [cx, 1302], [cx + 104, 1292]], 9, '#3a3230'); X.rope(f, [[cx + dir * 40, 1300], [cx + dir * 46, 1350], [cx + dir * 40, 1392]], 7, '#3a3230', { fray: true });
    // the arms raised to the grille: deltoid, triceps, a bony elbow, the forearm muscled to the wrist
    const arms = [-1, 1].map(sd => { const S = [cx + lean + sd * 104, sy], El = [cx + sd * 150, 1050], W = [cx + sd * 50, 990]; return { sd, S, El, W }; });
    for (const { sd, S, El, W } of arms.sort((a, b) => (a.sd * dir) - (b.sd * dir))) {
      const arm = X.jointLimb(S, El, W, [62, 46, 34], { point: 0.4, mus0: 0.22, mus1: 0.26 });
      f.part(arm, SK2({ fill: sd * dir < 0 ? '#4e4648' : '#5e5658', maxShade: 16 }));
      X.clipDraw(f, E.smooth(arm), () => { X.softTone(f, E.smooth(arm), [[[lp(S, El, 0, sd * 30), lp(S, El, 1, sd * 20), lp(El, W, 1, sd * 14), lp(El, W, 1, sd * 40), lp(S, El, 0.5, sd * 50)], '#000', 0.35, 10]]); X.crease(f, [lp(S, El, 0.15, -sd * 6), lp(S, El, 0.45, -sd * 10), lp(S, El, 0.7, -sd * 4)], 2.4, { col: '#0a0607', op: 0.5, light: false }); X.hairline(f, [lp(El, W, 0.2, 4), lp(El, W, 0.5, -2), lp(El, W, 0.8, 3)], 1.3); X.soot(f, lerp(El, W, 0.4), 16, 10, 0.5); });
      // the hand: its back toward us, fingers hooked through the grille's holes (the tips go into the dark)
      const h = X.openHand(f, add(W, [0, -6]), -Math.PI / 2 + sd * 0.12, 78, { look: SK2({ fill: '#58504f' }), back: true, curl: 0.78, spread: 0.06, thumbAng: 0.4, flip: sd > 0, tips: '#141012' });
      for (const g of h.fing) f.flat(ell(g.k3 || g.k2, 4, 3, 0, 6), '#050304', { op: 0.85 });
      X.flakes(f, add(W, [0, -20]), 12, 10, 2, 0.8);
    }
    // a rosary hanging plumb from one wrist
    { const r0 = add(arms.find(a => a.sd === -dir).W, [0, 16]), bs = []; for (let i = 0; i < 10; i++) bs.push(add(r0, [Math.sin(i * 0.6) * 3, 10 + i * 13])); f.line(bs, 1.6, '#2a2020'); bs.forEach(q => f.part(ell(q, 5.4, 5.4, 0, 8), { fill: P.char, shadow: P.charS, shade: 0.4, inkW: 1, cast: false, hatch: false })); const cr = add(bs[9], [0, 8]); f.part([[-2, 0], [2, 0], [2, 6], [7, 6], [7, 10], [2, 10], [2, 22], [-2, 22], [-2, 10], [-7, 10], [-7, 6], [-2, 6]].map(q => [...add(cr, q), 1]), { fill: P.char, shadow: P.charS, shade: 0.3, inkW: 1, cast: false }); }
    // the head: bowed to the grille and turned toward the confessor's bay, seen in lost profile from behind
    f.bone(pfx + '_head');
    const hc = [cx + lean + dir * 8, 1052 + bow], Hh = 104, HF = frame(hc, dir * 0.18, Hh), Q = pts => HF(pts.map(([x, y]) => [x * dir, y]));
    { const nk = Q([[-0.06, 0.2]])[0]; f.part(limb([cx + lean, 1126], nk, 70, 56, { steps: 4 }), SK2({ maxShade: 10 })); X.crease(f, [lerp(nk, [cx + lean, 1126], 0.1), lerp(nk, [cx + lean, 1126], 0.6), [cx + lean, 1120]], 2.4, { col: '#0a0607', op: 0.5, light: false }); for (const sd of [-1, 1]) X.crease(f, [add(nk, [sd * 18, 6]), add(lerp(nk, [cx + lean, 1126], 0.6), [sd * 22, 0])], 1.8, { col: '#0a0607', op: 0.35, light: false }); } // the nape and the neck's cords
    const skull = Q([[-0.42, 0.06], [-0.44, -0.16], [-0.34, -0.42], [-0.06, -0.56], [0.24, -0.48], [0.42, -0.24], [0.46, -0.02], [0.42, 0.18], [0.36, 0.36], [0.26, 0.5], [0.16, 0.46], [0.02, 0.3], [-0.2, 0.26], [-0.34, 0.2]]);
    f.part(skull, SK2({ maxShade: 22 }));
    X.clipDraw(f, E.smooth(skull), () => {
      X.softTone(f, E.smooth(skull), [[Q([[0.2, -0.5], [0.5, -0.3], [0.5, 0.3], [0.24, 0.5], [0.18, 0.0]]), '#b4aaa8', dir > 0 ? 0.32 : 0.12, 8], [Q([[-0.5, -0.2], [-0.1, -0.2], [-0.1, 0.5], [-0.5, 0.5]]), '#000', dir > 0 ? 0.42 : 0.2, 10]]);
      f.line(Q([[0.45, -0.12], [0.47, -0.06], [0.45, 0.0]]), 2, '#0a0607', { op: 0.6 }); // the brow's tip and the cheekbone, all that shows of the face
      X.crease(f, Q([[0.3, 0.2], [0.3, 0.34], [0.2, 0.44]]), 2.4, { col: '#0a0607', lit: '#aca2a2', op: 0.5 }); // the jaw line on the far edge
      X.softTone(f, E.smooth(skull), [[Q([[-0.46, -0.3], [0.0, -0.3], [0.05, 0.5], [-0.4, 0.5]]), '#1a1416', 0.35, 10]]); // the back of the skull turned from the light
      X.crackNet(f, Q([[-0.1, 0.2]])[0], 1.4, 40, 1.4, { depth: 1 });
      for (let i = 0; i < 24; i++) { const q = Q([[R(f, -0.35, 0.2), R(f, -0.3, 0.1)]])[0]; f.line([q, add(q, [R(f, -1, 1), 2.6])], 1.1, '#141012', { op: 0.6 }); } // burnt stubble
    });
    // the ear, behind the jaw, scorched to a stub at the rim
    { const ear = Q([[0.2, -0.08], [0.27, -0.1], [0.31, -0.0], [0.29, 0.13], [0.24, 0.18], [0.19, 0.1]]); f.part(ear, SK2({ fill: '#6a6062', cast: false, maxShade: 4, inkW: 1.2 })); f.line(Q([[0.23, -0.05], [0.27, 0.02], [0.25, 0.11]]), 1.2, '#0a0607', { op: 0.7 }); X.charEdge(f, Q([[0.2, -0.08], [0.27, -0.1], [0.31, -0.0]]), 2, { gap: 4 }); }
    // the charred skull cap
    const cap = Q([[-0.42, -0.06], [-0.36, -0.4], [-0.06, -0.56], [0.24, -0.5], [0.36, -0.3], [0.1, -0.24], [-0.2, -0.12]]);
    f.part(cap, CHR({ fill: '#2a2224', light: '#5a4e50', cast: false, maxShade: 8 }));
    X.clipDraw(f, E.smooth(cap), () => { X.crease(f, Q([[-0.3, -0.36], [0.0, -0.5], [0.24, -0.44]]), 2, { col: '#050304', lit: '#6a5e5e', op: 0.5 }); X.burnHole(f, Q([[-0.1, -0.36]])[0], 6, 0.2); });
    X.charEdge(f, Q([[0.36, -0.3], [0.1, -0.24], [-0.2, -0.12], [-0.42, -0.06]]), 3, { gap: 5 });
    // fingers of the far-side hand show past the head on the grille (the near-side hand is drawn whole above)
  };
  penitent('penitent_l', 430, 1, 14); penitent('penitent_r', 1470, -1, 6);
  f.bone('root');
  // posts: carved buttresses rising to pinnacles, charred, split along the grain; void holes with eyes in some
  const post = (x, w, top, eye) => {
    const ps = [[x - w / 2, base, 1], [x - w / 2, top, 1], [x - w * 0.3, top - 60, 1], [x, top - 220, 1], [x + w * 0.3, top - 60, 1], [x + w / 2, top, 1], [x + w / 2, base, 1]];
    const holes = eye ? [[[x, eye[1]], eye[0]]] : [];
    X.cutHoles(f, holes, () => {
      f.part(ps, OAK({ maxShade: 20 }));
      X.clipDraw(f, E.smooth(ps), () => {
        f.flat([[x + w * 0.1, base], [x + w * 0.1, top], [x + w / 2, top], [x + w / 2, base]], '#6a5a50', { op: 0.18 }); // the lit face of the post
        for (let y = top + 80; y < base - 100; y += 260) { f.flat([[x - w * 0.3, y + 120], [x - w * 0.3, y + 30], [x, y], [x + w * 0.3, y + 30], [x + w * 0.3, y + 120]], '#0a0707', { op: 0.6 }); f.line([[x - w * 0.36, y + 128], [x + w * 0.36, y + 128]], 4, '#5e504a', { op: 0.5 }); } // carved niches
        X.seam(f, [[x - 6, top + 200], [x + 6, top + 330], [x - 4, top + 470], [x + 2, top + 560]], 2.6);
        X.stains(f, E.smooth(ps), [x - w, top - 240, x + w, base], P.charS, 0.03, 2.8, -1.3, Math.round(x), 0.85);
      });
    }, { shape: E.smooth(ps) });
    if (eye) { X.clipDraw(f, ell([x, eye[1]], eye[0], eye[0], 0, 30), () => { f.flat(ell([x, eye[1]], eye[0] + 2, eye[0] + 2, 0, 24), '#030203'); X.voidEye(f, [x, eye[1]], eye[0] * 0.7, 0); }); }
    // the pinnacle's crockets: charred knobs that curl upward into ash
    for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.2, q = lerp([x - w * 0.3, top - 60], [x, top - 220], t); f.part([q, add(q, [-22, -14]), add(q, [-26, -30]), add(q, [-8, -18])], OAK({ cast: false, maxShade: 3, inkW: 1.4 })); const q2 = lerp([x + w * 0.3, top - 60], [x, top - 220], t); f.part([q2, add(q2, [22, -14]), add(q2, [26, -30]), add(q2, [8, -18])], OAK({ cast: false, maxShade: 3, inkW: 1.4 })); }
    X.ash(f, [x, top - 220], 8, 60, 160, 1.2);
  };
  // the gables over the bays: pointed arches of charred tracery, crocketed, the black fire coming through their holes
  const gable = (xl, xr, spring, peak, depth) => {
    const cx = (xl + xr) / 2, g = [[xl, spring + 60], [xl, spring], [xl + (xr - xl) * 0.2, spring - peak * 0.6], [cx, spring - peak], [xr - (xr - xl) * 0.2, spring - peak * 0.6], [xr, spring], [xr, spring + 60], [xr - 40, spring + 60], [xr - 40, spring + 10], [cx, spring - peak + 70], [xl + 40, spring + 10], [xl + 40, spring + 60]];
    f.part(g, OAK({ maxShade: 20 }));
    // tracery: a big trefoil and two small quatrefoils pierced through, fire showing through them
    const tre = [[cx, spring - peak * 0.52, peak * 0.15], [cx - (xr - xl) * 0.22, spring - peak * 0.15, peak * 0.09], [cx + (xr - xl) * 0.22, spring - peak * 0.15, peak * 0.09]];
    for (const [tx, ty, r] of tre) { const pts = []; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; pts.push(...ell([tx + Math.cos(a) * r * 0.5, ty + Math.sin(a) * r * 0.5], r * 0.55, r * 0.55, 0, 10)); } f.flat(ell([tx, ty], r * 1.1, r * 1.1, 0, 20), '#050304'); X.clipDraw(f, ell([tx, ty], r * 1.1, r * 1.1, 0, 20), () => X.blackFlame(f, [tx, ty + r], r * 2.4, r * 0.9, { noFork: true, edgeW: 2, wisps: false, scraps: false })); f.line(ell([tx, ty], r * 1.12, r * 1.12, 0, 20).concat([ell([tx, ty], r * 1.12, r * 1.12, 0, 20)[0]]), 4, '#0a0707'); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; f.part(ell([tx + Math.cos(a) * r * 0.78, ty + Math.sin(a) * r * 0.78], r * 0.18, r * 0.18, 0, 8), OAK({ cast: false, maxShade: 2, inkW: 1.2 })); } }
    // the crockets along the gable's edge, charred and curling up into ash, and the burnt top edge
    for (let i = 1; i < 6; i++) { const t = i / 6; for (const sd of [-1, 1]) { const a = sd < 0 ? lerp([xl, spring], [cx, spring - peak], t) : lerp([xr, spring], [cx, spring - peak], t); f.part([a, add(a, [sd * 28, -18]), add(a, [sd * 34, -40]), add(a, [sd * 12, -26])], OAK({ cast: false, maxShade: 3, inkW: 1.4 })); X.charEdge(f, [a, add(a, [sd * 28, -18]), add(a, [sd * 34, -40])], 3, { gap: 4 }); } }
    X.ash(f, [cx, spring - peak], 12, 140, 220, 1.4);
    X.seam(f, [[xl + 60, spring - 20], [cx - 60, spring - peak * 0.4], [cx - 20, spring - peak * 0.7]], 2.6);
  };
  gable(x0 + 30, xa - 30, 640, 300); gable(xb + 30, x1 - 30, 640, 300); gable(xa + 20, xb - 20, 380, 640);
  // a flat moulded frieze over each side bay with a cornice that overhangs (its underside seen from below)
  for (const [xl, xr, y] of [[x0, xa, 700], [xb, x1, 700]]) { f.part([[xl, y], [xr, y], [xr + 16, y + 20], [xl - 16, y + 20]].map(q => [...q, 1]), OAK({ fill: '#1a1514', cast: false, maxShade: 4 })); f.part([[xl - 16, y + 20], [xr + 16, y + 20], [xr + 16, y + 50], [xl - 16, y + 50]].map(q => [...q, 1]), OAK({ maxShade: 6 })); X.charEdge(f, [[xl, y], [xr, y]], 4, { gap: 8 }); }
  post(x0, 120, 520, [26, 900]); post(xa, 110, 320, null); post(xb, 110, 320, [22, 600]); post(x1, 120, 520, null);
  // void holes in the panels, an eye looking out of one
  for (const [c, r, eye] of [[[480, 1560], 24, true], [[1440, 1580], 18, false], [[1080, 1470], 20, true]]) { X.voidDisk(f, c, r, r); if (eye) X.voidEye(f, c, r * 0.7, 0); }
  // iron hinges warped by heat on the right bay's half-door post, and the list of sins nailed to the door in rubric
  for (const y of [820, 1360]) { f.part(X.ribbon([[x1 + 50, y], [x1, y + 4], [x1 - 50, y + 16], [x1 - 80, y + 34]], [26, 24, 20, 16]), X.IRON(f, { maxShade: 4 })); X.rivetRow(f, [[x1 + 40, y], [x1 - 40, y + 12]], 36, 5); X.heatBloom(f, [x1, y + 10], 50, 26); }
  { const lc = [x1 + 4, 1090], lw = 100, lh = 180; const ls = [[lc[0] - lw / 2, lc[1] - lh / 2], [lc[0] + lw / 2, lc[1] - lh / 2 - 6], [lc[0] + lw / 2 + 6, lc[1] + lh / 2], [lc[0] - lw / 2 - 4, lc[1] + lh / 2 + 6]]; f.part(ls.map(q => [...q, 1]), { fill: '#b8ae9c', shadow: '#5a5248', light: '#e0d8c8', shade: 0.35, tex: 'weave' + seed, texOp: 0.3, inkW: 1.4, maxShade: 6 }); X.clipDraw(f, ls.map(q => [...q, 1]), () => { for (let i = 0; i < 9; i++) { let x = lc[0] - lw / 2 + 14; const y = lc[1] - lh / 2 + 20 + i * 20; while (x < lc[0] + lw / 2 - 16) { const l = R(f, 8, 26); f.line([[x, y], [x + l, y + R(f, -1, 1)]], i === 0 ? 4 : 2.6, P.rubric, { op: 0.9 }); x += l + R(f, 4, 8); } } X.stains(f, E.smooth(ls.map(q => [...q, 1])), [lc[0] - 80, lc[1] - 120, lc[0] + 80, lc[1] + 120], P.charS, 0.04, 2.6, -1.2, 123, 0.7); }); X.charEdge(f, [ls[2], ls[3], lerp(ls[3], ls[0], 0.4)], 5, { gap: 6 }); f.rivet(add(ls[0], [10, 10]), 5, '#5a565e'); f.rivet(add(ls[1], [-10, 10]), 5, '#5a565e'); }
  // the slate of penances chalked in a column, hung on the left post
  { const sc = [x0 + 60, 1180]; const sl = [[sc[0] - 50, sc[1] - 90], [sc[0] + 50, sc[1] - 90], [sc[0] + 50, sc[1] + 90], [sc[0] - 50, sc[1] + 90]]; f.part(sl.map(q => [...q, 1]), OAK({ fill: '#4a3e38', maxShade: 4 })); f.part(sl.map((q, i) => [...add(q, [i === 0 || i === 3 ? 8 : -8, i < 2 ? 8 : -8]), 1]), { fill: '#2a2a30', shadow: '#0a0a0e', shade: 0.35, inkW: 1, cast: false, maxShade: 3 }); for (let i = 0; i < 7; i++) { const y = sc[1] - 70 + i * 22; f.line([[sc[0] - 30, y], [sc[0] - 30 + R(f, 20, 50), y + R(f, -1, 1)]], 2.2, '#c8c4bc', { op: 0.8 }); for (let k = 0; k < 4; k++) f.line([[sc[0] + 12 + k * 7, y - 6], [sc[0] + 12 + k * 7, y + 4]], 1.6, '#c8c4bc', { op: 0.8 }); } f.line([add(sl[0], [10, 0]), [sc[0], sc[1] - 120], add(sl[1], [-10, 0])], 2, '#3a3028'); }
  // ================= the arm and hand resting out through the curtain on the armrest
  f.bone('root');
  // the armrest: a carved oak arm on the bay's right side, its end a scroll
  f.part([[1120, 1150], [1300, 1140, 1], [1330, 1150], [1336, 1196], [1300, 1206, 1], [1120, 1206]], OAK({ maxShade: 10 }));
  f.part(ell([1326, 1176], 26, 30, 0, 14), OAK({ fill: '#3a302c', cast: false, maxShade: 6 })); f.line(ell([1326, 1176], 14, 16, 0, 10).slice(0, 8), 3, '#0a0707'); X.seam(f, [[1150, 1172], [1220, 1178], [1290, 1170]], 1.8);
  f.bone('arm');
  { // the habit's wide sleeve from the shoulder past the elbow, its mouth hanging below the forearm, the edge charred
    const m0 = lerp(ELB, WR, 0.42), sl = K.chain([add(SHO, [-40, -70]), SHO, ELB, m0], [60, 150, 136, 150], { steps: 10, bq: [[2, 0.6, 0.25, 0.3]], bp: [[0, 1, 0.3, 0.3]] });
    const mouthLow = add(m0, [-8, 70]);
    const sleeve = [...sl.slice(0, Math.floor(sl.length / 2)), add(m0, [18, -60]), add(m0, [26, 10]), mouthLow, ...sl.slice(Math.floor(sl.length / 2))];
    // the bare forearm from inside the sleeve to the wrist (drawn first; the sleeve covers its root)
    const fo = X.jointLimb(lerp(SHO, ELB, 0.6), ELB, WR, [80, 76, 56], { point: 0.2, mus0: 0.1, mus1: 0.2 });
    f.part(fo, SKN({ maxShade: 20 }));
    X.clipDraw(f, E.smooth(fo), () => { X.softTone(f, E.smooth(fo), [[[lp(ELB, WR, 0, -40), lp(ELB, WR, 1, -30), lp(ELB, WR, 1, -6), lp(ELB, WR, 0, -10)], '#d0c6c4', 0.24, 10], [[lp(ELB, WR, 0, 20), lp(ELB, WR, 1, 14), lp(ELB, WR, 1, 40), lp(ELB, WR, 0, 50)], '#000', 0.4, 10]]); X.crackNet(f, lerp(ELB, WR, 0.65), ang(ELB, WR), 70, 2.6, { depth: 2 }); X.crease(f, [lp(ELB, WR, 0.6, -24), lp(ELB, WR, 0.8, -22), lp(ELB, WR, 0.96, -18)], 2.4, { col: '#0a0607', lit: '#b4aaa8', op: 0.5 }); X.flakes(f, lerp(ELB, WR, 0.7), 30, 16, 4, 1.2); X.soot(f, lerp(ELB, WR, 0.85), 20, 14, 0.6); });
    f.part(sleeve, RB({ fill: '#3e3638', light: '#7a7072', maxShade: 50 }));
    X.clipDraw(f, E.smooth(sleeve), () => { X.softTone(f, E.smooth(sleeve), [[[lp(SHO, ELB, 0, -80), lp(SHO, ELB, 1, -80), lp(SHO, ELB, 1, -20), lp(SHO, ELB, 0, -20)], '#c4bab8', 0.2, 20], [[lp(SHO, ELB, 0.3, 30), lp(SHO, ELB, 1, 40), mouthLow, lp(SHO, ELB, 1, 90)], '#000', 0.45, 20]]); for (const k of [0.25, 0.5, 0.75]) X.crease(f, [lp(SHO, ELB, k, -60), lp(SHO, ELB, k + 0.06, 0), lp(SHO, ELB, k + 0.02, 60)], 6, { col: '#0a0607', lit: '#9a9092', op: 0.6 }); X.crease(f, [lp(ELB, m0, 0.0, -50), lp(ELB, m0, 0.6, 20), add(mouthLow, [-10, -10])], 7, { col: '#0a0607', lit: '#9a9092', op: 0.6 }); X.stains(f, E.smooth(sleeve), E.bbox(sleeve).map((v, i) => v + (i < 2 ? -20 : 20)), P.charS, 0.03, 2.8, -1.35, 151, 0.8); X.burnHole(f, lerp(SHO, ELB, 0.6), 14, 0.2); });
    f.flat([add(m0, [18, -56]), add(m0, [26, 10]), add(m0, [6, 40]), add(m0, [-4, -20])], '#080506', { op: 0.9 }); // the sleeve's dark mouth
    X.charEdge(f, [add(m0, [18, -60]), add(m0, [26, 10]), mouthLow], 7, { gap: 6 });
  }
  f.bone('hand');
  { // the hand laid on the armrest, its back up, knuckles standing out, the fingers draped over the scroll's end
    const h = X.openHand(f, add(WR, [12, -10]), 0.42, 200, { look: SKN({ fill: '#746a6c' }), back: true, curl: 0.5, spread: 0.1, bend: [0.2, 0.32, 0.44, 0.56], thumbAng: 0.3, tips: '#1a1214' });
    X.hairline(f, [add(WR, [20, -14]), add(WR, [60, 0]), add(WR, [90, 6])], 1.6); X.soot(f, add(WR, [40, -10]), 22, 12, 0.5);
    // the rosary of burned beads hanging from the fingers, plumb
    const r0 = h.fing[1].k2, beads = []; for (let i = 0; i < 12; i++) beads.push(add(r0, [Math.sin(i * 0.5) * 6, 16 + i * 17]));
    f.line(beads, 2, '#2a2020'); beads.forEach((q, i) => f.part(ell(q, 9, 9, 0, 10), { fill: i % 3 ? P.charL : P.char, shadow: P.charS, shade: 0.4, inkW: 1.2, inkHeavy: 1.4, cast: false, hatch: false }));
    const cr = add(beads[11], [0, 12]); f.part([[-4, 0], [4, 0], [4, 10], [14, 10], [14, 18], [4, 18], [4, 40], [-4, 40], [-4, 18], [-14, 18], [-14, 10], [-4, 10]].map(q => [...add(cr, q), 1]), { fill: P.char, shadow: P.charS, shade: 0.3, inkW: 1.1, cast: false }); }

  // ash heaped on the steps; the penitents' caps' ash; a fallen rosary
  for (const [c, w, h] of [[[300, 1690], 260, 40], [[1600, 1690], 300, 46], [[960, base], 200, 30], [[700, gy], 300, 30], [[1300, gy], 260, 26]]) X.ashHeap(f, c, w, h, { n: 8 });
  return f;
}

module.exports = {
  heroes: [
    { key: 'iron_bull', name: 'The Iron Bull', tier: 'ruler', w: 2400, h: 2300, flip: true, build: ironBull },
    { key: 'confessor', name: 'The Confessor', tier: 'ruler', w: 2000, h: 1800, flip: true, build: confessor },
    { key: 'questioner', name: 'The Questioner', tier: 'elite', w: 1100, h: 1400, flip: true, build: questioner },
    { key: 'bellows_sister', name: 'The Bellows Sister', tier: 'elite', w: 1600, h: 1400, flip: true, build: bellowsSister },
    { key: 'recanter', name: 'Recanter', tier: 'human', w: 600, h: 1000, flip: true, build: recanter },
    { key: 'ash_pardoner', name: 'Ash Pardoner', tier: 'human', w: 600, h: 1000, flip: true, build: ashPardoner },
    { key: 'belfry_bats', name: 'Belfry Bats', tier: 'small', w: 600, h: 820, flip: true, build: belfryBats },
    { key: 'familiar', name: 'The Familiar', tier: 'small', w: 600, h: 820, flip: true, build: familiar },
    { key: 'faggot_bearer', name: 'Faggot-Bearer', tier: 'large', w: 900, h: 1250, flip: true, build: faggotBearer },
    { key: 'scold', name: 'The Scold', tier: 'human', w: 700, h: 820, flip: true, build: scold },
    { key: 'charred_destrier', name: 'Charred Destrier', tier: 'large', w: 1300, h: 1250, flip: true, build: charredDestrier },
  ],
};
