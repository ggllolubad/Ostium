// World III, The Boiling Baths (Fire + Water, Scald). A temple of healing waters where the nobility came to be
// cleansed; the water never stopped heating, and cleansing turned into cooking. Fire (dominant) cooks from the outside
// in: skin boiled pink and white, peeling in sheets, blistered, split seams glowing raw. Water keeps everything wet,
// swollen, pruned and steaming. Palette: pink-white marble, steam white, boiled red, plus ink black, bone and grey.
// Foes face left: every figure is drawn facing right with kit.foeBase (light from the upper right) and flipped.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
'use strict';
const K = require('../kit');
const T = require('./kit_III');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, ang, elb } = T;

// ------------------------------------------------------------------ SCALDED ATTENDANT (cast, human 0.95)
// A bath attendant still at its post: a polite bow from the hips, the head inclined, a folded towel offered out on both
// palms with one end hanging. Skin boiled white and coming away in long strips; the towel is stained with it. Half the
// skin is gone from the near cheek. Thin wet linen tunic clinging, a cord belt with a bronze strigil and an oil flask.
// Rig: standard humanoid + towel (parent hand_n) + towel_end (the hanging end, parent towel) + skirt (tunic below the belt).
// Motion: idle a polite bow (torso and head); attack the towel snapped like a whip (near arm whips forward, towel_end trails).
function scaldedAttendant() {
  const seed = 303, h = TIERS.human[1];
  const f = new Fig(T.base(seed, h, { grimeY: 600 }));
  T.textures(f);
  const H = 95, gy = f.o.groundY;
  const SK = (o = {}) => T.SKW(f, o);
  const N = [326, 340], C = [276, 410], Pv = [266, 500];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.32, 0.16), SF = S.at(0.36, 0.12);
  const EN = [312, 466], WN = [424, 452];
  const EF = [380, 448], WF = [470, 436];
  const HN = [246, 508], KN = [262, 642], AN = [234, 752];
  const HF = [286, 512], KF = [306, 642], AF = [286, 754];
  const neck0 = S.at(0.12, -0.02), HC = [372, 282], hA = 0.32;
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('towel', lerp(WN, WF, 0.5), 'hand_n').joint('towel_end', [416, 462], 'towel').joint('skirt', S.at(0, 0.9), 'pelvis');

  // ---- far arm, behind the body: forearm forward under the far end of the towel
  T.armRig(f, SF, EF, WF, [34, 28, 24], SK({ fill: mix(P.dead, P.deadD, 0.25) }), '_f');
  f.bone('forearm_f');
  T.wrinkles(f, EF, WF, 24, 5); T.scald(f, lp(EF, WF, 0.5), 26, 8, 4);
  f.bone('hand_f');
  B.hand(f, add(WF, [-4, 0]), -0.05, 20, mix(P.dead, P.deadD, 0.25), { spread: 0.15, curl: 0.12, shadow: '#6a5a60' });

  // ---- legs: bare, boiled white, strips of skin hanging from the shins; mud of the wet floor to the knee
  T.legRig(f, HF, KF, AF, 54, 54, 40, SK({ fill: mix(P.dead, P.deadD, 0.3) }), '_f');
  f.bone('shin_f');
  T.scald(f, lp(KF, AF, 0.45), 14, 40, 6); T.scald(f, lp(HF, KF, 0.8), 14, 16, 3);
  T.peelSheet(f, lp(KF, AF, 0.4, 4), 20, 48, { sway: 3 });
  T.legRig(f, HN, KN, AN, 54, 58, 42, SK(), '_n');
  f.bone('shin_n');
  T.scald(f, lp(KN, AN, 0.45), 16, 44, 8);
  T.peelSheet(f, lp(KN, AN, 0.36, 2), 24, 62, { sway: -3 });
  T.blisters(f, lp(KN, AN, 0.78, 8), 8, 10, 3, 2.5, 4.5);
  f.bone('thigh_n');
  T.blisters(f, lp(HN, KN, 0.75, 6), 10, 10, 3, 2.5, 4);
  f.bone('foot_n');
  T.scald(f, [AN[0] + 30, AN[1] + 18], 20, 8, 4, { s: 0.7 });

  // ---- torso: a slight, narrow-chested servant bent at the hips
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.3, 0.34], [0.06, 0.48, 0.6], [0.2, 0.56, 0.74], [0.38, 0.54, 0.72], [0.56, 0.54, 0.62], [0.74, 0.58, 0.6], [0.9, 0.64, 0.64], [1.04, 0.64, 0.6]]);
  f.part(torso, SK());
  // tunic body: thin wet linen, clinging to the shoulder blade and ribs; short sleeves
  const tun = S.shape([[0.02, 0.42, 0.5], [0.08, 0.52, 0.66], [0.2, 0.6, 0.78], [0.38, 0.58, 0.76], [0.56, 0.58, 0.66], [0.74, 0.62, 0.64], [0.92, 0.68, 0.68]]);
  f.part(tun, T.LIN(f));
  // wet: the skin shows through where the linen clings (shoulder blade, ribs, belly)
  for (const [u, v, rx, ry] of [[-0.3, 0.3, 16, 22], [0.4, 0.5, 18, 14], [0.1, 0.42, 12, 10]]) f.flat(ell(S.at(u, v), rx, ry, 0.3, 12), P.poachD, { op: 0.28 });
  T.scald(f, S.at(-0.1, 0.4), 30, 40, 7, { pink: P.poachD, pale: '#f0ece4' }); // wet stains and see-through patches in the linen
  for (let i = 0; i < 4; i++) f.line([S.at(-0.5 + i * 0.05, 0.2 + i * 0.1), S.at(-0.35 + i * 0.04, 0.24 + i * 0.1)], 1, INK, { op: 0.45 }); // ribs pressing through
  // clinging folds over the ribs and the bend of the waist
  f.stroke([S.at(0.5, 0.3), S.at(0.38, 0.4), S.at(0.5, 0.52)], 2);
  f.stroke([S.at(-0.4, 0.54), S.at(-0.1, 0.62), S.at(0.3, 0.66)], 2.2);
  f.stroke([S.at(-0.2, 0.2), S.at(-0.36, 0.34)], 1.6);
  // a neckline with a frayed edge and a darn on the back
  f.line([S.at(-0.12, 0.0), S.at(0.2, 0.06), S.at(0.5, 0.02)], 1.8, P.linenD);
  f.part([S.at(-0.5, 0.36), S.at(-0.3, 0.36), S.at(-0.3, 0.48), S.at(-0.5, 0.48)], T.LIN(f, { fill: mix(P.linen, '#8a7a6a', 0.3), inkW: 1.1, sharp: true }));
  f.stitches([S.at(-0.5, 0.36), S.at(-0.3, 0.36), S.at(-0.3, 0.48), S.at(-0.5, 0.48), S.at(-0.5, 0.36)], P.linenD, 0.8);
  // ---- skirt of the tunic: to the knee, wet and clinging, hem torn
  f.bone('skirt');
  const hemY = 600;
  const skirt = [S.at(-0.66, 0.84), S.at(0.62, 0.84), [356, 560], [352, hemY - 2], [338, hemY + 8, 1], [322, hemY + 2], [306, hemY + 14, 1], [290, hemY + 4], [270, hemY + 10, 1], [252, hemY + 2], [232, hemY + 12, 1], [214, hemY], [210, 560]];
  f.part(skirt, T.LIN(f));
  f.stroke([[300, 528], [312, 562], [322, hemY]], 2); f.stroke([[244, 530], [240, 570], [246, hemY]], 2); f.stroke([[274, 540], [280, 590]], 1.4);
  f.flat([[214, 590], [352, 584], [354, 600], [214, 606]], P.mud, { op: 0.15 }); // wet grime soaked up into the hem
  for (const x of [232, 290, 338]) T.drip(f, [x, hemY + 10], 0.9);
  // ---- cord belt with a bronze strigil and a small oil flask hanging plumb
  f.bone('pelvis');
  f.part([S.at(-0.68, 0.8), S.at(0.64, 0.79), S.at(0.65, 0.87), S.at(-0.7, 0.88)], { fill: '#8a7458', tex: 'hatch' + seed, texOp: 0.5, k: 0.6, shade: 0.4 });
  const kn = S.at(0.42, 0.84);
  f.part(ell(kn, 8, 6, 0.3, 10), { fill: '#7a6448', shade: 0.4, inkW: 1.1 });
  f.stroke([kn, add(kn, [4, 22]), add(kn, [2, 40])], 3.5, '#7a6448');
  f.stroke([add(kn, [3, 2]), add(kn, [12, 18]), add(kn, [14, 30])], 3, '#6a5438');
  // strigil: a curved bronze scraper on a ring, hanging from the back of the belt
  const sg = S.at(-0.5, 0.86);
  f.line([sg, add(sg, [0, 14])], 1.2, INK);
  f.part([add(sg, [-4, 12]), add(sg, [4, 12]), add(sg, [5, 40]), add(sg, [12, 60]), add(sg, [22, 70]), add(sg, [16, 76]), add(sg, [2, 66]), add(sg, [-4, 44])], { fill: P.bronze, shadow: P.bronzeD, shade: 0.45, inkW: 1.2 });
  f.line([add(sg, [2, 44]), add(sg, [8, 62]), add(sg, [18, 71])], 1, P.bronzeL, { op: 0.7 });
  T.verdigris(f, add(sg, [4, 46]), 4, 8, 2);
  // oil flask (aryballos) on a cord
  const of = S.at(-0.2, 0.87);
  f.line([of, add(of, [-2, 22])], 1.2, INK);
  f.part(T.lumpy(f, ell(add(of, [-2, 34]), 11, 12, 0, 12), 1.5), { fill: '#8a6a52', shade: 0.45, inkW: 1.2 });
  f.part([add(of, [-6, 18]), add(of, [2, 18]), add(of, [2, 24]), add(of, [-6, 24])], { fill: '#6a4a3a', shade: 0.4, inkW: 1, sharp: true });
  f.line([add(of, [-8, 32]), add(of, [4, 30])], 1, '#c0a088', { op: 0.6 });

  // ---- head: bowed, polite; thin wet hair plastered down; the near cheek boiled raw
  f.bone('head');
  f.part(K.chain([add(neck0, [-8, 12]), add(HC, [-26, 30])], [40, 34]), SK());
  T.peelSheet(f, add(neck0, [-4, -6]), 18, 24, { sway: -2 });
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: P.dead, jaw: 1.06, chin: -0.02, nose: 0.95, mouth: 'set', squint: 0.62, browDown: 0.03, faceShade: 0.7, jawShade: 0.35, lips: true,
    iris: '#3a2a28', eyeWhite: '#e8dcd4', hairCol: '#5a4038', browCol: '#6a5048', noEar: false,
  });
  // the raw cheek: skin gone from the cheekbone to the jaw, muscle grain showing, a ragged white edge
  const ck = [[-0.06, 0.04], [0.02, 0.02, 1], [0.1, 0.07], [0.17, 0.05, 1], [0.2, 0.14], [0.15, 0.2, 1], [0.19, 0.27], [0.12, 0.36, 1], [0.04, 0.38], [-0.04, 0.43, 1], [-0.1, 0.33], [-0.16, 0.26, 1], [-0.12, 0.15]];
  f.flat(hF(ck), P.raw);
  f.flat(hF(ck.map(q => [q[0] * 0.7 + 0.01, q[1] * 0.8 + 0.05])), P.rawD, { op: 0.45 });
  for (let i = 0; i < 5; i++) f.line(hF([[-0.08 + i * 0.05, 0.08], [-0.05 + i * 0.045, 0.22], [-0.09 + i * 0.045, 0.36]]), 0.8, P.redD, { op: 0.75 }); // muscle grain
  f.line(hF([[0.04, 0.1], [0.08, 0.2]]), 1.3, P.wet, { op: 0.75 });
  f.line(hF(ck.concat([ck[0]])), 1.4, P.dead); f.line(hF(ck.concat([ck[0]])), 0.7, INK, { op: 0.7 });
  T.peelSheet(f, hF([[0.02, 0.44]])[0], 16, 20, { bed: false, sway: 2 });
  // hair: thin, wet, plastered to the skull, a bald scald patch, a few strands hanging plumb
  f.part(hF([[-0.4, 0.12], [-0.46, -0.16], [-0.34, -0.42], [-0.06, -0.55], [0.2, -0.5], [0.3, -0.38], [0.16, -0.36], [0.02, -0.4], [-0.12, -0.28], [-0.24, -0.08], [-0.3, 0.12]]), { fill: '#5a4038', shadow: '#2a1a18', tex: 'hatch' + seed, texOp: 0.3, shade: 0.4 });
  f.flat(hF([[-0.14, -0.46], [-0.04, -0.5], [0.02, -0.44], [-0.06, -0.41], [-0.12, -0.42]]), P.rawD, { op: 0.6 }); // a scald patch where the hair came away
  for (const [x, y, l] of [[-0.3, -0.32, 30], [-0.42, -0.04, 40]]) { const p = hF([[x, y]])[0]; f.stroke([p, add(p, [2, l * 0.5]), add(p, [0, l])], 2.4, '#4a3430'); }
  T.beads(f, hF([[0.02, 0.08]])[0], 6, 5, 2, 0.8);
  T.blisters(f, hF([[-0.3, 0.2]])[0], 5, 6, 2, 2, 3, { burst: 0 });

  // ---- near arm: from the shoulder down to a bent elbow, the forearm forward under the towel
  T.armRig(f, SN, EN, WN, [40, 32, 26], SK(), '_n');
  f.bone('upperarm_n');
  // short tunic sleeve over the shoulder (torso owns the shoulder: drawn on the torso bone below)
  T.scald(f, lp(SN, EN, 0.7), 12, 18, 4);
  T.peelSheet(f, lp(SN, EN, 0.74, 4), 24, 54, { sway: -3 });
  f.bone('forearm_n');
  T.scald(f, lp(EN, WN, 0.5), 30, 10, 5);
  T.peelSheet(f, lp(EN, WN, 0.42, -11), 22, 36, { sway: 2 });
  T.wrinkles(f, lp(EN, WN, 0.55), WN, 26, 4);
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [-2, -10]), lp(SN, EN, 0.4), 50, 44, { depth: 7, teeth: 5 }), T.LIN(f));
  f.stroke([lp(SN, EN, 0.05, 6), lp(SN, EN, 0.3, 2)], 1.6);
  f.flat(ell(lp(SN, EN, 0.22, -6), 10, 14, 0.2, 10), P.poachD, { op: 0.25 });
  // ---- near hand: palm up under the towel
  f.bone('hand_n');
  const hn = B.hand(f, add(WN, [4, 0]), -0.1, 21, P.dead, { spread: 0.12, curl: 0.1, shadow: '#6a5a60' });
  // ---- the towel: folded in three on the palms, one end hanging, stained with skin and old blood-pink
  f.bone('towel');
  // a soft stack: the top sags a little between the palms; the folded far end bulges in three rounded layers
  const top = [[394, 427], [440, 422], [488, 410], [500, 414], [452, 428], [408, 434]];
  const front = [[408, 434], [452, 428], [500, 414], [504, 420], [505, 434], [500, 440], [452, 448], [410, 454], [398, 448]];
  f.part(front, T.LIN(f, { fill: '#d6cfc4', k: 0.8 }));
  f.part(top, T.LIN(f, { fill: '#e8e2d8', cast: false, k: 0.8, inkW: 1.2 }));
  f.line([lerp([410, 434], [410, 454], 0.5), lerp([452, 428], [452, 448], 0.5), lerp([500, 416], [504, 438], 0.5)], 1.1, INK, { op: 0.45 }); // the fold
  f.stitches([[412, 437], [452, 431], [498, 419]], P.linenD, 0.8); // hemmed edge
  f.line([[420, 430], [438, 426]], 1, INK, { op: 0.35 }); f.line([[466, 420], [482, 416]], 1, INK, { op: 0.35 }); // soft creases on top
  for (const [x, y, rx] of [[430, 426, 10], [474, 418, 7]]) f.flat(ell([x, y], rx, 3, -0.15, 10), P.raw, { op: 0.55 });
  f.flat([[452, 438], [466, 436], [470, 446], [456, 448]], P.raw, { op: 0.5 });
  f.flat([[446, 420], [462, 417], [466, 423], [452, 426]], P.dead, { op: 0.95 }); f.line([[446, 420], [462, 417]], 0.8, INK, { op: 0.6 }); // a curl of skin stuck to it
  f.bone('towel_end');
  const te = [[397, 444], [412, 450], [424, 449], [430, 500], [436, 540], [428, 560, 1], [418, 548], [410, 566, 1], [400, 552], [392, 562, 1], [390, 520], [388, 480]];
  f.part(te, T.LIN(f, { fill: '#ddd4c6' }));
  f.stroke([[410, 460], [412, 510], [410, 550]], 1.6); f.stroke([[422, 470], [428, 530]], 1.2);
  f.flat([[394, 500], [420, 496], [424, 520], [398, 528]], P.raw, { op: 0.5 }); // stained where it was used
  f.flat([[402, 520], [414, 518], [412, 534], [404, 530]], P.dead, { op: 0.9 }); f.line([[402, 520], [414, 518]], 0.8, INK, { op: 0.6 });
  T.drip(f, [428, 562], 1); T.drip(f, [400, 566], 0.8);
  // ---- near thumb over the towel's edge
  f.bone('hand_n');
  f.part(limb(add(WN, [6, -12]), add(WN, [30, -20]), 12, 9, { steps: 4 }), SK({ inkW: 1.1, inkHeavy: 1.6, cast: false }));
  // ---- vapour still rising off the shoulders and the towel
  f.bone('torso');
  T.wisp(f, S.at(-0.1, -0.05), 70, { w: 7, op: 0.3, drift: -10 });
  f.bone('towel');
  T.wisp(f, [456, 404], 50, { w: 5, op: 0.3, drift: 6 });
  // wet floor under the feet
  f.bone('root');
  f.flat(ell([268, gy + 2], 110, 9, 0, 16), '#5a4a4a', { op: 0.35 });
  f.line([[200, gy + 3], [250, gy + 4]], 1, P.wet, { op: 0.3 });
  return f;
}


// ------------------------------------------------------------------ KETTLE CRAB (cast, small 0.5 tall, wide)
// An ornamental pool crab cooked bright red and still walking. Low and wide: the broad carapace sits on eight splayed
// legs, knees high, the crusher claw held low and forward, the smaller claw raised. The shell is split across the top;
// a broken flap stands up like a kettle lid and steam vents from it and from the cracks in long plumes. Cooked white
// meat shows in the splits; the boiled eyes are opaque on their stalks. Palette: boiled red, steam white, bone.
// Rig: body (root), eyes, claw_n_1/2/3 and claw_f_1/2/3 (arm, palm, movable finger), eight two-bone legs
// (leg_n1_1, leg_n1_2 ... leg_f4_2), steam_1..3. Motion: idle steam puffing (steam bones); attack a claw pinch.
function kettleCrab() {
  const seed = 304, h = TIERS.small[1];
  const f = new Fig(T.base(seed, h, { grimeY: 660 }));
  T.textures(f);
  const gy = f.o.groundY;
  const red = '#c4442c', redL = '#e47452', redD = '#8a2a1c', under = '#ecccb8', meat = '#e8cfc4';
  const SH = (o = {}) => Object.assign({ fill: red, shadow: '#4a1414', shade: 0.38, tex: 'mottle' + seed, texOp: 0.55, maxShade: 26 }, o);
  const bumps = (c, rx, ry, n, s = 1) => { for (let i = 0; i < n; i++) { const p = T.scatter(f, c, rx, ry), r = T.R(f, 2.5, 5) * s; f.flat(ell(p, r, r * 0.75, 0, 8), redD, { op: 0.55 }); f.flat(ell(add(p, [r * 0.25, -r * 0.3]), r * 0.55, r * 0.4, 0, 6), redL, { op: 0.9 }); } };
  const setae = (a, b, n, sd = 1) => { for (let i = 0; i < n; i++) { const p = lerp(a, b, (i + 0.5) / n), d = E.norm(sub(b, a)), nn = [-d[1] * sd, d[0] * sd]; f.line([p, add(add(p, mul(nn, 6)), mul(d, 4))], 0.9, INK, { op: 0.7 }); } };
  // independent review: the first build stood on eight thin stick legs arching high above the shell and read as a spider
  // (the World I Wreck Crab fault). Rebuilt as a crab: the shell sits low (its belly about 70 px off the floor), the
  // walking legs are thick jointed segments (merus, carpus, propodus, dactyl) splayed out sideways and low, knees barely
  // above the shell's rim, and the crusher claw is big and heavy, held low in front.
  const DX = -6, DY = 34, m = p => p[2] ? [p[0] + DX, p[1] + DY, 1] : [p[0] + DX, p[1] + DY], M = pts => pts.map(m);
  // walking legs: [coxa, knee, carpus end, propodus end, tip]. Near legs (the crab's left side) splay out to the left in
  // front of the shell; far legs to the right behind the claws, their tips higher on the floor because they are further off.
  const L = {
    n4: [[172, 662], [92, 626], [60, 650], [38, 718], [20, 786]], n3: [[194, 678], [112, 666], [86, 692], [72, 750], [62, 790]],
    n2: [[222, 692], [154, 702], [134, 726], [126, 764], [118, 794]], n1: [[256, 702], [208, 728], [198, 748], [200, 774], [192, 796]],
    f1: [[392, 692], [452, 678], [474, 700], [486, 748], [494, 778]], f2: [[410, 682], [482, 656], [508, 676], [526, 730], [536, 772]],
    f3: [[426, 670], [504, 634], [532, 652], [552, 708], [564, 768]], f4: [[434, 654], [510, 608], [542, 622], [566, 678], [584, 760]],
  };
  const Bc = [292, 660];
  f.joint('body', Bc).joint('eyes', [360, 674], 'body');
  for (const [key, p] of Object.entries(L)) f.joint(`leg_${key}_1`, p[0], 'body').joint(`leg_${key}_2`, p[1], `leg_${key}_1`).joint(`leg_${key}_3`, p[2], `leg_${key}_2`).joint(`leg_${key}_4`, p[3], `leg_${key}_3`);
  // claws: the crusher low and forward in front of the face, the small claw raised beside the eyes
  const CN = { A: [330, 712], K: [384, 744], W: [428, 738], hinge: [500, 712] };
  const CF = { A: [394, 690], K: [430, 660], W: [444, 622], hinge: [462, 580] };
  f.joint('claw_n_1', CN.A, 'body').joint('claw_n_2', CN.K, 'claw_n_1').joint('claw_n_3', CN.hinge, 'claw_n_2');
  f.joint('claw_f_1', CF.A, 'body').joint('claw_f_2', CF.K, 'claw_f_1').joint('claw_f_3', CF.hinge, 'claw_f_2');
  f.joint('steam_1', m([230, 556]), 'body').joint('steam_2', m([340, 556]), 'body').joint('steam_3', m([180, 590]), 'body');

  const up = (a, b) => { const d = E.norm(sub(b, a)); return d[0] < 0 ? 1 : -1; }; // which normal side of a segment is its upper edge
  const drawLeg = (key, look, w0) => {
    const [A, Kn, J, Pp, Tp] = L[key], fwd = Tp[0] < A[0] ? -1 : 1;
    f.bone(`leg_${key}_4`); T.dactyl(f, Pp, Tp, w0 * 0.56, look, fwd * 0.3);
    f.line([lerp(Pp, Tp, 0.62), Tp], 1.3, '#f0d8c0', { op: 0.6 }); // the worn pale tip
    f.flat(ell(add(Tp, [0, 1]), w0 * 0.42, 2.6, 0, 8), '#1a0c0a', { op: 0.55 }); // where the tip bites the wet floor
    f.bone(`leg_${key}_3`); T.crabSeg(f, J, Pp, w0 * 0.74, w0 * 0.62, look, { spines: 2, spineSide: -up(J, Pp) });
    f.bone(`leg_${key}_2`); T.crabSeg(f, Kn, J, w0 * 0.86, w0 * 0.76, look, { spines: 1, spineSide: up(Kn, J), hairs: 3 });
    f.bone(`leg_${key}_1`);
    f.part(ell(A, w0 * 0.62, w0 * 0.48, 0, 12), Object.assign({}, look, { cast: false, inkW: 1.2, shade: 0.5, fill: mix(look.fill, '#1a0606', 0.3) })); // coxa socket under the rim
    T.crabSeg(f, A, Kn, w0 * 1.08, w0 * 0.92, look, { spines: 3, spineSide: up(A, Kn) });
  };

  // ---- far legs and the far (small) claw, behind the body, a little darker
  const farLook = SH({ fill: mix(red, '#3a1010', 0.22) });
  for (const key of ['f4', 'f3', 'f2', 'f1']) drawLeg(key, farLook, 34);
  f.bone('leg_f2_1'); T.blisters(f, lerp(L.f2[0], L.f2[1], 0.5), 6, 5, 2, 2.5, 3.5, { col: '#f4d0c0', shadow: '#a06050' });
  f.bone('claw_f_1');
  T.crabSeg(f, CF.A, CF.K, 40, 34, farLook, { spines: 3, spineSide: 1 });
  f.bone('claw_f_2');
  T.crabSeg(f, CF.K, CF.W, 34, 38, farLook, { spines: 2, spineSide: 1, hairs: 3 });
  // the small claw's palm and fixed finger, pointing up and out
  f.part([[434, 630], [428, 604], [440, 580], [458, 566], [470, 546], [478, 516], [484, 494, 1], [490, 520], [488, 552], [480, 584], [466, 616], [452, 634]], farLook);
  bumps([452, 600], 10, 16, 4, 0.8);
  for (let i = 0; i < 3; i++) f.part([[484 - i * 2, 528 + i * 12, 1], [478 - i * 2, 532 + i * 12, 1], [482 - i * 2, 538 + i * 12, 1]], { fill: '#f0dcc4', shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false });
  f.bone('claw_f_3');
  f.part([[458, 588], [464, 562], [462, 534], [456, 508, 1], [470, 530], [474, 560], [468, 590]], farLook);
  for (let i = 0; i < 3; i++) f.line([[464, 540 + i * 12], [470, 538 + i * 12]], 1.2, '#f0d8c0', { op: 0.8 });

  // ---- steam rising behind the shell from the rear crack
  f.bone('steam_3');
  T.steam(f, m([176, 596]), 150, 16, { drift: -60, op: 0.45, phase: 1, curls: 2, grow: 1.6, n: 7 });

  // ---- the body: domed carapace seen a little from above, sitting low; under its front edge the face band, the pale
  // underside and the folded abdomen
  f.bone('body');
  f.part(ell([300, 724], 150, 26, 0.02, 18), SH({ fill: mix(under, '#5a2420', 0.55), shadow: '#3a1414', cast: false, maxShade: 10 })); // the pale underside between the legs
  for (let i = 0; i < 6; i++) f.line([[188 + i * 42, 712], [196 + i * 42, 738]], 1.2, INK, { op: 0.5 }); // sternal plates
  const front = M([[160, 628], [232, 656], [304, 668], [378, 660], [432, 640], [452, 620], [448, 640], [420, 664], [356, 684], [290, 688], [222, 678], [172, 656]]);
  f.part(front, SH({ fill: mix(red, '#3a1010', 0.35), shadow: '#2a0a0a' }));
  f.part(M([[250, 676], [330, 680], [346, 690], [300, 696], [258, 690]]), SH({ fill: under, shadow: '#7a4a40', inkW: 1.1, cast: false })); // abdomen flap
  for (let i = 0; i < 2; i++) f.line(M([[262 + i * 10, 681 + i * 5], [336 - i * 4, 683 + i * 5]]), 0.9, INK, { op: 0.55 });
  const top = M([[146, 616], [150, 590], [172, 566], [210, 548], [258, 538], [312, 536], [362, 540], [404, 552], [438, 572], [456, 596], [454, 616], [432, 638], [380, 656], [306, 664], [232, 652], [176, 634]]);
  f.part(top, SH({ maxShade: 34 }));
  // teeth along the front margin, pointing forward and down; a notch between the eyes; lateral teeth at the rear side
  for (let i = 0; i < 9; i++) { const b0 = m(lerp([232, 652], [452, 618], i / 9)), b1 = m(lerp([232, 652], [452, 618], (i + 1) / 9)), tip = add(lerp(b0, b1, 0.65), [3, 9]); if (i === 4) continue; f.part([b0, [...tip, 1], b1], SH({ inkW: 1, inkHeavy: 1.3, cast: false, k: 0.5 })); }
  for (let i = 0; i < 3; i++) { const b0 = m(lerp([150, 590], [176, 634], i / 3)), b1 = m(lerp([150, 590], [176, 634], (i + 1) / 3)), tip = add(lerp(b0, b1, 0.5), [-9, 2]); f.part([b0, [...tip, 1], b1], SH({ inkW: 1, inkHeavy: 1.3, cast: false, k: 0.5 })); }
  // regions: the grooves of the carapace, a lit crown ridge, tubercles, cooked pale patches, a dark rim under the edge
  f.line(M([[220, 566], [262, 592], [330, 596], [392, 574]]), 1.5, INK, { op: 0.6 });
  f.line(M([[262, 592], [250, 620], [262, 646]]), 1.3, INK, { op: 0.55 });
  f.line(M([[330, 596], [350, 624], [340, 652]]), 1.3, INK, { op: 0.55 });
  f.line(M([[196, 556], [270, 542], [350, 544], [420, 566]]), 2.4, redL, { op: 0.6 });
  bumps(m([300, 600]), 130, 40, 30);
  T.scald(f, m([300, 606]), 130, 34, 12, { pink: '#f09070', pale: '#f6c0a0', ang: 0.1 });
  f.flat(M([[360, 624], [404, 618], [420, 630], [386, 640], [356, 636]]), '#e8e2d6', { op: 0.45 }); // dried white mineral scale
  f.flat(M([[200, 600], [228, 596], [232, 606], [206, 610]]), '#e8e2d6', { op: 0.4 });
  // the split across the crown: a jagged dark crack with cooked meat bulging in it, branching
  const crack = M([[160, 600], [172, 596, 1], [186, 602, 1], [200, 592, 1], [216, 590, 1], [232, 596, 1], [248, 588, 1], [266, 592, 1], [284, 584, 1], [302, 586, 1], [318, 578, 1], [334, 580, 1], [346, 572]]);
  f.flat(crack.map((p, i) => add(p, [0, -3 - (i % 3)])).concat(crack.slice().reverse().map((p, i) => add(p, [0, 3 + (i % 2) * 2]))), '#1a0c0a', { k: 0.3 });
  f.flat(crack.slice(4, 9).map(p => add(p, [0, -1])).concat(crack.slice(4, 9).reverse().map(p => add(p, [0, 1.6]))), meat, { op: 0.7, k: 0.3 });
  for (const [p0, p1, p2] of [[[248, 588], [240, 612], [250, 634]], [[302, 586], [316, 604], [310, 622]], [[186, 602], [180, 620], [190, 640]]]) f.line([m(p0), [...m(p1), 1], m(p2)], 2, '#1a0c0a', { straight: true });
  T.seam(f, M([[250, 634], [258, 648]]), 1.5);
  T.seam(f, M([[392, 610], [410, 626], [406, 642]]), 1.5);
  for (const p of crack.slice(1, -1)) f.line([add(p, [-3, -6]), add(p, [4, -9])], 0.9, INK, { op: 0.5 });
  // the lid: a thin plate of shell broken free and propped on its hinge edge, a black vent under it
  f.flat(M([[206, 568], [254, 560], [256, 574], [210, 580]]), '#120806');
  f.part(M([[206, 572, 1], [214, 552], [226, 538, 1], [248, 534], [262, 546, 1], [254, 566, 1]]), SH({ fill: mix(red, redD, 0.15), k: 0.6 }));
  f.part(M([[206, 572, 1], [254, 566, 1], [256, 571, 1], [208, 577, 1]]), SH({ fill: meat, shadow: '#8a6a60', cast: false, inkW: 1 }));
  f.line(M([[216, 556], [228, 542], [246, 538]]), 1.3, redL, { op: 0.7 });
  bumps(m([236, 554]), 12, 6, 3, 0.7);
  // a snag of bath linen caught on the rear teeth, trailing down to the floor between the legs
  f.part(M([[150, 604], [172, 596], [184, 612], [176, 636], [160, 644], [148, 628]]), T.LIN(f, { fill: '#cfc6b6', inkW: 1.1 }));
  f.line(M([[164, 640], [158, 672], [164, 700], [158, 724]]), 2.4, '#bfb4a4'); f.line(M([[164, 640], [158, 672], [164, 700], [158, 724]]), 0.8, INK, { op: 0.6 });
  // ---- face: eye stalks with boiled white eyes, antennae, mouthparts on the front band
  f.bone('eyes');
  for (const [b, t] of [[[352, 652], [350, 622]], [[384, 646], [390, 618]]].map(q => q.map(m))) {
    f.part(limb(b, t, 10, 8, { steps: 4 }), SH({ cast: false, inkW: 1.1 }));
    f.part(ell(add(t, [1, -4]), 7, 6, 0.2, 10), { fill: '#e6e0d6', shadow: '#7a6a6a', shade: 0.4, inkW: 1.1, inkHeavy: 1.5, cast: false, hatch: false });
    f.flat(ell(add(t, [2, -6]), 2, 1.6, 0, 6), '#fff', { op: 0.9 });
  }
  f.line(M([[364, 650], [372, 612], [366, 588]]), 1.2, INK); f.line(M([[372, 650], [392, 622], [404, 604]]), 1.1, INK);
  f.part(M([[350, 664], [384, 660], [388, 680], [354, 686]]), SH({ fill: mix(red, under, 0.35), inkW: 1, cast: false }));
  for (let i = 0; i < 4; i++) f.line(M([[356 + i * 8, 666], [357 + i * 8, 682]]), 0.8, INK, { op: 0.6 });
  // ---- vents: the kettle plume out of the lid, a thinner jet out of the crack, each on its own bone
  f.bone('steam_1');
  T.steam(f, m([232, 560]), 260, 22, { drift: 60, op: 0.75, curls: 4, grow: 1.6, n: 9 });
  f.bone('steam_2');
  T.steam(f, m([340, 576]), 120, 10, { drift: 50, op: 0.5, phase: 2, curls: 2, grow: 2, n: 6 });
  // ---- near legs, splaying out low to the left in front of the shell's side
  for (const key of ['n4', 'n3', 'n2', 'n1']) drawLeg(key, SH(), 40);
  f.bone('leg_n3_2');
  T.blisters(f, lerp(L.n3[1], L.n3[2], 0.5), 5, 5, 2, 2.5, 3.5, { col: '#f4d0c0', shadow: '#a06050' });
  f.bone('leg_n4_1');
  T.seam(f, [lp(L.n4[0], L.n4[1], 0.3, 2), lp(L.n4[0], L.n4[1], 0.7, -3)], 1.4);
  f.bone('leg_n2_1');
  f.flat(ell(lerp(L.n2[0], L.n2[1], 0.55), 7, 4, 0.2, 8), meat, { op: 0.85 }); f.line(ell(lerp(L.n2[0], L.n2[1], 0.55), 8, 5, 0.2, 8).slice(0, 5), 0.9, INK, { op: 0.6 }); // a cracked joint showing cooked meat
  // ---- near claw: the crusher, big and heavy, held low in front of the face, a little open
  f.bone('claw_n_1');
  T.crabSeg(f, CN.A, CN.K, 50, 44, SH(), { spines: 3, spineSide: -1 });
  bumps(lerp(CN.A, CN.K, 0.5), 10, 8, 3, 0.8);
  f.bone('claw_n_2');
  T.crabSeg(f, CN.K, CN.W, 46, 54, SH(), { spines: 2, spineSide: -1, hairs: 4 });
  // the palm: a swollen heavy block, the fixed finger running on to a blunt toothed point near the floor
  const palm = [[416, 736], [420, 712], [438, 696], [470, 688], [506, 690], [534, 702], [552, 722], [566, 746], [578, 772, 1], [556, 766], [534, 770], [500, 778], [460, 778], [430, 766]];
  f.part(palm, SH({ maxShade: 22 }));
  f.line([[434, 708], [474, 698], [520, 704], [548, 722]], 2.6, redL, { op: 0.6 });
  f.line([[436, 760], [480, 768], [526, 764]], 1.4, INK, { op: 0.45 }); // the palm's lower keel
  bumps([480, 732], 36, 18, 10);
  f.part([[548, 764], [560, 760], [570, 768], [556, 774]], SH({ fill: '#2a1210', cast: false, inkW: 0.8 }));
  T.seam(f, [[452, 704], [462, 724], [456, 746]], 1.6);
  f.flat([[506, 752], [522, 748], [518, 762]], meat, { op: 0.9 }); // a chip knocked off the claw, white meat showing
  for (let i = 0; i < 4; i++) f.part([[526 + i * 12, 760 - i * 2, 1], [530 + i * 12, 752 - i * 2, 1], [534 + i * 12, 760 - i * 2, 1]], { fill: '#f0dcc4', shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false }); // crushing teeth
  T.drip(f, [500, 778], 1); T.drip(f, [446, 772], 0.8);
  f.bone('claw_n_3');
  // the movable finger: thick, hooked, closing down onto the fixed finger
  f.part([[490, 716], [512, 698], [540, 696], [564, 706], [584, 724], [594, 744, 1], [574, 736], [548, 726], [520, 724], [500, 728]], SH());
  for (let i = 0; i < 4; i++) f.part([[530 + i * 13, 726 + i * 3, 1], [534 + i * 13, 734 + i * 3, 1], [538 + i * 13, 727 + i * 3, 1]], { fill: '#f0dcc4', shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false });
  f.line([[512, 704], [548, 702], [574, 716]], 1.6, redL, { op: 0.6 });
  f.part(ell([496, 714], 9, 8, 0, 10), SH({ cast: false, inkW: 1, fill: redD })); // the hinge knob
  // hot water pooled under it
  f.bone('root');
  f.flat(ell([300, gy + 2], 280, 10, 0, 18), '#6a5050', { op: 0.3 });
  T.wisp(f, [330, gy - 2], 40, { w: 5, op: 0.25 });
  return f;
}

// ------------------------------------------------------------------ BATH LEECH (cast, small 0.7 long, coiled)
// A pool leech the size of a dog, grown fat on the bathers. The posterior sucker is clamped to the wet floor, the tail
// end lies in a hook on the ground, and the swollen body rears up out of it in one heavy curve; the narrow neck arches
// over and the oral sucker opens down and forward at the enemy, a ring of teeth round a dark throat. Pale pink skin,
// translucent where it is stretched, the blood showing through as dark paired pouches of the crop; ringed all over with
// annuli and sensory dots. Fire scald on the upper side (blisters, a peeling sheet, a split), water in the wet sheen.
// Rig: a chain seg_1 (root, on the floor) .. seg_6, then head. Motion: idle a pulse along the body; attack a lunge and latch.
function bathLeech() {
  const seed = 307, h = TIERS.small[1];
  const f = new Fig(T.base(seed, h, { grimeY: 640 }));
  T.textures(f);
  const gy = f.o.groundY;
  const pink = '#e2aaa0', pinkL = '#f2c8be', pinkD = '#b0706c', blood = '#6a1016', bloodD = '#3e080c';
  const SKN = (o = {}) => Object.assign({ fill: pink, shadow: '#5a2a34', shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  // the spine, tail tip to the mouth, and the body's width at each point
  const SP = [[96, 770], [112, 786], [160, 794], [222, 794], [284, 786], [340, 756], [374, 700], [370, 628], [358, 560], [376, 500], [418, 462], [468, 462], [500, 494]];
  const WS = [30, 40, 56, 76, 98, 120, 134, 128, 104, 80, 60, 52, 50];
  // smooth the spine into samples so the body is one even curve
  const samp = []; for (let i = 0; i < SP.length - 1; i++) for (let k = 0; k < 6; k++) { const t = k / 6, p0 = SP[Math.max(0, i - 1)], p1 = SP[i], p2 = SP[i + 1], p3 = SP[Math.min(SP.length - 1, i + 2)]; const c = [0, 1].map(j => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t * t * t)); samp.push({ c, w: WS[i] + (WS[i + 1] - WS[i]) * t }); }
  samp.push({ c: SP[SP.length - 1], w: WS[WS.length - 1] });
  const tan = i => E.norm(sub(samp[Math.min(samp.length - 1, i + 1)].c, samp[Math.max(0, i - 1)].c));
  const at = (i, u) => { const d = tan(i); return add(samp[i].c, mul([-d[1], d[0]], u * samp[i].w / 2)); }; // u=+1 the right-hand side of travel (lower/outer)
  const body = [...samp.map((q, i) => at(i, 1)), ...samp.map((q, i) => at(i, -1)).reverse()];
  // joints at sample indices along the chain
  const JI = { seg_1: 0, seg_2: 14, seg_3: 28, seg_4: 38, seg_5: 46, seg_6: 54, head: 62 };
  const names = Object.keys(JI);
  names.forEach((nm, k) => f.joint(nm, samp[JI[nm]].c, k ? names[k - 1] : null));
  const cutsFor = () => names.map((nm, k) => {
    const regs = [];
    if (k > 0) regs.push(side(samp[JI[nm]].c, tan(JI[nm]), samp[JI[nm]].w * 0.42));
    if (k < names.length - 1) { const j = JI[names[k + 1]]; regs.push(side(samp[j].c, mul(tan(j), -1), samp[j].w * 0.42)); }
    return [nm, regs];
  });
  // ---- posterior sucker: a broad disc clamped flat on the floor under the tail tip (behind the body)
  f.bone('seg_1');
  { const ps = [104, gy - 6]; f.part(T.lumpy(f, ell(ps, 40, 12, -0.04, 18), 2), SKN({ fill: pinkD, cast: false })); f.part(T.lumpy(f, ell(add(ps, [-2, -3]), 31, 8, -0.04, 16), 2), SKN({ fill: mix(pink, pinkD, 0.4), cast: false, inkW: 1.1 })); for (let i = 0; i < 6; i++) f.line([add(ps, [-30 + i * 12, -1]), add(ps, [-34 + i * 13, 8])], 0.9, INK, { op: 0.5 }); }
  // ---- the body: one outline, shading, annuli, crop pouches, scald, cut for the chain
  split(f, () => {
    f.part(body, SKN({ k: 0.9 }));
    // the stretched mid-body is translucent: the crop's paired pouches of blood show through
    for (let i = 20; i < 52; i += 5) {
      const t = (i - 20) / 32, k = Math.sin(t * Math.PI), aa = Math.atan2(tan(i)[1], tan(i)[0]);
      for (const u of [-0.24, 0.26]) { const c0 = at(i, u * 0.4), c1 = at(i + 2, u * (1.2 + k * 0.4)); f.flat(T.lumpy(f, [c0, add(lerp(c0, c1, 0.5), mul([-Math.sin(aa), Math.cos(aa)], 5)), c1, add(c1, [Math.cos(aa) * 9, Math.sin(aa) * 9]), add(lerp(c0, c1, 0.5), [Math.cos(aa) * 12, Math.sin(aa) * 12])], 2), u < 0 ? blood : bloodD, { op: 0.22 + 0.2 * k }); }
    }
    f.flat(samp.slice(16, 54).map((q, i) => at(i + 16, -0.05)).concat(samp.slice(16, 54).map((q, i) => at(i + 16, 0.08)).reverse()), bloodD, { op: 0.35 }); // the gut line
    // darker dorsal stripes along the upper side, broken into flecks
    for (const u of [-0.62, -0.42]) for (let i = 4; i < samp.length - 6; i += 3) f.flat(ell(at(i, u), 3.5, 2, Math.atan2(tan(i)[1], tan(i)[0]), 6), pinkD, { op: 0.6 });
    // annuli: rings across the body, every fifth heavier; sensory dots on the heavy rings
    for (let i = 2; i < samp.length - 3; i++) {
      const d = tan(i), a0 = at(i, -1), a1 = at(i, 1), mid = add(samp[i].c, mul(d, samp[i].w * 0.08));
      const heavy = i % 5 === 0;
      f.line([lerp(a0, samp[i].c, 0.06), mid, lerp(a1, samp[i].c, 0.06)], heavy ? 1.3 : 0.8, INK, { op: heavy ? 0.6 : 0.38 });
      if (heavy) for (const u of [-0.6, -0.2, 0.25]) f.flat(ell(add(at(i, u), mul(d, 3)), 1.6, 1.3, 0, 6), '#f6e0d8', { op: 0.85 });
    }
    // wet sheen along the lit (upper right) edge
    T.sheen(f, samp.slice(30, 60).map((q, i) => at(i + 30, -0.78)), 2.4, 0.6);
    T.sheen(f, samp.slice(4, 22).map((q, i) => at(i + 4, -0.7)), 2, 0.5);
    // underside: paler, a crease where the belly meets the floor
    f.stroke(samp.slice(8, 32).map((q, i) => at(i + 8, 0.86)), 2.4, '#3a1a20', { op: 0.5 });
    // scald on the upper side: blisters, a split with a raw core, flaking
    T.blisters(f, at(40, -0.5), 18, 10, 5, 3, 6.5, { col: '#fbe2da', shadow: '#c08880', burst: 0.35 });
    T.blisters(f, at(56, -0.4), 10, 8, 3, 2.5, 5, { col: '#fbe2da', shadow: '#c08880', burst: 0.3 });
    T.seam(f, [at(33, -0.62), at(36, -0.5), at(39, -0.36)], 1.8);
    T.flakes(f, at(48, -0.6), 14, 10, 4, { col: '#f8e6de' });
  }, cutsFor());
  // ---- posterior sucker: a broad disc clamped flat on the floor at the tail tip
  f.bone('seg_1');
  T.seam(f, [at(9, -0.6), at(11, -0.3), at(12, -0.55)], 1.4);
  // a strip of bather's linen stuck to the tail and trailing on the floor
  f.part([at(14, -0.9), at(17, -0.85), at(18, 0.2), [250, 790], [272, 798], [236, 798], at(14, 0.3)], T.LIN(f, { fill: '#d6cec0', inkW: 1.1, opacity: 0.95 }));
  f.line([at(16, -0.6), at(16, 0.4)], 0.9, INK, { op: 0.4 });
  // ---- a sheet of scalded skin peeling off the hump of the rear curve and hanging
  f.bone('seg_3');
  T.peelSheet(f, at(30, -0.85), 16, 40, { col: '#f6e2da', bedCol: '#c04a4a', sway: 4 });
  f.bone('seg_4');
  T.beads(f, at(40, -0.2), 20, 14, 4, 1.1);
  // ---- the head: the neck arches over; the oral sucker opens down and forward, a ring of teeth round a dark throat
  f.bone('head');
  const mc = samp[samp.length - 1].c, md = tan(samp.length - 1), ma = Math.atan2(md[1], md[0]);
  const cup = frame(add(mc, mul(md, 6)), ma, 1);
  // the lip of the sucker: a thick flared rim seen three-quarter, the lower lip larger
  // the cup: its rim is a thick ring seen at an angle, the opening facing down and forward along the neck
  f.part(T.lumpy(f, cup([[-10, -26], [4, -32], [16, -30], [24, -16], [26, 4], [22, 22], [12, 32], [-2, 30], [-12, 14], [-14, -8]]), 1.5), SKN({ fill: mix(pink, pinkD, 0.2) }));
  f.flat(cup([[4, -24], [14, -22], [20, -10], [21, 6], [17, 20], [9, 25], [2, 18], [0, 0], [0, -14]]), '#3a0c12');
  f.flat(cup([[9, -10], [14, -6], [15, 6], [11, 12], [7, 4], [7, -4]]), '#0c0204');
  // a ring of small teeth all round the inside of the rim, pointing into the throat
  for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 2, cx = 10, cy = 0, r0 = [cx + Math.cos(t) * 9, cy + Math.sin(t) * 22], r1 = [cx + Math.cos(t) * 4.5, cy + Math.sin(t) * 12]; const n2 = [-Math.sin(t) * 2.2, Math.cos(t) * 1.4]; f.part(cup([add(r0, n2), [...r1, 1], sub(r0, n2)]), { fill: '#efe2cc', shadow: '#8a7a6a', shade: 0.3, inkW: 0.6, inkHeavy: 0.8, cast: false, hatch: false }); }
  f.line(cup([[-8, -24], [4, -30], [16, -28]]), 1.6, pinkL, { op: 0.7 });
  for (let i = 0; i < 4; i++) f.line(cup([[-12 + i * 2, -18 + i * 10], [-6 + i * 2, -16 + i * 10]]), 0.9, INK, { op: 0.5 }); // the rim's puckers
  // a dribble of bathers' blood from the lower lip, hanging plumb
  const dl = cup([[6, 30]])[0];
  f.stroke([dl, add(dl, [1, 14]), add(dl, [0, 24])], 4, blood, { op: 0.9 });
  f.flat(ell(add(dl, [0, 29]), 3, 4, 0, 8), blood);
  // annular folds bunched behind the sucker
  for (let i = 0; i < 3; i++) f.line([at(samp.length - 5 + i, -1), at(samp.length - 5 + i, 1)], 1.4, INK, { op: 0.6 });
  // vapour off the hot wet skin and the floor
  f.bone('seg_4');
  T.wisp(f, at(42, -1.05), 60, { w: 6, op: 0.28, drift: -8 });
  f.bone('seg_2');
  T.wisp(f, at(20, -1.0), 40, { w: 5, op: 0.22, drift: 6 });
  f.bone('root');
  f.flat(ell([300, gy + 2], 190, 9, 0, 18), '#6a5050', { op: 0.3 });
  f.line([[160, gy + 4], [230, gy + 5]], 1, P.wet, { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ STEAM NYMPH (cast, human 1.0, floating)
// A bather, or the bathers' memory of one, drifting over the pools: a woman's shape made of steam, dense at the face and
// the hands, thinning through the body and dissolving below the hips into a vapour trail that curls back and down. Head
// tipped back, eyes closed, mouth open on a note; the near hand at her breastbone, the far arm reaching forward and down,
// palm up, toward the drowned. Her wet linen bathing veil is the only solid thing on her: plastered over the crown,
// hanging plumb down her back, dripping. A faint pink glow at the core. No outline but a broken grey ink.
// Rig: pelvis (root), torso, head, veil (parent head), breath (parent head), the two arms, trail_1/trail_2 (parent pelvis).
// Motion: idle a drift (pelvis bob, trail sway); attack a song and a scalding breath (head back, breath plume out).
function steamNymph() {
  const seed = 306, h = TIERS.human[1];
  const f = new Fig(T.base(seed, h, { grimeY: 9999 }));
  T.textures(f);
  const gy = f.o.groundY, H = 98;
  const st = P.steam, stS = '#b8aab0', glow = '#f2a2a0', greyInk = '#7a6a74';
  const ST = (o = {}) => Object.assign({ fill: st, shadow: stS, shade: 0.3, cast: false, hatch: false, gritOp: 0.12, inkW: 1.1, inkHeavy: 1.8 }, o);
  const G0 = op => f.raw(`<g opacity="${op}">`), G1 = () => f.raw('</g>');
  // the vapour body is inked in a soft grey, never black; the veil keeps the black ink
  const grey = fn => { const k = f.o.ink; f.o.ink = greyInk; fn(); f.o.ink = k; };
  const soft = (pts, op, blur = 'steamblur', col = st) => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#${blur}${seed})"/>`);
  const N = [302, 252], C = [318, 340], Pv = [300, 432];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.13), SF = S.at(0.34, 0.1);
  const EN = [252, 378], WN = [318, 322];
  const EF = [380, 344], WF = [446, 384];
  const HC = [326, 176], hA = -0.2, neck0 = S.at(0.1, -0.04);
  const hF = frame(HC, hA, H);
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF });
  f.joint('veil', add(HC, [-20, -40]), 'head').joint('breath', add(HC, [44, 22]), 'head');
  f.joint('trail_1', [292, 500], 'pelvis').joint('trail_2', [244, 640], 'trail_1');

  // ---- the back of the veil: wet linen hanging plumb behind the shoulders, behind everything else
  f.bone('veil');
  const bk = hF([[-0.46, -0.08]])[0];
  const back = [hF([[-0.2, -0.5]])[0], hF([[-0.5, -0.3]])[0], bk, [bk[0] - 26, bk[1] + 70], [bk[0] - 40, bk[1] + 140], [bk[0] - 46, bk[1] + 196, 1], [bk[0] - 28, bk[1] + 186], [bk[0] - 16, bk[1] + 204, 1], [bk[0] - 2, bk[1] + 186], [bk[0] + 12, bk[1] + 198, 1], [bk[0] + 22, bk[1] + 150], [bk[0] + 30, bk[1] + 90], hF([[-0.1, 0.4]])[0]];
  f.part(back, T.LIN(f, { fill: '#cfc8bb', shadow: '#4e4448' }));
  for (const [x0, l] of [[-30, 180], [-12, 176], [6, 180]]) f.stroke([add(bk, [x0 + 10, 40]), add(bk, [x0 - 2, 110]), add(bk, [x0 - 6, l])], 1.8);
  for (let i = 0; i < 4; i++) { const q = add(bk, [-40 + i * 16, 194 + (i % 2) * 8]); f.line([q, add(q, [-1, 12])], 1.2, '#cfc6b6'); } // fringe
  for (const x of [-44, -14, 12]) T.drip(f, add(bk, [x, 210]), 1);

  // ---- the trail: below the hips she comes apart into soft rolling vapour that sweeps back and down
  f.bone('trail_2');
  for (let i = 0; i < 7; i++) { const t = i / 6, c = [258 - 40 * t + Math.sin(t * 5) * 14, 620 + 140 * t], r = 34 - 14 * t; soft(T.lumpy(f, ell(c, r * 1.2, r * 0.8, 0.4, 10), r * 0.3), (0.5 - 0.4 * t).toFixed(2)); }
  T.steam(f, [226, 760], 90, 22, { drift: -30, op: 0.25, grow: 0.5, n: 4, curls: 1 });
  f.bone('trail_1');
  soft([[240, 470], [350, 466], [356, 520], [320, 566], [284, 600], [246, 626], [224, 604], [228, 540]], 0.55);
  soft([[256, 470], [340, 470], [336, 512], [300, 540], [262, 548], [250, 510]], 0.5);
  for (let i = 0; i < 3; i++) { const c0 = [290 - i * 20, 520 + i * 36], pts = []; for (let k = 0; k <= 8; k++) { const aa = 2.2 + k * 0.55, rk = (18 - i * 3) * (1 - k * 0.08); pts.push(add(c0, [Math.cos(aa) * rk, Math.sin(aa) * rk * 0.7])); } f.line(pts, 1, '#8a7a84', { op: 0.35 }); }

  // ---- far arm, reaching forward and down to the drowned: thin vapour, dense at the hand
  grey(() => {
    T.armRig(f, SF, EF, WF, [30, 24, 20], ST({ opacity: 0.62 }), '_f'); // opacity on the part: a <g> may not straddle two bones' layers
    f.bone('hand_f');
    G0(0.92); B.hand(f, add(WF, [10, 4]), 0.3, 20, mix(st, '#e8dcdc', 0.4), { spread: 0.45, curl: 0.3, shadow: stS }); G1();
  });
  f.bone('forearm_f'); T.wisp(f, lp(EF, WF, 0.5, 6), 34, { w: 4, op: 0.25, drift: -8 });

  // ---- hips: the body is already thinning; a soft mass with no edge, over the trail
  f.bone('pelvis');
  soft([S.at(-0.66, 0.8), S.at(0.62, 0.78), add(S.at(0.7, 1.0), [6, 22]), [334, 500], [292, 514], [250, 500], add(S.at(-0.72, 1.0), [-4, 20])], 0.72);
  f.line([S.at(0.62, 0.8), add(S.at(0.7, 1.0), [4, 14])], 1, greyInk, { op: 0.45 });
  // ---- the body: dense at the chest, thinning to the hips; the glow at the core; vapour swirling inside
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.28, 0.3], [0.06, 0.44, 0.58], [0.18, 0.54, 0.76], [0.3, 0.56, 0.84], [0.42, 0.5, 0.74], [0.56, 0.44, 0.56], [0.7, 0.5, 0.56], [0.86, 0.6, 0.64], [1.0, 0.66, 0.66]]);
  grey(() => { G0(0.84); f.part(torso, ST({ tex: 'mottle' + seed, texOp: 0.25, inkW: 0, inkHeavy: 0 })); G1(); });
  { const n = torso.length / 2; f.line(torso.slice(1, n - 2), 1.2, greyInk, { op: 0.6 }); f.line(torso.slice(n + 2, torso.length - 1), 1.2, greyInk, { op: 0.5 }); } // a contour only where the vapour is dense
  soft([S.at(-0.5, 0.86), S.at(0.6, 0.86), S.at(0.7, 1.1), S.at(-0.7, 1.1)], 0.5); // the waist dissolving into the hips
  f.raw(`<ellipse cx="${S.at(0.1, 0.5)[0]}" cy="${S.at(0.1, 0.5)[1]}" rx="42" ry="74" fill="${glow}" opacity="0.42" filter="url(#steamblur2${seed})"/>`);
  f.raw(`<ellipse cx="${S.at(0.15, 0.45)[0]}" cy="${S.at(0.15, 0.45)[1]}" rx="16" ry="26" fill="#f8c8c0" opacity="0.45" filter="url(#steamblur${seed})"/>`);
  // the shape of a woman in the vapour: collarbone, breast, the line of the ribs, swirls inside
  f.line([S.at(0.05, 0.06), S.at(0.3, 0.1), S.at(0.5, 0.08)], 1, greyInk, { op: 0.5 });
  f.line([S.at(0.52, 0.24), S.at(0.84, 0.3), S.at(0.74, 0.42), S.at(0.54, 0.42)], 1.2, greyInk, { op: 0.6 });
  f.line([S.at(-0.2, 0.5), S.at(0.1, 0.6), S.at(0.4, 0.58)], 0.9, '#9a8a94', { op: 0.4 });
  for (const [u, v, r] of [[-0.1, 0.3, 14], [0.2, 0.72, 12], [-0.32, 0.62, 10]]) { const c0 = S.at(u, v), pts = []; for (let k = 0; k <= 8; k++) { const aa = 2 + k * 0.6, rk = r * (1 - k * 0.08); pts.push(add(c0, [Math.cos(aa) * rk, Math.sin(aa) * rk * 0.7])); } f.line(pts, 1, '#8a7a84', { op: 0.4 }); }
  T.beads(f, S.at(0.4, 0.4), 18, 30, 6, 0.8); // condensation gathering on her
  T.wisp(f, S.at(-0.36, 0.06), 50, { w: 6, op: 0.25, drift: -16 });

  // ---- the head: dense vapour holding a face; tipped back, eyes closed, singing
  f.bone('head');
  grey(() => {
    G0(0.9); f.part(K.chain([add(neck0, [-6, 14]), add(HC, [-14, 32])], [36, 30]), ST()); G1();
    G0(0.96); B.head(f, HC, H, hA, { skin: mix(st, '#ecdcd8', 0.5), jaw: 0.94, chin: -0.04, nose: 0.92, mouth: 'set', blind: true, faceShade: 0.2, jawShade: 0.2, lips: true, noEar: true, browW: 0.03, browCol: '#9a8a90' }); G1();
  });
  f.line(hF([[0.06, -0.06], [0.11, -0.04], [0.17, -0.055]]), 1.6, '#5a4a54', { op: 0.85 }); // closed lids
  f.line(hF([[0.27, -0.06], [0.295, -0.05], [0.315, -0.058]]), 1.2, '#5a4a54', { op: 0.8 });
  f.flat(hF([[0.19, 0.29], [0.25, 0.28], [0.3, 0.3], [0.28, 0.35], [0.22, 0.36]]), '#7a5a64', { op: 0.85 }); // the open mouth on a note
  f.flat(hF([[0.21, 0.305], [0.26, 0.3], [0.28, 0.32], [0.25, 0.34]]), '#3a2a32', { op: 0.8 });
  f.flat(hF(ell([0.1, 0.12], 0.08, 0.05, 0, 10)), glow, { op: 0.25 }); // a faint warmth in the cheek
  // ---- the breath: a thin scalding plume leaving the open mouth
  f.bone('breath');
  T.steam(f, hF([[0.3, 0.34]])[0], 60, 6, { drift: 46, op: 0.4, grow: 2.2, n: 5, curls: 1, phase: 1 });

  // ---- the hood of the veil: wet linen plastered over the crown, framing the face, falling to the shoulders
  f.bone('veil');
  const hood = [hF([[0.3, -0.42]])[0], hF([[0.12, -0.56]])[0], hF([[-0.16, -0.6]])[0], hF([[-0.42, -0.46]])[0], hF([[-0.54, -0.12]])[0], hF([[-0.5, 0.3]])[0], hF([[-0.38, 0.66]])[0], add(S.at(-0.4, 0.12), [0, 8]), add(S.at(-0.1, 0.16), [0, 10]), hF([[-0.1, 0.58]])[0], hF([[-0.14, 0.24]])[0], hF([[-0.04, -0.2]])[0], hF([[0.16, -0.36]])[0]];
  f.part(hood, T.LIN(f, { fill: '#e4ded2', shadow: '#5e5252' }));
  f.flat([hF([[0.16, -0.36]])[0], hF([[-0.04, -0.2]])[0], hF([[-0.14, 0.24]])[0], hF([[-0.1, 0.4]])[0], hF([[-0.04, 0.2]])[0], hF([[0.04, -0.16]])[0]], '#3e3438', { op: 0.45 }); // shadow inside the hood's edge
  f.line([hF([[0.12, -0.5]])[0], hF([[-0.18, -0.52]])[0], hF([[-0.4, -0.36]])[0]], 1.2, INK, { op: 0.4 }); // the skull under wet linen
  f.stroke([hF([[-0.3, -0.1]])[0], hF([[-0.32, 0.3]])[0], hF([[-0.26, 0.6]])[0]], 1.8);
  f.stroke([hF([[-0.44, 0.0]])[0], hF([[-0.42, 0.4]])[0]], 1.5);
  // embroidered border in bone thread along the face edge; a darn
  f.stitches([hF([[0.26, -0.42]])[0], hF([[0.06, -0.3]])[0], hF([[-0.1, 0.0]])[0], hF([[-0.12, 0.4]])[0], add(S.at(-0.1, 0.16), [0, 6])], P.boneD, 1.3);
  const dn = hF([[-0.32, 0.36]])[0];
  f.part([add(dn, [-7, -6]), add(dn, [7, -6]), add(dn, [7, 8]), add(dn, [-7, 8])], T.LIN(f, { fill: '#c8c0b0', inkW: 1, sharp: true, cast: false }));
  f.stitches([add(dn, [-7, -6]), add(dn, [7, -6]), add(dn, [7, 8]), add(dn, [-7, 8]), add(dn, [-7, -6])], P.linenD, 0.8);
  T.drip(f, add(S.at(-0.25, 0.16), [0, 12]), 0.9); T.drip(f, hF([[-0.38, 0.7]])[0], 1);

  // ---- near arm: the hand pressed lightly at the breastbone as she sings
  // independent review: this upper arm ran down the back edge of the torso as an even pale band with two inked edges and
  // read as a strap. Now the elbow juts back past the body, the arm swells at the deltoid and tapers to the elbow, it has
  // no closed ink outline (only a broken grey contour on its outer edge), it is turned by soft light above and grey
  // vapour-shade beneath, and it frays into vapour along its back like the rest of her.
  grey(() => {
    const softA = (pts, col, op, bl = 'steamblur') => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#${bl}${seed})"/>`);
    const limbN = (a, b, Pw, Qw, op, bone) => {
      f.bone(bone);
      const pts = T.mlimb(a, b, Pw, Qw, { capK: 0.8 });
      softA(pts.map(q => add(q, mul(E.norm(sub(q, lerp(a, b, 0.5))), 8))), st, 0.35); // the vapour halo round it
      f.part(pts, ST({ opacity: op, inkW: 0, inkHeavy: 0, tex: 'mottle' + seed, texOp: 0.2, maxShade: 8 }));
      const d = E.norm(sub(b, a)), n = [-d[1], d[0]], m = Pw.length;
      softA([lp(a, b, 0.05, -Qw[0][1] * 0.9), lp(a, b, 0.5, -Qw[1][1] * 0.95), lp(a, b, 0.95, -Qw[m - 1][1] * 0.9), lp(a, b, 0.95, -Qw[m - 1][1] * 0.2), lp(a, b, 0.5, -Qw[1][1] * 0.3)], stS, 0.55); // shade beneath
      softA([lp(a, b, 0.08, Pw[0][1] * 0.8), lp(a, b, 0.5, Pw[1][1] * 0.85), lp(a, b, 0.9, Pw[m - 1][1] * 0.7), lp(a, b, 0.5, Pw[1][1] * 0.2)], '#fff', 0.5); // light above
      return pts;
    };
    const ua = limbN(SN, EN, [[0, 21], [0.2, 23], [0.55, 17], [1, 13]], [[0, 20], [0.3, 19], [0.65, 15], [1, 13]], 0.8, 'upperarm_n');
    f.line(ua.slice(0, 5), 1.2, greyInk, { op: 0.55, dash: '26 8' }); // a broken contour on the outer edge only
    for (let i = 0; i < 3; i++) { const p0 = lp(SN, EN, 0.3 + i * 0.25, -20); T.wisp(f, p0, 30 + i * 6, { w: 4, op: 0.3, drift: -10, dir: -1 }); } // fraying off its back
    f.line([lp(SN, EN, 0.08, 14), lp(SN, EN, 0.3, 8), lp(SN, EN, 0.42, -4)], 1, greyInk, { op: 0.4 }); // the deltoid's edge
    const fa = limbN(EN, WN, [[0, 14], [0.25, 15], [0.7, 12], [1, 11]], [[0, 14], [0.3, 16], [0.7, 12], [1, 11]], 0.9, 'forearm_n');
    f.line(fa.slice(0, 5), 1.2, greyInk, { op: 0.6 });
    f.flat(ell(add(EN, mul(E.norm(sub(sub(EN, SN), sub(WN, EN))), 10)), 6, 4, 0.4, 8), stS, { op: 0.5 }); // the point of the elbow
    f.bone('hand_n');
    // pressed to her breastbone, so we see the back of the hand, not the palm
    T.handBack(f, add(WN, [6, -6]), -0.9, 19, mix(st, '#e8dcdc', 0.4), { shadow: stS, curl: 0.3, spread: 0.18, lean: true, nail: '#f4eeec' });
  });
  // no floor contact: only a faint haze on the water below
  f.bone('root');
  f.raw(`<ellipse cx="260" cy="${gy}" rx="120" ry="8" fill="${P.steamS}" opacity="0.25" filter="url(#steamblur${seed})"/>`);
  return f;
}

// ------------------------------------------------------------------ BOILED BRUTE (cast, large 1.6)
// A temple bath guard who stayed in the water too long: huge, boiled soft as wet bread, everything sagging. The chest
// hangs, the belly hangs in two folds over the guard's leather belt, the back rolls; the bronze collar of his office is
// sunk into the fat of the neck. The small slack face slides down the skull. He drags his club, a marble baluster
// snapped off the pool rail, by its neck in one hand, the heavy vase end on the floor behind him.
// Rig: standard humanoid + belly (the hanging folds, parent torso) + club (parent hand_n) + skirt (pteruges).
// Motion: idle a heavy wobble (belly, torso); attack a slow, enormous club swing up and over.
function boiledBrute() {
  const seed = 305, h = TIERS.large[1];
  const f = new Fig(T.base(seed, h, { grimeY: 800 }));
  T.textures(f);
  const gy = f.o.groundY;
  const skin = '#ecc8bc', skinD = '#d8aaa0', skinS = '#7a4a56';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const fold = (pts, w = 2.6) => { f.stroke(pts, w, '#4a2430'); f.line(pts.map(q => add(q, [1, -3])), 1.2, '#fbe8e0', { op: 0.55 }); };
  const N = [418, 270], C = [400, 430], Pv = [432, 640];
  const SN = [344, 338], SF = [516, 326];
  const EN = [290, 528], WN = [384, 672];
  const EF = [622, 430], WF = [590, 520];
  const HN = [396, 676], KN = [380, 872], AN = [360, 1002];
  const HF = [486, 668], KF = [536, 862], AF = [548, 1002];
  const HC = [484, 212], hA = 0.16, HH = 132;
  const neck0 = [446, 262];
  T.humanJoints(f, { P: Pv, T: [424, 600], N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('belly', [470, 470], 'torso').joint('skirt', [432, 650], 'pelvis');
  // the club: a marble baluster, its square cap broken off above the fist, the narrow neck in his fist, the swelling
  // vase trailing down and back to its base block on the floor
  const c0 = [414, 640], c1 = [112, gy - 74], cA = ang(c0, c1), cL = E.len(sub(c1, c0));
  f.joint('club', WN, 'hand_n');

  // ---- far arm hanging loose in front of the belly's far side, the hand swollen and open
  T.armRig(f, SF, EF, WF, [96, 84, 64], SK({ fill: skinD }), '_f', { bp: [[0, 0.45, 0.22, 0.18]], bq: [[0, 0.6, 0.12, 0.15], [1, 0.2, 0.12, 0.12]] });
  f.bone('upperarm_f');
  fold([lp(SF, EF, 0.6, -40), lp(SF, EF, 0.7, -10), lp(SF, EF, 0.62, 20)], 2);
  f.bone('forearm_f');
  T.wrinkles(f, lp(EF, WF, 0.3), lp(EF, WF, 0.9), 60, 5);
  f.part(limb(lp(EF, WF, 0.45), lp(EF, WF, 0.8), 76, 70, { capK: 0.3 }), { fill: P.leatherL, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 }); // bracer sunk in the flesh
  f.part(K.chain([lp(EF, WF, 0.42), lp(EF, WF, 0.48)], [84, 82]), SK({ fill: skinD, cast: false, inkW: 1.2 }));

  // ---- legs: thick columns, flesh sagging over the knees, bare feet with sandal straps sunk in
  T.legRig(f, HF, KF, AF, 92, 150, 110, SK({ fill: skinD }), '_f', { thigh: 0.12, calf: 0.12, swell: 0.6 });
  f.bone('shin_f');
  fold([lp(KF, AF, 0.02, -50), lp(KF, AF, 0.08, -10), lp(KF, AF, 0.04, 40)], 2.2);
  T.scald(f, lp(KF, AF, 0.5), 30, 50, 8);
  f.bone('foot_f');
  f.part([add(AF, [-30, 24]), add(AF, [60, 30]), add(AF, [62, 40]), add(AF, [-30, 34])], { fill: P.leather, shadow: P.leatherD, shade: 0.4, inkW: 1.2 });
  T.legRig(f, HN, KN, AN, 92, 158, 116, SK(), '_n', { thigh: 0.14, calf: 0.14, swell: 0.7 });
  f.bone('shin_n');
  fold([lp(KN, AN, 0.0, -56), lp(KN, AN, 0.08, -12), lp(KN, AN, 0.03, 44)], 2.6); // flesh hanging over the knee
  T.scald(f, lp(KN, AN, 0.5), 32, 56, 10);
  T.peelSheet(f, lp(KN, AN, 0.35, 20), 20, 70, { sway: -4 });
  T.blisters(f, lp(KN, AN, 0.7, -20), 14, 16, 4, 3, 6);
  f.bone('foot_n');
  f.part([add(AN, [-34, 24]), add(AN, [62, 28]), add(AN, [64, 40]), add(AN, [-34, 36])], { fill: P.leather, shadow: P.leatherD, shade: 0.4, inkW: 1.2 });
  f.line([add(AN, [-30, 30]), add(AN, [60, 34])], 2, skin, { op: 0.6 }); // flesh bulging over the strap
  f.bone('thigh_n');
  fold([lp(HN, KN, 0.5, -60), lp(HN, KN, 0.56, 0), lp(HN, KN, 0.5, 60)], 2);

  // ---- linen kilt and the leather pteruges of a temple guard, a few strips missing
  f.bone('skirt');
  f.part([[318, 640], [560, 632], [578, 730], [540, 760], [460, 770], [380, 766], [320, 744]], T.LIN(f, { fill: '#cfc4b2' }));
  f.flat([[320, 720], [576, 712], [578, 734], [320, 746]], P.mud, { op: 0.2 });
  const strips = [330, 362, 394, 452, 484, 516, 546];
  strips.forEach((x, i) => {
    const y0 = 630 + Math.abs(x - 440) * 0.04, l = 100 + (i % 3) * 14, w = 30;
    f.part([[x - w / 2, y0, 1], [x + w / 2, y0, 1], [x + w / 2 + 2, y0 + l, 1], [x - w / 2 + 2, y0 + l + 4, 1]], { fill: i % 2 ? P.leather : P.leatherL, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
    f.rivet([x + 1, y0 + l - 12], 3, P.bronzeL);
    f.line([[x - w / 2 + 4, y0 + 6], [x - w / 2 + 5, y0 + l - 4]], 1, '#9a7a60', { op: 0.6 });
  });
  f.flat([[420, 648], [436, 646], [440, 700], [424, 702]], '#2a1a14', { op: 0.5 }); // a gap where a strip tore away

  // ---- the torso: a great soft sack: sagging chest, rolls on the back, everything hanging
  f.bone('torso');
  const torso = [[404, 250], [446, 250], [492, 268], [530, 304], [556, 356], [574, 410], [570, 452], [592, 500], [604, 568], [586, 630], [520, 658], [440, 664], [360, 656], [306, 626], [282, 560], [276, 480], [284, 404], [300, 340], [340, 286]];
  f.part(T.lumpy(f, torso, 5), SK());
  // back rolls and the sagging chest, the armpit crease
  fold([[300, 420], [322, 432], [344, 428]], 2.4); fold([[292, 500], [318, 516], [346, 512]], 2.4); fold([[300, 580], [330, 596], [366, 592]], 2.2);
  fold([[490, 420], [530, 452], [572, 456]], 3); // under the hanging breast
  fold([[300, 360], [330, 352], [356, 362]], 2.2); // the hunch of the upper back
  f.stroke([[470, 330], [510, 352], [540, 380]], 2, '#4a2430');
  f.flat(ell([540, 436], 7, 5, 0.3, 8), '#9a5a5a', { op: 0.8 }); // nipple, hanging low
  T.scald(f, [440, 420], 120, 140, 26);
  T.peelSheet(f, [330, 360], 22, 80, { sway: -6 });
  T.peelSheet(f, [520, 330], 18, 56, { sway: 4 });
  T.blisters(f, [380, 330], 30, 20, 6, 3, 7);
  T.seam(f, [[372, 470], [388, 500], [380, 530], [392, 560]], 2.2);
  T.beads(f, [470, 330], 40, 30, 8, 1.2);
  T.sheen(f, [[510, 268], [540, 286], [568, 320], [584, 370]], 3, 0.5);
  // ---- the belt: a guard's leather belt, the bronze buckle, sunk under the belly
  f.bone('pelvis');
  f.part([[296, 600], [440, 626], [586, 606], [588, 644], [440, 664], [298, 640]], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  f.stitches([[300, 608], [440, 634], [584, 614]], '#9a7a60', 0.9);
  f.part([[548, 614], [578, 610], [580, 646], [550, 650]], { fill: P.bronze, shadow: P.bronzeD, shade: 0.45, inkW: 1.3, sharp: true });
  f.line([[556, 620], [572, 618], [573, 640], [557, 642], [556, 620]], 1.4, P.bronzeD);
  T.verdigris(f, [562, 630], 12, 14, 4);
  // ---- the belly: two hanging folds over the belt, on their own bone so it can wobble
  f.bone('belly');
  const belly = [[470, 440], [560, 456], [604, 500], [618, 560], [608, 612], [570, 650], [510, 664], [450, 660], [420, 630], [430, 560], [440, 490]];
  { const bl = T.lumpy(f, belly, 4); f.part(bl, SK({ inkW: 0, inkHeavy: 0, shade: 0.1, hatch: false, cast: false })); f.line(bl.slice(1, 10), 2.2, INK); f.line(bl.slice(2, 7), 3.4, INK, { op: 0.6 }); }
  fold([[440, 560], [500, 578], [560, 576], [604, 556]], 3.2); // the upper roll
  fold([[430, 628], [480, 650], [540, 652], [590, 630]], 2.6);
  f.line([[560, 520], [566, 530], [560, 540]], 1.8, INK, { op: 0.7 }); // the navel, sunk in a fold
  for (let i = 0; i < 4; i++) f.line([[500 + i * 14, 590 + i * 4], [508 + i * 14, 616 + i * 4]], 1.2, '#fbe8e0', { op: 0.6 }); // stretch marks
  T.scald(f, [530, 560], 60, 70, 14);
  T.blisters(f, [580, 590], 20, 30, 5, 3, 7);
  T.peelSheet(f, [520, 652], 20, 60, { sway: 3, bed: false });
  T.sheen(f, [[560, 462], [596, 496], [612, 540]], 2.6, 0.55);
  // ---- far hand laid on top of the belly, fingers spread over it
  f.bone('hand_f');
  // independent review: the shared B.hand only draws a palm, so the hand laid on his belly showed its palm to us. Now
  // the back of the hand (kit_III handBack): puffy, dimpled knuckles, fingers draping down over the curve of the belly.
  T.handBack(f, add(WF, [-6, 22]), 1.72, 40, skinD, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, curl: 0.34, spread: 0.32, fat: 1.15 });
  T.wrinkles(f, add(WF, [-10, 20]), add(WF, [0, 60]), 30, 4);

  // ---- the head: small for the body, sunk on a neck of fat; the bronze collar buried in it; the face sliding down
  f.bone('head');
  f.part(K.chain([[424, 296], [456, 248]], [126, 104]), SK());
  // fat bulging over and under the collar
  fold([[392, 272], [440, 288], [500, 280]], 2.6);
  f.part([[396, 262], [446, 276], [504, 268], [506, 288], [448, 298], [394, 284]], { fill: P.bronze, shadow: P.bronzeD, shade: 0.45, tex: 'hammer' + seed, texOp: 0.6, inkW: 1.4 });
  f.line([[400, 268], [446, 282], [500, 274]], 1.4, P.bronzeL, { op: 0.8 });
  f.rivet([470, 284], 3.4, P.bronzeL); f.rivet([420, 278], 3, P.bronzeL);
  T.verdigris(f, [440, 284], 40, 6, 6);
  f.part([[396, 282], [448, 296], [506, 286], [500, 302], [446, 310], [400, 298]], SK({ cast: false })); // fat rolling over the lower edge
  const hF = frame(HC, hA, HH);
  B.head(f, HC, HH, hA, { skin, jaw: 1.55, chin: -0.06, nose: 1.15, hook: -0.2, mouth: 'set', squint: 0.78, browDown: -0.02, faceShade: 0.6, jawShade: 0.3, lips: true, iris: '#2a1a1a', eyeWhite: '#e8d0c8', hairCol: '#6a4a40', browCol: '#8a6a5a', noEar: false });
  // melting: the lower lids hang and show red, cheeks slide below the jaw, the mouth hangs open
  for (const [x, w] of [[0.11, 0.065], [0.295, 0.03]]) { f.flat(hF([[x - w, -0.035], [x + w, -0.04], [x + w * 0.7, -0.005], [x, 0.012], [x - w * 0.7, -0.005]]), '#a04a4a', { op: 0.8 }); f.line(hF([[x - w, 0.0], [x, 0.035], [x + w, 0.0]]), 1.1, INK, { op: 0.55 }); } // lower lids hanging, red inside
  f.line(hF([[0.02, 0.06], [0.1, 0.1], [0.2, 0.08]]), 1.2, INK, { op: 0.5 }); // bags under the eye
  f.part(hF([[-0.06, 0.18], [0.12, 0.2], [0.26, 0.34], [0.3, 0.52], [0.2, 0.66], [0.02, 0.66], [-0.12, 0.5], [-0.16, 0.32]]), SK({ fill: mix(skin, '#e0b0a4', 0.4), cast: false, inkW: 1.3 })); // the jowl, slid down
  f.flat(hF([[0.2, 0.3], [0.3, 0.3], [0.33, 0.4], [0.24, 0.44], [0.18, 0.38]]), '#3a1418'); // slack open mouth
  f.flat(hF([[0.21, 0.31], [0.29, 0.31], [0.3, 0.34], [0.22, 0.34]]), '#d8c8b0', { op: 0.8 }); // a row of teeth
  f.line(hF([[0.26, 0.44], [0.27, 0.52], [0.25, 0.6]]), 2.4, P.water, { op: 0.6 }); // drool
  fold(hF([[-0.02, 0.62], [0.12, 0.7], [0.24, 0.64]]), 2);
  f.line(hF([[0.04, -0.2], [0.18, -0.22]]), 1, INK, { op: 0.5 }); f.line(hF([[0.02, -0.28], [0.16, -0.31]]), 1, INK, { op: 0.45 });
  // boiled scalp: thin wet strands over a raw-pink pate, a peeling patch
  f.part(hF([[-0.42, 0.1], [-0.46, -0.2], [-0.34, -0.42], [-0.08, -0.52], [0.14, -0.48], [0.0, -0.4], [-0.2, -0.3], [-0.3, -0.08], [-0.32, 0.12]]), { fill: '#6a4a40', shadow: '#2a1a18', tex: 'hatch' + seed, texOp: 0.3, shade: 0.4, opacity: 0.85 });
  f.flat(hF([[-0.1, -0.46], [0.08, -0.48], [0.12, -0.4], [-0.06, -0.38]]), P.raw, { op: 0.6 });
  T.beads(f, hF([[0.06, -0.3]])[0], 20, 8, 5, 1);
  T.peelSheet(f, hF([[-0.22, 0.3]])[0], 12, 30, { sway: -2 });

  // ---- the club: rope-wrapped neck in the fist, swelling vase, base block on the floor, carved and chipped
  f.bone('club');
  const cf = frame(c0, cA, 1), capU = cL - 92;
  // the shaft: broken jagged top above the fist, rope-wrapped grip, swelling fluted drum to the necking ring
  const shaft = [[-30, -22], [-18, -27], [-6, -20], [40, -21], [120, -27], [200, -33], [capU, -36], [capU, 36], [200, 33], [120, 27], [40, 21], [-4, 22], [-20, 26], [-34, 18], [-26, 4]];
  f.part(cf(shaft), T.MAR(f, { k: 0.7 }));
  for (const v of [-24, -10, 4, 18, 30]) f.line(cf([[60, v * 0.72], [capU - 4, v]]), 1.2, P.marbleS, { op: 0.55 }); // flutes
  for (const v of [-17, -3, 11, 24]) f.line(cf([[60, v * 0.72 + 2], [capU - 4, v + 2]]), 1, P.marbleL, { op: 0.6 });
  f.part(cf([[-30, -22], [-18, -27], [-6, -20], [-2, 22], [-20, 26], [-34, 18], [-26, 4]]), T.MAR(f, { fill: P.marbleD, cast: false })); // the snapped face
  for (let i = 0; i < 6; i++) f.line(cf([[6 + i * 9, -21], [12 + i * 9, 21]]), 1.6, '#7a5a40'); // rope wrap on the grip
  // the Ionic capital: necking ring, egg-and-dart echinus, two volute scrolls, the square abacus, resting on the floor
  f.part(cf([[capU - 4, -40], [capU + 10, -42], [capU + 10, 42], [capU - 4, 40]]), T.MAR(f, { fill: P.marbleD, sharp: true }));
  f.part(cf([[capU + 8, -52], [capU + 40, -66], [capU + 40, 66], [capU + 8, 52]]), T.MAR(f, { k: 0.6 }));
  for (let i = 0; i < 5; i++) f.flat(cf(ell([capU + 24, -44 + i * 22], 7, 9, 0, 8)), P.marbleS, { op: 0.6 });
  for (const sd of [-1, 1]) {
    const vc = [capU + 50, sd * 70];
    f.part(cf(T.lumpy(f, ell(vc, 30, 30, 0, 14), 2)), T.MAR(f));
    const sp = []; for (let k = 0; k <= 22; k++) { const aa = k * 0.55 * sd, rk = 26 * (1 - k / 25); sp.push(add(vc, [Math.cos(aa) * rk, Math.sin(aa) * rk])); }
    f.line(cf(sp), 1.6, P.marbleS, { op: 0.8 });
    f.flat(cf(ell(vc, 4, 4, 0, 8)), P.marbleS, { op: 0.8 });
  }
  f.part(cf([[capU + 72, -104, 1], [cL + 4, -104, 1], [cL + 4, 104, 1], [capU + 72, 104, 1]]), T.MAR(f, { fill: P.marbleL }));
  f.flat(cf([[cL - 6, 70], [cL + 4, 100], [cL - 20, 104]]), P.marbleS, { op: 0.75 }); // a corner knocked off
  f.flat(cf([[capU + 76, -100], [capU + 90, -84], [capU + 74, -78]]), P.marbleS, { op: 0.7 });
  f.flat(cf([[110, -22], [170, -14], [160, 24], [120, 20]]), P.blood, { op: 0.5 }); // old blood
  f.spatter(cf([[capU + 40, 0]])[0], 40, 16, P.blood);
  T.scald(f, cf([[150, 0]])[0], 50, 20, 6, { pink: P.marbleV, pale: P.marbleL });

  // ---- near arm: the huge soft arm hanging, the fist round the baluster's neck
  T.armRig(f, SN, EN, WN, [108, 88, 70], SK(), '_n', { bp: [[0, 0.5, 0.26, 0.16], [1, 0.15, 0.1, 0.1]], bq: [[0, 0.3, 0.1, 0.12], [0, 0.75, 0.14, 0.1], [1, 0.25, 0.12, 0.15]] });
  f.bone('upperarm_n');
  fold([lp(SN, EN, 0.55, 40), lp(SN, EN, 0.62, 0), lp(SN, EN, 0.56, -44)], 2.4); // flesh hanging off the upper arm
  T.peelSheet(f, lp(SN, EN, 0.4, 20), 18, 64, { sway: -3 });
  // the shoulder: a soft sloping mass that belongs to the torso and laps over the top of the arm
  f.bone('torso');
  { const sh = T.lumpy(f, [[322, 300], [372, 272], [420, 280], [426, 330], [400, 380], [356, 400], [314, 392], [294, 352]], 3); f.part(sh, SK({ inkW: 0, inkHeavy: 0, shade: 0.12, hatch: false, cast: false })); f.line([sh[7], sh[0], sh[1]], 2, INK); }
  fold([[312, 380], [350, 394], [392, 378]], 2.2);
  T.blisters(f, [360, 320], 24, 16, 4, 3, 6);
  f.bone('forearm_n');
  f.part(limb(lp(EN, WN, 0.45), lp(EN, WN, 0.8), 84, 76, { capK: 0.3 }), { fill: P.leatherL, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 }); // bracer
  f.part(K.chain([lp(EN, WN, 0.42), lp(EN, WN, 0.48)], [92, 90]), SK({ cast: false, inkW: 1.2 }));
  f.part(K.chain([lp(EN, WN, 0.78), lp(EN, WN, 0.84)], [82, 80]), SK({ cast: false, inkW: 1.2 }));
  for (const t of [0.55, 0.7]) f.rivet(lp(EN, WN, t, 10), 3, P.bronzeL);
  T.scald(f, lp(EN, WN, 0.25), 30, 20, 6);
  f.bone('hand_n');
  B.grip(f, WN, EN, ang(c1, c0), 46, skin, { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: 'brute club' });
  T.wrinkles(f, add(WN, [-20, -10]), add(WN, [20, 10]), 30, 4);
  // wet floor
  f.bone('root');
  f.flat(ell([400, gy + 2], 260, 12, 0, 18), '#5a4a4a', { op: 0.35 });
  T.wisp(f, [300, gy - 4], 50, { w: 6, op: 0.25 });
  return f;
}

// ------------------------------------------------------------------ THE SIMMERING MATRON (ruler 3.5)
// The temple's high priestess of the waters, who never left the great pool. Vast and soft, seated in the pool to the
// chest with her huge arms spread along the marble rim and her enormous wrinkled hands draped over its edge. Skin boiled
// pink-white and translucent like poached meat, sloughing in sheets into the water; gold temple bands sunk into the
// swollen arms. A linen veil plastered to her head over wet hair; the Tooth on a chain on her breastbone. A placid,
// heavy-lidded, contented face, lips cracked. A column of steam rises behind and around her, off the top of the frame.
// Camera at a standing human's chest: the rim's front face fills the bottom of the frame, like a font seen from the nave.
// Rig: pool (root: rim, water) + body (the bob) + torso, head, veil, pendant, both three-bone arms, wave (parent hand_n),
// steam_back and steam_front. Motion: idle a slow bob (body), steam pouring off; attack a wave swept from the pool by the
// near arm (upperarm_n lifts and sweeps, wave follows the hand).
function simmeringMatron() {
  const seed = 300, h = TIERS.ruler[1];
  const f = new Fig(T.base(seed, h, { grimeY: 9999, inkW: 2, inkHeavy: 4.4 }));
  T.textures(f);
  const gy = f.o.groundY, H = 350;
  const skin = '#efd4ca', skinL = '#f8e8e0', skinD = '#d8aea6', skinS = '#7a5262';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle' + seed, texOp: 0.4, maxShade: 46 }, o);
  const veins = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = T.scatter(f, c, rx, ry); f.line([p, add(p, [T.R(f, -12, 12), T.R(f, 10, 24)]), add(p, [T.R(f, -20, 20), T.R(f, 26, 46)])], 1.2, '#b87a86', { op: 0.5 }); } }; // translucent: the veins show
  const fold = (pts, w = 3) => { f.stroke(pts, w, '#5a3040'); f.line(pts.map(q => add(q, [1.5, -4])), 1.6, skinL, { op: 0.6 }); };
  const GOLD = (o = {}) => Object.assign({ fill: P.gold, shadow: P.goldD, shade: 0.45, inkW: 1.6, inkHeavy: 2.4, cast: false, maxShade: 14 }, o);
  // Independent review: the pool read as a flat tray (a thin band of water and a table edge), the arms as even tubes with
  // gold rings round them, and the face as a hard pale/dark split. Rebuilt: the camera looks down a little onto a deep
  // pool, so the water is a plane between her and the coping, with her submerged body showing through it, ripples ringing
  // her at the waterline and steam lifting off the surface itself; the coping has a top, a rolled edge and a carved face.
  // The arms are fat with a real profile: a hanging lobe under the upper arm, a dimpled elbow, flesh bulging round the
  // sunk gold bands, the forearm flattened on the stone and spilling over its edge, the hands' backs draped over it.
  const WL = 1100, RB = 1236, RF = 1292; // waterline on her body; the coping's back (water) edge and front edge
  const N = [810, 820], C = [800, 960], Pv = [790, 1300];
  const S = B.spine(N, C, Pv, H);
  const HC = [856, 640], hA = -0.04, neck0 = [826, 830];
  const SN = [470, 944], EN = [330, 1188], WN = [84, 1214];
  const SF = [1160, 916], EF = [1300, 1184], WF = [1520, 1210];
  f.joint('pool', [800, RB]).joint('body', [800, WL], 'pool').joint('torso', [800, 1060], 'body').joint('head', neck0, 'torso');
  f.joint('veil', [830, 480], 'head').joint('pendant', [840, 890], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('wave', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('steam_back', [820, WL], 'pool').joint('steam_front', [800, RF], 'pool');
  // the water's colour runs from the pale reflecting far surface to the darker depth under the near coping
  f.defs.push(`<linearGradient id="water${seed}" gradientUnits="userSpaceOnUse" x1="0" y1="1050" x2="0" y2="${RB}"><stop offset="0" stop-color="#e2d6d4"/><stop offset="0.3" stop-color="#b8a6a6"/><stop offset="1" stop-color="#5e4c52"/></linearGradient>`);
  f.defs.push(`<linearGradient id="waterF${seed}" gradientUnits="userSpaceOnUse" x1="0" y1="${WL - 6}" x2="0" y2="${RB}"><stop offset="0" stop-color="#c8b8b8" stop-opacity="0"/><stop offset="0.05" stop-color="#d4c4c4" stop-opacity="0.16"/><stop offset="0.55" stop-color="#9a888c" stop-opacity="0.34"/><stop offset="1" stop-color="#4e3e44" stop-opacity="0.72"/></linearGradient>`);

  // ---- the column of steam behind her, rising off the whole pool and out of the top of the frame
  f.bone('steam_back');
  T.steam(f, [820, 1180], 1300, 260, { drift: 60, op: 0.62, grow: 0.9, n: 16, curls: 8, curlW: 2.2, curlOp: 0.7, phase: 0.5, blur: 'steamblur2' });
  T.steam(f, [500, 1180], 900, 150, { drift: -140, op: 0.42, grow: 1.0, n: 11, curls: 4, curlW: 2, phase: 2, blur: 'steamblur2' });
  T.steam(f, [1160, 1180], 950, 160, { drift: 160, op: 0.42, grow: 1.0, n: 11, curls: 4, curlW: 2, phase: 4, blur: 'steamblur2' });

  // ---- the far water: the pool's surface behind and beside her, running back to a pale reflecting distance
  f.bone('pool');
  f.flat([[0, 1056], [1600, 1050], [1600, RB + 4], [0, RB + 8]], `url(#water${seed})`);
  for (let i = 0; i < 9; i++) { const y = 1066 + i * 18, x0 = T.R(f, 0, 300), x1 = T.R(f, 1300, 1600); f.line([[x0, y], [x0 + 120, y - 2], [x0 + 240, y + 1]], 1.4, P.wet, { op: 0.35 - i * 0.025 }); f.line([[x1 - 200, y + 4], [x1 - 80, y + 2], [x1, y + 5]], 1.4, P.wet, { op: 0.35 - i * 0.025 }); }

  // ---- the submerged body: her lap and the soft mass of her thighs, seen down through the water (moves with her bob)
  f.bone('body');
  for (const [cx, rx] of [[620, 230], [990, 240]]) f.part(T.lumpy(f, ell([cx, 1176], rx, 56, 0, 18), 8), SK({ fill: mix(skin, '#c09a9a', 0.3), shadow: '#8a6070', cast: false, inkW: 1.4, inkHeavy: 0, hatch: false, maxShade: 24 })); // knees and thighs
  f.stroke([[790, 1150], [800, 1200], [790, 1250]], 6, '#6a4a52', { op: 0.5 }); // the dark between her thighs

  // ---- the torso: vast and soft, sloping shoulders, the breasts and belly sinking under the water in a soaked shift
  f.bone('torso');
  const torso = [[700, 830], [780, 818], [900, 826], [1010, 846], [1120, 876], [1210, 930], [1250, 1010], [1256, 1080], [1262, 1160], [1250, 1220], [360, 1220], [352, 1160], [356, 1080], [370, 1010], [420, 940], [540, 870]];
  f.part(T.lumpy(f, torso, 6), SK());
  veins([800, 1000], 260, 100, 22);
  T.scald(f, [800, 980], 280, 120, 36, { pink: skinD, pale: skinL });
  // the soaked linen shift: clinging, translucent where wet, slid off the near shoulder
  const shift = [[560, 1010], [680, 960], [820, 950], [960, 966], [1100, 940], [1190, 920], [1240, 1000], [1248, 1080], [1254, 1160], [1246, 1220], [364, 1220], [358, 1160], [372, 1090], [440, 1050]];
  f.part(shift, T.LIN(f, { fill: '#e4dcd0', opacity: 0.82, maxShade: 40 }));
  for (const pts of [[[700, 960], [760, 1010], [800, 1070], [792, 1120]], [[960, 970], [930, 1040], [940, 1110]], [[560, 1040], [600, 1090], [590, 1130]], [[1100, 960], [1080, 1040], [1096, 1110]], [[460, 1070], [480, 1120]], [[860, 1000], [880, 1060]]]) f.stroke(pts, 3);
  T.scald(f, [800, 1060], 380, 40, 20, { pink: P.linenD, pale: '#f4f0ea' }); // wet patches in the linen
  f.part([[1110, 944], [1186, 916], [1204, 940], [1130, 968]], T.LIN(f, { fill: '#d8d0c2', cast: false })); // the shift's strap on the far shoulder
  f.stitches([[580, 1006], [690, 964], [820, 954], [960, 970]], P.boneD, 1.4); // the shift's hem embroidery
  for (const [x, y, rx, ry] of [[700, 1040, 60, 34], [900, 1030, 70, 40], [1040, 1070, 50, 40]]) f.flat(T.lumpy(f, ell([x, y], rx, ry, 0.2, 14), 8), skinD, { op: 0.3 }); // skin showing through the wet linen
  // collarbones, the soft rolls of the neck and chest, the sag of the breasts into the water
  fold([[620, 900], [720, 890], [800, 904]], 3); fold([[880, 900], [970, 890], [1060, 910]], 3);
  fold([[560, 1080], [680, 1100], [790, 1090]], 3.6); fold([[880, 1086], [1000, 1104], [1120, 1090]], 3.6);
  fold([[380, 1020], [400, 1070], [384, 1110]], 3); fold([[1220, 1010], [1236, 1080]], 3); // soft rolls at the sides
  // sheets of boiled skin sloughing off the shoulders and sliding down into the water
  T.peelSheet(f, [480, 1004], 54, 96, { sway: -6, col: '#f6ece6', bedCol: '#d07a72' });
  T.peelSheet(f, [1190, 990], 46, 110, { sway: 6, col: '#f6ece6', bedCol: '#d07a72' });
  T.peelSheet(f, [660, 880], 34, 90, { sway: 4, col: '#f6ece6', bedCol: '#d07a72' });
  T.blisters(f, [580, 910], 60, 30, 10, 6, 13);
  T.blisters(f, [1120, 900], 50, 26, 8, 5, 11);
  T.seam(f, [[390, 990], [380, 1030], [400, 1060], [388, 1090]], 3.4);
  T.beads(f, [800, 920], 300, 50, 30, 2);
  T.sheen(f, [[900, 828], [1010, 848], [1120, 878], [1206, 932], [1246, 1010]], 5, 0.55);
  // ---- the Tooth on its chain: a long yellowed fang, roots and all, capped in gold; its point dips into the water
  f.bone('pendant');
  const tc = [840, 944];
  T.chainLinks(f, [[700, 856], [760, 900], add(tc, [0, -60])], 10, P.gold);
  T.chainLinks(f, [[970, 852], [910, 900], add(tc, [0, -60])], 10, P.gold);
  f.part([add(tc, [-30, -64]), add(tc, [30, -64]), add(tc, [34, -30]), add(tc, [-34, -30])], { fill: P.gold, shadow: P.goldD, shade: 0.45, inkW: 1.6, k: 0.6 });
  f.line([add(tc, [-24, -56]), add(tc, [24, -56])], 2, P.goldL, { op: 0.8 });
  f.part([add(tc, [-30, -32]), add(tc, [30, -32]), add(tc, [26, 40]), add(tc, [12, 110]), [...add(tc, [-6, 160]), 1], add(tc, [-16, 110]), add(tc, [-28, 40])], { fill: '#e2d4b0', shadow: '#7a6a4a', shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  f.line([add(tc, [4, -24]), add(tc, [2, 60]), add(tc, [-6, 150])], 1.6, INK, { op: 0.6 }); // a crack down its length
  f.line([add(tc, [-18, -20]), add(tc, [-20, 60])], 2, '#f8f0d8', { op: 0.7 });
  f.flat([add(tc, [-24, -32]), add(tc, [24, -32]), add(tc, [20, -10]), add(tc, [-22, -10])], '#a08a5a', { op: 0.5 }); // stained at the gum line

  // ---- the head: placid, heavy-lidded, contented; wet hair plastered under the veil
  f.bone('veil');
  const hF = frame(HC, hA, H);
  // the back of the veil, hanging behind her shoulders into the water
  f.part([hF([[-0.2, -0.56]])[0], hF([[-0.52, -0.2]])[0], hF([[-0.6, 0.3]])[0], [580, 920], [520, 1020], [540, 1100], [620, 1100], [690, 1010], hF([[-0.2, 0.5]])[0]], T.LIN(f, { fill: '#d8d0c4', opacity: 0.92 }));
  f.stroke([[590, 960], [580, 1040], [586, 1096]], 3); f.stroke([[640, 940], [644, 1060]], 2.6);
  f.bone('head');
  f.part(K.chain([[820, 900], neck0, hF([[-0.06, 0.4]])[0]], [340, 300, 250]), SK());
  fold([[700, 866], [820, 884], [930, 870]], 3.4);
  // the face's shadow side in a warm rose, not the world's dark wine, so the 0.8 shade models the cheek and jaw as planes
  // instead of splitting the face into pale and dark halves
  // the heavy lower face, under the head's own face shape: jowls and a double chin that widen the silhouette below the jaw
  f.part(hF([[-0.26, 0.16], [-0.04, 0.4], [0.16, 0.5], [0.3, 0.5], [0.36, 0.58], [0.3, 0.68], [0.12, 0.74], [-0.08, 0.7], [-0.22, 0.56], [-0.3, 0.36]]), SK({ inkW: 2, inkHeavy: 3.4, cast: false, shadow: '#a87078', maxShade: 26 }));
  fold(hF([[-0.02, 0.6], [0.14, 0.66], [0.3, 0.6]]), 3.2);
  { const st = f.o.shadowTint; f.o.shadowTint = '#a26a76';
  B.head(f, HC, H, hA, { skin, jaw: 1.32, chin: -0.04, nose: 1.0, hook: -0.1, mouth: 'set', squint: 0.74, browDown: -0.04, faceShade: 0.72, faceHatch: false, jawShade: 0.34, lips: true, lashes: true, iris: '#3a2a2a', eyeWhite: '#eee2da', hairCol: '#4a3830', browCol: '#6a5048', browW: 0.035, noEar: true });
  f.o.shadowTint = st; }
  // the weight of the face: round cheeks pushed up under the eyes, jowls hanging past the jaw, a double chin in two rolls.
  // Modelled with soft blurred light and shade so the big face turns in planes instead of reading as one flat pink field.
  const softF = (pts, col, op) => f.raw(`<path d="${E.smooth(hF(pts))}" fill="${col}" opacity="${op}" filter="url(#steamblur${seed})"/>`);
  f.part(hF([[-0.12, 0.28], [0.02, 0.34], [0.1, 0.44], [0.06, 0.54], [-0.08, 0.56], [-0.18, 0.44]]), SK({ inkW: 1.2, inkHeavy: 0, cast: false, shadow: '#b88088', maxShade: 10 })); // the jowl sagging off the back cheek
  f.line(hF([[0.02, 0.36], [0.08, 0.46], [0.04, 0.55]]), 1.8, '#6a4048', { op: 0.5 });
  softF(ell([0.08, 0.1], 0.13, 0.07, 0.1, 14), '#fff4ee', 0.28); // the cheek's lit top
  softF([[-0.08, 0.2], [0.1, 0.27], [0.24, 0.24], [0.26, 0.3], [0.1, 0.34], [-0.1, 0.3]], '#a26a76', 0.45); // its shadowed underside
  softF([[-0.3, -0.2], [-0.2, -0.3], [-0.16, 0.0], [-0.2, 0.3], [-0.3, 0.2]], '#a26a76', 0.35); // the side of the face turning away
  softF(ell([0.18, 0.6], 0.1, 0.04, 0, 12), '#fff4ee', 0.45); // the lit swell of the double chin
  softF(T.lumpy(f, ell([0.13, 0.16], 0.12, 0.08, 0.15, 12), 0.012), '#d0707a', 0.3); // the boiled flush
  f.line(hF([[0.27, 0.15], [0.24, 0.23], [0.21, 0.3], [0.2, 0.37]]), 2.6, '#6a4048', { op: 0.6 }); // the deep fold from the nose past the mouth corner
  f.line(hF([[0.04, 0.0], [0.1, 0.03], [0.18, 0.02]]), 1.6, '#6a4048', { op: 0.45 }); f.line(hF([[0.06, 0.035], [0.12, 0.06]]), 1.2, '#6a4048', { op: 0.3 }); // bags under the eyes
  for (let i = 0; i < 2; i++) f.line(hF([[0.04, -0.2 - i * 0.05], [0.12, -0.215 - i * 0.05], [0.2, -0.205 - i * 0.05]]), 1.2, '#6a4048', { op: 0.35 }); // soft brow lines
  // heavy lids drooping almost shut, a crease above each; a contented closed smile, the lips cracked and peeling
  for (const [x, w] of [[0.11, 0.075], [0.295, 0.032]]) {
    f.part(hF([[x - w, -0.075], [x, -0.1], [x + w, -0.08], [x + w * 0.9, -0.052], [x, -0.046], [x - w * 0.9, -0.05]]), SK({ fill: skinD, cast: false, inkW: 1.4, inkHeavy: 2, maxShade: 8 }));
    f.line(hF([[x - w * 0.9, -0.1], [x, -0.125], [x + w * 0.9, -0.105]]), 1.4, '#6a4048', { op: 0.55 });
  }
  f.line(hF([[0.17, 0.3], [0.2, 0.292], [0.25, 0.296], [0.3, 0.284], [0.335, 0.262]]), 3, '#6a3a40'); // corners lifted: content
  f.line(hF([[0.165, 0.296], [0.15, 0.28]]), 2, '#6a3a40', { op: 0.7 });
  f.flat(hF([[0.18, 0.3], [0.31, 0.29], [0.3, 0.33], [0.2, 0.335]]), '#b06a6a', { op: 0.6 });
  for (let i = 0; i < 4; i++) f.line(hF([[0.2 + i * 0.03, 0.29], [0.205 + i * 0.03, 0.325]]), 1, INK, { op: 0.6 }); // cracks in the lips
  f.flat(hF([[0.22, 0.33], [0.25, 0.332], [0.245, 0.345]]), '#f4e6de', { op: 0.9 }); // a flake of lip skin
  veins(hF([[0.0, 0.0]])[0], 50, 60, 6);
  T.blisters(f, hF([[-0.1, 0.1]])[0], 30, 30, 5, 5, 9);
  T.peelSheet(f, hF([[-0.16, 0.3]])[0], 26, 70, { sway: -3, col: '#f6ece6', bedCol: '#d07a72' });
  T.beads(f, hF([[0.1, -0.2]])[0], 60, 20, 10, 1.8);
  // wet hair plastered down under the veil, strands escaping and hanging plumb onto the shoulders
  f.part(hF([[0.22, -0.42], [0.0, -0.5], [-0.3, -0.46], [-0.46, -0.2], [-0.44, 0.2], [-0.3, 0.3], [-0.26, 0.0], [-0.12, -0.24], [0.1, -0.32]]), { fill: '#4a3830', shadow: '#1a1210', tex: 'hatch' + seed, texOp: 0.35, shade: 0.4 });
  for (const [x, y, l, w] of [[-0.36, 0.1, 260, 9], [-0.26, 0.2, 200, 7], [0.04, -0.3, 120, 6]]) { const p = hF([[x, y]])[0]; f.stroke([p, add(p, [6, l * 0.4]), add(p, [-4, l * 0.75]), add(p, [2, l])], w, '#3a2a24'); }
  // the veil plastered over the crown, framing the face, dragging wet onto the shoulders; embroidered border
  const vl = [hF([[0.34, -0.38]])[0], hF([[0.14, -0.56]])[0], hF([[-0.2, -0.6]])[0], hF([[-0.5, -0.4]])[0], hF([[-0.6, 0.0]])[0], hF([[-0.56, 0.4]])[0], [620, 900], [700, 890], hF([[-0.2, 0.52]])[0], hF([[-0.24, 0.2]])[0], hF([[-0.16, -0.2]])[0], hF([[0.08, -0.38]])[0]];
  f.part(vl, T.LIN(f, { fill: '#e6dfd4', opacity: 0.95, maxShade: 50 }));
  // the shadow inside the veil's edge is soft now (it was a hard dark band against the face)
  f.raw(`<path d="${E.smooth([hF([[0.08, -0.38]])[0], hF([[-0.16, -0.2]])[0], hF([[-0.24, 0.2]])[0], hF([[-0.2, 0.4]])[0], hF([[-0.12, 0.1]])[0], hF([[-0.04, -0.24]])[0]])}" fill="#3e3438" opacity="0.3" filter="url(#steamblur${seed})"/>`);
  f.line([hF([[0.12, -0.5]])[0], hF([[-0.2, -0.52]])[0], hF([[-0.44, -0.34]])[0]], 1.8, INK, { op: 0.4 });
  f.stitches([hF([[0.3, -0.38]])[0], hF([[0.06, -0.34]])[0], hF([[-0.14, -0.14]])[0], hF([[-0.2, 0.24]])[0], hF([[-0.16, 0.5]])[0]], P.goldD, 2);
  for (const [a0, a1] of [[[-0.36, -0.3], [-0.4, 0.2]], [[-0.48, -0.1], [-0.5, 0.36]]]) f.stroke([hF([a0])[0], hF([a1])[0]], 2.6);
  f.flat([hF([[-0.3, -0.4]])[0], hF([[-0.42, -0.2]])[0], hF([[-0.34, -0.14]])[0], hF([[-0.24, -0.34]])[0]], '#4a3830', { op: 0.3 }); // the hair dark through the wet linen
  T.drip(f, hF([[-0.54, 0.44]])[0], 2); T.drip(f, [630, 910], 1.8);

  // ---- under the surface (on the bob bone): the shift floating up off her belly in a billowing hem, the rolls of the
  // belly under it, her knees rising toward the coping with dark water between them
  f.bone('body');
  f.stroke([[420, WL + 30], [600, WL + 44], [800, WL + 48], [1000, WL + 42], [1200, WL + 28]], 5, '#7a5a64', { op: 0.6 }); // the belly's lower roll
  for (const [cx, rx] of [[640, 170], [980, 180]]) { f.part(T.lumpy(f, ell([cx, RB - 14], rx, 46, 0, 18), 6), SK({ fill: mix(skin, '#a89aa6', 0.3), shadow: '#7a5a6a', cast: false, inkW: 1.6, inkHeavy: 0, hatch: false, maxShade: 18, opacity: 0.85 })); f.line([[cx - rx * 0.5, RB - 46], [cx, RB - 56], [cx + rx * 0.4, RB - 48]], 2.4, '#fbf0ea', { op: 0.5 }); }
  f.flat([[780, RB - 50], [830, RB - 50], [850, RB], [770, RB]], '#3e2e36', { op: 0.6 });
  const hemW = []; for (let i = 0; i <= 14; i++) { const x = 400 + i * 58; hemW.push([x, WL + 62 + Math.sin(i * 1.3) * 12 + (i % 2) * 8]); }
  f.part([[400, WL + 34], [1220, WL + 34], ...hemW.slice().reverse()], T.LIN(f, { fill: '#d8d0c8', opacity: 0.7, cast: false, maxShade: 10, inkW: 1.2 }));
  for (let i = 1; i < 14; i += 2) f.line([[400 + i * 58, WL + 38], [404 + i * 58, hemW[i][1] - 4]], 1.6, P.linenD, { op: 0.6 });
  // ---- the near water: a plane in front of her submerged body, rippling where it meets her, steaming
  f.bone('pool');
  f.flat([[0, WL - 6], [1600, WL - 6], [1600, RB + 6], [0, RB + 6]], `url(#waterF${seed})`);
  // her body under the surface: cooler and dimmer, its edge displaced where the surface bends the light
  for (const [x0, sg] of [[352, -1], [1262, 1]]) f.part([[x0, WL + 6], [x0 + sg * 18, WL + 30], [x0 + sg * 10, WL + 64], [x0 + sg * 22, WL + 100], [x0 + sg * 14, RB], [x0 - sg * 6, RB], [x0 - sg * 4, WL + 6]], SK({ fill: mix(skin, '#9a8a96', 0.4), cast: false, inkW: 0, inkHeavy: 0, hatch: false, maxShade: 6, opacity: 0.7 }));
  // light caught in the water over her submerged body (caustic threads), and her outline wavering under the surface
  for (let i = 0; i < 6; i++) { const y = WL + 22 + i * 20; let pts = []; for (let x = 380; x <= 1240; x += 60) pts.push([x + T.R(f, -12, 12), y + Math.sin(x / 50 + i) * 4]); f.line(pts, 1.4, '#f0e2de', { op: 0.32 - i * 0.04, dash: `${30 + i * 6} ${18 + i * 4}` }); }
  for (const x0 of [366, 1250]) { const sg = x0 < 800 ? 1 : -1; f.line([[x0, WL + 8], [x0 + sg * 10, WL + 40], [x0 - sg * 4, WL + 70], [x0 + sg * 14, WL + 100], [x0 + sg * 2, WL + 130]], 3, '#e8c8c2', { op: 0.35 }); }
  // the waterline hugging her body: a bright meniscus with a dark wet contact line, then rings spreading out over the pool
  f.line([[356, WL + 2], [560, WL + 10], [800, WL + 14], [1040, WL + 10], [1256, WL + 2]], 4, '#4a3640', { op: 0.55 });
  f.line([[356, WL + 6], [560, WL + 14], [800, WL + 18], [1040, WL + 14], [1256, WL + 6]], 2.6, '#fbf6f2', { op: 0.8 });
  { const tp = add(tc, [-6, 160]); for (let i = 0; i < 2; i++) f.line(ell(tp, 18 + i * 14, 4 + i * 3, 0, 14), 1.4, '#fbf6f2', { op: 0.5 - i * 0.2 }); } // where the Tooth's point dips in
  // sloughed skin floating in pale torn sheets, a scum of it, boiling bubbles breaking the surface
  for (const [x, y, w] of [[500, 1150, 90], [1160, 1160, 110], [330, 1196, 70], [960, 1200, 80], [700, 1214, 60]]) { const sh = T.lumpy(f, [[x - w / 2, y], [x - w / 4, y - 8], [x + w / 3, y - 6], [x + w / 2, y + 2], [x + w / 5, y + 10], [x - w / 3, y + 8]], 3); f.part(sh, { fill: '#f0e2da', shadow: '#8a7a7a', shade: 0.3, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, opacity: 0.85 }); f.line([add([x, y], [-w * 0.3, 2]), add([x, y], [w * 0.2, 0])], 1, P.rawL, { op: 0.6 }); }
  for (let i = 0; i < 22; i++) { const p = [T.R(f, 60, 1540), T.R(f, WL + 20, RB - 10)], r = T.R(f, 4, 12); f.part(ell(p, r, r * 0.6, 0, 10), { fill: '#d8ccc8', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(ell(add(p, [r * 0.3, -r * 0.2]), r * 0.3, r * 0.2, 0, 6), '#fff', { op: 0.8 }); if (i % 3 === 0) f.line(ell(p, r * 2.2, r * 0.9, 0, 14), 1, '#fbf6f2', { op: 0.4 }); }
  // steam lifting straight off the hot surface: low vapour lying on it and many thin wisps rising from it
  f.raw(`<rect x="0" y="${WL - 30}" width="1600" height="70" fill="${P.steam}" opacity="0.35" filter="url(#steamblur2${seed})"/>`);
  for (let i = 0; i < 14; i++) { const x = 60 + i * 108 + T.R(f, -20, 20), y = T.R(f, WL + 30, RB - 20); T.wisp(f, [x, y], T.R(f, 90, 170), { w: T.R(f, 7, 12), op: 0.32, drift: T.R(f, -20, 20), ph: i }); }
  // rings spreading out over the pool from where her body moves in the water
  for (let i = 0; i < 4; i++) { const e = ell([806, WL + 6], 470 + i * 70, 22 + i * 16, 0, 40).slice(1, 20); f.line(e, 3 - i * 0.4, '#fbf6f2', { op: 0.75 - i * 0.14, dash: `${70 - i * 8} ${22 + i * 10}` }); f.line(e.map(q => add(q, [0, 5])), 2, '#4a3640', { op: 0.45 - i * 0.08, dash: `${70 - i * 8} ${22 + i * 10}` }); }

  // ---- the coping: a broad marble top running back to the water, a rolled front edge, a carved frieze below
  f.part([[0, RB + 2], [1600, RB - 4], [1600, RF - 2], [0, RF + 2]], T.MAR(f, { fill: mix(P.marbleL, P.marble, 0.3), maxShade: 16, cast: false }));
  f.flat([[0, RB + 2], [1600, RB - 4], [1600, RB + 10], [0, RB + 16]], '#5a4248', { op: 0.55 }); // wet dark lip where the water laps
  f.line([[0, RB + 4], [1600, RB - 2]], 2, P.wet, { op: 0.5 });
  for (let i = 0; i < 8; i++) { const x = T.R(f, 40, 1560); f.flat(T.lumpy(f, ell([x, RB + T.R(f, 14, 40)], T.R(f, 20, 50), T.R(f, 4, 8), 0, 10), 3), P.water, { op: 0.4 }); } // puddles on the top
  f.part([[0, RF], [1600, RF - 4], [1600, RF + 22], [0, RF + 26]], T.MAR(f, { fill: P.marbleL, maxShade: 10, cast: false })); // the rolled edge
  f.line([[0, RF + 4], [1600, RF]], 3, '#fff8f4', { op: 0.75 });
  f.part([[0, RF + 24], [1600, RF + 20], [1600, gy + 30], [0, gy + 30]], T.MAR(f, { maxShade: 30 }));
  f.flat([[0, RF + 24], [1600, RF + 20], [1600, RF + 44], [0, RF + 48]], P.marbleS, { op: 0.55 }); // shadow under the roll
  // the frieze: a running wave scroll between two mouldings
  f.line([[0, RF + 90], [1600, RF + 84]], 3, P.marbleS, { op: 0.8 }); f.line([[0, RF + 230], [1600, RF + 224]], 3, P.marbleS, { op: 0.8 });
  for (let i = 0; i < 12; i++) { const x0 = i * 140, y0 = RF + 160 - i * 0.5, sp = []; for (let k = 0; k <= 16; k++) { const aa = -k * 0.5, rk = 46 * (1 - k / 18); sp.push(add([x0 + 70, y0], [Math.cos(aa) * rk, Math.sin(aa) * rk])); } f.line([[x0, y0 + 40], [x0 + 30, y0 - 30], ...sp], 2.6, P.marbleS, { op: 0.75 }); }
  // cracks, white mineral scale crusting the roll, boiling water overflowing in runs down the face, a chipped corner
  for (const c of [[[420, RF + 30], [440, RF + 110], [410, RF + 190], [430, RF + 300]], [[1180, RF + 26], [1160, RF + 120], [1190, RF + 240]], [[880, RF + 270], [910, RF + 308]]]) f.line(c, 2.6, INK, { op: 0.7 });
  for (const x of [80, 520, 760, 1050, 1350]) { for (let j = 0; j < 5; j++) { const q = [x - 40 + j * 20 + T.R(f, -6, 6), RF + T.R(f, 4, 26)]; f.flat(T.lumpy(f, ell(q, T.R(f, 8, 16), T.R(f, 4, 9), 0, 9), 3), '#f6f2ec', { op: 0.75 }); f.flat(ell(add(q, [2, 3]), 2, 1.4, 0, 6), P.marbleS, { op: 0.6 }); } f.stroke([[x, RF + 30], [x + 4, RF + 130], [x - 2, RF + 230]], 8, P.water, { op: 0.4 }); T.drip(f, [x - 2, RF + 238], 2.2); }
  f.flat([[884, RF + 2], [924, RF], [918, RF + 20], [892, RF + 22]], P.marbleD, { op: 0.8 }); f.line([[884, RF + 2], [924, RF], [918, RF + 20]], 1.4, INK, { op: 0.6 }); // a chip out of the roll
  T.scald(f, [800, RF + 270], 800, 50, 50, { pink: P.mud, pale: '#8a7a74', ang: 1.5 });
  // offerings on the coping: a cold clay oil lamp and a folded towel left by an attendant
  { const lc = [730, RF - 22]; // a clay oil lamp: round body, a filling hole, the nozzle with its burnt wick, a loop handle
    f.part([add(lc, [-34, 14]), add(lc, [-40, 0]), add(lc, [-30, -12]), add(lc, [0, -16]), add(lc, [26, -12]), add(lc, [52, -10]), add(lc, [60, -2]), add(lc, [50, 8]), add(lc, [24, 12]), add(lc, [0, 16])], { fill: '#8a5a42', shadow: '#3a2018', shade: 0.4, inkW: 1.6, maxShade: 10 });
    f.flat(ell(add(lc, [-6, -6]), 10, 4, 0, 10), '#2a1810'); f.flat(ell(add(lc, [52, -4]), 5, 3, 0, 8), '#1a1008');
    f.part([add(lc, [-40, 0]), add(lc, [-54, -10]), add(lc, [-50, -16]), add(lc, [-36, -8])], { fill: '#7a4a36', inkW: 1.2, cast: false, maxShade: 4 });
    f.line([add(lc, [52, -6]), add(lc, [56, -16])], 2, INK); f.line([add(lc, [-26, -8]), add(lc, [20, -10])], 1.4, '#c08a6a', { op: 0.6 }); }
  { const tw = [1060, RF - 6]; // a folded towel left by an attendant, three layers and a hemmed edge, stained
    for (let i = 0; i < 3; i++) f.part([add(tw, [-56, -i * 10]), add(tw, [56, -4 - i * 10]), add(tw, [58, -14 - i * 10]), add(tw, [-54, -10 - i * 10])], T.LIN(f, { fill: mix('#d8d0c4', '#fff', i * 0.1), cast: i === 0, maxShade: 6, inkW: 1.2 }));
    f.stitches([add(tw, [-50, -26]), add(tw, [50, -30])], P.linenD, 1); f.flat(ell(add(tw, [10, -24]), 14, 4, 0, 10), P.raw, { op: 0.5 }); }
  f.bone('steam_front');
  T.steam(f, [300, RF - 20], 260, 70, { drift: -40, op: 0.26, grow: 1.4, n: 6, curls: 2, curlW: 1.6 });
  T.steam(f, [1240, RF - 20], 300, 80, { drift: 50, op: 0.26, grow: 1.4, n: 6, curls: 2, curlW: 1.6, phase: 3 });

  // ---- the arms: fat, laid along the coping; gold bands sunk into the swollen flesh; hands draped over the edge
  // a gold band sunk into a limb at t on segment a->b: flesh overhangs its top edge and bulges out under it
  const band = (a, b, t, hw, bw, bow) => {
    const d = E.norm(sub(b, a)), n = [-d[1], d[0]], c = lerp(a, b, t);
    const arc = (dt, k) => { const r = []; for (let i = 0; i <= 10; i++) { const u = -1 + i / 5; r.push(add(add(c, mul(n, u * hw * k)), mul(d, dt + bow * (1 - u * u)))); } return r; };
    const top = arc(-bw / 2, 0.97), bot = arc(bw / 2, 0.97);
    f.part([...top, ...bot.reverse()], GOLD());
    f.line(arc(-bw * 0.15, 0.9).slice(1, 8), 2.6, P.goldL, { op: 0.85 });
    for (let i = 0; i < 4; i++) f.line([arc(-bw / 2 + 2, 0.97)[1 + i * 2], arc(bw / 2 - 2, 0.97)[1 + i * 2]], 1, P.goldD, { op: 0.6 }); // chased lines
    // the flesh rolling over the top edge and bulging out under the bottom edge: a crease each side, a lit swell
    const over = arc(-bw / 2 - 6, 1.0), under = arc(bw / 2 + 7, 1.0);
    f.part([...arc(-bw / 2 - 14, 1.04), ...arc(-bw / 2 + 5, 0.98).reverse()], SK({ cast: false, inkW: 0, inkHeavy: 0, hatch: false, maxShade: 4 }));
    f.stroke(over, 4.6, '#4a2432'); f.line(over.map(q => add(q, mul(d, -8))), 2, skinL, { op: 0.7 });
    f.stroke(under, 4.2, '#4a2432'); f.line(under.map(q => add(q, mul(d, 8))), 2, skinL, { op: 0.7 });
    return arc;
  };
  const fatArm = (S0, E0, W0, sfx, k) => {
    const de = elb(S0, E0, W0);
    // upper arm: P is its outer top edge, Q the underside where the fat hangs in a heavy lobe toward the elbow;
    // the forearm: P on top, Q underneath, flattened where it lies on the stone and pinched at the bracelet
    const prof = [
      [[[0, 104 * k], [0.15, 110 * k], [0.35, 104 * k], [0.47, 94 * k], [0.5, 88 * k], [0.53, 94 * k], [0.64, 104 * k], [0.82, 98 * k], [1, 90 * k]],
        [[0, 100 * k], [0.2, 112 * k], [0.4, 114 * k], [0.47, 104 * k], [0.5, 96 * k], [0.53, 108 * k], [0.64, 146 * k], [0.78, 164 * k], [0.9, 150 * k], [1, 104 * k]]],
      [[[0, 86 * k], [0.15, 88 * k], [0.4, 78 * k], [0.65, 64 * k], [0.79, 56 * k], [0.84, 47 * k], [0.89, 54 * k], [1, 50 * k]],
        [[0, 90 * k], [0.2, 92 * k], [0.45, 84 * k], [0.68, 70 * k], [0.79, 62 * k], [0.84, 53 * k], [0.89, 60 * k], [1, 56 * k]]],
    ];
    // shadow of the arm on the coping top
    f.bone('forearm' + sfx);
    f.raw(`<path d="${E.smooth([add(E0, [40, 70]), add(lerp(E0, W0, 0.5), [0, 88]), add(W0, [-20, 84]), add(W0, [-40, 100]), add(E0, [60, 104])])}" fill="#2a1a20" opacity="0.4" filter="url(#steamblur2${seed})"/>`);
    split(f, () => {
      const d = f.part(T.mchain([S0, E0, W0], prof, { knob: [1.16] }), SK({ k: 0.9, maxShade: 30 }));
      veins(lerp(S0, E0, 0.5), 50, 60, 6);
      T.scald(f, lerp(S0, E0, 0.5), 60, 80, 12, { pink: skinD, pale: skinL });
      T.wrinkles(f, lerp(E0, W0, 0.2), lerp(E0, W0, 0.95), 120 * k, 12, { w: 1.2 });
      T.scald(f, lerp(E0, W0, 0.5), 70, 30, 10, { pink: skinD, pale: skinL, ang: 0 });
      // the hanging lobe of the upper arm: the fold where it sags over itself, its lit belly, stretch marks
      const u = (t, off) => lp(S0, E0, t, off);
      fold([u(0.08, -96 * k), u(0.16, -110 * k), u(0.26, -104 * k)], 3.4); // the armpit crease where the arm leaves the body
      // the elbow: a dimpled fat pad over the point, creases on the inside of the bend
      const ek = add(E0, mul(de, 0)), out = E.norm(sub(add(E0, mul(E.norm(sub(E0, S0)), 1)), add(E0, mul(E.norm(sub(W0, E0)), 1))));
      const ep = add(E0, mul(E.norm(add(E.norm(sub(E0, S0)), mul(E.norm(sub(W0, E0)), -1))), 96 * k));
      f.flat(ell(lerp(ek, ep, 0.55), 16 * k, 10 * k, 0.3, 10), '#8a5a64', { op: 0.5 }); f.line(ell(lerp(ek, ep, 0.55), 18 * k, 12 * k, 0.3, 10).slice(5, 10), 1.6, skinL, { op: 0.6 });
      for (let i = 0; i < 3; i++) f.line([lp(E0, W0, 0.02 + i * 0.04, 70 * k), lp(E0, W0, 0.06 + i * 0.04, 30 * k), lp(S0, E0, 0.95 - i * 0.03, 40 * k)], 1.6, '#5a3040', { op: 0.55 - i * 0.12 });
      // the forearm's underside flattened on the stone, wrist rolls
      f.line([lp(E0, W0, 0.15, -92 * k), lp(E0, W0, 0.5, -90 * k), lp(E0, W0, 0.78, -76 * k)], 3, '#4a2432', { op: 0.45 });
      for (let i = 0; i < 3; i++) fold([lp(E0, W0, 0.92 + i * 0.03, 66 * k), lp(E0, W0, 0.94 + i * 0.03, 0), lp(E0, W0, 0.92 + i * 0.03, -70 * k)], 2.4);
      T.peelSheet(f, lp(E0, W0, 0.45, -40 * k), 40 * k, 90, { sway: 4, col: '#f6ece6', bedCol: '#d07a72' });
      return d;
    }, [['upperarm' + sfx, side(E0, mul(de, -1), 80 * k)], ['forearm' + sfx, side(E0, de, 80 * k)]]);
    // the hanging lobe (in the outline above): where it folds back against the arm, stretch marks across its belly
    f.bone('upperarm' + sfx);
    { const u = (t, off) => lp(S0, E0, t, off);
      fold([u(0.56, -112 * k), u(0.7, -126 * k), u(0.86, -128 * k), u(0.97, -106 * k)], 4.4);
      f.line([u(0.62, -150 * k), u(0.76, -160 * k), u(0.88, -148 * k)], 3, skinL, { op: 0.55 }); // its lit belly
      for (let i = 0; i < 4; i++) f.line([u(0.6 + i * 0.08, -134 * k), u(0.62 + i * 0.08, -156 * k)], 1.3, '#fbe8e0', { op: 0.6 });
      veins(u(0.7, -140 * k), 26, 16, 3); T.blisters(f, u(0.66, -146 * k), 14, 8, 2, 4, 7); }
    // the gold armlet and the wrist bracelet, sunk in the flesh
    const ar = band(S0, E0, 0.5, 92 * k, 34 * k, 10 * k);
    for (const kk of [-0.5, 0, 0.5]) f.flat(ell(ar(0, 1)[Math.round(5 + kk * 5)], 6, 5, 0, 8), '#ece2d6', { op: 0.95 }); // set pearls
    f.bone('forearm' + sfx);
    band(E0, W0, 0.84, 52 * k, 22 * k, 6 * k);
    // the forearm's flesh spilling over the rolled edge of the coping
    const sp0 = lp(E0, W0, 0.18, -60 * k), sp1 = lp(E0, W0, 0.7, -56 * k);
    const spill = [sp0, add(lerp(sp0, sp1, 0.1), [0, RF - sp0[1] + 6]), add(lerp(sp0, sp1, 0.35), [0, RF - sp0[1] + 46]), add(lerp(sp0, sp1, 0.65), [0, RF - sp0[1] + 52]), add(lerp(sp0, sp1, 0.9), [0, RF - sp1[1] + 26]), sp1, lerp(sp0, sp1, 0.5)];
    f.part(spill, SK({ cast: true, castOp: 0.35, inkW: 1.6, inkHeavy: 1.6, maxShade: 12 }));
    fold([add(lerp(sp0, sp1, 0.12), [0, RF - sp0[1] + 4]), add(lerp(sp0, sp1, 0.5), [0, RF - sp0[1] + 10]), add(lerp(sp0, sp1, 0.86), [0, RF - sp1[1] + 4])], 3.6); // pressed over the rolled edge
    T.wrinkles(f, add(lerp(sp0, sp1, 0.2), [0, RF - sp0[1] + 30]), add(lerp(sp0, sp1, 0.8), [0, RF - sp1[1] + 30]), 30, 6, { w: 1.1 });
  };
  const drapeHand = (W0, E0, sfx, ang, s, flip) => {
    f.bone('hand' + sfx);
    const hh = T.handBack(f, add(W0, rot([s * 0.62, 0], ang)), ang, s, skin, { shadow: '#9a6a76', tex: 'pruned' + seed, texOp: 0.6, curl: 0.16, spread: 0.16, flip, nail: '#f0e0d6', fat: 1.12 });
    f.line([add(W0, [-70, RF - W0[1] + 8]), add(W0, [0, RF - W0[1] + 14]), add(W0, [70, RF - W0[1] + 8])].map(q => [q[0] + (ang - 1.57) * -40, q[1]]), 2.6, '#4a2432', { op: 0.5 }); // the bend over the edge
    T.wrinkles(f, add(W0, rot([s * 0.5, 0], ang)), add(W0, rot([s * 2.2, 0], ang)), s * 1.1, 9, { w: 1.3 });
    hh.tips.forEach((t, i) => { if (i % 2 === 0) T.drip(f, add(t, [0, 16]), 1.8); });
    // swollen fingers with gold rings sunk in them
    for (const i of [1, 2]) { const t = hh.tips[i], base = hh.fingers[i], c = lerp(base, t, 0.34), a = Math.atan2(t[1] - base[1], t[0] - base[0]); band(add(c, rot([-10, 0], a)), add(c, rot([10, 0], a)), 0.5, 32, 14, 4); }
  };
  // far arm first, then the near arm in front
  fatArm(SF, EF, WF, '_f', 0.92);
  drapeHand(WF, EF, '_f', 1.48, 98, true);
  fatArm(SN, EN, WN, '_n', 1.0);
  f.bone('torso');
  // the shoulders belong to the torso: the slope of the neck runs out over the deltoid and down the outside of the arm
  for (const pts of [[[700, 860], [580, 880], [470, 900], [380, 950], [350, 1030], [372, 1090], [440, 1080], [520, 1010], [620, 960]], [[960, 858], [1060, 872], [1160, 880], [1236, 930], [1262, 1010], [1240, 1070], [1180, 1056], [1110, 990], [1020, 940]]]) {
    const sh = T.lumpy(f, pts, 4);
    f.part(sh, SK({ inkW: 0, inkHeavy: 0, shade: 0.12, hatch: false, cast: false, maxShade: 20 }));
    f.line(sh.slice(0, 6), 2.4, INK); f.line(sh.slice(1, 5), 4, INK, { op: 0.35 });
    T.scald(f, sh[3], 60, 40, 8, { pink: skinD, pale: skinL });
  }
  T.blisters(f, [430, 960], 30, 20, 4, 6, 11);
  drapeHand(WN, EN, '_n', 1.68, 104, false);
  // ---- the wave: boiling water heaped against the coping beside the near hand, the start of the sweep
  f.bone('wave');
  // a swell of boiling water heaving up over the coping beside the near hand, frothing on its crest and spilling down
  const crest = [[170, RF + 4], [200, RF - 26], [244, RF - 58], [292, RF - 78], [344, RF - 72], [386, RF - 50], [418, RF - 22], [440, RF + 8], [400, RF + 22], [300, RF + 26], [210, RF + 20]];
  f.part(crest, { fill: '#b8acae', shadow: '#5e4e56', shade: 0.3, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, opacity: 0.6, maxShade: 20 });
  f.line([[206, RF - 4], [246, RF - 34], [300, RF - 50], [360, RF - 40], [410, RF - 6]], 2.2, '#fbf6f2', { op: 0.5 }); // a glassy band inside the swell
  for (let i = 0; i < 26; i++) { const t = f.r(), q = add(lerp(crest[1], crest[6], t), [T.R(f, -8, 8), -Math.sin(t * Math.PI) * 14 + T.R(f, -6, 8)]), r = T.R(f, 3, 11); f.flat(ell(q, r, r * 0.7, f.r(), 9), '#fbf6f2', { op: T.R(f, 0.55, 0.9) }); if (r > 7) f.line(ell(q, r, r * 0.7, 0, 9).slice(4, 8), 0.9, '#8a7a80', { op: 0.5 }); } // froth
  for (let i = 0; i < 12; i++) { const q = add(lerp(crest[2], crest[5], f.r()), [T.R(f, -10, 10), -T.R(f, 24, 70)]); f.flat(ell(q, 2.6, 3.6, 0, 6), P.water, { op: 0.75 }); } // spray
  for (const [x, l] of [[232, 120], [288, 170], [346, 90], [404, 140]]) { f.stroke([[x, RF + 16], [x + 2, RF + l * 0.5], [x - 1, RF + l]], 6, P.water, { op: 0.55 }); T.drip(f, [x - 1, RF + l + 6], 2); }
  T.steam(f, [340, RF - 66], 200, 50, { drift: -30, op: 0.35, grow: 1.4, n: 5, curls: 2 });
  return f;
}

// ------------------------------------------------------------------ THE BATH-MISTRESS (elite 1.9)
// The Matron's steward, mistress of the attendants: tall, upright, severe, chin up. A stiff steaming linen gown to the
// floor under a wet work apron, sleeves rolled above the elbow, the forearms boiled red to a hard tide line at the elbow.
// The long copper ladle is held like a mace: the near fist low on the handle at her hip, the handle rising forward past
// her shoulder, its brimming bowl up in front of her, steaming; the handle rests across her far palm, where she taps it.
// A ring of bath-house keys and a scrubbing brush on a chain hang at her belt; wooden bath clogs under the hem.
// Rig: standard humanoid (legs hidden under the gown) + ladle (parent hand_n) + skirt + apron + keys + brush.
// Motion: idle tapping the ladle in her palm (forearm_n, ladle); attack a ladleful of boiling water flung forward.
function bathMistress() {
  const seed = 301, h = TIERS.elite[1];
  const f = new Fig(T.base(seed, h, { grimeY: 1150 }));
  T.textures(f);
  const gy = f.o.groundY, H = 190;
  const skin = '#e4b4a0', red = '#c45a46', redS = '#5a1e22';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: '#6a3a40', shade: 0.32, tex: 'mottle' + seed, texOp: 0.45 }, o);
  const RD = (o = {}) => Object.assign({ fill: red, shadow: redS, shade: 0.34, tex: 'pruned' + seed, texOp: 0.6 }, o);
  const N = [452, 384], C = [462, 560], Pv = [452, 744];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.22, 0.12), SF = S.at(0.36, 0.1);
  const EN = [404, 650], WN = [600, 690];
  const EF = [560, 620], WF = [690, 560];
  const HN = [424, 760], KN = [430, 1040], AN = [424, 1300];
  const HF = [482, 760], KF = [500, 1040], AF = [508, 1300];
  const HC = [476, 254], hA = -0.1, neck0 = S.at(0.12, -0.03);
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the ladle: a long handle from its hooked butt below the fist, up through the far palm to the bowl
  const L0 = [566, 790], L1 = [826, 226], lA = ang(L0, L1), lAt = t => lerp(L0, L1, t);
  f.joint('ladle', WN, 'hand_n').joint('skirt', S.at(0, 0.92), 'pelvis').joint('apron', S.at(0.3, 0.9), 'pelvis').joint('keys', S.at(-0.5, 0.94), 'pelvis').joint('brush', S.at(0.1, 0.95), 'pelvis');

  // ---- far arm: rolled sleeve, boiled-red forearm forward, palm up under the handle
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 70, 60, { q: [[0.5, 0.1, 0.2]] }), T.LIN(f, { fill: P.linenW }));
  f.bone('forearm_f');
  f.part(limb(EF, WF, 54, 44), RD({ fill: mix(red, redS, 0.15) }));
  T.blisters(f, lp(EF, WF, 0.2), 14, 10, 3, 3, 5);
  f.part(K.ragLimb(f, lerp(SF, EF, 0.6), lerp(SF, EF, 1.08), 78, 82, { depth: 5, teeth: 4 }), T.LIN(f, { fill: P.linenW })); // the rolled sleeve, bunched at the elbow (goes with the forearm)
  f.stroke([lp(SF, EF, 0.82, -36), lp(SF, EF, 0.9, 0), lp(SF, EF, 0.84, 36)], 2.2);
  f.bone('hand_f');
  B.hand(f, add(WF, [12, -6]), -0.55, 38, mix(red, redS, 0.1), { spread: 0.2, curl: 0.55, shadow: redS });

  // ---- legs under the gown (hidden in the rest pose, there for the rig), wooden bath clogs
  for (const [Hp, Kn, A, sfx] of [[HF, KF, AF, '_f'], [HN, KN, AN, '_n']]) {
    T.legRig(f, Hp, Kn, A, 88, 120, 86, T.LIN(f, { fill: '#b8ae9e' }), sfx);
    f.bone('foot' + sfx);
    f.part([add(A, [-40, 24]), add(A, [80, 16]), add(A, [112, 40]), add(A, [110, 62, 1]), add(A, [-44, 64, 1])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, k: 0.7 });
    f.part([add(A, [-44, 54, 1]), add(A, [110, 52, 1]), add(A, [112, 70, 1]), add(A, [-46, 70, 1])], { fill: P.woodD, shade: 0.3, inkW: 1.2 });
    f.line([add(A, [-36, 30]), add(A, [90, 26])], 1.4, P.woodL, { op: 0.6 });
  }

  // ---- the gown's skirt: stiff wet linen, flaring to the floor, the hem grey with bath-floor grime and steaming
  f.bone('skirt');
  const hem = gy - 28;
  const skirt = [S.at(-0.7, 0.84), S.at(0.7, 0.82), [640, 900], [686, 1080], [716, hem - 6], [690, hem + 10, 1], [660, hem + 2], [626, hem + 14, 1], [590, hem + 4], [552, hem + 16, 1], [512, hem + 6], [470, hem + 18, 1], [430, hem + 6], [392, hem + 14, 1], [350, hem + 2], [312, hem + 12, 1], [284, hem], [292, 1100], [320, 920]];
  f.part(skirt, T.LIN(f, { maxShade: 60 }));
  // Independent review: the gown below the apron was the largest flat pale area in the world. Now: heavy linen falling in
  // deep tubular folds from the waist gathers, the near knee pushing the cloth forward (she stands on the far leg) with
  // tension folds dragging from it, a wet band soaked up from the floor with a tide line, mud splashed over it and white
  // bath scale crusted on the hem, furnace scorch and a burnt hole, rust run down from the keys, slop marks, a darn.
  const LS = mix(P.linen, P.linenS, 0.55), LL = '#f2eee6';
  f.defs.push(`<clipPath id="skirtc${seed}"><path d="${E.smooth(skirt)}"/></clipPath>`); f.raw(`<g clip-path="url(#skirtc${seed})">`);
  for (const [x0, x1, w] of [[338, 296, 30], [372, 334, 26], [408, 384, 34], [448, 440, 30], [600, 646, 28], [640, 700, 24]]) {
    const top = [x0, 850], bot = [x1, hem + 4], m0 = lerp(top, bot, 0.5);
    f.flat([add(top, [-2, 0]), add(m0, [-w * 0.3, 0]), add(bot, [-w * 0.5, 0]), add(bot, [w * 0.5, 0]), add(m0, [w * 0.3, 0]), add(top, [2, 0])], LS, { op: 0.5 }); // the valley of a fold
    f.stroke([add(top, [6, 10]), add(m0, [w * 0.45, 0]), add(bot, [w * 0.7, -8])], 2.4, LL, { op: 0.55 }); // its lit ridge
    f.stroke([add(top, [0, 20]), add(m0, [-w * 0.1, 0]), add(bot, [-w * 0.15, -10])], 2.2);
  }
  // the near knee forward under the cloth, folds dragging from it down to the back of the hem and up to the hip
  const kn = [452, 1040];
  f.raw(`<ellipse cx="${kn[0] + 10}" cy="${kn[1]}" rx="46" ry="60" fill="${LL}" opacity="0.4" filter="url(#steamblur${seed})"/>`);
  for (const [p0, p1, p2] of [[[476, 1010], [452, 1150], [430, 1320]], [[494, 1080], [486, 1200], [476, 1320]], [[430, 990], [404, 920], [392, 860]]]) f.stroke([p0, p1, p2], 2.6);
  f.flat([[440, 1090], [470, 1100], [452, 1330], [420, 1330]], LS, { op: 0.45 }); // the fold falling from the knee
  f.stroke([[420, 1010], [452, 990], [488, 1004]], 2, LL, { op: 0.7 });
  // the wet band soaked up from the bath floor: darker grey linen up to a wavering tide line, see-through where it clings
  const tide = []; for (let i = 0; i <= 12; i++) { const x = 284 + i * 36; tide.push([x, hem - 150 + Math.sin(i * 1.7) * 16 + (i % 3) * 6]); }
  f.flat([...tide, [716, hem + 10], [284, hem + 10]], '#7a7068', { op: 0.38 });
  f.line(tide, 2.2, '#6a5e58', { op: 0.6 }); f.line(tide.map(q => add(q, [0, -6])), 1.2, '#b8ae9e', { op: 0.5 }); // the tide line, salts dried pale above it
  // mud splashed up from the floor, and white bath scale crusted along the hem
  T.scald(f, [500, hem - 40], 210, 40, 22, { pink: P.mud, pale: '#5a4a44', ang: 1.5 });
  f.spatter([420, hem - 30], 70, 26, P.mud); f.spatter([620, hem - 30], 60, 20, P.mud);
  { const crust = []; for (let i = 0; i <= 18; i++) crust.push([280 + i * 25, hem - 10 - T.R(f, 0, 14) - (i % 3 === 0 ? 10 : 0)]); f.flat([...crust, [730, hem + 30], [270, hem + 30]], '#e2dcd0', { op: 0.6 }); f.line(crust, 1.4, '#8a8076', { op: 0.6 }); for (let i = 0; i < 30; i++) f.flat(ell([T.R(f, 290, 710), hem + T.R(f, -8, 14)], T.R(f, 1.5, 4), T.R(f, 1, 2.5), 0, 6), i % 2 ? '#f6f2ea' : '#9a9086', { op: 0.8 }); } // white bath scale crusted along the hem
  // furnace scorch on the near side, with a burnt hole showing the dark under it
  f.raw(`<ellipse cx="322" cy="1170" rx="34" ry="62" fill="#6a3a1e" opacity="0.4" filter="url(#steamblur${seed})"/>`);
  f.flat(T.lumpy(f, ell([326, 1176], 22, 40, 0.1, 12), 5), '#8a5030', { op: 0.45 });
  f.flat(T.lumpy(f, ell([328, 1186], 9, 13, 0.2, 10), 2), '#1a0e0a'); f.line(ell([328, 1186], 11, 15, 0.2, 10), 1.6, '#3a1e10', { op: 0.9 });
  f.flat(T.lumpy(f, ell([690, 1060], 12, 26, 0, 10), 3), '#8a5030', { op: 0.35 }); // a second, older singe
  // rust run down from the iron keys, a slop of copper-stained water, the old stain, a darn
  for (const x of [346, 362, 380]) f.stroke([[x, 1000], [x + 2, 1060], [x - 1, 1110 + (x % 3) * 12]], 4, '#8a4a2a', { op: 0.35 });
  f.flat(T.lumpy(f, ell([672, 940], 28, 46, 0.2, 12), 6), '#8a8a76', { op: 0.25 }); f.line(ell([672, 940], 28, 46, 0.2, 12).slice(3, 10), 1.2, '#6a6a58', { op: 0.5 });
  f.flat([[300, 1040], [340, 1030], [352, 1080], [306, 1090]], '#b0806a', { op: 0.35 }); // an old stain, washed but there
  f.part([[330, 1150 - 70], [372, 1146 - 70], [374, 1190 - 70], [332, 1194 - 70]], T.LIN(f, { fill: mix(P.linen, '#8a7a6a', 0.3), inkW: 1.1, sharp: true })); // a darn
  f.stitches([[330, 1080], [372, 1076], [374, 1120], [332, 1124], [330, 1080]], P.linenD, 0.9);
  f.raw('</g>');
  for (const x of [330, 470, 610, 690]) T.drip(f, [x, hem + 18], 1.3);
  T.wisp(f, [380, hem - 10], 120, { w: 9, op: 0.3, drift: -20 });
  T.wisp(f, [640, hem - 20], 100, { w: 8, op: 0.25, drift: 16 });

  // ---- the bodice: tall, straight-backed; linen gown, laced front, the chest flat and severe
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.34, 0.36], [0.06, 0.54, 0.62], [0.2, 0.62, 0.8], [0.36, 0.6, 0.82], [0.52, 0.54, 0.66], [0.7, 0.56, 0.58], [0.86, 0.66, 0.66], [0.96, 0.74, 0.72]]);
  f.part(torso, T.LIN(f));
  f.part(S.shape([[0.0, -0.1, 0.3], [0.04, -0.12, 0.46], [0.1, -0.2, 0.52]]), SK({ cast: false })); // throat and collarbone
  f.line([S.at(-0.14, 0.04), S.at(0.2, 0.08), S.at(0.5, 0.04)], 2.4, P.linenD); // stiff collar band
  f.stitches([S.at(-0.12, 0.07), S.at(0.2, 0.11), S.at(0.48, 0.07)], P.linenD, 1);
  for (let i = 0; i < 5; i++) { const v = 0.16 + i * 0.1; f.line([S.at(0.48, v), S.at(0.62, v + 0.05)], 1.6, P.leatherD); f.flat(ell(S.at(0.62, v + 0.05), 3, 3, 0, 6), P.iron); } // front lacing
  f.stroke([S.at(-0.5, 0.3), S.at(-0.4, 0.5), S.at(-0.46, 0.7)], 2.2); f.stroke([S.at(0.2, 0.4), S.at(0.28, 0.6)], 1.8);
  T.scald(f, S.at(0.1, 0.5), 50, 80, 12, { pink: P.linenD, pale: '#f0ece4' }); // damp patches
  for (let i = 0; i < 3; i++) f.stroke([S.at(-0.3 + i * 0.2, 0.62), S.at(-0.2 + i * 0.2, 0.72), S.at(-0.26 + i * 0.2, 0.8)], 1.6); // gathers at the waist
  f.stroke([S.at(0.3, 0.2), S.at(0.5, 0.3)], 1.6);
  // the bodice is no flat field either: steam condensing darker across the back and shoulder, a sweat crescent under the
  // arm, drag folds from the lacing, a copper-green slop down the front, a scorched patch and a mend
  { const tclip = `torc${seed}`; f.defs.push(`<clipPath id="${tclip}"><path d="${E.smooth(torso)}"/></clipPath>`); f.raw(`<g clip-path="url(#${tclip})">`);
    f.raw(`<path d="${E.smooth([S.at(-0.7, 0.05), S.at(-0.2, 0.1), S.at(-0.1, 0.4), S.at(-0.4, 0.62), S.at(-0.75, 0.5)])}" fill="#7a7068" opacity="0.3" filter="url(#steamblur${seed})"/>`);
    f.raw(`<path d="${E.smooth([S.at(0.2, 0.24), S.at(0.42, 0.22), S.at(0.46, 0.38), S.at(0.3, 0.44), S.at(0.16, 0.36)])}" fill="#8a7e70" opacity="0.4" filter="url(#steamblur${seed})"/>`);
    for (const [u0, v0, u1, v1] of [[0.5, 0.2, 0.1, 0.34], [0.52, 0.42, 0.06, 0.5], [0.5, 0.6, 0.0, 0.66], [-0.6, 0.2, -0.3, 0.42]]) f.stroke([S.at(u0, v0), S.at((u0 + u1) / 2, (v0 + v1) / 2 + 0.03), S.at(u1, v1)], 2.2);
    f.stroke([S.at(0.62, 0.26), S.at(0.6, 0.4), S.at(0.64, 0.56)], 5, '#6a8a7a', { op: 0.35 }); // copper-green slop run down the front
    f.raw(`<ellipse cx="${S.at(-0.5, 0.72)[0]}" cy="${S.at(-0.5, 0.72)[1]}" rx="22" ry="30" fill="#6a3a1e" opacity="0.35" filter="url(#steamblur${seed})"/>`);
    f.part([S.at(-0.2, 0.52), S.at(0.0, 0.52), S.at(0.0, 0.62), S.at(-0.2, 0.62)], T.LIN(f, { fill: mix(P.linen, '#8a7a6a', 0.25), inkW: 1, sharp: true, cast: false, maxShade: 4 }));
    f.stitches([S.at(-0.2, 0.52), S.at(0.0, 0.52), S.at(0.0, 0.62), S.at(-0.2, 0.62), S.at(-0.2, 0.52)], P.linenD, 0.8);
    f.raw('</g>'); }
  T.wisp(f, S.at(-0.4, 0.05), 90, { w: 8, op: 0.3, drift: -14 });
  // ---- the work apron: wet waxed linen, darker, tied at the waist, stained and scorched
  f.bone('apron');
  const ap = [S.at(-0.2, 0.86), S.at(0.84, 0.82), [652, 920], [680, 1140], [666, 1160, 1], [640, 1150], [600, 1168, 1], [560, 1156], [520, 1170, 1], [500, 1140], [470, 940]];
  f.part(ap, T.LIN(f, { fill: '#a8a090', shadow: '#3e3836', tex: 'mottle' + seed, texOp: 0.5 }));
  f.stroke([[560, 900], [566, 1040], [552, 1150]], 2.4); f.stroke([[620, 900], [640, 1060]], 2);
  // its weight: the pocket's load drags folds down from the waist tie, the soaked lower half hangs darker and heavier
  for (const [p0, p1] of [[[500, 870], [528, 976]], [[540, 868], [560, 974]], [[610, 880], [580, 976]]]) f.stroke([p0, lerp(p0, p1, 0.5), p1], 2.2, '#3e3836', { op: 0.7 });
  f.flat([[496, 1080], [680, 1070], [684, 1146], [666, 1162], [600, 1170], [520, 1170], [500, 1140]], '#5a5048', { op: 0.35 });
  f.line([[500, 1146], [560, 1150], [620, 1148], [676, 1142]], 3, '#3e3836', { op: 0.5 }); f.stitches([[504, 1138], [676, 1132]], '#d8d0c0', 1);
  f.flat([[560, 980], [610, 970], [620, 1010], [570, 1020]], P.mud, { op: 0.35 });
  for (const [x, y] of [[530, 1060], [596, 1090], [640, 1000]]) { f.flat(ell([x, y], 9, 6, 0.3, 10), '#4a3028', { op: 0.6 }); f.line(ell([x, y], 9, 6, 0.3, 10).slice(2, 7), 0.9, INK, { op: 0.5 }); } // scorch holes
  f.part([[520, 980], [576, 976], [578, 1030], [522, 1034]], T.LIN(f, { fill: '#9a9282', inkW: 1.2, sharp: true })); // a pocket with a lump of pumice
  f.part(T.lumpy(f, ell([548, 974], 18, 12, 0, 10), 3), { fill: '#bcb4a8', shade: 0.4, inkW: 1.1 });
  // ---- belt: a leather girdle with a buckle; the ring of keys and the scrubbing brush hang from it plumb
  f.bone('pelvis');
  f.part([[...S.at(-0.66, 0.8), 1], S.at(0.0, 0.81), [...S.at(0.68, 0.79), 1], [...S.at(0.7, 0.9), 1], S.at(0.0, 0.93), [...S.at(-0.68, 0.91), 1]], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  f.part([S.at(0.38, 0.78), S.at(0.56, 0.78), S.at(0.56, 0.92), S.at(0.38, 0.92)], { fill: P.iron, shade: 0.4, inkW: 1.3, sharp: true });
  f.line([S.at(0.42, 0.8), S.at(0.52, 0.8), S.at(0.52, 0.9), S.at(0.42, 0.9), S.at(0.42, 0.8)], 1.4, P.ironL);
  f.stroke([S.at(0.56, 0.85), S.at(0.64, 0.95), S.at(0.62, 1.04)], 5, P.leatherL); // the strap end hanging from the buckle
  f.stroke([S.at(0.4, 0.88), S.at(0.42, 1.08), S.at(0.38, 1.2)], 6, P.leatherL); // apron tie end
  f.bone('keys');
  const kr = add(S.at(-0.5, 0.94), [0, 40]);
  f.line([S.at(-0.5, 0.9), kr], 3, P.iron);
  { const e = ell(kr, 34, 30, 0, 18); f.line(e.concat([e[0]]), 6, INK); f.line(e.concat([e[0]]), 3.6, P.iron); f.line(e.slice(10, 15), 1.4, P.ironL, { op: 0.8 }); }
  for (let i = 0; i < 6; i++) {
    const a2 = 0.6 + i * 0.36, top = add(kr, [Math.cos(a2) * 32, Math.sin(a2) * 28]), l = 70 + (i % 3) * 16, bot = add(top, [(i - 2.5) * 3, l]);
    f.part(limb(top, bot, 9, 7, { steps: 4 }), { fill: i % 2 ? P.iron : P.bronze, shadow: '#1a1414', shade: 0.4, inkW: 1.1 });
    f.part(ell(add(top, [0, 4]), 10, 8, 0, 10), { fill: i % 2 ? P.iron : P.bronze, shade: 0.4, inkW: 1.1, cast: false });
    f.part([add(bot, [-2, -14]), add(bot, [14, -14]), add(bot, [14, -2]), add(bot, [6, 2]), add(bot, [-2, 0])], { fill: i % 2 ? P.iron : P.bronze, shade: 0.4, inkW: 1, sharp: true, cast: false }); // bit
  }
  T.verdigris(f, add(kr, [0, 60]), 30, 20, 5);
  f.bone('brush');
  const br = S.at(0.12, 0.94);
  T.chainLinks(f, [br, add(br, [6, 70]), add(br, [4, 140])], 7, P.iron);
  const bb = add(br, [4, 150]);
  f.part([add(bb, [-40, -10]), add(bb, [40, -14]), add(bb, [46, 12]), add(bb, [-44, 16])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 12; i++) f.line([add(bb, [-38 + i * 7, 14]), add(bb, [-40 + i * 7, 34])], 2, i % 2 ? '#8a7650' : '#6a5838');
  f.line([add(bb, [-34, -4]), add(bb, [36, -8])], 1.2, P.woodL, { op: 0.6 });

  // ---- the head: hard, flushed, chin up; hair scraped back tight under a linen cap tied under the chin
  f.bone('head');
  f.part(K.chain([add(neck0, [-12, 20]), add(HC, [-40, 56])], [86, 70]), SK());
  f.line([add(neck0, [24, -6]), add(HC, [8, 80])], 1.6, INK, { op: 0.5 }); // neck tendon
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 0.98, chin: 0.0, nose: 1.04, hook: 0.25, mouth: 'grim', squint: 0.42, browDown: 0.05, faceShade: 0.38, jawShade: 0.25, lips: true, lashes: true, age: true, iris: '#2a1a18', eyeWhite: '#e8d8cc', hairCol: '#4a3a30', browCol: '#5a4034', browW: 0.05 });
  f.flat(hF(T.lumpy(f, ell([0.12, 0.12], 0.1, 0.07, 0.2, 10), 0.01)), '#d0503e', { op: 0.22 }); // the permanent flush
  for (let i = 0; i < 5; i++) f.line(hF([[0.06 + i * 0.025, 0.08], [0.08 + i * 0.025, 0.16]]), 0.8, '#a03028', { op: 0.6 }); // broken veins
  f.flat(hF(ell([0.3, 0.1], 0.04, 0.05, 0, 8)), '#c8483a', { op: 0.35 });
  f.line(hF([[0.17, 0.3], [0.24, 0.31], [0.31, 0.3]]), 2.2, '#5a2a24'); // a thin hard mouth
  T.beads(f, hF([[0.12, -0.2]])[0], 30, 8, 5, 1.3);
  // hair scraped back, a tight bun under the cap; the cap of stiff linen, its ties knotted under the jaw
  f.part(hF([[0.22, -0.4], [0.06, -0.5], [-0.2, -0.5], [-0.42, -0.36], [-0.5, -0.06], [-0.44, 0.2], [-0.3, 0.12], [-0.22, -0.18], [-0.02, -0.3], [0.18, -0.32]]), { fill: '#4a3a30', shadow: '#1a1210', tex: 'hatch' + seed, texOp: 0.35, shade: 0.4 });
  for (let i = 0; i < 4; i++) f.line(hF([[0.18 - i * 0.02, -0.36 + i * 0.02], [-0.1 - i * 0.05, -0.42 + i * 0.07]]), 1.1, '#8a7060', { op: 0.6 }); // combed back hard
  const cap = [[0.12, -0.42], [-0.02, -0.58], [-0.3, -0.6], [-0.56, -0.4], [-0.62, -0.06], [-0.52, 0.22], [-0.4, 0.2], [-0.38, -0.06], [-0.24, -0.3], [0.02, -0.4]];
  f.part(hF(cap), T.LIN(f, { fill: '#e2dccf' }));
  f.stitches(hF([[0.08, -0.42], [-0.06, -0.48], [-0.3, -0.5], [-0.5, -0.32]]), P.linenD, 1.2);
  f.stroke(hF([[-0.4, 0.1], [-0.3, 0.4], [-0.12, 0.58], [0.06, 0.6]]), 4, '#d8d0c2'); f.line(hF([[-0.4, 0.1], [-0.3, 0.4], [-0.12, 0.58], [0.06, 0.6]]), 0.9, INK, { op: 0.6 }); // the cap tie
  f.part(hF(ell([0.08, 0.6], 0.05, 0.04, 0, 8)), T.LIN(f, { fill: '#d8d0c2', cast: false, inkW: 1 }));
  f.stroke([hF([[0.1, 0.62]])[0], add(hF([[0.1, 0.62]])[0], [4, 40])], 3.4, '#d8d0c2'); // a tie end, hanging plumb

  // ---- the ladle: hooked butt, long handle bound with rivets, the deep bowl brimming and steaming
  f.bone('ladle');
  f.part(limb(L0, lAt(0.88), 24, 21, { steps: 10 }), T.COP(f, { tex: 'hammer' + seed }));
  f.line([lp(L0, L1, 0.05, -6), lp(L0, L1, 0.86, -5)], 1.6, P.copperL, { op: 0.6 });
  f.part([lp(L0, L1, 0, -10), add(L0, [-24, 2]), add(L0, [-34, 22]), add(L0, [-26, 30]), add(L0, [-16, 16]), lp(L0, L1, 0, 10)], T.COP(f, { cast: false })); // hooked butt for hanging on the rail
  for (const t of [0.2, 0.24, 0.28]) f.line([lp(L0, L1, t, -11), lp(L0, L1, t + 0.01, 11)], 2.4, P.leatherD); // a leather grip wrap below the fist
  T.verdigris(f, lAt(0.5), 10, 30, 5);
  T.dents(f, lAt(0.7), 8, 20, 2);
  // the bowl, seen a little from below (it is above eye level): the round underside, the rim's thin lip, the neck
  const bc = add(L1, [62, 16]), bk = 1.45, B2 = q => add(bc, mul(q, bk)); // independent review: the bowl was small for the handle; now a deep 250 px bowl
  f.part([lAt(0.86), add(lAt(0.92), [6, -4]), B2([-56, -14]), B2([-50, 6]), lp(L0, L1, 0.86, 12)], T.COP(f, { cast: false })); // the neck rising into the bowl
  const bowl = [B2([-86, -26]), B2([-60, -36]), B2([0, -40]), B2([60, -36]), B2([88, -24]), B2([86, 14]), B2([64, 52]), B2([14, 72]), B2([-40, 62]), B2([-76, 30])];
  f.part(T.lumpy(f, bowl, 2), T.COP(f));
  f.part([B2([-88, -26]), B2([-40, -40]), B2([40, -40]), B2([90, -26]), B2([86, -18]), B2([40, -30]), B2([-40, -30]), B2([-86, -18])], T.COP(f, { fill: P.copperL, cast: false, inkW: 1.2 })); // the rolled rim
  f.part(ell(B2([-50, -6]), 9, 7, 0, 8), T.COP(f, { fill: P.copperD, cast: false, inkW: 1 })); // rivet plate where the handle joins
  f.rivet(B2([-52, -8]), 3, P.copperL);
  f.flat([B2([-60, 40]), B2([40, 56]), B2([10, 62]), B2([-40, 54])], P.soot, { op: 0.55 }); // soot from the furnace
  T.dents(f, B2([20, 10]), 40, 20, 3);
  T.verdigris(f, B2([-30, 20]), 30, 18, 6);
  f.line([B2([-70, -14]), B2([-30, 30]), B2([30, 44])], 2, P.copperL, { op: 0.4 });
  // boiling water slopping over the lip and dripping, steam pouring up
  f.stroke([B2([70, -30]), B2([92, -10]), B2([96, 30])], 5, P.water, { op: 0.6 });
  T.drip(f, B2([96, 36]), 1.4); T.drip(f, B2([40, 64]), 1.2); T.drip(f, B2([-20, 60]), 1);
  T.steam(f, B2([0, -40]), 260, 70, { drift: -40, op: 0.62, grow: 1.2, n: 8, curls: 4 });

  // ---- near arm: rolled sleeve over the upper arm, the boiled-red forearm forward to the fist at her hip
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 78, 66, { p: [[0.4, 0.1, 0.2]] }), T.LIN(f));
  f.stroke([lp(SN, EN, 0.2, -10), lp(SN, EN, 0.7, -16)], 1.8);
  for (const t of [0.3, 0.5]) f.stroke([lp(SN, EN, t, 34), lp(SN, EN, t + 0.06, 0), lp(SN, EN, t + 0.02, -34)], 2); // folds round the arm
  f.raw(`<ellipse cx="${lp(SN, EN, 0.45, 10)[0]}" cy="${lp(SN, EN, 0.45, 10)[1]}" rx="22" ry="40" fill="#7a7068" opacity="0.3" filter="url(#steamblur${seed})"/>`); // damp
  f.bone('forearm_n');
  f.part(limb(EN, WN, 60, 48, { q: [[0.3, 0.12, 0.2]] }), RD());
  // the tide line at the elbow: red stops in a blistered, peeling ring
  T.blisters(f, lp(EN, WN, 0.12), 14, 18, 6, 3, 6);
  T.peelSheet(f, lp(EN, WN, 0.2, 24), 14, 36, { sway: 3, bed: false });
  T.wrinkles(f, lp(EN, WN, 0.4), lp(EN, WN, 0.95), 46, 6);
  T.scald(f, lp(EN, WN, 0.6), 50, 14, 8, { pink: P.redL, pale: '#e8a08c', ang: 0.2 });
  f.part(K.ragLimb(f, lerp(SN, EN, 0.62), lerp(SN, EN, 1.1), 86, 88, { depth: 6, teeth: 5 }), T.LIN(f)); // the rolled sleeve, bunched at the elbow
  f.stroke([lp(SN, EN, 0.8, -40), lp(SN, EN, 0.88, 0), lp(SN, EN, 0.82, 40)], 2.4);
  f.stroke([lp(SN, EN, 0.95, -40), lp(SN, EN, 1.02, 0), lp(SN, EN, 0.97, 40)], 2);
  f.bone('hand_n');
  B.grip(f, WN, EN, lA, 42, red, { tex: 'pruned' + seed, texOp: 0.5, shadow: redS, name: 'mistress ladle' });
  // ---- far fingertips curling up over the handle where it lies in her palm
  f.bone('hand_f');
  const tp = lAt(0.41);
  for (let i = 0; i < 3; i++) f.part(limb(add(tp, [-8 + i * 14, 18]), add(tp, [-2 + i * 14, -6]), 15, 12, { steps: 4, capK: 0.9 }), RD({ fill: mix(red, redS, 0.1), inkW: 1.1, cast: false }));
  f.bone('root');
  f.flat(ell([500, gy + 4], 300, 14, 0, 18), '#5a4a4a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ CAULDRON BEARER (elite 2.2)
// A giant furnace porter bent under a yoke. The beam lies across the hump of his back with a copper cauldron hanging
// from each end on chains, both steaming; a boiled arm hangs over the near one's rim. The hunch is in the upper back:
// the spine runs nearly level from the hump to the neck, and the bald, sweating head hangs forward and low on it, eyes
// squeezed half shut against the steam. Legs braced wide, knees bent, feet bound in rags. Each hand steadies the beam.
// Skin boiled red and shiny, mapped with pale splash scars. Sackcloth pad under the beam, leather apron, rope belt.
// Rig: standard humanoid + yoke (parent torso) + pot_n and pot_f (parent yoke, pivot at the hooks) + apron.
// Motion: idle the cauldrons swaying (pot_n, pot_f); attack swinging a cauldron forward and emptying it.
function cauldronBearer() {
  const seed = 302, h = TIERS.elite[1];
  const f = new Fig(T.base(seed, h, { grimeY: 1130 }));
  T.textures(f);
  const gy = f.o.groundY, H = 210;
  const skin = '#c25a42', skinL = '#e08a6c', skinS = '#4a1a1c';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5 }, o);
  // old splash scars: shiny pale runs, each a splash with a tail running down where the water ran
  const scars = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = T.scatter(f, c, rx, ry), r = T.R(f, 4, 9), l = T.R(f, 14, 40), dx = (f.r() - 0.5) * 8; const e = [add(p, [-r, 0]), add(p, [-r * 0.6, -r * 0.8]), add(p, [r * 0.5, -r * 0.9]), add(p, [r, 0]), add(p, [r * 0.3 + dx * 0.5, l * 0.5]), [...add(p, [dx, l]), 1], add(p, [-r * 0.3 + dx * 0.5, l * 0.5])]; f.flat(T.lumpy(f, e, r * 0.3), '#d88a74', { op: 0.4, k: 0.9 }); f.line([add(p, [r * 0.4, -r * 0.5]), add(p, [r * 0.2 + dx * 0.5, l * 0.6])], 1.2, '#fff0e8', { op: 0.45 }); } };
  // independent review: the head jutted ahead of the spine on a long neck. The hump now curls further over and down, the
  // neck base comes lower and further forward out of it, and the head sits close on a short bull neck at its front end.
  const N = [672, 556], C = [500, 404], Pv = [444, 800];
  const S = B.spine(N, C, Pv, H);
  const SN = [604, 516], SF = [682, 494];
  const HN = [410, 812], KN = [326, 1060], AN = [246, 1296];
  const HF = [482, 818], KF = [664, 1056], AF = [664, 1298];
  const hd = E.norm(sub(N, C)), HC = add(N, mul(hd, H * 0.46)), hA = Math.atan2(hd[1], hd[0]) - 0.06;
  // the yoke: a beam across the hump, bowing down a little at the loaded ends
  const YN = [168, 470], YM = [520, 382], YF = [930, 446];
  const yoke = t => t < 0.5 ? lerp(YN, YM, t * 2) : lerp(YM, YF, (t - 0.5) * 2);
  // hands on the beam: near hand outside the near shoulder, far hand beyond the head
  const WN = yoke(0.3), WF = yoke(0.78);
  const [EN] = T.ik(SN, add(WN, [0, 26]), 280, 260, -1), [EF] = T.ik(SF, add(WF, [0, 26]), 250, 240, 1);
  // a heavy porter's arm (independent review: the near upper arm was a flat slab across the torso). Explicit profiles:
  // the deltoid swelling at the top of the outer edge, the biceps belly on the inside of the bend, the triceps behind,
  // the elbow's bony point, the forearm's thick muscle just below the elbow tapering hard to the wrist. A soft shadow
  // where the arm lies over the body separates them; grooves, a vein and a lit edge give the mass.
  const arm = (S0, E0, W0, wU, wF, look, sfx) => {
    const dU = E.norm(sub(E0, S0)), dF = E.norm(sub(W0, E0)), nU = [-dU[1], dU[0]], nF = [-dF[1], dF[0]];
    const inU = (dF[0] * nU[0] + dF[1] * nU[1]) > 0 ? 1 : -1, inF = (dU[0] * nF[0] + dU[1] * nF[1]) < 0 ? 1 : -1;
    const sc = (arr, w) => arr.map(([t, k]) => [t, k * w]);
    const bic = sc([[0, 0.44], [0.2, 0.5], [0.48, 0.58], [0.72, 0.5], [0.9, 0.4], [1, 0.38]], wU), tri = sc([[0, 0.52], [0.12, 0.6], [0.32, 0.56], [0.55, 0.5], [0.8, 0.46], [1, 0.44]], wU);
    const flx = sc([[0, 0.44], [0.16, 0.5], [0.4, 0.44], [0.72, 0.33], [1, 0.3]], wF), ext = sc([[0, 0.5], [0.2, 0.6], [0.42, 0.5], [0.74, 0.36], [1, 0.32]], wF);
    const u = (t, k) => lp(S0, E0, t, k * wU * inU), fa = (t, k) => lp(E0, W0, t, k * wF * inF); // k > 0 toward the inside of the bend
    f.bone('upperarm' + sfx);
    f.raw(`<path d="${E.smooth(T.mlimb(S0, E0, bic, tri).map(q => add(q, [-22, 18])))}" fill="#1a0808" opacity="0.4" filter="url(#steamblur2${seed})"/>`); // its shadow on the body
    { const up = T.mlimb(S0, E0, inU > 0 ? bic : tri, inU > 0 ? tri : bic, { capK: 0.8 }), cid = `uac${seed}${sfx}`;
      f.part(up, Object.assign({}, look, { maxShade: wU * 0.3 }));
      // turn the round mass with soft light along its top and soft shade along its underside, clipped to the arm
      f.defs.push(`<clipPath id="${cid}"><path d="${E.smooth(up)}"/></clipPath>`);
      f.raw(`<g clip-path="url(#${cid})"><path d="${E.smooth([u(0, -0.7), u(0.5, -0.66), u(1, -0.6), u(1, -0.3), u(0.5, -0.32), u(0, -0.36)])}" fill="${skinL}" opacity="0.35" filter="url(#steamblur2${seed})"/><path d="${E.smooth([u(0.1, 0.7), u(0.5, 0.72), u(1, 0.6), u(1, 0.3), u(0.5, 0.36), u(0.1, 0.36)])}" fill="#3a1010" opacity="0.4" filter="url(#steamblur2${seed})"/></g>`); }
    f.stroke([u(0.04, -0.5), u(0.3, -0.36), u(0.44, -0.1)], 3, '#3a1414', { op: 0.6 }); // the deltoid's lower edge
    f.stroke([u(0.4, 0.0), u(0.62, 0.06), u(0.86, 0.02)], 2.6, '#3a1414', { op: 0.5 }); // biceps against triceps
    f.line([u(0.2, -0.46), u(0.5, -0.44), u(0.8, -0.4)], 3, skinL, { op: 0.45 }); f.line([u(0.48, 0.44), u(0.66, 0.4)], 2.4, skinL, { op: 0.4 }); // lit swells
    f.bone('forearm' + sfx);
    f.part(T.mlimb(E0, W0, inF > 0 ? flx : ext, inF > 0 ? ext : flx, { capK: 0.9 }), Object.assign({}, look, { maxShade: wF * 0.28 }));
    f.part(ell(add(E0, mul(E.norm(sub(dU, dF)), wU * 0.36)), wU * 0.16, wU * 0.12, Math.atan2(dU[1], dU[0]), 10), Object.assign({}, look, { cast: false, inkW: 1.2, inkHeavy: 1.6, hatch: false, maxShade: 6, fill: mix(look.fill, skinL, 0.2) })); // the elbow's point
    for (let i = 0; i < 3; i++) f.line([fa(0.02 + i * 0.03, 0.42), fa(0.05 + i * 0.03, 0.1), fa(0.02 + i * 0.03, -0.2)], 1.3, '#3a1414', { op: 0.5 }); // skin creased at the bend
    f.stroke([fa(0.1, -0.1), fa(0.4, -0.06), fa(0.75, -0.02)], 2.4, '#3a1414', { op: 0.45 }); // between the forearm's muscle groups
    f.line([fa(0.2, 0.3), fa(0.45, 0.2), fa(0.6, 0.26), fa(0.85, 0.16)], 2, mix(skin, '#6a5a8a', 0.5), { op: 0.5 }); // a vein
    f.line([fa(0.12, -0.5), fa(0.4, -0.44)], 2.6, skinL, { op: 0.45 });
  };
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.1, 0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('yoke', YM, 'torso').joint('pot_n', YN, 'yoke').joint('pot_f', YF, 'yoke').joint('apron', S.at(0.2, 0.92), 'pelvis');

  // a copper cauldron hanging from a hook by three chains to its bail lugs
  const cauldron = (hook, c, w, hgt, o = {}) => {
    const lugL = add(c, [-w * 0.5, -hgt * 0.42]), lugR = add(c, [w * 0.5, -hgt * 0.42]);
    T.chainLinks(f, [hook, lugL], 8, P.iron); T.chainLinks(f, [hook, lugR], 8, P.iron); T.chainLinks(f, [hook, add(c, [w * 0.12, -hgt * 0.5])], 7, P.iron);
    f.part(ell(hook, 12, 16, 0, 10), { fill: P.iron, shade: 0.4, inkW: 1.4, cast: false }); // the iron hook
    // body: bellied copper, wider than tall, flat-ish bottom, three stubby legs, a rolled rim seen from a little above
    const body = [add(c, [-w * 0.5, -hgt * 0.42]), add(c, [-w * 0.58, -hgt * 0.1]), add(c, [-w * 0.52, hgt * 0.22]), add(c, [-w * 0.34, hgt * 0.44]), add(c, [0, hgt * 0.52]), add(c, [w * 0.34, hgt * 0.44]), add(c, [w * 0.52, hgt * 0.22]), add(c, [w * 0.58, -hgt * 0.1]), add(c, [w * 0.5, -hgt * 0.42])];
    for (const x of [-0.3, 0.04, 0.34]) f.part([add(c, [w * x - 12, hgt * 0.4]), add(c, [w * x + 12, hgt * 0.42]), add(c, [w * x + 8, hgt * 0.62]), add(c, [w * x - 8, hgt * 0.62])], { fill: P.soot, shade: 0.3, inkW: 1.2, cast: false });
    f.part(T.lumpy(f, body, 3), T.COP(f));
    f.flat([add(c, [-w * 0.52, hgt * 0.2]), add(c, [-w * 0.3, hgt * 0.42]), add(c, [0, hgt * 0.5]), add(c, [w * 0.3, hgt * 0.42]), add(c, [w * 0.52, hgt * 0.2]), add(c, [0, hgt * 0.3])], P.soot, { op: 0.65 }); // soot from the furnace
    for (const k of [-0.15, 0.12]) f.line([add(c, [-w * 0.56, hgt * k]), add(c, [0, hgt * (k + 0.06)]), add(c, [w * 0.56, hgt * k])], 2.2, P.copperD, { op: 0.8 }); // riveted seams
    for (let i = 0; i < 9; i++) f.rivet(add(c, [-w * 0.48 + i * w * 0.12, hgt * (-0.15 + 0.06 * Math.sin(i / 8 * Math.PI))]), 3.4, P.copperL);
    T.dents(f, add(c, [w * 0.1, hgt * 0.05]), w * 0.35, hgt * 0.2, 4);
    T.verdigris(f, add(c, [-w * 0.2, -hgt * 0.1]), w * 0.3, hgt * 0.2, 9);
    T.sheen(f, [add(c, [w * 0.4, -hgt * 0.36]), add(c, [w * 0.52, -hgt * 0.16]), add(c, [w * 0.52, 0.0]), add(c, [w * 0.46, hgt * 0.16])], 3, 0.5);
    // rim and the dark boiling water inside it
    const rim = ell(add(c, [0, -hgt * 0.44]), w * 0.52, hgt * 0.1, 0, 20);
    f.part(rim, T.COP(f, { fill: P.copperL, cast: false }));
    f.flat(ell(add(c, [0, -hgt * 0.43]), w * 0.44, hgt * 0.07, 0, 18), '#3a2a24');
    f.flat(ell(add(c, [w * 0.08, -hgt * 0.44]), w * 0.22, hgt * 0.03, 0, 12), '#8a6a5a', { op: 0.6 }); // the boil's surface
    for (const k of [-0.3, 0.2]) f.part(ell(add(c, [w * k, -hgt * 0.46]), 6, 4, 0, 8), { fill: '#c8b8a8', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); // bubbles
    for (const s2 of [lugL, lugR]) f.part(ell(s2, 14, 12, 0, 10), { fill: P.iron, shade: 0.4, inkW: 1.3, cast: false });
    // slopped water running down the side and dripping
    f.stroke([add(c, [w * 0.3, -hgt * 0.4]), add(c, [w * 0.36, -hgt * 0.1]), add(c, [w * 0.32, hgt * 0.2])], 5, P.water, { op: 0.5 });
    T.drip(f, add(c, [w * 0.33, hgt * 0.62]), 1.4);
    T.steam(f, add(c, [0, -hgt * 0.48]), o.steamH || 320, w * 0.24, { drift: o.drift ?? -30, op: 0.62, grow: 1.2, n: 9, curls: 4, phase: o.ph || 0 });
  };

  // ---- the far cauldron, behind everything, hanging from the far end of the beam
  f.bone('pot_f');
  cauldron(YF, [930, 860], 300, 250, { drift: 30, ph: 2 });

  // ---- far arm: up to the beam beyond his head
  arm(SF, EF, WF, 116, 96, SK({ fill: mix(skin, skinS, 0.15) }), '_f');
  f.bone('forearm_f');
  for (const t of [0.7, 0.82]) f.line([lp(EF, WF, t, -42), lp(EF, WF, t + 0.03, 42)], 4, '#9a8462'); // rag wrap at the wrist
  scars(lerp(EF, WF, 0.4), 30, 50, 4);

  // ---- legs: braced wide, knees bent; feet bound in rags
  T.legRig(f, HF, KF, AF, 110, 216, 146, SK({ fill: mix(skin, skinS, 0.15), maxShade: 40 }), '_f', { thigh: 0.18, calf: 0.1 });
  T.legDetail(f, HF, KF, AF, 146, SK({ fill: mix(skin, skinS, 0.15) }), '_f', { calf: 0.14 });
  f.bone('shin_f');
  scars(lerp(KF, AF, 0.4), 40, 80, 6);
  for (let i = 0; i < 4; i++) f.line([add(AF, [-40, -20 + i * 18]), add(AF, [70, -6 + i * 22])], 3.4, '#9a8462', { op: 0.9 });
  T.legRig(f, HN, KN, AN, 112, 224, 150, SK({ maxShade: 40 }), '_n', { thigh: 0.2, calf: 0.12 });
  T.legDetail(f, HN, KN, AN, 150, SK(), '_n', { calf: 0.16 });
  f.bone('shin_n');
  scars(lerp(KN, AN, 0.45), 40, 90, 8);
  T.blisters(f, lp(KN, AN, 0.2, 20), 26, 20, 5, 4, 8);
  T.sheen(f, [lp(KN, AN, 0.1, -60), lp(KN, AN, 0.4, -54), lp(KN, AN, 0.7, -40)], 3, 0.55);
  f.bone('foot_n');
  for (let i = 0; i < 4; i++) f.line([add(AN, [-42, -24 + i * 18]), add(AN, [76, -8 + i * 22])], 3.6, '#9a8462', { op: 0.9 });
  f.stroke([add(AN, [-40, 50]), add(AN, [-70, 64]), add(AN, [-90, 60])], 3, '#9a8462'); // a trailing rag end
  f.bone('thigh_n');
  scars(lerp(HN, KN, 0.5), 50, 60, 5);

  // ---- leather apron and a rope belt
  f.bone('apron');
  const ap = [S.at(-0.6, 0.82), S.at(0.9, 0.78), [620, 900], [640, 1000], [600, 1010, 1], [560, 990], [520, 1010, 1], [470, 980], [420, 1000, 1], [380, 960], [350, 880]];
  f.part(ap, { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  for (const [x, y] of [[470, 930], [560, 900], [420, 960]]) { f.flat(ell([x, y], 12, 8, 0.3, 10), '#1a0e0a', { op: 0.6 }); f.line(ell([x, y], 12, 8, 0.3, 10).slice(2, 7), 1, '#c08a6a', { op: 0.6 }); } // burn holes
  f.stroke([[520, 860], [530, 940], [524, 1000]], 2.2);
  f.bone('pelvis');
  T.rope(f, [S.at(-0.66, 0.8), S.at(0.1, 0.84), S.at(0.9, 0.78)], 12);
  T.rope(f, [S.at(0.2, 0.84), add(S.at(0.2, 0.84), [6, 70]), add(S.at(0.2, 0.84), [2, 120])], 9, '#9a8462', { fray: true });

  // ---- the torso: a great hunched back carrying the beam, belly slung under, chest down toward the floor
  f.bone('torso');
  const torso = S.shape([[-0.12, 0.4, 0.4], [0.0, 0.62, 0.66], [0.14, 0.82, 0.84], [0.3, 0.86, 0.88], [0.46, 0.8, 0.86], [0.62, 0.74, 0.82], [0.76, 0.72, 0.76], [0.88, 0.72, 0.7], [0.98, 0.66, 0.6]]);
  f.part(torso, SK());
  // muscle and fat: shoulder blade, spine furrow, the belly and chest hanging toward the ground
  f.stroke([S.at(-0.5, 0.2), S.at(-0.3, 0.36), S.at(-0.5, 0.5)], 2.6, '#3a1414');
  f.line([S.at(-0.1, 0.12), S.at(-0.15, 0.4), S.at(-0.2, 0.7)], 1.6, '#3a1414', { op: 0.6 });
  f.stroke([S.at(0.6, 0.36), S.at(0.8, 0.44), S.at(0.9, 0.56)], 2.6, '#3a1414');
  f.stroke([S.at(0.5, 0.7), S.at(0.8, 0.76), S.at(0.9, 0.84)], 2.2, '#3a1414');
  scars(S.at(-0.2, 0.4), 120, 100, 9);
  T.blisters(f, S.at(-0.3, 0.6), 50, 40, 8, 4, 9);
  T.seam(f, [S.at(-0.6, 0.5), S.at(-0.5, 0.58), S.at(-0.58, 0.68), S.at(-0.5, 0.78)], 2.6);
  T.beads(f, S.at(0.1, 0.3), 100, 70, 14, 1.6);
  T.sheen(f, [S.at(-0.4, 0.06), S.at(-0.7, 0.2), S.at(-0.84, 0.4), S.at(-0.86, 0.6)], 4, 0.55); // boiled shine on the hump
  T.peelSheet(f, S.at(0.4, 0.8), 26, 70, { sway: 4 });
  // ---- the beam: shaped oak, dark with sweat, iron-shod ends with hooks; a sackcloth pad where it bears
  f.bone('yoke');
  const yt = [], yb = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20, c = yoke(t), w = 34 - 10 * Math.abs(t - 0.5) * 2; yt.push(add(c, [0, -w / 2])); yb.push(add(c, [0, w / 2 + (Math.abs(t - 0.5) < 0.15 ? 8 : 0)])); }
  f.part([...yt, ...yb.reverse()], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line(yt.map(q => add(q, [0, 4])), 1.8, P.woodL, { op: 0.6 });
  for (const t of [0.03, 0.97]) { const c = yoke(t); f.part([add(c, [-18, -22]), add(c, [18, -22]), add(c, [18, 22]), add(c, [-18, 22])], { fill: P.iron, shade: 0.4, inkW: 1.4, sharp: true }); f.rivet(add(c, [0, -10]), 3.4, P.ironL); f.rivet(add(c, [0, 10]), 3.4, P.ironL); }
  const pad = [add(yoke(0.38), [0, -30]), add(yoke(0.62), [0, -30]), add(yoke(0.64), [0, 36]), add(yoke(0.5), [0, 50]), add(yoke(0.36), [0, 38])];
  f.part(pad, { fill: '#8a7a5a', shadow: '#3a2e20', shade: 0.4, tex: 'weave' + seed, texOp: 0.6 });
  f.stitches([add(yoke(0.4), [0, -22]), add(yoke(0.6), [0, -22])], '#c8b890', 1.2);
  for (const t of [0.42, 0.58]) { const c = yoke(t); f.line([add(c, [0, -30]), add(c, [4, 40])], 4, '#5a4632'); } // lashings
  f.flat([add(yoke(0.46), [0, -10]), add(yoke(0.5), [0, -14]), add(yoke(0.52), [0, 6]), add(yoke(0.47), [0, 8])], P.blood, { op: 0.45 }); // where it rubs raw
  T.wisp(f, add(YM, [-80, -20]), 120, { w: 9, op: 0.3, drift: -14 });

  // ---- the head: bald, sweating, hanging forward and low on the line of the spine, eyes squeezed half shut
  f.bone('head');
  f.part(K.chain([S.at(-0.12, 0.04), add(HC, mul(hd, -H * 0.22))], [200, 176]), SK());
  f.stroke([S.at(-0.5, -0.02), add(HC, rot([-H * 0.36, -H * 0.2], hA))], 3, '#3a1414', { op: 0.5 }); // the trapezius rolling up into the back of the skull
  f.stroke([S.at(0.3, 0.08), add(HC, rot([-H * 0.1, H * 0.36], hA))], 2.4, '#3a1414'); // the strained cords of the neck
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.25, chin: 0.02, nose: 1.1, hook: -0.1, mouth: 'snarl', squint: 0.86, browDown: 0.06, faceShade: 0.6, jawShade: 0.45, iris: '#2a1414', eyeWhite: '#d8a898', hairCol: skin, browCol: '#5a2a20', browW: 0.05, age: true });
  f.part(hF([[-0.36, 0.1], [-0.44, -0.18], [-0.34, -0.42], [-0.06, -0.54], [0.2, -0.48], [0.32, -0.3], [0.1, -0.36], [-0.12, -0.36], [-0.26, -0.14], [-0.3, 0.12]]), SK({ fill: mix(skin, skinL, 0.3), cast: false, inkW: 0 })); // the bald dome
  for (let i = 0; i < 4; i++) f.line(hF([[0.02 + i * 0.05, -0.18], [0.07 + i * 0.05, -0.08]]), 1.1, INK, { op: 0.5 }); // squint creases
  f.line(hF([[0.0, -0.26], [0.2, -0.28]]), 1.2, INK, { op: 0.55 }); f.line(hF([[-0.02, -0.32], [0.18, -0.36]]), 1.1, INK, { op: 0.5 });
  T.sheen(f, hF([[-0.3, -0.36], [-0.12, -0.5], [0.08, -0.52], [0.22, -0.44]]), 3, 0.65);
  T.beads(f, hF([[-0.05, -0.32]])[0], 50, 22, 12, 1.5);
  scars(hF([[-0.2, 0.1]])[0], 20, 24, 3);
  T.drip(f, hF([[0.3, 0.56]])[0], 1.3); T.drip(f, hF([[0.1, 0.62]])[0], 1.1); // sweat dripping off the chin

  // ---- far hand on the beam (fingers over it)
  f.bone('hand_f');
  B.grip(f, WF, EF, 0, 50, mix(skin, skinS, 0.15), { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: 'bearer far', maxBend: 40 });
  // ---- near arm: up to the beam outside the near shoulder
  arm(SN, EN, WN, 126, 104, SK(), '_n');
  f.bone('upperarm_n');
  scars(lerp(SN, EN, 0.5), 40, 60, 5);
  T.sheen(f, [lp(SN, EN, 0.2, -60), lp(SN, EN, 0.6, -56)], 3, 0.5);
  f.bone('forearm_n');
  scars(lerp(EN, WN, 0.5), 30, 50, 4);
  for (const t of [0.72, 0.84]) f.line([lp(EN, WN, t, -46), lp(EN, WN, t + 0.03, 46)], 4, '#9a8462');
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.PI, 52, skin, { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: 'bearer near', maxBend: 40 });
  // ---- the near cauldron, in front: a boiled arm hangs over its rim
  f.bone('pot_n');
  const pc = [170, 880];
  cauldron(YN, pc, 300, 250, { drift: -40 });
  const rimP = add(pc, [60, -112]);
  f.part(K.chain([add(rimP, [-30, -6]), add(rimP, [10, 4]), add(rimP, [30, 70]), add(rimP, [26, 150])], [40, 38, 32, 26]), SK({ fill: P.poach, shadow: P.poachS, tex: 'pruned' + seed })); // a boiled forearm over the rim, hanging plumb
  B.hand(f, add(rimP, [24, 172]), 1.6, 26, P.poach, { spread: 0.2, curl: 0.5, shadow: P.poachS });
  T.peelSheet(f, add(rimP, [32, 60]), 14, 40, { sway: 2 });
  f.part(ell(add(pc, [0, -112]), 156, 18, 0, 20).slice(0, 11).concat([add(pc, [-150, -104])]), T.COP(f, { fill: P.copperL, cast: false })); // the rim's front lip over the arm
  // wet floor
  f.bone('root');
  f.flat(ell([480, gy + 4], 420, 16, 0, 18), '#5a4a4a', { op: 0.35 });
  return f;
}

module.exports = {
  heroes: [
    { key: 'simmering_matron', name: 'The Simmering Matron', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: simmeringMatron },
    { key: 'bath_mistress', name: 'The Bath-Mistress', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: bathMistress },
    { key: 'cauldron_bearer', name: 'Cauldron Bearer', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: cauldronBearer },
    { key: 'scalded_attendant', name: 'Scalded Attendant', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: scaldedAttendant },
    { key: 'kettle_crab', name: 'Kettle Crab', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: kettleCrab },
    { key: 'bath_leech', name: 'Bath Leech', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: bathLeech },
    { key: 'steam_nymph', name: 'Steam Nymph', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: steamNymph },
    { key: 'boiled_brute', name: 'Boiled Brute', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: boiledBrute },
  ],
};
