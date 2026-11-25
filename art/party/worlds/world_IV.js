// World IV, The Sulphur Pits (Fire + Toxin, Combust). Brimstone mines that supplied the world's powder; the air itself
// became fuel and every poison is a fuse. Fire (dominant) chars and cracks skin with glowing seams; toxin swells it with
// gas sacs, yellow crust and ripening blisters. Miners, overseers, priests and the vermin of the galleries.
// Palette: sulphur yellow, ochre smoke, lamp orange, plus ink black, bone and grey.
// Foes face left: every figure is drawn facing right with kit.foeBase (light from the upper right) and flipped.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
'use strict';
const K = require('../kit');
const W = require('./kit_IV');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, ang, elb } = W;
const D = 180 / Math.PI;

// ------------------------------------------------------------------ GAS-LUNG MINER (cast, human 1.0)
// A pit miner bent by years in low tunnels: the hunch is in the upper back, the head carried forward on the neck. His
// chest has swollen like a bellows, the ribs bowed out under stretched, sooty skin that has cracked open in glowing
// seams; yellow gas seeps from them and curls up toward the lamp on his cap. The shirt hangs open off the swollen chest
// with its buttons torn away. The pick hangs from the near fist, low and forward, the head at shin height.
// Rig: standard humanoid + pick (parent hand_n). Motion: idle wheezing (torso and head); attack a pick swing.
function gasLungMiner() {
  const seed = 404, h = TIERS.human[1];
  const f = new Fig(W.base(seed, h, { grimeY: 590 }));
  W.textures(f);
  const H = 98, gy = f.o.groundY;
  const skin = mix(P.skin, P.soot, 0.22), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin }, o));
  const shirt = '#6c624e', shirtD = '#4a4234', trou = '#4e4636', trouD = '#3a3428';
  const Pv = [270, 500], Tj = [276, 478], neck0 = [318, 292], HC = [366, 246], hA = 0.2;
  const SN = [292, 338], EN = [302, 430], WN = [298, 512];
  const SF = [330, 326], EF = [354, 420], WF = [428, 394];
  const HN = [290, 516], KN = [332, 626], AN = [304, 748];
  const HF = [254, 512], KF = [246, 626], AF = [196, 746];
  W.humanJoints(f, { P: Pv, T: Tj, N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the pick: haft from the butt behind the fist, down and forward (25 deg) to the head at shin height
  const pA = 0.44, pd = [Math.cos(pA), Math.sin(pA)], butt = add(WN, mul(pd, -34)), pHead = add(WN, mul(pd, 268)), gripC = WN;
  f.joint('pick', gripC, 'hand_n');

  // ---- far arm, behind the chest; only its hand shows, spread on the front of the swollen ribs (drawn later)
  W.armRig(f, SF, EF, WF, [42, 36, 30], SKN({ fill: mix(skin, P.soot, 0.3) }), '_f');
  f.bone('upperarm_f');
  f.part(K.ragLimb(f, SF, lerp(SF, EF, 0.62), 54, 48, { depth: 9, teeth: 5 }), { fill: shirtD, shadow: '#2a2620', tex: 'weave' + seed, texOp: 0.5 });

  // ---- far leg: trousers tied below the knee with string ("yorks"), hobnailed boot
  const cuF = lerp(KF, AF, 0.4);
  W.legTube(f, HF, KF, cuF, [70, 54, 48], W.CAN(f, { fill: trouD }), '_f', { A: AF });
  f.bone('shin_f');
  f.part(limb(cuF, AF, 44, 34, { steps: 6 }), W.CAN(f, { fill: mix(trouD, '#000', 0.1) }));
  W.bootRig(f, KF, AF, 52, '#2a231d', '_f', { tex: 'mottle' + seed, shaft: 0.62, toe: 1.15 });
  f.bone('shin_f');
  W.rope(f, [lp(KF, AF, 0.36, -24), lp(KF, AF, 0.39, 0), lp(KF, AF, 0.37, 24)], 2.4, { col: '#6e5e40' });

  // ---- torso: hump high on the upper back, the chest swollen out like a bellows, the belly hanging under it
  f.bone('torso');
  const TOR = [[352, 292], [388, 304], [422, 328], [444, 362], [450, 400], [440, 432], [424, 448, 1], [408, 462], [398, 488], [352, 512], [290, 520], [248, 512], [234, 486], [240, 456], [240, 420], [232, 380], [228, 344], [236, 312], [254, 292], [282, 278], [312, 274], [336, 282]];
  f.part(TOR, SKN({ shade: 0.3, maxShade: 34 }));
  f.raw(`<path d="${E.smooth(TOR)}" fill="url(#soot${seed})" opacity="0.75"/>`);
  // pectoral and armpit: the chest is a mass, not a disc
  f.flat([[318, 300], [352, 300], [388, 318], [402, 344], [380, 352], [340, 340], [314, 326]], mix(skin, '#fff2d8', 0.25), { op: 0.35 });
  f.flat([[300, 330], [318, 336], [314, 380], [298, 372]], P.skinS, { op: 0.4 });
  // ribs bowed outward like the boards of a bellows: raised bands with dark grooves between, skin stretched shiny
  const ribs = [];
  for (let i = 0; i < 6; i++) {
    const y0 = 318 + i * 23, bow = Math.sin((i + 0.8) / 6.5 * Math.PI);
    ribs.push([[316, y0 - 12], [364 + bow * 10, y0 - 3], [408 + bow * 18, y0 + 15 + i * 1.5], [424 + bow * 14, y0 + 38 + i * 1.5]]);
  }
  W.clipDraw(f, TOR, () => {
    for (const rb of ribs) f.stroke(rb.map(q => add(q, [0, 10])), 4, mix(skin, P.sootD, 0.5), { op: 0.28 });
    for (const rb of ribs) {
      f.part(K.chain(rb, [6, 12, 12, 6], { steps: 6 }), { fill: mix(skin, '#e0c8a6', 0.15), shadow: mix(skin, P.skinS, 0.4), shade: 0.4, inkW: 0, inkHeavy: 0.9, cast: false, hatch: false, tex: 'mottle' + seed, texOp: 0.4, gritOp: 0.3 });
      f.line(rb.slice(0, 3).map(q => add(q, [2, -4])), 1.4, mix(skin, '#fff2d8', 0.6), { op: 0.6 });
    }
  });
  f.line([[360, 300], [394, 330], [410, 372], [408, 420], [394, 452]], 1.4, INK, { op: 0.4 }); // sternum
  f.flat([[428, 348], [438, 370], [436, 392], [430, 372]], '#fff6dc', { op: 0.3 }); // stretched sheen
  // the underside of the ribcage throws a shadow on the belly; hatch the lower flank
  f.flat([[330, 452], [372, 456], [410, 462], [426, 448], [402, 474], [360, 474], [326, 466]], P.skinS, { op: 0.55 });
  for (let i = 0; i < 7; i++) f.line([[318 + i * 6, 420 + i * 2], [326 + i * 6, 446 + i * 2]], 1, INK, { op: 0.35 });
  // the skin split open between the ribs: jagged glowing seams, gas seeping, blisters ripening around them
  W.seam(f, [[376, 334], [388, 337], [396, 344], [410, 347], [418, 358], [432, 366]], 2.4);
  W.seam(f, [[396, 344], [400, 336], [408, 332]], 1.3, { glow: false });
  W.seam(f, [[348, 382], [362, 384], [374, 392], [390, 392], [402, 402], [418, 405], [430, 416]], 2.3);
  W.seam(f, [[390, 392], [394, 382], [402, 378]], 1.2, { glow: false });
  W.seam(f, [[386, 432], [396, 436], [404, 446], [414, 450]], 1.8);
  W.hairline(f, [[334, 352], [346, 356], [354, 352], [366, 356]], 1.2);
  W.flakes(f, [404, 380], 20, 30, 5, 0.6);
  W.blisters(f, [406, 462], 12, 8, 3, 2.5, 4.5);
  W.blisters(f, [362, 322], 12, 8, 3, 2, 4);
  W.beads(f, [420, 398], 12, 30, 4, 0.7);
  // belly hanging under the ribs: a fold, the navel, hair, soot in the creases
  f.stroke([[356, 472], [380, 478], [398, 474]], 2.6, mix(skin, '#000', 0.55));
  f.line([[378, 486], [381, 492]], 1.8, INK, { op: 0.7 });
  for (let i = 0; i < 7; i++) f.line([[368 + i * 4, 480 + (i % 2) * 6], [366 + i * 4, 486 + (i % 2) * 6]], 0.8, '#1a1410', { op: 0.6 });

  // ---- shirt: hanging open off the shoulders, pushed aside by the chest; buttons torn away, hem in tatters
  const SHI = [[338, 282], [310, 272], [278, 276], [250, 290], [230, 312], [222, 344], [226, 380], [234, 420], [234, 456], [228, 488], [230, 516], [240, 526], [246, 510, 1], [262, 532], [276, 516, 1], [292, 530], [306, 514, 1], [316, 520], [316, 492], [318, 450], [322, 404], [328, 360], [334, 322], [342, 296]];
  f.part(SHI, { fill: shirt, shadow: '#3a342a', shade: 0.38, tex: 'weave' + seed, texOp: 0.5 });
  f.raw(`<path d="${E.smooth(SHI)}" fill="url(#soot${seed})" opacity="0.55"/>`);
  for (const pts of [[[246, 320], [238, 380], [248, 470]], [[272, 300], [264, 380], [270, 470]], [[300, 330], [300, 400], [296, 470]]]) f.stroke(pts, 2.2, mix(shirt, '#000', 0.55));
  f.part([[246, 404], [272, 402], [274, 440], [246, 442]].map(q => [...q, 1]), { fill: mix(shirt, P.och, 0.4), shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'weave' + seed }); // patch
  f.stitches([[246, 404], [272, 402], [274, 440], [246, 442], [246, 404]], '#c8b890', 0.8);
  f.part([[244, 468], [254, 464], [258, 484], [246, 488]], { fill: '#2a2018', shade: 0.3, inkW: 1, cast: false }); // a burn hole
  f.line([[244, 468], [254, 464], [258, 484], [246, 488], [244, 468]], 1.6, P.ember, { op: 0.7 });
  // the open front edge: torn buttonholes, one button hanging on its thread
  f.line([[342, 296], [334, 322], [328, 360], [322, 404], [318, 450], [316, 492]], 1.8, INK);
  f.line([[337, 300], [329, 330], [323, 370], [318, 412], [314, 456]], 1.2, mix(shirt, '#fff', 0.3), { op: 0.5 });
  for (let i = 0; i < 4; i++) f.flat(ell([330 - i * 3.5, 330 + i * 40], 1.6, 4.5, 0.1, 6), '#1a1410');
  f.line([[326, 372], [334, 380], [336, 392]], 0.8, '#c8b890'); f.part(ell([336, 395], 3.8, 3.8, 0, 8), { fill: P.boneD, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
  // collar and a sweat-dark kerchief knotted at the throat
  f.part([[296, 270], [338, 276], [356, 290], [348, 302], [316, 292], [290, 288]], { fill: P.och, shadow: P.ochD, shade: 0.42, tex: 'weave' + seed, texOp: 0.45 });
  f.part([[346, 294], [358, 296], [366, 316], [358, 324], [350, 308]], { fill: mix(P.och, '#000', 0.15), shade: 0.42, inkW: 1.1, cast: false });
  f.part(ell([350, 298], 7, 6, 0, 8), { fill: mix(P.och, '#000', 0.25), shade: 0.4, inkW: 1, cast: false });
  W.crust(f, [256, 314], 16, 8, 4, 4, 7, { spikes: 0.4 }); // sulphur dust caked on the hump

  // ---- pelvis: trousers seat, belt with the tally token and a snuff tin
  f.bone('pelvis');
  f.part([[232, 486], [300, 496], [372, 488], [388, 502], [382, 534], [344, 552], [282, 556], [240, 546], [226, 522]], W.CAN(f, { fill: trou }));
  f.part([[230, 486], [300, 494], [384, 486], [388, 500], [300, 508], [228, 500]], W.LEA(f, { k: 0.5 }));
  f.line([[238, 494], [296, 500]], 0.8, P.leathL, { dash: '2 3', op: 0.7 });
  f.part([[344, 486], [362, 485], [363, 503], [345, 504]].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1.1, cast: false });
  f.line([[363, 494], [380, 492]], 4, P.leathD); // strap end
  const tk = [316, 506]; f.line(ell(tk, 3, 3, 0, 8).concat([ell(tk, 3, 3, 0, 8)[0]]), 1.2, P.iron);
  f.part(ell(add(tk, [0, 11]), 8, 9, 0.1, 10), { fill: P.brass, shadow: P.brassD, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false });
  f.line([add(tk, [-3, 8]), add(tk, [-3, 14])], 1, INK, { op: 0.7 }); f.line([add(tk, [1, 8]), add(tk, [3, 14])], 1, INK, { op: 0.7 }); // stamped number
  f.part([[236, 498], [266, 500], [266, 530], [236, 528]], W.LEA(f, { fill: P.leathL, sharp: true })); // snuff pouch
  f.part([[234, 496], [268, 498], [266, 510], [234, 508]], W.LEA(f, { inkW: 1.2 }));
  f.rivet([251, 506], 2.2, P.brass);

  // ---- near leg: trouser tube to the string tie, the shin, the boot
  const cuN = lerp(KN, AN, 0.4);
  W.legTube(f, HN, KN, cuN, [74, 58, 52], W.CAN(f, { fill: trou }), '_n', { A: AN, bq: [[0, 0.4, 0.12]] });
  f.bone('thigh_n');
  f.stroke([lp(HN, KN, 0.5, 20), lp(HN, KN, 0.7, 4), lp(HN, KN, 0.8, -18)], 2);
  f.part([lp(HN, KN, 0.35, -24), lp(HN, KN, 0.32, 6), lp(HN, KN, 0.58, 8), lp(HN, KN, 0.6, -22)].map(q => [...q, 1]), { fill: mix(trou, P.och, 0.3), shade: 0.4, tex: 'weave' + seed, inkW: 1.1, inkHeavy: 1.4, cast: false }); // patch
  f.stitches([lp(HN, KN, 0.35, -24), lp(HN, KN, 0.32, 6), lp(HN, KN, 0.58, 8), lp(HN, KN, 0.6, -22), lp(HN, KN, 0.35, -24)], '#b8a880', 0.8);
  f.bone('shin_n');
  f.part(limb(cuN, AN, 48, 36, { steps: 6 }), W.CAN(f, { fill: mix(trou, '#000', 0.08) }));
  f.stroke([lp(KN, cuN, 0.2, -20), lp(KN, cuN, 0.4, 0), lp(KN, cuN, 0.3, 22)], 2); // knee bag
  W.bootRig(f, KN, AN, 54, '#362d24', '_n', { tex: 'mottle' + seed, shaft: 0.62, toe: 1.15, strap: true });
  f.bone('shin_n');
  W.rope(f, [lp(KN, AN, 0.38, -26), lp(KN, AN, 0.41, 0), lp(KN, AN, 0.39, 26)], 2.4, { col: '#8a7a56' });
  f.line([lp(KN, AN, 0.41, 4), lp(KN, AN, 0.5, 10), lp(KN, AN, 0.54, 6)], 1.6, '#8a7a56');
  f.bone('foot_n');
  for (let i = 0; i < 5; i++) f.flat(ell([AN[0] - 14 + i * 13, gy - 2], 1.6, 1.4, 0, 6), '#8a8478', { op: 0.9 }); // hobnails

  // ---- head: carried forward out of the hump on the neck; sooty face, yellowed eyes, mouth open on a wet cough
  f.bone('head');
  f.part(limb(neck0, add(HC, [-16, 24]), 48, 42, { p: [[0.5, 0.1, 0.25]] }), SKN());
  f.line([[328, 296], [344, 276]], 1.4, mix(skin, '#000', 0.5), { op: 0.6 }); // neck cord
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: mix(skin, '#c8a888', 0.15), jaw: 1.12, chin: 0.0, nose: 1.08, hook: 0.3, mouth: 'set', squint: 0.25, browDown: 0.05, age: true, gaunt: true,
    eyeWhite: '#c4ae5a', iris: '#2a1a10', hairCol: '#2a2420', beard: 'stubble', beardCol: '#1e1a16', faceShade: 1, jawShade: 0.55,
    hair: [[-0.42, -0.06], [-0.4, -0.3], [-0.3, -0.36], [-0.24, -0.1], [-0.3, 0.08]],
  });
  f.raw(`<path d="${E.smooth(hF([[-0.38, -0.4], [0.3, -0.48], [0.4, 0.2], [0.3, 0.52], [-0.2, 0.4], [-0.4, 0.0]]))}" fill="url(#soot${seed})" opacity="0.6"/>`);
  f.flat(hF([[0.06, -0.02], [0.2, 0.0], [0.24, 0.06], [0.1, 0.05]]), '#c4ae5a', { op: 0.35 }); // yellowed lower lid
  // the open coughing mouth: dark, wet, a string of spittle
  f.flat(hF([[0.18, 0.25], [0.26, 0.235], [0.33, 0.25], [0.32, 0.34], [0.25, 0.37], [0.19, 0.33]]), '#3a2418');
  f.flat(hF([[0.2, 0.27], [0.26, 0.26], [0.31, 0.27], [0.3, 0.32], [0.25, 0.345], [0.21, 0.31]]), '#0c0806');
  f.flat(hF([[0.22, 0.262], [0.27, 0.255], [0.28, 0.27], [0.23, 0.275]]), P.boneD, { op: 0.9 }); // teeth
  const sp = hF([[0.27, 0.36]])[0]; f.line([sp, add(sp, [2, 10]), add(sp, [0, 20])], 1.4, '#d8d0a0', { op: 0.75 }); W.drip(f, add(sp, [0, 20]), 0.6, '#d8d0a0');
  // leather cap: a skull cap with a short brim, stitched, scorched
  const cap = [[-0.46, 0.08], [-0.48, -0.18], [-0.38, -0.42], [-0.1, -0.58], [0.2, -0.56], [0.36, -0.44], [0.46, -0.32], [0.62, -0.3], [0.62, -0.24], [0.36, -0.22], [0.0, -0.24], [-0.3, -0.12], [-0.38, 0.12]];
  f.part(hF(cap), W.LEA(f, { fill: '#3e3020', shade: 0.42 }));
  f.line(hF([[-0.42, -0.16], [-0.2, -0.3], [0.1, -0.36], [0.36, -0.3]]), 1, P.leathL, { dash: '2 2.5', op: 0.7 });
  f.line(hF([[-0.1, -0.56], [-0.05, -0.34]]), 1.2, INK, { op: 0.6 });
  f.flat(hF([[0.36, -0.24], [0.62, -0.26], [0.6, -0.235], [0.36, -0.215]]), '#120c08', { op: 0.6 }); // brim shadow
  W.flakes(f, hF([[-0.2, -0.45]])[0], 14, 6, 3, 0.7);
  // candle stub stuck in the band, burnt down
  f.part(hF([[-0.3, -0.5], [-0.22, -0.52], [-0.2, -0.66], [-0.28, -0.66]]), { fill: '#d8ccaa', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false });
  f.line(hF([[-0.25, -0.66], [-0.25, -0.71]]), 1.4, INK);
  // tally lamp: an iron pot with a long spout and a small wick flame, hooked into the cap
  const lp0 = hF([[0.26, -0.58]])[0], LF = frame(lp0, 0, 1);
  f.line([hF([[0.3, -0.44]])[0], add(lp0, [-2, 8])], 3, P.iron);
  f.part(LF([[-12, 4], [-12, -10], [-6, -16], [6, -16], [12, -10], [12, 4], [6, 8], [-6, 8]]), { fill: P.ironL, shadow: '#1a1614', shade: 0.42, inkW: 1.2, inkHeavy: 1.8, cast: false });
  f.part(LF([[-7, -16], [7, -16], [4, -22], [-4, -22]]), { fill: P.iron, shade: 0.4, inkW: 1, cast: false });
  f.part(LF([[10, -6], [28, -16], [32, -14], [30, -10], [12, 0]]), { fill: P.iron, shadow: '#1a1614', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false }); // spout
  const wick = LF([[31, -17]])[0];
  W.glow(f, add(wick, [0, -6]), 26, 22, P.lampL, 0.4);
  f.flat([add(wick, [-3, 1]), add(wick, [3, 1]), add(wick, [2, -6]), add(wick, [0, -13]), add(wick, [-2, -6])], P.lamp, { op: 0.95 });
  f.flat([add(wick, [-1.4, 0]), add(wick, [1.4, 0]), add(wick, [0, -7])], P.core);
  f.line([add(wick, [0, -14]), add(wick, [-3, -22]), add(wick, [1, -30])], 1, P.sootD, { op: 0.6 }); // soot thread
  f.scratches(lp0, 6, 3, '#a09a90', 0.8);

  // ---- far hand spread on the front of the swollen ribs (its arm is hidden behind the chest)
  f.bone('hand_f');
  B.hand(f, [432, 404], 1.95, 23, mix(skin, P.soot, 0.25), { spread: 0.3, curl: 0.6, shadow: P.skinS });

  // ---- the gas: yellow wisps seeping from the seams, curling up past the face toward the lamp
  f.bone('torso');
  W.smoke(f, [432, 372], 160, 30, { sway: 12, drift: 6, phase: 0.4, col: '#b09650', op: 0.42 });
  W.smoke(f, [440, 412], 100, 22, { sway: -10, drift: 24, phase: 2, col: '#b09650', op: 0.36 });
  W.smoke(f, [414, 342], 90, 18, { sway: 8, drift: -4, phase: 1, col: '#bca25a', op: 0.38 });

  // ---- near arm: torn sleeve over a sooty arm, the fist low on the pick
  W.armRig(f, SN, EN, WN, [52, 42, 34], SKN(), '_n', { bp: [[0, 0.45, 0.14]] });
  f.bone('forearm_n');
  W.blisters(f, lp(EN, WN, 0.5, 4), 8, 12, 3, 2, 4);
  f.raw(`<path d="${E.smooth(K.chain([EN, WN], [42, 34]))}" fill="url(#soot${seed})" opacity="0.7"/>`);
  f.line([lp(EN, WN, 0.2, -8), lp(EN, WN, 0.5, -12), lp(EN, WN, 0.8, -8)], 1, '#5a4a6a', { op: 0.5 }); // vein
  W.seam(f, [lp(EN, WN, 0.3, 6), lp(EN, WN, 0.45, 10), lp(EN, WN, 0.6, 8)], 1.4);
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [0, -8]), lerp(SN, EN, 0.74), 64, 56, { depth: 11, teeth: 6, p: [[0.4, 0.1, 0.2]] }), { fill: shirt, shadow: '#3a342a', shade: 0.38, tex: 'weave' + seed, texOp: 0.5 });
  f.stroke([lp(SN, EN, 0.2, -16), lp(SN, EN, 0.45, -8), lp(SN, EN, 0.62, -14)], 2, mix(shirt, '#000', 0.5));
  f.line([lp(SN, EN, 0.66, 26), lp(SN, EN, 0.8, 20), lp(SN, EN, 0.9, 26)], 1.2, shirtD);
  // the pick: ash haft with a twine-wrapped grip, iron head with a wedge, both points worn, one chipped
  f.bone('pick');
  f.part(limb(butt, pHead, 16, 18, { steps: 8, capK: 0.6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(butt, pHead, 0.03, -4), lp(butt, pHead, 0.97, -4)], 1, P.woodL, { op: 0.6, straight: true });
  for (let i = 0; i < 7; i++) f.line([lp(butt, pHead, 0.02 + i * 0.026, -8), lp(butt, pHead, 0.04 + i * 0.026, 8)], 1.6, '#2a1e14', { straight: true });
  for (const t of [0.5, 0.66, 0.7]) f.line([lp(butt, pHead, t, -7), lp(butt, pHead, t + 0.01, 7)], 1, INK, { op: 0.5, straight: true }); // nicks
  const PF = frame(pHead, pA, 1); // local x along the haft toward the head, y across it
  const IRON = { fill: P.ironL, shadow: '#14110f', shade: 0.42, inkW: 1.4, inkHeavy: 2.2, cast: false, tex: 'mottle' + seed, texOp: 0.6 };
  f.part(K.chain(PF([[4, -8], [-4, -40], [-18, -70], [-36, -94]]), [24, 18, 11, 3]), IRON); // upper point, curved back toward the hand
  f.part(K.chain(PF([[4, 8], [-4, 40], [-16, 64], [-26, 78]]), [24, 18, 12, 6]), IRON); // lower point, chipped short
  f.flat(PF([[-24, 76], [-30, 80], [-28, 84]]), '#14110f');
  f.part(PF([[-14, -15], [14, -15], [18, -6], [18, 6], [14, 15], [-14, 15], [-18, 0]]), Object.assign({}, IRON, { inkW: 1.3 })); // eye
  f.part(PF([[16, -6], [24, -6], [24, 6], [16, 6]]), { fill: P.wood, shade: 0.4, inkW: 1, cast: false }); // haft end through the eye
  f.line(PF([[20, -4], [20, 4]]), 1.8, P.iron); // wedge
  f.line(PF([[-2, -30], [-12, -58], [-28, -84]]), 1.4, '#b8b0a2', { op: 0.65 }); f.line(PF([[-2, 30], [-10, 54]]), 1.2, '#b8b0a2', { op: 0.5 });
  f.flat(PF([[-10, -16], [6, -15], [2, -30], [-8, -28]]), P.rust, { op: 0.55 });
  W.crust(f, PF([[-6, 30]])[0], 6, 6, 2, 2.5, 4, { spikes: 0 });
  f.bone('hand_n');
  B.grip(f, gripC, EN, pA, 26, mix(skin, P.soot, 0.2), { tex: 'mottle' + seed, texOp: 0.5, shadow: P.skinS, name: 'miner pick' });
  f.raw(`<circle cx="${gripC[0]}" cy="${gripC[1]}" r="20" fill="url(#soot${seed})" opacity="0.6"/>`);

  // ---- ground: sulphur dust and soot underfoot (on no bone)
  f.bone('root');
  f.flat(ell([270, gy + 2], 200, 7, 0, 20), '#3a3020', { op: 0.5 });
  W.crust(f, [460, gy - 4], 30, 4, 4, 3, 6, { spikes: 0.2 });
  return f;
}

// ------------------------------------------------------------------ CANARY PRIEST (cast, human 0.95)
// The mine's chaplain. He stands braced with his chest out, singing, the far arm raised to hold up a brass birdcage on its
// chain like a censer, at the height of his face; a dead canary lies on its back inside. His near hand holds his closed
// psalter against his belly. A soot-stained grey surplice over a miner's leather jerkin; yellow feathers have sprouted
// from his cuffs and his collar (the toxin ripening in him); the hem is charred, and a glowing split has opened at his
// throat where the song comes out. The raised arm passes behind his head, so nothing crosses his face.
// Rig: standard humanoid + cage (parent hand_f, pivot at the fist: it swings like a censer) + book (parent hand_n) +
// skirt (surplice below the cincture, parent pelvis) + stole (parent torso).
// Motion: idle swinging the cage (cage bone); attack a hymn that ignites the gas (head back, cage swung up).
function canaryPriest() {
  const seed = 408, h = TIERS.human[1];
  const f = new Fig(W.base(seed, h, { grimeY: 600 }));
  W.textures(f);
  const H = 94, gy = f.o.groundY;
  const canary = '#d2b034', canD = '#8a6c1a', canL = '#ecd884';
  const surp = '#7a766c', surpD = '#56524a', surpL = '#a8a294', jerk = P.leath;
  const skin = mix(P.skin, '#c8b090', 0.2), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin }, o));
  const N = [300, 300], C = [304, 386], Pv = [268, 470];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.08, -0.04), HC = [320, 236], hA = -0.12;
  const SN = [292, 330], EN = [272, 420], WN = [326, 448];
  const SF = [320, 318], EF = [372, 222], WF = [460, 160];
  const HN = [276, 482], KN = [304, 618], AN = [310, 748];
  const HF = [248, 478], KF = [238, 616], AF = [200, 746];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const fist = WF, cageTop = add(fist, [2, 32]);
  f.joint('cage', add(fist, [0, 6]), 'hand_f').joint('book', WN, 'hand_n').joint('skirt', S.at(0, 0.84), 'pelvis').joint('stole', S.at(0.4, 0.06), 'torso');

  // ---- far arm raised behind the head: wide surplice sleeve falling back from the forearm, feathers at the cuff
  W.armRig(f, SF, EF, WF, [40, 34, 28], SKN({ fill: mix(skin, P.soot, 0.25) }), '_f', { muscle: false });
  f.bone('upperarm_f');
  f.part(K.chain([SF, lerp(SF, EF, 0.6), add(EF, [6, 14])], [62, 66, 70]), { fill: surpD, shadow: '#36332e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.bone('forearm_f');
  // the bell of the sleeve hangs plumb from the forearm (down, not along the arm)
  const sl0 = lp(EF, WF, 0.15, 0), sl1 = lp(EF, WF, 0.55, 0);
  f.part([add(sl0, [-8, -16]), add(sl1, [0, -14]), add(sl1, [10, 12]), add(sl1, [-2, 52]), [...add(sl0, [-6, 74]), 1], add(sl0, [-22, 58]), add(sl0, [-24, 20])], { fill: surpD, shadow: '#36332e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.line([add(sl0, [-14, 20]), add(sl0, [-12, 60])], 1.2, INK, { op: 0.5 });
  W.flakes(f, add(sl0, [-10, 60]), 8, 6, 2, 0.6);
  // feathers sprouting from the cuff
  const feather = (b0, a, L, w, col = canary) => { const d = rot([1, 0], a), n = [-d[1], d[0]], tip = add(b0, mul(d, L)); f.part([b0, add(add(b0, mul(d, L * 0.35)), mul(n, w * 0.6)), add(add(b0, mul(d, L * 0.8)), mul(n, w * 0.4)), [...tip, 1], add(add(b0, mul(d, L * 0.75)), mul(n, -w * 0.5)), add(add(b0, mul(d, L * 0.3)), mul(n, -w * 0.5))], { fill: col, shadow: canD, light: canL, shade: 0.45, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, gritOp: 0.25 }); f.line([b0, lerp(b0, tip, 0.9)], 0.8, mix(col, '#000', 0.4), { op: 0.7 }); if (L > 14) f.line([add(lerp(b0, tip, 0.5), mul(n, -w * 0.4)), add(lerp(b0, tip, 0.6), mul(n, -w * 0.1))], 0.7, INK, { op: 0.5 }); };
  f.bone('forearm_f');
  for (let i = 0; i < 6; i++) feather(lp(EF, WF, 0.6 + (i % 3) * 0.03, -12 + i * 5), ang(EF, WF) + (i - 2.5) * 0.35, 18 + (i % 3) * 7, 7);
  // ---- the cage on its chain: brass, domed, soot-black at the top, a dead canary on its back inside
  f.bone('cage');
  const cx = cageTop[0], cT = cageTop[1], cw = 46, cy0 = cT + 30, cy1 = cT + 126;
  W.chainLinks(f, [add(fist, [0, 8]), [cx, cT - 2]], 9, P.brassD);
  W.glow(f, [cx, cy0 + 40], 70, 60, P.lampL, 0.12);
  // back bars first, then the floor, the bird, then the front bars over it
  for (let i = 0; i < 7; i++) { const u = -cw + i * cw * 2 / 6; f.line([[cx + u * 0.82, cy0 + 4], [cx + u, cy1]], 1.6, P.brassD, { op: 0.8, straight: true }); }
  f.part([[cx - cw, cy1 - 6], [cx + cw, cy1 - 6], [cx + cw - 2, cy1 + 8], [cx - cw + 2, cy1 + 8]].map(q => [...q, 1]), { fill: P.brassD, shade: 0.4, inkW: 1.2, cast: false });
  f.flat(ell([cx, cy1 - 6], cw - 4, 6, 0, 16), '#2a2216', { op: 0.9 }); // cage floor, grit and droppings
  for (let i = 0; i < 6; i++) f.flat(ell([cx - 30 + i * 11, cy1 - 7 + (i % 2)], 2, 1.2, 0, 6), P.boneD, { op: 0.7 });
  // the dead canary: on its back, feet curled up, wings loose, beak open
  const bc = [cx + 4, cy1 - 18], BF = frame(bc, 0.12, 1);
  f.part(BF([[-24, 2], [-14, -10], [4, -12], [18, -8], [26, -2], [22, 8], [4, 10], [-16, 8]]), { fill: canary, shadow: canD, light: canL, shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false });
  f.part(BF([[18, -6], [30, -8], [36, -2], [30, 6], [20, 6]]), { fill: canary, shadow: canD, light: canL, shade: 0.45, inkW: 1, cast: false, hatch: false }); // head
  f.flat(BF([[36, -2], [44, -4], [38, 1]]), '#c8a070'); f.flat(BF([[36, 0], [43, 3], [37, 3]]), '#a07850'); // open beak
  f.line(BF([[28, -4], [31, -2]]), 1.4, INK); // shut eye
  f.part(BF([[-30, 4], [-24, -2], [-20, 6], [-26, 10]]), { fill: canD, shade: 0.4, inkW: 0.9, cast: false }); // tail
  for (const [x0, x1] of [[-2, -6], [6, 8]]) { f.line(BF([[x0, -10], [x0 - 2, -22], [x1, -26]]), 1.3, '#8a6a4a'); f.line(BF([[x1, -26], [x1 + 3, -24]]), 1, '#8a6a4a'); } // curled feet up
  f.part(BF([[-10, -2], [8, -6], [14, 4], [-6, 8]]), { fill: mix(canary, '#fff', 0.15), shade: 0.4, inkW: 0.8, cast: false, hatch: false }); // loose wing
  for (let i = 0; i < 3; i++) f.line(BF([[-8 + i * 6, 0], [-2 + i * 6, 6]]), 0.7, canD, { op: 0.7 });
  feather([cx - 30, cy1 - 4], 0.2, 12, 5); feather([cx + 26, cy1 - 3], -0.3, 10, 4);
  // dome: hoops and ribs, the ring on top, soot black where the lamp smoke reaches
  f.part([[cx - cw, cy0 + 6], [cx - cw * 0.9, cy0 - 14], [cx - cw * 0.5, cT + 6], [cx, cT], [cx + cw * 0.5, cT + 6], [cx + cw * 0.9, cy0 - 14], [cx + cw, cy0 + 6], [cx + cw - 3, cy0 + 12], [cx, cy0 + 4], [cx - cw + 3, cy0 + 12]], { fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.45, inkW: 1.4, inkHeavy: 2.2, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
  f.raw(`<path d="${E.smooth([[cx - cw, cy0 + 6], [cx - cw * 0.9, cy0 - 14], [cx - cw * 0.5, cT + 6], [cx, cT], [cx + cw * 0.5, cT + 6], [cx + cw * 0.9, cy0 - 14], [cx + cw, cy0 + 6], [cx, cy0 + 4]])}" fill="url(#soot${seed})" opacity="0.8"/>`);
  for (let i = 1; i < 6; i++) { const u = -cw + i * cw * 2 / 6; f.line([[cx + u * 0.5, cT + 6], [cx + u * 0.92, cy0 + 4]], 1.2, INK, { op: 0.6 }); }
  const ringE = ell([cx, cT - 6], 7, 8, 0, 12); f.line(ringE.concat([ringE[0]]), 5, INK); f.line(ringE.concat([ringE[0]]), 3, P.brass);
  // front bars, a door with a wire latch, the hoops, a seed cup
  for (let i = 0; i < 7; i++) { const u = -cw + i * cw * 2 / 6; f.line([[cx + u, cy0 + 8], [cx + u * 1.0, cy1 - 4]], 3.6, INK, { straight: true }); f.line([[cx + u, cy0 + 8], [cx + u * 1.0, cy1 - 4]], 2, i % 2 ? P.brass : P.brassL, { straight: true }); }
  for (const yy of [cy0 + 8, cy0 + 50, cy1 - 4]) { f.line([[cx - cw - 1, yy], [cx + cw + 1, yy]], 4.6, INK, { straight: true }); f.line([[cx - cw, yy], [cx + cw, yy]], 2.8, P.brass, { straight: true }); }
  f.line([[cx + 6, cy0 + 50], [cx + 6, cy1 - 4], [cx + 30, cy1 - 4], [cx + 30, cy0 + 50], [cx + 6, cy0 + 50]], 3, P.brassD, { straight: true }); // door frame
  f.line([[cx + 30, cy0 + 70], [cx + 38, cy0 + 68], [cx + 36, cy0 + 76]], 1.4, P.ironL); // wire latch
  f.part([[cx - cw + 2, cy0 + 56], [cx - cw + 18, cy0 + 56], [cx - cw + 16, cy0 + 70], [cx - cw + 4, cy0 + 70]], { fill: P.brassD, shade: 0.4, inkW: 1, cast: false }); // seed cup
  f.line([[cx - cw + 4, cy1 - 30], [cx + cw - 4, cy1 - 34]], 2.4, P.wood); // the empty perch
  f.scratches([cx, cy0 + 60], 30, 4, P.brassL, 0.8);
  W.ash(f, [cx, cT - 10], 9, 30, 70, 0.8);
  // ---- far hand closed round the chain (the chain hangs from the little-finger side)
  f.bone('hand_f');
  B.grip(f, fist, EF, -Math.PI / 2, 22, mix(skin, P.soot, 0.2), { tex: 'mottle' + seed, texOp: 0.5, shadow: P.skinS, name: 'priest cage chain' });

  // ---- legs under the surplice: miner's trousers and boots (drawn whole; the hem hides the thighs)
  for (const [Hp, Kn, A, sfx, col] of [[HF, KF, AF, '_f', P.canvasD], [HN, KN, AN, '_n', P.canvas]]) {
    W.legTube(f, Hp, Kn, lerp(Kn, A, 0.6), [62, 50, 44], W.CAN(f, { fill: col }), sfx, { A });
    f.bone('shin' + sfx);
    f.stroke([lp(Kn, A, 0.2, -16), lp(Kn, A, 0.3, 0), lp(Kn, A, 0.25, 18)], 1.8);
    W.bootRig(f, Kn, A, 50, sfx === '_n' ? '#3a3028' : '#2a231d', sfx, { tex: 'mottle' + seed, shaft: 0.9, toe: 1.12, strap: sfx === '_n' });
  }

  // ---- torso: leather jerkin, the surplice over it to the knee, cut at the cincture for the rig
  f.bone('torso');
  const torso = S.shape([[-0.05, 0.3, 0.32], [0.08, 0.6, 0.55], [0.22, 0.66, 0.72], [0.42, 0.6, 0.7], [0.62, 0.55, 0.6], [0.82, 0.6, 0.56], [1.0, 0.62, 0.56]]);
  f.part(torso, W.LEA(f, { fill: jerk }));
  const WB = S.at(0, 0.8), dW = S.T(0.8);
  const surplice = [...S.shape([[-0.06, 0.4, 0.4], [0.1, 0.72, 0.62], [0.3, 0.76, 0.8], [0.55, 0.72, 0.74], [0.78, 0.72, 0.7]]).slice(0, 5),
    [362, 560], [388, 650], [372, 662, 1], [350, 654], [334, 670, 1], [306, 656], [282, 672, 1], [256, 652], [232, 668, 1], [212, 654], [188, 664, 1], [182, 600], [198, 540],
    ...S.shape([[-0.06, 0.4, 0.4], [0.1, 0.72, 0.62], [0.3, 0.76, 0.8], [0.55, 0.72, 0.74], [0.78, 0.72, 0.7]]).slice(5)];
  split(f, () => { f.part(surplice, { fill: surp, shadow: '#3e3b36', shade: 0.38, tex: 'weave' + seed, texOp: 0.45 }); f.raw(`<path d="${E.smooth(surplice)}" fill="url(#soot${seed})" opacity="0.7"/>`); }, [['skirt', side(S.at(0, 0.7), dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('skirt');
  W.clipDraw(f, surplice, () => {
    // deep folds falling from the cincture: shadowed troughs with a lit ridge beside each
    for (const [x0, x1, w] of [[214, 196, 16], [252, 240, 14], [300, 316, 18], [342, 366, 14]]) { f.flat([[x0 - w * 0.3, 530], [x0 + w * 0.3, 530], [x1 + w * 0.6, 670], [x1 - w * 0.6, 670]], '#2e2b26', { op: 0.45 }); f.line([[x0 + w * 0.5, 534], [x1 + w * 0.9, 664]], 1.6, surpL, { op: 0.45 }); }
    f.flat(ell([330, 560], 26, 18, 0.3, 12), '#5a5040', { op: 0.35 }); f.flat(ell([226, 590], 20, 26, 0, 12), '#4a4236', { op: 0.3 }); // old stains
    for (let i = 0; i < 9; i++) f.line([[196 + i * 22, 600], [206 + i * 22, 640]], 1, INK, { op: 0.3 });
  });
  for (const pts of [[[300, 520], [318, 600], [320, 652]], [[250, 530], [238, 600], [232, 650]], [[340, 540], [360, 610], [366, 650]], [[212, 560], [200, 620], [196, 655]]]) f.stroke(pts, 2.4, mix(surp, '#000', 0.6));
  f.part([[318, 572], [342, 570], [344, 596], [320, 598]].map(q => [...q, 1]), { fill: mix(surp, P.och, 0.25), shade: 0.4, tex: 'weave' + seed, inkW: 1.1, cast: false }); // darn
  f.stitches([[318, 572], [342, 570], [344, 596], [320, 598], [318, 572]], '#c8bca0', 0.8);
  // charred hem: soot rising from it, burnt-through edges, a few glowing threads
  W.clipDraw(f, surplice, () => { f.flat([[170, 612], [400, 600], [400, 690], [170, 690]], P.char, { op: 0.4 }); f.flat([[170, 640], [400, 630], [400, 690], [170, 690]], P.char, { op: 0.45 }); });
  for (const q of [[232, 666], [282, 670], [334, 668], [372, 660]]) W.seam(f, [add(q, [-8, -4]), q, add(q, [6, -6])], 1.2, { glowOp: 0.25 });
  f.part([[250, 600], [264, 596], [268, 616], [254, 620]], { fill: '#1e1712', shade: 0.3, inkW: 1, cast: false }); f.line([[250, 600], [264, 596], [268, 616], [254, 620], [250, 600]], 1.4, P.ember, { op: 0.6 });
  W.ash(f, [300, 660], 8, 160, 60, 0.8);
  f.bone('torso');
  for (const [a, b2, c] of [[[-0.5, 0.2], [-0.56, 0.45], [-0.5, 0.7]], [[0.2, 0.25], [0.3, 0.5], [0.28, 0.72]], [[-0.1, 0.3], [-0.16, 0.5], [-0.12, 0.72]]]) f.stroke([S.at(...a), S.at(...b2), S.at(...c)], 2.4, mix(surp, '#000', 0.6));
  f.flat([S.at(-0.7, 0.1), S.at(-0.3, 0.12), S.at(-0.36, 0.5), S.at(-0.72, 0.55)], '#2e2b26', { op: 0.3 });
  W.flakes(f, S.at(-0.4, 0.4), 16, 20, 3, 0.6);
  // the neck opening: the leather jerkin collar with its buckle, the throat split and glowing, feathers sprouting round it
  f.part([S.at(-0.3, -0.08), S.at(0.38, -0.06), S.at(0.5, 0.08), S.at(0.2, 0.14), S.at(-0.25, 0.1)], W.LEA(f, { fill: P.leathL }));
  f.part([S.at(0.3, 0.02), S.at(0.42, 0.03), S.at(0.42, 0.11), S.at(0.3, 0.1)].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  // rope cincture, knotted, its ends hanging
  const cin = [S.at(-0.72, 0.76), S.at(0.72, 0.74), S.at(0.73, 0.8), S.at(-0.73, 0.82)];
  f.part(cin, { fill: '#9a8a64', shade: 0.4, tex: 'hatch' + seed, texOp: 0.5, k: 0.6 });
  const kn = S.at(0.5, 0.78); f.part(ell(kn, 8, 7, 0, 10), { fill: '#8a7a56', shade: 0.4, inkW: 1.1, cast: false });
  W.rope(f, [kn, add(kn, [4, 30]), add(kn, [0, 64])], 3.4, { col: '#8a7a56' }); W.rope(f, [add(kn, [4, 2]), add(kn, [14, 34]), add(kn, [12, 54])], 3, { col: '#7a6a48' });
  // the stole: ochre, embroidered crosses, fringed, hanging plumb down the front
  f.bone('stole');
  const st0 = S.at(0.3, 0.0), st1 = S.at(0.62, 0.04);
  const stole = [st0, st1, add(st1, [8, 110]), add(st1, [6, 200]), [...add(st1, [4, 232]), 1], [...add(st0, [12, 238]), 1], add(st0, [12, 200]), add(st0, [6, 110])];
  f.part(stole, { fill: P.och, shadow: P.ochD, light: P.ochL, shade: 0.42, tex: 'weave' + seed, texOp: 0.45 });
  f.raw(`<path d="${E.smooth(stole)}" fill="url(#soot${seed})" opacity="0.5"/>`);
  for (const t of [70, 160]) { const c = add(lerp(st0, st1, 0.5), [8, t]); f.line([add(c, [0, -9]), add(c, [0, 9])], 2.6, P.bone); f.line([add(c, [-6, -3]), add(c, [6, -3])], 2.6, P.bone); }
  for (const t of [20, 120, 210]) f.line([add(st0, [8, t]), add(st1, [6, t + 2])], 1, P.ochL, { op: 0.6, dash: '2 2' });
  for (let i = 0; i < 7; i++) f.line([add(st0, [14 + i * 3.4, 236]), add(st0, [14 + i * 3.4 + (i % 2), 250])], 1.4, P.ochD);
  f.flat([add(st0, [4, 140]), add(st0, [20, 144]), add(st0, [18, 160]), add(st0, [6, 156])], P.char, { op: 0.6 }); // scorch

  // ---- head: gaunt, tonsured, head raised, mouth open wide in song toward the cage
  f.bone('head');
  f.part(limb(neck0, add(HC, [-6, 30]), 40, 36), SKN());
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin, jaw: 0.96, chin: 0.02, nose: 1.12, hook: 0.5, mouth: 'set', squint: 0.1, browDown: -0.04, age: true, gaunt: true,
    eyeWhite: '#c8b878', iris: '#1a120c', hairCol: '#4a4038', faceShade: 0.55, jawShade: 0.4,
    hair: [[-0.4, 0.06], [-0.44, -0.16], [-0.38, -0.28], [-0.24, -0.22], [-0.18, -0.04], [-0.26, 0.12]],
    hairLines: [[[-0.38, -0.18], [-0.3, -0.06]], [[-0.34, -0.24], [-0.22, -0.1]]],
  });
  f.flat(hF(ell([-0.02, -0.4], 0.24, 0.1, -0.2, 12)), mix(skin, '#fff', 0.3), { op: 0.35 }); // the bald tonsure catching the light
  W.crust(f, hF([[-0.34, -0.2]])[0], 8, 6, 3, 2.5, 4, { spikes: 0.3 }); // sulphur dust caked in the fringe
  // the mouth open wide in song: dropped jaw, tongue, dark throat
  f.flat(hF([[0.16, 0.24], [0.24, 0.21], [0.32, 0.23], [0.33, 0.36], [0.28, 0.44], [0.2, 0.42], [0.15, 0.34]]), '#3a2418');
  f.flat(hF([[0.18, 0.26], [0.24, 0.235], [0.3, 0.25], [0.31, 0.35], [0.27, 0.41], [0.21, 0.4], [0.17, 0.33]]), '#0e0806');
  f.flat(hF([[0.2, 0.36], [0.27, 0.35], [0.28, 0.39], [0.22, 0.4]]), '#7a4a3a', { op: 0.9 }); // tongue
  f.flat(hF([[0.2, 0.25], [0.27, 0.24], [0.28, 0.265], [0.21, 0.27]]), P.boneD, { op: 0.9 }); // teeth
  f.line(hF([[0.12, 0.42], [0.2, 0.48], [0.3, 0.46]]), 1.2, INK, { op: 0.5 }); // dropped jaw line
  W.soot(f, hF([[0.05, 0.1]])[0], 22, 16, 0.25);
  // ---- throat split glowing where the song comes out; feathers sprouting round the collar; a blister on the jaw
  f.bone('torso');
  for (let i = 0; i < 11; i++) { const q = S.at(-0.36 + i * 0.075, -0.05 + Math.abs(i - 5) * 0.008), l = [12, 20, 15, 24, 10, 18, 22, 13, 17, 9, 14][i]; feather(q, -Math.PI / 2 + (i - 5) * 0.26 + (f.r() - 0.5) * 0.35, l, 4 + (l > 16 ? 2 : 0), i % 3 === 1 ? canL : i % 4 === 2 ? canD : canary); }
  f.bone('head');
  W.seam(f, [lp(neck0, HC, 0.12, 14), lp(neck0, HC, 0.3, 18), lp(neck0, HC, 0.48, 14)], 1.9);
  W.blisters(f, lp(neck0, HC, 0.3, 4), 6, 6, 2, 2, 3.5);
  f.bone('torso');

  // ---- near arm: sleeve falling from the elbow, the hand holding the closed psalter against the belly
  W.armRig(f, SN, EN, WN, [42, 34, 28], SKN(), '_n', { muscle: false });
  f.bone('upperarm_n');
  f.part(K.chain([add(SN, [0, -8]), lerp(SN, EN, 0.55), add(EN, [2, 8])], [54, 52, 54]), { fill: surp, shadow: '#3e3b36', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.stroke([lp(SN, EN, 0.2, 14), lp(SN, EN, 0.5, 8), lp(SN, EN, 0.7, 16)], 2, mix(surp, '#000', 0.5));
  f.bone('forearm_n');
  const sn0 = lp(EN, WN, 0.1, 0), sn1 = lp(EN, WN, 0.6, 0);
  f.part([add(sn0, [-14, -18]), add(sn1, [2, -16]), add(sn1, [10, 12]), add(sn1, [0, 44]), [...add(sn1, [-8, 66]), 1], add(sn0, [10, 60]), add(sn0, [-10, 40]), add(sn0, [-22, 14])], { fill: surp, shadow: '#3e3b36', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.stroke([add(sn0, [-8, 18]), add(sn0, [4, 40]), add(sn0, [16, 58])], 2, mix(surp, '#000', 0.5));
  for (let i = 0; i < 5; i++) feather(lp(EN, WN, 0.64 + (i % 2) * 0.04, -10 + i * 5), ang(EN, WN) + (i - 2) * 0.4, 16 + (i % 3) * 6, 6);
  // psalter: closed, held flat against the belly, spine to the viewer, clasp, a rubric ribbon
  f.bone('book');
  const bkF = frame(add(WN, [6, 4]), 0.15, 1);
  f.part(bkF([[-30, -22], [24, -24], [26, 22], [-28, 24]].map(q => [...q, 1])), { fill: P.leathD, shade: 0.4, tex: 'craze' + seed, texOp: 0.4, inkW: 1.3 });
  f.part(bkF([[-30, -22], [-22, -24], [-20, 24], [-28, 24]].map(q => [...q, 1])), { fill: P.leath, shade: 0.4, inkW: 1.1, cast: false }); // spine
  for (const y of [-12, 0, 12]) f.line(bkF([[-30, y], [-20, y]]), 1.4, INK, { op: 0.7 });
  f.part(bkF([[20, -6], [30, -6], [30, 4], [20, 4]]), { fill: P.brass, shade: 0.4, inkW: 1, cast: false }); // clasp
  f.line(bkF([[0, 24], [2, 40], [-2, 54]]), 2.4, K.rubric); // ribbon
  f.bone('hand_n');
  B.hand(f, add(WN, [8, 2]), 0.35, 20, mix(skin, P.soot, 0.15), { spread: 0.12, curl: 0.45, shadow: P.skinS });

  f.bone('root');
  f.flat(ell([270, gy + 2], 160, 7, 0, 20), '#3a3020', { op: 0.5 });
  W.crust(f, [150, gy - 3], 26, 4, 3, 3, 5, { spikes: 0.2 });
  return f;
}

// a torch or fire flame wrapped round its fuel at b and licking upward (screen up), s ~ flame height. Layered from a dull
// ember edge to a hot core, its tongues uneven and leaning, a flicker torn loose above, soot rising. Never a cartoon drop.
function flame(f, b, s, o = {}) {
  const ph = o.phase ?? 0, lean = o.lean ?? 0.15, w0 = o.w ?? s * 0.24;
  W.glow(f, add(b, [s * lean * 0.4, -s * 0.3]), s * 0.6, s * 0.6, P.lampL, o.glowOp ?? 0.22, true);
  const body = (w, hh, k) => {
    const pts = [], n = 44;
    for (let i = 0; i < n; i++) {
      const u = Math.PI * 2 * i / n, up = Math.max(0, -Math.sin(u)), dn = Math.max(0, Math.sin(u));
      const jag = 0.55 + 0.45 * Math.pow(Math.abs(Math.sin(3.2 * u + ph + k)), 0.7) * (0.8 + 0.4 * Math.sin(7 * u + k * 2));
      const y = -hh * Math.pow(up, 1.6) * jag + w * 0.42 * dn, x = w * Math.cos(u) * (1 - 0.55 * Math.pow(up, 2)) + lean * -y * (1 + 0.3 * Math.sin(u * 2 + k));
      const sharp = up > 0.5 && Math.abs(Math.sin(3.2 * u + ph + k)) > 0.93;
      pts.push(sharp ? [b[0] + x, b[1] + y, 1] : [b[0] + x, b[1] + y]);
    }
    return pts;
  };
  f.flat(body(w0, s, 0), P.ember, { op: 0.8 });
  f.flat(body(w0 * 0.86, s * 0.82, 0.5), P.lamp, { op: 0.95 });
  f.flat(body(w0 * 0.62, s * 0.56, 1.1), P.lampL, { op: 0.95 });
  f.flat(body(w0 * 0.4, s * 0.32, 1.7), P.hot);
  f.flat(ell(add(b, [0, -s * 0.04]), w0 * 0.22, w0 * 0.3, 0, 10), P.core);
  // a flicker torn loose above the tips
  const fl = add(b, [s * lean * 1.1, -s * 0.98]);
  f.flat([add(fl, [-5, 10]), add(fl, [-3, -2]), [...add(fl, [2, -16]), 1], add(fl, [6, -2]), add(fl, [5, 10])], P.lamp, { op: 0.85 });
  // ink licks inside the fire (Living Ink): thin dark-red strokes following the tongues
  for (let i = 0; i < 4; i++) f.line([add(b, [-w0 * 0.5 + i * w0 * 0.33, -s * 0.08]), add(b, [-w0 * 0.4 + i * w0 * 0.3 + s * lean * 0.25, -s * 0.35]), add(b, [-w0 * 0.2 + i * w0 * 0.22 + s * lean * 0.55, -s * (0.55 + (i % 2) * 0.15)])], 1, '#7a2410', { op: 0.55 });
  if (o.smoke !== false) W.smoke(f, add(b, [s * lean * 1.2, -s * 1.0]), s * 0.8, s * 0.22, { col: '#241e1a', op: 0.5, line: '#4a4038', sway: s * 0.1, drift: s * 0.15 });
  for (let i = 0; i < (o.embers ?? 7); i++) f.flat(ell(add(b, [(f.r() - 0.4) * s * 0.7, -s * (0.7 + f.r() * 0.6)]), 1.6, 1.6, 0, 6), f.r() > 0.5 ? P.hot : P.lampL, { op: 0.9 });
}

// ------------------------------------------------------------------ FUSE IMP (cast, small 0.5)
// A spark that learned to walk: a wiry, knotted little soot-black imp with ember-cracked skin, mid-skitter (weight on the
// near toes, the far foot kicked up behind), heaving up a lit pitch torch longer than it is tall in both long-fingered
// fists. The shaft leans forward in front of it, clear of the face, the flame high over its head. Flame-shaped ears swept
// back, a wide grin of needle teeth, ember eyes. Its tail curls up behind and ends in a burning fuse.
// Rig: pelvis, torso, head, ear_n, ear_f, arms, legs, tail_1..3, torch (parent hand_n; the far fist is a second hold
// on the shaft and needs IK in engine). Motion: idle a giggling hop; attack throwing the torch.
function fuseImp() {
  const seed = 406, h = TIERS.small[1];
  const f = new Fig(W.base(seed, h, { grimeY: 640 }));
  W.textures(f);
  const gy = f.o.groundY, H = 86;
  const hide = '#4a3f35', hideL = '#8e765a', hideS = '#16110e', hideF = '#342c25';
  const HD = (o = {}) => Object.assign({ fill: hide, light: hideL, shadow: hideS, shade: 0.4, tex: 'craze' + seed, texOp: 0.45 }, o);
  // body: hunched, the head pushed forward on a short neck, knees bent under it
  const Pv = [228, 688], Tj = [232, 676], neck0 = [262, 604], HC = [286, 560], hA = 0.08;
  // torch: a straight shaft through both fists, leaning forward clear of the face
  const tA = -1.02, td = [Math.cos(tA), Math.sin(tA)];
  const gN = [330, 660], gF = add(gN, mul(td, 86)), butt = add(gN, mul(td, -60)), tHead = add(gN, mul(td, 360));
  const SN = [252, 620], SF = [272, 610];
  const [EN] = W.ik(SN, gN, 56, 64, -1), [EF] = W.ik(SF, gF, 58, 66, -1);
  const HN = [238, 700], KN = [290, 722], AN = [270, 762];
  const HF = [220, 696], KF = [246, 736], AF = [196, 748];
  W.humanJoints(f, { P: Pv, T: Tj, N: neck0, SN, EN, WN: gN, SF, EF, WF: gF, HN, KN, AN, HF, KF, AF });
  f.joint('ear_n', add(HC, [-20, -18]), 'head').joint('ear_f', add(HC, [-10, -24]), 'head');
  const T0 = [210, 690], T1 = [164, 704], T2 = [124, 668], T3 = [124, 606];
  f.joint('tail_1', T0, 'pelvis').joint('tail_2', T1, 'tail_1').joint('tail_3', T2, 'tail_2');
  f.joint('torch', gN, 'hand_n');

  // a sinewy limb segment: tapered, with a muscle belly on one side and a knob at the joint end, never an even tube
  const seg = (a, b2, wa, wb, look, o = {}) => f.part(limb(a, b2, wa, wb, { steps: 12, capK: 0.9, p: o.p || [[0.3, 0.32, 0.16]], q: o.q || [[0.55, 0.18, 0.18], [0.95, 0.25, 0.06]] }), Object.assign({ k: 0.9 }, look));
  // a whole sinewy limb in one outline (shoulder to wrist, hip to ankle): a muscle belly high on the upper segment, thin
  // at the joint, a second belly below it, a narrow wrist or ankle; a bony elbow point or knee knob on the outside of the
  // bend, a tendon line. Split at the joint for the rig.
  const limb2 = (A, Bj, Cj, ws, look, b1, b2, o = {}) => {
    const dk = W.elb(A, Bj, Cj), out = E.norm(sub(Bj, lerp(A, Cj, 0.5)));
    split(f, () => {
      const pts = K.chain([A, Bj, Cj], ws, { steps: 12, bp: o.bp, bq: o.bq });
      { const d0 = E.norm(sub(Bj, A)), n0 = [-d0[1], d0[0]], r = ws[0] / 2; for (let i = 1; i < 6; i++) { const a = Math.PI * i / 6; pts.push(add(A, add(mul(n0, -Math.cos(a) * r), mul(d0, -Math.sin(a) * r * 0.8)))); } }
      f.part(pts, Object.assign({ k: 0.9 }, look));
      f.part(ell(add(Bj, mul(out, ws[1] * 0.42)), ws[1] * 0.42, ws[1] * 0.34, Math.atan2(out[1], out[0]), 10), Object.assign({}, look, { cast: false, inkW: 0.9, inkHeavy: 1.2, fill: mix(look.fill, hideL, 0.35), maxShade: 4 })); // the bony point of the joint
      f.line([lp(A, Bj, 0.2, ws[0] * 0.18), lp(A, Bj, 0.6, ws[0] * 0.24), lp(A, Bj, 0.95, ws[1] * 0.1)], 1, hideL, { op: 0.6 }); // light along the muscle
      f.line([lp(Bj, Cj, 0.3, -ws[1] * 0.12), lp(Bj, Cj, 0.9, -ws[2] * 0.1)], 1, INK, { op: 0.55 }); // a tendon to the wrist or heel
      f.line([add(Bj, mul(out, -ws[1] * 0.2)), add(add(Bj, mul(out, -ws[1] * 0.45)), mul(dk, 4))], 1.1, INK, { op: 0.6 }); // the crease inside the bend
    }, [[b1, side(Bj, mul(dk, -1), ws[1] * 0.55)], [b2, side(Bj, dk, ws[1] * 0.55)]]);
  };
  // a clawed foot on its toes: three long toes splayed forward, black hooked claws, a spur behind
  const foot = (A, toeDir, L, look) => {
    f.part(limb(add(A, rot([-6, 0], toeDir)), add(A, rot([L * 0.5, 2], toeDir)), 18, 14, { steps: 6, capK: 1 }), Object.assign({}, look, { cast: false }));
    for (let i = 0; i < 3; i++) { const a = toeDir + (i - 1) * 0.24, k = add(add(A, rot([L * 0.45, 0], toeDir)), rot([L * 0.3, 0], a)), t = add(k, rot([L * 0.34, 0], a + 0.45)); f.part(K.chain([add(A, rot([L * 0.4, 0], toeDir)), k, t], [12, 9, 6]), Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.6, cast: false })); const c = add(t, rot([10, 0], a + 1.2)); f.stroke([add(t, rot([-3, 0], a)), lerp(t, c, 0.5), c], 4.2, '#0e0a08'); }
    f.stroke([add(A, rot([-4, 0], toeDir)), add(A, rot([-14, 6], toeDir))], 4, '#0e0a08'); // spur
  };

  // ---- tail behind everything: S-curve up from the rump, ridged, ending in a burning fuse
  const tail = W.spline([T0, T1, T2, T3, [140, 572], [164, 574]], 3);
  const nT = tail.length;
  const tailW = i => 18 * (1 - i / nT) + 4;
  const tailPoly = (i0, i1) => { const L = [], R2 = []; for (let i = i0; i <= i1; i++) { const a = tail[Math.max(0, i - 1)], b2 = tail[Math.min(nT - 1, i + 1)], d = E.norm(sub(b2, a)), n = [-d[1], d[0]], w = tailW(i) / 2; L.push(add(tail[i], mul(n, w))); R2.push(add(tail[i], mul(n, -w))); } return [...L, ...R2.reverse()]; };
  const iOf = q => tail.reduce((bi, c, i) => E.len(sub(c, q)) < E.len(sub(tail[bi], q)) ? i : bi, 0);
  const i1 = iOf(T1), i2 = iOf(T2);
  for (const [bn, a, b2] of [['tail_1', 0, i1 + 3], ['tail_2', i1, i2 + 3], ['tail_3', i2, nT - 1]]) { f.bone(bn); f.part(tailPoly(a, Math.min(nT - 1, b2)), HD({ k: 0.8 })); for (let i = a + 6; i < b2 - 2; i += 8) { const q = tail[i], d = E.norm(sub(tail[i + 1], tail[i - 1])), n = [-d[1], d[0]]; f.line([add(q, mul(n, tailW(i) * 0.48)), add(add(q, mul(n, -tailW(i) * 0.2)), mul(d, -3))], 1, INK, { op: 0.6 }); } }
  f.bone('tail_1'); W.seam(f, [tail[10], tail[18], tail[26]], 1.3, { glowOp: 0.25 });
  f.bone('tail_3');
  const tEnd = tail[nT - 1], tDir = E.norm(sub(tail[nT - 1], tail[nT - 4]));
  W.fuse(f, [add(tEnd, mul(tDir, -6)), add(tEnd, mul(tDir, 10)), add(add(tEnd, mul(tDir, 22)), [4, -4]), add(add(tEnd, mul(tDir, 30)), [8, -10])], 3.2);
  f.line([add(tEnd, mul(tDir, -8)), add(tEnd, mul(tDir, -2))], 7, '#4a3a24'); // the cord bound on

  // ---- far arm (behind), far leg (kicked up behind, mid-hop)
  const DK = HD({ fill: hideF });
  limb2(SF, EF, gF, [20, 11, 8], DK, 'upperarm_f', 'forearm_f', { bp: [[0, 0.4, 0.45, 0.18]], bq: [[0, 0.5, 0.3, 0.2], [1, 0.2, 0.4, 0.16]] });
  limb2(HF, KF, AF, [32, 13, 8], DK, 'thigh_f', 'shin_f', { bp: [[0, 0.35, 0.3, 0.2], [1, 0.25, 0.5, 0.16]], bq: [[0, 0.45, 0.2, 0.2], [1, 0.2, 0.2, 0.14]] });
  f.bone('foot_f'); foot(AF, 2.75, 34, DK);
  W.crust(f, add(AF, [-8, 4]), 6, 4, 2, 2, 3.5, { spikes: 0 });

  // ---- torso: hunched back, a knotted little chest of ribs, a pot belly over a pinched waist
  f.bone('torso');
  const tor = [[240, 594], [264, 592], [290, 610], [300, 630], [292, 648], [292, 668], [280, 684], [262, 696], [236, 700], [214, 692], [210, 672], [212, 648], [214, 624], [224, 604]];
  f.part(tor, HD());
  for (let i = 0; i < 5; i++) f.line([[214 + i * 0.4, 612 + i * 15], [220 + i * 0.4, 616 + i * 15]], 2, hideL, { op: 0.7 }); // spine knuckles catching light
  for (let i = 0; i < 3; i++) f.stroke([[262, 622 + i * 12], [282, 626 + i * 12], [296, 636 + i * 11]], 2.2, hideS); // ribs
  f.stroke([[266, 680], [282, 676], [292, 664]], 2, hideS); // belly fold
  W.crackNet(f, [244, 636], 0.5, 40, 1.8, { depth: 2 });
  W.crackNet(f, [270, 676], -0.7, 24, 1.4, { depth: 1 });
  W.blisters(f, [232, 614], 6, 6, 2, 2, 3.2);
  W.flakes(f, [222, 660], 10, 14, 3, 0.6);
  // a stolen miner's tally token on a cord round the neck
  f.line([[258, 602], [272, 624], [288, 616]], 1.2, '#7a6a4a');
  f.part(ell([276, 630], 6, 7, 0.2, 10), { fill: P.brass, shadow: P.brassD, shade: 0.4, inkW: 1, cast: false });
  f.line([[274, 627], [274, 633]], 0.9, INK, { op: 0.7 });
  // ---- pelvis: singed rag loincloth, cord belt, a powder pouch leaking
  f.bone('pelvis');
  const rag = [[210, 678], [288, 674], [296, 692], [290, 712], [280, 704, 1], [270, 722], [258, 708, 1], [246, 726], [234, 706, 1], [220, 716], [208, 696]];
  f.part(rag, { fill: P.canvasD, shadow: '#1e1a14', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 });
  for (const q of [[270, 722], [246, 726]]) W.seam(f, [add(q, [-5, -3]), q, add(q, [4, -4])], 1, { glowOp: 0.2 });
  W.rope(f, [[208, 682], [250, 680], [292, 676]], 2.4, { col: '#6a5a3c' });
  f.part([[274, 682], [292, 680], [296, 702], [278, 706]], W.LEA(f, { fill: P.leathL }));
  f.line([[276, 686], [292, 684]], 1.4, INK, { op: 0.6 });
  W.drip(f, [287, 706], 0.5, '#1a1410'); // powder trickling from a hole

  // ---- near leg, on its toes, carrying the weight
  limb2(HN, KN, AN, [32, 13, 8], HD(), 'thigh_n', 'shin_n', { bp: [[0, 0.35, 0.3, 0.2], [1, 0.22, 0.55, 0.16]], bq: [[0, 0.5, 0.25, 0.2], [1, 0.18, 0.2, 0.14]] });
  f.bone('shin_n'); W.seam(f, [lp(KN, AN, 0.25, -2), lp(KN, AN, 0.5, 2), lp(KN, AN, 0.72, -1)], 1.1, { glowOp: 0.2 });
  f.bone('foot_n'); foot(AN, 0.5, 38, HD());
  W.crust(f, add(AN, [14, 12]), 8, 4, 3, 2, 3.5, { spikes: 0.3 });

  // ---- head: bulbous skull, heavy brow, hooked nose, a wide needle grin, ember eyes, flame-shaped ears swept back
  const ear = (root, sc, dk) => {
    const E0 = frame(root, -0.35, sc), col = dk ? hideF : hide;
    // a long ear swept back and up, its upper edge broken into three licking lobes, the tip curling over
    f.part(E0([[6, -4], [-10, -14], [-24, -14], [-30, -26, 1], [-40, -22], [-52, -32, 1], [-62, -28], [-78, -44, 1], [-70, -26], [-56, -12], [-38, 0], [-18, 8], [2, 10]]), HD({ fill: col, k: 0.7 }));
    f.part(E0([[0, 0], [-16, -6], [-34, -10], [-52, -18], [-64, -28], [-50, -10], [-30, 0], [-12, 4]]), { fill: '#2a1c16', shade: 0.3, inkW: 0, cast: false, hatch: false }); // inner ear
    W.seam(f, E0([[-20, -10], [-38, -16], [-56, -24], [-70, -36]]), 1, { glowOp: 0.3 });
  };
  f.bone('ear_f');
  ear(add(HC, [-10, -24]), 0.8, true);
  f.bone('head');
  f.part(limb(neck0, add(HC, [-12, 22]), 26, 24, { p: [[0.5, 0.2, 0.2]] }), HD());
  f.line([lp(neck0, HC, 0.2, 8), lp(neck0, HC, 0.6, 6)], 1.2, hideS, { op: 0.7 }); // sinew
  const hF = frame(HC, hA, H);
  const skull = [[-0.46, -0.05], [-0.46, -0.32], [-0.32, -0.5], [-0.08, -0.58], [0.14, -0.53], [0.26, -0.4], [0.32, -0.26], [0.46, -0.18, 1], [0.42, -0.08], [0.47, 0.0], [0.6, 0.1], [0.58, 0.16, 1], [0.5, 0.16], [0.54, 0.22], [0.52, 0.3], [0.48, 0.4], [0.4, 0.5, 1], [0.26, 0.46], [0.08, 0.42], [-0.08, 0.34], [-0.22, 0.24], [-0.36, 0.14]];
  f.part(hF(skull), HD({ shade: 0.4, maxShade: 22 }));
  f.raw(`<path d="${E.smooth(hF(skull))}" fill="url(#soot${seed})" opacity="0.4"/>`);
  // planes: temple hollow, cheekbone, the socket under the brow, the muzzle
  f.flat(hF([[0.0, -0.28], [0.16, -0.24], [0.14, -0.08], [-0.02, -0.12]]), hideS, { op: 0.35 });
  f.flat(hF([[0.04, 0.02], [0.3, 0.04], [0.36, 0.12], [0.1, 0.14]]), hideL, { op: 0.35 });
  f.flat(hF([[0.16, -0.16], [0.42, -0.14], [0.4, -0.04], [0.18, -0.04]]), '#0c0806', { op: 0.85 }); // deep socket
  f.part(hF([[0.1, -0.22], [0.26, -0.3], [0.46, -0.2], [0.44, -0.13], [0.26, -0.18], [0.12, -0.15]]), HD({ fill: hideL, cast: false, inkW: 1.1, shade: 0.5 })); // brow ridge
  W.glow(f, hF([[0.3, -0.09]])[0], 12, 8, P.lamp, 0.55);
  f.flat(hF([[0.2, -0.09], [0.3, -0.12], [0.4, -0.09], [0.3, -0.06]]), P.lamp); f.flat(hF([[0.26, -0.095], [0.33, -0.105], [0.36, -0.09], [0.3, -0.08]]), P.hot); // ember eye, slit
  f.line(hF([[0.46, 0.06], [0.54, 0.12], [0.52, 0.15]]), 1.2, INK, { op: 0.7 }); // nostril
  // the grin: a long split from under the cheekbone to the front of the muzzle, lips drawn back, needle teeth
  const grin = [[0.04, 0.2], [0.2, 0.22], [0.4, 0.21], [0.53, 0.24], [0.48, 0.32], [0.3, 0.36], [0.12, 0.33], [0.02, 0.26]];
  f.flat(hF(grin), '#120604');
  for (let i = 0; i < 9; i++) { const u = 0.08 + i * 0.048, top = 0.215 - Math.sin(i / 8 * Math.PI) * 0.005; f.flat(hF([[u, top], [u + 0.032, top], [u + 0.016, top + 0.06 + (i % 2) * 0.015]]), P.bone); }
  for (let i = 0; i < 8; i++) { const u = 0.1 + i * 0.048, bot = 0.33 - i * 0.002; f.flat(hF([[u, bot], [u + 0.03, bot], [u + 0.015, bot - 0.05]]), P.boneD); }
  f.line(hF([[0.02, 0.2], [0.2, 0.21], [0.4, 0.2], [0.54, 0.23]]), 1.8, INK);
  f.line(hF([[0.04, 0.3], [0.2, 0.37], [0.42, 0.33]]), 1.2, INK, { op: 0.6 });
  f.line(hF([[-0.02, 0.12], [0.0, 0.2], [0.04, 0.28]]), 1.4, INK, { op: 0.7 }); // cheek crease bunched by the grin
  f.line(hF([[0.2, 0.42], [0.34, 0.46]]), 1, hideL, { op: 0.6 }); // jaw edge catching light
  W.crackNet(f, hF([[-0.24, -0.34]])[0], 0.7, 30, 1.3, { depth: 1 });
  W.seam(f, hF([[0.06, 0.38], [0.16, 0.44], [0.26, 0.46]]), 1, { glowOp: 0.2 });
  W.crust(f, hF([[-0.14, -0.5]])[0], 8, 4, 3, 2, 3.5, { spikes: 0.5 });
  for (const [x, y] of [[0.02, -0.56], [-0.2, -0.52]]) f.part(hF([[x - 0.04, y + 0.03], [x - 0.01, y - 0.12], [x + 0.05, y + 0.02]]), HD({ fill: hideL, cast: false, inkW: 1 })); // horn nubs
  f.bone('ear_n');
  ear(add(HC, [-20, -18]), 1.0, false);

  // ---- the torch: oak shaft, cord-wrapped grip, a head of pitch-soaked rags bound in wire, the flame high above
  f.bone('torch');
  f.part(limb(butt, tHead, 17, 19, { steps: 10, capK: 0.6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(butt, tHead, 0.03, -4), lp(butt, tHead, 0.85, -4)], 1, P.woodL, { op: 0.6, straight: true });
  for (let i = 0; i < 8; i++) f.line([lp(butt, tHead, 0.06 + i * 0.022, -9), lp(butt, tHead, 0.075 + i * 0.022, 9)], 1.6, '#2a1e14', { straight: true });
  for (const t of [0.42, 0.55, 0.58]) f.line([lp(butt, tHead, t, -8), lp(butt, tHead, t + 0.01, 8)], 1, INK, { op: 0.5, straight: true });
  f.flat([lp(butt, tHead, 0.7, -9), lp(butt, tHead, 0.9, -9), lp(butt, tHead, 0.9, 9), lp(butt, tHead, 0.7, 9)], P.char, { op: 0.55 }); // charred below the head
  const rag0 = lerp(butt, tHead, 0.86), TF = frame(rag0, tA, 1);
  f.part(TF([[0, -16], [20, -20], [44, -22], [62, -16], [66, 0], [62, 16], [44, 22], [20, 20], [0, 16]]), { fill: '#2a2018', shadow: '#0e0a08', shade: 0.4, tex: 'craze' + seed, texOp: 0.6 });
  for (const x of [8, 30, 52]) f.line(TF([[x, -20], [x + 4, 20]]), 2.2, P.ironL); // wire bindings
  for (const [x, l] of [[14, 22], [36, 30], [50, 16]]) { const q = TF([[x, 18]])[0]; f.stroke([q, add(q, [2, l * 0.6]), add(q, [0, l])], 4, '#0e0a08'); f.flat(ell(add(q, [0, l + 4]), 2.4, 3.4, 0, 6), '#0e0a08'); } // pitch drips
  W.glowLine(f, [TF([[10, -14]])[0], TF([[60, -16]])[0]], 10, P.lamp, 0.5);
  flame(f, TF([[40, 0]])[0], 160, { lean: 0.12, phase: 0.6, w: 40 });
  // ---- arms and fists on the shaft (long knotted fingers, claws past the knuckles)
  limb2(SN, EN, gN, [19, 10, 8], HD({ fill: mix(hide, hideL, 0.2) }), 'upperarm_n', 'forearm_n', { bp: [[0, 0.42, 0.5, 0.18], [1, 0.22, 0.45, 0.16]], bq: [[0, 0.5, 0.3, 0.2], [1, 0.2, 0.3, 0.14]] });
  f.bone('forearm_n');
  W.crackNet(f, lerp(EN, gN, 0.2), ang(EN, gN), 30, 1.1, { depth: 1 });
  const claws = (g, fa) => { for (let i = 0; i < 3; i++) { const q = add(g, rot([8, -6 + i * 7], fa + Math.PI / 2 * 0)), c = add(q, rot([10, 3], fa + 1.2)); f.stroke([q, lerp(q, c, 0.5), c], 3.4, '#0e0a08'); } };
  f.bone('hand_f');
  const gf = B.grip(f, gF, EF, tA, 17, mix(hide, '#000', 0.1), { tex: 'craze' + seed, texOp: 0.4, shadow: hideS, name: 'imp far' });
  W.crust(f, add(gF, [2, -6]), 5, 4, 2, 1.8, 3, { spikes: 0 });
  f.bone('hand_n');
  const gn = B.grip(f, gN, EN, tA, 18, hide, { tex: 'craze' + seed, texOp: 0.4, shadow: hideS, name: 'imp near' });
  W.crust(f, add(gN, [4, -6]), 6, 4, 3, 1.8, 3.2, { spikes: 0 });

  f.bone('root');
  f.flat(ell([250, gy + 2], 90, 5, 0, 16), '#3a3020', { op: 0.5 });
  W.ash(f, [240, 760], 6, 60, 30, 0.7);
  return f;
}

// ------------------------------------------------------------------ BRIMSTONE TOAD (cast, small 0.55)
// A cave toad the size of a dog, gone to stone on the outside: its back has grown a crust of sulphur plates and crystal
// druses, highest over the shoulders like a broken rock, the plates split apart by glowing seams. It squats heavy and
// low, forelegs braced wide, head held low; yellow brimstone beads sweat out of its warts and run. A ripe poison gland
// swells behind the eye. Rig (its own): body (root) > head > jaw > throat; legs leg_fn/ff/bn/bf _1.._3.
// Motion: idle a throat pulse (throat); attack a spit of burning slime (head up, jaw drops on its hinge).
function brimstoneToad() {
  const seed = 405, h = TIERS.small[1];
  const f = new Fig(W.base(seed, h, { grimeY: 640 }));
  W.textures(f);
  const gy = f.o.groundY;
  const hide = '#6a5434', hideD = '#463620', belly = '#a89466', bellyS = '#5a4a32';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#20180e', shade: 0.38, tex: 'mottle' + seed, texOp: 0.7 }, o);
  const BL = (o = {}) => Object.assign({ fill: belly, shadow: bellyS, shade: 0.34, tex: 'wrinkle' + seed, texOp: 0.45 }, o);
  const hinge = [404, 604], snout = [548, 598], neck = [380, 590];
  const FN = [[440, 650], [474, 716], [482, 766]], FF = [[410, 640], [414, 714], [424, 766]];
  const BN = [[206, 680], [314, 716], [196, 764]], BF = [[166, 664], [262, 698], [150, 756]];
  f.joint('body', [270, 660]).joint('head', neck, 'body').joint('jaw', hinge, 'head').joint('throat', [470, 640], 'head');
  const legJ = (nm, L, par) => { f.joint(nm + '_1', L[0], par).joint(nm + '_2', L[1], nm + '_1').joint(nm + '_3', L[2], nm + '_2'); };
  legJ('leg_ff', FF, 'body'); legJ('leg_fn', FN, 'body'); legJ('leg_bf', BF, 'body'); legJ('leg_bn', BN, 'body');

  const toes = (c, dir, n, len, w, look, o = {}) => {
    const tips = [];
    for (let i = 0; i < n; i++) { const a = dir + (i - (n - 1) / 2) * (o.spread || 0.34), l = len * (o.lens ? o.lens[i] : 1); tips.push([add(c, rot([l, 0], a)), a, l]); }
    if (o.web) f.part([c, ...tips.map(([t, a, l]) => add(c, rot([l * 0.6, 0], a)))], Object.assign({}, look, { fill: mix(look.fill, '#2a2016', 0.25), inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, shade: 0.3 }));
    for (const [t, a] of tips) { const k = lerp(c, t, 0.55); f.part(K.chain([c, k, t], [w, w * 0.8, w * 0.65]), Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.7, cast: false })); f.part(ell(t, w * 0.5, w * 0.42, a, 8), Object.assign({}, look, { fill: mix(look.fill, '#d8c8a0', 0.25), inkW: 1, inkHeavy: 1.3, cast: false, hatch: false })); f.part(ell(k, w * 0.5, w * 0.45, 0, 8), Object.assign({}, look, { inkW: 0, cast: false, hatch: false })); }
  };
  const leg3 = (nm, L, ws, look, foot, o = {}) => {
    f.bone(nm + '_2'); f.part(limb(L[1], L[2], ws[1], ws[2], { steps: 10, capK: 0.9, q: o.q2, p: o.p2 }), Object.assign({ k: 0.9 }, look));
    f.bone(nm + '_3'); foot();
    f.bone(nm + '_1'); f.part(limb(L[0], L[1], ws[0], ws[1] * 1.08, { steps: 10, capK: 0.95, p: o.p1, q: o.q1 }), Object.assign({ k: 0.9 }, look));
  };

  // ---- far legs (behind the body)
  leg3('leg_bf', BF, [86, 52, 32], HD({ fill: hideD }), () => toes(BF[2], 0.06, 5, 66, 14, HD({ fill: hideD }), { web: true, spread: 0.16, lens: [0.7, 0.9, 1.1, 1.0, 0.8] }));
  leg3('leg_ff', FF, [56, 28, 22], HD({ fill: hideD }), () => toes(add(FF[2], [6, 14]), 0.45, 4, 34, 12, HD({ fill: hideD }), { spread: 0.5 }), { p1: [[0.35, 0.3, 0.2]], q1: [[0.5, 0.2, 0.2]], p2: [[0.25, 0.42, 0.16]], q2: [[0.2, 0.25, 0.14], [0.92, 0.1, 0.05]] });
  f.bone('leg_ff_3'); W.crust(f, add(FF[2], [18, 18]), 10, 4, 2, 2, 4, { spikes: 0 });

  // ---- body: a squat rock of a toad, back highest over the shoulders, belly sagging onto the ground
  f.bone('body');
  const bodyP = [[96, 700], [100, 640], [128, 580], [176, 530], [234, 492], [298, 482], [352, 498], [396, 530], [424, 574], [446, 626], [448, 670], [430, 716], [396, 750], [330, 770], [236, 774], [158, 760], [112, 734]];
  f.part(bodyP, HD());
  f.part([[180, 756], [236, 774], [330, 770], [396, 750], [430, 716], [446, 690], [404, 740], [330, 756], [240, 760]], BL({ cast: false }));
  for (let i = 0; i < 4; i++) f.line([[250 + i * 40, 760 - i * 2], [262 + i * 40, 770 - i * 3]], 1, INK, { op: 0.45 }); // belly creases
  for (let i = 0; i < 14; i++) { const p0 = W.scatter(f, [270, 640], 140, 80); f.flat(ell(p0, 9 + f.r() * 16, 6 + f.r() * 9, f.r() * 3, 10), f.r() > 0.35 ? hideD : '#8a7448', { op: 0.45 }); }
  for (let i = 0; i < 5; i++) { const p0 = W.scatter(f, [320, 690], 70, 30); f.line([p0, add(p0, [14, 6]), add(p0, [26, 4])], 1, INK, { op: 0.4 }); } // skin folds over the hip
  // warts sweating brimstone, ripening blisters on the flank
  for (let i = 0; i < 26; i++) { const q = W.scatter(f, [290, 650], 140, 70), r = W.R(f, 3, 7); f.part(ell(q, r, r * 0.8, f.r() * 3, 9), { fill: mix(hide, '#a08a58', 0.35), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(ell(add(q, [r * 0.3, -r * 0.3]), r * 0.35, r * 0.25, 0, 6), '#fff', { op: 0.2 }); }
  W.blisters(f, [330, 660], 40, 26, 5, 4, 8);
  W.beads(f, [270, 640], 120, 60, 16, 1);
  for (const q of [[220, 640], [300, 600], [380, 640], [160, 680]]) { f.stroke([q, add(q, [1, 12]), add(q, [0, 26])], 3, P.sulL, { op: 0.8 }); W.drip(f, add(q, [0, 26]), 0.7); }
  // ---- the crust: sulphur plates over the back, split by glowing seams, crystal druses rising from the shoulders
  const crustP = W.lumpy(f, [[112, 640], [124, 596], [150, 562], [196, 518], [250, 486], [300, 476], [350, 492], [392, 522], [416, 560], [406, 582], [380, 584], [360, 598], [342, 594], [318, 604], [300, 602], [276, 614], [252, 610, 1], [234, 622], [206, 618], [186, 636], [160, 630], [140, 650]], 5);
  f.part(crustP, { fill: mix(P.sul, P.och, 0.3), shadow: P.sulD, light: P.sulP, shade: 0.42, tex: 'grain' + seed, texOp: 0.8, k: 0.8 });
  W.clipDraw(f, crustP, () => {
    // plates: split by a branching network of glowing seams
    W.crackNet(f, [170, 590], -0.6, 70, 2.4, { depth: 2 });
    W.crackNet(f, [270, 560], -0.9, 60, 2.6, { depth: 2 });
    W.crackNet(f, [350, 540], -1.6, 46, 2.2, { depth: 1 });
    W.crackNet(f, [240, 520], 0.2, 80, 2, { depth: 1 });
    for (let i = 0; i < 18; i++) f.flat(ell(W.scatter(f, [260, 540], 130, 40), 3, 2, 0, 6), P.sulP, { op: 0.5 });
  });
  f.line(crustP.slice(9).map(q => [q[0], q[1] + 3]), 2.4, '#2a1c10', { op: 0.7 }); // the crust's lower edge, undercut
  // loose plates and crust patches lower on the flank and the haunch
  for (const [c, r] of [[[200, 668], 18], [[268, 652], 14], [[360, 640], 16], [[150, 690], 12]]) { const pl = W.lumpy(f, ell(c, r * 1.4, r, -0.2, 9), r * 0.3); f.part(pl, { fill: mix(P.sul, P.och, 0.35), shadow: P.sulD, shade: 0.42, tex: 'grain' + seed, texOp: 0.8, inkW: 1.1, inkHeavy: 1.6, cast: false }); W.seam(f, [add(c, [-r, 2]), add(c, [0, -2]), add(c, [r * 0.9, 3])], 1.3, { glowOp: 0.25 }); }
  W.druse(f, [262, 494], -1.7, 78, 8);
  W.druse(f, [330, 494], -1.35, 52, 6);
  W.druse(f, [200, 526], -2.15, 56, 7);
  W.druse(f, [384, 526], -0.95, 34, 5);
  W.druse(f, [148, 584], -2.5, 36, 5);
  W.druse(f, [226, 506], -1.9, 30, 4);
  W.crust(f, [300, 540], 80, 20, 7, 4, 8, { spikes: 0.5 });
  W.glow(f, [270, 560], 120, 50, P.lamp, 0.12, true);

  // ---- near hind leg folded under: thigh forward, shin back, long webbed foot forward on the ground
  leg3('leg_bn', BN, [102, 60, 38], HD(), () => toes(BN[2], 0.05, 5, 80, 15, HD(), { web: true, spread: 0.13, lens: [0.65, 0.85, 1.1, 1.0, 0.8] }), { p1: [[0.45, 0.12, 0.25]], q1: [[0.4, 0.1, 0.25]] });
  f.bone('leg_bn_1');
  for (let i = 0; i < 8; i++) { const q = W.scatter(f, lp(BN[0], BN[1], 0.5, 0), 34, 18), r = W.R(f, 3, 6); f.part(ell(q, r, r * 0.8, 0, 9), { fill: mix(hide, '#a08a58', 0.35), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }
  W.crust(f, lp(BN[0], BN[1], 0.3, -18), 16, 8, 3, 3, 6, { spikes: 0.5 });
  W.seam(f, [lp(BN[0], BN[1], 0.35, 10), lp(BN[0], BN[1], 0.55, 16), lp(BN[0], BN[1], 0.72, 12)], 1.6);
  f.bone('leg_bn_3');
  W.splats(f, add(BN[2], [40, 22]), 30, 5, 5, '#2a2016');

  // ---- head, layer 1: the inside of the mouth (pale gums, a dark throat), seen only when the jaw drops
  f.bone('head');
  f.part([hinge, [440, 600], [500, 596], [544, 594], [540, 616], [500, 636], [440, 640], [410, 626]], { fill: '#b8806a', shadow: '#5a2a1e', shade: 0.4, inkW: 1.2, cast: false });
  f.flat([[410, 612], [454, 606], [474, 622], [436, 634]], '#1a0c08', { op: 0.9 });
  f.flat(ell([470, 612], 22, 8, 0, 10), P.lamp, { op: 0.5 }); // the burning slime welling up in its throat
  // ---- lower jaw, then the throat bulging under it
  f.bone('jaw');
  const jawP = [add(hinge, [0, -6]), [430, 596], [486, 594], [540, 588], [552, 590], [548, 612], [520, 630], [470, 640], [424, 638], [398, 626]];
  f.part(jawP, HD());
  f.part([[410, 626], [470, 634], [520, 624], [546, 610], [540, 626], [508, 642], [460, 646], [418, 638]], BL({ cast: false, inkW: 1 }));
  f.line([[424, 608], [486, 604], [540, 598]], 1.4, mix(hide, '#fff', 0.25), { op: 0.6 });
  f.bone('throat');
  f.part([[418, 640], [460, 646], [500, 642], [524, 634], [530, 656], [516, 680], [486, 692], [450, 690], [424, 676], [414, 656]], BL({ fill: mix(belly, P.sul, 0.2), cast: false }));
  f.flat([[446, 660], [484, 652], [508, 658], [484, 668]], '#fff', { op: 0.16 });
  for (let i = 0; i < 4; i++) f.line([[438 + i * 20, 648], [442 + i * 20, 686 - Math.abs(i - 1.5) * 6]], 0.9, INK, { op: 0.35 });
  W.beads(f, [476, 674], 26, 8, 3, 0.8);
  // ---- head, layer 2: broad low skull, bulging eye, the poison gland behind it, crusted brow
  f.bone('head');
  const headP = [hinge, [386, 566], [400, 530], [438, 508], [488, 500], [526, 510], [548, 534], [558, 562], [556, 584], [552, 594], [520, 600], [470, 604], [424, 608]];
  f.part(headP, HD());
  f.line([[404, 604], [470, 600], [520, 596], [552, 588]], 2.4, INK);
  f.line([[396, 610], [392, 626]], 1.6, INK, { op: 0.7 });
  // parotoid gland: ripe, swollen yellow, pitted, about to burst
  f.part(ell([428, 526], 34, 22, -0.3, 18), { fill: mix(P.sul, P.och, 0.25), shadow: P.sulD, shade: 0.42, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.4 });
  for (let i = 0; i < 9; i++) f.flat(ell(W.scatter(f, [428, 526], 22, 10), 2.2, 1.6, 0, 6), '#2a2010', { op: 0.8 });
  f.flat(ell([438, 516], 12, 5, -0.3, 8), '#f8f0c8', { op: 0.45 });
  W.blister(f, [446, 538], 6);
  // bulging eye: a raised dome, sulphur iris, a barred pupil, a heavy crusted lid
  f.part(ell([494, 516], 28, 24, 0, 18), HD({ cast: false }));
  f.part(ell([498, 518], 20, 17, 0, 16), { fill: '#c8a434', shadow: '#5a4810', shade: 0.35, inkW: 1.3, cast: false, hatch: false });
  for (let i = 0; i < 6; i++) f.line([[498, 518], add([498, 518], rot([16, 0], i * 1.05))], 0.8, '#6a5410', { op: 0.6 });
  f.flat([[482, 518], [498, 514], [514, 518], [498, 523]], '#0a0804');
  f.flat(ell([506, 510], 4, 3, 0, 6), '#fff', { op: 0.85 });
  f.part([[470, 512], [480, 492], [502, 486], [524, 494], [530, 510], [514, 504], [496, 502], [478, 508]], HD({ cast: false, inkW: 1.2 }));
  W.crust(f, [500, 492], 14, 4, 3, 2.5, 4.5, { spikes: 0.6 });
  f.part(ell([404, 528], 13, 11, 0, 12), HD({ fill: hideD, cast: false })); // far eye bump
  f.flat(ell([548, 552], 4, 2.5, 0.3, 8), '#0a0804'); // nostril
  for (let i = 0; i < 12; i++) { const q = W.scatter(f, [490, 566], 46, 20), r = W.R(f, 2.5, 5); f.part(ell(q, r, r * 0.8, 0, 9), { fill: mix(hide, '#a08a58', 0.35), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }
  W.seam(f, [[448, 572], [470, 566], [486, 574], [500, 570]], 1.5);
  W.drip(f, [530, 600], 0.8);

  // ---- near foreleg, braced wide, fingers spread in the grit
  leg3('leg_fn', FN, [62, 30, 24], HD(), () => toes(add(FN[2], [8, 16]), 0.35, 4, 40, 14, HD(), { spread: 0.48 }), { p1: [[0.35, 0.32, 0.2]], q1: [[0.5, 0.22, 0.2]], p2: [[0.25, 0.45, 0.16]], q2: [[0.2, 0.25, 0.14], [0.92, 0.1, 0.05]] });
  f.bone('leg_fn_2'); f.stroke([lp(FN[1], FN[2], 0.04, -18), lp(FN[1], FN[2], 0.1, 0), lp(FN[1], FN[2], 0.06, 16)], 2.6, '#140e08', { op: 0.6 }); f.stroke([lp(FN[1], FN[2], 0.84, -12), lp(FN[1], FN[2], 0.88, 0), lp(FN[1], FN[2], 0.85, 12)], 2, '#140e08', { op: 0.5 }); // folds at the elbow and wrist
  f.bone('leg_fn_1');
  for (let i = 0; i < 5; i++) { const q = W.scatter(f, lp(FN[0], FN[1], 0.5, 0), 14, 20), r = W.R(f, 2.5, 5); f.part(ell(q, r, r * 0.8, 0, 9), { fill: mix(hide, '#a08a58', 0.35), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }
  W.crust(f, lp(FN[0], FN[1], 0.2, 6), 12, 8, 2, 3, 5, { spikes: 0.4 });
  f.bone('leg_fn_3');
  W.splats(f, add(FN[2], [22, 22]), 28, 5, 5, '#2a2016');

  f.bone('root');
  f.flat(ell([300, gy + 2], 250, 8, 0, 20), '#3a3020', { op: 0.5 });
  W.crust(f, [110, gy - 3], 30, 4, 4, 3, 6, { spikes: 0.3 });
  return f;
}

// ------------------------------------------------------------------ PIT CRAWLER (cast, large 1.8 long)
// A cave centipede as long as a mine cart, built as a centipede is: a chain of flattened tergite plates, each a shallow
// shield with a thick rim and a raised posterior margin that overlaps the plate behind it like a shingle; the body is
// wider than it is tall, so from the camera's chest height we see the top of each plate as a broad band and its near
// rim as an edge. Under the rims, the soft pleural membrane and the leg bases. One pair of legs per segment, each leg
// thick at the base and jointed (coxa, prefemur, femur, tibia, tarsus), arched up and splayed outward, the claw tips
// planted; the far legs' knees show above the back. The rear two thirds lie along the gallery floor; the front third
// rears up off the floor in a curve, its legs lifted and reaching, the flat head bent forward over the forcipules (the
// big poison claws, the first leg pair) which drip. Antennae of many short beads. Ochre plates stained yellow, crusted
// with sulphur in the sutures, charred at the edges, a few sutures split and glowing; black legs.
// Rig (its own chain): body (root, the rearing base) > seg_f1 > seg_f2 > seg_f3 > head > fang_n, fang_f, antenna_n,
// antenna_f; body > seg_b1 > seg_b2 > seg_b3 (tail). One bone per near leg (leg_1..leg_n, parent its segment) for the ripple;
// far legs ride their segments. Motion: idle a ripple of legs; attack a strike (front segments lunge, fangs close).
function pitCrawler() {
  const seed = 407, h = TIERS.large[1];
  const f = new Fig(W.base(seed, h, { grimeY: 900 }));
  W.textures(f);
  const gy = f.o.groundY;
  const plateC = '#8c6a3a', plateD = '#5a4224', plateL = '#b8925a', rimC = '#6a4c28', pleura = '#3e3226', legC = '#231a14', legL = '#62523f', joint = '#8a7454';
  // the spine runs along the top of the body: low along the floor, then curving up into the reared front third
  const ctrl = [[30, 924], [110, 926], [230, 924], [360, 916], [466, 900], [542, 868], [596, 818], [632, 752], [654, 682], [668, 616]];
  const C = W.spline(ctrl, 3), S = W.arcLen(C), Lt = S[S.length - 1];
  const AT = u => W.at(C, S, Math.max(0, Math.min(1, u)) * Lt);
  // half-depth of the body profile (dorsal far edge to sternite); the tail tapers, the head end narrows a little
  const wOf = u => u < 0.2 ? 20 + (52 - 20) * Math.pow(u / 0.2, 0.6) : u > 0.94 ? 52 - (u - 0.94) * 140 : 52 + Math.sin(u * 11) * 1.5;
  const NS = 21;
  const BR = [['seg_b3', 0, 0.2, 'seg_b2'], ['seg_b2', 0.2, 0.34, 'seg_b1'], ['seg_b1', 0.34, 0.48, 'body'], ['body', 0.48, 0.6, null], ['seg_f1', 0.6, 0.73, 'body'], ['seg_f2', 0.73, 0.86, 'seg_f1'], ['seg_f3', 0.86, 1.01, 'seg_f2']];
  const boneAt = u => BR.find(([, a, b2]) => u >= a && u < b2)[0];
  f.joint('body', AT(0.54).p);
  for (const [nm, a, b2, par] of BR) if (par) f.joint(nm, AT(par === 'body' && nm.startsWith('seg_b') ? b2 : a).p, par);
  // the cross-section, as offsets along the normal in units of the half-depth (n points ventral: down on the floor,
  // forward on the reared part): far margin of the plate -1, near margin -0.05, the rim down to +0.32, pleura to +0.95
  const sideP = (u, k) => { const a = AT(u); return add(a.p, mul(a.n, (k + 1) * wOf(u))); };
  const neck = sideP(1, -0.2), A1 = AT(1), hd = E.norm(add(A1.d, [1.9, 1.1])), hn = [-hd[1], hd[0]];
  const HP = (x, y) => add(add(neck, mul(hd, x * 1.3)), mul(hn, y * 1.3)); // x forward along the head, y toward the belly side
  f.joint('head', neck, 'seg_f3').joint('fang_n', HP(22, 30), 'head').joint('fang_f', HP(16, 22), 'head').joint('antenna_n', HP(62, -6), 'head').joint('antenna_f', HP(56, -12), 'head');

  const LG = (o = {}) => Object.assign({ fill: legC, light: legL, shadow: '#0a0705', shade: 0.42, tex: 'growth' + seed, texOp: 0.25, inkW: 1.1, inkHeavy: 1.8, cast: false, k: 0.85 }, o);
  // one leg segment: tapered, a slight belly on the upper edge, a lit ridge, a pale joint membrane at its far end
  const lseg = (a, b, wa, wb, look, last) => {
    f.part(limb(a, b, wa, wb, { steps: 8, capK: 0.5, p: [[0.4, 0.14, 0.25]] }), look);
    f.line([lp(a, b, 0.12, wa * 0.22), lp(a, b, 0.8, wb * 0.24)], Math.max(1, wb * 0.16), legL, { op: 0.75 });
    if (!last) f.part(limb(lp(a, b, 0.97, 0), add(b, mul(E.norm(sub(b, a)), wb * 0.3)), wb * 0.95, wb * 0.85, { steps: 2, capK: 0.3 }), { fill: joint, shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false, gritOp: 0.2 });
  };
  // a whole leg through its joints: P = [hip, coxa end, knee, ankle, claw tip]; ws = base width (thick at the base)
  const leg = (P2, ws, look, o = {}) => {
    const [c0, c1, k, an, tip] = P2;
    f.part(ell(c0, ws * 0.72, ws * 0.55, Math.atan2(c1[1] - c0[1], c1[0] - c0[0]), 10), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.2) })); // coxa socket
    lseg(c0, c1, ws * 1.05, ws * 0.92, look); // coxa and prefemur, short and thick
    lseg(c1, k, ws * 0.9, ws * 0.7, look); // femur arching up and out
    lseg(k, an, ws * 0.62, ws * 0.42, look); // tibia coming down
    const d = E.norm(sub(tip, an)), nn = [-d[1], d[0]];
    f.part([add(an, mul(nn, ws * 0.22)), add(lerp(an, tip, 0.7), mul(nn, ws * 0.12)), [...tip, 1], add(lerp(an, tip, 0.7), mul(nn, -ws * 0.12)), add(an, mul(nn, -ws * 0.22))], Object.assign({}, look, { fill: '#0c0806' })); // tarsus and the pick-point claw
    if (o.planted) f.flat(ell(add(tip, [0, 1]), ws * 0.5, 2, 0, 8), '#0e0b08', { op: 0.6 });
  };
  // leg geometry for segment i: on the floor the femur arches up and splays out (near legs toward the viewer, so lower
  // on screen), the tibia comes down steeply and the claw bites the floor; front legs angle forward, rear legs back.
  // On the reared part the legs lift off the floor and reach forward, curled.
  const legGeo = (i, far) => {
    const u = (i + 0.5) / NS, a = AT(u), wv = wOf(u), rip = Math.sin(i * 1.7) * 0.35, fan = (u - 0.4) * 1.1 + rip;
    if (u < 0.56) {
      const c0 = far ? sideP(u, -0.7) : sideP(u, 0.62), L = gy - c0[1] + (far ? 20 : 30);
      const c1 = add(c0, [fan * 12, far ? -8 : 12]);
      const k = add(c1, [fan * L * 0.5 + (far ? -4 : 8), far ? -L * 0.3 : -L * 0.14]);
      const an = [k[0] + fan * L * 0.28 + 4, gy - (far ? 26 : 22)];
      return { P: [c0, c1, k, an, [an[0] + fan * 14 + 6, gy - 3]], planted: true, w: far ? 12 : 15 };
    }
    const up = (u - 0.56) / 0.44, c0 = far ? sideP(u, -0.6) : sideP(u, 0.6);
    const out = add(mul(a.n, 1), mul(a.d, 0.35 + up * 0.3)), dn = E.norm(add(out, [0, 0.8]));
    const c1 = add(c0, mul(out, 12)), k = add(c1, add(mul(out, 46 - up * 8), mul(a.d, far ? -8 : 0)));
    const an = add(k, mul(dn, 40)), tip = add(an, mul(E.norm(add(dn, mul(a.d, -0.8))), 20));
    return { P: [c0, c1, k, an, tip], planted: false, w: (far ? 11 : 13) * (1 - up * 0.2) };
  };

  // ---- far antenna, far legs (their knees rise above the back), and the far forcipule, all behind the body
  const antenna = (root, ctl, w) => { const P2 = W.spline(ctl, 2), SS = W.arcLen(P2), L = SS[SS.length - 1], n = 22; for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, a = W.at(P2, SS, t0 * L).p, b = W.at(P2, SS, t1 * L - 1).p, ww = Math.max(2.2, w * (1 - t0 * 0.75)); f.part(limb(a, b, ww, ww * 0.88, { steps: 3, capK: 0.5 }), LG({ inkW: 0.9, inkHeavy: 1.2 })); f.line([lp(a, b, 0.2, ww * 0.25), lp(a, b, 0.8, ww * 0.2)], 0.8, legL, { op: 0.7 }); } };
  f.bone('antenna_f'); antenna(HP(56, -12), [HP(56, -12), HP(60, -70), HP(30, -140), HP(-20, -186), HP(-70, -200)], 9);
  for (let i = 0; i < NS - 1; i++) { const g = legGeo(i, true); f.bone(boneAt((i + 0.5) / NS)); leg(g.P, g.w, LG({ fill: '#150e0a', light: '#3e342a' }), { planted: g.planted }); }
  f.bone('seg_b3');
  const tl = AT(0.01), tlN = sideP(0.02, -0.3);
  leg([tlN, add(tlN, [-14, -6]), add(tlN, [-60, -24]), add(tlN, [-110, -18]), add(tlN, [-140, -6])], 9, LG({ fill: '#150e0a' })); // far ultimate leg, trailing

  // ---- the body, from the tail to the head; each tergite's raised posterior margin overlaps the plate behind it
  for (let i = 0; i < NS; i++) {
    const u0 = i / NS, u1 = (i + 1) / NS, um = (u0 + u1) / 2, ov = 0.34 / NS, alt = i % 2 ? 0.94 : 1;
    f.bone(boneAt(um));
    const st = 7, U = k => u0 - ov + (u1 - u0 + ov) * k / st;
    // pleural membrane under the rim, wrinkled, with the leg bases' sclerites in it
    const pl = []; for (let k = 0; k <= st; k++) pl.push(sideP(U(k), 0.2)); for (let k = st; k >= 0; k--) pl.push(sideP(U(k), 0.98));
    f.part(pl, { fill: pleura, shadow: '#140e0a', shade: 0.4, tex: 'wrinkle' + seed, texOp: 0.6, inkW: 1, inkHeavy: 1.6 });
    f.part([sideP(um - 0.3 / NS, 0.45), sideP(um + 0.2 / NS, 0.42), sideP(um + 0.22 / NS, 0.7), sideP(um - 0.3 / NS, 0.72)], { fill: '#5a4834', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); // a pleurite
    // the rim: the plate's thickness at its near edge, darker, turned away from the light
    const rim = []; for (let k = 0; k <= st; k++) rim.push(sideP(U(k), -0.06)); rim.push(sideP(u1, 0.18)); for (let k = st; k >= 0; k--) rim.push(sideP(U(k) + (k === 0 ? 0.25 / NS : 0), 0.3 - (k === 0 ? 0.1 : 0)));
    f.part(rim, { fill: rimC, shadow: '#2a1c0e', shade: 0.45, tex: 'growth' + seed, texOp: 0.4, inkW: 1.2, inkHeavy: 2.2, cast: false });
    // the top of the plate: a broad flattened shield, the posterior margin bowed back over the plate behind
    const top = [];
    for (let k = 0; k <= st; k++) top.push(sideP(U(k), -1 + (1 - alt) * 0.6));
    top.push(sideP(u1 + 0.04 / NS, -0.6)); top.push(sideP(u1, -0.06));
    for (let k = st; k >= 1; k--) top.push(sideP(U(k), -0.06));
    top.push([...sideP(u0 - ov * 1.05, -0.14), 1]); top.push(sideP(u0 - ov * 1.5, -0.52)); top.push([...sideP(u0 - ov * 1.05, -0.92 + (1 - alt) * 0.6), 1]);
    f.part(top, { fill: i % 3 === 1 ? mix(plateC, plateD, 0.18) : plateC, shadow: plateD, light: plateL, shade: 0.4, maxShade: 14, tex: 'growth' + seed, texOp: 0.45, inkW: 1.4, inkHeavy: 2.6, k: 0.85, castOp: 0.55 });
    W.clipDraw(f, top, () => {
      f.flat([sideP(u0 - ov * 2, -1.2), sideP(u0 + 0.16 / NS, -1.2), sideP(u0 + 0.16 / NS, 0.1), sideP(u0 - ov * 2, 0.1)], mix(plateD, '#000', 0.2), { op: 0.4 }); // the raised posterior margin, a darker band
      f.line([sideP(u0 + 0.16 / NS, -0.95), sideP(u0 + 0.16 / NS, -0.1)], 1.6, plateL, { op: 0.6 }); // lit lip of the margin
      for (const kk of [-0.72, -0.36]) f.line([sideP(u0 + 0.3 / NS, kk), sideP(um, kk - 0.03), sideP(u1, kk)], 1.3, INK, { op: 0.45 }); // paramedian sutures
      f.flat([sideP(u1 - 0.18 / NS, -1.2), sideP(u1 + 0.05, -1.2), sideP(u1 + 0.05, 0.1), sideP(u1 - 0.18 / NS, 0.1)], P.sul, { op: 0.35 }); // sulphur stain where the next plate covers
      for (let q = 0; q < 3; q++) f.flat(ell(sideP(u0 + (0.25 + f.r() * 0.6) / NS, -0.9 + f.r() * 0.8), 3 + f.r() * 5, 2 + f.r() * 3, f.r() * 3, 8), P.sul, { op: 0.28 });
    });
    f.line([sideP(u0 - ov * 0.6, -0.08), sideP(um, -0.07), sideP(u1, -0.08)], 2, mix(plateL, '#fff', 0.3), { op: 0.7 }); // the near margin worn bright
    f.line([sideP(u0 - ov * 0.8, 0.27), sideP(u1, 0.28)], 1.4, P.char, { op: 0.7 }); // charred underside edge of the rim
    if (i % 2 === 0) W.crust(f, sideP(u0 - ov * 0.4, -0.5), 4, 10, 2, 2, 4, { spikes: 0.3 });
    if (i % 4 === 1 || i === 14) W.seam(f, [sideP(u0 - ov * 0.5, -0.92), sideP(u0 - ov * 0.9, -0.5), sideP(u0 - ov * 0.6, -0.1)], 1.5, { glowOp: 0.3 });
    if (i % 5 === 2) W.flakes(f, sideP(um, -0.5), 8, 6, 2, 0.6);
    if (i % 6 === 3) W.blisters(f, sideP(um, 0.6), 5, 4, 2, 2, 3.5);
  }
  // a broken plate, and the old pick wound in it, half healed
  f.bone('seg_b1');
  f.flat([sideP(0.41, -0.95), sideP(0.43, -0.7), sideP(0.42, -0.3), sideP(0.4, -0.6)], '#140c08');
  W.seam(f, [sideP(0.405, -0.9), sideP(0.42, -0.6), sideP(0.415, -0.3)], 2, { glowOp: 0.35 });

  // ---- head: a flat, rounded cephalic plate bent forward over the forcipules; its rim; the ocelli; the far forcipule
  // A forcipule: a thick base segment off the coxosternum, two shorter segments curving inward, the tarsungulum a long
  // curved black fang with a venom pore near its tip.
  const forcipule = (b, s, col, inward) => {
    const F0 = frame(b, Math.atan2(hd[1], hd[0]) + 0.35, s);
    const look = { fill: col, shadow: '#0a0604', light: '#9a7448', shade: 0.42, inkW: 1.3, inkHeavy: 2.4, cast: false, tex: 'growth' + seed, texOp: 0.3 };
    f.part(F0([[-6, -12], [18, -16], [34, -12], [40, 2], [34, 14], [12, 16], [-6, 12]]), look); // trochanteroprefemur, thick
    f.flat(F0([[2, -4], [22, -8], [30, -2]]), '#c09a60', { op: 0.35 });
    for (const x of [14, 24]) f.flat(F0([[x, 13], [x + 5, 13], [x + 2, 19]]), '#2a1a0e'); // the inner tooth
    f.part(F0([[34, -10], [50, -8], [56, 4], [48, 12], [34, 10]]), look); // femur
    f.part(F0([[50, -6], [62, -2], [64, 10], [54, 14]]), look); // tibia
    f.part(F0([[58, -2], [74, 2], [86, 14], [92, 30], [92, 44, 1], [84, 30], [74, 20], [60, 14]]), Object.assign({}, look, { fill: '#120a06', light: '#4a3a2a' })); // the fang
    f.line(F0([[64, 2], [78, 8], [88, 22]]), 1.2, '#6a5a48', { op: 0.8 });
    f.flat(ell(F0([[88, 34]])[0], 1.6 * s, 1.2 * s, 0, 6), P.sulL); // venom pore
    return F0([[92, 44]])[0];
  };
  f.bone('fang_f');
  forcipule(HP(16, 22), 1.6, '#3a2a18');
  f.bone('head');
  f.part([HP(-4, 6), HP(34, 4), HP(46, 18), HP(36, 34), HP(4, 36), HP(-8, 22)], { fill: '#4a3822', shadow: '#1a1008', shade: 0.42, inkW: 1.2, inkHeavy: 2, cast: false, tex: 'growth' + seed, texOp: 0.4 }); // coxosternum under the head
  const headP = [HP(-10, -24), HP(14, -30), HP(42, -30), HP(64, -24), HP(78, -12), HP(80, 2), HP(70, 12), HP(46, 16), HP(16, 16), HP(-6, 12), HP(-14, -6)];
  f.part(headP, { fill: plateC, shadow: plateD, light: plateL, shade: 0.42, maxShade: 14, tex: 'growth' + seed, texOp: 0.4, inkW: 1.5, inkHeavy: 2.8 });
  f.part([HP(-6, 8), HP(20, 12), HP(50, 12), HP(72, 8), HP(70, 16), HP(46, 22), HP(16, 22), HP(-6, 18)], { fill: rimC, shadow: '#2a1c0e', shade: 0.45, inkW: 1.1, inkHeavy: 1.8, cast: false }); // the head plate's rim
  f.line([HP(-4, 6), HP(30, 9), HP(70, 6)], 1.8, mix(plateL, '#fff', 0.3), { op: 0.7 });
  f.line([HP(4, -20), HP(30, -22), HP(60, -16)], 1.2, INK, { op: 0.45 }); f.line([HP(10, -6), HP(40, -6), HP(64, -2)], 1.2, INK, { op: 0.4 }); // the cephalic sutures
  f.flat([HP(-2, -14), HP(20, -24), HP(54, -24), HP(40, -18), HP(10, -12)], '#fff2d0', { op: 0.25 });
  for (const [x, y] of [[66, -8], [70, -3], [62, -3], [67, 2]]) { f.flat(ell(HP(x, y), 3, 2.6, 0, 6), '#0c0806'); f.flat(ell(HP(x - 0.6, y - 0.8), 0.9, 0.9, 0, 5), '#e8dcc0', { op: 0.7 }); } // ocelli
  W.crust(f, HP(26, -32), 10, 5, 3, 2.5, 4.5, { spikes: 0.4 });
  W.seam(f, [HP(20, -26), HP(28, -12), HP(26, 4)], 1.4, { glowOp: 0.3 });
  f.part([HP(38, 18), HP(58, 16), HP(62, 26), HP(44, 30)], { fill: '#2a1c12', shade: 0.4, inkW: 1, cast: false }); // maxillae between the claws
  f.bone('antenna_n'); antenna(HP(62, -6), [HP(62, -6), HP(80, -60), HP(60, -132), HP(20, -184), HP(-24, -206)], 11);
  // ---- near forcipule over everything at the front, dripping venom (sulphur-yellow, thick)
  f.bone('fang_n');
  const ft = forcipule(HP(22, 30), 1.95, '#4a3420');
  for (const [d, l] of [[[0, 0], 18], [[-6, -8], 10]]) { const q = add(ft, d); f.stroke([q, add(q, [1, l * 0.6]), add(q, [0, l])], 3, P.sulL, { op: 0.85 }); W.drip(f, add(q, [0, l]), 0.8); }

  // ---- near legs in front of the body, one bone each
  for (let i = 0; i < NS - 1; i++) { // the last pair is folded under the forcipules
    const u = (i + 0.5) / NS, g = legGeo(i, false), nm = 'leg_' + (i + 1);
    f.joint(nm, g.P[0], boneAt(u));
    f.bone(nm); leg(g.P, g.w, LG(), { planted: g.planted });
    if (i % 3 === 0) W.crust(f, g.P[2], 4, 4, 1, 2, 3, { spikes: 0 });
  }
  f.bone('seg_b3');
  const tn = sideP(0.02, 0.5);
  leg([tn, add(tn, [-14, 4]), add(tn, [-62, -12]), add(tn, [-116, 4]), add(tn, [-146, 20])], 10, LG()); // the near ultimate leg, trailing

  f.bone('root');
  f.flat(ell([330, gy + 2], 340, 10, 0, 24), '#2a2218', { op: 0.6 }); // the shadow of the lying body
  W.crust(f, [780, gy - 4], 40, 4, 5, 3, 6, { spikes: 0.2 });
  W.splats(f, [600, gy - 2], 40, 3, 5, '#2a2016');
  { const pd0 = [ft[0], gy - 1]; f.flat(ell(pd0, 14, 3, 0, 10), P.sulD, { op: 0.6 }); } // venom spatter below the fang
  return f;
}

// ------------------------------------------------------------------ POWDER OGRE (elite, 2.3)
// The powder-store keeper who ate the stock. A huge, sooty, pot-bellied brute standing with his weight sunk back on
// his heels to carry the belly, which bulges out scarred, blistered and split by seams that glow from the powder burning
// inside. A split powder keg is clamped under his near arm, its broken end forward and spilling. The far fist is raised
// to his chest with a dripping handful of powder; a lit fuse cord is knotted round that wrist. Singed bald head, burnt
// stubs of eyebrows, small eyes squeezed shut over a stupid, satisfied grin smeared black with powder.
// His standing height is 2.3; the hunch brings the crown down to the top of the frame.
// Rig: standard humanoid + keg (parent hand_n) + belly (parent torso) + fuse (parent hand_f).
// Motion: idle eating powder (far forearm and head); attack a fiery belch (torso and head thrown forward).
function powderOgre() {
  const seed = 402, h = TIERS.elite[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1120 }));
  W.textures(f);
  const gy = f.o.groundY, H = 236;
  const skin = '#7a6450', skinS = '#2c1e16', SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const leathB = '#4a3624';
  const LIMB = (o = {}) => SKN(Object.assign({ shadow: mix(skin, skinS, 0.5), maxShade: 24, shade: 0.3 }, o)); // limbs: a form crescent, not a dark band
  const Pv = [540, 960], Tj = [560, 900], neck0 = [622, 330], HC = [716, 214], hA = 0.12;
  const B0 = [300, 752], B1 = [806, 604], KR = 122, kd = E.norm(sub(B1, B0)), kn = [-kd[1], kd[0]], kA = Math.atan2(kd[1], kd[0]); // the keg: axis back end to the split mouth
  const KP = (t, v) => add(lerp(B0, B1, t), mul(kn, v)); // t along the axis, v across it (+ = underside)
  const SN = [604, 424], EN = [584, 716], WN = [748, 724];
  const SF = [676, 396], EF = [770, 556], WF = [846, 392];
  const HN = [610, 1000], KN = [664, 1172], AN = [650, 1316];
  const HF = [462, 990], KF = [432, 1166], AF = [384, 1316];
  W.humanJoints(f, { P: Pv, T: Tj, N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('keg', WN, 'hand_n').joint('belly', [760, 600], 'torso').joint('fuse', WF, 'hand_f');

  // ---- far arm: upper arm behind the bulk (the forearm crosses in front of the chest, drawn later)
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [150, 84], { steps: 12, bp: [[0, 0.35, 0.32, 0.2]], bq: [[0, 0.45, 0.28, 0.22]] }), LIMB({ fill: mix(skin, skinS, 0.3) }));
  // ---- far leg: thick, short, bare foot with a rag round the ankle
  // a bare leg: a heavy thigh (under the breeches) narrowing into a fat knee with a kneecap, a calf that swells high at
  // the back and narrows to a thick ankle, a broad flat foot. A strip of rag wound round the ankle, not a cuff.
  const bareLegFoot = (Hp, Kn, A, sfx, col, s) => {
    W.legRig(f, Hp, Kn, A, s, 200, 112, LIMB({ fill: col }), sfx, { thigh: 0.12, calf: 1.55, swell: 0.1 });
    const dS = E.norm(sub(A, Kn)), fr = [dS[1], -dS[0]]; // fr: toward the front of the shin
    f.bone('shin' + sfx);
    f.part(ell(add(add(Kn, mul(fr, 30)), mul(dS, 8)), 30, 24, Math.atan2(dS[1], dS[0]), 12), SKN({ fill: mix(col, '#c8a888', 0.15), cast: false, inkW: 1.1, inkHeavy: 1.6, maxShade: 10 })); // kneecap
    f.stroke([add(Kn, mul(fr, -40)), add(add(Kn, mul(fr, -20)), mul(dS, 14)), add(add(Kn, mul(fr, -4)), mul(dS, 10))], 3, skinS, { op: 0.6 }); // the crease behind the knee
    f.stroke([lp(Kn, A, 0.2, -50), lp(Kn, A, 0.42, -58), lp(Kn, A, 0.7, -36)], 3, skinS, { op: 0.5 }); // the calf's swell
    f.line([lp(Kn, A, 0.2, 40), lp(Kn, A, 0.55, 34), lp(Kn, A, 0.85, 26)], 1.6, mix(col, '#fff', 0.3), { op: 0.5 }); // the shin bone catching light
    f.line([lp(Kn, A, 0.5, 10), lp(Kn, A, 0.7, 16), lp(Kn, A, 0.86, 8)], 1.4, '#4a3a5a', { op: 0.4 }); // a vein
    W.rope(f, [lp(Kn, A, 0.8, -40), lp(Kn, A, 0.84, 0), lp(Kn, A, 0.81, 38)], 6, { col: '#6a5e48' });
    W.rope(f, [lp(Kn, A, 0.88, -42), lp(Kn, A, 0.9, 0), lp(Kn, A, 0.87, 40)], 6, { col: '#5a5040' });
    f.line([lp(Kn, A, 0.86, -40), lp(Kn, A, 0.98, -52), lp(Kn, A, 1.08, -48)], 4, '#5a5040'); // the loose end
  };
  // breeches over the thigh: the quad bulging at the front, the hamstring and fat at the back, the leather pulled into
  // folds from the crotch, the hem burnt ragged above the knee
  const breech = (Hp, Kn, sfx, col) => {
    f.bone('thigh' + sfx);
    const tE = lerp(Hp, Kn, 0.84), d = E.norm(sub(Kn, Hp));
    f.part(K.ragLimb(f, Hp, tE, 250, 150, { depth: 14, teeth: 8, p: [[0.3, 0.26, 0.2]], q: [[0.4, 0.22, 0.22]] }), W.LEA(f, { fill: col }));
    f.stroke([lp(Hp, tE, 0.15, 60), lp(Hp, tE, 0.45, 20), lp(Hp, tE, 0.75, -30)], 3, P.leathD, { op: 0.7 });
    f.stroke([lp(Hp, tE, 0.3, 80), lp(Hp, tE, 0.6, 50), lp(Hp, tE, 0.9, 10)], 2.4, P.leathD, { op: 0.6 });
    f.stroke([lp(Hp, tE, 0.25, -80), lp(Hp, tE, 0.55, -90), lp(Hp, tE, 0.85, -60)], 3, P.leathD, { op: 0.6 });
    f.line([lp(Hp, tE, 0.2, -50), lp(Hp, tE, 0.5, -60), lp(Hp, tE, 0.8, -46)], 1.6, P.leathL, { op: 0.5 });
    W.seam(f, [lp(Hp, tE, 0.98, -60), lp(Hp, tE, 1.0, -20), lp(Hp, tE, 0.99, 30)], 1.6, { glowOp: 0.25 });
    return d;
  };
  bareLegFoot(HF, KF, AF, '_f', mix(skin, skinS, 0.3), 118);
  breech(HF, KF, '_f', mix(leathB, '#000', 0.25));

  // ---- torso: the hunched back, massive shoulders, the pot belly
  f.bone('torso');
  const TOR = [[600, 300], [650, 330], [700, 380], [748, 420], [776, 470], [784, 520], [800, 560], [760, 640], [700, 900], [620, 990], [520, 1012], [430, 1000], [378, 952], [364, 890], [384, 820], [390, 760], [372, 690], [360, 600], [358, 500], [372, 420], [410, 352], [476, 308], [550, 294]];
  f.part(TOR, SKN({ shade: 0.32, maxShade: 60 }));
  f.raw(`<path d="${E.smooth(TOR)}" fill="url(#soot${seed})" opacity="0.9"/>`);
  // modelling on the broad back: the spine furrow, the blade, form hatching on the shadow side
  W.clipDraw(f, TOR, () => { f.stroke([[520, 320], [470, 420], [440, 560], [436, 720], [450, 880]], 5, skinS, { op: 0.5 }); f.stroke([[500, 400], [540, 470], [536, 560]], 3, skinS, { op: 0.5 }); for (let i = 0; i < 22; i++) f.line([[384 + (i % 2) * 6, 420 + i * 24], [414 + (i % 3) * 4, 440 + i * 24]], 1.4, INK, { op: 0.45 }); f.flat([[380, 700], [460, 740], [470, 900], [420, 990], [380, 960]], skinS, { op: 0.35 }); });
  // muscle masses: trapezius hump, deltoid, the lat sweeping down the back, the slab of the pectoral
  f.stroke([[470, 330], [430, 420], [410, 560], [420, 700]], 4, skinS, { op: 0.6 });
  f.stroke([[560, 330], [600, 380], [640, 440]], 3.2, skinS, { op: 0.6 });
  f.flat([[648, 420], [736, 430], [776, 480], [760, 520], [690, 520], [646, 480]], mix(skin, '#fff2d8', 0.3), { op: 0.35 });
  f.stroke([[650, 520], [700, 536], [760, 524]], 3, skinS, { op: 0.7 }); // under the pectoral
  for (let i = 0; i < 3; i++) f.line([[436 + i * 10, 480 + i * 90], [460 + i * 10, 520 + i * 90]], 2, skinS, { op: 0.5 }); // back rolls
  // old burn scars on the shoulder and back: pale shiny skin, puckered
  for (const c of [[480, 380], [430, 620]]) { f.flat(ell(c, 34, 22, -0.4, 14), mix(skin, '#e8d0b8', 0.45), { op: 0.55 }); for (let i = 0; i < 4; i++) f.line([add(c, [-24 + i * 14, -8]), add(c, [-18 + i * 14, 10])], 1.2, skinS, { op: 0.5 }); }
  W.crust(f, [470, 330], 30, 10, 5, 5, 10, { spikes: 0.4 });
  W.blisters(f, [420, 760], 16, 30, 4, 5, 9);
  W.flakes(f, [440, 520], 30, 40, 5, 1);

  // ---- breeches: scorched leather slung under the belly, patched, burnt through at the hems
  f.bone('pelvis');
  const BR = [[400, 920], [520, 944], [640, 950], [736, 930], [780, 980], [770, 1060], [700, 1110], [600, 1120], [480, 1110], [400, 1080], [380, 1000]];
  f.part(BR, W.LEA(f, { fill: leathB }));
  f.raw(`<path d="${E.smooth(BR)}" fill="url(#soot${seed})" opacity="0.6"/>`);
  f.part([[430, 1000], [490, 1004], [488, 1060], [428, 1056]].map(q => [...q, 1]), W.LEA(f, { fill: mix(leathB, P.och, 0.3), inkW: 1.3 })); // patch
  f.stitches([[430, 1000], [490, 1004], [488, 1060], [428, 1056], [430, 1000]], '#c8b890', 1);
  f.part([[650, 1040], [674, 1034], [680, 1060], [656, 1066]], { fill: '#1a120c', shade: 0.3, inkW: 1, cast: false }); f.line([[650, 1040], [674, 1034], [680, 1060], [656, 1066], [650, 1040]], 2, P.ember, { op: 0.7 }); // burn hole
  // wide belt with an iron buckle, sagging under the belly; powder horn and a tin scoop hanging from it
  const belt = [[396, 912], [520, 934], [640, 940], [740, 918], [748, 952], [640, 976], [520, 970], [394, 948]];
  f.part(belt, W.LEA(f, { fill: P.leathD, k: 0.6 }));
  f.line([[404, 930], [520, 952], [640, 958], [738, 936]], 1, P.leathL, { dash: '3 4', op: 0.6 });
  f.part([[612, 928], [664, 926], [668, 974], [614, 976]].map(q => [...q, 1]), { fill: P.ironL, shadow: '#14110f', shade: 0.42, inkW: 1.6, cast: false, tex: 'mottle' + seed, texOp: 0.5 });
  f.part([[624, 940], [652, 938], [654, 962], [626, 964]].map(q => [...q, 1]), { fill: '#1a1614', shade: 0.3, inkW: 1, cast: false });
  f.line([[638, 938], [640, 962]], 3, P.ironL);
  // powder horn on a thong: a curved horn with a wooden plug, scorched
  f.line([[470, 944], [450, 990], [462, 1010]], 2.4, P.leathD);
  f.part([[440, 1000], [478, 1008], [500, 1040], [504, 1080], [494, 1098], [486, 1074], [470, 1044], [446, 1026]], { fill: '#c8b48a', shadow: '#5a4a32', shade: 0.42, inkW: 1.3, cast: false, tex: 'growth' + seed, texOp: 0.5 });
  f.part([[434, 996], [450, 992], [452, 1022], [436, 1026]], { fill: P.wood, shade: 0.4, inkW: 1.1, cast: false });
  for (let i = 0; i < 3; i++) f.line([[452 + i * 12, 1012 + i * 18], [474 + i * 8, 1008 + i * 18]], 1.2, P.brassD);
  // tin scoop
  f.line([[560, 960], [566, 1000]], 2, P.iron);
  f.part([[548, 996], [586, 998], [584, 1040], [552, 1040]], { fill: P.greyL, shadow: P.greyD, shade: 0.42, inkW: 1.2, cast: false });
  f.flat([[552, 1000], [582, 1002], [580, 1012], [554, 1010]], '#120e0c', { op: 0.8 });

  // ---- the belly: bulging out over the belt, scarred, the skin split by seams glowing from inside, blisters ripening
  f.bone('belly');
  const BEL = [[700, 520], [760, 546], [818, 596], [860, 668], [888, 756], [902, 850], [892, 934], [856, 994], [790, 1024], [716, 1020], [664, 990], [644, 916], [656, 780], [672, 620]];
  f.part(BEL, SKN({ fill: mix(skin, '#a88a6c', 0.25), shade: 0.34, maxShade: 52 }));
  f.raw(`<path d="${E.smooth(BEL)}" fill="url(#soot${seed})" opacity="0.55"/>`);
  W.clipDraw(f, BEL, () => {
    f.flat([[760, 590], [840, 640], [876, 730], [870, 800], [830, 720], [780, 650]], '#fff0d8', { op: 0.25 }); // stretched sheen
    for (let i = 0; i < 6; i++) f.line([[720 + i * 22, 600 + i * 30], [760 + i * 22, 640 + i * 30]], 1.4, mix(skin, '#e8d4c0', 0.5), { op: 0.5 }); // stretch marks
    for (let i = 0; i < 14; i++) { const q = W.scatter(f, [790, 860], 70, 60); f.line([q, add(q, [2, 7])], 1, '#1a120c', { op: 0.55 }); } // hair under the navel
    f.flat([[670, 950], [790, 980], [880, 930], [850, 1010], [780, 1030], [690, 1016]], skinS, { op: 0.45 }); // the heavy underside of the sag
    f.stroke([[676, 980], [740, 1004], [810, 1006], [868, 970]], 5, skinS, { op: 0.5 }); // a fold of fat above the underside
  });
  f.line([[846, 836], [852, 850], [846, 866]], 3, INK, { op: 0.8 }); f.flat(ell([848, 850], 6, 11, 0, 8), '#2a1810', { op: 0.6 }); // navel, dragged down by the sag
  f.bone('pelvis'); W.clipDraw(f, BR, () => f.flat([[650, 1000], [760, 1034], [860, 1010], [840, 1044], [740, 1056], [652, 1030]], '#0e0a08', { op: 0.5 })); f.bone('belly'); // the belly's shadow on the breeches
  W.crackNet(f, [770, 680], 0.9, 110, 3.2, { depth: 2 });
  W.crackNet(f, [850, 760], 2.2, 70, 2.6, { depth: 1 });
  W.seam(f, [[700, 860], [740, 880], [780, 876], [820, 900]], 2.4);
  W.glow(f, [800, 760], 120, 120, P.lamp, 0.12, true);
  // scars: a long knife scar with stitch ticks, and a powder-burn starburst
  f.line([[700, 600], [760, 680], [800, 760]], 6, mix(skin, '#e8d0b8', 0.5), { op: 0.8 }); f.line([[700, 600], [760, 680], [800, 760]], 1.4, mix(skin, '#4a2018', 0.6));
  for (let i = 1; i < 6; i++) { const q = lerp([700, 600], [800, 760], i / 6); f.line([add(q, [-6, 4]), add(q, [6, -4])], 1.2, '#4a2018', { op: 0.8 }); }
  f.flat(ell([716, 760], 24, 18, 0, 12), '#2a1a12', { op: 0.5 }); for (let i = 0; i < 8; i++) f.line([[716, 760], add([716, 760], rot([30, 0], i * 0.8))], 1.4, '#2a1a12', { op: 0.5 });
  W.blisters(f, [860, 860], 22, 40, 6, 5, 10);
  W.blisters(f, [740, 560], 24, 14, 3, 4, 7);
  W.beads(f, [800, 820], 50, 50, 6, 1.4);

  // ---- near leg: breeches over a massive thigh, a bare calf, a bare foot with a rag at the ankle
  bareLegFoot(HN, KN, AN, '_n', skin, 124);
  f.bone('shin_n');
  W.blisters(f, lp(KN, AN, 0.4, 20), 20, 20, 3, 4, 7);
  W.splats(f, lp(KN, AN, 0.9, 0), 60, 20, 8);
  breech(HN, KN, '_n', leathB);
  f.raw(`<path d="${E.smooth(K.chain([HN, lerp(HN, KN, 0.84)], [250, 150]))}" fill="url(#soot${seed})" opacity="0.45"/>`);

  // ---- head: thick neck rolling out of the hump, small singed bald head, the stupid satisfied grin
  f.bone('head');
  f.part([[560, 300], [640, 290], [700, 300], [740, 330], [720, 380], [650, 400], [580, 380]], SKN());
  f.stroke([[640, 360], [690, 372], [720, 360]], 3, skinS, { op: 0.6 }); // neck roll
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: mix(skin, '#b09070', 0.25), jaw: 1.32, chin: 0.04, nose: 1.15, hook: -0.2, mouth: 'set', squint: 0.75, browDown: -0.04, age: true,
    eyeWhite: '#b8a880', iris: '#1a120c', hairCol: '#2a2420', browCol: '#3a2a20', browW: 0.02, faceShade: 0.7, jawShade: 0.5,
  });
  f.raw(`<path d="${E.smooth(hF([[-0.4, -0.45], [0.3, -0.48], [0.42, 0.2], [0.3, 0.52], [-0.2, 0.4], [-0.42, 0.0]]))}" fill="url(#soot${seed})" opacity="0.6"/>`);
  // singed scalp: blistered, peeling, a few burnt stubs of hair; glowing crack over the crown
  f.flat(hF(ell([-0.05, -0.38], 0.22, 0.09, -0.15, 12)), mix(skin, '#fff', 0.35), { op: 0.35 });
  for (let i = 0; i < 14; i++) { const q = hF([[-0.38 + (i % 7) * 0.08, -0.36 + Math.floor(i / 7) * 0.12 + (i % 2) * 0.02]])[0]; f.line([q, add(q, [1, -4])], 1.4, '#1a120c', { op: 0.7 }); }
  W.blisters(f, hF([[-0.2, -0.3]])[0], 14, 8, 3, 3, 6);
  W.crackNet(f, hF([[0.0, -0.5]])[0], 2.6, 60, 1.8, { depth: 1 });
  W.flakes(f, hF([[0.1, -0.4]])[0], 16, 8, 3, 0.8);
  // burnt eyebrow stubs
  for (let i = 0; i < 6; i++) { const q = hF([[0.04 + i * 0.03, -0.155 + Math.abs(i - 2.5) * 0.005]])[0]; f.line([q, add(q, [2, -3])], 1.6, '#1a120c'); }
  // the grin: wide, closed, lips pulled up at the corners, cheeks bunched, a tooth missing; black powder smeared round it
  f.flat(hF([[0.02, 0.2], [0.14, 0.26], [0.26, 0.29], [0.36, 0.27], [0.4, 0.22], [0.42, 0.34], [0.32, 0.42], [0.16, 0.4], [0.04, 0.32]]), '#1a1410', { op: 0.75 }); // powder smear
  f.flat(hF([[0.1, 0.26], [0.2, 0.3], [0.32, 0.3], [0.38, 0.24], [0.36, 0.32], [0.24, 0.35], [0.12, 0.32]]), '#120a06');
  for (let i = 0; i < 5; i++) if (i !== 2) f.flat(hF([[0.14 + i * 0.045, 0.3], [0.18 + i * 0.045, 0.3], [0.178 + i * 0.045, 0.325], [0.142 + i * 0.045, 0.325]]), '#a89870');
  f.stroke(hF([[0.06, 0.22], [0.14, 0.27], [0.26, 0.3], [0.36, 0.27], [0.41, 0.2]]), H * 0.016, INK);
  f.line(hF([[0.04, 0.12], [0.06, 0.2], [0.1, 0.26]]), 2, INK, { op: 0.6 }); f.line(hF([[0.4, 0.12], [0.42, 0.18]]), 1.6, INK, { op: 0.5 }); // bunched cheeks
  f.flat(hF(ell([0.12, 0.12], 0.1, 0.07, 0, 10)), mix(skin, '#c86a4a', 0.3), { op: 0.35 }); // flushed cheek
  for (const q of [[0.3, 0.46], [0.2, 0.48]]) f.flat(hF(ell(q, 0.015, 0.02, 0, 6)), '#1a1410', { op: 0.8 }); // powder crumbs on the chin
  W.ash(f, hF([[-0.1, -0.56]])[0], 6, 60, 70, 1);

  // ---- the keg clamped high under the near arm: oak staves bellied out, iron hoops (one burst and sprung), the mouth split
  // open and tilted up toward the far fist, powder heaped in it and pouring from a gap in the staves
  f.bone('keg');
  const ky = t => KR * (1 + 0.1 * Math.sin(t * Math.PI)); // the barrel's belly
  const top = [], bot = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; top.push(KP(t, -ky(t))); bot.push(KP(t, ky(t))); }
  const endE = (t, k = 1) => ell(lerp(B0, B1, t), KR * 0.34 * k, ky(t) * k, kA, 20);
  const back = endE(0).filter((q, i) => i > 5 && i < 15); // the back head's curve, behind
  const body = [...top, ...bot.slice().reverse(), ...back.slice().reverse()];
  f.part([...top, ...endE(1).slice(15).concat(endE(1).slice(0, 6)), ...bot.slice().reverse(), ...endE(0).slice(5, 16)], { fill: '#523620', shadow: '#1a0e06', light: '#8a6440', shade: 0.42, tex: 'wood' + seed, texOp: 0.8 });
  f.raw(`<path d="${E.smooth([...top, ...bot.slice().reverse()])}" fill="url(#soot${seed})" opacity="0.4"/>`);
  for (const v of [-0.75, -0.42, -0.1, 0.22, 0.55, 0.85]) f.line([0, 0.25, 0.5, 0.75, 1].map(t => KP(t, v * ky(t))), 1.8, INK, { op: 0.7 }); // staves
  f.line([0, 0.3, 0.6, 0.9].map(t => KP(t, -0.92 * ky(t))), 2, '#a88458', { op: 0.6 }); // worn-bright top edge
  // hoops: two whole, one burst with its end sprung loose
  for (const t of [0.08, 0.17, 0.62]) { const hp = [KP(t, -ky(t) - 2), KP(t + 0.02, -ky(t) * 0.5), KP(t + 0.03, 0), KP(t + 0.02, ky(t) * 0.5), KP(t, ky(t) + 2)]; f.line(hp, 15, INK); f.line(hp, 11, P.iron); f.line(hp.slice(0, 3), 2, P.ironL, { op: 0.7 }); for (const v of [-0.6, 0, 0.6]) f.rivet(KP(t + 0.02, v * ky(t)), 3.4, P.ironL); }
  { const t = 0.84, hp = [KP(t, -ky(t) - 2), KP(t + 0.02, -ky(t) * 0.5), KP(t + 0.03, 0), KP(t + 0.02, ky(t) * 0.3)]; f.line(hp, 15, INK); f.line(hp, 11, P.iron); const e = KP(t + 0.02, ky(t) * 0.3); f.line([e, add(e, [60, 50]), add(e, [90, 120])], 13, INK); f.line([e, add(e, [60, 50]), add(e, [90, 120])], 9, P.iron); }
  f.part(endE(0, 0.98).slice(5, 16).concat([KP(0.03, 0)]), { fill: '#4e341e', shade: 0.4, inkW: 1.2, cast: false }); // the back head, edge-on
  // the split mouth: the head knocked out, staves broken off unevenly round a dark rim, powder heaped inside
  const mouth = endE(1).map((q, i) => { const jag = [0, 18, 4, 26, 8, 0, 14, 30, 6, 12, 0, 22, 4, 10, 28, 2, 16, 6, 20, 0][i]; return add(q, mul(kd, jag)); });
  f.part(mouth.map((q, i) => i % 3 === 0 ? [...q, 1] : q), { fill: '#7a5634', shadow: '#24160c', shade: 0.4, inkW: 1.5, cast: false, tex: 'wood' + seed });
  f.flat(endE(1, 0.84), '#0c0a08');
  f.part(ell(add(lerp(B0, B1, 1), mul(kn, 18)), KR * 0.26, ky(1) * 0.62, kA, 16), { fill: '#24201c', shadow: '#0a0806', shade: 0.3, inkW: 1, cast: false, tex: 'grain' + seed, texOp: 0.7 }); // powder heap
  for (let i = 0; i < 10; i++) f.flat(ell(add(KP(1, (f.r() - 0.3) * KR * 0.9), mul(kd, (f.r() - 0.5) * 20)), 2.4, 2, 0, 6), '#4a4238', { op: 0.9 });
  // a sprung stave splaying out of the mouth, and the stream of powder pouring through the gap it left
  f.part([KP(0.92, ky(0.92) * 0.55), KP(1.0, ky(1) * 0.6), add(KP(1.06, ky(1) * 0.8), mul(kn, 30)), add(KP(1.02, ky(1) * 0.75), mul(kn, 34))], { fill: '#7a5634', shade: 0.4, inkW: 1.3, cast: false });
  const sp0 = KP(0.97, ky(1) * 0.9);
  f.part([sp0, add(sp0, [26, 0]), add(sp0, [34, 30]), add(sp0, [30, 56]), add(sp0, [16, 50]), add(sp0, [8, 24])], { fill: '#24201c', shadow: '#0a0806', shade: 0.3, inkW: 1, cast: false, tex: 'grain' + seed, texOp: 0.6 });
  for (let i = 0; i < 22; i++) { const q = add(sp0, [20 + (f.r() - 0.5) * 30 * (1 + i / 10), 60 + i * 14 + f.r() * 10]); f.flat(ell(q, 3 - i * 0.08, 2.6 - i * 0.07, 0, 6), '#24201c', { op: 0.85 - i * 0.02 }); } // clumps falling, thinning out
  f.raw(`<ellipse cx="${sp0[0] + 24}" cy="${sp0[1] + 140}" rx="30" ry="90" fill="#3a342e" opacity="0.25" filter="url(#smk${seed})"/>`); // a haze of powder dust
  // a chalked store mark, scratches, a spark-scorch
  { const q = KP(0.45, -0.5 * KR); f.line([add(q, [-14, -14]), add(q, [14, 14])], 4, '#d8c8a0', { op: 0.55 }); f.line([add(q, [14, -14]), add(q, [-14, 14])], 4, '#d8c8a0', { op: 0.55 }); }
  f.scratches(KP(0.6, 0.2 * KR), 50, 6, '#b8a080', 1);
  f.flat(ell(KP(0.7, -0.3 * KR), 18, 12, kA, 10), P.char, { op: 0.5 });

  // ---- near arm: hanging over the keg and clamping it to the flank, the forearm under it, the hand cupping its belly
  W.armRig(f, SN, EN, WN, [150, 80, 64], LIMB({ fill: mix(skin, skinS, 0.12) }), '_n', { capTop: 0.75, bp: [[0, 0.42, 0.42, 0.2], [0, 0.85, 0.08, 0.06], [1, 0.2, 0.42, 0.16]], bq: [[0, 0.36, 0.34, 0.18], [1, 0.14, 0.3, 0.12], [1, 0.88, -0.08, 0.06]] });
  f.bone('forearm_n'); f.part(ell(add(EN, [-8, 8]), 24, 20, 0, 10), SKN({ fill: mix(skin, '#c8a888', 0.12), cast: false, inkW: 1.1, inkHeavy: 1.6, maxShade: 8 })); f.stroke([add(EN, [-30, -6]), add(EN, [-10, 6]), add(EN, [-6, 30])], 3, skinS, { op: 0.6 }); // the elbow's knob and its crease
  f.bone('upperarm_n'); f.flat(ell(lp(SN, EN, 0.06, 26), 34, 22, 0.3, 12), '#f0d8b8', { op: 0.22 }); f.line([lp(SN, EN, 0.3, 60), lp(SN, EN, 0.24, 30)], 2.4, skinS, { op: 0.5 }); // the lit deltoid, its insertion
  f.stroke([lp(SN, EN, 0.5, -80), lp(SN, EN, 0.7, -76), lp(SN, EN, 0.85, -58)], 4, skinS, { op: 0.5 }); // the fat hanging under the arm
  f.bone('upperarm_n');
  f.raw(`<path d="${E.smooth(K.chain([SN, EN], [132, 108]))}" fill="url(#soot${seed})" opacity="0.7"/>`);
  f.stroke([lp(SN, EN, 0.3, -42), lp(SN, EN, 0.55, -50), lp(SN, EN, 0.8, -38)], 4, skinS, { op: 0.65 }); // the triceps' edge
  f.flat(ell(lp(SN, EN, 0.42, 24), 22, 70, Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) + Math.PI / 2, 12), '#f0d8b8', { op: 0.2 }); // the lit biceps
  f.flat(ell(lp(SN, EN, 0.4, -50), 18, 60, Math.atan2(EN[1] - SN[1], EN[0] - SN[0]) + Math.PI / 2, 12), skinS, { op: 0.25 }); // the triceps turning away
  f.stroke([lp(SN, EN, 0.35, 10), lp(SN, EN, 0.6, 2), lp(SN, EN, 0.85, 12)], 3, skinS, { op: 0.5 }); // between biceps and triceps
  f.line([lp(SN, EN, 0.5, 34), lp(SN, EN, 0.7, 40), lp(SN, EN, 0.9, 30)], 2, '#4a3a5a', { op: 0.45 }); // a vein
  W.blisters(f, lp(SN, EN, 0.35, 30), 20, 30, 4, 5, 9);
  W.seam(f, [lp(SN, EN, 0.5, 40), lp(SN, EN, 0.6, 20), lp(SN, EN, 0.75, 36)], 2.2);
  f.bone('torso');
  f.stroke([[548, 470], [604, 506], [664, 488]], 3.4, skinS, { op: 0.65 }); // the deltoid's lower edge (the shoulder mass stays on the torso)
  f.flat([[560, 380], [620, 368], [664, 392], [640, 420], [584, 420]], '#fff2d8', { op: 0.18 });
  f.bone('forearm_n');
  W.crust(f, lp(EN, WN, 0.45, 30), 30, 10, 4, 4, 8, { spikes: 0.3 });
  f.stroke([lp(EN, WN, 0.1, -20), lp(EN, WN, 0.35, -36), lp(EN, WN, 0.7, -26)], 3.4, skinS, { op: 0.65 }); // forearm muscle swelling below the elbow
  f.line([lp(EN, WN, 0.3, 10), lp(EN, WN, 0.6, 16), lp(EN, WN, 0.9, 8)], 1.8, '#4a3a5a', { op: 0.45 });
  f.bone('hand_n');
  const hb = add(WN, [18, -6]);
  f.part([add(hb, [-50, -40]), add(hb, [20, -52]), add(hb, [58, -40]), add(hb, [62, 10]), add(hb, [30, 40]), add(hb, [-40, 44]), add(hb, [-60, 0])], SKN({ cast: false, k: 0.85 })); // the hand's back, cupped under the keg
  for (let i = 0; i < 4; i++) { const b0 = add(hb, [40 + i * 4, -42 + i * 26]), t0 = add(b0, [34, -22 + i * 4]); f.part(K.chain([b0, lerp(b0, t0, 0.55), t0], [30, 26, 20]), SKN({ cast: false, inkW: 1.2, inkHeavy: 1.8 })); f.flat(ell(t0, 7, 5, -0.5, 8), mix(skin, '#e8d8c0', 0.4), { op: 0.7 }); } // thick fingers spread up the keg's belly
  for (let i = 0; i < 3; i++) f.line([add(hb, [-20 + i * 18, -30]), add(hb, [-12 + i * 18, -14])], 1.6, skinS, { op: 0.6 });

  // ---- far forearm across the chest, the fist up at the pectoral with a dripping handful of powder, the lit fuse round the wrist
  f.bone('forearm_f');
  const FAF = K.chain([EF, WF], [96, 62], { steps: 12, bp: [[0, 0.22, 0.42, 0.16], [0, 0.88, -0.08, 0.06]], bq: [[0, 0.18, 0.3, 0.14]] });
  f.part(FAF, LIMB({ fill: mix(skin, skinS, 0.15) }));
  f.flat(ell(lp(EF, WF, 0.25, -18), 40, 16, Math.atan2(WF[1] - EF[1], WF[0] - EF[0]), 12), '#f0d8b8', { op: 0.2 }); // the lit belly of the forearm
  f.raw(`<path d="${E.smooth(FAF)}" fill="url(#soot${seed})" opacity="0.6"/>`);
  f.stroke([lp(EF, WF, 0.1, 30), lp(EF, WF, 0.3, 46), lp(EF, WF, 0.55, 30)], 3, skinS, { op: 0.55 }); f.line([lp(EF, WF, 0.2, -10), lp(EF, WF, 0.5, -16), lp(EF, WF, 0.8, -8)], 1.6, '#4a3a5a', { op: 0.45 }); // forearm muscle and a vein
  f.bone('fuse');
  const fw = lp(EF, WF, 0.86, 0);
  W.fuse(f, [lp(EF, WF, 0.84, -46), lp(EF, WF, 0.88, 0), lp(EF, WF, 0.86, 46)], 5, { lit: false });
  W.fuse(f, [lp(EF, WF, 0.86, 44), add(fw, [40, 50]), add(fw, [30, 110]), add(fw, [60, 150])], 4.4);
  f.part(ell(lp(EF, WF, 0.86, 44), 9, 8, 0, 8), { fill: '#5a4a30', shade: 0.4, inkW: 1.1, cast: false }); // the knot
  f.bone('hand_f');
  const gf = B.grip(f, WF, EF, -Math.PI / 2, 70, mix(skin, skinS, 0.1), { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: 'ogre powder fist', inline: true }); // a closed handful, not a haft: the fist follows the forearm
  f.part(W.lumpy(f, ell(add(WF, [10, -44]), 34, 14, -0.3, 12), 6), { fill: '#2a2622', shadow: '#0a0806', shade: 0.3, inkW: 1, cast: false, tex: 'grain' + seed, texOp: 0.8 }); // powder heaped on the fist
  for (let i = 0; i < 12; i++) f.flat(ell(add(WF, [(f.r() - 0.5) * 40, -54 + f.r() * 12]), 2.4, 2, 0, 6), '#3a342e', { op: 0.9 });
  for (const [dx, l] of [[30, 90], [-24, 60], [6, 120]]) { f.stroke([add(WF, [dx, 30]), add(WF, [dx + 3, 30 + l * 0.5]), add(WF, [dx + 2, 30 + l])], 4, '#1e1a16', { op: 0.85 }); } // trickling between the fingers

  f.bone('root');
  f.flat(ell([560, gy + 2], 400, 12, 0, 24), '#3a3020', { op: 0.5 });
  f.flat(ell([780, gy - 2], 90, 9, 0, 16), '#1e1a16', { op: 0.85 }); // a heap of spilt powder
  for (let i = 0; i < 18; i++) f.flat(ell([700 + f.r() * 170, gy - 4 - f.r() * 8], 2, 1.6, 0, 6), '#3a342e', { op: 0.9 });
  W.crust(f, [240, gy - 4], 50, 5, 5, 4, 8, { spikes: 0.3 });
  return f;
}
// a torn, ragged hem strip between two points, hanging down a little (for breeches cuffs)
function ragHem(f, a, b, d) { const pts = [a, b]; const n = 7; const out = [add(a, [0, -d]), add(b, [0, -d])]; for (let i = 0; i <= n; i++) { const q = lerp(b, a, i / n); out.push([...add(q, [0, (i % 2 ? d * 0.4 : d * 1.2) * (0.7 + f.r() * 0.6)]), i % 2 ? 0 : 1]); } return out; }

// ------------------------------------------------------------------ MIASMA MATRIARCH (elite, 2.0)
// The mine-owner's wife, who came down to see the gas. Her head has swollen to nearly twice the length of her body: skin
// stretched by pressure from inside, not a ball. The mass is lopsided and heavy: the back of the skull has sagged out and
// down into a hanging lobe over the nape, the cheeks have dropped into jowls that hang below the jaw, and everything droops
// toward the knot of the neck. The scalp is pulled thin where the hair is drawn back, so the hair has parted into sparse
// clumps with yellow scalp and follicles between them; stretch marks rake the crown, the temple and the lobes. The features
// are dragged apart and down: one slit eye pulled out toward the ear, the other high and small at the far edge, the nose
// flattened into a smear, the mouth a small puckered hole dragged low over the jowl. Her fine little hat is still pinned on
// the crown. Her body is a small woman's, hanging limp in its faded dress: sloped shoulders, a corseted waist, arms dangling
// with the hands open, the feet pointed down, one shoe lost. Two gas-headed young drift in her wake.
// Rig: float (root, at the neck) > head; float > torso > arms, skirt, shins and feet (dangling); float > young_1, young_2.
// Motion: idle drifting and bobbing (float, head, the body swinging); attack a slow exhalation of choking gas (the head
// dips forward, the mouth leaks a cloud).
function miasmaMatriarch() {
  const seed = 403, h = TIERS.elite[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1400 }));
  W.textures(f);
  const gy = f.o.groundY;
  const gasSk = '#b89a48', gasD = '#5a4620', gasL = '#e8d692', vein = '#4a3826', hairC = '#3a2c1e', stria = '#f0e2b4';
  const dress = '#8a7c66', dressD = '#5a5042', lace = '#d2c8b0', skin = '#b8a080', skinD = '#5a4436';
  const neck = [604, 852];
  f.joint('float', neck).joint('head', neck, 'float').joint('torso', [602, 870], 'float');
  const SN = [568, 894], EN = [556, 990], WN = [550, 1080], SF = [642, 890], EF = [654, 984], WF = [652, 1072];
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('skirt', [596, 1006], 'torso');
  const KN = [574, 1128], AN = [556, 1252], KF = [618, 1124], AF = [616, 1240];
  f.joint('shin_n', KN, 'skirt').joint('foot_n', AN, 'shin_n').joint('shin_f', KF, 'skirt').joint('foot_f', AF, 'shin_f');
  const Y1 = [176, 1046], Y2 = [126, 498];
  f.joint('young_1', Y1, 'float').joint('young_2', Y2, 'float');

  // ---- the swollen head, defined once at full size around the knot K0 where the neck pinches into it.
  const K0 = [606, 808];
  // outline: tight and taut over the crown, heavy and sagging below; the occipital lobe hangs lowest at the back (left),
  // the jowl hangs on the front (right), the face is a dented, dragged plane at the front edge
  const HEAD = [[642, 814], [676, 842], [730, 866], [796, 874], [858, 850], [900, 800], [916, 744], [914, 700], [926, 664, 1], [944, 628], [958, 590], [962, 552], [944, 514], [912, 482, 1], [920, 436], [904, 352], [864, 262], [798, 186], [708, 130], [604, 106], [494, 114], [394, 154], [306, 226], [242, 330], [210, 456], [204, 588], [222, 704], [270, 806], [350, 890], [446, 928], [522, 908], [566, 862], [586, 822]];
  const OCC = [[206, 610], [246, 676], [318, 724], [410, 762], [500, 800], [560, 838], [566, 862], [522, 908], [446, 928], [350, 890], [270, 806], [222, 704]]; // the back of the skull, sagged
  const JOWL = [[904, 650], [916, 700], [916, 746], [900, 800], [858, 850], [796, 874], [730, 866], [676, 842], [650, 818], [700, 790], [778, 748], [850, 704], [886, 668]]; // the dropped cheek
  const swollen = (c, k, a, o = {}) => {
    const T = pts => pts.map(q => { const r = add(c, rot(mul(sub(q, K0), k), a)); return q[2] ? [r[0], r[1], 1] : r; });
    const P1 = q => T([q])[0];
    const w = v => Math.max(0.7, v * k), full = !o.young;
    const blur = k > 0.5 ? 'glowL' : 'glow';
    const soft = (q, rx, ry, col, op, ang = 0) => { const p = P1(q); f.raw(`<ellipse cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" rx="${(rx * k).toFixed(1)}" ry="${(ry * k).toFixed(1)}" transform="rotate(${((ang + a) * D).toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)})" fill="${col}" opacity="${op}" filter="url(#${rx * k > 60 ? blur : 'glow'}${seed})"/>`); };
    const crease = (pts, ww, op = 0.85, col = mix(gasD, '#000', 0.45)) => f.stroke(T(pts), w(ww), col, { op });
    const H = T(HEAD);
    const SKIN = (oo = {}) => Object.assign({ fill: gasSk, shadow: gasD, light: gasL, shade: 0.34, maxShade: 54 * k + 5, tex: 'mottle' + seed, texOp: 0.28, k: 0.9, inkW: w(1.8) + 0.5, inkHeavy: w(4.2) + 0.6, castOp: 0.32 }, oo);
    f.part(H, SKIN());
    W.clipDraw(f, H, () => {
      // gas turning inside, seen through the thin skin of the crown: soft ochre swirls and a lit heart high up
      for (let i = 0; i < 5; i++) { const q = W.scatter(f, [560, 360], 260, 160); soft(q, W.R(f, 60, 130), W.R(f, 24, 60), f.r() > 0.5 ? P.och : P.smoke, 0.3, f.r() * 3); }
      soft([660, 290], 230, 150, gasL, 0.42);
      // the heavy lower half turns away from the light: a broad core shadow low on the back
      soft([380, 640], 260, 300, '#3e2e12', 0.5); soft([500, 860], 200, 60, '#3e2e12', 0.4);
      // the hanging lobes: skin pouches with no outline of their own, shaded by their own form; the fold above each is
      // a tapered crease with the overhang's shadow under it and a lit lip just above it
      const lobe = (pts, cr, o2 = {}) => {
        f.part(T(pts), SKIN(Object.assign({ inkW: 0, inkHeavy: 0, cast: true, castOp: 0.4 }, o2)));
        crease(cr.map(q => add(q, o2.sh ?? [0, 10])), (o2.cw ?? 7) * 2.6, 0.35, '#3e2e12');
        crease(cr, o2.cw ?? 7, 0.85);
        f.line(T(cr.slice(1, -1).map(q => add(q, o2.lit ?? [4, -7]))), w(2), gasL, { op: 0.6 });
      };
      lobe(OCC, [[206, 610], [246, 676], [318, 724], [410, 762], [500, 800], [560, 838]], { fill: mix(gasSk, '#9a7a3a', 0.2), maxShade: 40 * k + 4 });
      lobe(JOWL, [[904, 650], [886, 668], [850, 704], [778, 748], [700, 790], [650, 818]], { fill: mix(gasSk, '#a88a48', 0.15), maxShade: 34 * k + 4, sh: [-4, 10] });
      // the face plane, dented and dragged: soft planes and creases, no stuck-on features
      soft([830, 540], 90, 46, gasL, 0.45, -0.2); // the cheek's top catching the light
      soft([800, 470], 90, 22, '#2e2010', 0.55, -0.1); // socket shadow under the brow
      soft([880, 640], 50, 40, '#3e2e12', 0.35); // the hollow beside the mouth
      crease([[930, 420], [880, 422], [820, 428], [756, 446], [716, 466]], 6, 0.75); // brow overhang fold
      crease([[924, 574], [890, 600], [840, 618], [780, 616], [740, 596]], 5, 0.6); // under the cheek bag
      crease([[740, 492], [704, 506], [668, 530]], 3, 0.6); crease([[742, 500], [712, 528], [690, 560]], 2.4, 0.5); // the outer corner of the eye dragged back toward the ear in long creases
      // the near eye: a swollen upper lid, the slit pulled long and slanting down to the outer corner, a wet glint
      soft([810, 460], 70, 16, gasL, 0.5, -0.1);
      f.stroke(T([[744, 492], [790, 480], [840, 470], [880, 464]]), w(10), INK);
      f.stroke(T([[766, 484], [812, 474], [852, 468]]), w(3.4), '#c8b468', { op: 0.85 });
      f.flat(T(ell([822, 474], 4, 3, 0, 8)), '#1a120c'); f.flat(T(ell([836, 470], 2.4, 1.6, 0, 6)), '#fffbe8', { op: 0.9 });
      crease([[748, 506], [800, 504], [866, 486]], 2.6, 0.55); // lower lid bag
      for (let i = 0; i < 5; i++) { const q = P1([772 + i * 22, 480 - i * 3]); f.line([q, add(q, rot([w(2), w(8)], a))], w(1.2), INK, { op: 0.6 }); } // lashes spaced far apart
      // the far eye, high and small at the edge, beyond the flattened bridge
      soft([930, 446], 18, 10, '#2e2010', 0.5);
      f.stroke(T([[912, 452], [928, 446], [944, 448]]), w(6), INK);
      if (full) {
        for (let i = 0; i < 9; i++) { const q = P1([724 + i * 20, 430 - Math.sin(i / 8 * Math.PI) * 10]); f.line([q, add(q, rot([w(9), -w(3)], a))], w(1.5), mix(hairC, '#000', 0.3), { op: 0.8 }); } // brow hairs spread thin
        for (let i = 0; i < 3; i++) { const q = P1([910 + i * 9, 418]); f.line([q, add(q, rot([w(8), -w(2)], a))], w(1.3), mix(hairC, '#000', 0.3), { op: 0.8 }); }
      }
      // the nose pressed flat and dragged down into a smear: a lit bridge, the tip a low swell, nostrils pulled into slits
      f.line(T([[890, 486], [920, 522], [946, 556]]), w(3), gasL, { op: 0.55 });
      soft([944, 556], 22, 14, '#fff6d8', 0.5);
      soft([920, 590], 34, 10, '#3e2e12', 0.5);
      f.stroke(T([[904, 592], [926, 596], [950, 592]]), w(4.4), '#2a1a0e');
      crease([[902, 556], [894, 576], [904, 594]], 2.4, 0.7);
      // the mouth: a small puckered hole dragged low toward the jowl, the lips stretched thin into it, pucker creases
      const MO = [[878, 660], [890, 652], [902, 658], [906, 668], [898, 678], [886, 680], [878, 672]];
      f.flat(T(MO.map(q => add(mul(sub(q, [892, 666]), 1.6), [892, 666]))), '#8a6a3a', { op: 0.4 });
      f.flat(T(MO), '#120806');
      f.flat(T([[892, 676], [904, 678], [908, 672]]), '#5a3a1c', { op: 0.8 });
      for (let i = 0; i < 10; i++) { const aa = i * 0.63 + 0.3, r0 = 20, r1 = 30 + ((i * 7) % 4) * 7; crease([add([892, 666], rot([r0, 0], aa)), add([892, 666], rot([r1, 0], aa + 0.12))], 2.6, 0.6); }
      W.drip(f, P1([890, 684]), Math.max(0.4, k * 0.9), '#d8c890');
      // bruised, ripening patches
      for (const [q, rx, ry] of [[[300, 560], 60, 40], [[700, 760], 50, 30], [[480, 300], 40, 30]]) f.flat(T(ell(q, rx, ry, 0.4, 12)), '#7a5a30', { op: 0.22 });
      // stretch marks: rakes of pale, sunken streaks across the most stretched skin (crown, temple, lobes, jowl)
      const striae = (cc, a0, n, L, sp) => { for (let i = 0; i < n; i++) { const off = (i - n / 2) * sp + (f.r() - 0.5) * sp * 0.4, ll = L * W.R(f, 0.55, 1.1), q = add(cc, rot([(f.r() - 0.5) * L * 0.3, off], a0)), a1 = add(q, rot([-ll / 2, 0], a0)), b1 = add(q, rot([ll / 2, 0], a0)), m1 = q, th = sp * 0.24; f.flat(T([a1, add(m1, rot([0, -th], a0)), b1, add(m1, rot([0, th * 0.6], a0))]), stria, { op: 0.75 }); f.line(T([a1, add(m1, rot([0, th * 0.8], a0)), b1]), w(1.2), mix(gasD, '#000', 0.2), { op: 0.55 }); } };
      if (full) { striae([440, 200], -0.45, 7, 110, 14); striae([820, 268], 0.95, 6, 90, 13); striae([300, 800], 0.62, 7, 120, 15); striae([790, 846], -0.15, 5, 100, 12); striae([236, 470], 1.55, 6, 90, 13); striae([600, 760], 0.1, 4, 70, 12); }
      else { striae([440, 200], -0.45, 4, 110, 24); striae([300, 800], 0.62, 4, 120, 26); }
      // veins: dark, branching up out of the neck and round the lobes, thinning as they climb the stretched dome
      const veinNet = (p0, a2, L, ww, d) => { const pts2 = [p0]; let q = p0, b2 = a2; for (let i = 0; i < 4; i++) { b2 += (f.r() - 0.5) * 0.6; q = add(q, rot([L / 4, 0], b2)); pts2.push(q); } f.stroke(T(pts2), w(ww), vein, { op: 0.7 }); if (d > 0) for (let i = 1; i < 4; i++) if (f.r() < 0.6) veinNet(pts2[i], b2 + (f.r() > 0.5 ? 0.7 : -0.7), L * 0.55, ww * 0.6, d - 1); };
      for (const [q, a2, L] of [[[590, 840], -1.85, 330], [[660, 830], -1.2, 300], [[520, 860], -2.5, 280], [[400, 900], -2.7, 220], [[820, 860], -0.6, 200]]) veinNet(q, a2, L, 4.6, full ? 2 : 1);
      // curved hatching wrapping the shadow side, following the round of the mass
      const hc = [640, 380];
      for (let i = 0; i < (full ? 22 : 9); i++) { const r0 = 300 + (i % 5) * 26, a0 = 1.55 + i * (full ? 0.07 : 0.17), arc = []; for (let s = 0; s < 6; s++) arc.push(P1(add(hc, rot([r0 + s * 4, 0], a0 + s * 0.06)))); f.line(arc, w(1.3), INK, { op: 0.3 }); }
      // a stretched, tight sheen toward the key light: on the forehead, the crown, the jowl, the occipital lobe
      for (const pts of [[[700, 156], [790, 192], [852, 262], [880, 330], [846, 300], [790, 230], [728, 182]], [[860, 720], [890, 740], [896, 778], [878, 756]], [[440, 150], [500, 132], [540, 130], [492, 146]], [[380, 790], [440, 812], [480, 834], [430, 822]]]) f.flat(T(pts), '#fff8e0', { op: 0.45 });
    });
    const m = P1([892, 666]);
    // the ear, dragged down and back, the lobe drawn out long
    const EAR = [[606, 494], [632, 486], [648, 516], [642, 600], [632, 664], [614, 700], [598, 684], [598, 604]];
    f.part(T(EAR), SKIN({ fill: mix(gasSk, '#b08060', 0.3), maxShade: 10 * k + 2, cast: true, inkW: w(1.3), inkHeavy: w(2) }));
    f.line(T([[618, 502], [636, 530], [630, 610], [618, 668]]), w(1.6), P.ochD, { op: 0.8 }); f.flat(T([[612, 520], [628, 530], [624, 600], [612, 596]]), '#5a3a1a', { op: 0.45 });
    // blisters ripening in the creases; glowing splits where the crown is stretched thinnest
    if (full) {
      W.blisters(f, P1([380, 830]), 70, 30, 6, 7, 13);
      W.blisters(f, P1([780, 826]), 40, 16, 4, 5, 9);
      W.hairline(f, T([[430, 170], [470, 204], [478, 250], [506, 286]]), 1.6);
      W.seam(f, T([[800, 236], [824, 266], [826, 300], [850, 322]]), 2.2);
      W.hairline(f, T([[226, 430], [246, 480], [238, 530]]), 1.4);
      W.flakes(f, P1([290, 600]), 30, 40, 4, 1);
    } else {
      W.blisters(f, P1([380, 830]), 70 * k, 30 * k, 2, 2, 3);
      W.hairline(f, T([[430, 170], [470, 204], [478, 250]]), 1);
    }
    // hair drawn back to the bun on the crown. On her the scalp is pulled so thin that the hair has thinned to a veil of
    // strands in uneven clumps, parted wide, the yellow scalp and its follicles showing between; on the young, a few wisps
    const B0 = [604, 118], C0 = [560, 500];
    const hairPath = (s, bend) => { const L0 = E.len(sub(s, B0)), mid = lerp(s, B0, 0.45), ctl = add(mid, mul(E.norm(sub(mid, C0)), L0 * bend)), pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(add(add(mul(s, (1 - t) ** 2), mul(ctl, 2 * t * (1 - t))), mul(B0, t * t))); } return pts; };
    const HL = [[782, 214], [764, 270], [736, 328], [700, 386], [658, 440], [610, 480], [560, 540], [506, 604], [440, 662], [366, 700], [296, 690], [244, 640], [214, 560]];
    const along = t => { const u = t * (HL.length - 1), i = Math.min(HL.length - 2, Math.floor(u)); return lerp(HL[i], HL[i + 1], u - i); };
    W.clipDraw(f, H, () => {
      if (full) {
        const HZ = [...HL, [216, 470], [262, 320], [360, 196], [480, 128], [604, 108], [720, 140]];
        f.raw(`<path d="${E.smooth(T(HZ))}" fill="${hairC}" opacity="0.2" filter="url(#glow${seed})"/>`); // the thinned hair as a faint veil over the scalp, no hard edge
        W.clipDraw(f, T(HZ), () => { for (let i = 0; i < 220; i++) { const q = P1(W.scatter(f, [480, 400], 300, 300)); f.flat(ell(q, w(1.5), w(1.1), 0, 5), '#3a2a18', { op: 0.5 }); } });
        // clumps: a few dense, most thin, with bare partings between; widths and spacing uneven
        const clumps = [[0.02, 4, 2.4], [0.2, 6, 2.8], [0.38, 5, 2.6], [0.5, 3, 1.6], [0.6, 7, 3], [0.79, 5, 2.6], [0.95, 3, 1.4]];
        for (const [t0, n, wd] of clumps) {
          const s0 = along(t0);
          for (let j = 0; j < n; j++) { const s = add(s0, [(f.r() - 0.5) * 18, (f.r() - 0.5) * 18]), pts = hairPath(s, 0.26 + f.r() * 0.1); f.line(T(pts.slice(0, 9 + Math.floor(f.r() * 4))), w(wd * W.R(f, 0.4, 0.75)), hairC, { op: 0.7 }); }
          const pts = hairPath(s0, 0.3); f.line(T(pts.slice(3, 9).map(q => add(q, [3, -3]))), w(1.1), '#8a7450', { op: 0.55 }); // a lit strand on the clump
        }
        // stray hairs at the hairline, sparse, lifting off the stretched skin
        for (let i = 0; i < 16; i++) { const q = along(i / 15); f.line(T([q, add(q, [-6, -12]), add(q, [-4, -22])]), w(1), hairC, { op: 0.7 }); }
      } else for (const s of [[720, 220], [560, 330], [420, 380], [300, 320]]) f.line(T(hairPath(s, 0.2).slice(0, 8)), w(5), hairC, { op: 0.8 });
    });
    if (full) { f.part(T(ell([604, 124], 40, 22, -0.15, 12)), { fill: hairC, shadow: '#16100a', shade: 0.4, tex: 'hatch' + seed, texOp: 0.4, inkW: 1.3, cast: false }); for (let i = 0; i < 5; i++) f.line(T([[574 + i * 14, 108], [588 + i * 10, 126], [580 + i * 12, 140]]), 1, '#6a5a40', { op: 0.6 }); } // the bun
    return { T, P1, m };
  };

  // ---- the young, drifting behind her (drawn first): a swollen infant head over a limp little body in a christening gown
  const young = (c, k, a, bn) => {
    f.bone(bn);
    // the gown and the limp little body hang plumb from the knot of the neck; s scales the body with the head
    const s = k / 0.2, nk = add(c, [0, 6]), Q = (x, y, sh) => sh ? [...add(nk, [x * s, y * s]), 1] : add(nk, [x * s, y * s]);
    const GOWN = [Q(-10, 2), Q(12, 2), Q(20, 30), Q(24, 62), Q(18, 76), Q(6, 72, 1), Q(-4, 80), Q(-14, 74, 1), Q(-20, 60), Q(-18, 26)];
    for (const [dx, dl] of [[-6, 0], [8, 6]]) { const kk = Q(dx, 72), an = Q(dx * 1.2, 94 + dl); f.part(limb(kk, an, 9 * s, 5.5 * s, { steps: 8, p: [[0.35, 0.3, 0.2]] }), { fill: skin, shadow: P.skinS, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'mottle' + seed, texOp: 0.4 }); f.part([add(an, [-3 * s, -3 * s]), add(an, [3 * s, -3 * s]), add(an, [6 * s, 7 * s]), add(an, [3 * s, 11 * s]), add(an, [-2 * s, 5 * s])], { fill: skin, shadow: P.skinS, shade: 0.4, inkW: 1, cast: false, hatch: false }); }
    f.part(GOWN, { fill: P.canvasL, shadow: P.canvasD, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.2, inkHeavy: 2 });
    f.line([Q(-4, 20), Q(-8, 70)], 1, P.canvasD, { op: 0.8 }); f.line([Q(8, 20), Q(12, 66)], 1, P.canvasD, { op: 0.8 });
    for (let i = 0; i < 4; i++) f.flat(ell(Q(-14 + i * 9, 76 - (i % 2) * 4), 1.6, 1.4, 0, 5), P.canvasD, { op: 0.8 }); // lace eyelets
    f.flat(ell(Q(6, 54), 6 * s, 4 * s, 0.3, 8), P.char, { op: 0.5 }); // scorch
    const arm = (s0, dx) => { const e0 = add(s0, [dx * s, 22 * s]), w0 = add(e0, [dx * 0.5 * s, 20 * s]); f.part(limb(s0, e0, 10 * s, 7 * s, { steps: 6, p: [[0.2, 0.3, 0.2]] }), { fill: P.canvasL, shadow: P.canvasD, shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed }); f.part(limb(e0, w0, 6.5 * s, 4.5 * s, { steps: 6, p: [[0.3, 0.25, 0.2]] }), { fill: skin, shadow: P.skinS, shade: 0.4, inkW: 1, cast: false }); f.part([add(w0, [-3 * s, -1 * s]), add(w0, [3 * s, -1 * s]), add(w0, [4 * s, 7 * s]), add(w0, [1 * s, 10 * s]), add(w0, [-3 * s, 7 * s])], { fill: skin, shadow: P.skinS, shade: 0.4, inkW: 0.9, cast: false, hatch: false }); };
    arm(Q(-12, 10), -3); arm(Q(14, 10), 2);
    const R0 = swollen(add(c, [0, -2]), k, a, { young: true });
    W.smoke(f, R0.m, 150 * k + 30, 40 * k + 8, { col: '#b09650', op: 0.38, sway: 20 * k + 4, drift: 60 * k + 8, phase: 1.2 });
  };
  young(Y2, 0.2, 0.22, 'young_2');
  young(Y1, 0.27, -0.16, 'young_1');

  // ---- her body, hanging limp and trailing a little behind as she drifts: far arm, dangling legs, skirt, bodice, near arm
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinD, shade: 0.38, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const DRS = (o = {}) => Object.assign({ fill: dress, shadow: '#36302a', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 }, o);
  // a bare forearm with a muscle belly below the elbow, a narrow wrist and the ulna knob
  const forearm = (E0, W0, look) => { f.part(limb(E0, W0, 30, 19, { steps: 12, p: [[0.25, 0.22, 0.16]], q: [[0.18, 0.12, 0.14], [0.92, 0.12, 0.05]] }), look); f.line([lp(E0, W0, 0.12, -6), lp(E0, W0, 0.45, -9), lp(E0, W0, 0.8, -5)], 1, INK, { op: 0.35 }); f.line([lp(E0, W0, 0.3, 5), lp(E0, W0, 0.62, 4)], 1, '#4a3a5a', { op: 0.4 }); };
  // a sleeve: the full leg-o'-mutton cap at the shoulder narrowing to a fitted elbow, folds hanging down from the cap
  const sleeve = (S0, E0, look, dk) => { f.part(limb(S0, add(E0, [0, 8]), 46, 28, { steps: 12, p: [[0.22, 0.3, 0.16]], q: [[0.22, 0.2, 0.16]] }), look); for (const t of [0.35, 0.55, 0.75]) f.line([lp(S0, E0, t - 0.12, -12), lp(S0, E0, t, 0), lp(S0, E0, t - 0.08, 14)], 1.4, dk, { op: 0.7 }); f.stroke([lp(S0, E0, 0.2, 18), lp(S0, E0, 0.5, 14), lp(S0, E0, 0.8, 12)], 3, dk, { op: 0.6 }); };
  f.bone('upperarm_f'); sleeve(SF, EF, DRS({ fill: dressD, shadow: '#2e2a22' }), '#2a2620');
  f.bone('forearm_f'); forearm(EF, WF, SKN({ fill: mix(skin, skinD, 0.25) }));
  f.part([lp(EF, WF, 0.02, -18), lp(EF, WF, 0.02, 18), lp(EF, WF, 0.2, 16), lp(EF, WF, 0.2, -16)], { fill: mix(lace, '#000', 0.2), shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed });
  f.bone('hand_f'); B.hand(f, add(WF, [1, 12]), 1.66, 16, mix(skin, skinD, 0.25), { spread: 0.08, curl: 0.45, shadow: '#3a2a22' });
  // legs dangling, the feet pointed down as a hanging body's do: the far one in a torn stocking with its shoe gone, the
  // near one still in a buttoned boot. Calves swell at the back, the shin runs straight at the front, the ankle narrows.
  const shin = (Kk, A, look) => f.part(limb(Kk, A, 32, 16, { steps: 14, p: [[0.32, 0.34, 0.15]], q: [[0.04, 0.16, 0.06], [0.9, 0.12, 0.05]] }), look);
  const pointedFoot = (A, look, o = {}) => { const pts = [add(A, [-10, -6]), add(A, [9, -6]), add(A, [16, 10]), add(A, [24, 34]), add(A, [26, 50]), [...add(A, [20, 58]), 1], add(A, [10, 54]), add(A, [2, 36]), add(A, [-10, 16]), add(A, [-14, 4])]; f.part(pts, look); if (o.toes) { for (let i = 0; i < 3; i++) f.line([add(A, [12 + i * 4, 50 - i * 2]), add(A, [14 + i * 4, 56 - i * 2])], 1, INK, { op: 0.6 }); } return pts; };
  f.bone('shin_f'); shin(KF, AF, { fill: '#5e5648', shadow: '#2a2620', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.line([lp(KF, AF, 0.3, 8), lp(KF, AF, 0.55, 12), lp(KF, AF, 0.7, 10)], 1, '#3a342a', { op: 0.7 }); // a ladder in the stocking
  f.flat(ell(lp(KF, AF, 0.5, 4), 5, 9, 0.1, 8), skin, { op: 0.85 }); // skin through the hole
  f.bone('foot_f'); pointedFoot(AF, { fill: '#5e5648', shadow: '#2a2620', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, { toes: true });
  f.flat(ell(add(AF, [20, 48]), 7, 6, 0.6, 8), skin, { op: 0.9 }); // the stocking worn through at the toes
  f.bone('shin_n'); shin(KN, AN, { fill: '#4e483c', shadow: '#22201a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.bone('foot_n');
  pointedFoot(AN, { fill: '#2e2620', shadow: '#0e0a08', shade: 0.42, tex: 'mottle' + seed, texOp: 0.5 });
  f.part([add(AN, [-12, -26]), add(AN, [10, -28]), add(AN, [12, -4]), add(AN, [-12, -2])], { fill: '#2e2620', shadow: '#0e0a08', shade: 0.42, inkW: 1.2, cast: false }); // the boot shaft
  for (let i = 0; i < 5; i++) f.flat(ell(add(AN, [8, -22 + i * 9]), 2, 2, 0, 6), P.boneD); // boot buttons
  f.part([add(AN, [-14, 4]), add(AN, [-6, 2]), add(AN, [-4, 14]), add(AN, [-12, 16])], { fill: '#1a1410', shade: 0.3, inkW: 1, cast: false }); // heel
  f.line([add(AN, [12, 10]), add(AN, [20, 34]), add(AN, [22, 48])], 1.2, '#6a5a4a', { op: 0.6 }); // worn-bright edge of the toe
  // skirt: a once-fine bell skirt hanging limp, swinging a little behind; deep folds, mould in them, the hem charred
  f.bone('skirt');
  const SKIRT = [[566, 996], [630, 996], [648, 1026], [664, 1070], [674, 1118], [672, 1146], [648, 1158, 1], [622, 1144], [596, 1164, 1], [566, 1150], [536, 1168, 1], [508, 1152], [486, 1142, 1], [494, 1090], [518, 1040], [546, 1010]];
  f.part(SKIRT, DRS({ texOp: 0.45 }));
  W.clipDraw(f, SKIRT, () => {
    for (const [x0, x1, x2] of [[560, 532, 510], [584, 574, 566], [610, 616, 622], [632, 650, 660]]) { f.stroke([[x0, 1004], [x1, 1080], [x2, 1156]], 9, '#3a342c', { op: 0.55 }); f.line([[x0 + 7, 1010], [x1 + 9, 1080], [x2 + 9, 1150]], 1.6, mix(dress, '#fff', 0.3), { op: 0.45 }); }
    f.flat([[480, 1112], [690, 1104], [690, 1180], [480, 1180]], P.char, { op: 0.45 });
    for (let i = 0; i < 8; i++) { const q = W.scatter(f, [580, 1076], 70, 50); f.flat(ell(q, 6 + f.r() * 8, 4 + f.r() * 5, f.r() * 3, 8), '#9a9a6a', { op: 0.35 }); } // mould bloom
    f.part([[506, 1050], [540, 1046], [544, 1072], [508, 1076]], { fill: mix(dress, P.och, 0.3), shade: 0.4, tex: 'weave' + seed, inkW: 1, cast: false }); // a darn
    f.stitches([[506, 1050], [540, 1046], [544, 1072], [508, 1076], [506, 1050]], '#c8bca0', 0.8);
  });
  f.part([[488, 1126], [530, 1134], [560, 1128], [600, 1134], [640, 1126], [672, 1128], [672, 1146], [648, 1158, 1], [622, 1144], [596, 1164, 1], [566, 1150], [536, 1168, 1], [508, 1152], [486, 1142, 1]], { fill: lace, shadow: '#7a7262', shade: 0.4, tex: 'weave' + seed, texOp: 0.6, inkW: 1.1, cast: false }); // the flounce
  for (let i = 0; i < 9; i++) f.flat(ell([498 + i * 20, 1142 + (i % 2) * 6], 3, 3, 0, 6), '#5a5042', { op: 0.6 }); // lace holes
  for (const q of [[536, 1168], [596, 1164], [648, 1158]]) W.seam(f, [add(q, [-8, -6]), q, add(q, [6, -8])], 1.3, { glowOp: 0.3 });
  W.ash(f, [580, 1152], 6, 120, 50, 0.8);
  // ---- bodice: a small woman's torso in a fitted, boned bodice: sloped shoulders, the bust, the corseted waist
  f.bone('torso');
  const BOD = [[588, 850], [622, 852], [640, 862], [656, 880], [664, 900], [666, 920], [670, 942], [656, 962], [640, 984], [634, 1008], [596, 1014], [560, 1008], [560, 984], [552, 950], [546, 914], [552, 890], [570, 866]];
  f.part(BOD, DRS({ shade: 0.42 }));
  W.clipDraw(f, BOD, () => {
    f.flat([[604, 950], [636, 944], [668, 940], [662, 966], [636, 970], [606, 966]], '#2e2a22', { op: 0.5 }); // the shadow under the bust
    f.flat([[620, 880], [656, 884], [668, 918], [650, 930], [626, 914]], mix(dress, '#fff', 0.35), { op: 0.3 }); // the lit top of the bust
    for (const [a0, b0] of [[[584, 900], [576, 1006]], [[630, 966], [618, 1008]]]) f.line([a0, lerp(a0, b0, 0.5), b0], 1.4, '#36302a', { op: 0.7 }); // boning seams
    f.flat([[546, 900], [562, 896], [566, 990], [556, 1000]], '#2e2a22', { op: 0.35 });
  });
  for (let i = 0; i < 6; i++) f.rivet([612 - i * 1.2, 892 + i * 19], 2.6, P.boneD); // buttons
  f.line([[614, 884], [606, 1008]], 1.2, INK, { op: 0.5 });
  f.part([[558, 996], [640, 994], [642, 1010], [556, 1014]], { fill: mix(dress, '#000', 0.25), shade: 0.4, tex: 'weave' + seed, inkW: 1.1, cast: false }); // the waist band
  // chatelaine: a brass clip at the waist with chains: keys and scissors
  f.part([[598, 1000], [614, 1000], [614, 1016], [598, 1016]], { fill: P.brass, shade: 0.4, inkW: 1, cast: false });
  for (const [dx, l, kind] of [[-6, 70, 'key'], [4, 50, 'scis'], [12, 84, 'key']]) { const top0 = [606 + dx, 1016], end = [606 + dx * 2, 1016 + l]; W.chainLinks(f, [top0, end], 6, P.brassD); if (kind === 'key') { f.line([end, add(end, [0, 26])], 3, P.iron); f.line(ell(end, 5, 5, 0, 8).concat([ell(end, 5, 5, 0, 8)[0]]), 2.4, P.iron); f.line([add(end, [0, 20]), add(end, [6, 20]), add(end, [6, 26])], 2, P.iron); } else { f.line([end, add(end, [-5, 22])], 2.4, P.greyL); f.line([end, add(end, [5, 22])], 2.4, P.greyL); } }
  // lace collar torn and stretched round the neck, the cameo at the throat
  f.part([[574, 846], [634, 846], [650, 866], [632, 880], [602, 876], [570, 882], [560, 864]], { fill: lace, shadow: '#7a7262', shade: 0.4, tex: 'weave' + seed, texOp: 0.6 });
  for (let i = 0; i < 6; i++) f.line([[574 + i * 11, 850], [572 + i * 11, 878]], 1.1, '#7a7262', { op: 0.8 });
  f.flat([[614, 860], [632, 858], [626, 880]], '#2a2620', { op: 0.7 }); // a tear
  f.part(ell([602, 892], 10, 12, 0, 12), { fill: P.boneD, shadow: P.greyD, shade: 0.4, inkW: 1.2, cast: false }); // cameo brooch, bone on grey
  f.flat(ell([603, 892], 5, 7, 0, 10), P.bone, { op: 0.9 });

  // ---- the head: the neck stretched up into it, pinched where the skin gathers at the knot
  f.bone('head');
  f.part([[584, 800], [628, 800], [634, 864], [578, 864]], SKN({ fill: mix(skin, gasSk, 0.5) })); // stretched neck
  for (let i = 0; i < 4; i++) f.line([[586 + i * 3, 818 + i * 12], [626 - i * 2, 816 + i * 12]], 1.1, P.skinS, { op: 0.5 });
  const R = swollen(K0, 1, 0);
  // the skin gathers into the knot of the neck: radiating strain folds
  for (let i = 0; i < 11; i++) { const a = 3.4 + i * 0.27, q = add(K0, rot([22, 0], a)); f.line([q, add(K0, rot([70 + (i % 3) * 20, 0], a))], 1.3, P.ochD, { op: 0.5 }); }
  // the pearl drop, dragging the stretched lobe
  const lob = R.P1([612, 702]);
  f.line([lob, add(lob, [0, 24])], 1.6, P.brassD); f.part(ell(add(lob, [0, 36]), 8, 11, 0, 10), { fill: '#e4dcc8', shadow: '#8a8270', shade: 0.4, inkW: 1, cast: false }); f.flat(ell(add(lob, [2, 31]), 2.4, 2.4, 0, 6), '#fff', { op: 0.9 });
  // the fine hat, tiny on the swollen crown: felt, ribbon, a broken plume, a long hatpin through it into the bun
  const hx = 44;
  f.part([[500 + hx, 110], [520 + hx, 88], [566 + hx, 76], [610 + hx, 84], [630 + hx, 104], [604 + hx, 112], [560 + hx, 116]], { fill: P.ochD, shadow: '#2a1e10', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, inkW: 1.4 });
  f.part([[480 + hx, 116], [560 + hx, 106], [650 + hx, 110], [656 + hx, 120], [560 + hx, 124], [478 + hx, 126]], { fill: mix(P.ochD, '#000', 0.2), shade: 0.4, inkW: 1.3, cast: false }); // brim
  f.part([[520 + hx, 96], [600 + hx, 90], [604 + hx, 102], [522 + hx, 108]], { fill: P.och, shade: 0.4, inkW: 1, cast: false }); // ribbon
  f.stroke([[596 + hx, 92], [630 + hx, 60], [670 + hx, 40], [700 + hx, 44], [690 + hx, 54], [660 + hx, 56], [636 + hx, 72]], 7, P.ochL); for (let i = 0; i < 6; i++) f.line([[630 + hx + i * 10, 62 - i * 3], [634 + hx + i * 10, 52 - i * 3]], 1, P.ochD); // the plume, its tip broken
  f.line([[470 + hx, 78], [636 + hx, 118]], 2.2, P.greyL); f.part(ell([470 + hx, 78], 6, 6, 0, 8), { fill: P.boneD, shade: 0.4, inkW: 1, cast: false }); // hatpin
  // the gas leaking from the mouth
  W.smoke(f, R.m, 180, 48, { col: '#b09650', op: 0.42, sway: 24, drift: 70, phase: 1.2 });

  // ---- near arm: hanging limp from the sloped shoulder, the glove half off, the fingers loose
  f.bone('upperarm_n'); sleeve(SN, EN, DRS({ fill: mix(dress, '#fff', 0.06) }), '#36302a');
  f.bone('forearm_n'); forearm(EN, WN, SKN());
  f.part([lp(EN, WN, 0.02, -19), lp(EN, WN, 0.02, 19), lp(EN, WN, 0.22, 16), lp(EN, WN, 0.22, -17)], { fill: lace, shadow: '#7a7262', shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed }); // cuff
  for (let i = 0; i < 4; i++) f.flat(ell(lp(EN, WN, 0.22, -12 + i * 8), 2, 2.6, 0, 6), '#7a7262', { op: 0.9 });
  W.blisters(f, lp(EN, WN, 0.6, 0), 6, 10, 2, 2.5, 4);
  f.bone('hand_n');
  B.hand(f, add(WN, [0, 13]), 1.62, 17, '#6a5e4c', { spread: 0.1, curl: 0.4, shadow: '#2a2620', fingerCols: [skin, skin, '#6a5e4c', '#6a5e4c'], tipCols: [skin, skin, '#6a5e4c', '#6a5e4c'] }); // a kid glove half pulled off
  f.flat(ell(add(WN, [6, 4]), 7, 6, 0, 8), P.ochL, { op: 0.9 }); // a ring

  f.bone('root');
  f.flat(ell([560, gy + 2], 200, 8, 0, 20), '#3a3020', { op: 0.35 }); // her shadow on the floor, far below
  W.smoke(f, [520, gy - 10], 120, 80, { col: '#8a7448', op: 0.25, sway: 30, drift: -40 });
  return f;
}

// ------------------------------------------------------------------ THE BURNING LUNG (ruler, 4)
// The mine's first breath, grown into a toad the size of a chapel, squatting in the main gallery and filling it wall to
// wall. At scale 4 it is far bigger than the frame: we see the front of it, as from inside a cathedral. Its back and
// hindquarters run off the top and the left; the head fills the upper right under a heavy brow crest, the small bulging
// eye half shut under a thick lid, the Tooth jutting from the forehead like a third eye of stone. The body is a mass that
// turns: the shoulder bulges out over the foreleg, the flank sags in folds over the haunch, the warts crowd along the
// ridge of the back and thin out down the flank. The throat sac hangs under the jaw to the floor, a vast stretched
// membrane glowing orange from inside, veined, its ribs dark and uneven through it, its heavy lower curve flattened and
// spreading where it rests on the floor. Sulphur crusts the back in sheets and in irregular druses; broken pit props and
// bent cart rails are stuck in the hide. Flame leaks from the corner of the mouth.
// Rig: body (root) > head > jaw > sac; head > eye; body > arm_n_1 > arm_n_2 > arm_n_3; body > arm_f; body > haunch.
// Motion: idle the sac slowly inflating and deflating (the sac bone scales in engine; rotation only here);
// attack a breath of burning gas across the ranks (head lifts, jaw drops on its hinge, the sac squeezes).
function burningLung() {
  const seed = 401, h = TIERS.ruler[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1300 }));
  W.textures(f);
  const gy = f.o.groundY;
  const hide = '#6a5232', hideD = '#3e2e1a', hideL = '#94784c', belly = '#9a8660', fold = '#1a120a';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#1a120a', light: hideL, shade: 0.4, maxShade: 70, tex: 'craze' + seed, texOp: 0.6 }, o);
  const hinge = [960, 700];
  f.joint('body', [600, 900]).joint('head', [880, 600], 'body').joint('jaw', hinge, 'head').joint('sac', [1180, 740], 'jaw').joint('eye', [1200, 230], 'head');
  const AN = [[790, 980], [676, 1240], [748, 1490]];
  f.joint('arm_n_1', AN[0], 'body').joint('arm_n_2', AN[1], 'arm_n_1').joint('arm_n_3', AN[2], 'arm_n_2');
  f.joint('arm_f', [1300, 1300], 'body').joint('haunch', [300, 900], 'body');
  const soft = (c, rx, ry, col, op, a = 0, big = true) => f.raw(`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}" transform="rotate(${(a * D).toFixed(1)} ${c[0]} ${c[1]})" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${seed})"/>`);
  // a fold of hide: the dark crease, the shadow of the overhang under it, a lit lip above
  const crease = (pts, w, o = {}) => { f.stroke(pts.map(q => add(q, o.sh ?? [0, w * 1.4])), w * 2.6, fold, { op: 0.3 }); f.stroke(pts, w, fold, { op: o.op ?? 0.75 }); f.line(pts.slice(1, -1).map(q => add(q, o.lit ?? [w * 0.6, -w * 0.9])), Math.max(1.4, w * 0.35), hideL, { op: 0.55 }); };
  // a wart: a lumpy raised gland with its own light, a dark ring at its foot, sometimes a sulphur pore
  const wart = (c, r) => {
    f.flat(ell(add(c, [-r * 0.25, r * 0.3]), r * 1.2, r * 0.9, 0, 10), fold, { op: 0.18 });
    f.part(W.lumpy(f, ell(c, r, r * 0.72, f.r() * 3, 10), r * 0.3), HD({ fill: mix(hide, '#8a6e44', 0.3 + f.r() * 0.3), maxShade: r * 0.4, cast: false, inkW: r > 16 ? 0.9 : 0, inkHeavy: r > 16 ? 1.6 : 0, hatch: r > 16, tex: 'craze' + seed, texOp: 0.4 }));
    f.line(ell(c, r, r * 0.72, 0, 10).slice(3, 8), Math.max(0.8, r * 0.08), fold, { op: 0.55 }); // the shadowed foot of the wart, on the side away from the light
    f.flat(ell(add(c, [r * 0.25, -r * 0.3]), r * 0.3, r * 0.16, -0.5, 8), '#c8ae7c', { op: 0.45 });
    if (f.r() < 0.3) f.flat(ell(add(c, [-r * 0.05, r * 0.05]), r * 0.18, r * 0.16, 0, 6), P.sulD, { op: 0.9 });
  };
  const warts = (pts, n, r0, r1, spread) => { for (let i = 0; i < n; i++) { const t = f.r(), u = t * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(u)), q = add(lerp(pts[k], pts[k + 1], u - k), [(f.r() - 0.5) * spread, (f.r() - 0.5) * spread]); wart(q, W.R(f, r0, r1)); } };
  // crystals in irregular clusters: a few big tilted prisms with small ones crowding their feet, never a row
  const cluster = (b, a, s, n) => { W.druse(f, b, a, s, n, { fan: 1.7 }); for (let i = 0; i < 3; i++) { const q = add(b, rot([(f.r() - 0.5) * s * 1.4, (f.r() * 0.3) * s], a + Math.PI / 2)); W.crystal(f, q, a + (f.r() - 0.5) * 1.6, s * W.R(f, 0.15, 0.3), s * 0.08); } };

  // ---- far foreleg, peeking under the sac at the right
  f.bone('arm_f');
  f.part([[1330, 1300], [1420, 1320], [1500, 1440], [1530, 1540], [1480, 1570], [1360, 1570], [1340, 1480]], HD({ fill: hideD }));
  for (let i = 0; i < 3; i++) { const b0 = [1420 + i * 40, 1530], t0 = [1470 + i * 50, 1560]; f.part(limb(b0, t0, 50, 30, { steps: 8, p: [[0.5, 0.15, 0.15]] }), HD({ fill: hideD, cast: false })); }

  // ---- the body: the back and flank running off the frame
  f.bone('body');
  const BODY = [[-40, 260], [80, 120], [260, 10], [480, -60], [700, -60], [900, 40], [1000, 120], [960, 300], [900, 520], [860, 760], [800, 980], [700, 1150], [560, 1280], [300, 1380], [-40, 1400]];
  f.part(BODY, HD());
  f.raw(`<path d="${E.smooth(BODY)}" fill="url(#soot${seed})" opacity="0.45"/>`);
  W.clipDraw(f, BODY, () => {
    // the mass turns: lit along the top of the back, a broad core shadow low on the flank, bounce light from the sac
    soft([520, 260], 420, 160, '#c8a870', 0.28, -0.25);
    soft([260, 900], 380, 320, '#120c06', 0.5);
    soft([860, 900], 120, 260, P.lamp, 0.18);
    // the sulphur crust in sheets on the back
    const CR = W.lumpy(f, [[-40, 240], [80, 100], [260, -10], [480, -80], [720, -80], [920, 30], [980, 130], [900, 160], [800, 120], [700, 180], [600, 150], [480, 230], [380, 210], [280, 300], [160, 300], [60, 400], [-40, 420]], 20);
    f.part(CR, { fill: mix(P.sul, P.och, 0.35), shadow: P.sulD, light: P.sulP, shade: 0.42, tex: 'grain' + seed, texOp: 0.8 });
    W.crackNet(f, [300, 120], -0.3, 200, 5, { depth: 2 });
    W.crackNet(f, [700, 60], 2.6, 180, 4.6, { depth: 2 });
    // folds of hide: under the crust's edge along the dorsolateral ridge, round the shoulder, sagging over the haunch
    crease([[-20, 470], [140, 400], [300, 350], [480, 300], [660, 230], [860, 190]], 7);
    crease([[60, 640], [220, 600], [380, 580], [520, 600]], 6);
    crease([[0, 820], [140, 780], [300, 790], [440, 840], [540, 900]], 8);
    crease([[180, 1040], [330, 1020], [480, 1060], [600, 1120]], 6);
    // cross-contour hatching on the turning flank
    for (let i = 0; i < 16; i++) { const y0 = 640 + i * 34; f.line([[40 + i * 6, y0], [180 + i * 8, y0 - 26], [320 + i * 10, y0 - 30]], 1.4, INK, { op: 0.3 }); }
    // crust plates scattered down the flank
    for (const [c, r] of [[[300, 520], 44], [[560, 470], 36], [[130, 940], 54]]) { const pl = W.lumpy(f, ell(c, r * 1.5, r, -0.2, 11), r * 0.3); f.part(pl, { fill: mix(P.sul, P.och, 0.35), shadow: P.sulD, shade: 0.42, tex: 'grain' + seed, texOp: 0.8, inkW: 1.6, inkHeavy: 2.6, cast: false }); }
    // the warts: crowded big along the ridge of the back, smaller and sparser down the flank
    warts([[-20, 440], [200, 380], [420, 330], [640, 260], [860, 210]], 22, 8, 26, 110);
    warts([[60, 600], [300, 640], [520, 700], [700, 820]], 18, 7, 16, 120);
    warts([[80, 820], [260, 980], [420, 1100], [560, 1200]], 14, 5, 11, 120);
  });
  // the shoulder: a mass bulging out over the foreleg, with its own shading and the folds it pushes up
  const SH = [[560, 650], [690, 600], [820, 640], [900, 760], [890, 900], [820, 1000], [690, 1010], [590, 940], [540, 800]];
  f.part(SH, HD({ inkW: 0, inkHeavy: 0, maxShade: 46, castOp: 0.45 }));
  W.clipDraw(f, SH, () => { soft([760, 700], 120, 70, '#c8a870', 0.3, -0.4); for (let i = 0; i < 10; i++) { const y0 = 760 + i * 22; f.line([[580 + i * 4, y0], [680, y0 - 40], [800 + i * 4, y0 - 30]], 1.3, INK, { op: 0.28 }); } });
  crease([[548, 700], [620, 640], [720, 606], [830, 630]], 8, { lit: [4, -7] });
  crease([[600, 960], [700, 1000], [820, 990]], 6);
  warts([[620, 700], [760, 680], [860, 760]], 10, 8, 20, 60);
  // long glowing seams down the flank where the hide has split over the burning lung inside
  W.crackNet(f, [880, 300], 2.2, 360, 7, { depth: 2 });
  W.crackNet(f, [500, 420], 1.9, 300, 6, { depth: 2 });
  W.crackNet(f, [200, 700], 1.2, 280, 5.5, { depth: 2 });
  W.glow(f, [600, 700], 300, 260, P.lamp, 0.1, true);
  W.blisters(f, [700, 560], 80, 60, 6, 10, 20);
  W.blisters(f, [260, 1000], 100, 80, 6, 10, 18);
  W.beads(f, [500, 800], 300, 260, 18, 2.2);
  // crystal clusters along the back: irregular in size, tilt and spacing, each growing out of the crust
  cluster([640, -20], -1.3, 240, 10); cluster([330, 70], -2.15, 140, 6); cluster([880, 70], -0.85, 100, 5);
  cluster([90, 250], -2.6, 90, 4); cluster([760, 190], -1.05, 64, 3); cluster([500, 200], -1.9, 50, 3);
  for (const [q, a, L] of [[[200, 190], -2.3, 40], [[560, 130], -1.4, 34], [[430, 260], -2.0, 26], [[960, 160], -0.5, 30]]) W.crystal(f, q, a, L, L * 0.34);
  // pit props stuck in the hide: square oak beams, splintered, one with its iron strap; and bent cart rails with a sleeper
  const beam = (a, b2, w, o = {}) => {
    const d = E.norm(sub(b2, a)), n = [-d[1], d[0]];
    f.part([add(a, mul(n, w / 2)), add(b2, mul(n, w / 2)), add(add(b2, mul(n, w * 0.2)), mul(d, 30)), add(b2, mul(n, -w * 0.1)), add(add(b2, mul(n, -w * 0.4)), mul(d, 46)), add(b2, mul(n, -w / 2)), add(a, mul(n, -w / 2))].map((q, i) => [...q, i > 0 && i < 6 ? 0 : 1]), { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.42, tex: 'wood' + seed, texOp: 0.7, inkW: 2, inkHeavy: 4 });
    f.part([add(a, mul(n, w / 2)), add(b2, mul(n, w / 2)), add(b2, mul(n, w * 0.15)), add(a, mul(n, w * 0.15))], { fill: P.woodL, shade: 0.3, inkW: 0, cast: false, hatch: false, opacity: 0.45 }); // the lit face of the square beam
    f.flat([add(a, mul(n, -w / 2)), add(a, mul(n, w / 2)), add(add(a, mul(n, w / 2)), mul(d, -22)), add(add(a, mul(n, -w / 2)), mul(d, -14))], '#1a120a', { op: 0.85 }); // where it enters the hide
    f.part(W.lumpy(f, ell(a, w * 0.8, w * 0.38, Math.atan2(n[1], n[0]), 12), w * 0.1), HD({ fill: mix(hide, '#b07050', 0.3), cast: false })); // swollen hide round the wound
    if (o.strap) { const q0 = lerp(a, b2, o.strap); f.part([add(q0, mul(n, w / 2 + 3)), add(add(q0, mul(n, w / 2 + 3)), mul(d, 24)), add(add(q0, mul(n, -w / 2 - 3)), mul(d, 24)), add(q0, mul(n, -w / 2 - 3))], { fill: P.iron, shade: 0.4, inkW: 1.6, cast: false }); for (const v of [-0.3, 0.3]) f.rivet(add(add(q0, mul(n, v * w)), mul(d, 12)), 4, P.ironL); }
    for (let i = 0; i < 4; i++) f.line([lerp(a, b2, 0.2 + i * 0.18), add(lerp(a, b2, 0.24 + i * 0.18), mul(n, (i % 2 ? 1 : -1) * w * 0.3))], 1.6, INK, { op: 0.6 }); // checks in the grain
    W.flakes(f, lerp(a, b2, 0.7), w * 0.4, 40, 3, 1.4);
  };
  beam([560, 300], [300, -80], 64, { strap: 0.4 });
  beam([780, 260], [740, -60], 52);
  beam([330, 640], [170, 520], 58);
  const rail = (pts, w) => { w *= 1.5; f.line(pts, w + 6, INK); f.line(pts, w, '#4a4440'); f.line(pts.map(q => add(q, [0, -w * 0.3])), w * 0.35, '#7a726a', { op: 0.8 }); f.line(pts.map(q => add(q, [0, w * 0.3])), w * 0.2, '#1a1614', { op: 0.8 }); };
  rail([[250, 790], [140, 720], [20, 700], [-40, 720]], 20);
  f.part([[100, 690], [170, 700], [160, 760], [92, 750]], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, inkW: 1.6, cast: false }); f.rivet([130, 720], 5, P.ironL); // a sleeper still spiked to it
  f.part(W.lumpy(f, ell([256, 794], 30, 18, 0.5, 12), 4), HD({ fill: mix(hide, '#b07050', 0.3), cast: false }));
  rail([[470, 1110], [380, 1030], [330, 960]], 18);
  f.part(W.lumpy(f, ell([474, 1114], 26, 16, 0.6, 12), 4), HD({ fill: mix(hide, '#b07050', 0.3), cast: false }));

  // ---- the near hind leg folded under it at the left: a mountain of thigh, the long foot forward on the floor
  f.bone('haunch');
  const HAUNCH = [[-40, 860], [200, 820], [420, 880], [560, 1000], [600, 1160], [560, 1300], [470, 1400], [520, 1470], [560, 1540], [520, 1570], [-40, 1570]];
  f.part(HAUNCH, HD({ fill: mix(hide, hideL, 0.1) }));
  W.clipDraw(f, HAUNCH, () => {
    soft([360, 980], 200, 90, '#c8a870', 0.25, 0.4); soft([160, 1360], 260, 200, '#120c06', 0.45);
    for (let i = 0; i < 14; i++) { const y0 = 960 + i * 36; f.line([[30, y0], [200, y0 + 20], [380 + i * 6, y0 + 70]], 1.4, INK, { op: 0.3 }); }
    crease([[100, 900], [340, 960], [520, 1100]], 7); crease([[40, 1300], [300, 1320], [480, 1390]], 6);
    warts([[60, 900], [300, 940], [520, 1060]], 14, 8, 20, 70); warts([[100, 1150], [400, 1250]], 8, 5, 12, 120);
  });
  f.part([[300, 1490], [540, 1500], [600, 1560], [330, 1566]], HD({ fill: mix(hide, '#2a2016', 0.3), cast: false, inkW: 1.4 })); // webbing
  for (let i = 0; i < 4; i++) { const b0 = [320 + i * 46, 1496 + i * 4], k0 = [370 + i * 62, 1520 + i * 5], t0 = [404 + i * 72, 1544 + i * 6]; f.part(limb(b0, t0, 58, 30, { steps: 10, p: [[0.55, 0.25, 0.1]], q: [[0.55, 0.15, 0.1]] }), HD({ cast: false })); f.line([add(k0, [-6, -16]), add(k0, [4, -12])], 2, fold, { op: 0.6 }); f.part(ell(add(t0, [4, 2]), 20, 15, 0.3, 8), HD({ fill: mix(hide, '#d8c8a0', 0.3), cast: false, hatch: false })); } // toes, splayed, knuckled, padded tips
  W.crackNet(f, [200, 1000], 0.2, 260, 5.5, { depth: 2 });
  W.crust(f, [380, 1200], 160, 120, 8, 12, 24, { spikes: 0.4 });

  // ---- head: the inside of the mouth, the skull and snout, the brow crest, the gland, the Tooth
  f.bone('head');
  f.part([hinge, [1100, 690], [1300, 680], [1520, 640], [1500, 720], [1300, 780], [1100, 790], [990, 760]], { fill: '#8a4a34', shadow: '#3a160e', shade: 0.4, inkW: 1.6, cast: false });
  f.flat([[990, 720], [1120, 712], [1180, 750], [1060, 780]], P.lamp, { op: 0.8 });
  W.glow(f, [1060, 740], 120, 60, P.lampL, 0.5);
  const SKULL = [[870, 120], [960, 90], [1080, 80], [1160, 130], [1250, 130], [1330, 180], [1420, 260], [1500, 360], [1556, 470], [1584, 560], [1576, 604], [1520, 630], [1300, 660], [1100, 680], [960, 700], [900, 600], [880, 400]];
  f.part(SKULL, HD());
  f.raw(`<path d="${E.smooth(SKULL)}" fill="url(#soot${seed})" opacity="0.4"/>`);
  W.clipDraw(f, SKULL, () => {
    soft([1350, 330], 220, 110, '#c8a870', 0.3, 0.5); // the lit top of the snout
    soft([1080, 520], 200, 140, '#120c06', 0.4); // the cheek turning under
    f.flat([[920, 560], [1500, 600], [1560, 640], [920, 700]], hideD, { op: 0.5 }); // the lip's overhang shadow
    crease([[960, 600], [1200, 560], [1460, 520]], 5);
    crease([[1000, 420], [1100, 470], [1180, 520]], 5); // the fold behind the eye down to the jaw
    for (let i = 0; i < 10; i++) { const x0 = 1300 + i * 22; f.line([[x0, 300 + i * 18], [x0 + 30, 400 + i * 14], [x0 + 20, 500 + i * 8]], 1.3, INK, { op: 0.28 }); }
    warts([[1000, 330], [1200, 400], [1450, 470]], 16, 6, 15, 70);
  });
  // the lip line: a long dark seam from the snout back to the corner of the mouth
  f.stroke([[1580, 600], [1500, 628], [1300, 650], [1100, 670], [962, 696]], 9, INK);
  f.line([[1570, 590], [1480, 616], [1300, 638], [1100, 658]], 2, hideL, { op: 0.6 });
  f.flat(ell([1530, 470], 16, 9, 0.6, 10), '#0e0a06'); f.line([[1514, 462], [1546, 480]], 2, hideL, { op: 0.5 }); // nostril
  // poison gland (parotoid) behind the eye, ripe and yellow, pitted with pores
  f.part(W.lumpy(f, ell([1010, 300], 116, 66, -0.35, 16), 10), { fill: mix(P.sul, P.och, 0.3), shadow: P.sulD, shade: 0.42, tex: 'grain' + seed, texOp: 0.5, inkW: 2 });
  for (let i = 0; i < 16; i++) f.flat(ell(W.scatter(f, [1010, 300], 80, 36), 5, 3.4, 0, 6), '#2a2010', { op: 0.8 });
  cluster([960, 200], -1.95, 110, 5); cluster([1080, 160], -1.4, 60, 3);
  W.crackNet(f, [1330, 360], 2.0, 200, 5, { depth: 2 });
  W.crackNet(f, [1180, 560], 3.0, 180, 4, { depth: 1 });
  // the Tooth: a long shard of pale stone jutting from the middle of the forehead like a third eye, its root sunk in a
  // collar of swollen, split hide, glowing seams running out from it
  const tb = [1372, 246], ta = -1.15, TT = frame(tb, ta, 1);
  f.part(W.lumpy(f, ell(tb, 66, 38, ta + Math.PI / 2, 14), 7), HD({ fill: mix(hide, '#b07050', 0.35), cast: false, inkW: 2 })); // the swollen collar
  f.flat(ell(add(tb, [0, 4]), 46, 22, ta + Math.PI / 2, 12), '#1a0c06');
  f.part(TT([[-6, -30], [40, -26], [96, -14], [140, 2, 1], [94, 18], [40, 26], [-6, 28]]), { fill: '#dcd8ca', shadow: '#8a8478', light: '#f6f4ec', shade: 0.4, inkW: 1.8, inkHeavy: 3, cast: true, tex: 'mottle' + seed, texOp: 0.4 });
  f.line(TT([[0, -2], [70, -4], [138, 2]]), 1.4, INK, { op: 0.55 }); f.line(TT([[30, -24], [60, -6]]), 1.2, INK, { op: 0.45 }); // facets
  f.flat(TT([[4, -26], [70, -18], [120, -4], [70, -8]]), '#ffffff', { op: 0.5 });
  f.flat(TT([[60, 6], [80, 22], [66, 14]]), '#6a645a', { op: 0.8 }); // a chip
  W.seam(f, [add(tb, [-60, 20]), add(tb, [-96, 40]), add(tb, [-140, 40])], 3);
  W.seam(f, [add(tb, [50, 24]), add(tb, [90, 44]), add(tb, [120, 80])], 2.6);
  // the brow crest: a heavy ridge of hide and bone arching over the eye, crusted, throwing the eye into shadow
  const BROW = [[1090, 196], [1130, 122], [1200, 94], [1270, 104], [1320, 140], [1334, 178], [1300, 170], [1250, 150], [1190, 150], [1140, 172]];
  f.flat([[1110, 190], [1200, 150], [1300, 172], [1290, 230], [1200, 220], [1120, 236]], '#120a04', { op: 0.5 }); // the shadow the crest throws on the eye
  f.part(BROW, HD({ fill: mix(hide, hideL, 0.25), maxShade: 20, castOp: 0.6 }));
  f.line([[1120, 150], [1190, 112], [1260, 112], [1310, 140]], 2.4, '#c8b080', { op: 0.6 });
  W.crust(f, [1210, 104], 60, 12, 6, 6, 12, { spikes: 0.5 });

  // ---- the eye: a small bulging dome under the crest, a golden iris with a horizontal pupil, the heavy lid down over
  // its top third, the lower lid a thick fold; wet
  f.bone('eye');
  const ec = [1204, 232];
  f.part(W.lumpy(f, ell(add(ec, [-4, 6]), 84, 60, -0.1, 18), 5), HD({ cast: false, maxShade: 24 })); // the dome of the eye socket
  f.part(ell(ec, 54, 42, -0.08, 20), { fill: '#b8902e', shadow: '#5a3c10', light: '#e8c460', shade: 0.35, maxShade: 18, inkW: 1.8, inkHeavy: 2.6, cast: false, hatch: false });
  W.glow(f, add(ec, [8, 4]), 30, 22, P.lampL, 0.35);
  for (let i = 0; i < 18; i++) { const a = i * 0.35; f.line([add(ec, rot([16, 0], a)), add(ec, rot([46 + (i % 3) * 3, 0], a))], 1.2, i % 2 ? '#6a4810' : '#e0bc58', { op: 0.55 }); } // iris flecks
  f.flat([add(ec, [-38, 4]), add(ec, [-10, -6]), add(ec, [24, -6]), [...add(ec, [44, 2]), 1], add(ec, [24, 12]), add(ec, [-10, 12]), [...add(ec, [-40, 6]), 1]], '#0a0604'); // horizontal pupil
  f.part([add(ec, [-92, 4]), add(ec, [-74, -50]), add(ec, [-10, -72]), add(ec, [60, -60]), add(ec, [96, -14]), add(ec, [70, -8]), add(ec, [30, -14]), add(ec, [-20, -14]), add(ec, [-62, -6])], HD({ fill: mix(hide, '#8a6a48', 0.2), maxShade: 16, castOp: 0.6, inkW: 2, inkHeavy: 3.4 })); // the heavy upper lid
  f.stroke([add(ec, [-70, -8]), add(ec, [-10, -16]), add(ec, [60, -12]), add(ec, [90, -14])], 7, INK); // the lid's edge
  f.line([add(ec, [-60, -40]), add(ec, [0, -54]), add(ec, [60, -40])], 2, fold, { op: 0.6 }); // a fold in the lid
  f.part([add(ec, [-80, 22]), add(ec, [-20, 40]), add(ec, [50, 38]), add(ec, [92, 14]), add(ec, [82, 48]), add(ec, [10, 66]), add(ec, [-60, 54])], HD({ fill: mix(hide, '#8a6a48', 0.15), maxShade: 14, cast: false, inkW: 1.6 })); // the lower lid
  f.flat(ell(add(ec, [22, -2]), 9, 5, -0.2, 8), '#fffbe8', { op: 0.85 }); f.flat(ell(add(ec, [-18, 18]), 6, 3, 0, 6), '#fffbe8', { op: 0.4 }); // wet glints
  W.crust(f, add(ec, [-10, -62]), 40, 10, 4, 5, 9, { spikes: 0.4 });

  // ---- lower jaw, then the sac hanging from it
  f.bone('jaw');
  const JAW = [add(hinge, [0, -8]), [1100, 672], [1300, 652], [1500, 628], [1578, 606], [1560, 660], [1480, 700], [1300, 736], [1120, 756], [990, 750]];
  f.part(JAW, HD({ fill: mix(hide, belly, 0.3) }));
  f.line([[1000, 724], [1300, 706], [1540, 650]], 2, hideL, { op: 0.5 });
  // ---- the throat sac: a vast stretched membrane, glowing orange from inside, veined, the ribs dark and uneven through
  // it; it hangs heavy, its lower curve flattened and spreading where it rests on the gallery floor
  f.bone('sac');
  const SAC = [[1000, 744], [1200, 740], [1420, 712], [1540, 690], [1590, 790], [1606, 960], [1610, 1150], [1610, 1340], [1600, 1480], [1560, 1550], [1440, 1568, 1], [1200, 1574], [960, 1570, 1], [840, 1548], [776, 1490], [756, 1390], [772, 1250], [810, 1100], [860, 960], [906, 840], [950, 772]];
  W.glow(f, [1200, 1250], 520, 440, P.lamp, 0.35, true);
  f.part(SAC, { fill: '#cc7028', shadow: '#7a2e12', light: '#f6b45c', shade: 0.3, maxShade: 60, tex: 'mottle' + seed, texOp: 0.3, inkW: 2.4, inkHeavy: 5, gritOp: 0.3 });
  W.clipDraw(f, SAC, () => {
    // light from inside: a hot heart low in the sac, cooler toward the rim and the jaw where the skin is thicker
    soft([1200, 1260], 300, 280, P.hot, 0.5); soft([1220, 1300], 150, 140, P.core, 0.45);
    soft([1220, 820], 360, 90, '#5a1e0a', 0.4); // the thick gathered skin under the jaw
    // the ribs seen through the membrane: soft, uneven bars, each at its own angle and spacing, one forked, one broken
    const ribs = [[[930, 800], [1110, 830], [1330, 880], [1560, 960], 26], [[880, 900], [1060, 960], [1250, 1060], [1420, 1180], 40], [[1300, 980], [1440, 1010], [1600, 1080], null, 22], [[830, 1030], [990, 1120], [1150, 1250], [1260, 1360], 36], [[800, 1180], [940, 1260], [1080, 1380], null, 44], [[1240, 1210], [1400, 1290], [1580, 1420], null, 30], [[790, 1340], [900, 1410], [1020, 1480], [1180, 1530], 34]];
    for (const [a0, b0, c0, d0, w] of ribs) { const pts = [a0, b0, c0, d0].filter(Boolean); f.raw(`<path d="${E.smooth(pts, false)}" fill="none" stroke="#6a2408" stroke-width="${w}" stroke-linecap="round" opacity="0.5" filter="url(#glow${seed})"/>`); f.stroke(pts, w * 0.35, '#5a1c06', { op: 0.45 }); f.stroke(pts.map(q => add(q, [0, -w * 0.6])), w * 0.25, '#ffc070', { op: 0.25 }); }
    f.raw(`<path d="${E.smooth([[1250, 1060], [1330, 1080], [1460, 1090]], false)}" fill="none" stroke="#6a2408" stroke-width="22" stroke-linecap="round" opacity="0.45" filter="url(#glow${seed})"/>`); // a fork
    f.raw(`<path d="${E.smooth([[1060, 760], [1000, 1000], [930, 1260], [880, 1500]], false)}" fill="none" stroke="#6a2408" stroke-width="40" opacity="0.3" filter="url(#glowL${seed})"/>`); // the spine side, soft
    // veins over the membrane: thick trunks from the jaw branching down and thinning into capillaries
    const vein = (p0, a, L, w, d) => { const pts2 = [p0]; let q = p0, b2 = a; for (let k = 0; k < 5; k++) { b2 += (f.r() - 0.5) * 0.5; q = add(q, rot([L / 5, 0], b2)); pts2.push(q); } f.stroke(pts2, w, '#4a1a08', { op: 0.7 }); f.line(pts2.map(q2 => add(q2, [w * 0.3, -w * 0.3])), Math.max(0.8, w * 0.2), '#ffb060', { op: 0.3 }); if (d > 0) for (let k = 1; k < 5; k++) if (f.r() < 0.55) vein(pts2[k], b2 + (f.r() > 0.5 ? 0.6 : -0.6), L * 0.5, w * 0.55, d - 1); };
    for (const [q, a, L] of [[[1060, 780], 1.35, 420], [[1300, 760], 1.6, 480], [[1500, 740], 1.85, 420], [[900, 900], 1.2, 360], [[1580, 900], 2.0, 340]]) vein(q, a, L, 9, 3);
    // the skin gathered under the jaw: short stretch creases radiating down from the attachment
    for (let i = 0; i < 16; i++) { const x0 = 900 + i * 42, y0 = 760 - (x0 > 1400 ? (x0 - 1400) * 0.25 : 0); f.stroke([[x0, y0], [x0 + 6, y0 + 40 + (i % 3) * 16]], 4, '#5a1e0a', { op: 0.5 }); }
    // stretched thin and shining: a hard highlight on the upper right, fine stretch lines
    soft([1500, 900], 50, 110, '#fff0c8', 0.35, -0.4, false); f.flat([[1490, 830], [1540, 860], [1566, 930], [1540, 900]], '#fff6dc', { op: 0.5 });
    f.flat([[1500, 1100], [1540, 1130], [1550, 1180], [1524, 1146]], '#fff0c8', { op: 0.3 });
    for (let i = 0; i < 14; i++) { const q = W.scatter(f, [1300, 1150], 220, 260); f.line([q, add(q, [8 + f.r() * 14, 30 + f.r() * 20])], 1.6, '#ffd8a0', { op: 0.35 }); }
    // the heavy underside resting on the floor: darker, compressed into folds as it spreads
    soft([1180, 1560], 460, 90, '#3a1206', 0.6);
    for (const [a0, b0, c0] of [[[800, 1470], [900, 1520], [1080, 1540]], [[960, 1550], [1200, 1556], [1440, 1540]], [[1360, 1500], [1480, 1490], [1580, 1450]]]) { f.stroke([a0, b0, c0], 6, '#3a1206', { op: 0.6 }); f.line([a0, b0, c0].map(q => add(q, [0, -6])), 1.6, '#ffb060', { op: 0.35 }); }
  });
  W.crust(f, [1180, 760], 220, 20, 12, 10, 20, { spikes: 0.4 });
  W.seam(f, [[860, 1000], [880, 1100], [850, 1200], [870, 1300]], 4.4);
  W.seam(f, [[1540, 1000], [1520, 1120], [1546, 1220]], 3.6);
  W.blisters(f, [860, 1420], 50, 40, 6, 10, 18);
  f.flat(ell([1180, gy + 2], 460, 14, 0, 24), '#1a0a04', { op: 0.6 }); // where it presses the floor
  W.splats(f, [1200, gy - 2], 260, 6, 10, P.sootD);

  // ---- near foreleg: out of a fold of the shoulder, the elbow bent out, the forearm thick under the elbow and narrowing
  // to a heavy wrist, the hand flat on the floor with its fingers splayed and knuckled, padded at the tips
  f.bone('body'); f.part([[640, 880], [800, 860], [900, 960], [880, 1060], [760, 1040], [660, 980]], HD({ cast: false, inkW: 0, inkHeavy: 0 })); crease([[660, 990], [770, 1046], [880, 1060]], 6); // the fold the arm comes out of
  const UA = limb(AN[0], AN[1], 280, 150, { steps: 14, capK: 0.9, p: [[0.3, 0.3, 0.2], [0.85, 0.22, 0.1]], q: [[0.2, 0.2, 0.18], [0.6, -0.08, 0.1]] });
  f.bone('arm_n_1'); f.part(UA, HD());
  W.clipDraw(f, UA, () => { soft(lp(AN[0], AN[1], 0.35, 60), 60, 120, '#c8a870', 0.3, 0.4); soft(lp(AN[0], AN[1], 0.5, -110), 70, 160, '#120c06', 0.45, 0.4); for (let i = 0; i < 9; i++) f.line([lp(AN[0], AN[1], 0.15 + i * 0.08, -120), lp(AN[0], AN[1], 0.2 + i * 0.08, -60), lp(AN[0], AN[1], 0.18 + i * 0.08, 0)], 1.3, INK, { op: 0.3 }); });
  warts([lp(AN[0], AN[1], 0.15, -40), lp(AN[0], AN[1], 0.7, -50)], 9, 6, 16, 60);
  for (const [t0, t1] of [[0.32, 0.4], [0.58, 0.66]]) crease([lp(AN[0], AN[1], t0, -120), lp(AN[0], AN[1], (t0 + t1) / 2, -30), lp(AN[0], AN[1], t1, 60), lp(AN[0], AN[1], t1 - 0.04, 120)], 5); // loose skin folded across the upper arm
  crease([lp(AN[0], AN[1], 0.05, 90), lp(AN[0], AN[1], 0.12, 40), lp(AN[0], AN[1], 0.1, -20)], 4); // the armpit
  W.crackNet(f, lerp(AN[0], AN[1], 0.3), 1.7, 200, 5, { depth: 1 }); W.crust(f, lp(AN[0], AN[1], 0.45, -70), 40, 30, 4, 8, 14, { spikes: 0.4 });
  const FA = limb(AN[1], AN[2], 200, 112, { steps: 14, capK: 0.9, p: [[0.22, 0.35, 0.16], [0.9, 0.12, 0.06]], q: [[0.18, 0.22, 0.14]] });
  f.bone('arm_n_2'); f.part(FA, HD());
  W.clipDraw(f, FA, () => { soft(lp(AN[1], AN[2], 0.3, 40), 50, 90, '#c8a870', 0.3, -0.3); soft(lp(AN[1], AN[2], 0.5, -70), 50, 120, '#120c06', 0.45, -0.3); });
  f.bone('arm_n_1'); f.part(W.lumpy(f, [add(AN[1], [-20, -90]), add(AN[1], [-90, -40]), add(AN[1], [-112, 10]), add(AN[1], [-80, 50]), add(AN[1], [0, 40]), add(AN[1], [40, -10])], 6), HD({ cast: false, maxShade: 18, inkW: 0, inkHeavy: 0 })); f.bone('arm_n_2'); // the elbow's point, pushed out, one with the arm
  for (const [a0, b0, c0] of [[lp(AN[1], AN[2], 0.02, -80), lp(AN[1], AN[2], 0.06, -20), lp(AN[1], AN[2], 0.03, 50)], [lp(AN[1], AN[2], 0.12, -70), lp(AN[1], AN[2], 0.15, -10), lp(AN[1], AN[2], 0.12, 50)], [lp(AN[1], AN[2], 0.86, -50), lp(AN[1], AN[2], 0.9, 0), lp(AN[1], AN[2], 0.87, 50)]]) crease([a0, b0, c0], 4); // folds at the elbow and the wrist
  W.blisters(f, lp(AN[1], AN[2], 0.5, 30), 30, 50, 4, 8, 14);
  warts([lp(AN[1], AN[2], 0.2, -50), lp(AN[1], AN[2], 0.7, -30)], 6, 5, 12, 40);
  f.bone('arm_n_3');
  f.part(W.lumpy(f, [add(AN[2], [-70, -10]), add(AN[2], [40, -30]), add(AN[2], [120, 10]), add(AN[2], [130, 60]), add(AN[2], [40, gy - AN[2][1] - 4]), add(AN[2], [-80, gy - AN[2][1] - 6]), add(AN[2], [-90, 30])], 6), HD({ cast: false })); // the palm, flat on the floor
  for (let i = 0; i < 4; i++) {
    const a = 0.1 + (i - 1.5) * 0.44, b0 = add(AN[2], rot([50, 0], a)), k0 = add(add(AN[2], rot([130, 0], a)), [0, 10]), t0 = add(k0, rot([96, 0], a + 0.35)), tt = [t0[0], Math.min(t0[1], gy - 16)];
    f.part(limb(b0, k0, 78, 60, { steps: 8, p: [[0.6, 0.12, 0.15]], q: [[0.6, 0.12, 0.15]] }), HD({ cast: false, inkW: 1.3 }));
    f.part(limb(k0, tt, 60, 40, { steps: 8, p: [[0.3, 0.1, 0.2]] }), HD({ cast: false, inkW: 1.3 }));
    f.part(ell(k0, 34, 26, a, 10), HD({ cast: false, inkW: 0, inkHeavy: 0, hatch: false, maxShade: 6, fill: mix(hide, hideL, 0.2) })); f.line([add(k0, rot([-6, -20], a)), add(k0, rot([6, -16], a)), add(k0, rot([-2, -6], a))], 1.6, fold, { op: 0.6 }); // the knuckle and its wrinkle
    f.part(ell(tt, 28, 20, a, 10), HD({ fill: mix(hide, '#d8c8a0', 0.3), cast: false, hatch: false })); // the toe pad
  }
  W.splats(f, [760, gy - 4], 160, 6, 10, P.sootD);

  // ---- flame leaking from the corner of the mouth, licking up the cheek; ochre smoke rolling off the hide
  f.bone('head');
  W.glow(f, [980, 690], 160, 90, P.lamp, 0.45, true);
  const lick = (b0, L, w, a, col, op) => { const d = rot([1, 0], a), n = [-d[1], d[0]], pts = [add(b0, mul(n, w * 0.6))]; for (let i = 1; i <= 6; i++) { const t = i / 6; pts.push([...add(add(b0, mul(d, L * t)), mul(n, w * (0.6 - t * 0.5) + Math.sin(t * 9 + L) * w * 0.25 * t - t * t * w * 1.2)), i === 6 ? 1 : 0]); } for (let i = 5; i >= 1; i--) { const t = i / 6; pts.push(add(add(b0, mul(d, L * t * 0.92)), mul(n, -w * (0.6 - t * 0.5) - t * t * w * 1.2))); } pts.push(add(b0, mul(n, -w * 0.6))); f.flat(pts, col, { op, k: 0.8 }); };
  for (const [L, w, a] of [[420, 96, -2.6], [320, 70, -2.2], [260, 64, -2.95], [200, 48, -1.9]]) { lick([978, 700], L, w, a, P.ember, 0.75); lick([978, 700], L * 0.8, w * 0.7, a + 0.05, P.lamp, 0.9); lick([978, 700], L * 0.5, w * 0.45, a + 0.08, P.hot, 0.95); }
  f.flat(ell([980, 700], 26, 16, 0, 10), P.core);
  W.smoke(f, [860, 580], 260, 70, { col: '#2a2420', op: 0.45, line: '#4a4038', sway: 30, drift: -80 });
  f.bone('body');
  W.smoke(f, [700, 200], 300, 90, { col: P.smoke, op: 0.35, sway: 40, drift: -60 });
  W.smoke(f, [300, 300], 260, 70, { col: P.smoke, op: 0.3, sway: -30, drift: -40, phase: 2 });
  W.ash(f, [800, 300], 30, 500, 300, 2.2);

  f.bone('root');
  f.flat(ell([800, gy + 4], 900, 18, 0, 30), '#2a2016', { op: 0.6 });
  W.crust(f, [1200, gy - 6], 300, 6, 14, 6, 14, { spikes: 0.3 });
  return f;
}

module.exports = {
  heroes: [
    { key: 'burning_lung', name: 'The Burning Lung', tier: 'ruler', w: 1600, h: 1600, flip: true, build: burningLung },
    { key: 'miasma_matriarch', name: 'Miasma Matriarch', tier: 'elite', w: 1100, h: 1400, flip: true, build: miasmaMatriarch },
    { key: 'powder_ogre', name: 'Powder Ogre', tier: 'elite', w: 1100, h: 1400, flip: true, build: powderOgre },
    { key: 'gas_lung_miner', name: 'Gas-Lung Miner', tier: 'human', w: 600, h: 820, flip: true, build: gasLungMiner },
    { key: 'brimstone_toad', name: 'Brimstone Toad', tier: 'small', w: 600, h: 820, flip: true, build: brimstoneToad },
    { key: 'fuse_imp', name: 'Fuse Imp', tier: 'small', w: 600, h: 820, flip: true, build: fuseImp },
    { key: 'pit_crawler', name: 'Pit Crawler', tier: 'large', w: 900, h: 1100, flip: true, build: pitCrawler },
    { key: 'canary_priest', name: 'Canary Priest', tier: 'human', w: 600, h: 820, flip: true, build: canaryPriest },
  ],
};
// every figure's ground line is its canvas height minus 30 (the rig export reads groundY from the figure options)
for (const e of module.exports.heroes) { const b = e.build; e.build = () => { const f = b(); if (f.o.groundY !== e.h - 30) throw new Error(`${e.key}: groundY ${f.o.groundY}, expected ${e.h - 30}`); return f; }; }
