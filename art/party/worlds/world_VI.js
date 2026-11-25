// World VI, The Stormwrack Coast (Lightning + Water, Electrocute). A wreckers' coast that lived by luring ships onto the
// rocks; the storm never ends and the false lights became true lightning. Lightning (dominant) leaves branching burns,
// fused metal, standing hair and lifted feathers; water soaks, bloats and barnacles. Palette: slate grey, white surf,
// lamp yellow (plus ink black, bone and grey). Every foe is built facing right with kit.foeBase light and flipped.
// Seeds 601 to 608 in bible order. Helpers in kit_VI.js.
'use strict';
const K = require('../kit');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const V = require('./kit_VI');
const { fxCapture } = require('./kit_fx'); // consistency pass 2026-11-25: arcs go to an FX layer
const { P, split, side, ang, elb, dir } = V;
const D = 180 / Math.PI;

// ------------------------------------------------------------------ WRECKER (cast, human 1.0)
// Crouched low on the cliff path, watching the sea. The lantern is held out on its bail in the near hand, up in front of
// his face like a false light; the nail-studded cudgel is cocked back over his far shoulder. Soaked grey gansey with a
// cable chest, knitted cap, sea boots. The lightning that took the lamp found his lantern arm: Lichtenberg scars run from
// the wrist up under the pushed-back sleeve. Beard and the hair under the cap stand with static.
// Rig: standard humanoid + lantern (parent hand_n, pivot at the bail so it hangs plumb) + cudgel (parent hand_f).
// Motion: idle waving the lantern (forearm_n, lantern counter-swing); attack a cudgel blow (far arm over and down).
function wrecker() {
  const W = 600, Hh = 820, f = new Fig(V.base(604, Hh)); V.textures(f);
  const H = 100, gy = f.o.groundY;
  const skin = '#a88a72', beardC = '#4a4038', capC = '#3e4448', trous = '#4e4a42', bootC = '#2c2e2c';
  const N = [352, 384], C = [250, 384], PV = [226, 560];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.1, 0.14), SF = S.at(0.4, 0.05);
  const EN = [414, 466], WN = [486, 376]; // near forearm rises in front: the lantern is lifted to eye height, ahead of the face
  const EF = [300, 446], WF = [286, 318]; // far elbow down behind the back, forearm up, fist cocked over the shoulder
  const HN = S.at(0.2, 0.98), KN = [376, 598], AN = [352, 740];
  const HF = S.at(-0.3, 0.96), KF = [298, 626], AF = [196, 740];
  const HC = [390, 328], hA = 0.1;
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [360, 378], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('lantern', WN, 'hand_n').joint('cudgel', WF, 'hand_f');

  // ---- the cudgel, cocked back behind his head: a split oak spoke studded with ship's nails, a rope wrist loop
  const cA = deg(-160), cb = add(WF, rot([-6, 0], cA + Math.PI)), ct = add(WF, rot([214, 0], cA));
  f.bone('cudgel');
  const club = K.chain([add(WF, rot([-34, 0], cA)), lerp(WF, ct, 0.4), ct], [17, 22, 34], { steps: 8 });
  f.part(club, V.WD(f, { tex: 'wood604', texOp: 0.75 }));
  f.part(ell(ct, 9, 16, cA, 12), V.WD(f, { fill: P.woodD, inkW: 1.2, cast: false })); // end grain
  for (let i = 0; i < 9; i++) { const t = 0.5 + (i % 5) * 0.1, o2 = (i % 2 ? 1 : -1) * (8 + t * 9), p = lp(WF, ct, t, o2), q = lp(WF, ct, t + 0.01, o2 * 1.9); f.line([p, q], 3.6, INK); f.line([p, q], 1.8, P.ironL); f.flat(ell(p, 3.2, 3.2, 0, 6), P.rustD); } // nails driven through
  for (let i = 0; i < 4; i++) { const p = lp(WF, ct, 0.55 + i * 0.1, (i % 2 ? -3 : 4)); f.flat(ell(p, 2.6, 2.6, 0, 6), P.iron); f.flat(ell(add(p, [0.6, 2]), 1.6, 3.5, 0, 6), P.rust, { op: 0.6 }); } // nail heads, rust weeping
  f.line([lp(WF, ct, 0.2, -6), lp(WF, ct, 0.9, -9)], 1, P.woodL, { op: 0.6 });
  f.spatter(lp(WF, ct, 0.85, 0), 22, 14, '#5e1410'); // old blood on the head
  V.lichtenberg(f, lp(WF, ct, 0.5, 4), cA, 60, 2.2, { metal: true, depth: 2 }); // the cudgel took a strike too
  // ---- far arm, behind the back: only the forearm and fist show above the shoulder
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [50, 42], { steps: 6 }), V.WO(f, { fill: P.woolD }));
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.82)], [44, 38], { steps: 6 }), V.WO(f, { fill: P.woolD }));
  f.part(V.tube([lerp(EF, WF, 0.6), lerp(EF, WF, 0.9)], [38, 30]), V.SK(f, { fill: skin, cast: false }));
  f.bone('hand_f');
  B.grip(f, WF, EF, cA, 27, mix(skin, '#6a5a50', 0.15), { tex: 'mottle604', texOp: 0.5, shadow: P.skinS, name: 'wrecker cudgel' });

  // ---- legs: wool trousers into knee-high sea boots with the tops folded down
  const leg = (Hp, Kn, A, sfx, col, wq) => {
    const top = lp(Kn, A, 0.42, 0), d = d0(Kn, A), n = [-d[1], d[0]], w = wq * 0.36;
    V.legTube(f, Hp, Kn, lerp(Kn, A, 0.5), [wq, wq * 0.8, wq * 0.7], { fill: col, shadow: '#1c1c1e', shade: 0.4, tex: 'weave604', texOp: 0.45 }, sfx, { A, bq: [[0, 0.3, 0.14]], after: () => {
      for (const t of [0.22, 0.34]) f.stroke([lp(Kn, A, t, -w * 1.0), lp(Kn, A, t + 0.04, 0), lp(Kn, A, t - 0.02, w * 0.9)], 1.6); // trouser bunching into the boot top
    } });
    split(f, () => {
      B.boot(f, A, 1, 56, bootC, { knee: top, kneeW: wq * 0.7, tex: 'mottle604' });
      for (const t of [0.6, 0.72, 0.84]) f.line([lp(Kn, A, t, -w * 0.8), lp(Kn, A, t + 0.03, 0), lp(Kn, A, t, w * 0.6)], 1.1, INK, { op: 0.45 }); // ankle creases
      f.line([lp(Kn, A, 0.4, w * 0.5), lp(Kn, A, 0.88, w * 0.4)], 1.6, P.slateP, { op: 0.4 }); // wet sheen
      f.scratches(lp(Kn, A, 0.6, 0), 10, 3, P.slateP, 0.8);
    }, [['shin' + sfx, side(A, mul(add(d, [0.6, 0]), -1), 20)], ['foot' + sfx, side(A, add(d, [0.6, 0]), 20)]]);
  };
  const d0 = (a, b) => E.norm(sub(b, a));
  leg(HF, KF, AF, '_f', mix(trous, '#000', 0.2), 66);
  f.bone('foot_f'); V.barnacles(f, add(AF, [40, 40]), 18, 6, 4, 3, 5);
  f.bone('thigh_f'); f.stroke([lp(HF, KF, 0.6, 14), lp(HF, KF, 0.8, 0), lp(HF, KF, 0.9, -16)], 2);
  leg(HN, KN, AN, '_n', trous, 72);
  f.bone('thigh_n');
  f.stroke([lp(HN, KN, 0.55, -18), lp(HN, KN, 0.75, -4), lp(HN, KN, 0.88, 14)], 2.2); f.stroke([lp(HN, KN, 0.3, 20), lp(HN, KN, 0.45, 8)], 1.8);
  // tarred knee patch on the near knee with big stitches
  const kp = lp(HN, KN, 0.55, -6); f.part([add(kp, [-14, -10]), add(kp, [12, -13]), add(kp, [15, 9]), add(kp, [-11, 12])], { fill: '#2a2a26', shade: 0.35, sharp: true, inkW: 1.2, tex: 'weave604' });
  f.stitches([add(kp, [-14, -10]), add(kp, [12, -13]), add(kp, [15, 9]), add(kp, [-11, 12]), add(kp, [-14, -10])], P.bone, 1.1);
  f.bone('shin_n'); V.kelpHang(f, lp(KN, AN, 0.35, 22), 40, 5, 4);
  f.bone('foot_n'); V.barnacles(f, add(AN, [50, 36]), 20, 6, 4, 3, 5.5); f.flat(ell(add(AN, [30, 50]), 46, 5, 0, 12), '#3a4448', { op: 0.5 });

  // ---- torso: a soaked gansey, cable chest panel, ribbed hem riding over the trousers
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.36, 0.3], [0.08, 0.7, 0.56], [0.22, 0.8, 0.76], [0.4, 0.74, 0.82], [0.6, 0.62, 0.8], [0.8, 0.56, 0.76], [0.98, 0.56, 0.7], [1.1, 0.52, 0.62]]);
  f.part(torso, V.WO(f));
  // cable panel down the chest: three twisted columns
  const cp = S.shape([[0.12, -0.12, 0.6], [0.5, -0.02, 0.7], [0.95, -0.05, 0.6]]);
  f.part(cp, V.WO(f, { fill: mix(P.wool, '#fff', 0.06), tex: 'cable604', texOp: 0.75, cast: false, inkW: 1, inkHeavy: 1.4 }));
  // ribbed hem (welt) and its stretch over the haunch
  const hem = S.shape([[0.96, 0.58, 0.72], [1.12, 0.54, 0.64]]);
  f.part(hem, V.WO(f, { fill: mix(P.wool, '#2a2a2e', 0.18), tex: 'weave604', texOp: 0.6, inkW: 1.2, cast: false }));
  for (let i = 0; i < 10; i++) { const u = -0.5 + i * 0.12; f.line([S.at(u, 0.98), S.at(u * 0.96, 1.1)], 1, INK, { op: 0.5 }); }
  // wet: darker soaked band at the hem, drips, a salt tide line
  f.flat(S.shape([[0.78, 0.56, 0.76], [0.98, 0.56, 0.7]]), '#1c1e22', { op: 0.22 });
  // gansey construction: the shoulder saddle seam, the yoke's moss-stitch band, a gusset line under the arm
  f.line([S.at(-0.62, 0.12), S.at(-0.2, 0.06), S.at(0.3, 0.04)], 1.4, INK, { op: 0.6 }); f.stitches([S.at(-0.6, 0.16), S.at(-0.2, 0.1), S.at(0.28, 0.08)], P.woolL, 0.9);
  f.part(S.shape([[0.2, 0.78, 0.74], [0.27, 0.74, 0.8]]), V.WO(f, { fill: mix(P.wool, '#000', 0.08), tex: 'weave604', texOp: 0.8, inkW: 0.9, inkHeavy: 1, cast: false }));
  f.stroke([S.at(-0.7, 0.25), S.at(-0.55, 0.12)], 2.2);
  for (const u of [-0.4, -0.05, 0.4]) V.drip(f, add(S.at(u, 1.1), [0, 2]), 1);
  V.saltCrust(f, S.at(0.2, 0.75), 50, 10, 14);
  // folds, a darn, burn holes where the strike went through the wool
  f.stroke([S.at(-0.45, 0.3), S.at(-0.36, 0.55), S.at(-0.42, 0.8)], 2.2); f.stroke([S.at(0.7, 0.45), S.at(0.55, 0.62)], 1.8); f.stroke([S.at(0.2, 0.9), S.at(0.45, 0.95), S.at(0.7, 0.9)], 1.8);
  const dn = S.at(-0.3, 0.66); f.part(ell(dn, 15, 11, 0.4, 10), V.WO(f, { fill: '#5a5a52', inkW: 1, cast: false, tex: 'weave604', texOp: 0.8 })); for (let i = 0; i < 4; i++) f.line([add(dn, [-12, -7 + i * 4]), add(dn, [12, -5 + i * 4])], 0.8, P.bone, { op: 0.6 });
  for (const [u, v, r] of [[0.75, 0.3, 6], [0.62, 0.36, 4], [0.8, 0.44, 3.5]]) { const q = S.at(u, v); f.flat(ell(q, r + 3, r + 2, 0, 9), '#141210', { op: 0.6 }); f.flat(ell(q, r, r * 0.8, 0, 8), '#2a1c18'); }
  // belt: a tarred rope round the waist, knotted, with a sheath knife and a flint pouch
  const bl = [S.at(-0.6, 0.94), S.at(-0.2, 0.97), S.at(0.3, 0.98), S.at(0.78, 0.93)];
  V.rope(f, bl, 7, { col: '#4e4436' });
  const kn = S.at(0.25, 0.98); f.part(ell(kn, 9, 8, 0, 10), { fill: '#4e4436', tex: 'weave604', inkW: 1.2, cast: false }); V.rope(f, [kn, add(kn, [-4, 26]), add(kn, [2, 44])], 5, { col: '#4e4436', fray: true });
  const sh = S.at(-0.32, 1.0); f.part([add(sh, [-8, -4]), add(sh, [10, -2]), add(sh, [6, 62]), add(sh, [0, 74], 1), add(sh, [-6, 60])], { fill: '#3a2c20', shade: 0.4, inkW: 1.2, tex: 'mottle604' });
  f.part([add(sh, [-6, -26]), add(sh, [6, -26]), add(sh, [7, -4]), add(sh, [-7, -4])], { fill: P.woodD, shade: 0.4, inkW: 1.1, cast: false }); f.rivet(add(sh, [0, -15]), 2, P.ironL);
  f.stitches([add(sh, [6, 4]), add(sh, [3, 60])], P.bone, 0.9);

  // ---- head: weathered, bearded, eyes narrowed into the dark. The knitted cap is pulled low; hair stands under it.
  f.bone('head');
  f.part(K.chain([S.at(0.15, 0.08), add(HC, [-12, 36])], [58, 50], { steps: 4 }), V.SK(f));
  f.part(S.shape([[-0.02, 0.5, 0.42], [0.1, 0.62, 0.55], [0.14, 0.4, 0.2]]), V.WO(f, { fill: P.woolD, tex: 'weave604', texOp: 0.7, inkW: 1.3 })); // rolled collar
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.2, chin: 0.02, nose: 1.08, hook: 0.25, squint: 0.55, browDown: 0.05, age: true, beard: 'full', beardCol: beardC, hairCol: '#3a3430', faceShade: 1.1, jawShade: 0.55, scar: [[0.02, -0.22], [0.12, -0.1], [0.16, 0.06]] });
  // weather: broken veins on the nose and cheek, wind-burn, salt in the beard, a lip split
  f.flat(hF(ell([0.18, 0.08], 0.09, 0.06, 0, 10)), '#8a4a42', { op: 0.25 });
  for (let i = 0; i < 4; i++) f.line(hF([[0.3 + i * 0.01, 0.05 + i * 0.02], [0.34, 0.08 + i * 0.02]]), 0.7, '#7a2a24', { op: 0.5 });
  V.saltCrust(f, hF([[0.12, 0.42]])[0], 16, 8, 4);
  // beard bristling with static: wiry strands lifting off the jaw
  V.standingHair(f, [0.0, 0.08, 0.16, 0.24].map(t => hF([[t - 0.1, 0.5 + t * 0.25]])[0]), 16, { col: beardC, w: 2, fan: 1.2, lean: 0.9 });
  // knitted cap: rolled brim low on the brow, ribbed crown, a fish-hook stuck through it
  const capPts = hF([[-0.44, -0.08], [-0.46, -0.32], [-0.34, -0.55], [-0.08, -0.66], [0.18, -0.62], [0.33, -0.46], [0.36, -0.3], [0.2, -0.27], [-0.1, -0.22], [-0.3, -0.1]]);
  f.part(capPts, V.WO(f, { fill: capC, tex: 'weave604', texOp: 0.7 }));
  for (let i = 0; i < 7; i++) f.line(hF([[-0.36 + i * 0.1, -0.3 + Math.abs(i - 3) * 0.01], [-0.3 + i * 0.07, -0.58 + Math.abs(i - 3) * 0.02]]), 1, INK, { op: 0.45 });
  const brim = hF([[-0.47, -0.12], [-0.45, -0.3], [0.0, -0.36], [0.38, -0.33], [0.39, -0.2], [0.0, -0.2], [-0.3, -0.04]]);
  f.part(brim, V.WO(f, { fill: mix(capC, '#000', 0.12), tex: 'weave604', texOp: 0.75, inkW: 1.4 }));
  f.line(hF([[-0.4, -0.25], [0.0, -0.3], [0.36, -0.28]]), 1.2, P.slateP, { op: 0.4 });
  const hk = hF([[-0.18, -0.48]])[0]; f.line([hk, add(hk, [6, -10]), add(hk, [14, -6]), add(hk, [12, 2])], 2.2, P.ironL); f.line([hk, add(hk, [-6, 4])], 1.2, '#8a7a5a');
  // hair standing under the cap's brim at the nape and temple
  V.standingHair(f, [[-0.44, -0.05], [-0.4, 0.0], [-0.34, 0.04]].map(q => hF([q])[0]), 18, { col: '#3a3430', w: 2.4, lean: -0.9, fan: 0.8 });

  // ---- the lantern hangs plumb from the fist on its bail (drawn before the arm so its light sits behind the forearm)
  f.bone('lantern');
  V.stormLantern(f, add(WN, [4, 4]), 120);
  // ---- near arm: sleeve pushed to the elbow, bare forearm scarred by the strike, lantern held out on its bail
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.12)], [62, 52, 54], { steps: 8, bp: [[0, 0.4, 0.1]] }), V.WO(f));
    f.stroke([lp(SN, EN, 0.4, 20), lp(SN, EN, 0.6, 4), lp(SN, EN, 0.7, -18)], 2);
  }, [['upperarm_n', side(EN, mul(de, -1), 28)], ['forearm_n', side(EN, de, 28)]]);
  f.bone('forearm_n');
  f.part(K.chain([lerp(EN, WN, 0.05), lerp(EN, WN, 0.45), WN], [52, 46, 34], { steps: 8, bp: [[0, 0.35, 0.16, 0.25]], bq: [[0, 0.25, 0.1, 0.2], [1, 0.7, -0.08, 0.2]] }), V.SK(f, { fill: skin }));
  f.line([lp(EN, WN, 0.15, 12), lp(EN, WN, 0.5, 10), lp(EN, WN, 0.85, 6)], 1.1, INK, { op: 0.45 }); f.line([lp(EN, WN, 0.3, -6), lp(EN, WN, 0.9, -4)], 1.4, mix(skin, '#fff', 0.35), { op: 0.5 }); // flexor groove, lit ulna
  for (let i = 0; i < 6; i++) { const q = lp(EN, WN, 0.2 + f.r() * 0.6, (f.r() - 0.5) * 30); f.line([q, add(q, [2 + f.r() * 3, -3 - f.r() * 3])], 0.9, '#2a2420', { op: 0.6 }); } // forearm hair
  V.lichtenberg(f, lp(EN, WN, 0.9, 2), ang(WN, EN) + 0.1, 110, 3, { depth: 3 });
  // the rolled-up sleeve: a thick bunched ring at the elbow
  const sc = lerp(EN, WN, 0.12), sd = E.norm(sub(WN, EN)), sn = [-sd[1], sd[0]];
  f.part([add(add(sc, mul(sn, 30)), mul(sd, -10)), add(add(sc, mul(sn, 32)), mul(sd, 8)), add(add(sc, mul(sn, -30)), mul(sd, 10)), add(add(sc, mul(sn, -32)), mul(sd, -8))], V.WO(f, { fill: mix(P.wool, '#fff', 0.05), tex: 'knit604', inkW: 1.4, cast: false }));
  for (const o2 of [-16, 0, 16]) f.line([add(add(sc, mul(sn, o2)), mul(sd, -8)), add(add(sc, mul(sn, o2 + 3)), mul(sd, 8))], 1, INK, { op: 0.5 });
  f.bone('hand_n');
  B.grip(f, WN, EN, 0, 28, skin, { tex: 'mottle604', texOp: 0.5, shadow: P.skinS, name: 'wrecker lantern' });
  V.lichtenberg(f, add(WN, [-6, 8]), deg(120), 22, 1.6, { depth: 1 });
  return f;
}
const deg = d => d * Math.PI / 180;
const R2 = (f, a, b) => a + (b - a) * f.r();
const clipDrawX = (f, r, d) => V.clipDraw(f, r, d);

// ------------------------------------------------------------------ DROWNED BOSUN (cast, human 1.05)
// The wreckers' last catch: a ship's bosun drowned on the rocks, standing his watch again. Upright and bloated, belly
// straining the bosun's coat (navy gone grey, tarnished brass buttons, some burst), the silver call raised to his blue
// lips in the near hand, its chain looped round his neck; the boarding axe held low and forward in the far hand.
// A cocked hat with a wilted feather, a bloated bearded face, white-filmed eyes. One shoe lost: the near foot is bare and
// swollen. The strike that killed the ship left a Lichtenberg fern up his neck into the beard and fused two buttons.
// Rig: standard humanoid + whistle (parent hand_n), axe (parent hand_f), coat_skirt (parent pelvis).
// Motion: idle a silent whistle (head, forearm_n); attack an axe blow (far arm up and over), the whistle rallies the crew.
function drownedBosun() {
  const f = new Fig(V.base(608, 820, { shadowTint: '#2a2a38' })); V.textures(f);
  const H = 114, gy = f.o.groundY, s = '608';
  const skin = P.drown, skinS = P.drownS, coat = P.navy, coatD = P.navyD, slops = '#8c8a7e', shirt = '#a6a49a';
  const N = [300, 250], C = [302, 372], PV = [282, 500];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.12, 0.1), SF = S.at(0.42, 0.06);
  const EN = [318, 364], WN = [404, 246];  // near forearm rises in front of the chest; the call is at the lips
  const EF = [394, 372], WF = [432, 466];  // far arm comes forward round the belly; the axe is held low and forward
  const HN = S.at(-0.2, 0.98), KN = [262, 628], AN = [246, 742];
  const HF = S.at(0.35, 0.98), KF = [348, 628], AF = [362, 742];
  const HC = [328, 166], hA = 0.14;
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [306, 246], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const mouth = frame(HC, hA, H)([[0.26, 0.3]])[0];
  f.joint('whistle', WN, 'hand_n').joint('axe', WF, 'hand_f').joint('coat_skirt', S.at(0, 0.92), 'pelvis');

  // ---- the boarding axe: short ash haft, bearded head with a back spike, the edge nicked and scorched
  const aA = deg(-60), aTop = add(WF, rot([150, 0], aA)), aBut = add(WF, rot([-58, 0], aA));
  f.bone('axe');
  f.part(limb(aBut, aTop, 15, 13, { steps: 8 }), V.WD(f, { tex: 'wood' + s, texOp: 0.7 }));
  for (const t of [0.12, 0.17, 0.22]) f.line([lp(aBut, aTop, t, -8), lp(aBut, aTop, t + 0.02, 8)], 2.6, '#6a5a40', { straight: true }); // grip whipping
  const ah = frame(aTop, aA, 1.45);
  f.part(ah([[-26, -9], [-4, -10], [6, -14], [10, -30], [28, -44, 1], [30, -10], [30, 10], [14, 24, 1], [4, 12], [-26, 9]]), V.IR(f, { inkW: 1.6 })); // bearded blade forward
  f.part(ah([[-20, 8], [-4, 9], [-6, 34], [-14, 52, 1], [-18, 30]]), V.IR(f, { inkW: 1.4, fill: P.ironD })); // back spike
  f.line(ah([[28, -40], [30, -10], [30, 8], [16, 22]]), 2, P.slateP, { op: 0.7 }); // honed edge
  f.flat(ah([[29, -22], [24, -20], [25, -14], [30, -15]]), '#141210'); // nick
  V.lichtenberg(f, ah([[2, -6]])[0], aA - 0.7, 34, 1.6, { metal: true, depth: 2 });
  f.flat(ah([[-6, -6], [6, -6], [6, 6], [-6, 6]]), P.rust, { op: 0.6 }); V.verdigris(f, ah([[-14, 0]])[0], 8, 6, 3);
  f.spatter(ah([[22, -6]])[0], 14, 10, '#4a1210');
  // ---- far arm behind the belly: coat sleeve, turned-back cuff, swollen fist on the haft
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [58, 50], { steps: 6 }), { fill: coatD, shadow: '#14161e', shade: 0.4, tex: 'weave' + s, texOp: 0.5 });
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.7)], [50, 46], { steps: 6 }), { fill: coatD, shadow: '#14161e', shade: 0.4, tex: 'weave' + s, texOp: 0.5 });
  f.part(limb(lerp(EF, WF, 0.55), lerp(EF, WF, 0.75), 56, 56, { steps: 4 }), { fill: mix(coatD, '#fff', 0.08), shadow: '#14161e', shade: 0.4, tex: 'weave' + s, inkW: 1.3, cast: false }); // cuff
  f.bone('hand_f');
  B.grip(f, WF, EF, aA, 30, mix(skin, skinS, 0.15), { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'bosun axe' });
  V.peel(f, WF, 2);

  // ---- legs: sodden canvas slops to mid-calf, grey stocking, one buckled shoe; the near foot bare and swollen
  const legL = (Hp, Kn, A, sfx, col, wq, bare) => {
    const cu = lerp(Kn, A, 0.42);
    if (bare) split(f, () => K.bareLeg(f, add(cu, [0, -10]), A, 1, 58, wq * 0.58, V.DR(f, { fill: mix(skin, skinS, 0.1) }), { swell: 1 }), [['shin' + sfx, side(A, mul(add(E.norm(sub(A, Kn)), [0.6, 0]), -1), 20)], ['foot' + sfx, side(A, add(E.norm(sub(A, Kn)), [0.6, 0]), 20)]]);
    else {
      split(f, () => f.part(K.chain([cu, A], [wq * 0.56, 34], { steps: 6 }), { fill: '#6a6a66', shadow: '#22222a', shade: 0.4, tex: 'knit' + s, texOp: 0.5 }), [['shin' + sfx, side(A, mul(add(E.norm(sub(A, Kn)), [0.6, 0]), -1), 18)]]);
      V.bootRig(f, Kn, A, 50, '#26241f', sfx, { style: 'shoe', shaft: 0.32, strap: true, tex: 'mottle' + s });
    }
    V.legTube(f, Hp, Kn, cu, [wq, wq * 0.8, wq * 0.78], { fill: col, shadow: '#3a3832', shade: 0.38, tex: 'weave' + s, texOp: 0.5 }, sfx, { A, bp: [[0, 0.4, 0.12]], bq: [[0, 0.3, 0.1]], after: () => {
      const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], w = wq * 0.4;
      f.part([add(add(cu, mul(n, w + 4)), mul(d, -10)), add(add(cu, mul(n, -w - 4)), mul(d, -8)), [...add(add(cu, mul(n, -w - 2)), mul(d, 8)), 1], add(add(cu, mul(n, -w * 0.2)), mul(d, 3)), [...add(add(cu, mul(n, w * 0.3)), mul(d, 10)), 1], add(add(cu, mul(n, w + 3)), mul(d, 6))], { fill: mix(col, '#fff', 0.06), shadow: '#3a3832', shade: 0.4, tex: 'weave' + s, inkW: 1.2, cast: false }); // torn hem
      f.stroke([lp(Hp, Kn, 0.85, -w), lp(Kn, cu, 0.1, 0), lp(Kn, cu, 0.2, w)], 1.8);
    } });
  };
  legL(HF, KF, AF, '_f', mix(slops, '#000', 0.18), 80, false);
  f.bone('foot_f'); V.verdigris(f, add(AF, [12, 30]), 6, 4, 3); // the shoe buckle gone green
  legL(HN, KN, AN, '_n', slops, 86, true);
  f.bone('shin_n'); V.livid(f, lerp(KN, AN, 0.7), 12, 14, 5); V.veins(f, lerp(KN, AN, 0.62), 10, 10, 3);
  f.bone('foot_n'); V.barnacles(f, add(AN, [30, 30]), 16, 6, 3, 3, 5); f.flat(ell(add(AN, [30, 48]), 50, 5, 0, 12), '#3a4448', { op: 0.5 });
  f.bone('thigh_n'); V.mussel(f, lp(HN, KN, 0.7, -14), 0.4); V.mussel(f, lp(HN, KN, 0.74, -2), -0.3);

  // ---- torso: a bloated pear in shirt and waistcoat, the coat dragged open by the belly
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.38, 0.36], [0.08, 0.66, 0.6], [0.24, 0.72, 0.78], [0.42, 0.7, 0.96], [0.6, 0.72, 1.16], [0.78, 0.74, 1.22], [0.92, 0.74, 1.08], [1.04, 0.7, 0.82]]);
  f.part(torso, { fill: coat, shadow: P.navyD, light: P.navyL, shade: 0.38, tex: 'weave' + s, texOp: 0.45 });
  // waistcoat (grey-striped ticking, soaked) over a linen shirt, showing in the opening of the coat
  f.defs.push(`<pattern id="tick${s}" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(-6)"><rect width="3" height="9" fill="${P.slateD}" opacity="0.5"/></pattern>`);
  const wc = S.shape([[0.14, -0.1, 0.62], [0.34, 0.12, 0.92], [0.56, 0.3, 1.12], [0.78, 0.36, 1.18], [0.9, 0.34, 1.04]]);
  f.part(wc, { fill: '#6e6e68', shadow: '#2e2e38', shade: 0.38, tex: 'tick' + s, texOp: 0.9 });
  f.stroke([S.at(0.3, 0.2), S.at(0.45, 0.32)], 1.8); f.stroke([S.at(0.6, 0.86), S.at(0.85, 0.9)], 1.8); V.saltCrust(f, S.at(0.8, 0.5), 20, 30, 10);
  for (let i = 0; i < 5; i++) { const q = S.at(0.62 + i * 0.12, 0.3 + i * 0.12); if (i === 2) { f.flat(ell(q, 4, 4, 0, 6), '#1a1a1a'); f.line([q, add(q, [6, 10])], 1, P.bone, { op: 0.7 }); } else f.part(ell(q, 4.6, 4.6, 0, 8), { fill: P.bone, shade: 0.4, inkW: 1, cast: false }); } // horn buttons, one torn off
  f.stroke([S.at(0.5, 0.5), S.at(0.78, 0.6), S.at(0.95, 0.66)], 2); f.stroke([S.at(0.4, 0.7), S.at(0.7, 0.8), S.at(1.0, 0.82)], 2); // straining folds
  // the gap between waistcoat buttons: bloated grey belly bulging out
  // straining between the buttons: dark gaps where the cloth pulls open
  for (let i = 0; i < 3; i++) { const q = S.at(0.7 + i * 0.12, 0.42 + i * 0.12); f.flat([add(q, [-4, 2]), add(q, [10, 10]), add(q, [-2, 6])], '#14141a', { op: 0.7 }); }
  // coat front edge: lapel turned back, row of tarnished brass buttons (two fused by the strike, one burst off)
  const edge = [S.at(0.12, 0.06), S.at(0.24, 0.2), S.at(0.36, 0.42), S.at(0.44, 0.66), S.at(0.46, 0.9)];
  const lap = [S.at(0.0, 0.04), ...edge.slice(0, 3), S.at(0.12, 0.36), S.at(0.04, 0.18)];
  f.part(lap, { fill: mix(coat, '#fff', 0.1), shadow: P.navyD, shade: 0.4, tex: 'weave' + s, inkW: 1.4 });
  f.line(edge, 2.2, INK); f.line(edge.map(q => add(q, [-3, 0])), 1, P.navyL, { op: 0.6 });
  [0.22, 0.38, 0.54, 0.7, 0.86].forEach((v, i) => {
    const q = S.at(0.28 + v * 0.18, v);
    if (i === 3) { f.flat(ell(q, 5, 4, 0, 8), '#14161e'); f.line([q, add(q, [8, 4])], 1, P.bone, { op: 0.6 }); return; } // burst: thread ends
    f.part(ell(q, 7, 7, 0, 10), V.BRS(f, { inkW: 1.1, inkHeavy: 1.6, cast: false, fill: i < 2 ? '#6a6248' : P.brass }));
    f.flat(ell(add(q, [1.5, 1.5]), 3, 3, 0, 6), P.verd, { op: 0.75 }); f.flat(ell(add(q, [-2, -2]), 1.6, 1.4, 0, 6), P.brassL, { op: 0.8 });
    if (i < 2) V.fusedRun(f, add(q, [0, 5]), 12, 3.4, P.brass);
  });
  // coat body: back seam, pocket flap with buttons, salt tide marks, barnacles crusting the shoulders, kelp
  f.line([S.at(-0.66, 0.2), S.at(-0.7, 0.6), S.at(-0.68, 0.95)], 1.4, INK, { op: 0.55 });
  const pf = S.at(-0.1, 0.84); f.part([add(pf, [-30, -8]), add(pf, [34, -12]), add(pf, [36, 10], 1), add(pf, [-28, 14])], { fill: mix(coat, '#fff', 0.06), shadow: P.navyD, shade: 0.4, tex: 'weave' + s, inkW: 1.3, sharp: true });
  for (const x of [-16, 18]) f.part(ell(add(pf, [x, 2]), 4.5, 4.5, 0, 8), V.BRS(f, { inkW: 1, cast: false }));
  V.saltCrust(f, S.at(-0.3, 0.55), 40, 30, 16);
  f.stroke([S.at(-0.5, 0.3), S.at(-0.45, 0.5)], 2); f.stroke([S.at(0.1, 0.5), S.at(0.0, 0.72)], 2);
  V.barnacles(f, S.at(-0.4, 0.1), 30, 12, 9, 3, 7);
  V.kelpHang(f, S.at(-0.6, 0.2), 70, 7, -4);

  // ---- coat skirts to the knee, split at the back, hanging heavy and wet over the slops
  f.bone('coat_skirt');
  const sk = [S.at(-0.74, 0.88), S.at(0.46, 0.9), add(S.at(0.5, 1.0), [6, 40]), [380, 606], [362, 612, 1], [338, 600], [300, 614, 1], [262, 604], [226, 618, 1], [200, 600], add(S.at(-0.8, 1.0), [-14, 24])];
  f.part(sk, { fill: coat, shadow: P.navyD, light: P.navyL, shade: 0.4, tex: 'weave' + s, texOp: 0.45 });
  f.flat([[200, 590], [226, 610], [262, 596], [300, 606], [338, 592], [362, 604], [380, 598], [370, 560], [210, 560]], '#14161e', { op: 0.25 }); // soaked dark hem
  f.stroke([S.at(-0.4, 1.0), [236, 560], [232, 604]], 2.2); f.stroke([S.at(0.1, 1.02), [318, 570], [318, 604]], 2); f.stroke([[352, 540], [366, 600]], 1.8);
  for (const x of [214, 270, 332, 370]) V.drip(f, [x, 612], 1.1);
  for (const [a2, b2] of [[[214, 520], [208, 600]], [[248, 520], [254, 596]], [[290, 530], [282, 604]], [[332, 520], [338, 590]]]) { f.stroke([a2, lerp(a2, b2, 0.5), b2], 2.4); f.line([add(a2, [4, 4]), add(b2, [4, -6])], 1, P.navyL, { op: 0.4 }); } // heavy wet folds
  V.barnacles(f, [230, 560], 18, 14, 4, 3, 5); V.kelpHang(f, [300, 600], 50, 6, 3);
  V.mussel(f, [250, 590], 0.5); V.mussel(f, [262, 594], -0.2);
  f.part([[340, 560], [366, 556], [368, 580], [342, 584]], { fill: mix(coat, '#3a2a1a', 0.3), sharp: true, inkW: 1.1, tex: 'weave' + s }); f.stitches([[340, 560], [366, 556], [368, 580], [342, 584], [340, 560]], P.bone, 0.8); // patch
  // belt over the coat: leather, a brass buckle gone green, a sheathed marlinspike
  f.bone('torso');
  const bl = [S.at(-0.72, 0.9), S.at(0.0, 0.94), S.at(0.6, 0.96), S.at(1.0, 0.88)];
  f.part([...bl.map(q => add(q, [0, -8])), ...bl.slice().reverse().map(q => add(q, [0, 8]))], { fill: '#2e2620', shadow: '#0e0a08', shade: 0.4, inkW: 1.3, tex: 'mottle' + s });
  const bk = S.at(0.62, 0.96); f.part([add(bk, [-10, -12]), add(bk, [10, -12]), add(bk, [10, 12]), add(bk, [-10, 12])], V.BRS(f, { sharp: true, inkW: 1.3, cast: false })); f.flat([add(bk, [-5, -7]), add(bk, [5, -7]), add(bk, [5, 7]), add(bk, [-5, 7])], '#2e2620'); V.verdigris(f, bk, 8, 8, 4);
  const ms = S.at(-0.4, 0.94); f.part([add(ms, [-4, 0]), add(ms, [4, 0]), add(ms, [2, 56]), [...add(ms, [0, 66]), 1], add(ms, [-2, 56])], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.1, cast: false }); V.rope(f, [add(ms, [0, -12]), add(ms, [2, 2])], 4, { col: '#6a5a40' }); // marlinspike on a lanyard

  // ---- head: bloated, bearded, cheeks puffed on the silent call, eyes filmed white; neck scarred by the strike
  f.bone('head');
  f.part(K.chain([S.at(0.1, 0.05), add(HC, [-14, 40])], [76, 70], { steps: 4 }), V.DR(f));
  V.lichtenberg(f, S.at(-0.1, 0.06), deg(-70), 64, 2.6, { depth: 3 });
  // shirt collar and a sodden neckerchief knotted under the beard
  f.part(S.shape([[-0.1, 0.42, 0.1], [-0.02, 0.56, 0.2], [0.08, 0.6, 0.1], [0.12, 0.4, -0.1]]), { fill: coatD, shadow: '#14161e', shade: 0.4, tex: 'weave' + s, inkW: 1.4 }); // stand collar of the coat
  f.part(S.shape([[0.0, -0.05, 0.46], [0.06, 0.0, 0.56], [0.12, 0.05, 0.42]]), { fill: shirt, shadow: '#4a4a52', shade: 0.4, tex: 'weave' + s, inkW: 1.2, cast: false });
  const nk = S.at(0.42, 0.1); f.part([add(nk, [-26, -10]), add(nk, [18, -12]), add(nk, [24, 8]), add(nk, [-20, 12])], { fill: P.slateD, shadow: '#14161e', shade: 0.4, tex: 'weave' + s, inkW: 1.2 }); f.part([add(nk, [4, 6]), add(nk, [14, 8]), add(nk, [22, 46]), [...add(nk, [12, 54]), 1], add(nk, [6, 40])], { fill: P.slateD, shadow: '#14161e', shade: 0.4, tex: 'weave' + s, inkW: 1.1, cast: false });
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.42, chin: -0.02, nose: 1.05, hook: -0.1, mouth: 'set', squint: 0.1, browDown: 0.0, age: true, beard: 'short', beardCol: '#5e5a52', hairCol: '#4a4842', faceShade: 0.6, jawShade: 0.3, iris: '#c8cec6', eyeWhite: '#dde0d8' });
  // heavy swollen lids half over the filmed eyes: no staring
  f.part(hF([[0.04, -0.075], [0.11, -0.1], [0.18, -0.085], [0.18, -0.05], [0.11, -0.055], [0.05, -0.045]]), V.DR(f, { fill: mix(skin, '#7a7898', 0.3), cast: false, inkW: 1, inkHeavy: 1.2, shade: 0.4 }));
  f.part(hF([[0.27, -0.075], [0.31, -0.085], [0.32, -0.055], [0.28, -0.05]]), V.DR(f, { fill: mix(skin, '#7a7898', 0.3), cast: false, inkW: 0.8, inkHeavy: 1, shade: 0.4 }));
  // bloat: puffed cheek pushed out round the call, swollen lower lids, lividity, peeling
  f.part(hF([[0.06, 0.08], [0.22, 0.06], [0.32, 0.16], [0.3, 0.28], [0.16, 0.3], [0.04, 0.22]]), V.DR(f, { cast: false, inkW: 0, shade: 0.5 }));
  f.line(hF([[0.06, 0.1], [0.04, 0.2], [0.12, 0.29]]), 1.2, INK, { op: 0.55 });
  f.flat(hF(ell([0.12, -0.02], 0.09, 0.035, 0, 10)), '#7a7898', { op: 0.55 }); f.flat(hF(ell([0.29, -0.03], 0.03, 0.025, 0, 8)), '#7a7898', { op: 0.5 });
  V.livid(f, hF([[0.0, 0.0]])[0], 12, 10, 4); V.peel(f, hF([[0.05, -0.3]])[0], 2, 0.9, 16);
  f.flat(hF([[0.2, 0.27], [0.3, 0.26], [0.3, 0.31], [0.2, 0.31]]), P.lips, { op: 0.9 }); // blue lips pursed
  // beard: matted, kelp knotted in, standing wiry strands where the strike passed
  V.kelpHang(f, hF([[0.12, 0.55]])[0], 46, 5, -3); V.kelpHang(f, hF([[-0.04, 0.48]])[0], 30, 4, 2);
  V.standingHair(f, [[0.0, 0.5], [0.1, 0.56], [0.2, 0.58]].map(q => hF([q])[0]), 12, { col: '#5e5a52', w: 1.8, lean: 1.2, fan: 0.8 });
  // the cocked hat: felt crown, brim cocked up behind and peaked over the brow, a wilted gull feather, barnacles
  const hat = (pts, o2) => f.part(hF(pts), Object.assign({ fill: '#2e3038', shadow: '#121318', light: '#585c66', shade: 0.42, tex: 'mottle' + s, texOp: 0.6 }, o2 || {}));
  hat([[-0.4, -0.3], [-0.38, -0.56], [-0.18, -0.74], [0.12, -0.72], [0.3, -0.52], [0.32, -0.3]]); // crown
  hat([[-0.62, -0.18], [-0.72, -0.62, 1], [-0.5, -0.5], [-0.3, -0.48], [-0.32, -0.3]], { fill: '#26282e' }); // back cock, turned up
  hat([[-0.36, -0.3], [-0.1, -0.4], [0.2, -0.38], [0.42, -0.3], [0.62, -0.42, 1], [0.56, -0.24], [0.3, -0.18], [-0.1, -0.2], [-0.4, -0.16]], { inkW: 1.6 }); // front brim peaked
  f.line(hF([[-0.32, -0.33], [0.0, -0.37], [0.3, -0.33], [0.55, -0.36]]), 1.2, '#6a6e78', { op: 0.6 });
  f.part(hF([[-0.2, -0.36], [-0.02, -0.4], [-0.02, -0.3], [-0.2, -0.28]]), { fill: '#1a1c22', shade: 0.3, inkW: 1, cast: false }); // cockade
  V.barnacles(f, hF([[-0.5, -0.4]])[0], 14, 10, 4, 3, 5);
  f.flat(hF(ell([0.05, -0.6], 0.05, 0.03, 0.3, 8)), '#0a0a0c'); f.line(hF([[0.0, -0.62], [0.1, -0.58]]), 1, '#e8c060', { op: 0.7 }); // scorch hole through the crown
  // wilted feather: from the cockade over the brim, hanging plumb in a limp curve
  const fq = hF([[-0.12, -0.36]])[0];
  const wf = V.feather(f, fq, deg(128), 84, 22, { fill: '#7e7a72', shadow: '#2a2a30', light: '#a8a49a', shade: 0.4, tex: 'barb' + s, texOp: 0.7 }, { lead: 0.4, bend: -0.25, notch: [0.45, 0.7], round: true }); // wilted: the shaft broken, the vane hanging limp and split
  V.drip(f, add(wf.tip, [0, 2]), 1);

  // ---- the call's chain: from the shackle under the call, sagging over the chest, up round the collar
  f.bone('torso');
  V.chainLinks(f, [add(add(WN, rot([30, 0], ang(mouth, WN))), [0, 26]), S.at(0.78, 0.26), S.at(0.6, 0.14), S.at(0.24, 0.02)], 7, '#a8aaa8', { w: 1.8 });
  // ---- near arm: coat sleeve, turned-back cuff, swollen hand cupping the call at the lips
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.62)], [66, 56, 52], { steps: 8, bp: [[0, 0.4, 0.1]] }), { fill: coat, shadow: P.navyD, light: P.navyL, shade: 0.4, tex: 'weave' + s, texOp: 0.45 });
    f.stroke([lp(SN, EN, 0.5, 18), lp(SN, EN, 0.75, 2), lp(SN, EN, 0.88, -20)], 2);
    V.barnacles(f, lp(SN, EN, 0.25, 10), 14, 10, 4, 3, 5);
  }, [['upperarm_n', side(EN, mul(de, -1), 30)], ['forearm_n', side(EN, de, 30)]]);
  f.bone('forearm_n');
  f.part(limb(lerp(EN, WN, 0.5), lerp(EN, WN, 0.72), 62, 62, { steps: 4 }), { fill: mix(coat, '#fff', 0.1), shadow: P.navyD, shade: 0.4, tex: 'weave' + s, inkW: 1.4, cast: false }); // turned-back cuff
  for (const t of [0.56, 0.66]) f.part(ell(lp(EN, WN, t, 22), 4, 4, 0, 8), V.BRS(f, { inkW: 1, cast: false }));
  f.part(V.tube([lerp(EN, WN, 0.68), lerp(EN, WN, 0.92)], [44, 40]), V.DR(f, { cast: false }));
  // the bosun's call: silver gun from the hand to the lips, the buoy in the palm, keel and shackle below
  f.bone('whistle');
  const gun = [lp(WN, mouth, -0.1, 4), lp(WN, mouth, 0.5, -3), lp(WN, mouth, 0.94, 0)];
  f.stroke(gun, 12, INK); f.stroke(gun, 8, '#b8bcbc'); f.line(gun.map(q => add(q, [0, -1.5])), 1.2, '#f0f2f0', { op: 0.8 });
    f.bone('hand_n');
  const cg = B.grip(f, WN, EN, ang(WN, mouth), 30, skin, { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'bosun call' });
  V.peel(f, WN, 2); V.barnacle(f, add(WN, [-6, 12]), 4);
  // the buoy and keel peek out of the little-finger side of the fist, bright silver against the swollen hand
  f.bone('whistle');
  const bu = add(WN, rot([30, 0], ang(mouth, WN)));
  f.part(ell(bu, 13, 12, 0, 12), { fill: '#a8acac', shadow: '#3a3e44', light: '#f4f6f4', shade: 0.4, inkW: 1.4, cast: false, hatch: false }); // buoy
  f.flat(ell(add(bu, [-2, -4]), 3.4, 3, 0, 8), '#101214');
  f.part([add(bu, [-14, 8]), add(bu, [12, 10]), add(bu, [8, 19]), add(bu, [-10, 18])], { fill: '#9a9e9e', shadow: '#3a3e44', shade: 0.4, inkW: 1.1, cast: false }); // keel
  f.line(ell(add(bu, [0, 24]), 4, 4, 0, 8).concat([ell(add(bu, [0, 24]), 4, 4, 0, 8)[0]]), 1.8, '#c8cac8'); // shackle ring
  f.flat(ell(add(bu, [4, 4]), 4, 3, 0, 6), '#5a5e5e', { op: 0.6 }); // tarnish
  return f;
}


// ------------------------------------------------------------------ THE LIGHTHOUSE KEEPER (elite, 2.0)
// The wreckers' lamp-keeper, keeping the light burning in the wrong place. Very tall, gaunt and stooped from the stairs,
// but carried heavy: a long oilskin coat soaked dark with a shoulder cape, sea boots, big bony hands. He holds a long
// iron-shod pole upright in both hands like a signal mast; a lighthouse lens-lantern hangs from the gallows arm at its
// top, its light a crackling lightning flame. A rope coil, the keeper's keys and a wrecker's gaff hook hang at the belt.
// A gaunt face with hollow cheeks, eyes screwed up against his own glare, a Lichtenberg fern down the lit cheek.
// Rig: standard humanoid + pole (parent hand_n) + lantern (parent pole, pivot at the hanging ring so it swings) +
// coat_skirt (parent pelvis) + cape (parent torso). The far hand also grips the pole: in game it follows by IK.
// Motion: idle swinging the lantern slowly as a signal (pole, lantern); attack a flash of lightning from the lens.
function lighthouseKeeper() {
  const W = 1100, Hh = 1400, f = new Fig(V.base(602, Hh)); V.textures(f);
  const H = 186, gy = f.o.groundY, s = '602';
  const skin = '#a8968a', skinS = P.skinS, oil = P.oil, oilD = P.oilD;
  const N = [574, 378], C = [500, 520], PV = [498, 770];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.12, 0.12), SF = S.at(0.42, 0.06);
  const pA = deg(-86), WN = [800, 452], WF = add(WN, rot([-262, 0], pA)); // both hands on the pole: the near hand at shoulder height, the far hand lower
  const EN = [622, 540], EF = [690, 640];
  const HN = S.at(-0.25, 0.98), KN = [530, 1050], AN = [512, 1296];
  const HF = S.at(0.3, 0.98), KF = [612, 1040], AF = [646, 1296];
  const HC = [612, 250], hA = 0.1;
  const pTop = add(WN, rot([392, 0], pA)), pBot = add(WN, rot([-560, 0], pA)), arm = add(pTop, [120, 4]), ringP = add(arm, [-6, 14]);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [580, 372], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('pole', WN, 'hand_n').joint('lantern', ringP, 'pole').joint('coat_skirt', S.at(0, 0.9), 'pelvis').joint('cape', S.at(0, 0.05), 'torso');
  const OIL = (o = {}) => V.OI(f, Object.assign({ texOp: 0.7 }, o));
  // salt tide-lines: pale wavy streaks dried on the oilskin
  const tide = (c, w, n) => { for (let i = 0; i < n; i++) { const q = add(c, [0, i * 14]); f.line([add(q, [-w / 2, 0]), add(q, [-w / 6, -4]), add(q, [w / 6, 3]), add(q, [w / 2, -2])], 1.4, P.surf, { op: 0.35 }); } };

  // ---- the pole: a long ash spar, iron-shod at the foot, with a gallows arm and a forged hook at the top
  f.bone('pole');
  f.part(limb(pBot, pTop, 24, 20, { steps: 12 }), V.WD(f, { tex: 'wood' + s, texOp: 0.75 }));
  f.line([lp(pBot, pTop, 0.02, -6), lp(pBot, pTop, 0.98, -5)], 1.4, P.woodL, { op: 0.5, straight: true });
  f.part(limb(pBot, lp(pBot, pTop, 0.08), 30, 26, { steps: 4 }), V.IR(f, { inkW: 1.4 })); V.lichtenberg(f, lp(pBot, pTop, 0.05), pA, 30, 1.4, { metal: true, depth: 1 }); // iron shoe
  for (const t of [0.42, 0.46, 0.78]) f.line([lp(pBot, pTop, t, -14), lp(pBot, pTop, t + 0.01, 14)], 5, '#4e4436', { straight: true }); // tarred whipping
  f.part(limb(lp(pBot, pTop, 0.92), pTop, 30, 26, { steps: 4 }), V.IR(f, { inkW: 1.4 })); // iron cap
  const gal = [lp(pBot, pTop, 0.95), add(pTop, [40, -12]), add(arm, [0, -8]), arm];
  f.stroke(gal, 14, INK); f.stroke(gal, 9, P.iron); f.line(gal.map(q => add(q, [0, -2])), 1.4, P.ironL, { op: 0.7 });
  const brace = [lp(pBot, pTop, 0.86), add(pTop, [60, 30]), add(arm, [-30, 4])]; f.stroke(brace, 9, INK); f.stroke(brace, 5, P.iron);
  f.line([arm, add(arm, [4, 8]), add(arm, [-2, 14]), add(arm, [-8, 10])], 5, INK); f.line([arm, add(arm, [4, 8]), add(arm, [-2, 14]), add(arm, [-8, 10])], 3, P.ironL); // hook
  V.kelpHang(f, add(pTop, [50, -4]), 60, 6, -6);
  // ---- the lens-lantern hanging from the hook
  f.bone('lantern');
  V.lensLantern(f, add(ringP, [0, 8]), 172);

  // ---- far arm: oilskin sleeve behind the coat, the bony far hand on the pole below the near one
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [84, 72], { steps: 6 }), OIL({ fill: oilD }));
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.72)], [72, 64], { steps: 6 }), OIL({ fill: oilD }));
  f.part(V.tube([lerp(EF, WF, 0.6), lerp(EF, WF, 0.92)], [52, 44]), V.SK(f, { fill: skin, cast: false }));
  f.bone('hand_f');
  B.grip(f, WF, EF, pA, 46, skin, { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'keeper far' });

  // ---- legs: long and bony in sea boots to the knee, the coat skirt over them
  const legK = (Hp, Kn, A, sfx, col, wq) => {
    V.legTube(f, Hp, Kn, lerp(Kn, A, 0.3), [wq, wq * 0.74, wq * 0.66], { fill: col, shadow: '#141414', shade: 0.4, tex: 'weave' + s, texOp: 0.45 }, sfx, { A });
    split(f, () => {
      B.boot(f, A, 1, 104, '#262826', { knee: lp(Kn, A, 0.12), kneeW: wq * 0.74, tex: 'mottle' + s });
      const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], top = lp(Kn, A, 0.12), w = wq * 0.4;
      f.part([add(add(top, mul(n, w + 6)), mul(d, -6)), add(add(top, mul(n, -w - 6)), mul(d, -2)), add(add(top, mul(n, -w - 4)), mul(d, 14)), add(add(top, mul(n, w + 4)), mul(d, 10))], { fill: '#1c1e1c', shade: 0.3, inkW: 1.4, cast: false }); // thick boot mouth
      for (const t of [0.55, 0.7, 0.84]) f.line([lp(Kn, A, t, -w * 0.8), lp(Kn, A, t + 0.03, 0), lp(Kn, A, t, w * 0.6)], 1.4, INK, { op: 0.45 });
      f.line([lp(Kn, A, 0.25, w * 0.45), lp(Kn, A, 0.9, w * 0.4)], 2.4, P.slateP, { op: 0.35 }); f.scratches(lp(Kn, A, 0.6, 0), 18, 4, P.slateP, 0.9);
    }, [['shin' + sfx, side(A, mul(add(E.norm(sub(A, Kn)), [0.6, 0]), -1), 36)], ['foot' + sfx, side(A, add(E.norm(sub(A, Kn)), [0.6, 0]), 36)]]);
  };
  legK(HF, KF, AF, '_f', '#3a3a36', 104);
  f.bone('foot_f'); V.barnacles(f, add(AF, [70, 52]), 30, 8, 5, 4, 8);
  legK(HN, KN, AN, '_n', '#44443e', 112);
  f.bone('foot_n'); V.barnacles(f, add(AN, [80, 50]), 30, 8, 6, 4, 9); f.flat(ell(add(AN, [60, 72]), 110, 9, 0, 14), '#3a4448', { op: 0.5 });
  f.bone('shin_n'); V.kelpHang(f, lp(KN, AN, 0.3, -30), 70, 7, 6);

  // ---- the coat skirt: long oilskin to mid-calf, flaring, slit at the back, heavy and dripping
  f.bone('coat_skirt');
  const sk = [S.at(-0.66, 0.86), S.at(0.62, 0.86), add(S.at(0.7, 1.0), [20, 60]), [742, 1150], [700, 1166, 1], [640, 1150], [590, 1170, 1], [540, 1158], [480, 1176, 1], [430, 1160], [392, 1150, 1], [398, 1060], add(S.at(-0.74, 1.0), [-20, 30])];
  f.part(sk, OIL({ texOp: 0.5 }));
  for (const [a2, b2] of [[[440, 860], [416, 1150]], [[520, 880], [500, 1160]], [[600, 870], [620, 1150]], [[680, 860], [710, 1140]]]) { f.stroke([a2, lerp(a2, b2, 0.5), b2], 3); f.line([add(a2, [8, 10]), add(lerp(a2, b2, 0.5), [9, 0]), add(b2, [8, -20])], 2.2, P.oilS, { op: 0.45 }); } // stiff folds with wet sheen
  f.flat([[392, 1110], [700, 1120], [742, 1150], [700, 1166], [640, 1150], [590, 1170], [540, 1158], [480, 1176], [430, 1160], [392, 1150]], '#0c0e0c', { op: 0.35 });
  f.part([[420, 1030], [470, 1020], [476, 1070], [424, 1078]], OIL({ fill: '#3e403a', sharp: true, inkW: 1.4 })); f.stitches([[420, 1030], [470, 1020], [476, 1070], [424, 1078], [420, 1030]], P.bone, 1.1); // patch
  for (const x of [410, 470, 540, 610, 690]) V.drip(f, [x, 1172], 1.4);
  V.saltCrust(f, [560, 1100], 120, 30, 24); tide([480, 960], 70, 3); tide([640, 1000], 60, 2);
  for (const [a2, b2] of [[[460, 900], [450, 1000]], [[560, 920], [566, 1040]], [[650, 900], [662, 980]]]) V.wetSheen(f, [a2, lerp(a2, b2, 0.3), lerp(a2, b2, 0.6), b2], 2.6, 0.4);
  f.line([[392, 1150], [398, 1060], [404, 960]], 2, INK, { op: 0.6 }); // back vent edge

  // ---- torso: oilskin over a gansey, buttoned with horn toggles, the belt with the keeper's gear
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.38, 0.34], [0.08, 0.66, 0.56], [0.24, 0.72, 0.66], [0.45, 0.66, 0.66], [0.66, 0.62, 0.64], [0.86, 0.64, 0.64], [1.02, 0.66, 0.64]]);
  f.part(torso, OIL());
  const edge = [S.at(0.36, 0.1), S.at(0.5, 0.3), S.at(0.52, 0.55), S.at(0.5, 0.86)];
  f.line(edge, 2.4, INK); f.line(edge.map(q => add(q, [-4, 0])), 1.4, P.oilS, { op: 0.5 });
  [0.26, 0.44, 0.62, 0.8].forEach(v => { const q = S.at(0.42, v); f.part(limb(add(q, [-12, 0]), add(q, [12, 2]), 9, 8, { steps: 3 }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.1, cast: false }); f.line([add(q, [12, 2]), add(q, [30, -2])], 2.2, '#2a2420'); }); // horn toggles and their loops
  f.stroke([S.at(-0.3, 0.3), S.at(-0.2, 0.55), S.at(-0.3, 0.78)], 2.6); f.stroke([S.at(0.2, 0.4), S.at(0.15, 0.6)], 2.2);
  V.wetSheen(f, [S.at(-0.4, 0.2), S.at(-0.36, 0.3), S.at(-0.3, 0.45), S.at(-0.28, 0.55)], 2.4, 0.45);
  tide(S.at(-0.1, 0.62), 60, 2); V.saltCrust(f, S.at(0.0, 0.7), 40, 20, 10);
  f.stroke([S.at(0.0, 0.66), S.at(0.1, 0.8)], 2.2); f.stroke([S.at(-0.5, 0.6), S.at(-0.4, 0.8)], 2.4);
  f.part([S.at(-0.36, 0.5), S.at(-0.1, 0.48), S.at(-0.08, 0.62), S.at(-0.36, 0.64)], OIL({ fill: '#34382f', sharp: true, inkW: 1.3, cast: false })); f.line([S.at(-0.36, 0.5), S.at(-0.1, 0.48)], 2.2, INK); // breast pocket flap
  f.part(limb(S.at(-0.3, 0.44), S.at(-0.26, 0.6), 7, 7, { steps: 3 }), { fill: P.brass, shadow: P.brassD, shade: 0.4, inkW: 1, cast: false }); // a wick trimmer in the pocket
  // belt, buckle, rope coil, keys and the gaff hook
  const bl = [S.at(-0.66, 0.86), S.at(0.0, 0.9), S.at(0.64, 0.88)];
  f.part([...bl.map(q => add(q, [0, -12])), ...bl.slice().reverse().map(q => add(q, [0, 12]))], { fill: '#2a2018', shadow: '#0e0a08', shade: 0.4, inkW: 1.4, tex: 'mottle' + s });
  const bk = S.at(0.3, 0.89); f.part([add(bk, [-14, -16]), add(bk, [14, -16]), add(bk, [14, 16]), add(bk, [-14, 16])], V.IR(f, { sharp: true, inkW: 1.4, cast: false })); f.flat([add(bk, [-7, -9]), add(bk, [7, -9]), add(bk, [7, 9]), add(bk, [-7, 9])], '#2a2018');
  V.ropeCoil(f, S.at(-0.48, 1.02), 46, 30, 5, 5, { col: '#7a6c52', a: 0.1 });
  const kr = S.at(0.0, 0.94); V.chainLinks(f, [kr, add(kr, [4, 22])], 8, P.ironL, { w: 1.6 }); f.line(ell(add(kr, [4, 34]), 12, 12, 0, 14).concat([ell(add(kr, [4, 34]), 12, 12, 0, 14)[0]]), 3, P.ironL);
  for (const [a2, l] of [[1.2, 44], [1.6, 52], [1.9, 40]]) { const k0 = add(kr, [4 + Math.cos(a2) * 12, 34 + Math.sin(a2) * 12]), k1 = add(k0, rot([l, 0], a2)); f.line([k0, k1], 5, INK); f.line([k0, k1], 3, P.ironL); f.line([k1, add(k1, rot([8, 0], a2 + 1.5))], 4, P.ironL); } // the lighthouse keys
  // gaff hook: short handle tucked in the belt, the iron hook hanging below
  const gh = S.at(0.56, 0.84); f.part(limb(add(gh, [-4, -40]), add(gh, [6, 70]), 14, 12, { steps: 5 }), V.WD(f, { inkW: 1.2, cast: false })); const gk = add(gh, [6, 70]); const hookP = [gk, add(gk, [2, 40]), add(gk, [-8, 62]), add(gk, [-30, 64]), add(gk, [-38, 50])]; f.stroke(hookP, 11, INK); f.stroke(hookP, 7, P.rust); f.line(hookP.slice(0, 3), 1.4, P.rustL, { op: 0.6 });

  // ---- shoulder cape over the coat, cut ragged by wind and salt
  f.bone('cape');
  const cape = [S.at(-0.5, -0.04), S.at(0.5, -0.02), S.at(0.76, 0.18), S.at(0.78, 0.36), [...S.at(0.6, 0.42), 1], S.at(0.4, 0.38), [...S.at(0.2, 0.46), 1], S.at(0.0, 0.4), [...S.at(-0.24, 0.48), 1], S.at(-0.46, 0.42), [...S.at(-0.74, 0.44), 1], S.at(-0.8, 0.22)];
  f.part(cape, OIL({ fill: mix(oil, '#3a4a44', 0.15) }));
  f.stroke([S.at(-0.4, 0.06), S.at(-0.5, 0.25), S.at(-0.6, 0.4)], 2.4); f.stroke([S.at(0.2, 0.04), S.at(0.3, 0.25), S.at(0.38, 0.36)], 2.2);
  V.wetSheen(f, [S.at(-0.2, 0.05), S.at(0.0, 0.1), S.at(0.2, 0.12), S.at(0.4, 0.16)], 2.4, 0.5);
  V.scorch(f, S.at(0.5, 0.15), 30, 18, 0.55); V.lichtenberg(f, S.at(0.5, 0.1), deg(110), 70, 2, { metal: true, depth: 2 }); // burnt where the strike came down the pole
  for (const v of [0.42, 0.46]) V.drip(f, S.at(-0.3 + v, v + 0.02), 1.3);
  V.barnacles(f, S.at(-0.6, 0.12), 20, 10, 5, 3, 6);

  // ---- head: gaunt, stooped forward, eyes screwed up against the glare; sou'wester with its long back flap
  f.bone('head');
  f.part(K.chain([S.at(0.1, 0.0), add(HC, [-20, 70])], [92, 80], { steps: 4 }), V.SK(f, { fill: skin }));
  f.part(S.shape([[-0.14, 0.4, 0.2], [-0.04, 0.6, 0.5], [0.08, 0.56, 0.5], [0.12, 0.3, 0.2]]), OIL({ inkW: 1.6 })); // collar turned up
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 1.0, chin: 0.06, nose: 1.14, hook: 0.35, squint: 0.82, browDown: 0.07, age: true, gaunt: true, beard: 'stubble', beardCol: '#5a5650', hairCol: '#c8c6bc', faceShade: 1.1, jawShade: 0.6, browCol: '#8a8680', browW: 0.05 });
  // hollow cheeks, crow's feet from squinting, the Lichtenberg fern down the cheek and neck
  f.flat(hF([[0.04, 0.12], [0.2, 0.16], [0.26, 0.26], [0.16, 0.34], [0.02, 0.28]]), '#3a2a2a', { op: 0.25 });
  for (let i = 0; i < 4; i++) f.line(hF([[0.2 + i * 0.012, -0.06 + i * 0.03], [0.24 + i * 0.02, -0.04 + i * 0.045]]), 1.1, INK, { op: 0.6 });
  for (let i = 0; i < 3; i++) f.line(hF([[0.0, -0.06 + i * 0.03], [-0.06, -0.04 + i * 0.05]]), 1.1, INK, { op: 0.55 });
  f.line(hF([[0.27, 0.08], [0.2, 0.22], [0.16, 0.32]]), 1.6, INK, { op: 0.7 });
  V.lichtenberg(f, hF([[0.0, 0.3]])[0], deg(100), 110, 2.4, { depth: 2, fork: 0.6, col: '#4a2c2e', lite: '#c8b0a4' }); // the scar runs from the jaw down the neck
  // white hair escaping, lifted by static
  V.standingHair(f, [[-0.4, -0.08], [-0.42, 0.04], [-0.36, 0.12], [-0.3, 0.16]].map(q => hF([q])[0]), 30, { col: '#c8c6bc', w: 3, lean: -1.2, fan: 0.9 });
  V.standingHair(f, [[-0.16, -0.22], [-0.08, -0.24], [0.0, -0.25]].map(q => hF([q])[0]), 26, { col: '#d0cec4', w: 2.4, lean: 0.6, fan: 0.7 });
  f.line(hF([[0.06, -0.03], [0.12, -0.015], [0.19, -0.03]]), 1.6, INK, { op: 0.7 }); // the lower lid pushed up by the squint
  // sou'wester: crown, brim turned up in front, the long back flap down over the collar, chin strings
  const sw = (pts, o2) => f.part(hF(pts), Object.assign(OIL({ fill: '#3a3e36' }), o2 || {}));
  sw([[-0.62, -0.18], [-0.7, 0.32], [-0.5, 0.46], [-0.32, 0.36], [-0.3, 0.06], [-0.36, -0.16]], { fill: '#30342e' }); // back flap
  sw([[-0.42, -0.28], [-0.4, -0.54], [-0.16, -0.7], [0.14, -0.68], [0.32, -0.5], [0.34, -0.3]]); // crown
  sw([[-0.5, -0.24], [-0.1, -0.34], [0.3, -0.32], [0.52, -0.4], [0.56, -0.3], [0.32, -0.2], [-0.1, -0.2], [-0.46, -0.12]], { inkW: 1.8 }); // brim
  f.line(hF([[-0.38, -0.27], [0.0, -0.33], [0.3, -0.31], [0.5, -0.36]]), 2, P.oilS, { op: 0.55 });
  for (let i = 0; i < 3; i++) f.line(hF([[-0.3 + i * 0.18, -0.36], [-0.2 + i * 0.16, -0.64]]), 1.4, INK, { op: 0.45 }); // crown seams
  f.line(hF([[-0.24, -0.16], [-0.16, 0.2], [0.02, 0.5]]), 2.4, '#4e4436'); // chin string
  V.drip(f, hF([[0.54, -0.32]])[0], 1.4); V.drip(f, hF([[-0.66, 0.4]])[0], 1.4);

  // ---- near arm: oilskin sleeve to a turned cuff, a big bony hand on the pole at shoulder height
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.76)], [96, 82, 72], { steps: 8, bp: [[0, 0.4, 0.08]] }), OIL());
    f.stroke([lp(SN, EN, 0.4, 30), lp(SN, EN, 0.62, 6), lp(SN, EN, 0.74, -30)], 2.6); f.stroke([lp(EN, WN, 0.15, -30), lp(EN, WN, 0.3, 0), lp(EN, WN, 0.4, 30)], 2.2);
    V.wetSheen(f, [lp(SN, EN, 0.2, -26), lp(SN, EN, 0.5, -30), lp(SN, EN, 0.7, -30)], 2.2, 0.45);
  }, [['upperarm_n', side(EN, mul(de, -1), 42)], ['forearm_n', side(EN, de, 42)]]);
  f.bone('forearm_n');
  f.part(limb(lerp(EN, WN, 0.64), lerp(EN, WN, 0.8), 84, 84, { steps: 4 }), OIL({ fill: '#3a3e38', inkW: 1.6, cast: false })); // cuff
  f.part(V.tube([lerp(EN, WN, 0.76), lerp(EN, WN, 0.94)], [56, 50]), V.SK(f, { fill: skin, cast: false }));
  for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.8 + i * 0.04, -18), lp(EN, WN, 0.8 + i * 0.04, 18)], 1, INK, { op: 0.4 }); // wrist tendons
  f.bone('hand_n');
  B.grip(f, WN, EN, pA, 48, skin, { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'keeper near' });
  return f;
}

// ------------------------------------------------------------------ STORM HARPY (cast, human 1.0)
// A sea-bird of the cliffs remade: a smaller harpy riding the storm down onto the wrecks. Mid-dive, the body stooping
// head-down toward the front rank, both wings thrown up behind in a V, the taloned feet swung forward under the chin to
// rake. A gaunt woman's torso under a ruff of ragged slate feathers, a woman's face with a long beak-like nose, hair and
// head feathers lifted by static. Her arms are the wings: at each wrist a vestigial hand of three hooked fingers.
// Rig (a flier): body (root), head, tail, wing_n_1..3 and wing_f_1..3 (upper arm, forearm, hand), thigh_n/leg_n/foot_n
// and thigh_f/leg_f/foot_f (thigh, tarsus, toes); shadow on the ground is on root.
// Motion: idle hovering (wings beat about wing_*_1, body bob); attack a raking swoop (legs and talons thrown forward).
function stormHarpy() {
  // independent review: the first build's head-down dive was a tangle at sheet size (a near wing standing straight up over
  // the torso, rows of single feathers like tiles, a carrot nose, temple feathers reading as ears). Rebuilt as a stoop read
  // in silhouette: the body one line swooping down at about 18 degrees, the wings raised in a V (the near wing straight up
  // over the shoulders, the far wing swept back), clear of the head, the tail fanned behind, the talons thrown forward under the face to rake, the head leading the dive in profile
  // with the hair streaming back along the body line. Plumage is masses with tipped hems, single feathers only where they
  // read (primaries, tail, a few contour feathers). More story: a scrap of sailcloth torn from a wreck in her talons, a
  // fish hook and line through the wing, an iron ring on a thong at the shank, barnacles, scorched primaries, salt.
  const f = new Fig(V.base(606, 820)); V.textures(f);
  const gy = f.o.groundY, s = '606', H = 94;
  const skin = '#c2bcb0';
  const N = [384, 474], C = [296, 446], PV = [204, 418];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.32, 0.2), SF = S.at(-0.5, 0.3);
  const HC = [446, 470], hA = 0.28, hF = frame(HC, hA, H);
  const HipN = S.at(0.3, 0.84), HipF = S.at(0.12, 0.92), KN = [296, 540], AN = [392, 588], KF = [266, 530], AF = [360, 600];
  const wN = { S: SN, E: [360, 334], W: [334, 220], T: [304, 156] }, wF = { S: SF, E: [250, 344], W: [158, 276], T: [76, 246] };
  const neckB = hF([[-0.14, 0.3]])[0];
  f.joint('body', S.at(0, 0.5)).joint('head', S.at(0.05, 0.02), 'body').joint('tail', PV, 'body').joint('hair', hF([[-0.1, -0.3]])[0], 'head');
  for (const [k, w] of [['n', wN], ['f', wF]]) f.joint(`wing_${k}_1`, w.S, 'body').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  f.joint('thigh_n', HipN, 'body').joint('leg_n', KN, 'thigh_n').joint('foot_n', AN, 'leg_n');
  f.joint('thigh_f', HipF, 'body').joint('leg_f', KF, 'thigh_f').joint('foot_f', AF, 'leg_f');
  const FL = (o = {}) => V.FE(f, Object.assign({ fill: '#525a64', light: '#8a929a' }, o));
  const bodyA = Math.atan2(PV[1] - N[1], PV[0] - N[0]); // pointing back along the dive, up and to the left
  // shadow on the sea-wet sand far below
  f.bone('root'); f.flat(ell([340, gy - 4], 130, 9, 0, 16), '#000', { op: 0.3 }); f.flat(ell([350, gy - 4], 70, 5, 0, 12), '#000', { op: 0.25 });

  // ---- far wing, swept up and back behind the body, lower and further off than the near one
  V.wing(f, wF.S, wF.E, wF.W, wF.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: -1, Lp: 140, Ls: 90, Wp: 28, Ws: 30, np: 8, ns: 9, nt: 3, look: FL({ fill: '#3e444c' }), skin: V.HS(f, { fill: mix(skin, '#000', 0.18) }), lift: true, notchP: [2, 5], notchS: [3, 6], rake: -0.3, wS: 30, wE: 20, wW: 16, darkTips: 0.35 });
  f.bone('wing_f_3'); V.scorch(f, lerp(wF.W, wF.T, 0.9), 34, 14, 0.4, ang(wF.W, wF.T));
  // ---- legs: feathered thigh, scaled tarsus, talons open and thrown forward to rake
  const legH = (Hip, Kn, An, sfx, toes, fill, toeW, before) => {
    f.bone('thigh' + sfx);
    const th = V.lumpy(f, K.chain([Hip, Kn], [62, 36], { steps: 6, bp: [[0, 0.3, 0.2]] }), 3);
    V.plumeMass(f, th, ang(Hip, Kn) + 0.35, 18, FL({ fill, tex: 'barb' + s }), { w: 1, op: 0.5 });
    for (let i = 0; i < 3; i++) V.feather(f, lp(Hip, Kn, 0.45 + i * 0.18, -12), ang(Hip, Kn) + 0.45, 30, 12, FL({ fill: mix(fill, '#fff', 0.05) }), { lead: 0.5, round: true, splits: false, lift: i % 2 });
    f.bone('leg' + sfx);
    const look = { fill: '#7a766e', shadow: '#2e2c2e', light: '#a8a49c', shade: 0.36, tex: 'scute' + s, texOp: 0.7, maxShade: 8 };
    f.part(K.chain([Kn, An], [24, 17], { steps: 6, bp: [[0, 0.15, 0.12]] }), Object.assign({ k: 0.9, cast: false }, look));
    const d = E.norm(sub(An, Kn)), nn = [-d[1], d[0]];
    for (let i = 1; i < 7; i++) { const q = lerp(Kn, An, i / 7); f.line([add(q, mul(nn, 9)), add(add(q, mul(nn, 2)), mul(d, 3)), add(q, mul(nn, -6))], 1, INK, { op: 0.5 }); }
    f.bone('foot' + sfx);
    if (before) before();
    V.talonFoot(f, lerp(Kn, An, 0.85), An, toes, toeW, { look });
  };
  // the far talons closed on a scrap of sailcloth torn off a wreck, streaming back along the dive
  legH(HipF, KF, AF, '_f', [[deg(-150), 30, 1, 'back'], [deg(8), 40, 1.6], [deg(36), 44, 1.6], [deg(64), 36, 1.6]], mix(P.slate, '#000', 0.22), 9, () => {
  const sc0 = add(AF, [26, 18]), sa = bodyA + 0.5, sF = frame(sc0, sa, 1);
  f.part(sF([[0, -10], [70, -22], [130, -14], [150, -2, 1], [118, 6], [134, 18, 1], [90, 16], [40, 20], [0, 12]]), { fill: '#b8b0a0', shadow: '#5a5448', light: '#ddd6c6', shade: 0.35, tex: 'weave' + s, texOp: 0.5, inkW: 1.3, cast: false });
  f.stitches(sF([[4, -2], [60, -10], [124, -4]]), '#6a6050', 1); f.part(ell(sF([[100, 0]])[0], 5, 5, 0, 8), V.IR(f, { inkW: 1, cast: false })); f.flat(ell(sF([[100, 0]])[0], 2.4, 2.4, 0, 6), '#1a1a1a'); // seam and a grommet
  f.flat(sF([[60, 4], [100, 2], [96, 12], [64, 14]]), '#2a2420', { op: 0.25 }); // tar and wet
  });
  // ---- tail: a fan of storm-ragged feathers spread behind
  f.bone('tail');
  for (let i = 0; i < 7; i++) V.feather(f, add(PV, [8, 6]), bodyA - 0.32 + i * 0.1, 104 - Math.abs(i - 3) * 9, 28, FL({ fill: i % 2 ? P.slate : P.slateD }), { lead: 0.5, round: true, notch: i === 2 ? [0.6] : i === 5 ? [0.75] : [], dark: 0.3, lift: 1 });
  V.saltCrust(f, add(PV, rot([60, 0], bodyA)), 30, 14, 6);
  // ---- body: a gaunt woman's torso diving, ribs under the skin of the chest; mantle and belly plumage as masses
  f.bone('body');
  const torso = S.shape([[-0.06, 0.3, 0.36], [0.1, 0.5, 0.56], [0.3, 0.56, 0.62], [0.55, 0.52, 0.54], [0.78, 0.5, 0.48], [0.96, 0.52, 0.44], [1.08, 0.42, 0.32]]);
  f.part(torso, V.HS(f, { fill: skin, maxShade: 18 }));
  for (let i = 0; i < 5; i++) f.line([S.at(0.05, 0.3 + i * 0.07), S.at(0.3, 0.32 + i * 0.07), S.at(0.5, 0.36 + i * 0.07)], 1.3, INK, { op: 0.45 }); // ribs
  f.line([S.at(0.05, 0.1), S.at(0.3, 0.12), S.at(0.52, 0.18)], 1.8, mix(P.harpy, '#fff', 0.35), { op: 0.7 }); f.line([S.at(0.06, 0.14), S.at(0.3, 0.16)], 1.1, INK, { op: 0.4 }); // collarbone and its hollow
  V.lichtenberg(f, S.at(0.3, 0.2), deg(140), 64, 2.4, { depth: 2 });
  for (let i = 0; i < 9; i++) { const q = S.at(R2(f, 0.0, 0.45), R2(f, 0.2, 0.5)), a = bodyA + (f.r() - 0.5) * 0.5, l = 6 + f.r() * 9; f.line([q, add(q, rot([l, 0], a))], 2.6, INK); f.line([q, add(q, rot([l * 0.8, 0], a))], 1.3, '#5a6068'); f.flat(ell(q, 2, 2, 0, 6), '#7a6a6a', { op: 0.6 }); } // pin feathers
  V.livid(f, S.at(0.25, 0.4), 26, 18, 4);
  // belly and flanks: a feathered mass from mid-chest to the vent, its hem lying back toward the tail
  const bellyHem = [S.at(0.62, 1.04), S.at(0.3, 1.1), S.at(-0.1, 1.08)];
  V.plumeMass(f, [S.at(-0.3, 0.52), S.at(0.1, 0.5), S.at(0.6, 0.58), S.at(0.62, 0.8), ...V.featherHem(bellyHem, bodyA, 24, f), S.at(-0.4, 0.9)], bodyA, 24, FL({ fill: '#56606a' }), { w: 1.1 });
  // mantle: over the shoulders and back, the hem lying back; lifted by static at the edge
  const ruffHem = [S.at(0.42, 0.36), S.at(0.1, 0.44), S.at(-0.3, 0.5), S.at(-0.6, 0.46)];
  V.plumeMass(f, [S.at(0.3, -0.02), S.at(-0.2, -0.06), S.at(-0.6, 0.06), S.at(-0.66, 0.3), ...V.featherHem(ruffHem.slice().reverse(), bodyA + 0.15, 28, f).reverse(), S.at(0.46, 0.16)], bodyA + 0.15, 28, FL({ fill: '#5e6872' }), { w: 1.2 });
  for (let i = 0; i < 5; i++) V.feather(f, S.at(-0.5 + i * 0.22, 0.3 + (i % 2) * 0.05), bodyA + 0.1 + (f.r() - 0.5) * 0.3, 52, 18, FL({ fill: i % 2 ? '#66707a' : '#58626c' }), { lead: 0.5, round: true, splits: true, lift: 2 });
  V.saltCrust(f, S.at(-0.3, 0.25), 30, 14, 10);
  // ---- head: leading the dive in profile; a woman's gaunt face, the long nose hooked like a beak, the mouth open in a
  // shriek; hair streaming back along the body line, lifted by static at the crown
  f.bone('hair');
  const strand = (r0, a, Lh, w, col) => { const pts = [r0, add(r0, rot([Lh * 0.35, 0], a + 0.1)), add(r0, rot([Lh * 0.7, 0], a - 0.06)), add(r0, rot([Lh, 0], a + 0.08))]; f.stroke(pts, w + 2.5, INK); f.stroke(pts, w, col); f.line(pts.slice(0, 3).map(q => add(q, [0, -1.5])), 0.9, '#d8dad6', { op: 0.5 }); };
  for (let i = 0; i < 11; i++) strand(hF([[-0.34 + (i % 4) * 0.08, -0.44 + (i % 3) * 0.14]])[0], bodyA - 0.12 + (i % 5) * 0.06 + (f.r() - 0.5) * 0.1, 110 + f.r() * 70, 9 - (i % 3) * 2, i % 2 ? '#8e9092' : '#6e7276');
  f.bone('head');
  f.part(K.chain([S.at(0.08, 0.02), neckB], [54, 40], { steps: 4 }), V.HS(f, { maxShade: 10 }));
  for (let i = 0; i < 3; i++) f.line([S.at(-0.05 + i * 0.12, 0.0), lerp(S.at(-0.05 + i * 0.12, 0.0), neckB, 0.85)], 1.1, INK, { op: 0.45 }); // neck cords
  B.head(f, HC, H, hA, { skin, jaw: 0.86, chin: 0.06, nose: 1.06, hook: 0.95, mouth: 'set', squint: 0.55, browDown: 0.1, lips: true, age: true, gaunt: true, faceShade: 0.8, faceHatch: false, jawShade: 0.5, hairCol: '#6a6e72', browCol: '#3a3c40', iris: '#d8d0a0', eyeWhite: '#c8c4b4', noEar: true, scar: [[0.0, -0.28], [0.14, -0.16], [0.26, 0.02]] });
  // the shriek: jaw dropped, thin lips drawn back, an uneven row of small teeth, dark throat
  f.flat(hF([[0.17, 0.28], [0.24, 0.265], [0.31, 0.275], [0.32, 0.31], [0.29, 0.4], [0.22, 0.43], [0.17, 0.38]]), '#7a5a5a');
  f.flat(hF([[0.185, 0.29], [0.24, 0.282], [0.3, 0.29], [0.28, 0.38], [0.22, 0.405], [0.19, 0.37]]), '#120a0a');
  for (const [x, l] of [[0.2, 0.025], [0.225, 0.03], [0.25, 0.022], [0.275, 0.028]]) f.flat(hF([[x, 0.288], [x + 0.016, 0.288], [x + 0.01, 0.288 + l]]), '#cfc6ae');
  f.line(hF([[0.16, 0.27], [0.12, 0.33]]), 1.2, INK, { op: 0.6 }); f.line(hF([[0.05, 0.12], [0.12, 0.22], [0.13, 0.3]]), 1.2, INK, { op: 0.45 }); // the cheek drawn tight
  // the scalp: thin grey hair combed back by the wind, strands over the skull, standing at the crown with static
  // the hair: layered tapered strands from the hairline, combed back over the skull by the wind and streaming behind
  // (a dark underlayer, then lighter strands), not a solid cap
  f.part(hF([[0.2, -0.46], [0.0, -0.44], [-0.18, -0.3], [-0.28, -0.04], [-0.34, 0.2], [-0.46, 0.1], [-0.46, -0.3], [-0.3, -0.52], [-0.04, -0.6], [0.18, -0.54]]), { fill: '#3a3c42', shade: 0.2, inkW: 0, cast: false, hatch: false }); // the scalp in shadow under the hair
  const hs = (k, layer) => { const t = k / 21, r0 = hF([[0.2 - t * 0.5, -0.5 + t * 0.12 + Math.sin(t * 3) * 0.04 + (t > 0.6 ? (t - 0.6) * 1.4 : 0)]])[0], c0 = hF([[-0.2 - t * 0.2, -0.56 + t * 0.5]])[0], Lh = R2(f, 90, 170) * (layer ? 0.85 : 1), a = bodyA + R2(f, -0.14, 0.12) + (t - 0.5) * 0.25, e = add(c0, rot([Lh, 0], a));
    const pts = [r0, lerp(r0, c0, 0.6), c0, add(c0, rot([Lh * 0.4, R2(f, -6, 6)], a)), add(c0, rot([Lh * 0.75, R2(f, -8, 8)], a)), e];
    if (!layer) { f.stroke(pts, R2(f, 9, 13), '#2e3036', { taper: 'start' }); return; }
    f.stroke(pts, R2(f, 4, 7), [ '#7a7e82', '#9a9c9e', '#b8bab8', '#6a6e72'][k % 4], { taper: 'start' }); f.line(pts.slice(0, 4), 0.8, '#e0e0dc', { op: 0.35 }); };
  for (let k = 0; k < 22; k++) hs(k, 0);
  for (let k = 0; k < 22; k++) hs(k, 1);
  V.standingHair(f, [[-0.3, -0.42], [-0.12, -0.54], [0.06, -0.54]].map(q => hF([q])[0]), 18, { col: '#9a9c9e', w: 2, fan: 1.0, lean: -0.4 });
  V.sparks(f, hF([[-0.1, -0.66]])[0], 4, 14, { s: 0.7 });
  // ---- near leg: forward and lower, talons spread to rake; barnacles and an iron ring on a thong at the shank
  legH(HipN, KN, AN, '_n', [[deg(-140), 34, 1, 'back'], [deg(4), 50, 1], [deg(32), 56, 1], [deg(62), 46, 1]], '#68727c', 10);
  f.bone('leg_n');
  V.barnacles(f, lerp(KN, AN, 0.35), 8, 10, 3, 3, 5);
  const rq = lerp(KN, AN, 0.62); f.line([add(rq, [-10, -6]), add(rq, [10, 6])], 3, '#3a2e24'); f.line([add(rq, [-10, -6]), add(rq, [10, 6])], 1.4, '#6a5440');
  const ring = ell(add(rq, [-8, 16]), 7, 8, 0.3, 12); f.line(ring.concat([ring[0]]), 4.6, INK); f.line(ring.concat([ring[0]]), 2.6, P.ironL); f.line([add(rq, [-6, 2]), add(rq, [-8, 9])], 1.2, '#6a5440');
  // ---- near wing: swept up and back from the shoulder, the leading edge forward; the clawed vestigial hand at the wrist
  V.wing(f, wN.S, wN.E, wN.W, wN.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: -1, Lp: 160, Ls: 100, Wp: 32, Ws: 34, np: 9, ns: 10, nt: 3, look: FL(), skin: V.HS(f), lift: true, notchP: [3, 6], notchS: [2, 5, 8], rake: -0.3, wS: 34, wE: 22, wW: 18, darkTips: 0.35 });
  f.bone('wing_n_2');
  V.lichtenberg(f, lerp(wN.E, wN.W, 0.3), ang(wN.E, wN.W) - 0.4, 56, 1.8, { depth: 2 });
  const fhk = lerp(wN.E, wN.W, 0.55); f.line([add(fhk, [-3, -5]), add(fhk, [4, 4]), add(fhk, [-1, 10]), add(fhk, [-6, 6])], 2.4, P.ironL); f.line([add(fhk, [-6, 6]), add(fhk, [-40, 2]), add(fhk, [-80, 10]), add(fhk, [-120, 6])], 1, '#2a2a2a', { op: 0.8 }); // a fish hook through the leading edge, its line streaming back
  f.bone('wing_n_3');
  V.wristClaw(f, wN.W, ang(wN.E, wN.W) + 0.9);
  V.scorch(f, lerp(wN.W, wN.T, 0.95), 36, 14, 0.4, ang(wN.W, wN.T));
  // water flung off the dive
  f.bone('body');
  for (let i = 0; i < 10; i++) { const q = add(S.at(R2(f, -0.6, 0.6), R2(f, 0.2, 1.0)), rot([R2(f, 30, 90), 0], bodyA + R2(f, -0.4, 0.4))); V.drip(f, q, 0.9, P.surf); }
  return f;
}

// ------------------------------------------------------------------ HARPY MATRON (elite, 2.0)
// The mother of the storm harpies, the sea-cliff's oldest bird, perched on a barnacled stack of rock with a ship's
// snapped mast wedged in it. A big harpy: a woman's torso and face, an albatross's long narrow wings half spread, taloned
// legs gripping the rock. Slate feathers charged and lifting; long grey hair torn back by the gale; a tarnished gold
// circlet of the Drowned Kingdom on her brow (the only gold on the coast). Lightning: a Lichtenberg fern over her
// collarbone and down the near arm, singed feather tips. Water: clumped wet plumage, salt, barnacles on the shanks.
// Rig: rock (root), body (pivot at the hips), head, hair, tail, wing_n_1..3, wing_f_1..3, thigh_n/leg_n/foot_n,
// thigh_f/leg_f/foot_f. Motion: idle a screech and a wing shake; attack a diving talon strike.
function harpyMatron() {
  const W = 1100, Hh = 1400, f = new Fig(V.base(603, Hh)); V.textures(f);
  const gy = f.o.groundY, s = '603', H = 196;
  const skin = '#c4bdb2', skinS = P.harpyS;
  const N = [566, 520], C = [520, 640], PV = [494, 800];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.22, 0.12), SF = S.at(0.32, 0.1);
  const HC = [614, 372], hA = 0.1;
  const HipN = S.at(-0.1, 0.92), HipF = S.at(0.3, 0.9), KN = [548, 900], AN = [596, 1004], KF = [610, 896], AF = [664, 1000];
  // independent review: the first build held both wings out level like a T-pose (stiff symmetric fans) and the near
  // wing's bare arm crossed her chest. Now the near wing is raised back from the near shoulder, the wrist high and the
  // long albatross hand breaking down from it; the far wing is lower, half folded and foreshortened, behind the body
  // toward her front. Coverts in rows that cast onto each other, the leading edge feathered.
  const wN = { S: SN, E: [384, 446], W: [214, 386], T: [96, 520] }, wF = { S: SF, E: [700, 504], W: [826, 472], T: [950, 556] };
  f.joint('rock', [540, gy]).joint('body', S.at(0, 0.9), 'rock').joint('head', [574, 500], 'body').joint('hair', [560, 380], 'head').joint('tail', PV, 'body');
  for (const [k, w] of [['n', wN], ['f', wF]]) f.joint(`wing_${k}_1`, w.S, 'body').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  f.joint('thigh_n', HipN, 'body').joint('leg_n', KN, 'thigh_n').joint('foot_n', AN, 'leg_n');
  f.joint('thigh_f', HipF, 'body').joint('leg_f', KF, 'thigh_f').joint('foot_f', AF, 'leg_f');
  const FL = (o = {}) => V.FE(f, Object.assign({ fill: '#56606a', light: '#9aa2a8' }, o));

  // ---- the perch: a sea stack crusted with barnacles, a snapped mast wedged in its crack, surf foam at the foot
  f.bone('rock');
  const rock = [[300, gy], [330, 1200], [372, 1080], [420, 1024], [500, 1008], [612, 1010], [700, 1020], [760, 1060], [800, 1150], [830, gy]];
  f.part(V.lumpy(f, rock, 8), { fill: '#4a5058', shadow: '#1a1e24', light: '#7a828a', shade: 0.4, tex: 'pit' + s, texOp: 0.7 });
  for (const q of [[[380, 1100], [440, 1160], [420, 1260]], [[620, 1040], [660, 1120], [700, 1200], [690, 1300]], [[500, 1050], [520, 1140]]]) f.stroke(q, 3, INK); // fissures
  for (let i = 0; i < 7; i++) { const y = 1070 + i * 42; f.line([[330 + i * 6, y], [450, y + 8], [560, y - 4], [680, y + 10], [790 - i * 3, y + 2]], 1.3, INK, { op: 0.35 }); f.line([[340 + i * 6, y - 3], [450, y + 5], [560, y - 7]], 1, '#9aa2a8', { op: 0.25 }); } // bedding planes
  for (let i = 0; i < 6; i++) f.flat(V.lumpy(f, ell([380 + f.r() * 380, 1080 + f.r() * 220], 30 + f.r() * 40, 14 + f.r() * 16, 0, 10), 6), f.r() > 0.5 ? '#3a4048' : '#5e666c', { op: 0.45 });
  for (let i = 0; i < 5; i++) V.kelpHang(f, [400 + i * 80 + f.r() * 20, 1030 + f.r() * 20], 60 + f.r() * 80, 7, (f.r() - 0.5) * 10); // weed draped over the ledge
  f.flat([[440, 1022], [680, 1024], [700, 1040], [430, 1040]], P.surfD, { op: 0.2 }); // salt on the ledge
  for (let i = 0; i < 14; i++) f.flat(ell([420 + f.r() * 300, 1020 + f.r() * 30], 3 + f.r() * 6, 2 + f.r() * 3, 0, 8), '#e8e6dc', { op: 0.7 });
  V.barnacles(f, [480, 1200], 110, 120, 34, 4, 11); V.barnacles(f, [720, 1240], 60, 80, 16, 4, 10);
  for (let i = 0; i < 8; i++) V.mussel(f, [360 + f.r() * 420, 1290 + f.r() * 60], f.r() * 3, 1.4);
  V.chainLinks(f, [[430, 1030], [400, 1120], [420, 1210], [390, 1300]], 16, P.rust, { w: 2.2 }); f.flat(ell([432, 1030], 12, 8, 0, 8), P.rustD); // a wreck chain rusted to the stack
  V.lichtenberg(f, [600, 1016], deg(80), 160, 3, { pale: true, col: '#8a929a', depth: 3 }); // the strike's fern burnt into the rock
  f.flat(ell([560, gy - 6], 320, 20, 0, 20), P.surf, { op: 0.35 }); f.flat(ell([560, gy - 2], 290, 9, 0, 18), P.foam, { op: 0.5 }); // surf at the foot

  // ---- far wing: lower toward her front, half folded, the hand drooping
  V.wing(f, wF.S, wF.E, wF.W, wF.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: 1, Lp: 190, Ls: 112, Wp: 30, Ws: 34, np: 9, ns: 12, nt: 3, look: FL({ fill: '#424a54' }), skin: V.HS(f, { fill: mix(skin, '#000', 0.15) }), lift: true, notchP: [2, 6], notchS: [4, 8], rake: -0.25, wS: 50, wE: 32, wW: 24, darkTips: 0.3, spreadP: 0.45, cover: true });
  f.bone('wing_f_3'); V.wristClaw(f, wF.W, ang(wF.E, wF.W) + 0.9, 1.3);
  // ---- far leg
  const look = { fill: '#5a5652', shadow: '#1e1c1e', light: '#8e8a84', shade: 0.4, tex: 'scute' + s, texOp: 0.7 };
  const legM = (Hip, Kn, An, sfx, fill, toes) => {
    f.bone('thigh' + sfx);
    f.part(V.lumpy(f, K.chain([Hip, Kn], [120, 64], { steps: 6, bq: [[0, 0.3, 0.2]] }), 4), FL({ fill }));
    for (let i = 0; i < 6; i++) V.feather(f, lp(Hip, Kn, 0.15 + i * 0.14, (i % 2 ? 16 : -12)), ang(Hip, Kn) + 0.15, 66, 22, FL({ fill: mix(fill, '#fff', 0.04 * (i % 2)) }), { lead: 0.5, round: true, splits: false, lift: i % 3 === 0 ? 1 : 0 });
    f.bone('leg' + sfx);
    f.part(K.chain([Kn, An], [40, 30], { steps: 6 }), Object.assign({ k: 0.9, cast: false }, look));
    const d = E.norm(sub(An, Kn)), nn = [-d[1], d[0]];
    for (let i = 1; i < 7; i++) { const q = lerp(Kn, An, i / 7); f.line([add(q, mul(nn, 15)), add(add(q, mul(nn, 4)), mul(d, 5)), add(q, mul(nn, -10))], 1.2, INK, { op: 0.5 }); }
    V.barnacles(f, lerp(Kn, An, 0.4), 10, 20, 3, 3, 6);
    f.bone('foot' + sfx);
    V.talonFoot(f, lerp(Kn, An, 0.85), An, toes, 16, { look });
  };
  legM(HipF, KF, AF, '_f', '#4a525c', [[deg(-170), 52, -1, 'back'], [deg(10), 74, 1], [deg(32), 80, 1], [deg(56), 66, 1]]);
  // ---- tail: long slate rectrices hanging behind and below the perch
  f.bone('tail');
  for (let i = 0; i < 8; i++) V.feather(f, add(PV, [-10, 10]), deg(118 + i * 4), 190 - Math.abs(i - 4) * 14, 40, FL({ fill: i % 2 ? '#4a525c' : '#56606a' }), { lead: 0.5, round: true, notch: i === 3 ? [0.6] : [], dark: 0.25, darkOp: 0.3 });
  // ---- body: a gaunt old woman's torso under a feathered mantle; belly and flanks feathered into the legs
  f.bone('body');
  const torso = S.shape([[-0.06, 0.32, 0.36], [0.1, 0.56, 0.56], [0.3, 0.6, 0.62], [0.52, 0.58, 0.54], [0.72, 0.56, 0.5], [0.9, 0.62, 0.52], [1.04, 0.56, 0.4]]);
  f.part(torso, V.HS(f, { fill: skin }));
  for (let i = 0; i < 3; i++) { const v = 0.44 + i * 0.075; f.line([S.at(-0.3, v - 0.03), S.at(0.0, v + 0.01), S.at(0.3, v + 0.02), S.at(0.5, v + 0.06)], 1.5, INK, { op: 0.45 - i * 0.08 }); f.line([S.at(-0.26, v - 0.015), S.at(0.0, v + 0.025), S.at(0.3, v + 0.035)], 1.1, mix(skin, '#fff', 0.35), { op: 0.4 }); } // ribs under thin skin
  f.line([S.at(0.5, 0.36), S.at(0.54, 0.6)], 1.2, INK, { op: 0.4 }); for (let i = 0; i < 10; i++) { const q = S.at(R2(f, -0.3, 0.45), R2(f, 0.38, 0.66)), a = deg(95) + (f.r() - 0.5) * 0.5, l = 8 + f.r() * 12; f.line([q, add(q, rot([l, 0], a))], 3, INK); f.line([q, add(q, rot([l * 0.8, 0], a))], 1.5, '#5a6068'); f.flat(ell(q, 2.4, 2.4, 0, 6), '#7a6a6a', { op: 0.6 }); } // pin feathers breaking the skin
  f.line([S.at(0.0, 0.14), S.at(0.3, 0.16), S.at(0.54, 0.22)], 2, mix(skin, '#fff', 0.35), { op: 0.7 }); f.line([S.at(0.05, 0.18), S.at(0.3, 0.2)], 1.2, INK, { op: 0.45 }); // collarbone and its hollow
  f.flat([S.at(0.42, 0.2), S.at(0.5, 0.22), S.at(0.47, 0.3)], '#3a2e30', { op: 0.3 }); // sternal notch
  V.lichtenberg(f, S.at(0.36, 0.17), deg(170), 110, 3, { depth: 3 });
  V.livid(f, S.at(0.2, 0.55), 40, 30, 5);
  // feathered belly, flanks and hips: one plumage mass with a tipped hem over the thighs
  const bellyHem = [S.at(-0.66, 1.08), S.at(-0.2, 1.16), S.at(0.3, 1.14), S.at(0.62, 1.04)];
  V.plumeMass(f, [S.at(-0.62, 0.62), S.at(-0.2, 0.7), S.at(0.2, 0.74), S.at(0.55, 0.66), S.at(0.62, 0.8), ...V.featherHem(bellyHem.slice().reverse(), deg(100), 34, f), S.at(-0.72, 0.8)], deg(100), 34, FL({ fill: '#4e5862' }), { w: 1.1 });
  for (let i = 0; i < 2; i++) V.feather(f, S.at(-0.4 + i * 0.6, 0.92 + (i % 2) * 0.06), deg(90 + i * 14), 62, 22, FL({ fill: '#56606a' }), { lead: 0.5, round: true, splits: true, lift: i % 2 });
  // mantle: a ruff of long contour feathers from the shoulders over the breasts, its hem torn into tips, lifting with static
  const ruffHem = [S.at(-0.7, 0.36), S.at(-0.3, 0.4), S.at(0.0, 0.3), S.at(0.3, 0.38), S.at(0.66, 0.3)];
  V.plumeMass(f, [S.at(-0.6, 0.0), S.at(-0.3, -0.06), S.at(-0.05, 0.1), S.at(0.15, 0.06), S.at(0.5, 0.06), S.at(0.7, 0.16), ...V.featherHem(ruffHem.slice().reverse(), deg(96), 38, f), S.at(-0.76, 0.2)], deg(96), 40, FL({ fill: '#5e6872' }), { w: 1.2 });
  for (let i = 0; i < 3; i++) V.feather(f, S.at(-0.5 + i * 0.42, 0.26 + (i % 2) * 0.06), deg(84 + i * 10 + (f.r() - 0.5) * 16), 64 - i * 6, 24, FL({ fill: i % 2 ? '#66707a' : '#58626c' }), { lead: 0.5, round: true, splits: true, lift: 2 });
  V.saltCrust(f, S.at(0.0, 0.34), 60, 20, 16);
  // ---- near leg in front, gripping the ledge
  legM(HipN, KN, AN, '_n', '#56606a', [[deg(-160), 56, -1, 'back'], [deg(8), 80, 1], [deg(30), 86, 1], [deg(54), 70, 1]]);
  // ---- head: an old wind-torn face, long grey hair torn back by the gale, the drowned queen's circlet
  f.bone('hair');
  const hF = frame(HC, hA, H);
  const strand = (r0, a, L, w, col) => { const pts = [r0, add(r0, rot([L * 0.3, 0], a + 0.1)), add(r0, rot([L * 0.62, 0], a - 0.06)), add(r0, rot([L, 0], a + 0.12))]; f.stroke(pts, w + 3, INK); f.stroke(pts, w, col); f.line(pts.slice(0, 3).map(q => add(q, [0, -2])), 1.1, '#dcdcd6', { op: 0.5 }); };
  // long grey hair torn back by the gale: layered tapered strands (a dark underlayer, lighter strands over it) from the
  // hairline over the skull and out behind, not a cap (independent review: the first build's scalp read as a helmet)
  const hairA = deg(194);
  const hs = (k, layer) => { const t = k / 25, r0 = hF([[0.22 - t * 0.56, -0.52 + t * 0.14 + (t > 0.6 ? (t - 0.6) * 1.6 : 0)]])[0], c0 = hF([[-0.24 - t * 0.2, -0.6 + t * 0.56]])[0], Lh = R2(f, 200, 330) * (layer ? 0.85 : 1), a = hairA + R2(f, -0.16, 0.12) + (t - 0.5) * 0.3, e = add(c0, rot([Lh, 0], a));
    const pts = [r0, lerp(r0, c0, 0.6), c0, add(c0, rot([Lh * 0.35, R2(f, -10, 10)], a)), add(c0, rot([Lh * 0.7, R2(f, -16, 16)], a + 0.05)), e];
    if (!layer) { f.stroke(pts, R2(f, 16, 24), '#34363c', { taper: 'start' }); return; }
    f.stroke(pts, R2(f, 6, 11), ['#8a8e90', '#a8aaa8', '#c4c6c2', '#74787c'][k % 4], { taper: 'start' }); f.line(pts.slice(0, 4), 1, '#e4e4e0', { op: 0.35 }); };
  for (let k = 0; k < 26; k++) hs(k, 0);

  f.bone('head');
  f.part(K.chain([S.at(0.05, 0.04), add(HC, [-20, 70])], [92, 74], { steps: 4 }), V.HS(f, { fill: skin }));
  for (let i = 0; i < 3; i++) f.line([S.at(-0.1 + i * 0.16, 0.02), add(HC, [-36 + i * 14, 66])], 1.4, INK, { op: 0.45 }); // corded old neck
  B.head(f, HC, H, hA, { skin, jaw: 0.94, chin: 0.05, nose: 1.1, hook: 0.5, mouth: 'set', squint: 0.45, browDown: 0.09, lips: true, age: true, gaunt: true, faceShade: 0.9, faceHatch: false, jawShade: 0.5, hairCol: '#8a8e90', browCol: '#6a6c70', iris: '#3a4a52', eyeWhite: '#cfcab8', noEar: true });
  f.flat(hF([[-0.02, -0.24], [0.08, -0.2], [0.06, -0.1], [-0.06, -0.12]]), '#4a3a40', { op: 0.25 }); // hollow temple
  f.line(hF([[0.05, -0.075], [0.11, -0.095], [0.18, -0.08]]), 2, INK, { op: 0.8 }); // heavy upper lid
  // her screech: the mouth drawn open, lips thin and cracked, worn teeth; deep lines of age and weather
  f.flat(hF([[0.17, 0.28], [0.24, 0.27], [0.31, 0.28], [0.31, 0.34], [0.24, 0.37], [0.18, 0.34]]), '#6a4c4c');
  f.flat(hF([[0.185, 0.29], [0.24, 0.282], [0.3, 0.29], [0.29, 0.335], [0.24, 0.355], [0.195, 0.33]]), '#140c0c');
  for (const [x, l] of [[0.2, 0.014], [0.222, 0.018], [0.244, 0.012], [0.268, 0.016]]) f.flat(hF([[x, 0.287], [x + 0.018, 0.287], [x + 0.016, 0.287 + l], [x + 0.002, 0.287 + l]]), '#bdb29a'); // worn teeth
  for (const q of [[[0.04, -0.24], [0.2, -0.26]], [[0.06, -0.3], [0.18, -0.31]], [[0.22, 0.14], [0.17, 0.27]], [[0.05, 0.36], [0.14, 0.44]], [[0.2, -0.04], [0.25, 0.0]], [[0.21, -0.02], [0.27, 0.03]]]) f.line(hF(q), 1.3, INK, { op: 0.55 });
  V.lichtenberg(f, hF([[-0.05, 0.4]])[0], deg(110), 60, 2, { depth: 2, fork: 0.6 });
  f.part(hF([[0.22, -0.5], [0.0, -0.48], [-0.2, -0.32], [-0.3, -0.04], [-0.38, 0.24], [-0.5, 0.12], [-0.5, -0.3], [-0.32, -0.56], [-0.04, -0.64], [0.2, -0.58]]), { fill: '#3a3c42', shade: 0.2, inkW: 0, cast: false, hatch: false }); // scalp shadow under the hair
  for (let k = 0; k < 26; k++) hs(k, 1);
  V.standingHair(f, [[-0.3, -0.5], [-0.14, -0.58], [0.02, -0.6], [0.16, -0.54]].map(q => hF([q])[0]), 34, { col: '#a8aaa8', w: 2.6, fan: 1.1 });
  V.sparks(f, hF([[-0.06, -0.78]])[0], 5, 22, { s: 1 });
  // the circlet: tarnished drowned gold, a socket that lost its stone, verdigris and a crust of tiny barnacles
  const cir = (u0, u1) => { const pts = []; for (let i = 0; i <= 10; i++) { const u = u0 + (u1 - u0) * i / 10; pts.push(hF([[u, -0.34 - 0.06 * Math.cos((u - 0.0) * 2.2)]])[0]); } return pts; };
  const band = cir(-0.44, 0.34);
  f.stroke(band, 22, INK); f.stroke(band, 17, P.gold); f.line(band.map(q => add(q, [0, -4])), 2, P.goldL, { op: 0.7 }); f.line(band.map(q => add(q, [0, 5])), 1.4, P.goldD, { op: 0.8 });
    for (let i = 0; i < 6; i++) f.line([band[1 + i], add(band[1 + i], [3, 6])], 1, P.goldD, { op: 0.8 }); // engraving
  // eye audit 2026-11-23: a round dark socket centred on the brow read as a third eye (an eye motif outside a void
  // world). Now a lozenge bezel set off-centre toward the temple, its stone long gone: four bent prongs, a shallow
  // tarnished seat with a broken corner, no dark round hole.
  { const sk = hF([[-0.1, -0.35]])[0], L = (x, y) => add(sk, rot([x * 1.5, y * 1.5], hA)), lz = [L(-10, 0), L(0, -6), L(10, 0), L(0, 6)];
    f.part(lz.map(q => [q[0], q[1], 1]), { fill: P.goldD, shade: 0.3, inkW: 1.2, cast: false, hatch: false });
    f.flat([L(-6, 0), L(0, -3.4), L(5, 0), L(1, 3)], mix(P.goldD, '#2a2010', 0.7), { op: 0.9 }); // the empty seat, scratched
    f.line([L(-4, 1), L(3, -1)], 0.9, P.goldL, { op: 0.6 });
    for (const [x, y, dx, dy] of [[-10, 0, -3, -4], [0, -6, 2, -4], [10, 0, 4, -2], [0, 6, -1, 4]]) f.line([L(x, y), L(x + dx, y + dy)], 1.8, P.gold); // the bent prongs
    f.flat([L(10, 0), L(6, 3), L(8, 5)], '#0c0a08', { op: 0.7 }); } // the broken corner
  V.verdigris(f, hF([[-0.2, -0.36]])[0], 30, 6, 6, 0.7); for (const u of [-0.36, 0.26]) V.barnacle(f, hF([[u, -0.35]])[0], 4);
  // ---- near wing, half spread toward the front: the arm along the leading edge, the vestigial hand at the wrist
  V.wing(f, wN.S, wN.E, wN.W, wN.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: -1, Lp: 240, Ls: 140, Wp: 36, Ws: 40, np: 10, ns: 16, nt: 4, look: FL(), skin: V.HS(f, { fill: skin }), lift: true, notchP: [3, 7], notchS: [2, 6, 11], rake: -0.3, wS: 64, wE: 40, wW: 30, darkTips: 0.32, spreadP: 0.55, cover: true });
  f.bone('wing_n_1'); V.lichtenberg(f, lerp(wN.S, wN.E, 0.3), ang(wN.S, wN.E) + 0.2, 90, 2.4, { depth: 2 });
  f.bone('wing_n_2'); V.scorch(f, lp(wN.E, wN.W, 0.5, -70), 40, 24, 0.4, ang(wN.E, wN.W)); V.saltCrust(f, lp(wN.E, wN.W, 0.4, -40), 40, 16, 10);
  f.bone('wing_n_3'); V.wristClaw(f, wN.W, ang(wN.E, wN.W) - 0.6, 1.6);
  return f;
}

// ------------------------------------------------------------------ SHOCK EEL (cast, large 1.6 long)
// An eel of the shallows where the wrecks are, reared out of the surf in an S, 1.6 long along its curve. A thick slate
// body with a paler belly, a continuous dorsal fin, a heavy conger head with an underslung jaw of needle teeth and a small
// cold eye (an eel's face, nothing human, not a cartoon fish). Down the belly flank a row of pale electric organ cells,
// the upper ones already glowing lamp yellow before the discharge. Lightning: Lichtenberg scars across the hide, a hook
// and its wire leader fused into the lip. Water: barnacles, kelp wound round it, foam where it leaves the sea.
// Rig: water (root), seg_1..seg_8 (a chain from the water up), head, jaw, fin (pectoral).
// Motion: idle a slow coil (the chain); attack a discharge (organs flare, head and jaw open, bolts to the water).
function shockEel() {
  // independent review: the first build was an S of even width (a tube) with a line of yellow dots stuck along it. Rebuilt
  // as an eel: the body swells from the water to its thickest through the trunk behind the head, narrows a little at the
  // nape; the tail comes up out of the surf behind it, flattened into a blade with a fin fringe round the tip. Where the S
  // turns the body rolls (a muscled twist: the pale belly swings across to face the viewer, spiral creases), the inside of
  // each bend bunches into skin creases, a lateral line runs the flank, and the electric organs are a long band of stacked
  // plates under the skin of the lower flank, glowing through it toward the head, shaded with the body.
  const W = 900, Hh = 1100, f = new Fig(V.base(605, Hh, { grimeY: null })); V.textures(f);
  const gy = f.o.groundY, s = '605', wl = 1010, Lt = [0.6, -0.8];
  const ctrl = [[260, 1120], [300, 990], [420, 880], [476, 748], [416, 612], [320, 506], [312, 386], [388, 300], [486, 266], [572, 270], [660, 300]];
  const C = V.spline(ctrl, 5), SL = V.arcLen(C), L = SL[SL.length - 1];
  const uh = SL[C.findIndex(q => q[0] > 486 && q[1] < 280)] / L; // where the skull begins
  const wb = t => t <= 0.62 ? 104 + 50 * Math.sin(Math.PI / 2 * t / 0.62) : 154 - 26 * Math.min(1, (t - 0.62) / (uh - 0.62)); // thickest through the trunk, a little nape
  const wf = t => t < uh ? wb(t) : wb(uh) * (1 - Math.pow((t - uh) / (1 - uh), 2.2) * 0.62);
  const at = u => V.at(C, SL, Math.max(0, Math.min(L - 0.5, u * L)));
  const nSeg = 8, segU = i => 0.1 + i * (uh - 0.12) / nSeg;
  const hq = at(uh), hA = Math.atan2(hq.d[1], hq.d[0]);
  // the roll: where the S crosses over between its two bends the body twists and shows its belly
  const tTw = SL[C.reduce((bi, q, i) => E.len(sub(q, [404, 596])) < E.len(sub(C[bi], [404, 596])) ? i : bi, 0)] / L;
  const tw = t => Math.exp(-(((t - tTw) / 0.065) ** 2));
  const curv = u => { const a = at(u - 0.01).d, b = at(u + 0.01).d; return (a[0] * b[1] - a[1] * b[0]) / (0.02 * L); };
  // the tail, out of the surf behind the body: a flattened blade, the fin fringe running round its tip
  const ctrlT = [[642, 1080], [654, 980], [704, 902], [772, 878], [828, 902], [850, 962]];
  const CT = V.spline(ctrlT, 5), ST = V.arcLen(CT), LT = ST[ST.length - 1], atT = u => V.at(CT, ST, Math.max(0, Math.min(LT - 0.5, u * LT)));
  f.joint('water', [W / 2, wl]);
  for (let i = 0; i < nSeg; i++) f.joint(`seg_${i + 1}`, at(segU(i)).p, i ? `seg_${i}` : 'water');
  f.joint('head', at(uh - 0.02).p, `seg_${nSeg}`).joint('jaw', add(hq.p, rot([10, 36], hA)), 'head').joint('fin', at(uh - 0.05).p, `seg_${nSeg}`);
  f.joint('tail_1', atT(0.12).p, 'water').joint('tail_2', atT(0.45).p, 'tail_1').joint('tail_3', atT(0.72).p, 'tail_2');
  const look = V.SL(f, { tex: 'hide' + s, texOp: 0.7, fill: '#56606a', maxShade: 40 });
  const hF = frame(hq.p, hA, 1);
  const side2 = (u, k) => { const q = at(u); return add(q.p, mul(q.n, k * wf(u) / 2)); }; // k: -1 the back edge .. +1 the belly edge
  const strip = (u0, u1, k0, k1, st = 0.006) => { const a = [], b = []; for (let u = u0; u <= u1 + 1e-6; u += st) { a.push(side2(u, typeof k0 === 'function' ? k0(u) : k0)); b.push(side2(u, typeof k1 === 'function' ? k1(u) : k1)); } return [...a, ...b.reverse()]; };
  f.defs.push(`<filter id="esoft${s}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>`);
  const soft = (pts, col, op) => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#esoft${s})"/>`);

  // ---- the tail behind (its own chain out of the water)
  const tw0 = t => 50 * Math.pow(1 - t, 0.8) + 2, finT = t => 9 + 20 * t;
  const tailCuts = [['tail_1', [side(atT(0.45).p, mul(atT(0.45).d, -1), 40)]], ['tail_2', [side(atT(0.45).p, atT(0.45).d, 40), side(atT(0.72).p, mul(atT(0.72).d, -1), 30)]], ['tail_3', [side(atT(0.72).p, atT(0.72).d, 30)]]];
  split(f, () => {
    const fr = V.ribbon(CT, t => (tw0(t) + 2 * finT(t)) * (1 + 0.07 * Math.sin(t * 60))), tipF = add(CT[CT.length - 1], mul(atT(0.999).d, 26));
    const n2 = fr.length / 2; f.part([...fr.slice(0, n2), tipF, ...fr.slice(n2)], { fill: '#8a949c', shadow: '#3a4048', light: '#b4bcc2', shade: 0.25, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'barb' + s, texOp: 0.35, opacity: 0.8 });
    for (let u = 0.08; u < 0.98; u += 0.035) { const q = atT(u), w = tw0(u) / 2; for (const sg of [-1, 1]) f.line([add(q.p, mul(q.n, sg * w)), add(add(q.p, mul(q.n, sg * (w + finT(u) * 0.95))), mul(q.d, 6))], 1.1, '#2a3038', { op: 0.6 }); } // fin rays
    for (const u of [0.3, 0.62, 0.85]) { const q = atT(u); f.flat([add(q.p, mul(q.n, -(tw0(u) / 2 + finT(u)))), add(add(q.p, mul(q.n, -(tw0(u) / 2 + finT(u) * 0.4))), mul(q.d, 4)), add(add(q.p, mul(q.n, -(tw0(u) / 2 + finT(u)))), mul(q.d, 10))], '#2a2e34'); } // torn notches in the fringe
    const blade = V.ribbon(CT, tw0);
    f.part(blade, Object.assign({}, look, { fill: '#4e5862', maxShade: 14, inkW: 1.6 }));
    const ll = []; for (let u = 0.05; u < 0.9; u += 0.04) { const q = atT(u); ll.push(add(q.p, mul(q.n, -tw0(u) * 0.05))); } f.line(ll, 1.3, '#c4cad0', { op: 0.5 });
    for (let u = 0.08; u < 0.86; u += 0.06) { const q = atT(u), w = tw0(u) / 2; f.line([add(q.p, mul(q.n, -w * 0.85)), add(add(q.p, mul(q.n, 0)), mul(q.d, 6)), add(q.p, mul(q.n, w * 0.85))], 1, INK, { op: 0.4 }); } // muscle bands
    const bl = []; for (let u = 0.04; u < 0.9; u += 0.03) { const q = atT(u); bl.push(add(q.p, mul(q.n, tw0(u) * 0.38))); } f.line(bl, 3, '#8e969c', { op: 0.6 }); // pale belly edge
    V.barnacles(f, atT(0.2).p, 20, 16, 4, 3, 6);
  }, tailCuts);

  // ---- the lower jaw, hinged far back, hanging open under the skull (behind the head)
  f.bone('jaw');
  const jaw = hF([[-20, 20], [40, 36], [110, 50], [160, 64], [178, 74], [166, 86], [110, 82], [40, 80], [-20, 56]]);
  f.part(jaw, { fill: '#7e868e', shadow: '#2a2e36', light: '#aab2b8', shade: 0.38, tex: 'mottle' + s, texOp: 0.6 });
  f.flat(hF([[-6, 30], [60, 44], [140, 58], [166, 66], [140, 68], [60, 56], [-6, 42]]), '#1a0e10');
  [[18, 9], [30, 13], [44, 7], [58, 14], [70, 10], [96, 15], [110, 9], [124, 13], [138, 8], [152, 11]].forEach(([x, h], i) => { const y = 46 + x * 0.12; f.part(hF([[x - 2.5, y + 4], [x + 2.5, y + 4], [x + 1 - (i % 2), y - h]]), { fill: P.bone, shadow: '#7a7262', shade: 0.3, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); }); // lower needle teeth, uneven, a gap where some broke
  f.flat(hF([[-10, 66], [60, 74], [140, 80], [170, 82], [110, 84], [40, 82], [-14, 58]]), '#0c1014', { op: 0.4 }); // under the jaw
  f.line(hF([[20, 72], [100, 76], [160, 78]]), 1.2, INK, { op: 0.5 }); for (let i = 0; i < 6; i++) f.flat(ell(hF([[40 + i * 22, 66 + i * 1.5]])[0], 2.2, 2.2, 0, 6), '#2a2e36', { op: 0.6 });

  // ---- the body and head, drawn whole and cut into the chain
  const body = V.ribbon(C, wf);
  const cuts = [];
  for (let i = 0; i < nSeg; i++) { const a2 = at(segU(i)), b2 = at(i < nSeg - 1 ? segU(i + 1) : uh - 0.02); cuts.push([`seg_${i + 1}`, [side(a2.p, a2.d, i ? wf(segU(i)) * 0.5 : 0), side(b2.p, mul(b2.d, -1), wf(i < nSeg - 1 ? segU(i + 1) : uh) * 0.5)]]); }
  const hb = at(uh - 0.02); cuts.push(['head', [side(hb.p, hb.d, wf(uh) * 0.5)]]);
  split(f, () => {
    // dorsal fin along the back (-normal side), frilled and torn, hidden where the body rolls away from us
    const fin = [], fu = []; for (let u = 0.06; u <= uh - 0.03; u += 0.01) { const q = at(u), w = wf(u) / 2; fin.push(add(q.p, mul(q.n, -(w - 4)))); fu.push(u); }
    const finOut = fin.map((p, i) => { const q = at(fu[i]); return add(p, mul(q.n, -(4 + (20 + 8 * Math.sin(i * 0.9) + (i % 9 === 0 ? -10 : 0)) * (1 - 0.85 * tw(fu[i]))))); });
    f.part([...fin, ...finOut.reverse()], { fill: '#4a525c', shadow: '#1c2028', shade: 0.35, inkW: 1.3, cast: false, tex: 'barb' + s, texOp: 0.4 });
    for (let i = 0; i < fin.length; i += 3) { const q = at(fu[i]); f.line([fin[i], add(fin[i], mul(q.n, -24 * (1 - 0.85 * tw(fu[i]))))], 0.9, INK, { op: 0.45 }); }
    f.part(body, Object.assign({ k: 0.9 }, look));
    V.clipDraw(f, body, () => {
      // the pale belly along the +normal side, swinging across the body where it rolls, running into the pale lip
      const bA = u => (u > uh ? 0.1 : 0.58 - 1.0 * tw(u));
      f.part(strip(0.02, 0.995, bA, 1.05), { fill: '#8e969c', shadow: '#3a404a', light: '#b8c0c4', shade: 0.3, inkW: 0, cast: false, tex: 'mottle' + s, texOp: 0.5 });
      f.line(strip(0.02, uh, bA, bA).slice(0, Math.round((uh - 0.02) / 0.006)), 1.3, INK, { op: 0.4 });
      // the electric organs: a band of stacked plates under the skin of the lower flank, cooler low down, glowing toward the head
      const oB = u => bA(u) - 0.03, oA = u => oB(u) - 0.46;
      const u0 = 0.1, u1 = uh - 0.05;
      f.flat(strip(u0, u1, oA, oB), '#aab2ae', { op: 0.3 });
      const hot = u => Math.max(0, Math.min(1, (u - 0.42) / 0.3));
      for (let u = 0.42; u < u1; u += 0.012) soft(strip(u, Math.min(u1, u + 0.014), u => oA(u) + 0.08, u => oB(u) - 0.06), mix(P.lamp, P.lampL, hot(u)), 0.06 + hot(u) * 0.3 * (0.75 + 0.25 * Math.sin(u * 90)));
      V.glowLine(f, strip(0.55, u1, u => (oA(u) + oB(u)) / 2, u => (oA(u) + oB(u)) / 2).slice(0, Math.round((u1 - 0.55) / 0.006)), 22, P.lamp, 0.28);
      for (let u = u0; u < u1; u += 0.0085) { const a2 = side2(u, oA(u)), b2 = side2(u + 0.002, oB(u)); f.line([a2, b2], 0.9, hot(u) > 0.3 ? '#6a5418' : INK, { op: 0.18 + hot(u) * 0.14 }); } // the plates
      for (const k of [0.3, 0.7]) f.line(strip(u0, u1, u => oA(u) + (oB(u) - oA(u)) * k, u => oA(u) + (oB(u) - oA(u)) * k).slice(0, Math.round((u1 - u0) / 0.006)), 0.9, INK, { op: 0.25 });
      f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#mottle${s})" opacity="0.5"/>`); f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#hide${s})" opacity="0.5"/>`); // the skin over them
      // lateral line with its pores, and the myomeres: faint chevrons of muscle under the skin
      const llK = u => oA(u) - 0.14, ll = []; for (let u = 0.06; u <= uh + 0.02; u += 0.012) ll.push(side2(u, llK(u)));
      f.line(ll, 1.8, '#1a1e24', { op: 0.6 }); f.line(ll.map(q => add(q, [0, -2])), 1, '#c4cad0', { op: 0.45 });
      for (let u = 0.07; u < uh; u += 0.022) f.flat(ell(side2(u, llK(u)), 2, 2, 0, 6), '#d0d6da', { op: 0.6 });
      for (let u = 0.08; u < uh - 0.02; u += 0.026) { const q = at(u), w = wf(u) / 2; f.line([add(q.p, mul(q.n, -w * 0.9)), add(add(q.p, mul(q.n, -w * 0.3)), mul(q.d, 8)), add(q.p, mul(q.n, w * (oA(u) - 0.05)))], 1, INK, { op: 0.22 }); }
      // light and shadow across the round body: the side turned from the key light darkens and is hatched, the near
      // side catches a sheen; drawn over the organs and the belly so they sit in the flank
      let run = [], sg0 = null; const runs = [];
      for (let u = 0.0; u <= 1.0; u += 0.006) { const q = at(u), sg = (q.n[0] * Lt[0] + q.n[1] * Lt[1]) < 0 ? 1 : -1; if (sg0 !== null && sg !== sg0) { runs.push([sg0, run]); run = []; } sg0 = sg; run.push(u); }
      runs.push([sg0, run]);
      for (const [sg, us] of runs) {
        if (us.length < 2) continue;
        const sh = strip(us[0], us[us.length - 1], sg * 1.1, sg * 0.42), lt = strip(us[0], us[us.length - 1], -sg * 0.95, -sg * 0.55);
        soft(sh, '#080b10', 0.5); V.clipDraw(f, sh, () => f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#xhatch${s})" opacity="0.35"/>`));
        soft(lt, '#b4bec6', 0.22);
      }
      // the bends: the inside of each turn bunches into creases, the outside stretches with a sheen; the roll's spiral creases
      for (let u = 0.08; u < uh - 0.02; u += 0.011) {
        const k = curv(u); if (Math.abs(k) < 0.0045) continue;
        const sg = Math.sign(k), q = at(u), w = wf(u) / 2, l = Math.min(0.7, Math.abs(k) * 90);
        f.line([add(q.p, mul(q.n, sg * w * 1.02)), add(add(q.p, mul(q.n, sg * w * (1 - l * 0.5))), mul(q.d, 4)), add(q.p, mul(q.n, sg * w * (1 - l)))], 1.6, INK, { op: 0.6 });
        f.line([add(add(q.p, mul(q.n, sg * w * 0.98)), mul(q.d, 3)), add(add(q.p, mul(q.n, sg * w * (1 - l * 0.6))), mul(q.d, 6))], 1, '#aab2ba', { op: 0.35 });
      }
      for (let k = -3; k <= 3; k++) { const ua = tTw - 0.05 + k * 0.012, ub = tTw + 0.03 + k * 0.012; f.line([side2(ua, -1), side2((ua + ub) / 2, 0), side2(ub, 1)], 1.6, INK, { op: 0.45 }); f.line([add(side2(ua, -0.9), [2, -2]), add(side2((ua + ub) / 2, 0), [2, -2])], 1, '#b4bcc4', { op: 0.35 }); }
      // scars: Lichtenberg ferns burnt pale into the dark back, old pale bite rings
      V.lichtenberg(f, side2(0.6, -0.4), Math.atan2(at(0.6).d[1], at(0.6).d[0]) + 2.4, 110, 2.4, { pale: true, col: '#8e989e', depth: 3, op: 0.7 });
      V.lichtenberg(f, side2(0.28, -0.3), Math.atan2(at(0.28).d[1], at(0.28).d[0]) - 2.5, 80, 2, { pale: true, col: '#8e989e', depth: 2, op: 0.7 });
      for (const u of [0.36, 0.7]) { const c = side2(u, -0.35); f.line(ell(c, 14, 10, 0, 12).slice(2, 10), 1.6, '#b8c0c4', { op: 0.6 }); }
    });
    // barnacles low on the body near the water, kelp wound round it
    V.barnacles(f, at(0.16).p, 40, 46, 12, 3, 8); V.barnacles(f, side2(0.44, -0.7), 18, 22, 5, 3, 6);
    for (const u of [0.24, 0.56]) { const q = at(u), w = wf(u) / 2; f.stroke([add(add(q.p, mul(q.n, -w - 4)), mul(q.d, -10)), add(q.p, mul(q.d, 8)), add(add(q.p, mul(q.n, w + 4)), mul(q.d, 18))], 8, P.kelp); f.line([add(add(q.p, mul(q.n, -w)), mul(q.d, -8)), add(q.p, mul(q.d, 8))], 1, P.kelpL, { op: 0.6 }); }
    V.kelpHang(f, side2(0.56, 1.02), 80, 7, 4);
    const sh = []; for (let u = 0.12; u < 0.98; u += 0.03) sh.push(side2(u, -0.62)); V.wetSheen(f, sh, 2.2, 0.45);
  }, cuts);
  // ---- head details on the head bone: the upper teeth into the gape, the cold eye, nostril, gill slit, scars
  f.bone('head');
  [[14, 10], [26, 14], [40, 9], [52, 15], [66, 11], [78, 6], [104, 14], [118, 10], [132, 13], [146, 9], [160, 11]].forEach(([x, h], i) => { const y = 26 + x * 0.12; f.part(hF([[x - 2.5, y - 2], [x + 2.5, y - 2], [x - 1 + (i % 2), y + h]]), { fill: P.bone, shadow: '#7a7262', shade: 0.3, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); }); // upper needle teeth hanging into the gape
  f.line(hF([[-10, 24], [60, 30], [130, 40], [176, 44]]), 2, INK, { op: 0.8 });
  const ey = hF([[112, -14]])[0];
  f.flat(ell(ey, 13, 11, hA, 12), '#1a1e22'); f.part(ell(ey, 9, 8, hA, 12), { fill: '#8a7a3a', shadow: '#3a3012', shade: 0.3, inkW: 1.2, cast: false, hatch: false }); f.flat(ell(ey, 4.5, 6, hA, 8), '#060606'); f.flat(ell(add(ey, [-2, -3]), 2, 1.5, 0, 6), '#fff', { op: 0.7 });
  f.stroke(hF([[92, -22], [112, -28], [134, -22]]), 4, '#2a2e36');
  f.flat(ell(hF([[168, 0]])[0], 4, 3, hA, 8), '#0a0a0c'); f.line(hF([[160, -8], [168, -16]]), 1.6, INK);
  f.line(hF([[-34, -40], [-26, 0], [-34, 30]]), 2, INK, { op: 0.55 }); f.line(hF([[-44, -36], [-38, 0], [-44, 26]]), 1.2, INK, { op: 0.35 }); // gill slit and its fold
  for (let i = 0; i < 5; i++) f.flat(ell(hF([[30 + i * 22, -4 + (i % 2) * 6]])[0], 2.2, 2.2, 0, 6), '#22262c', { op: 0.6 }); // head pores
  f.flat(hF([[-20, 40], [60, 46], [150, 50], [176, 48], [150, 60], [40, 58], [-20, 58]]), '#0a0e14', { op: 0.3 }); // under the skull
  V.lichtenberg(f, hF([[30, -40]])[0], hA + 0.6, 60, 2, { pale: true, col: '#8e989e', depth: 2, op: 0.7 });
  const hk = hF([[140, 40]])[0]; f.line([add(hk, [0, -4]), add(hk, [6, 8]), add(hk, [-2, 16]), add(hk, [-8, 10])], 3, P.ironL); V.fusedRun(f, add(hk, [4, -6]), 8, 3, P.ironL);
  f.line([add(hk, [-8, 10]), add(hk, [-30, 40]), add(hk, [-36, 90])], 1.4, '#1a1a1a'); f.line([add(hk, [-36, 90]), add(hk, [-30, 130])], 1, '#8a8a80', { op: 0.8 });
  V.barnacles(f, hF([[-50, -30]])[0], 16, 14, 4, 3, 6);
  // ---- pectoral fin behind the head
  f.bone('fin');
  const fq = at(uh - 0.05), fa = Math.atan2(fq.d[1], fq.d[0]), fp = add(fq.p, mul(fq.n, wf(uh) * 0.2));
  f.part([fp, add(fp, rot([-20, 34], fa)), add(fp, rot([-52, 44], fa)), add(fp, rot([-60, 26], fa)), add(fp, rot([-30, 6], fa))], { fill: '#6a727c', shadow: '#2a2e36', shade: 0.35, inkW: 1.2, cast: false, tex: 'barb' + s, texOp: 0.5 });
  for (let i = 0; i < 4; i++) f.line([fp, add(fp, rot([-24 - i * 10, 36 - i * 6], fa))], 0.9, INK, { op: 0.5 });
  // ---- the sea in front: the surf line where body and tail leave the water, foam, spray
  f.bone('water');
  const dip = x => (Math.abs(x - 300) < 140 ? 18 * Math.cos((x - 300) / 140 * Math.PI / 2) : 0) + (Math.abs(x - 650) < 80 ? 10 * Math.cos((x - 650) / 80 * Math.PI / 2) : 0);
  const crest = []; for (let x = 0; x <= W; x += 30) crest.push([x, wl - 8 + Math.sin(x * 0.045) * 7 - dip(x) + (f.r() - 0.5) * 6]);
  f.part([...crest, [W, Hh], [0, Hh]], { fill: P.sea, shadow: P.seaD, light: P.seaL, shade: 0.3, inkW: 1.6, cast: false, tex: 'mottle' + s, texOp: 0.6 });
  for (let i = 0; i < 6; i++) { const y = wl + 12 + i * 11; const pts = []; for (let x = 10 + i * 20; x < W - 10; x += 40) pts.push([x, y + Math.sin(x * 0.05 + i) * 3]); for (let k = 0; k < pts.length - 1; k += 2) f.line([pts[k], pts[k + 1]], 1.4, P.seaL, { op: 0.55 - i * 0.07 }); }
  const foam = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const q = V.scatter(f, c, rx, ry), r = R2(f, 2, 7); f.flat(ell(q, r * 1.4, r, 0, 8), P.foam, { op: R2(f, 0.45, 0.85) }); if (f.r() < 0.35) f.line(ell(q, r * 1.4, r, 0, 8).slice(4, 8), 0.8, INK, { op: 0.4 }); } };
  for (let i = 0; i < 9; i++) { const x = 30 + i * 100 + f.r() * 40; foam([x, wl - 6], 46, 6, 14); f.line([[x - 50, wl - 4], [x - 20, wl - 10], [x + 10, wl - 6], [x + 50, wl - 9]], 1.4, P.surf, { op: 0.6 }); }
  foam([300, wl - 18], 130, 16, 110); foam([310, wl - 36], 80, 14, 36); foam([650, wl - 12], 60, 10, 50);
  f.raw(`<ellipse cx="300" cy="${wl - 14}" rx="140" ry="18" fill="${P.surf}" opacity="0.25" filter="url(#spray${f.o.seed})"/>`);
  for (let i = 0; i < 6; i++) { const x = 40 + f.r() * 820, y = wl + 20 + f.r() * 40; f.line([[x, y], [x + 20, y - 3], [x + 40, y + 2], [x + 60, y]], 1.4, P.surfD, { op: 0.5 }); }
  for (let i = 0; i < 18; i++) { const p = [210 + f.r() * 200, wl - 40 - f.r() * 110], r = 1.5 + f.r() * 4; f.part(ell(p, r, r * 1.2, 0, 8), { fill: P.foam, shade: 0.2, inkW: 0.8, inkHeavy: 0.8, cast: false, hatch: false }); }
  for (let i = 0; i < 7; i++) { const u = R2(f, 0.3, 0.95), q = atT(u), r = tw0(u) / 2 + finT(u) * 0.9, a2 = add(q.p, mul(q.n, r)), b2 = add(q.p, mul(q.n, -r)); V.drip(f, a2[1] > b2[1] ? a2 : b2, 1.1, P.surf); } // water running off the tail's fringe
  return f;
}

// ------------------------------------------------------------------ TIDE CRAB (cast, small 0.6, wide)
// A shore crab that picks the wrecks clean, wearing a ship's iron lantern housing as its shell: the domed vented cap,
// the ring, the frame bars and the broken panes, rusted and barnacled, scorched where the strike hit it. Low and wide on
// eight jointed legs; the near crusher claw held forward, wrapped in a tangle of rope with a split plank hanging off it;
// the far claw raised, netting caught on it. Eyes on stalks under the housing's rim. Slate shell, rust iron.
// Rig: body (root), shell, eye_n, eye_f, claw_n_1..4 and claw_f_1..4 (merus, carpus, hand, moving finger),
// leg_n1_1/leg_n1_2 .. leg_f4_1/leg_f4_2. Motion: idle picking at debris (claw_f); attack a claw pinch (claw_n_4 closes).
function tideCrab() {
  // independent review: the first build stood the housing on eight thin legs arching high (knee, then a long thin drop to
  // the ground): the crab-as-spider fault caught twice before. Rebuilt on the reviewed Wreck Crab / Kettle Crab method
  // (kit_VI.crabSeg and dactyl): each walking leg is coxa, merus, carpus, propodus and dactyl, thick and flattened, splayed
  // out sideways and low with the knee barely above the shell's rim, the tip planted; the shell sits low (belly about
  // 60 px off the sand). The claws' arms are crab segments too, no tubes. No canvas shift is needed any more.
  const W = 600, Hh = 820, f = new Fig(V.base(607, Hh)); V.textures(f);
  const gy = f.o.groundY, s = '607';
  const shell = (o = {}) => Object.assign({ fill: '#5c6670', shadow: '#1e232a', light: '#94a0a8', shade: 0.4, tex: 'pit' + s, texOp: 0.5, maxShade: 26 }, o);
  const Bc = [290, 690];
  f.joint('body', Bc).joint('shell', [290, 610], 'body').joint('eye_n', [404, 646], 'body').joint('eye_f', [392, 640], 'body');
  // walking legs: [coxa, knee, carpus end, propodus end, tip]. The near legs (the crab's left side) splay out to the left in
  // front of the shell; the far legs to the right behind the claws, their tips higher on the sand because they are further off.
  const LG = {
    n4: [[176, 668], [100, 636], [66, 660], [44, 722], [26, 788]], n3: [[198, 684], [118, 674], [92, 700], [78, 754], [66, 790]],
    n2: [[226, 698], [160, 708], [140, 730], [132, 766], [124, 792]], n1: [[262, 708], [214, 732], [204, 752], [206, 776], [198, 794]],
    f1: [[392, 700], [452, 688], [474, 708], [488, 750], [496, 778]], f2: [[410, 690], [480, 668], [506, 688], [524, 736], [534, 772]],
    f3: [[424, 678], [500, 646], [528, 664], [548, 716], [560, 766]], f4: [[432, 664], [506, 622], [538, 636], [562, 690], [578, 760]],
  };
  for (const [key, p] of Object.entries(LG)) f.joint(`leg_${key}_1`, p[0], 'body').joint(`leg_${key}_2`, p[1], `leg_${key}_1`).joint(`leg_${key}_3`, p[2], `leg_${key}_2`).joint(`leg_${key}_4`, p[3], `leg_${key}_3`);
  // claws: merus, carpus, the swollen hand (propodus) with its fixed finger, the moving finger on top
  const cN = { a: [336, 714], b: [390, 746], c: [434, 738], hand: [466, 722] }, cF = { a: [394, 684], b: [428, 654], c: [444, 616], hand: [460, 588] };
  for (const [k, c] of [['n', cN], ['f', cF]]) f.joint(`claw_${k}_1`, c.a, 'body').joint(`claw_${k}_2`, c.b, `claw_${k}_1`).joint(`claw_${k}_3`, c.c, `claw_${k}_2`);
  const up = (a, b) => { const d = E.norm(sub(b, a)); return d[0] < 0 ? 1 : -1; }; // which normal side of a segment is its upper edge
  const drawLeg = (key, look, w0) => {
    const [A, Kn, J, Pp, Tp] = LG[key], fwd = Tp[0] < A[0] ? -1 : 1;
    f.bone(`leg_${key}_4`); V.dactyl(f, Pp, Tp, w0 * 0.56, look, fwd * 0.3);
    f.line([lerp(Pp, Tp, 0.62), Tp], 1.3, '#d8e0e2', { op: 0.55 }); // the worn pale tip
    f.flat(ell(add(Tp, [0, 1]), w0 * 0.42, 2.6, 0, 8), '#0c0e10', { op: 0.55 }); // where the tip bites the wet sand
    f.bone(`leg_${key}_3`); V.crabSeg(f, J, Pp, w0 * 0.74, w0 * 0.62, look, { spines: 2, spineSide: -up(J, Pp) });
    f.bone(`leg_${key}_2`); V.crabSeg(f, Kn, J, w0 * 0.86, w0 * 0.76, look, { spines: 1, spineSide: up(Kn, J), hairs: 3 });
    f.bone(`leg_${key}_1`);
    f.part(ell(A, w0 * 0.62, w0 * 0.48, 0, 12), Object.assign({}, look, { cast: false, inkW: 1.2, shade: 0.5, fill: mix(look.fill, '#0a0c10', 0.3) })); // coxa socket under the rim
    V.crabSeg(f, A, Kn, w0 * 1.08, w0 * 0.92, look, { spines: 3, spineSide: up(A, Kn) });
  };
  const claw = (c, k, sc, look, wA) => {
    const d = E.norm(sub(c.hand, c.c)), a0 = Math.atan2(d[1], d[0]), hF = frame(c.c, a0, sc);
    f.bone(`claw_${k}_1`); V.crabSeg(f, c.a, c.b, wA, wA * 0.88, look, { spines: 3, spineSide: -1 });
    f.bone(`claw_${k}_2`); V.crabSeg(f, c.b, c.c, wA * 0.9, wA * 1.06, look, { spines: 2, spineSide: -1, hairs: 4 });
    f.bone(`claw_${k}_3`);
    // the hand: a heavy swollen palm with ridges and tubercles, the fixed finger running on below
    f.part(hF([[-14, -34], [30, -44], [70, -40], [98, -26], [110, -8], [150, 4], [172, 16], [162, 28], [120, 24], [96, 30], [60, 42], [16, 40], [-14, 24]]), Object.assign({}, look, { tex: 'pit' + s, texOp: 0.6 }));
    f.line(hF([[0, -12], [50, -18], [96, -10]]), 1.6, '#b4bcc2', { op: 0.55 }); f.line(hF([[10, 22], [60, 26], [100, 18]]), 1.3, INK, { op: 0.5 });
    f.flat(hF([[0, 18], [60, 24], [100, 18], [96, 30], [60, 42], [16, 40]]), '#0c1014', { op: 0.3 }); // the underside of the palm
    for (let i = 0; i < 6; i++) f.flat(hF(ell([112 + i * 9, 13 - i * 0.4], 2.6, 4, 0, 6)), P.bone, { op: 0.9 }); // teeth on the fixed finger
    for (let i = 0; i < 6; i++) f.flat(ell(hF([[14 + i * 15, -28 + (i % 2) * 7]])[0], 2.4 * sc, 2.4 * sc, 0, 6), '#2a2e34'); // tubercles
    f.part(ell(hF([[-4, -6]])[0], 9 * sc, 9 * sc, 0, 10), Object.assign({}, look, { cast: false, inkW: 1.1, fill: mix(look.fill, '#fff', 0.1) })); // the hinge knob
    f.bone(`claw_${k}_4`);
    f.part(hF([[92, -30], [130, -34], [166, -22], [182, -6, 1], [162, -8], [128, -12], [100, -12]]), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.08) }));
    for (let i = 0; i < 5; i++) f.flat(hF(ell([118 + i * 10, -11], 2.4, 3.4, 0, 6)), P.bone, { op: 0.9 }); // teeth on the moving finger
    f.part(hF([[162, -12], [182, -6], [188, 0], [172, -2]]), { fill: '#22262a', shade: 0.3, inkW: 1, cast: false, hatch: false }); // dark tip
    f.flat(hF([[150, -26], [160, -24], [156, -20]]), '#14161a'); // a chip out of the finger
    return hF;
  };
  f.bone('body'); f.flat(ell([300, gy + 2], 270, 10, 0, 18), '#000', { op: 0.3 }); // its shadow on the wet sand
  // ---- far legs and the far claw raised, netting caught on it
  const farLook = shell({ fill: mix('#5c6670', '#000', 0.22) });
  for (const key of ['f4', 'f3', 'f2', 'f1']) drawLeg(key, farLook, 32);
  const hFf = claw(cF, 'f', 0.66, farLook, 32);
  f.joint('claw_f_4', hFf([[96, -20]])[0], 'claw_f_3');
  f.bone('claw_f_3');
  const net = [hFf([[20, -34]])[0], hFf([[80, -38]])[0], add(hFf([[80, 34]])[0], [6, 40]), add(hFf([[10, 34]])[0], [-10, 56])];
  for (let i = 0; i <= 5; i++) { f.line([lerp(net[0], net[1], i / 5), lerp(net[3], net[2], i / 5)], 1.4, '#8a7e62', { op: 0.85 }); f.line([lerp(net[0], net[3], i / 5), lerp(net[1], net[2], i / 5)], 1.4, '#8a7e62', { op: 0.85 }); }
  V.kelpHang(f, hFf([[50, 34]])[0], 50, 5, 4);
  // ---- the body under the housing: the carapace's rim, mouthparts, the belly plates
  f.bone('body');
  const car = [[140, 678], [170, 640], [240, 620], [330, 618], [400, 634], [436, 664], [440, 694], [414, 718], [340, 730], [250, 730], [180, 722], [146, 702]];
  f.part(car, shell());
  f.flat([[146, 700], [180, 720], [250, 728], [340, 728], [414, 716], [424, 700], [340, 712], [250, 712], [180, 704]], '#0c1014', { op: 0.35 }); // the rim's underside
  for (let i = 0; i < 6; i++) f.line([[190 + i * 40, 712 + (i % 2) * 3], [198 + i * 40, 726]], 1.2, INK, { op: 0.4 }); // abdomen plates underneath
  for (let i = 0; i < 9; i++) { const x = 160 + i * 32; f.line([[x, 690 - Math.sin(i / 8 * Math.PI) * 10], [x + 12, 702 - Math.sin(i / 8 * Math.PI) * 6]], 1.1, INK, { op: 0.45 }); } // the rim's serrations
  f.part([[410, 650], [440, 654], [446, 676], [418, 682]], shell({ fill: '#6e5a52', inkW: 1.1, cast: false })); // mouthparts
  for (let i = 0; i < 4; i++) f.line([[418 + i * 7, 656], [420 + i * 7, 678]], 1, INK, { op: 0.6 });
  V.barnacles(f, [210, 668], 30, 14, 6, 3, 6); V.lichtenberg(f, [380, 668], deg(10), 60, 2, { pale: true, col: '#a8b0b4', depth: 2 });
  // ---- the eyes on stalks, peering from under the rim
  for (const [k, base, top] of [['f', [392, 640], [406, 606]], ['n', [404, 646], [424, 612]]]) {
    f.bone(`eye_${k}`); f.part(K.chain([base, top], [10, 8], { steps: 3 }), shell({ cast: false, inkW: 1.1 })); f.part(ell(top, 8, 9, 0, 10), { fill: '#1a1818', shadow: '#000', light: '#5a5a5a', shade: 0.3, inkW: 1.1, cast: false, hatch: false }); f.flat(ell(add(top, [-2, -3]), 2, 1.6, 0, 6), '#e8e4d8', { op: 0.8 });
  }
  // ---- the shell: a ship's iron lantern housing worn on its back, tipped back on the carapace
  f.bone('shell');
  const sF = frame([286, 640], deg(-8), 0.74);
  const iron = (o = {}) => V.RU(f, Object.assign({ fill: '#5e4a3e' }, o));
  f.part(sF([[-100, 0], [-96, -160], [96, -160], [100, 0]]), { fill: '#12100e', shade: 0.3, inkW: 1.6, cast: false, hatch: false, sharp: true });
  clipDrawX(f, sF([[-96, 0], [-96, -160], [96, -160], [96, 0]]), () => f.part(sF([[-80, 4], [-60, -40], [0, -54], [60, -40], [80, 4]]), shell({ fill: '#7a8288', cast: false, inkW: 1 })));
  const pane = (x0, x1, kind) => {
    const q = sF([[x0, -10], [x0, -150], [x1, -150], [x1, -10]]);
    if (kind === 'gone') { f.flat(sF([[x0 + 4, -60], [x0 + 20, -100], [x1 - 6, -140], [x1 - 4, -12], [x0 + 6, -14]]), '#c8d0cc', { op: 0.18 }); f.line(sF([[x0 + 2, -140], [x0 + 18, -120], [x0 + 6, -100]]), 1.4, '#d8e0dc', { op: 0.6 }); return; }
    f.part(q, { fill: kind === 'soot' ? '#3a3632' : '#8a9894', shadow: '#2a3030', light: '#d8e4e0', shade: 0.25, inkW: 1, cast: false, hatch: false, opacity: kind === 'soot' ? 0.85 : 0.55 });
    if (kind === 'crack') for (const c of [[[x0 + 6, -30], [x0 + 22, -70], [x1 - 6, -84]], [[x0 + 22, -70], [x0 + 16, -130]]]) f.line(sF(c), 1.2, '#e8f0ec', { op: 0.8 });
    f.line(sF([[x0 + 6, -140], [x0 + 12, -40]]), 2, '#f0f4f2', { op: 0.35 });
  };
  pane(-92, -36, 'soot'); pane(-30, 30, 'crack'); pane(36, 92, 'gone');
  for (const x of [-96, -33, 33, 96]) f.part(sF([[x - 6, 0], [x - 6, -156], [x + 6, -156], [x + 6, 0]]), iron({ inkW: 1.2, cast: false, sharp: true }));
  f.part(sF([[-108, 6], [-104, -12], [104, -12], [108, 6], [100, 18], [-100, 18]]), iron());
  f.part(sF([[-104, -150], [104, -150], [100, -166], [-100, -166]]), iron({ sharp: true }));
  f.part(sF([[-100, -164], [-84, -200], [-40, -222], [40, -222], [84, -200], [100, -164]]), iron());
  for (let i = 0; i < 7; i++) f.flat(ell(sF([[-60 + i * 20, -186]])[0], 4, 3, 0, 6), '#0a0806');
  f.part(sF([[-26, -220], [-22, -250], [22, -250], [26, -220]]), iron({ sharp: true }));
  f.part(sF([[-34, -250], [34, -250], [28, -262], [-28, -262]]), iron({ sharp: true }));
  const rg = ell(sF([[0, -282]])[0], 12, 13, 0, 14); f.line(rg.concat([rg[0]]), 7, INK); f.line(rg.concat([rg[0]]), 4.4, P.rust); f.line(rg.slice(8, 12), 1.2, P.rustL, { op: 0.7 });
  for (let i = 0; i < 6; i++) { const q = sF([[-90 + i * 34, -160]])[0]; f.stroke([q, add(q, [2, 30 + f.r() * 30]), add(q, [-1, 60 + f.r() * 40])], 4, P.rustD, { op: 0.55 }); }
  f.part(sF([[-30, -224], [30, -224], [30, -232], [-30, -232]]), V.BRS(f, { inkW: 1, cast: false, sharp: true })); V.verdigris(f, sF([[0, -228]])[0], 26, 4, 6);
  V.barnacles(f, sF([[-60, -196]])[0], 30, 10, 7, 3, 7); V.barnacles(f, sF([[70, 4]])[0], 30, 8, 6, 3, 6);
  V.scorch(f, sF([[50, -200]])[0], 30, 14, 0.6); V.lichtenberg(f, sF([[40, -210]])[0], deg(80), 70, 2.2, { metal: true, depth: 2 });
  V.fusedRun(f, sF([[33, -150]])[0], 30, 5, P.rust);
  V.kelpHang(f, sF([[-100, -160]])[0], 60, 6, -4);
  f.scratches(sF([[0, -190]])[0], 30, 5, '#c8b8a0', 0.8);
  // ---- near legs in front of the body
  const nearLook = shell();
  for (const key of ['n4', 'n3', 'n2', 'n1']) drawLeg(key, nearLook, 38);
  f.bone('leg_n2_1'); V.barnacles(f, lerp(LG.n2[0], LG.n2[1], 0.5), 10, 6, 3, 2.5, 4.5);
  f.bone('leg_n4_2'); V.kelpHang(f, lerp(LG.n4[1], LG.n4[2], 0.5), 34, 4, 3);
  // ---- near crusher claw low and forward: rope wound round the carpus, a split plank dragging off it on the sand
  const hFn = claw(cN, 'n', 0.8, nearLook, 44);
  f.joint('claw_n_4', hFn([[96, -20]])[0], 'claw_n_3');
  f.bone('claw_n_2');
  for (let i = 0; i < 4; i++) { const q = lerp(cN.b, cN.c, 0.15 + i * 0.2), d = E.norm(sub(cN.c, cN.b)), n = [-d[1], d[0]]; V.rope(f, [add(add(q, mul(n, 24)), mul(d, -5)), add(q, mul(d, 3)), add(add(q, mul(n, -24)), mul(d, 6))], 4.4, { col: '#8a7a5a' }); }
  const rEnd = lerp(cN.b, cN.c, 0.75); V.sagRope(f, rEnd, add(rEnd, [-36, 24]), 10, 4.2, { col: '#8a7a5a' });
  const pk = add(rEnd, [-40, 26]); f.part([add(pk, [-28, 0]), add(pk, [24, -4]), add(pk, [26, 12]), add(pk, [10, 16], 1), add(pk, [-4, 24], 1), add(pk, [-24, 14])], V.WD(f, { tex: 'wood' + s, texOp: 0.8 })); f.rivet(add(pk, [-12, 6]), 2.4, P.rustL); f.line([add(pk, [-20, 4]), add(pk, [20, 0])], 1, P.woodL, { op: 0.6 });
  f.bone('claw_n_3');
  V.barnacles(f, hFn([[40, -24]])[0], 22, 10, 5, 3, 6); f.line([hFn([[30, 34]])[0], add(hFn([[30, 34]])[0], [0, 22])], 2.4, P.ironL); f.flat(ell(add(hFn([[30, 34]])[0], [0, 24]), 4, 2, 0, 6), P.ironL); // a bent ship's nail snagged in the joint
  V.lichtenberg(f, hFn([[60, 0]])[0], deg(190), 50, 2, { pale: true, col: '#a8b0b4', depth: 2 });
  return f;
}

// ------------------------------------------------------------------ THE THUNDER WHALE (ruler, 5)
// An old bull whale the wreckers harpooned and failed to kill, breaching from the surf: only the head and front third
// in frame, rising to the upper right (upper left once flipped), the back running out of frame under the sea. A blunt
// sperm-whale head of slate hide, corrugated behind the skull, scarred white by squid suckers and the rake of other
// bulls; the narrow lower jaw hangs half open on its hinge, a row of worn peg teeth, crusted with barnacles. A small old
// eye under heavy folds, filmed white by a cataract. Dozens of rusted harpoons stand out of the hide with their ropes
// hanging plumb; they act as lightning rods: from each entry point a Lichtenberg fern is burnt pale into the hide, and
// lamp-yellow arcs jump between the rods. The Tooth, a pale stone shard, is lodged in the blowhole.
// Rig: water (root), body (pivot at the waterline), jaw (hinge), fin (pectoral), ropes (counter-rotate to stay plumb),
// arcs (VFX layer, parent body). Motion: idle a slow rise and fall in the surf (body); attack the song (jaw opens, arcs).
function thunderWhale() {
  // independent review: the first build's head was a tilted flat grey box (straight parallel sides, a square end) with a
  // stick of a jaw. Rebuilt as a sperm whale's head: a long case with a gently domed top, a blunt rounded forehead that
  // bulges forward above and tucks back under the snout, a long narrow jaw slung well behind the snout's front, the eye
  // low by the mouth's corner, deep corrugated skin down the flank behind the head, and planes that turn: a lit top and
  // forehead, a mid flank, the lower flank and throat in crosshatched shadow, the jaw's underside darkest.
  const W = 1600, Hh = 1600, f = new Fig(V.base(601, Hh, { grimeY: null })); V.textures(f);
  const s = '601', wl = 1330;
  // whale frame: u runs along the body to the snout, v toward the belly; the head rises to the upper right (upper left
  // once flipped), the back runs off the frame just above the surf, the belly is under the sea
  const O = [540, 1024], A = deg(-36), F = frame(O, A, 1), L = (u, v) => F([[u, v]])[0];
  const tab = (T, u) => { if (u <= T[0][0]) return T[0][1]; for (let i = 0; i < T.length - 1; i++) if (u <= T[i + 1][0]) { const t = (u - T[i][0]) / (T[i + 1][0] - T[i][0]); return T[i][1] + (T[i + 1][1] - T[i][1]) * t; } return T[T.length - 1][1]; };
  const top = [[-1400, -360], [-1050, -392], [-760, -404], [-520, -394], [-330, -360], [-190, -320], [-60, -326], [120, -352], [360, -376], [600, -394], [800, -404], [930, -404]];
  const front = [[1004, -392], [1060, -360], [1096, -306], [1116, -236], [1128, -156], [1132, -80], [1124, -6], [1102, 58], [1066, 108], [1012, 146], [940, 168]];
  const lip = [[860, 180], [700, 188], [520, 200], [340, 216], [200, 234], [120, 250]];
  const belly = [[60, 282], [-60, 322], [-250, 372], [-500, 410], [-800, 432], [-1400, 440]];
  const outline = [...top, ...front, ...lip, ...belly];
  const botT = [...belly.slice().reverse(), ...lip.slice().reverse()];
  const topV = u => tab(top, u), botV = u => tab(botT, u);
  const SV = (u, t) => L(u, topV(u) + (botV(u) - topV(u)) * t); // t of the way down the flank (0 the top, 1 the lip or belly)
  const band = (u0, u1, t0, t1, st = 30) => { const a = [], b = []; for (let u = u0; u <= u1; u += st) { a.push(SV(u, t0)); b.push(SV(u, t1)); } return [...a, ...b.reverse()]; };
  f.defs.push(`<filter id="wsoft${s}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="20"/></filter><filter id="wsoft2${s}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>`);
  const soft = (pts, col, op, k = '') => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#wsoft${k}${s})"/>`);
  const hide = (o = {}) => V.SL(f, Object.assign({ fill: '#434c56', shadow: '#12151c', light: '#7a848e', tex: 'hide' + s, texOp: 0.7, shade: 0.4, maxShade: 110 }, o));
  const H0 = [50, 268], jawA = deg(13), jw = (u, v) => add(H0, rot([u - H0[0], v - H0[1]], jawA));
  const jawUp = [[20, 262], [200, 250], [400, 240], [600, 230], [760, 222], [850, 216]], jawE = u => tab(jawUp, u);
  f.joint('water', [W / 2, wl]).joint('body', L(-300, 0), 'water').joint('jaw', L(...H0), 'body').joint('fin', [700, 1390], 'body').joint('ropes', L(300, -380), 'body').joint('arcs', L(400, -620), 'body');
  // ---- the sea behind the breach
  f.bone('water');
  f.part([[0, wl - 10], [W, wl - 30], [W, Hh], [0, Hh]], { fill: P.sea, shadow: P.seaD, shade: 0.2, inkW: 0, cast: false, tex: 'mottle' + s, texOp: 0.5 });

  // ---- the gape: dark throat between the upper lip and the dropped jaw (on the jaw bone, so a wider gape stays closed)
  f.bone('jaw');
  f.flat(F([...jawUp.map(q => jw(...q)), jw(884, 218), [884, 186], ...lip.slice(1), [80, 258]]), '#1c1418');
  // ---- the palate under the upper lip: pale, ridged, a row of sockets the lower teeth close into
  f.bone('body');
  const pal = [[124, 246], [340, 220], [520, 207], [700, 195], [872, 184], [868, 214], [700, 226], [520, 240], [340, 256], [150, 280]];
  f.part(F(pal), { fill: '#a39a9c', shadow: '#4a3e44', light: '#cbc4c4', shade: 0.35, inkW: 1.4, cast: false, tex: 'mottle' + s, texOp: 0.5 });
  for (let i = 0; i < 15; i++) { const u = 230 + i * 42; f.flat(ell(L(u, tab(lip, u) + 16), 9, 5, A, 8), '#2e2226', { op: 0.85 }); }
  f.line(F([[150, 268], [400, 238], [700, 216], [860, 204]]), 1.6, '#5a4a50', { op: 0.6 });
  // ---- the lower jaw: long and narrow, slung under the head well behind the snout, hanging half open on its hinge
  f.bone('jaw');
  for (let i = 0; i < 15; i++) { // worn conical teeth set in the jaw's white gum, curving back; one snapped, one gone
    const u = 150 + i * 46 + (i % 3) * 5, ve = jawE(u) + 3, h = [30, 34, 36, 30, 38, 34, 12, 36, 32, 0, 30, 28, 26, 22, 18][i]; if (!h) { f.flat(F([jw(u - 7, ve + 2), jw(u, ve - 4), jw(u + 7, ve + 2)]), '#14100e'); continue; }
    const tooth = F([jw(u - 9, ve + 5), jw(u - 9, ve - h * 0.55), jw(u - 5, ve - h), jw(u + 1, ve - h * 0.92), jw(u + 6, ve - h * 0.5), jw(u + 9, ve + 5)]);
    if (h < 15) tooth[2] = F([jw(u - 4, ve - h)])[0];
    f.part(tooth, { fill: mix(P.bone, '#a08a5a', (i % 4) * 0.12), shadow: '#5e5440', light: '#f6eedc', shade: 0.4, inkW: 1.3, inkHeavy: 1.8, cast: false, hatch: false });
    f.line(F([jw(u - 6, ve - h * 0.3), jw(u - 4, ve - h * 0.8)]), 1.4, '#fffaf0', { op: 0.6 });
  }
  const jawO = [...jawUp, [884, 214], [904, 226], [900, 248], [840, 262], [700, 276], [520, 298], [320, 324], [160, 346], [60, 356], [4, 332]].map(q => jw(...q));
  f.part(F(jawO), hide({ fill: '#56606a', maxShade: 40 }));
  V.clipDraw(f, F(jawO), () => {
    f.flat(F([[0, 254], [200, 244], [400, 234], [600, 224], [760, 216], [900, 210], [900, 236], [760, 236], [600, 244], [400, 254], [200, 266], [0, 278]].map(q => jw(...q))), '#d2d4d0', { op: 0.85 }); // the white lip of the jaw
    f.flat(F([[0, 306], [220, 300], [420, 284], [620, 264], [820, 250], [920, 244], [920, 320], [0, 380]].map(q => jw(...q))), '#0a0d12', { op: 0.55 }); // the underside, turned away
    f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#xhatch${s})" opacity="0.28"/>`);
    for (let u = 60; u < 820; u += 34) f.line(F([jw(u, jawE(u) + 26), jw(u - 6, jawE(u) + 44), jw(u - 2, 350 - u * 0.1)]), 1.4, INK, { op: 0.35 }); // creases across the jaw
    for (let i = 0; i < 7; i++) { const c = L(...jw(R2(f, 120, 780), R2(f, 262, 290))), r = R2(f, 5, 11); const e = ell(c, r, r * 0.9, 0, 10); f.line(e.concat([e[0]]), 1.8, '#c2c8cc', { op: 0.55 }); }
    f.line(F([[120, 270], [700, 240]].map(q => jw(...q))), 2.4, '#c4cacc', { op: 0.4 }); f.line(F([[140, 278], [620, 254]].map(q => jw(...q))), 2, '#c4cacc', { op: 0.35 }); // a rake scar
  });
  // barnacles crusting the jaw in clumps, spilling over its lower edge; weed hanging plumb from the clumps
  const jawBarn = [];
  for (const [u, rx, n] of [[110, 60, 14], [300, 26, 5], [520, 70, 16], [640, 20, 4], [800, 46, 12]]) { const c = L(...jw(u, 336 - u * 0.09)); V.barnacles(f, c, rx, 14, n, 6, 16); jawBarn.push(L(...jw(u + rx * 0.3, 350 - u * 0.1))); }
  jawBarn.forEach((q, i) => { if (i % 2 === 0) V.kelpHang(f, q, 50 + f.r() * 70, 9, (f.r() - 0.5) * 10); });
  f.line(F(jawO.slice(0, 6)), 1.6, INK, { op: 0.7 });

  // ---- the head and front third
  f.bone('body');
  const bodyO = F(outline);
  f.part(bodyO, hide());
  V.clipDraw(f, bodyO, () => {
    // the back sinks into the dark toward the sea
    soft(F([[-1500, -500], [-560, -500], [-300, 500], [-1500, 520]]), '#0c1016', 0.45);
    // the lit top plane, rounding over the case and down the forehead
    soft(band(-1400, 940, -0.2, 0.2), '#a2acb4', 0.6); soft(band(-600, 940, -0.2, 0.06), '#b8c2c8', 0.4);
    soft(F([[800, -440], [970, -400], [1060, -340], [1110, -250], [1136, -160], [1140, -70], [1120, 14], [1070, 70], [1016, 40], [1028, -60], [1016, -160], [976, -256], [900, -326], [800, -356]]), '#b0bac0', 0.62); // the blunt forehead faces the key light
    soft(F([[1014, 52], [1036, -60], [1024, -170], [982, -264], [900, -340], [880, -320], [960, -250], [1000, -160], [1010, -60], [994, 52]]), '#141a22', 0.3, '2'); // where the brow turns from the front to the flank
    // the flank below the lit plane: a core shadow under the case, the lower flank and the throat in hatched shadow
    soft(band(-1400, 940, 0.56, 1.1), '#0a0d12', 0.42, '2'); soft(band(-1400, 940, 0.8, 1.2), '#06080c', 0.4); soft(band(-1400, 900, 0.3, 0.56), '#141a22', 0.18);
    V.clipDraw(f, band(-1400, 940, 0.6, 1.1), () => f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#xhatch${s})" opacity="0.4"/>`)); V.clipDraw(f, band(-1400, 940, 0.46, 0.6), () => f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#hatch${s})" opacity="0.25"/>`));
    soft(F([[1140, 0], [1090, 90], [1016, 150], [940, 186], [860, 200], [860, 140], [966, 100], [1050, 30]]), '#0c1016', 0.6, '2'); // the snout turns under, out of the light
    // corrugated hide behind the head: deep wavy ridges round the flank, each a dark groove and a lit crest, bowed by the
    // body's roundness; they start shallow behind the eye and deepen toward the back
    for (let u = 170, k = 0; u > -1400; u -= 26 + (k % 3) * 6, k++) {
      const dep = Math.min(1, (170 - u) / 420), pts = [];
      for (let t = 0.04; t <= 1.02; t += 0.06) pts.push(SV(u + 26 * (1 - (2 * t - 1) ** 2) + Math.sin(t * 11 + k * 1.7) * 7, t));
      f.stroke(pts, 2.2 + dep * 3, INK, { op: 0.45 + dep * 0.3 });
      const hi = pts.slice(0, 10).map(q => add(q, rot([7, -2], A)));
      f.line(hi, 1.4 + dep * 1.2, '#aeb8c0', { op: 0.3 + dep * 0.25 }); f.line(pts.slice(10).map(q => add(q, rot([7, -2], A))), 1.2, '#8a949c', { op: 0.18 });
      if (k % 2) { const t0 = 0.2 + f.r() * 0.6, q = SV(u + 10, t0); f.line([q, add(q, rot([16, 10], A)), add(q, rot([26, 4], A))], 1.1, INK, { op: 0.4 }); } // cross creases between ridges
    }
    V.clipDraw(f, band(-1400, 200, 0, 1.05), () => f.raw(`<rect x="0" y="0" width="${W}" height="${Hh}" fill="url(#wrinkle${s})" opacity="0.55"/>`));
    // the head's own skin: long creases above the lip, a few soft folds on the case
    for (let i = 0; i < 4; i++) { const pts = []; for (let u = 180 + i * 30; u <= 880 - i * 40; u += 40) pts.push(L(u, tab(lip, u) - 16 - i * 13 + Math.sin(u * 0.03 + i) * 3)); f.line(pts, 1.8 - i * 0.3, INK, { op: 0.5 - i * 0.08 }); }
    for (const [u, t] of [[420, 0.4], [640, 0.5], [300, 0.62]]) f.line([SV(u - 60, t), SV(u, t - 0.04), SV(u + 70, t + 0.02)], 1.4, INK, { op: 0.3 });
    // scars of an old bull: squid-sucker tracks (rows of rings shrinking along a tentacle's path), the parallel rakes of
    // other bulls' teeth, pale battered patches on the forehead
    for (let k = 0; k < 3; k++) {
      let u = R2(f, 300, 900), v = R2(f, -300, 40); const a = R2(f, -2, 2);
      for (let i = 0; i < 7; i++) { const c = L(u, v), r = R2(f, 9, 16) - i, e = ell(c, r, r * 0.8, A + a + f.r(), 12), k0 = Math.floor(f.r() * 4); f.line(e.slice(k0, k0 + 8 + Math.floor(f.r() * 4)), 2, '#c6ccd0', { op: 0.5 }); u += Math.cos(a + i * 0.2) * R2(f, 26, 40); v += Math.sin(a + i * 0.2) * R2(f, 26, 40); }
    }
    for (let i = 0; i < 70; i++) { const c = L(R2(f, 200, 1100), R2(f, -380, 120)), a = R2(f, 0, 3.14), l = R2(f, 14, 60); f.line([c, add(c, rot([l * 0.5, R2(f, -3, 3)], a)), add(c, rot([l, 0], a))], R2(f, 1, 2.2), '#c4cace', { op: R2(f, 0.25, 0.55) }); } // the white scratch mesh of an old bull's head
    for (let i = 0; i < 16; i++) { const c = SV(R2(f, -700, 900), R2(f, 0.05, 0.7)), r = R2(f, 6, 18), e = ell(c, r, r * 0.9, 0, 12); f.line(e.concat([e[0]]), 2, '#c2c8cc', { op: 0.45 }); }
    for (let k = 0; k < 8; k++) { const c = SV(R2(f, -500, 900), R2(f, 0.05, 0.65)), a = A + R2(f, 0.5, 1.6), n = 3 + (k % 2), l = R2(f, 130, 260); for (let i = 0; i < n; i++) { const p0 = add(c, rot([i * 6, i * 13], a)); f.line([p0, add(p0, rot([l * 0.5, 3], a)), add(p0, rot([l, 0], a))], 2.6 - i * 0.3, '#c6ccce', { op: 0.55 }); } }
    for (let i = 0; i < 5; i++) f.flat(V.lumpy(f, ell(L(R2(f, 860, 1060), R2(f, -280, 0)), R2(f, 22, 50), R2(f, 14, 30), A + f.r(), 12), 8), '#b4bcc0', { op: 0.35 });
    for (let i = 0; i < 6; i++) f.flat(V.lumpy(f, ell(SV(R2(f, -400, 700), R2(f, 0.1, 0.6)), R2(f, 20, 60), R2(f, 10, 26), A + f.r(), 12), 8), '#aab2b6', { op: 0.26 });
    // barnacles in the creases of the lip's corner and on the snout's underside
    V.barnacles(f, L(180, 220), 60, 14, 12, 4, 10); V.barnacles(f, L(960, 140), 60, 26, 14, 4, 11); V.barnacles(f, SV(-200, 0.86), 120, 30, 14, 4, 9);
  });
  f.line(F([[300, -360], [600, -380], [780, -386], [900, -376], [990, -346], [1060, -290], [1100, -210], [1112, -120]]), 5, '#c8d0d4', { op: 0.4 }); // the worn-bright edge where the brow takes the key light
  f.line(F(lip), 4, INK); f.line(F(lip.map(([u, v]) => [u, v - 9])), 1.6, '#9aa2a8', { op: 0.5 }); // the lip line and its lit fold
  // the small old eye low by the mouth's corner, sunk in folds, filmed white by a cataract
  const eye = L(36, 182), eA = A + 0.08;
  for (let i = 0; i < 4; i++) f.line(F([[-40 - i * 10, 156 - i * 14], [36, 144 - i * 16], [120 + i * 12, 162 - i * 12]]), 2.8 - i * 0.4, INK, { op: 0.6 }); // heavy folds over the eye
  for (let i = 0; i < 3; i++) f.line(F([[-20 - i * 8, 208 + i * 9], [36, 218 + i * 10], [100 + i * 10, 206 + i * 8]]), 2.2, INK, { op: 0.5 });
  for (let i = 0; i < 4; i++) f.line([add(eye, rot([-40, -4 + i * 4], eA)), add(eye, rot([-70 - i * 8, -10 + i * 9], eA))], 1.4, INK, { op: 0.45 }); // crow's feet behind it
  f.part([add(eye, rot([-36, 2], eA)), add(eye, rot([-12, -15], eA)), add(eye, rot([20, -13], eA)), add(eye, rot([38, 2], eA)), add(eye, rot([10, 15], eA)), add(eye, rot([-16, 13], eA))], hide({ fill: '#3a424a', cast: false, inkW: 2, maxShade: 12 })); // swollen lids
  f.flat([add(eye, rot([-23, 1], eA)), add(eye, rot([0, -6], eA)), add(eye, rot([23, 0], eA)), add(eye, rot([0, 6], eA))], '#0c0e12');
  f.flat(ell(add(eye, rot([2, 1], eA)), 15, 5, eA, 10), '#8a949c', { op: 0.95 }); f.flat(ell(add(eye, rot([5, 0], eA)), 8, 2.4, eA, 8), '#c4cace', { op: 0.7 }); f.line([add(eye, rot([-30, 10], eA)), add(eye, rot([0, 13], eA)), add(eye, rot([30, 8], eA))], 1.8, '#9aa4aa', { op: 0.6 }); // the cataract: a dull milky film, no pupil
  f.line([add(eye, rot([-25, 0], eA)), add(eye, rot([0, -7], eA)), add(eye, rot([25, -1], eA))], 2.4, INK);
  // ---- the blowhole at the front of the case and the Tooth driven into it: a pale stone shard, chipped, proud flesh round it
  const bh = L(920, -356), ta = A - 1.15;
  f.flat(ell(add(bh, rot([0, 10], A)), 48, 16, A, 14), '#2a1e22', { op: 0.6 });
  f.line([add(bh, rot([-32, -2], A)), add(bh, rot([-10, 8], A)), add(bh, rot([10, -4], A)), add(bh, rot([32, 6], A))], 8, INK);
  const tooth = [add(bh, rot([-10, -24], ta)), add(bh, rot([74, -32], ta)), [...add(bh, rot([158, -19], ta)), 1], add(bh, rot([206, -4], ta)), [...add(bh, rot([222, 4], ta)), 1], add(bh, rot([158, 17], ta)), [...add(bh, rot([84, 27], ta)), 1], add(bh, rot([-10, 21], ta))];
  f.part(tooth, { fill: '#d4c8ae', shadow: '#76664a', light: '#f4ecd6', shade: 0.42, inkW: 2.6, cast: true, hatch: false, tex: 'wrinkle' + s, texOp: 0.45 });
  f.flat([add(bh, rot([74, -32], ta)), [...add(bh, rot([158, -19], ta)), 1], add(bh, rot([222, 4], ta)), add(bh, rot([148, -2], ta)), add(bh, rot([74, -8], ta))], '#8a7a5a', { op: 0.35 });
  for (const q of [[[20, -10], [190, -2]], [[40, 8], [136, 10]], [[104, -21], [124, 0], [112, 18]]]) f.line(q.map(p2 => add(bh, rot(p2, ta))), 1.4, '#6a5a3e', { op: 0.75 }); // strata and a crack
  f.part(ell(add(bh, rot([-4, 0], ta)), 22, 38, ta, 14), hide({ fill: '#6a5a5e', cast: false, inkW: 1.6, maxShade: 14 })); // healed proud flesh
  const tt = add(bh, rot([222, 4], ta));
  // ---- harpoons: rods standing out of the case and the back, a few in the forehead from the boats ahead, short ones in the
  // flank (pointing at the viewer, foreshortened). Each burns its own pale fern into the hide.
  const rods = [];
  [[-380, -0.35, 330], [-230, -0.1, 90], [-90, -0.45, 360], [60, -0.2, 250], [200, 0.1, 100], [330, -0.3, 380], [470, -0.55, 290], [600, -0.15, 330], [740, -0.4, 110], [830, 0.05, 260]]
    .forEach(([u, da, l]) => rods.push({ p: L(u, topV(u) + 12), a: A - Math.PI / 2 + da, L: l }));
  [[1056, -236, -0.3, 300], [1088, -100, 0.05, 250], [1064, 20, 0.4, 200]].forEach(([u, v, da, l]) => rods.push({ p: L(u - 12, v), a: A + da, L: l }));
  [[-280, -120, -0.9, 150], [-60, -60, -0.3, 120], [150, -210, -0.7, 160], [380, -70, -0.2, 130], [560, -240, -0.6, 140], [700, 30, 0.3, 110], [250, 80, -0.1, 120], [880, -140, -0.5, 130]]
    .forEach(([u, v, da, l]) => rods.push({ p: L(u, v), a: A - Math.PI / 2 + da, L: l }));
  V.clipDraw(f, bodyO, () => { for (const r of rods) V.lichtenberg(f, r.p, r.a + Math.PI + R2(f, -0.6, 0.6), R2(f, 110, 190), 3.4, { pale: true, col: '#b8c0c4', depth: 3, op: 0.72 }); });
  const tips = rods.map((r, i) => { const t = V.harpoon(f, r.p, r.a, r.L, { rope: false, w: r.L > 150 ? 11 : 9 }); if (i % 3 === 1) V.scorch(f, r.p, 30, 20, 0.45); return t; });
  const fh = L(300, -40); f.part(limb(fh, add(fh, rot([60, 0], A - 2.2)), 20, 16, { steps: 3 }), V.RU(f, { inkW: 1.4 })); V.fusedRun(f, add(fh, [0, 8]), 30, 6, P.rust); // a harpoon head snapped short, fused by a strike

  // ---- pectoral flipper flung out of the surf beside the throat, scarred, its trailing edge ragged
  f.bone('fin');
  const fp = [700, 1390], fa = Math.atan2(-150, -210);
  f.part([fp, add(fp, rot([110, -46], fa)), add(fp, rot([250, -38], fa)), add(fp, rot([316, 4], fa)), [...add(fp, rot([270, 40], fa)), 1], add(fp, rot([240, 32], fa)), [...add(fp, rot([200, 58], fa)), 1], add(fp, rot([130, 60], fa)), add(fp, rot([20, 54], fa))], hide({ fill: '#525c66', maxShade: 40 }));
  for (let i = 0; i < 4; i++) f.line([add(fp, rot([60 + i * 36, 44], fa)), add(fp, rot([180 + i * 26, 8 + i * 6], fa))], 1.6, INK, { op: 0.4 });
  V.barnacles(f, add(fp, rot([170, 0], fa)), 50, 18, 8, 4, 8);
  // ---- ropes from the rods' shanks hanging plumb, two slung between rods, a cork float, a broken oar, a scrap of net
  f.bone('ropes');
  rods.forEach((r, i) => {
    if (i >= 13 && i % 2) return;
    const ra = add(r.p, rot([Math.min(r.L, 110) * 0.5, 0], r.a)), len = R2(f, 120, 360);
    V.rope(f, [ra, add(ra, [R2(f, -4, 4), len * 0.35]), add(ra, [R2(f, -8, 8), len * 0.7]), add(ra, [R2(f, -6, 6), len])], 5.4, { col: '#8a7e62', fray: true });
    if (i % 4 === 2) V.kelpHang(f, add(ra, [0, len * 0.5]), 70, 8, 4);
  });
  for (const [i, j] of [[2, 3], [5, 7]]) { const a2 = add(rods[i].p, rot([80, 0], rods[i].a)), b2 = add(rods[j].p, rot([80, 0], rods[j].a)); V.sagRope(f, a2, b2, 130, 5, { col: '#7a6e54' }); }
  const cf = add(rods[3].p, [14, 240]); f.part(ell(cf, 22, 28, 0, 12), V.WD(f, { fill: '#7a5e3e', inkW: 1.4 })); f.line([add(cf, [-16, -6]), add(cf, [16, -6])], 2.4, '#3a2a1a');
  const oar = [add(rods[6].p, [-60, 110]), add(rods[6].p, [150, 300])]; f.part(limb(oar[0], oar[1], 14, 14, { steps: 6 }), V.WD(f, { inkW: 1.4 })); f.part([oar[1], add(oar[1], [44, 30]), add(oar[1], [70, 100]), add(oar[1], [14, 90])], V.WD(f, { inkW: 1.4 })); f.part([add(oar[0], [-6, 0]), add(oar[0], [-16, -30], 1), add(oar[0], [8, -12])], V.WD(f, { fill: P.woodL, inkW: 1.2, cast: false }));
  const nq = add(rods[0].p, [10, 50]); for (let i = 0; i <= 6; i++) { f.line([add(nq, [-70 + i * 22, 0]), add(nq, [-58 + i * 20, 150])], 1.8, '#8a7e62', { op: 0.85 }); f.line([add(nq, [-70, i * 24]), add(nq, [62, i * 24 + 4])], 1.8, '#8a7e62', { op: 0.85 }); }
  // ---- the song: arcs leap across the hide from rod to rod (a top rod to a flank rod, flank to flank: never along the
  // outline), from the forehead rods out at the front rank, and up from the Tooth into the storm
  f.bone('arcs');
  // consistency pass 2026-11-25: all harpoon arcs are an FX layer (out/worlds/world_VI_thunder_whale_fx.*, anchor bone
  // 'arcs'); the sparks at the harpoon tips and the Tooth stay on the figure as embers, the burns stay scarred into the hide
  fxCapture(f, () => {
    for (const [i, j] of [[3, 19], [7, 18], [13, 14], [0, 13], [2, 16]]) V.bolt(f, tips[i], tips[j], { w: 2.6, forks: 2, jit: 0.4 }); // each pair joins a rod on the back to one low on the flank (or two flank rods), so the arc cuts across the hide
    V.bolt(f, tt, [tt[0] - 60, -60], { w: 3.6, forks: 4, jit: 0.25 }); V.bolt(f, tips[9], tt, { w: 2.2, forks: 1, jit: 0.45 });
    V.bolt(f, tips[18], [W + 30, 1250], { w: 3, forks: 3, jit: 0.3 }); V.bolt(f, tips[20], [W + 30, 1010], { w: 2.8, forks: 2, jit: 0.3 }); // the song strikes out at the front rank
  });
  V.sparks(f, tt, 10, 46); for (const k of [2, 14, 19]) V.sparks(f, tips[k], 5, 26);
  // ---- the sea in front: the surf the breach throws up, foam lace where the hide leaves the water, spray, sheeting water
  f.bone('water');
  const span = x => (x > 0 && x < 760 ? Math.sin(x / 760 * Math.PI) : 0);
  const crest = []; for (let x = 0; x <= W; x += 40) crest.push([x, wl + Math.sin(x * 0.02) * 10 + (f.r() - 0.5) * 10 - 34 * span(x)]);
  f.part([...crest, [W, Hh], [0, Hh]], { fill: P.sea, shadow: P.seaD, light: P.seaL, shade: 0.3, inkW: 2, cast: false, tex: 'mottle' + s, texOp: 0.6 });
  for (let i = 0; i < 7; i++) { const y = wl + 30 + i * 34; for (let x = 20 + i * 30; x < W - 40; x += 140) f.line([[x, y], [x + 40, y - 5], [x + 80, y + 2]], 2, P.seaL, { op: 0.5 - i * 0.05 }); }
  const streak = (c, len, w, op) => { const pts = [add(c, [-len / 2, 0]), add(c, [-len / 6, -w * 0.4]), add(c, [len / 6, w * 0.3]), add(c, [len / 2, 0])]; f.stroke(pts, w, P.foam, { op }); };
  for (let i = 0; i < 80; i++) { const x = R2(f, 0, 960), y = wl - 26 + R2(f, -40, 30) - 30 * span(x); streak([x, y], R2(f, 30, 90), R2(f, 4, 11), R2(f, 0.5, 0.9)); }
  for (let i = 0; i < 26; i++) { const x = R2(f, 900, 1580); streak([x, wl + R2(f, -8, 12)], R2(f, 30, 80), R2(f, 3, 7), R2(f, 0.4, 0.75)); }
  for (let i = 0; i < 60; i++) { const q = [R2(f, 60, 960), R2(f, wl - 220, wl - 40)], r = R2(f, 1.6, 4.5); f.flat(ell(q, r, r * 1.3, 0, 8), P.foam, { op: R2(f, 0.5, 0.85) }); }
  f.raw(`<ellipse cx="460" cy="${wl - 60}" rx="480" ry="80" fill="${P.surf}" opacity="0.26" filter="url(#glowL${f.o.seed})"/>`);
  for (let i = 0; i < 18; i++) { const u = R2(f, 120, 860), p0 = i % 2 ? L(...jw(u, 320 - u * 0.08)) : L(u, tab(lip, u) + 4); const l = R2(f, 60, 220); if (p0[1] + l > wl - 20) continue; f.stroke([p0, add(p0, [R2(f, -3, 3), l * 0.5]), add(p0, [R2(f, -4, 4), l])], R2(f, 3, 7), P.surfD, { op: 0.5 }); V.drip(f, add(p0, [0, l + 8]), 1.6, P.surf); }
  return f;
}

module.exports = {
  heroes: [
    { key: 'thunder_whale', name: 'The Thunder Whale', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: thunderWhale },
    { key: 'lighthouse_keeper', name: 'The Lighthouse Keeper', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: lighthouseKeeper },
    { key: 'wrecker', name: 'Wrecker', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: wrecker },
    { key: 'harpy_matron', name: 'Harpy Matron', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: harpyMatron },
    { key: 'shock_eel', name: 'Shock Eel', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: shockEel },
    { key: 'storm_harpy', name: 'Storm Harpy', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: stormHarpy },
    { key: 'tide_crab', name: 'Tide Crab', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: tideCrab },
    { key: 'drowned_bosun', name: 'Drowned Bosun', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: drownedBosun },
  ],
};
