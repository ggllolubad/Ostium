// World II, The Rotmire (Toxin + Water), second batch: the 11 entries of bible/world_II_rotmire.md not in world_II.js.
// Same world as world_II.js: kit_II's palette, base, textures, skin crease, peat stain, wet hair clump and leather
// crackle; new helpers in kit_II_b.js. Toxin ripens (swelling, blisters, moss, fungus, mould fur, rotted holes); water
// preserves (bog-tanned leather skin, stained brown, wrinkled). Palette: peat brown, bile green, lantern amber (the
// only warm note), plus ink black, bone and grey. Foes are drawn facing right with kit.foeBase and flipped.
// Built for the rig: joints first, f.bone() before every part, parts drawn complete, overlap at every joint.
'use strict';
const K = require('../kit');
const W = require('./kit_II');
const X = require('./kit_II_b');
const { E, B, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { split, side } = require('../dirAC');
const { P } = W;
const { ang, elb } = X;

// ------------------------------------------------------------------ EEL-CATCHER (cast, human 1.0)
// An eel-catcher of the stilt villages in a wading stance, knees bent, weight on the front foot, the eel glaive held low
// in both hands, its comb of five sprung tines down toward the water, ready to stab. The near hand holds high on the
// ash pole at the chest (forearm rising from the elbow at the waist), the far hand low on it (the far elbow at the
// waist behind the belly, the forearm level). Head bowed at the water by the tines. The long willow eel trap is slung
// across the back on a strap, its mouth by the hip, an eel's tail hanging out. Toxin has swollen the forearms and hands
// to twice their size: every old bite ripened into a blister or a fungal knot, the fingers fat and stiff.
// Rig: standard humanoid + glaive (hand_n), trap (torso), skirt (smock below the belt, pelvis).
// Motion: idle a slow stab at the water and a glance at the trap; attack a downward stab that pins a hero's foot.
function eelCatcher() {
  const [CW, CH] = TIERS.human;
  const f = new Fig(W.base(224, CH, { grimeY: 590 }));
  W.textures(f);
  const seed = 224, gy = CH - 30, H = 100;
  const skin = '#7a5636', skinD = '#664628';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#2a1a12' }, o));
  const canvas = '#4e4430', canvasD = '#3a3222', woolC = '#4e3e2c', leather = '#3e2c1c';
  const CV = (o = {}) => Object.assign({ fill: canvas, shadow: '#1e160c', shade: 0.42, tex: 'weave' + seed, texOp: 0.45 }, o);
  const WL = (o = {}) => Object.assign({ fill: woolC, shadow: '#16100a', shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const LT = (o = {}) => Object.assign({ fill: leather, shadow: '#120c06', shade: 0.42, tex: 'leather' + seed, texOp: 0.7, light: '#6a5236' }, o);
  const N = [304, 330], C = [262, 390], Pv = [266, 498];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.16), SF = S.at(0.45, 0.08);
  // the glaive: ash pole down-forward at 65 degrees, the comb head at the water in front of the front foot
  const pd = E.norm([0.4226, 0.9063]), PH = [503, 708], pA = ang([0, 0], pd);
  const onPole = y => [PH[0] - (PH[1] - y) / pd[1] * pd[0], y];
  const gN = onPole(414), gF = onPole(498), butt = onPole(384);
  const EN = [240, 442], EF = [306, 500];
  const HN = [276, 516], KN = [366, 616], AN = [340, 746];
  const HF = [252, 510], KF = [204, 628], AF = [150, 746];
  const hA = 0.9, neck0 = N, HC = add(neck0, rot([0.12 * H, -0.5 * H], hA));
  const belt = v => S.at(v, 0.92);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, gN], arm_f: [SF, EF, gF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('glaive', gN, 'hand_n').joint('trap', S.at(-0.6, 0.3), 'torso').joint('skirt', S.at(0, 0.92), 'pelvis');

  // swollen forearm: blisters and fungal knots ripened from old eel bites, along the forearm E0 -> W0
  const bites = (E0, W0, w) => {
    for (let i = 0; i < 5; i++) { const t = 0.15 + i * 0.16, o = (i % 2 ? 1 : -1) * w * (0.12 + f.r() * 0.2); W.pustule(f, lp(E0, W0, t, o), 3 + f.r() * 3, { burst: i === 3, col: mix(P.bile, P.tan, 0.5) }); }
    for (const t of [0.3, 0.62]) { const q = lp(E0, W0, t, -w * 0.3); f.part(ell(q, 9, 7, f.r() * 3, 10).map((p, i) => i % 2 ? add(p, mul(sub(p, q), 0.25)) : p), { fill: mix(P.bileD, P.tan, 0.4), shadow: '#1e1a0c', shade: 0.45, inkW: 1, inkHeavy: 1.6, cast: false, tex: 'moss' + seed, texOp: 0.6 }); f.flat(ell(q, 2.5, 2, 0, 6), '#e4e0cc', { op: 0.6 }); } // fungal knots
    for (let i = 0; i < 4; i++) { const q = lp(E0, W0, 0.2 + i * 0.2, w * 0.25); f.line([q, add(q, rot([6, 0], ang(E0, W0) + 1.2)), add(q, rot([4, 4], ang(E0, W0)))], 1.2, '#2a1a12', { op: 0.7 }); } // old bite scars, a ring of punctures
  };

  // ---- the eel trap slung on the back, mouth down by the hip, the tied tail up behind the shoulder
  f.bone('trap');
  const tMouth = [214, 516], tTip = [128, 290];
  X.eelTrap(f, tMouth, tTip, 46, 13, { col: '#7a6844' });
  X.eel(f, [add(tMouth, [-4, 10]), add(tMouth, [-10, 40]), add(tMouth, [-4, 76]), add(tMouth, [-12, 110])], 16, {}); // an eel's tail hanging out
  W.mossClump(f, lerp(tMouth, tTip, 0.55), 14, 6, { ang: ang(tMouth, tTip) });
  // ---- far leg: breeches to the knee, the bare shin wrinkled where the wader has slumped to mid-calf
  X.bareLeg(f, HF, KF, AF, 56, 60, 44, '_f', SK({ fill: skinD }));
  f.bone('shin_f');
  W.creaseField(f, lp(KF, AF, 0.35, 0), 16, 26, 5, ang(KF, AF) + 1.4, 30, 2, { lip: 1.6, lit: '#a07a50', col: '#1e120a' });
  X.tubeLeg(f, lp(KF, AF, 0.52, 0), lerp(KF, AF, 0.76), AF, [52, 50, 44], '_f', LT());
  f.bone('shin_f');
  for (let i = 0; i < 3; i++) X.folds(f, [[lp(KF, AF, 0.56 + i * 0.1, -24), lp(KF, AF, 0.6 + i * 0.1, 0), lp(KF, AF, 0.56 + i * 0.1, 24)]], 3); // the slumped wader's rolls
  f.bone('foot_f');
  B.boot(f, AF, 1, 54, leather, { tex: 'leather' + seed, texOp: 0.6, shaft: 0.7 });
  W.mudSplats(f, add(AF, [10, 30]), 34, 10, 7, P.peatD);
  f.bone('thigh_f');
  X.tubeLeg(f, HF, lerp(HF, KF, 0.55), KF, [62, 56, 48], '_f', WL({ fill: mix(woolC, '#000', 0.15) }), { extra: () => {} });
  f.bone('shin_f');
  f.part(K.ragLimb(f, lerp(KF, HF, 0.15), lerp(KF, AF, 0.12), 48, 46, { depth: 7, teeth: 5 }), WL({ fill: mix(woolC, '#000', 0.15), cast: false })); // ragged breeches cuff below the knee
  // ---- far arm: the elbow at the waist behind the belly, the forearm level, reaching to the low grip
  X.arm(f, SF, EF, gF, [40, 46, 50], '_f', SK({ fill: skinD }), { bp: [[1, 0.5, 0.35, 0.22]], bq: [[1, 0.4, 0.3, 0.2]] });
  f.bone('forearm_f'); bites(EF, gF, 50);

  // ---- torso: wool shirt under a waxed-canvas smock
  f.bone('torso');
  const prof = [[-0.08, 0.3, 0.3], [0.05, 0.6, 0.52], [0.22, 0.68, 0.62], [0.42, 0.62, 0.58], [0.62, 0.54, 0.52], [0.82, 0.58, 0.54], [0.96, 0.62, 0.56]];
  f.part(S.shape(prof), WL());
  const smP = S.shape(prof.slice(1).map(([v, b, fr]) => [v, b + 0.07, fr + 0.06]));
  const smD = f.part(smP, CV());
  X.clothWear(f, smD, E.bbox(smP), { stain: '#1a140a', seed: 4, tone: [[[S.at(-0.6, 0.1), S.at(-0.1, 0.3), S.at(-0.2, 0.9), S.at(-0.7, 0.9)], '#0e0a04', 0.45, 14]] });
  W.stains(f, smD, E.bbox(smP), '#0e0a06', 0.05, 4.6, -2.7, 14, 0.7, 3); W.stains(f, smD, E.bbox(smP), '#3a2a18', 0.012, 4.2, -2.2, 16, 0.6, 3); // grease, eel slime and peat worked into the wax
  for (let i = 0; i < 6; i++) { const q = W.scatter(f, S.at(0.2, 0.5), 40, 50); f.line([q, add(q, [(f.r() - 0.5) * 4, 14 + f.r() * 20]), add(q, [(f.r() - 0.5) * 6, 26 + f.r() * 30])], 2 + f.r() * 2, f.r() < 0.35 ? '#4a1410' : '#1a140a', { op: 0.55 }); } // runs of slime and old eel blood down the front
  for (const [v, b] of [[-0.3, 0.3], [0.4, 0.62]]) f.part(ell(S.at(v, b), 12, 9, 0.4, 10).map((q, k) => k % 2 ? add(q, [(f.r() - 0.5) * 5, (f.r() - 0.5) * 5]) : q), { fill: '#6a5c40', shade: 0.3, maxShade: 3, inkW: 0, cast: false, hatch: false, gritOp: 0.6 }); // wax worn through to the bare canvas
  f.part([S.at(-0.08, -0.04), S.at(0.36, 0.0), S.at(0.3, 0.12), S.at(0.02, 0.1)], WL({ cast: false })); // the shirt collar at the neck
  X.folds(f, [[S.at(0.3, 0.2), S.at(0.2, 0.42), S.at(0.26, 0.66)], [S.at(-0.3, 0.3), S.at(-0.36, 0.6)], [S.at(0.5, 0.6), S.at(0.36, 0.78), S.at(0.42, 0.9)]], 2.6, { lit: '#9a8a62' });
  f.line([S.at(0.62, 0.2), S.at(0.6, 0.5), S.at(0.56, 0.8)], 2, '#a8986a', { op: 0.45 }); // wax sheen down the lit front
  f.part([S.at(-0.5, 0.46), S.at(-0.24, 0.44), S.at(-0.24, 0.64), S.at(-0.5, 0.66)], CV({ fill: canvasD, sharp: true, inkW: 1.1, cast: false })); f.stitches([S.at(-0.5, 0.46), S.at(-0.24, 0.44), S.at(-0.24, 0.64), S.at(-0.5, 0.66), S.at(-0.5, 0.46)], P.boneD, 0.8); // patch
  // the trap's strap: over the near shoulder, across the chest, behind the far hip
  f.stroke([S.at(-0.5, -0.02), S.at(0.0, 0.06), S.at(0.4, 0.36), S.at(0.66, 0.72)], 14, '#1a120a');
  f.stroke([S.at(-0.5, -0.02), S.at(0.0, 0.06), S.at(0.4, 0.36), S.at(0.66, 0.72)], 10, '#4a3622');
  f.line([S.at(-0.4, 0.0), S.at(0.02, 0.07), S.at(0.4, 0.34)], 1, '#8a6a46', { op: 0.6 });
  f.rivet(S.at(0.3, 0.27), 3.2, P.ironL);

  // ---- near leg: weight on it; wool breeches, the leather wader pulled up to the thigh and tied to the belt
  X.tubeLeg(f, HN, lerp(HN, KN, 0.5), KN, [70, 62, 52], '_n', WL());
  X.tubeLeg(f, lp(HN, KN, 0.36, 0), KN, AN, [64, 56, 46], '_n', LT(), { bp: [[1, 0.25, 0.16, 0.2]], extra: d => { W.stains(f, d, E.bbox([HN, KN, AN].map(q => q).concat([add(KN, [40, 0]), add(AN, [-40, 0])])), '#0e0a06', 0.03, 4, -2.3, 9, 0.6, 3); } });
  f.bone('thigh_n');
  f.part(limb(lp(HN, KN, 0.3, -36), lp(HN, KN, 0.42, 36), 14, 14, { steps: 4, capK: 0.6 }), LT({ fill: mix(leather, '#000', 0.2), cast: false })); // the wader's turned top
  W.rope(f, [lp(HN, KN, 0.34, 10), lp(HN, KN, 0.12, 14), belt(0.2)], 2.6, { col: P.ropeD }); // tied to the belt
  f.bone('shin_n');
  X.folds(f, [[lp(KN, AN, 0.05, -26), lp(KN, AN, 0.12, 0), lp(KN, AN, 0.08, 26)], [lp(KN, AN, 0.7, -20), lp(KN, AN, 0.74, 20)]], 3);
  f.line([lp(KN, AN, 0.15, 14), lp(KN, AN, 0.6, 12)], 1.8, '#7a6044', { op: 0.5 }); // worn-bright shin
  f.bone('foot_n');
  B.boot(f, AN, 1, 58, leather, { tex: 'leather' + seed, texOp: 0.6, shaft: 0.7 });
  W.mudSplats(f, add(AN, [20, 30]), 40, 12, 9, P.peatD);

  // ---- smock skirt below the belt, the hem rotted into holes and mould fur
  f.bone('skirt');
  const hl = [398, 640], hr = [180, 630];
  const skP = [belt(-0.66), belt(0.62), [384, 560], hl, ...X.hem(f, hl, hr, 10, 20, { down: true }), hr, [196, 560]];
  const skD = f.part(skP, CV());
  X.clothWear(f, skD, E.bbox(skP), { stain: '#140e08', seed: 6, tone: [[[[180, 580], [398, 586], [398, 660], [180, 660]], '#1e160a', 0.7, 14]] }); // mud soaked up from the hem
  W.stains(f, skD, E.bbox(skP), '#0e0a06', 0.05, 4.6, -2.7, 18, 0.7, 3); W.mudSplats(f, [290, 600], 90, 30, 14, P.peatD);
  X.folds(f, [[[334, 530], [346, 580], [350, 632]], [[268, 534], [258, 586], [262, 628]], [[226, 530], [206, 590], [198, 626]], [[300, 540], [304, 600]]], 2.4, { lit: '#9a8a62' });
  X.holes(f, [290, 612], 80, 12, 5, { r0: 4, r1: 9 });
  X.mouldFur(f, [hl, [330, 646], [250, 646], hr], 10);
  for (const p of [[350, 652], [262, 652]]) W.drip(f, p, 0.9, P.peatD);
  // ---- belt: leather, the gutting knife in its sheath, a spool of gut line, a twist of salt in a rag
  f.bone('pelvis');
  const bD = f.part([add(belt(-0.7), [0, -8]), add(belt(0.64), [0, -8]), add(belt(0.64), [0, 8]), add(belt(-0.7), [0, 8])], LT({ inkW: 1.3, cast: false }));
  f.part(ell(belt(0.4), 9, 8, 0, 8), { fill: P.ironL, shade: 0.4, inkW: 1.1, cast: false }); f.flat(ell(belt(0.4), 4, 4, 0, 6), '#1a140c');
  const kn = belt(-0.38);
  f.part([add(kn, [-10, 2]), add(kn, [10, 2]), add(kn, [6, 70]), [...add(kn, [-2, 84]), 1], add(kn, [-8, 66])], LT({ fill: '#5a4028' })); // sheath
  f.part([add(kn, [-6, -26]), add(kn, [6, -26]), add(kn, [8, 2]), add(kn, [-8, 2])], { fill: P.wood, shadow: P.woodD, shade: 0.4, inkW: 1.1, cast: false, tex: 'wood' + seed }); // knife haft
  for (let i = 0; i < 3; i++) f.line([add(kn, [-6, -20 + i * 8]), add(kn, [6, -18 + i * 8])], 1.2, '#1a120a', { op: 0.7 });
  const sp = belt(0.12);
  f.part([add(sp, [-14, 6]), add(sp, [14, 6]), add(sp, [14, 30]), add(sp, [-14, 30])], { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1.2, cast: false }); // spool
  for (let i = 0; i < 6; i++) f.line([add(sp, [-12, 10 + i * 3.4]), add(sp, [12, 9 + i * 3.4])], 1.2, '#c8b890', { op: 0.85 });
  f.line([add(sp, [12, 26]), add(sp, [20, 40]), add(sp, [16, 70])], 0.9, '#c8b890', { op: 0.8 }); // a loose end of gut line
  const sr = belt(-0.62);
  f.part([add(sr, [-8, 4]), add(sr, [8, 2]), add(sr, [14, 26]), add(sr, [0, 36]), add(sr, [-12, 24])], { fill: '#a89a7a', shadow: '#5a5040', shade: 0.4, inkW: 1.1, cast: false, tex: 'weave' + seed }); // salt rag
  f.line([add(sr, [-8, 8]), add(sr, [8, 7])], 2, P.ropeD);
  f.flat(ell(add(sr, [2, 22]), 4, 3, 0, 6), '#e8e4d8', { op: 0.7 });

  // ---- head: bowed at the water; long face, hollow cheeks, stubble, a knitted cap pulled low, one ear blistered
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-6, 14]), hF([[-0.1, 0.4]])[0]], [44, 36]), SK());
  f.line([add(neck0, [10, 6]), hF([[0.04, 0.44]])[0]], 1.4, '#2a1a12', { op: 0.6 }); // neck tendon
  { const F = X.face(f, HC, H, hA, { skin, jaw: 1.12, chin: 0.05, nose: 1.12, hook: 0.2, mouth: 'set', squint: 0.55, browDown: 0.05, gaunt: true, beard: 'stubble', beardCol: '#2a1e14', iris: '#1a120a', eyeWhite: '#b8aa86', hairCol: '#2a1e14', noEar: true }); X.anat(f, F, H, { hollow: 0.45 }); }
  { const ed = f.part(hF(ell([-0.21, 0.06], 0.075, 0.12, 0.1, 10)), SK({ fill: mix(skin, '#3a2a1a', 0.35), shadow: '#2a1a12', light: mix(skin, '#5a4a3a', 0.4), cast: false, inkW: 1.1, maxShade: 3 })); W.softTone(f, ed, [[hF(ell([-0.24, 0.1], 0.05, 0.08, 0, 8)), '#140a06', 0.45, 3]]); W.crease(f, hF([[-0.18, -0.02], [-0.24, 0.06], [-0.2, 0.15]]), 1.4, { lip: 1, lit: '#c09a70', col: '#1e120a' }); } // the ear swollen, thick and creased
  W.pustule(f, hF([[-0.24, 0.16]])[0], 5, { col: mix(P.bileD, P.tan, 0.5) }); // the swollen ear's blister
  // knitted cap: ribbed wool pulled low over the brow, a folded brim, a hole worn in the crown
  const capP = hF([[-0.42, 0.0], [-0.46, -0.28], [-0.32, -0.54], [-0.04, -0.68], [0.24, -0.62], [0.38, -0.44], [0.38, -0.3], [0.2, -0.28], [-0.1, -0.24], [-0.28, -0.12]]);
  const capD = f.part(capP, WL({ fill: '#5e4a32', tex: 'weave' + seed }));
  for (let i = 0; i < 9; i++) { const u = -0.36 + i * 0.09; f.line(hF([[u, -0.24 - Math.abs(u) * 0.1], [u * 0.9 - 0.02, -0.44], [u * 0.6, -0.62]]), 1.1, '#1a120a', { op: 0.55 }); }
  f.part(hF([[-0.44, 0.02], [-0.3, -0.14], [-0.1, -0.24], [0.2, -0.28], [0.4, -0.3], [0.4, -0.2], [0.2, -0.18], [-0.1, -0.15], [-0.3, -0.04], [-0.42, 0.1]]), WL({ fill: '#56442e', cast: true, castOp: 0.5 })); // the rolled brim, pulled down to the brows
  f.flat(hF(ell([0.0, -0.58], 0.05, 0.03, 0, 8)), '#120c06');
  W.softTone(f, capD, [[hF([[-0.44, -0.24], [-0.1, -0.14], [-0.3, 0.02]]), '#0a0604', 0.5, 6]]);
  // wet hair clumps from under the cap at the nape
  for (const [u, v, l] of [[-0.36, 0.1, 36], [-0.3, 0.16, 28], [-0.4, 0.0, 30]]) { const p = hF([[u, v]])[0]; W.hairClump(f, [p, add(p, [-3, l * 0.5]), add(p, [-1, l])], 9, { n: 3 }); }

  // ---- the eel glaive: a long ash pole and a flat iron head of five sprung tines like a comb, one bent
  f.bone('glaive');
  const nn = [-pd[1], pd[0]];
  f.part(limb(butt, PH, 15, 13, { steps: 12 }), { fill: '#8a7650', shadow: '#3a2a18', shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(butt, PH, 0.02, -3), lp(butt, PH, 0.97, -3)], 1.2, '#c8b088', { op: 0.5, straight: true });
  for (const t of [0.34, 0.37, 0.4]) f.line([lp(butt, PH, t, -9), lp(butt, PH, t + 0.01, 9)], 2.6, P.ropeD, { straight: true }); // a binding where an old split was mended
  f.flat([lp(butt, PH, 0.85, -8), lp(butt, PH, 0.85, 8), lp(butt, PH, 1.0, 8), lp(butt, PH, 1.0, -8)], P.peatD, { op: 0.6 }); // wet dark end
  // the head: a socket, a flat cross bar, five tines sprung apart, barbed; the second one bent
  const hd = frame(PH, pA, 1);
  f.part(hd([[-34, -9], [4, -11], [6, 11], [-34, 9]]), { fill: P.iron, shadow: '#100c08', shade: 0.4, inkW: 1.2, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
  f.part(hd([[0, -42], [16, -44, 1], [18, 44, 1], [2, 42]]), { fill: P.ironL, shadow: '#100c08', shade: 0.4, inkW: 1.3, sharp: true, tex: 'mottle' + seed, texOp: 0.6 });
  for (let i = 0; i < 5; i++) {
    const y = -36 + i * 18, bend = i === 1 ? -0.5 : (i - 2) * 0.05, a0 = [16, y], a1 = add(a0, rot([34, 0], bend)), a2 = add(a1, rot([26, 0], bend * 1.6));
    f.part(hd(K.chain([a0, a1, a2], [7, 6, 3.5], { steps: 4 })), { fill: P.ironL, shadow: '#100c08', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false });
    f.part(hd([add(a2, rot([-12, 0], bend)), add(a2, rot([-6, -6], bend)), add(a2, rot([-4, 0], bend))]), { fill: P.ironL, shade: 0.4, inkW: 0.8, cast: false, sharp: true }); // the barb
  }
  f.flat(hd([[2, -40], [14, -40], [14, 6], [4, 14]]), '#5a3a24', { op: 0.4 });
  f.line(hd([[6, -38], [6, 38]]), 1, '#a8a090', { op: 0.6 });
  // ---- far hand: fat and stiff, wrapped round the pole low down
  f.bone('hand_f');
  B.grip(f, gF, EF, ang(gF, butt), 34, skinD, { shadow: '#2a1a12', tex: 'wrinkle' + seed, texOp: 0.6, name: 'eel far' });
  W.pustule(f, add(gF, [-6, 10]), 4, { col: mix(P.bile, P.tan, 0.45) });

  // ---- near arm: shirt sleeve rolled above the elbow, the forearm swollen with bites, the hand high on the pole
  X.arm(f, SN, EN, gN, [44, 48, 52], '_n', SK(), { bp: [[1, 0.45, 0.4, 0.22]], bq: [[1, 0.5, 0.25, 0.2]] });
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, SN, lp(SN, EN, 0.62, 0), 56, 52, { depth: 6, teeth: 5 }), WL());
  f.part(limb(lp(SN, EN, 0.6, 0), lp(SN, EN, 0.76, 0), 56, 54, { steps: 4, capK: 0.5 }), WL({ fill: '#5a4834', cast: false })); // the rolled cuff
  for (let i = 0; i < 3; i++) f.line([lp(SN, EN, 0.62 + i * 0.05, -26), lp(SN, EN, 0.63 + i * 0.05, 26)], 1.2, '#1a120a', { op: 0.6 });
  const slD = f.part(K.ragLimb(f, lp(SN, EN, -0.04, 0), lp(SN, EN, 0.4, 0), 56, 54, { depth: 9, teeth: 5 }), CV({ fill: canvasD, shade: 0.3 })); // the smock's short sleeve over it
  X.folds(f, [[lp(SN, EN, 0.05, -14), lp(SN, EN, 0.2, -6), lp(SN, EN, 0.34, -12)], [lp(SN, EN, 0.12, 14), lp(SN, EN, 0.3, 16)]], 2.2, { lit: '#9a8a62' });
  f.bone('forearm_n'); bites(EN, gN, 52);
  f.bone('hand_n');
  B.grip(f, gN, EN, ang(gN, butt), 34, skin, { shadow: '#2a1a12', tex: 'wrinkle' + seed, texOp: 0.6, name: 'eel near' });
  const th = add(gN, rot([-6, -16], pA)); // a rag bound round the thumb
  f.part(ell(th, 9, 6, pA, 10), { fill: '#a89a7a', shadow: '#5a5040', shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed });
  f.flat(ell(add(th, [2, 1]), 3, 2, 0, 6), '#5c0f0b', { op: 0.5 });
  W.pustule(f, add(gN, [4, 8]), 3.5, { col: mix(P.bile, P.tan, 0.45) });

  // ---- the shallows: ripples round the tines and the shins
  f.bone('root');
  for (const [a, w] of [[AN, 46], [AF, 42]]) f.flat(ell(add(a, [16, 44]), w, 5, 0, 14), P.waterL, { op: 0.4 });
  W.ripples(f, add(PH, [30, 70]), 40, 6, 3, '#6a6a4a', 0.5);
  return f;
}

// ------------------------------------------------------------------ SIN-EATER (cast, human 1.0)
// The village sin-eater, paid a coin to eat the funeral loaf off each corpse. Hunched from the upper back over a round
// mouldy loaf held to his mouth in both hands, elbows out; the lower back sways so the hard, swollen gut rides forward
// under the loaf, and the weight sits on the heels. Toxin has ripened what he ate into the gut (blistered, veined bile
// green, the open shirt straining off it); water has tanned the rest of him, bones at the wrists and collar. The
// coarse black wool cloak hangs from his shoulders behind him, its hem rotted into holes.
// Rig: standard humanoid + loaf (hand_n), cloak (torso), coins and bowl (pelvis), scarf (torso).
// Motion: idle chewing steadily (head bob), never swallowing; attack a lurching bite; other action eats a curse off an ally.
function sinEater() {
  const [CW, CH] = TIERS.human;
  const f = new Fig(W.base(229, CH, { grimeY: 600 }));
  W.textures(f);
  const seed = 229, gy = CH - 30, H = 98;
  const skin = '#7c5838', skinD = '#64462c';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#2a1a12' }, o));
  const black = '#2a2622', blackL = '#4a443c';
  const CL = (o = {}) => Object.assign({ fill: black, shadow: '#0c0a08', light: blackL, shade: 0.42, tex: 'weave' + seed, texOp: 0.6 }, o);
  const linen = '#8e7e62';
  const LN = (o = {}) => Object.assign({ fill: linen, shadow: '#4a3e2e', shade: 0.42, tex: 'weave' + seed, texOp: 0.45 }, o);
  const N = [318, 298], C = [244, 330], Pv = [258, 478];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.24, 0.16), SF = S.at(0.42, 0.06);
  const hA = 0.42, neck0 = N, HC = add(neck0, rot([0.2 * H, -0.46 * H], hA));
  const hF = frame(HC, hA, H);
  const mouth = hF([[0.25, 0.3]])[0], loafC = add(mouth, [40, 18]), loafR = 44;
  const WN = add(loafC, [-6, 40]), EN = [306, 398];
  const WF = add(loafC, [34, -4]), EF = [436, 414];
  const HN = [276, 490], KN = [326, 616], AN = [326, 750];
  const HF = [252, 484], KF = [262, 616], AF = [232, 750];
  const belt = v => S.at(v, 0.94);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, WN], arm_f: [SF, EF, WF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('loaf', loafC, 'hand_n').joint('cloak', S.at(-0.3, 0.02), 'torso').joint('coins', belt(0.1), 'pelvis').joint('bowl', belt(-0.55), 'pelvis').joint('scarf', S.at(0.1, 0.02), 'torso');

  // ---- the cloak behind him: coarse black wool from the shoulders to the calves, hem rotted into holes and mould fur
  f.bone('cloak');
  const ch0 = [128, 700], ch1 = [300, 712];
  const clP = [S.at(-0.1, -0.12), S.at(0.3, -0.04), S.at(0.1, 0.3), [300, 560], ch1, ...X.hem(f, ch1, ch0, 11, 24, { down: true }), ch0, [140, 560], [172, 420], S.at(-0.9, 0.1), S.at(-0.6, -0.08)];
  const clD = f.part(clP, CL());
  X.clothWear(f, clD, E.bbox(clP), { stain: '#060504', wear: '#6a6256', seed: 11, tone: [[[[130, 600], [300, 610], [300, 720], [130, 720]], '#000', 0.4, 14]] });
  X.folds(f, [[[200, 380], [176, 500], [160, 640]], [[240, 420], [226, 560], [222, 690]], [[268, 460], [270, 600], [276, 700]], [[180, 330], [158, 420]]], 3.2, { lit: '#6a6256' });
  X.holes(f, [214, 660], 70, 30, 6, { r0: 5, r1: 12 });
  X.mouldFur(f, [ch1, [240, 724], [180, 728], ch0], 12);
  for (const p of [[200, 730], [260, 724]]) W.drip(f, p, 1, P.peatD);

  // ---- far leg: thin, ragged knee breeches, bare shin, black-nailed bare foot
  X.bareLeg(f, HF, KF, AF, 54, 56, 40, '_f', SK({ fill: skinD }), { nail: '#1a1410' });
  f.bone('thigh_f'); f.part(K.ragLimb(f, HF, lp(HF, KF, 1.08, 0), 62, 50, { depth: 8, teeth: 5 }), CL({ fill: '#3a3228' }));
  f.bone('foot_f'); W.mudSplats(f, add(AF, [16, 30]), 32, 10, 7, P.peatD);
  // ---- far arm: the elbow out in front under the loaf, the hand round the loaf's far side
  X.arm(f, SF, EF, WF, [38, 34, 26], '_f', SK({ fill: skinD }));
  f.bone('upperarm_f'); f.part(K.ragLimb(f, SF, lp(SF, EF, 0.7, 0), 46, 42, { depth: 7, teeth: 5 }), LN({ fill: mix(linen, '#000', 0.25) }));
  f.bone('hand_f');
  B.hand(f, WF, ang(EF, WF) - 0.4, 24, skinD, { spread: 0.2, curl: 0.75, shadow: '#2a1a12' });

  // ---- body: gaunt chest, the swollen gut riding forward; the linen shirt hangs open off it
  f.bone('torso');
  const prof = [[-0.06, 0.3, 0.3], [0.06, 0.58, 0.5], [0.22, 0.62, 0.56], [0.4, 0.54, 0.62], [0.56, 0.46, 0.98], [0.72, 0.42, 1.22], [0.86, 0.46, 1.2], [0.98, 0.52, 0.86], [1.08, 0.5, 0.5]];
  const tP = S.shape(prof);
  const tD = f.part(tP, SK());
  f.flat(tD, `url(#leather${seed})`, { op: 0.6 });
  // the gut: hard, round, sagging low; blistered and veined bile green, a navel pushed out, stretch marks
  const gP = [S.at(0.2, 0.3), S.at(0.5, 0.3), [372, 378], [408, 392], [436, 420], [454, 456], [468, 498], [462, 530], [440, 552], [404, 560], [372, 556], [340, 546], [312, 522], [292, 484], S.at(0.0, 0.5)];
  const gD = f.part(gP, SK({ fill: mix(skin, P.bileD, 0.16), shadow: '#26180e', cast: false, inkW: 0, inkHeavy: 0, k: 0.9 }));
  f.line([[372, 378], [408, 392], [436, 420], [454, 456], [468, 498], [462, 530], [440, 552], [404, 560], [372, 556], [340, 546], [312, 522]], 1.6, INK); f.line([[392, 384], [426, 404], [450, 440], [466, 490]], 3.6, INK, { op: 0.9 });
  W.softTone(f, gD, [[[[300, 500], [470, 500], [460, 560], [330, 560]], '#1a0e06', 0.55, 16], [[[360, 400], [430, 420], [440, 470], [380, 450]], '#e0c89a', 0.25, 14]]); // the weight settled low, the stretched top catching the light
  W.crease(f, [[316, 520], [360, 532], [410, 536], [450, 528]], 2.8, { lip: 2.2, lit: '#c8a878', col: '#1e120c', op: 0.6 }); // the fold where it hangs over the belt
  W.crease(f, [S.at(0.36, 0.3), [350, 372], [380, 378]], 2.6, { lip: 2, lit: '#c09a6a', col: '#1e120c', op: 0.7 }); // where the ribs end and the gut begins
  X.swelling(f, gD, E.bbox(gP), [388, 452], { lit: '#e0c89a', mottle: '#3a2e14', vein: '#4a5a1a', veins: 9, seed: 9, dark: 0.5 });
  f.part(ell([446, 492], 7, 6, 0, 8), SK({ fill: mix(skin, P.bileD, 0.3), cast: false, inkW: 1, tex: undefined })); f.flat(ell([447, 493], 2.8, 2.2, 0, 6), '#1a0e08'); // the pushed-out navel
  for (let i = 0; i < 5; i++) W.crease(f, [[340 + i * 22, 500 - i * 2], [348 + i * 22, 512], [352 + i * 22, 522]], 1.6, { lip: 1.2, lit: '#c8b080', col: '#3a2a14', op: 0.5 }); // stretch marks under the sag
  W.pustules(f, [410, 450], 36, 30, 6, 2.5, 5, { burst: 0.35 });
  f.flat([[322, 540], [370, 556], [430, 552], [390, 568], [330, 560]], '#0e0a06', { op: 0.6 }); // the shadow under the sag
  // ribs and collarbone showing through the leather of the chest
  for (let i = 0; i < 4; i++) W.crease(f, [S.at(-0.3, 0.16 + i * 0.07), S.at(0.0, 0.14 + i * 0.07), S.at(0.3, 0.2 + i * 0.07)], 3, { col: '#1e120c', lit: '#b88a5e', lip: 2.6, op: 0.7 });
  W.crease(f, [S.at(-0.1, 0.03), S.at(0.2, 0.04), S.at(0.44, 0.08)], 3.4, { col: '#1e120c', lit: '#c09a6a', lip: 2.6 });
  // the open shirt: stained linen down the back and sides, hanging open off the gut, a torn sleeve
  const shP = [S.at(-0.66, -0.04), S.at(0.0, -0.02), S.at(-0.04, 0.2), S.at(0.0, 0.46), S.at(0.12, 0.8), S.at(0.24, 1.06), [...S.at(0.04, 1.14), 1], S.at(-0.16, 1.06), [...S.at(-0.32, 1.14), 1], S.at(-0.5, 1.04), S.at(-0.58, 0.6)];
  const shD = f.part(shP, LN({ fill: '#7a6c54' }));
  X.clothWear(f, shD, E.bbox(shP), { stain: '#3a2a14', wear: '#d8c8a8', seed: 13 });
  X.folds(f, [[S.at(-0.1, 0.1), S.at(-0.2, 0.4), S.at(-0.14, 0.8)], [S.at(-0.4, 0.2), S.at(-0.44, 0.6)], [S.at(0.02, 0.5), S.at(0.1, 0.78), S.at(0.16, 1.0)]], 2.4, { lit: '#d8c8a8' });
  f.flat(ell(S.at(-0.3, 0.7), 18, 12, 0.4, 10), P.bileD, { op: 0.35 }); // a bile stain
  f.part([S.at(0.28, 0.0), S.at(0.5, 0.06), S.at(0.62, 0.3), S.at(0.68, 0.48), S.at(0.5, 0.42), S.at(0.38, 0.2)], LN({ cast: false })); // the shirt's far front edge, open
  // the near half of the shirt hangs open off the gut, strained at the last lace hole, its laces hanging
  const sn = [S.at(-0.1, 0.02), S.at(0.24, 0.06), S.at(0.26, 0.3), [336, 400], [326, 470], [338, 532], [...[322, 546], 1], [300, 530], [...[284, 548], 1], [270, 520], S.at(-0.2, 0.7), S.at(-0.24, 0.3)];
  const snD = f.part(sn, LN({ fill: '#857660' }));
  X.clothWear(f, snD, E.bbox(sn), { stain: '#3a2a14', wear: '#c8b898', seed: 15 });
  X.folds(f, [[S.at(0.2, 0.12), [316, 400], [318, 470]], [S.at(0.0, 0.2), [290, 420], [292, 500]], [[330, 420], [324, 480], [332, 526]]], 2.4, { lit: '#c8b898' });
  for (const q of [[334, 420], [330, 450], [328, 480]]) { f.flat(ell(q, 2.4, 2.4, 0, 6), '#1a120a'); f.line([q, add(q, [10, -2])], 1.2, '#5a4a30'); }
  f.line([[328, 480], [338, 500], [334, 530]], 1.2, '#5a4a30');
  for (let i = 0; i < 2; i++) f.line([S.at(0.0 + i * 0.6, 0.3 + i * 0.1), S.at(0.06 + i * 0.6, 0.42 + i * 0.1), S.at(0.02 + i * 0.6, 0.56 + i * 0.1)], 1.4, '#5a4a30');

  // ---- near leg
  X.bareLeg(f, HN, KN, AN, 56, 58, 42, '_n', SK(), { nail: '#1a1410' });
  f.bone('thigh_n'); const brD = f.part(K.ragLimb(f, HN, lp(HN, KN, 1.08, 0), 66, 52, { depth: 9, teeth: 6 }), CL({ fill: '#3a3228' }));
  X.folds(f, [[lp(HN, KN, 0.3, -10), lp(HN, KN, 0.7, -16)], [lp(HN, KN, 0.5, 18), lp(HN, KN, 0.9, 12)]], 2.2, { lit: '#6a6256' });
  f.part([lp(HN, KN, 0.5, -4), lp(HN, KN, 0.5, 22), lp(HN, KN, 0.72, 22), lp(HN, KN, 0.72, -4)], CL({ fill: '#4a4034', sharp: true, inkW: 1, cast: false })); // patch
  f.bone('shin_n'); f.line([lp(KN, AN, 0.15, 10), lp(KN, AN, 0.8, 6)], 1.4, '#2a1a12', { op: 0.6 }); // the shin bone under the leather
  f.bone('foot_n'); W.mudSplats(f, add(AN, [20, 30]), 36, 10, 8, P.peatD);

  // ---- rope belt with the coins of the dead on cords, bored through; the bowl of funeral ale at the back hip
  f.bone('pelvis');
  W.rope(f, [belt(-0.6), belt(-0.1), belt(0.2), add(belt(0.36), [0, 6])], 6);
  f.part(ell(belt(-0.2), 9, 7, 0, 10), { fill: P.rope, shade: 0.45, inkW: 1.1, cast: false });
  f.bone('coins');
  for (let i = 0; i < 6; i++) {
    const top = belt(-0.44 + i * 0.12), l = 18 + (i % 3) * 14, c = add(top, [(i % 2) * 3, l]);
    f.line([top, c], 1.2, P.ropeD);
    f.part(ell(c, 7, 7.5, 0.3, 12), { fill: i % 3 === 1 ? '#6a6458' : '#8a867a', shadow: '#3a3630', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
    f.flat(ell(c, 1.8, 1.8, 0, 6), '#140e08'); f.line([add(c, [-4, -2]), add(c, [2, -5])], 0.8, '#c8c4b4', { op: 0.6 });
  }
  f.bone('bowl');
  const bw = add(belt(-0.55), [-6, 30]);
  f.line([belt(-0.55), add(bw, [-14, -6])], 1.6, P.ropeD); f.line([belt(-0.55), add(bw, [14, -6])], 1.6, P.ropeD);
  f.part([add(bw, [-22, -6]), add(bw, [22, -6]), add(bw, [18, 8]), add(bw, [8, 16]), add(bw, [-8, 16]), add(bw, [-18, 8])], { fill: P.woodL, shadow: P.woodD, shade: 0.42, inkW: 1.3, tex: 'wood' + seed, texOp: 0.5 });
  f.part(ell(add(bw, [0, -6]), 22, 5, 0, 14), { fill: '#2a1a0c', shade: 0.3, inkW: 1.1, cast: false, hatch: false }); f.line([add(bw, [-14, -7]), add(bw, [8, -8])], 1, '#8a6a3a', { op: 0.6 }); // the ale
  f.line([add(bw, [-6, 2]), add(bw, [4, 14])], 1, INK, { op: 0.6 }); // a crack

  // ---- head: long hollow face bowed into the loaf, sunken eyes, hair hacked short, the horn spoon behind the ear
  f.bone('head');
  f.part(K.chain([add(neck0, [-8, 14]), hF([[-0.08, 0.42]])[0]], [42, 34]), SK());
  f.line([add(neck0, [8, 10]), hF([[0.06, 0.44]])[0]], 1.6, '#2a1a12', { op: 0.6 });
  { const F = X.face(f, HC, H, hA, { skin, jaw: 1.1, chin: 0.04, nose: 1.15, hook: 0.25, mouth: 'set', squint: 0.6, browDown: 0.08, gaunt: true, jawShade: 0.6, iris: '#1a120a', eyeWhite: '#a89a78', hairCol: '#2a221a' }); X.anat(f, F, H, { hollow: 0.55, brow: 0.35 }); for (let i = 0; i < 3; i++) W.crease(f, F([[0.28, 0.3 + i * 0.05], [0.32, 0.34 + i * 0.05], [0.3, 0.4 + i * 0.05]]), 1.3, { lip: 1, lit: '#c09a70', col: '#1e120a', op: 0.6 }); } // the jaw muscle working
  f.flat(hF(ell([0.12, -0.06], 0.12, 0.08, 0.05, 12)), '#140a06', { op: 0.45 }); // sunken eyes
  f.flat(hF(ell([0.29, -0.06], 0.06, 0.06, 0, 10)), '#140a06', { op: 0.35 });
  // the mouth open on the loaf, the jaw working; mould crusted on the lips and chin
  f.flat(hF([[0.18, 0.27], [0.3, 0.25], [0.34, 0.31], [0.26, 0.35], [0.18, 0.33]]), '#1a0c08');
  for (let i = 0; i < 9; i++) { const q = hF([[0.18 + f.r() * 0.16, 0.32 + f.r() * 0.18]])[0]; f.flat(ell(q, 2 + f.r() * 3, 1.6 + f.r() * 2, f.r() * 3, 6), f.r() > 0.5 ? '#b8bc9c' : '#7e8a5a', { op: 0.8 }); }
  // hair hacked short: uneven clumps with bare patches
  for (let i = 0; i < 7; i++) { const u = -0.38 + i * 0.055, v = -0.42 + Math.abs(u + 0.1) * 0.5; const p = hF([[u, v]])[0]; W.hairClump(f, [p, add(p, rot([-4, 6], hA)), add(p, rot([-10 - f.r() * 8, 10 + f.r() * 8], hA))], 9 + f.r() * 4, { n: 3, pal: ['#1e1812', '#2a221a', '#362c20'] }); }
  f.part(hF([[-0.36, 0.12], [-0.4, -0.18], [-0.24, -0.42], [0.0, -0.5], [0.12, -0.48], [-0.02, -0.42], [-0.18, -0.26], [-0.28, -0.04]]), { fill: '#2a221a', shadow: '#0c0a08', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, inkW: 1.1 });
  f.flat(hF(ell([-0.2, -0.34], 0.05, 0.03, 0.3, 8)), mix(skin, '#000', 0.2), { op: 0.8 }); // a bare patch hacked to the scalp
  // horn spoon tucked behind the ear
  const sp0 = hF([[-0.3, -0.2]])[0], sp1 = hF([[-0.08, 0.26]])[0];
  f.part(limb(sp0, sp1, 7, 5, { steps: 6, capK: 1 }), { fill: '#7a6a4a', shadow: '#3a2e1c', shade: 0.4, inkW: 1, cast: false });
  f.part(ell(add(sp0, rot([-4, -8], hA)), 7, 11, hA - 0.4, 10), { fill: '#7a6a4a', shadow: '#3a2e1c', shade: 0.4, inkW: 1.1, cast: false });
  // ---- strip of burial shroud tied round the throat as a scarf, the ends hanging plumb
  f.bone('scarf');
  const sc = S.at(0.1, 0.02);
  f.part([add(sc, [-44, -12]), add(sc, [0, -16]), add(sc, [14, -6]), add(sc, [4, 8]), add(sc, [-44, 8])], LN({ fill: '#8e846c', cast: false }));
  f.part([add(sc, [-50, 0]), add(sc, [-40, 2]), add(sc, [-40, 44]), [...add(sc, [-48, 56]), 1], add(sc, [-56, 40])], LN({ fill: '#80765e' }));
  f.part([add(sc, [-42, 2]), add(sc, [-34, 2]), add(sc, [-30, 30]), [...add(sc, [-36, 40]), 1], add(sc, [-42, 28])], LN({ fill: '#746a52' }));
  f.flat(ell(add(sc, [-46, 24]), 3, 5, 0, 8), '#0e0a06', { op: 0.8 });

  // ---- the funeral loaf: round, grey, furred with mould, one bite gone where it meets his mouth
  f.bone('loaf');
  const lF = frame(loafC, -0.18, loafR);
  const loafCol = '#7a6a4e';
  const loafP = lF([[-1.0, 0.1], [-0.94, -0.3], [-0.6, -0.72], [-0.1, -0.86], [0.44, -0.74], [0.86, -0.4], [1.0, 0.06], [0.9, 0.46], [0.5, 0.62], [-0.1, 0.64], [-0.62, 0.56], [-0.92, 0.42]]);
  const lD = f.part(loafP, { fill: loafCol, shadow: '#2e2618', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6 });
  W.stains(f, lD, E.bbox(loafP), '#6a7044', 0.05, 4.6, -2.5, 17, 0.75, 3);
  W.stains(f, lD, E.bbox(loafP), '#c8ccb0', 0.08, 4.4, -2.9, 19, 0.6, 3);
  f.line(lF([[-0.7, -0.36], [-0.1, -0.5], [0.5, -0.36], [0.8, -0.12]]), 2, '#2a2618', { op: 0.6 }); // the scored cross on top
  f.line(lF([[-0.2, -0.78], [-0.06, -0.3], [0.04, 0.2]]), 2, '#2a2618', { op: 0.5 });
  X.mouldFur(f, lF([[-0.6, -0.68], [-0.1, -0.84], [0.44, -0.72], [0.84, -0.4]]), 6, { n: 26 });
  // the bite: a ragged notch of crumb where his mouth is, the crumb pale and wet
  f.part(lF([[-1.02, -0.14], [-0.8, -0.2], [-0.72, -0.02], [-0.8, 0.18], [-1.02, 0.22]]), { fill: '#9a8a68', shadow: '#5a4e36', shade: 0.35, inkW: 1.1, cast: false, hatch: false });
  for (let i = 0; i < 6; i++) f.flat(lF(ell([-0.8 + f.r() * 0.16, -0.16 + f.r() * 0.36], 0.03, 0.025, 0, 6)), '#4a3e2a', { op: 0.7 });
  // ---- the far hand's fingertips over the loaf's top
  f.bone('hand_f');
  for (let i = 0; i < 3; i++) { const b0 = lF([[0.5 + i * 0.12, -0.66 + i * 0.06]])[0], t0 = add(b0, rot([-14, 6], -0.6 + i * 0.1)); f.part(limb(b0, t0, 10, 8, { steps: 4, capK: 1 }), SK({ fill: skinD, cast: false, inkW: 1 })); f.flat(ell(t0, 2.4, 2, 0, 6), '#1a1410', { op: 0.9 }); }

  // ---- near arm: elbow out and down, the forearm rising to cup the loaf from below; bones at the wrist
  X.arm(f, SN, EN, WN, [42, 36, 26], '_n', SK());
  f.bone('upperarm_n'); f.part(K.ragLimb(f, lp(SN, EN, -0.1, 0), lp(SN, EN, 0.72, 0), 54, 46, { depth: 8, teeth: 5 }), LN());
  X.folds(f, [[lp(SN, EN, 0.1, -10), lp(SN, EN, 0.5, -14)], [lp(SN, EN, 0.3, 12), lp(SN, EN, 0.6, 8)]], 2, { lit: '#d8c8a8' });
  f.bone('forearm_n'); f.part(ell(lp(EN, WN, 0.92, -8), 6, 4, 0, 8), SK({ cast: false, inkW: 0.9 })); // the wrist knob
  f.bone('hand_n');
  B.hand(f, WN, ang(EN, WN) - 0.9, 26, skin, { spread: 0.3, curl: 0.65, shadow: '#2a1a12' });
  for (let i = 0; i < 4; i++) f.flat(ell(add(WN, rot([22, -10 + i * 7], ang(EN, WN) - 0.9)), 2.2, 1.6, 0, 6), '#1a1410', { op: 0.8 }); // blackened nails

  // ---- the near cloak edge over the shoulder, falling behind the arm (on the torso: shoulder cloth stays put)
  f.bone('cloak');
  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 44]), 44, 5, 0, 14), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ LEECH-BARBER (cast, human 1.0)
// The stilt villages' barber, who shaved, pulled teeth and bled the sick. Stooped, weight forward on bandy legs, both bare
// arms held out in front, palms up, as if offering them for inspection. The forearms are sleeved in fat black leeches,
// each swollen by toxin to a sausage and hanging plumb in a fringe; the bites beneath have ripened into weeping
// pustules. The face is round, shaved, pale and puffy, blistered where leeches have dropped off, a nick on the chin, mild
// eyes and a fixed professional smile. Linen apron stained brown over a leather jerkin and a wool tunic.
// Rig: standard humanoid + apron (pelvis), jar and bowl (pelvis), teeth (torso).
// Motion: idle turning one arm to admire the leeches (forearm_n roll); attack a grab, the leeches crossing onto the hero.
function leechBarber() {
  const [CW, CH] = TIERS.human;
  const f = new Fig(W.base(230, CH, { grimeY: 610 }));
  W.textures(f);
  const seed = 230, gy = CH - 30, H = 100;
  const pale = '#b09a7a', paleD = '#94805e', hand = '#86643e';
  const SKP = (o = {}) => W.SKH(f, Object.assign({ fill: pale, shadow: '#4a3a30', tex: 'mottle' + seed, texOp: 0.5 }, o));
  const SKT = (o = {}) => W.SKT(f, Object.assign({ fill: hand, shadow: '#2a1a12' }, o));
  const linen = '#9a8c6e', leatherC = '#4a3420', woolC = '#4a4030';
  const LN = (o = {}) => Object.assign({ fill: linen, shadow: '#3e3426', shade: 0.42, tex: 'weave' + seed, texOp: 0.45 }, o);
  const LT = (o = {}) => Object.assign({ fill: leatherC, shadow: '#140c06', light: '#7a5a3a', shade: 0.42, tex: 'leather' + seed, texOp: 0.7 }, o);
  const WL = (o = {}) => Object.assign({ fill: woolC, shadow: '#16120a', shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const N = [316, 302], C = [256, 346], Pv = [250, 474];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.18, 0.16), SF = S.at(0.46, 0.08);
  const EN = [368, 400], WN = [474, 396];
  const EF = [420, 372], WF = [522, 352];
  const HN = [262, 488], KN = [336, 604], AN = [318, 744];
  const HF = [240, 482], KF = [212, 610], AF = [176, 744];
  const hA = 0.06, neck0 = N, HC = add(neck0, rot([0.22 * H, -0.44 * H], hA));
  const belt = v => S.at(v, 0.92);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, WN], arm_f: [SF, EF, WF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('apron', S.at(0.3, 0.9), 'pelvis').joint('jar', belt(-0.6), 'pelvis').joint('bowl', belt(0.5), 'pelvis').joint('teeth', S.at(0.2, 0.0), 'torso');

  // a fringe of fat leeches on a forearm: a few lying along the top, most hanging plumb from the underside
  const leechSleeve = (E0, W0, wF, n, far) => {
    const d = E.norm(sub(W0, E0)), nn = [-d[1], d[0]];
    for (let i = 0; i < n; i++) { const t = 0.08 + i * 0.84 / (n - 1); W.pustule(f, lp(E0, W0, t, (i % 2 ? 0.2 : -0.1) * wF), 3 + f.r() * 2.5, { burst: i % 3 === 0, col: mix(P.bile, pale, 0.3) }); }
    for (let i = 0; i < 4; i++) { const t = 0.12 + i * 0.22, a = lp(E0, W0, t, wF * 0.3), b = lp(E0, W0, t + 0.2, wF * 0.36); X.leech(f, X.wig(a, b, 3, 3, i), 15 + f.r() * 4, { fat: true }); }
    for (let i = n - 1; i >= 0; i--) {
      const t = 0.06 + i * 0.86 / (n - 1) + (f.r() - 0.5) * 0.06, top = lp(E0, W0, t, -wF * (0.2 + f.r() * 0.2)), l = 30 + f.r() * 64 + (i % 3 === 1 ? 20 : 0);
      const sw = (f.r() - 0.5) * 34, bot = add(top, [sw, l]);
      X.leech(f, X.wig(bot, top, 5 + f.r() * 8, 4, f.r() * 6), 15 + f.r() * 11, { fat: true, sucker: false, col: far ? '#100e0a' : undefined });
      if (f.r() > 0.6) W.drip(f, add(bot, [0, 4]), 0.8, '#3a1a12');
    }
  };

  // ---- far leg: bandy, wool hose, a clog
  const clog = (A, s) => {
    const X0 = u => A[0] + u * s;
    const cl = [[X0(-0.4), gy, 1], [X0(-0.44), A[1] + 8], [X0(-0.2), A[1] - 4], [X0(0.3), A[1] + 4], [X0(0.8), gy - 26], [X0(1.24), gy - 22], [X0(1.36), gy - 30], [X0(1.34), gy - 10], [X0(1.2), gy, 1]];
    f.part(cl, { fill: P.woodL, shadow: P.woodD, shade: 0.42, tex: 'wood' + seed, texOp: 0.5, inkW: 1.4, inkHeavy: 2.4 });
    f.part([[X0(-0.42), gy, 1], [X0(1.22), gy, 1], [X0(1.22), gy - 7], [X0(-0.42), gy - 7]], { fill: P.woodD, shade: 0.3, inkW: 1.1, cast: false, sharp: true });
    f.line([[X0(0.36), A[1] + 8], [X0(0.8), gy - 22], [X0(1.2), gy - 20]], 1.4, mix(P.woodL, '#fff', 0.3), { op: 0.5 });
    f.line([[X0(0.6), gy - 20], [X0(0.7), gy - 10]], 1.2, INK, { op: 0.6 }); // a split in the wood
  };
  X.tubeLeg(f, HF, KF, AF, [60, 46, 34], '_f', WL({ fill: mix(woolC, '#000', 0.2) }), { bp: [[0, 0.6, 0.12, 0.2]] });
  f.bone('foot_f'); clog(AF, 50); W.mudSplats(f, add(AF, [20, 30]), 30, 10, 6, P.peatD);
  // ---- far arm: sleeve rolled above the elbow, the forearm sleeved in leeches, the palm up
  X.arm(f, SF, EF, WF, [40, 36, 30], '_f', SKP({ fill: paleD }));
  f.bone('upperarm_f'); f.part(K.ragLimb(f, SF, lp(SF, EF, 0.7, 0), 50, 46, { depth: 6, teeth: 5 }), WL());
  f.part(limb(lp(SF, EF, 0.62, 0), lp(SF, EF, 0.78, 0), 50, 48, { steps: 4 }), WL({ fill: '#5a4e3a', cast: false }));
  f.bone('hand_f'); B.hand(f, add(WF, [10, -2]), ang(EF, WF) - 0.1, 26, mix(hand, '#000', 0.1), { spread: 0.25, curl: 0.3, shadow: '#2a1a12' });
  f.bone('forearm_f'); leechSleeve(EF, WF, 34, 7, true);

  // ---- body: soft, round-shouldered; wool tunic, leather jerkin over it, the barber's linen apron over all
  f.bone('torso');
  const prof = [[-0.06, 0.32, 0.32], [0.06, 0.62, 0.56], [0.24, 0.7, 0.68], [0.44, 0.66, 0.74], [0.64, 0.6, 0.78], [0.84, 0.62, 0.72], [1.0, 0.64, 0.6]];
  f.part(S.shape(prof), WL());
  const jP = S.shape(prof.slice(1).map(([v, b, fr]) => [v, b + 0.05, fr + 0.04]));
  const jD = f.part(jP, LT());
  X.clothWear(f, jD, E.bbox(jP), { stain: '#0a0604', wear: '#8a6a4a', seed: 21 });
  for (let i = 0; i < 4; i++) f.part(ell(S.at(0.66, 0.2 + i * 0.16), 4, 4, 0, 8), { fill: '#8a7a5a', shade: 0.4, inkW: 1, cast: false }); // horn toggles
  X.folds(f, [[S.at(-0.4, 0.2), S.at(-0.5, 0.6)], [S.at(0.3, 0.5), S.at(0.4, 0.8)]], 2.4, { lit: '#8a6a4a' });
  // the apron bib, its neck strap, the waist string
  const bib = [S.at(0.06, 0.06), S.at(0.62, 0.12), S.at(0.8, 0.5), S.at(0.82, 0.9), S.at(0.0, 0.92), S.at(-0.04, 0.5)];
  const bibD = f.part(bib, LN());
  X.clothWear(f, bibD, E.bbox(bib), { stain: '#4a2a12', wear: '#c8b898', seed: 23, freq: 0.03 });
  f.line([S.at(0.06, 0.06), S.at(-0.2, -0.06)], 5, '#6a5a40'); f.line([S.at(0.62, 0.12), S.at(0.5, -0.02)], 5, '#6a5a40');
  f.flat([S.at(0.3, 0.4), S.at(0.44, 0.38), S.at(0.6, 0.46), S.at(0.52, 0.5), S.at(0.56, 0.62), S.at(0.4, 0.56), S.at(0.3, 0.6), S.at(0.34, 0.5)], '#4a2410', { op: 0.3, k: 0.6 }); // old blood, browned
  // the string of pulled teeth round the neck: the sign of his trade
  f.bone('teeth');
  const tc = [S.at(-0.12, -0.04), S.at(0.1, 0.12), S.at(0.38, 0.18), S.at(0.6, 0.08)];
  f.line(tc, 1.6, P.ropeD);
  for (let i = 0; i < 9; i++) { const k = Math.min(2, Math.floor(i / 3)), q = lerp(tc[k], tc[k + 1], (i % 3) / 3 + 0.15); f.part([add(q, [-3, 0]), add(q, [3, 0]), add(q, [3.5, 6]), add(q, [1, 11]), add(q, [-1, 8]), add(q, [-3.5, 6])], { fill: i % 4 ? P.bone : '#a89a6a', shadow: P.boneD, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }

  // ---- near leg, bandy, the rag bandage round the ankle
  X.tubeLeg(f, HN, KN, AN, [64, 48, 36], '_n', WL(), { bp: [[0, 0.6, 0.14, 0.2]] });
  f.bone('shin_n');
  for (let i = 0; i < 3; i++) f.part([lp(KN, AN, 0.74 + i * 0.07, -21), lp(KN, AN, 0.76 + i * 0.07, 21), lp(KN, AN, 0.82 + i * 0.07, 20), lp(KN, AN, 0.8 + i * 0.07, -20)], { fill: mix('#a89a7a', '#3a2a1a', i * 0.15), shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'weave' + seed, texOp: 0.5 });
  f.flat(ell(lp(KN, AN, 0.8, 6), 5, 4, 0, 8), '#5c1a0e', { op: 0.55 });
  f.stroke([lp(KN, AN, 0.9, 20), lp(KN, AN, 0.96, 34), lp(KN, AN, 1.02, 30)], 4.5, '#9a8c6e');
  f.bone('foot_n'); clog(AN, 54); W.mudSplats(f, add(AN, [24, 30]), 36, 10, 8, P.peatD);

  // ---- apron skirt: linen to the shin, stained brown, the hem rotted; the pliers through the apron string
  f.bone('apron');
  const ah0 = [404, 640], ah1 = [214, 652];
  const ap = [belt(-0.1), belt(0.84), [400, 560], ah0, ...X.hem(f, ah0, ah1, 9, 18, { down: true }), ah1, [222, 560]];
  const apD = f.part(ap, LN());
  X.clothWear(f, apD, E.bbox(ap), { stain: '#4a2a12', wear: '#c8b898', seed: 25, freq: 0.025, tone: [[[[214, 600], [404, 600], [404, 660], [214, 660]], '#1a0e06', 0.45, 12]] });
  X.folds(f, [[[340, 500], [352, 570], [358, 630]], [[280, 510], [272, 580], [276, 640]], [[380, 500], [396, 560]]], 2.4, { lit: '#c8b898' });
  f.flat([[300, 560], [318, 566], [340, 552], [336, 578], [350, 600], [330, 596], [320, 616], [306, 590], [296, 600]], '#4a2410', { op: 0.3, k: 0.5 }); f.flat([[250, 600], [280, 596], [276, 630]], '#4a2a12', { op: 0.5 }); // wiped blood and peat
  X.holes(f, [310, 636], 60, 8, 3, { r0: 3, r1: 7 }); X.mouldFur(f, [ah0, [330, 652], [260, 656], ah1], 8);
  f.bone('pelvis');
  W.rope(f, [belt(-0.66), belt(0.0), belt(0.5), belt(0.86)], 3.4, { col: '#8a7a5a' });
  // tooth-pulling pliers through the apron string; the razor in its horn case
  const pl = belt(0.24);
  for (const s of [-1, 1]) f.part(limb(add(pl, [s * 4, -30]), add(pl, [s * 9, 46]), 6, 5, { steps: 6, capK: 1 }), { fill: P.ironL, shadow: '#14100c', shade: 0.4, inkW: 1, cast: false });
  f.rivet(add(pl, [0, -14]), 3, P.ironL);
  f.part([add(pl, [-6, -30]), add(pl, [6, -30]), add(pl, [4, -46]), add(pl, [-4, -46])], { fill: P.iron, shade: 0.4, inkW: 1, cast: false });
  const rz = belt(-0.34);
  f.part([add(rz, [-7, -4]), add(rz, [7, -4]), add(rz, [9, 52]), add(rz, [-5, 54])], { fill: '#8a7a58', shadow: '#3a2e1c', shade: 0.4, inkW: 1.2, tex: 'wood' + seed, texOp: 0.3 });
  f.line([add(rz, [-3, 4]), add(rz, [-1, 48])], 1, '#d8c8a0', { op: 0.5 });
  // ---- the pewter bleeding bowl on a cord at the front hip, and the cracked leech jar at the back hip
  f.bone('bowl');
  const bw = add(belt(0.5), [10, 40]);
  f.line([belt(0.5), add(bw, [-10, -8])], 1.4, P.ropeD); f.line([belt(0.5), add(bw, [14, -8])], 1.4, P.ropeD);
  f.part([add(bw, [-22, -8]), add(bw, [24, -8]), add(bw, [16, 8]), add(bw, [0, 12]), add(bw, [-16, 8])], { fill: '#8a8880', shadow: '#3a3a36', shade: 0.42, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.5 });
  f.part(ell(add(bw, [1, -8]), 23, 4.5, 0, 14), { fill: '#5a5852', shade: 0.3, inkW: 1, cast: false }); f.flat(ell(add(bw, [4, -8]), 14, 2.6, 0, 10), '#3a120c', { op: 0.7 });
  f.line([add(bw, [-16, -2]), add(bw, [10, 4])], 1.2, '#d8d8d0', { op: 0.5 }); f.flat(ell(add(bw, [-8, 2]), 3, 2, 0, 6), '#2a2a26', { op: 0.7 }); // dents
  f.bone('jar');
  const jr = add(belt(-0.62), [-10, 34]), J = frame(jr, -0.1, 1);
  f.line([belt(-0.62), J([[0, -36]])[0]], 2.6, '#3a2a1a');
  f.line([S.at(-0.4, 0.02), belt(-0.62)], 4, '#3a2a1a'); // the strap from the far shoulder
  const jh = [[0, -36], [12, -34], [14, -26], [28, -16], [34, 4], [30, 26], [16, 36], [-16, 36], [-30, 26], [-34, 4], [-28, -16], [-14, -26], [-12, -34]];
  f.part(J(jh), { fill: P.glass, shadow: P.glassD, light: P.glassL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.3, hatch: false, inkW: 1.4 });
  X.leech(f, J([[-14, 20], [-4, 10], [8, 18], [18, 8]]), 10, {}); f.line(J([[-22, -10], [-24, 20]]), 2.4, '#e8c898', { op: 0.5 });
  f.part(J([[-14, -6], [12, -8], [14, 16], [-12, 18]]), { fill: '#8a7c5c', shadow: '#4a3e2c', shade: 0.3, tex: 'mottle' + seed, texOp: 0.6, inkW: 1, opacity: 0.85 });
  f.line(J([[10, -26], [4, -8], [12, 6], [6, 24]]), 1.4, '#f0dcb0', { op: 0.7 }); // the crack
  f.part(J([[-12, -44], [12, -44], [12, -34], [-12, -34]]), { fill: '#8a6a44', shade: 0.4, inkW: 1, cast: false });

  // ---- head: round, shaved and puffy, mild eyes, a fixed professional smile, a razor nick on the chin
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-8, 16]), hF([[-0.06, 0.44]])[0]], [56, 50]), SKP());
  W.pustule(f, add(neck0, [10, -2]), 4.5, { burst: true }); f.flat(ell(add(neck0, [-6, -12]), 5, 4, 0, 8), '#7a3a2a', { op: 0.6 }); // where leeches dropped off
  X.face(f, HC, H, hA, { skin: pale, jaw: 1.28, chin: 0.02, nose: 0.95, mouth: 'set', squint: 0.18, browDown: -0.02, iris: '#3a3020', eyeWhite: '#d8ccb0', glint: true, hairCol: '#5a4a3a', browCol: '#6a5a44', browW: 0.03, jawShade: 0.18, faceHatch: false, faceShade: 0.72 }, { lit: '#f0dcc0', creaseLit: '#e0c8a8', stain: false, shadeOp: 0.3 });
  // puffy cheeks and jowls; the fixed smile turned up at the corner, the cheek pushed up into a crease
  f.part(hF([[-0.16, 0.36], [0.0, 0.44], [0.16, 0.5], [0.12, 0.6], [-0.06, 0.6], [-0.2, 0.48]]), SKP({ cast: true, castOp: 0.35, inkW: 1.1 })); // the jowl sagging under the jaw
  W.crease(f, hF([[-0.12, 0.42], [0.04, 0.5], [0.14, 0.52]]), 1.8, { lip: 1.4, lit: '#e0c8a8', col: '#3a2a20', op: 0.6 });
  f.stroke(hF([[0.16, 0.27], [0.24, 0.29], [0.31, 0.27], [0.34, 0.23]]), H * 0.024, INK);
  W.crease(f, hF([[0.3, 0.15], [0.34, 0.22], [0.36, 0.28]]), 2.2, { lip: 1.6, lit: '#e0c8a8', col: '#3a2a20' });
  W.crease(f, hF([[0.06, 0.08], [0.16, 0.14], [0.2, 0.22]]), 2, { lip: 1.6, lit: '#e0c8a8', col: '#3a2a20', op: 0.5 });
  f.line(hF([[0.26, 0.48], [0.3, 0.52]]), 2, '#7a2a1a', { op: 0.85 }); // the razor nick
  W.pustule(f, hF([[0.06, 0.06]])[0], 3.4, { col: mix(P.bileL, pale, 0.6) }); W.pustule(f, hF([[0.1, -0.3]])[0], 3, { burst: true });
  f.flat(hF(ell([-0.1, 0.36], 0.05, 0.035, 0.2, 8)), '#7a3a2a', { op: 0.5 }); // a leech's bite ring
  // shaved scalp: stubble shadow, a few shaving nicks
  const sc = hF([[-0.34, 0.08], [-0.4, -0.2], [-0.24, -0.46], [0.04, -0.54], [0.22, -0.48], [0.1, -0.4], [-0.1, -0.32], [-0.22, -0.1], [-0.2, 0.1]]);
  f.flat(sc, '#3a3026', { op: 0.35 });
  for (let i = 0; i < 40; i++) { const q = hF([[-0.32 + f.r() * 0.4, -0.46 + f.r() * 0.4]])[0]; f.flat(ell(q, 0.8, 0.8, 0, 4), '#2a2018', { op: 0.6 }); }
  f.line(hF([[-0.1, -0.44], [-0.04, -0.42]]), 1.4, '#7a2a1a', { op: 0.7 });

  // ---- near arm: held out palm up, sleeve rolled, the forearm sleeved in leeches
  X.arm(f, SN, EN, WN, [44, 40, 32], '_n', SKP());
  f.bone('upperarm_n'); f.part(K.ragLimb(f, lp(SN, EN, -0.08, 0), lp(SN, EN, 0.66, 0), 56, 50, { depth: 6, teeth: 5 }), WL());
  f.part(limb(lp(SN, EN, 0.58, 0), lp(SN, EN, 0.76, 0), 54, 52, { steps: 4 }), WL({ fill: '#5a4e3a', cast: false }));
  for (let i = 0; i < 3; i++) f.line([lp(SN, EN, 0.6 + i * 0.05, -26), lp(SN, EN, 0.61 + i * 0.05, 26)], 1.1, '#1a120a', { op: 0.6 });
  f.part(K.ragLimb(f, lp(SN, EN, -0.14, 0), lp(SN, EN, 0.3, 0), 62, 58, { depth: 6, teeth: 4 }), LT()); // the jerkin's shoulder
  f.bone('hand_n'); const hn = B.hand(f, add(WN, [12, 2]), ang(EN, WN) + 0.05, 28, hand, { spread: 0.3, curl: 0.25, shadow: '#2a1a12' });
  W.creaseField(f, add(WN, [16, 2]), 10, 6, 4, 0.2, 14, 1.4, { lip: 1, lit: '#b08a60', col: '#2a1a12' }); // water-wrinkled palm
  f.bone('forearm_n'); leechSleeve(EN, WN, 38, 8, false);

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 44]), 44, 5, 0, 14), P.waterL, { op: 0.4 });
  for (let i = 0; i < 3; i++) X.leech(f, X.wig([440 + i * 40, gy - 4], [470 + i * 40, gy - 6], 2, 3, i), 14, { sucker: true }); // dropped ones crawling in the mud
  return f;
}

// ------------------------------------------------------------------ TURF-WIFE (cast, human 0.95)
// A peat-cutter's wife who carried turf from the cuttings to the stilt houses. Bent forward under a willow carrying
// frame stacked with cut sods taller than she is, the stack leaning over her like a chimney; a head strap across her
// forehead takes the weight, both hands on a stick planted ahead. Knees bent, bow-legged, weight forward. Toxin has
// ripened the load into her: the bottom sods have fused with her shoulders, moss and toadstools fruiting up through the
// wool, and her spine has swollen into a ridge of fungal knots under the frame.
// Rig: standard humanoid + stack (torso: the frame and sods, the strap), stick (hand_n), skirt (pelvis), cup (pelvis).
// Motion: idle shifting the load with a grunt; attack a swing of the turf spade; heavy turn the stack topples onto a rank.
function turfWife() {
  const [CW, CH] = TIERS.human;
  const f = new Fig(W.base(226, CH, { grimeY: 600 }));
  W.textures(f);
  const seed = 226, gy = CH - 30, H = 92;
  const skin = '#6e4c30', skinD = '#5a3e26', face0 = '#8a6444';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#24160e' }, o));
  const woolC = '#5a4a36', sackC = '#7a6c4e';
  const WL = (o = {}) => Object.assign({ fill: woolC, shadow: '#1a120a', shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const SA = (o = {}) => Object.assign({ fill: sackC, shadow: '#2a2214', shade: 0.42, tex: 'weave' + seed, texOp: 0.6 }, o);
  const N = [348, 420], C = [252, 404], Pv = [236, 528];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.05, 0.12), SF = S.at(0.4, 0.04);
  const st0 = [486, gy], st1 = [462, 470], stA = ang(st0, st1);
  const gN = lerp(st0, st1, 0.62), gF = lerp(st0, st1, 0.86);
  const EN = [366, 530], EF = [404, 452];
  const HN = [254, 540], KN = [336, 636], AN = [312, 738];
  const HF = [230, 536], KF = [214, 646], AF = [170, 738];
  const hA = 0.46, neck0 = N, HC = add(neck0, rot([0.34 * H, -0.24 * H], hA));
  const hF = frame(HC, hA, H);
  const belt = v => S.at(v, 0.94);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, gN], arm_f: [SF, EF, gF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('stack', S.at(-0.4, 0.5), 'torso').joint('stick', gN, 'hand_n').joint('skirt', S.at(0, 0.94), 'pelvis').joint('cup', belt(0.3), 'pelvis');
  // the stack's frame axis: bottom at the small of the back, top leaning forward over her
  const sB = [228, 520], sT = [314, 40], sd = E.norm(sub(sT, sB)), sn = [-sd[1], sd[0]], sW = 156; // sn points back (left)
  const SF0 = (u, v) => add(add(sB, mul(sd, v)), mul(sn, -u)); // u across (+ = front), v up the axis
  const sL = E.len(sub(sT, sB));

  // a cut sod: an irregular block of turf with a fibrous cut face, a moss and heather top, roots hanging under it
  const sod = (u0, u1, v0, v1, col) => {
    const j = () => (f.r() - 0.5) * 11;
    const pts = [SF0(u0 + j(), v0 + j()), SF0((u0 + u1) / 2 + j(), v0 - 3 + j()), SF0(u1 + j(), v0 + j()), SF0(u1 + 3 + j(), (v0 + v1) / 2), SF0(u1 + j(), v1 + j()), SF0((u0 + u1) / 2 + j(), v1 + 4 + j()), SF0(u0 + j(), v1 + j()), SF0(u0 - 3 + j(), (v0 + v1) / 2)];
    const d = f.part(pts, { fill: col, shadow: '#120c06', shade: 0.44, tex: 'peat' + seed, texOp: 0.95, inkW: 1.3, inkHeavy: 2.2, k: 0.6 });
    f.line([SF0(u0 + 4, v0 + (v1 - v0) * 0.45), SF0(u1 - 4, v0 + (v1 - v0) * 0.5)], 1.1, '#140c06', { op: 0.55 }); // a layer line in the cut face
    f.line([SF0(u1 - 2, v0 + 3), SF0(u1 - 2, v1 - 3)], 1.4, '#9a7a56', { op: 0.5 }); // the spade-cut edge, bright
    if (f.r() > 0.35) { const mt = [SF0(u0, v1 - 2), SF0(u0 + 4, v1 + 8), SF0((u0 + u1) / 2, v1 + 10), SF0(u1 - 4, v1 + 8), SF0(u1, v1 - 2), SF0(u1 - 6, v1 - 7), SF0(u0 + 6, v1 - 7)]; f.part(mt, { fill: f.r() > 0.5 ? P.moss : mix(P.moss, P.reedD, 0.4), shadow: P.mossD, shade: 0.4, tex: 'moss' + seed, texOp: 0.9, inkW: 1, inkHeavy: 1.4, cast: false, k: 0.7 }); for (let i = 0; i < 4; i++) { const q = SF0(u0 + 6 + f.r() * (u1 - u0 - 12), v1 + 6); f.line([q, add(q, rot([7 + f.r() * 7, 0], ang([0, 0], sd) + (f.r() - 0.5) * 0.8))], 1.2, P.reedL, { op: 0.75 }); } }
    for (let i = 0; i < 3; i++) { if (f.r() < 0.4) continue; const q = SF0(u0 + 6 + f.r() * (u1 - u0 - 12), v0 + 2); f.line([q, add(q, [(f.r() - 0.5) * 6, 8 + f.r() * 10]), add(q, [(f.r() - 0.5) * 8, 14 + f.r() * 14])], 1.2, '#24180e', { op: 0.8 }); }
    return d;
  };

  // ---- far leg: bow-legged, bare shin, a wooden patten under the shoe
  const patten = (A, s) => {
    const X0 = u => A[0] + u * s, py = gy - 14;
    f.part([[X0(-0.1), py], [X0(0.1), py], [X0(0.16), gy - 1], [X0(-0.16), gy - 1]].map(q => q), { fill: P.iron, shade: 0.4, inkW: 1, cast: false });
    f.line(E.ell([X0(0.6), gy - 6], s * 0.22, 6, 0, 14).concat([E.ell([X0(0.6), gy - 6], s * 0.22, 6, 0, 14)[0]]), 2.6, P.iron); // the iron ring
    f.part([[X0(-0.46), py - 8, 1], [X0(1.3), py - 8, 1], [X0(1.32), py, 1], [X0(-0.44), py, 1]], { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1.2, cast: false, tex: 'wood' + seed, texOp: 0.4 });
    B.boot(f, [A[0], A[1] - 14], 1, s, '#3a2a1a', { style: 'shoe', shaft: 0.3, groundY: py - 8, tex: 'leather' + seed, texOp: 0.5 });
    f.line([[X0(0.0), py - 16], [X0(0.3), py - 6]], 2.4, '#2a1e12'); // the patten's strap over the instep
  };
  X.bareLeg(f, HF, KF, AF, 50, 60, 42, '_f', SK({ fill: skinD }), { bq: [[1, 0.3, 0.2]] });
  f.bone('foot_f'); patten(AF, 52); W.mudSplats(f, add(AF, [10, 30]), 30, 10, 7, P.peatD);
  // ---- far arm: on the stick above the near hand
  X.arm(f, SF, EF, gF, [44, 40, 32], '_f', SK({ fill: skinD }));
  f.bone('upperarm_f'); f.part(K.ragLimb(f, SF, lp(SF, EF, 0.8, 0), 52, 48, { depth: 7, teeth: 5 }), WL({ fill: mix(woolC, '#000', 0.2) }));

  // ---- body: stocky under a wool bodice; the swollen spine ridge of fungal knots along the back
  f.bone('torso');
  const prof = [[-0.06, 0.34, 0.36], [0.06, 0.62, 0.6], [0.24, 0.72, 0.74], [0.44, 0.72, 0.82], [0.64, 0.66, 0.8], [0.84, 0.66, 0.74], [1.0, 0.66, 0.62]];
  const tP = S.shape(prof);
  const tD = f.part(tP, WL());
  X.clothWear(f, tD, E.bbox(tP), { stain: '#140e08', seed: 31 });
  X.folds(f, [[S.at(0.3, 0.3), S.at(0.5, 0.6)], [S.at(0.0, 0.5), S.at(0.2, 0.8)], [S.at(-0.4, 0.4), S.at(-0.3, 0.8)]], 2.4, { lit: '#8a7458' });
  for (let i = 0; i < 6; i++) { const q = S.at(-0.7 - Math.sin(i) * 0.03, 0.3 + i * 0.12); f.part(ell(q, 13 - i, 10 - i * 0.6, 0.3, 10).map((p, k) => k % 2 ? add(p, mul(sub(p, q), 0.25)) : p), { fill: mix(P.bileD, woolC, 0.4), shadow: '#14140a', shade: 0.45, inkW: 1.1, inkHeavy: 1.8, tex: 'moss' + seed, texOp: 0.6, cast: false }); f.flat(ell(q, 3, 2, 0, 6), '#e4e0cc', { op: 0.5 }); } // fungal knots down the spine
  // the kerchief crossed over the chest
  f.part([S.at(0.0, -0.06), S.at(0.6, 0.0), S.at(0.8, 0.3), S.at(0.5, 0.5), S.at(0.2, 0.3)], SA({ fill: '#8a7a5a' }));
  f.line([S.at(0.6, 0.06), S.at(0.4, 0.3), S.at(0.5, 0.46)], 2, INK, { op: 0.6 });

  // ---- near leg: the rag tied round the knee, the patten
  X.bareLeg(f, HN, KN, AN, 52, 64, 44, '_n', SK(), { bq: [[1, 0.3, 0.2]] });
  f.bone('shin_n');
  f.part([lp(KN, AN, -0.04, -26), lp(KN, AN, -0.02, 26), lp(KN, AN, 0.12, 25), lp(KN, AN, 0.1, -25)], SA({ fill: '#8a7a5a', inkW: 1.1, cast: false }));
  f.stroke([lp(KN, AN, 0.04, 24), lp(KN, AN, 0.14, 40), lp(KN, AN, 0.2, 36)], 5, '#8a7a5a');
  W.creaseField(f, lp(KN, AN, 0.5, 0), 12, 30, 4, ang(KN, AN) + 1.4, 26, 1.8, { lip: 1.4, lit: '#a07a50', col: '#1e120a' });
  f.bone('foot_n'); patten(AN, 54); W.mudSplats(f, add(AN, [16, 30]), 34, 10, 8, P.peatD);

  // ---- the wool skirt kilted up to the knee, the sackcloth apron over it, the hem rotted
  f.bone('skirt');
  const k0 = [354, 620], k1 = [170, 628];
  const skP = [belt(-0.72), belt(0.7), [350, 580], k0, ...X.hem(f, k0, k1, 8, 16, { down: true }), k1, [176, 580]];
  const skD = f.part(skP, WL({ fill: '#4a3c2c' }));
  X.clothWear(f, skD, E.bbox(skP), { stain: '#100a06', seed: 33 });
  X.folds(f, [[[200, 560], [188, 610]], [[240, 566], [232, 616]], [[300, 566], [304, 612]], [[330, 560], [344, 610]]], 2.4, { lit: '#7a6448' });
  X.holes(f, [260, 612], 70, 8, 3, { r0: 3, r1: 7 }); X.mouldFur(f, [k0, [280, 634], [200, 636], k1], 8);
  const a0 = [372, 640], a1 = [262, 650];
  const apP = [belt(0.0), belt(0.74), [370, 580], a0, ...X.hem(f, a0, a1, 6, 14, { down: true }), a1, [264, 586]];
  const apD = f.part(apP, SA());
  X.clothWear(f, apD, E.bbox(apP), { stain: '#24180c', wear: '#a89870', seed: 35, freq: 0.03 });
  X.folds(f, [[[300, 570], [304, 630]], [[340, 570], [348, 626]]], 2.2, { lit: '#a89870' });
  f.flat([[290, 600], [330, 596], [340, 630], [300, 640]], P.peatD, { op: 0.4 }); // peat wiped on it
  f.bone('pelvis');
  W.rope(f, [belt(-0.74), belt(-0.2), belt(0.3), belt(0.76)], 4.4);
  f.bone('cup');
  const cp = add(belt(0.3), [4, 0]);
  f.line([cp, add(cp, [2, 34])], 1.4, P.ropeD);
  f.part([add(cp, [-8, 32]), add(cp, [12, 30]), add(cp, [10, 56]), add(cp, [2, 62]), add(cp, [-6, 56])], { fill: '#8a7a54', shadow: '#3a3020', shade: 0.4, inkW: 1.1, cast: false, tex: 'wrinkle' + seed, texOp: 0.5 });
  f.part(ell(add(cp, [2, 31]), 10, 3, 0, 10), { fill: '#3a2e1e', shade: 0.3, inkW: 1, cast: false, hatch: false });

  // ---- head: broad weathered face bowed forward under a headscarf, the strap biting a groove across the forehead
  f.bone('head');
  f.part(K.chain([add(neck0, [-6, 6]), hF([[-0.1, 0.4]])[0]], [56, 46]), SK());
  X.face(f, HC, H, hA, { skin: face0, jaw: 1.2, chin: 0.02, nose: 1.0, mouth: 'grim', squint: 0.5, browDown: 0.06, iris: '#1a120a', eyeWhite: '#b8aa86', hairCol: '#3a2e22', noEar: true, lips: true }, { lit: '#d8b48a' });
  for (let i = 0; i < 3; i++) W.crease(f, hF([[0.06, -0.06 + i * 0.03], [-0.02, -0.04 + i * 0.05], [-0.08, -0.02 + i * 0.07]]), 1.6, { lip: 1.2, lit: '#c8a078', col: '#2a1a10' }); // crow's feet
  // headscarf: tied at the nape, hanging plumb behind; wet grey-brown hair escaping
  const hs = hF([[-0.56, 0.36], [-0.6, -0.04], [-0.44, -0.4], [-0.12, -0.58], [0.22, -0.56], [0.4, -0.38], [0.42, -0.24], [0.2, -0.3], [-0.1, -0.28], [-0.3, -0.1], [-0.36, 0.2]]);
  const hsD = f.part(hs, SA({ fill: '#6a5a40' }));
  X.clothWear(f, hsD, E.bbox(hs), { stain: '#1a120a', seed: 37 });
  X.folds(f, [hF([[-0.4, -0.3], [-0.46, 0.0], [-0.44, 0.24]]), hF([[-0.1, -0.5], [-0.28, -0.3]])], 2, { lit: '#9a8a6a' });
  const kn = hF([[-0.56, 0.22]])[0];
  f.part(ell(kn, 10, 8, 0.4, 10), SA({ fill: '#5a4a32', cast: false }));
  for (const dx of [-8, 6]) f.part([add(kn, [dx - 5, 4]), add(kn, [dx + 5, 4]), add(kn, [dx + 4, 44]), [...add(kn, [dx - 1, 54]), 1], add(kn, [dx - 5, 40])], SA({ fill: '#5e4e36' }));
  for (const [u, v, l] of [[0.0, -0.3, 22], [0.1, -0.3, 18]]) { const p = hF([[u, v]])[0]; W.hairClump(f, [p, add(p, [4, l * 0.5]), add(p, [2, l])], 6, { n: 2, pal: ['#4a4038', '#5a5048', '#3a3028'] }); }
  // the head strap across the forehead, biting a groove; it runs back to the stack
  const fh0 = hF([[0.3, -0.3]])[0], fh1 = hF([[-0.3, -0.36]])[0];
  W.crease(f, hF([[0.32, -0.22], [0.1, -0.24], [-0.1, -0.24]]), 2.4, { lip: 2, lit: '#c8a078', col: '#2a1a10' });
  f.part([add(fh0, [2, -9]), add(fh1, [0, -10]), add(fh1, [0, 8]), add(fh0, [2, 8])], { fill: '#4a3622', shadow: '#140c06', shade: 0.4, tex: 'leather' + seed, texOp: 0.7, inkW: 1.3, cast: false });

  // ---- the stack: willow frame, the sods in courses, lashed with rope; fused with her shoulders at the bottom
  f.bone('stack');
  const up = (u) => { f.part(limb(SF0(u, -10), SF0(u, sL + 10), 10, 8, { steps: 10 }), { fill: '#7a6a44', shadow: '#2a2014', shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.2 }); };
  up(-sW / 2 - 4); // the back upright
  const sodCols = [P.peat, P.peatL, mix(P.peat, '#000', 0.1), P.peatL, mix(P.peatL, P.peat, 0.5), '#5a4230', '#6a5038'];
  let v = 6, ci = 0;
  while (v < sL - 20) {
    const th = 28 + f.r() * 16, k = f.r() < 0.25 ? 1 : f.r() < 0.8 ? 2 : 3;
    let u = -sW / 2 - 4 + (f.r() - 0.5) * 30;
    for (let q = 0; q < k; q++) { const u1 = q === k - 1 ? sW / 2 + 4 + (f.r() - 0.5) * 30 : u + sW / k + (f.r() - 0.5) * 30; sod(u, u1, v + (f.r() - 0.5) * 6, v + th + (f.r() - 0.5) * 6, sodCols[Math.floor(f.r() * sodCols.length)]); u = u1 + 1; }
    v += th - 4;
  }
  // moss and dead grass bursting out of the joints at both edges, roots hanging
  for (let i = 0; i < 12; i++) { const sdn = i % 2 ? 1 : -1, vv = 30 + f.r() * (sL - 60), q = SF0(sdn * (sW / 2 + 8), vv); W.mossClump(f, q, 10 + f.r() * 8, 6, { ang: ang([0, 0], sd) + Math.PI / 2 }); for (let k = 0; k < 3; k++) f.line([q, add(q, [sdn * -(4 + f.r() * 8) * 0 + (f.r() - 0.5) * 10, 10 + f.r() * 16])], 1.2, f.r() > 0.5 ? '#24180e' : P.reedD, { op: 0.85 }); }
  // a top course turned on its side, ragged with heather; bog cotton stuck in the frame
  sod(-sW / 2 + 10, sW / 2 - 16, v, v + 26, P.peatL);
  for (let i = 0; i < 5; i++) { const b0 = SF0(sW / 2 - 6, sL * 0.55 + i * 6), t0 = add(b0, rot([30 + i * 6, 0], ang([0, 0], sd) + 0.5 - i * 0.12)); f.line([b0, t0], 1.4, P.reedD); f.part(ell(t0, 6, 5, 0, 8).map(q => add(q, [(f.r() - 0.5) * 3, (f.r() - 0.5) * 3])), { fill: '#e8e4d8', shadow: '#9a968a', shade: 0.3, inkW: 0.9, cast: false, hatch: false }); }
  // toxin: moss and toadstools fruiting where the load has fused, pustules in the peat
  W.toadstools(f, SF0(sW * 0.2, sL * 0.42), ang([0, 0], sd) - 0.4, 26, 3);
  W.toadstools(f, SF0(-sW * 0.3, sL * 0.75), ang([0, 0], sd) - 0.2, 22, 2);
  W.pustules(f, SF0(0, sL * 0.25), 30, 30, 4, 3, 6, { burst: 0.4 });
  W.bracket(f, SF0(-sW / 2 - 6, sL * 0.6), Math.PI + ang([0, 0], sd) + 1.4, 30, 2);
  // the rope lashing zigzagging up the front, the front upright, crossbars
  const lash = []; for (let i = 0; i <= 8; i++) lash.push(SF0(i % 2 ? sW / 2 : -sW / 2, 20 + i * (sL - 40) / 8));
  W.rope(f, lash, 3.6, { col: P.ropeD });
  for (const vv of [12, sL - 8]) f.part(limb(SF0(-sW / 2 - 8, vv), SF0(sW / 2 + 8, vv), 10, 10, { steps: 6, capK: 0.8 }), { fill: '#7a6a44', shadow: '#2a2014', shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.2, cast: false });
  up(sW / 2 + 4);
  // the narrow winged turf spade hung blade-down on the front upright
  const s0 = SF0(sW / 2 + 16, sL * 0.66), s1 = SF0(sW / 2 + 16, sL * 0.2);
  f.part(limb(s0, s1, 11, 10, { steps: 8 }), { fill: P.woodL, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.2 });
  const bF = frame(s1, ang(s0, s1), 1);
  f.part(bF([[-4, -12], [64, -10], [70, 0, 1], [64, 12], [-4, 12]]), { fill: P.iron, shadow: '#0e0a06', shade: 0.4, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.6 });
  f.part(bF([[8, -12], [56, -10], [52, -30, 1], [14, -26]]), { fill: P.ironL, shadow: '#0e0a06', shade: 0.4, inkW: 1.2, cast: false }); // the wing
  f.flat(bF([[20, -6], [50, -4], [48, 8], [22, 8]]), '#5a3a24', { op: 0.5 });
  W.rope(f, [add(s0, [-10, 6]), add(s0, [6, 10]), SF0(sW / 2 + 4, sL * 0.66)], 2.4, { col: P.ropeD });
  // the shoulder straps, and the head strap running from the forehead back to the frame
  for (const [a, b] of [[SF0(sW / 2, sL * 0.2), S.at(0.6, 0.3)], [SF0(sW / 2 - 10, 10), S.at(0.5, 0.5)]]) { f.stroke([a, lerp(a, b, 0.5), b], 12, '#1a120a'); f.stroke([a, lerp(a, b, 0.5), b], 9, '#4a3622'); }
  f.stroke([fh1, lerp(fh1, SF0(sW / 2, sL * 0.3), 0.5), SF0(sW / 2, sL * 0.3)], 10, '#1a120a'); f.stroke([fh1, lerp(fh1, SF0(sW / 2, sL * 0.3), 0.5), SF0(sW / 2, sL * 0.3)], 7, '#4a3622');
  // fused at the shoulder: the moss of the bottom sods grown down over the wool, toadstools coming through
  W.mossClump(f, S.at(0.1, 0.1), 30, 14);
  W.toadstools(f, S.at(0.2, 0.06), -1.2, 20, 3);

  // ---- the stick planted ahead
  f.bone('stick');
  f.part(limb(st0, add(st1, mul(E.norm(sub(st1, st0)), 30)), 13, 11, { steps: 10, p: [[0.4, 0.15, 0.05]], q: [[0.7, 0.15, 0.05]] }), { fill: '#5a4a30', shadow: '#1e160c', shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.flat([lp(st0, st1, 0, -9), lp(st0, st1, 0, 9), lp(st0, st1, 0.14, 8), lp(st0, st1, 0.18, -3)], P.peatD, { op: 0.8 });
  f.line([lp(st0, st1, 0.02, -3), lp(st0, st1, 0.95, -3)], 1, '#8a7a58', { op: 0.5 });
  // ---- hands on the stick: far above, near below
  f.bone('hand_f'); B.grip(f, gF, EF, stA, 26, skinD, { shadow: '#24160e', tex: 'wrinkle' + seed, texOp: 0.6, name: 'turf far' });
  X.arm(f, SN, EN, gN, [48, 42, 34], '_n', SK());
  f.bone('upperarm_n'); f.part(K.ragLimb(f, lp(SN, EN, -0.1, 0), lp(SN, EN, 0.78, 0), 58, 50, { depth: 7, teeth: 5 }), WL());
  X.folds(f, [[lp(SN, EN, 0.2, -12), lp(SN, EN, 0.6, -14)]], 2, { lit: '#8a7458' });
  f.bone('forearm_n'); W.creaseField(f, lp(EN, gN, 0.5, 0), 26, 8, 4, ang(EN, gN) + 1.5, 20, 1.6, { lip: 1.2, lit: '#a07a50', col: '#1e120a' });
  f.bone('hand_n'); B.grip(f, gN, EN, stA, 28, skin, { shadow: '#24160e', tex: 'wrinkle' + seed, texOp: 0.6, name: 'turf near' });

  f.bone('root');
  for (const [a, w] of [[AN, 44], [AF, 40], [st0, 24]]) f.flat(ell(add(a, [16, a === st0 ? 0 : 44]), w, 5, 0, 14), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ FROG-CATCHER (cast, small 0.6)
// A stilt-village boy who caught frogs for his mother's pot. Knock-kneed under a wet hessian sack slung over the near
// shoulder (the near fist twisted in its neck, the sack hanging down his back, bulging with something that moves), a
// reed spear planted upright in the far hand. Weight on the heels against the sack's pull. A thin child with a round
// belly on knobbly legs; toxin has swollen his throat into a pale pouch that hangs like a toad's, and raised warts on
// his cheeks and hands; water has tanned him brown and wrinkled his fingers.
// Rig: standard humanoid + sack (hand_n), spear (hand_f), pouch (head), cage (pelvis).
// Motion: idle the pouch slowly filling and emptying (scale on `pouch`); attack a croak that causes stress.
function frogCatcher() {
  const [CW, CH] = TIERS.small;
  const f = new Fig(W.base(227, CH, { grimeY: 660 }));
  W.textures(f);
  const seed = 227, gy = CH - 30, H = 70;
  const skin = '#7a5838', skinD = '#64462c';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#2a1a12' }, o));
  const woolC = '#5e5040', sackC = '#6e5e40';
  const WL = (o = {}) => Object.assign({ fill: woolC, shadow: '#1a140c', shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const N = [300, 492], C = [282, 540], Pv = [292, 608];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.14), SF = S.at(0.36, 0.06);
  const sp0 = [392, gy], sp1 = [382, 404], spA = ang(sp0, sp1);
  const gF = lerp(sp0, sp1, 0.52), EF = [346, gF[1] + 4];
  const WN = [278, 488], EN = [330, 546];
  const HN = [300, 616], KN = [322, 698], AN = [304, 766];
  const HF = [282, 612], KF = [300, 700], AF = [256, 766];
  const hA = 0.04, neck0 = N, HC = add(neck0, rot([0.22 * H, -0.5 * H], hA));
  const hF = frame(HC, hA, H);
  const belt = v => S.at(v, 0.9);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, WN], arm_f: [SF, EF, gF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('sack', WN, 'hand_n').joint('spear', gF, 'hand_f').joint('pouch', hF([[0.12, 0.46]])[0], 'head').joint('cage', belt(0.4), 'pelvis');

  // ---- the sack: down his back from the twisted neck in his fist over the shoulder; wet hessian bulging with frogs
  f.bone('sack');
  const sk = [[238, 508], [256, 500], [268, 512], [272, 546], [286, 572], [292, 610], [284, 640], [290, 664], [272, 690], [244, 702], [214, 698], [196, 704], [174, 684], [168, 652], [176, 620], [172, 594], [190, 566], [214, 540], [226, 520]];
  const skD = f.part(sk, { fill: sackC, shadow: '#1e1810', shade: 0.42, tex: 'weave' + seed, texOp: 0.7 });
  W.stains(f, skD, E.bbox(sk), '#1a140a', 0.03, 4.6, -2.2, 41, 0.75, 3); // soaked through
  W.softTone(f, skD, [[[[176, 620], [230, 600], [286, 640], [250, 690], [180, 680]], '#0a0804', 0.5, 10], [[[230, 540], [270, 530], [276, 580], [240, 590]], '#c8b890', 0.3, 8]]);
  for (const [c, r] of [[[214, 600], 22], [[254, 640], 18], [[230, 560], 16]]) { W.crease(f, ell(c, r, r * 0.7, 0.4, 10).slice(5, 10), 2.2, { lip: 1.6, lit: '#a89870', col: '#140e08' }); } // something moving inside, pressing out
  X.folds(f, [[[250, 516], [240, 540], [232, 570]], [[200, 650], [220, 670], [244, 676]]], 2.2, { lit: '#a89870' });
  f.flat(ell([196, 652], 9, 6, 0.4, 8), '#0c0806'); // a hole, a frog's leg poking out of it
  f.part(K.chain([[194, 652], [176, 664], [168, 690], [180, 700]], [9, 8, 6, 5], { steps: 5 }), { fill: mix(P.tan, P.bileD, 0.4), shadow: '#1e1a0c', shade: 0.4, inkW: 1, cast: false });
  for (let i = 0; i < 3; i++) f.line([[180, 700], add([180, 700], rot([10, 0], 0.4 + i * 0.4))], 1.6, mix(P.tan, P.bileD, 0.4));
  for (const p of [[214, 692], [250, 690]]) W.drip(f, p, 0.9, P.peatD);
  // the twisted neck over the shoulder to the fist
  f.part(K.chain([[244, 512], [256, 500], [272, 488], [286, 478]], [24, 18, 14, 13], { steps: 6 }), { fill: mix(sackC, '#000', 0.1), shadow: '#1e1810', shade: 0.4, tex: 'weave' + seed, texOp: 0.6 });
  for (let i = 0; i < 4; i++) f.line([[250 + i * 8, 486 - i * 2], [256 + i * 8, 498 - i * 2]], 1.2, '#1a140a', { op: 0.6 }); // the twist

  // ---- far leg, far arm and the spear
  X.bareLeg(f, HF, KF, AF, 34, 32, 26, '_f', SK({ fill: skinD }), { ar: 14 });
  f.bone('foot_f'); W.mudSplats(f, add(AF, [10, 18]), 22, 6, 6, P.peatD);
  X.arm(f, SF, EF, gF, [24, 21, 18], '_f', SK({ fill: skinD }));
  f.bone('upperarm_f'); f.part(K.ragLimb(f, SF, lp(SF, EF, 0.86, 0), 32, 30, { depth: 5, teeth: 4 }), WL({ fill: mix(woolC, '#000', 0.2) }));
  f.bone('spear');
  f.part(limb(sp0, sp1, 9, 7, { steps: 10 }), { fill: P.reed, shadow: P.reedD, shade: 0.4, inkW: 1.1, tex: 'wood' + seed, texOp: 0.3 });
  for (let t = 0.1; t < 0.95; t += 0.14) f.line([lp(sp0, sp1, t, -5), lp(sp0, sp1, t + 0.008, 5)], 1.4, INK, { op: 0.6, straight: true }); // reed nodes
  const tipB = lp(sp0, sp1, 1.0, 0), tipT = add(tipB, rot([46, 0], spA));
  W.rope(f, [lp(sp0, sp1, 0.97, -6), lp(sp0, sp1, 0.99, 6), lp(sp0, sp1, 1.0, -6)], 1.8, { col: P.ropeD });
  f.part([add(tipB, rot([0, -5], spA)), add(tipB, rot([0, 5], spA)), add(tipB, rot([30, 5], spA)), [...tipT, 1], add(tipB, rot([30, -5], spA))], { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.1, cast: false });
  for (const k of [16, 28]) f.part([add(tipB, rot([k, 4], spA)), add(tipB, rot([k - 10, 11], spA)), add(tipB, rot([k - 4, 4], spA))], { fill: P.bone, shade: 0.4, inkW: 0.8, cast: false, sharp: true }); // barbs
  f.flat(ell(add(tipB, rot([20, 0], spA)), 3, 2, spA, 6), '#5c0f0b', { op: 0.5 });
  f.flat([lp(sp0, sp1, 0, -6), lp(sp0, sp1, 0, 6), lp(sp0, sp1, 0.08, 5), lp(sp0, sp1, 0.1, -2)], P.peatD, { op: 0.8 });
  f.bone('hand_f');
  B.grip(f, gF, EF, spA, 17, skinD, { shadow: '#2a1a12', tex: 'wrinkle' + seed, texOp: 0.6, name: 'frog spear' });
  W.warts(f, add(gF, [0, -4]), 6, 5, 3, 1.4, 2.4, mix(skinD, '#9a8458', 0.3));
  f.bone('forearm_f'); for (let i = 0; i < 3; i++) f.part(ell(lp(EF, gF, 0.78, -9 + i * 7), 3, 3, 0, 6), { fill: i === 1 ? P.bone : P.ropeD, shade: 0.4, inkW: 0.8, cast: false, hatch: false }); // twine charm on the wrist
  f.line([lp(EF, gF, 0.75, -11), lp(EF, gF, 0.8, 11)], 1.6, P.ropeD);

  // ---- body: thin chest, the round belly; a man's wool shirt far too big for him, belted with cord
  f.bone('torso');
  const prof = [[-0.06, 0.3, 0.3], [0.08, 0.54, 0.5], [0.28, 0.58, 0.56], [0.5, 0.56, 0.72], [0.72, 0.56, 0.86], [0.9, 0.58, 0.76], [1.04, 0.56, 0.56]];
  const tP = S.shape(prof);
  const tD = f.part(tP, WL());
  X.clothWear(f, tD, E.bbox(tP), { stain: '#140e08', seed: 43 });
  X.folds(f, [[S.at(0.3, 0.2), S.at(0.5, 0.5), S.at(0.6, 0.76)], [S.at(-0.2, 0.3), S.at(-0.3, 0.7)], [S.at(0.1, 0.5), S.at(0.2, 0.8)]], 2, { lit: '#8a7a5e' });
  f.part([S.at(-0.1, -0.04), S.at(0.3, -0.02), S.at(0.24, 0.12), S.at(0.0, 0.14)], WL({ fill: '#6a5a46', cast: false })); // collar, the neck far too big for him
  const hm0 = S.at(0.86, 1.06), hm1 = S.at(-0.62, 1.12);
  const shirtSkirt = [belt(-0.66), belt(0.74), hm0, ...X.hem(f, hm0, hm1, 7, 12, { down: true }), hm1];
  const ssD = f.part(shirtSkirt, WL({ fill: '#56483a' }));
  X.holes(f, lerp(hm0, hm1, 0.5), 30, 4, 2, { r0: 3, r1: 5 }); X.mouldFur(f, [hm0, hm1], 6, { n: 16 });
  W.rope(f, [belt(-0.66), belt(0.0), belt(0.74)], 3, { col: P.ropeD });
  f.part([S.at(0.3, 0.6), S.at(0.5, 0.58), S.at(0.5, 0.74), S.at(0.3, 0.76)], WL({ fill: '#4a3e30', sharp: true, inkW: 1, cast: false })); // patch

  // ---- near leg: knobbly, the knee turned in, a rag bandage on the foot
  X.bareLeg(f, HN, KN, AN, 36, 34, 27, '_n', SK(), { ar: 14 });
  f.bone('shin_n'); W.crease(f, [add(KN, [2, -8]), add(KN, [12, -2]), add(KN, [10, 8])], 1.6, { lip: 1.2, lit: '#b08a60', col: '#1e120a' }); f.line([add(KN, [-4, 8]), add(KN, [8, 10])], 1, INK, { op: 0.5 }); // the knobbly knee
  W.creaseField(f, lp(KN, AN, 0.5, 0), 8, 16, 3, ang(KN, AN) + 1.4, 14, 1.2, { lip: 1, lit: '#a07a50', col: '#1e120a' });
  f.bone('foot_n');
  for (let i = 0; i < 3; i++) f.part([[AN[0] - 10 + i * 12, AN[1] + 4], [AN[0] + 2 + i * 12, AN[1] + 2], [AN[0] + 6 + i * 12, gy - 2], [AN[0] - 6 + i * 12, gy - 2]], { fill: mix('#a89a7a', '#3a2a1a', 0.2 + i * 0.1), shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed, texOp: 0.5 });
  f.flat(ell([AN[0] + 12, AN[1] + 14], 4, 3, 0, 6), '#5c0f0b', { op: 0.5 });
  W.mudSplats(f, add(AN, [14, 18]), 26, 6, 7, P.peatD);
  // ---- the wicker cage of frogs at the hip
  f.bone('cage');
  const cg = add(belt(0.4), [6, 30]);
  f.line([belt(0.4), add(cg, [0, -24])], 1.4, P.ropeD);
  f.part([add(cg, [-18, -22]), add(cg, [18, -22]), add(cg, [22, 18]), add(cg, [0, 26]), add(cg, [-22, 18])], { fill: '#8a7448', shadow: '#2a2014', shade: 0.42, inkW: 1.2, tex: 'weave' + seed, texOp: 0.5 });
  f.flat([add(cg, [-14, -14]), add(cg, [14, -14]), add(cg, [16, 14]), add(cg, [-16, 14])], '#120c06', { op: 0.7 });
  W.driedFrog(f, add(cg, [-2, 2]), 22, 0.3); f.flat(ell(add(cg, [8, -6]), 3, 2.4, 0, 6), '#c8b858');
  for (let i = 0; i < 5; i++) f.line([add(cg, [-18 + i * 9, -22]), add(cg, [-20 + i * 10, 20])], 1.6, '#6a5434');
  for (let i = 0; i < 3; i++) f.line([add(cg, [-20, -10 + i * 12]), add(cg, [20, -10 + i * 12])], 1.4, '#6a5434');

  // ---- head: pinched, hungry, cropped wet hair, the wide mouth stretched by the swollen throat
  f.bone('head');
  f.part(K.chain([add(neck0, [-4, 8]), hF([[-0.08, 0.4]])[0]], [28, 24]), SK());
  { const F = X.face(f, HC, H, hA, { skin, jaw: 0.95, chin: -0.02, nose: 0.82, mouth: 'set', squint: 0.35, browDown: 0.02, gaunt: true, age: false, iris: '#1a120a', eyeWhite: '#a8a080', glint: false, hairCol: '#2a1e14', faceHatch: false, jawShade: 0.08 }, { creases: false, shadeOp: 0.3, stain: false }); X.anat(f, F, H, { hollow: 0.22, brow: 0.35, age: false, lit: '#d8b48a' }); W.pustule(f, F([[0.06, 0.04]])[0], 3, { col: mix(P.bileD, P.tan, 0.4) }); W.pustule(f, F([[-0.02, 0.14]])[0], 2.4, { burst: true }); } // hungry: the eyes sunk, the cheeks hollowed, blisters on the cheek
  f.stroke(hF([[0.12, 0.29], [0.24, 0.31], [0.34, 0.27]]), H * 0.03, INK); // the mouth stretched wide, the corners pulled back
  W.crease(f, hF([[0.1, 0.2], [0.08, 0.3], [0.12, 0.38]]), 1.4, { lip: 1, lit: '#c8a078', col: '#2a1a10' });
  W.warts(f, hF([[-0.04, 0.1]])[0], 6, 5, 2, 1.2, 2, mix(skin, '#9a8458', 0.25));
  // cropped wet hair in short clumps
  f.part(hF([[-0.4, 0.06], [-0.44, -0.24], [-0.28, -0.48], [0.02, -0.56], [0.24, -0.48], [0.3, -0.34], [0.14, -0.38], [-0.08, -0.34], [-0.22, -0.16], [-0.3, 0.06]]), { fill: '#2a1e14', shadow: '#0c0806', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, inkW: 1.1 });
  for (let i = 0; i < 7; i++) { const p = hF([[-0.36 + i * 0.09, -0.44 + Math.abs(i - 3) * 0.04]])[0]; W.hairClump(f, [p, add(p, [2, 6]), add(p, [6 - i, 13])], 6, { n: 2, pal: ['#1e160e', '#2a1e14', '#36281a'], sheenCol: '#4a3422' }); }
  // ---- near arm: the fist twisted in the sack's neck at the shoulder
  X.arm(f, SN, EN, WN, [26, 22, 18], '_n', SK());
  f.bone('upperarm_n'); f.part(K.ragLimb(f, lp(SN, EN, -0.1, 0), lp(SN, EN, 0.7, 0), 34, 30, { depth: 5, teeth: 4 }), WL());
  f.part(limb(lp(SN, EN, 0.62, 0), lp(SN, EN, 0.8, 0), 32, 30, { steps: 4 }), WL({ fill: '#6a5a46', cast: false })); // rolled sleeve
  f.bone('hand_n');
  B.grip(f, WN, EN, ang(WN, [244, 512]), 18, skin, { shadow: '#2a1a12', tex: 'wrinkle' + seed, texOp: 0.6, name: 'frog sack' });
  W.warts(f, add(WN, [2, -2]), 6, 5, 3, 1.4, 2.4, mix(skin, '#9a8458', 0.3));

  // ---- the throat pouch: pale, hanging like a toad's, stretched thin, veined bile green
  f.bone('pouch');
  const pc = hF([[0.1, 0.66]])[0];
  const pP = [hF([[-0.12, 0.42]])[0], hF([[0.08, 0.48]])[0], hF([[0.28, 0.46]])[0], hF([[0.34, 0.56]])[0], add(pc, [24, 16]), add(pc, [20, 34]), add(pc, [6, 40]), add(pc, [-4, 34]), add(pc, [-14, 40]), add(pc, [-24, 26]), add(pc, [-20, 8]), hF([[-0.18, 0.54]])[0]];
  const pD = f.part(pP, { fill: mix('#94805e', P.bileL, 0.12), shadow: '#3e3420', shade: 0.38, maxShade: 10, tex: 'mottle' + seed, texOp: 0.35, inkW: 1.3, inkHeavy: 2.2, k: 0.9 });
  W.crease(f, [hF([[-0.1, 0.48]])[0], hF([[0.1, 0.54]])[0], hF([[0.3, 0.52]])[0]], 1.6, { lip: 1.2, lit: '#e8dcb0', col: '#3a3418', op: 0.6 }); // the fold under the jaw where the pouch hangs from
  X.swelling(f, pD, E.bbox(pP), add(pc, [2, 14]), { lit: '#e8dcb8', litOp: 0.2, mottle: '#5a4a2a', vein: '#5a6a26', veins: 4, seed: 15, dark: 0.45 });
  for (let i = 0; i < 4; i++) f.line([add(pc, [-14 + i * 10, -6]), add(pc, [-12 + i * 9, 20 + (i % 2) * 6])], 0.9, INK, { op: 0.3 }); // pleats
  W.softTone(f, pD, [[[add(pc, [-26, 14]), add(pc, [24, 14]), add(pc, [20, 42]), add(pc, [-22, 40])], '#1a1408', 0.45, 6]]); // the fluid in it settled low
  { const cid = f.id('pc'); f.defs.push(`<clipPath id="${cid}"><path d="${pD}"/></clipPath>`); f.raw(`<g clip-path="url(#${cid})">`); for (let i = 0; i < 7; i++) { let q = add(pc, [-20 + i * 7, -16]); const vp = [q]; for (let k = 0; k < 4; k++) { q = add(q, [(f.r() - 0.5) * 10, 9]); vp.push(q); } f.line(vp, 1, i % 2 ? '#5a2e3a' : '#4a5a26', { op: 0.6 }); } f.raw('</g>'); } // veins under the thin skin
  f.flat(ell(add(pc, [10, 10]), 7, 3, -0.5, 8), '#fff4dc', { op: 0.45 }); // the tight wet sheen

  f.bone('root');
  for (const [a, w] of [[AN, 30], [AF, 28], [sp0, 16]]) f.flat(ell(add(a, [10, a === sp0 ? 0 : 24]), w, 4, 0, 14), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ LANTERN GNATS (cast, small swarm 0.6)
// Fen gnats bred in the poisoned shallows, swollen by toxin to the size of wasps, swarming to a hag's lantern. The lantern
// hangs on a twine loop from a bent reed pole driven into the mud and leaning toward the company; the swarm is densest in
// a ball round it and trails down to the water in a twisting tail. Water has kept the dead ones from rotting: they crust
// the horn panes in a thick layer, so the light comes through dull and patchy. Abdomens dull bile green and fat, some
// split open. Rig (its own): ground (root) > pole > lantern; ground > swarm (the ball), tail_1 > tail_2 (the trail),
// gnat_1..4 (the big ones in front).
// Motion: idle the swarm breathing in and out round the light (scale on `swarm`); attack the swarm pouring off the
// lantern over a hero and leaving blisters.
function lanternGnats() {
  const [CW, CH] = TIERS.small;
  const f = new Fig(W.base(228, CH, { grimeY: 680 }));
  W.textures(f);
  const seed = 228, gy = CH - 30;
  const pole = [[176, gy + 4], [200, 690], [246, 560], [306, 450], [362, 370], [404, 342], [430, 346]];
  const loop = [424, 350], lanTop = [424, 384], lanS = 64, LC = [424, 430];
  f.joint('ground', [300, gy]).joint('pole', [180, gy - 10], 'ground').joint('lantern', loop, 'pole');
  f.joint('swarm', LC, 'ground').joint('tail_1', [380, 540], 'swarm').joint('tail_2', [320, 680], 'tail_1');
  const bigs = [[[318, 352], 0.3], [[520, 470], 2.6], [[478, 318], -0.5], [[360, 520], 1.9]];
  bigs.forEach(([p], i) => f.joint('gnat_' + (i + 1), p, 'swarm'));

  // a gnat: fat segmented abdomen behind, a dark humped thorax, a small head, two smoky wings, hanging legs.
  // a = heading (screen angle); s = body length / 2. full: shaded parts (the big ones); else flat (the cloud)
  const ab = mix(P.bile, P.peat, 0.5), abD = mix(P.bileD, '#000', 0.45);
  const gnat = (c, s, a, o = {}) => {
    const R = (x, y) => add(c, rot([x * s, y * s], a)), split = o.split, near = o.lit || 0;
    const abC = R(-0.7, 0.1);
    f.flat(ell(R(-0.15, -0.55), s * 0.75, s * 0.28, a - 0.5, 8), '#c8c8b4', { op: 0.35 });
    f.flat(ell(R(-0.3, -0.42), s * 0.7, s * 0.24, a - 0.25, 8), '#a8a894', { op: 0.3 });
    for (const k of [-0.1, 0.15, 0.4]) f.line([R(k, 0.2), R(k - 0.15, 0.7), R(k - 0.05, 1.05)], Math.max(0.6, s * 0.07), INK, { op: 0.8 });
    if (o.full) {
      f.part(ell(abC, s * 0.78, s * 0.5, a + 0.15, 12), { fill: mix(ab, P.amberL, near * 0.3), shadow: abD, shade: 0.4, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false });
      for (let i = 0; i < 3; i++) f.line([R(-0.4 - i * 0.3, -0.42), R(-0.45 - i * 0.3, 0.1), R(-0.4 - i * 0.3, 0.55)], 0.9, INK, { op: 0.6 });
      f.part(ell(R(0.05, -0.05), s * 0.34, s * 0.3, a, 10), { fill: '#1e1a10', shadow: '#000', shade: 0.35, inkW: 0.9, cast: false, hatch: false });
      f.part(ell(R(0.42, 0.05), s * 0.18, s * 0.17, a, 8), { fill: '#1a160e', shade: 0.3, inkW: 0.8, cast: false, hatch: false });
      f.flat(ell(R(0.48, 0.0), s * 0.07, s * 0.06, 0, 6), '#6a5a2a');
      f.flat(ell(R(-0.6, -0.25), s * 0.3, s * 0.1, a, 6), '#e8e4c0', { op: 0.35 });
    } else {
      f.flat(ell(abC, s * 0.78, s * 0.5, a + 0.15, 9), o.dark ? '#24200e' : mix(ab, P.amberL, near * 0.35));
      f.flat(ell(R(-0.62, 0.3), s * 0.6, s * 0.28, a + 0.15, 8), abD, { op: 0.7 });
      f.flat(ell(R(0.05, -0.05), s * 0.34, s * 0.3, a, 7), '#1a160e');
      f.flat(ell(R(0.4, 0.05), s * 0.17, s * 0.16, a, 6), '#14100a');
    }
    if (split) { f.flat([R(-0.4, -0.4), R(-0.9, -0.1), R(-1.3, 0.1), R(-0.8, 0.0)], '#0e0a04'); f.flat(ell(R(-0.85, -0.05), s * 0.22, s * 0.12, a, 6), '#d8d4a8', { op: 0.8 }); } // split open, the pale insides
  };

  // ---- the second pole, fallen in the mud behind
  f.bone('ground');
  f.part(limb([40, gy - 6], [300, gy - 40], 12, 10, { steps: 8 }), { fill: P.reedD, shadow: '#1a160c', shade: 0.4, tex: 'wood' + seed, texOp: 0.4, inkW: 1.2 });
  f.line([[300, gy - 40], [312, gy - 52], [306, gy - 36]], 2, P.reedD);
  W.mossClump(f, [120, gy - 16], 26, 6);
  f.flat(ell([300, gy + 2], 250, 8, 0, 20), P.waterL, { op: 0.4 });
  W.ripples(f, [310, gy - 2], 70, 5, 3, '#6a6a4a', 0.45);

  // ---- the swarm, far layer: the ball's back half and the trail, small and dark (behind the pole and lantern)
  const ballPt = r0 => { const a = f.r() * 6.283, r = Math.pow(f.r(), 0.65) * r0; return add(LC, [Math.cos(a) * r * 1.05, Math.sin(a) * r * 0.95]); };
  const trail = t => { const base = [[424, 470], [450, 540], [396, 600], [330, 640], [300, 700], [340, 750], [380, gy - 6]]; const k = Math.min(base.length - 2, Math.floor(t * (base.length - 1))), u = t * (base.length - 1) - k; return lerp(base[k], base[k + 1], u); };
  f.bone('swarm');
  f.defs.push(`<filter id="haze${seed}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>`);
  f.raw(`<ellipse cx="${LC[0]}" cy="${LC[1]}" rx="125" ry="115" fill="#0e0c06" opacity="0.5" filter="url(#haze${seed})"/>`);
  f.raw(`<path d="${E.smooth([[424, 470], [450, 540], [396, 600], [330, 640], [300, 700], [340, 750], [360, 760], [320, 700], [350, 640], [420, 600], [430, 520]], true, 1)}" fill="#0e0c06" opacity="0.35" filter="url(#haze${seed})"/>`);
  for (let i = 0; i < 520; i++) { const p = ballPt(150), dl = E.len(sub(p, LC)); gnat(p, 2.4 + f.r() * 3.2, f.r() * 6.3, { lit: Math.max(0, 1 - dl / 160) * 0.6, dark: f.r() < 0.55 && dl > 50 }); }
  f.bone('tail_1');
  for (let i = 0; i < 160; i++) { const t = f.r() * 0.5, q = trail(t), w = 46 * (1 - t * 0.8); gnat(add(q, [(f.r() - 0.5) * w * 2, (f.r() - 0.5) * w]), 2.4 + f.r() * 3, f.r() * 6.3, { dark: f.r() < 0.5 }); }
  f.bone('tail_2');
  for (let i = 0; i < 110; i++) { const t = 0.5 + f.r() * 0.5, q = trail(t), w = 46 * (1 - t * 0.8); gnat(add(q, [(f.r() - 0.5) * w * 2, (f.r() - 0.5) * w]), 2.2 + f.r() * 2.5, f.r() * 6.3, { dark: f.r() < 0.5 }); }

  // ---- the reed pole: driven into the mud, leaning toward the company, bent at the top; moss up from the base, the
  // mould-furred rag tied on as a path marker
  f.bone('pole');
  f.part(K.chain(pole, [22, 20, 18, 16, 14, 12, 10], { steps: 6 }), { fill: P.reed, shadow: P.reedD, shade: 0.42, tex: 'wood' + seed, texOp: 0.35 });
  for (let i = 1; i < pole.length - 1; i++) f.line([add(pole[i], [-9, -4]), add(pole[i], [9, 4])], 1.6, INK, { op: 0.55, straight: true }); // nodes
  f.line(pole.slice(0, -1).map(q => add(q, [4, -2])), 1.2, P.reedL, { op: 0.5 });
  W.mossClump(f, lerp(pole[0], pole[1], 0.55), 7, 26, { ang: 0.2 }); W.mossClump(f, lerp(pole[1], pole[2], 0.3), 6, 14, { ang: 0.4 });
  W.mudSplats(f, [190, gy - 30], 20, 26, 8, P.peatD);
  const rg = lerp(pole[2], pole[3], 0.4);
  f.part([add(rg, [-14, -10]), add(rg, [12, -2]), add(rg, [10, 14]), add(rg, [-14, 6])], { fill: '#7a6a4e', shadow: '#2a2014', shade: 0.4, tex: 'weave' + seed, texOp: 0.6, inkW: 1.2 });
  const rgt = [add(rg, [-6, 8]), add(rg, [4, 10]), add(rg, [8, 60]), [...add(rg, [0, 74]), 1], add(rg, [-6, 56])];
  f.part(rgt, { fill: '#6e5e44', shadow: '#2a2014', shade: 0.4, tex: 'weave' + seed, texOp: 0.6 });
  f.part([add(rg, [-12, 6]), add(rg, [-6, 8]), add(rg, [-16, 46]), [...add(rg, [-22, 54]), 1], add(rg, [-20, 40])], { fill: '#625238', shadow: '#2a2014', shade: 0.4, tex: 'weave' + seed, texOp: 0.6 });
  X.mouldFur(f, [add(rg, [8, 56]), add(rg, [0, 72]), add(rg, [-20, 52])], 7, { n: 14 });
  X.holes(f, add(rg, [2, 36]), 3, 8, 1, { r0: 2, r1: 4 });
  // the twine loop and the frog-bone charm knotted to it
  W.rope(f, [add(pole[5], [6, 0]), add(loop, [4, 6]), add(lanTop, [0, 0])], 2.4, { col: P.ropeD });
  X.frogCharm(f, add(loop, [8, 8]), 34, { sw: 6, n: 2, s: 1 });

  // ---- the lantern: horn panes crusted thick with dead gnats, one pane cracked, a guttering tallow stub inside
  f.bone('lantern');
  W.lantern(f, lanTop, lanS, { glowOp: 0.3 });
  const LF = E.frame(lanTop, 0, lanS);
  for (let i = 0; i < 70; i++) { const q = LF([[-0.3 + f.r() * 0.6, 0.4 + f.r() * 0.64]])[0]; const r = 2 + f.r() * 3; f.flat(ell(q, r * 1.3, r, f.r() * 3, 7), f.r() > 0.75 ? mix(ab, '#000', 0.4) : f.r() > 0.5 ? '#2a2410' : '#14100a', { op: 0.85 }); f.flat(ell(add(q, [r * 0.4, -r * 0.4]), r * 0.5, r * 0.3, 0.6, 5), '#b8b49a', { op: 0.25 }); } // the crust of dead gnats, dried dark
  f.flat(LF(ell([0.04, 0.74], 0.12, 0.16, 0, 8)), '#f4d898', { op: 0.55 }); // where the light still gets through
  f.flat(LF(ell([0.06, 0.82], 0.05, 0.07, 0, 6)), '#fff2c8', { op: 0.7 });
  f.part(LF([[-0.06, 0.88], [0.12, 0.88], [0.1, 1.02], [-0.04, 1.02]]), { fill: '#c8bc98', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); // the tallow stub, guttered
  f.flat(LF([[-0.06, 0.9], [-0.1, 0.98], [-0.04, 0.96]]), '#c8bc98', { op: 0.8 });

  // ---- the swarm, near layer: the ball's front, bigger and lit by the lantern on the near side
  f.bone('swarm');
  for (let i = 0; i < 120; i++) { const p = ballPt(140), dl = E.len(sub(p, LC)); if (dl < 56) continue; gnat(p, 4 + f.r() * 4.5, f.r() * 6.3, { lit: Math.max(0, 1 - dl / 150) * 0.7, split: f.r() < 0.05 }); }
  for (let i = 0; i < 16; i++) { const p = ballPt(130); if (E.len(sub(p, LC)) < 70) continue; gnat(p, 7 + f.r() * 4, f.r() * 6.3, { full: true, lit: 0.3, split: f.r() < 0.25 }); }
  f.bone('tail_1');
  for (let i = 0; i < 6; i++) { const q = trail(0.1 + f.r() * 0.35); gnat(add(q, [(f.r() - 0.5) * 60, (f.r() - 0.5) * 30]), 6 + f.r() * 3, f.r() * 6.3, { full: true, split: i === 2 }); }
  bigs.forEach(([p, a], i) => { f.bone('gnat_' + (i + 1)); gnat(p, 13 - i, a, { full: true, lit: 0.2, split: i === 1 }); });
  return f;
}

// ------------------------------------------------------------------ STILT-FOWLER (cast, large 1.6 on his stilts)
// A wildfowler who crossed the deep fen on stilts to set his nets, and has not come down. A thin man perched high on two
// long poles, knees locked, leaning forward with both hands on a long net pole planted ahead like a third leg, the
// folded clap-net at its top. Toxin has grown his shins into the stilts: from the knee down the leg and the pole are
// knitted together at the strapping with swollen fungal knots and grey mould, with bracket fungus at the footrest, so
// each stilt reads as a long jointed leg. Water has soaked the poles black and tanned his bare thighs brown.
// Rig: standard humanoid (shin_n/_f carry the shin and the whole stilt below it; foot_n/_f the footrest knot) + netpole
// (hand_n), ducks (torso), decoy and pouch (pelvis), hood (torso).
// Motion: idle a teetering balance, one stilt lifting and setting down; attack the clap-net thrown down over a hero.
function stiltFowler() {
  const [CW, CH] = TIERS.large;
  const f = new Fig(W.base(225, CH, { grimeY: 900 }));
  W.textures(f);
  const seed = 225, gy = CH - 30, H = 96;
  const skin = '#76543a', skinD = '#5e422c';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#24160e' }, o));
  const woolC = '#5a4c38';
  const WL = (o = {}) => Object.assign({ fill: woolC, shadow: '#16100a', shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const stilt = '#221c16', stiltL = '#4a4034';
  const ST = (o = {}) => Object.assign({ fill: stilt, shadow: '#060504', light: stiltL, shade: 0.4, tex: 'wood' + seed, texOp: 0.45 }, o);
  const N = [566, 226], C = [470, 270], Pv = [446, 380];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.14), SF = S.at(0.42, 0.06);
  const np0 = [866, gy], np1 = [694, 40], npA = ang(np0, np1);
  const onNP = y => [np0[0] + (np1[0] - np0[0]) * (np0[1] - y) / (np0[1] - np1[1]), y];
  const gN = onNP(336), gF = onNP(276);
  const EN = [622, 340], EF = [650, 250];
  const HN = [456, 390], GN = [546, gy], HF = [432, 386], GF = [326, gy];
  const dN = E.norm(sub(GN, HN)), dF = E.norm(sub(GF, HF));
  const KN = add(HN, mul(dN, 168)), AN = add(HN, mul(dN, 318)), KF = add(HF, mul(dF, 168)), AF = add(HF, mul(dF, 318));
  const hA = 0.18, neck0 = N, HC = add(neck0, rot([0.26 * H, -0.44 * H], hA));
  const hF = frame(HC, hA, H);
  const belt = v => S.at(v, 0.92);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, gN], arm_f: [SF, EF, gF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('netpole', gN, 'hand_n').joint('ducks', S.at(-0.3, 0.04), 'torso').joint('decoy', belt(0.5), 'pelvis').joint('pouch', belt(-0.5), 'pelvis').joint('hood', S.at(-0.2, -0.02), 'torso');

  // one leg: bare tanned thigh, the knee locked; below the knee the shin knitted into the black stilt, strapped,
  // swollen fungal knots and mould at the straps, the foot on the footrest in a burl of fungus, the pole to the ground
  const leg = (Hp, Kn, A, G, sfx, far) => {
    const tone = far ? 0.22 : 0, sk = SK({ fill: mix(skin, '#000', tone) }), st = ST({ fill: mix(stilt, '#000', tone * 0.5) });
    const dk = elb(Hp, Kn, A);
    f.bone('shin' + sfx);
    // the stilt: from just over the knee to the ground, the shin grown along its front
    const top = lerp(Kn, A, -0.08), sd = E.norm(sub(G, top));
    f.part(K.chain([top, lerp(top, G, 0.3), lerp(top, G, 0.62), G], [24, 22, 20, 17], { steps: 8, bp: [[1, 0.5, 0.12, 0.1]], bq: [[0, 0.6, 0.1, 0.1]] }), st);
    f.line([lp(top, G, 0.04, 5), lp(top, G, 0.98, 4)], 1.2, '#6a5e4e', { op: 0.5 });
    for (let i = 0; i < 6; i++) { const t = 0.3 + i * 0.11; f.line([lp(top, G, t, -10), lp(top, G, t + 0.02, -2)], 1, '#000', { op: 0.6 }); } // splits in the soaked wood
    W.mudSplats(f, lp(top, G, 0.92, 0), 16, 40, 10, P.peatD);
    X.mouldFur(f, [lp(top, G, 0.8, -12), lp(top, G, 0.8, 12)], 8, { n: 14 });
    // the shin knitted to it: flesh along the front of the pole, fading into the wood, the calf swollen
    const shinP = [lp(Kn, A, -0.06, 26), lp(Kn, A, 0.3, 30), lp(Kn, A, 0.7, 22), lp(Kn, A, 1.02, 14), lp(Kn, A, 1.02, -8), lp(Kn, A, 0.6, -6), lp(Kn, A, 0.2, -16), lp(Kn, A, -0.06, -24)];
    const shD = f.part(shinP, sk);
    W.softTone(f, shD, [[[lp(Kn, A, 0.5, -10), lp(Kn, A, 1.0, -10), lp(Kn, A, 1.0, 8), lp(Kn, A, 0.6, 4)], stilt, 0.8, 6]]); // where the flesh turns to wood
    W.creaseField(f, lp(Kn, A, 0.4, 8), 10, 40, 5, ang(Kn, A) + 1.4, 22, 1.6, { lip: 1.2, lit: '#a07a50', col: '#1e120a' });
    // straps sunk into swollen flesh, fungal knots bulging between them, grey mould
    for (const t of [0.12, 0.5, 0.86]) {
      f.part([lp(Kn, A, t - 0.02, -26), lp(Kn, A, t - 0.03, 28), lp(Kn, A, t + 0.02, 28), lp(Kn, A, t + 0.03, -26)], { fill: '#3e2c1c', shadow: '#100a04', shade: 0.4, tex: 'leather' + seed, texOp: 0.6, inkW: 1.2, cast: false });
      f.part(ell(lp(Kn, A, t + 0.11, 22), 11, 9, 0, 10).map((p, k) => k % 2 ? add(p, [(f.r() - 0.5) * 4, (f.r() - 0.5) * 4]) : p), { fill: mix(P.bileD, skin, 0.4), shadow: '#14140a', shade: 0.45, inkW: 1, inkHeavy: 1.6, tex: 'moss' + seed, texOp: 0.6, cast: false });
      X.mouldFur(f, [lp(Kn, A, t + 0.05, -24), lp(Kn, A, t + 0.05, 26)], 7, { n: 10, blob: false });
    }
    // the footrest: a wooden block pegged through the pole, the foot on it grown into a burl, shelf fungus round it
    f.bone('foot' + sfx);
    const fr = lerp(top, G, 0.02 + (A[1] - top[1]) / (G[1] - top[1]));
    f.part([add(fr, [-20, 2]), add(fr, [46, -2]), add(fr, [50, 16]), add(fr, [-18, 18])], { fill: P.woodL, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.3, cast: false, sharp: true });
    f.rivet(add(fr, [2, 8]), 3.4, P.ironL);
    const ft = [add(A, [-14, -16]), add(A, [20, -14]), add(A, [50, -6]), add(A, [62, 2]), add(A, [58, 8]), add(A, [6, 10]), add(A, [-16, 8])];
    f.part(ft, sk);
    f.line([add(A, [30, -10]), add(A, [38, 4])], 1, INK, { op: 0.6 });
    f.part(ell(add(A, [-2, 2]), 20, 16, 0, 12).map((p, k) => k % 2 ? add(p, mul(sub(p, A), 0.2)) : p), { fill: mix(P.bileD, stilt, 0.4), shadow: '#0a0a04', shade: 0.45, inkW: 1.2, inkHeavy: 2, tex: 'moss' + seed, texOp: 0.6, cast: false }); // the burl where foot and wood have knitted
    W.bracket(f, add(fr, [-22, 18]), Math.PI + 0.3, 30, 3);
    W.bracket(f, add(fr, [46, 20]), 0.1, 22, 2);
    // the bare tanned thigh, knee locked
    f.bone('thigh' + sfx);
    const thD = f.part(K.chain([Hp, lerp(Hp, Kn, 0.55), Kn], [50, 42, 34], { steps: 8, bp: [[0, 0.5, 0.1, 0.2]] }), sk);
    f.flat(thD, `url(#leather${seed})`, { op: 0.5 });
    W.crease(f, [lp(Hp, Kn, 0.9, -16), add(Kn, [0, 4]), lp(Hp, Kn, 0.9, 18)], 2, { lip: 1.6, lit: '#b08a60', col: '#1e120a' });
    f.line([lp(Hp, Kn, 0.2, 14), lp(Hp, Kn, 0.8, 12)], 1.6, '#b08a60', { op: 0.45 });
  };

  // ---- far stilt and leg; the brace of ducks hanging down his back from the near shoulder (behind the body)
  leg(HF, KF, AF, GF, '_f', true);
  f.bone('ducks');
  const dk0 = S.at(-0.62, 0.06);
  // a dead duck hanging by its neck: the neck from the knot, the plump body below it (teardrop, heaviest low), the
  // wing folded along the side, the tail at the bottom, orange feet dangling; mottled brown feathers in scalloped rows
  const duck = (neckTop, len, a, col) => {
    const d = rot([0, 1], a), nb = add(neckTop, mul(d, len * 0.42)), F = frame(nb, a, 1);
    const hd = add(neckTop, mul(d, -4));
    f.part(K.chain([neckTop, lerp(neckTop, nb, 0.5), add(nb, mul(d, 8))], [11, 13, 20], { steps: 5 }), { fill: mix(col, '#000', 0.15), shadow: '#140e08', shade: 0.4, inkW: 1.1, cast: false });
    const bP = F([[-12, 0], [12, 0], [26, 18], [34, 48], [30, 80], [16, 100], [4, 116], [-6, 116], [-20, 98], [-32, 76], [-34, 44], [-26, 16]]);
    const bD = f.part(bP, { fill: col, shadow: '#140e08', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6 });
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const q = F([[-20 + c * 13 + (r % 2) * 6, 20 + r * 15]])[0]; f.line(ell(q, 5, 3.4, a, 8).slice(1, 6), 1.1, '#140e08', { op: 0.55 }); } // feather scallops
    W.softTone(f, bD, [[F([[-34, 40], [-10, 30], [-6, 116], [-34, 90]]), '#0a0604', 0.5, 6]]);
    f.part(F([[-8, 22], [14, 26], [26, 60], [20, 92], [6, 96], [0, 60]]), { fill: mix(col, '#5a5a52', 0.35), shadow: '#140e08', shade: 0.42, inkW: 1.1, cast: false }); // the folded wing
    f.line(F([[8, 60], [18, 64], [22, 74]]), 3, '#3e423e'); f.line(F([[6, 58], [20, 62]]), 1, '#c8c4b4', { op: 0.6 }); // the speculum, dull grey, white-edged
    f.part(F([[-8, 110], [8, 110], [4, 132], [-4, 132]]), { fill: mix(col, '#000', 0.3), shade: 0.4, inkW: 1, cast: false }); // tail
    for (const sx of [-1, 1]) { const ft = F([[sx * 18, 96]])[0]; f.line([ft, add(ft, [sx * 3, 18])], 2.6, '#a8783a'); f.part(F([[sx * 14, 116], [sx * 26, 116], [sx * 22, 128], [sx * 16, 126]]), { fill: '#a8783a', shadow: '#4a3018', shade: 0.4, inkW: 0.9, cast: false }); }
    f.part(ell(hd, 11, 9, a, 10), { fill: mix(col, '#000', 0.25), shadow: '#140e08', shade: 0.4, inkW: 1.1, cast: false });
    f.part([add(hd, rot([-4, -6], a)), add(hd, rot([-24, -2], a)), add(hd, rot([-22, 4], a)), add(hd, rot([-4, 6], a))], { fill: '#8a6a3a', shade: 0.4, inkW: 1, cast: false }); // the bill
    f.flat(ell(add(hd, rot([-2, -2], a)), 1.6, 1.2, 0, 6), INK);
  };
  // (drawn after the torso, below)

  // ---- far arm on the net pole, higher up
  X.arm(f, SF, EF, gF, [38, 32, 26], '_f', SK({ fill: skinD }));
  f.bone('upperarm_f'); f.part(K.ragLimb(f, SF, lp(SF, EF, 0.6, 0), 46, 42, { depth: 6, teeth: 5 }), WL({ fill: mix(woolC, '#000', 0.2) }));

  // ---- body: wiry and starved, a short belted wool tunic, its hem rotted
  f.bone('torso');
  const prof = [[-0.06, 0.28, 0.3], [0.06, 0.54, 0.46], [0.24, 0.6, 0.5], [0.44, 0.52, 0.44], [0.64, 0.46, 0.4], [0.84, 0.5, 0.44], [1.0, 0.54, 0.48]];
  const tP = S.shape(prof);
  const tD = f.part(tP, WL());
  X.clothWear(f, tD, E.bbox(tP), { stain: '#100a06', seed: 51 });
  X.folds(f, [[S.at(0.2, 0.2), S.at(0.3, 0.5), S.at(0.24, 0.8)], [S.at(-0.2, 0.3), S.at(-0.3, 0.7)]], 2.4, { lit: '#8a7458' });
  for (let i = 0; i < 4; i++) W.crease(f, [S.at(0.22, 0.12 + i * 0.07), S.at(0.4, 0.14 + i * 0.07)], 2, { lip: 1.6, lit: '#a08060', col: '#140c06', op: 0.5 }); // ribs through the thin wool
  f.part([S.at(-0.3, 0.4), S.at(-0.06, 0.38), S.at(-0.06, 0.56), S.at(-0.3, 0.58)], WL({ fill: '#4a3e2e', sharp: true, inkW: 1.1, cast: false })); // patch
  const t0 = S.at(0.62, 1.2), t1 = S.at(-0.7, 1.24);
  const tsk = [belt(-0.64), belt(0.6), t0, ...X.hem(f, t0, t1, 8, 16, { down: true }), t1];
  const tsD = f.part(tsk, WL({ fill: '#524434' }));
  X.holes(f, lerp(t0, t1, 0.5), 40, 6, 3, { r0: 3, r1: 7 }); X.mouldFur(f, [t0, t1], 8, { n: 20 });
  W.rope(f, [belt(-0.68), belt(0.0), belt(0.64)], 4, { col: '#3a2a1a' });
  // the brace of ducks slung by the necks over the near shoulder, hanging down his back past its outline
  f.bone('ducks');
  { const q = S.at(-0.5, 0.02); W.rope(f, [add(q, [40, -10]), add(q, [10, -14]), add(q, [-14, -2])], 3, { col: P.ropeD }); duck(add(q, [-10, 0]), 70, 0.55, '#7a6040'); duck(add(q, [-4, 4]), 56, 0.22, '#8e7250'); }

  // ---- near stilt and leg
  leg(HN, KN, AN, GN, '_n', false);
  // ---- the wooden decoy duck on a cord from the belt; the sling pouch of stones
  f.bone('decoy');
  const dc = add(belt(0.5), [10, 60]);
  f.line([belt(0.5), add(dc, [-4, -18])], 1.4, P.ropeD);
  const DF = frame(dc, 0.1, 1);
  f.part(DF([[-30, 0], [-26, -12], [0, -16], [22, -12], [30, 2], [24, 14], [-20, 14]]), { fill: '#6a5a40', shadow: '#1e160c', shade: 0.42, tex: 'wood' + seed, texOp: 0.5, inkW: 1.3 });
  f.part(DF([[8, -12], [10, -26], [22, -30], [30, -24], [42, -22], [30, -16], [22, -12]]), { fill: '#6a5a40', shadow: '#1e160c', shade: 0.42, inkW: 1.2, cast: false });
  f.flat(DF(ell([22, -24], 2.4, 2.4, 0, 6)), INK); f.flat(DF([[-20, -6], [10, -8], [20, 2], [-14, 4]]), '#3a3a2a', { op: 0.5 }); // worn paint
  f.line(DF([[-26, 4], [20, 6]]), 1, '#a89a7a', { op: 0.5 });
  f.bone('pouch');
  const pc = add(belt(-0.5), [-4, 34]);
  f.line([belt(-0.5), add(pc, [0, -20])], 2, '#3a2a1a');
  f.part([add(pc, [-16, -20]), add(pc, [14, -20]), add(pc, [20, 6]), add(pc, [6, 22]), add(pc, [-14, 18]), add(pc, [-20, 0])], { fill: '#4a3622', shadow: '#140c06', shade: 0.42, tex: 'leather' + seed, texOp: 0.7, inkW: 1.2 });
  for (const q of [[-6, -18], [6, -20], [0, -24]]) f.part(ell(add(pc, q), 5, 4, 0, 8), { fill: P.grey, shade: 0.4, inkW: 0.9, cast: false, hatch: false });
  f.stroke([add(pc, [12, -14]), add(pc, [26, 10]), add(pc, [22, 40])], 3, '#3a2a1a'); // the sling's cord hanging

  // ---- head: narrow, bearded, sharp-nosed, hair matted with reeds, the reed whistle at his lips; the hood pushed back
  f.bone('hood');
  const hd = S.at(-0.24, -0.06);
  f.part([add(hd, [-50, -4]), add(hd, [-20, -40]), add(hd, [24, -30]), add(hd, [34, 4]), add(hd, [10, 24]), add(hd, [-36, 26])], WL({ fill: '#4a3e2c' }));
  f.flat([add(hd, [-30, -10]), add(hd, [-8, -30]), add(hd, [18, -22]), add(hd, [16, 4]), add(hd, [-20, 10])], '#140e08', { op: 0.6 });
  W.mossClump(f, add(hd, [-4, -10]), 18, 10); // moss stuffing for warmth
  f.bone('head');
  f.part(K.chain([add(neck0, [-6, 12]), hF([[-0.1, 0.4]])[0]], [38, 32]), SK());
  X.face(f, HC, H, hA, { skin, jaw: 0.88, chin: 0.06, nose: 1.32, hook: 0.5, mouth: 'set', squint: 0.6, browDown: 0.07, gaunt: true, beard: 'short', beardCol: '#2e2418', iris: '#1a120a', eyeWhite: '#b8aa86', hairCol: '#2e2418' });
  // matted hair with reeds caught in it
  f.part(hF([[-0.44, 0.2], [-0.48, -0.2], [-0.3, -0.48], [0.0, -0.56], [0.24, -0.48], [0.3, -0.32], [0.1, -0.36], [-0.12, -0.3], [-0.24, -0.1], [-0.3, 0.2]]), { fill: '#2e2418', shadow: '#0c0806', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, inkW: 1.1 });
  for (let i = 0; i < 6; i++) { const p = hF([[-0.46 + i * 0.05, -0.3 + Math.abs(i - 2) * 0.05]])[0]; W.hairClump(f, [p, add(p, [-6, 18]), add(p, [-8 - i, 40 + i * 3])], 10, { n: 3, pal: ['#1e160e', '#2e2418', '#3a2e1e'], sheenCol: '#4a3826' }); }
  for (const [u, v, l, a] of [[-0.2, -0.46, 54, 3.0], [-0.04, -0.5, 44, 3.3], [-0.36, -0.1, 50, 2.2]]) { const p = hF([[u, v]])[0]; W.reed(f, [p, add(p, rot([l * 0.5, 0], a)), add(p, rot([l, 0], a + 0.1))], 3, { nodes: false }); }
  // the reed whistle at his lips, on a thong round his neck
  const wh0 = hF([[0.28, 0.3]])[0], wh1 = add(wh0, rot([44, 0], hA + 0.25));
  f.line([hF([[-0.1, 0.42]])[0], S.at(0.2, 0.08), lerp(wh0, wh1, 0.6)], 1.2, P.ropeD);
  f.part(limb(wh0, wh1, 7, 6, { steps: 4, capK: 0.6 }), { fill: P.reedL, shadow: P.reedD, shade: 0.4, inkW: 1.1, cast: false });
  f.line([lerp(wh0, wh1, 0.5), lerp(wh0, wh1, 0.58)], 1.4, INK); f.line([lerp(wh0, wh1, 0.78), lerp(wh0, wh1, 0.86)], 1.4, INK);

  // ---- the net pole: planted ahead like a third leg, the folded clap-net at its top
  f.bone('netpole');
  f.part(limb(np0, np1, 14, 11, { steps: 14 }), { fill: '#6a5a40', shadow: '#1e160c', shade: 0.4, tex: 'wood' + seed, texOp: 0.55 });
  f.line([lp(np0, np1, 0.02, -3), lp(np0, np1, 0.97, -3)], 1.1, '#a89470', { op: 0.5, straight: true });
  f.flat([lp(np0, np1, 0, -9), lp(np0, np1, 0, 9), lp(np0, np1, 0.2, 8), lp(np0, np1, 0.24, -4)], P.peatD, { op: 0.85 });
  W.mossClump(f, lp(np0, np1, 0.1, 0), 8, 22, { ang: npA });
  // the clap-net: two hinged hazel bows folded flat together along the top of the pole, lashed on, the netting
  // bundled between them and sagging in loose mesh, cork floats on the bows
  const cn = lerp(np0, np1, 0.8), cF = frame(cn, npA, 1);
  const netP = cF([[-6, -8], [60, -14], [150, -12], [226, -6], [232, 6], [190, 16], [150, 34], [110, 30], [70, 40], [30, 26], [-6, 10]]);
  const ntD = f.part(netP, { fill: '#5e5640', shadow: '#1a160c', shade: 0.4, inkW: 1.2, inkHeavy: 2 });
  for (let i = 0; i < 16; i++) { f.line(cF([[i * 15, -12], [i * 15 + 14, 30]]), 0.9, '#1a160c', { op: 0.6 }); f.line(cF([[i * 15 + 14, -12], [i * 15, 30]]), 0.9, '#1a160c', { op: 0.5 }); } // the mesh, diamond
  W.softTone(f, ntD, [[cF([[0, 10], [230, 4], [200, 40], [0, 40]]), '#0a0804', 0.5, 6]]);
  for (const sg of [-1, 1]) f.part(cF([[-12, sg * 4], [120, sg * 9], [236, sg * 5], [238, sg * 11], [120, sg * 15], [-12, sg * 10]]), { fill: '#7a6a48', shadow: '#2a2014', shade: 0.4, inkW: 1.1, cast: false }); // the two hazel bows
  for (const u of [30, 90, 150, 210]) f.part(cF(ell([u, -12], 7, 5, 0, 8)), { fill: '#a88a5a', shadow: '#4a3a22', shade: 0.4, inkW: 1, cast: false }); // cork floats
  for (const u of [40, 110, 170]) { W.rope(f, cF([[u, -14], [u + 4, 0], [u, 16]]), 2.4, { col: P.ropeD }); }
  for (let i = 0; i < 6; i++) { const q = cF([[20 + i * 34, 30 + (i % 2) * 8]])[0]; const l = 24 + f.r() * 30; f.line([q, add(q, [(f.r() - 0.5) * 8, l * 0.5]), add(q, [(f.r() - 0.5) * 10, l])], 1.2, '#3a3426', { op: 0.85 }); if (i % 2) W.drip(f, add(q, [0, l]), 0.7, P.peatD); } // loose mesh hanging plumb, dripping
  // ---- hands on the net pole
  f.bone('hand_f'); B.grip(f, gF, EF, npA, 25, skinD, { shadow: '#24160e', tex: 'wrinkle' + seed, texOp: 0.6, name: 'fowler far' });
  X.arm(f, SN, EN, gN, [40, 34, 27], '_n', SK());
  f.bone('upperarm_n'); f.part(K.ragLimb(f, lp(SN, EN, -0.12, 0), lp(SN, EN, 0.56, 0), 50, 46, { depth: 6, teeth: 5 }), WL());
  f.bone('forearm_n'); W.creaseField(f, lp(EN, gN, 0.5, 0), 30, 6, 4, ang(EN, gN) + 1.5, 16, 1.4, { lip: 1, lit: '#a07a50', col: '#1e120a' }); f.line([lp(EN, gN, 0.1, -8), lp(EN, gN, 0.9, -6)], 1.2, '#24160e', { op: 0.6 }); // tendons of a starved arm
  f.bone('hand_n'); B.grip(f, gN, EN, npA, 26, skin, { shadow: '#24160e', tex: 'wrinkle' + seed, texOp: 0.6, name: 'fowler near' });

  f.bone('root');
  for (const [a, w] of [[GN, 30], [GF, 28], [np0, 22]]) f.flat(ell(a, w, 5, 0, 14), P.waterL, { op: 0.45 });
  W.ripples(f, [600, gy + 2], 300, 6, 3, '#5a5a40', 0.4);
  for (const [x, h] of [[140, 220], [176, 160], [780, 120]]) W.reed(f, [[x, gy + 4], [x + 3, gy - h * 0.5], [x - 4, gy - h]], 4, { cattail: x === 140 });
  return f;
}

// ------------------------------------------------------------------ THE TITHE REEVE (elite 2.0)
// The reeve of the stilt villages, headman of the moot-hall and collector of the eel tithe. Portly and upright, leaning
// back against the weight of his front, feet planted wide in the mud, weight on the heels. The black bog-oak carrying
// pole rests across his right (far) shoulder, a dozen dried tithe eels tied to it by the tails, the far hand on its front
// end; the left (near) hand holds out a notched tally stick as if presenting a bill. Toxin has ripened his neck into a
// huge goitre hanging over the collar onto the chest, mottled bile green and brown, pustuled, a ring of small
// toadstools at its base and the pewter chain of office sunk into its folds. Water has tanned his skin to leather.
// Rig: standard humanoid + pole (hand_f) with eels, tally (hand_n), goitre (torso), hat (head), gown (pelvis: the skirt
// of the gown swings), keys (pelvis).
// Motion: idle counting notches with a thumb, lips moving; attack a heavy swing of the eel pole; other action taps the
// tally and puts a hero in his debt.
function titheReeve() {
  const [CW, CH] = TIERS.elite;
  const f = new Fig(W.base(222, CH, { grimeY: 1080 }));
  W.textures(f);
  const seed = 222, gy = CH - 30, H = 196;
  const skin = '#7c5836', skinD = '#664628';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#2a1a10' }, o));
  const gownC = '#4a3826', furC = '#5a4630', dbC = '#5e4a32', linen = '#8a7656', hose = '#3e3428';
  const GW = (o = {}) => Object.assign({ fill: gownC, shadow: '#140c06', shade: 0.42, tex: 'weave' + seed, texOp: 0.55 }, o);
  const DB = (o = {}) => Object.assign({ fill: dbC, shadow: '#1a120a', shade: 0.42, tex: 'quilt' + seed, texOp: 0.6 }, o);
  const N = [520, 352], C = [548, 520], Pv = [566, 724];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.14, 0.12), SF = S.at(0.36, 0.06);
  // the pole: front end in the far hand, resting on the far shoulder, running back and up behind him
  const pl0 = [900, 420], pl1 = [70, 250], plA = ang(pl1, pl0);
  const onPl = x => [x, pl0[1] + (pl1[1] - pl0[1]) * (pl0[0] - x) / (pl0[0] - pl1[0])];
  const gF = onPl(852), EF = [736, 540];
  const WN = [846, 640], EN = [668, 670];
  const HN = [600, 736], KN = [652, 1030], AN = [676, 1296];
  const HF = [536, 730], KF = [478, 1030], AF = [432, 1296];
  const hA = -0.06, neck0 = N, HC = add(neck0, rot([0.24 * H, -0.48 * H], hA));
  const hF = frame(HC, hA, H);
  const belt = v => S.at(v, 0.9);
  X.humanJoints(f, { pelvis: Pv, torso: S.at(0, 0.86), neck: neck0, arm_n: [SN, EN, WN], arm_f: [SF, EF, gF], leg_n: [HN, KN, AN], leg_f: [HF, KF, AF] });
  f.joint('pole', gF, 'hand_f').joint('tally', WN, 'hand_n').joint('goitre', hF([[0.0, 0.5]])[0], 'torso').joint('hat', hF([[0, -0.4]])[0], 'head').joint('gown', S.at(0, 0.92), 'pelvis').joint('keys', belt(-0.3), 'pelvis');

  // ---- the pole and its eels (behind the head and body: it rests on the far shoulder)
  f.bone('pole');
  f.part(limb(pl1, pl0, 26, 30, { steps: 16, p: [[0.3, 0.1, 0.06], [0.7, 0.12, 0.05]] }), { fill: '#1e1a14', shadow: '#050403', light: '#4a4236', shade: 0.4, tex: 'wood' + seed, texOp: 0.4 });
  f.line([lp(pl1, pl0, 0.02, 8), lp(pl1, pl0, 0.97, 9)], 1.6, '#6a5e4c', { op: 0.5 });
  for (let i = 0; i < 12; i++) {
    const x = 104 + i * 36 + (f.r() - 0.5) * 10; if (x > 520) break;
    const top = onPl(x), l = 150 + f.r() * 90, sw = (f.r() - 0.5) * 24;
    W.rope(f, [add(top, [-4, -10]), add(top, [6, 4]), add(top, [0, 14])], 2.2, { col: P.ropeD });
    X.eel(f, [add(top, [sw, l]), add(top, [sw * 0.6 + (f.r() - 0.5) * 16, l * 0.66]), add(top, [(f.r() - 0.5) * 12, l * 0.33]), add(top, [0, 12])], 18 + f.r() * 8, { dried: true });
  }
  W.rope(f, [onPl(440), add(onPl(440), [0, 18]), onPl(470)], 3, { col: P.ropeD });

  // ---- far leg: thin, wool hose; an eel-skin boot split at the toes
  const legBoot = (Hp, Kn, A, sfx, far) => {
    const col = mix(hose, '#000', far ? 0.25 : 0);
    X.tubeLeg(f, Hp, Kn, A, [128, 84, 62], sfx, { fill: col, shadow: '#0e0a06', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 }, { bp: [[1, 0.25, 0.18, 0.2]] });
    f.bone('foot' + sfx);
    B.boot(f, A, 1, 112, mix('#2a2418', '#000', far ? 0.2 : 0), { shaft: 0.9, tex: 'leather' + seed, texOp: 0.6 });
    for (let i = 0; i < 7; i++) f.line([add(A, [-34 + i * 4, -80 + i * 16]), add(A, [34 + i * 2, -84 + i * 16])], 1, '#7a6e58', { op: 0.35 }); // eel-skin bands
    f.flat([add(A, [100, gy - A[1] - 40]), add(A, [128, gy - A[1] - 30]), add(A, [118, gy - A[1] - 14]), add(A, [96, gy - A[1] - 20])], '#0c0806'); // split at the toe
    f.part(ell(add(A, [112, gy - A[1] - 24]), 10, 8, 0, 8), SK({ cast: false, inkW: 1 })); // a toe through it
    W.mudSplats(f, add(A, [30, gy - A[1] - 20]), 70, 24, 12, P.peatD);
  };
  legBoot(HF, KF, AF, '_f', true);
  // ---- far arm: up to the front end of the pole
  X.arm(f, SF, EF, gF, [88, 76, 60], '_f', GW({ fill: mix(gownC, '#000', 0.2) }), { lines: false });
  f.bone('forearm_f'); f.part(limb(lp(EF, gF, 0.4, 0), lp(EF, gF, 0.66, 0), 92, 90, { steps: 4, capK: 0.6 }), { fill: furC, shadow: '#140c06', shade: 0.42, tex: 'moss' + seed, texOp: 0.4, inkW: 1.4 }); // fur cuff
  f.bone('hand_f');
  B.grip(f, gF, EF, ang(gF, pl1), 54, skinD, { shadow: '#2a1a10', tex: 'wrinkle' + seed, texOp: 0.6, name: 'reeve pole' });

  // ---- the gown's back, from the shoulders to mid-calf (behind the legs)
  f.bone('gown');
  const gb0 = [760, 1150], gb1 = [330, 1150];
  const gbP = [S.at(-0.6, 0.2), S.at(0.6, 0.4), [780, 900], gb0, ...X.hem(f, gb0, gb1, 12, 34, { down: true }), gb1, [360, 880]];
  const gbD = f.part(gbP, GW({ fill: mix(gownC, '#000', 0.25) }));
  X.clothWear(f, gbD, E.bbox(gbP), { stain: '#0a0604', seed: 61 });
  X.folds(f, [[[420, 900], [400, 1040], [390, 1140]], [[480, 920], [470, 1060], [474, 1150]], [[540, 940], [546, 1120]]], 3.6, { lit: '#7a6448' });
  X.mouldFur(f, [gb0, [540, 1180], gb1], 16, { n: 40 });

  // ---- body: the portly torso: brown linen shirt, the quilted doublet split at the buttons, the gown's shoulders
  f.bone('torso');
  const prof = [[-0.08, 0.3, 0.34], [0.06, 0.62, 0.62], [0.22, 0.72, 0.8], [0.42, 0.74, 1.0], [0.62, 0.72, 1.14], [0.82, 0.7, 1.12], [0.98, 0.7, 0.9]];
  const tP = S.shape(prof);
  const tD = f.part(tP, DB());
  X.clothWear(f, tD, E.bbox(tP), { stain: '#100a04', seed: 63, tone: [[[S.at(-0.6, 0.2), S.at(0.2, 0.3), S.at(0.3, 1.0), S.at(-0.6, 1.0)], '#0a0604', 0.4, 30]] });
  // the doublet split at its buttons, the shirt showing through the gaps, the buttons straining on their threads
  for (let i = 0; i < 6; i++) { const v = 0.3 + i * 0.11, q = S.at(0.86 + Math.sin(v * 3) * 0.2, v); const gap = i < 3 ? 14 - i * 3 : 4; f.part([add(q, [-gap, -12]), add(q, [gap, -10]), add(q, [gap * 0.6, 12]), add(q, [-gap * 0.8, 14])], { fill: linen, shadow: '#3a2e1c', shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed, texOp: 0.5 }); f.part(ell(add(q, [gap + 6, 0]), 7, 7, 0, 8), { fill: '#6a5a40', shade: 0.4, inkW: 1, cast: false }); f.line([add(q, [gap + 1, 0]), add(q, [-gap, 0])], 1, '#c8b890', { op: 0.7 }); }
  X.folds(f, [[S.at(0.7, 0.4), S.at(0.5, 0.7), S.at(0.6, 0.9)], [S.at(0.2, 0.4), S.at(0.1, 0.8)], [S.at(0.9, 0.7), S.at(0.8, 0.9)]], 3, { lit: '#8a7454' });
  // the gown's shoulders and open fronts, trimmed with matted, moulting otter fur
  const gs = [S.at(-0.66, -0.06), S.at(0.1, -0.1), S.at(0.2, 0.1), S.at(-0.1, 0.4), S.at(-0.3, 1.0), S.at(-0.72, 1.0), S.at(-0.76, 0.5)];
  const gsD = f.part(gs, GW());
  X.clothWear(f, gsD, E.bbox(gs), { stain: '#0a0604', seed: 65 });
  X.folds(f, [[S.at(-0.4, 0.1), S.at(-0.5, 0.5), S.at(-0.46, 0.9)], [S.at(-0.2, 0.3), S.at(-0.24, 0.8)]], 3.2, { lit: '#7a6448' });
  const fur = (pts, w) => { f.part(K.chain(pts, pts.map(() => w), { steps: 6 }), { fill: furC, shadow: '#120a04', shade: 0.42, tex: 'moss' + seed, texOp: 0.35, inkW: 1.4, inkHeavy: 2.4 }); for (let i = 0; i < pts.length * 6; i++) { const k = Math.min(pts.length - 2, Math.floor(i / 6)), q = lerp(pts[k], pts[k + 1], (i % 6) / 6); W.hairClump(f, [add(q, [(f.r() - 0.5) * w * 0.6, -w * 0.3]), add(q, [(f.r() - 0.5) * 6, w * 0.3]), add(q, [(f.r() - 0.5) * 8, w * 0.7])], 7, { n: 2, pal: ['#3a2c1e', '#4a3828', '#5a4632'], sheenCol: '#6a5640' }); } f.flat(ell(lerp(pts[1], pts[2], 0.5), w * 0.3, w * 0.2, 0, 8), '#1a120a', { op: 0.85 }); }; // a moulted bald patch
  fur([S.at(0.14, -0.08), S.at(-0.06, 0.3), S.at(-0.22, 0.7), S.at(-0.3, 1.0)], 40);

  // ---- near leg, the hose patched on the knee
  legBoot(HN, KN, AN, '_n', false);
  f.bone('shin_n');
  f.part([lp(KN, AN, -0.08, -40), lp(KN, AN, -0.1, 34), lp(KN, AN, 0.1, 36), lp(KN, AN, 0.12, -38)], { fill: '#5a4a36', shadow: '#1a120a', shade: 0.4, inkW: 1.2, tex: 'weave' + seed, texOp: 0.6, cast: false, sharp: true });
  f.stitches([lp(KN, AN, -0.08, -40), lp(KN, AN, -0.1, 34), lp(KN, AN, 0.1, 36), lp(KN, AN, 0.12, -38), lp(KN, AN, -0.08, -40)], P.boneD, 1);
  // ---- the gown's front skirt over the near leg, hem rotted into holes and mould fur
  f.bone('gown');
  const g0 = [820, 1110], g1 = [600, 1150];
  const gfP = [belt(0.3), belt(0.98), [800, 900], g0, ...X.hem(f, g0, g1, 7, 30, { down: true }), g1, [596, 900]];
  const gfD = f.part(gfP, GW());
  X.clothWear(f, gfD, E.bbox(gfP), { stain: '#0a0604', seed: 67, tone: [[[[600, 900], [650, 900], [640, 1150], [600, 1150]], '#0a0604', 0.55, 14], [[[690, 880], [720, 880], [730, 1140], [700, 1140]], '#0a0604', 0.45, 10], [[[740, 870], [770, 880], [790, 1100], [760, 1100]], '#c8a878', 0.25, 10]] });
  X.folds(f, [[[700, 820], [720, 960], [716, 1100]], [[640, 830], [626, 990], [640, 1120]], [[780, 840], [800, 1000]], [[668, 860], [676, 1000], [668, 1130]], [[740, 900], [754, 1060]]], 3.6, { lit: '#8a7454' });
  for (let i = 0; i < 10; i++) f.line([[610 + f.r() * 190, 1040 + f.r() * 30], [610 + f.r() * 190, 1110 + f.r() * 30]], 1.2, P.peatD, { op: 0.5 }); // wet streaks up from the hem
  X.holes(f, [700, 1100], 90, 20, 5, { r0: 6, r1: 14 }); X.mouldFur(f, [g0, [720, 1150], g1], 14, { n: 30 });
  fur([[812, 840], [820, 960], [824, 1100]], 36);
  // ---- the wide belt: the ring of pitted moot-hall keys, the purse of tithe coins, the horn ink pot, the knife
  f.bone('pelvis');
  const bD = f.part([add(belt(-0.72), [0, -20]), add(belt(1.04), [0, -26]), add(belt(1.04), [0, 22]), add(belt(-0.72), [0, 20])], { fill: '#3a2818', shadow: '#0e0804', shade: 0.4, tex: 'leather' + seed, texOp: 0.7, inkW: 1.6, light: '#7a5a3a' });
  f.part([add(belt(0.7), [-20, -22]), add(belt(0.7), [20, -22]), add(belt(0.7), [20, 22]), add(belt(0.7), [-20, 22])], { fill: '#6a6458', shadow: '#2a2622', shade: 0.4, inkW: 1.4, cast: false, sharp: true });
  f.flat([add(belt(0.7), [-10, -12]), add(belt(0.7), [10, -12]), add(belt(0.7), [10, 12]), add(belt(0.7), [-10, 12])], '#1a1610');
  const ip = belt(0.32); // horn ink pot
  f.part([add(ip, [-14, 16]), add(ip, [14, 16]), add(ip, [18, 60]), add(ip, [6, 72]), add(ip, [-10, 70]), add(ip, [-18, 56])], { fill: '#8a7a5a', shadow: '#3a2e1c', shade: 0.42, tex: 'wrinkle' + seed, texOp: 0.5, inkW: 1.3 });
  f.part(ell(add(ip, [0, 16]), 14, 5, 0, 10), { fill: '#3a2e1c', shade: 0.4, inkW: 1, cast: false }); f.line([add(ip, [4, 14]), add(ip, [26, -34])], 2, '#d8d0b8'); // a quill in it
  f.flat([add(ip, [-6, 24]), add(ip, [4, 24]), add(ip, [2, 44])], '#0a0806', { op: 0.6 });
  const pu = belt(0.06); // purse of tithe coins
  f.line([pu, add(pu, [0, 24])], 3, '#2a1a10');
  f.part([add(pu, [-30, 24]), add(pu, [28, 22]), add(pu, [38, 70]), add(pu, [20, 96]), add(pu, [-20, 96]), add(pu, [-38, 66])], { fill: '#5a4028', shadow: '#140c06', shade: 0.42, tex: 'leather' + seed, texOp: 0.7, inkW: 1.4 });
  W.rope(f, [add(pu, [-30, 32]), add(pu, [0, 38]), add(pu, [30, 30])], 2.4, { col: P.ropeD });
  for (const q of [[-10, 74], [8, 66], [20, 82]]) f.flat(ell(add(pu, q), 6, 4, 0, 8), '#2a1a0c', { op: 0.5 }); // coins pressing out
  const kn = belt(-0.6); // knife
  f.part([add(kn, [-10, 18]), add(kn, [10, 18]), add(kn, [6, 120]), [...add(kn, [-2, 140]), 1], add(kn, [-8, 116])], { fill: '#3a2818', shadow: '#0e0804', shade: 0.4, tex: 'leather' + seed, texOp: 0.7, inkW: 1.3 });
  f.part([add(kn, [-8, -30]), add(kn, [8, -30]), add(kn, [10, 18]), add(kn, [-10, 18])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, inkW: 1.2, cast: false });
  f.bone('keys');
  const kr = add(belt(-0.3), [0, 34]);
  f.line(ell(kr, 26, 26, 0, 16).concat([ell(kr, 26, 26, 0, 16)[0]]), 4, P.iron);
  for (let i = 0; i < 6; i++) { const a = 1.0 + i * 0.32, q = add(kr, rot([24, 0], a)), d = rot([1, 0], a + (f.r() - 0.5) * 0.3), e = add(q, mul(d, 60 + f.r() * 24)); f.part(limb(q, e, 8, 7, { steps: 4, capK: 1 }), { fill: P.iron, shadow: '#0e0a08', shade: 0.4, inkW: 1.1, cast: false, tex: 'mottle' + seed, texOp: 0.6 }); f.part(ell(q, 9, 9, 0, 8), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false }); f.flat(ell(q, 3, 3, 0, 6), '#0e0a08'); f.part([add(e, rot([-4, 0], a)), add(e, rot([-4, 12], a)), add(e, rot([6, 12], a)), add(e, rot([6, 0], a))], { fill: P.iron, shade: 0.4, inkW: 1, cast: false, sharp: true }); }

  // ---- head: heavy jowled face, small shrewd eyes, a wet lower lip; felt hat with a drooping brim and a heron feather
  f.bone('head');
  f.part(K.chain([add(neck0, [-6, 30]), hF([[-0.1, 0.42]])[0]], [120, 100]), SK());
  X.face(f, HC, H, hA, { skin, jaw: 1.32, chin: -0.02, nose: 1.1, mouth: 'set', squint: 0.72, browDown: 0.06, iris: '#1a120a', eyeWhite: '#b0a280', glint: true, hairCol: '#3a2e20', noEar: false }, { lit: '#d8b48a' });
  // the jowls hanging over the jaw line, the wet lower lip
  const jw = f.part(hF([[-0.2, 0.3], [0.04, 0.4], [0.28, 0.46], [0.3, 0.6], [0.1, 0.66], [-0.14, 0.58], [-0.26, 0.44]]), SK({ cast: true, castOp: 0.4, inkW: 1.4 }));
  W.softTone(f, jw, [[hF([[-0.26, 0.4], [0.2, 0.6], [0.0, 0.7], [-0.3, 0.6]]), '#140a04', 0.5, 10]]);
  W.crease(f, hF([[-0.14, 0.36], [0.06, 0.46], [0.24, 0.48]]), 3, { lip: 2.4, lit: '#c8a078', col: '#2a1610' });
  W.crease(f, hF([[0.26, 0.14], [0.22, 0.24], [0.2, 0.34]]), 3, { lip: 2.4, lit: '#c8a078', col: '#2a1610' });
  f.part(hF([[0.17, 0.3], [0.31, 0.29], [0.3, 0.34], [0.2, 0.35]]), { fill: '#7a3e2e', shadow: '#3a1a12', shade: 0.4, inkW: 1, cast: false });
  f.line(hF([[0.2, 0.31], [0.28, 0.305]]), 1.6, '#e8d0b8', { op: 0.7 }); // wet shine on the lower lip
  // thin hair plastered under the hat, a few wet clumps at the nape
  for (let i = 0; i < 5; i++) { const p = hF([[-0.38 + i * 0.05, -0.18 + i * 0.02]])[0]; W.hairClump(f, [p, add(p, [-4, 24]), add(p, [-6 - i * 2, 50])], 10, { n: 3, pal: ['#2a2016', '#3a2e20', '#4a3a28'], sheenCol: '#5a4630' }); }
  // ---- the felt hat: a crown dented in, a drooping brim, the heron feather in the band
  f.bone('hat');
  const hc = hF([[-0.44, -0.2], [-0.46, -0.5], [-0.26, -0.74], [0.04, -0.82], [0.3, -0.72], [0.4, -0.5], [0.38, -0.22]]);
  const hcD = f.part(hc, { fill: '#3e3226', shadow: '#0e0a06', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6 });
  W.crease(f, hF([[-0.1, -0.78], [0.0, -0.62], [0.1, -0.78]]), 3, { lip: 2, lit: '#7a6a54', col: '#0e0a06' }); // the pinched dent
  f.part(hF([[-0.42, -0.3], [0.38, -0.32], [0.39, -0.22], [-0.43, -0.2]]), { fill: '#2a2018', shade: 0.4, inkW: 1.2, cast: false }); // band
  const br = f.part(hF([[-0.74, -0.12], [-0.5, -0.3], [0.0, -0.34], [0.5, -0.3], [0.78, -0.16], [0.8, -0.04], [0.56, -0.12], [0.2, -0.18], [-0.2, -0.16], [-0.6, -0.04], [-0.8, 0.06]]), { fill: '#46382a', shadow: '#0e0a06', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, cast: true, castOp: 0.5 });
  f.line(hF([[-0.7, -0.08], [-0.2, -0.2], [0.4, -0.22], [0.76, -0.1]]), 1.6, '#8a7a62', { op: 0.5 }); // the worn edge
  X.holes(f, hF([[0.6, -0.14]])[0], 6, 3, 1, { r0: 3, r1: 6 });
  const fq0 = hF([[-0.36, -0.28]])[0];
  X.plume(f, [fq0, add(fq0, [-30, -60]), add(fq0, [-80, -110]), add(fq0, [-130, -136])], 30, { col: '#9a9a92', shadow: '#3a3a36' }); // the heron feather
  // ---- the bundle of tally sticks bound with cord, tucked under the near arm
  f.bone('torso');
  const tb0 = S.at(-0.46, 0.16), tb1 = S.at(0.4, 0.5);
  for (let i = 0; i < 5; i++) X.tally(f, lp(tb0, tb1, -0.1, -20 + i * 10), lp(tb0, tb1, 1.0, -20 + i * 10), 12, 6);
  W.rope(f, [lp(tb0, tb1, 0.3, -30), lp(tb0, tb1, 0.34, 0), lp(tb0, tb1, 0.3, 30)], 3.4, { col: P.ropeD });
  // ---- near arm: held out with the tally stick, as if presenting a bill; puffy hand, rings sunk into the fingers
  X.arm(f, SN, EN, WN, [92, 80, 62], '_n', GW(), { lines: false });
  f.bone('upperarm_n'); X.folds(f, [[lp(SN, EN, 0.2, -30), lp(SN, EN, 0.6, -36)], [lp(SN, EN, 0.4, 30), lp(SN, EN, 0.8, 26)]], 3, { lit: '#7a6448' });
  f.bone('forearm_n'); f.part(limb(lp(EN, WN, 0.46, 0), lp(EN, WN, 0.72, 0), 96, 92, { steps: 4, capK: 0.6 }), { fill: furC, shadow: '#140c06', shade: 0.42, tex: 'moss' + seed, texOp: 0.4, inkW: 1.4 });
  for (let i = 0; i < 8; i++) { const q = lp(EN, WN, 0.46 + f.r() * 0.24, (f.r() - 0.5) * 80); W.hairClump(f, [q, add(q, [2, 10]), add(q, [0, 22])], 7, { n: 2, pal: ['#3a2c1e', '#4a3828'], sheenCol: '#6a5640' }); }
  // ---- the goitre: hanging from under the jaw over the collar onto the chest; mottled bile green and brown, pustuled,
  // a ring of small toadstools at its base, the pewter chain of office sunk into its folds
  f.bone('goitre');
  const gc = add(HC, [96, 236]);
  const gP = [hF([[-0.24, 0.38]])[0], hF([[0.1, 0.56]])[0], hF([[0.3, 0.6]])[0], add(gc, [96, -60]), add(gc, [128, 10]), add(gc, [136, 80]), add(gc, [110, 136]), add(gc, [40, 160]), add(gc, [-40, 150]), add(gc, [-96, 104]), add(gc, [-112, 30]), add(gc, [-100, -50])];
  const gD = f.part(gP, SK({ fill: mix(skin, P.bileD, 0.14), shadow: '#22160a', cast: true, castOp: 0.5, k: 0.9, texOp: 0.5 }));
  X.swelling(f, gD, E.bbox(gP), add(gc, [10, 30]), { lit: '#d8b888', mottle: '#3a2410', vein: '#3a4a12', veins: 9, seed: 23, dark: 0.6 });
  W.stains(f, gD, E.bbox(gP), P.bileD, 0.018, 4.4, -2.2, 71, 0.38, 3); // bile-green mottling in patches
  for (let i = 0; i < 4; i++) W.crease(f, [add(gc, [-100 + i * 10, -30 + i * 34]), add(gc, [-20, -20 + i * 36]), add(gc, [70 - i * 10, -40 + i * 40])], 4, { lip: 3, lit: '#c8b07a', col: '#14100a', op: 0.6 }); // folds of the hanging skin
  for (let i = 0; i < 12; i++) W.pustule(f, W.scatter(f, add(gc, [30, 40]), 80, 70), 5 + f.r() * 6, { burst: f.r() < 0.3, col: mix(P.bile, skin, 0.45) });
  // the pewter chain of office: links lying over the goitre and sunk into its folds
  const ch = [add(gc, [-118, -30]), add(gc, [-80, 30]), add(gc, [-10, 64]), add(gc, [60, 60]), add(gc, [120, 20])];
  for (let i = 0; i < 18; i++) { const t = i / 17, k = Math.min(3, Math.floor(t * 4)), q = lerp(ch[k], ch[k + 1], t * 4 - k); if (i === 7 || i === 8) continue; f.part(ell(q, 9, 6, ang(ch[k], ch[k + 1]) + (i % 2) * 1.2, 10), { fill: '#8a8a84', shadow: '#3a3a36', shade: 0.4, inkW: 1.1, cast: false, hatch: false }); }
  f.part(ell(add(gc, [-10, 76]), 22, 24, 0.1, 12), { fill: '#8a8a84', shadow: '#3a3a36', shade: 0.42, inkW: 1.4, cast: false }); f.line(ell(add(gc, [-10, 76]), 14, 16, 0.1, 12).slice(0, 8), 1.4, '#2a2a26', { op: 0.7 }); f.flat(ell(add(gc, [-14, 72]), 5, 5, 0, 6), '#c8c8c0', { op: 0.5 }); // the badge
  W.toadstools(f, hF([[-0.16, 0.5]])[0], -2.2, 30, 3); W.toadstools(f, hF([[0.26, 0.6]])[0], -0.7, 26, 2);

  f.bone('tally');
  const ts0 = add(WN, [16, -150]), ts1 = add(WN, [10, 70]);
  X.tally(f, ts1, ts0, 22, 14);
  f.bone('hand_n');
  const tg = B.grip(f, WN, EN, ang(ts1, ts0), 56, skin, { shadow: '#2a1a10', tex: 'wrinkle' + seed, texOp: 0.6, name: 'reeve tally' });
  for (const k of [-0.3, 0.0]) { const q = tg.F([[0.5, k]])[0]; f.part(ell(q, 6, 11, tg.ang, 8), { fill: '#7a7a72', shadow: '#2a2a26', shade: 0.4, inkW: 1, cast: false }); f.line([add(q, [-4, -6]), add(q, [-4, 6])], 2, '#3a2a1a', { op: 0.7 }); } // rings sunk in the puffed fingers
  // the thumb on the notches, counting
  W.pustule(f, add(WN, [-10, 20]), 6, { col: mix(P.bile, skin, 0.4) });

  f.bone('root');
  for (const [a, w] of [[AN, 90], [AF, 80]]) f.flat(ell(add(a, [40, gy - a[1]]), w, 9, 0, 14), P.waterL, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE MIDDEN SOW (elite, 1.8 at the shoulder, 2.4 long)
// The sow kept in the pen beneath the stilt houses, fed on what fell through the floorboards; ripened to the size of an
// ox. A huge old sow in side view, 2.4 long from the snout disc to the ham (about 1540 px), so per the director's ruling
// she breaks the side of the elite frame: her canvas is 1700 wide (elite height 1400, ground at h - 30). The hide stands
// about 1.4 at the withers and the fungus crest takes the shoulder to 1.8. A long heavy barrel sagging between the shoulder
// and the ham, a deep belly with two rows of teats, short thick legs with knees and hocks, cloven trotters sunk in mud,
// head low and forward, the weight on the forelegs. Toxin has pushed her back hard: the spine is a raised ridge of hide
// that a crest of bracket fungus and puffballs grows out of, layered like shingles and sweating spores; the flanks swell
// with pustules and sores. Water has tanned the hide to brown leather; the bristles are clumped into wet tufts.
// Rig (its own): spine_1 (root, hindquarters) > spine_2 (barrel and forequarters) > neck > head > jaw, ear_n, ear_f, chain;
// spine_1 > tail, pen; legs leg_fn/ff/hn/hf _1.._3 (forelegs on spine_2, hind on spine_1). The legs are drawn under the
// body, so a leg that swings keeps its top hidden under the belly.
// Motion: idle rooting in the mud, the ridge shedding a haze of spores; attack a heavy charge that scatters the front
// rank, spores bursting from the ridge on impact.
function middenSow() {
  const CW = 1700, CH = TIERS.elite[1];
  const f = new Fig(W.base(223, CH, { grimeY: 1120 }));
  W.textures(f);
  const seed = 223, gy = CH - 30;
  const hide = '#634631', hideD = '#3a2818', hideL = '#967050', belly = '#74543c', teat = '#6e4636';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#26170c', shade: 0.36, maxShade: 40, tex: 'leather' + seed, texOp: 0.45, light: hideL }, o);
  const brPal = ['#160e08', '#24180e', '#3a2a1a'];
  const bristle = (p, d, l, w = 7) => { const q = add(p, mul(d, l)), m = add(lerp(p, q, 0.5), [(f.r() - 0.5) * l * 0.2, l * 0.1]); W.hairClump(f, [p, m, q], w, { n: 2, pal: brPal, sheenCol: '#5a4430' }); };
  // ---- joints
  const LEG = {
    fn: { K: [1032, 1070], A: [1046, 1232], F: [1058, 1300], T: [1080, gy] },
    ff: { K: [952, 1060], A: [958, 1226], F: [970, 1296], T: [990, gy - 6] },
    hn: { K: [352, 1010], A: [276, 1214], F: [296, 1298], T: [326, gy] },
    hf: { K: [446, 1000], A: [382, 1208], F: [400, 1294], T: [428, gy - 6] },
  };
  const HIP = { hn: [300, 790], hf: [380, 780] }, SH = { fn: [1040, 860], ff: [980, 850] };
  const poll = [1180, 620], HA = 0.62, HS = 1.1, hF = pts => pts.map(p => { const q = [poll[0] + p[0] * Math.cos(HA) * HS, poll[1] + p[0] * Math.sin(HA) * HS + p[1] * HS]; return p[2] ? [q[0], q[1], 1] : q; }), h1 = (u, v) => hF([[u, v]])[0], hinge = h1(300, 150);
  f.joint('spine_1', [330, 760]).joint('spine_2', [700, 720], 'spine_1').joint('neck', [1090, 680], 'spine_2').joint('head', poll, 'neck').joint('jaw', hinge, 'head');
  f.joint('ear_n', h1(0, -44), 'head').joint('ear_f', h1(0, -50), 'head').joint('chain', h1(526, 96), 'head').joint('tail', [112, 612], 'spine_1').joint('pen', [600, 640], 'spine_1');
  for (const [k, L] of Object.entries(LEG)) { const fr = k[0] === 'f'; f.joint(`leg_${k}_1`, fr ? SH[k] : HIP[k], fr ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }

  // ---- a leg: the upper bone (arm or thigh) mostly inside the body, a heavy forearm or gaskin, the knee or the hock as a
  // bony knob, a short thick cannon, a sloped pastern and the cloven trotter with dew claws; mud caked to the knee
  const leg = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.38 : 0, col = mix(hide, '#000', tone), look = HD({ fill: col, maxShade: 24 });
    const top = front ? SH[k] : HIP[k];
    f.bone(`leg_${k}_1`); // the upper arm or thigh, under the body; shows only when the leg swings
    f.part(limb(top, L.K, front ? 150 : 190, front ? 120 : 130, { steps: 10, capK: 0.9 }), Object.assign({}, look, { inkW: 1.2, inkHeavy: 1.4, cast: false }));
    // the cannon, the pastern and the trotter first, so the knee or hock of the bone above overlaps its top
    f.bone(`leg_${k}_3`);
    const pt = [L.T[0] - 4, gy - 58], X0 = u => L.T[0] + u * 38;
    const cd = f.part(K.chain([lerp(L.A, L.F, -0.25), L.F, pt, [pt[0] + 4, gy - 30]], [84, 74, 66, 64], { steps: 6 }), look);
    // mud caked from the trotter to the knee: a soft dark wet band rising up the leg, blotched with dried crust, clods
    W.softTone(f, cd, [[[add(L.A, [-80, 40 + (f.r() - 0.5) * 30]), add(L.A, [0, 10]), add(L.A, [80, 30 + (f.r() - 0.5) * 30]), [L.T[0] + 80, gy], [L.T[0] - 80, gy]], far ? '#140e08' : '#2a1e12', 0.85, 10]]);
    W.stains(f, cd, [L.T[0] - 90, L.A[1], L.T[0] + 90, gy], '#6a5640', 0.04, 4.4, -2.5, 41 + k.charCodeAt(1), 0.6, 3); // dried paler crust
    for (let i = 0; i < 4; i++) { const q = W.scatter(f, lerp(L.A, L.F, 0.7), 20, 26); f.line([q, add(q, [(f.r() - 0.5) * 14, 9 + f.r() * 8]), add(q, [(f.r() - 0.5) * 20, 16 + f.r() * 10])], 1.2, '#0a0604', { op: 0.7 }); } // cracks in it
    // dew claws behind the fetlock, the cloven trotter: two toes with the cleft between, the front one longer
    for (const dx of [-0.9, -1.25]) f.part(ell([X0(dx), L.F[1] + 32], 13, 9, 0.6, 8), { fill: '#241a12', shadow: '#060402', shade: 0.4, inkW: 1.1, cast: false, light: '#5a4a38' });
    f.part([[X0(-1.2), gy - 4, 1], [X0(-1.12), gy - 46], [X0(-0.3), gy - 60], [X0(0.08), gy - 54], [X0(0.12), gy - 4, 1]], { fill: '#2a2018', shadow: '#0a0806', shade: 0.4, inkW: 1.4, cast: false, light: '#5e4e3a', tex: 'leather' + seed, texOp: 0.3 });
    f.part([[X0(0.0), gy - 4, 1], [X0(-0.08), gy - 56], [X0(0.6), gy - 52], [X0(1.2), gy - 16], [X0(1.26), gy - 4, 1]], { fill: '#30261c', shadow: '#0a0806', shade: 0.4, inkW: 1.4, cast: false, light: '#6a5a44', tex: 'leather' + seed, texOp: 0.3 });
    f.line([[X0(0.03), gy - 8], [X0(-0.02), gy - 52]], 2.6, '#060402');
    f.line([[X0(0.3), gy - 44], [X0(0.9), gy - 22]], 1.4, '#8a7a5e', { op: 0.5 }); // the worn horn
    W.mudSplats(f, [L.T[0], gy - 40], 50, 14, 8, far ? '#1e160c' : '#33261a'); // mud clods on the trotter
    f.bone(`leg_${k}_2`);
    const ld = f.part(limb(L.K, L.A, front ? 140 : 150, front ? 94 : 82, { steps: 12, capK: 0.9, p: front ? [[0.2, 0.06, 0.2]] : [[0.18, 0.2, 0.16]], q: front ? [[0.22, 0.18, 0.18], [0.92, 0.12, 0.08]] : [[0.3, 0.06, 0.2]] }), look);
    W.softTone(f, ld, [[[lp(L.K, L.A, 0, 70), lp(L.K, L.A, 1, 50), lp(L.K, L.A, 1, 14), lp(L.K, L.A, 0, 20)], '#0a0604', 0.45, 10], [[lp(L.K, L.A, 0.05, -50), lp(L.K, L.A, 0.6, -36), lp(L.K, L.A, 0.6, -14), lp(L.K, L.A, 0.05, -20)], '#e8c49a', 0.22, 8], [[lp(L.K, L.A, 0.72 + (f.r() - 0.5) * 0.1, -80), lp(L.K, L.A, 0.8 + (f.r() - 0.5) * 0.1, 80), lp(L.K, L.A, 1.3, 80), lp(L.K, L.A, 1.3, -80)], far ? '#140e08' : '#2a1e12', 0.8, 10]]); // the mud rising to the knee
    W.mudSplats(f, lp(L.K, L.A, 0.62, 0), 40, 30, 10, far ? '#1e160c' : '#33261a');
    W.creaseField(f, lp(L.K, L.A, 0.15, 0), 34, 16, 3, 0.15, 60, 2.6, { lip: 2, lit: '#a07a54', col: '#140c06' }); // the skin folds where the leg leaves the body
    if (front) { // the knee (carpus): a bony knob with wrinkled, muddy skin over it
      W.softTone(f, ld, [[ell(add(L.A, [20, -10]), 26, 22, 0, 10), '#d8b088', 0.25, 6], [ell(add(L.A, [-14, 14]), 30, 16, 0, 10), '#0a0604', 0.4, 6]]); f.line([add(L.A, [44, -30]), add(L.A, [50, -4]), add(L.A, [42, 24])], 2, '#140c06', { op: 0.55 }); // the bony front of the knee
      for (let i = 0; i < 3; i++) W.crease(f, [add(L.A, [-28, -14 + i * 12]), add(L.A, [4, -10 + i * 12]), add(L.A, [32, -16 + i * 12])], 2.4, { lip: 1.8, lit: '#8a6a4c', col: '#140c06' });
    } else { // the hock: the point of the hock behind, the cord running up into the gaskin
      W.softTone(f, ld, [[ell(add(L.A, [-30, -14]), 18, 22, 0, 10), '#d8b088', 0.22, 6]]); // the point of the hock
      f.line([lp(L.K, L.A, 0.35, 44), lp(L.K, L.A, 0.85, 34), add(L.A, [-44, -30])], 2.4, '#140c06', { op: 0.6 });
      for (let i = 0; i < 3; i++) W.crease(f, [add(L.A, [-20, -26 + i * 14]), add(L.A, [8, -20 + i * 14]), add(L.A, [28, -26 + i * 14])], 2.2, { lip: 1.8, lit: '#8a6a4c', col: '#140c06' });
    }
  };
  // far legs first, then the near legs, all under the body so the body hides where each leg goes in
  leg('hf', true); leg('ff', true);
  // the far row of teats, behind the near legs and the belly
  f.bone('spine_2');
  for (let i = 0; i < 6; i++) { const x = 470 + i * 84, c = [x + 20, 1128 - Math.abs(i - 2.6) * 10]; f.part(K.chain([c, add(c, [4, 26]), add(c, [0, 40])], [26, 22, 14], { steps: 4 }), HD({ fill: mix(teat, '#000', 0.4), cast: false, inkW: 1.1, maxShade: 6 })); }
  leg('hn', false); leg('fn', false);
  // ---- the near row of teats hanging swollen along the belly
  f.bone('spine_2');
  for (let i = 0; i < 6; i++) { const x = 450 + i * 84 + (f.r() - 0.5) * 20, sz = 1.05 + f.r() * 0.4, top = [x, 1150 - Math.abs(i - 2.4) * 9 + (i === 5 ? -14 : 0)]; const td = f.part(limb(add(top, [0, -10]), add(top, [-5, 52 * sz]), 40 * sz, 18 * sz, { steps: 8, capK: 0.9, p: [[0.62, 0.22, 0.14]], q: [[0.62, 0.22, 0.14]] }), HD({ fill: mix(teat, hide, 0.3), cast: false, inkW: 1.2, inkHeavy: 1.6, maxShade: 6 })); W.crease(f, [add(top, [-12, 10]), add(top, [-2, 14]), add(top, [10, 10])], 1.6, { lip: 1, lit: '#b08070', col: '#1a0a06' }); f.flat(ell(add(top, [-5, 56 * sz]), 7 * sz, 4 * sz, 0, 8), '#2a120c', { op: 0.85 }); }

  // the tail: a thin kinked rope hanging plumb off the rump, a matted tuft at the end
  f.bone('tail');
  f.part(K.chain([[118, 606], [82, 640], [70, 690], [80, 730], [66, 790]], [28, 20, 15, 12, 10], { steps: 5 }), HD({ cast: false, maxShade: 6 }));
  W.hairClump(f, [[66, 784], [60, 816], [68, 852]], 16, { n: 3, pal: brPal });

  // ---- the body, one outline: the ham, the long barrel sagging between ham and shoulder, the deep belly, the shoulder,
  // the thick neck running into the jowl. The masses are modelled inside by tone and folds, not by separate shapes.
  // consistency pass 2026-11-25 (the hide read smooth and blocky): the back now sags between ham and shoulder, the ham
  // domes, the belly hangs deeper, and the outline is loosened by the old hide's wrinkles (a local random stream, so the
  // rest of the figure is unchanged)
  const rS = E.rng(2231);
  const body0 = [[118, 590], [190, 548], [270, 532], [360, 540], [470, 560], [610, 586], [720, 584], [820, 550], [920, 508], [1010, 482], [1106, 492], [1186, 540], [1252, 610], [1296, 720], [1314, 860], [1300, 990], [1262, 1068], [1190, 1100], [1120, 1094], [1066, 1112], [960, 1148], [820, 1190], [680, 1200], [540, 1178], [430, 1124], [356, 1078], [270, 1080], [176, 1036], [112, 950], [80, 830], [86, 700]];
  const body = []; body0.forEach((q, i) => { const r = body0[(i + 1) % body0.length]; body.push(q); const L = E.len(sub(r, q)), m = Math.max(1, Math.round(L / 46)); const d = E.norm(sub(r, q)), nn = [d[1], -d[0]]; for (let k = 1; k < m; k++) { const t = k / m; body.push(add(lerp(q, r, t), mul(nn, (rS() - 0.45) * 9))); } });
  const cut1 = [700, 720], cut2 = [1150, 760];
  split(f, () => {
    const d = f.part(body, HD({ k: 0.9, maxShade: 80, shade: 0.4, castOp: 0.5 }));
    const bb = [70, 470, 1320, 1190];
    W.stains(f, d, bb, '#22140a', 0.006, 4.0, -1.9, 81, 0.7, 4); // big tanning blotches
    W.stains(f, d, bb, '#b08660', 0.016, 4.2, -2.6, 91, 0.28, 3); // worn paler leather
    W.stains(f, d, bb, '#120a06', 0.05, 4, -2.7, 83, 0.35, 3);
    W.softTone(f, d, [
      [[[90, 900], [300, 1000], [600, 1080], [900, 1060], [1180, 1000], [1250, 1100], [800, 1200], [300, 1100]], '#0a0604', 0.75, 40], // the belly turning under
      [[[140, 590], [300, 560], [370, 640], [330, 800], [200, 780], [130, 700]], '#f0c89a', 0.38, 44], // the lit dome of the ham
      [[[400, 700], [470, 690], [480, 1040], [420, 1080]], '#0a0604', 0.5, 30], // the hollow of the flank in front of the ham
      [[[80, 820], [140, 840], [180, 1040], [100, 980]], '#0a0604', 0.5, 30], // the back of the ham turning away
      [[[500, 600], [880, 580], [900, 640], [520, 680]], '#0a0604', 0.22, 30], // the sag of the back between ham and shoulder
      [[[620, 600], [900, 540], [1060, 520], [1000, 600], [760, 640]], '#f0c89a', 0.22, 40], // the lit back
      [[[960, 540], [1090, 520], [1130, 720], [1060, 860], [980, 760]], '#f0c89a', 0.34, 34], // the shoulder
      [[[360, 620], [430, 640], [440, 1000], [380, 1060], [330, 900]], '#0a0604', 0.45, 26], // where the ham turns into the flank
      [[[880, 640], [930, 650], [960, 1020], [900, 1080], [860, 900]], '#0a0604', 0.4, 30], // behind the shoulder
      [[[1200, 900], [1300, 960], [1280, 1080], [1180, 1090]], '#0a0604', 0.4, 30], // the throat under the jowl
      [[[480, 760], [760, 740], [820, 900], [520, 940]], '#f0c89a', 0.1, 50], // the swell of the barrel
    ]);
    // folds: the ham's front edge, the flank fold to the stifle, the shoulder blade, the elbow, the sag of the barrel,
    // fat rolls on the neck behind the ears and the halter's old rope burn
    W.crease(f, [[360, 640], [400, 760], [404, 900], [380, 1010]], 4, { lip: 3, lit: '#c09a70', col: '#140c06', op: 0.45 });
    W.crease(f, [[410, 1000], [440, 1060], [470, 1110]], 4, { lip: 3, lit: '#c09a70', col: '#140c06' });
    W.crease(f, [[940, 640], [962, 760], [996, 880]], 4, { lip: 3, lit: '#c09a70', col: '#140c06', op: 0.45 });
    W.creaseField(f, [1040, 1050], 50, 26, 5, 0.3, 70, 3.2, { lip: 2.6, lit: '#c09a70', col: '#140c06' });
    for (let i = 0; i < 4; i++) W.crease(f, [[480 + i * 110, 1000 + i * 6], [540 + i * 110, 1030 + i * 4], [600 + i * 110, 1020 + i * 6]], 3.4, { lip: 2.6, lit: '#c09a70', col: '#140c06', op: 0.6 }); // fat folds of the sagging belly
    W.creaseField(f, [700, 1120], 220, 26, 10, 0.05, 80, 2.8, { lip: 2.2, lit: '#c09a70', col: '#140c06' });
    for (let i = 0; i < 5; i++) W.crease(f, [[1150 + i * 18, 560 + i * 12], [1190 + i * 16, 700 + i * 30], [1196 + i * 14, 860 + i * 40]], 3.6, { lip: 2.8, lit: '#c09a70', col: '#140c06', op: 0.7 }); // the fat rolls of the neck
    W.crease(f, [[1110, 500], [1150, 640], [1180, 800], [1196, 960]], 8, { lip: 3, lit: '#caa080', col: '#3a1a10', op: 0.65 }); // the halter's rope burn, a scarred band
    f.line([[1118, 520], [1156, 650], [1188, 820]], 1.6, '#c8a088', { op: 0.5 });
    W.crease(f, [[430, 1000], [600, 1050], [800, 1058], [960, 1020], [1040, 990]], 4.4, { lip: 3.4, lit: '#c09a70', col: '#140c06', op: 0.55 }); // the long fold where the belly hangs off the barrel
    W.creaseField(f, [700, 820], 300, 160, 26, 0.1, 50, 1.8, { lip: 1.4, lit: '#b08a64', col: '#1a100a', spread: 0.6 }); // the loose old hide wrinkling
    for (let i = 0; i < 160; i++) { const p = W.scatter(f, [680, 820], 600, 330); if (!X.inside(body, p)) continue; const a2 = 1.9 + (f.r() - 0.5) * 0.6; f.line([p, add(p, rot([5 + f.r() * 7, 0], a2))], 1.1, f.r() > 0.3 ? '#1a100a' : '#8a6a4a', { op: 0.6 }); } // sparse coarse hairs lying down the hide
    const clipB = fn => { const id = f.id('cb'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(body, true, 0.9)}"/></clipPath>`); const i0 = f.out.length; fn(); const inner = f.out.splice(i0).join('\n'); f.out.push(`<g clip-path="url(#${id})">${inner}</g>`); };
    // (consistency pass) the hide itself: thick old skin hanging in loose wrinkles over the barrel and the ham, deep
    // creases at the elbow and the stifle, bare mangy patches, scabbed cracks, bristle tufts, a crust of dried wallow mud
    for (let i = 0; i < 38; i++) { const p = [200 + rS() * 1000, 640 + rS() * 440]; if (!X.inside(body, p)) continue; const a2 = 1.45 + (rS() - 0.5) * 0.7, l = 30 + rS() * 60, d = rot([1, 0], a2), m = add(p, mul(d, l * 0.5)); W.crease(f, [p, add(m, [(rS() - 0.5) * 12, 0]), add(p, mul(d, l))], 2 + rS() * 2.6, { lip: 2, lit: '#b08a64', col: '#140c06', op: 0.5 + rS() * 0.25 }); }
    for (let i = 0; i < 9; i++) { const c = [260 + rS() * 880, 640 + rS() * 340]; if (!X.inside(body, c)) continue; const r = 18 + rS() * 30, pts = ell(c, r * 1.4, r, rS() * 3, 14).map(q => add(q, [(rS() - 0.5) * r * 0.5, (rS() - 0.5) * r * 0.5])); f.flat(pts, '#8a6a58', { op: 0.42 }); f.line(pts.concat([pts[0]]), 1.2, '#2a1a10', { op: 0.35 }); for (let j = 0; j < 4; j++) { const q = add(c, [(rS() - 0.5) * r * 1.6, (rS() - 0.5) * r]); f.flat(ell(q, 2 + rS() * 3, 1.6 + rS() * 2, 0, 6), '#3a1a10', { op: 0.7 }); } } // mange: bare grey-pink skin, scabbed
    for (let i = 0; i < 7; i++) { const c = [300 + rS() * 800, 680 + rS() * 300]; if (!X.inside(body, c)) continue; const pts = [c]; let q = c; for (let j = 0; j < 4; j++) { q = add(q, rot([10 + rS() * 14, 0], rS() * 6.28)); pts.push(q); } f.line(pts, 2.4, '#2a0e08', { op: 0.75 }); f.line(pts.map(v => add(v, [-1, -1.4])), 0.9, '#c8a080', { op: 0.5 }); } // scabbed cracks
    for (let i = 0; i < 26; i++) { const x = 160 + i * 42 + rS() * 20; let y = 0; for (let k = 0; k < body0.length - 1; k++) { if (body0[k][0] <= x && body0[k + 1][0] > x && body0[k][1] < 800) { y = lerp(body0[k], body0[k + 1], (x - body0[k][0]) / (body0[k + 1][0] - body0[k][0]))[1]; break; } } if (!y) continue; const b0 = [x, y + 6]; for (let j = 0; j < 4; j++) f.line([b0, add(b0, [(j - 1.5) * 3 + (rS() - 0.5) * 4, -10 - rS() * 12])], 1.3, j % 2 ? '#1a100a' : '#5a4030', { op: 0.85 }); } // bristle tufts along the back line
    { const mc = []; for (let x = 180; x <= 1240; x += 40) mc.push([x, 1010 + Math.sin(x * 0.02) * 18 + rS() * 16 - (x > 1100 ? (x - 1100) * 0.5 : 0) - (x < 300 ? (300 - x) * 0.3 : 0)]); const crust = [...mc, [1240, 1220], [180, 1220]]; clipB(() => { f.raw(`<path d="${E.smooth(crust, true, 0.9)}" fill="#2e2014" opacity="0.42" filter="url(#cast${seed})"/>`); f.flat(crust, '#3a2a1a', { op: 0.22 }); for (let i = 0; i < 16; i++) { const p = [200 + rS() * 1020, 1040 + rS() * 110]; f.line([p, add(p, [8 + rS() * 14, (rS() - 0.5) * 10]), add(p, [14 + rS() * 18, 6 + rS() * 8])], 1.2, '#140a06', { op: 0.7 }); } }); } // dried wallow mud crusting the belly, cracked
    // ripe blisters and sores on the flanks (toxin), drawn into the hide
    for (let i = 0; i < 22; i++) { const p = W.scatter(f, [640, 860], 520, 220); if (!X.inside(body, p) || p[1] > 1120) continue; W.pustule(f, p, 6 + f.r() * 12, { burst: f.r() < 0.3, col: mix(P.bile, hide, 0.3) }); }
    for (const [c, r] of [[[560, 800], 22], [[250, 860], 18], [[820, 960], 16]]) { f.flat(ell(c, r, r * 0.7, 0.3, 12).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 6]) : q), '#4a2014', { op: 0.9 }); f.flat(ell(add(c, [2, 2]), r * 0.6, r * 0.4, 0.3, 10), '#1a0806'); X.mouldFur(f, ell(c, r * 1.1, r * 0.8, 0.3, 8).slice(0, 5), 10, { n: 10, blob: false }); f.flat(ell(add(c, [r * 0.3, -r * 0.3]), r * 0.2, r * 0.1, 0, 6), '#e8d0a0', { op: 0.5 }); } // open sores, wet, mould round the rims
    // mud splashed up the belly and the ham from the wallow
    W.mudSplats(f, [700, 1130], 360, 40, 30, P.peatD); W.mudSplats(f, [200, 1000], 100, 60, 14, P.peatD);
    // leeches fat on the belly
    for (const [a, b] of [[[600, 1150], [630, 1176]], [[760, 1140], [792, 1168]], [[400, 1100], [420, 1132]]]) X.leech(f, [a, lerp(a, b, 0.5), b], 24, { sucker: true, fat: true });
  }, [['spine_1', side(cut1, [-1, 0], 140)], ['spine_2', [side(cut1, [1, 0], 140), side(cut2, [-1, 0.3], 120)]], ['neck', side(cut2, [1, -0.3], 120)]]);

  // ---- the hag's twine charm against sickness round the near foreleg
  f.bone('leg_fn_2');
  { const L = LEG.fn; W.rope(f, [lp(L.K, L.A, 0.42, 50), lp(L.K, L.A, 0.46, 0), lp(L.K, L.A, 0.42, -48)], 3.4, { col: P.ropeD }); W.rope(f, [lp(L.K, L.A, 0.5, 46), lp(L.K, L.A, 0.54, 0), lp(L.K, L.A, 0.5, -44)], 3, { col: P.ropeD }); X.frogCharm(f, lp(L.K, L.A, 0.5, -10), 40, { s: 1.3, n: 2 }); }

  // ---- the wattle pen panel tangled on the near flank where she broke out: a torn corner of a woven hurdle, the stakes
  // snapped, the withies sprung loose, hanging from a cord caught over the ridge
  f.bone('pen');
  { const pF = frame([560, 880], -0.32, 1);
    const stakes = [[-150, -110, 110], [-80, -128, 96], [-10, -136, 120], [60, -120, 70], [126, -96, 30]];
    for (const [u, v0, v1] of stakes) { const a = pF([[u, v0]])[0], b = pF([[u + 6, v1]])[0]; f.part(limb(a, b, 16, 14, { steps: 6, capK: 0.4 }), { fill: '#5e4c32', shadow: '#1e160c', shade: 0.42, maxShade: 6, inkW: 1.2, cast: true, castOp: 0.35, tex: 'wood' + seed, texOp: 0.5 }); f.line([b, add(b, rot([10, 0], -1.2)), add(b, rot([14, 6], -0.4))], 2, '#c8b088', { op: 0.7 }); } // stakes, the lower ends snapped to pale splinters
    for (let r = 0; r < 4; r++) { const y = -96 + r * 40, pts = []; for (let i = 0; i <= 8; i++) { const u = -170 + i * 40 - r * 6; if (u > 140 - r * 34) break; pts.push(pF([[u, y + ((i + r) % 2 ? 7 : -7)]])[0]); } if (pts.length > 2) { f.line(pts, 11, '#1a120a'); f.line(pts, 8, '#5e4a30'); f.line(pts.map(q => add(q, [1, -2])), 2, '#a48a5e', { op: 0.6 }); } }
    for (const [u, v, a, l] of [[120, -70, -0.3, 70], [90, -10, 0.5, 60], [-170, 0, 2.6, 50], [40, 64, 1.0, 54]]) { const q = pF([[u, v]])[0], e = add(q, rot([l, 0], a - 0.32)); f.line([q, lerp(q, e, 0.5), e], 7, '#1a120a'); f.line([q, lerp(q, e, 0.5), e], 4.6, '#7a6442'); f.line([e, add(e, rot([8, 3], a))], 2.4, '#d0b88e'); } // withies sprung loose
    X.mouldFur(f, [pF([[-160, 110]])[0], pF([[60, 90]])[0]], 12, { n: 16, blob: false });
    W.rope(f, [pF([[-80, -130]])[0], [500, 650], [540, 560]], 3.4, { col: P.ropeD }); }
  // ---- three broken pitchfork tines in the shoulder where the village tried, rust weeping, the hide puckered round them
  f.bone('spine_2');
  for (const [a, b] of [[[1010, 700], [1080, 640]], [[1040, 740], [1116, 694]], [[1004, 780], [1064, 744]]]) { f.flat(ell(a, 13, 9, -0.6, 10), '#2a0e08'); W.crease(f, [add(a, [-14, -8]), add(a, [-4, -12]), add(a, [6, -10])], 2, { lip: 1.4, lit: '#c09a70', col: '#140c06' }); f.flat([add(a, [-6, 4]), add(a, [6, 4]), add(a, [4, 64]), add(a, [-2, 58])], '#6a2a14', { op: 0.6 }); f.line([a, b], 10, '#140e0a'); f.line([a, b], 6, P.ironL); f.line([lerp(a, b, 0.2), lerp(a, b, 0.9)], 1.6, '#9a9286', { op: 0.6 }); f.flat(ell(b, 4, 3, 0, 6), '#7a3c20', { op: 0.8 }); }
  // ---- the peat sod plastered on the rump
  f.bone('spine_1');
  { const sd = [200, 650]; f.part([add(sd, [-44, -30]), add(sd, [40, -46]), add(sd, [66, 10]), add(sd, [20, 54]), add(sd, [-40, 40])], { fill: P.peat, shadow: '#120c06', shade: 0.45, maxShade: 12, tex: 'peat' + seed, texOp: 0.95, inkW: 1.3, k: 0.6 }); W.mossClump(f, add(sd, [10, -34]), 34, 10); for (let i = 0; i < 4; i++) f.line([add(sd, [-30 + i * 22, 44]), add(sd, [-28 + i * 22, 64 + f.r() * 20])], 1.4, '#2a1e12', { op: 0.8 }); }

  // ---- the ridge: the spine stands up as a crest of hide, split where the fungus has broken through it; bracket shelves
  // grow out of it in tiers like shingles, from the withers to the rump, with puffballs among them, sweating spores
  const ridge = [[150, 566], [260, 540], [380, 534], [500, 546], [620, 552], [740, 530], [860, 498], [960, 476], [1060, 474]];
  const rAt = t0 => { const t = Math.max(0, Math.min(1, t0)), k = Math.min(ridge.length - 2, Math.floor(t * (ridge.length - 1))), u = t * (ridge.length - 1) - k; return lerp(ridge[k], ridge[k + 1], u); };
  const RQ = { spine_1: [], spine_2: [] }, onRidge = (t, fn) => RQ[rAt(t)[0] < cut1[0] ? 'spine_1' : 'spine_2'].push(fn); // queued per bone, so the crest is one layer per spine bone
  // the hide crest the shelves root in: a raised wrinkled ridge with the hide split open along it
  for (let s = 0; s < 2; s++) {
    f.bone(s ? 'spine_2' : 'spine_1');
    const seg = ridge.filter(q => s ? q[0] >= cut1[0] - 130 : q[0] <= cut1[0] + 130);
    const top = seg.map((q, i) => add(q, [0, -30 - Math.sin(i * 1.3) * 8])), bot = seg.map(q => add(q, [0, 30])).reverse();
    const cd = f.part([...top, ...bot], HD({ fill: mix(hide, hideD, 0.3), cast: false, k: 0.9, maxShade: 10 }));
    W.stains(f, cd, E.bbox([...top, ...bot]), '#e0dcc4', 0.03, 4.4, -2.6, 61 + s, 0.35, 3); // mycelium bloom in the split
    for (let i = 0; i < seg.length - 1; i++) f.line([add(seg[i], [0, -6]), add(lerp(seg[i], seg[i + 1], 0.5), [0, 4]), add(seg[i + 1], [0, -4])], 3, '#140804', { op: 0.85 });
  }
  // a bracket shelf on the side of the crest: a fan growing out of it, the attachment along the top (hidden under the
  // shelf above), the lobed margin curving down toward the viewer; the top surface zoned in bands parallel to the margin
  // (peat brown, ochre, bile), a thick pale growing margin, and under it a thin crescent of the pored underside
  const shelf = (c, w, a, col) => {
    const F = frame(c, a, 1), h = w * (0.38 + f.r() * 0.12), nl = 2 + Math.floor(f.r() * 2);
    const arc = (k, dy = 0) => { const r = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12, lobe = 1 + 0.07 * Math.sin(t * nl * 2 + c[0]); r.push([-Math.cos(t) * w * 0.5 * k * lobe, Math.sin(t) * h * k * lobe + dy]); } return r; };
    f.flat(F(ell([w * 0.06, h * 0.9], w * 0.46, h * 0.36, 0, 12)), '#0a0604', { op: 0.4 }); // the shadow it throws on what is below
    f.part(F(arc(1.0, 0).concat(arc(1.0, w * 0.07).reverse())), { fill: '#a49878', shadow: '#5a5038', shade: 0.4, maxShade: 4, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false }); // the underside's crescent
    const d = f.part(F([[-w * 0.5, 0], [0, -h * 0.08], ...arc(1.0).slice().reverse().slice(1)]), { fill: col, shadow: mix(col, '#000', 0.55), shade: 0.3, maxShade: 8, inkW: 1.3, inkHeavy: 2.2, cast: false, k: 0.9 });
    const zc = [mix(col, '#000', 0.45), mix(col, '#d8c89a', 0.3), mix(col, P.bileD, 0.5), mix(col, '#000', 0.3)];
    for (let r = 1; r <= 4; r++) { const k = 1 - r * 0.17; f.line(F(arc(k).slice(1, -1)), Math.max(1.6, w * (0.05 - r * 0.006)), zc[(r + Math.floor(c[0])) % 4], { op: 0.8 }); } // the growth zones
    for (let i = 0; i < 7; i++) { const t = Math.PI * (0.15 + i * 0.7 / 6); f.line(F([[-Math.cos(t) * w * 0.08, Math.sin(t) * h * 0.1], [-Math.cos(t) * w * 0.42, Math.sin(t) * h * 0.82]]), 0.8, mix(col, '#000', 0.5), { op: 0.35 }); } // fibres
    f.line(F(arc(0.97).slice(1, -1)), Math.max(2, w * 0.035), '#d4c8a0', { op: 0.85 }); // the pale growing margin
    if (f.r() < 0.4) f.flat(F(ell([(f.r() - 0.5) * w * 0.4, h * 0.6], 2.4, 3.6, 0, 6)), '#e8e4c8', { op: 0.7 }); // a spore bead
  };
  const puff = (c, r) => { f.part(ell(c, r, r * 0.86, 0, 14).map((p, k) => k % 3 ? p : add(p, mul(sub(p, c), 0.06))), { fill: '#bcb69c', shadow: '#5e5846', shade: 0.42, maxShade: 14, inkW: 1.3, inkHeavy: 2.2, cast: true, castOp: 0.4 }); for (let i = 0; i < 9; i++) f.flat(ell(W.scatter(f, add(c, [0, -r * 0.2]), r * 0.6, r * 0.5), r * 0.07, r * 0.05, 0, 5), '#7a7262', { op: 0.7 }); f.flat(ell(add(c, [r * 0.1, -r * 0.62]), r * 0.2, r * 0.12, 0, 8), '#3a3020'); f.line([add(c, [-r * 0.1, -r * 0.6]), add(c, [r * 0.12, -r * 0.4]), add(c, [r * 0.3, -r * 0.6])], 1.2, '#2a2016', { op: 0.8 }); };
  const shelfCols = [mix(P.peat, P.cap, 0.5), mix(P.cap, P.bileD, 0.45), mix(P.peatL, P.cap, 0.4), mix(P.bileD, P.peat, 0.4), '#7a5a34'];
  // the fungal crest: a lumpy mass of fungus flesh grown out of the split spine, highest over the loin and the withers,
  // its surface shingled with bracket shelves in rows; the top row breaks the outline in a serrated crest
  const hgt = t => 10 + 290 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t * 1.08 - 0.04))), 0.8) * (0.86 + 0.14 * Math.cos(t * 11));
  for (let s2 = 0; s2 < 2; s2++) {
    f.bone(s2 ? 'spine_2' : 'spine_1');
    const ts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; if (s2 ? rAt(t)[0] >= cut1[0] - 120 : rAt(t)[0] <= cut1[0] + 120) ts.push(t); }
    const top = ts.map(t => add(rAt(t), [(f.r() - 0.5) * 10, -hgt(t) * (0.82 + f.r() * 0.12)])), bot = ts.slice().reverse().map(t => add(rAt(t), [0, 20 + 18 * Math.sin(t * 23)]));
    const md = f.part([...top, ...bot], { fill: '#6a5a3e', shadow: '#1e160c', light: '#9a8a64', shade: 0.4, maxShade: 30, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.4, inkHeavy: 2.6, cast: true, castOp: 0.45, k: 0.8 });
    W.stains(f, md, E.bbox([...top, ...bot]), '#d8d4bc', 0.025, 4.4, -2.5, 71 + s2, 0.45, 3); // white mycelium bloom
    W.stains(f, md, E.bbox([...top, ...bot]), P.bileD, 0.012, 4.2, -2.2, 73 + s2, 0.5, 3);
  }
  const rows = [[1.0, 140], [0.8, 150], [0.6, 150], [0.4, 140], [0.2, 120], [0.02, 96]]; // [height fraction on the crest, shelf width]; drawn bottom row first so each shelf above overhangs the one below
  rows.map((q, r) => [q, r]).reverse().forEach(([[hf, w0], r]) => {
    const n = Math.round(12 - r * 0.6);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5 + (r % 2) * 0.5) / (n + 0.5) + (f.r() - 0.5) * 0.03; if (t > 1.02) continue;
      const g = hgt(t), w = w0 * (0.5 + 0.5 * g / 300) * (0.6 + f.r() * 0.7);
      const c = add(rAt(t), [(f.r() - 0.5) * 18, -g * hf - (r === 0 ? 10 : 0)]);
      const k0 = f.r(), k1 = f.r(), k2 = f.r(), k3 = f.r();
      if (r === 0 && k0 < 0.25) { onRidge(t, () => puff(add(c, [0, -12]), 18 + k1 * 18)); continue; }
      if (r === 2 && k0 < 0.12) { onRidge(t, () => puff(c, 16 + k1 * 10)); continue; }
      onRidge(t, () => shelf(c, w, (k2 - 0.5) * (r === 0 ? 0.5 : 0.25) + (rAt(Math.min(1, t + 0.05))[1] - rAt(Math.max(0, t - 0.05))[1]) / 120, shelfCols[Math.floor(k3 * shelfCols.length)]));
    }
  });
  for (let i = 0; i < 8; i++) { const t = 0.08 + f.r() * 0.84, c = add(rAt(t), [(f.r() - 0.5) * 40, 40 + f.r() * 40]), a = -0.3 - f.r() * 0.4, sz = 28 + f.r() * 14; onRidge(t, () => W.bracket(f, c, a, sz, 2, mix(P.cap, P.bileD, 0.35))); } // small shelves spreading down the flank
  for (let i = 0; i < 6; i++) { const t = 0.06 + i * 0.17; onRidge(t, () => X.mycelium(f, add(rAt(t), [0, 34]), 1.5 + (f.r() - 0.5) * 0.8, 70, 2, 1.4)); }
  for (let i = 0; i < 16; i++) { const t = f.r(); onRidge(t, () => bristle(add(rAt(t), [(f.r() - 0.5) * 20, 10]), E.norm([(f.r() - 0.5) * 0.6, -1]), 24 + f.r() * 16, 8)); } // bristles standing up between the shelves
  for (const b of ['spine_1', 'spine_2']) { f.bone(b); RQ[b].forEach(fn => fn()); }
  // the strip of sacking caught on the ridge, hanging plumb down the flank
  f.bone('spine_2');
  { const sk0 = rAt(0.66); f.part([add(sk0, [-24, -10]), add(sk0, [24, -16]), add(sk0, [30, 90]), [...add(sk0, [18, 170]), 1], add(sk0, [6, 120]), [...add(sk0, [-6, 182]), 1], add(sk0, [-18, 100])], { fill: '#7a6a4c', shadow: '#2a2214', shade: 0.42, maxShade: 10, tex: 'weave' + seed, texOp: 0.7 }); X.holes(f, add(sk0, [4, 80]), 10, 24, 2, { r0: 3, r1: 6 }); X.mouldFur(f, [add(sk0, [18, 170]), add(sk0, [6, 120]), add(sk0, [-6, 182])], 10, { n: 8, blob: false }); }
  // the spore haze sweating off the ridge: pale motes drifting up
  f.bone('spine_1');
  for (let i = 0; i < 80; i++) { const q = add(rAt(f.r()), [(f.r() - 0.5) * 60, -60 - Math.pow(f.r(), 0.7) * 200]); f.flat(ell(q, 1.4 + f.r() * 2.2, 1.4 + f.r() * 2, 0, 6), f.r() > 0.5 ? '#c8c4a4' : P.bileL, { op: 0.3 + f.r() * 0.35 }); }
  // coarse bristles in clumps breaking the outline: under the belly, behind the ham, along the neck
  for (const [x0, x1, sp] of [[130, 690, 'spine_1'], [700, 1100, 'spine_2']]) { f.bone(sp); for (let x = x0; x < x1; x += 34 + f.r() * 20) { let k = 0; while (k < body0.length - 1 && !(body0[k][0] <= x && body0[k + 1][0] > x)) k++; if (k >= body0.length - 1 || body0[k][1] > 700) continue; const q = lerp(body0[k], body0[k + 1], (x - body0[k][0]) / (body0[k + 1][0] - body0[k][0])); bristle(add(q, [0, 12]), E.norm([(f.r() - 0.7) * 0.8, -1]), 18 + f.r() * 12, 7); } } // clumps along the back line
  f.bone('spine_1');
  for (const [p, d] of [[[110, 900], [-1, 0.4]], [[96, 780], [-1, 0.1]], [[150, 1000], [-0.7, 0.7]], [[300, 1074], [0, 1]], [[380, 1110], [0, 1]]]) bristle(p, E.norm(d), 22 + f.r() * 10, 9);
  f.bone('spine_2');
  for (const x of [520, 600, 700, 780, 880, 980]) bristle([x, 1170 - (x - 700) * (x - 700) / 9000], [0.1, 1], 18 + f.r() * 12, 8);
  f.bone('neck');
  for (let i = 0; i < 6; i++) bristle([1100 + i * 24, 512 + i * i * 3], E.norm([0.6, -1]), 16 + f.r() * 8, 7);

  // ---- the head, a pig's wedge: u runs from the poll down the straight, slightly dished face line to the snout disc;
  // v is straight down. The face slopes, the jaw line runs nearly level back to a heavy jowl, the back of the head runs
  // into the neck under the ear and a fat roll. The snout ends in a flat disc that faces forward.
  f.bone('ear_f');
  { const ep = hF([[-40, -30], [0, -76], [80, -94], [150, -82], [140, -60], [70, -46], [10, -34]]); f.part(ep, HD({ fill: mix(hide, '#000', 0.4), cast: false, maxShade: 4, inkHeavy: 1.6 })); f.flat(hF([[110, -86], [100, -74], [124, -72]]), '#0a0604', { op: 0.9 }); bristle(h1(60, -92), [0.2, -1], 12, 5); } // with its owner's notch
  // the mouth inside, seen when the jaw drops
  f.bone('head');
  f.part(hF([[290, 110], [400, 100], [500, 92], [500, 124], [400, 134], [300, 140]]), { fill: '#7a3c30', shadow: '#2a0e0a', shade: 0.4, maxShade: 6, inkW: 1.2, cast: false });
  for (let i = 0; i < 5; i++) f.part(hF([[340 + i * 30, 100 - i * 1.6], [356 + i * 30, 100 - i * 1.6], [348 + i * 30, 114 - i * 1.6]]), { fill: '#b8a878', shade: 0.4, inkW: 0.8, cast: false, hatch: false });
  // the lower jaw: the chin and the jaw line, wrinkled, bristled underneath
  f.bone('jaw');
  const jd = f.part(hF([[290, 112], [400, 102], [500, 94], [524, 102], [514, 132], [440, 152], [360, 190], [290, 220]]), HD({ fill: mix(hide, belly, 0.5), maxShade: 6, inkHeavy: 2, hi: 0 }));
  W.creaseField(f, h1(440, 140), 50, 8, 4, 0.2, 40, 2.2, { lip: 1.6, lit: '#c09a70', col: '#140c06' });
  for (let i = 0; i < 4; i++) bristle(h1(360 + i * 40, 176 - i * 12), [0, 1], 12, 5);
  // the head itself
  f.bone('head');
  const hP = hF([[-50, 40], [-36, -36], [60, -42], [180, -38], [300, -32], [420, -28], [500, -26], [526, -22], [542, 30], [528, 82], [500, 88], [440, 94], [380, 102], [330, 112], [300, 170], [280, 230], [220, 290], [140, 330], [60, 338], [-10, 306], [-44, 220]]);
  const hd = f.part(hP, HD({ k: 0.9, cast: false, maxShade: 4, inkW: 0, inkHeavy: 0, hi: 0, light: hide, gritOp: 0 }));
  { const fr = hF([[-36, -36], [60, -42], [180, -38], [300, -32], [420, -28], [500, -26], [526, -22], [542, 30], [528, 82], [500, 88], [440, 94], [380, 102], [330, 112], [300, 170], [280, 230], [220, 290], [140, 330], [60, 338], [10, 320]]); f.line(fr, 2.2, INK); f.line(fr.slice(6, 14).map(q => add(q, [-1.5, 2])), 3.4, INK, { op: 0.8 }); } // the ink only along the face, the snout, the lip and the jowl; the back of the head runs into the neck
  const hbb = E.bbox(hP);
  W.stains(f, hd, hbb, '#22140a', 0.014, 4.2, -2.3, 87, 0.55, 3);
  W.stains(f, hd, hbb, '#b08660', 0.03, 4.2, -2.6, 89, 0.25, 3);
  W.softTone(f, hd, [
    [hF([[-40, 200], [120, 240], [300, 180], [260, 320], [60, 360], [-60, 300]]), '#0a0604', 0.6, 26], // the jowl hanging in shade
    [hF([[40, -40], [300, -30], [500, -24], [480, -6], [300, -10], [60, -20]]), '#f0c89a', 0.32, 14], // the lit face line
    [hF([[160, 60], [320, 70], [340, 120], [200, 150]]), '#0a0604', 0.35, 20], // the cheek turning under
    [hF([[-60, 0], [-30, -30], [-10, 140], [-50, 260]]), '#0a0604', 0.3, 30], // the back of the head into the neck
  ]);
  W.crease(f, hF([[-30, -20], [-36, 80], [-24, 180], [10, 290]]), 4.4, { lip: 3, lit: '#c09a70', col: '#140c06', op: 0.65 }); // the fat roll where the head meets the neck
  for (let i = 0; i < 5; i++) W.crease(f, hF([[40 + i * 34, 90 + i * 6], [70 + i * 36, 180 + i * 4], [90 + i * 34, 290 - i * 24]]), 3.6 - i * 0.3, { lip: 2.8, lit: '#c09a70', col: '#140c06', op: 0.7 }); // jowl folds
  W.crease(f, hF([[330, 112], [300, 76], [262, 50]]), 3, { lip: 2.4, lit: '#c09a70', col: '#140c06' }); // the mouth's corner fold
  for (let i = 0; i < 6; i++) W.crease(f, hF([[340 + i * 26, -26], [348 + i * 26, -4], [342 + i * 26, 18]]), 2.8, { lip: 2.2, lit: '#c09a70', col: '#140c06', op: 0.7 }); // the wrinkled top of the snout
  f.line(hF([[300, 50], [420, 54], [500, 56]]), 1.6, '#140c06', { op: 0.4 }); // the side of the snout
  for (let i = 0; i < 4; i++) bristle(h1(60 + i * 60, 330 - i * 34), [0.2, 1], 18, 7); // bristles on the jowl
  for (let i = 0; i < 4; i++) bristle(h1(400 + i * 30, 94), [0, 1], 10, 4); // whiskers on the lip
  // the small eye sunk deep in folds of tanned skin, under a heavy hooded lid
  const ey = h1(150, 34);
  f.flat(ell(add(ey, [-2, 2]), 30, 20, 0.5, 14), '#1a0e06', { op: 0.5 }); // the socket's shade
  W.crease(f, [add(ey, [-26, -16]), add(ey, [-4, -22]), add(ey, [18, -12]), add(ey, [26, 4])], 4.4, { lip: 3, lit: '#d0a878', col: '#140a04' }); // the hooded upper lid
  f.flat([add(ey, [-12, -4]), add(ey, [0, -8]), add(ey, [12, -2]), add(ey, [3, 5]), add(ey, [-9, 3])], '#0e0804');
  f.flat(ell(add(ey, [1, -1]), 4.4, 3.6, 0.4, 10), '#3a2a14'); f.flat(ell(add(ey, [2.6, -2.4]), 1.4, 1.2, 0, 6), '#e8e0c0', { op: 0.75 }); // the eye, small, wet, dull
  f.part([add(ey, [-18, -12]), add(ey, [0, -19]), add(ey, [17, -10]), add(ey, [9, -5]), add(ey, [-5, -6])], HD({ maxShade: 3, cast: false, inkW: 1, inkHeavy: 1.2 })); // the lid lies over the top of it
  W.crease(f, [add(ey, [-20, 9]), add(ey, [-2, 15]), add(ey, [18, 10])], 2.6, { lip: 2, lit: '#c09a70', col: '#140a04' }); // the bag under it
  W.crease(f, [add(ey, [-24, 22]), add(ey, [0, 28]), add(ey, [26, 20])], 2.2, { lip: 1.8, lit: '#c09a70', col: '#140a04', op: 0.6 });
  for (let i = 0; i < 3; i++) f.line([add(ey, [20, -2 + i * 7]), add(ey, [32 + i * 3, -4 + i * 10])], 1.2, '#140a04', { op: 0.6 }); // crow's feet
  // the snout disc: flat, wet, facing forward; two nostrils, mud caked under it, the iron ring through the septum
  const sn = h1(534, 30);
  const sd = f.part(ell(sn, 22, 62, 0.62, 18), HD({ fill: '#7c5442', light: '#b08068', cast: false, inkW: 1.6, inkHeavy: 2.4, maxShade: 4 }));
  W.softTone(f, sd, [[ell(add(sn, [-8, 16]), 14, 38, 0.62, 10), '#2a120a', 0.45, 6]]);
  for (const dv of [-22, 18]) { const q = add(sn, rot([0, dv], 0.62)); f.flat(ell(q, 6, 11, 0.62, 10), '#100604'); f.line(ell(q, 8, 13, 0.62, 10).slice(0, 5), 1.1, '#c8a088', { op: 0.5 }); }
  f.line([add(sn, rot([6, -40], 0.62)), add(sn, rot([10, -10], 0.62)), add(sn, rot([8, 16], 0.62))], 2, '#f0e4d0', { op: 0.5 }); // wet
  f.flat(hF([[400, 64], [500, 70], [524, 82], [470, 96], [400, 92]]), P.peatD, { op: 0.75 }); W.mudSplats(f, h1(460, 70), 40, 16, 9, P.peatD); // mud caked on the lower snout
  W.drip(f, h1(500, 92), 1.3, P.peatD);
  // short yellowed tusk curving up out of the corner of the mouth, the chewed boot hooked on it
  const tk = h1(350, 108);
  f.part([add(tk, [-8, 6]), add(tk, [10, 4]), add(tk, [20, -26]), add(tk, [14, -50]), add(tk, [4, -38]), add(tk, [-2, -10])], { fill: '#c4b080', shadow: '#6a5a3a', shade: 0.4, maxShade: 4, inkW: 1.3, cast: false, light: '#e8dcb0' });
  f.line([add(tk, [4, 0]), add(tk, [12, -34])], 1, '#7a6a44', { op: 0.6 });
  { const bF = frame(add(tk, [-6, 8]), 1.45, 1);
    f.part(bF([[-6, -18], [44, -20], [66, -24], [72, -4], [66, 18], [-6, 20]]), { fill: '#3a2a1a', shadow: '#0e0804', shade: 0.42, maxShade: 8, tex: 'leather' + seed, texOp: 0.6, inkW: 1.3 });
    f.part(bF([[62, -24], [94, -26], [118, -14], [122, 20], [68, 20]]), { fill: '#33251a', shadow: '#0e0804', shade: 0.42, maxShade: 8, tex: 'leather' + seed, texOp: 0.6, inkW: 1.3 });
    f.flat(bF(ell([22, 0], 9, 6, 0, 8)), '#0a0604'); f.line(bF([[32, -18], [36, 0], [30, 18]]), 1.4, '#7a6a54', { op: 0.6 }); f.line(bF([[96, 20], [100, 28], [108, 22], [114, 30]]), 1.4, '#140c06'); } // bitten through at the toe
  // the near ear: huge, thick and flopped forward over the brow, its tip hanging past the eye toward the snout; veined,
  // the owner's notches cut in its edge
  f.bone('ear_n');
  const eP = hF([[-24, -40], [30, -70], [110, -70], [190, -50], [260, -20], [312, 22], [340, 86], [300, 66], [250, 36], [180, 18], [110, 6], [40, -2], [-6, -10]]);
  const ed = f.part(eP, HD({ fill: mix(hide, hideL, 0.12), castOp: 0.6, maxShade: 6, inkHeavy: 2.2 }));
  W.softTone(f, ed, [[hF([[0, -14], [180, -2], [330, 80], [260, 16], [120, -8]]), '#0a0604', 0.5, 10], [hF([[20, -66], [190, -48], [280, -12], [190, -34], [40, -48]]), '#f0c89a', 0.3, 10]]);
  W.stains(f, ed, E.bbox(eP), '#22140a', 0.03, 4.2, -2.4, 97, 0.45, 3);
  for (let i = 0; i < 4; i++) f.line(hF([[0, -22 - i * 10], [110, -26 - i * 10], [210, -10 - i * 8], [290, 28 - i * 4]]), 1.3, '#3a1a10', { op: 0.5 }); // veins
  W.crease(f, hF([[-10, -28], [100, -38], [200, -24], [290, 18]]), 3, { lip: 2.4, lit: '#c8a078', col: '#140c06', op: 0.7 }); // the fold where it bends over
  f.line(hF([[260, 18], [304, 56], [336, 80]]), 3, '#c8a07c', { op: 0.45 }); // the thin edge curling at the tip
  f.flat(hF([[270, -10], [258, 2], [282, 2]]), '#000', { op: 0.9 }); f.flat(hF([[140, -66], [130, -54], [154, -56]]), '#000', { op: 0.9 }); // the owner's notches
  for (let i = 0; i < 5; i++) bristle(h1(40 + i * 60, -70 + i * 12), [0.5, -1], 10 + f.r() * 6, 4);
  // ---- the nose ring's broken tether chain dragging to the mud
  f.bone('chain');
  { const r0 = h1(526, 96); f.line(ell(r0, 14, 16, 0.3, 14).concat([ell(r0, 14, 16, 0.3, 14)[0]]), 5, P.ironL); f.line(ell(r0, 14, 16, 0.3, 14).slice(0, 6), 1.4, '#9a9286', { op: 0.5 });
    const cp = [add(r0, [0, 14]), add(r0, [-10, 80]), add(r0, [-24, 160]), add(r0, [-34, 230]), [r0[0] - 60, gy - 20], [r0[0] - 130, gy - 14], [r0[0] - 180, gy - 18]];
    for (let i = 0; i < 24; i++) { const t = i / 23, k = Math.min(cp.length - 2, Math.floor(t * (cp.length - 1))), u = t * (cp.length - 1) - k, q = lerp(cp[k], cp[k + 1], u), a = ang(cp[k], cp[k + 1]) + (i % 2 ? Math.PI / 2 : 0); f.line(ell(q, 10, 5.4, a, 10).concat([ell(q, 10, 5.4, a, 10)[0]]), 3.6, i % 2 ? P.iron : P.ironL); }
    f.line([[r0[0] - 180, gy - 18], [r0[0] - 190, gy - 26], [r0[0] - 198, gy - 16]], 3, P.ironL); }

  // ---- the wallow: churned mud the trotters are sunk in, a slick of water, ripples
  f.bone('root');
  f.part([[0, gy - 22], [240, gy - 40], [520, gy - 24], [820, gy - 44], [1120, gy - 26], [1420, gy - 40], [1700, gy - 24], [1700, CH], [0, CH]], { fill: '#2a2014', shadow: '#0e0a06', shade: 0.3, maxShade: 10, tex: 'peat' + seed, texOp: 0.6, inkW: 1.2, cast: false, k: 0.8 });
  for (const L of Object.values(LEG)) { const x = L.T[0]; f.part([[x - 74, gy + 4], [x - 60, gy - 10], [x - 30, gy - 20], [x - 4, gy - 12], [x + 24, gy - 22], [x + 62, gy - 10], [x + 78, gy + 4]], { fill: '#31261a', shadow: '#0e0a06', shade: 0.35, maxShade: 6, tex: 'peat' + seed, texOp: 0.8, inkW: 1.2, cast: false, k: 0.7 }); f.line([[x - 50, gy - 12], [x - 28, gy - 18], [x + 22, gy - 20]], 1.4, '#6a5a40', { op: 0.5 }); } // mud welling round each sunk trotter
  W.ripples(f, [800, gy - 10], 520, 9, 3, '#5a5a40', 0.4);
  f.flat([[300, gy - 8], [700, gy - 14], [900, gy - 6], [500, gy - 2]], '#3a3a2a', { op: 0.5 });
  return f;
}

// ------------------------------------------------------------------ THE OLD HERON (ruler 4)
// The great grey heron of the fen, older than the villages, which has come to prefer the fishermen. A heron's body the
// size of a cart, hunched, standing in the shallows on one leg with the other drawn up, the neck folded back into an S.
// Toxin has pushed one part hard: the crop and gullet have swollen into a hanging sack below the folded neck, the skin
// stretched thin and blistered, the outlines of swallowed things pressing through it (an eel trap, a boot, a hand).
// Water has preserved the legs: long and scaled, tanned dark brown like bog leather, with thick knuckled joints and long
// toes splayed on the mud. The plumage is clumped into wet directional locks with bile-green mould in the mats; the long
// breast plumes hang lank and have rotted into holes at the tips.
// Frame: the head sits at the very top edge, the crest cropped by the frame; the bible puts it above the frame, but the
// rig export only keeps what is on the canvas, and the strike needs the head and beak as parts.
// Rig (its own): body (root, at the hip) > leg_n_1 > leg_n_2 > leg_n_3 (the standing leg), body > leg_f_1..3 (drawn up);
// body > wing > net; body > neck_1 > neck_2 > neck_3 > head > jaw, crest; neck_1 > crop, plumes.
// Motion: idle utter stillness, the crop swaying (crop) and the standing leg sinking an inch; attack the neck unfolding
// (neck_1..3) and the beak spearing down from the top of the frame, lifting a hero toward the crop.
function oldHeron() {
  const [CW, CH] = TIERS.ruler;
  const f = new Fig(W.base(221, CH, { grimeY: 1320, wobble: 2.2, inkW: 2, inkHeavy: 4.6 }));
  W.textures(f);
  const seed = 221, gy = CH - 30;
  const grey = '#86867e', greyD = '#55534c', greyL = '#b0aea4', dark = '#2a2824', legC = '#4a3222', legD = '#2a1c12', legL = '#7a5a3c';
  const FE = (o = {}) => Object.assign({ fill: grey, shadow: '#2a2a26', shade: 0.38, maxShade: 50, tex: 'mottle' + seed, texOp: 0.45 }, o);
  const LG = (o = {}) => Object.assign({ fill: legC, shadow: legD, light: legL, shade: 0.4, tex: 'leather' + seed, texOp: 0.7 }, o);
  const hip = [720, 760];
  const SL = { H: [740, 760], K: [800, 980], A: [770, 1480], T: [770, gy] };
  const FL = { H: [560, 800], K: [600, 930], A: [730, 900] };
  const NK = [[880, 360], [1040, 330], [1104, 226], [1050, 124], [990, 56], [1010, -10]];
  const spl = (pts, n) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } } out.push(pts[pts.length - 1]); return out; };
  const BK0 = [1080, 8], BK1 = [1540, 96];
  f.joint('body', hip);
  f.joint('leg_n_1', SL.H, 'body').joint('leg_n_2', SL.K, 'leg_n_1').joint('leg_n_3', SL.A, 'leg_n_2');
  f.joint('leg_f_1', FL.H, 'body').joint('leg_f_2', FL.K, 'leg_f_1').joint('leg_f_3', FL.A, 'leg_f_2');
  f.joint('wing', [840, 330], 'body').joint('net', [480, 480], 'wing');
  f.joint('neck_1', NK[0], 'body').joint('neck_2', NK[2], 'neck_1').joint('neck_3', NK[4], 'neck_2').joint('head', NK[5], 'neck_3').joint('jaw', [1090, 16], 'head').joint('crest', [1000, -10], 'head');
  f.joint('crop', [1010, 360], 'body').joint('plumes', [960, 380], 'body');

  // a wet feather lock along a direction: X.plume with jitter; o.hang makes it fall plumb at the end (water-heavy)
  const lock = (q, a, l, w, col, o = {}) => { const e = o.hang ? [add(q, rot([l * 0.4, 0], a)), add(add(q, rot([l * 0.6, 0], a)), [0, l * 0.25]), add(add(q, rot([l * 0.65, 0], a)), [0, l * 0.55])] : [add(q, rot([l * 0.35, (f.r() - 0.5) * 8], a)), add(q, rot([l * 0.7, (f.r() - 0.5) * 12], a)), add(q, rot([l, (f.r() - 0.5) * 14], a))]; W.hairClump(f, [q, ...e], w, { n: Math.max(3, Math.round(w / 8)), pal: [mix(col, '#000', 0.25), mix(col, '#000', 0.1), col, mix(col, '#fff', 0.1)], base: col, sheenCol: mix(col, '#fff', 0.35) }); };
  const greyJ = (c, k = 0.18) => mix(c, f.r() > 0.5 ? '#f4f0e4' : '#14120e', f.r() * k);
  // scaled bog-leather leg segment: scutes across the front, wrinkles behind
  const scaled = (a, b, wa, wb, look) => {
    const d = f.part(limb(a, b, wa, wb, { steps: 14, capK: 0.9, p: [[0.1, 0.12, 0.08]], q: [[0.9, 0.1, 0.08]] }), look);
    W.softTone(f, d, [[[lp(a, b, 0, -wa * 0.5), lp(a, b, 1, -wb * 0.5), lp(a, b, 1, -wb * 0.1), lp(a, b, 0, -wa * 0.1)], '#0a0604', 0.5, 6]]);
    const L = E.len(sub(b, a));
    for (let t = 0.05; t < 0.95; t += 24 / L) { const w = wa + (wb - wa) * t; f.line([lp(a, b, t, w * 0.48), lp(a, b, t + 0.008, w * 0.05), lp(a, b, t, -w * 0.2)], 1.6, '#140a04', { op: 0.6 }); f.line([lp(a, b, t + 0.012, w * 0.44), lp(a, b, t + 0.018, w * 0.1)], 1, '#a07a54', { op: 0.45 }); }
    W.creaseField(f, lerp(a, b, 0.5), wa * 0.2, L * 0.4, 6, ang(a, b) + 1.5, wa * 0.5, 1.4, { lip: 1.2, lit: '#a07a54', col: '#120804' });
    return d;
  };
  const knuckle = (c, r, look) => { f.part(ell(c, r, r * 0.86, 0.3, 14).map((p, k) => k % 2 ? add(p, mul(sub(p, c), 0.08)) : p), Object.assign({}, look, { cast: false })); W.creaseField(f, c, r * 0.6, r * 0.6, 4, 0.2, r * 1.2, 2.4, { lip: 2, lit: '#a07a54', col: '#120804' }); };
  const toe = (a, b, w, look) => { f.part(K.chain([a, lerp(a, b, 0.5), b], [w, w * 0.85, w * 0.62], { steps: 6 }), look); for (let t = 0.12; t < 0.9; t += 0.12) f.line([lerp(a, b, t), add(lerp(a, b, t), [0, -w * 0.42])], 1.3, '#140a04', { op: 0.6 }); const d = E.norm(sub(b, a)); f.part([add(b, mul([-d[1], d[0]], w * 0.3)), add(b, mul(d, w * 1.4)), [...add(add(b, mul(d, w * 1.9)), [0, w * 0.5]), 1], add(b, mul([-d[1], d[0]], -w * 0.3))], { fill: '#1a140e', shade: 0.4, inkW: 1.1, cast: false }); };

  // ---- the drawn-up leg, folded under the belly
  f.bone('leg_f_2'); scaled(FL.K, FL.A, 50, 44, LG({ fill: legD }));
  f.bone('leg_f_3');
  for (const [dx, dy] of [[70, 34], [64, 58], [44, 70]]) toe(FL.A, add(FL.A, [dx, dy]), 20, LG({ fill: legD }));
  W.rope(f, [add(FL.A, [-50, -30]), add(FL.A, [-36, -6]), add(FL.A, [-20, -26])], 3.4, { col: P.ropeD });
  X.frogCharm(f, add(FL.A, [-36, -8]), 70, { s: 1.8, n: 3 }); // the hag's charm of frog bones knotted round the drawn-up leg
  f.bone('leg_f_1'); f.part(limb(FL.H, FL.K, 110, 60, { steps: 10 }), FE({ fill: greyD })); knuckle(FL.K, 36, LG({ fill: legD }));

  // ---- the standing leg
  f.bone('leg_n_2');
  scaled(SL.K, SL.A, 78, 62, LG());
  for (const [t, o] of [[0.58, 28], [0.72, -22], [0.46, -16]]) { const a = lp(SL.K, SL.A, t, o); X.leech(f, [add(a, [0, 50]), add(a, [6, 26]), add(a, [0, 0])], 24, { fat: true, sucker: false }); } // leeches fat on the bare shin
  const sa = lp(SL.K, SL.A, 0.9, 0);
  f.part([add(sa, [-44, -12]), add(sa, [42, -16]), add(sa, [42, 6]), add(sa, [-44, 10])], { fill: '#3a2816', shadow: '#0e0804', shade: 0.4, tex: 'leather' + seed, texOp: 0.6, inkW: 1.3, cast: false });
  f.part([add(sa, [38, -10]), add(sa, [70, 10]), [...add(sa, [84, 58]), 1], add(sa, [66, 54]), add(sa, [48, 16])], { fill: '#3a2816', shadow: '#0e0804', shade: 0.4, tex: 'leather' + seed, texOp: 0.6, inkW: 1.2 }); // the snapped stilt-strap
  f.rivet(add(sa, [-22, -2]), 4, P.ironL);
  f.bone('leg_n_3');
  const T = SL.T, tl = LG({ fill: mix(legC, '#000', 0.1) });
  toe(add(SL.A, [-6, 40]), [T[0] - 190, gy - 10], 32, tl);
  toe(add(SL.A, [4, 50]), [T[0] + 160, gy - 6], 32, tl);
  f.part([add(SL.A, [20, 60]), [T[0] + 250, gy - 12], [T[0] + 320, gy - 14], [T[0] + 120, gy - 22]], { fill: mix(legC, '#000', 0.3), shade: 0.3, inkW: 1, cast: false, hatch: false, opacity: 0.85 }); // the web
  toe(add(SL.A, [8, 50]), [T[0] + 270, gy - 4], 36, tl);
  f.part(K.chain([add(SL.A, [-10, -20]), add(SL.A, [0, 30]), add(SL.A, [10, 60])], [66, 70, 60], { steps: 5 }), tl);
  knuckle(add(SL.A, [4, 46]), 36, tl);
  toe(add(SL.A, [10, 52]), [T[0] + 360, gy - 8], 36, tl);
  f.part([[T[0] + 196, gy - 42], [T[0] + 262, gy - 24], [T[0] + 258, gy - 18], [T[0] + 192, gy - 36]], { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1, cast: false }); // the fish bone through the web
  for (let i = 0; i < 4; i++) f.line([[T[0] + 208 + i * 13, gy - 38 + i * 4], [T[0] + 202 + i * 13, gy - 50 + i * 4]], 1.2, P.bone);
  for (const [x, r] of [[T[0] + 140, 24], [T[0] + 300, 20], [T[0] - 130, 22]]) f.part(ell([x, gy - 32], r, r * 0.7, 0.2, 10).map(q => add(q, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 4])), { fill: P.peat, shadow: '#120c06', shade: 0.45, tex: 'peat' + seed, texOp: 0.9, inkW: 1.2, cast: false }); // peat clods
  const cl = [T[0] + 420, gy - 6];
  f.line(ell(add(cl, [10, -50]), 30, 40, 0.2, 18).slice(9, 18), 5, P.iron); f.line(ell(add(cl, [10, -50]), 30, 40, 0.2, 18).slice(9, 18), 2, P.ironL, { op: 0.6 }); // a lantern's bail ring hooked on a claw
  f.bone('leg_n_1');
  scaled(lerp(SL.H, SL.K, 0.45), SL.K, 80, 76, LG());
  knuckle(SL.K, 50, LG());
  W.bracket(f, add(SL.K, [-44, 12]), Math.PI + 0.2, 64, 3); // shelf fungus on the standing knee
  f.part(limb(SL.H, lerp(SL.H, SL.K, 0.55), 170, 94, { steps: 8 }), FE({ fill: greyD }));
  for (let i = 0; i < 8; i++) lock(add(lerp(SL.H, SL.K, 0.1 + i * 0.04), [(f.r() - 0.5) * 60, 0]), 1.55 + (f.r() - 0.5) * 0.3, 80 + f.r() * 40, 30, greyJ(greyD), { hang: true });

  // ---- the body: hunched, the shoulders high; one grey mass, its underside breaking into wet locks hanging plumb
  f.bone('body');
  const bodyP = [[-40, 640], [80, 540], [260, 430], [460, 330], [640, 262], [790, 236], [900, 280], [960, 400], [940, 540], [870, 670], [750, 770], [560, 820], [360, 810], [160, 760], [20, 720]];
  const bD = f.part(bodyP, FE({ k: 0.9 }));
  W.softTone(f, bD, [[[[20, 640], [360, 700], [740, 680], [940, 520], [900, 840], [0, 840]], '#0a0a08', 0.75, 50], [[[100, 600], [400, 520], [700, 480], [900, 420], [700, 640], [300, 700]], '#0a0a08', 0.35, 50], [[[300, 400], [560, 300], [820, 250], [700, 340], [420, 420]], '#f4f0e4', 0.35, 34]]);
  // breast and flank plumage in overlapping tiers of contour feathers lying down and back (the part the wing leaves bare)
  for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const q = add(lerp([930, 440 + r * 80], [300, 620 + r * 50], i / 6), [(f.r() - 0.5) * 24, (f.r() - 0.5) * 16]); if (!X.inside(bodyP, q)) continue; X.feather(f, q, add(q, rot([90 + r * 12 + f.r() * 30, 0], 2.0 + (f.r() - 0.5) * 0.3)), 64 + f.r() * 16, greyJ(r < 2 ? grey : greyD, 0.15), { castOp: 0.3, split: f.r() < 0.3 ? 2 : 0 }); }
  // the belly breaking into wet clumps that hang plumb, in a few heavy groups of uneven length, some rotted through
  // the belly: short broad contour feathers lying down and back over its lower edge, dark and wet, the tips split and
  // a few rotted through, so the underside is a soft ragged edge that sags, not a fringe
  for (let r = 0; r < 2; r++) for (let i = 0; i < 13; i++) { const q = add(lerp([880, 600 + r * 30], [60, 660 + r * 30], i / 12), [(f.r() - 0.5) * 30, 20 + 60 * Math.sin(Math.PI * i / 12) + (f.r() - 0.5) * 16]); X.feather(f, q, add(q, rot([80 + f.r() * 60, 0], 2.15 + (f.r() - 0.5) * 0.35)), 60 + f.r() * 20, greyJ(mix(greyD, '#1a1a16', 0.2 + r * 0.15), 0.12), { castOp: 0.4, split: f.r() < 0.6 ? 2 + Math.floor(f.r() * 2) : 0, bend: (f.r() - 0.5) * 0.5 }); if (f.r() < 0.2) X.holes(f, add(q, [-20, 50]), 4, 8, 1, { r0: 2, r1: 4 }); }
  for (let i = 0; i < 10; i++) { const q = lerp([880, 270], [60, 560], i / 9 + (f.r() - 0.5) * 0.04); lock(add(q, [0, 14]), 2.75 + (f.r() - 0.5) * 0.5, 80 + f.r() * 90, 26 + f.r() * 14, greyJ(grey)); } // ruffled wet locks breaking the back's outline
  for (let i = 0; i < 7; i++) { const p = W.scatter(f, [500, 560], 320, 140); if (X.inside(bodyP, p)) W.mossClump(f, p, 26 + f.r() * 26, 10, { col: mix(P.moss, P.bileD, 0.4), ang: 0.25 }); } // bile-green mould in the mats
  for (let i = 0; i < 16; i++) { const p = add([520, 268], [(f.r() - 0.5) * 70, (f.r() - 0.5) * 10]); f.line([p, add(p, rot([70 + f.r() * 50, 0], -2.8 + f.r() * 0.8))], 2.4, f.r() > 0.5 ? P.reedL : P.reed); } // a tuft of reed thatch caught in the back feathers
  W.rope(f, [[490, 272], [520, 282], [552, 272]], 2.6, { col: P.reedD });

  // ---- the wing folded along the side: long scapulars drooping over it, coverts in rows, the dark primaries over the tail
  f.bone('wing');
  const wingP = [[870, 320], [700, 280], [460, 310], [240, 400], [40, 560], [-40, 660], [80, 700], [360, 680], [620, 620], [820, 520]];
  const wD = f.part(wingP, FE({ fill: mix(grey, greyD, 0.25), k: 0.9, inkHeavy: 2.6, maxShade: 14 }));
  W.softTone(f, wD, [[[[40, 680], [400, 670], [780, 540], [760, 640], [300, 720]], '#0a0a08', 0.5, 30], [[[300, 360], [600, 300], [840, 330], [600, 380]], '#f4f0e4', 0.25, 24]]);
  // the folded wing in layered tiers: dark primaries crossing over the tail, broad secondaries and tertials, the greater
  // coverts, then rows of small coverts toward the shoulder; each tier lies over the one behind and throws a shadow on it
  for (let i = 0; i < 7; i++) { const q = add([380, 600], [-i * 28, i * 12]); X.feather(f, q, add(q, [-360 + i * 18, 120 + i * 10]), 56, greyJ(dark, 0.12), { castOp: 0.4, split: i % 3 === 1 ? 2 : 0, bend: 0.3 }); }
  for (let i = 0; i < 10; i++) { const q = lerp([250, 520], [780, 420], i / 9); X.feather(f, add(q, [0, (f.r() - 0.5) * 14]), add(q, rot([230 + f.r() * 40, 0], 2.78 + (f.r() - 0.5) * 0.12)), 74 + f.r() * 12, greyJ(mix(grey, greyD, 0.45), 0.14), { castOp: 0.45, split: f.r() < 0.35 ? 2 + Math.floor(f.r() * 2) : 0, bend: 0.2 }); }
  for (let i = 0; i < 9; i++) { const q = lerp([340, 456], [830, 372], i / 8); X.feather(f, add(q, [0, (f.r() - 0.5) * 10]), add(q, rot([150 + f.r() * 20, 0], 2.8 + (f.r() - 0.5) * 0.12)), 60 + f.r() * 8, greyJ(grey, 0.14), { castOp: 0.45, split: f.r() < 0.25 ? 2 : 0 }); }
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8 - r; i++) { const q = lerp([500 + r * 70, 392 - r * 30], [860, 338 - r * 16], i / (7 - r)); X.feather(f, add(q, [(f.r() - 0.5) * 10, (f.r() - 0.5) * 8]), add(q, rot([84 - r * 12, 0], 2.8 + (f.r() - 0.5) * 0.15)), 42 - r * 4, greyJ(mix(grey, greyL, 0.2 + r * 0.12), 0.12), { castOp: 0.4, inkHeavy: 1.4 }); }
  for (let i = 0; i < 6; i++) { const p = W.scatter(f, [540, 500], 260, 90); if (X.inside(wingP, p)) W.mossClump(f, p, 20 + f.r() * 20, 8, { col: mix(P.moss, P.bileD, 0.4), ang: 0.3 }); } // mould grown into the mats
  for (let i = 0; i < 5; i++) { const q = add([780, 300], [-i * 70, i * 16]); X.feather(f, q, add(q, rot([280 + f.r() * 60, 0], 2.72 + f.r() * 0.1)), 40, greyJ(greyL, 0.1), { castOp: 0.35, split: 3, bend: -0.3 }); } // the long lank scapular plumes over the back
  for (let i = 0; i < 12; i++) { const q = lerp([860, 250], [120, 520], i / 11 + (f.r() - 0.5) * 0.03); X.feather(f, add(q, [0, 18]), add(q, rot([70 + f.r() * 60, 0], 3.3 + (f.r() - 0.5) * 0.5)), 26 + f.r() * 14, greyJ(grey, 0.18), { castOp: 0.3, split: f.r() < 0.5 ? 2 : 0 }); } // wet feathers lifting off the back, breaking its outline
  // a broken arrow shaft in the shoulder, its fletching rotted to a stub
  const ar = [800, 400];
  f.flat(ell(ar, 11, 8, 0, 8), '#140c08');
  f.part(limb(ar, add(ar, [-150, -170]), 10, 9, { steps: 6, capK: 0.5 }), { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1.2, cast: false });
  f.line([add(ar, [-150, -170]), add(ar, [-160, -190]), add(ar, [-142, -180])], 2, P.woodL);
  for (let i = 0; i < 3; i++) f.line([add(ar, [-128 + i * 10, -146 + i * 10]), add(ar, [-146 + i * 10, -136 + i * 10])], 3, '#6a6458', { op: 0.8 });
  f.flat([ar, add(ar, [8, 6]), add(ar, [4, 54]), add(ar, [-4, 48])], '#3a1a0e', { op: 0.6 });
  // the fowler's net tangled over the wing, its cork floats
  f.bone('net');
  const nt = [[260, 440], [560, 360], [700, 470], [620, 620], [320, 680], [160, 600]];
  for (let i = 0; i < 13; i++) { const a = lerp(nt[0], nt[1], i / 12), b = lerp(nt[5], nt[3], i / 12); f.line([a, add(lerp(a, b, 0.5), [(f.r() - 0.5) * 24, 0]), b], 1.5, '#1e1a12', { op: 0.85 }); }
  for (let i = 0; i < 8; i++) { const a = lerp(nt[0], nt[5], i / 7), b = lerp(nt[1], nt[3], i / 7); f.line([a, lerp(a, b, 0.5), b], 1.5, '#1e1a12', { op: 0.85 }); }
  for (const q of [[280, 450], [400, 410], [520, 376], [670, 470], [620, 610], [340, 670]]) f.part(ell(q, 13, 9, 0.3, 10), { fill: '#a88a5a', shadow: '#4a3a22', shade: 0.4, inkW: 1.1, cast: false });
  for (const x of [200, 260, 320]) f.line([[x, 640], [x - 6, 760], [x + 4, 860]], 1.5, '#1e1a12', { op: 0.85 }); // torn mesh hanging plumb

  // ---- the S-neck: one continuous shape, cut between its three bones; feather locks along it, the black streaks of the
  // foreneck, the long lank breast plumes hanging from its base
  const neckW = [190, 150, 120, 104, 92, 86];
  const NS = spl(NK, 8), nkPts = K.chain(NS, NS.map((_, i) => { const t = i / (NS.length - 1) * (neckW.length - 1), k = Math.min(neckW.length - 2, Math.floor(t)); return neckW[k] + (neckW[k + 1] - neckW[k]) * (t - k); }), { steps: 2 });
  const c1 = NK[2], c2 = NK[4], d1 = E.norm(sub(NK[3], NK[1])), d2 = E.norm(sub(NK[5], NK[3]));
  split(f, () => {
    const nD = f.part(nkPts, FE({ k: 0.9, fill: mix(grey, greyL, 0.25) }));
    W.softTone(f, nD, [[[lp(NK[0], NK[1], 0, -80), lp(NK[1], NK[2], 1, -60), lp(NK[2], NK[3], 0.5, -40), lp(NK[2], NK[3], 0.5, 10), lp(NK[0], NK[1], 0, 0)], '#0a0a08', 0.45, 20]]);
    for (let i = 1; i < NK.length - 1; i++) for (let k = 0; k < 4; k++) { const q = lerp(NK[i - 1], NK[i], k / 4); lock(add(q, [(f.r() - 0.5) * 30, (f.r() - 0.5) * 20]), ang(NK[i - 1], NK[i]) + (f.r() - 0.5) * 0.4, 70 + f.r() * 30, 24, greyJ(greyL, 0.2)); }
    for (let i = 0; i < 10; i++) { const t = i / 9, k = Math.min(NK.length - 2, 1 + Math.floor(t * 3)), q = lerp(NK[k], NK[k + 1], t * 3 - Math.floor(t * 3)); f.stroke([add(q, [36, -4]), add(q, [30, 22])], 8, dark, { op: 0.85 }); } // the black streaks
  }, [['neck_1', side(c1, mul(d1, -1), 60)], ['neck_2', [side(c1, d1, 60), side(c2, mul(d2, -1), 50)]], ['neck_3', side(c2, d2, 50)]]);

  // ---- the head at the top edge, the crest cropped by the frame: a long dagger beak stained dark at the tip and
  // blistered at the gape, the black crest plume hanging lank, a single round amber eye, dull and old
  f.bone('crest');
  for (let i = 0; i < 3; i++) X.plume(f, [[990, -6 + i * 6], [950, 50 + i * 10], [910, 120 + i * 16], [890, 200 + i * 20]], 26 - i * 5, { col: dark, shadow: '#000' });
  f.bone('jaw');
  const bA = ang(BK0, BK1), bF = frame(BK0, bA, 1), bL = E.len(sub(BK1, BK0));
  f.part(bF([[0, 6], [bL * 0.6, 10], [bL, 3], [bL * 0.6, 26], [0, 36]]), { fill: '#a08444', shadow: '#4a3a1a', shade: 0.4, inkW: 1.5, cast: false });
  f.bone('head');
  const hP = [[960, 20], [980, -20], [1040, -30], [1090, -10], [1110, 30], [1080, 64], [1030, 70], [980, 56]];
  f.part(hP, FE({ fill: greyL, castOp: 0.4 }));
  f.part([[972, -4], [1030, -26], [1086, -14], [1066, 4], [1010, 8]], FE({ fill: dark, cast: false }));
  const up = bF([[-12, -22], [bL * 0.5, -12], [bL * 0.88, -2], [bL + 8, 5], [bL * 0.7, 12], [bL * 0.3, 12], [-6, 16]]);
  const uD = f.part(up, { fill: '#b89a52', shadow: '#5a4420', shade: 0.42, inkW: 1.6, inkHeavy: 2.8, tex: 'mottle' + seed, texOp: 0.4 });
  W.softTone(f, uD, [[bF([[bL * 0.55, -16], [bL + 12, 0], [bL * 0.55, 16]]), '#1e140a', 0.85, 6]]); // stained dark at the tip
  f.line(bF([[0, 7], [bL * 0.7, 11], [bL, 5]]), 2.4, INK);
  f.line(bF([[20, -12], [bL * 0.6, -7]]), 1.8, '#f0dca0', { op: 0.5 });
  f.flat(bF(ell([bL * 0.06, -5], 12, 4, 0, 8)), '#140c06', { op: 0.6 });
  for (const [u, r] of [[8, 8], [24, 6], [-4, 6]]) W.pustule(f, bF([[u, 12]])[0], r, { col: mix(P.bile, '#b89a52', 0.4) });
  const ey = [1056, 16];
  f.part(ell(ey, 17, 16, 0, 14), { fill: '#a87a32', shadow: '#5a3a12', shade: 0.35, inkW: 1.6, cast: false, hatch: false });
  f.flat(ell(ey, 6.5, 6.5, 0, 10), '#0e0804'); f.flat(ell(add(ey, [-3, 3]), 11, 8, 0.4, 10), '#d8d0b8', { op: 0.25 }); f.flat(ell(add(ey, [4, -5]), 3, 2.4, 0, 6), '#fff', { op: 0.7 });
  W.crease(f, [add(ey, [-20, -6]), add(ey, [0, -19]), add(ey, [20, -6])], 2.4, { lip: 1.8, lit: '#e0dcd0', col: '#1a1814' });
  W.crease(f, [add(ey, [-16, 12]), add(ey, [2, 20]), add(ey, [18, 12])], 2, { lip: 1.6, lit: '#e0dcd0', col: '#1a1814', op: 0.6 });

  // ---- the long breast plumes hanging lank from the base of the neck, rotted into holes at the tips
  f.bone('plumes');
  for (let i = 0; i < 10; i++) { const q = lerp([900, 400], [1050, 340], i / 9), l = 240 + f.r() * 140; X.plume(f, [q, add(q, [10, l * 0.4]), add(q, [4, l * 0.75]), add(q, [-8, l])], 28, { col: greyJ(mix(greyL, '#fff', 0.2), 0.1), shadow: '#3a3a36' }); X.holes(f, add(q, [-3, l * 0.9]), 4, 10, 1, { r0: 2, r1: 5 }); }
  rope0(f, [[890, 420], [940, 520], [1000, 540], [1050, 500]], 1.8); // eel hooks and gut line caught in the breast feathers
  for (const q of [[940, 520], [1000, 540]]) f.line([q, add(q, [0, 16]), add(q, [-9, 20]), add(q, [-11, 11])], 2.6, P.ironL);

  // ---- the crop: hanging from the throat like a sack, heaviest low and forward, its lower curve uneven where the
  // swallowed things press out (an eel trap, a boot, a hand); the skin stretched thin and half translucent, so their
  // dark shapes show through; veined, stretch-marked and blistered; the feathers thinning to bare pimpled skin round it
  f.bone('crop');
  const cP = [[960, 400], [1080, 360], [1150, 420], [1210, 520], [1290, 610], [1370, 710], [1430, 820], [1462, 930], [1466, 1004], [1432, 1062], [1380, 1090], [1336, 1140], [1270, 1192], [1200, 1214], [1150, 1196], [1100, 1232], [1040, 1228], [980, 1190], [930, 1130], [896, 1050], [888, 960], [880, 860], [904, 720], [930, 560]];
  const cD = f.part(cP, { fill: '#a8968a', shadow: '#4a3a36', light: '#d8c8b8', shade: 0.38, maxShade: 50, tex: 'mottle' + seed, texOp: 0.35, inkW: 2.2, inkHeavy: 4.6, k: 0.9 });
  const cbb = E.bbox(cP);
  const tr = frame([1140, 830], 1.05, 1), bo = frame([1300, 1010], -0.4, 1), hn = frame([1040, 1080], 0.6, 1);
  W.softTone(f, cD, [
    [[[900, 900], [1100, 960], [1420, 980], [1400, 1100], [1200, 1230], [950, 1180]], '#2a1e18', 0.45, 34], // the weight of what is inside, settled low
    [tr([[-170, -56], [140, -18], [164, 0], [140, 18], [-170, 56]]), '#1e140e', 0.55, 7], // the eel trap seen through the skin
    [bo([[-44, -90], [22, -90], [26, 20], [96, 44], [100, 76], [-44, 76]]), '#1e140e', 0.55, 7], // the boot
    [hn([[0, -16], [64, -40], [110, -50], [114, -30], [70, -10], [110, 10], [70, 30], [40, 60], [0, 20]]), '#2a1410', 0.5, 6], // the hand
    [[[940, 420], [1080, 380], [1100, 600], [960, 640]], '#0a0806', 0.5, 20], // the throat in shadow where it hangs from the neck
    [[[1240, 600], [1340, 740], [1380, 900], [1300, 820]], '#f0e4d8', 0.35, 20], // thin stretched skin catching the light
  ]);
  W.stains(f, cD, cbb, P.bileD, 0.016, 4.4, -2.9, 97, 0.3, 3);
  W.stains(f, cD, cbb, '#5a3040', 0.03, 4.4, -2.7, 99, 0.25, 3); // bruised blotches
  { const cid = f.id('cc'); f.defs.push(`<clipPath id="${cid}"><path d="${cD}"/></clipPath>`); f.raw(`<g clip-path="url(#${cid})">`);
    const vein = (p, a, l, w, depth) => { const pts = [p]; let q = p, aa = a; for (let k = 0; k < 4; k++) { aa += (f.r() - 0.5) * 0.7; q = add(q, rot([l / 4, 0], aa)); pts.push(q); } f.line(pts, w + 1.6, '#2a1a20', { op: 0.2 }); f.line(pts, w, f.r() < 0.5 ? '#5a2e3a' : '#3e3a5a', { op: 0.65 }); if (depth > 0) for (let j = 0; j < 2; j++) vein(pts[1 + Math.floor(f.r() * 3)], aa + (f.r() < 0.5 ? -1 : 1) * (0.4 + f.r() * 0.6), l * 0.62, w * 0.62, depth - 1); };
    for (let i = 0; i < 7; i++) vein([940 + i * 40, 520 + i * 30], 1.2 + (f.r() - 0.5) * 0.8, 300 + f.r() * 120, 3.4, 3); // veins spreading down from the throat
    for (let i = 0; i < 40; i++) { const p = W.scatter(f, [1160, 1000], 260, 200), a2 = f.r() * 6.3; f.line([p, add(p, rot([14 + f.r() * 16, 0], a2)), add(p, rot([22 + f.r() * 18, 4], a2))], 1.4, '#ece0d2', { op: 0.45 }); } // stretch marks
    f.raw('</g>'); }
  for (let i = 0; i < 6; i++) W.crease(f, [[960 + i * 10, 440 + i * 40], [1040, 430 + i * 44], [1110 + i * 12, 470 + i * 46]], 3, { lip: 2.4, lit: '#e8dcc8', col: '#2a2018', op: 0.55 }); // loose folds where it hangs from the throat
  const press = pts => { f.line(pts.map(q => add(q, [-4, 6])), 12, '#1a1410', { op: 0.3 }); W.crease(f, pts, 7, { lip: 6, lit: '#fcf0dc', col: '#1e160e', op: 0.75 }); };
  press(tr([[-170, -56], [140, -18], [164, 0]])); for (let i = 0; i < 6; i++) press(tr([[-140 + i * 54, -48 + i * 6], [-134 + i * 54, 0], [-140 + i * 54, 48 - i * 6]])); // the trap's hoops pressing out
  press(bo([[22, 20], [96, 44], [100, 76]])); press(bo([[-44, -90], [22, -90], [26, 20]]));
  for (let i = 0; i < 4; i++) press(hn([[0, 0], [64, -32 + i * 22], [106, -42 + i * 28]])); press(hn([[0, 0], [32, 42], [58, 64]])); // fingers spread against the skin
  for (const [c, r, a2] of [[[1430, 1010], 20, 0.8], [[1060, 1200], 18, 0.2], [[1300, 1150], 16, 0.6], [[1200, 820], 22, -0.6]]) f.flat(ell(c, r, r * 0.35, a2, 10), '#fff8ec', { op: 0.45 }); // tight wet sheen on the bulges
  for (let i = 0; i < 12; i++) { const p = W.scatter(f, [1160, 900], 220, 280); if (X.inside(cP, p)) W.pustule(f, p, 5 + f.r() * 11, { burst: f.r() < 0.35, col: mix(P.bile, '#a8968a', 0.6) }); }
  // the feathers thinning out round the top of the sack: contour feathers from the neck lying over it, then pin feathers
  // and bare pimpled skin where the swelling has pushed the plumage apart
  for (let i = 0; i < 40; i++) { const p = W.scatter(f, [1130, 640], 200, 150); if (!X.inside(cP, p)) continue; const dense = p[1] < 580; if (!dense && f.r() < 0.5) continue; f.flat(ell(p, 2.4, 2, 0, 6), '#5a4440', { op: 0.6 }); if (f.r() < 0.4) { const a2 = 1.7 + (f.r() - 0.5) * 0.8; f.line([p, add(p, rot([12 + f.r() * 10, 0], a2))], 3, '#3a3634'); f.line([add(p, rot([8, 0], a2)), add(p, rot([20, 0], a2))], 1.6, '#b8b4a8', { op: 0.7 }); } } // follicles and pin feathers
  for (let i = 0; i < 5; i++) { const q = lerp([940, 420], [1060, 400], i / 4), qq = add(q, [(f.r() - 0.5) * 30, (f.r() - 0.5) * 40]); X.feather(f, qq, add(qq, rot([40 + f.r() * 70, 0], 1.75 + (f.r() - 0.5) * 0.7)), 18 + f.r() * 12, greyJ(grey, 0.15), { castOp: 0.35, split: f.r() < 0.5 ? 2 : 0 }); } // the last feathers lying over the top of it
  W.drip(f, [1150, 1206], 2.2, '#4a3e36'); W.drip(f, [1270, 1186], 1.6, '#4a3e36');

  // ---- the shallows: black water to the ankles, old moult feathers stuck in the mud round the foot, reeds
  f.bone('root');
  f.flat([[0, gy - 30], [CW, gy - 34], [CW, CH], [0, CH]], P.water, { op: 0.75 });
  W.ripples(f, [SL.T[0] + 60, gy - 20], 260, 10, 4, '#6a6a4a', 0.5);
  for (const [x, a] of [[480, -0.4], [620, 0.3], [1180, -0.2], [1250, 0.5], [1420, 0.1]]) X.plume(f, [[x, gy - 4], [x + 20, gy - 44], [x + 30 + a * 20, gy - 86], [x + 30 + a * 60, gy - 118]], 22, { col: greyL, shadow: '#3a3a36' });
  for (const [x, h] of [[60, 540], [120, 400], [1500, 460], [1560, 320]]) W.reed(f, [[x, gy], [x + 6, gy - h * 0.5], [x - 4, gy - h]], 9, { cattail: h > 420 });
  return f;
}

// ------------------------------------------------------------------ THE STILT HALL (ruler 3.5)
// The stilt villages' moot-hall, where the reeve held court and the eel tithe was stored, and the families who
// sheltered in it when the water turned. A long thatched house standing knee-deep in black water on eight oak piles as
// legs, leaning toward the company; the thatch ridge is cut off by the frame top and the rear gable by the frame edge.
// Its weight sits on the front piles, bowed and splayed under it. Toxin has ripened the piles into legs: the oak swollen
// soft at two points on each into knee-like burls ringed with shelf fungus, mould fur creeping up from the waterline,
// white mycelium threading the timber like veins. The wattle-and-daub walls bulge between the frame posts like a belly
// between ribs, blistered bile green where the daub has split. Water has preserved everything below the thatch: the
// piles tanned black and slick, and the household in the walls, tanned bog-brown and unrotted, pressed half out of the
// daub at the two windows and the open door, still holding what they carried in (a lantern, a swaddled child, a ladle).
// It has no head: the low, wide doorway is its face, and the household stands in it.
// Rig (its own): hall (root, the house body) > thatch, folk (the household's reaching arms), ladder, lantern, traps;
// hall > pile_1..8 _a (from the sill to the upper burl) > _b (to the water); pile_3_a > dog; root: water, punt.
// pile_1 is the front near leg, pile_5 the front far leg.
// Motion: idle a slow creaking shift of weight from pile to pile, water running off the thatch; attack a front pile
// (pile_1) lifted and stamped down on a rank while the household reaches out of the doorway (folk) to pull a hero in.
function stiltHall() {
  const [CW, CH] = TIERS.ruler;
  const f = new Fig(W.base(220, CH, { grimeY: null, wobble: 2.4, inkW: 2.2, inkHeavy: 5 }));
  W.textures(f);
  const seed = 220, gy = CH - 30, yw = 1352;
  const oak = '#241c16', oakL = '#4e4236', daub = '#7a6448', daubD = '#4e3e2c', daubL = '#9a8262', thatchC = '#6e6038', thatchD = '#3e3620';
  const OK = (o = {}) => Object.assign({ fill: oak, shadow: '#060504', light: oakL, shade: 0.4, maxShade: 40, tex: 'wood' + seed, texOp: 0.45 }, o);
  const DB = (o = {}) => Object.assign({ fill: daub, shadow: '#2a1e12', light: daubL, shade: 0.36, maxShade: 50, tex: 'peat' + seed, texOp: 0.5 }, o);
  const SKB = (o = {}) => W.SKT(f, Object.assign({ fill: '#6a4428', shadow: '#24140c' }, o)); // the household's bog-tanned skin
  // the house leans toward the company: every house point is turned about the centre of mass
  const piv = [760, 820], tilt = 0.08, Hs = p => add(piv, rot(sub(p, piv), tilt));
  const HP = pts => pts.map(p => { const q = Hs(p); return p[2] ? [q[0], q[1], 1] : q; });
  // long wall from the rear (cut by the frame) to the near front corner; the front gable end receding to the right
  const sillY = 800, eaveY = 250, corner = 1190, gEnd = 1490, gRise = -72; // the gable end's far edge rises a little (perspective)
  const posts = [-40, 120, 330, 520, 860, 1030, corner];
  const doorL = 520, doorR = 860, lintel = 420;
  // the eight piles: near side under the posts, far side behind and between; the front ones bowed and splayed
  const PILES = [
    { top: [corner - 10, sillY + 4], knee: [1270, 1070], foot: [1360, yw + 60], w: 110, near: true, bow: 46 }, // 1 front near, bowed and splayed
    { top: [860, sillY], knee: [870, 1070], foot: [866, yw + 60], w: 96, near: true, bow: 10 },
    { top: [430, sillY], knee: [420, 1066], foot: [424, yw + 60], w: 94, near: true, bow: 8 },
    { top: [60, sillY], knee: [40, 1060], foot: [30, yw + 60], w: 92, near: true, bow: 6 },
    { top: [gEnd - 20, sillY + gRise], knee: [1560, 1030], foot: [1640, yw + 50], w: 92, near: false, bow: 40 }, // 5 front far
    { top: [1300, sillY + gRise * 0.4], knee: [1330, 1040], foot: [1350, yw + 50], w: 80, near: false, bow: 12 },
    { top: [660, sillY - 30], knee: [650, 1040], foot: [650, yw + 50], w: 76, near: false, bow: 6 },
    { top: [250, sillY - 30], knee: [240, 1036], foot: [236, yw + 50], w: 76, near: false, bow: 6 },
  ].map(p => Object.assign(p, { top: Hs(p.top) }));
  f.joint('hall', piv);
  PILES.forEach((p, i) => { f.joint(`pile_${i + 1}_a`, p.top, 'hall').joint(`pile_${i + 1}_b`, p.knee, `pile_${i + 1}_a`); });
  f.joint('thatch', Hs([600, eaveY]), 'hall').joint('folk', Hs([690, 600]), 'hall').joint('ladder', Hs([620, sillY]), 'hall').joint('lantern', Hs([doorL - 20, 470]), 'hall').joint('traps', Hs([300, eaveY + 30]), 'hall').joint('dog', lerp(PILES[2].top, PILES[2].knee, 0.6), 'pile_3_a');
  f.joint('water', [800, yw]).joint('punt', [180, yw - 20], 'water');

  // ---- a pile leg: black slick oak swollen soft at two burls ringed with shelf fungus, white mycelium in the grain,
  // mould fur creeping up from the waterline, bowed under the weight; drawn as two bones split at the upper burl
  const pile = (i) => {
    const p = PILES[i], far = !p.near, tone = far ? 0.35 : 0, look = OK({ fill: mix(oak, '#000', tone) });
    const lowB = lerp(p.knee, p.foot, 0.72); // the lower burl near the waterline
    const bowPt = (a, b, amt) => add(lerp(a, b, 0.5), [amt, 0]);
    const pts = [p.top, bowPt(p.top, p.knee, p.bow * 0.6), p.knee, bowPt(p.knee, p.foot, p.bow), p.foot];
    const ws = [p.w * 0.9, p.w * 0.88, p.w * 1.08, p.w * 0.86, p.w * 0.84];
    const dk = E.norm(add(E.norm(sub(p.knee, p.top)), E.norm(sub(p.foot, p.knee))));
    split(f, () => {
      const d = f.part(K.chain(pts, ws, { steps: 8, bp: [[2, 0.72, 0.22, 0.06]], bq: [[2, 0.72, 0.2, 0.06]] }), look);
      W.softTone(f, d, [[[lp(p.top, p.foot, 0, -p.w * 0.5), lp(p.top, p.foot, 1, -p.w * 0.5), lp(p.top, p.foot, 1, -p.w * 0.1), lp(p.top, p.foot, 0, -p.w * 0.1)], '#000', 0.55, 10], [[lp(p.top, p.foot, 0, p.w * 0.2), lp(p.top, p.foot, 1, p.w * 0.2), lp(p.top, p.foot, 1, p.w * 0.36), lp(p.top, p.foot, 0, p.w * 0.36)], '#8a7a66', 0.35, 6]]); // the slick sheen
      for (let k = 0; k < 7; k++) { const t0 = f.r() * 0.8, t1 = t0 + 0.1 + f.r() * 0.2, o = (f.r() - 0.5) * p.w * 0.7; f.line([lp(p.top, p.foot, t0, o), lp(p.top, p.foot, (t0 + t1) / 2, o + (f.r() - 0.5) * 8), lp(p.top, p.foot, t1, o)], 1.6, '#000', { op: 0.7 }); } // splits in the grain
      if (!far) for (let k = 0; k < 3; k++) X.mycelium(f, lp(p.top, p.foot, 0.1 + k * 0.3, (f.r() - 0.5) * p.w * 0.4), ang(p.top, p.foot) + (f.r() - 0.5) * 0.6, 90 + f.r() * 60, 2, 1.6);
      // the burls: the oak swollen soft at two points into knee-like knobs, the grain wrapping round them like skin over a
      // knee, creased where they bend, ripened pale and soft in the middle; shelf fungus fans stacked round them
      for (const [c, r, j] of [[p.knee, p.w * 0.74, 0], [lowB, p.w * 0.62, 1]]) {
        const bp = ell(c, r * 1.05, r * 0.92, 0.2, 18).map((q, k) => add(q, mul(sub(q, c), Math.sin(k * 2.3 + i) * 0.1)));
        const bd = f.part(bp, Object.assign({}, look, { cast: true, castOp: 0.4, fill: mix(look.fill, P.peat, 0.25), maxShade: 26, k: 0.9 }));
        W.softTone(f, bd, [[ell(add(c, [r * 0.3, -r * 0.3]), r * 0.5, r * 0.38, 0, 10), '#9a8a6e', 0.4, r * 0.2], [ell(add(c, [-r * 0.3, r * 0.4]), r * 0.75, r * 0.45, 0, 10), '#000', 0.55, r * 0.2]]);
        for (let k = 1; k <= 3; k++) f.line(ell(c, r * (1 - k * 0.2), r * 0.88 * (1 - k * 0.2), 0.2, 16).slice(k, 10 + k), 1.6, '#000', { op: 0.6 }); // the grain wrapping round
        W.crease(f, [add(c, [-r * 0.9, r * 0.45]), add(c, [-r * 0.3, r * 0.78]), add(c, [r * 0.45, r * 0.62])], 3.6, { lip: 2.4, lit: '#7a6a56', col: '#000' }); // the crease under it, as behind a knee
        W.crease(f, [add(c, [-r * 0.8, -r * 0.6]), add(c, [-r * 0.2, -r * 0.8]), add(c, [r * 0.5, -r * 0.64])], 3, { lip: 2.2, lit: '#7a6a56', col: '#000', op: 0.6 });
        f.flat(ell(add(c, [r * 0.18, 0]), r * 0.32, r * 0.22, 0.3, 10).map((q, k) => k % 2 ? add(q, [(f.r() - 0.5) * 4, (f.r() - 0.5) * 4]) : q), mix(P.bileD, '#6a5a40', 0.4), { op: 0.5 }); // ripened soft
        X.mouldFur(f, ell(c, r * 0.95, r * 0.82, 0.2, 10).slice(5, 9), 10, { n: 10, blob: false });
        if (!far || i === 4) for (const sg of [1, -1]) for (let k = (j ? 1 : 2); k >= 0; k--) { const w0 = r * (1.05 - k * 0.22) * (sg > 0 ? 1 : 0.85); X.fan(f, add(c, [sg * r * (0.72 + k * 0.06), -r * 0.5 + k * r * 0.4]), w0, sg * 0.4 + (f.r() - 0.5) * 0.2, [mix(P.cap, P.peat, 0.45), mix(P.cap, P.bileD, 0.5), '#6e5232'][(k + i) % 3], { h: 0.4 }); } // fans stacked round it, breaking the leg's outline
        if (!far) X.fan(f, add(c, [-r * 0.1, r * 0.15]), r * 0.55, 0.1, mix(P.cap, P.peat, 0.35), { h: 0.4 });
      }
      // mould fur creeping up from the waterline; leeches on the lower pile
      const wl = (yw - p.top[1]) / (p.foot[1] - p.top[1]);
      X.mouldFur(f, [lp(p.top, p.foot, wl - 0.02, -p.w * 0.45), lp(p.top, p.foot, wl - 0.02, p.w * 0.45)], 30, { n: 36 });
      W.stains(f, d, E.bbox(pts.map(q => q).concat([add(p.foot, [p.w, 0]), add(p.top, [-p.w, 0])])), '#a8ae8a', 0.05, 4.6, -3.0, 101 + i, far ? 0.15 : 0.3, 3);
      if (!far) for (let k = 0; k < 2; k++) { const a = lp(p.top, p.foot, wl - 0.16 - k * 0.1, (k ? -1 : 1) * p.w * 0.22); X.leech(f, [add(a, [0, 40]), add(a, [6, 20]), a], 22, { fat: true }); }
    }, [[`pile_${i + 1}_a`, side(p.knee, mul(dk, -1), p.w * 0.6)], [`pile_${i + 1}_b`, side(p.knee, dk, p.w * 0.6)]]);
  };

  // ---- the far piles first, behind the house body
  for (const i of [7, 6, 5, 4]) pile(i);
  // the broken punt jammed between two of the rear legs at the waterline
  f.bone('punt');
  const pu = [[-20, yw - 60], [380, yw - 120], [400, yw - 70], [360, yw - 30], [-20, yw + 10]];
  f.part(pu, { fill: '#3a2e22', shadow: '#0e0a06', shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.8 });
  for (let k = 0; k < 3; k++) f.line([[0, yw - 50 + k * 18], [370, yw - 108 + k * 22]], 1.8, '#0e0a06', { op: 0.6 });
  f.part([[380, yw - 120], [430, yw - 170, 1], [440, yw - 130], [400, yw - 70]], { fill: '#4a3c2c', shade: 0.4, inkW: 1.4, cast: false }); // the broken prow
  W.mossClump(f, [200, yw - 90], 60, 10);

  // ---- the house body: the sill beam, the daub panels bulging between the frame posts like a belly between ribs
  f.bone('hall');
  const wallP = HP([[-60, eaveY - 20], [corner, eaveY + 10], [corner, sillY + 6], [-60, sillY - 6]]);
  f.part(wallP, DB({ fill: daubD, cast: false }));
  // the front gable end, in shadow, receding to the right
  const gP = HP([[corner, eaveY + 10], [gEnd, eaveY + 10 + gRise], [gEnd, sillY + gRise], [corner, sillY + 6]]);
  const gD = f.part(gP, DB({ fill: mix(daub, daubL, 0.2), cast: false }));
  
  // daub panels: each bulges out between its posts, lit in the middle, shadowed at the edges; cracks, blisters, holes
  const panel = (x0, x1, y0, y1, o = {}) => {
    const m = 10 + f.r() * 8, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const pts = HP([[x0 + 8, y0 + 6], [cx, y0 - 4], [x1 - 8, y0 + 6], [x1 - 2, cy], [x1 - 8, y1 - 6], [cx, y1 + 10], [x0 + 8, y1 - 6], [x0 + 2, cy]]);
    const d = f.part(pts, DB(o.look || {}));
    W.softTone(f, d, [[HP(ell([cx - (x1 - x0) * 0.1, cy + (y1 - y0) * 0.18], (x1 - x0) * 0.42, (y1 - y0) * 0.42, 0, 12)), '#000', 0.0, 8], [HP([[x0, y0], [x0 + m * 2, y0], [x0 + m * 2, y1], [x0, y1]]), '#0a0604', 0.6, 14], [HP([[x0, y1 - 30], [x1, y1 - 30], [x1, y1], [x0, y1]]), '#0a0604', 0.5, 14], [HP(ell([cx + (x1 - x0) * 0.08, cy - (y1 - y0) * 0.12], (x1 - x0) * 0.26, (y1 - y0) * 0.24, 0, 12)), '#e8cca0', 0.35, 20]]);
    W.stains(f, d, E.bbox(pts), '#1e140a', 0.012, 4.2, -2.2, 111 + x0 % 17, 0.5, 3);
    // the crack network where the daub has split, wattle showing through the worst of it
    for (let k = 0; k < 4; k++) { let q = Hs([x0 + 20 + f.r() * (x1 - x0 - 40), y0 + 20 + f.r() * (y1 - y0 - 40)]); const cr = [q]; let a = f.r() * 6.3; for (let j = 0; j < 5; j++) { a += (f.r() - 0.5) * 1.4; q = add(q, rot([20 + f.r() * 20, 0], a)); if (!X.inside(pts, q)) break; cr.push(q); } if (cr.length > 1) { f.line(cr, 2.4, '#140c06', { op: 0.85 }); f.line(cr.map(c => add(c, [-1.5, 2])), 1, daubL, { op: 0.5 }); } }
    if (o.wattle) { const wc = Hs(o.wattle); f.flat(ell(wc, 34, 24, 0.2, 12).map((q, k) => k % 2 ? add(q, [(f.r() - 0.5) * 10, (f.r() - 0.5) * 10]) : q), '#140c06'); for (let k = 0; k < 4; k++) { const y = wc[1] - 16 + k * 10; f.line([[wc[0] - 26, y], [wc[0] - 8, y + (k % 2 ? 4 : -4)], [wc[0] + 10, y], [wc[0] + 26, y + (k % 2 ? -4 : 4)]], 3.4, '#6a5634'); } for (let k = 0; k < 3; k++) f.line([[wc[0] - 18 + k * 18, wc[1] - 22], [wc[0] - 18 + k * 18, wc[1] + 22]], 3, '#4a3a22'); }
    if (o.sod) { const sc = Hs(o.sod); f.part(ell(sc, 40, 30, 0.1, 10).map(q => add(q, [(f.r() - 0.5) * 10, (f.r() - 0.5) * 8])), { fill: P.peat, shadow: '#120c06', shade: 0.45, tex: 'peat' + seed, texOp: 0.95, inkW: 1.4, k: 0.6 }); W.mossClump(f, add(sc, [0, -24]), 30, 8); } // a hole patched with a peat sod
    for (let k = 0; k < (o.blisters ?? 5); k++) { const q = Hs([x0 + 20 + f.r() * (x1 - x0 - 40), y0 + 30 + f.r() * (y1 - y0 - 60)]); W.pustule(f, q, 7 + f.r() * 12, { burst: f.r() < 0.3, col: mix(P.bile, daub, 0.25) }); }
    return d;
  };
  panel(posts[0], posts[1], eaveY + 10, sillY, { blisters: 4, sod: [40, 640] });
  panel(posts[1], posts[2], eaveY + 12, sillY, { blisters: 3 }); // window 1 is cut through this one
  panel(posts[2], posts[3], eaveY + 14, sillY, { blisters: 6, wattle: [430, 660] });
  panel(doorL, doorR, eaveY + 16, lintel - 20, { blisters: 4 }); // over the door
  panel(posts[4], posts[5], eaveY + 18, sillY, { blisters: 5, sod: [946, 330] });
  panel(posts[5], posts[6], eaveY + 18, sillY, { blisters: 6, wattle: [1110, 680] });
  // the gable end: one wide panel, the second window in it
  const gpts = HP([[corner + 10, eaveY + 20], [gEnd - 10, eaveY + 20 + gRise], [gEnd - 10, sillY + gRise - 10], [corner + 10, sillY - 4]]);
  const gpD = f.part(gpts, DB({ fill: mix(daub, daubL, 0.45) })); // the front gable faces the key light: lit, so the hall turns at the corner
  W.stains(f, gpD, E.bbox(gpts), '#1e140a', 0.012, 4.2, -2.2, 131, 0.5, 3);
  for (let k = 0; k < 6; k++) W.pustule(f, Hs([corner + 40 + f.r() * 240, eaveY + 60 + f.r() * 460 + gRise * f.r()]), 7 + f.r() * 10, { burst: f.r() < 0.3, col: mix(P.bile, daub, 0.35) });

  // ---- the windows and the door: dark openings, and the household pressed half out of the daub round them
  const opening = (pts) => { f.flat(HP(pts), '#0a0705'); f.part(HP([pts[0], add(pts[0], [22, 18]), add(pts[3], [22, -2]), pts[3]]), DB({ fill: mix(daub, '#000', 0.15), cast: false, shade: 0.3, maxShade: 6, inkW: 1, inkHeavy: 1.2 })); f.flat(HP([pts[0], pts[1], add(pts[1], [-4, 18]), add(pts[0], [22, 18])]), '#1a120a', { op: 0.9 }); // the reveal: the thickness of the wall
    W.softTone(f, E.smooth(HP(pts), true, 0.3), [[HP(pts.map((q, k) => add(q, [k < 2 ? 0 : 0, k < 2 ? 0 : -30]))), '#2a1e14', 0.4, 16]]); };
  // a household face: B.head tanned bog-brown, eyes shut, lips shrunk back, wet clumped hair, half sunk in daub
  const folkHead = (c, Hh, a, o = {}) => {
    const k = o.kind || 'man', lw = Math.max(1.4, Hh * 0.022);
    const P0 = { man: { jaw: 1.15, nose: 1.0, hook: 0.15, browDown: 0.12, chin: 0.02 }, old: { jaw: 0.95, nose: 1.1, hook: 0.35, browDown: 0.04, chin: 0.04 }, child: { jaw: 0.86, nose: 0.7, hook: 0, browDown: 0.02, chin: -0.02 }, mother: { jaw: 1.0, nose: 0.9, hook: 0.1, browDown: 0.06, chin: 0 } }[k];
    const N = frame(c, a, Hh); f.part(N([[-0.16, 0.25], [0.2, 0.3], [0.22, 0.85], [-0.18, 0.85]]), SKB({ cast: false, maxShade: 6 })); // the neck, cords standing out of it
    f.line(N([[-0.02, 0.42], [0.02, 0.6], [0.04, 0.82]]), lw * 1.4, '#140a04', { op: 0.55 }); f.line(N([[0.15, 0.44], [0.13, 0.62], [0.15, 0.82]]), lw * 1.1, '#140a04', { op: 0.45 }); f.line(N([[0.05, 0.5], [0.08, 0.7]]), lw, '#c49a6a', { op: 0.35 });
    const F = X.face(f, c, Hh, a, Object.assign({ skin: '#6a4428', mouth: 'set', blind: true, squint: 0.9, gaunt: true, jawShade: 0.55, hairCol: '#2a1810', noEar: o.noEar }, P0), { lit: '#c49a6a', stainCol: '#1e100a' });
    f.flat(F(leather_(Hh)), `url(#leather${seed})`, { op: 0.5 });
    // sockets sunk round the shut lids, the brow ridge over them catching the light
    f.flat(F(ell([0.13, -0.04], 0.09, 0.065, 0.1, 10)), '#120804', { op: 0.6 }); f.flat(F(ell([0.3, -0.04], 0.045, 0.06, 0, 8)), '#120804', { op: 0.5 });
    f.line(F([[0.03, -0.13], [0.14, -0.15], [0.26, -0.13], [0.33, -0.1]]), lw * 1.3, '#d0a878', { op: 0.5 });
    f.line(F([[0.07, -0.04], [0.13, -0.015], [0.19, -0.045]]), lw, INK); f.line(F([[0.27, -0.04], [0.32, -0.03]]), lw * 0.9, INK); // shut lids
    W.crease(f, F([[0.06, 0.0], [0.13, 0.03], [0.2, 0.0]]), lw * 0.8, { lip: lw * 0.6, lit: '#c49a6a', col: '#140a04', op: 0.6 }); // the bag under the eye
    // the cheekbone lit and the hollow under it, the temple sunk
    f.flat(F(ell([0.16, 0.07], 0.09, 0.028, -0.25, 8)), '#d8a878', { op: 0.4 }); f.flat(F(ell([0.12, 0.18], 0.085, 0.055, -0.2, 8)), '#120804', { op: k === 'child' ? 0.25 : 0.5 }); f.flat(F(ell([-0.06, -0.12], 0.07, 0.09, 0, 8)), '#120804', { op: 0.35 });
    // the fold from the nose to the mouth, the lips shrunk back off the teeth, the chin
    W.crease(f, F([[0.25, 0.1], [0.2, 0.18], [0.19, 0.25]]), lw * 1.3, { lip: lw, lit: '#c49a6a', col: '#140a04' });
    const gape = k === 'old' ? 0.07 : k === 'child' ? 0.02 : 0.035;
    f.flat(F([[0.17, 0.26], [0.32, 0.255], [0.31, 0.28 + gape], [0.24, 0.29 + gape * 1.2], [0.18, 0.285 + gape]]), '#140804');
    for (let j = 0; j < (k === 'old' ? 2 : 4); j++) { const x = 0.19 + j * 0.03 + (k === 'old' ? j * 0.04 : 0); f.flat(F([[x, 0.262], [x + 0.022, 0.26], [x + 0.02, 0.28], [x + 0.002, 0.282]]), '#8a7a58'); } // stained teeth, gaps
    f.line(F([[0.17, 0.255], [0.25, 0.245], [0.32, 0.25]]), lw * 1.2, '#3a1a0e', { op: 0.8 }); // the lip, shrunk back
    W.crease(f, F([[0.2, 0.39], [0.26, 0.41], [0.31, 0.38]]), lw, { lip: lw * 0.8, lit: '#c49a6a', col: '#140a04', op: 0.6 });
    if (k === 'man') for (let j = 0; j < 30; j++) f.flat(F(ell([0.05 + f.r() * 0.27, 0.3 + f.r() * 0.18], 0.006, 0.006, 0, 4)), '#140a04', { op: 0.6 }); // stubble
    // hair plastered flat to the skull, wet clumps hanging plumb (long and thin on the old woman, a kerchief on the mother)
    if (k === 'mother') { f.part(F([[-0.42, 0.1], [-0.46, -0.24], [-0.3, -0.52], [0.04, -0.6], [0.26, -0.5], [0.32, -0.34], [0.12, -0.36], [-0.1, -0.3], [-0.22, -0.06], [-0.26, 0.3], [-0.36, 0.4]]), { fill: '#5a4a34', shadow: '#1a120a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.2, cast: false }); X.folds(f, [F([[-0.3, -0.4], [-0.36, -0.1], [-0.34, 0.2]]), F([[-0.1, -0.5], [-0.2, -0.3]])], 2.2, { lit: '#9a8668' }); X.holes(f, F([[-0.3, 0.1]])[0], 6, 10, 1, { r0: 3, r1: 5 }); }
    else { f.part(F([[-0.4, 0.06], [-0.44, -0.24], [-0.28, -0.5], [0.04, -0.56], [0.24, -0.46], [0.3, -0.32], [0.1, -0.38], [-0.12, -0.32], [-0.24, -0.12], [-0.3, 0.06]]), { fill: k === 'old' ? '#4a3a2a' : '#2a1810', shadow: '#0a0604', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, inkW: 1.1, cast: false });
      const nh = o.hair ?? (k === 'old' ? 8 : k === 'child' ? 4 : 6), hl = k === 'old' ? 0.9 : k === 'child' ? 0.25 : 0.45;
      for (let j = 0; j < nh; j++) { const p = F([[-0.36 + j * 0.07, -0.4 + Math.abs(j - 3) * 0.03]])[0]; W.hairClump(f, [p, add(p, [-4, Hh * hl * 0.45]), add(p, [-8 - j * 2, Hh * hl])], Hh * (k === 'old' ? 0.06 : 0.09), { n: 3, pal: k === 'old' ? ['#3a2e22', '#4a3a2a', '#5a4a38'] : undefined }); } }
    return F;
  };
  const leather_ = Hh => X.faceOutline({ jaw: 1.05 });
  // a cracked rim of daub round a body pressing out of the wall
  const daubRim = (c, rx, ry) => { const e = ell(c, rx, ry, 0, 20).map((q, k) => k % 2 ? add(q, mul(sub(q, c), 0.12 * f.r())) : q); f.line(e.concat([e[0]]), 7, '#140c06', { op: 0.8 }); f.line(e.slice(0, 12).map(q => add(q, [-2, 3])), 2, daubL, { op: 0.6 }); for (let k = 0; k < 6; k++) { const q = e[Math.floor(f.r() * e.length)]; f.line([q, add(q, mul(sub(q, c), 0.25 + f.r() * 0.2))], 2, '#140c06', { op: 0.75 }); } };

  // window 1 (long wall): a mother pressed half out of the daub, the swaddled child in her arms
  const w1 = [[150, 390], [300, 384], [306, 600], [146, 606]];
  opening(w1);
  { const c = Hs([226, 470]); daubRim(Hs([224, 560]), 120, 150);
    f.part(HP([[150, 520], [190, 500], [270, 500], [304, 540], [306, 610], [146, 612]]), SKB({ fill: '#5a3a22' })); // shoulders, the rest still in the daub
    folkHead(c, 112, 0.12, { noEar: true, kind: 'mother' });
    const sw = Hs([238, 576]); // the swaddled child: a bundle of rotted linen, a small brown face
    f.part(ell(sw, 64, 34, -0.3, 14), { fill: '#8a7a5a', shadow: '#2a2214', shade: 0.42, tex: 'weave' + seed, texOp: 0.6, inkW: 1.6 });
    for (let k = 0; k < 4; k++) f.line([add(sw, [-50 + k * 26, -20]), add(sw, [-40 + k * 26, 24])], 1.6, '#2a2214', { op: 0.6 });
    f.part(ell(add(sw, [34, -12]), 20, 17, 0, 10), SKB({ cast: false })); f.line([add(sw, [30, -14]), add(sw, [40, -14])], 1.4, INK); f.line([add(sw, [32, -4]), add(sw, [40, -6])], 1.2, INK, { op: 0.6 });
    for (const dx of [-30, 20]) { const h0 = add(sw, [dx, 26]); f.part(ell(h0, 22, 13, 0.3, 10), SKB({ cast: false })); for (let k = 0; k < 4; k++) f.line([add(h0, [-14 + k * 8, -6]), add(h0, [-12 + k * 8, 8])], 1.2, INK, { op: 0.7 }); } // her hands round it, knuckles
  }
  // window 2 (gable end): the man pressed out of the daub, still holding up the lantern he carried in, long dead
  const w2 = [[1290, 400], [1410, 390], [1414, 580], [1292, 590]];
  opening(w2);
  { const c = Hs([1346, 468]); daubRim(Hs([1350, 540]), 100, 140);
    f.part(HP([[1290, 520], [1330, 500], [1390, 500], [1416, 540], [1416, 596], [1290, 600]]), SKB({ fill: '#4a2e1a' }));
    folkHead(c, 104, -0.05, { noEar: true });
    const lt = Hs([1400, 540]); f.line([add(lt, [0, -30]), lt], 3, P.iron); W.lantern(f, lt, 52, { glow: false });
    f.flat(E.ell(add(lt, [0, 38]), 18, 22, 0, 10), '#2a1e14', { op: 0.75 }); // dark, long out
    const hh = add(lt, [-2, -34]); f.part(ell(hh, 16, 20, 0, 10), SKB({ cast: false })); for (let k = 0; k < 3; k++) f.line([add(hh, [-10, -8 + k * 8]), add(hh, [10, -8 + k * 8])], 1.2, INK, { op: 0.7 });
  }
  // the door: low and wide, its face; the household standing in it
  const dP = [[doorL + 6, lintel], [doorR - 6, lintel], [doorR - 4, sillY], [doorL + 4, sillY]];
  opening(dP);

  W.softTone(f, E.smooth(wallP, true, 0), [[HP([[-60, eaveY - 20], [corner - 30, eaveY + 10], [corner - 30, sillY + 6], [-60, sillY - 6]]), '#0a0604', 0.28, 30], [HP([[corner - 90, eaveY], [corner, eaveY], [corner, sillY], [corner - 90, sillY]]), '#0a0604', 0.3, 30]]); // the long wall turned away from the light, darkest toward the corner
  // ---- the frame posts: black slick oak standing proud of the daub, mould and mycelium in the grain; the sill beam
  for (const x of posts) { const a = Hs([x, eaveY - 10]), b = Hs([x, sillY + 20]); f.part([add(a, [-30, 6]), add(a, [-20, 0]), add(b, [-22, 0]), add(b, [-32, 6])], OK({ fill: mix(oak, '#000', 0.5), cast: false, inkW: 1, maxShade: 4 })); const d = f.part(limb(a, b, 46, 50, { steps: 10, capK: 0.3 }), OK()); W.softTone(f, d, [[[add(a, [-23, 0]), add(b, [-25, 0]), add(b, [-6, 0]), add(a, [-6, 0])], '#000', 0.5, 6]]); f.line([add(a, [12, 6]), add(b, [12, -6])], 2.2, '#8a7a66', { op: 0.35 }); X.mycelium(f, lerp(a, b, 0.3 + f.r() * 0.4), Math.PI / 2 + (f.r() - 0.5) * 0.4, 60, 2, 1.4); }
  for (const [x, dy] of [[1340, gRise * 0.5], [gEnd - 4, gRise]]) { const a = Hs([x, eaveY + dy]), b = Hs([x, sillY + dy + 20]); f.part(limb(a, b, 40, 44, { steps: 10, capK: 0.3 }), OK({ fill: mix(oak, '#000', 0.3) })); }
  f.part(HP([[-60, sillY - 14], [corner + 20, sillY - 4], [corner + 20, sillY + 34], [-60, sillY + 22]]), OK());
  f.part(HP([[corner, sillY - 4], [gEnd, sillY + gRise - 10], [gEnd, sillY + gRise + 20], [corner, sillY + 34]]), OK({ fill: mix(oak, '#000', 0.3) }));
  f.part(HP([[-60, eaveY - 30], [corner + 20, eaveY - 6], [corner + 20, eaveY + 26], [-60, eaveY + 4]]), OK()); // the wall plate under the eaves
  f.part(HP([[doorL - 10, lintel - 24], [doorR + 10, lintel - 24], [doorR + 10, lintel + 8], [doorL - 10, lintel + 8]]), OK()); // the lintel
  X.mouldFur(f, HP([[0, sillY + 30], [corner, sillY + 36]]), 24, { n: 60 });
  f.part(HP([[-60, sillY - 26], [corner + 20, sillY - 16], [corner + 20, sillY - 4], [-60, sillY - 14]]), OK({ fill: mix(oakL, oak, 0.4), cast: false, inkW: 1, maxShade: 3 })); // the sill's top face catching the light
  for (const x of [20, 190, 380, 560, 780, 960, 1130]) { const q = Hs([x, sillY + 34]); f.part([add(q, [-22, -4]), add(q, [22, -4]), add(q, [24, 38]), add(q, [-20, 40])], OK({ cast: true, castOp: 0.5, maxShade: 8 })); f.part(ell(add(q, [2, 18]), 16, 18, 0, 12), { fill: '#5a4a36', shadow: '#1a120a', shade: 0.4, maxShade: 4, inkW: 1, cast: false }); for (let r = 1; r < 4; r++) f.line(ell(add(q, [2, 18]), 16 - r * 4, 18 - r * 4.5, 0, 12).concat([ell(add(q, [2, 18]), 16 - r * 4, 18 - r * 4.5, 0, 12)[0]]), 0.9, '#1a120a', { op: 0.6 }); f.line([add(q, [2, 18]), add(q, [12, 30])], 1.4, '#0a0604'); } // the floor joists' cut ends through the sill
  W.softTone(f, E.smooth(HP([[-60, eaveY - 40], [gEnd, eaveY - 40 + gRise], [gEnd, sillY + gRise], [-60, sillY]]), true, 0), [[HP([[-60, eaveY - 40], [gEnd, eaveY - 40 + gRise], [gEnd, eaveY + 110 + gRise], [-60, eaveY + 80]]), '#000', 0.6, 22]]); // the deep shadow under the overhanging eaves
  // the carved ward-sign over the door, split by a bracket fungus
  { const c = Hs([690, lintel - 70]);
    f.part([add(c, [-90, -34]), add(c, [90, -40]), add(c, [96, 30]), add(c, [-92, 34])], { fill: '#5a4a34', shadow: '#1a120a', shade: 0.42, tex: 'wood' + seed, texOp: 0.6, inkW: 1.8 });
    for (const s0 of [[[-70, 0], [-40, -20], [-10, 0], [-40, 20], [-70, 0]], [[20, -16], [40, 14], [60, -16]], [[66, 10], [80, -10]]]) f.line(s0.map(q => add(c, q)), 3.4, '#1a120a', { op: 0.85 }); // the carved sign, worn
    f.line([add(c, [0, -40]), add(c, [6, -6]), add(c, [-2, 34])], 3, '#0a0604');
    W.bracket(f, add(c, [4, -20]), -1.3, 60, 3); }
  // the reeve's notched tally sticks nailed beside the door
  for (let k = 0; k < 4; k++) { const a = Hs([doorR + 34 + k * 26, 470 + k * 8]), b = Hs([doorR + 40 + k * 26, 640 + k * 10]); X.tally(f, a, b, 16, 9); f.rivet(lerp(a, b, 0.08), 4, P.ironL); }

  // ---- the household in the doorway: pressed half out of the daub of the jambs, the old woman with her ladle, the
  // child, the reeve's man; the smoke-blackened kettle on its chain just inside. Their arms are on `folk`.
  { const kt = Hs([760, lintel + 30]); f.line([kt, add(kt, [0, 90])], 3, P.iron); for (let k = 0; k < 5; k++) f.line(ell(add(kt, [0, 10 + k * 16]), 5, 8, 0, 8).concat([ell(add(kt, [0, 10 + k * 16]), 5, 8, 0, 8)[0]]), 2.4, P.iron);
    f.part([add(kt, [-50, 100]), add(kt, [50, 100]), add(kt, [60, 150]), add(kt, [40, 190]), add(kt, [-40, 190]), add(kt, [-60, 150])], { fill: '#1e1a16', shadow: '#000', shade: 0.4, inkW: 1.6, tex: 'mottle' + seed, texOp: 0.5, light: '#4a443c' });
    f.line([add(kt, [-50, 100]), add(kt, [0, 70]), add(kt, [50, 100])], 3, P.iron); f.flat(ell(add(kt, [0, 100]), 46, 8, 0, 12), '#0a0806'); }
  const fd1 = Hs([590, 520]), fd2 = Hs([700, 560]), fd3 = Hs([808, 510]);
  daubRim(Hs([576, 640]), 90, 210); daubRim(Hs([820, 630]), 86, 200);
  // their bodies: rotted clothes over tanned skin, the lower half still swallowed by the daub of the jambs and sill
  const cloth = (pts, col, fl) => { const d = f.part(HP(pts), { fill: col, shadow: '#0e0a06', shade: 0.42, maxShade: 30, tex: 'weave' + seed, texOp: 0.55 }); const cb = E.bbox(HP(pts)); X.holes(f, [(cb[0] + cb[2]) / 2, (cb[1] + cb[3]) / 2 + 20], (cb[2] - cb[0]) * 0.3, 30, 2, { r0: 3, r1: 7 }); W.softTone(f, d, [[HP([pts[0], pts[1], pts[2], add(pts[2], [0, 40]), add(pts[0], [0, 40])]), '#000', 0.0, 4], [HP([add(pts[1], [6, 6]), add(pts[2], [-6, 6]), add(pts[2], [-10, 40]), add(pts[1], [10, 40])]), '#d8c8a0', 0.18, 8]]); X.clothWear(f, d, E.bbox(HP(pts)), { stain: '#0a0604', wear: '#9a8668', seed: 141 + pts[0][0] % 9 }); X.folds(f, fl.map(l => HP(l)), 2.8, { lit: '#9a8668' }); return d; };
  cloth([[526, 590], [560, 556], [620, 556], [656, 600], [664, 700], [640, sillY], [526, sillY]], '#3a3024', [[[560, 600], [570, 700], [560, 780]], [[610, 590], [630, 690]], [[536, 620], [544, 760]]]); // the old woman's shawl
  cloth([[650, 650], [682, 620], [728, 620], [762, 656], [758, sillY], [650, sillY]], '#6e6248', [[[690, 660], [694, 760]], [[730, 650], [740, 760]]]); // the child's linen shirt
  cloth([[768, 566], [800, 544], [852, 552], [860, 620], [856, sillY], [768, sillY]], '#4a3a26', [[[800, 580], [790, 700], [800, 790]], [[840, 590], [846, 720]]]); // the man's wool tunic
  for (const [x, w] of [[590, 150], [704, 120], [814, 110]]) { const dm = HP([[x - w * 0.6, sillY], [x - w * 0.5, sillY - 70 - f.r() * 30], [x - w * 0.1, sillY - 110], [x + w * 0.3, sillY - 80], [x + w * 0.6, sillY - 40], [x + w * 0.6, sillY]]); const dd = f.part(dm, DB({ fill: mix(daubD, '#1a120a', 0.25), cast: false, shade: 0.3, maxShade: 20 })); W.stains(f, dd, E.bbox(dm), '#0a0604', 0.03, 4.2, -2.4, 171 + x % 7, 0.5, 3); for (let k = 0; k < 3; k++) { let q = lerp(dm[1], dm[3], 0.2 + k * 0.3); const cr = [q]; for (let j = 0; j < 4; j++) { q = add(q, [(f.r() - 0.5) * 30, 14 + f.r() * 10]); cr.push(q); } f.line(cr, 2.2, '#0a0604', { op: 0.8 }); } W.pustule(f, lerp(dm[2], dm[4], 0.5), 8, { col: mix(P.bile, daub, 0.3) }); W.softTone(f, dd, [[dm.slice(0, 3).concat([add(dm[0], [0, -10])]), '#0a0604', 0.5, 10]]); for (let k = 0; k < 3; k++) W.crease(f, [lerp(dm[1], dm[2], 0.3 + k * 0.2), add(lerp(dm[1], dm[2], 0.3 + k * 0.2), [6, 30])], 2.2, { lip: 1.6, lit: daubL, col: '#140c06' }); } // the daub swallowing them to the waist
  folkHead(fd1, 100, 0.18, { kind: 'old' });
  folkHead(fd2, 80, 0.06, { kind: 'child' });
  folkHead(fd3, 104, -0.04, { kind: 'man' });
  // ---- the household's arms reaching out of the doorway (the attack pulls a hero inside); the ladle in the old woman's fist
  f.bone('folk');
  const reach = (S0, E0, W0, ws, col, o = {}) => {
    const look = SKB({ fill: col, maxShade: 10 }), de = X.elb(S0, E0, W0);
    // skin shrunk tight on the bone: a thin upper arm, the elbow a hard knob, the forearm hollow between its two bones,
    // knobbed at the wrist, the tendons standing out toward the knuckles
    const ad = f.part(K.chain([S0, E0, lerp(E0, W0, 0.5), W0], [ws[0], ws[1] * 1.04, ws[1] * 0.74, ws[2] * 1.02], { steps: 8, bq: [[0, 0.5, 0.12, 0.2]] }), look);
    f.flat(ad, `url(#leather${seed})`, { op: 0.5 });
    W.softTone(f, ad, [[[lp(S0, E0, 0, -ws[0] * 0.5), lp(E0, W0, 1, -ws[2] * 0.5), lp(E0, W0, 1, -ws[2] * 0.1), lp(S0, E0, 0, -ws[0] * 0.1)], '#0a0604', 0.45, 6], [[lp(S0, E0, 0.1, ws[0] * 0.3), lp(E0, W0, 0.9, ws[2] * 0.3), lp(E0, W0, 0.9, ws[2] * 0.1), lp(S0, E0, 0.1, ws[0] * 0.1)], '#d8a878', 0.25, 4]]);
    f.part(ell(add(E0, mul(de, ws[1] * 0.34)), ws[1] * 0.26, ws[1] * 0.2, ang(S0, E0), 10), Object.assign({}, look, { cast: false, inkW: 0.9, inkHeavy: 1.2, maxShade: 3 })); // the point of the elbow
    W.creaseField(f, E0, ws[1] * 0.2, ws[1] * 0.2, 3, ang(S0, E0) + 1.5, ws[1] * 0.7, 1.6, { lip: 1.2, lit: '#a07a50', col: '#140a04' });
    f.line([lp(E0, W0, 0.12, ws[1] * 0.24), lp(E0, W0, 0.95, ws[2] * 0.26)], 1.8, '#d8a878', { op: 0.45 }); // the ridge of the ulna
    f.line([lp(E0, W0, 0.18, -ws[1] * 0.02), lp(E0, W0, 0.55, -ws[1] * 0.06), lp(E0, W0, 0.95, -ws[2] * 0.04)], 2.2, '#140a04', { op: 0.6 }); // the hollow between the bones
    for (const off of [0.08, -0.16]) f.line([lp(E0, W0, 0.55, ws[1] * off), lp(E0, W0, 1.02, ws[2] * off * 1.4)], 1.2, '#140a04', { op: 0.45 }); // tendons
    f.flat(ell(lp(E0, W0, 0.93, ws[2] * 0.36), ws[2] * 0.14, ws[2] * 0.1, 0, 8), '#d8a878', { op: 0.45 }); // the wrist bone
    f.line([lp(S0, E0, 0.1, ws[0] * 0.2), lp(S0, E0, 0.85, ws[1] * 0.2)], 1.4, '#140a04', { op: 0.45 });
    // the rotted sleeve end round the upper arm, and the daub cracked open where the arm has pulled out of the wall
    W.mudSplats(f, lerp(S0, E0, 0.12), ws[0] * 0.5, ws[0] * 0.4, 6, daubD); f.line([lp(S0, E0, 0.08, ws[0] * 0.6), lp(S0, E0, 0.14, 0), lp(S0, E0, 0.08, -ws[0] * 0.6)], 3, '#0a0604', { op: 0.6 }); // daub still caked on the arm where it pulled out of the wall
    if (o.grip) return B.grip(f, W0, E0, o.grip, ws[2] * 0.95, col, { shadow: '#24140c', tex: 'wrinkle' + seed, texOp: 0.6, name: o.name });
    const h = B.hand(f, add(W0, rot([ws[2] * 0.4, 0], ang(E0, W0))), ang(E0, W0) + (o.turn || 0), ws[2] * 1.05, col, { spread: 0.55, curl: 0.45, shadow: '#24140c' });
    h.tips.forEach(t => { const d = E.norm(sub(t, W0)); f.part([add(t, mul([-d[1], d[0]], 2.6)), add(t, mul(d, 14)), add(t, mul([-d[1], d[0]], -2.6))], { fill: '#8a7a5a', shade: 0.4, inkW: 0.8, cast: false, hatch: false }); }); // long nails
  };
  const lS = Hs([640, 600]), lE = Hs([700, 690]), lW = Hs([780, 660]);
  { const fa = ang(lE, lW), la = fa - Math.PI / 2, dl = rot([1, 0], la), l0 = add(lW, mul(dl, -50)), l1 = add(lW, mul(dl, 130));
    f.part(limb(l0, l1, 12, 10, { steps: 8 }), { fill: '#7a6448', shadow: '#2a1e12', shade: 0.4, inkW: 1.2, tex: 'wood' + seed, texOp: 0.5 });
    f.part(ell(add(l1, mul(dl, 18)), 32, 22, la, 12), { fill: '#6a5638', shadow: '#1e160c', shade: 0.42, inkW: 1.4 }); f.flat(ell(add(l1, mul(dl, 20)), 20, 12, la, 10), '#140e08');
    reach(lS, lE, lW, [40, 34, 28], '#5a3a22', { grip: la, name: 'folk ladle', sleeve: '#3a3024' }); } // the ladle in the old woman's fist, raised
  reach(Hs([600, 600]), Hs([640, 700]), Hs([730, 720]), [36, 32, 26], '#4e3220', { turn: 0.4, sleeve: '#3a3024' });
  reach(Hs([800, 600]), Hs([880, 640]), Hs([980, 610]), [44, 38, 30], '#4a2e1c', { turn: -0.2, sleeve: '#4a3a26' });
  reach(Hs([700, 650]), Hs([760, 710]), Hs([850, 740]), [28, 24, 20], '#5a3a24', { turn: 0.2, sleeve: '#6e6248' });

  // ---- the hags' horn lantern on its iron hook at the door, lit: the one point of lantern amber
  f.bone('lantern');
  { const hk = Hs([doorL - 30, 450]); f.line([add(hk, [24, 0]), hk, add(hk, [0, 20]), add(hk, [8, 26])], 6, P.iron); f.line([add(hk, [24, 0]), hk, add(hk, [0, 20])], 2, P.ironL, { op: 0.5 }); W.lantern(f, add(hk, [8, 26]), 70, { glowOp: 0.22 }); }
  // ---- the rope ladder hanging from the door sill down toward the water, its rungs swollen
  f.bone('ladder');
  { const top0 = Hs([600, sillY + 20]), top1 = Hs([690, sillY + 20]), bot0 = [622, yw - 60], bot1 = [716, yw - 40];
    for (const [a, b] of [[top0, bot0], [top1, bot1]]) W.rope(f, [a, add(lerp(a, b, 0.5), [6, 0]), b], 6, { col: P.ropeD, fray: true });
    for (let k = 1; k < 8; k++) { const a = lerp(top0, bot0, k / 8), b = lerp(top1, bot1, k / 8 + 0.02); f.part(limb(a, b, 22, 20, { steps: 4, capK: 0.8, p: [[0.5, 0.25, 0.25]] }), { fill: '#5a4a34', shadow: '#1a120a', shade: 0.42, inkW: 1.4, tex: 'wood' + seed, texOp: 0.5, cast: false }); if (k % 3 === 1) X.mouldFur(f, [a, b], 10, { n: 8 }); } }

  // ---- the thatch: slumped reed, furred with moss, the eave edge sagging and dripping, toadstools fruiting along it;
  // the willow eel traps hung under the eaves with the tithe eels dried to black strips inside
  f.bone('traps');
  for (const x of [20, 70, 352, 430, 950, 1100]) { const k = x % 3, top = Hs([x, eaveY + 30]), m = add(top, [-6, 110 + k * 16]); f.line([top, add(top, [0, 20])], 3, P.ropeD); const td = X.eelTrap(f, m, add(top, [2, 20]), 34, 10, { col: '#6a5a3c' }); X.eel(f, [add(m, [-10, 36]), add(m, [-4, 14]), add(m, [-2, 0])], 14, { dried: true }); X.eel(f, [add(m, [16, 30]), add(m, [8, 12]), add(m, [4, -2])], 12, { dried: true }); }
  f.bone('thatch');
  const eave = []; for (let k = 0; k <= 14; k++) { const x = -80 + k * (gEnd + 140) / 14; eave.push(Hs([x, eaveY + 10 + Math.sin(k * 1.3) * 18 + (k % 3 === 1 ? 26 : 0) + (x > corner ? gRise * (x - corner) / (gEnd - corner) : 0)])); }
  const thP = [Hs([-80, -60]), Hs([gEnd + 80, -60 + gRise]), ...eave.slice().reverse()];
  const thD = f.part(thP, { fill: thatchC, shadow: thatchD, shade: 0.38, maxShade: 60, tex: 'moss' + seed, texOp: 0.35, inkW: 2.4, inkHeavy: 5, k: 0.8 });
  W.softTone(f, thD, [[eave.map(q => add(q, [0, -60])).concat(eave.slice().reverse()), '#0a0804', 0.6, 20], [[Hs([-80, -60]), Hs([gEnd, -60]), Hs([gEnd, 60]), Hs([-80, 60])], '#d8c890', 0.25, 30]]);
  // reed strands combed down the slope in clumps, the butts of the reeds forming the eave edge
  for (let k = 0; k < 170; k++) { const x = -60 + f.r() * (gEnd + 100), y0 = -40 + f.r() * 250, a = Math.PI / 2 + 0.5 + tilt + (f.r() - 0.5) * 0.25, q = Hs([x, y0]); if (!X.inside(thP, q)) continue; for (let j = 0; j < 4; j++) { const qq = add(q, [j * 5, j * 2]), l = 16 + f.r() * 22; f.stroke([qq, add(qq, rot([l * 0.5, 0], a)), add(qq, rot([l, 0], a))], 3.2, j % 2 ? '#a89a62' : '#2a2412', { op: 0.55 }); } } // reed butts in combed clumps down the slope
  for (let k = 0; k < eave.length - 1; k++) for (let j = 0; j < 8; j++) { const q = lerp(eave[k], eave[k + 1], j / 8); f.line([add(q, [0, -16]), add(q, [2, 0])], 2.2, '#1e1a0e', { op: 0.7 }); }
  // moss mats and the sag of the slump
  W.stains(f, thD, E.bbox(thP), P.mossD, 0.008, 4.6, -2.0, 151, 0.7, 4); W.stains(f, thD, E.bbox(thP), P.mossL, 0.03, 4.4, -2.8, 153, 0.4, 3); // moss furring the slump
  const und = eave.map(q => add(q, [0, 64])).concat(eave.slice().reverse()); f.part(und, { fill: '#1e1a0e', shadow: '#000', shade: 0.3, inkW: 1.6, cast: false, tex: 'moss' + seed, texOp: 0.3 }); // the thick underside of the eave overhang
  for (let k = 0; k < eave.length - 1; k++) { const q = add(lerp(eave[k], eave[k + 1], 0.5), [0, 30]); if (k % 1 === 0) { f.part([add(q, [-14, -10]), add(q, [14, -12]), add(q, [16, 26]), add(q, [-12, 28])], OK({ cast: true, castOp: 0.5, maxShade: 6 })); f.flat(ell(add(q, [1, 8]), 10, 12, 0, 10), '#4a3c2c'); f.line(ell(add(q, [1, 8]), 5, 6, 0, 8).concat([ell(add(q, [1, 8]), 5, 6, 0, 8)[0]]), 0.9, '#140c06', { op: 0.7 }); } } // the rafter feet under the overhang
  for (let k = 0; k < eave.length - 1; k++) for (let j = 0; j < 4; j++) { const q = add(lerp(eave[k], eave[k + 1], j / 4), [0, 64]); f.line([q, add(q, [(f.r() - 0.5) * 6, 10 + f.r() * 26])], 1.8, f.r() > 0.5 ? '#4a4228' : P.mossD, { op: 0.85 }); } // reed ends and moss hanging plumb off the eave
  W.crease(f, HP([[100, 120], [400, 150], [700, 110], [1000, 160]]), 6, { lip: 4, lit: '#c8b880', col: '#14100a', op: 0.7 });
  // toadstools fruiting along the slump and the hip over the gable, a crop of them up the corner
  for (let k = 0; k < 6; k++) W.toadstools(f, Hs([60 + k * 260, 40 + f.r() * 60]), -1.6 + (f.r() - 0.5) * 0.3, 40 + f.r() * 16, 3);
  W.toadstools(f, Hs([corner + 120, 120 + gRise]), -1.4, 50, 4);
  // water running off the eave edge in drips (idle)
  for (let k = 0; k < 16; k++) { const q = eave[1 + Math.floor(f.r() * (eave.length - 2))]; W.drip(f, add(q, [(f.r() - 0.5) * 30, 60 + f.r() * 50]), 1.4, '#3a3a2a'); }

  // ---- the near piles in front of the house body, and the drowned dog hanging by its rope from one of them
  for (const i of [3, 2, 1, 0]) pile(i);
  f.bone('pile_1_a'); // the hag's twine charm of frog bones knotted round the front-left leg
  { const c = lerp(PILES[0].top, PILES[0].knee, 0.45); W.rope(f, [add(c, [-52, -6]), add(c, [0, 8]), add(c, [52, -2])], 4, { col: P.ropeD }); for (let k = 0; k < 3; k++) X.frogCharm(f, add(c, [-30 + k * 30, 4]), 50 + k * 16, { s: 1.6, n: 2 }); }
  f.bone('dog');
  { const p = PILES[2], r0 = lerp(p.top, p.knee, 0.6); W.rope(f, [add(r0, [-46, 0]), add(r0, [0, 10]), add(r0, [46, 0])], 5, { col: P.ropeD }); W.rope(f, [add(r0, [40, 2]), add(r0, [56, 60]), add(r0, [60, 120])], 5, { col: P.ropeD });
    const dc = add(r0, [64, 210]), D = frame(dc, Math.PI / 2 - 0.06, 1); // hanging head down by the neck rope: tanned and shrunk, legs stiff
    const dog = D([[-90, -30], [-40, -40], [30, -36], [80, -24], [96, 0], [80, 24], [20, 30], [-40, 28], [-90, 20]]);
    const dd = f.part(dog, SKB({ fill: '#4a3020', shadow: '#140a04' }));
    f.flat(dd, `url(#leather${seed})`, { op: 0.6 });
    for (let k = 0; k < 5; k++) W.crease(f, D([[-50 + k * 22, -34], [-46 + k * 22, 0], [-50 + k * 22, 26]]), 2.4, { lip: 2, lit: '#a07a50', col: '#0e0804', op: 0.7 }); // ribs through the hide
    f.part(D([[-110, -16], [-150, -20], [-176, -6], [-170, 12], [-136, 18], [-100, 12]]), SKB({ fill: '#4a3020', cast: false })); // the head, the muzzle down
    f.flat(D(ell([-150, -4], 4, 3, 0, 6)), INK); for (let k = 0; k < 4; k++) f.flat(D([[-168 + k * 7, 10], [-163 + k * 7, 10], [-165 + k * 7, 18]]), '#b8a880');
    f.part(D([[-112, -22], [-118, -44], [-100, -26]]), SKB({ fill: '#3a2418', cast: false })); // ear
    for (const [u, v, a] of [[60, -30, -0.4], [70, 26, 0.5], [-30, -34, -0.2], [-20, 28, 0.3]]) f.part(limb(D([[u, v]])[0], add(D([[u, v]])[0], rot([70, 0], Math.PI / 2 - 0.06 + Math.PI + a * 0.6)), 16, 10, { steps: 5, capK: 1 }), SKB({ fill: '#3e281a', cast: false })); // legs stiff
    f.line(D([[96, 0], [130, 6], [150, 20]]), 6, '#3a2418'); }

  // ---- the black water the hall stands knee-deep in: covers the piles' feet; mould scum, ripples where they go in
  f.bone('water');
  f.part([[0, yw], [CW, yw], [CW, CH], [0, CH]], { fill: P.water, shadow: P.water, light: P.waterM, shade: 0.1, inkW: 0, cast: false, hatch: false, gritOp: 0.25, noShade: true });
  f.flat([[0, yw], [CW, yw], [CW, yw + 40], [0, yw + 30]], '#2a2216', { op: 0.4 });
  for (const p of PILES) { W.ripples(f, [p.foot[0], yw + 6], p.w * 0.8, 6, 3, '#6a6a4a', p.near ? 0.55 : 0.35); f.line([[p.foot[0] - p.w * 0.6, yw + 2], [p.foot[0] + p.w * 0.6, yw + 2]], 3, '#8a8a62', { op: 0.5 }); }
  f.line([[0, yw], [CW, yw]], 1.6, '#6a6a4a', { op: 0.5 });
  for (const p of PILES) { const x = p.foot[0]; for (let k = 0; k < 7; k++) { const y = yw + 20 + k * 30, w = p.w * (0.6 - k * 0.05); f.line([[x - w / 2 + Math.sin(k) * 8, y], [x + w / 2 + Math.sin(k) * 8, y + 2]], 6 - k * 0.6, p.near ? '#1e1a12' : '#141210', { op: 0.8 - k * 0.09 }); f.line([[x + w * 0.2, y + 4], [x + w * 0.4, y + 5]], 1.4, '#6a6a4a', { op: 0.4 - k * 0.04 }); } } // the legs' broken reflections
  { const pts = HP([[200, sillY + 60], [600, sillY + 60]]); for (let k = 0; k < 4; k++) f.line([[180 + k * 260, yw + 70 + k * 20], [360 + k * 260, yw + 74 + k * 20]], 3, '#2a2418', { op: 0.6 }); } // the hall's dim reflection
  for (const [x, w] of [[300, 120], [900, 160], [1400, 100]]) f.line([[x, yw + 40], [x + w, yw + 40]], 1.2, '#5a5a40', { op: 0.35 });
  W.bubbles(f, [1250, yw - 10], 5, 30, 40, 1.4);
  for (const [x, h] of [[120, 260], [180, 200], [1520, 240], [1060, 160]]) W.reed(f, [[x, yw + 30], [x + 4, yw - h * 0.5], [x - 4, yw - h]], 8, { cattail: h > 220 });
  return f;
}

// thin line (fishing line, gut line)
function rope0(f, pts, w) { f.line(pts, w + 1, INK, { op: 0.8 }); f.line(pts, w, '#b8aa88'); }

module.exports = {
  heroes: [
    { key: 'stilt_hall', name: 'The Stilt Hall', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: stiltHall },
    { key: 'old_heron', name: 'The Old Heron', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: oldHeron },
    { key: 'tithe_reeve', name: 'The Tithe Reeve', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: titheReeve },
    { key: 'midden_sow', name: 'The Midden Sow', tier: 'elite', w: 1700, h: TIERS.elite[1], flip: true, build: middenSow },
    { key: 'eel_catcher', name: 'Eel-Catcher', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: eelCatcher },
    { key: 'stilt_fowler', name: 'Stilt-Fowler', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: stiltFowler },
    { key: 'turf_wife', name: 'Turf-Wife', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: turfWife },
    { key: 'frog_catcher', name: 'Frog-Catcher', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: frogCatcher },
    { key: 'lantern_gnats', name: 'Lantern Gnats', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: lanternGnats },
    { key: 'sin_eater', name: 'Sin-Eater', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: sinEater },
    { key: 'leech_barber', name: 'Leech-Barber', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: leechBarber },
  ],
};
