// The abbey keepers (hub). Built like Mother Hild (dirAC2.js, key smith): warm keeper light, Ostiarii habit, joints and
// bones from the start. Keepers face right (no flip). Human tier canvas 600 x 820, ground line 790. Seeds 1601 to 1608.
// The furniture each keeper touches (lectern, desk, table, counter, relic case, tally board, altar rail) is its own root
// bone so the room can outline and click it separately; the room scenes themselves are separate assets.
'use strict';
const KK = require('./kit_keepers');
const { K, E, B, G, INK, P, KB, T, HB, SC, SKN, elb, fr2, split, side, ropeBelt, key, keyRing, badgeOn, restHand, tableHand, penHand, prayerHands, candle, glow, flame, closedBook, hoseLegs, bootRig, waistSplit, folds, hemWear, patch, wisps, rubric } = KK;
const { TIERS, chain, ragLimb, ring } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const W = TIERS.human[0], H_ = TIERS.human[1];

// ------------------------------------------------------------------ PRIOR ALDRIC (Chapter House), Human 1.05
// Tall, lean and perfectly still, the only clean habit in the abbey. Gloved hands folded over the oxblood ledger of the
// dead (brass corners); the master ring of keys hangs heavy at the back of his hip; a plain iron pectoral cross; a single
// red cord of office. He stands beside the lectern that holds the order's charter.
// Lore change 2026-11-23 (a hint only, never stated): he came out of the Black Pyre. Old burn scars: a glossy, puckered
// patch on the side of the neck that runs on down under the collar, and a glimpse of scarred wrist between the near
// sleeve and the glove (the gloves are why).
function aldric() {
  const f = new Fig(KB(1601, { grimeY: 730 }));
  const H = 104;
  const habit = '#776b5b', habitD = '#5e5446', skin = '#c99c7e', glove = '#3a322e', gloveL = '#4a4440';
  const N = [304, 244], HC = [322, 178];
  const SN = [248, 272], EN = [238, 372], WN = [282, 406];
  const SF = [350, 266], EF = [376, 358], WF = [354, 396];
  const WB = [300, 432], AF = [346, 752], AN = [262, 756];
  // ---- skeleton
  f.joint('pelvis', [300, 452]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [240, 272], 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('ledger', [320, 470], 'torso').joint('keys', [238, 440], 'pelvis').joint('cord', [318, 440], 'pelvis');
  f.joint('thigh_f', [328, 462], 'pelvis').joint('shin_f', [338, 604], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [270, 462], 'pelvis').joint('shin_n', [264, 606], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('lectern', [500, 790], null);

  // ---- the lectern and the charter (root object, in front of him to the right)
  f.bone('lectern');
  const oak = P.oak, oakD = P.oakD;
  f.part([[436, 778], [452, 770], [548, 770], [566, 778], [570, 790, 1], [432, 790, 1]], { fill: oakD, tex: T(f, 'wood'), texOp: 0.5 }); // cross foot
  f.part([[446, 790, 1], [446, 782], [462, 782], [462, 790, 1]], { fill: mix(oakD, '#000', 0.3), inkW: 1, cast: false });
  f.part([[540, 790, 1], [540, 782], [556, 782], [556, 790, 1]], { fill: mix(oakD, '#000', 0.3), inkW: 1, cast: false });
  f.part([[480, 772], [520, 772], [516, 756], [484, 756]], { fill: oak, tex: T(f, 'wood') });
  f.part([[486, 758, 1], [486, 412, 1], [514, 410, 1], [514, 758, 1]], { fill: oak, tex: T(f, 'wood'), texOp: 0.6 }); // octagonal post
  f.flat([[504, 756], [504, 412], [514, 410], [514, 758]], oakD, { op: 0.45 }); // chamfer in shade
  f.line([[491, 750], [491, 418]], 1.2, P.oakL, { op: 0.6, straight: true });
  f.part([[478, 760, 1], [478, 744], [522, 744], [522, 760, 1]], { fill: oakD, tex: T(f, 'wood'), inkW: 1.3 }); // base moulding
  f.part([[480, 424, 1], [482, 412], [518, 412], [520, 424, 1]], { fill: oakD, tex: T(f, 'wood'), inkW: 1.3 }); // capital
  f.scratches([500, 600], 10, 4, '#a88a64', 0.8, 1.5);
  f.part([[482, 414, 1], [482, 384, 1], [518, 372, 1], [518, 414, 1]], { fill: oakD, tex: T(f, 'wood') }); // head block under the desk
  // slanted desk, low edge toward him, with a ledge
  f.part([[424, 384, 1], [574, 336, 1], [578, 350, 1], [430, 400, 1]], { fill: oak, tex: T(f, 'wood'), texOp: 0.6 });
  f.part([[420, 372, 1], [432, 368, 1], [436, 398, 1], [424, 402, 1]], { fill: oakD, inkW: 1.2 }); // ledge
  f.scratches([500, 370], 40, 5, '#a88a64', 0.8, -0.3);
  // the charter, open on the slope: page block and a sliver of the pages' face, rubric ribbon hanging
  f.part([[436, 376, 1], [440, 360], [498, 342], [500, 346], [504, 340], [560, 322], [566, 330, 1], [434, 380, 1]], { fill: '#d6cbb0', shadow: '#9a8a6a', shade: 0.35, inkW: 1.2, hatch: false });
  f.line([[440, 362], [498, 345], [502, 343], [560, 325]], 1, '#8a7a5a', { op: 0.7 });
  for (let i = 1; i < 4; i++) f.line([[438, 372 - i * 3], [500, 352 - i * 3 + 2], [562, 332 - i * 3]], 0.6, '#8a7a5a', { op: 0.5 });
  f.part([[432, 382, 1], [566, 334, 1], [568, 340, 1], [434, 390, 1]], { fill: '#3a1a14', inkW: 1, cast: false }); // binding board
  f.stroke([[452, 384], [454, 410], [450, 436], [454, 452]], 4, rubric); // ribbon
  f.flat([[449, 450], [457, 450], [453, 458]], rubric);

  // ---- back panel of the scapular, behind
  f.bone('robe_back');
  f.part([[242, 270], [222, 300], [214, 420], [206, 560], [200, 700], [210, 742], [224, 736], [232, 700], [236, 560], [240, 420], [250, 300]], SC(f));
  // ---- far arm, upper sleeve (behind the torso)
  f.bone('upperarm_f');
  f.part(chain([add(SF, [-6, -8]), lerp(SF, EF, 0.3), EF], [30, 56, 58]), HB(f, { fill: habitD }));
  // ---- hidden legs and shoes
  hoseLegs(f, [['_f', [328, 462], [338, 604], AF], ['_n', [270, 462], [264, 606], AN]], { tw: 44, kw: 38, aw: 32 });
  bootRig(f, AF, '_f', 50, '#2a2320', { shaft: 0.7, tex: T(f, 'mottle'), texOp: 0.25 });
  bootRig(f, AN, '_n', 50, '#221c19', { shaft: 0.7, tex: T(f, 'mottle'), texOp: 0.25 });
  // ---- the habit: one long clean shape, cut at the belt
  const hab = [[314, 236], [340, 244], [358, 260], [370, 290], [372, 340], [364, 392], [356, 432], [362, 486], [370, 560], [378, 640], [386, 712], [392, 746, 1],
    [366, 752], [340, 744, 1], [308, 754], [280, 744, 1], [252, 752], [226, 744, 1], [228, 690], [234, 610], [240, 530], [244, 466], [242, 432], [234, 384], [230, 324], [236, 286], [256, 258], [286, 242]];
  waistSplit(f, () => f.part(hab, HB(f, { fill: habit, texOp: 0.45 })), WB);
  f.bone('skirt');
  // long, crisp folds: a pressed habit
  folds(f, [[[254, 470], [248, 600], [244, 740]], [[284, 476], [282, 620], [280, 748]], [[372, 520], [380, 640], [386, 740]], [[262, 600], [262, 700], [262, 748]]], 2);
  f.line([[300, 760], [300, 760]], 0.1, INK);
  hemWear(f, 226, 392, 748, { op: 0.08, h: 30, thread: 0.25 });
  f.flat([[244, 446], [300, 452], [320, 520], [296, 560], [250, 520]], '#1e1610', { op: 0.18 }); // shade under the arms and the ledger
  folds(f, [[[300, 560], [296, 650], [298, 744]], [[318, 620], [322, 700]], [[236, 640], [240, 744]]], 1.6);
  f.stitches([[244, 470], [238, 600], [232, 740]], '#a89a80', 0.8); // side seam
  // ---- scapular front, cut at the belt
  waistSplit(f, () => f.part([[300, 244], [334, 246], [350, 262], [350, 330], [346, 430], [350, 560], [356, 700], [360, 740, 1], [318, 746, 1], [316, 700], [310, 560], [304, 430], [298, 330], [292, 262]], SC(f)), WB);
  f.bone('skirt');
  f.line([[332, 470], [338, 600], [342, 736]], 1.2, P.scapL, { op: 0.7 });
  f.stitches([[312, 470], [316, 600], [320, 740]], '#5a5048', 0.8); f.stitches([[352, 470], [356, 600], [358, 736]], '#5a5048', 0.8);
  f.bone('torso');
  f.line([[318, 270], [316, 330], [320, 420]], 1.2, P.scapL, { op: 0.6 });
  // folded cowl round the neck (clean, pressed)
  f.part([[252, 258], [276, 232], [300, 224], [326, 228], [346, 246], [336, 264], [300, 270], [264, 270]], HB(f, { fill: habitD, k: 0.8 }));
  f.stroke([[266, 254], [298, 260], [328, 252]], 1.8); f.stroke([[280, 240], [300, 236], [322, 240]], 1.4);
  // pectoral cross on a chain
  f.line([[282, 258], [300, 296], [332, 316]], 1.3, '#4a4a4c', { dash: '2.5 1.5' });
  f.line([[340, 260], [342, 300], [334, 316]], 1.3, '#4a4a4c', { dash: '2.5 1.5' });
  f.part([[331, 314, 1], [337, 314, 1], [337, 322, 1], [346, 322, 1], [346, 328, 1], [337, 328, 1], [337, 346, 1], [331, 346, 1], [331, 328, 1], [322, 328, 1], [322, 322, 1], [331, 322, 1]], { fill: '#4a4a4e', shade: 0.4, inkW: 1.1, inkHeavy: 1.6 });
  f.line([[332, 324], [332, 344]], 0.8, '#9a9a9a', { op: 0.6 });
  // rope belt; the red cord of office knotted at the front; the lead badge; the master key ring hangs at the back of the hip
  ropeBelt(f, [234, 428], [362, 430], 11, { sag: 5, knot: 0.3, ends: [[-3, 54, -2], [4, 70, 3]] });
  f.bone('cord');
  f.line([[318, 438], [322, 480], [320, 540], [322, 580]], 2.4, rubric);
  f.line([[324, 438], [330, 486], [332, 548]], 2.2, mix(rubric, '#000', 0.2));
  for (const [x, y] of [[322, 580], [332, 548]]) { f.part([[x - 3, y], [x + 3, y], [x + 5, y + 16], [x - 5, y + 16]], { fill: rubric, inkW: 1, cast: false, hatch: false }); f.line([[x - 4, y + 16], [x + 4, y + 16]], 1, mix(rubric, '#000', 0.4)); }
  f.part(ell([320, 436], 6, 4.5, 0, 8), { fill: rubric, inkW: 1, cast: false });
  f.bone('pelvis');
  badgeOn(f, [284, 434], [288, 456], 10);
  f.bone('keys');
  keyRing(f, [238, 436], 19, [[-0.5, 50, 6], [-0.25, 58, 6.5], [-0.05, 46, 5.5], [0.12, 62, 7], [0.3, 52, 6], [0.48, 44, 5.5], [0.62, 56, 6]], { drop: 30, strap: '#2a2a2c' });
  // ---- the ledger of the dead, held flat against the belly
  f.bone('ledger');
  closedBook(f, [[286, 356], [350, 348], [358, 470], [292, 478]], [-12, -10], '#4a221e', { corners: 14 });
  f.line([[300, 372], [342, 366]], 1, '#b8a070', { op: 0.5 }); // a tooled title line
  // ---- far forearm in its sleeve, gloved hand on the ledger
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.6), EF, WF], [54, 56, 50], { bq: [[1, 0.7, 0.3, 0.25]] }), HB(f, { fill: habitD }));
  f.flat(ell(lerp(EF, WF, 0.95), 10, 22, Math.atan2(WF[1] - EF[1], WF[0] - EF[0]), 10), '#1e1a16', { op: 0.9 });
  f.bone('hand_f');
  restHand(f, add(WF, [-4, 2]), 2.25, 36, glove, { glove: true, sq: 0.72, fw: 1.15, spread: 0.02, shadow: '#141010', curl: 0.25, flip: true });
  // ---- near arm: long sleeve, the bell hanging under the forearm, gloved hand folded over the far one
  split(f, () => f.part(chain([add(SN, [6, -10]), lerp(SN, EN, 0.3), EN, WN], [30, 56, 62, 56], { bp: [[2, 0.65, 0.5, 0.2]], bq: [[1, 0.5, 0.06, 0.3]] }), HB(f, { fill: habit })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 28)], ['forearm_n', side(EN, elb(SN, EN, WN), 28)]]);
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.2, 10), lp(SN, EN, 0.55, 4), lp(SN, EN, 0.85, 14)]], 1.8);
  f.bone('forearm_n');
  folds(f, [[lp(EN, WN, 0.15, -12), lp(EN, WN, 0.6, -20), lp(EN, WN, 0.9, -24)]], 1.8);
  f.flat(ell(lerp(EN, WN, 0.97), 9, 24, Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), 10), '#1e1a16', { op: 0.9 });
  // a glimpse of the old burn at the wrist, between the sleeve's mouth and the glove's cuff
  f.bone('hand_n');
  const wsc = [lp(EN, WN, 0.86, -10), lp(EN, WN, 0.98, -11), lp(EN, WN, 0.98, 11), lp(EN, WN, 0.86, 9)];
  f.part(wsc, SKN(f, mix(skin, '#e8bca8', 0.45), { inkW: 0.9, inkHeavy: 1.1, hatch: false, cast: false }));
  f.line([lp(EN, WN, 0.88, -6), lp(EN, WN, 0.96, -2), lp(EN, WN, 0.9, 6)], 0.9, mix(skin, '#8a3a2e', 0.4), { op: 0.6 }); f.line([lp(EN, WN, 0.9, -8), lp(EN, WN, 0.96, -6)], 0.9, '#fff4ea', { op: 0.6 });
  restHand(f, add(WN, [-2, 0]), 0.42, 37, glove, { glove: true, sq: 0.74, fw: 1.15, spread: 0.02, shadow: '#141010', curl: 0.25, ring: '#4a4a4c' });
  // ---- head: calm, still, gives nothing away; close-cropped silver hair, pale eyes
  f.bone('head');
  f.part(limb(N, add(HC, [-6, 30]), 35, 31), SKN(f, skin)); // a lean old man's neck
  f.line([lp(N, add(HC, [-6, 30]), 0.2, 8), lp(N, add(HC, [-6, 30]), 0.7, 11)], 1.1, mix(skin, '#000', 0.4), { op: 0.6 }); // neck tendon
  f.line([lp(N, add(HC, [-6, 30]), 0.15, -6), lp(N, add(HC, [-6, 30]), 0.6, -8)], 1, mix(skin, '#000', 0.4), { op: 0.45 }); // the cord behind
  // the old burn on the side of the neck: shiny, pulled skin with a puckered rim, running up under the jaw and down under
  // the collar (only its edge shows)
  const nb = (u, v) => lp(N, add(HC, [-6, 30]), u, v), scarC = mix(skin, '#f0c0b0', 0.6), scarR = mix(skin, '#8a3a2e', 0.5);
  const scN = [nb(0.3, -17), nb(0.5, -17), nb(0.7, -15), nb(0.9, -12), nb(0.96, -4), nb(0.8, 0), nb(0.66, 4), nb(0.5, 2), nb(0.38, 6), nb(0.3, 3)];
  f.flat(scN, scarC, { op: 0.85 });
  f.line(scN.concat([scN[0]]), 1.3, scarR, { op: 0.75 });
  for (const [u, v] of [[0.44, -10], [0.58, -8], [0.72, -9], [0.84, -7]]) f.line([nb(u, v - 5), nb(u + 0.04, v), nb(u, v + 5)], 1, scarR, { op: 0.7 }); // the pucker pulling across it
  f.line([nb(0.42, -13), nb(0.6, -11), nb(0.78, -10)], 1.1, '#fff4ea', { op: 0.55 }); // its glossy shine
  f.flat(ell(nb(0.55, -3), 3, 2, 0.3, 6), scarR, { op: 0.35 }); f.flat(ell(nb(0.36, -12), 2.4, 1.8, 0, 6), scarR, { op: 0.35 });
  f.bone('torso');
  f.part([[284, 244], [298, 228], [320, 226], [334, 236], [322, 248], [298, 250]], HB(f, { fill: habitD, k: 0.8, cast: false })); // collar over the neck base
  f.stroke([[290, 240], [308, 236], [326, 238]], 1.4);
  f.bone('head');
  // the back of the skull, its scalp showing through hair cropped to a silver stubble (no cap of hair: the skull's shape reads)
  const crop = mix(skin, '#a6a29a', 0.55), hf0 = frame(HC, 0.03, H);
  f.part(hf0([[-0.3, -0.42], [-0.44, -0.22], [-0.46, 0.02], [-0.4, 0.16], [-0.28, 0.12], [-0.2, -0.1]]), SKN(f, crop, { hatch: false }));
  const hf = B.head(f, HC, H, 0.03, {
    skin, jaw: 0.96, chin: 0.03, nose: 1.08, hook: 0.18, mouth: 'set', squint: 0.32, browDown: 0.0, age: true, gaunt: true, faceShade: 0.8, jawShade: 0.4, faceHatch: false,
    iris: '#6a7a86', eyeWhite: '#cfc4ae', browCol: '#9a968e', browW: 0.036,
  });
  // the crop over the crown: a translucent silver film over the scalp with a soft hairline, stippled, no outline
  f.part(hf([[-0.4, 0.1], [-0.45, -0.16], [-0.36, -0.42], [-0.1, -0.55], [0.16, -0.52], [0.29, -0.41], [0.25, -0.37], [0.14, -0.44], [-0.02, -0.43], [-0.16, -0.37], [-0.23, -0.2], [-0.26, 0.0], [-0.32, 0.12]]), { fill: '#b2aea6', tex: T(f, 'mottle'), texOp: 0.5, inkW: 0, cast: false, shade: 0.35, hatch: false, opacity: 0.55 });
  for (let i = 0; i < 90; i++) { const u = -0.42 + f.r() * 0.68, v = -0.54 + f.r() * 0.5; if ((v > -0.38 && u > 0.04) || (v > -0.2 && u > -0.2) || u * u / 0.2 + (v + 0.1) ** 2 / 0.22 > 1) continue; f.flat(hf(ell([u, v], 0.007, 0.007, 0, 5)), i % 3 ? '#e2ded6' : '#5a5650', { op: 0.55 }); } // silver stubble
  for (let i = 0; i < 12; i++) { const t = i / 11, q = [0.27 - t * 0.5, -0.4 + Math.sin(t * Math.PI) * -0.04 + t * 0.03]; f.line(hf([q, [q[0] - 0.01, q[1] + 0.025]]), 0.8, '#d8d4cc', { op: 0.6 }); } // the hairline
  // age: a hollow temple, a long philtrum, a pouch under the pale eye
  f.flat(hf([[-0.02, -0.28], [0.08, -0.24], [0.06, -0.15], [-0.04, -0.18]]), mix(skin, '#2a1712', 0.5), { op: 0.22 });
  f.line(hf([[0.07, 0.0], [0.12, 0.025], [0.18, 0.01]]), 0.9, INK, { op: 0.45 });
  f.line(hf([[0.2, 0.17], [0.24, 0.24]]), 1, INK, { op: 0.4 }); // the faint fold beside the mouth that never moves
  return f;
}

// ------------------------------------------------------------------ THE ABBOT (vigil at the sealed door), Human 1.0 kneeling
// Very old, kneeling at the altar rail, seen mostly from behind in a rear three-quarter view. He sits back on his heels,
// his back bowed into a hump under the low hood, the black scapular down the spine, bare cracked soles turned to us.
// His head is cocked so the right ear turns toward the door; the hood is pushed back on that side to bare the bandaged
// ear. Candle stubs and pooled wax lie round his knees; his old hands are clasped on the rail.
function abbot() {
  const f = new Fig(KB(1602, { grimeY: 700 }));
  const habit = '#6c6152', habitD = '#554c40', skin = '#c8ab98', skinS = '#7a5a50', linen = P.linen;
  const SN = [366, 524], EN = [404, 610], WN = [438, 552];
  const SF = [302, 508], EF = [420, 620], WF = [446, 550];
  const WB = [306, 638], dW = E.norm([-0.12, 1]), NB = [344, 498];
  const KN = [384, 776], KF = [354, 768], AN = [270, 770], AF = [222, 760];
  // ---- skeleton: pelvis root resting on the heels; thighs forward to the knees, shins back along the floor
  f.joint('pelvis', [262, 700]).joint('torso', WB, 'pelvis').joint('head', NB, 'torso').joint('skirt', WB, 'pelvis').joint('cowl', [320, 490], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', [284, 704], 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', [262, 698], 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('keys', [240, 636], 'pelvis').joint('altar_rail', [490, 790], null);

  // ---- the altar rail beyond him (root object): sill, turned balusters, top rail polished by hands
  f.bone('altar_rail');
  f.part([[398, 772, 1], [584, 762, 1], [586, 778, 1], [400, 788, 1]], { fill: P.oakD, tex: T(f, 'wood') });
  for (const x of [424, 476, 528, 572]) {
    const yt = 568 - (x - 400) * 0.065, yb = 776 - (x - 400) * 0.055;
    f.part(limb([x, yt], [x, yb], 14, 14, { steps: 12, p: [[0.12, 0.5, 0.03], [0.5, 0.45, 0.1], [0.9, 0.4, 0.03]], q: [[0.12, 0.5, 0.03], [0.5, 0.45, 0.1], [0.9, 0.4, 0.03]], capA: false, capB: false }), { fill: P.oak, tex: T(f, 'wood'), texOp: 0.5 });
    f.line([[x - 3, yt + 20], [x - 3, yb - 20]], 1, P.oakL, { op: 0.5 });
  }
  f.part([[396, 556, 1], [588, 542, 1], [590, 562, 1], [398, 576, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 });
  f.part([[396, 550, 1], [588, 536, 1], [588, 544, 1], [396, 558, 1]], { fill: P.oakL, inkW: 1.2, cast: false });
  f.scratches([520, 552], 50, 6, '#c0a07a', 0.8, -0.07);
  // candles beyond him at the rail's foot
  f.flat(ell([476, 784], 34, 5, 0, 14), P.wax, { op: 0.85 });
  candle(f, [476, 782], 46, 12);
  candle(f, [450, 786], 22, 11, { lit: false });
  f.flat(ell([540, 778], 22, 4, 0, 12), P.wax, { op: 0.8 });
  candle(f, [540, 776], 30, 10);

  // ---- hidden legs for the rig
  hoseLegs(f, [['_f', [262, 698], KF, AF], ['_n', [284, 704], KN, AN]], { tw: 46, kw: 38, aw: 32 });
  // ---- far arm: forearm reaching past his chest to the rail; the far hand under the near one
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.75), EF, WF], [44, 46, 40], { bq: [[1, 0.6, 0.35, 0.25]] }), HB(f, { fill: habitD }));
  f.bone('hand_f');
  // (the far hand is pressed palm to palm with the near one: its sliver is drawn with the prayer hands)
  // ---- the habit from behind: hunched back, rump over the heels, cloth pooled round the knees; cut at the belt
  const hab = [[322, 474], [292, 488], [268, 514], [252, 556], [242, 604], [230, 652], [212, 700], [196, 742], [182, 776], [190, 792, 1], [258, 794], [330, 796], [410, 794, 1], [424, 784], [414, 758], [400, 724], [390, 686], [386, 646], [390, 604], [394, 566], [386, 532], [372, 508], [350, 492]];
  waistSplit(f, () => f.part(hab, HB(f, { fill: habit })), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  folds(f, [[[228, 690], [210, 740], [196, 776]], [[262, 700], [250, 748], [236, 786]], [[376, 690], [394, 740], [408, 780]], [[344, 720], [356, 760], [362, 792]], [[196, 780], [236, 784], [276, 788]], [[300, 690], [330, 700], [360, 726]]], 2.2);
  hemWear(f, 186, 420, 790, { h: 80, op: 0.3 });
  patch(f, [[376, 706], [398, 702], [402, 730], [380, 734]], mix(habit, '#3a3020', 0.35));
  f.bone('torso');
  folds(f, [[[262, 530], [250, 580], [244, 628]], [[378, 560], [384, 610]], [[286, 512], [272, 552]], [[352, 540], [360, 600], [362, 630]]], 2);
  // black scapular down the bowed spine, cut at the belt
  const sc = [[302, 482], [338, 486], [326, 540], [304, 610], [290, 680], [286, 740], [294, 794, 1], [244, 794, 1], [240, 740], [246, 680], [260, 610], [278, 540]];
  waistSplit(f, () => f.part(sc, SC(f)), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  f.line([[276, 660], [266, 720], [266, 790]], 1.2, P.scapL, { op: 0.6 });
  f.stitches([[248, 690], [244, 790]], '#5a5048', 0.8);
  f.flat([[240, 720], [292, 720], [294, 794], [244, 794]], '#1a120c', { op: 0.2 });
  f.bone('torso');
  f.line([[310, 500], [296, 560], [282, 620]], 1.2, P.scapL, { op: 0.5 });
  f.stitches([[334, 500], [318, 560], [300, 620]], '#5a5048', 0.8);
  // rope belt round the back (tilted with the lean), keys on the far hip, the badge at the back of the belt
  ropeBelt(f, [236, 626], [390, 646], 10, { sag: 6 });
  f.bone('keys');
  keyRing(f, [242, 632], 12, [[-0.3, 36, 4.5], [0.0, 42, 5], [0.25, 34, 4.5]], { drop: 20 });
  f.bone('pelvis');
  badgeOn(f, [350, 640], [352, 660], 9, -0.05);
  // ---- feet: bare old soles turned toward us under the rump, toes curled under on the floor
  for (const [sfx, A, s] of [['_f', AF, 1.25], ['_n', AN, 1.4]]) {
    f.bone('foot' + sfx);
    const c = add(A, [-4 * s, 4 * s]);
    const sole = [add(c, [-8 * s, -18 * s]), add(c, [6 * s, -21 * s]), add(c, [13 * s, -10 * s]), add(c, [11 * s, 4 * s]), add(c, [15 * s, 14 * s]), add(c, [10 * s, 20 * s]), add(c, [-10 * s, 21 * s]), add(c, [-15 * s, 12 * s]), add(c, [-11 * s, 0]), add(c, [-14 * s, -10 * s])];
    f.part(sole, { fill: mix(skin, '#6a5040', 0.3), shadow: skinS, tex: T(f, 'mottle'), texOp: 0.6, shade: 0.35 });
    f.flat(ell(add(c, [-1 * s, -11 * s]), 8 * s, 7 * s, 0, 10), mix(skin, '#e0c8b0', 0.3), { op: 0.5 }); // heel pad
    for (let i = 0; i < 4; i++) f.part(ell(add(c, [(-10 + i * 6.5) * s, 19 * s]), 3.4 * s, 2.6 * s, 0, 8), { fill: mix(skin, '#5a4034', 0.35), inkW: 0.9, inkHeavy: 1.1, cast: false, shade: 0.4 });
    f.line([add(c, [-8 * s, -6 * s]), add(c, [-2 * s, 0]), add(c, [-6 * s, 7 * s])], 0.9, INK, { op: 0.6 }); // cracks
    f.line([add(c, [4 * s, -13 * s]), add(c, [6 * s, -4 * s])], 0.9, INK, { op: 0.5 });
    f.line([add(c, [-12 * s, 12 * s]), add(c, [10 * s, 12 * s])], 0.9, mix(skin, '#000', 0.5), { op: 0.5 });
  }
  f.bone('skirt');
  f.part([[196, 748], [214, 738], [236, 742], [258, 736], [286, 742], [298, 754], [282, 752], [260, 748], [240, 752], [218, 748], [204, 756]], HB(f, { fill: habitD, cast: false, inkW: 1.2, inkHeavy: 2 })); // hem riding over the heels
  folds(f, [[[214, 742], [222, 750]], [[258, 740], [262, 750]]], 1.4);
  // ---- the cowl over the hump
  f.bone('cowl');
  f.part([[272, 520], [288, 494], [324, 478], [362, 484], [384, 504], [378, 530], [350, 548], [318, 566], [290, 552]], HB(f, { fill: habitD, k: 0.85 }));
  folds(f, [[[292, 516], [304, 538], [318, 556]], [[366, 506], [350, 528], [330, 550]], [[326, 490], [326, 520]]], 2);
  f.stitches([[284, 540], [312, 562], [350, 546], [376, 528]], '#9a8e78', 0.8);
  // ---- near arm: sleeve from behind, the forearm rising to the rail
  split(f, () => f.part(chain([add(SN, [-12, -8]), lerp(SN, EN, 0.4), EN, WN], [30, 50, 54, 44], { bp: [[2, 0.4, 0.5, 0.3]] }), HB(f, { fill: habit })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 24)], ['forearm_n', side(EN, elb(SN, EN, WN), 24)]]);
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.25, -12), lp(SN, EN, 0.6, -18), lp(SN, EN, 0.85, -19)]], 1.8);
  f.flat(ell(lerp(EN, WN, 0.95), 7, 18, Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), 10), '#1e1a16', { op: 0.85 });
  f.bone('forearm_n');
  // the sleeve bunched in the crook of the sharply bent elbow (covers where the sleeve's two edges would cross)
  f.part([lp(SN, EN, 0.5, -16), lp(SN, EN, 0.92, -24), lp(EN, WN, 0.12, -22), lp(EN, WN, 0.45, -18), lp(EN, WN, 0.3, 4), lp(SN, EN, 0.8, 8), lp(SN, EN, 0.6, 2)], { fill: '#4e4036', noShade: true, tex: T(f, 'weave'), texOp: 0.5, inkW: 0, cast: false });
  folds(f, [[lp(SN, EN, 0.6, -8), lp(SN, EN, 0.88, -12), lp(EN, WN, 0.22, -10)]], 1.6);
  f.bone('hand_n');
  const pH = prayerHands(f, [440, 556], -1.12, 64, skin, { flip: true, shadow: skinS, tex: T(f, 'mottle'), texOp: 0.5 }); // wrists resting on the rail
  for (const q of [[0.2, -0.05], [0.32, 0.12], [0.12, 0.1]]) f.flat(ell(pH([q])[0], 2.4, 1.8, 0, 6), '#8a6a50', { op: 0.6 }); // age spots
  // ---- head: bowed under the low hood; on the door side the hood is pushed back from the bandaged ear
  f.bone('head');
  // the bandage over the ear: a linen pad pressing out under the hood's edge, its strip tied under the jaw, a dried stain
  f.part([[372, 470], [388, 466], [398, 476], [400, 494], [390, 504], [374, 500]], { fill: mix(linen, '#a89878', 0.25), shadow: P.linenD, shade: 0.45, inkW: 1.3, tex: T(f, 'weave'), texOp: 0.45 });
  f.line([[380, 474], [392, 480], [394, 494]], 1, P.linenD, { op: 0.8 });
  f.flat(ell([392, 488], 3, 4, 0.3, 8), '#6a2a1e', { op: 0.6 });
  f.part([[386, 498], [396, 500], [384, 520], [366, 524], [362, 516], [378, 512]], { fill: linen, shadow: P.linenD, shade: 0.4, inkW: 1.1, cast: false, tex: T(f, 'weave'), texOp: 0.4 });
  // the hood: peaked, pulled low, its lining turned back on the door side
  f.part([[304, 504], [298, 474], [306, 446], [326, 426], [352, 420], [372, 428], [382, 446], [382, 468], [380, 488], [384, 512], [344, 516]], HB(f, { fill: habit, k: 0.9 }));
  f.part([[374, 432], [384, 448], [384, 470], [382, 490], [386, 512], [378, 514], [376, 490], [376, 466], [376, 446]], HB(f, { fill: mix(habitD, '#000', 0.25), cast: false, inkW: 1.1 })); // the hood's edge, lifted by the pad
  folds(f, [[[318, 450], [312, 478], [314, 506]], [[340, 432], [336, 470], [340, 510]], [[358, 430], [360, 470]]], 2);
  f.line([[306, 448], [326, 428], [350, 420]], 1.6, mix(habit, '#fff', 0.3), { op: 0.4 }); // lit crown of the hood
  // ---- candles nearer the viewer: one lit, two guttered, wax pooled round his knees
  f.bone('altar_rail');
  f.flat(ell([396, 794], 44, 5, 0, 14), P.wax, { op: 0.85 });
  f.flat(ell([160, 792], 30, 5, 0, 14), P.wax, { op: 0.85 });
  f.line([[372, 793], [360, 795], [350, 793]], 1, P.waxD, { op: 0.8 });
  candle(f, [160, 790], 34, 13);
  candle(f, [130, 792], 14, 12, { lit: false, drips: 3 });
  candle(f, [408, 794], 18, 11, { lit: false, drips: 3 });
  f.line([[408, 774], [406, 766], [412, 758], [408, 748]], 1, '#9a948a', { op: 0.6 }); // smoke from the guttered wick
  return f;
}

// ------------------------------------------------------------------ BROTHER LUCAN, THE ARMARIUS (Scriptorium), Human 1.0
// Tall, thin and stooped over the slanted desk, writing in the Codex. The hunch is in the upper back; the neck is kept
// short in the picture by the high cowl and runs straight into the jaw, so it never reads as a second head. Both forearms
// lie on the desk: the near hand rests its heel on the desk's lower edge with the nib on the page and the stripped quill
// running back toward his shoulder; the far hand lies flat on the upper page, holding the leaf and the gold-leaf book
// knife down under its palm. His bowed head looks straight down its axis at the nib. Ink-black fingertips, reading
// lenses, a neat grey tonsure, a spare quill behind the ear, cream linen oversleeves tied at the elbow, and at the belt
// an ink horn, a pen-knife sheath, a pumice stone and a wax tablet.
// Lore change 2026-11-23 (a hint only, never stated): he was a scribe at the Stilled Spire. A brass pocket watch hangs on
// its chain from the ring of the desk's book cupboard, stopped at one minute to twelve, a breath of frost on its glass.
function lucan() {
  const f = new Fig(KB(1603, { grimeY: 690 }));
  const H = 98;
  const habit = '#727068', habitD = '#5a5852', skin = '#c4987c', linen = '#cfc4a8', linenD = '#9a8e74', inkT = '#141010';
  const N = [342, 276], HC = [382, 244], hA = 0.92;
  const SN = [312, 304], EN = [332, 404], WN = [404, 377];
  const SF = [368, 292], EF = [404, 404], WF = [474, 347];
  const WB = [298, 446], dW = E.norm([-0.18, 1]), AF = [322, 756], AN = [244, 760];
  const slope = x => 402 - (x - 396) * 0.372; // the desk's writing surface (under the book)
  const pg = x => slope(x) - 14; // the page surface of the open Codex
  // ---- skeleton
  f.joint('pelvis', [284, 464]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [292, 286], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('quill', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('knife', [500, 340], 'hand_f');
  f.joint('thigh_f', [306, 472], 'pelvis').joint('shin_f', [318, 610], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [262, 472], 'pelvis').joint('shin_n', [250, 612], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('belt_gear', [262, 452], 'pelvis').joint('desk', [474, 790], null);

  // ---- far forearm in its linen oversleeve, rising from the elbow at his side to the far half of the page: drawn first, so
  // the torso, the desk and the Codex's page block cover it and only the wrist shows above the page
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.7), EF, lerp(EF, WF, 0.55), WF], [42, 38, 34, 28], { bq: [[1, 0.5, 0.1]] }), { fill: linen, shadow: linenD, tex: T(f, 'weave'), texOp: 0.4 });
  f.line([lp(EF, WF, 0.1, -16), lp(EF, WF, 0.1, 16)], 2, '#5a4a3a'); // tie at the elbow
  f.stroke([lp(EF, WF, 0.3, -9), lp(EF, WF, 0.55, -11), lp(EF, WF, 0.8, -9)], 1.4);
  f.spatter(lerp(EF, WF, 0.75), 8, 5, inkT);
  // ---- the writing desk (root object): a slanted top on a panelled pedestal; the Codex open on it, an ink horn
  f.bone('desk');
  const dy = -48;
  // two square legs with a stretcher and splayed feet, a shallow book cupboard under the top
  for (const x of [424, 532]) { f.part([[x - 9, 470, 1], [x + 9, 466, 1], [x + 9, 780, 1], [x - 9, 780, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 }); f.flat([[x + 2, 468], [x + 9, 466], [x + 9, 780], [x + 2, 780]], P.oakD, { op: 0.5 }); f.part([[x - 22, 790, 1], [x - 18, 776], [x + 18, 776], [x + 22, 790, 1]], { fill: P.oakD, tex: T(f, 'wood') }); }
  f.part([[416, 680, 1], [540, 676, 1], [540, 692, 1], [416, 696, 1]], { fill: P.oakD, tex: T(f, 'wood') }); // stretcher
  f.part([[406, 416, 1], [548, 362, 1], [548, 470, 1], [406, 486, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 }); // cupboard
  f.flat([[524, 372], [548, 362], [548, 470], [524, 472]], P.oakD, { op: 0.5 });
  f.line([[418, 434], [536, 390], [536, 460], [418, 474], [418, 434]], 1.3, P.oakD, { op: 0.9, straight: true });
  ring(f, [478, 440], 6, 8, 2.2, P.iron);
  // the stopped watch on its chain from the ring, hanging plumb
  const brass = '#8e7038', brassL = '#c8a860', wc = [479, 476], wr = 12;
  for (let i = 0; i < 4; i++) ring(f, [478.6, 450 + i * 3.4], 1.4, 2, 0.9, '#6a5428'); // chain links
  ring(f, [479, 462], 3.2, 2.6, 1.6, brass); // the bow
  f.part([[477, 463, 1], [481, 463, 1], [481, 466, 1], [477, 466, 1]], { fill: brass, inkW: 0.8, cast: false, hatch: false }); // crown
  f.part(ell(wc, wr, wr, 0, 20), { fill: brass, light: brassL, shadow: '#4a3818', shade: 0.4, inkW: 1.2, cast: false });
  f.line(ell(wc, wr - 1.5, wr - 1.5, 0, 20).slice(11, 17), 1.2, brassL, { op: 0.7 }); // the lit rim
  f.flat(ell(wc, wr - 3, wr - 3, 0, 20), '#e2d8c0');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; f.line([add(wc, rot([wr - 4, 0], a)), add(wc, rot([wr - (i % 3 ? 5.2 : 6.4), 0], a))], i % 3 ? 0.6 : 1, '#2a2420'); }
  f.line([wc, add(wc, rot([5.4, 0], -Math.PI / 2 - 0.02))], 1.5, '#1a1410'); // hour hand at twelve
  f.line([wc, add(wc, rot([8, 0], -Math.PI / 2 - 0.105))], 0.9, '#1a1410'); // minute hand at one minute to
  f.flat(ell(wc, 1.2, 1.2, 0, 6), '#1a1410');
  f.line(ell(wc, wr - 3.4, wr - 3.4, 0, 20).slice(2, 9), 1.6, '#cfe0ea', { op: 0.55 }); // frost creeping round the inside of the glass
  f.line([add(wc, [-6, -2]), add(wc, [-1, 1]), add(wc, [3, 6])], 0.6, '#f4f8fa', { op: 0.6 }); // a hairline crack in the glass
  f.flat(ell(add(wc, [3, -4]), 2.6, 1.4, -0.6, 6), '#fff', { op: 0.45 }); // glint
  f.scratches([470, 600], 30, 5, '#a88a64', 0.8, 1.5);
  f.part([[392, 404, 1], [556, 342, 1], [560, 356, 1], [398, 420, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 }); // the slanted top
  f.part([[388, 390, 1], [398, 386, 1], [402, 418, 1], [392, 422, 1]], { fill: P.oakD, inkW: 1.2 }); // ledge
  // ink horn in its socket at the high corner, a red-tipped spare quill in it
  f.part([[536, 344], [552, 338], [550, 318], [544, 302], [534, 314]], { fill: '#3a3026', shadow: '#1a140e', shade: 0.4, inkW: 1.2 });
  f.part(ell([543, 304], 9, 4, -0.35, 10), { fill: '#120e0c', inkW: 1, cast: false });
  f.line([[544, 304], [564, 294], [584, 288]], 1.4, '#e6dccb'); // a spare quill lying back out of the horn, away from him
  for (let i = 0; i < 7; i++) { const q = lerp([564, 294], [584, 288], i / 7); f.line([q, add(q, [5 - i * 0.4, 5])], 0.9, '#d8d0c0', { op: 0.8 }); f.line([q, add(q, [-3, -4 + i * 0.3])], 0.9, '#bfb6a6', { op: 0.65 }); }
  f.line([[544, 304], [548, 299]], 1.4, rubric);
  // the Codex: page block on the slope; above it a sliver of the two open pages seen from just above (the pages face
  // him, up the slope toward his eyes): lines of text, a rubric initial and a glint of gold, the gutter between them
  const bkT = 14, sl = [-2.5, -6.5]; // sl: how far the far edge of the page face shows above its near edge
  f.part([[404, 398, 1], [404, pg(404)], [470, pg(470)], [476, pg(476) - 2], [482, pg(482)], [548, pg(548)], [552, 342, 1]], { fill: '#d8ccb0', shadow: '#9a8a6a', shade: 0.35, inkW: 1.2, hatch: false });
  for (let i = 1; i < 4; i++) f.line([[406, 398 - i * 3.4], [474, 372 - i * 3.4], [550, 343 - i * 3.4]], 0.6, '#8a7a5a', { op: 0.55 });
  for (const [a, b] of [[404, 476], [476, 548]]) { // each page face, a thin plane tilted toward him
    const A0 = [a, pg(a) - (a === 476 ? 2 : 0)], B0 = [b, pg(b) - (b === 476 ? 2 : 0)];
    f.part([[A0[0], A0[1], 1], [B0[0], B0[1], 1], [...add(B0, sl), 1], [...add(A0, sl), 1]], { fill: '#efe6d0', shadow: '#b8aa88', shade: 0.25, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  }
  f.line([[476, pg(476) - 2], add([476, pg(476) - 2], sl)], 1.2, '#7a6a4a'); // the gutter
  // lines of text running along the page, the last one still wet up to the nib
  for (let r = 0; r < 3; r++) { const t = 0.3 + r * 0.22; for (const [a, b] of [[412, 470], [484, 542]]) f.line([add([a, pg(a)], mul(sl, t)), add([b, pg(b)], mul(sl, t))], 0.9, '#2a2420', { op: 0.55, dash: (2 + r) + ' 1.5' }); }
  f.line([add([412, pg(412)], mul(sl, 0.12)), add([438, pg(438)], mul(sl, 0.12))], 1.1, '#141010', { op: 0.85 });
  f.flat(ell(add([490, pg(490)], mul(sl, 0.5)), 3.4, 1.8, -0.35, 6), rubric); f.flat(ell(add([495, pg(495)], mul(sl, 0.4)), 1.6, 1, 0, 6), P.goldL);
  f.part([[400, 400, 1], [552, 344, 1], [554, 350, 1], [402, 406, 1]], { fill: '#2e221a', inkW: 1, cast: false }); // binding board
  f.stroke([[430, 400], [432, 422], [428, 446]], 3.4, rubric); // ribbon marker hanging over the ledge

  // ---- back panel of the scapular
  f.bone('robe_back');
  f.part([[292, 284], [270, 306], [252, 380], [244, 480], [236, 600], [230, 720], [240, 752], [252, 744], [258, 700], [264, 600], [272, 480], [284, 380], [300, 310]], SC(f));
  // ---- far arm: upper sleeve behind the chest
  f.bone('upperarm_f');
  f.part(chain([add(SF, [-4, -8]), lerp(SF, EF, 0.35), EF], [28, 48, 46]), HB(f, { fill: habitD }));
  // ---- legs and shoes (hidden under the habit, there for the rig)
  hoseLegs(f, [['_f', [306, 472], [318, 610], AF], ['_n', [262, 472], [250, 612], AN]], { tw: 42, kw: 36, aw: 30 });
  bootRig(f, AF, '_f', 48, '#2e2218', { shaft: 0.75, strap: true });
  bootRig(f, AN, '_n', 48, '#261c14', { shaft: 0.75 });
  // ---- the habit: the hunch in the upper back, chest sunk, skirt falling from the belt; cut at the belt
  const hab = [[330, 262], [356, 268], [378, 286], [386, 318], [380, 360], [368, 400], [356, 436], [360, 480], [368, 560], [378, 650], [386, 720], [390, 748, 1],
    [364, 752], [338, 744, 1], [306, 754], [280, 744, 1], [256, 752], [232, 744, 1], [236, 680], [242, 600], [248, 520], [252, 470], [254, 440], [252, 392], [258, 340], [272, 300], [296, 274]];
  waistSplit(f, () => f.part(hab, HB(f, { fill: habit })), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  folds(f, [[[262, 500], [256, 620], [248, 744]], [[300, 490], [298, 620], [296, 748]], [[364, 560], [374, 660], [382, 744]], [[276, 620], [278, 746]]], 2.1);
  hemWear(f, 232, 390, 748, { h: 70 });
  f.part([[262, 650], [286, 648], [288, 676], [264, 678]].map(q => [q[0], q[1], 1]), { fill: mix(habit, '#3a3a30', 0.3), tex: T(f, 'weave'), inkW: 1.1 }); // darn
  f.stitches([[262, 650], [286, 648], [288, 676], [264, 678], [262, 650]], '#b0a890', 0.8);
  f.spatter([340, 520], 18, 8, '#141010'); // ink spots on the skirt
  f.bone('torso');
  folds(f, [[[268, 330], [262, 380], [262, 430]], [[370, 330], [362, 380]]], 2);
  // scapular front, cut at the belt
  waistSplit(f, () => f.part([[330, 266], [360, 270], [374, 292], [372, 350], [360, 420], [352, 470], [356, 600], [362, 720], [364, 748, 1], [326, 750, 1], [322, 700], [318, 560], [318, 470], [328, 410], [338, 340], [332, 290]], SC(f)), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  f.line([[340, 480], [342, 620], [346, 744]], 1.2, P.scapL, { op: 0.6 });
  f.spatter([344, 560], 12, 6, '#0a0808');
  // rope belt, the badge, the order's key ring (small: he keeps only the book-press keys)
  f.bone('torso');
  ropeBelt(f, [250, 436], [360, 452], 10, { sag: 4, knot: 0.62, ends: [[-2, 58, -2], [4, 74, 3]] });
  f.bone('belt_gear');
  keyRing(f, [258, 450], 11, [[-0.2, 34, 4.4], [0.1, 40, 5], [0.35, 30, 4]], { drop: 18 });
  // ink horn on a thong, pen-knife sheath, pumice, wax tablet
  f.line([[284, 450], [282, 476]], 1.6, '#2a2018');
  f.part([[274, 476], [292, 474], [296, 500], [290, 528], [284, 540], [280, 526], [274, 500]], { fill: '#4a3a2a', shadow: '#201810', shade: 0.4, tex: T(f, 'mottle'), texOp: 0.5, inkW: 1.2 }); // horn
  for (let i = 0; i < 3; i++) f.line([[276, 486 + i * 12], [294, 484 + i * 12]], 0.9, '#8a7458', { op: 0.6 });
  f.part(ell([283, 476], 9, 3.6, 0, 10), { fill: '#100c0a', inkW: 1, cast: false });
  f.part([[300, 452, 1], [310, 452, 1], [314, 500], [306, 512], [298, 500]], { fill: '#3a2a1c', tex: T(f, 'mottle'), inkW: 1.1 }); // knife sheath
  f.part([[302, 444, 1], [308, 444, 1], [309, 454, 1], [301, 454, 1]], { fill: '#2a2018', inkW: 1, cast: false });
  f.line([[318, 452], [322, 470]], 1.2, '#2a2018'); f.part(ell([322, 478], 8, 6, 0.3, 10), { fill: '#8a8680', shadow: '#4a4642', tex: T(f, 'mottle'), texOp: 0.8, inkW: 1 }); // pumice
  f.line([[334, 454], [336, 486]], 1.2, '#2a2018');
  f.part([[324, 486, 1], [350, 484, 1], [352, 524, 1], [326, 526, 1]], { fill: P.oak, tex: T(f, 'wood'), inkW: 1.2 }); // wax tablet
  f.part([[328, 490, 1], [347, 489, 1], [348, 520, 1], [330, 521, 1]], { fill: '#3a2a14', inkW: 0.8, cast: false, hatch: false });
  for (let i = 0; i < 4; i++) f.line([[331, 495 + i * 6], [345, 494 + i * 6]], 0.8, '#7a6440', { op: 0.8 });
  f.bone('pelvis');
  badgeOn(f, [312, 452], [314, 530], 9);
  // ---- far arm: the gold-leaf book knife flat on the far half of the page, the blade pointing down the page toward the
  // nib, its gilt handle under the far palm (it holds the leaf down)
  f.bone('knife');
  const kd = E.norm([1, -0.372]), kn2 = [kd[1], -kd[0]], kT = add([452, pg(452)], mul(sl, 0.7)), kH = add(kT, mul(kd, 30)), kE = add(kT, mul(kd, 66));
  f.part([kT, add(kH, mul(kn2, 3.2)), add(kH, mul(kn2, -1.2))], { fill: '#a0a2a2', shade: 0.3, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false }); // blade, lying on the page
  f.line([kT, add(kH, mul(kn2, 1.6))], 0.8, '#e8e8e4', { op: 0.8 });
  f.part(limb(kH, kE, 6, 7, { steps: 4 }), { fill: P.gold, light: P.goldL, shade: 0.4, inkW: 1.1, cast: false }); // gilt handle (a holy book's tool)
  f.bone('hand_f');
  restHand(f, WF, -0.36, 30, skin, { sq: 0.45, fw: 1.0, spread: 0.04, curl: 0.32, tips: inkT, shadow: P.skinS, tex: T(f, 'mottle'), texOp: 0.45, flip: true });
  // ---- near arm: habit sleeve to the elbow, linen oversleeve, the writing hand and the quill
  split(f, () => f.part(chain([add(SN, [-2, -10]), lerp(SN, EN, 0.4), EN, WN], [28, 50, 46, 36]), HB(f, { fill: habit })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 24)], ['forearm_n', side(EN, elb(SN, EN, WN), 24)]]);
  f.bone('forearm_n');
  f.part(chain([lerp(EN, WN, -0.05), lerp(EN, WN, 0.5), WN], [46, 42, 36], { bp: [[0, 0.5, 0.08, 0.3]] }), { fill: linen, shadow: linenD, tex: T(f, 'weave'), texOp: 0.4 });
  f.line([lp(EN, WN, 0.04, -21), lp(EN, WN, 0.04, 21)], 2.2, '#5a4a3a');
  f.line([lp(EN, WN, 0.04, 21), lp(EN, WN, 0.0, 28), lp(EN, WN, -0.06, 30)], 1.6, '#5a4a3a'); // tie ends
  f.stroke([lp(EN, WN, 0.2, 12), lp(EN, WN, 0.5, 14), lp(EN, WN, 0.8, 12)], 1.4);
  f.stroke([lp(EN, WN, 0.25, -10), lp(EN, WN, 0.6, -8)], 1.2);
  f.spatter(lerp(EN, WN, 0.8), 9, 6, inkT);
  f.bone('hand_n');
  const tip = [446, pg(446) - 0.5]; // the nib on the page; the heel of the hand rests on the desk's lower edge
  penHand(f, WN, tip, 31, skin, { tips: inkT, qAng: -2.5, qLen: 2.45, vane: 0.5, qW: 2.4, qCol: '#b8ac94' }); // stripped quill, back toward the shoulder
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.2, 12), lp(SN, EN, 0.55, 6), lp(SN, EN, 0.85, 14)]], 1.8);
  // ---- head: bowed over the page; a thin face, raised brows, reading lenses, tonsure, a quill behind the ear
  f.bone('head');
  const nk = add(HC, rot([-0.12 * H, 0.36 * H], hA));
  f.part(limb(add(N, [-4, 6]), nk, 32, 27, { capA: false }), SKN(f, skin)); // a thin, long neck
  f.line([lp(N, nk, 0.1, -7), lp(N, nk, 0.85, -9)], 1.1, mix(skin, '#000', 0.45), { op: 0.6 }); // tendon
  f.line([lp(N, nk, 0.35, 9), lp(N, nk, 0.55, 11), lp(N, nk, 0.7, 9)], 1, mix(skin, '#000', 0.45), { op: 0.5 }); // Adam's apple
  f.bone('torso');
  f.part([[300, 276], [320, 254], [346, 250], [366, 262], [368, 282], [344, 290], [314, 292]], HB(f, { fill: habitD, k: 0.85 })); // high cowl collar
  f.stroke([[316, 270], [338, 266], [358, 272]], 1.6); f.stroke([[322, 282], [344, 282]], 1.4);
  f.bone('head');
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 0.9, chin: 0.03, nose: 1.12, hook: 0.25, mouth: 'set', squint: 0.25, browDown: -0.05, age: true, gaunt: true, faceShade: 0.8, jawShade: 0.35, faceHatch: false,
    hairCol: '#8e8a82', browCol: '#6a665e', browW: 0.04,
    hairBack: [[-0.28, -0.36], [-0.44, -0.18], [-0.46, 0.06], [-0.38, 0.2], [-0.26, 0.12]],
    hair: [[-0.42, 0.14], [-0.46, -0.12], [-0.42, -0.3], [-0.3, -0.36], [-0.24, -0.3], [-0.28, -0.12], [-0.27, 0.04], [-0.34, 0.18]],
    hairLines: [[[-0.4, -0.2], [-0.36, 0.0]], [[-0.36, -0.28], [-0.32, -0.06]]],
  });
  // the tonsure's front: a thin grey fringe across the brow, the bare crown with a dull shine
  f.part(hf([[-0.3, -0.36], [-0.12, -0.41], [0.1, -0.43], [0.3, -0.37], [0.31, -0.31], [0.22, -0.33], [0.16, -0.3], [0.06, -0.33], [-0.04, -0.31], [-0.14, -0.32], [-0.24, -0.27]]), { fill: '#8e8a82', tex: T(f, 'mottle'), texOp: 0.4, inkW: 0.9, inkHeavy: 0.8, cast: false, shade: 0.3 });
  for (let i = 0; i < 9; i++) f.line(hf([[-0.24 + i * 0.065, -0.4], [-0.22 + i * 0.065, -0.33]]), 0.8, '#5a564e', { op: 0.6 });
  f.line(hf([[-0.18, -0.5], [0.0, -0.53], [0.14, -0.5]]), 1.6, mix(skin, '#fff', 0.45), { op: 0.6 });
  // raised brows: extra lift lines on the forehead
  f.line(hf([[0.02, -0.22], [0.1, -0.24], [0.2, -0.22]]), 0.9, INK, { op: 0.4 });
  f.line(hf([[0.04, -0.28], [0.12, -0.3], [0.2, -0.28]]), 0.8, INK, { op: 0.35 });
  // eyes lowered to the nib: a heavy upper lid over the eye, the iris dropped to the lower front of the opening
  f.flat(hf([[0.055, -0.059], [0.11, -0.086], [0.172, -0.063], [0.12, -0.053], [0.07, -0.054]]), mix(skin, '#5a3028', 0.35));
  f.line(hf([[0.058, -0.056], [0.11, -0.054], [0.168, -0.06]]), 1.5, INK);
  f.flat(hf(ell([0.142, -0.046], 0.014, 0.009, 0, 8)), '#1a120c');
  // reading lenses: two iron-rimmed rounds riveted at the bridge, on the nose
  const l1 = hf([[0.14, -0.04]])[0], l2 = hf([[0.31, -0.045]])[0];
  ring(f, l1, 7, 6.5, 1.6, '#2a2622', { ang: hA }); ring(f, l2, 3.6, 6, 1.4, '#2a2622', { ang: hA });
  f.flat(ell(l1, 6, 5.5, hA, 12), '#e8eef0', { op: 0.18 }); f.line([add(l1, [-4, -4]), add(l1, [0, -6])], 1, '#fff', { op: 0.6 });
  f.line([add(l1, rot([7, 0], hA)), add(l2, rot([-3.6, -1], hA))], 1.6, '#2a2622');
  f.rivet(lerp(add(l1, rot([7, 0], hA)), add(l2, rot([-3.6, -1], hA)), 0.5), 1.5, '#6a6a6a');
  // the spare quill behind the near ear: nib by the temple, the white vane laid back along the skull
  const q0 = hf([[-0.06, -0.1]])[0], q1 = hf([[-0.56, 0.12]])[0], qd = E.norm(sub(q1, q0)), qn = [qd[1], -qd[0]];
  f.line([q0, q1], 1.4, '#3a3028');
  for (let i = 0; i < 10; i++) { const t = 0.35 + i * 0.065, q = lerp(q0, q1, t), w = 5 * Math.sin(Math.PI * (i + 1) / 11); f.line([q, add(add(q, mul(qn, w)), mul(qd, 3))], 0.9, '#ece4d4', { op: 0.9 }); f.line([q, add(add(q, mul(qn, -w * 0.6)), mul(qd, 3))], 0.9, '#c8c0b0', { op: 0.7 }); }
  return f;
}

// ------------------------------------------------------------------ SISTER WENNA, THE INFIRMARER (Infirmarium), Human 1.0
// Broad and square, leaning her weight onto the treatment table on two straight, strong arms, sleeves rolled and pinned
// above the elbow. A linen apron stained rust-brown over habit and scapular; a vinegar-yellow cloth knotted at the throat
// over a wimple tied back hard; at the belt herb bundles, a bone saw, a roll of bandage and the waxed leather plague
// mask of the Barrow. Grey-green frost-scarred fingertips (Hollow Barrow). A tired, kind, sunken-eyed face.
function wenna() {
  const f = new Fig(KB(1604, { grimeY: 660 }));
  const H = 96;
  const habit = P.habit, habitD = P.habitD, skin = '#c69878', skinS = '#7a4a3e', linen = '#cbc2a8', linenD = '#8e8670', rust = '#6a3424', vin = '#a08e56', frost = '#9ea89a';
  const N = [334, 292], HC = [376, 236], hA = 0.08;
  const SN = [296, 320], EN = [336, 414], WN = [394, 488];
  const SF = [374, 308], EF = [404, 398], WF = [444, 477];
  const WB = [302, 470], dW = E.norm([-0.16, 1]), AF = [356, 758], AN = [256, 762];
  // ---- skeleton
  f.joint('pelvis', [292, 492]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [286, 304], 'torso').joint('apron', [330, 470], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_f', [326, 500], 'pelvis').joint('shin_f', [344, 630], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [266, 500], 'pelvis').joint('shin_n', [258, 632], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('mask', [270, 480], 'pelvis').joint('saw', [244, 470], 'pelvis').joint('table', [490, 790], null);

  // ---- back panel of the scapular
  f.bone('robe_back');
  f.part([[288, 302], [262, 330], [246, 420], [238, 540], [228, 690], [238, 724], [250, 716], [258, 680], [264, 540], [272, 420], [296, 330]], SC(f));
  // ---- far upper arm: sleeve rolled above the elbow (behind the chest)
  f.bone('upperarm_f');
  f.part(ragLimb(f, add(SF, [-4, -8]), lerp(SF, EF, 0.78), 46, 54, { depth: 6, teeth: 5 }), HB(f, { fill: habitD }));
  // ---- legs and boots
  hoseLegs(f, [['_f', [326, 500], [344, 630], AF], ['_n', [266, 500], [258, 632], AN]], { tw: 50, kw: 42, aw: 36 });
  bootRig(f, AF, '_f', 54, '#2e2218', { shaft: 1.0, strap: true });
  bootRig(f, AN, '_n', 54, '#261c14', { shaft: 1.0 });
  f.bone('shin_n'); f.part([[232, 694], [278, 692], [278, 716], [232, 718]], { fill: P.hose, tex: T(f, 'weave'), inkW: 1.2 });
  f.bone('shin_f'); f.part([[332, 690], [378, 688], [378, 712], [332, 714]], { fill: P.hose, tex: T(f, 'weave'), inkW: 1.2 });
  // ---- habit: square shoulders, a heavy chest, leaning; skirt to mid-calf; cut at the belt
  const hab = [[330, 290], [358, 294], [382, 304], [394, 332], [392, 380], [380, 430], [372, 470], [380, 520], [390, 580], [398, 640], [404, 702, 1],
    [380, 710], [354, 702, 1], [324, 712], [296, 702, 1], [268, 710], [240, 702, 1], [214, 708], [212, 650], [222, 590], [232, 530], [244, 490], [246, 450], [248, 400], [256, 344], [276, 310], [302, 294]];
  waistSplit(f, () => f.part(hab, HB(f)), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  folds(f, [[[236, 540], [226, 620], [220, 700]], [[264, 548], [262, 630], [266, 706]], [[388, 600], [396, 650], [400, 700]], [[246, 500], [250, 530], [248, 560]]], 2.2);
  hemWear(f, 214, 404, 706, { h: 70, op: 0.28 });
  f.spatter([380, 660], 16, 8, '#4a1a12'); // old blood near the hem
  // scapular front, cut at the belt
  waistSplit(f, () => f.part([[318, 292], [352, 294], [374, 310], [376, 370], [370, 440], [372, 560], [378, 660], [380, 690, 1], [344, 694, 1], [340, 600], [334, 470], [328, 400], [316, 330]], SC(f)), WB, 'skirt', 'torso', dW);
  // ---- the linen apron, stained rust-brown (one stiff piece on its own bone)
  f.bone('apron');
  const ap = [[326, 332], [370, 324], [382, 380], [378, 440], [384, 500], [392, 560], [398, 620], [400, 662, 1], [372, 668], [344, 660, 1], [314, 668], [288, 660, 1], [290, 600], [296, 520], [304, 470], [314, 400]];
  f.part(ap, { fill: linen, shadow: linenD, tex: T(f, 'weave'), texOp: 0.45, k: 0.8 });
  for (const [x, y, r] of [[350, 520, 16], [372, 600, 12], [318, 600, 18], [340, 440, 9], [306, 650, 8], [384, 470, 7]]) { f.flat(ell([x, y], r, r * 0.7, 0.5, 12), rust, { op: 0.55 }); f.flat(ell([x + 2, y + 2], r * 0.55, r * 0.4, 0.5, 10), mix(rust, '#2a0e08', 0.4), { op: 0.5 }); }
  f.stroke([[378, 470], [376, 520], [380, 580]], 3, mix(rust, '#000', 0.2)); // wiped hands, a long smear
  f.stroke([[384, 470], [384, 512]], 2, mix(rust, '#000', 0.2));
  folds(f, [[[330, 480], [328, 580], [334, 660]], [[300, 560], [296, 640]]], 1.8, mix(linenD, '#000', 0.4));
  f.line([[328, 336], [368, 328]], 1, linenD, { op: 0.8, dash: '3 2' });
  f.bone('torso');
  f.line([[318, 334], [322, 300], [342, 290]], 3, linenD); // neck strap
  // ---- rope belt, apron ties, herb bundles, bandage roll, bone saw, key ring, badge; the Barrow plague mask on the hip
  ropeBelt(f, [244, 458], [378, 474], 11, { sag: 5 });
  f.stroke([[250, 470], [242, 500], [246, 530]], 4, linenD); f.stroke([[256, 470], [264, 494], [260, 516]], 3.4, linenD); // apron ties
  f.bone('saw');
  // bone saw hung from the back of the belt by its handle, the bow and toothed blade hanging past the habit's edge
  f.line([[246, 466], [240, 478]], 2, '#2a1c12');
  f.part([[232, 476, 1], [246, 474, 1], [246, 512, 1], [232, 514, 1]], { fill: '#d8ccb0', shadow: '#8a7a5a', tex: T(f, 'mottle'), inkW: 1.1 }); // bone handle
  f.line([[233, 486], [245, 485]], 0.9, '#8a7a5a'); f.line([[233, 500], [245, 499]], 0.9, '#8a7a5a');
  const bow = [[238, 512], [224, 610], [206, 614], [196, 600], [214, 524], [232, 506]];
  f.line(bow, 6, INK); f.line(bow, 3.6, '#4a4a4c'); f.line(bow.slice(2, 5), 1, '#9a9a96', { op: 0.6 }); // iron bow
  f.part([[236, 512, 1], [242, 514, 1], [228, 608, 1], [222, 606, 1]], { fill: '#8a8c8c', shade: 0.3, inkW: 1, cast: false, hatch: false }); // blade
  for (let i = 0; i < 13; i++) { const q = lerp([235, 516], [222, 604], i / 12); f.line([q, add(q, [-4, 1])], 1, INK, { op: 0.8 }); } // teeth
  f.flat(ell([229, 570], 3, 6, 0.15, 8), '#4a1a12', { op: 0.6 });
  f.bone('pelvis');
  // herb bundles: sage and rue, tied with twine
  for (const [x, l, c] of [[350, 50, '#6e7a5a'], [362, 42, '#5e6a4a']]) { f.line([[x, 474], [x + 2, 486]], 1.2, '#5a4a30'); for (let i = 0; i < 7; i++) { const a = Math.PI / 2 + (i - 3) * 0.09; f.stroke([[x + 2, 486], add([x + 2, 486], rot([l * 0.5, 0], a)), add([x + 2, 486], rot([l, 0], a))], 3.4, i % 2 ? c : mix(c, '#000', 0.25)); } f.line([[x - 3, 494], [x + 7, 494]], 2, '#8a7448'); }
  f.part([[276, 478], [298, 476], [300, 500], [278, 502]].map(q => [q[0], q[1], 1]), { fill: linen, shadow: linenD, tex: T(f, 'weave'), inkW: 1.1 }); // bandage roll
  f.part(ell([288, 478], 11, 4, 0, 10), { fill: mix(linen, '#fff', 0.2), inkW: 1, cast: false, hatch: false }); ring(f, [288, 478], 5, 2, 0.9, linenD);
  f.line([[298, 494], [304, 520], [300, 540]], 2, linen); // a loose tail of bandage
  badgeOn(f, [306, 474], [308, 500], 9);
  f.bone('mask');
  // the waxed leather beak mask of the Barrow, hung by its strap, beak down, glass eyes dark
  f.line([[272, 470], [266, 500], [270, 512]], 2.2, '#2a1c12');
  const mk = frame([266, 520], 1.75, 1);
  f.part(mk([[-6, -16], [10, -20], [26, -14], [40, -6], [86, 0], [40, 8], [26, 16], [8, 20], [-8, 14], [-12, 0]]), { fill: '#4a3a26', shadow: '#1e140c', shade: 0.4, tex: T(f, 'mottle'), texOp: 0.5, inkW: 1.4 });
  f.line(mk([[26, -2], [84, 0]]), 1, mix('#4a3a26', '#fff', 0.35), { op: 0.6 }); // wax sheen along the beak
  for (const y of [-9, 9]) { ring(f, mk([[10, y]])[0], 6.5, 6.5, 2.2, '#2a2420'); f.flat(ell(mk([[10, y]])[0], 5, 5, 0, 10), '#1a2224'); f.line([add(mk([[10, y]])[0], [-2, -2]), add(mk([[10, y]])[0], [0, -3])], 1, '#9ab0b4', { op: 0.7 }); }
  for (let i = 0; i < 4; i++) f.rivet(mk([[30 + i * 12, -4 + (i % 2) * 8]])[0], 1.5, '#6a6a68');
  f.stitches(mk([[24, -12], [48, -6], [70, -2]]), '#a08a60', 0.8);
  f.bone('pelvis');
  keyRing(f, [334, 478], 11, [[-0.25, 32, 4.4], [0.05, 38, 5], [0.3, 30, 4]], { drop: 16 });
  // ---- the treatment table (root object): heavy scrubbed planks, old stains, legs
  f.bone('table');
  f.part([[392, 520, 1], [404, 518, 1], [404, 786, 1], [392, 786, 1]], { fill: P.oakD, tex: T(f, 'wood') }); // front-left leg
  f.part([[568, 512, 1], [582, 510, 1], [582, 784, 1], [568, 784, 1]], { fill: P.oakD, tex: T(f, 'wood') });
  f.part([[400, 680, 1], [574, 674, 1], [574, 690, 1], [400, 696, 1]], { fill: P.oakD, tex: T(f, 'wood') }); // stretcher
  f.part([[378, 502, 1], [596, 492, 1], [598, 512, 1], [380, 524, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 }); // front edge
  f.part([[378, 502, 1], [404, 474, 1], [592, 466, 1], [596, 492, 1]], { fill: mix(P.oakL, '#c0a888', 0.35), tex: T(f, 'wood'), texOp: 0.5 }); // scrubbed top
  for (const y of [484, 494]) f.line([[392, y + 4], [594, y - 6]], 1, P.oakD, { op: 0.7 }); // plank joints
  for (const [x, y, r] of [[520, 484, 18], [470, 478, 9], [560, 476, 7]]) f.flat(ell([x, y], r, r * 0.3, -0.04, 12), rust, { op: 0.45 });
  f.flat([[450, 508], [458, 506], [460, 530], [454, 540], [452, 520]], rust, { op: 0.5 }); // a run down the edge
  f.part([[520, 468, 1], [576, 466, 1], [580, 476, 1], [524, 478, 1]], { fill: linen, shadow: linenD, tex: T(f, 'weave'), inkW: 1.1 }); // folded linen
  // ---- far forearm, bare and strong, hand flat on the table
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.72), EF, lerp(EF, WF, 0.5), WF], [40, 42, 36, 28], { bp: [[1, 0.4, 0.14]] }), SKN(f, skin, { shadow: skinS }));
  f.part(ell(lerp(SF, EF, 0.8), 28, 11, Math.atan2(EF[1] - SF[1], EF[0] - SF[0]) + Math.PI / 2, 12), HB(f, { fill: habitD, cast: false })); // rolled cuff
  f.bone('hand_f');
  tableHand(f, [440, 486], -0.04, 62, skin, { thumbNear: true, tips: frost, veins: true, fw: 1.2, shadow: skinS, tex: T(f, 'mottle'), texOp: 0.45 }); // flat on the scrubbed top, weight on the heel
  // ---- near arm: rolled and pinned sleeve, thick bare forearm, hand flat on the table
  split(f, () => f.part(chain([lerp(SN, EN, 0.75), EN, lerp(EN, WN, 0.5), WN], [46, 46, 40, 30], { bq: [[1, 0.4, 0.14]] }), SKN(f, skin, { shadow: skinS })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 24)], ['forearm_n', side(EN, elb(SN, EN, WN), 24)]]);
  f.bone('forearm_n');
  f.line([lp(EN, WN, 0.2, -14), lp(EN, WN, 0.7, -12)], 1, mix(skin, '#000', 0.4), { op: 0.5 }); // tendon
  f.line([lp(EN, WN, 0.3, 6), lp(EN, WN, 0.5, 10), lp(EN, WN, 0.8, 6)], 1, '#5a6a8a', { op: 0.35 }); // vein
  f.bone('upperarm_n');
  f.part(ragLimb(f, add(SN, [6, -12]), lerp(SN, EN, 0.82), 52, 58, { depth: 6, teeth: 5 }), HB(f));
  f.part(ell(lerp(SN, EN, 0.8), 31, 12, Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) + Math.PI / 2, 14), HB(f, { fill: habitD })); // the roll
  f.line([lp(SN, EN, 0.74, -16), lp(SN, EN, 0.86, -12)], 1.6, '#9a9a96'); f.flat(ell(lp(SN, EN, 0.74, -16), 2, 2, 0, 6), '#cfcfcf'); // the pin
  folds(f, [[lp(SN, EN, 0.2, 12), lp(SN, EN, 0.5, 4), lp(SN, EN, 0.66, 14)]], 1.8);
  f.bone('hand_n');
  tableHand(f, [390, 497], -0.04, 68, skin, { tips: frost, veins: true, fw: 1.2, shadow: skinS, tex: T(f, 'mottle'), texOp: 0.45 });
  // ---- head: wimple tied back hard, a tired kind face; the vinegar cloth knotted at the throat
  f.bone('head');
  f.part(limb(add(N, [-6, 8]), add(HC, [-12, 34]), 48, 44), { fill: linen, shadow: linenD, tex: T(f, 'weave'), texOp: 0.35 }); // the wimple round the neck
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 1.06, chin: 0.0, nose: 1.0, hook: -0.1, mouth: 'set', squint: 0.42, browDown: -0.04, age: true, lips: true, lashes: true, faceShade: 0.85, jawShade: 0.4, faceHatch: false, noEar: true,
    browCol: '#5a4a3e', browW: 0.042,
  });
  // tired eyes: bags and a darker socket
  f.line(hf([[0.07, -0.01], [0.12, 0.02], [0.18, 0.0]]), 1, INK, { op: 0.55 }); f.line(hf([[0.27, -0.01], [0.31, 0.01]]), 0.9, INK, { op: 0.5 });
  f.flat(hf([[0.05, -0.03], [0.18, -0.02], [0.16, 0.03], [0.07, 0.02]]), '#5a3028', { op: 0.25 });
  // kind: the brows lift a little at the inner end, soft laugh lines at the mouth's corner, a heavy, broad cheek
  f.line(hf([[0.31, 0.27], [0.33, 0.25]]), 1, INK, { op: 0.45 });
  f.line(hf([[0.2, 0.17], [0.235, 0.24], [0.25, 0.3]]), 1, INK, { op: 0.35 });
  f.flat(hf(ell([0.1, 0.16], 0.12, 0.09, 0.2, 12)), mix(skin, '#fff', 0.2), { op: 0.18 });
  // the wimple: forehead band, cap over the skull, wrapping under the jaw; ties knotted hard at the back
  const wim = [[0.31, -0.34], [0.2, -0.5], [-0.04, -0.6], [-0.32, -0.52], [-0.5, -0.26], [-0.54, 0.08], [-0.46, 0.4], [-0.3, 0.62], [-0.06, 0.7], [0.18, 0.66], [0.3, 0.56], [0.26, 0.5], [0.12, 0.55], [-0.04, 0.46], [-0.14, 0.28], [-0.18, 0.04], [-0.12, -0.2], [0.04, -0.3], [0.2, -0.32]];
  f.part(hf(wim), { fill: linen, shadow: linenD, tex: T(f, 'weave'), texOp: 0.4, shade: 0.4 });
  f.part(hf([[0.33, -0.38], [0.2, -0.42], [-0.02, -0.4], [-0.14, -0.3], [-0.1, -0.24], [0.04, -0.3], [0.2, -0.32], [0.33, -0.31]]), { fill: mix(linen, '#fff', 0.15), shadow: linenD, inkW: 1.1, cast: false }); // stiff forehead band
  folds(f, hf([[[-0.3, -0.4], [-0.38, -0.1], [-0.34, 0.3]], [[-0.18, 0.4], [-0.02, 0.6]], [[-0.44, 0.0], [-0.42, 0.34]]]), 1.6, mix(linenD, '#000', 0.4));
  const kn = hf([[-0.52, -0.16]])[0];
  f.part(ell(kn, 7, 6, 0, 10), { fill: linen, shadow: linenD, inkW: 1.1, cast: false });
  f.stroke([kn, add(kn, [-8, 14]), add(kn, [-10, 30])], 5, linenD); f.stroke([add(kn, [2, 2]), add(kn, [-2, 18]), add(kn, [0, 36])], 4.4, linen); // ties hanging plumb
  // vinegar cloth at the throat: a twisted band, knot in front, two short ends
  f.bone('torso');
  f.part([[320, 298], [334, 290], [352, 292], [368, 290], [378, 298], [372, 306], [354, 304], [336, 308], [322, 308]], { fill: vin, shadow: '#5a4a24', tex: T(f, 'weave'), texOp: 0.55, inkW: 1.3, shade: 0.45 });
  for (const x of [332, 344, 356]) f.line([[x, 292], [x + 4, 306]], 1, '#5a4a24', { op: 0.7 }); // the twist
  f.part(ell([374, 302], 6, 5, 0.3, 10), { fill: mix(vin, '#000', 0.15), shadow: '#5a4a24', inkW: 1.2, cast: false });
  f.part([[372, 306], [380, 306], [384, 322], [376, 326]], { fill: vin, shadow: '#5a4a24', inkW: 1, cast: false, tex: T(f, 'weave'), texOp: 0.5 });
  f.part([[368, 306], [374, 308], [370, 320], [364, 318]], { fill: mix(vin, '#000', 0.2), inkW: 1, cast: false });
  f.flat(ell([350, 300], 5, 2.4, 0, 8), '#6a5a2a', { op: 0.5 }); // a damp stain
  return f;
}

// ------------------------------------------------------------------ BROTHER FENN, THE ALMONER (Almonry), Human 0.95
// Round, leaning his belly to the counter, soft hands spread on the open ledger (red entries). A habit of better wool
// than anyone else's, a shade darker, with fur-trimmed cuffs (his vanity); a fat purse and a counting board of beads at
// the belt; spectacles on a cord over the belly; a seal ring; an ink-stained thumb. Glossy tonsure, ruddy round face,
// double chin, a cheerful mouth and small calculating eyes.
// Lore change 2026-11-23 (a hint only, never stated): he was a ledger clerk in the Sulphur Pits. His oldest ledger lies
// closed at the end of the counter under the dish of ostia, its page edges stained sulphur yellow.
function fenn() {
  const f = new Fig(KB(1605, { grimeY: 700 }));
  const H = 98;
  const habit = '#5c4838', habitD = '#46362a', skin = '#d29a80', skinS = '#8a4a40', fur = '#7a6450', furD = '#3e3226';
  // a fur cuff: a soft, uneven roll round the wrist, its pile ruffled at the edge (not a hard disc)
  const furCuff = (c, a, r) => {
    const pts = []; for (let i = 0; i < 22; i++) { const t = Math.PI * 2 * i / 22, k = 1 + (f.r() - 0.5) * 0.22; pts.push(add(c, rot([Math.cos(t) * r * 0.5 * k, Math.sin(t) * r * k], a))); }
    f.part(pts, { fill: fur, shadow: furD, tex: T(f, 'mottle'), texOp: 0.6, shade: 0.45, inkW: 1.1, inkHeavy: 1.6 });
    f.flat(ell(add(c, rot([r * 0.1, 0], a)), r * 0.28, r * 0.72, a, 12), furD, { op: 0.55 }); // the sleeve's dark mouth
    for (let i = 0; i < 26; i++) { const t = Math.PI * 2 * i / 26, q = add(c, rot([Math.cos(t) * r * 0.5, Math.sin(t) * r], a)), o2 = rot([Math.cos(t) * 1.6, Math.sin(t) * 2.2], a + (f.r() - 0.5) * 0.8); f.line([add(q, mul(o2, -1.2)), add(q, o2)], 1, i % 3 ? mix(fur, '#d8ccb8', 0.25) : furD, { op: 0.6 }); } // pile, short and soft
  };
  const N = [318, 304], HC = [356, 250], hA = 0.04;
  const SN = [278, 330], EN = [312, 424], WN = [382, 442];
  const SF = [354, 320], EF = [400, 394], WF = [476, 430];
  const WB = [300, 504], dW = E.norm([-0.24, 1]), AF = [318, 756], AN = [240, 760];
  // ---- skeleton
  f.joint('pelvis', [292, 520]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [262, 316], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_f', [318, 530], 'pelvis').joint('shin_f', [322, 646], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [262, 530], 'pelvis').joint('shin_n', [250, 648], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('purse', [252, 500], 'pelvis').joint('beads', [290, 512], 'pelvis').joint('counter', [470, 790], null);

  // ---- back panel of the scapular
  f.bone('robe_back');
  f.part([[264, 312], [236, 340], [220, 440], [214, 560], [208, 700], [218, 742], [230, 736], [236, 700], [242, 560], [248, 440], [272, 340]], SC(f));
  // ---- far upper arm (behind the chest)
  f.bone('upperarm_f');
  f.part(chain([add(SF, [-4, -8]), lerp(SF, EF, 0.4), EF], [30, 54, 54]), HB(f, { fill: habitD }));
  // ---- legs and shoes
  hoseLegs(f, [['_f', [318, 530], [322, 646], AF], ['_n', [262, 530], [250, 648], AN]], { tw: 50, kw: 42, aw: 36 });
  bootRig(f, AF, '_f', 50, '#3a2a1c', { shaft: 0.6 });
  bootRig(f, AN, '_n', 50, '#32241a', { shaft: 0.6 });
  // ---- habit: a barrel chest and a round belly, belt riding under it; good dark wool; cut at the belt
  const hab = [[314, 302], [342, 306], [366, 320], [384, 350], [394, 400], [398, 450], [392, 496], [374, 530], [372, 600], [378, 680], [384, 742, 1],
    [356, 748], [330, 740, 1], [300, 750], [272, 740, 1], [246, 748], [220, 740, 1], [218, 680], [220, 600], [226, 540], [226, 500], [220, 440], [224, 380], [238, 336], [264, 312], [290, 304]];
  waistSplit(f, () => f.part(hab, HB(f, { fill: habit, texOp: 0.4 })), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  folds(f, [[[236, 560], [230, 650], [228, 740]], [[270, 560], [268, 660], [270, 744]], [[360, 560], [368, 650], [374, 740]]], 2);
  hemWear(f, 220, 384, 742, { h: 40, op: 0.15 });
  f.bone('torso');
  f.stroke([[384, 380], [392, 430], [386, 480]], 2); f.stroke([[240, 360], [232, 420], [232, 480]], 2); // the belly's roundness
  f.line([[300, 330], [340, 324]], 1, mix(habit, '#fff', 0.3), { op: 0.4 }); // sheen of good wool
  // scapular front over the belly, cut at the belt
  waistSplit(f, () => f.part([[302, 306], [336, 306], [356, 322], [366, 380], [366, 450], [358, 510], [354, 600], [358, 700], [360, 740, 1], [322, 742, 1], [320, 700], [318, 600], [322, 510], [326, 450], [324, 380], [310, 330]], SC(f)), WB, 'skirt', 'torso', dW);
  f.bone('torso');
  f.stroke([[352, 380], [360, 430], [354, 480]], 1.6, P.scapL);
  // spectacles on a cord over the belly
  f.line([[300, 312], [312, 380], [336, 430]], 1, '#2a2018'); f.line([[338, 312], [350, 380], [344, 426]], 1, '#2a2018');
  ring(f, [336, 436], 7, 6, 1.6, '#2a2420'); ring(f, [350, 432], 6, 5.5, 1.6, '#2a2420'); f.line([[343, 434], [344, 433]], 2, '#2a2420');
  f.flat(ell([336, 436], 6, 5, 0, 10), '#e8eef0', { op: 0.2 }); f.line([[333, 433], [336, 431]], 1, '#fff', { op: 0.7 });
  // rope belt under the belly; the fat purse and the counting board on the near hip; badge; keys
  ropeBelt(f, [224, 490], [384, 522], 11, { sag: 3, knot: 0.8, ends: [[-2, 40, -2], [4, 54, 2]] });
  f.bone('purse');
  f.line([[254, 494], [250, 516]], 2.4, '#2a1c12'); f.line([[262, 496], [264, 516]], 2.4, '#2a1c12');
  f.part([[240, 518], [272, 514], [284, 540], [282, 574], [262, 588], [238, 582], [228, 556], [232, 530]], { fill: '#5a3a22', shadow: '#2a1810', tex: T(f, 'mottle'), texOp: 0.55, shade: 0.4 }); // the purse, fat with coin
  f.part([[238, 514], [276, 510], [278, 522], [240, 526]], { fill: '#4a2e1a', inkW: 1.2, cast: false }); // gathered neck
  for (const x of [246, 256, 266]) f.line([[x, 514], [x + 1, 526]], 1, INK, { op: 0.6 });
  f.line([[244, 540], [256, 566], [272, 572]], 1, mix('#5a3a22', '#fff', 0.3), { op: 0.5 });
  f.part(ell([256, 548], 5, 4, 0, 8), { fill: P.lead, inkW: 0.9, cast: false }); // a lead token pressing through the leather
  f.bone('beads');
  // counting board: a small oak frame with four wires of bone beads
  f.line([[292, 510], [294, 530]], 1.6, '#2a1c12');
  f.part([[280, 530, 1], [318, 528, 1], [320, 586, 1], [282, 588, 1]], { fill: P.oak, tex: T(f, 'wood'), inkW: 1.3 });
  f.part([[285, 535, 1], [314, 533, 1], [315, 582, 1], [287, 583, 1]], { fill: '#2a1c12', inkW: 0.8, cast: false, hatch: false });
  for (let r = 0; r < 4; r++) { const y = 542 + r * 11; f.line([[286, y], [315, y - 1]], 1, '#8a8a86'); for (let k = 0; k < 4; k++) { const x = 290 + k * 5 + (k > 1 ? 7 - r * 2 : 0); f.part(ell([x, y - 0.5 * k / 4], 2.6, 3.4, 0, 8), { fill: '#d8ccb0', shade: 0.4, inkW: 0.8, cast: false, hatch: false }); } }
  f.bone('pelvis');
  keyRing(f, [330, 520], 11, [[-0.25, 32, 4.4], [0.05, 38, 5], [0.3, 30, 4]], { drop: 16 });
  badgeOn(f, [312, 514], [316, 540], 9);
  // ---- the counter (root object): a solid oak front, a moulded top; the ledger open on it, a dish of ostia
  f.bone('counter');
  f.part([[340, 470, 1], [592, 460, 1], [594, 786, 1], [342, 790, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 });
  f.line([[356, 492], [578, 484], [578, 770], [356, 774], [356, 492]], 1.4, P.oakD, { op: 0.9, straight: true });
  f.line([[466, 488], [466, 772]], 1.4, P.oakD, { op: 0.8 });
  for (const x of [360, 574]) for (const y of [500, 760]) f.rivet([x, y], 2.6, '#5a5a5a');
  f.part([[348, 610, 1], [586, 604, 1], [586, 618, 1], [348, 624, 1]], { fill: P.iron, inkW: 1.2, cast: false }); // iron strap
  for (const x of [394, 430, 502, 538]) f.line([[x, 490], [x + 1, 772]], 1, P.oakD, { op: 0.55 }); // boards
  f.part([[490, 520, 1], [544, 518, 1], [544, 566, 1], [490, 568, 1]], { fill: P.iron, shade: 0.4, inkW: 1.2 }); // lock plate of the alms box
  f.flat([[512, 532], [522, 532], [522, 550], [512, 550]], '#0e0c0a'); for (const [x, y] of [[494, 524], [540, 524], [494, 562], [540, 562]]) f.rivet([x, y], 1.8, '#6a6a6a');
  f.flat([[420, 436], [470, 434], [470, 438], [420, 440]], '#0e0c0a', { op: 0.8 }); // the alms slot in the top
  f.scratches([460, 660], 60, 8, '#a88a64', 0.8, 0.2);
  f.part([[332, 456, 1], [598, 446, 1], [600, 462, 1], [334, 474, 1]], { fill: P.oakD, tex: T(f, 'wood') }); // top edge
  f.part([[332, 456, 1], [356, 430, 1], [590, 422, 1], [598, 446, 1]], { fill: mix(P.oakL, '#000', 0.1), tex: T(f, 'wood'), texOp: 0.55 }); // top
  // the ledger, open toward him, red entries among the black
  f.part([[376, 452, 1], [452, 448, 1], [458, 430, 1], [390, 432, 1]], { fill: '#d6cab0', shadow: '#9a8a6a', shade: 0.3, inkW: 1.1, hatch: false });
  f.part([[452, 448, 1], [528, 444, 1], [528, 426, 1], [458, 430, 1]], { fill: '#dccfb4', shadow: '#9a8a6a', shade: 0.3, inkW: 1.1, hatch: false });
  f.line([[452, 448], [458, 430]], 1.2, '#8a7a5a');
  for (let i = 0; i < 5; i++) { const t = i / 5; f.line([[392 + t * 6, 448 - t * 15], [444 + t * 6, 446 - t * 15]], 1, i === 2 ? rubric : '#2a2420', { op: 0.75 }); f.line([[466 + t * 2, 445 - t * 15], [516 + t * 2, 442 - t * 15]], 1, i === 1 || i === 3 ? rubric : '#2a2420', { op: 0.75 }); }
  f.part([[372, 454, 1], [532, 446, 1], [534, 450, 1], [374, 458, 1]], { fill: '#3a2a1c', inkW: 1, cast: false });
  // his oldest ledger, lying closed at the end of the counter: thick, the boards scuffed through to the wood at the
  // corners, the page edges stained sulphur yellow, darkest in a tide line where the damp of the pits got in
  const sul = '#c8b040', sulD = '#8a7428';
  f.part([[536, 448, 1], [594, 445, 1], [594, 441, 1], [536, 444, 1]], { fill: '#3a2618', inkW: 1.1, cast: false }); // lower board
  f.part([[537, 444, 1], [593, 441, 1], [593, 430, 1], [537, 433, 1]], { fill: '#cdbf98', shadow: '#8a7a5a', shade: 0.3, inkW: 1, cast: false, hatch: false }); // the page block's fore-edge
  f.flat([[537, 444], [556, 443], [574, 442], [582, 441], [578, 438], [568, 440], [558, 437], [548, 439], [540, 436], [537, 437]], sul, { op: 0.55 }); // the stain soaked up from below, patchy
  f.flat(ell([588, 437], 4, 2, 0, 8), sul, { op: 0.4 });
  f.line([[537, 437], [540, 436], [548, 439], [558, 437], [568, 440], [578, 438], [582, 441]], 0.9, sulD, { op: 0.75 }); // its tide line
  for (let i = 0; i < 4; i++) f.line([[538, 442 - i * 2.6], [592, 439 - i * 2.6 + (i % 2) * 0.6]], 0.6, '#6a5a3a', { op: 0.45 }); // leaves
  f.part([[535, 433, 1], [595, 430, 1], [595, 427, 1], [535, 430, 1]], { fill: '#3e2a1a', inkW: 1.1, cast: false }); // upper board's edge
  f.part([[535, 430, 1], [595, 427, 1], [601, 419, 1], [541, 422, 1]], { fill: '#4a3020', tex: T(f, 'mottle'), texOp: 0.6, shade: 0.3, inkW: 1.1, cast: false }); // the cover, seen from above
  for (const q of [[537, 429], [592, 427]]) f.flat(ell(q, 4, 2, 0, 6), P.oakL, { op: 0.7 }); // corners worn through to the board
  f.flat(ell([556, 428], 6, 1.6, -0.05, 8), sul, { op: 0.55 }); // a yellow bloom on the board's edge
  for (const [x, y] of [[548, 432], [553, 431], [588, 429]]) f.flat([[x, y], [x + 1.6, y - 1.6], [x + 3, y], [x + 1.4, y + 1.2]], '#e0cc60', { op: 0.9 }); // sulphur crystals in the edge
  // a pewter dish of lead ostia, set on the old ledger
  f.part(ell([568, 422], 22, 6, -0.03, 14), { fill: '#6a6a66', shadow: '#3a3a38', shade: 0.4, inkW: 1.2 });
  for (const [x, y] of [[560, 420], [570, 418], [578, 422], [566, 424]]) { const t = [x, y]; f.part([add(t, [-4, 2]), add(t, [-4, -3]), add(t, [0, -5]), add(t, [4, -3]), add(t, [4, 2])], { fill: P.lead, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); f.flat([add(t, [-1.5, 2.2]), add(t, [-1.5, -1.2]), add(t, [0, -2.6]), add(t, [1.5, -1.2]), add(t, [1.5, 2.2])], '#1a1818'); } // the doorway, arched and open to the token's foot (a centred dark dot read as a pupil)
  // ---- far forearm with its fur cuff; soft hand spread on the ledger
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.6), EF, WF], [52, 54, 46], { bq: [[1, 0.6, 0.3, 0.25]] }), HB(f, { fill: habitD }));
  furCuff(lerp(EF, WF, 0.9), Math.atan2(WF[1] - EF[1], WF[0] - EF[0]), 26);
  f.bone('hand_f');
  tableHand(f, [474, 438], -0.03, 58, skin, { thumbNear: true, fw: 1.35, thumbTip: '#3a3040', shadow: skinS, tex: T(f, 'mottle'), texOp: 0.4 }); // soft hand spread on the ledger, the ink-stained thumb toward us
  // ---- near arm: a wide sleeve, elbow out, fur cuff, hand spread on the page; seal ring and ink-stained thumb
  split(f, () => f.part(chain([add(SN, [4, -12]), lerp(SN, EN, 0.4), EN, WN], [30, 58, 60, 52], { bp: [[2, 0.5, 0.3, 0.25]] }), HB(f, { fill: habit })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 26)], ['forearm_n', side(EN, elb(SN, EN, WN), 26)]]);
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.2, 12), lp(SN, EN, 0.55, 4), lp(SN, EN, 0.85, 14)]], 1.8);
  f.bone('forearm_n');
  folds(f, [[lp(EN, WN, 0.1, 18), lp(EN, WN, 0.5, 24), lp(EN, WN, 0.8, 22)]], 1.8);
  furCuff(lerp(EN, WN, 0.93), Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), 28);
  f.bone('hand_n');
  tableHand(f, [380, 451], -0.03, 62, skin, { fw: 1.35, shadow: skinS, tex: T(f, 'mottle'), texOp: 0.4, ring: '#7c7c76' });
  // ---- head: glossy tonsure, ruddy round face, double chin, cheerful mouth, small calculating eyes
  f.bone('head');
  f.part(limb(N, add(HC, [-8, 32]), 56, 52), SKN(f, skin, { shadow: skinS }));
  f.bone('torso');
  f.part([[278, 318], [300, 300], [334, 298], [358, 310], [356, 326], [326, 330], [292, 330]], HB(f, { fill: habitD, k: 0.85 })); // cowl
  f.stroke([[292, 314], [318, 318], [344, 314]], 1.6);
  f.bone('head');
  // the dewlap: a soft fold of throat hanging from under the jaw into the cowl, drawn under the head so the jaw line
  // creases over it (one fleshy mass with the neck, not a separate roll)
  const hf0 = frame(HC, hA, H);
  f.part(hf0([[0.3, 0.46], [0.27, 0.6], [0.16, 0.7], [0.0, 0.72], [-0.16, 0.66], [-0.3, 0.5], [-0.26, 0.3], [0.0, 0.42]]), SKN(f, skin, { shadow: '#5e4034', hatch: false, inkW: 1.2, inkHeavy: 1.6 }));
  f.line(hf0([[0.24, 0.62], [0.1, 0.68], [-0.06, 0.66]]), 1, mix(skin, '#000', 0.45), { op: 0.5 }); // the fold under it
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 1.34, chin: 0.0, nose: 0.98, hook: -0.25, mouth: 'smirk', squint: 0.6, browDown: 0.04, lips: true, faceShade: 0.75, jawShade: 0.3, faceHatch: false, glint: true,
    hairCol: '#6a5a4a', browCol: '#5a4a3a', browW: 0.04,
    hairBack: [[-0.3, -0.34], [-0.45, -0.16], [-0.47, 0.08], [-0.4, 0.24], [-0.3, 0.16]],
    hair: [[-0.44, 0.16], [-0.47, -0.1], [-0.42, -0.3], [-0.3, -0.37], [-0.16, -0.37], [-0.15, -0.31], [-0.26, -0.22], [-0.3, -0.08], [-0.3, 0.1], [-0.36, 0.2]],
  });
  // the second chin's crease, a round cheek pushed up by the smile, ruddy cheeks and nose, crow's feet of a man who
  // smiles while counting
  f.line(hf([[0.08, 0.5], [0.2, 0.53], [0.29, 0.49]]), 1.1, mix(skin, '#000', 0.5), { op: 0.6 });
  f.flat(hf(ell([0.14, 0.12], 0.12, 0.09, 0.2, 12)), mix(skin, '#fff', 0.25), { op: 0.25 }); // the apple of the cheek
  f.line(hf([[0.22, 0.2], [0.27, 0.25], [0.3, 0.28]]), 1, INK, { op: 0.5 }); // the smile fold
  f.flat(hf(ell([0.12, 0.12], 0.1, 0.07, 0, 10)), '#c0504a', { op: 0.3 });
  f.flat(hf(ell([0.36, 0.1], 0.05, 0.04, 0, 8)), '#c0504a', { op: 0.3 });
  f.line(hf([[0.17, -0.02], [0.2, 0.02]]), 0.9, INK, { op: 0.5 }); f.line(hf([[0.17, -0.06], [0.22, -0.06]]), 0.9, INK, { op: 0.5 });
  // the tonsure fringe and a glossy shine on the crown
  f.part(hf([[-0.3, -0.34], [-0.12, -0.39], [0.08, -0.41], [0.28, -0.36], [0.29, -0.3], [0.2, -0.32], [0.1, -0.29], [0.0, -0.32], [-0.12, -0.3], [-0.24, -0.26]]), { fill: '#6a5a4a', tex: T(f, 'mottle'), texOp: 0.4, inkW: 0.9, inkHeavy: 0.8, cast: false, shade: 0.3 });
  glow(f, hf([[-0.06, -0.49]])[0], H * 0.14, H * 0.05, '#fff4e0', 0.6); // the glossy crown: a soft shine, not a painted bar
  f.flat(hf(ell([0.02, -0.5], 0.025, 0.012, -0.1, 8)), '#fff8ec', { op: 0.6 });
  return f;
}

// ------------------------------------------------------------------ SISTER IDE, THE SACRISTAN (Sacristy), Human 0.95
// Slight and very upright, the only bleached, near-white habit in the abbey under the black scapular. Her bare near hand,
// blue-cold at the fingertips, rests on the glass of the relic case where the Teeth lie; the gloved far hand holds the
// small sanctus bell silent at her waist. A linen band bound over her eyes, a fine white veil, milky eyes glimpsed at the
// band's edge, frost on her lashes and on her breath. The sacristy keys and a candle snuffer at the belt.
function ide() {
  const f = new Fig(KB(1606, { grimeY: 720 }));
  const H = 94;
  const habit = '#bab4a6', habitD = '#948e80', skin = '#d8c2b2', skinS = '#8a6a68', veil = '#e2ddd2', veilD = '#a8a296', veilS = '#b4ada0', glove = '#dcd8cc', cold = '#a2b4c8';
  const N = [316, 292], HC = [344, 238], hA = 0.2;
  const SN = [288, 314], EN = [304, 404], WN = [388, 431];
  const SF = [346, 308], EF = [364, 414], WF = [328, 438];
  const WB = [302, 446], AF = [328, 756], AN = [264, 760];
  // ---- skeleton
  f.joint('pelvis', [300, 466]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [292, 300], 'torso').joint('veil', [300, 260], 'head');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('bell', [324, 438], 'hand_f');
  f.joint('thigh_f', [322, 474], 'pelvis').joint('shin_f', [326, 612], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [276, 474], 'pelvis').joint('shin_n', [268, 614], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('keys', [262, 452], 'pelvis').joint('relic_case', [480, 790], null);

  // ---- the relic case (root object): a glass box with gilt corners on an oak stand; the Teeth on black velvet inside
  f.bone('relic_case');
  for (const x of [394, 568]) { f.part([[x - 8, 496, 1], [x + 8, 494, 1], [x + 8, 784, 1], [x - 8, 784, 1]], { fill: P.oakD, tex: T(f, 'wood') }); f.part([[x - 14, 790, 1], [x - 10, 778], [x + 10, 778], [x + 14, 790, 1]], { fill: P.oakD }); }
  f.part([[392, 690, 1], [570, 686, 1], [570, 700, 1], [392, 704, 1]], { fill: P.oakD, tex: T(f, 'wood') });
  f.part([[380, 486, 1], [586, 478, 1], [588, 506, 1], [382, 514, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 }); // the base box
  f.line([[390, 498], [578, 491]], 1, P.oakL, { op: 0.5 });
  // inside, behind the glass: velvet bed and the Teeth
  f.part([[386, 484, 1], [400, 446, 1], [578, 438, 1], [582, 478, 1]], { fill: '#1c1820', shadow: '#0c0a0e', shade: 0.3, tex: T(f, 'mottle'), texOp: 0.4, inkW: 1 });
  const glint = [508, 462];
  f.raw(`<ellipse cx="${glint[0]}" cy="${glint[1]}" rx="34" ry="16" fill="#ffb060" opacity="0.28" filter="url(#soft1606)"/>`);
  for (const [x, y, w, h, a] of [[428, 470, 13, 22, -0.3], [466, 466, 11, 26, 0.2], [508, 464, 15, 20, -0.1], [548, 460, 10, 24, 0.35]]) {
    const F2 = frame([x, y], a, 1);
    f.part(F2([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2 + 2, h * 0.1], [w * 0.2, h / 2], [0, h * 0.2], [-w * 0.2, h / 2], [-w / 2 - 2, h * 0.1]]), { fill: '#d8c8a0', shadow: '#7a6a48', shade: 0.4, inkW: 1.1, inkHeavy: 1.5, cast: false });
    f.line(F2([[-w / 2 + 2, -h / 2 + 3], [-w / 2 + 3, 0]]), 1, '#fff4d8', { op: 0.7 });
    f.line(F2([[-w / 4, -h / 2 + 2], [w / 4, -h / 2 + 2]]), 0.9, '#6a5a3a', { op: 0.6 });
  }
  f.flat(ell(glint, 2.4, 2.4, 0, 8), '#fff0c8'); f.line([add(glint, [-6, 0]), add(glint, [6, 0])], 1, '#ffe0a0', { op: 0.8 }); f.line([add(glint, [0, -5]), add(glint, [0, 5])], 1, '#ffe0a0', { op: 0.8 });
  // the glass: top and front, pale and clear, streaked with light
  f.flat([[386, 484], [400, 446], [578, 438], [582, 478]], '#c8d8e0', { op: 0.12, sharp: true });
  f.flat([[386, 446], [574, 438], [578, 428], [398, 434]], '#d8e4ea', { op: 0.35, sharp: true }); // the top glass, seen at a grazing angle (sharp: a smoothed quad bulged into a grey halo round the case)
  for (const [x0, y0] of [[410, 480], [440, 478], [530, 472]]) f.line([[x0, y0], [x0 + 22, y0 - 34]], 2, '#eef4f6', { op: 0.35 });
  f.line([[386, 484], [400, 446], [578, 438], [582, 478], [386, 484]], 2.2, P.gold, { straight: true }); f.line([[386, 446], [398, 434], [578, 428]], 1.6, P.gold, { straight: true, op: 0.9 });
  f.line([[386, 446], [400, 446]], 1.6, P.gold);
  for (const p of [[386, 484], [400, 446], [578, 438], [582, 478], [398, 434], [578, 428]]) { f.part(ell(p, 5, 5, 0, 8), { fill: P.gold, light: P.goldL, shade: 0.4, inkW: 1, cast: false, hatch: false }); }
  f.line([[392, 448], [570, 440]], 1, P.goldL, { op: 0.6 });
  // ---- back panel of the scapular and the veil behind
  f.bone('robe_back');
  f.part([[294, 300], [272, 330], [262, 440], [254, 580], [248, 720], [258, 752], [270, 746], [276, 700], [282, 580], [288, 440], [302, 330]], SC(f));
  // ---- far arm: upper sleeve behind the chest
  f.bone('upperarm_f');
  f.part(chain([add(SF, [-4, -8]), lerp(SF, EF, 0.4), EF], [26, 44, 44]), HB(f, { fill: habitD }));
  // ---- legs and shoes
  hoseLegs(f, [['_f', [322, 474], [326, 612], AF], ['_n', [276, 474], [268, 614], AN]], { tw: 40, kw: 34, aw: 30, col: '#8a8478' });
  bootRig(f, AF, '_f', 46, '#3a3430', { shaft: 0.5 });
  bootRig(f, AN, '_n', 46, '#322c28', { shaft: 0.5 });
  // ---- the bleached habit: slight, straight, to the floor; cut at the belt
  const hab = [[312, 290], [336, 296], [354, 310], [362, 340], [360, 390], [352, 430], [350, 470], [356, 540], [364, 620], [372, 700], [378, 750, 1],
    [354, 756], [330, 748, 1], [304, 756], [280, 748, 1], [256, 756], [236, 748, 1], [240, 680], [248, 600], [256, 520], [260, 470], [256, 430], [252, 380], [256, 330], [270, 306], [292, 294]];
  waistSplit(f, () => f.part(hab, HB(f, { fill: habit, texOp: 0.4 })), WB);
  f.bone('skirt');
  folds(f, [[[264, 500], [258, 620], [252, 748]], [[290, 500], [290, 630], [292, 752]], [[348, 540], [358, 640], [370, 748]], [[310, 600], [312, 750]]], 1.8, '#5a564c');
  hemWear(f, 236, 378, 750, { h: 40, op: 0.12, thread: 0.3 });
  f.bone('torso');
  folds(f, [[[266, 340], [262, 390], [264, 432]], [[352, 340], [348, 400]]], 1.6, '#5a564c');
  // black scapular, cut at the belt
  waistSplit(f, () => f.part([[304, 294], [334, 296], [350, 312], [350, 380], [344, 440], [346, 560], [352, 700], [354, 748, 1], [320, 752, 1], [316, 700], [312, 560], [308, 440], [300, 380], [298, 320]], SC(f)), WB);
  f.bone('skirt');
  f.line([[330, 470], [334, 620], [338, 744]], 1.2, P.scapL, { op: 0.6 });
  f.bone('torso');
  ropeBelt(f, [258, 440], [356, 446], 9, { sag: 4, col: '#9a8e70' });
  // ---- at the belt: sacristy keys, the badge, a candle snuffer hanging at the back of the hip
  f.bone('keys');
  keyRing(f, [264, 448], 12, [[-0.35, 38, 4.6], [-0.05, 44, 5], [0.2, 36, 4.4], [0.45, 40, 4.8]], { drop: 20 });
  f.bone('pelvis');
  badgeOn(f, [292, 450], [296, 476], 9);
  f.line([[254, 446], [246, 470]], 1.4, '#2a2018');
  f.line([[246, 470], [236, 600]], 4.4, INK); f.line([[246, 470], [236, 600]], 2.6, '#7a6a48'); // snuffer rod (brass)
  f.part([[230, 598], [242, 600], [246, 622], [226, 620]], { fill: '#7a6a48', shade: 0.4, inkW: 1.1, cast: false }); // its cone
  f.line([[238, 610], [252, 616]], 1.6, '#7a6a48');
  // ---- far arm: forearm across the waist, the white glove closed on the sanctus bell's handle, the bell silent below
  f.bone('bell');
  f.line([[324, 446], [324, 470]], 5, INK); f.line([[324, 446], [324, 470]], 3, '#5a4a30');
  f.part([[316, 470], [332, 470], [336, 482], [344, 498, 1], [304, 498, 1], [312, 482]], { fill: '#8a6e44', shadow: '#3a2a18', shade: 0.4, inkW: 1.2 }); // bronze bell
  f.line([[306, 494], [342, 494]], 1, '#c0a070', { op: 0.6 }); f.flat(ell([324, 499], 4, 2.4, 0, 8), '#2a1e12');
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.7), EF, WF], [42, 40, 30]), HB(f, { fill: habitD }));
  f.part(ell(lerp(EF, WF, 0.86), 8, 18, Math.atan2(WF[1] - EF[1], WF[0] - EF[0]), 10), { fill: '#3a3630', inkW: 1, cast: false });
  f.bone('hand_f');
  B.grip(f, [324, 438], EF, -Math.PI / 2, 21, glove, { shadow: '#8a867a', name: 'ide bell' });
  // ---- near arm: sleeve, bare forearm toward the case, the bare cold hand resting on the glass
  split(f, () => f.part(chain([add(SN, [4, -10]), lerp(SN, EN, 0.4), EN, WN], [26, 46, 44, 36], { bp: [[2, 0.5, 0.25, 0.25]] }), HB(f, { fill: habit })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 22)], ['forearm_n', side(EN, elb(SN, EN, WN), 22)]]);
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.25, 10), lp(SN, EN, 0.6, 4), lp(SN, EN, 0.9, 12)]], 1.6, '#5a564c');
  f.bone('forearm_n');
  folds(f, [[lp(EN, WN, 0.1, 14), lp(EN, WN, 0.5, 18), lp(EN, WN, 0.85, 16)]], 1.6, '#5a564c');
  f.flat(ell(lerp(EN, WN, 0.97), 7, 17, Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), 10), '#3a3630', { op: 0.9 });
  f.bone('hand_n');
  const ih = tableHand(f, [388, 440], -0.045, 56, skin, { light: true, tips: cold, fw: 0.92, shadow: skinS, tex: T(f, 'mottle'), texOp: 0.35 }); // fingertips on the top glass
  for (const [u, d, r] of [[1.0, 1, 3.6], [0.95, 0, 3], [0.94, 2, 3], [0.82, 3, 2.4]]) f.flat(ell(ih.at([[u + 0.04, 0.0]], d)[0], r * 1.6, r * 0.55, -0.045, 8), '#eef4f8', { op: 0.5 }); // frost bloom on the glass at the fingertips
  // ---- head: a linen band over the eyes, a fine white veil, milky eyes at the band's edge, frost on the breath
  f.bone('veil');
  // the veil falls plumb down her back to the waist, a long pale tapering fall that no other keeper has
  f.part([[318, 216], [300, 214], [282, 232], [270, 280], [260, 340], [252, 400], [248, 452], [252, 476], [264, 470], [276, 430], [290, 376], [304, 330], [318, 300]], { fill: veil, shadow: veilS, tex: T(f, 'weave'), texOp: 0.15, shade: 0.3, hatch: false });
  folds(f, [[[284, 250], [274, 320], [262, 420], [256, 468]], [[298, 262], [288, 340], [276, 420]]], 1.3, veilD);
  f.line([[250, 470], [256, 474], [264, 468]], 1, '#cfc7b6', { op: 0.6, dash: '2 2' }); // a rolled hem
  f.bone('head');
  f.part(limb(N, add(HC, [-6, 30]), 34, 32), SKN(f, skin, { shadow: skinS }));
  f.bone('torso');
  f.part([[288, 302], [306, 290], [330, 290], [346, 300], [336, 312], [304, 314]], HB(f, { fill: habitD, k: 0.85 }));
  f.bone('head');
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 0.88, chin: 0.02, nose: 0.98, hook: 0.0, mouth: 'set', squint: 0.0, lips: true, faceShade: 0.7, jawShade: 0.3, faceHatch: false, noEar: true, blind: true,
    browCol: '#9a948a', browW: 0.03,
  });
  // the band over the eyes, knotted behind; milky eyes glimpsed under its lower edge; frost on the lashes
  f.part(hf([[0.38, -0.2], [0.2, -0.2], [-0.05, -0.2], [-0.3, -0.16], [-0.36, 0.0], [-0.3, 0.06], [-0.05, 0.02], [0.2, 0.02], [0.37, 0.02]]), { fill: '#d8d0bc', shadow: '#9a927e', tex: T(f, 'weave'), texOp: 0.4, shade: 0.35, inkW: 1.2 });
  f.line(hf([[0.0, -0.1], [0.36, -0.1]]), 0.8, '#9a927e', { op: 0.6 });
  f.flat(hf([[0.08, 0.03], [0.14, 0.055], [0.19, 0.03]]), '#e8eef2', { op: 0.95 }); f.flat(hf(ell([0.135, 0.038], 0.02, 0.01, 0, 6)), '#c8d4dc');
  for (const q of [[0.07, 0.03], [0.12, 0.05], [0.18, 0.04], [0.28, 0.035]]) f.flat(hf(ell(q, 0.008, 0.008, 0, 5)), '#ffffff');
  const kn = hf([[-0.36, -0.06]])[0];
  f.stroke([kn, add(kn, [-6, 14]), add(kn, [-4, 28])], 4, '#c8c0ac'); f.stroke([kn, add(kn, [2, 16]), add(kn, [6, 30])], 3.4, '#b8b09c');
  // the veil over the crown, framing the face
  f.part(hf([[0.34, -0.34], [0.2, -0.5], [-0.06, -0.6], [-0.34, -0.52], [-0.5, -0.28], [-0.54, 0.1], [-0.5, 0.42], [-0.36, 0.5], [-0.26, 0.3], [-0.2, 0.06], [-0.16, -0.18], [-0.02, -0.3], [0.2, -0.3]]), { fill: veil, shadow: veilS, tex: T(f, 'weave'), texOp: 0.15, shade: 0.3, hatch: false }); // fine linen: soft shade, no coarse hatching
  f.part(hf([[0.36, -0.34], [0.2, -0.38], [-0.02, -0.36], [-0.14, -0.28], [-0.1, -0.22], [0.02, -0.28], [0.2, -0.3], [0.36, -0.28]]), { fill: mix(veil, '#fff', 0.2), shadow: veilD, inkW: 1, cast: false }); // linen edge at the brow
  folds(f, hf([[[-0.3, -0.4], [-0.4, -0.1], [-0.4, 0.3]], [[-0.18, -0.48], [-0.28, -0.2]]]), 1.3, veilD);
  // frost on her breath: a faint cloud of vapour leaving the lips and spreading as it drifts forward (soft-edged, no strokes)
  const br = hf([[0.37, 0.27]])[0];
  for (const [dx, dy, rx, ry, op] of [[6, 1, 7, 4, 0.5], [15, 0, 11, 6.5, 0.36], [27, -3, 15, 9, 0.22], [40, -6, 18, 11, 0.12]]) glow(f, add(br, [dx, dy]), rx, ry, '#e8f0f4', op);
  return f;
}

// ------------------------------------------------------------------ GODRIC, THE CELLARER (Cellarium), Human 1.0
// Heavy-set and stooped, a big belly under layer on layer of wool: a lay brother's short habit over an under-tunic, a
// knitted shawl crossed over the chest, wool leggings bound with cross-garters, a stained leather apron. He hugs a bundle
// of candles to his chest and counts on the tally board with the one good finger of his far hand: the knitted glove's two
// empty fingers are sewn shut (frostbite, Icebound Fleet). A ribbed knit cap pulled to the brows, red nose, white
// stubble, worried eyes, a tally stick behind the ear, a huge ring of store keys and candle bundles at the belt.
function godric() {
  const f = new Fig(KB(1607, { grimeY: 620 }));
  const H = 100;
  const habit = '#6e6252', habitD = '#564c40', tunic = '#5c564a', shawl = '#7a6a54', shawlD = '#5a4c3a', apron = '#4a3424', skin = '#cf9a80', skinS = '#86483e', pink = '#d89a90', knit = '#5c5448';
  const N = [298, 318], HC = [338, 270], hA = 0.5;
  const SN = [262, 346], EN = [268, 444], WN = [338, 430];
  const SF = [340, 336], EF = [392, 412], WF = [410, 352];
  const WB = [296, 526], dW = E.norm([-0.2, 1]), AF = [330, 756], AN = [244, 760];
  const bB = [330, 476], bT = [372, 346]; // the candle bundle, bottom and top
  // ---- skeleton
  f.joint('pelvis', [288, 540]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('robe_back', [262, 334], 'torso').joint('apron', [330, 520], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('candles', [352, 424], 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_f', [318, 548], 'pelvis').joint('shin_f', [326, 650], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [258, 548], 'pelvis').joint('shin_n', [248, 652], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('keys', [244, 528], 'pelvis').joint('tally_board', [470, 790], null);

  // ---- the tally board (root object): a tall plank on a splayed foot, its face turned to him; notches cut in the edge,
  // chalk tallies on the face, tally sticks hanging from pegs
  f.bone('tally_board');
  f.part([[420, 790, 1], [440, 770], [496, 768], [514, 790, 1]], { fill: P.oakD, tex: T(f, 'wood') });
  f.part([[430, 246, 1], [446, 238, 1], [450, 776, 1], [434, 778, 1]], { fill: mix(P.oakL, '#c8b090', 0.3), tex: T(f, 'wood'), texOp: 0.5, inkW: 1.2 }); // the chalked face, edge-on
  for (let i = 0; i < 9; i++) { const y = 270 + i * 22; f.line([[433, y], [446, y - 3]], 1.2, '#ece6d8', { op: 0.85 }); if (i % 3 === 1) f.line([[432, y + 6], [447, y - 12]], 1.2, '#ece6d8', { op: 0.85 }); }
  f.part([[446, 238, 1], [462, 244, 1], [466, 778, 1], [450, 776, 1]], { fill: P.oak, tex: T(f, 'wood'), texOp: 0.6 }); // the edge
  for (let i = 0; i < 22; i++) { const y = 254 + i * 13 + (i % 4 === 3 ? 4 : 0); f.flat([[446, y], [454, y + 3], [446, y + 6]], '#1a120c', { op: 0.85 }); } // notches
  for (const [y, l] of [[480, 120], [520, 96]]) { f.part([[466, y], [472, y], [474, y + 8]], { fill: P.oakD, inkW: 1, cast: false }); f.line([[470, y + 6], [474, y + 14]], 1.2, '#2a1c12'); f.part([[470, y + 14, 1], [478, y + 14, 1], [480, y + 14 + l, 1], [472, y + 14 + l, 1]], { fill: '#b8a07a', tex: T(f, 'wood'), inkW: 1, cast: false }); for (let k = 0; k < l / 9; k++) f.line([[471, y + 20 + k * 9], [476, y + 21 + k * 9]], 1, INK, { op: 0.7 }); } // tally sticks
  f.scratches([450, 600], 12, 5, '#a88a64', 0.8, 1.5);
  // ---- back panel of the scapular (short)
  f.bone('robe_back');
  f.part([[264, 332], [236, 360], [222, 460], [214, 560], [210, 640], [222, 656], [234, 646], [240, 560], [248, 460], [272, 360]], SC(f));
  // ---- far upper arm (behind the chest), wrapped in two sleeves
  f.bone('upperarm_f');
  f.part(chain([add(SF, [-4, -8]), lerp(SF, EF, 0.4), EF], [32, 56, 56]), HB(f, { fill: habitD }));
  // ---- legs: wool leggings bound with cross-garters, heavy boots
  hoseLegs(f, [['_f', [318, 548], [326, 650], AF], ['_n', [258, 548], [248, 652], AN]], { tw: 54, kw: 46, aw: 40, col: '#5a5246' });
  for (const [sfx, K0, A] of [['_n', [248, 652], AN], ['_f', [326, 650], AF]]) {
    f.bone('shin' + sfx);
    f.part(limb(K0, add(A, [0, -18]), 48, 40, { steps: 8 }), { fill: '#5a5246', tex: T(f, 'weave'), texOp: 0.6 });
    for (let i = 0; i < 5; i++) { const t = 0.15 + i * 0.16; f.line([lp(K0, A, t, -22), lp(K0, A, t + 0.12, 20)], 2.2, '#3a2a1a'); f.line([lp(K0, A, t + 0.08, 20), lp(K0, A, t + 0.2, -20)], 2, '#2e2216', { op: 0.85 }); } // cross-garters
  }
  bootRig(f, AF, '_f', 56, '#2e2218', { shaft: 0.9, strap: true });
  bootRig(f, AN, '_n', 56, '#261c14', { shaft: 0.9 });
  // ---- under-tunic hem below the short habit
  f.bone('skirt');
  f.part([[214, 630, 1], [384, 630, 1], [390, 688, 1], [362, 694], [330, 686, 1], [300, 696], [270, 686, 1], [240, 694], [212, 686, 1]], { fill: tunic, tex: T(f, 'weave'), texOp: 0.5, k: 0.6 });
  folds(f, [[[240, 660], [238, 690]], [[300, 662], [300, 694]], [[360, 660], [362, 690]]], 1.6);
  f.line([[216, 690], [260, 692], [300, 694], [350, 690], [384, 688]], 1, '#9a9a90', { op: 0.5, dash: '2 3' });
  // ---- the short habit: humped back, big belly; cut at the belt
  const hab = [[296, 316], [326, 320], [352, 334], [372, 360], [390, 410], [400, 460], [396, 510], [380, 540], [384, 590], [392, 650, 1],
    [364, 656], [336, 648, 1], [306, 658], [278, 648, 1], [250, 656], [220, 648, 1], [214, 600], [218, 550], [216, 500], [212, 440], [218, 384], [234, 346], [262, 324]];
  waistSplit(f, () => f.part(hab, HB(f, { fill: habit })), WB, 'skirt', 'torso', dW);
  f.bone('skirt');
  folds(f, [[[230, 560], [226, 640]], [[262, 566], [262, 650]], [[372, 560], [384, 640]]], 2);
  hemWear(f, 216, 392, 650, { h: 50, op: 0.3 });
  patch(f, [[226, 590], [250, 588], [252, 616], [228, 618]], mix(habit, '#4a3a2a', 0.4));
  f.bone('torso');
  folds(f, [[[232, 380], [224, 440], [226, 500]], [[386, 420], [394, 470]]], 2);
  // ---- the stained leather apron over the belly
  f.bone('apron');
  f.part([[338, 380], [374, 370], [392, 420], [400, 470], [398, 520], [394, 580], [396, 636, 1], [364, 642], [332, 636, 1], [312, 640], [300, 590], [304, 520], [316, 460], [324, 420]], { fill: apron, shadow: '#20140c', tex: T(f, 'mottle'), texOp: 0.6, k: 0.8 });
  for (const [x, y, r] of [[360, 560, 14], [330, 600, 10], [376, 480, 8], [340, 510, 6]]) f.flat(ell([x, y], r, r * 0.6, 0.4, 10), '#1e140c', { op: 0.55 });
  f.flat(ell([352, 450], 10, 5, 0.2, 10), '#d8cca8', { op: 0.5 }); f.flat(ell([370, 600], 6, 3, 0, 8), '#d8cca8', { op: 0.5 }); // wax drips on the leather
  f.stroke([[330, 480], [326, 560], [330, 630]], 1.8, '#1e140c');
  // ---- rope belt under the belly; huge ring of store keys; candle bundles; badge
  f.bone('torso');
  ropeBelt(f, [214, 512], [398, 540], 12, { sag: 3, knot: 0.25, ends: [[-2, 44, -2], [4, 58, 2]] });
  f.bone('pelvis');
  for (const [x, n] of [[292, 5], [312, 4]]) { f.line([[x, 530], [x + 2, 546]], 1.4, '#6a5a3a'); for (let i = 0; i < n; i++) { const c = [x - n * 2.5 + i * 5 + 2, 548]; f.part([add(c, [-2.6, 0]), add(c, [2.6, 0]), add(c, [2.4, 50 - i * 3]), add(c, [-2.4, 50 - i * 3])], { fill: P.wax, shadow: P.waxD, shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false }); } f.line([[x - n * 2.5 - 1, 556], [x + n * 2.5 + 3, 556]], 1.8, '#8a7448'); } // candles tied in bundles
  badgeOn(f, [278, 532], [280, 556], 9);
  f.bone('keys');
  keyRing(f, [244, 530], 24, [[-0.55, 56, 6], [-0.35, 64, 6.5], [-0.15, 52, 5.5], [0.0, 70, 7], [0.15, 58, 6], [0.32, 50, 5.5], [0.48, 62, 6.5], [0.62, 48, 5.5], [0.75, 54, 6]], { drop: 34 });
  // ---- the knitted shawl crossed over the chest and knotted behind (another layer against the cold)
  f.bone('torso');
  f.part([[234, 352], [262, 330], [300, 320], [336, 324], [362, 342], [376, 372], [352, 392], [322, 404], [300, 418], [280, 404], [252, 392], [236, 376]], { fill: shawl, shadow: shawlD, tex: T(f, 'quilt'), texOp: 0.5, shade: 0.4 });
  for (let i = 0; i < 10; i++) f.line([[248 + i * 12, 340 - (i < 5 ? i * 2 : (10 - i) * 2)], [254 + i * 11, 388 + (i > 5 ? (i - 5) * 3 : 0)]], 1, shawlD, { op: 0.7 }); // ribbing
  f.line([[236, 376], [280, 404], [300, 418], [352, 392], [376, 372]], 1, '#c8b898', { op: 0.5, dash: '2 2' });
  f.stroke([[240, 370], [226, 400], [230, 430]], 5, shawlD); // a loose end
  // ---- the candle bundle hugged to the chest
  f.bone('candles');
  const cd = E.norm(sub(bT, bB)), cn = [-cd[1], cd[0]];
  for (let i = -4; i <= 4; i++) { const o = mul(cn, i * 4.6), a = add(bB, add(o, mul(cd, Math.abs(i) * 3))), b = add(bT, add(o, mul(cd, -Math.abs(i) * 2 + (i % 2) * 4))); f.part(limb(a, b, 7, 6.4, { steps: 6 }), { fill: i % 3 ? P.wax : mix(P.wax, '#c8b890', 0.4), shadow: P.waxD, shade: 0.35, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); f.line([b, add(b, mul(cd, 5))], 1, INK); }
  for (const t of [0.25, 0.7]) { const c = lerp(bB, bT, t); f.line([add(c, mul(cn, -24)), add(c, mul(cn, 24))], 2.2, '#8a7448'); }
  // ---- far arm: forearm up to the board, the knitted glove's index finger on a notch, two empty fingers sewn shut
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.65), EF, WF], [52, 50, 40]), HB(f, { fill: habitD }));
  f.part(ell(lerp(EF, WF, 0.85), 22, 9, Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) + Math.PI / 2, 12), { fill: tunic, inkW: 1.1, cast: false, tex: T(f, 'weave') }); // under-sleeve cuff
  f.bone('hand_f');
  restHand(f, add(WF, [0, 2]), -0.72, 30, knit, { sq: 0.78, fw: 1.3, curls: [0.05, 1.4, 0, 0], missing: [2, 3], tips: pink, shadow: '#2a2420', tex: T(f, 'quilt'), texOp: 0.5, thumbTip: pink, flip: true });
  // ---- near arm: two sleeves, forearm across the belly under the bundle, fist round it
  split(f, () => f.part(chain([add(SN, [6, -12]), lerp(SN, EN, 0.4), EN, WN], [32, 60, 58, 46]), HB(f, { fill: habit })), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 26)], ['forearm_n', side(EN, elb(SN, EN, WN), 26)]]);
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.2, 14), lp(SN, EN, 0.55, 6), lp(SN, EN, 0.85, 16)]], 1.8);
  f.bone('forearm_n');
  f.part(ell(lerp(EN, WN, 0.88), 24, 9, Math.atan2(WN[1] - EN[1], WN[0] - EN[0]) + Math.PI / 2, 12), { fill: tunic, inkW: 1.1, cast: false, tex: T(f, 'weave') });
  f.bone('hand_n');
  const gC = B.grip(f, [354, 422], EN, Math.atan2(cd[1], cd[0]), 26, knit, { shadow: '#2a2420', tex: T(f, 'quilt'), texOp: 0.5, name: 'godric candles' });
  for (const q of [[0.5, -0.5], [0.62, -0.2], [0.62, 0.1], [0.55, 0.38]]) f.flat(ell(gC.F([q])[0], 3.4, 3, 0, 6), pink, { op: 0.9 }); // pink fingertips out of the fingerless glove
  // ---- head: ribbed knit cap pulled to the brows, worried eyes, red nose, white stubble, tally stick behind the ear
  f.bone('head');
  f.part(limb(add(N, [8, 4]), add(HC, [-10, 30]), 44, 42), SKN(f, skin, { shadow: skinS }));
  f.bone('torso');
  f.part([[256, 338], [270, 312], [292, 290], [316, 288], [334, 300], [346, 326], [336, 346], [304, 352], [270, 350]], { fill: shawl, shadow: shawlD, tex: T(f, 'quilt'), texOp: 0.5 }); // shawl wound high round the neck
  for (let i = 0; i < 6; i++) f.line([[276 + i * 11, 306 - (i < 3 ? 0 : 0)], [272 + i * 12, 346]], 1, shawlD, { op: 0.7 });
  f.bone('head');
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 1.15, chin: 0.0, nose: 1.1, hook: -0.1, mouth: 'grim', squint: 0.18, browDown: -0.06, age: true, faceShade: 0.85, jawShade: 0.4, faceHatch: false, glint: true,
    beard: 'stubble', beardCol: '#9a948a', browCol: '#d8d4cc', browW: 0.05,
  });
  f.flat(hf(ell([0.36, 0.1], 0.06, 0.05, 0, 8)), '#b04a40', { op: 0.32 }); // red nose
  f.flat(hf(ell([0.12, 0.14], 0.08, 0.05, 0, 8)), '#c0504a', { op: 0.25 });
  f.line(hf([[0.06, -0.2], [0.12, -0.25], [0.18, -0.22]]), 1, INK, { op: 0.6 }); // the worried knot between the brows
  for (let i = 0; i < 30; i++) { const u = -0.02 + f.r() * 0.32, v = 0.22 + f.r() * 0.26; f.flat(hf(ell([u, v], 0.006, 0.006, 0, 4)), '#f0ece4', { op: 0.75 }); } // white stubble
  // tally stick behind the ear (drawn before the cap so the cap's edge holds it)
  const t0 = hf([[-0.08, -0.12]])[0], t1 = hf([[-0.5, 0.2]])[0];
  f.part(limb(t0, t1, 7, 6, { steps: 4 }), { fill: '#b8a07a', tex: T(f, 'wood'), inkW: 1, cast: false });
  for (let k = 1; k < 6; k++) { const q = lerp(t0, t1, k / 6); f.line([q, add(q, [2, -3])], 1, INK, { op: 0.7 }); }
  // the ribbed knit cap: crown, ribbing that follows the skull, a folded brim pulled to the brows
  f.part(hf([[0.36, -0.2], [0.34, -0.42], [0.18, -0.6], [-0.08, -0.68], [-0.34, -0.6], [-0.5, -0.38], [-0.52, -0.08], [-0.44, 0.08], [-0.26, 0.02], [-0.08, -0.1], [0.14, -0.16]]), { fill: '#6a5a48', shadow: '#2e241a', tex: T(f, 'quilt'), texOp: 0.35, shade: 0.4 });
  for (let i = 0; i < 9; i++) { const u = -0.44 + i * 0.1; f.line(hf([[u + 0.02, -0.58 + Math.abs(u) * 0.12], [u + 0.04, -0.32], [u + 0.06, -0.14 - (u < -0.2 ? (u + 0.2) * 0.4 : 0)]]), 1.1, '#2e241a', { op: 0.75 }); } // ribs
  f.part(hf([[0.37, -0.2], [0.15, -0.17], [-0.08, -0.12], [-0.28, 0.0], [-0.46, 0.1], [-0.52, -0.06], [-0.32, -0.16], [-0.1, -0.26], [0.14, -0.3], [0.36, -0.32]]), { fill: '#5a4c3c', shadow: '#2e241a', tex: T(f, 'quilt'), texOp: 0.4, shade: 0.4, inkW: 1.3 }); // the folded brim
  for (let i = 0; i < 10; i++) { const u = -0.44 + i * 0.085; f.line(hf([[u, -0.3 + (u + 0.44) * 0.02 + (u < -0.1 ? -(u + 0.1) * 0.45 : 0)], [u + 0.01, -0.18 + (u < -0.1 ? -(u + 0.1) * 0.5 : 0)]]), 1, '#20180e', { op: 0.7 }); }
  f.part(hf([[-0.2, -0.7], [-0.08, -0.74], [0.0, -0.7], [-0.08, -0.64]]), { fill: '#6a5a48', inkW: 1, cast: false }); // the gathered top
  return f;
}

// ------------------------------------------------------------------ THE HOSTELLER (Guesthouse), Human 1.0
// Medium in every way and not a monk: a servant's plain grey tunic, a clean apron, the order's key ring and lead badge.
// The guest book clamped under the near arm, a lit lantern held out on its ring in the far hand: its warm light is the
// only accent. The face is the plainest in the game on purpose: small eyes, a small smile, neatly combed hair.
// Lore change 2026-11-23 (hints only, never stated: he is the First Porter, the hermit who built the first chapel): a
// mason's hands, broad, callused, knotted at the knuckles, one finger healed stiff and straight after a break; the guest
// book far older than anything in the abbey (bare oak boards cracked through, worn clasps, one torn off, uneven ancient
// leaves); and a heavy old iron key on a thong at his belt, apart from the order's ring.
function hosteller() {
  const f = new Fig(KB(1608, { grimeY: 720 }));
  const H = 98;
  const tunic = '#7a7872', tunicD = '#5e5c58', apron = '#d2cab6', apronD = '#9a927e', skin = '#cfa488', skinS = '#86584a', hair = '#5e4a38';
  const N = [312, 262], HC = [334, 202], hA = 0.02;
  const SN = [282, 290], EN = [270, 386], WN = [340, 402];
  const SF = [350, 284], EF = [398, 356], WF = [446, 352];
  const WB = [302, 432], AF = [330, 756], AN = [262, 760];
  const LH = [452, 352]; // the lantern's ring in the fist
  // ---- skeleton
  f.joint('pelvis', [300, 452]).joint('torso', WB, 'pelvis').joint('head', N, 'torso').joint('skirt', WB, 'pelvis').joint('apron', [304, 440], 'pelvis');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('book', [300, 372], 'upperarm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('lantern', LH, 'hand_f');
  f.joint('thigh_f', [322, 462], 'pelvis').joint('shin_f', [330, 606], 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', [276, 462], 'pelvis').joint('shin_n', [266, 608], 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('keys', [270, 440], 'pelvis').joint('old_key', [352, 444], 'pelvis');

  // ---- far upper arm (behind the chest)
  f.bone('upperarm_f');
  f.part(chain([add(SF, [-4, -8]), lerp(SF, EF, 0.4), EF], [26, 42, 40]), { fill: tunicD, tex: T(f, 'weave'), texOp: 0.5 });
  // ---- legs: grey hose to the shoe, neat and clean
  for (const [sfx, Hp, K0, A] of [['_f', [322, 462], [330, 606], AF], ['_n', [276, 462], [266, 608], AN]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, K0, 46, 38, { steps: 8 }), { fill: '#4e4c48', tex: T(f, 'weave') });
    f.bone('shin' + sfx); f.part(chain([K0, lerp(K0, A, 0.4), add(A, [0, 6])], [38, 40, 28], { bq: [[0, 0.5, 0.12]] }), { fill: '#4e4c48', tex: T(f, 'weave') });
    f.line([lp(K0, A, 0.2, 8), lp(K0, A, 0.85, 6)], 1, '#7a7872', { op: 0.5 });
  }
  bootRig(f, AF, '_f', 46, '#2e2620', { style: 'shoe', shaft: 0.3, strap: true });
  bootRig(f, AN, '_n', 46, '#28201a', { style: 'shoe', shaft: 0.3, strap: true });
  // ---- the plain tunic to just below the knee; cut at the belt
  const tun = [[310, 260], [334, 266], [354, 280], [364, 310], [362, 360], [354, 410], [352, 440], [360, 520], [368, 590], [372, 630, 1],
    [346, 636], [320, 628, 1], [294, 636], [268, 628, 1], [244, 634], [232, 628, 1], [236, 570], [244, 500], [250, 446], [248, 410], [242, 360], [244, 306], [260, 278], [286, 264]];
  waistSplit(f, () => f.part(tun, { fill: tunic, tex: T(f, 'weave'), texOp: 0.5 }), WB);
  f.bone('skirt');
  folds(f, [[[252, 480], [246, 560], [244, 628]], [[356, 500], [364, 570], [368, 626]]], 1.8);
  f.line([[236, 622], [268, 624], [300, 626], [340, 624], [370, 622]], 1, '#b8b6ae', { op: 0.5, dash: '3 2' }); // a neat hem
  f.bone('torso');
  folds(f, [[[256, 320], [252, 370], [254, 420]]], 1.6);
  f.line([[312, 264], [316, 300]], 1, tunicD); f.part(ell([317, 296], 2.6, 2.6, 0, 6), { fill: '#3a3632', inkW: 0.8, cast: false }); f.part(ell([318, 312], 2.6, 2.6, 0, 6), { fill: '#3a3632', inkW: 0.8, cast: false }); // neck slit and two bone buttons
  f.part([[290, 266], [310, 256], [334, 258], [348, 270], [330, 276], [302, 278]], { fill: tunicD, tex: T(f, 'weave'), texOp: 0.4, inkW: 1.2 }); // plain collar
  // ---- clean waist apron, ties, a polishing rag tucked in; belt with the order's key ring and badge, a small pouch
  f.bone('apron');
  f.part([[262, 440], [350, 444], [356, 520], [362, 586], [366, 612, 1], [338, 616], [306, 610, 1], [276, 616], [258, 610, 1], [256, 540]], { fill: apron, shadow: apronD, tex: T(f, 'weave'), texOp: 0.4, k: 0.8 });
  folds(f, [[[290, 470], [288, 540], [292, 608]], [[330, 470], [336, 560], [340, 610]]], 1.4, apronD);
  f.line([[262, 604], [300, 606], [338, 608], [364, 606]], 1, apronD, { op: 0.6, dash: '3 2' });
  f.bone('torso');
  f.part([[246, 426, 1], [356, 432, 1], [356, 446, 1], [246, 440, 1]], { fill: '#3a2e24', tex: T(f, 'mottle'), inkW: 1.2 }); // belt
  f.part([[336, 428, 1], [348, 428, 1], [348, 448, 1], [336, 448, 1]], { fill: '#6a6a6a', shade: 0.3, inkW: 1, cast: false }); f.line([[342, 430], [342, 446]], 1.4, '#3a3a3a'); // iron buckle
  f.bone('pelvis');
  f.stroke([[246, 440], [236, 474], [242, 506]], 3.6, apronD); f.stroke([[250, 442], [258, 470], [254, 494]], 3, apronD); // apron ties
  f.part([[318, 444], [334, 446], [338, 470], [326, 492], [316, 470]], { fill: '#b8b0a0', shadow: '#7a7262', tex: T(f, 'weave'), texOp: 0.5, inkW: 1.1 }); // the polishing rag
  f.part([[290, 444, 1], [312, 444, 1], [314, 470], [302, 476], [290, 470]], { fill: '#4a3a2a', tex: T(f, 'mottle'), inkW: 1.1 }); // pouch
  f.line([[292, 452], [312, 452]], 1, '#2a1c12');
  badgeOn(f, [276, 442], [278, 466], 9);
  f.bone('keys');
  keyRing(f, [262, 442], 12, [[-0.3, 36, 4.6], [0.0, 42, 5], [0.28, 34, 4.4]], { drop: 20 });
  // the old key, on its own greasy thong: far heavier than the order's keys, hand-forged, pitted and rusted, the bow
  // worn bright by a thumb, a heavy bit with crude wards; it hangs plumb over the apron's edge
  f.bone('old_key');
  const kI = '#3a3634', kIL = '#6e6a64', kTop = [352, 466];
  f.line([[350, 440], [353, 452], [352, kTop[1] - 6]], 2.2, '#2a1e14'); f.line([[351, 441], [354, 452]], 0.8, '#6a5440', { op: 0.6 });
  ring(f, add(kTop, [0, 4]), 9, 10, 4.6, INK); ring(f, add(kTop, [0, 4]), 9, 10, 3.4, kI); // the bow
  f.line(ell(add(kTop, [0, 4]), 9, 10, 0, 14).slice(9, 13), 1.6, kIL, { op: 0.8 }); // worn bright
  f.part([[349, 478, 1], [355, 478, 1], [356, 484, 1], [348, 484, 1]], { fill: kI, inkW: 1, cast: false }); // collar
  f.part([[349.5, 484, 1], [354.5, 484, 1], [354, 538, 1], [350, 538, 1]], { fill: kI, shadow: '#1a1816', shade: 0.4, inkW: 1.1, inkHeavy: 1.4, cast: false }); // shank
  f.part([[348, 500, 1], [356, 500, 1], [356, 504, 1], [348, 504, 1]], { fill: kI, inkW: 0.9, cast: false }); // a second collar
  f.part([[354, 520, 1], [366, 520, 1], [366, 524, 1], [362, 524, 1], [362, 528, 1], [366, 528, 1], [366, 536, 1], [354, 536, 1]], { fill: kI, shade: 0.4, inkW: 1.1, cast: false }); // the bit, its wards
  f.line([[351, 488], [351, 534]], 0.8, kIL, { op: 0.6 });
  for (const [x, y] of [[352, 494], [352, 512], [360, 532], [345, 470]]) f.flat(ell([x, y], 2, 2.6, 0.3, 6), '#6a3a22', { op: 0.75 }); // rust
  f.scratches([352, 510], 6, 3, '#8a8680', 0.6, 1.5);
  // ---- the lantern, held out by its ring: iron frame, horn panes glowing, a conical vented top, soot
  f.bone('lantern');
  const lx = LH[0], ly = LH[1];
  glow(f, [lx, ly + 70], 96, 88, '#ffb060', 0.4);
  f.line([[lx, ly - 2], [lx, ly + 22]], 3, INK); ring(f, [lx, ly + 2], 7, 9, 2.6, '#3a3a3c');
  f.part([[lx - 16, ly + 38, 1], [lx - 6, ly + 22], [lx + 6, ly + 22], [lx + 16, ly + 38, 1]], { fill: '#3a3a3c', shade: 0.4, inkW: 1.2 }); // vented cone
  for (const dx of [-6, 0, 6]) f.flat(ell([lx + dx, ly + 32], 1.4, 2.4, 0, 6), '#ffcf7a');
  f.part([[lx - 20, ly + 38, 1], [lx + 20, ly + 38, 1], [lx + 20, ly + 44, 1], [lx - 20, ly + 44, 1]], { fill: '#2e2e30', inkW: 1.1, cast: false });
  f.flat([[lx - 17, ly + 44], [lx + 17, ly + 44], [lx + 17, ly + 98], [lx - 17, ly + 98]], '#f0b860'); // horn panes, lit from within
  f.flat([[lx - 8, ly + 50], [lx + 8, ly + 50], [lx + 8, ly + 92], [lx - 8, ly + 92]], '#ffe0a0', { op: 0.8 });
  flame(f, [lx, ly + 84], 8, { glow: false });
  for (const dx of [-18, 0, 18]) f.part([[lx + dx - 3, ly + 42, 1], [lx + dx + 3, ly + 42, 1], [lx + dx + 3, ly + 100, 1], [lx + dx - 3, ly + 100, 1]], { fill: '#2e2e30', shade: 0.3, inkW: 1, cast: false, hatch: false }); // frame bars
  f.line([[lx - 17, ly + 70], [lx + 17, ly + 70]], 2.4, '#2e2e30');
  f.part([[lx - 22, ly + 98, 1], [lx + 22, ly + 98, 1], [lx + 20, ly + 108, 1], [lx - 20, ly + 108, 1]], { fill: '#3a3a3c', inkW: 1.2 }); // base
  for (const dx of [-14, 14]) f.rivet([lx + dx, ly + 103], 1.8, '#6a6a6a');
  f.flat([[lx - 16, ly + 44], [lx + 16, ly + 44], [lx + 14, ly + 52], [lx - 14, ly + 52]], '#2a1a10', { op: 0.5 }); // soot under the cone
  // ---- far forearm out level, the fist round the lantern's ring
  f.bone('forearm_f');
  f.part(chain([lerp(SF, EF, 0.6), EF, WF], [40, 38, 30]), { fill: tunicD, tex: T(f, 'weave'), texOp: 0.5 });
  f.line([lp(EF, WF, 0.8, -15), lp(EF, WF, 0.8, 15)], 1.2, '#3a3834', { op: 0.6 });
  f.bone('hand_f');
  const gL = B.grip(f, LH, EF, -Math.PI / 2, 24, skin, { shadow: skinS, tex: T(f, 'mottle'), texOp: 0.5, name: 'hosteller lantern' });
  // a mason's fist: knuckles knotted and worn shiny, an old split healed white, a yellow callus along the side
  const callus = mix(skin, '#e8d29a', 0.5), scarL = mix(skin, '#f2e2d0', 0.55);
  for (const [x, y] of [[0.3, -0.45], [0.32, -0.15], [0.3, 0.15], [0.28, 0.42]]) { const q = gL.F([[x, y]])[0]; f.flat(ell(q, 3.4, 2.6, 0, 8), mix(skin, '#fff', 0.35), { op: 0.6 }); f.line(ell(q, 3.6, 2.8, 0, 8).slice(4, 8), 0.8, skinS, { op: 0.6 }); }
  { const q = gL.F([[0.32, 0.0]])[0]; f.line([q, add(q, [4, 5])], 1.8, scarL, { op: 0.8 }); f.line([q, add(q, [4, 5])], 0.6, skinS, { op: 0.7 }); }
  f.flat(gL.F([[-0.2, 0.5], [0.3, 0.55], [0.32, 0.7], [-0.2, 0.66]]), callus, { op: 0.6 });
  // ---- the guest book clamped under the near arm, resting on the forearm; brass clasp, a ribbon of cord
  f.bone('book');
  // older than anything in the abbey: bare oak boards (the leather long gone but for a rag of it at the spine), a crack
  // through the board, raised bands on the spine, uneven leaves of every age and colour, two worn clasps, one torn off
  const bA = [236, 348], bB = [362, 354], bC = [360, 394], bD = [234, 388], bdv = [-8, -12];
  closedBook(f, [bA, bB, bC, bD], bdv, '#5a4630', { pages: '#c8b890' });
  for (let i = 0; i < 16; i++) { const t = (i + 0.5) / 16, q = add(lerp(bA, bB, t), bdv), h = 1 + f.r() * 3.2; f.flat([add(q, [-3.5, 0.5]), add(q, [-2.6, -h]), add(q, [2.4, -h + 0.8]), add(q, [3.6, 0.6])], f.r() > 0.6 ? '#a8946a' : '#d8cca8', { op: 0.95 }); f.line([add(q, [-2.6, -h]), add(q, [2.4, -h + 0.8])], 0.7, '#5a4a30', { op: 0.8 }); } // leaves of uneven size standing proud
  for (let i = 0; i < 7; i++) { const t = 0.1 + f.r() * 0.8, w = f.r() > 0.5 ? 1.2 : 0.7; f.line([lerp(bA, bB, t), add(lerp(bA, bB, t + 0.01), bdv)], w, '#6a5636', { op: 0.6 }); } // cockled, unevenly cut gatherings
  for (let i = 0; i < 5; i++) { const t = (i + 0.5) / 5; f.line([lerp(bB, bC, t), add(lerp(bB, bC, t), bdv)], 0.7, '#6a5636', { op: 0.6 }); f.flat([add(lerp(bB, bC, t), [1, 0]), add(lerp(bB, bC, t + 0.04), [3, 0]), add(lerp(bB, bC, t + 0.08), [1, 0])], '#d8cca8', { op: 0.9 }); } // leaves proud of the fore-edge
  // the oak board: grain, a crack running in from the top edge with a lit lip, a chipped corner, a rag of old leather
  for (let i = 0; i < 4; i++) f.line([lerp(bA, bD, 0.2 + i * 0.2), lerp(bB, bC, 0.18 + i * 0.21)], 0.7, '#3a2a1a', { op: 0.45 });
  const cr = [lerp(bA, bB, 0.56), add(lerp(bA, bB, 0.58), [1, 10]), add(lerp(bA, bB, 0.55), [-2, 20]), add(lerp(bA, bB, 0.6), [0, 30])];
  f.line(cr, 2.2, '#140e08'); f.line(cr.map(q => add(q, [1.4, -0.6])), 0.8, '#a88a64', { op: 0.7 });
  f.flat([add(bB, [-10, 0]), bB, add(bB, [-1, 8])], '#2a1c10', { op: 0.9 }); // the chipped corner
  f.part([bA, add(bA, [16, 1]), add(bD, [14, -2]), add(bD, [2, 0])].map(q => [q[0], q[1], 1]), { fill: '#3a2a1c', tex: T(f, 'mottle'), texOp: 0.6, inkW: 0.9, cast: false }); // the last of the leather over the spine
  for (const t of [0.25, 0.5, 0.75]) { const q = lerp(bA, bD, t); f.line([add(q, [-1, -1.4]), add(q, [12, -1])], 1.2, '#8a6e4e', { op: 0.7 }); f.line([add(q, [-1, 1.2]), add(q, [12, 1.4])], 1.4, '#140e08', { op: 0.7 }); } // raised bands across the spine
  // clasps: worn leather straps with iron catches over the fore-edge; the lower one torn off at the board, frayed
  const cl = t => lerp(bB, bC, t);
  f.part([add(cl(0.3), [-16, -3]), add(cl(0.3), [3, -3]), add(cl(0.3), [3, 3]), add(cl(0.3), [-16, 3])].map(q => [q[0], q[1], 1]), { fill: '#2e2014', inkW: 0.9, cast: false });
  f.part([add(cl(0.3), [-2, -4]), add(cl(0.3), [5, -4]), add(cl(0.3), [5, 4]), add(cl(0.3), [-2, 4])].map(q => [q[0], q[1], 1]), { fill: '#4a4644', light: '#8a8680', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); // iron catch
  f.rivet(add(cl(0.3), [-12, 0]), 1.3, '#7a7672');
  f.part([add(cl(0.72), [-14, -3]), add(cl(0.72), [-6, -3]), add(cl(0.72), [-4, 0]), add(cl(0.72), [-6, 3]), add(cl(0.72), [-14, 3])], { fill: '#2e2014', inkW: 0.9, cast: false }); // the torn stub
  for (let i = -1; i <= 1; i++) f.line([add(cl(0.72), [-5, i * 1.6]), add(cl(0.72), [-2, i * 2.2])], 0.6, '#5a4430'); // frayed
  f.rivet(add(cl(0.72), [-11, 0]), 1.3, '#7a7672'); f.part(ell(add(cl(0.72), [2, 0]), 1.6, 1.6, 0, 6), { fill: '#4a4644', inkW: 0.7, cast: false }); // the empty catch pin
  f.line([[300, 392], [302, 414], [298, 432]], 1.6, '#8a7a5a'); // the bookmark cord
  f.line([[250, 362], [340, 366]], 1, '#9a8a6a', { op: 0.5 }); f.line([[250, 378], [340, 382]], 1, '#9a8a6a', { op: 0.5 }); // tooled lines
  // ---- near arm: upper arm over the book, forearm under it, hand cupping its corner
  split(f, () => f.part(chain([add(SN, [6, -10]), lerp(SN, EN, 0.4), EN, WN], [26, 44, 42, 32]), { fill: tunic, tex: T(f, 'weave'), texOp: 0.5 }), [['upperarm_n', side(EN, mul(elb(SN, EN, WN), -1), 22)], ['forearm_n', side(EN, elb(SN, EN, WN), 22)]]);
  f.bone('upperarm_n');
  folds(f, [[lp(SN, EN, 0.2, 10), lp(SN, EN, 0.55, 4), lp(SN, EN, 0.85, 12)]], 1.6);
  f.bone('forearm_n');
  f.line([lp(EN, WN, 0.9, -15), lp(EN, WN, 0.9, 15)], 1.2, '#3a3834', { op: 0.6 });
  f.bone('hand_n');
  const hN = restHand(f, add(WN, [-2, 0]), -0.5, 30, skin, { sq: 0.72, fw: 1.32, spread: 0.05, curls: [0.14, 0.55, 0.6, 0.66], shadow: skinS, tex: T(f, 'mottle'), texOp: 0.5, flip: true }); // cupping the book's front end; the first finger, broken long ago, healed stiff and straight
  // a mason's hand: knuckles knotted, the joints of the stiff finger thickened, yellow calluses at the finger roots and
  // the heel, an old white scar across the back, a split thumbnail
  { const F = hN.F, callus = mix(skin, '#e8d29a', 0.5);
    for (const y of [-0.34, -0.12, 0.1, 0.3]) { f.flat(F(ell([0.86, y], 0.09, 0.07, 0, 8)), mix(skin, '#fff', 0.3), { op: 0.55 }); f.line(F(ell([0.86, y], 0.1, 0.08, 0, 8)).slice(4, 8), 0.8, skinS, { op: 0.55 }); }
    f.flat(F(ell([1.26, -0.34], 0.07, 0.11, 0, 8)), mix(skin, '#fff', 0.2), { op: 0.5 }); f.line(F([[1.24, -0.44], [1.28, -0.24]]), 0.8, skinS, { op: 0.6 }); // the knot where it was broken
    f.flat(F([[0.7, -0.42], [0.86, -0.46], [0.88, 0.36], [0.72, 0.34]]), callus, { op: 0.45 });
    f.line(F([[0.2, -0.3], [0.42, -0.05], [0.56, 0.22]]), 1.6, mix(skin, '#f2e2d0', 0.55), { op: 0.8 }); f.line(F([[0.2, -0.3], [0.42, -0.05], [0.56, 0.22]]), 0.5, skinS, { op: 0.6 });
  }
  // ---- head: the plainest face in the game. Small eyes, a small smile, hair neatly combed
  f.bone('head');
  f.part(limb(N, add(HC, [-4, 30]), 38, 34), SKN(f, skin, { shadow: skinS }));
  f.bone('torso');
  f.part([[294, 268], [304, 248], [324, 244], [340, 254], [344, 270], [326, 276], [302, 276]], { fill: tunicD, tex: T(f, 'weave'), texOp: 0.4, inkW: 1.1, cast: false }); // a high plain collar
  f.line([[306, 256], [322, 252], [336, 258]], 1, '#3a3834', { op: 0.6 });
  f.bone('head');
  const hf = B.head(f, HC, H, hA, {
    skin, jaw: 1.0, chin: 0.0, nose: 0.92, hook: 0.0, mouth: 'smirk', squint: 0.6, browDown: 0.0, faceShade: 0.7, jawShade: 0.3, faceHatch: false,
    hairCol: hair, browCol: mix(hair, '#000', 0.1), browW: 0.035,
    hairBack: [[-0.3, -0.42], [-0.46, -0.2], [-0.48, 0.08], [-0.42, 0.22], [-0.3, 0.16]],
    hair: [[-0.44, 0.12], [-0.48, -0.14], [-0.42, -0.42], [-0.16, -0.58], [0.14, -0.56], [0.32, -0.42], [0.36, -0.3], [0.2, -0.36], [0.04, -0.4], [-0.1, -0.38], [-0.22, -0.26], [-0.26, -0.04], [-0.32, 0.14]],
  });
  for (let i = 0; i < 6; i++) f.line(hf([[-0.36 + i * 0.1, -0.5 + i * 0.01], [-0.4 + i * 0.12, -0.2 + i * 0.02]]), 0.9, mix(hair, '#d8c4a0', 0.3), { op: 0.55 }); // combed lines
  f.line(hf([[-0.14, -0.56], [-0.16, -0.4]]), 1.2, mix(hair, '#000', 0.4), { op: 0.8 }); // a neat parting
  return f;
}

module.exports = {
  heroes: [
    { key: 'aldric', name: 'Prior Aldric', tier: 'human', w: W, h: H_, build: aldric },
    { key: 'abbot', name: 'The Abbot', tier: 'human', w: W, h: H_, build: abbot },
    { key: 'wenna', name: 'Sister Wenna, the Infirmarer', tier: 'human', w: W, h: H_, build: wenna },
    { key: 'fenn', name: 'Brother Fenn, the Almoner', tier: 'human', w: W, h: H_, build: fenn },
    { key: 'ide', name: 'Sister Ide, the Sacristan', tier: 'human', w: W, h: H_, build: ide },
    { key: 'godric', name: 'Godric, the Cellarer', tier: 'human', w: W, h: H_, build: godric },
    { key: 'hosteller', name: 'The Hosteller', tier: 'human', w: W, h: H_, build: hosteller },
    { key: 'lucan', name: 'Brother Lucan, the Armarius', tier: 'human', w: W, h: H_, build: lucan },
  ],
};
