// World II, The Rotmire (Toxin + Water). Fen villages on stilts; the water turned to poison and nothing in it rots.
// Toxin ripens (swelling, blisters, moss, fungus); water preserves (bog-tanned leather skin, stained brown, flattened).
// Palette: peat brown, bile green, lantern amber (the only warm note), plus ink black, bone and grey.
// Foes face left: every figure is drawn facing right with kit.foeBase (light from the upper right) and flipped.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
'use strict';
const K = require('../kit');
const W = require('./kit_II');
const { E, B, G, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { split, side } = require('../dirAC');
const { P } = W;
const D = 180 / Math.PI;
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend

// ------------------------------------------------------------------ BOG BODY (cast, human 0.95)
// An offering sunk in the peat, tanned to leather and walking again. Hunched hard over stiff, nearly straight legs (too
// dry to bend), the spine twisted so the chest turns to the viewer while the hips stay side-on; the head thrust up on a
// stretched neck, lips shrunk back off the teeth. The noose is still round its neck: the cut end lies over the hump of
// the back and hangs plumb behind it. Rig: standard humanoid + noose (parent head) + cape + loin (cloth flap).
// Motion: idle a creaking twitch (head and far forearm); attack a lunge with clawing hands.
function bogBody() {
  const f = new Fig(W.base(204, 820, { grimeY: 600 }));
  W.textures(f);
  const H = 95, seed = 204;
  const skin = '#6c4a2c', skinF = '#5a3c24';
  const SK = (o = {}) => W.SKT(f, Object.assign({ fill: skin, shadow: '#2a1a14' }, o));
  const N = [330, 330], C = [238, 336], Pv = [262, 506];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.2), SF = S.at(0.5, 0.1);
  const EN = [318, 454], WN = [366, 520];
  const EF = [418, 420], WF = [458, 372];
  const HN = [252, 520], KN = [316, 640], AN = [322, 750];
  const HF = [280, 514], KF = [258, 642], AF = [214, 748];
  const HC = [388, 288], hA = -0.2, neck0 = [334, 328];
  const nape = add(HC, rot([-0.3 * H, 0.3 * H], hA));

  f.joint('pelvis', Pv).joint('torso', S.at(0, 0.88), 'pelvis').joint('head', neck0, 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('noose', nape, 'head').joint('cape', S.at(-0.2, 0.0), 'torso').joint('loin', S.at(0.4, 0.95), 'pelvis');

  // long cracked nails on an open clawing hand
  const claw = (c, a, s, col, o = {}) => {
    const h = B.hand(f, c, a, s, col, Object.assign({ spread: 0.55, curl: 0.62, shadow: '#2a1a14' }, o));
    h.tips.forEach((t, i) => {
      const d = E.norm(sub(t, c)), nd = rot(d, 0.7 + (o.nailBend || 0)), l = s * (0.55 + (i === 1 || i === 2 ? 0.12 : 0));
      const tip = add(t, mul(nd, l));
      f.part([add(t, mul([-d[1], d[0]], 3)), add(add(t, mul(nd, l * 0.6)), mul([-nd[1], nd[0]], 2.2)), [...tip, 1], add(t, mul([-d[1], d[0]], -3))], { fill: '#a8946a', shadow: '#5a4a30', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
      f.line([t, lerp(t, tip, 0.7)], 0.7, '#e0d4b0', { op: 0.6 });
    });
    for (let i = 0; i < 3; i++) f.line([add(c, rot([-s * 0.5, -s * 0.3 + i * s * 0.25], a)), add(c, rot([s * 0.4, -s * 0.36 + i * s * 0.27], a))], 1.1, '#2a1a14', { op: 0.6 }); // tendons stand out
    return h;
  };
  const leg = (Hp, Kn, A, s, wH, wK, sfx, look) => {
    const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => W.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, { nail: '#a8946a', thigh: 0.04 }), [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, [side(Kn, dk, wK * 0.6), side(A, mul(da, -1), 18)]], ['foot' + sfx, side(A, da, 18)]]);
  };
  const arm = (S0, E0, W0, ws, sfx, look, o = {}) => {
    const de = elb(S0, E0, W0);
    split(f, () => { W.fullArm(f, S0, E0, W0, ws[0], ws[1], ws[2], look, o); f.line([lp(S0, E0, 0.3, ws[0] * 0.15), lp(S0, E0, 0.85, ws[1] * 0.1), lp(E0, W0, 0.2, ws[1] * 0.2), lp(E0, W0, 0.8, ws[2] * 0.15)], 1.1, '#2a1a14', { op: 0.55 }); f.line([lp(E0, W0, 0.05, -ws[1] * 0.3), add(E0, mul(de, -ws[1] * 0.1)), lp(S0, E0, 0.92, -ws[1] * 0.3)], 1.2, INK, { op: 0.5 }); }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
  };

  // ---- far arm: reaching forward and up, claw raised at the prey
  arm(SF, EF, WF, [48, 40, 32], '_f', SK({ fill: skinF }), { bp: [[0, 0.5, 0.1]] });
  f.bone('forearm_f');
  // a withy (bent hazel twig) still bound round the wrist
  f.part(limb(lp(EF, WF, 0.72, -19), lp(EF, WF, 0.78, 19), 8, 8, { steps: 4, capK: 1 }), { fill: P.woodL, shade: 0.4, inkW: 1.1, cast: false, tex: 'bark' + seed, texOp: 0.6 });
  f.bone('hand_f');
  claw(add(WF, [12, -16]), ang(EF, WF) - 0.3, 31, skinF, { curl: 0.7 });

  // ---- far leg, stepping back, the knee locked
  leg(HF, KF, AF, 58, 70, 48, '_f', SK({ fill: skinF }));
  f.bone('foot_f');
  W.mudSplats(f, add(AF, [12, 30]), 30, 10, 6, P.peatD);

  // ---- torso: shrunk tight on the ribs, flattened on the far side, twisted over the hips
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.3, 0.4], [0.03, 0.56, 0.74], [0.15, 0.86, 0.84], [0.29, 0.98, 0.76], [0.45, 0.88, 0.6], [0.62, 0.72, 0.5], [0.78, 0.64, 0.5], [0.92, 0.68, 0.6], [1.04, 0.66, 0.6], [1.14, 0.52, 0.46]]);
  const torsoD = f.part(torso, SK());
  f.flat(torsoD, `url(#leather${seed})`, { op: 0.8 }); // the leather crackle
  // flattened plane on the far side of the chest: a pressed facet with a hard crease
  f.flat([S.at(0.14, 0.12), S.at(0.6, 0.16), S.at(0.52, 0.3), S.at(0.5, 0.42), S.at(0.3, 0.38), S.at(0.12, 0.4)], mix(skin, '#fff', 0.14), { op: 0.16, k: 0.6 });
  f.line([S.at(0.12, 0.12), S.at(0.16, 0.26), S.at(0.12, 0.42)], 1.6, INK, { op: 0.6 });
  // ribs showing through the leather, collarbone, sunken belly
  // ribs shrunk under the leather: each one a lit ridge over a dark groove, sweeping down to the front; the costal arch
  for (let i = 0; i < 6; i++) { const v = 0.14 + i * 0.075; W.crease(f, [S.at(-0.36, v + 0.02), S.at(-0.04, v - 0.015), S.at(0.3 - i * 0.03, v + 0.02), S.at(0.5 - i * 0.05, v + 0.07)], 4.2, { col: '#1e120c', lit: '#b88a5e', lip: 3.4, op: 0.8 }); }
  W.crease(f, [S.at(0.5, 0.2), S.at(0.38, 0.46), S.at(0.16, 0.6)], 3.4, { col: '#1e120c', lit: '#b88a5e', lip: 3 }); // the costal arch
  f.stroke([S.at(0.0, 0.03), S.at(0.3, 0.04), S.at(0.56, 0.1)], 2.6, '#2a1a14');
  f.flat([S.at(-0.1, 0.56), S.at(0.4, 0.54), S.at(0.38, 0.74), S.at(-0.05, 0.78)], '#2a1a14', { op: 0.45 }); // sunken belly
  f.line([S.at(0.32, 0.6), S.at(0.36, 0.7), S.at(0.32, 0.8)], 1.2, INK, { op: 0.5 });
  // the twist: skin dragged in diagonal folds across the waist
  for (let i = 0; i < 3; i++) f.stroke([S.at(-0.5 + i * 0.12, 0.66 + i * 0.05), S.at(-0.1 + i * 0.1, 0.78 + i * 0.04), S.at(0.3 + i * 0.05, 0.86 + i * 0.03)], 2, '#2a1a14');
  // spine knobs down the hump
  for (let i = 0; i < 8; i++) { const q = S.at(-0.5 + Math.sin(i) * 0.02, 0.12 + i * 0.09); f.part(ell(q, 4.5, 3.5, 0, 8), SK({ inkW: 0.9, inkHeavy: 1.2, cast: false, shade: 0.5, tex: undefined })); }
  // peat-pressed flattened patch on the back, a hazel stake snapped off in it (bodies were pinned down)
  f.flat([S.at(-0.6, 0.34), S.at(-0.2, 0.32), S.at(-0.22, 0.54), S.at(-0.62, 0.56)], '#2a1a14', { op: 0.3 });
  const stk = S.at(-0.36, 0.44);
  f.part([add(stk, [-6, -4]), add(stk, [5, -6]), add(stk, [-26, -42]), add(stk, [-34, -40, 1]), add(stk, [-37, -46, 1]), add(stk, [-26, -30])], { fill: P.woodL, shade: 0.45, inkW: 1.2, tex: 'bark' + seed, texOp: 0.6, sharp: true });
  f.flat(ell(stk, 7, 5, 0.3, 8), '#1a0e08');
  f.line([add(stk, [-6, 4]), add(stk, [-2, 14])], 1.2, '#3a1a10', { op: 0.8 });
  // leather sheen along the lit edges (bog bodies shine like oiled hide)
  f.line([S.at(0.6, 0.18), S.at(0.62, 0.34), S.at(0.5, 0.5)], 2, '#c09468', { op: 0.5 });
  f.line([S.at(-0.2, 0.02), S.at(0.2, 0.0)], 1.6, '#c09468', { op: 0.5 });
  // toxin: blisters and moss in the hollows, peeling leather
  W.pustules(f, S.at(-0.3, 0.66), 12, 14, 4, 3, 6, { burst: 0.4 });
  W.mossClump(f, S.at(0.0, 0.96), 18, 7);
  for (const q of [S.at(0.22, 0.62), S.at(-0.2, 0.3)]) { f.flat([q, add(q, [12, -2]), add(q, [10, 8]), add(q, [3, 7])], P.tanL, { op: 0.85 }); f.line([q, add(q, [12, -2])], 0.9, INK, { op: 0.7 }); }

  // ---- scrap of hide cape over the hump, tied at the throat, ragged
  f.bone('cape');
  const capeP = [S.at(-0.32, -0.08), S.at(0.12, -0.04), S.at(-0.06, 0.1), S.at(-0.42, 0.24), [...S.at(-0.52, 0.36), 1], S.at(-0.62, 0.3), [...S.at(-0.78, 0.36), 1], S.at(-0.84, 0.2), S.at(-0.7, 0.02)];
  f.part(capeP, { fill: P.peatL, shadow: '#20160e', tex: 'peat' + seed, texOp: 0.7, shade: 0.4 });
  f.stitches([S.at(-0.66, 0.06), S.at(-0.56, 0.18), S.at(-0.56, 0.3)], P.bone, 0.9);
  f.flat(ell(S.at(-0.48, 0.12), 7, 5, 0.4, 8), '#1a120a', { op: 0.8 }); // a hole worn through
  // a crop of toadstools fruiting through the hide on the hump
  W.toadstools(f, S.at(-0.6, 0.06), -1.75, 26, 3);

  // ---- the noose's cut end: from the knot at the nape over the hump, then hanging plumb behind the back
  f.bone('noose');
  // lies on the outline: over the top of the hump to the back's outermost point, then plumb
  const up = torso.filter(q => q[1] < 470), far = up.reduce((a, q) => q[0] < a[0] ? q : a), top = up.filter(q => q[0] < nape[0] - 20 && q[0] > far[0] + 20).reduce((a, q) => q[1] < a[1] ? q : a);
  const drop = add(far, [-5, 4]);
  W.rope(f, [nape, add(lerp(nape, top, 0.5), [0, -9]), add(top, [0, -5]), add(lerp(top, far, 0.5), [-6, -4]), drop, add(drop, [-1, 70]), add(drop, [1, 140]), add(drop, [4, 196])], 7, { fray: true });

  // ---- head thrust up on a stretched, twisted neck; flattened skull, lips shrunk off the teeth
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-6, 14]), hF([[-0.08, 0.42]])[0]], [50, 38]), SK());
  f.line([add(neck0, [12, 8]), hF([[0.08, 0.44]])[0]], 1.6, '#2a1a14', { op: 0.8 }); // neck tendon
  f.line([add(neck0, [-8, 2]), hF([[-0.18, 0.36]])[0]], 1.2, '#2a1a14', { op: 0.6 });
  B.head(f, HC, H, hA, {
    skin, jaw: 1.15, chin: -0.02, nose: 0.85, hook: 0.3, mouth: 'snarl', squint: 0.72, browDown: 0.05, faceShade: 0.9, jawShade: 0.6, gaunt: true, age: true,
    iris: '#120a06', eyeWhite: '#6a5a3a', hairCol: P.hairRed, browCol: '#4a2414',
    hairBack: [[-0.42, 0.12], [-0.46, -0.16], [-0.38, -0.4], [-0.16, -0.52], [-0.24, -0.2], [-0.3, 0.1]],
    hair: [[-0.4, 0.06], [-0.42, -0.2], [-0.32, -0.42], [-0.1, -0.53], [0.12, -0.55], [0.28, -0.46], [0.2, -0.4], [0.06, -0.44], [-0.08, -0.38], [-0.18, -0.24], [-0.24, -0.06], [-0.28, 0.08]],
    hairLines: [[[-0.3, -0.38], [-0.1, -0.48], [0.14, -0.5]], [[-0.36, -0.2], [-0.2, -0.38], [0.0, -0.44]], [[-0.38, 0.0], [-0.3, -0.2]]],
  });
  // topknot of red hair, twisted and tied (the bog kept it)
  f.part(hF(ell([-0.3, -0.56], 0.11, 0.08, -0.7, 10)), { fill: P.hairRed, shade: 0.4, tex: 'hatch' + seed, texOp: 0.3 });
  f.line(hF([[-0.38, -0.52], [-0.3, -0.62], [-0.22, -0.6]]), 1, '#b0684a', { op: 0.6 });
  f.line(hF([[-0.26, -0.5], [-0.3, -0.58]]), 2.2, P.rope);
  // skull flattened by the peat: a pressed facet and crease over the brow
  f.flat(hF([[-0.02, -0.46], [0.22, -0.44], [0.3, -0.3], [0.08, -0.3]]), '#2a1a14', { op: 0.35 });
  f.line(hF([[-0.04, -0.4], [0.14, -0.34], [0.3, -0.31]]), 1.2, INK, { op: 0.55 });
  // retracted lips: teeth bared to the gum
  for (let i = 0; i < 5; i++) { const x = 0.18 + i * 0.026; f.flat(hF([[x, 0.272], [x + 0.022, 0.27], [x + 0.02, 0.3 + (i % 2) * 0.008], [x + 0.002, 0.302]]), '#c8b890'); }
  f.line(hF([[0.17, 0.268], [0.25, 0.258], [0.32, 0.27]]), 1.4, '#5a2a1c');
  f.line(hF([[0.06, 0.2], [0.13, 0.26], [0.16, 0.34]]), 1.1, INK, { op: 0.6 }); // the shrunk cheek pulled back
  // the noose loop biting into the throat, knotted at the nape
  W.rope(f, [hF([[0.12, 0.5]])[0], hF([[-0.05, 0.56]])[0], add(nape, [8, 6]), nape], 7);
  f.part(ell(nape, 12, 10, 0.4, 10), { fill: P.rope, shade: 0.45, inkW: 1.3, tex: 'hatch' + seed, texOp: 0.5, cast: false });
  f.line([add(nape, [-6, -4]), add(nape, [6, 4])], 1, INK, { op: 0.6 });

  // ---- near leg, stepping forward, nearly straight
  leg(HN, KN, AN, 60, 74, 50, '_n', SK());
  f.bone('thigh_n');
  f.flat(ell(lp(HN, KN, 0.5, 6), 9, 14, -0.3, 8), P.tanL, { op: 0.4 }); // peeled patch
  f.line([lp(HN, KN, 0.42, 4), lp(HN, KN, 0.58, 8)], 0.9, INK, { op: 0.6 });
  f.bone('shin_n');
  f.line([lp(KN, AN, 0.2, 10), lp(KN, AN, 0.8, 6)], 1.2, '#2a1a14', { op: 0.6 }); // shin bone edge under the leather
  f.bone('foot_n');
  W.mudSplats(f, add(AN, [20, 30]), 34, 10, 7, P.peatD);

  // ---- hide belt thong round the hips, knotted, the ends hanging; a loin flap of rotted wool front and back
  f.bone('pelvis');
  const bl = S.at(-0.68, 0.93), br = S.at(0.62, 0.95), bk = S.at(0.5, 0.97);
  f.part([bl, add(bl, [22, 0]), add(bl, [26, 46]), [...add(bl, [14, 76]), 1], add(bl, [6, 58]), [...add(bl, [-6, 66]), 1], add(bl, [-8, 30])], { fill: P.woolD, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' });
  f.part([add(bl, [0, -6]), add(br, [0, -6]), add(br, [0, 6]), add(bl, [0, 6])], { fill: P.peatL, shade: 0.4, inkW: 1.2, tex: 'peat' + seed, texOp: 0.4 });
  f.part(ell(bk, 8, 7, 0, 10), { fill: P.peat, shade: 0.4, inkW: 1.1, cast: false });
  f.stroke([add(bk, [-4, 4]), add(bk, [-6, 32]), add(bk, [-12, 56])], 4, P.peatL); f.stroke([add(bk, [4, 4]), add(bk, [12, 26]), add(bk, [14, 42])], 3.4, P.peat);
  f.bone('loin');
  const lf = S.at(0.1, 0.95);
  f.part([add(lf, [-4, -2]), add(lf, [46, 0]), add(lf, [52, 44]), [...add(lf, [44, 84]), 1], add(lf, [32, 66]), [...add(lf, [22, 90]), 1], add(lf, [12, 66]), [...add(lf, [-2, 78]), 1], add(lf, [-6, 40])], { fill: P.wool, tex: 'weave' + seed, texOp: 0.55, shadow: '#20180e' });
  f.stroke([add(lf, [12, 14]), add(lf, [16, 44]), add(lf, [12, 64])], 2);
  f.flat(ell(add(lf, [30, 36]), 6, 5, 0, 8), '#140e08', { op: 0.85 }); // moth hole

  // ---- near arm: hanging forward off the dropped shoulder, claw open
  arm(SN, EN, WN, [54, 44, 34], '_n', SK(), { bp: [[0, 0.4, 0.1]], bq: [[1, 0.3, 0.12]] });
  f.bone('upperarm_n');
  f.part(ell(lp(SN, EN, 0.06, 2), 30, 26, ang(SN, EN), 16), SK({ cast: false })); // deltoid cap over the shoulder
  f.line([lp(SN, EN, -0.1, 18), lp(SN, EN, 0.12, 22), lp(SN, EN, 0.3, 18)], 1.6, '#c09468', { op: 0.55 }); // leather sheen
  W.mossClump(f, lp(SN, EN, 0.3, 12), 11, 6);
  f.bone('forearm_n');
  W.pustule(f, lp(EN, WN, 0.5, -4), 5);
  f.bone('hand_n');
  claw(add(WN, [12, 18]), ang(EN, WN) + 0.15, 33, skin);

  // peat water round the feet: on the ground, so on no bone
  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 44]), 44, 5, 0, 14), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ FEN HAG (cast, human 0.85)
// The village wise-woman who knows the safe path and keeps it. Crouched low in sodden shawls, the near hand on a
// testing pole planted ahead of her in the mud, the far hand hanging by her knees with a fistful of foul mud. A lantern
// hangs from her belt at the back hip, a bag of herbs at the front, dripping. Sharp face in a hood, a knowing smile.
// Rig: standard humanoid + pole (hand_n), lantern and bag (pelvis), shawl (torso), skirt (pelvis).
// Motion: idle tapping the pole; attack throwing the fistful of mud (far arm up and over).
function fenHag() {
  const f = new Fig(W.base(205, 820, { grimeY: 580 }));
  W.textures(f);
  const H = 85, seed = 205;
  const SK = (o = {}) => W.SKH(f, o);
  const N = [352, 444], C = [286, 470], Pv = [292, 590];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.25, 0.16), SF = S.at(0.45, 0.08);
  const pole0 = [456, 788], pole1 = [432, 286], pA = ang(pole0, pole1);
  const gN = lerp(pole0, pole1, 0.62), EN = [374, 522];
  const EF = [390, 528], WF = [394, 598];
  const HN = [298, 606], KN = [404, 638], AN = [364, 746];
  const HF = [282, 600], KF = [372, 626], AF = [318, 748];
  const HC = [394, 402], hA = 0.12, neck0 = [356, 446];
  const belt = v => S.at(v, 0.9);

  f.joint('pelvis', Pv).joint('torso', S.at(0, 0.86), 'pelvis').joint('head', neck0, 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', gN, 'forearm_n').joint('pole', gN, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('lantern', add(belt(-0.62), [0, 4]), 'pelvis').joint('bag', belt(0.55), 'pelvis').joint('shawl', S.at(-0.3, 0.02), 'torso').joint('skirt', S.at(0, 0.92), 'pelvis');

  const leg = (Hp, Kn, A, s, wH, wK, sfx, look) => {
    const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => W.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, { thigh: 0.04 }), [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, [side(Kn, dk, wK * 0.6), side(A, mul(da, -1), 18)]], ['foot' + sfx, side(A, da, 18)]]);
  };
  // rag wraps spiralling round a shin, a loose end hanging
  const wraps = (Kn, A, w, n) => { for (let i = 0; i < n; i++) { const t = 0.16 + i * 0.66 / n; f.part([lp(Kn, A, t, -w / 2 - 2), lp(Kn, A, t + 0.03, w / 2 + 2), lp(Kn, A, t + 0.09, w / 2 + 1), lp(Kn, A, t + 0.06, -w / 2 - 1)], { fill: mix(P.sack, '#2a2016', i * 0.08), tex: 'weave' + seed, texOp: 0.5, shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false }); } };
  const arm = (S0, E0, W0, ws, sfx, look, o = {}) => {
    const de = elb(S0, E0, W0);
    split(f, () => W.fullArm(f, S0, E0, W0, ws[0], ws[1], ws[2], look, o), [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
  };

  // ---- far upper arm, behind the body
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 40, 36), { fill: P.woolD, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' });

  // ---- skirt, back half (behind the legs), sackcloth soaked dark at the hem
  f.bone('skirt');
  f.part([belt(-0.7), belt(0.5), [400, 636], [380, 700], [300, 712, 1], [262, 700], [236, 664], [226, 612]], { fill: mix(P.sack, '#000', 0.25), tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' });

  // ---- legs: deep crouch, rag-bound shins, bare muddy feet
  leg(HF, KF, AF, 50, 58, 40, '_f', SK({ fill: mix(P.hag, '#3a2a20', 0.2) }));
  f.bone('shin_f'); wraps(KF, AF, 36, 4);
  leg(HN, KN, AN, 52, 62, 42, '_n', SK());
  f.bone('shin_n'); wraps(KN, AN, 38, 4);
  f.stroke([lp(KN, AN, 0.74, 20), lp(KN, AN, 0.86, 30), lp(KN, AN, 0.98, 26)], 5, P.sack); // loose end of the wrap
  f.bone('foot_n'); W.mudSplats(f, add(AN, [26, 32]), 34, 8, 7, P.peatD);
  f.bone('foot_f'); W.mudSplats(f, add(AF, [20, 32]), 30, 8, 6, P.peatD);

  // ---- body under the shawls
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.4, 0.4], [0.06, 0.72, 0.62], [0.24, 0.84, 0.7], [0.46, 0.8, 0.66], [0.66, 0.76, 0.66], [0.86, 0.8, 0.7], [1.0, 0.78, 0.66]]);
  f.part(torso, { fill: P.woolD, tex: 'weave' + seed, texOp: 0.55, shadow: '#1e160e' });
  // crossed under-shawl over the chest, knotted
  f.part([S.at(-0.1, 0.06), S.at(0.62, 0.1), S.at(0.7, 0.4), S.at(0.3, 0.62), S.at(0.0, 0.5)], { fill: P.wool, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' });
  f.stroke([S.at(0.6, 0.14), S.at(0.4, 0.34), S.at(0.24, 0.56)], 2.2);
  f.part(ell(S.at(0.44, 0.5), 9, 7, 0.4, 10), { fill: P.wool, shade: 0.45, inkW: 1.2, cast: false, tex: 'weave' + seed });
  f.part([S.at(0.2, 0.6), S.at(0.3, 0.6), S.at(0.38, 0.86), S.at(0.26, 0.9)], { fill: P.wool, inkW: 1.1, cast: false, shade: 0.4 });

  // ---- skirt front over the thighs, hem wet and black with mud
  f.bone('skirt');
  const sk = [belt(-0.7), belt(0.55), [404, 612], [428, 640], [420, 666, 1], [404, 660], [392, 690, 1], [366, 680], [342, 704, 1], [318, 688], [290, 708, 1], [262, 690], [238, 662], [228, 616]];
  f.part(sk, { fill: P.sack, tex: 'weave' + seed, texOp: 0.55, shadow: '#241a10' });
  f.flat([[428, 640], [420, 666], [404, 660], [392, 690], [366, 680], [342, 704], [318, 688], [290, 708], [262, 690], [244, 668], [320, 664], [410, 640]], P.peatD, { op: 0.55 }); // wet dark hem
  f.stroke([[370, 612], [384, 640], [386, 676]], 2.2); f.stroke([[320, 616], [326, 650], [318, 690]], 2.2); f.stroke([[268, 620], [262, 660], [266, 694]], 2); f.stroke([[392, 616], [412, 628], [424, 640]], 2);
  f.part([[300, 632], [324, 630], [326, 656], [302, 658]], { fill: mix(P.wool, '#000', 0.1), sharp: true, inkW: 1.1, tex: 'weave' + seed }); // patch
  f.stitches([[300, 632], [324, 630], [326, 656], [302, 658], [300, 632]], P.bone, 0.8);
  for (const p of [[404, 662], [366, 682], [318, 690], [262, 692]]) W.drip(f, p, 0.9, P.peatD);

  // ---- rope belt
  f.bone('pelvis');
  W.rope(f, [belt(-0.74), belt(-0.2), belt(0.3), belt(0.66)], 5);
  // ---- the bag of herbs at the front hip, dripping
  f.bone('bag');
  const bg = add(belt(0.55), [6, 0]);
  f.line([bg, add(bg, [4, 16])], 3, P.ropeD);
  W.herbBundle(f, add(bg, [-6, 2]), -0.35, 36); W.herbBundle(f, add(bg, [8, 6]), 0.2, 30);
  f.part([add(bg, [-16, 14]), add(bg, [24, 12]), add(bg, [30, 44]), add(bg, [20, 66]), add(bg, [-4, 68]), add(bg, [-20, 50])], { fill: P.peatL, tex: 'peat' + seed, texOp: 0.6, shadow: '#20160e' });
  f.part([add(bg, [-18, 12]), add(bg, [26, 10]), add(bg, [26, 22]), add(bg, [-18, 24])], { fill: P.peat, shade: 0.4, inkW: 1.2, tex: 'peat' + seed, texOp: 0.5 });
  f.flat(ell(add(bg, [10, 52]), 10, 7, 0.3, 10), P.bileD, { op: 0.7 }); // seeping stain
  W.drip(f, add(bg, [8, 66]), 1.2); W.drip(f, add(bg, [16, 82]), 0.8);

  // ---- far forearm and the fistful of mud, hanging in front of the knees
  arm(EF, lerp(EF, WF, 0.5), WF, [36, 33, 28], '_f', SK({ fill: mix(P.hag, '#3a2a20', 0.15) }));
  f.bone('forearm_f');
  f.part(ragLimb2(f, EF, lp(EF, WF, 0.3, 0), 42, 40), { fill: P.woolD, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' }); // sleeve end
  f.bone('hand_f');
  const mudC = add(WF, [10, 30]);
  B.fist(f, add(WF, [4, 12]), ang(EF, WF), 24, mix(P.hag, '#3a2a20', 0.15), { shadow: P.hagS });
  // the fistful of foul mud squeezing out between the fingers and below the fist
  f.part([add(mudC, [-22, -10]), add(mudC, [-4, -6]), add(mudC, [20, -16]), add(mudC, [28, 2]), add(mudC, [16, 20]), add(mudC, [-2, 26]), add(mudC, [-20, 14])], { fill: '#3e3020', tex: 'peat' + seed, texOp: 0.7, shadow: '#140e08', light: '#6e5a3a' });
  f.flat(ell(add(mudC, [6, 6]), 9, 6, 0.3, 8), P.bileD, { op: 0.6 }); f.flat(ell(add(mudC, [-6, 10]), 5, 3, 0, 6), '#8a7a58', { op: 0.6 });
  W.mudSplats(f, add(WF, [4, 20]), 16, 12, 6, P.peatD);
  for (const d of [[-10, 34], [8, 40], [18, 30]]) W.drip(f, add(mudC, d), 1.1, P.peatD);
  W.pustule(f, add(mudC, [-14, 10]), 4); // something in the mud has already gone bad

  // ---- shawl over the back and shoulders: heavy, sodden, ragged hem, drips
  f.bone('shawl');
  const sh = [S.at(-0.2, -0.12), S.at(0.5, -0.04), S.at(0.7, 0.14), S.at(0.5, 0.28), S.at(0.1, 0.34), S.at(-0.3, 0.6), [...S.at(-0.52, 0.8), 1], S.at(-0.72, 0.7), [...S.at(-0.96, 0.82), 1], S.at(-1.0, 0.56), S.at(-0.98, 0.3), S.at(-0.8, 0.04)];
  f.part(sh, { fill: P.peat, tex: 'weave' + seed, texOp: 0.5, shadow: '#1a120a' });
  f.stroke([S.at(-0.4, 0.06), S.at(-0.6, 0.3), S.at(-0.62, 0.6)], 2.4); f.stroke([S.at(0.0, 0.06), S.at(-0.2, 0.3), S.at(-0.34, 0.5)], 2.2); f.stroke([S.at(-0.8, 0.14), S.at(-0.88, 0.4)], 2);
  W.fringe(f, [S.at(-0.4, 0.68), S.at(-0.56, 0.78), S.at(-0.74, 0.72), S.at(-0.9, 0.8)], 26, 7, P.peat);
  for (const v of [[-0.52, 0.82], [-0.95, 0.86]]) W.drip(f, S.at(v[0], v[1]), 1, P.peatD);
  // charms on the shawl: a bone and a dried frog on cords
  f.line([S.at(-0.6, 0.38), S.at(-0.64, 0.5)], 1.2, P.ropeD); W.boneCharm(f, S.at(-0.64, 0.5), S.at(-0.66, 0.62), 6);
  f.line([S.at(-0.82, 0.3), S.at(-0.86, 0.42)], 1.2, P.ropeD); W.driedFrog(f, S.at(-0.86, 0.5), 26, 0.1);
  W.mossClump(f, S.at(-0.6, 0.12), 14, 6);

  // ---- head in a hood: sharp face, wet grey hair, a knowing smile
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-4, 10]), hF([[-0.08, 0.42]])[0]], [40, 32]), SK());
  // hood back and lining (behind the face)
  f.part(hF([[-0.62, 0.62], [-0.66, 0.1], [-0.56, -0.38], [-0.24, -0.66], [0.16, -0.7], [0.42, -0.52], [0.5, -0.3], [0.4, -0.22], [0.2, -0.46], [-0.1, -0.5], [-0.3, -0.3], [-0.36, 0.1], [-0.3, 0.5]]), { fill: P.peat, tex: 'weave' + seed, texOp: 0.5, shadow: '#1a120a' });
  f.flat(hF([[0.36, -0.28], [0.18, -0.46], [-0.1, -0.5], [-0.3, -0.3], [-0.36, 0.1], [-0.3, 0.5], [-0.24, 0.1], [-0.18, -0.24], [0.04, -0.38]]), '#140e08', { op: 0.55 });
  B.head(f, HC, H, hA, {
    skin: P.hag, jaw: 0.95, chin: 0.07, nose: 1.12, hook: 0.25, mouth: 'smirk', squint: 0.5, browDown: 0.05, faceShade: 0.55, jawShade: 0.5, gaunt: true, age: true, noEar: true, lips: true,
    iris: '#2a2418', eyeWhite: '#c8c0a4', glint: true, hairCol: '#8a8a80', browCol: '#6a6a62',
  });
  f.line(hF([[0.17, 0.27], [0.12, 0.24]]), 1.1, INK, { op: 0.6 }); // the hitched corner of the smile
  f.part(hF(ell([0.3, 0.06], 0.035, 0.03, 0, 8)), { fill: mix(P.hag, '#6a4a3a', 0.3), inkW: 0.9, cast: false, shade: 0.4 }); // wart on the nose
  // wet grey hair, plastered strands hanging plumb from under the hood
  f.part(hF([[-0.3, 0.3], [-0.32, -0.1], [-0.2, -0.36], [0.06, -0.42], [0.26, -0.34], [0.3, -0.24], [0.12, -0.26], [0.0, -0.2], [-0.14, -0.04], [-0.2, 0.28]]), { fill: '#8a8a80', tex: 'hatch' + seed, texOp: 0.35, shade: 0.4, shadow: '#3e3e38' });
  for (const [u, v, l, sw] of [[-0.26, 0.2, 70, -4], [-0.18, 0.26, 56, 3], [-0.08, 0.3, 40, 2]]) { const p = hF([[u, v]])[0]; f.stroke([p, add(p, [sw * 0.4, l * 0.4]), add(p, [sw, l * 0.75]), add(p, [sw * 0.6, l])], 6, '#7a7a70'); f.line([p, add(p, [sw * 0.4 - 1.5, l * 0.4]), add(p, [sw - 1.5, l * 0.7])], 1, '#c8c8be', { op: 0.6 }); W.drip(f, add(p, [sw * 0.6, l + 2]), 0.7, '#8a9a9a'); }
  // hood rim framing the face, peaked over the brow
  f.part(hF([[0.5, -0.3], [0.42, -0.54], [0.14, -0.72], [-0.22, -0.68], [-0.5, -0.44], [-0.54, -0.36], [-0.24, -0.56], [0.12, -0.6], [0.36, -0.46], [0.44, -0.26]]), { fill: P.peatL, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e140c', shade: 0.4 });
  f.part(hF([[-0.52, 0.04], [-0.3, 0.52], [-0.06, 0.74], [0.3, 0.8], [0.44, 0.66], [0.2, 0.64], [-0.08, 0.56], [-0.32, 0.3]]), { fill: P.peat, tex: 'weave' + seed, texOp: 0.5, shadow: '#1a120a' }); // hood drape under the chin
  f.stitches(hF([[0.4, -0.42], [0.14, -0.62], [-0.2, -0.6]]), P.boneD, 0.8);

  // ---- the testing pole, planted ahead of her in the mud
  f.bone('pole');
  f.part(limb(pole0, pole1, 15, 12, { steps: 10 }), { fill: P.wood, tex: 'wood' + seed, shadow: P.woodD });
  f.line([lp(pole0, pole1, 0.04, 3), lp(pole0, pole1, 0.97, 3)], 1, P.woodL, { op: 0.6, straight: true });
  for (const t of [0.66, 0.7]) f.line([lp(pole0, pole1, t, -8), lp(pole0, pole1, t + 0.012, 8)], 3, P.ropeD, { straight: true }); // grip binding
  f.flat([lp(pole0, pole1, 0.0, -9), lp(pole0, pole1, 0.0, 9), lp(pole0, pole1, 0.16, 8), lp(pole0, pole1, 0.2, -2), lp(pole0, pole1, 0.14, -8)], P.peatD, { op: 0.85 }); // mud line on the pole
  for (const t of [0.24, 0.34, 0.45]) f.line([lp(pole0, pole1, t, -7), lp(pole0, pole1, t, 7)], 1.4, '#c8b890', { op: 0.75, straight: true }); // depth notches cut in it
  W.toadstools(f, lp(pole0, pole1, 0.94, 6), pA + 1.2, 16, 2); // a crop of tiny caps fruiting from the wet top
  f.line([lp(pole0, pole1, 0.86, 4), lp(pole0, pole1, 0.86, 22), add(lp(pole0, pole1, 0.86, 24), [0, 30])], 1.3, P.ropeD); W.boneCharm(f, add(lp(pole0, pole1, 0.86, 24), [0, 30]), add(lp(pole0, pole1, 0.86, 24), [2, 44]), 5);

  // ---- near arm, the hand on the pole
  arm(SN, EN, gN, [44, 36, 28], '_n', { fill: P.woolD, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' });
  f.bone('forearm_n');
  f.part(limb(lp(EN, gN, 0.62, 0), lp(EN, gN, 0.92, 0), 26, 24, { capA: false }), SK({ cast: false })); // bare wrist past the sleeve
  f.part(ragLimb2(f, EN, lp(EN, gN, 0.66, 0), 40, 42), { fill: P.woolD, tex: 'weave' + seed, texOp: 0.5, shadow: '#1e160e' });
  f.bone('hand_n');
  B.grip(f, gN, EN, pA, 24, P.hag, { shadow: P.hagS, tex: 'mottle' + seed, texOp: 0.5, name: 'hag pole' });

  // ---- the lantern on its cord from the belt at the back hip, hanging plumb
  f.bone('lantern');
  const lt = add(belt(-0.62), [0, 4]);
  f.line([lt, add(lt, [1, 30])], 2.2, P.ropeD);
  W.lantern(f, add(lt, [1, 30]), 46, { glowOp: 0.1 });

  f.bone('root');
  for (const [a, w] of [[AN, 40], [AF, 36], [pole0, 30]]) f.flat(ell(add(a, [16, a === pole0 ? 0 : 44]), w, 5, 0, 14), P.waterL, { op: 0.4 });
  return f;
}
// a sleeve tube ending in a ragged hem at b (round at a)
function ragLimb2(f, a, b, wa, wb) { return K.ragLimb(f, a, b, wa, wb, { depth: 8, teeth: 6 }); }

// ------------------------------------------------------------------ MIRE TOAD (cast, small 0.6)
// A fen toad the size of a dog, fat on the poison. Independent review rebuild (the first build read as a round cartoon
// toad with a smile and tube legs): a flattened warty body much wider than tall, sagging to the mud, with a sacral hump
// over the hips; a broad wedge head with a lipless mouth line that runs back and turns down at the corner; the eyes set
// on top under bony cranial ridges, heavy-lidded, with a horizontal pupil; a kidney-shaped poison gland (parotoid)
// behind each eye, pitted with pores; hind legs folded in a muscular Z against the flank, with long webbed feet;
// short bent forelegs with knobbed fingers turned in. Skin blotched and warty, the warts in clusters with dark tips,
// bile-green poison sacs blistering the back. An eel-catcher's hook still rusting in its lip.
// Rig (its own): body (root) > head > jaw > throat, tongue (attached at the front of the lower jaw, folded back inside
// the closed mouth, flips out forward); legs leg_fn/ff/bn/bf _1.._3.
// Motion: idle a pulsing throat (scale on `throat`); attack a tongue strike (head up, jaw down, tongue flips out).
function mireToad() {
  const f = new Fig(W.base(206, 820, { grimeY: 640 }));
  W.textures(f);
  const seed = 206, gy = 790;
  const hide = '#5a4a2e', hideD = '#3a2e1c', hideL = '#7e6a44', belly = '#a8986e', bellyS = '#5a4a36';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#1e1810', shade: 0.38, tex: 'mottle' + seed, texOp: 0.75 }, o);
  const BL = (o = {}) => Object.assign({ fill: belly, shadow: bellyS, shade: 0.34, tex: 'wrinkle' + seed, texOp: 0.45 }, o);
  const wartC = mix(hide, '#9a8658', 0.35);
  // warts in clusters: raised glands of mixed size with a dark pore on the tip
  const wartsC = (c, rx, ry, n, r0, r1, col = wartC) => {
    const pts = []; for (let i = 0; i < n; i++) pts.push([W.scatter(f, c, rx, ry), r0 + f.r() * (r1 - r0)]);
    pts.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => { f.part(ell(p, r, r * 0.8, f.r() * 3, 9), { fill: col, shadow: '#3a2c1a', shade: 0.28, inkW: 0.8, inkHeavy: 1.3, cast: true, castOp: 0.18, hatch: false }); f.flat(ell(add(p, [r * 0.25, -r * 0.3]), r * 0.3, r * 0.22, 0, 6), '#e8dcb0', { op: 0.3 }); if (r > 4) f.flat(ell(add(p, [-r * 0.1, -r * 0.05]), r * 0.22, r * 0.18, 0, 6), '#140e08', { op: 0.8 }); });
  };
  const hinge = [414, 606], neck = [392, 580];
  // forelegs: shoulder, elbow (back), wrist (forward); hind legs: hip, knee (forward along the flank), heel (back)
  const FN = [[426, 640], [398, 716], [454, 768]], FF = [[452, 630], [438, 706], [500, 764]];
  const BN = [[150, 650], [292, 676], [156, 770]], BF = [[124, 640], [254, 658], [116, 764]]; // heels down on the mud, the long feet flat on it

  f.joint('body', [260, 680]).joint('head', neck, 'body').joint('jaw', hinge, 'head').joint('throat', [490, 616], 'head').joint('tongue', [548, 584], 'jaw');
  const legJ = (nm, L, par) => { f.joint(nm + '_1', L[0], par).joint(nm + '_2', L[1], nm + '_1').joint(nm + '_3', L[2], nm + '_2'); };
  legJ('leg_ff', FF, 'body'); legJ('leg_fn', FN, 'body'); legJ('leg_bf', BF, 'body'); legJ('leg_bn', BN, 'body');

  // a long webbed toad foot or a knobbed hand: digits fanning from c along dir; each digit a tapered chain with a
  // knuckle tubercle and a swollen tip; o.web stretches a membrane between them with a torn edge
  const digits = (c, dir, n, len, w, look, o = {}) => {
    const tips = [];
    for (let i = 0; i < n; i++) { const a = dir + (i - (n - 1) / 2) * (o.spread || 0.3), l = len * (o.lens ? o.lens[i] : 1), bend = (o.bend ?? 0.15) * (i - (n - 1) / 2) * 0.3; tips.push([c, add(c, rot([l * 0.55, 0], a)), add(c, rot([l, 0], a + bend)), a]); }
    if (o.web) { const web = [c]; tips.forEach(([, m, t], i) => { web.push(lerp(m, t, 0.55)); if (i < tips.length - 1) web.push(lerp(lerp(m, t, 0.4), lerp(tips[i + 1][1], tips[i + 1][2], 0.4), 0.5)); }); f.part(web, Object.assign({}, look, { fill: mix(look.fill, '#2a2016', 0.3), inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, shade: 0.25, k: 0.7 })); }
    for (const [c0, m, t] of tips) {
      f.part(K.chain([c0, m, t], [w, w * 0.7, w * 0.55], { steps: 6 }), Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.7, cast: false, k: 0.9 }));
      f.part(ell(m, w * 0.42, w * 0.34, 0, 8), Object.assign({}, look, { fill: mix(look.fill, '#c8b890', 0.15), inkW: 0.8, inkHeavy: 1, cast: false, hatch: false })); // knuckle tubercle
      f.part(ell(t, w * 0.36, w * 0.3, 0, 8), Object.assign({}, look, { fill: mix(look.fill, '#d8c8a0', 0.25), inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }));
      f.line([lerp(c0, m, 0.6), lerp(m, t, 0.4)], 0.8, INK, { op: 0.4 }); // crease along the digit
    }
  };
  // a muscular limb segment with a belly on one side, drawn as one chain so it swells and narrows
  const seg = (a, b, wa, wb, look, bulge = 0.18, side = 1) => f.part(limb(a, b, wa, wb, { steps: 14, capK: 0.95, p: [[0.42, side > 0 ? bulge : bulge * 0.35, 0.22], [0.85, -0.08, 0.1]], q: [[0.5, side < 0 ? bulge : bulge * 0.35, 0.24]] }), Object.assign({ k: 0.9 }, look));
  // lower segment and foot first, then the fat upper segment over it, so it covers the joint when the leg moves
  const leg3 = (nm, L, ws, look, foot, o = {}) => {
    f.bone(nm + '_2'); seg(L[1], L[2], ws[1], ws[2], look, o.b2 ?? 0.12, -1);
    f.bone(nm + '_3'); foot();
    f.bone(nm + '_1'); seg(L[0], L[1], ws[0], ws[1] * 1.05, look, o.b1 ?? 0.2, 1);
  };

  // ---- far legs (behind the body)
  leg3('leg_bf', BF, [84, 50, 30], HD({ fill: hideD }), () => digits(BF[2], 0.06, 5, 100, 14, HD({ fill: hideD }), { web: true, spread: 0.13, lens: [0.6, 0.85, 1.15, 1.0, 0.7] }));
  leg3('leg_ff', FF, [40, 34, 24], HD({ fill: hideD }), () => digits(add(FF[2], [4, 14]), 0.55, 4, 40, 11, HD({ fill: hideD }), { spread: 0.45 }));

  // ---- body: flattened, wider than tall, the sacral hump over the hips, the belly sagging onto the mud
  f.bone('body');
  const bodyP = [[44, 700], [52, 652], [90, 606], [150, 568], [214, 548], [262, 552], [316, 562], [370, 556], [414, 548], [444, 566], [452, 620], [446, 680], [420, 726], [370, 758], [290, 774], [200, 774], [120, 760], [66, 734]];
  const bodyD = f.part(bodyP, HD({ k: 0.9 }));
  // toad blotches: dark irregular patches with pale rims; the pale dorsal stripe; soft modelling of the flattened mass
  W.stains(f, bodyD, [30, 520, 470, 790], '#1e140a', 0.03, 4.4, -2.3, 3, 0.85, 3);
  W.stains(f, bodyD, [30, 520, 470, 790], '#a08a5a', 0.05, 4, -2.6, 7, 0.35, 3);
  W.softTone(f, bodyD, [[[[60, 700], [200, 740], [400, 720], [440, 760], [60, 780]], '#120e08', 0.55, 16], [[[120, 590], [220, 556], [330, 568], [420, 556], [330, 584], [220, 580]], '#c8b890', 0.3, 12]]);
  f.stroke([[110, 600], [200, 560], [300, 566], [400, 556]], 6, mix(hide, '#c8b890', 0.3), { op: 0.7 });
  f.part([[140, 760], [200, 774], [290, 774], [370, 758], [420, 726], [440, 700], [400, 740], [300, 762], [200, 764]], BL({ fill: mix(belly, hide, 0.35), cast: false })); // granular belly edge
  for (let i = 0; i < 5; i++) f.line([[200 + i * 44, 762 - i * 3], [214 + i * 44, 772 - i * 3]], 1, INK, { op: 0.45 }); // belly creases
  // skin folds: the dorsolateral ridge of warts, loose skin wrinkling over the shoulder and sagging at the flank
  W.creaseField(f, [380, 610], 40, 30, 5, 1.6, 40, 3, { lip: 2, lit: '#a08a5a', col: '#140e08' });
  W.creaseField(f, [180, 700], 80, 20, 5, 0.1, 60, 3, { lip: 2, lit: '#a08a5a', col: '#140e08' });
  // warts in clusters, a ridge of them along the back; bile-green poison sacs blistering the back
  for (let i = 0; i < 8; i++) wartsC([96 + i * 44, 590 - Math.sin(i * 0.5) * 22 + (i > 5 ? 10 : 0)], 14, 6, 3, 4, 9);
  for (const c of [[150, 640], [250, 620], [330, 650], [210, 700], [380, 690]]) wartsC(c, 26, 18, 6, 3, 8);
  wartsC([250, 650], 190, 90, 70, 1.6, 3.6, mix(hide, '#8a7a50', 0.25)); // the granular skin between the big warts
  for (const [c, r] of [[[190, 580], 9], [[262, 572], 11], [[330, 590], 8], [[230, 610], 6]]) W.pustule(f, c, r, { col: mix(P.bile, hide, 0.3) });
  W.pustule(f, [296, 604], 6, { burst: true });
  // a leech feeding on the flank; an old gash, healed lumpy
  f.part(limb([354, 700], [388, 720], 14, 10, { steps: 6, capK: 1, p: [[0.5, 0.25, 0.25]] }), { fill: P.leech, shade: 0.35, shadow: '#000', light: P.leechL, inkW: 1.1 });
  f.line([[360, 698], [384, 710]], 1.2, P.leechS, { op: 0.6 });
  f.line([[96, 660], [126, 678], [150, 676]], 3, mix(hide, '#c8b890', 0.3)); f.line([[96, 660], [126, 678], [150, 676]], 1, INK, { op: 0.7 });
  W.mudSplats(f, [250, 760], 160, 14, 12, P.peatD);

  // ---- near hind leg folded in a Z against the flank: the thigh forward, the shin folded back under it, the long
  // webbed foot forward on the ground
  leg3('leg_bn', BN, [96, 58, 36], HD(), () => digits(BN[2], 0.06, 5, 116, 15, HD(), { web: true, spread: 0.12, lens: [0.55, 0.8, 1.12, 1.0, 0.72] }), { b1: 0.26, b2: 0.16 });
  f.bone('leg_bn_1');
  for (const t of [0.3, 0.55, 0.8]) f.flat([lp(BN[0], BN[1], t - 0.06, 40), lp(BN[0], BN[1], t + 0.02, 42), lp(BN[0], BN[1], t + 0.07, -30), lp(BN[0], BN[1], t - 0.02, -32)], '#1e160c', { op: 0.55, k: 0.7 }); // dark crossbands
  f.line([lp(BN[0], BN[1], 0.15, 30), lp(BN[0], BN[1], 0.55, 36), lp(BN[0], BN[1], 0.9, 24)], 2.2, '#140e08', { op: 0.6 }); // the thigh muscle's edge
  f.line([lp(BN[0], BN[1], 0.2, -30), lp(BN[0], BN[1], 0.7, -24)], 1.8, hideL, { op: 0.5 });
  wartsC(lp(BN[0], BN[1], 0.5, 0), 34, 16, 7, 3, 6);
  W.creaseField(f, lp(BN[0], BN[1], 0.95, 0), 14, 18, 3, 1.4, 30, 2.5, { lip: 2, lit: '#a08a5a', col: '#140e08' }); // knee folds
  f.bone('leg_bn_2');
  for (const t of [0.35, 0.7]) f.flat([lp(BN[1], BN[2], t - 0.06, 26), lp(BN[1], BN[2], t + 0.04, 26), lp(BN[1], BN[2], t + 0.08, -20), lp(BN[1], BN[2], t - 0.02, -20)], '#1e160c', { op: 0.5, k: 0.7 });
  wartsC(lp(BN[1], BN[2], 0.5, 0), 40, 10, 6, 2, 4);
  f.bone('leg_bn_3');
  f.flat([add(BN[2], [74, 20]), add(BN[2], [94, 18]), add(BN[2], [88, 28])], '#14100a'); // a torn web
  W.mudSplats(f, add(BN[2], [60, 30]), 60, 8, 8, P.peatD);

  // ---- head, layer 1: the inside of the mouth (pale gums, dark gullet), seen only when the jaw drops
  f.bone('head');
  f.part([hinge, [460, 594], [520, 582], [566, 568], [562, 590], [520, 614], [460, 626], [424, 620]], { fill: '#c49a80', shadow: '#6a3a2e', shade: 0.4, inkW: 1.2, cast: false });
  f.flat([[424, 606], [470, 598], [490, 614], [446, 622]], '#1a0c08', { op: 0.9 });
  // ---- lower jaw: a hard lipless edge, then the throat sac bulging under it
  f.bone('jaw');
  const jawP = [add(hinge, [-4, -6]), [460, 600], [520, 588], [566, 572], [574, 576], [568, 592], [540, 608], [490, 622], [440, 628], [410, 620]];
  f.part(jawP, HD({ fill: mix(belly, hide, 0.6), shade: 0.25 }));
  f.line([[426, 612], [480, 604], [540, 590], [568, 578]], 1.6, '#140e08', { op: 0.6 }); // the jaw's bony edge
  f.bone('throat');
  const thD = f.part([[430, 622], [480, 624], [530, 612], [556, 600], [562, 620], [548, 646], [510, 662], [462, 662], [432, 650], [420, 636]], BL({ fill: mix(mix(belly, hide, 0.4), P.bileL, 0.12), tex: 'wrinkle' + seed, texOp: 0.5 }));
  W.stains(f, thD, [410, 590, 580, 700], '#3a2c1a', 0.06, 4, -2.4, 13, 0.6, 3);
  W.softTone(f, thD, [[[[426, 626], [556, 604], [540, 630], [440, 640]], '#140e08', 0.6, 6]]);
  f.flat([[470, 652], [506, 644], [534, 648], [506, 658]], '#fff', { op: 0.1 }); // stretched sheen
  for (let i = 0; i < 6; i++) f.line([[440 + i * 20, 630], [446 + i * 20, 658 - Math.abs(i - 2.5) * 5]], 0.9, INK, { op: 0.35 }); // throat pleats
  wartsC([496, 650], 46, 8, 10, 1.4, 3, mix(belly, '#6a5a3a', 0.3));

  // ---- tongue: attached at the front of the lower jaw, folded back inside the closed mouth (hidden by the skull)
  f.bone('tongue');
  f.part([[550, 582], [520, 584], [480, 590], [450, 596], [440, 602], [452, 606], [486, 600], [522, 594], [552, 590]], { fill: '#b8786a', shadow: '#5a2a24', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false });
  f.part(ell([444, 602], 10, 7, 0, 10), { fill: '#c8887a', shadow: '#5a2a24', shade: 0.35, inkW: 1, cast: false, hatch: false }); // the sticky tip
  f.flat(ell([446, 599], 4, 2, 0, 6), '#f0d8c8', { op: 0.7 });

  // ---- head, layer 2: the broad wedge skull, the down-turned mouth line, eyes on top, the poison gland behind them
  f.bone('head');
  const headP = [[404, 624], [392, 572], [400, 540], [428, 518], [456, 500], [484, 482], [514, 480], [538, 494], [556, 514], [572, 540], [580, 560], [574, 572], [540, 588], [490, 602], [444, 612], [418, 622]];
  const headD = f.part(headP, HD({ k: 0.9, shade: 0.16 })); // a thin cel band: a thick one along the mouth line read as a grin
  W.stains(f, headD, [380, 460, 590, 640], '#22180c', 0.07, 4, -2.6, 11, 0.5, 3);
  W.softTone(f, headD, [[[[400, 590], [480, 604], [574, 576], [540, 600], [420, 626]], '#140e08', 0.3, 6], [[[470, 492], [540, 500], [574, 548], [540, 520]], '#c8b890', 0.35, 8]]);
  // the mouth: a hard lipless line from the snout tip running back and turning down at the corner, a fold at the corner
  f.stroke([[578, 566], [540, 584], [490, 598], [444, 608], [414, 624]], 5, INK);
  f.line([[574, 570], [540, 586], [490, 600]], 1.2, hideL, { op: 0.5 });
  W.crease(f, [[420, 612], [406, 628], [404, 646]], 4, { lip: 2, lit: '#a08a5a', col: '#140e08' });
  // the snout: nostril on the tip, a canthal ridge running back to the eye
  f.flat(ell([562, 530], 5, 3, -0.4, 8), '#0a0804'); f.line([[556, 526], [566, 524]], 1, hideL, { op: 0.6 });
  f.line([[548, 516], [530, 498], [514, 490]], 2, '#140e08', { op: 0.6 });
  // parotoid gland: a kidney-shaped poison sac behind the eye, bile-tinged and pitted with pores
  const pg = f.part([[394, 556], [400, 530], [430, 510], [466, 506], [484, 520], [478, 540], [452, 552], [420, 566]], { fill: mix(P.bile, hide, 0.68), shadow: P.bileD, shade: 0.42, inkW: 1.3, inkHeavy: 2.2, tex: 'mottle' + seed, texOp: 0.5, k: 0.9 });
  W.softTone(f, pg, [[[[396, 556], [440, 548], [480, 534], [470, 556], [420, 568]], '#140e08', 0.5, 8]]);
  for (let i = 0; i < 24; i++) { const q = W.scatter(f, [440, 534], 32, 14); f.flat(ell(q, 2.4, 1.8, 0, 6), '#1a1a08', { op: 0.85 }); f.flat(ell(add(q, [1, -1.4]), 1.2, 0.8, 0, 5), '#d8d0a0', { op: 0.35 }); }
  f.flat(ell([444, 522], 14, 4, -0.3, 8), '#f2ecc8', { op: 0.35 });
  // the eardrum behind the eye, under the gland: a low disc with a rim, mostly in shadow
  f.flat(ell([484, 556], 10, 11, 0, 12), '#2a2014', { op: 0.55 }); f.line(ell([484, 556], 10, 11, 0, 14).slice(9, 14), 1.4, hideL, { op: 0.5 });
  // the eye set on top under a bony cranial ridge: a raised dome, bile-gold iris veined dark, a horizontal pupil, the
  // heavy upper lid down over the top third
  f.part(ell([506, 482], 30, 22, 0, 18), HD({ cast: true, castOp: 0.5 }));
  const eyeD = f.part(ell([510, 480], 20, 15, 0, 16), { fill: '#a08e34', shadow: '#4a4416', shade: 0.35, inkW: 1.4, cast: false, hatch: false });
  for (let i = 0; i < 12; i++) f.line([[510, 480], add([510, 480], rot([18, 0], i * 0.52 + f.r() * 0.2))], 0.9, i % 2 ? '#3a3410' : '#c8b858', { op: 0.55 });
  f.flat([[494, 481], [510, 477], [526, 481], [510, 485]], '#0a0804');
  f.flat(ell([516, 474], 3.5, 2.4, 0, 6), '#fff', { op: 0.85 });
  f.part([[482, 478], [490, 462], [510, 456], [530, 462], [536, 478], [520, 472], [506, 471], [490, 476]], HD({ cast: true, castOp: 0.5, inkW: 1.3, inkHeavy: 2.2 })); // heavy upper lid
  f.stroke([[486, 477], [508, 471], [534, 477]], 3, INK);
  f.line([[480, 466], [500, 452], [528, 450], [546, 462]], 1.6, hideL, { op: 0.5 }); wartsC([512, 452], 22, 4, 5, 2, 3.5); // the bony cranial ridge over it, knobbed
  f.part([[490, 488], [510, 494], [530, 488], [528, 496], [510, 500], [492, 496]], HD({ cast: false, inkW: 1 })); // lower lid
  f.part(ell([440, 496], 14, 10, 0, 12), HD({ fill: hideD, cast: false })); // far eye bump peeking over the skull
  wartsC([520, 540], 34, 14, 7, 2, 4.5);
  // the eel-catcher's hook rusting in the lip, with a length of line
  const hk = [540, 588];
  f.line([[hk[0] - 2, hk[1] - 12], [hk[0] + 4, hk[1] - 2], [hk[0] + 2, hk[1] + 10], [hk[0] - 8, hk[1] + 12], [hk[0] - 10, hk[1] + 4]], 2.6, P.rust);
  f.line([[hk[0] - 2, hk[1] - 12], [hk[0] - 4, hk[1] - 18]], 2.6, P.rust);
  f.flat(ell(hk, 5, 3, 0, 8), '#3a1a10', { op: 0.6 });
  rope0(f, [[hk[0] - 4, hk[1] - 18], [hk[0] + 6, hk[1] - 4], [hk[0] + 18, hk[1] + 30], [hk[0] + 20, hk[1] + 70]], 1.6);

  // ---- near foreleg: short and bent, the elbow back, the hand turned in with knobbed fingers spread in the mud
  leg3('leg_fn', FN, [46, 36, 24], HD(), () => digits(add(FN[2], [4, 12]), 0.4, 4, 46, 13, HD(), { spread: 0.46, lens: [0.8, 1.0, 1.1, 0.75] }), { b1: 0.2, b2: 0.22 });
  f.bone('leg_fn_1');
  wartsC(lp(FN[0], FN[1], 0.5, 0), 14, 22, 5, 2.5, 5);
  f.bone('leg_fn_2');
  W.creaseField(f, FN[1], 14, 14, 3, 0.4, 24, 2.4, { lip: 2, lit: '#a08a5a', col: '#140e08' }); // elbow folds
  f.bone('leg_fn_3');
  W.mudSplats(f, add(FN[2], [26, 22]), 30, 6, 6, P.peatD);

  f.bone('root');
  f.flat(ell([300, gy + 2], 270, 9, 0, 20), P.waterL, { op: 0.4 });
  return f;
}
// thin line (fishing line, thread)
function rope0(f, pts, w) { f.line(pts, w + 1, INK, { op: 0.8 }); f.line(pts, w, '#b8aa88'); }

// ------------------------------------------------------------------ LEECH SWARM (cast, small heap 0.5)
// The village barber's medicinal leeches, grown fat in the poisoned fen. The brown-glass apothecary jar lies tipped on
// its side, propped on the heap, cracked; the leeches pour from its mouth and through the crack into a writhing mound
// that rises in front of it. Rig (its own): ground (root) > jar; ground > heap > spill and one bone per rearing leech.
// Motion: idle a slow ripple (heap and leech bones sway); attack the heap surging forward, the rearing leeches lunging.
function leechSwarm() {
  const f = new Fig(W.base(207, 820, { grimeY: 700 }));
  W.textures(f);
  const seed = 207, gy = 790;
  // a leech (independent review rebuild, so each one reads at game size): a flattened body thickest in its rear third,
  // a broad rear sucker disc at the tail end (pts[0]), tapering to a narrow head with a small front sucker cup
  // (pts[n-1]); rings across the body, an olive-brown lateral stripe, and a wet lit highlight along the side facing
  // the key light
  const leech = (pts, w, o = {}) => {
    const n = pts.length, P2 = [], Q2 = [];
    const sm = []; for (let i = 0; i < n - 1; i++) for (let k = 0; k < 6; k++) sm.push(lerp(pts[i], pts[i + 1], k / 6)); sm.push(pts[n - 1]);
    const prof = t => (t < 0.08 ? 0.62 + t * 3 : t < 0.32 ? 0.86 + (t - 0.08) * 0.6 : 1.0 - (t - 0.32) * 1.0) * (o.fat ? 1.12 : 1);
    sm.forEach((q, i) => { const a = sm[Math.max(0, i - 1)], b = sm[Math.min(sm.length - 1, i + 1)], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], t = i / (sm.length - 1), ww = w * prof(t) / 2; P2.push(add(q, mul(nn, ww))); Q2.push(add(q, mul(nn, -ww))); });
    // rear sucker under the tail end
    const d0 = E.norm(sub(sm[1], sm[0]));
    f.part(ell(add(sm[0], mul(d0, -w * 0.08)), w * 0.24, w * 0.4, Math.atan2(d0[1], d0[0]), 12), { fill: '#241a12', shadow: '#000', shade: 0.35, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false });
    f.part([...P2, ...Q2.reverse()], { fill: o.col || P.leech, shadow: '#000', light: '#2e2620', shade: 0.35, inkW: 1.3, inkHeavy: 2.2, cast: o.cast ?? false, castOp: 0.4, k: 1, hatch: false, gritOp: 0.25 });
    Q2.reverse();
    // which edge faces the light: that side gets the highlight, the other the stripe
    const mi = Math.floor(sm.length * 0.4), up = E.norm(sub(P2[mi], sm[mi])), lit = (up[0] * 0.6 - up[1] * 0.8) > 0 ? P2 : Q2, dark = lit === P2 ? Q2 : P2;
    const inset = (arr, k) => arr.map((q, i) => lerp(q, sm[i], k));
    f.line(inset(dark, 0.45).slice(2, -3), Math.max(1, w * 0.07), '#5a4424', { op: 0.55 }); // lateral stripe
    for (let i = 2; i < sm.length - 2; i += 2) f.line([lerp(P2[i], sm[i], 0.08), sm[i], lerp(Q2[i], sm[i], 0.08)], 0.8, '#000', { op: 0.55 }); // rings
    const hl = inset(lit, 0.32).slice(3, -4); if (hl.length > 2) { f.line(hl, Math.max(1.4, w * 0.1), '#8a8676', { op: 0.55 }); f.line(hl.slice(Math.floor(hl.length * 0.25), Math.floor(hl.length * 0.6)), Math.max(1, w * 0.06), '#f0ecd8', { op: 0.75 }); }
    // the front sucker: a small cup at the head with a dark mouth
    const h = sm[sm.length - 1], dh = E.norm(sub(h, sm[sm.length - 3])), ah = Math.atan2(dh[1], dh[0]);
    f.part(ell(add(h, mul(dh, 1)), w * 0.12, w * 0.2, ah, 10), { fill: '#3a2018', shadow: '#000', shade: 0.3, inkW: 1, cast: false, hatch: false });
    if (o.sucker) f.flat(ell(add(h, mul(dh, 2)), w * 0.06, w * 0.12, ah, 8), '#0a0404');
  };
  const wig = (a, b, amp, n = 4) => { const d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = []; for (let i = 0; i <= n; i++) r.push(add(lerp(a, b, i / n), mul(nn, Math.sin(i * 1.7 + a[0] * 0.05) * amp))); return r; };

  // jar: tipped on its side, its base on the ground at the back, its neck propped up on the heap
  const jb = [70, 716], jA = -0.28, jL = 246, jR = 98, J = frame(jb, jA, 1); // local x along the jar's axis to the mouth, y across
  const mouth = J([[jL + 4, 0]])[0];
  const heapC = [424, 690];
  f.joint('ground', [320, gy]).joint('jar', J([[40, jR]])[0], 'ground').joint('heap', [430, gy - 10], 'ground').joint('spill', mouth, 'jar');
  const rearing = [[[398, 620], [386, 556], [398, 500], [426, 468]], [[458, 612], [472, 546], [466, 490], [486, 456]], [[512, 650], [536, 604], [540, 554], [528, 520]], [[350, 672], [328, 630], [318, 592], [296, 574]]];
  rearing.forEach((r, i) => f.joint('leech_' + (i + 1), r[0], 'heap'));
  f.joint('crawler', [476, 770], 'ground');

  // ---- the heap: a mound of fat black leeches, writhing over each other
  f.bone('heap');
  const mound = [[280, gy], [298, 730], [330, 684], [362, 640], [400, 610], [448, 598], [494, 606], [526, 634], [542, 672], [550, 720], [556, gy]];
  const lumpy = []; for (let i = 0; i < mound.length - 1; i++) for (let k = 0; k < 4; k++) { const a = mound[i], b = mound[i + 1], q = lerp(a, b, k / 4), d = E.norm(sub(b, a)), nn = [d[1], -d[0]]; lumpy.push(i === 0 && k === 0 ? q : add(q, mul(nn, (k % 2 ? 10 : 3) * (q[1] < gy - 4 ? 1 : 0)))); } lumpy.push(mound[mound.length - 1]);
  f.part(lumpy, { fill: '#100e0a', shadow: '#000', light: '#2a2a20', shade: 0.3, inkW: 1.6, hatch: false, k: 0.9 });
  const lay = [];
  const inside = p => { let c = false; for (let i = 0, j = mound.length - 1; i < mound.length; j = i++) { const a = mound[i], b = mound[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  for (let k = 0; k < 900 && lay.length < 36; k++) {
    const p = [280 + f.r() * 276, 530 + f.r() * 250], a = (f.r() - 0.5) * 2.4 + (f.r() > 0.5 ? 0 : Math.PI), l = 56 + f.r() * 44, b = add(p, rot([l, 0], a));
    if (!inside(add(p, [0, -6])) || !inside(b) || !inside(lerp(p, b, 0.5))) continue;
    lay.push([p, a, l, 26 + f.r() * 12]);
  }
  lay.sort((p, q) => p[0][1] - q[0][1]).forEach(([p, a, l, w]) => { const b = add(p, rot([l, 0], a)); leech(wig(p, b, 5 + f.r() * 4, 4), w, { sucker: f.r() > 0.5, fat: f.r() > 0.6 }); });
  // a barber's blood-soaked rag caught in the spill, a pewter bleeding bowl knocked over
  f.part([[400, 742], [436, 730], [470, 748], [452, 770], [414, 772]], { fill: '#b0a48a', shadow: '#5a5040', shade: 0.35, tex: 'weave' + seed, texOp: 0.5, inkW: 1.2 });
  f.flat([[412, 748], [432, 740], [448, 754], [430, 764]], '#5c0f0b', { op: 0.7 });
  leech(wig([392, 762], [446, 734], 4), 20, { sucker: true });

  // ---- the jar: a round-bellied apothecary leech jar in brown glass, tipped on its side: a foot ring, a full belly, a
  // sloping shoulder, a short neck and a flared lip. Leeches show dark through the glass and crawl over it.
  f.bone('jar');
  const half = [[0, 34], [8, 58], [26, 82], [66, 97], [120, 96], [158, 84], [186, 62], [204, 46], [222, 42], [232, 50], [244, 56], [248, 48]];
  const jarPts = J([...half.map(([x, y]) => [x, -y]), ...half.slice().reverse().map(([x, y]) => [x, y])]);
  // what is inside first, so the glass can be drawn over it partly see-through
  const jarD = E.smooth(jarPts, true, 1);
  const inside2 = []; for (let i = 0; i < 9; i++) { const a = J([[30 + f.r() * 150, -60 + f.r() * 130]])[0]; inside2.push([wig(a, add(a, rot([40 + f.r() * 30, 0], f.r() * 6)), 4, 3), 20 + f.r() * 8]); }
  f.part(jarPts, { fill: '#1a1208', shade: 0, hi: 0, inkW: 0, cast: true, castOp: 0.5, hatch: false });
  W.softTone(f, jarD, [[J([[10, 40], [200, 40], [200, 100], [10, 100]]), '#3a2410', 0.7, 6]]); // the foul water pooled in the low side
  inside2.forEach(([pp, w]) => leech(pp, w, { sucker: false }));
  f.part(jarPts, { fill: P.glass, shadow: P.glassD, light: P.glassL, shade: 0.36, tex: 'mottle' + seed, texOp: 0.3, hatch: false, opacity: 0.58, cast: false });
  f.line(jarPts.concat([jarPts[0]]), 2, INK);
  // the curve of the glass: a dark band along the underside, lit bands following the belly and shoulder
  W.softTone(f, jarD, [[J([[0, 50], [200, 60], [200, 110], [0, 110]]), P.glassD, 0.6, 10], [J([[20, -86], [150, -86], [184, -58], [150, -70], [20, -70]]), P.glassL, 0.5, 5]]);
  f.line(J([[24, -78], [80, -88], [140, -84], [176, -64]]), 4, '#e8c898', { op: 0.55 });
  f.line(J([[200, -40], [226, -38]]), 3, '#e8c898', { op: 0.55 });
  f.flat(J(ell([52, -76], 12, 4, 0.1, 8)), '#fff4dc', { op: 0.75 });
  for (const x of [8, 18]) f.line(J([[x, -50], [x + 6, -18], [x + 6, 18], [x, 50]]), 1.4, x === 8 ? INK : '#e8c898', { op: 0.5 }); // the foot ring
  f.line(J([[186, -62], [190, 0], [186, 62]]), 1.2, INK, { op: 0.4 }); // the shoulder turning
  // label: faded paper wrapped round the belly (its edges curve with the glass), a torn corner, the barber's script and
  // a drawn leech
  const lab = J([[84, -58], [110, -62], [136, -58], [140, -20], [140, 20], [136, 46], [118, 50], [110, 40], [88, 46], [82, 0]]);
  f.part(lab, { fill: '#8a7c5c', shadow: '#4a3e2c', shade: 0.3, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.1, opacity: 0.9 });
  for (let i = 0; i < 3; i++) f.line(J([[90, -44 + i * 14], [106, -46 + i * 14 + (i % 2) * 3], [122, -44 + i * 14], [134, -42 + i * 14]]), 1.2, '#3a2e1e', { op: 0.6, dash: i === 2 ? '6 4' : undefined });
  f.stroke(J([[92, 24], [104, 18], [120, 22], [132, 20]]), 6, '#2a1e12'); f.flat(J(ell([134, 20], 3, 4, 0, 6)), '#2a1e12');
  f.flat(J(ell([128, -10], 12, 18, 0, 10)), '#5a4a32', { op: 0.5 }); // water stain
  // crack and a missing shard, a leech squeezing out of it
  const ck = J([[176, 12]])[0];
  f.flat(J([[166, -2], [190, -8], [198, 14], [186, 30], [170, 22]]), '#0a0604');
  for (const br of [[[166, -2], [150, -30], [140, -56]], [[190, -8], [204, -40]], [[186, 30], [200, 60], [206, 84]], [[170, 22], [150, 50]]]) f.line(J(br), 1.4, '#f0dcb0', { op: 0.7 });
  leech([ck, add(ck, [10, -18]), add(ck, [8, -44]), add(ck, [24, -62])], 22, { sucker: true });
  // the neck: a twine binding and the broken wax of the seal; moss on the glass
  f.part(J([[204, -48], [218, -46], [218, 46], [204, 48]]), { fill: P.rope, shade: 0.4, inkW: 1.1, cast: false, tex: 'hatch' + seed, texOp: 0.5 });
  W.rope(f, J([[212, 44], [208, 66], [196, 88]]), 3, { fray: true });
  f.part(J([[248, -48], [258, -42], [260, -16], [252, -12]]), { fill: '#4a3424', shade: 0.4, inkW: 1, cast: false }); // broken wax seal, brown with age
  W.mossClump(f, J([[40, -88]])[0], 24, 8, { ang: jA });
  // the open mouth, seen a little end-on: a thick flared glass lip round a dark throat full of leeches
  f.part(J(ell([jL, 0], 13, 56, 0, 20)), { fill: P.glassL, shadow: P.glass, shade: 0.4, inkW: 1.4, cast: false, hatch: false });
  f.flat(J(ell([jL + 1, 2], 8, 46, 0, 18)), '#080604');
  f.line(J([[jL - 6, -50], [jL - 10, -14]]), 2, '#f4e0b8', { op: 0.6 });
  // two leeches crawling over the top of the jar
  leech([J([[40, -98]])[0], J([[70, -110]])[0], J([[104, -110]])[0], J([[130, -102]])[0]], 22, { sucker: true });
  leech([J([[150, -92]])[0], J([[170, -96]])[0], J([[192, -80]])[0], J([[200, -62]])[0]], 18, { sucker: true });

  // ---- the spill: a rope of leeches pouring over the lip of the jar down into the heap
  f.bone('spill');
  leech([add(mouth, [0, -14]), add(mouth, [22, -30]), add(mouth, [48, -24]), add(mouth, [62, 0]), add(mouth, [70, 36])], 26, { fat: true });
  leech([add(mouth, [2, 4]), add(mouth, [24, 0]), add(mouth, [38, 20]), add(mouth, [40, 52])], 22, { sucker: true });
  leech([add(mouth, [0, 22]), add(mouth, [12, 36]), add(mouth, [14, 62]), add(mouth, [2, 86])], 20, { sucker: true });

  // ---- rearing leeches, lifted out of the heap, suckers open toward the prey
  rearing.forEach((r, i) => { f.bone('leech_' + (i + 1)); leech(r, 30 - i * 2, { sucker: true, fat: true, cast: true }); });

  // ---- one crawling off across the mud toward the party, and the cork
  f.bone('crawler');
  leech(wig([462, 778], [540, 770], 5, 5), 20, { sucker: true });
  f.bone('ground');
  f.part(ell([250, 774], 22, 14, 0.3, 14), { fill: '#8a6a44', shadow: '#3a2a1a', shade: 0.4, tex: 'peat' + seed, texOp: 0.5, inkW: 1.3 }); // the cork
  f.part(ell([268, 768], 10, 13, 0.3, 12), { fill: '#a88a5a', shadow: '#5a4a30', shade: 0.3, inkW: 1.1, cast: false });
  f.flat(ell([300, gy + 2], 270, 8, 0, 20), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ FEN LURKER (cast, large 1.5 long)
// An old fen pike-crocodile, so still and so overgrown that its back is a mossy log lying in the black water: bark-grain
// scutes, a snapped branch stub, bracket fungi and toadstools, an eel spear rusting in it. Independent review: the first
// build lay flat in a thin water band and vanished at game size, so the back now arches up out of the water as a log
// hump, and the head breaks the surface: the brow bump with its eye, the long snout with interlocking peg teeth along
// the lip line, the nostril knob at the tip, and a ripple wake and bow wave round it. It still reads as a log first.
// Rig (its own): water (root) > body > tail_1 > tail_2; body > neck > head > jaw, head > eye; body > leg_fn_1 >
// leg_fn_2 (under the surface). The water in front is its own layer on root.
// Motion: idle total stillness, one eye moving (`eye`); attack a sudden lunge and snap (head up out of the water, jaw down).
function fenLurker() {
  const CW = 900, CH = 1100;
  const f = new Fig(W.base(208, CH, { grimeY: null }));
  W.textures(f);
  const seed = 208, yw = 1046;
  const bark = '#5a4a32', barkD = '#3a2e1e', gum = '#c8a690';
  const BK = (o = {}) => Object.assign({ fill: bark, shadow: '#1e180e', shade: 0.4, tex: 'bark' + seed, texOp: 0.8 }, o);
  const hinge = [648, 1034], neckP = [600, 960], headP = [650, 960], eyeC = [700, 914];
  f.joint('water', [450, yw]).joint('body', [400, 1000], 'water').joint('tail_1', [180, 1010], 'body').joint('tail_2', [96, 1036], 'tail_1');
  f.joint('neck', neckP, 'body').joint('head', headP, 'neck').joint('jaw', hinge, 'head').joint('eye', eyeC, 'head');
  f.joint('leg_fn_1', [560, 1040], 'body').joint('leg_fn_2', [604, 1076], 'leg_fn_1');

  // ---- near foreleg, folded under the surface (seen only when it lunges)
  f.bone('leg_fn_2');
  f.part(limb([604, 1076], [650, 1088], 34, 26, { steps: 6 }), BK({ fill: barkD }));
  for (let i = 0; i < 4; i++) f.part(limb([650, 1088], add([650, 1088], rot([26, 0], -0.5 + i * 0.3)), 9, 6, { steps: 4, capK: 1 }), BK({ fill: barkD, cast: false }));
  f.bone('leg_fn_1');
  f.part(limb([556, 1030], [604, 1076], 50, 34, { steps: 6 }), BK({ fill: barkD }));

  // ---- tail: thinning and sinking away under the surface, a ridge of bark-knob scutes, a torn net snagged on it
  f.bone('tail_2');
  f.part([[104, 1024], [40, 1040], [8, 1050], [40, 1056], [104, 1060]], BK());
  for (let i = 0; i < 4; i++) f.part(ell([98 - i * 20, 1028 + i * 5], 7 - i, 5, 0, 8), BK({ cast: false, inkW: 1 }));
  f.bone('tail_1');
  f.part([[214, 966], [160, 990], [100, 1020], [96, 1060], [150, 1062], [220, 1060]], BK());
  for (let i = 0; i < 5; i++) f.part(ell([204 - i * 22, 972 + i * 11], 10 - i, 7, -0.4, 8), BK({ cast: false, inkW: 1 }));
  for (let i = 0; i < 6; i++) { f.line([[114 + i * 16, 1012 - i * 6], [128 + i * 16, 1060]], 1, P.ropeD, { op: 0.8 }); f.line([[104, 1026 + i * 6], [206, 990 + i * 10]], 1, P.ropeD, { op: 0.7 }); } // old eel net

  // ---- the body: a long log arching up out of the water
  f.bone('body');
  const back = [[176, 1060], [180, 1000], [216, 958], [290, 916], [390, 888], [480, 882], [556, 894], [606, 918], [640, 948], [652, 1060]];
  const top = x => { for (let i = 1; i < back.length - 1; i++) if (back[i + 1][0] >= x) { const a = back[i], b = back[i + 1]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 1000; };
  const bodyD = f.part(back, BK({ k: 0.8 }));
  W.softTone(f, bodyD, [[[[180, 1000], [300, 960], [480, 950], [640, 980], [652, 1060], [176, 1060]], '#0e0a06', 0.6, 20], [[[220, 962], [300, 924], [400, 898], [480, 892], [560, 904], [480, 906], [400, 912], [300, 940]], '#b09870', 0.5, 8]]);
  // bark: long cracks and splits running the length of the log, following its curve; knot holes
  for (let k = 0; k < 7; k++) { const off = 18 + k * 16, x0 = 210 + f.r() * 60, x1 = 600 - f.r() * 80; const pts = []; for (let x = x0; x <= x1; x += 40) pts.push([x, top(x) + off + (f.r() - 0.5) * 6]); if (pts.length > 1) { f.line(pts, 2 + f.r() * 1.2, '#140e08', { op: 0.75 }); f.line(pts.map(q => add(q, [0, -2.4])), 1, '#a08a62', { op: 0.45 }); } }
  for (const [x, d] of [[300, 46], [470, 60]]) { const c = [x, top(x) + d]; f.part(ell(c, 14, 9, 0, 12), BK({ fill: barkD, cast: false, inkW: 1.2 })); f.flat(ell(c, 7, 4, 0, 10), '#0e0a06'); for (let r = 9; r < 20; r += 5) f.line(ell(c, r, r * 0.6, 0, 14).slice(2, 12), 1, '#140e08', { op: 0.6 }); }
  // scutes like bark knots in a ridge along the spine
  for (let i = 0; i < 10; i++) { const x = 226 + i * 40, y = top(x) + 4; f.part([[x - 13, y + 6], [x - 5, y - 8], [x + 8, y - 9], [x + 15, y + 6]], BK({ fill: mix(bark, '#000', 0.12), cast: false, inkW: 1.1, inkHeavy: 1.8 })); f.flat(ell([x + 1, y - 1], 3, 2, 0, 6), '#140e08', { op: 0.7 }); }
  for (let i = 0; i < 8; i++) { const x = 246 + i * 44, y = top(x) + 38; f.part(ell([x, y], 9, 6, 0.1, 8), BK({ fill: mix(bark, '#000', 0.08), cast: false, inkW: 1 })); }
  // a snapped branch stub (an old osteoderm spur) and its ragged end
  const sb = [330, top(330) + 6];
  f.part([add(sb, [-8, 2]), add(sb, [-12, -36]), add(sb, [-18, -62, 1]), add(sb, [-4, -54]), add(sb, [2, -68, 1]), add(sb, [8, -44]), add(sb, [14, 0])], BK({ texOp: 0.6 }));
  f.part(ell(add(sb, [-8, -60]), 10, 5, -0.2, 10), { fill: '#b89a6a', shadow: '#6a5a3a', shade: 0.3, inkW: 1.1, cast: false, hatch: false });
  // moss blanketing the top in mats with hanging strands, bracket fungi on the flank, toadstools, pustules
  for (const [x, rx] of [[260, 42], [404, 56], [526, 36], [470, 26]]) { W.mossClump(f, [x, top(x) + 4], rx, 11); for (let i = 0; i < rx / 6; i++) { const q = [x + (f.r() - 0.5) * rx * 1.6, top(x) + 12 + f.r() * 6]; f.line([q, add(q, [(f.r() - 0.5) * 4, 10 + f.r() * 22])], 1.4, f.r() > 0.5 ? P.mossD : P.mossL, { op: 0.85 }); } }
  W.bracket(f, [440, 986], 0.1, 44, 3);
  W.bracket(f, [256, 1000], 0.2, 32, 2);
  W.toadstools(f, [380, top(380) + 2], -1.65, 32, 3);
  W.pustules(f, [540, 990], 30, 14, 4, 4, 7, { burst: 0.4 });
  // an eel spear stuck in its back years ago, the shaft snapped, rust weeping down the bark
  const sp = [500, top(500) + 4];
  f.line([sp, add(sp, [34, -62])], 6, '#2a2018'); f.line([sp, add(sp, [34, -62])], 4, P.woodL); f.line([add(sp, [34, -62]), add(sp, [28, -68]), add(sp, [38, -66])], 2, '#2a2018');
  f.part([add(sp, [-6, 8]), add(sp, [4, -10]), add(sp, [10, -6]), add(sp, [4, 12])], { fill: P.rust, shade: 0.4, inkW: 1, cast: false });
  f.flat([add(sp, [-2, 10]), add(sp, [6, 10]), add(sp, [8, 44]), add(sp, [0, 48])], '#5a3420', { op: 0.55 });
  // a leech on the flank
  f.part(limb([566, 1000], [598, 1012], 13, 9, { steps: 6, capK: 1 }), { fill: P.leech, shadow: '#000', light: '#2e2e24', shade: 0.35, inkW: 1.1, cast: false });

  // ---- neck, low and broad, knobbed, more bark and moss
  f.bone('neck');
  f.part([[560, 1060], [566, 950], [600, 920], [640, 924], [668, 950], [672, 1060]], BK({ shade: 0.25, castOp: 0.2 }));
  for (let i = 0; i < 3; i++) f.part(ell([596 + i * 22, 940 + i * 6], 9, 6, 0.3, 8), BK({ cast: false, inkW: 1 }));
  W.mossClump(f, [612, 938], 20, 7);

  // ---- head, layer 1: the inside of the mouth, pale gums and a dark gullet (seen when the jaw drops)
  f.bone('head');
  f.part([hinge, [700, 1030], [780, 1026], [860, 1022], [866, 1040], [780, 1060], [700, 1066], [650, 1060]], { fill: gum, shadow: '#6a4a3a', shade: 0.4, inkW: 1.2, cast: false });
  f.flat([[646, 1040], [690, 1036], [700, 1056], [656, 1060]], '#140806', { op: 0.9 });
  // ---- lower jaw: long, its peg teeth rising outside the upper lip (crocodile-style), the rest under the surface
  f.bone('jaw');
  f.part([[640, 1032], [700, 1034], [780, 1032], [860, 1028], [874, 1034], [860, 1050], [780, 1068], [690, 1072], [646, 1064]], BK({ fill: mix(bark, '#a8946a', 0.2) }));
  for (let i = 0; i < 11; i++) { const x = 676 + i * 17 + (f.r() - 0.5) * 5, y = 1034 - i * 0.3; if (i === 4 || i === 8) continue; f.part([[x - 3.5, y + 2], [x - 1, y - 7 - (i % 3) * 4], [x + 3.5, y + 2]], { fill: mix(P.bone, P.peat, 0.45), shadow: P.boneD, shade: 0.35, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }
  f.line([[650, 1036], [760, 1034], [860, 1030]], 2.2, gum, { op: 0.7 }); // pale gum line

  // ---- head, layer 2: the long flat skull, the brow bump with its eye, the snout plates, the nostril knob
  f.bone('head');
  const skull = [[624, 1046], [618, 990], [636, 950], [662, 924], [684, 904], [712, 904], [734, 924], [760, 944], [800, 956], [836, 962], [856, 956], [876, 966], [890, 990], [888, 1010], [874, 1024], [820, 1030], [740, 1032], [668, 1034], [636, 1046]];
  const skD = f.part(skull, BK({ k: 0.85, castOp: 0.2 }));
  W.softTone(f, skD, [[[[630, 1000], [700, 990], [800, 1000], [880, 1010], [880, 1030], [630, 1040]], '#0e0a06', 0.55, 12], [[[690, 912], [740, 934], [820, 960], [870, 972], [820, 966], [740, 944]], '#b09870', 0.5, 6]]);
  for (let i = 0; i < 8; i++) { const x = 740 + i * 18; f.line([[x, top(400) * 0 + 948 + i * 2.2], [x + 6, 1026]], 1.1, '#140e08', { op: 0.5 }); } // scaly snout plates
  for (let i = 0; i < 6; i++) { const x = 750 + i * 22; f.flat(ell([x, 972 + i * 1.6], 6, 4, 0, 8), '#140e08', { op: 0.35 }); } // pits along the jaw (pressure sense organs)
  f.part(ell([866, 964], 16, 10, 0.1, 12), BK({ cast: false, inkW: 1.2 })); f.flat(ell([862, 960], 4, 2.4, 0.4, 8), '#0a0604'); f.flat(ell([874, 962], 3, 2, 0.4, 6), '#0a0604'); // nostril knob, two slits
  // upper teeth along the lip, interlocking with the lower ones; one long one over the lip
  for (let i = 0; i < 10; i++) { const x = 686 + i * 18 + (f.r() - 0.5) * 5, y = 1030 - i * 0.4; if (i === 2 || i === 6) continue; f.part([[x - 3.5, y - 2], [x, y + 6 + (i % 3) * 3], [x + 3.5, y - 2]], { fill: mix(P.bone, P.peat, 0.4), shadow: P.boneD, shade: 0.35, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }
  f.part([[744, 1028], [748, 1054], [754, 1028]], { fill: P.boneD, shade: 0.35, inkW: 1, cast: false, hatch: false });
  f.line([[640, 1034], [740, 1032], [874, 1024]], 2.6, INK); // the lip line
  // the brow bump: a hooded ridge, the socket, moss in the wrinkles behind it
  f.part([[666, 922], [680, 900], [704, 894], [724, 904], [718, 916], [690, 914]], BK({ cast: true, castOp: 0.5 }));
  f.flat(ell(eyeC, 12, 8, 0, 10), '#0e0a06');
  W.mossClump(f, [740, 940], 18, 6, { ang: 0.4 });
  for (let i = 0; i < 4; i++) W.crease(f, [[640 + i * 10, 960 + i * 14], [660 + i * 10, 950 + i * 14], [690 + i * 6, 954 + i * 14]], 2.4, { lip: 2, lit: '#a08a62' });
  // ---- the eye on its own bone: a small bile-yellow eyeball with a slit pupil, so it can roll while all else is still
  f.bone('eye');
  f.part(ell(eyeC, 9, 7, 0, 12), { fill: '#a89a3a', shadow: '#4a4416', shade: 0.3, inkW: 1, cast: false, hatch: false });
  f.flat([add(eyeC, [1, -6]), add(eyeC, [3, 0]), add(eyeC, [1, 6]), add(eyeC, [-1, 0])], '#0a0804');
  f.flat(ell(add(eyeC, [4, -3]), 2, 1.4, 0, 6), '#fff', { op: 0.9 });
  f.part([add(eyeC, [-11, -3]), add(eyeC, [-2, -9]), add(eyeC, [12, -8]), add(eyeC, [10, -3]), add(eyeC, [-2, -4])], BK({ cast: false, inkW: 1 })); // heavy lid

  // ---- the black water in front: covers everything below the surface; a wake behind the snout, a bow wave, bubbles
  f.bone('water');
  f.part([[0, yw], [CW, yw], [CW, CH], [0, CH]], { fill: P.water, shadow: P.water, light: P.waterM, shade: 0.1, inkW: 0, cast: false, hatch: false, gritOp: 0.25, noShade: true });
  f.flat([[170, yw], [660, yw], [630, yw + 34], [200, yw + 28]], '#2a2216', { op: 0.4 }); // the log's dark reflection
  f.flat([[630, yw], [890, yw], [860, yw + 16], [650, yw + 18]], '#2a2216', { op: 0.35 });
  // where the body meets the water: a pale scum line hugging it, and the bow wave piled at the snout
  f.line([[178, yw], [420, yw - 1], [660, yw], [880, yw - 1]], 3, '#8a8a62', { op: 0.55 });
  f.stroke([[848, yw - 2], [880, yw - 10], [904, yw - 6], [900, yw]], 8, '#6a6a4a', { op: 0.6 });
  f.line([[860, yw - 4], [884, yw - 10], [900, yw - 6]], 1.4, '#c8c8a0', { op: 0.6 });
  // the wake: arcs fanning back from the snout and the shoulders, wider and fainter with distance
  for (let i = 0; i < 6; i++) { const x0 = 860 - i * 90, w = 50 + i * 30, y = yw + 6 + i * 5; f.line([[x0, y], [x0 - w * 0.5, y + 2 + i], [x0 - w, y + 4 + i * 1.5]], 1.8 - i * 0.15, '#7a7a56', { op: 0.6 - i * 0.07 }); f.line([[x0 - 20, y + 10 + i * 2], [x0 - w * 0.7, y + 14 + i * 3]], 1.2, '#5a5a40', { op: 0.45 - i * 0.05 }); }
  W.ripples(f, [430, yw + 4], 260, 6, 3, '#5a5a40', 0.5);
  f.line([[0, yw], [CW, yw]], 1.4, '#6a6a4a', { op: 0.5 });
  for (const [x, w] of [[120, 40], [300, 60], [560, 50]]) f.line([[x, yw + 22], [x + w, yw + 22]], 1, '#5a5a40', { op: 0.35 });
  W.bubbles(f, [868, yw - 60], 4, 12, 30, 0.8);
  // reeds growing up out of the water around it
  for (const [x, h, w, ct] of [[30, 190, 6, true], [56, 150, 5, false], [140, 120, 4, false]]) W.reed(f, [[x, yw + 10], [x + 2, yw - h * 0.4], [x - 2, yw - h * 0.8], [x + 4, yw - h]], w, { cattail: ct });
  return f;
}

// ------------------------------------------------------------------ BOG TROLL (elite 2.3)
// A peat-cutter giant, or a man the fen built bigger: a hunched mountain of muscle under a hide of living moss and mud,
// long arms resting on its knuckles, short thick legs. Cut peat slabs plate its shoulders like armour; wounds close
// as you watch with green growth; the peat spade someone drove into its back is still there, forgotten, the handle
// sticking up over the hump. The head is small, sunk between the shoulders: heavy brow, lipless mouth.
// Rig: standard humanoid + spade (torso). Motion: idle moss stirring as wounds knit; attack a two-fisted overhead smash.
function bogTroll() {
  const CW = 1100, CH = 1400;
  const f = new Fig(W.base(202, CH, { grimeY: 1000 }));
  W.textures(f);
  const seed = 202, gy = CH - 30, H = 150;
  const hide = '#4c4630', hideD = '#332e1e';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#16140a', shade: 0.42, tex: 'moss' + seed, texOp: 0.45 }, o);
  // living moss growing over the hide in irregular sheets (inside the silhouette)
  // draped moss: a sheet over the hide whose lower edge breaks into strands hanging plumb (water-heavy, dripping)
  const mossSheet = (c, rx, ry, a = 0) => {
    const top = ell(c, rx, ry, a, 20).filter(p => p[1] <= c[1] + ry * 0.2), lo = [];
    const xs = top.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), n = Math.max(4, Math.round((x1 - x0) / 16));
    for (let i = n; i >= 0; i--) { const x = x0 + (x1 - x0) * i / n, y = c[1] + ry * (0.3 + f.r() * 0.5); lo.push([x, y - 6]); if (i > 0 && i < n) lo.push([...[x - (x1 - x0) / n * 0.5, y + 10 + f.r() * ry * 0.7], 1]); }
    const pts = [...top.sort((p, q) => p[0] - q[0]).map(p => add(p, [0, (f.r() - 0.5) * 6])), ...lo];
    f.part(pts, { fill: '#3e4624', shadow: P.mossD, shade: 0.42, tex: 'moss' + seed, texOp: 0.95, inkW: 1.1, inkHeavy: 1.6, cast: false, k: 0.7 });
    for (let i = 0; i < Math.round(rx / 10); i++) { const p = W.scatter(f, c, rx * 0.7, ry * 0.5); f.line([p, add(p, rot([5 + f.r() * 5, 0], -1.4 + (f.r() - 0.5)))], 1.2, P.mossY, { op: 0.55 }); }
    if (f.r() > 0.4) W.drip(f, lo[Math.floor(lo.length / 2)], 1.1, '#3a4220');
  };
  const SKN = (o = {}) => Object.assign({ fill: '#6a6040', shadow: '#2a2414', shade: 0.38, tex: 'wrinkle' + seed, texOp: 0.55 }, o); // bare hide where the moss has worn off
  const Pv = [430, 900];
  const SN = [636, 470], EN = [700, 800], WN = [766, 1192];
  const SF = [742, 430], EF = [886, 716], WF = [990, 1176];
  const HN = [480, 894], KN = [610, 1060], AN = [528, 1262];
  const HF = [404, 872], KF = [508, 1044], AF = [404, 1262];
  const HC = [858, 566], hA = 0.14, neck0 = [770, 540];
  const spB = [468, 404], spT = [300, 66], spA = ang(spB, spT);

  f.joint('pelvis', Pv).joint('torso', [470, 860], 'pelvis').joint('head', neck0, 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('spade', spB, 'torso');

  const leg = (Hp, Kn, A, s, wH, wK, sfx, look) => {
    const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => W.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, { thigh: 0.1, swell: 0.6, nail: '#8a7a58' }), [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, [side(Kn, dk, wK * 0.6), side(A, mul(da, -1), 40)]], ['foot' + sfx, side(A, da, 40)]]);
  };
  const arm = (S0, E0, W0, ws, sfx, look, o = {}) => {
    const de = elb(S0, E0, W0);
    split(f, () => { W.fullArm(f, S0, E0, W0, ws[0], ws[1], ws[2], look, o); f.stroke([lp(S0, E0, 0.15, ws[0] * 0.1), lp(S0, E0, 0.5, ws[0] * 0.18), lp(S0, E0, 0.85, ws[1] * 0.1)], 3, '#16140a'); f.stroke([lp(E0, W0, 0.05, -ws[1] * 0.1), lp(E0, W0, 0.4, -ws[1] * 0.2), lp(E0, W0, 0.85, -ws[2] * 0.15)], 3, '#16140a'); f.line([lp(S0, E0, 0.2, -ws[0] * 0.3), lp(S0, E0, 0.7, -ws[1] * 0.32)], 2, '#8a8258', { op: 0.45 }); f.line([lp(E0, W0, 0.15, ws[1] * 0.3), lp(E0, W0, 0.7, ws[2] * 0.32)], 2, '#8a8258', { op: 0.45 }); for (let i = 0; i < 8; i++) { const t = f.r(); f.flat(ell(lp(S0, E0, t, (f.r() - 0.5) * ws[0] * 0.7), 8 + f.r() * 16, 6 + f.r() * 10, f.r() * 3, 10), '#2e2a1a', { op: 0.35 }); f.flat(ell(lp(E0, W0, t, (f.r() - 0.5) * ws[1] * 0.7), 8 + f.r() * 14, 6 + f.r() * 10, f.r() * 3, 10), '#2e2a1a', { op: 0.35 }); } }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
  };
  // a cut slab of peat: a squared turf block with a fibrous face, moss on its top edge and roots hanging from the bottom
  const slab = (c, w, h, a, col = P.peat) => {
    const F = frame(c, a, 1);
    const jag = (x, y) => [x + (f.r() - 0.5) * 8, y + (f.r() - 0.5) * 8];
    f.part(F([jag(-w / 2, -h / 2), jag(-w / 6, -h / 2 - 4), jag(w / 5, -h / 2 - 2), jag(w / 2, -h / 2 - 6), jag(w / 2 + 8, 0), jag(w / 2 + 4, h / 2), jag(w / 6, h / 2 + 8), jag(-w / 4, h / 2 + 4), jag(-w / 2 + 2, h / 2 + 6), jag(-w / 2 - 4, 0)]), { fill: col, shadow: '#120c06', shade: 0.45, tex: 'peat' + seed, texOp: 1, k: 0.6 });
    f.part(F([jag(-w / 2 - 6, -h / 2 + 4), jag(-w / 4, -h / 2 - 10), jag(w / 6, -h / 2 - 8), jag(w / 2 + 6, -h / 2 - 8), jag(w / 2 + 4, -h / 2 + 10), jag(w / 6, -h / 2 + 12), jag(-w / 4, -h / 2 + 14), jag(-w / 2, -h / 2 + 14)]), { fill: P.moss, shadow: P.mossD, shade: 0.4, tex: 'moss' + seed, texOp: 0.95, inkW: 1.2, cast: false, k: 0.7 });
    for (let i = 0; i < 7; i++) { const q = F([[-w / 2 + 6 + f.r() * (w - 12), -h / 2 - 6]])[0]; f.line([q, add(q, rot([10 + f.r() * 10, 0], a - 1.5 + (f.r() - 0.5)))], 1.4, P.reedL, { op: 0.8 }); } // dead grass on the turf
    for (let i = 0; i < 5; i++) { const x = -w / 2 + 10 + i * (w - 20) / 4 + (f.r() - 0.5) * 8; f.line(F([[x, h / 2 + 2], [x + 3, h / 2 + 14 + f.r() * 14], [x - 2, h / 2 + 26 + f.r() * 16]]), 1.3, '#2a1e12', { op: 0.85 }); }
    f.line(F([[-w / 2 + 6, 0], [w / 2 - 6, -4]]), 1.2, '#1a120a', { op: 0.6 }); // a layer line in the cut face
    f.line(F([[-w / 2 + 2, -h / 2 + 2], [-w / 2 + 6, h / 2]]), 1.4, '#8a7050', { op: 0.6 }); // the spade-cut edge, still sharp
  };

  // ---- far leg and far arm, behind the body
  leg(HF, KF, AF, 108, 200, 140, '_f', HD({ fill: hideD }));
  f.bone('thigh_f'); mossSheet(lp(HF, KF, 0.4, 20), 60, 40, ang(HF, KF));
  f.bone('foot_f'); W.mudSplats(f, add(AF, [40, 80]), 70, 18, 10, P.peatD);
  arm(SF, EF, WF, [176, 168, 104], '_f', HD({ fill: hideD }), { bp: [[0, 0.4, 0.14], [1, 0.25, 0.12]], bq: [[1, 0.3, 0.16]] });
  f.bone('forearm_f'); mossSheet(lp(EF, WF, 0.3, 20), 50, 70, ang(EF, WF));
  W.creaseField(f, lp(EF, WF, 0.65, 0), 30, 60, 5, ang(EF, WF) + 1.5, 46, 3, { lip: 2, lit: '#6a6448', col: '#100e06' });
  f.bone('hand_f');
  B.fist(f, add(WF, mul(E.norm(sub(WF, EF)), 66)), ang(EF, WF) - 0.3, 96, mix(hideD, '#5a5030', 0.2), { shadow: '#16140a', tex: 'mottle' + seed, texOp: 0.5 });
  W.mudSplats(f, add(WF, [16, 150]), 50, 22, 8, P.peatD);

  // ---- the body: a hunched mass, the shoulder hump highest, belly hanging, the back sloping to the rump
  f.bone('torso');
  const T = [[540, 318], [626, 324], [706, 362], [770, 430], [812, 520], [826, 606], [810, 700], [776, 792], [726, 860], [650, 906], [560, 932], [460, 934], [368, 904], [326, 830], [334, 716], [364, 596], [404, 480], [458, 372]];
  f.part(T, HD({ k: 0.9 }));
  // form: mottled peat patches, muscle lines and lit ridges, so no area reads flat
  const inT = p => { let c = false; for (let i = 0, j = T.length - 1; i < T.length; j = i++) { const a = T[i], b = T[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  for (let i = 0; i < 40; i++) { const p = W.scatter(f, [570, 640], 220, 260); if (!inT(p) || !inT(add(p, [-34, 0])) || !inT(add(p, [34, 0]))) continue; f.flat(ell(p, 14 + f.r() * 30, 10 + f.r() * 20, f.r() * 3, 12), f.r() > 0.5 ? '#2e2a1a' : '#5e5638', { op: 0.35 }); }
  for (const s of [[[420, 470], [470, 560], [480, 660]], [[360, 700], [420, 760], [500, 800]], [[560, 440], [600, 520], [610, 600]], [[660, 420], [700, 500]], [[540, 900], [600, 880], [660, 840]]]) f.stroke(s, 3, '#1a160c');
  for (const s of [[[520, 340], [600, 334], [680, 356]], [[780, 460], [806, 540]], [[454, 392], [430, 450]]]) f.line(s, 2.2, '#8a8258', { op: 0.5 });
  mossSheet([560, 372], 110, 50, 0.05); mossSheet([400, 580], 44, 90, -1.2); mossSheet([700, 640], 50, 60, 0.3);
  // muscle masses: trapezius ridge, pectoral and belly, the mud caked on the belly, bare-hide patches
  f.stroke([[470, 380], [560, 340], [660, 360], [740, 420]], 4, '#1a1c0c');
  f.stroke([[790, 560], [760, 640], [770, 720]], 3.4, '#1a1c0c');
  f.stroke([[740, 760], [690, 820], [620, 860]], 3, '#1a1c0c');
  for (let i = 0; i < 4; i++) f.line([[624 + i * 26, 800 + i * 8], [650 + i * 26, 830 + i * 10]], 1.2, INK, { op: 0.45 }); // belly creases
  W.mudSplats(f, [620, 880], 120, 30, 14, P.peatD);
  // the back: moss so thick it has tufts, toadstools fruiting on the hump, a reed or two rooted in it
  W.toadstools(f, [600, 336], -1.45, 46, 4);
  W.reed(f, [[410, 470], [376, 400], [352, 330], [340, 260]], 6, { cattail: true });
  W.reed(f, [[420, 480], [400, 420], [392, 370]], 5);
  // wounds closing as you watch: dark gashes stitched over with green growth
  W.knitWound(f, [660, 540], [760, 600], 12);
  W.knitWound(f, [380, 640], [420, 740], 10);
  W.pustules(f, [500, 760], 70, 50, 7, 7, 13, { burst: 0.3 });
  // broken pitchfork tines from some village's last stand, rusted in its flank
  for (const [a, b] of [[[480, 640], [430, 600]], [[500, 660], [452, 622]], [[520, 680], [474, 646]]]) { f.line([a, b], 6, '#2a2018'); f.line([a, b], 3.6, P.ironL); }
  f.line([[430, 600], [474, 646]], 7, '#2a2018'); f.line([[430, 600], [474, 646]], 4, P.iron);
  f.flat(ell([500, 664], 30, 10, 0.7, 10), '#5a3420', { op: 0.4 });

  // ---- the forgotten peat spade, blade sunk in the back, the handle up over the hump
  f.bone('spade');
  const sF = frame(spB, spA, 1);
  f.flat(sF(ell([0, 0], 30, 10, 0, 10)), '#120a06', { op: 0.9 }); // where it went in
  f.part(sF([[-6, -26], [70, -22], [70, 22], [-6, 26]]), { fill: P.iron, shadow: '#140e0a', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.4, sharp: true }); // blade above the wound
  f.part(sF([[2, 24], [60, 22], [64, 64, 1], [16, 70, 1]]), { fill: P.ironL, shadow: '#1a140e', shade: 0.4, inkW: 1.3, sharp: true }); // the slane's side wing
  f.flat(sF([[10, -20], [40, -18], [44, 10], [12, 12]]), '#5a3420', { op: 0.55 }); // rust bloom
  f.part(sF([[64, -14], [88, -12], [88, 12], [64, 14]]), { fill: P.iron, shade: 0.4, inkW: 1.2, sharp: true }); // the socket
  f.part(limb(sF([[84, 0]])[0], spT, 26, 22, { steps: 10 }), { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.7 });
  f.line([sF([[90, -6]])[0], add(spT, [6, 4])], 1.4, P.woodL, { op: 0.6 });
  const tA = spA + Math.PI / 2, tH = [add(spT, rot([46, 0], tA)), add(spT, rot([-46, 0], tA))];
  f.part(limb(tH[0], tH[1], 24, 24, { steps: 6, capK: 1 }), { fill: P.woodL, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.6 }); // T grip, worn pale
  for (let i = 0; i < 5; i++) f.line([lp(spT, sF([[84, 0]])[0], 0.12 + i * 0.03, -13), lp(spT, sF([[84, 0]])[0], 0.14 + i * 0.03, 13)], 2.2, P.ropeD, { straight: true }); // rope wrap
  W.mossClump(f, lp(sF([[84, 0]])[0], spT, 0.4, 0), 16, 8, { ang: spA });

  // ---- near leg: short and thick, the knee bent, a broad flat foot
  leg(HN, KN, AN, 116, 216, 150, '_n', HD());
  f.bone('thigh_n'); mossSheet(lp(HN, KN, 0.35, 10), 74, 50, ang(HN, KN));
  f.bone('thigh_n'); W.knitWound(f, lp(HN, KN, 0.3, 30), lp(HN, KN, 0.7, 40), 10);
  f.bone('shin_n'); W.creaseField(f, lp(KN, AN, 0.1, 0), 50, 24, 5, ang(KN, AN) + 1.5, 70, 4, { lip: 3, lit: '#8a8258', col: '#16140a' }); // knee folds
  f.bone('shin_n'); W.mudSplats(f, lp(KN, AN, 0.6, 0), 50, 70, 14, P.peatD);
  f.bone('foot_n'); W.mudSplats(f, add(AN, [60, 80]), 80, 18, 12, P.peatD);

  // ---- peat slabs plating the shoulders (on the torso: shoulder armour must not fly off with the arm)

  // ---- the head: small, thrust low and forward out of the hump (the trapezius mass rises behind and above it), a heavy
  // brow shelf, eyes deep under it, a broad flat nose, an underbite with peg teeth over a lipless slit, a ragged ear.
  // Nothing else on the body may carry this brow-over-dark-band layout (independent review: the shoulder read as a head).
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-30, 10]), hF([[-0.2, 0.2]])[0]], [150, 110]), HD({ cast: false })); // the thick neck, mostly buried
  const skull = f.part(hF([[-0.48, 0.34], [-0.56, -0.08], [-0.42, -0.3], [-0.08, -0.42], [0.26, -0.4], [0.46, -0.28], [0.54, -0.12], [0.62, 0.02], [0.6, 0.16], [0.54, 0.24], [0.6, 0.32], [0.58, 0.46], [0.42, 0.58], [0.1, 0.64], [-0.24, 0.6]]), SKN({ fill: '#5e5838', cast: true, castOp: 0.5 }));
  W.softTone(f, skull, [[hF(ell([0.3, 0.52], 0.3, 0.1, 0, 10)), '#16140a', 0.55, 7], [hF(ell([0.1, -0.36], 0.3, 0.12, 0, 10)), '#9a9068', 0.35, 8]]);
  // brow shelf, lit along its top, deep shadow under it
  f.part(hF([[-0.2, -0.26], [0.16, -0.36], [0.5, -0.24], [0.58, -0.1], [0.36, -0.06], [0.06, -0.06], [-0.2, -0.12]]), SKN({ fill: '#6e6646', cast: true, castOp: 0.6, k: 0.8 }));
  for (let i = 0; i < 3; i++) W.crease(f, hF([[-0.1 + i * 0.04, -0.34 - i * 0.04], [0.16, -0.4 - i * 0.04], [0.4, -0.34 - i * 0.03]]), 2.6, { lip: 2, lit: '#9a9068' });
  f.flat(hF([[0.04, -0.06], [0.5, -0.08], [0.46, 0.06], [0.1, 0.06]]), '#0c0a06', { op: 0.85 });
  f.flat(hF(ell([0.32, -0.01], 0.05, 0.03, 0, 8)), '#8a8248'); f.flat(hF(ell([0.33, -0.012], 0.018, 0.022, 0, 6)), '#0a0804'); f.flat(hF(ell([0.345, -0.025], 0.01, 0.008, 0, 6)), '#e8e4c0', { op: 0.9 }); // small, dull, wet
  f.flat(hF(ell([0.5, -0.01], 0.022, 0.02, 0, 6)), '#6a6438', { op: 0.9 });
  // broad flat nose with a split from an old blow; nostrils from below
  f.part(hF([[0.42, -0.06], [0.58, 0.04], [0.66, 0.14], [0.6, 0.2], [0.46, 0.2], [0.4, 0.12]]), SKN({ fill: '#6a6242', cast: true, castOp: 0.5, inkW: 1.3 }));
  f.flat(hF(ell([0.52, 0.18], 0.04, 0.018, 0.2, 8)), '#0a0804'); f.flat(hF(ell([0.62, 0.17], 0.025, 0.012, 0, 6)), '#0a0804', { op: 0.8 });
  f.line(hF([[0.5, 0.0], [0.56, 0.08], [0.54, 0.14]]), 1.4, '#9a9068', { op: 0.6 });
  // the underbite: the lower jaw juts past the upper, peg teeth standing up over a lipless slit
  f.flat(hF([[0.14, 0.3], [0.34, 0.28], [0.56, 0.27], [0.56, 0.33], [0.34, 0.35], [0.16, 0.36]]), '#120a06');
  for (const [u, h, w] of [[0.3, 0.1, 0.04], [0.42, 0.13, 0.05], [0.52, 0.09, 0.04]]) f.part(hF([[u - w / 2, 0.34], [u + w / 2, 0.34], [u + w * 0.3, 0.34 - h], [u - w * 0.2, 0.34 - h + 0.01]]), { fill: '#a0946a', shadow: '#5a5030', shade: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false });
  W.crease(f, hF([[0.14, 0.4], [0.34, 0.44], [0.54, 0.42]]), 3, { lip: 2, lit: '#9a9068' }); // the jaw ledge
  W.crease(f, hF([[0.4, 0.2], [0.3, 0.26], [0.18, 0.28]]), 3, { lip: 2, lit: '#9a9068' });
  W.crease(f, hF([[0.12, 0.08], [0.14, 0.22], [0.1, 0.36]]), 3, { lip: 2, lit: '#9a9068' });
  W.warts(f, hF([[0.0, 0.3]])[0], 30, 20, 6, 3, 6, '#5e5838');
  // a ragged ear, half torn, and wet strands of hair matted to the skull
  f.part(hF([[-0.14, -0.04], [-0.04, -0.1], [0.02, 0.04], [-0.02, 0.16], [-0.1, 0.14]]), SKN({ cast: true, castOp: 0.4, inkW: 1.2 }));
  f.flat(hF(ell([-0.06, 0.04], 0.025, 0.05, 0, 8)), '#120c06', { op: 0.8 }); f.flat(hF([[-0.04, -0.1], [0.0, -0.06], [-0.03, -0.03]]), '#120c06'); // torn notch
  for (let i = 0; i < 5; i++) { const p = hF([[-0.1 + i * 0.07, -0.4 + Math.abs(i - 2) * 0.01]])[0]; f.line([p, add(p, [-12 - i * 2, 10]), add(p, [-26 - i * 3, 24])], 1.6, '#1a180c', { op: 0.8 }); } // a few wet strands
  // the trapezius and hump rise behind the head and swallow the back of the skull
  f.bone('torso');
  const trap = [[700, 380], [770, 420], [812, 470], [818, 520], [800, 560], [790, 620], [806, 690], [770, 720], [720, 660], [690, 540]];
  f.part(trap, HD({ cast: true, castOp: 0.5, k: 0.85 }));
  f.line([[780, 440], [806, 500], [800, 556]], 2.4, '#8a8258', { op: 0.5 });
  f.stroke([[740, 460], [770, 560], [776, 660]], 3, '#1a160c');
  mossSheet([760, 440], 46, 26, 0.6);

  // ---- near arm: long and massive, the knuckles planted in the mud
  arm(SN, EN, WN, [196, 184, 110], '_n', HD(), { bp: [[0, 0.4, 0.14], [1, 0.22, 0.12]], bq: [[1, 0.28, 0.16], [0, 0.6, 0.1]] });
  // the deltoid: a tapering muscle mass wrapping the shoulder down to its insertion, not a round cap (a round cap under
  // a turf slab read as a second head)
  f.bone('upperarm_n');
  const dl = [lp(SN, EN, -0.14, 70), lp(SN, EN, -0.16, -50), lp(SN, EN, 0.08, -106), lp(SN, EN, 0.36, -82), lp(SN, EN, 0.56, -30), lp(SN, EN, 0.46, 40), lp(SN, EN, 0.2, 90)];
  f.part(dl, HD({ cast: false, k: 0.85 }));
  for (let i = 0; i < 4; i++) f.line([lp(SN, EN, 0.02 + i * 0.02, -80 + i * 40), lp(SN, EN, 0.3, -60 + i * 30), lp(SN, EN, 0.5, -26 + i * 12)], 2, '#1a160c', { op: 0.5 }); // striations converging on the insertion
  f.line([lp(SN, EN, 0.1, -96), lp(SN, EN, 0.34, -76)], 2.4, '#8a8258', { op: 0.45 });
  mossSheet(lp(SN, EN, 0.72, -30), 44, 40, ang(SN, EN));
  f.bone('forearm_n'); mossSheet(lp(EN, WN, 0.25, 30), 40, 60, ang(EN, WN)); f.bone('upperarm_n');
  f.bone('forearm_n');
  W.knitWound(f, lp(EN, WN, 0.3, -30), lp(EN, WN, 0.6, -10), 12);
  // grit: hide folds wrapping round the forearm and elbow, mud caked in them
  W.creaseField(f, lp(EN, WN, 0.12, 0), 50, 30, 6, ang(EN, WN) + 1.5, 70, 4, { lip: 3, lit: '#8a8258', col: '#16140a' });
  W.creaseField(f, lp(EN, WN, 0.6, 0), 34, 70, 5, ang(EN, WN) + 1.5, 50, 3, { lip: 2, lit: '#8a8258', col: '#16140a' });
  W.mudSplats(f, lp(EN, WN, 0.75, 0), 40, 40, 8, P.peatD);
  // a broken iron shackle on the wrist, the chain end hanging
  f.part(limb(lp(EN, WN, 0.84, -70), lp(EN, WN, 0.84, 70), 24, 24, { steps: 6, capK: 1 }), { fill: P.iron, shadow: '#120e0a', shade: 0.4, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.6 });
  for (let i = 0; i < 3; i++) f.line(ell(add(lp(EN, WN, 0.86, 60), [6, 18 + i * 22]), 8, 12, 0.3 * i, 8).concat([ell(add(lp(EN, WN, 0.86, 60), [6, 18 + i * 22]), 8, 12, 0.3 * i, 8)[0]]), 4, P.iron);
  f.bone('hand_n');
  B.fist(f, add(WN, mul(E.norm(sub(WN, EN)), 70)), ang(EN, WN) - 0.3, 100, mix(hide, '#6a6040', 0.2), { shadow: '#16140a', tex: 'mottle' + seed, texOp: 0.5 });
  W.mudSplats(f, add(WN, [20, 160]), 60, 30, 10, P.peatD);
  // the near pauldron slab: drawn over the arm but bound to the torso, so it stays put when the arm lifts
  // laid along the shoulder slope, overhanging the outside of the arm, so it reads as a turf plate, not a brow
  f.bone('torso');
  // the shoulder mass grows out of the hump over the top of the arm, so the arm emerges from under it (no dome of its own)
  const shm = [[520, 332], [540, 318], [626, 324], [706, 362], [770, 430], [800, 500], [764, 540], [720, 560], [660, 566], [600, 560], [556, 520], [526, 420]];
  const shD = f.part(shm, HD({ inkW: 0, cast: false, shade: 0, hi: 0, k: 0.85 }));
  W.softTone(f, shD, [[[[540, 480], [600, 560], [720, 566], [790, 520], [700, 500]], '#16140a', 0.45, 18], [ell([660, 380], 90, 30, 0.4, 10), '#8a8258', 0.35, 16]]);
  f.line([[540, 318], [626, 324], [706, 362], [770, 430], [800, 500]], 3, INK); // the hump's own outline, carried over
  W.crease(f, [[566, 530], [610, 560], [664, 568], [722, 556], [760, 514]], 8, { lip: 4, lit: '#8a8258' }); // where the arm comes out from under it
  f.line([[640, 400], [700, 430], [736, 476]], 2.4, '#8a8258', { op: 0.45 });
  slab([760, 392], 120, 56, 0.5, mix(P.peat, '#000', 0.1));
  slab([700, 360], 130, 60, 0.32);
  f.line([[640, 320], [700, 340], [780, 380]], 3, P.ropeD); // a rope someone used to lash them on, long since grown in
  slab(lp(SN, EN, 0.02, -20), 190, 58, 0.62, P.peatL);
  W.rope(f, [lp(SN, EN, -0.1, 70), lp(SN, EN, 0.02, -10), lp(SN, EN, 0.12, -96)], 5, { col: P.ropeD });

  f.bone('root');
  f.flat(ell([620, gy + 4], 360, 14, 0, 24), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ COVEN MOTHER (elite 1.9)
// The eldest fen hag: midwife and curse-seller to the stilt villages. Tall and bent from the upper back, leaning her
// weight on a blackthorn staff planted ahead of her, the far hand at her breast knotting a cord. Layered sodden
// shawls hung with charms, dried frogs, bones and twine. A stag's antlers are bound to her head with cord and wire,
// far too big for her, the scalp raw round the bindings. A long face, a hooked nose, one bile-green eye, one milky.
// Rig: standard humanoid + staff (hand_n), antlers (head), shawl (torso), charms (torso), skirt (pelvis), cord (hand_f).
// Motion: idle muttering, fingers knotting the cord; attack pointing the staff and spitting a curse.
function covenMother() {
  const CW = 1100, CH = 1400;
  const f = new Fig(W.base(203, CH, { grimeY: 1080 }));
  W.textures(f);
  const seed = 203, gy = CH - 30, H = 186;
  const SK = (o = {}) => W.SKH(f, Object.assign({ fill: '#9a8a70', shadow: '#4e3e38' }, o));
  const N = [656, 500], C = [520, 516], Pv = [500, 790];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.16), SF = S.at(0.42, 0.08);
  const st0 = [906, 1366], st1 = [862, 300], stA = ang(st0, st1);
  const gN = lerp(st0, st1, 0.66), EN = [740, 706];
  const EF = [690, 650], WF = [742, 596];
  const HN = [520, 800], KN = [590, 1060], AN = [566, 1300];
  const HF = [486, 790], KF = [500, 1060], AF = [450, 1300];
  const HC = [730, 424], hA = 0.34, neck0 = [664, 500];
  const hF = frame(HC, hA, H);
  const burN = hF([[-0.12, -0.46]])[0], burF = hF([[0.1, -0.5]])[0];
  const belt = v => S.at(v, 0.9);

  f.joint('pelvis', Pv).joint('torso', S.at(0, 0.86), 'pelvis').joint('head', neck0, 'torso').joint('antlers', lerp(burN, burF, 0.5), 'head');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('cord', add(WF, [24, -20]), 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', gN, 'forearm_n').joint('staff', gN, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('skirt', S.at(0, 0.95), 'pelvis').joint('shawl', S.at(-0.2, 0.0), 'torso').joint('charms', S.at(0.3, 0.5), 'torso');

  const arm = (S0, E0, W0, ws, sfx, look, o = {}) => {
    const de = elb(S0, E0, W0);
    split(f, () => W.fullArm(f, S0, E0, W0, ws[0], ws[1], ws[2], look, o), [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
  };
  const wool = (o = {}) => Object.assign({ fill: P.wool, shadow: '#1a120a', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 }, o);
  // a stag antler: a tapered beam along a curve with tines branching off it, ridged and pale at the tips
  const antler = (base, beam, tines, w, col) => {
    const tip = (a, b, ww) => { f.part(limb(a, b, ww, ww * 0.3, { steps: 8, capK: 1, p: [[0.3, 0.1, 0.2]] }), { fill: col, shadow: '#4a3a26', shade: 0.42, inkW: 1.4, inkHeavy: 2.6, tex: 'wrinkle' + seed, texOp: 0.4, k: 1 }); f.line([lerp(a, b, 0.7), b], ww * 0.22, P.bone, { op: 0.7 }); };
    for (const [i, a, l] of tines) { const p = beam[i], d = rot([l, 0], a), q = add(add(p, d), [0, -l * 0.15]); tip(p, lerp(p, q, 0.55).map((v, k) => v + (k ? -l * 0.08 : 0)).length ? q : q, w * (0.62 - i * 0.06)); }
    const P2 = [], Q2 = []; beam.forEach((q, i) => { const a = beam[Math.max(0, i - 1)], b = beam[Math.min(beam.length - 1, i + 1)], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], ww = w * (1 - i / beam.length * 0.62) / 2; P2.push(add(q, mul(nn, ww))); Q2.push(add(q, mul(nn, -ww))); });
    const end = beam[beam.length - 1], d0 = E.norm(sub(end, beam[beam.length - 2]));
    f.part([...P2, add(end, mul(d0, w * 0.3)), ...Q2.reverse()], { fill: col, shadow: '#4a3a26', shade: 0.42, inkW: 1.6, inkHeavy: 3, tex: 'wrinkle' + seed, texOp: 0.45, k: 1 });
    for (let i = 1; i < beam.length - 1; i++) f.line([add(beam[i], [-w * 0.2, 0]), add(beam[i + 1], [-w * 0.16, 0])], 1.2, '#4a3a26', { op: 0.6 }); // ridges
    // the burr: a knobbly ring where it was sawn from the stag's skull
    f.part(ell(base, w * 0.75, w * 0.42, 0.2, 14).map((p, i) => i % 2 ? add(p, mul(sub(p, base), 0.18)) : p), { fill: mix(col, '#5a4a30', 0.3), shadow: '#3a2a1a', shade: 0.4, inkW: 1.4, cast: false });
  };

  // ---- the far antler first (behind the head)
  f.bone('antlers');
  const aCol = '#a8916a';
  antler(burF, [burF, add(burF, [46, -60]), add(burF, [110, -124]), add(burF, [156, -196]), add(burF, [168, -268])], [[1, -0.1, 84], [2, 0.2, 74], [3, -0.5, 64]], 30, mix(aCol, '#5a4a30', 0.2));

  // ---- far arm (behind the body) and its hand at the breast, knotting a cord
  arm(SF, EF, WF, [56, 48, 36], '_f', wool({ fill: P.woolD }));
  f.bone('forearm_f');
  f.part(K.ragLimb(f, EF, lp(EF, WF, 0.55, 0), 60, 58, { depth: 10, teeth: 6 }), wool({ fill: P.peat }));
  f.bone('hand_f');
  const hf = B.hand(f, add(WF, [16, -14]), -1.2, 34, '#9a8a70', { spread: 0.25, curl: 0.55, shadow: '#4e3e38' });
  f.bone('cord');
  const cd = add(WF, [24, -20]);
  W.rope(f, [hf.tips[1], add(cd, [6, 30]), add(cd, [0, 90]), add(cd, [4, 150]), add(cd, [-2, 200])], 3.4, { col: P.reedL, fray: true });
  for (const t of [70, 120, 170]) f.part(ell(add(cd, [1, t]), 6, 5, 0, 8), { fill: P.reedL, shade: 0.4, inkW: 1, cast: false }); // knots already tied

  // ---- legs under the skirt: thin hose and bare gnarled feet
  for (const [Hp, Kn, A, sfx, col] of [[HF, KF, AF, '_f', '#7a6a58'], [HN, KN, AN, '_n', '#8a7a64']]) {
    const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => W.fullLeg(f, Hp, Kn, A, 1, 74, 96, 66, SK({ fill: col }), { nail: '#8a7a58' }), [['thigh' + sfx, side(Kn, mul(dk, -1), 40)], ['shin' + sfx, [side(Kn, dk, 40), side(A, mul(da, -1), 26)]], ['foot' + sfx, side(A, da, 26)]]);
  }
  f.bone('foot_n'); W.mudSplats(f, add(AN, [30, 46]), 50, 12, 9, P.peatD);
  f.bone('foot_f'); W.mudSplats(f, add(AF, [26, 46]), 40, 12, 7, P.peatD);

  // ---- underdress and long skirt: dark wool to the ankles, the hem wet, torn and black with mud
  f.bone('skirt');
  const sk = [belt(-0.72), belt(0.6), [660, 960], [690, 1120], [716, 1250], [702, 1286, 1], [680, 1270], [660, 1300, 1], [630, 1276], [600, 1296, 1], [560, 1270], [520, 1292, 1], [480, 1268], [440, 1290, 1], [410, 1262], [386, 1230], [380, 1100], [400, 960]];
  f.part(sk, wool({ fill: '#3e3024' }));
  f.flat([[716, 1250], [702, 1286], [680, 1270], [660, 1300], [630, 1276], [600, 1296], [560, 1270], [520, 1292], [480, 1268], [440, 1290], [410, 1262], [394, 1200], [560, 1190], [700, 1180]], P.peatD, { op: 0.55 });
  for (const s of [[[460, 820], [440, 1000], [430, 1200]], [[560, 830], [570, 1020], [560, 1240]], [[630, 860], [660, 1060], [680, 1230]]]) f.stroke(s, 2.6);
  for (const p of [[702, 1288], [600, 1298], [520, 1294], [440, 1292]]) W.drip(f, p, 1.3, P.peatD);
  for (let i = 0; i < 14; i++) { const p = W.scatter(f, [550, 1050], 140, 180); f.flat(ell(p, 10 + f.r() * 24, 8 + f.r() * 18, f.r() * 3, 10), f.r() > 0.5 ? '#2a2018' : '#5a4a36', { op: 0.22 }); } // stains and wear
  W.mudSplats(f, [560, 1230], 150, 40, 16, P.peatD);
  f.part([[590, 1100], [640, 1094], [646, 1146], [596, 1152]], wool({ fill: P.woolL, inkW: 1.2 })); f.stitches([[590, 1100], [640, 1094], [646, 1146], [596, 1152], [590, 1100]], P.boneD, 1);

  // ---- body under the shawls
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.34, 0.34], [0.06, 0.66, 0.58], [0.24, 0.74, 0.6], [0.46, 0.7, 0.54], [0.66, 0.66, 0.54], [0.86, 0.7, 0.6], [1.0, 0.72, 0.6]]);
  f.part(torso, wool({ fill: '#3e3024' }));

  // ---- the great shawl: wrapped over the hunched back and shoulders, sodden, fringed, hung with charms
  f.bone('shawl');
  const sh = [S.at(-0.3, -0.14), S.at(0.5, -0.06), S.at(0.76, 0.12), S.at(0.7, 0.36), S.at(0.6, 0.6), [...S.at(0.54, 0.82), 1], S.at(0.4, 0.7), S.at(0.1, 0.62), [...S.at(-0.2, 0.84), 1], S.at(-0.4, 0.7), [...S.at(-0.66, 0.9), 1], S.at(-0.84, 0.74), S.at(-0.96, 0.46), S.at(-0.9, 0.16), S.at(-0.66, -0.06)];
  f.part(sh, wool({ fill: P.peat }));
  for (const s of [[[-0.5, 0.0], [-0.7, 0.3], [-0.72, 0.68]], [[-0.1, 0.04], [-0.3, 0.36], [-0.36, 0.66]], [[0.3, 0.04], [0.4, 0.3], [0.44, 0.6]], [[-0.8, 0.2], [-0.88, 0.5]]]) f.stroke(s.map(v => S.at(v[0], v[1])), 3);
  W.fringe(f, [S.at(-0.2, 0.84), S.at(-0.4, 0.76), S.at(-0.6, 0.88), S.at(-0.78, 0.8), S.at(0.5, 0.8), S.at(0.3, 0.72)], 40, 10, P.peat);
  // a second, lighter shawl over the shoulders, darned and stained
  const sh2 = [S.at(-0.36, -0.2), S.at(0.46, -0.12), S.at(0.64, 0.04), S.at(0.3, 0.26), S.at(-0.1, 0.3), [...S.at(-0.44, 0.42), 1], S.at(-0.62, 0.3), S.at(-0.74, 0.08)];
  f.part(sh2, wool({ fill: P.sack, shadow: '#2a2014' }));
  f.part([S.at(-0.4, 0.08), S.at(-0.2, 0.06), S.at(-0.2, 0.2), S.at(-0.42, 0.22)], wool({ fill: mix(P.sack, '#000', 0.2), inkW: 1.1 })); f.stitches([S.at(-0.4, 0.08), S.at(-0.2, 0.06), S.at(-0.2, 0.2), S.at(-0.42, 0.22), S.at(-0.4, 0.08)], P.boneD, 0.9);
  f.flat(ell(S.at(0.2, 0.12), 24, 14, 0.3, 10), P.bileD, { op: 0.4 }); // a bile stain
  W.mossClump(f, S.at(-0.7, 0.04), 30, 10);
  W.toadstools(f, S.at(-0.6, -0.02), -1.9, 28, 3);
  // ---- charms hung from the shawl edge on cords, falling plumb
  f.bone('charms');
  const hang = (p, len, draw) => { f.line([p, add(p, [0, len])], 1.6, P.ropeD); draw(add(p, [0, len])); };
  hang(S.at(-0.4, 0.74), 40, q => W.driedFrog(f, add(q, [0, 22]), 40, 0.05));
  hang(S.at(-0.66, 0.84), 30, q => W.boneCharm(f, q, add(q, [4, 34]), 9));
  hang(S.at(0.12, 0.62), 50, q => W.driedFrog(f, add(q, [0, 20]), 34, -0.1));
  hang(S.at(0.34, 0.7), 26, q => W.herbBundle(f, q, 0.05, 50));
  hang(S.at(-0.2, 0.84), 56, q => { W.boneCharm(f, q, add(q, [-2, 28]), 8); f.part(ell(add(q, [0, 40]), 12, 9, 0, 10), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.2, cast: false }); f.flat(ell(add(q, [3, 38]), 3, 3, 0, 6), INK); }); // a bird skull
  hang(S.at(0.5, 0.78), 34, q => { for (let i = 0; i < 3; i++) f.part(ell(add(q, [0, i * 9]), 5, 4, 0, 8), { fill: P.boneD, shade: 0.4, inkW: 1, cast: false }); }); // knucklebones on twine

  // ---- head: long face, hooked nose, one bile-green eye and one milky; lank grey-black hair
  f.bone('head');
  f.part(K.chain([add(neck0, [-10, 20]), hF([[-0.06, 0.4]])[0]], [64, 52]), SK());
  f.line([add(neck0, [10, 10]), hF([[0.06, 0.44]])[0]], 1.6, '#4e3e38', { op: 0.7 }); // the cords of the neck
  f.part(hF([[-0.5, 0.5], [-0.56, 0.0], [-0.4, -0.4], [-0.1, -0.52], [0.2, -0.48], [0.2, -0.3], [-0.2, -0.24], [-0.3, 0.1], [-0.28, 0.6]]), { fill: '#3a3632', shadow: '#16140f', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3 }); // hair behind
  B.head(f, HC, H, hA, {
    skin: '#9a8a70', jaw: 0.92, chin: 0.1, nose: 1.32, hook: 0.9, mouth: 'set', squint: 0.25, browDown: 0.06, faceShade: 0.45, jawShade: 0.22, gaunt: true, age: true, noEar: true,
    iris: '#6a7a2a', eyeWhite: '#c8c09c', glint: true, hairCol: '#3a3632', browCol: '#5a5650',
  });
  f.flat(hF(ell([0.135, -0.056], 0.026, 0.024, 0, 10)), '#8a9a3a'); f.flat(hF(ell([0.135, -0.056], 0.01, 0.012, 0, 6)), '#0a0a04'); f.flat(hF(ell([0.128, -0.062], 0.005, 0.005, 0, 6)), '#fff'); // bile-green eye
  f.flat(hF([[0.262, -0.062], [0.29, -0.078], [0.318, -0.066], [0.3, -0.05], [0.274, -0.05]]), '#d4d2c4'); f.flat(hF(ell([0.296, -0.062], 0.012, 0.012, 0, 8)), '#a8a89c', { op: 0.8 }); f.line(hF([[0.262, -0.064], [0.29, -0.08], [0.318, -0.068]]), 1.6, INK); // the far eye: milky, blind, a ghost of an iris
  // age: crow's feet, the tear trough, the cheek sunk under the bone, the nasolabial fold, puckered lips working
  const hD0 = hF(ell([0.1, 0.12], 0.32, 0.36, 0, 16));
  for (let i = 0; i < 4; i++) W.crease(f, hF([[0.06, -0.05 + i * 0.03], [-0.02, -0.07 + i * 0.05], [-0.09, -0.08 + i * 0.07]]), 1.8, { lip: 1.4, lit: '#c8b8a0', col: '#3a2a24' });
  W.crease(f, hF([[0.06, 0.02], [0.14, 0.04], [0.2, 0.02]]), 2, { lip: 1.5, lit: '#c8b8a0', col: '#3a2a24' });
  W.crease(f, hF([[0.26, 0.14], [0.22, 0.22], [0.18, 0.3]]), 2.6, { lip: 2, lit: '#c8b8a0', col: '#3a2a24' });
  W.crease(f, hF([[0.02, 0.1], [0.06, 0.2], [0.04, 0.3]]), 2, { lip: 1.5, lit: '#c8b8a0', col: '#3a2a24' });
  for (let i = 0; i < 5; i++) f.line(hF([[0.2 + i * 0.022, 0.28], [0.198 + i * 0.024, 0.255]]), 1, '#3a2a24', { op: 0.6 });
  f.flat(hF(ell([0.08, 0.16], 0.09, 0.07, 0.3, 12)), '#3e2e28', { op: 0.25 });
  f.line(hF([[0.2, 0.31], [0.25, 0.33], [0.3, 0.31]]), 1.4, INK, { op: 0.7 }); // the mouth working, muttering
  f.flat(hF([[0.21, 0.3], [0.29, 0.3], [0.27, 0.33], [0.23, 0.33]]), '#1a0e0a', { op: 0.8 });
  for (const s of [[[0.04, 0.08], [0.1, 0.2]], [[-0.02, 0.18], [0.06, 0.3]], [[0.12, 0.38], [0.22, 0.44]]]) f.line(hF(s), 1.2, INK, { op: 0.5 }); // deep lines
  f.part(hF(ell([0.36, 0.06], 0.03, 0.028, 0, 8)), { fill: '#8a6a5a', inkW: 1, cast: false, shade: 0.4 }); // wart on the hook of the nose
  // lank hair over the brow and hanging plumb past the ear, wet strands
  f.part(hF([[-0.36, 0.2], [-0.4, -0.2], [-0.2, -0.46], [0.1, -0.5], [0.24, -0.4], [0.06, -0.38], [-0.1, -0.28], [-0.2, -0.04], [-0.24, 0.2]]), { fill: '#3a3632', shadow: '#16140f', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3 });
  for (const [u, v, l, sw] of [[-0.3, 0.1, 150, -6], [-0.22, 0.18, 120, 4], [-0.36, 0.0, 170, -2]]) { const p = hF([[u, v]])[0]; f.stroke([p, add(p, [sw * 0.4, l * 0.4]), add(p, [sw, l * 0.75]), add(p, [sw * 0.6, l])], 9, '#3a3632'); f.line([p, add(p, [sw * 0.4 - 2, l * 0.4]), add(p, [sw - 2, l * 0.7])], 1.2, '#8a867e', { op: 0.6 }); }
  // raw scalp round the burrs, a dried trickle of blood
  for (const b of [burN, burF]) { f.flat(ell(add(b, [0, 6]), 26, 10, hA, 12), '#7a4a3a', { op: 0.6 }); for (let i = 0; i < 5; i++) f.flat(ell(add(b, [-18 + i * 9, 6 + (i % 2) * 4]), 2.4, 1.8, 0, 6), '#2a1410', { op: 0.8 }); } // inflamed, scabbed
  f.line([add(burN, [-8, 14]), add(burN, [-12, 40]), add(burN, [-8, 70])], 2.2, '#5c0f0b', { op: 0.8 });

  // ---- the near antler, then the bindings: cord and wire round both burrs and down under the jaw
  f.bone('antlers');
  antler(burN, [burN, add(burN, [-56, -56]), add(burN, [-120, -120]), add(burN, [-160, -196]), add(burN, [-160, -272])], [[1, -2.7, 100], [2, -0.5, 84], [3, -2.5, 70], [3, -1.0, 62]], 34, aCol);
  f.bone('head');
  for (const k of [0, 1]) { const b = k ? burF : burN; W.rope(f, [add(b, [-26, 4]), add(b, [0, 14]), add(b, [26, 2])], 4.5, { col: P.ropeD }); }
  W.rope(f, [add(burN, [-20, 10]), hF([[-0.26, -0.1]])[0], hF([[-0.2, 0.3]])[0], hF([[0.02, 0.54]])[0], hF([[0.2, 0.5]])[0]], 4, { col: P.ropeD }); // under the jaw
  f.line([add(burF, [18, 6]), hF([[0.24, -0.3]])[0], hF([[0.3, -0.16]])[0]], 3, P.greyD); f.line([add(burF, [18, 6]), hF([[0.24, -0.3]])[0], hF([[0.3, -0.16]])[0]], 1.3, '#a8a49a'); // twisted wire
  for (let i = 0; i < 4; i++) { const q = lerp(burN, burF, i / 3); f.line([add(q, [-4, -2]), add(q, [4, 4])], 1.2, '#a8a49a', { op: 0.9 }); }

  // ---- the staff: blackthorn, crooked, topped with a forked crook wound in twine and a toad's skull
  f.bone('staff');
  f.part(limb(st0, st1, 22, 18, { steps: 12, p: [[0.3, 0.2, 0.06], [0.62, 0.25, 0.05]], q: [[0.45, 0.2, 0.05], [0.8, 0.2, 0.05]] }), { fill: '#2e2620', shadow: '#120e0a', tex: 'wood' + seed, texOp: 0.6 });
  for (const t of [0.22, 0.4, 0.55, 0.78]) { const p = lp(st0, st1, t, 10); f.part([p, add(p, [10, -8]), add(p, [3, 2])], { fill: '#2e2620', shade: 0.4, inkW: 1, cast: false }); } // thorns
  const fk = st1; f.stroke([fk, add(fk, [-16, -40]), add(fk, [-34, -64])], 12, '#2e2620'); f.stroke([fk, add(fk, [20, -36]), add(fk, [16, -70])], 10, '#2e2620');
  for (let i = 0; i < 6; i++) f.line([add(fk, [-14, 10 + i * 6]), add(fk, [14, 6 + i * 6])], 2.4, P.reedL, { straight: true });
  f.part(ell(add(fk, [0, -36]), 18, 14, 0, 12), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.3 }); f.flat(ell(add(fk, [6, -38]), 5, 4, 0, 8), INK); f.flat(ell(add(fk, [-6, -38]), 4, 4, 0, 8), INK); // toad skull
  f.line([add(fk, [8, 16]), add(fk, [12, 60])], 1.4, P.ropeD); W.driedFrog(f, add(fk, [12, 80]), 30, 0.1);
  f.flat([lp(st0, st1, 0.0, -12), lp(st0, st1, 0.0, 12), lp(st0, st1, 0.12, 11), lp(st0, st1, 0.15, -4)], P.peatD, { op: 0.85 });

  // ---- near arm, the long-fingered hand on the staff
  arm(SN, EN, gN, [60, 50, 34], '_n', wool({ fill: P.woolD }));
  f.bone('forearm_n');
  f.part(limb(lp(EN, gN, 0.55, 0), lp(EN, gN, 0.92, 0), 34, 30, { capA: false }), SK({ cast: false }));
  f.part(K.ragLimb(f, EN, lp(EN, gN, 0.6, 0), 62, 62, { depth: 12, teeth: 7 }), wool({ fill: P.peat }));
  f.line([lp(EN, gN, 0.7, -10), lp(EN, gN, 0.86, -8)], 1.4, '#4e3e38', { op: 0.7 }); // tendon
  f.bone('hand_n');
  B.grip(f, gN, EN, stA, 30, '#9a8a70', { shadow: '#4e3e38', tex: 'mottle' + seed, texOp: 0.5, name: 'coven staff' });
  for (let i = 0; i < 2; i++) f.part(limb(add(gN, [16, -14 + i * 18]), add(gN, [34, -6 + i * 18]), 9, 6, { steps: 4, capK: 1 }), SK({ cast: false, inkW: 1 })); // long fingertips curling past the grip

  f.bone('root');
  f.flat(ell([620, gy + 4], 300, 12, 0, 24), P.waterL, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ THE MIRE MOTHER (ruler 4)
// The fen's oldest drowned head, swollen to the size of a house: a woman drowned as an offering centuries before the
// Breaking, now a colossal head of bog-tanned leather sunk to the chin in black water and filling the frame. Built as
// real anatomy preserved and distorted by the peat (independent review rebuild): a three-quarter head with a heavy brow
// ridge, temples and cheeks sunk to the bone, a nose pressed flat and pushed aside but still a nose (bridge, bulb, wing,
// nostrils seen from below), lips shrunk back off long stained teeth and receded gums, heavy hooded lids with clumped
// lashes half over bile-green eyes, a crumpled ear, and the hair in many wet matted clumps hanging plumb into the water.
// The leather is creased in folds that follow the face (forehead, crow's feet, tear troughs, nasolabial and marionette
// folds, slack cheek), mottled and stained, with blisters and moss in the hollows. Reeds, moss and toadstools grow from
// the scalp; the hags' lanterns hang from the reeds. The Tooth sits in her lower jaw as one of her teeth.
// Rig: water (root) > head > jaw; head > lid_n, lid_f, reed_1..4 > lantern_1..3, hair; water > noose_end. The jaw seam
// runs down the marionette fold; the jaw repeats the head's skin layers in the same user space, so at rest it is seamless.
// Motion: idle a slow blink (scale the lid bones down over the eyes) and bubbles at the lips; attack the mouth opening
// and a gush of poisoned water (the gush is an effect layer, not part of the figure).
function mireMother() {
  const CW = 1600, CH = 1600;
  const f = new Fig(W.base(201, CH, { grimeY: null, wobble: 2.2, inkW: 2.2, inkHeavy: 5 }));
  W.textures(f);
  const seed = 201, yw = 1384;
  const skin = '#5c3c24', skinL = '#93673e', sheen = '#c8986a', shad = '#1e120a', fold = '#140a05';
  const lip = '#5a2c20', gum = '#3e1a12';
  const hinge = [900, 900];
  const EF = [1390, 694];
  f.joint('water', [800, yw]).joint('head', [780, 1380], 'water').joint('jaw', hinge, 'head');
  f.joint('lid_n', [1186, 664], 'head').joint('lid_f', [1390, 672], 'head').joint('hair', [560, 330], 'head');
  const reeds = [
    { root: [556, 350], pts: [[556, 350], [560, 262], [540, 120], [520, -10], [500, -120]], w: 18, ct: false },
    { root: [700, 246], pts: [[700, 246], [700, 200], [690, 60], [700, -60], [712, -160]], w: 20, ct: true },
    { root: [880, 196], pts: [[880, 196], [930, 70], [1040, 0], [1150, 20], [1200, 70]], w: 16, ct: false, bent: true },
    { root: [444, 470], pts: [[444, 470], [440, 350], [360, 210], [270, 150], [190, 160], [150, 210]], w: 16, ct: false, bent: true },
  ];
  reeds.forEach((r, i) => f.joint('reed_' + (i + 1), r.root, 'head'));
  const lanterns = [{ reed: 3, top: [1196, 76], cord: 120 }, { reed: 4, top: [156, 206], cord: 150 }, { reed: 2, top: [693, 40], cord: 90 }];
  lanterns.forEach((l, i) => f.joint('lantern_' + (i + 1), l.top, 'reed_' + l.reed));
  f.joint('noose_end', [960, yw], 'water');

  // ---- reeds rising out of the scalp, off the top of the frame (drawn behind the head where they root)
  reeds.forEach((r, i) => { f.bone('reed_' + (i + 1)); W.reed(f, r.pts, r.w, { cattail: r.ct, leaf: i === 1 ? [1, 70, 160] : i === 0 ? [1, -60, 140] : undefined }); });
  lanterns.forEach((l, i) => { f.bone('lantern_' + (i + 1)); f.line([l.top, add(l.top, [0, l.cord])], 2.4, P.ropeD); W.lantern(f, add(l.top, [0, l.cord]), 54, { glowOp: 0.12 }); f.line([add(l.top, [0, 30]), add(l.top, [14, 44])], 1.6, P.ropeD); W.boneCharm(f, add(l.top, [14, 44]), add(l.top, [16, 70]), 7); });

  // big-scale hatching for a head this size (the shared hatch is too fine to read as tone here)
  f.defs.push(`<pattern id="bh${seed}" patternUnits="userSpaceOnUse" width="11" height="11" patternTransform="rotate(-38)"><line x1="2" y1="0" x2="2" y2="11" stroke="${INK}" stroke-width="2"/></pattern><pattern id="bx${seed}" patternUnits="userSpaceOnUse" width="11" height="11" patternTransform="rotate(42)"><line x1="2" y1="0" x2="2" y2="11" stroke="${INK}" stroke-width="1.8"/></pattern>`);

  // ---- the head outline: three-quarter view, crown flattened by the peat, brow ridge, far eye notch, nose, the lips
  // drawn back over the teeth, the chin, then the neck going under
  const crown = [[330, 1384], [296, 1330], [268, 1252], [250, 1160], [262, 1080], [240, 992], [236, 900], [250, 822], [274, 772], [306, 742], [320, 704], [306, 664], [330, 612], [358, 584], [384, 534], [420, 494], [462, 466], [500, 458], [524, 428], [566, 388], [612, 340], [668, 296], [740, 256], [830, 226], [940, 208], [1050, 222], [1120, 240], [1168, 248], [1196, 268]];
  const topY = x => { for (let i = 9; i < crown.length - 1; i++) if (crown[i + 1][0] >= x) { const a = crown[i], b = crown[i + 1]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 260; };
  const headP = [...crown, [1222, 298], [1244, 304], [1276, 334], [1328, 410], [1368, 498], [1394, 568], [1402, 612], [1398, 652], [1408, 684], [1426, 724], [1448, 772], [1472, 826], [1492, 872], [1498, 904], [1488, 930], [1466, 946], [1440, 954], [1420, 960], [1418, 978], [1426, 1000], [1432, 1036], [1432, 1048], [1430, 1076], [1420, 1092], [1406, 1112], [1394, 1142], [1404, 1188], [1408, 1240], [1394, 1292], [1356, 1334], [1296, 1356], [1236, 1384]];
  const MC = [1240, 1054]; // the near mouth corner, pulled back into the cheek
  const jawP = [MC, [1300, 1050], [1370, 1046], [1432, 1042], [1432, 1048], [1430, 1076], [1420, 1092], [1406, 1112], [1394, 1142], [1404, 1188], [1408, 1240], [1394, 1292], [1356, 1334], [1324, 1346], [1300, 1270], [1280, 1190], [1262, 1120], [1248, 1080]];
  const BB = [220, 160, 1520, 1400];
  // the skin's shared layers, drawn in user space so the jaw can repeat them exactly inside its own clip
  { let g = ''; const r = E.rng(seed * 13), N = 6, T = 150, pt = []; for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) pt.push([i * T / N + (i % N ? (r() - 0.5) * 18 : 0), j * T / N + (j % N ? (r() - 0.5) * 18 : 0)]);
    const at = (i, j) => pt[j * (N + 1) + i];
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) for (const [di, dj] of [[1, 0], [0, 1]]) { if (i + di > N || j + dj > N || r() < 0.35) continue; const a = at(i, j), b = at(i + di, j + dj), m = add(lerp(a, b, 0.5), [(r() - 0.5) * 8, (r() - 0.5) * 8]); g += `<path d="M${a[0].toFixed(1)},${a[1].toFixed(1)} L${m[0].toFixed(1)},${m[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1.3" opacity="0.5"/><path d="M${(a[0] - 0.8).toFixed(1)},${(a[1] + 1.4).toFixed(1)} L${(m[0] - 0.8).toFixed(1)},${(m[1] + 1.4).toFixed(1)}" fill="none" stroke="#c89868" stroke-width="0.8" opacity="0.35"/>`; }
    f.defs.push(`<pattern id="crk${seed}" patternUnits="userSpaceOnUse" width="${T}" height="${T}" patternTransform="rotate(-8)">${g}</pattern>`); }
  const skinLayers = (d) => {
    f.flat(d, `url(#crk${seed})`, { op: 0.55 }); // the leather crackle
    W.stains(f, d, BB, '#140a04', 0.011, 3.4, -1.75, 1, 0.5); // big peat stains
    W.stains(f, d, BB, '#a8804e', 0.018, 3.6, -2.2, 5, 0.32); // paler tanned patches
    W.stains(f, d, BB, '#1a0e06', 0.09, 4.2, -2.55, 9, 0.5, 2); // pores and pits
    W.softTone(f, d, [
      [[[236, 700], [300, 480], [450, 330], [650, 250], [800, 280], [760, 560], [760, 900], [860, 1200], [960, 1384], [250, 1384]], shad, 0.6, 46], // the side of the head turns away
      [[[600, 260], [900, 200], [1120, 240], [1000, 330], [760, 340]], skinL, 0.35, 40], // the crown
      [ell([1180, 430], 160, 120, -0.4, 18), skinL, 0.55, 42], // forehead plane
      [ell([1010, 520], 66, 130, 0.25, 14), shad, 0.75, 24], // temple hollow, sunk deep
      [ell([1196, 706], 150, 92, 0, 18), '#0e0604', 0.72, 26], // the eye socket
      [ell([1236, 640], 150, 26, -0.06, 14), '#000', 0.4, 12], // under the brow shelf
      [ell([1250, 590], 140, 26, -0.08, 14), sheen, 0.45, 14], // the brow ridge
      [ell([1196, 826], 100, 40, -0.25, 14), skinL, 0.6, 22], // cheekbone
      [ell([1170, 900], 120, 34, -0.2, 14), shad, 0.5, 18], // under the cheekbone
      [ell([1150, 990], 104, 130, 0.15, 16), shad, 0.6, 34], // the cheek sunk to the bone
      [ell([960, 1040], 80, 150, 0.1, 14), shad, 0.35, 34], // under the ear, the jaw muscle wasted
      [[[950, 1150], [1150, 1260], [1360, 1336], [1240, 1390], [900, 1390]], shad, 0.75, 26], // the neck under the jaw
      [ell([1430, 800], 26, 92, -0.5, 14), sheen, 0.45, 12], // nose bridge
      [ell([1462, 884], 30, 24, 0, 12), sheen, 0.5, 9], // nose tip
      [ell([1440, 958], 64, 16, 0, 12), '#000', 0.55, 9], // under the nose
      [ell([1352, 1220], 44, 70, 0.1, 14), skinL, 0.5, 22], // chin
      [ell([1252, 1054], 30, 22, 0, 12), '#000', 0.5, 10], // mouth corner
    ]);
    // the cel shadow band: hard-edged on the turned-away side and under the jaw, crosshatched where it is deepest
    const band = [[236, 980], [250, 740], [300, 540], [400, 392], [470, 400], [400, 560], [380, 760], [420, 1000], [520, 1200], [640, 1384], [290, 1384]];
    const neck = [[960, 1168], [1060, 1224], [1180, 1276], [1290, 1316], [1360, 1336], [1300, 1360], [1240, 1388], [880, 1388], [900, 1250]];
    clipped(d, () => {
      f.flat(band, shad, { op: 0.45 }); f.flat(band, `url(#bh${seed})`, { op: 0.4 }); f.flat(band, `url(#bx${seed})`, { op: 0.3 });
      f.flat(neck, shad, { op: 0.3 }); f.flat(neck, `url(#bh${seed})`, { op: 0.35 }); f.flat(neck, `url(#bx${seed})`, { op: 0.25 });
      f.flat([[1060, 900], [1180, 920], [1230, 1000], [1236, 1110], [1180, 1160], [1080, 1080]], `url(#bh${seed})`, { op: 0.22 }); // cheek hollow
    });
  };
  const clipped = (d, fn) => { const cid = f.id('sc'); f.defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`); const k = f.out.length; fn(); const inner = f.out.splice(k).join('\n'); f.raw(`<g clip-path="url(#${cid})">${inner}</g>`); };

  // ================= head, layer 1: skin, modelling and the features of the upper face
  f.bone('head');
  const headD = f.part(headP, { fill: skin, shade: 0, hi: 0, tex: 'mottle' + seed, texOp: 0.75, k: 0.95, castOp: 0.3 });
  skinLayers(headD);
  f.line([[1236, 1384], [1296, 1356], [1356, 1334]], 5, INK); f.line(crown.slice(0, 14), 5, INK); // heavy ink on the shadow side
  // leather sheen along the lit planes (bog skin shines like oiled hide)
  for (const s of [[[1150, 330], [1250, 380], [1310, 440]], [[1290, 470], [1340, 520]], [[1150, 800], [1230, 790], [1290, 770]], [[1404, 1170], [1398, 1230]]]) f.line(s, 3, sheen, { op: 0.4 });

  // forehead: long creases arching over the dome, broken; frown lines between the brows
  for (let i = 0; i < 7; i++) {
    const y0 = 340 + i * 32 + (f.r() - 0.5) * 12, x0 = 1010 + i * 10, x1 = 1330 + i * 4 - (i < 2 ? 40 : 0), cut = 0.3 + f.r() * 0.4;
    const pts = [[x0, y0 + 40 - i * 2], [x0 + (x1 - x0) * 0.3, y0 + 6], [x0 + (x1 - x0) * 0.65, y0 + 4], [x1, y0 + 26 + i * 3]];
    const m = Math.floor(cut * 3);
    const wd = i % 3 === 1 ? 10 : 4 + f.r() * 4;
    W.crease(f, pts.slice(0, m + 2), wd, { lip: 4, op: 0.5 + f.r() * 0.35 });
    if (m + 1 < 3 && f.r() > 0.3) W.crease(f, pts.slice(m + 1).map(q => add(q, [10, 4 + f.r() * 6])), wd * 0.7, { lip: 4, op: 0.6 });
  }
  W.crease(f, [[1326, 548], [1332, 590], [1330, 630]], 7, { lip: 4 }); W.crease(f, [[1302, 560], [1308, 600], [1304, 634]], 5, { lip: 3 });
  W.creaseField(f, [1000, 470], 50, 90, 6, 1.9, 70, 4, { lip: 3 }); // temple
  // brow ridge and its matted brow hair
  W.crease(f, [[1060, 652], [1140, 628], [1240, 620], [1340, 630]], 9, { lip: 5, op: 0.6 });
  for (let i = 0; i < 46; i++) { const t = f.r(), p = add(lerp([1340, 610], [1066, 636], t), [0, (f.r() - 0.5) * 20 - Math.sin(t * Math.PI) * 10]), a = Math.PI + 0.25 + (f.r() - 0.5) * 0.5, l = 14 + f.r() * 16; f.line([p, add(p, rot([l * 0.6, -2], a)), add(p, rot([l, 1], a))], 1.6 + f.r() * 1.4, f.r() > 0.75 ? '#7a3a1e' : '#2a140a', { op: 0.85 }); }

  // ---- the near eye: deep in its socket, a heavy hooded upper lid half shut, a baggy lower lid, yellowed bloodshot white
  const O = [1098, 706], I = [1276, 716];
  const up = [O, [1134, 714], [1184, 717], [1234, 716], I], lo = [I, [1236, 740], [1178, 746], [1126, 736], O];
  const eyeD = f.part([...up, ...lo.slice(1, -1)], { fill: '#968052', shadow: '#4a3a20', shade: 0.45, inkW: 1.4, inkHeavy: 2, cast: false, hatch: false });
  clipped(eyeD, () => {
    for (let i = 0; i < 9; i++) { const s = f.r() > 0.5 ? O : I, d = s === O ? 1 : -1, p = add(s, [d * 6, (f.r() - 0.5) * 10]); f.line([p, add(p, [d * (14 + f.r() * 16), (f.r() - 0.5) * 12]), add(p, [d * (26 + f.r() * 20), (f.r() - 0.5) * 16])], 1.1, '#8a2a1a', { op: 0.6 }); }
    f.part(ell([1190, 724], 31, 31, 0, 22), { fill: P.bile, shadow: P.bileD, shade: 0.38, inkW: 1.6, inkHeavy: 2, cast: false, hatch: false });
    for (let i = 0; i < 22; i++) { const a = i * 0.29, r0 = 13 + f.r() * 3; f.line([add([1190, 724], rot([r0, 0], a)), add([1190, 724], rot([28, 0], a + (f.r() - 0.5) * 0.2))], 1, i % 3 ? P.bileD : P.bileL, { op: 0.6 }); }
    W.softTone(f, eyeD, [[ell([1192, 718], 34, 34, 0, 16), '#3a4a10', 0.0, 4], [ell([1188, 716], 110, 14, 0, 12), '#0a0602', 0.85, 7]]);
    f.flat(ell([1192, 726], 12, 13, 0, 14), '#060402');
    f.flat(ell([1190, 724], 30, 30, 0, 18), '#d8d4b0', { op: 0.16 }); // the film of the drowned
    f.flat(ell([1204, 726], 5, 3, -0.4, 8), '#f4f0d8', { op: 0.85 }); f.flat(ell([1176, 736], 3, 2, 0, 6), '#f4f0d8', { op: 0.45 }); // wet glints
  });
  // lower lid: wet rim, the bag, the tear trough under it, sparse lower lashes
  f.stroke(lo, 4.5, '#3a1c10', { op: 0.85 }); f.line(lo.slice(1, -1).map(q => add(q, [0, -5])), 3, '#7a2a1a', { op: 0.45 }); // the rheumy red rim f.line(lo.slice(1, -1).map(q => add(q, [0, -3])), 1.4, '#c8a880', { op: 0.55 });
  for (let i = 0; i < 6; i++) { const p = lerp(lo[1], lo[3], (i + f.r() * 0.5) / 6); f.line([add(p, [0, 3]), add(p, [2 - i * 0.6, 8 + f.r() * 5])], 1.3, INK, { op: 0.6 }); }
  f.part([[1088, 714], [1130, 742], [1180, 752], [1240, 746], [1284, 722], [1296, 744], [1262, 782], [1182, 798], [1108, 778], [1080, 744]], { fill: mix(skin, '#4a2a2a', 0.12), shadow: '#3a2416', shade: 0.25, maxShade: 14, hi: 0, inkW: 0, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
  W.crease(f, [[1110, 772], [1176, 794], [1238, 786]], 5, { lip: 4, op: 0.6 });
  W.crease(f, [[1150, 818], [1230, 812], [1300, 778], [1318, 752]], 8, { lip: 5 }); // tear trough, deepest toward the nose
  W.crease(f, [[1080, 800], [1120, 824], [1170, 836]], 4, { lip: 3, op: 0.55 });
  // crow's feet fanning back from the outer corner
  for (let i = 0; i < 7; i++) { const a = Math.PI - 0.55 + i * 0.18, p = add(O, [-14, 0]), l = 60 + f.r() * 60; W.crease(f, [p, add(p, rot([l * 0.5, (f.r() - 0.5) * 6], a)), add(p, rot([l, (f.r() - 0.5) * 10], a))], 4 + f.r() * 3, { lip: 3 }); }

  // ---- the far eye, foreshortened behind the bridge: a sliver of green under a heavy lid
  f.flat(ell([1388, 692], 28, 22, 0, 12), '#0e0604', { op: 0.7 });
  const efD = f.part([[1370, 694], [1388, 686], [1404, 690], [1408, 702], [1392, 708], [1374, 702]], { fill: '#a08c62', shade: 0.4, inkW: 1.4, inkHeavy: 1.6, cast: false, hatch: false });
  clipped(efD, () => { f.flat(ell([1394, 698], 9, 11, 0, 10), P.bileD); f.flat(ell([1396, 699], 4, 6, 0, 8), '#060402'); f.flat(ell([1398, 694], 2, 1.5, 0, 6), '#f4f0d8', { op: 0.8 }); });
  f.stroke([[1374, 704], [1390, 710], [1408, 704]], 4, '#2e140c');

  // ---- the nose: pressed flat by the peat and pushed aside, but still a nose: bridge, bulb, wing, nostrils from below
  const noseD = f.part([[1352, 652], [1384, 700], [1420, 758], [1452, 818], [1480, 862], [1498, 902], [1490, 930], [1466, 946], [1440, 952], [1414, 954], [1388, 950], [1360, 940], [1342, 916], [1346, 884], [1358, 840], [1356, 770], [1344, 700]], { fill: skin, shadow: '#2a1810', shade: 0, hi: 0, inkW: 0, cast: false, tex: 'mottle' + seed, texOp: 0.75 });
  f.line([[1398, 652], [1408, 684], [1426, 724], [1448, 772], [1472, 826], [1492, 872], [1498, 904], [1488, 930], [1466, 946]], 2.4, INK);
  W.softTone(f, headD, [[[[1336, 680], [1350, 780], [1338, 880], [1372, 840], [1366, 720]], shad, 0.45, 18]]);
  W.softTone(f, noseD, [[ell([1440, 830], 24, 70, -0.5, 12), sheen, 0.5, 10], [ell([1470, 890], 22, 16, 0, 10), '#e0b080', 0.45, 7]]);
  W.crease(f, [[1380, 740], [1404, 760], [1430, 768]], 5, { lip: 3 }); // the bridge kinked where the peat pushed it over
  W.crease(f, [[1372, 712], [1390, 724]], 4, { lip: 2 });
  // the wing (ala) with its groove, the near nostril flared, the far one a slit, the columella between
  f.part([[1350, 884], [1388, 874], [1424, 896], [1436, 930], [1420, 952], [1388, 952], [1360, 940], [1344, 914]], { fill: mix(skin, '#7a4a30', 0.06), shadow: '#2a1810', shade: 0.3, maxShade: 14, hi: 0, inkW: 0, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
  W.crease(f, [[1360, 880], [1348, 906], [1358, 936]], 8, { lip: 4 }); W.crease(f, [[1366, 948], [1392, 956]], 4, { lip: 2, op: 0.5 });
  f.flat([[1408, 944], [1430, 936], [1452, 940], [1452, 950], [1430, 954], [1412, 952]], '#080402'); f.flat([[1470, 938], [1484, 934], [1490, 940], [1476, 944]], '#080402', { op: 0.85 });
  f.line([[1412, 940], [1430, 932], [1452, 936]], 1.6, sheen, { op: 0.5 });
  for (let i = 0; i < 14; i++) f.flat(ell(W.scatter(f, [1462, 880], 26, 20), 1.6, 1.3, 0, 5), '#140a04', { op: 0.6 }); // pores on the bulb

  // cheek: the cheekbone ridge, the cheek sunk under it, slack leather hanging in folds, the deep nasolabial fold
  W.crease(f, [[1060, 880], [1140, 874], [1230, 856], [1320, 820]], 7, { lip: 5, op: 0.6 });
  W.crease(f, [[1352, 900], [1326, 956], [1290, 1006], [1246, 1046]], 15, { lip: 6, op: 0.9 }); // nasolabial
  W.crease(f, [[1326, 930], [1290, 984], [1250, 1024]], 6, { lip: 4 });
  W.creaseField(f, [1150, 990], 64, 100, 10, 1.42, 110, 5, { lip: 4, spread: 0.3 });
  W.creaseField(f, [990, 1010], 64, 110, 8, 1.5, 120, 4, { lip: 3 });
  W.creaseField(f, [1080, 1200], 90, 40, 6, 0.42, 90, 4, { lip: 3 }); // jawline creases
  W.crease(f, [[960, 1164], [1060, 1220], [1180, 1272], [1290, 1314]], 5, { lip: 4, op: 0.55 }); // the jawline over the neck
  for (let i = 0; i < 4; i++) W.crease(f, [[960 + i * 40, 1270 + i * 16], [1060 + i * 36, 1300 + i * 14], [1150 + i * 30, 1340 + i * 10]], 5, { lip: 3 }); // neck creases
  // peeling leather, pressed facet, toxin blisters in the hollows
  for (const [q, s] of [[[1110, 360], 1], [[1200, 860], 0.8], [[930, 600], 1.1], [[1040, 1090], 0.9]]) { const pts = [q, add(q, [36 * s, -6 * s]), add(q, [34 * s, 18 * s]), add(q, [10 * s, 22 * s]), add(q, [-4 * s, 12 * s])]; f.flat(pts.map((p, k) => add(p, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 6])), mix(skinL, skin, 0.35), { op: 0.55, k: 0.6 }); f.line([q, add(q, [36 * s, -6 * s]), add(q, [34 * s, 18 * s])], 1.4, INK, { op: 0.55 }); f.flat([add(q, [-4 * s, 12 * s]), add(q, [10 * s, 22 * s]), add(q, [12 * s, 28 * s]), add(q, [-6 * s, 18 * s])], fold, { op: 0.5 }); }
  for (const [c, rx, ry, n] of [[[1170, 1020], 40, 46, 6], [[1010, 1130], 26, 26, 3]]) for (let i = 0; i < n; i++) W.pustule(f, W.scatter(f, c, rx, ry), 4 + f.r() * 6, { col: '#6e6c34', burst: f.r() < 0.4 });
  W.mossClump(f, [1330, 924], 9, 14, { ang: 1.1 }); // moss lodged in the top of the fold

  // ---- upper lid (blinks on lid_n): heavy, hooded by a fold of skin, the lash line thick and the lashes wet and clumped
  f.bone('lid_n');
  f.part([...up, [1266, 690], [1224, 670], [1160, 668], [1110, 680], [1092, 700]], { fill: mix(skin, '#3a2018', 0.12), shadow: '#2a1810', shade: 0.4, maxShade: 18, inkW: 1.4, inkHeavy: 2.4, cast: true, castOp: 0.5, tex: 'mottle' + seed, texOp: 0.6 });
  f.part([[1078, 704], [1098, 672], [1160, 650], [1236, 652], [1286, 690], [1290, 708], [1250, 680], [1176, 672], [1112, 686]], { fill: skin, shadow: '#2a1810', shade: 0.4, maxShade: 18, inkW: 1.2, inkHeavy: 2.6, cast: true, castOp: 0.5, tex: 'mottle' + seed, texOp: 0.6 }); // the hood
  W.crease(f, [[1092, 700], [1150, 680], [1236, 680], [1284, 706]], 6, { lip: 3 });
  f.line([[1130, 662], [1200, 656], [1260, 668]], 2.4, sheen, { op: 0.45 });
  f.stroke(up, 10, INK);
  for (let i = 0; i < 9; i++) {
    const t = 0.08 + i * 0.105, k = Math.min(3, Math.floor(t * 4)), p = lerp(up[k], up[k + 1], t * 4 - k), a = 0.55 - t * 0.35 + (f.r() - 0.5) * 0.3, l = 10 + f.r() * 8 + Math.sin(t * Math.PI) * 8;
    const tip = add(p, rot([l, 0], a)); f.stroke([add(p, [-2, -2]), add(add(p, rot([l * 0.55, 0], a)), [0, 2]), tip], 4.6, INK); // lashes stuck together in wet clumps
  }
  f.bone('lid_f');
  f.part([[1368, 696], [1370, 676], [1390, 664], [1406, 672], [1410, 694], [1392, 690]], { fill: mix(skin, '#3a2018', 0.1), shade: 0.4, maxShade: 12, inkW: 1.2, inkHeavy: 2, cast: false, tex: 'mottle' + seed, texOp: 0.6 });
  f.stroke([[1368, 696], [1390, 690], [1410, 694]], 6, INK);
  for (let i = 0; i < 4; i++) { const p = lerp([1372, 695], [1406, 693], i / 3); f.stroke([p, add(p, [6, 10]), add(p, [12, 16])], 2.6, INK); }

  // ---- hair: bog-dyed, in wet matted clumps from under the moss, plastered round the skull and hanging plumb into the
  // water behind the ear. Many strands per clump, converging to the wet points; a few loose strays.
  f.bone('hair');
  const hb = [[290, 690], [360, 640], [470, 620], [600, 610], [720, 640], [756, 740], [746, 920], [730, 1060], [700, 1160, 1], [660, 1110], [610, 1230, 1], [560, 1150], [500, 1290, 1], [440, 1190], [380, 1300, 1], [320, 1220], [270, 1300, 1], [262, 1180], [250, 980], [262, 840], [296, 760], [310, 704]];
  f.part(hb, { fill: '#1c0c06', shadow: '#0e0603', shade: 0.4, maxShade: 90, tex: 'hatch' + seed, texOp: 0.3, inkW: 1.8, inkHeavy: 4, cast: true });
  const back = [[470, 500], [392, 590], [330, 690], [290, 800], [270, 980], [262, 1160], [258, 1420]];
  const front = [[1000, 280], [960, 414], [886, 550], [800, 636], [756, 748], [748, 930], [740, 1420]];
  const NC = 46, tips = [];
  for (let i = 0; i < NC; i++) {
    const u = Math.min(1, (i + f.r() * 0.9) / NC), len = f.r() < 0.3 ? 0.12 + f.r() * 0.3 : 0.5 + f.r() * 0.5, sway = (f.r() - 0.5) * 70;
    let path = back.map((p, k) => add(lerp(p, front[k], u), [(f.r() - 0.5) * 30 + (k > 3 ? sway * (k - 3) / 3 : 0), k === 0 ? -f.r() * 20 : (f.r() - 0.5) * 18]));
    const full = path.length - 1, cutAt = 2 + len * (full - 2), ki = Math.floor(cutAt), tail = lerp(path[ki], path[Math.min(full, ki + 1)], cutAt - ki);
    path = path.slice(0, ki + 1).concat([add(tail, [sway * 0.2, 0])]);
    const w = 12 + f.r() * 32 - u * 6;
    W.hairClump(f, path, w, { stray: f.r() < 0.3 ? (f.r() - 0.5) * 50 : 0 });
    f.stroke(path.slice(0, Math.min(path.length, 3)), w * 0.95, '#0e0603', { op: 0.55 }); // peat-stained dark at the roots
    tips.push(path[path.length - 1]);
  }
  // a few mats tangled across the others
  for (let i = 0; i < 7; i++) { const a = [380 + f.r() * 300, 520 + f.r() * 140], b = add(a, [80 + f.r() * 120, 120 + f.r() * 80]); W.hairClump(f, [a, lerp(a, b, 0.4), b, add(b, [(f.r() - 0.5) * 30, 140 + f.r() * 200])], 14 + f.r() * 12, { n: 4 }); }
  for (const t of tips) if (t[1] < yw - 30 && f.r() < 0.5) W.drip(f, add(t, [0, 4]), 1.5, '#2e2416');
  // peat crumbs, rotted leaves and moss caught in the mats; a snapped reed tangled in it
  for (let i = 0; i < 40; i++) { const p = W.scatter(f, [500, 820], 220, 440); if (p[0] > 760 || p[0] < 250) continue; const r = 3 + f.r() * 7; f.flat(ell(p, r * 1.4, r, f.r() * 3, 7), f.r() > 0.5 ? '#2a1c10' : '#4a3a22', { op: 0.85, k: 0.6 }); }
  for (const [c, rx, ry] of [[[470, 540], 22, 14], [[506, 566], 14, 10], [[330, 900], 18, 12], [[620, 1040], 14, 9]]) W.mossClump(f, c, rx, ry, { ang: 1.3 });
  for (let i = 0; i < 8; i++) { const p = W.scatter(f, [480, 560], 40, 30); f.line([p, add(p, [(f.r() - 0.5) * 8, 20 + f.r() * 30])], 1.6, P.mossD, { op: 0.8 }); }
  W.reed(f, [[640, 620], [600, 700], [570, 790]], 7, { nodes: false, col: P.reedD });
  f.part([[690, 860], [720, 850], [736, 880], [716, 900], [692, 892]], { fill: '#5a4426', shade: 0.4, inkW: 1.2, inkHeavy: 1.8, cast: false, tex: 'peat' + seed, texOp: 0.6 }); // a rotted leaf
  W.bracket(f, [252, 880], Math.PI + 0.1, 96, 3); W.bracket(f, [262, 1090], Math.PI - 0.1, 70, 2); // shelves standing out past the skull

  // ---- the back of the skull has collapsed where it sank into the bog: peat and rotted scalp slump off it in a sagging
  // mass down into the water, so the back is no clean curve
  f.bone('head');
  const slump = [[274, 900], [252, 930, 1], [236, 968], [214, 1000, 1], [196, 1060], [172, 1130], [158, 1210], [150, 1300], [164, 1384], [372, 1384], [336, 1330], [304, 1250], [286, 1160], [278, 1060], [270, 980]];
  const slD = f.part(slump, { fill: mix(skin, '#2e2014', 0.45), shadow: '#120a04', shade: 0.4, tex: 'mottle' + seed, texOp: 0.8, inkW: 2, inkHeavy: 4.4, k: 0.9 });
  f.flat(slD, `url(#crk${seed})`, { op: 0.5 });
  W.stains(f, slD, [140, 880, 380, 1390], '#140a04', 0.02, 3.6, -1.6, 21, 0.6);
  W.softTone(f, slD, [[[[230, 1000], [260, 1100], [250, 1300], [210, 1250]], skinL, 0.3, 12], [[[150, 1300], [380, 1300], [380, 1390], [150, 1390]], '#0a0604', 0.6, 16]]);
  for (const [q, r] of [[[200, 1150], 16], [[180, 1240], 12], [[250, 1030], 10]]) f.part(ell(q, r * 1.4, r, 0.4, 10), { fill: P.peatD, shade: 0.4, tex: 'peat' + seed, texOp: 0.9, inkW: 1.2, cast: true, castOp: 0.4 }); // peat clods stuck to it
  for (let i = 0; i < 6; i++) W.crease(f, [[200 + i * 8, 1010 + i * 60], [240 + i * 6, 1030 + i * 60], [280, 1040 + i * 60]], 5, { lip: 3, lit: '#6a5236', col: '#0a0604' }); // sagging folds
  W.mossClump(f, [210, 1120], 22, 40, { ang: 1.5 }); W.mossClump(f, [196, 1260], 16, 30, { ang: 1.5 });
  for (let i = 0; i < 10; i++) { const q = [186 + f.r() * 80, 1000 + f.r() * 300]; f.line([q, add(q, [-4 + f.r() * 8, 20 + f.r() * 40])], 1.6, '#4a3620', { op: 0.8 }); } // roots
  f.line([[262, 960], [220, 1040]], 2.4, '#8a7050', { op: 0.5 }); // wet shine
  // ---- the ear, behind the jaw hinge: crumpled leather, a long lobe, the bowl dark, moss in it
  f.bone('head');
  const earD = f.part([[812, 640], [784, 652], [764, 690], [754, 760], [756, 840], [768, 900], [782, 950], [804, 984], [830, 990], [848, 968], [852, 930], [866, 880], [874, 820], [862, 760], [852, 700], [836, 656]], { fill: mix(skin, '#6a3a28', 0.12), shadow: '#2a1a10', shade: 0.4, maxShade: 40, inkW: 1.8, inkHeavy: 3.4, castOp: 0.5, tex: 'mottle' + seed, texOp: 0.7 });
  W.softTone(f, earD, [[ell([830, 840], 30, 70, 0.1, 12), '#000', 0.5, 12], [ell([780, 760], 14, 80, 0.05, 10), skinL, 0.5, 8]]);
  W.crease(f, [[810, 664], [784, 702], [776, 780], [780, 862], [796, 930]], 11, { lip: 5 }); // the groove inside the rim
  f.flat([[812, 806], [840, 816], [850, 846], [846, 872], [834, 900], [816, 890], [820, 860], [806, 840]], '#0e0604', { op: 0.75, k: 0.7 }); // the bowl
  f.line([[800, 700], [808, 760], [822, 800], [846, 806]], 3.4, skinL, { op: 0.55 }); f.line([[812, 704], [830, 744]], 2.4, fold, { op: 0.6 });
  f.part([[856, 858], [870, 866], [868, 900], [852, 904]], { fill: mix(skin, '#6a3a28', 0.12), shade: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false });
  W.crease(f, [[788, 926], [810, 950], [838, 952]], 5, { lip: 3 }); W.crease(f, [[768, 760], [792, 784]], 4, { lip: 3 }); W.crease(f, [[790, 880], [806, 870]], 3);
  // ---- the front locks: matted clumps hanging from the temple in front of the ear onto the cheek, one stuck across the brow
  f.bone('hair');
  W.hairClump(f, [[1020, 282], [996, 420], [944, 590], [904, 760], [890, 950], [884, 1130]], 26, { n: 7 });
  W.hairClump(f, [[1040, 290], [1028, 420], [990, 560], [964, 690], [950, 850], [942, 980]], 18, { n: 5 });
  W.drip(f, [884, 1132], 1.6, '#3a2a1a'); W.drip(f, [942, 984], 1.3, '#3a2a1a');

  // ---- the crown: the bog has grown over her in irregular turf clods of different heights, so the top edge is ragged,
  // not a clean arc. Each clod is cut peat with a moss and grass top; roots hang off it over the skin and the hair. The
  // reeds root in the clods; the toadstools fruit from them. A small fen toad sits on the brow clod for scale.
  f.bone('head');
  const clod = (cx, w, h, a, col = P.peat) => {
    const by = topY(cx) + 14, F = frame([cx, by], a, 1), jag = (x, y) => [x + (f.r() - 0.5) * 10, y + (f.r() - 0.5) * 10];
    const pts = F([jag(-w / 2, 8), jag(-w / 2 - 6, -h * 0.4), jag(-w * 0.32, -h * 0.85), jag(-w * 0.1, -h), jag(w * 0.12, -h * 0.82), jag(w * 0.3, -h * 0.95), jag(w / 2 + 4, -h * 0.5), jag(w / 2, 10), jag(0, 16)]);
    f.part(pts, { fill: col, shadow: '#120c06', shade: 0.42, tex: 'peat' + seed, texOp: 1, inkW: 2, inkHeavy: 4, k: 0.6, castOp: 0.5 });
    f.part(F([jag(-w / 2 - 4, -h * 0.42), jag(-w * 0.32, -h * 0.9), jag(-w * 0.1, -h - 6), jag(w * 0.12, -h * 0.86), jag(w * 0.3, -h - 2), jag(w / 2 + 6, -h * 0.52), jag(w * 0.3, -h * 0.62), jag(0, -h * 0.66), jag(-w * 0.3, -h * 0.56)]), { fill: P.moss, shadow: P.mossD, shade: 0.4, tex: 'moss' + seed, texOp: 0.95, inkW: 1.6, cast: false, k: 0.7 });
    for (let i = 0; i < w / 8; i++) { const q = F([[-w * 0.45 + f.r() * w * 0.9, -h * 0.8 - f.r() * h * 0.2]])[0]; f.line([q, add(q, rot([14 + f.r() * 22, 0], -1.6 + (f.r() - 0.5) * 0.9))], 1.6, f.r() > 0.4 ? P.reedL : P.mossY, { op: 0.85 }); } // grass
    for (let i = 0; i < w / 14; i++) { const q = F([[-w * 0.45 + f.r() * w * 0.9, 8 + f.r() * 6]])[0], l = 30 + f.r() * 110, sw = (f.r() - 0.5) * 30; f.line([q, add(q, [sw * 0.3, l * 0.4]), add(q, [sw * 0.7, l * 0.75]), add(q, [sw, l])], 1.4 + f.r() * 1.8, f.r() > 0.5 ? '#2a1c10' : '#4a3620', { op: 0.85 }); } // roots hanging off it
    f.line(F([[-w * 0.4, -h * 0.25], [w * 0.4, -h * 0.3]]), 1.4, '#1a120a', { op: 0.6 }); // a layer in the cut peat
    return F([[0, -h]])[0];
  };
  const clods = [[352, 90, 46, -1.0], [430, 120, 64, -0.7], [548, 150, 96, -0.6], [690, 190, 74, -0.4], [826, 170, 116, -0.2], [968, 160, 62, 0.05], [1098, 120, 46, 0.3], [1196, 70, 30, 0.6]];
  const tops = clods.map(([x, w, h, a], i) => clod(x, w, h, a, i % 2 ? P.peat : mix(P.peat, '#000', 0.12)));
  for (let i = 0; i < 18; i++) W.mossClump(f, W.scatter(f, [700, 420], 300, 80), 5 + f.r() * 9, 4 + f.r() * 4); // moss creeping down the scalp
  W.toadstools(f, add(tops[4], [6, 8]), -1.6, 110, 4);
  W.toadstools(f, add(tops[6], [0, 6]), -1.2, 70, 3);
  W.toadstools(f, add(tops[1], [0, 6]), -2.2, 50, 2);
  // a small fen toad squatting on the brow clod: she is the size of a house
  { const c = add(tops[5], [10, 4]); f.part([add(c, [-22, 2]), add(c, [-20, -12]), add(c, [-4, -20]), add(c, [14, -18]), add(c, [24, -8]), add(c, [22, 4])], { fill: '#5a4a2e', shadow: '#1e1810', shade: 0.4, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.4, inkHeavy: 2.4 }); f.flat(ell(add(c, [12, -16]), 4, 3, 0, 8), '#a08e34'); f.flat(ell(add(c, [12, -16]), 1.6, 1, 0, 6), '#0a0804'); f.line([add(c, [24, -6]), add(c, [6, -2])], 1.2, INK, { op: 0.7 }); }
  // snails grazing the leather: their size against hers
  for (const [q, a] of [[[1080, 470], 0.3], [[900, 660], -0.2], [[1150, 1060], 0.5]]) { f.part(ell(q, 9, 8, a, 12), { fill: '#8a7650', shadow: '#3a2a18', shade: 0.4, inkW: 1.2, cast: true, castOp: 0.4, hatch: false }); f.line(ell(q, 5, 4, a, 10).slice(0, 8), 1, '#3a2a18', { op: 0.7 }); f.stroke([add(q, [-10, 6]), add(q, [6, 8]), add(q, [16, 4])], 4, '#6a5a40'); }

  // ---- the braided noose biting into the neck at the waterline, knotted at the side
  W.rope(f, [[1250, 1376], [1120, 1366], [980, 1362], [820, 1370], [700, 1376]], 24, { col: P.rope });
  f.part(ell([960, 1364], 46, 30, 0.2, 14), { fill: P.rope, shadow: P.ropeD, shade: 0.4, tex: 'hatch' + seed, texOp: 0.5, inkW: 2.2 });
  f.line([[936, 1352], [984, 1376]], 2, INK, { op: 0.6 });

  // ================= head, layer 2: the cave of the mouth with the hags' offerings (shows when the jaw drops)
  const cave = [MC, [1432, 1040], [1430, 1080], [1404, 1120], [1394, 1160], [1402, 1220], [1384, 1290], [1346, 1326], [1330, 1328], [1308, 1268], [1288, 1190], [1270, 1120], [1256, 1080]]; // stays inside the jaw seam
  f.part(cave, { fill: '#3a1a16', shadow: '#120806', light: '#5a2a22', shade: 0.4, inkW: 0, cast: false });
  f.flat([[1280, 1080], [1400, 1080], [1390, 1180], [1340, 1250], [1300, 1180]], '#0c0604', { op: 0.85 }); // the throat
  f.part([[1340, 1120], [1360, 1116], [1366, 1146], [1360, 1200], [1340, 1202], [1334, 1150]], { fill: '#a8945a', shadow: '#5a4a2a', shade: 0.4, tex: 'hatch' + seed, texOp: 0.5, inkW: 1.6 });
  f.part(ell([1350, 1104], 14, 15, 0, 12), { fill: '#a8945a', shadow: '#5a4a2a', shade: 0.4, inkW: 1.6 }); f.line([[1334, 1146], [1318, 1162]], 3, '#a8945a'); f.line([[1364, 1146], [1380, 1160]], 3, '#a8945a'); // straw doll
  for (const [x, h] of [[1310, 40], [1356, 34], [1380, 28]]) { f.part([[x - 8, 1236], [x + 8, 1236], [x + 8, 1236 - h], [x - 8, 1236 - h]], { fill: '#d8ccaa', shadow: '#8a7e60', shade: 0.35, inkW: 1.4, cast: false, sharp: true }); f.line([[x, 1236 - h], [x, 1228 - h]], 2, INK); } // candle stubs
  W.driedFrog(f, [1378, 1150], 36, 0.5);
  for (let i = 0; i < 10; i++) f.flat(ell(W.scatter(f, [1340, 1160], 50, 70), 2.5, 1.6, 0, 6), '#f0dcc8', { op: 0.6 }); // wet glints

  // mouth geometry: the bite line, the upper gum drawn up into a snarl toward the front, the lower gum nearly level
  const span = x => Math.max(0, Math.min(1, (x - MC[0]) / 192));
  const by = x => 1052 - span(x) * 10, gy = x => 1048 - 52 * Math.pow(span(x), 0.75), lg = x => 1062 + span(x) * 10;
  const teethX = []; { let x = 1250; for (const w of [12, 16, 19, 21, 22, 22, 20, 18, 14, 10]) { teethX.push([x + w / 2, w]); x += w; } }
  const toothCol = ['#9c8250', '#b0986a', '#b8a272', '#8a6e44', '#c4ae80', '#a8905e', '#b8a272', '#9c8250', '#b0986a', '#a08a5a'];

  // ================= lower jaw: the chin and the lower lip drawn down off the teeth; cut down the marionette fold
  f.bone('jaw');
  const jawD = f.part(jawP, { fill: skin, shade: 0, hi: 0, tex: 'mottle' + seed, texOp: 0.75, k: 0.95, inkW: 0, cast: false });
  skinLayers(jawD);
  f.line(jawP.slice(3, 14), 2.2, INK); f.line([[1394, 1292], [1356, 1334], [1324, 1346]], 5, INK);
  clipped(jawD, () => {
    f.flat([MC, [1432, 1040], [1432, 1060], [1340, 1062], [1270, 1062]], '#0a0503'); // the dark between the parted teeth
    teethX.forEach(([x, w], i) => { if (i === 4 || i === 0) return; const t0 = by(x) + 7, t1 = lg(x) + 2, hw = w / 2; f.part([[x - hw, t1], [x - hw + 1, t0 + 3 + (i % 2) * 3], [x - hw * 0.2, t0 + (i % 3)], [x + hw - 1, t0 + 2], [x + hw, t1]], { fill: toothCol[(i + 3) % 10], shadow: '#5a4a2a', shade: 0.4, inkW: 1.3, inkHeavy: 1.6, cast: false, hatch: false, k: 0.8 }); f.flat([[x - hw + 2, t1 - 6], [x + hw - 2, t1 - 6], [x + hw - 2, t1], [x - hw + 2, t1]], '#4a2e16', { op: 0.6 }); });
    f.part([[MC[0], lg(MC[0])], [1300, lg(1300)], [1370, lg(1370)], [1434, lg(1432)], [1434, lg(1432) + 10], [1370, lg(1370) + 9], [1300, lg(1300) + 8], [MC[0] + 4, lg(MC[0]) + 6]], { fill: gum, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false }); // the lower gum, receded
  });
  // the lower lip, shrunk thin and hanging a little off the gum, cracked
  const ll = [[MC[0] + 2, lg(MC[0]) + 4], [1300, lg(1300) + 7], [1370, lg(1370) + 9], [1428, lg(1430) + 8], [1424, lg(1430) + 22], [1400, lg(1400) + 26], [1350, lg(1350) + 24], [1290, lg(1290) + 16], [MC[0] + 6, lg(MC[0]) + 10]];
  f.part(ll, { fill: lip, shadow: '#2a120c', shade: 0.4, maxShade: 12, inkW: 1, inkHeavy: 1.6, hi: 2, cast: true, castOp: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  for (let i = 0; i < 9; i++) { const x = 1262 + i * 18; f.line([[x, lg(x) + 9], [x + 2, lg(x) + 20 + (i % 2) * 4]], 1.3, fold, { op: 0.7 }); }
  f.line([[1300, lg(1300) + 10], [1370, lg(1370) + 12], [1420, lg(1420) + 11]], 2, sheen, { op: 0.45 });
  W.crease(f, [[1300, 1112], [1350, 1126], [1396, 1132]], 9, { lip: 5 }); // the crease above the chin
  W.crease(f, [[1238, 1060], [1250, 1104], [1264, 1150], [1280, 1200]], 12, { lip: 6, op: 0.85 }); // marionette fold, over the top of the seam
  W.creaseField(f, [1360, 1230], 30, 60, 5, 1.2, 50, 4, { lip: 3 }); // pitted chin
  W.pustule(f, [1370, 1290], 6, { col: '#6e6c34' }); W.pustule(f, [1350, 1306], 5, { col: '#6e6c34', burst: true });
  for (const p of [[1418, 1094], [1380, 1100]]) W.drip(f, p, 2.2, '#4a4a2a');

  // ================= head, layer 3: the upper lip shrunk back off the gum, and the long upper teeth over the jaw
  f.bone('head');
  f.part([MC, [1290, gy(1290) - 1], [1350, gy(1350) - 1], [1432, gy(1432) - 2], [1434, gy(1432) + 12], [1350, gy(1350) + 12], [1290, gy(1290) + 10], [MC[0] + 4, MC[1] + 2]], { fill: gum, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false }); // the upper gum, receded off the roots
  teethX.forEach(([x, w], i) => {
    const hw = w / 2, top = gy(x) + 6, bot = by(x) - (i === 3 ? 10 : i === 7 ? 5 : 0);
    if (i === 5) { f.flat([[x - hw, top], [x + hw, top], [x + hw, bot], [x - hw, bot]], '#0a0503'); return; } // one gone
    if (bot - top < 4) return;
    f.part([[x - hw, top], [x + hw, top], [x + hw - 1, bot - 4], [x + hw - 4, bot, 1], [x, bot - (i === 3 ? 4 : 1)], [x - hw + 3, bot, 1], [x - hw + 1, bot - 5]], { fill: toothCol[i], shadow: '#5a4a2a', shade: 0.4, inkW: 1.4, inkHeavy: 1.8, cast: true, castOp: 0.35, hatch: false, k: 0.8 });
    f.flat([[x - hw + 2, top], [x + hw - 2, top], [x + hw - 3, top + Math.min(12, (bot - top) * 0.4)], [x - hw + 3, top + Math.min(12, (bot - top) * 0.4)]], '#4a2e16', { op: 0.6 }); // the exposed root, stained
    if (bot - top > 16) f.line([[x + hw * 0.3, top + 8], [x + hw * 0.3, bot - 6]], 1.3, '#efe2be', { op: 0.45 });
  });
  // the upper lip, a thin shrunk roll drawn up off the gum, puckered with vertical lines; the philtrum above
  f.part([[MC[0] - 4, MC[1] - 4], [1290, gy(1290) - 9], [1350, gy(1350) - 11], [1424, gy(1424) - 12], [1428, gy(1428) + 1], [1350, gy(1350) + 1], [1290, gy(1290) + 1], [MC[0] + 2, MC[1] + 1]], { fill: lip, shadow: '#2a120c', shade: 0.4, maxShade: 10, inkW: 1, inkHeavy: 1.6, hi: 2, cast: true, castOp: 0.5, tex: 'mottle' + seed, texOp: 0.6 });
  for (let i = 0; i < 11; i++) { const x = 1256 + i * 16; W.crease(f, [[x, gy(x) - 6], [x - 2, gy(x) - 26 - (i % 3) * 10], [x - 3, gy(x) - 42 - (i % 2) * 14]], 3.2, { lip: 2 }); }
  W.crease(f, [[1404, 958], [1398, 984]], 6, { lip: 3 }); W.crease(f, [[1424, 962], [1420, 984]], 4, { lip: 2 }); // philtrum ridges
  f.line([[1290, gy(1290) - 8], [1350, gy(1350) - 10], [1414, gy(1414) - 11]], 1.6, sheen, { op: 0.45 });
  W.bubbles(f, [1446, 1050], 5, 30, 90, 2.4);

  // ================= jaw, again: the Tooth, lodged in the lower jaw as one of hers, rising past the shrunk upper lip
  f.bone('jaw');
  // an old fang, far longer than hers: thick yellowed root darkening to brown, worn flat at the tip, split, ringed with
  // growth lines, bound into the gum with a rusted iron band; notches cut in it
  const tooth = [[1336, 1090], [1376, 1090], [1380, 1052], [1376, 1004], [1368, 968], [1360, 950], [1348, 952], [1342, 976], [1338, 1020], [1334, 1060]];
  const tD = f.part(tooth, { fill: '#b8a272', shadow: '#5e4c2e', light: '#e0d0a4', shade: 0.42, inkW: 2.2, inkHeavy: 3.6, cast: true, castOp: 0.5, hatch: false, k: 0.85 });
  W.softTone(f, tD, [[[[1330, 1030], [1384, 1030], [1384, 1100], [1330, 1100]], '#4a3418', 0.7, 10], [ell([1366, 990], 6, 40, 0.15, 10), '#f4ead0', 0.5, 4]]);
  for (let i = 0; i < 6; i++) { const y = 968 + i * 13; f.line([[1342 + (y - 960) * 0.05, y + 2], [1356, y - 1], [1372 + (y - 960) * 0.04, y + 3]], 1, '#5a4626', { op: 0.55 }); } // growth rings
  f.line([[1352, 954], [1350, 990], [1354, 1024]], 1.4, INK, { op: 0.7 }); // the split
  f.flat([[1348, 952], [1360, 950], [1356, 958], [1350, 960]], '#5a4626'); // worn tip
  for (let i = 0; i < 3; i++) f.flat([[1376 - i * 0.8, 996 + i * 12], [1368 - i * 0.8, 1000 + i * 12], [1376 - i * 0.8, 1004 + i * 12]], '#2a1c0e', { op: 0.9 }); // notches cut by the hags
  f.part([[1334, 1056], [1380, 1054], [1381, 1070], [1333, 1072]], { fill: P.iron, shadow: '#140e0a', shade: 0.4, inkW: 1.6, cast: false, sharp: true, tex: 'mottle' + seed, texOp: 0.6 });
  f.flat([[1340, 1068], [1356, 1070], [1352, 1082], [1344, 1078]], P.rust, { op: 0.7 }); f.rivet([1344, 1063], 2.6, P.ironL); f.rivet([1370, 1062], 2.6, P.ironL);

  // ---- the head fills the frame: scale every part 1.08 about the chin at the waterline (pivots scaled to match)
  const SC = 1.08, OX = 800, OY = yw;
  // consistency pass 2026-11-25: the water no longer hides her with a hard black rectangle, so the head itself fades out
  // a little under the surface (soft mask along the waterline) and the water below fades into the dark (see the end)
  const sN = (x, k) => Math.sin(x * 0.013 + k) * 10 + Math.sin(x * 0.037 + k * 2.3) * 6; // local noise: no f.r() (keeps the random stream)
  const surfY = x => { const S = [[0, yw - 24], [140, yw - 50], [280, yw - 80], [420, yw - 86], [560, yw - 64], [700, yw - 40], [860, yw - 20], [1020, yw - 6], [1200, yw], [1400, yw + 2], [CW, yw]]; let i = 1; while (i < S.length - 1 && S[i][0] < x) i++; const t = Math.max(0, Math.min(1, (x - S[i - 1][0]) / (S[i][0] - S[i - 1][0]))); return S[i - 1][1] + (S[i][1] - S[i - 1][1]) * t; };
  { const hm = [[-300, -600], [CW + 300, -600]]; for (let x = CW + 300; x >= -300; x -= 40) hm.push([x, surfY(Math.max(0, Math.min(CW, x))) + 44 + sN(x, 1)]);
    f.defs.push(`<filter id="mmSoft${seed}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>`);
    f.defs.push(`<mask id="mmHead${seed}" maskUnits="userSpaceOnUse" x="-400" y="-800" width="${CW + 800}" height="${CH + 1200}"><path d="M${hm.map(q => q.map(v => v.toFixed(1)).join(',')).join('L')}Z" fill="#fff" filter="url(#mmSoft${seed})"/></mask>`); }
  f.out = f.out.map(s => `<g transform="translate(${OX},${OY}) scale(${SC}) translate(${-OX},${-OY})">${s}</g>`);
  for (const j of Object.values(f.joints)) j.pivot = [E.f1(OX + (j.pivot[0] - OX) * SC), E.f1(OY + (j.pivot[1] - OY) * SC)];
  // ---- the black water: everything below the surface hidden, ripples round the chin, scum lines, her reflection
  const wi = f.out.length;
  f.bone('water');
  // the surface sits higher round the back of her skull, which has sunk further into the bog, and drops under the chin
  const surf = [[0, yw - 24], [140, yw - 50], [280, yw - 80], [420, yw - 86], [560, yw - 64], [700, yw - 40], [860, yw - 20], [1020, yw - 6], [1200, yw], [1400, yw + 2], [CW, yw]];
  // the pool: an organic body of peat water whose lower edge wanders and dissolves into the dark (no straight edges);
  // murky olive under the surface, peat-black deeper, silt plumes and a drowned root or two
  const wb = []; for (let x = CW; x >= 0; x -= 50) wb.push([x, yw + 150 + sN(x, 4) * 2.2 + Math.sin(x * 0.006) * 18]);
  f.part([...surf, ...wb], { fill: P.water, noShade: true, inkW: 0, cast: false, gritOp: 0.25 });
  { const gid = 'mmDeep' + seed;
    f.defs.push(`<linearGradient id="${gid}" x1="0" y1="${yw - 40}" x2="0" y2="${yw + 170}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4a4630" stop-opacity="0.75"/><stop offset="0.35" stop-color="#2e2a1c" stop-opacity="0.5"/><stop offset="1" stop-color="#0c0a06" stop-opacity="0"/></linearGradient>`);
    f.raw(`<path d="${E.smooth([...surf, ...wb])}" fill="url(#${gid})"/>`);
    for (let i = 0; i < 9; i++) { const x = 120 + i * 168 + sN(i * 97, 2) * 3, y = yw + 60 + sN(i * 53, 3) * 3, rx = 70 + (i % 3) * 30; f.raw(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx}" ry="${(rx * 0.22).toFixed(1)}" fill="${i % 2 ? '#3a3020' : '#5a4a2e'}" opacity="0.32" filter="url(#mmSoft${seed})"/>`); } // silt plumes
    for (const [x, d] of [[330, 1], [1130, -1], [760, 1]]) f.line([[x, yw + 30], [x + d * 26, yw + 70], [x + d * 18, yw + 110], [x + d * 44, yw + 140]], 3.4, '#1c140c', { op: 0.55 }); // drowned roots fading downward
    f.defs.push(`<filter id="mmFadeB${seed}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>`);
    const fm = [[70, yw - 420], [CW - 70, yw - 420]]; for (let x = CW - 70; x >= 70; x -= 60) fm.push([x, yw + 88 + sN(x, 5) * 2.6 + Math.sin(x * 0.009 + 1) * 22]);
    f.defs.push(`<mask id="mmWater${seed}" maskUnits="userSpaceOnUse" x="-400" y="${yw - 900}" width="${CW + 800}" height="1400"><path d="M${fm.map(q => q.map(v => v.toFixed(1)).join(',')).join('L')}Z" fill="#fff" filter="url(#mmFadeB${seed})"/></mask>`); }
  f.flat([[220, yw - 40], [1420, yw], [1360, yw + 70], [260, yw + 40]], '#2a1e14', { op: 0.45 }); // her dark reflection
  for (let i = 0; i < 14; i++) { const x = 260 + i * 80 + f.r() * 30, y = yw + 6 + f.r() * 10 - Math.max(0, 600 - x) * 0.06; f.line([[x, y], [x + 30 + f.r() * 30, y + 2 + f.r() * 6]], 3, '#3a2818', { op: 0.5 }); } // broken reflection of the skin
  W.ripples(f, [900, yw + 6], 560, 12, 4, '#6a6448', 0.55);
  f.line(surf, 2.4, '#8a8462', { op: 0.55 }); // scum hugging the surface and her skin
  for (let i = 0; i < 70; i++) { const x = f.r() * CW, y = yw - 30 + f.r() * 70 - Math.max(0, 600 - x) * 0.04; if (y < yw - 54 + 6) continue; f.flat(ell([x, y], 2 + f.r() * 3, 1.2 + f.r(), 0, 6), f.r() > 0.5 ? P.mossL : P.bileD, { op: 0.8 }); } // duckweed
  // peat banks slumped round her base, half under the water, with moss and reeds on them
  // peat banks slumped round her base: clumps of mounds of different sizes, half under the water, moss and roots on them
  const bank = (x0, x1, h, ycap) => {
    const n = 2 + Math.floor((x1 - x0) / 220);
    for (let m = 0; m < n; m++) {
      const cx = x0 + (x1 - x0) * (m + 0.5) / n + (f.r() - 0.5) * 30, rw = (x1 - x0) / n * (0.85 + f.r() * 0.5), rh = h * (0.35 + f.r() * 0.55), base = ycap + 30;
      const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10, x = cx - rw + 2 * rw * t; pts.push([x, base - rh * Math.pow(Math.sin(Math.PI * t), 1.3) * (0.85 + f.r() * 0.3)]); }
      pts.push([cx + rw, yw + 70 + sN(cx + rw, 6)], [cx, yw + 96 + sN(cx, 7)], [cx - rw, yw + 70 + sN(cx - rw, 6)]); // sunk base, sloping away under the water
      f.part(pts, { fill: m % 2 ? P.peatD : mix(P.peatD, P.peat, 0.5), shadow: '#0a0604', shade: 0.4, tex: 'peat' + seed, texOp: 0.9, inkW: 1.8, cast: false, k: 0.85 });
      if (f.r() > 0.35) W.mossClump(f, [cx + (f.r() - 0.5) * rw * 0.6, base - rh * 0.9], rw * 0.4, 8);
      for (let i = 0; i < rw / 14; i++) { const q = [cx - rw * 0.8 + f.r() * rw * 1.6, base - rh * 0.4]; f.line([q, add(q, [(f.r() - 0.5) * 10, 14 + f.r() * 20])], 1.4, '#3a2a18', { op: 0.8 }); }
    }
    { const q = [[x0 - 30, ycap + 26], [x1 + 30, ycap + 26]]; for (let x = x1 + 30; x >= x0 - 30; x -= 40) q.push([x, yw + 110 + sN(x, 8) * 1.6]);
      f.raw(`<path d="M${q.map(v => v.map(n => n.toFixed(1)).join(',')).join('L')}Z" fill="${P.water}" opacity="0.6" filter="url(#mmSoft${seed})"/>`);
      f.flat([[x0 - 20, ycap + 26], [x1 + 20, ycap + 26], [x1 + 14, ycap + 40], [x0 - 14, ycap + 40]], P.water, { op: 0.5 }); } // the water over the bank's foot: crisp at the surface, soft below
    f.line([[x0 - 20, ycap + 26], [x1 + 20, ycap + 27]], 2, '#8a8462', { op: 0.5 });
  };
  bank(100, 480, 130, yw - 90); bank(540, 880, 80, yw - 50); bank(1240, 1590, 100, yw - 6);
  for (const [x, h, ct] of [[200, 190, true], [236, 140, false], [380, 160, false], [700, 130, false], [1340, 170, true], [1500, 130, false]]) W.reed(f, [[x, yw - 30], [x + 3, yw - 30 - h * 0.45], [x - 2, yw - 30 - h * 0.8], [x + 5, yw - 30 - h]], 6, { cattail: ct });
  W.bubbles(f, [1500, yw - 4], 4, 40, 40, 2);
  // the noose's cut end floating on the surface, half sunk
  f.bone('noose_end');
  const ne = [[1010, yw - 2], [1080, yw + 14], [1160, yw + 30], [1250, yw + 22], [1310, yw + 36], [1270, yw + 50], [1350, yw + 58], [1450, yw + 50]].map(p => [OX + (p[0] - OX) * SC, p[1]]);
  W.rope(f, ne, 20, { col: P.rope, fray: true });
  f.flat([[ne[2][0] - 30, yw + 24], [ne[4][0] + 10, yw + 26], [ne[4][0], yw + 44], [ne[2][0] - 20, yw + 40]], P.water, { op: 0.6 }); // water over the sunk middle
  W.ripples(f, ne[5], 50, 6, 2, '#6a6448', 0.4);
  // her hair, where it reaches the water, floats out on the surface in dark fans
  f.bone('hair');
  for (let i = 0; i < 34; i++) { const x0 = OX + (300 + f.r() * 440 - OX) * SC, dir = f.r() > 0.5 ? 1 : -1, l = 80 + f.r() * 200, y0 = yw - 40 + (x0 - 300) * 0.05, p = [x0, y0]; f.line([p, add(p, [dir * l * 0.3, 6 + f.r() * 6]), add(p, [dir * l * 0.55, 2 + f.r() * 10]), add(p, [dir * l * 0.8, 12 + f.r() * 10]), add(p, [dir * l, 8 + f.r() * 20])], 1.6 + f.r() * 2.4, f.r() > 0.4 ? '#2a140a' : '#5a2a14', { op: 0.85 }); }
  // everything of the water, banks, noose end and floating hair fades out at the pool's soft edges
  // (one mask per rig run, not per element, so the render stays fast: merge each run's elements into one group)
  { const out = f.out, nOut = [], nMarks = [];
    f.marks.forEach((m, k) => { const end = k + 1 < f.marks.length ? f.marks[k + 1].i : out.length; if (end <= m.i) return; nMarks.push({ i: nOut.length, bone: m.bone }); nOut.push(`<g mask="url(#${m.i < wi ? 'mmHead' : 'mmWater'}${seed})">${out.slice(m.i, end).join('\n')}</g>`); });
    f.out = nOut; f.marks = nMarks; }
  return f;
}

module.exports = {
  heroes: [
    { key: 'mire_mother', name: 'The Mire Mother', tier: 'ruler', w: 1600, h: 1600, flip: true, build: mireMother },
    { key: 'bog_troll', name: 'Bog Troll', tier: 'elite', w: 1100, h: 1400, flip: true, build: bogTroll },
    { key: 'coven_mother', name: 'Coven Mother', tier: 'elite', w: 1100, h: 1400, flip: true, build: covenMother },
    { key: 'bog_body', name: 'Bog Body', tier: 'human', w: 600, h: 820, flip: true, build: bogBody },
    { key: 'fen_hag', name: 'Fen Hag', tier: 'human', w: 600, h: 820, flip: true, build: fenHag },
    { key: 'mire_toad', name: 'Mire Toad', tier: 'small', w: 600, h: 820, flip: true, build: mireToad },
    { key: 'leech_swarm', name: 'Leech Swarm', tier: 'small', w: 600, h: 820, flip: true, build: leechSwarm },
    { key: 'fen_lurker', name: 'Fen Lurker', tier: 'large', w: 900, h: 1100, flip: true, build: fenLurker },
  ],
};
