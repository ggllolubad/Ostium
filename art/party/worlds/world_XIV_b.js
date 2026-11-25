// World XIV, The Blighted Garden (Toxin + Void, Blight), second batch: the eleven later entries of the bible file.
// Matches the first batch (world_XIV.js, reviewed twice): its kit (kit_XIV through kit_XIV_b), its palette (sick pastel
// blooms, pink, lilac and pale yellow, desaturated toward ink, over black loam; plus ink black, bone and grey; no red, no
// gold), its toxin marks (fungus shaded with dark undersides and cast shadows, a different kind per host, clusters of
// skewed sizes; mould bloom, pustules, galls, peeling; never slime or glow) and its void marks (clean round holes with
// clean rims; real lidded eyes in the growth where the bible calls for them: XIV is a void world).
// Foes face left: every figure is drawn facing right with kit.foeBase (through kit_XIV.base: key light upper right in
// drawing space, upper left after the flip) and flipped. Built for the rig: joints first, f.bone() before every part,
// parts drawn whole, overlaps at the joints, shoulder growth on the torso.
// Seeds 1420 + index in the bible order: Lady of the Bower 1420, Green Lion 1421, Lady's Fool 1422, Truffle Boar 1423,
// Scarecrow 1424, Blight Snails 1425, Flower-Strewer 1426, Mole-Catcher 1427, Pond Swan 1428, Orchard Picker 1429,
// Beekeeper 1430.
'use strict';
const K = require('../kit');
const X = require('./kit_XIV_b');
const { E, B, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang, R, clipDraw, softTone, crease, stains, spline, ribbon } = X;

// shared looks
// (independent review) B.head with a warm skin shadow: the figure's purple shadow tint made the face's cel band read as
// stubble on the jaw; it is swapped for a warm loam brown only while the head is drawn
const headW = (f, ...a) => { const t = f.o.shadowTint; f.o.shadowTint = '#8a5a48'; const r = B.head(f, ...a); f.o.shadowTint = t; return r; };
const SKIN = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.36, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o);
const LEATH = (f, o = {}) => Object.assign({ fill: P.loamL, shadow: P.loamD, light: P.loamB, shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.6 }, o);
const LINEN = (f, o = {}) => Object.assign({ fill: mix(P.bone, P.grey, 0.45), shadow: mix(P.greyS, P.loamD, 0.3), light: P.boneL, shade: 0.4, tex: 'weave' + f.o.seed, texOp: 0.55 }, o);
const IRON = (f, o = {}) => Object.assign({ fill: '#4a4848', shadow: '#151415', light: '#8a8886', shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.7, inkW: 1.2, inkHeavy: 1.8 }, o);
const WOOD = (f, o = {}) => Object.assign({ fill: P.loamBL, shadow: P.loamBS, light: mix(P.loamBL, P.bone, 0.4), shade: 0.42, tex: 'grain' + f.o.seed, texOp: 0.6 }, o);

// ------------------------------------------------------------------ MOLE-CATCHER (cast, human 0.95)
// The garden's molecatcher, paid a penny a mole. He crouches low over a fresh molehill, the far knee down on its leather
// pad and the near knee up, weight in the bent knees, the long narrow-bladed mole spade raised in both fists to stab
// straight down into the run. Wiry and weathered: a squint, a long nose, a stubbled jaw, earth in the wrinkles, the head
// cocked down over the hill, listening. A soft lilac hump of brain fungus has grown on his upper back and split the
// jerkin; his hands are swollen with pustules; a clean round hole passes through his left (far) palm, so the spade's
// shaft shows through the back of that fist. His tally, the string of moles at his belt, has grown together into one
// furred, fungal mass with little spade-hands and snouts still in it, and it twitches. Leather jerkin over a linen smock,
// leather knee pads, gaiters caked in loam to the knee, iron scissor traps clipped to the belt, a bag of bait worms, a
// felt hat with a moleskin band.
// Toxin: the brain-fungus hump, pustules on the hands, mould bloom on smock and jerkin, the fused moles furred with
// hyphae. Void: the hole through the far palm; an eye opened in the fungal hump and one in the mass of moles.
// Rig: standard humanoid + spade (parent hand_n; both fists hold it: the far arm needs IK onto the shaft) + skirt
// (pelvis) + moles (pelvis) + hat (head). Motion: idle listening, head cocked (head, hat); attack a sudden two-handed
// spade stab (arms and spade drive down).
function moleCatcher() {
  const seed = 1427, W = 640, h = 820;
  const f = new Fig(X.base(seed, h, { grimeY: 600 })); X.texturesB(f);
  const H = 95, gy = f.o.groundY;
  const skin = mix(P.skin, P.loamB, 0.35), skinS = mix(P.skinS, P.loamD, 0.3);
  const SK = (o = {}) => SKIN(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const SMOCK = (o = {}) => LINEN(f, Object.assign({ fill: mix(P.grey, P.loamB, 0.22), light: mix(P.grey, P.bone, 0.5), maxShade: 14 }, o));
  const JERK = (o = {}) => LEATH(f, Object.assign({ fill: mix(P.loamL, P.loamB, 0.35) }, o));
  const Pv = [232, 556], N0 = [316, 402];
  const S = B.spine(N0, [250, 452], Pv, H);
  const HC = [352, 360], hA = 0.78;
  const SN = [306, 424], EN = [408, 504], WN = [528, 448];
  const SF = [334, 412], EF = [424, 424], WF = [518, 346];
  const HN = [248, 560], KN = [372, 590], AN = [356, 738];
  const HF = [222, 552], KF = [292, 758], AF = [180, 744];
  const top = [514, 296], tip = [548, 662], sd = E.norm(sub(tip, top)), upA = Math.atan2(-sd[1], -sd[0]);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('spade', WN, 'hand_n').joint('skirt', S.at(0, 0.9), 'pelvis').joint('moles', S.at(-0.55, 0.95), 'pelvis').joint('hat', add(HC, [-10, -40]), 'head');

  // ---- far leg: the knee down on its pad, the shin along the ground, the foot on its toes behind
  X.mLeg(f, HF, KF, AF, [74, 50, 36], LEATH(f, { fill: mix(P.loam, P.loamL, 0.45) }), { sfx: '_f', bare: false, build: 'lean' });
  f.bone('shin_f');
  { const g0 = lerp(KF, AF, 0.3); const gn = E.norm(sub(AF, KF)), gN = [-gn[1], gn[0]];
    f.part([add(g0, mul(gN, 24)), add(g0, mul(gN, -22)), add(AF, mul(gN, -20)), add(AF, mul(gN, 22))], LEATH(f, { fill: mix(P.loamL, P.loam, 0.4), inkW: 1.3, k: 0.6 }));
    for (let i = 0; i < 3; i++) f.rivet(lerp(add(g0, mul(gN, 18)), add(AF, mul(gN, 16)), 0.15 + i * 0.3), 2, P.greyD); }
  f.part(ell(add(KF, [8, -6]), 24, 17, 0.3, 14), LEATH(f, { fill: P.loamB })); // the knee pad, ground into the loam
  f.line(ell(add(KF, [8, -6]), 17, 11, 0.3, 14).slice(1, 9), 1, P.loamBL, { op: 0.6, dash: '2 2' });
  f.bone('foot_f');
  { const toe = [AF[0] - 6, gy]; f.part([[AF[0] + 20, AF[1] - 18], [AF[0] + 28, AF[1] + 10], [AF[0] + 6, gy - 2], [AF[0] - 52, gy - 2, 1], [AF[0] - 60, gy - 18], [AF[0] - 30, AF[1] - 12]], LEATH(f, { fill: '#2c241e', shade: 0.4 })); f.line([[AF[0] - 56, gy - 3], [AF[0] + 8, gy - 3]], 3, '#120e0c'); f.flat(ell(toe, 30, 4, 0, 10), P.loamD, { op: 0.5 }); }

  // ---- far arm: smock sleeve, the forearm to the upper fist on the spade's crutch
  X.mArm(f, SF, EF, lerp(EF, WF, 0.72), [44, 38, 32], SMOCK({ fill: mix(P.grey, P.loamD, 0.25) }), { sfx: '_f', bare: false });
  f.bone('forearm_f');
  X.mArm(f, lerp(EF, WF, 0.5), lerp(EF, WF, 0.72), WF, [32, 30, 26], SK({ fill: mix(skin, '#000', 0.15) }), { build: 'lean' });
  f.part(K.ragLimb(f, lerp(EF, WF, 0.3), lerp(EF, WF, 0.58), 44, 42, { depth: 6, teeth: 5 }), SMOCK({ fill: mix(P.grey, P.loamD, 0.2), cast: false }));

  // ---- the fungal hump, drawn before the torso so the split jerkin sits over its root
  f.bone('torso');
  const humpC = S.at(-0.72, 0.28);
  X.brainFungus(f, humpC, 66, 54, { col: P.lilac });
  X.eye(f, add(humpC, [6, -10]), 15, -0.5, { open: 0.55, lid: P.lilac, lidS: P.lilacS });
  X.spores(f, add(humpC, [-10, -60]), 40, 22, 8);

  // ---- torso: the linen smock, the leather jerkin over it, split open by the hump
  const tor = S.shape([[-0.04, 0.36, 0.3], [0.12, 0.62, 0.5], [0.32, 0.66, 0.6], [0.55, 0.56, 0.56], [0.8, 0.54, 0.56], [1.02, 0.58, 0.58]]);
  f.part(tor, SMOCK({ maxShade: 20 }));
  const jk = S.shape([[0.0, 0.44, 0.3], [0.14, 0.66, 0.44], [0.34, 0.7, 0.52], [0.56, 0.6, 0.5], [0.8, 0.58, 0.5], [1.06, 0.62, 0.48]]);
  const jd = f.part(jk, JERK({ maxShade: 22 }));
  clipDraw(f, jd, () => {
    softTone(f, jd, [[[S.at(-0.9, 0.3), S.at(-0.3, 0.3), S.at(-0.3, 1.1), S.at(-0.9, 1.1)], '#000', 0.3, 12], [[S.at(0.1, 0.05), S.at(0.5, 0.1), S.at(0.5, 0.45), S.at(0.1, 0.4)], P.loamBL, 0.3, 10]]);
    stains(f, jd, E.bbox(jk), P.loamD, 0.03, 2.6, -1.3, 7, 0.6);
    X.fold(f, [S.at(-0.4, 0.4), S.at(-0.2, 0.55), S.at(0.0, 0.62)], 2.4, { dk: P.loamD, lt: P.loamBL });
    X.fold(f, [S.at(-0.5, 0.7), S.at(-0.2, 0.78), S.at(0.2, 0.8)], 2.2, { dk: P.loamD, lt: P.loamBL });
    X.fold(f, [S.at(0.2, 0.5), S.at(0.34, 0.66), S.at(0.4, 0.86)], 2, { dk: P.loamD, lt: P.loamBL });
    f.scratches(S.at(-0.1, 0.5), 30, 6, P.loamBL, 0.8);
    f.line([S.at(-0.1, 0.02), S.at(-0.2, 0.5), S.at(-0.14, 1.0)], 1.4, P.loamD, { op: 0.7 }); f.stitches([S.at(-0.14, 0.04), S.at(-0.24, 0.5), S.at(-0.18, 1.0)], P.loamBL, 0.8); // the side seam
    { const pc = [S.at(0.06, 0.62), S.at(0.34, 0.6), S.at(0.36, 0.84), S.at(0.08, 0.86)]; f.part(pc.map(q => [...q, 1]), JERK({ fill: mix(P.loamB, P.loamL, 0.3), cast: false, inkW: 1.1 })); f.stitches([...pc, pc[0]], P.loamBL, 0.8); } // a patch over a tear
    f.flat(ell(S.at(0.3, 0.3), 14, 10, 0.4, 10), P.loamBL, { op: 0.35 }); // rubbed pale where the spade handle rests
    X.mould(f, S.at(-0.2, 0.7), 16, 12, { col: P.lilac, op: 0.7 });
  });
  f.line([S.at(0.36, 0.12), S.at(0.5, 0.5), S.at(0.52, 0.95)], 1.8, INK, { op: 0.7 }); // the jerkin's front edge
  for (let i = 0; i < 4; i++) f.line([S.at(0.5, 0.2 + i * 0.2), S.at(0.6, 0.22 + i * 0.2)], 2, P.loamD); // laced
  // the jerkin split over the hump: torn lips, hyphae
  f.part([S.at(-0.5, 0.06), S.at(-0.66, 0.12), S.at(-0.74, 0.44), S.at(-0.6, 0.5), S.at(-0.5, 0.3)], JERK({ fill: mix(P.loamL, P.loamD, 0.3), cast: false, inkW: 1.2 }));
  X.fungalFur(f, [S.at(-0.5, 0.06), S.at(-0.54, 0.3), S.at(-0.6, 0.5)], 7, 1);

  // ---- belt: iron scissor traps clipped on, the worm bag, the fused moles hanging behind the hip
  f.bone('pelvis');
  X.rope(f, [S.at(-0.66, 0.92), S.at(-0.1, 0.96), S.at(0.6, 0.92)], 6, P.loamB, { lit: false });
  f.part([S.at(-0.66, 0.88), S.at(0.6, 0.88), S.at(0.6, 0.97), S.at(-0.66, 0.97)], LEATH(f, { fill: P.loam, cast: false, inkW: 1.2 }));
  f.part(ell(S.at(0.2, 0.92), 9, 7, 0, 8), IRON(f, { cast: false })); // the buckle
  // the worm bag: a small leather bag at the front, drawstring, earth on it, a worm hanging out
  { const b0 = S.at(0.4, 1.0); const bag = [add(b0, [-16, -4]), add(b0, [14, -6]), add(b0, [22, 20]), add(b0, [16, 44]), add(b0, [-10, 46]), add(b0, [-20, 22])];
    f.part(bag, LEATH(f, { fill: mix(P.loamB, P.loamL, 0.5) })); f.line([add(b0, [-14, 2]), add(b0, [12, 0])], 2, P.loamD);
    f.stroke([add(b0, [8, 4]), add(b0, [20, 14]), add(b0, [18, 30]), add(b0, [24, 40])], 5, P.pinkD); f.line([add(b0, [12, 8]), add(b0, [20, 18])], 0.8, P.pinkL, { op: 0.6 }); }
  // two iron scissor traps clipped to the belt over the hip: crossed jaws, a spring loop, rust
  for (const [q, a] of [[S.at(-0.2, 1.0), 0.3], [S.at(0.05, 1.02), -0.15]]) {
    const F = frame(q, a + Math.PI / 2, 1);
    for (const sg of [-1, 1]) { f.part(F([[0, sg * 4], [52, sg * -10], [58, sg * -6], [6, sg * 8]]), IRON(f, { cast: true, castOp: 0.3 })); f.part(F([[52, sg * -10], [62, sg * -2], [58, sg * 4], [50, sg * -4]]), IRON(f, { fill: '#5a4a40', cast: false })); }
    f.line(F(ell([-4, 0], 7, 9, 0, 10)).concat([F(ell([-4, 0], 7, 9, 0, 10))[0]]), 2.6, '#3a3838');
    f.flat(F(ell([24, 0], 4, 3, 0, 6)), '#5a4434', { op: 0.7 });
  }
  // the moles: the tally string grown together into one furred, fungal lump, little spade-hands and snouts in it
  f.bone('moles');
  { const m0 = S.at(-0.55, 0.95);
    // the tally string, and the moles on it hung head-down, grown into each other with grey fungal flesh between them
    const M = [[-4, 40, 0.15, 1.0], [-30, 70, -0.25, 0.9], [4, 86, 0.3, 1.05], [-20, 116, 0.05, 0.85], [8, 134, 0.4, 0.75]].map(([dx, dy, a, k]) => [add(m0, [dx, dy]), a, k]);
    X.rope(f, [m0, add(m0, [-4, 20]), add(m0, [-10, 60]), add(m0, [-6, 120])], 2.6, P.loamB, { lit: false });
    const web = [add(m0, [-16, 22]), add(m0, [14, 26]), add(m0, [24, 70]), add(m0, [26, 120]), add(m0, [16, 150]), add(m0, [-24, 140]), add(m0, [-50, 96]), add(m0, [-44, 54])];
    const wd = f.part(X.lumpy(f, web, 7), { fill: mix('#4a4650', P.lilacD, 0.3), shadow: '#121016', light: '#7a7480', shade: 0.42, tex: 'mfur' + seed, texOp: 0.95, maxShade: 16 });
    clipDraw(f, wd, () => X.mould(f, add(m0, [-10, 96]), 26, 30, { col: mix(P.lilac, P.grey, 0.35), op: 0.8 }));
    for (const [c, a, k] of M) {
      const F = frame(c, a + Math.PI / 2, k); // local +x points down the body to the snout
      const body = F([[-22, 0], [-16, -13], [0, -16], [16, -12], [24, -4], [26, 4], [16, 12], [0, 15], [-16, 12]]);
      const bd = f.part(body, { fill: '#38363a', shadow: '#0e0c10', light: '#6e6a72', shade: 0.45, tex: 'mfur' + seed, texOp: 0.9, maxShade: 9 * k, inkW: 1.1, inkHeavy: 1.8, cast: true, castOp: 0.35 });
      clipDraw(f, bd, () => { for (let i = 0; i < 12; i++) { const q = F([[R(f, -18, 20), R(f, -12, 12)]])[0]; f.line([q, add(q, rot([4 * k, 0], a + Math.PI / 2))], 1, f.r() > 0.5 ? '#7a7680' : '#0e0c10', { op: 0.6 }); } });
      f.part(F([[24, -4], [38, -1], [40, 1], [24, 5]]), { fill: P.pinkD, shadow: P.pinkS, shade: 0.35, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); // the pointed snout
      for (const sg of [-1, 1]) { const hc = F([[10, sg * 16]])[0]; f.part(ell(hc, 7 * k, 5 * k, a, 8), { fill: mix(P.pink, P.skin, 0.4), shadow: P.pinkS, shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false }); for (let j = -2; j <= 2; j++) { const q = add(hc, rot([5 * k, j * 2.4 * k], a + Math.PI / 2 + sg * 0.9)); f.line([q, add(q, rot([4 * k, 0], a + Math.PI / 2 + sg * 0.9))], 1.1, P.boneL); } } // the broad spade-hands, claws pale
    }
    X.eye(f, add(m0, [-22, 96]), 12, 0.3, { open: 0.35, lid: '#5a5660', lidS: '#141216' });
    X.fungalFur(f, web.slice(2, 7), 7, 1, { gaps: 0.4 });
    X.caps(f, add(m0, [20, 70]), -0.4, 26, 3, { cols: [P.lilac, P.lilacL], fan: 0.5, sw: 0.14 }); }

  // ---- near leg: the knee up, the gaiter caked in loam, the boot planted
  X.mLeg(f, HN, KN, AN, [80, 54, 38], LEATH(f, { fill: mix(P.loam, P.loamL, 0.6) }), { sfx: '_n', bare: false });
  f.bone('shin_n');
  { const g0 = lerp(KN, AN, 0.28), gn = E.norm(sub(AN, KN)), gN = [-gn[1], gn[0]], gait = [add(g0, mul(gN, 27)), add(g0, mul(gN, -25)), add(AN, mul(gN, -24)), add(add(AN, mul(gN, 26)), mul(gn, 6))];
    const gd = f.part(gait, LEATH(f, { fill: mix(P.loamL, P.loamB, 0.25), inkW: 1.3, k: 0.6 }));
    for (let i = 0; i < 4; i++) f.rivet(lerp(add(g0, mul(gN, 20)), add(AN, mul(gN, 20)), 0.1 + i * 0.27), 2.2, P.greyD);
    stains(f, gd, E.bbox(gait), P.loamD, 0.05, 3, -1.2, 23, 0.85); }
  f.part(ell(add(KN, [12, -4]), 25, 19, 0.9, 14), LEATH(f, { fill: P.loamB })); // knee pad
  f.line(ell(add(KN, [12, -4]), 18, 13, 0.9, 14).slice(2, 10), 1, P.loamBL, { op: 0.6, dash: '2 2' });
  f.line([add(KN, [-24, 14]), add(KN, [-36, 30])], 3, P.loamD); // its strap
  X.bootRig(f, KN, AN, 50, '#2c241e', '_n', { tex: 'mottle' + seed, shaft: 0.4, toe: 1.15 });

  // ---- the smock's skirt hanging below the jerkin, draped over the raised near thigh, loam to the hem
  f.bone('skirt');
  { const sk = [S.at(-0.7, 0.86), S.at(0.62, 0.86), add(KN, [-6, -30]), ...X.hemLine(f, add(KN, [-30, 2]), [166, 630], 9, 9), [172, 580]];
    const skd = f.part(X.lumpy(f, sk, 3), SMOCK({ maxShade: 18 }));
    clipDraw(f, skd, () => { softTone(f, skd, [[[[150, 560], [250, 560], [240, 660], [150, 660]], '#000', 0.35, 12], [[S.at(0.2, 0.9), add(KN, [-20, -40]), add(KN, [-40, -10]), S.at(0.0, 1.0)], P.boneL, 0.3, 10]]);
      // folds: pulled taut from the belt over the raised knee, hanging slack and bunched behind it
      for (const [a, b, w] of [[S.at(0.3, 0.9), add(KN, [-30, -16]), 4], [S.at(0.0, 0.92), add(KN, [-50, 6]), 3.6], [S.at(0.45, 0.9), add(KN, [-14, -26]), 3]]) X.fold(f, [a, lerp(a, b, 0.5), b], w, { dk: P.greyS, lt: P.boneL });
      for (const [x, y, l] of [[300, 590, 34], [268, 586, 44], [236, 580, 54], [204, 574, 56], [180, 580, 40]]) X.fold(f, [[x, y], [x - 4, y + l * 0.5], [x - 2, y + l]], 3.6, { dk: P.greyS, lt: P.boneL });
      X.fold(f, [[190, 600], [230, 612], [280, 606]], 3, { dk: P.greyS, lt: P.boneL });
      stains(f, skd, [150, 520, 400, 660], P.loamD, 0.035, 3, -1.4, 19, 0.7);
      X.mould(f, [210, 600], 14, 10, { col: P.lilac, op: 0.6 }); });
    f.line([add(KN, [-30, 2]), [300, 620], [250, 628], [200, 640], [166, 618]], 1, P.boneL, { op: 0.4, dash: '4 3' }); }

  // ---- head: bowed and cocked over the hill, listening
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(limb(add(N0, [-8, 6]), hF([[-0.1, 0.32]])[0], 42, 36, { steps: 5 }), SK());
  headW(f, HC, H, hA, {
    skin, jaw: 1.05, chin: 0.02, nose: 1.15, hook: 0.2, mouth: 'set', squint: 0.75, browDown: 0.05, faceShade: 0.82, jawShade: 0.55, age: true, gaunt: true,
    beard: 'stubble', beardCol: '#3a342e', hairCol: '#3a342e', iris: '#6a6470', eyeWhite: '#cfc6b8',
    hairBack: [[-0.42, 0.16], [-0.5, -0.1], [-0.36, -0.36], [-0.16, -0.42], [-0.1, -0.1], [-0.3, 0.3]],
  });
  for (const q of [[[-0.02, -0.28], [0.12, -0.3], [0.2, -0.27]], [[0.0, -0.22], [0.14, -0.24]], [[0.2, 0.02], [0.24, 0.14]], [[0.06, 0.06], [0.1, 0.18]]]) f.line(hF(q), 1.3, P.loamD, { op: 0.75 }); // earth in the wrinkles
  f.flat(hF(ell([0.1, 0.12], 0.06, 0.04, 0.3, 8)), P.loam, { op: 0.35 });
  X.pustules(f, hF([[-0.06, 0.24]])[0], 6, 5, 2, 2, 3);
  f.bone('hat');
  { // a battered felt hat, brim turned down over the squint, a moleskin band
    const col = mix(P.loamB, P.grey, 0.35);
    const crown = hF([[-0.4, -0.3], [-0.36, -0.62], [-0.16, -0.76], [0.06, -0.7], [0.22, -0.76], [0.34, -0.58], [0.38, -0.3]]);
    f.part(crown, LEATH(f, { fill: col, tex: 'mottle' + seed }));
    f.line(hF([[0.02, -0.7], [0.08, -0.56], [0.14, -0.72]]), 1.4, INK, { op: 0.6 });
    const band = hF([[-0.39, -0.4], [0.37, -0.38], [0.38, -0.28], [-0.39, -0.3]]);
    f.part(band, { fill: '#3a383c', shadow: '#121114', shade: 0.35, tex: 'mfur' + seed, texOp: 0.9, inkW: 1, cast: false });
    for (let i = 0; i < 10; i++) { const q = hF([[-0.36 + i * 0.075, -0.34]])[0]; f.line([q, add(q, [1, 3])], 0.8, '#6a6670', { op: 0.7 }); }
    const brim = hF([[-0.74, -0.22], [-0.45, -0.34], [0.0, -0.36], [0.45, -0.32], [0.7, -0.22], [0.78, -0.1], [0.68, -0.07], [0.45, -0.2], [0.0, -0.24], [-0.45, -0.18], [-0.78, -0.12]]);
    f.part(brim, LEATH(f, { fill: col, shade: 0.28 }));
    f.line(hF([[-0.72, -0.14], [-0.3, -0.2], [0.3, -0.22], [0.7, -0.1]]), 1.6, mix(col, '#fff', 0.3), { op: 0.5 }); f.line(hF([[0.2, -0.33], [0.5, -0.28]]), 1, INK, { op: 0.5 }); // worn edge, a split in the brim
    X.mould(f, hF([[-0.1, -0.56]])[0], 12, 8, { col: P.lilac, op: 0.6 });
  }

  // ---- the spade: ash shaft, a T crutch at the top, the long narrow blade (a mole spade's), worn bright at the edge
  f.bone('spade');
  const SH = WOOD(f, { inkW: 1.3, inkHeavy: 2 });
  f.part(ribbon(spline([top, tip], 6), spline([top, tip], 6).map((_, i, a) => 15 - 3 * i / a.length)), SH);
  f.line([lp(top, tip, 0.05, -3), lp(top, tip, 0.6, -3)], 1.4, mix(P.loamBL, P.boneL, 0.5), { op: 0.6 }); // worn bright under the hands
  { const n = [-sd[1], sd[0]]; f.part([add(top, mul(n, 34)), add(add(top, mul(n, 36)), mul(sd, 14)), add(add(top, mul(n, -34)), mul(sd, 14)), add(top, mul(n, -32))], SH); } // the crutch
  const bl0 = lerp(top, tip, 0.74), n0 = [-sd[1], sd[0]];
  f.part([add(bl0, mul(n0, 9)), add(bl0, mul(n0, -9)), add(add(bl0, mul(sd, 26)), mul(n0, -8)), add(add(bl0, mul(sd, 26)), mul(n0, 8))], IRON(f)); // the socket
  const blade = [add(add(bl0, mul(sd, 22)), mul(n0, 13)), add(add(bl0, mul(sd, 22)), mul(n0, -13)), add(add(tip, mul(sd, 14)), mul(n0, -11)), [...add(tip, mul(sd, 40)), 1], add(add(tip, mul(sd, 14)), mul(n0, 11))];
  f.part(blade, IRON(f, { fill: '#5e5c5e', light: P.greyL }));
  f.line([add(add(tip, mul(sd, 10)), mul(n0, -10)), add(tip, mul(sd, 38))], 1.6, P.greyL, { op: 0.8 }); f.flat([add(add(bl0, mul(sd, 30)), mul(n0, 8)), add(add(bl0, mul(sd, 60)), mul(n0, 4)), add(add(bl0, mul(sd, 70)), mul(n0, 10))], '#4a3a30', { op: 0.6 }); // edge worn bright, rust
  f.flat([add(tip, mul(sd, 4)), add(add(tip, mul(sd, 30)), mul(n0, 6)), add(add(tip, mul(sd, 20)), mul(n0, -8))], P.loam, { op: 0.8 }); // loam on the tip

  // ---- the far fist on the crutch, with the clean round hole through its palm (the shaft shows through)
  f.bone('hand_f');
  X.cutHoles(f, [[add(WF, rot([2, 0], upA)), 8]], () => { X.gripK(f, WF, EF, upA, 22, mix(skin, '#000', 0.08), { tex: 'mottle' + seed, shadow: skinS, name: 'molecatcher far' }); X.pustules(f, add(WF, [-12, 8]), 8, 6, 3, 2.4, 3.6); });

  // ---- near arm: smock sleeve rolled to the elbow, bare swollen forearm, the lower fist on the shaft
  X.mArm(f, SN, EN, lerp(EN, WN, 0.3), [48, 42, 38], SMOCK(), { sfx: '_n', bare: false });
  f.bone('forearm_n');
  X.mArm(f, lerp(EN, WN, 0.1), lerp(EN, WN, 0.5), WN, [38, 36, 28], SK(), { build: 'lean' });
  f.part(K.ragLimb(f, lerp(SN, EN, 0.82), add(EN, [8, -8]), 50, 52, { depth: 5, teeth: 5 }), SMOCK({ fill: mix(P.bone, P.grey, 0.35), cast: false }));
  X.pustules(f, lp(EN, WN, 0.55, 6), 12, 7, 4, 2.4, 4.2);
  X.mould(f, lp(EN, WN, 0.35, -4), 10, 7, { col: P.lilac, op: 0.6 });
  f.bone('hand_n');
  X.gripK(f, WN, EN, upA, 23, skin, { tex: 'mottle' + seed, shadow: skinS, name: 'molecatcher near' });
  X.pustules(f, add(WN, [-10, 10]), 8, 6, 3, 2.4, 3.8);

  // ---- the molehill: fresh black loam heaped over the run, clods rolled off it
  f.bone('root');
  const hill = [[452, gy + 2], [470, gy - 18], [500, gy - 42], [540, gy - 52], [578, gy - 40], [606, gy - 16], [624, gy + 2]];
  f.part(hill, { fill: P.loam, shadow: P.loamD, light: P.loamL, shade: 0.4, maxShade: 14, inkW: 1.3, inkHeavy: 2, cast: false, tex: 'mottle' + seed, texOp: 0.8, grime: false });
  clipDraw(f, hill, () => { for (let i = 0; i < 30; i++) { const q = [R(f, 460, 620), R(f, gy - 50, gy)]; f.flat(ell(q, R(f, 2, 5), R(f, 1.5, 3), 0, 6), f.r() > 0.5 ? P.loamL : P.loamD, { op: 0.85 }); } });
  for (let i = 0; i < 6; i++) f.part(ell([R(f, 440, 630), gy - R(f, 0, 5)], R(f, 4, 8), R(f, 3, 5), 0, 7), { fill: P.loamL, shadow: P.loamD, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
  X.loamGround(f, 120, 640, gy, { depth: 12, petals: 2 });
  return f;
}

// ------------------------------------------------------------------ FLOWER-STREWER (cast, small 0.6)
// A little girl of the household who strewed petals in front of the lady. Mid-skip, weight on the bare front foot, the
// back heel kicked up; the near arm flung forward and up, the hand open, petals leaving it; a willow basket on the far
// forearm, heaped with petals that have turned to flakes of spore, eyes open among them. A small, solemn, heart-shaped
// face, eyes downcast, the near cheek swollen under a soft bloom, a petal stuck to it; a wreath of browned flowers with a
// ribbon trailing from it; her hair grown into fine fungal threads hanging plumb down her back. Pink linen pinafore over
// a lilac dress, both rotting at the hem; bare feet black with loam to the ankle. A child's proportions (about 5.6
// heads), not a shrunk adult.
// Toxin: mould bloom mottling the skin, the soft fungal swelling at the side of the neck, buds along the flinging
// forearm, the fungal hair, spore-flake petals, the rotted hems. Void: eyes in the basket's petals; a clean round hole
// through the pinafore's skirt.
// Rig: standard humanoid + basket (hand_f) + skirt (pelvis) + hair (head) + ribbon (head) + petals (hand_n).
// Motion: idle skipping in place, a few petals scattered (thigh/shin, petals); attack a flung handful (near arm whips
// forward and down, petals released).
function flowerStrewer() {
  const seed = 1426, h = 820;
  const f = new Fig(X.base(seed, h, { grimeY: 700 })); X.texturesB(f);
  const H = 68, gy = f.o.groundY;
  const skin = mix(P.skin, P.bone, 0.25), skinS = P.skinS;
  const SK = (o = {}) => SKIN(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const DRESS = (o = {}) => Object.assign({ fill: P.lilacD, shadow: P.lilacS, light: P.lilac, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, maxShade: 12 }, o);
  const PINA = (o = {}) => Object.assign({ fill: P.pink, shadow: P.pinkS, light: P.pinkL, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, maxShade: 12 }, o);
  const Pv = [292, 596], N0 = [304, 470];
  const S = B.spine(N0, [290, 530], Pv, H);
  const HC = [322, 430], hA = 0.3;
  const SN = [296, 484], EN = [338, 510], WN = [384, 470];
  const SF = [318, 480], EF = [296, 526], WF = [338, 546];
  const HN = [300, 604], KN = [338, 684], AN = [328, 762];
  const HF = [282, 600], KF = [258, 682], AF = [206, 712];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('basket', WF, 'hand_f').joint('skirt', S.at(0, 0.86), 'pelvis').joint('hair', add(HC, [-18, -20]), 'head').joint('ribbon', add(HC, [-26, -26]), 'head').joint('petals', WN, 'hand_n');

  // ---- hair grown into fine fungal threads, hanging plumb down her back (drawn first: behind everything)
  f.bone('hair');
  { const hd = f.part([add(HC, [-34, -26]), add(HC, [-14, -30]), add(HC, [-20, 20]), [HC[0] - 14, 560], [HC[0] - 34, 586], [HC[0] - 56, 570], [HC[0] - 52, 520], add(HC, [-44, 10])], { fill: mix(P.grey, P.lilacD, 0.5), shadow: P.lilacS, light: P.lilacL, shade: 0.4, tex: 'mfur' + seed, texOp: 0.8, maxShade: 12, inkW: 1.2 });
    clipDraw(f, hd, () => { for (let i = 0; i < 40; i++) { const x = HC[0] - 52 + R(f, 0, 40); f.line([[x, HC[1] - 20], [x + R(f, -3, 3), HC[1] + 60], [x + R(f, -5, 5), 590]], R(f, 0.6, 1.2), f.r() > 0.5 ? P.boneL : P.lilacS, { op: 0.6 }); } });
    for (let i = 0; i < 14; i++) { const x = HC[0] - 54 + i * 3.2, y0 = 560 + R(f, 0, 24), l = R(f, 14, 40); f.line([[x, y0], [x + R(f, -2, 2), y0 + l * 0.5], [x + R(f, -3, 3), y0 + l]], 0.8, mix(P.bone, P.lilac, 0.3), { op: 0.85 }); f.flat(ell([x, y0 + l], 1.4, 1.4, 0, 5), P.yelD); } // the threads' fine ends, fruiting
  }

  // ---- far leg, kicked up behind (bare, black with loam to the ankle)
  X.bareLegRig(f, HF, KF, AF, 26, 40, 28, SK({ fill: mix(skin, '#000', 0.18), maxShade: 7 }), '_f', { groundY: AF[1] + 38, after: pts => clipDraw(f, pts, () => stains(f, E.smooth(pts), [AF[0] - 50, AF[1] - 10, AF[0] + 50, AF[1] + 40], P.loamD, 0.06, 4, -0.6, 43, 0.85)) });

  // ---- far arm, the elbow back, the forearm forward across the body (the basket hangs from it: drawn later)
  X.mArm(f, SF, EF, WF, [22, 18, 13], DRESS({ fill: mix(P.lilacD, '#000', 0.15) }), { sfx: '_f', bare: false, build: 'lean' });

  // ---- the dress skirt behind (lilac), swinging back with the skip, its hem rotted
  f.bone('skirt');
  const dk = [S.at(-0.6, 0.86), S.at(0.6, 0.86), [350, 660], [362, 712], ...X.hemLine(f, [362, 712], [218, 700], 9, 8), [236, 640]];
  const dd = f.part(dk, DRESS());
  clipDraw(f, dd, () => { X.folds(f, [[250, 620], [276, 616], [306, 618], [334, 640]], 90, 2.6, { dk: P.lilacS, lt: P.lilacL }); stains(f, dd, [200, 580, 380, 720], P.loamD, 0.05, 3, -1.3, 29, 0.6); });

  // ---- torso: the dress bodice, the pinafore bib over it with its straps
  f.bone('torso');
  const tor = S.shape([[-0.02, 0.3, 0.26], [0.14, 0.42, 0.36], [0.4, 0.44, 0.4], [0.7, 0.42, 0.42], [0.92, 0.48, 0.48]]);
  f.part(tor, DRESS());
  const bib = [S.at(0.06, 0.2), S.at(0.38, 0.22), S.at(0.42, 0.9), S.at(-0.1, 0.9), S.at(-0.12, 0.4)];
  const bd = f.part(bib, PINA());
  clipDraw(f, bd, () => { X.fold(f, [S.at(0.1, 0.4), S.at(0.12, 0.6), S.at(0.1, 0.88)], 2, { dk: P.pinkS, lt: P.pinkL }); X.mould(f, S.at(0.1, 0.7), 8, 10, { col: P.lilac, op: 0.6 }); });
  f.line([S.at(-0.3, 0.06), S.at(-0.12, 0.4)], 3, P.pinkD); f.line([S.at(0.06, 0.2), S.at(0.0, 0.02)], 3, P.pinkD); // the straps
  // the soft fungal swelling at the side of the neck
  f.bone('head');
  f.part(limb(add(N0, [-4, 6]), add(HC, [-6, 24]), 22, 19, { steps: 5 }), SK());
  { const sw = add(N0, [4, -12]); f.part(X.lumpy(f, ell(sw, 12, 10, 0.3, 12), 3), X.FL(f, mix(P.pink, P.skin, 0.4), { maxShade: 6, inkW: 1, inkHeavy: 1.4 })); X.mould(f, sw, 8, 6, { col: P.lilac, op: 0.6 }); }

  // ---- near leg: the bare front foot carrying the weight
  X.bareLegRig(f, HN, KN, AN, 28, 42, 30, SK({ maxShade: 7 }), '_n', { after: pts => clipDraw(f, pts, () => { stains(f, E.smooth(pts), [AN[0] - 60, AN[1] - 20, AN[0] + 60, gy + 4], P.loamD, 0.06, 4, -0.6, 41, 0.85); f.flat([[AN[0] - 60, gy - 12], [AN[0] + 60, gy - 14], [AN[0] + 60, gy + 4], [AN[0] - 60, gy + 4]], P.loamD, { op: 0.6 }); }) });
  f.bone('shin_n'); X.mould(f, lp(KN, AN, 0.3, 4), 6, 9, { col: P.lilac, op: 0.6 });

  // ---- the pinafore skirt over the dress, front panel, rotting at the hem, a clean round hole through it
  f.bone('skirt');
  const pk = [S.at(-0.36, 0.86), S.at(0.46, 0.86), [352, 650], [360, 690], ...X.hemLine(f, [360, 690], [246, 684], 7, 9), [252, 640]];
  X.cutHoles(f, [[[318, 650], 7]], () => {
    const pd = f.part(pk, PINA());
    clipDraw(f, pd, () => { X.folds(f, [[270, 610], [300, 612], [326, 618]], 70, 2.4, { dk: P.pinkS, lt: P.pinkL }); stains(f, pd, [230, 580, 380, 700], P.loamD, 0.05, 3, -1.3, 31, 0.7); X.mould(f, [282, 664], 12, 8, { col: P.lilac, op: 0.7 }); });
  }, { shape: E.smooth(pk) });
  X.rope(f, [S.at(-0.5, 0.86), S.at(0.0, 0.9), S.at(0.48, 0.86)], 3, P.pinkD, { lit: false }); // the waist tie

  // ---- head: small, solemn, eyes downcast; the near cheek swollen under a bloom, a petal stuck to it
  f.bone('head');
  const hF = frame(HC, hA, H);
  headW(f, HC, H, hA, { skin, jaw: 0.82, chin: -0.04, nose: 0.72, hook: 0, mouth: 'set', squint: 0.55, browDown: -0.01, faceShade: 0.78, faceHatch: false, jawShade: 0.3, lips: true, lashes: true, browW: 0.03, iris: '#5a5262', eyeWhite: '#d8d0c8', hairCol: mix(P.grey, P.lilacD, 0.5),
    hair: [[-0.42, 0.1], [-0.46, -0.2], [-0.32, -0.46], [-0.04, -0.54], [0.2, -0.48], [0.3, -0.36], [0.12, -0.4], [-0.1, -0.36], [-0.22, -0.2], [-0.26, 0.0], [-0.32, 0.14]] });
  f.part(hF([[0.0, 0.04], [0.18, 0.02], [0.28, 0.14], [0.26, 0.3], [0.12, 0.36], [-0.02, 0.26]]), { fill: mix(skin, P.pink, 0.35), shadow: P.skinS, shade: 0.3, maxShade: 3, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + seed, texOp: 0.5 }); // the swollen cheek
  X.mould(f, hF([[0.1, 0.16]])[0], 7, 6, { col: P.lilac, op: 0.6 });
  f.part(hF([[0.16, 0.06], [0.24, 0.03], [0.27, 0.1], [0.2, 0.13]]), { fill: P.pinkL, shadow: P.pinkD, shade: 0.3, inkW: 0.8, inkHeavy: 0.9, cast: false, hatch: false }); // a petal stuck to it
  for (const q of [[-0.2, -0.1], [0.06, -0.34], [-0.3, 0.06]]) X.mould(f, hF([q])[0], 5, 4, { col: mix(P.lilac, P.grey, 0.3), op: 0.5, rings: 0 });
  // fine fungal threads falling from the crown over the brow
  for (let i = 0; i < 12; i++) { const q = hF([[-0.3 + i * 0.045, -0.46 + Math.abs(i - 6) * 0.01]])[0]; f.line([q, add(q, [R(f, -3, 1), R(f, 10, 24)])], 0.8, P.boneL, { op: 0.7 }); }
  // the wreath of browned flowers, the ribbon trailing from it
  { const ring = [[-0.42, -0.18], [-0.34, -0.42], [-0.12, -0.54], [0.1, -0.52], [0.26, -0.42]].map(q => hF([q])[0]);
    X.moss(f, ring, 7, { col: P.rot, stalks: false });
    ring.forEach((q, i) => X.bloom(f, q, R(f, 7, 10), [P.pink, P.lilac, P.yel][i % 3], { sy: 0.7, n: 5, ang: f.r() * 6 }));
    for (const q of ring) f.flat(ell(add(q, [2, 3]), 4, 3, 0, 6), P.loamB, { op: 0.5 }); }
  f.bone('ribbon');
  { const r0 = hF([[-0.4, -0.2]])[0]; for (const [dx, w] of [[0, 5], [8, 4]]) f.part(ribbon(spline([r0, add(r0, [-14 - dx, 30]), add(r0, [-20 - dx, 70]), add(r0, [-34 - dx, 104])], 4), Array(30).fill(w)), PINA({ fill: mix(P.pink, P.lilac, 0.4), inkW: 1, cast: true, castOp: 0.3 })); }

  // ---- the basket on the far forearm: heaped with petals turned to flakes of spore, eyes open among them
  f.bone('basket');
  { const bc = add(WF, [8, 44]);
    const hd = [[bc[0] - 30, bc[1] - 18], [bc[0] - 14, WF[1] - 4], [bc[0] + 10, WF[1] - 6], [bc[0] + 30, bc[1] - 18]];
    f.line(spline(hd, 3), 7, INK); f.line(spline(hd, 3), 4.6, P.yelD); f.line(spline(hd, 3).map(q => add(q, [1, -1])), 1.2, P.yelL, { op: 0.5 }); // the handle over the forearm
    const body = [[bc[0] - 36, bc[1] - 14], [bc[0] + 36, bc[1] - 14], [bc[0] + 30, bc[1] + 20], [bc[0] + 16, bc[1] + 30], [bc[0] - 16, bc[1] + 30], [bc[0] - 30, bc[1] + 20]];
    f.part(body, { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.4, inkHeavy: 2.4 });
    X.wicker(f, body, 0.05, 6, { col: P.yelD, lit: q => 0.4 + (q[0] - bc[0]) / 120 });
    f.part([[bc[0] - 38, bc[1] - 18], [bc[0] + 38, bc[1] - 18], [bc[0] + 37, bc[1] - 10], [bc[0] - 37, bc[1] - 10]], { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.2, cast: false, tex: 'straw' + seed, texOp: 0.6 }); // the rim
    // the heap of spore-flake petals, eyes among them
    for (let i = 0; i < 26; i++) { const q = [bc[0] + R(f, -32, 32), bc[1] - 18 - R(f, 0, 16) * (1 - Math.abs(R(f, -1, 1)) * 0.4)]; f.part(ell(q, R(f, 4, 7), R(f, 2, 3.5), R(f, -0.6, 0.6), 8), { fill: [P.pink, P.lilac, mix(P.yel, P.loamB, 0.3), P.pinkL][i % 4], shadow: P.lilacS, shade: 0.35, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); }
    X.eyes(f, [[[bc[0] - 12, bc[1] - 24], 11, -0.1, 0.65], [[bc[0] + 16, bc[1] - 28], 8, 0.2, 0.15]], { lid: P.pink, lidS: P.pinkS });
    X.spores(f, [bc[0], bc[1] - 38], 30, 10, 6); }
  f.bone('hand_f');
  X.openHand(f, WF, ang(EF, WF) + 0.3, 30, { look: SK({ fill: mix(skin, '#000', 0.1) }), back: true, curl: 0.7, flip: true });

  // ---- near arm: the dress sleeve to the elbow, the bare forearm budding, the hand open and flinging
  X.mArm(f, SN, EN, lerp(EN, WN, 0.15), [24, 20, 19], DRESS(), { sfx: '_n', bare: false, build: 'lean' });
  f.bone('forearm_n');
  X.mArm(f, lerp(EN, WN, 0.05), lerp(EN, WN, 0.5), WN, [18, 17, 13], SK(), { build: 'lean' });
  f.part(K.ragLimb(f, lerp(SN, EN, 0.75), add(EN, [5, -2]), 26, 26, { depth: 4, teeth: 4 }), DRESS({ cast: false }));
  for (const t of [0.25, 0.45, 0.62, 0.8]) { const q = lp(EN, WN, t, -7 - t * 2); X.cap(f, q, ang(EN, WN) - Math.PI / 2 - 0.3 + t * 0.2, 12 + t * 4, { col: [P.pink, P.lilac, P.pinkL, P.yel][Math.round(t * 5) % 4], shape: 'conic', w: 0.3, sw: 0.14, tear: false, warts: 1 }); } // buds along the forearm
  f.bone('hand_n');
  X.openHand(f, WN, ang(EN, WN) - 0.35, 30, { look: SK(), back: true, curl: 0.05, spread: 0.3 });
  f.bone('petals');
  for (let i = 0; i < 14; i++) { const q = add(WN, [R(f, 18, 90), R(f, -60, 10)]); f.part(ell(q, R(f, 3.5, 6), R(f, 1.6, 3), R(f, 0, 3), 8), { fill: [P.pink, P.lilac, P.pinkL, mix(P.yel, P.loamB, 0.2)][i % 4], shadow: P.lilacS, shade: 0.35, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); }
  X.spores(f, add(WN, [56, -30]), 40, 26, 8);

  f.bone('root');
  X.loamGround(f, 150, 450, gy, { depth: 10, petals: 6 });
  return f;
}

// ------------------------------------------------------------------ ORCHARD PICKER (cast, human 1.0)
// A picker in the lady's orchard, solid and square, walking with the tall three-legged orchard ladder over her far
// shoulder: carried on edge behind her head, its lower rail on the shoulder, the two rails converging to a point high
// above and ahead of her, the third leg folded along it, a hooked picking pole tucked through the rungs. Her far fist
// holds a rung ahead of her face; her near forearm hooks the picking basket on the near hip, heaped with swollen fruit
// splitting with mould. Weight on the back foot under the ladder, the front heel just landing. A broad, tired face under
// a lilac kerchief, one cheek swollen with a pink gall; sleeves rolled; an apron with a big front pocket over a kilted
// skirt; wooden pattens on iron rings; a knife on a cord.
// Toxin: hands swollen with fruit-like galls, the fingers soft and peeling; a hanging cluster of rotten fruit grown out of
// her shoulder under the ladder; the basket fruit splitting with mould; mould bloom on the apron. Void: eyes opened in
// the fruit of the cluster and the basket; a clean round hole through a rung of the ladder.
// Rig: standard humanoid + ladder (parent hand_f: it also rests on the far shoulder) + basket (pelvis: it rests on the
// hip) + skirt (pelvis) + fruit (torso). Motion: idle shifting the ladder (ladder, a fruit drops); attack throwing a
// rotten fruit (the near hand takes one from the basket and throws it overarm).
function orchardPicker() {
  const seed = 1429, W = 900, h = 900;
  const f = new Fig(X.base(seed, h, { grimeY: 720 })); X.texturesB(f);
  const H = 100, gy = f.o.groundY;
  const skin = mix(P.skin, P.loamBL, 0.3), skinS = P.skinS;
  const SK = (o = {}) => SKIN(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const BOD = (o = {}) => LINEN(f, Object.assign({ fill: mix(P.loamB, P.grey, 0.35), light: mix(P.grey, P.bone, 0.4), maxShade: 16 }, o));
  const SKT = (o = {}) => Object.assign({ fill: mix(P.loamL, P.lilacS, 0.35), shadow: P.loamD, light: P.loamB, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, maxShade: 16 }, o);
  const APR = (o = {}) => LINEN(f, Object.assign({ fill: mix(P.bone, P.grey, 0.4), maxShade: 16 }, o));
  const Pv = [424, 560], N0 = [438, 362];
  const S = B.spine(N0, [450, 460], Pv, H);
  const HC = [472, 300], hA = 0.04;
  const SN = [426, 382], EN = [400, 482], WN = [458, 550];
  const SF = [454, 374], EF = [575, 400], WF = [600, 268];
  const HN = [440, 572], KN = [508, 700], AN = [552, 818];
  const HF = [412, 568], KF = [400, 714], AF = [394, 830];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the ladder, on edge on the far shoulder (Sh), rising forward at about 28 degrees; the rung under the far fist at 0.625
  const Sh = [452, 352], la = -0.49, d = [Math.cos(la), Math.sin(la)], n = [d[1], -d[0]];
  const L0 = add(Sh, mul(d, -330)), Ap = add(Sh, mul(d, 470)), U0 = add(L0, mul(n, 196)), ApU = add(Ap, mul(n, 6));
  const railL = t => lerp(L0, Ap, t), railU = t => lerp(U0, ApU, t);
  f.joint('ladder', WF, 'hand_f').joint('basket', add(WN, [0, 30]), 'pelvis').joint('skirt', S.at(0, 0.9), 'pelvis').joint('fruit', S.at(-0.4, 0.06), 'torso');
  const rail = (a, b, w0, w1, look) => { const C = spline([a, b], 6); f.part(ribbon(C, C.map((_, i) => w0 + (w1 - w0) * i / (C.length - 1))), look); return C; };

  // ---- the ladder, behind her: far rail, rungs (one broken out), the folded third leg, the near rail, the picking pole
  f.bone('ladder');
  const RL = WOOD(f, { inkW: 1.4, inkHeavy: 2.4 });
  rail(U0, ApU, 18, 10, WOOD(f, { fill: mix(P.loamBL, '#000', 0.2), inkW: 1.4, inkHeavy: 2.4 }));
  const rungs = [0.145, 0.265, 0.385, 0.625, 0.745, 0.865];
  X.cutHoles(f, [[lerp(railL(0.265), railU(0.265), 0.55), 6]], () => {
    for (const t of rungs) { const a = add(railL(t), mul(n, 6)), b = add(railU(t), mul(n, -6)); f.part(ribbon([a, lerp(a, b, 0.5), b], [12, 13, 12]), WOOD(f, { fill: mix(P.loamBL, '#000', 0.15), inkW: 1.2, cast: true, castOp: 0.35 })); f.line([lerp(a, b, 0.15), lerp(a, b, 0.85)], 1.2, mix(P.loamBL, P.boneL, 0.4), { op: 0.5 }); }
  });
  for (const [p0, sg] of [[railL(0.505), 1], [railU(0.505), -1]]) { const a = add(p0, mul(n, sg * 6)), b = add(a, mul(n, sg * 24)); f.part(ribbon([a, b], [12, 10]), WOOD(f, { fill: mix(P.loamBL, '#000', 0.15), inkW: 1.1, cast: false })); f.line([add(b, mul(d, -6)), add(b, mul(d, 6))], 1.6, INK); } // the broken rung's stubs
  rail(add(add(L0, mul(n, 100)), mul(d, -30)), add(Ap, mul(n, 2)), 15, 9, WOOD(f, { fill: mix(P.loamBL, '#000', 0.3) })); // the folded third leg
  rail(L0, Ap, 20, 11, RL); // the near rail
  for (const t of [0.15, 0.5, 0.85]) f.line([lp(L0, Ap, t - 0.05, -4), lp(L0, Ap, t + 0.05, -4)], 1, INK, { op: 0.5 }); // checks in the grain
  f.line([lp(L0, Ap, 0.02, -5), lp(L0, Ap, 0.9, -3)], 1.4, mix(P.loamBL, P.boneL, 0.4), { op: 0.45 });
  f.part(ell(add(Ap, mul(d, -8)), 9, 7, la, 10), IRON(f)); // the iron hinge pin at the apex
  for (const p of [L0, U0, add(add(L0, mul(n, 100)), mul(d, -30))]) f.flat(ell(p, 10, 8, la, 8), P.loamD, { op: 0.9 }); // feet caked with loam
  X.moss(f, [railL(0.0), railL(0.1)], 6, { col: P.rot });
  X.mould(f, railU(0.35), 14, 8, { col: mix(P.lilac, P.grey, 0.4), op: 0.7 }); X.mould(f, railL(0.8), 10, 6, { col: mix(P.lilac, P.grey, 0.4), op: 0.7 });
  { const a = add(railL(0.2), mul(n, 70)), b = add(railU(0.97), mul(n, 34)); f.part(ribbon(spline([a, b], 8), spline([a, b], 8).map(() => 9)), WOOD(f, { fill: mix(P.loamBL, P.bone, 0.15), inkW: 1.1 })); const dd = E.norm(sub(b, a)), nn = [-dd[1], dd[0]]; const hk = spline([b, add(b, mul(dd, 30)), add(add(b, mul(dd, 46)), mul(nn, 16)), add(add(b, mul(dd, 38)), mul(nn, 28))], 3); f.line(hk, 7, INK); f.line(hk, 5, '#3a3838'); f.line(hk.slice(0, -3), 1.2, P.greyL, { op: 0.5 }); } // the picking pole and its iron hook

  // ---- far arm, up to the rung ahead of her face: sleeve rolled, the swollen hand
  X.mArm(f, SF, EF, lerp(EF, WF, 0.25), [46, 40, 38], BOD({ fill: mix(P.loamB, P.grey, 0.2) }), { sfx: '_f', bare: false });
  f.bone('forearm_f');
  X.mArm(f, lerp(EF, WF, 0.1), lerp(EF, WF, 0.5), WF, [40, 38, 31], SK({ fill: mix(skin, '#000', 0.12) }), { build: 'stout' });
  f.part(K.ragLimb(f, lerp(SF, EF, 0.8), add(EF, [6, -6]), 48, 50, { depth: 5, teeth: 5 }), BOD({ fill: mix(P.loamB, P.grey, 0.2), cast: false }));
  X.peel(f, lp(EF, WF, 0.55, 4), 2, 0.8, 12, skin);
  f.bone('hand_f');
  X.gripK(f, WF, EF, Math.atan2(n[1], n[0]), 25, mix(skin, P.pink, 0.12), { tex: 'mottle' + seed, shadow: skinS, maxBend: 40, name: 'picker rung' });
  X.pustules(f, add(WF, [-6, 8]), 14, 10, 5, 3, 6, { col: mix(P.pink, P.skin, 0.3) });

  // ---- far leg, carrying the weight under the ladder: woollen hose, a patten under the shoe
  const patten = (A, sfx, tone) => {
    f.bone('foot' + sfx);
    const x0 = A[0] - 34, x1 = A[0] + 62, y0 = gy - 26;
    f.part([[x0, y0], [x1, y0], [x1 + 2, y0 + 10], [x0 - 2, y0 + 10]].map(q => [...q, 1]), WOOD(f, { fill: mix(P.loamBL, '#000', tone), inkW: 1.3 })); // the wooden sole
    for (const x of [x0 + 18, x1 - 22]) f.part([[x - 6, y0 + 10], [x + 6, y0 + 10], [x + 4, gy - 4], [x - 4, gy - 4]], IRON(f, { cast: false })); // the iron ring's posts
    f.line([[x0 + 4, gy - 3], [x1 - 6, gy - 3]], 4, '#2a2828'); f.line([[x0 + 4, gy - 4], [x1 - 6, gy - 4]], 1, P.greyL, { op: 0.5 }); // the ring on the ground
    f.line([[A[0] - 16, A[1] + 4], [A[0] + 26, y0 + 2]], 3, P.loamD); // the strap over the instep
  };
  X.mLeg(f, HF, KF, AF, [82, 58, 40], LINEN(f, { fill: mix(P.greyD, P.loam, 0.4), tex: 'weave' + seed }), { sfx: '_f', bare: false });
  X.bootRig(f, KF, AF, 52, mix('#2a221c', '#000', 0.2), '_f', { tex: 'mottle' + seed, shaft: 0.3, toe: 1.1, groundY: gy - 26 });
  patten(AF, '_f', 0.25);

  // ---- the cluster of rotten fruit grown out of the far shoulder under the ladder, hanging down her back
  f.bone('fruit');
  const fruitBall = (c, r, col, o = {}) => {
    const pts = X.lumpy(f, ell(c, r, r * (o.long ?? 0.94), R(f, 0, 3), 14), r * 0.08);
    const fd = f.part(pts, X.FL(f, col, { maxShade: r * 0.4, cast: true, castOp: 0.4, texOp: 0.25 }));
    clipDraw(f, fd, () => { softTone(f, fd, [[ell(add(c, mul(f.L, r * 0.45)), r * 0.4, r * 0.3, 0, 10), mix(col, '#fff', 0.35), 0.6, r * 0.2]]); if (o.split) { f.stroke([add(c, [-r * 0.5, -r * 0.1]), add(c, [0, r * 0.1]), add(c, [r * 0.4, -r * 0.2])], r * 0.22, P.loamD); X.mould(f, c, r * 0.45, r * 0.25, { col: P.yel, op: 0.85, rings: 1 }); } if (o.mould) X.mould(f, add(c, [r * 0.2, r * 0.3]), r * 0.4, r * 0.3, { col: mix(P.lilac, P.grey, 0.3), op: 0.8, rings: 1 }); });
    if (o.stalk !== false) f.line([add(c, [0, -r * 0.8]), add(c, [R(f, -4, 4), -r * 1.15])], 2, P.loamB);
  };
  { const r0 = S.at(-0.5, 0.04);
    f.part(X.tube([r0, add(r0, [-14, 26]), add(r0, [-22, 52])], [18, 13, 8]), SK({ fill: mix(skin, P.pinkD, 0.35), maxShade: 4 })); // the stalk grown out of the shoulder
    const cl = [[-40, 66, 16], [-14, 62, 13], [-30, 90, 17], [-6, 86, 12], [-48, 98, 12], [-22, 112, 13], [-36, 128, 10]];
    cl.forEach(([dx, dy, r], i) => fruitBall(add(r0, [dx, dy]), r, [P.pink, P.pinkD, mix(P.pink, P.lilac, 0.4)][i % 3], { long: 1.1, mould: i % 2 === 1, stalk: false }));
    X.eyes(f, [[add(r0, [-30, 90]), 12, 0.1, 0.8], [add(r0, [-22, 112]), 9, -0.2, 0.3], [add(r0, [-6, 86]), 8, 0.2, 0.0]], { lid: P.pink, lidS: P.pinkS });
    X.spores(f, add(r0, [-30, 160]), 14, 16, 4); }

  // ---- torso: a linen bodice, the apron bib
  f.bone('torso');
  const tor = S.shape([[-0.04, 0.42, 0.36], [0.14, 0.7, 0.6], [0.3, 0.74, 0.8], [0.44, 0.72, 0.74], [0.6, 0.7, 0.64], [0.84, 0.72, 0.7], [1.04, 0.76, 0.74]]);
  const td = f.part(tor, BOD());
  clipDraw(f, td, () => { softTone(f, td, [[[S.at(-1, 0.1), S.at(-0.3, 0.1), S.at(-0.3, 1.1), S.at(-1, 1.1)], '#000', 0.35, 14]]); X.fold(f, [S.at(-0.5, 0.2), S.at(-0.3, 0.45), S.at(-0.36, 0.7)], 2.8, { dk: P.greyS }); X.fold(f, [S.at(0.1, 0.5), S.at(0.3, 0.6), S.at(0.5, 0.56)], 2.4, { dk: P.greyS }); stains(f, td, E.bbox(tor), P.loamD, 0.03, 2.6, -1.3, 13, 0.55); X.fold(f, [S.at(0.3, 0.1), S.at(0.1, 0.2), S.at(-0.1, 0.18)], 2.4, { dk: P.greyS }); });
  const bib = [S.at(0.06, 0.24), S.at(0.62, 0.24), S.at(0.8, 0.36), S.at(0.68, 0.5), S.at(0.7, 0.92), S.at(-0.04, 0.92)];
  const bd = f.part(bib, APR());
  clipDraw(f, bd, () => { softTone(f, bd, [[[S.at(0.2, 0.42), S.at(0.8, 0.42), S.at(0.8, 0.56), S.at(0.2, 0.56)], '#000', 0.3, 8]]); X.fold(f, [S.at(0.3, 0.32), S.at(0.34, 0.6), S.at(0.3, 0.9)], 2.2, { dk: P.greyS }); stains(f, bd, E.bbox(bib), P.pinkD, 0.05, 3, -1.6, 17, 0.5); X.mould(f, S.at(0.4, 0.5), 10, 8, { col: P.lilac, op: 0.6 }); });
  f.line([S.at(0.06, 0.26), S.at(-0.2, 0.0)], 3, mix(P.bone, P.grey, 0.5)); // the neck strap

  // ---- near leg stepping forward, the heel landing
  X.mLeg(f, HN, KN, AN, [84, 60, 40], LINEN(f, { fill: mix(P.greyD, P.loam, 0.25), tex: 'weave' + seed }), { sfx: '_n', bare: false });
  X.bootRig(f, KN, AN, 52, '#2a221c', '_n', { tex: 'mottle' + seed, shaft: 0.3, toe: 1.1, groundY: gy - 26 });
  patten(AN, '_n', 0);

  // ---- the kilted skirt (hitched up into the waistband, the petticoat showing) and the apron with its big pocket
  f.bone('skirt');
  const skt = [S.at(-0.78, 0.84), S.at(0.76, 0.84), [548, 640], [560, 690], ...X.hemLine(f, [560, 690], [330, 676], 9, 10), [340, 630]];
  const sd2 = f.part(skt, SKT());
  clipDraw(f, sd2, () => { X.folds(f, [[360, 600], [392, 596], [426, 598], [466, 600], [500, 604], [530, 612]], 80, 3.2, { dk: P.loamD, lt: P.loamBL }); f.flat([[330, 560], [372, 556], [380, 640], [330, 660]], '#000', { op: 0.3 }); X.mould(f, [380, 640], 14, 10, { col: P.lilac, op: 0.6 }); stains(f, sd2, [320, 560, 570, 700], P.loamD, 0.05, 3, -1.3, 39, 0.6); });
  f.part([S.at(-0.5, 0.86), S.at(-0.1, 0.88), [404, 640], [372, 628]], SKT({ fill: mix(P.loamL, P.lilacS, 0.2), cast: true, castOp: 0.4 })); // the kilted swag at the hip
  const apr = [S.at(-0.1, 0.86), S.at(0.74, 0.86), [536, 660], [530, 704], ...X.hemLine(f, [530, 704], [440, 708], 6, 7), [436, 650]];
  const ad = f.part(apr, APR());
  clipDraw(f, ad, () => { X.folds(f, [[454, 612], [490, 610], [516, 620]], 80, 2.6, { dk: P.greyS }); stains(f, ad, [420, 580, 560, 720], P.pinkD, 0.05, 3, -1.5, 37, 0.6); X.mould(f, [470, 690], 14, 9, { col: P.lilac, op: 0.6 }); });
  { const pk = [[476, 634], [530, 634], [532, 680], [478, 684]]; f.part(pk.map(q => [...q, 1]), APR({ fill: mix(P.bone, P.grey, 0.5), cast: true, castOp: 0.3, inkW: 1.2 })); f.stitches([...pk, pk[0]], P.greyS, 0.8); f.flat([[478, 634], [530, 634], [528, 642], [480, 642]], P.greyS, { op: 0.6 }); X.leaf(f, [512, 634], -1.6, 22); } // the big front pocket
  X.rope(f, [S.at(-0.78, 0.86), S.at(0, 0.9), S.at(0.76, 0.86)], 4, mix(P.bone, P.grey, 0.5), { lit: false }); // the apron strings
  { const k0 = S.at(-0.36, 0.92); f.line([k0, add(k0, [-6, 30]), add(k0, [-4, 52])], 1.6, P.loamB); f.part([add(k0, [-12, 52]), add(k0, [4, 52]), add(k0, [2, 78]), add(k0, [-10, 78])], WOOD(f, { cast: false })); f.part([add(k0, [-9, 78]), add(k0, [1, 78]), add(k0, [-2, 126]), [...add(k0, [-8, 118]), 1]], IRON(f, { fill: '#6a6868', cast: false })); f.line([add(k0, [-1, 82]), add(k0, [-3, 118])], 1, P.greyL, { op: 0.7 }); } // the knife on a cord

  // ---- head: a broad, tired face under the lilac kerchief, one cheek swollen with a pink gall
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(limb(add(N0, [-4, 6]), hF([[-0.06, 0.36]])[0], 50, 44, { steps: 5 }), SK());
  headW(f, HC, H, hA, { skin, jaw: 1.06, chin: 0.0, nose: 0.95, hook: 0.0, mouth: 'set', squint: 0.4, browDown: 0.02, faceShade: 0.74, faceHatch: false, jawShade: 0.2, lips: true, lashes: true, browW: 0.034, iris: '#5a5262', eyeWhite: '#d4ccc2', hairCol: '#3a3230', hairBack: [[-0.42, 0.2], [-0.5, -0.1], [-0.36, -0.36], [-0.2, -0.4], [-0.1, -0.1], [-0.3, 0.3]] });
  { const g = hF([[-0.02, 0.14]])[0]; f.part(X.lumpy(f, ell(g, H * 0.13, H * 0.11, 0.3, 12), 2), X.FL(f, mix(P.pink, skin, 0.5), { maxShade: 4, inkW: 1.1, inkHeavy: 1.4 })); f.flat(ell(add(g, [3, -4]), H * 0.03, H * 0.02, 0, 6), '#fff', { op: 0.5 }); X.mould(f, add(g, [-4, 6]), 6, 4, { col: P.yel, op: 0.6, rings: 0 }); }
  for (const q of [[[0.06, -0.06], [0.14, -0.02]], [[0.04, 0.04], [0.12, 0.08]]]) f.line(hF(q), 1, P.skinS, { op: 0.6 }); // tired bags under the eyes
  { const kc = mix(P.lilac, P.lilacD, 0.4); const ker = hF([[-0.46, 0.02], [-0.5, -0.24], [-0.36, -0.48], [-0.1, -0.58], [0.16, -0.54], [0.32, -0.4], [0.3, -0.3], [0.1, -0.36], [-0.12, -0.3], [-0.26, -0.12], [-0.3, 0.08]]);
    const kd = f.part(ker, { fill: kc, shadow: P.lilacS, light: P.lilacL, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, maxShade: 14 });
    clipDraw(f, kd, () => { X.fold(f, hF([[-0.3, -0.4], [-0.1, -0.3], [0.1, -0.34]]), 2, { dk: P.lilacS }); X.fold(f, hF([[-0.4, -0.2], [-0.3, -0.04]]), 2, { dk: P.lilacS }); stains(f, kd, E.bbox(ker), P.loamD, 0.05, 3, -1.5, 47, 0.5); });
    f.part(hF([[-0.46, 0.0], [-0.6, 0.06], [-0.66, 0.24], [-0.5, 0.2], [-0.4, 0.1]]), { fill: kc, shadow: P.lilacS, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, maxShade: 6 }); // the knot at the nape
    f.part(hF([[-0.54, 0.16], [-0.62, 0.42], [-0.54, 0.44], [-0.48, 0.2]]), { fill: kc, shadow: P.lilacS, shade: 0.4, maxShade: 4 }); }

  // ---- the basket on the near hip, hooked on the near forearm: swollen fruit splitting with mould, eyes in it
  f.bone('basket');
  const bc = [WN[0] + 4, WN[1] + 58];
  { const body = [[bc[0] - 66, bc[1] - 30], [bc[0] + 62, bc[1] - 36], [bc[0] + 54, bc[1] + 22], [bc[0] + 34, bc[1] + 50], [bc[0] - 38, bc[1] + 52], [bc[0] - 58, bc[1] + 24]];
    const fr = [[[-40, -36], 21, P.pink, { split: true }], [[-4, -44], 24, mix(P.pink, P.lilac, 0.4), { mould: true }], [[34, -42], 20, P.pinkD, {}], [[-22, -56], 18, mix(P.yel, P.pink, 0.4), { split: true }], [[14, -60], 17, P.pink, { mould: true }]];
    fr.forEach(([o2, r, col, op]) => fruitBall(add(bc, o2), r, col, op));
    X.eyes(f, [[add(bc, [-6, -46]), 12, 0.1, 0.7], [add(bc, [34, -42]), 9, -0.2, 0.15]], { lid: P.pink, lidS: P.pinkS });
    f.part(body, { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.4, inkHeavy: 2.4 });
    X.wicker(f, body, -0.03, 8, { col: P.yelD, lit: q => 0.35 + (q[0] - bc[0]) / 200 });
    f.part([[bc[0] - 68, bc[1] - 36], [bc[0] + 64, bc[1] - 42], [bc[0] + 64, bc[1] - 30], [bc[0] - 68, bc[1] - 24]], { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.3, cast: false, tex: 'straw' + seed, texOp: 0.7 }); // the rim
    X.mould(f, add(bc, [-28, 20]), 16, 10, { col: P.lilac, op: 0.6 }); }

  // ---- near arm: sleeve rolled, the forearm hooked over the basket's rim, the swollen hand curled over it
  X.mArm(f, SN, EN, lerp(EN, WN, 0.25), [48, 42, 40], BOD(), { sfx: '_n', bare: false });
  f.bone('forearm_n');
  X.mArm(f, lerp(EN, WN, 0.12), lerp(EN, WN, 0.5), WN, [42, 40, 32], SK(), { build: 'stout' });
  f.part(K.ragLimb(f, lerp(SN, EN, 0.8), add(EN, [-4, 8]), 50, 52, { depth: 5, teeth: 5 }), BOD({ cast: false }));
  X.peel(f, lp(EN, WN, 0.6, 4), 2, 0.8, 12, skin);
  f.bone('hand_n');
  X.openHand(f, WN, ang(EN, WN) + 0.45, 52, { look: SK({ fill: mix(skin, P.pink, 0.12) }), back: true, curl: 0.6, swell: 0.35 });
  X.pustules(f, add(WN, [10, 14]), 14, 10, 5, 3, 6, { col: mix(P.pink, P.skin, 0.3) });
  X.peel(f, add(WN, [20, 20]), 2, 0.7, 10, skin);

  f.bone('root');
  X.loamGround(f, 250, 700, gy, { depth: 12, petals: 3 });
  { const q = [640, gy - 4]; fruitBall(q, 11, P.pinkD, { split: true, stalk: false }); f.flat(ell(add(q, [0, 6]), 16, 4, 0, 10), P.loamD, { op: 0.4 }); X.puff(f, add(q, [6, -16]), 16, { n: 3 }); } // a fruit dropped and burst
  return f;
}

// ------------------------------------------------------------------ BEEKEEPER (cast, human 1.0)
// The garden's beekeeper, heavy-set, standing side-on with his weight settled on both feet and his head pushed forward
// from a rounded upper back. Over a cloth hood his face is shut in a woven willow cage shaped like a basket, the face only
// dimly seen behind the weave, moss growing through it. The straw skep is clamped under his near arm against the hip,
// and it has grown into him: its straw has rooted into his sleeve. The bees are gone; the skep is full of spore, and an
// eye looks out of its entrance hole. His far hand holds a torch of smouldering rag on a stick out in front; its smoke is
// spore. A long linen smock, leather gloves to the elbow, gaiters to the knee; at the belt a honey knife, a wax-sealed
// pot and a feather brush.
// Toxin: swollen sting pustules pocking the skin, mould on the smock, the skep's straw rooted into the sleeve, spore
// pouring from the skep and the torch, moss through the cage. Void: the eye in the skep's entrance; a clean round hole
// through the smock's skirt.
// Rig: standard humanoid + skep (parent forearm_n: grown into the arm) + torch (hand_f) + cage (head) + skirt (pelvis).
// Motion: idle patting the skep, which puffs (forearm_n, skep); attack thumping the skep (far hand lets the torch swing,
// the near arm squeezes, spore pours out).
function beekeeper() {
  const seed = 1430, W = 640, h = 820;
  const f = new Fig(X.base(seed, h, { grimeY: 600 })); X.texturesB(f);
  const H = 100, gy = f.o.groundY;
  const skin = mix(P.skin, P.loamBL, 0.2), skinS = P.skinS;
  const SMK = (o = {}) => LINEN(f, Object.assign({ fill: mix(P.bone, P.grey, 0.3), light: P.boneL, maxShade: 16 }, o));
  const GLV = (o = {}) => LEATH(f, Object.assign({ fill: mix(P.loamB, P.loamL, 0.3), maxShade: 12 }, o));
  const Pv = [286, 498], N0 = [330, 326];
  const S = B.spine(N0, [292, 396], Pv, H);
  const HC = [382, 290], hA = 0.16;
  const SN = [314, 352], EN = [326, 462], WN = [446, 524];
  const SF = [344, 342], EF = [400, 368], WF = [470, 380];
  const HN = [300, 506], KN = [322, 640], AN = [318, 766];
  const HF = [274, 502], KF = [252, 638], AF = [238, 764];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const tTop = [516, 196], tA = Math.atan2(tTop[1] - WF[1], tTop[0] - WF[0]);
  const SKC = [392, 492]; // the skep's centre
  f.joint('skep', lerp(EN, WN, 0.5), 'forearm_n').joint('torch', WF, 'hand_f').joint('cage', add(HC, [0, -10]), 'head').joint('skirt', S.at(0, 0.88), 'pelvis');

  // ---- far leg: linen breeches under the smock, the gaiter to the knee, a heavy shoe
  const legLook = LINEN(f, { fill: mix(P.greyD, P.loam, 0.3) });
  const gaiter = (Kn, A, sfx, tone) => { f.bone('shin' + sfx); const g0 = lerp(Kn, A, 0.12), gn = E.norm(sub(A, Kn)), gN = [-gn[1], gn[0]]; const gt = K.chain([g0, lerp(g0, A, 0.35), add(A, mul(gn, 6))], [52, 60, 44], { steps: 6 }); const gd = f.part(gt, LEATH(f, { fill: mix(P.loamL, '#000', tone), inkW: 1.3, k: 0.6 })); for (let i = 0; i < 5; i++) f.rivet(lerp(add(g0, mul(gN, 22)), add(A, mul(gN, 20)), 0.08 + i * 0.21), 2.2, P.greyD); stains(f, gd, E.bbox(gt), P.loamD, 0.05, 3, -1.2, 51, 0.8); f.line([add(g0, mul(gN, 26)), add(g0, mul(gN, -26))], 3, P.loamD); };
  X.mLeg(f, HF, KF, AF, [86, 60, 42], Object.assign({}, legLook, { fill: mix(legLook.fill, '#000', 0.2) }), { sfx: '_f', bare: false, build: 'stout' });
  gaiter(KF, AF, '_f', 0.25);
  X.bootRig(f, KF, AF, 54, mix('#2a221c', '#000', 0.2), '_f', { tex: 'mottle' + seed, shaft: 0.36, toe: 1.12 });

  // ---- far arm forward: the smock sleeve, the long glove, the torch held out
  X.mArm(f, SF, EF, lerp(EF, WF, 0.2), [50, 44, 42], SMK({ fill: mix(P.bone, P.grey, 0.5) }), { sfx: '_f', bare: false });
  f.bone('forearm_f');
  X.mArm(f, lerp(EF, WF, 0.0), lerp(EF, WF, 0.5), WF, [46, 42, 34], GLV({ fill: mix(P.loamB, P.loam, 0.3) }), { bare: false });
  f.part(K.ragLimb(f, lerp(EF, WF, -0.1), lerp(EF, WF, 0.12), 52, 52, { depth: 4, teeth: 4 }), GLV({ fill: mix(P.loamB, P.loamL, 0.2), cast: false })); // the glove's flared cuff
  f.bone('torch');
  { const tb = add(WF, mul([Math.cos(tA), Math.sin(tA)], -40)); f.part(ribbon(spline([tb, tTop], 6), spline([tb, tTop], 6).map(() => 11)), WOOD(f, { fill: mix(P.loamBL, '#000', 0.2) }));
    // the rag head, wound and charred, smouldering: no flame, only a dull ember edge and spore smoke
    const rh = add(tTop, [8, -18]);
    const rag = X.lumpy(f, [add(rh, [-22, 26]), add(rh, [-26, -4]), add(rh, [-10, -30]), add(rh, [14, -30]), add(rh, [26, -6]), add(rh, [22, 24])], 4);
    f.part(rag, { fill: '#2a2624', shadow: '#0a0808', light: '#5a5450', shade: 0.4, tex: 'weave' + seed, texOp: 0.6, maxShade: 10 });
    for (let i = 0; i < 4; i++) f.line([add(rh, [-24, 20 - i * 13]), add(rh, [0, 14 - i * 13]), add(rh, [24, 18 - i * 13])], 2, '#0c0a0a', { op: 0.7 }); // the wraps
    for (const [dx, dy] of [[-12, -26], [8, -28], [20, -14]]) f.flat(ell(add(rh, [dx, dy]), 5, 2.4, 0.3, 8), mix(P.yel, '#fff', 0.2), { op: 0.7 }); // the dull smoulder (pale, not red)
    for (let i = 0; i < 5; i++) X.puff(f, add(rh, [10 + i * 18, -40 - i * 34]), 22 + i * 6, { col: mix(P.yelL, P.grey, 0.3), op: 0.32, specks: 6 }); }
  f.bone('hand_f');
  X.gripK(f, WF, EF, tA, 25, mix(P.loamB, P.loam, 0.25), { tex: 'mottle' + seed, shadow: P.loamD, name: 'beekeeper torch' });

  // ---- torso: the long linen smock, stout and rounded, the upper back pushing the head forward
  f.bone('torso');
  const tor = S.shape([[0.02, 0.22, 0.26], [0.12, 0.54, 0.58], [0.28, 0.76, 0.86], [0.48, 0.64, 0.84], [0.66, 0.44, 0.7], [0.8, 0.46, 0.72], [1.04, 0.78, 0.84]]); // (independent review) a stout chest, the smock drawn in at the belted waist, the hips flaring
  const td = f.part(tor, SMK());
  clipDraw(f, td, () => { softTone(f, td, [[[S.at(-1.1, 0.0), S.at(-0.4, 0.0), S.at(-0.4, 1.1), S.at(-1.1, 1.1)], '#000', 0.35, 14], [[S.at(0.3, 0.6), S.at(0.9, 0.6), S.at(0.9, 1.1), S.at(0.3, 1.1)], '#000', 0.25, 12]]);
    for (const [v0, v1, u] of [[0.1, 0.5, -0.5], [0.2, 0.9, -0.2], [0.3, 0.95, 0.2], [0.5, 1.0, 0.5]]) X.fold(f, [S.at(u, v0), S.at(u + 0.06, (v0 + v1) / 2), S.at(u - 0.02, v1)], 2.8, { dk: P.greyS, lt: P.boneL });
    stains(f, td, E.bbox(tor), P.loamD, 0.03, 2.6, -1.3, 53, 0.55); X.mould(f, S.at(-0.4, 0.5), 18, 14, { col: P.lilac, op: 0.6 }); X.mould(f, S.at(0.5, 0.3), 10, 8, { col: P.yel, op: 0.5 });
    f.line([S.at(-0.6, 0.08), S.at(-0.3, 0.28), S.at(0.0, 0.32), S.at(0.3, 0.26)], 1.4, P.greyS, { op: 0.7 }); f.stitches([S.at(-0.58, 0.12), S.at(-0.3, 0.32), S.at(0.0, 0.36)], P.greyS, 0.8); // the yoke seam
    for (const u of [-0.3, 0.0, 0.3, 0.6]) X.fold(f, [S.at(u, 0.8), S.at(u + 0.05, 0.62), S.at(u + 0.02, 0.44)], 2.2, { dk: P.greyS, lt: P.boneL }); // smocking gathered above the belt
    X.pustules(f, S.at(0.2, 0.1), 10, 6, 3, 2.4, 4, { col: mix(P.pink, P.skin, 0.4) });
    softTone(f, td, [[[S.at(0.1, 0.16), S.at(0.9, 0.2), S.at(0.9, 0.42), S.at(0.1, 0.4)], P.boneL, 0.4, 12], [[S.at(0.0, 0.5), S.at(0.9, 0.48), S.at(0.9, 0.6), S.at(0.0, 0.62)], P.greyS, 0.45, 10], [[S.at(-0.6, 0.62), S.at(0.8, 0.62), S.at(0.8, 0.78), S.at(-0.6, 0.78)], P.greyS, 0.3, 8]]); // the chest's lit plane, the shadow under it, the waist drawn in
    for (const u of [-0.4, -0.15, 0.1, 0.35, 0.58]) X.fold(f, [S.at(u, 0.78), S.at(u + 0.04, 0.7), S.at(u - 0.04, 0.6)], 2.4, { dk: P.greyS, lt: P.boneL }); }); // the smock bloused over the belt

  // ---- the hood falling from under the cage over the neck and shoulders
  f.bone('head');
  const hF = frame(HC, hA, H);
  const hood = [hF([[-0.5, -0.1]])[0], hF([[-0.2, -0.56]])[0], hF([[0.3, -0.5]])[0], hF([[0.46, 0.0]])[0], hF([[0.36, 0.5]])[0], S.at(0.7, 0.16), S.at(0.5, 0.3), S.at(0.0, 0.34), S.at(-0.5, 0.3), S.at(-0.66, 0.1), hF([[-0.6, 0.4]])[0]];
  const hd = f.part(hood, LINEN(f, { fill: mix(P.grey, P.lilacD, 0.35), light: P.lilacL, maxShade: 14 }));
  clipDraw(f, hd, () => { X.fold(f, [hF([[-0.4, 0.4]])[0], S.at(-0.3, 0.1)], 2.6, { dk: P.greyS }); X.fold(f, [hF([[0.2, 0.5]])[0], S.at(0.4, 0.14)], 2.4, { dk: P.greyS }); stains(f, hd, E.bbox(hood), P.loamD, 0.04, 3, -1.4, 59, 0.5); });

  // ---- near leg
  X.mLeg(f, HN, KN, AN, [88, 62, 44], legLook, { sfx: '_n', bare: false, build: 'stout' });
  gaiter(KN, AN, '_n', 0);
  X.bootRig(f, KN, AN, 56, '#2a221c', '_n', { tex: 'mottle' + seed, shaft: 0.36, toe: 1.12 });

  // ---- the smock's skirt to the knee, belted: honey knife, wax-sealed pot, feather brush at the belt
  f.bone('skirt');
  const sk = [S.at(-0.5, 0.82), S.at(0.76, 0.8), [392, 560], [404, 640], ...X.hemLine(f, [404, 646], [196, 642], 10, 10), [200, 600], S.at(-0.72, 0.96)]; // flaring out behind from the drawn-in waist
  X.cutHoles(f, [[[352, 606], 9]], () => {
    const skd = f.part(sk, SMK());
    clipDraw(f, skd, () => { X.folds(f, [[226, 530], [252, 526], [282, 530], [312, 532], [344, 540], [372, 548]], 110, 4.2, { dk: P.greyS, lt: P.boneL }); softTone(f, skd, [[[[200, 600], [420, 600], [420, 660], [200, 660]], P.loamD, 0.35, 12]]); stains(f, skd, [200, 500, 420, 650], P.loamD, 0.035, 3, -1.4, 57, 0.7); f.flat([[200, 520], [250, 520], [250, 660], [200, 660]], '#000', { op: 0.25 }); X.mould(f, [270, 600], 16, 10, { col: P.lilac, op: 0.6 }); });
  }, { shape: E.smooth(sk) });
  f.bone('pelvis');
  f.part([S.at(-0.5, 0.79), S.at(0.76, 0.77), S.at(0.78, 0.87), S.at(-0.52, 0.89)], LEATH(f, { fill: P.loam, cast: false, inkW: 1.2 })); f.part(ell(S.at(0.6, 0.83), 9, 8, 0, 8), IRON(f, { cast: false })); // the belt cinched at the waist, its buckle
  { const p0 = S.at(-0.5, 0.92); // the wax-sealed pot on a cord
    f.line([add(p0, [0, -6]), add(p0, [-2, 14])], 1.6, P.loamB);
    const pot = [add(p0, [-18, 16]), add(p0, [14, 16]), add(p0, [20, 34]), add(p0, [16, 58]), add(p0, [-14, 60]), add(p0, [-22, 36])];
    f.part(pot, { fill: mix(P.grey, P.loamB, 0.4), shadow: P.loamD, light: P.greyL, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6 });
    f.part([add(p0, [-20, 12]), add(p0, [16, 12]), add(p0, [16, 22]), add(p0, [-20, 22])], { fill: P.yelD, shadow: P.yelS, shade: 0.35, inkW: 1, cast: false }); // the wax seal
    f.flat([add(p0, [-6, 20]), add(p0, [-2, 34]), add(p0, [2, 20])], P.yelD, { op: 0.8 }); }
  { const k0 = S.at(0.1, 0.9); f.part([add(k0, [-6, 0]), add(k0, [6, 0]), add(k0, [5, 34]), add(k0, [-5, 34])], WOOD(f, { cast: false })); f.part([add(k0, [-7, 34]), add(k0, [7, 34]), add(k0, [8, 86]), [...add(k0, [0, 96]), 1], add(k0, [-8, 86])], IRON(f, { fill: '#6a6868', cast: false })); f.line([add(k0, [3, 38]), add(k0, [3, 88])], 1, P.greyL, { op: 0.7 }); } // the honey knife, flat and broad
  { const b0 = S.at(0.5, 0.84); f.line([b0, add(b0, [10, -60])], 2.4, P.loamBL); for (let i = 0; i < 9; i++) { const q = add(b0, [2 + i * 1.1, -20 - i * 4.4]); f.line([q, add(q, [14 - i * 0.6, -4])], 1.4, i % 2 ? P.greyL : P.grey); f.line([q, add(q, [-12 + i * 0.6, -6])], 1.4, i % 2 ? P.grey : P.greyL); } } // the feather brush tucked in the belt

  // ---- the woven willow face cage over the hood; the face dimly seen through the weave
  f.bone('head');
  headW(f, HC, H * 0.92, hA, { skin, jaw: 1.14, chin: 0.02, nose: 1.1, hook: 0.1, mouth: 'set', squint: 0.5, browDown: 0.05, faceShade: 0.8, jawShade: 0.5, age: true, noEar: true, iris: '#4a4250', eyeWhite: '#bfb6aa', hairCol: '#3a3230' });
  X.pustules(f, hF([[0.06, 0.14]])[0], 14, 10, 5, 2.4, 4.2, { col: mix(P.pink, P.skin, 0.4) });
  f.bone('cage');
  { const cc = hF([[0.02, -0.04]])[0], rx = H * 0.6, ry = H * 0.66;
    f.flat(ell(cc, rx * 0.98, ry * 0.98, hA, 30), '#0e0c0e', { op: 0.42 }); // the cage's shade over the face
    // stakes: meridians of the dome, curving round it; rods woven across them in bands, over and under, gaps between
    const at = (lon, lat) => add(cc, rot([Math.sin(lon) * Math.cos(lat) * rx, -Math.sin(lat) * ry], hA)); // lon: -pi/2..pi/2 visible, lat: -pi/2..pi/2
    for (let k = 0; k < 11; k++) { const lon = -1.45 + k * 0.29, pts = []; for (let i = 0; i <= 16; i++) pts.push(at(lon, -1.25 + i * 0.16)); f.line(pts, 4.4, INK, { op: 0.9 }); f.line(pts, 2.8, mix(P.yelD, P.loamB, 0.3)); f.line(pts.map(q => add(q, mul(f.L, 0.8))), 0.8, P.yelL, { op: 0.4 }); }
    for (let b = 0; b < 7; b++) { const lat = -1.05 + b * 0.32; for (let k = 0; k < 10; k++) { const l0 = -1.45 + k * 0.29, l1 = l0 + 0.29, over = (k + b) % 2; const pts = [at(l0 + 0.02, lat), at(l0 + 0.145, lat + 0.03), at(l1 - 0.02, lat)]; f.line(pts, 7.4, INK, { op: over ? 0.9 : 0.5 }); f.line(pts, 5.4, over ? mix(P.yel, P.loamB, 0.15) : mix(P.yelD, P.loamD, 0.4)); if (over) f.line(pts.map(q => add(q, mul(f.L, 1.2))), 1.2, P.yelL, { op: 0.55 }); } }
    // the rim round the neck and a binding at the crown
    const rim = []; for (let i = 0; i <= 20; i++) rim.push(at(-1.5 + i * 0.15, -1.25)); f.line(rim, 9, INK); f.line(rim, 6.5, mix(P.yelD, P.loamB, 0.25)); f.line(rim.map(q => add(q, mul(f.L, 1.5))), 1.4, P.yelL, { op: 0.5 });
    f.part(ell(at(0, 1.35), 12, 7, hA, 10), { fill: P.yelD, shadow: P.yelS, shade: 0.4, inkW: 1.2, cast: false, tex: 'straw' + seed, texOp: 0.6 });
    // moss growing through the weave, rotted near-black, with a few fruiting stalks; mould on the rods
    X.moss(f, [at(-1.3, 0.6), at(-1.1, 0.95), at(-0.5, 1.15)], 7, { col: P.rot });
    X.moss(f, [at(0.9, -0.9), at(1.2, -0.5)], 6, { col: P.rot });
    X.mould(f, at(0.6, 0.6), 12, 8, { col: mix(P.lilac, P.grey, 0.3), op: 0.7 }); }

  // ---- the skep under the near arm, grown into it: coiled straw, the entrance hole at its foot with an eye in it,
  // spore leaking from the coils; its straw rooted into the sleeve where the arm presses it
  f.bone('skep');
  { const c = SKC, w = 66, hh = 92, sa = -0.12;
    const SF0 = frame(c, sa, 1), dome = [[-w, hh * 0.55, 1], ...Array.from({ length: 13 }, (_, i) => { const t = Math.PI * (1 - i / 12); return [Math.cos(t) * w * (1.02 + 0.06 * Math.sin(t)), hh * 0.55 - Math.sin(t) * hh * 1.45]; }), [w, hh * 0.55, 1]].map(q => SF0([q])[0].concat(q[2] ? [1] : []));
    X.hostShadow(f, dome, 12, 0.5);
    const dd = f.part(dome, { fill: P.yelD, shadow: P.yelS, light: P.yelL, shade: 0.4, maxShade: 22, inkW: 1.5, inkHeavy: 3 });
    const rows = []; for (let i = 0; i < 10; i++) { const y = hh * 0.5 - i * hh * 0.15; rows.push([SF0([[-w * 1.1, y]])[0], SF0([[w * 1.1, y]])[0], hh * 0.16]); }
    X.coiledStraw(f, dd, rows, { bow: -0.35, col: P.yel, lit: q => Math.max(0, Math.min(1, 0.45 + (q[0] - c[0]) / (w * 2.2) - (q[1] - c[1]) / (hh * 3))), bind: P.loamB });
    clipDraw(f, dd, () => softTone(f, dd, [[[[c[0] - w * 1.2, c[1] - hh], [c[0] - w * 0.2, c[1] - hh], [c[0] - w * 0.3, c[1] + hh], [c[0] - w * 1.2, c[1] + hh]], P.loamD, 0.45, 16], [[[c[0] - w * 1.2, c[1] + hh * 0.3], [c[0] + w * 1.2, c[1] + hh * 0.3], [c[0] + w * 1.2, c[1] + hh], [c[0] - w * 1.2, c[1] + hh]], P.loamD, 0.4, 12]]));
    X.mould(f, add(c, [-w * 0.5, -hh * 0.2]), 18, 14, { col: P.lilac, op: 0.7 }); X.mould(f, add(c, [w * 0.3, -hh * 0.6]), 12, 9, { col: P.lilac, op: 0.6 });
    // the entrance hole at the front of the base: dark, an eye looking out of it, spore curling from it
    const en = SF0([[-w * 0.18, hh * 0.38]])[0];
    f.part([add(en, [-20, 14]), add(en, [-18, -6]), add(en, [0, -14]), add(en, [18, -6]), add(en, [20, 14])], { fill: '#0c0a0c', shadow: '#000', shade: 0.2, inkW: 1.6, cast: false, hatch: false });
    X.eye(f, add(en, [0, 2]), 18, 0.0, { open: 0.85, lid: mix(P.yelD, P.loamD, 0.4), lidS: P.loamD, look: [0.12, 0.04] });
    X.puff(f, add(en, [24, -10]), 18, { col: P.yelL, op: 0.2, specks: 6 });
    for (const q of [add(c, [-w * 0.7, -hh * 0.1]), add(c, [w * 0.6, -hh * 0.3])]) X.spores(f, q, 10, 8, 4);
    f.line([SF0([[-w - 4, hh * 0.56]])[0], SF0([[w + 4, hh * 0.56]])[0]], 3, P.loamD); } // the base board's edge

  // ---- near arm over the skep: sleeve, the long glove, the gloved hand cupping its front; straw rooted into the sleeve
  X.mArm(f, SN, EN, lerp(EN, WN, 0.2), [52, 46, 44], SMK({ fill: mix(P.bone, P.grey, 0.5), maxShade: 20 }), { sfx: '_n', bare: false, after: (u) => { X.fold(f, [u(0.2, -0.3), u(0.45, 0.1), u(0.6, 0.4)], 2.4, { dk: P.greyS }); X.fold(f, [u(0.55, -0.4), u(0.75, 0.0), u(0.85, 0.3)], 2.2, { dk: P.greyS }); } });
  f.bone('forearm_n');
  X.mArm(f, lerp(EN, WN, 0.0), lerp(EN, WN, 0.5), WN, [48, 44, 36], GLV(), { bare: false });
  f.part(K.ragLimb(f, lerp(EN, WN, -0.1), lerp(EN, WN, 0.14), 54, 54, { depth: 4, teeth: 4 }), GLV({ fill: mix(P.loamB, P.loamL, 0.45), cast: false }));
  for (let i = 0; i < 26; i++) { const q = lerp(lerp(SN, EN, 0.4), lerp(EN, WN, 0.6), f.r()), a = R(f, -2.4, -0.8), l = R(f, 10, 26); f.line([add(q, [R(f, -10, 10), R(f, -6, 6)]), add(q, rot([l, 0], a))], R(f, 1, 1.8), f.r() > 0.4 ? P.yel : P.yelD, { op: 0.9 }); } // the straw rooted into the sleeve
  X.pustules(f, lp(SN, EN, 0.5, 10), 10, 12, 3, 2.6, 4.4, { col: mix(P.pink, P.skin, 0.4) });
  f.bone('hand_n');
  X.openHand(f, WN, ang(EN, WN) - 0.3, 54, { look: GLV(), back: true, curl: 0.5, swell: 0.25 });
  f.line([add(WN, [-4, -18]), add(WN, [10, 18])], 1, P.loamD, { op: 0.6 }); // the glove's seam

  f.bone('root');
  X.loamGround(f, 150, 520, gy, { depth: 12, petals: 2 });
  return f;
}

// ------------------------------------------------------------------ SCARECROW (cast, human 1.1)
// The scarecrow of the garden's kitchen plot. It hangs on its pole with the arms spread along the crossbar, seen nearly
// front-on so the cross reads; the pole's foot has been torn out of the ground, a clod of loam and roots still on it, and
// it leans forward on the pole, which takes its weight like a third leg, the stuffed legs half walking under it. A sacking
// body stuffed with straw, the straw rotted black and grown through with pale fungus; mould blooms along the seams and
// spore drifts out of them; pustules of fungus bulge the sacking. An old gardener's coat with half its buttons gone and a
// patch on one elbow; rope bindings tie the wrists to the crossbar, straw bursting from the cuffs (eyes open in it); a
// battered felt hat with a crow's feather; a dead crow tied to the far arm by its feet; a tin cup hanging from a nail on
// the pole; a rotting turnip in the coat pocket; rag strips hanging from the crossbar. The head is a stuffed sack with a
// stitched face, the mouth sewn shut in black thread, mould growing out of the eye holes.
// Toxin: rotted black straw grown with pale fungus (small bonnet caps and threads), mould along every seam, fungal
// pustules bulging the sacking, spore. Void: a clean round hole right through the chest (the ground shows through); eyes
// in the straw at the cuffs.
// Rig: pelvis (root) > torso > head > hat; pole (pelvis: the crossbar, the arms bound to it, the cup and rags) > arm_n,
// arm_f (sleeves on the bar), crow (arm_f); legs thigh/shin/foot _n and _f. Motion: idle a slow swing on the pole, straw
// dropping (pole, torso); attack lurching forward on the pole and clubbing with the crossbar arm (pole, arm_n swing down).
function scarecrow() {
  const seed = 1424, W = 900, h = 900;
  const f = new Fig(X.base(seed, h, { grimeY: 700 })); X.texturesB(f);
  const H = 110, gy = f.o.groundY;
  const SACK = (o = {}) => Object.assign({ fill: mix(P.grey, P.loamB, 0.3), shadow: mix(P.greyS, P.loamD, 0.4), light: P.greyL, shade: 0.42, tex: 'weave' + seed, texOp: 0.7, maxShade: 16 }, o);
  const COAT = (o = {}) => Object.assign({ fill: mix(P.loamL, P.grey, 0.25), shadow: P.loamD, light: P.loamBL, shade: 0.42, tex: 'weave' + seed, texOp: 0.55, maxShade: 18 }, o);
  const TROU = (o = {}) => Object.assign({ fill: mix(P.loam, P.loamB, 0.45), shadow: P.loamD, light: P.loamB, shade: 0.42, tex: 'weave' + seed, texOp: 0.55, maxShade: 14 }, o);
  // the pole leans forward (toward the party) about 13 degrees; its foot torn out of the loam, dragging behind
  const pF = [250, gy - 8], pT = [530, 40], pd = E.norm(sub(pT, pF)), pn = [-pd[1], pd[0]];
  const at = t => lerp(pF, pT, t); // along the pole
  const Pv = at(0.42), N0 = at(0.68), HC = add(at(0.745), [8, 0]), hA = 0.2;
  // the crossbar through the shoulders, square to the pole: far end up and back, near end forward and down
  const cb = at(0.665), cd = [-pn[0], -pn[1]], cbF = add(cb, mul(cd, -330)), cbN = add(cb, mul(cd, 330));
  const SNa = add(cb, mul(cd, 64)), SFa = add(cb, mul(cd, -56)), WNa = add(cb, mul(cd, 270)), WFa = add(cb, mul(cd, -262));
  const HN = add(Pv, [30, 20]), KN = [500, 712], AN = [478, gy - 50];
  const HF = add(Pv, [-28, 14]), KF = [402, 716], AF = [372, gy - 56];
  f.joint('pelvis', Pv).joint('torso', at(0.62), 'pelvis').joint('head', N0, 'torso').joint('hat', add(HC, [0, -50]), 'head');
  f.joint('pole', Pv, 'pelvis').joint('arm_n', SNa, 'pole').joint('arm_f', SFa, 'pole').joint('crow', lerp(SFa, WFa, 0.6), 'arm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  const hole = [at(0.55), 22];
  const straw = (c, a, n, len, o = {}) => { for (let i = 0; i < n; i++) { const aa = a + R(f, -0.7, 0.7), l = len * R(f, 0.5, 1.2), q = add(c, [R(f, -6, 6), R(f, -6, 6)]), e = add(q, rot([l, 0], aa)); f.line([q, add(lerp(q, e, 0.5), [R(f, -3, 3), R(f, -3, 3)]), e], R(f, 1.2, 2.4), f.r() < (o.black ?? 0.55) ? mix(P.loamD, P.yelS, 0.3) : (f.r() > 0.5 ? P.yelD : mix(P.yel, P.grey, 0.3)), { op: 0.95 }); } };
  const bonnets = (c, a, n, s) => X.caps(f, c, a, s, n, { shape: 'conic', cols: [mix(P.bone, P.grey, 0.2), P.yelL, mix(P.bone, P.lilac, 0.2)], w: 0.2, sw: 0.08, stemL: 0.8, fan: 0.5, warts: 0 });

  // ---- the pole and the crossbar (behind the body): split ash, grey with weather, the foot torn out of the ground
  f.bone('pole');
  const POLE = WOOD(f, { fill: mix(P.loamBL, P.grey, 0.4), light: P.greyL, inkW: 1.4, inkHeavy: 2.6 });
  { const C = spline([pF, pT], 8); f.part(ribbon(C, C.map((_, i) => 26 - 6 * i / C.length)), POLE); f.line(offsetL(C, -6), 1.4, P.greyL, { op: 0.45 }); for (let i = 0; i < 6; i++) { const t = R(f, 0.05, 0.95); f.line([lp(pF, pT, t, R(f, -8, 8)), lp(pF, pT, t + 0.03, R(f, -8, 8))], 1, INK, { op: 0.6 }); } }
  { const C = spline([cbF, cbN], 8); f.part(ribbon(C, C.map(() => 22)), POLE); f.line(offsetL(C, -5), 1.4, P.greyL, { op: 0.45 }); }
  // the nail and the tin cup hanging from it, under the crossbar on the pole
  { const nl = lp(pF, pT, 0.72, 12); f.line([nl, add(nl, [10, -2])], 3, '#3a3838'); const cp = add(nl, [8, 6]); f.line([cp, add(cp, [0, 8])], 1.4, '#5a5858'); const cup = [add(cp, [-12, 10]), add(cp, [12, 10]), add(cp, [10, 34]), add(cp, [-10, 34])]; f.part(cup, IRON(f, { fill: '#7a7a7c', light: '#c2c2c4' })); f.flat(ell(add(cp, [0, 10]), 12, 3, 0, 10), '#2a2a2c'); f.line([add(cp, [12, 14]), add(cp, [20, 18]), add(cp, [12, 26])], 2, '#5a5858'); f.flat(ell(add(cp, [4, 26]), 4, 3, 0, 8), '#5a4434', { op: 0.6 }); }
  // the rag strips hanging plumb from both ends of the crossbar
  for (const [c0, n] of [[lerp(cb, cbF, 0.92), 4], [lerp(cb, cbN, 0.95), 3]]) for (let i = 0; i < n; i++) { const q = add(c0, [(i - n / 2) * 9, 6]), l = R(f, 50, 110); const rg = [add(q, [-5, 0]), add(q, [5, 0]), add(q, [6 + R(f, -3, 3), l * 0.5]), [q[0] + R(f, -4, 6), q[1] + l, 1], add(q, [-4 + R(f, -3, 3), l * 0.6])]; f.part(rg, { fill: [mix(P.lilacD, P.grey, 0.3), mix(P.pinkD, P.grey, 0.4), mix(P.bone, P.grey, 0.5)][i % 3], shadow: P.lilacS, shade: 0.4, maxShade: 4, tex: 'weave' + seed, texOp: 0.5, inkW: 1, inkHeavy: 1.4, cast: true, castOp: 0.3 }); }
  // the torn-out foot: a clod of loam and broken roots still on it (on the pole), a drag furrow behind (ground)
  f.bone('pole');
  { const cl = X.lumpy(f, ell(add(pF, [0, -10]), 34, 22, 0, 14), 6); f.part(cl, { fill: P.loam, shadow: P.loamD, light: P.loamL, shade: 0.4, maxShade: 10, tex: 'mottle' + seed, texOp: 0.8, inkW: 1.3, grime: false });
    for (let i = 0; i < 6; i++) { const a = R(f, 1.8, 3.6), q = add(pF, rot([26, 0], a)); f.line([q, add(q, rot([R(f, 14, 30), 0], a + R(f, -0.4, 0.4)))], R(f, 1.2, 2.4), P.loamB, { op: 0.9 }); }
  }

  // ---- far leg: stuffed trouser leg, half walking, straw at the ankle, a split boot
  const legDraw = (Hp, Kn, A, sfx, tone) => {
    X.mLeg(f, Hp, Kn, A, [66, 52, 40], TROU({ fill: mix(mix(P.loam, P.loamB, 0.45), '#000', tone) }), { sfx, bare: false });
    f.bone('shin' + sfx);
    X.rope(f, [lp(Kn, A, 0.86, -22), lp(Kn, A, 0.9, 0), lp(Kn, A, 0.86, 22)], 3, P.yelD, { lit: false }); // twine at the ankle
    straw(lp(Kn, A, 0.92, 0), Math.PI / 2, 9, 22);
    X.mould(f, lp(Kn, A, 0.4, 6), 10, 14, { col: mix(P.lilac, P.grey, 0.3), op: 0.6 });
    f.bone('thigh' + sfx);
    X.fold(f, [lp(Hp, Kn, 0.3, -26), lp(Hp, Kn, 0.45, 0), lp(Hp, Kn, 0.4, 24)], 2.6, { dk: P.loamD, lt: P.loamBL }); X.fold(f, [lp(Hp, Kn, 0.7, -24), lp(Hp, Kn, 0.82, 4), lp(Hp, Kn, 0.78, 26)], 2.6, { dk: P.loamD, lt: P.loamBL });
    { const tr = lp(Hp, Kn, 0.6, tone ? -10 : 12); f.flat(X.lumpy(f, ell(tr, 12, 8, 0.4, 10), 3), P.loamD); straw(tr, -0.4 + (tone ? Math.PI : 0), 7, 22); } // a tear, straw poking out
    f.bone('shin' + sfx);
    { const pc = [lp(Kn, A, 0.08, -22), lp(Kn, A, 0.08, 20), lp(Kn, A, 0.32, 20), lp(Kn, A, 0.32, -22)]; f.part(pc.map(q => [...q, 1]), TROU({ fill: mix(P.greyD, P.loamB, 0.5 + tone), inkW: 1.1, cast: false })); f.stitches([...pc, pc[0]], P.boneL, 0.8); } // a knee patch
    X.bootRig(f, Kn, A, 52, mix('#2c241e', '#000', tone), sfx, { tex: 'mottle' + seed, shaft: 0.36, toe: 1.1 });
  };
  legDraw(HF, KF, AF, '_f', 0.25);

  // ---- far arm: a coat sleeve stuffed and bound along the bar, straw bursting from the cuff, the dead crow hung from it
  const armDraw = (S0, W0, sfx, tone, wS) => {
    f.bone('arm' + sfx);
    const C = spline([S0, lerp(S0, W0, 0.5), W0], 6), dn = [-cd[1], cd[0]];
    const sl = ribbon(C, C.map((_, i) => wS * (1 - 0.25 * i / C.length) * (1 + 0.08 * Math.sin(i * 0.9))));
    const sd = f.part(sl, COAT({ fill: mix(COAT().fill, '#000', tone), maxShade: wS * 0.35 }));
    clipDraw(f, sd, () => { for (let i = 1; i < 5; i++) X.fold(f, [lp(S0, W0, i * 0.2 - 0.04, -wS * 0.45), lp(S0, W0, i * 0.2, 0), lp(S0, W0, i * 0.2 + 0.03, wS * 0.45)], 2.4, { dk: P.loamD, lt: P.loamBL }); stains(f, sd, E.bbox(sl), P.loamD, 0.04, 3, -1.3, 61 + tone * 10, 0.6); });
    X.rope(f, [lp(S0, W0, 0.88, -wS * 0.5), lp(S0, W0, 0.9, 0), lp(S0, W0, 0.88, wS * 0.5)], 4, P.loamBL, { lit: false });
    X.rope(f, [lp(S0, W0, 0.84, -wS * 0.55), add(lp(S0, W0, 0.84, -wS * 0.55), mul(cd, 12 * Math.sign(W0[0] - S0[0])))], 4, P.loamBL, { lit: false }); // the binding round the bar
    const cuff = lp(S0, W0, 1.0, 0); straw(cuff, Math.atan2(W0[1] - S0[1], W0[0] - S0[0]), 26, 50, { black: 0.55 }); straw(cuff, Math.PI / 2, 10, 40, { black: 0.7 });
    bonnets(add(cuff, [0, 4]), Math.atan2(W0[1] - S0[1], W0[0] - S0[0]) - 0.6, 3, 22);
    X.eyes(f, [[add(cuff, mul(cd, Math.sign(W0[0] - S0[0]) * 18)), 11, Math.atan2(W0[1] - S0[1], W0[0] - S0[0]) + 1.57, 0.6]], { lid: mix(P.yelD, P.loamD, 0.3), lidS: P.loamD });
    return { C, wS };
  };
  armDraw(SFa, WFa, '_f', 0.18, 50);
  f.bone('crow');
  { const k0 = lerp(SFa, WFa, 0.6); f.line([k0, add(k0, [2, 26])], 2, P.loamBL); // the cord round its feet
    const cr = add(k0, [2, 30]); f.line([cr, add(cr, [-4, 10])], 1.6, '#1a1818'); f.line([cr, add(cr, [5, 10])], 1.6, '#1a1818'); // the feet
    const body = [add(cr, [-14, 14]), add(cr, [14, 12]), add(cr, [18, 50]), add(cr, [8, 78]), add(cr, [-6, 80]), add(cr, [-16, 48])];
    f.part(body, { fill: '#1e1c22', shadow: '#060508', light: '#4a4656', shade: 0.42, maxShade: 8, tex: 'barb' + seed, texOp: 0.7, inkW: 1.3 });
    for (let i = 0; i < 5; i++) { const q = add(cr, [-14 + i * 7, 40 + (i % 2) * 6]); f.line([q, add(q, [R(f, -3, 3), 30 + R(f, 0, 14)])], 2.2, '#2a2830'); } // limp wing feathers
    const hd = add(cr, [0, 86]); f.part(ell(hd, 10, 12, 0, 10), { fill: '#1e1c22', shadow: '#060508', shade: 0.4, inkW: 1.2, cast: false }); f.part([add(hd, [-3, 8]), add(hd, [4, 8]), [hd[0] + 1, hd[1] + 30, 1]], { fill: '#2e2c30', shade: 0.3, inkW: 1, cast: false }); // the head hanging down, the beak
    f.flat(ell(add(hd, [3, -2]), 2, 2, 0, 6), P.boneD); X.mould(f, add(cr, [0, 44]), 9, 12, { col: mix(P.lilac, P.grey, 0.4), op: 0.7, rings: 1 }); }

  // ---- the body: a stuffed sack under the coat, seams split, straw and fungus out of them; the clean hole through it
  f.bone('torso');
  const tor = [add(SFa, [-6, -14]), lerp(SFa, SNa, 0.5), add(SNa, [8, -10]), add(SNa, [14, 40]), add(at(0.62), [62, 20]), add(Pv, [56, 10]), add(Pv, [40, 46]), add(Pv, [-44, 44]), add(Pv, [-56, 4]), add(at(0.62), [-60, 10]), add(SFa, [-20, 40])];
  X.cutHoles(f, [hole], () => {
    const td = f.part(tor, SACK());
    clipDraw(f, td, () => { stains(f, td, E.bbox(tor), P.loamD, 0.03, 2.6, -1.3, 63, 0.6); X.fold(f, [add(SFa, [10, 40]), add(at(0.65), [-30, 10]), add(Pv, [-30, 20])], 2.6, { dk: P.greyS }); });
    // the old coat over it: open at the front, half the buttons gone, a turnip in the pocket
    const coatL = [add(SFa, [-4, -12]), add(at(0.74), [-6, -10]), add(at(0.66), [-10, 30]), add(Pv, [-18, 40]), add(Pv, [-8, 120]), add(Pv, [-76, 116]), add(Pv, [-62, 20]), add(SFa, [-24, 40])];
    const coatR = [add(at(0.74), [10, -12]), add(SNa, [10, -10]), add(SNa, [20, 44]), add(at(0.6), [70, 24]), add(Pv, [70, 60]), add(Pv, [84, 130]), add(Pv, [14, 124]), add(Pv, [8, 40]), add(at(0.66), [14, 30])];
    for (const [cp, tn] of [[coatL, 0.15], [coatR, 0]]) { const cd2 = f.part(cp, COAT({ fill: mix(COAT().fill, '#000', tn) })); clipDraw(f, cd2, () => { X.folds(f, [cp[1], cp[2], add(cp[2], [-20, 30])], 100, 2.6, { dk: P.loamD, lt: P.loamBL }); stains(f, cd2, E.bbox(cp), P.loamD, 0.04, 3, -1.3, 65 + tn * 10, 0.6); X.mould(f, lerp(cp[2], cp[4], 0.5), 14, 18, { col: P.lilac, op: 0.6 }); }); }
    for (let i = 0; i < 4; i++) { const q = add(lerp(add(at(0.66), [14, 30]), add(Pv, [8, 40]), i / 3), [6, 0]); if (i % 2) f.flat(ell(q, 3, 2.4, 0, 6), P.loamD, { op: 0.8 }); else f.rivet(q, 4, P.boneD); } // buttons, half gone
    // the pocket with the rotting turnip
    { const pk = add(Pv, [40, 76]); f.part([add(pk, [-26, -8]), add(pk, [26, -10]), add(pk, [28, 28]), add(pk, [-24, 30])], COAT({ fill: mix(P.loamL, P.grey, 0.1), inkW: 1.1, cast: false })); const tn = add(pk, [0, -16]); f.part(X.lumpy(f, ell(tn, 18, 15, 0, 12), 3), X.FL(f, mix(P.lilac, P.bone, 0.3), { maxShade: 6 })); f.flat(ell(add(tn, [0, 6]), 16, 8, 0, 10), mix(P.lilacD, P.loamD, 0.3), { op: 0.6 }); X.mould(f, add(tn, [4, -2]), 8, 6, { col: P.yel, op: 0.7, rings: 1 }); for (let i = 0; i < 4; i++) f.line([add(tn, [-4 + i * 3, -12]), add(tn, [-10 + i * 6, -30])], 2, P.rotL); }
    // seams split open: rotted black straw and pale fungus out of them, mould along them, spore drifting
    for (const [a, b] of [[add(SNa, [-6, 30]), add(at(0.64), [30, 20])], [add(at(0.7), [-20, 4]), add(at(0.6), [-34, 30])]]) { X.rotSplit(f, [a, lerp(a, b, 0.5), b], 4, { inner: P.loamD, edge: mix(P.grey, P.bone, 0.5) }); straw(lerp(a, b, 0.5), -1.2, 8, 20); X.fungalFur(f, [a, b], 9, -1); X.mould(f, lerp(a, b, 0.3), 12, 8, { col: mix(P.lilac, P.grey, 0.3), op: 0.7 }); }
    X.pustules(f, add(at(0.6), [-24, 30]), 18, 14, 5, 4, 8, { col: mix(P.bone, P.yel, 0.3), head: P.loamB });
    X.pustules(f, add(SNa, [-14, 20]), 10, 10, 3, 4, 7, { col: mix(P.bone, P.yel, 0.3), head: P.loamB });
    // the elbow patch is on the near sleeve; here a darned tear on the coat's left breast
    f.stitches([add(at(0.72), [-40, 30]), add(at(0.7), [-24, 44]), add(at(0.68), [-40, 56])], P.boneL, 0.9);
  }, { shape: E.smooth(tor) });
  // straw seen inside the clean hole's rim: none. The void's hole is clean; spore drifts from the seams
  X.spores(f, add(at(0.75), [40, -30]), 50, 30, 10);

  // ---- near leg, in front
  legDraw(HN, KN, AN, '_n', 0);

  // ---- head: a stuffed sack, stitched face, the mouth sewn shut in black thread, mould out of the eye holes
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(limb(N0, add(HC, [0, 40]), 34, 30, { steps: 4 }), SACK({ fill: mix(P.grey, P.loamD, 0.3) }));
  X.rope(f, [add(N0, [-20, -12]), add(N0, [0, -8]), add(N0, [22, -14])], 4, P.loamBL, { lit: false }); // the neck tied off
  const sackH = hF([[-0.42, 0.2], [-0.46, -0.1], [-0.36, -0.38], [-0.1, -0.5], [0.2, -0.46], [0.38, -0.3], [0.42, 0.0], [0.36, 0.3], [0.14, 0.44], [-0.16, 0.42], [-0.36, 0.34]]);
  const sh = f.part(X.lumpy(f, sackH, 3), SACK({ fill: mix(P.grey, P.bone, 0.2), maxShade: 18 }));
  clipDraw(f, sh, () => { stains(f, sh, E.bbox(sackH), P.loamD, 0.04, 3, -1.3, 67, 0.65); X.fold(f, hF([[-0.3, 0.3], [-0.1, 0.36], [0.1, 0.4]]), 2, { dk: P.greyS }); f.line(hF([[-0.38, -0.2], [-0.4, 0.1], [-0.34, 0.3]]), 1.4, P.greyS, { op: 0.7 }); f.stitches(hF([[-0.36, -0.2], [-0.38, 0.1], [-0.32, 0.3]]), P.loamD, 1); });
  // the eye holes, cut and ragged, mould and fungus growing out of them
  for (const [ex, ey, s] of [[0.06, -0.08, 1], [0.28, -0.06, 0.8]]) { const ec = hF([[ex, ey]])[0]; f.flat(X.lumpy(f, ell(ec, H * 0.075 * s, H * 0.06 * s, hA, 10), 2), '#0c0a0a'); X.mould(f, add(ec, [0, 2]), H * 0.07 * s, H * 0.05 * s, { col: mix(P.bone, P.lilac, 0.3), op: 0.9, rings: 1 }); X.fungalFur(f, ell(ec, H * 0.07 * s, H * 0.055 * s, hA, 10).slice(0, 7), 8, -1, { gaps: 0.3 }); f.stitches(ell(ec, H * 0.09 * s, H * 0.075 * s, hA, 12), P.loamD, 1); }
  bonnets(hF([[0.06, -0.1]])[0], hA - 2.2, 2, 22);
  // the stitched nose and the mouth sewn shut
  f.line(hF([[0.32, 0.0], [0.38, 0.12], [0.3, 0.14]]), 1.6, INK, { op: 0.7 });
  { const m0 = hF([[0.04, 0.24]])[0], m1 = hF([[0.34, 0.22]])[0]; f.line([m0, lerp(m0, m1, 0.5), m1], 2, INK); for (let i = 0; i < 8; i++) { const q = lerp(m0, m1, i / 7); f.line([add(q, rot([0, -6], hA)), add(q, rot([0, 6], hA))], 1.6, INK); } }
  f.bone('hat');
  { const col = mix(P.loamB, P.grey, 0.25);
    const crown = hF([[-0.44, -0.36], [-0.4, -0.72], [-0.2, -0.86], [0.04, -0.78], [0.2, -0.9], [0.36, -0.7], [0.4, -0.38]]);
    const cd3 = f.part(crown, LEATH(f, { fill: col })); clipDraw(f, cd3, () => { stains(f, cd3, E.bbox(crown), P.loamD, 0.05, 3, -1.3, 69, 0.6); X.mould(f, hF([[-0.1, -0.6]])[0], 14, 10, { col: P.lilac, op: 0.6 }); });
    f.line(hF([[0.0, -0.8], [0.08, -0.64], [0.14, -0.82]]), 1.4, INK, { op: 0.6 });
    f.part(hF([[-0.43, -0.46], [0.4, -0.44], [0.41, -0.36], [-0.43, -0.38]]), LEATH(f, { fill: P.loamD, cast: false, inkW: 1 }));
    const brim = hF([[-0.84, -0.3], [-0.5, -0.44], [0.0, -0.46], [0.5, -0.42], [0.86, -0.26], [0.92, -0.16], [0.78, -0.16], [0.46, -0.3], [0.0, -0.32], [-0.5, -0.28], [-0.88, -0.2]]);
    f.part(brim, LEATH(f, { fill: col, shade: 0.28 })); f.line(hF([[-0.84, -0.22], [-0.3, -0.3], [0.3, -0.32], [0.84, -0.2]]), 1.6, mix(col, '#fff', 0.3), { op: 0.5 });
    f.flat(hF([[0.5, -0.38], [0.62, -0.32], [0.58, -0.28]]), '#0c0a0a'); // a hole worn through the brim
    // the crow's feather in the band
    const q0 = hF([[-0.34, -0.42]])[0]; X.feather(f, q0, hA - 2.3, 74, 12, { fill: '#2a2830', shadow: '#0a080c', light: '#5a5866', shade: 0.4, tex: 'barb' + seed, texOp: 0.6 }, { lead: 0.35, bend: 0.05, round: false, notch: [0.6] }); }

  // ---- near arm, along the bar in front: the elbow patch, the rope at the wrist, straw and eyes at the cuff
  const an = armDraw(SNa, WNa, '_n', 0, 58);
  { const pc = [lp(SNa, WNa, 0.34, -26), lp(SNa, WNa, 0.52, -24), lp(SNa, WNa, 0.52, 20), lp(SNa, WNa, 0.34, 22)]; f.part(pc.map(q => [...q, 1]), COAT({ fill: mix(P.lilacD, P.loamL, 0.5), inkW: 1.1, cast: false })); f.stitches([...pc, pc[0]], P.boneL, 0.9); }
  X.pustules(f, lp(SNa, WNa, 0.7, -10), 14, 10, 3, 4, 7, { col: mix(P.bone, P.yel, 0.3), head: P.loamB });

  f.bone('root');
  X.loamGround(f, 160, 700, gy, { depth: 12, petals: 2 });
  f.stroke([[pF[0] - 200, gy - 2], [pF[0] - 100, gy - 4], [pF[0] - 30, gy - 3]], 10, P.loamD, { op: 0.6 }); // the drag furrow
  for (let i = 0; i < 10; i++) { const q = [R(f, 420, 760), gy - R(f, 0, 6)]; f.line([q, add(q, [R(f, -18, 18), R(f, -4, 2)])], 1.6, f.r() > 0.5 ? mix(P.loamD, P.yelS, 0.3) : P.yelD, { op: 0.9 }); } // straw dropped on the ground
  return f;
}
const offsetL = (C, o) => X.offsetLine(C, () => o);

// ------------------------------------------------------------------ BLIGHT SNAILS (cast, small; the cluster about 0.5)
// The garden's snails, a dozen fat ones each as big as a fist, crawling over and out of a stone garden urn that has been
// tipped over and cracked: up its bowl, over its rim, out of its dark mouth among the dead flower stems, across the
// plinth and onto the loam. Each is its own animal: shell sizes, colours, coil and lean differ; one rides on another;
// some carry a crowd of eye stalks; one shell is broken open at the crown. The shells are spirals with depth (the body
// whorl, the inner whorls stepping in, the suture groove, growth lines, the lit crown and dark underside, the pale
// aperture lip), blotched pink and lilac with mould and swelling with galls; the bodies are grey and pustular, each a
// modelled foot with a rippled sole and a skirt. Trails dry to a dull crust; a lead label hangs from the urn's foot; a
// leaf lies eaten to lace.
// Toxin: mould blotches and galls on the shells, pustules on the bodies, the lace leaf, mould and moss on the urn.
// Void: real eyes on the stalks (too many on some snails); clean round holes through two shells with nothing inside.
// Rig: urn (root); one bone per snail, snail_1..snail_12 (snail_2 rides on snail_1). Motion: idle the eye stalks swaying;
// attack the cluster sliding over a hero (the snail bones slide forward together).
function blightSnails() {
  const seed = 1425, W = 680, h = 820;
  const f = new Fig(X.base(seed, h, { grimeY: 640 })); X.texturesB(f);
  const gy = f.o.groundY;
  const STONE = (o = {}) => Object.assign({ fill: mix(P.grey, P.bone, 0.2), shadow: mix(P.greyS, P.loamD, 0.3), light: P.greyL, shade: 0.42, tex: 'mottle' + seed, texOp: 0.75, maxShade: 26 }, o);
  // the urn lying on its side: the mouth to the right (toward the party), the plinth to the left
  const ax = [482, gy - 108], ta = -0.05, U = (u, v) => add(ax, rot([-u, v], ta));
  const prof = [[0, 110], [10, 114], [20, 104], [46, 100], [90, 92], [130, 74], [162, 50], [182, 34], [206, 32], [220, 46], [226, 52]];
  const top = prof.map(([u, r]) => U(u, -r)), bot = prof.map(([u, r]) => U(u, r)).reverse();
  const body = [...top, ...bot];
  const snails = [
    // [bone, c, s, dir, options]
    ['snail_6', [336, gy - 206], 22, 1, { col: mix(P.pink, P.grey, 0.45), tilt: -0.2, spin: 0.4, far: true }],
    ['snail_1', [404, gy - 214], 30, 1, { col: mix(P.pink, P.bone, 0.3), tilt: 0.06, galls: [[1.2, 0.16], [3.4, 0.12]], npust: 4 }],
    ['snail_2', [396, gy - 278], 19, -1, { col: mix(P.lilac, P.lilacD, 0.5), tilt: -0.1, stalks: [[-1.3, 1.0], [-0.9, 1.1], [-1.6, 0.8]], ride: true, footL: 2.0 }],
    ['snail_8', [478, gy - 232], 20, 1, { col: mix(P.lilac, P.pink, 0.5), tilt: 0.5, spin: -0.5 }],
    ['snail_5', [246, gy - 170], 24, -1, { col: mix(P.grey, P.bone, 0.35), broken: true, tilt: 0.1 }],
    ['snail_9', [452, gy - 118], 22, 1, { col: mix(P.pink, P.yel, 0.4), tilt: 0.0, sq: 0.8, dark: true }],
    ['snail_10', [330, gy - 96], 27, 1, { col: mix(P.pink, P.lilac, 0.6), tilt: -0.28, galls: [[2.0, 0.18]], stalks: [[-1.25, 1.0], [-0.85, 1.1], [-1.55, 0.9], [-0.55, 0.8]] }],
    ['snail_3', [548, gy - 44], 31, 1, { col: mix(P.pinkD, P.loamB, 0.3), rear: 0.7, stalks: [[-1.4, 1.0], [-1.0, 1.15], [-0.65, 1.0], [-1.75, 0.85], [-0.3, 0.75]], galls: [[2.6, 0.15]] }],
    ['snail_7', [128, gy - 26], 29, 1, { col: mix(P.lilac, P.bone, 0.45), hole: [1.6, 0.55, 0.2], footL: 2.6 }],
    ['snail_11', [404, gy - 22], 23, 1, { col: mix(P.pink, P.grey, 0.25), hole: [4.2, 0.45, 0.22], tilt: 0.02 }],
    ['snail_4', [628, gy - 26], 24, 1, { col: mix(P.lilacD, P.loamD, 0.25), sway: 0.25, footL: 2.2 }],
    ['snail_12', [606, gy - 12], 13, 1, { col: P.pinkL, tilt: 0, footL: 2.0, stalks: [[-1.2, 1.1]] }],
  ];
  f.joint('urn', ax);
  for (const [b, c, s, d, o] of snails) f.joint(b, c, o.ride ? 'snail_1' : 'urn');
  const drawSnail = ([b, c, s, d, o]) => { f.bone(b); X.snail(f, c, s, d, Object.assign({ eyeS: 0.3, opens: [0.75, 0.3, 0.9, 0.05, 0.6], trail: c[1] > gy - 60 }, o)); }; // (independent review) only snails on the ground leave a ground trail: on the urn it hung in the air

  // ---- dead flower stems spilling from the urn's mouth (behind the near snails), and the far snail behind the bowl
  f.bone('urn');
  for (let i = 0; i < 9; i++) { const r0 = U(-4, R(f, -70, 70)), l = R(f, 80, 170), e = [r0[0] + l * R(f, 0.4, 0.8), Math.min(gy - 4, r0[1] + l * R(f, 0.5, 0.9))], m = add(lerp(r0, e, 0.5), [(e[0] - r0[0]) * 0.25, -R(f, 0, 14)]); f.line(spline([r0, m, e], 4), R(f, 2.2, 3.4), mix(P.loamB, P.rot, 0.4)); if (i % 2) X.bloom(f, e, R(f, 7, 11), [P.pinkD, P.lilacD, P.yelD][i % 3], { sy: 0.6, n: 5, ang: R(f, 0, 6) }); else X.leaf(f, m, Math.atan2(e[1] - r0[1], e[0] - r0[0]) + 0.8, R(f, 16, 24), { col: mix(P.rot, P.loamB, 0.5) }); }
  drawSnail(snails[0]);

  // ---- the urn: grey stone, fluted bowl, cracked, moss and mould, the dark mouth
  f.bone('urn');
  const bd = f.part(body, STONE());
  clipDraw(f, bd, () => {
    // form: lit along the top of the bowl, the underside turning away into shadow, the flutes following the bowl
    softTone(f, bd, [[[U(0, -120), U(230, -60), U(230, -20), U(0, -70)], P.boneL, 0.5, 18], [[U(0, 50), U(230, 20), U(230, 80), U(0, 130)], P.loamD, 0.65, 20]]);
    for (let k = -4; k <= 4; k++) { const pts = prof.slice(2, 8).map(([u, r]) => U(u, r * k / 4.6)); f.stroke(pts, 4.4 - Math.abs(k) * 0.3, mix(P.greyS, P.loamD, 0.3), { op: 0.55 }); f.line(pts.map(q => add(q, [2, -3])), 1.4, P.greyL, { op: 0.4 }); } // the flutes (gadroons)
    stains(f, bd, E.bbox(body), P.loamD, 0.02, 2.8, -1.4, 71, 0.7);
    for (const [c, rx, ry] of [[U(60, -70), 18, 12], [U(140, 30), 14, 10], [U(100, -20), 10, 8]]) X.mould(f, c, rx, ry, { col: mix(P.lilac, P.grey, 0.35), op: 0.7 });
    for (let i = 0; i < 14; i++) f.flat(ell(U(R(f, 10, 200), R(f, -90, 90)), R(f, 3, 7), R(f, 2, 5), 0, 7), mix(P.yelD, P.grey, 0.4), { op: 0.6 }); // lichen spots
    // the crack across the bowl
    f.stroke([U(40, -96), U(60, -60), U(52, -20), U(76, 20), U(70, 60)], 4, P.loamD); f.line([U(40, -96), U(60, -60), U(52, -20), U(76, 20), U(70, 60)].map(q => add(q, [2, -2])), 1, P.greyL, { op: 0.5 });
    // dried snail trails across the stone, a dull crust
    for (const tr of [[U(160, -50), U(110, -86), U(60, -104)], [U(30, 60), U(80, 80), U(150, 60)]]) f.stroke(spline(tr, 4), 7, mix(P.grey, P.yelL, 0.5), { op: 0.45 });
  });
  X.moss(f, [U(200, -36), U(170, -50), U(130, -76)], 9, { col: P.rot });
  X.moss(f, [U(120, 76), U(60, 96), U(20, 106)], 8, { col: P.rot });
  // the plinth: a square foot lying on its side, its corner chipped
  const pl = [U(222, -66), U(292, -66), U(292, 66), U(222, 66)].map(q => [...q, 1]);
  const pd = f.part(pl, STONE({ fill: mix(P.grey, P.bone, 0.1) }));
  clipDraw(f, pd, () => { softTone(f, pd, [[[U(220, 20), U(300, 20), U(300, 80), U(220, 80)], P.loamD, 0.6, 14]]); stains(f, pd, E.bbox(pl), P.loamD, 0.03, 2.8, -1.4, 73, 0.6); f.line([U(232, -56), U(282, -56)], 1.4, P.greyL, { op: 0.5 }); });
  f.flat([U(290, -66), U(292, -40), U(272, -64)], mix(P.greyS, P.loamD, 0.4)); // the chipped corner
  // the mouth: the rim ellipse seen at a slant, the dark inside, loam spilled out of it
  const rim = ell(U(0, 0), 38, 112, ta, 30);
  f.part(rim, STONE({ fill: mix(P.grey, P.bone, 0.35), maxShade: 10 }));
  f.flat(ell(U(-4, 4), 28, 96, ta, 26), '#0e0c0c');
  f.flat(ell(U(-2, 30), 22, 64, ta, 20), P.loam, { op: 0.8 }); // the loam inside
  f.line(ell(U(0, 0), 36, 110, ta, 30).slice(20, 30), 2, P.boneL, { op: 0.6 }); // the lit lip
  { const tab = U(256, 66); X.leadLabel(f, add(tab, [0, -4]), 30, 22, 0.15, { wire: 16 }); } // the lead label on its wire from the foot
  // loam spilled from the mouth onto the ground
  f.part([U(-10, 70), U(-60, 80), [ax[0] + 90, gy + 2], [ax[0] - 10, gy + 2]], { fill: P.loam, shadow: P.loamD, shade: 0.3, maxShade: 6, inkW: 1, cast: false, tex: 'mottle' + seed, texOp: 0.8, grime: false });

  // ---- the snails over and around it, back to front
  for (const sn of snails.slice(1)) drawSnail(sn);

  // ---- the ground: loam, a leaf eaten to lace, trails drying
  f.bone('root');
  X.loamGround(f, 60, 680, gy, { depth: 12, petals: 3 });
  { const lc = [250, gy - 8], la = -0.25, L = 70, F = frame(lc, la, L);
    const lf = F([[0, 0], [0.2, -0.24], [0.55, -0.3], [0.85, -0.16], [1.05, 0.0, 1], [0.8, 0.16], [0.5, 0.24], [0.2, 0.18]]);
    const ld = f.part(lf, { fill: mix(P.rot, P.loamB, 0.35), shadow: P.rotS, light: P.rotL, shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: true, castOp: 0.3, k: 0.9 });
    clipDraw(f, ld, () => { for (let i = 0; i < 26; i++) { const q = F([[R(f, 0.1, 0.95), R(f, -0.22, 0.2)]])[0]; f.flat(X.lumpy(f, ell(q, R(f, 2, 6), R(f, 2, 4), 0, 8), 1.5), P.loamD); } f.line(F([[0.02, 0], [1.0, 0.0]]), 1.4, P.rotL, { op: 0.8 }); for (let i = 1; i < 5; i++) f.line(F([[i * 0.2, 0], [i * 0.2 + 0.12, -0.18]]), 0.9, P.rotL, { op: 0.7 }); }); }
  for (const tr of [[[60, gy - 4], [100, gy - 6], [110, gy - 10]], [[440, gy - 2], [500, gy - 4], [540, gy - 6]]]) f.stroke(spline(tr, 4), 6, mix(P.grey, P.yelL, 0.5), { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ POND SWAN (cast, large 1.3 with the neck raised)
// One of the lady's swans from the lily pond, standing on the bank busking in threat. (Independent review: rebuilt.) The
// wings half raised and arched over the back like sails (the near wing in front, the far wing behind and above it), the
// long neck drawn back in an S that tapers from the thick base at the breast to the slim throat under the head, the head
// low and forward, the bill open in a hiss with the grey tongue showing. Weight on the broad, splayed, black webbed feet
// under thick, scaled black legs set well back. A big white swan whose plumage is modelled in masses: the boat-shaped body
// lit along the back and the round of the breast, the belly turning away into shadow, long flank feathers shingled back
// over the folded wing's base, the pointed tail lifted; the wings built after world_VI (slotted primaries, layered
// coverts, a shaped leading edge). The rot sits where the feathers root: grey-lilac mould and dark rot staining the
// bases between the rows, feathers peeling and lifting there, fungal fur and small caps in the seams, pale-yellow
// bracket shelves along the arched coverts; the breast swollen into a soft pink gall that parts the feathers, a few real
// eyes blinking in it. The small dark eye under the brow in the bare black skin before the bill; the black knob.
// Story: an iron ownership ring on the near leg, a lily stem trailing from the near foot, rotted pond weed hanging from
// the neck, a broken flight feather standing out of the near wing, black loam on the feet, a notch out of the bill.
// Toxin: mould and rot at the feather bases, fungus in the seams and on the wing, the gall, the feet blotched and
// peeling. Void: a clean round hole through the near wing; the eyes in the gall.
// Rig: body (root) > neck_1 > neck_2 > head > jaw; wing_n_1..3, wing_f_1..3 (body); tail (body); leg_n, foot_n, leg_f,
// foot_f (body). Motion: idle a hiss and a slow ruffle (jaw, wings); attack a lunge and a beating of wings (necks drive
// forward, wings sweep down).
function pondSwan() {
  const seed = 1428, W = 1200, h = 1100;
  const f = new Fig(X.base(seed, h, { grimeY: 980 })); X.texturesB(f);
  const gy = f.o.groundY;
  const wht = mix(P.bone, P.grey, 0.1), whtS = mix(P.boneS, P.lilacS, 0.35), whtD = mix(P.boneD, P.loamD, 0.35), whtM = mix(P.bone, P.boneS, 0.45);
  const FE = (o = {}) => Object.assign({ fill: wht, shadow: whtS, light: P.boneL, shade: 0.42, tex: 'barb' + seed, texOp: 0.35, inkW: 1, inkHeavy: 1.4 }, o);
  const LEG = (o = {}) => Object.assign({ fill: '#2a282c', shadow: '#0a090b', light: '#5e5a60', shade: 0.42, tex: 'mottle' + seed, texOp: 0.7, maxShade: 10, inkW: 1.3, inkHeavy: 2 }, o);
  const MOULD = mix(P.lilac, P.grey, 0.45), ROT = mix(P.loamD, P.lilacS, 0.4);
  const body = [[300, 704], [360, 664], [470, 634], [600, 626], [720, 640], [800, 670], [858, 716], [892, 780], [884, 846], [832, 892], [720, 914], [580, 918], [452, 902], [362, 864], [306, 804], [276, 748]];
  const NC = [[790, 724], [850, 626], [848, 524], [796, 436], [768, 362], [790, 300], [836, 274]], NW = [136, 96, 74, 62, 56, 52, 50];
  const HC = [876, 292], hA = 0.5, hF = frame(HC, hA, 0.9);
  const wN = { S: [700, 672], E: [690, 458], W: [530, 330], T: [292, 588] }, wF = { S: [736, 650], E: [762, 446], W: [626, 292], T: [392, 506] };
  const LN = { H: [600, 900], K: [604, 920], A: [618, 1028] }, LF = { H: [530, 900], K: [526, 922], A: [512, 1030] };
  f.joint('body', [580, 780]).joint('neck_1', [812, 690], 'body').joint('neck_2', [846, 524], 'neck_1').joint('head', [772, 350], 'neck_2').joint('jaw', hF([[44, 12]])[0], 'head').joint('tail', [310, 730], 'body');
  for (const [k, w] of [['n', wN], ['f', wF]]) f.joint(`wing_${k}_1`, w.S, 'body').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  f.joint('leg_n', LN.H, 'body').joint('foot_n', LN.A, 'leg_n').joint('leg_f', LF.H, 'body').joint('foot_f', LF.A, 'leg_f');
  // rot at the feather bases: a soft dark-grey stain where a row roots, mould on it, fungal fur, a few barbs lifted
  const rootRot = (p, r, k = 1) => { f.raw(`<ellipse cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" rx="${(r * 1.3).toFixed(1)}" ry="${(r * 0.7).toFixed(1)}" fill="${ROT}" opacity="${(0.45 * k).toFixed(2)}" filter="url(#puff${seed})"/>`); X.mould(f, p, r * 0.8, r * 0.45, { col: MOULD, op: 0.7 * k, rings: 1 }); X.fungalFur(f, [add(p, [-r, 0]), add(p, [r, 2])], r * 0.4, -1, { gaps: 0.5 }); };
  const wingRot = (side) => (bone, g) => {
    if (bone === side[1] && g.nF) { for (const t of [0.2, 0.5, 0.78]) rootRot(add(lerp(g.Ew, g.Wr, t), mul(g.nF, g.Ls * 0.44 + 8)), 16, 0.9); if (side[0] === 'n') { X.brackets(f, [add(lerp(g.Ew, g.Wr, 0.15), mul(g.nF, g.Ls * 0.24)), add(lerp(g.Ew, g.Wr, 0.6), mul(g.nF, g.Ls * 0.26))], 5, Math.atan2(g.nF[1], g.nF[0]) + 1.2, 24, 38, { side: true, col: P.yel }); X.caps(f, add(lerp(g.Ew, g.Wr, 0.85), mul(g.nF, g.Ls * 0.46)), -1.9, 46, 3, { cols: [P.yel, P.lilac], fan: 0.5, sw: 0.12 }); } }
    if (bone === side[2] && g.nH) rootRot(add(lerp(g.Wr, g.H, 0.5), mul(g.nH, 30)), 18, 0.8);
  };

  // ---- a webbed foot, broad and splayed: three toes spread forward with claws, the web between them scalloped at the
  // edge, the hind toe; black, blotched and peeling, loam on it
  const webFoot = (A, sc, tone) => {
    const tips = [[A[0] + 118 * sc, gy - 4], [A[0] + 92 * sc, gy + 4], [A[0] + 50 * sc, gy - 6]];
    const web = [add(A, [-8, 2]), add(A, [14, -8]), tips[0], lerp(lerp(tips[0], tips[1], 0.5), A, 0.22), tips[1], lerp(lerp(tips[1], tips[2], 0.5), A, 0.25), tips[2], [A[0] + 14, gy - 2], [A[0] - 14, gy - 6]];
    const wd = f.part(web, LEG({ fill: mix('#2e2c30', '#000', tone), maxShade: 8 }));
    clipDraw(f, wd, () => { X.mould(f, [A[0] + 54 * sc, gy - 12], 16, 7, { col: mix(P.pink, P.grey, 0.3), op: 0.7, rings: 1 }); f.flat([[A[0] - 20, gy - 12], [A[0] + 140, gy - 12], [A[0] + 140, gy + 10], [A[0] - 20, gy + 10]], P.loamD, { op: 0.55 }); for (let i = 0; i < 6; i++) f.line([add(A, [10 + i * 14 * sc, 6]), [A[0] + (30 + i * 16) * sc, gy - 4]], 0.8, '#5e5a60', { op: 0.45 }); });
    for (const t of tips) { f.stroke([add(A, [6, 4]), lerp(add(A, [6, 4]), t, 0.5), t], 10 * sc, '#121014'); f.line([add(A, [8, 0]), lerp(A, t, 0.6)], 1.1, '#6e6a70', { op: 0.5 }); f.part([add(t, [-2, -4]), add(t, [12, -2]), add(t, [6, 4])], { fill: '#0e0c10', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); }
    X.peel(f, [A[0] + 40 * sc, gy - 16], 3, 0.9, 20, P.pinkD);
    f.part([add(A, [-12, 0]), add(A, [-34, 10]), add(A, [-30, 18]), add(A, [-8, 12])], LEG({ cast: false })); // the hind toe
  };
  // the black leg: the feathered tibia leaving the belly, the thick, scaled tarsus with its heel joint, flattened, lit on
  // its front edge
  const blackLeg = (Lg, k, tone) => {
    f.bone(`leg_${k}`);
    const ts = K.chain([Lg.K, Lg.A], [46, 40], { steps: 6, bp: [[0, 0.2, 0.1, 0.2]] }); f.part(ts, LEG({ fill: mix('#2a282c', '#000', tone) }));
    const d = E.norm(sub(Lg.A, Lg.K)), n = [-d[1], d[0]];
    for (let i = 1; i < 8; i++) { const q = lerp(Lg.K, Lg.A, i / 8); f.line([add(q, mul(n, 18)), add(add(q, mul(n, 4)), mul(d, 4)), add(q, mul(n, -16))], 1, '#6a666c', { op: 0.55 }); } // the scutes
    f.line([lp(Lg.K, Lg.A, 0.1, -16), lp(Lg.K, Lg.A, 0.9, -15)], 1.6, '#7a767c', { op: 0.5 }); // the lit front edge
    f.part(ell(Lg.K, 21, 13, 0.2, 10), LEG({ fill: mix('#2a282c', '#000', tone), maxShade: 6, inkW: 1 })); // the heel joint, where the leg leaves the belly's feathers
  };

  // ---- the far wing (behind the neck and body, darker), the far leg
  X.swanWing(f, wF.S, wF.E, wF.W, wF.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], body: [600, 760], wht, sh: whtS, dk: whtD, far: true, s: 0.92, notchP: [3], notchS: [5], rot: wingRot(['f', 'wing_f_2', 'wing_f_3']) });
  blackLeg(LF, 'f', 0.35); f.bone('foot_f'); webFoot(LF.A, 1.15, 0.35);

  // ---- the tail: a short pointed fan, lifted, the undertail coverts fluffed under it
  f.bone('tail');
  for (let i = 0; i < 7; i++) X.feather(f, [326, 716 + i * 7], Math.PI + 0.42 - i * 0.1, 120 - Math.abs(i - 3) * 12, 30, FE({ fill: mix(wht, whtD, 0.15 + (i % 2) * 0.1 + i * 0.04), inkW: 0.8 }), { lead: 0.5, round: false, splits: i % 2 === 0, dark: 0.3, darkCol: ROT, darkOp: 0.25 });
  for (let i = 0; i < 5; i++) X.feather(f, [340, 770 + i * 6], Math.PI - 0.1 + i * 0.12, 70, 34, FE({ fill: mix(wht, whtD, 0.4 + i * 0.05), inkW: 0.7 }), { lead: 0.5, round: true, splits: false });

  // ---- the neck: one tapering S from the breast to the head; the lit side toward the key light, the far side and the
  // throat turning away; fine feathering in rings; grey mould at its base; pond weed hanging plumb
  const NCs = spline(NC, 4), NWs = NCs.map((_, i) => { const t = i / (NCs.length - 1) * (NW.length - 1), k = Math.floor(t), u = t - k; return NW[Math.min(k, NW.length - 1)] * (1 - u) + NW[Math.min(k + 1, NW.length - 1)] * u; });
  const neck = ribbon(NCs, NWs);
  const litSide = i => { const a = NCs[Math.max(0, i - 1)], b = NCs[Math.min(NCs.length - 1, i + 1)], d = E.norm(sub(b, a)), n = [-d[1], d[0]]; return n[0] * f.L[0] + n[1] * f.L[1] > 0 ? n : mul(n, -1); };
  const strip = (k0, k1) => [...NCs.map((q, i) => add(q, mul(litSide(i), NWs[i] * k0))), ...NCs.map((q, i) => add(q, mul(litSide(i), NWs[i] * k1))).reverse()];
  split(f, () => {
    const nd = f.part(neck, FE({ maxShade: 14, inkW: 1.3, inkHeavy: 2.4 }));
    clipDraw(f, nd, () => {
      softTone(f, nd, [[strip(0.1, 0.42), P.boneL, 0.6, 7], [strip(-0.15, -0.6), whtD, 0.7, 9], [[[700, 640], [900, 640], [900, 760], [700, 760]], whtS, 0.4, 16]]);
      for (let i = 0; i < 70; i++) { const j = 3 + Math.floor(f.r() * (NCs.length - 6)), d = E.norm(sub(NCs[j + 1], NCs[j - 1])), n = [-d[1], d[0]], u = R(f, -0.4, 0.4) * NWs[j], q = add(NCs[j], mul(n, u)); f.line([add(q, mul(n, -5)), add(q, mul(d, -3)), add(q, mul(n, 5))], 0.9, whtS, { op: 0.35 }); } // fine feather tips, broken, not rings
      for (const t of [0.12, 0.2, 0.32]) rootRot(NCs[Math.round(NCs.length * t)], 16, 0.7);
      stains(f, nd, E.bbox(neck), mix(P.grey, P.loamD, 0.4), 0.03, 2.8, -1.6, 77, 0.4);
    });
  }, [['neck_1', side([846, 524], [0.25, 1], 40)], ['neck_2', [side([846, 524], [-0.25, -1], 40), side([772, 350], [-0.3, 1], 32)]], ['head', side([772, 350], [0.3, -1], 32)]]);
  f.bone('neck_2');
  for (let i = 0; i < 5; i++) { const r0 = add(NCs[Math.round(NCs.length * (0.34 + i * 0.03))], [R(f, -16, 10), 10]), l = R(f, 60, 130); X.hairClump(f, [r0, add(r0, [R(f, -6, 6), l * 0.5]), add(r0, [R(f, -10, 10), l])], R(f, 5, 9), { pal: [P.rotD, P.rot, mix(P.rot, P.loamB, 0.4)], n: 2 }); } // rotted pond weed

  // ---- the body: one boat of plumage, modelled; the flank feathers shingled back over the folded wing's base
  f.bone('body');
  const bd = f.part(body, FE({ maxShade: 30, inkW: 1.4, inkHeavy: 2.6 }));
  clipDraw(f, bd, () => {
    softTone(f, bd, [[[[300, 640], [800, 640], [800, 700], [300, 720]], P.boneL, 0.55, 26], [[[380, 900], [880, 860], [900, 960], [380, 960]], whtD, 0.85, 28], [ell([808, 748], 70, 60, 0, 12), P.boneL, 0.5, 26], [[[660, 700], [760, 690], [790, 900], [660, 900]], whtS, 0.35, 30], [[[270, 700], [360, 700], [360, 880], [270, 860]], whtS, 0.5, 26]]);
    // the breast: small feathers in curved rows round the swell, faint
    for (let r = 0; r < 6; r++) for (let i = 0; i < 9; i++) { const a = -1.3 + i * 0.3 + (r % 2) * 0.15, rr = 40 + r * 22, q = add([800, 760], [Math.cos(a) * rr, Math.sin(a) * rr * 1.1]); const d = rot([0, 1], a - 1.57 - 0.4); f.line([add(q, rot(mul(d, 8), 1.4)), add(q, mul(d, 5)), add(q, rot(mul(d, 8), -1.4))], 1, whtS, { op: 0.35 }); }
    // the flank: three rows of long feathers, rear first, each front one lapping the root of the one behind; a soft shadow
    // under every tip; the rot at the roots where each row starts
    for (const [y0, x0, x1, L0] of [[872, 380, 790, 110], [836, 390, 810, 130], [800, 410, 820, 140], [764, 440, 800, 150]]) {
      const n = Math.round((x1 - x0) / 40);
      for (let i = 0; i < n; i++) { const r0 = [x0 + i * (x1 - x0) / (n - 1) + R(f, -8, 8), y0 + R(f, -6, 6) - (i / n) * 12], a = Math.PI + 0.12 + R(f, -0.08, 0.08), L = L0 * R(f, 0.85, 1.12), k = Math.max(0, Math.min(1, 0.85 - (y0 - 760) / 140 + (r0[0] - 600) / 900));
        X.cfeather(f, r0, a, L * R(f, 0.8, 1.05), R(f, 36, 50), mix(whtD, wht, k), { sh: whtS, cast: whtD, castOp: 0.28, bend: R(f, -0.06, 0.03), inkW: 0.8, inkOp: 0.38 }); }
      for (let i = 0; i < 3; i++) rootRot([R(f, x0 + 60, x1 - 40), y0 - 12 + R(f, -6, 6)], R(f, 12, 22), 0.85);
    }
    stains(f, bd, E.bbox(body), mix(P.grey, P.loamD, 0.4), 0.02, 2.8, -1.6, 75, 0.45);
    X.caps(f, [520, 762], -1.9, 40, 3, { cols: [P.yel, P.lilacL], fan: 0.5, sw: 0.12 }); X.caps(f, [690, 812], -1.7, 32, 2, { cols: [P.lilac, P.yel], fan: 0.5, sw: 0.12 }); // small caps in the seams
  });

  // ---- the near leg: ring and lily stem
  blackLeg(LN, 'n', 0);
  X.ironRing(f, lerp(LN.K, LN.A, 0.55), 26, 8, 5, 0.1, { col: '#5a5856' }); // the ownership ring
  f.bone('foot_n'); webFoot(LN.A, 1.3, 0);
  { const s0 = add(LN.A, [70, 8]), C = spline([s0, [s0[0] - 60, gy + 2], [s0[0] - 170, gy - 4], [s0[0] - 260, gy + 4]], 4); f.line(C, 4.4, INK); f.line(C, 3, mix(P.rot, P.loamB, 0.4)); X.leaf(f, [s0[0] - 200, gy - 2], Math.PI + 0.2, 50, { col: mix(P.rot, P.loamB, 0.3) }); X.bloom(f, [s0[0] - 262, gy - 4], 14, mix(P.pinkL, P.loamB, 0.35), { sy: 0.5, n: 6 }); } // the lily stem trailing from the foot

  // ---- the breast gall: a soft pink swelling pushing out of the lower breast, the plumage parting round it with rot at
  // the torn feather roots, a few real eyes blinking in it
  f.bone('body');
  { const gc = [826, 826], gl = X.lumpy(f, [add(gc, [-20, -46]), add(gc, [12, -52]), add(gc, [36, -36]), add(gc, [40, -10]), add(gc, [54, 6]), add(gc, [48, 34]), add(gc, [22, 48]), add(gc, [2, 62]), add(gc, [-24, 56]), add(gc, [-38, 30]), add(gc, [-28, 6]), add(gc, [-38, -16])], 8); // two soft lobes, sagging, swelling inside the breast's line
    f.raw(`<path d="${E.smooth(gl.map(q => add(lerp(q, gc, -0.18), [0, 4])))}" fill="${ROT}" opacity="0.7" filter="url(#puff${seed})"/>`); // the rot where the feathers tore
    const gd = f.part(gl, X.FL(f, mix(mix(P.pink, P.skin, 0.35), wht, 0.25), { maxShade: 22, texOp: 0.35, shade: 0.46, inkW: 1, inkHeavy: 1.8 }));
    clipDraw(f, gd, () => { softTone(f, gd, [[ell(add(gc, mul(f.L, 24)), 26, 20, 0, 10), P.pinkL, 0.7, 10], [ell(add(gc, mul(f.L, -40)), 50, 30, 0, 10), P.pinkS, 0.75, 14]]); for (let i = 0; i < 8; i++) { const q = add(gc, [R(f, -40, 40), R(f, -50, 50)]); f.line([q, add(q, [R(f, -12, 12), R(f, -12, 12)])], 1, mix(P.pinkD, P.lilacD, 0.5), { op: 0.5 }); } });
    for (let i = 0; i < 4; i++) { const a = -2.1 + i * 0.3, q = add(gc, [Math.cos(a) * 72, Math.sin(a) * 74]); X.cfeather(f, q, a + Math.PI + R(f, -0.25, 0.25), R(f, 30, 44), 26, mix(wht, whtD, R(f, 0.1, 0.35)), { sh: whtS, cast: ROT, castOp: 0.4, inkW: 0.8 }); } // the breast feathers lapping over its upper rim, parted by it
    X.fungalFur(f, gl.slice(0, 6), 8, 1, { gaps: 0.4 });
    X.eyes(f, [[add(gc, [30, 20]), 22, 0.7, 0.5], [add(gc, [-14, 42]), 11, 1.3, 0.1], [add(gc, [-2, 54]), 9, 1.0, 0.8]], { lid: mix(P.pink, P.skin, 0.4), lidS: P.pinkS }); X.crease(f, [add(gc, [-36, 22]), add(gc, [-6, 14]), add(gc, [30, -6])], 3, { col: P.pinkS, lit: P.pinkL, op: 0.6 }); X.pustules(f, add(gc, [4, -30]), 18, 12, 3, 4, 7); }

  // ---- head: a swan's head, the long bill open in a hiss, the black knob, the bare black skin before the small dark eye
  f.bone('head');
  const skull = hF([[-56, -2], [-50, -30], [-24, -44], [8, -44], [32, -32], [48, -24], [50, 6], [30, 24], [0, 32], [-30, 28], [-52, 16]]);
  const sd = f.part(skull, FE({ maxShade: 10, tex: 'mottle' + seed, texOp: 0.35, inkW: 1.3 }));
  clipDraw(f, sd, () => softTone(f, sd, [[hF([[-56, -54], [50, -54], [50, -24], [-56, -16]]), P.boneL, 0.6, 6], [hF([[-56, 12], [50, 8], [50, 40], [-56, 40]]), whtD, 0.65, 8], [hF(ell([-20, -6], 20, 14, 0, 10)), P.boneL, 0.3, 8]]));
  f.part(hF([[22, -30], [50, -28], [58, -16], [54, 2], [36, 4], [24, -10]]), { fill: '#141216', shadow: '#000', shade: 0.3, inkW: 1, cast: false, hatch: false }); // the bare black skin before the eye
  f.flat(hF(ell([26, -15], 5.5, 4.2, 0, 10)), '#050405'); f.flat(hF(ell([27.5, -16.5], 1.4, 1.2, 0, 6)), '#bfb8c0'); // the small dark eye under the brow
  f.stroke(hF([[12, -26], [26, -28], [36, -24]]), 3.2, mix(wht, whtD, 0.5), { op: 0.85 }); // the brow over it
  const um = hF([[48, -26], [64, -36], [82, -32], [122, -15], [152, -5], [158, 1], [150, 4], [112, 0], [72, 2], [50, 4]]);
  f.part(um, { fill: mix(P.pinkD, P.loamB, 0.35), shadow: P.pinkS, light: P.pink, shade: 0.42, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.3, inkHeavy: 2, cast: false });
  f.part(hF([[46, -28], [54, -46], [68, -46], [76, -34], [64, -30]]), { fill: '#141216', shadow: '#000', light: '#4a4650', shade: 0.35, inkW: 1.2, cast: false }); // the black knob
  f.part(hF([[148, -7], [160, -3], [158, 4], [148, 4]]), { fill: '#1a181c', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); // the nail
  f.flat(hF([[102, 0], [108, -6], [114, 1]]), '#0c0a0c'); // the notch
  f.line(hF([[76, -28], [112, -15], [142, -5]]), 1.2, P.pinkL, { op: 0.5 }); f.flat(hF(ell([84, -17], 4, 2, 0.3, 6)), '#0c0a0c', { op: 0.8 }); // the culmen's light, the nostril
  f.flat(hF([[52, 4], [112, 2], [142, 6], [122, 24], [72, 26], [52, 14]]), '#120c10'); // the open mouth
  f.part(hF([[60, 10], [102, 12], [118, 14], [98, 20], [66, 20]]), { fill: '#5a5660', shadow: '#2a2830', shade: 0.35, inkW: 0.8, cast: false, hatch: false }); // the grey tongue
  f.bone('jaw');
  f.part(hF([[42, 14], [72, 22], [112, 18], [142, 10], [146, 16], [122, 28], [76, 34], [46, 28]]), { fill: mix(P.pinkD, P.loamB, 0.5), shadow: P.pinkS, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.2, inkHeavy: 1.8, cast: false });

  // ---- the near wing, arched over the body in front: a clean round hole through it, the broken flight feather
  X.holeEach(f, [[add(lerp(wN.E, wN.W, 0.5), [-6, 120]), 22]], () =>
    X.swanWing(f, wN.S, wN.E, wN.W, wN.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], body: [600, 780], wht, sh: whtS, dk: whtD, s: 1, notchP: [2, 6], notchS: [4, 9], rot: wingRot(['n', 'wing_n_2', 'wing_n_3']) }), { rimBone: 'wing_n_2' });
  f.bone('wing_n_3');
  { const r0 = lerp(wN.W, wN.T, 0.28), a = Math.atan2(wN.T[1] - wN.W[1], wN.T[0] - wN.W[0]) - 0.75; const fe = X.feather(f, r0, a, 170, 28, FE({ fill: mix(wht, whtD, 0.3), inkW: 0.9 }), { lead: 0.35, round: false, notch: [0.5, 0.7] }); f.line([lerp(r0, fe.tip, 0.55), add(lerp(r0, fe.tip, 0.55), rot([14, 0], a + 1.2))], 2, INK); f.line([lerp(r0, fe.tip, 0.6), add(lerp(r0, fe.tip, 0.6), rot([10, 0], a - 1.3))], 1.6, INK); } // the broken flight feather, bent and split

  f.bone('root');
  X.loamGround(f, 200, 1000, gy, { depth: 14, petals: 3 });
  return f;
}

// ------------------------------------------------------------------ THE TRUFFLE BOAR (elite 1.9 at the shoulder)
// The garden's truffle boar, a fey hog larger than any mortal one, kept to root out truffles under the oaks. It found
// them all and ate them all. (Independent review: rebuilt as a boar, not a barrel.) True size: 1.9 humans at the withers
// (1216 px) and about 1.6 times that from rump to disc along the body, so the canvas is 2200 x 1500 at the game's scale.
// Built like a wild boar: a massive forequarter under a high shoulder hump, the back falling away to narrow, low
// hindquarters (a wedge seen from the side); the short, deep, wedge head down and ploughing, its disc snout pressed into
// the loam; short thick legs, cloven trotters, dewclaws. Coarse black-loam bristles laid in tracts (back along the
// barrel, down off the shoulder shield, down the thigh), lit along the top line, the belly and girth turning dark; a
// bristly mane ridge from the poll over the hump. The toxin has made that ridge a crest of fruiting bodies: irregular
// clusters of pale-yellow and lilac caps of every size (a big clump over the hump, smaller ones along the neck and back,
// bare stretches of mane between), eyes opened at the base of the clusters; soft pink warty truffle galls on the flank;
// the hide peeled to grey skin and mould in patches. Head: a small dark eye under a heavy brow, a wet cracked disc,
// upcurved tusks crusted with loam, a torn ear with the gardener's notched tag, a scar across the snout, crushed truffles
// and spore froth in the mouth. Leather collar with an iron ring and a broken lead rope trailing, an iron bell packed with
// moss; a broken spear shaft in the shoulder; the muzzle strap torn off and hanging plumb from the near tusk.
// Toxin: the crest, truffle galls, peeling hide and mould, spore froth. Void: the eyes at the crest's base; a clean round
// hole through the near ear.
// Rig: spine_1 (root, hindquarters) > spine_2 > neck > head > jaw, ear; tail; crest_1..3; legs leg_<k>_1..3.
// Motion: idle rooting (head and snout plough, the crest quivering); attack a tusking charge (head drives up and forward,
// the front legs push).
function truffleBoar() {
  const seed = 1423, W = 2250, h = 1500;
  const f = new Fig(X.base(seed, h, { grimeY: 1120 })); X.texturesB(f);
  const gy = f.o.groundY;
  const coat = '#3a3029', coatS = '#120e0c', coatL = '#8a7a68', coatD = '#0a0807', coatM = '#54463a';
  const LOOK = (o = {}) => Object.assign({ fill: coat, shadow: coatS, light: coatL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 }, o);
  // the barrel: rump low at the left, the back rising to the hump over the forequarter, the crest falling to the poll
  const B0 = [[430, 612], [540, 566], [700, 526], [880, 462], [1040, 372], [1180, 292], [1300, 256], [1420, 286], [1540, 384], [1660, 520], [1770, 680], [1860, 830], [1860, 940], [1780, 1020], [1660, 1068], [1540, 1084], [1420, 1092], [1250, 1076], [1050, 1042], [880, 1006], [760, 978], [650, 990], [520, 984], [430, 942], [382, 822], [386, 700]];
  const topL = [[430, 612], [700, 526], [1040, 372], [1300, 256], [1540, 384], [1770, 680]], botL = [[430, 942], [650, 990], [880, 1006], [1250, 1076], [1540, 1084], [1730, 1010]];
  const yAt = (L, x) => { for (let i = 0; i < L.length - 1; i++) if (x <= L[i + 1][0]) { const t = Math.max(0, (x - L[i][0]) / (L[i + 1][0] - L[i][0])); return L[i][1] + (L[i + 1][1] - L[i][1]) * t; } return L[L.length - 1][1]; };
  const litB = p => { const t = (p[1] - yAt(topL, p[0])) / Math.max(80, yAt(botL, p[0]) - yAt(topL, p[0])); return 1.05 - t * 1.25 + (p[0] - 1000) / 4000; };
  const L = {
    fn: { S: [1430, 780], E: [1400, 1074], K: [1436, 1286], F: [1448, 1404], Q: [1470, 1450] },
    ff: { S: [1520, 760], E: [1520, 1050], K: [1560, 1272], F: [1574, 1396], Q: [1598, 1446] },
    hn: { S: [560, 760], E: [650, 1000], K: [540, 1248], F: [560, 1402], Q: [584, 1450] },
    hf: { S: [640, 730], E: [730, 980], K: [636, 1236], F: [656, 1396], Q: [680, 1446] },
  };
  const wsF = [300, 236, 140, 104, 84], wsH = [330, 236, 132, 100, 84];
  // the head frame: origin at the poll, +x down the face to the disc
  const PP = [1780, 910], DD = [2035, 1415], hA = Math.atan2(DD[1] - PP[1], DD[0] - PP[0]), hF = frame(PP, hA, 0.9);
  f.joint('spine_1', [720, 760]).joint('spine_2', [1150, 760], 'spine_1').joint('neck', [1560, 720], 'spine_2').joint('head', hF([[-40, 60]])[0], 'neck').joint('tail', [410, 640], 'spine_1');
  f.joint('jaw', hF([[150, 150]])[0], 'head').joint('ear', hF([[20, -118]])[0], 'head');
  f.joint('crest_1', [760, 500], 'spine_1').joint('crest_2', [1280, 270], 'spine_2').joint('crest_3', [1620, 480], 'neck');
  for (const [k, Lk] of Object.entries(L)) f.joint(`leg_${k}_1`, Lk.S, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, Lk.E, `leg_${k}_1`).joint(`leg_${k}_3`, Lk.K, `leg_${k}_2`);
  const leg = (k, far, part) => { const ws = k[0] === 'f' ? wsF : wsH, Lk = L[k], tone = far ? 0.5 : 0;
    X.cervidLeg(f, Lk, k, ws, LOOK({ fill: mix(coat, coatD, tone), maxShade: 16, hi: 0 }), { part, cannon: ws[2] * 0.72, stock: far ? mix(P.loamD, '#000', 0.3) : mix(coat, P.loam, 0.6), hs: 2.6, sc: 2.2, furDark: coatD, furLite: far ? coatS : coatL, fur: false, hoof: '#24201e',
      inside: shape => { const sd = E.smooth(shape);
        softTone(f, sd, [[[lp(Lk.S, Lk.E, 0.0, 0), lp(Lk.S, Lk.E, 0.0, ws[0] * 0.6), lp(Lk.E, Lk.K, 0.7, ws[2] * 0.6), lp(Lk.E, Lk.K, 0.7, 0)], coatD, 0.7 + tone * 0.2, 22], [[lp(Lk.S, Lk.E, 0.1, -ws[0] * 0.5), lp(Lk.S, Lk.E, 0.85, -ws[1] * 0.5), lp(Lk.S, Lk.E, 0.85, -ws[1] * 0.1), lp(Lk.S, Lk.E, 0.1, -ws[0] * 0.1)], far ? coatS : coatL, 0.4, 16], [[lp(Lk.S, Lk.E, -0.2, -ws[0]), lp(Lk.S, Lk.E, -0.2, ws[0]), lp(Lk.S, Lk.E, 0.25, ws[0]), lp(Lk.S, Lk.E, 0.25, -ws[0])], coatD, 0.55, 24]]); // the back of the leg dark, the front lit, the body's shadow over the top
        X.bristles(f, shape, 300, 26, { dir: () => [0.12, 1], lit: q => (far ? 0.15 : 0.5) - (q[0] - lerp(Lk.S, Lk.K, 0.5)[0]) / 260, w: 2.6, dark: coatD, mid: coatM, lite: coatL });
        f.line([lp(Lk.E, Lk.K, 0.1, -ws[1] * 0.36), lp(Lk.E, Lk.K, 0.9, -ws[2] * 0.42), lp(Lk.K, Lk.F, 0.5, -ws[2] * 0.3)], 2.2, far ? coatM : coatL, { op: 0.5 }); // the lit front of the leg
        for (let i = 0; i < 14; i++) { const q = lp(Lk.K, Lk.Q, R(f, 0.3, 1.05), R(f, -0.45, 0.45) * ws[3]); f.part(X.lumpy(f, ell(q, R(f, 6, 14), R(f, 5, 10), R(f, 0, 3), 8), 2), { fill: f.r() > 0.5 ? P.loam : P.loamL, shadow: P.loamD, shade: 0.4, maxShade: 4, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); } } }); }; // loam caked in clods to the knee

  // ---- far legs and the tail behind the barrel
  leg('hf', true, 3); leg('ff', true, 3); leg('hn', false, 3); leg('fn', false, 3);
  f.bone('tail');
  { const t0 = [414, 632]; f.part(X.tube(spline([t0, [372, 680], [360, 760], [372, 840]], 5), [26, 18, 13, 10]), LOOK({ maxShade: 6 })); for (let i = 0; i < 12; i++) { const q = add([372, 836], [R(f, -8, 8), R(f, -10, 4)]); f.line([q, add(q, [R(f, -14, 14), R(f, 26, 50)])], 2.2, i % 3 ? coatD : coatM); } } // the thin tail and its tassel

  // ---- the barrel: split three ways for the rig (hindquarters, forequarter, neck)
  const neckC = [1600, 640], neckD = [0.62, -0.78];
  split(f, () => {
    const d = f.part(B0, LOOK({ maxShade: 22, inkW: 1.8, inkHeavy: 3.6, hi: 0 }));
    clipDraw(f, d, () => {
      X.barrelTones(f, d, { top: [[440, 600], [700, 524], [1040, 372], [1300, 258], [1540, 388], [1750, 660]], belly: [[470, 960], [650, 990], [880, 1004], [1250, 1074], [1540, 1082], [1760, 1020]], w: 150, lit: coatL, dark: coatD, litOp: 0.75, darkOp: 0.95, blur: 34, hatchStep: 10,
        hollows: [[[1220, 640], [1320, 660], [1350, 1080], [1210, 1080]], [[700, 820], [800, 800], [840, 1000], [700, 1000]], [[400, 760], [470, 740], [470, 960], [400, 950]], [[1680, 780], [1840, 820], [1800, 1010], [1660, 1060]]], hollowOp: 0.65,
        rounds: [ell([1430, 560], 150, 190, 0.3, 14), ell([560, 690], 130, 130, -0.2, 14), ell([1120, 480], 160, 90, -0.3, 12)] });
      // the coarse coat: bristles in tracts (back along the barrel, down off the shoulder shield and the neck, down the thigh,
      // back under the belly), toned by the form
      const dirF = p => { const [x, y] = p; if (y > yAt(botL, x) - 90) return [-0.9, 0.3]; if (x > 1500) return [-0.45, 1]; if (x > 1320) return [-0.2, 1]; if (x < 720) return [-0.2, 1]; return [-1, 0.25 + (y - 600) / 700]; };
      X.bristles(f, B0, 3200, 50, { dir: dirF, lit: litB, w: 3.2, dark: coatD, mid: coatM, lite: coatL });
      // the shoulder shield (the boar's thick hide over the forequarter) as a crease with its lit edge; the elbow; the ham
      crease(f, [[1330, 300], [1300, 520], [1330, 760], [1390, 960]], 6, { col: coatD, lit: coatL, op: 0.6 });
      crease(f, [[1360, 980], [1420, 1010], [1480, 1000]], 4, { col: coatD, lit: coatL, op: 0.5 });
      crease(f, [[600, 580], [560, 740], [600, 900], [690, 980]], 5, { col: coatD, lit: coatL, op: 0.55 });
      for (let i = 0; i < 5; i++) crease(f, [[960 + i * 64, 640 + i * 6], [966 + i * 62, 800], [956 + i * 60, 960]], 3, { col: coatD, lit: coatL, op: 0.25 }); // ribs under the coat
      // the neck's folds of hide behind the head
      for (let i = 0; i < 3; i++) crease(f, [[1640 + i * 30, 700 + i * 50], [1620 + i * 30, 840 + i * 40], [1590 + i * 26, 980 + i * 20]], 5, { col: coatD, lit: coatL, op: 0.5 });
      stains(f, d, E.bbox(B0), P.loamD, 0.008, 2.8, -1.4, seed % 89, 0.55);
      // hide peeled away in patches to grey skin and mould, tufted rims
      for (const [c, rx, ry, a] of [[[980, 600], 66, 40, 0.2], [[1280, 880], 50, 34, -0.3], [[640, 840], 44, 54, 0.4]]) {
        const mp = ell(c, rx, ry, a, 16).map(q => add(q, [R(f, -rx * 0.2, rx * 0.2), R(f, -ry * 0.2, ry * 0.2)]));
        f.part(mp, { fill: mix(P.grey, P.lilacS, 0.4), shadow: mix(P.greyS, P.lilacS, 0.5), light: P.greyL, shade: 0.35, maxShade: 8, hi: 0, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + seed, texOp: 0.6 });
        X.mould(f, c, rx * 0.7, ry * 0.6, { col: mix(P.lilac, P.grey, 0.3), op: 0.8 });
        for (let i = 0; i < 16; i++) { const t = i / 16 * Math.PI * 2, q = add(c, rot([Math.cos(t) * rx, Math.sin(t) * ry], a)); f.line([q, add(q, rot([R(f, 6, 16), 0], t + a + R(f, -0.4, 0.4)))], 2.4, coatD, { op: 0.85 }); }
      }
      for (let i = 0; i < 4; i++) f.stroke([[1080 + i * 44, 990 + i * 6], [1160 + i * 44, 972 + i * 8]], 5, coatL, { op: 0.3 }); // old tusk scars on the belly
    });
  }, [['spine_1', side([1150, 760], [-1, 0], 140)], ['spine_2', [side([1150, 760], [1, 0], 140), side(neckC, mul(neckD, -1), 220)]], ['neck', side(neckC, neckD, 220)]]);

  // ---- truffle galls on the flank and hip: soft, warty, pink, clustered, one splitting with mould
  const truffle = (c, r, col) => { const pts = X.lumpy(f, ell(c, r, r * 0.86, R(f, 0, 3), 16), r * 0.16); X.hostShadow(f, pts, r * 0.2, 0.55); const td = f.part(pts, X.FL(f, col, { maxShade: r * 0.45, shade: 0.46 })); clipDraw(f, td, () => { softTone(f, td, [[ell(add(c, mul(f.L, r * 0.4)), r * 0.45, r * 0.35, 0, 10), mix(col, '#fff', 0.35), 0.6, r * 0.2]]); for (let i = 0; i < Math.round(r * 0.8); i++) { const q = add(c, [R(f, -r, r), R(f, -r, r)]); f.flat(ell(q, R(f, 2, 4), R(f, 2, 3.5), 0, 6), mix(col, P.loamD, 0.5), { op: 0.7 }); f.flat(ell(add(q, [1, -1.4]), 1.4, 1.2, 0, 5), mix(col, '#fff', 0.4), { op: 0.6 }); } }); };
  f.bone('spine_2');
  for (const [c, r, col] of [[[1160, 790], 50, P.pink], [[1214, 846], 32, mix(P.pink, P.pinkD, 0.5)], [[1118, 856], 24, P.pinkL], [[1250, 780], 20, mix(P.pink, P.lilac, 0.3)]]) truffle(c, r, col);
  X.rotSplit(f, [[1140, 770], [1166, 790], [1180, 818]], 4, { inner: P.loamD });
  f.bone('spine_1');
  for (const [c, r, col] of [[[520, 780], 34, P.pink], [[556, 830], 22, P.pinkL], [[900, 830], 28, mix(P.pink, P.lilac, 0.3)]]) truffle(c, r, col);

  // ---- the broken spear shaft in the shoulder: the old wound puckered round it, the shaft splintered short
  f.bone('spine_2');
  { const w0 = [1400, 560], a = -2.3; X.rotSplit(f, [add(w0, [-24, -12]), w0, add(w0, [22, 14])], 6, { inner: P.pinkS, edge: P.pinkD });
    const e = add(w0, rot([200, 0], a)); f.part(ribbon(spline([w0, e], 6), spline([w0, e], 6).map(() => 17)), WOOD(f, { fill: mix(P.loamBL, P.grey, 0.3), light: P.greyL, inkW: 1.4 }));
    f.line([lerp(w0, e, 0.1), lerp(w0, e, 0.9)].map(q => add(q, [3, -4])), 1.6, P.greyL, { op: 0.5 });
    for (let i = -2; i <= 2; i++) f.line([e, add(e, rot([R(f, 14, 30), i * 5], a))], 2, mix(P.loamBL, P.grey, 0.3)); // splinters
    f.part(ell(add(w0, rot([22, 0], a)), 13, 10, a, 10), IRON(f, { cast: false })); } // the iron socket of the lost head

  // ---- the crest of fruiting bodies along the spine: irregular clusters of mixed size and kind, bare mane between them;
  // the mane ridge itself (long bristles standing off the top line, swept back) runs under and between the clusters
  const crestPath = [[460, 596], [700, 520], [880, 456], [1040, 366], [1180, 286], [1300, 250], [1420, 280], [1540, 378], [1660, 516], [1770, 676], [1830, 800]];
  const CC = spline(crestPath, 6), Sx = X.arcLen(CC), Lt = Sx[Sx.length - 1];
  const at = u => { let i = Sx.findIndex(v => v >= u * Lt); i = Math.max(1, Math.min(CC.length - 2, i)); const t = E.norm(sub(CC[i + 1], CC[i - 1])); return [CC[i], [t[1], -t[0]], t]; };
  // [position 0..1 along the spine, size, count, kind, lean]
  const clusters = [[0.04, 70, 3, 'convex', -0.5], [0.1, 50, 2, 'flat', -0.5], [0.15, 120, 4, 'conic', -0.4], [0.23, 84, 2, 'flat', -0.3], [0.3, 170, 5, 'mix', -0.35], [0.37, 64, 2, 'convex', -0.3], [0.41, 150, 4, 'inkcap', -0.2], [0.48, 250, 8, 'mix', -0.25], [0.56, 200, 6, 'mix', -0.15], [0.62, 80, 2, 'conic', -0.3], [0.68, 150, 5, 'convex', -0.45], [0.75, 60, 2, 'convex', -0.5], [0.81, 100, 3, 'flat', -0.6], [0.88, 124, 4, 'inkcap', -0.7], [0.95, 64, 3, 'convex', -0.8]];
  const cols = [P.yel, P.lilac, mix(P.yel, P.bone, 0.3), mix(P.lilac, P.yel, 0.4), P.yelD, P.lilacL];
  const crest = (from, to, bone) => {
    f.bone(bone);
    X.maneRidge(f, crestPath.filter((_, i) => { const u = i / (crestPath.length - 1); return u >= from - 0.08 && u <= to + 0.08; }), Math.round((to - from) * 260), 90, { dark: coatD, mid: coatM, lite: coatL, w: 5, sweep: -0.6 });
    for (const [u, s, n, kind, lean] of clusters) {
      if (u < from || u >= to) continue;
      const [p, up] = at(u), a = Math.atan2(up[1], up[0]) + lean, base = add(p, mul(up, -s * 0.12));
      if (kind === 'mix') { for (let k = 0; k < n; k++) { const ss = s * (0.3 + 0.75 * Math.pow(f.r(), 1.6)), q = add(base, [R(f, -s * 0.35, s * 0.35), R(f, -6, 10)]); X.cap(f, q, a + R(f, -0.45, 0.45), ss, { col: cols[k % cols.length], shape: ['convex', 'conic', 'flat', 'inkcap'][k % 4], w: R(f, 0.26, 0.4), sw: 0.1, stemL: R(f, 0.5, 0.8), warts: Math.round(ss / 30), collapse: k === 2 }); } }
      else X.caps(f, base, a, s, n, { cols: [cols[Math.floor(u * 17) % cols.length], cols[(Math.floor(u * 17) + 2) % cols.length]], shape: kind, fan: 0.45, sw: 0.11, stemL: 0.62 });
      if (n >= 3) X.eye(f, add(p, mul(up, -s * 0.18 - 14)), R(f, 26, 34), Math.atan2(up[0], -up[1]) * 0 + R(f, -0.3, 0.2), { open: [0.65, 0.15, 0.85, 0.4][Math.floor(u * 10) % 4], lid: mix(P.pinkD, coat, 0.3), lidS: coatD, lashes: true });
      if (kind === 'conic' || kind === 'flat') X.brackets(f, [add(p, mul(up, -s * 0.1)), add(add(p, mul(up, -s * 0.25)), [s * 0.3, 0])], 3, Math.atan2(up[1], up[0]) + 0.9, s * 0.22, s * 0.32, { side: true, col: mix(P.yel, P.loamB, 0.2) });
    }
    // small single caps and pinheads breaking up the stretches between the clusters
    for (let k = 0; k < Math.round((to - from) * 18); k++) { const u = R(f, from, to), [p, up] = at(u); X.cap(f, add(p, mul(up, -4)), Math.atan2(up[1], up[0]) - 0.4 + R(f, -0.4, 0.4), R(f, 22, 46), { col: cols[k % cols.length], shape: k % 2 ? 'conic' : 'convex', sw: 0.12, warts: 1, tear: false }); }
  };
  crest(0.0, 0.42, 'crest_1'); crest(0.42, 0.72, 'crest_2');

  // ---- the collar and its bell on the neck
  f.bone('neck');
  { const c0 = [1740, 660], c1 = [1600, 1080], cc = spline([c0, add(lerp(c0, c1, 0.5), [34, 6]), c1], 6);
    f.part(ribbon(cc, cc.map(() => 44)), LEATH(f, { fill: P.loamB, inkW: 1.4, maxShade: 12 }));
    f.line(cc.map(q => add(q, [-12, -6])), 1.4, P.loamBL, { op: 0.5 }); f.stitches(cc.map(q => add(q, [10, 4])), P.loamBL, 1);
    const rg = add(c1, [-6, 22]); X.ironRing(f, rg, 26, 30, 6, 0.2);
    // the broken lead rope trailing from the ring back along the ground, frayed
    X.rope(f, [add(rg, [0, 30]), add(rg, [-30, 150]), add(rg, [-110, 330]), [1380, gy - 6], [1180, gy - 10]], 8, P.loamBL, { fray: true });
    const bl = lerp(c0, c1, 0.66), bell = [add(bl, [-24, 22]), add(bl, [26, 20]), add(bl, [34, 74]), add(bl, [44, 86]), add(bl, [-36, 90]), add(bl, [-28, 76])];
    f.line([bl, add(bl, [2, 22])], 3, '#3a3838'); f.part(bell, IRON(f, { fill: '#525050' })); f.flat([add(bl, [-32, 84]), add(bl, [40, 82]), add(bl, [32, 96]), add(bl, [-26, 98])], '#0c0a0a');
    f.line([add(bl, [-14, 30]), add(bl, [-18, 76])], 2, '#8a8682', { op: 0.5 });
    X.moss(f, [add(bl, [-28, 90]), add(bl, [2, 100]), add(bl, [32, 90])], 10, { col: P.rot }); }
  f.bone('crest_3'); crest(0.72, 1.0, 'crest_3');

  // ---- the far ear behind the head
  f.bone('ear');
  { const er = hF([[-30, -104]])[0]; const ear = [add(er, [-30, 10]), add(er, [-20, -90]), add(er, [6, -170, 1]), add(er, [40, -90]), add(er, [46, 6])]; f.part(ear, LOOK({ fill: mix(coat, coatD, 0.45), maxShade: 10 })); }

  // the near ear: erect, hairy, torn at the edge, the gardener's notched tag, a clean round hole through it
  f.bone('ear');
  { const er = hF([[20, -118]])[0]; const ear = [add(er, [-60, 40]), add(er, [-58, -40]), add(er, [-30, -110]), add(er, [20, -170]), add(er, [70, -206, 1]), add(er, [76, -140]), add(er, [70, -100]), add(er, [54, -88]), add(er, [74, -66]), add(er, [70, 40])];
    X.cutHoles(f, [[add(er, [10, -80]), 11]], () => { const ed = f.part(ear, LOOK({ maxShade: 16, hi: 0 })); clipDraw(f, ed, () => { f.flat([add(er, [-36, 10]), add(er, [-30, -56]), add(er, [40, -160]), add(er, [52, -96]), add(er, [50, 10])], mix(P.pinkS, coatD, 0.55), { op: 0.85 }); softTone(f, ed, [[[add(er, [20, -220]), add(er, [80, -220]), add(er, [80, 30]), add(er, [30, 30])], coatL, 0.45, 10]]); X.bristles(f, ear, 70, 22, { dir: () => [0.1, -1], lit: q => (q[0] - er[0]) / 80, w: 2, dark: coatD, mid: coatM, lite: coatL }); }); }, { shape: ear });
    for (let i = 0; i < 9; i++) { const q = add(er, [-44 + R(f, -2, 2), -60 + i * 8 - 40]); f.line([q, add(q, [-R(f, 8, 18), R(f, -6, 6)])], 1.6, coatD, { op: 0.8 }); } // hair off the back edge
    const tg = add(er, [66, -30]); f.line([tg, add(tg, [6, 20])], 2, '#4a4848'); f.part([add(tg, [-10, 20]), add(tg, [22, 20]), add(tg, [22, 54]), add(tg, [2, 54]), add(tg, [-10, 42])].map(q => [...q, 1]), IRON(f, { fill: '#6e6c6e' })); for (let i = 0; i < 4; i++) f.line([add(tg, [-6 + i * 7, 54]), add(tg, [-4 + i * 7, 46])], 1.6, INK); } // the notched tag

  // ---- the head: short, deep and wedge-shaped, down in the loam; one outline from the poll to the disc
  f.bone('head');
  const skull = hF([[-110, 40], [-80, -96], [-10, -146], [90, -156], [190, -130], [300, -102], [420, -80], [520, -68], [572, -62], [598, -22], [596, 30], [572, 54], [480, 70], [380, 100], [300, 156], [220, 236], [120, 300], [20, 312], [-80, 272], [-124, 160]]);
  const sk = f.part(skull, LOOK({ maxShade: 18, hi: 0, inkW: 0, inkHeavy: 0 }));
  clipDraw(f, sk, () => {
    // planes: the lit top of the face and forehead, the cheek and jowl turning under dark, the round of the cheek lit
    softTone(f, sk, [[hF([[-120, -140], [600, -80], [600, -40], [300, -50], [-120, -60]]), coatL, 0.7, 20], [hF([[-130, 140], [300, 110], [420, 70], [620, 70], [620, 300], [-130, 300]]), coatD, 0.9, 24], [hF(ell([120, 60], 120, 80, 0, 12)), coatL, 0.3, 26], [hF([[-130, -40], [-60, -40], [-60, 260], [-130, 260]]), coatD, 0.5, 20]]);
    X.bristles(f, skull, 700, 34, { dir: p => { const q = sub(p, PP), lx = q[0] * Math.cos(hA) + q[1] * Math.sin(hA), ly = -q[0] * Math.sin(hA) + q[1] * Math.cos(hA); return ly > 120 ? rot([0.2, 1], 0) : rot([-1, 0.2 + ly / 400], hA); }, lit: p => { const q = sub(p, PP), ly = -q[0] * Math.sin(hA) + q[1] * Math.cos(hA); return 0.85 - (ly + 120) / 330; }, w: 2.6, dark: coatD, mid: coatM, lite: coatL });
    for (let i = 0; i < 5; i++) crease(f, hF([[420 + i * 30, -74], [432 + i * 30, -30], [426 + i * 30, 30]]), 3, { col: coatD, lit: coatL, op: 0.5 }); // the wrinkled snout
    crease(f, hF([[90, 70], [200, 130], [320, 150]]), 5, { col: coatD, lit: coatL, op: 0.55 }); // the jowl's upper edge
    crease(f, hF([[40, 150], [130, 220], [190, 230]]), 4, { col: coatD, lit: coatL, op: 0.45 });
    f.stroke(hF([[470, -78], [500, -30], [530, 30]]), 9, mix(coatL, P.pinkD, 0.35), { op: 0.75 }); f.line(hF([[470, -78], [500, -30], [530, 30]]), 1.4, INK, { op: 0.6 }); // the scar across the snout
    stains(f, sk, E.bbox(skull), P.loamD, 0.012, 3, -1.2, 81, 0.75);
    softTone(f, sk, [[hF([[470, -90], [620, -90], [620, 80], [470, 80]]), P.loamD, 0.6, 14]]); // loam caked on the snout
  });
  { const C = spline(hF([[-80, -96], [-10, -146], [90, -156], [190, -130], [300, -102], [420, -80], [520, -68], [572, -62], [598, -22], [596, 30], [572, 54], [480, 70], [380, 100], [300, 156], [220, 236], [120, 300], [20, 312]]), 4); f.line(C, 1.8, INK); f.line(C.slice(0, Math.round(C.length * 0.45)).map(q => add(q, mul(f.L, -2))), 2.6, INK, { op: 0.0 }); f.line(C.slice(Math.round(C.length * 0.55)), 3.4, INK, { op: 0.8 }); } // the true outline inked, heavier on the shadow side; no ink where the head joins the neck
  // the brow ridge and the small, dark, deep-set eye under it, wrinkled round
  { const ec = hF([[172, -64]])[0]; f.flat(hF(ell([172, -62], 34, 20, 0, 12)), coatD, { op: 0.7 }); // the socket
    f.flat(hF([[150, -60], [166, -70], [186, -70], [198, -60], [184, -54], [164, -54]]), '#060404'); f.flat(hF(ell([180, -64], 3, 2.2, 0, 6)), '#b0a494', { op: 0.85 }); // the eye, a wet glint
    f.stroke(hF([[110, -92], [170, -102], [230, -88]]), 16, coatD, { op: 0.85 }); f.line(hF([[112, -98], [170, -108], [228, -94]]), 2.2, coatL, { op: 0.55 }); // the heavy brow
    for (let i = 0; i < 4; i++) f.line(hF([[200 + i * 8, -54 + i * 7], [236 + i * 10, -44 + i * 8]]), 1.3, INK, { op: 0.55 }); for (let i = 0; i < 3; i++) f.line(hF([[150 + i * 14, -46], [146 + i * 16, -30]]), 1.1, INK, { op: 0.45 }); }
  // the disc: a wet, cracked, pinkish-grey disc pressed into the loam, two nostrils, its rim of bristles
  { const dc = hF([[592, 2]])[0], disc = ell(dc, 34, 64, hA, 20);
    f.part(disc, { fill: mix(mix(P.pinkD, P.grey, 0.3), P.loamB, 0.45), shadow: P.pinkS, light: P.pinkL, shade: 0.42, maxShade: 12, inkW: 1.6, inkHeavy: 2.4, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
    clipDraw(f, disc, () => softTone(f, E.smooth(disc), [[ell(add(dc, mul(f.L, 26)), 20, 34, hA, 10), P.pinkL, 0.55, 8], [ell(add(dc, mul(f.L, -30)), 26, 50, hA, 10), P.loamD, 0.6, 10]]));
    for (const v of [-24, 24]) { f.flat(hF(ell([600, v], 9, 13, 0, 10)), '#0c0808'); f.line(hF(ell([600, v], 11, 15, 0, 10)).slice(5, 10), 1.4, P.pinkL, { op: 0.5 }); }
    for (let i = 0; i < 7; i++) f.line([add(dc, rot([R(f, -18, 18), R(f, -54, 54)], hA)), add(dc, rot([R(f, -18, 18), R(f, -54, 54)], hA))], 1, INK, { op: 0.55 });
    f.flat(hF(ell([586, -34], 5, 12, 0, 8)), '#fff', { op: 0.4 }); f.line(ell(dc, 38, 68, hA, 20).slice(0, 12), 2, coatD, { op: 0.8 }); }
  // the ploughed loam heaped against the snout, the bow-wave of soil, clods thrown up
  f.bone('root');
  { const lm = [[1880, gy + 2], [1930, gy - 40], [1990, gy - 62], [2070, gy - 84], [2150, gy - 60], [2210, gy - 16], [2240, gy + 2]]; f.part(lm, { fill: P.loam, shadow: P.loamD, light: P.loamL, shade: 0.4, maxShade: 16, inkW: 1.4, cast: false, tex: 'mottle' + seed, texOp: 0.85, grime: false }); clipDraw(f, lm, () => { for (let i = 0; i < 40; i++) f.flat(ell([R(f, 1900, 2240), R(f, gy - 80, gy)], R(f, 3, 8), R(f, 2, 5), 0, 7), f.r() > 0.5 ? P.loamL : P.loamD, { op: 0.85 }); }); for (let i = 0; i < 10; i++) f.part(ell([R(f, 2070, 2230), R(f, gy - 190, gy - 100)], R(f, 5, 11), R(f, 4, 8), R(f, 0, 3), 8), { fill: P.loamL, shadow: P.loamD, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false }); }
  // the lower jaw (its own bone, hinged under the cheek): the open mouth, crushed truffles, a froth of spore
  f.bone('jaw');
  { const jaw = hF([[300, 132], [420, 96], [540, 72], [566, 84], [552, 112], [440, 140], [330, 176], [230, 210], [200, 180]]);
    f.flat(hF([[360, 92], [540, 66], [556, 90], [380, 124]]), '#100808'); // the gape
    f.part(jaw, LOOK({ maxShade: 10, fill: mix(coat, coatD, 0.35), hi: 0 }));
    X.bristles(f, jaw, 80, 20, { dir: () => [0.1, 1], lit: () => 0.1, w: 2.2, dark: coatD, mid: coatM, lite: coatL });
    for (const [x, r] of [[430, 20], [490, 16], [530, 12]]) truffle(hF([[x, 98]])[0], r, mix(P.loamB, P.pinkD, 0.4)); // crushed truffles in the jaws
    X.puff(f, hF([[540, 120]])[0], 30, { col: P.yelL, op: 0.25, specks: 8 }); X.spores(f, hF([[480, 160]])[0], 40, 26, 10); }
  // the tusks: lower tushes curving up and back out of the lip, yellowed, crusted with loam at the root; the upper whetter
  f.bone('head');
  { const tusk = (pts, w) => { const C = spline(pts, 4); const sh = ribbon(C, C.map((_, i) => w * (1 - 0.88 * i / (C.length - 1)))); f.part([...sh.slice(0, C.length), [...C[C.length - 1], 1], ...sh.slice(C.length)], { fill: mix(P.yel, P.bone, 0.3), shadow: P.yelS, light: P.boneL, shade: 0.42, maxShade: w * 0.4, inkW: 1.6, inkHeavy: 2.4, tex: 'mottle' + seed, texOp: 0.5, cast: true, castOp: 0.4 }); f.line(C.slice(1, -2).map(q => add(q, mul(f.L, w * 0.2))), w * 0.16, P.boneL, { op: 0.6 }); for (let i = 1; i < 5; i++) { const q = C[Math.round(i / 6 * (C.length - 1))], dd = E.norm(sub(C[Math.min(C.length - 1, Math.round(i / 6 * (C.length - 1)) + 1)], q)); f.line([add(q, rot(mul(dd, w * 0.4), 1.4)), add(q, rot(mul(dd, w * 0.4), -1.4))], 1, P.yelS, { op: 0.6 }); } f.flat(sh.slice(0, 5).concat(sh.slice(-5)), P.loam, { op: 0.75 }); return C; };
    const tN = tusk(hF([[430, 110], [418, 40], [380, -20], [330, -52]]), 40);
    tusk(hF([[460, 80], [450, 44], [422, 22]]), 22); // the upper tusk, the whetter
    // the torn muzzle strap hanging plumb from the near tusk, a buckle, the torn end
    const sp = tN[Math.round(tN.length * 0.55)], spC = spline([sp, add(sp, [6, 60]), add(sp, [-4, 150])], 4);
    f.part(ribbon(spC, spC.map(() => 18)), LEATH(f, { fill: P.loamB, inkW: 1.2 }));
    f.part(ell(add(sp, [4, 74]), 12, 9, 0.1, 8), IRON(f, { cast: false }));
    for (let i = -2; i <= 2; i++) f.line([add(sp, [-4 + i * 4, 150]), add(sp, [-4 + i * 5, 166 + R(f, 0, 8)])], 1.6, P.loamB); }
  // the jowl's beard of bristles hanging plumb under the jaw
  for (let i = 0; i < 26; i++) { const q = hF([[R(f, -40, 260), R(f, 200, 262)]])[0]; f.stroke([q, add(q, [R(f, -4, 4), R(f, 20, 34)]), add(q, [R(f, -8, 8), R(f, 40, 70)])], R(f, 3, 5), i % 4 ? coatD : coatM, { op: 0.9 }); }
  // the poll's mane running into the neck's mane
  X.maneRidge(f, hF([[-90, -40], [-40, -104], [40, -128]]), 40, 80, { dark: coatD, mid: coatM, lite: coatL, w: 5, sweep: 0.6 });
  f.bone('root');
  X.loamGround(f, 300, 1920, gy, { depth: 18, petals: 4 });
  f.stroke([[1120, gy - 2], [1500, gy - 6], [1910, gy - 8]], 14, P.loamD, { op: 0.6 }); // the furrow behind the snout
  return f;
}

// ------------------------------------------------------------------ THE LADY'S FOOL (elite 1.8)
// The lady's jester. She kept him to make her laugh; the rot thinks he is very funny. Lanky and loose-jointed, capering on
// the ball of his planted far foot, the near knee kicked high, the far arm flung up with his bauble, the near fist on his
// hip, elbow out. The toxin has pushed one thing hard: his throat has swollen into a soft pink fruiting gall that rings
// his neck like a ruff and lifts his chin; his old ruff is half swallowed by it. A long, rubbery face, the grin pulled
// too wide by the swelling, painted eyebrows, one cheek blooming lilac, a wilted flower behind the ear. The three-pointed
// cap's bells have become pale-yellow puffballs that smoke spore when he shakes his head. Motley in pink and lilac
// diamonds, half rotted to holes and moss, the mould soaked into whole diamonds; tights torn at one knee with mould in
// the tear; bells on a garter below the near knee, swollen shut; pointed shoes with curled toes, one sole gone; a
// slapstick at the belt, a purse of dice, the lady's ribbon knotted round the near wrist. The bauble: a carved fool's
// head on a stick, its little face grown over with fungus.
// Toxin: the throat gall (pushed hard), mould in the motley diamonds, puffballs on the cap, moss and rot holes in the
// cloth, fungus over the bauble. Void: eyes opened in the moss on his chest and sleeve; a clean round hole through the
// cap's crown.
// Rig: standard humanoid + bauble (hand_f) + cap (head) + cap points cap_1..3 (cap) + skirt (pelvis: the doublet's
// skirts) + slapstick (pelvis). Motion: idle a little jig, shaking the cap so spore puffs from each point (head, cap_*,
// thigh_n); attack a cartwheel to a hero and a slap of the bauble (the far arm swings the bauble down).
function ladysFool() {
  const seed = 1422, W = 1100, h = 1400;
  const f = new Fig(X.base(seed, h, { grimeY: 1150 })); X.texturesB(f);
  const H = 158, gy = f.o.groundY;
  const skin = mix(P.skin, P.bone, 0.2), skinS = P.skinS;
  const SK = (o = {}) => SKIN(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const PK = mix(P.pinkD, P.loamD, 0.22), LI = mix(P.lilacD, P.loamD, 0.25);
  const MOT = (col, o = {}) => Object.assign({ fill: col, shadow: mix(col, P.lilacS, 0.7), light: mix(col, '#fff', 0.25), shade: 0.42, tex: 'weave' + seed, texOp: 0.45, maxShade: 18 }, o);
  const Pv = [540, 782], N0 = [536, 452];
  const S = B.spine(N0, [572, 610], Pv, H);
  const HC = [566, 330], hA = -0.28;
  const SN = [512, 500], EN = [402, 604], WN = [486, 742];
  const SF = [566, 488], EF = [650, 340], WF = [690, 196];
  const HN = [560, 800], KN = [734, 744], AN = [708, 946];
  const HF = [520, 794], KF = [500, 1032], AF = [514, 1282];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const bTop = [880, 90], bA = Math.atan2(bTop[1] - WF[1], bTop[0] - WF[0]);
  const hF = frame(HC, hA, H);
  const cr = hF([[-0.04, -0.5]])[0];
  f.joint('bauble', WF, 'hand_f').joint('cap', cr, 'head').joint('cap_1', add(cr, [40, -30]), 'cap').joint('cap_2', add(cr, [-10, -50]), 'cap').joint('cap_3', add(cr, [-50, -10]), 'cap').joint('skirt', S.at(0, 0.86), 'pelvis').joint('slapstick', S.at(-0.4, 0.92), 'pelvis');
  const motleyOn = (region, c0, dir, sz, k = 0) => { X.motley(f, region, c0, dir, sz, [mix(P.pink, P.loamD, 0.35 + k), mix(P.lilac, P.loamD, 0.4 + k)], { op: 0.7, mould: (p, i, j) => ((((i * 7 + j * 3) % 9) + 9) % 9 === 0) }); stains(f, E.smooth(region), E.bbox(region), P.loamD, 0.03, 2.4, -1.0, Math.round(c0[0] + c0[1]) % 97, 0.55); };

  // ---- far arm flung up, the bauble held high (behind the body and head)
  X.mArm(f, SF, EF, WF, [50, 42, 34], MOT(LI, { fill: mix(LI, '#000', 0.2) }), { sfx: '_f', bare: false, build: 'lean', after: () => {} });
  f.bone('upperarm_f'); clipDraw(f, E.smooth(K.chain([SF, EF], [50, 42])), () => motleyOn(K.chain([SF, EF], [56, 48]), SF, ang(SF, EF), 22, 0.2));
  f.bone('bauble');
  { const C = spline([add(WF, mul([Math.cos(bA), Math.sin(bA)], -40)), bTop], 6); f.part(ribbon(C, C.map(() => 13)), WOOD(f, { fill: mix(P.loamBL, P.lilacD, 0.2) }));
    for (let i = 0; i < 4; i++) { const q = lerp(C[0], C[C.length - 1], 0.2 + i * 0.16); f.line([add(q, [-8, 4]), add(q, [8, -4])], 3, PK); } // the stick bound with pink ribbon
    // the carved fool's head: a little wooden face with its own tiny cap, grown over with fungus
    const bh = add(bTop, [6, -10]), BF = frame(bh, bA + Math.PI / 2, 1);
    f.part(BF(ell([0, 0], 30, 36, 0, 14)), WOOD(f, { fill: mix(P.loamBL, P.bone, 0.2), maxShade: 10 }));
    f.part(BF([[-30, -10], [-20, -44], [0, -36], [16, -60], [28, -30], [40, -50], [32, -10]]), MOT(PK, { maxShade: 6, inkW: 1.2 }));
    for (const q of [[-20, -44], [16, -60], [40, -50]]) X.puffball(f, BF([q])[0], 6, { smoke: false });
    f.line(BF([[-14, 6], [0, 16], [16, 6]]), 2, INK); f.flat(BF(ell([-10, -6], 3, 3, 0, 6)), INK); f.flat(BF(ell([10, -6], 3, 3, 0, 6)), INK); // its carved grin
    X.caps(f, BF([[-4, 20]])[0], bA + Math.PI * 0.75, 40, 4, { cols: [P.yel, P.lilac, P.pinkL], fan: 0.5, sw: 0.12 }); // fungus grown over its little face
    X.mould(f, BF([[8, 0]])[0], 16, 14, { col: mix(P.lilac, P.grey, 0.3), op: 0.75 }); }
  f.bone('forearm_f');
  X.mArm(f, lerp(EF, WF, 0.6), lerp(EF, WF, 0.8), WF, [34, 32, 28], SK({ fill: mix(skin, '#000', 0.12) }), { build: 'lean' });
  f.part(K.ragLimb(f, lerp(EF, WF, 0.3), lerp(EF, WF, 0.7), 44, 46, { depth: 10, teeth: 6 }), MOT(LI, { fill: mix(LI, '#000', 0.15), cast: false })); // the dagged cuff
  f.bone('hand_f');
  X.gripK(f, WF, EF, bA, 26, mix(skin, '#000', 0.1), { tex: 'mottle' + seed, shadow: skinS, maxBend: 45, name: 'fool bauble' });

  // ---- far leg, planted on the ball of the foot: motley tights, a pointed shoe, its curled toe
  const legM = (Hp, Kn, A, sfx, col, tone) => { X.mLeg(f, Hp, Kn, A, [100, 64, 34], MOT(col, { fill: mix(col, '#000', tone) }), { sfx, bare: false, swell: 0.5 }); }; // (independent review) calf swell and a slim ankle: no even tube
  const shoe = (A, sfx, tone, a, o = {}) => { f.bone('foot' + sfx); const F = frame(A, a, 1); const col = mix('#3a3034', '#000', tone);
    const sh = F([[-30, -18], [10, -24], [60, -10], [110, 4], [150, 0], [168, -16], [162, -30, 1], [176, -12], [160, 10], [110, 26], [40, 30], [-20, 24], [-36, 6]]);
    f.part(sh, { fill: col, shadow: '#0c0a0c', light: mix(col, P.lilacL, 0.3), shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, maxShade: 10 });
    f.line(F([[0, 26], [60, 28], [120, 22]]), 2.4, '#0c0a0c'); // the sole's edge
    if (o.holed) { f.flat(F([[40, 22], [100, 22], [96, 32], [44, 32]]), '#0a0808'); f.part(F([[52, 30], [70, 30], [72, 38], [54, 38]]), SK({ fill: mix(skin, P.loamD, 0.4), cast: false, inkW: 0.8 })); } // the sole gone, a toe out
    X.mould(f, F([[60, 0]])[0], 12, 8, { col: P.lilac, op: 0.6 }); };
  legM(HF, KF, AF, '_f', PK, 0.22);
  f.bone('thigh_f'); clipDraw(f, E.smooth(K.chain([HF, KF], [76, 52])), () => motleyOn(K.chain([HF, KF], [80, 56]), HF, ang(HF, KF), 26, 0.25));
  shoe(AF, '_f', 0.2, 0.55, { holed: true });

  // ---- torso: a doublet in motley diamonds, the moss in rot holes, eyes in the moss on the chest
  f.bone('torso');
  const tor = S.shape([[-0.02, 0.38, 0.3], [0.12, 0.6, 0.48], [0.36, 0.56, 0.56], [0.6, 0.46, 0.5], [0.82, 0.46, 0.5], [1.02, 0.52, 0.56]]);
  const td = f.part(tor, MOT(PK));
  clipDraw(f, td, () => {
    motleyOn(tor, S.at(0, 0.4), Math.PI / 2 + 0.1, 30);
    softTone(f, td, [[[S.at(-1, 0), S.at(-0.2, 0), S.at(-0.2, 1.1), S.at(-1, 1.1)], '#000', 0.35, 14], [[S.at(0.1, 0.1), S.at(0.6, 0.1), S.at(0.6, 0.5), S.at(0.1, 0.5)], P.boneL, 0.2, 12]]);
    for (const [u0, v0, u1, v1] of [[-0.3, 0.2, -0.1, 0.8], [0.1, 0.5, 0.3, 0.95], [-0.5, 0.5, -0.2, 0.9]]) X.fold(f, [S.at(u0, v0), S.at((u0 + u1) / 2 + 0.06, (v0 + v1) / 2), S.at(u1, v1)], 2.6, { dk: P.lilacS, lt: P.lilacL });
    stains(f, td, E.bbox(tor), P.loamD, 0.03, 2.6, -1.3, 83, 0.55);
    // rot holes with moss in them, eyes opening in the moss
    for (const [u, v, r] of [[0.18, 0.4, 22], [-0.2, 0.62, 16]]) { const c = S.at(u, v); f.flat(X.lumpy(f, ell(c, r, r * 0.8, 0.3, 12), 4), P.loamD); X.moss(f, ell(c, r * 0.7, r * 0.55, 0.3, 10), 6, { col: P.rot }); }
    X.eyes(f, [[S.at(0.18, 0.4), 16, 0.2, 0.7], [S.at(-0.2, 0.62), 12, -0.2, 0.1]], { lid: P.rotL, lidS: P.rotS });
  });
  f.line([S.at(0.46, 0.1), S.at(0.5, 0.5), S.at(0.5, 0.9)], 1.8, INK, { op: 0.6 }); for (let i = 0; i < 5; i++) f.rivet(S.at(0.5, 0.18 + i * 0.16), 3.4, P.boneD); // the buttons down the front
  // the belt: a purse of dice and the slapstick hanging
  f.bone('pelvis');
  f.part([S.at(-0.5, 0.86), S.at(0.54, 0.86), S.at(0.56, 0.94), S.at(-0.5, 0.95)], LEATH(f, { fill: P.loamB, cast: false, inkW: 1.2 }));
  { const p0 = S.at(0.36, 0.95); f.line([p0, add(p0, [4, 20])], 2, P.loamD); const pu = [add(p0, [-20, 20]), add(p0, [22, 18]), add(p0, [28, 50]), add(p0, [8, 64]), add(p0, [-16, 62]), add(p0, [-26, 44])]; f.part(pu, LEATH(f, { fill: mix(P.loamB, P.lilacD, 0.3) })); for (const [dx, dy] of [[-6, 70], [10, 74]]) { const q = add(p0, [dx, dy]); f.part([add(q, [-6, -6]), add(q, [6, -6]), add(q, [6, 6]), add(q, [-6, 6])].map(v => [...v, 1]), { fill: P.boneL, shadow: P.boneS, shade: 0.4, inkW: 1, cast: false }); f.flat(ell(q, 1.4, 1.4, 0, 5), INK); } } // a die fallen half out
  f.bone('slapstick');
  { const s0 = S.at(-0.36, 0.95), s1 = add(s0, [-30, 190]); f.part(ribbon(spline([s0, s1], 6), spline([s0, s1], 6).map(() => 18)), WOOD(f, { fill: mix(P.loamBL, P.yelD, 0.3) })); const s2 = add(s0, [-24, 150]); f.part(ribbon(spline([lerp(s0, s1, 0.3), s2], 6), spline([lerp(s0, s1, 0.3), s2], 6).map(() => 14)), WOOD(f, { fill: mix(P.loamBL, P.yelD, 0.2) })); f.line([lerp(s0, s1, 0.32), lerp(s0, s1, 0.98)], 1.2, INK, { op: 0.6 }); }

  // ---- the doublet's dagged skirts over the hips
  f.bone('skirt');
  { const sk = [S.at(-0.56, 0.86), S.at(0.6, 0.86), add(S.at(0.6, 1.0), [10, 40]), ...X.hemLine(f, add(S.at(0.6, 1.0), [6, 70]), add(S.at(-0.6, 1.0), [-6, 60]), 6, 18), add(S.at(-0.6, 1.0), [-10, 30])];
    const skd = f.part(sk, MOT(LI)); clipDraw(f, skd, () => { motleyOn(sk, S.at(0, 1.0), Math.PI / 2, 30, 0.05); X.folds(f, [S.at(-0.3, 0.9), S.at(0.1, 0.9), S.at(0.4, 0.9)], 100, 2.6, { dk: P.lilacS }); stains(f, skd, E.bbox(sk), P.loamD, 0.04, 3, -1.3, 85, 0.6); }); }

  // ---- near leg, kicked high: torn tights at the knee with mould in the tear, the garter of swollen bells
  legM(HN, KN, AN, '_n', LI, 0);
  f.bone('thigh_n'); clipDraw(f, E.smooth(K.chain([HN, KN], [76, 52])), () => motleyOn(K.chain([HN, KN], [80, 56]), HN, ang(HN, KN), 26));
  f.bone('shin_n');
  { const kq = lp(KN, AN, 0.08, 6); f.part(X.lumpy(f, ell(kq, 24, 18, ang(KN, AN), 12), 4), SK({ fill: mix(skin, P.lilacD, 0.2), cast: false, maxShade: 6 })); X.mould(f, kq, 16, 12, { col: mix(P.lilac, P.grey, 0.3), op: 0.85 }); X.fungalFur(f, ell(kq, 24, 18, ang(KN, AN), 12), 7, 1, { gaps: 0.4 }); // the torn knee, mould in the tear
    const g = [lp(KN, AN, 0.24, -30), lp(KN, AN, 0.28, 0), lp(KN, AN, 0.24, 30)]; X.rope(f, g, 5, PK, { lit: false });
    for (let i = 0; i < 4; i++) { const q = lp(KN, AN, 0.3 + (i % 2) * 0.03, -26 + i * 17); f.part(X.lumpy(f, ell(q, 9, 8, 0, 10), 1.6), X.FL(f, mix(P.grey, P.yelD, 0.3), { maxShade: 4, inkW: 1, inkHeavy: 1.2 })); X.mould(f, q, 6, 5, { col: P.rot, op: 0.8, rings: 0 }); } } // bells swollen shut with moss
  shoe(AN, '_n', 0, 1.25, {});

  // ---- the throat gall: a soft pink fruiting swelling ringing the neck like a ruff, lifting the chin; the old ruff
  // half swallowed by it
  f.bone('head');
  f.part(limb(add(N0, [-8, 6]), hF([[-0.08, 0.36]])[0], 56, 48, { steps: 5 }), SK());
  const gc = hF([[-0.06, 0.66]])[0];
  { // the old ruff: pleated, grubby, swallowed on the near side
    for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.32, q = add(gc, [Math.cos(a) * 110, Math.sin(a) * 44 + 10]); f.part(ell(q, 22, 14, a, 10), { fill: mix(P.bone, P.grey, 0.35), shadow: P.greyS, shade: 0.45, inkW: 1, inkHeavy: 1.4, maxShade: 8, tex: 'weave' + seed, texOp: 0.4 }); f.line([add(q, rot([-14, 0], a)), add(q, rot([14, 0], a))], 1, P.greyS, { op: 0.6 }); }
    const gl = X.lumpy(f, [add(gc, [-104, -10]), add(gc, [-70, -54]), add(gc, [-10, -70]), add(gc, [60, -64]), add(gc, [108, -30]), add(gc, [118, 18]), add(gc, [80, 56]), add(gc, [10, 68]), add(gc, [-60, 56]), add(gc, [-110, 26])], 12);
    X.hostShadow(f, gl, 14, 0.55);
    const gd = f.part(gl, X.FL(f, mix(P.pinkD, P.skin, 0.3), { maxShade: 34, shade: 0.5, texOp: 0.4 }));
    clipDraw(f, gd, () => { softTone(f, gd, [[ell(add(gc, mul(f.L, 40)), 60, 30, 0, 12), P.pinkL, 0.65, 16], [ell(add(gc, mul(f.L, -60)), 100, 40, 0, 12), P.pinkS, 0.75, 18]]); for (let i = -3; i <= 3; i++) X.crease(f, [add(gc, [i * 30 - 6, -60]), add(gc, [i * 32, -10]), add(gc, [i * 30 + 6, 50])], 3.4, { col: P.pinkS, lit: P.pinkL, op: 0.6 }); X.mould(f, add(gc, [-50, 20]), 22, 14, { col: P.lilac, op: 0.6 }); X.mould(f, add(gc, [70, 30]), 18, 12, { col: P.yel, op: 0.6 }); stains(f, gd, E.bbox(gl), P.pinkS, 0.04, 3, -1.4, 89, 0.6); });
    X.pustules(f, add(gc, [40, -20]), 30, 20, 5, 4, 8, { col: P.pinkL });
    X.spores(f, add(gc, [0, -90]), 70, 20, 8); }
  // the head: long, rubbery, the chin lifted, the grin pulled too wide, painted eyebrows, a lilac bloom on one cheek
  headW(f, HC, H, hA, { skin, jaw: 1.1, chin: 0.06, nose: 1.15, hook: 0.1, mouth: 'set', squint: 0.25, browDown: -0.04, faceShade: 0.75, faceHatch: false, jawShade: 0.3, lashes: true, iris: '#4a4250', eyeWhite: '#d6cec4', hairCol: '#2a2428', browCol: '#1a1416', browW: 0.03,
    hairBack: [[-0.42, 0.24], [-0.5, -0.06], [-0.4, -0.3], [-0.2, -0.36], [-0.12, -0.1], [-0.3, 0.32]] });
  { // the too-wide grin: the mouth's corners dragged back toward the ears, a row of teeth, deep creases bracketing it
    const m0 = hF([[0.32, 0.26]])[0], m1 = hF([[-0.04, 0.2]])[0], mm = hF([[0.16, 0.3]])[0];
    f.flat([m0, mm, m1, hF([[0.02, 0.24]])[0], hF([[0.16, 0.36]])[0], hF([[0.3, 0.31]])[0]], '#1a1014');
    f.flat([m0, mm, m1, hF([[0.04, 0.225]])[0], hF([[0.16, 0.315]])[0], hF([[0.3, 0.285]])[0]], mix(P.bone, P.yelD, 0.3));
    for (let i = 1; i < 7; i++) f.line([lerp(m1, m0, i / 7), add(lerp(m1, m0, i / 7), rot([0, 6], hA))], 1, INK, { op: 0.6 });
    f.stroke([m1, mm, m0], 3, INK); X.crease(f, hF([[-0.06, 0.1], [-0.08, 0.2], [-0.04, 0.3]]), 3, { col: P.skinS }); X.crease(f, hF([[0.34, 0.16], [0.38, 0.26], [0.34, 0.34]]), 2.4, { col: P.skinS }); }
  for (const [x0, x1] of [[0.04, 0.22], [0.26, 0.36]]) f.stroke(hF([[x0, -0.2], [(x0 + x1) / 2, -0.3], [x1, -0.21]]), H * 0.022, '#1a1416'); // painted brows, high and arched
  X.mould(f, hF([[0.06, 0.08]])[0], 18, 14, { col: P.lilac, op: 0.8 }); // the cheek blooming lilac
  { const fl = hF([[-0.3, -0.04]])[0]; f.line([fl, add(fl, [-14, 20])], 2, P.rot); X.bloom(f, add(fl, [-4, -4]), 14, mix(P.pinkD, P.loamB, 0.4), { sy: 0.6, n: 5, ang: 1 }); f.part([add(fl, [-6, 0]), add(fl, [-30, 26]), add(fl, [-22, 30]), add(fl, [-2, 8])], { fill: mix(P.pinkD, P.loamB, 0.5), shadow: P.loamD, shade: 0.4, inkW: 0.9, cast: false }); } // the wilted flower behind the ear
  // the three-pointed cap: a hood with three floppy points, their bells become pale-yellow puffballs that smoke spore
  f.bone('cap');
  const capB = hF([[-0.46, 0.18], [-0.5, -0.2], [-0.32, -0.48], [0.0, -0.56], [0.28, -0.46], [0.36, -0.3], [0.2, -0.32], [-0.06, -0.3], [-0.28, -0.14], [-0.3, 0.2]]);
  X.cutHoles(f, [[hF([[0.0, -0.44]])[0], 9]], () => { const cd = f.part(capB, MOT(PK)); clipDraw(f, cd, () => { motleyOn(capB, hF([[0, -0.3]])[0], hA + Math.PI / 2, 22); stains(f, cd, E.bbox(capB), P.loamD, 0.04, 3, -1.3, 87, 0.6); }); }, { shape: capB });
  f.part(hF([[-0.42, 0.12], [-0.34, -0.36], [0.0, -0.44], [0.28, -0.36], [0.3, -0.28], [0.0, -0.36], [-0.3, -0.26], [-0.34, 0.16]]).map(q => q), MOT(LI, { fill: mix(LI, '#000', 0.2), maxShade: 6, cast: false, inkW: 1.1 })); // the band round the brow
  const pointsOf = [['cap_1', hF([[0.2, -0.46]])[0], [[0.4, -0.7], [0.66, -0.66], [0.82, -0.44], [0.86, -0.22]], PK], ['cap_2', hF([[-0.04, -0.56]])[0], [[0.0, -0.92], [-0.12, -1.22], [-0.36, -1.32], [-0.52, -1.18]], LI], ['cap_3', hF([[-0.34, -0.42]])[0], [[-0.66, -0.56], [-0.92, -0.42], [-1.06, -0.16], [-1.08, 0.12]], PK]];
  for (const [bone, root, path, col] of pointsOf) {
    f.bone(bone);
    const C = spline([root, ...path.map(q => hF([q])[0])], 5), n = C.length, Wd = C.map((_, i) => 58 * Math.pow(1 - i / (n - 1), 0.8) + 8);
    const pd = f.part(ribbon(C, Wd), MOT(col, { maxShade: 14 }));
    clipDraw(f, pd, () => { motleyOn(ribbon(C, Wd), C[Math.round(n / 3)], ang(C[0], C[n - 1]), 20); for (let i = 2; i < n - 2; i += 4) { const d = E.norm(sub(C[i + 1], C[i - 1])), nn = [-d[1], d[0]]; X.fold(f, [add(C[i], mul(nn, -Wd[i] * 0.4)), add(C[i], mul(d, 6)), add(C[i], mul(nn, Wd[i] * 0.4))], 2, { dk: P.lilacS }); } });
    const tip = C[n - 1]; X.puffball(f, add(tip, [0, 12]), 22, { col: P.yel });
    X.puff(f, add(tip, [0, -18]), 26, { col: P.yelL, op: 0.24, specks: 6 });
  }

  // ---- near arm, the fist on the hip, elbow out: a dagged sleeve, an eye in the moss on it, the lady's ribbon at the wrist
  X.mArm(f, SN, EN, WN, [56, 46, 36], MOT(PK), { sfx: '_n', bare: false, build: 'lean' });
  f.bone('upperarm_n'); clipDraw(f, E.smooth(K.chain([SN, EN], [56, 46])), () => { motleyOn(K.chain([SN, EN], [60, 50]), SN, ang(SN, EN), 22); const q = lerp(SN, EN, 0.55); f.flat(X.lumpy(f, ell(q, 18, 14, 0.4, 10), 3), P.loamD); X.moss(f, ell(q, 12, 9, 0.4, 8), 5, { col: P.rot }); X.eye(f, q, 13, 0.4, { open: 0.6, lid: P.rotL, lidS: P.rotS }); });
  f.bone('forearm_n'); clipDraw(f, E.smooth(K.chain([EN, WN], [46, 36])), () => motleyOn(K.chain([EN, WN], [50, 40]), EN, ang(EN, WN), 22, 0.1));
  f.part(K.ragLimb(f, lerp(EN, WN, 0.55), lerp(EN, WN, 0.86), 50, 56, { depth: 14, teeth: 6 }), MOT(LI, { cast: false })); // the dagged cuff
  X.rope(f, [lp(EN, WN, 0.92, -20), lp(EN, WN, 0.94, 0), lp(EN, WN, 0.92, 20)], 4, P.pinkL, { lit: false }); f.part(ribbon(spline([lp(EN, WN, 0.94, 18), lp(EN, WN, 1.1, 40), lp(EN, WN, 1.3, 46)], 4), Array(30).fill(7)), MOT(P.pinkL, { maxShade: 3, inkW: 1 })); // the lady's ribbon, its tail hanging
  f.bone('hand_n');
  X.knuckleFist(f, add(WN, [6, 4]), ang(EN, WN) - 0.4, 26, skin, { tex: 'mottle' + seed, shadow: skinS });

  f.bone('root');
  X.loamGround(f, 380, 760, gy, { depth: 12, petals: 3 });
  return f;
}

// ------------------------------------------------------------------ THE GREEN LION (ruler 4.5)
// The great topiary at the garden gate: a yew hedge clipped into a lion rampant for the lady's pleasure. The rot gave it
// a mind. It has kept the shape and grown the teeth. It rears out of the stone planter it has split, up on its hind legs,
// the haunches still sunk in the root-ball, the far forepaw raised forward to strike, the near forepaw and the head run
// out of the frame top (only the lower jaw of the clipped head is in frame: a gaping square mouth lined with splintered
// stake teeth, moss hanging from it). Its weight goes down into the root-ball. Behind it the tail rises in an S to the
// clipped ball at its tip: the signature. Ruler 4.5: 2880 px tall, so the 1600 canvas crops it like a cathedral.
// Dense yew once clipped smooth, now shaggy and rotting: the clipped volumes still read (rounded haunch, columnar legs,
// the mane's great ball) but the needles stand out in tufts; whole sides have gone dead and black, furred with grey-lilac
// mould, the iron training frame it was clipped over showing through the dead patches; bracket fungus shelved along the
// flank; the mane bursting with pale-yellow puffballs that smoke spore; claws of thorny dead branches. The gardeners'
// work is still on it: a ladder leaning on the haunch, a pair of shears stuck in the flank, a rope harness snagged on the
// shoulder, a lead plant label on a wire, a gardener's body tangled in the near forearm's branches, a bird's nest of
// rotted twigs in the mane; the stone ball from the gatepost lies cracked at its feet; dead clippings heaped round the
// planter; roots spill over the split rim.
// Toxin: dead and rotting yew, grey-lilac mould, brackets, puffballs and spore. Void: clean round holes clipped right
// through the body (the ground shows through), eyes of every size opened in the foliage.
// Rig: root (planter, ground, ball, clippings) ; haunch > body > chest > jaw ; arm_n_1 > arm_n_2 (near foreleg, with the
// gardener) ; arm_f_1 > arm_f_2 ; tail_1 > tail_2 (the ball) ; leg_n, leg_f (haunch). Motion: idle the whole hedge
// creaking and swaying (haunch, body, chest; eyes swapped open/shut); attack a downward swipe of the near paw, thorn claws
// first (arm_n_1, arm_n_2).
function greenLion() {
  const seed = 1421, W = 1600, h = 1600;
  const f = new Fig(X.base(seed, h, { grimeY: 1300 })); X.texturesB(f);
  const gy = f.o.groundY;
  const YEW = { col: '#1d201c', dark: '#050605', light: '#43473f' }, DEADC = '#141412';
  const STONE = (o = {}) => Object.assign({ fill: mix(P.grey, P.loamD, 0.3), shadow: mix(P.greyS, P.loamD, 0.5), light: P.grey, shade: 0.42, tex: 'mottle' + seed, texOp: 0.8, maxShade: 30 }, o);
  const EYE = { lid: mix(YEW.col, P.lilacD, 0.35), lidS: YEW.dark, lashes: true };
  // (independent review) re-massed so the clipped yew reads as a lion at 2x and at sheet size: a round haunch in the
  // root-ball, a hind leg and paw on the rim, a torso that tucks at the belly and deepens to the chest, a great clipped
  // mane collar, a clipped lion head in front of it (brow, sockets, a squared muzzle, the gaping square mouth of stake
  // teeth) cropped only at the crown, both forepaws raised as clipped balls with toes and thorn claws.
  f.joint('haunch', [700, 1000]).joint('body', [820, 820], 'haunch').joint('chest', [1060, 560], 'body').joint('head', [1150, 330], 'chest').joint('jaw', [1250, 320], 'head');
  f.joint('arm_n_1', [1150, 600], 'chest').joint('arm_n_2', [1340, 500], 'arm_n_1').joint('arm_f_1', [1080, 600], 'chest').joint('arm_f_2', [1300, 640], 'arm_f_1');
  f.joint('tail_1', [540, 1000], 'haunch').joint('tail_2', [330, 700], 'tail_1').joint('leg_n', [820, 1040], 'haunch').joint('leg_f', [580, 1040], 'haunch');
  // a foliage mass with the iron frame showing through its dead patches; o.dead: polygons of dead black yew
  const mass = (outline, o = {}) => {
    const d = X.foliage(f, outline, Object.assign({ col: YEW.col, dark: YEW.dark, light: YEW.light, step: o.step ?? 30, dead: o.dead || [], sprigK: 1.4 }, o));
    if (o.frame) clipDraw(f, d, () => { for (const poly of (o.dead || [])) clipDraw(f, poly, () => o.frame()); });
    return d;
  };
  // the iron training frame: hoops and spines following a volume (seen where the yew has died back)
  const ironFrame = (c, rx, ry, a, n) => { for (let i = 0; i < n; i++) { const e = ell(c, rx * (1 - i * 0.12), ry, a, 28); f.line(e.slice(2, 16), 10, INK); f.line(e.slice(2, 16), 6.6, '#5e5856'); f.line(e.slice(3, 9).map(q => add(q, [1, -2])), 1.2, '#8a8682', { op: 0.6 }); } f.line([add(c, rot([0, -ry], a)), add(c, rot([0, ry], a))], 7, INK); f.line([add(c, rot([0, -ry], a)), add(c, rot([0, ry], a))], 4.6, '#4a4644'); for (let i = 0; i < 5; i++) f.flat(ell(add(c, rot([R(f, -rx, rx), R(f, -ry, ry)], a)), 6, 4, 0, 6), '#5a3e30', { op: 0.7 }); };
  const eyesIn = (list) => X.eyes(f, list.map(([c, s, a, o]) => [c, s * 1.6, a, o]), EYE);

  // a clipped paw: a rounded ball with three toe divisions and a dew pad, thorny dead-branch claws standing out of it
  const paw = (c, r, a, k = 0) => { mass(X.lumpy(f, ell(c, r, r * 0.82, a, 20), r * 0.08), { step: 22, sprigs: 30, maxShade: r * 0.3 });
    clipDraw(f, E.smooth(ell(c, r, r * 0.82, a, 20)), () => { softTone(f, E.smooth(ell(c, r, r * 0.82, a, 20)), [[ell(add(c, mul(f.L, r * 0.4)), r * 0.6, r * 0.4, a, 10), YEW.light, 0.45, r * 0.3], [ell(add(c, mul(f.L, -r * 0.6)), r * 0.8, r * 0.5, a, 10), YEW.dark, 0.6, r * 0.3]]); for (const t of [-0.35, 0, 0.35]) f.stroke([add(c, rot([r * 0.2, t * r * 1.2], a)), add(c, rot([r * 0.95, t * r * 0.9], a))], 7, YEW.dark, { op: 0.85 }); });
    for (const t of [-0.5, -0.17, 0.17, 0.5]) { const b0 = add(c, rot([r * 0.85, t * r * 1.3], a)); X.briar(f, [b0, add(b0, rot([r * 0.5, t * 10], a)), add(b0, rot([r * 0.8, r * 0.3], a + k))], 9, { col: '#1e1a18', thorns: 4, leaves: 0 }); } };

  // ---- behind: the tail rising in an S to the clipped ball; the far hind leg on the rim; the far foreleg striking low
  f.bone('tail_1');
  { const tc = spline([[580, 1010], [440, 980], [340, 880], [310, 760], [336, 670]], 6), tw = tc.map((_, i) => 100 - 44 * i / tc.length); mass(ribbon(tc, tw), { step: 24, maxShade: 18, sprigs: 40 }); }
  f.bone('tail_2');
  { const bc = [350, 570]; mass(X.lumpy(f, ell(bc, 112, 106, 0, 26), 10), { step: 26, sprigs: 70, dead: [[[280, 570], [330, 630], [300, 672], [250, 630]]], frame: () => ironFrame(bc, 104, 104, 0.3, 3) });
    clipDraw(f, E.smooth(ell(bc, 112, 106, 0, 26)), () => softTone(f, E.smooth(ell(bc, 112, 106, 0, 26)), [[ell(add(bc, [40, -46]), 60, 46, 0, 12), YEW.light, 0.45, 24], [ell(add(bc, [-50, 60]), 90, 50, 0, 12), YEW.dark, 0.6, 26]]));
    X.mould(f, add(bc, [-40, 40]), 34, 26, { col: mix(P.lilac, P.grey, 0.45), op: 0.75 }); eyesIn([[add(bc, [30, -10]), 26, 0.2, 0.6], [add(bc, [-20, -50]), 14, -0.3, 0.1]]); }
  f.bone('leg_f');
  mass([[520, 980], [640, 990], [640, 1120], [560, 1150], [500, 1120]], { step: 26, sprigs: 20 }); paw([560, 1120], 54, 0.1);
  f.bone('arm_f_1');
  mass(X.lumpy(f, (() => { const C = spline([[1060, 600], [1200, 640], [1320, 650]], 6); return ribbon(C, C.map((_, i) => 140 - 50 * i / C.length)); })(), 6), { step: 26, sprigs: 40, dead: [[[1180, 600], [1280, 610], [1290, 670], [1190, 680]]], frame: () => ironFrame([1230, 640], 90, 50, 0.1, 2) });
  f.bone('arm_f_2'); paw([1380, 650], 74, 0.05, 0.6);

  // ---- the body, rearing from the haunch to the chest: the back behind, the belly tucked, the chest deep
  f.bone('body');
  const bodyO = [[540, 960], [520, 840], [580, 700], [700, 540], [840, 420], [1000, 380], [1130, 470], [1150, 600], [1080, 700], [960, 780], [920, 880], [930, 990], [860, 1100], [680, 1120]];
  const deadB = [[[520, 940], [530, 820], [600, 680], [700, 560], [760, 560], [700, 700], [640, 840], [610, 960]], [[960, 790], [1040, 730], [1100, 680], [1060, 780], [990, 830]]];
  X.cutHoles(f, [[[780, 740], 42], [[960, 560], 28]], () => {
    mass(bodyO, { step: 30, sprigs: 90, dead: deadB, frame: () => { ironFrame([760, 780], 220, 300, 0.5, 4); } });
    clipDraw(f, E.smooth(bodyO), () => { softTone(f, E.smooth(bodyO), [[[[900, 380], [1150, 460], [1150, 640], [960, 560]], YEW.light, 0.4, 40], [[[520, 900], [700, 720], [760, 1120], [520, 1100]], YEW.dark, 0.55, 40], [[[930, 800], [1080, 720], [960, 1000], [900, 960]], YEW.dark, 0.6, 30]]); for (const [c, rx, ry] of [[[620, 820], 60, 40], [[1040, 760], 36, 26], [[880, 500], 36, 26]]) X.mould(f, c, rx, ry, { col: mix(P.lilac, P.grey, 0.45), op: 0.75 }); });
  }, { shape: bodyO });
  X.brackets(f, [[580, 760], [610, 860], [650, 960]], 7, Math.PI + 0.2, 44, 70, { side: true, cols: [mix(P.lilac, P.grey, 0.4), mix(P.yel, P.grey, 0.4), P.lilacD] });
  eyesIn([[[860, 640], 30, 0.3, 0.75], [[1010, 690], 16, -0.2, 0.2], [[700, 600], 12, 0.1, 0.9], [[900, 900], 22, 0.4, 0.05]]);
  { const sp = [700, 900], a = 2.7; for (const [da, l, w] of [[0, 250, 14], [0.18, 230, 13]]) { const e = add(sp, rot([l, 0], a + da)); f.part(ribbon(spline([sp, e], 6), spline([sp, e], 6).map((_, i, A) => w - 4 * i / A.length)), WOOD(f, { fill: P.loamBL })); } f.part(ell(sp, 13, 13, 0, 10), IRON(f)); f.rivet(sp, 5, P.greyL); for (const da of [-0.2, -0.05]) { const e = add(sp, rot([-60, 0], a + da)); f.part([add(sp, rot([0, -7], a + da)), add(e, rot([0, -2], a + da)), add(sp, rot([0, 7], a + da))], IRON(f, { fill: '#5a5858' })); } f.flat(ell(add(sp, [-20, 10]), 26, 12, 0.3, 10), '#5a3e30', { op: 0.5 }); } // the shears stuck in the flank

  // ---- the haunch: a great round clipped ham sunk in the root-ball, lit on its crown; the near hind leg and its paw on
  // the planter's rim
  f.bone('haunch');
  const haunch = X.lumpy(f, ell([700, 1010], 230, 190, -0.3, 30), 12);
  mass(haunch, { step: 30, sprigs: 80, dead: [[[480, 1060], [500, 960], [580, 900], [640, 940], [600, 1060], [540, 1160], [480, 1160]]], frame: () => ironFrame([700, 1010], 220, 170, -0.3, 3) });
  clipDraw(f, E.smooth(haunch), () => softTone(f, E.smooth(haunch), [[ell([790, 900], 150, 80, -0.3, 12), YEW.light, 0.45, 40], [ell([640, 1140], 220, 80, 0, 12), YEW.dark, 0.7, 40], [ell([900, 1060], 50, 120, 0.4, 12), YEW.dark, 0.5, 30]]));
  eyesIn([[[800, 980], 26, 0.2, 0.3], [[640, 1060], 14, -0.3, 0.8]]);
  f.bone('leg_n');
  mass(X.lumpy(f, (() => { const C = spline([[860, 1000], [920, 1070], [940, 1110]], 6); return ribbon(C, C.map((_, i) => 130 - 40 * i / C.length)); })(), 5), { step: 24, sprigs: 20 }); paw([960, 1124], 62, 0.05, 0.4);

  // ---- the mane (ruler pass): a ring of layered, clipped leaf pads round the face, not a column behind it. Three tiers
  // set on an ellipse round the face's centre (the ring seen at three-quarters, its front hidden by the face), outer tier
  // first and darkest, the inner tier last over it; each pad a clipped lens lying along the ring, lit on its top, dark
  // beneath, a black pocket under its lip where it overhangs the tier behind. Puffballs smoke spore from the pads; a bird's
  // nest of rotted twigs sits in the outer tier; a dead patch shows the iron frame; the rope harness is snagged over it.
  f.bone('chest');
  const MC = [1215, 205];
  { const back = X.lumpy(f, ell(MC, 310, 345, 0, 30), 14); mass(back, { step: 34, sprigs: 0, edge: false, maxShade: 40, tones: [[ell([1200, 480], 320, 140, 0, 12), YEW.dark, 0.7, 40]] }); } // the ring's dark bed, so no gap shows between pads
  const ringPad = (c, a, w, h2, tone, o2 = {}) => {
    const pts = X.lumpy(f, ell(c, w, h2, a, 18), h2 * 0.16);
    f.raw(`<path d="${E.smooth(pts.map(q => add(q, mul(f.L, -h2 * 0.55))))}" fill="#000" opacity="0.75" filter="url(#puff${seed})"/>`); // the pocket of shadow under its lip
    const col = mix(YEW.col, YEW.dark, tone), lit = mix(YEW.light, '#6a705e', 0.5 - tone * 0.5);
    const d = mass(pts, Object.assign({ step: 17, sprigs: 14, sprigK: 0.7, col, light: lit, maxShade: h2 * 0.55, tones: [[ell(add(c, mul(f.L, h2 * 0.45)), w * 0.8, h2 * 0.42, a, 12), lit, 0.6, h2 * 0.25], [ell(add(c, mul(f.L, -h2 * 0.5)), w * 0.9, h2 * 0.45, a, 12), YEW.dark, 0.75, h2 * 0.25]] }, o2));
    const up = mul(f.L, 1); f.line(ell(c, w * 0.92, h2 * 0.9, a, 18).filter(q => (q[0] - c[0]) * up[0] + (q[1] - c[1]) * up[1] > h2 * 0.2), 2, mix(lit, '#c8ccb8', 0.3), { op: 0.45 }); // the clipped top edge catching light
    return d;
  };
  const tiers = [[330, 370, 92, 56, 66, 336, 22, 0.45], [252, 286, 80, 50, 58, 324, 24, 0.22], [180, 206, 66, 42, 50, 300, 27, 0.0]];
  const padAt = [];
  tiers.forEach(([rx, ry, w, h2, t0, t1, dt, tone], ti) => { for (let th = t0 + (ti % 2) * dt * 0.5; th <= t1; th += dt) { const rr = th * Math.PI / 180, c = add(MC, [Math.cos(rr) * rx * R(f, 0.95, 1.05), Math.sin(rr) * ry * R(f, 0.95, 1.05)]);
    const dead = ti === 0 && th > 150 && th < 175;
    ringPad(c, rr + Math.PI / 2 + R(f, -0.15, 0.15), w * R(f, 0.88, 1.12), h2 * R(f, 0.85, 1.15), tone, dead ? { dead: [ell(c, w * 0.9, h2 * 0.8, rr + Math.PI / 2, 12)], frame: () => ironFrame(c, w * 0.9, h2 * 1.4, rr, 2) } : {});
    padAt.push([c, ti, th]); } });
  for (const [c, r] of [[padAt[2][0], 26], [padAt[5][0], 22], [padAt[13][0], 30], [padAt[16][0], 22], [padAt[24][0], 20], [padAt[8][0], 18]]) X.puffball(f, add(c, [R(f, -14, 14), -R(f, 6, 16)]), r, { col: P.yel });
  eyesIn([[add(padAt[11][0], [10, 4]), 26, 0.2, 0.8], [add(padAt[19][0], [0, 6]), 14, -0.3, 0.2], [add(padAt[4][0], [6, 2]), 12, 0.3, 0.0], [add(padAt[27][0], [4, 4]), 18, 0.4, 0.5]]);
  { const nc = add(padAt[9][0], [0, -24]); const nest = X.lumpy(f, ell(nc, 56, 28, 0.1, 16), 6); f.part(nest, { fill: P.loamB, shadow: P.loamD, shade: 0.45, maxShade: 10, tex: 'straw' + seed, texOp: 0.8, inkW: 1.4 }); for (let i = 0; i < 22; i++) { const a = R(f, 0, 6.3), q = add(nc, [Math.cos(a) * 52, Math.sin(a) * 24]); f.line([q, add(q, rot([R(f, 20, 40), 0], a + R(f, -1.2, 1.2)))], 1.6, f.r() > 0.5 ? P.loamBL : P.loamD); } f.flat(ell(add(nc, [0, -8]), 38, 11, 0.1, 12), '#0c0a08'); f.part(ell(add(nc, [10, -12]), 12, 9, 0, 10), X.FL(f, mix(P.bone, P.lilac, 0.3), { maxShade: 3 })); X.mould(f, add(nc, [-14, -10]), 14, 6, { col: P.lilac, op: 0.7, rings: 0 }); } // the bird's nest, a rotted egg
  X.rope(f, [[880, 500], [980, 560], [1100, 600], [1180, 560]], 9, P.loamBL); X.rope(f, [[1000, 560], [990, 680], [1010, 780]], 8, P.loamBL, { fray: true }); f.part(ell([980, 562], 14, 10, 0.3, 10), IRON(f)); // the rope harness, a ring

  // ---- the head (ruler pass): a clipped lion head carved stern, in front of the ring of the mane, its crown cropped by
  // the frame. Planes cut flat by the shears and lit hard: a straight overhanging brow shelf pressing down over deep
  // sockets (narrowed eyes), a long flat nose bridge lit along its top, the clipped block of the nose, the rounded cheek
  // and the whisker pads with a scalloped lip; the planes facing down go near black. The mouth is a dark hollow into the
  // hedge, its inner walls dim clumps receding into black, a few broken stakes and thorns for teeth, dark and crooked.
  f.bone('head');
  const LT = '#666c5c', LT2 = '#868c76';
  const headO = [[1080, -40], [1300, -50], [1404, 10], [1444, 100], [1492, 196], [1500, 262], [1476, 292], [1330, 300], [1250, 334], [1160, 344], [1096, 286], [1066, 150]];
  mass(headO, { step: 22, sprigs: 26, maxShade: 30, tones: [[[[1066, 200], [1220, 240], [1230, 350], [1080, 350]], YEW.dark, 0.7, 20]] });
  // the ear, clipped round, its hollow dark, half sunk in the mane
  mass(X.lumpy(f, ell([1118, 34], 52, 44, -0.4, 14), 5), { step: 16, sprigs: 12, light: LT }); f.raw(`<ellipse cx="1124" cy="44" rx="24" ry="18" fill="#020302" opacity="0.8" filter="url(#puff${seed})"/>`);
  // the cheek: a great clipped round under and behind the eye, lit on its crown, a dark crease where it meets the mane
  const chk = X.lumpy(f, ell([1222, 238], 112, 92, -0.15, 22), 6);
  f.raw(`<path d="${E.smooth(chk.map(q => add(q, mul(f.L, -16))))}" fill="#000" opacity="0.7" filter="url(#puff${seed})"/>`);
  mass(chk, { step: 18, sprigs: 20, light: LT, tones: [[ell([1250, 190], 90, 40, -0.15, 12), LT, 0.55, 14], [ell([1200, 300], 110, 40, -0.15, 12), YEW.dark, 0.8, 14]] });
  // the whisker pads: clipped rounds under the nose, lit tops, their lower lip scalloped (the flews) over the mouth
  for (const [c, rx, ry] of [[[1388, 262], 86, 40], [[1466, 258], 38, 32]]) { const wp = [...ell(c, rx, ry, 0.05, 20).filter(q => q[1] <= c[1] + 2)]; const sc = []; for (let i = 0; i <= 8; i++) { const x = c[0] + rx - i * rx * 2 / 8; sc.push([x, c[1] + ry * 0.7 + (i % 2 ? ry * 0.32 : 0)]); } const pts = X.lumpy(f, [...wp, ...sc], 2);
    f.raw(`<path d="${E.smooth(pts.map(q => add(q, [0, 10])))}" fill="#000" opacity="0.7" filter="url(#puff${seed})"/>`);
    mass(pts, { step: 14, sprigs: 10, light: LT, tones: [[ell(add(c, [6, -ry * 0.4]), rx * 0.8, ry * 0.4, 0, 12), LT2, 0.55, 8], [ell(add(c, [0, ry * 0.7]), rx, ry * 0.4, 0, 12), YEW.dark, 0.8, 8]] });
    for (let i = 0; i < 5; i++) f.flat(ell(add(c, [-rx * 0.5 + i * rx * 0.25, R(f, -4, 8)]), 3, 3, 0, 6), '#020302', { op: 0.7 }); } // the whisker pits
  // the nose bridge: one long flat plane cut by the shears, lit along its top; its side plane in shadow
  const br = [[1362, 108], [1432, 112], [1488, 198], [1478, 222], [1430, 214], [1384, 160]];
  mass(br, { step: 14, sprigs: 8, light: LT2, tones: [[[[1362, 100], [1440, 104], [1496, 196], [1470, 200], [1420, 130]], LT2, 0.75, 6], [[[1370, 150], [1420, 160], [1470, 224], [1420, 222]], YEW.dark, 0.6, 6]] });
  f.line([[1372, 108], [1434, 113], [1488, 196]], 2.2, mix(LT2, '#d0d4c0', 0.4), { op: 0.6 }); // the bridge's clipped edge
  // the nose: a clipped block, its top lit, nostrils as dark hollows
  f.part([[1446, 196], [1496, 204], [1502, 250], [1470, 260], [1448, 236]], { fill: mix(YEW.col, LT, 0.15), shadow: YEW.dark, light: LT, shade: 0.42, maxShade: 12, tex: 'yew' + seed, texOp: 0.8, inkW: 1.4, inkHeavy: 2.4 });
  f.line([[1462, 200], [1500, 205]], 2, mix(LT2, '#d0d4c0', 0.4), { op: 0.6 }); for (const c of [[1488, 240], [1466, 246]]) f.flat(ell(c, 9, 6, 0.2, 8), '#020302', { op: 0.9 });
  // the brow: a straight hard shelf overhanging the sockets, pressing down toward the nose (stern); its top plane lit,
  // its underside throwing a black shadow over the eyes; two furrows clipped between the brows
  const brow = [[1108, 96], [1250, 74], [1400, 92], [1438, 116], [1418, 140], [1330, 128], [1240, 140], [1150, 146], [1104, 128]];
  f.raw(`<path d="${E.smooth(brow.map(q => add(q, [0, 26])))}" fill="#000" opacity="0.85" filter="url(#puff${seed})"/>`);
  for (const [c, rx, ry] of [[[1282, 166], 52, 30], [[1396, 166], 26, 24]]) f.raw(`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}" fill="#000" opacity="0.9" filter="url(#puff${seed})"/>`); // the sockets, deep
  X.eyes(f, [[[1286, 170], 30, 0.12, 0.32], [[1398, 172], 17, 0.1, 0.28]], EYE); // narrowed under the brow
  mass(X.lumpy(f, brow, 4), { step: 14, sprigs: 18, light: LT2, tones: [[[[1108, 84], [1250, 64], [1404, 84], [1404, 110], [1250, 96], [1108, 116]], LT2, 0.8, 7], [[[1108, 130], [1250, 128], [1420, 134], [1420, 150], [1108, 150]], YEW.dark, 0.85, 6]] });
  f.line([[1110, 92], [1250, 70], [1402, 88], [1436, 112]], 2.4, mix(LT2, '#d0d4c0', 0.45), { op: 0.65 }); // the shelf's clipped top edge
  for (const x of [1406, 1420]) f.stroke([[x, 92], [x + 8, 122], [x + 6, 136]], 7, '#020302', { op: 0.8 }); // the frown's furrows
  for (let i = 0; i < 6; i++) { const q = [R(f, 1150, 1460), R(f, 20, 280)]; f.line([q, add(q, [R(f, 20, 40), R(f, -4, 4)])], 1, mix(LT2, '#d0d4c0', 0.3), { op: 0.3 }); } // shear cuts
  // the mouth: a dark hollow into the hedge. Its rim's inner walls are dim clumps of needles stepping back into black;
  // dead twigs cross the dark; the deepest corner is solid black
  const mouth = [[1296, 300], [1390, 292], [1498, 284], [1496, 322], [1480, 364], [1380, 352], [1302, 336]];
  f.flat(mouth, '#030403');
  clipDraw(f, mouth, () => {
    for (let i = 0; i < 26; i++) { const t = R(f, 0, 1), top = f.r() < 0.5, q = top ? [1300 + t * 196, 296 - t * 10 + R(f, 0, 14)] : [1304 + t * 180, 338 + t * 20 - R(f, 0, 14)], r = R(f, 8, 16) * (0.6 + t * 0.6); f.flat(X.lumpy(f, ell(q, r, r * 0.6, R(f, -0.5, 0.5), 8), r * 0.3), mix('#030403', YEW.col, 0.3 + t * 0.6), { op: 0.9 }); } // the inner walls, dim, receding
    f.raw(`<ellipse cx="1330" cy="318" rx="60" ry="22" fill="#000" opacity="0.9" filter="url(#puff${seed})"/>`); // the deep throat
    for (let i = 0; i < 4; i++) { const q = [R(f, 1320, 1460), R(f, 300, 340)]; f.line([q, add(q, rot([R(f, 30, 60), 0], R(f, -0.6, 0.6)))], 1.6, '#2a2622', { op: 0.85 }); } // dead twigs across the dark
  });
  // the teeth: a few broken stakes, dark weathered wood, crooked, splintered; thorns curling down beside them
  const stake = (b0, a, l, w, o2 = {}) => { const F2 = frame(b0, a, 1), tip = [l, R(f, -w * 0.3, w * 0.3)], pts = F2([[-w * 0.4, -w * 0.5, 1], [l * 0.3, -w * 0.52], [l * 0.7, -w * 0.4], [l * 0.86, -w * 0.12, 1], [...tip, 1], [l * 0.8, w * 0.16, 1], [l * 0.9, w * 0.36, 1], [l * 0.62, w * 0.48], [l * 0.3, w * 0.55], [-w * 0.4, w * 0.5, 1], [-w * 0.2, 0, 1]]);
    f.part(pts, { fill: '#2c2520', shadow: '#0a0807', light: '#5e564e', shade: 0.42, maxShade: w * 0.45, tex: 'grain' + seed, texOp: 0.6, inkW: 1.2, inkHeavy: 2, cast: true, castOp: 0.4, k: 0.6 });
    f.raw(`<ellipse cx="${b0[0].toFixed(1)}" cy="${b0[1].toFixed(1)}" rx="${(w * 0.9).toFixed(1)}" ry="${(w * 0.9).toFixed(1)}" fill="#020302" opacity="0.75" filter="url(#puff${seed})"/>`); // its root sunk in the dark of the hedge
    f.line(F2([[l * 0.1, -w * 0.28], [l * 0.72, -w * 0.22]]), 1.2, '#7a7266', { op: 0.55 }); f.line(F2([[l * 0.2, w * 0.1], [l * 0.75, w * 0.05]]), 1, INK, { op: 0.6 }); }; // the lit split edge, a crack
  stake([1356, 292], 1.45, 46, 18); stake([1424, 288], 1.72, 64, 20); stake([1470, 288], 1.3, 28, 14);
  X.briar(f, [[1386, 290], [1394, 316], [1384, 338]], 6, { col: '#1e1a18', thorns: 3, leaves: 0, cast: true });
  X.briar(f, [[1450, 290], [1462, 318], [1474, 330]], 5, { col: '#1e1a18', thorns: 3, leaves: 0, cast: true });
  f.bone('jaw');
  { // the lower jaw: a squared clipped block dropped open; its top (the floor of the mouth) dark, its front face lit
    // dimly, its underside near black; a crooked stake and a broken stub rising from it, thorns along its rim; moss hanging
    const jw = [[1236, 334], [1310, 340], [1472, 362], [1488, 378], [1466, 414], [1400, 428], [1290, 424], [1214, 392]];
    mass(jw, { step: 16, sprigs: 26, light: LT, dead: [[[1380, 392], [1460, 380], [1452, 418], [1392, 422]]], tones: [[[[1300, 336], [1480, 360], [1480, 376], [1300, 356]], '#020302', 0.85, 5], [[[1220, 400], [1470, 410], [1470, 440], [1220, 440]], YEW.dark, 0.8, 8], [[[1440, 370], [1490, 378], [1470, 410], [1440, 404]], LT, 0.45, 8]] });
    stake([1392, 354], -1.75, 52, 18); stake([1446, 362], -1.5, 26, 14); stake([1340, 348], -1.95, 22, 12);
    X.briar(f, [[1300, 346], [1360, 350], [1420, 360], [1470, 366]], 5, { col: '#1e1a18', thorns: 6, leaves: 0, cast: true });
    for (let i = 0; i < 6; i++) { const r0 = [1270 + i * 36, 420], l = R(f, 50, 120); X.hairClump(f, [r0, add(r0, [R(f, -6, 6), l * 0.5]), add(r0, [R(f, -10, 10), l])], R(f, 8, 14), { pal: [P.rotD, P.rot, mix(P.rot, P.lilacD, 0.3)], n: 2 }); } } // moss hanging from the jaw

  // ---- the near foreleg raised high to strike, a gardener's body tangled in its branches
  f.bone('arm_n_1');
  mass(X.lumpy(f, ribbon(spline([[1120, 640], [1240, 600], [1350, 520]], 6), Array(80).fill(0).map((_, i) => 170 - i * 0.5)), 8), { step: 26, sprigs: 40, dead: [[[1200, 560], [1300, 520], [1330, 580], [1230, 630]]], frame: () => ironFrame([1260, 570], 120, 60, -0.5, 2) });
  eyesIn([[[1200, 640], 16, -0.6, 0.6]]);
  f.bone('arm_n_2');
  mass(X.lumpy(f, ribbon(spline([[1330, 530], [1420, 440], [1490, 350]], 6), Array(80).fill(0).map((_, i) => 140 - i * 0.4)), 8), { step: 24, sprigs: 40 });
  paw([1520, 330], 78, -0.9, -0.5);
  { const g0 = [1500, 470];
    for (let i = 0; i < 5; i++) X.briar(f, [add(g0, [R(f, -60, 40), R(f, -60, 0)]), add(g0, [R(f, -20, 60), R(f, 40, 120)]), add(g0, [R(f, -40, 80), R(f, 160, 260)])], 7, { col: '#1e1a18', thorns: 4, leaves: 0 });
    const torso = [add(g0, [-40, -20]), add(g0, [40, -30]), add(g0, [56, 60]), add(g0, [30, 170]), add(g0, [-30, 170]), add(g0, [-50, 60])];
    f.part(torso, LINEN(f, { fill: mix(P.grey, P.loamB, 0.3), maxShade: 16 }));
    X.fold(f, [add(g0, [-20, 0]), add(g0, [-10, 80]), add(g0, [-16, 160])], 2.6, { dk: P.greyS });
    const hd = add(g0, [8, 210]); f.part(X.lumpy(f, ell(hd, 34, 42, 0.1, 14), 3), SKIN(f, { fill: mix(P.skin, P.grey, 0.4), maxShade: 10 })); f.flat(ell(add(hd, [10, 6]), 6, 4, 0, 6), '#1a1214'); f.line([add(hd, [16, 22]), add(hd, [24, 20])], 2, INK); X.mould(f, add(hd, [-6, -10]), 14, 12, { col: mix(P.lilac, P.grey, 0.3), op: 0.7 }); // the head hanging, face slack
    for (const [dx, sg] of [[-34, -1], [40, 1]]) { const s0 = add(g0, [dx, 40]); f.part(K.chain([s0, add(s0, [sg * 20, 110]), add(s0, [sg * 30, 200])], [34, 28, 22]), LINEN(f, { fill: mix(P.grey, P.loamB, 0.35) })); X.openHand(f, add(s0, [sg * 30, 200]), Math.PI / 2 + sg * 0.2, 46, { look: SKIN(f, { fill: mix(P.skin, P.grey, 0.4) }), back: true, curl: 0.4 }); } // the arms hanging
    for (const [dx, a] of [[-24, -1.3], [20, -1.0]]) { const s0 = add(g0, [dx, -10]), e = add(s0, rot([120, 0], a)); f.part(K.chain([s0, lerp(s0, e, 0.5), e], [44, 36, 30]), LEATH(f, { fill: mix(P.loam, P.loamB, 0.4) })); B.boot(f, e, -1, 40, '#2a221c', { groundY: e[1] + 40 }); } // the legs trailing up over the branch
    X.rope(f, [add(g0, [-50, 30]), add(g0, [-80, 60]), add(g0, [-70, 120])], 4, P.loamB, { fray: true }); }

  // ---- the planter in front: split open, the near half pushed out, roots spilling over the rim; the label on a wire
  f.bone('root');
  const pl = { x0: 360, x1: 1210, top: 1150, rim: 46 };
  const lh = [[pl.x0, pl.top + 10], [800, pl.top + 4], [790, 1300], [820, 1420], [800, gy], [pl.x0, gy]].map(q => [...q, 1]); // the left half, standing
  const rh = [[850, pl.top + 22], [pl.x1 + 20, pl.top + 40], [pl.x1 + 30, gy], [840, gy], [860, 1430], [830, 1310]].map(q => [...q, 1]); // the right half, pushed out and leaning
  for (const [ph, tone] of [[lh, 0], [rh, 0.12]]) { const pd = f.part(ph, STONE({ fill: mix(mix(P.grey, P.bone, 0.15), '#000', tone) })); clipDraw(f, pd, () => { softTone(f, pd, [[[[pl.x0, pl.top], [pl.x1 + 40, pl.top], [pl.x1 + 40, pl.top + 60], [pl.x0, pl.top + 60]], P.boneL, 0.4, 14], [[[pl.x0, 1450], [pl.x1 + 40, 1450], [pl.x1 + 40, gy], [pl.x0, gy]], P.loamD, 0.6, 20]]); stains(f, pd, E.bbox(ph), P.loamD, 0.012, 2.8, -1.4, Math.round(tone * 100) + 91, 0.7); for (let i = 0; i < 4; i++) { const y = 1230 + i * 80; f.line([[pl.x0 + 10, y], [pl.x1 + 20, y + 10]], 1.4, mix(P.greyS, P.loamD, 0.4), { op: 0.6 }); } for (const [x0, x1] of [[pl.x0 + 40, 760], [880, pl.x1 - 10]]) { const pn = [[x0, 1230], [x1, 1234], [x1, 1480], [x0, 1476]]; f.line([...pn, pn[0]], 8, mix(P.greyS, P.loamD, 0.5), { op: 0.7 }); f.line([...pn, pn[0]].map(q => add(q, [3, -3])), 2, P.greyL, { op: 0.5 }); const sw = spline([[x0 + 30, 1260], [(x0 + x1) / 2, 1350], [x1 - 30, 1260]], 4); f.stroke(sw, 26, mix(P.grey, P.loamD, 0.2), { op: 0.9 }); f.line(sw.map(q => add(q, [0, -8])), 2, P.greyL, { op: 0.5 }); f.line(sw.map(q => add(q, [0, 10])), 2.4, INK, { op: 0.5 }); } for (let i = 0; i < 18; i++) f.flat(ell([R(f, pl.x0, pl.x1), R(f, pl.top, gy)], R(f, 4, 10), R(f, 3, 7), 0, 7), mix(P.yelD, P.grey, 0.4), { op: 0.55 }); X.moss(f, [[pl.x0, 1520], [600, 1530], [800, 1540]], 12, { col: P.rot }); }); }
  f.part([[pl.x0 - 20, pl.top - 20], [800, pl.top - 26], [800, pl.top + 16], [pl.x0 - 20, pl.top + 20]].map(q => [...q, 1]), STONE({ fill: mix(P.grey, P.bone, 0.3), maxShade: 8 })); // the rim's lip, left
  f.part([[850, pl.top - 6], [pl.x1 + 40, pl.top + 16], [pl.x1 + 40, pl.top + 56], [850, pl.top + 30]].map(q => [...q, 1]), STONE({ fill: mix(P.grey, P.bone, 0.25), maxShade: 8 })); // the rim's lip, right, tilted
  f.flat([[800, pl.top - 20], [850, pl.top - 6], [840, 1330], [870, 1440], [846, gy], [800, gy], [820, 1420], [790, 1300]], '#0a0808'); // the split, dark
  for (let i = 0; i < 6; i++) X.root(f, [[820 + R(f, -10, 10), pl.top + i * 60], [820 + R(f, -20, 20), pl.top + i * 60 + 40], [820 + R(f, -60, 60), pl.top + i * 60 + R(f, 80, 140)]], R(f, 10, 20), 3, { rootlets: 2 }); // roots through the split
  for (let i = 0; i < 7; i++) { const x = 420 + i * 112 + R(f, -30, 30); X.root(f, [[x, pl.top - 30], [x + R(f, -30, 30), pl.top - 4], [x + R(f, -50, 50), pl.top + R(f, 60, 120)], [x + R(f, -60, 60), pl.top + R(f, 150, 300)]], R(f, 20, 36), 4, { rootlets: 3, cast: true }); } // roots spilling over the rim and down the planter
  X.leadLabel(f, [560, pl.top - 18], 70, 46, -0.1, { wire: 40, lines: 3 });

  // ---- the ladder leaning on the haunch, the stone ball cracked at its feet, dead clippings heaped round the planter
  { const a0 = [1300, gy], a1 = [1010, 960], d = E.norm(sub(a1, a0)), n = [-d[1], d[0]];
    for (const sg of [-1, 1]) { const b0 = add(a0, mul(n, sg * 50)), b1 = add(a1, mul(n, sg * 40)); f.part(ribbon(spline([b0, b1], 8), spline([b0, b1], 8).map(() => 18)), WOOD(f, { inkW: 1.4 })); }
    for (let t = 0.1; t < 0.95; t += 0.13) { const c = lerp(a0, a1, t); f.part(ribbon([add(c, mul(n, -50 + t * 10)), add(c, mul(n, 50 - t * 10))], [12, 12]), WOOD(f, { fill: mix(P.loamBL, '#000', 0.15), cast: true, castOp: 0.35 })); }
    X.mould(f, lerp(a0, a1, 0.7), 16, 10, { col: mix(P.lilac, P.grey, 0.4), op: 0.7 }); }
  { const bc = [190, gy - 86]; const bd = f.part(X.lumpy(f, ell(bc, 96, 90, 0, 26), 5), STONE({ fill: mix(P.grey, P.bone, 0.25), maxShade: 40 })); clipDraw(f, bd, () => { softTone(f, bd, [[ell(add(bc, [36, -40]), 40, 30, 0, 10), P.boneL, 0.5, 18]]); stains(f, bd, [80, gy - 190, 300, gy], P.loamD, 0.02, 2.8, -1.4, 93, 0.6); X.moss(f, [add(bc, [-80, 40]), add(bc, [-40, 80]), add(bc, [20, 88])], 10, { col: P.rot }); }); f.stroke([add(bc, [-20, -86]), add(bc, [0, -30]), add(bc, [-10, 20]), add(bc, [10, 86])], 7, '#0a0808'); f.flat(ell([bc[0], gy], 110, 10, 0, 16), P.loamD, { op: 0.5 }); } // the stone ball from the gatepost, cracked
  for (const [x0, x1] of [[60, 380], [1180, 1600]]) for (let i = 0; i < 26; i++) { const p = [R(f, x0, x1), gy - R(f, 0, 30)], a = R(f, -2.8, -0.3), l = R(f, 30, 70), e = add(p, rot([l, 0], a)); f.line([p, lerp(p, e, 0.5), e], R(f, 2, 3.5), f.r() > 0.5 ? '#3a3632' : '#1a1a16'); for (let k = 0; k < 3; k++) { const m = lerp(p, e, 0.3 + k * 0.25); f.line([m, add(m, rot([10, 0], a + 0.8))], 1, '#4a4640'); } } // dead clippings heaped
  X.loamGround(f, 0, 1600, gy, { depth: 20, petals: 4 });
  return f;
}

// ------------------------------------------------------------------ THE LADY OF THE BOWER (ruler 3)
// The fey lady whose garden it was. She lay down in her rose bower to wait for spring; it came, and it has not stopped
// coming. She is half-reclined across the back ranks on a bed of rotting blooms, propped on her near elbow, her weight
// going down through it into the bed; her far arm is raised over her head (the upper arm and the bower's arch run out of
// the frame top) and its hand hangs lifted before her face, palm up, a clean round hole through it: her attack is to
// blow across that palm. Her near forearm lies along the bed and its hand hangs over the edge holding a hand mirror
// fogged with mould. Below the waist she has become the bed: gown, flowers and flesh one mat of bloom and rot, her train
// spreading out of the frame (left in drawing, right after the flip). A vast, slender, long-limbed woman, about 3.6
// humans standing (head 300 px): skin pale and blotched with mould bloom, soft pustules along the collarbone and the
// propping arm, pale-yellow bracket fungus fruiting from the hip and thigh. A long, lovely face, one cheek swollen under a
// soft bloom of mould, heavy-lidded eyes half closed, a dreamy smile; her hair a black mass knotted with flowers, spread
// over the cushions and grown with moss; a circlet of white flowers browned at every edge.
// The bower: an arch of woven willow canes grown over with rotting pink and lilac roses, the canes split and furred with
// mould. The rest: her lilac velvet gown rotted into the moss; a girdle of linked pale stones; rings sunk into swollen
// fingers; a lute dropped beside her and grown through with fungus; a spilled cup; cushions split and bursting with spore;
// a book of hours swollen to twice its size; fallen petals heaped in drifts at the bed's foot; eyes opened in the blooms
// all over the bed and the bower.
// Toxin: rot, bloom and mould (roses rotting on the canes, the bed's mat), the hip brackets (oyster shelves, pale yellow),
// pustules, spore. Void: the clean hole through the raised palm; eyes in the blooms (and a hole through the lute's body).
// Rig: root (bower, bed, props) ; pelvis (at the hip, sunk in the bed) > torso > head > hair ; upperarm_n > forearm_n >
// hand_n > mirror ; upperarm_f > forearm_f > hand_f. Motion: idle a slow sigh that lifts a cloud of pollen from the bed
// (torso, head; eye sprites open after it); attack lifting the hand and blowing across the palm (forearm_f, hand_f, head).
function ladyOfTheBower() {
  const seed = 1420, W = 1600, h = 1600;
  const f = new Fig(X.base(seed, h, { grimeY: 1400 })); X.texturesB(f);
  const H = 300, gy = f.o.groundY;
  const skin = mix(P.bone, P.skin, 0.45), skinS = mix(P.skinS, P.lilacS, 0.3);
  const SK = (o = {}) => SKIN(f, Object.assign({ fill: skin, shadow: skinS, maxShade: 30 }, o));
  const VEL = (o = {}) => Object.assign({ fill: mix(P.lilacD, P.loamD, 0.25), shadow: P.lilacS, light: P.lilac, shade: 0.45, tex: 'mfur' + seed, texOp: 0.5, maxShade: 30 }, o);
  const CANE = (o = {}) => Object.assign({ fill: mix(P.loamBL, P.grey, 0.35), shadow: P.loamD, light: P.greyL, shade: 0.42, tex: 'grain' + seed, texOp: 0.6, inkW: 1.3, inkHeavy: 2.2 }, o);
  const Pv = [460, 1220], N0 = [952, 590];
  const S = B.spine(N0, [700, 860], Pv, H * 0.9);
  const HC = [1086, 452], hA = 0.42;
  const SN = [976, 640], EN = [1110, 1064], WN = [1392, 1112];
  const SF = [860, 520], EF = [990, 60], WF = [1262, 330];
  f.joint('pelvis', Pv).joint('torso', S.at(0, 0.7), 'pelvis').joint('head', S.at(0.1, -0.02), 'torso').joint('hair', add(HC, [-60, -40]), 'head');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('mirror', add(WN, [20, 120]), 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  // (ruler pass) a real rose: guard petals, a middle ring and a cup round a spiralled heart, dark gaps, browned and torn petals
  const roseAt = (c, r, col, x = {}) => X.rose2(f, c, r, col, Object.assign({ tilt: R(f, -0.35, 0.35) }, x));
  const eyeBloom = (c, s, a, op) => { X.rose2(f, add(c, [0, s * 0.25]), s * 1.45, mix(P.pinkD, P.loamB, 0.25), { noHeart: true, tilt: R(f, -0.3, 0.3) }); X.eye(f, add(c, [0, -s * 0.12]), s * 0.85, a, { open: op, lid: P.pink, lidS: P.pinkS, lashes: true }); }; // (ruler pass) the eye opens in the heart of a real rose

  // ---- the bower behind: two posts of woven willow canes curving up into the arch (out of the frame), roses rotting on
  // the canes, the canes split and furred with mould
  f.bone('root');
  const canesAlong = (pts, n, w) => { for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * w * 0.55, ph = i * 1.7; const C = spline(pts, 8).map((q, k, A) => { const d = E.norm(sub(A[Math.min(A.length - 1, k + 1)], A[Math.max(0, k - 1)])), nn = [-d[1], d[0]]; return add(q, mul(nn, off + Math.sin(k * 0.12 + ph) * w * 0.35)); }); f.part(ribbon(C, C.map(() => w * 0.42)), CANE({ fill: mix(CANE().fill, '#000', (i % 3) * 0.12) })); f.line(C.slice(1, -1).map(q => add(q, mul(f.L, 1.5))), 1.2, P.greyL, { op: 0.4 }); } };
  const postL = [[110, gy], [96, 1100], [120, 700], [200, 320], [330, 40], [420, -60]], postR = [[1500, gy], [1520, 1100], [1500, 700], [1440, 360], [1360, 80], [1300, -60]];
  canesAlong(postL, 5, 44); canesAlong(postR, 5, 44);
  for (const pts of [postL, postR]) { const C = spline(pts, 30); C.forEach((q, i) => { if (i % 2) return; X.mould(f, add(q, [R(f, -20, 20), 0]), R(f, 12, 24), R(f, 10, 18), { col: mix(P.lilac, P.grey, 0.45), op: 0.7 }); }); for (let i = 1; i < C.length - 1; i += 3) X.leaf(f, add(C[i], [R(f, -20, 20), R(f, -10, 10)]), R(f, 0, 6.3), R(f, 26, 40), { col: mix(P.rot, P.loamB, 0.3) }); for (let i = 0; i < C.length; i += 2) roseAt(add(C[i], [R(f, -30, 30), R(f, -10, 10)]), R(f, 20, 34), [P.pinkD, P.pink, P.lilac, mix(P.pink, P.loamB, 0.4)][i % 4]); for (let i = 2; i < C.length; i += 4) eyeBloom(add(C[i], [R(f, -20, 20), 20]), R(f, 22, 34), R(f, -0.4, 0.4), [0.7, 0.2, 0.9, 0.05][i % 4]); }
  // canes hanging from the arch, broken, a few roses on them
  for (const x of [300, 520, 1300]) { const C = spline([[x, -10], [x + 20, 160], [x - 10, 320]], 6); f.part(ribbon(C, C.map((_, i) => 12 - i * 0.2)), CANE()); roseAt(C[C.length - 1], 18, P.pinkD); }
  // the split canes: their wood opened, mould in the splits
  for (const q of [[130, 900], [180, 520], [1490, 820], [1440, 420]]) { X.rotSplit(f, [add(q, [0, -40]), q, add(q, [6, 40])], 4, { inner: P.loamD, edge: P.greyL }); X.fungalFur(f, [add(q, [0, -40]), add(q, [6, 40])], 8, 1); }

  // ---- the bed behind her: split cushions bursting with spore, velvet heaped
  const cush = (c, rx, ry, a, col) => { const cp = X.lumpy(f, ell(c, rx, ry, a, 24), Math.min(rx, ry) * 0.1); const cd = f.part(cp, VEL({ fill: col, maxShade: ry * 0.5 })); clipDraw(f, cd, () => { softTone(f, cd, [[ell(add(c, mul(f.L, ry * 0.4)), rx * 0.6, ry * 0.4, a, 12), mix(col, '#fff', 0.25), 0.5, ry * 0.3]]); for (let i = 0; i < 4; i++) X.fold(f, [add(c, rot([-rx * 0.6 + i * rx * 0.4, -ry * 0.6], a)), add(c, rot([-rx * 0.5 + i * rx * 0.4, 0], a)), add(c, rot([-rx * 0.6 + i * rx * 0.4, ry * 0.5], a))], 3, { dk: P.lilacS, lt: P.lilacL }); stains(f, cd, E.bbox(cp), P.loamD, 0.02, 3, -1.4, Math.round(c[0]) % 89, 0.6); }); const sp = add(c, rot([rx * 0.3, -ry * 0.5], a)); X.rotSplit(f, [add(sp, [-30, 0]), sp, add(sp, [30, 6])], 6, { inner: P.loamD, edge: mix(P.yel, P.bone, 0.4) }); X.puff(f, add(sp, [0, -30]), 40, { col: P.yelL, op: 0.26, specks: 10 }); for (let i = 0; i < 4; i++) f.flat(ell(add(sp, [R(f, -40, 40), R(f, -60, 0)]), R(f, 3, 7), R(f, 2, 4), 0, 6), mix(P.bone, P.yel, 0.4), { op: 0.8 }); }; // the stuffing
  cush([1180, 1000], 220, 120, -0.1, mix(P.pinkD, P.loamD, 0.25)); cush([820, 880], 200, 130, -0.4, mix(P.lilacD, P.loamD, 0.15)); cush([560, 1000], 180, 110, -0.3, mix(P.pinkD, P.lilacD, 0.5));

  // ---- the far arm raised: the upper arm up to the frame top, the forearm coming down, the hand lifted before her face
  // (ruler pass) modelled, not a tube: the deltoid's cap standing off the shoulder, the biceps toward her face and the
  // triceps behind, narrowing above the elbow, the elbow's bony point rounding the top of the bend with the crook's fold
  // under it, the forearm swelling below the elbow and tapering hard to a slim wrist. Value: a lit plane toward the key
  // light, a hard core shadow on the far side with a warm terminator and reflected light at the edge. The sleeve slid down
  // to the shoulder is velvet with weight: soft rolls bunched round the arm, the lining showing at its mouth, and a short
  // hanging lip falling plumb from its underside in folds to a rotted, dagged edge.
  // (ruler pass) a bare arm modelled to the Drowned King's bar, for both arms. Offsets k > 0 are always the inside of the
  // bend (biceps, crook, flexors); in both of her poses that side faces the key light. The outline runs the limb's S
  // rhythm (deltoid cap; biceps high on the inside against the triceps low on the outside; the elbow's bony knob rounding
  // the bend; the forearm's extensors high on the outside against the flexors lower inside; a hard taper to a slim
  // wrist). Value: lit planes inside, a hard-edged cool core shadow outside with a warm terminator, reflected light at
  // the very edge, hatching in the core. sc scales the widths (the near arm is nearer, so larger).
  const modelArm = (SA, EA, WA, sfx, sc, o2 = {}) => {
    const dU = E.norm(sub(EA, SA)), dF = E.norm(sub(WA, EA)), nU0 = [-dU[1], dU[0]], nF0 = [-dF[1], dF[0]];
    const sU = Math.sign((WA[0] - EA[0]) * nU0[0] + (WA[1] - EA[1]) * nU0[1]) || 1, sF = Math.sign((SA[0] - EA[0]) * nF0[0] + (SA[1] - EA[1]) * nF0[1]) || 1;
    const nU = mul(nU0, sU), nF = mul(nF0, sF);
    const U = (t, k) => add(lerp(SA, EA, t), mul(nU, k * sc)), Fa = (t, k) => add(lerp(EA, WA, t), mul(nF, k * sc));
    const bis = E.norm(add(mul(nU, -1), mul(nF, -1))); // the outside of the bend
    const kn = t => add(EA, mul(E.norm(lerp(mul(nU, -1), mul(nF, -1), t)), (40 + 6 * Math.sin(Math.PI * t)) * sc)); // round the elbow's knob, from the upper arm's outside to the forearm's
    const arm = [U(-0.12, -62), U(0.0, -80), U(0.1, -84), U(0.22, -72), U(0.34, -50), U(0.46, -44), U(0.6, -50), U(0.74, -54), U(0.86, -46), U(0.94, -38), kn(0.2), kn(0.5), kn(0.8), Fa(0.06, -48), Fa(0.15, -58), Fa(0.26, -58), Fa(0.42, -46), Fa(0.62, -34), Fa(0.8, -26), Fa(0.92, -22), Fa(1.03, -23),
      Fa(1.03, 23), Fa(0.9, 23), Fa(0.72, 28), Fa(0.5, 40), Fa(0.34, 48), Fa(0.2, 48), Fa(0.1, 44), add(EA, mul(E.norm(add(nU, nF)), 24 * sc)), U(0.88, 36), U(0.78, 46), U(0.64, 58), U(0.48, 58), U(0.34, 46), U(0.2, 52), U(0.06, 64), U(-0.12, 62)];
    const cool = '#76667a', lt = mix(skin, '#fffaf2', 0.7), wm = '#ae7060', deep = '#48323a';
    const aSk = SK({ fill: mix(skin, '#c0aaa0', 0.32), shadow: cool, light: lt, maxShade: 30, shade: 0.4 });
    const drawArm = () => {
      const ad = f.part(arm, aSk);
      clipDraw(f, ad, () => {
        softTone(f, ad, [
          [[U(-0.12, -110), U(0.96, -80), kn(0.5), add(kn(0.5), mul(bis, 40)), Fa(0.1, -90), Fa(1.06, -40), Fa(1.06, -10), Fa(0.5, -12), Fa(0.1, -16), U(0.9, -8), U(0.5, -14), U(-0.12, -26)], cool, 0.92, 6], // the core shadow, hard-edged
          [[U(-0.12, -30), U(0.5, -18), U(0.9, -12), Fa(0.1, -20), Fa(0.5, -16), Fa(1.06, -14), Fa(1.06, -4), Fa(0.5, -6), Fa(0.1, -8), U(0.9, -2), U(0.5, -6), U(-0.12, -16)], wm, 0.5, 5], // the warm terminator
          [[U(-0.12, -100), U(0.94, -62), U(0.94, -48), U(-0.12, -80)], mix(cool, '#c8b8c4', 0.5), 0.6, 5], [[Fa(0.1, -66), Fa(1.0, -30), Fa(1.0, -20), Fa(0.1, -54)], mix(cool, '#c8b8c4', 0.5), 0.5, 5], // reflected light at the far edge
          [[U(0.0, 30), U(0.9, 20), U(0.9, 50), U(0.6, 66), U(0.0, 80)], lt, 0.8, 9], [[Fa(0.04, 16), Fa(0.9, 8), Fa(0.9, 30), Fa(0.36, 54), Fa(0.04, 46)], lt, 0.8, 8], // the lit planes
          [ell(U(0.08, -8), 50 * sc, 42 * sc, 0, 12), lt, 0.5, 12], // the deltoid's round
          [ell(U(0.33, -34), 26 * sc, 12 * sc, Math.atan2(dU[1], dU[0]), 10), deep, 0.55, 5], // where the deltoid inserts
          [ell(U(0.58, 26), 54 * sc, 26 * sc, Math.atan2(dU[1], dU[0]), 10), mix(lt, '#fff', 0.2), 0.5, 9], // the biceps' belly
          [ell(U(0.76, -30), 50 * sc, 20 * sc, Math.atan2(dU[1], dU[0]), 10), mix(cool, '#c8b8c4', 0.3), 0.45, 8], // the triceps' swell in the shadow
          [ell(lerp(EA, kn(0.5), 0.75), 18 * sc, 15 * sc, 0, 10), mix(lt, '#fff', 0.3), 0.65, 4], // the elbow's knob catching light
          [ell(Fa(0.2, 4), 44 * sc, 28 * sc, Math.atan2(dF[1], dF[0]), 10), lt, 0.45, 9], // the swell below the elbow
          [ell(Fa(0.97, 0), 28 * sc, 22 * sc, 0, 10), cool, 0.35, 7], // the wrist turning
        ]);
        { const ck = add(EA, mul(E.norm(add(nU, nF)), 24 * sc)); f.stroke([ck, add(ck, mul(E.norm(add(nU, nF)), -22 * sc)), add(ck, add(mul(E.norm(add(nU, nF)), -34 * sc), mul(dU, -6)))], 3 * sc, mix(cool, deep, 0.5), { op: 0.55 }); } // the crook's fold
        f.line([U(0.4, 36), U(0.6, 44), U(0.84, 30)], 1.4, mix(cool, deep, 0.3), { op: 0.55 }); // the biceps' edge
        f.line([U(0.06, -54), U(0.2, -40), U(0.33, -30)], 1.4, mix(cool, deep, 0.3), { op: 0.6 }); // the deltoid's edge
        f.line([Fa(0.08, -24), Fa(0.3, -2), Fa(0.62, 2)], 1.4, mix(cool, deep, 0.3), { op: 0.55 }); // the groove between the muscle groups
        for (let i = 0; i < 3; i++) f.line([Fa(0.74 + i * 0.06, 14 - i * 9), Fa(0.98, 10 - i * 8)], 1, cool, { op: 0.5 }); // tendons to the wrist
        f.flat(ell(Fa(0.94, -16), 7 * sc, 5 * sc, 0, 8), lt, { op: 0.6 }); // the wrist bone
        for (let i = 0; i < 3; i++) { const q = lerp(EA, kn(0.5), 0.45 + i * 0.14); f.line([add(q, mul(dU, -12)), add(q, mul(bis, 3)), add(q, mul(dF, 12))], 0.9, mix(cool, deep, 0.3), { op: 0.5 }); } // the skin creased over the elbow
        for (let i = 0; i < 12; i++) { const t = 0.36 + i * 0.07, q0 = t < 0.96 ? U(t, -46) : Fa(t - 0.9, -40); f.line([q0, add(q0, mul(t < 0.96 ? nU : nF, 18 * sc))], 1.1, deep, { op: 0.38 }); } // hatching in the core shadow
        // the blight under the thin skin: lilac veins risen along the arm
        for (const [p0, a, l] of o2.veins || []) { const C = [p0]; let q = p0, aa = a; for (let k = 0; k < 6; k++) { aa += R(f, -0.4, 0.4); q = add(q, rot([l / 6, 0], aa)); C.push(q); if (k % 2) f.line([q, add(q, rot([l / 7, 0], aa + R(f, 0.5, 1.0) * (k % 4 ? 1 : -1)))], 1, mix(P.lilacD, '#5a6a8a', 0.25), { op: 0.6 }); } f.line(C, 1.8, mix(P.lilacD, '#5a6a8a', 0.25), { op: 0.65 }); f.line(C.map(q2 => add(q2, mul(f.L, 1.5))), 0.8, lt, { op: 0.35 }); }
        if (o2.after) o2.after(U, Fa);
      });
    };
    const eb = elb(SA, EA, WA); split(f, drawArm, [['upperarm' + sfx, side(EA, mul(eb, -1), 66 * sc)], ['forearm' + sfx, side(EA, eb, 66 * sc)]]);
    return { U, Fa, dU, dF, nU, nF };
  };
  {
    const { U } = modelArm(SF, EF, WF, '_f', 1, { veins: [[lerp(SF, EF, 0.5), -1.4, 160], [lerp(EF, WF, 0.3), 0.75, 140], [lerp(EF, WF, 0.7), 0.8, 90]] });
    f.bone('upperarm_f'); X.mould(f, U(0.55, -20), 26, 34, { col: mix(P.lilac, skin, 0.3), op: 0.5 }); X.pustules(f, U(0.3, 30), 30, 20, 4, 6, 11, { col: mix(P.pink, P.skin, 0.4) });
    // the hanging lip of the sleeve, falling plumb from the bunched cuff's underside: folds converge at the top and fan
    // out toward the dagged, rotted edge; the paler lining turned out where it twists
    const h0 = U(0.22, -86), h1 = U(-0.08, -96);
    const lipPts = [h0, add(h0, [-34, 90]), add(h0, [-60, 200]), add(h0, [-50, 260]), add(h0, [-22, 300]), add(h0, [6, 268]), add(h0, [30, 296]), add(h0, [52, 250]), add(h1, [10, 120]), h1];
    const hd = f.part(lipPts, VEL({ fill: mix(P.lilacD, P.loamD, 0.15), maxShade: 26, cast: true, castOp: 0.35 }));
    clipDraw(f, hd, () => {
      softTone(f, hd, [[[add(h0, [-70, 120]), add(h0, [-30, 110]), add(h0, [-20, 320]), add(h0, [-70, 320])], P.lilacS, 0.55, 10], [[add(h0, [0, 60]), add(h0, [30, 80]), add(h0, [40, 280]), add(h0, [4, 280])], P.lilacL, 0.35, 10]]);
      for (const [x0, w] of [[-26, 4.5], [-2, 5], [22, 4], [44, 3.6]]) X.fold(f, [add(h0, [x0 * 0.3 + 4, 30]), add(h0, [x0 * 0.7, 140]), add(h0, [x0 + R(f, -6, 6), 280])], w, { dk: P.lilacS, lt: P.lilacL });
      stains(f, hd, E.bbox(lipPts), P.loamD, 0.025, 3.2, -1.6, 113, 0.7);
    });
    f.part([add(h0, [-50, 260]), add(h0, [-22, 300]), add(h0, [6, 268]), add(h0, [-6, 262]), add(h0, [-24, 282]), add(h0, [-44, 252])], { fill: mix(P.bone, P.lilacL, 0.45), shadow: P.lilacD, light: P.boneL, shade: 0.4, maxShade: 5, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'weave' + seed, texOp: 0.4 }); // the lining
    X.fungalFur(f, [add(h0, [-50, 260]), add(h0, [-22, 300]), add(h0, [6, 268]), add(h0, [30, 296]), add(h0, [52, 250])], 8, 1, { gaps: 0.45 });
    // the sleeve: pushed down the raised arm and bunched at the shoulder (compression folds zigzag across it), the lining
    // showing at its mouth, stained and mouldering
    X.sleeveBunch(f, U(0.4, -4), U(-0.14, 0), 150, 196, VEL({ fill: mix(P.lilacD, P.lilac, 0.12) }), { nb: 3, stains: (sd, bb) => { stains(f, sd, bb, P.loamD, 0.025, 3.2, -1.6, 117, 0.6); X.mould(f, U(0.12, -50), 26, 18, { col: mix(P.lilac, P.grey, 0.4), op: 0.7 }); } });
  }
  f.bone('hand_f');
  // the raised hand, palm up and open, a clean round hole through the palm; rings sunk into the swollen fingers
  X.holeEach(f, [[add(WF, rot([44, -6], ang(EF, WF) - 0.6)), 15]], () => {
    const hh = X.openHand(f, WF, ang(EF, WF) - 0.6, 150, { look: SK({ fill: mix(skin, skinS, 0.12), maxShade: 10 }), back: false, curl: 0.25, spread: 0.12, swell: 0.3, flip: true });
    for (const k of [1, 2]) { const g = hh.fing[k]; X.ironRing(f, lerp(g.k0, g.k1, 0.45), g.W * 0.55, g.W * 0.28, 4, ang(g.k0, g.k1) + Math.PI / 2, { col: mix(P.grey, P.bone, 0.3) }); }
  });

  // ---- her hair: a black mass knotted with flowers, spread over the cushions, grown with moss
  f.bone('hair');
  { const hm = X.lumpy(f, [[1000, 330], [930, 400], [860, 560], [780, 760], [700, 900], [760, 960], [900, 860], [1010, 760], [1060, 600], [1120, 440], [1150, 300], [1060, 260]], 18);
    f.part(hm, { fill: '#1a1618', shadow: '#060506', light: '#4a4248', shade: 0.42, maxShade: 30, tex: 'mottle' + seed, texOp: 0.4 });
    for (let i = 0; i < 16; i++) { const t = i / 16, r0 = lerp([1060, 320], [760, 900], t), l = R(f, 80, 160); X.hairClump(f, [add(r0, [R(f, -40, 40), 0]), add(r0, [R(f, -60, -20), l * 0.5]), add(r0, [R(f, -80, -30), l])], R(f, 16, 30), { pal: ['#0e0c0e', '#1a1618', '#2e282c', '#3e3640'], n: 4, sheen: '#6a6070' }); }
    X.moss(f, [[880, 600], [800, 760], [760, 880]], 14, { col: P.rot }); X.moss(f, [[1000, 380], [950, 470]], 10, { col: P.rot });
    for (const [q, col] of [[[900, 520], P.pinkD], [[820, 700], P.lilac], [[760, 860], P.pink], [[960, 420], mix(P.pink, P.loamB, 0.4)]]) roseAt(q, 22, col); } // flowers knotted in

  // ---- the torso: long and slender, propped; the gown's bodice of lilac velvet rotted into moss, the collarbone bare
  // and swollen with soft pustules, the skin blotched with mould bloom
  f.bone('torso');
  const tor = S.shape([[-0.05, 0.42, 0.36], [0.1, 0.6, 0.56], [0.28, 0.56, 0.72], [0.42, 0.46, 0.52], [0.6, 0.38, 0.4], [0.8, 0.44, 0.46], [1.05, 0.6, 0.6]]);
  const tsk = f.part(tor, SK());
  const bod = [S.at(-0.56, 0.3), S.at(-0.2, 0.24), S.at(0.24, 0.28), S.at(0.68, 0.3), S.at(0.74, 0.38), S.at(0.52, 0.48), S.at(0.42, 0.62), S.at(0.48, 0.82), S.at(0.62, 1.06), S.at(-0.62, 1.06), S.at(-0.46, 0.8), S.at(-0.4, 0.6), S.at(-0.48, 0.44)];
  const bd = f.part(bod, VEL());
  clipDraw(f, tsk, () => { softTone(f, tsk, [[[S.at(-1.2, -0.2), S.at(-0.28, -0.2), S.at(-0.24, 0.5), S.at(-1.2, 0.5)], '#76667a', 0.85, 9], [[S.at(-0.34, -0.2), S.at(-0.2, -0.2), S.at(-0.18, 0.5), S.at(-0.3, 0.5)], '#ae7060', 0.4, 6], [[S.at(0.05, -0.12), S.at(0.6, -0.12), S.at(0.6, 0.18), S.at(0.05, 0.18)], P.boneL, 0.6, 14], [ell(S.at(-0.5, 0.18), 50, 70, 0.3, 12), '#48323a', 0.3, 14]]); // (ruler pass) the back and shoulder modelled: a cool core shadow on the back with a warm terminator, the lit shoulder, the shoulder blade's hollow
    X.crease(f, [S.at(-0.36, 0.06), S.at(-0.44, 0.16), S.at(-0.46, 0.3)], 2.4, { col: '#5a4650', lit: P.boneL, op: 0.5 }); // the shoulder blade's edge
    f.line([S.at(-0.2, -0.08), S.at(-0.1, 0.0), S.at(0.06, 0.02)], 1.4, '#76667a', { op: 0.5 }); // the trapezius' slope into the neck
    for (const [p0, a, l] of [[S.at(-0.1, 0.12), 2.2, 120], [S.at(0.2, 0.16), 1.6, 100]]) { const C = [p0]; let q = p0, aa = a; for (let k = 0; k < 5; k++) { aa += R(f, -0.4, 0.4); q = add(q, rot([l / 5, 0], aa)); C.push(q); } f.line(C, 1.6, mix(P.lilacD, '#5a6a8a', 0.25), { op: 0.6 }); } /* veins */ X.mould(f, S.at(0.2, 0.06), 36, 26, { col: mix(P.lilac, P.lilacD, 0.4), op: 0.42 }); X.mould(f, S.at(-0.3, 0.12), 26, 20, { col: mix(P.lilacD, P.grey, 0.3), op: 0.45 }); });
  // the collarbones, the pit of the throat, and the soft pustules swollen along them
  X.crease(f, [S.at(-0.3, 0.06), S.at(0.0, 0.1), S.at(0.3, 0.08)], 4, { col: skinS, lit: P.boneL, op: 0.6 }); X.crease(f, [S.at(0.06, 0.02), S.at(0.1, 0.12)], 4, { col: skinS, op: 0.6 });
  X.pustules(f, S.at(0.0, 0.11), 80, 14, 9, 7, 14, { col: mix(P.pink, P.skin, 0.35) });
  clipDraw(f, bd, () => { softTone(f, bd, [[[S.at(-0.8, 0.2), S.at(-0.1, 0.2), S.at(-0.1, 1.1), S.at(-0.8, 1.1)], P.lilacS, 0.7, 30], [[S.at(0.2, 0.3), S.at(0.8, 0.3), S.at(0.6, 0.5), S.at(0.2, 0.5)], P.lilacL, 0.45, 20]]); X.fold(f, [S.at(0.5, 0.46), S.at(0.1, 0.5), S.at(-0.3, 0.46)], 4, { dk: P.lilacS, lt: P.lilacL }); for (let i = 0; i < 6; i++) X.fold(f, [S.at(-0.4 + i * 0.16, 0.56), S.at(-0.36 + i * 0.16, 0.78), S.at(-0.42 + i * 0.18, 1.02)], 4, { dk: P.lilacS, lt: P.lilacL }); stains(f, bd, E.bbox(bod), P.loamD, 0.012, 3, -1.3, 95, 0.6); X.moss(f, [S.at(-0.5, 0.9), S.at(-0.1, 0.96), S.at(0.4, 0.92)], 14, { col: P.rot }); X.mould(f, S.at(-0.3, 0.6), 34, 26, { col: mix(P.lilac, P.grey, 0.3), op: 0.7 }); // (independent review) the bodice was a large plain area: folds pulled from the bust down to the girdle and
    // radiating from the waist, rot stains rising from the waist and spreading at the seams, mould in the folds
    for (const [a0, a1, w] of [[[0.6, 0.36], [0.4, 0.66], 4.4], [[0.5, 0.44], [0.2, 0.7], 3.6], [[0.62, 0.48], [0.5, 0.8], 3.4], [[0.1, 0.36], [-0.1, 0.62], 3.6], [[-0.2, 0.4], [-0.3, 0.7], 3.2], [[0.3, 0.9], [0.1, 0.7], 3], [[0.1, 0.94], [-0.06, 0.74], 3], [[-0.2, 0.96], [-0.3, 0.76], 2.8], [[0.46, 0.92], [0.46, 0.72], 3]]) X.fold(f, [S.at(...a0), lerp(S.at(...a0), S.at(...a1), 0.5).map((v, k) => v + (k ? 6 : -8)), S.at(...a1)], w, { dk: P.lilacS, lt: P.lilacL });
    stains(f, bd, E.bbox(bod), mix(P.loamD, P.lilacS, 0.3), 0.025, 3.4, -1.9, 101, 0.85);
    for (const [q, rx, ry] of [[S.at(-0.1, 0.84), 40, 22], [S.at(0.42, 0.62), 22, 30], [S.at(-0.36, 0.44), 26, 20]]) { f.raw(`<ellipse cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" rx="${rx * 1.4}" ry="${ry * 1.3}" fill="${P.loamD}" opacity="0.4" filter="url(#puff${seed})"/>`); X.mould(f, q, rx, ry, { col: mix(P.lilac, P.grey, 0.4), op: 0.75 }); } });
  // the lacing down the front: eyelets on both edges of the opening, the lace crossing between them, its loose end
  { const L0 = [], L1 = []; for (let i = 0; i < 7; i++) { const v = 0.36 + i * 0.09; L0.push(S.at(0.24, v)); L1.push(S.at(0.36, v)); }
    f.line(L0.map(q => add(q, [-4, 0])), 2, P.lilacS, { op: 0.7 }); f.line(L1.map(q => add(q, [4, 0])), 2, P.lilacS, { op: 0.7 });
    for (let i = 0; i < 6; i++) { for (const [a, c2] of [[L0[i], L1[i + 1]], [L1[i], L0[i + 1]]]) { f.line([a, c2], 3.4, INK); f.line([a, c2], 2, mix(P.bone, P.grey, 0.4)); } }
    for (const q of [...L0, ...L1]) { f.flat(ell(q, 4.4, 4.4, 0, 8), INK); f.flat(ell(q, 2.6, 2.6, 0, 8), mix(P.grey, P.bone, 0.3)); f.flat(ell(add(q, [0.6, 0.6]), 1.4, 1.4, 0, 6), '#0a0808'); } // eyelets
    const e0 = L1[6]; X.rope(f, [e0, add(e0, [10, 40]), add(e0, [2, 90])], 2.4, mix(P.bone, P.grey, 0.4), { fray: true }); }
  // embroidery along the neckline: a worn vine of curls, leaves and small rosettes in pale thread, half rotted away
  { const C = spline([S.at(-0.5, 0.34), S.at(-0.2, 0.28), S.at(0.2, 0.32), S.at(0.62, 0.36)], 8);
    for (let i = 1; i < C.length - 1; i++) { if (i % 6 === 3) continue; const dd = E.norm(sub(C[i + 1], C[i - 1])), nn = [-dd[1], dd[0]], q = add(C[i], mul(nn, 14)); f.line([C[i], add(q, mul(dd, 6)), add(q, mul(nn, 6)), add(q, mul(dd, -4))], 1.3, i % 2 ? mix(P.yel, P.bone, 0.4) : P.lilacL, { op: 0.75 }); if (i % 3 === 0) f.flat(ell(add(C[i], mul(nn, 22)), 4, 4, 0, 6), mix(P.pinkL, P.bone, 0.3), { op: 0.8 }); }
    f.line(C, 1.2, mix(P.yel, P.bone, 0.4), { op: 0.55, dash: '5 3' }); f.line(C.map(q => add(q, [0, 26])), 1.2, mix(P.yel, P.bone, 0.4), { op: 0.45, dash: '5 3' }); }
  // fungus growing out of the rotted velvet: a cluster of small caps at the side seam, oyster shelves at the waist
  X.caps(f, S.at(-0.48, 0.66), Math.PI + 0.3, 70, 4, { cols: [P.yel, P.lilacL, P.pinkL], fan: 0.4, sw: 0.12 });
  X.brackets(f, [S.at(-0.4, 0.92), S.at(-0.1, 0.98)], 4, -Math.PI / 2 - 0.4, 34, 40, { kind: 'oyster', cols: [P.yel, P.yelD] });
  f.line([S.at(-0.6, 0.3), S.at(-0.2, 0.22), S.at(0.24, 0.26), S.at(0.62, 0.3)], 3, P.lilacL, { op: 0.5 }); // the neckline's worn edge
  // the girdle of linked pale stones at the waist
  { const C = spline([S.at(-0.66, 1.0), S.at(0.0, 1.06), S.at(0.6, 1.0)], 22); C.forEach((q, i) => { if (i % 2) { f.line([C[i - 1], q], 3, mix(P.grey, P.bone, 0.3)); return; } f.part(X.lumpy(f, ell(q, 15, 12, 0, 10), 2), { fill: mix(P.bone, P.grey, 0.2), shadow: P.boneS, light: P.boneL, shade: 0.42, maxShade: 6, inkW: 1.1, inkHeavy: 1.6, cast: true, castOp: 0.35 }); }); }

  // ---- the head: long and lovely, tilted dreamily toward the near shoulder, heavy-lidded eyes half closed, a dreamy smile,
  // one cheek swollen under a soft bloom of mould; the circlet of white flowers browned at every edge
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(limb(add(N0, [-10, 20]), hF([[-0.08, 0.36]])[0], 150, 120, { steps: 6 }), SK());
  X.crease(f, [add(N0, [30, -30]), hF([[0.0, 0.42]])[0]], 4, { col: mix(skin, '#6a4638', 0.6), op: 0.45 }); // the long muscle of the neck
  f.raw(`<path d="${E.smooth(hF([[-0.2, 0.3], [0.25, 0.46], [0.2, 0.62], [-0.2, 0.6]]))}" fill="${mix(skin, '#6a4638', 0.6)}" opacity="0.55" filter="url(#puff${seed})"/>`); // the jaw's shadow on the neck, warm
  // (independent review) the face modelled at full size (X.ladyFace), the hair cap over it, the swollen cheek
  { const LF0 = X.ladyFace(f, HC, H, hA, { skin, warm: mix(skin, '#6a4638', 0.5), faceShade: 0.78, iris: '#4a4250', hairCol: '#1a1618' });
    f.part(hF([[-0.46, 0.2], [-0.5, -0.12], [-0.4, -0.42], [-0.16, -0.56], [0.1, -0.54], [0.26, -0.44], [0.22, -0.38], [0.1, -0.42], [-0.02, -0.4], [-0.14, -0.32], [-0.22, -0.16], [-0.26, 0.04], [-0.3, 0.22]]), { fill: '#1a1618', shadow: '#060506', light: '#4a4248', shade: 0.42, maxShade: 20, tex: 'mottle' + seed, texOp: 0.4, inkW: 1.4 }); // the hair cap over the brow
    for (const pth of [[[0.2, -0.44], [0.0, -0.4], [-0.18, -0.3], [-0.28, -0.1]], [[0.08, -0.48], [-0.12, -0.44], [-0.3, -0.3], [-0.4, -0.08]], [[-0.04, -0.52], [-0.26, -0.46], [-0.42, -0.26]]]) { const C = spline(hF(pth), 4); f.line(C, 2, '#4a4248', { op: 0.55 }); f.line(C.map(q => add(q, [3, 4])), 1.4, '#060506', { op: 0.6 }); } // the hair's sweep back from the brow, not stripes
    // the near cheek swollen under a soft bloom of mould: a raised, soft swelling with its own light and shadow
    // (ruler pass) the swelling laid as tones on the face itself (a disc read as a sticker): a lilac-pink bruise, the
    // swelling's lit top, the shadow it throws under itself, the mould a fine speckled bloom on it, hyphae at one edge
    { const cq = hF([[0.1, 0.14]])[0];
      softTone(f, LF0.d, [[hF(ell([0.1, 0.14], 0.12, 0.09, 0.3, 12)), mix(mix(skin, P.pinkD, 0.45), P.lilacD, 0.2), 0.55, 8], [hF(ell([0.12, 0.1], 0.07, 0.04, 0.3, 10)), mix(skin, '#fff', 0.5), 0.5, 5], [hF([[0.0, 0.22], [0.12, 0.25], [0.22, 0.22], [0.2, 0.27], [0.02, 0.27]]), mix(skin, '#3a2a36', 0.6), 0.5, 5]]);
      clipDraw(f, LF0.d, () => { for (let i = 0; i < 46; i++) { const p2 = add(cq, rot([R(f, -28, 28), R(f, -18, 18)], hA + 0.3)); f.flat(ell(p2, R(f, 0.7, 1.8), R(f, 0.7, 1.8), 0, 5), i % 3 ? mix(P.lilac, skin, 0.4) : mix(P.lilacS, skin, 0.45), { op: 0.6 }); } });
      X.fungalFur(f, hF([[0.02, 0.2], [0.08, 0.23], [0.15, 0.24]]), 5, 1, { gaps: 0.5 }); }
    for (const q of [[-0.2, -0.06], [-0.06, 0.36]]) X.mould(f, hF([q])[0], 14, 10, { col: mix(P.lilacD, skin, 0.45), op: 0.35, rings: 0 });
    // (ruler pass) the blight on the face: lilac veins risen under the thin skin of the temple and down the far cheek,
    // spreading from a patch of bark that has grown over the hairline, its plates split, a cluster of small caps fruiting
    // from its top into the hair and fungal fur at its rim
    const vein = (pts, w) => { const C = spline(hF(pts), 3); f.line(C, w + 1.2, mix(P.lilacS, skinS, 0.3), { op: 0.35 }); f.line(C, w, mix(P.lilacD, '#5a6a8a', 0.25), { op: 0.7 }); f.line(C.map(q => add(q, mul(f.L, w * 0.7))), Math.max(0.7, w * 0.4), mix(skin, '#fff', 0.5), { op: 0.4 }); };
    for (const [pts, w] of [[[[-0.1, -0.22], [-0.08, -0.14], [-0.05, -0.08], [-0.09, 0.0], [-0.12, 0.08]], 2.6], [[[-0.08, -0.14], [-0.02, -0.18], [0.04, -0.2]], 1.6], [[[-0.05, -0.08], [0.0, -0.04], [0.03, 0.03]], 1.5], [[[-0.09, 0.0], [-0.03, 0.06], [-0.01, 0.15]], 1.4], [[[-0.12, 0.08], [-0.16, 0.18], [-0.14, 0.3]], 1.6], [[[-0.02, 0.06], [0.04, 0.1], [0.06, 0.08]], 1.1]]) vein(pts, w);
    // the hair framing the face in hanks: swept back from the brow over the circlet's line, one hank falling past the
    // temple and down behind the jaw, the hanks clumped and lit along their crowns, flowers knotted in
    for (const [pts, w, n] of [[[[0.08, -0.52], [-0.12, -0.56], [-0.36, -0.48], [-0.56, -0.28], [-0.62, -0.06]], 40, 7], [[[0.22, -0.42], [0.06, -0.47], [-0.16, -0.43], [-0.34, -0.3], [-0.44, -0.12]], 30, 6],
      [[[-0.04, -0.36], [-0.17, -0.22], [-0.23, 0.0], [-0.28, 0.22], [-0.36, 0.44], [-0.4, 0.62]], 30, 6], [[[-0.16, -0.32], [-0.3, -0.18], [-0.4, 0.02], [-0.5, 0.3]], 22, 4],
      [[[0.12, -0.37], [-0.02, -0.33], [-0.1, -0.24], [-0.12, -0.14]], 14, 3], [[[-0.3, -0.42], [-0.44, -0.34], [-0.5, -0.2], [-0.46, -0.08], [-0.52, 0.06]], 18, 4]])
      X.hairClump(f, spline(hF(pts), 4), w, { pal: ['#0e0c0e', '#1a1618', '#2e282c', '#3a3238'], n, sheen: '#7a7080' });
    roseAt(hF([[-0.34, 0.36]])[0], 20, mix(P.pink, P.loamB, 0.3), { simple: true }); // a rose knotted into the falling hank
    { const bc = hF([[-0.07, -0.31]])[0], ba = hA - 0.9, BF = frame(bc, ba, 0.85);
      const bark = X.lumpy(f, BF([[-46, -8], [-30, -30], [0, -36], [34, -28], [52, -6], [40, 14], [14, 22], [-4, 30], [-28, 22], [-48, 10]]), 4);
      f.raw(`<path d="${E.smooth(bark.map(q => add(q, mul(f.L, -6))))}" fill="${mix(skinS, '#000', 0.3)}" opacity="0.5" filter="url(#puff${seed})"/>`); // its shadow on the skin
      const bd2 = f.part(bark, { fill: mix(P.loamB, P.grey, 0.35), shadow: P.loamD, light: mix(P.greyL, P.bone, 0.2), shade: 0.42, maxShade: 12, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.3, inkHeavy: 2.2, cast: false });
      clipDraw(f, bd2, () => { for (const [a0, a1, a2] of [[[-44, -6], [-24, -2], [-10, 0]], [[-10, 0], [-2, -16], [6, -34]], [[-10, 0], [-6, 14], [-2, 30]], [[6, -2], [24, 0], [48, -6]], [[22, -26], [24, -6], [20, 16]], [[-30, -24], [-26, -12], [-24, -2]], [[-28, 8], [-16, 12], [-8, 22]], [[30, 2], [32, 10], [36, 14]]]) { f.line(BF([a0, a1, a2]), 3, P.loamD, { op: 0.95 }); f.line(BF([a0, a1, a2]).map(q => add(q, mul(f.L, 2))), 1, mix(P.greyL, P.bone, 0.2), { op: 0.55 }); } }); // the plates split
      X.fungalFur(f, bark.slice(5, 10), 6, 1, { gaps: 0.4 });
      X.caps(f, BF([[10, -30]])[0], ba - Math.PI / 2 - 0.2, 46, 4, { cols: [P.yel, P.lilacL, mix(P.yel, P.loamB, 0.3)], fan: 0.5, sw: 0.14 }); }
    X.moss(f, hF([[-0.3, -0.06], [-0.34, 0.14], [-0.38, 0.34]]), 9, { col: P.rot }); }
  { const ring = [[-0.46, 0.0], [-0.42, -0.26], [-0.26, -0.48], [-0.04, -0.58], [0.18, -0.54], [0.32, -0.42]].map(q => hF([q])[0]); X.moss(f, ring, 12, { col: P.rot, stalks: false }); ring.forEach(q => { X.bloom(f, q, R(f, 22, 30), mix(P.bone, P.grey, 0.15), { sy: 0.7, n: 6, ang: R(f, 0, 6) }); f.line(ell(q, 26, 18, 0, 12).slice(0, 8), 3, P.loamB, { op: 0.6 }); }); } // the circlet, browned at every edge

  // ---- the bed: the mat of bloom and rot her lower body has become, the gown's velvet rotted into it, the train spreading
  // out of the frame; brackets fruiting from the hip and thigh; eyes opened in the blooms
  f.bone('pelvis');
  const bed = [[-40, 1150], [140, 1110], [300, 1080], [440, 1060], [600, 1100], [760, 1130], [900, 1120], [1060, 1150], [1240, 1140], [1420, 1160], [1470, 1260], [1440, 1400], [1460, gy + 4], [-40, gy + 4]];
  const bdd = f.part(X.lumpy(f, bed, 10), VEL({ fill: mix(P.lilacD, P.loamD, 0.5), maxShade: 40 }));
  clipDraw(f, bdd, () => {
    softTone(f, bdd, [[[[-40, 1300], [1500, 1300], [1500, gy], [-40, gy]], P.loamD, 0.75, 40], [[[100, 1080], [1400, 1100], [1400, 1200], [100, 1180]], P.lilac, 0.35, 30]]);
    for (let i = 0; i < 12; i++) X.fold(f, [[i * 120 + R(f, 0, 40), 1110], [i * 120 + R(f, 10, 50), 1300], [i * 120 + R(f, -20, 40), gy]], 6, { dk: P.lilacS, lt: P.lilacL }); // the velvet hanging in folds
    stains(f, bdd, [-40, 1050, 1500, gy], P.loamD, 0.008, 3, -1.2, 97, 0.7);
    X.moss(f, [[-40, 1400], [300, 1420], [700, 1440], [1100, 1420], [1450, 1440]], 18, { col: P.rot });
    for (let i = 0; i < 26; i++) X.mould(f, [R(f, 0, 1450), R(f, 1150, 1500)], R(f, 16, 40), R(f, 12, 30), { col: [P.lilac, mix(P.lilac, P.grey, 0.4), P.pinkD][i % 3], op: 0.55 });
  });
  // (independent review) the blooms of the mat, given depth: three ranks from the bed's top (back: small, dimmed, close
  // together) to its lower front (large, full value); before each rank, the dark gaps and shadow it sits in; briar stems
  // with thorns and rotted leaves climbing between them, so it reads as a heap, not a carpet
  { const cols = [P.pinkD, mix(P.pink, P.loamB, 0.35), P.lilacD, mix(P.pinkD, P.loamD, 0.3), P.pink, P.lilac];
    for (const [y0, y1, r0, r1, n, dim] of [[1075, 1160, 20, 32, 42, 0.45], [1170, 1300, 34, 50, 30, 0.22], [1300, 1470, 54, 80, 17, 0]]) {
      const L = []; for (let i = 0; i < n; i++) { const x = R(f, -30, 1470), y = R(f, y0, y1); if (x > 900 && x < 1380 && y < 1150) continue; L.push([x, y, R(f, r0, r1)]); }
      for (const [x, y, r] of L) f.raw(`<ellipse cx="${x.toFixed(1)}" cy="${(y + r * 0.5).toFixed(1)}" rx="${(r * 1.5).toFixed(1)}" ry="${(r * 0.9).toFixed(1)}" fill="${P.loamD}" opacity="0.75" filter="url(#puff${seed})"/>`); // the dark gaps
      for (let i = 0; i < Math.round(n / 3); i++) { const x = R(f, 0, 1450), y = y1 + R(f, 0, 60); X.briar(f, [[x, y], [x + R(f, -30, 30), y - (y1 - y0) * 0.5], [x + R(f, -60, 60), y0 - 20]], 6 + (1 - dim) * 6, { col: mix(P.rot, P.loamD, dim), thorns: 5, leaves: 1 }); } // stems and thorns
      L.sort((a, c2) => a[1] - c2[1]).forEach(([x, y, r], i) => { X.leaf(f, [x + R(f, -r, r), y + r * 0.3], R(f, 0, 6.3), r * 1.1, { col: mix(mix(P.rot, P.loamB, 0.3), P.loamD, dim) }); roseAt([x, y], r, mix(cols[i % cols.length], P.loamD, dim)); });
    } }
  for (let i = 0; i < 10; i++) eyeBloom([R(f, 40, 1440), R(f, 1120, 1460)], R(f, 26, 42), R(f, -0.4, 0.4), [0.8, 0.3, 0.6, 0.0, 0.9, 0.5][i % 6]);
  // the hip and thigh, merging into the bed: pale-yellow oyster brackets fruiting from them
  X.brackets(f, [[520, 1090], [620, 1120], [760, 1140]], 9, -Math.PI / 2 - 0.2, 60, 70, { kind: 'oyster', cols: [P.yel, mix(P.yel, P.bone, 0.3), P.yelD] });
  X.brackets(f, [[380, 1110], [460, 1100]], 4, -Math.PI / 2 - 0.5, 40, 50, { kind: 'oyster', cols: [P.yel, P.yelD] });
  // the lute dropped beside her on the bed, grown through with fungus, a clean round hole through its body
  { const lc = [300, 1050], la = -0.25, LF = frame(lc, la, 1);
    X.cutHoles(f, [[LF([[30, 4]])[0], 18]], () => { const bodyL = LF([[-110, 0], [-90, -64], [-20, -86], [60, -70], [110, -30], [120, 0], [110, 30], [60, 70], [-20, 86], [-90, 64]]); const ld = f.part(bodyL, WOOD(f, { fill: mix(P.loamBL, P.yelD, 0.3), maxShade: 24 })); clipDraw(f, ld, () => { for (let i = -3; i <= 3; i++) f.line(LF([[-100, i * 22], [0, i * 26], [110, i * 10]]), 1.4, P.loamD, { op: 0.6 }); stains(f, ld, E.bbox(bodyL), P.loamD, 0.03, 3, -1.3, 99, 0.6); }); f.flat(LF(ell([-10, 0], 20, 20, 0, 14)), '#0e0a08'); }, { shape: LF([[-110, 0], [-90, -64], [-20, -86], [60, -70], [110, -30], [120, 0], [110, 30], [60, 70], [-20, 86], [-90, 64]]) });
    f.part(LF([[110, -14], [330, -12], [330, 12], [110, 14]]), WOOD(f, { fill: mix(P.loamB, P.loamD, 0.3) })); f.part(LF([[320, -18], [380, -26], [384, 20], [320, 18]]), WOOD(f, { fill: P.loamB })); // the neck and pegbox
    for (let i = -2; i <= 2; i++) f.line(LF([[-60, i * 5], [360, i * 3]]), 0.9, P.greyL, { op: 0.6 }); // strings, slack
    X.caps(f, LF([[-30, -40]])[0], la - Math.PI / 2 - 0.3, 70, 5, { cols: [P.yel, P.lilac, P.pinkL], fan: 0.4, sw: 0.12 }); X.mould(f, LF([[60, 40]])[0], 30, 20, { col: P.lilac, op: 0.7 }); }
  // the book of hours, swollen to twice its size, lying open on the bed by her hip, its pages fat with damp
  { const bk = [760, 1110]; f.part([add(bk, [-90, -30]), add(bk, [80, -50]), add(bk, [110, 20]), add(bk, [-60, 44])], { fill: mix(P.bone, P.yel, 0.35), shadow: P.yelS, light: P.boneL, shade: 0.42, maxShade: 14, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.6 }); for (let i = 0; i < 6; i++) f.line([add(bk, [-80 + i * 4, -22 + i * 8]), add(bk, [96 - i * 2, -40 + i * 9])], 1.4, P.yelS, { op: 0.7 }); f.part([add(bk, [-96, -24]), add(bk, [-62, 50]), add(bk, [-50, 60]), add(bk, [-84, -16])], VEL({ fill: mix(P.pinkD, P.loamD, 0.3), maxShade: 6 })); X.mould(f, add(bk, [20, -10]), 34, 18, { col: mix(P.lilac, P.grey, 0.3), op: 0.7 }); }
  // the spilled cup on the ground at the bed's foot, the dregs gone to mould
  { const cp = [1360, gy - 26]; f.part([add(cp, [-40, -20]), add(cp, [40, -30]), add(cp, [50, 20]), add(cp, [-34, 26])], IRON(f, { fill: mix(P.grey, P.bone, 0.2), light: P.boneL })); f.flat(ell(add(cp, [44, -4]), 12, 24, 0.2, 12), '#141214'); f.part([add(cp, [-10, 26]), add(cp, [10, 26]), add(cp, [16, 30]), add(cp, [-16, 30])], IRON(f, { fill: mix(P.grey, P.bone, 0.2), cast: false })); X.mould(f, add(cp, [80, 18]), 40, 10, { col: P.pinkD, op: 0.6, rings: 1 }); }
  // the petals heaped in drifts at the bed's foot (the left, the train's end) and fallen on the ground
  for (let i = 0; i < 90; i++) { const q = [R(f, -20, 560), gy - Math.abs(R(f, -1, 1)) * R(f, 0, 90) + R(f, 0, 10)]; f.part(ell(q, R(f, 6, 12), R(f, 3, 6), R(f, -0.6, 0.6), 8), { fill: [P.pink, P.lilac, P.pinkD, mix(P.pink, P.loamB, 0.4), P.pinkL][i % 5], shadow: P.lilacS, shade: 0.35, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); }
  X.puff(f, [900, 1060], 70, { col: P.yelL, op: 0.2, specks: 14 }); // pollen lifting off the bed

  // ---- the near arm, propping: the upper arm straight down into the bed, the forearm lying along it, the hand hanging over
  // the edge with the mirror; pustules along the arm; rings sunk into the swollen fingers
  modelArm(SN, EN, WN, '_n', 1.08, { veins: [[lerp(SN, EN, 0.4), 1.3, 150], [lerp(EN, WN, 0.4), 0.1, 120]] }); // (ruler pass) modelled like the raised arm
  f.bone('upperarm_n'); X.pustules(f, lerp(SN, EN, 0.5), 40, 60, 8, 7, 14, { col: mix(P.pink, P.skin, 0.35) }); X.mould(f, lerp(SN, EN, 0.3), 30, 40, { col: P.lilac, op: 0.55 });
  X.sleeveBunch(f, lerp(SN, EN, 0.3), lerp(SN, EN, -0.1), 172, 186, VEL({ fill: mix(P.lilacD, P.lilac, 0.1) }), { nb: 2, stains: (sd, bb) => stains(f, sd, bb, P.loamD, 0.025, 3.2, -1.6, 119, 0.6) }); // (ruler pass) the sleeve's puff, folded, not a box
  f.bone('forearm_n'); X.pustules(f, lerp(EN, WN, 0.5), 60, 16, 5, 6, 11, { col: mix(P.pink, P.skin, 0.35) }); X.peel(f, lerp(EN, WN, 0.7), 3, 1.6, 30, skin);
  f.bone('mirror');
  { const mc = add(WN, [40, 220]), ma = 0.2, MF = frame(mc, ma, 1);
    f.part(MF([[-8, -160], [8, -160], [10, -70], [-10, -70]]), { fill: mix(P.grey, P.bone, 0.3), shadow: P.greyS, light: P.boneL, shade: 0.42, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.5 }); // the handle, held loosely
    f.part(MF(ell([0, 0], 64, 80, 0, 24)), { fill: mix(P.grey, P.bone, 0.35), shadow: P.greyS, light: P.boneL, shade: 0.42, inkW: 1.6, inkHeavy: 2.6, tex: 'mottle' + seed, texOp: 0.5 }); // the frame (the back toward us; its face toward her)
    f.flat(MF(ell([4, 2], 52, 68, 0, 22)), mix(P.greyD, P.lilacS, 0.4));
    X.mould(f, MF([[0, 0]])[0], 46, 58, { col: mix(P.grey, P.lilac, 0.3), op: 0.85 }); // fogged with mould
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.3; f.flat(MF(ell([Math.cos(a) * 66, Math.sin(a) * 82], 6, 5, a, 6)), mix(P.bone, P.grey, 0.5), { op: 0.8 }); } }
  f.bone('hand_n');
  { const hh = X.openHand(f, WN, Math.PI / 2 + 0.1, 160, { look: SK({ maxShade: 10 }), back: true, curl: 0.55, swell: 0.35 }); for (const k of [1, 3]) { const g = hh.fing[k]; X.ironRing(f, lerp(g.k0, g.k1, 0.5), g.W * 0.58, g.W * 0.3, 4, ang(g.k0, g.k1) + Math.PI / 2, { col: mix(P.grey, P.bone, 0.3) }); } X.pustules(f, add(WN, [0, 40]), 30, 24, 4, 5, 9, { col: mix(P.pink, P.skin, 0.35) }); }


  f.bone('root');
  X.loamGround(f, -20, 1620, gy, { depth: 16, petals: 10 });
  return f;
}

module.exports = {
  heroes: [
    { key: 'lady_of_the_bower', name: 'The Lady of the Bower', tier: 'ruler', w: 1600, h: 1600, flip: true, build: ladyOfTheBower },
    { key: 'green_lion', name: 'The Green Lion', tier: 'ruler', w: 1600, h: 1600, flip: true, build: greenLion },
    { key: 'ladys_fool', name: "The Lady's Fool", tier: 'elite', w: 1100, h: 1400, flip: true, build: ladysFool },
    { key: 'truffle_boar', name: 'The Truffle Boar', tier: 'elite', w: 2250, h: 1500, flip: true, build: truffleBoar },
    { key: 'pond_swan', name: 'Pond Swan', tier: 'large', w: 1200, h: 1100, flip: true, build: pondSwan },
    { key: 'blight_snails', name: 'Blight Snails', tier: 'small', w: 680, h: 820, flip: true, build: blightSnails },
    { key: 'scarecrow', name: 'Scarecrow', tier: 'human', w: 900, h: 900, flip: true, build: scarecrow },
    { key: 'beekeeper', name: 'Beekeeper', tier: 'human', w: 640, h: 820, flip: true, build: beekeeper },
    { key: 'orchard_picker', name: 'Orchard Picker', tier: 'human', w: 900, h: 900, flip: true, build: orchardPicker },
    { key: 'flower_strewer', name: 'Flower-Strewer', tier: 'small', w: 600, h: 820, flip: true, build: flowerStrewer },
    { key: 'mole_catcher', name: 'Mole-Catcher', tier: 'human', w: 640, h: 820, flip: true, build: moleCatcher },
  ],
};
