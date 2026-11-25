// World VII, The Icebound Fleet (Frost + Water), second batch: the eleven entries not in world_VII.js.
// A war fleet sailed north to kill a leviathan; the sea froze mid-battle and the crews are still at their posts. Frost
// (dominant): rime crust on the windward side, icicles hanging plumb, bodies and cloth stopped mid-motion, cracked
// frost-bitten skin. Water underneath: drowned, pale, swollen and wrinkled inside the ice. Palette: white sea, black
// hulls, frozen rigging grey-blue, no warm colour (the surgeon's blood is frozen black; the guns fire by ice, never flame);
// plus ink black, bone and grey.
// Every creature is a foe: drawn facing right with kit.foeBase (key light upper right in drawing space) and flipped on
// render. Windward = the heroes' side = drawing +x. Seeds 720 + index in the task's order (Broadside 720 ... Orca 730).
// groundY = canvas h - 30 on every figure. Rigged from the start: joints first, f.bone() before each part, parts whole.
// Helpers: kit_VII (the first batch's frost kit, required, not edited) and kit_VII_b (sailor builder, free foot, fur).
'use strict';
const K = require('../kit');
const X7 = require('./kit_VII');
const X8 = require('./kit_VII_b');
const { E, B, INK, foeBase, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { PAL, space, fx, spline, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, openHand, mlimb, rope, split, side, muscleBody, ik } = X7;
const { WORLD, SKIN, deg, angOf, freeFoot, shirtPattern, sailor, furFringe, louse, clayPipe, furTex, offsetLine, hairClump, rimeBroken } = X8;

// ------------------------------------------------------------------ FLEET MARINE (Human 1.05)
// A sea-soldier frozen at the charge: musket and bayonet levelled at waist height, the body angled behind it, feet
// wide, the rear knee bent and the weight driving forward off the back foot. Short wool jacket with turned-back facings
// and pewter buttons, cross-belts gone grey and stiff, buttoned gaiters, a round hat with the brim turned up on one side.
// Canvas widened to 1000 x 820 (true size wins): the musket and bayonet reach 1.9 m in front of his hip.
// Rig: standard humanoid + musket (hand_n; the far hand on the fore-stock needs IK) + cartridge box, canteen, scabbard.
function fleetMarine() {
  const Wc = 1000, Hc = TIERS.human[1], GY = Hc - 30, s = 1.05;
  const f = new Fig(foeBase(728, Object.assign({}, WORLD, { groundY: GY, grimeY: 600 })));
  const X = fx(f);
  const W = v => v * s;
  const jk = '#2f3746', jkD = '#1e232e', jkL = '#566174', belt = '#9ea4a6', beltS = '#4a525a';
  // the musket: butt behind the near hip, levelled forward and a little up, bayonet beyond the muzzle
  const B0 = [214, 548], MZ = [806, 478], mA = angOf(B0, MZ), MF = frame(B0, mA, 1);
  // the body pitched forward behind the musket (spine about 32 degrees off plumb, the hunch in the upper back), pelvis
  // low between wide feet: the rear (near) knee bent and driving, the front (far) knee bent over its foot
  const J = { P: [300, 506], C: [344, 412], N: [404, 326], AN: [96, 752], AF: [492, 752], WN: lerp(B0, MZ, 0.16), WF: lerp(B0, MZ, 0.5) };
  const S0 = B.spine(J.N, J.C, J.P, W(100));
  J.SN = S0.at(-0.3, 0.14); J.SF = S0.at(0.4, 0.1); J.HN = S0.at(-0.3, 1.0); J.HF = S0.at(0.34, 1.0);
  [J.KN] = ik(J.HN, J.AN, W(166), W(164), -1); [J.KF] = ik(J.HF, J.AF, W(166), W(164), -1);
  [J.EN] = ik(J.SN, J.WN, W(122), W(106), 1); [J.EF] = ik(J.SF, J.WF, W(122), W(106), -1); // the far elbow forward and out, the hand over the fore-stock
  const r = sailor(f, X, {
    s, J, hA: 0.12, name: 'marine', shirt: 'plain', shirtCol: '#b0b6b8', sleeve: 'full', feet: 'shoe', gaiter: '#2a2e36', gaiterTorn: { f: true },
    jacket: { col: jk, colD: jkD, colL: jkL }, trouser: { col: '#a2a8aa', len: 'knee' }, cap: 'none', queue: true, belly: 0.1, chestW: 1.06,
    face: { jaw: 1.32, chin: 0.05, nose: 1.0, hook: 0.05, mouth: 'set', squint: 0.5, browDown: 0.05, hairCol: '#22242a', browCol: '#22242a', age: false, faceShade: 0.62, jawShade: 0.3 },
    handF: { fn: () => null }, handN: { grip: { thumbAng: mA } },
    afterTorso: ({ S }) => {
      // turned-back facings down the jacket front, pewter buttons (one missing), the leather stock at the throat
      f.part([S.at(0.44, 0.08), S.at(0.62, 0.2), S.at(0.6, 0.66), S.at(0.5, 0.64), S.at(0.46, 0.3)], { fill: '#8e969c', shadow: '#3a424c', tex: 'weave728', texOp: 0.4, inkW: 1.2, maxShade: 20 });
      for (let i = 0; i < 6; i++) { if (i === 3) continue; f.rivet(S.at(0.53, 0.18 + i * 0.085), W(3), PAL.pewter); }
      f.line([S.at(0.55, 0.43), S.at(0.58, 0.46), S.at(0.54, 0.48)], 1.1, '#c8ced2', { op: 0.7 }); // the missing button's thread
      f.part([S.at(-0.3, -0.12), S.at(0.34, -0.1), S.at(0.5, 0.0), S.at(0.4, 0.08), S.at(-0.3, 0.02)], { fill: '#141518', shade: 0.4, inkW: 1.2, tex: 'mottle728' }); // leather stock
      f.line([S.at(-0.2, -0.04), S.at(0.38, -0.02)], 1, '#4a4e56', { op: 0.6 });
      // cross-belts: two broad whitened belts crossing the chest, gone grey and stiff, a plate where they cross
      const bel1 = [S.at(-0.6, -0.04), S.at(0.62, 0.84)], bel2 = [S.at(0.36, -0.06), S.at(-0.7, 0.86)];
      for (const [a, b] of [bel2, bel1]) {
        const bp = [lp(a, b, -0.02, W(13)), lp(a, b, 1.02, W(13)), lp(a, b, 1.02, -W(13)), lp(a, b, -0.02, -W(13))];
        f.part(bp, { fill: belt, shadow: beltS, tex: 'weave728', texOp: 0.35, inkW: 1.3, sharp: true, maxShade: 14 });
        f.line([lp(a, b, 0, W(9)), lp(a, b, 1, W(9))], 0.9, '#5a6268', { op: 0.6, dash: '3 3' });
        for (let i = 0; i < 3; i++) { const q = lerp(a, b, 0.2 + i * 0.25); f.line([add(q, [-W(10), -W(4)]), add(q, [W(8), W(6)])], 1.2, '#eef2f4', { op: 0.5 }); } // frozen spray across them
      }
      const xp = lerp(bel1[0], bel1[1], 0.5);
      f.part(ell(xp, W(16), W(12), -0.4, 12), { fill: PAL.pewter, shade: 0.4, inkW: 1.2, cast: false });
      f.line(ell(xp, W(10), W(7), -0.4, 10), 1, '#3a3e44', { op: 0.6 });
      X.rime([bel2[0], lerp(bel2[0], bel2[1], 0.2)], W(5), -1);
      X.frost(S.at(0.0, 0.5), W(40), W(50), 10);
    },
    afterHead: ({ hF }) => {
      // round hat: a low crown, a broad brim, the far side turned up against the crown with a rimed cockade on it
      const flap = hF([[-0.5, -0.34], [-0.64, -0.72], [-0.46, -1.04], [-0.12, -1.1], [0.08, -0.94], [0.06, -0.6]]);
      f.part(flap, { fill: '#202228', shadow: '#0c0d10', tex: 'mottle728', texOp: 0.5, maxShade: W(20) });
      const crown = hF([[-0.38, -0.36], [-0.36, -0.62], [-0.18, -0.74], [0.12, -0.74], [0.3, -0.62], [0.34, -0.38]]);
      f.part(crown, { fill: '#26282e', shadow: '#0c0d10', tex: 'mottle728', texOp: 0.5, light: '#4a4e58', maxShade: W(24) });
      f.part(hF([[-0.4, -0.42], [0.36, -0.42], [0.36, -0.34], [-0.4, -0.34]]), { fill: '#3a3e46', shade: 0.4, inkW: 1.1, cast: false, sharp: true }); // hat band
      const brim = hF([[-0.56, -0.3], [-0.4, -0.4], [0.2, -0.42], [0.58, -0.36], [0.64, -0.3], [0.4, -0.26], [-0.2, -0.26], [-0.54, -0.24]]);
      f.part(brim, { fill: '#1e2026', shadow: '#0a0b0e', tex: 'mottle728', texOp: 0.4, inkW: 1.4, maxShade: W(8) });
      const ck = hF([[-0.3, -0.9]])[0];
      // (review) the cockade was a ringed disc with a centre dot (an eye motif, not allowed outside the void worlds): now a
      // crushed ribbon bow of black wool, two loops and two tails, with a pewter loop button off-centre, frozen flat
      for (const sg of [-1, 1]) f.part([ck, add(ck, [sg * W(14), -W(9)]), add(ck, [sg * W(17), W(1)]), add(ck, [sg * W(10), W(5)])], { fill: '#343a44', shadow: '#121418', shade: 0.4, inkW: 1.1, cast: false });
      for (const sg of [-1, 1]) f.part([add(ck, [sg * W(2), W(2)]), add(ck, [sg * W(6), W(18)]), add(ck, [sg * W(3), W(16)]), add(ck, [sg * W(1), W(19)]), add(ck, [-sg * W(2), W(4)])], { fill: '#2a2e36', shade: 0.4, inkW: 1, cast: false });
      f.part(ell(add(ck, [W(1), -W(1)]), W(4), W(3), 0.4, 8), { fill: '#3e4450', shade: 0.4, inkW: 1, cast: false });
      f.rivet(add(ck, [W(6), -W(4)]), W(2.4), PAL.pewter);
      X.rime([add(ck, [-W(12), -W(8)]), add(ck, [0, -W(14)]), add(ck, [W(12), -W(8)])], W(5), -1);
      X.rime(hF([[-0.32, -0.66], [-0.1, -0.76], [0.14, -0.76], [0.3, -0.64]]), W(8), -1);
      X.rime(hF([[0.2, -0.43], [0.46, -0.4], [0.62, -0.34]]), W(5), -1);
      X.icicles(hF([[0.62, -0.28], [0.5, -0.27]]), 2, W(18), W(5)); X.icicles(hF([[-0.3, -0.25], [-0.54, -0.24]]), 2, W(20), W(5));

    },
    beforeNear: ({ S }) => {
      // ---- the musket: dark wood stock, iron barrel and lock, ramrod in its pipes, barrel plugged with ice; the
      // socket bayonet on its elbow below the muzzle, an icicle hanging from its point
      f.bone('musket');
      f.part(MF([[-8, -8], [40, -14], [88, -10], [110, -6], [140, -6], [590, -9], [598, -4], [598, 4], [140, 6], [120, 12], [80, 24], [40, 30], [-4, 26], [-10, 8]]), { fill: PAL.wood, shadow: '#141414', tex: 'wood728', texOp: 0.6, light: PAL.woodL, maxShade: 14 });
      f.part(MF([[110, -12], [600, -13], [604, -7], [110, -6]]), { fill: PAL.iron, shadow: '#16181c', light: '#7a8088', shade: 0.4, inkW: 1.2, cast: false, sharp: true }); // barrel
      f.line(MF([[150, -5], [560, -6]]), 2.6, '#4a4e54'); f.line(MF([[150, -5], [560, -6]]), 1, '#14161a'); // ramrod
      for (const x of [260, 420, 540]) f.part(MF([[x, -14], [x + 12, -14], [x + 12, -4], [x, -4]]), { fill: PAL.pewter, shade: 0.3, inkW: 0.9, cast: false, sharp: true }); // barrel bands
      f.part(MF([[102, -18], [142, -18], [146, -6], [102, -6]]), { fill: PAL.ironD, shade: 0.3, inkW: 1, cast: false, sharp: true }); // lock plate
      f.line(MF([[110, -18], [102, -32], [110, -36]]), 3, PAL.iron); f.part(MF([[128, -26], [138, -26], [138, -18], [128, -18]]), { fill: PAL.iron, shade: 0.3, inkW: 0.9, cast: false }); // cock, frizzen
      f.line(ell(MF([[96, 18]])[0], 10, 6, mA, 10).slice(0, 7), 2, PAL.iron); // trigger guard
      f.part(MF([[-10, -10], [-2, -10], [-2, 28], [-10, 26]]), { fill: PAL.pewter, shade: 0.3, inkW: 1, cast: false }); // butt plate
      f.flat(ell(MF([[602, -10]])[0], 5, 4, mA, 8), '#d8e4ea'); // ice in the bore
      f.part(MF([[300, 26], [330, 56], [380, 70], [460, 30], [452, 24], [380, 60], [334, 48], [306, 22]]), { fill: '#2a2c30', shade: 0.4, inkW: 1.1, cast: false }); // the sling hanging slack, frozen stiff
      X.icicles(MF([[340, 58], [400, 66]]), 2, W(16), W(4));
      f.line(MF([[300, 10], [302, 30]]), 2, PAL.iron); f.line(MF([[460, 4], [458, 24]]), 2, PAL.iron);
      // bayonet: socket over the muzzle, the elbow, then a long triangular blade
      f.part(MF([[560, -18], [606, -18], [606, -2], [560, -2]]), { fill: '#5a6068', shade: 0.35, inkW: 1.1, cast: false, sharp: true });
      f.part(MF([[600, -6], [612, 2], [612, 10], [602, 10]]), { fill: '#5a6068', shade: 0.35, inkW: 1, cast: false });
      f.part(MF([[606, 2], [700, 4], [760, 9], [606, 14]]), { fill: '#a4acb4', shadow: '#4a525c', light: '#e0e6ea', shade: 0.3, inkW: 1.3, hatch: false });
      f.line(MF([[610, 8], [740, 8.5]]), 1, '#eef2f4', { op: 0.7 });
      X.icicle(MF([[756, 9]])[0], W(30), W(6));
      X.rime(MF([[150, -14], [300, -15], [450, -15], [590, -15]]), W(5), -1);
      X.frost(MF([[300, 10]])[0], 120, 8, 10, 1.2);
      X.icicles(MF([[60, 28], [200, 10], [400, 6]]), 4, W(18), W(5));
      // far hand on the fore-stock
      f.bone('hand_f');
      const gF = B.grip(f, J.WF, J.EF, mA, W(31), mix(SKIN.skin, PAL.bite, 0.2), { tex: 'mottle728', texOp: 0.5, shadow: SKIN.skinS, name: 'marine far' });
      fistDetail(f, gF, W(31), SKIN.skin, { nail: SKIN.nail });
      X.bite(gF.F([[0.45, 0]])[0], 8, 8, 3, 0.6);
      // kit on the body: cartridge box on the near hip, canteen on its cord, empty bayonet scabbard
      f.bone('cartridge_box');
      const cb = S.at(-0.66, 0.98), cbF = frame(cb, 0.1, 1);
      f.part(cbF([[-W(40), -W(28)], [W(40), -W(30)], [W(42), W(30)], [-W(38), W(32)]]), { fill: '#141518', shadow: '#050506', light: '#3a3c42', tex: 'mottle728', maxShade: 10, sharp: true });
      f.part(cbF([[-W(42), -W(32)], [W(42), -W(34)], [W(44), W(4)], [-W(40), W(6)]]), { fill: '#1c1d21', shade: 0.4, inkW: 1.3, cast: false });
      f.flat(ell(cbF([[0, -W(14)]])[0], W(10), W(8), 0, 10), '#4a4e56', { op: 0.7 });
      X.rime(cbF([[-W(40), -W(32)], [0, -W(34)], [W(42), -W(34)]]), W(6), -1);
      X.icicles(cbF([[-W(38), W(32)], [W(40), W(30)]]), 2, W(16), W(5));
    },
  });
  // canteen on its cord (pelvis), a wooden keg with hoops, and the empty bayonet scabbard on the far hip
  f.joint('cartridge_box', r.S.at(-0.6, 0.9), 'pelvis').joint('musket', J.WN, 'hand_n').joint('canteen', r.S.at(-0.2, 0.6), 'torso');
  f.bone('canteen');
  const cc = r.S.at(-0.5, 1.22);
  f.line([r.S.at(-0.2, 0.6), lerp(r.S.at(-0.2, 0.6), cc, 0.5), cc], 2, '#2a2c30');
  f.part(ell(cc, W(30), W(24), 0.2, 16), { fill: PAL.wood, shadow: '#141414', tex: 'wood728', light: PAL.woodL, maxShade: 14 });
  for (const dx of [-W(14), W(14)]) f.line([add(cc, [dx, -W(22)]), add(cc, [dx + W(2), W(22)])], 2.2, PAL.ironD);
  f.part([add(cc, [-W(5), -W(30)]), add(cc, [W(5), -W(30)]), add(cc, [W(5), -W(20)]), add(cc, [-W(5), -W(20)])], { fill: '#5a5650', shade: 0.3, inkW: 1, cast: false });
  X.rime([add(cc, [-W(24), -W(14)]), add(cc, [0, -W(24)]), add(cc, [W(24), -W(14)])], W(5), -1);
  // the empty bayonet scabbard on its frog at the hip, hanging back at an angle, the chape worn bright
  f.joint('scabbard', r.S.at(-0.2, 0.94), 'pelvis');
  f.bone('scabbard');
  const sc0 = r.S.at(-0.2, 0.94), sc1 = add(sc0, rot([W(150), 0], deg(118)));
  f.part([lp(sc0, sc1, 0, W(9)), lp(sc0, sc1, 0.92, W(5)), [...sc1, 1], lp(sc0, sc1, 0.92, -W(5)), lp(sc0, sc1, 0, -W(9))], { fill: '#141518', shadow: '#050506', light: '#3a3c42', shade: 0.35, inkW: 1.3, maxShade: 6 });
  f.part([lp(sc0, sc1, 0.84, W(6)), lp(sc0, sc1, 1.0, 0), lp(sc0, sc1, 0.84, -W(6))], { fill: PAL.pewter, shade: 0.3, inkW: 1, cast: false });
  f.part([lp(sc0, sc1, -0.06, W(13)), lp(sc0, sc1, 0.12, W(12)), lp(sc0, sc1, 0.12, -W(12)), lp(sc0, sc1, -0.06, -W(13))], { fill: '#202226', shade: 0.4, inkW: 1.1, cast: false, sharp: true }); // the frog
  f.flat(ell(sc0, W(5), W(4), 0, 8), '#050506'); // its empty mouth
  X.icicle(sc1, W(14), W(4));
  return f;
}

// ------------------------------------------------------------------ THE GALLEY COOK (Human 1.0)
// The flagship's cook, a fat old one-legged sailor gone to drowned bloat: belly and jowls sagging over a leather apron,
// leaning his weight onto the good (far) leg with the oak peg planted wide in front. The great iron kettle hangs by its
// bail from his far forearm; the broth froze solid with the ladle standing in it, and he stirs it with the cleaver's
// tip, the cleaver held point-down in the near fist. Things are frozen in the broth: a knuckle bone, a twist of sleeve.
// Rig: standard humanoid (the near shin is the peg, foot_n its iron-shod tip) + kettle (forearm_f) + cleaver (hand_n)
// + apron (pelvis, the stiff skirt). Motion: idle stirs the pot with the cleaver's tip; attack a cleaver chop.
function galleyCook() {
  const GY = TIERS.human[1] - 30, s = 1.0;
  const f = new Fig(foeBase(729, Object.assign({}, WORLD, { groundY: GY, grimeY: 620 })));
  const X = fx(f);
  const W = v => v * s;
  const smock = '#a8aeb0', apron = '#2c2a2c', apronL = '#56524e', iron = '#24262a';
  const J = { P: [282, 480], C: [300, 378], N: [292, 284] };
  const S0 = B.spine(J.N, J.C, J.P, W(100));
  J.SN = S0.at(-0.4, 0.14); J.SF = S0.at(0.36, 0.1);
  J.HN = S0.at(-0.1, 1.0); J.HF = S0.at(0.3, 1.0);
  J.AF = [282, 752]; [J.KF] = ik(J.HF, J.AF, 164, 162, -1);
  J.KN = [366, 612]; const PEG = [436, GY - 4]; J.AN = lerp(J.KN, PEG, 0.82); // the near leg ends at the knee; the peg runs on to the ice
  // the kettle on the far forearm: the forearm level and forward, the bail over it near the wrist
  J.EF = [380, 432]; J.WF = [536, 418];
  const bail = lerp(J.EF, J.WF, 0.74), KC = [bail[0] + 10, 560], kR = 86; // kettle centre and radius
  // cleaver held point-down (reverse grip) in the near fist, its tip in the frozen broth
  const cA = deg(58), CT = [KC[0] - 12, KC[1] - kR * 0.5 + 4], cL = 132, HG = add(CT, rot([-cL, 0], cA)); // tip in the pot, the grip up the blade's line
  J.WN = HG; [J.EN] = ik(J.SN, J.WN, 124, 108, 1);
  f.joint('kettle', bail, 'forearm_f').joint('cleaver', J.WN, 'hand_n').joint('apron', S0.at(0.2, 0.9), 'pelvis').joint('keys', S0.at(-0.5, 0.95), 'pelvis');

  const r = sailor(f, X, {
    s, J: Object.assign({}, J, { HN: null }), hA: 0.16, name: 'cook', shirt: 'plain', shirtCol: smock, sleeve: 'rolled', belly: 0.5, chestW: 1.22, armW: 1.18,
    // (review) the profile was a trapezoid (square shoulders, a straight back): now sloping shoulders, a rounded upper back,
    // the small of the back taken in, a slack chest and the belly hanging lowest at the belt
    prof: [[-0.1, 0.42, 0.42], [0.02, 0.66, 0.6], [0.18, 0.92, 0.78], [0.34, 0.96, 0.84], [0.5, 0.82, 0.86], [0.7, 0.8, 1.14], [0.92, 0.92, 1.42], [1.08, 0.86, 1.34], [1.18, 0.74, 0.86]],
    trouser: { col: '#8a9094', len: 'shin', tar: true }, cap: 'knit', capCol: '#5e6266', capLift: 0.08, belt: false, hemIce: false,
    face: { jaw: 1.45, chin: 0.06, nose: 1.12, hook: 0.35, mouth: 'grim', squint: 0.62, browDown: 0.06, hairCol: '#8a8e92', browCol: '#d4dce2', browW: 0.06, faceShade: 0.7, age: true, gaunt: false },
    handF: { open: { ang: deg(70), back: true, curl: 1, spread: 0.04, flip: true, curls: [1, 1, 1, 1], thumbAng: 1.3 } },
    handN: { grip: { thumbAng: cA + Math.PI, maxBend: 35 } },
    beforeTorso: ({ S }) => {
      // ---- the near leg: thigh in a tarred trouser leg cut and tied off at the knee over the stump, then the oak peg
      // in its leather-lined socket, strapped up the thigh, shod with an iron ring, planted wide
      f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
      f.bone('shin_n');
      const pegT = lerp(J.KN, PEG, 0.08);
      f.part(limb(pegT, PEG, 44, 26, { steps: 10, p: [[0.12, 0.25, 0.06], [0.3, -0.1, 0.1]], q: [[0.12, 0.25, 0.06], [0.3, -0.1, 0.1]] }), { fill: '#5c5850', shadow: '#1e1c1c', light: '#8a857a', tex: 'wood729', texOp: 0.6, maxShade: 14 }); // turned oak, worn
      for (const t of [0.14, 0.3, 0.55]) f.line([lp(pegT, PEG, t, -18 + t * 8), lp(pegT, PEG, t + 0.01, 18 - t * 8)], 1.2, '#141414', { op: 0.6 }); // turned rings
      f.line([lp(pegT, PEG, 0.2, 8), lp(pegT, PEG, 0.85, 5)], 1.6, '#a8a294', { op: 0.5 }); // the worn-bright front
      X.cracks(lerp(pegT, PEG, 0.6), 18, 2, deg(70));
      f.bone('foot_n');
      f.part([lp(J.AN, PEG, 0.1, -16), lp(J.AN, PEG, 0.1, 16), lp(J.AN, PEG, 1.0, 14), lp(J.AN, PEG, 1.0, -14)], { fill: iron, shadow: '#0a0a0c', light: '#5a5e66', shade: 0.35, inkW: 1.3, sharp: true, cast: false }); // iron ring at the tip
      f.flat(ell(add(PEG, [0, 2]), 26, 5, 0, 12), '#1c2430', { op: 0.5 });
      X.cracks([PEG[0], GY - 2], 30, 3, 0); X.frost([PEG[0], GY - 6], 22, 4, 5);
      f.bone('thigh_n');
      const [c1] = jcut(J.HN, J.KN, PEG, 26);
      const th = jointLimb(J.HN, J.KN, lerp(J.KN, PEG, 0.06), [70, 58, 54], { point: 0.2, mus0: 0.12, mus1: 0.05 });
      f.part(th, { fill: '#8a9094', shadow: '#3c444e', tex: 'mottle729', texOp: 0.4, light: '#b0b6ba', maxShade: 34 });
      clipDraw(f, th, () => { for (let i = 0; i < 5; i++) { const q = lerp(J.HN, J.KN, 0.2 + f.r() * 0.7); f.flat(ell(add(q, [(f.r() - 0.5) * 30, 0]), 6 + f.r() * 8, 4 + f.r() * 5, f.r() * 3, 8), '#16181c', { op: 0.45 }); } f.stroke([lp(J.HN, J.KN, 0.4, -30), lp(J.HN, J.KN, 0.5, 0), lp(J.HN, J.KN, 0.45, 26)], 3, '#1a1e28', { op: 0.5 }); });
      // the socket: a leather cup round the stump, a leather bucket strapped on with two straps round the thigh
      const sk = [lp(J.KN, PEG, -0.06, -34), lp(J.KN, PEG, -0.06, 34), lp(J.KN, PEG, 0.12, 24), lp(J.KN, PEG, 0.16, -24)];
      f.part(sk, { fill: '#2a2624', shadow: '#0c0a0a', light: '#4e4844', tex: 'mottle729', maxShade: 12, inkW: 1.4 });
      f.line([lp(J.KN, PEG, -0.04, -32), lp(J.KN, PEG, -0.05, 32)], 2.2, INK, { op: 0.7 });
      for (const t of [0.35, 0.7]) { const a = lp(J.HN, J.KN, t, -34), b = lp(J.HN, J.KN, t + 0.03, 34); f.part([add(a, [0, -7]), add(b, [0, -7]), add(b, [0, 7]), add(a, [0, 7])], { fill: '#26221f', shade: 0.4, inkW: 1.1, cast: false, sharp: true }); const bq = lerp(a, b, 0.6); f.part([add(bq, [-6, -9]), add(bq, [6, -9]), add(bq, [6, 9]), add(bq, [-6, 9])], { fill: PAL.iron, shade: 0.3, inkW: 1, cast: false, sharp: true }); }
      for (const off of [-24, 22]) f.line([lp(J.HN, J.KN, 0.68, off), lp(J.KN, PEG, -0.03, off)], 3, '#26221f');
      X.rime([lp(J.HN, J.KN, 0.2, -36), lp(J.HN, J.KN, 0.6, -34), lp(J.HN, J.KN, 0.95, -30)], 9, 1);
      X.icicles([lp(J.KN, PEG, 0.12, -24), lp(J.KN, PEG, 0.16, 24)], 3, 22, 5);
      // ---- the leather apron, stiff with grease and frost, tied under the belly (drawn before the torso, so the
      // drowned belly sags over its top edge)
      f.bone('apron');
      const ap = [S.at(-0.6, 0.9), S.at(0.2, 0.94), S.at(0.9, 0.96), add(S.at(0.9, 1.0), [22, 40]), add(S.at(0.9, 1.0), [30, 120]), [430, 612, 1], [330, 624], [216, 606, 1], add(S.at(-0.5, 1.0), [-10, 20])];
      f.part(ap, { fill: apron, shadow: '#0c0b0c', light: apronL, tex: 'mottle729', texOp: 0.6, maxShade: 46, inkW: 2 });
      clipDraw(f, ap, () => {
        f.flat([S.at(0.2, 0.9), S.at(0.9, 0.92), S.at(1.0, 1.0), S.at(0.3, 1.0)], '#000', { op: 0.45 }); // the belly's shadow falling on it
        for (let i = 0; i < 9; i++) { const q = [250 + f.r() * 180, 420 + f.r() * 240]; f.flat(ell(q, 8 + f.r() * 16, 5 + f.r() * 10, f.r() * 3, 10), '#0c0b0c', { op: 0.35 }); f.flat(ell(add(q, [-2, -2]), 4 + f.r() * 6, 2 + f.r() * 4, f.r() * 3, 8), '#8a8680', { op: 0.25 }); } // grease stains, glossy
        f.stroke([[250, 540], [320, 560], [400, 552]], 5, '#0c0b0c', { op: 0.55 }); f.stroke([[256, 532], [320, 551], [396, 543]], 2, '#6a6660', { op: 0.5 }); // a hard crease frozen across it
        f.stroke([[240, 560], [252, 610]], 4, '#0c0b0c', { op: 0.5 }); f.stroke([[380, 566], [396, 612]], 4, '#0c0b0c', { op: 0.5 });
        X.cracks([330, 580], 34, 4, 0.3);
        X.frost([340, 540], 70, 50, 12);
      });
      f.line([S.at(-0.6, 0.9), S.at(-0.9, 0.86), S.at(-1.0, 0.92), S.at(-0.94, 1.1)], 4, '#16151a'); // the apron string, knotted behind
      // the meat fork pushed through the apron string, a ring of bread-room keys, a salt horn on a cord
      const fk = S.at(-0.3, 0.92);
      f.line([add(fk, [-6, -70]), add(fk, [4, 40])], 5, '#3a3835'); f.line([add(fk, [4, 40]), add(fk, [10, 96])], 3, PAL.iron);
      for (const dx of [-5, 5]) f.line([add(fk, [8 + dx * 0.2, 90]), add(fk, [10 + dx, 128])], 2.4, PAL.ironD);
      X.rime([add(fk, [-8, -70]), add(fk, [-4, -40])], 4, 1);
      // jagged hem of the apron, frozen stiff, icicles off it
      X.icicles([[216, 606], [330, 624], [430, 612]], 6, 24, 6);
    },
    afterTorso: (r0) => {
      const { S } = r0;
      // (review) the smock as cloth over a fat body: drag folds from the shoulder down over the belly, the belly's
      // stretch, a sweat shadow under the arm, grease stains, the back turned from the light
      clipDraw(f, r0.torso, () => {
        f.flat([S.at(-1.2, -0.2), S.at(-0.5, -0.2), S.at(-0.6, 1.3), S.at(-1.2, 1.3)], '#000', { op: 0.2 });
        for (const [u0, v0, u1, v1, w] of [[0.5, 0.12, 0.9, 0.62, 3.4], [0.2, 0.16, 0.7, 0.74, 2.6], [-0.3, 0.2, 0.2, 0.9, 2.6], [0.6, 0.5, 1.2, 0.82, 3]]) { f.stroke([S.at(u0, v0), S.at((u0 + u1) / 2 + 0.06, (v0 + v1) / 2), S.at(u1, v1)], W(w), '#2a3038', { op: 0.5 }); f.line([S.at(u0 + 0.06, v0 + 0.02), S.at((u0 + u1) / 2 + 0.12, (v0 + v1) / 2 + 0.02), S.at(u1 + 0.06, v1 + 0.02)], W(1.3), '#e8ecee', { op: 0.35 }); }
        for (let i = 0; i < 3; i++) f.line([S.at(0.7, 0.72 + i * 0.08), S.at(1.0, 0.76 + i * 0.08), S.at(1.3, 0.8 + i * 0.07)], W(1.2), '#3a4048', { op: 0.45 });
        f.flat(ell(S.at(-0.2, 0.3), W(30), W(18), 0.6, 10), '#4a525c', { op: 0.3 });
        for (const [u, v, r] of [[0.9, 0.86, 14], [0.4, 0.56, 9], [1.1, 0.98, 10]]) f.flat(ell(S.at(u, v), W(r), W(r * 0.7), 0.3, 10), '#3a3e44', { op: 0.35 });
      });
      // ---- neckcloth; the belly's lowest roll rimed and icicled where it hangs over the apron
      const bly = [S.at(0.3, 1.04), S.at(1.0, 0.96), S.at(1.36, 1.02), S.at(1.0, 1.2), S.at(0.3, 1.22)];
      clipDraw(f, r0.torso, () => { f.flat(bly, '#1c2030', { op: 0.5 }); f.stroke([S.at(0.2, 1.08), S.at(0.8, 1.06), S.at(1.3, 1.0)], 6, '#0e1018', { op: 0.6 }); f.flat([S.at(0.7, 0.5), S.at(1.1, 0.62), S.at(1.3, 0.8), S.at(1.0, 0.74)], '#e4eaee', { op: 0.35 }); });
      X.rime([S.at(0.98, 0.3), S.at(1.3, 0.52), S.at(1.5, 0.74)], 12, -1);
      X.icicles([S.at(0.4, 1.02), S.at(0.9, 1.0), S.at(1.2, 0.9)], 4, 22, 6);
      X.livid(S.at(0.9, 0.85), 26, 12, 4, 0.3);
      f.part([S.at(-0.3, -0.1), S.at(0.4, -0.06), S.at(0.54, 0.06), S.at(0.3, 0.12), S.at(-0.3, 0.06)], { fill: '#6e7276', shade: 0.4, tex: 'weave729', texOp: 0.5, inkW: 1.2 });
      f.part([S.at(0.36, 0.06), S.at(0.5, 0.08), S.at(0.6, 0.26), S.at(0.48, 0.3), S.at(0.4, 0.16)], { fill: '#6e7276', shade: 0.4, inkW: 1, cast: false });
    },
    afterHead: ({ hF, H }) => {
      // jowls and a double chin sagging over the neckcloth, frozen sweat beads on the brow, the broken nose
      const jw = hF([[-0.16, 0.3], [0.04, 0.52], [0.24, 0.6], [0.36, 0.56], [0.32, 0.72], [0.12, 0.78], [-0.08, 0.7], [-0.2, 0.52]]);
      f.part(jw, { fill: '#c0c8cc', shadow: SKIN.skinS, shade: 0.35, tex: 'mottle729', texOp: 0.5, maxShade: 18, hatch: false });
      f.line(hF([[0.0, 0.62], [0.16, 0.68], [0.3, 0.64]]), 1.4, INK, { op: 0.6 });
      f.line(hF([[-0.1, 0.42], [0.02, 0.56], [0.18, 0.6]]), 1.2, INK, { op: 0.5 });
      X.livid(hF([[0.08, 0.6]])[0], 14, 10, 3, 0.3);
      f.line(hF([[0.33, -0.02], [0.37, 0.03], [0.34, 0.07]]), 2, INK, { op: 0.7 }); // the bend of the broken bridge
      for (let i = 0; i < 6; i++) { const q = hF([[0.04 + i * 0.05, -0.2 + (i % 2) * 0.025]])[0]; f.flat(ell(q, 2.8, 3.4, 0, 8), '#e8f0f4', { op: 0.9 }); f.flat(ell(add(q, [0, 1.6]), 2, 1, 0, 6), PAL.iceD, { op: 0.5 }); } // frozen sweat beads
      f.flat(hF(ell([0.13, -0.05], 0.03, 0.012, 0, 8)), '#e0eaf0', { op: 0.8 }); // the small wet eye glazed
      for (const [u, v, l] of [[0.04, 0.78, 24], [0.18, 0.76, 32], [0.3, 0.7, 18]]) X.icicle(hF([[u, v]])[0], l, 5);
    },
    beforeNear: ({ S }) => {
      // ---- the kettle on the far forearm: bail over the arm, a squat iron pot with lugs, rimed, the frozen broth with the
      // ladle standing in it, a knuckle bone and a twist of sleeve frozen in the ice
      f.bone('kettle');
      const kF = frame(KC, 0, kR);
      const rimY = KC[1] - kR * 0.5;
      f.line([[KC[0] - kR * 0.96, rimY + 4], [KC[0] - kR * 0.7, bail[1] + 30], bail, [KC[0] + kR * 0.7, bail[1] + 30], [KC[0] + kR * 0.96, rimY + 4]], 5, '#101114');
      f.line([[KC[0] - kR * 0.7, bail[1] + 30], bail, [KC[0] + kR * 0.7, bail[1] + 30]], 1.6, '#5a5e66', { op: 0.6 });
      const pot = kF([[-1.02, -0.48], [-1.08, -0.1], [-1.0, 0.36], [-0.72, 0.7], [-0.3, 0.86], [0.3, 0.86], [0.72, 0.7], [1.0, 0.36], [1.08, -0.1], [1.02, -0.48]]);
      f.part(pot, { fill: iron, shadow: '#060708', light: '#5c6068', tex: 'mottle729', texOp: 0.6, maxShade: 40, inkW: 2 });
      clipDraw(f, pot, () => {
        for (let i = 0; i < 40; i++) { const q = kF([[(f.r() - 0.5) * 1.9, -0.3 + f.r() * 1.1]])[0]; f.flat(ell(q, 1.6 + f.r() * 2, 1.4 + f.r() * 1.6, 0, 6), '#000', { op: 0.55 }); } // pitting
        f.flat(kF([[0.3, -0.4], [0.9, -0.3], [1.0, 0.2], [0.6, 0.1]]), '#7a808a', { op: 0.25 });
        f.stroke(kF([[-0.9, 0.1], [0, 0.22], [0.9, 0.1]]), 4, '#000', { op: 0.5 }); // the cast seam
        f.flat(kF([[-1.2, 0.5], [1.2, 0.5], [1.2, 1], [-1.2, 1]]), '#3a4652', { op: 0.35 }); // soot gone to frost
      });
      for (const sg of [-1, 1]) f.part(kF([[sg * 1.02, -0.42], [sg * 1.18, -0.44], [sg * 1.2, -0.3], [sg * 1.04, -0.28]]), { fill: iron, shade: 0.4, inkW: 1.2, cast: false }); // lugs
      // the rim, seen from a little above: the broth's frozen face inside it
      const rim = ell([KC[0], rimY], kR * 1.04, kR * 0.2, 0, 24);
      f.part(rim, { fill: '#30333a', shade: 0.3, inkW: 1.8, cast: false, hatch: false });
      const broth = ell([KC[0], rimY + 3], kR * 0.92, kR * 0.15, 0, 22);
      f.part(broth, X.IC({ fill: '#a6b0b6', shadow: '#5d6a74', shade: 0.3, inkW: 1, k: 1 }));
      clipDraw(f, broth, () => {
        f.flat(ell([KC[0] - 30, rimY + 4], 22, 6, 0.1, 10), '#6e6a62', { op: 0.6 }); // fat frozen in a skin
        // a knuckle bone and a twist of sleeve frozen in the broth
        f.part([[KC[0] + 4, rimY + 2], [KC[0] + 30, rimY - 2], [KC[0] + 40, rimY + 4], [KC[0] + 28, rimY + 9], [KC[0] + 6, rimY + 8]], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 1, cast: false, hatch: false });
        f.part([[KC[0] - 64, rimY + 2], [KC[0] - 40, rimY - 4], [KC[0] - 28, rimY + 2], [KC[0] - 44, rimY + 6], [KC[0] - 60, rimY + 9]], { fill: '#3a4250', shade: 0.4, inkW: 1, cast: false });
        f.line([[KC[0] - 60, rimY + 4], [KC[0] - 40, rimY]], 1, '#5a6270', { op: 0.7 });
      });
      // the ladle standing in it, frozen upright, leaning a little
      const ld0 = [KC[0] + 34, rimY + 4], ld1 = add(ld0, rot([150, 0], deg(-80)));
      f.part(limb(ld0, ld1, 9, 7, { steps: 6 }), { fill: '#4a4e54', shade: 0.35, inkW: 1.2, cast: false, light: '#8a9098' });
      f.part(ell(ld1, 6, 4, 0, 8), { fill: '#4a4e54', shade: 0.3, inkW: 1, cast: false });
      X.rime([lerp(ld0, ld1, 0.3), lerp(ld0, ld1, 0.95)], 4, -1);
      X.rime([[KC[0] - kR, rimY - 2], [KC[0], rimY - kR * 0.2 - 2], [KC[0] + kR, rimY - 2]], 8, -1);
      X.icicles(kF([[-0.7, 0.72], [0, 0.88], [0.7, 0.72]]), 5, 30, 7);
      X.icicles(kF([[0.95, -0.4], [1.08, 0.0]]), 2, 22, 6);
          // the cleaver, point-down, its tip in the frozen broth (the near fist is drawn over its grip after this)
      f.bone('cleaver');
      const CF = frame(HG, cA, 1);
      f.part(CF([[-40, -9], [24, -10], [24, 10], [-40, 9]]), { fill: '#2e2c2a', shade: 0.4, tex: 'wood729', inkW: 1.2, cast: false }); // the grip above the fist
      f.part(CF([[-56, -8], [-48, -10], [-46, 10], [-56, 8]]), { fill: PAL.iron, shade: 0.3, inkW: 1, cast: false });
      const bl = CF([[22, -8], [cL - 6, -10], [cL + 4, -2, 1], [cL + 2, 52, 1], [60, 56], [30, 34]]);
      f.part(bl, { fill: '#8a929a', shadow: '#3e464e', light: '#cdd4da', shade: 0.3, inkW: 1.5, hatch: false, maxShade: 12 });
      f.flat(CF([[50, 44], [cL + 2, 40], [cL + 2, 52], [60, 56]]), '#c4ccd2', { op: 0.55 }); f.line(CF([[24, -6], [cL - 4, -9]]), 2, '#2a3038', { op: 0.6 }); // the honed bevel, the thick spine
      f.line(CF([[60, 52], [cL, 50]]), 1.4, '#e8eef2', { op: 0.7 }); // the edge
      for (const x of [78, 104]) f.flat(CF([[x, 55], [x + 5, 49], [x + 10, 54]]), '#2a2e36'); // nicks
      f.flat(CF(ell([44, 16], 5, 5, 0, 8)), '#141618'); // hang hole
      X.frost(CF([[90, 16]])[0], 30, 12, 6, 1.2);
      X.rime(CF([[30, -9], [90, -11], [cL, -12]]), 5, 1);
    },
  });
  // burn scar across the near forearm (sailor draws the arm after this, so re-mark it on the forearm bone)
  f.bone('forearm_n');
  const sc = lerp(J.EN, J.WN, 0.55); f.line([add(sc, [-14, -6]), add(sc, [16, 4])], 7, '#d6dada', { op: 0.7 }); f.line([add(sc, [-12, -4]), add(sc, [14, 4])], 1, INK, { op: 0.5 });
  // the ring of bread-room keys at the hip, a salt horn on its cord
  f.bone('keys');
  const kr = r.S.at(-0.56, 1.02);
  f.line(ell(kr, 14, 10, 0, 12).concat([ell(kr, 14, 10, 0, 12)[0]]), 2.4, PAL.ironD);
  for (let i = 0; i < 4; i++) { const k0 = add(kr, [(i - 1.5) * 7, 8]), k1 = add(k0, [(i - 1.5) * 3, 36 + i * 4]); f.line([k0, k1], 3, PAL.iron); f.part([add(k1, [-5, 0]), add(k1, [5, 0]), add(k1, [5, 8]), add(k1, [-5, 8])], { fill: PAL.iron, shade: 0.3, inkW: 0.8, cast: false, sharp: true }); }
  X.frost(add(kr, [0, 24]), 14, 14, 4);
  const sh0 = r.S.at(-0.7, 0.6), sh1 = add(sh0, [-20, 120]);
  f.line([r.S.at(-0.4, 0.1), sh0], 1.6, '#2a2c30');
  f.part([lp(sh0, sh1, 0, 10), lp(sh0, sh1, 1, 3), lp(sh0, sh1, 1, -3), lp(sh0, sh1, 0, -10)], { fill: '#c4beb0', shadow: PAL.boneS, shade: 0.35, inkW: 1.2, cast: false, hatch: false });
  f.part(ell(sh0, 11, 5, 0, 10), { fill: PAL.wood, shade: 0.3, inkW: 1, cast: false });
  for (let i = 1; i < 4; i++) f.line([lp(sh0, sh1, i * 0.22, -8), lp(sh0, sh1, i * 0.22, 8)], 1, '#7a7468', { op: 0.6 });
  return f;
}

// ------------------------------------------------------------------ THE SAILMAKER (Human 1.0)
// The fleet's sailmaker, whose second trade was sewing up the dead. An old man bent under a sewn hammock carried over
// the near shoulder, frozen as stiff as a log with two round shot at its foot, walking slowly: the weight on the bent
// front leg, the back hunched under the load. The near hand holds the bundle's front end down under his jaw; the far
// hand holds a long sail needle out in front like a dagger, a sailmaker's palm strapped round it. Broad frozen face,
// squinting, a twine end in his lips; the beard frozen into one plate with icicles at its point.
// Canvas widened to 900 x 820: the bundle is a man's length (1.7 m) and runs back and up behind him.
// Rig: standard humanoid + bundle (torso; it rides on the shoulder) + needle (hand_f) + apron (pelvis).
// Motion: idle shifts the bundle's weight while the needle hand twitches; attack a needle stab that stitches a hero.
function sailmaker() {
  const Wc = 900, GY = TIERS.human[1] - 30;
  const f = new Fig(foeBase(727, Object.assign({}, WORLD, { groundY: GY, grimeY: 620 })));
  const X = fx(f);
  const canvas = '#9aa0a2', canvasS = '#454d58', tarT = '#2a2c30';
  const J = { P: [500, 466], C: [512, 388], N: [568, 336], AF: [566, 752], AN: [452, 752] };
  const S0 = B.spine(J.N, J.C, J.P, 100);
  J.SN = S0.at(-0.34, 0.16); J.SF = S0.at(0.36, 0.12); J.HN = S0.at(-0.3, 1.0); J.HF = S0.at(0.32, 1.0);
  [J.KF] = ik(J.HF, J.AF, 164, 162, -1); [J.KN] = ik(J.HN, J.AN, 164, 162, -1);
  // the bundle: front end just under his jaw, rising back over the near shoulder to the foot behind him
  const BF = [600, 372], bA = deg(197), BL = 560, BK = add(BF, rot([BL, 0], bA)), bR = 64;
  J.WN = [586, 448]; [J.EN] = ik(J.SN, J.WN, 124, 108, 1);
  const rpA = angOf(J.EN, J.WN) - Math.PI / 2; // the lashing's tail runs square through the near fist, up to the bundle
  J.WF = [722, 470]; [J.EF] = ik(J.SF, J.WF, 124, 108, 1);
  const nA = angOf(J.EF, J.WF) - 0.08; // the needle held out in a thrusting grip, running on from the forearm at the heroes
  f.joint('bundle', lerp(BF, BK, 0.3), 'torso').joint('needle', J.WF, 'hand_f').joint('apron', S0.at(0.1, 0.92), 'pelvis');
  const r = sailor(f, X, {
    s: 1, J, hA: 0.2, name: 'sailmaker', shirt: 'plain', shirtCol: canvas, sleeve: 'full', feet: 'shoe', belly: 0.14, chestW: 1.12, armW: 1.1,
    trouser: { col: '#3a3c40', colS: '#121316', len: 'full', tar: true }, cap: 'knit', capCol: '#4e5256', handS: 1.12,
    face: { jaw: 1.3, chin: 0.04, nose: 1.1, hook: 0.25, mouth: 'set', squint: 0.8, browDown: 0.07, hairCol: '#a0a6aa', browCol: '#d8e0e4', browW: 0.06, faceShade: 0.72, age: true },
    handF: { grip: { thumbAng: nA, inline: true, bend: -0.08 } }, handN: { grip: { thumbAng: rpA } },
    afterTorso: ({ S }) => {
      // ---- the canvas apron with its pockets, a horn needle case, the fid through the belt, the bench hook hanging
      f.bone('apron');
      const ap = [S.at(-0.2, 0.84), S.at(0.6, 0.8), S.at(0.9, 0.9), add(S.at(0.9, 1.0), [20, 130]), [596, 650, 1], [520, 662], [452, 650, 1], add(S.at(-0.3, 1.0), [-6, 80])];
      f.part(ap, { fill: '#8e9496', shadow: '#3c444e', tex: 'weave727', texOp: 0.5, light: '#b8bec2', maxShade: 30 });
      clipDraw(f, ap, () => {
        for (const [x, y] of [[480, 560], [560, 552]]) { const pk = [[x - 30, y - 24], [x + 30, y - 26], [x + 32, y + 30], [x - 28, y + 32]]; f.part(pk, { fill: '#848a8c', shadow: '#3c444e', shade: 0.35, inkW: 1.2, cast: false, tex: 'weave727', texOp: 0.5 }); f.stitches([[x - 26, y - 20], [x - 24, y + 28], [x + 28, y + 26], [x + 28, y - 22]], '#c8ced0', 0.8); }
        f.stroke([[470, 610], [520, 626], [600, 618]], 4, '#1a1e28', { op: 0.45 });
        for (let i = 0; i < 6; i++) { const q = [450 + f.r() * 160, 520 + f.r() * 140]; f.flat(ell(q, 6 + f.r() * 8, 4 + f.r() * 5, f.r() * 3, 8), '#16181c', { op: 0.4 }); } // tar smears
        f.flat([[430, 620], [640, 620], [640, 680], [430, 680]], '#3a4652', { op: 0.3 });
      });
      X.icicles([[452, 650], [520, 662], [596, 650]], 5, 22, 5);
      // horn needle case standing in the near pocket, a fid through the belt, beeswax on a cord, the bench hook
      const nc = [482, 520]; f.part([add(nc, [-7, -46]), add(nc, [7, -46]), add(nc, [8, 4]), add(nc, [-8, 4])], { fill: '#cdc6b6', shadow: PAL.boneS, shade: 0.35, inkW: 1.1, cast: false, hatch: false }); f.part(ell(add(nc, [0, -48]), 9, 5, 0, 8), { fill: PAL.wood, shade: 0.3, inkW: 1, cast: false });
      for (let i = 1; i < 4; i++) f.line([add(nc, [-7, -46 + i * 11]), add(nc, [7, -45 + i * 11])], 0.9, '#7a7468', { op: 0.6 });
      f.bone('pelvis');
      f.part([S.at(-0.9, 0.86), S.at(0.72, 0.82), S.at(0.74, 0.92), S.at(-0.92, 0.96)], { fill: '#1e1f22', shade: 0.4, tex: 'mottle727', sharp: true, inkW: 1.2 });
      const fd0 = S.at(-0.6, 0.72), fd1 = S.at(-0.4, 1.3);
      f.part([lp(fd0, fd1, 0, 7), lp(fd0, fd1, 0.9, 3), [...fd1, 1], lp(fd0, fd1, 0.9, -3), lp(fd0, fd1, 0, -7)], { fill: '#6a645a', shadow: '#2a2622', shade: 0.35, inkW: 1.2, cast: false, tex: 'wood727' }); // the wooden fid
      const bw = S.at(-0.84, 1.3); f.line([S.at(-0.8, 0.95), bw], 1.6, '#2a2c30'); f.part(ell(bw, 12, 10, 0.3, 10), { fill: '#b0aa98', shadow: '#5a5648', shade: 0.4, inkW: 1.1, cast: false, hatch: false }); f.line(ell(bw, 7, 5, 0.3, 8).slice(0, 5), 1, '#5a5648', { op: 0.7 }); // a lump of beeswax
      const bh = S.at(0.4, 1.0); f.line([bh, add(bh, [4, 40])], 2, PAL.ropeD); f.line([add(bh, [4, 40]), add(bh, [2, 66]), add(bh, [14, 78]), add(bh, [22, 70])], 3.4, PAL.iron); // bench hook on its lanyard
      X.icicle(add(bh, [2, 66]), 12, 4);
      // ball of tarred twine on a lanyard from the belt, swinging frozen at the thigh
      f.bone('apron');
      const tw = S.at(-0.2, 1.46); f.line([S.at(-0.2, 0.94), tw], 1.6, PAL.ropeD); f.part(ell(tw, 18, 16, 0, 14), { fill: tarT, shadow: '#08090a', shade: 0.4, inkW: 1.3, cast: false });
      for (let i = 0; i < 6; i++) f.line([add(tw, [-16, -10 + i * 4]), add(tw, [16, -14 + i * 5])], 0.9, '#5a5e64', { op: 0.6 });
      X.frost(tw, 14, 12, 4);
    },
    afterHead: ({ hF }) => {
      // the beard frozen into one plate jutting forward from the jaw, rimed, icicles at its point; the twine end in the lips
      const bd = hF([[-0.12, 0.2], [0.06, 0.3], [0.2, 0.34], [0.36, 0.36], [0.42, 0.52], [0.36, 0.74], [0.3, 0.92], [0.18, 0.78], [0.0, 0.62], [-0.16, 0.44]]);
      f.part(bd, X.IC({ fill: '#b8c2c8', shadow: '#5d7486', shade: 0.35, inkW: 1.4, inkHeavy: 2.2, tex: X.hoar, texOp: 0.4 }));
      clipDraw(f, bd, () => { for (let i = 0; i < 9; i++) f.line(hF([[-0.08 + i * 0.05, 0.28], [-0.02 + i * 0.045, 0.6], [0.04 + i * 0.035, 0.86]]), 1.1, '#6a7c8c', { op: 0.6 }); f.flat(hF([[0.1, 0.32], [0.36, 0.36], [0.4, 0.5], [0.2, 0.48]]), '#eef3f6', { op: 0.45 }); });
      f.part(hF([[0.16, 0.23], [0.25, 0.21], [0.34, 0.22], [0.36, 0.26], [0.25, 0.27], [0.16, 0.27]]), { fill: '#a8b2b8', shade: 0.4, inkW: 1, cast: false }); // moustache
      for (const [u, v, l] of [[0.3, 0.9, 40], [0.22, 0.84, 26], [0.36, 0.72, 18]]) X.icicle(hF([[u, v]])[0], l, 6);
      const tm = hF([[0.3, 0.255]])[0]; f.line([tm, add(tm, [10, 6]), add(tm, [16, 22]), add(tm, [12, 34])], 2, tarT); // twine end
      X.rime(hF([[0.2, 0.34], [0.36, 0.36], [0.42, 0.52]]), 6, -1);
    },
    beforeNear: () => {
      // ---- the long sail needle in the far fist, point at the heroes, with the sailmaker's palm round the hand
      f.bone('needle');
      const nF = frame(J.WF, nA, 1);
      f.part(nF([[-30, -3], [96, -2.4], [124, 0, 1], [96, 2.4], [-30, 3]]), { fill: '#9aa2aa', shadow: '#3e464e', light: '#e0e6ea', shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false });
      f.flat(ell(nF([[-24, 0]])[0], 2.4, 1.4, nA, 6), '#141618'); // the eye
      f.line(nF([[-28, 0], [-50, 10], [-60, 30]]), 1.4, tarT); // twine through the eye
      X.icicle(nF([[110, 2]])[0], 14, 3);
    },
    afterNear: ({ gN }) => {
      // ---- the bundle: a body sewn in its hammock, frozen as stiff as a log, over the near shoulder
      f.bone('bundle');
      const bF = frame(BF, bA, 1), Lb = BL;
      // the man inside: a round head end, the shoulders broadest, a waist, the hips, the legs tapering to the feet
      const PR = [[0, 0.4], [0.03, 0.66], [0.08, 0.6], [0.14, 0.56], [0.26, 0.68], [0.4, 0.88], [0.5, 0.86], [0.62, 0.96], [0.74, 1.04], [0.81, 0.96], [0.85, 0.62], [0.89, 0.7], [0.95, 0.68], [1, 0.4]]; // the feet in front, the head behind and up
      const prof = t => { let i = 0; while (i < PR.length - 2 && PR[i + 1][0] < t) i++; const [t0, a] = PR[i], [t1, b] = PR[i + 1], u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))); return bR * (a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * u))); };
      const top = [], bot = [];
      for (let i = 0; i <= 40; i++) { const t = i / 40; top.push(bF([[t * Lb, -prof(t)]])[0]); bot.push(bF([[t * Lb, prof(t) * 0.94]])[0]); }
      const bundle = [...top, bF([[Lb + 8, 0]])[0], ...bot.slice().reverse(), bF([[-10, 0]])[0]];
      f.part(bundle, { fill: '#8c9294', shadow: '#363e48', light: '#c0c6c8', tex: 'weave727', texOp: 0.55, maxShade: 50, inkW: 2 });
      clipDraw(f, bundle, () => {
        // the shape of the man inside: the head end, the shoulders, the hands crossed on the chest, the knees, the feet
        f.stroke([bF([[Lb * 0.85, -bR * 0.6]])[0], bF([[Lb * 0.84, 0]])[0], bF([[Lb * 0.85, bR * 0.6]])[0]], 6, '#2a3038', { op: 0.55 }); // the neck pinch under the head
        f.stroke([bF([[Lb * 0.74, -bR]])[0], bF([[Lb * 0.76, bR]])[0]], 7, '#2a3038', { op: 0.35 }); // shoulders
        f.stroke([bF([[Lb * 0.56, -bR * 0.6]])[0], bF([[Lb * 0.53, -bR * 0.1]])[0], bF([[Lb * 0.56, bR * 0.4]])[0]], 5, '#2a3038', { op: 0.45 }); // the crossed hands
        f.stroke([bF([[Lb * 0.28, -bR]])[0], bF([[Lb * 0.27, bR]])[0]], 5, '#2a3038', { op: 0.4 }); // knees
        f.stroke([bF([[Lb * 0.94, -bR * 0.5]])[0], bF([[Lb * 0.97, -bR * 0.2]])[0]], 4, '#2a3038', { op: 0.5 }); // the nose under the canvas
        f.flat(bF([[0, bR * 0.3], [Lb, bR * 0.3], [Lb, bR * 1.2], [0, bR * 1.2]]), '#1c2230', { op: 0.35 });
        // the seam along the top with its rows of stitches, the last stitch through the nose at the head end
        f.line(bF([[10, -bR * 0.55], [Lb * 0.5, -bR * 0.62], [Lb - 10, -bR * 0.5]]), 1.6, '#2a2c30', { op: 0.8 });
        for (let i = 0; i < 30; i++) { const x = 16 + i * (Lb - 30) / 30; f.line(bF([[x, -bR * 0.66], [x + 6, -bR * 0.44]]), 1.4, tarT, { op: 0.85 }); }
        f.line(bF([[Lb * 0.955, -bR * 0.45], [Lb * 0.97, -bR * 0.2]]), 2.2, tarT); f.stroke(bF([[Lb * 0.92, -bR * 0.5], [Lb * 0.955, -bR * 0.3], [Lb * 0.99, -bR * 0.36]]), 4, '#2a3038', { op: 0.6 }); // the last stitch through the nose, puckering the canvas
        for (let i = 0; i < 6; i++) f.line(bF([[60 + i * 80, -bR], [70 + i * 80, bR]]), 1, '#3a4250', { op: 0.35 }); // cross folds frozen in
        X.livid(bF([[300, bR * 0.5]])[0], 120, 16, 6, 0.25);
        f.line(bF([[30, -bR * 0.85], [Lb * 0.6, -bR * 0.95]]), 1.4, '#eef3f6', { op: 0.4 });
      });
      // two round shot sewn into the foot, bulging the canvas
      for (const [x, y] of [[26, -6], [38, 22]]) { const c = bF([[x, y]])[0]; f.part(ell(c, 24, 22, 0, 14), { fill: '#8c9294', shadow: '#363e48', shade: 0.4, inkW: 1.4, cast: false, tex: 'weave727', texOp: 0.5 }); f.line(ell(c, 22, 20, 0, 12).slice(8, 12), 1, '#2a3038', { op: 0.5 }); }
      X.rime(top.slice(3, 38), 12, 1);
      X.icicles(bot.slice(2, 30), 9, 34, 7);
      // a lashing round the head end, its tail hanging down to the near fist
      const l0 = bF([[70, -prof(70 / Lb) - 2]])[0], l1 = bF([[76, prof(76 / Lb) * 0.94 + 2]])[0];
      f.line([l0, l1], 7, INK); f.line([l0, l1], 4.6, PAL.rope);
      rope(f, [l1, lerp(l1, J.WN, 0.5), add(J.WN, rot([-30, 0], rpA))], 4.4, PAL.rope);
      rope(f, [add(J.WN, rot([28, 0], rpA)), add(J.WN, rot([56, 6], rpA)), add(J.WN, rot([70, 22], rpA))], 4.2, PAL.rope);
      X.frost(bF([[260, -20]])[0], 200, 30, 20);
      // the near fist again over the lashing's tail (the bundle sits over the top of the arm)
      f.bone('hand_n');
      const g2 = B.grip(f, J.WN, J.EN, rpA, 31.8, mix(SKIN.skin, PAL.bite, 0.14), { tex: 'mottle727', texOp: 0.5, shadow: SKIN.skinS, quiet: true });
      fistDetail(f, g2, 31.8, SKIN.skin, { nail: SKIN.nail });
    },
  });
  // the sailmaker's palm strapped round the needle hand: a leather band over the back of the hand, the iron thimble
  // plate worn bright on the palm side where it drives the needle
  f.bone('hand_f');
  const g = r.gF; if (g) { f.part(g.F([[-0.5, -0.62], [-0.2, -0.66], [-0.16, 0.64], [-0.48, 0.6]]), { fill: '#2a2624', shadow: '#0c0a0a', shade: 0.35, inkW: 1.2, cast: false, tex: 'mottle727' }); f.part(ell(g.F([[-0.1, -0.78]])[0], 9, 8, 0, 10), { fill: '#6a6e74', light: '#c8ced2', shade: 0.3, inkW: 1.1, cast: false }); f.flat(ell(g.F([[-0.1, -0.8]])[0], 4, 3, 0, 8), '#d8dee2', { op: 0.8 }); }
  return f;
}

// ------------------------------------------------------------------ POWDER MONKEY (Small 0.6)
// A ship's boy of ten sent below for powder as the sea froze, still bringing it: caught mid-run and leaning hard
// forward, the cartridge case hugged to his chest in both arms, the rear foot off the ice, the weight over the front
// foot. Drowned (puffy, wrinkled white face and hands, blue-black lips) and stopped by the frost: his hair frozen
// streaming back from under his cap, icicles from his elbows, chin and jacket hem. A jacket far too big for him, the
// sleeves rolled four times; canvas trousers cut off at the knee; bare feet black with frostbite.
// A child's proportions: the head 1.3x the adult ratio (about 5 heads tall).
// Rig: standard humanoid + case (hand_n; the far hand under it will need IK) + hair (head) + whistle (torso).
// Motion: idle runs in place with stiff cracking strides; action runs a cartridge to an ally.
function powderMonkey() {
  const GY = TIERS.small[1] - 30, s = 0.6, W = v => v * s;
  const f = new Fig(foeBase(724, Object.assign({}, WORLD, { groundY: GY, grimeY: 680 })));
  const X = fx(f, 0.7);
  const jk = '#2c3442', jkD = '#1c212b';
  const J = { P: [282, 606], C: [318, 560], N: [356, 508], AF: [330, 772], AN: [176, 700] };
  const S0 = B.spine(J.N, J.C, J.P, W(100));
  J.SN = S0.at(-0.3, 0.16); J.SF = S0.at(0.36, 0.12); J.HN = S0.at(-0.3, 1.0); J.HF = S0.at(0.3, 1.0);
  [J.KF] = ik(J.HF, J.AF, W(166), W(164), -1); [J.KN] = ik(J.HN, J.AN, W(166), W(164), -1);
  // the case hugged to the chest: a stave cylinder, its axis tipped forward with his lean
  const CC = add(S0.at(1.0, 0.42), [6, 0]), cA = deg(-62), cH = 100, cR = 32, cF = frame(CC, cA, 1); // local +x runs up the case's axis
  J.WN = cF([[cH * 0.34, -cR - 4]])[0]; [J.EN] = ik(J.SN, J.WN, W(124), W(108), 1);
  J.WF = cF([[-cH * 0.46, cR * 0.2]])[0]; [J.EF] = ik(J.SF, J.WF, W(124), W(108), 1);
  f.joint('case', J.WN, 'hand_n').joint('hair', S0.at(-0.2, -0.3), 'head').joint('whistle', S0.at(0.2, 0.05), 'torso');
  const r = sailor(f, X, {
    s, J, hA: -0.06, headS: 1.32, name: 'powder monkey', shirt: 'plain', shirtCol: '#a8aeb0', sleeve: 'full', belly: 0.0, chestW: 0.96, armW: 0.95, handS: 1.15,
    jacket: { col: jk, colD: jkD, colL: '#56606e', long: true }, trouser: { col: '#9aa0a2', len: 'knee' }, cap: 'knit', capCol: '#4a4e54', belt: 'rope', beltCol: '#5a666e',
    footFree: { n: true }, footAng: { n: deg(162) }, iceLen: 20,
    face: { jaw: 0.95, chin: -0.03, nose: 0.82, hook: 0, mouth: 'set', squint: 0.0, browDown: -0.04, hairCol: '#2a2c30', browCol: '#2a2c30', age: false, gaunt: true, faceShade: 0.72, eyeWhite: '#dfe4e6', iris: '#3a4250' },
    mouth: 'open', handN: { open: { ang: cA + Math.PI / 2 + 0.3, back: true, curl: 0.65, spread: 0.06, flip: true } }, handF: { open: { ang: cA - 0.2, back: false, curl: 0.5, spread: 0.08 } },
    afterTorso: ({ S }) => {
      // the jacket too big for him: hanging past the hips, frozen spray streaked down the back, a kerchief at the throat
      for (let i = 0; i < 4; i++) f.line([S.at(-0.86 + i * 0.06, 0.1), S.at(-0.9 + i * 0.04, 0.5), S.at(-0.84 + i * 0.05, 1.0)], W(3), '#e4eaee', { op: 0.45 }); // frozen spray down the back
      f.part([S.at(-0.3, -0.12), S.at(0.34, -0.1), S.at(0.54, 0.04), S.at(0.3, 0.1), S.at(-0.3, 0.04)], { fill: '#3a4250', shade: 0.4, tex: 'weave724', texOp: 0.5, inkW: 1.1 });
      f.part([S.at(0.36, 0.04), S.at(0.52, 0.06), S.at(0.46, 0.3), S.at(0.38, 0.26)], { fill: '#3a4250', shade: 0.4, inkW: 1, cast: false });
      for (const q of [S.at(0.3, 0.3), S.at(0.3, 0.5), S.at(0.3, 0.7)]) f.rivet(q, W(4), PAL.pewter);
      // the gunner's priming wire pushed through the rope belt
      const pw = S.at(-0.4, 0.88); f.line([add(pw, [-W(4), -W(30)]), add(pw, [W(6), W(50)])], 2, PAL.steel); f.line(ell(add(pw, [-W(5), -W(36)]), W(5), W(5), 0, 8).concat([ell(add(pw, [-W(5), -W(36)]), W(5), W(5), 0, 8)[0]]), 1.6, PAL.steel);
      // the tin whistle on its string, swung out behind him and frozen there
      f.bone('whistle');
      const w0 = S.at(0.2, 0.05), w1 = add(S.at(-0.6, 0.3), [-W(30), -W(4)]);
      f.line([w0, lerp(w0, w1, 0.5), w1], 1.2, '#7a8086');
      f.part([add(w1, [-W(20), -W(4)]), add(w1, [W(4), -W(5)]), add(w1, [W(4), W(4)]), add(w1, [-W(20), W(5)])], { fill: PAL.pewter, shade: 0.3, inkW: 1, cast: false, sharp: true });
      X.icicle(add(w1, [-W(8), W(5)]), W(14), 3);
    },
    afterHead: ({ hF }) => {
      // hair frozen streaming back from under the cap, in stiff clumps, icicles hanging from them
      f.bone('hair');
      for (const [u, v, l, a] of [[-0.42, -0.16, 0.5, -0.12], [-0.44, -0.02, 0.62, 0.0], [-0.4, 0.1, 0.46, 0.1], [-0.3, -0.26, 0.38, -0.25]]) {
        const q = hF([[u, v]])[0], L = W(100) * 1.32 * l, d = rot([-1, 0], a), n = [-d[1], d[0]], w = W(16);
        const pts = [add(q, mul(n, w)), add(add(q, mul(d, L * 0.6)), mul(n, w * 0.5)), [...add(q, mul(d, L)), 1], add(add(q, mul(d, L * 0.55)), mul(n, -w * 0.6)), add(q, mul(n, -w))];
        f.part(pts, { fill: '#26282e', shadow: '#0c0d10', light: '#5a5e66', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'hatch724', texOp: 0.3 });
        f.line([q, add(q, mul(d, L * 0.8))], 1, '#6a7078', { op: 0.5 });
        X.rime([add(q, mul(n, -w)), add(add(q, mul(d, L * 0.6)), mul(n, -w * 0.5))], W(5), 1);
        X.icicle(add(q, add(mul(d, L * 0.55), mul(n, w * 0.4))), W(14), 3);
      }
      f.bone('head');
      // a bruise on the cheek under the frost, the hollow cheek
      f.flat(hF(ell([0.1, 0.12], 0.08, 0.06, 0.3, 10)), '#5a5a7a', { op: 0.45 }); f.flat(hF(ell([0.1, 0.12], 0.05, 0.035, 0.3, 8)), '#3e3e5a', { op: 0.35 });
      f.line(hF([[0.04, 0.2], [0.12, 0.3]]), 1, INK, { op: 0.4 });
      // breath frozen on the pant
      X.breath(hF([[0.36, 0.38]])[0], rot([1, 0], -0.4), W(90), W(64));
    },
    beforeNear: () => {
      // ---- the cartridge case: wooden staves bound with three iron hoops, a lid with a rope handle, frost on it
      f.bone('case');
      const body = cF([[-cH / 2, -cR], [cH / 2, -cR], [cH / 2 + 6, -cR * 0.5], [cH / 2 + 8, 0], [cH / 2 + 6, cR * 0.5], [cH / 2, cR], [-cH / 2, cR], [-cH / 2 - 6, cR * 0.5], [-cH / 2 - 8, 0], [-cH / 2 - 6, -cR * 0.5]]);
      f.part(body, { fill: PAL.woodL, shadow: '#1c1c1c', light: '#8a867c', tex: 'wood724', texOp: 0.6, maxShade: 20, inkW: 1.6 });
      clipDraw(f, body, () => { for (let i = -2; i <= 2; i++) f.line(cF([[-cH / 2 - 8, i * cR * 0.4], [cH / 2 + 8, i * cR * 0.42]]), 1.1, '#141414', { op: 0.6 }); f.flat(cF([[-cH, cR * 0.3], [cH, cR * 0.3], [cH, cR * 2], [-cH, cR * 2]]), '#000', { op: 0.25 }); });
      for (const t of [-0.36, 0.0, 0.36]) f.part(cF([[t * cH - 5, -cR - 2], [t * cH + 5, -cR - 2], [t * cH + 5, cR + 2], [t * cH - 5, cR + 2]]), { fill: PAL.iron, shadow: '#101114', shade: 0.35, inkW: 1.1, cast: false });
      const lid = cF([[cH / 2 + 2, -cR - 3], [cH / 2 + 12, -cR - 2], [cH / 2 + 14, cR + 2], [cH / 2 + 2, cR + 3]]);
      f.part(lid, { fill: PAL.wood, shade: 0.35, inkW: 1.3, cast: false, tex: 'wood724' });
      const rh = [cF([[cH / 2 + 12, -cR * 0.4]])[0], cF([[cH / 2 + 30, -cR * 0.1]])[0], cF([[cH / 2 + 30, cR * 0.3]])[0], cF([[cH / 2 + 12, cR * 0.4]])[0]];
      rope(f, rh, 3.4, PAL.rope);
      X.rime(cF([[cH / 2 + 12, -cR], [cH / 2 + 14, 0], [cH / 2 + 12, cR]]), W(10), -1);
      X.rime(cF([[-cH / 2, cR], [0, cR + 1], [cH / 2, cR]]), W(8), -1);
      X.icicles(cF([[-cH / 2 - 6, -cR * 0.5], [-cH / 2 - 8, cR * 0.3]]), 2, W(26), W(6));
      X.frost(CC, cH * 0.4, cR, 8, 1.2);
    },
  });
  // knee patch on the near trouser leg
  f.bone('thigh_n');
  const kp = lerp(J.HN, J.KN, 0.86), kpt = [add(kp, [-W(16), -W(14)]), add(kp, [W(16), -W(16)]), add(kp, [W(18), W(14)]), add(kp, [-W(14), W(16)])];
  f.part(kpt, { fill: '#6a7074', shade: 0.35, sharp: true, inkW: 1, cast: false, tex: 'weave724', texOp: 0.6 }); f.stitches([...kpt, kpt[0]], '#a4aeb4', 0.8);
  return f;
}

// ------------------------------------------------------------------ THE WHITE BEAR (Elite, 1.9 at the shoulder, 3 long)
// A huge old male of the sea-ice, drowned under it and frozen when it climbed back out, coming on over the ice on all
// fours: the long neck stretched forward and the narrow head hung below the shoulders, the near forepaw lifted mid-stride
// and locked there, a little too high and too long. Weight in the massive shoulders and the broad planted forepaw.
// Anatomy (polar bear): rump as high as the withers, a long neck, a small long head with a Roman nose, small ears, short
// claws, huge furred paws; plantigrade hind feet (the heel on the ice). The wet fur hangs plumb in heavy ropes that froze
// where they hung (belly, forelegs, throat: a fringe of icicled tags); the belly sags with the sea it swallowed; lips,
// gums and nose blue-black, the tongue swollen grey; rime thick on the windward front and top; bald flank patches.
// True size (guide 2): 1216 px at the shoulder, 1920 long, so the canvas is widened to 2300 x 1450 (groundY 1420).
// Rig: spine_1 (hips, root) > spine_2 (chest) > neck > head > jaw; legs leg_{fn,ff,hn,hf}_1..3; tail; harpoon, line
// (spine_2); net (spine_2); sleeve (jaw). Motion: the low head swings; attack a lunge and a downward forepaw blow.
function whiteBear() {
  const Wc = 2300, Hc = 1450, GY = Hc - 30;
  const f = new Fig(foeBase(722, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 260 })));
  const X = fx(f, 1.6), FT = furTex(f);
  const fur = '#c2c7c8', furS = '#4c5664', furL = '#eef2f2', skinB = '#b4b4c0', black = '#1c1c26';
  const FUR = (o = {}) => Object.assign({ fill: fur, shadow: furS, light: furL, tex: FT, texOp: 0.75, shade: 0.34, maxShade: 60, inkW: 1.8, inkHeavy: 3.4 }, o);
  const lockPal = c => [mix(c, '#3a4250', 0.08), c, mix(c, '#ffffff', 0.06)];
  // a field of wet locks over an area: rows of short overlapping clumps lying along dir, dark gaps between them
  const locks = (cx, cy, rx, ry, n, dir, c = fur, len = 60, w = 20) => { for (let i = 0; i < n; i++) { const q = [cx + (f.r() - 0.5) * 2 * rx, cy + (f.r() - 0.5) * 2 * ry], a = dir + (f.r() - 0.5) * 0.35, l = len * (0.7 + f.r() * 0.6); hairClump(f, [q, add(q, rot([l * 0.5, (f.r() - 0.5) * 6], a)), add(q, rot([l, 0], a))], w * (0.8 + f.r() * 0.5), { pal: lockPal(c), n: 4, gapOp: 0.16 }); } };
  // skeleton
  const HIP = [430, 560], MID = [820, 500], NK = [1250, 420], HC = [1830, 780], hA = deg(26), HF = frame(HC, hA, 1);
  const HJ = HF([[-160, -10]])[0], JW = HF([[-40, 40]])[0];
  const LEG = {
    hf: { H: [480, 640], K: [610, 950], A: [530, 1300], T: [700, GY] },
    hn: { H: [400, 650], K: [510, 975], A: [386, 1308], T: [566, GY] },
    ff: { H: [1170, 560], K: [1176, 950], A: [1206, 1296], T: [1344, GY] },
    fn: { H: [1240, 560], K: [1294, 930], A: [1486, 1104], T: [1604, 1226] }, // lifted, locked mid-stride
  };
  f.joint('spine_1', HIP).joint('spine_2', MID, 'spine_1').joint('neck', NK, 'spine_2').joint('head', HJ, 'neck').joint('jaw', JW, 'head').joint('tail', [190, 470], 'spine_1');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.H, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`);
  f.joint('harpoon', [1250, 650], 'spine_2').joint('net', [1120, 330], 'spine_2').joint('sleeve', HF([[150, 70]])[0], 'jaw').joint('line', [1000, 1000], 'harpoon');

  // ---- a leg. Bone 1 (upper arm or thigh) lies mostly under the body and is drawn first; bone 2 is the heavy furred
  // forearm or gaskin; bone 3 the paw: a broad pad, five toes, short thick claws, ice balls frozen in the foot fur.
  const upper = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', c = mix(fur, '#5a6270', far ? 0.3 : 0.06);
    f.bone(`leg_${k}_1`);
    const up = jointLimb(L.H, L.K, lerp(L.K, L.A, 0.2), front ? [260, 180, 160] : [300, 190, 160], { point: 0.3, mus0: 0.2, mus1: 0.12 });
    f.part(up, FUR({ fill: c }));
  };
  const lower = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', lifted = k === 'fn', tone = far ? 0.3 : 0, c = mix(fur, '#5a6270', tone), LK = FUR({ fill: c, light: mix(furL, '#8a929a', tone) });
    f.bone(`leg_${k}_2`);
    if (front) {
      const lo = front ? jointLimb(lerp(L.H, L.K, 0.7), L.K, lerp(L.K, L.A, 1.06), [190, 176, 148], { point: 0.3, mus0: 0.14, mus1: 0.22 }) : jointLimb(lerp(L.H, L.K, 0.75), L.K, lerp(L.K, L.A, 1.04), [190, 150, 104], { point: 0.55, mus0: 0.1, mus1: 0.34 });
      f.part(lo, LK);
      clipDraw(f, lo, () => {
        locks(...lerp(L.K, L.A, 0.45), 70, Math.abs(L.A[1] - L.K[1]) * 0.5, 22, angOf(L.K, L.A) + 0.1, c, 56, 20);
        f.flat([lp(L.K, L.A, -0.3, front ? -120 : 120), lp(L.K, L.A, 1.2, front ? -120 : 120), lp(L.K, L.A, 1.2, front ? -30 : 30), lp(L.K, L.A, -0.3, front ? -40 : 40)], furS, { op: 0.32 });
        f.flat([lp(L.K, L.A, -0.3, front ? 100 : -100), lp(L.K, L.A, 1.2, front ? 100 : -100), lp(L.K, L.A, 1.2, front ? 50 : -50), lp(L.K, L.A, -0.3, front ? 50 : -50)], furL, { op: 0.3 });
      });
      // the elbow / heel point, the wet fur roped off the back of the leg, the windward rime down its front
      furFringe(f, X, [lp(L.K, L.A, 0.0, front ? -84 : 78), lp(L.K, L.A, 0.45, front ? -76 : 70), lp(L.K, L.A, 0.8, front ? -68 : 62)], front ? 7 : 4, front ? 130 : 80, 34, c, { tex: FT, ice: 0.5 });
      X.rime([lp(L.K, L.A, 0.08, front ? 88 : -80), lp(L.K, L.A, 0.5, front ? 80 : -72), lp(L.K, L.A, 0.92, front ? 72 : -64)], 16, front ? 1 : -1);
    } else {
      // (independent review) the hind gaskin was an even column with a square top and a comb of fur cones. Now: broad
      // under the stifle, the calf muscle bulging behind and running into the Achilles, narrowing to the ankle; the wet
      // fur hangs off the back in separate hanks with their own strands and blunt clumped ends, a few iced
      const K = L.K, A = L.A, BK = [[-0.05, 108], [0.18, 116], [0.42, 100], [0.66, 62], [0.86, 44], [1.02, 38]];
      const gk = [lp(K, A, -0.22, -70), lp(K, A, 0.05, -92), lp(K, A, 0.3, -84), lp(K, A, 0.58, -66), lp(K, A, 0.84, -52), lp(K, A, 1.02, -50), lp(K, A, 1.08, 0), ...BK.slice().reverse().map(([t, o]) => lp(K, A, t, o)), lp(K, A, -0.24, 84)];
      f.part(gk, LK);
      clipDraw(f, gk, () => {
        locks(...lerp(K, A, 0.4), 60, Math.abs(A[1] - K[1]) * 0.45, 18, angOf(K, A) + 0.1, c, 50, 18);
        f.flat([lp(K, A, -0.3, 40), lp(K, A, 1.2, 26), lp(K, A, 1.2, 160), lp(K, A, -0.3, 170)], furS, { op: 0.34 });
        f.flat([lp(K, A, -0.3, -110), lp(K, A, 1.2, -110), lp(K, A, 1.2, -46), lp(K, A, -0.3, -56)], furL, { op: 0.28 });
        f.stroke([lp(K, A, 0.3, 104), lp(K, A, 0.52, 64), lp(K, A, 0.66, 40)], 5, furS, { op: 0.55 }); // the calf's lower edge
        f.line([lp(K, A, 0.62, 48), lp(K, A, 0.98, 32)], 3, furL, { op: 0.6 }); f.line([lp(K, A, 0.62, 30), lp(K, A, 0.98, 18)], 2.4, furS, { op: 0.55 }); // the Achilles
        f.stroke([lp(K, A, 0.1, -70), lp(K, A, 0.45, -50), lp(K, A, 0.8, -36)], 3, furS, { op: 0.35 }); // the shin's front muscle
      });
      for (let i = 0; i < 6; i++) {
        const t = 0.0 + i * 0.15, o = BK.reduce((a, [tt, oo], j) => (j && t >= BK[j - 1][0] && t <= tt) ? BK[j - 1][1] + (oo - BK[j - 1][1]) * (t - BK[j - 1][0]) / (tt - BK[j - 1][0]) : a, 60) - 14;
        const r = lp(K, A, t, o), l = (150 - i * 18) * (0.8 + f.r() * 0.4), sw = (f.r() - 0.5) * 16;
        hairClump(f, [r, add(r, [sw * 0.4 - 8, l * 0.45]), add(r, [sw - 4, l])], 32 - i * 3, { pal: lockPal(c), n: 5, gapOp: 0.6 });
        if (f.r() < 0.45) X.icicle(add(r, [sw - 4, l - 6]), 16 + f.r() * 22, 5);
      }
      for (const dx of [-20, 14]) { const r = add(lp(K, A, -0.08, -70), [dx, 0]); hairClump(f, [r, add(r, [2, 34]), add(r, [-2, 66])], 22, { pal: lockPal(c), n: 4, gapOp: 0.5 }); }
      X.rime([lp(K, A, 0.1, -88), lp(K, A, 0.5, -68), lp(K, A, 0.92, -52)], 14, -1);
      furFringe(f, X, [lp(K, A, -0.24, -86), lp(K, A, -0.26, 0), lp(K, A, -0.22, 104)], 6, 110, 36, c, { tex: FT, ice: 0.4 }); // the haunch's fur hanging over the stifle, so the gaskin has no top edge
    }
    f.bone(`leg_${k}_3`);
    let paw, toes;
    if (lifted) {
      // the near forepaw hanging from a wrist locked in mid-stride: flexed, the pads turned back and down
      const pd = angOf(L.A, L.T), PF = frame(L.A, pd, 1);
      // (consistency pass 2026-11-25: was a mitten) the paw's front edge stops at the knuckles; five separate toes in an
      // arc stand out beyond it, the middle ones longest, with fur tufts between them
      paw = PF([[-40, -86], [70, -90], [140, -76], [170, -44], [176, 18], [150, 74], [80, 92], [-20, 86], [-70, 40], [-74, -40]]);
      toes = [0, 1, 2, 3, 4].map(i => [PF([[190 - Math.abs(i - 2) * 11, -60 + i * 30]])[0], pd + 0.3 + (i - 2) * 0.12]);
      f.part(paw, LK);
      clipDraw(f, paw, () => { locks(...PF([[60, 0]])[0], 100, 60, 14, pd, c, 46, 18); f.flat(PF([[-100, 30], [240, 30], [240, 120], [-100, 120]]), furS, { op: 0.35 }); });
      f.part(PF([[-10, 44], [110, 38], [150, 70], [60, 92], [-14, 80]]), { fill: '#2a2a34', shadow: '#0c0c12', light: '#5a5a66', shade: 0.3, inkW: 1.4, cast: false, hatch: false }); // the black palm pad
      X.cracks(PF([[60, 66]])[0], 30, 3, pd);
    } else if (front) {
      const A = L.A, T = L.T;
      paw = [[A[0] - 84, A[1] - 30], [A[0] + 70, A[1] - 40], [T[0] - 20, GY - 112], [T[0] + 40, GY - 84], [T[0] + 58, GY - 40], [T[0] + 40, GY, 1], [A[0] - 104, GY, 1], [A[0] - 112, GY - 54]]; // (consistency pass) knuckles arched over the toes, not a mitten
      toes = [0, 1, 2, 3, 4].map(i => [[T[0] + 62 - i * 30 - (i > 2 ? 6 : 0), GY - 24 - (i === 0 ? 8 : 0) + i * 2], deg(14 - i * 3)]);
      f.part(paw, LK);
      clipDraw(f, paw, () => { locks(A[0] + 60, GY - 80, 120, 50, 14, deg(80), c, 50, 20); f.flat([[A[0] - 140, GY - 36], [T[0] + 100, GY - 36], [T[0] + 100, GY + 10], [A[0] - 140, GY + 10]], furS, { op: 0.4 }); });
    } else {
      // plantigrade hind foot carrying weight: the heel set down behind the ankle, the long sole pressed flat on the ice,
      // the instep sloping to the toes; the fur splays out where the sole presses, the toes spread and dig in
      const A = L.A, T = L.T, ach = lp(L.K, A, 1.0, 34), ank = lp(L.K, A, 0.98, -48), ins = [T[0] - 10, GY - 88];
      paw = [ach, add(ach, [-26, 34]), [A[0] - 78, GY - 40], [A[0] - 70, GY - 2, 1], [T[0] + 72, GY - 2, 1], [T[0] + 82, GY - 28], [T[0] + 54, GY - 66], ins, add(lerp(ank, ins, 0.5), [0, -8]), ank];
      toes = [0, 1, 2, 3, 4].map(i => [[T[0] + 46 - i * 25, GY - 24 + i * 2], deg(22)]);
      f.part(paw, LK);
      clipDraw(f, paw, () => { locks(lerp(A, T, 0.5)[0], GY - 56, 110, 30, 12, deg(60), c, 44, 16); f.flat([[A[0] - 140, GY - 34], [T[0] + 120, GY - 34], [T[0] + 120, GY + 10], [A[0] - 140, GY + 10]], furS, { op: 0.42 }); f.line([add(ach, [-10, 30]), [A[0] - 60, GY - 30]], 2.4, furS, { op: 0.5 }); });
      for (let i = 0; i < 9; i++) { const q = [A[0] - 60 + i * (T[0] - A[0] + 100) / 8, GY - 16]; hairClump(f, [q, add(q, [(i - 4) * 3, 8]), add(q, [(i - 4) * 6 + (f.r() - 0.5) * 8, 18])], 16, { pal: lockPal(mix(c, '#5a6270', 0.2)), n: 3, gapOp: 0.4 }); }
    }
    toes.forEach(([tq, ca], i) => {
      // (consistency pass) each toe its own size, a knuckle lump and a dark fur gap to the next; claws thick, curved, uneven
      const tr = [0.82, 1.0, 1.06, 0.98, 0.86][i], rx = 27 * tr, ry = 21 * tr;
      f.part([add(tq, rot([-rx, -ry * 0.7], ca)), add(tq, rot([-rx * 0.2, -ry * 1.05], ca)), add(tq, rot([rx * 0.7, -ry * 0.8], ca)), add(tq, rot([rx * 1.04, -ry * 0.1], ca)), add(tq, rot([rx * 0.8, ry * 0.7], ca)), add(tq, rot([0, ry * 0.95], ca)), add(tq, rot([-rx * 0.9, ry * 0.6], ca))], LK);
      f.line([add(tq, rot([-rx * 0.8, -ry * 0.75], ca)), add(tq, rot([-rx * 1.05, ry * 0.3], ca))], 2.4, INK, { op: 0.6 }); // the gap behind the toe
      f.stroke([add(tq, rot([-rx * 0.6, -ry * 0.9], ca)), add(tq, rot([-rx * 1.2, -ry * 1.3], ca))], 6, mix(c, '#1c2028', 0.5), { op: 0.55 }); // a fur tuft between the toes
      f.line([add(tq, rot([-rx * 0.2, -ry * 0.7], ca)), add(tq, rot([rx * 0.5, -ry * 0.55], ca))], 1.6, '#f4f8fa', { op: 0.5 }); // the lit knuckle
      const broken = lifted && i === 2, cl = broken ? 8 : [22, 30, 33, 29, 20][i];
      f.part([add(tq, rot([rx * 0.6, -ry * 0.45], ca)), add(tq, rot([rx * 0.6 + cl * 0.55, -ry * 0.5], ca)), add(tq, rot([rx * 0.6 + cl, -ry * 0.1], ca)), add(tq, rot([rx * 0.6 + cl * 1.02, ry * 0.25], ca)), add(tq, rot([rx * 0.6 + cl * 0.72, 0], ca)), add(tq, rot([rx * 0.5, ry * 0.3], ca))], { fill: black, shadow: '#000', light: '#5a5a66', shade: 0.3, inkW: 1.2, cast: false, hatch: false }); // curved, hooked down
      if (broken) f.flat(ell(add(tq, rot([24, 0], ca)), 5, 5, 0, 8), PAL.blood, { op: 0.7 }); // the claw broken to the quick
    });
    // ice balls frozen into the fur of the foot; slush round the planted paws; sea-ice welded to the hind feet
    const bb = E.bbox(paw);
    for (let i = 0; i < 7; i++) { const q = [bb[0] + 30 + f.r() * (bb[2] - bb[0] - 60), bb[1] + (bb[3] - bb[1]) * (0.45 + f.r() * 0.45)]; f.part(ell(q, 9 + f.r() * 7, 8 + f.r() * 5, 0, 10), X.IC({ fill: '#dfe7ec', inkW: 1, inkHeavy: 1.2 })); }
    if (!lifted) f.flat(ell([(bb[0] + bb[2]) / 2, GY + 2], (bb[2] - bb[0]) * 0.7, 10, 0, 16), '#1c2430', { op: 0.4 });
    if (!front) X.slab2([[L.A[0] - 120, GY - 8], [L.A[0] - 96, GY - 70], [L.A[0] - 16, GY - 86], [L.A[0] + 14, GY - 6]], [14, -10], { step: 30, snow: 6, bubbles: 6, layers: 2, cracks: 1 });
  };

  // ---- far legs, the near upper legs (under the body), and the tail
  upper('hf', true); upper('ff', true); upper('hn', false); upper('fn', false);
  lower('hf', true); lower('ff', true);
  f.bone('tail');
  f.part([[240, 410], [170, 430], [150, 486], [190, 520], [250, 490]], FUR());
  furFringe(f, X, [[160, 496], [200, 516]], 3, 60, 24, fur, { tex: FT });

  // ---- body, neck and shoulders in one outline: the rump rounded and as high as the withers, the back dipping a little
  // behind the shoulder hump, the long thick neck stretched forward and down; under it the belly, swollen and sagging
  const bodyPts = [[196, 600], [176, 470], [214, 370], [300, 302], [440, 274], [600, 296], [760, 336], [920, 336], [1060, 296], [1160, 262], [1270, 276], [1380, 330], [1500, 414], [1620, 516], [1720, 620],
    [1712, 700], [1660, 770], [1590, 800], [1500, 796], [1420, 806], [1352, 840], [1318, 904], [1290, 966], [1200, 1024], [1060, 1090], [900, 1128], [760, 1120], [650, 1076], [576, 1010], [500, 950], [400, 920], [300, 860], [230, 760]];
  const cutA = [940, 300], cutB = [1340, 320];
  split(f, () => {
    f.part(bodyPts, FUR());
    clipDraw(f, bodyPts, () => {
      // form: the barrel turning under into shadow, the sagging belly darkest, the lit back and windward chest
      f.flat([[0, 880], [500, 900], [900, 940], [1300, 880], [1800, 820], [1800, 1200], [0, 1200]], furS, { op: 0.32 });
      f.flat([[300, 1010], [700, 1050], [1000, 1040], [1300, 980], [1300, 1200], [300, 1200]], '#2a3240', { op: 0.32 });
      f.flat([[250, 330], [500, 284], [800, 330], [1100, 280], [1300, 300], [1600, 520], [1500, 520], [1240, 380], [900, 400], [500, 380]], furL, { op: 0.3 });
      // the shoulder: the blade laid back from the withers to the point of the shoulder, the deltoid mass, the triceps
      // bulging over the elbow; the haunch: a broad round of muscle over the hip, the hamstrings running down behind
      f.stroke([[1100, 300], [1180, 520], [1290, 760]], 46, furS, { op: 0.2 }); f.stroke([[1130, 300], [1210, 520], [1316, 750]], 16, furL, { op: 0.35 });
      f.stroke([[1150, 720], [1220, 860], [1300, 900]], 30, furS, { op: 0.28 });
      f.stroke([[330, 330], [300, 520], [330, 760]], 40, furS, { op: 0.22 }); f.stroke([[600, 380], [580, 620], [540, 900]], 34, furS, { op: 0.22 }); f.stroke([[560, 390], [520, 600], [480, 860]], 12, furL, { op: 0.3 });
      // the coat: wet locks lying down and back over the whole body, following the form (down the flank, back along
      // the neck, down the legs), dense
      locks(760, 640, 520, 330, 330, deg(96), fur, 110, 18);
      locks(1460, 600, 180, 140, 90, deg(40), fur, 100, 18);
      locks(360, 580, 150, 260, 80, deg(100), fur, 100, 18);
      // bald patches on the flank: pale wrinkled skin where the fur sloughed off in the sea
      for (const [c, rx, ry] of [[[680, 780], 66, 42], [[900, 840], 44, 30], [[430, 600], 36, 48]]) {
        const pts = []; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2; pts.push(add(c, [Math.cos(a) * rx * (0.7 + f.r() * 0.4), Math.sin(a) * ry * (0.7 + f.r() * 0.4)])); }
        f.part(pts, { fill: skinB, shadow: '#5e6276', shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false, tex: 'mottle722', texOp: 0.5 });
        clipDraw(f, pts, () => { for (let k = 0; k < 9; k++) { const q = add(c, [(f.r() - 0.5) * rx * 1.6, (f.r() - 0.5) * ry * 1.6]); f.line([q, add(q, [rx * 0.3, 2]), add(q, [rx * 0.6, -1])], 1, '#4a4a60', { op: 0.6 }); } X.livid(c, rx * 0.6, ry * 0.6, 4, 0.35); });
        for (let k = 0; k < 18; k += 2) { const q = pts[k]; hairClump(f, [add(q, [0, -12]), add(q, [4, 10]), add(q, [2, 28])], 14, { pal: lockPal(fur), n: 3, gapOp: 0.4 }); }
      }
      // old rake scars from other bears along the flank; the musket ball lodged as a lump under the chest skin
      X.scars([780, 660], 160, 40, 5, 0.25, '#e6ecee');
      const mb = [1330, 870]; f.flat(ell(add(mb, [4, 10]), 26, 20, 0, 12), furS, { op: 0.5 }); f.flat(ell(mb, 22, 17, 0, 12), furL, { op: 0.7 }); f.flat(ell(add(mb, [-2, 0]), 8, 7, 0, 8), '#4a4e58', { op: 0.6 });
      X.livid([820, 1040], 260, 40, 10, 0.3);
    });
  }, [['spine_1', side(cutA, [-1, -0.1], 140)], ['spine_2', [side(add(cutA, [-70, -7]), [1, 0.1], 140), side(cutB, [-1, 0.2], 160)]], ['neck', side(add(cutB, [-70, 14]), [1, -0.2], 160)]]); // (review) child regions run 70 px past each cut, so a turn overlaps instead of opening a wedge down the body

  // ---- near lower legs in front of the body (the belly's frozen fur ropes hang over their tops)
  lower('hn', false); lower('fn', false);
  // ---- frozen ropes of wet fur along the under line (belly lowest, chest, throat), hanging plumb; rime thick along the
  // windward top, the chest and the face of the neck
  f.bone('spine_1');
  furFringe(f, X, [[500, 950], [576, 1010], [650, 1076], [800, 1124]], 13, 150, 46, fur, { tex: FT, ice: 0.4 });
  rimeBroken(f, X, [[214, 370], [300, 302], [440, 274], [600, 296], [760, 336], [880, 336]], 26, -1);
  f.bone('spine_2');
  furFringe(f, X, [[800, 1124], [960, 1122], [1100, 1080], [1230, 1010]], 15, 180, 50, fur, { tex: FT, ice: 0.4 });
  rimeBroken(f, X, [[900, 336], [1060, 296], [1160, 262], [1270, 276], [1350, 312]], 32, -1);
  X.rime([[1352, 840], [1318, 904], [1290, 966]], 18, -1);
  f.bone('neck');
  furFringe(f, X, [[1352, 840], [1420, 806], [1500, 796], [1590, 800], [1660, 770]], 13, 110, 44, fur, { tex: FT, ice: 0.4, sharp: 0.1 });
  rimeBroken(f, X, [[1350, 312], [1450, 380], [1560, 466], [1660, 560], [1720, 620]], 34, -1);

  // ---- the torn boarding net over the far shoulder (seen over the withers), its knots iced, torn strands hanging
  f.bone('net');
  const netPts = []; for (let r2 = 0; r2 < 6; r2++) for (let c = 0; c < 7; c++) netPts.push([1030 + c * 48 + r2 * 10 + Math.sin(c + r2) * 6, 250 + r2 * 46 + c * 7 + Math.sin(c * 1.7) * 8]);
  const nl = (a, b) => { const m = lerp(a, b, 0.5).map((v, j) => j ? v + 8 : v); f.line([a, m, b], 5, INK, { op: 0.75 }); f.line([a, m, b], 2.8, PAL.rig); };
  for (let r2 = 0; r2 < 6; r2++) for (let c = 0; c < 6; c++) if (!(r2 === 3 && c > 2 && c < 5)) nl(netPts[r2 * 7 + c], netPts[r2 * 7 + c + 1]);
  for (let c = 0; c < 7; c++) for (let r2 = 0; r2 < 5; r2++) if (!(r2 === 2 && c === 4)) nl(netPts[r2 * 7 + c], netPts[(r2 + 1) * 7 + c]);
  for (const q of netPts) f.part(ell(q, 7, 6, 0, 8), X.IC({ fill: '#dfe7ec', inkW: 0.9, inkHeavy: 1 }));
  for (let r2 = 0; r2 < 6; r2++) X.icicle(add(netPts[r2 * 7 + 6], [0, 5]), 24, 5);
  for (const c of [1, 3, 5]) { const q = netPts[5 * 7 + c]; rope(f, [q, add(q, [6, 60]), add(q, [2, 120])], 2.6, PAL.rig); X.icicle(add(q, [2, 118]), 16, 4); }


  // ---- the whaler's harpoon broken off in the near shoulder, its frozen line trailing to the ice
  f.bone('harpoon');
  const hp0 = [1250, 650], hp1 = add(hp0, rot([320, 0], deg(-152)));
  f.flat(ell(hp0, 30, 20, 0.5, 12), '#141018'); f.spatter(hp0, 30, 14, PAL.blood);
  f.part(limb(hp0, hp1, 26, 22, { steps: 8 }), { fill: PAL.wood, shadow: '#141414', tex: 'wood722', light: PAL.woodL, maxShade: 12 });
  f.part([lp(hp0, hp1, -0.02, -16), lp(hp0, hp1, 0.1, -14), lp(hp0, hp1, 0.1, 14), lp(hp0, hp1, -0.02, 16)], { fill: PAL.iron, shade: 0.4, inkW: 1.2, cast: false, sharp: true });
  f.line([hp1, add(hp1, [-8, -10]), add(hp1, [4, -18]), add(hp1, [-6, -28])], 4, PAL.woodL);
  for (const t of [0.4, 0.7]) { f.line([lp(hp0, hp1, t, -12), lp(hp0, hp1, t + 0.02, 12)], 5, INK, { straight: true }); f.line([lp(hp0, hp1, t, -11), lp(hp0, hp1, t + 0.02, 11)], 3, PAL.rope, { straight: true }); }
  X.rime([lp(hp0, hp1, 0.15, -12), lp(hp0, hp1, 0.9, -11)], 8, -1);
  f.bone('line');
  rope(f, [lp(hp0, hp1, 0.4, 10), [1150, 840], [1040, 1020], [960, 1220], [880, GY - 6], [740, GY - 2], [600, GY]], 5, PAL.rope);
  X.icicles([[1150, 840], [1040, 1020], [960, 1220]], 4, 30, 6);

  // ---- the head, carried low and forward below the shoulders: a long narrow bear's skull with a Roman nose
  f.bone('jaw');
  const jr = pts => pts.map(([u, v]) => { const q = rot([u + 40, v - 40], 0.12); return [q[0] - 40, q[1] + 40]; }); // the jaw dropped on its hinge
  const jaw = HF(jr([[-100, 60], [0, 56], [100, 64], [176, 64], [186, 80], [160, 100], [60, 108], [-30, 104], [-100, 84]]));
  f.part(jaw, FUR({ maxShade: 20 }));
  clipDraw(f, jaw, () => locks(...HF(jr([[40, 86]]))[0], 100, 14, 10, hA + 0.3, fur, 36, 14));
  f.flat(HF(jr([[0, 56], [100, 62], [176, 62], [172, 72], [100, 72], [0, 66]])), '#22222e'); // the black lower lip
  f.part(HF(jr([[20, 52], [100, 58], [150, 60], [130, 68], [40, 66]])), { fill: '#7a7c88', shadow: '#3a3a4a', shade: 0.4, inkW: 1.1, cast: false, hatch: false }); // the swollen grey tongue
  for (const [u, l] of [[164, 28], [140, 14], [118, 12]]) { const q = HF(jr([[u, 60]]))[0]; f.part([add(q, rot([-6, 0], hA)), add(q, rot([6, 0], hA)), add(q, rot([0, -l], hA + 0.12))], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 1, cast: false, hatch: false }); }
  furFringe(f, X, HF(jr([[-90, 88], [40, 106], [150, 98]])), 6, 70, 24, fur, { tex: FT, ice: 0.5 });
  const dl = HF(jr([[170, 76]]))[0]; f.line([dl, add(dl, [4, 70]), add(dl, [0, 150])], 5, '#d8e4ea'); f.line([dl, add(dl, [4, 70]), add(dl, [0, 150])], 1.4, PAL.iceD, { op: 0.6 }); X.icicle(add(dl, [0, 146]), 16, 6); // the frozen drool cord
  // the sailor's jacket sleeve frozen in the jaws at the corner, hanging: navy wool, its buttoned cuff, rimed
  f.bone('sleeve');
  const sv0 = HF(jr([[100, 70]]))[0], sv = [add(sv0, [-28, -12]), add(sv0, [26, -16]), add(sv0, [40, 80]), add(sv0, [48, 170]), add(sv0, [20, 196]), add(sv0, [-20, 184]), add(sv0, [-22, 90])];
  f.part(sv, { fill: '#6a7486', shadow: '#2a303c', light: '#8a96a6', tex: 'weave722', texOp: 0.45, maxShade: 18 });
  f.part([add(sv0, [-22, 160]), add(sv0, [48, 164]), add(sv0, [48, 198]), add(sv0, [-22, 192])], { fill: '#4a5466', shade: 0.4, inkW: 1.3, cast: false });
  for (const dx of [2, 24]) f.rivet(add(sv0, [dx, 180]), 4, PAL.pewter);
  f.stroke([add(sv0, [-8, 30]), add(sv0, [10, 120])], 5, '#0c0e14', { op: 0.6 }); f.stroke([add(sv0, [24, 20]), add(sv0, [34, 130])], 4, '#0c0e14', { op: 0.5 });
  X.rime([add(sv0, [26, -16]), add(sv0, [40, 80]), add(sv0, [48, 170])], 10, 1);
  X.icicles([add(sv0, [-22, 194]), add(sv0, [48, 198])], 3, 30, 6);
  f.bone('head');
  // (consistency pass 2026-11-25: was a straight-sided wedge) the cranium swells behind the eye, a slight stop, the long
  // Roman nose bowing up to the nose pad; the upper lip's flews hang below the jaw line; the cheek muscle bulges at the back
  const skull = HF([[-186, 30], [-180, -50], [-156, -104], [-104, -128], [-50, -120], [-8, -96], [20, -86], [70, -88], [130, -80], [180, -64], [212, -42], [224, -12], [218, 18], [196, 36], [168, 54], [132, 60], [88, 52], [40, 52], [-20, 62], [-60, 80], [-96, 94], [-150, 86]]);
  f.part(skull, FUR({ maxShade: 30 }));
  clipDraw(f, skull, () => {
    f.flat(HF([[-200, 26], [220, 26], [220, 100], [-200, 100]]), furS, { op: 0.36 });
    f.flat(HF([[-130, -100], [-50, -104], [20, -80], [130, -72], [190, -46], [120, -30], [0, -52], [-110, -66]]), furL, { op: 0.5 }); // the lit top plane of the skull and muzzle
    f.stroke(HF([[-6, -88], [6, -66], [0, -44]]), 7, furS, { op: 0.35 }); // the stop under the brow
    f.stroke(HF([[-60, 20], [-40, 50], [-70, 74]]), 16, furS, { op: 0.3 }); f.line(HF([[-110, 0], [-80, -20], [-40, -10]]), 2.4, furL, { op: 0.6 }); // the cheek muscle's mass and its lit top edge
    for (const [u0, v0] of [[60, -50], [96, -46], [134, -40]]) f.line(HF([[u0, v0], [u0 + 12, v0 + 14], [u0 + 8, v0 + 30]]), 1.4, furS, { op: 0.45 }); // the muzzle's skin creased by the snarl
    f.stroke(HF([[90, 40], [130, 48], [160, 42]]), 6, '#2a2a36', { op: 0.35 }); // the shadow under the hanging flew
    f.stroke(HF([[30, -70], [110, -70], [190, -52]]), 5, '#ffffff', { op: 0.35 }); // the lit bridge of the Roman nose
    f.stroke(HF([[40, 10], [110, 14], [180, 6]]), 18, furS, { op: 0.22 }); // the muzzle's side turning under
    f.stroke(HF([[176, 20], [196, 30], [206, 14]]), 8, '#ffffff', { op: 0.25 }); // the swollen upper lip by the nose
    f.stroke(HF([[-80, -10], [-66, 30], [-90, 64]]), 12, furS, { op: 0.35 }); // the jaw muscle's edge
    locks(...HF([[-90, 0]])[0], 70, 50, 26, hA + 0.5, fur, 40, 16);
    locks(...HF([[60, -20]])[0], 90, 24, 16, hA + 0.2, fur, 30, 12);
    // the healed cutlass slash across the muzzle: a white seam with stitch-like scar ticks
    const s0 = HF([[80, -70]])[0], s1 = HF([[130, 30]])[0]; f.line([s0, lerp(s0, s1, 0.5).map((v, j) => j ? v : v + 6), s1], 8, '#eef2f4', { op: 0.95 }); f.line([s0, s1], 1.3, '#5a5e6a');
    for (let i = 1; i < 5; i++) { const q = lerp(s0, s1, i / 5); f.line([add(q, [-7, -2]), add(q, [7, 2])], 1.3, '#5a5e6a', { op: 0.7 }); }
  });
  // the nape's fur running over the back of the skull so the head grows out of the neck instead of sitting on it
  const nape = HF([[-196, 40], [-200, -60], [-160, -104], [-110, -100], [-96, -40], [-110, 40], [-150, 86]]);
  f.part(nape, FUR({ inkW: 0, inkHeavy: 0, cast: false, maxShade: 26 }));
  clipDraw(f, nape, () => locks(...HF([[-150, -10]])[0], 40, 60, 24, hA + 0.9, fur, 60, 16));
  // lips drawn back from the teeth, blue-black; the upper canine and incisors; the black nose; the small sunk eye
  f.flat(HF([[-30, 44], [40, 42], [120, 38], [192, 26], [190, 38], [120, 50], [40, 54], [-30, 58]]), '#22222e');
  for (const [u, l] of [[176, 30], [156, 14], [136, 12], [116, 12]]) { const q = HF([[u, 42]])[0]; f.part([add(q, rot([-7, 0], hA)), add(q, rot([7, 0], hA)), add(q, rot([0, l], hA - 0.1))], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 1, cast: false, hatch: false }); }
  f.part(HF([[184, -38], [210, -24], [220, 2], [208, 18], [184, 10], [176, -14]]), { fill: black, shadow: '#000', light: '#5a5a6a', shade: 0.3, inkW: 1.3, cast: false, hatch: false });
  f.flat(ell(HF([[206, 2]])[0], 6, 3.4, hA, 8), '#000'); f.line(HF([[186, -30], [206, -20]]), 1.4, '#7a7a8a', { op: 0.6 });
  const eye = HF([[24, -54]])[0];
  // (review) the eye was a ringed round eye with a catchlight: now a small dark almond sunk in a shadowed socket, the
  // brow's fur ledge hanging over its top half, rimed
  f.flat(ell(eye, 15, 9, hA - 0.1, 12), furS, { op: 0.55 });
  f.flat([add(eye, rot([-9, 0], hA)), add(eye, rot([0, -3.5], hA)), add(eye, rot([9, -1], hA)), add(eye, rot([0, 3.5], hA))], '#0a0a0e');
  f.flat(ell(add(eye, rot([3, -1], hA)), 1.6, 1, 0, 6), '#6a727c', { op: 0.5 });
  f.part([add(eye, rot([-26, -6], hA)), add(eye, rot([-4, -16], hA)), add(eye, rot([22, -12], hA)), add(eye, rot([16, -2], hA)), add(eye, rot([0, -4], hA)), add(eye, rot([-16, 0], hA))], FUR({ maxShade: 6, inkW: 0.8, inkHeavy: 1.2, cast: false }));
  X.rime([add(eye, rot([-22, -9], hA)), add(eye, rot([0, -17], hA)), add(eye, rot([20, -13], hA))], 6, -1); X.frost(add(eye, [0, -18]), 14, 4, 5);
  const ear = HF([[-128, -100], [-146, -132], [-182, -126], [-182, -90]]);
  f.part(ear, FUR({ maxShade: 10, inkW: 1.4 })); f.flat(HF([[-142, -106], [-154, -122], [-170, -118], [-170, -102]]), '#5a5e6c', { op: 0.6 });
  rimeBroken(f, X, HF([[-186, -80], [-182, -112], [-146, -126], [-104, -130], [-50, -122], [-8, -98], [40, -90], [100, -86], [160, -70], [206, -46]]), 16, -1); // follows the new skull line (consistency pass)
  X.icicles(HF([[-150, 80], [-60, 80], [20, 56]]), 4, 26, 6);
  X.breath(HF([[214, 14]])[0], rot([1, 0], hA - 0.7), 120, 90);
  f.bone('root');
  f.flat(ell([900, GY + 4], 900, 16, 0, 30), '#1c2430', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ ICE-EDGE ORCA (Large, 1.4 tall at the fin, 2.0 long)
// An orca drowned under the closing ice, slid up on its belly onto the floe's edge: the front half on the ice, braced on
// its flippers, head lifted and jaws open; the tail still in the black water of the lead behind it. Water: swollen,
// the belly sagging in pale wrinkled folds, the skin peeling in grey sheets along the flank. Frost: the tall dorsal
// fin curled over at the tip is rimed on its windward face and hung with icicles along its trailing edge; the
// blowhole sealed with a plug of ice. True size: 896 px to the fin tip and 1280 long (the tail under water), so the
// canvas is widened to 1700 x 1100.
// Rig: body (root) > head > jaw; fin; flipper_n, flipper_f; tail (the stock dipping into the water); net (jaw);
// harpoon (body). Motion: idle a slow rock on the ice edge; attack a surging slide and a dragging bite.
function iceEdgeOrca() {
  const Wc = 1700, Hc = TIERS.large[1], GY = Hc - 30;
  const f = new Fig(foeBase(730, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 40 })));
  const X = fx(f, 1.4);
  const hide = '#191a20', hideL = '#4a505c', hideS = '#050508', white = '#d2d8dc', whiteS = '#6a7484', saddle = '#7a848e';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: hideS, light: hideL, tex: 'mottle730', texOp: 0.5, shade: 0.3, maxShade: 50, inkW: 2, inkHeavy: 3.6 }, o);
  const WH = (o = {}) => Object.assign({ fill: white, shadow: whiteS, light: '#f2f6f8', tex: 'mottle730', texOp: 0.4, shade: 0.3, maxShade: 30, inkW: 0, inkHeavy: 0, cast: false }, o);
  const EDGE = 770; // the floe's broken edge: ice to the right, the black water of the lead to the left
  const HJ = [1420, 820], JH = [1446, 826];
  f.joint('body', [1000, 900]).joint('head', HJ, 'body').joint('jaw', JH, 'head').joint('fin', [1040, 680], 'body').joint('tail', [700, 900], 'body');
  f.joint('flipper_n', [1300, 980], 'body').joint('flipper_f', [1260, 960], 'body').joint('harpoon', [1200, 960], 'body').joint('net', [1560, 840], 'jaw');

  // ---- the lead's black water and the floe's broken edge (root)
  f.bone('root');
  f.flat([[0, GY - 6], [EDGE + 20, GY - 6], [EDGE + 20, Hc], [0, Hc]], PAL.sea);
  for (let i = 0; i < 6; i++) f.line([[40 + i * 120, GY + 2 + (i % 2) * 6], [110 + i * 120, GY + 3 + (i % 2) * 6]], 1.4, PAL.seaL, { op: 0.7 });
  for (let i = 0; i < 9; i++) { const q = [60 + f.r() * 640, GY - 2 + f.r() * 16]; f.part(ell(q, 14 + f.r() * 20, 5 + f.r() * 4, 0, 10), X.IC({ fill: '#c4d0d8', inkW: 0.9, inkHeavy: 1 })); } // slush and brash ice
  // the far flipper behind the body
  f.bone('flipper_f');
  f.part([[1250, 950], [1340, 980], [1420, 1040], [1440, 1062], [1390, 1066], [1300, 1040], [1230, 1000]], HD({ fill: '#101116', maxShade: 12 }));

  // the floe's edge: a broken thickness face at the lead, slabs heaved where the orca slid up
  f.part([[EDGE, GY], [EDGE + 14, GY - 4], [EDGE + 30, Hc], [EDGE - 10, Hc]], X.IC({ fill: '#7d93a5', shadow: '#4e6274', shade: 0.25, inkW: 1.3, inkHeavy: 1.8 }));

  // ---- tail stock, body and head in one fusiform outline (split between the tail, body and head bones): the melon
  // rounding into the back, the back rising to the fin and falling away to the tail stock, which dips under the water;
  // underneath, the chest and belly spread flat on the ice under their own drowned weight
  const body = [[1612, 730], [1600, 690], [1560, 640], [1500, 606], [1420, 590], [1300, 596], [1180, 616], [1060, 642], [960, 672], [860, 716], [760, 780], [660, 854], [580, 926], [520, 990], [480, 1060], [470, Hc + 10], [820, Hc + 10],
    [880, GY - 2], [1100, GY + 2], [1260, GY - 6], [1350, 1030], [1420, 980], [1446, 900], [1446, 830], [1500, 806], [1560, 790], [1600, 764]];
  const cutT = [800, 820], cutH = [1420, 760];
  split(f, () => {
    f.part(body, HD());
    clipDraw(f, body, () => {
      f.flat([[400, 920], [1500, 860], [1500, 1100], [400, 1100]], hideS, { op: 0.4 });
      f.stroke([[1560, 640], [1420, 600], [1240, 612], [1040, 660], [860, 730], [700, 820]], 26, hideL, { op: 0.35 }); // the lit back
      f.flat([[1420, 600], [1520, 612], [1590, 670], [1560, 680], [1480, 640]], hideL, { op: 0.5 }); // the lit melon
      // the white eye patch lying back above and behind the eye; the grey saddle behind the fin; the white flank lobe
      // (independent review) form: the body is a cylinder, not a cut-out. A lit band along the upper flank under the back,
      // cross-contours wrapping round it, the lower flank turning dark, a cool rim of light reflected up from the ice
      // under the belly, a fold where the head sets into the body
      f.flat([[1580, 660], [1420, 626], [1240, 640], [1050, 684], [880, 748], [720, 840], [700, 880], [880, 800], [1060, 744], [1240, 704], [1420, 694], [1560, 712]], hideL, { op: 0.26 });
      f.flat([[1500, 640], [1300, 624], [1100, 660], [920, 720], [960, 734], [1120, 690], [1300, 660], [1480, 668]], hideL, { op: 0.22 });
      for (let i = 0; i < 9; i++) { const x = 760 + i * 92, top = 800 - i * 22, h = 150 + i * 18; f.line([[x + 20, top], [x - 6, top + h * 0.45], [x - 26, top + h]], 1.3, hideL, { op: 0.28 }); }
      f.flat([[700, 990], [900, 1000], [1100, 1000], [1300, 990], [1300, 1040], [700, 1040]], hideS, { op: 0.35 });
      f.stroke([[1360, 640], [1380, 720], [1376, 820], [1350, 900]], 8, hideS, { op: 0.45 }); f.line([[1370, 640], [1390, 720], [1386, 820]], 1.4, hideL, { op: 0.5 }); // the fold behind the head
      // the eye patch: a long teardrop lying back along the head's curve above and behind the eye, pointed at the front,
      // modelled (lit top, shadowed under-edge), as on the animal
      const ep = [[1464, 720], [1446, 704], [1404, 692], [1358, 688], [1324, 694], [1308, 712], [1322, 732], [1366, 740], [1420, 738], [1454, 732]];
      f.part(ep, WH({ inkW: 0.8, maxShade: 10 }));
      clipDraw(f, ep, () => { f.flat([[1290, 718], [1470, 724], [1470, 740], [1290, 740]], whiteS, { op: 0.45 }); f.line([[1320, 700], [1380, 698], [1440, 712]], 2, '#f4f8fa', { op: 0.7 }); });
      f.part([[940, 690], [860, 726], [800, 790], [860, 790], [960, 736], [1040, 690]], { fill: saddle, shadow: '#3a4250', shade: 0.3, inkW: 0, inkHeavy: 0, cast: false, tex: 'mottle730', texOp: 0.5 });
      // the white of the throat and belly running back, and the flank lobe sweeping up and back behind the fin toward the
      // tail to a point, as on the animal (it was a dome); shaded where the flank turns under
      const wl = [[1010, 1050], [990, 1000], [944, 950], [880, 910], [810, 884], [748, 872], [728, 880], [756, 912], [790, 960], [800, 1010], [790, 1050], [1000, 1046], [1100, 1040], [1300, 1046], [1400, 990], [1440, 900], [1446, 860], [1470, 1100], [800, 1100]];
      f.part(wl, WH());
      clipDraw(f, wl, () => { f.flat([[700, 960], [900, 960], [900, 1100], [700, 1100]], whiteS, { op: 0.35 }); f.line([[740, 884], [800, 916], [856, 960], [872, 1000]], 2, '#f4f8fa', { op: 0.6 }); });
      clipDraw(f, wl, () => {
        for (let i = 0; i < 7; i++) { const y = 1000 + i * 10, x0 = 900 + i * 20; f.stroke([[x0, y], [x0 + 160, y + 8], [x0 + 340, y + 4]], 5, '#5a6474', { op: 0.5 }); f.stroke([[x0, y - 4], [x0 + 160, y + 4], [x0 + 340, y]], 2, '#f4f8fa', { op: 0.5 }); }
        X.livid([1100, 1030], 200, 26, 12, 0.35); X.veins([1000, 1020], 100, 20, 5);
        f.flat([[700, 1040], [1500, 1040], [1500, 1100], [700, 1100]], '#3a4652', { op: 0.35 });
      });
      for (const [c, w, h] of [[[1180, 820], 90, 40], [[1000, 820], 60, 32], [[880, 870], 40, 26]]) {
        const sh = [add(c, [-w / 2, -h / 2]), add(c, [w / 2, -h / 2 - 6]), add(c, [w / 2 + 8, h / 2]), add(c, [-w / 2 + 4, h / 2 + 4])];
        f.part(sh, { fill: '#5a6270', shadow: '#2a303a', shade: 0.35, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'mottle730', texOp: 0.5 });
        f.line([add(c, [w / 2, -h / 2 - 6]), add(c, [w / 2 + 14, -h / 2 - 14]), add(c, [w / 2 + 4, -h / 2 - 20])], 2, '#a8b0b8', { op: 0.8 });
      }
      for (let k = 0; k < 3; k++) for (let i = 0; i < 4; i++) { const q = [1060 + k * 110 + i * 9, 760 + k * 20 + i * 6]; f.line([q, add(q, [-60, 40])], 2, '#9aa2aa', { op: 0.75 }); }
      for (let i = 0; i < 7; i++) { const q = [760 + i * 100, 790 - i * 26]; f.line([q, add(q, [-10, 30]), add(q, [-4, 60])], 3, '#e4eaee', { op: 0.5 }); } // frozen spray down the back
      X.scars([1150, 900], 80, 30, 3, -0.3, '#9aa2aa'); X.scars([660, 900], 60, 50, 3, 0.9, '#9aa2aa');
      f.flat([[400, GY - 6], [EDGE + 20, GY - 6], [EDGE + 20, Hc], [400, Hc]], PAL.sea, { op: 0.82 }); // the water over the submerged stock
    });
  }, [['tail', side(cutT, [-1, 0.3], 120)], ['body', [side(cutT, [1, -0.3], 120), side(cutH, [-1, 0], 110)]], ['head', side(cutH, [1, 0], 110)]]);
  f.bone('tail');
  for (let i = 0; i < 5; i++) { const q = [470 + i * 60, GY - 4]; f.line([q, add(q, [40, 0])], 1.6, '#c4d4de', { op: 0.6 }); }
  rimeBroken(f, X, [[860, 716], [760, 780], [660, 854], [580, 926], [520, 990]], 16, -1);
  f.bone('body');
  rimeBroken(f, X, [[1420, 590], [1300, 596], [1180, 616], [1060, 642], [960, 672], [860, 716]], 20, -1);
  // the broken harpoon head lodged behind the flipper, its shank snapped short
  f.bone('harpoon');
  const hq = [1240, 930]; f.flat(ell(hq, 16, 11, 0.4, 10), '#08080c'); f.part([hq, add(hq, [-60, -30]), add(hq, [-66, -24]), add(hq, [-8, 6])], { fill: PAL.iron, shade: 0.35, inkW: 1.2, cast: false }); f.line([add(hq, [-64, -27]), add(hq, [-72, -40]), add(hq, [-66, -48])], 3, PAL.woodL); X.icicle(add(hq, [-40, -14]), 18, 4);

  // ---- the dorsal fin: tall, its tip curled over and drooping back, a notch bitten out of the trailing edge, rimed on
  // its windward (leading) face, icicles hung plumb along the trailing edge
  f.bone('fin');
  const fin = [[1120, 640], [1112, 520], [1086, 400], [1040, 290], [980, 214], [910, 180], [846, 196], [820, 236], [846, 248], [884, 236], [930, 270], [956, 330], [962, 390], [944, 430], [956, 470], [934, 520], [924, 600], [890, 700], [1000, 680]];
  f.part(fin, HD({ maxShade: 30 }));
  clipDraw(f, fin, () => { f.flat([[1120, 650], [1080, 390], [960, 200], [1000, 240], [1040, 400], [1060, 660]], hideL, { op: 0.4 }); f.stroke([[1060, 660], [1040, 420], [990, 260], [920, 196]], 6, hideS, { op: 0.5 }); for (let i = 0; i < 5; i++) f.line([[920 + i * 14, 660], [940 + i * 12, 420], [930 + i * 6, 260]], 1, '#30343e', { op: 0.5 }); });
  f.flat([[944, 430], [920, 440], [924, 462], [956, 470]], PAL.sea); // the notch
  rimeBroken(f, X, [[1120, 650], [1110, 520], [1080, 390], [1030, 280], [960, 200], [900, 176]], 22, -1);
  X.icicles([[820, 236], [884, 236], [956, 330]], 5, 50, 8); X.icicles([[956, 470], [930, 600]], 3, 46, 8);

  // ---- the head: blunt and black, the white eye patch behind the eye, the jaw dropped on rows of conical teeth
  f.bone('jaw');
  const jaw = [[1446, 826], [1500, 850], [1560, 858], [1640, 848], [1656, 862], [1620, 900], [1520, 920], [1450, 900], [1420, 860]];
  f.part(jaw, HD({ maxShade: 20 }));
  f.part([[1460, 880], [1540, 900], [1620, 888], [1600, 912], [1510, 924], [1450, 904]], WH({ inkW: 0.9 })); // the white chin
  f.flat([[1452, 834], [1520, 852], [1600, 852], [1640, 846], [1630, 856], [1520, 862], [1460, 848]], '#2a2a36'); // the lower gum
  for (let i = 0; i < 9; i++) { const q = lerp([1474, 842], [1634, 846], i / 8); f.part([add(q, [-6, 4]), add(q, [6, 4]), add(q, [1, -18 + (i % 2) * 2])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 1, cast: false, hatch: false }); }
  X.barnacles([1470, 880], 18, 12, 5, 6); // barnacles crusted at the corner of the jaw
  X.icicles([[1460, 904], [1540, 922], [1620, 900]], 4, 30, 6);
  // the length of boarding net snagged on a lower tooth, hanging frozen
  f.bone('net');
  const nq = [1560, 840]; for (let r2 = 0; r2 < 4; r2++) for (let c = 0; c < 3; c++) { const a = add(nq, [-30 + c * 30, 20 + r2 * 34]), b = add(nq, [-30 + (c + 1) * 30, 20 + r2 * 34 + 4]), d = add(nq, [-30 + c * 30, 54 + r2 * 34]); if (c < 2) { f.line([a, b], 4, INK, { op: 0.8 }); f.line([a, b], 2.2, PAL.rig); } f.line([a, d], 4, INK, { op: 0.8 }); f.line([a, d], 2.2, PAL.rig); f.part(ell(a, 5, 4, 0, 8), X.IC({ fill: '#dfe7ec', inkW: 0.8, inkHeavy: 1 })); }
  rope(f, [nq, add(nq, [-2, 20])], 2.2, PAL.rig); X.icicles([add(nq, [-30, 156]), add(nq, [30, 160])], 3, 24, 5);
  f.bone('head');
  f.flat([[1446, 790], [1520, 780], [1590, 770], [1612, 756], [1606, 770], [1590, 788], [1520, 800], [1450, 812]], '#2a2a36'); // the upper gum
  for (let i = 0; i < 9; i++) { const q = lerp([1470, 804], [1600, 778], i / 8); f.part([add(q, [-6, -3]), add(q, [6, -4]), add(q, [0, 18 - (i % 2) * 2])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 1, cast: false, hatch: false }); }
  f.line([[1500, 640], [1560, 672], [1596, 720]], 2, hideS, { op: 0.6 }); // the melon's edge over the short rostrum
  const eye = [1478, 742]; f.flat(ell(eye, 10, 7, -0.2, 10), '#2a2e38'); f.flat(ell(eye, 5, 4, -0.2, 8), '#000'); f.flat(ell(add(eye, [2, -1.5]), 1.6, 1.2, 0, 6), '#8a96a0'); f.line(ell(eye, 14, 10, -0.2, 12).slice(6, 12), 1.2, hideL, { op: 0.6 });
  // the blowhole sealed with a plug of ice, rime on the melon, frozen breath
  f.part(ell([1430, 594], 20, 10, -0.1, 12), X.IC({ fill: '#e2eaee', inkW: 1.2, inkHeavy: 1.6 })); f.line([[1418, 592], [1442, 590]], 1.4, PAL.iceD, { op: 0.7 });
  rimeBroken(f, X, [[1420, 596], [1500, 610], [1560, 640], [1600, 690], [1612, 730]], 18, -1);
  X.icicles([[1500, 802], [1560, 790], [1600, 764]], 3, 18, 5);
  X.breath([1640, 830], rot([1, 0], -0.3), 110, 80);

  // ---- the near flipper braced on the ice in front of the chest: a broad black paddle, crusted with ice
  f.bone('flipper_n');
  const fl = [[1300, 960], [1380, 980], [1460, 1030], [1500, 1058], [1490, 1070], [1400, 1068], [1320, 1044], [1270, 1000]];
  f.part(fl, HD({ maxShade: 20 }));
  clipDraw(f, fl, () => { f.flat([[1300, 960], [1380, 980], [1460, 1030], [1420, 1030], [1340, 990]], hideL, { op: 0.4 }); for (let i = 0; i < 4; i++) f.line([[1310 + i * 10, 990 + i * 12], [1460, 1046 + i * 5]], 1, '#30343e', { op: 0.5 }); });
  X.rime([[1300, 960], [1380, 980], [1460, 1030], [1500, 1058]], 12, -1);
  for (let i = 0; i < 5; i++) f.part(ell([1340 + f.r() * 140, 1030 + f.r() * 30], 10, 7, 0, 10), X.IC({ fill: '#dfe7ec', inkW: 1, inkHeavy: 1.2 }));
  f.bone('root');
  f.flat(ell([1150, GY + 4], 420, 10, 0, 24), '#1c2430', { op: 0.4 });
  X.slab2([[1540, GY - 6], [1560, GY - 60], [1630, GY - 74], [1660, GY - 4]], [14, -10], { step: 30, snow: 6, bubbles: 6, layers: 2, cracks: 1 }); // a slab heaved up by the slide
  return f;
}

// ------------------------------------------------------------------ THE SHIP'S SURGEON (Elite 1.9)
// The flagship's surgeon, who worked the cockpit on the orlop through the long freeze taking off frostbitten limbs.
// Tall, gaunt and stooped at the upper back from years under low deck beams; the near arm raised and locked at the
// shoulder with the bow saw held up beside and above his bowed head; the far hand forward and open, as if holding a
// patient still; the weight on the forward foot. Bald, long-jawed, calm and absorbed, spectacles with one lens frosted.
// A short wool coat with the sleeves cut off at the elbow over a canvas smock, the shirt sleeves rolled; a heavy leather
// apron from chest to shin, stiff as a board, the blood on it frozen black and cracking where it folds.
// Authored in human space and mapped at true scale (kit_VII.space, k 1.9) onto the elite canvas.
// Rig: standard humanoid + saw (hand_n) + apron (pelvis) + tools (torso: the instrument roll) + rosary (pelvis).
// Motion: idle wipes the saw slowly on the apron; attack one long sawing stroke across a hero's limb.
function shipsSurgeon() {
  const [Wc, Hc] = TIERS.elite, GY = Hc - 30, k = 1.9;
  const { Z, W } = space(k, 520, GY);
  const f = new Fig(foeBase(723, Object.assign({}, WORLD, { groundY: GY, grimeY: Z([0, 640])[1] })));
  const X = fx(f, 1.6);
  const coat = '#3a404a', apron = '#66625e', apronL = '#9a9692', blk = '#141012';
  const J = { P: Z([282, 468]), C: Z([292, 366]), N: Z([330, 290]), AF: Z([350, 752]), AN: Z([214, 752]) };
  const S0 = B.spine(J.N, J.C, J.P, W(100));
  J.SN = S0.at(-0.34, 0.14); J.SF = S0.at(0.38, 0.12); J.HN = S0.at(-0.3, 1.0); J.HF = S0.at(0.32, 1.0);
  [J.KF] = ik(J.HF, J.AF, W(168), W(166), -1); [J.KN] = ik(J.HN, J.AN, W(168), W(166), -1);
  // the saw arm locked at shoulder height: the upper arm out behind, level; the forearm up; the saw held above his head
  J.EN = Z([204, 300]); J.WN = Z([224, 150]);
  const sA = deg(-4), SF = frame(J.WN, sA, k); // saw axis: the handle in the fist, the blade running forward over his head
  // the far arm forward and open at chest height, palm down, as if pressing a patient to the table
  J.WF = Z([430, 404]); [J.EF] = ik(J.SF, J.WF, W(130), W(114), 1);
  f.joint('saw', J.WN, 'hand_n').joint('apron', S0.at(0.2, 0.9), 'pelvis').joint('tools', S0.at(0.0, 0.3), 'torso').joint('rosary', S0.at(-0.4, 0.95), 'pelvis');
  const r = sailor(f, X, {
    s: k, J, hA: 0.3, name: 'surgeon', shirt: 'plain', shirtCol: '#a2a8aa', sleeve: 'rolled', feet: 'shoe', belly: 0.0, chestW: 0.86, armW: 0.88, handS: 1.1,
    jacket: { col: coat, colD: '#262a32', colL: '#5e6672' }, trouser: { col: '#4a4e54', len: 'full' }, cap: 'none', iceLen: 30,
    face: { skin: '#c4cbcf', jaw: 1.34, chin: 0.07, nose: 1.12, hook: 0.3, mouth: 'set', squint: 0.45, browDown: 0.02, hairCol: '#c4cbcf', browCol: '#e4eaee', browW: 0.05, age: true, gaunt: true, faceShade: 0.74, noEar: false },
    handN: { grip: { thumbAng: sA } }, handF: { open: { ang: deg(14), back: true, curl: 0.25, spread: 0.12, flip: true } },
    afterTorso: ({ S }) => {
      // ---- the apron: heavy leather from the chest to the shin, stiff as a board, blood frozen black and cracking at
      // every fold; its bib strap round the neck; a stub of tallow candle stuck to the bib
      f.bone('apron');
      const ap = [S.at(0.06, 0.2), S.at(0.6, 0.16), S.at(0.72, 0.5), S.at(0.78, 0.9), add(S.at(0.8, 1.0), [W(20), W(150)]), add(J.AF, [W(30), -W(66)]), add(lerp(J.KF, J.KN, 0.5), [0, W(110)]), add(J.KN, [-W(10), W(70)]), add(S.at(-0.6, 1.0), [-W(10), W(40)]), S.at(-0.3, 0.88), S.at(-0.1, 0.5)];
      f.part(ap, { fill: apron, shadow: '#0c0b0c', light: apronL, tex: 'mottle723', texOp: 0.6, maxShade: W(50), inkW: 2.4 });
      clipDraw(f, ap, () => {
        // the board-stiff folds: a few hard straight creases, the blood frozen black in great sheets and runs
        for (const [a0, b0] of [[S.at(0.1, 0.5), S.at(0.7, 0.55)], [S.at(-0.2, 0.92), S.at(0.76, 0.98)], [add(J.KN, [0, -W(20)]), add(J.KF, [W(20), -W(30)])]]) { f.stroke([a0, lerp(a0, b0, 0.5), b0], W(4), '#000', { op: 0.6 }); f.stroke([a0, b0].map(q => add(q, [0, -W(3)])), W(1.6), apronL, { op: 0.5 }); X.cracks(lerp(a0, b0, 0.5), W(30), 4, 0); }
        for (let i = 0; i < 9; i++) { const q = add(S.at(0.2 + f.r() * 0.5, 0.3 + f.r() * 0.6), [0, f.r() * W(160)]); const pts = []; for (let j = 0; j < 10; j++) { const a = j / 10 * 6.28; pts.push(add(q, [Math.cos(a) * W(10 + f.r() * 18), Math.sin(a) * W(10 + f.r() * 14)])); } f.flat(pts, blk, { op: 0.85 }); f.line(pts.slice(1, 5), 1.2, '#4a3e40', { op: 0.6 }); }
        for (let i = 0; i < 7; i++) { const q = S.at(0.3 + f.r() * 0.4, 0.5 + f.r() * 0.3); f.stroke([q, add(q, [W(2), W(60 + f.r() * 80)]), add(q, [-W(2), W(110 + f.r() * 100)])], W(5), blk, { op: 0.9 }); } // runs frozen mid-drip
        f.flat([add(J.KN, [-W(80), W(40)]), add(J.KF, [W(80), W(40)]), add(J.KF, [W(80), W(200)]), add(J.KN, [-W(80), W(200)])], '#3a4652', { op: 0.3 });
        f.line([S.at(0.68, 0.3), S.at(0.75, 0.7), add(S.at(0.8, 1.0), [W(20), W(140)])], W(2), apronL, { op: 0.5 }); // its worn edge
      });
      f.line([S.at(0.1, 0.2), S.at(-0.1, -0.02), S.at(-0.36, -0.08)], W(3.4), '#16151a'); // the bib strap
      X.rime([S.at(0.6, 0.16), S.at(0.72, 0.5), S.at(0.78, 0.9), add(S.at(0.8, 1.0), [W(20), W(150)])], W(9), -1);
      X.icicles([add(J.KN, [-W(10), W(70)]), add(lerp(J.KF, J.KN, 0.5), [0, W(110)]), add(J.AF, [W(30), -W(66)])], 6, W(30), W(6));
      const cd = S.at(0.46, 0.32); f.part([add(cd, [-W(7), 0]), add(cd, [W(7), 0]), add(cd, [W(6), -W(26)]), add(cd, [-W(6), -W(24)])], { fill: '#cfc8b6', shade: 0.3, inkW: 1.1, cast: false, hatch: false }); f.flat(ell(add(cd, [0, W(2)]), W(10), W(4), 0, 8), '#b8b2a0'); f.line([add(cd, [0, -W(26)]), add(cd, [W(1), -W(32)])], 1.6, INK); // the tallow candle stub
      // a roll of bandage tucked in the apron string; the screw tourniquet on its strap at the hip; the bowl and bottle
      f.bone('pelvis');
      f.line([S.at(-0.6, 0.94), S.at(0.0, 0.92)], W(3), '#16151a');
      const bd = S.at(-0.5, 0.96); f.part(ell(bd, W(14), W(10), 0.2, 12), { fill: '#b8bcb8', shadow: '#5a6068', shade: 0.35, inkW: 1.1, cast: false, tex: 'weave723' }); f.line([bd, add(bd, [W(4), W(40)])], W(3), '#b8bcb8');
      const tq = S.at(-0.84, 1.02); f.line([S.at(-0.7, 0.94), tq], W(2.6), '#26221f'); f.part([add(tq, [-W(12), 0]), add(tq, [W(12), 0]), add(tq, [W(12), W(16)]), add(tq, [-W(12), W(16)])], { fill: PAL.steel, shade: 0.3, inkW: 1.1, cast: false, sharp: true }); f.line([add(tq, [0, -W(8)]), add(tq, [0, W(30)])], W(3), PAL.ironD); f.line([add(tq, [-W(8), W(30)]), add(tq, [W(8), W(30)])], W(3), PAL.ironD); f.line([add(tq, [-W(10), W(16)]), add(tq, [-W(14), W(50)]), add(tq, [W(6), W(56)])], W(4), '#26221f'); // screw tourniquet
      const bw = S.at(-0.1, 1.06); f.line([S.at(-0.1, 0.94), add(bw, [0, -W(8)])], W(2), PAL.ironD); f.part([add(bw, [-W(22), -W(6)]), add(bw, [W(22), -W(6)]), add(bw, [W(16), W(12)]), add(bw, [-W(16), W(12)])], { fill: PAL.pewter, light: '#c8ced2', shade: 0.35, inkW: 1.2, cast: false }); f.flat(ell(add(bw, [0, -W(5)]), W(20), W(4), 0, 10), '#3a3e44'); // pewter bleeding bowl
      const bt = S.at(-0.66, 0.84); f.part([add(bt, [-W(8), 0]), add(bt, [W(8), 0]), add(bt, [W(9), W(40)]), add(bt, [-W(9), W(40)])], { fill: '#3e4650', light: '#8a96a4', shade: 0.35, inkW: 1.1, cast: false, opacity: 0.9 }); f.part([add(bt, [-W(4), -W(12)]), add(bt, [W(4), -W(12)]), add(bt, [W(4), 0]), add(bt, [-W(4), 0])], { fill: '#6a645a', shade: 0.3, inkW: 1, cast: false }); // corked bottle of spirit
      // the string of frozen fingers threaded on tarred twine at the belt, hanging like a rosary
      f.bone('rosary');
      const r0 = S.at(-0.36, 0.94), rp = []; for (let i = 0; i <= 9; i++) { const t = i / 9; rp.push(add(r0, [W(-30 * Math.sin(t * 3.14) - 6 * t), W(150 * t)])); }
      f.line(rp, W(2), '#1a1a1e');
      for (let i = 1; i < 10; i += 1) { const q = rp[i], a = deg(80 + (i % 3 - 1) * 20); f.part([add(q, rot([-W(4), -W(5)], a)), add(q, rot([W(20), -W(5)], a)), add(q, rot([W(24), 0], a)), add(q, rot([W(20), W(5)], a)), add(q, rot([-W(4), W(5)], a))], { fill: mix(SKIN.skin, PAL.bite, 0.35), shadow: SKIN.skinS, shade: 0.35, inkW: 1, cast: false, hatch: false }); f.flat(ell(add(q, rot([W(19), 0], a)), W(3.4), W(2.6), a, 6), SKIN.nail); f.line([add(q, rot([W(8), -W(5)], a)), add(q, rot([W(8), W(5)], a))], 0.9, INK, { op: 0.5 }); }
      X.icicle(rp[9], W(14), W(4));
    },
    persona: { hair: 'tufts', face: { faceShade: 0.86, jawShade: 0.5, hairCol: '#9aa2a8' } },
    afterHead: ({ hF }) => {
      // (review) the bald crown modelled as an old skull, not an egg: the temple hollow, forehead creases, a raised vein,
      // the lit top plane and the crown turning into shadow at the back
      f.flat(hF([[-0.34, -0.42], [-0.1, -0.54], [0.0, -0.4], [-0.12, -0.2], [-0.3, -0.12]]), '#3a3e50', { op: 0.32 });
      f.flat(hF([[0.04, -0.34], [0.16, -0.3], [0.14, -0.18], [0.04, -0.2]]), '#3a3e50', { op: 0.3 });
      for (let i = 0; i < 3; i++) f.line(hF([[0.08, -0.38 + i * 0.05], [0.2, -0.4 + i * 0.05], [0.3, -0.36 + i * 0.05]]), 1.6, '#3a3e50', { op: 0.6 });
      f.line(hF([[-0.02, -0.44], [0.04, -0.34], [0.02, -0.24]]), 2.2, '#8a92a8', { op: 0.6 });
      f.line(hF([[-0.2, -0.5], [0.04, -0.54], [0.22, -0.48]]), 3, '#eef2f4', { op: 0.5 });
      // spectacles: round iron rims, the near lens frosted over; frost in the eyebrows; the bite-stick on its cord
      const L1 = hF([[0.13, -0.06]])[0], L2 = hF([[0.31, -0.065]])[0], rr = W(100) * 0.075;
      f.part(ell(L1, rr, rr * 0.86, 0, 14), X.IC({ fill: '#dfe7ec', opacity: 0.92, inkW: 0, inkHeavy: 0 })); X.cracks(L1, rr * 1.2, 2, 0.3);
      f.flat(ell(L2, rr * 0.7, rr * 0.8, 0, 12), '#c8d4dc', { op: 0.35 });
      for (const [c, rx] of [[L1, rr], [L2, rr * 0.7]]) { const e = ell(c, rx, rr * 0.86, 0, 14); f.line(e.concat([e[0]]), W(2), PAL.ironD); }
      f.line([add(L1, [rr, -W(1)]), add(L2, [-rr * 0.7, -W(1)])], W(1.6), PAL.ironD); f.line([add(L1, [-rr, 0]), hF([[-0.18, -0.02]])[0]], W(1.6), PAL.ironD);
      X.frost(hF([[0.1, -0.14]])[0], W(10), W(3), 6, 1.2); X.frost(hF([[0.3, -0.15]])[0], W(5), W(2), 3, 1.2);
      const bs = hF([[0.06, 0.6]])[0]; f.line([hF([[-0.2, 0.32]])[0], add(bs, [-W(14), 0]), add(bs, [W(10), W(4)])], W(1.4), '#2a2624');
      f.part([add(bs, [-W(16), -W(4)]), add(bs, [W(16), -W(4)]), add(bs, [W(16), W(5)]), add(bs, [-W(16), W(5)])], { fill: '#3a3430', shade: 0.3, inkW: 1, cast: false, tex: 'mottle723' }); f.flat([add(bs, [-W(2), -W(4)]), add(bs, [W(4), -W(4)]), add(bs, [W(2), W(5)]), add(bs, [-W(4), W(5)])], '#141210'); // chewed through
      // the bald scalp: mottled, liver-spotted grey, frost on the crown
      X.livid(hF([[-0.05, -0.36]])[0], W(18), W(10), 4, 0.3); X.frost(hF([[0.05, -0.46]])[0], W(16), W(5), 6);
      X.rime(hF([[-0.2, -0.48], [0.05, -0.53], [0.26, -0.44]]), W(6), -1);
    },
    beforeNear: ({ S }) => {
      // ---- the instrument roll buckled across the chest like a bandolier: knives, bone nippers and a trephine in pockets
      f.bone('tools');
      const t0 = S.at(-0.5, -0.04), t1 = S.at(0.66, 0.86), tw = W(15);
      const roll = [lp(t0, t1, -0.04, tw), lp(t0, t1, 1.04, tw), lp(t0, t1, 1.04, -tw), lp(t0, t1, -0.04, -tw)];
      f.part(roll, { fill: '#2a2826', shadow: '#0c0b0b', light: '#5a5652', tex: 'mottle723', texOp: 0.5, sharp: true, inkW: 1.4, maxShade: 14 });
      for (let i = 0; i < 7; i++) { const t = 0.12 + i * 0.12, q = lp(t0, t1, t, 0); f.line([lp(t0, t1, t, -tw), lp(t0, t1, t, tw)], 1.2, '#121010', { op: 0.7 }); const ang = angOf(t0, t1) - Math.PI / 2;
        if (i % 3 === 0) f.part([add(q, rot([W(20), -W(4)], ang)), add(q, rot([W(52), -W(2)], ang)), add(q, rot([W(56), W(2)], ang)), add(q, rot([W(20), W(4)], ang))], { fill: PAL.steelL, shade: 0.3, inkW: 0.9, cast: false, hatch: false }); // a knife blade standing out
        else if (i % 3 === 1) { f.line([add(q, rot([W(20), -W(3)], ang)), add(q, rot([W(44), -W(7)], ang))], W(3), PAL.steel); f.line([add(q, rot([W(20), W(3)], ang)), add(q, rot([W(44), W(7)], ang))], W(3), PAL.steel); } // bone nippers
        else { f.line([add(q, rot([W(20), 0], ang)), add(q, rot([W(40), 0], ang))], W(3), PAL.steel); f.part(ell(add(q, rot([W(46), 0], ang)), W(8), W(8), 0, 10), { fill: PAL.steel, shade: 0.3, inkW: 1, cast: false }); f.line(ell(add(q, rot([W(46), 0], ang)), W(5), W(5), 0, 8), 1, INK, { op: 0.6 }); } } // trephine crown
      const bk = lp(t0, t1, 0.5, 0); f.part([add(bk, [-W(9), -W(11)]), add(bk, [W(9), -W(11)]), add(bk, [W(9), W(11)]), add(bk, [-W(9), W(11)])], { fill: PAL.iron, shade: 0.3, inkW: 1.1, cast: false, sharp: true });
      X.rime([lp(t0, t1, 0.0, tw), lp(t0, t1, 0.4, tw), lp(t0, t1, 0.8, tw)], W(6), 1);
      // ---- the steel bow saw: a turned handle in the fist, the blade with its teeth down, the bow frame arched over it,
      // rimed thick on top, icicles off the frame
      f.bone('saw');
      f.part(SF([[-40, -8], [10, -9], [10, 9], [-40, 8], [-46, 0]]), { fill: '#2e2c2a', shade: 0.35, inkW: 1.2, tex: 'wood723', cast: false });
      const bl = SF([[12, -6], [176, -6], [178, 12], [12, 14]]);
      f.part(bl, { fill: '#9aa2aa', shadow: '#3e464e', light: '#d8e0e6', shade: 0.3, inkW: 1.4, hatch: false, maxShade: 6 });
      for (let i = 0; i < 26; i++) { const x = 16 + i * 6.2; f.flat(SF([[x, 13], [x + 3, 19], [x + 6, 13]]), '#5a626a'); } // the teeth
      for (let i = 0; i < 7; i++) { const x = 50 + i * 16 + f.r() * 8; f.flat(SF([[x, 2 + f.r() * 3], [x + 8 + f.r() * 8, 1], [x + 10, 10 + f.r() * 3], [x + 2, 11]]), blk, { op: 0.75 }); } f.line(SF([[40, 12], [90, 13], [150, 12]]), 2, blk, { op: 0.8 }); // blood frozen black on the blade and in the teeth
      const bow = [SF([[6, -6]])[0], SF([[10, -40]])[0], SF([[60, -70]])[0], SF([[130, -72]])[0], SF([[172, -46]])[0], SF([[178, -6]])[0]];
      f.line(bow, W(6.6), INK); f.line(bow, W(4.2), PAL.steel); f.line(bow.map(q => add(q, [W(1), -W(1.4)])), W(1.2), PAL.steelL, { op: 0.7 });
      f.part(ell(SF([[178, -4]])[0], W(5), W(6), 0, 10), { fill: PAL.steel, shade: 0.3, inkW: 1, cast: false }); // the wing nut tensioning the blade
      X.rime(bow.slice(1, 5), W(8), -1);
      X.icicles(SF([[60, -70], [130, -72], [172, -46]]), 4, W(26), W(5)); X.icicles(SF([[30, 16], [100, 18], [170, 16]]), 4, W(20), W(4));
      // the knife nick across the far thumb (the open far hand was drawn behind)
    },
  });
  // the raised saw arm frozen solid: rime thick on its windward side, icicles from the elbow
  f.bone('upperarm_n');
  X.rime([lerp(J.SN, J.EN, 0.1), lerp(J.SN, J.EN, 0.9)].map(q => add(q, [0, -W(22)])), W(12), -1);
  f.bone('forearm_n');
  X.rime([lp(J.EN, J.WN, 0.1, -W(18)), lp(J.EN, J.WN, 0.8, -W(16))], W(10), 1);
  X.icicles([add(J.EN, [-W(14), W(18)]), add(J.EN, [W(14), W(20)])], 3, W(44), W(7));
  // sawdust frozen to the shoes
  f.bone('foot_f'); X.frost(add(J.AF, [W(30), W(26)]), W(30), W(8), 10, 1.4);
  f.bone('foot_n'); X.frost(add(J.AN, [W(30), W(26)]), W(30), W(8), 8, 1.4);
  // the knife nick across the far thumb
  f.bone('hand_f'); if (r.gF && r.gF.thumbTip) f.line([add(r.gF.thumbTip, [-W(8), -W(4)]), add(r.gF.thumbTip, [W(2), W(4)])], W(1.6), blk);
  return f;
}

// ------------------------------------------------------------------ SEA LICE (Small, a heap 0.5 high and 1.0 long)
// A sailor's burial hammock, sewn shut from head to foot, swollen with the body and the water in it and frozen hard,
// split open along its seam; out of the split pours a seething mound of pale sea lice, each the size of a thumb,
// translucent grey with a dark gut line. On the windward side the outermost lice froze where they crawled, into a white
// crust. The hammock lies along the ice, its head end toward the heroes; the lice spill forward over the ice at them.
// Canvas widened to 800 x 820 (the heap is 640 long). Rig: hammock (root) > swarm_1 (the heap on it) > swarm_2 (the
// spill down the front), swarm_3 (the tongue of lice running over the ice). Motion: a constant seething crawl; attack
// the heap surging over a hero's legs.
function seaLice() {
  const Wc = 800, GY = TIERS.small[1] - 30;
  const f = new Fig(foeBase(725, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 80 })));
  const X = fx(f, 0.8);
  const can = '#8e9496', canS = '#3a424c', tar = '#22242a';
  f.joint('hammock', [400, GY - 60]).joint('swarm_1', [440, 600], 'hammock').joint('swarm_2', [470, 700], 'swarm_1').joint('swarm_3', [640, GY - 20], 'swarm_2');
  // the hammock lying on its side: foot end (left) with the two shot, a swollen trunk, the head end (right) rounder
  const PR = [[0, 0.5], [0.05, 0.78], [0.12, 0.7], [0.2, 0.66], [0.34, 0.84], [0.5, 0.98], [0.66, 1.02], [0.8, 0.92], [0.86, 0.7], [0.92, 0.8], [0.98, 0.7], [1, 0.4]];
  const prof = t => { let i = 0; while (i < PR.length - 2 && PR[i + 1][0] < t) i++; const [t0, a] = PR[i], [t1, b] = PR[i + 1], u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))); return a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * u)); };
  const x0 = 90, L = 600, R = 74, cy = GY - R * 0.98;
  const top = [], bot = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, x = x0 + t * L, r = R * prof(t); top.push([x, cy - r * 1.05]); bot.push([x, Math.min(GY, cy + r * 1.0)]); }
  const ham = [...top, [x0 + L + 10, cy], ...bot.slice().reverse(), [x0 - 10, cy]];
  f.bone('hammock');
  f.flat(ell([x0 + L / 2, GY + 2], L * 0.56, 12, 0, 24), '#1c2430', { op: 0.45 });
  f.part(ham, { fill: can, shadow: canS, light: '#c0c6c8', tex: 'weave725', texOp: 0.55, maxShade: 46, inkW: 2 });
  clipDraw(f, ham, () => {
    f.flat([[0, cy + 10], [800, cy + 10], [800, GY + 10], [0, GY + 10]], '#1c2230', { op: 0.35 });
    f.flat(top.slice(4, 38).concat(top.slice(4, 38).reverse().map(q => add(q, [0, 26]))), '#e4eaee', { op: 0.25 }); // the lit top
    X.livid([x0 + L * 0.5, cy + 30], L * 0.4, 20, 12, 0.3);
    // the shape of the man under the canvas: knees, the swell of the belly, the crossed hands, the chin, the nose
    for (const t of [0.3, 0.62, 0.84]) f.stroke([[x0 + L * t, cy - R], [x0 + L * t + 6, cy], [x0 + L * t, cy + R]], 6, '#2a3038', { op: 0.4 });
    for (let i = 0; i < 6; i++) f.line([[x0 + 60 + i * 90, cy - R], [x0 + 70 + i * 90, cy + R]], 1, '#3a4250', { op: 0.35 });
    // the rows of stitches along the seam on top, and the last one through the nose at the head end, puckering it
    for (let i = 0; i < 34; i++) { const x = x0 + 14 + i * (L - 30) / 34, y = cy - R * prof((x - x0) / L) * 0.86; if (x > x0 + 210 && x < x0 + 470) continue; f.line([[x, y - 7], [x + 6, y + 6]], 1.6, tar, { op: 0.9 }); }
    f.stroke([[x0 + L - 40, cy - 30], [x0 + L - 20, cy - 14], [x0 + L - 6, cy - 24]], 5, '#2a3038', { op: 0.6 }); f.line([[x0 + L - 22, cy - 26], [x0 + L - 18, cy - 8]], 2.4, tar);
    // a canvas name tag stitched on, unreadable; salt tide-lines
    const nt = [x0 + 380, cy + 26]; f.part([add(nt, [-24, -14]), add(nt, [24, -16]), add(nt, [26, 14]), add(nt, [-22, 16])], { fill: '#a8aeb0', shade: 0.3, inkW: 1, cast: false, sharp: true, tex: 'weave725' }); f.stitches([add(nt, [-20, -10]), add(nt, [20, -12]), add(nt, [22, 10]), add(nt, [-18, 12]), add(nt, [-20, -10])], '#3a4250', 0.8); for (let i = 0; i < 3; i++) f.line([add(nt, [-14, -6 + i * 6]), add(nt, [10 - i * 4, -7 + i * 6])], 1.2, '#4a5260', { op: 0.6 });
    for (let i = 0; i < 2; i++) f.line([[x0 + 40, cy + 40 + i * 12], [x0 + 300, cy + 34 + i * 12], [x0 + 560, cy + 42 + i * 12]], 1.2, '#dbe3e8', { op: 0.3 });
  });
  // the two round shot sewn into the foot, bulging the canvas
  for (const [x, y] of [[x0 + 26, cy - 14], [x0 + 40, cy + 30]]) { f.part(ell([x, y], 26, 24, 0, 14), { fill: can, shadow: canS, shade: 0.4, inkW: 1.4, cast: false, tex: 'weave725', texOp: 0.5 }); f.line(ell([x, y], 20, 18, 0, 12).slice(8, 12), 1, '#2a3038', { op: 0.5 }); }
  // the split along the seam, the canvas torn open with frozen ragged lips, a bare ankle bone showing at its foot end
  const sp = top.slice(14, 32).map(q => add(q, [0, 10]));
  const split0 = [...sp, ...sp.slice().reverse().map((q, i) => add(q, [0, 26 + Math.sin(i * 1.7) * 8]))];
  f.flat(split0, '#0c0d12');
  const ank = add(sp[1], [10, 18]); f.part([add(ank, [-14, -6]), add(ank, [14, -8]), add(ank, [16, 6]), add(ank, [-12, 8])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1.1, cast: false, hatch: false }); f.flat(ell(add(ank, [4, 0]), 6, 4, 0, 8), '#d8d4c8');
  f.line(sp, 2.4, INK); X.icicles(sp.map(q => add(q, [0, 24])).filter((_, i) => i % 2 === 0), 6, 22, 5); // frozen drips hanging from the seam
  // a strand of frozen kelp caught on the canvas
  const kp = [[x0 + 120, cy - 40], [x0 + 150, cy + 10], [x0 + 140, cy + 60], [x0 + 160, GY - 6]]; f.line(kp, 7, INK, { op: 0.8 }); f.line(kp, 4.6, '#465256'); f.line(kp.map(q => add(q, [1, -1])), 1.2, '#8a989c', { op: 0.6 }); X.icicle(kp[1], 14, 4);
  X.rime(top.slice(2, 40).filter((_, i) => i % 3 === 0), 12, -1);

  // ---- the lice: a seething mound pouring out of the split and spilling over the ice toward the heroes. Each louse
  // is a segmented oval with many legs and a dark gut; the windward ones froze into a white crust.
  const swarm = (bone, n, area, frozenSide) => {
    f.bone(bone);
    const pts = [];
    for (let i = 0; i < n; i++) { const q = area(f.r(), f.r()); pts.push(q); }
    pts.sort((a, b) => a[1] - b[1]);
    for (const q of pts) { const frozen = frozenSide && q[0] > frozenSide(q[1]) && f.r() < 0.8; louse(f, q, f.r() * Math.PI * 2, 24 + f.r() * 10, { frozen, col: mix('#b9c3c8', '#8a96a0', f.r() * 0.5) }); }
  };
  // the mound's body: a dark seething mass under the visible lice (so gaps read as more lice, not as holes), its edge
  // broken into lumps of crawling lice; it pours from the split, heaps up, and runs down the hammock's flank and out
  // over the ice toward the heroes in a tongue
  const lumpy = (pts, amp) => { const C = spline(pts, 14), out = []; C.forEach((q, i) => { const a2 = C[Math.max(0, i - 1)], b2 = C[Math.min(C.length - 1, i + 1)], d = E.norm(sub(b2, a2)); out.push(add(q, mul([d[1], -d[0]], amp * (0.3 + f.r() * 0.9)))); }); return out; };
  const MC = '#4e5660', MS = '#181c24';
  f.bone('swarm_1');
  const mound = lumpy([[x0 + 200, cy - 40], [x0 + 236, cy - 130], [x0 + 300, cy - 196], [x0 + 380, cy - 226], [x0 + 450, cy - 200], [x0 + 500, cy - 130], [x0 + 540, cy - 60], [x0 + 470, cy - 20], [x0 + 330, cy - 26], [x0 + 200, cy - 40]], 14);
  f.part(mound, { fill: MC, shadow: MS, light: '#9aa4ac', shade: 0.35, inkW: 1, inkHeavy: 1.4, tex: 'mottle725', texOp: 0.6, maxShade: 34 });
  clipDraw(f, mound, () => { for (let i = 0; i < 200; i++) { const q = [x0 + 210 + f.r() * 330, cy - 230 + f.r() * 210]; f.line([q, add(q, [7, 2])], 1, '#0e1016', { op: 0.6 }); } });
  swarm('swarm_1', 110, (u, v) => { const x = x0 + 216 + u * 316, hgt = 216 * Math.sin(Math.PI * Math.min(1, u * 1.1)) ** 0.7; return [x, cy - 26 - v * hgt]; }, y => x0 + 460 - (cy - y) * 0.25);
  f.bone('swarm_2');
  const spill = lumpy([[x0 + 330, cy - 40], [x0 + 470, cy - 40], [x0 + 540, cy - 40], [x0 + 560, cy + 20], [x0 + 590, GY - 50], [x0 + 620, GY - 6], [x0 + 520, GY - 2], [x0 + 440, GY - 6], [x0 + 400, cy + 50], [x0 + 340, cy + 10], [x0 + 330, cy - 40]], 12);
  f.part(spill, { fill: MC, shadow: MS, shade: 0.3, inkW: 1, inkHeavy: 1.2, tex: 'mottle725', texOp: 0.6, maxShade: 20 });
  swarm('swarm_2', 70, (u, v) => { const y = cy - 30 + v * (GY - cy + 20); return [x0 + 350 + u * (180 + (y - cy) * 0.6), y]; }, null);
  f.bone('swarm_3');
  const tongue = lumpy([[x0 + 560, GY - 40], [x0 + 630, GY - 34], [x0 + 690, GY - 22], [x0 + 716, GY - 6], [x0 + 660, GY], [x0 + 560, GY - 2]], 8);
  f.part(tongue, { fill: MC, shadow: MS, shade: 0.3, inkW: 0.9, inkHeavy: 1.1, tex: 'mottle725', texOp: 0.6, maxShade: 10 });
  swarm('swarm_3', 30, (u, v) => [x0 + 560 + u * 160, GY - 36 * (1 - u) * v - 6], null);
  // the windward crust: lice frozen where they crawled, fused in rime, some half stuck and still moving
  f.bone('swarm_1');
  X.rime([[x0 + 400, cy - 232], [x0 + 470, cy - 192], [x0 + 520, cy - 112], [x0 + 524, cy - 50]], 14, -1);
  for (let i = 0; i < 8; i++) { const q = [x0 + 470 + i * 8, cy - 180 + i * 18]; louse(f, q, deg(-30 + i * 10), 20, { frozen: i % 2 === 0 }); }
  X.icicles([[x0 + 470, cy - 30], [x0 + 520, cy - 50]], 3, 18, 5);
  return f;
}

// ------------------------------------------------------------------ CAPSTAN GANG (Large, 1.8 wide)
// The flagship's capstan crew, weighing anchor when the sea froze, and the fiddler who kept their time. A waisted oak
// capstan drum gone grey, torn up from the deck with a jagged collar of planking still round its foot and the iron pawl
// ring above it; the frozen anchor cable wrapped three times round its waist and running out behind (drawing -x) as
// stiff as a tree trunk. Four drowned sailors lean into the bars with their legs driving, frozen to the bars at the
// hands and chest, rime thickest on their backs, icicles from their bellies and elbows: the two on the near side push
// toward the heroes, the two on the far side (seen past the drum) push away; one far bar is snapped short and its man
// leans on the stub. The fiddler sits on the drumhead, head cocked to the fiddle, eyes shut, the bow frozen mid-stroke.
// Seen three-quarter from chest height, so the bars' circle is a flat ellipse. Canvas widened to 1700 x 1100.
// Height: the drumhead stands at chest height for the bars (1.3), and the seated fiddler's head reaches 1.22 (the bible
// asks 1.5; a man sitting on a drumhead at bar height cannot be taller without a stool, so the logic wins).
// Rig: drum (root) > bar_1..4, cable; each man g1..g4 (pelvis parented to the drum); fiddler fd_ (pelvis on drum) +
// fiddle (fd_hand_f) + bow (fd_hand_n). Motion: the men strain and the bow moves; attack the drum heaves round.
function capstanGang() {
  const Wc = 1700, Hc = TIERS.large[1], GY = Hc - 30;
  const f = new Fig(foeBase(726, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 260 })));
  const X = fx(f);
  const oak = '#7a7872', oakD = '#3e3d3a', oakL = '#a8a6a0';
  const OAK = (o = {}) => Object.assign({ fill: oak, shadow: '#26262a', light: oakL, tex: 'wood726', texOp: 0.55, shade: 0.34, maxShade: 50 }, o);
  const HUB = [880, 610], dR = 150, dr = 30, bR = 430, br = 70; // drumhead top centre, its radii; the bars' circle
  const barAt = (th, R = bR) => [HUB[0] + Math.cos(th) * R, HUB[1] + 34 + Math.sin(th) * br * (R / bR)];
  const TH = [deg(48), deg(136), deg(228), deg(312)];
  f.joint('drum', [880, GY - 40]).joint('cable', [740, 880], 'drum');
  TH.forEach((t, i) => f.joint(`bar_${i + 1}`, barAt(t, dR), 'drum'));
  const bar = (th, R, snapped) => {
    const a = barAt(th, dR - 10), b = barAt(th, R);
    f.part(limb(a, b, 30, 24, { steps: 8, capB: !snapped }), OAK({ maxShade: 10 }));
    f.line([lp(a, b, 0.05, -6), lp(a, b, 0.95, -5)], 1.6, oakL, { op: 0.5 });
    if (snapped) { f.part([lp(a, b, 0.98, -13), add(b, [8, -10]), add(b, [16, -2]), add(b, [6, 4]), add(b, [14, 10]), lp(a, b, 0.98, 12)], OAK({ fill: oakL, maxShade: 4, inkW: 1.2 })); }
    X.rime([lp(a, b, 0.05, -13), lp(a, b, 0.5, -13), lp(a, b, 0.95, -12)], 8, -1);
    X.icicles([lp(a, b, 0.1, 13), lp(a, b, 0.9, 12)], 3, 22, 5);
    return [a, b];
  };
  const shirts = [['stripe', '#b0b8bc'], ['check', '#a8aeb2'], ['stripe', '#a4acb0'], ['check', '#b4babe']];
  const CP = [
    { chestW: 1.16, belly: 0.1, armW: 1.1, frost: ['beard'], neck: '#3e4652', face: { jaw: 1.4, chin: 0.05, nose: 1.18, hook: 0.4, moustache: true, beard: 'stubble', age: true, squint: 0.75 } },
    { chestW: 1.08, belly: 0.06, frost: ['brows'], face: { jaw: 1.26, chin: 0.03, nose: 1.06, hook: 0.2, beard: 'short', beardCol: '#2a2c30', age: true, scar: [[0.16, 0.0], [0.22, 0.14]] } },
    { chestW: 0.96, frost: ['mask'], earring: true, face: { jaw: 1.1, chin: 0.0, nose: 0.94, hook: 0.05, age: false, beard: 'stubble', beardCol: '#24262a' } },
    { chestW: 0.92, belly: -0.04, hair: 'long', frost: ['nose'], face: { jaw: 1.04, chin: -0.02, nose: 0.9, hook: 0, age: false, gaunt: true, squint: 0.5, hairCol: '#2a2c30' } },
  ];
  // one pusher: chest on the bar end, the body pitched forward behind it, legs driving
  const pusher = (i, mirror, barEnd, barIn, extra = {}) => {
    const sg = mirror ? -1 : 1, pre = `g${i + 1}_`;
    const pv = extra.pv || [-168, 112]; delete extra.pv;
    const N = add(barEnd, [sg * 30, -34]), P = add(N, [sg * pv[0], pv[1]]), C = add(lerp(N, P, 0.5), [sg * -10, -24]); // the body pitched over about 34 degrees from level
    const S0 = B.spine(N, C, P, 100);
    const sat = (u, v) => S0.at(mirror ? -u : u, v);
    const st = extra.stride || [-186, 70];
    const J = { N, C, P, SN: sat(-0.3, 0.16), SF: sat(0.38, 0.12), HN: sat(-0.3, 1.0), HF: sat(0.34, 1.0), AN: add(P, [sg * st[0], GY - 38 - P[1]]), AF: add(P, [sg * st[1], GY - 38 - P[1]]) };
    delete extra.stride;
    [J.KN] = ik(J.HN, J.AN, 164, 162, mirror ? 1 : -1); [J.KF] = ik(J.HF, J.AF, 164, 162, mirror ? 1 : -1);
    const bd = E.norm(sub(barEnd, barIn));
    J.WN = sub(barEnd, mul(bd, 36)); J.WF = sub(barEnd, mul(bd, 120));
    [J.EN] = ik(J.SN, J.WN, 122, 106, mirror ? -1 : 1); [J.EF] = ik(J.SF, J.WF, 122, 106, mirror ? -1 : 1);
    const ba = angOf(barIn, barEnd);
    const r = sailor(f, X, Object.assign({
      s: 1, pre, parent: 'drum', J, mirror, hA: -0.36, name: `capstan ${i + 1}`, shirt: shirts[i][0], shirtCol: shirts[i][1], sleeve: i % 2 ? 'rolled' : 'full', belly: 0.18, chestW: 0.78, armW: 0.95,
      trouser: { col: '#9ca2a4', len: i === 2 ? 'cut' : 'shin', stripe: i === 1 ? PAL.rigD : null }, cap: i === 3 ? 'kerchief' : 'knit', queue: i !== 3, shoulderRime: false,
      face: { jaw: 1.2, chin: 0.02, nose: 1.0 + i * 0.04, hook: 0.1 * i, mouth: 'set', squint: 0.7, browDown: 0.06, hairCol: '#1e2024', age: i % 2 === 0, faceShade: 0.72 }, persona: CP[i],
      // the palms pressed flat on the bar and frozen there (capstan men push with palms and chest, they do not grip)
      handN: { open: { ang: angOf(J.EN, J.WN) + (mirror ? 0.5 : -0.5), back: true, curl: 0.35, spread: 0.1, flip: mirror } }, handF: { open: { ang: angOf(J.EF, J.WF) + (mirror ? 0.5 : -0.5), back: true, curl: 0.35, spread: 0.1, flip: mirror } },
      afterTorso: ({ S }) => {
        // rime thickest along the back (the up-facing side of a body pitched over), icicles from the hanging belly
        X.rime([S.at(-0.84, 0.05), S.at(-0.9, 0.4), S.at(-0.84, 0.8), S.at(-0.72, 1.0)], 14, mirror ? -1 : 1);
        X.icicles([S.at(0.5, 0.5), S.at(0.7, 0.8), S.at(0.6, 1.0)], 4, 30, 6);
        X.frost(S.at(-0.6, 0.5), 30, 40, 8);
      },
    }, extra));
    // frozen to the bar at the chest: a lump of ice welding shirt to oak
    f.bone(pre + 'torso');
    f.part(ell(barEnd, 26, 20, ba, 12), X.IC({ fill: '#d8e2e8', opacity: 0.85 }));
    return r;
  };

  // ---- the cable: the anchor cable running out behind, frozen solid as a tree trunk, along the ice and off the frame
  f.bone('cable');
  const cab = [[760, 900], [600, 940], [420, 1000], [220, GY - 36], [-10, GY - 34]];
  rope(f, cab, 64, '#6a7274'); X.rime(cab.slice(0, 4).map(q => add(q, [0, -30])), 12, -1); X.icicles(cab.slice(0, 4).map(q => add(q, [0, 30])), 7, 30, 7);
  const sf = [400, 1004]; for (let i = 0; i < 9; i++) f.line([add(sf, [0, -24 + i * 6]), add(sf, [-30 - f.r() * 20, -40 + i * 10]), add(sf, [-50 - f.r() * 30, -50 + i * 14])], 2, '#8a9294', { op: 0.8 }); // a chafed place, the strands frozen splayed
  const np = [540, 960]; rope(f, [np, add(np, [10, 50]), add(np, [0, 90])], 6, PAL.rope); X.icicle(add(np, [0, 88]), 18, 5); // a short nipper rope hanging from it

  // ---- the far side: the two men pushing away from the heroes, and their bars, behind the drum
  // (independent review) the far bars stand empty behind the drum: the whole gang is on the near side, so for one
  // direction of turn every man pushes the same way (toward the heroes), and the four read as one shape of effort
  f.bone('bar_3'); bar(TH[2], bR, false);
  f.bone('bar_4'); bar(TH[3], bR, false);

  // ---- the drum: a waisted oak capstan gone grey; whelps (ribs) down the barrel; the drumhead with its pigeonholes;
  // the iron pawl ring and pawls at the foot; the jagged collar of torn deck planking still round it
  f.bone('drum');
  const yT = HUB[1], yH = HUB[1] + 66, yW = 860, yB = GY - 70;
  const barrel = [[HUB[0] - dR + 6, yH], [HUB[0] - 112, 760], [HUB[0] - 100, yW], [HUB[0] - 120, 960], [HUB[0] - 140, yB], [HUB[0] + 140, yB], [HUB[0] + 120, 960], [HUB[0] + 100, yW], [HUB[0] + 112, 760], [HUB[0] + dR - 6, yH]];
  f.part(barrel, OAK());
  clipDraw(f, barrel, () => {
    for (let i = -3; i <= 3; i++) { const u = i / 3.4; f.stroke([[HUB[0] + u * 140, yH], [HUB[0] + u * 96, yW], [HUB[0] + u * 136, yB]], 12 - Math.abs(i) * 2, oakD, { op: 0.45 }); f.line([[HUB[0] + u * 140 + 6, yH], [HUB[0] + u * 96 + 5, yW], [HUB[0] + u * 136 + 6, yB]], 1.4, oakL, { op: 0.5 }); } // the whelps
    f.flat([[HUB[0] - 160, yH], [HUB[0] - 40, yH], [HUB[0] - 30, yB], [HUB[0] - 160, yB]], '#141418', { op: 0.3 });
    X.cracks([HUB[0] + 40, 800], 40, 4, 1.4);
  });
  // three turns of the frozen cable round the waist, the strands laid; the run going off behind
  for (let k = 0; k < 3; k++) { const y = yW - 40 + k * 46, w = 100 + Math.abs(k - 1) * 6; rope(f, [[HUB[0] - w, y + 8], [HUB[0] - w * 0.5, y + 16], [HUB[0], y + 18], [HUB[0] + w * 0.5, y + 14], [HUB[0] + w, y + 4]], 40, '#6a7274'); X.rime([[HUB[0] - w * 0.6, y - 2], [HUB[0], y], [HUB[0] + w, y - 10]], 8, -1); }
  // the pawl ring and its pawls, the torn deck collar
  f.part([[HUB[0] - 150, yB - 20], [HUB[0] + 150, yB - 20], [HUB[0] + 156, yB + 6], [HUB[0] - 156, yB + 6]], { fill: PAL.iron, shadow: '#101114', shade: 0.35, inkW: 1.4, cast: false, tex: 'mottle726' });
  for (let i = 0; i < 4; i++) { const x = HUB[0] - 110 + i * 74; f.part([[x, yB - 22], [x + 30, yB - 46], [x + 40, yB - 40], [x + 14, yB - 18]], { fill: PAL.iron, shade: 0.35, inkW: 1.1, cast: false }); f.rivet([x + 6, yB - 22], 3, PAL.iron); }
  const collar = [[HUB[0] - 260, GY], [HUB[0] - 250, GY - 70], [HUB[0] - 200, GY - 96], [HUB[0] - 150, GY - 74], [HUB[0] - 120, GY - 110], [HUB[0] - 60, GY - 80], [HUB[0], GY - 92], [HUB[0] + 70, GY - 70], [HUB[0] + 120, GY - 118], [HUB[0] + 170, GY - 86], [HUB[0] + 230, GY - 100], [HUB[0] + 270, GY - 40], [HUB[0] + 262, GY]];
  f.part(collar, OAK({ fill: '#5a5852', maxShade: 20 }));
  clipDraw(f, collar, () => { for (let i = 0; i < 6; i++) { const x = HUB[0] - 240 + i * 90; f.line([[x, GY - 120], [x + 8, GY]], 2, '#141418', { op: 0.7 }); f.rivet([x + 30, GY - 40], 3.4, PAL.iron); } f.flat([[HUB[0] - 300, GY - 30], [HUB[0] + 300, GY - 30], [HUB[0] + 300, GY + 4], [HUB[0] - 300, GY + 4]], '#3a4652', { op: 0.4 }); });
  for (const x of [-200, -120, 120, 230]) f.line([[HUB[0] + x, GY - 96], [HUB[0] + x + 10, GY - 120], [HUB[0] + x + 4, GY - 128]], 3, oakL); // splinters
  f.flat(ell([HUB[0], GY + 4], 300, 12, 0, 20), '#1c2430', { op: 0.45 });
  // the drumhead: a thick round head with pigeonholes for the bars, its top seen a little from above
  const dh = [...ell([HUB[0], yT], dR, dr, 0, 28).slice(0, 15), [HUB[0] - dR, yH - 4], ...ell([HUB[0], yH - 4], dR, dr, 0, 28).slice(0, 15).reverse().map(q => q), [HUB[0] + dR, yT]];
  f.part([[HUB[0] - dR, yT], [HUB[0] + dR, yT], [HUB[0] + dR, yH], ...ell([HUB[0], yH], dR, dr, 0, 28).slice(0, 15), [HUB[0] - dR, yH]], OAK({ fill: '#6e6c66' }));
  for (const th of [deg(70), deg(110), deg(20), deg(160)]) { const q = [HUB[0] + Math.cos(th) * dR * 0.96, yT + 34 + Math.sin(th) * dr * 0.5]; f.part([add(q, [-14, -12]), add(q, [14, -12]), add(q, [14, 12]), add(q, [-14, 12])], { fill: '#141416', shade: 0.2, inkW: 1, cast: false, sharp: true }); } // empty pigeonholes
  f.part(ell([HUB[0], yT], dR, dr, 0, 28), OAK({ fill: '#8a8882', maxShade: 10 }));
  clipDraw(f, ell([HUB[0], yT], dR, dr, 0, 28), () => { for (let i = 0; i < 6; i++) f.line([[HUB[0] - dR + i * 50, yT - dr], [HUB[0] - dR + i * 50 + 20, yT + dr]], 1.2, oakD, { op: 0.5 }); });
  void dh;
  // the tar bucket frozen to the drum's flank
  const tb = [HUB[0] + 118, 740]; f.part([add(tb, [-26, -30]), add(tb, [26, -30]), add(tb, [22, 30]), add(tb, [-22, 30])], { fill: '#26282c', shadow: '#0a0a0c', shade: 0.35, inkW: 1.3, cast: false, tex: 'wood726' }); for (const y of [-14, 14]) f.line([add(tb, [-24, y]), add(tb, [24, y])], 2.4, PAL.ironD); f.line([add(tb, [-26, -30]), add(tb, [0, -56]), add(tb, [26, -30])], 2, PAL.ironD); f.stroke([add(tb, [10, 30]), add(tb, [14, 70]), add(tb, [8, 110])], 10, '#141518'); X.icicles([add(tb, [-22, 30]), add(tb, [22, 30])], 2, 20, 5);
  rimeBroken(f, X, [[HUB[0] - dR, yT], [HUB[0], yT - dr - 2], [HUB[0] + dR, yT]], 12, -1);
  X.rime([[HUB[0] + dR - 6, yH], [HUB[0] + 112, 760], [HUB[0] + 100, yW]], 12, -1);
  X.icicles([[HUB[0] - dR, yH + 2], [HUB[0], yH + dr], [HUB[0] + dR, yH + 2]], 7, 34, 7);

  // ---- the fiddler on the drumhead: a thin old man sitting, the fiddle on his far shoulder, head cocked to it, eyes shut
  const FP = [HUB[0] - 18, yT - 6], FN = [HUB[0] - 4, yT - 178], FC = [HUB[0] - 22, yT - 92];
  const F0 = B.spine(FN, FC, FP, 96);
  const FJ = { N: FN, C: FC, P: FP, SN: F0.at(-0.3, 0.14), SF: F0.at(0.36, 0.12), HN: F0.at(-0.1, 1.0), HF: F0.at(0.28, 1.0), KN: [HUB[0] + 120, yT - 20], KF: [HUB[0] + 132, yT - 30] };
  FJ.AN = [HUB[0] + 128, yT + 140]; FJ.AF = [HUB[0] + 150, yT + 128];
  const fidC = add(F0.at(0.66, 0.4), [6, 0]), fidA = deg(-58); // a folk fiddler's hold: the fiddle against the chest, the neck up and forward
  FJ.WF = add(fidC, rot([150, 0], fidA)); [FJ.EF] = ik(FJ.SF, FJ.WF, 118, 102, 1);
  const bowC = add(fidC, rot([24, 0], fidA)), bowA = deg(10); // the bow crosses the strings by the bridge, level, running forward
  FJ.WN = add(bowC, rot([-86, 0], bowA)); [FJ.EN] = ik(FJ.SN, FJ.WN, 118, 102, 1);
  f.joint('fiddle', FJ.WF, 'fd_hand_f').joint('bow', FJ.WN, 'fd_hand_n');
  sailor(f, X, {
    s: 0.96, pre: 'fd_', parent: 'drum', J: FJ, hA: 0.42, name: 'fiddler', shirt: 'check', shirtCol: '#a4aaae', sleeve: 'full', belly: 0.0, chestW: 0.86, armW: 0.86,
    jacket: { col: '#343a46', colD: '#22262e', colL: '#5a6270' }, trouser: { col: '#8e9496', len: 'shin' }, cap: 'none', footFree: { n: true, f: true }, footAng: { n: deg(74), f: deg(70) },
    face: { jaw: 1.1, chin: 0.03, nose: 1.14, hook: 0.3, mouth: 'set', blind: true, browDown: 0.06, hairCol: '#b8c0c4', browCol: '#dfe6ea', age: true, gaunt: true, faceShade: 0.72, hair: [[-0.36, -0.36], [-0.2, -0.5], [0.06, -0.52], [0.2, -0.44], [0.0, -0.42], [-0.24, -0.3], [-0.36, -0.1]] },
    handF: { grip: { thumbAng: fidA + Math.PI, maxBend: 40 } }, handN: { grip: { thumbAng: bowA, maxBend: 40 } },
    afterHead: ({ hF }) => { for (let i = 0; i < 3; i++) f.line(hF([[0.06, -0.04 + i * 0.012], [0.17, -0.05 + i * 0.012]]), 1.2, INK, { op: 0.7 }); X.frost(hF([[0.1, -0.12]])[0], 10, 3, 4); }, // eyes shut, the lids frosted together
    beforeNear: () => {
      // the fiddle: grey with rime, its waist and f-holes, the neck and scroll held out in the far hand
      f.bone('fiddle');
      const FF = frame(fidC, fidA, 1.2);
      const body = FF([[-66, 0], [-62, -26], [-42, -36], [-20, -32], [-10, -20], [6, -19], [18, -30], [42, -32], [60, -22], [64, 0], [60, 22], [42, 32], [18, 30], [6, 19], [-10, 20], [-20, 32], [-42, 36], [-62, 26]]);
      f.part(body, { fill: '#8a8680', shadow: '#2e2c2a', light: '#c4c0b8', tex: 'wood726', texOp: 0.4, shade: 0.35, inkW: 1.4, cast: false, maxShade: 16 });
      for (const sg of [-1, 1]) f.line(FF([[-6, sg * 14], [-2, sg * 10], [6, sg * 12]]), 1.6, INK);
      f.part(FF([[60, -6], [150, -5], [150, 5], [60, 6]]), { fill: '#2a2826', shade: 0.3, inkW: 1.1, cast: false }); // the neck and fingerboard
      f.part(FF([[150, -8], [166, -10], [172, 0], [166, 10], [150, 8]]), { fill: '#6a665e', shade: 0.3, inkW: 1, cast: false }); // the scroll
      for (let i = 0; i < 4; i++) f.line(FF([[-40, -6 + i * 4], [150, -3 + i * 2]]), 0.8, '#d8dce0', { op: 0.6 }); // strings
      f.part(FF([[20, -12], [26, -12], [26, 12], [20, 12]]), { fill: '#cfc8b6', shade: 0.3, inkW: 0.8, cast: false }); // bridge
      X.rime(FF([[-60, -30], [-14, -26], [40, -34], [66, 0]]), 6, -1); X.icicles(FF([[-36, 36], [10, 28], [40, 34]]), 3, 16, 4);
      // the bow, frozen mid-stroke across the strings
      f.bone('bow');
      const BF = frame(FJ.WN, bowA, 1);
      f.line(BF([[-14, 0], [236, 0]]), 3.4, '#2a2826'); f.line(BF([[0, 6], [232, 3]]), 1.4, '#d8dce0', { op: 0.8 }); // stick and hair
      f.part(BF([[-14, -5], [8, -5], [8, 8], [-14, 8]]), { fill: '#2a2826', shade: 0.3, inkW: 1, cast: false }); // frog
      X.rime(BF([[30, -2], [130, -2], [226, -2]]), 4, 1);
    },
  });

  // ---- the near side: the two men pushing toward the heroes, their bars in front of the drum
  // three men shoulder to shoulder along the near-left bar (inner first, the outer man nearest the viewer), legs driving
  // in step; the fourth still leaning on the snapped stub of the near-right bar
  f.bone('bar_1'); const [b1i, b1o] = bar(TH[0], 330, true);
  pusher(0, false, b1o, b1i, { stride: [-200, 60] });
  f.bone('bar_2'); const [b2i, b2o] = bar(TH[1], 470, false);
  pusher(3, false, barAt(TH[1], 262), b2i, { stride: [-130, 96], pv: [-128, 160], hA: 0.05 }); // the young one at the back, more upright, head down
  pusher(2, false, barAt(TH[1], 354), b2i, { stride: [-214, 30], pv: [-170, 108], hA: -0.3 });
  pusher(1, false, barAt(TH[1], 446), b2i, { stride: [-250, 96], pv: [-190, 76], hA: -0.62 }); // the outer man nearly level, deep in the lunge, face up
  void b2o;
  return f;
}

// ------------------------------------------------------------------ THE BROADSIDE (Ruler 3.5)
// The fleet's great three-decked ship of the line, frozen with her lower gun crews at their guns. The hull is the body:
// a wall of black tarred oak side-on to the company, heeled toward it 15 degrees, running off the frame at the top and
// both sides, its weight gripped in the ice at the waterline. Built as a surface, not a flat front: every point is laid
// out by hullAt(x, v) (x along the hull, v up from the waterline), which leans the face toward the heroes, lifts the
// strakes in the sheer and squeezes them toward the left edge where the hull's curve turns away from the viewer (and
// darkens). The strakes are swollen between the frames and split along the grain (water); the windward face carries a
// white rind of rime, thickest at the top, and icicles longer than a man hang plumb from every sill, wale and channel
// (frost). Ports are openings with depth: a soffit and side linings shrink toward the viewer's eye, a heavy sill
// projects, lids hang open on their hinges. Guns are black iron, rimed at the muzzle, the bores plugged with ice; one
// at the centre has burst along its barrel where the ice in it expanded. No flame anywhere: the guns fire by ice.
// Canvas widened to 1800 x 1600 at true scale (a 1.0 human gunner is 640 px; the frame shows the lower two tiers).
// Rig: hull (root) > gun_1..5 (recoil), lid_1..5 (swing), net, ladder > boarder, each gunner gN_ (pelvis on the hull),
// rammer / linstock / sponge on their hands. Motion: the ice creaks, gunners breathe frost and a lid swings; attack a
// ripple of cracks down the hull as the ice in each barrel drives the shot out, port by port, with a burst of frost.
function broadside() {
  const Wc = 1800, Hc = 1800, GY = Hc - 30, WL = 1646, XS = -40, VR = 1440; // XS: the bow stem (nominal x), VR: the rail (independent review: the frame now shows the rail and sky)
  const f = new Fig(foeBase(720, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 40 })));
  const X = fx(f, 1.6);
  const hull = '#1f2126', hullL = '#4a4f58', hullS = '#07080a', VP = [880, GY - 430]; // the viewer's eye: chest height
  const lean = Math.tan(deg(15));
  const sc = x => 1 - 0.34 * Math.min(1, Math.max(0, (420 - x) / 520)); // the hull turning away at the left
  const cu = x => 70 * Math.min(1, Math.max(0, (420 - x) / 520)) ** 2; // the sheer lifting there
  const hullAt = (x, v) => [x + v * sc(x) * lean, WL - v * sc(x) - cu(x) * (0.4 + v / 1400)];
  const inward = (p, k = 0.09) => lerp(p, VP, k); // a point pushed into the hull's thickness, seen in perspective
  const HL = (o = {}) => Object.assign({ fill: hull, shadow: hullS, light: hullL, tex: 'mottle720', texOp: 0.5, shade: 0.3, maxShade: 20, inkW: 1.4, inkHeavy: 2.4, cast: false }, o);
  f.joint('hull', [900, WL]);
  const LT = [[380, 380, 650], [900, 380, 650], [1420, 380, 650]], UT = [[640, 1000, 1250], [1160, 1000, 1250], [1680, 1000, 1250]], PW = 290; // ports: [x centre, sill v, head v]
  const ports = [...LT, ...UT];
  ports.forEach((p, i) => f.joint(`lid_${i + 1}`, hullAt(p[0], p[2] + 10), 'hull'));
  [0, 1, 2, 3, 4].forEach(i => f.joint(`gun_${i + 1}`, hullAt(ports[i][0], ports[i][1] + 60), 'hull'));
  f.joint('net', hullAt(1500, 1300), 'hull').joint('ladder', hullAt(XS + 40, VR), 'hull').joint('fender', hullAt(170, 330), 'hull').joint('spar', hullAt(420, VR + 20), 'hull').joint('anchor', hullAt(XS - 60, 1180), 'hull');

  // ---- the hull face: strakes from below the waterline to off the top of the frame, each its own swollen plank
  f.bone('hull');
  const xs = []; for (let x = XS; x <= 2000; x += 40) xs.push(x);
  // the hull's outline: the stem at the left where she turns away, the rail along the top (sky above it)
  const HO = []; for (let v = -300; v <= VR; v += 40) HO.push(hullAt(XS, v)); for (let x = XS; x <= 2200; x += 40) HO.push(hullAt(x, VR)); HO.push([2300, -400], [2300, 2000], [-400, 2000]);
  clipDraw(f, HO, () => {
  const strake = (v0, v1, tone) => { const top = xs.map(x => hullAt(x, v1)), bot = xs.map(x => hullAt(x, v0)); return [...bot, ...top.reverse()]; };
  const SV = []; for (let v = -150; v < 1700; v += 44 + ((v / 44) % 3 === 0 ? 6 : 0)) SV.push(v);
  // the whole face first (so nothing shows between the strakes), then each strake
  f.part([hullAt(-160, -160), hullAt(2000, -160), hullAt(2000, 1700), hullAt(-160, 1700)].map(q => q), HL({ inkW: 0, inkHeavy: 0 }));
  for (let k = 0; k < SV.length - 1; k++) {
    const v0 = SV[k], v1 = SV[k + 1], sh = strake(v0, v1);
    f.part(sh, HL({ fill: mix(hull, hullL, 0.05 + 0.1 * ((k * 7) % 3) / 2), maxShade: 10, inkW: 1, inkHeavy: 1.6 }));
    clipDraw(f, sh, () => {
      // swollen between the frames: a lit bulge on each bay's top, a dark pinch at each frame line, the plank's lower
      // edge in shadow; the grain, and long splits along it where the sea froze in the seams
      for (let x = -120; x < 2000; x += 170) { f.stroke([hullAt(x + 20, v1 - 10), hullAt(x + 85, v1 - 7), hullAt(x + 150, v1 - 10)], 9, hullL, { op: 0.45 }); f.line([hullAt(x, v0), hullAt(x + 1, v1)], 2.2, hullS, { op: 0.6 }); }
      f.line(xs.map(x => hullAt(x, v0 + 6)), 6, hullS, { op: 0.5 });
      for (let i = 0; i < 4; i++) { const x0 = -100 + f.r() * 2000, vv = v0 + 10 + f.r() * (v1 - v0 - 20); f.line([hullAt(x0, vv), hullAt(x0 + 120, vv + 2), hullAt(x0 + 260, vv - 1)], 1, '#4e5460', { op: 0.6 }); }
      if (f.r() < 0.5) { const x0 = -100 + f.r() * 1900, vv = (v0 + v1) / 2; f.line([hullAt(x0, vv), hullAt(x0 + 90, vv + 3), hullAt(x0 + 200, vv - 2)], 2.6, '#000', { op: 0.9 }); f.line([hullAt(x0, vv + 4), hullAt(x0 + 200, vv + 2)], 1, '#dfe7ec', { op: 0.5 }); } // a split, rimed in its lip
    });
  }
  // where the curve turns away (left): the face darker and the planks crowding; rime rind thickest at the top
  f.flat([[-10, -10], [460, -10], [300, Hc], [-10, Hc]], hullS, { op: 0.35 });
  f.flat([[-10, -10], [220, -10], [120, Hc], [-10, Hc]], hullS, { op: 0.3 });
  f.raw(`<path d="M0,0 L1800,0 L1800,${Hc} L0,${Hc} Z" fill="url(#${X.hoar})" opacity="0.5" style="mix-blend-mode:screen"/>`);
  // the rind: a hoar bloom over the whole face, densest high up; rime lumps on the strake edges only in the upper reaches
  f.flat([hullAt(-160, 900), hullAt(2000, 900), hullAt(2000, 1700), hullAt(-160, 1700)], '#dfe7ec', { op: 0.12 }); f.flat([hullAt(-160, 1150), hullAt(2000, 1150), hullAt(2000, 1700), hullAt(-160, 1700)], '#dfe7ec', { op: 0.12 });
  for (let k = 0; k < SV.length - 1; k++) { const v = SV[k + 1]; if (v < 880 || k % 2) continue; const op = Math.min(1, (v - 880) / 500); rimeBroken(f, X, xs.filter((_, i) => i % 3 === 0).map(x => hullAt(x, v - 2)), 5 + op * 10, -1, { gaps: 0.55 - op * 0.3 }); }
  // the frames' trenails: rows of dark pegs
  for (let x = -80; x < 1900; x += 170) for (let k = 0; k < SV.length; k += 2) f.flat(ell(hullAt(x, SV[k] + 20), 3, 3, 0, 6), '#0a0b0d', { op: 0.7 });
  });
  // the stem timber at the bow edge, rimed on its windward lip, icicles under every strake end
  const stemL = []; for (let v = -60; v <= VR + 30; v += 40) stemL.push(hullAt(XS, v));
  f.part([...stemL.map(q => add(q, [-30, 0])), ...stemL.slice().reverse().map(q => add(q, [8, 0]))], HL({ fill: '#2a2c32', maxShade: 10, inkW: 1.8 }));
  f.stroke(stemL.map(q => add(q, [-18, 0])), 6, '#5a5e66', { op: 0.5 });
  X.icicles(stemL.filter((_, i) => i % 3 === 0).map(q => add(q, [-30, 6])), 12, 90, 8);
  // the rail along the top: a cap rail standing proud with its lit top, hammock nettings above it on iron crutches, the
  // crew's hammocks rolled and stowed in them, frozen into a lumpy white bank (some gone, a gap where the shot went through)
  const rl = xs.map(x => hullAt(x, VR));
  f.flat([...rl.map(q => add(q, [0, 8])), ...rl.slice().reverse().map(q => add(q, [-10, 40]))], '#000', { op: 0.5 });
  f.part([...rl.map(q => add(q, [0, -20])), ...rl.slice().reverse().map(q => add(q, [0, 18]))], HL({ fill: '#2e3036', maxShade: 8, inkW: 1.8 }));
  f.part([...rl.map(q => add(q, [0, -20])), ...rl.slice().reverse().map(q => add(q, [12, -34]))], HL({ fill: '#5a5e66', maxShade: 3, inkW: 1.1 }));
  X.icicles(rl.filter((_, i) => i % 2 === 0).map(q => add(q, [0, 18])), 30, 110, 9);
  for (let x = XS + 60; x < 1900; x += 150) { const q = hullAt(x, VR); f.line([add(q, [6, -30]), add(q, [10, -110]), add(q, [-4, -124])], 6, '#0a0a0c'); f.line([add(q, [6, -30]), add(q, [10, -110])], 3, PAL.iron); }
  // (ruler upgrade pass) the hammocks were a row of one shape. Each is now its own roll: fat or thin, tall or squat, some
  // leaning, some slumped where the lashing has slackened, tied with two to five turns at uneven heights (one snapped, its
  // end hanging), in canvas of different wear (one tarred black, one bleached), and frosted differently (a heavy snow cap,
  // a light rime, a clear glaze with icicles, or bare wet canvas); one half-unrolled, its blanket edge spilling over
  // (consistency pass 2026-11-25) still read as a row of evenly spaced upright bottles: now packed in clumps with gaps,
  // a wider range of size and lean (some toppled against a neighbour), and rolls laid flat across the tops of the others
  const rH = E.rng(7231), ham = []; for (let x = XS + 30; x < 1960; x += (rH() < 0.4 ? 20 + rH() * 14 : 46 + rH() * 70)) { if (x > 780 && x < 900) continue; ham.push(x); }
  const hamTop = [];
  const HCOL = [['#8a9298', '#2c323a', '#c8d0d4'], ['#7a8288', '#262c34', '#b8c0c6'], ['#9ea6aa', '#363c44', '#dce2e4'], ['#5e666e', '#1c2026', '#98a0a8'], ['#3a4048', '#101216', '#6a727c'], ['#acb2b4', '#424a52', '#e4e8ea']];
  ham.forEach((x, hi) => {
    const big = rH(), q = add(hullAt(x, VR), [8, -36]), h = 30 + big * 84, w = 17 + rH() * 16 + big * 4, lean = (rH() - 0.5) * (rH() < 0.22 ? 60 : 26), slump = rH() < 0.3 ? 0.18 + rH() * 0.22 : rH() * 0.08;
    const col = HCOL[Math.floor(rH() * HCOL.length)], frost = rH(), nL = 2 + Math.floor(rH() * 4), snap = rH() < 0.18 ? Math.floor(rH() * nL) : -1;
    const Ls = []; for (let i = 0; i < nL; i++) Ls.push(0.12 + (i + 0.5) / nL * 0.74 + (rH() - 0.5) * 0.08);
    const pinch = t => Ls.reduce((m, l, i) => m + (i === snap ? 0 : 0.14) * Math.exp(-Math.pow((t - l) / 0.05, 2)), 0);
    const L = [], R = []; for (let i = 0; i <= 10; i++) { const t = i / 10, ww = w * (1 - pinch(t)) * (0.94 + 0.08 * Math.sin(t * 3 + hi)), cx = lean * t; L.push(add(q, [cx - ww, -h * t])); R.push(add(q, [cx + ww * (1 + slump * t * 0.6), -h * t * (1 - slump * t)])); }
    const tl = L[10], tr = R[10], tw = E.len(sub(tr, tl)), top = [add(tr, [-tw * 0.04, -tw * 0.3]), add(lerp(tl, tr, 0.72), [-slump * 20, -tw * 0.5 + slump * 16]), add(lerp(tl, tr, 0.3), [-slump * 30, -tw * 0.52 + slump * 26]), add(tl, [tw * 0.05, -tw * 0.28])]; // a rounded end, slumped to one side
    const hm = [...L, ...top.slice().reverse().reverse(), ...R.slice().reverse()].map(p => [p[0], p[1]]);
    const outline = [...L, ...top.slice().reverse(), ...R.slice().reverse()]; hamTop.push({ x, p: lerp(tl, tr, 0.5), w });
    f.part(outline, { fill: col[0], shadow: col[1], light: col[2], tex: 'weave720', texOp: 0.45, shade: 0.38, inkW: 1.4, cast: false, maxShade: w * 0.7 }); void hm;
    clipDraw(f, outline, () => {
      f.flat([add(q, [lean * 0.5 - w * 1.2, 4]), add(q, [lean * 0.5 - w * 0.3, 4]), add(q, [lean - w * 0.4, -h - 30]), add(q, [lean - w * 1.4, -h - 30])], '#000', { op: 0.22 }); // the roll turning from the light
      f.line([add(q, [lean * 0.4 + w * 0.42, -h * 0.05]), add(q, [lean * 0.9 + w * 0.5, -h * 0.92])], 2.2, col[2], { op: 0.45 }); // its lit flank
      if (frost > 0.75) f.flat([add(q, [-w * 0.4, 0]), add(q, [w * 1.2, 0]), add(q, [w * 1.2 + lean, -h * 0.4]), add(q, [-w * 0.4 + lean, -h * 0.3])], '#0a0c10', { op: 0.3 }); // bare wet canvas, dark to the waist
      if (rH() < 0.4) f.stitches([add(q, [lean * 0.2 - w * 0.1, -h * 0.1]), add(q, [lean * 0.7 - w * 0.12, -h * 0.85])], '#c8ccd0', 0.6); // the sewn seam
    });
    Ls.forEach((l, i) => { // the lashings: turns of marline round the roll, cut into it
      const yL = lerp(L[Math.round(l * 10)], R[Math.round(l * 10)], 0), yR = R[Math.round(l * 10)], tilt = (rH() - 0.5) * 8;
      if (i === snap) { f.line([add(yR, [0, 0]), add(yR, [6, 18]), add(yR, [2, 40 + rH() * 20])], 2.2, '#20242a'); X.icicle(add(yR, [2, 44]), 12, 3); return; } // snapped: the end hangs loose
      f.line([add(yL, [-1, tilt * 0.5]), lerp(add(yL, [0, tilt]), yR, 0.5).map((v, k) => v + (k ? 4 : 0)), add(yR, [1, -tilt * 0.5])], 2.6, '#1a1d22');
      f.line([add(yL, [2, tilt * 0.5 - 2]), add(lerp(yL, yR, 0.5), [0, 2]), add(yR, [-2, -tilt * 0.5 - 2])], 1, '#8a9096', { op: 0.6 });
    });
    if (frost < 0.35) { X.rime(top.concat([add(tr, [w * 0.1, h * 0.12])]).reverse(), 9 + rH() * 6, -1); X.icicles([add(L[3], [0, 4]), add(R[3], [0, 4])], 2, 18 + rH() * 26, 5); } // a heavy snow cap
    else if (frost < 0.6) X.rime([top[0], top[1]], 5 + rH() * 3, -1); // a light rime
    else if (frost < 0.75) { f.part([...R.slice(4).map(p => add(p, [3, 0])), add(top[0], [2, -2]), ...R.slice(4).reverse().map(p => add(p, [-w * 0.5, 0]))], X.IC({ fill: '#dbe4ea', opacity: 0.4, inkW: 0.8 })); X.icicles([add(R[2], [-w * 0.4, 0]), add(R[2], [2, 0])], 2, 22 + rH() * 20, 5); } // a clear glaze down the windward side
  });
  // (consistency pass) rolls thrown flat across the tops of their neighbours where the stowage was rushed: horizontal
  // masses that break the row of uprights, lashed, rimed on top, sagging between the two rolls they lie on
  const T3curve = (a, m, b, w) => { const C = []; for (let i = 0; i <= 12; i++) { const t = i / 12, p = add(add(mul(a, (1 - t) * (1 - t)), mul(m, 2 * t * (1 - t))), mul(b, t * t)); C.push(p); } const Lf = [], Rt = []; C.forEach((p, i) => { const d = E.norm(sub(C[Math.min(12, i + 1)], C[Math.max(0, i - 1)])), n = [-d[1], d[0]], t = i / 12, ww = w * 0.5 * (0.82 + 0.18 * Math.sin(t * Math.PI)) * (1 - 0.12 * Math.exp(-Math.pow((t - 0.3) / 0.06, 2)) - 0.12 * Math.exp(-Math.pow((t - 0.72) / 0.06, 2))); Lf.push(add(p, mul(n, ww))); Rt.push(add(p, mul(n, -ww))); }); const e0 = add(C[0], mul(E.norm(sub(C[0], C[1])), w * 0.42)), e1 = add(C[12], mul(E.norm(sub(C[12], C[11])), w * 0.42)); return [e0, ...Lf, e1, ...Rt.reverse()]; }; // a sagging roll, pinched by its lashings
  { const rF = E.rng(7232);
    for (let k = 0; k < hamTop.length - 1; k++) {
      const a = hamTop[k], b = hamTop[k + 1];
      if (b.x - a.x > 80 || rF() > 0.24) continue;
      const rw = 16 + rF() * 7, p0 = add(a.p, [-a.w * 0.7, -rw * 0.3]), p1 = add(b.p, [b.w * 0.7, -rw * 0.3 + (rF() - 0.5) * 8]), sg = E.len(sub(p1, p0)) * 0.12, mid = add(lerp(p0, p1, 0.5), [0, sg]);
      const col = [['#8a9298', '#2c323a', '#c8d0d4'], ['#6a7278', '#22282e', '#a8b0b6'], ['#a6acb0', '#3e444c', '#dfe4e6']][Math.floor(rF() * 3)];
      f.part(T3curve(p0, mid, p1, rw), { fill: col[0], shadow: col[1], light: col[2], tex: 'weave720', texOp: 0.45, shade: 0.4, inkW: 1.4, cast: true, castOp: 0.4, maxShade: rw * 0.6 });
      for (const t of [0.22, 0.5 + (rF() - 0.5) * 0.1, 0.8]) { const c = lerp(p0, p1, t); f.line([add(c, [-2, -rw * 0.5]), add(c, [3, 0]), add(c, [1, rw * 0.5])], 2.4, '#1a1d22'); }
      f.line([lp(p0, p1, 0.08, -rw * 0.3), lp(p0, p1, 0.92, -rw * 0.28)], 1.6, col[2], { op: 0.5 });
      X.rime([lp(p0, p1, 0.06, -rw * 0.45), lp(p0, p1, 0.5, -rw * 0.5), lp(p0, p1, 0.94, -rw * 0.42)], 6 + rF() * 4, -1);
      if (rF() < 0.5) X.icicles([lp(p0, p1, 0.4, rw * 0.5), lp(p0, p1, 0.6, rw * 0.5)], 2, 14 + rF() * 16, 4);
      k++; // never stack two in a row
    } }
  // one roll half-unrolled: the canvas hanging over the netting, a grey blanket's striped edge spilling from it, frozen stiff
  { const q = add(hullAt(1240, VR), [8, -100]), fl = [add(q, [-26, 0]), add(q, [30, -6]), add(q, [40, 60]), add(q, [34, 130]), add(q, [10, 150, 1]), add(q, [-6, 128]), add(q, [-22, 146, 1]), add(q, [-36, 80])];
    f.part(fl, { fill: '#9ea6aa', shadow: '#363c44', light: '#dce2e4', tex: 'weave720', texOp: 0.45, shade: 0.38, inkW: 1.4, cast: false, maxShade: 20 });
    clipDraw(f, fl, () => { for (const [x0, x1] of [[-10, -14], [8, 12], [22, 26]]) { f.stroke([add(q, [x0, 10]), add(q, [x0 + 4, 70]), add(q, [x1, 140])], 5, '#2a3038', { op: 0.5 }); f.line([add(q, [x0 + 5, 12]), add(q, [x0 + 9, 70]), add(q, [x1 + 5, 136])], 1.6, '#dce2e4', { op: 0.5 }); } f.flat([add(q, [-40, -10]), add(q, [44, -16]), add(q, [44, 16]), add(q, [-40, 20])], '#000', { op: 0.2 }); }); // stiff frozen folds where it bends over the netting
    const bl = [add(q, [-30, 70]), add(q, [-10, 66]), add(q, [-6, 140]), add(q, [-18, 170, 1]), add(q, [-34, 150])]; f.part(bl, { fill: '#5a6068', shadow: '#1c2026', tex: 'weave720', texOp: 0.5, shade: 0.35, inkW: 1.2, cast: false, maxShade: 10 });
    for (const dy of [96, 120]) f.line([add(q, [-32, dy]), add(q, [-8, dy - 4])], 3, '#c8ccd0', { op: 0.6 });
    X.icicles([add(q, [10, 150]), add(q, [-22, 168])], 3, 34, 5); X.rime([add(q, [-26, 0]), add(q, [30, -6])], 8, -1); }
  for (const k of [0, 1]) { const pts = []; for (let x = XS + 40; x < 1980; x += 80) pts.push(add(hullAt(x, VR), [6, -70 - k * 44 + Math.sin(x / 60) * 4])); f.line(pts, 2, '#1c2024', { op: 0.7 }); }

  // ---- below the waterline: barnacles crusted on the planking and frozen kelp streamers hanging plumb
  X.barnacles(hullAt(900, -60), 900, 40, 60, 9);
  for (let i = 0; i < 9; i++) { const q = hullAt(60 + i * 200 + f.r() * 60, 20 + f.r() * 30), l = 80 + f.r() * 100; f.line([q, add(q, [6, l * 0.5]), add(q, [-2, l])], 8, INK, { op: 0.7 }); f.line([q, add(q, [6, l * 0.5]), add(q, [-2, l])], 5, '#465256'); X.icicle(add(q, [-2, l - 4]), 14, 4); }
  // the waterline: a thick collar of ice where the sea gripped her, then pressure ice heaped against the hull
  const wl = xs.map(x => hullAt(x, 0));
  f.part([...wl.map(q => add(q, [0, -34])), ...wl.slice().reverse().map(q => add(q, [0, 30]))], X.IC({ fill: '#c8d4dc', shade: 0.3, inkW: 1.4, inkHeavy: 2 }));
  rimeBroken(f, X, wl.filter((_, i) => i % 2 === 0).map(q => add(q, [0, -34])), 14, -1);
  X.icicles(wl.filter((_, i) => i % 2 === 0).map(q => add(q, [0, 30])), 26, 60, 8);

  // ---- the wales: heavy strakes standing proud of the face, with a lit top and a cast shadow; the name board
  const wale = (v, h, proud) => {
    const top = xs.map(x => hullAt(x, v + h)), bot = xs.map(x => hullAt(x, v));
    f.flat([...bot.map(q => add(q, [0, 4])), ...bot.slice().reverse().map(q => add(q, [-proud * 0.3, proud * 0.9]))], '#000', { op: 0.55 }); // its shadow on the planks below
    f.part([...bot, ...top.slice().reverse()], HL({ fill: '#24262c', maxShade: 12, inkW: 1.6 }));
    f.part([...top, ...top.slice().reverse().map(q => add(q, [proud * 0.2, -proud * 0.55]))], HL({ fill: '#5a5e66', maxShade: 4, inkW: 1.2 })); // the lit upper face
    rimeBroken(f, X, top.filter((_, i) => i % 2 === 0).map(q => add(q, [proud * 0.1, -proud * 0.5])), 14 + v / 120, -1, { gaps: 0.2 });
    X.icicles(bot.filter((_, i) => i % 2 === 0), 30, 70 + v / 12, 9);
  };
  wale(300, 50, 26); wale(800, 56, 26);
  const nb = [hullAt(150, 870), hullAt(560, 870), hullAt(560, 940), hullAt(150, 940)];
  f.part(nb, HL({ fill: '#3a3a3e', maxShade: 8, inkW: 1.6 }));
  for (let i = 0; i < 9; i++) { const q = lerp(lerp(nb[0], nb[3], 0.5), lerp(nb[1], nb[2], 0.5), 0.08 + i * 0.1); f.line([add(q, [-10, -18]), add(q, [-2, 18]), add(q, [8, -16])], 3, '#0a0a0c'); f.line([add(q, [-9, -17]), add(q, [-1, 17])], 1, '#8a8e96', { op: 0.5 }); } // the carved letters, worn past reading
  f.part([lerp(nb[0], nb[1], 0.45), nb[1], nb[2], lerp(nb[3], nb[2], 0.3)], X.IC({ fill: '#e2e9ed', opacity: 0.92 })); // half under rime

  // ---- the ports: dark gun deck within, the lining showing the hull's thickness, the sill projecting, the lid open
  const portQuad = (p) => { const [x, v0, v1] = p; return [hullAt(x - PW / 2, v1), hullAt(x + PW / 2, v1), hullAt(x + PW / 2, v0), hullAt(x - PW / 2, v0)]; };
  const drawPortHole = (p, i) => {
    const Q = portQuad(p), I = Q.map(q => inward(q));
    f.flat(Q, '#050607');
    f.flat(I.map(q => add(q, [0, 0])), '#0b0d10'); // the deck in there, dark
    f.part([Q[0], Q[1], I[1], I[0]], HL({ fill: '#3a3c42', maxShade: 4, inkW: 1 })); // the soffit (the viewer looks up into it)
    f.part([Q[1], Q[2], I[2], I[1]], HL({ fill: '#16171b', maxShade: 4, inkW: 1 })); f.part([Q[0], Q[3], I[3], I[0]], HL({ fill: '#2a2c32', maxShade: 4, inkW: 1 })); // side linings
    for (let k = 0; k < 4; k++) f.line([lerp(Q[0], I[0], 0.25 * k + 0.1), lerp(Q[1], I[1], 0.25 * k + 0.1)], 1, '#0a0a0c', { op: 0.6 }); // the lining's planking
  };
  const drawSill = (p) => {
    const Q = portQuad(p), a = add(Q[3], [-16, 0]), b = add(Q[2], [16, 0]);
    const sill = [add(a, [0, -6]), add(b, [0, -6]), add(b, [-10, 26]), add(a, [-10, 26])];
    f.part(sill, HL({ fill: '#2e3036', maxShade: 8, inkW: 1.6 }));
    f.part([add(a, [0, -6]), add(b, [0, -6]), add(b, [8, -16]), add(a, [8, -16])], HL({ fill: '#5a5e66', maxShade: 3, inkW: 1 }));
    rimeBroken(f, X, [add(a, [8, -16]), lerp(a, b, 0.5).map((v, j) => j ? v - 16 : v + 8), add(b, [8, -16])], 12, -1, { gaps: 0.1 });
    X.icicles([add(a, [-8, 28]), add(b, [-8, 28])], 9, 150, 10); // icicles longer than a man's forearm, hanging plumb from the sill
    // the port's frame round the opening
    f.line([Q[3], Q[0], Q[1], Q[2]], 5, '#0a0a0c', { op: 0.9 });
  };
  const drawLid = (p, i, broken) => {
    f.bone(`lid_${i + 1}`);
    const Q = portQuad(p), h0 = Q[0], h1 = Q[1];
    // the lid swung up and out on its hinges, its inner face toward the viewer; one hangs from a single hinge, skewed
    const out = broken ? [h0, add(h0, [40, 40]), add(h0, [70, 300]), add(h0, [-200, 250])] : [h0, h1, add(h1, [60, -170]), add(h0, [70, -180])];
    const L2 = broken ? [h1, add(h1, [-30, 30]), add(h1, [-120, 280]), add(h1, [-300, 200])] : out;
    const lid = broken ? L2 : out;
    f.part(lid, HL({ fill: '#2a2c32', maxShade: 10, inkW: 1.6, sharp: true }));
    f.part([lid[0], lid[1], add(lid[1], [-8, 14]), add(lid[0], [-8, 14])], HL({ fill: '#121316', maxShade: 2, inkW: 1, sharp: true })); // the lid's thickness at the hinge
    clipDraw(f, lid, () => { for (let k = 1; k < 5; k++) f.line([lerp(lid[0], lid[3], k / 5), lerp(lid[1], lid[2], k / 5)], 1.4, '#0a0a0c', { op: 0.7 }); });
    for (const t of [0.25, 0.75]) { const a = lerp(lid[0], lid[1], t), b = lerp(lid[3], lid[2], t); f.line([a, lerp(a, b, 0.9)], 7, '#3a3e44'); f.line([a, lerp(a, b, 0.9)], 2, '#6a6e76', { op: 0.6 }); } // the hinge straps
    rimeBroken(f, X, [lid[3], lerp(lid[3], lid[2], 0.5), lid[2]], 12, broken ? 1 : -1, { gaps: 0.1 });
    X.icicles([lerp(lid[0], lid[3], 0.0), lerp(lid[1], lid[2], 0.0)].map(q => add(q, [0, 2])), 3, 40, 6);
    if (broken) { X.icicles([lid[2], lid[3]], 4, 60, 7); }
    else X.icicles([lid[3], lid[2]], 5, 70, 8);
    f.bone('hull');
  };
  // ---- a gun run out at a port, traversed toward the heroes: breech in the dark, the barrel foreshortened, the muzzle
  // face ringed, the bore plugged with a core of ice; the tompion hanging on its cord; rime on top, icicles beneath
  const drawGun = (p, i, burst) => {
    f.bone(`gun_${i + 1}`);
    const Q = portQuad(p), c = lerp(lerp(Q[3], Q[2], 0.5), lerp(Q[0], Q[1], 0.5), 0.36);
    const br = inward(c, 0.1), mz = add(c, [150, 34]), rM = 46;
    const d = E.norm(sub(mz, br)), n = [-d[1], d[0]];
    const barrel = [add(br, mul(n, 40)), add(mz, mul(n, rM)), add(mz, mul(n, -rM)), add(br, mul(n, -40))];
    f.part(barrel, { fill: '#2a2c30', shadow: '#060708', light: '#6a6e76', tex: 'mottle720', texOp: 0.5, shade: 0.35, maxShade: 20, inkW: 1.6, cast: false });
    for (const t of [0.35, 0.62, 0.86]) f.part([add(lerp(br, mz, t), mul(n, 44 + t * 8)), add(lerp(br, mz, t + 0.05), mul(n, 44 + t * 8)), add(lerp(br, mz, t + 0.05), mul(n, -44 - t * 8)), add(lerp(br, mz, t), mul(n, -44 - t * 8))], { fill: '#34363c', shade: 0.35, inkW: 1.1, cast: false }); // reinforce rings
    if (burst) {
      // burst along its barrel: the iron peeled open in strips curling back from the muzzle, the ice core showing
      f.part([add(lerp(br, mz, 0.5), mul(n, 30)), add(mz, mul(n, 30)), add(mz, mul(n, -30)), add(lerp(br, mz, 0.5), mul(n, -30))], X.IC({ fill: '#e2eaee', inkW: 1.2 }));
      for (const sgn of [-1, -0.35, 0.35, 1]) { const b0 = add(lerp(br, mz, 0.55), mul(n, sgn * 40)); const tip = add(add(mz, mul(n, sgn * (rM + 60))), mul(d, -40 - Math.abs(sgn) * 20)); f.part([b0, add(lerp(b0, tip, 0.5), mul(n, sgn * 14)), tip, add(tip, mul(d, -14)), add(lerp(b0, tip, 0.5), mul(n, sgn * 4)), add(b0, mul(d, 30))], { fill: '#2e3034', shadow: '#060708', light: '#7a7e86', shade: 0.35, inkW: 1.3, cast: false }); X.icicle(add(tip, [0, 4]), 30, 6); }
      X.cracks(lerp(br, mz, 0.45), 40, 4, 0);
    } else {
      const face = ell(mz, rM * 0.55, rM, Math.atan2(d[1], d[0]), 18);
      f.part(face, { fill: '#3a3c42', shade: 0.3, inkW: 1.6, cast: false });
      f.part(ell(mz, rM * 0.34, rM * 0.6, Math.atan2(d[1], d[0]), 14), X.IC({ fill: '#dde6ec', inkW: 1.2 })); // the bore plugged with ice
      X.cracks(mz, 22, 2, 0.3);
      rope(f, [add(mz, mul(n, rM)), add(mz, [20, 60]), add(mz, [16, 96])], 2.4, PAL.rope);
      f.part(ell(add(mz, [16, 112]), 14, 18, 0, 12), { fill: PAL.wood, shade: 0.35, inkW: 1.1, cast: false, tex: 'wood720' }); // the wooden tompion on its cord
    }
    X.rime([add(br, mul(n, 40)), add(lerp(br, mz, 0.5), mul(n, 46)), add(mz, mul(n, rM))], 12, 1);
    X.icicles([add(br, mul(n, -40)), add(mz, mul(n, -rM))], 4, 40, 7);
    f.bone('hull');
    return { br, mz, d, n };
  };

  // ---- shot holes plugged with wooden bungs, a broken harpoon in the wale, the fender of old cable
  for (const [x, v] of [[700, 560], [1130, 230], [1600, 720]]) { const q = hullAt(x, v); f.part(ell(q, 22, 20, 0, 12), { fill: PAL.woodL, shadow: '#1c1c1c', light: '#8a867c', shade: 0.35, inkW: 1.4, cast: false, tex: 'wood720' }); f.line(ell(q, 26, 24, 0, 14).slice(2, 9), 2, '#000', { op: 0.6 }); f.line([add(q, [-10, -4]), add(q, [10, 4])], 1.4, INK, { op: 0.5 }); X.icicle(add(q, [0, 20]), 30, 6); }
  const hw = hullAt(1300, 830), hw1 = add(hw, rot([260, 0], deg(-140)));
  f.part(limb(hw, hw1, 24, 20, { steps: 6 }), { fill: PAL.wood, shadow: '#141414', tex: 'wood720', light: PAL.woodL, maxShade: 10 });
  f.part([lp(hw, hw1, -0.03, -15), lp(hw, hw1, 0.12, -14), lp(hw, hw1, 0.12, 14), lp(hw, hw1, -0.03, 15)], { fill: PAL.iron, shade: 0.4, inkW: 1.2, cast: false, sharp: true });
  f.line([hw1, add(hw1, [-8, -12]), add(hw1, [4, -20])], 4, PAL.woodL); X.rime([lp(hw, hw1, 0.1, -12), lp(hw, hw1, 0.95, -10)], 8, -1);
  rope(f, [lp(hw, hw1, 0.5, 10), add(hw, [-60, 120]), add(hw, [-40, 260])], 3, PAL.rope); X.icicle(add(hw, [-40, 258]), 20, 5);
  f.bone('fender');
  const fq = hullAt(650, 300); rope(f, [add(fq, [0, -120]), fq], 3, PAL.rope);
  f.part([add(fq, [-40, 0]), add(fq, [40, 0]), add(fq, [46, 120]), add(fq, [0, 150]), add(fq, [-46, 120])], { fill: '#5a5e62', shadow: '#1c2024', light: '#8a9094', tex: 'mottle720', texOp: 0.5, shade: 0.35, inkW: 1.5, cast: false, maxShade: 16 });
  for (let i = 0; i < 6; i++) f.line([add(fq, [-40, 14 + i * 20]), add(fq, [40, 6 + i * 20])], 2, '#1c2024', { op: 0.7 });
  X.rime([add(fq, [-40, 2]), add(fq, [0, -6]), add(fq, [40, 2])], 10, -1); X.icicles([add(fq, [-30, 130]), add(fq, [30, 130])], 3, 40, 6);
  f.bone('hull');

  // ---- the upper tier: holes, guns, sills, lids (the far right one hangs on a single hinge)
  UT.forEach((p, j) => drawPortHole(p, 3 + j));
  const gU = [drawGun(UT[0], 3, false), drawGun(UT[1], 4, false)];
  UT.forEach((p, j) => { drawSill(p); drawLid(p, 3 + j, j === 2); });
  // the channel at the frame top: a ledge standing out from the hull with the deadeyes, the lanyards rove through them,
  // the chain-plates running down the face, and the shrouds rising out of the frame
  const ch = xs.map(x => hullAt(x, 1380));
  f.flat([...ch.map(q => add(q, [0, 6])), ...ch.slice().reverse().map(q => add(q, [-12, 46]))], '#000', { op: 0.55 });
  f.part([...ch, ...ch.slice().reverse().map(q => add(q, [0, 30]))], HL({ fill: '#2a2c32', maxShade: 8 }));
  f.part([...ch, ...ch.slice().reverse().map(q => add(q, [14, -24]))], HL({ fill: '#5a5e66', maxShade: 3, inkW: 1 }));
  for (let k = 0; k < 6; k++) {
    const x = 520 + k * 150, base = hullAt(x, 1386), lo = hullAt(x - 10, 1120);
    f.line([lo, base], 7, '#0a0a0c'); f.line([lo, base], 4, PAL.iron); f.rivet(lo, 5, PAL.iron); // chain-plate
    const de = add(base, [10, -40]); f.part(ell(de, 22, 26, 0, 12), { fill: PAL.wood, shade: 0.35, inkW: 1.3, cast: false, tex: 'wood720' }); for (const dy of [-10, 0, 10]) f.flat(ell(add(de, [0, dy]), 4, 4, 0, 6), '#0a0a0c');
    const de2 = add(de, [26, -130]); f.part(ell(de2, 22, 26, 0, 12), { fill: PAL.wood, shade: 0.35, inkW: 1.3, cast: false, tex: 'wood720' });
    for (const dx of [-8, 0, 8]) f.line([add(de, [dx, -16]), add(de2, [dx, 16])], 2.6, PAL.rope); // lanyards
    rope(f, [add(de2, [0, -20]), add(de2, [120, -600])], 14, PAL.rig); X.rime([add(de2, [8, -20]), add(de2, [128, -600])], 8, -1); // the shroud rising out of frame
    X.icicles([add(de, [-20, 26]), add(de, [20, 26])], 2, 40, 6);
  }
  rimeBroken(f, X, ch.filter((_, i) => i % 2 === 0).map(q => add(q, [14, -24])), 20, -1, { gaps: 0.1 });
  X.icicles(ch.filter((_, i) => i % 2 === 0).map(q => add(q, [0, 30])), 26, 120, 9);

  // ---- the boarding net frozen over the side in a stiff sheet, from above the upper tier down past it, at the right
  f.bone('net');
  const NP = (u, w) => add(hullAt(1440 + u * 340, 1360 - w * 520), [Math.sin(u * 7 + w * 3) * 6, 0]);
  const netSheet = [NP(0, 0), NP(1, 0), NP(1.02, 1), NP(0.5, 1.06), NP(-0.02, 0.98)];
  f.part(netSheet, X.IC({ fill: '#c4d2dc', opacity: 0.45, inkW: 1, inkHeavy: 1.2 }));
  for (let a = 0; a <= 8; a++) { const pts = []; for (let w = 0; w <= 10; w++) pts.push(NP(a / 8, w / 10)); f.line(pts, 4, INK, { op: 0.7 }); f.line(pts, 2.4, PAL.rig); }
  for (let w = 0; w <= 10; w++) { const pts = []; for (let a = 0; a <= 8; a++) pts.push(NP(a / 8, w / 10)); f.line(pts, 4, INK, { op: 0.7 }); f.line(pts, 2.4, PAL.rig); }
  for (let a = 0; a <= 8; a++) for (let w = 0; w <= 10; w += 2) f.flat(ell(NP(a / 8, w / 10), 5, 4, 0, 6), '#e4eaee');
  X.icicles([NP(0, 1), NP(0.5, 1.06), NP(1, 1)], 9, 60, 6);
  f.bone('hull');

  // ---- the lower tier: holes, guns (the centre one burst), then the gunners leaning out, then sills and lids
  LT.forEach((p, j) => drawPortHole(p, j));
  const gL = LT.map((p, j) => drawGun(p, j, j === 1));
  // a sheet of ice bridging the two right lower ports like a membrane, sagging between them
  const m0 = hullAt(LT[1][0] + PW / 2 + 10, 640), m1 = hullAt(LT[2][0] - PW / 2 - 10, 640), m2 = hullAt(LT[2][0] - PW / 2 - 10, 360), m3 = hullAt(LT[1][0] + PW / 2 + 10, 360);
  const mem = [m0, lerp(m0, m1, 0.5).map((v, j) => j ? v + 30 : v), m1, m2, lerp(m3, m2, 0.5).map((v, j) => j ? v - 20 : v), m3];
  f.part(mem, X.IC({ fill: '#c8d6e0', opacity: 0.5, inkW: 1.2, inkHeavy: 1.6 }));
  clipDraw(f, mem, () => { for (let i = 0; i < 5; i++) f.line([lerp(m0, m3, i / 5), lerp(lerp(m0, m1, 0.5), lerp(m3, m2, 0.5), i / 5).map((v, j) => j ? v + 20 : v), lerp(m1, m2, i / 5)], 1.4, '#eef4f8', { op: 0.5 }); X.cracks(lerp(m0, m2, 0.5), 60, 4, 0.2); });
  X.icicles([lerp(m3, m2, 0.1), lerp(m3, m2, 0.9)], 6, 80, 7);

  // the gunners, leaning out of the ports to the waist, pale and swollen, frozen to the sill with their hands on the
  // gun or the rammer; kerchiefs knotted over their ears against the noise. The gun captain at the centre port is old
  // and grey-whiskered, a clay pipe frozen in his teeth, looking down along his burst gun.
  const gunner = (gi, p, g, o2) => {
    const Q = portQuad(p), sill = lerp(Q[3], Q[2], 0.32), P = add(sill, [-10, 40]), N = add(P, [70, -196]), C = add(lerp(N, P, 0.5), [-18, -10]);
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12) };
    Object.assign(J, o2.hands(J, S0));
    return sailor(f, X, Object.assign({ s: 1, pre: `g${gi}_`, parent: 'hull', J, hA: 0.36, model: true, belly: 0.16, sleeve: 'rolled', shirt: 'stripe', shirtCol: '#aab2b6', cap: 'kerchief', belt: false, hemIce: false, trouser: { col: '#8a9094' },
      face: { jaw: 1.2, chin: 0.03, nose: 1.05, hook: 0.15, mouth: 'set', squint: 0.6, browDown: 0.05, hairCol: '#1c1e22', age: true, faceShade: 0.72 } }, o2.opts));
  };
  // gunner 1 (left lower port): the rammer run into his gun's muzzle, both hands on its staff
  f.joint('rammer', [0, 0], 'g1_hand_n');
  gunner(1, LT[0], gL[0], {
    hands: (J, S0) => { const rA = angOf(add(gL[0].mz, [-260, -150]), gL[0].mz), r0 = add(gL[0].mz, [-260, -150]); const WN = lerp(r0, gL[0].mz, 0.2), WF = lerp(r0, gL[0].mz, 0.52); const [EN] = ik(J.SN, WN, 122, 106, 1), [EF] = ik(J.SF, WF, 122, 106, -1); f.joints.rammer.pivot = WN.map(v => Math.round(v * 10) / 10); this_rammer = { r0, rA }; return { WN, EN, WF, EF }; },
    opts: {
      persona: { chestW: 0.9, armW: 0.92, hair: 'long', mouth: 'open', frost: ['breath', 'brows'], neck: '#3e4652', face: { jaw: 1.02, chin: -0.01, nose: 0.9, hook: 0, squint: 0.15, browDown: -0.03, age: false, gaunt: true, beard: 'stubble', beardCol: '#2a2c32', hairCol: '#24262c' } },
      handN: { grip: { thumbAng: angOf(add(gL[0].mz, [-260, -150]), gL[0].mz), maxBend: 40 } }, handF: { grip: { thumbAng: angOf(add(gL[0].mz, [-260, -150]), gL[0].mz), maxBend: 40 } },
      beforeNear: () => { f.bone('rammer'); const r0 = add(gL[0].mz, [-260, -150]), r1 = add(gL[0].mz, mul(gL[0].d, -10)); f.part(limb(r0, r1, 14, 14, { steps: 6 }), { fill: PAL.woodL, shadow: '#1c1c1c', tex: 'wood720', shade: 0.35, inkW: 1.2, cast: false }); f.part(ell(r0, 16, 12, angOf(r0, r1), 10), { fill: PAL.wood, shade: 0.35, inkW: 1.1, cast: false }); X.rime([lp(r0, r1, 0.1, -7), lp(r0, r1, 0.9, -7)], 5, -1); X.icicles([lp(r0, r1, 0.2, 7), lp(r0, r1, 0.8, 7)], 3, 26, 4); },
    },
  });
  // gunner 2: the gun captain at the centre port, the linstock in his near fist, its match long dead
  f.joint('linstock', [0, 0], 'g2_hand_n');
  gunner(2, LT[1], gL[1], {
    hands: (J, S0) => { const WN = add(J.N, [40, 160]), WF = add(gL[1].br, [40, -30]); const [EN] = ik(J.SN, WN, 122, 106, 1), [EF] = ik(J.SF, WF, 122, 106, 1); f.joints.linstock.pivot = WN.map(v => Math.round(v * 10) / 10); return { WN, EN, WF, EF }; },
    opts: {
      hA: 0.5, cap: 'knit', shirt: 'check', persona: { chestW: 1.08, belly: 0.08, earring: true, frost: ['beard', 'brows'] }, face: { jaw: 1.24, chin: 0.04, nose: 1.12, hook: 0.3, mouth: 'set', squint: 0.7, browDown: 0.06, hairCol: '#a8b0b4', browCol: '#d4dce0', beard: 'short', beardCol: '#a0a8ac', age: true, faceShade: 0.72 },
      handN: { grip: { thumbAng: deg(-80), maxBend: 40 } }, handF: { open: { ang: deg(30), back: true, curl: 0.5, spread: 0.1 } },
      afterHead: ({ hF }) => clayPipe(f, X, hF([[0.3, 0.27]])[0], 0.4, 1),
      beforeNear: ({ S }) => { f.bone('linstock'); const l0 = add(S.at(0, 0), [0, 0]); const WN = f.joints.linstock.pivot; const a = add(WN, [-20, 200]), b = add(WN, [24, -150]); f.part(limb(a, b, 12, 12, { steps: 6 }), { fill: PAL.woodL, shadow: '#1c1c1c', tex: 'wood720', shade: 0.35, inkW: 1.2, cast: false }); const fk = b; f.line([fk, add(fk, [-16, -30])], 4, PAL.iron); f.line([fk, add(fk, [16, -30])], 4, PAL.iron); f.line([add(fk, [-16, -30]), add(fk, [-6, -40]), add(fk, [8, -36])], 4, '#3a3c40'); X.rime([lp(a, b, 0.4, -6), lp(a, b, 0.95, -6)], 5, -1); void l0; },
    },
  });
  // gunner 3 (right lower port): both hands on his gun, the powder horn on its baldric over his shoulder
  gunner(3, LT[2], gL[2], {
    hands: (J, S0) => { const WN = add(gL[2].br, [60, -40]), WF = add(gL[2].br, [110, -30]); const [EN] = ik(J.SN, WN, 122, 106, 1), [EF] = ik(J.SF, WF, 122, 106, 1); return { WN, EN, WF, EF }; },
    opts: {
      shirt: 'stripe', capCol: '#3a404c',
      persona: { chestW: 1.16, belly: 0.14, armW: 1.12, frost: ['mask'], face: { jaw: 1.42, chin: 0.06, nose: 1.22, hook: 0.45, squint: 0.4, browDown: 0.08, browW: 0.06, moustache: true, beard: 'stubble', beardCol: '#30343a', hairCol: '#30343a', scar: [[0.04, 0.04], [0.14, 0.12], [0.2, 0.22]], age: true } },
      handN: { open: { ang: deg(60), back: true, curl: 0.45, spread: 0.12 } }, handF: { open: { ang: deg(50), back: true, curl: 0.45, spread: 0.12, flip: true } },
      afterTorso: ({ S }) => { const a = S.at(-0.5, 0.0), b = S.at(0.6, 0.9); f.line([a, b], 7, '#141518'); const h = add(S.at(-0.6, 0.8), [0, 0]); f.part([add(h, [-40, -10]), add(h, [20, -24]), add(h, [40, -14]), add(h, [16, 6]), add(h, [-30, 14])], { fill: '#c4beb0', shadow: PAL.boneS, shade: 0.35, inkW: 1.2, cast: false, hatch: false }); f.part(ell(add(h, [40, -14]), 9, 7, 0, 8), { fill: PAL.wood, shade: 0.3, inkW: 1, cast: false }); for (let i = 1; i < 4; i++) f.line([add(h, [-40 + i * 18, -14 + i * -1]), add(h, [-36 + i * 18, 12 - i * 2])], 1, '#7a7468', { op: 0.6 }); }, // the powder horn
    },
  });
  // gunner 4 (upper middle port): the sponge on its staff, held across the port
  gunner(4, UT[1], gU[1], {
    hands: (J, S0) => { const WN = add(J.N, [60, 130]), WF = add(J.N, [140, 80]); const [EN] = ik(J.SN, WN, 122, 106, -1), [EF] = ik(J.SF, WF, 122, 106, -1); return { WN, EN, WF, EF }; },
    opts: {
      shirt: 'check', cap: 'none', capCol: '#5a5e64',
      persona: { chestW: 0.86, belly: -0.06, armW: 0.88, hair: 'tufts', neck: '#5a6068', frost: ['nose'], face: { jaw: 1.2, chin: 0.08, nose: 1.16, hook: 0.2, squint: 0.75, browDown: 0.1, gaunt: true, age: true, hairCol: '#9aa2a8', browCol: '#cfd6da', mouth: 'grim' } },
      handN: { grip: { thumbAng: deg(-30), maxBend: 40 } }, handF: { grip: { thumbAng: deg(-30), maxBend: 40 } },
      beforeNear: ({ S }) => { const J4 = f.joints; const a = add(S.at(0, 0), [-120, 280]), b = add(a, rot([480, 0], deg(-30))); f.part(limb(a, b, 13, 13, { steps: 6 }), { fill: PAL.woodL, shadow: '#1c1c1c', tex: 'wood720', shade: 0.35, inkW: 1.2, cast: false }); f.part(ell(b, 30, 22, deg(-30), 12), { fill: '#6a6a64', shadow: '#2a2a28', tex: 'mottle720', shade: 0.4, inkW: 1.3, cast: false }); X.rime([add(b, [-20, -20]), add(b, [20, -24])], 8, -1); X.icicles([add(b, [-20, 20]), add(b, [24, 14])], 3, 30, 5); void J4; },
    },
  });
  LT.forEach((p, j) => { drawSill(p); drawLid(p, j, false); });

  // the cathead: a heavy timber jutting from the bow, the anchor hung from it on its frozen cable
  f.bone('anchor');
  const ct0 = hullAt(XS, 1180), ct1 = [Math.max(14, ct0[0] - 190), ct0[1] - 30];
  f.part([add(ct0, [10, -26]), add(ct1, [0, -22]), add(ct1, [-4, 22]), add(ct0, [10, 30])], HL({ fill: '#2e3036', maxShade: 8, inkW: 1.8, sharp: true }));
  f.part([add(ct1, [0, -22]), add(ct1, [-4, 22]), add(ct1, [-22, 18]), add(ct1, [-18, -20])], HL({ fill: '#121316', maxShade: 2, inkW: 1.2, sharp: true }));
  rimeBroken(f, X, [add(ct0, [10, -26]), add(ct1, [0, -22])], 12, -1, { gaps: 0.1 }); X.icicles([add(ct0, [0, 30]), add(ct1, [0, 22])], 5, 70, 7);
  const ar = add(ct1, [22, 22]), sk = add(ar, [0, 60]), ak = add(sk, [-2, 300]);
  rope(f, [ar, add(ar, [6, 30]), sk], 10, PAL.rope);
  f.part(limb(add(sk, [-60, 22]), add(sk, [70, 30]), 22, 16, { steps: 6 }), { fill: PAL.wood, shadow: '#141414', tex: 'wood720', light: PAL.woodL, shade: 0.35, inkW: 1.3, cast: false, maxShade: 10 });
  f.part(limb(sk, ak, 26, 22, { steps: 6 }), { fill: PAL.iron, shadow: '#060708', light: '#6a6e76', tex: 'mottle720', texOp: 0.5, shade: 0.35, inkW: 1.4, cast: false, maxShade: 12 });
  for (const sg of [-1, 1]) { const arm0 = add(ak, [0, -6]), tip = add(ak, [sg * 90, -90]); f.part([add(arm0, [-sg * 10, -10]), add(lerp(arm0, tip, 0.5), [sg * 8, 16]), tip, add(tip, [sg * 18, -14]), add(tip, [-sg * 30, -6]), add(lerp(arm0, tip, 0.5), [-sg * 6, -4]), add(arm0, [sg * 10, -16])], { fill: PAL.iron, shadow: '#060708', light: '#6a6e76', shade: 0.35, inkW: 1.3, cast: false }); X.icicles([add(tip, [-sg * 20, 0]), add(lerp(arm0, tip, 0.5), [0, 14])], 2, 50, 6); }
  X.rime([add(sk, [-60, 10]), add(sk, [70, 18])], 9, -1); X.icicles([add(sk, [-56, 30]), add(sk, [64, 40])], 4, 60, 6);
  // ---- (independent review) the rope entry ladder hangs plumb from the rail at the bow, where she turns away; the boarder
  // hangs off it by both hands, his body swung out past the stem into the open air (it breaks the hull's side edge),
  // head turned to the company. The anchor hangs from its cathead beside him; a broken yard lies across the rail above.
  f.bone('ladder');
  const LDt = add(hullAt(XS + 40, VR), [0, 14]), LX = LDt[0], LB = LDt[1] + 880;
  for (const off of [-46, 46]) rope(f, [[LX + off, LDt[1]], [LX + off + 4, (LDt[1] + LB) / 2], [LX + off, LB]], 6, PAL.rope);
  for (let y = LDt[1] + 70; y < LB; y += 74) { f.part([[LX - 56, y - 8], [LX + 56, y - 10], [LX + 56, y + 8], [LX - 56, y + 10]], { fill: PAL.woodL, shade: 0.35, inkW: 1.2, cast: false, tex: 'wood720' }); X.rime([[LX - 56, y - 10], [LX + 56, y - 12]], 6, -1); X.icicles([[LX - 50, y + 10], [LX + 50, y + 8]], 2, 30, 4); }
  X.icicles([[LX - 46, LB], [LX + 46, LB]], 3, 50, 6);
  {
    const WF = [LX + 6, LDt[1] + 70 + 74 * 2], WN = [LX - 46, LDt[1] + 70 + 74 * 4 - 36];
    const N = [LX - 175, LDt[1] + 330], P = [LX - 245, LDt[1] + 530], C = add(lerp(N, P, 0.5), [-22, 0]);
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12), HN: S0.at(-0.28, 1.0), HF: S0.at(0.32, 1.0), WN, WF, AN: [LX - 30, LDt[1] + 70 + 74 * 8 + 4], AF: [LX - 360, LDt[1] + 750] };
    [J.EN] = ik(J.SN, WN, 122, 106, 1); [J.EF] = ik(J.SF, WF, 122, 106, 1); [J.KN] = ik(J.HN, J.AN, 164, 162, -1); [J.KF] = ik(J.HF, J.AF, 164, 162, -1);
    sailor(f, X, { s: 1, pre: 'b_', parent: 'ladder', J, hA: 0.42, name: 'boarder', model: true, shirt: 'stripe', shirtCol: '#a6acb0', sleeve: 'full', belly: 0.2, mouth: 'open',
      jacket: { col: '#2a2e36', colD: '#16181d', colL: '#4e5562', patch: [-0.5, 0.5] }, trouser: { col: '#8e9496', len: 'cut' }, cap: 'knit', capCol: '#3e4248',
      footFree: { f: true }, footAng: { f: deg(110) }, footDir: { n: 1 },
      persona: { hair: 'long', frost: ['mask', 'mouthIce'], neck: '#4a5260', face: { jaw: 1.1, chin: 0.0, nose: 0.96, hook: 0.05, squint: 0.2, browDown: -0.02, hairCol: '#1e2024', age: false, beard: 'stubble', beardCol: '#2a2c32' } },
      handN: { grip: { thumbAng: deg(-90), maxBend: 40 } }, handF: { grip: { thumbAng: 0, maxBend: 40 } },
      afterTorso: ({ S }) => { const a = S.at(-0.2, 0.88), hd = S.at(0.3, 1.25); f.part(limb(a, hd, 9, 9, { steps: 4 }), { fill: PAL.woodL, shade: 0.35, inkW: 1.1, cast: false, tex: 'wood720' }); const ax = frame(hd, angOf(a, hd) + Math.PI / 2, 1); f.part(ax([[-8, -12], [40, -22], [46, 4], [-8, 12]]), { fill: PAL.iron, shadow: '#0c0d10', light: '#7a8088', shade: 0.35, inkW: 1.2, cast: false }); X.icicle(ax([[40, 6]])[0], 18, 4); },
    });
  }
  // the broken yard laid across the rail, its splintered end out over the bow, slack rigging hanging plumb from it
  f.bone('spar');
  const sp0 = hullAt(420, VR + 20), sp1 = add(sp0, rot([470, 0], deg(-164)));
  f.part(limb(sp0, sp1, 36, 26, { steps: 8 }), { fill: '#26282c', shadow: '#060708', light: '#5a5e66', tex: 'wood720', shade: 0.32, inkW: 1.8, maxShade: 16 });
  f.part([lp(sp0, sp1, 0.98, -13), add(sp1, rot([30, -6], deg(-164))), lp(sp0, sp1, 1.0, -2), add(sp1, rot([44, 4], deg(-164))), lp(sp0, sp1, 1.0, 8), add(sp1, rot([20, 14], deg(-164))), lp(sp0, sp1, 0.97, 13)], { fill: '#8a847a', shadow: '#2a2826', shade: 0.35, inkW: 1.2, cast: false });
  for (const t of [0.3, 0.62]) f.part([lp(sp0, sp1, t, -20), lp(sp0, sp1, t + 0.04, -19), lp(sp0, sp1, t + 0.04, 19), lp(sp0, sp1, t, 20)], { fill: PAL.iron, shade: 0.3, inkW: 1.1, cast: false });
  rimeBroken(f, X, [lp(sp0, sp1, 0, -17), lp(sp0, sp1, 0.5, -15), lp(sp0, sp1, 0.95, -12)], 12, 1, { gaps: 0.1 });
  for (const [t, l] of [[0.45, 220], [0.7, 150], [0.88, 300]]) { const q = lp(sp0, sp1, t, 14); rope(f, [q, add(q, [6, l * 0.5]), add(q, [-4, l])], 4, PAL.rig); X.icicle(add(q, [-4, l]), 24, 5); }
  X.icicles([lp(sp0, sp1, 0.05, 16), lp(sp0, sp1, 0.9, 12)], 8, 60, 6);
  f.bone('hull');

  // ---- the ice the hull sits in: heaped pressure slabs along the foot of the hull, the sea-ice in front
  f.bone('hull');
  f.part([[0, GY - 10], [1800, GY - 10], [1800, Hc], [0, Hc]], X.IC({ fill: '#c4d0d8', shade: 0.2, inkW: 1.2 }));
  for (const [x, w, h, a] of [[40, 260, 150, -0.3], [250, 140, 80, 0.25], [420, 300, 120, -0.05], [600, 120, 60, 0.4], [760, 220, 170, -0.22], [990, 340, 90, 0.08], [1180, 150, 140, -0.35], [1360, 260, 110, 0.18], [1560, 180, 70, -0.1], [1730, 280, 160, 0.3]]) {
    const F2 = frame([x, GY - 4], a, 1); X.slab2(F2([[-w / 2, 0], [-w * 0.4, -h], [w * 0.2, -h * 1.1], [w / 2, -h * 0.2]]), [16, -12], { step: 40, snow: 10, bubbles: 8, layers: 2, cracks: 2 });
  }
  return f;
}
let this_rammer = null;

// ------------------------------------------------------------------ THE SHROUDS (Ruler 4.5, hanging)
// The topmen of the fleet's tallest mainmast and the standing rigging they climbed. The black mainmast rises from the ice
// at the frame's edge (drawing left; game right) and out of the top; from the unseen masthead a broad fan of shrouds and
// ratlines slants down to a broken channel in the ice (drawing right; game left, toward the company), a net three ranks
// wide hung with frozen men: one reaching for the next ratline, one hanging by an arm, one folded over the lower yard and
// one laid along it, one upside down with a foot caught, the lowest trailing their feet over the ice, legs dangling in
// from above the frame. Frost: the ropes frozen stiff as iron bar and furred white on their windward side, icicles hung
// from every ratline like the teeth of a comb; rime bonds hands and knees to the lines. Water: the men drowned first,
// swollen, wrinkled and white under a glaze, bellies distended. Their faces turn down toward the company, mouths open.
// Canvas widened to 2000 x 1800 at true scale (a topman is 640 px). Weight hangs from above: the root is the web.
// Rig: web (root) > mast, yard, sail; each topman mN_ (pelvis parented to the web); m7 (the attacker) with his
// marlinspike (m7_hand_n) and lanyard; bucket, chair, spyglass. Motion: the web creaks and sways while icicles drop;
// attack: a topman lets go and drops marlinspike first, then the web hauls him back up on his lanyard.
function theShrouds() {
  const Wc = 2000, Hc = 1800, GY = Hc - 30;
  const f = new Fig(foeBase(721, Object.assign({}, WORLD, { groundY: GY, grimeY: GY - 120 })));
  const X = fx(f, 1.6);
  const tarJ = '#262a32', tarJL = '#4a505c';
  const MH = [280, -1700], NS = 9, ends = []; for (let k = 0; k < NS; k++) ends.push([660 + k * 165, GY - 70]);
  const shX = (k, y) => MH[0] + (ends[k][0] - MH[0]) * (y - MH[1]) / (ends[k][1] - MH[1]);
  const RY = []; for (let r = 0; r < 10; r++) RY.push(300 + r * 142);
  const ratPts = r => { const y = RY[r], pts = []; for (let k = 0; k < NS; k++) { pts.push([shX(k, y), y]); if (k < NS - 1) pts.push([(shX(k, y) + shX(k + 1, y)) / 2, y + 9]); } return pts; };
  const ratAt = (r, x) => { const P = ratPts(r); for (let i = 0; i < P.length - 1; i++) if (x >= P[i][0] && x <= P[i + 1][0]) { const t = (x - P[i][0]) / (P[i + 1][0] - P[i][0]); return [x, P[i][1] + (P[i + 1][1] - P[i][1]) * t]; } return [x, RY[r]]; };
  const YD = 196; // the lower yard's centre line
  f.joint('web', [1200, 300]).joint('mast', [220, GY], 'web').joint('yard', [300, YD], 'web').joint('bucket', [1560, RY[5]], 'web').joint('chair', [1880, YD + 30], 'yard').joint('spyglass', [900, RY[3]], 'web');
  const ropeIce = (pts, w, col = PAL.rig, nIce = 0, iceL = 30) => { const C = rope(f, pts, w, col, { lit: false }); X.rime(spline(pts, w * 2).filter((_, i, a) => i % 2 === 0 || i === a.length - 1), Math.max(4, w * 0.6), -1, { look: { fill: '#e4ebef' } }); if (nIce) X.icicles(pts.map(q => add(q, [0, w * 0.5])), nIce, iceL, Math.max(3, w * 0.45)); return C; };

  // ---- the mainmast: black tarred, iron hoops and rope wooldings, rimed on the windward side, rising out of the frame
  f.bone('mast');
  const mast = [[130, -20], [330, -20], [338, GY + 10], [122, GY + 10]];
  f.part(mast, { fill: '#1c1d22', shadow: '#050506', light: '#4a4e58', tex: 'wood721', texOp: 0.5, shade: 0.3, maxShade: 60, inkW: 2 });
  clipDraw(f, mast, () => {
    f.flat([[120, -20], [200, -20], [200, GY + 20], [120, GY + 20]], '#000', { op: 0.4 });
    f.stroke([[290, -20], [292, 900], [296, GY]], 26, '#5a5e68', { op: 0.35 });
    for (let y = 120; y < GY; y += 260) { f.part([[124, y], [336, y - 6], [336, y + 26], [124, y + 30]], { fill: PAL.iron, shadow: '#0c0d10', shade: 0.3, inkW: 1.4, cast: false }); for (let i = 0; i < 4; i++) f.rivet([150 + i * 56, y + 12], 4, PAL.iron); }
    for (let y = 250; y < GY; y += 520) { f.part([[124, y], [336, y - 6], [336, y + 110], [124, y + 116]], { fill: PAL.ropeD, shadow: '#1c2024', tex: 'mottle721', shade: 0.35, inkW: 1.4, cast: false }); for (let i = 0; i < 12; i++) f.line([[124, y + 6 + i * 9], [336, y + i * 9]], 1.2, '#1c2024', { op: 0.7 }); }
    for (let i = 0; i < 9; i++) { const y = 80 + f.r() * (GY - 160); f.line([[200 + f.r() * 100, y], [210 + f.r() * 100, y + 160]], 1.2, '#000', { op: 0.6 }); }
  });
  rimeBroken(f, X, [[332, 0], [334, 600], [336, 1200], [338, GY - 60]], 22, 1, { gaps: 0.15 });
  X.icicles([[200, 380], [300, 376]], 4, 90, 9); X.icicles([[200, 900], [300, 896]], 4, 70, 8);

  // ---- the shrouds, far side first (they all lie behind the men): stiff, furred white on the windward top side
  f.bone('web');
  for (let k = 0; k < NS; k++) ropeIce([[shX(k, -40), -40], [shX(k, 700), 700], ends[k]], 15, PAL.rigD);
  // the ratlines across them, sagging a little between shrouds, icicles hanging off them like the teeth of a comb
  for (let r = 0; r < RY.length; r++) { const P = ratPts(r); rope(f, P, 7, PAL.rig, { lit: false }); X.rime(P, 6, -1, { look: { fill: '#e4ebef' } }); for (let i = 0; i < P.length - 1; i++) X.icicles([P[i], P[i + 1]].map(q => add(q, [0, 4])), 5, 34, 4); }
  // the channel at the foot of the shrouds: a broken length of the ship's side in the ice, deadeyes and lanyards
  const chn = [[560, GY - 60], [2010, GY - 60], [2010, GY - 20], [560, GY - 14]];
  f.part(chn, { fill: '#26282e', shadow: '#060708', light: '#5a5e66', tex: 'wood721', shade: 0.3, inkW: 1.6, maxShade: 20 });
  for (let k = 0; k < NS; k++) { const e = ends[k], d1 = add(e, [-8, -40]), d2 = add(e, [0, 30]); f.part(ell(d1, 18, 22, 0, 12), { fill: PAL.wood, shade: 0.35, inkW: 1.2, cast: false, tex: 'wood721' }); f.part(ell(d2, 18, 22, 0, 12), { fill: PAL.wood, shade: 0.35, inkW: 1.2, cast: false, tex: 'wood721' }); for (const dx of [-7, 0, 7]) f.line([add(d1, [dx, 14]), add(d2, [dx, -14])], 2.4, PAL.rope); X.icicle(add(d2, [0, 20]), 20, 5); }
  rimeBroken(f, X, [[560, GY - 60], [1200, GY - 62], [2010, GY - 60]], 14, -1);
  f.part([[0, GY - 6], [2000, GY - 6], [2000, Hc], [0, Hc]], X.IC({ fill: '#c4d0d8', shade: 0.2, inkW: 1.2 }));
  for (const [x, w, h, a] of [[420, 200, 110, -0.2], [700, 140, 70, 0.3], [1460, 160, 90, -0.25], [1900, 220, 120, 0.2]]) { const F2 = frame([x, GY - 2], a, 1); X.slab2(F2([[-w / 2, 0], [-w * 0.4, -h], [w * 0.2, -h * 1.1], [w / 2, -h * 0.2]]), [14, -10], { step: 40, snow: 8, bubbles: 6, layers: 2, cracks: 1 }); }

  // ---- details in the web: a canvas tar bucket hung from a ratline with its spill frozen down the ropes below; a lookout's
  // spyglass jammed in the rigging; a parted line hanging loose, frozen into a curl; a knitted cap snagged on a ratline;
  // wooden blocks frozen mid-run
  f.bone('bucket');
  const bk = ratAt(5, 1560); rope(f, [bk, add(bk, [4, 50])], 3, PAL.rope);
  const bq = add(bk, [4, 90]); f.part([add(bq, [-30, -40]), add(bq, [30, -40]), add(bq, [24, 34]), add(bq, [-24, 34])], { fill: '#5a5e62', shadow: '#1c2024', tex: 'weave721', texOp: 0.5, shade: 0.35, inkW: 1.4, cast: false });
  f.stroke([add(bq, [20, 34]), add(bq, [26, 140]), add(bq, [20, 300]), add(bq, [30, 420])], 12, '#111214'); f.stroke([add(bq, [-10, 34]), add(bq, [-14, 120]), add(bq, [-6, 220])], 8, '#111214'); // the tar spill, frozen in runs down the ropes
  X.rime([add(bq, [-30, -40]), add(bq, [30, -40])], 6, -1);
  f.bone('spyglass');
  const sg0 = ratAt(3, 900), sg1 = add(sg0, rot([170, 0], deg(-28)));
  f.part(limb(sg0, sg1, 22, 16, { steps: 6 }), { fill: '#3a3c40', shadow: '#0c0d10', light: '#7a8088', shade: 0.35, inkW: 1.3, cast: false });
  for (const t of [0.3, 0.6]) f.line([lp(sg0, sg1, t, -11), lp(sg0, sg1, t, 11)], 3, PAL.pewter);
  f.part(ell(sg1, 6, 9, deg(-28), 10), X.IC({ fill: '#dfe7ec', inkW: 1 })); X.icicle(lp(sg0, sg1, 0.5, 10), 20, 5);
  f.bone('web');
  const cp = ratAt(7, 820); f.part([add(cp, [-26, 0]), add(cp, [-20, -30]), add(cp, [10, -38]), add(cp, [28, -10]), add(cp, [24, 30]), add(cp, [-22, 30])], { fill: PAL.wool, shadow: '#2a2e36', tex: X.hoar, texOp: 0.4, shade: 0.35, inkW: 1.3, cast: false }); X.rime([add(cp, [-20, -30]), add(cp, [10, -38]), add(cp, [28, -10])], 6, -1); // knitted cap snagged on a ratline
  const pl = ratAt(1, 1180); rope(f, [pl, add(pl, [10, 80]), add(pl, [40, 150]), add(pl, [70, 140]), add(pl, [66, 100]), add(pl, [40, 110])], 6, PAL.rope); // a parted line frozen in a curl
  for (const [x, r] of [[1010, 2], [1640, 6]]) { const q = ratAt(r, x); f.part([add(q, [-18, -10]), add(q, [18, -10]), add(q, [20, 40]), add(q, [-20, 40])], { fill: PAL.wood, shade: 0.35, inkW: 1.3, cast: false, tex: 'wood721' }); f.flat(ell(add(q, [0, 14]), 9, 9, 0, 8), '#0c0d10'); rope(f, [add(q, [-6, 40]), add(q, [-30, 160])], 4, PAL.rope); rope(f, [add(q, [6, 40]), add(q, [20, 120])], 4, PAL.rope); } // blocks frozen mid-run

  // ---- topmen. Each is a drowned sailor in a tarred jacket, checked shirt and canvas trousers cut off at the shin,
  // bare feet black with frost; hands and knees bonded to the lines with rime; faces turned down toward the company.
  // (independent review) seven different men, not one man seven times: each has his own age, build, face, dress and the
  // way the frost took him
  const TP = {
    1: { hair: 'long', chestW: 0.92, frost: ['mask'], jacket: { col: '#30343c', colL: '#525a66', open: false, patch: [-0.5, 0.6] }, face: { jaw: 1.02, chin: -0.01, nose: 0.92, hook: 0, age: false, gaunt: true, hairCol: '#2a2c30' } },
    2: { chestW: 1.04, belly: 0.06, earring: true, frost: ['brows', 'beard'], neck: '#4a5260', face: { jaw: 1.3, chin: 0.04, nose: 1.1, hook: 0.3, squint: 0.55, browDown: 0.06, beard: 'short', beardCol: '#24262a', age: true } },
    3: { hair: 'crop', chestW: 0.96, frost: ['nose'], shirt: 'stripe', jacket: { col: '#1e2026', colL: '#3e444e', missing: 2 }, face: { jaw: 1.16, chin: 0.02, nose: 1.04, hook: 0.1, beard: 'stubble', beardCol: '#2a2c30', age: false, hairCol: '#18191c' } },
    4: { chestW: 1.2, belly: 0.16, armW: 1.12, thighW: 1.1, frost: ['beard', 'brows'], jacket: { col: '#3a404a', colL: '#5e6672', patch: [0.1, 0.3] }, face: { jaw: 1.46, chin: 0.06, nose: 1.18, hook: 0.42, squint: 0.5, browDown: 0.06, browW: 0.06, moustache: true, beard: 'stubble', age: true, hairCol: '#2a2c30' } },
    5: { hair: 'swept', chestW: 0.86, armW: 0.9, headS: 0.97, frost: ['breath'], jacket: null, neck: '#3e4652', face: { jaw: 0.98, chin: -0.02, nose: 0.86, hook: 0, squint: 0.05, browDown: -0.04, age: false, hairCol: '#2e3036' } },
    6: { chestW: 0.9, belly: -0.05, frost: ['mask', 'brows'], capCol: '#6a6e74', jacket: { col: '#2a2e36', colL: '#4e5662', open: false }, face: { jaw: 1.22, chin: 0.08, nose: 1.2, hook: 0.22, squint: 0.8, browDown: 0.1, gaunt: true, moustache: true, beard: 'stubble', beardCol: '#a8b0b4', hairCol: '#a8b0b4', browCol: '#d4dce0', age: true } },
    7: { chestW: 1.02, earring: true, frost: ['mouthIce'], jacket: { col: '#262a32', colL: '#4a505c', patch: [-0.55, 0.35] }, face: { jaw: 1.26, chin: 0.03, nose: 1.14, hook: 0.5, squint: 0.65, browDown: 0.09, scar: [[0.2, -0.24], [0.12, -0.06], [0.06, 0.1]], beard: 'stubble', beardCol: '#1e2024', age: true } },
  };
  const topman = (i, J, opts) => sailor(f, X, Object.assign({ persona: TP[i],
    s: 1, pre: `m${i}_`, parent: 'web', J, hA: 0.5, name: `topman ${i}`, model: true, shirt: 'check', shirtCol: '#a8aeb2', sleeve: 'full', belly: 0.34, mouth: 'open',
    jacket: { col: tarJ, colD: '#16181d', colL: tarJL }, trouser: { col: '#9aa0a2', len: 'cut' }, cap: i % 3 === 0 ? 'knit' : 'none', shoulderRime: false,
    face: { jaw: 1.18, chin: 0.02, nose: 1.0 + (i % 3) * 0.05, hook: 0.1, squint: 0.2, browDown: -0.02, hairCol: '#1a1c20', age: i % 2 === 0, faceShade: 0.72 },
  }, opts));
  // rime welding a hand or knee to the line: a lumpy translucent crust that runs on along the rope both ways, so limb and
  // line join without a seam, the knuckles still showing through it (it was an opaque white ball)
  const bond = (p, r = 22) => {
    const pts = []; for (let k = 0; k < 11; k++) { const a = k / 11 * Math.PI * 2, rr = r * (0.75 + 0.3 * Math.sin(k * 2.3 + p[0])); pts.push(add(p, [Math.cos(a) * rr * 1.5, Math.sin(a) * rr * 0.7])); }
    f.part(pts, X.IC({ fill: '#dbe4ea', opacity: 0.5, inkW: 0.9, inkHeavy: 1.2 }));
    X.rime([add(p, [-r * 1.6, -r * 0.3]), add(p, [0, -r * 0.7]), add(p, [r * 1.6, -r * 0.3])], r * 0.4, -1);
    X.icicles([add(p, [-r, r * 0.5]), add(p, [r, r * 0.5])], 3, r * 1.4, 5);
  };
  const grips = (thumb) => ({ grip: { thumbAng: thumb, maxBend: 40 } });

  // m2: laid along the yard (drawn with the yard, below), m1: folded over it
  // the yard first: a heavy spar across the frame top from the mast, the topsail furled on it in a frozen slab, gaskets
  // tied round it, the footrope swagged below on its stirrups, the empty bosun's chair dangling from it
  const yardDraw = () => {
    f.bone('yard');
    const yd = [[200, YD - 36], [2010, YD - 28], [2010, YD + 28], [200, YD + 36]];
    f.part(yd, { fill: '#26282c', shadow: '#060708', light: '#5a5e66', tex: 'wood721', shade: 0.32, inkW: 1.8, maxShade: 30 });
    f.stroke([[200, YD - 20], [2010, YD - 16]], 8, '#6a6e76', { op: 0.4 });
    for (let x = 320; x < 2000; x += 300) f.part([[x, YD - 38], [x + 22, YD - 38], [x + 22, YD + 38], [x, YD + 38]], { fill: PAL.iron, shade: 0.3, inkW: 1.1, cast: false });
    const sl = [[300, YD - 30], [500, YD - 96], [700, YD - 120], [900, YD - 104], [1060, YD - 70], [1100, YD - 30]];
    f.part([...sl, [1100, YD - 26], [300, YD - 26]], { fill: '#a6acae', shadow: '#3c444e', light: '#d8dde0', tex: 'weave721', texOp: 0.5, shade: 0.35, maxShade: 40, inkW: 1.8 });
    clipDraw(f, [...sl, [1100, YD - 26], [300, YD - 26]], () => { for (let i = 0; i < 7; i++) f.stroke([[330 + i * 110, YD - 30], [360 + i * 110, YD - 70], [390 + i * 110, YD - 110]], 6, '#3c444e', { op: 0.5 }); f.flat([[300, YD - 60], [1100, YD - 50], [1100, YD - 20], [300, YD - 20]], '#2a3038', { op: 0.3 }); });
    for (const x of [420, 640, 860, 1040]) { f.line([[x, YD - 26], [x + 10, YD - 116 + Math.abs(x - 700) / 6]], 8, INK); f.line([[x, YD - 26], [x + 10, YD - 116 + Math.abs(x - 700) / 6]], 5, PAL.rope); } // gaskets
    rimeBroken(f, X, sl, 18, -1, { gaps: 0.1 }); rimeBroken(f, X, [[1100, YD - 34], [1500, YD - 32], [2010, YD - 28]], 14, -1);
    X.icicles([[200, YD + 36], [2010, YD + 28]], 30, 70, 8);
    const fr = []; for (let x = 260; x <= 2010; x += 250) { fr.push([x, YD + 150]); if (x + 125 < 2010) fr.push([x + 125, YD + 180]); }
    for (let x = 260; x <= 2010; x += 250) rope(f, [[x, YD + 36], [x, YD + 150]], 4, PAL.rope); // stirrups
    ropeIce(fr, 6, PAL.rope, 14, 30); // the footrope
    // the empty bosun's chair dangling on its line
    f.bone('chair');
    const ch0 = [1880, YD + 30], ch1 = [1876, YD + 420]; rope(f, [ch0, ch1], 4, PAL.rope); for (const dx of [-40, 40]) rope(f, [ch1, add(ch1, [dx, 70])], 3, PAL.rope);
    f.part([add(ch1, [-50, 66]), add(ch1, [50, 66]), add(ch1, [50, 84]), add(ch1, [-50, 84])], { fill: PAL.woodL, shade: 0.35, inkW: 1.3, cast: false, sharp: true, tex: 'wood721' });
    X.rime([add(ch1, [-50, 66]), add(ch1, [50, 66])], 8, -1); X.icicles([add(ch1, [-46, 84]), add(ch1, [46, 84])], 4, 40, 6);
  };

  // m1 folded over the yard: legs down the far side, the body hanging head-down on the near side, arms dangling
  {
    const P = [740, YD - 40], N = [800, YD + 170], C = [790, YD + 60];
    const S0 = B.spine(N, C, P, 100), sat = (u, v) => S0.at(-u, v);
    const J = { P, C, N, SN: sat(-0.3, 0.14), SF: sat(0.38, 0.12), HN: sat(-0.3, 1.0), HF: sat(0.34, 1.0), KN: [700, YD + 140], AN: [660, YD + 300], KF: [690, YD + 150], AF: [690, YD + 310] };
    J.EN = add(J.SN, [10, 120]); J.WN = add(J.EN, [6, 110]); J.EF = add(J.SF, [20, 116]); J.WF = add(J.EF, [10, 100]);
    topman(1, J, { mirror: true, inverted: true, hA: Math.PI - 0.3, footFree: { n: true, f: true }, footAng: { n: deg(96), f: deg(80) }, handN: { open: { ang: deg(96), back: true, curl: 0.5, spread: 0.1 } }, handF: { open: { ang: deg(80), back: true, curl: 0.4, spread: 0.12, flip: true } }, beforeTorso: yardDraw, hemIce: false, chinIce: false });
  }
  // m2 laid along the yard on his belly, feet on the footrope, head toward the heroes, looking down
  {
    const P = [1220, YD - 70], N = [1430, YD - 84], C = [1330, YD - 110];
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12), HN: S0.at(-0.3, 1.0), HF: S0.at(0.34, 1.0), KN: [1080, YD + 10], AN: [1060, YD + 140], KF: [1100, YD + 20], AF: [1110, YD + 140] };
    J.WN = [1500, YD - 26]; [J.EN] = ik(J.SN, J.WN, 122, 106, -1); J.WF = [1440, YD + 160]; [J.EF] = ik(J.SF, J.WF, 122, 106, -1);
    topman(2, J, { hA: 1.0, footFree: { n: true, f: true }, footAng: { n: deg(-10), f: deg(-14) }, handN: grips(0), handF: { open: { ang: deg(90), back: true, curl: 0.4, spread: 0.12 } }, queue: true });
    bond(J.WN, 18);
  }
  // m4 hanging by one arm from a ratline, the body dangling plumb, the other arm hanging, feet hanging
  {
    const r = 2, WN = ratAt(r, 1080), SN = add(WN, [-20, 220]);
    const N = add(SN, [30, 12]), P = add(N, [-8, 204]), C = add(lerp(N, P, 0.5), [-16, 0]);
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12), HN: S0.at(-0.26, 1.0), HF: S0.at(0.32, 1.0), WN };
    J.EN = lerp(J.SN, WN, 0.5); J.EN = add(J.EN, [-6, 0]); J.AN = add(J.HN, [-10, 320]); J.AF = add(J.HF, [40, 300]); [J.KN] = ik(J.HN, J.AN, 164, 162, -1); [J.KF] = ik(J.HF, J.AF, 164, 162, -1);
    J.WF = add(J.SF, [40, 210]); [J.EF] = ik(J.SF, J.WF, 122, 106, 1);
    topman(4, J, { hA: 0.6, footFree: { n: true, f: true }, footAng: { n: deg(80), f: deg(70) }, handN: grips(Math.PI), handF: { open: { ang: deg(76), back: true, curl: 0.5, spread: 0.1, flip: true } }, cap: 'knit' });
    bond(WN, 20);
  }
  // m5 reaching for the next ratline: feet on a ratline, a knee bonded to the one above, the near arm stretched up
  {
    const rF = 8, AN = ratAt(rF, 690), AF = ratAt(rF, 760);
    const P = [720, AN[1] - 300], N = [760, P[1] - 206], C = [726, P[1] - 100];
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12), HN: S0.at(-0.3, 1.0), HF: S0.at(0.34, 1.0), AN: add(AN, [0, -20]), AF: add(AF, [0, -20]) };
    [J.KN] = ik(J.HN, J.AN, 164, 162, -1); [J.KF] = ik(J.HF, J.AF, 164, 162, -1);
    const rU = rF - 4; J.WF = ratAt(rF - 5, 780); [J.EF] = ik(J.SF, J.WF, 122, 106, 1); J.WN = [shX(2, 1000), 1000]; [J.EN] = ik(J.SN, J.WN, 122, 106, 1); void rU; // the near hand round a shroud, the forearm square across it // (review) the far arm reaches up behind the head; the near hand holds lower, clear of the face
    topman(5, J, { hA: 0.4, footFree: { n: true, f: true }, footAng: { n: deg(20), f: deg(16) }, handN: grips(angOf([shX(2, 1000), 1000], [shX(2, 0), 0])), handF: grips(0), shirt: 'stripe', queue: true });
    bond(J.WN, 18); bond(J.WF, 16); bond(J.KF, 22);
  }
  // m7, the attacker: hanging by the far hand, the marlinspike in the near fist, its lanyard from his wrist to a ratline
  {
    const rH = 5, WF = ratAt(rH, 1300), SF = add(WF, [-10, 216]);
    const N = add(SF, [-30, 14]), P = add(N, [-4, 206]), C = add(lerp(N, P, 0.5), [-14, 0]);
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12), HN: S0.at(-0.26, 1.0), HF: S0.at(0.32, 1.0), WF };
    J.EF = add(lerp(J.SF, WF, 0.5), [8, 0]); J.WN = add(J.SN, [90, 190]); [J.EN] = ik(J.SN, J.WN, 122, 106, 1);
    J.AN = add(J.HN, [-40, 310]); J.AF = add(J.HF, [30, 316]); [J.KN] = ik(J.HN, J.AN, 164, 162, -1); [J.KF] = ik(J.HF, J.AF, 164, 162, -1);
    const spA = deg(96); f.joint('marlinspike', J.WN, 'm7_hand_n');
    topman(7, J, { hA: 0.66, footFree: { n: true, f: true }, footAng: { n: deg(86), f: deg(74) }, handF: grips(Math.PI), handN: grips(spA + Math.PI), shirt: 'stripe', cap: 'knit', capCol: '#4e5258',
      beforeNear: () => { f.bone('marlinspike'); const F2 = frame(J.WN, spA, 1); f.part(F2([[-34, -9], [8, -10], [8, 10], [-34, 9]]), { fill: PAL.woodL, shade: 0.35, inkW: 1.2, cast: false, tex: 'wood721' }); f.part(F2([[8, -10], [150, -2], [176, 0, 1], [150, 2], [8, 10]]), { fill: PAL.steel, shadow: '#3e464e', light: PAL.steelL, shade: 0.3, inkW: 1.3, cast: false, hatch: false }); X.icicle(F2([[120, 4]])[0], 18, 4); rope(f, [F2([[-34, 0]])[0], add(J.WN, [-40, -80]), add(J.WN, [-20, -200]), ratAt(rH + 1, 1180)], 3, PAL.rope); } });
    bond(WF, 20);
    // a sheath knife on its cord at his belt
    f.bone('m7_pelvis'); const kq = add(P, [30, 30]); f.line([add(P, [10, 0]), kq], 2, '#1c1d20'); f.part([add(kq, [-8, 0]), add(kq, [8, 0]), add(kq, [6, 70]), add(kq, [0, 86]), add(kq, [-6, 70])], { fill: '#2a2624', shade: 0.35, inkW: 1.2, cast: false }); f.part([add(kq, [-6, -26]), add(kq, [6, -26]), add(kq, [6, 0]), add(kq, [-6, 0])], { fill: PAL.woodL, shade: 0.3, inkW: 1, cast: false });
  }
  // m3 upside down, a foot caught in the ratlines, hanging head-down toward the company, arms hanging
  {
    const rr = 1, AF = ratAt(rr, 1600);
    const P = [1590, AF[1] + 300], N = [1610, P[1] + 206], C = [1620, P[1] + 100];
    const S0 = B.spine(N, C, P, 100), sat = (u, v) => S0.at(-u, v);
    const J = { P, C, N, SN: sat(-0.3, 0.14), SF: sat(0.38, 0.12), HN: sat(-0.3, 1.0), HF: sat(0.34, 1.0), AF, AN: add(P, [-130, -200]) };
    [J.KF] = ik(J.HF, J.AF, 164, 162, 1); [J.KN] = ik(J.HN, J.AN, 164, 162, -1);
    J.WN = add(J.SN, [-40, 220]); [J.EN] = ik(J.SN, J.WN, 122, 106, -1); J.WF = add(J.SF, [30, 220]); [J.EF] = ik(J.SF, J.WF, 122, 106, 1);
    topman(3, J, { mirror: true, inverted: true, hA: Math.PI - 0.5, footFree: { n: true, f: true }, footAng: { n: deg(-120), f: deg(-60) }, handN: { open: { ang: deg(96), back: true, curl: 0.3, spread: 0.14 } }, handF: { open: { ang: deg(84), back: true, curl: 0.3, spread: 0.14, flip: true } }, hemIce: false, chinIce: false, queue: false });
    bond(AF, 24);
    f.bone('m3_foot_f'); const rp = ratPts(rr); rope(f, [add(AF, [-60, 0]), add(AF, [60, 6])], 7, PAL.rig); // the ratline over his caught foot
    // a pigtail queue of tarred hair, stiff as a stick, jutting down from the hanging head
    f.bone('m3_head'); const qh = add(N, [10, 150]); f.stroke([add(qh, [-6, -30]), add(qh, [-4, 40]), add(qh, [-2, 90])], 12, '#121316'); f.line([add(qh, [-10, 10]), add(qh, [4, 12])], 3, PAL.rope); X.icicle(add(qh, [-2, 88]), 20, 4); void rp;
  }
  // m6, the lowest: hanging from a low ratline by both hands, legs trailing across the ice toward the company
  {
    const rH = 8, WN = ratAt(rH, 1720), WF = ratAt(rH, 1800);
    const N = add(lerp(WN, WF, 0.5), [-30, 236]), P = add(N, [-40, 198]), C = add(lerp(N, P, 0.5), [-16, -6]);
    const S0 = B.spine(N, C, P, 100);
    const J = { P, C, N, SN: S0.at(-0.3, 0.14), SF: S0.at(0.38, 0.12), HN: S0.at(-0.26, 1.0), HF: S0.at(0.32, 1.0), WN, WF, AN: [P[0] + 200, GY - 30], AF: [P[0] + 260, GY - 36] };
    J.EN = add(lerp(J.SN, WN, 0.5), [-8, 0]); J.EF = add(lerp(J.SF, WF, 0.5), [8, 0]);
    [J.KN] = ik(J.HN, J.AN, 164, 162, -1); [J.KF] = ik(J.HF, J.AF, 164, 162, -1);
    topman(6, J, { hA: 0.4, footFree: { n: true, f: true }, footAng: { n: deg(-4), f: deg(4) }, handN: grips(0), handF: grips(0), cap: 'knit' });
    bond(WN, 18); bond(WF, 18);
  }
  // legs of more men dangling in from above the frame (the web runs on up out of sight, a dozen men in it)
  f.bone('web');
  for (const [x, y] of [[1120, -40], [1260, -60], [1700, -20], [1790, -50]]) { const look = { fill: mix(SKIN.skin, '#6a6e80', 0.2), shadow: SKIN.skinS, tex: 'mottle721', texOp: 0.5 }; f.part(jointLimb([x, y - 100], [x + 6, y + 40], [x + 4, y + 120], [60, 48, 40], { point: 0.3 }), { fill: '#9aa0a2', shadow: '#3c444e', tex: X.hoar, texOp: 0.4, maxShade: 20 }); X8.mShin(f, [x + 4, y + 104], [x + 4, y + 220], deg(84), 42, look); freeFoot(f, [x + 4, y + 220], deg(84), 56, look); X.icicles([[x - 24, y + 120], [x + 30, y + 118]], 3, 26, 5); }
  return f;
}

module.exports = {
  heroes: [
    { key: 'the_shrouds', name: 'The Shrouds', tier: 'ruler', w: 2000, h: 1800, flip: true, build: theShrouds },
    { key: 'the_broadside', name: 'The Broadside', tier: 'ruler', w: 1800, h: 1800, flip: true, build: broadside },
    { key: 'white_bear', name: 'The White Bear', tier: 'elite', w: 2300, h: 1450, flip: true, build: whiteBear },
    { key: 'powder_monkey', name: 'Powder Monkey', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: powderMonkey },
    { key: 'sailmaker', name: 'The Sailmaker', tier: 'human', w: 900, h: TIERS.human[1], flip: true, build: sailmaker },
    { key: 'galley_cook', name: 'The Galley Cook', tier: 'human', w: 700, h: TIERS.human[1], flip: true, build: galleyCook },
    { key: 'fleet_marine', name: 'Fleet Marine', tier: 'human', w: 1000, h: TIERS.human[1], flip: true, build: fleetMarine },
    { key: 'ice_edge_orca', name: 'Ice-Edge Orca', tier: 'large', w: 1800, h: TIERS.large[1], flip: true, build: iceEdgeOrca },
    { key: 'ships_surgeon', name: "The Ship's Surgeon", tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: shipsSurgeon },
    { key: 'sea_lice', name: 'Sea Lice', tier: 'small', w: 800, h: TIERS.small[1], flip: true, build: seaLice },
    { key: 'capstan_gang', name: 'Capstan Gang', tier: 'large', w: 1700, h: TIERS.large[1], flip: true, build: capstanGang },
  ],
};
