// World VII, The Icebound Fleet (Frost + Water). A war fleet sailed north to kill a leviathan; the sea froze mid-battle
// and the crews are still at their posts. Frost (dominant): rime crust on the windward side, icicles hanging plumb,
// faceted ice, bodies and cloth stopped mid-gesture, cracked frost-bitten skin, breath frozen as it left the mouth.
// Water underneath: drowned, pale and swollen inside the ice. Palette: white sea, black hulls, frozen rigging grey-blue,
// no warm colour; plus ink black, bone and grey.
// Every creature is a foe: drawn facing right with kit.foeBase (key light upper right in drawing space) and flipped on
// render, so in the game it faces left with the light at the upper left. Windward = the heroes' side = drawing +x.
// Rigged from the start: joints first, f.bone() before each part, parts drawn whole, overlap at the joints.
'use strict';
const K = require('../kit');
const X7 = require('./kit_VII');
const { E, B, G, INK, foeBase, TIERS, chain, ragLimb, bareLeg } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { PAL, space, fx, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, openHand, mlimb, humanJoints, rope, split, side, muscleBody } = X7;
const deg = d => d * Math.PI / 180;
const WORLD = { shadowTint: '#262a3a', mud: '#3a4652', keyTint: '#f4f8ff' }; // cold shadow, and the grime that rises up the legs is grey slush

// ------------------------------------------------------------------ DROWNED DECKHAND (Human 1.0)
// A boarding-crew sailor frozen mid-shanty: chin up, mouth wide on a note, the breath of it frozen in a plume; swaying,
// weight on the back leg; cutlass cocked back over the shoulder in a hammer grip, the far hand flung out to board.
// Knitted cap, short reefer jacket stiff with ice, striped slops to mid-shin, bare frost-blackened feet frozen to the deck.
function drownedDeckhand() {
  const GY = TIERS.human[1] - 30;
  const f = new Fig(foeBase(706, Object.assign({}, WORLD, { groundY: GY, grimeY: 640 })));
  const X = fx(f);
  const H = 100;
  const jk = PAL.navy, jkD = PAL.navyD, jkL = PAL.navyL, sl = '#a3aaae', slS = '#4e5868', stripe = PAL.rigD, skin = PAL.skin, skinS = PAL.skinS;
  const JK = (o = {}) => Object.assign({ fill: jk, shadow: '#161a24', tex: 'mottle706', texOp: 0.5, light: jkL }, o);
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle706', texOp: 0.5 }, o);
  const N = [302, 262], C = [312, 356], P = [286, 466];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = -0.24, HC = add(N, add(mul(up, 62), [8, 0])), hF = frame(HC, hA, H); // chin up on the note
  const SN = S.at(-0.36, 0.14), EN = [178, 238], WN = [226, 150];
  const SF = S.at(0.45, 0.1), EF = [394, 352], WF = [446, 330];
  const HN = S.at(-0.32, 1.0), KN = [236, 614], AN = [206, 750];
  const HF = S.at(0.36, 1.0), KF = [358, 604], AF = [388, 750];
  const MN = lerp(KN, AN, 0.5), MF = lerp(KF, AF, 0.48); // where the slops end, mid-shin
  const bA = deg(-140), tipC = add(WN, rot([212, 0], bA)); // cutlass blade from the thumb side, cocked back over the shoulder
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('cutlass', WN, 'hand_n').joint('pistol', S.at(0.3, 0.92), 'pelvis');

  // ---- far arm, flung forward to board (behind the torso)
  const [cUF, cFF] = jcut(SF, EF, WF, 20);
  split(f, () => {
    f.part(jointLimb(SF, EF, lerp(EF, WF, 0.86), [44, 36, 34], { point: 0.3, mus0: 0.12, mus1: 0.12 }), JK({ fill: jkD }));
    creases(f, EF, Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) + 1.4, 22, 3, '#0e1018', 0.7);
    X.rime([lp(EF, WF, 0.15, -16), lp(EF, WF, 0.75, -15)], 7, -1);
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('forearm_f');
  f.part(ragLimb(f, lerp(EF, WF, 0.55), lerp(EF, WF, 0.9), 40, 42, { depth: 5 }), JK({ fill: mix(jkD, '#000', 0.1) })); // cuff
  X.icicles([lp(EF, WF, 0.6, 20), lp(EF, WF, 0.85, 21)], 3, 16, 5);
  f.bone('hand_f');
  const hf = openHand(f, WF, deg(-14), 86, SK({ fill: mix(skin, PAL.bite, 0.15) }), { back: true, flip: true, spread: 0.13, curl: 0.3, swell: 0.4 });
  hf.fing.forEach(g => f.flat(ell(g.k3, 5, 4, 0, 8), PAL.biteD, { op: 0.75 })); // frost-blackened fingertips
  X.cracks(lerp(WF, hf.fing[1].k0, 0.5), 18, 3, 0.2);

  // ---- far leg (forward, relaxed): bare shin and foot, then the striped slop over it
  f.bone('shin_f');
  const legLook = SK({ fill: mix(skin, '#9aa0b0', 0.1) });
  split(f, () => bareLeg(f, MF, AF, 1, 50, 42, legLook), [['shin_f', side(AF, [0, -1], 16)], ['foot_f', side(AF, [0, 1], 16)]]);
  f.bone('foot_f');
  X.bite([AF[0] + 50, GY - 12], 16, 6, 6, 0.7); X.cracks([AF[0] + 10, AF[1] + 14], 14, 2, 0.4);
  const slop = (A, J, M, b1, b2, w0) => {
    const [c1, c2] = jcut(A, J, M, 26);
    const out = jointLimb(A, J, M, [w0, 54, 64], { point: 0.22, mus0: 0.1, mus1: 0.08 });
    split(f, () => {
      f.part(out, { fill: sl, shadow: slS, tex: X.hoar, texOp: 0.35, light: '#d4dade' });
      clipDraw(f, out, () => {
        for (let k = -4; k <= 4; k++) { const o2 = k * 9.5; f.stroke([lp(A, J, -0.1, o2 * 1.15), lp(A, J, 0.5, o2 * 1.08 + (k % 2) * 2), lp(A, J, 1.0, o2 * 0.95), lp(J, M, 0.5, o2 * 1.05), lp(J, M, 1.1, o2 * 1.2)], 3.4, stripe, { op: 0.75 }); }
        for (const [t, dep] of [[0.35, 1], [0.7, 0.8]]) f.stroke([lp(A, J, t, -36), lp(A, J, t + 0.06, -10), lp(A, J, t + 0.02, 12)], 3, '#1a1e28', { op: 0.55 * dep }); // folds pulling across the thigh
        f.stroke([lp(J, M, 0.25, 30), lp(J, M, 0.4, 6), lp(J, M, 0.62, -10)], 2.6, '#1a1e28', { op: 0.5 });
        f.flat([lp(J, M, 0.4, -40), lp(J, M, 0.4, 40), lp(J, M, 1.2, 40), lp(J, M, 1.2, -40)], '#3a4652', { op: 0.25 }); // grey slush soaked up the hem
      });
      creases(f, J, Math.atan2(M[1] - A[1], M[0] - A[0]) + 1.57, 26, 3, '#1a1e28', 0.6);
      // ragged frozen hem, stiff, flared, icicles hanging plumb from it
      const hemA = lp(J, M, 0.98, -33), hemB = lp(J, M, 0.98, 33);
      f.line([hemA, lp(J, M, 1.02, -12), lp(J, M, 0.97, 8), hemB], 2.2, INK, { op: 0.8 });
      X.icicles([hemA, lp(J, M, 1.0, 0), hemB], 4, 22, 6);
      X.frost(lp(A, J, 0.6, 18), 12, 30, 6);
    }, [[b1, c1], [b2, c2]]);
  };
  slop(HF, KF, MF, 'thigh_f', 'shin_f', 66);

  // ---- near leg (back, straight, carrying the weight)
  f.bone('shin_n');
  split(f, () => bareLeg(f, MN, AN, 1, 52, 44, legLook, { swell: 0.3 }), [['shin_n', side(AN, [0, -1], 16)], ['foot_n', side(AN, [0, 1], 16)]]);
  f.bone('foot_n');
  X.bite([AN[0] + 52, GY - 12], 16, 6, 7, 0.8);
  slop(HN, KN, MN, 'thigh_n', 'shin_n', 70);
  f.bone('thigh_n');
  // tarred canvas patch on the near thigh, stitched
  const pt = [lp(HN, KN, 0.42, -16), lp(HN, KN, 0.4, 14), lp(HN, KN, 0.66, 16), lp(HN, KN, 0.68, -14)];
  f.part(pt, { fill: '#6a7074', shade: 0.35, sharp: true, inkW: 1.1, cast: false, tex: 'weave706', texOp: 0.6 });
  f.stitches([...pt, pt[0]], '#9aa4aa', 0.8);

  // ---- torso: reefer jacket over a linen shirt, neckerchief, belt, boarding pistol
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.4, 0.42], [0.06, 0.86, 0.7], [0.3, 0.84, 0.84], [0.55, 0.74, 0.76], [0.8, 0.72, 0.72], [1.02, 0.74, 0.7]]);
  f.part(torso, { fill: '#c4c8c6', shadow: '#5a6070', tex: 'weave706', texOp: 0.4 }); // shirt under it all
  // jacket: open over the chest, short, cut square at the hip, frozen with its front flap blown back
  const jacket = [S.at(-0.5, -0.06), S.at(-0.2, -0.12), S.at(0.25, -0.06), S.at(0.5, 0.06), S.at(0.7, 0.18), S.at(0.6, 0.3), S.at(0.58, 0.56), S.at(0.7, 0.78), S.at(0.76, 0.98, 1), S.at(0.2, 0.94), S.at(-0.3, 0.96), S.at(-0.86, 0.98, 1), S.at(-0.88, 0.6), S.at(-0.84, 0.2)];
  f.part(jacket, JK());
  f.stroke([S.at(0.6, 0.32), S.at(0.57, 0.58), S.at(0.7, 0.8)], 2.4, '#0e1018'); // lapel edge shadow
  f.part([S.at(0.5, 0.06), S.at(0.7, 0.18), S.at(0.62, 0.34), S.at(0.42, 0.3)], JK({ fill: jkL, inkW: 1.2 })); // turned-back lapel
  for (let i = 0; i < 4; i++) { const q = S.at(0.46, 0.38 + i * 0.12); f.rivet(q, 3.2, PAL.pewter); if (i < 3) f.rivet(S.at(0.18, 0.4 + i * 0.12), 2.8, PAL.pewter); } // two rows of pewter buttons, one missing below
  f.line([S.at(0.18, 0.76), S.at(0.2, 0.8), S.at(0.17, 0.83)], 1.2, '#9aa0a4', { op: 0.7 }); // the missing button's thread
  f.stroke([S.at(-0.6, 0.3), S.at(-0.5, 0.6), S.at(-0.6, 0.9)], 2.2, '#0e1018', { op: 0.8 }); // back seam fold
  f.stroke([S.at(-0.2, 0.62), S.at(0.0, 0.7), S.at(0.2, 0.68)], 2, '#0e1018', { op: 0.7 });
  f.part([S.at(-0.66, 0.62), S.at(-0.36, 0.6), S.at(-0.34, 0.8), S.at(-0.64, 0.82)], JK({ fill: jkD, sharp: true, inkW: 1.1 })); // pocket flap
  X.frost(S.at(-0.2, 0.4), 30, 40, 8);
  // breakup on the reefer: side seam, a stiff fold frozen across the belly, salt tide-lines, a torn and darned rent
  f.stroke([S.at(-0.3, 0.2), S.at(-0.36, 0.5), S.at(-0.3, 0.92)], 1.8, '#0e1018', { op: 0.7 });
  f.stitches([S.at(-0.26, 0.22), S.at(-0.32, 0.5), S.at(-0.26, 0.9)], '#6a7484', 0.8);
  for (let i = 0; i < 3; i++) f.line([S.at(-0.8, 0.5 + i * 0.12), S.at(-0.5, 0.47 + i * 0.12), S.at(-0.2, 0.52 + i * 0.12), S.at(0.1, 0.5 + i * 0.12)], 1.2, '#aab6c0', { op: 0.35 - i * 0.07 }); // salt tide-lines
  f.line([S.at(-0.02, 0.2), S.at(0.06, 0.28), S.at(0.04, 0.38)], 1.6, INK, { op: 0.8 }); f.stitches([S.at(-0.04, 0.2), S.at(0.04, 0.29), S.at(0.02, 0.39)], '#8a94a0', 0.8); // darned rent
  f.line([S.at(-0.84, 0.3), S.at(-0.6, 0.2), S.at(-0.3, 0.12)], 1.6, mix(jkL, '#fff', 0.2), { op: 0.35 }); // worn-bright shoulder
  X.rime([S.at(-0.5, -0.07), S.at(-0.1, -0.13), S.at(0.3, -0.06), S.at(0.58, 0.1)], 11, -1);
  X.icicles([S.at(-0.8, 0.96), S.at(-0.3, 0.95), S.at(0.2, 0.93), S.at(0.62, 0.96)], 7, 26, 6);
  // shirt front: linen, gaping, frost in the folds, drowned skin under the collar
  f.part([S.at(0.5, 0.0), S.at(0.74, 0.1), S.at(0.7, 0.2), S.at(0.56, 0.16)], SK({ inkW: 1 }));
  f.line([S.at(0.72, 0.3), S.at(0.7, 0.5), S.at(0.74, 0.7)], 1.1, '#5a6070', { op: 0.6 });
  // neckerchief knotted at the throat, tails frozen flying back
  f.part([S.at(-0.3, -0.12), S.at(0.3, -0.1), S.at(0.6, 0.04), S.at(0.5, 0.12), S.at(0.1, 0.06), S.at(-0.3, 0.04)], { fill: '#1e2026', shade: 0.4, tex: 'weave706', texOp: 0.4, inkW: 1.2 });
  f.part([S.at(0.52, 0.06), S.at(0.62, 0.1), S.at(0.58, 0.2), S.at(0.48, 0.16)], { fill: '#26282e', shade: 0.4, inkW: 1.1, cast: false });
  f.part([S.at(0.5, 0.14), S.at(0.6, 0.18), S.at(0.7, 0.42), S.at(0.62, 0.44), S.at(0.54, 0.3)], { fill: '#1e2026', shade: 0.4, inkW: 1.1, cast: false });
  X.icicle(S.at(0.66, 0.44), 14, 4);
  // belt: tarred leather, iron frame buckle
  f.bone('pelvis');
  f.part([S.at(-0.84, 0.84), S.at(0.6, 0.8), S.at(0.62, 0.9), S.at(-0.86, 0.94)], { fill: '#202226', shade: 0.4, tex: 'mottle706', sharp: true });
  f.part([S.at(0.12, 0.79), S.at(0.3, 0.79), S.at(0.3, 0.92), S.at(0.12, 0.92)], { fill: PAL.iron, shade: 0.4, inkW: 1.2, sharp: true });
  f.flat([S.at(0.16, 0.82), S.at(0.26, 0.82), S.at(0.26, 0.89), S.at(0.16, 0.89)], '#202226');
  f.bone('pistol');
  // boarding pistol thrust through the belt: dark stock, iron lock and barrel, a lanyard ring
  const pg = S.at(0.42, 0.86), pF = frame(pg, deg(110), 1); // local +x runs down the barrel, -x up to the butt
  f.part(pF([[-6, -6], [70, -5], [70, 5], [-6, 6]]), { fill: PAL.iron, shade: 0.4, inkW: 1.2, tex: 'mottle706' }); // barrel inside the belt
  f.flat(ell(pF([[70, 0]])[0], 4, 4, 0, 8), '#0c0e12'); // muzzle
  f.part(pF([[-4, -9], [-30, -11], [-52, -20], [-74, -26], [-82, -14], [-70, 4], [-40, 10], [-4, 9]]), { fill: PAL.wood, shade: 0.4, tex: 'wood706', inkW: 1.4 }); // the stock swelling into the butt
  f.part(pF([[-74, -27], [-86, -24], [-88, -10], [-81, -13]]), { fill: PAL.pewter, shade: 0.4, inkW: 1.1, cast: false }); // butt cap
  f.part(pF([[-30, -14], [-8, -14], [-8, -4], [-30, -4]]), { fill: PAL.ironD, shade: 0.3, inkW: 1, cast: false, sharp: true }); // lock plate
  f.line(pF([[-26, -14], [-34, -24], [-28, -27]]), 2.4, PAL.ironD); // the cock, down
  const tg = pF([[-20, 9]])[0]; f.line(ell(tg, 5, 4, 0, 8).slice(0, 6), 1.6, PAL.iron); // trigger guard
  X.frost(pF([[-50, -10]])[0], 12, 8, 4, 1.2);

  // ---- head: knitted cap, chin up, mouth wide on a note, breath frozen, icicles at the chin
  f.bone('head');
  f.part(limb(S.at(0.05, -0.02), hF([[-0.08, 0.3]])[0], 46, 40), SK()); // neck
  f.line([S.at(0.2, -0.05), hF([[0.12, 0.46]])[0]], 1.4, '#3a3e50', { op: 0.6 }); // throat cord
  // wet hair frozen in stiff hanks under the cap at the back (hung plumb in screen space)
  for (const [u, v, l] of [[-0.42, -0.1, 34], [-0.36, 0.0, 44], [-0.28, 0.08, 30]]) { const q = hF([[u, v]])[0]; f.stroke([q, add(q, [-4, l * 0.5]), add(q, [-2, l])], 9, '#1a1c20'); X.icicle(add(q, [-2, l - 2]), 10, 4); }
  B.head(f, HC, H, hA, { skin: '#c3cbcf', jaw: 1.15, chin: 0.02, nose: 1.05, hook: 0.2, mouth: 'set', squint: 0.25, age: true, faceShade: 0.6, jawShade: 0.4, iris: '#b8c2c8', eyeWhite: '#d8dee0', hairCol: '#1a1c20', browCol: '#2a2c32', browDown: -0.02 });
  // the jaw dropped on the note: lower jaw and chin pulled down, the mouth a dark hole with the upper teeth showing
  f.part(hF([[-0.06, 0.4], [0.1, 0.5], [0.3, 0.44], [0.33, 0.56], [0.2, 0.66], [0.04, 0.64], [-0.1, 0.5]]), SK({ inkW: 1.3 }));
    f.flat(hF([[0.16, 0.25], [0.25, 0.235], [0.33, 0.25], [0.32, 0.42], [0.24, 0.5], [0.17, 0.44]]), PAL.lips);
  f.flat(hF([[0.18, 0.27], [0.25, 0.26], [0.31, 0.27], [0.3, 0.4], [0.24, 0.46], [0.19, 0.41]]), '#0c0e14');
  f.flat(hF([[0.19, 0.27], [0.3, 0.27], [0.29, 0.31], [0.2, 0.31]]), '#c8c8bc'); // upper teeth
  f.flat(hF([[0.2, 0.4], [0.26, 0.38], [0.29, 0.42], [0.24, 0.45]]), '#4a4a5c', { op: 0.8 }); // tongue
  X.bite(hF([[0.36, 0.08]])[0], 6, 6, 4, 0.6); // frost-bitten nose tip
  X.bite(hF([[0.2, 0.1]])[0], 8, 6, 3, 0.1);
  X.cracks(hF([[0.1, 0.16]])[0], 12, 2, 0.8);
  X.livid(hF([[0.02, 0.3]])[0], 10, 8, 3);
  // knitted watch cap: rolled brim, ribbing, rime crust on its windward crown
  const cap = hF([[-0.44, -0.04], [-0.42, -0.36], [-0.24, -0.56], [0.06, -0.62], [0.3, -0.5], [0.4, -0.3], [0.38, -0.18], [0.0, -0.22], [-0.3, -0.1]]);
  f.part(cap, { fill: PAL.wool, shadow: '#2a2e36', tex: X.hoar, texOp: 0.4, light: PAL.woolL });
  clipDraw(f, cap, () => { for (let i = 0; i < 9; i++) f.line(hF([[-0.4 + i * 0.09, -0.6], [-0.36 + i * 0.09, -0.1]]), 1.1, '#2a2e36', { op: 0.55 }); });
  f.part(hF([[-0.46, -0.02], [-0.4, -0.18], [0.0, -0.3], [0.4, -0.3], [0.42, -0.17], [0.0, -0.16], [-0.38, 0.0]]), { fill: PAL.woolD, shadow: '#20242a', tex: 'weave706', texOp: 0.5, inkW: 1.3 }); // rolled brim
  f.line(hF([[-0.4, -0.08], [0.0, -0.22], [0.38, -0.23]]), 1, '#1a1c20', { op: 0.6 });
  f.line(ell(hF([[-0.2, 0.04]])[0], 3.5, 4.5, 0, 8).concat([ell(hF([[-0.2, 0.04]])[0], 3.5, 4.5, 0, 8)[0]]), 1.4, PAL.pewter); // pewter earring under the brim
  X.rime([hF([[0.0, -0.6]])[0], hF([[0.24, -0.54]])[0], hF([[0.4, -0.34]])[0]], 6, -1);
  // icicles hang plumb from the chin and the dropped jaw; the breath of the note frozen in a plume, curling up
  for (const [u, v, l] of [[0.06, 0.64, 22], [0.18, 0.66, 30], [0.28, 0.6, 16]]) X.icicle(hF([[u, v]])[0], l, 5);
  X.breath(hF([[0.36, 0.36]])[0], rot([1, 0], hA - 0.2), 110, 76);

  // ---- near arm raised, cutlass cocked back over the shoulder
  const [cUN, cFN] = jcut(SN, EN, WN, 20);
  split(f, () => {
    f.part(jointLimb(SN, EN, lerp(EN, WN, 0.88), [50, 40, 36], { point: 0.35, mus0: 0.14, mus1: 0.14 }), JK());
    creases(f, EN, Math.atan2(WN[1] - SN[1], WN[0] - SN[0]), 22, 3, '#0e1018', 0.7);
    f.stroke([lp(SN, EN, 0.2, 14), lp(SN, EN, 0.7, 16)], 2.2, '#0e1018', { op: 0.7 });
    X.rime([lp(SN, EN, 0.5, 22), lp(SN, EN, 0.95, 22)], 8, 1);
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('forearm_n');
  f.part(ragLimb(f, lerp(EN, WN, 0.6), lerp(EN, WN, 0.92), 42, 44, { depth: 5 }), JK({ fill: jkD }));
  X.icicles([lp(SN, EN, 0.8, 22), lp(EN, WN, 0.05, 24), lp(EN, WN, 0.3, 20)], 4, 30, 6); // hanging plumb from the raised elbow
  f.bone('cutlass');
  // cutlass: broad, slightly curved, clipped point, frost along the back, a nick; iron D-guard
  const cF = frame(WN, bA, 1);
  const blade = cF([[16, -9], [80, -12], [140, -10], [172, -4], [190, 6, 1], [176, 20], [130, 22], [70, 17], [16, 10]]);
  f.part(blade, { fill: '#a4acb4', shadow: '#4a525c', shade: 0.3, inkW: 1.4, light: '#d8e0e6', hatch: false });
  f.line(cF([[22, -4], [90, -6], [150, -3], [180, 5]]), 1.1, '#e8eef2', { op: 0.7 }); // fuller line
  f.flat(cF([[110, 22], [118, 15], [124, 21]]), '#2a2e36'); // nick in the edge
  X.frost(cF([[110, 4]])[0], 50, 8, 8, 1.2);
  f.part(cF([[-22, -9], [-14, -12], [16, -12], [18, 12], [-14, 12], [-22, 9]]), { fill: '#202226', shade: 0.4, inkW: 1.1, cast: false }); // grip under the fist
  f.part(cF([[-30, -8], [-20, -11], [-18, 11], [-30, 8]]), { fill: PAL.iron, shade: 0.4, inkW: 1.1, cast: false }); // pommel
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, bA, 30, mix(skin, PAL.bite, 0.12), { tex: 'mottle706', texOp: 0.5, shadow: skinS, name: 'deckhand cutlass' });
  fistDetail(f, gN, 30, skin, {});
  f.bone('cutlass');
  // D-guard knuckle bow sweeping over the fingers from the quillon to the pommel
  const kd = rot([1, 0], gN.ang), kbow = [add(cF([[14, 0]])[0], mul(kd, 10)), add(cF([[-4, 0]])[0], mul(kd, 25)), add(cF([[-22, 0]])[0], mul(kd, 23)), add(cF([[-30, 0]])[0], mul(kd, 8))];
  f.line(kbow, 6.5, INK); f.line(kbow, 4, PAL.iron); f.line(kbow.slice(1, 3), 1.2, PAL.steelL, { op: 0.6 }); // D-guard over the fingers
  f.part(cF([[10, -16], [18, -16], [18, 18], [10, 18]]), { fill: PAL.iron, shade: 0.4, inkW: 1.1, cast: false, sharp: true });
  X.icicle(cF([[14, 18]])[0], 14, 4);
  rope(f, [cF([[-30, 0]])[0], add(cF([[-30, 0]])[0], [-6, 14]), add(cF([[-30, 0]])[0], [-2, 26])], 2.4, PAL.rope); // wrist lanyard, hanging plumb

  // ---- the deck: cracked sea-ice, his bare feet frozen into it
  f.bone('root');
  X.floe([296, GY + 2], 210, 14);
  for (const A of [AF, AN]) { f.part([[A[0] - 26, GY + 2], [A[0] - 20, GY - 8], [A[0] + 4, GY - 12], [A[0] + 26, GY - 6], [A[0] + 32, GY + 3]], X.IC({ fill: '#d2dce2', texOp: 0.6 })); f.line([[A[0] - 16, GY - 7], [A[0] + 20, GY - 7]], 1, '#f4f8fa', { op: 0.6 }); for (let i = 0; i < 4; i++) f.flat(ell([A[0] + 46 + i * 5, GY - 5 + i * 0.5], 4.5, 4, 0, 8), PAL.biteD, { op: 0.85 }); } // frozen in at the heel; the toes blackened
  return f;
}

// ------------------------------------------------------------------ FROZEN WHALER (Human 1.05)
// A fleet harpooner in the throw's last instant: weight driving off the straight back leg onto the bent front one, the
// torso cocked back, harpoon held overhead along the line of the throw, the far hand out at the mark to aim. The
// throwing arm is cased in ice from shoulder to fist and will never come down. Thick wool coat to the knee flaring
// back stiff, fur hat with ear flaps, beard hung with icicles, the line frozen in a stiff loop down to a coil at his hip.
function frozenWhaler() {
  const GY = TIERS.human[1] - 30;
  const f = new Fig(foeBase(703, Object.assign({}, WORLD, { groundY: GY, grimeY: 650 })));
  const X = fx(f);
  const H = 104;
  const wo = PAL.wool, woD = PAL.woolD, woL = PAL.woolL, skin = PAL.skin, skinS = PAL.skinS, fur = '#5e6264', furD = '#36393c', boot = '#1c1e22', trou = '#34383e';
  const WO = (o = {}) => Object.assign({ fill: wo, shadow: '#262a30', tex: 'weave703', texOp: 0.45, light: woL }, o);
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle703', texOp: 0.5 }, o);
  const N = [296, 254], C = [288, 352], P = [300, 462];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = 0.06, HC = add(N, add(mul(up, 64), [12, 0])), hF = frame(HC, hA, H);
  // harpoon along the line of the throw, point a little up
  const R0 = [34, 122], R1 = [452, 84], TIP = [586, 70], hd = E.norm(sub(R1, R0)), hAng = Math.atan2(hd[1], hd[0]);
  const at = x => [x, R0[1] + (x - R0[0]) * hd[1] / hd[0]];
  const WN = at(238), SN = S.at(-0.42, 0.15), EN = [204, 190];
  const SF = S.at(0.45, 0.1), EF = [398, 330], WF = [454, 314];
  const HN = S.at(-0.3, 1.0), KN = [228, 620], AN = [160, 752];
  const HF = S.at(0.36, 1.0), KF = [384, 604], AF = [420, 752];
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('harpoon', WN, 'hand_n').joint('line', R1, 'harpoon').joint('coat_skirt', S.at(0, 0.86), 'pelvis').joint('coil', S.at(0.5, 0.92), 'pelvis').joint('hat_flap', hF([[-0.2, 0.0]])[0], 'head');

  // ---- far arm out at the mark (behind the torso), fingerless mitt
  const [cUF, cFF] = jcut(SF, EF, WF, 20);
  split(f, () => {
    f.part(jointLimb(SF, EF, lerp(EF, WF, 0.84), [52, 44, 40], { point: 0.3, mus0: 0.12, mus1: 0.12 }), WO({ fill: woD }));
    creases(f, EF, Math.atan2(WF[1] - SF[1], WF[0] - SF[0]) + 1.5, 24, 3, '#16181c', 0.7);
    X.rime([lp(EF, WF, 0.1, -20), lp(EF, WF, 0.72, -19)], 8, -1);
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('forearm_f');
  f.part(ragLimb(f, lerp(EF, WF, 0.5), lerp(EF, WF, 0.88), 48, 50, { depth: 6 }), WO({ fill: mix(woD, '#000', 0.1) })); // turned-back cuff
  X.icicles([lp(EF, WF, 0.55, 23), lp(EF, WF, 0.85, 24)], 3, 18, 5);
  f.bone('hand_f');
  const hfa = openHand(f, WF, deg(-6), 90, SK({ fill: mix(skin, PAL.bite, 0.1) }), { back: true, flip: true, spread: 0.06, curl: 0.12, swell: 0.45 });
  const mit = [lp(WF, hfa.fing[1].k0, -0.25, 22), lp(WF, hfa.fing[1].k0, 0.86, 30), lp(WF, hfa.fing[1].k0, 0.92, 0), lp(WF, hfa.fing[1].k0, 0.86, -26), lp(WF, hfa.fing[1].k0, -0.25, -22)];
  f.part(mit, WO({ fill: '#5a5e62', inkW: 1.3 })); // fingerless mitt over the back of the hand
  for (let i = 0; i < 4; i++) f.line([lerp(mit[0], mit[1], 0.2 + i * 0.2), lerp(mit[4], mit[3], 0.2 + i * 0.2)], 0.9, '#2a2e34', { op: 0.6 });
  hfa.fing.forEach(g => f.flat(ell(g.k3, 4.5, 4, 0, 8), PAL.biteD, { op: 0.6 }));

  // ---- far leg forward: wool trousers into a knee-high tarred sea boot
  const [cTF, cSF] = jcut(HF, KF, AF, 26);
  split(f, () => {
    f.part(jointLimb(HF, KF, AF, [70, 54, 40], { point: 0.25, mus0: 0.12, mus1: 0.2 }), { fill: trou, shadow: '#14161a', tex: 'weave703', texOp: 0.4 });
    creases(f, KF, Math.atan2(AF[1] - HF[1], AF[0] - HF[0]) + 1.57, 26, 3, '#0c0e10', 0.7);
  }, [['thigh_f', cTF], ['shin_f', cSF]]);
  split(f, () => B.boot(f, AF, 1, 58, boot, { tex: 'mottle703', knee: add(KF, [4, 22]), kneeW: 50, strap: true }), [['shin_f', side(AF, [0.2, -1], 18)], ['foot_f', side(AF, [-0.2, 1], 18)]]);
  f.bone('shin_f');
  X.rime([lp(KF, AF, 0.15, 26), lp(KF, AF, 0.55, 25), lp(KF, AF, 0.85, 28)], 7, 1);
  f.line([lp(KF, AF, 0.2, -10), lp(KF, AF, 0.7, -6)], 1.6, '#4a4e56', { op: 0.6 }); // tar shine
  // ---- near leg back, straight, driving
  const [cTN, cSN] = jcut(HN, KN, AN, 26);
  split(f, () => {
    f.part(jointLimb(HN, KN, AN, [74, 56, 42], { point: 0.2, mus0: 0.12, mus1: 0.22 }), { fill: trou, shadow: '#14161a', tex: 'weave703', texOp: 0.4 });
    f.part([lp(HN, KN, 0.3, -14), lp(HN, KN, 0.3, 16), lp(HN, KN, 0.56, 18), lp(HN, KN, 0.6, -12)], { fill: '#4a4e54', shade: 0.35, inkW: 1.1, cast: false, tex: 'weave703', sharp: true }); // knee patch
    f.stitches([lp(HN, KN, 0.3, -14), lp(HN, KN, 0.3, 16), lp(HN, KN, 0.56, 18), lp(HN, KN, 0.6, -12), lp(HN, KN, 0.3, -14)], '#8a9096', 0.8);
  }, [['thigh_n', cTN], ['shin_n', cSN]]);
  split(f, () => B.boot(f, AN, 1, 60, boot, { tex: 'mottle703', knee: add(KN, [-2, 22]), kneeW: 52 }), [['shin_n', side(AN, [0.4, -1], 18)], ['foot_n', side(AN, [-0.4, 1], 18)]]);
  f.bone('shin_n');
  X.frost(lp(KN, AN, 0.5, 6), 10, 30, 5);

  // ---- coat skirt: heavy wool to the knee, split over the stride, frozen flaring back as he threw
  f.bone('coat_skirt');
  const skirt = [S.at(-0.9, 0.74), S.at(0.9, 0.74), S.at(0.98, 0.92), [416, 594], [404, 642, 1], [370, 630], [340, 648, 1], [312, 630], [298, 580], [272, 622], [228, 640, 1], [190, 628], [150, 644, 1], [146, 608], [170, 556]];
  f.part(skirt, WO());
  clipDraw(f, skirt, () => {
    // breakup on the heavy wool: stiff folds hanging from the belt (shadowed trough, lit ridge), salt tide-lines, an old
    // tar stain, frost in the weave
    for (const [x0, x1, w] of [[196, 176, 9], [232, 222, 7], [266, 286, 8], [330, 340, 7], [366, 384, 9]]) { const q = [[x0, 500], [(x0 + x1) / 2 + 3, 560], [x1, 630]]; f.stroke(q, w, '#1a1e24', { op: 0.45 }); f.stroke(q.map(v => [v[0] + w * 0.8, v[1]]), w * 0.35, '#b0b4b8', { op: 0.4 }); }
    for (let i = 0; i < 3; i++) f.line([[140, 590 + i * 14], [240, 584 + i * 14], [330, 592 + i * 14], [420, 586 + i * 14]], 1.2, '#c8d2d8', { op: 0.4 - i * 0.08 });
    f.flat([[300, 520], [324, 512], [336, 534], [318, 548], [298, 540]], '#2a2c30', { op: 0.45 });
    X.frost([280, 530], 110, 26, 14, 1.3);
  });
  for (const q of [[[210, 560], [186, 620], [170, 640]], [[250, 560], [242, 612]], [[372, 560], [386, 620], [392, 636]], [[336, 566], [340, 628]]]) f.stroke(q, 2.6, '#1a1e24', { op: 0.75 }); // stiff folds
  f.stroke([[298, 560], [300, 600], [312, 630]], 4, '#101216', { op: 0.85 }); // the shadowed split
  X.icicles([[150, 642], [190, 628], [228, 640], [272, 622]], 6, 30, 7);
  X.icicles([[340, 646], [370, 630], [404, 640]], 4, 26, 7);
  f.part([[184, 590], [218, 586], [222, 614], [186, 618]], WO({ fill: '#585c60', sharp: true, inkW: 1.1 })); // patch
  f.stitches([[184, 590], [218, 586], [222, 614], [186, 618], [184, 590]], '#9aa0a6', 0.8);

  // ---- torso: coat buttoned to the throat, rope belt, flensing knife, the line coil on the hip
  f.bone('torso');
  const torso = S.shape([[-0.14, 0.42, 0.46], [0.06, 0.96, 0.76], [0.3, 0.98, 0.92], [0.55, 0.9, 0.9], [0.8, 0.92, 0.9], [1.0, 0.94, 0.9]]);
  f.part(torso, WO());
  f.stroke([S.at(0.62, 0.02), S.at(0.74, 0.4), S.at(0.7, 0.86)], 2.4, '#1a1e24'); // front opening, buttoned over
  for (let i = 0; i < 5; i++) { const q = S.at(0.6, 0.12 + i * 0.15); f.part(ell(q, 5.5, 5, 0, 10), { fill: PAL.bone, shade: 0.35, inkW: 1, inkHeavy: 1.3, cast: false }); f.flat(ell(q, 1.6, 1.6, 0, 6), '#3a3a3a'); } // bone toggles
  f.stroke([S.at(-0.4, 0.2), S.at(-0.3, 0.5), S.at(-0.44, 0.8)], 2.2, '#1a1e24', { op: 0.75 });
  f.stroke([S.at(0.0, 0.5), S.at(0.2, 0.58), S.at(0.4, 0.55)], 2, '#1a1e24', { op: 0.6 });
  for (let i = 0; i < 3; i++) f.line([S.at(-0.9, 0.36 + i * 0.12), S.at(-0.4, 0.33 + i * 0.12), S.at(0.1, 0.38 + i * 0.12)], 1.1, '#b8c2ca', { op: 0.3 }); // salt lines
  X.frost(S.at(0.2, 0.4), 36, 40, 10);
  X.rime([S.at(-0.6, -0.04), S.at(-0.1, -0.12), S.at(0.4, -0.06), S.at(0.8, 0.1)], 12, -1);
  X.rime([S.at(0.86, 0.3), S.at(0.9, 0.6)], 7, -1);
  // the collar turned up round the beard
  f.part([S.at(-0.66, 0.06), S.at(-0.5, -0.2), S.at(0.0, -0.26), S.at(0.5, -0.2), S.at(0.76, -0.02), S.at(0.5, 0.08), S.at(-0.3, 0.1)], WO({ fill: woD }));
  // rope belt with a knot, flensing knife in a sheath, whale-tooth charm
  f.bone('pelvis');
  const bl = [S.at(-0.94, 0.8), S.at(0.0, 0.83), S.at(0.94, 0.78), S.at(0.94, 0.86), S.at(0.0, 0.91), S.at(-0.96, 0.88)];
  f.part(bl, { fill: PAL.rope, shadow: PAL.ropeD, shade: 0.4, tex: 'hatch703', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 16; i++) f.line([S.at(-0.9 + i * 0.12, 0.8), S.at(-0.85 + i * 0.12, 0.88)], 1, INK, { op: 0.5, straight: true });
  f.part(ell(S.at(-0.2, 0.86), 10, 8, 0, 10), { fill: PAL.rope, shadow: PAL.ropeD, shade: 0.4, inkW: 1.2, cast: false });
  f.stroke([S.at(-0.22, 0.88), S.at(-0.26, 1.0), S.at(-0.22, 1.1)], 4, PAL.ropeD); f.stroke([S.at(-0.16, 0.88), S.at(-0.12, 0.98), S.at(-0.16, 1.04)], 4, PAL.ropeD);
  const kS = S.at(-0.66, 0.86), kF = frame(kS, deg(100), 1);
  f.part(kF([[0, -9], [70, -7], [84, 0], [70, 8], [0, 9]]), { fill: '#202226', shade: 0.4, inkW: 1.2, tex: 'mottle703' }); // sheath
  f.part(kF([[-34, -6], [0, -7], [0, 7], [-34, 6]]), { fill: PAL.bone, shade: 0.4, inkW: 1.1, cast: false }); // bone handle
  for (let i = 0; i < 3; i++) f.line(kF([[-28 + i * 10, -6], [-26 + i * 10, 6]]), 1, '#6a665c', { op: 0.7 });
  const ch = S.at(0.2, 0.9); f.line([ch, add(ch, [2, 22])], 1.2, '#2a2a2a');
  f.part([add(ch, [-5, 20]), add(ch, [5, 20]), add(ch, [8, 44]), add(ch, [0, 52]), add(ch, [-6, 40])], { fill: PAL.bone, shade: 0.4, inkW: 1.1, cast: false }); // scrimshawed whale tooth
  f.line([add(ch, [-2, 28]), add(ch, [3, 32]), add(ch, [0, 40])], 0.9, INK, { op: 0.7 });
  // the line coil hung on the hip
  f.bone('coil');
  const cc = S.at(0.62, 1.0);
  for (let i = 0; i < 4; i++) { const e = ell(add(cc, [i * 3 - 4, i * 2]), 34 - i * 2, 22 - i, 0.25, 22); f.line(e.concat([e[0]]), 5.5, INK); f.line(e.concat([e[0]]), 3.6, PAL.rope); }
  f.line(ell(add(cc, [0, 4]), 32, 20, 0.25, 22).slice(12, 20), 1, '#e4eaee', { op: 0.6 });
  X.icicles([add(cc, [-30, 18]), add(cc, [0, 26]), add(cc, [30, 16])], 4, 20, 5);

  // ---- head: fur hat with ear flaps, full frozen beard hung with icicles, eyes narrowed down the throw
  f.bone('head');
  f.part(limb(S.at(0.08, -0.04), hF([[-0.08, 0.3]])[0], 50, 44), SK());
  B.head(f, HC, H, hA, { skin: '#c0c8cc', jaw: 1.2, chin: 0.02, nose: 1.04, hook: 0.12, mouth: 'grim', squint: 0.6, browDown: 0.04, age: true, faceShade: 0.6, jawShade: 0.4, iris: '#a8b4bc', eyeWhite: '#d4dadc', hairCol: '#8a8e92', browCol: '#c8d0d4', noEar: true });
  X.bite(hF([[0.36, 0.1]])[0], 4, 3, 2, 0.3); X.bite(hF([[0.2, 0.06]])[0], 8, 6, 3, 0.1);
  X.cracks(hF([[0.14, 0.14]])[0], 12, 2, 0.6);
  // the beard: a frozen grey mass, one solid lump with combed ridges, icicles hanging plumb from it
  const beard = hF([[-0.16, 0.12], [0.0, 0.24], [0.16, 0.3], [0.3, 0.3], [0.38, 0.4], [0.36, 0.6], [0.24, 0.78], [0.06, 0.8], [-0.1, 0.62], [-0.2, 0.36]]);
  f.part(beard, { fill: '#9aa0a4', shadow: '#40464e', shade: 0.4, tex: X.hoar, texOp: 0.5, inkW: 1.4 });
  for (let i = 0; i < 6; i++) f.line(hF([[-0.08 + i * 0.07, 0.3 + (i % 2) * 0.04], [-0.06 + i * 0.075, 0.52], [-0.02 + i * 0.07, 0.72]]), 1.1, '#3a4048', { op: 0.6 });
  f.part(hF([[0.16, 0.22], [0.26, 0.2], [0.36, 0.22], [0.4, 0.28], [0.32, 0.3], [0.24, 0.28], [0.16, 0.32]]), { fill: '#a8aeb2', shadow: '#40464e', shade: 0.4, inkW: 1.1, cast: false }); // moustache
  f.flat(hF([[0.22, 0.3], [0.32, 0.31], [0.3, 0.35], [0.23, 0.35]]), '#1a1c24', { op: 0.8 }); // lips pressed
  for (const [u, v, l] of [[-0.04, 0.72, 30], [0.08, 0.8, 42], [0.2, 0.78, 34], [0.3, 0.66, 24], [0.36, 0.5, 16]]) X.icicle(hF([[u, v]])[0], l, 6);
  // fur hat: round crown, a turned-up fur front, ear flaps down and tied
  f.bone('hat_flap');
  f.part(hF([[-0.36, -0.12], [-0.18, -0.08], [-0.12, 0.2], [-0.2, 0.42], [-0.34, 0.4], [-0.42, 0.12]]), { fill: fur, shadow: furD, tex: 'hatch703', texOp: 0.4, inkW: 1.3 });
  for (let i = 0; i < 5; i++) f.line(hF([[-0.38 + i * 0.05, -0.02 + i * 0.02], [-0.36 + i * 0.05, 0.36]]), 0.9, furD, { op: 0.6 });
  f.line([hF([[-0.28, 0.4]])[0], add(hF([[-0.28, 0.4]])[0], [2, 26])], 2.2, '#2a2c30'); // flap tie, hanging plumb
  f.bone('head');
  const crown = hF([[-0.5, -0.1], [-0.54, -0.42], [-0.44, -0.6], [-0.36, -0.66], [-0.24, -0.76], [-0.1, -0.78], [0.04, -0.84], [0.18, -0.78], [0.32, -0.74], [0.42, -0.6], [0.5, -0.44], [0.48, -0.2], [0.0, -0.26], [-0.3, -0.16]]);
  f.part(crown, { fill: fur, shadow: furD, tex: X.hoar, texOp: 0.3, light: '#8a8e90' });
  clipDraw(f, crown, () => { for (let i = 0; i < 40; i++) { const q = hF([[-0.42 + f.r() * 0.84, -0.7 + f.r() * 0.5]])[0], a = -1.9 + f.r() * 0.6; f.line([q, add(q, rot([7 + f.r() * 6, 0], a))], 1, f.r() > 0.5 ? furD : '#8a8e90', { op: 0.7 }); } });
  const brim = hF([[-0.52, -0.04], [-0.5, -0.26], [0.0, -0.38], [0.46, -0.36], [0.54, -0.18], [0.46, -0.06], [0.0, -0.14], [-0.44, 0.06]]);
  f.part(brim, { fill: '#8a8e90', shadow: furD, tex: 'hatch703', texOp: 0.4, inkW: 1.4 });
  clipDraw(f, brim, () => { for (let i = 0; i < 30; i++) { const q = hF([[-0.5 + f.r() * 1.0, -0.36 + f.r() * 0.3]])[0]; f.line([q, add(q, [(f.r() - 0.5) * 6, 6 + f.r() * 5])], 1, furD, { op: 0.6 }); } });
  for (let i = 0; i < 14; i++) { const q = hF([[-0.44 + i * 0.065, -0.3 + Math.abs(i - 7) * 0.006]])[0]; f.line([q, add(q, [(f.r() - 0.5) * 4, -6 - f.r() * 4])], 1.2, furD, { op: 0.7 }); } // fur tufts on the brim edge
  X.rime([hF([[-0.2, -0.76]])[0], hF([[0.04, -0.84]])[0], hF([[0.3, -0.74]])[0]], 7, -1);
  X.icicles([hF([[0.0, -0.12]])[0], hF([[0.44, -0.08]])[0]], 3, 14, 4);

  // ---- the harpoon: dark ash shaft with lashings and tally notches, iron shank, barbed head; the line from its socket
  f.bone('harpoon');
  f.part(limb(R0, R1, 15, 14, { steps: 8 }), { fill: PAL.wood, shadow: '#141414', tex: 'wood703', light: PAL.woodL });
  f.line([lp(R0, R1, 0.02, -4), lp(R0, R1, 0.98, -4)], 1, '#7a7670', { op: 0.5, straight: true });
  for (let i = 0; i < 9; i++) f.line([lp(R0, R1, 0.06 + i * 0.016, -7), lp(R0, R1, 0.065 + i * 0.016, 7)], 1.2, '#c8c4b8', { op: 0.7, straight: true }); // tally notches
  for (const t of [0.72, 0.9, 0.96]) { f.line([lp(R0, R1, t, -9), lp(R0, R1, t + 0.008, 9)], 4, INK, { straight: true }); f.line([lp(R0, R1, t, -8), lp(R0, R1, t + 0.008, 8)], 2.2, PAL.rope, { straight: true }); } // seizings
  const hF2 = frame(R1, hAng, 1);
  f.part(hF2([[-26, -9], [4, -8], [10, -4], [96, -3], [96, 3], [10, 4], [4, 8], [-26, 9]]), { fill: PAL.iron, shadow: PAL.ironD, shade: 0.35, inkW: 1.3, tex: 'mottle703' }); // socket and shank
  const head = hF2([[90, -5], [104, -9], [100, -26, 1], [128, -12], [150, -4], [166, 0, 1], [150, 4], [128, 12], [100, 26, 1], [104, 9], [90, 5]]);
  f.part(head, { fill: PAL.steel, shadow: '#3a3e46', shade: 0.35, inkW: 1.4, sharp: true, light: PAL.steelL }); // flued head with two barbs
  f.flat(hF2([[104, -9], [102, -22], [124, -11], [110, -4]]), '#2a2e36', { op: 0.6 });
  f.line(hF2([[108, 0], [162, 0]]), 1.2, '#e4eaee', { op: 0.7 });
  
  X.icicles([hF2([[-20, 10]])[0], hF2([[60, 4]])[0], hF2([[100, 26]])[0]], 3, 22, 5);
  X.icicles([lp(R0, R1, 0.1, 8), lp(R0, R1, 0.3, 8), lp(R0, R1, 0.62, 8)], 4, 24, 6);
  X.frost(lp(R0, R1, 0.5, -5), 190, 3, 12, 1.3);
  f.bone('line');
  rope(f, [hF2([[-10, 9]])[0], [462, 170], [452, 300], [436, 420], S.at(0.62, 0.92)], 3.4, PAL.rope); // frozen stiff in a loop down to the coil

  // ---- throwing arm: raised and cased in ice from shoulder to fist
  const [cUN, cFN] = jcut(SN, EN, WN, 22);
  split(f, () => {
    f.part(jointLimb(SN, EN, lerp(EN, WN, 0.86), [58, 46, 42], { point: 0.35, mus0: 0.14, mus1: 0.14 }), WO());
    f.stroke([lp(SN, EN, 0.2, 16), lp(SN, EN, 0.7, 18)], 2.2, '#1a1e24', { op: 0.7 });
    creases(f, EN, Math.atan2(WN[1] - SN[1], WN[0] - SN[0]), 26, 3, '#1a1e24', 0.7);
    // the ice cast: a faceted translucent sheath over the sleeve, thick on the windward side
    const cast = jointLimb(lerp(SN, EN, 0.2), EN, lerp(EN, WN, 0.9), [72, 64, 58], { point: 0.3, mus0: 0.14, mus1: 0.18 });
    f.part(cast, X.IC({ fill: PAL.glaze, opacity: 0.5, shade: 0.4, inkW: 1.2, inkHeavy: 2, k: 0.7 }));
    X.rime([lp(SN, EN, 0.4, 34), lp(SN, EN, 0.95, 34), lp(EN, WN, 0.3, 32), lp(EN, WN, 0.8, 30)], 9, 1);
    for (const [a, b2] of [[lp(SN, EN, 0.3, -20), lp(SN, EN, 0.9, -14)], [lp(EN, WN, 0.1, 16), lp(EN, WN, 0.8, 18)], [lp(EN, WN, 0.2, -10), lp(EN, WN, 0.7, -16)]]) f.line([a, b2], 1.4, '#f2f6f8', { op: 0.7, straight: true }); // facet edges catching the light
    X.cracks(lerp(SN, EN, 0.5), 30, 3, 0.8);
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('upperarm_n');
  X.icicles([lp(SN, EN, 0.4, -34), lp(SN, EN, 0.9, -32), add(EN, [8, 30])], 5, 44, 8); // under the raised upper arm and elbow
  f.bone('forearm_n');
  X.icicles([lp(EN, WN, 0.2, -30), lp(EN, WN, 0.6, -29)], 2, 18, 6);
  f.bone('hand_n');
  const gW = B.grip(f, WN, EN, hAng, 32, mix(skin, PAL.bite, 0.15), { tex: 'mottle703', texOp: 0.5, shadow: skinS, name: 'whaler harpoon' });
  fistDetail(f, gW, 32, skin, {});
  f.part([gW.F([[-1.2, -0.75]])[0], gW.F([[-0.2, -0.8]])[0], gW.F([[-0.2, 0.75]])[0], gW.F([[-1.2, 0.7]])[0]], WO({ fill: '#5a5e62', inkW: 1.2 })); // mitt cuff
  f.part(ell(WN, 34, 30, 0, 14), X.IC({ fill: PAL.glaze, opacity: 0.45, inkW: 1, inkHeavy: 1.2 })); // the ice over the fist
  f.line([add(WN, [-12, -20]), add(WN, [8, -24])], 1.4, '#f2f6f8', { op: 0.7 });
  X.icicles([add(WN, [-20, 26]), add(WN, [16, 26])], 2, 20, 6);

  f.bone('root');
  X.floe([300, GY + 2], 220, 14);
  X.slab([480, GY + 4], 50, 22, 0.2);
  return f;
}

// ------------------------------------------------------------------ WALRUS BRUTE (Large 1.6)
// A scarred bull hauled up on its fore flippers, the way a walrus sits: the neck and shoulders are the biggest thing on
// it, hung with heavy folds of boss-studded hide that scallop the throat; the head is small and flat on top of all that,
// with the broad bristled whisker pad in front and the eye small and sunk in folds. The fore flippers carry the weight,
// turned out and pressed flat on the ice with the digits and nails showing; the hind flippers are turned forward under
// the hips. One tusk snapped at the gum and a sailor's cutlass jammed in beside the stump; the other long ivory. Rime on
// the windward (+x) and upper faces of the folds, icicles under every overhang; moult patches peeling, old scars.
function walrusBrute() {
  const [Wc, Hc] = TIERS.large, GY = Hc - 30;
  const f = new Fig(foeBase(707, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 140 })));
  const X = fx(f);
  // consistency pass 2026-11-25: the walrus read as an upright sack. The whole animal is now leaned forward onto its fore
  // flippers by an affine shear about the ground line (the higher a point, the further forward it goes) with a slight
  // settling squash, so the chest and head hang out over the flippers and the hind end stays planted. Icicles are drawn
  // unsheared at their sheared tops, so they still hang plumb. The canvas is widened to 1200 at the same pixel scale.
  const LK_K = 0.32, LK_S = 0.92, LK = p => [p[0] + LK_K * (GY - p[1]), GY - LK_S * (GY - p[1])];
  { const ic = X.icicle.bind(X); X.icicle = (p, ...a) => { const i0 = f.out.length; const r = ic(p, ...a); const t = sub(LK(p), p), inv = `matrix(1,0,${(LK_K / LK_S).toFixed(5)},${(1 / LK_S).toFixed(5)},${(-LK_K * GY / LK_S).toFixed(2)},${(GY * (1 - 1 / LK_S)).toFixed(2)})`; for (let i = i0; i < f.out.length; i++) f.out[i] = `<g transform="${inv} translate(${t[0].toFixed(2)},${t[1].toFixed(2)})">${f.out[i]}</g>`; return r; }; }
  const hide = '#6c645d', hideS = '#28252a', hideL = '#9b938b', hideD = '#4b4541', scar = '#c9c6c0', ivory = PAL.bone, moult = '#8e877f', raw = '#463f3d', crease = '#1c191c';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: hideS, light: hideL, tex: 'mottle707', texOp: 0.6, shade: 0.3, maxShade: 46 }, o);
  // ---- skeleton
  const HIP = [230, 940], CH = [400, 720], NK = [540, 470], HC = [720, 180], HJ = [630, 290]; // pivots near the back edge: a forward bend overlaps at the throat instead of opening the back
  const FN = [790, 860], FNe = [796, 976], FF = [760, 964], TL = [170, 1020];
  f.joint('body', HIP).joint('chest', CH, 'body').joint('neck', NK, 'chest').joint('head', HJ, 'neck').joint('tusk_cutlass', [776, 270], 'head');
  f.joint('flipper_fn', FN, 'chest').joint('flipper_fn_2', FNe, 'flipper_fn').joint('flipper_ff', FF, 'chest').joint('tail', TL, 'body').joint('harpoon', [300, 860], 'body');

  // ---- the fore flippers, drawn before the body so the forearms come out from under the chest fold: a short thick
  // forearm, the wrist bent and packed into folds under the weight, the paddle lying forward along the ice with five
  // digits ridged under the hide and small nails set back from its scalloped edge
  const paddle = (o, dark) => {
    const P0 = pts => pts.map(q => add(q, o));
    // a fan of five digits spreading forward and out over the ice, the edge scalloped between the digit tips
    const W0 = [762, 1000], tips = [[880, 978], [898, 998], [898, 1022], [886, 1044], [862, 1062]];
    const pad = P0([[744, 968], [800, 962], [846, 970], [tips[0][0], tips[0][1]], [874, 990], [tips[1][0], tips[1][1]], [886, 1011], [tips[2][0], tips[2][1]], [882, 1034], [tips[3][0], tips[3][1]], [866, 1052], [tips[4][0], tips[4][1]], [800, 1068], [740, 1069], [726, 1030]]);
    f.part(pad, HD({ fill: dark ? hideD : mix(hide, '#3a3438', 0.12), maxShade: 14 }));
    clipDraw(f, pad, () => {
      tips.forEach((t, i) => { const r0 = add(lerp(W0, [W0[0], W0[1] + (i - 2) * 16], 1), o), b = add(t, o), d = E.norm(sub(b, r0)); f.stroke([r0, lerp(r0, b, 0.5), add(b, mul(d, -6))], 10, mix(hide, hideL, dark ? 0.15 : 0.35), { op: 0.5 }); f.line([add(r0, [0, 6]), add(b, add(mul(d, -8), [0, 6]))], 1.2, crease, { op: 0.6 }); for (const tt of [0.42, 0.7]) { const q = lerp(r0, b, tt), nn = [-d[1], d[0]]; f.line([add(q, mul(nn, -5)), add(q, mul(nn, 5))], 1, crease, { op: 0.5 }); } }); // digit ridges, knuckle creases
      for (let i = 0; i < 18; i++) { const q = add([750 + f.r() * 130, 975 + f.r() * 80], o); f.line([q, add(q, [7, 3])], 0.8, crease, { op: 0.35 }); }
      f.flat(P0([[700, 1056], [910, 1052], [910, 1076], [700, 1076]]), crease, { op: 0.4 }); // the edge pressed into the slush
      f.flat(P0([[744, 966], [880, 984], [870, 994], [744, 980]]), hideL, { op: dark ? 0.1 : 0.3 }); // the lit top
    });
    tips.forEach((t, i) => { const r0 = add([W0[0], W0[1] + (i - 2) * 16], o), b = add(t, o), d = E.norm(sub(b, r0)), c = add(b, mul(d, -15)), a = Math.atan2(d[1], d[0]); f.part(ell(c, 6, 3.6, a, 8), { fill: '#2e2a2a', shadow: '#0e0c0e', shade: 0.4, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); f.flat(ell(add(c, rot([1, -1.4], a)), 2.4, 1, a, 6), '#8a8680', { op: 0.7 }); }); // small nails set back from each tip
    return pad;
  };
  f.bone('flipper_ff');
  paddle([-34, -12], true);
  f.bone('flipper_fn');
  const arm = [[740, 830], [826, 826], [852, 880], [846, 944], [816, 986], [772, 988], [752, 944], [738, 892]];
  f.part(arm, HD({ fill: mix(hide, hideL, 0.06), maxShade: 26 }));
  clipDraw(f, arm, () => {
    f.stroke([[750, 930], [800, 944], [846, 926]], 7, crease, { op: 0.45 }); f.stroke([[756, 956], [800, 968], [836, 956]], 5, crease, { op: 0.4 }); // wrist folds
    for (let i = 0; i < 14; i++) { const q = [750 + f.r() * 96, 880 + f.r() * 100]; f.line([q, add(q, [8, 4])], 0.8, crease, { op: 0.4 }); }
    f.flat([[824, 846], [850, 890], [844, 940], [830, 936], [832, 890]], hideL, { op: 0.32 });
  });
  f.bone('flipper_fn_2');
  paddle([0, 0], false);
  X.bite([884, 1056], 16, 6, 6, 0.6);
  X.rime([[748, 966], [790, 960], [840, 974], [878, 994]], 8, -1);

  // ---- hind flippers turned forward under the hips, soles on the ice, the near one over the far one
  f.bone('tail');
  const hindF = [[110, 1030], [180, 1016], [262, 1030], [330, 1048], [344, 1068], [150, 1068], [100, 1056]];
  f.part(hindF, HD({ fill: hideD, maxShade: 14 }));
  for (let i = 0; i < 5; i++) { const b = [282 + i * 13, 1058]; f.line([add(b, [-70, -22]), b], 1.2, INK, { op: 0.5 }); f.part([add(b, [-3, -6]), add(b, [8, -6]), add(b, [9, 4]), add(b, [-2, 4])], { fill: '#2a2626', shade: 0.3, inkW: 0.8, cast: false }); }

  // ---- the body, chest, neck and skull in one outline (so it never reads as a stack of balls): the hind end low, the
  // back climbing to the shoulder hump, the thick neck running straight up into the flat skull; in front the whisker
  // pad, the small chin, the throat scalloped by hanging folds, the barrel chest, the armpit and the slumped belly
  f.bone('body');
  const bodyPts = [[30, 1064], [20, 1036], [40, 1000], [96, 940], [180, 866], [270, 780], [340, 690], [396, 590], [440, 480], [484, 370], [530, 262], [574, 180], [620, 118], [662, 80], [706, 60], [756, 66], [798, 94], [826, 124],
    [848, 156], [858, 200], [850, 244], [826, 270], [796, 288], [774, 306], [780, 340], [766, 362, 1], [798, 392], [818, 430], [800, 452, 1], [836, 486], [852, 540], [840, 562, 1], [862, 610], [868, 680], [856, 750], [830, 808], [806, 852],
    [770, 900], [720, 950], [650, 1004], [560, 1044], [460, 1060], [330, 1066], [200, 1068]];
  const look = HD();
  const fold = (B, M, F2, w) => { const L = [F2, M, B]; f.stroke(L, w * 2.2, crease, { op: 0.45 }); f.stroke(L.map(q => add(q, [0, -w * 1.05])), w * 0.8, hideL, { op: 0.5 }); f.line([add(F2, [0, w * 0.1]), add(M, [0, w * 0.2]), lerp(M, B, 0.7)], 2.2, INK, { op: 0.75 }); f.flat([add(F2, [0, w * 0.3]), add(M, [0, w * 0.4]), B, add(M, [-10, w * 2.4]), add(F2, [-14, w * 2])], crease, { op: 0.2 }); };
  const foldOld = (B, M, F2, w) => { f.stroke([B, M, F2], w * 1.8, crease, { op: 0.5 }); f.stroke([add(B, [4, -w * 0.9]), add(M, [0, -w * 1.1]), add(F2, [-4, -w * 0.8])], w * 0.7, hideL, { op: 0.55 }); f.line([add(B, [0, w * 0.15]), add(M, [0, w * 0.2]), add(F2, [0, w * 0.15])], 2.2, INK, { op: 0.7 }); f.flat([add(B, [2, w * 0.3]), add(M, [0, w * 0.4]), add(F2, [0, w * 0.3]), add(F2, [-10, w * 1.6]), add(M, [0, w * 2.2]), add(B, [4, w * 1.4])], crease, { op: 0.22 }); };
  split(f, () => {
    f.part(bodyPts, look);
    clipDraw(f, bodyPts, () => {
      // form: the belly and the under side of each mass fall into shadow; the upper right of the shoulder, the throat
      // and the crown take the light; the great slab of the shoulder blade shows under the hide
      f.flat([[0, 1010], [200, 960], [420, 930], [620, 900], [760, 840], [880, 800], [880, 1100], [0, 1100]], hideS, { op: 0.3 });
      f.flat([[0, 1048], [300, 1036], [560, 1000], [740, 900], [880, 860], [880, 1100], [0, 1100]], hideS, { op: 0.25 });
      f.flat([[0, 700], [300, 560], [460, 320], [560, 160], [600, 300], [540, 470], [440, 680], [300, 840], [0, 1020]], hideS, { op: 0.3 }); // the shadowed back of the hump
      f.flat([[0, 820], [260, 700], [400, 520], [470, 400], [460, 560], [360, 760], [200, 900], [0, 1040]], hideS, { op: 0.2 });
      f.flat([[720, 330], [800, 380], [860, 520], [870, 680], [820, 640], [760, 520], [700, 420]], hideL, { op: 0.34 });
      f.flat([[760, 600], [850, 600], [870, 700], [840, 780], [790, 720]], hideL, { op: 0.25 });
      f.flat([[640, 100], [706, 64], [800, 96], [846, 150], [790, 150], [700, 120]], hideL, { op: 0.3 });
      f.flat([[480, 380], [540, 270], [600, 200], [660, 220], [640, 320], [580, 420], [520, 470]], hideL, { op: 0.2 }); // the lit top of the shoulder hump
      f.stroke([[452, 420], [520, 500], [600, 560], [690, 580]], 22, crease, { op: 0.28 }); // the shoulder blade's lower edge
      f.stroke([[470, 400], [536, 470], [610, 520], [690, 540]], 8, hideL, { op: 0.3 });
      // throat folds: each starts at a notch in the front edge, sags back across the neck and fades out; the nape is
      // packed into short creases where the head is held up; one long fold runs down from the armpit along the flank
      fold([660, 374], [724, 384], [766, 364], 9);
      fold([606, 456], [700, 474], [800, 454], 12);
      fold([616, 576], [740, 596], [840, 564], 12);
      fold([700, 718], [790, 726], [862, 704], 8);
      for (const [a0, b0, c0] of [[[556, 204], [600, 222], [640, 214]], [[534, 250], [580, 272], [622, 268]], [[514, 300], [556, 320], [592, 316]]]) { f.stroke([a0, b0, c0], 9, crease, { op: 0.5 }); f.stroke([add(a0, [4, -6]), add(b0, [0, -7]), add(c0, [-4, -6])], 4, hideL, { op: 0.45 }); }
      f.stroke([[380, 760], [470, 790], [580, 830], [680, 860], [760, 870]], 14, crease, { op: 0.35 });
      f.stroke([[380, 750], [470, 778], [580, 818], [680, 846]], 5, hideL, { op: 0.35 });
      for (let i = 0; i < 12; i++) { const t = i / 12, q = lerp([90, 990], [400, 720], t); f.line([q, add(q, [34, 30 + t * 8]), add(q, [64, 86 - t * 20])], 1.2, crease, { op: 0.35 }); }
      // a fine net of cracked-hide wrinkles over everything
      for (let i = 0; i < 160; i++) { const p = [60 + f.r() * 760, 120 + f.r() * 930], a = f.r() * Math.PI; f.line([p, add(p, rot([6 + f.r() * 10, 0], a)), add(p, rot([10 + f.r() * 12, 4], a))], 0.8, crease, { op: 0.35 }); }
      // the bull's bosses: knobbed lumps crowding the neck, shoulders and chest, lit on top, shadowed below
      for (let i = 0; i < 140; i++) { const p = [480 + f.r() * 380, 300 + f.r() * 520], r = 3 + f.r() * 7; f.flat(ell(add(p, [-r * 0.3, r * 0.35]), r, r * 0.8, 0, 8), crease, { op: 0.45 }); f.flat(ell(p, r * 0.9, r * 0.72, 0, 8), mix(hide, hideL, 0.25), { op: 0.85 }); f.flat(ell(add(p, [r * 0.3, -r * 0.3]), r * 0.4, r * 0.28, 0, 6), hideL, { op: 0.8 }); }
      // moult: patches where the old hide is peeling, paler and rougher, with curled edges and darker skin beneath
      for (const [c, rx, ry] of [[[320, 900], 56, 30], [[560, 650], 30, 42], [[470, 560], 24, 30]]) {
        const pts = []; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2; pts.push(add(c, [Math.cos(a) * rx * (0.6 + f.r() * 0.55), Math.sin(a) * ry * (0.6 + f.r() * 0.55)])); }
        f.flat(pts, raw, { op: 0.35 }); f.flat(pts.map(q => lerp(c, q, 0.7 + f.r() * 0.15)), moult, { op: 0.5 });
        f.line(pts.slice(2, 12), 1.1, INK, { op: 0.45 });
        for (let k = 0; k < 5; k++) { const q = pts[(k * 3) % 14]; f.line([q, add(q, [(f.r() - 0.5) * 10, -6 - f.r() * 6]), add(q, [(f.r() - 0.5) * 14, -2])], 1, '#c8c2ba', { op: 0.7 }); }
        for (let k = 0; k < 6; k++) { const q = add(c, [(f.r() - 0.5) * rx, (f.r() - 0.5) * ry]); f.line([q, add(q, [6, 2])], 0.8, crease, { op: 0.5 }); }
      }
      // sparse coarse hair, old fight scars (long pale welts) and frost-cracked skin
      for (let i = 0; i < 90; i++) { const p = [40 + f.r() * 600, 820 + f.r() * 240]; f.line([p, add(p, [-3, 5])], 0.8, crease, { op: 0.4 }); }
      X.scars([700, 440], 100, 160, 8, 1.1, scar); X.scars([380, 900], 140, 60, 5, -0.4, scar); X.scars([800, 660], 40, 60, 3, 0.4, scar); X.scars([560, 360], 50, 60, 3, -0.8, scar);
      X.cracks([290, 980], 50, 4, -0.2); X.cracks([760, 700], 30, 3, 1.2);
      X.bite([120, 1040], 60, 20, 10, 0.4);
      for (let i = 0; i < 6; i++) { const q = [160 + i * 60, 940 - i * 30]; f.stroke([q, add(q, [40, 20]), add(q, [90, 30])], 8, crease, { op: 0.3 }); f.stroke([add(q, [2, -6]), add(q, [42, 13]), add(q, [88, 23])], 3, hideL, { op: 0.3 }); } // the flank creased where the hips turn under
      f.flat([[0, 1044], [900, 1044], [900, 1080], [0, 1080]], '#3a4652', { op: 0.3 }); // slush where it lies
    });
  }, [['body', side(CH, [-1, 0.6], 120)], ['chest', [side(CH, [1, -0.6], 120), side(NK, [0.35, 1], 120)]], ['neck', [side(NK, [-0.35, -1], 120), side(HJ, [-0.3, 1], 100)]], ['head', side(HJ, [0.3, -1], 100)]]);

  // the near hind flipper, turned forward under the hip, sole on the ice, its digits pointing at the heroes
  f.bone('tail');
  const hn = [[96, 1018], [160, 1004], [244, 1016], [318, 1036], [362, 1052], [370, 1068], [140, 1070], [90, 1050]];
  f.part(hn, HD({ fill: mix(hide, hideD, 0.4), maxShade: 12 }));
  clipDraw(f, hn, () => { for (let i = 0; i < 5; i++) { const b = [300 + i * 14, 1060]; f.line([add(b, [-120, -36]), add(b, [-60, -18]), b], 1.3, crease, { op: 0.55 }); } f.flat([[80, 1052], [380, 1050], [380, 1072], [80, 1072]], crease, { op: 0.4 }); f.stroke([[120, 1022], [200, 1016], [280, 1030]], 6, hideL, { op: 0.3 }); });
  for (let i = 0; i < 5; i++) { const b = [298 + i * 14, 1058]; f.part([add(b, [-4, -4]), add(b, [6, -6]), add(b, [9, 2]), add(b, [-2, 4])], { fill: '#2a2626', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); }
  X.rime([[110, 1012], [160, 1004], [244, 1014]], 7, -1);

  // ---- frost on the windward folds: rime on the upper faces of the rolls and the back, icicles under every overhang
  f.bone('body');
  X.rime([[50, 996], [80, 964], [110, 934]], 12, -1); X.rime([[170, 878], [210, 840], [250, 802]], 14, -1);
  X.icicles([[460, 1058], [300, 1064]], 4, 12, 6);
  f.bone('chest');
  X.rime([[862, 610], [868, 680], [856, 750]], 14, -1);
  X.rime([[790, 720], [830, 712], [862, 702]], 8, -1); X.icicles([[800, 734], [858, 716]], 3, 24, 7);
  X.icicles([[806, 856], [770, 902]], 2, 20, 7);
  f.bone('neck');
  X.rime([[396, 590], [414, 546], [440, 480]], 13, -1); X.rime([[470, 400], [484, 370], [506, 318], [530, 262]], 16, -1);
  for (const [a, b] of [[[766, 364], [740, 380]], [[800, 454], [760, 468]], [[840, 564], [800, 584]]]) { X.rime([add(a, [6, -18]), add(lerp(a, b, 0.5), [0, -14]), add(b, [0, -12])], 8, -1); X.icicles([add(a, [-2, 8]), add(b, [0, 10])], 2, 26, 6); }

  // ---- the broken harpoon in the flank, line frozen to the ice
  f.bone('harpoon');
  const hp0 = [300, 860], hp1 = [196, 726];
  f.part(limb(hp0, hp1, 20, 17, { steps: 6 }), { fill: PAL.wood, shadow: '#141414', tex: 'wood707', light: PAL.woodL });
  f.flat(ell(hp0, 18, 12, 0.7, 12), '#16121a'); // wound
  f.part([lp(hp0, hp1, 0.0, -11), lp(hp0, hp1, 0.12, -10), lp(hp0, hp1, 0.12, 10), lp(hp0, hp1, 0.0, 11)], { fill: PAL.iron, shade: 0.4, inkW: 1.2, cast: false, sharp: true });
  f.spatter(hp0, 16, 10, PAL.blood);
  f.line([hp1, add(hp1, [-6, -8]), add(hp1, [2, -14]), add(hp1, [-4, -22])], 3, PAL.woodL);
  for (const t of [0.4, 0.7]) { f.line([lp(hp0, hp1, t, -9), lp(hp0, hp1, t + 0.02, 9)], 4, INK, { straight: true }); f.line([lp(hp0, hp1, t, -8), lp(hp0, hp1, t + 0.02, 8)], 2.2, PAL.rope, { straight: true }); }
  rope(f, [lp(hp0, hp1, 0.45, 6), [240, 860], [190, 950], [150, 1020], [110, 1066]], 3.4, PAL.rope);
  X.icicle(lp(hp0, hp1, 0.6, 8), 22, 6); X.frost(lp(hp0, hp1, 0.5, -4), 30, 20, 5);

  // ---- near fore flipper: the forearm out of the chest under a heavy armpit fold, the wrist bent under the weight,
  // the broad paddle turned out and pressed flat, five digits ridged under the hide, small nails set back from the edge
  // ---- the far tusk (behind the muzzle): long ivory, a little curved, growth rings, a worn tip
  f.bone('head');
  const tusk = (base, tip, w, col) => { const C = spline([base, add(lerp(base, tip, 0.4), [10, 0]), add(lerp(base, tip, 0.8), [4, 0]), tip], 6), n = C.length, Wd = C.map((_, i) => w * (1 - Math.pow(i / (n - 1), 1.6) * 0.82)); f.part(ribbon(C, Wd), { fill: col, shadow: PAL.boneS, shade: 0.3, inkW: 1.5, inkHeavy: 2.4, light: '#f6f2ea', hatch: false }); return C; };
  const tB = [806, 262], CT = tusk(tB, [890, 600], 34, mix(ivory, '#a09a8e', 0.15));
  for (let i = 6; i < CT.length - 8; i += 6) f.line([lp(CT[i], CT[i + 1], 0, -9), lp(CT[i], CT[i + 1], 0, 9)], 1, '#7a7468', { op: 0.6 });
  f.line(CT.slice(2, -4).map(q => add(q, [6, 0])), 1.4, '#fbf8f2', { op: 0.6 });
  f.flat(ell(add(CT[CT.length - 1], [0, -10]), 5, 10, 0, 8), '#8a8478', { op: 0.5 });
  X.icicle(lerp(CT[8], CT[9], 0.5), 18, 5); X.rime(CT.slice(2, 14).filter((_, i) => i % 3 === 0).map(q => add(q, [10, 0])), 5, -1);

  // ---- head details over the outline: the whisker pad, the eye sunk in folds, nostrils, ear slit, forehead wrinkles
  const padP = [[788, 112], [824, 130], [850, 168], [860, 210], [850, 252], [820, 276], [784, 272], [760, 240], [758, 176]];
  f.part(padP, HD({ fill: mix(hide, hideL, 0.24), maxShade: 18, inkW: 0, inkHeavy: 0, cast: false }));
  f.stroke([[790, 116], [770, 150], [760, 196], [768, 240], [786, 268]], 6, crease, { op: 0.45 }); // the fold where the pad swells off the face
  f.line([[812, 270], [840, 258], [856, 230]], 1.6, INK, { op: 0.7 });
  clipDraw(f, padP, () => {
    f.flat([[750, 236], [860, 216], [860, 290], [750, 290]], hideS, { op: 0.32 }); // the pad's under side
    f.flat([[800, 130], [846, 170], [856, 210], [830, 200], [806, 160]], hideL, { op: 0.35 }); // its lit swell
    // follicle pits in staggered arcs following the pad's curve
    for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) { const a = -0.9 + c * 0.32 + (r % 2) * 0.16, rad = 30 + r * 13; const q = add([760, 140], [Math.cos(a) * rad * 0.9 + 30, Math.sin(a) * rad * 0.4 + r * 14]); f.flat(ell(q, 2.4, 2, 0, 6), crease, { op: 0.75 }); f.flat(ell(add(q, [1, -1]), 1, 0.8, 0, 6), hideL, { op: 0.7 }); }
  });
  // the bristles: thick stiff quills over the lower pad, curving down and forward, pale, frost beaded on the tips
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const a = -0.7 + c * 0.26 + (r % 2) * 0.13, rad = 60 + r * 11; const q = add([760, 140], [Math.cos(a) * rad * 0.9 + 32, Math.sin(a) * rad * 0.4 + (r + 2.6) * 14]); const l = 16 + r * 5 + (c % 2) * 6; f.stroke([q, add(q, [3 + c, l * 0.5]), add(q, [6 + c * 1.5, l])], 5.2, '#aaa49c', { op: 0.95 }); f.line([q, add(q, [6 + c * 1.5, l])], 0.8, crease, { op: 0.55 }); f.flat(ell(add(q, [6 + c * 1.5, l]), 2.2, 2.2, 0, 6), '#eef2f4'); }
  for (const [u, v, l] of [[800, 278, 28], [824, 274, 36], [844, 258, 22], [782, 270, 18]]) X.icicle([u, v], l, 6);
  f.line([[800, 104], [814, 112]], 3.4, '#1a1616'); f.line([[822, 118], [834, 128]], 3.4, '#1a1616'); // nostrils on top of the muzzle
  // the eye: small, dark, sunk deep in wrinkled folds well back on the head; rime in the lashes
  const ec = [730, 136];
  f.flat(ell(ec, 16, 11, -0.2, 12), crease, { op: 0.6 });
  f.flat(ell(ec, 7, 4.6, -0.2, 10), '#0c0a0c'); f.flat(ell(add(ec, [2, -1.5]), 1.6, 1.2, 0, 6), '#a8b0b6');
  for (const [r, op] of [[14, 0.7], [20, 0.5], [26, 0.35]]) f.line(ell(ec, r, r * 0.66, -0.2, 16).slice(1, 8), 1.4, crease, { op });
  f.stroke([add(ec, [-18, -6]), add(ec, [0, -14]), add(ec, [18, -8])], 5, crease, { op: 0.7 });
  X.frost(add(ec, [0, -14]), 14, 3, 5, 1.2);
  f.stroke([[674, 150], [670, 166], [676, 180]], 3, crease, { op: 0.8 }); // ear slit
  for (let i = 0; i < 4; i++) f.line([[680 + i * 14, 90 + i * 4], [712 + i * 14, 82 + i * 4], [742 + i * 12, 92 + i * 5]], 1.3, crease, { op: 0.55 }); // forehead wrinkles
  for (let i = 0; i < 3; i++) f.line([[690, 200 + i * 16], [730, 212 + i * 16], [764, 206 + i * 16]], 1.3, crease, { op: 0.5 }); // cheek folds
  f.flat([[766, 284], [812, 282], [806, 300], [774, 306]], hideD, { op: 0.8 }); // the small lower lip under the pad
  X.scars([700, 220], 40, 30, 3, 0.2, scar);
  X.rime([[620, 118], [662, 80], [706, 60], [756, 66], [798, 94], [826, 124], [848, 156]], 15, -1);

  // ---- the near tusk snapped at the gum, and the sailor's cutlass jammed in beside the stump, point down
  f.part([[772, 266], [800, 264], [804, 302], [794, 314], [786, 304], [776, 314]], { fill: ivory, shadow: PAL.boneS, shade: 0.4, inkW: 1.4, sharp: true, hatch: false });
  f.flat([[778, 308], [786, 300], [794, 310]], '#7a7468');
  f.bone('tusk_cutlass');
  const cg = [760, 274], cA = deg(72), cF = frame(cg, cA, 1);
  f.part(cF([[-54, -9], [-6, -10], [-6, 10], [-54, 9]]), { fill: '#202226', shade: 0.4, inkW: 1.2 });
  f.part(cF([[-60, -10], [-52, -12], [-50, 12], [-60, 10]]), { fill: PAL.iron, shade: 0.4, inkW: 1.1, cast: false });
  f.part(cF([[-4, -24], [6, -24], [6, 24], [-4, 24]]), { fill: PAL.iron, shade: 0.4, inkW: 1.2, sharp: true });
  f.part(cF([[6, -12], [140, -15], [250, -8], [292, 6, 1], [262, 19], [150, 21], [6, 12]]), { fill: '#a4acb4', shadow: '#4a525c', shade: 0.3, inkW: 1.5, light: '#d8e0e6', hatch: false });
  f.line(cF([[12, -6], [240, -2]]), 1.2, '#eef2f4', { op: 0.7 });
  for (const x of [80, 150, 210]) f.flat(cF([[x, 21], [x + 8, 14], [x + 14, 21]]), '#2a2e36');
  X.frost(cF([[150, 2]])[0], 6, 80, 10, 1.2);
  X.icicle(cF([[-4, 24]])[0], 16, 5);
  f.part([[742, 266], [758, 260], [778, 268], [784, 284], [776, 298], [766, 292], [756, 302], [744, 292]], HD({ fill: '#4e4644', inkW: 1.2, cast: false, maxShade: 6 })); // the swollen torn gum, ragged round the blade
  f.line([[750, 280], [754, 292], [752, 306]], 2.2, PAL.blood, { op: 0.9 }); f.line([[770, 284], [772, 298]], 1.8, PAL.blood, { op: 0.85 });
  X.icicle([764, 300], 18, 5);

  f.bone('root');
  X.floe([450, GY + 2], 440, 18);
  X.slab2([[20, GY - 14], [80, GY - 40], [104, GY + 6], [30, GY + 10]], [10, -8], { step: 34, snow: 8, bubbles: 6, layers: 2, cracks: 1 });
  // the lean (see the top of the function): every part and every pivot goes through the same shear
  const LM = `matrix(1,0,${-LK_K},${LK_S},${(LK_K * GY).toFixed(2)},${((1 - LK_S) * GY).toFixed(2)})`;
  f.out = f.out.map(q => `<g transform="${LM}">${q}</g>`);
  for (const jn of Object.values(f.joints)) jn.pivot = LK(jn.pivot).map(v => Math.round(v * 10) / 10);
  return f;
}

// ------------------------------------------------------------------ ICE EEL (Large 1.5)
// An eel, not a sea-serpent: it has no neck. The front third of a big conger has come up out of a hole in the sea-ice in
// an S, thickest through the trunk at the hole and barely narrowing into a heavy head; its tail has broken up through a
// crack behind it, compressed flat, the dorsal and anal fins running round the tip in one fringe. The outside of every
// bend bulges with muscle and the inside packs into skin creases. Rime crusts the windward (+x) and top faces; under the
// frost the skin is drowned pale and nearly translucent, the spine and gut shadowed through it, lividity pooled low.
// The head is built as a skull: the jaw muscle swelling the cheek behind the eye, an upper jaw with lips and pores, the
// lower jaw dropped on its hinge, needle teeth in both, tube nostrils at the snout, a small gill slit and pectoral fin.
function iceEel() {
  const [Wc, Hc] = TIERS.large, GY = Hc - 30;
  const f = new Fig(foeBase(705, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 60 })));
  const X = fx(f);
  const backC = '#93a8b9', sk = '#c9d8e2', skS = '#526a80', skL = '#eef4f8', bel = '#e2eaee', livid = '#8a86a2', crease = '#2c3c4e';
  const EL = (o = {}) => Object.assign({ fill: sk, shadow: skS, light: skL, tex: X.icetex, texOp: 0.4, shade: 0.42, maxShade: 56 }, o);
  // ---- the trunk, from under the ice to the back of the skull: thickest at the hole, no waist behind the head
  const ctrl = [[300, 1130], [306, 1020], [350, 905], [436, 820], [500, 728], [504, 618], [464, 514], [456, 414], [498, 326], [568, 272], [640, 258]];
  const Cc = spline(ctrl, 6), n = Cc.length;
  const Wd = Cc.map((_, i) => { const t = i / (n - 1); return 206 - 64 * Math.pow(t, 1.15) + 12 * Math.sin(Math.PI * Math.min(1, t * 2.2)); });
  const M = muscleBody(Cc, Wd, { bulge: 0.3, pinch: 0.14, gain: 3 }), { at, T, Nn } = M, bs = M.bend;
  const HB = Cc[n - 1], hA = 0.22, hF = frame(HB, hA, 0.96), Tend = T[n - 1];
  // ---- the tail, up through a crack behind: compressed flat, deep in side view, fins all round the tip
  const tctrl = [[100, 1120], [96, 1040], [76, 962], [66, 884], [82, 818], [114, 782]];
  const Ct = spline(tctrl, 6), nt = Ct.length;
  const Wt = Ct.map((_, i) => { const t = i / (nt - 1); return 88 - 62 * Math.pow(t, 0.85); });
  const MT = muscleBody(Ct, Wt, { bulge: 0.2, pinch: 0.1, gain: 3 });
  MT.outline = [...MT.P, add(Ct[nt - 1], mul(MT.T[nt - 1], Wt[nt - 1] * 0.7)), ...MT.Q.slice().reverse()];
  // rig: the trunk in five swinging segments on the hole, then head and jaw; the tail in three on the crack
  const cutsI = [Math.round(n * 0.2), Math.round(n * 0.4), Math.round(n * 0.6), Math.round(n * 0.8)];
  const hinge = hF([[112, 36]])[0];
  f.joint('hole', [300, GY - 8]).joint('seg_1', Cc[2], 'hole');
  cutsI.forEach((ci, k) => f.joint('seg_' + (k + 2), Cc[ci], 'seg_' + (k + 1)));
  f.joint('head', HB, 'seg_5').joint('jaw', hinge, 'head');
  const tcuts = [Math.round(nt * 0.35), Math.round(nt * 0.68)];
  f.joint('crack', [92, GY - 6], 'hole').joint('tail_1', Ct[2], 'crack').joint('tail_2', Ct[tcuts[0]], 'tail_1').joint('tail_3', Ct[tcuts[1]], 'tail_2');

  // ---- the hole: dark water and the far inner wall of the broken ice, its thickness facing us
  f.bone('hole');
  const HC = [300, GY - 6];
  f.part([[150, GY - 6], [176, GY - 34], [250, GY - 50], [360, GY - 52], [440, GY - 34], [470, GY - 8], [440, GY + 6], [170, GY + 6]], X.IC({ fill: '#7f95a7', shadow: '#40566a', shade: 0.2, inkW: 1.4, texOp: 0.6 })); // the far wall
  f.part([[150, GY - 6], [176, GY - 34], [250, GY - 50], [360, GY - 52], [440, GY - 34], [470, GY - 8], [456, GY - 44], [390, GY - 66], [270, GY - 68], [196, GY - 54], [158, GY - 30]], X.IC({ fill: '#e4ecf0', shade: 0.15, inkW: 1.2 })); // its snowy top
  for (let k = 0; k < 3; k++) f.line([[178, GY - 26 + k * 9], [270, GY - 40 + k * 9], [380, GY - 40 + k * 8], [450, GY - 22 + k * 7]], 1.1, '#c8d6e0', { op: 0.5 }); // layers in the broken wall
  f.flat(ell(add(HC, [0, 4]), 150, 18, 0, 28), PAL.sea);
  f.line(ell(add(HC, [0, 2]), 140, 14, 0, 28).slice(15, 27), 1.2, PAL.seaL, { op: 0.7 });
  f.bone('crack'); // the crack behind, where the tail came up
  f.part([[20, GY - 4], [40, GY - 24], [90, GY - 32], [150, GY - 24], [172, GY - 6], [150, GY + 4], [40, GY + 4]], X.IC({ fill: '#7f95a7', shadow: '#40566a', shade: 0.2, inkW: 1.3 }));
  f.flat(ell([96, GY - 2], 66, 8, 0, 20), PAL.sea);

  // ---- the tail
  const tRegions = [['tail_1', side(Ct[tcuts[0]], mul(MT.T[tcuts[0]], -1), Wt[tcuts[0]] / 2 + 46)], ['tail_2', [side(Ct[tcuts[0]], MT.T[tcuts[0]], Wt[tcuts[0]] / 2 + 46), side(Ct[tcuts[1]], mul(MT.T[tcuts[1]], -1), Wt[tcuts[1]] / 2 + 46)]], ['tail_3', side(Ct[tcuts[1]], MT.T[tcuts[1]], Wt[tcuts[1]] / 2 + 46)]];
  split(f, () => {
    // the fin fringe: low along both edges, deepening toward the tip and running round it as one rounded paddle
    const fp = [], fq = [], i0 = 2;
    for (let i = i0; i < nt; i++) { const t = (i - i0) / (nt - 1 - i0), h = 10 + 34 * Math.pow(t, 1.1); fp.push(add(MT.at(i, 1), mul(MT.Nn[i], h * (1 + 0.1 * Math.sin(i * 0.9))))); fq.push(add(MT.at(i, -1), mul(MT.Nn[i], -h * (1 + 0.1 * Math.cos(i * 0.8))))); }
    const tE = Ct[nt - 1], tD = MT.T[nt - 1], tN = MT.Nn[nt - 1], tipR = Wt[nt - 1] / 2 + 42, round = [];
    for (let k = 1; k < 10; k++) { const a = -Math.PI / 2 + Math.PI * k / 10; round.push(add(tE, add(mul(tN, Math.sin(a) * tipR), mul(tD, Math.cos(a) * tipR * 0.85 + 4)))); }
    round.reverse();
    const fin = [MT.at(i0, 0.8), ...fp, ...round, ...fq.slice().reverse(), MT.at(i0, -0.8)];
    f.part(fin, EL({ fill: '#b3c6d4', opacity: 0.8, maxShade: 10, hatch: false, inkW: 1.2 }));
    clipDraw(f, fin, () => {
      for (let i = i0 + 1; i < nt; i += 2) for (const s of [1, -1]) f.line([MT.at(i, s * 0.9), add(MT.at(i, s), mul(MT.Nn[i], s * 44))], 1, '#5f7a90', { op: 0.6 }); // fin rays
      for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + Math.PI * (k + 0.5) / 9; f.line([tE, add(tE, add(mul(tN, Math.sin(a) * tipR * 1.1), mul(tD, Math.cos(a) * tipR)))], 1, '#5f7a90', { op: 0.6 }); }
      f.flat(ell(add(tE, add(mul(tD, 26), mul(tN, -14))), 9, 6, Math.atan2(tD[1], tD[0]), 10), '#4a5e72', { op: 0.7 }); // a torn notch in the fringe
    });
    f.line(fp.filter((_, i) => i % 2 === 0), 1.2, '#eef4f8', { op: 0.5 });
    // the compressed tail itself: deep in side view, the flat of the blade catching the light down its middle
    f.part(MT.outline, EL({ maxShade: 26 }));
    clipDraw(f, MT.outline, () => {
      f.flat([...MT.Q, ...Ct.map((_, i) => MT.at(i, -0.35)).reverse()], backC, { op: 0.55 });
      f.stroke(Ct.slice(1).map((_, i) => MT.at(i + 1, -0.02)), 10, '#eef4f8', { op: 0.4 });
      f.line(Ct.map((_, i) => MT.at(i, 0.14)), 1.2, '#3e5468', { op: 0.5 });
      for (let i = 2; i < nt - 2; i += 3) f.line([MT.at(i, -0.9), add(MT.at(i, 0), mul(MT.T[i], -8)), MT.at(i, 0.9)], 1, '#4f6a80', { op: 0.3 });
      for (let i = 2; i < nt - 2; i++) { const b = MT.bend[i], s = b > 0 ? 1 : -1; if (Math.abs(b) < 0.55 || i % 3) continue; f.line([MT.at(i, s), add(MT.at(i, s * 0.75), mul(MT.T[i], 2)), MT.at(i, s * 0.55)], 1.3, crease, { op: 0.6 }); }
      X.livid(MT.at(Math.round(nt * 0.3), 0.6), 16, 34, 5, 0.4);
      X.frost(MT.at(Math.round(nt * 0.5), 0.2), 24, 50, 8, 1.4);
    });
    X.rime(fp.slice(3, 12).filter((_, i) => i % 2 === 0), 8, 1);
    X.rime(round.slice(4, 9), 7, 1);
    for (let i = 3; i < fq.length; i += 3) if (MT.Nn[i + i0][1] < -0.2) X.icicle(fq[i], 10 + f.r() * 12, 5); else if (MT.Nn[i + i0][1] > 0.2) X.icicle(fp[i], 10 + f.r() * 12, 5);
  }, tRegions);
  f.bone('crack'); // the crack's near lip
  X.slab2([[12, GY - 10], [70, GY - 26], [86, GY + 8], [18, GY + 12]], [8, -8], { step: 34, snow: 7, bubbles: 5, layers: 2, cracks: 1 });
  X.slab2([[118, GY - 16], [176, GY - 34], [190, GY + 6], [126, GY + 12]], [10, -8], { step: 34, snow: 8, bubbles: 5, layers: 2, cracks: 1 });

  // ---- the lower jaw first, behind the cheek, dropped on its hinge
  const jA = 0.5, J = pts => pts.map(p => { const q = add(hinge, rot(sub(hF([p])[0], hinge), jA)); return p[2] ? [...q, 1] : q; });
  f.bone('jaw');
  f.flat(J([[104, 34], [132, 22], [200, 16], [254, 14]]).concat(hF([[256, -2], [200, 8], [150, 14], [112, 22]])), '#1a2230'); // the mouth, riding on the jaw and reaching up past the lip line so no gap opens when it swings
  f.flat(J([[120, 26], [180, 18], [240, 16], [236, 4], [180, 4], [126, 16]]), '#56606e', { op: 0.8 }); // the pale floor of the mouth
  const jaw = J([[86, 30], [120, 24], [170, 22], [222, 22], [262, 20, 1], [272, 30], [264, 44], [236, 52], [190, 56], [140, 60], [104, 60], [82, 48]]);
  f.part(jaw, EL({ fill: mix(sk, bel, 0.4), maxShade: 16 }));
  clipDraw(f, jaw, () => {
    f.line(J([[124, 30], [180, 28], [240, 27], [266, 27]]), 1.8, crease, { op: 0.6 }); // the lower lip fold
    for (let i = 0; i < 6; i++) f.flat(ell(J([[140 + i * 20, 41]])[0], 1.8, 1.8, 0, 6), '#2e4258', { op: 0.75 }); // pores along the jaw
    f.flat(J([[90, 48], [180, 50], [260, 42], [250, 62], [180, 64], [90, 64]]), livid, { op: 0.35 }); // lividity under the jaw
    f.stroke(J([[96, 44], [110, 54], [140, 58]]), 5, crease, { op: 0.4 }); // the jaw's angle
  });
  for (let i = 0; i < 14; i++) { const x = 128 + i * 9.4, l = ((i < 3 ? 8 : 11) + (i % 3) * 4 + (i === 11 ? 7 : 0)) * 0.9, b0 = J([[x, 21]])[0], dd = rot([0, -1], hA + jA - 0.2); f.part([add(b0, rot([-2, 0], hA + jA)), add(b0, rot([2, 0], hA + jA)), [...add(b0, mul(dd, l)), 1]], { fill: '#eef2f2', shadow: '#8a9aa6', shade: 0.25, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); } // needle teeth, raked back
  X.icicles(J([[110, 60], [190, 58], [258, 48]]), 4, 24, 6);

  // ---- the trunk and the skull in one outline (an eel has no neck), cut into five segments and the head
  const headLow = hF([[22, 70], [60, 66], [98, 56], [118, 40], [132, 26], [160, 22], [200, 19], [238, 16], [255, 10], [259, -3, 1], [246, -17], [222, -29], [186, -43], [142, -59], [96, -73], [50, -79], [16, -74]]);
  const outline = [...M.P, ...headLow, ...M.Q.slice().reverse()];
  const regions = [], cut = (i, sgn) => side(Cc[i], mul(T[i], sgn), Wd[i] / 2 + 56);
  regions.push(['seg_1', cut(cutsI[0], -1)]);
  for (let k = 0; k < 3; k++) regions.push(['seg_' + (k + 2), [cut(cutsI[k], 1), cut(cutsI[k + 1], -1)]]);
  regions.push(['seg_5', [cut(cutsI[3], 1), side(HB, mul(Tend, -1), 76)]]);
  regions.push(['head', side(HB, Tend, 76)]);
  split(f, () => {
    // the dorsal fin: a low translucent fringe with rays, rising out of the back behind the head and running down
    // into the water, frozen stiff with a few torn gaps
    const fi1 = Math.round(n * 0.62), fin = [], base = [];
    for (let i = 0; i <= fi1; i++) { const t = i / fi1, h = (36 * Math.pow(1 - t, 0.4) + 3) * (1 + 0.12 * Math.sin(i * 0.55)) * (i % 17 === 9 ? 0.55 : 1); base.push(at(i, -0.8)); fin.push(add(M.Q[i], mul(Nn[i], -h))); }
    const finP = [...base, ...fin.slice().reverse()];
    f.part(finP, EL({ fill: '#adc1d0', opacity: 0.8, maxShade: 10, hatch: false, inkW: 1.2 }));
    clipDraw(f, finP, () => { for (let i = 1; i < fi1; i += 2) f.line([at(i, -0.86), add(M.Q[i], mul(add(mul(Nn[i], -1), mul(T[i], 0.25)), 40))], 1, '#5f7a90', { op: 0.6 }); });
    f.line(fin.filter((_, i) => i % 2 === 0), 1.1, '#eef4f8', { op: 0.5 });
    X.rime(fin.slice(Math.round(fin.length * 0.5), Math.round(fin.length * 0.7)).filter((_, i) => i % 3 === 0), 8, -1);
    // the body
    f.part(outline, EL());
    clipDraw(f, outline, () => {
      // countershading: a darker grey-blue back and crown, a drowned-pale belly and throat
      f.flat([...M.Q, ...hF([[16, -84], [96, -84], [200, -50], [262, -10], [250, -4], [190, -28], [100, -46], [10, -44]]), ...Cc.map((_, i) => at(i, -0.3)).reverse()], backC, { op: 0.6 });
      f.flat([...M.P, ...hF([[30, 80], [110, 60], [110, 46], [30, 50]]), ...Cc.map((_, i) => at(i, 0.5)).reverse()], bel, { op: 0.7 });
      // translucency: the spine and pin bones and the gut shadowed through the skin
      f.flat([...Cc.map((_, i) => at(i, -0.5)), ...Cc.map((_, i) => at(i, 0.12)).reverse()], '#6f8aa2', { op: 0.16 });
      f.line(Cc.slice(1, -1).map((_, i) => at(i + 1, -0.34)), 6, '#7590a6', { op: 0.42 });
      for (let i = 2; i < n - 2; i += 3) { f.line([at(i, -0.44), at(i, -0.24)], 1.5, '#6f8aa0', { op: 0.45 }); f.line([at(i, -0.34), add(at(i, 0.1), mul(T[i], -14))], 1, '#7f98ac', { op: 0.3 }); }
      const gut = []; for (let i = 2; i < Math.round(n * 0.5); i++) gut.push(at(i, 0.3 + 0.05 * Math.sin(i * 0.5)));
      f.stroke(gut, 34, '#3e5872', { op: 0.22 });
      // muscle: faint myomeres; the stretched outside of each bend lit as a long highlight; the inside packed into
      // skin creases, deepest where the bend is tightest
      for (let i = 3; i < n - 3; i += 5) f.line([add(at(i, -0.95), mul(T[i], -5)), at(i, -0.5), add(at(i, -0.05), mul(T[i], -10)), at(i, 0.45), add(at(i, 0.95), mul(T[i], -5))], 1, '#4f6a80', { op: 0.26 });
      for (let i = 3; i < n - 3; i++) {
        const b = bs[i], s = b > 0 ? 1 : -1, ab = Math.abs(b);
        if (ab < 0.5 || i % 3) continue;
        const L0 = at(i, s * 1.04), L1 = at(i, s * (0.72 - ab * 0.22)), mid = add(lerp(L0, L1, 0.5), mul(T[i], 3));
        f.line([L0, mid, L1], 1.6, crease, { op: 0.35 + ab * 0.35 }); f.line([add(L0, mul(T[i], 4)), add(lerp(L0, L1, 0.5), mul(T[i], 6))], 1.1, skL, { op: 0.5 });
      }
      let run = [], side0 = 0; const flushH = () => { if (run.length > 5) { f.stroke(run, 22, skL, { op: 0.3 }); f.stroke(run, 6, '#ffffff', { op: 0.28 }); } run = []; };
      for (let i = 2; i < n - 2; i++) { const s = bs[i] > 0 ? -1 : 1; if (Math.abs(bs[i]) > 0.4 && s === side0) run.push(at(i, s * 0.66)); else { flushH(); side0 = s; if (Math.abs(bs[i]) > 0.4) run.push(at(i, s * 0.66)); } } flushH();
      // lateral line with its pores, lividity pooled low in the belly, frost bloom, old scars, a frost crack
      f.line(Cc.slice(1, -2).map((_, i) => at(i + 1, 0.08)), 1.4, '#3e5872', { op: 0.45 });
      for (let i = 1; i < n - 1; i += 3) f.flat(ell(at(i, 0.08), 1.6, 1.6, 0, 6), '#2e4258', { op: 0.6 });
      for (const tt of [0.1, 0.25, 0.42]) X.livid(at(Math.round(n * tt), 0.68), 26, 34, 7, 0.38);
      X.frost(at(Math.round(n * 0.3), 0.55), 40, 120, 20, 1.6); X.frost(at(Math.round(n * 0.8), -0.2), 50, 50, 10, 1.5);
      X.scars(at(Math.round(n * 0.5), -0.1), 30, 40, 3, 1.3, '#eef4f8');
      X.cracks(at(Math.round(n * 0.62), 0.5), 24, 3, 0.8);
      // the skull: its own light (the trunk's cel shadow is too deep for the narrower head), then the jaw muscle
      // swelling the cheek behind the eye, lit, with a crease under it and behind it
      f.flat(hF([[20, -90], [140, -70], [270, -14], [262, 8], [200, 14], [132, 20], [100, 30], [40, 34], [20, 0]]), sk, { op: 0.62 });
      f.flat(hF([[20, 46], [98, 50], [118, 36], [132, 24], [200, 18], [262, 10], [262, 22], [130, 34], [100, 62], [20, 74]]), skS, { op: 0.25 });
      const cheek = hF([[60, -48], [112, -50], [150, -26], [146, 4], [118, 22], [76, 22], [50, -8]]);
      f.flat(cheek, skL, { op: 0.28 }); f.flat(hF([[70, -40], [112, -42], [140, -22], [120, -10], [80, -18]]), '#ffffff', { op: 0.18 });
      f.stroke(hF([[54, 32], [92, 36], [126, 30]]), 7, crease, { op: 0.45 });
      f.stroke(hF([[42, -44], [32, -6], [44, 30]]), 7, crease, { op: 0.42 });
      f.line(hF([[70, -44], [110, -46], [142, -26]]), 2.6, skL, { op: 0.75 });
      f.stroke(hF([[130, 18], [180, 14], [224, 9], [250, 4]]), 5, crease, { op: 0.5 }); // the upper lip fold
      for (let i = 0; i < 6; i++) f.flat(ell(hF([[140 + i * 19, 6 - i * 1.2]])[0], 1.8, 1.8, 0, 6), '#2e4258', { op: 0.75 }); // pores
      f.line(hF([[0, -10], [50, -22], [110, -18], [170, -8]]), 2.4, '#7f98ac', { op: 0.3 }); // the skull bones faint through the skin
      f.flat(hF([[20, 36], [70, 44], [96, 60], [20, 72]]), livid, { op: 0.3 });
      X.frost(hF([[120, -44]])[0], 50, 12, 8, 1.4);
    });
    // rime where the wind hits: the +x flank (P side) and the up-facing back and crown (Q side)
    const runs = (pick, sd) => { let r = []; const fl = () => { if (r.length > 4) X.rime(r.filter((_, k) => k % 2 === 0), 11, sd); r = []; }; for (let i = 2; i < n - 1; i++) { if (pick(i)) r.push(sd > 0 ? M.P[i] : M.Q[i]); else fl(); } fl(); };
    runs(i => Nn[i][0] > 0.6 && i > n * 0.1, 1);
    runs(i => Nn[i][1] > 0.55, -1);
    X.rime(hF([[16, -76], [50, -80], [96, -74], [142, -60], [186, -44], [222, -30], [250, -14]]), 13, -1);
    // icicles hung plumb wherever the belly faces down
    for (let i = 2; i < n - 2; i += 4) if (Nn[i][1] > 0.4) X.icicle(add(M.P[i], [0, -2]), 14 + f.r() * 22, 8);
  }, regions);

  // ---- head details over the outline: upper teeth, the eye, nostrils, gill slit and pectoral fin
  f.bone('head');
  for (let i = 0; i < 13; i++) { const x = 136 + i * 9, l = (10 + (i % 3) * 5 + (i === 9 ? 6 : 0)) * 0.9, b0 = hF([[x, 21 - i * 0.55]])[0], dd = rot([0, 1], hA + 0.2); f.part([add(b0, rot([-2, 0], hA)), add(b0, rot([2, 0], hA)), [...add(b0, mul(dd, l)), 1]], { fill: '#eef2f2', shadow: '#8a9aa6', shade: 0.25, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); }
  const ec = hF([[188, -30]])[0];
  f.flat(ell(ec, 12, 8.5, hA, 12), '#2a3848', { op: 0.85 });
  f.flat(ell(add(ec, [1, 0.5]), 8.5, 5.6, hA, 12), '#b8c6ce');
  f.flat(ell(add(ec, [2.5, 0.5]), 3.4, 3.2, 0, 8), '#4a5a6a', { op: 0.75 });
  f.flat(ell(add(ec, [4, -2]), 1.3, 1.1, 0, 6), '#f4f8fa');
  f.stroke([add(ec, rot([-15, -3], hA)), add(ec, rot([0, -10], hA)), add(ec, rot([14, -5], hA))], 4.4, '#223040');
  f.line([add(ec, rot([-11, 7], hA)), add(ec, rot([8, 8], hA))], 1.4, '#3a4a5c', { op: 0.6 });
  X.frost(add(ec, [0, -9]), 9, 2, 3, 1);
  f.line(hF([[214, -22], [222, -20]]), 2.6, '#1a2230');
  const nt0 = hF([[244, -12]])[0], nt1 = add(nt0, rot([11, 5], hA));
  f.line([nt0, nt1], 6, INK); f.line([nt0, nt1], 3.6, mix(sk, skS, 0.3)); f.flat(ell(nt1, 1.6, 1.6, 0, 6), '#0c1016');
  f.stroke(hF([[-4, 28], [-12, 44], [-6, 60]]), 4, crease, { op: 0.8 }); // gill slit
  const pf = hF([[-4, 40], [-22, 34], [-58, 42], [-80, 58], [-80, 70], [-62, 78], [-26, 62]]);
  f.part(pf, EL({ fill: '#b3c6d4', opacity: 0.85, maxShade: 8, hatch: false }));
  for (let i = 0; i < 6; i++) { const a = -0.45 + i * 0.22; f.line([hF([[-8, 46]])[0], hF([[-8 - 74 * Math.cos(a), 46 + 74 * Math.sin(a) * 0.5 + i * 3]])[0]], 1, '#4f6a80', { op: 0.7 }); }
  X.icicles(hF([[40, 70], [100, 56]]), 3, 22, 6);
  X.glaze(hF([[60, -62], [200, -42], [250, -12], [200, 8], [80, 8]]), 0.14);

  // ---- the near lip of the hole: thick broken ice over the trunk's base, slabs heaved up round it
  f.bone('hole');
  X.slab2([[160, GY - 12], [230, GY - 26], [298, GY - 18], [306, GY + 14], [168, GY + 16]], [0, -10], { step: 50, snow: 10, bubbles: 8, layers: 2, cracks: 2, edge: '#8aa0b2' });
  X.slab2([[330, GY - 20], [400, GY - 30], [470, GY - 14], [462, GY + 16], [338, GY + 16]], [0, -10], { step: 50, snow: 10, bubbles: 8, layers: 2, cracks: 2, edge: '#8aa0b2' });
  X.slab2([[438, GY - 56], [500, GY - 92], [540, GY - 28], [490, GY + 6]], [16, -12], { step: 40, snow: 12, bubbles: 8, layers: 3, cracks: 2 });
  X.slab2([[200, GY - 34], [238, GY - 62], [270, GY - 8], [224, GY + 12]], [-10, -12], { step: 36, snow: 9, bubbles: 6, layers: 2, cracks: 2 });
  X.icicles([[306, GY + 14], [338, GY + 16]], 2, 12, 5);
  f.bone('root');
  X.floe([330, GY + 18], 400, 14);
  return f;
}

// ------------------------------------------------------------------ RIME GULLS (Small, a flock about 0.6 across)
// Four gulls that froze with the fleet and thawed first: frost-stiffened ragged feathers, rime crusted along the leading
// edges, ice clotted on the black wingtips, icicles hanging plumb off trailing edges. One stoops in a pecking dive with
// the bill open, one is on the upstroke, one on the downstroke, one far behind gliding. One bone per bird, plus a bone
// per wing so each can beat.
function rimeGulls() {
  const GY = TIERS.small[1] - 30;
  const f = new Fig(foeBase(704, Object.assign({}, WORLD, { groundY: GY, grimeY: null })));
  const X = fx(f, 0.8);
  const white = '#e4e9ec', whiteS = '#7d8a98', mantle = '#8d9ca8', mantleS = '#3e4a58', tipC = '#17191d', bill = '#b9b6aa', foot = '#7a8a98';
  const birds = [
    { k: 'gull_4', c: [204, 600], a: 0.1, s: 42, wing: 'glide', far: true },
    { k: 'gull_3', c: [396, 368], a: -0.2, s: 50, wing: 'down' },
    { k: 'gull_2', c: [236, 446], a: -0.06, s: 58, wing: 'up' },
    { k: 'gull_1', c: [396, 566], a: 0.58, s: 60, wing: 'dive', open: true },
  ];
  // the flock spread to about 0.6 of a human across, each bird a little larger so it reads at game size
  for (const b of birds) { b.c = add([300, 470], mul(sub(b.c, [300, 470]), 1.12)); b.s *= 1.2; }
  f.joint('flock', [300, 470]);
  for (const b of birds) { const F = frame(b.c, b.a, b.s); b.F = F; b.sh = F([[0.18, -0.12]])[0]; f.joint(b.k, b.c, 'flock').joint(b.k + '_wing_f', b.sh, b.k).joint(b.k + '_wing_n', F([[0.12, -0.08]])[0], b.k); }
  // one wing as a single outline: leading edge shoulder -> wrist -> tip, the primaries splayed into fingers at the tip,
  // a scalloped secondary edge back to the body. Detail is drawn inside it: covert rows, the black tip, white mirrors,
  // a dropped feather, frost-stiffened coverts, rime along the leading edge, ice and icicles at the fingers.
  const wing = (S, Wr, Tp, back, c, dim, seed) => {
    const hd = E.norm(sub(Tp, Wr)), lead = [S, add(lerp(S, Wr, 0.5), mul(back, -c * 0.08)), Wr, add(lerp(Wr, Tp, 0.5), mul(back, -c * 0.05))];
    const fingers = [];
    for (let k = 0; k < 5; k++) { if (k === 2 && seed % 2) continue; const base = add(lerp(Wr, Tp, 0.55 - k * 0.1), mul(back, c * 0.25)), tip = add(add(Tp, mul(hd, -k * c * 0.3)), mul(back, k * c * 0.3)); fingers.push([...tip, 1], add(lerp(base, tip, 0.55), mul(back, c * 0.12))); }
    const trail = []; for (let k = 0; k <= 6; k++) { const q = add(lerp(Wr, S, k / 6), mul(back, c * (0.9 + k * 0.07))); trail.push(k % 2 ? add(q, mul(back, -c * 0.12)) : [...q, 1]); }
    const out = [...lead, ...fingers, ...trail];
    const col = dim ? mix(mantle, '#000', 0.12) : mantle;
    f.part(out, { fill: col, shadow: mantleS, tex: X.hoar, texOp: 0.25, shade: 0.3, maxShade: 10, inkW: 1.2, inkHeavy: 2, cast: false, k: 0.9 });
    clipDraw(f, out, () => {
      // black outer hand with white mirrors
      const bt = [add(lerp(Wr, Tp, 0.45), mul(back, -c)), add(Tp, mul(hd, c)), add(add(Tp, mul(hd, c)), mul(back, c * 2.5)), add(lerp(Wr, Tp, 0.3), mul(back, c * 2.5))];
      f.flat(bt, tipC);
      for (let k = 0; k < 3; k++) f.flat(ell(add(add(Tp, mul(hd, -k * c * 0.3 - c * 0.18)), mul(back, k * c * 0.3 + c * 0.04)), c * 0.07, c * 0.06, 0, 6), '#e4e8ea');
      for (let k = 0; k < 5; k++) f.line([add(lerp(Wr, Tp, 0.5 - k * 0.1), mul(back, c * 0.2)), add(add(Tp, mul(hd, -k * c * 0.3)), mul(back, k * c * 0.3))], 0.9, k % 2 ? '#5a6068' : INK, { op: 0.7 }); // primary shafts
      for (let r = 1; r <= 3; r++) { const pts = []; for (let k = 0; k <= 8; k++) pts.push(add(lerp(S, lerp(Wr, Tp, 0.3), k / 8), mul(back, c * 0.2 * r + (k % 2) * 2))); f.line(pts, r === 3 ? 1.4 : 0.9, mantleS, { op: 0.7 }); } // covert rows
      for (let k = 0; k < 6; k++) f.line([add(lerp(S, Wr, k / 6), mul(back, c * 0.62)), add(lerp(S, Wr, k / 6 + 0.04), mul(back, c * 1.0))], 0.8, mantleS, { op: 0.6 }); // secondary separations
      f.stroke(trail.filter((_, k) => k % 2 === 0).map(q => add(q, mul(back, -c * 0.07))), c * 0.12, '#e8ecee', { op: 0.75 }); // white trailing edge
    });
    f.stroke(lead.slice(0, 3), c * 0.11, '#eef2f4', { op: 0.6 }); // white leading edge
    X.rime(lead.slice(0, 3), c * 0.16, -Math.sign(sub(Wr, S)[0] * back[1] - sub(Wr, S)[1] * back[0]) || -1);
    for (let k = 0; k < 2; k++) { const q = add(lerp(S, Wr, 0.3 + k * 0.3), mul(back, c * 0.4)); f.stroke([q, add(q, mul(rot(back, -0.7), c * 0.34))], c * 0.09, col); f.line([q, add(q, mul(rot(back, -0.7), c * 0.34))], 0.8, INK, { op: 0.5 }); } // frost-stiffened coverts standing out of line
    for (let k = 0; k < fingers.length; k += 4) { const t = fingers[k]; f.part(ell(t, c * 0.1, c * 0.08, 0, 8), X.IC({ fill: '#dce5ea', inkW: 0.8, inkHeavy: 1 })); X.icicle(add(t, [0, c * 0.06]), c * (0.15 + f.r() * 0.2), 3); }
    X.icicle(add(trail[2], [0, 1]), c * 0.18, 3); X.icicle(add(trail[5], [0, 1]), c * 0.12, 3);
  };
  for (const b of birds) {
    const F = b.F, sc = b.s, dim = !!b.far;
    const WL = (o = {}) => Object.assign({ fill: dim ? mix(white, '#8a96a2', 0.2) : white, shadow: whiteS, tex: X.hoar, texOp: 0.3, shade: 0.34, maxShade: 18 }, o);
    // wing geometry per pose (local units, then to screen)
    const P = {
      up: { f: [[-0.1, -0.24], [-0.7, -1.0], [-1.7, -1.9]], n: [[0.16, -0.2], [0.24, -1.25], [-0.25, -2.6]], back: [-1, 0.2] },
      down: { f: [[0.0, -0.22], [0.0, -1.0], [-0.7, -1.8]], n: [[0.16, -0.1], [0.4, 0.95], [0.0, 2.3]], back: [-1, -0.25] },
      glide: { f: [[0.0, -0.24], [-0.24, -0.85], [-1.1, -1.5]], n: [[0.16, -0.1], [0.32, 0.7], [-0.3, 1.9]], back: [-1, 0.0] },
      dive: { f: [[0.0, -0.24], [-0.45, -0.85], [-2.0, -1.15]], n: [[0.16, -0.2], [-0.25, -0.7], [-1.8, -0.85]], back: [-0.35, 1] },
    }[b.wing];
    const back = E.norm(rot(P.back, b.a)), chord = sc * 0.64;
    f.bone(b.k + '_wing_f');
    wing(...F(P.f), b.wing === 'down' ? E.norm(rot([-1, 0.3], b.a)) : back, chord * 0.9, true, 1);
    // ---- body, tail, tucked feet
    f.bone(b.k);
    if (!b.open) { const ft = F([[-0.38, 0.2]])[0]; f.part([ft, add(ft, rot([-sc * 0.5, sc * 0.08], b.a)), add(ft, rot([-sc * 0.56, sc * 0.2], b.a)), add(ft, rot([-sc * 0.1, sc * 0.16], b.a))], { fill: foot, shade: 0.3, inkW: 1, inkHeavy: 1.3, cast: false }); }
    else for (const dx of [0, 0.12]) { const hip = F([[0.1 + dx, 0.2]])[0], ank = F([[0.42 + dx, 0.55]])[0]; f.line([hip, ank], sc * 0.09, foot); f.part([ank, add(ank, rot([sc * 0.36, -sc * 0.1], b.a)), add(ank, rot([sc * 0.4, sc * 0.08], b.a)), add(ank, rot([sc * 0.06, sc * 0.12], b.a))], { fill: foot, shade: 0.3, inkW: 1, inkHeavy: 1.3, cast: false }); f.line([add(ank, rot([sc * 0.36, -sc * 0.1], b.a)), add(ank, rot([sc * 0.42, -sc * 0.04], b.a))], 1.6, INK); } // feet thrown forward in the stoop
    const tail = F([[-0.6, -0.14], [-0.98, -0.13], [-1.06, -0.08], [-1.08, 0.0, 1], [-1.04, 0.06], [-0.96, 0.1], [-0.6, 0.1]]);
    f.part(tail, WL({ maxShade: 6 }));
    for (let k = 0; k < 4; k++) f.line(F([[-0.66, -0.08 + k * 0.05], [-1.02, -0.1 + k * 0.05]]), 0.8, whiteS, { op: 0.6 });
    const body = F([[0.62, -0.08], [0.48, -0.26], [0.26, -0.35], [-0.02, -0.34], [-0.32, -0.27], [-0.62, -0.15], [-0.72, -0.02], [-0.6, 0.14], [-0.3, 0.28], [0.04, 0.34], [0.34, 0.3], [0.54, 0.16]]);
    f.part(body, WL());
    f.part(F([[0.42, -0.26], [0.1, -0.33], [-0.3, -0.26], [-0.62, -0.15], [-0.4, -0.12], [0.0, -0.18], [0.3, -0.16]]), WL({ fill: dim ? mix(mantle, '#000', 0.12) : mantle, shadow: mantleS, maxShade: 4, inkW: 1 })); // grey mantle on the back
    for (let k = 0; k < 5; k++) { const q = F([[0.3 - k * 0.15, 0.12 + (k % 2) * 0.06]])[0]; f.line([q, add(q, rot([-sc * 0.14, sc * 0.03], b.a))], 0.9, whiteS, { op: 0.6 }); } // breast feather edges
    for (let k = 0; k < 3; k++) { const q = F([[0.1 - k * 0.2, -0.3]])[0]; f.stroke([q, add(q, rot([-sc * 0.12, -sc * 0.16], b.a))], 2.4, white); f.line([q, add(q, rot([-sc * 0.12, -sc * 0.16], b.a))], 0.8, INK, { op: 0.5 }); } // frozen feathers standing up
    X.frost(F([[0.0, 0.0]])[0], sc * 0.5, sc * 0.2, 4, 1.1);
    X.icicles([F([[0.3, 0.27]])[0], F([[-0.2, 0.24]])[0]], 2, sc * 0.3, 3.4);
    // ---- head and bill
    const head = F([[0.48, -0.2], [0.54, -0.4], [0.7, -0.48], [0.9, -0.46], [1.0, -0.32], [0.99, -0.13], [0.85, -0.02], [0.6, 0.04]]);
    f.part(head, WL({ maxShade: 8 }));
    f.flat(F([[0.6, -0.3], [0.7, -0.36], [0.66, -0.24]]), whiteS, { op: 0.3 }); // winter streaking behind the eye
    const gape = b.open ? 0.22 : 0.0;
    const upper = F([[0.94, -0.31], [1.2, -0.3], [1.44, -0.27], [1.54, -0.2], [1.5, -0.13], [1.42, -0.2], [0.96, -0.17]]);
    const lowF = frame(F([[0.96, -0.17]])[0], b.a + gape, sc);
    const lower = lowF([[0.0, 0.0], [0.4, -0.01], [0.46, 0.05], [0.4, 0.08], [0.04, 0.06]]);
    f.part(lower, { fill: mix(bill, '#000', 0.08), shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false });
    f.flat(lowF([[0.38, 0.0], [0.44, 0.03], [0.4, 0.06]]), '#3a3a3e'); // dark gonys spot (red in life; grey here)
    f.part(upper, { fill: bill, shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false });
    f.line(F([[1.02, -0.26], [1.08, -0.255]]), 1.4, '#2a2a2e'); // nostril
    if (b.open) { f.flat([F([[0.98, -0.17]])[0], F([[1.42, -0.19]])[0], lowF([[0.4, 0.02]])[0]], '#2a2a34'); X.icicle(lowF([[0.12, 0.06]])[0], 8, 3); }
    else X.icicle(F([[1.0, -0.12]])[0], 8, 3);
    const ec = F([[0.8, -0.27]])[0];
    f.flat(ell(ec, sc * 0.06, sc * 0.055, 0, 8), '#3a4048'); // orbital ring
    f.flat(ell(ec, sc * 0.042, sc * 0.04, 0, 8), '#c4c6be'); f.flat(ell(add(ec, [sc * 0.008, 0]), sc * 0.02, sc * 0.02, 0, 6), '#101014');
    f.stroke([add(ec, rot([-sc * 0.08, -sc * 0.04], b.a)), add(ec, rot([sc * 0.08, -sc * 0.06], b.a))], 2, '#2a3038'); // brow ridge: a hard, mean look
    X.rime([F([[0.7, -0.46]])[0], F([[0.88, -0.44]])[0], F([[0.98, -0.31]])[0]], sc * 0.08, -1);
    // ---- near wing in front
    f.bone(b.k + '_wing_n');
    wing(...F(P.n), back, chord, dim, 2 + birds.indexOf(b));
  }
  return f;
}

// ------------------------------------------------------------------ THE ICE-WED CAPTAIN (Elite 2.0)
// The fleet's admiral at the frozen wheel, upright and proud, chest out, chin up: the far hand on a spoke handle with
// the ring of ice on it, the near hand holding the drawn sabre forward and down at the heroes, its blade one long
// faceted icicle. Long naval coat stiff with ice, tails frozen mid-swing; epaulettes crusted white; boots frozen to the
// deck. From the tricorn hangs a bridal veil of frozen sea-spray, billowing back and stopped there.
// Authored in human space (ground 790, ~640 tall) and mapped onto the elite canvas at 2.0 by kit_VII.space.
function iceWedCaptain() {
  const [Wc, Hc] = TIERS.elite, GY = Hc - 30;
  const { Z, ZZ, W } = space(2.0, 560, GY);
  const f = new Fig(foeBase(701, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 660])[1] })));
  const X = fx(f, 1.6);
  const H = 100;
  const nv = PAL.navy, nvD = PAL.navyD, nvL = PAL.navyL, skin = '#c2cace', skinS = PAL.skinS, boot = '#18191d';
  const NV = (o = {}) => Object.assign({ fill: nv, shadow: '#14171f', tex: 'weave701', texOp: 0.4, light: nvL, maxShade: 60 }, o);
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle701', texOp: 0.5 }, o);
  const N = Z([294, 268]), C = Z([302, 364]), P = Z([288, 468]);
  const S = B.spine(N, C, P, W(H));
  const up = E.norm(sub(N, C));
  const hA = -0.1, HC = add(N, add(mul(up, W(62)), W2([8, 0]))), hF = frame(HC, hA, W(H));
  function W2(v) { return [W(v[0]), W(v[1])]; }
  // the wheel: seen three-quarter, its axle pointing along his facing, so it shows as a tall narrow ellipse
  const WC = Z([452, 420]), wrx = W(58), wry = W(146);
  const rimAt = th => add(WC, [wrx * Math.cos(th), wry * Math.sin(th)]), radial = th => E.norm([wrx * Math.cos(th), wry * Math.sin(th)]);
  const thG = deg(-160), gripP = rimAt(thG), rimTan = E.norm([-wrx * Math.sin(thG), wry * Math.cos(thG)]), gAng = Math.atan2(rimTan[1], rimTan[0]); // he holds the rim itself on his side of the wheel, at chest height
  const SF = S.at(0.42, 0.1), WF = gripP, EF = add(WF, W2([-100, 8])); // the forearm level, square to the rim
  const SN = S.at(-0.34, 0.13), EN = Z([248, 392]), WN = Z([318, 444]);
  const HN = S.at(-0.3, 1.0), KN = Z([262, 614]), AN = Z([238, 752]);
  const HF = S.at(0.34, 1.0), KF = Z([336, 612]), AF = Z([362, 752]);
  const sA = Math.atan2(WN[1] - EN[1], WN[0] - EN[0]) - 0.12; // sabre continues the forearm, wrist turned down a little
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('sabre', WN, 'hand_n').joint('veil', hF([[-0.6, -0.5]])[0], 'head').joint('coat_tails', S.at(-0.2, 0.86), 'pelvis').joint('wheel', Z([452, 790]), null).joint('wheel_rim', WC, 'wheel').joint('scabbard', S.at(-0.5, 0.9), 'pelvis');

  // ---- the veil of frozen sea-spray, behind everything: lace gathered at the back of the tricorn and hanging heavy down
  // his back to the knee, swung back and stopped there; it falls in uneven folds that fan out from the gather, its back
  // edge rippling over the fold ridges, its hem dragged into hard points by clumps of ice; translucent
  f.bone('veil');
  const vA = hF([[-0.6, -0.5]])[0], V = v => add(vA, W2(v));
  // fold ridges: gathered within a few units at the hat, fanning to the hem and curving back as it swings
  const NF = 7, ridge = k => { const t = k / (NF - 1), xa = 4 - t * 26, xb = -18 - t * 132; return [V([xa, 4]), V([xa + (xb - xa) * 0.3 - 6, 110]), V([xa + (xb - xa) * 0.62 - 12, 250]), V([xb - 6, 380]), V([xb, 430 + (k % 2 ? -18 : 6)])]; };
  const R = []; for (let k = 0; k < NF; k++) R.push(ridge(k));
  const edgeB = [V([-18, -14]), V([-34, 10]), ...[1, 2, 3].map(j => add(R[NF - 1][j], W2([-10 - (j % 2) * 8, 0])))];
  const hemPts = []; for (let k = NF - 1; k >= 0; k--) { hemPts.push([...R[k][4], 1]); if (k > 0) hemPts.push(lerp(R[k][4], R[k - 1][4], 0.5).map((v, j) => j ? v - W(20) : v)); }
  const veil = [V([12, -6]), ...edgeB, ...hemPts, R[0][3], R[0][2], R[0][1]];
  f.part(veil, X.IC({ fill: '#d2dce3', opacity: 0.74, shade: 0.35, maxShade: 26, inkW: 1.4, inkHeavy: 2.2, tex: X.hoar, texOp: 0.35 }));
  clipDraw(f, veil, () => {
    // the lace: a fine net, rose motifs in rows, holes torn through it
    for (let i = 0; i < 16; i++) { const t = i / 15; f.line([V([4 - t * 26, 0]), V([-8 - t * 50, 120]), V([-12 - t * 90, 260]), V([-18 - t * 136, 440])], 1, '#8a9cab', { op: 0.4, dash: '3 4' }); }
    for (let i = 0; i < 12; i++) { const pts = []; for (let k = 0; k <= 8; k++) pts.push(V([-160 + k * 22 + i * 3, 30 + i * 34 + Math.sin(k * 1.3 + i) * 5])); f.line(pts, 0.9, '#8a9cab', { op: 0.36, dash: '2 4' }); }
    for (let i = 0; i < 8; i++) { const c0 = V([-24 - (i % 3) * 34 - Math.floor(i / 3) * 12, 110 + Math.floor(i / 3) * 110 + (i % 3) * 14]); f.line(ell(c0, W(8), W(6), 0, 10).concat([ell(c0, W(8), W(6), 0, 10)[0]]), 1.2, '#7a8ea0', { op: 0.55 }); f.flat(ell(c0, W(3), W(2.4), 0, 8), '#7a8ea0', { op: 0.45 }); }
    for (let i = 0; i < 26; i++) { const q = V([-130 + f.r() * 120, 40 + f.r() * 360]); f.flat(ell(q, 1.4 + f.r() * 2, 1.2 + f.r() * 1.6, 0, 6), '#6a7e90', { op: 0.5 }); }
    for (const [q, r] of [[[-64, 290], 9], [[-104, 200], 6]]) { f.flat(ell(V(q), W(r), W(r * 0.8), 0, 10), '#38404c', { op: 0.5 }); f.line(ell(V(q), W(r), W(r * 0.8), 0, 10).slice(0, 7), 1.1, '#e8f0f4', { op: 0.6 }); }
    // the folds: the shadowed side of each fold a wedge from the gather to the hem, uneven in depth; each ridge lit
    for (let k = 0; k < NF - 1; k++) { const dep = [0.5, 0.22, 0.45, 0.3, 0.55, 0.25][k], A = R[k], Bq = R[k + 1], mid = A.map((q, j) => lerp(q, Bq[j], 0.55)); f.flat([...A, ...mid.slice().reverse()], '#4e6476', { op: dep }); f.stroke(Bq.slice(0, 4).map(q => add(q, W2([3, 0]))), W(6), '#f4f8fa', { op: 0.5 }); }
    f.flat([V([-170, 370]), V([20, 370]), V([20, 470]), V([-170, 470])], '#9fb1bf', { op: 0.3 }); // the hem soaked and frozen heavy
  });
  // the hem: a hard frozen edge pulled into points by clumps of ice, icicles hung plumb from them
  f.line(hemPts, W(2.6), '#8a9cab', { op: 0.9 });
  for (let k = 0; k < NF; k += 2) { const q = R[k][4]; f.part(ell(q, W(9), W(6), 0, 10), X.IC({ fill: '#e4ecf0', inkW: 1.1, inkHeavy: 1.6 })); X.icicle(add(q, [0, W(4)]), W(20 + (k % 3) * 6), 8); }
  for (let k = 1; k < NF; k += 2) X.icicle(add(R[k][4], [0, W(1)]), W(12), 6);
  X.rime([V([-18, -14]), V([-34, 10]), edgeB[2]], 10, -1); // rime where the wind hits the top of it

  // ---- far arm reaching to the wheel (behind the torso)
  const [cUF, cFF] = jcut(SF, EF, WF, W(18));
  split(f, () => {
    f.part(jointLimb(SF, EF, lerp(EF, WF, 0.84), [W(50), W(40), W(36)], { point: 0.3, mus0: 0.12, mus1: 0.12 }), NV({ fill: nvD }));
    creases(f, EF, Math.atan2(WF[1] - SF[1], WF[0] - SF[0]) + 1.5, W(24), 3, '#0c0e14', 0.7);
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('forearm_f');
  f.part(plate(EF, WF, 0.5, 0.86, W(44), W(48), { bow: 4 }), NV({ fill: nvL, inkW: 1.4 })); // turned-back cuff
  for (let i = 0; i < 3; i++) f.rivet(lp(EF, WF, 0.6 + i * 0.08, W(14)), 4, PAL.pewter);

  // ---- legs: breeches into tall boots, frozen to the deck
  const leg = (Hh, Kk, Aa, b1, b2, b3) => {
    const [c1, c2] = jcut(Hh, Kk, Aa, W(24));
    split(f, () => { f.part(jointLimb(Hh, Kk, Aa, [W(66), W(50), W(36)], { point: 0.1, mus0: 0.1, mus1: 0.16 }), { fill: '#a4aaae', shadow: '#40464e', tex: 'weave701', texOp: 0.4, maxShade: 30 }); creases(f, Kk, Math.atan2(Aa[1] - Hh[1], Aa[0] - Hh[0]) + 1.57, W(20), 3, '#2a2e36', 0.6); }, [[b1, c1], [b2, c2]]);
    split(f, () => B.boot(f, Aa, 1, W(56), boot, { tex: 'mottle701', shaft: 1.5, strap: true }), [[b2, side(Aa, [0.2, -1], W(16))], [b3, side(Aa, [-0.2, 1], W(16))]]);
    f.bone(b2); f.part([lp(Hh, Kk, 0.92, -W(26)), lp(Hh, Kk, 0.92, W(26)), lp(Kk, Aa, 0.1, W(24)), lp(Kk, Aa, 0.1, -W(24))], { fill: '#5a6068', shade: 0.4, inkW: 1.2, cast: false, sharp: true }); f.rivet(lp(Kk, Aa, 0.03, W(14)), 4, PAL.pewter); // buckled knee band
    X.rime([lp(Kk, Aa, 0.45, W(22)), lp(Kk, Aa, 0.9, W(24))], 12, 1); f.line([lp(Kk, Aa, 0.25, -W(8)), lp(Kk, Aa, 0.8, -W(6))], 2, '#4a4e56', { op: 0.6 });
  };
  leg(HF, KF, AF, 'thigh_f', 'shin_f', 'foot_f');
  leg(HN, KN, AN, 'thigh_n', 'shin_n', 'foot_n');

  // ---- coat tails behind and around the legs, frozen mid-swing back
  f.bone('coat_tails');
  const tails = [S.at(-0.86, 0.78), S.at(0.8, 0.78), S.at(0.86, 0.96), Z([382, 566]), Z([390, 652, 1]), Z([352, 658]), Z([322, 640]), Z([300, 590]), Z([268, 640]), Z([220, 664], 1), Z([150, 680], 1), Z([120, 650]), Z([134, 590]), Z([180, 530])];
  f.part(tails, NV());
  clipDraw(f, tails, () => {
    for (const q of [[[230, 540], [190, 620], [160, 670]], [[260, 540], [240, 640]], [[350, 560], [372, 640]], [[200, 530], [150, 600], [128, 650]]]) f.stroke(ZZ(q), W(3), '#0c0e14', { op: 0.75 });
    for (let i = 0; i < 3; i++) f.line(ZZ([[120, 600 + i * 22], [260, 590 + i * 22], [400, 610 + i * 22]]), 2, '#aab6c0', { op: 0.3 - i * 0.07 }); // salt tide-lines
  });
  f.part(ZZ([[370, 570], [382, 566], [390, 652, 1], [376, 654], [366, 600]]), NV({ fill: nvL, inkW: 1.4 })); // turned-back facing on the front edge of the skirt
  f.part(ZZ([[196, 560], [232, 556], [236, 592], [200, 596]]), NV({ fill: '#4a5262', sharp: true, inkW: 1.2 })); f.stitches(ZZ([[196, 560], [232, 556], [236, 592], [200, 596], [196, 560]]), '#9aa4ae', 1); // darned patch
  for (let i = 0; i < 3; i++) f.rivet(Z([142 + i * 14, 560 + i * 26]), 4.5, PAL.pewter); // the tail buttons
  X.frost(Z([250, 600]), W(70), W(40), 14, 1.4);
  X.icicles(ZZ([[150, 680], [220, 664], [268, 640]]), 6, W(30), 9);
  X.icicles(ZZ([[330, 640], [372, 660], [400, 640]]), 4, W(24), 8);
  f.flat(ZZ([[176, 600], [186, 596], [190, 606], [180, 610]]), '#0a0a0e'); f.line(ZZ([[172, 596], [194, 610]]), 1.4, '#aab6c0', { op: 0.5 }); // a shot hole

  // ---- torso: waistcoat, frock coat with lapels and pewter buttons, cravat frozen, baldric, medal
  f.bone('torso');
  const torso = S.shape([[-0.12, 0.42, 0.44], [0.06, 0.88, 0.72], [0.3, 0.86, 0.9], [0.55, 0.76, 0.84], [0.8, 0.78, 0.76], [1.02, 0.82, 0.72]]);
  f.part(torso, { fill: '#9aa2a8', shadow: '#3a4048', tex: 'weave701', texOp: 0.5 }); // the waistcoat
  for (let i = 0; i < 6; i++) f.rivet(S.at(0.7, 0.32 + i * 0.1), 3.5, PAL.pewter);
  const coat = [S.at(-0.5, -0.06), S.at(-0.2, -0.12), S.at(0.25, -0.06), S.at(0.5, 0.06), S.at(0.62, 0.2), S.at(0.5, 0.34), S.at(0.46, 0.6), S.at(0.56, 0.84), S.at(0.62, 1.0, 1), S.at(0.0, 0.98), S.at(-0.9, 1.0, 1), S.at(-0.92, 0.6), S.at(-0.86, 0.2)];
  f.part(coat, NV());
  f.part([S.at(0.5, 0.06), S.at(0.66, 0.18), S.at(0.62, 0.36), S.at(0.5, 0.56), S.at(0.4, 0.5), S.at(0.42, 0.3), S.at(0.36, 0.12)], NV({ fill: nvL, inkW: 1.4 })); // lapel
  for (let i = 0; i < 4; i++) { f.rivet(S.at(0.46, 0.14 + i * 0.1), 4.5, PAL.pewter); f.line([S.at(0.38, 0.14 + i * 0.1), S.at(0.5, 0.14 + i * 0.1)], 2, '#aab0b4', { op: 0.6 }); } // buttons and lace loops on the lapel
  for (let i = 0; i < 3; i++) f.rivet(S.at(0.52, 0.66 + i * 0.1), 4.5, PAL.pewter);
  f.stroke([S.at(-0.5, 0.3), S.at(-0.44, 0.6), S.at(-0.5, 0.96)], 3, '#0c0e14', { op: 0.7 });
  f.stroke([S.at(-0.1, 0.62), S.at(0.1, 0.7), S.at(0.3, 0.66)], 2.6, '#0c0e14', { op: 0.6 });
  f.line([S.at(-0.86, 0.3), S.at(-0.6, 0.18), S.at(-0.3, 0.12)], 2, mix(nvL, '#fff', 0.2), { op: 0.35 });
  X.frost(S.at(-0.2, 0.5), W(30), W(40), 12, 1.4);
  X.rime([S.at(-0.4, -0.08), S.at(0.1, -0.12), S.at(0.5, 0.04), S.at(0.66, 0.2)], 16, -1);
  X.rime([S.at(0.5, 0.36), S.at(0.46, 0.6), S.at(0.56, 0.84)], 10, -1);
  X.icicles([S.at(-0.9, 1.0), S.at(-0.3, 0.98), S.at(0.3, 0.99), S.at(0.62, 1.0)], 6, W(22), 8);
  // baldric across the chest to the scabbard; a lead medal on a ribbon (grey, no colour); cravat frozen in a stiff fall
  f.part(K.chain([S.at(0.58, 0.04), S.at(0.2, 0.36), S.at(-0.3, 0.72), S.at(-0.62, 0.92)], [W(10), W(10), W(10), W(10)]), { fill: '#202226', shade: 0.4, tex: 'mottle701' });
  f.part([S.at(-0.04, 0.48), S.at(0.12, 0.48), S.at(0.12, 0.6), S.at(-0.04, 0.6)], { fill: PAL.iron, shade: 0.4, inkW: 1.2, sharp: true, cast: false });
  f.part([S.at(0.24, 0.2), S.at(0.34, 0.2), S.at(0.33, 0.3), S.at(0.25, 0.3)], { fill: '#5a6068', shade: 0.3, inkW: 1, sharp: true, cast: false });
  f.part(ell(S.at(0.29, 0.36), W(7), W(7), 0, 12), { fill: '#7a7e80', shade: 0.4, inkW: 1.2, cast: false }); f.line(ell(S.at(0.29, 0.36), W(4), W(4), 0, 10), 1, '#2a2a2a', { op: 0.6 });
  f.part([S.at(0.36, -0.1), S.at(0.62, -0.04), S.at(0.66, 0.1), S.at(0.58, 0.3), S.at(0.5, 0.2), S.at(0.42, 0.06)], X.IC({ fill: '#e2e8ec', inkW: 1.2, inkHeavy: 1.8, shade: 0.35 })); // cravat, frozen
  X.icicle(S.at(0.58, 0.3), W(16), 6);
  // epaulette on the near shoulder (on the torso, so it stays when the arm lifts): board crusted white, fringe frozen
  const ep = S.at(-0.36, 0.02), epF = frame(ep, -0.2, W(1));
  f.part(epF([[-34, -8], [28, -14], [40, -2], [30, 10], [-34, 12]]), { fill: '#5a6068', shadow: '#22262c', shade: 0.4, inkW: 1.4, tex: 'mottle701' });
  for (let i = 0; i < 9; i++) { const q = epF([[-32 + i * 8, 10]])[0]; f.stroke([q, add(q, [0, W(12)]), add(q, [W(1), W(24)])], W(4), '#9aa2a8'); f.line([q, add(q, [W(1), W(24)])], 1, '#2a2e36', { op: 0.6 }); } // bullion fringe hung plumb, frozen
  X.rime([epF([[-36, -8]])[0], epF([[0, -14]])[0], epF([[40, -4]])[0]], 14, -1);
  f.part(ell(epF([[0, -2]])[0], W(9), W(6), -0.2, 12), { fill: PAL.pewter, shade: 0.4, inkW: 1.1, cast: false });

  // ---- scabbard empty on the near hip
  f.bone('scabbard');
  const sc0 = S.at(-0.62, 0.92), sc1 = Z([150, 690]);
  f.part(limb(sc0, sc1, W(12), W(9), { steps: 6 }), { fill: '#202226', shadow: '#08080a', tex: 'mottle701' });
  f.part(limb(lerp(sc0, sc1, 0.9), sc1, W(14), W(10), { steps: 3 }), { fill: PAL.iron, shade: 0.4, inkW: 1.2 });
  X.icicles([lerp(sc0, sc1, 0.4), sc1], 3, W(18), 6);

  // ---- head: the drowned face under a glaze of ice, beard frozen in one block, chin up; tricorn
  f.bone('head');
  f.part(limb(S.at(0.06, -0.02), hF([[-0.08, 0.3]])[0], W(46), W(40)), SK());
  B.head(f, HC, W(H), hA, { skin, jaw: 1.18, chin: 0.03, nose: 1.08, hook: 0.3, mouth: 'set', squint: 0.45, browDown: 0.03, age: true, faceShade: 0.6, jawShade: 0.4, iris: '#b4c0c8', eyeWhite: '#d6dcde', hairCol: '#5a6068', browCol: '#a8b0b6', noEar: false });
  X.bite(hF([[0.36, 0.08]])[0], 10, 8, 4, 0.3); X.cracks(hF([[0.14, 0.12]])[0], W(14), 3, 0.7); X.livid(hF([[0.0, 0.2]])[0], 14, 10, 3);
  // the beard: one frozen block, hard-edged, ridged, icicled
  const beard = hF([[-0.16, 0.14], [0.02, 0.26], [0.18, 0.31], [0.32, 0.3], [0.4, 0.4], [0.38, 0.62, 1], [0.26, 0.8], [0.08, 0.86, 1], [-0.08, 0.66], [-0.2, 0.38]]);
  f.part(beard, X.IC({ fill: '#aab4ba', shadow: '#4a5664', inkW: 1.5, inkHeavy: 2.4, shade: 0.4, texOp: 0.5 }));
  for (let i = 0; i < 6; i++) f.line(hF([[-0.08 + i * 0.07, 0.3], [-0.05 + i * 0.075, 0.56], [-0.02 + i * 0.07, 0.8]]), 1.3, '#4a5664', { op: 0.6 });
  f.part(hF([[0.16, 0.22], [0.28, 0.2], [0.38, 0.22], [0.42, 0.28], [0.32, 0.3], [0.24, 0.28], [0.16, 0.32]]), X.IC({ fill: '#b4bec4', inkW: 1.1, inkHeavy: 1.4 }));
  for (const [u, v, l] of [[-0.02, 0.7, 30], [0.1, 0.86, 44], [0.24, 0.8, 36], [0.36, 0.62, 22]]) X.icicle(hF([[u, v]])[0], W(l), 9);
  X.glaze(hF([[-0.1, -0.2], [0.3, -0.3], [0.42, -0.1], [0.42, 0.2], [0.3, 0.3], [0.0, 0.26], [-0.16, 0.0]]), 0.3); // the ice over the face
  // tricorn: black felt, three cocked sides, worn grey edge, iron cockade, rime on the windward point
  const hat = hF([[-0.74, -0.46], [-0.6, -0.78], [-0.3, -0.9], [0.1, -0.92], [0.42, -0.76], [0.66, -0.46], [0.5, -0.38], [0.2, -0.34], [-0.2, -0.32], [-0.6, -0.34]]);
  f.part(hat, { fill: '#1d1f25', shadow: '#060608', tex: X.hoar, texOp: 0.25, light: '#3e424c', inkW: 2 });
  f.part(hF([[-0.42, -0.42], [-0.36, -0.72], [0.0, -0.82], [0.36, -0.7], [0.4, -0.46], [0.0, -0.5]]), { fill: '#24262c', shadow: '#060608', shade: 0.4, inkW: 1.2, cast: false }); // the crown seen above the cocked brim
  f.line(hF([[-0.74, -0.46], [-0.6, -0.78], [-0.3, -0.9], [0.1, -0.92], [0.42, -0.76], [0.66, -0.46]]), 3, '#6a707a', { op: 0.6 }); // worn edge braid
  f.part(ell(hF([[0.32, -0.6]])[0], W(9), W(11), 0, 14), { fill: PAL.iron, shade: 0.4, inkW: 1.2, cast: false }); f.rivet(hF([[0.32, -0.6]])[0], 4, PAL.pewter);
  X.rime([hF([[0.0, -0.92]])[0], hF([[0.36, -0.8]])[0], hF([[0.66, -0.48]])[0]], 16, -1);
  X.icicles([hF([[0.66, -0.46]])[0], hF([[0.5, -0.38]])[0]], 3, W(26), 8);
  X.icicles([hF([[-0.6, -0.34]])[0], hF([[-0.2, -0.32]])[0]], 3, W(16), 6);

  // ---- the wheel (in front of him, so drawn over the front of the coat): post and drum, rim, eight spokes with turned handles, iron hub; rimed and icicled
  f.bone('wheel');
  const post = [add(WC, [-W(16), W(40)]), add(WC, [W(16), W(40)]), Z([470, 790]), Z([432, 790])];
  f.part(post, { fill: PAL.wood, shadow: '#101012', tex: 'wood701', sharp: true, light: PAL.woodL });
  f.part([add(WC, [-W(30), W(150)]), add(WC, [W(30), W(150)]), add(WC, [W(34), W(200)]), add(WC, [-W(34), W(200)])], { fill: PAL.hull, shadow: '#08080a', tex: 'wood701', sharp: true }); // the drum where the tiller ropes run
  rope(f, [add(WC, [-W(30), W(170)]), add(WC, [0, W(176)]), add(WC, [W(30), W(170)])], 6, PAL.rope);
  rope(f, [add(WC, [-W(30), W(186)]), add(WC, [0, W(192)]), add(WC, [W(30), W(186)])], 6, PAL.rope);
  X.icicles([add(WC, [-W(34), W(200)]), add(WC, [W(34), W(200)])], 4, W(30), 9);
  f.bone('wheel_rim');
  for (let k = 0; k < 8; k++) { // spokes and handles: back ones first
    const th = thG + k * Math.PI / 4, a = add(WC, [wrx * 0.12 * Math.cos(th), wry * 0.12 * Math.sin(th)]), r = rimAt(th), hd = add(r, mul(radial(th), W(44)));
    f.part(limb(a, r, W(12), W(10), { steps: 4 }), { fill: PAL.wood, shadow: '#101012', tex: 'wood701', light: PAL.woodL, inkW: 1.4 });
    f.part(limb(add(r, mul(radial(th), -W(4))), hd, W(13), W(9), { steps: 5, p: [[0.5, 0.3, 0.15]], q: [[0.5, 0.3, 0.15]] }), { fill: PAL.wood, shadow: '#101012', light: PAL.woodL, inkW: 1.4 });
    if (Math.sin(th) > 0.3) X.icicle(add(hd, [0, W(4)]), W(14 + (k % 3) * 8), 7);
  }
  const rimO = ell(WC, wrx + W(8), wry + W(8), 0, 40), rimI = ell(WC, wrx - W(8), wry - W(8), 0, 40);
  f.part([...rimO, rimO[0], ...rimI.slice().reverse(), rimI[rimI.length - 1]], { fill: PAL.wood, shadow: '#0c0c0e', tex: 'wood701', light: PAL.woodL, inkW: 1.6 });
  f.line(ell(WC, wrx + W(5), wry + W(5), 0, 40).slice(28, 40), 2, '#8a8680', { op: 0.5 }); // worn bright where hands went
  f.part(ell(WC, W(16), W(26), 0, 16), { fill: PAL.iron, shadow: PAL.ironD, shade: 0.4, inkW: 1.4 }); f.rivet(WC, 6, PAL.pewter);
  X.rime(ell(WC, wrx + W(8), wry + W(8), 0, 40).slice(30, 40), 12, 1);
  X.icicles(ell(WC, wrx + W(8), wry + W(8), 0, 40).slice(6, 15), 6, W(30), 8);
  rope(f, [add(WC, [W(40), -W(60)]), add(WC, [W(66), -W(20)]), add(WC, [W(60), W(30)])], 5, PAL.rope); // a lashing frozen on the rim
  f.line([add(WC, [W(60), W(30)]), add(WC, [W(64), W(80)])], 5, PAL.ropeD);

  // ---- near arm: sabre forward and down at the heroes, its blade one long faceted icicle
  const [cUN, cFN] = jcut(SN, EN, WN, W(18));
  split(f, () => {
    f.part(jointLimb(SN, EN, lerp(EN, WN, 0.86), [W(52), W(42), W(38)], { point: 0.3, mus0: 0.12, mus1: 0.12 }), NV());
    creases(f, EN, Math.atan2(WN[1] - SN[1], WN[0] - SN[0]) - 1.5, W(22), 3, '#0c0e14', 0.7);
    f.stroke([lp(SN, EN, 0.2, -W(14)), lp(SN, EN, 0.75, -W(16))], 3, '#0c0e14', { op: 0.6 });
    X.rime([lp(EN, WN, 0.15, -W(18)), lp(EN, WN, 0.6, -W(18))], 12, 1);
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('forearm_n');
  f.part(plate(EN, WN, 0.5, 0.88, W(46), W(50), { bow: 4 }), NV({ fill: nvL, inkW: 1.4 }));
  for (let i = 0; i < 3; i++) f.rivet(lp(EN, WN, 0.58 + i * 0.09, -W(14)), 4, PAL.pewter);
  X.icicles([lp(EN, WN, 0.55, W(24)), lp(EN, WN, 0.86, W(25))], 3, W(22), 7);
  f.bone('sabre');
  const sF = frame(WN, sA, 1), BL = W(300);
  const blade = sF([[W(16), -W(9)], [BL * 0.4, -W(10)], [BL * 0.75, -W(6)], [BL, W(4), 1], [BL * 0.78, W(9)], [BL * 0.4, W(12)], [W(16), W(10)]]);
  f.part(blade, X.IC({ fill: PAL.glaze, opacity: 0.85, shade: 0.35, maxShade: 14, inkW: 1.5, inkHeavy: 2.4, sharp: true }));
  f.line(sF([[W(20), -W(2)], [BL * 0.5, -W(3)], [BL * 0.96, W(3)]]), 1.6, '#f4f8fa', { op: 0.8, straight: true });
  f.line(sF([[W(30), W(6)], [BL * 0.45, W(7)], [BL * 0.8, W(6)]]), 1.2, PAL.iceD, { op: 0.6, straight: true });
  for (let i = 0; i < 4; i++) f.line(sF([[W(50 + i * 60), -W(8)], [W(62 + i * 60), W(8)]]), 1, PAL.iceD, { op: 0.6 }); // rings where it froze in layers
  X.icicles([sF([[W(60), W(12)]])[0], sF([[BL * 0.5, W(11)]])[0], sF([[BL * 0.8, W(8)]])[0]], 3, W(18), 6);
  f.part(sF([[-W(26), -W(7)], [W(14), -W(8)], [W(14), W(8)], [-W(26), W(7)]]), { fill: '#202226', shade: 0.4, inkW: 1.2, cast: false });
  f.part(sF([[-W(34), -W(8)], [-W(24), -W(9)], [-W(22), W(9)], [-W(34), W(8)]]), { fill: PAL.pewter, shade: 0.4, inkW: 1.1, cast: false }); // pommel
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, sA + Math.PI / 2, W(28), skin, { tex: 'mottle701', texOp: 0.5, shadow: skinS, inline: true, name: 'captain sabre' });
  fistDetail(f, gN, W(28), skin, {});
  X.bite(gN.F([[0.4, 0]])[0], 10, 10, 4, 0.5);
  f.bone('sabre');
  const kd = rot([1, 0], gN.ang + (gN.flip ? Math.PI / 2 : -Math.PI / 2) + Math.PI); // the stirrup guard sweeps over the knuckles, away from the thumb
  const bow = [sF([[W(14), 0]])[0], add(sF([[W(4), 0]])[0], mul(kd, W(24))), add(sF([[-W(20), 0]])[0], mul(kd, W(22))), sF([[-W(30), 0]])[0]];
  f.line(bow, W(4.5), INK); f.line(bow, W(2.6), PAL.steel); f.line(bow.slice(1, 3), 1.2, PAL.steelL, { op: 0.6 });
  f.part(sF([[W(10), -W(16)], [W(18), -W(16)], [W(18), W(16)], [W(10), W(16)]]), { fill: PAL.steel, shade: 0.4, inkW: 1.2, cast: false, sharp: true });
  // ---- far hand on the spoke handle, last so it sits over the wheel; the ring of ice on its finger
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, gAng, W(28), mix(skin, PAL.bite, 0.1), { tex: 'mottle701', texOp: 0.5, shadow: skinS, name: 'captain wheel' });
  fistDetail(f, gF, W(28), skin, {});
  const rg = gF.F([[0.34, -0.3]])[0], rg2 = gF.F([[0.34, 0.0]])[0];
  f.line([lerp(rg, rg2, -0.1), lerp(rg, rg2, 0.5)], W(5), INK); f.line([lerp(rg, rg2, -0.1), lerp(rg, rg2, 0.5)], W(3.4), '#e8f0f4'); // the ring of ice round the finger
  f.flat(ell(lerp(rg, rg2, 0.2), W(3), W(2), 0, 8), '#ffffff', { op: 0.9 });
  X.icicle(add(gF.F([[0.0, 0.6]])[0], [0, 2]), W(14), 5);

  f.bone('root');
  X.floe(Z([300, 792]), W(230), W(10));
  for (const A of [AN, AF]) { f.part([add(A, W2([-30, 38])), add(A, W2([-24, 24])), add(A, W2([10, 18])), add(A, W2([44, 26])), add(A, W2([60, 38]))], X.IC({ fill: '#d2dce2', texOp: 0.6 })); } // boots frozen into the deck
  return f;
}

// ------------------------------------------------------------------ FROST SELKIE (Elite 1.9)
// A seal-woman half-crouched on the ice, wrapped in the sailor who took her skin. His flayed hide is her cloak, and it
// still reads as him: his face-skin hangs empty at her nape like a fallen hood with his tarred queue, his tattooed back
// is stretched over her hunched back, his arm-skins come over her shoulders and are knotted at her throat with one empty
// hand hanging flat below the knot, and his leg-skins trail on the ice behind with their feet. She stitched it closed with
// sinew. It is frozen stiff: it hangs from her shoulders and hip in rigid folds, the hem a hard broken edge with icicles,
// the raw inner side showing where the edges curl. Out of the front: her near knee up and the webbed foot flat on the ice,
// the near arm reaching with a webbed hand, the far fist on the knot, and her wide pale face with great dark seal eyes
// under long wet black hair. Weight over the front foot, the far knee down on the ice under the cloak.
function frostSelkie() {
  const [Wc, Hc] = TIERS.elite, GY = Hc - 30;
  const { Z, ZZ, W } = space(1.9, 540, GY);
  const f = new Fig(foeBase(702, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 690])[1] })));
  const X = fx(f, 1.5);
  const H = 94, W2 = v => [W(v[0]), W(v[1])];
  const skin = '#b6bec6', skinS = '#545a72', hide = '#b0aea6', hideS = '#4a4a54', hideL = '#e2e0da', hideD = '#8a8882', inner = '#6c6872', hair = '#121417', tat = '#3e5268', web = '#7a8a9a', sinew = '#26262a';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle702', texOp: 0.4 }, o);
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: hideS, shade: 0.3, tex: 'mottle702', texOp: 0.3, light: hideL, maxShade: 34 }, o);
  // ---- skeleton: pelvis low, spine leaning well forward, the hunch in the upper back
  const P = Z([244, 590]), C = Z([290, 516]), N = Z([344, 456]);
  const S = B.spine(N, C, P, W(H));
  const up = E.norm(sub(N, C));
  const hA = 0.12, HC = add(N, add(mul(up, W(54)), W2([18, 6]))), hF = frame(HC, hA, W(H));
  const SF = S.at(0.42, 0.12), EF = Z([396, 514]), WF = Z([376, 458]);
  const SN = S.at(-0.2, 0.14), EN = Z([408, 506]), WN = Z([484, 520]);
  const HN = S.at(-0.2, 1.0), AN = Z([386, 742]), KN = ik(HN, AN, W(162), W(172), -1)[0];
  const HF = S.at(0.3, 1.0), KF = Z([300, 770]), AF = Z([176, 774]);
  const kn = S.at(0.42, -0.04);
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.06, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('cloak', S.at(-0.3, 0.05), 'torso').joint('cloak_train', Z([196, 640]), 'cloak').joint('hair', hF([[-0.3, -0.2]])[0], 'head').joint('jaw', hF([[0.0, 0.26]])[0], 'head');

  // ---- far leg kneeling, the knee on the ice and the shin back along it (under the cloak, drawn whole for the rig)
  const [cTF, cSF] = jcut(HF, KF, AF, W(16));
  split(f, () => f.part(jointLimb(HF, KF, AF, [W(40), W(30), W(20)], { point: 0.3, mus0: 0.14, mus1: 0.2 }), SK({ fill: mix(skin, '#8a90a0', 0.2) })), [['thigh_f', cTF], ['shin_f', cSF]]);
  f.bone('foot_f'); f.part(ZZ([[180, 764], [140, 776], [118, 790], [176, 790]]), SK({ inkW: 1, cast: false }));
  // ---- far arm up to the throat (behind the body)
  const [cUF, cFF] = jcut(SF, EF, WF, W(14));
  split(f, () => f.part(jointLimb(SF, EF, lerp(EF, WF, 0.85), [W(30), W(24), W(20)], { point: 0.4, mus0: 0.14, mus1: 0.12 }), SK()), [['upperarm_f', cUF], ['forearm_f', cFF]]);

  // ---- the cloak's far half, seen inside the front opening: its raw inner side, dark
  f.bone('cloak');
  const innerP = ZZ([[372, 460], [330, 470], [290, 520], [262, 600], [250, 700], [270, 790], [310, 790], [312, 700], [318, 600], [344, 520]]);
  f.part(innerP, HD({ fill: inner, shadow: '#26242c', maxShade: 20, texOp: 0.5 }));
  clipDraw(f, innerP, () => { for (let i = 0; i < 5; i++) f.line(ZZ([[300 + i * 4, 520 + i * 10], [290 + i * 6, 640], [292 + i * 5, 780]]), 1, '#3a3640', { op: 0.6 }); for (let i = 0; i < 30; i++) f.flat(ell(Z([260 + f.r() * 60, 500 + f.r() * 280]), 1.4, 1, 0, 5), '#4a4550', { op: 0.6 }); });

  // ---- torso: thin, pale, ribbed, the belly hollow
  f.bone('torso');
  f.part(S.shape([[-0.1, 0.32, 0.34], [0.06, 0.6, 0.56], [0.3, 0.56, 0.66], [0.55, 0.48, 0.52], [0.8, 0.54, 0.46], [1.02, 0.64, 0.54]]), SK());
  for (let i = 0; i < 5; i++) f.line([S.at(0.22, 0.26 + i * 0.075), S.at(0.42, 0.29 + i * 0.075), S.at(0.6, 0.25 + i * 0.07)], 1.4, skinS, { op: 0.5 }); // ribs under the skin
  f.stroke([S.at(0.3, 0.62), S.at(0.42, 0.72), S.at(0.4, 0.84)], W(4), skinS, { op: 0.35 }); // the hollow under the ribs
  X.livid(S.at(0.2, 0.8), W(16), W(14), 4, 0.3);

  // ---- near leg, the front one: knee up, shin down to the webbed foot flat on the ice
  const [cTN, cSN] = jcut(HN, KN, AN, W(18));
  const legLook = SK({ fill: mix(skin, '#9aa0b0', 0.06), maxShade: 24 });
  split(f, () => {
    f.part(jointLimb(HN, KN, AN, [W(58), W(36), W(19)], { point: 0.14, mus0: 0.26, mus0At: 0.35, mus1: 0.55 }), legLook);
    f.part(ell(add(KN, mul(E.norm(add(E.norm(sub(KN, HN)), E.norm(sub(KN, AN)))), W(8))), W(14), W(12), 0, 12), SK({ fill: mix(skin, '#ffffff', 0.15), maxShade: 6, inkW: 1.1, inkHeavy: 1.4, cast: false })); // the kneecap, pushed out by the bend
    f.line([lp(HN, KN, 0.3, W(14)), lp(HN, KN, 0.85, W(12))], 1.4, skinS, { op: 0.5 }); // the long thigh muscle
    f.stroke([lp(KN, AN, 0.12, -W(10)), lp(KN, AN, 0.35, -W(13)), lp(KN, AN, 0.62, -W(6))], W(6), skinS, { op: 0.35 }); // the calf's swell
    f.line([lp(KN, AN, 0.55, W(2)), lp(KN, AN, 0.95, W(0))], 1.2, skinS, { op: 0.4 }); // the shin's tendon
    f.line([lp(KN, AN, 0.1, W(6)), lp(KN, AN, 0.8, W(5))], 1.6, mix(skin, '#fff', 0.45), { op: 0.6 }); // the lit shin bone
    X.bite(lp(KN, AN, 0.85, 0), 14, 10, 5, 0.4); X.frost(lp(HN, KN, 0.7, -W(10)), W(14), W(6), 6); X.cracks(lp(KN, AN, 0.4, 0), W(10), 2, 1.4);
    X.livid(lp(KN, AN, 0.7, -W(6)), W(10), W(14), 4, 0.35);
  }, [['thigh_n', cTN], ['shin_n', cSN]]);
  f.bone('foot_n');
  split(f, () => bareLeg(f, lerp(KN, AN, 0.8), AN, 1, W(32), W(24), legLook, { swell: 0.1 }), [['foot_n', side(AN, [0, 1], W(10))]]);
  for (let i = 0; i < 3; i++) f.flat([add(AN, W2([26 + i * 4, 12])), add(AN, W2([36 + i * 3, 16])), add(AN, W2([32 + i * 3, 22]))], web, { op: 0.7 }); // webs between the toes
  X.bite(add(AN, W2([36, 20])), 14, 6, 6, 0.7);

  // ---- the cloak: his skin over her back. One outline from the throat over the hunched shoulders and back, to the
  // hip, then falling stiff to the ice and trailing; its front edge drops from the throat past the thigh's root
  const cloak = ZZ([[372, 460], [352, 442], [324, 436], [294, 446], [262, 466], [230, 496], [206, 536], [192, 580], [184, 622], [170, 672], [146, 724], [112, 764], [70, 784, 1], [58, 794, 1], [104, 792], [128, 798, 1], [176, 790], [214, 798, 1], [256, 792], [292, 798, 1], [312, 790], [302, 744], [288, 694], [286, 642], [300, 590], [322, 546], [342, 506]]);
  const cut = side(Z([196, 640]), [0.2, -1], W(30)), cutT = side(Z([196, 640]), [-0.2, 1], W(30));
  split(f, () => {
    f.part(cloak, HD());
    clipDraw(f, cloak, () => {
      // his tattoos first, so the folds and frost lie over them: a full-rigged ship across his back, swallows on his
      // shoulder blades, a heart on a banner low on his back
      const sc0 = Z([238, 560]), T2 = v => add(sc0, W2(v)), ship = (s0, k, op) => { const Q = v => add(s0, W2([v[0] * k, v[1] * k])); f.line([Q([-36, 0]), Q([36, 0]), Q([26, 12]), Q([-28, 12]), Q([-36, 0])], 2.4, tat, { op }); for (const x of [-16, 2, 20]) { f.line([Q([x, 0]), Q([x, -50])], 2, tat, { op }); f.line([Q([x - 11, -40]), Q([x + 9, -42]), Q([x + 11, -26]), Q([x - 9, -24]), Q([x - 11, -40])], 1.6, tat, { op: op * 0.85 }); } for (let i = 0; i < 4; i++) f.line([Q([-44 + i * 22, 20]), Q([-34 + i * 22, 15]), Q([-24 + i * 22, 20])], 1.6, tat, { op: op * 0.8 }); f.line([Q([20, -50]), Q([40, -30]), Q([36, 0])], 1, tat, { op: op * 0.6 }); };
      ship(sc0, 1, 0.8);
      f.line(ell(T2([0, -18]), W(54), W(46), 0, 30).concat([ell(T2([0, -18]), W(54), W(46), 0, 30)[0]]), 2, tat, { op: 0.5, dash: '6 3' });
      for (const [q, k] of [[Z([280, 480]), 1], [Z([228, 510]), 0.8]]) { const Sw = v => add(q, W2([v[0] * k, v[1] * k])); f.flat([Sw([-10, 0]), Sw([0, -4]), Sw([10, -10]), Sw([6, 0]), Sw([12, 6]), Sw([0, 3]), Sw([-6, 8])], tat, { op: 0.8 }); }
      const ht = Z([206, 640]); f.line([add(ht, W2([-8, -4])), add(ht, W2([0, -10])), add(ht, W2([0, 6])), add(ht, W2([-8, -4]))], 2, tat); f.line([add(ht, W2([8, -4])), add(ht, W2([0, -10]))], 2, tat); f.line([add(ht, W2([8, -4])), add(ht, W2([0, 6]))], 2, tat); f.line([add(ht, W2([-14, 10])), add(ht, W2([14, 8]))], 5, tat, { op: 0.75 });
      // form: the light across the shoulders and the top of the back, the shadow down the falling part and into the hem
      f.flat(ZZ([[300, 430], [372, 456], [340, 520], [290, 530], [240, 560], [200, 600], [190, 560], [230, 490]]), hideL, { op: 0.35 });
      f.flat(ZZ([[100, 640], [200, 610], [300, 640], [320, 800], [40, 800]]), hideS, { op: 0.25 });
      // tension creases where it pulls tight over the hunch, from the shoulder and over the hip
      for (const q of [[[332, 452], [300, 488], [268, 520]], [[316, 446], [276, 470], [244, 506]], [[340, 470], [318, 520], [300, 560]], [[214, 548], [196, 596], [190, 632]]]) { f.stroke(ZZ(q), W(5), hideS, { op: 0.45 }); f.stroke(ZZ(q.map(v => [v[0] + 4, v[1] - 3])), W(2), hideL, { op: 0.5 }); }
      // the frozen folds falling from the hip to the hem: deep shadowed troughs, lit ridges, each ending in a stiff
      // flute of the hem
      for (const [x0, x1, w, y0] of [[200, 110, 12, 640], [220, 160, 16, 610], [236, 202, 8, 660], [258, 230, 14, 630], [284, 286, 9, 680]]) { const q = [[x0 + 6, y0], [(x0 + x1) / 2 + (w % 3) * 3, (y0 + 792) / 2], [x1, 792]]; f.stroke(ZZ(q), W(w), hideS, { op: 0.55 }); f.stroke(ZZ(q.map(v => [v[0] + w * 0.9, v[1]])), W(w * 0.35), hideL, { op: 0.55 }); f.line(ZZ(q.map(v => [v[0] - 2, v[1]])), 1.2, INK, { op: 0.5 }); }
      // skin: pores, fine body hair, mottled lividity, salt, his old scars
      for (let i = 0; i < 70; i++) f.flat(ell(Z([100 + f.r() * 220, 440 + f.r() * 340]), 1, 1, 0, 5), hideS, { op: 0.45 });
      for (let i = 0; i < 40; i++) { const q = Z([180 + f.r() * 140, 450 + f.r() * 160]); f.line([q, add(q, W2([2, 3]))], 0.8, '#5a5a62', { op: 0.5 }); }
      X.livid(Z([180, 700]), W(60), W(60), 10, 0.3);
      X.scars(Z([250, 520]), W(30), W(20), 2, 0.8, '#d8d6d0');
      for (let i = 0; i < 3; i++) f.line(ZZ([[120, 740 + i * 14], [200, 736 + i * 14], [300, 742 + i * 14]]), 1.2, '#d6dde2', { op: 0.35 }); // salt tide-lines
      f.flat(ZZ([[40, 770], [320, 770], [320, 800], [40, 800]]), '#3a4652', { op: 0.25 }); // slush soaked into the hem
      // the raw inner side, where the stiff front edge curls back: a narrow dark band all down the cut
      f.stroke(ZZ([[364, 466], [340, 506], [322, 546], [302, 590], [288, 642], [290, 694], [302, 744], [310, 788]]), W(9), inner, { op: 0.9 });
    });
    // her stitches: crude cross-stitches in sinew down the cut front and across his shoulder seam
    const xst = pts => { const C = spline(ZZ(pts), W(10)); for (let i = 1; i < C.length - 1; i++) { const d = E.norm(sub(C[i + 1], C[i - 1])), nn = [-d[1], d[0]]; f.line([add(C[i], add(mul(nn, -W(5)), mul(d, -W(3)))), add(C[i], add(mul(nn, W(5)), mul(d, W(3))))], 1.4, sinew, { op: 0.85 }); f.line([add(C[i], add(mul(nn, W(5)), mul(d, -W(3)))), add(C[i], add(mul(nn, -W(5)), mul(d, W(3))))], 1.4, sinew, { op: 0.85 }); } };
    xst([[352, 500], [330, 540], [312, 590], [296, 642], [298, 700], [306, 760]]);
    xst([[300, 446], [262, 470], [226, 504]]);
    // the hem: a hard broken edge frozen stiff, its thickness showing, icicles hung plumb from it
    f.line(ZZ([[70, 786], [104, 790], [128, 796], [176, 788], [214, 796], [256, 790], [292, 796], [310, 788]]), W(3), hideD, { op: 0.9 });
    X.icicles(ZZ([[90, 790], [176, 790], [256, 792], [306, 786]]), 7, W(18), 6);
    X.icicles(ZZ([[146, 724], [112, 764]]), 2, W(14), 5);
    // rime on the top faces: the shoulders and the hunch
    X.rime(ZZ([[322, 436], [294, 446], [262, 466], [230, 496], [206, 536]]), 16, -1);
    X.frost(Z([270, 480]), W(40), W(16), 14, 1.4);
  }, [['cloak', cut], ['cloak_train', cutT]]);
  // his leg-skins lying flat on the ice behind, empty, the feet still on them
  f.bone('cloak_train');
  for (const [o, k] of [[[0, 0], 1], [[-34, 6], 0.92]]) {
    const L = ZZ([[110, 776], [60, 780], [24, 782], [6, 788], [18, 794], [70, 794], [116, 790]].map(v => [v[0] * k + o[0] + (1 - k) * 110, v[1] + o[1] * 0.2]));
    f.part(L, HD({ fill: mix(hide, '#8a8a90', 0.2), maxShade: 6, inkW: 1.2 }));
    const toe = lerp(L[3], L[4], 0.5); for (let i = 0; i < 4; i++) f.flat(ell(add(toe, W2([4 + i * 3, -2 - i * 2])), W(2.2), W(1.6), 0, 6), hideS, { op: 0.6 }); // the empty toes, flattened, with their nails
    f.line([L[1], L[2]], 1, hideS, { op: 0.6 });
  }
  X.rime(ZZ([[20, 784], [60, 780], [100, 778]]), 6, -1);

  // ---- his face-skin, fallen back at her nape like a hood: crumpled, the eye-holes and mouth empty, his stubble,
  // his tarred queue still tied and hanging plumb
  f.bone('cloak');
  const hd0 = Z([300, 446]), Hd = v => add(hd0, W2(v));
  const hood = [Hd([-40, 10]), Hd([-42, -6]), Hd([-28, -20]), Hd([-4, -26]), Hd([22, -22]), Hd([40, -8]), Hd([36, 8]), Hd([24, 18]), Hd([4, 14]), Hd([-18, 20])];
  f.part(hood, HD({ maxShade: 14, inkW: 1.6 }));
  clipDraw(f, hood, () => {
    f.flat([Hd([-42, -6]), Hd([-28, -22]), Hd([-6, -28]), Hd([-14, -14]), Hd([-34, 0])], '#3a3c40', { op: 0.85 }); // his cropped scalp, folded under
    for (let i = 0; i < 8; i++) { const q = Hd([-38 + i * 4, -6 - i * 2.4]); f.line([q, add(q, W2([-1, -3]))], 1, '#7a7e84', { op: 0.7 }); }
    // the face, emptied and sagging: eye-holes dragged down into torn slits, the nose a flat flap, the mouth a slack slit
    f.flat([Hd([14, -16]), Hd([24, -17]), Hd([26, -11]), Hd([20, 0]), Hd([16, -6])], '#16161a'); f.stroke([Hd([-2, -12]), Hd([6, -14]), Hd([10, -8])], W(3), hideS, { op: 0.8 }); // one eye-hole dragged open, the other folded shut
    f.part([Hd([28, -10]), Hd([36, -2]), Hd([34, 4]), Hd([28, 2])], HD({ maxShade: 3, inkW: 1, cast: false })); // the flat nose flap
    f.flat([Hd([14, 8]), Hd([32, 7]), Hd([30, 11]), Hd([16, 13])], '#16161a');
    for (let i = 0; i < 16; i++) f.flat(ell(Hd([4 + f.r() * 26, 8 + f.r() * 8]), 0.8, 0.8, 0, 5), '#3a3c40', { op: 0.7 }); // his stubble
    for (const q of [[[-40, 2], [-10, -2], [36, -4]], [[-30, 14], [0, 10], [30, 16]], [[-20, -18], [-8, -4], [-4, 12]]]) f.stroke(q.map(Hd), W(3.4), hideS, { op: 0.5 }); // crumpled folds
    f.flat([Hd([-44, 4]), Hd([44, 4]), Hd([44, 24]), Hd([-44, 24])], hideS, { op: 0.3 });
  });
  f.part(limb(Hd([-36, 0]), Hd([-40, 90]), W(9), W(6), { steps: 6 }), { fill: '#1a1a1c', shade: 0.3, inkW: 1.2, tex: 'hatch702', texOp: 0.5 }); // the tarred queue
  for (let i = 0; i < 6; i++) f.line([Hd([-41, 12 + i * 12]), Hd([-33, 18 + i * 12])], 1, '#4a4e56', { op: 0.8 });
  f.line([Hd([-36, 66]), Hd([-45, 68])], 3, '#5a6068'); X.icicle(Hd([-40, 90]), W(12), 4);
  X.rime([Hd([-28, -20]), Hd([-4, -26]), Hd([22, -22])], 8, -1);

  // ---- hair: one long wet black mass from the back of her head down over her far shoulder, frozen in clumps,
  // hung plumb (screen space)
  f.bone('hair');
  const hq = hF([[-0.42, -0.2]])[0], hq2 = hF([[-0.1, -0.44]])[0];
  const hairM = [hq2, hF([[-0.3, -0.42]])[0], hq, add(hq, W2([-12, 40])), add(hq, W2([-22, 96])), add(hq, W2([-22, 136])), add(hq, W2([-14, 154])), add(hq, W2([-6, 140])), add(hq, W2([2, 162])), add(hq, W2([10, 140])), add(hq, W2([18, 152])), add(hq, W2([22, 120])), add(hq, W2([28, 80])), add(hq2, W2([22, 40]))];
  f.part(hairM, { fill: hair, shadow: '#000', light: '#3e444c', tex: 'hatch702', texOp: 0.3, inkW: 1.6, maxShade: 10 });
  clipDraw(f, hairM, () => { for (let i = 0; i < 8; i++) f.line([add(hq, W2([-4 + i * 5, 10])), add(hq, W2([-12 + i * 6, 80])), add(hq, W2([-14 + i * 5, 160]))], 1.3, i % 2 ? '#4e5660' : '#000', { op: 0.6 }); f.stroke([add(hq, W2([16, 20])), add(hq, W2([20, 90])), add(hq, W2([16, 150]))], W(5), '#3e4650', { op: 0.6 }); });
  for (const v of [[-14, 154], [2, 162], [18, 152]]) X.icicle(add(hq, W2(v)), W(14), 6);
  X.frost(add(hq, W2([6, 60])), W(14), W(40), 8, 1.2);

  // ---- head: a wide pale face, the great dark seal eyes wet and lidless-looking, small flat nose, a wide thin mouth
  f.bone('head');
  f.part(limb(S.at(0.08, -0.02), hF([[-0.08, 0.28]])[0], W(32), W(28)), SK());
  B.head(f, HC, W(H), hA, { skin: '#c2cad0', jaw: 1.28, chin: -0.04, nose: 0.78, hook: 0, mouth: 'set', squint: 0, blind: true, faceShade: 0.72, jawShade: 0.14, lips: false, noEar: true, browCol: '#4a4e58', browW: 0.014, browDown: -0.04 });
  for (const [cx, cy, rx, ry] of [[0.13, -0.06, 0.08, 0.046], [0.31, -0.064, 0.032, 0.044]]) {
    f.flat(hF(ell([cx, cy + 0.012], rx * 1.25, ry * 1.4, 0, 14)), '#8a92a4', { op: 0.16 }); // a faint wet socket
    f.flat(hF([[cx - rx, cy + 0.006], [cx - rx * 0.45, cy - ry * 0.95], [cx + rx * 0.5, cy - ry], [cx + rx, cy - ry * 0.1], [cx + rx * 0.5, cy + ry * 0.8], [cx - rx * 0.45, cy + ry * 0.75]]), '#1c2128'); // the eye: almond, all dark, wide
    f.flat(hF(ell([cx + rx * 0.08, cy - ry * 0.05], rx * 0.55, ry * 0.7, 0, 10)), '#323a46', { op: 0.6 }); // the grey seal depth
    f.flat(hF(ell([cx + rx * 0.4, cy - ry * 0.35], rx * 0.2, ry * 0.26, 0, 8)), '#dde6ec', { op: 0.9 }); // wet glint
    f.line(hF([[cx - rx * 1.05, cy - ry * 0.1], [cx - rx * 0.3, cy - ry * 1.15], [cx + rx * 0.5, cy - ry * 1.15], [cx + rx * 1.05, cy - ry * 0.25]]), 1.8, INK, { op: 0.9 }); // a soft upper lid
    f.line(hF([[cx - rx * 0.7, cy + ry * 1.05], [cx + rx * 0.6, cy + ry * 1.0]]), 1, '#5a6074', { op: 0.5 });
  }
  f.line(hF([[0.06, 0.02], [0.1, 0.14], [0.1, 0.22]]), 1.2, '#7a8496', { op: 0.6 }); // a tear-track of frozen brine
  f.line(hF([[0.36, 0.1], [0.38, 0.12]]), 1.6, '#2a2c34'); // the slit nostril
  f.bone('jaw');
  f.flat(hF([[0.14, 0.3], [0.24, 0.288], [0.36, 0.296], [0.34, 0.316], [0.24, 0.322], [0.16, 0.318]]), '#16181e', { op: 0.85 }); // the wide thin mouth, just parted
  f.flat(hF([[0.29, 0.296], [0.305, 0.296], [0.3, 0.312]]), '#e4e6e2'); // one small sharp tooth
  f.line(hF([[0.16, 0.34], [0.26, 0.35], [0.34, 0.34]]), 1.1, '#7a8090', { op: 0.6 }); // grey lower lip
  f.bone('head');
  X.frost(hF([[0.1, -0.3]])[0], W(10), W(6), 6, 1.2); X.cracks(hF([[0.0, 0.12]])[0], W(10), 2, 0.6);
  // the hair over her crown, parted, wet hanks over the brow and down past the cheek (hung plumb)
  f.part(hF([[-0.44, -0.26], [-0.3, -0.5], [-0.04, -0.6], [0.2, -0.54], [0.34, -0.38], [0.28, -0.3], [0.16, -0.36], [0.04, -0.26], [-0.08, -0.2], [-0.2, -0.04], [-0.3, 0.2], [-0.42, 0.1]]), { fill: hair, shadow: '#000', tex: 'hatch702', texOp: 0.3, light: '#4a5058', inkW: 1.5 });
  for (const l of [[[0.0, -0.5], [0.12, -0.38], [0.14, -0.2]], [[0.16, -0.5], [0.26, -0.36], [0.3, -0.24]], [[-0.24, -0.4], [-0.18, -0.1], [-0.12, 0.2]]]) f.stroke(hF(l), W(5), hair);
  const hk = hF([[-0.04, -0.26]])[0]; f.stroke([hk, add(hk, W2([-2, 24])), add(hk, W2([2, 46])), add(hk, W2([0, 62]))], W(7), hair); X.icicle(add(hk, W2([0, 62])), W(10), 4);

  // ---- the knot at her throat: his arm-skins come round from the cloak's shoulders and are tied; one runs on down
  // her chest and ends in his empty hand, flattened and hanging plumb. Her fist grips the knot.
  f.bone('cloak');
  const aS = spline([S.at(-0.2, -0.24), S.at(0.16, -0.18), kn], 6);
  f.part(ribbon(aS, aS.map(() => W(15))), HD({ maxShade: 6 }));
  f.line(aS.map(q => add(q, W2([0, 6]))), 1, sinew, { op: 0.7, dash: '3 3' });
  const anc = lerp(aS[0], aS[aS.length - 1], 0.45); f.line([add(anc, W2([0, -6])), add(anc, W2([0, 6]))], 2, tat); f.line([add(anc, W2([-5, 4])), add(anc, W2([0, 7])), add(anc, W2([5, 4]))], 1.6, tat); // an anchor on his forearm
  f.part(ell(kn, W(18), W(14), 0.3, 14), HD({ inkW: 1.6 }));
  f.line([add(kn, W2([-12, -4])), add(kn, W2([0, 4])), add(kn, W2([12, -2]))], 1.4, hideS, { op: 0.8 });
  const tail = spline([kn, add(kn, W2([8, 30])), add(kn, W2([4, 62]))], 6);
  f.part(ribbon(tail, tail.map((_, i, A) => W(14) * (1 - i / A.length * 0.35))), HD({ maxShade: 6 }));
  for (let i = 2; i < tail.length - 1; i += 3) f.line([lp(tail[i], tail[i + 1], 0, -W(6)), lp(tail[i], tail[i + 1], 0.5, 0), lp(tail[i], tail[i + 1], 0, W(6))], 1, hideS, { op: 0.7 }); // empty, so it creases flat
  // the empty hand: a flat glove of skin, fingers limp and drooping, the nails still on them
  const eh = add(kn, W2([4, 62])), EH = v => add(eh, W2(v));
  f.part([EH([-8, -2]), EH([8, -2]), EH([10, 14]), EH([12, 34]), EH([7, 36]), EH([5, 18]), EH([3, 38]), EH([-2, 38]), EH([-1, 18]), EH([-4, 34]), EH([-9, 32]), EH([-7, 14]), EH([-14, 10]), EH([-12, 4])], HD({ fill: mix(hide, '#c8c8c4', 0.3), maxShade: 4, inkW: 1.1, inkHeavy: 1.3 }));
  f.line([EH([-6, 8]), EH([8, 8])], 1, hideS, { op: 0.6 });
  for (const v of [[10, 33], [5, 36], [-2, 36], [-7, 31]]) f.flat(ell(EH(v), W(1.6), W(1.2), 0, 6), '#7a7a80', { op: 0.8 });
  X.icicle(EH([2, 38]), W(10), 4);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, deg(186), W(24), skin, { tex: 'mottle702', texOp: 0.5, shadow: skinS, name: 'selkie knot' });
  fistDetail(f, gF, W(24), skin, { web });

  // ---- near arm out of the cloak, reaching, the webbed hand open, black nails out
  const [cUN, cFN] = jcut(SN, EN, WN, W(14));
  split(f, () => { f.part(jointLimb(SN, EN, WN, [W(34), W(27), W(19)], { point: 0.45, mus0: 0.22, mus1: 0.24 }), SK({ maxShade: 18 })); X.cracks(lerp(EN, WN, 0.5), W(10), 2, 0.3); X.frost(lp(SN, EN, 0.6, -W(10)), W(10), W(6), 4); f.line([lp(EN, WN, 0.2, -W(6)), lp(EN, WN, 0.8, -W(4))], 1.2, mix(skin, '#fff', 0.4), { op: 0.6 }); f.flat(ell(EN, W(7), W(5), 0, 8), mix(skin, '#fff', 0.2), { op: 0.4 }); }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('hand_n');
  const hn = openHand(f, WN, deg(14), W(74), SK({ fill: mix(skin, PAL.bite, 0.1) }), { back: true, spread: 0.22, curl: 0.45, swell: 0.05, web, nail: '#3a3c44' });
  hn.fing.forEach(g => f.stroke([g.k3, add(g.k3, rot([W(10), 0], Math.atan2(g.k3[1] - g.k2[1], g.k3[0] - g.k2[0]) + 0.4))], W(3), '#2a2c34'));
  // the cloak's shoulder lies over the arm's root (on the cloak bone, so the arm moves under it)
  f.bone('cloak');
  const cap = ZZ([[352, 444], [372, 460], [366, 490], [350, 512], [330, 506], [318, 470], [330, 448]]);
  f.part(cap, HD({ maxShade: 10 }));
  f.stroke(ZZ([[364, 470], [354, 496], [342, 508]]), W(6), inner, { op: 0.9 });
  X.rime(ZZ([[330, 446], [352, 444], [372, 460]]), 10, -1);
  X.icicles(ZZ([[330, 506], [350, 512]]), 2, W(14), 5);

  f.bone('root');
  X.floe(Z([230, 793]), W(240), W(10));
  X.slab2(ZZ([[430, 784], [470, 770], [486, 794], [440, 798]]), W2([6, -5]), { step: 30, snow: 6, bubbles: 4, layers: 1, cracks: 1 });
  return f;
}

// ------------------------------------------------------------------ THE LEVIATHAN IN THE ICE (Ruler 6)
// Cropped like a cathedral seen from inside: the serpent-whale's head breaking up through the pack ice, the long jaw open
// and rising at the heroes. The head is built as a whale's skull under black hide: a long rostrum with a ridge down it,
// the forehead swelling over a heavy brow, the great cheek mass of the jaw muscles behind the eye, the gape cutting back
// past it into folded hide, the lower jaw deep and pleated underneath. The top planes take the light and the rime; the
// sides turn down into black; scars, barnacles and old harpoons cover it. Teeth ice-white, one of them pale stone (the
// Tooth). The huge eye sits low behind the brow, half under an upended slab of sea-ice, looking up through it. The ice
// is pressure ice: broken slabs shoved up on edge, each with its thickness, a snowy top and a ragged broken edge,
// translucent where it is thin, with drowned sailors frozen in it. Behind, the hump of its back carries the fleet's broken
// masts, harpoons and a boarding net. Bones: the ice and plates on the root, the back, the skull, the jaw, the eye.
function leviathan() {
  const [Wc, Hc] = TIERS.ruler, GY = Hc - 30;
  const f = new Fig(foeBase(700, Object.assign({}, WORLD, { groundY: GY, grimeY: null, inkW: 2, inkHeavy: 4.4 })));
  const X = fx(f, 2.4);
  const hide = '#1d2026', hideL = '#4e5664', hideS = '#07080a', hideM = '#2c313a', scar = '#c8ccd0', tooth = '#e6ecee', stone = '#b4b2aa', gum = '#2a282e';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: hideS, light: hideL, tex: 'mottle700', texOp: 0.5, shade: 0.3, maxShade: 90 }, o);
  const hinge = [760, 1080], eyeC = [590, 970];
  f.joint('ice', [800, GY]).joint('back', [200, 1000], 'ice').joint('skull', [560, 1300], 'ice').joint('jaw', hinge, 'skull').joint('eye', eyeC, 'skull').joint('plates', [700, 1500], 'ice');

  // ---- the frozen sea behind: flat pack to the horizon, a far hull locked in it with a mast leaning
  f.bone('ice');
  f.part([[0, 1110], [1600, 1060], [1600, 1600], [0, 1600]], X.IC({ fill: '#aebcc6', shade: 0.1, inkW: 1.4, texOp: 0.6 }));
  for (let i = 0; i < 6; i++) f.line([[0, 1130 + i * 22], [400, 1120 + i * 24], [900, 1110 + i * 26], [1600, 1080 + i * 28]], 1.2, '#8a9cab', { op: 0.5 - i * 0.05 }); // pressure ridges far off
  f.part([[1190, 1110], [1330, 1056], [1520, 1056], [1600, 1072], [1600, 1150], [1250, 1160]], { fill: PAL.hull, shadow: '#040405', tex: 'wood700', shade: 0.2, inkW: 1.6 });
  for (let i = 0; i < 4; i++) f.line([[1210 + i * 10, 1112 + i * 10], [1600, 1078 + i * 12]], 1.4, '#3a3e46', { op: 0.6 });
  f.part(limb([1420, 1066], [1480, 640], 18, 12, { steps: 6 }), { fill: PAL.wood, shadow: '#0c0c0e', tex: 'wood700' });
  rope(f, [[1478, 670], [1540, 840], [1600, 1000]], 3, PAL.rope); rope(f, [[1474, 720], [1400, 900], [1330, 1056]], 3, PAL.rope);
  X.rime([[1330, 1056], [1520, 1056], [1600, 1070]], 16, -1); X.icicles([[1250, 1160], [1600, 1150]], 8, 40, 9);

  // ---- the back: a long black hump arching out of the ice behind the head, the fleet's wreckage frozen into it
  f.bone('back');
  const back = [[0, 1110], [0, 860], [60, 810], [160, 780], [270, 786], [350, 820], [400, 900], [414, 1000], [414, 1110]];
  f.part(back, HD());
  clipDraw(f, back, () => {
    f.flat([[0, 850], [80, 806], [180, 782], [280, 792], [350, 830], [250, 826], [140, 834], [40, 876]], hideL, { op: 0.5 }); // the lit top of the hump
    f.flat([[0, 960], [200, 900], [420, 940], [420, 1120], [0, 1120]], hideS, { op: 0.45 });
    X.scars([200, 860], 160, 70, 9, -0.2, scar); X.barnacles([120, 820], 90, 30, 12, 9); X.cracks([260, 900], 70, 5, 0.4);
    for (let i = 0; i < 6; i++) f.stroke([[30 + i * 60, 900 + (i % 2) * 20], [60 + i * 60, 940], [40 + i * 64, 1000]], 5, hideS, { op: 0.5 }); // folds of hide
  });
  // broken masts, a crossed yard, a frozen rag of sail, slack rigging, harpoons in to the iron with lines hanging
  const mast = (a, b, w) => { f.part(limb(a, b, w, w * 0.7, { steps: 8 }), { fill: PAL.wood, shadow: '#0c0c0e', tex: 'wood700', light: PAL.woodL, inkW: 1.8 }); f.flat(ell(a, w * 0.9, w * 0.5, 0, 10), '#0a0a0c'); f.line([b, add(b, [-8, -14]), add(b, [6, -26]), add(b, [-4, -40])], 4, PAL.woodL); X.rime([a, lerp(a, b, 0.5), b], 10, -1); };
  mast([120, 790], [40, -30], 34); mast([270, 788], [380, 120], 28);
  f.part(limb([350, 360], [210, 330], 14, 12, { steps: 4 }), { fill: PAL.wood, shadow: '#0c0c0e', tex: 'wood700', inkW: 1.4 });
  const sail = [[210, 330], [350, 360], [356, 420], [326, 500], [290, 460], [256, 520], [214, 420]];
  f.part(sail, X.IC({ fill: '#b8c0c4', shade: 0.35, tex: 'weave700', texOp: 0.5, inkW: 1.6 }));
  for (const q of [[[230, 350], [226, 460]], [[290, 356], [290, 480]]]) f.stroke(q, 5, '#7a8690', { op: 0.6 });
  X.icicles([[214, 420], [256, 520], [290, 460], [326, 500]], 7, 40, 9);
  for (const [a, b] of [[[60, 160], [330, 240]], [[380, 140], [470, 400]]]) rope(f, [a, lerp(a, b, 0.5).map((v, j) => j ? v + 40 : v), b], 3, PAL.rope);
  // the boarding net, draped over the hump: its cords follow the hump's curve and sag between the knots
  clipDraw(f, back, () => {
    const NP = (u, v) => { const x = 60 + u * 300, top = 790 - 26 * Math.sin(Math.PI * Math.min(1, x / 380)); return [x + Math.sin(v * 6 + u * 9) * 10 + v * 30, top + 14 + v * 150 * (0.6 + 0.4 * Math.sin(u * Math.PI)) + Math.sin(u * 14 + v * 3) * 10]; };
    for (let i = 0; i <= 8; i++) { if (i === 5) continue; const A = [], Bq = []; for (let k = 0; k <= 10; k++) { A.push(NP(i / 8, k / 10)); Bq.push(NP(k / 10, i / 8)); } f.line(A.slice(0, i % 3 === 1 ? 6 : 11), 3, PAL.rope, { op: 0.8 }); f.line(Bq.slice(i === 3 ? 4 : 0, i === 6 ? 5 : 11), 3, PAL.rope, { op: 0.8 }); for (let k = 0; k <= 10; k += 2) f.flat(ell(NP(i / 8, k / 10), 4, 4, 0, 6), PAL.ropeD); }
  });
  for (const [a, b] of [[[300, 860], [440, 700]], [[180, 900], [120, 700]], [[360, 960], [500, 900]]]) { f.part(limb(a, b, 10, 9, { steps: 4 }), { fill: PAL.wood, shadow: '#0c0c0e', tex: 'wood700', inkW: 1.4 }); f.part([add(a, [-6, -6]), add(a, [12, -8]), add(a, [6, 8])], { fill: PAL.iron, shade: 0.3, inkW: 1, cast: false }); rope(f, [b, add(b, [20, 60]), add(b, [10, 140])], 2.4, PAL.rope); }
  X.rime([[0, 860], [60, 810], [160, 780], [270, 786], [350, 820]], 26, -1);
  X.icicles([[350, 820], [400, 900]], 4, 40, 9);

  // ---- the far side of the upper jaw's teeth, seen across the open gape (on the skull, behind the lower jaw)
  f.bone('skull');
  for (let i = 0; i < 7; i++) { const b0 = lerp([1150, 520], [1500, 330], i / 6), tip = add(b0, rot([0, 40 + (i % 2) * 14], 0.6)); f.part([add(b0, [-10, -4]), add(b0, [10, 4]), [...tip, 1]], { fill: '#9aa6ae', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); }
  // ---- the mouth, riding on the jaw and reaching up past the upper gum so no gap opens when it swings
  f.bone('jaw');
  const lowTop = [[770, 1060], [900, 990], [1060, 900], [1230, 800], [1390, 712], [1480, 670], [1524, 660]];
  const upGum = [[1528, 304], [1440, 334], [1330, 392], [1170, 492], [1010, 600], [880, 708], [790, 826], [745, 934], [730, 1040]];
  f.flat([[770, 1060], [900, 990], [1060, 900], [1130, 858], [1090, 540], [1010, 570], [880, 678], [790, 796], [745, 904], [726, 1040]], gum); // the cavity behind the cheeks
  f.flat([[1060, 900], [1130, 858], [1200, 816], [1160, 500], [1090, 540]], gum, { op: 0.6 });
  for (let i = 0; i < 6; i++) { const b0 = lerp([1200, 790], [1500, 640], i / 5), tip = add(b0, rot([0, -40 - (i % 2) * 12], -0.45)); f.part([add(b0, [-10, 4]), add(b0, [10, -4]), [...tip, 1]], { fill: '#9aa6ae', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); }
  for (let k = 0; k < 5; k++) { const q = lerp([840, 860], [1080, 600], k / 5); f.line([add(q, [-20, 30]), add(q, [10, 6]), add(q, [40, 20])], 3, '#3e3a44', { op: 0.7 }); } // ridges on the palate
  f.flat([[800, 1050], [960, 980], [1100, 900], [1080, 930], [940, 1010]], '#3a3640', { op: 0.9 }); // the tongue, lying in the floor of the mouth
  f.flat([[740, 1050], [790, 1000], [800, 930], [760, 900], [736, 980]], '#08080c', { op: 0.9 }); // the throat going down into the dark
  // the lower jaw: long and deep, the throat pleats running along its underside
  const jaw = [...lowTop, [1540, 680], [1538, 730], [1500, 796], [1380, 890], [1220, 1004], [1060, 1110], [930, 1196], [862, 1262], [832, 1320], [760, 1320], [742, 1150]];
  f.part(jaw, HD());
  clipDraw(f, jaw, () => {
    f.flat([[770, 1066], [900, 996], [1060, 906], [1230, 806], [1390, 714], [1500, 660], [1500, 690], [1380, 750], [1220, 840], [1060, 940], [900, 1030], [780, 1100]], hideM, { op: 0.9 }); // the lip, turned toward the light
    f.line([[780, 1070], [900, 1002], [1060, 912], [1230, 812], [1390, 720], [1490, 668]], 3, hideL, { op: 0.6 });
    for (let k = 0; k < 8; k++) { const o = 70 + k * 24; f.line([[800, 1120 + o * 0.6], [930, 1030 + o * 0.62], [1060, 930 + o * 0.6], [1220, 830 + o * 0.5], [1380, 740 + o * 0.38], [1480, 690 + o * 0.25]], 2.4, hideS, { op: 0.7 }); f.line([[800, 1116 + o * 0.6], [930, 1026 + o * 0.62], [1060, 926 + o * 0.6], [1220, 826 + o * 0.5], [1380, 736 + o * 0.38]], 1.4, hideL, { op: 0.35 }); } // throat pleats
    f.flat([[740, 1240], [1000, 1110], [1300, 910], [1540, 740], [1540, 860], [740, 1340]], hideS, { op: 0.5 }); // the underside, turned away
    X.scars([1060, 960], 200, 60, 9, -0.6, scar); X.barnacles([1350, 760], 70, 24, 8, 9); X.barnacles([920, 1080], 60, 30, 8, 10);
    X.frost([1200, 840], 220, 40, 18, 2);
  });
  // the lower teeth, up into the mouth; the Tooth, pale stone, near the front
  const lowT = []; for (let i = 0; i < 12; i++) lowT.push(lerp([810, 1040], [1490, 668], i / 11));
  lowT.forEach((b0, i) => {
    if (i === 9) return;
    const h = (52 + 30 * Math.sin(i * 1.9) ** 2 + (i < 3 ? -14 : 0)) * (i === 5 ? 0.45 : 1), d = rot([0, -1], -0.45), tip = add(b0, mul(d, h));
    f.part([add(b0, [-18, 7]), add(lerp(b0, tip, 0.5), [-10, 0]), [...add(tip, [-8, 2]), 1], add(lerp(b0, tip, 0.45), [12, -4]), add(b0, [18, -7])], { fill: tooth, shadow: '#7a8a96', shade: 0.35, inkW: 1.4, inkHeavy: 2, cast: false, hatch: false });
    f.line([add(b0, [5, -6]), lerp(b0, tip, 0.8)], 1.4, '#ffffff', { op: 0.7 });
    if (i === 5) f.line([lerp(b0, tip, 0.9), add(lerp(b0, tip, 0.9), [10, 2])], 1.6, INK); // a broken one
  });
  const TB = lowT[9], TT = add(TB, [-44, -176]);
  f.part([add(TB, [-30, 14]), add(TB, [30, -8]), add(lerp(TB, TT, 0.6), [18, 0]), [...TT, 1], add(lerp(TB, TT, 0.5), [-26, 2])], { fill: stone, shadow: '#5a5850', shade: 0.4, inkW: 2, inkHeavy: 3, tex: 'mottle700', texOp: 0.6, hatch: false }); // the Tooth
  for (let i = 1; i < 5; i++) f.line([add(lerp(TB, TT, i / 5), [-20 + i * 3, 2]), add(lerp(TB, TT, i / 5), [15 - i * 2, -6])], 1.4, '#6a6860', { op: 0.7 });
  f.line([add(lerp(TB, TT, 0.2), [4, 0]), add(lerp(TB, TT, 0.5), [-6, 0]), add(lerp(TB, TT, 0.62), [2, 0])], 1.6, '#2a2a26', { op: 0.8 });
  X.rime([[1230, 800], [1390, 712], [1524, 660], [1540, 680]], 18, -1);
  X.icicles([[1500, 796], [1380, 890], [1220, 1004], [1060, 1110]], 12, 70, 12);

  // ---- the skull: the upper jaw rising to the snout at the top right, the forehead and brow swelling back over the
  // eye, the cheek mass behind it running down into the ice
  f.bone('skull');
  const topP = [[300, 1100], [326, 960], [372, 830], [440, 716], [530, 620], [640, 548], [780, 466], [940, 370], [1100, 282], [1260, 204], [1380, 156], [1462, 138], [1522, 156], [1552, 198], [1552, 252]];
  const skull = [[300, 1340], ...topP, [1528, 304], ...upGum.slice(1), [746, 1130], [780, 1220], [800, 1340]];
  f.part(skull, HD());
  clipDraw(f, skull, () => {
    // planes: the top of the rostrum and forehead lit, the side black, turning darker toward the gum and down the
    // cheek; a ridge runs the length of the snout where the top plane turns into the side
    const offT = (d, dy = 1) => topP.map((q, i) => add(q, [d * 0.35, d * dy]));
    f.flat([...topP, ...offT(110).reverse()], hideL, { op: 0.42 });
    f.flat([...topP.slice(3), ...offT(46).slice(3).reverse()], '#7a8492', { op: 0.35 }); // the lit top plane
    f.line(offT(62).slice(3, 14), 6, '#6a7482', { op: 0.6 }); // the rostral ridge where the top turns into the side
    f.line(offT(70).slice(3, 14), 3, hideS, { op: 0.5 });
    f.flat([...upGum, [746, 1130], [780, 1220], [800, 1340], [680, 1340], [660, 1100], [690, 880], [790, 720], [920, 600], [1080, 480], [1250, 380], [1420, 300]], hideS, { op: 0.45 }); // the side darkening toward the gum
    // the side plane bulges over the long maxilla: a soft lit swell and the shadow under it
    f.stroke([[900, 520], [1080, 420], [1260, 330], [1420, 250]], 40, hideM, { op: 0.7 }); f.stroke([[900, 500], [1080, 400], [1260, 312], [1420, 236]], 10, hideL, { op: 0.35 });
    // the brow: a heavy ridge of bone and hide over the eye, lit on top, throwing a shadow down onto the eye
    f.stroke([[430, 900], [520, 864], [620, 866], [720, 900]], 34, hideM, { op: 0.9 }); f.stroke([[440, 890], [530, 852], [620, 852], [710, 884]], 10, hideL, { op: 0.6 });
    f.flat([[450, 920], [540, 890], [640, 892], [720, 930], [700, 960], [620, 930], [520, 930]], hideS, { op: 0.7 });
    // the cheek: the jaw muscles' mass behind and below the eye, swelling over the hinge, its folds packed at the gape
    f.flat([[360, 1040], [460, 1010], [560, 1050], [680, 1060], [740, 1100], [740, 1240], [600, 1280], [420, 1240], [340, 1160]], hideM, { op: 0.8 });
    f.stroke([[380, 1050], [480, 1030], [600, 1060], [700, 1080]], 8, hideL, { op: 0.45 });
    for (let i = 0; i < 6; i++) f.stroke([[700 - i * 4, 980 + i * 34], [730 - i * 10, 1000 + i * 36], [760 - i * 14, 1030 + i * 34]], 6, hideS, { op: 0.7 }); // folds at the corner of the gape
    for (let i = 0; i < 5; i++) f.stroke([[400 + i * 60, 1120 + (i % 2) * 20], [440 + i * 60, 1160], [430 + i * 64, 1220]], 5, hideS, { op: 0.5 });
    // wrinkles radiating from the eye
    for (let i = 0; i < 7; i++) { const a = 2.2 + i * 0.42, p0 = add(eyeC, rot([150, 0], a)), p1 = add(eyeC, rot([200 + (i % 3) * 24, 0], a + 0.12)); f.stroke([p0, lerp(p0, p1, 0.5), p1], 8, hideS, { op: 0.55 }); } // folds of hide gathered behind the eye
    // the fleet's marks: rake scars, the round scars of grapnels, barnacles crusting the snout, frost cracks
    X.scars([1000, 460], 280, 120, 18, -0.6, scar); X.scars([560, 1100], 120, 80, 6, -1.1, scar);
    // eye audit 2026-11-23: these were closed concentric rings (ring within ring) that could read as eyes. Now each is a
    // cluster of broken, overlapping scar arcs of different sizes, off-centre to each other and never closed. The
    // jitter is a fixed hash (not f.r()) so nothing else on the figure moves.
    const hj = k => { const v = Math.sin(k * 12.9898) * 43758.5453; return v - Math.floor(v); };
    [[[860, 600], 18], [[1200, 400], 14], [[520, 1150], 22], [[1060, 560], 12]].forEach(([c, r], n) => {
      for (let m = 0; m < 3; m++) {
        const k = n * 7 + m, rr = r * (0.55 + 0.5 * hj(k)), cc = add(c, [r * (hj(k + 1) - 0.5) * 1.8 + (m - 1) * r * 0.5, r * (hj(k + 2) - 0.5) * 1.2]);
        const a0 = hj(n + 3) * 6.28 + m * 2.3, span = 1.6 + hj(k + 4) * 1.6, pts = []; // each arc turned a different way, so none nest
        for (let t = 0; t <= 8; t++) { const a = a0 + span * t / 8, w = 1 + (hj(k * 3 + t) - 0.5) * 0.35; pts.push(add(cc, [Math.cos(a) * rr * w, Math.sin(a) * rr * 0.75 * w])); }
        f.line(pts, m ? 1.6 : 3, scar, { op: m ? 0.5 : 0.7 });
      }
    });
    X.barnacles([1420, 250], 80, 30, 16, 10); X.barnacles([640, 720], 90, 40, 16, 12); X.barnacles([1060, 440], 70, 24, 10, 9); X.barnacles([1250, 340], 50, 20, 6, 8);
    X.cracks([1120, 440], 120, 8, -0.6); X.cracks([560, 800], 80, 5, -0.4);
    X.frost([960, 460], 400, 60, 30, 2.2);
  });
  // the upper teeth, down from the gum, raked back
  for (let i = 0; i < 11; i++) { const t = i / 10, b0 = lerp([810, 820], [1480, 318], t), h = (56 + 34 * Math.sin(i * 2.3) ** 2) * (i === 4 ? 0.5 : 1), d = rot([0, 1], 0.7), tip = add(b0, mul(d, h)); f.part([add(b0, [-18, -8]), add(lerp(b0, tip, 0.45), [-12, 2]), [...add(tip, [-4, -2]), 1], add(lerp(b0, tip, 0.5), [10, -2]), add(b0, [18, 8])], { fill: tooth, shadow: '#7a8a96', shade: 0.35, inkW: 1.4, inkHeavy: 2, cast: false, hatch: false }); f.line([add(b0, [3, 4]), lerp(b0, tip, 0.8)], 1.4, '#ffffff', { op: 0.7 }); }
  for (const [a, b] of [[[880, 740], [930, 980]], [[1120, 556], [1170, 850]], [[1300, 400], [1350, 730]]]) { f.line([a, lerp(a, b, 0.5).map((v, j) => j ? v : v + 10), b], 3.4, '#dfe8ec', { op: 0.75 }); X.icicle(lerp(a, b, 0.6), 30, 6); } // frozen strings of spittle hung across the gape
  // a blowhole on top, frozen over; two harpoons still in the forehead, lines frozen down its side
  f.flat(ell([640, 570], 46, 14, -0.55, 14), '#06070a'); f.part(ell([640, 570], 42, 10, -0.55, 14), X.IC({ fill: '#c8d4dc', opacity: 0.6 }));
  for (const [a, b] of [[[880, 500], [960, 250]], [[520, 720], [520, 470]]]) { f.part(limb(a, b, 12, 10, { steps: 4 }), { fill: PAL.wood, shadow: '#0c0c0e', tex: 'wood700', inkW: 1.4 }); f.part([add(a, [-8, -4]), add(a, [12, -10]), add(a, [6, 10])], { fill: PAL.iron, shade: 0.3, inkW: 1, cast: false }); rope(f, [lerp(a, b, 0.5), add(a, [-30, 80]), add(a, [-60, 200])], 2.6, PAL.rope); X.rime([a, b], 7, -1); }
  // rime on every windward and upward face, icicles under every overhang
  X.rime(topP.slice(4), 40, -1);
  X.rime(topP.slice(2, 5), 18, -1);
  X.rime([[440, 870], [530, 834], [620, 836], [710, 868]], 14, -1); // snow on the brow
  X.icicles([[1440, 320], [1330, 380], [1170, 480], [1010, 590], [880, 700]], 12, 60, 11);
  X.icicles([[470, 930], [700, 940]], 6, 34, 8); // off the brow

  // ---- the eye: huge, low behind the brow, filmed, the pupil turned up at the company
  f.bone('eye');
  // consistency pass 2026-11-25 (was a big round eye with a pale iris and a catchlight): a deep bony orbit, a small
  // filmed eye sunk in its shadow under heavy lids, the pupil a dull slit turned up at the company; no white glint
  const EA = -0.35, EQ = pts => pts.map(([u, v]) => add(eyeC, rot([u, v], EA)));
  f.flat(EQ(ell([0, 4], 128, 80, 0, 26)), '#0c0d11', { op: 0.75 }); // the orbit's hollow
  f.part(EQ([[-128, 14], [-96, 58], [-30, 86], [50, 84], [118, 52], [138, 14], [112, 34], [50, 60], [-30, 62], [-92, 40]]), HD({ fill: '#3a3f48', maxShade: 16, inkW: 1.6 })); // the orbit's lower bony rim
  f.line(EQ([[-110, 30], [-40, 66], [40, 66], [110, 38]]), 3, hideL, { op: 0.5 });
  for (const [u, v] of [[-80, 52], [-10, 72], [70, 66]]) f.line(EQ([[u, v - 8], [u + 6, v + 8]]), 2, '#0c0d11', { op: 0.7 }); // cracks in the bone
  f.part(EQ([[-62, 6], [-30, -20], [20, -26], [60, -12], [70, 8], [36, 26], [-20, 28], [-56, 20]]), { fill: '#2e3640', shadow: '#101418', light: '#4c5864', shade: 0.45, maxShade: 16, inkW: 1.4, cast: false, hatch: false }); // the eyeball, filmed
  f.flat(EQ(ell([16, -6], 18, 15, 0, 14)), '#5c6a78', { op: 0.6 }); // the clouded iris, rolled up toward the heroes
  f.flat(EQ(ell([18, -8], 4, 11, 0.3, 10)), '#0a0b0e'); // the slit pupil
  f.flat(EQ(ell([8, -14], 6, 3, 0, 8)), '#9aa6b0', { op: 0.35 }); // a dull wet sheen, no catchlight
  for (let i = 0; i < 4; i++) f.line(EQ([[-46 + i * 22, 14 - i * 2], [-34 + i * 22, -6 - i * 4]]), 1, '#2a3440', { op: 0.45 }); // film streaks
  f.part(EQ([[-76, 10], [-58, -30], [-10, -46], [44, -42], [84, -18], [88, 10], [66, -6], [30, -20], [-16, -22], [-56, -6]]), HD({ fill: '#2a2e36', maxShade: 12, inkW: 1.8 })); // the heavy upper lid, down over the top of the eye
  f.line(EQ([[-60, -16], [-12, -34], [40, -32], [78, -12]]), 2, hideL, { op: 0.4 });
  f.part(EQ([[-66, 18], [-24, 34], [30, 34], [74, 14], [70, 26], [28, 44], [-26, 44], [-66, 28]]), HD({ fill: '#2e323a', maxShade: 8, inkW: 1.3, cast: false })); // the sagging lower lid
  for (let i = 0; i < 5; i++) f.line(EQ([[-90 + i * 40, -40 - (i % 2) * 6], [-84 + i * 40, -62 - (i % 2) * 8]]), 3, hideS, { op: 0.55 }); // folds of hide crowding the lid

  // ---- the pressure ice: slabs shoved up on edge, broken, thick, snowed on, translucent where they are thin
  f.bone('plates');
  const drowned = (c, k, op) => { const Q = v => add(c, [v[0] * k, v[1] * k]); f.flat([Q([-8, -40]), Q([8, -40]), Q([14, -20]), Q([18, 30]), Q([6, 34]), Q([2, 10]), Q([-4, 34]), Q([-14, 30]), Q([-12, -20])], '#2e3846', { op }); f.flat(ell(Q([0, -50]), 9 * k, 10 * k, 0, 10), '#2e3846', { op }); f.line([Q([10, -26]), Q([30, -56]), Q([34, -70])], 5 * k, '#2e3846', { op: op * 0.9 }); f.line([Q([-10, -26]), Q([-24, -6])], 5 * k, '#2e3846', { op: op * 0.9 }); };
  // the thin slab over the eye: you see the eye's lower half and a drowned sailor through it
  const rubble = (c, w, n) => { for (let k = 0; k < n; k++) { const q = add(c, [(f.r() - 0.5) * w, (f.r() - 0.3) * 24]), r = 10 + f.r() * 22, a = f.r() * 3; f.part([add(q, rot([-r, r * 0.3], a)), add(q, rot([-r * 0.3, -r * 0.7], a)), add(q, rot([r * 0.8, -r * 0.4], a)), add(q, rot([r, r * 0.5], a)), add(q, rot([0, r * 0.7], a))].map(v => [...v, 1]), X.IC({ fill: f.r() > 0.5 ? '#d6e0e6' : '#9fb1bf', shade: 0.35, inkW: 1.2, inkHeavy: 2 })); } };
  const drift = (pts) => { f.part(pts, X.IC({ fill: '#e8eef2', shade: 0.15, maxShade: 10, inkW: 1.4, inkHeavy: 2, texOp: 0.4 })); f.line(pts.slice(1, -1).map(q => add(q, [0, 8])), 1.2, '#9fb1bf', { op: 0.5 }); };
  const R2 = (pts, ang) => { const c = pts.reduce((s0, q) => add(s0, mul(q, 1 / pts.length)), [0, 0]); return pts.map(q => add(c, rot(sub(q, c), ang))); };
  // back row: a thin slab heaved against the cheek; the eye's lower half shows through it
  X.slab2(R2([[410, 1050], [560, 1010], [780, 1030], [820, 1220], [790, 1370], [470, 1400], [430, 1250]], -0.06), [36, -26], { op: 0.5, fill: '#c4d2dc', maxShade: 18, step: 60, rag: 0.09, snow: 18, bubbles: 30, layers: 4, cracks: 6, tilt: -0.15, inside: () => drowned([700, 1260], 1.5, 0.4) });
  X.slab2(R2([[850, 1200], [940, 1120], [1010, 1160], [1040, 1330], [890, 1370]], 0.42), [-22, -20], { step: 44, rag: 0.1, snow: 14, bubbles: 12, layers: 3, cracks: 3 });
  X.slab2(R2([[1060, 1260], [1170, 1150], [1290, 1150], [1340, 1320], [1290, 1470], [1100, 1500]], -0.38), [-30, -24], { step: 60, rag: 0.1, snow: 18, bubbles: 22, layers: 4, cracks: 4, tilt: -0.3 });
  X.slab2(R2([[1360, 1300], [1470, 1230], [1600, 1250], [1620, 1520], [1400, 1560], [1370, 1420]], 0.2), [24, -18], { step: 60, rag: 0.08, snow: 14, bubbles: 22, layers: 4, cracks: 3, tilt: -0.15 });
  X.slab2(R2([[1240, 1440], [1360, 1400], [1420, 1480], [1380, 1560], [1250, 1540]], -0.6), [18, -16], { step: 40, rag: 0.1, snow: 10, bubbles: 8, layers: 2, cracks: 2 });
  // front left: a big slab shoved up and leaning hard over, a smaller one jammed against it the other way
  X.slab2(R2([[0, 1200], [120, 1100], [300, 1120], [380, 1290], [340, 1480], [0, 1500]], 0.22), [28, -24], { step: 64, rag: 0.09, snow: 18, bubbles: 26, layers: 4, cracks: 5, tilt: 0.25, inside: () => drowned([170, 1350], 1.5, 0.35) });
  X.slab2(R2([[300, 1300], [400, 1260], [470, 1330], [440, 1460], [320, 1470]], -0.5), [-20, -18], { step: 40, rag: 0.1, snow: 12, bubbles: 10, layers: 2, cracks: 2 });
  rubble([380, 1480], 180, 8); rubble([1000, 1530], 160, 7); rubble([840, 1380], 90, 4); rubble([1260, 1560], 120, 5);
  drift([[0, 1600], [0, 1530], [120, 1510], [300, 1500], [420, 1520], [560, 1510], [700, 1530], [880, 1550], [1100, 1560], [1300, 1576], [1500, 1566], [1600, 1584], [1600, 1600]]);
  // front row: low broken plates tipped toward us at odd angles, their snowy tops showing
  X.slab2(R2([[260, 1510], [500, 1450], [760, 1470], [840, 1600], [240, 1600]], 0.08), [16, -18], { step: 70, rag: 0.08, snow: 16, bubbles: 18, layers: 3, cracks: 4 });
  X.slab2(R2([[880, 1500], [1020, 1450], [1140, 1490], [1160, 1600], [860, 1600]], -0.18), [-18, -14], { step: 60, rag: 0.09, snow: 12, bubbles: 10, layers: 2, cracks: 3 });
  X.icicles([[480, 1400], [790, 1370]], 8, 40, 9); X.icicles([[1080, 1540], [1300, 1500]], 5, 30, 8); X.icicles([[0, 1500], [340, 1480]], 6, 30, 8);
  X.frost([800, 1540], 500, 40, 40, 2.4);
  // dark slush in the gaps and cracks spreading across the floe from the head
  for (let i = 0; i < 9; i++) { const a = -0.4 + i * 0.12, p0 = [760, 1560], p1 = add(p0, rot([300 + (i % 3) * 120, 0], a + Math.PI * (i % 2))); f.line([p0, lerp(p0, p1, 0.4).map((v, j) => j ? v + 6 : v), p1], 2.4, '#2a3846', { op: 0.7, straight: true }); }
  return f;
}

module.exports = {
  heroes: [
    { key: 'leviathan_in_the_ice', name: 'The Leviathan in the Ice', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: leviathan },
    { key: 'frost_selkie', name: 'Frost Selkie', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: frostSelkie },
    { key: 'ice_wed_captain', name: 'The Ice-Wed Captain', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: iceWedCaptain },
    { key: 'rime_gulls', name: 'Rime Gulls', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: rimeGulls },
    { key: 'ice_eel', name: 'Ice Eel', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: iceEel },
    { key: 'walrus_brute', name: 'Walrus Brute', tier: 'large', w: 1200, h: TIERS.large[1], flip: true, build: walrusBrute },
    { key: 'frozen_whaler', name: 'Frozen Whaler', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: frozenWhaler },
    { key: 'drowned_deckhand', name: 'Drowned Deckhand', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: drownedDeckhand },
  ],
};
