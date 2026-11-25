// World IV, The Sulphur Pits, second batch (Fire + Toxin, Combust): The Owner, The Powder Mill, The Mounted Overseer,
// The Shrine-Bearer, Gas-Burner, Pit Boy, Timberman, Gallery Rats, Weighman, Lamp-Room Girl, Tub Hurrier.
// Same world as world_IV.js: sulphur crust, glowing seams, soot, armRig with capTop, kit_IV's materials and palette
// (sulphur yellow, ochre smoke, lamp orange, plus ink black, bone and grey). Fire is dominant (split skin with glowing
// seams, charred curled edges, ash rising); toxin second (gas swelling, blisters, yellow crust). Never flames on heads.
// Foes face left: drawn facing right with kit.foeBase (light upper right) and flipped. Seeds 420 + index.
'use strict';
const K = require('../kit');
const W0 = require('./kit_IV');
// the batch's smoke and steam keep their soft plume, but the bright thread inside it is dulled: at game size a thin light
// wavy line reads as an arc or bolt, which the director ruled off figures (independent review, 2026-11-23)
const W = Object.assign({}, W0, { smoke: (f, p0, h, w, o = {}) => W0.smoke(f, p0, h, w, Object.assign({ line: '#6a5e50', lineOp: 0.22 }, o)) });
const X = require('./kit_IV_b');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, ang, elb } = W;
const D = 180 / Math.PI;

// shared bits for this batch
// canvas growth per figure (director ruling 2026-11-23: true size wins over the tier canvas): [left, top] margins added
// to the tier canvas at the same pixel scale; the entries below add the same amounts (plus any right margin) to w and h
const GROW = { timberman: [400, 150], shrine_bearer: [0, 170], mounted_overseer: [0, 70] };
const LEGB = { bp: [[0, 0.6, 0.14], [1, 0.3, 0.7, 0.16]], bq: [[0, 0.35, 0.16], [1, 0.04, 0.16, 0.06], [1, 0.4, 0.12, 0.2]] }; // thigh, knee, calf: not a tube
const shoe = (f, Kn, A, s, col, sfx, o = {}) => W.bootRig(f, Kn, A, s, col, sfx, Object.assign({ tex: 'mottle' + f.o.seed, shaft: 0.5, toe: 1.12 }, o));
// a pair of round spectacles on a face frame hF, at local centre c
function specs(f, hF, c, r, col = P.ironL) {
  const e1 = hF(ell(c, r, r * 0.9, 0, 12)), e2 = hF(ell(add(c, [r * 2.5, -r * 0.1]), r * 0.55, r * 0.85, 0, 10));
  for (const e of [e2, e1]) { f.line(e.concat([e[0]]), 3, INK); f.line(e.concat([e[0]]), 1.6, col); }
  f.flat(e1, '#e8e0c8', { op: 0.18 }); f.line(hF([add(c, [-r * 0.5, -r * 0.5]), add(c, [-r * 0.1, -r * 0.7])]), 1, '#fff', { op: 0.7 });
  f.line(hF([add(c, [r, -r * 0.1]), add(c, [r * 1.95, -r * 0.2])]), 1.6, col);
}

// ------------------------------------------------------------------ WEIGHMAN (cast, human 1.0)
// The owner's clerk at the pithead, who weighed every load and docked the miners' pay. A narrow, stooped man standing
// upright and fussy with his weight back against the load: his near arm holds the long iron steelyard out at arm's
// length by its hook, the pan hanging on chains from the short arm, the pear-shaped counterweight on the long arm
// pointing at the enemy. He peers down at the beam over spectacles low on his nose. The ledger is clamped under his far
// arm. The steelyard arm is the one the gas flash caught: the sleeve guard burnt away, the forearm and the ink-stained
// fingers charred and split in glowing seams. Toxin has puffed his face, blistered his lips and crusted his cuffs and
// collar yellow.
// Rig: standard humanoid + steelyard (parent hand_n; the beam swings on the hook) + pan (parent steelyard) + weight
// (parent steelyard) + ledger (parent hand_f). Motion: idle tapping the counterweight along; attack swinging the weight.
function weighman() {
  const seed = 428, h = TIERS.human[1];
  const f = new Fig(W.base(seed, h, { grimeY: 600 }));
  W.textures(f);
  const H = 96, gy = f.o.groundY;
  const skin = mix(P.skin, '#c8b090', 0.25), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin }, o));
  const doub = '#5e5444', doubD = '#3a342a', doubL = '#857a64', linen = '#a8a08c', hose = '#625848';
  const N = [228, 286], C = [206, 380], Pv = [230, 472];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.12, -0.02), HC = [268, 214], hA = 0.42;
  const SN = [222, 314], EN = [326, 346], WN = [430, 330];
  const SF = [262, 306], EF = [204, 392], WF = [168, 420];
  const HN = [242, 484], KN = [262, 630], AN = [262, 752];
  const HF = [214, 480], KF = [196, 626], AF = [176, 750];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const FP = [WN[0] + 4, 392], bA = -0.05, bd = [Math.cos(bA), Math.sin(bA)]; // the fulcrum on the beam, a little tipped
  const BT = add(FP, mul(bd, -62)), BL = add(FP, mul(bd, 150)); // short arm end (pan), long arm tip
  const cw = add(FP, mul(bd, 112)); // the counterweight's loop
  f.joint('steelyard', add(WN, [0, 10]), 'hand_n').joint('pan', BT, 'steelyard').joint('weight', cw, 'steelyard').joint('ledger', WF, 'hand_f');

  // ---- far arm: sleeve guard over the forearm, the hand under the ledger
  W.armRig(f, SF, EF, WF, [40, 34, 28], { fill: doubD, shadow: '#221e18', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, '_f', { capTop: 0.6 });
  // ---- far leg: wool hose, a buckled shoe
  W.legTube(f, HF, KF, lerp(KF, AF, 0.86), [58, 40, 30], { fill: mix(hose, '#000', 0.2), shadow: '#1e1a16', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 }, '_f', Object.assign({ A: AF }, LEGB));
  f.bone('thigh_f');
  f.part(X.rag(f, HF, lerp(HF, KF, 0.72), 64, 52, { depth: 6, teeth: 5 }), { fill: mix(doubD, '#000', 0.2), shadow: '#18140f', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.bone('shin_f'); for (let i = 0; i < 3; i++) f.stroke([lp(KF, AF, 0.8 + i * 0.05, -14), lp(KF, AF, 0.82 + i * 0.05, 0), lp(KF, AF, 0.79 + i * 0.05, 12)], 1.6, mix(hose, '#000', 0.6), { op: 0.7 });
  shoe(f, KF, AF, 46, '#2a221c', '_f');

  // ---- the ledger, clamped under the far arm: a thick leather-bound book, spine toward us, scorched at one corner
  f.bone('ledger');
  const LG = frame(add(WF, [10, -26]), 0.3, 1.15);
  f.part(LG([[-64, -12], [40, -18], [46, 8], [-60, 16]]), { fill: '#d4c8a8', shadow: '#7a6e54', shade: 0.4, inkW: 1.2, cast: false, tex: 'growth' + seed, texOp: 0.5 }); // page block
  f.part(LG([[-70, -24], [42, -30], [44, -16], [-68, -10]]), W.LEA(f, { fill: '#5a3c22', inkW: 1.4 }));
  f.part(LG([[-68, 14], [46, 6], [48, 20], [-66, 28]]), W.LEA(f, { fill: '#4a3018', inkW: 1.4 }));
  f.part(LG([[-74, -24], [-62, -26], [-60, 28], [-72, 30]]), W.LEA(f, { fill: '#3a2614', inkW: 1.3 })); // spine
  for (const t of [-14, 2, 18]) f.line(LG([[-73, t], [-61, t - 1]]), 2, P.brassD);
  f.flat(LG([[26, -30], [44, -16], [46, 6], [30, -6]]), P.char, { op: 0.85 }); W.seam(f, LG([[30, -26], [36, -10], [34, 4]]), 1, { glowOp: 0.2 });
  f.bone('hand_f');
  B.hand(f, add(WF, [-4, 0]), 0.6, 16, mix(skin, P.soot, 0.15), { spread: 0.05, curl: 0.7, shadow: P.skinS });

  // ---- torso: a narrow chest under a fitted wool doublet, the upper back rounded, the doublet's skirts over the hips
  f.bone('torso');
  const TOR = S.shape([[-0.05, 0.3, 0.3], [0.1, 0.5, 0.42], [0.3, 0.52, 0.5], [0.55, 0.46, 0.46], [0.8, 0.46, 0.5], [1.0, 0.5, 0.55]]);
  f.part(TOR, { fill: doub, shadow: '#26221c', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.raw(`<path d="${E.smooth(TOR)}" fill="url(#soot${seed})" opacity="0.55"/>`);
  W.clipDraw(f, TOR, () => {
    for (let i = 0; i < 6; i++) f.rivet(S.at(0.44 - i * 0.005, 0.12 + i * 0.13), 2.4, P.boneD); // horn buttons down the front
    f.line([S.at(0.4, 0.06), S.at(0.38, 0.6), S.at(0.42, 0.9)], 1.2, INK, { op: 0.6 });
    f.stroke([S.at(-0.3, 0.2), S.at(-0.36, 0.5), S.at(-0.3, 0.8)], 3, doubD); // the rounded back's shadow
    f.stroke([S.at(0.1, 0.25), S.at(0.25, 0.4), S.at(0.3, 0.55)], 2, doubD, { op: 0.7 }); // pull folds from the buttons
    f.flat([S.at(-0.5, 0.1), S.at(-0.2, 0.12), S.at(-0.24, 0.6), S.at(-0.5, 0.7)], '#1e1a16', { op: 0.3 });
    W.flakes(f, S.at(0.2, 0.3), 14, 20, 3, 0.6);
  });
  // doublet skirts, the hem charred into split, curled edges
  const skirt = [S.at(-0.48, 0.84), S.at(0.5, 0.82), add(S.at(0.52, 1.0), [6, 22]), [...add(S.at(0.4, 1.0), [4, 34]), 1], add(S.at(0.2, 1.0), [0, 26]), [...add(S.at(0.0, 1.0), [0, 36]), 1], add(S.at(-0.2, 1.0), [0, 28]), [...add(S.at(-0.44, 1.0), [-4, 32]), 1], add(S.at(-0.52, 0.95), [-4, 10])];
  f.part(skirt, { fill: mix(doub, '#000', 0.08), shadow: '#26221c', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  for (const q of [add(S.at(0.4, 1.0), [4, 34]), add(S.at(0.0, 1.0), [0, 36]), add(S.at(-0.44, 1.0), [-4, 32])]) { f.flat([add(q, [-8, -10]), q, add(q, [8, -12])], P.char, { op: 0.8 }); W.seam(f, [add(q, [-6, -8]), q, add(q, [5, -9])], 1, { glowOp: 0.2 }); }
  for (const t of [-0.2, 0.15]) f.stroke([S.at(t, 0.86), S.at(t + 0.02, 0.95), add(S.at(t, 1.0), [0, 24])], 2, doubD);
  // the belt: ink horn, pen case, keys, chalk, the purse of fines
  const bt = [S.at(-0.5, 0.78), S.at(0.5, 0.76), S.at(0.5, 0.83), S.at(-0.5, 0.86)];
  f.part(bt, W.LEA(f, { fill: P.leathD, k: 0.5 }));
  f.part([add(S.at(0.3, 0.77), [-6, -6]), add(S.at(0.3, 0.77), [6, -6]), add(S.at(0.3, 0.77), [6, 8]), add(S.at(0.3, 0.77), [-6, 8])].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  const ih = add(S.at(0.46, 0.85), [2, 6]); // ink horn on a thong at the front of the hip
  f.line([S.at(0.44, 0.82), ih], 1.6, P.leathD);
  f.part([add(ih, [-6, 0]), add(ih, [6, -2]), add(ih, [10, 22]), add(ih, [4, 34]), add(ih, [-2, 26]), add(ih, [-8, 8])], { fill: '#c8b48a', shadow: '#5a4a32', shade: 0.42, inkW: 1.1, cast: false, tex: 'growth' + seed, texOp: 0.5 });
  f.flat(ell(add(ih, [0, -1]), 5, 2.5, -0.1, 8), '#120c08');
  const pc = S.at(-0.1, 0.86); // the pen case, a leather tube slung behind
  f.part(limb(add(pc, [-6, 0]), add(pc, [-26, 62]), 12, 11), W.LEA(f, { fill: P.leath, cast: false })); f.line([add(pc, [-9, 12]), add(pc, [-22, 54])], 1, P.leathL, { op: 0.6, dash: '2 3' });
  const kr = S.at(0.1, 0.86); // ring of keys
  K.ring(f, add(kr, [0, 10]), 8, 8, 2.4, P.iron);
  for (const [dx, l] of [[-4, 30], [3, 36], [8, 26]]) { const k0 = add(kr, [dx, 16]), k1 = add(k0, [dx * 0.4, l]); f.line([k0, k1], 3.6, INK); f.line([k0, k1], 2, P.ironL); f.line([k1, add(k1, [4, 0]), add(k1, [4, -4])], 1.6, P.ironL); }
  const pu = S.at(0.28, 0.9); // the purse of fines, a little drawstring bag, heavy
  f.line([S.at(0.26, 0.82), add(pu, [0, -4])], 1.4, P.leathD);
  f.part([add(pu, [-8, -4]), add(pu, [8, -4]), add(pu, [14, 16]), add(pu, [8, 26]), add(pu, [-8, 26]), add(pu, [-14, 14])], W.LEA(f, { fill: P.leathL, cast: false }));
  f.line([add(pu, [-7, 0]), add(pu, [7, 0])], 1.2, INK, { op: 0.7 }); f.flat(ell(add(pu, [3, 16]), 3, 2, 0, 6), P.greyL, { op: 0.6 });
  f.part([add(S.at(-0.32, 0.9), [0, 0]), add(S.at(-0.32, 0.9), [12, -2]), add(S.at(-0.32, 0.9), [13, 10]), add(S.at(-0.32, 0.9), [1, 12])], { fill: '#e0dccc', shade: 0.3, inkW: 1, cast: false, hatch: false }); // chalk lump in a loop
  // collar: linen falling band over the doublet's standing collar, crusted yellow, a blister
  f.part([S.at(-0.32, -0.04), S.at(0.34, -0.06), S.at(0.5, 0.04), S.at(0.3, 0.12), S.at(-0.2, 0.1)], { fill: linen, shadow: '#5a564a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.part([S.at(0.1, 0.02), S.at(0.5, 0.04), S.at(0.56, 0.14), S.at(0.3, 0.16)], { fill: mix(linen, '#000', 0.06), shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed });
  W.crust(f, S.at(0.3, 0.06), 12, 5, 4, 2.4, 4, { spikes: 0.3 });

  // ---- near leg
  W.legTube(f, HN, KN, lerp(KN, AN, 0.86), [62, 42, 32], { fill: hose, shadow: '#221e1a', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 }, '_n', Object.assign({ A: AN }, LEGB));
  f.bone('thigh_n');
  f.part(X.rag(f, HN, lerp(HN, KN, 0.7), 66, 54, { depth: 6, teeth: 5 }), { fill: doubD, shadow: '#221e18', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }); // breeches
  f.bone('shin_n');
  W.rope(f, [lp(KN, AN, 0.02, -22), lp(KN, AN, 0.04, 0), lp(KN, AN, 0.02, 22)], 2.2, { col: '#6a5a40' }); // garter
  f.flat(ell(lp(KN, AN, 0.5, 6), 6, 10, 0, 8), mix(hose, '#000', 0.4), { op: 0.6 }); f.line([lp(KN, AN, 0.4, 4), lp(KN, AN, 0.6, 8)], 1, '#7a7060', { op: 0.6 }); // a darn
  for (let i = 0; i < 4; i++) f.stroke([lp(KN, AN, 0.78 + i * 0.05, -16), lp(KN, AN, 0.8 + i * 0.05, 0), lp(KN, AN, 0.77 + i * 0.05, 14)], 1.8, mix(hose, '#000', 0.5), { op: 0.7 }); // hose wrinkled at the ankle
  f.line([lp(KN, AN, 0.15, -12), lp(KN, AN, 0.35, -20), lp(KN, AN, 0.6, -14)], 1.4, mix(hose, '#fff', 0.3), { op: 0.5 }); // the calf's swell catching light
  f.bone('thigh_n'); f.line([lp(HN, KN, 0.75, 20), lp(HN, KN, 0.95, 18)], 1.2, mix(hose, '#fff', 0.3), { op: 0.5 });
  f.bone('shin_n');
  shoe(f, KN, AN, 48, '#3a2e24', '_n', { strap: true });

  // ---- head: thin face, puffed with gas, the mouth pursed and the lips blistered, spectacles low, the quill behind the ear
  f.bone('head');
  f.part(limb(neck0, add(HC, [-10, 30]), 42, 36), SKN());
  f.line([lp(neck0, HC, 0.1, -8), lp(neck0, HC, 0.4, -6)], 1.2, P.skinS, { op: 0.6 }); // the cord of the neck
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: mix(skin, '#c8b070', 0.15), jaw: 1.04, chin: 0.03, nose: 1.14, hook: 0.2, mouth: 'set', squint: 0.45, browDown: 0.06, age: true,
    eyeWhite: '#c8bc86', iris: '#1a120c', hairCol: '#4a4034', faceShade: 0.75, faceHatch: false, jawShade: 0.55, lips: true,
    hair: [[-0.42, 0.12], [-0.47, -0.1], [-0.42, -0.3], [-0.32, -0.38], [-0.3, -0.2], [-0.32, 0.04]],
    hairLines: [[[-0.44, -0.08], [-0.36, 0.06]], [[-0.4, -0.26], [-0.34, -0.1]]],
  });
  // the puffed cheek and jowl, swollen soft; blistered lips pursed small
  f.flat(hF([[0.04, 0.12], [0.2, 0.16], [0.26, 0.3], [0.16, 0.4], [0.02, 0.34]]), '#e0c890', { op: 0.25 });
  f.line(hF([[0.06, 0.36], [0.16, 0.44], [0.26, 0.42]]), 1.2, INK, { op: 0.5 });
  f.flat(hF([[0.22, 0.27], [0.28, 0.265], [0.3, 0.29], [0.24, 0.3]]), '#5a2a1e', { op: 0.8 });
  for (const q of [[0.225, 0.272], [0.285, 0.298]]) W.blister(f, hF([q])[0], 1.8, { col: mix(skin, P.sul, 0.4) });
  // comb-over: thin strands laid across the crown from a low parting
  for (const [i, w, l] of [[0, 3.4, 0.16], [1, 1.6, 0.06], [2, 2.6, 0.12], [4, 3, 0.18], [5, 1.4, 0.02], [6, 2.2, 0.1]]) f.stroke(hF([[-0.32, -0.16 - i * 0.03], [-0.12, -0.41 - i * 0.012], [l - (i % 3) * 0.03, -0.45 + i * 0.012]]), w, i % 2 ? '#6a6050' : '#4a4034', { op: 0.9 }); // a few greasy clumps of comb-over, uneven, the scalp between
  f.flat(hF(ell([0.02, -0.38], 0.2, 0.08, 0.1, 12)), mix(skin, '#fff', 0.3), { op: 0.3 }); // scalp shining through
  specs(f, hF, [0.12, -0.02], 0.055);
  f.line(hF([[-0.03, -0.03], [-0.16, 0.02]]), 1.2, P.ironL); // spectacle arm to the ear
  f.line([hF([[-0.16, 0.06]])[0], add(hF([[-0.18, 0.2]])[0], [0, 12]), add(hF([[-0.1, 0.5]])[0], [0, 30]), S.at(0.1, 0.0)], 1, '#3a2e22', { op: 0.8 }); // the spectacle cord
  // the quill behind the ear
  const q0 = hF([[-0.12, 0.12]])[0], q1 = hF([[-0.46, -0.24]])[0], qd = E.norm(sub(q1, q0)), qn = [-qd[1], qd[0]];
  f.part([q0, add(lerp(q0, q1, 0.35), mul(qn, 3)), add(lerp(q0, q1, 0.75), mul(qn, 6)), [...q1, 1], add(lerp(q0, q1, 0.7), mul(qn, -4)), add(lerp(q0, q1, 0.4), mul(qn, -2))], { fill: '#d8d0bc', shadow: '#7a7464', shade: 0.4, inkW: 1, cast: false, hatch: false });
  f.line([q0, q1], 1, '#5a5448'); for (let i = 1; i < 6; i++) f.line([lerp(q0, q1, 0.35 + i * 0.1), add(lerp(q0, q1, 0.3 + i * 0.1), mul(qn, 5))], 0.7, '#7a7464', { op: 0.8 }); f.flat(ell(q0, 1.6, 2.4, 0, 6), '#1a120c');

  // ---- near arm: reaching out; the sleeve stops above the elbow, the sleeve guard burnt off, the forearm charred
  W.armRig(f, SN, EN, WN, [44, 36, 30], SKN({ fill: mix(P.char, skin, 0.25), shadow: '#120c08' }), '_n', { capTop: 0.6 });
  f.bone('upperarm_n');
  f.part(K.chain([add(SN, [0, -6]), lerp(SN, EN, 0.6), lerp(SN, EN, 0.96)], [52, 44, 42]), { fill: doub, shadow: '#26221c', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.stroke([lp(SN, EN, 0.3, 12), lp(SN, EN, 0.6, 8), lp(SN, EN, 0.85, 14)], 2, doubD);
  // the linen sleeve guard, burnt back to a charred ring at the elbow
  f.bone('forearm_n');
  f.part(X.rag(f, lp(EN, WN, -0.04, 0), lp(EN, WN, 0.2, 0), 44, 40, { depth: 7, teeth: 6 }), { fill: linen, shadow: '#5a564a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.flat([lp(EN, WN, 0.12, -20), lp(EN, WN, 0.24, -18), lp(EN, WN, 0.24, 18), lp(EN, WN, 0.12, 20)], P.char, { op: 0.7 });
  W.crust(f, lp(EN, WN, 0.07, -10), 9, 5, 3, 2, 3.4, { spikes: 0 }); // yellow crust on the cuff
  W.crackNet(f, lp(EN, WN, 0.3, 4), ang(EN, WN), 70, 2.2, { depth: 2 });
  W.seam(f, [lp(EN, WN, 0.4, -10), lp(EN, WN, 0.6, -8), lp(EN, WN, 0.8, -12)], 1.6);
  W.flakes(f, lp(EN, WN, 0.6, 0), 20, 10, 4, 0.6);
  W.ash(f, lp(EN, WN, 0.5, -16), 8, 30, 70, 0.7);

  // ---- the steelyard: the hook up through the fist, the beam hanging below it with its notched long arm forward,
  // the counterweight on its loop, the pan hanging on three chains from the short arm
  f.bone('steelyard');
  const hookTop = add(WN, [0, -10]);
  f.line([hookTop, add(WN, [8, -16]), add(WN, [14, -6]), add(WN, [10, 6])], 6, INK); f.line([hookTop, add(WN, [8, -16]), add(WN, [14, -6]), add(WN, [10, 6])], 3.6, P.ironL); // the hook's crook over the fingers
  f.line([hookTop, add(FP, [0, -6])], 6, INK); f.line([hookTop, add(FP, [0, -6])], 3.6, P.ironL);
  const IRON = { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.3, inkHeavy: 2, cast: false, tex: 'mottle' + seed, texOp: 0.6 };
  // the beam: thick at the fulcrum, tapering to the tip, square in section; notches along the top
  const bn = [-bd[1], bd[0]];
  f.part([add(BT, mul(bn, -7)), add(FP, mul(bn, -9)), add(BL, mul(bn, -3.5)), [...add(BL, mul(bd, 4)), 1], add(BL, mul(bn, 3.5)), add(FP, mul(bn, 9)), add(BT, mul(bn, 7)), [...add(BT, mul(bd, -6)), 1]], IRON);
  f.line([add(FP, mul(bn, -3)), add(BL, mul(bn, -1))], 1, '#a8a090', { op: 0.6 });
  for (let i = 1; i < 14; i++) { const q = lerp(FP, BL, i / 14), w = 5 - i * 0.2; f.line([add(q, mul(bn, -w)), add(q, mul(bn, -w + 3))], 1, INK, { op: 0.8 }); }
  f.part([add(FP, [-9, -10]), add(FP, [9, -10]), add(FP, [9, 10]), add(FP, [-9, 10])], Object.assign({}, IRON, { inkW: 1.2 })); // the fulcrum block
  f.rivet(FP, 3.2, P.iron);
  f.flat(ell(lerp(FP, BL, 0.45), 14, 4, bA, 8), P.rust, { op: 0.6 });
  f.scratches(lerp(FP, BL, 0.3), 14, 3, '#b8b0a0', 0.8, bA);
  // the counterweight: a pear-shaped iron poise hanging from a loop on the beam
  f.bone('weight');
  const cwT = add(cw, [0, 8]);
  K.ring(f, cw, 8, 6, 2.6, P.ironL);
  f.line([add(cw, [0, 5]), cwT], 2.6, P.ironL);
  f.part([add(cwT, [-5, 0]), add(cwT, [5, 0]), add(cwT, [14, 22]), add(cwT, [16, 36]), add(cwT, [8, 46]), add(cwT, [-8, 46]), add(cwT, [-16, 36]), add(cwT, [-14, 22])], Object.assign({}, IRON, { inkW: 1.4, inkHeavy: 2.4 }));
  f.flat([add(cwT, [3, 8]), add(cwT, [10, 26]), add(cwT, [9, 38]), add(cwT, [5, 24])], '#a8a090', { op: 0.5 });
  f.line([add(cwT, [-10, 30]), add(cwT, [10, 30])], 1, INK, { op: 0.5 });
  // the pan: three chains to a shallow iron dish heaped with sulphur ore
  f.bone('pan');
  const panC = add(BT, [-4, 132]), pw = 56;
  K.ring(f, BT, 6, 6, 2.4, P.ironL);
  for (const dx of [-pw * 0.9, 0, pw * 0.9]) W.chainLinks(f, [add(BT, [0, 6]), add(panC, [dx, -14])], 8, P.iron);
  W.druse(f, add(panC, [6, -20]), -Math.PI / 2 - 0.3, 26, 4);
  W.crust(f, add(panC, [-10, -16]), 30, 6, 8, 5, 9, { spikes: 0.3 });
  f.part([add(panC, [-pw - 4, -14]), add(panC, [pw + 4, -14]), add(panC, [pw - 6, 6]), add(panC, [0, 14]), add(panC, [-pw + 6, 6])], IRON);
  f.flat([add(panC, [-pw, -12]), add(panC, [pw, -12]), add(panC, [pw - 4, -8]), add(panC, [-pw + 4, -8])], '#a8a090', { op: 0.5 });
  W.glow(f, add(panC, [0, -24]), 36, 16, P.lamp, 0.25);
  // the steelyard fist: cracked, charred, ink-stained fingers round the hook's shank
  f.bone('hand_n');
  const g = B.grip(f, WN, EN, -Math.PI / 2, 22, mix(P.char, skin, 0.3), { tex: 'mottle' + seed, texOp: 0.5, shadow: '#120c08', name: 'weighman hook' });
  W.seam(f, g.F([[-0.6, -0.2], [-0.2, -0.1], [0.1, -0.3]]), 1.2); W.seam(f, g.F([[0.1, 0.1], [0.3, 0.2]]), 0.9, { glow: false });
  f.flat(g.F(ell([0.3, 0.45], 0.14, 0.1, 0, 6)), '#1a1a2a', { op: 0.7 }); // ink stain on the little finger

  f.bone('root');
  f.flat(ell([250, gy + 2], 150, 6, 0, 18), '#3a3020', { op: 0.5 });
  W.crust(f, [110, gy - 3], 26, 4, 3, 3, 5, { spikes: 0.2 });
  return f;
}

// ------------------------------------------------------------------ GAS-BURNER (cast, human 1.0, kneeling)
// The firedamp man, who went into new workings ahead of the shift to burn off the gas. Down on his near knee with his
// back bent low under the gas, he lifts the long ash pole two-handed toward the roof ahead, the iron socket at its tip
// holding a burning tallow candle. A hooded smock of thick sacking soaked in water, steaming, its top scorched and its
// hem charred and curled; a wet cloth over the face with eye slits cut in it, a charred chin below. The hands, the pole
// arm and the back of the neck (bare where the hood rides forward) are charred and split in glowing seams; blisters
// ripen along his back under a tear in the hood and a yellow crust rims the hem. Leather knee pads, a leather water
// bottle for re-soaking the hood, a tinderbox on the rope belt, bare scorched feet.
// Rig: standard humanoid + pole (parent hand_n; the far fist is a second hold: IK in engine) + hood (parent head).
// Motion: idle shuffling forward a hand's length and raising the pole; attack lifting the flame into the gas.
function gasBurner() {
  const seed = 424, h = TIERS.human[1];
  const f = new Fig(W.base(seed, h, { grimeY: 620 }));
  W.textures(f);
  const H = 100, gy = f.o.groundY;
  const skin = mix(P.skin, P.soot, 0.35), charS = mix(P.char, P.skin, 0.25);
  const sack = '#7a6a4e', sackD = '#4e4432', sackW = '#5e5240'; // soaked sacking is darker
  const SACK = (o = {}) => Object.assign({ fill: sackW, shadow: '#2a241a', light: mix(sack, '#fff', 0.15), shade: 0.4, tex: 'weave' + seed, texOp: 0.6 }, o);
  const N = [240, 432], C = [168, 470], Pv = [146, 604];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.1, -0.02), HC = [262, 372], hA = -0.62;
  const pd = E.norm([1, -1]), WN = [440, 428], WF = add(WN, mul(pd, 72));
  const SN = S.at(0.15, 0.12), EN = [345, 410];
  const SF = S.at(0.4, 0.06), EF = [386, 352];
  const HN = [142, 610], KN = [186, 766], AN = [52, 754];
  const HF = [160, 600], KF = [272, 584], AF = [290, 746];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const pA = Math.atan2(pd[1], pd[0]), tip = add(WN, mul(pd, 168)), butt = add(WN, mul(pd, -250));
  f.joint('pole', WN, 'hand_n').joint('hood', neck0, 'head');

  // ---- far arm: raised to the pole, behind the hooded head; sacking sleeve to the forearm, the hand charred
  W.armRig(f, SF, EF, WF, [40, 34, 28], { fill: charS, shadow: '#120c08', shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 }, '_f', { capTop: 0.6 });
  // a heavy wet fold of sacking hanging plumb from the underside of a sleeve, its hem ragged and dripping
  const drape = (A0, B0, wA, wB, len, look) => {
    const d = E.norm(sub(B0, A0)), n0 = [-d[1], d[0]], dn = n0[1] > 0 ? n0 : mul(n0, -1), a = add(A0, mul(dn, wA / 2 - 6)), b = add(B0, mul(dn, wB / 2 - 6));
    const pts = [a, lerp(a, b, 0.5), b, add(b, [-2, len * 0.5]), [...add(lerp(a, b, 0.8), [0, len * 1.05]), 1], add(lerp(a, b, 0.62), [3, len * 0.8]), [...add(lerp(a, b, 0.45), [0, len * 1.2]), 1], add(lerp(a, b, 0.28), [-2, len * 0.85]), [...add(lerp(a, b, 0.12), [0, len * 0.9]), 1], add(a, [2, len * 0.3])];
    f.part(pts, look);
    for (const t of [0.25, 0.5, 0.75]) f.stroke([lerp(a, b, t), add(lerp(a, b, t), [1, len * 0.9])], 3, mix(sackW, '#000', 0.55), { op: 0.7 });
    W.drip(f, add(lerp(a, b, 0.45), [0, len * 1.2]), 0.4, '#8a9aa0');
  };
  f.bone('upperarm_f'); f.part(K.chain([add(SF, [0, -4]), lerp(SF, EF, 0.6), add(EF, [0, 4])], [62, 48, 46], { bp: [[0, 0.35, 0.1]], bq: [[0, 0.5, 0.12]] }), SACK({ fill: mix(sackW, '#000', 0.25) }));
  drape(SF, EF, 60, 46, 26, SACK({ fill: mix(sackW, '#000', 0.3), cast: false }));
  for (const t of [0.3, 0.55, 0.8]) f.stroke([lp(SF, EF, t - 0.05, -26), lp(SF, EF, t, 0), lp(SF, EF, t + 0.04, 24)], 3, mix(sackW, '#000', 0.6), { op: 0.7 });
  f.bone('forearm_f'); f.part(X.rag(f, lp(EF, WF, -0.05, 0), lp(EF, WF, 0.36, 0), 42, 38, { depth: 8, teeth: 5 }), SACK({ fill: mix(sackW, '#000', 0.25) }));
  W.seam(f, [lp(EF, WF, 0.55, -6), lp(EF, WF, 0.7, -2), lp(EF, WF, 0.85, -6)], 1.4);

  // ---- far leg: forward, knee up, the foot planted; sacking trousers rolled to mid-shin, the shin and foot bare
  const cuF = lerp(KF, AF, 0.42);
  W.legTube(f, HF, KF, cuF, [70, 54, 50], SACK({ fill: mix(sackD, '#000', 0.2) }), '_f', { A: AF, bp: [[0, 0.4, 0.08]], bq: [[0, 0.5, 0.14]], after: () => { for (const t of [0.55, 0.75, 0.92]) f.stroke([lp(HF, KF, t - 0.05, -30), lp(HF, KF, t, 0), lp(HF, KF, t + 0.05, 28)], 3.2, mix(sackD, '#000', 0.6), { op: 0.7 }); for (const t of [0.15, 0.4]) f.stroke([lp(KF, cuF, t, -24), lp(KF, cuF, t + 0.06, 0), lp(KF, cuF, t, 22)], 2.6, mix(sackD, '#000', 0.6), { op: 0.6 }); } }); // folds dragged into the knee
  f.bone('shin_f');
  K.bareLeg(f, cuF, AF, 1, 44, 40, W.SK(f, { fill: mix(skin, '#000', 0.25) }));
  f.part(X.rag(f, lp(KF, AF, 0.1, 0), lp(KF, AF, 0.44, 0), 54, 50, { depth: 6, teeth: 5 }), SACK({ fill: mix(sackD, '#000', 0.2) }));
  f.part(ell(add(KF, [10, -6]), 30, 26, -0.2, 12), W.LEA(f, { fill: P.leathD, cast: false })); // knee pad
  W.rope(f, [add(KF, [-22, 18]), add(KF, [4, 24]), add(KF, [28, 14])], 2.2, { col: '#6a5a40' });

  // ---- the pole, behind the near arm and in front of the body: ash, an iron socket at the tip, a tallow candle burning
  f.bone('pole');
  f.part(limb(butt, tip, 15, 12, { steps: 10, capK: 0.6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(butt, tip, 0.03, -4), lp(butt, tip, 0.97, -3)], 1, P.woodL, { op: 0.6, straight: true });
  for (const t of [0.12, 0.3, 0.55, 0.62, 0.8]) f.line([lp(butt, tip, t, -6), lp(butt, tip, t + 0.01, 6)], 1, INK, { op: 0.45, straight: true });
  f.flat([lp(butt, tip, 0.86, -7), lp(butt, tip, 1.0, -6), lp(butt, tip, 1.0, 6), lp(butt, tip, 0.86, 7)], P.char, { op: 0.8 }); // the charred tip of the shaft
  const TF = frame(tip, pA, 1);
  f.part(TF([[-28, -9], [4, -9], [10, -12], [10, 12], [4, 9], [-28, 9]]), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, inkHeavy: 2, cast: false, tex: 'mottle' + seed, texOp: 0.5 }); // socket ferrule
  for (const x of [-20, -8]) f.rivet(TF([[x, 0]])[0], 2, P.iron);
  // the candle socket: an iron cup on a short stem bent upright, so the candle stands plumb whatever the pole does
  const cup = add(TF([[14, 0]])[0], [8, -14]);
  f.line([TF([[10, 0]])[0], add(cup, [-4, 10]), add(cup, [0, 4])], 5, INK); f.line([TF([[10, 0]])[0], add(cup, [-4, 10]), add(cup, [0, 4])], 3, P.ironL);
  f.part([add(cup, [-11, -6]), add(cup, [11, -6]), add(cup, [8, 6]), add(cup, [-8, 6])], { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false });
  const cnd = [[-7, -6], [7, -6], [6, -40], [3, -44], [-6, -42]].map(q => add(cup, q));
  f.part(cnd, { fill: '#d8ccaa', shadow: '#8a7e60', shade: 0.4, inkW: 1.1, cast: false, hatch: false });
  for (const [x, l] of [[-6, 22], [5, 30], [0, 14]]) f.line([add(cup, [x, -40]), add(cup, [x + 1, -40 + l])], 3, '#e8dcbc', { op: 0.9 }); // tallow runs
  f.line([add(cup, [0, -44]), add(cup, [1, -50])], 1.6, INK);
  X.flame(f, add(cup, [1, -50]), 46, { w: 12, lean: -0.1, phase: 1.3, glowOp: 0.3 });
  // a wet strip of rag tied below the socket
  f.part(TF([[-44, -10], [-32, -10], [-30, 10], [-44, 11]]), SACK({ inkW: 1, cast: false }));
  f.line(TF([[-40, 10], [-46, 34], [-40, 52]]), 3, sackW); f.line(TF([[-36, 10], [-34, 28]]), 2.6, sackW);

  // ---- torso under the soaked smock: the back bent low and round, the smock hanging from it in heavy wet folds
  f.bone('torso');
  const TOR = S.shape([[-0.06, 0.36, 0.36], [0.1, 0.56, 0.44], [0.35, 0.6, 0.48], [0.6, 0.54, 0.48], [0.85, 0.52, 0.54], [1.0, 0.56, 0.56]]);
  f.part(TOR, SACK({ maxShade: 40 }));
  W.clipDraw(f, TOR, () => {
    f.raw(`<path d="${E.smooth(TOR)}" fill="url(#soot${seed})" opacity="0.5"/>`);
    for (const [a, b2, c] of [[[-0.55, 0.1], [-0.3, 0.4], [0.0, 0.62]], [[-0.62, 0.38], [-0.4, 0.6], [-0.2, 0.78]], [[-0.1, 0.12], [0.1, 0.3], [0.3, 0.42]]]) { f.stroke([S.at(...a), S.at(...b2), S.at(...c)], 5, mix(sackW, '#000', 0.55), { op: 0.8 }); f.line([S.at(a[0] - 0.08, a[1]), S.at(b2[0] - 0.08, b2[1]), S.at(c[0] - 0.08, c[1])], 1.6, mix(sack, '#fff', 0.2), { op: 0.45 }); } // wet folds dragged from the hump
    for (const v of [0.5, 0.62, 0.72]) f.stroke([S.at(0.2, v), S.at(0.4, v + 0.03), S.at(0.6, v)], 4, mix(sackW, '#000', 0.5), { op: 0.7 }); // compression rolls at the bent belly
    f.raw(`<ellipse cx="${S.at(-0.45, 0.2)[0].toFixed(1)}" cy="${S.at(-0.45, 0.2)[1].toFixed(1)}" rx="40" ry="26" fill="${mix(sack, '#fff', 0.2)}" opacity="0.35" filter="url(#glow${seed})"/>`); // the hump catching the light
    f.flat([S.at(-0.7, 0.05), S.at(-0.2, 0.0), S.at(0.0, 0.3), S.at(-0.66, 0.4)], P.char, { op: 0.45 }); // scorched top
    f.flat([S.at(-0.6, 0.65), S.at(0.6, 0.6), S.at(0.6, 1.1), S.at(-0.6, 1.1)], '#1a140e', { op: 0.25 }); // the hem wetter, darker
    for (let i = 0; i < 30; i++) { const q = W.scatter(f, S.at(0, 0.45), 60, 70); f.line([q, add(q, [3, 1])], 1.2, mix(sack, '#fff', 0.2), { op: 0.35 }); } // coarse slubs in the weave
  });
  // a tear across the hump of the back: under it the skin is charred, split, blistered
  const tr = S.at(-0.45, 0.28), TR = [add(tr, [-18, -12]), add(tr, [16, -16]), add(tr, [26, 2]), add(tr, [6, 14]), add(tr, [-14, 10])];
  f.part(TR, W.SK(f, { fill: charS, shadow: '#0e0a08', cast: false }));
  W.seam(f, [add(tr, [-12, -6]), add(tr, [0, -2]), add(tr, [16, -8])], 1.6); W.blisters(f, add(tr, [4, 6]), 10, 4, 3, 2.4, 4);
  f.line(TR.concat([TR[0]]), 2, P.char); f.line([TR[0], TR[1]], 1.2, P.ember, { op: 0.7 });
  // the smock's hem below the rope belt: charred, split and curled, a yellow crust along it
  const HM = [S.at(-0.6, 0.82), S.at(0.6, 0.8), add(S.at(0.62, 1.0), [10, 30]), [...add(S.at(0.4, 1.0), [6, 46]), 1], add(S.at(0.2, 1.0), [0, 36]), [...add(S.at(0.0, 1.0), [-2, 50]), 1], add(S.at(-0.3, 1.0), [-4, 38]), [...add(S.at(-0.6, 1.0), [-10, 44]), 1], add(S.at(-0.66, 0.95), [-8, 12])];
  f.part(HM, SACK({ fill: mix(sackW, '#000', 0.1) }));
  f.raw(`<path d="${E.smooth(HM)}" fill="url(#soot${seed})" opacity="0.6"/>`);
  for (const t of [-0.3, 0.1, 0.4]) f.stroke([S.at(t, 0.85), add(S.at(t, 1.0), [0, 30])], 3, mix(sackW, '#000', 0.5));
  for (const q of [add(S.at(0.4, 1.0), [6, 46]), add(S.at(0.0, 1.0), [-2, 50]), add(S.at(-0.6, 1.0), [-10, 44])]) { f.flat([add(q, [-10, -12]), q, add(q, [10, -14]), add(q, [0, -4])], P.char, { op: 0.9 }); W.seam(f, [add(q, [-8, -10]), q, add(q, [7, -11])], 1.1, { glowOp: 0.25 }); }
  W.crust(f, add(S.at(0.0, 1.0), [-4, 34]), 50, 8, 9, 3, 6, { spikes: 0.25 });
  // rope belt, knotted, the tinderbox and the water bottle hanging from it
  const rb = [S.at(-0.66, 0.76), S.at(-0.2, 0.8), S.at(0.3, 0.79), S.at(0.62, 0.74)];
  W.rope(f, rb, 4, { col: '#8a7650' });
  const kn = S.at(0.3, 0.79); f.part(ell(kn, 7, 6, 0, 8), { fill: '#7a6848', shade: 0.4, inkW: 1, cast: false }); W.rope(f, [kn, add(kn, [6, 24]), add(kn, [2, 40])], 3, { col: '#7a6848' });
  const tb = add(S.at(-0.1, 0.84), [0, 10]); // tinderbox: a small tin box with a hinged lid on a thong
  f.line([S.at(-0.1, 0.8), tb], 1.6, P.leathD);
  f.part([add(tb, [-12, 0]), add(tb, [12, -2]), add(tb, [13, 18]), add(tb, [-11, 20])].map(q => [...q, 1]), { fill: P.greyL, shadow: P.greyD, shade: 0.42, inkW: 1.1, cast: false, tex: 'mottle' + seed });
  f.line([add(tb, [-12, 5]), add(tb, [12, 3])], 1, INK, { op: 0.7 }); f.flat(ell(add(tb, [0, 12]), 3, 2, 0, 6), P.iron);
  const wb = add(S.at(-0.55, 0.88), [-6, 6]); // the water bottle: a leather costrel, its stopper on a thong
  f.line([S.at(-0.5, 0.78), add(wb, [4, -18])], 2.4, P.leathD);
  f.part([add(wb, [-18, -16]), add(wb, [12, -20]), add(wb, [22, 6]), add(wb, [14, 34]), add(wb, [-10, 38]), add(wb, [-24, 14])], W.LEA(f, { fill: P.leath }));
  f.line([add(wb, [-16, -10]), add(wb, [-20, 14]), add(wb, [-8, 34])], 1, P.leathL, { op: 0.6, dash: '2 3' });
  f.part([add(wb, [-2, -28]), add(wb, [8, -28]), add(wb, [8, -18]), add(wb, [-2, -18])], { fill: P.wood, shade: 0.4, inkW: 1, cast: false });
  f.flat(ell(add(wb, [4, 22]), 8, 5, 0.4, 8), '#1a140c', { op: 0.4 }); W.drip(f, add(wb, [6, 38]), 0.5, '#8a9aa0');

  // ---- near leg: kneeling, the knee on the ground on its pad, the shin flat behind, the foot's toes bent under
  f.bone('thigh_n');
  const TH = K.chain([HN, KN], [74, 56], { steps: 10, bp: [[0, 0.35, 0.08, 0.2]], bq: [[0, 0.45, 0.16]] });
  f.part(TH, SACK({ fill: sackD }));
  W.clipDraw(f, TH, () => { for (const t of [0.35, 0.55, 0.75, 0.88]) f.stroke([lp(HN, KN, t - 0.06, -34), lp(HN, KN, t, 0), lp(HN, KN, t + 0.04, 30)], 3.4, mix(sackD, '#000', 0.5), { op: 0.75 }); f.line([lp(HN, KN, 0.1, -18), lp(HN, KN, 0.5, -24), lp(HN, KN, 0.85, -16)], 1.6, mix(sack, '#fff', 0.15), { op: 0.5 }); }); // folds dragged into the bent knee
  f.joint('shin_n', KN, 'thigh_n');
  split(f, () => {
    f.part(K.chain([KN, lerp(KN, AN, 0.5)], [52, 46], { steps: 8, bp: [[0, 0.3, 0.12]] }), SACK({ fill: sackD }));
    f.part(K.chain([lerp(KN, AN, 0.42), AN, add(AN, [-8, 2])], [40, 32, 30], { steps: 8, bq: [[0, 0.3, 0.2]] }), W.SK(f, { fill: skin }));
  }, [['shin_n', side(AN, [1, 0], 18)]]);
  f.bone('shin_n');
  f.part(X.rag(f, lerp(KN, AN, 0.2), lerp(KN, AN, 0.5), 54, 50, { depth: 6, teeth: 5 }), SACK({ fill: sackD }));
  f.part(ell(add(KN, [4, -4]), 32, 26, 0.1, 12), W.LEA(f, { fill: P.leath })); // the knee pad, planted
  f.line([add(KN, [-20, -14]), add(KN, [26, -18])], 1.2, P.leathL, { op: 0.6, dash: '2 3' });
  W.rope(f, [add(KN, [-28, -24]), add(KN, [-2, -34]), add(KN, [24, -30])], 2.2, { col: '#6a5a40' });
  f.bone('foot_n');
  // bare foot with the toes bent under: heel up, the sole facing back, the ball and toes on the ground
  const A0 = AN, FT = [add(A0, [6, -14]), add(A0, [-10, -16]), add(A0, [-24, -6]), add(A0, [-30, 12]), add(A0, [-30, 28]), add(A0, [-26, 36]), add(A0, [-12, 38]), [...add(A0, [10, 38]), 1], add(A0, [12, 30]), add(A0, [6, 20]), add(A0, [10, 4])];
  f.part(FT, W.SK(f, { fill: mix(skin, '#000', 0.05) }));
  f.flat([add(A0, [-22, -2]), add(A0, [-28, 14]), add(A0, [-28, 28]), add(A0, [-20, 20]), add(A0, [-18, 4])], '#5a4232', { op: 0.6 }); // the scorched sole
  for (let i = 0; i < 4; i++) f.line([add(A0, [-14 + i * 6, 30]), add(A0, [-12 + i * 6, 37])], 1, INK, { op: 0.6 });
  W.hairline(f, [add(A0, [-26, 6]), add(A0, [-24, 18]), add(A0, [-27, 26])], 0.9);
  f.line([add(A0, [-8, -12]), add(A0, [-20, -2])], 1, INK, { op: 0.5 }); // Achilles

  // ---- head under the soaked hood: the face cloth with its eye slits, the charred chin, the scorched hood top steaming
  f.bone('head');
  f.part(limb(neck0, add(HC, [-6, 30]), 46, 40), W.SK(f, { fill: charS }));
  W.seam(f, [lp(neck0, HC, 0.1, -16), lp(neck0, HC, 0.3, -20), lp(neck0, HC, 0.45, -14)], 1.8); // the back of the neck split where the hood rides forward
  W.seam(f, [lp(neck0, HC, 0.3, -20), lp(neck0, HC, 0.36, -8)], 1, { glow: false });
  const hF = frame(HC, hA, H);
  // the face under the hood: a charred jaw and chin, the mouth a split; over it the wet cloth from the brow to the lip
  const FACE = hF([[0.08, -0.26], [0.4, -0.26], [0.45, -0.06], [0.46, 0.12], [0.42, 0.3], [0.36, 0.44], [0.22, 0.5], [0.08, 0.44]]);
  f.part(FACE, W.SK(f, { fill: charS, shadow: '#0e0a08', maxShade: 12 }));
  f.line(hF([[0.3, 0.33], [0.4, 0.31]]), 1.6, INK); // the mouth's corner
  W.seam(f, hF([[0.18, 0.44], [0.26, 0.46], [0.34, 0.42]]), 1.2); W.seam(f, hF([[0.36, 0.36], [0.42, 0.26]]), 1, { glow: false });
  f.flat(hF([[0.1, 0.36], [0.3, 0.4], [0.2, 0.48], [0.1, 0.44]]), '#000', { op: 0.35 }); // under the jaw
  for (let i = 0; i < 6; i++) f.line(hF([[0.16 + i * 0.04, 0.38 + (i % 2) * 0.03], [0.17 + i * 0.04, 0.42 + (i % 2) * 0.03]]), 0.8, '#3a2e24', { op: 0.8 }); // singed stubble
  f.bone('hood');
  const CL = hF([[0.1, -0.32], [0.44, -0.32], [0.49, -0.12], [0.5, 0.08], [0.48, 0.2], [0.44, 0.27, 1], [0.4, 0.22], [0.34, 0.29, 1], [0.28, 0.23], [0.2, 0.28, 1], [0.13, 0.22], [0.08, 0.0]]);
  f.part(CL, { fill: '#4e4436', shadow: '#2a241a', shade: 0.42, tex: 'weave' + seed, texOp: 0.65, maxShade: 12 });
  W.clipDraw(f, CL, () => { for (const x of [0.2, 0.3, 0.4]) f.stroke(hF([[x, -0.3], [x + 0.01, -0.05], [x - 0.01, 0.25]]), 2.2, '#3a3226', { op: 0.5 }); f.flat(hF([[0.1, 0.1], [0.5, 0.1], [0.5, 0.3], [0.1, 0.3]]), '#2a2218', { op: 0.35 }); });
  for (const [ex, r] of [[[0.3, -0.12], 0.065], [[0.46, -0.12], 0.03]]) { const sl = hF([add(ex, [-r, 0.004]), add(ex, [0, -0.026]), add(ex, [r, 0.0]), add(ex, [0, 0.02])]); f.flat(sl, '#0a0606'); f.line([sl[0], sl[1], sl[2]], 1, '#b8a888', { op: 0.6 }); }
  f.flat(hF(ell([0.31, -0.115], 0.012, 0.01, 0, 6)), '#c8a860', { op: 0.9 }); // an eye catching the candle through the slit
  for (const q of [[0.44, 0.27], [0.34, 0.29], [0.2, 0.28]]) W.drip(f, add(hF([q])[0], [0, 1]), 0.45, '#8a9aa0');
  // the hood: a deep sacking cowl, a peak over the brow, the sides hiding the cheeks and ears, the top scorched black
  const HD = hF([[0.5, -0.36], [0.3, -0.56], [0.0, -0.66], [-0.3, -0.6], [-0.52, -0.4], [-0.6, -0.05], [-0.54, 0.34], [-0.34, 0.64], [-0.08, 0.78], [0.12, 0.66], [0.08, 0.4], [0.06, 0.1], [0.12, -0.2], [0.3, -0.32], [0.46, -0.32]]);
  f.part(HD, SACK({ maxShade: 26 }));
  W.clipDraw(f, HD, () => {
    f.flat(hF([[0.5, -0.36], [0.3, -0.56], [0.0, -0.66], [-0.3, -0.6], [-0.5, -0.42], [-0.3, -0.42], [0.0, -0.48], [0.3, -0.42]]), P.char, { op: 0.8 });
    for (const [a, b2] of [[[-0.2, -0.5], [-0.4, 0.4]], [[0.02, -0.5], [-0.2, 0.6]], [[-0.46, -0.2], [-0.48, 0.3]]]) f.stroke(hF([a, lerp(a, b2, 0.5), b2]), 3, mix(sackW, '#000', 0.55));
    f.stroke(hF([[0.4, -0.3], [0.16, -0.18], [0.1, 0.1], [0.1, 0.5]]), 5, '#120e0a', { op: 0.6 }); // the opening's inner shadow
  });
  f.line(hF([[0.48, -0.35], [0.3, -0.33], [0.13, -0.2], [0.08, 0.1], [0.1, 0.5]]), 1.4, mix(sack, '#fff', 0.2), { op: 0.5 }); // the lit rolled edge of the opening
  W.flakes(f, hF([[0.0, -0.5]])[0], 30, 12, 6, 0.8);
  W.hairline(f, hF([[0.3, -0.42], [0.1, -0.5], [-0.1, -0.52]]), 1.2);
  W.crust(f, hF([[-0.3, 0.66]])[0], 16, 6, 4, 3, 5, { spikes: 0.3 });
  // steam rising off the soaked hood (on the figure, as on the World IV miners' gas)
  W.smoke(f, hF([[-0.1, -0.62]])[0], 150, 26, { col: '#a8a090', op: 0.3, sway: -14, drift: -20, phase: 0.6 });
  W.smoke(f, hF([[-0.45, -0.4]])[0], 110, 20, { col: '#a8a090', op: 0.26, sway: 10, drift: -30, phase: 2.1 });

  // ---- near arm: raised to the pole, sleeve to mid forearm, the forearm and hand charred and split
  f.bone('torso');
  W.armRig(f, SN, EN, WN, [50, 40, 32], W.SK(f, { fill: charS, shadow: '#0e0a08' }), '_n', { capTop: 0.6 });
  f.bone('upperarm_n');
  f.part(K.chain([add(SN, [-2, -8]), lerp(SN, EN, 0.6), add(EN, [2, 4])], [64, 50, 46], { bp: [[0, 0.3, 0.1]], bq: [[0, 0.35, 0.14]] }), SACK());
  drape(SN, EN, 62, 48, 34, SACK({ fill: mix(sackW, '#000', 0.08) }));
  f.stroke([lp(SN, EN, 0.25, -14), lp(SN, EN, 0.55, -8), lp(SN, EN, 0.85, -14)], 2.6, mix(sackW, '#000', 0.5));
  f.bone('forearm_n');
  f.part(X.rag(f, lp(EN, WN, -0.06, 0), lp(EN, WN, 0.38, 0), 48, 50, { depth: 10, teeth: 6 }), SACK());
  drape(lp(EN, WN, -0.02, 0), lp(EN, WN, 0.32, 0), 46, 48, 22, SACK({ fill: mix(sackW, '#000', 0.08), cast: false }));
  for (const t of [0.04, 0.14, 0.24]) f.stroke([lp(EN, WN, t, -22), lp(EN, WN, t + 0.03, 0), lp(EN, WN, t, 22)], 2.4, mix(sackW, '#000', 0.5), { op: 0.7 }); // the sleeve bunched in rings at the elbow
  f.stroke([lp(EN, WN, -0.02, -8), lp(EN, WN, 0.12, 4), lp(EN, WN, 0.26, -6)], 2, mix(sackW, '#000', 0.5));
  W.crackNet(f, lp(EN, WN, 0.42, 2), ang(EN, WN), 50, 2, { depth: 1 });
  W.flakes(f, lp(EN, WN, 0.6, 0), 12, 8, 3, 0.6);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, pA, 22, charS, { tex: 'mottle' + seed, texOp: 0.5, shadow: '#0e0a08', name: 'burner near' });
  W.seam(f, gN.F([[-0.6, -0.1], [-0.2, 0.0], [0.1, -0.2]]), 1.1);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, pA, 21, charS, { tex: 'mottle' + seed, texOp: 0.5, shadow: '#0e0a08', name: 'burner far' });
  W.seam(f, gF.F([[-0.6, 0.1], [-0.1, 0.0]]), 1);

  f.bone('root');
  f.flat(ell([180, gy + 2], 170, 6, 0, 18), '#3a3020', { op: 0.5 });
  W.crust(f, [440, gy - 3], 30, 4, 4, 3, 6, { spikes: 0.2 });
  return f;
}

// ------------------------------------------------------------------ PIT BOY (cast, small 0.6)
// A carrying boy who hauled ore up the mine stairs from the age of seven, and is still seven. Bent nearly double under
// a sack of brimstone bigger than his torso, his legs bowed and the knees out; the near hand braced on the near knee,
// the far hand over his shoulder gripping the twisted neck of the sack. A thin child in a ragged shirt cut down from a
// man's, hanging plumb off his bent body, and a loincloth; a leather pad on the shoulder scorched through; a cord round
// the waist with a wooden count token; a rag round the near knee; bare feet with cracked soles. Fire has charred and
// split his shoulders and the back of his neck where the hot ore rode; toxin has swollen the knees with blisters and
// crusted the mouth and nostrils yellow. A gaunt old-young face, cropped hair, eyes squinting.
// Rig: standard humanoid + sack (parent torso; the far fist on its neck is a second hold: IK in engine).
// Motion: idle a panting rest, hitching the sack higher; attack tipping the sack and hurling a burning lump of ore.
function pitBoy() {
  const seed = 425, h = TIERS.small[1];
  const f = new Fig(W.base(seed, h, { grimeY: 660 }));
  W.textures(f);
  const H = 76, gy = f.o.groundY; // a seven-year-old: the head large for the body
  const skin = mix(P.skin, '#c8b090', 0.15), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, maxShade: 14 }, o));
  const shirt = '#8a8068', shirtD = '#5a5444';
  const N = [372, 566], C = [300, 548], Pv = [262, 610];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.0, 0.0), HC = [404, 600], hA = 0.55;
  const SN = S.at(0.2, 0.14), EN = [330, 644], WN = [318, 690];
  const SF = S.at(-0.1, 0.1), EF = [410, 530], WF = [398, 480];
  const HN = [272, 616], KN = [332, 690], AN = [320, 762]; // bowed, the knees out, a staggering step: a clear gap between the legs
  const HF = [252, 612], KF = [236, 694], AF = [190, 762];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('sack', S.at(-0.4, 0.4), 'torso');

  // ---- far arm: raised over the shoulder to the sack's neck (drawn with the sack, later); far leg
  const LEGL = SKN({ fill: mix(skin, P.soot, 0.3) });
  W.legRig(f, HF, KF, AF, 30, 28, 22, LEGL, '_f', { thigh: 0.1, calf: 1.4 });
  f.bone('shin_f'); W.blisters(f, add(KF, [8, 4]), 8, 8, 3, 2.4, 4);
  f.bone('foot_f'); f.line([[AF[0] - 10, gy - 2], [AF[0] + 22, gy - 3]], 1.2, '#6a4a30', { op: 0.8 }); // cracked sole edge

  // ---- torso: a thin child's back, nearly horizontal, the shirt hanging plumb from it
  f.bone('torso');
  const TOR = S.shape([[-0.05, 0.36, 0.34], [0.15, 0.44, 0.44], [0.4, 0.42, 0.46], [0.7, 0.4, 0.4], [0.95, 0.42, 0.42]]);
  f.part(TOR, SKN({ fill: mix(skin, P.soot, 0.15), maxShade: 16 }));
  W.clipDraw(f, TOR, () => { for (let i = 0; i < 5; i++) f.line([S.at(0.3, 0.12 + i * 0.12), S.at(0.1, 0.16 + i * 0.12)], 1, INK, { op: 0.45 }); }); // ribs showing
  // the shirt: a man's shirt hacked short, hanging straight down from the bent back in a torn curtain
  const sh0 = S.at(-0.36, 0.1), sh1 = S.at(-0.4, 0.9);
  const SHI = [S.at(-0.38, 0.02), S.at(-0.42, 0.5), S.at(-0.4, 0.95), add(S.at(0.3, 0.95), [0, 40]), [...add(S.at(0.3, 0.8), [2, 64]), 1], add(S.at(0.3, 0.6), [0, 50]), [...add(S.at(0.3, 0.45), [6, 70]), 1], add(S.at(0.3, 0.3), [2, 52]), [...add(S.at(0.3, 0.12), [8, 60]), 1], add(S.at(0.4, 0.0), [6, 20]), S.at(0.2, -0.02)];
  f.part(SHI, { fill: shirt, shadow: '#3a362c', shade: 0.4, tex: 'weave' + seed, texOp: 0.55 });
  f.raw(`<path d="${E.smooth(SHI)}" fill="url(#soot${seed})" opacity="0.6"/>`);
  for (const t of [0.25, 0.5, 0.75]) f.stroke([S.at(-0.2, t), add(S.at(0.3, t), [0, 46])], 2.4, shirtD); // plumb folds
  f.part([add(S.at(0.0, 0.55), [0, 14]), add(S.at(0.0, 0.7), [0, 14]), add(S.at(0.0, 0.7), [0, 36]), add(S.at(0.0, 0.55), [0, 36])].map(q => [...q, 1]), { fill: mix(shirt, P.och, 0.35), shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed }); // patch
  f.stitches([add(S.at(0.0, 0.55), [0, 14]), add(S.at(0.0, 0.7), [0, 14]), add(S.at(0.0, 0.7), [0, 36]), add(S.at(0.0, 0.55), [0, 36]), add(S.at(0.0, 0.55), [0, 14])], '#c8bca0', 0.7);
  // waist cord with the wooden count token, and the loincloth
  f.bone('pelvis');
  const LC = [add(Pv, [-28, -14]), add(Pv, [20, -18]), add(Pv, [26, 10]), add(Pv, [14, 34]), [...add(Pv, [6, 48]), 1], add(Pv, [-6, 34]), add(Pv, [-24, 18])];
  f.part(LC, { fill: P.canvas, shadow: '#2e2820', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.rope(f, [add(Pv, [-30, -12]), add(Pv, [0, -16]), add(Pv, [24, -18])], 2.4, { col: '#7a6a48' });
  const tk = add(Pv, [14, -8]); f.line([tk, add(tk, [2, 12])], 1.2, '#6a5a40');
  f.part([add(tk, [-5, 12]), add(tk, [8, 11]), add(tk, [9, 26]), add(tk, [-4, 27])].map(q => [...q, 1]), { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1, cast: false, tex: 'wood' + seed, texOp: 0.4 });
  for (let i = 0; i < 3; i++) f.line([add(tk, [-2 + i * 3, 15]), add(tk, [-2 + i * 3, 23])], 0.9, INK, { op: 0.8 }); // notches

  // ---- the sack: heaped on the bent back, bigger than his torso, lumps and crystals poking through the holes
  f.bone('sack');
  const sk0 = [300, 500];
  // a long sack lying along the bent back from the shoulders to past the hips, the heavy end overhanging behind and
  // drooping to a corner, the twisted neck at the front over the shoulder: a sack, not an egg
  const SK = [[392, 500], [378, 470], [352, 458], [334, 444], [304, 440], [286, 426], [256, 430], [232, 416], [204, 426], [178, 428], [154, 446], [128, 452], [110, 478], [96, 500], [88, 546], [96, 590], [110, 630, 1], [132, 610], [164, 596], [214, 584], [262, 572], [312, 560], [356, 546], [388, 526]];
  const SKL = W.lumpy(f, SK, 6); // the ore lumps break the top contour
  f.part(SKL, { fill: P.canvas, shadow: '#2e2820', light: P.canvasL, shade: 0.4, tex: 'weave' + seed, texOp: 0.6, maxShade: 30 });
  W.clipDraw(f, SKL, () => {
    f.raw(`<path d="${E.smooth(SKL)}" fill="url(#soot${seed})" opacity="0.4"/>`);
    // lumps of ore pressing out through the cloth: a lit top, a shadow under each; the cloth pulled taut between them
    for (const [q, r] of [[[150, 480], 26], [[210, 458], 30], [[272, 456], 28], [[330, 470], 22], [[120, 540], 24], [[180, 530], 28], [[248, 518], 26], [[310, 520], 22], [[140, 590], 18], [[220, 566], 18]]) { f.stroke([add(q, [-r * 0.95, r * 0.1]), add(q, [-r * 0.4, r * 0.7]), add(q, [r * 0.4, r * 0.72]), add(q, [r * 0.95, r * 0.15])], r * 0.32, '#16120c', { op: 0.6 }); f.flat(ell(add(q, [r * 0.15, -r * 0.2]), r * 0.55, r * 0.34, -0.3, 10), P.canvasL, { op: 0.55 }); f.line([add(q, [-r * 0.3, -r * 0.45]), add(q, [r * 0.2, -r * 0.55]), add(q, [r * 0.6, -r * 0.3])], 1.4, '#b8a880', { op: 0.6 }); } // each lump of ore pressing the cloth out: its lit top, the crease of shadow round its underside
    for (const [a0, b0] of [[[180, 460], [200, 540]], [[240, 440], [236, 530]], [[300, 450], [290, 536]], [[110, 500], [150, 590]]]) f.line([a0, lerp(a0, b0, 0.5), b0], 1.2, P.canvasD, { op: 0.6 }); // strain creases between the lumps
    f.flat(ell([230, 500], 120, 50, 0.1, 14), P.sulD, { op: 0.22 }); // sulphur staining through the weave
    f.flat([[80, 560], [400, 520], [400, 620], [80, 680]], '#1a140e', { op: 0.35 }); // the underside
  });
  // ragged holes with brimstone poking through: a torn rim, dark inside, crystals and lumps
  for (const [c0, a, sz] of [[[190, 440], -2.0, 15], [[320, 452], -1.2, 13], [[104, 530], 2.8, 13]]) {
    const hole = W.lumpy(f, ell(c0, sz * 0.9, sz * 0.6, a, 10), 3);
    f.flat(hole, '#16120e'); f.line(hole.concat([hole[0]]), 1.4, P.canvasL, { op: 0.6 });
    W.druse(f, c0, a, sz * 0.9, 3);
  }
  f.part(ell([112, 600], 9, 7, 0.4, 8), { fill: P.sul, shadow: P.sulD, shade: 0.4, inkW: 1, cast: false, tex: 'grain' + seed }); // a lump escaped through
  f.part([[104, 622], [116, 626], [114, 642], [106, 640]], { fill: P.canvas, shade: 0.4, inkW: 1, cast: false }); // the sack's corner, drooping
  W.crust(f, [270, 470], 26, 10, 3, 3, 5, { spikes: 0.3 });
  f.line([[120, 470], [160, 444], [220, 432], [270, 434]], 1.4, P.canvasD, { op: 0.6, dash: '3 3' }); // a seam, darned
  // the twisted neck of the sack, gathered and tied, in the far fist over the shoulder
  const nk = add(WF, [8, -4]);
  f.part([[370, 474], add(nk, [-6, 12]), add(nk, [10, -16]), add(nk, [24, -12]), add(nk, [16, 14]), [396, 506]], { fill: P.canvas, shadow: '#2e2820', shade: 0.4, tex: 'weave' + seed, texOp: 0.6 });
  for (let i = 0; i < 3; i++) f.line([add(nk, [-2 + i * 6, 8]), add(nk, [14 + i * 4, -10])], 1.2, P.canvasD);
  W.rope(f, [add(nk, [-2, 2]), add(nk, [10, -8]), add(nk, [20, -2])], 2.6, { col: '#7a6a48' });
  f.line([add(nk, [20, -2]), add(nk, [30, 18]), add(nk, [26, 34])], 2.4, '#7a6a48');
  W.armRig(f, SF, EF, WF, [24, 20, 16], SKN({ fill: mix(skin, P.char, 0.5), shadow: '#120c08' }), '_f', { capTop: 0.6 });
  f.bone('upperarm_f'); W.seam(f, [lp(SF, EF, 0.2, -4), lp(SF, EF, 0.5, -6), lp(SF, EF, 0.8, -3)], 1.3);
  f.bone('hand_f'); B.grip(f, WF, EF, -0.5, 14, mix(skin, P.char, 0.4), { tex: 'mottle' + seed, shadow: '#120c08', name: 'pit boy sack neck', quiet: true });

  // ---- the near shoulder under the pad, scorched through, the back of the neck split and glowing
  f.bone('torso');
  const pad = S.at(-0.1, 0.12);
  f.part([add(pad, [-30, -10]), add(pad, [10, -24]), add(pad, [34, -8]), add(pad, [24, 18]), add(pad, [-20, 20])], W.LEA(f, { fill: P.leath }));
  f.flat(ell(add(pad, [6, -2]), 10, 7, 0.3, 10), P.char); W.seam(f, [add(pad, [0, -4]), add(pad, [8, 0]), add(pad, [14, -6])], 1.2);
  f.line([add(pad, [-26, -6]), add(pad, [28, -6])], 1, P.leathL, { op: 0.6, dash: '2 3' });
  W.crackNet(f, S.at(0.0, 0.05), -0.3, 34, 1.6, { depth: 1 });
  W.ash(f, S.at(-0.1, 0.0), 6, 20, 60, 0.6);

  // ---- near leg: bowed, the knee swollen with blisters and bound with a rag; the near arm braced on it
  W.legRig(f, HN, KN, AN, 32, 30, 24, SKN({ fill: mix(skin, P.soot, 0.15) }), '_n', { thigh: 0.1, calf: 1.4, swell: 0.05 });
  f.bone('shin_n');
  f.part(ell(add(KN, [6, 0]), 21, 17, 0.2, 12), SKN({ fill: mix(skin, '#c09070', 0.25), cast: false, inkW: 1, inkHeavy: 1.4 })); // the swollen knee
  W.blisters(f, add(KN, [8, 4]), 10, 8, 4, 2.6, 5);
  W.rope(f, [lp(KN, AN, 0.2, -18), lp(KN, AN, 0.24, 0), lp(KN, AN, 0.22, 18)], 5, { col: '#8a7a5a' });
  f.part([lp(KN, AN, 0.24, 14), lp(KN, AN, 0.3, 30), lp(KN, AN, 0.44, 28), lp(KN, AN, 0.36, 14)], { fill: '#8a7a5a', shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed }); // the rag's end
  f.bone('foot_n'); f.line([[AN[0] - 10, gy - 2], [AN[0] + 24, gy - 3]], 1.2, '#6a4a30', { op: 0.8 }); W.hairline(f, [[AN[0] + 6, gy - 3], [AN[0] + 12, gy - 8]], 0.8);
  W.armRig(f, SN, EN, WN, [26, 22, 18], SKN({ fill: mix(skin, P.soot, 0.2) }), '_n', { capTop: 0.6 });
  f.bone('upperarm_n'); f.part(X.rag(f, add(SN, [0, -4]), lerp(SN, EN, 0.7), 34, 32, { depth: 6, teeth: 4 }), { fill: shirt, shadow: '#3a362c', shade: 0.4, tex: 'weave' + seed, texOp: 0.55 });
  f.bone('hand_n'); B.hand(f, add(WN, [4, 4]), 1.0, 12, mix(skin, P.soot, 0.25), { spread: 0.2, curl: 0.55, shadow: P.skinS });

  // ---- head: hanging low and forward from the bent back, a gaunt old-young face squinting, cropped hair, the mouth and
  // nostrils crusted yellow
  f.bone('head');
  f.part(limb(neck0, add(HC, [-10, 18]), 24, 22), SKN({ fill: mix(skin, P.char, 0.3) }));
  W.seam(f, [lp(neck0, HC, 0.0, -9), lp(neck0, HC, 0.3, -11), lp(neck0, HC, 0.5, -8)], 1.4);
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 0.8, chin: -0.04, nose: 0.82, mouth: 'set', squint: 0.6, browDown: 0.08, gaunt: true, age: false, eyeWhite: '#c8b878', iris: '#1a120c', hairCol: '#2a2018', faceShade: 0.75, faceHatch: false, jawShade: 0.55,
    hair: [[-0.4, 0.1], [-0.44, -0.2], [-0.34, -0.42], [-0.06, -0.52], [0.22, -0.46], [0.3, -0.34], [0.1, -0.38], [-0.1, -0.36], [-0.26, -0.2], [-0.28, 0.08]] });
  for (let i = 0; i < 12; i++) { const q = hF([[-0.34 + i * 0.05, -0.42 + Math.abs(i - 6) * 0.012]])[0]; f.line([q, add(q, rot([2, -4], hA))], 1.1, '#4a3a2a', { op: 0.7 }); } // cropped bristle
  W.crust(f, hF([[0.3, 0.13]])[0], 5, 4, 3, 1.6, 2.6, { spikes: 0 }); W.crust(f, hF([[0.26, 0.29]])[0], 6, 3, 3, 1.6, 2.6, { spikes: 0 });
  f.line(hF([[0.1, 0.36], [0.2, 0.42]]), 1, INK, { op: 0.5 });
  W.soot(f, hF([[0.0, 0.1]])[0], 16, 12, 0.3);

  f.bone('root');
  f.flat(ell([280, gy + 2], 110, 5, 0, 16), '#3a3020', { op: 0.5 });
  W.crust(f, [420, gy - 3], 20, 3, 3, 2.4, 4, { spikes: 0.3 });
  return f;
}

// ------------------------------------------------------------------ LAMP-ROOM GIRL (cast, human 0.9)
// A girl of the lamp room, who filled, trimmed and handed out the miners' lamps. A slight girl standing with her weight
// back on the far foot under the clinking load: a carved wooden yoke across her shoulders, hung with a dozen lit open
// iron lamps on chains of different lengths, the near arm of the yoke coming toward us (its lamps hang behind her back,
// big and close), the far arm going away (its lamps hang ahead of her chest, smaller). Her far hand steadies the yoke;
// her near hand holds one more lamp out to the enemy by its hook. A leather apron soaked in lamp oil with lamp numbers
// chalked on it, a wool dress kilted up over a petticoat, an oil can with a long spout at the belt, a wick-trimmer on a
// cord, clogs. Fire has charred and split her hands and the cheek nearest the lamps, the hair burned short on that side
// and the headscarf burnt back from it; toxin has raised blisters along her collarbone where the oil spilled and crusted
// her knuckles yellow. A small, serious face.
// Rig: standard humanoid + yoke (parent torso) + lamp_1..12 (parent yoke, pivots at their hooks) + lamp (parent hand_n)
// + skirt (parent pelvis). Motion: idle the lamps swinging and clinking; attack a lit lamp thrown.
function lampRoomGirl() {
  const seed = 429, h = TIERS.human[1];
  const f = new Fig(W.base(seed, h, { grimeY: 620 }));
  W.textures(f);
  const H = 90, gy = f.o.groundY;
  const skin = mix(P.skin, '#d8c0a0', 0.3), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, maxShade: 16 }, o));
  const charS = mix(P.char, skin, 0.3);
  const dress = '#7a6a52', dressD = '#4e4436', apr = '#4a3a28';
  const N = [252, 330], C = [238, 420], Pv = [244, 500];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.1, -0.02), HC = [278, 270], hA = 0.06;
  const SN = S.at(-0.05, 0.12), EN = [318, 420], WN = [404, 410];
  const SF = S.at(0.35, 0.08), EF = [330, 384], WF = [354, 330];
  const HN = [254, 510], KN = [282, 640], AN = [304, 756];
  const HF = [232, 506], KF = [222, 640], AF = [196, 756];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the yoke: one curved bar; its centre rides behind the neck, the near end comes toward us (left and down on screen),
  // the far end goes away (right and up)
  const YC = W.spline([[72, 392], [140, 372], [206, 352], [252, 340], [300, 328], [372, 314], [442, 306]], 6);
  const YS = W.arcLen(YC), YL = YS[YS.length - 1];
  const yAt = u => W.at(YC, YS, u * YL);
  f.joint('yoke', S.at(0, 0.02), 'torso').joint('lamp', add(WN, [0, -4]), 'hand_n').joint('skirt', S.at(0, 0.86), 'pelvis');
  const hooks = [[0.04, 64, 1.12], [0.1, 30, 1.08], [0.16, 88, 1.04], [0.22, 44, 1.0], [0.28, 112, 0.98], [0.34, 70, 0.95], [0.64, 40, 0.84], [0.7, 82, 0.82], [0.76, 26, 0.8], [0.82, 64, 0.78], [0.88, 36, 0.76], [0.95, 76, 0.74]];
  hooks.forEach(([u, l], i) => f.joint('lamp_' + (i + 1), yAt(u).p, 'yoke'));
  const hangLamp = (i, far) => {
    const [u, l, sc] = hooks[i], hp = yAt(u).p, end = add(hp, [0, l]);
    f.bone('lamp_' + (i + 1));
    W.chainLinks(f, [add(hp, [0, 4]), end], 7 * sc, P.iron);
    X.oilLamp(f, end, 40 * sc, { dir: i % 3 === 1 ? -1 : 1, glowOp: far ? 0.14 : 0.2, fs: 0.46 });
    if (far) f.flat(ell(add(end, [6, 16]), 22 * sc, 12 * sc, 0, 10), '#000', { op: 0.18 });
  };
  // ---- the far half of the yoke and its lamps, behind her body and head
  for (let i = 6; i < 12; i++) hangLamp(i, true);
  f.bone('yoke');
  const yokePart = (u0, u1, w0, w1, col) => { const n = 12, L = [], R = []; for (let k = 0; k <= n; k++) { const u = u0 + (u1 - u0) * k / n, a = yAt(u), w = (w0 + (w1 - w0) * k / n) / 2; L.push(add(a.p, mul(a.n, w))); R.push(add(a.p, mul(a.n, -w))); } f.part([...L, ...R.reverse()], { fill: col, shadow: P.woodD, light: P.woodL, shade: 0.42, tex: 'wood' + seed, texOp: 0.6, maxShade: 8 }); f.line(L.slice(1, -1), 1, P.woodL, { op: 0.55 }); };
  yokePart(0.45, 1.0, 22, 14, mix(P.wood, '#000', 0.2));
  hooks.slice(6).forEach(([u]) => { const q = yAt(u).p; f.line([add(q, [0, -6]), add(q, [0, 6])], 3, P.iron); });

  // ---- far arm: up to the yoke, behind the head; far leg
  W.armRig(f, SF, EF, WF, [26, 22, 18], SKN({ fill: mix(skin, P.soot, 0.3) }), '_f', { capTop: 0.6 });
  f.bone('upperarm_f'); f.part(K.chain([SF, lerp(SF, EF, 0.6), add(EF, [2, 2])], [34, 30, 30]), { fill: dressD, shadow: '#26201a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.legRig(f, HF, KF, AF, 30, 34, 26, SKN({ fill: mix(skin, P.soot, 0.35) }), '_f', { thigh: 0.08, calf: 1.3 });
  f.bone('foot_f');
  const clog = (A, col) => { const X0 = u => A[0] + u * 34; f.part([[X0(-0.5), A[1] - 4], [X0(0.5), A[1] - 8], [X0(1.2), gy - 22], [X0(1.45), gy - 10], [X0(1.4), gy, 1], [X0(-0.55), gy, 1], [X0(-0.6), gy - 16]], { fill: col, shadow: P.woodD, light: P.woodL, shade: 0.42, tex: 'wood' + seed, texOp: 0.5 }); f.part([[X0(-0.55), gy - 8], [X0(1.42), gy - 8], [X0(1.4), gy, 1], [X0(-0.55), gy, 1]], { fill: mix(col, '#000', 0.4), shade: 0.3, inkW: 1, cast: false }); f.line([[X0(0.2), A[1] - 4], [X0(0.9), gy - 20]], 1.1, INK, { op: 0.5 }); f.line([[X0(0.95), gy - 18], [X0(1.35), gy - 12]], 1.2, P.woodL, { op: 0.6 }); };
  clog(AF, mix(P.wood, '#000', 0.25));

  // ---- near leg and clog
  W.legRig(f, HN, KN, AN, 30, 34, 26, SKN({ fill: mix(skin, P.soot, 0.2) }), '_n', { thigh: 0.08, calf: 1.3 });
  f.bone('shin_n'); W.soot(f, lp(KN, AN, 0.6, 0), 12, 24, 0.4); W.splats(f, lp(KN, AN, 0.8, 0), 12, 16, 4);
  f.bone('foot_n'); clog(AN, P.wood);
  // ---- the kilted dress: the skirt hitched up into the waist, the petticoat showing below, the hem charred
  f.bone('skirt');
  const SKT = [S.at(-0.5, 0.8), S.at(0.5, 0.78), add(S.at(0.56, 1.0), [10, 70]), add(S.at(0.5, 1.0), [6, 120]), [...add(S.at(0.3, 1.0), [0, 140]), 1], add(S.at(0.0, 1.0), [0, 128]), [...add(S.at(-0.3, 1.0), [-6, 146]), 1], add(S.at(-0.56, 1.0), [-12, 126]), add(S.at(-0.6, 1.0), [-10, 60])];
  f.part(SKT, { fill: '#9a8e74', shadow: '#4a4436', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }); // petticoat
  W.clipDraw(f, SKT, () => { f.flat([[150, 600], [360, 600], [360, 680], [150, 680]], P.char, { op: 0.3 }); for (const x of [210, 250, 290]) f.stroke([[x, 560], [x - 4, 640]], 2, '#5a5444'); });
  for (const q of [add(S.at(0.3, 1.0), [0, 140]), add(S.at(-0.3, 1.0), [-6, 146])]) W.seam(f, [add(q, [-8, -8]), q, add(q, [8, -10])], 1.1, { glowOp: 0.2 });
  const KLT = [S.at(-0.52, 0.8), S.at(0.52, 0.78), add(S.at(0.58, 1.0), [8, 40]), add(S.at(0.3, 1.0), [4, 70]), add(S.at(0.0, 1.0), [0, 56]), add(S.at(-0.4, 1.0), [-8, 80]), add(S.at(-0.62, 1.0), [-14, 50])];
  f.part(KLT, { fill: dress, shadow: '#2e281e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.clipDraw(f, KLT, () => { for (const [a0, b0] of [[[-0.4, 0.82], [-0.5, 1.2]], [[0.0, 0.82], [-0.05, 1.25]], [[0.3, 0.82], [0.35, 1.25]]]) f.stroke([S.at(...a0), S.at(...b0)], 3, dressD); f.flat(ell(add(S.at(-0.2, 1.0), [0, 40]), 20, 12, 0.3, 10), '#3a3024', { op: 0.4 }); });

  // ---- torso: a slight bodice under the yoke; the collarbone blistered where the oil spilled
  f.bone('torso');
  const TOR = S.shape([[-0.05, 0.3, 0.28], [0.12, 0.44, 0.38], [0.35, 0.42, 0.44], [0.6, 0.36, 0.38], [0.85, 0.4, 0.42], [1.0, 0.44, 0.46]]);
  f.part(TOR, { fill: dress, shadow: '#2e281e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.clipDraw(f, TOR, () => { f.stroke([S.at(-0.2, 0.2), S.at(-0.26, 0.5), S.at(-0.2, 0.8)], 2.4, dressD); f.flat([S.at(0.05, 0.0), S.at(0.42, 0.0), S.at(0.4, 0.14), S.at(0.1, 0.16)], skin, { op: 0.95 }); });
  f.line([S.at(0.1, 0.16), S.at(0.25, 0.18), S.at(0.42, 0.13)], 1.4, dressD); // the neckline
  f.line([S.at(0.12, 0.08), S.at(0.3, 0.1)], 1.1, P.skinS, { op: 0.6 }); // collarbone
  W.blisters(f, S.at(0.25, 0.08), 12, 3, 4, 2, 3.4);
  // the apron: leather soaked dark with lamp oil, a sheen, lamp numbers chalked on it, a bib on a neck strap
  const APR = [S.at(0.05, 0.3), S.at(0.46, 0.3), S.at(0.5, 0.8), add(S.at(0.56, 1.0), [10, 96]), add(S.at(0.2, 1.0), [4, 110]), add(S.at(-0.2, 1.0), [-4, 100]), S.at(-0.24, 0.82)];
  f.part(APR, W.LEA(f, { fill: apr, shadow: '#1a120a', maxShade: 20 }));
  W.clipDraw(f, APR, () => {
    f.flat([S.at(0.3, 0.4), S.at(0.44, 0.4), add(S.at(0.5, 1.0), [6, 60]), add(S.at(0.36, 1.0), [4, 60])], '#d8c8a0', { op: 0.18 }); // oil sheen
    // lamp numbers chalked in tally numerals (they read the same mirrored): XII, VII, IX, with a rubbed-out smudge
    const chalk = (q, glyphs, sz) => { let x = 0; for (const g of glyphs) { if (g === 'I') f.line([add(q, [x, 0]), add(q, [x, sz])], 1.5, '#d8d4c4', { op: 0.75 }); else if (g === 'V') f.line([add(q, [x - sz * 0.3, 0]), add(q, [x, sz]), add(q, [x + sz * 0.3, 0])], 1.5, '#d8d4c4', { op: 0.75 }); else { f.line([add(q, [x - sz * 0.3, 0]), add(q, [x + sz * 0.3, sz])], 1.5, '#d8d4c4', { op: 0.75 }); f.line([add(q, [x + sz * 0.3, 0]), add(q, [x - sz * 0.3, sz])], 1.5, '#d8d4c4', { op: 0.75 }); } x += g === 'I' ? sz * 0.4 : sz * 0.75; } };
    chalk(add(S.at(0.12, 0.5), [0, 0]), 'XII', 12); chalk(add(S.at(0.1, 0.7), [0, 0]), 'VII', 11); chalk(add(S.at(0.05, 1.0), [0, 30]), 'IX', 12);
    f.flat(ell(add(S.at(0.2, 0.85), [0, 0]), 14, 6, -0.2, 8), '#c8c4b4', { op: 0.18 });
    // creases where it bends over the thighs, a scorched corner, worn pale edges
    for (const [a0, b0] of [[[0.1, 0.9], [0.0, 1.3]], [[0.4, 0.9], [0.45, 1.35]]]) f.stroke([add(S.at(...a0), [0, 0]), add(S.at(a0[0], 1.0), [0, (b0[1] - 1) * 200])], 2.4, '#1a120a', { op: 0.6 });
    f.flat([add(S.at(0.5, 1.0), [4, 70]), add(S.at(0.56, 1.0), [10, 96]), add(S.at(0.36, 1.0), [6, 106])], P.char, { op: 0.8 });
    f.flat(ell(add(S.at(0.2, 1.0), [0, 80]), 18, 10, 0.2, 10), '#120c06', { op: 0.5 }); // an oil stain
  });
  f.line([S.at(0.08, 0.3), S.at(0.12, 0.02)], 2, P.leathD); f.line([S.at(0.44, 0.3), S.at(0.42, 0.02)], 2, P.leathD);
  // belt cord: the oil can with its long spout, the wick-trimmer on a cord
  W.rope(f, [S.at(-0.5, 0.8), S.at(0.0, 0.82), S.at(0.5, 0.79)], 2.6, { col: '#7a6a48' });
  const oc = add(S.at(-0.36, 0.86), [-8, 8]);
  f.part([add(oc, [-16, -6]), add(oc, [14, -8]), add(oc, [16, 30]), add(oc, [-16, 32])].map(q => [...q, 1]), { fill: P.greyL, shadow: P.greyD, shade: 0.42, inkW: 1.2, cast: false, tex: 'mottle' + seed });
  f.part([add(oc, [-12, -14]), add(oc, [10, -14]), add(oc, [14, -6]), add(oc, [-16, -6])], { fill: P.grey, shade: 0.4, inkW: 1, cast: false });
  f.line([add(oc, [12, -10]), add(oc, [46, -40]), add(oc, [58, -48])], 4.4, INK); f.line([add(oc, [12, -10]), add(oc, [46, -40]), add(oc, [58, -48])], 2.6, P.greyL); // the long spout
  f.line([add(oc, [-14, 0]), add(oc, [-22, 14]), add(oc, [-14, 24])], 2.4, P.greyD); // handle
  f.flat(ell(add(oc, [0, 14]), 10, 6, 0, 8), '#1a140c', { op: 0.4 }); W.drip(f, add(oc, [58, -46]), 0.4, '#c8b070');
  const wt = S.at(0.3, 0.84); f.line([wt, add(wt, [6, 30])], 1.2, '#5a4a30');
  for (const dx of [-3, 4]) { f.line([add(wt, [6, 32]), add(wt, [6 + dx, 48])], 3.2, INK); f.line([add(wt, [6, 32]), add(wt, [6 + dx, 48])], 1.8, P.iron); } for (const dx of [-4, 4]) K.ring(f, add(wt, [6 + dx, 27]), 3, 3.4, 1.4, P.iron); // the trimmer, its blades


  // ---- the near half of the yoke and its lamps: in front of her back, big and close
  f.bone('yoke');
  yokePart(0.0, 0.55, 18, 24, P.wood);
  const ye = yAt(0.0).p; f.part(ell(ye, 10, 13, 0, 10), { fill: P.woodL, shadow: P.woodD, shade: 0.42, inkW: 1.2, cast: false }); // the carved knob at the end
  hooks.slice(0, 6).forEach(([u]) => { const q = yAt(u).p; f.line([add(q, [0, -8]), add(q, [0, 8])], 3.4, P.iron); });
  f.scratches(yAt(0.3).p, 20, 4, P.woodL, 0.8, -0.2);
  for (let i = 0; i < 6; i++) hangLamp(i, false);

  // ---- head: a small serious face, the near cheek charred and split, the hair burned short on that side, the scarf
  // burnt back from it
  f.bone('head');
  f.part(limb(neck0, add(HC, [-8, 28]), 32, 28), SKN());
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 0.86, chin: -0.02, nose: 0.88, mouth: 'set', squint: 0.2, browDown: 0.04, lips: true, lashes: true, eyeWhite: '#d0c4a4', iris: '#2a1a10', hairCol: '#4a3420', faceShade: 0.7, faceHatch: false, jawShade: 0.5 });
  // the near cheek: charred to the ear, split in glowing seams, the edges flaking
  const CH = hF([[-0.12, -0.02], [0.08, 0.04], [0.16, 0.16], [0.1, 0.3], [-0.06, 0.32], [-0.18, 0.18]]);
  f.flat(CH, charS, { op: 0.92 });
  W.seam(f, hF([[-0.1, 0.06], [0.0, 0.12], [0.06, 0.2], [0.04, 0.28]]), 1.2); W.seam(f, hF([[0.0, 0.12], [0.1, 0.1]]), 0.8, { glow: false });
  W.flakes(f, hF([[0.12, 0.2]])[0], 6, 6, 3, 0.4);
  // singed hair, short and frizzled over the near ear; the rest under the scarf
  for (let i = 0; i < 9; i++) { const q = hF([[-0.3 + i * 0.03, -0.06 + (i % 3) * 0.04]])[0]; f.line([q, add(q, [-2 - (i % 2) * 2, -5])], 1.2, '#2a1a10', { op: 0.8 }); }
  // the headscarf: tied at the nape, a knot and a tail hanging plumb; its near edge burnt back in a curled, glowing hem
  const SC = hF([[0.32, -0.36], [0.1, -0.56], [-0.2, -0.56], [-0.44, -0.36], [-0.52, -0.04], [-0.46, 0.2], [-0.36, 0.16], [-0.3, -0.02], [-0.16, -0.1], [-0.02, -0.18], [0.18, -0.26], [0.34, -0.26]]);
  f.part(SC, { fill: P.och, shadow: P.ochD, light: P.ochL, shade: 0.42, tex: 'weave' + seed, texOp: 0.55, maxShade: 14 });
  W.clipDraw(f, SC, () => { for (const [a0, b0] of [[[0.2, -0.5], [-0.3, -0.2]], [[0.0, -0.54], [-0.4, -0.1]]]) f.stroke(hF([a0, lerp(a0, b0, 0.5), b0]), 2.2, P.ochD); });
  f.flat(hF([[-0.3, -0.02], [-0.16, -0.1], [-0.02, -0.18], [-0.04, -0.12], [-0.2, -0.04], [-0.32, 0.04]]), P.char, { op: 0.9 }); // the burnt-back edge
  W.seam(f, hF([[-0.3, 0.0], [-0.16, -0.08], [-0.02, -0.16]]), 1, { glowOp: 0.25 });
  const kn = hF([[-0.48, 0.12]])[0];
  f.part(ell(kn, 9, 7, 0, 8), { fill: P.ochD, shade: 0.4, inkW: 1, cast: false });
  f.part([add(kn, [-4, 4]), add(kn, [6, 4]), add(kn, [4, 40]), add(kn, [-2, 46]), add(kn, [-8, 30])], { fill: P.och, shadow: P.ochD, shade: 0.4, inkW: 1, cast: false, tex: 'weave' + seed });

  // ---- near arm: holding one more lamp out to the enemy by its hook
  f.bone('torso');
  W.armRig(f, SN, EN, WN, [30, 24, 20], SKN({ fill: charS, shadow: '#0e0a08' }), '_n', { capTop: 0.6 });
  f.bone('upperarm_n'); f.part(K.chain([add(SN, [-2, -6]), lerp(SN, EN, 0.6), add(EN, [2, 2])], [40, 34, 34]), { fill: dress, shadow: '#2e281e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.stroke([lp(SN, EN, 0.3, 8), lp(SN, EN, 0.6, 4), lp(SN, EN, 0.85, 9)], 1.8, dressD);
  f.bone('forearm_n'); f.part(X.rag(f, lp(EN, WN, -0.06, 0), lp(EN, WN, 0.3, 0), 34, 30, { depth: 6, teeth: 5 }), { fill: dress, shadow: '#2e281e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.seam(f, [lp(EN, WN, 0.45, -3), lp(EN, WN, 0.65, 2), lp(EN, WN, 0.85, -2)], 1.3);
  f.bone('lamp');
  X.oilLamp(f, add(WN, [0, 2]), 44, { dir: 1, glowOp: 0.3, fs: 0.5 });
  f.bone('hand_n');
  const g = B.grip(f, WN, EN, -Math.PI / 2, 16, charS, { tex: 'mottle' + seed, shadow: '#0e0a08', name: 'lamp girl hook' });
  W.crust(f, g.F([[0.1, 0.0]])[0], 5, 6, 3, 1.4, 2.4, { spikes: 0 });
  f.bone('hand_f');
  B.hand(f, add(WF, [2, -4]), -0.4, 14, charS, { spread: 0.1, curl: 0.75, shadow: '#0e0a08' });

  f.bone('root');
  f.flat(ell([250, gy + 2], 140, 6, 0, 16), '#3a3020', { op: 0.5 });
  return f;
}

// ------------------------------------------------------------------ TUB HURRIER (cast, human 0.95)
// A hurrier, who dragged the ore tubs along the low galleries by a chain from a leather girdle. Bent almost flat and
// leaning into the chain, her hands braced on her knees, her legs driving back; the chain runs from the front of the
// girdle down between her legs to the tub behind her: a wooden ore tub on small iron wheels, heaped with smouldering
// sulphur ore, a candle stub stuck to its rim. Broad-shouldered and strong-legged; sacking trousers, a ragged linen
// shirt, leather pads on the hands and knees, a headscarf, bare feet. Fire has charred her back and shoulders in
// glowing seams from the sparks of the ore; toxin has ripened the chafe line of the girdle into blisters and yellow
// crust and swollen her knees. A set, strained face, the jaw clenched, the eyes on the floor.
// Rig: standard humanoid + chain (parent pelvis) + tub (root; the chain's far end). Motion: idle heaving the tub one
// step and resting; attack dragging the burning tub through a rank (the whole figure, tub following on its chain).
function tubHurrier() {
  const seed = 430, h = TIERS.human[1];
  const f = new Fig(W.base(seed, h, { grimeY: 600 }));
  W.textures(f);
  const H = 95, gy = f.o.groundY;
  const skin = mix(P.skin, '#c8a888', 0.15), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, maxShade: 18 }, o));
  const charS = mix(P.char, skin, 0.3), shirt = '#9a9078', sack = '#6e6048';
  const N = [454, 492], C = [380, 456], Pv = [312, 528];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.05, -0.04), HC = [506, 520], hA = 1.05;
  const SN = S.at(0.15, 0.1), EN = [474, 604], WN = [404, 640];
  const SF = S.at(-0.15, 0.12), EF = [492, 590], WF = [430, 630];
  const HN = [316, 540], KN = [392, 642], AN = [306, 758];
  const HF = [300, 536], KF = [350, 654], AF = [236, 752];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const hitch = [200, 696], gird = S.at(0.58, 0.9), crotch = add(Pv, [6, 40]);
  f.joint('tub', [120, 740]).joint('chain', gird, 'pelvis');

  // ---- the tub behind her: a tapered wooden box with iron bands and corner straps on small iron wheels, heaped with
  // smouldering ore; a candle stub stuck to the rim
  f.bone('tub');
  const T0 = [[18, 600], [214, 596], [202, 734], [30, 736]];
  for (const wx of [70, 168]) { f.part(ell([wx + 8, gy - 26], 24, 24, 0, 16), { fill: mix(P.iron, '#000', 0.3), shade: 0.4, inkW: 1.4, cast: false }); } // far wheels
  // the heap of ore: lumps and crystals, glowing seams between them, smoke
  const heap = [[22, 604], [40, 572], [70, 548], [108, 532], [140, 540], [176, 556], [206, 580], [212, 604]];
  f.part(W.lumpy(f, heap, 8), { fill: mix(P.sul, P.och, 0.4), shadow: P.sulD, shade: 0.42, tex: 'grain' + seed, texOp: 0.8, maxShade: 20 });
  for (let i = 0; i < 10; i++) { const q = W.scatter(f, [116, 566], 80, 22), r = W.R(f, 9, 18); f.part(W.lumpy(f, ell(q, r, r * 0.75, f.r() * 3, 9), 3), { fill: mix(P.sul, P.och, f.r() * 0.5), shadow: P.sulD, light: P.sulP, shade: 0.45, inkW: 1, inkHeavy: 1.5, cast: false, tex: 'grain' + seed, texOp: 0.7 }); }
  for (const [q, a] of [[[80, 556], -1.9], [[150, 548], -1.3]]) W.druse(f, q, a, 18, 4);
  for (const pts of [[[50, 590], [70, 576], [96, 582]], [[120, 560], [140, 566], [160, 576], [178, 572]], [[96, 548], [104, 538]]]) W.seam(f, pts, 1.8);
  W.glow(f, [116, 570], 90, 30, P.lamp, 0.25);
  W.smoke(f, [100, 540], 160, 30, { col: '#a08a5a', op: 0.32, sway: 14, drift: 30, phase: 0.3 });
  W.smoke(f, [160, 548], 120, 22, { col: '#a08a5a', op: 0.28, sway: -10, drift: 20, phase: 1.8 });
  W.ash(f, [120, 540], 10, 80, 90, 0.8);
  // the box
  f.part(T0.map(q => [...q, 1]), { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.42, tex: 'wood' + seed, texOp: 0.6, maxShade: 30 });
  W.clipDraw(f, T0, () => {
    for (const y of [632, 668, 704]) f.line([[18, y], [216, y - 2]], 1.4, INK, { op: 0.6 }); // planks
    f.flat([[18, 600], [214, 596], [214, 612], [18, 616]], '#1a120a', { op: 0.5 }); // under the rim
    f.raw(`<rect x="18" y="600" width="200" height="140" fill="url(#soot${seed})" opacity="0.7"/>`);
    f.flat([[18, 700], [216, 700], [216, 740], [18, 740]], P.mud, { op: 0.4 });
  });
  for (const [x0, x1] of [[18, 34], [196, 212]]) f.part([[x0, 598], [x1, 598], [x1 - 4, 736], [x0 + 4, 736]].map(q => [...q, 1]), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false, tex: 'mottle' + seed }); // corner straps
  for (const y of [610, 720]) { f.part([[16, y - 6], [218, y - 8], [216, y + 4], [18, y + 6]].map(q => [...q, 1]), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false }); for (let i = 0; i < 6; i++) f.rivet([30 + i * 36, y - 1], 2, P.iron); }
  f.part([[14, 592], [220, 588], [222, 600], [12, 604]].map(q => [...q, 1]), { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1.2, cast: false }); // the rim
  f.scratches([100, 660], 60, 5, P.woodL, 0.8, 0);
  f.flat(ell([62, 670], 18, 10, 0.3, 10), P.char, { op: 0.6 }); W.hairline(f, [[52, 664], [64, 672], [76, 668]], 1);
  // the hitch: an iron eye at the front, low
  K.ring(f, hitch, 8, 8, 3, P.ironL); f.part([add(hitch, [4, -6]), add(hitch, [18, -6]), add(hitch, [18, 6]), add(hitch, [4, 6])], { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  // near wheels: small iron, spoked, the axle box
  for (const wx of [62, 160]) { const wc = [wx, gy - 24]; f.part(ell(wc, 24, 24, 0, 18), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.6, cast: false, tex: 'mottle' + seed, texOp: 0.6 }); f.flat(ell(wc, 15, 15, 0, 14), '#2a2420'); for (let k = 0; k < 4; k++) f.line([wc, add(wc, rot([15, 0], k * Math.PI / 4 + 0.3))], 2.4, P.ironL); f.flat(ell(wc, 5, 5, 0, 8), P.iron); f.line([add(wc, [-18, -14]), add(wc, [-6, -22])], 1.2, '#a8a090', { op: 0.6 }); }
  // the candle stub on the rim, stuck down in its own wax, burning
  const cs = [196, 588];
  f.part([add(cs, [-8, 2]), add(cs, [8, 2]), add(cs, [6, -18]), add(cs, [-6, -20])], { fill: '#d8ccaa', shadow: '#8a7e60', shade: 0.4, inkW: 1, cast: false, hatch: false });
  f.flat([add(cs, [-12, 4]), add(cs, [12, 4]), add(cs, [8, -2]), add(cs, [-10, -2])], '#e0d4b4', { op: 0.9 }); f.line([add(cs, [6, -14]), add(cs, [8, 0])], 2.4, '#e8dcbc');
  f.line([add(cs, [0, -20]), add(cs, [1, -25])], 1.4, INK);
  X.wickFlame(f, add(cs, [1, -25]), 22, { glowOp: 0.3 });


  // ---- far arm and far leg
  W.armRig(f, SF, EF, WF, [40, 34, 28], SKN({ fill: mix(skin, P.soot, 0.35) }), '_f', { capTop: 0.6 });
  f.bone('hand_f'); B.hand(f, add(WF, [-2, 8]), 2.2, 18, P.leathD, { spread: 0.1, curl: 0.5, shadow: '#120c08' });
  const legLook = W.CAN(f, { fill: mix(sack, '#000', 0.25) });
  const cuF = lerp(KF, AF, 0.55);
  W.legTube(f, HF, KF, cuF, [76, 60, 50], legLook, '_f', Object.assign({ A: AF }, LEGB));
  f.bone('shin_f');
  K.bareLeg(f, cuF, AF, 1, 50, 44, SKN({ fill: mix(skin, P.soot, 0.4) }));
  f.part(X.rag(f, lp(KF, AF, 0.2, 0), lp(KF, AF, 0.58, 0), 58, 52, { depth: 6, teeth: 5 }), legLook);
  f.part(ell(add(KF, [16, 2]), 28, 24, 0.3, 12), W.LEA(f, { fill: P.leathD, cast: false })); // knee pad

  // ---- the chain: from the hitch, taut, forward between her legs to the ring at the front of the girdle
  f.bone('chain');
  W.chainLinks(f, [add(hitch, [6, 0]), crotch, gird], 14, P.iron);
  // ---- torso: broad shoulders, the back nearly flat; the ragged shirt torn across the back, the skin under it charred
  f.bone('torso');
  const TOR = S.shape([[-0.06, 0.4, 0.4], [0.12, 0.62, 0.56], [0.35, 0.6, 0.6], [0.6, 0.5, 0.52], [0.85, 0.48, 0.52], [1.0, 0.52, 0.56]]);
  f.part(TOR, SKN({ fill: charS, shadow: '#0e0a08', maxShade: 22 }));
  W.crackNet(f, S.at(-0.4, 0.1), 2.8, 90, 2.6, { depth: 2 });
  W.crackNet(f, S.at(-0.45, 0.35), 3.1, 70, 2.2, { depth: 2 });
  W.flakes(f, S.at(-0.4, 0.25), 30, 14, 6, 0.8);
  W.ash(f, S.at(-0.5, 0.2), 8, 50, 80, 0.8);
  // the shirt: what is left of it, torn away over the shoulders and hanging plumb under her chest
  const SH = [S.at(-0.2, 0.36), S.at(-0.48, 0.5), S.at(-0.5, 0.95), S.at(0.0, 0.98), add(S.at(0.5, 0.9), [0, 10]), [...add(S.at(0.6, 0.7), [0, 50]), 1], add(S.at(0.55, 0.55), [0, 26]), [...add(S.at(0.6, 0.4), [2, 52]), 1], add(S.at(0.55, 0.25), [0, 30]), [...add(S.at(0.55, 0.12), [6, 46]), 1], S.at(0.4, 0.0), S.at(0.1, 0.06), [...S.at(-0.05, 0.22), 1], S.at(-0.3, 0.2), [...S.at(-0.22, 0.3), 1]];
  f.part(SH, { fill: shirt, shadow: '#4a463a', shade: 0.4, tex: 'weave' + seed, texOp: 0.55 });
  f.raw(`<path d="${E.smooth(SH)}" fill="url(#soot${seed})" opacity="0.7"/>`);
  for (const t of [0.3, 0.55, 0.8]) f.stroke([S.at(0.2, t), add(S.at(0.55, t), [0, 30])], 2.2, '#4a463a');
  for (const q of [S.at(-0.05, 0.22), S.at(-0.22, 0.3)]) { f.flat([add(q, [-6, -6]), q, add(q, [8, -4])], P.char, { op: 0.9 }); W.seam(f, [add(q, [-5, -4]), q, add(q, [6, -3])], 0.9, { glowOp: 0.2 }); }
  // the girdle: thick leather round the waist, the chafe line under it ripened into blisters and yellow crust
  f.bone('pelvis');
  const TRS = [add(Pv, [-34, -26]), add(Pv, [40, -14]), add(Pv, [50, 20]), add(Pv, [20, 44]), add(Pv, [-30, 40]), add(Pv, [-44, 8])];
  f.part(TRS, W.CAN(f, { fill: sack }));
  W.blisters(f, S.at(0.0, 0.76), 30, 6, 7, 2.4, 4.4);
  W.crust(f, S.at(0.2, 0.74), 30, 4, 6, 2.4, 4, { spikes: 0.2 });
  const gd = [S.at(-0.56, 0.78), S.at(0.6, 0.8), S.at(0.62, 0.92), S.at(-0.56, 0.9)];
  f.part(gd, W.LEA(f, { fill: P.leath, k: 0.5 }));
  f.line([S.at(-0.5, 0.82), S.at(0.55, 0.84)], 1, P.leathL, { op: 0.6, dash: '3 3' });
  K.ring(f, gird, 9, 9, 3.4, P.ironL); f.rivet(add(gird, [0, -12]), 2.4, P.iron);

  // ---- near leg: sacking trousers to mid-calf, the swollen knee on its pad, a bare foot driving back
  const cuN = lerp(KN, AN, 0.55);
  W.legTube(f, HN, KN, cuN, [82, 62, 52], W.CAN(f, { fill: sack }), '_n', Object.assign({ A: AN }, LEGB));
  f.bone('thigh_n'); f.stroke([lp(HN, KN, 0.3, 20), lp(HN, KN, 0.6, 6), lp(HN, KN, 0.85, -16)], 2.4, mix(sack, '#000', 0.5));
  f.part([lp(HN, KN, 0.4, -18), lp(HN, KN, 0.4, 12), lp(HN, KN, 0.62, 14), lp(HN, KN, 0.62, -16)].map(q => [...q, 1]), W.CAN(f, { fill: mix(sack, P.och, 0.3), inkW: 1, cast: false })); // patch
  f.bone('shin_n');
  K.bareLeg(f, cuN, AN, 1, 52, 46, SKN({ fill: mix(skin, P.soot, 0.25) }));
  f.part(X.rag(f, lp(KN, AN, 0.2, 0), lp(KN, AN, 0.58, 0), 62, 56, { depth: 7, teeth: 5 }), W.CAN(f, { fill: sack }));
  f.part(ell(add(KN, [16, 0]), 32, 28, 0.3, 12), W.LEA(f, { fill: P.leath })); // the knee pad over the swollen knee
  W.rope(f, [add(KN, [-6, -26]), add(KN, [16, -32]), add(KN, [40, -20])], 2.2, { col: '#6a5a40' });
  W.blisters(f, add(KN, [26, 22]), 10, 6, 3, 2.4, 4);
  f.bone('foot_n'); W.splats(f, [AN[0] + 20, gy - 10], 30, 8, 5);

  // ---- head: hanging forward and down, eyes on the floor, the jaw clenched; a headscarf knotted at the nape
  f.bone('head');
  f.part(limb(neck0, add(HC, [-20, 4]), 46, 40), SKN());
  f.line([lp(neck0, HC, 0.2, 10), lp(neck0, HC, 0.6, 12)], 1.4, P.skinS, { op: 0.6 }); // the strained cord of the neck
  W.seam(f, [lp(neck0, HC, 0.1, -16), lp(neck0, HC, 0.4, -18)], 1.4);
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.06, chin: 0.02, nose: 0.98, mouth: 'grim', squint: 0.4, browDown: 0.12, age: true, eyeWhite: '#c8bc98', iris: '#1a120c', faceShade: 0.75, faceHatch: false, jawShade: 0.55, lips: true });
  f.line(hF([[0.0, 0.3], [0.08, 0.36]]), 1.4, INK, { op: 0.6 }); f.line(hF([[-0.04, 0.24], [0.02, 0.3]]), 1, INK, { op: 0.5 }); // the clenched jaw muscle
  W.soot(f, hF([[0.1, 0.1]])[0], 18, 14, 0.25);
  const SC = hF([[0.3, -0.36], [0.06, -0.56], [-0.24, -0.54], [-0.46, -0.32], [-0.5, 0.02], [-0.42, 0.24], [-0.3, 0.12], [-0.26, -0.08], [-0.06, -0.24], [0.16, -0.3], [0.32, -0.28]]);
  f.part(SC, { fill: '#7a6a4a', shadow: '#3a3022', shade: 0.42, tex: 'weave' + seed, texOp: 0.55, maxShade: 14 });
  W.clipDraw(f, SC, () => { for (const [a0, b0] of [[[0.2, -0.46], [-0.36, -0.1]], [[-0.04, -0.52], [-0.44, 0.0]]]) f.stroke(hF([a0, lerp(a0, b0, 0.5), b0]), 2.2, '#3a3022'); });
  const kn = hF([[-0.46, 0.18]])[0]; f.part(ell(kn, 9, 7, 0, 8), { fill: '#5a4c34', shade: 0.4, inkW: 1, cast: false });
  f.line([kn, add(kn, [-4, 26]), add(kn, [-2, 40])], 4, '#6a5a40'); f.line([kn, add(kn, [6, 24])], 3.6, '#5a4c34');
  for (let i = 0; i < 6; i++) { const q = hF([[0.22 - i * 0.04, -0.3 + i * 0.01]])[0]; f.line([q, add(q, rot([3, 7], hA))], 1.2, '#3a2a1a', { op: 0.8 }); } // hair escaping at the brow

  // ---- near arm: down to the near knee, the padded hand braced on it
  f.bone('torso');
  W.armRig(f, SN, EN, WN, [48, 40, 32], SKN({ fill: charS, shadow: '#0e0a08' }), '_n', { capTop: 0.6, bp: [[0, 0.45, 0.14]] });
  f.bone('upperarm_n'); W.seam(f, [lp(SN, EN, 0.15, 10), lp(SN, EN, 0.4, 14), lp(SN, EN, 0.6, 8)], 1.6);
  f.part(X.rag(f, add(SN, [0, -10]), lerp(SN, EN, 0.4), 56, 50, { depth: 8, teeth: 5 }), { fill: shirt, shadow: '#4a463a', shade: 0.4, tex: 'weave' + seed, texOp: 0.55 });
  f.bone('forearm_n'); f.line([lp(EN, WN, 0.2, -10), lp(EN, WN, 0.5, -14), lp(EN, WN, 0.8, -8)], 1, '#4a3a5a', { op: 0.5 }); // a vein
  W.blisters(f, lp(EN, WN, 0.6, 6), 6, 8, 2, 2, 3.4);
  f.bone('hand_n');
  const hh = B.hand(f, add(WN, [-4, 6]), 2.3, 19, mix(skin, P.soot, 0.3), { spread: 0.12, curl: 0.55, shadow: P.skinS });
  f.part(hh.F([[-0.55, -0.48], [0.45, -0.46], [0.55, 0.0], [0.45, 0.48], [-0.55, 0.44], [-0.66, 0.0]]), W.LEA(f, { fill: P.leath, cast: false })); // the hand pad over the palm
  f.line(hh.F([[-0.5, -0.3], [0.4, -0.3]]), 1, P.leathL, { op: 0.6, dash: '2 2' });

  f.bone('root');
  f.flat(ell([300, gy + 2], 280, 7, 0, 20), '#3a3020', { op: 0.5 });
  for (let i = 0; i < 6; i++) f.line([[220 + i * 20, gy - 1], [236 + i * 20, gy - 2]], 1.2, '#5a4a30', { op: 0.6 }); // drag marks
  return f;
}

// ------------------------------------------------------------------ TIMBERMAN (cast, large 1.5)
// The timberman, who cut and set the pit props. A huge, broad-backed man walking with his legs wide and his body leaning
// against the weight of a long pit prop laid across his near (left) shoulder on a leather pad: a rough-hewn pine log,
// bark in strips, axe facets, an iron cap plate nailed on its charred front end. The near hand steadies it from below;
// the far (right) hand carries a short-handled timber maul. A leather jerkin over a wool shirt with its sleeves torn
// off, wool breeches tied below the knee, a belt of iron wedges and spikes, an adze at the hip, a lamp hooked on the
// belt, a notched measuring stick, a nail pouch. Fire has charred him along the shoulder where the beam caught alight,
// the skin split and glowing at the neck and down the arm; toxin has swollen the knuckles and elbows with blisters and
// crusted the creases of the neck yellow. A big square head under a leather cap, a cropped beard singed short, heavy
// brows. (The bible's beam is twice his height; on the large canvas it runs corner to corner at about 1.1 times.)
// Rig: standard humanoid + prop (parent torso, pivot on the shoulder; the near fist is a second hold: IK in engine) +
// maul (parent hand_f). Motion: idle shifting the beam on the shoulder; attack a sweeping swing of the beam.
function timberman() {
  const seed = 426, h = TIERS.large[1];
  const f = new Fig(W.base(seed, h, { grimeY: 800 }));
  W.textures(f);
  const H = 146, gy = f.o.groundY;
  const skin = mix(P.skin, '#b89070', 0.15), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, maxShade: 26 }, o));
  const charS = mix(P.char, skin, 0.3), jerk = P.leath, wool = '#6a5e48', breech = '#5a5040';
  const N = [478, 360], C = [400, 440], Pv = [420, 650];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.12, -0.02), HC = [536, 282], hA = 0.12;
  const SN = S.at(-0.1, 0.12), EN = [470, 556], WN = [598, 474];
  const SF = S.at(0.45, 0.08), EF = [576, 520], WF = [598, 640];
  const HN = [410, 664], KN = [360, 860], AN = [318, 1036];
  const HF = [452, 656], KF = [560, 846], AF = [606, 1034];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the prop: its axis passes over the near shoulder, down toward the front
  const bA = 0.5, bd = [Math.cos(bA), Math.sin(bA)], bn = [-bd[1], bd[0]], sh0 = add(SN, [12, -20]); // low on the shoulder pad so the thicker prop clears the beard
  const B0 = add(sh0, mul(bd, -850)), B1 = add(sh0, mul(bd, 1000)), BR = 34; // about twice his height (bible), the canvas grown to hold it
  const mA = 0.12, md = [Math.cos(mA), Math.sin(mA)], mHead = add(WF, mul(md, 150)), mTail = add(WF, mul(md, -46));
  f.joint('prop', sh0, 'torso').joint('maul', WF, 'hand_f');

  // ---- far arm with the maul; far leg
  W.armRig(f, SF, EF, WF, [78, 64, 50], SKN({ fill: mix(skin, P.soot, 0.35) }), '_f', { capTop: 0.6, bp: [[0, 0.4, 0.16]], bq: [[1, 0.25, 0.14]] });
  f.bone('maul');
  f.part(limb(mTail, mHead, 20, 22, { steps: 8, capK: 0.6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  for (let i = 0; i < 6; i++) f.line([lp(mTail, mHead, 0.02 + i * 0.04, -10), lp(mTail, mHead, 0.04 + i * 0.04, 10)], 1.6, '#2a1e14', { straight: true }); // grip wrap
  const MF = frame(mHead, mA, 1);
  f.part(MF([[-26, -40], [26, -40], [30, -34], [30, 50], [26, 56], [-26, 56], [-30, 50], [-30, -34]]), { fill: P.woodL, shadow: P.woodD, light: '#9a8460', shade: 0.42, tex: 'wood' + seed, texOp: 0.6 }); // a hornbeam maul head
  for (const y of [-30, 46]) f.part(MF([[-32, y - 6], [32, y - 6], [32, y + 6], [-32, y + 6]]).map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1.1, cast: false }); // iron hoops
  f.flat(MF([[-24, 52], [24, 52], [20, 60], [-20, 60]]), '#2a1e14', { op: 0.6 }); f.scratches(MF([[0, 10]])[0], 20, 5, P.woodL, 0.9, 1.5);
  f.flat(MF([[10, -28], [26, -20], [24, 0], [12, -8]]), P.char, { op: 0.7 });
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, mA, 30, mix(skin, P.soot, 0.3), { tex: 'mottle' + seed, shadow: P.skinS, name: 'timberman maul' });
  W.blisters(f, gF.F([[0.2, -0.3]])[0], 6, 6, 3, 2.4, 4);
  const bL = (o = {}) => W.CAN(f, Object.assign({ fill: mix(breech, '#000', 0.25) }, o));
  W.legTube(f, HF, KF, lerp(KF, AF, 0.18), [118, 92, 86], bL(), '_f', { A: AF, bq: [[0, 0.4, 0.14]], bp: [[0, 0.6, 0.1]] });
  W.legTube(f, add(KF, [0, -4]), lerp(KF, AF, 0.2), lerp(KF, AF, 0.82), [84, 86, 62], W.CAN(f, { fill: '#4a4236', tex: 'weave' + seed }), '_f', { A: AF, bp: [[1, 0.25, 0.3, 0.18]] });
  W.bootRig(f, KF, AF, 78, '#2a231d', '_f', { tex: 'mottle' + seed, shaft: 0.7, toe: 1.15 });
  f.bone('shin_f'); W.rope(f, [lp(KF, AF, 0.16, -46), lp(KF, AF, 0.19, 0), lp(KF, AF, 0.16, 44)], 3, { col: '#6a5a40' });

  // ---- torso: a huge broad back under the leather jerkin, the wool shirt showing at the armholes and collar
  f.bone('torso');
  const TOR = S.shape([[-0.06, 0.4, 0.36], [0.12, 0.68, 0.56], [0.35, 0.72, 0.62], [0.6, 0.6, 0.62], [0.85, 0.56, 0.62], [1.0, 0.6, 0.62]]);
  f.part(TOR, { fill: wool, shadow: '#2a261e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  const JK = S.shape([[0.02, 0.5, 0.2], [0.12, 0.7, 0.4], [0.35, 0.74, 0.5], [0.6, 0.62, 0.58], [0.85, 0.58, 0.6], [1.06, 0.62, 0.62]]);
  f.part(JK, W.LEA(f, { fill: jerk, maxShade: 40 }));
  W.clipDraw(f, JK, () => {
    f.raw(`<path d="${E.smooth(JK)}" fill="url(#soot${seed})" opacity="0.6"/>`);
    f.stroke([S.at(-0.4, 0.15), S.at(-0.55, 0.45), S.at(-0.48, 0.8)], 5, P.leathD, { op: 0.7 }); // the broad back's turn
    f.stroke([S.at(0.1, 0.3), S.at(0.2, 0.5), S.at(0.14, 0.75)], 3, P.leathD, { op: 0.6 });
    for (let i = 0; i < 18; i++) f.line([S.at(-0.66 + (i % 2) * 0.04, 0.2 + i * 0.04), S.at(-0.5 + (i % 3) * 0.03, 0.24 + i * 0.04)], 1.3, INK, { op: 0.4 });
    f.part([S.at(-0.3, 0.5), S.at(-0.05, 0.48), S.at(-0.04, 0.66), S.at(-0.3, 0.68)].map(q => [...q, 1]), W.LEA(f, { fill: mix(jerk, P.och, 0.3), inkW: 1.2, cast: false })); // patch
    f.stitches([S.at(-0.3, 0.5), S.at(-0.05, 0.48), S.at(-0.04, 0.66), S.at(-0.3, 0.68), S.at(-0.3, 0.5)], '#c8b890', 1);
    f.flat(ell(S.at(-0.3, 0.12), 40, 24, 0.4, 12), P.char, { op: 0.75 }); W.crackNet(f, S.at(-0.3, 0.12), 2.6, 50, 1.8, { depth: 1 }); // scorched where the beam burned
  });
  for (let i = 0; i < 5; i++) { f.part([S.at(0.5, 0.2 + i * 0.13), S.at(0.62, 0.21 + i * 0.13), S.at(0.62, 0.25 + i * 0.13), S.at(0.5, 0.24 + i * 0.13)], { fill: P.leathD, shade: 0.4, inkW: 0.9, cast: false }); } // lacing toggles
  f.line([S.at(0.52, 0.12), S.at(0.5, 0.86)], 1.4, INK, { op: 0.6 });
  // the belt: iron wedges and spikes, the adze, the lamp, the measuring stick, the nail pouch
  f.bone('pelvis');
  const BT = [S.at(-0.62, 0.86), S.at(0.62, 0.84), S.at(0.64, 0.95), S.at(-0.64, 0.97)];
  f.part(BT, W.LEA(f, { fill: P.leathD, k: 0.5 }));
  f.line([S.at(-0.6, 0.9), S.at(0.6, 0.88)], 1, P.leathL, { op: 0.5, dash: '3 4' });
  f.part([S.at(0.36, 0.84), S.at(0.5, 0.84), S.at(0.5, 0.97), S.at(0.36, 0.97)].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1.3, cast: false });
  for (let i = 0; i < 4; i++) { const q = S.at(-0.4 + i * 0.16, 0.92); f.part([add(q, [-7, 0]), add(q, [7, 0]), add(q, [3, 44]), add(q, [-2, 44])], { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.1, cast: false, tex: 'mottle' + seed }); f.line([add(q, [-5, 2]), add(q, [5, 2])], 2, P.iron); } // iron wedges in loops
  for (let i = 0; i < 3; i++) { const q = S.at(0.12 + i * 0.07, 0.94); f.line([q, add(q, [2, 52])], 4, INK); f.line([q, add(q, [2, 52])], 2.4, P.ironL); f.flat(ell(q, 5, 3, 0, 6), P.iron); } // spikes
  const az = S.at(-0.55, 0.94); // the adze at the hip: haft down, the curved blade forward
  f.part(limb(add(az, [0, -16]), add(az, [-14, 120]), 16, 14), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed });
  f.part([add(az, [-12, -26]), add(az, [24, -24]), add(az, [50, -10]), add(az, [58, 8]), add(az, [44, 2]), add(az, [20, -8]), add(az, [-12, -10])], { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false });
  f.line([add(az, [46, 0]), add(az, [56, 6])], 1.4, '#b8b0a0');
  const lpH = S.at(0.0, 0.96); // the lamp hooked on the belt (unlit: he carries it)
  X.oilLamp(f, add(lpH, [0, 6]), 40, { dir: 1, lit: false });
  const ms = S.at(-0.2, 0.92); // the notched measuring stick
  f.part([add(ms, [-6, 0]), add(ms, [6, 0]), add(ms, [-4, 140]), add(ms, [-14, 140])], { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1.1, cast: false, tex: 'wood' + seed });
  for (let i = 1; i < 9; i++) f.line([lerp(add(ms, [6, 0]), add(ms, [-4, 140]), i / 9), add(lerp(add(ms, [6, 0]), add(ms, [-4, 140]), i / 9), [-6, 0])], 1.2, INK);
  const np = S.at(0.3, 0.98); // nail pouch
  f.part([add(np, [-18, 0]), add(np, [18, -2]), add(np, [22, 40]), add(np, [-20, 42])], W.LEA(f, { fill: P.leathL }));
  f.part([add(np, [-20, -4]), add(np, [20, -6]), add(np, [18, 12]), add(np, [-18, 14])], W.LEA(f, { fill: P.leath, inkW: 1.2 }));
  for (let i = 0; i < 3; i++) f.line([add(np, [-10 + i * 8, -4]), add(np, [-12 + i * 8, -16])], 2, P.ironL);

  // ---- near leg: wide, back, braced; breeches tied below the knee, wool hose, a heavy boot
  W.legTube(f, HN, KN, lerp(KN, AN, 0.18), [124, 96, 88], W.CAN(f, { fill: breech }), '_n', { A: AN, bq: [[0, 0.4, 0.14]], bp: [[0, 0.6, 0.12]] });
  f.bone('thigh_n'); f.stroke([lp(HN, KN, 0.3, 40), lp(HN, KN, 0.6, 10), lp(HN, KN, 0.85, -30)], 3, mix(breech, '#000', 0.5)); f.stroke([lp(HN, KN, 0.5, -50), lp(HN, KN, 0.8, -40)], 2.4, mix(breech, '#000', 0.5));
  W.legTube(f, add(KN, [0, -4]), lerp(KN, AN, 0.2), lerp(KN, AN, 0.82), [88, 90, 66], W.CAN(f, { fill: '#5a5040', tex: 'weave' + seed }), '_n', { A: AN, bp: [[1, 0.25, 0.3, 0.18]] });
  W.bootRig(f, KN, AN, 80, '#362d24', '_n', { tex: 'mottle' + seed, shaft: 0.72, toe: 1.15, strap: true });
  f.bone('shin_n'); W.rope(f, [lp(KN, AN, 0.16, -48), lp(KN, AN, 0.19, 0), lp(KN, AN, 0.16, 46)], 3, { col: '#8a7a56' }); f.line([lp(KN, AN, 0.19, 4), lp(KN, AN, 0.3, 14), lp(KN, AN, 0.34, 8)], 2.4, '#8a7a56');
  f.bone('foot_n'); for (let i = 0; i < 5; i++) f.flat(ell([AN[0] - 22 + i * 20, gy - 2], 2.2, 1.8, 0, 6), '#8a8478', { op: 0.9 });

  // ---- head: big, square, under a leather cap; beard singed short, heavy brows; the neck split and crusted
  f.bone('head');
  f.part(limb(neck0, add(HC, [-20, 40]), 92, 80), SKN({ fill: charS }));
  W.seam(f, [lp(neck0, HC, 0.0, -30), lp(neck0, HC, 0.25, -36), lp(neck0, HC, 0.45, -28)], 2.4);
  W.seam(f, [lp(neck0, HC, 0.25, -36), lp(neck0, HC, 0.3, -16)], 1.4, { glow: false });
  for (let i = 0; i < 3; i++) W.crust(f, lp(neck0, HC, 0.15 + i * 0.12, 20), 14, 3, 3, 2.4, 4, { spikes: 0 });
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.22, chin: 0.04, nose: 1.06, hook: 0.1, mouth: 'grim', squint: 0.3, browDown: 0.1, browW: 0.07, age: true, eyeWhite: '#c8bc98', iris: '#1a120c', hairCol: '#2a2018', beard: 'short', beardCol: '#2e241a', faceShade: 0.78, faceHatch: false, jawShade: 0.55 });
  for (let i = 0; i < 14; i++) { const q = hF([[-0.1 + (i % 7) * 0.06, 0.3 + Math.floor(i / 7) * 0.12]])[0]; f.flat(ell(q, 2, 2, 0, 5), P.char, { op: 0.8 }); } // singed beard ends
  const CAP = hF([[0.36, -0.28], [0.3, -0.5], [0.0, -0.62], [-0.32, -0.56], [-0.46, -0.3], [-0.46, -0.04], [-0.34, 0.02], [-0.26, -0.16], [0.0, -0.26], [0.3, -0.22], [0.48, -0.24], [0.5, -0.2]]);
  f.part(CAP, W.LEA(f, { fill: '#3e3020', maxShade: 16 }));
  f.line(hF([[-0.42, -0.2], [-0.1, -0.36], [0.24, -0.32]]), 1.2, P.leathL, { dash: '3 3', op: 0.7 });
  f.line(hF([[-0.05, -0.6], [0.0, -0.3]]), 1.4, INK, { op: 0.6 });
  W.flakes(f, hF([[-0.2, -0.46]])[0], 16, 8, 3, 0.8);

  // ---- the prop across the near shoulder: drawn after the head, so it lies in front of the neck at the shoulder
  f.bone('prop');
  const WD = { fill: '#6e5a40', shadow: '#2a1e12', light: '#8e7652', shade: 0.42, tex: 'wood' + seed, texOp: 0.75, maxShade: 18 };
  const prop = [add(B0, mul(bn, -BR * 0.92)), add(lerp(B0, B1, 0.3), mul(bn, -BR * 1.04)), add(lerp(B0, B1, 0.62), mul(bn, -BR * 0.98)), add(B1, mul(bn, -BR)), [...add(B1, mul(bd, 6)), 1], add(B1, mul(bn, BR)), add(lerp(B0, B1, 0.6), mul(bn, BR * 1.02)), add(lerp(B0, B1, 0.25), mul(bn, BR * 0.96)), add(B0, mul(bn, BR * 0.9)), [...add(B0, mul(bd, -4)), 1]];
  f.part(prop, WD);
  W.clipDraw(f, prop, () => {
    // bark left in strips, axe facets, knots, the grain running along
    for (let i = 0; i < 9; i++) { const t0 = 0.02 + i * 0.105 + f.r() * 0.03, l = W.R(f, 0.06, 0.14), v0 = W.R(f, -1.1, 0.4), w = W.R(f, 0.25, 0.5), pts = []; for (let k = 0; k <= 6; k++) pts.push(add(lerp(B0, B1, t0 + l * k / 6), mul(bn, BR * (v0 + (f.r() - 0.5) * 0.12)))); for (let k = 6; k >= 0; k--) pts.push(add(lerp(B0, B1, t0 + l * k / 6), mul(bn, BR * (v0 + w + (f.r() - 0.5) * 0.15)))); f.part(pts, { fill: '#3a2c1c', shadow: '#1a120a', shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, tex: 'craze' + seed, texOp: 0.5 }); } // bark left in ragged strips along the grain
    for (let i = 0; i < 14; i++) { const t0 = f.r(), v = (f.r() - 0.5) * 1.6; f.line([add(lerp(B0, B1, t0), mul(bn, BR * v)), add(lerp(B0, B1, t0 + 0.05 + f.r() * 0.08), mul(bn, BR * (v + (f.r() - 0.5) * 0.1)))], 1, INK, { op: 0.45 }); } // grain checks
    for (let i = 0; i < 6; i++) { const t0 = 0.1 + i * 0.15; f.line([add(lerp(B0, B1, t0), mul(bn, -BR * 0.2)), add(lerp(B0, B1, t0 + 0.06), mul(bn, BR * 0.5))], 1.4, INK, { op: 0.5 }); } // facet edges
    for (const t of [0.22, 0.48, 0.8]) { const q = add(lerp(B0, B1, t), mul(bn, (f.r() - 0.5) * BR)); f.part(ell(q, 8, 6, bA, 10), { fill: '#4a3420', shade: 0.4, inkW: 1, cast: false }); f.line([add(q, mul(bd, -16)), add(q, mul(bd, -6))], 1, INK, { op: 0.5 }); }
    f.flat([add(B0, mul(bn, BR * 0.3)), add(B1, mul(bn, BR * 0.3)), add(B1, mul(bn, BR)), add(B0, mul(bn, BR))], '#1a120a', { op: 0.35 }); // underside
    f.flat([add(lerp(B0, B1, 0.78), mul(bn, -BR)), add(B1, mul(bn, -BR)), add(B1, mul(bn, BR)), add(lerp(B0, B1, 0.84), mul(bn, BR))], P.char, { op: 0.85 }); // the charred front end
    W.crackNet(f, add(lerp(B0, B1, 0.88), mul(bn, -4)), bA, 60, 2.2, { depth: 1 });
    f.flat([add(lerp(B0, B1, 0.36), mul(bn, BR)), add(lerp(B0, B1, 0.46), mul(bn, BR)), add(lerp(B0, B1, 0.44), mul(bn, 0)), add(lerp(B0, B1, 0.38), mul(bn, 4))], P.char, { op: 0.6 }); // scorched where it rode the burning shoulder
  });
  // the back end: the sawn face of the log, rings, a split
  const E0 = add(B0, mul(bd, -2));
  f.part(ell(E0, 12, BR * 0.95, bA, 14), { fill: '#a88a5a', shadow: '#5a4428', shade: 0.4, inkW: 1.4, cast: false });
  for (const r of [0.3, 0.55, 0.8]) { const e = ell(E0, 12 * r, BR * 0.95 * r, bA, 12); f.line(e.concat([e[0]]), 0.9, '#5a4428', { op: 0.7 }); }
  f.line([E0, add(E0, mul(bn, -BR * 0.9))], 1.4, INK, { op: 0.7 });
  // the iron cap plate nailed on the front end
  const E1 = add(B1, mul(bd, 4));
  f.part([add(B1, add(mul(bn, -BR - 4), mul(bd, -16))), add(B1, mul(bn, -BR - 4)), add(E1, mul(bn, -BR * 0.8)), add(E1, mul(bn, BR * 0.8)), add(B1, mul(bn, BR + 4)), add(B1, add(mul(bn, BR + 4), mul(bd, -16)))], { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.4, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
  for (const v of [-0.6, 0, 0.6]) f.rivet(add(add(B1, mul(bd, -8)), mul(bn, v * BR)), 2.6, P.iron);
  f.flat(ell(add(B1, mul(bn, -BR * 0.2)), 8, 14, bA, 8), P.rust, { op: 0.5 });
  W.ash(f, add(lerp(B0, B1, 0.9), mul(bn, -BR)), 8, 40, 90, 0.9);
  W.smoke(f, add(lerp(B0, B1, 0.92), mul(bn, -BR)), 120, 22, { col: '#5a4e40', op: 0.3, sway: 10, drift: -14 });

  // ---- the leather shoulder pad under the prop, on the torso (shoulder armour belongs to the torso)
  f.bone('torso');
  const pd0 = add(SN, [0, -18]);
  f.part([add(pd0, [-54, 8]), add(pd0, [-30, -22]), add(pd0, [20, -30]), add(pd0, [56, -10]), add(pd0, [50, 26]), add(pd0, [-10, 36]), add(pd0, [-50, 30])], W.LEA(f, { fill: P.leathL }));
  f.line([add(pd0, [-40, 6]), add(pd0, [40, -8])], 1.2, P.leathD, { dash: '3 3' });
  f.flat(ell(add(pd0, [0, -10]), 26, 10, 0.4, 10), P.char, { op: 0.8 }); W.seam(f, [add(pd0, [-14, -10]), add(pd0, [0, -14]), add(pd0, [14, -8])], 1.4);

  // ---- near arm: bare and huge, the shirt sleeve torn off at the shoulder; charred and split down the arm; the hand
  // up under the prop, steadying it
  W.armRig(f, SN, EN, WN, [92, 72, 56], SKN({ fill: mix(skin, charS, 0.4) }), '_n', { capTop: 0.6, bp: [[0, 0.45, 0.18]], bq: [[0, 0.5, 0.1], [1, 0.25, 0.16]] });
  f.bone('upperarm_n');
  f.part(X.rag(f, add(SN, [-4, -14]), lerp(SN, EN, 0.24), 104, 98, { depth: 12, teeth: 7 }), { fill: wool, shadow: '#2a261e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.crackNet(f, lp(SN, EN, 0.35, 8), ang(SN, EN), 120, 2.6, { depth: 2 });
  f.stroke([lp(SN, EN, 0.4, 30), lp(SN, EN, 0.7, 26), lp(SN, EN, 0.92, 18)], 3, P.skinS, { op: 0.5 }); // biceps edge
  W.blisters(f, lp(SN, EN, 0.95, -10), 12, 10, 4, 3, 6); // the swollen elbow
  f.bone('forearm_n');
  W.seam(f, [lp(EN, WN, 0.2, 10), lp(EN, WN, 0.5, 14), lp(EN, WN, 0.8, 8)], 1.8);
  f.line([lp(EN, WN, 0.15, -16), lp(EN, WN, 0.5, -20), lp(EN, WN, 0.85, -12)], 1.4, '#4a3a5a', { op: 0.45 });
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, bA + Math.PI, 30, mix(skin, P.soot, 0.2), { tex: 'mottle' + seed, shadow: P.skinS, name: 'timberman prop' });
  W.blisters(f, gN.F([[0.3, -0.2]])[0], 8, 6, 3, 2.4, 4.4);

  f.bone('root');
  f.flat(ell([460, gy + 2], 260, 8, 0, 20), '#3a3020', { op: 0.5 });
  W.crust(f, [160, gy - 4], 30, 5, 4, 3, 6, { spikes: 0.2 });
  return X.grow(f, GROW.timberman[0], GROW.timberman[1]);
}

// ------------------------------------------------------------------ GALLERY RATS (cast, small swarm, heap 0.45)
// The rats of the galleries, which lived on the miners' bread and then their tallow candles; what they ate burns. A heap
// of rats swarming over an upturned iron food tin, climbing its sides and each other, a few reared up at the top. Fur
// singed away in patches over charred skin split in glowing seams, the tails burned to stubs; bellies swollen tight with
// gas, a few burst open and glowing; the snouts crusted yellow. Round them: the tin's lid, a crust of bread, gnawed
// tallow candle stubs, a miner's leather cap, a length of wick, a dropped lamp on its side, still alight.
// Rig: heap (root, the tin) + rat_1..n (one bone per body, pivot at its hips). Motion: idle a constant seethe (each rat
// bone rocks a little out of phase); attack the swarm pouring over a hero (the bones slide; a swollen rat bursts as VFX).
function galleryRats() {
  const seed = 427, h = TIERS.small[1];
  const f = new Fig(W.base(seed, h, { grimeY: 600 }));
  W.textures(f);
  const gy = f.o.groundY;
  const R = [ // [x, y, length, angle, opts]: back layer first, then the tin, then climbers, the top, the front
    [196, 636, 78, 0.15, { flip: false, col: '#3a2e26', swell: 0.5 }], [392, 626, 84, Math.PI + 0.2, { flip: true, col: '#3a2e26', swell: 0.4, hairless: true }],
    [112, 742, 80, -0.25, { col: '#3e3228', swell: 0.3 }],
    'tin',
    [208, 708, 84, -0.95, { swell: 0.4, hairless: true }], [396, 706, 82, Math.PI + 0.95, { flip: true, swell: 0.6 }],
    [262, 650, 92, -0.12, { swell: 0.9, burst: true }], [346, 646, 88, Math.PI + 0.1, { flip: true, swell: 0.5, hairless: true }],
    [236, 596, 86, -0.35, { swell: 0.5 }], [362, 592, 84, Math.PI + 0.3, { flip: true, swell: 1.0 }],
    [300, 556, 94, -0.85, { swell: 0.4, hairless: true, tail: 0.25 }], [318, 520, 72, -1.25, { swell: 0.2, col: '#54443a' }],
    [168, 770, 88, 0.05, { swell: 0.5, hairless: true }], [438, 772, 86, Math.PI - 0.05, { flip: true, swell: 0.7 }], [508, 768, 66, Math.PI - 0.2, { flip: true, swell: 0.3, col: '#54443a' }],
  ];
  let n = 0; R.forEach(r => { if (r !== 'tin') { n++; f.joint('rat_' + n, [r[0], r[1] + r[2] * 0.12], 'heap'); } });
  f.joint('heap', [300, gy - 40]);
  // ---- the ground clutter behind: the tin's lid, the cap
  f.bone('heap');
  const lid = [146, gy - 6];
  f.part(ell(lid, 60, 14, -0.1, 18), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.3, cast: false, tex: 'mottle' + seed });
  f.flat(ell(add(lid, [2, -2]), 50, 9, -0.1, 16), P.iron, { op: 0.6 }); f.flat(ell(add(lid, [20, -4]), 10, 3, -0.1, 8), P.rust, { op: 0.6 });
  let k = 0;
  const tinD = () => {
    // the food tin, upturned: a riveted iron cylinder, its base now on top, dented, sooty, a rust line, a handle bail
    const c0 = [300, 676], rx = 78, ry = 20, hh = 112;
    const body = [[c0[0] - rx, c0[1]], ...ell(c0, rx, ry, 0, 24).filter((q, i) => i <= 12).map(q => [q[0], q[1] + hh]).reverse().reverse(), [c0[0] + rx, c0[1]]];
    const side = [[c0[0] - rx, c0[1]], [c0[0] - rx, c0[1] + hh], ...ell([c0[0], c0[1] + hh], rx, ry, 0, 24).slice(0, 13), [c0[0] + rx, c0[1]]];
    f.part(side, { fill: P.ironL, shadow: '#15110e', light: '#8a847a', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, maxShade: 30 });
    W.clipDraw(f, side, () => { f.raw(`<rect x="200" y="660" width="200" height="140" fill="url(#soot${seed})" opacity="0.8"/>`); for (const x of [-50, 0, 50]) f.line([[c0[0] + x, c0[1] + 6], [c0[0] + x, c0[1] + hh + 18]], 1, INK, { op: 0.4 }); f.flat(ell([c0[0] + 30, c0[1] + 60], 18, 26, 0, 10), '#1a1612', { op: 0.5 }); });
    for (let i = 0; i < 7; i++) f.rivet([c0[0] - rx + 10 + i * 24, c0[1] + 16 + Math.sin(i / 6 * Math.PI) * 10], 2, P.iron);
    f.line([[c0[0] - rx + 4, c0[1] + 70], [c0[0] + rx - 4, c0[1] + 80]], 3, P.rust, { op: 0.5 });
    const top = ell(c0, rx, ry, 0, 24);
    f.part(top, { fill: '#5a544c', shadow: '#2a2622', shade: 0.4, inkW: 1.4, cast: false, tex: 'mottle' + seed });
    f.flat(ell(add(c0, [10, 2]), 30, 8, 0.1, 12), '#2a2622', { op: 0.6 }); // a dent
    const bl = [[c0[0] + rx - 4, c0[1] + 14], [c0[0] + rx + 14, c0[1] + 30], [c0[0] + rx + 6, c0[1] + 50]]; f.line(bl, 4, INK); f.line(bl, 2.4, P.ironL); // the bail, hanging
    W.crust(f, [c0[0] - 40, c0[1] + hh - 4], 20, 4, 3, 3, 5, { spikes: 0.2 });
  };
  // a gnawed candle stub
  const stub = (p, a, l) => { const d = rot([1, 0], a), nn = [-d[1], d[0]], q = add(p, mul(d, l)); f.part([add(p, mul(nn, 7)), add(q, mul(nn, 7)), add(q, mul(nn, 3)), add(lerp(p, q, 0.8), mul(nn, 0)), add(q, mul(nn, -5)), add(q, mul(nn, -7)), add(p, mul(nn, -7))], { fill: '#d8ccaa', shadow: '#8a7e60', shade: 0.4, inkW: 1, cast: false, hatch: false }); for (let i = 0; i < 3; i++) f.line([add(lerp(p, q, 0.6 + i * 0.12), mul(nn, 7)), add(lerp(p, q, 0.62 + i * 0.12), mul(nn, 3))], 0.9, '#8a7e60'); f.line([p, add(p, mul(d, -6))], 1.4, INK); };
  for (const r of R) {
    if (r === 'tin') { f.bone('heap'); tinD(); continue; }
    k++; f.bone('rat_' + k);
    const [x, y, L, a, o] = r;
    X.rat(f, [x, y], L, a, Object.assign({ col: '#4a3c30' }, o));
    if (o.burst) W.ash(f, [x - 10, y], 6, 30, 60, 0.6);
  }
  // ---- the front clutter: bread crust, candle stubs, the wick, the cap, the dropped lamp still burning
  f.bone('heap');
  const br = [232, gy - 8];
  f.part([add(br, [-30, 6]), add(br, [-26, -10]), add(br, [-6, -18]), add(br, [22, -14]), add(br, [34, 2]), add(br, [20, 8])], { fill: '#8a6a3a', shadow: '#3a2814', light: '#b89a62', shade: 0.42, inkW: 1.2, cast: false, tex: 'grain' + seed, texOp: 0.5 });
  f.flat([add(br, [-20, -2]), add(br, [-4, -10]), add(br, [16, -8]), add(br, [8, 0])], '#d8c49a', { op: 0.7 }); for (let i = 0; i < 4; i++) f.flat(ell(add(br, [-14 + i * 8, -4]), 2, 1.5, 0, 6), '#3a2814'); // gnawed crumb
  stub([372, gy - 8], -0.2, 30); stub([548, gy - 6], 2.9, 24);
  W.rope(f, [[392, gy - 4], [420, gy - 10], [452, gy - 3], [486, gy - 9], [510, gy - 4]], 2, { col: '#c8bc98' }); // a length of wick
  const cap = [548, gy - 18]; // the miner's leather cap, on its side
  f.part([add(cap, [-34, 16]), add(cap, [-36, -6]), add(cap, [-20, -22]), add(cap, [10, -26]), add(cap, [32, -10]), add(cap, [36, 16])], W.LEA(f, { fill: '#3e3020' }));
  f.part([add(cap, [-38, 14]), add(cap, [40, 12]), add(cap, [46, 18]), add(cap, [-40, 20])], W.LEA(f, { fill: '#2e2418', inkW: 1.2, cast: false }));
  f.line([add(cap, [-30, -2]), add(cap, [0, -16]), add(cap, [28, -4])], 1, P.leathL, { dash: '2 3', op: 0.7 });
  f.flat(ell(add(cap, [6, -10]), 10, 6, 0, 8), P.char, { op: 0.8 });
  // the dropped lamp, on its side, the spilled oil burning on the floor
  const lm = [68, gy - 14];
  f.part([add(lm, [-30, 8]), add(lm, [-24, -14]), add(lm, [4, -18]), add(lm, [26, -10]), add(lm, [40, -2]), add(lm, [26, 10]), add(lm, [0, 14])], { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false, tex: 'mottle' + seed });
  f.line([add(lm, [-26, -4]), add(lm, [-44, -20]), add(lm, [-40, -30])], 3, INK); f.line([add(lm, [-26, -4]), add(lm, [-44, -20]), add(lm, [-40, -30])], 1.6, P.ironL);
  f.flat(ell(add(lm, [40, 12]), 40, 5, 0, 14), '#1a140c', { op: 0.7 });
  X.flame(f, add(lm, [44, 10]), 34, { w: 16, lean: 0.1, phase: 2.2, glowOp: 0.3, smoke: true });
  X.wickFlame(f, add(lm, [70, 12]), 14, { glowOp: 0.2, soot: false });
  f.bone('root');
  f.flat(ell([300, gy + 2], 250, 7, 0, 20), '#3a3020', { op: 0.5 });
  for (let i = 0; i < 12; i++) f.flat(ell([90 + i * 38, gy - 2 + (i % 2)], 1.8, 1.2, 0, 5), '#1a140c'); // droppings
  return f;
}

// ------------------------------------------------------------------ THE SHRINE-BEARER (elite, 2.3 to the shrine's top)
// The mine priest who carried the miners' portable shrine through the galleries on feast days, and was carrying it
// when the powder answered. A broad, strong priest of human height bent forward under an oak tower-chapel on a carrying
// frame strapped to his back: a plinth, a tall body with three arched windows (the big one below holding a small gilded
// holy figure among burning lamps), a steep shingled roof, a bell in a little cote on the ridge. Candles along the eaves
// have melted into beards; miners' tally tokens hang from it as offerings; scorched prayer slips are nailed to its
// sides. He leans on a processional staff topped with a small gilt cross-lamp in his near hand; his far hand holds a
// wooden rosary. Fire: the shrine's lamps have burned onto his back for years, so his back, neck and shoulders are
// charred and split in glowing seams, the char running down the arms in streaks. Toxin: a sulphur crust has grown over
// the shrine's base and his shoulders together, knitting them into one, and ripened the skin under the straps into
// blisters. A surplice scorched to the waist over a miner's leather jerkin and wool breeches, leather knee pads,
// hobnailed boots. A tonsured, soot-streaked head, a broad stubborn face, lips moving in prayer, eyes streaming.
// (The bible's 2.3 puts the bell above the elite canvas; the cote's top stands at about 2.1.)
// Rig: standard humanoid + shrine (parent torso) + bell (parent shrine) + staff (parent hand_n) + rosary (parent hand_f)
// + skirt. Motion: idle a kneeling dip and a mumbled blessing (knees, torso, the lamps flickering as VFX); attack a
// blessing of the gas: the lamps flare and burning gas rolls out of the windows (VFX from the window points).
function shrineBearer() {
  const seed = 423, h = TIERS.elite[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1100 }));
  W.textures(f);
  const H = 102, gy = f.o.groundY;
  const skin = mix(P.skin, '#c0a080', 0.15), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, maxShade: 18 }, o));
  const charS = mix(P.char, skin, 0.3), surp = '#7a766c', surpD = '#56524a', gold = '#b08a3a', goldD = '#5a4418', goldL = '#e0c070';
  const N = [598, 862], C = [500, 900], Pv = [478, 1064];
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.1, -0.02), HC = [656, 830], hA = 0.2;
  const SN = S.at(-0.05, 0.14), EN = [626, 990], WN = [728, 962];
  const SF = S.at(0.35, 0.08), EF = [648, 1004], WF = [702, 972];
  const HN = [488, 1074], KN = [578, 1206], AN = [536, 1338];
  const HF = [462, 1068], KF = [512, 1214], AF = [432, 1336];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const stT = [694, 556], stB = [752, gy - 2], sd = E.norm(sub(stT, stB)), sA = Math.atan2(sd[1], sd[0]);
  const SB = [410, 986], tilt = 0.12, SH0 = frame(SB, tilt, 1), SH = pts => SH0(pts.map(q => q.length > 2 ? [q[0], q[1] * 1.24, q[2]] : [q[0], q[1] * 1.24])); // the tower stretched to reach 2.3 (bible) // the shrine's base centre and frame (x across, y up negative)
  f.joint('shrine', S.at(-0.3, 0.3), 'torso').joint('bell', SH([[0, -800]])[0], 'shrine').joint('staff', WN, 'hand_n').joint('rosary', WF, 'hand_f').joint('skirt', S.at(0, 0.86), 'pelvis');

  // ---------------- the shrine (behind him)
  f.bone('shrine');
  const OAK = (o = {}) => Object.assign({ fill: '#5e4630', shadow: '#24180e', light: '#86684a', shade: 0.42, tex: 'wood' + seed, texOp: 0.6, maxShade: 26 }, o);
  // the carrying frame: two uprights and a shelf behind his back
  for (const x of [-60, 70]) f.part(SH([[x - 9, 30], [x + 9, 30], [x + 9, -200], [x - 9, -200]]), OAK({ fill: '#4a3624' }));
  f.part(SH([[-150, 20], [150, 20], [150, 0], [-150, 0]]), OAK({ fill: '#4a3624' }));
  // plinth with mouldings
  f.part(SH([[-140, 0], [140, 0], [146, -20], [136, -30], [136, -96], [148, -104], [148, -118], [-148, -118], [-148, -104], [-136, -96], [-136, -30], [-146, -20]]), OAK());
  f.part(SH([[136, -30], [168, -40], [168, -108], [148, -118], [148, -104], [136, -96]]), OAK({ fill: '#3e2e1e' })); // its side
  W.clipDraw(f, SH([[-140, 0], [140, 0], [140, -118], [-140, -118]]), () => { for (let i = 0; i < 5; i++) f.line(SH([[-130 + i * 60, -30], [-120 + i * 60, -96]]), 1.2, INK, { op: 0.4 }); f.raw(`<path d="${E.smooth(SH([[-140, 0], [140, 0], [140, -118], [-140, -118]]).map(q => [...q, 1]))}" fill="url(#soot${seed})" opacity="0.7"/>`); });
  // the body: the face toward us with its windows, a narrow side face going away to the right
  const BOD = SH([[-118, -118], [118, -118], [118, -566], [-118, -566]]);
  const SIDE = SH([[118, -118], [150, -128], [150, -576], [118, -566]]);
  f.part(SIDE.map(q => [...q, 1]), OAK({ fill: '#3a2a1a' }));
  f.part(BOD.map(q => [...q, 1]), OAK());
  W.clipDraw(f, BOD, () => {
    f.raw(`<path d="${E.smooth(BOD.map(q => [...q, 1]))}" fill="url(#soot${seed})" opacity="0.5"/>`);
    for (const x of [-118, -60, 0, 60]) f.line(SH([[x + 4, -120], [x + 4, -564]]), 1.2, INK, { op: 0.35 }); // boards
    f.flat(SH([[-118, -400], [118, -380], [118, -566], [-118, -566]]), '#000', { op: 0.25 }); // soot up the top
  });
  for (const y of [-118, -410, -566]) f.part(SH([[-124, y + 8], [124, y + 8], [124, y - 8], [-124, y - 8]]).map(q => [...q, 1]), OAK({ fill: '#6e5438', inkW: 1.2, cast: false })); // rails
  for (const x of [-118, 118]) f.part(SH([[x - 9, -118], [x + 9, -118], [x + 9, -566], [x - 9, -566]]).map(q => [...q, 1]), OAK({ fill: '#6e5438', inkW: 1.2, cast: false })); // corner posts
  // the arched windows: dark inside, the lamps lit within, the holy figure in the big one
  const arch = (x0, x1, y0, y1) => { const cx = (x0 + x1) / 2, r = (x1 - x0) / 2, pts = [[x0, y0]]; for (let i = 0; i <= 8; i++) { const a = Math.PI + Math.PI * i / 8; pts.push([cx + Math.cos(a) * r, y1 + Math.sin(a) * r * 1.2]); } pts.push([x1, y0]); return SH(pts); };
  const win = [[-56, 56, -150, -330], [-90, -22, -426, -490], [22, 90, -426, -490]];
  win.forEach(([x0, x1, y0, y1], i) => {
    const wp = arch(x0, x1, y0, y1);
    f.flat(wp, '#120a06');
    W.clipDraw(f, wp, () => { W.glow(f, SH([[(x0 + x1) / 2, (y0 + y1) / 2 + 10]])[0], (x1 - x0) * 0.7, (y0 - y1) * 0.5, P.lamp, 0.55); });
    const fr = arch(x0 - 8, x1 + 8, y0 + 6, y1);
    f.line(fr.concat([]), 3, INK); f.line(fr, 7, '#6e5438', { op: 0.9 }); f.line(wp.concat([wp[0]]), 1.6, INK);
  });
  // the holy figure: a small gilded saint with a halo, among two burning lamps
  const sf = SH([[0, -170]])[0], SF2 = frame(sf, tilt, 1);
  f.part(SF2([[-22, 0], [22, 0], [18, -70], [12, -96], [-12, -96], [-18, -70]]), { fill: gold, shadow: goldD, light: goldL, shade: 0.45, inkW: 1.2, inkHeavy: 1.8, cast: false, tex: 'mottle' + seed, texOp: 0.4 });
  f.part(SF2(ell([0, -110], 13, 15, 0, 12)), { fill: gold, shadow: goldD, light: goldL, shade: 0.45, inkW: 1.1, cast: false });
  const halo = SF2(ell([0, -114], 24, 24, 0, 16)); f.line(halo.concat([halo[0]]), 2.4, goldL, { op: 0.9 });
  f.line(SF2([[-10, -60], [0, -40], [10, -60]]), 1.2, goldD); f.line(SF2([[-14, -30], [-12, -4]]), 1, goldD); f.line(SF2([[8, -36], [10, -6]]), 1, goldD); // robe folds, hands joined
  f.flat(SF2(ell([0, -108], 5, 3, 0, 6)), goldD, { op: 0.7 });
  for (const x of [-40, 40]) { const lb = SF2([[x, 0]])[0]; f.part([add(lb, [-10, 0]), add(lb, [10, 0]), add(lb, [6, -10]), add(lb, [-6, -10])], { fill: P.iron, shade: 0.4, inkW: 1, cast: false }); X.wickFlame(f, add(lb, [0, -12]), 20, { glowOp: 0.4, soot: false }); }
  for (const [x0, x1, y0, y1] of win.slice(1)) X.wickFlame(f, SH([[(x0 + x1) / 2, y0 - 8]])[0], 16, { glowOp: 0.35, soot: false });
  // scorched prayer slips nailed to the face and the side
  for (const [x, y, a] of [[-96, -200, 0.1], [84, -240, -0.15], [-86, -360, -0.1], [134, -300, 0.05], [134, -460, -0.1]]) { const c0 = SH([[x, y]])[0], PF = frame(c0, a + tilt, 1); f.part(PF([[-12, -18], [12, -20], [14, 22], [4, 18], [-2, 26], [-12, 20]]), { fill: '#d0c4a0', shadow: '#7a6e50', shade: 0.4, inkW: 1, cast: false, hatch: false }); for (let k = 0; k < 4; k++) f.line(PF([[-8, -10 + k * 7], [8, -11 + k * 7]]), 0.8, '#5a4a30', { op: 0.7 }); f.flat(PF([[4, 12], [14, 10], [14, 22], [4, 18]]), P.char, { op: 0.8 }); f.rivet(PF([[0, -14]])[0], 1.8, P.iron); }
  // the roof: a steep gable of shingles, its right slope going away; a bell-cote on the ridge with a bronze bell
  const ROOF = SH([[-162, -590], [0, -790], [162, -590]]);
  f.part([...SH([[162, -590], [192, -600], [32, -800], [0, -790]])].map(q => [...q, 1]), OAK({ fill: '#2e2216' }));
  f.part(ROOF.map(q => [...q, 1]), OAK({ fill: '#54402a' }));
  W.clipDraw(f, ROOF, () => {
    for (let r = 0; r < 9; r++) { const y = -600 - r * 22, w = 156 * (1 - (r * 22 + 10) / 200); for (let k = -4; k <= 4; k++) { const x = k * 32 + (r % 2) * 16; if (Math.abs(x) > w) continue; f.line(SH([[x, y], [x, y - 20]]), 1, INK, { op: 0.5 }); } f.line(SH([[-w, y - 20], [w, y - 20]]), 1.3, INK, { op: 0.55 }); }
    f.flat(SH([[-162, -590], [0, -790], [40, -700], [-60, -620]]), '#000', { op: 0.25 });
    W.flakes(f, SH([[-40, -660]])[0], 60, 40, 7, 1);
  });
  // the eaves: a cornice with candles stuck along it, the wax run down into beards
  f.part(SH([[-150, -560], [168, -570], [172, -592], [-154, -588]]), OAK({ fill: '#4e3a26' }));
  for (let i = 0; i < 7; i++) { const x = -136 + i * 46, b0 = SH([[x, -590]])[0]; f.part([add(b0, [-6, 2]), add(b0, [6, 2]), add(b0, [5, -26 - (i % 3) * 8]), add(b0, [-5, -24 - (i % 3) * 8])], { fill: '#e0d4b4', shadow: '#8a7e60', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); const bL = 8 + (i * 13) % 16, bx = SH([[x, -588]])[0]; f.part([add(bx, [-9, 0]), add(bx, [9, 0]), add(bx, [11, 10]), add(bx, [7, 14 + bL * 0.4]), add(bx, [4, 12]), add(bx, [1, 18 + bL]), add(bx, [-3, 14]), add(bx, [-8, 16 + bL * 0.6]), add(bx, [-11, 8])], { fill: '#e8dcbc', shadow: '#9a8e70', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); f.flat(ell(add(bx, [1, 20 + bL]), 2, 2.6, 0, 6), '#e8dcbc'); const tp = add(b0, [0, -26 - (i % 3) * 8]); f.line([tp, add(tp, [0, -4])], 1.2, INK); if (i % 2 === 0) X.wickFlame(f, add(tp, [0, -4]), 14, { glowOp: 0.22 }); }
  const ap = SH([[0, -792]])[0];
  f.part(SH([[-26, -790], [26, -790], [24, -862], [-24, -862]]).map(q => [...q, 1]), OAK({ fill: '#4a3624' }));
  f.flat(SH([[-16, -800], [16, -800], [16, -852], [-16, -852]]), '#120a06');
  f.part(SH([[-34, -860], [0, -890], [34, -860]]), OAK({ fill: '#3a2a1a' }));
  f.bone('bell');
  const bb = SH([[0, -808]])[0], BF = frame(bb, tilt, 1);
  f.part(BF([[-16, 0], [-12, -12], [-8, -38], [0, -42], [8, -38], [12, -12], [16, 0]]), { fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.45, inkW: 1.2, cast: false, tex: 'mottle' + seed });
  f.flat(BF(ell([0, 2], 4, 4, 0, 6)), P.iron); f.line(BF([[0, -42], [0, -48]]), 2, P.iron);
  f.flat(BF([[4, -34], [8, -12], [6, -4]]), '#4a6a52', { op: 0.5 }); // verdigris
  f.bone('shrine');
  // tally tokens hung as offerings on cords from the cornice and the plinth
  for (const [x, y, l] of [[-130, -584, 60], [-80, -584, 90], [150, -592, 70], [-120, -112, 40], [60, -112, 54]]) { const p0 = SH([[x, y]])[0], p1 = add(p0, [0, l]); f.line([p0, p1], 1.2, '#6a5a40'); f.part(ell(add(p1, [0, 8]), 8, 9, 0, 10), { fill: P.brass, shadow: P.brassD, shade: 0.4, inkW: 1, cast: false }); f.line([add(p1, [-3, 5]), add(p1, [-3, 11])], 1, INK, { op: 0.7 }); f.line([add(p1, [1, 5]), add(p1, [3, 11])], 1, INK, { op: 0.7 }); }
  // the sulphur crust grown over the plinth (it carries on over his shoulders, drawn with the torso)
  W.crust(f, SH([[60, -60]])[0], 70, 40, 12, 6, 12, { spikes: 0.4 });
  W.druse(f, SH([[110, -40]])[0], -Math.PI / 2 + 0.3, 30, 5);
  W.smoke(f, SH([[0, -870]])[0], 160, 36, { col: '#6a5a48', op: 0.3, sway: 20, drift: 30 });
  W.ash(f, SH([[0, -880]])[0], 10, 60, 140, 1);

  // ---------------- far arm (rosary) and far leg
  W.armRig(f, SF, EF, WF, [44, 38, 30], SKN({ fill: mix(charS, P.soot, 0.3) }), '_f', { capTop: 0.6 });
  f.bone('upperarm_f'); f.part(K.chain([SF, lerp(SF, EF, 0.6), add(EF, [0, 4])], [58, 52, 54]), { fill: surpD, shadow: '#36332e', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.bone('rosary');
  const rs = add(WF, [0, 14]); const beadsP = []; for (let i = 0; i < 16; i++) { const t = i / 15; beadsP.push(add(rs, [Math.sin(t * Math.PI) * 26 - 8, t * 110])); }
  f.line(beadsP, 1.2, '#5a4a30');
  beadsP.forEach((q, i) => f.part(ell(q, i % 5 === 4 ? 5.5 : 4, i % 5 === 4 ? 5.5 : 4, 0, 8), { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 0.9, cast: false, hatch: false }));
  const rc = add(beadsP[15], [0, 10]); f.line([add(rc, [0, -6]), add(rc, [0, 20])], 4, INK); f.line([add(rc, [0, -6]), add(rc, [0, 20])], 2.6, P.wood); f.line([add(rc, [-8, 2]), add(rc, [8, 2])], 4, INK); f.line([add(rc, [-8, 2]), add(rc, [8, 2])], 2.6, P.wood);
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 22, charS, { tex: 'mottle' + seed, shadow: '#0e0a08', name: 'shrine rosary', quiet: true });
  const bootLeg = (Hp, Kn, A, sfx, tone) => {
    W.legTube(f, Hp, Kn, lerp(Kn, A, 0.55), [86, 64, 54], W.CAN(f, { fill: mix('#5a5040', '#000', tone) }), sfx, Object.assign({ A }, LEGB));
    W.bootRig(f, Kn, A, 60, mix('#362d24', '#000', tone), sfx, { tex: 'mottle' + seed, shaft: 0.9, toe: 1.12, strap: !tone });
    f.bone('shin' + sfx);
    f.part([add(Kn, [-10, -26]), add(Kn, [30, -30]), add(Kn, [42, 4]), add(Kn, [32, 34]), add(Kn, [-4, 30])], W.LEA(f, { fill: mix(P.leath, '#000', tone) })); // knee pad
    W.rope(f, [add(Kn, [-6, -30]), add(Kn, [-30, 0]), add(Kn, [-6, 32])], 2.2, { col: '#6a5a40' });
    f.bone('foot' + sfx); for (let i = 0; i < 5; i++) f.flat(ell([A[0] - 18 + i * 15, gy - 2], 1.8, 1.5, 0, 6), '#8a8478', { op: 0.9 });
  };
  bootLeg(HF, KF, AF, '_f', 0.25);

  // ---------------- torso: jerkin, the surplice over it scorched to the waist; the back charred and split under the frame
  f.bone('torso');
  const TOR = S.shape([[-0.06, 0.42, 0.38], [0.12, 0.66, 0.54], [0.35, 0.7, 0.6], [0.6, 0.6, 0.6], [0.85, 0.56, 0.6], [1.0, 0.6, 0.6]]);
  f.part(TOR, SKN({ fill: charS, shadow: '#0e0a08', maxShade: 26 }));
  W.clipDraw(f, TOR, () => { W.crackNet(f, S.at(-0.45, 0.1), 3.0, 120, 3, { depth: 2 }); W.crackNet(f, S.at(-0.5, 0.4), 2.6, 90, 2.4, { depth: 2 }); W.crackNet(f, S.at(-0.2, 0.05), 2.2, 80, 2, { depth: 1 }); });
  // the surplice: burnt away over the back and shoulders, hanging whole from the chest down to the knee in front
  const SUR = [S.at(0.1, 0.12), S.at(0.62, 0.1), S.at(0.66, 0.5), S.at(0.64, 0.86), add(S.at(0.7, 1.0), [20, 60]), add(S.at(0.5, 1.0), [10, 130]), [...add(S.at(0.2, 1.0), [0, 150]), 1], add(S.at(-0.1, 1.0), [-6, 128]), [...add(S.at(-0.45, 1.0), [-14, 146]), 1], add(S.at(-0.66, 1.0), [-20, 110]), S.at(-0.66, 0.8), S.at(-0.6, 0.6), [...S.at(-0.42, 0.52), 1], S.at(-0.3, 0.42), [...S.at(-0.2, 0.3), 1], S.at(-0.04, 0.24)];
  split(f, () => {
    f.part(SUR, { fill: surp, shadow: '#3e3b36', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 });
    f.raw(`<path d="${E.smooth(SUR)}" fill="url(#soot${seed})" opacity="0.7"/>`);
  }, [['skirt', side(S.at(0, 0.84), S.T(0.84))], ['torso', side(S.at(0, 0.86), mul(S.T(0.86), -1))]]);
  f.bone('skirt');
  for (const [a0, b0] of [[[0.4, 0.88], [0.55, 1.25]], [[0.0, 0.88], [-0.05, 1.3]], [[-0.4, 0.88], [-0.5, 1.25]]]) f.stroke([S.at(...a0), lerp(S.at(...a0), add(S.at(b0[0], 1.0), [0, (b0[1] - 1) * 400]), 0.5), add(S.at(b0[0], 1.0), [0, (b0[1] - 1) * 400])], 3, mix(surp, '#000', 0.55));
  for (const q of [add(S.at(0.2, 1.0), [0, 150]), add(S.at(-0.45, 1.0), [-14, 146])]) W.seam(f, [add(q, [-10, -10]), q, add(q, [10, -12])], 1.3, { glowOp: 0.25 });
  W.ash(f, add(S.at(0, 1.0), [0, 130]), 8, 140, 60, 0.8);
  f.bone('torso');
  for (const q of [S.at(-0.42, 0.52), S.at(-0.2, 0.3)]) { f.flat([add(q, [-10, -8]), q, add(q, [10, -10]), add(q, [0, -2])], P.char, { op: 0.9 }); W.seam(f, [add(q, [-8, -6]), q, add(q, [8, -8])], 1.2, { glowOp: 0.25 }); }
  f.part([S.at(0.2, 0.1), S.at(0.62, 0.1), S.at(0.6, 0.24), S.at(0.24, 0.22)], W.LEA(f, { fill: P.leathL })); // the jerkin collar
  // the carrying straps: leather padded with sacking, from the frame over the shoulders to the chest; the skin under
  // them blistered, the sulphur crust knitting the frame's foot and his shoulders into one
  for (const [a0, b0, c0] of [[S.at(-0.6, 0.0), S.at(0.0, -0.06), S.at(0.5, 0.36)], [S.at(-0.6, 0.6), S.at(0.0, 0.74), S.at(0.62, 0.66)]]) {
    W.blisters(f, lerp(a0, b0, 0.6), 20, 8, 4, 3, 5);
    const pts = W.spline([a0, b0, c0], 6); f.part(K.chain(pts, pts.map(() => 26), { steps: 2 }), W.LEA(f, { fill: P.leath, cast: false }));
    f.part(K.chain(pts.slice(2, 10), pts.slice(2, 10).map(() => 34), { steps: 2 }), W.CAN(f, { fill: P.canvas, cast: false })); // sacking pad
    f.line(pts.map(q => add(q, [0, -9])), 1, P.leathL, { op: 0.5, dash: '3 3' });
  }
  W.crust(f, S.at(-0.4, 0.04), 50, 18, 12, 5, 11, { spikes: 0.45 });
  W.druse(f, S.at(-0.55, 0.12), -2.3, 34, 5);
  W.flakes(f, S.at(-0.3, 0.2), 30, 20, 6, 1);
  W.ash(f, S.at(-0.3, 0.0), 10, 50, 120, 1);

  // ---------------- near leg
  bootLeg(HN, KN, AN, '_n', 0);

  // ---------------- head: tonsured, soot-streaked, broad and stubborn, lips moving, eyes streaming; the neck charred
  f.bone('head');
  f.part(limb(neck0, add(HC, [-12, 30]), 58, 50), SKN({ fill: charS }));
  W.seam(f, [lp(neck0, HC, 0.0, -22), lp(neck0, HC, 0.3, -26), lp(neck0, HC, 0.5, -20)], 2);
  W.seam(f, [lp(neck0, HC, 0.3, -26), lp(neck0, HC, 0.36, -8)], 1.2, { glow: false });
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.18, chin: 0.04, nose: 1.04, mouth: 'set', squint: 0.45, browDown: 0.12, browW: 0.06, age: true, eyeWhite: '#c8b878', iris: '#1a120c', hairCol: '#3a3028', beard: 'stubble', beardCol: '#2a2018', faceShade: 0.8, faceHatch: false, jawShade: 0.55, lips: true,
    hair: [[0.18, -0.34], [0.0, -0.42], [-0.22, -0.42], [-0.42, -0.3], [-0.5, -0.06], [-0.44, 0.14], [-0.38, 0.1], [-0.42, -0.06], [-0.34, -0.24], [-0.18, -0.32], [0.0, -0.33], [0.16, -0.28]],
    hairLines: [[[-0.3, -0.34], [-0.42, -0.18]], [[-0.08, -0.38], [-0.24, -0.36]]] });
  f.flat(hF(ell([-0.06, -0.46], 0.26, 0.1, -0.1, 12)), mix(skin, '#fff', 0.3), { op: 0.3 }); // the tonsure
  for (const q of [[0.08, -0.2], [0.22, -0.1], [-0.05, 0.1]]) W.soot(f, hF([q])[0], 12, 5, 0.4, hA + 1.2); // soot streaks
  f.flat(hF([[0.2, 0.27], [0.26, 0.255], [0.31, 0.27], [0.3, 0.3], [0.24, 0.31]]), '#2a160e', { op: 0.9 }); // the mouth a little open, praying
  for (const ex of [0.11, 0.3]) { const q = hF([[ex, -0.03]])[0]; f.line([q, add(q, [1, 10]), add(q, [-1, 22])], 1.6, '#c8d0cc', { op: 0.7 }); W.drip(f, add(q, [-1, 22]), 0.35, '#c8d0cc'); } // eyes streaming
  W.blisters(f, hF([[-0.1, 0.3]])[0], 8, 6, 2, 2, 3.4, { col: mix(skin, P.sul, 0.5) });

  // ---------------- the processional staff, planted; the near arm on it
  f.bone('staff');
  f.part(limb(stB, stT, 16, 14, { steps: 10, capK: 0.6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(stB, stT, 0.02, -4), lp(stB, stT, 0.98, -3)], 1, P.woodL, { op: 0.6, straight: true });
  for (const t of [0.2, 0.45, 0.7]) f.line([lp(stB, stT, t, -7), lp(stB, stT, t + 0.01, 7)], 1, INK, { op: 0.45, straight: true });
  f.part([lp(stB, stT, 0, -10), lp(stB, stT, 0, 10), lp(stB, stT, 0.04, 9), lp(stB, stT, 0.04, -9)], { fill: P.iron, shade: 0.4, inkW: 1, cast: false }); // iron ferrule
  // the gilt cross-lamp: a little lantern cage under a cross (holy gold), the lamp lit inside
  const CF = frame(stT, sA + Math.PI / 2, 1);
  f.part(CF([[-9, 6], [9, 6], [9, -8], [-9, -8]]), { fill: gold, shadow: goldD, light: goldL, shade: 0.45, inkW: 1.1, cast: false });
  const lc = CF([[0, -40]])[0];
  W.glow(f, lc, 40, 40, P.lampL, 0.35);
  f.part(CF([[-20, -8], [20, -8], [22, -14], [-22, -14]]), { fill: gold, shadow: goldD, shade: 0.45, inkW: 1.1, cast: false });
  for (const x of [-18, -6, 6, 18]) f.line(CF([[x, -14], [x * 0.9, -62]]), 3, INK); for (const x of [-18, -6, 6, 18]) f.line(CF([[x, -14], [x * 0.9, -62]]), 1.6, gold);
  X.wickFlame(f, CF([[0, -22]])[0], 22, { glowOp: 0.3, soot: false });
  f.part(CF([[-22, -62], [22, -62], [14, -74], [-14, -74]]), { fill: gold, shadow: goldD, light: goldL, shade: 0.45, inkW: 1.1, cast: false });
  f.part(CF([[-4, -74], [4, -74], [4, -96], [14, -96], [14, -104], [4, -104], [4, -118], [-4, -118], [-4, -104], [-14, -104], [-14, -96], [-4, -96]]).map(q => [...q, 1]), { fill: gold, shadow: goldD, light: goldL, shade: 0.45, inkW: 1.2, cast: false, tex: 'mottle' + seed });
  W.smoke(f, CF([[0, -120]])[0], 120, 22, { col: '#5a4e40', op: 0.3, sway: 10 });
  // near arm: the surplice sleeve, the charred forearm with its streaks, the fist round the staff
  f.bone('torso');
  W.armRig(f, SN, EN, WN, [56, 46, 36], SKN({ fill: mix(skin, charS, 0.5) }), '_n', { capTop: 0.6, bp: [[0, 0.4, 0.12]] });
  f.bone('upperarm_n');
  f.part(K.chain([add(SN, [-2, -10]), lerp(SN, EN, 0.6), add(EN, [2, 6])], [72, 64, 66]), { fill: surp, shadow: '#3e3b36', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.flat([add(SN, [-36, -10]), add(SN, [20, -20]), lp(SN, EN, 0.4, 30), lp(SN, EN, 0.3, -30)], P.char, { op: 0.75 }); // scorched over the shoulder
  f.stroke([lp(SN, EN, 0.35, -18), lp(SN, EN, 0.6, -10), lp(SN, EN, 0.88, -18)], 2.4, surpD);
  f.bone('forearm_n');
  f.part(X.rag(f, lp(EN, WN, -0.08, 0), lp(EN, WN, 0.3, 0), 64, 60, { depth: 12, teeth: 6 }), { fill: surp, shadow: '#3e3b36', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  for (const off of [-6, 8]) W.seam(f, [lp(EN, WN, 0.35, off), lp(EN, WN, 0.55, off + 4), lp(EN, WN, 0.8, off)], 1.4); // the char running down in streaks
  f.bone('hand_n');
  B.grip(f, WN, EN, sA, 26, charS, { tex: 'mottle' + seed, shadow: '#0e0a08', name: 'shrine staff' });

  f.bone('root');
  f.flat(ell([520, gy + 2], 260, 8, 0, 20), '#3a3020', { op: 0.5 });
  W.crust(f, [860, gy - 4], 40, 5, 4, 3, 6, { spikes: 0.2 });
  return X.grow(f, GROW.shrine_bearer[0], GROW.shrine_bearer[1]);
}

// ------------------------------------------------------------------ THE MOUNTED OVERSEER (elite, 2.1 to the whip's tip)
// The overseer who rode the main galleries on a pit pony, counting heads. A stocky man on a small, shaggy, blind pit
// pony: the pony braced with its head low and its forelegs planted ahead, its weight in the forequarters, its belly
// bloated with gas so that it rides low and the girth sinks deep; the overseer leaning forward in the saddle, the reins
// and the tally board in his near hand, the whip arm (the far arm, behind his head) raised with the long leather whip
// cocked back over him. Fire has charred and split his face and forearms; a gas blister the size of a fist swells the
// near side of his neck and his beard is crusted yellow. The pony's coat is singed away in patches over cracked,
// glowing skin; its nostrils are ringed yellow. A leather jerkin over a wool coat over a linen shirt; a felt hat with
// its brim burned through on one side; a tally board on a cord, its pegs half pushed in; the powder-store keys; a short
// cudgel and a pick on the saddle; a lantern on the saddle bow; scorched saddle bags; boots with iron spurs; a bandage
// on the whip hand. The pony's bridle has blinkers and a bronze plate on the brow.
// Rig: pony (spine_1 root, spine_2, neck, head, tail, leg_{fn,ff,hn,hf}_1..3) + rider (pelvis parent spine_2, standard
// humanoid) + whip_1..3 (parent hand_f) + lantern (parent spine_2). Motion: idle the pony stamping (a foreleg) while the
// overseer taps the tally board; attack a lash of the whip (far arm and whip bones) with the pony barging after it.
function mountedOverseer() {
  const seed = 422, h = TIERS.elite[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1100 }));
  W.textures(f);
  const gy = f.o.groundY, u = 372;
  const coat = '#5a4632', coatD = '#1e140c', coatL = '#8a7050';
  const pony = X.horse(f, {
    u, O: [560, gy], len: 0.92, tilt: 0.07, coat, coatD, coatL, bloat: 0.9, draught: 2.2, legW: 1.3, Lh: 0.42, hA: 1.25, poll: [0.7, -1.02], hoof: '#2e2620', feather: '#3a2c1e',
    legs: {
      fn: [[0.26, -0.52], [0.36, -0.28], [0.4, -0.18], [0.44, -0.085], [0.5, -0.045]],
      ff: [[0.2, -0.52], [0.28, -0.27], [0.31, -0.17], [0.34, -0.085], [0.4, -0.045]],
      hn: [[-0.55, -0.6], [-0.7, -0.31], [-0.66, -0.19], [-0.62, -0.085], [-0.57, -0.045]],
      hf: [[-0.5, -0.6], [-0.62, -0.32], [-0.56, -0.19], [-0.5, -0.085], [-0.45, -0.045]],
    },
  });
  pony.joints(null);
  const Bp = pony.Bp;
  // the rider, astride just behind the withers
  const H = 100, Pv = Bp(-0.02, -1.06), N = add(Pv, [96, -210]), C = add(Pv, [10, -120]);
  const S = B.spine(N, C, Pv, H);
  const neck0 = S.at(0.12, -0.02), HC = add(N, [44, -58]), hA = 0.3;
  const SN = S.at(-0.05, 0.14), EN = add(SN, [70, 96]), WN = add(SN, [150, 86]);
  const SF = S.at(0.35, 0.08), EF = add(SF, [-58, -104]), WF = add(SF, [-82, -206]);
  const HN = add(Pv, [10, 10]), KN = add(Pv, [96, 92]), AN = add(Pv, [70, 206]);
  const HF = add(Pv, [26, 4]), KF = add(Pv, [110, 80]), AF = add(Pv, [86, 196]);
  f.joint('pelvis', Pv, 'spine_2').joint('torso', S.at(0, 0.86), 'pelvis').joint('head', neck0, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  const wd = E.norm([-1, -0.35]), w0 = add(WF, mul(wd, -30)), w1 = add(WF, mul(wd, 140)); // the whip's stock, cocked back
  const LASH = W.spline([w1, add(w1, [-56, -80]), add(w1, [-84, -230]), add(w1, [-40, -400]), add(w1, [60, -516]), add(w1, [176, -520]), add(w1, [250, -460])], 5); // its top at 2.1 (bible)
  const lS = W.arcLen(LASH), lL = lS[lS.length - 1], lAt = t => W.at(LASH, lS, t * lL).p;
  f.joint('whip_1', WF, 'hand_f').joint('whip_2', lAt(0.33), 'whip_1').joint('whip_3', lAt(0.66), 'whip_2');
  f.joint('lantern', Bp(0.2, -1.08), 'spine_2').joint('tally', add(S.at(0.4, 0.4), [0, 0]), 'torso');

  const skin = mix(P.skin, '#b89070', 0.1), charS = mix(P.char, skin, 0.3), SKN = (o = {}) => W.SK(f, Object.assign({ fill: skin, maxShade: 18 }, o));
  const wool = '#5a4e3c', jerk = P.leath;

  // ---- the whip: behind the rider; the lash cocked back over him in a long curve, thinning to a frayed cracker
  const lashSeg = (t0, t1) => { const pts = []; for (let i = 0; i <= 12; i++) pts.push(lAt(t0 + (t1 - t0) * i / 12)); const ws = pts.map((_, i) => 9 - 7.4 * (t0 + (t1 - t0) * i / 12)); f.part(K.chain(pts, ws, { steps: 1 }), W.LEA(f, { fill: '#3a2a1a', cast: false, inkW: 1.1, inkHeavy: 1.6 })); for (let i = 1; i < 12; i += 2) { const q = pts[i], d = E.norm(sub(pts[i + 1], q)), nn = [-d[1], d[0]], w2 = ws[i] * 0.5; f.line([add(q, mul(nn, w2)), add(add(q, mul(nn, -w2)), mul(d, 4))], 0.8, P.leathL, { op: 0.6 }); } };
  f.bone('whip_3'); lashSeg(0.66, 1.0);
  const tip = lAt(1.0); for (let i = 0; i < 5; i++) f.line([tip, add(tip, rot([14, 0], 1.2 + i * 0.25))], 1, '#8a7450', { op: 0.8 }); // the frayed cracker
  f.bone('whip_2'); lashSeg(0.33, 0.67);
  f.bone('whip_1'); lashSeg(0.0, 0.34);
  f.part(limb(w0, w1, 18, 12, { steps: 8, capK: 0.6 }), W.LEA(f, { fill: '#4a3420' }));
  for (let i = 0; i < 8; i++) f.line([lp(w0, w1, 0.2 + i * 0.08, -8), lp(w0, w1, 0.24 + i * 0.08, 8)], 1.2, P.leathD); // plaited stock
  K.ring(f, add(w0, mul(wd, -6)), 6, 6, 2.4, P.leathD);

  // ---- far arm raised behind the head: coat sleeve, charred forearm, the bandaged fist on the whip stock
  W.armRig(f, SF, EF, WF, [56, 46, 36], SKN({ fill: mix(charS, P.soot, 0.2) }), '_f', { capTop: 0.6 });
  f.bone('upperarm_f'); f.part(K.chain([SF, lerp(SF, EF, 0.6), add(EF, [4, 4])], [70, 62, 62]), { fill: mix(wool, '#000', 0.25), shadow: '#1e1a14', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.bone('forearm_f'); f.part(X.rag(f, lp(EF, WF, -0.05, 0), lp(EF, WF, 0.3, 0), 60, 54, { depth: 8, teeth: 5 }), { fill: mix(wool, '#000', 0.25), shadow: '#1e1a14', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.seam(f, [lp(EF, WF, 0.4, -6), lp(EF, WF, 0.6, 0), lp(EF, WF, 0.8, -4)], 1.6);
  for (let i = 0; i < 4; i++) f.line([lp(EF, WF, 0.78 + i * 0.05, -18), lp(EF, WF, 0.8 + i * 0.05, 18)], 3, '#c8bca0', { op: 0.9 }); // the bandage round the wrist
  f.bone('hand_f');
  const gW = B.grip(f, WF, EF, Math.atan2(wd[1], wd[0]), 24, '#b0a48a', { shadow: '#5a5240', name: 'overseer whip' });
  f.line(gW.F([[-0.6, -0.4], [0.3, 0.5]]), 1.2, '#7a3a24', { op: 0.6 }); // blood seeping through the bandage

  // ---- the pony's far legs, the rider's far leg (behind the pony)
  pony.farLegs();
  f.bone('thigh_f'); f.part(K.chain([HF, KF], [70, 58]), { fill: '#3a3428', shadow: '#1a1712', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 });
  f.bone('shin_f'); f.part(K.chain([KF, AF], [56, 48]), { fill: '#241e18', shade: 0.4, tex: 'mottle' + seed, texOp: 0.4 });

  // ---- the pony's tail: shaggy, singed, carried low
  f.bone('tail');
  const tr = pony.tailRoot;
  f.part(W.lumpy(f, [tr, add(tr, [-30, 10]), add(tr, [-54, 80]), add(tr, [-62, 170]), [...add(tr, [-44, 230]), 1], add(tr, [-30, 196]), [...add(tr, [-20, 236]), 1], add(tr, [-10, 170]), add(tr, [0, 80]), add(tr, [10, 20])], 6), { fill: '#3a2c1e', shadow: '#120c06', shade: 0.42, tex: 'hatch' + seed, texOp: 0.4 });
  X.fur(f, [add(tr, [-30, 60]), add(tr, [-50, 140]), add(tr, [-40, 200])], [-0.2, 1], 30, 8, '#3a2c1e', { singe: 0.6 });
  W.flakes(f, add(tr, [-20, 40]), 14, 20, 3, 0.8);

  // ---- the pony's near legs go under the body's edge (the body's shoulder and haunch masses cover their tops)
  pony.nearLegs();
  // ---- the pony's body: shaggy, singed in patches over cracked glowing skin, the bloated belly riding low
  pony.drawBody(() => {
    // singed patches: bare charred skin, cracked and glowing
    for (const [q, rx, ry] of [[[-0.3, -0.8], 0.12, 0.07], [[0.22, -0.68], 0.08, 0.06], [[-0.62, -0.72], 0.08, 0.1]]) { const c0 = Bp(...q), pts = W.lumpy(f, ell(c0, rx * u, ry * u, 0.2, 12), 5); f.flat(pts, '#3a2a1e', { op: 0.85 }); f.line(pts.concat([pts[0]]), 1.4, '#5a4632', { op: 0.6 }); W.crackNet(f, c0, f.r() * 6, rx * u * 1.2, 1.8, { depth: 1 }); }
    // the bloated belly: tight, shiny, veined, sagging between the legs
    f.flat([Bp(-0.36, -0.58), Bp(-0.1, -0.52), Bp(0.12, -0.52), Bp(0.06, -0.42), Bp(-0.2, -0.38), Bp(-0.38, -0.46)], '#c8b088', { op: 0.18 });
    for (const [a0, a1] of [[[-0.3, -0.5], [-0.1, -0.46]], [[-0.05, -0.47], [0.1, -0.5]]]) f.line([Bp(...a0), Bp(...a1)], 1.4, '#2a1a14', { op: 0.6 });
    W.blisters(f, Bp(-0.15, -0.46), 30, 10, 5, 4, 7);
  });
  // shaggy coat: clumped locks under the belly, the neck and the barrel
  X.fur(f, [Bp(-0.42, -0.6), Bp(-0.2, -0.46), Bp(0.06, -0.46), Bp(0.2, -0.52)], [0.15, 1], 0.032 * u, 22, mix(coat, '#000', 0.3), { singe: 0.2, w: 0.04 * u, curl: 0.8, blunt: true });
  f.bone('spine_2');
  f.bone('neck'); X.fur(f, [pony.NB, lerp(pony.NB, pony.TL, 0.5), pony.TL], [0.2, 1], 0.05 * u, 9, mix(coat, '#000', 0.1), { singe: 0.3, blunt: true, w: 0.045 * u });
  W.crust(f, lerp(pony.NB, pony.TL, 0.4), 14, 8, 3, 3, 6, { spikes: 0.3 });
  // the mane: thick and shaggy, a heavy mat along the crest falling over the near side of the neck in clumps, singed short
  // in places
  { const cr = [lerp(pony.W0, pony.PL, 0.02), lerp(pony.W0, pony.PL, 0.35), lerp(pony.W0, pony.PL, 0.7), lerp(pony.W0, pony.PL, 0.98)].map(q => add(q, [0, -8]));
    const nrm = E.norm(rot(sub(pony.PL, pony.W0), Math.PI / 2)), MS = W.spline(cr, 8), MN = [...MS.map(q => add(q, mul(nrm, -16))), ...MS.slice().reverse().map((q, i) => [...add(add(q, mul(nrm, 40 + ((i * 7) % 5) * 7)), [0, 10]), i % 3 === 0 ? 1 : 0])];
    f.part(MN, { fill: '#2e2216', shadow: '#0e0a06', light: '#5e4a32', shade: 0.42, tex: 'hatch' + seed, texOp: 0.35, maxShade: 18 });
    W.clipDraw(f, MN, () => { for (let i = 0; i < MS.length; i += 2) { const q = MS[i]; f.line([add(q, mul(nrm, -10)), add(add(q, mul(nrm, 20)), [3, 4]), add(add(q, mul(nrm, 46)), [0, 12])], 1.4, i % 4 ? '#0e0a06' : '#6a5438', { op: 0.6 }); } });
    X.fur(f, cr.slice(1).map(q => add(q, mul(nrm, 30))), q => add(nrm, [0, 0.9]), 0.07 * u, 12, '#2e2216', { singe: 0.4, w: 0.045 * u, curl: 0.6, blunt: true }); }

  // ---- saddle cloth, saddle, bags, the pick behind, the cudgel, the lantern on the bow
  f.bone('spine_2');
  const SC = [Bp(-0.3, -1.0), Bp(0.18, -1.0), Bp(0.22, -0.78), Bp(0.1, -0.68), Bp(-0.26, -0.7), Bp(-0.34, -0.82)];
  f.part(SC, { fill: P.och, shadow: P.ochD, light: P.ochL, shade: 0.42, tex: 'weave' + seed, texOp: 0.5 });
  W.clipDraw(f, SC, () => { f.flat([Bp(-0.34, -0.8), Bp(0.22, -0.82), Bp(0.22, -0.66), Bp(-0.34, -0.66)], P.char, { op: 0.6 }); for (let i = 0; i < 5; i++) f.line([Bp(-0.28 + i * 0.1, -0.96), Bp(-0.27 + i * 0.1, -0.72)], 1, P.ochD, { op: 0.6 }); });
  for (const q of [Bp(-0.2, -0.7), Bp(0.06, -0.69)]) W.seam(f, [add(q, [-10, -6]), q, add(q, [10, -8])], 1.4, { glowOp: 0.25 });
  // girth strap sunk deep in the bloated belly
  f.part([Bp(0.02, -0.98), Bp(0.1, -0.98), Bp(0.14, -0.46), Bp(0.05, -0.44)], W.LEA(f, { fill: P.leathD, cast: false }));
  f.stroke([Bp(-0.02, -0.5), Bp(0.09, -0.47), Bp(0.18, -0.52)], 4, '#120c06', { op: 0.5 });
  // saddle bags behind, scorched
  const sb = Bp(-0.36, -0.86);
  f.part([add(sb, [-50, -30]), add(sb, [40, -34]), add(sb, [46, 50]), add(sb, [-46, 56])], W.LEA(f, { fill: P.leath }));
  f.part([add(sb, [-52, -34]), add(sb, [42, -38]), add(sb, [40, 0]), add(sb, [-50, 4])], W.LEA(f, { fill: P.leathD }));
  f.flat(ell(add(sb, [10, 30]), 22, 14, 0.3, 10), P.char, { op: 0.8 }); f.part([add(sb, [-6, -4]), add(sb, [6, -4]), add(sb, [6, 14]), add(sb, [-6, 14])], { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  // the pick strapped behind the saddle, its head up
  const pk0 = Bp(-0.5, -0.92), pk1 = Bp(-0.18, -1.28);
  f.part(limb(pk0, pk1, 12, 12, { steps: 6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed });
  const PK = frame(pk1, ang(pk0, pk1), 1);
  f.part(K.chain(PK([[2, -6], [-6, -40], [-20, -66]]), [18, 12, 3]), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false });
  f.part(K.chain(PK([[2, 6], [-6, 40], [-18, 62]]), [18, 12, 4]), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.2, cast: false });
  W.rope(f, [add(lerp(pk0, pk1, 0.35), [-14, -6]), add(lerp(pk0, pk1, 0.35), [12, 8])], 3, { col: '#6a5a40' });
  // the saddle: a padded pit saddle with a raised bow and cantle
  const SD = [Bp(-0.2, -1.04), Bp(-0.16, -1.12), Bp(-0.08, -1.06), Bp(0.08, -1.06), Bp(0.16, -1.14), Bp(0.22, -1.08), Bp(0.2, -0.98), Bp(-0.2, -0.96)];
  f.part(SD, W.LEA(f, { fill: '#4a3420' }));
  f.line([Bp(-0.18, -1.0), Bp(0.18, -1.02)], 1, P.leathL, { op: 0.6, dash: '3 3' });
  // the cudgel hung from the saddle by a thong
  const cg = Bp(-0.14, -0.96);
  f.line([cg, add(cg, [-4, 22])], 2, P.leathD);
  f.part(limb(add(cg, [-4, 20]), add(cg, [-16, 150]), 14, 26, { steps: 8 }), { fill: P.woodL, shadow: P.woodD, shade: 0.42, tex: 'wood' + seed, texOp: 0.5 });
  for (let i = 0; i < 4; i++) f.rivet(add(cg, [-12 + (i % 2) * 6, 110 + i * 10]), 2.2, P.iron);
  // the stirrup leather and iron for the near foot (the foot is drawn with the leg)
  f.line([Bp(0.0, -1.0), add(AN, [0, -6])], 5, P.leathD);
  f.bone('lantern');
  const lt = Bp(0.2, -1.12);
  f.line([lt, add(lt, [0, 16])], 2, P.iron);
  const LF = frame(add(lt, [0, 18]), 0, 1);
  f.part(LF([[-14, 0], [14, 0], [16, 8], [16, 44], [-16, 44], [-16, 8]]), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false });
  f.flat(LF([[-11, 10], [11, 10], [11, 40], [-11, 40]]), '#e8b860', { op: 0.85 }); // horn panes glowing
  for (const x of [-6, 6]) f.line(LF([[x, 10], [x, 40]]), 1.6, P.iron);
  X.wickFlame(f, LF([[0, 34]])[0], 14, { glowOp: 0.35, soot: false });
  f.part(LF([[-16, 44], [16, 44], [12, 50], [-12, 50]]), { fill: P.iron, shade: 0.4, inkW: 1, cast: false });
  W.smoke(f, LF([[0, -4]])[0], 60, 10, { col: '#3a3028', op: 0.35 });

  // ---- the rider's torso: linen shirt, wool coat, leather jerkin; the tally board on its cord, the keys
  f.bone('torso');
  const TOR = S.shape([[-0.06, 0.44, 0.38], [0.12, 0.7, 0.58], [0.35, 0.72, 0.66], [0.6, 0.66, 0.66], [0.85, 0.62, 0.64], [1.0, 0.64, 0.64]]);
  f.part(TOR, { fill: wool, shadow: '#26221a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  const CT = [S.at(-0.66, 0.7), S.at(0.6, 0.7), add(S.at(0.66, 1.0), [8, 40]), [...add(S.at(0.3, 1.0), [0, 62]), 1], add(S.at(-0.2, 1.0), [-8, 56]), [...add(S.at(-0.7, 1.0), [-20, 70]), 1], add(S.at(-0.74, 0.9), [-10, 20])];
  f.part(CT, { fill: wool, shadow: '#26221a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }); // the coat's skirts over the saddle
  for (const q of [add(S.at(0.3, 1.0), [0, 62]), add(S.at(-0.7, 1.0), [-20, 70])]) W.seam(f, [add(q, [-8, -8]), q, add(q, [8, -10])], 1.2, { glowOp: 0.2 });
  const JK = S.shape([[0.02, 0.46, 0.3], [0.12, 0.66, 0.5], [0.35, 0.7, 0.58], [0.6, 0.64, 0.6], [0.85, 0.6, 0.62], [1.0, 0.62, 0.62]]);
  f.part(JK, W.LEA(f, { fill: jerk, maxShade: 30 }));
  W.clipDraw(f, JK, () => { f.raw(`<path d="${E.smooth(JK)}" fill="url(#soot${seed})" opacity="0.6"/>`); f.stroke([S.at(-0.4, 0.15), S.at(-0.5, 0.5), S.at(-0.44, 0.85)], 4, P.leathD, { op: 0.7 }); f.flat(ell(S.at(-0.2, 0.5), 20, 30, 0.2, 10), P.char, { op: 0.6 }); });
  f.line([S.at(0.48, 0.1), S.at(0.5, 0.88)], 1.4, INK, { op: 0.6 }); for (let i = 0; i < 5; i++) f.rivet(S.at(0.52, 0.18 + i * 0.15), 2.6, P.iron);
  f.part([S.at(0.14, -0.04), S.at(0.5, -0.06), S.at(0.56, 0.08), S.at(0.2, 0.1)], { fill: '#a8a08c', shadow: '#5a564a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }); // the linen shirt collar
  const bt = [S.at(-0.6, 0.78), S.at(0.62, 0.76), S.at(0.62, 0.86), S.at(-0.6, 0.88)];
  f.part(bt, W.LEA(f, { fill: P.leathD, k: 0.5 }));
  const kr = S.at(-0.3, 0.88); K.ring(f, add(kr, [0, 14]), 11, 11, 2.8, P.iron); // the powder-store keys
  for (const [dx, l] of [[-6, 40], [2, 50], [10, 34], [-12, 30]]) { const k0 = add(kr, [dx, 22]), k1 = add(k0, [dx * 0.3, l]); f.line([k0, k1], 4.6, INK); f.line([k0, k1], 2.6, P.ironL); f.line([k1, add(k1, [6, 0]), add(k1, [6, -6])], 2.2, P.ironL); }

  // ---- the rider's near leg with its spur in the stirrup
  f.bone('thigh_n');
  f.part(K.chain([HN, KN], [80, 64], { bq: [[0, 0.4, 0.14]] }), { fill: '#4a4232', shadow: '#1e1a14', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 });
  f.stroke([lp(HN, KN, 0.3, 20), lp(HN, KN, 0.6, 6), lp(HN, KN, 0.9, -20)], 2.4, '#1e1a14');
  W.bootRig(f, KN, AN, 62, '#2e261e', '_n', { tex: 'mottle' + seed, knee: lp(KN, AN, 0.04, 0), kneeW: 66, toe: 1.12, groundY: AN[1] + 44 });
  f.bone('foot_n');
  const st = add(AN, [8, 26]); f.line([add(st, [-26, -6]), add(st, [-24, 18]), add(st, [24, 18]), add(st, [26, -6])], 5, INK); f.line([add(st, [-26, -6]), add(st, [-24, 18]), add(st, [24, 18]), add(st, [26, -6])], 3, P.ironL); // stirrup iron
  const sp = add(AN, [-30, 14]); f.line([sp, add(sp, [-22, 2])], 3, P.ironL); f.part(ell(add(sp, [-26, 2]), 7, 7, 0, 8), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false }); for (let i = 0; i < 6; i++) f.line([add(sp, [-26, 2]), add(add(sp, [-26, 2]), rot([10, 0], i))], 1.2, P.iron); // the iron spur and its rowel

  // ---- the pony's head: low, blind, the bridle with blinkers and a bronze brow plate, the nostrils ringed yellow
  pony.drawHead({
    earBack: 0.75, earL: 0.17, earW: 1.3,
    after: (HF2, eC) => {
      const T = HF2;
      // headstall, browband with its bronze plate, noseband, cheekpiece, the blinker over the milk eye, the bit ring
      f.line(T([[0.04, -0.04], [0.08, 0.36]]), 6, P.leathD); f.line(T([[0.04, -0.04], [0.08, 0.36]]), 1, P.leathL, { op: 0.5, dash: '2 3' });
      f.line(T([[0.1, -0.08], [0.18, 0.0]]), 6, P.leathD);
      f.part(T(ell([0.14, -0.08], 0.05, 0.06, 0, 10)), { fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.45, inkW: 1.1, cast: false, tex: 'mottle' + seed });
      f.flat(T(ell([0.15, -0.07], 0.02, 0.025, 0, 6)), '#4a6a52', { op: 0.6 });
      f.line(T([[0.2, 0.0], [0.62, 0.14], [0.8, 0.2]]), 6, P.leathD);
      f.line(T([[0.7, -0.06], [0.72, 0.24]]), 6, P.leathD); // noseband
      const BLK = T([[0.17, -0.06], [0.44, -0.09], [0.5, 0.06], [0.46, 0.16], [0.2, 0.15]]);
      f.part(BLK, W.LEA(f, { fill: '#5a4026', light: '#8a6a44', cast: true, castOp: 0.4 })); // the blinker: a big cupped leather flap over the milk eye
      f.line(T([[0.2, -0.03], [0.42, -0.06], [0.47, 0.06], [0.43, 0.13], [0.22, 0.12]]), 1.2, P.leathL, { dash: '3 3', op: 0.7 });
      f.flat(T([[0.32, -0.04], [0.46, -0.07], [0.49, 0.06]]), P.char, { op: 0.7 });
      K.ring(f, T([[0.84, 0.21]])[0], 8, 8, 2.6, P.ironL);
      // the yellow-ringed nostril, the yellow foam at the lips, the coat singed off the cheek
      f.flat(T(ell([0.92, 0.1], 0.06, 0.05, 0.3, 10)), P.sul, { op: 0.55 });
      W.crust(f, T([[0.95, 0.12]])[0], 8, 6, 3, 2.4, 4, { spikes: 0 });
      f.flat(T([[0.82, 0.2], [0.98, 0.22], [0.96, 0.3], [0.86, 0.28]]), '#d8c890', { op: 0.6 });
      W.drip(f, T([[0.9, 0.3]])[0], 0.6, '#d8c890');
      const ck = T([[0.32, 0.24]])[0]; f.part(W.lumpy(f, ell(ck, 18, 14, 0.4, 10), 4), { fill: '#2a1c14', shade: 0.4, inkW: 1, cast: false, tex: 'craze' + seed }); W.seam(f, [add(ck, [-12, -4]), add(ck, [0, 2]), add(ck, [10, -4])], 1.4);
      // a shaggy forelock burned short
      X.fur(f, T([[0.02, -0.06], [0.1, -0.09], [0.18, -0.08]]), E.norm(rot([1, 0.6], pony.hA)), 30, 7, '#2e2216', { singe: 0.5, blunt: true, w: 12 });
    },
  });
  // the reins: from the bit ring back to the rider's near hand
  f.bone('hand_n');
  const bitR = pony.HF([[0.84, 0.21]])[0];
  f.line([bitR, lerp(bitR, WN, 0.5).map((v, i) => v + (i ? 26 : 0)), WN], 3.4, INK); f.line([bitR, lerp(bitR, WN, 0.5).map((v, i) => v + (i ? 26 : 0)), WN], 2, P.leath);

  // ---- the rider's head: square, cracked, the broken nose, the singed beard crusted yellow, eyes narrowed; the burnt hat
  f.bone('head');
  f.part(limb(neck0, add(HC, [-16, 34]), 64, 56), SKN({ fill: mix(skin, charS, 0.4) }));
  const gb = lp(neck0, HC, 0.3, 16); // the gas blister, fist-sized, on the near side of the neck
  f.part(W.lumpy(f, ell(gb, 26, 22, 0.4, 14), 3), { fill: mix(P.sul, P.och, 0.3), shadow: mix(P.sulD, P.ochD, 0.5), shade: 0.45, inkW: 1.2, cast: false, tex: 'mottle' + seed, texOp: 0.4, gritOp: 0.25 });
  f.flat(ell(add(gb, [6, -8]), 8, 5, -0.4, 8), '#fff6d8', { op: 0.55 }); for (let i = 0; i < 3; i++) f.line([add(gb, [-14 + i * 8, 10]), add(gb, [-10 + i * 8, -12])], 1, '#5a3a20', { op: 0.5 });
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.24, chin: 0.06, nose: 1.1, hook: -0.3, mouth: 'grim', squint: 0.55, browDown: 0.12, browW: 0.06, age: true, eyeWhite: '#c8bc98', iris: '#1a120c', hairCol: '#2a2018', beard: 'short', beardCol: '#3a2e1e', faceShade: 0.8, faceHatch: false, jawShade: 0.55, scar: [[0.3, -0.04], [0.36, 0.04]] });
  f.line(hF([[0.33, -0.03], [0.37, 0.02], [0.34, 0.06]]), 1.4, INK, { op: 0.7 }); // the broken bridge
  W.seam(f, hF([[0.02, -0.2], [0.1, -0.1], [0.08, 0.04], [0.16, 0.12]]), 1.3); W.seam(f, hF([[0.1, -0.1], [0.2, -0.14]]), 0.9, { glow: false });
  W.flakes(f, hF([[0.0, 0.0]])[0], 8, 8, 3, 0.5);
  W.crust(f, hF([[0.2, 0.46]])[0], 14, 6, 6, 2.4, 4, { spikes: 0.2 }); // the beard crusted yellow
  for (let i = 0; i < 10; i++) f.flat(ell(hF([[0.0 + (i % 5) * 0.06, 0.34 + Math.floor(i / 5) * 0.1]])[0], 1.8, 1.8, 0, 5), P.char, { op: 0.8 });
  // the felt hat: a broad brim, burned through on the near side to a ragged, glowing hole
  const HAT = hF([[0.5, -0.28], [0.3, -0.36], [0.24, -0.66], [0.0, -0.74], [-0.3, -0.66], [-0.34, -0.38], [-0.58, -0.3], [-0.6, -0.24], [-0.2, -0.26], [0.2, -0.28], [0.52, -0.22]]);
  f.part(HAT, { fill: '#3a3226', shadow: '#16120c', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, maxShade: 16 });
  f.part(hF([[-0.32, -0.4], [0.24, -0.42], [0.25, -0.36], [-0.33, -0.34]]), { fill: '#2a241c', shade: 0.4, inkW: 1, cast: false }); // band
  const hole = hF([[-0.5, -0.3], [-0.42, -0.32], [-0.36, -0.28], [-0.44, -0.25]]); f.flat(hole, '#0a0604'); f.line(hole.concat([hole[0]]), 1.6, P.ember, { op: 0.8 });
  W.flakes(f, hF([[-0.48, -0.3]])[0], 10, 6, 3, 0.6);

  // ---- near arm: forward and down, the reins and the tally board in the fist
  f.bone('torso');
  W.armRig(f, SN, EN, WN, [58, 48, 38], SKN({ fill: mix(skin, charS, 0.45) }), '_n', { capTop: 0.6, bp: [[0, 0.4, 0.12]] });
  f.bone('upperarm_n'); f.part(K.chain([add(SN, [-2, -10]), lerp(SN, EN, 0.6), add(EN, [2, 4])], [72, 64, 62]), { fill: wool, shadow: '#26221a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.part(K.chain([add(SN, [-4, -14]), lerp(SN, EN, 0.4)], [80, 74]), W.LEA(f, { fill: jerk })); // the jerkin's shoulder (on the arm: it is sleeveless cloth, not armour)
  f.bone('forearm_n'); f.part(X.rag(f, lp(EN, WN, -0.05, 0), lp(EN, WN, 0.32, 0), 62, 56, { depth: 9, teeth: 5 }), { fill: wool, shadow: '#26221a', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  W.crackNet(f, lp(EN, WN, 0.45, 0), ang(EN, WN), 60, 1.8, { depth: 1 });
  f.bone('tally');
  // the tally board hanging on its cord from the fist: a narrow board, rows of holes, pegs half pushed in
  const tb0 = add(WN, [6, 20]);
  f.line([WN, tb0], 1.6, '#6a5a40');
  const TB = frame(tb0, 0.08, 1);
  f.part(TB([[-16, 0], [16, 0], [16, 120], [-16, 120]]).map(q => [...q, 1]), { fill: P.woodL, shadow: P.woodD, shade: 0.42, inkW: 1.2, cast: false, tex: 'wood' + seed, texOp: 0.5 });
  for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) { const q = TB([[-8 + c * 8, 14 + r * 13]])[0]; f.flat(ell(q, 2, 2, 0, 5), '#1a120a'); if ((r * 3 + c) % 4 === 1) f.line([q, add(q, [4, -6])], 2.4, P.wood); }
  f.flat(TB([[6, 80], [16, 90], [16, 120], [4, 120]]), P.char, { op: 0.7 });
  f.bone('hand_n');
  B.grip(f, WN, EN, ang(WN, pony.HF([[0.84, 0.21]])[0]), 24, charS, { tex: 'mottle' + seed, shadow: '#0e0a08', name: 'overseer reins' });

  f.bone('root');
  f.flat(ell([600, gy + 2], 330, 8, 0, 20), '#3a3020', { op: 0.5 });
  W.crust(f, [180, gy - 4], 40, 5, 4, 3, 6, { spikes: 0.2 });
  return X.grow(f, GROW.mounted_overseer[0], GROW.mounted_overseer[1]);
}

// ------------------------------------------------------------------ THE OWNER (ruler, 3.5)
// The mine-owner, husband of the Miasma Matriarch, who rode down the shaft in the winding cage to see the gas for
// himself and has swollen too fat to go back up. He hangs head-down through the shaft mouth in the gallery roof: hips
// and legs wedged up in the shaft out of frame, the bent bars of the broken winding cage round his waist and its chain
// running up into the dark; splintered timbers and props jammed round him. (Independent review rebuild, 2026-11-23.)
// Read order at sheet size: the inverted head hanging lowest, lit and clearly a man's face; the arms hanging to the
// floor on either side of it with open space between; the bare swollen gut at the top; the ochre waistcoat and its
// silver watch, the white ruff, the silver chain of office and the lamp catching light.
// Body: built like his wife's head after review, as skin stretched by pressure and dragged by weight. Upside down the
// weight runs toward the floor: the gut has slid down over the ribs and hangs there in a heavy lobe whose fold sags
// over the waistcoat; the fat of the chest sags toward the collar; a roll of back fat sags toward the shoulders. Every
// lobe is a pouch of skin with no ink of its own, a tapered crease at its low edge, the overhang's shadow under it and a
// lit lip. Fire dominates: the skin is charred black and split in glowing seams, the splits running along the stretch
// (round the gut like the stretch marks on her head), the net widest across the chest and back where the lamp oil
// soaked him; edges curl and flake, ash drifts up toward the hidden legs. Toxin: sulphur blooming in the creases,
// blisters along the arms. The arms: a heavy shoulder, the upper arm hanging, the elbow pushed out with its point and
// the crease inside it, a forearm thick under the elbow narrowing to the wrist; the coat sleeves have slid down and
// bunched at the wrists. The near hand lies on the floor, the fingers trailing, the nails black, the silver signet ring
// sunk in a finger; the far fist still clutches the brass-bound lamp by its bail, the lamp resting on the floor, lit.
// Dress: the waistcoat (ochre brocade) has slid down to the armpits, its fronts split open and two buttons sprung, the
// silver watch fallen out of its pocket and hanging on its chain; a strip of scorched shirt front; the wool coat, charred
// to rags, hanging in strips round his head with its fur collar; the ruff, pleated, scorched, a torn length hanging; the
// silver chain of office swinging forward off his neck ahead of his face; the belt with the scorched deed, the split
// purse dropping coins, the pocket ledger dangling on its chain off the gut, tally tokens spilling; the hat on the floor.
// Head: upside down and lowest of the body, drawn upright and mirrored with the key light mirrored, so it stays lit from
// the upper left. Gravity runs toward the crown: the cheeks sag over the eyes and squeeze them shut, the jowls drag
// toward the cheekbones, the fat under the chin drapes over the jaw, the brow skin bunches in rolls at the hairline;
// the beard singed to stubble, thin smouldering hair hanging plumb from the crown.
// Rig: hips (root, at the shaft mouth: the slow turn and sway) > torso > head, chain, coat, watch, upperarm_n/forearm_n/
// hand_n, upperarm_f/forearm_f/hand_f > lamp. The shaft, timbers and cage are on root. Motion: idle a slow sway on the
// wedged hips, ash drifting up; attack a two-handed grab from above (both arms swing forward and up), and on a heavy
// turn the lamp bone is released into the gas.
function theOwner() {
  const seed = 420, h = TIERS.ruler[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1300 }));
  W.textures(f);
  const gy = f.o.groundY, H = 350;
  const ch = '#2e2219', chD = '#0c0806', chL = '#6a5442'; // charred skin
  const CH = (o = {}) => Object.assign({ fill: ch, shadow: chD, light: chL, shade: 0.36, tex: 'craze' + seed, texOp: 0.6, maxShade: 60 }, o);
  const flesh = '#7a5a40', fleshL = '#b08a64'; // the face: burnt flesh, lighter than the char of the body so it reads first
  const wool = '#3e3428', woolD = '#1a1510', furC = '#3a2c20';
  const vest = '#86622c', vestD = '#3e2a10', vestL = '#b89258'; // the ochre brocade waistcoat
  const linen = '#b8ae94', linenD = '#5e5646';
  const silver = '#aeaea6', silverD = '#4a4a46', silverL = '#ecece4';
  const soft = (q, rx, ry, col, op, a = 0, big = true) => f.raw(`<ellipse cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" rx="${rx}" ry="${ry}" transform="rotate(${(a * D).toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)})" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${seed})"/>`);

  // skeleton (upside down): hips at the shaft mouth, the torso hanging, the head lowest, the arms to the floor
  const HIP = [772, 40], N = [846, 936], HC = [858, 1150], hA = 0.05;
  const SN = [690, 896], EN = [498, 1196], WN = [636, 1452];
  const SF = [1000, 868], EF = [1262, 1104], WF = [1262, 1352];
  f.joint('hips', HIP).joint('torso', [772, 200], 'hips').joint('head', N, 'torso').joint('chain', [1000, 930], 'torso').joint('coat', [720, 880], 'torso').joint('watch', [906, 682], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('lamp', WF, 'hand_f');

  // an arm hanging from the shoulder: one outline with a deltoid cap, the biceps and triceps masses, the elbow pushed out
  // (its point on the outside of the bend, a crease inside), the forearm thick under the elbow and narrowing to the
  // wrist; charred and split along its length, blisters; the coat sleeve slid down and bunched at the wrist
  const arm = (S0, E0, W0, sfx, far) => {
    const tone = far ? 0.3 : 0, sk = mix(ch, '#000', tone), look = CH({ fill: sk, maxShade: 46 });
    const de = W.elb(S0, E0, W0), dU = E.norm(sub(E0, S0)), dL = E.norm(sub(W0, E0));
    const cross = dU[0] * dL[1] - dU[1] * dL[0], out = cross > 0 ? 1 : -1; // which normal side is the outside of the bend
    const ws = [216, 150, 108];
    const bump = (s, t, a, sg) => [s, t, a, sg];
    const bp = out > 0 ? [bump(0, 0.62, 0.16, 0.16), bump(1, 0.0, 0.16, 0.06), bump(1, 0.25, 0.14, 0.14)] : [bump(0, 0.3, 0.18, 0.16), bump(1, 0.22, 0.2, 0.15)];
    const bq = out > 0 ? [bump(0, 0.3, 0.18, 0.16), bump(1, 0.22, 0.2, 0.15)] : [bump(0, 0.62, 0.16, 0.16), bump(1, 0.0, 0.16, 0.06), bump(1, 0.25, 0.14, 0.14)];
    W.armRig(f, S0, E0, W0, ws, look, sfx, { capTop: 0.75, muscle: false, bp, bq, after: () => {
      W.clipDraw(f, K.chain([S0, E0, W0], ws.map(v => v * 1.3), { steps: 10 }), () => {
        const o = (a, b, t, k) => lp(a, b, t, k * out);
        soft(o(S0, E0, 0.35, -40), 50, 120, chL, 0.35, Math.atan2(dU[1], dU[0]), false); // the lit front of the upper arm
        soft(o(S0, E0, 0.5, 60), 40, 130, '#000', 0.5, Math.atan2(dU[1], dU[0]), false); // core shadow on the back
        f.stroke([o(S0, E0, 0.08, -70), o(S0, E0, 0.25, -88), o(S0, E0, 0.42, -60)], 7, '#050302', { op: 0.6 }); // the deltoid's edge
        f.stroke([o(S0, E0, 0.5, 40), o(S0, E0, 0.75, 52), o(S0, E0, 0.95, 40)], 6, '#050302', { op: 0.55 }); // biceps / triceps groove
        const ep = add(E0, mul(de, -0.0)), op = o(S0, E0, 1.0, 64);
        f.part(ell(op, 34, 24, Math.atan2(de[1], de[0]), 12), CH({ fill: mix(sk, chL, 0.4), inkW: 1.6, inkHeavy: 2.4, cast: false, maxShade: 12 })); // the elbow point
        f.stroke([o(E0, W0, -0.06, -52), o(E0, W0, 0.04, -40), o(E0, W0, 0.1, -58)], 8, '#050302', { op: 0.85 }); // the crease inside the bend
        f.stroke([o(E0, W0, 0.1, -20), o(E0, W0, 0.4, -10), o(E0, W0, 0.7, -8)], 5, '#050302', { op: 0.5 }); // the forearm's muscle groove
        f.line([o(E0, W0, 0.12, 30), o(E0, W0, 0.42, 34), o(E0, W0, 0.6, 26)], 2.4, chL, { op: 0.6 }); // the ulna catching light
        soft(o(E0, W0, 0.2, -10), 46, 70, chL, 0.3, Math.atan2(dL[1], dL[0]), false);
        W.crackNet(f, o(S0, E0, 0.15, 0), Math.atan2(dU[1], dU[0]), 300, 4, { depth: 2, fork: 0.55 });
        W.seam(f, [o(E0, W0, 0.05, 10), o(E0, W0, 0.3, 24), o(E0, W0, 0.55, 8)], 3);
        W.blisters(f, o(S0, E0, 0.6, -30), 40, 50, 7, 7, 13);
        W.crust(f, o(E0, W0, -0.02, -40), 30, 10, 5, 4, 8, { spikes: 0.3 });
      });
    } });
    // the shirt sleeve torn off at the shoulder: a scorched linen frill round the deltoid
    f.bone('upperarm' + sfx);
    const SV = X.rag(f, lp(S0, E0, 0.04, 0), lp(S0, E0, 0.2, 0), ws[0] * 1.04, ws[0] * 1.03, { depth: 22, teeth: 7 });
    f.part(SV, { fill: mix(linen, '#2a2018', tone + 0.55), shadow: linenD, shade: 0.42, tex: 'weave' + seed, texOp: 0.5, maxShade: 30 });
    f.raw(`<path d="${E.smooth(SV)}" fill="url(#soot${seed})" opacity="0.7"/>`);
    for (const k of [-0.3, 0.05, 0.35]) f.stroke([lp(S0, E0, 0.02, k * ws[0]), lp(S0, E0, 0.16, k * ws[0] * 0.9)], 5, linenD, { op: 0.7 });
    W.seam(f, [lp(S0, E0, 0.18, -60), lp(S0, E0, 0.2, -10), lp(S0, E0, 0.18, 50)], 2.2, { glowOp: 0.25 });
    // the coat sleeve, slid down and bunched at the wrist in heavy rings, its burnt edge up the forearm
    f.bone('forearm' + sfx);
    const SL = X.rag(f, lp(E0, W0, 0.98, 0), lp(E0, W0, 0.6, 0), 150, 168, { depth: 26, teeth: 8 });
    f.part(SL, { fill: mix(wool, '#000', tone), shadow: woolD, light: '#5e5040', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, maxShade: 30 });
    W.clipDraw(f, SL, () => { for (const t of [0.7, 0.78, 0.86, 0.93]) f.stroke([lp(E0, W0, t, -84), lp(E0, W0, t + 0.03, 0), lp(E0, W0, t, 84)], 7, '#0a0806', { op: 0.7 }); for (const t of [0.74, 0.82, 0.9]) f.line([lp(E0, W0, t, -70), lp(E0, W0, t + 0.025, 0), lp(E0, W0, t, 70)], 2, '#6a5a48', { op: 0.6 }); }); // concertina folds
    W.seam(f, [lp(E0, W0, 0.62, -70), lp(E0, W0, 0.6, -20), lp(E0, W0, 0.63, 30), lp(E0, W0, 0.6, 70)], 2.2, { glowOp: 0.3 });
  };

  // ---------------- splintered props and timbers jammed round him in the shaft mouth (behind him)
  f.bone('root');
  const prop = (a0, b0, w) => { f.part(limb(a0, b0, w, w * 0.92, { steps: 8, capK: 0.4 }), { fill: '#6e5a40', shadow: '#2a1e12', light: '#8e7652', shade: 0.42, tex: 'wood' + seed, texOp: 0.7 }); const d = E.norm(sub(b0, a0)), nn = [-d[1], d[0]]; for (let i = 0; i < 4; i++) f.flat([add(b0, mul(nn, -w / 2 + i * w / 4)), add(add(b0, mul(nn, -w / 2 + (i + 0.4) * w / 4)), mul(d, 14 + (i * 23) % 40)), add(b0, mul(nn, -w / 2 + (i + 1) * w / 4))], '#4a3a26'); f.flat([add(b0, mul(nn, -w / 2)), lerp(add(b0, mul(nn, -w / 2)), add(a0, mul(nn, -w / 2)), 0.3), lerp(add(b0, mul(nn, w / 2)), add(a0, mul(nn, w / 2)), 0.3), add(b0, mul(nn, w / 2))], P.char, { op: 0.75 }); W.seam(f, [add(b0, mul(nn, -w * 0.3)), add(add(b0, mul(nn, 0)), mul(d, -20)), add(b0, mul(nn, w * 0.3))], 2, { glowOp: 0.3 }); };
  prop([380, -10], [560, 300], 62); prop([1200, -10], [1010, 330], 58); prop([1330, -10], [1250, 200], 44);

  // ---------------- the coat, charred to rags, hanging in strips round his head (behind everything)
  f.bone('coat');
  const strips = [[560, 830, 1150], [612, 860, 1290], [662, 880, 1210], [712, 896, 1320], [762, 900, 1240]];
  for (const [x, y0, y1] of strips) {
    const w = 64, S = [[x - w / 2, y0 - 60], [x + w / 2 + 6, y0 - 60], [x + w / 2 + 4, (y0 + y1) / 2], [x + w / 2 - 4, y1 - 30], [x + 10, y1 - 4, 1], [x + 2, y1 - 30], [x - 10, y1 + 8, 1], [x - w / 2 + 2, y1 - 40], [x - w / 2 - 4, (y0 + y1) / 2]];
    f.part(S, { fill: wool, shadow: woolD, light: '#5e5040', shade: 0.42, tex: 'weave' + seed, texOp: 0.55, maxShade: 26 });
    W.clipDraw(f, S, () => { f.stroke([[x - 6, y0], [x - 10, (y0 + y1) / 2], [x - 4, y1]], 8, '#0e0a08', { op: 0.6 }); f.line([[x + 14, y0], [x + 12, (y0 + y1) / 2], [x + 16, y1 - 30]], 1.8, '#6e5e4a', { op: 0.5 }); f.flat([[x - w, y1 - 90], [x + w, y1 - 100], [x + w, y1 + 20], [x - w, y1 + 20]], P.char, { op: 0.6 }); });
    W.seam(f, [[x - 18, y1 - 26], [x + 2, y1 - 14], [x + 20, y1 - 30]], 2, { glowOp: 0.3 }); // charred, glowing ends
  }
  f.part([[540, 760], [880, 800], [870, 900], [700, 920], [560, 880]], { fill: woolD, shade: 0.4, inkW: 0, inkHeavy: 0, cast: false });
  f.flat(ell([720, 1000], 30, 18, 0.2, 10), '#4a3a2a', { op: 0.5 }); // a darn
  W.ash(f, [660, 1250], 10, 140, 200, 1.4);

  // ---------------- the far arm (behind the body), the fist round the lamp's bail; the lamp resting on the floor
  arm(SF, EF, WF, '_f', true);
  f.bone('lamp');
  const LP = add(WF, [4, 40]), LF = frame(LP, 0, 1);
  const bar = [add(WF, [-72, 0]), add(WF, [72, 0])]; f.line(bar, 9, INK); f.line(bar, 6, P.brassD); f.line(bar.map(q => add(q, [0, -2])), 1.6, P.brassL, { op: 0.6 }); // the bail's grip bar, through the fist
  for (const b0 of bar) { const q = LF([[b0[0] > WF[0] ? 40 : -40, 36]])[0]; f.line([b0, q], 5, INK); f.line([b0, q], 3, P.brassD); }
  W.glow(f, LF([[0, 100]])[0], 150, 120, P.lampL, 0.4, true);
  f.part(LF([[-44, 50], [44, 50], [36, 34], [-36, 34]]), { fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.45, inkW: 1.4, cast: false, tex: 'mottle' + seed });
  f.part(LF([[-40, 50], [40, 50], [40, 150], [-40, 150]]).map(q => [...q, 1]), { fill: '#d8a050', shadow: '#8a5a20', shade: 0.3, inkW: 1.4, cast: false, hatch: false }); // horn panes, lit from inside
  W.clipDraw(f, LF([[-40, 50], [40, 50], [40, 150], [-40, 150]]), () => { f.flat(LF(ell([0, 112], 26, 34, 0, 12)), '#ffd88a', { op: 0.7 }); X.wickFlame(f, LF([[0, 130]])[0], 34, { glowOp: 0.4, soot: false }); f.flat(LF([[-40, 50], [-20, 50], [-24, 150], [-40, 150]]), P.char, { op: 0.6 }); });
  for (const x of [-40, 0, 40]) { f.line(LF([[x, 50], [x, 150]]), 7, INK); f.line(LF([[x, 50], [x, 150]]), 4.4, x ? P.brass : P.brassL); }
  for (const y of [50, 100, 150]) { f.line(LF([[-44, y], [44, y]]), 7, INK); f.line(LF([[-44, y], [44, y]]), 4.4, P.brass); }
  f.part(LF([[-48, 150], [48, 150], [42, 168], [-42, 168]]), { fill: P.brassD, shade: 0.4, inkW: 1.3, cast: false });
  for (const x of [-30, 0, 30]) f.rivet(LF([[x, 159]])[0], 2.6, P.brass);
  W.smoke(f, LF([[0, 30]])[0], 120, 22, { col: '#3a3028', op: 0.3, sway: 14 });
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, 0, 104, mix(ch, '#5a4030', 0.25), { tex: 'craze' + seed, texOp: 0.5, shadow: chD, name: 'owner lamp bail' });
  W.seam(f, gF.F([[-0.6, -0.3], [-0.2, -0.1], [0.2, -0.3]]), 2.4); W.blisters(f, gF.F([[-0.3, 0.3]])[0], 18, 12, 4, 6, 10);
  for (const y of [-0.45, -0.15, 0.15]) f.flat(ell(gF.F([[0.74, y]])[0], 6, 4, 0, 6), '#050302'); // black nails
  { const rg = gF.F([[0.5, -0.16]])[0]; f.part(ell(rg, 10, 15, 0, 10), { fill: '#8a8a82', shadow: silverD, light: silverL, shade: 0.45, inkW: 1.4, cast: false }); f.flat(ell(add(rg, [3, -5]), 3, 5, 0, 6), silverL, { op: 0.8 }); } // an iron mourning ring

  // ---------------- the torso: the gut, the chest and the back, hanging from the shaft
  f.bone('torso');
  const TOR = [[590, -30], [972, -30], [978, 110], [1046, 168], [1136, 238], [1200, 330], [1228, 432], [1214, 520], [1176, 568], [1124, 590],
    [1146, 640], [1166, 722], [1146, 800], [1096, 862], [1030, 900], [966, 920], [900, 936], [820, 946], [744, 950], [664, 950], [596, 930], [536, 884],
    [494, 812], [470, 716], [464, 600], [480, 470], [514, 340], [556, 222], [584, 110]];
  f.part(TOR, CH({ k: 0.95 }));
  const BELLY = [[978, 110], [1046, 168], [1136, 238], [1200, 330], [1228, 432], [1214, 520], [1176, 568], [1124, 592], [1040, 600], [950, 580], [856, 536], [776, 474], [730, 396], [742, 300], [800, 216], [880, 150]];
  const BCR = [[1214, 524], [1176, 570], [1110, 598], [1020, 598], [920, 566], [830, 512], [764, 446]];
  const CHEST = [[1124, 592], [1146, 640], [1166, 722], [1146, 800], [1096, 862], [1030, 900], [966, 920], [948, 872], [990, 800], [1030, 720], [1058, 650], [1080, 604]];
  const CCR = [[1146, 802], [1100, 862], [1034, 900], [968, 918]];
  const BACKR = [[480, 470], [464, 600], [470, 716], [494, 812], [536, 884], [600, 906], [610, 860], [576, 780], [548, 680], [530, 560], [520, 470]];
  const KCR = [[494, 812], [536, 880], [600, 904], [660, 900]];
  const WC = [[600, 640], [700, 642], [800, 628], [904, 640], [1004, 652], [1076, 660], [1066, 720], [1034, 790], [994, 856], [956, 908], [884, 936], [800, 944], [720, 936], [640, 912], [572, 862], [540, 780], [548, 700]];
  W.clipDraw(f, TOR, () => {
    // the mass turns: lit high on the gut and the chest toward the key light (upper right in build), a broad core
    // shadow down the back; the gas glows faintly through the thinnest char
    soft([1090, 330], 150, 130, chL, 0.55); soft([520, 520], 110, 280, '#000', 0.55); soft([860, 300], 200, 130, P.lamp, 0.1);
    const crease = (pts, w, op = 0.88, col = '#050302') => f.stroke(pts, w, col, { op });
    const lobe = (pts, cr, o2 = {}) => { f.part(pts, CH(Object.assign({ inkW: 0, inkHeavy: 0, cast: true, castOp: 0.55, maxShade: 34 }, o2))); crease(cr.map(q => add(q, o2.sh ?? [0, 16])), (o2.cw ?? 10) * 2.8, 0.5, '#000'); crease(cr, o2.cw ?? 10, 0.92); f.line(cr.slice(1, -1).map(q => add(q, o2.lit ?? [4, -10])), 3, chL, { op: 0.75 }); };
    crease(KCR.map(q => add(q, [8, 14])), 26, 0.5, '#000'); crease(KCR, 10, 0.92); f.line(KCR.slice(1, -1).map(q => add(q, [-4, -10])), 3, chL, { op: 0.7 }); // the back roll's fold
    // the gut: a pouch of skin slid down over the ribs, its fold sagging over the waistcoat
    crease(BCR.map(q => add(q, [0, 16])), 34, 0.5, '#000'); crease(BCR, 12, 0.92); f.line(BCR.slice(1, -1).map(q => add(q, [4, -10])), 3, chL, { op: 0.75 }); // the gut's fold: crease, overhang shadow, lit lip
    W.clipDraw(f, BELLY, () => {
      soft([1120, 330], 90, 70, '#8a6a50', 0.45); soft([900, 470], 160, 70, '#000', 0.35);
      // a second, smaller roll where the belt cuts in, sagging over it
      crease([[600, 226], [700, 238], [800, 240], [900, 232], [990, 214]], 9, 0.85); crease([[600, 242], [700, 256], [800, 258], [900, 250], [990, 232]], 20, 0.35, '#000'); f.line([[700, 228], [800, 230], [900, 222]], 2.6, chL, { op: 0.7 });
      // the navel, dragged down into the fold
      f.stroke([[1086, 470], [1094, 494], [1088, 518]], 12, '#000'); f.line([[1076, 464], [1082, 492]], 2, chL, { op: 0.6 }); W.glow(f, [1090, 496], 16, 22, P.lamp, 0.45);
      // the splits run round the gut along the stretch, like the stretch marks round her head: long arcs on the flank,
      // a rake of short ones round the navel; the char between curls and flakes
      for (let i = 0; i < 8; i++) { const r0 = 120 + i * 30, pts = []; for (let k = 0; k <= 9; k++) { const a = -2.6 + k * 0.32 + (i % 3) * 0.1; pts.push(add([1010, 430], [Math.cos(a) * r0 * 1.15 + (f.r() - 0.5) * 12, Math.sin(a) * r0 * 0.85 + (f.r() - 0.5) * 12])); } const k0 = i % 3, k1 = 5 + (i * 3) % 5; W.seam(f, pts.slice(k0, k1), 2 + (i % 3) * 0.7, { glowOp: 0.3 }); if (i % 2) W.hairline(f, pts.slice(k1 - 1, k1 + 2), 1.4); }
      W.crackNet(f, [1150, 300], 2.0, 150, 3.4, { depth: 2, fork: 0.6 }); W.crackNet(f, [860, 300], 0.6, 160, 3.2, { depth: 2, fork: 0.6 });
      for (let i = 0; i < 10; i++) { const q = W.scatter(f, [980, 360], 200, 160); soft(q, W.R(f, 20, 50), W.R(f, 12, 26), f.r() > 0.5 ? '#5a4434' : '#000', 0.3, f.r() * 3, false); } // mottled char
      for (let i = 0; i < 6; i++) { const a = -0.6 + i * 0.32, q0 = add([1090, 494], rot([46, 0], a)), q1 = add([1090, 494], rot([96 + (i % 2) * 30, 0], a + 0.08)); W.seam(f, [q0, lerp(q0, q1, 0.5), q1], 2, { glowOp: 0.25 }); }
      for (const pts of [[[1110, 250], [1170, 300], [1204, 390], [1180, 360], [1130, 290]], [[1020, 190], [1080, 216], [1060, 220]]]) f.flat(pts, '#9a8068', { op: 0.5 }); // the tight sheen of the stretched char
      for (let i = 0; i < 18; i++) { const r0 = 330 + (i % 5) * 22, a0 = 2.0 + i * 0.05, arc = []; for (let k = 0; k < 6; k++) arc.push(add([960, 400], rot([r0 + k * 4, 0], a0 + k * 0.06))); f.line(arc, 1.6, INK, { op: 0.32 }); } // wrapping hatch on the turning side
      W.crust(f, [940, 560], 90, 12, 12, 5, 11, { spikes: 0.35 }); // sulphur blooming in the fold
      W.blisters(f, [1170, 470], 30, 30, 5, 7, 12);
    });
    // the back: the crack net widest here, where the lamp oil soaked him
    W.crackNet(f, [540, 420], 1.5, 250, 5.4, { depth: 3, fork: 0.65 }); W.crackNet(f, [600, 250], 1.9, 180, 4, { depth: 2 });
    W.crust(f, [560, 860], 40, 14, 7, 5, 9, { spikes: 0.3 });
    // the waistcoat: slid down to the armpits under the gut, its front split open, the brocade scorched
    f.part(WC.map((q, i) => i < 6 ? [...add(q, [0, (i % 2) * 14]), 1] : q), { fill: vest, shadow: vestD, light: vestL, shade: 0.4, tex: 'weave' + seed, texOp: 0.4, maxShade: 50, castOp: 0.5 });
    W.clipDraw(f, WC, () => {
      for (let y = 620; y < 950; y += 18) for (let x = 520 + ((y / 18) % 2) * 9; x < 1090; x += 18) f.flat([[x, y - 4], [x + 3, y], [x, y + 4], [x - 3, y]], vestD, { op: 0.28 }); // the brocade lozenges
      soft([980, 700], 70, 120, vestL, 0.35); soft([620, 760], 90, 160, '#000', 0.5);
      for (const [y, x0, x1] of [[700, 560, 1060], [760, 556, 1040], [826, 570, 1000]]) { const pts = [[x0, y + 10], [(x0 + x1) / 2, y - 16], [x1, y + 6]]; f.stroke(pts, 12, vestD, { op: 0.65 }); f.line(pts.map(q => add(q, [0, -9])), 2.2, vestL, { op: 0.5 }); } // rolls bunched where it slid to the armpits
      for (const pts of [[[700, 650], [690, 760], [680, 900]], [[900, 660], [892, 780], [870, 930]]]) f.stroke(pts, 7, vestD, { op: 0.45 });
      f.stroke(BCR.map(q => add(q, [0, 30])), 40, '#000', { op: 0.45 }); // the gut's shadow falling on it
      f.flat(ell([640, 740], 60, 44, 0.4, 12), P.char, { op: 0.8 }); W.seam(f, [[600, 760], [640, 720], [690, 740]], 2.4, { glowOp: 0.3 }); // a burn hole
      f.flat(ell([820, 860], 50, 30, 0.2, 12), P.char, { op: 0.7 });
    });
    // the waistcoat's front edge: a strip of scorched shirt between it and the bare chest, the buttons, two sprung
    const FE = [[1076, 660], [1066, 720], [1034, 790], [994, 856], [956, 908]];
    const SH = [[1076, 600], [1112, 640], [1100, 720], [1066, 800], [1022, 868], [978, 916], [956, 908], [994, 852], [1034, 782], [1066, 702], [1078, 640]];
    f.part(SH, { fill: linen, shadow: linenD, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, maxShade: 16, cast: false, inkW: 1.4 });
    W.clipDraw(f, SH, () => { f.raw(`<path d="${E.smooth(SH)}" fill="url(#soot${seed})" opacity="0.8"/>`); f.flat([[1090, 700], [1120, 700], [1100, 790], [1070, 790]], P.char, { op: 0.8 }); });
    lobe(CHEST.slice(0, 7).concat([[1060, 870], [1090, 790], [1110, 700]]), CCR, { sh: [-8, 16], fill: mix(ch, '#4a3020', 0.1), cw: 9 }); // the chest fat sagging to the collar
    f.line(FE, 7, INK); f.line(FE, 3, vestL, { op: 0.6 });
    FE.forEach((q, i) => { if (i === 1 || i === 3) { f.stroke([add(q, [-14, -4]), add(q, [-2, 2]), add(q, [-10, 6])], 4, '#0a0604'); f.line([q, add(q, [6, 20]), add(q, [2, 34])], 1.4, linen, { op: 0.8 }); } else { f.part(ell(add(q, [-14, 0]), 11, 11, 0, 10), { fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.45, inkW: 1.4, cast: false }); f.flat(ell(add(q, [-17, -4]), 3, 3, 0, 6), P.brassL); } });
    // the watch chain from a buttonhole sagging to the pocket; the silver watch fallen out, hanging plumb on its chain
    const pk = [906, 676];
    f.part([add(pk, [-40, -12]), add(pk, [40, -6]), add(pk, [40, 6]), add(pk, [-40, 0])], { fill: vestD, shade: 0.4, inkW: 1.4, cast: false }); // the pocket welt
    W.chainLinks(f, [add(FE[1], [-22, 0]), [990, 736], add(pk, [20, 4])], 12, silver);
  });
  f.bone('watch');
  { const pk = [906, 682], wc = [900, 830]; W.chainLinks(f, [pk, [904, 720], add(wc, [0, -38])], 12, silver);
    f.part(ell(add(wc, [0, -34]), 7, 9, 0, 8), { fill: silver, shadow: silverD, shade: 0.4, inkW: 1.4, cast: false }); // the bow
    f.part(ell(wc, 30, 32, 0, 20), { fill: silver, shadow: silverD, light: silverL, shade: 0.45, inkW: 2, cast: false, tex: 'mottle' + seed });
    f.part(ell(wc, 22, 24, 0, 18), { fill: '#d8d0b8', shadow: '#7a7464', shade: 0.35, inkW: 1.2, cast: false, hatch: false }); // the face
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; f.line([add(wc, rot([16, 0], a)), add(wc, rot([20, 0], a))], 1.2, INK); }
    f.line([wc, add(wc, [0, -14])], 2, INK); f.line([wc, add(wc, [10, 4])], 2, INK);
    f.line([add(wc, [-18, -8]), add(wc, [4, 6]), add(wc, [16, 2])], 1.2, '#3a3a36', { op: 0.8 }); // the cracked glass
    f.flat(ell(add(wc, [10, -12]), 7, 4, -0.5, 8), '#fff', { op: 0.7 });
    f.flat(ell(add(wc, [-10, 14]), 12, 8, 0.3, 10), P.char, { op: 0.55 }); }

  // the belt at the waist with the scorched deed; the split purse dropping coins; the ledger on its chain dangling off
  // the gut; tally tokens spilling from a pocket on the back
  f.bone('torso');
  f.part([[592, 150], [966, 150], [976, 200], [588, 200]], W.LEA(f, { fill: P.leathD, k: 0.5 }));
  f.line([[600, 174], [960, 174]], 1.4, P.leathL, { dash: '4 5', op: 0.5 });
  f.part([[820, 140], [870, 142], [868, 210], [818, 208]].map(q => [...q, 1]), { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: 1.6, cast: false });
  const dd = [700, 150];
  f.part([add(dd, [-40, -10]), add(dd, [40, -24]), add(dd, [48, 56]), add(dd, [-34, 70])], { fill: '#c8b890', shadow: '#6a5a3e', shade: 0.4, inkW: 1.4, cast: false, tex: 'growth' + seed, texOp: 0.3 });
  for (let i = 0; i < 5; i++) f.line([add(dd, [-28, 6 + i * 11]), add(dd, [34, -6 + i * 11])], 1, '#5a4a30', { op: 0.6 });
  f.flat([add(dd, [10, 40]), add(dd, [48, 30]), add(dd, [48, 56]), add(dd, [-10, 66])], P.char, { op: 0.85 }); W.seam(f, [add(dd, [-6, 60]), add(dd, [16, 46]), add(dd, [44, 40])], 1.6, { glowOp: 0.3 });
  f.part(ell(add(dd, [-10, 30]), 12, 10, 0, 10), { fill: '#5a3a2a', shade: 0.4, inkW: 1, cast: false });
  const pu = [1020, 250];
  f.line([[990, 190], add(pu, [-10, -30])], 3, P.leathD); f.line([[996, 196], add(pu, [10, -30])], 3, P.leathD);
  f.part([add(pu, [-30, -30]), add(pu, [30, -30]), add(pu, [40, 20]), add(pu, [20, 50]), add(pu, [-24, 50]), add(pu, [-40, 14])], W.LEA(f, { fill: '#5a3e28' }));
  f.flat([add(pu, [-6, 30]), add(pu, [14, 28]), add(pu, [10, 52]), add(pu, [-4, 50])], '#0a0604');
  const coin = (q, a) => f.part(ell(q, 10, 5 + Math.abs(Math.sin(a)) * 5, a, 10), { fill: silver, shadow: silverD, light: silverL, shade: 0.4, inkW: 1.1, cast: false, hatch: false });
  [[1030, 312, 0.3], [1048, 350, 1.1], [1070, 380, 0.5], [1100, 400, 1.4], [1238, 640, 0.6], [1244, 760, 1.2], [1236, 900, 0.2], [1250, 1060, 0.9]].forEach(([x, y, a]) => coin([x, y], a)); // coins rolling off the gut and falling
  W.chainLinks(f, [[1000, 196], [1120, 250], [1206, 340], [1236, 440], [1238, 520]], 14, silver);
  const lg = [1238, 530]; // the pocket ledger, dangling plumb off the gut on its chain
  f.part([add(lg, [-26, 0]), add(lg, [26, 0]), add(lg, [28, 84]), add(lg, [-24, 86])], W.LEA(f, { fill: '#3a2618' }));
  f.flat([add(lg, [-22, 6]), add(lg, [-15, 6]), add(lg, [-12, 82]), add(lg, [-19, 82])], '#c8b890', { op: 0.9 }); f.flat([add(lg, [6, 50]), add(lg, [28, 50]), add(lg, [28, 84]), add(lg, [10, 84])], P.char, { op: 0.8 });
  for (let i = 0; i < 7; i++) { const q = [496 - i * 6 + Math.sin(i) * 12, 300 + i * i * 14 + i * 40]; f.part(ell(q, 9, 10, 0, 10), { fill: P.brass, shadow: P.brassD, shade: 0.4, inkW: 1, cast: false }); f.line([add(q, [-3, -4]), add(q, [-3, 4])], 1, INK, { op: 0.6 }); }
  W.flakes(f, [1100, 360], 80, 120, 10, 1.6); W.flakes(f, [560, 420], 70, 140, 10, 1.6);
  for (const q of [[1060, 300], [560, 560], [1120, 700]]) W.ash(f, q, 10, 80, 360, 1.6);

  // ---------------- the fur collar, round the neck behind the head, charred in clumps
  f.bone('coat');
  X.fur(f, [[600, 900], [680, 930], [760, 946]], [0, 1], 80, 12, furC, { singe: 0.6, w: 36, blunt: true, curl: 0.8, inkW: 1.4, inkH: 2.4 });
  // ---------------- the thick neck, from the shoulders down into the jaw (behind the ruff)
  f.bone('head');
  f.part(limb(N, [860, 1020], 250, 236, { steps: 6 }), CH({ fill: mix(ch, flesh, 0.35), maxShade: 30 }));

  // ---------------- the ruff round the neck: a ring of pleats, scorched, a torn length hanging plumb
  f.bone('torso');
  const RF = [858, 946], ruff = []; for (let i = 0; i < 72; i++) { const a = Math.PI * 2 * i / 72, r = 1 + 0.07 * Math.sin(a * 18); ruff.push(add(RF, rot([Math.cos(a) * 190 * r, Math.sin(a) * 52 * r], 0.03))); }
  f.part(ruff, { fill: '#cec6ac', shadow: '#5e5846', light: '#f0ead6', shade: 0.42, tex: 'weave' + seed, texOp: 0.35, inkW: 1.8, maxShade: 26 });
  W.clipDraw(f, ruff, () => {
    f.flat(ell(add(RF, [0, -14]), 150, 30, 0.03, 24), '#2a241a', { op: 0.55 }); // the far half, in shadow inside the ring
    for (let i = 0; i < 36; i++) { const a = Math.PI * 2 * i / 36, q = add(RF, rot([Math.cos(a) * 196, Math.sin(a) * 54], 0.03)); f.stroke([lerp(RF, q, 0.5), q], 4, '#4a4438', { op: 0.7 }); } // the pleats
    f.flat([[640, 900], [780, 900], [760, 1010], [640, 1010]], P.char, { op: 0.75 }); W.seam(f, [[660, 970], [720, 990], [770, 960]], 2.4, { glowOp: 0.3 });
    f.flat([[990, 920], [1060, 920], [1060, 990], [990, 990]], P.char, { op: 0.5 });
  });
  const RT = [[690, 980], [736, 984], [744, 1060], [730, 1110, 1], [714, 1076], [698, 1124, 1], [684, 1060]]; // the torn length, hanging plumb
  f.part(RT, { fill: '#b8b098', shadow: '#5e5846', shade: 0.42, tex: 'weave' + seed, texOp: 0.4, inkW: 1.4, cast: false });
  for (const y of [1000, 1024, 1048, 1072]) f.line([[688, y], [714, y + 6], [738, y]], 1.6, '#4a4438', { op: 0.7 });
  f.flat([[688, 1070], [740, 1060], [730, 1110], [698, 1124]], P.char, { op: 0.7 });

  // ---------------- the head, upside down: drawn upright about HC and mirrored, with the key light mirrored too. In the
  // upright drawing gravity runs toward -y (the crown) and the light comes from +x, +y, so every sag below hangs toward
  // -y, its crease on its -y edge with the overhang's shadow beyond it. No pasted-on pouches: the sags are carried by
  // creases, soft shadow and lit lips on the one face shape, as on the Matriarch.
  f.bone('head');
  const i0 = f.out.length, L0 = f.L; f.L = [L0[0], -L0[1]];
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin: flesh, jaw: 1.45, chin: 0.06, nose: 1.14, hook: 0.15, mouth: 'set', squint: 1, browDown: 0.16, browW: 0.07, browCol: '#140c06', age: true, eyeWhite: '#4a3a2a', iris: '#1a120c', hairCol: '#2a2018', beard: 'stubble', beardCol: '#0a0604', faceShade: 0.78, faceHatch: false, jawShade: 0.55 });
  const crH = (pts, w, op = 0.85) => f.stroke(hF(pts), w, '#1a0e08', { op });
  const sag = (cr, w, sh = 0.035) => { W.clipDraw(f, hF([[-0.42, -0.6], [0.45, -0.6], [0.45, 0.62], [-0.42, 0.62]]), () => f.stroke(hF(cr.map(q => [q[0], q[1] - sh])), w * 3.4, '#1a0e08', { op: 0.32 })); crH(cr, w, 0.9); f.line(hF(cr.slice(1, -1).map(q => [q[0], q[1] + 0.018])), 2.4, fleshL, { op: 0.7 }); };
  W.clipDraw(f, hF([[-0.42, -0.6], [0.5, -0.6], [0.5, 0.7], [-0.42, 0.7]]), () => {
    soft(hF([[0.2, 0.08]])[0], 64, 40, fleshL, 0.5, 0, false); soft(hF([[0.24, 0.42]])[0], 50, 30, fleshL, 0.4, 0, false); soft(hF([[0.14, -0.3]])[0], 60, 26, fleshL, 0.35, 0, false); // lit cheek, chin, brow
    soft(hF([[-0.22, -0.1]])[0], 60, 110, '#1a0e08', 0.45, 0, false); // the side of the skull turning away
    soft(hF([[0.12, -0.08]])[0], 60, 18, '#1a0e08', 0.45, 0, false); // the eye sunk under the sagging cheek
  });
  // the brow skin slid toward the crown: thick rolls bunched at the hairline
  for (const [y, w] of [[-0.25, 6], [-0.32, 7], [-0.39, 6]]) sag([[0.0, y + 0.012], [0.1, y - 0.004], [0.2, y], [0.28, y + 0.02]], w, 0.025);
  // the cheek sagging over the eye and squeezing it shut
  sag([[0.02, -0.01], [0.12, -0.035], [0.24, -0.03], [0.31, 0.0]], 6);
  f.stroke(hF([[0.03, -0.062], [0.12, -0.07], [0.2, -0.06]]), 11, '#050302');
  f.stroke(hF([[0.27, -0.066], [0.31, -0.07], [0.345, -0.064]]), 7, '#050302');
  for (let i = 0; i < 6; i++) { const q = hF([[0.05 + i * 0.028, -0.068]])[0]; f.line([q, add(q, rot([0, -9], hA))], 1.6, '#050302', { op: 0.8 }); } // lashes crushed together
  for (let i = 0; i < 4; i++) f.line(hF([[0.03, -0.06], [-0.04, -0.1 + i * 0.03]]), 2, '#1a0e08', { op: 0.75 }); // crow's feet
  // heavy brows knotted down, the hairs singed into tufts
  for (let i = 0; i < 9; i++) { const q = hF([[0.02 + i * 0.025, -0.145 + Math.abs(i - 4) * 0.004]])[0]; f.line([q, add(q, rot([10, -6 + (i % 3) * 3], hA))], 3, '#140c06', { op: 0.85 }); }
  // the nostril and the deep fold from the nose's wing to the mouth's corner
  f.flat(hF(ell([0.335, 0.15], 0.03, 0.016, 0.2, 8)), '#0a0604');
  sag([[0.25, 0.1], [0.22, 0.18], [0.18, 0.25], [0.15, 0.31]], 5, 0.0);
  // the jowl dragged toward the cheekbone; the fat under the chin draping over the jawline
  sag([[-0.24, 0.2], [-0.1, 0.18], [0.04, 0.2], [0.12, 0.24]], 8);
  sag([[-0.16, 0.47], [0.02, 0.5], [0.18, 0.52], [0.3, 0.55]], 7);
  // the mouth slack: lips parted, a dark gap, the teeth
  f.flat(hF([[0.17, 0.255], [0.24, 0.244], [0.33, 0.256], [0.33, 0.272], [0.24, 0.268], [0.18, 0.275]]), mix(flesh, '#5a2a20', 0.4)); // upper lip
  f.flat(hF([[0.18, 0.275], [0.24, 0.268], [0.33, 0.272], [0.31, 0.3], [0.22, 0.306]]), '#120806');
  f.flat(hF([[0.2, 0.274], [0.28, 0.272], [0.27, 0.284], [0.21, 0.286]]), '#9a8a68', { op: 0.75 }); // teeth
  f.flat(hF([[0.2, 0.306], [0.3, 0.3], [0.31, 0.33], [0.22, 0.34]]), mix(flesh, '#5a2a20', 0.35)); // lower lip, heavy
  f.line(hF([[0.21, 0.325], [0.29, 0.318]]), 2, fleshL, { op: 0.7 });
  // charred patches and seams across the face, flakes; stubble singed and pocked; blisters under the jaw
  f.flat(hF([[-0.3, -0.36], [-0.1, -0.44], [0.06, -0.42], [0.0, -0.3], [-0.2, -0.24]]), P.char, { op: 0.6 });
  f.flat(hF([[-0.12, 0.06], [-0.02, 0.1], [-0.04, 0.2], [-0.16, 0.16]]), P.char, { op: 0.5 });
  W.seam(f, hF([[-0.08, -0.3], [0.04, -0.27], [0.16, -0.3], [0.26, -0.25]]), 3.2);
  W.seam(f, hF([[-0.2, 0.26], [-0.1, 0.31], [0.0, 0.3], [0.08, 0.38]]), 2.8);
  W.seam(f, hF([[-0.16, 0.38], [-0.04, 0.43], [0.06, 0.45]]), 2.2, { glowOp: 0.3 });
  W.flakes(f, hF([[-0.1, -0.36]])[0], 50, 30, 6, 1.2);
  for (let i = 0; i < 34; i++) { const q = hF([[-0.04 + (i % 11) * 0.03 + (f.r() - 0.5) * 0.02, 0.37 + Math.floor(i / 11) * 0.045 + (f.r() - 0.5) * 0.02]])[0]; f.flat(ell(q, 1.7, 1.7, 0, 5), i % 7 ? '#0a0604' : P.lampL, { op: 0.65 }); }
  W.blisters(f, hF([[0.02, 0.56]])[0], 34, 14, 4, 6, 10);
  for (const pts of [[[0.16, -0.28], [0.26, -0.3], [0.24, -0.26]], [[0.33, -0.02], [0.38, 0.06], [0.35, 0.05]], [[0.2, 0.05], [0.28, 0.06], [0.24, 0.09]]]) f.flat(hF(pts), '#f0d0a8', { op: 0.5 }); // the tight sheen on the brow, nose and cheek
  const body = f.out.splice(i0).join('\n'); f.L = L0;
  f.raw(`<g transform="translate(0 ${2 * HC[1]}) scale(1 -1)">${body}</g>`);
  const M = q => [q[0], 2 * HC[1] - q[1]]; // upright frame -> screen
  // thin hair hanging plumb from the crown to the floor, in clumps with the scalp between, the ends smouldering
  for (let i = 0; i < 16; i++) { const t = i / 15, q = M(hF([[-0.38 + t * 0.6, -0.34 - Math.sin(t * Math.PI) * 0.16]])[0]), L1 = 50 + ((i * 37) % 60) + (i % 4 === 1 ? 30 : 0), sw = (i % 3 - 1) * 5; f.line([q, add(q, [sw, L1 * 0.5]), add(q, [sw * 0.4, L1])], i % 4 === 0 ? 5 : 3, '#2a221a', { op: 0.9 }); if (i % 3 === 0) { f.flat(ell(add(q, [sw * 0.4, L1]), 3.4, 3.4, 0, 6), P.lampL); W.ash(f, add(q, [0, L1 - 10]), 2, 10, 40, 0.8); } }
  W.glow(f, [1060, 1260], 120, 140, P.lamp, 0.18, true); // the lamp's light on the face

  // ---------------- the chain of office: heavy silver links swinging forward off the neck, ahead of the face, the badge low
  f.bone('chain');
  W.chainLinks(f, [[990, 944], [1040, 1040], [1080, 1150], [1094, 1210]], 34, silver);
  W.chainLinks(f, [[1040, 930], [1090, 1030], [1112, 1140], [1104, 1210]], 34, silver);
  const md = [1098, 1256];
  f.part(ell(md, 46, 52, 0.1, 18), { fill: silver, shadow: silverD, light: silverL, shade: 0.45, inkW: 2, cast: false, tex: 'mottle' + seed });
  f.flat(ell(md, 30, 36, 0.1, 14), '#6a6a64', { op: 0.6 }); f.line([add(md, [-14, -16]), add(md, [0, 12]), add(md, [14, -16])], 3, '#2a2a28', { op: 0.7 }); // a struck pick on the badge
  f.flat(ell(add(md, [12, -16]), 11, 7, -0.4, 8), '#fff', { op: 0.6 });

  // ---------------- the near arm, hanging to the floor; the swollen hand lying on it, the fingers trailing
  arm(SN, EN, WN, '_n', false);
  f.bone('hand_n');
  const hc = add(WN, [-52, 58]);
  const hh = B.hand(f, hc, Math.PI - 0.35, 96, mix(ch, '#5a4030', 0.25), { spread: 0.5, curl: -0.15, shadow: chD, tipCols: ['#0a0604', '#0a0604', '#0a0604', '#0a0604'] });
  hh.tips.forEach(t => f.flat(ell(t, 8, 6, 0, 8), '#050302'));
  for (const y of [-0.34, -0.11, 0.12, 0.33]) { for (const x of [0.66, 0.86]) f.stroke(hh.F([[x, y - 0.1], [x + 0.02, y], [x, y + 0.1]]), 5, '#050302', { op: 0.8 }); f.line(hh.F([[0.5, y - 0.08], [0.6, y - 0.1]]), 2.2, chL, { op: 0.6 }); } // swollen knuckles, deep creases
  f.stroke(hh.F([[-0.3, -0.3], [0.0, -0.36], [0.3, -0.32]]), 4, '#050302', { op: 0.6 }); f.line(hh.F([[-0.4, 0.1], [0.3, 0.2]]), 2, chL, { op: 0.5 });
  W.seam(f, hh.F([[-0.4, -0.2], [0.0, -0.1], [0.3, -0.3]]), 2.4); W.seam(f, hh.F([[-0.3, 0.2], [0.2, 0.3]]), 2);
  W.blisters(f, hh.F([[0.0, 0.0]])[0], 26, 20, 4, 6, 10);
  const rg = hh.F([[0.72, -0.12]])[0]; f.part(ell(rg, 18, 11, 0.2, 12), { fill: silver, shadow: silverD, light: silverL, shade: 0.45, inkW: 1.6, cast: false }); f.part(ell(add(rg, [-4, -4]), 10, 8, 0, 10), { fill: '#6a6a64', shade: 0.4, inkW: 1, cast: false }); f.flat(ell(add(rg, [4, -6]), 4, 3, 0, 6), '#fff', { op: 0.7 }); // the signet ring sunk in the flesh
  W.crust(f, [hc[0] - 40, gy - 8], 70, 6, 6, 4, 8, { spikes: 0.3 });

  // ---------------- the shaft mouth and the gallery roof (on root, in front): rock and lagging, the splintered props
  // and timbers jammed round him, the bent bars of the winding cage round his waist, its chain running up out of frame
  f.bone('root');
  const ROCK = { fill: '#3a3228', shadow: '#120e0a', light: '#5e5244', shade: 0.4, tex: 'mottle' + seed, texOp: 0.8, maxShade: 40 };
  f.part([[-10, -10], [600, -10], [586, 70], [560, 120], [480, 150], [380, 136], [260, 160], [120, 144], [-10, 170]], ROCK);
  f.part([[944, -10], [1610, -10], [1610, 150], [1480, 132], [1360, 160], [1220, 140], [1080, 150], [990, 120], [958, 70]], ROCK);
  for (const x of [80, 300, 1200, 1440]) { f.part([[x - 30, -10], [x + 30, -10], [x + 26, 150], [x - 26, 156]], { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.42, tex: 'wood' + seed, texOp: 0.6 }); f.flat([[x - 26, 120], [x + 26, 116], [x + 26, 152], [x - 26, 156]], P.char, { op: 0.6 }); }
  W.crust(f, [300, 150], 200, 10, 10, 6, 12, { spikes: 0.4 }); W.crust(f, [1300, 150], 200, 10, 10, 6, 12, { spikes: 0.4 });
  for (const [x0, x1, bend] of [[560, 520, -40], [640, 610, -20], [900, 950, 30], [970, 1030, 50]]) { const pts = [[x0, -10], [x0 + bend * 0.2, 80], [x1 + bend, 200], [x1 + bend * 0.6, 290]]; f.line(pts, 18, INK); f.line(pts, 12, P.iron); f.line(pts.map(q => add(q, [3, -2])), 2.4, P.ironL, { op: 0.6 }); f.flat(ell(pts[3], 8, 8, 0, 8), P.iron); }
  f.part([[530, 110], [1050, 110], [1056, 140], [524, 140]], { fill: P.iron, shadow: '#15110e', light: P.ironL, shade: 0.42, inkW: 1.8, cast: false, tex: 'mottle' + seed });
  for (let i = 0; i < 8; i++) f.rivet([550 + i * 66, 125], 4, P.ironL);
  W.chainLinks(f, [[1010, 116], [1000, 40], [990, -20]], 40, P.iron);
  W.smoke(f, [780, 140], 220, 70, { col: '#5a4a3a', op: 0.3, sway: 30 });

  // ---------------- his broad hat on the gallery floor beneath his head; coins on the floor
  const ht = [872, gy - 18];
  f.part([add(ht, [-150, 14]), add(ht, [-140, -4]), add(ht, [-60, -14]), add(ht, [60, -16]), add(ht, [150, -6]), add(ht, [160, 12]), add(ht, [0, 20])], { fill: '#2e261e', shadow: '#0e0a08', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 });
  f.part([add(ht, [-74, -8]), add(ht, [-70, -70]), add(ht, [-30, -96]), add(ht, [40, -94]), add(ht, [76, -66]), add(ht, [78, -10])], { fill: '#3a3026', shadow: '#0e0a08', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 });
  f.part([add(ht, [-74, -30]), add(ht, [78, -30]), add(ht, [78, -10]), add(ht, [-74, -8])], { fill: '#1a1410', shade: 0.4, inkW: 1.2, cast: false });
  f.flat(ell(add(ht, [30, -60]), 24, 16, 0.3, 10), P.char, { op: 0.8 }); W.seam(f, [add(ht, [14, -66]), add(ht, [30, -56]), add(ht, [46, -64])], 2, { glowOp: 0.3 });
  for (const x of [1150, 1186, 1330, 1370]) f.part(ell([x, gy - 4], 11, 4, 0, 10), { fill: silver, shadow: silverD, light: silverL, shade: 0.4, inkW: 1, cast: false, hatch: false });
  f.flat(ell([820, gy + 2], 460, 12, 0, 24), '#3a3020', { op: 0.45 });
  W.crust(f, [300, gy - 4], 80, 6, 6, 4, 8, { spikes: 0.3 }); W.crust(f, [1460, gy - 4], 60, 6, 6, 4, 8, { spikes: 0.3 });
  return f;
}

// ------------------------------------------------------------------ THE POWDER MILL (ruler, 3.5)
// The pithead powder mill: a great stone edge-runner wheel that crushed sulphur in a trough, and the blind mill horse
// that turned it, never unhitched. (Independent review rebuild, 2026-11-23.) The millstone stands on its edge in its
// stone trough, seen three-quarter so it has its real thickness: the near face (pick-dressed in rings round the eye, a
// chamfered, chipped rim) and the tread turning away in space, its grooves dressed across it and caked with sulphur,
// the iron tyre riveted round it. Its top and the mill's timber frame are cropped by the frame top. The horse is
// harnessed in front of it, leaning into the collar as the machine advances, so it reads horse first: a big blind
// draught horse with a long neck stretched forward and a long, heavy head hung low, a deep chest, a tucked flank, round
// haunches, legs with real knees, hocks and fetlocks (the near fore planted, the far fore lifted mid-tread with its knee
// bent and its hoof tucked, the near hind driving back, the far hind under him), feathered fetlocks and shod hooves. The
// stone is charred black and split by glowing seams that open and close as it turns; the horse's hide is charred and
// cracked in glowing seams along every harness line, the mane burned to a stub, the belly swollen with gas, a gas sac
// under the throat, the nostrils ringed yellow, the eyes milk white, the lips drawn back from long teeth, the foam gone
// yellow. Through the stone's eye runs the iron-banded timber axle-beam (one band split), its outer end coming toward
// us and down to the swingletree behind the horse's hocks, where the harness has burned into the hide and the sulphur
// has grown over the swingletree, the trace chains and the near hock alike, cementing horse and beam into one.
// Gear: a burst collar of leather and straw on the hames, useless blinkers, the trace chains through the back band,
// the breeching, a bronze bell on the hame; the miller's leather apron hanging from the beam; the miller's boot
// sticking out from under the stone's rim; split powder sacks spilling yellow along the trough; a wooden scoop; a
// horn-screened lantern hung on the beam; a tally board nailed to the frame; lumps of brimstone in the trough; a broken
// rake across it.
// Rig: mill (root, at the hub) > stone (turns on the hub), beam; mill > spine_1 > horse chain (spine_2, neck, head,
// tail, leg_*_1..3). Motion: idle the horse treading in place (the far fore lifts and sets down) while the stone grinds
// a quarter turn; attack the mill rolling forward (the root slides, the stone turns) and the powder flashes (VFX).
function powderMill() {
  const seed = 421, h = TIERS.ruler[1];
  const f = new Fig(W.base(seed, h, { grimeY: 1200 }));
  W.textures(f);
  const gy = f.o.groundY;
  const SC = [200, 770], R = 760, RX = 0.6, TH = 250; // the stone: near-face centre, radius, face foreshortening, thickness seen
  const FC = add(SC, [TH, -14]); // the far face's centre
  const STONE = (o = {}) => Object.assign({ fill: '#3a332c', shadow: '#0e0c0a', light: '#6a6056', shade: 0.38, tex: 'mottle' + seed, texOp: 0.9, maxShade: 90 }, o);
  const u = 600, coat = '#5a4430', coatD = '#140c08', coatL = '#94785a';
  const horse = X.horse(f, {
    u, O: [920, gy], len: 0.86, tilt: 0.08, coat, coatD, coatL, bloat: 0.55, draught: 1.5, legW: 1.15, Lh: 0.5, hA: 1.12, poll: [0.96, -1.0], hoof: '#2a2420', feather: '#3e2e20', shoe: true,
    legs: {
      fn: [[0.3, -0.54], [0.29, -0.29], [0.285, -0.19], [0.275, -0.1], [0.325, -0.045]],
      ff: [[0.24, -0.55], [0.45, -0.38], [0.445, -0.3], [0.435, -0.22], [0.395, -0.16]],
      hn: [[-0.48, -0.62], [-0.78, -0.34], [-0.81, -0.215], [-0.86, -0.095], [-0.815, -0.045]],
      hf: [[-0.44, -0.62], [-0.66, -0.34], [-0.655, -0.215], [-0.645, -0.095], [-0.595, -0.045]],
    },
  });
  const Bp = horse.Bp;
  const ST = [470, 1296]; // the swingletree, behind the hocks
  f.joint('mill', SC).joint('stone', SC, 'mill').joint('beam', SC, 'mill');
  horse.joints('mill');

  // ---------------- the mill frame behind the stone: a post and a head-beam running up out of frame, the tally board
  f.bone('mill');
  const OAK = (o = {}) => Object.assign({ fill: '#4e3a26', shadow: '#1c120a', light: '#76603e', shade: 0.42, tex: 'wood' + seed, texOp: 0.65, maxShade: 30 }, o);
  for (const [x, w] of [[700, 96]]) { f.part([[x - w / 2, -20], [x + w / 2, -20], [x + w / 2 - 4, 1440], [x - w / 2 + 4, 1440]].map(q => [...q, 1]), OAK({ fill: '#3a2c1e' })); f.flat([[x - w / 2, -20], [x - w / 4, -20], [x - w / 4, 1440], [x - w / 2 + 4, 1440]], '#000', { op: 0.35 }); for (let i = 0; i < 6; i++) f.line([[x - w * 0.3 + i * 6, 60 + i * 210], [x - w * 0.3 + i * 6, 180 + i * 210]], 1.4, INK, { op: 0.5 }); }
  f.part([[-80, -20], [1200, -20], [1200, 60], [-80, 70]].map(q => [...q, 1]), OAK({ fill: '#3e2e1e' }));
  for (const x of [60, 300, 560, 820, 1100]) f.rivet([x, 24], 5, P.iron);
  const tb = [1130, 150]; // the tally board of sacks, nailed to the head-beam and hanging below it
  f.part([add(tb, [-56, -80]), add(tb, [56, -84]), add(tb, [58, 80]), add(tb, [-54, 84])].map(q => [...q, 1]), OAK({ fill: '#8a7050', light: '#a88c66' }));
  for (let r = 0; r < 6; r++) { for (let c = 0; c < 4 + (r % 3); c++) f.line([add(tb, [-40 + c * 10, -64 + r * 24]), add(tb, [-38 + c * 10, -48 + r * 24])], 2.4, '#2a1e14'); if (r % 2) f.line([add(tb, [-44, -54 + r * 24]), add(tb, [0, -60 + r * 24])], 2, '#2a1e14'); }
  for (const q of [[-44, -70], [46, -74], [46, 70], [-44, 74]]) f.rivet(add(tb, q), 4, P.iron);
  f.flat([add(tb, [20, 40]), add(tb, [58, 30]), add(tb, [58, 80]), add(tb, [16, 84])], P.char, { op: 0.8 });
  W.smoke(f, [500, 40], 260, 90, { col: '#5a4a38', op: 0.3, sway: 40 });

  // ---------------- the stone, seen three-quarter: the tread turning away from the near face toward the far face
  f.bone('stone');
  const N = 96, eP = (c, a) => [c[0] + Math.cos(a) * R * RX, c[1] + Math.sin(a) * R];
  const half = c => { const r = []; for (let i = -N / 4; i <= N / 4; i++) r.push(eP(c, Math.PI * 2 * i / N)); return r; }; // the right half, top to bottom
  const TREAD = [...half(FC), ...half(SC).reverse()];
  f.part(TREAD, STONE({ fill: '#2e2822', light: '#5a5046', maxShade: 60 }));
  W.clipDraw(f, TREAD, () => {
    W.glow(f, eP(lerp(SC, FC, 0.5), -0.7), 160, 260, '#8a7a66', 0.35, true); // the tread lit high toward the key light, turning dark below
    W.glow(f, eP(lerp(SC, FC, 0.5), 0.9), 140, 260, '#000', 0.5, true);
    // the dressing: grooves cut across the tread, caked yellow; the iron tyre riveted round its far half
    for (let i = -N / 4 + 1; i < N / 4; i += 2) { const a = Math.PI * 2 * i / N, q0 = eP(SC, a), q1 = eP(lerp(SC, FC, 0.55), a); f.stroke([lerp(q0, q1, 0.04), lerp(q0, q1, 0.5), lerp(q0, q1, 0.96)], 9, '#0a0806', { op: 0.75 }); if (i % 4 === 1) f.line([add(lerp(q0, q1, 0.1), [0, -4]), add(lerp(q0, q1, 0.8), [0, -4])], 2.4, P.sul, { op: 0.65 }); }
    const ty0 = half(lerp(SC, FC, 0.6)), ty1 = half(lerp(SC, FC, 0.96));
    const TY = [...ty1, ...ty0.slice().reverse()];
    f.part(TY, { fill: P.iron, shadow: '#120e0a', light: P.ironL, shade: 0.42, inkW: 1.6, cast: false, tex: 'mottle' + seed, texOp: 0.7, maxShade: 30 });
    for (let i = -N / 4 + 2; i < N / 4; i += 4) f.rivet(lerp(ty0[i + N / 4], ty1[i + N / 4], 0.5), 5, P.ironL);
    f.line(ty0.map(q => add(q, [-2, -3])), 2.4, P.ironL, { op: 0.6 });
    W.crust(f, eP(lerp(SC, FC, 0.3), 0.6), 30, 70, 8, 6, 12, { spikes: 0.3 });
    W.crackNet(f, eP(lerp(SC, FC, 0.25), -0.3), 1.6, 160, 3.4, { depth: 2 });
  });
  // the near face: pick-dressed in rings round the eye, a chamfered rim with chips broken out of it
  const faceP = []; for (let i = 0; i < N; i++) { const a = Math.PI * 2 * i / N, chip = (i % 23 === 5 || i % 31 === 17) ? 0.97 : 1; faceP.push([SC[0] + Math.cos(a) * R * RX * chip, SC[1] + Math.sin(a) * R * chip]); }
  f.part(faceP, STONE());
  W.clipDraw(f, faceP, () => {
    f.raw(`<ellipse cx="${SC[0] - 100}" cy="${SC[1] + 220}" rx="${R * 0.5}" ry="${R * 0.8}" fill="#000" opacity="0.4" filter="url(#glowL${seed})"/>`);
    // the chamfer: a lighter bevel round the rim, worn bright where the light catches it
    const bev = []; for (let i = 0; i <= N; i++) bev.push(eP(SC, Math.PI * 2 * i / N).map((v, j) => SC[j] + (v - SC[j]) * 0.93));
    f.line(bev, 16, '#1a1612', { op: 0.6 }); f.line(bev.slice(N * 0.62, N * 0.95), 5, '#8a7e6e', { op: 0.55 });
    // pick dressing: rings of pecked marks round the eye
    for (let r = 0; r < 7; r++) { const rr = 0.3 + r * 0.09; for (let i = 0; i < 40 + r * 10; i++) { const a = Math.PI * 2 * i / (40 + r * 10) + r * 0.3, q = [SC[0] + Math.cos(a) * R * RX * rr, SC[1] + Math.sin(a) * R * rr]; f.line([q, add(q, rot([5, 0], a + 1.4))], 1.6, i % 3 ? '#14100c' : '#7a7062', { op: 0.55 }); } }
    for (let r = 0; r < 3; r++) { const ring = []; for (let i = 0; i <= 48; i++) { const a = Math.PI * 2 * i / 48, rr = 0.42 + r * 0.17; ring.push([SC[0] + Math.cos(a) * R * RX * rr, SC[1] + Math.sin(a) * R * rr]); } f.line(ring, 5, '#0e0c0a', { op: 0.45 }); f.line(ring.map(q => add(q, [2, -3])), 1.6, mix(P.sul, '#3a332c', 0.4), { op: 0.45 }); }
    // charred black and split by glowing seams that open and close as it turns, running out from the eye
    for (let i = 0; i < 8; i++) { const a = 0.3 + i * 0.78, r0 = 0.24; W.crackNet(f, [SC[0] + Math.cos(a) * R * RX * r0, SC[1] + Math.sin(a) * R * r0], Math.atan2(Math.sin(a), Math.cos(a) * RX) + (f.r() - 0.5) * 0.3, 300 + (i % 2) * 140, 4.6 - (i % 3), { depth: 2, fork: 0.5 }); }
    for (let i = 0; i < 4; i++) { const a = i * 1.6 + 0.6; W.hairline(f, [0, 1, 2, 3].map(k => [SC[0] + Math.cos(a + k * 0.02) * (300 + k * 100) * RX, SC[1] + Math.sin(a + k * 0.02) * (300 + k * 100)]), 2); } // closed seams
    W.crust(f, [SC[0] + 150, SC[1] + 450], 140, 60, 16, 8, 16, { spikes: 0.3 });
    W.crust(f, [SC[0] - 200, SC[1] - 220], 90, 120, 10, 8, 14, { spikes: 0.3 });
    W.flakes(f, [SC[0], SC[1] - 200], 260, 200, 16, 1.8);
  });
  for (const i of [5, 17, 28, 40]) { const a = Math.PI * 2 * i / N, q = eP(SC, a); f.flat([add(q, rot([-26, 0], a + 1.6)), add(q, rot([-30, 0], a)), add(q, rot([26, 0], a + 1.6))], '#0e0c0a', { op: 0.7 }); } // chips out of the rim's edge
  // the eye: a square socket foreshortened with the face, the axle through it, the wedges
  const EYE = (x, y) => add(SC, [x * RX, y]);
  f.part([EYE(-110, -120), EYE(110, -120), EYE(110, 120), EYE(-110, 120)].map(q => [...q, 1]), { fill: '#120e0a', shade: 0.3, inkW: 2, cast: false });
  for (const [a0, a1] of [[[-110, -120], [-60, -60]], [[110, -120], [60, -60]], [[110, 120], [60, 60]], [[-110, 120], [-60, 60]]]) f.part([EYE(...a0), EYE(a0[0], a1[1]), EYE(...a1), EYE(a1[0], a0[1])], OAK({ fill: '#5a4430' })); // wedges
  W.ash(f, [SC[0] + 300, SC[1] - 500], 14, 300, 300, 1.6);

  // ---------------- the trough under the stone: its front wall hides the foot of the stone; split powder sacks
  // spilling yellow, brimstone lumps, the miller's boot under the rim, the broken rake across it
  f.bone('mill');
  const TR = [[-20, 1420], [700, 1412], [710, 1572, 1], [-20, 1574, 1]];
  f.part(TR, { fill: '#5a5248', shadow: '#1e1a16', light: '#8a8070', shade: 0.4, tex: 'mottle' + seed, texOp: 0.8, maxShade: 40 });
  W.clipDraw(f, TR, () => { for (const x of [160, 420, 640]) f.line([[x, 1420], [x - 6, 1572]], 2, INK, { op: 0.6 }); f.line([[-20, 1496], [710, 1490]], 1.6, INK, { op: 0.4 }); f.raw(`<rect x="-20" y="1400" width="740" height="180" fill="url(#soot${seed})" opacity="0.6"/>`); });
  f.part([[-20, 1404], [702, 1396], [706, 1424], [-20, 1432]], { fill: '#6e6658', shadow: '#2a2620', shade: 0.4, inkW: 1.8, cast: false, tex: 'mottle' + seed });
  f.scratches([360, 1414], 300, 8, '#9a9080', 1, 0);
  const bt = [250, 1392];
  f.part([add(bt, [-40, -30]), add(bt, [30, -36]), add(bt, [40, 4]), add(bt, [130, 10]), add(bt, [150, 30]), add(bt, [-36, 30])], W.LEA(f, { fill: '#2a221a' }));
  f.part([add(bt, [-36, 26]), add(bt, [150, 26]), add(bt, [150, 36]), add(bt, [-36, 36])], { fill: '#120e0a', shade: 0.3, inkW: 1.2, cast: false });
  for (let i = 0; i < 6; i++) f.flat(ell(add(bt, [-20 + i * 28, 33]), 2.4, 2, 0, 6), '#8a8478');
  f.flat(ell(add(bt, [40, -10]), 22, 12, 0.2, 10), P.char, { op: 0.7 });
  for (const [x, w] of [[70, 130], [560, 110]]) { const q = [x, 1404]; f.part([add(q, [-w / 2, 4]), add(q, [-w / 2 + 10, -50]), add(q, [-10, -70]), add(q, [w / 2 - 6, -50]), add(q, [w / 2, 4])], W.CAN(f, { fill: P.canvas })); f.line([add(q, [-w / 4, -50]), add(q, [-w / 4 + 8, 0])], 2, P.canvasD); f.flat([add(q, [10, -40]), add(q, [w / 2 - 10, -30]), add(q, [w / 2 + 6, 4]), add(q, [6, 4])], '#1a140c'); f.part(W.lumpy(f, [add(q, [w / 2 - 30, 0]), add(q, [w / 2 + 10, -20]), add(q, [w / 2 + 70, -6]), add(q, [w / 2 + 120, 8]), add(q, [w / 2 + 60, 30]), add(q, [w / 2 + 40, 90]), add(q, [w / 2 + 20, 40]), add(q, [w / 2 - 20, 20])], 4), { fill: P.sul, shadow: P.sulD, light: P.sulP, shade: 0.4, tex: 'grain' + seed, texOp: 0.8, inkW: 1.2, cast: false }); }
  W.druse(f, [200, 1404], -1.7, 40, 5); W.druse(f, [640, 1400], -1.3, 34, 4);
  for (let i = 0; i < 6; i++) f.part(W.lumpy(f, ell([120 + i * 100, 1400 - (i % 3) * 6], 16 + (i % 2) * 8, 12, 0.2, 9), 3), { fill: mix(P.sul, P.och, 0.4), shadow: P.sulD, shade: 0.4, inkW: 1.1, cast: false, tex: 'grain' + seed });
  f.part(limb([-20, 1384], [440, 1360], 20, 18, { steps: 10, capK: 0.4 }), OAK({ fill: '#5e4630' }));
  for (let i = 0; i < 5; i++) f.flat([[440 + i * 3, 1352 + i * 4], [480 + i * 8, 1340 + i * 6], [450 + i * 4, 1362 + i * 3]], '#76603e');
  for (let i = 0; i < 4; i++) f.line([[40 + i * 30, 1384], [36 + i * 30, 1420]], 6, '#5e4630');

  // ---------------- the axle-beam: from the eye toward us and down to the swingletree behind the hocks
  f.bone('beam');
  const b0 = add(SC, [-20, -20]), bd = E.norm(sub(ST, b0)), bn = [-bd[1], bd[0]];
  const BEAM = [add(b0, mul(bn, -52)), add(ST, mul(bn, -46)), [...add(ST, mul(bd, 8)), 1], add(ST, mul(bn, 46)), add(b0, mul(bn, 52)), [...add(b0, mul(bd, -10)), 1]];
  f.part(BEAM, OAK({ fill: '#5e4630', maxShade: 24 }));
  W.clipDraw(f, BEAM, () => { for (let i = 0; i < 6; i++) f.line([add(lerp(b0, ST, 0.05), mul(bn, -40 + i * 16)), add(lerp(b0, ST, 0.95), mul(bn, -32 + i * 13))], 1.2, INK, { op: 0.4 }); f.flat([add(b0, mul(bn, 20)), add(ST, mul(bn, 16)), add(ST, mul(bn, 46)), add(b0, mul(bn, 52))], '#000', { op: 0.3 }); });
  for (const t of [0.2, 0.5, 0.78]) { const q = lerp(b0, ST, t), w = 54 - t * 8; f.part([add(add(q, mul(bn, -w)), mul(bd, -14)), add(add(q, mul(bn, w)), mul(bd, -14)), add(add(q, mul(bn, w)), mul(bd, 14)), add(add(q, mul(bn, -w)), mul(bd, 14))], { fill: P.iron, shadow: '#15110e', light: P.ironL, shade: 0.42, inkW: 1.6, cast: false, tex: 'mottle' + seed }); for (const v of [-0.6, 0, 0.6]) f.rivet(add(q, mul(bn, v * w)), 3.4, P.ironL); }
  { const q = lerp(b0, ST, 0.5); f.flat([add(q, mul(bn, -10)), add(add(q, mul(bn, -2)), mul(bd, -16)), add(add(q, mul(bn, 6)), mul(bd, 16))], '#0a0806'); f.line([add(add(q, mul(bn, -50)), mul(bd, 12)), add(add(q, mul(bn, -74)), mul(bd, 30))], 6, P.iron); } // the split band, sprung
  // the miller's apron hanging from the beam, the horn-screened lantern on its hook
  const ap = lerp(b0, ST, 0.34);
  const APR = [add(ap, [-40, 0]), add(ap, [50, -6]), add(ap, [60, 120]), add(ap, [40, 230]), add(ap, [-20, 240]), add(ap, [-50, 130])];
  f.part(APR, W.LEA(f, { fill: P.leath }));
  W.clipDraw(f, APR, () => { f.stroke([add(ap, [0, 10]), add(ap, [-6, 120]), add(ap, [0, 230])], 4, P.leathD); f.flat(ell(add(ap, [10, 160]), 30, 40, 0.2, 10), P.sul, { op: 0.3 }); f.flat(ell(add(ap, [30, 200]), 30, 30, 0, 10), P.char, { op: 0.7 }); });
  f.line([add(ap, [-36, 0]), add(ap, [-10, -40]), add(ap, [30, -46]), add(ap, [48, -4])], 3, P.leathD);
  const ln = lerp(b0, ST, 0.64); f.line([ln, add(ln, [30, 50])], 4, P.iron);
  const LF = frame(add(ln, [30, 54]), 0, 1);
  f.part(LF([[-26, 0], [26, 0], [30, 14], [30, 90], [-30, 90], [-30, 14]]), { fill: P.iron, shade: 0.4, inkW: 1.4, cast: false });
  f.flat(LF([[-22, 18], [22, 18], [22, 84], [-22, 84]]), '#e0a858', { op: 0.85 });
  for (const x of [-11, 11]) f.line(LF([[x, 18], [x, 84]]), 3, P.iron);
  X.wickFlame(f, LF([[0, 72]])[0], 26, { glowOp: 0.35, soot: false });
  f.part(LF([[-30, 90], [30, 90], [24, 102], [-24, 102]]), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false });
  // the swingletree: an iron-shod bar across the beam's end; the trace chains hook to its ends
  const SW0 = add(ST, [-14, -96]), SW1 = add(ST, [14, 96]);
  f.part(limb(SW0, SW1, 34, 34, { steps: 6, capK: 0.3 }), OAK({ fill: '#4e3a26' }));
  for (const q of [SW0, SW1]) { f.part(ell(q, 20, 14, 1.4, 10), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false }); K.ring(f, add(q, [16, 0]), 9, 9, 3, P.ironL); }

  // ---------------- the horse: far legs, near legs, the body (over their tops), harness, head
  horse.farLegs(); horse.nearLegs();
  horse.drawBody(R0 => {
    // the belly swollen with gas under the crust: one taut swelling behind the girth, sagging, veined, glowing faintly
    const c0 = Bp(-0.2, -0.52);
    f.raw(`<ellipse cx="${c0[0]}" cy="${c0[1]}" rx="${0.17 * u}" ry="${0.06 * u}" fill="#8a6a4a" opacity="0.3" filter="url(#glow${seed})"/>`);
    f.flat([add(c0, [-0.1 * u, -0.01 * u]), add(c0, [0.02 * u, -0.03 * u]), add(c0, [0.1 * u, -0.01 * u]), add(c0, [0.02 * u, -0.005 * u])], '#c8a888', { op: 0.4 });
    W.glow(f, c0, 0.1 * u, 0.04 * u, P.lamp, 0.14);
    for (let i = 0; i < 4; i++) f.line([add(c0, [-0.12 * u + i * 0.07 * u, -0.02 * u]), add(c0, [-0.1 * u + i * 0.07 * u, 0.04 * u]), add(c0, [-0.09 * u + i * 0.07 * u, 0.07 * u])], 1.4, '#2a1a14', { op: 0.5 });
    W.crust(f, Bp(-0.1, -0.48), 0.2 * u, 0.03 * u, 10, 6, 12, { spikes: 0.3 });
    // the seams along every harness line: the girth, the breeching, the back band, the traces' path along the flank
    for (const pts of [[[0.08, -0.98], [0.1, -0.78], [0.12, -0.56]], [[-0.74, -0.86], [-0.62, -0.74], [-0.48, -0.72], [-0.3, -0.74]], [[-0.4, -0.98], [-0.38, -0.86]], [[0.3, -0.76], [0.0, -0.76], [-0.3, -0.73], [-0.6, -0.62]]]) W.seam(f, pts.map(q => Bp(...q)), 4);
    W.crackNet(f, Bp(-0.5, -0.88), 0.4, 0.28 * u, 3, { depth: 2 }); W.crackNet(f, Bp(0.24, -0.9), 2.2, 0.22 * u, 3, { depth: 2 });
    W.flakes(f, Bp(-0.2, -0.9), 0.3 * u, 0.06 * u, 10, 1.4);
  });
  // the harness: breeching round the quarters, the back band and the girth, each with a buckle
  f.bone('spine_1');
  const strap = (pts, w) => { const sp = pts.map(q => Bp(...q)); f.line(sp, w + 5, INK); f.line(sp, w, P.leathD); f.line(sp.map(q => add(q, [1, -w * 0.3])), 1.6, P.leathL, { op: 0.5 }); f.line(sp, 1.2, P.leathL, { dash: '4 5', op: 0.45 }); return sp; };
  const brs = strap([[-0.78, -0.82], [-0.66, -0.72], [-0.5, -0.7], [-0.32, -0.72]], 20);
  f.part(ell(lerp(brs[1], brs[2], 0.5), 13, 10, 0, 8), { fill: P.ironL, shade: 0.4, inkW: 1.2, cast: false });
  strap([[-0.72, -0.95], [-0.76, -0.86]], 16); // the hip strap holding the breeching up
  const bbs = strap([[-0.38, -1.0], [-0.37, -0.87], [-0.35, -0.73]], 20);
  f.bone('spine_2');
  const gs = strap([[0.08, -1.0], [0.1, -0.78], [0.12, -0.54]], 24);
  f.part([add(gs[1], [-14, -12]), add(gs[1], [14, -12]), add(gs[1], [14, 12]), add(gs[1], [-14, 12])].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1.4, cast: false });
  // the trace chain from the hame along the flank, through the back band's loop, to the swingletree
  const hame = Bp(0.4, -0.78);
  W.chainLinks(f, [hame, Bp(0.0, -0.76), Bp(-0.36, -0.74), Bp(-0.62, -0.66), add(SW0, [18, 0])], 28, P.iron);
  f.part(ell(Bp(-0.36, -0.74), 16, 22, 0, 10), W.LEA(f, { fill: P.leath, cast: false })); // the back band's loop over the trace
  // the sulphur crust cementing the swingletree, the trace's end and the near hock into one, grown up the leg
  f.bone('beam');
  const hk = horse.legP('hn')[1];
  W.crust(f, lerp(ST, hk, 0.5), 110, 60, 22, 10, 22, { spikes: 0.45 });
  W.crust(f, add(hk, [10, -40]), 40, 70, 10, 8, 14, { spikes: 0.4 });
  W.crust(f, add(SW0, [10, 30]), 40, 50, 8, 8, 14, { spikes: 0.4 });
  W.druse(f, lerp(ST, hk, 0.35), -1.3, 60, 7); W.druse(f, lerp(ST, hk, 0.7), -1.9, 46, 5);
  W.seam(f, [add(ST, [10, 20]), lerp(ST, hk, 0.5), add(hk, [-10, 10])], 3.4);
  // the collar: a thick padded ring of leather and straw round the base of the neck, burst; the hames on it with the
  // bronze bell
  f.bone('neck');
  const NB = horse.NB, W0 = horse.W0;
  const COL = W.spline([add(W0, [-10, -14]), add(lerp(W0, horse.PL, 0.17), [16, -34]), add(lerp(NB, horse.TL, 0.16), [48, -6]), add(NB, [36, 36]), add(NB, [-8, 46])], 6);
  f.part(K.chain(COL, COL.map((_, i) => 66 - Math.abs(i - COL.length / 2) * 1.0), { steps: 2 }), W.LEA(f, { fill: '#5a3e24', light: '#8a6a44', maxShade: 20 }));
  W.clipDraw(f, K.chain(COL, COL.map(() => 90), { steps: 2 }), () => { for (let i = 3; i < COL.length - 3; i += 4) f.line([add(COL[i], [-30, 0]), add(COL[i], [30, 0])], 1.6, P.leathL, { op: 0.5 }); f.line(COL.map(q => add(q, [8, -16])), 3, P.leathL, { op: 0.5 }); });
  const bur = COL[Math.floor(COL.length * 0.55)]; f.flat(ell(bur, 36, 24, 0.8, 12), '#1a1208');
  X.fur(f, [add(bur, [-20, 0]), add(bur, [10, 14])], [0.4, 1], 44, 9, '#b09a5a', { w: 8, jit: 0.8, singe: 0.5, inkW: 0.8, inkH: 1 }); // straw bursting out
  const HM = W.spline([add(W0, [8, -46]), add(lerp(W0, horse.PL, 0.2), [40, -40]), add(lerp(NB, horse.TL, 0.1), [70, 10]), add(NB, [52, 50])], 6);
  f.line(HM, 18, INK); f.line(HM, 12, P.woodL); f.line(HM.map(q => add(q, [3, -3])), 2, P.woodL, { op: 0.6 }); // the hame
  for (const q of [HM[2], HM[HM.length - 3]]) f.rivet(q, 4, P.ironL);
  const bl = add(HM[2], [10, -22]); f.line([HM[2], add(bl, [0, 6])], 3, P.iron);
  f.part([add(bl, [-18, 30]), add(bl, [-14, 14]), add(bl, [-8, 2]), add(bl, [8, 2]), add(bl, [14, 14]), add(bl, [18, 30])], { fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.45, inkW: 1.4, cast: false, tex: 'mottle' + seed });
  f.flat([add(bl, [6, 6]), add(bl, [12, 26]), add(bl, [6, 26])], '#4a6a52', { op: 0.5 }); f.flat(ell(add(bl, [0, 32]), 4, 4, 0, 6), P.iron);
  // a gas sac swelling under the throat; the mane burned to a stub along the crest
  { const c0 = add(lerp(NB, horse.TL, 0.62), [-14, 10]); f.part(W.lumpy(f, ell(c0, 52, 36, 0.9, 16), 4), { fill: mix(coat, '#8a6a4a', 0.35), shadow: coatD, shade: 0.4, inkW: 1.4, cast: true, castOp: 0.4, tex: 'mottle' + seed, texOp: 0.5 }); f.flat(ell(add(c0, [10, -14]), 18, 9, 0.6, 8), '#c8a888', { op: 0.4 }); for (let i = 0; i < 3; i++) f.line([add(c0, [-24 + i * 16, -16]), add(c0, [-18 + i * 16, 18])], 1.2, '#2a1a14', { op: 0.5 }); W.crust(f, add(c0, [0, 26]), 26, 8, 5, 4, 8, { spikes: 0.3 }); }
  X.fur(f, [lerp(W0, horse.PL, 0.05), lerp(W0, horse.PL, 0.5), lerp(W0, horse.PL, 0.92)].map(q => add(q, [0, -10])), [-0.4, -1], 30, 18, '#1e1610', { singe: 0.9, w: 14, blunt: true });
  W.ash(f, lerp(W0, horse.PL, 0.5), 10, 140, 200, 1.2);
  // the head: long and heavy, hung low; blind, the lips drawn back from long teeth, yellow foam, the nostrils ringed
  // yellow; the bridle, the useless blinkers
  horse.drawHead({
    earBack: 0.7, earL: 0.26,
    inside: T => {
      f.flat(T([[0.72, 0.15], [0.98, 0.17], [1.0, 0.27], [0.74, 0.27]]), '#3a1e14');
      for (let i = 0; i < 6; i++) { const x = 0.75 + i * 0.04; f.part(T([[x, 0.16], [x + 0.035, 0.16], [x + 0.033, 0.215 + (i % 2) * 0.01], [x + 0.003, 0.215]]), { fill: '#d8c48a', shadow: '#8a7440', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); f.part(T([[x + 0.01, 0.22], [x + 0.04, 0.22], [x + 0.04, 0.265], [x + 0.012, 0.265]]), { fill: '#c8b47a', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); }
    },
    after: (T, eC) => {
      f.part(T([[0.66, 0.12], [0.76, 0.1], [0.74, 0.16], [0.68, 0.18]]), { fill: '#5a3a2a', shade: 0.4, inkW: 1, cast: false });
      f.flat(T([[0.8, 0.27], [0.96, 0.28], [0.97, 0.32], [0.9, 0.34], [0.82, 0.31]]), '#d8c890', { op: 0.7 }); for (let i = 0; i < 5; i++) f.flat(T(ell([0.82 + i * 0.035, 0.3 + (i % 2) * 0.02], 0.012, 0.01, 0, 6)), '#efe0a8', { op: 0.8 });
      for (const q of [[0.84, 0.4], [0.94, 0.38]]) W.drip(f, T([q])[0], 1, '#d8c890');
      f.flat(T(ell([0.92, 0.1], 0.07, 0.055, 0.3, 10)), P.sul, { op: 0.55 }); W.crust(f, T([[0.94, 0.12]])[0], 12, 8, 4, 3, 6, { spikes: 0 });
      for (const pts of [[[0.04, -0.05], [0.1, 0.36]], [[0.12, -0.09], [0.2, -0.02]], [[0.2, 0.02], [0.6, 0.14], [0.8, 0.2]], [[0.68, -0.06], [0.7, 0.26]]]) { f.line(T(pts), 13, INK); f.line(T(pts), 9, P.leathD); }
      f.part(T([[0.18, -0.06], [0.44, -0.08], [0.48, 0.12], [0.2, 0.14]]), W.LEA(f, { fill: P.leath, cast: false })); f.flat(T([[0.32, -0.06], [0.46, -0.07], [0.48, 0.1]]), P.char, { op: 0.8 }); W.seam(f, T([[0.22, 0.12], [0.34, 0.08], [0.46, 0.1]]), 2);
      K.ring(f, T([[0.82, 0.21]])[0], 14, 14, 4, P.ironL);
      W.seam(f, T([[0.1, 0.1], [0.2, 0.2], [0.34, 0.24], [0.5, 0.3]]), 3); W.seam(f, T([[0.5, 0.0], [0.6, 0.06]]), 2.4);
      W.blisters(f, T([[0.4, 0.34]])[0], 20, 12, 4, 5, 9);
    },
  });
  // the tail: burnt to a stub with a few singed hanks
  f.bone('tail');
  const tr = horse.tailRoot;
  f.part([add(tr, [10, -10]), add(tr, [-40, 0]), add(tr, [-70, 50]), add(tr, [-60, 90]), add(tr, [-30, 70]), add(tr, [0, 30])], Object.assign(horse.look(), { maxShade: 20 }));
  X.fur(f, [add(tr, [-50, 50]), add(tr, [-60, 86])], [-0.1, 1], 70, 6, '#1e1610', { singe: 0.8, w: 14 });
  f.flat(ell(add(tr, [-62, 80]), 14, 10, 0, 8), P.char); W.glow(f, add(tr, [-62, 84]), 16, 12, P.lamp, 0.5);

  // ---------------- sparks where the iron tyre grinds on the trough's lip (small, on the figure as world IV's embers)
  f.bone('stone');
  const sk = [SC[0] + TH * 0.8, 1398];
  for (let i = 0; i < 12; i++) { const a = -2.2 + f.r() * 1.4, l = 20 + f.r() * 60, q = add(sk, rot([l * 0.3, 0], a)); f.line([q, add(q, rot([l, 0], a))], 1.6, i % 2 ? P.hot : P.lampL, { op: 0.9, straight: true }); }
  W.glow(f, sk, 50, 30, P.lampL, 0.4);
  f.bone('root');
  const sc = [760, gy - 10]; // the wooden scoop dropped on the floor
  f.part([add(sc, [-40, -14]), add(sc, [24, -18]), add(sc, [30, 8]), add(sc, [-44, 10])], OAK({ fill: P.woodL })); f.part(limb(add(sc, [24, -4]), add(sc, [110, -30]), 16, 12, { steps: 6 }), OAK());
  f.flat(ell([820, gy + 2], 760, 12, 0, 24), '#3a3020', { op: 0.45 });
  return f;
}

module.exports = {
  heroes: [
    { key: 'the_owner', name: 'The Owner', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: theOwner },
    { key: 'powder_mill', name: 'The Powder Mill', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: powderMill },
    { key: 'mounted_overseer', name: 'The Mounted Overseer', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1] + GROW.mounted_overseer[1], flip: true, build: mountedOverseer },
    { key: 'shrine_bearer', name: 'The Shrine-Bearer', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1] + GROW.shrine_bearer[1], flip: true, build: shrineBearer },
    { key: 'gas_burner', name: 'Gas-Burner', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: gasBurner },
    { key: 'pit_boy', name: 'Pit Boy', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: pitBoy },
    { key: 'lamp_room_girl', name: 'Lamp-Room Girl', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: lampRoomGirl },
    { key: 'tub_hurrier', name: 'Tub Hurrier', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: tubHurrier },
    { key: 'timberman', name: 'Timberman', tier: 'large', w: TIERS.large[0] + GROW.timberman[0] + 540, h: TIERS.large[1] + GROW.timberman[1], flip: true, build: timberman },
    { key: 'gallery_rats', name: 'Gallery Rats', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: galleryRats },
    { key: 'weighman', name: 'Weighman', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: weighman },
  ],
};
for (const e of module.exports.heroes) { const b = e.build; e.build = () => { const f = b(); if (f.o.groundY !== e.h - 30) throw new Error(`${e.key}: groundY ${f.o.groundY}, expected ${e.h - 30}`); return f; }; }
