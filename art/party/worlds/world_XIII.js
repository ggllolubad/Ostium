// World XIII, The Black Pyre (Fire + Void, Hollow Flame). A cathedral of the inquisition where saints were burned. The
// fire took on void: it gives no light and it does not go out. Fire chars bodies to ash and cinder and splits them;
// void makes the flame black with violet edges and leaves clean round holes where matter has been unmade.
// The cast mirrors the abbey: clergy, penitents and inquisitors; each still reads as the trade or rank it had.
// Palette: black flame with violet edges, ash grey, char; plus ink black, bone and grey. Gold only on the Saint's halo.
// Red only for doom and rubric (and where the bible names it: the Inquisitor's red-black robes, the Penitent's raw back).
// Foes face left: every figure is drawn facing right with kit.foeBase (key light upper right in drawing space) and
// flipped. Built for the rig from the start: joints first, f.bone() before every part, parts drawn whole, overlaps at
// the joints, shoulder armour on the torso. Seeds 1300 + index in the order of the brief.
'use strict';
const K = require('../kit');
const X = require('./kit_XIII');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang, R, tube } = X;

// a bare arm in one outline from shoulder through elbow to wrist, cut at the elbow for the rig
function bareArm(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const [c0, c1] = X.jcut(S0, E0, W0, ws[1] / 2);
  return split(f, () => f.part(X.jointLimb(S0, E0, W0, ws, Object.assign({ point: 0.35, mus0: 0.14, mus1: 0.22 }, o)), Object.assign({ maxShade: ws[1] * 0.3 }, look)), [['upperarm' + sfx, c0], ['forearm' + sfx, c1]]);
}
// a bare leg from hip to toes in one outline (kit fullLeg), cut at the knee and the ankle
function bareLegRig(f, Hp, Kn, A, s, wH, wK, look, sfx, o = {}) {
  const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  const draw = () => X.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o);
  const i0 = f.out.length; const pts = draw(); const body = f.out.splice(i0).join('\n');
  const put = (bone, regs) => { let g = body; for (const r of regs) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; } f.bone(bone); f.raw(g); };
  put('thigh' + sfx, [side(Kn, mul(de, -1), wK / 2)]);
  put('shin' + sfx, [side(Kn, de, wK / 2), side(A, mul(da, -1), 18)]);
  put('foot' + sfx, [side(A, da, 18)]);
  return pts;
}

// ------------------------------------------------------------------ ASH PENITENT (cast, human 1.0)
// A flagellant. Hunched from the upper back, mid-stride toward the party, the chain flagellum raised over the hump with
// its chains falling across his own flayed back (he whips himself between swings). Sackcloth hood with eye holes, a
// kilted sackcloth wrap, a knotted rope girdle, an iron cilice biting the near thigh, a rosary of charred beads in the
// far fist. Fire: the back flayed and charred, the welts split into violet-lipped seams, ash curling off them, hems
// burnt into curled tongues. Void: a clean round hole through the lower back; a round bite from the wrap's hem.
// Rig: standard humanoid + flagellum (parent hand_n) + skirt (pelvis).
// Motion: idle whipping himself; attack a chain lash (near arm brings the flagellum over and down at the party).
function ashPenitent() {
  const [CW, CH] = TIERS.human, seed = 1303;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 98, gy = f.o.groundY;
  const skin = '#9a8e88', skinS = '#3c2c30';
  const SKP = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.55 }, o);
  const SAC = (o = {}) => Object.assign({ fill: P.sack, shadow: '#26231f', light: P.sackL, shade: 0.38, tex: 'weave' + seed, texOp: 0.6 }, o);
  const N = [366, 378], C = [278, 312], Pv = [262, 506];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.14), SF = S.at(0.46, 0.14);
  const EN = [292, 240], WN = [358, 176];                      // near arm raised: elbow up and back, fist over the hump
  const EF = [416, 468], WF = [446, 546];                      // far arm hanging forward, the rosary fist by the knee
  const HN = S.at(0.2, 1.0), KN = [350, 620], AN = [336, 742];  // near leg forward, weight on it
  const HF = S.at(-0.3, 1.0), KF = [226, 630], AF = [178, 744]; // far leg trailing
  const HC = [410, 372], hA = 0.56, neck0 = S.at(0.15, -0.05);
  const fA = ang(EN, WN) - Math.PI / 2, fD = [Math.cos(fA), Math.sin(fA)]; // flagellum handle square to the forearm, chain end on the thumb side
  const hEnd = add(WN, mul(fD, 62)), hButt = add(WN, mul(fD, -26));
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('flagellum', WN, 'hand_n').joint('skirt', S.at(0, 0.86), 'pelvis');

  // ---- far arm, hanging forward behind the body
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.92), 44, 36, SKP({ fill: mix(skin, '#000', 0.12) }), '_f');
  f.bone('upperarm_f'); X.ashCake(f, lerp(SF, EF, 0.5), 10, 20, 3, 0.8);
  f.bone('forearm_f');
  X.ashCake(f, lerp(EF, WF, 0.4), 10, 22, 4, 0.8);
  X.crackNet(f, lp(EF, WF, 0.2, 4), ang(EF, WF), 50, 1.6, { depth: 1 });
  // rosary of charred beads hanging from the far fist (plumb), a small iron cross at the end
  f.bone('hand_f');
  const rb = add(WF, [2, 10]); const beads = []; for (let i = 0; i < 9; i++) beads.push(add(rb, [Math.sin(i * 0.6) * 4, 8 + i * 8.5]));
  f.line(beads, 1.1, '#2a2020');
  beads.forEach((q, i) => f.part(ell(q, 4.2, 4, 0, 8), { fill: i % 3 ? P.charL : P.char, shadow: P.charS, shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }));
  const cr = add(beads[8], [0, 8]);
  f.part([add(cr, [-2, -4]), add(cr, [2, -4]), add(cr, [2, 2]), add(cr, [7, 2]), add(cr, [7, 6]), add(cr, [2, 6]), add(cr, [2, 18]), add(cr, [-2, 18]), add(cr, [-2, 6]), add(cr, [-7, 6]), add(cr, [-7, 2]), add(cr, [-2, 2])].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false });
  const gF = B.grip(f, WF, EF, -Math.PI / 2, 22, mix(skin, '#000', 0.1), { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, quiet: true });
  X.fistDetail(f, gF, 22, skin, { nail: '#5a5050' });

  // ---- far leg, trailing: bare, ash-caked
  bareLegRig(f, HF, KF, AF, 46, 60, 44, SKP({ fill: mix(skin, '#000', 0.14) }), '_f', { swell: 0.1, nail: P.ashD });
  f.bone('shin_f'); X.ashCake(f, lerp(KF, AF, 0.55), 12, 40, 3, 0.9); f.line([lp(KF, AF, 0.2, -10), lp(KF, AF, 0.32, -6)], 2, P.rawD, { op: 0.7 });

  // ---- torso: bare, hunched, the back flayed and charred
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.34, 0.36], [0.04, 0.66, 0.5], [0.16, 0.82, 0.62], [0.34, 0.84, 0.64], [0.52, 0.74, 0.6], [0.7, 0.64, 0.56], [0.88, 0.62, 0.56], [1.04, 0.6, 0.52], [1.14, 0.5, 0.42]]);
  const tD = E.smooth(torso), tbb = E.bbox(torso);
  X.cutHoles(f, [[S.at(-0.38, 0.74), 13]], () => {
    f.part(torso, SKP({ maxShade: 26 }));
    X.clipDraw(f, tD, () => {
      X.softTone(f, tD, [[[S.at(0.6, 0.2), S.at(0.7, 0.6), S.at(0.5, 0.9), S.at(0.3, 0.5)], '#000', 0.25, 10]]); // the belly turning under, in shadow
      // the back's form: the hump lit, the lower back turning away into shadow, the shoulder blade, the spine's furrow
      X.softTone(f, tD, [[[S.at(-0.9, 0.0), S.at(-0.3, -0.05), S.at(-0.2, 0.2), S.at(-0.8, 0.3)], P.ashL, 0.3, 8], [[S.at(-0.8, 0.6), S.at(-0.3, 0.6), S.at(-0.3, 1.0), S.at(-0.8, 1.0)], '#000', 0.3, 10]]);
      X.crease(f, [S.at(-0.2, 0.08), S.at(-0.46, 0.2), S.at(-0.56, 0.36), S.at(-0.42, 0.46)], 3, { op: 0.6, lit: P.ashL }); // the shoulder blade's edge
      X.crease(f, [S.at(-0.66, 0.06), S.at(-0.7, 0.3), S.at(-0.64, 0.6), S.at(-0.56, 0.9)], 2.6, { op: 0.55, lit: P.ashL }); // the spine's furrow
      // flayed back: lash welts crossing in two directions, raw and crusted, charred at the lips, some split open
      for (let i = 0; i < 11; i++) {
        const fam = i % 2, v = 0.04 + i * 0.075, a = S.at(-0.94, v + (fam ? 0.1 : -0.04)), b = S.at(0.0 + R(f, -0.1, 0.15), v + (fam ? -0.12 : 0.14));
        const m = add(lerp(a, b, 0.5), [R(f, -3, 3), R(f, -3, 3)]), pts = [a, m, b], w = R(f, 3.5, 6.5);
        f.stroke(pts, w + 5, P.charD, { op: 0.7 });
        f.stroke(pts, w, mix(P.raw, P.rawD, f.r() * 0.5), { op: 0.95 });
        f.line([lerp(a, m, 0.3), m, lerp(m, b, 0.6)].map(q => add(q, [1.2, -1.6])), 1, P.rawL, { op: 0.55 });
        for (let k = 0; k < 2; k++) f.flat(ell(lerp(a, b, R(f, 0.2, 0.8)), R(f, 2, 4), R(f, 1.5, 2.5), ang(a, b), 7), P.charS, { op: 0.8 }); // crusts
        if (i % 4 === 1) X.seam(f, [lerp(a, b, 0.15), m, lerp(a, b, 0.75)], 1.5);
      }
      X.stains(f, tD, tbb, P.charS, 0.022, 2.6, -1.25, 31, 0.8); // char blooming out of the welts
      X.ashCake(f, S.at(-0.3, 0.5), 50, 60, 8, 1.1);
      for (let i = 0; i < 5; i++) X.crease(f, [S.at(0.2, 0.2 + i * 0.1), S.at(0.4, 0.22 + i * 0.1), S.at(0.56, 0.27 + i * 0.1)], 2, { op: 0.45, lit: P.ashL }); // ribs showing through on the flank
      for (let i = 0; i < 6; i++) f.flat(ell(S.at(-0.68 + i * 0.01, 0.06 + i * 0.13), 4, 3, 0.4, 8), P.ashL, { op: 0.55 }); // vertebrae knuckles
      X.flakes(f, S.at(-0.4, 0.3), 40, 40, 6, 0.9);
    });
  }, { shape: tD });
  X.ash(f, S.at(-0.6, 0.12), 12, 50, 130, 1); // ash curling up off the back

  // ---- near leg, forward, weight on it: bare, a cilice of iron spikes biting above the knee
  bareLegRig(f, HN, KN, AN, 48, 64, 46, SKP(), '_n', { swell: 0.1, nail: P.ashD });
  f.bone('shin_n');
  X.ashCake(f, lerp(KN, AN, 0.5), 12, 50, 4, 0.9);
  for (const [t, o2] of [[0.08, 6], [0.14, -4]]) { const q = lp(KN, AN, t, o2); f.flat(ell(q, 7, 5, 0.3, 8), P.rawD, { op: 0.85 }); f.flat(ell(add(q, [-1, -1]), 4, 3, 0.3, 8), P.raw, { op: 0.8 }); } // knee scabs from kneeling
  f.bone('thigh_n');
  { const c0 = lp(HN, KN, 0.78, -27), c1 = lp(HN, KN, 0.8, 27); f.part([add(c0, [0, -6]), add(c1, [0, -6]), add(c1, [0, 6]), add(c0, [0, 6])], { fill: P.iron, shadow: P.ironD, shade: 0.35, inkW: 1.2, cast: false, tex: 'mottle' + seed });
    for (let i = 0; i < 6; i++) { const q = lerp(c0, c1, 0.08 + i * 0.17); f.part([add(q, [-3, -6]), add(q, [3, -6]), add(q, [0, -13])], { fill: P.ironL, shade: 0.3, inkW: 0.9, inkHeavy: 1, cast: false }); f.flat(ell(add(q, [0, 9]), 2, 3, 0, 6), P.raw, { op: 0.85 }); } }

  // ---- sackcloth wrap kilted at the hips, hem burnt into curled tongues
  f.bone('skirt');
  const sk0 = S.at(-0.7, 0.8), sk1 = S.at(0.62, 0.8);
  const skHem = X.charHem(f, [214, 586], [376, 566], 9, 13, [0, 1]);
  const skirt = [sk0, S.at(-0.1, 0.83), sk1, add(S.at(0.7, 0.92), [2, 0]), [392, 528], ...skHem.slice().reverse(), [206, 566], [198, 530], add(S.at(-0.76, 0.92), [-2, 0])];
  X.cutHoles(f, [[skHem[4], 11]], () => f.part(skirt, SAC({ maxShade: 24 })), { shape: E.smooth(skirt) });
  X.clipDraw(f, E.smooth(skirt), () => {
    X.softTone(f, E.smooth(skirt), [[[[200, 520], [250, 520], [244, 600], [196, 600]], '#000', 0.35, 10]]);
    for (const q of [[[300, 512], [318, 548], [340, 580]], [[270, 516], [268, 556], [262, 598]], [[236, 520], [226, 560], [220, 596]], [[340, 506], [362, 532], [384, 560]]]) X.crease(f, q, 3, { col: '#1e1c18', lit: P.sackL });
    X.crease(f, [[222, 508], [280, 530], [340, 522], [388, 512]], 2.6, { col: '#1e1c18', lit: P.sackL }); // the kilted wrap's tucked edge
    X.crease(f, [[204, 520], [214, 540], [210, 560]], 2.2, { col: '#1e1c18', lit: P.sackL }); // over the buttock
    X.stains(f, E.smooth(skirt), [170, 470, 430, 620], P.charS, 0.03, 2.4, -1.35, 17, 0.5);
    f.part([[232, 540], [262, 538], [264, 564], [234, 566]].map(q => [...q, 1]), SAC({ fill: mix(P.sack, '#3a3026', 0.3), inkW: 1.1, cast: false }));
    f.stitches([[232, 540], [262, 538], [264, 564], [234, 566], [232, 540]], P.sackL, 0.8);
  });
  X.charEdge(f, skHem, 6, { gap: 6 });
  // rope girdle with three knots and a hanging end
  f.bone('pelvis');
  const gird = [S.at(-0.86, 0.84), S.at(-0.3, 0.87), S.at(0.3, 0.86), S.at(0.76, 0.82)];
  X.rope(f, gird, 6, P.sackL);
  const kn = S.at(0.48, 0.86); X.rope(f, [kn, add(kn, [6, 30]), add(kn, [2, 60]), add(kn, [8, 86])], 5, P.sackL, { fray: true });
  for (const t of [26, 52, 76]) f.part(ell(add(kn, [5, t]), 6, 5, 0, 8), { fill: P.sackL, shadow: '#3a3630', shade: 0.4, inkW: 1, cast: false });

  // ---- hood: a sackcloth hood over the head, eye holes cut, a short cape over the shoulders with a round void bite
  const hF = frame(HC, hA, H);
  f.bone('head');
  f.part(limb(neck0, add(HC, [-22, 24]), 44, 40), SKP());
  // a sack pulled over the head: tight over brow and nose, a flat top seam, the top corner flopped back as a dog-ear,
  // slack and gathered under the jaw by the drawstring
  const hood = hF([[-0.22, 0.52], [-0.4, 0.3], [-0.48, -0.02], [-0.54, -0.3], [-0.74, -0.44, 1], [-0.62, -0.5], [-0.4, -0.58, 1], [-0.1, -0.6], [0.16, -0.57], [0.3, -0.46, 1], [0.36, -0.24], [0.4, -0.12], [0.47, 0.04, 1], [0.41, 0.14], [0.39, 0.3], [0.35, 0.42], [0.24, 0.5], [0.06, 0.54]]);
  f.part(hood, SAC({ maxShade: 18, k: 0.85 }));
  X.clipDraw(f, E.smooth(hood), () => {
    X.softTone(f, E.smooth(hood), [[hF([[-0.6, -0.4], [-0.25, -0.3], [-0.18, 0.3], [-0.3, 0.6], [-0.6, 0.4]]), '#000', 0.32, 9], [hF([[0.3, -0.5], [0.5, -0.4], [0.5, 0.1], [0.3, 0.0]]), P.sackL, 0.35, 5]]);
    X.crease(f, hF([[-0.4, -0.56], [-0.1, -0.54], [0.18, -0.5]]), 2.2, { col: '#1e1c18', lit: P.sackL }); // the sack's top seam
    f.stitches(hF([[-0.38, -0.52], [-0.1, -0.5], [0.16, -0.46]]), P.sackL, 0.8);
    X.crease(f, hF([[-0.56, -0.36], [-0.44, -0.3], [-0.3, -0.34]]), 1.8, { col: '#1e1c18', lit: P.sackL }); // the dog-ear's fold
    X.crease(f, hF([[-0.2, -0.36], [-0.24, -0.04], [-0.3, 0.3]]), 2.2, { col: '#1e1c18', lit: P.sackL });
    X.crease(f, hF([[0.0, 0.36], [0.12, 0.44], [0.26, 0.5]]), 2.2, { col: '#1e1c18', lit: P.sackL }); // slack under the jaw
    X.crease(f, hF([[-0.12, 0.3], [0.0, 0.48], [0.08, 0.58]]), 2, { col: '#1e1c18', lit: P.sackL });
    X.crease(f, hF([[0.3, -0.16], [0.36, -0.06], [0.42, 0.04]]), 1.6, { col: '#1e1c18', lit: P.sackL }); // pulled over the nose bridge
    X.stains(f, E.smooth(hood), E.bbox(hood).map((v, i) => v + (i < 2 ? -10 : 10)), P.charS, 0.04, 2.2, -1.2, 23, 0.45);
    f.flat(hF(ell([0.32, 0.36], 0.08, 0.05, 0.3, 10)), '#1e1612', { op: 0.5 }); // a breath stain over the mouth
    f.flat(hF(ell([-0.04, 0.06], 0.07, 0.05, 0.3, 10)), '#4a3a30', { op: 0.35 }); // an old sweat stain at the temple
  });
  // eye holes: ragged cuts, the near one showing a pale, red-rimmed eye; the far one dark
  for (const [c, rx, ry, eye] of [[[0.16, -0.1], 0.07, 0.045, true], [[0.37, -0.09], 0.035, 0.04, false]]) {
    f.flat(hF(ell(c, rx * 1.3, ry * 1.4, 0.1, 10)), '#2a2620', { op: 0.5 });
    f.flat(hF(ell(c, rx, ry, 0.1, 9).map((q, i) => i % 2 ? [q[0] * 1.06, q[1]] : q)), '#0c0909');
    if (eye) { f.flat(hF(ell([c[0] + 0.01, c[1] + 0.005], 0.045, 0.022, 0, 10)), '#b8aca0'); f.flat(hF(ell([c[0] + 0.025, c[1] + 0.005], 0.017, 0.017, 0, 8)), '#141012'); f.line(hF([[c[0] - 0.045, c[1] + 0.02], [c[0], c[1] + 0.03], [c[0] + 0.05, c[1] + 0.02]]), 1.2, P.raw, { op: 0.8 }); }
  }
  // below the drawstring the sack flares in a short burnt frill over the neck
  const frill = [hF([[-0.3, 0.48]])[0], hF([[0.28, 0.52]])[0], add(hF([[0.34, 0.6]])[0], [8, 16]), ...X.charHem(f, add(hF([[0.3, 0.6]])[0], [6, 20]), add(hF([[-0.42, 0.56]])[0], [-14, 18]), 6, 9, [0, 1]), add(hF([[-0.4, 0.5]])[0], [-6, 6])];
  f.part(frill, SAC({ fill: mix(P.sack, '#000', 0.08), maxShade: 10 }));
  X.charEdge(f, frill.slice(3, -1), 4, { gap: 5 });
  // drawstring at the throat
  X.rope(f, hF([[-0.32, 0.5], [-0.04, 0.6], [0.26, 0.54]]), 3, P.sackL, { lit: false });
  X.rope(f, [hF([[0.0, 0.6]])[0], add(hF([[0.0, 0.6]])[0], [4, 26]), add(hF([[0.0, 0.6]])[0], [0, 46])], 2.4, P.sackL, { lit: false, fray: true }); // its tail, hanging plumb
  // ---- the flagellum: a wooden handle with a leather wrap; five iron chains with barbed knots falling across the back
  f.bone('flagellum');
  const chains = [];
  for (let i = 0; i < 5; i++) {
    const a0 = add(hEnd, [(i - 2) * 3, 4]), top = S.at(-0.86, 0.12 + i * 0.07); // where each chain meets the hump
    const hang = add(lerp(a0, top, 0.55), [(i - 2) * 5 - 10, 0]);
    const rest = S.at(-0.9, 0.3 + i * 0.08), end = S.at(-0.84 - (i % 2) * 0.08, 0.46 + i * 0.09);
    chains.push([a0, hang, top, rest, end]);
  }
  for (const pts of chains) X.ironChain(f, X.spline(pts, 6), 10, 2.6, P.iron, { phase: 0 });
  for (const pts of chains) { const e = pts[4]; f.part([add(e, [-5, -2]), add(e, [0, -7]), add(e, [5, -2]), add(e, [7, 4]), add(e, [0, 9]), add(e, [-7, 4])].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, shade: 0.35, inkW: 1.1, cast: false, tex: 'mottle' + seed }); f.flat(ell(add(e, [0, 3]), 2.2, 2.2, 0, 6), P.rawD, { op: 0.9 }); }
  f.part(limb(hButt, hEnd, 12, 11, { steps: 6 }), { fill: P.wood, shadow: P.woodD, light: P.woodL, tex: 'grain' + seed, texOp: 0.6 });
  for (let i = 0; i < 4; i++) f.line([lp(hButt, hEnd, 0.08 + i * 0.07, -7), lp(hButt, hEnd, 0.12 + i * 0.07, 7)], 1.6, P.leatherD, { straight: true });
  f.part(ell(hEnd, 7, 6, fA, 10), { fill: P.iron, shadow: P.ironD, shade: 0.35, inkW: 1.1, cast: false }); // the ring the chains hang from

  // ---- near arm, raised: bare, ash-caked, a charred split down the forearm
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.92), 50, 40, SKP(), '_n');
  f.bone('upperarm_n');
  X.ashCake(f, lerp(SN, EN, 0.5), 14, 24, 5, 0.9);
  X.crease(f, [lp(SN, EN, 0.3, 8), lp(SN, EN, 0.55, 12), lp(SN, EN, 0.8, 8)], 1.6, { op: 0.4, lit: P.ashL }); // the biceps edge
  f.bone('forearm_n');
  X.seam(f, [lp(EN, WN, 0.15, -6), lp(EN, WN, 0.4, -9), lp(EN, WN, 0.7, -6)], 2.2);
  X.ash(f, lp(EN, WN, 0.4, -10), 6, 20, 60, 0.8);
  f.line([lp(EN, WN, 0.2, 8), lp(EN, WN, 0.75, 7)], 1.1, mix(skin, '#000', 0.4), { op: 0.5 }); // a tendon
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, fA, 24, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'penitent flagellum' });
  X.fistDetail(f, gN, 24, skin, { nail: '#5a5050' });
  X.hairline(f, [add(WN, [-6, -10]), add(WN, [0, -4]), add(WN, [6, -8])], 1.2);

  f.bone('root');
  X.ashprint(f, [AF[0] + 30, gy + 4], 1.3); X.ashprint(f, [AN[0] + 34, gy + 4], 1.3);
  return f;
}

// ------------------------------------------------------------------ THE SAINT UNENDING (ruler, 3.5)
// A woman burned for one sermon: that heaven was a garden, and a woman kept it. Bound to a squared black stake atop a
// pyre of faggots, chained at the waist (pinning her elbows) and the knees, hands still pressed together in prayer under
// her chin. Slender, but a body: collarbones, the sternal notch, neck tendons, ribs under a clinging shift, knuckled
// hands, the wrist's bony knob, kneecaps and bare feet. The head tilted up, eyes closed, brows drawn up in pain, lips
// parted on a word: suffering and serenity at once. Fire: skin charred and cracked to the bone (the near shin split open
// on the tibia, the ulna, a fingertip), the shift scorched, holed and burnt off one shoulder and up to the knee, ash
// curling off. Void: black flame with violet edges that casts no light; clean round holes through the ribs (the bones
// show), the jaw, the shift, the stake and the platform. The only gold in the world: the halo. The Tooth at her throat.
// Hair rising as smoke (bible). The stake runs out of the frame top and the halo is cropped (ruler framing).
// The figure is drawn in figure space (platform y 1222) and set at x1.22 on the platform at y 1330 by placeFigure.
// Rig: root (pyre, platform, ground) ; stake ; body (bound torso, legs, shift, chains, flames on her) > head > jaw,
// hair_smoke, halo ; body > arms (praying arms and hands) ; body > tooth ; flames_back, flames_front, flame_reach (root).
// Motion: idle the flames rising and the lips moving (jaw); attack the black fire spreading (flame_reach swings out).
function saintUnending() {
  const [CW, CH] = TIERS.ruler, seed = 1300;
  const f = new Fig(X.base(seed, CH, { grimeY: CH - 30 - 250 })); X.textures(f);
  const gy = f.o.groundY;
  const K0 = 1.22, FROM = [790, 1222], platY = 1330, TO = [790, platY];
  const skin = '#7a706a', skinS = '#261c22', skinL = '#b4aaa0', face = '#a89c94', charC = '#3a3234';
  const SKC = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: skinL, shade: 0.36, tex: 'mottle' + seed, texOp: 0.5 }, o);
  const SHF = (o = {}) => Object.assign({ fill: mix(P.shift, P.ash, 0.3), shadow: P.shiftS, light: '#f2eee6', shade: 0.38, tex: 'weave' + seed, texOp: 0.35 }, o);
  const WOOD = (o = {}) => Object.assign({ fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.38, tex: 'grain' + seed, texOp: 0.55 }, o);
  const stX = 712, stW = 100;
  // ---- figure space (head 150, platform y 1222); she faces right in drawing space, the stake behind her at fig x ~726
  const H = 150, pY = 1222;
  const HC = [852, 262], hA = -0.22, NB = [818, 384];
  const SN = [780, 404], SF = [868, 394];
  const EN = [790, 604], WN = [880, 460], EF = [872, 598], WF = [900, 452];
  const HN = [796, 700], KN = [822, 916], AN = [804, 1146], HF = [838, 694], KF = [846, 914], AF = [856, 1150];
  const fig = p => add(mul(sub(p, FROM), K0), TO); // figure space to canvas
  const hz = frame(HC, hA, H);
  f.joint('stake', [stX, platY]).joint('body', fig([812, 700])).joint('head', fig(NB), 'body').joint('jaw', fig(hz([[-0.1, 0.22]])[0]), 'head');
  f.joint('hair_smoke', fig(hz([[-0.3, -0.4]])[0]), 'head').joint('halo', fig(HC), 'head').joint('arms', fig(SN), 'body').joint('tooth', fig([858, 400]), 'body');
  f.joint('flames_back', [760, platY]).joint('flames_front', [800, platY]).joint('flame_reach', [1000, platY - 40]);

  // ---- the stake: a hewn square post, out of the frame top. Front face and a narrow lit bevel; charred into alligator
  // checks (rows of cracked blocks), split along the grain with violet threads, adze facets, iron staples, a void hole.
  f.bone('stake');
  const sL = stX - stW / 2, sR = stX + stW / 2;
  const stake = [[sL, -20, 1], [sR, -20, 1], [sR + 4, platY + 40, 1], [sL - 4, platY + 40, 1]];
  const stD = E.smooth(stake);
  X.cutHoles(f, [[[stX - 10, 290], 17]], () => {
    f.part(stake, WOOD({ maxShade: 26 }));
    X.clipDraw(f, stD, () => {
      f.flat([[sR - 16, -20], [sR + 6, -20], [sR + 8, platY + 40], [sR - 14, platY + 40]], P.woodL, { op: 0.35 }); // the lit arris and bevel
      f.line([[sR - 16, -20], [sR - 14, platY + 40]], 1.6, P.charS, { op: 0.8 });
      f.flat([[sL - 4, -20], [sL + 18, -20], [sL + 16, platY + 40], [sL - 6, platY + 40]], P.charS, { op: 0.45 });
      // alligator checks: rows of charred blocks, each row's vertical cracks offset from the last
      // long splits along the grain, wandering; short charred cross-checks between them, never in rows
      for (let i = 0; i < 7; i++) { let x = sL + 10 + i * (stW - 20) / 6 + R(f, -5, 5), y = R(f, -20, 200); while (y < platY) { const l = R(f, 60, 200); f.line([[x, y], [x + R(f, -3, 3), y + l * 0.5], [x + R(f, -4, 4), y + l]], R(f, 1, 2.2), P.charS, { op: 0.8 }); y += l + R(f, 20, 120); x += R(f, -3, 3); } }
      for (let i = 0; i < 70; i++) { const x = R(f, sL + 4, sR - 20), y = R(f, -10, platY), l = R(f, 8, 30); f.line([[x, y], [x + l * 0.5, y + R(f, -2, 2)], [x + l, y + R(f, -3, 3)]], R(f, 1.4, 2.6), P.charS, { op: 0.85 }); f.line([[x + 2, y - 2.5], [x + l - 2, y - 2.5]], 1, P.woodL, { op: 0.4 }); }
      for (let i = 0; i < 6; i++) { const x0 = stX + R(f, -28, 28), y0 = 40 + i * 220; X.seam(f, [[x0, y0], [x0 + R(f, -6, 6), y0 + 60], [x0 + R(f, -8, 8), y0 + 130]], 2.2); }
      for (let i = 0; i < 9; i++) { const y0 = R(f, 0, platY); f.line([[sL + 22, y0], [sL + 40, y0 - 6], [sL + 60, y0 + 2]], 1.2, P.woodL, { op: 0.4 }); } // adze facets
      X.ashCake(f, [stX, 700], 40, 600, 14, 1.1, 0.25);
    });
  }, { shape: stD });
  // the judgement nailed over her head, cropped by the frame: a charred board, red rubric half burnt away
  const tb = [[stX - 90, -14], [stX + 86, -20], [stX + 88, 52], [stX - 86, 58]];
  f.part(tb.map(q => [...q, 1]), { fill: '#3a3230', shadow: P.charS, shade: 0.35, tex: 'grain' + seed, texOp: 0.5 });
  for (const [x, w] of [[-66, 18], [-40, 14], [-18, 20], [8, 16], [32, 12]]) f.part([[stX + x, 6], [stX + x + w, 5], [stX + x + w, 36], [stX + x, 37]].map(q => [...q, 1]), { fill: P.rubric, shadow: '#4a120c', shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
  X.charEdge(f, [[stX + 88, 52], [stX + 20, 56], [stX - 86, 58]], 9);
  for (const q of [[stX - 70, 22], [stX + 70, 18]]) f.rivet(q, 4, P.ironL);
  // iron staples driven into the post where the chains are made fast
  const staple = y => { f.part([[sR - 30, y - 16], [sR + 6, y - 18], [sR + 8, y + 16], [sR - 30, y + 14]].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.35, inkW: 1.3, cast: false, tex: 'mottle' + seed }); f.rivet([sR - 22, y - 6], 3.4, P.ironL); f.rivet([sR - 22, y + 6], 3.4, P.ironL); f.flat(ell([sR - 4, y], 5, 9, 0, 8), '#060506'); };
  const yWaist = fig([0, 610])[1], yKnee = fig([0, 944])[1], yChest = fig([0, 440])[1];
  staple(yChest); staple(yWaist); staple(yKnee);

  // ---- the pyre: faggots stacked end-on in rows like a heap, their cut ends toward us, withy bands round each; split
  // logs laid lengthwise in front; flames breaking out between the rows. Drawn top row first, each row over the one behind.
  f.bone('root');
  const mound = [[150, gy + 2, 1], [290, 1480], [450, 1400], [610, platY + 30], [970, platY + 30], [1130, 1400], [1300, 1480], [1450, gy + 2, 1]];
  f.part(mound, WOOD({ fill: P.woodD, maxShade: 40 }));
  // a faggot seen along its length: thin sticks of uneven thickness with dark gaps between them, ragged ends, knots and
  // twigs; two twisted withy bands; the cut ends toward us, pale in the middle, charred at the rim
  const faggot = (a, b, w, n) => {
    const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
    f.part(limb(a, b, w, w * 0.9, { steps: 8 }), { fill: '#0e0a0c', shade: 0.2, inkW: 1.4, cast: false, hatch: false, maxShade: 2 });
    for (let i = 0; i < n; i++) {
      const o2 = (i / (n - 1) - 0.5) * w * 0.8, aa = add(add(a, mul(nn, o2 + R(f, -2, 2))), mul(d, R(f, -6, 18))), bb = add(add(b, mul(nn, o2 * 0.95)), mul(d, R(f, -24, 12))), sw = R(f, 7, 12);
      f.part(limb(aa, bb, sw, sw * 0.8, { steps: 5 }), WOOD({ inkW: 0.9, inkHeavy: 1.3, cast: false, maxShade: 3, fill: [P.wood, '#352d2a', '#40363a', '#2a2224'][Math.floor(f.r() * 4)] }));
      f.line([lp(aa, bb, 0.05, -sw * 0.22), lp(aa, bb, 0.9, -sw * 0.18)], 0.9, P.woodL, { op: 0.45 });
      if (f.r() < 0.3) { const k = lp(aa, bb, R(f, 0.3, 0.7), 0); f.flat(ell(k, 2.4, 1.8, 0, 6), P.charS); f.line([k, add(k, rot(mul(d, 14), R(f, -1.2, 1.2)))], 1.6, P.wood); }
      if (f.r() < 0.25) X.hairline(f, [lp(aa, bb, 0.2, 0), lp(aa, bb, 0.45, 1), lp(aa, bb, 0.7, -1)], 0.9);
      f.part(ell(aa, sw * 0.42, sw * 0.5, ang(aa, bb), 8), { fill: f.r() < 0.3 ? '#3a3032' : '#6a5c56', shadow: P.charS, shade: 0.35, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false, maxShade: 2 });
    }
    for (const tt of [0.3, 0.68]) { const c = lerp(a, b, tt), wd = w * 0.52; X.rope(f, [add(c, mul(nn, -wd)), add(c, mul(d, 4)), add(c, mul(nn, wd))], 5, '#4a4038', { lit: false }); }
  };
  const log = (a, b, w, o = {}) => {
    const shape = limb(a, b, w, w * 0.92, { steps: 10, p: [[0.3, 0.06, 0.2]], q: [[0.7, 0.05, 0.2]] });
    f.part(shape, WOOD({ maxShade: w * 0.35 }));
    X.clipDraw(f, E.smooth(shape), () => {
      for (let t = 0.06; t < 0.96; t += R(f, 0.05, 0.09)) X.crease(f, [lp(a, b, t, -w * 0.55), lp(a, b, t + 0.01, 0), lp(a, b, t, w * 0.55)], R(f, 1.6, 2.6), { col: P.charS, lit: P.woodL });
      f.line([lp(a, b, 0.02, -w * 0.28), lp(a, b, 0.98, -w * 0.3)], 1.6, P.woodL, { op: 0.5 });
      X.seam(f, [lp(a, b, 0.15, w * 0.1), lp(a, b, 0.45, w * 0.18), lp(a, b, 0.8, w * 0.05)], 2);
    });
    const e = o.end > 0 ? b : a; f.part(ell(e, w * 0.26, w * 0.5, ang(a, b), 14), { fill: '#5a4e4c', shadow: P.charS, shade: 0.4, inkW: 1.3, cast: false, hatch: false });
    for (const k of [0.75, 0.5, 0.25]) f.line(ell(e, w * 0.24 * k, w * 0.46 * k, ang(a, b), 12).concat([ell(e, w * 0.24 * k, w * 0.46 * k, ang(a, b), 12)[0]]), 0.8, P.charS, { op: 0.6 });
  };
  // the heap: back bundles steep and short, front ones long and low, all leaning in to the stake's foot; fire low between
  const hub = [790, platY + 20];
  const heap = [[-0.3, 300, 56, 9], [3.44, 300, 56, 9], [-0.08, 400, 60, 10], [3.22, 400, 60, 10], [0.16, 440, 62, 10], [2.98, 440, 62, 10], [0.4, 400, 62, 10], [2.74, 400, 62, 10], [0.72, 320, 60, 9], [2.42, 320, 60, 9], [1.12, 250, 64, 10], [2.02, 250, 64, 10]];
  heap.forEach(([a0, len, w, n], i) => {
    faggot(add(hub, [Math.cos(a0) * len, Math.sin(a0) * len * 0.62 + 60]), add(hub, [Math.cos(a0) * 50, -10]), w, n);
    if (i === 5) { f.bone('flames_back'); X.flameSheet(f, [[480, 1440], [790, 1380], [1100, 1440]], [[520, 90, 50, -0.1], [640, 70, 46, -0.05], [940, 80, 46, 0.05], [1060, 100, 50, 0.1]], { edgeW: 2 }); f.bone('root'); }
  });
  log([260, 1548], [700, 1520], 60, { end: -1 }); log([900, 1522], [1340, 1550], 62, { end: 1 });
  // the platform: charred planks on two bearers, a clean round bite out of its front edge
  const plat = [[596, platY - 8], [976, platY - 12], [984, platY + 26], [590, platY + 30]].map(q => [...q, 1]);
  X.cutHoles(f, [[[904, platY + 28], 16]], () => {
    f.part(plat, WOOD({ fill: '#2e2624' }));
    for (const x of [686, 782, 878]) f.line([[x, platY - 10], [x + 2, platY + 28]], 1.8, P.charS);
    X.crease(f, [[598, platY + 4], [780, platY + 2], [978, platY - 2]], 2, { col: P.charS, lit: P.woodL });
    for (const x of [636, 732, 828, 924]) f.rivet([x, platY + 13], 3, P.ironL);
  }, { shape: E.smooth(plat) });
  for (const x of [620, 940]) f.part([[x - 16, platY + 28], [x + 16, platY + 28], [x + 14, platY + 50], [x - 14, platY + 50]].map(q => [...q, 1]), WOOD({ fill: P.woodD, cast: false }));

  // ================= the figure (figure space; placed at the end of this block)
  const i0 = f.out.length;
  // ---- black fire climbing her back, between her and the stake (follows the line of her back)
  f.bone('flames_back');
  X.flameSheet(f, [[640, pY + 18], [720, pY + 8], [800, pY + 4], [880, pY + 8], [960, pY + 18]], [[660, 300, 120, -0.06], [722, 470, 130, -0.03], [770, 560, 120, 0.0], [860, 380, 110, 0.04], [930, 240, 100, 0.08]]);
  X.flames(f, [[772, 1000], [766, 860], [770, 720], [778, 600], [774, 480], [786, 420]], 9, 50, 150, 36, { side: -1, band: false });

  f.bone('halo');
  X.halo(f, add(HC, [-20, -4]), 150);
  // ---- legs (whole, drawn under the shift): slender, the knees bony, the far leg carrying the weight
  f.bone('body');
  const legL = (o = {}) => SKC(Object.assign({ tex: 'craze' + seed, texOp: 0.35 }, o));
  X.fullLeg(f, HF, KF, AF, 1, 60, 92, 58, legL({ fill: mix(skin, '#000', 0.42), light: skin, maxShade: 16 }), { groundY: pY, thigh: 0.04 });
  const nl = X.fullLeg(f, HN, KN, AN, 1, 62, 96, 60, legL({ fill: mix(skin, skinL, 0.15), maxShade: 18 }), { groundY: pY, thigh: 0.04 });
  const shinU = t => lerp(KN, AN, t);
  X.clipDraw(f, E.smooth(nl), () => {
    X.softTone(f, E.smooth(nl), [[[lp(KN, AN, 0, -30), lp(KN, AN, 1, -24), lp(KN, AN, 1, -10), lp(KN, AN, 0, -12)], skinL, 0.35, 6], [[lp(KN, AN, 0, 30), lp(KN, AN, 1, 24), lp(KN, AN, 1, 8), lp(KN, AN, 0, 10)], '#000', 0.3, 6]]);
    // the kneecap and the tendon under it
    f.part(ell(add(KN, [14, -4]), 16, 20, 0.1, 12), legL({ fill: mix(skin, skinL, 0.25), inkW: 1.2, inkHeavy: 1.6, cast: false, maxShade: 5 }));
    f.line([add(KN, [18, 16]), add(KN, [16, 40])], 1.3, P.charS, { op: 0.5 });
    // charred from the foot up: a char stain, the skin crazed and lifting
    X.stains(f, E.smooth(nl), [700, 1000, 960, 1240], P.charS, 0.03, 3.2, -1.6, 47, 0.9);
    // the shin split open to the tibia: charred lips, the bone's pale ridge, violet threads; the calf muscle beside it
    const b0 = lp(KN, AN, 0.2, -12), b1 = lp(KN, AN, 0.8, -9), bm = lp(KN, AN, 0.5, -14);
    // the shin split open down its face, toward us: charred lips, the tibia's pale ridge inside, violet threads
    const G = (tt, o) => lp(KN, AN, tt, o - 6);
    f.flat([G(0.15, 0), G(0.3, -17), G(0.55, -19), G(0.82, -11), G(0.9, 0), G(0.8, 11), G(0.55, 18), G(0.3, 15)], P.charS);
    f.flat([G(0.2, 0), G(0.33, -12), G(0.55, -14), G(0.8, -8), G(0.86, 0), G(0.78, 8), G(0.55, 13), G(0.33, 10)], '#120c10');
    f.part([G(0.22, 0), G(0.35, -8), G(0.56, -9), G(0.78, -6), G(0.84, 0), G(0.76, 5), G(0.56, 8), G(0.36, 6)], { fill: P.bone, shadow: P.boneS, light: '#f0ead8', shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false, maxShade: 4 });
    f.line([G(0.25, -3), G(0.5, -4), G(0.76, -2)], 1.8, '#f6f0e0', { op: 0.85 });
    for (const tt of [0.34, 0.47, 0.6, 0.7]) f.line([G(tt, 2), G(tt + 0.02, 7)], 0.9, P.boneS, { op: 0.7 });
    X.seam(f, [G(0.14, 2), G(0.3, -18), G(0.55, -21), G(0.84, -12)], 1.3);
    X.seam(f, [G(0.18, 4), G(0.4, 17), G(0.62, 19), G(0.86, 10)], 1.2);
    X.crackNet(f, lp(KN, AN, 0.3, 14), 1.8, 60, 1.6, { depth: 1 });
    X.flakes(f, lp(KN, AN, 0.9, 6), 12, 16, 3, 0.7);
  });
  // feet: tendons on the instep, the ankle bone, charred toes
  for (const [A, dk] of [[AF, 0.24], [AN, 0]]) {
    f.flat(ell(add(A, [-2, 4]), 7, 6, 0, 8), mix(skin, skinL, 0.4 - dk), { op: 0.6 });
    for (let i = 0; i < 3; i++) f.line([add(A, [8 + i * 6, 6]), add(A, [30 + i * 10, 26 + i * 2])], 1, P.charS, { op: 0.45 });
    f.flat([add(A, [30, 30]), add(A, [70, 28]), add(A, [74, 38]), add(A, [34, 38])], P.charS, { op: 0.55 });
  }

  // ---- torso (under the shift, drawn whole): a slender woman's trunk in three-quarter view
  const torsoPts = [[806, 350], [796, 380], [770, 398], [764, 440], [768, 500], [772, 560], [780, 608], [772, 660], [768, 708], [784, 748], [808, 760], [856, 756], [878, 720], [888, 676], [884, 636], [876, 604], [884, 566], [902, 524], [912, 488], [906, 450], [892, 418], [880, 398], [870, 370], [868, 346]];
  const tD = E.smooth(torsoPts);
  f.part(torsoPts, SKC({ maxShade: 24 }));
  X.clipDraw(f, tD, () => {
    X.softTone(f, tD, [[[[766, 380], [800, 380], [804, 760], [766, 760]], '#000', 0.35, 12], [[[870, 420], [906, 470], [900, 530], [870, 500]], skinL, 0.4, 8]]);
    // the ribcage on the near flank, rib by rib, the hollow under them; the sternal notch and the collarbone
    for (let i = 0; i < 6; i++) X.crease(f, [[806, 470 + i * 20], [836, 478 + i * 21], [862, 470 + i * 22 + i * 2], [878, 452 + i * 24]], 2.2, { op: 0.55, lit: skinL, col: skinS });
    f.flat([[858, 398], [866, 401], [862, 408]], '#120c10', { op: 0.7 });
    X.softTone(f, tD, [[[[800, 386], [850, 392], [846, 402], [804, 398]], skinS, 0.35, 4]]); // the hollow above the collarbone
    X.crease(f, [[858, 410], [840, 412], [822, 404], [800, 402]], 1.8, { lit: skinL, col: skinS, op: 0.45 }); // the near collarbone's lower edge
    f.line([[858, 404], [838, 406], [818, 399], [800, 396]], 2.4, skinL, { op: 0.55 });
    X.crease(f, [[868, 398], [878, 392], [886, 396]], 2, { lit: skinL, col: skinS, op: 0.5 }); // the far collarbone, foreshortened
    X.crackNet(f, [790, 420], 0.6, 50, 1.6, { depth: 1 }); X.ashCake(f, [790, 430], 16, 20, 4, 0.9);
    soot0(f, [786, 414], 20, 26);
  });
  function soot0(ff, c, rx, ry) { X.soot(ff, c, rx, ry, 0.5); }
  // the void: a clean round hole through the near ribs; inside, the rib bones and dark
  const ribHole = [[836, 520], 25];
  X.clipDraw(f, E.smooth(ell(ribHole[0], ribHole[1], ribHole[1], 0, 28)), () => {
    f.flat(ell(ribHole[0], 40, 40, 0, 12), '#060407');
    f.flat(ell(add(ribHole[0], [8, 6]), 14, 12, 0, 10), P.vioS, { op: 0.9 });
    for (let i = 0; i < 3; i++) { const c = add(ribHole[0], [0, -16 + i * 15]); f.stroke([add(c, [-34, 4]), add(c, [0, -4]), add(c, [34, 6])], 8, P.bone); f.line([add(c, [-28, 4]), add(c, [0, -2]), add(c, [28, 6])], 1, P.boneS, { op: 0.8 }); }
  });
  // ---- the shift: burnt off the near shoulder and up to the knee in front, clinging to the ribs and thighs
  const hem = X.charHem(f, [912, 912], [752, 1030], 12, 30, [0, 1]);
  const shift = [[796, 458], [818, 466], [844, 468], [868, 456], [884, 428], [892, 404], [902, 414], [908, 444], [914, 486], [904, 524], [892, 562], [882, 600], [890, 640], [898, 690], [904, 748], [910, 806], [916, 860], ...hem, [754, 960], [758, 880], [764, 800], [760, 740], [764, 680], [770, 620], [770, 560], [768, 500], [776, 456]];
  const shD = E.smooth(shift);
  const shHoles = [ribHole, [[790, 870], 18], [[880, 700], 12]];
  X.cutHoles(f, shHoles, () => {
    f.part(shift, SHF({ maxShade: 34 }));
    X.clipDraw(f, shD, () => {
      X.softTone(f, shD, [[[[750, 420], [800, 420], [800, 1040], [750, 1040]], P.shiftS, 0.65, 14], [[[812, 640], [834, 640], [826, 1000], [808, 1000]], P.shiftS, 0.45, 7], [[[852, 640], [868, 650], [880, 900], [862, 900]], P.shiftS, 0.4, 7], [[[790, 640], [880, 640], [880, 680], [790, 680]], P.shiftS, 0.3, 8], [[[880, 420], [912, 480], [900, 540], [870, 520]], '#ffffff', 0.35, 8], [[[884, 700], [912, 760], [916, 900], [886, 900]], '#ffffff', 0.25, 8], [[[836, 780], [856, 780], [850, 960], [828, 960]], P.shiftS, 0.4, 8]]);
      // the cloth clinging to the ribs below the breast (follows each rib), pulled tight under the waist chain
      for (let i = 0; i < 4; i++) X.crease(f, [[846, 532 + i * 18], [866, 530 + i * 19], [884, 520 + i * 20]], 2.2, { col: P.shiftS, lit: '#f4f0e8', op: 0.6 });
      for (const q of [[[880, 444], [870, 480], [868, 520]], [[900, 470], [890, 520], [884, 560]]]) X.crease(f, q, 2.4, { col: P.shiftS, lit: '#f4f0e8' }); // drape off the breast
      // under the chain: the cloth bunched and pulled into radiating folds
      for (const [a, b] of [[[790, 626], [770, 700]], [[812, 628], [808, 720]], [[836, 628], [846, 740]], [[860, 626], [884, 700]], [[800, 596], [784, 546]], [[848, 596], [854, 560]]]) X.crease(f, [a, lerp(a, b, 0.5), b], 2.8, { col: P.shiftS, lit: '#f4f0e8' });
      // clinging to the near thigh and falling between the legs to the hem
      for (const q of [[[828, 720], [840, 800], [850, 900]], [[870, 740], [884, 820], [896, 900]], [[786, 760], [782, 860], [780, 960]], [[806, 820], [808, 900], [806, 980]], [[848, 700], [862, 780], [872, 880]]]) X.crease(f, q, 4.2, { col: P.shiftS, lit: '#f4f0e8' });
      // scorch rising from the hem and blooming round the holes and the bare shoulder; ash; old stains
      X.stains(f, shD, [740, 380, 930, 1040], P.charS, 0.012, 3.4, -1.75, 41, 0.92);
      X.stains(f, shD, [740, 820, 930, 1040], P.charD, 0.03, 2.8, -1.0, 43, 0.6);
      X.stains(f, shD, [740, 380, 930, 520], P.charS, 0.03, 3, -1.4, 45, 0.6);
      X.ashCake(f, [830, 700], 60, 200, 10, 1.3, 0.3);
      for (const [c, r] of [[[870, 820], 11], [[780, 660], 9], [[890, 600], 7], [[800, 960], 10], [[860, 460], 6]]) X.burnHole(f, c, r, 0.3);
    });
  }, { shape: shD });
  X.charEdge(f, hem, 10, { gap: 5, s: 1.3, vop: 0.95 });
  // a wide ragged window burnt out of the shift over the near hip and thigh: the charred skin shows, crazed, the hip bone
  { const win = [[772, 688], [790, 676], [806, 690], [818, 682], [826, 704], [822, 736], [830, 770], [822, 806], [810, 842], [796, 856], [782, 836], [772, 800], [776, 764], [768, 730]];
    f.part(win, SKC({ fill: mix(skin, '#000', 0.12), inkW: 0, inkHeavy: 0, cast: false, maxShade: 10 }));
    X.clipDraw(f, E.smooth(win), () => { X.softTone(f, E.smooth(win), [[[[760, 680], [786, 680], [786, 860], [760, 860]], '#000', 0.4, 8]]); X.crease(f, [[790, 700], [806, 716], [812, 740]], 2, { col: skinS, lit: skinL, op: 0.6 }); X.stains(f, E.smooth(win), [760, 670, 840, 870], P.charS, 0.04, 3.2, -1.5, 59, 0.8); X.crackNet(f, [800, 760], 1.4, 60, 1.6, { depth: 1 }); X.ashCake(f, [796, 800], 14, 30, 4, 0.9); });
    X.charEdge(f, [...win, win[0]], 8, { gap: 4, s: 1.1 }); }
  X.charEdge(f, [[796, 458], [818, 466], [844, 468], [868, 456], [884, 428]], 7, { gap: 4 }); // the burnt neckline off the near shoulder
  // ---- the chains: round the waist pinning the elbows, round the knees; heavy links pressing into the cloth, running
  // back to the staples on the post; a padlock at the waist; a slack loop hanging from the knee chain
  const wrapC = (pts, l = 24, w = 6) => X.ironChain(f, X.spline(pts, 8), l, w, P.iron, { phase: 1 });
  wrapC([[766, 604], [790, 612], [830, 622], [872, 618], [898, 606]]);
  wrapC([[772, 936], [800, 944], [840, 950], [870, 940]]);
  wrapC([[740, 944], [738, 990], [752, 1020], [770, 1010], [776, 960]], 20, 5); // the slack end
  { const lk = [836, 636]; X.link(f, add(lk, [0, -6]), Math.PI / 2, 24, 4.5, true); f.part([add(lk, [-16, 8]), add(lk, [16, 8]), add(lk, [18, 42]), add(lk, [-18, 42])].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.35, inkW: 1.3, cast: false, tex: 'mottle' + seed }); f.flat(ell(add(lk, [0, 24]), 3, 6, 0, 8), '#050405'); f.line([add(lk, [-14, 12]), add(lk, [14, 12])], 1, P.ironL, { op: 0.6 }); }

  // ---- far arm under the near one: the sleeve burnt off above the elbow, the forearm rising to the hands
  f.bone('arms');
  X.muscleArm(f, SF, EF, WF, 36, 28, SKC({ fill: mix(skin, '#000', 0.22) }), '_f', { lit: skinL, vein: false, bones: ['arms', 'arms'] });
  f.bone('arms');
  { const sl = [lp(SF, EF, -0.08, -24), lp(SF, EF, -0.1, 24), lp(SF, EF, 0.3, 24), ...X.charHem(f, lp(SF, EF, 0.42, 24), lp(SF, EF, 0.36, -26), 4, 12, E.norm(sub(EF, SF))), lp(SF, EF, 0.2, -26)]; f.part(sl, SHF({ fill: P.shiftD, maxShade: 12 })); X.charEdge(f, sl.slice(3, 8), 5, { gap: 4 }); }
  // ---- head: tilted up, eyes closed, brows drawn up in pain, lips parted on a word; the halo behind it
  f.bone('hair_smoke');
  // hair rising as smoke: locks lift off the crown and the back of the head in S-curves, thick at the root, thinning,
  // and turn into soft smoke as they rise (behind the skull, so they leave it from the back)
  const lock = (r0, a0, len, w0) => {
    const C = [r0], ph = f.r() * 6; let p = r0, a = a0;
    for (let i = 1; i <= 14; i++) { const t = i / 14; a = a + (-Math.PI / 2 - 0.35 - a) * 0.12 + Math.sin(t * 7 + ph) * 0.28; p = add(p, rot([len / 14, 0], a)); C.push(p); }
    f.raw(`<path d="${E.smooth(X.ribbon(C.slice(5), C.slice(5).map((_, i) => w0 * (0.8 + i * 0.5))))}" fill="#3e383e" opacity="0.45" filter="url(#smkL${seed})"/>`);
    f.raw(`<path d="${E.smooth(X.ribbon(C.slice(7), C.slice(7).map((_, i) => w0 * (0.5 + i * 0.3))))}" fill="#5a545c" opacity="0.3" filter="url(#smk${seed})"/>`);
    const Cs = C.slice(0, 11), Ws = Cs.map((_, i) => w0 * Math.max(0.12, 1 - i / 10));
    f.flat(X.ribbon(Cs, Ws.map(x => x + 3)), INK, { op: 0.8 }); f.flat(X.ribbon(Cs, Ws), ['#2a2428', '#3a3236', '#4a4246'][Math.floor(f.r() * 3)]);
    for (let k = -1; k <= 1; k++) f.line(X.offsetLine(Cs.slice(0, 9), t => k * w0 * 0.25 * (1 - t)), 0.8, k ? '#6a6266' : '#161214', { op: 0.6 });
    f.line(C.slice(8).map((q, i) => add(q, [Math.sin(i + ph) * 4, 0])), 1, '#6a646e', { op: 0.45 });
  };
  // a soft plume behind, then many fine strands fanning up out of short locks at the roots
  for (const [u, v, dx, l, w, op] of [[-0.4, -0.2, -120, 430, 120, 0.4], [-0.2, -0.46, -60, 470, 110, 0.42], [0.0, -0.54, -10, 380, 80, 0.36]]) {
    const r0 = hz([[u, v]])[0], ph = f.r() * 6, C = []; for (let i = 0; i <= 8; i++) { const tt = i / 8; C.push(add(r0, [dx * tt * tt + Math.sin(tt * 4 + ph) * 30 * tt, -l * tt])); }
    f.raw(`<path d="${E.smooth(X.ribbon(C, C.map((_, i) => w * (0.4 + i * 0.13))))}" fill="#3a343c" opacity="${op}" filter="url(#smkL${seed})"/>`);
  }
  for (let i = 0; i < 26; i++) {
    const t0 = i / 25, r0 = hz([[-0.46 + t0 * 0.6, 0.16 - Math.sin(t0 * 2.6) * 0.72]])[0], l = R(f, 150, 330), dx = -l * R(f, 0.1, 0.5), ph = f.r() * 6, C = [];
    for (let k = 0; k <= 8; k++) { const tt = k / 8; C.push(add(r0, [dx * tt * tt + Math.sin(tt * 7 + ph) * 16 * tt, -l * tt])); }
    const sp = X.spline(C, 6); f.line(sp, R(f, 1.2, 2.4), f.r() > 0.35 ? '#1e1a1e' : '#5e5458', { op: R(f, 0.6, 0.9) }); f.line(sp.slice(Math.floor(sp.length * 0.6)), 3, '#4a444c', { op: 0.2 });
  }
  for (const [u, v, a0, len, w0] of [[-0.44, -0.1, -2.3, 130, 16], [-0.38, -0.32, -2.0, 140, 15], [-0.22, -0.48, -1.85, 130, 14], [-0.04, -0.56, -1.7, 110, 12], [-0.42, 0.12, -2.6, 110, 13]]) lock(hz([[u, v]])[0], a0, len, w0);
  f.bone('head');
  const neck = [hz([[0.06, 0.46]])[0], [868, 356], [866, 384], [860, 400], [826, 404], [796, 398], [800, 376], hz([[-0.36, 0.2]])[0], hz([[-0.16, 0.36]])[0]];
  f.part(neck, SKC({ fill: mix(skin, face, 0.3), maxShade: 12, inkW: 0, inkHeavy: 0, cast: false }));
  f.line([hz([[0.06, 0.46]])[0], [868, 356], [866, 384]], 1.8, INK); f.line([hz([[-0.36, 0.2]])[0], [806, 350], [800, 376], [790, 396]], 1.8, INK);
  X.clipDraw(f, E.smooth(neck), () => {
    X.softTone(f, E.smooth(neck), [[[hz([[-0.3, 0.3]])[0], hz([[-0.02, 0.42]])[0], [818, 398], [790, 392]], '#000', 0.35, 6], [[hz([[-0.2, 0.4]])[0], hz([[0.1, 0.5]])[0], [866, 372], [820, 370]], '#1a1218', 0.35, 6]]);
    X.crease(f, [hz([[-0.18, 0.2]])[0], [834, 356], [852, 386]], 2.4, { op: 0.6, lit: skinL, col: skinS }); // the neck's long tendon to the notch
    f.line([hz([[0.12, 0.5]])[0], [868, 362], [866, 380]], 1.4, skinL, { op: 0.55 }); // the throat, the larynx
    X.crackNet(f, hz([[-0.2, 0.46]])[0], 1.4, 40, 1.4, { depth: 1 });
  });
  const hd = B.head(f, HC, H, hA, { skin: face, jaw: 0.86, chin: -0.04, nose: 0.94, hook: 0.08, mouth: 'set', blind: true, lips: true, faceShade: 0.8, faceHatch: false, jawShade: 0.22, noEar: false, gaunt: true, hairCol: '#2e282c', browCol: mix(face, '#000', 0.25), browW: 0.012, browDown: 0.0,
    hair: [[-0.46, 0.24], [-0.56, -0.04], [-0.5, -0.32], [-0.32, -0.52], [-0.06, -0.6], [0.18, -0.55], [0.3, -0.42], [0.2, -0.41], [0.06, -0.44], [-0.08, -0.37], [-0.18, -0.22], [-0.23, -0.02], [-0.3, 0.16]] });
  // model the face: the side plane toward the ear in shadow, the cheek hollow, the lit brow, nose bridge, cheekbone and chin
  { const fD = E.smooth(hd([[-0.3, -0.4], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.3, 0.37], [0.25, 0.47], [0.11, 0.53], [-0.07, 0.46], [-0.22, 0.27], [-0.3, 0.08], [-0.37, -0.13]]));
    X.softTone(f, fD, [[hd([[-0.4, -0.3], [-0.06, -0.2], [0.0, 0.1], [-0.02, 0.5], [-0.4, 0.4]]), '#2a1e26', 0.45, 10], [hd([[0.04, 0.08], [0.2, 0.12], [0.18, 0.26], [0.04, 0.24]]), '#2a1e26', 0.3, 6],
      [hd([[0.0, -0.46], [0.24, -0.44], [0.26, -0.24], [0.04, -0.24]]), '#e8e0d6', 0.35, 8], [hd([[0.28, -0.1], [0.36, -0.06], [0.37, 0.1], [0.3, 0.08]]), '#e8e0d6', 0.35, 4], [hd([[0.08, 0.0], [0.24, 0.02], [0.22, 0.08], [0.1, 0.07]]), '#e8e0d6', 0.3, 4], [hd([[0.16, 0.38], [0.28, 0.38], [0.26, 0.48], [0.16, 0.48]]), '#e8e0d6', 0.25, 5]]); }
  for (let i = 0; i < 18; i++) { const u = i / 17; f.line(hd([[0.2 - u * 0.42, -0.44 + u * 0.06], [0.04 - u * 0.46, -0.55 + u * 0.16], [-0.16 - u * 0.32, -0.54 + u * 0.56]]), i % 3 ? 1.1 : 1.6, i % 2 ? '#5a5256' : '#141012', { op: 0.65 }); } // strands combed back over the skull
  X.greyFace(f, hd, face, 0.94);
  // closed eyes: heavy lids with lashes, the lid crease, a hollow of shadow under each (suffering); brows lifted at the
  // inner ends and knotted between them (pain), the face otherwise still (serenity)
  for (const [c, w, s] of [[[0.12, -0.058], 0.06, 1], [[0.295, -0.062], 0.026, 0.6]]) {
    f.flat(hd(ell([c[0], c[1] - 0.008], w * 1.05, 0.03, 0.05, 12)), mix(face, '#5a4a50', 0.35), { op: 0.7 }); // the lid's curve
    f.line(hd([[c[0] - w, c[1] - 0.004], [c[0] - w * 0.2, c[1] + 0.016], [c[0] + w, c[1] + 0.006]]), 2.4 * s + 0.6, INK);
    for (let i = 0; i < 4; i++) { const u = c[0] - w * 0.6 + i * w * 0.4; f.line(hd([[u, c[1] + 0.012], [u + 0.006, c[1] + 0.03]]), 1, INK, { op: 0.7 }); }
    f.line(hd([[c[0] - w * 0.85, c[1] - 0.04], [c[0], c[1] - 0.05], [c[0] + w * 0.9, c[1] - 0.034]]), 1.2, INK, { op: 0.55 });
    f.flat(hd([[c[0] - w * 0.7, c[1] + 0.03], [c[0] + w * 0.8, c[1] + 0.026], [c[0] + w * 0.4, c[1] + 0.075], [c[0] - w * 0.4, c[1] + 0.07]]), '#3a2a32', { op: 0.35 });
  }
  f.stroke(hd([[0.02, -0.12], [0.1, -0.142], [0.18, -0.17]]), H * 0.03, '#2e282c', { op: 0.9 }); // the near brow, its inner end raised
  f.stroke(hd([[0.25, -0.17], [0.29, -0.15], [0.335, -0.138]]), H * 0.022, '#2e282c', { op: 0.9 });
  f.line(hd([[0.2, -0.17], [0.215, -0.13]]), 1.2, INK, { op: 0.6 }); f.line(hd([[0.225, -0.172], [0.235, -0.135]]), 1, INK, { op: 0.45 }); // knotted between the brows
  f.line(hd([[0.05, -0.215], [0.14, -0.24], [0.2, -0.235]]), 1, INK, { op: 0.4 }); // a line across the brow
  // lips parted on a word (the jaw bone moves them); a burn crust at the corner
  f.bone('jaw');
  f.flat(hd([[0.19, 0.285], [0.25, 0.276], [0.305, 0.283], [0.29, 0.302], [0.22, 0.302]]), '#1a1012', { op: 0.9 });
  f.flat(hd([[0.2, 0.305], [0.29, 0.305], [0.27, 0.33], [0.21, 0.332]]), mix(face, '#6a4a4e', 0.5), { op: 0.8 });
  f.bone('head');
  // fire on the face's edge, the face itself still whole: the jaw and cheek charred and crazed with violet threads, skin
  // peeling at the char line; the void: a clean round hole at the jaw's angle and a small one at the temple
  X.clipDraw(f, E.smooth(hd([[-0.3, -0.4], [0.2, -0.48], [0.36, -0.1], [0.33, 0.25], [0.13, 0.54], [-0.06, 0.48], [-0.22, 0.28], [-0.38, -0.1]])), () => {
    X.stains(f, E.smooth(hd([[-0.4, 0.04], [-0.12, 0.18], [-0.02, 0.5], [-0.3, 0.5]])), E.bbox(hd([[-0.5, -0.1], [0.4, 0.6]])), P.charS, 0.05, 3.2, -1.8, 49, 0.75);
    X.hairline(f, hd([[-0.14, 0.3], [-0.06, 0.38], [0.02, 0.44], [0.1, 0.5]]), 1.6);
    X.hairline(f, hd([[-0.05, 0.22], [0.02, 0.28], [0.0, 0.36]]), 1.2);
    X.hairline(f, hd([[0.26, -0.36], [0.22, -0.3], [0.24, -0.22]]), 1.1);
    f.flat(hd(ell([0.06, 0.14], 0.07, 0.04, 0.3, 10)), P.ashL, { op: 0.25 });
    X.flakes(f, hd([[-0.02, 0.32]])[0], 10, 10, 3, 0.6);
  });
  X.voidDisk(f, hd([[0.0, 0.2]])[0], 5, 5, 0, { rim: '#c8c0b8' });
  // ---- the Tooth: a long pale fang with growth lines, wire-bound, on a fine chain at her throat
  f.bone('tooth');
  const tc = [866, 452];
  f.line([[812, 394], [838, 420], add(tc, [-3, -30])], 1.8, P.ironL); f.line([add(tc, [2, -30]), [876, 408], [874, 384]], 1.8, P.ironL);
  const tooth = [add(tc, [-7, -30]), add(tc, [7, -30]), add(tc, [9, -6]), add(tc, [6, 22]), [...add(tc, [2, 46]), 1], add(tc, [-4, 22]), add(tc, [-8, -6])];
  f.part(tooth, { fill: P.bone, shadow: P.boneS, light: '#f0ead8', shade: 0.3, inkW: 1.4, inkHeavy: 2, hatch: false });
  for (let i = 0; i < 4; i++) f.line([add(tc, [-6, -16 + i * 10]), add(tc, [6, -18 + i * 10])], 0.9, P.boneD, { op: 0.7 });
  for (let i = 0; i < 3; i++) f.line([add(tc, [-9, -28 + i * 4]), add(tc, [9, -29 + i * 4])], 1.6, P.ironL);
  // ---- near arm and the praying hands: palms pressed, fingers up together, held close under the chin
  f.bone('arms');
  const am = X.muscleArm(f, SN, EN, WN, 38, 30, SKC(), '_n', { lit: skinL, vein: false, bones: ['arms', 'arms'] });
  f.bone('arms');
  X.clipDraw(f, E.smooth(am.fo), () => {
    const b0 = lp(EN, WN, 0.2, -6), b1 = lp(EN, WN, 0.72, -6);
    f.stroke([b0, lerp(b0, b1, 0.5), b1], 15, P.charS); f.stroke([lerp(b0, b1, 0.06), lerp(b0, b1, 0.5), lerp(b0, b1, 0.94)], 7.5, P.bone); f.line([lerp(b0, b1, 0.1), lerp(b0, b1, 0.9)].map(q => add(q, [0, 4])), 1.2, P.vioL, { op: 0.8 }); // the ulna cracked open
    f.line([lp(EN, WN, 0.15, 6), lp(EN, WN, 0.9, 5)], 1.2, skinS, { op: 0.6 }); f.line([lp(EN, WN, 0.4, 9), lp(EN, WN, 0.92, 7)], 1, skinS, { op: 0.5 }); // tendons to the wrist
    X.stains(f, E.smooth(am.fo), E.bbox(am.fo), P.charS, 0.04, 3, -1.5, 53, 0.7);
  });
  X.clipDraw(f, E.smooth(am.up), () => { X.crackNet(f, lp(SN, EN, 0.4, 4), 1.6, 70, 1.8, { depth: 1 }); X.ashCake(f, lerp(SN, EN, 0.4), 10, 30, 4); X.stains(f, E.smooth(am.up), E.bbox(am.up), P.charS, 0.04, 3, -1.4, 55, 0.7); });
  f.part(ell(lp(EN, WN, 0.94, -10), 6, 5, 0, 8), SKC({ inkW: 1, inkHeavy: 1.2, cast: false, maxShade: 3, fill: mix(skin, skinL, 0.3) })); // the wrist's bony knob
  const hAng = ang(EN, WN) - 0.3;
  X.openHand(f, add(WN, [10, -2]), hAng - 0.05, 104, { look: SKC({ fill: mix(skin, '#000', 0.28), maxShade: 6 }), back: false, flip: true, spread: -0.03, curl: 0.04, swell: 0.0, thumbAng: 0.25 });
  const hn = X.openHand(f, WN, hAng, 104, { look: SKC({ maxShade: 6 }), back: true, flip: true, spread: -0.03, curl: 0.06, curls: [0.06, 0.02, 0.04, 0.1], swell: 0.0, nail: '#3a3034', thumbAng: 0.25 });
  { const g = hn.fing[0]; f.part(tube([lerp(g.k2, g.k3, 0.2), g.k3], [g.W * 0.55, g.W * 0.45]), { fill: P.bone, shadow: P.boneS, shade: 0.3, inkW: 1.1, cast: false, hatch: false }); } // a fingertip burnt to the bone
  X.hairline(f, [hn.fing[0].k0, hn.fing[1].k0, hn.fing[2].k0, hn.fing[3].k0], 1.4);
  X.stains(f, E.smooth(ell(WN, 40, 30, 0, 12)), E.bbox(ell(WN, 60, 60, 0, 8)), P.charS, 0.05, 3, -1.8, 57, 0.6);
  X.ash(f, [880, 420], 12, 80, 220, 1.4); X.ash(f, [770, 380], 10, 60, 200, 1.2);
  X.placeFigure(f, i0, K0, FROM, TO);

  // ================= in front, at final size
  // a charred garland of flowers laid at her feet: her garden
  f.bone('root');
  for (let i = 0; i < 7; i++) { const c = [610 + i * 22 + R(f, -4, 4), platY + 2 + Math.sin(i) * 3]; f.line([c, add(c, [16, -4]), add(c, [30, 2])], 2.6, '#2a3028'); }
  for (let i = 0; i < 5; i++) { const c = [616 + i * 30 + R(f, -6, 6), platY - 2 + R(f, -3, 3)], r = R(f, 9, 13); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + i; f.part(ell(add(c, rot([r * 0.6, 0], a)), r * 0.55, r * 0.4, a, 8), { fill: k % 2 ? '#3a2e30' : '#4a3a3c', shadow: P.charS, shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false }); } f.flat(ell(c, r * 0.3, r * 0.3, 0, 8), P.charS); f.line(ell(c, r * 0.95, r * 0.9, 0, 10).slice(0, 5), 0.9, P.vioL, { op: 0.6 }); }
  // ---- flames in front: low off the platform's edge, kept off her shins and feet; sheets up the pyre's flanks
  f.bone('flames_front');
  X.flameSheet(f, [[590, platY + 34], [660, platY + 30], [720, platY + 30]], [[600, 150, 70, -0.15], [660, 90, 60, -0.1], [710, 60, 44, 0]]);
  X.flameSheet(f, [[900, platY + 30], [950, platY + 32], [1000, platY + 36]], [[930, 70, 50, 0.1], [985, 160, 70, 0.15]]);
  X.flameSheet(f, [[200, 1540], [330, 1470], [460, 1410], [580, 1366]], [[230, 170, 110, -0.08], [320, 240, 120, -0.04], [420, 190, 110, 0.0], [520, 260, 120, -0.02], [580, 170, 90, 0.04]]);
  X.flameSheet(f, [[1000, 1366], [1130, 1410], [1260, 1470], [1400, 1540]], [[1020, 220, 110, 0.02], [1100, 270, 120, 0.04], [1190, 210, 110, 0.06], [1280, 180, 110, 0.06], [1360, 140, 100, 0.08]]);
  // ---- the spreading fire: one long tongue curling out of the pyre toward the party (the attack bone)
  f.bone('flame_reach');
  X.blackFlame(f, [1000, platY - 20], 360, 96, { lean: 0.7, phase: 1.2, dir: [0.5, -1] });
  // ---- the ground: ash heaps, the bones of those burned before her, pilgrims' candle stubs
  f.bone('root');
  for (const [c, w, h] of [[[200, gy], 280, 44], [[1350, gy], 300, 50], [[780, gy], 420, 30]]) X.ashHeap(f, c, w, h);
  { const sk = [1220, gy - 34]; // a skull half sunk in the ash, a clean round hole through its crown
    const sp = [add(sk, [-30, 16]), add(sk, [-34, -6]), add(sk, [-22, -30]), add(sk, [6, -36]), add(sk, [30, -24]), add(sk, [38, -2]), add(sk, [34, 12]), add(sk, [20, 18]), add(sk, [14, 30]), add(sk, [-6, 30]), add(sk, [-10, 20])];
    f.part(sp, { fill: P.bone, shadow: P.boneS, light: '#efe8d6', shade: 0.35, inkW: 1.5, cast: false });
    f.flat(ell(add(sk, [16, -2]), 9, 8, 0, 10), '#141012'); f.flat([add(sk, [32, 6]), add(sk, [38, 10]), add(sk, [34, 16])], '#141012'); X.voidDisk(f, add(sk, [-8, -18]), 8);
    for (let i = 0; i < 4; i++) f.line([add(sk, [6 + i * 6, 22]), add(sk, [6 + i * 6, 30])], 1.2, P.boneS);
    X.ashHeap(f, [1216, gy], 130, 20); }
  f.part(limb([380, gy - 16], [520, gy - 30], 16, 14, { steps: 6 }), { fill: P.bone, shadow: P.boneS, shade: 0.35, inkW: 1.3, cast: false });
  for (const e of [[380, gy - 16], [520, gy - 30]]) f.part(ell(e, 12, 10, 0, 10), { fill: P.bone, shadow: P.boneS, shade: 0.35, inkW: 1.2, cast: false });
  for (const [x, h] of [[300, 46], [336, 30], [1090, 40], [1130, 56], [1166, 28]]) { const b = [x, gy - 4]; f.part([add(b, [-9, 0]), add(b, [9, 0]), add(b, [8, -h]), add(b, [-8, -h])].map(q => [...q, 1]), { fill: P.wax, shadow: P.waxD, shade: 0.3, inkW: 1.1, cast: false, hatch: false }); f.flat([add(b, [-8, -h + 4]), add(b, [-12, -h + 18]), add(b, [-9, -h + 24])], P.wax); X.blackFlame(f, add(b, [0, -h - 1]), 30, 9, { edgeW: 1.4, noFork: true, single: true }); }
  X.ash(f, [700, 1240], 18, 260, 500, 1.6); X.ash(f, [980, 760], 12, 200, 400, 1.4);
  return f;
}

// ------------------------------------------------------------------ CINDER HOUND (cast, large, 1.1 long)
// A lean hound of grey cinders held together by black flame, nose down on a scent. Built like a lurcher: deep narrow
// chest, tucked loin, long thighs, carried low; the head stretched forward and down, the nose almost on the floor.
// Fire: the whole body is cinder (clinker plates crazed and flaking) with black flame showing between the plates, ash
// trailing off the back and falling from the belly, paws leaving ashprints. Void: the flame between the plates, violet
// embers for eyes, a clean round hole through the flank and another through the ear.
// Rig: spine_1 (root, the hindquarters) > spine_2 (chest) > neck > head > jaw ; spine_1 > tail_1 > tail_2 ;
// legs leg_<fn|ff|hn|hf>_1..3. Motion: idle sniffing (neck and head dip); attack a lunge and bite (jaw opens).
function cinderHound() {
  const [CW, CH] = TIERS.large, seed = 1304;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const gy = f.o.groundY;
  const CIN = (o = {}) => Object.assign({ fill: P.cinder, shadow: P.cinderD, light: P.cinderL, shade: 0.38, tex: 'craze' + seed, texOp: 0.55 }, o);
  // front: H point of the shoulder, K elbow (back under the chest), A wrist, T paw; hind: H hip, K stifle, A hock, T paw
  const LEG = {
    hf: { H: [272, 690], K: [344, 824], A: [270, 934], T: [300, gy] },
    ff: { H: [614, 722], K: [592, 836], A: [620, 978], T: [648, gy] },
    hn: { H: [250, 700], K: [320, 836], A: [226, 942], T: [250, gy] },
    fn: { H: [600, 730], K: [566, 842], A: [582, 986], T: [608, gy] },
  };
  const NK = [576, 650], HC = [772, 920], hA = 0.8;
  f.joint('spine_1', [280, 690]).joint('spine_2', [440, 680], 'spine_1').joint('neck', NK, 'spine_2').joint('head', [700, 830], 'neck').joint('jaw', add(HC, rot([-10, 26], hA)), 'head');
  f.joint('tail_1', [168, 668], 'spine_1').joint('tail_2', [104, 790], 'tail_1');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.H, par).joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }

  // one leg: three bones, each a muscled cinder segment overlapping the next; the paw bears the weight
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', look = CIN(far ? { fill: mix(P.cinder, '#000', 0.3), light: P.cinder } : {});
    const seg = (a, b, wa, wb, o, blend) => {
      const sh = limb(a, b, wa, wb, Object.assign({ steps: 12, capK: 0.9 }, o));
      // a near thigh or upper arm belongs to the body: no ink where it lies on the flank, ink only below the body line
      X.cinders(f, sh, 58, blend ? Object.assign({}, look, { inkW: 0, inkHeavy: 0, cast: false }) : look, { w: 1.8 });
      if (blend) { let run = []; for (const q of [...sh, sh[0]]) { if (q[1] > blend) run.push(q); else { if (run.length > 1) f.line(run, 1.8, INK); run = []; } } if (run.length > 1) f.line(run, 1.8, INK); }
    };
    if (part & 1) { f.bone(`leg_${k}_1`); const bl = 0; if (front) seg(L.H, L.K, 90, 50, { p: [[0.55, 0.26, 0.2]], q: [[0.25, 0.14, 0.18]] }, bl); else seg(L.H, L.K, 150, 64, { p: [[0.4, 0.32, 0.22]], q: [[0.45, 0.2, 0.2]] }, bl); }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      if (front) seg(L.K, L.A, 46, 28, { q: [[0.2, 0.24, 0.16]] }); else seg(L.K, L.A, 74, 30, { p: [[0.22, 0.36, 0.18]] });
      const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]], j = front ? L.K : L.A;
      f.part([add(j, mul(nk, front ? 8 : 4)), add(add(j, mul(nk, 24)), mul(dk, -8)), add(add(j, mul(nk, 22)), mul(dk, 10)), add(j, mul(dk, 16))], CIN({ fill: mix(P.cinder, '#000', far ? 0.35 : 0.1), inkW: 1.1, inkHeavy: 1.5, cast: false })); // elbow or hock point
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T, pt = [T[0] - 6, gy - 30];
      X.cinders(f, K.chain([lerp(L.A, pt, -0.12), L.A, lerp(L.A, pt, 0.55), pt], [34, 32, 28, 32]), 40, look, { w: 1.6 });
      const Xp = u => T[0] + u * 30;
      f.part([[Xp(-0.9), gy - 3, 1], [Xp(-1.0), gy - 24], [Xp(-0.5), gy - 38], [Xp(0.3), gy - 38], [Xp(0.9), gy - 28], [Xp(1.3), gy - 14], [Xp(1.4), gy - 2, 1]], look);
      for (let i = 0; i < 3; i++) { const tx = Xp(0.1 + i * 0.4); f.part([[tx - 11, gy - 2, 1], [tx - 12, gy - 20], [tx - 3, gy - 28], [tx + 8, gy - 24], [tx + 13, gy - 12], [tx + 12, gy - 2, 1]], CIN({ fill: mix(look.fill, '#000', 0.12), inkW: 1, inkHeavy: 1.4, cast: false })); f.part([[tx + 8, gy - 14], [tx + 20, gy - 8], [tx + 13, gy - 3]], { fill: P.charD, shade: 0.3, inkW: 0.9, cast: false, hatch: false }); }
      X.seam(f, [lp(L.A, pt, 0.15, 2), lp(L.A, pt, 0.5, -2), lp(L.A, pt, 0.85, 1)], 1.3);
      f.bone('root'); X.ashprint(f, [T[0] - 50, gy + 3], 1.4); f.bone(`leg_${k}_3`);
    }
  };
  // ---- far legs and the tail behind the body
  leg('hf', true); leg('ff', true);
  f.bone('tail_1');
  X.cinders(f, K.chain([[190, 664], [152, 688], [126, 736], [114, 792]], [46, 40, 34, 30]), 44, CIN());
  f.bone('tail_2');
  X.cinders(f, K.chain([[116, 770], [104, 840], [114, 896], [138, 928]], [32, 26, 20, 14]), 36, CIN());
  X.blackFlame(f, [136, 930], 70, 22, { lean: 0.4, noFork: true }); // the tail's tip is all flame
  // ---- near upper legs, under the body's edge: only the stifle and the elbow show below it
  leg('hn', false, 1); leg('fn', false, 1);
  // ---- body: deep narrow chest, the loin arched, the belly tucked hard up to the flank; cut at the loin
  const torso = [[160, 690], [178, 656], [220, 640], [280, 626], [330, 618], [390, 624], [440, 632], [500, 618], [548, 604], [586, 612], [618, 650], [636, 712], [630, 780], [610, 840], [580, 866], [520, 868], [470, 856], [430, 826], [392, 786], [350, 770], [306, 772], [262, 790], [214, 794], [178, 770], [158, 730]];
  const cut = [400, 700], cd = [1, 0];
  const flankHole = [[300, 716], 24];
  split(f, () => {
    // the cinder cracks along the body's form: the topline, rib by rib round the barrel of the chest, the shoulder blade
    // laid back from the withers, the line of the haunch over the hip, the belly's edge rising into the tuck
    const ribs = []; for (let i = 0; i < 5; i++) ribs.push([[450 + i * 24, 636 - i * 3], [462 + i * 22, 720], [458 + i * 20, 800], [446 + i * 16, 852 - i * 4]]);
    const lines = [[[170, 690], [240, 666], [330, 656], [420, 664], [500, 650], [570, 640]], ...ribs, [[540, 616], [562, 676], [592, 736], [606, 770]], [[508, 626], [532, 690], [566, 742]], [[184, 676], [222, 716], [252, 766]], [[300, 646], [340, 704], [384, 770]], [[436, 828], [500, 852], [580, 858]]];
    X.cutHoles(f, [flankHole], () => X.cinders(f, torso, 80, CIN(), { lines, w: 2.4, lineW: i => (i >= 1 && i <= 5 ? 1.2 : 2.4), maxShade: 26, tones: [[[[392, 800], [470, 860], [600, 880], [640, 790], [560, 800], [460, 800]], '#000', 0.55, 14], [[[160, 760], [260, 790], [300, 810], [180, 810]], '#000', 0.45, 12], [[[200, 630], [540, 600], [540, 660], [220, 680]], P.ashL, 0.3, 10], [[[530, 640], [590, 640], [610, 740], [560, 760]], P.ashL, 0.25, 12], [[[190, 660], [250, 650], [260, 740], [200, 750]], P.ashL, 0.22, 12]] }), { shape: E.smooth(torso) });
  }, [['spine_1', side(cut, mul(cd, -1), 50)], ['spine_2', side(cut, cd, 50)]]);
  // black flame licking off the back between the plates, ash streaming back off it and falling from the belly
  f.bone('spine_1'); X.flames(f, [[190, 652], [250, 636], [330, 624], [400, 630]], 4, 60, 130, 40, { side: -1, lean: -0.7, rise: 0.9, band: true, edgeW: 2 });
  X.ash(f, [260, 600], 12, 120, 160, 1.2);
  f.bone('spine_2'); X.flames(f, [[410, 632], [470, 628], [540, 608]], 3, 60, 140, 40, { side: -1, lean: -0.7, rise: 0.9, band: true, edgeW: 2 });
  for (let i = 0; i < 6; i++) { const q = [380 + i * 36, 830 + (i % 2) * 14 + i * 4]; f.flat([q, add(q, [5, 2]), add(q, [2, 7])], P.ashL, { op: 0.7 }); }
  // ---- neck: long, stretched forward and down after the scent
  f.bone('neck');
  const neck = [[528, 612], [574, 602], [626, 632], [684, 700], [734, 770], [762, 836], [732, 872], [694, 858], [658, 818], [624, 778], [600, 740], [580, 712], [556, 680]];
  X.cinders(f, neck, 70, CIN(), { maxShade: 18, after: () => X.softTone(f, E.smooth(neck), [[[[600, 760], [700, 860], [720, 880], [620, 800]], '#000', 0.45, 8]]) }); if (0) X.cinders(f, neck, 34, CIN(), { after: () => X.softTone(f, E.smooth(neck), [[[[600, 760], [700, 860], [720, 880], [620, 800]], '#000', 0.45, 8]]) });
  X.flames(f, [[560, 610], [620, 634], [676, 690]], 3, 50, 110, 36, { side: -1, lean: -0.7, rise: 0.9, band: true, edgeW: 2 }); // flame streaming back off the hackles
  // ---- head: a sighthound's long skull carried low, the nose down on the floor; the jaw closed on its hinge
  const HF = frame(HC, hA, 1);
  f.bone('head');
  f.flat(HF([[-30, 20], [20, 26], [80, 30], [126, 30], [120, 50], [60, 56], [0, 52], [-34, 40]]), '#0a0709'); // the gape behind the jaw, dark
  f.line(HF([[0, 40], [60, 44], [110, 40]]), 1.6, P.vioD, { op: 0.8 });
  f.bone('jaw');
  const jaw = HF([[-34, 22], [0, 34], [56, 40], [104, 40], [120, 44], [112, 54], [80, 58], [30, 56], [-12, 50], [-38, 36]]);
  X.cinders(f, jaw, 34, CIN({ fill: mix(P.cinder, '#000', 0.15) }));
  for (const u of [92, 104]) { const q = HF([[u, 38]])[0]; f.part([add(q, rot([-3, 0], hA)), add(q, rot([3, 0], hA)), add(q, rot([0, -9], hA))], { fill: P.bone, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false }); }
  f.bone('head');
  const skull = HF([[-70, -10], [-62, -40], [-36, -58], [-2, -60], [24, -50], [40, -34], [86, -24], [126, -14], [146, 0], [144, 18], [126, 30], [92, 34], [50, 34], [10, 32], [-24, 34], [-56, 20]]);
  X.cinders(f, skull, 46, CIN(), { after: () => X.softTone(f, E.smooth(skull), [[HF([[-60, 10], [40, 20], [100, 30], [40, 36], [-50, 30]]), '#000', 0.4, 6]]) });
  f.stroke(HF([[30, -48], [42, -34], [44, -20]]), 3, P.flame, { op: 0.8 }); // the stop
  f.stroke(HF([[22, 32], [70, 34], [110, 32], [134, 26]]), 2.6, P.flame, { op: 0.9 }); // the lip line
  // the eye: a deep socket with a violet ember in it (no light thrown); the nose pad, flared, sniffing
  f.flat(HF([[4, -32], [30, -36], [38, -22], [10, -18]]), '#050406');
  f.flat(ell(HF([[22, -27]])[0], 5, 2.6, hA, 8), P.vio); f.flat(ell(HF([[23, -27]])[0], 2, 1.2, hA, 6), P.vioL);
  f.part(HF([[132, -10], [150, -4], [152, 12], [140, 20], [128, 8]]), { fill: P.charD, light: P.charL, shade: 0.3, inkW: 1.2, cast: false });
  f.flat(ell(HF([[146, 8]])[0], 3, 2, hA, 6), '#000');
  for (let i = 0; i < 3; i++) { const q = add(HF([[150, 16]])[0], [i * 10 - 6, 8 + i * 3]); f.flat(ell(q, 3, 1.6, 0, 6), P.ashL, { op: 0.6 }); } // ash puffed off the floor by the sniff
  // the ear: a rose ear folded back, a clean round hole through it
  const ear = HF([[-30, -52], [-56, -80], [-92, -80], [-108, -58], [-86, -50], [-56, -40]]);
  X.cutHoles(f, [[HF([[-70, -66]])[0], 8]], () => X.cinders(f, ear, 30, CIN({ fill: mix(P.cinder, '#000', 0.1) })), { shape: E.smooth(ear) });
  X.ash(f, HF([[-90, -70]])[0], 6, 30, 80, 0.9);
  // ---- near lower legs, in front
  leg('hn', false, 6); leg('fn', false, 6);
  f.bone('root');
  f.flat(ell([430, gy + 2], 330, 8, 0, 20), P.charS, { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ CANDLE WRAITH (cast, small, 0.6)
// A skull in a black flame: a penitent's skull floating at chest height, wreathed in black fire with violet edges that
// gives no light, wax running from its jaw like a candle's, a small iron candle-ring crown with five prickets on the
// crown of the skull, each stub burning black. Fire: the bone charred and crazed, ash rising. Void: the flame, a violet
// ember deep in each socket, a clean round hole through the temple. "Blow it out and it lights again."
// Rig: skull (root) > jaw > wax ; skull > crown ; flame_back, flame_front (skull). Motion: idle flickering (flame bones);
// attack a flare of black fire (flame_front swings out, jaw drops).
function candleWraith() {
  const [CW, CH] = TIERS.small, seed = 1306;
  const f = new Fig(X.base(seed, CH, { grimeY: 2000 })); X.textures(f);
  const gy = f.o.groundY, s = 168, SC = [290, 410], sa = 0.12; // skull centre, size, tilt (chin dropped a little)
  const F = frame(SC, sa, s);
  const BONE = (o = {}) => Object.assign({ fill: '#b8ae9a', shadow: '#3a3030', light: '#e6dcc6', shade: 0.4, tex: 'craze' + seed, texOp: 0.45 }, o);
  const jp = F([[-0.07, 0.12]])[0], ja = 0.1; // jaw hinge and how far it hangs open
  const J = pts => F(pts).map(q => add(jp, rot(sub(q, jp), ja)));
  f.joint('skull', SC).joint('jaw', jp, 'skull').joint('crown', F([[0, -0.4]])[0], 'skull').joint('flame_back', F([[-0.2, -0.3]])[0], 'skull').joint('flame_front', F([[0.2, 0.1]])[0], 'skull');

  // ---- the flame it burns in: a sheet rising off the back and the crown, tongues streaming up and back
  f.bone('flame_back');
  X.flameSheet(f, F([[-0.56, 0.3], [-0.5, -0.1], [-0.3, -0.36], [0.0, -0.44], [0.3, -0.34]]), [[SC[0] - 70, 200, 70, -0.25], [SC[0] - 20, 260, 80, -0.15], [SC[0] + 30, 220, 70, -0.1], [SC[0] - 110, 150, 60, -0.3], [SC[0] + 70, 140, 56, -0.05]].map(([x, h, w, l]) => [x, h, w, l]), { edgeW: 2.6 });
  for (const [b, h, w, l] of [[F([[-0.5, 0.3]])[0], 150, 40, -0.4], [F([[-0.4, 0.5]])[0], 120, 34, -0.5]]) X.blackFlame(f, b, h, w, { lean: l });
  // ---- the jaw (independent review: an anatomical mandible, not a block): the ramus rising behind the cheekbone to its
  // hinge in front of the ear, the angle, the coronoid under the arch, the body running forward to a squared chin; the
  // lower teeth set in it, some gone; wax poured over the chin and hanging in long runs (drawn under the skull)
  f.bone('jaw');
  const jaw = J([[-0.1, 0.1], [-0.02, 0.1], [0.04, 0.2], [0.08, 0.14], [0.13, 0.17], [0.16, 0.31], [0.24, 0.33], [0.36, 0.33], [0.42, 0.35], [0.44, 0.44], [0.4, 0.52, 1], [0.3, 0.54], [0.14, 0.53], [0.02, 0.5], [-0.08, 0.47, 1], [-0.12, 0.36], [-0.12, 0.2]]);
  f.part(jaw, BONE({ maxShade: 14 }));
  X.clipDraw(f, E.smooth(jaw), () => {
    X.softTone(f, E.smooth(jaw), [[J([[-0.14, 0.1], [0.0, 0.1], [0.02, 0.5], [-0.14, 0.5]]), '#000', 0.35, 6], [J([[0.2, 0.36], [0.42, 0.38], [0.4, 0.46], [0.2, 0.44]]), '#fff', 0.25, 4]]);
    X.crease(f, J([[0.06, 0.3], [0.02, 0.4], [0.04, 0.48]]), 1.4, { col: '#3a3030', lit: '#e6dcc6', op: 0.5 }); // the masseter's ridge
    f.flat(ell(J([[0.3, 0.44]])[0], 3, 2.4, 0, 6), '#1a1414', { op: 0.7 }); // the mental foramen
    X.stains(f, E.smooth(jaw), E.bbox(jaw), P.charS, 0.04, 3, -1.5, 63, 0.8);
  });
  for (let i = 0; i < 7; i++) { const q = J([[0.2 + i * 0.034, 0.33]])[0]; if (i === 2 || i === 5) continue; const w = i < 3 ? 4.2 : 3.2, h = i < 3 ? 10 : 12; f.part([add(q, rot([-w, 1], sa)), add(q, rot([w, 1], sa)), add(q, rot([w * 0.8, -h], sa)), add(q, rot([0, -h - 2], sa)), add(q, rot([-w * 0.8, -h], sa))], BONE({ fill: '#cfc5ae', inkW: 0.8, inkHeavy: 1, cast: false, maxShade: 3 })); }
  // wax: a coat over the chin, pouring into long runs, each ending in a drop; older runs gone grey with ash
  const wax = J([[0.04, 0.46], [0.2, 0.5], [0.42, 0.44], [0.46, 0.54], [0.36, 0.6], [0.12, 0.6], [-0.02, 0.56]]);
  f.part(wax, { fill: P.wax, shadow: P.waxD, light: '#fffaf0', shade: 0.32, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, maxShade: 8 });
  for (const [u, l, w] of [[0.02, 46, 12], [0.1, 104, 15], [0.18, 30, 10], [0.26, 76, 13], [0.34, 54, 12], [0.41, 26, 9]]) {
    const tt = J([[u, 0.57]])[0], e = add(tt, [R(f, -6, 6), l]), bead = R(f, 0.3, 0.6);
    const run = [add(tt, [-w / 2, -6]), add(tt, [w / 2, -6]), add(lerp(tt, e, bead), [w * 0.3, -4]), add(lerp(tt, e, bead), [w * 0.5, 6]), add(lerp(tt, e, bead + 0.12), [w * 0.26, 0]), add(e, [w * 0.34, -6]), add(e, [w * 0.1, 8]), add(e, [-w * 0.3, 2]), add(lerp(tt, e, bead + 0.1), [-w * 0.3, 0]), add(lerp(tt, e, bead), [-w * 0.46, 2]), add(lerp(tt, e, 0.2), [-w * 0.34, 0])];
    f.part(run, { fill: u > 0.25 ? mix(P.wax, P.ashD, 0.35) : P.wax, shadow: P.waxD, light: '#fffaf0', shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false, maxShade: 4 });
    f.line([add(tt, [w * 0.2, 0]), add(lerp(tt, e, 0.7), [w * 0.14, 0])], 1.4, '#ffffff', { op: 0.6 });
    f.flat(ell(add(e, [0, 22 + l * 0.08]), w * 0.22, w * 0.3, 0, 8), P.wax, { op: 0.9 }); // the drop about to fall
  }
  // ---- the skull, three-quarter from the side: the vault, the frontal bone dropping to the brow ridge, the nasal bones,
  // the maxilla and its tooth row, the cheekbone and its arch back to the ear, the mastoid, the occiput
  f.bone('skull');
  const cran = F([[-0.52, 0.02], [-0.54, -0.16], [-0.46, -0.36], [-0.28, -0.5], [-0.04, -0.55], [0.18, -0.5], [0.33, -0.36], [0.4, -0.2], [0.44, -0.11, 1], [0.41, -0.05], [0.45, 0.02], [0.48, 0.1], [0.46, 0.14], [0.49, 0.18, 1], [0.46, 0.24], [0.43, 0.3, 1], [0.3, 0.31], [0.16, 0.3], [0.12, 0.24], [0.04, 0.2], [-0.1, 0.18], [-0.16, 0.24], [-0.22, 0.3, 1], [-0.28, 0.2], [-0.4, 0.16]]);
  const crD = E.smooth(cran);
  X.cutHoles(f, [[F([[-0.1, -0.16]])[0], 13]], () => {
    f.part(cran, BONE({ maxShade: 22 }));
    X.clipDraw(f, crD, () => {
      // form: the vault turning away into shadow behind, the temple's hollow, the forehead and cheekbone catching light
      X.softTone(f, crD, [[F([[-0.6, -0.4], [-0.3, -0.3], [-0.2, 0.3], [-0.6, 0.3]]), '#000', 0.42, 10], [F([[-0.24, -0.26], [0.1, -0.24], [0.12, 0.08], [-0.2, 0.12]]), '#2a2020', 0.4, 8], [F([[0.0, -0.5], [0.3, -0.4], [0.34, -0.2], [0.06, -0.3]]), '#ffffff', 0.3, 8], [F([[0.14, 0.08], [0.32, 0.1], [0.3, 0.16], [0.14, 0.16]]), '#ffffff', 0.25, 4]]);
      X.crease(f, F([[-0.36, -0.2], [-0.2, -0.34], [0.04, -0.36], [0.24, -0.28], [0.32, -0.14]]), 1.6, { op: 0.55, col: '#3a3030', lit: '#e6dcc6' }); // the temporal line
      f.line(F([[0.02, -0.55], [0.0, -0.44], [0.04, -0.36], [0.0, -0.26], [0.04, -0.2]]), 1, INK, { op: 0.75 }); // the coronal suture
      f.line(F([[-0.36, -0.4], [-0.32, -0.3], [-0.36, -0.2], [-0.32, -0.1], [-0.36, 0.0]]), 1, INK, { op: 0.65 }); // the lambdoid
      f.line(F([[-0.28, 0.06], [-0.16, -0.04], [-0.02, -0.06], [0.08, 0.02]]), 1, INK, { op: 0.6 }); // the squamous suture over the ear
      f.flat(F([[-0.2, 0.08], [-0.15, 0.06], [-0.13, 0.11], [-0.18, 0.13]]), '#120e10'); // the ear opening
      f.part(F([[-0.24, 0.14], [-0.18, 0.15], [-0.2, 0.3], [-0.25, 0.22]]), BONE({ fill: '#c4baa4', inkW: 0.9, inkHeavy: 1.1, cast: false, maxShade: 3 })); // the mastoid
      X.crackNet(f, F([[0.12, -0.46]])[0], 1.9, 60, 1.6, { depth: 1 }); X.crackNet(f, F([[-0.42, -0.12]])[0], 1.2, 50, 1.4, { depth: 1 });
      X.stains(f, crD, E.bbox(cran), P.charS, 0.03, 3.0, -1.7, 61, 0.9); // charred patches
      X.flakes(f, F([[-0.3, -0.24]])[0], 30, 20, 4, 0.8);
    });
  }, { shape: crD });
  // the far orbit: a sliver past the bridge of the nose
  f.part(F([[0.43, -0.12], [0.47, -0.1], [0.47, -0.01], [0.44, 0.0]]), { fill: '#100c0e', shade: 0.2, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false, maxShade: 2 });
  // the near orbit: a rounded square under the brow, its lateral rim a ridge of bone behind it; a violet ember far down
  const sock = F([[0.16, -0.13, 1], [0.27, -0.155], [0.37, -0.13, 1], [0.39, -0.03], [0.37, 0.06, 1], [0.27, 0.08], [0.18, 0.06, 1], [0.15, -0.03]]);
  f.part(sock, { fill: '#100c0e', shade: 0.2, inkW: 1.8, inkHeavy: 2.6, cast: false, hatch: false, maxShade: 4 });
  f.flat(F([[0.2, -0.1], [0.34, -0.11], [0.32, -0.04], [0.22, -0.03]]), '#241a1e', { op: 0.6 }); // the orbit's roof, catching a little
  f.flat(ell(F([[0.28, 0.0]])[0], 5, 3, sa, 8), P.vio); f.flat(ell(F([[0.285, -0.004]])[0], 2, 1.4, sa, 6), P.vioL);
  f.stroke(F([[0.14, -0.15], [0.28, -0.2], [0.42, -0.13]]), 6, '#e6dcc6', { op: 0.55 }); // the lit brow ridge
  f.part(F([[0.13, -0.12], [0.17, -0.1], [0.17, 0.06], [0.12, 0.1], [0.1, 0.0]]), BONE({ fill: '#c8bea8', inkW: 1, inkHeavy: 1.4, cast: false, maxShade: 3 })); // the lateral orbital rim
  // the nasal aperture: pear-shaped, the nasal bones over it, the spine below; the bridge between the orbits
  f.part(F([[0.43, 0.04], [0.47, 0.06], [0.48, 0.13], [0.46, 0.18], [0.42, 0.17], [0.41, 0.1]]), { fill: '#120e10', inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, maxShade: 3 });
  f.line(F([[0.41, -0.04], [0.45, 0.01], [0.47, 0.05]]), 1.6, '#efe6d0', { op: 0.7 });
  f.line(F([[0.445, 0.12], [0.45, 0.17]]), 1, '#c4baa4', { op: 0.8 }); // the septum
  // the cheekbone and its arch running back to the ear; the maxilla with the roots of the teeth showing as ridges
  f.part(F([[0.14, 0.07], [0.3, 0.09], [0.34, 0.14], [0.28, 0.2], [0.14, 0.22], [0.0, 0.19], [-0.14, 0.15], [-0.15, 0.11], [0.0, 0.12]]), BONE({ fill: '#cdc3ad', inkW: 1.1, inkHeavy: 1.6, cast: false, maxShade: 6 }));
  f.flat(F([[0.0, 0.19], [0.14, 0.22], [0.12, 0.26], [0.02, 0.23]]), '#1a1414', { op: 0.6 }); // shadow under the arch
  for (let i = 0; i < 5; i++) f.line(F([[0.24 + i * 0.045, 0.22], [0.235 + i * 0.045, 0.29]]), 1, '#3a3030', { op: 0.45 }); // tooth roots
  for (let i = 0; i < 7; i++) { const q = F([[0.2 + i * 0.036, 0.3]])[0]; if (i === 4) continue; const w = i > 4 ? 3.6 : i > 1 ? 4.2 : 4.6, h = i > 4 ? 11 : 12; f.part([add(q, rot([-w, -1], sa)), add(q, rot([w, -1], sa)), add(q, rot([w * 0.8, h], sa)), add(q, rot([0, h + 2], sa)), add(q, rot([-w * 0.8, h], sa))], BONE({ fill: i % 3 ? '#cfc5ae' : '#b8ae96', inkW: 0.8, inkHeavy: 1, cast: false, maxShade: 3 })); } // upper teeth, a gap
  // wax from the candles above, poured over the vault: a glossy cap running down the forehead and the temple in drips
  const wcap = F([[-0.38, -0.36], [-0.2, -0.5], [0.06, -0.54], [0.26, -0.46], [0.32, -0.36], [0.28, -0.3], [0.24, -0.2], [0.2, -0.3], [0.12, -0.36], [0.06, -0.24], [0.0, -0.36], [-0.12, -0.4], [-0.18, -0.26], [-0.24, -0.38], [-0.34, -0.3]]);
  f.part(wcap, { fill: P.wax, shadow: P.waxD, light: '#fffaf0', shade: 0.3, inkW: 1.2, inkHeavy: 1.5, cast: false, hatch: false, maxShade: 6, tex: 'craze' + seed, texOp: 0.2 });
  for (const [u, v] of [[0.24, -0.2], [0.06, -0.24], [-0.18, -0.26]]) f.part(ell(F([[u, v + 0.02]])[0], 4.5, 6, 0, 8), { fill: P.wax, shadow: P.waxD, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false, maxShade: 2 });
  f.line(F([[-0.2, -0.47], [0.04, -0.51], [0.2, -0.45]]), 2, '#ffffff', { op: 0.55 });
  // ---- the candle-ring crown: an iron hoop round the crown with five prickets, each stub burning black
  f.bone('crown');
  const rc = F([[-0.04, -0.38]])[0], rx = s * 0.44, ry = s * 0.12, ra = sa - 0.05;
  const hoop = ell(rc, rx, ry, ra, 32);
  f.line(hoop.slice(16).concat([hoop[0]]), 7, INK); f.line(hoop.slice(16).concat([hoop[0]]), 4.5, P.iron); // back half (behind the dome)
  const pr = [0.1, 0.3, 0.5, 0.7, 0.9].map(t => ell(rc, rx, ry, ra, 40)[Math.round(20 + t * 20) % 40]);
  pr.forEach((b, i) => {
    const h = [44, 60, 36, 54, 30][i], top = add(b, [0, -14]);
    f.line([b, top], 3, P.iron);
    f.part([add(top, [-8, 0]), add(top, [8, 0]), add(top, [7, -h]), add(top, [-7, -h])].map(q => [...q, 1]), { fill: P.wax, shadow: P.waxD, shade: 0.3, inkW: 1.1, cast: false, hatch: false });
    f.flat([add(top, [-5, -h + 3]), add(top, [-9, -h + 14]), add(top, [-6, -h + 20])], P.wax);
    f.line([add(top, [0, -h]), add(top, [1, -h - 6])], 1.6, INK); X.blackFlame(f, add(top, [0, -h - 4]), 40, 11, { edgeW: 1.5, noFork: true });
  });
  f.line(hoop.slice(0, 17), 7, INK); f.line(hoop.slice(0, 17), 4.5, P.iron); f.line(hoop.slice(2, 10), 1.2, P.ironL, { op: 0.7 }); // front half
  for (const q of [hoop[4], hoop[12]]) f.rivet(q, 2.6, P.ironL);
  // ---- flames in front: tongues licking up the cheek and off the jaw (never over the socket)
  f.bone('flame_front');
  X.flames(f, F([[-0.52, 0.12], [-0.52, -0.14], [-0.42, -0.36]]), 3, 70, 150, 34, { side: -1, lean: -0.3, band: true, edgeW: 2.2 });
  X.ash(f, F([[-0.1, -0.5]])[0], 14, 100, 230, 1.1);
  // ---- its shadow on the floor far below (it floats), and wax spattered where it has hung
  f.bone('root');
  f.flat(ell([SC[0], gy], 90, 8, 0, 16), '#000', { op: 0.3 });
  for (let i = 0; i < 5; i++) f.flat(ell([SC[0] - 40 + i * 22 + R(f, -6, 6), gy - 2], R(f, 4, 8), 2.6, 0, 8), P.wax, { op: 0.7 });
  return f;
}

// ------------------------------------------------------------------ CENSER DEACON (cast, human 1.0)
// A deacon of the cathedral, still serving the rite. Stooped a little from the upper back, he swings a heavy iron censer
// out toward the party on its chains; through its pierced lid a small skull burns black, and black smoke trails back
// along the swing. The far hand carries the incense boat against his belly. Dress in three layers: an alb to the ankles,
// a charred dalmatic to the knee with its two bands and hem band, the deacon's stole worn across the body from the near
// shoulder; an amice at the neck; a burnt tonsure. Fire: everything charred and split, hems burnt into curled tongues,
// the face split along the cheek. Void: clean round holes through the dalmatic, a round bite out of the alb's hem.
// Rig: standard humanoid + censer (parent hand_n, pivot at the fist: it swings on its chains) + boat (hand_f) + skirt
// (pelvis) + stole_end (torso). Motion: idle the censer swinging; attack a cloud of black incense (a hard forward swing).
function censerDeacon() {
  const [CW, CH] = TIERS.human, seed = 1305;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 98, gy = f.o.groundY;
  const skin = '#7e7470', skinS = '#2c2228';
  const SKD = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: '#a89e96', shade: 0.34, tex: 'craze' + seed, texOp: 0.45 }, o);
  const ALB = (o = {}) => Object.assign({ fill: '#8a847a', shadow: '#2e2a28', light: '#aaa498', shade: 0.38, tex: 'weave' + seed, texOp: 0.45 }, o);
  const DAL = (o = {}) => Object.assign({ fill: '#4a464c', shadow: '#141216', light: '#6e6870', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, o);
  const N = [316, 296], C = [300, 380], Pv = [286, 490];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.16, 0.12), SF = S.at(0.36, 0.08);
  const EN = [312, 432], WN = [398, 384];   // near arm: elbow at the side, forearm forward and up, the chains in the fist
  const EF = [340, 446], WF = [384, 492];   // far arm: forearm down across the belly, the boat in the hand
  const HN = S.at(-0.2, 1.0), KN = [262, 628], AN = [250, 748];
  const HF = S.at(0.28, 1.0), KF = [330, 622], AF = [350, 748];
  const HC = [348, 236], hA = 0.34, neck0 = S.at(0.12, -0.04);
  const CC = [492, 586], cAx = E.norm(sub(WN, CC)), cA = Math.atan2(cAx[1], cAx[0]) + Math.PI / 2; // censer centre; its axis points at the fist
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('censer', WN, 'hand_n').joint('boat', WF, 'hand_f').joint('skirt', S.at(0, 0.84), 'pelvis').joint('stole_end', S.at(0.2, 0.7), 'torso');

  // ---- smoke trailing back along the swing (behind everything: it hangs in the air where the censer has been)
  f.bone('censer');
  for (const [dx, dy, h, w, ph] of [[-30, -10, 150, 34, 0], [-60, 10, 190, 40, 2], [-10, 20, 120, 26, 4]]) X.smoke(f, add(CC, [dx, dy]), h, w, { sway: 30, phase: ph, op: 0.6, big: true, col: '#141016', line: P.ashD, drift: -120 });
  // ---- far arm: dalmatic sleeve to the elbow, alb sleeve to the wrist, the boat held at the belly
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 44, 38), ALB({ fill: mix('#8a847a', '#000', 0.25) }));
  // ---- legs under the alb: only the feet in charred shoes show (whole legs drawn for the rig)
  for (const [Hp, Kn, A, sfx, tone] of [[HF, KF, AF, '_f', 0.25], [HN, KN, AN, '_n', 0]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 66, 48, { steps: 8 }), ALB({ fill: mix('#8a847a', '#000', tone) }));
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.9), 48, 38, { steps: 8 }), ALB({ fill: mix('#8a847a', '#000', tone) }));
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => B.boot(f, A, 1, 46, mix(P.leather, '#000', tone), { shaft: 0.3, tex: 'craze' + seed, toe: 1.1 }), [['shin' + sfx, side(A, mul(da, -1), 16)], ['foot' + sfx, side(A, da, 16)]]);
  }
  // ---- alb: ankle-length, the hem burnt and a round void bite out of it (on the skirt bone, under the dalmatic)
  f.bone('skirt');
  const albHem = X.charHem(f, [196, 738], [394, 742], 10, 14, [0, 1]);
  const alb = [S.at(-0.66, 0.8), S.at(0.6, 0.8), [366, 600], [392, 700], ...albHem.slice().reverse(), [206, 690], [222, 600]];
  X.cutHoles(f, [[albHem[6], 12]], () => f.part(alb, ALB({ maxShade: 22 })), { shape: E.smooth(alb) });
  X.clipDraw(f, E.smooth(alb), () => { for (const q of [[[240, 640], [232, 700], [226, 740]], [[300, 650], [304, 700], [306, 740]], [[350, 640], [362, 700], [370, 740]]]) X.crease(f, q, 2.8, { col: '#2e2a28', lit: '#c0baae' }); X.stains(f, E.smooth(alb), [180, 560, 420, 760], P.charS, 0.03, 2.8, -1.5, 71, 0.8); });
  X.charEdge(f, albHem, 6, { gap: 6 });
  // ---- torso and the dalmatic: a wide tunic to the knee with short wide sleeves, two dark bands down the front, a hem band
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.34, 0.36], [0.06, 0.6, 0.5], [0.2, 0.7, 0.64], [0.38, 0.66, 0.64], [0.56, 0.6, 0.58], [0.74, 0.62, 0.58], [0.9, 0.64, 0.6]]);
  f.part(torso, ALB());
  f.bone('skirt');
  const dHem = X.charHem(f, [178, 652], [426, 636], 11, 22, [0, 1]);
  const dSk = [S.at(-0.7, 0.74), S.at(-0.1, 0.76), S.at(0.66, 0.74), [396, 540], [414, 590], [428, 628], ...dHem.slice().reverse(), [182, 628], [196, 580], [210, 530]];
  const dHoles = [[[256, 596], 11], [[352, 612], 9]];
  X.cutHoles(f, dHoles, () => f.part(dSk, DAL({ maxShade: 26 })), { shape: E.smooth(dSk) });
  X.clipDraw(f, E.smooth(dSk), () => {
    for (const [x, sl] of [[262, -14], [340, 16]]) { f.part([[x - 11, 480], [x + 11, 480], [x + 13 + sl, 660], [x - 11 + sl, 660]].map(q => [...q, 1]), DAL({ fill: '#2a2830', inkW: 1, cast: false, maxShade: 4 })); f.line([[x - 9, 482], [x - 8 + sl, 650]], 1, '#7a7480', { op: 0.6 }); }
    f.part([[176, 606], [300, 612], [424, 598], [426, 618], [300, 632], [176, 626]], DAL({ fill: '#2a2830', inkW: 1, cast: false, maxShade: 4 })); // the hem band, following the flare
    X.softTone(f, E.smooth(dSk), [[[[200, 500], [236, 500], [214, 660], [180, 660]], '#000', 0.4, 8], [[[318, 500], [334, 500], [350, 660], [326, 660]], '#000', 0.35, 7], [[[286, 500], [300, 500], [304, 660], [284, 660]], '#ffffff', 0.15, 6], [[[384, 500], [400, 500], [424, 650], [404, 650]], '#ffffff', 0.15, 6]]);
    for (const q of [[[232, 500], [218, 580], [204, 640]], [[312, 500], [318, 580], [326, 640]], [[372, 500], [392, 570], [410, 630]], [[270, 520], [262, 600], [256, 640]]]) X.crease(f, q, 3, { col: '#0e0c10', lit: '#7a7480' });
    X.stains(f, E.smooth(dSk), [180, 460, 420, 680], P.charS, 0.025, 2.6, -1.25, 73, 0.85);
  });
  X.charEdge(f, dHem, 7, { gap: 5 });
  f.bone('torso');
  const dTop = S.shape([[-0.02, 0.4, 0.4], [0.08, 0.66, 0.54], [0.22, 0.76, 0.68], [0.4, 0.72, 0.68], [0.58, 0.68, 0.62], [0.76, 0.72, 0.64]]);
  X.cutHoles(f, [[S.at(-0.4, 0.46), 10]], () => f.part(dTop, DAL({ maxShade: 26 })), { shape: E.smooth(dTop) });
  X.clipDraw(f, E.smooth(dTop), () => {
    for (const u of [-0.16, 0.38]) f.part([S.at(u - 0.1, 0.06), S.at(u + 0.1, 0.06), S.at(u + 0.1, 0.8), S.at(u - 0.1, 0.8)], DAL({ fill: '#24222a', inkW: 1, cast: false, maxShade: 4 }));
    X.crease(f, [S.at(-0.5, 0.2), S.at(-0.46, 0.4), S.at(-0.4, 0.6)], 2.6, { col: '#0e0c10', lit: '#6a6470' });
    X.stains(f, E.smooth(dTop), E.bbox(dTop), P.charS, 0.03, 2.6, -1.3, 75, 0.7);
    X.burnHole(f, S.at(0.1, 0.5), 8, 0.4);
  });
  // the stole, across the body from the near shoulder to the far hip, fringed, its loose end hanging
  const st = [S.at(-0.3, 0.02), S.at(0.0, 0.2), S.at(0.3, 0.46), S.at(0.5, 0.68)];
  f.part(K.chain(st, [20, 22, 22, 22]), { fill: '#5a5458', shadow: '#1a1618', light: '#7a7478', shade: 0.38, tex: 'weave' + seed, texOp: 0.4, inkW: 1.3 });
  for (const t of [0.3, 0.7]) { const q = lerp(st[1], st[2], t); f.line([add(q, [-6, 6]), add(q, [6, -6]), add(q, [0, -10]), add(q, [-6, 6])], 1.1, '#9a9498', { op: 0.7, straight: true }); } // stitched crosses
  f.bone('stole_end');
  { const e0 = S.at(0.5, 0.68); const tail = [add(e0, [-10, -4]), add(e0, [12, -6]), add(e0, [16, 70]), ...X.charHem(f, add(e0, [16, 74]), add(e0, [-6, 76]), 3, 8, [0, 1]), add(e0, [-8, 60])]; f.part(tail, { fill: '#5a5458', shadow: '#1a1618', shade: 0.38, tex: 'weave' + seed, texOp: 0.4 }); X.charEdge(f, tail.slice(3, 7), 4); }
  f.bone('forearm_f');
  f.part(limb(EF, WF, 38, 30), ALB({ fill: mix('#8a847a', '#000', 0.1) }));
  f.part(K.ragLimb(f, EF, lerp(EF, WF, 0.45), 52, 58, { depth: 6, teeth: 4 }), DAL({ fill: '#38343a' })); // the far dalmatic sleeve
  f.bone('boat');
  { const bc = add(WF, [12, 8]); const boat = [add(bc, [-34, -6]), add(bc, [34, -10]), add(bc, [26, 8]), add(bc, [0, 16]), add(bc, [-26, 10])]; f.part(boat, { fill: '#6a6670', shadow: P.ironD, light: P.ironL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.4 }); f.part([add(bc, [-30, -8]), add(bc, [-2, -14]), add(bc, [10, -10]), add(bc, [-10, -4])], { fill: P.ironL, shade: 0.3, inkW: 1, cast: false }); f.line([add(bc, [6, -10]), add(bc, [22, -26]), add(bc, [30, -24])], 2, P.ironL); f.part(ell(add(bc, [0, 18]), 12, 4, 0, 10), { fill: P.ironD, inkW: 1, cast: false }); }
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, 0.3, 20, mix(skin, '#000', 0.15), { shadow: skinS, tex: 'craze' + seed, texOp: 0.4, quiet: true });
  X.fistDetail(f, gF, 20, skin, { nail: '#3a3034' });
  // ---- head: bowed toward the swing, a burnt tonsure, the cheek split; an amice round the neck
  f.bone('head');
  f.part(limb(neck0, add(HC, [-20, 24]), 40, 36), SKD());
  const hd = B.head(f, HC, H, hA, { skin, jaw: 1.04, chin: 0.02, nose: 1.1, hook: 0.4, mouth: 'grim', squint: 0.5, browDown: 0.06, age: true, gaunt: true, faceShade: 0.78, faceHatch: false, hairCol: '#2a2426', browCol: '#2a2426', noEar: false,
    hair: [[-0.44, 0.16], [-0.5, -0.1], [-0.42, -0.34], [-0.3, -0.36], [-0.32, -0.16], [-0.3, 0.06]] });
  X.greyFace(f, hd, skin, 1.1);
  f.part(hd(ell([-0.06, -0.42], 0.24, 0.1, -0.2, 14)), SKD({ fill: mix(skin, '#000', 0.12), inkW: 1, cast: false, maxShade: 4 })); // the shaved crown
  for (let i = 0; i < 9; i++) f.line(hd([[-0.3 + i * 0.05, -0.34 + Math.abs(i - 4) * 0.012], [-0.31 + i * 0.05, -0.29 + Math.abs(i - 4) * 0.012]]), 1.4, '#2a2426', { op: 0.8 }); // singed ring of hair
  X.seam(f, hd([[0.02, 0.0], [0.08, 0.12], [0.06, 0.24], [0.12, 0.34]]), 1.8); // the cheek split
  X.hairline(f, hd([[-0.2, -0.3], [-0.1, -0.2], [-0.14, -0.08]]), 1.1);
  X.ash(f, hd([[0.0, -0.5]])[0], 8, 40, 100, 0.9);
  f.bone('torso');
  const am = [S.at(-0.4, -0.06), S.at(0.38, -0.08), S.at(0.46, 0.08), S.at(0.1, 0.12), S.at(-0.44, 0.1)];
  f.part(am, ALB({ fill: '#9a948a', maxShade: 8 })); X.charEdge(f, [S.at(-0.44, 0.1), S.at(0.1, 0.12), S.at(0.46, 0.08)], 4);
  // ---- near arm: wide dalmatic sleeve to the elbow, alb sleeve, the charred hand round the chains
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 46, 40), ALB());
  const slv = [lp(SN, EN, -0.1, -28), lp(SN, EN, -0.1, 30), lp(SN, EN, 0.5, 38), add(EN, [24, 22]), ...X.charHem(f, add(EN, [28, 50]), add(EN, [-34, 40]), 5, 12, [0, 1]), lp(SN, EN, 0.6, -36)];
  f.part(slv, DAL({ maxShade: 14 }));
  X.charEdge(f, slv.slice(3, 8), 5); X.crease(f, [lp(SN, EN, 0.1, 10), lp(SN, EN, 0.4, 18), lp(SN, EN, 0.62, 26)], 2.4, { col: '#0e0c10', lit: '#6a6470' });
  f.bone('forearm_n');
  f.part(limb(EN, lerp(EN, WN, 0.9), 38, 30), ALB());
  f.part(K.ragLimb(f, lerp(EN, WN, 0.5), lerp(EN, WN, 0.9), 34, 32, { depth: 5, teeth: 4 }), ALB({ fill: '#9a948a' })); // the alb cuff, burnt ragged
  // ---- the censer: three chains from the fist to the bowl's rim, a fourth to the lid; a pierced onion lid, a skull
  // burning black inside it, seen through the openings; smoke pouring out of the openings and trailing back
  f.bone('censer');
  const CF = frame(CC, cA, 1); // local +y runs from the censer toward the fist
  const ch = [[-30, 10], [0, 16], [30, 10]].map(q => CF([q])[0]);
  for (const q of ch) X.ironChain(f, [q, add(WN, [0, 14])], 8, 2, P.iron);
  X.ironChain(f, [CF([[0, -56]])[0], add(WN, [0, 14])], 7, 1.8, P.ironL);
  for (const [u, h, w] of [[-20, 80, 18], [0, 110, 22], [20, 70, 16]]) X.smoke(f, CF([[u, -34]])[0], h, w, { sway: 14, phase: u, op: 0.5, col: '#100c12', line: P.ashD, drift: -70 });
  const bowl = CF([[-38, 6], [38, 6], [36, 22], [24, 40], [8, 46], [-8, 46], [-24, 40], [-36, 22]]);
  const lid = CF([[-36, 6], [-34, -14], [-24, -34], [-10, -48], [0, -56], [10, -48], [24, -34], [34, -14], [36, 6]]);
  f.part(CF([[-14, 44], [14, 44], [18, 56], [-18, 56]]), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.2, cast: false }); // the foot
  f.part(bowl, { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.6 });
  f.part(lid, { fill: '#56525a', shadow: P.ironD, light: '#8a868e', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.6 });
  // the openings: lancet windows round the lid; inside, a little skull burning black, seen through them
  const wins = [[-22, 6, -6, -24], [0, 9, -4, -36], [22, 6, -6, -24]].map(([u, w, y0, y1]) => CF([[u - w, y0], [u - w, y1 + w], [u, y1], [u + w, y1 + w], [u + w, y0]]));
  const winD = wins.map(wn => E.smooth(wn.map(q => [q[0], q[1], 1]))).join(' ');
  X.clipDraw(f, winD, () => {
    f.flat(CF([[-40, 10], [40, 10], [40, -50], [-40, -50]]), '#060407');
    X.blackFlame(f, CF([[-12, 0]])[0], 44, 20, { noFork: true, lean: -0.2 }); X.blackFlame(f, CF([[14, 0]])[0], 38, 18, { noFork: true, lean: -0.4 });
    const sk = CF([[2, -18]])[0];
    f.part(ell(sk, 13, 11, cA, 12), { fill: P.bone, shadow: P.boneS, shade: 0.35, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false, maxShade: 4 });
    f.flat(ell(add(sk, rot([4, 1], cA)), 3.4, 3, cA, 6), '#140e10'); f.flat(ell(add(sk, rot([-4, 1], cA)), 3, 2.6, cA, 6), '#140e10');
    for (let i = 0; i < 4; i++) f.line([add(sk, rot([-5 + i * 3.4, 7], cA)), add(sk, rot([-5 + i * 3.4, 11], cA))], 1, P.boneS);
  });
  for (const wn of wins) f.line([...wn, wn[0]], 1.3, P.vio, { op: 0.8 });
  f.line(CF([[-38, 6], [38, 6]]), 3.4, P.ironL, { op: 0.8 }); f.line(CF([[-34, 4], [34, 4]]), 1.4, INK);
  for (const u of [-30, -10, 10, 30]) f.rivet(CF([[u, 14]])[0], 2.2, P.ironL);
  f.part(ell(CF([[0, -60]])[0], 6, 6, 0, 10), { fill: P.iron, inkW: 1.2, cast: false }); // the finial ring
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, -Math.PI / 2, 22, skin, { shadow: skinS, tex: 'craze' + seed, texOp: 0.4, quiet: true });
  X.fistDetail(f, gN, 22, skin, { nail: '#3a3034' });
  X.hairline(f, [add(WN, [-10, -8]), add(WN, [0, -2]), add(WN, [10, -10])], 1.2);
  return f;
}

// ------------------------------------------------------------------ PYRE KNIGHT (cast, large, 1.4)
// A knight of the inquisition. He lit the pyre; now he stands guard so it is never put out. Square behind a planted tower
// shield, the far arm braced on its grip; a torch is fixed in an iron bracket on the shield's top and burns black; the
// flanged mace is cocked back over the near shoulder, ready. Plate blackened by flame, a great helm whose cross-shaped
// visor has burnt open at the edges, a surcoat burnt to tatters with the inquisition's black flame on it.
// Fire: scorched, blistered plate split along its lames with violet threads, char flaking, the surcoat burnt into curled
// strips. Void: clean round holes through the surcoat and the shield, a round bite out of the shield's rim.
// Rig: standard humanoid + shield (parent hand_f) > torch ; mace (hand_n) ; surcoat (pelvis).
// Motion: idle a stolid guard (slow breathing on the torso); attack a mace blow over the shield (near arm comes down).
function pyreKnight() {
  const [CW, CH] = TIERS.large, seed = 1307;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 132, gy = f.o.groundY;
  const ST = (o = {}) => Object.assign({ fill: P.steel, shadow: P.steelD, light: P.steelL, shade: 0.45, tex: 'mottle' + seed, texOp: 0.55 }, o);
  const STD = (o = {}) => ST(Object.assign({ fill: mix(P.steel, '#000', 0.25) }, o));
  const WOODK = (o = {}) => Object.assign({ fill: '#2e2624', shadow: P.woodD, light: P.woodL, shade: 0.38, tex: 'grain' + seed, texOp: 0.55 }, o);
  const CL = (o = {}) => Object.assign({ fill: '#6c6862', shadow: '#24201e', light: '#8e8a82', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }, o);
  const N = [432, 352], C = [420, 470], Pv = [404, 612];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.42, 0.1);
  const EN = [300, 400], WN = [318, 290];                  // near arm cocked back, fist over the shoulder
  const EF = [560, 470], WF = [612, 560];                  // far arm braced forward on the shield's grip
  const HN = S.at(-0.3, 1.0), KN = [330, 828], AN = [290, 1000];
  const HF = S.at(0.3, 1.0), KF = [486, 820], AF = [500, 1000];
  const HC = [466, 268], neck0 = S.at(0.12, -0.04);
  const mA = ang(EN, WN) - Math.PI / 2, mD = [Math.cos(mA), Math.sin(mA)], mH = add(WN, mul(mD, 210)), mB = add(WN, mul(mD, -50));
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('shield', WF, 'hand_f').joint('torch', [660, 470], 'shield').joint('mace', WN, 'hand_n').joint('surcoat', S.at(0, 0.84), 'pelvis');

  // ---- the mace: haft running back over the shoulder, the flanged head above and behind the helm
  f.bone('mace');
  f.part(limb(mB, mH, 16, 15, { steps: 8 }), { fill: P.wood, shadow: P.woodD, light: P.woodL, tex: 'grain' + seed, texOp: 0.6 });
  for (let i = 0; i < 6; i++) f.line([lp(mB, mH, 0.12 + i * 0.035, -9), lp(mB, mH, 0.15 + i * 0.035, 9)], 2, P.leatherD, { straight: true });
  f.part(ell(mB, 11, 11, 0, 10), STD({ inkW: 1.3, cast: false }));
  G.maceHead(f, mH, mA, 40, '#4a4c52');
  X.seam(f, [add(mH, [-14, -8]), add(mH, [0, 4]), add(mH, [10, 0])], 1.4);
  // ---- far leg (behind): cuisse, poleyn, greave, sabaton
  const plateLeg = (Hp, Kn, A, sfx, tone) => {
    const look = o => ST(Object.assign({ fill: mix(P.steel, '#000', tone) }, o || {})), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    f.bone('thigh' + sfx);
    f.part(limb(Hp, Kn, 92, 64, { q: [[0.35, 0.16, 0.2]], p: [[0.4, 0.1, 0.2]] }), { fill: '#3a3634', shadow: '#121010', shade: 0.4, tex: 'quilt' + seed, texOp: 0.6 }); // arming hose
    f.part(plate(Hp, Kn, 0.08, 0.9, 88, 66, { bow: 4 }), look());
    f.line([lp(Hp, Kn, 0.1, 10), lp(Hp, Kn, 0.88, 8)], 1.6, P.steelL, { op: 0.5 });
    for (const t of [0.3, 0.62]) X.seam(f, [lp(Hp, Kn, t, -30), lp(Hp, Kn, t + 0.04, 0), lp(Hp, Kn, t, 30)], 1.3);
    f.bone('shin' + sfx);
    f.part(limb(Kn, A, 62, 44), { fill: '#3a3634', shadow: '#121010', shade: 0.4 });
    f.part(plate(Kn, A, 0.08, 0.95, 64, 46, { bow: 3 }), look());
    f.line([lp(Kn, A, 0.12, 12), lp(Kn, A, 0.9, 8)], 1.6, P.steelL, { op: 0.5 });
    G.poleyn(f, Kn, ang(Hp, Kn) - Math.PI / 2 + 0.2, 40, mix(P.steel, '#000', tone - 0.05), mix(P.steel, '#000', tone + 0.2));
    X.flakes(f, lerp(Kn, A, 0.5), 14, 40, 4, 0.8);
    split(f, () => B.boot(f, A, 1, 70, mix(P.steel, '#000', tone + 0.05), { shaft: 0.3, style: 'sabaton', toe: 1.18, tex: 'mottle' + seed }), [['shin' + sfx, side(A, mul(da, -1), 22)], ['foot' + sfx, side(A, da, 22)]]);
  };
  plateLeg(HF, KF, AF, '_f', 0.3);
  // ---- far arm: rerebrace and vambrace reaching forward to the shield's grip (the hand is behind the shield)
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 60, 50), { fill: '#3a3634', shadow: '#121010', shade: 0.4, tex: 'quilt' + seed, texOp: 0.6 });
  f.part(plate(SF, EF, 0.15, 0.85, 62, 52, { bow: 3 }), STD());
  f.bone('forearm_f');
  f.part(limb(EF, WF, 52, 42), STD());
  G.poleyn(f, EF, ang(SF, EF) - Math.PI / 2, 30, mix(P.steel, '#000', 0.2), mix(P.steel, '#000', 0.4));
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 30, mix(P.steel, '#000', 0.3), { plate: true, cuff: true, quiet: true });
  // ---- near leg
  plateLeg(HN, KN, AN, '_n', 0);
  // ---- torso: breastplate over a mail shirt, faulds; the surcoat over all, burnt to tatters
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.42, 0.42], [0.06, 0.74, 0.64], [0.22, 0.86, 0.84], [0.42, 0.78, 0.8], [0.62, 0.6, 0.62], [0.8, 0.62, 0.6], [0.96, 0.7, 0.66]]);
  f.part(torso, { fill: '#54565a', shadow: '#1a1a1c', shade: 0.4, tex: 'mail' + seed, texOp: 0.85 });
  const bp = S.shape([[0.12, 0.72, 0.62], [0.3, 0.8, 0.84], [0.5, 0.72, 0.8], [0.66, 0.64, 0.7]]);
  f.part(bp, ST({ shade: 0.48 }));
  X.clipDraw(f, E.smooth(bp), () => {
    f.line([S.at(0.6, 0.14), S.at(0.7, 0.36), S.at(0.62, 0.62)], 2, INK, { op: 0.6 }); f.line([S.at(0.55, 0.16), S.at(0.64, 0.36), S.at(0.56, 0.6)], 1.4, P.steelL, { op: 0.6 }); // the medial ridge
    X.stains(f, E.smooth(bp), E.bbox(bp), P.charS, 0.03, 2.6, -1.2, 81, 0.8); // scorch
    for (let i = 0; i < 8; i++) { const q = X.scatter(f, S.at(0.2, 0.4), 50, 60), r = R(f, 3, 6); f.flat(ell(q, r, r * 0.8, 0, 8), P.steelL, { op: 0.4 }); f.flat(ell(add(q, [1, 1]), r * 0.6, r * 0.5, 0, 8), P.steelD, { op: 0.7 }); } // blistered blacking
    X.crackNet(f, S.at(0.1, 0.5), 0.3, 70, 1.8, { depth: 1 });
  });
  for (let i = 0; i < 3; i++) { const v0 = 0.66 + i * 0.08; f.part([S.at(-0.74 - i * 0.03, v0), S.at(0.76 + i * 0.03, v0 - 0.01), S.at(0.78 + i * 0.03, v0 + 0.1), S.at(-0.77 - i * 0.03, v0 + 0.1)], ST({ fill: i % 2 ? mix(P.steel, '#000', 0.2) : P.steel, inkW: 1.4, sharp: true })); f.rivet(S.at(0.5, v0 + 0.05), 2.6, P.steelL); f.rivet(S.at(-0.5, v0 + 0.05), 2.6, P.steelL); }
  // ---- surcoat: grey linen over the plate, the inquisition's black flame on the breast, burnt into curled strips below
  f.bone('surcoat');
  const sHem = X.charHem(f, [244, 838], [592, 822], 13, 70, [0, 1]);
  const sur = [S.at(-0.66, 0.78), S.at(0.0, 0.8), S.at(0.64, 0.78), [570, 700], [590, 790], ...sHem.slice().reverse(), [246, 790], [266, 700]];
  X.cutHoles(f, [[[340, 760], 16], [[470, 730], 12]], () => f.part(sur, CL({ maxShade: 30 })), { shape: E.smooth(sur) });
  X.clipDraw(f, E.smooth(sur), () => { X.softTone(f, E.smooth(sur), [[[[250, 700], [300, 700], [290, 840], [240, 840]], '#000', 0.4, 10], [[[360, 700], [380, 700], [372, 840], [352, 840]], '#000', 0.3, 8], [[[420, 700], [444, 700], [452, 840], [428, 840]], '#ffffff', 0.18, 8], [[[520, 700], [546, 700], [570, 840], [540, 840]], '#000', 0.3, 8]]); X.stains(f, E.smooth(sur), [250, 600, 580, 900], P.charS, 0.02, 3, -1.6, 83, 0.9); for (const q of [[[330, 640], [324, 720], [318, 800]], [[400, 650], [404, 740], [408, 810]], [[480, 640], [490, 720], [500, 790]]]) X.crease(f, q, 3, { col: '#24201e', lit: '#a8a49a' }); });
  X.charEdge(f, sHem, 9, { gap: 5, s: 1.2 });
  f.bone('torso');
  const sTop = S.shape([[0.0, 0.42, 0.44], [0.1, 0.76, 0.66], [0.26, 0.86, 0.84], [0.46, 0.76, 0.78], [0.66, 0.6, 0.62], [0.8, 0.62, 0.6]]);
  X.cutHoles(f, [[S.at(-0.5, 0.4), 12]], () => f.part(sTop, CL({ maxShade: 24 })), { shape: E.smooth(sTop) });
  X.clipDraw(f, E.smooth(sTop), () => {
    X.stains(f, E.smooth(sTop), E.bbox(sTop), P.charS, 0.025, 2.8, -1.4, 85, 0.85);
    X.blackFlame(f, S.at(0.3, 0.62), 110, 50, { noFork: true, single: true, wisps: false, scraps: false, edgeW: 2.4, phase: 1, sway: 0.4 }); // the inquisition's black flame, sewn on
    X.crease(f, [S.at(-0.4, 0.1), S.at(-0.5, 0.3), S.at(-0.46, 0.56)], 2.6, { col: '#24201e', lit: '#a8a49a' });
  });
  // belt and sword hanger, a scabbard (empty: the sword went into the pyre)
  f.part([S.at(-0.66, 0.74), S.at(0.64, 0.72), S.at(0.66, 0.8), S.at(-0.68, 0.82)], { fill: P.leatherD, shade: 0.4, sharp: true });
  f.part([S.at(0.2, 0.72), S.at(0.34, 0.72), S.at(0.34, 0.81), S.at(0.2, 0.81)], ST({ inkW: 1.1, sharp: true }));
  f.line([S.at(0.27, 0.8), S.at(0.3, 0.9), S.at(0.26, 1.0)], 3, P.leatherD); // the belt's tongue hanging
  // ---- the great helm: flat-topped, riveted, the cross-shaped visor burnt open at its edges
  f.bone('head');
  const hF = frame(HC, 0.06, 150);
  f.part([add(HC, [-60, 60]), add(HC, [50, 64]), S.at(0.72, 0.12), S.at(-0.7, 0.14)], { fill: '#54565a', shadow: '#1a1a1c', tex: 'mail' + seed, texOp: 0.85 }); // aventail
  f.part(hF([[-0.42, -0.5], [-0.1, -0.58, 1], [0.3, -0.58, 1], [0.44, -0.38], [0.47, 0.1], [0.45, 0.42, 1], [0.3, 0.52], [-0.3, 0.52], [-0.45, 0.38, 1], [-0.47, -0.1]]), ST({ shade: 0.5 }));
  f.part(hF([[0.2, -0.58, 1], [0.3, -0.58, 1], [0.44, -0.38], [0.47, 0.1], [0.45, 0.42, 1], [0.3, 0.52], [0.2, 0.52, 1], [0.22, 0.1]]), STD({ inkW: 1.2 }));
  f.part(hF([[-0.43, -0.3], [0.44, -0.32], [0.46, -0.21], [-0.46, -0.19]]), STD({ inkW: 1.2, sharp: true }));
  for (let i = 0; i < 6; i++) f.rivet(hF([[-0.38 + i * 0.16, -0.255]])[0], 3, P.steelL);
  // the cross visor: a vertical slot down the face and the eye slit across it, burnt open, edges charred and violet
  const vis = hF([[0.24, -0.42], [0.34, -0.42], [0.34, -0.17], [0.46, -0.17], [0.46, -0.07], [0.34, -0.07], [0.34, 0.36], [0.24, 0.36], [0.24, -0.07], [0.08, -0.07], [0.08, -0.17], [0.24, -0.17]]);
  f.flat(vis.map(q => [...q, 1]).map((q, i) => i % 2 ? add(q, [R(f, -2, 2), R(f, -2, 2)]) : q), '#050405');
  f.line([...vis, vis[0]], 2.4, P.charS, { op: 0.9 }); f.line([...vis, vis[0]], 1, P.vioL, { op: 0.7 });
  f.flat(ell(hF([[0.3, -0.12]])[0], 3, 2, 0, 6), P.vio);
  X.stains(f, E.smooth(hF([[-0.47, -0.58], [0.47, -0.58], [0.47, 0.52], [-0.47, 0.52]])), E.bbox(hF([[-0.5, -0.6], [0.5, 0.55]])), P.charS, 0.04, 2.6, -1.2, 87, 0.7);
  for (let i = 0; i < 5; i++) f.rivet(hF([[-0.35 + i * 0.17, 0.46]])[0], 2.6, P.steelL);
  X.ash(f, hF([[0.0, -0.6]])[0], 8, 50, 100, 1);
  // ---- near arm: pauldron on the torso; rerebrace, couter, vambrace; gauntlet on the haft
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 66, 54), { fill: '#3a3634', shadow: '#121010', shade: 0.4, tex: 'quilt' + seed, texOp: 0.6 });
  f.part(plate(SN, EN, 0.2, 0.86, 64, 54, { bow: 3 }), ST());
  f.bone('forearm_n');
  f.part(limb(EN, WN, 54, 44), { fill: '#3a3634', shadow: '#121010', shade: 0.4 });
  f.part(plate(EN, WN, 0.12, 0.85, 56, 46, { bow: 2 }), ST());
  f.part(ell(add(EN, [-4, 4]), 24, 18, ang(SN, EN) + 0.6, 14), STD({ k: 0.8 })); // couter
  f.bone('torso');
  G.pauldron(f, add(SN, [8, -8]), 52, -0.3, P.steel, mix(P.steel, '#000', 0.3), 3);
  X.seam(f, [add(SN, [-30, 6]), add(SN, [-10, 14]), add(SN, [14, 10])], 1.6);
  X.flakes(f, add(SN, [0, -10]), 30, 14, 5, 0.9);
  f.bone('hand_n');
  B.grip(f, WN, EN, mA, 32, P.steel, { plate: true, cuff: true, name: 'knight mace' });
  // ---- the tower shield, planted: curved oak boards faced with blackened iron bands, a void hole through it and a
  // round bite out of its rim; the torch in its iron bracket on top, burning black
  f.bone('shield');
  const TL = [574, 492], TR = [770, 470], BR = [790, gy - 2], BL = [588, gy + 2];
  const shp = [TL, lerp(TL, TR, 0.5).map((v, i) => v - (i ? 10 : 0)), TR, lerp(TR, BR, 0.5).map((v, i) => v + (i ? 0 : 8)), BR, lerp(BR, BL, 0.5).map((v, i) => v + (i ? 4 : 0)), BL, lerp(BL, TL, 0.5).map((v, i) => v + (i ? 0 : 6))];
  f.part([[562, 498], TL, BL, [576, gy + 2]].map(q => [...q, 1]), { fill: P.woodD, shade: 0.3, inkW: 1.4 }); // the shield's thickness
  X.cutHoles(f, [[[690, 760], 20], [[784, 640], 18]], () => {
    f.part(shp, WOODK({ maxShade: 40 }));
    X.clipDraw(f, E.smooth(shp), () => {
      X.softTone(f, E.smooth(shp), [[[[574, 492], [640, 480], [650, gy], [590, gy]], '#000', 0.4, 14], [[[700, 480], [770, 470], [790, gy], [720, gy]], P.woodL, 0.3, 12]]);
      for (let i = 1; i < 4; i++) { const t = i / 4; f.line([lerp(TL, TR, t), lerp(BL, BR, t)], 2.4, INK, { op: 0.85 }); }
      for (const t of [0.12, 0.5, 0.88]) { const a = lerp(TL, BL, t), b = lerp(TR, BR, t); f.part([add(a, [0, -14]), add(b, [0, -14]), add(b, [0, 14]), add(a, [0, 14])], STD({ inkW: 1.3, cast: false })); for (let k = 0; k < 6; k++) f.rivet(lerp(add(a, [6, 0]), add(b, [-6, 0]), k / 5), 2.6, P.steelL); }
      X.stains(f, E.smooth(shp), [560, 460, 800, gy], P.charS, 0.018, 3.0, -1.5, 89, 0.85);
      for (let i = 0; i < 5; i++) X.seam(f, [[600 + i * 40, 560 + i * 60], [610 + i * 40, 620 + i * 60], [604 + i * 40, 680 + i * 60]], 1.6);
      X.blackFlame(f, [680, 980], 200, 90, { noFork: true, single: true, wisps: false, scraps: false, edgeW: 3, phase: 1, sway: 0.4 }); // the inquisition's black flame painted on the face
      X.ashCake(f, [680, 1000], 80, 40, 8, 1.2);
    });
  }, { shape: E.smooth(shp) });
  f.line([TL, lerp(TL, TR, 0.5).map((v, i) => v - (i ? 10 : 0)), TR], 3, P.woodL, { op: 0.6 }); // worn top edge
  f.bone('torch');
  const tb = [664, 470], tt = [670, 380];
  f.part(limb(tb, [670, 380], 22, 24, { steps: 6 }), { fill: P.wood, shadow: P.woodD, light: P.woodL, tex: 'grain' + seed, texOp: 0.6 });
  for (let i = 0; i < 4; i++) f.line([lp(tb, tt, 0.72 + i * 0.07, -14), lp(tb, tt, 0.76 + i * 0.07, 14)], 3, '#2a2224'); // pitch-soaked rags
  f.part([add(tb, [-26, 6]), add(tb, [26, 2]), add(tb, [24, -24]), add(tb, [16, -24]), add(tb, [14, -6]), add(tb, [-14, -4]), add(tb, [-16, -22]), add(tb, [-24, -20])], STD({ inkW: 1.3 })); // the iron bracket
  f.rivet(add(tb, [-18, 0]), 2.8, P.steelL); f.rivet(add(tb, [18, -2]), 2.8, P.steelL);
  X.flameSheet(f, [add(tt, [-38, 4]), add(tt, [-22, 30]), add(tt, [0, 38]), add(tt, [22, 30]), add(tt, [38, 4])], [[tt[0] - 30, 130, 56, -0.15], [tt[0] - 4, 220, 70, -0.05], [tt[0] + 26, 160, 56, 0.08]], { edgeW: 2.6 });
  X.ash(f, add(tt, [0, -200]), 12, 80, 200, 1.2);
  f.bone('root');
  f.flat(ell([520, gy + 2], 300, 8, 0, 20), P.charS, { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ THE UNBURNT INQUISITOR (elite, 2.0)
// The cathedral's grand inquisitor. He burned a thousand saints and never caught alight himself. Upright and severe in
// heavy red-black robes untouched by fire: a cassock to the floor, a clean rochet with a lace hem, a cope fastened with
// an iron morse, its orphrey bands lettered in red rubric; a tall red-black mitre with its lappets; a black-burning torch
// raised high in the near hand, the book of judgements clasped to his chest in the far, a chain of keys at his belt.
// Perfectly clean in a world of ash: no char on him; the ash lies round his feet. Void (it takes from him anyway): a
// clean round hole punched through the book and its judgements, a round bite out of the cope's hem; the torch's flame.
// Rig: standard humanoid + torch (parent hand_n) + book (hand_f) + cope (torso) + skirt (pelvis) + keys (pelvis) +
// lappets (head). Motion: idle reading the book (book and head tilt); attack a sentence read aloud (torch thrust out).
function unburntInquisitor() {
  const [CW, CH] = TIERS.elite, seed = 1301;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 178, gy = f.o.groundY;
  const skin = '#b4a698', skinS = '#4a3238';
  const ROBE = (o = {}) => Object.assign({ fill: P.robe, shadow: P.robeS, light: P.robeL, shade: 0.42, tex: 'weave' + seed, texOp: 0.4 }, o);
  const ROCH = (o = {}) => Object.assign({ fill: P.rochet, shadow: P.rochetD, light: '#f2eee6', shade: 0.38, tex: 'weave' + seed, texOp: 0.3 }, o);
  const ORPH = (o = {}) => Object.assign({ fill: '#4a4448', shadow: '#161214', light: '#76707a', shade: 0.4, tex: 'weave' + seed, texOp: 0.45 }, o);
  const N = [520, 440], C = [522, 600], Pv = [508, 780];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.42, 0.1);
  const EF = [640, 400], WF = [744, 360];      // torch arm (far): raised forward behind the head, the fist ahead of the face
  const EN = [500, 650], WN = [600, 560];      // book arm (near): elbow at the side, the hand flat on the book
  const HN = S.at(-0.2, 1.0), KN = [490, 1060], AN = [470, 1320], HF = S.at(0.3, 1.0), KF = [560, 1060], AF = [580, 1320];
  const HC = [560, 312], hA = -0.04, neck0 = S.at(0.14, -0.04);
  const tUp = [750, 220], tBt = [742, 420]; // the torch: shaft through the fist, up to the iron basket
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('torch', WF, 'hand_f').joint('book', WN, 'hand_n').joint('cope', S.at(-0.2, 0.0), 'torso').joint('skirt', S.at(0, 0.86), 'pelvis').joint('keys', S.at(-0.3, 0.9), 'pelvis').joint('lappets', add(HC, [-70, -40]), 'head');

  // ---- torch arm: the cope's sleeve to the elbow, the rochet's sleeve, the bare fist round the shaft
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 72, 60), ROBE({ fill: mix(P.robe, '#000', 0.15) }));
  X.crease(f, [lp(SF, EF, 0.3, -10), lp(SF, EF, 0.6, -16), lp(SF, EF, 0.85, -10)], 3, { col: P.robeS, lit: P.robeL });
  f.bone('forearm_f');
  f.part(limb(EF, lerp(EF, WF, 0.86), 58, 44), ROCH({ fill: '#c8c2b6' }));
  f.part(K.ragLimb(f, EF, lerp(EF, WF, 0.42), 84, 90, { depth: 4, teeth: 3 }), ROBE({ fill: mix(P.robe, '#000', 0.15) })); // wide sleeve mouth
  // the torch: an ash shaft through the fist, an iron basket of pitch at the top, black fire
  f.bone('torch');
  f.part(limb(tBt, tUp, 20, 22, { steps: 8 }), { fill: '#3a302c', shadow: '#120e0c', light: '#5a4c46', shade: 0.4, tex: 'grain' + seed, texOp: 0.6 });
  const bc = add(tUp, [0, 10]);
  f.part([add(bc, [-28, -24]), add(bc, [28, -26]), add(bc, [20, 24]), add(bc, [-18, 26])], { fill: '#1a1416', shade: 0.3, inkW: 1.2, cast: false });
  for (let i = 0; i < 5; i++) f.line([add(bc, [-28 + i * 14, -24]), add(bc, [-18 + i * 9.5, 26])], 3, P.iron); f.line([add(bc, [-28, -24]), add(bc, [28, -26])], 4, P.iron); f.line([add(bc, [-24, 4]), add(bc, [24, 2])], 3, P.iron);
  X.flameSheet(f, [add(bc, [-40, -8]), add(bc, [-20, -26]), add(bc, [0, -30]), add(bc, [20, -26]), add(bc, [40, -8])], [[bc[0] - 34, 160, 60, -0.2], [bc[0] - 6, 260, 80, -0.08], [bc[0] + 26, 200, 66, 0.0]], { edgeW: 3 });
  f.bone('hand_f');
  const gN = B.grip(f, WF, EF, -Math.PI / 2, 34, skin, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.4, maxBend: 40, name: 'inquisitor torch' });
  X.fistDetail(f, gN, 34, skin, { nail: '#a89a8c' });
  f.line(ell(add(WF, [10, 4]), 7, 9, 0.3, 10).concat([ell(add(WF, [10, 4]), 7, 9, 0.3, 10)[0]]), 3.4, P.ironL); // an iron signet ring
  // ---- the cope's back, falling from the shoulders to the floor behind him (a heavy semicircle of red-black cloth)
  f.bone('cope');
  const copeHem = X.charHem(f, [262, gy - 8], [500, gy - 4], 6, 8, [0, 1]).map(q => q.length > 2 ? [q[0], q[1], 0] : q); // a clean hem: no burnt tongues
  const copeB = [S.at(-0.3, -0.06), S.at(0.3, -0.02), S.at(0.1, 0.3), [470, 900], [500, gy - 4], ...copeHem.slice().reverse(), [270, 1100], [320, 800], S.at(-0.82, 0.2)];
  X.cutHoles(f, [[[300, gy - 14], 22]], () => f.part(copeB, ROBE({ fill: mix(P.robe, '#000', 0.2), maxShade: 40 })), { shape: E.smooth(copeB) });
  X.clipDraw(f, E.smooth(copeB), () => {
    X.softTone(f, E.smooth(copeB), [[[[270, 600], [330, 600], [300, gy], [250, gy]], '#000', 0.4, 14], [[[360, 600], [380, 600], [400, gy], [370, gy]], P.robeL, 0.25, 10]]);
    for (const q of [[[400, 520], [356, 800], [320, gy - 20]], [[440, 560], [420, 900], [410, gy - 20]], [[340, 620], [300, 900], [280, gy - 30]]]) X.crease(f, q, 4, { col: P.robeS, lit: P.robeL });
  });
  // ---- legs under the cassock (whole, for the rig), shoes showing at the hem
  for (const [Hp, Kn, A, sfx, tone] of [[HF, KF, AF, '_f', 0.3], [HN, KN, AN, '_n', 0]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 110, 76, { steps: 8 }), ROBE({ fill: mix(P.robe, '#000', tone) }));
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.92), 76, 58, { steps: 8 }), ROBE({ fill: mix(P.robe, '#000', tone) }));
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => B.boot(f, A, 1, 64, mix('#2a2022', '#000', tone), { shaft: 0.25, toe: 1.15, tex: 'mottle' + seed }), [['shin' + sfx, side(A, mul(da, -1), 22)], ['foot' + sfx, side(A, da, 22)]]);
  }
  // ---- cassock: floor length, heavy folds breaking on the shoes; the rochet over it to the knee
  f.bone('skirt');
  const cas = [S.at(-0.66, 0.8), S.at(0.62, 0.78), [640, 980], [676, 1200], [690, gy - 18], [620, gy - 10], [560, gy - 22], [500, gy - 8], [440, gy - 18], [390, gy - 8], [380, 1200], [400, 980]];
  f.part(cas, ROBE({ maxShade: 40 }));
  X.clipDraw(f, E.smooth(cas), () => {
    X.softTone(f, E.smooth(cas), [[[[380, 900], [440, 900], [430, gy], [380, gy]], '#000', 0.45, 14], [[[600, 900], [640, 900], [680, gy], [640, gy]], P.robeL, 0.3, 12], [[[520, 900], [540, 900], [556, gy], [530, gy]], '#000', 0.35, 8]]);
    for (const q of [[[470, 1000], [462, 1180], [450, gy - 20]], [[540, 1000], [548, 1180], [556, gy - 20]], [[610, 1000], [636, 1180], [650, gy - 20]], [[420, 1100], [404, gy - 20]]]) X.crease(f, q, 4, { col: P.robeS, lit: P.robeL });
    for (let i = 0; i < 9; i++) f.rivet([506 + i * 2, 900 + i * 50], 3.2, '#2a1012'); // cloth-covered buttons down the front
  });
  // the rochet: clean linen to the knee, pleated, a deep lace hem
  const rHem = [];
  for (let i = 0; i <= 14; i++) { const x = 392 + i * 20.5, y = 1080 + Math.sin(i * 0.9) * 6; rHem.push([x, y + (i % 2 ? 10 : 0)]); }
  const roch = [S.at(-0.68, 0.72), S.at(0.64, 0.7), [650, 900], [684, 1072], ...rHem.slice().reverse(), [396, 1060], [410, 900]];
  f.part(roch, ROCH({ maxShade: 30 }));
  X.clipDraw(f, E.smooth(roch), () => {
    for (let i = 0; i < 9; i++) { const x = 420 + i * 30; X.crease(f, [[x + 4, 900], [x - 2 + i * 2, 1000], [x - 6 + i * 4, 1074]], 2.4, { col: P.rochetD, lit: '#ffffff', op: 0.6 }); }
    X.softTone(f, E.smooth(roch), [[[[392, 880], [440, 880], [430, 1080], [390, 1080]], P.rochetD, 0.4, 12]]);
    // lace: a band of pierced work above the hem
    for (let i = 0; i < 26; i++) { const x = 402 + i * 11, y = 1036 + Math.sin(i * 0.5) * 4; f.line(ell([x, y], 4, 6, 0, 8).concat([ell([x, y], 4, 6, 0, 8)[0]]), 0.9, P.rochetD, { op: 0.8 }); }
    f.line(rHem.map(q => add(q, [0, -18])), 1, P.rochetD, { op: 0.7 });
  });
  // the cincture: a red-black cord knotted at the hip, tasselled; the chain of keys hanging from it
  f.bone('pelvis');
  X.rope(f, [S.at(-0.7, 0.76), S.at(0.0, 0.8), S.at(0.66, 0.74)], 8, P.robeL);
  f.bone('keys');
  { const k0 = S.at(-0.3, 0.8), ring = add(k0, [-6, 110]);
    X.ironChain(f, [k0, add(k0, [-4, 60]), add(ring, [0, -26])], 12, 3, P.ironL);
    f.line(ell(ring, 26, 26, 0, 20).concat([ell(ring, 26, 26, 0, 20)[0]]), 6, INK); f.line(ell(ring, 26, 26, 0, 20).concat([ell(ring, 26, 26, 0, 20)[0]]), 3.4, P.iron);
    for (let i = 0; i < 5; i++) { const a = 1.0 + i * 0.28, b0 = add(ring, rot([24, 0], a)), b1 = add(ring, rot([24 + 70 - i * 6, 0], a));
      f.part(ell(b0, 9, 7, a, 10), { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.4, inkW: 1.2, cast: false });
      f.line([b0, b1], 6, INK, { straight: true }); f.line([b0, b1], 3.6, P.iron, { straight: true });
      f.part([b1, add(b1, rot([0, 10], a)), add(b1, rot([-10, 12], a)), add(b1, rot([-12, 2], a))].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.1, cast: false }); } } // big iron keys
  // ---- torso: cassock body, rochet yoke; the cope's fronts over the shoulders, bands lettered in rubric, the morse
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.42, 0.44], [0.06, 0.72, 0.62], [0.22, 0.82, 0.76], [0.42, 0.74, 0.74], [0.62, 0.64, 0.64], [0.8, 0.66, 0.62], [0.94, 0.68, 0.62]]);
  f.part(torso, ROCH());
  X.clipDraw(f, E.smooth(torso), () => { for (let i = 0; i < 6; i++) X.crease(f, [S.at(0.0 + i * 0.1, 0.3), S.at(0.02 + i * 0.1, 0.5), S.at(0.0 + i * 0.1, 0.7)], 2, { col: P.rochetD, lit: '#ffffff', op: 0.5 }); });
  f.bone('cope');
  const band = (pts) => { const C = X.spline(pts, 6); const sh = K.chain(C.filter((_, i) => i % 4 === 0).concat([C[C.length - 1]]), C.filter((_, i) => i % 4 === 0).concat([0]).map(() => 54)); const Cs = C.filter((_, i) => i % 4 === 0).concat([C[C.length - 1]]); f.part(K.chain(X.offsetLine(Cs, () => -30), Cs.map(() => 14)), { fill: '#6a4446', shadow: '#2a1012', shade: 0.4, inkW: 1.1, cast: false }); f.part(sh, ORPH({ maxShade: 10 })); for (let i = 2; i < C.length - 4; i += 7) { const d = E.norm(sub(C[i + 1], C[i - 1])), nn = [-d[1], d[0]]; f.line([add(C[i], mul(nn, -8)), add(C[i], mul(nn, 8))], 4.6, P.rubric, { straight: true }); f.line([add(C[i + 3], mul(nn, -8)), add(C[i + 3], mul(nn, 2)), add(C[i + 3], mul(nn, 8))], 3, P.rubric); } f.line(X.offsetLine(C, () => 15), 1.4, '#8a8690', { op: 0.6 }); f.line(X.offsetLine(C, () => -15), 1.4, '#8a8690', { op: 0.6 }); };
  const copeF = [S.at(-0.36, -0.08), S.at(0.3, -0.06), S.at(0.6, 0.06), S.at(0.62, 0.4), [640, 760], [664, 1000], [650, gy - 24], [600, gy - 34], [540, gy - 30], [520, 900], S.at(-0.5, 0.6), S.at(-0.84, 0.3)];
  f.part(copeF, ROBE({ maxShade: 40 }));
  X.clipDraw(f, E.smooth(copeF), () => { X.softTone(f, E.smooth(copeF), [[[S.at(-0.9, 0.0), S.at(-0.3, 0.0), S.at(-0.3, 0.8), S.at(-0.9, 0.8)], '#000', 0.4, 14]]); for (const q of [[S.at(-0.4, 0.1), S.at(-0.5, 0.36), S.at(-0.48, 0.56)], [S.at(0.1, 0.16), S.at(0.16, 0.4)]]) X.crease(f, q, 3.4, { col: P.robeS, lit: P.robeL }); });
  // the orphrey follows the cope's front edge as it opens and falls in folds (independent review: the first, straight
  // grey band read as a staff at game size). Dark red-black embroidery close to the cope's value, bent by the folds
  // that cross it, ending in a fringe at the hem.
  { const bp = [S.at(0.36, 0.02), S.at(0.52, 0.3), [604, 760], [622, 900], [642, 1080], [648, gy - 44]], C = X.spline(bp, 6);
    const Cs = C.filter((_, i) => i % 3 === 0).concat([C[C.length - 1]]).map((q, i, A) => add(q, [Math.sin(i * 0.9) * 4, 0]));
    f.part(K.chain(X.offsetLine(Cs, () => -27), Cs.map(() => 10)), { fill: '#6a4446', shadow: '#2a1012', shade: 0.4, inkW: 1, cast: false }); // the lining's edge
    const bandPts = K.chain(Cs, Cs.map((_, i) => 44 + i * 0.3));
    f.part(bandPts, ORPH({ fill: '#4e2629', shadow: '#1a0a0c', light: '#7a4a4c', maxShade: 10 }));
    X.clipDraw(f, E.smooth(bandPts), () => {
      for (let i = 3; i < C.length - 4; i += 8) { const d = E.norm(sub(C[i + 1], C[i - 1])), nn = [-d[1], d[0]]; f.line([add(C[i], mul(nn, -7)), add(C[i], mul(nn, 7))], 3, P.rubric, { op: 0.75, straight: true }); f.line([add(C[i + 3], mul(nn, -7)), add(C[i + 3], mul(nn, 2)), add(C[i + 3], mul(nn, 7))], 2.2, P.rubric, { op: 0.7 }); }
      for (const y of [820, 960, 1140, 1250]) { const q = C.reduce((bq, c) => Math.abs(c[1] - y) < Math.abs(bq[1] - y) ? c : bq, C[0]); X.softTone(f, E.smooth(bandPts), [[[add(q, [-30, -10]), add(q, [30, -4]), add(q, [30, 14]), add(q, [-30, 8])], '#000', 0.55, 5]]); X.crease(f, [add(q, [-26, -6]), add(q, [0, 2]), add(q, [26, 0])], 2.6, { col: P.robeS, lit: P.robeL }); }
      f.line(X.offsetLine(C, () => 17), 1.2, '#8a5a5c', { op: 0.5 }); f.line(X.offsetLine(C, () => -17), 1.2, '#8a5a5c', { op: 0.5 });
    });
    const e = C[C.length - 1]; for (let i = 0; i < 9; i++) f.line([add(e, [-20 + i * 5, 6]), add(e, [-20 + i * 5 + 1, 22])], 1.6, '#6a3a3c'); }
  // the morse: an iron clasp at the breast, engraved with the inquisition's black flame, dark stones
  { const mc = S.at(0.46, 0.12); f.part(ell(mc, 34, 30, 0, 18), { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.6 }); f.line(ell(mc, 26, 22, 0, 16).concat([ell(mc, 26, 22, 0, 16)[0]]), 1.4, P.ironL, { op: 0.7 }); X.blackFlame(f, add(mc, [0, 16]), 32, 18, { noFork: true, single: true, wisps: false, scraps: false, edgeW: 1.4, phase: 1, sway: 0.4 }); for (const a of [0, 1.57, 3.14, 4.71]) f.part(ell(add(mc, rot([28, 0], a)), 4.4, 4.4, 0, 8), { fill: '#2a1a20', light: '#6a5a66', shade: 0.3, inkW: 1, cast: false, hatch: false }); }
  // ---- head: severe, clean, untouched; cold pale eyes under a hard brow; the mitre, its lappets behind
  f.bone('lappets');
  for (const [dx, l] of [[-60, 330], [-34, 300]]) { const a = add(HC, [dx, -40]), b2 = add(a, [-10, l]); f.part([add(a, [-16, 0]), add(a, [16, 0]), add(b2, [16, 0]), add(b2, [-16, 0])].map(q => [...q, 1]), ROBE({ fill: mix(P.robe, '#000', 0.2), inkW: 1.3 })); for (let i = 0; i < 7; i++) f.line([add(b2, [-14 + i * 5, 0]), add(b2, [-14 + i * 5, 18])], 1.6, P.robeL); f.line([add(a, [-8, 20]), add(b2, [-8, -6])], 1.2, '#8a8690', { op: 0.5 }); }
  f.bone('head');
  f.part(limb(neck0, add(HC, [-24, 40]), 70, 62), { fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.4 });
  const hd = B.head(f, HC, H, hA, { skin, jaw: 1.1, chin: 0.03, nose: 1.18, hook: 0.7, mouth: 'set', squint: 0.35, browDown: 0.09, age: true, gaunt: true, glint: true, faceShade: 0.8, faceHatch: false, iris: '#8e969c', hairCol: '#5a5658', browCol: '#3a3436', browW: 0.05,
    hair: [[-0.44, 0.1], [-0.48, -0.16], [-0.4, -0.3], [-0.3, -0.26], [-0.32, -0.06], [-0.34, 0.12]] });
  f.flat(hd(ell([0.135, -0.056], 0.006, 0.006, 0, 6)), '#0c0a0a'); // a pinprick pupil in the pale iris
  f.line(hd([[0.18, 0.16], [0.22, 0.24], [0.24, 0.3]]), 1.3, INK, { op: 0.7 }); // the hard line from nose to mouth
  f.line(hd([[0.04, -0.18], [0.1, -0.21], [0.2, -0.2]]), 1.2, INK, { op: 0.5 }); // a frown furrow
  // the mitre: two tall stiffened peaks, front and back, red-black with grey orphrey bands lettered in rubric
  const mF = frame(HC, hA, H);
  const mitre = mF([[-0.46, -0.24], [-0.5, -0.6], [-0.34, -1.12], [-0.12, -1.3, 1], [0.02, -1.0], [0.16, -1.34, 1], [0.38, -1.06], [0.48, -0.56], [0.44, -0.22]]);
  f.part(mitre, ROBE({ fill: P.robe, maxShade: 26 }));
  X.clipDraw(f, E.smooth(mitre), () => {
    X.softTone(f, E.smooth(mitre), [[mF([[-0.5, -1.2], [-0.1, -1.2], [-0.16, -0.2], [-0.5, -0.2]]), '#000', 0.45, 10]]);
    f.part(mF([[-0.5, -0.4], [0.48, -0.42], [0.48, -0.24], [-0.5, -0.22]]), ORPH({ inkW: 1.2, maxShade: 6 })); // the circlet band
    f.part(mF([[0.06, -0.42], [0.2, -0.42], [0.26, -1.2], [0.12, -1.24]]), ORPH({ inkW: 1.2, maxShade: 6 })); // the upright band on the front peak
    for (let i = 0; i < 7; i++) f.line(mF([[-0.42 + i * 0.13, -0.36], [-0.4 + i * 0.13, -0.28]]), 3, P.rubric); // rubric lettering
    for (let i = 0; i < 5; i++) f.line(mF([[0.14 + i * 0.022, -0.5 - i * 0.14], [0.2 + i * 0.022, -0.52 - i * 0.14]]), 2.6, P.rubric);
    for (const u of [-0.3, 0.1, 0.36]) f.part(ell(mF([[u, -0.32]])[0], 6, 6, 0, 8), { fill: '#2a1a20', light: '#6a5a66', shade: 0.3, inkW: 1, cast: false, hatch: false }); // jet stones
  });
  // ---- book arm: the sleeve over the forearm, the hand flat on the book's cover
  f.bone('book');
  // the book of judgements, closed and clasped to his chest: thick boards, iron corners and clasps, red seals on ribbons,
  // a clean round hole punched right through it
  const bk = [[566, 470], [660, 482], [652, 668], [556, 656]], spine = [[556, 656], [652, 668], [648, 688], [552, 676]];
  X.cutHoles(f, [[[620, 548], 13]], () => {
    f.part(spine.map(q => [...q, 1]), { fill: '#d6ccb0', shadow: '#8a7e62', shade: 0.3, inkW: 1.2, cast: false }); // the page block's foot
    for (let k = 1; k < 4; k++) f.line([[574 + k, 652 + k * 4], [668, 666 + k * 4]], 0.8, '#8a7e62', { op: 0.8 });
    f.part(bk.map(q => [...q, 1]), { fill: '#2a1416', shadow: '#0e0606', light: '#5a2c30', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.6 });
    f.line([[574, 484], [650, 496], [642, 656], [564, 644], [574, 484]], 1.2, '#5a3034', { op: 0.8, straight: true }); // tooled border
    for (const c of [[566, 470], [660, 482], [652, 668], [556, 656]]) f.part(ell(c, 10, 10, 0, 8), { fill: P.iron, shadow: P.ironD, shade: 0.35, inkW: 1.1, cast: false });
    for (const y of [530, 610]) { f.part([[654, y], [680, y + 4], [678, y + 18], [652, y + 14]].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, shade: 0.35, inkW: 1.1, cast: false }); f.rivet([670, y + 10], 2.4, P.ironL); } // clasps
  }, { shape: E.smooth(bk.map(q => [...q, 1])) });
  for (const [x, l] of [[576, 70], [600, 50]]) { f.line([[x, 664], [x - 4, 660 + l * 0.5], [x + 2, 660 + l]], 3, P.rubric); f.part(ell([x + 2, 670 + l], 11, 10, 0, 12), { fill: P.rubric, shadow: '#4a120c', light: '#c04a3a', shade: 0.35, inkW: 1.2, cast: false }); f.line(ell([x + 2, 670 + l], 6, 5, 0, 8), 1, '#4a120c', { op: 0.8 }); } // the seals of judgement
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 76, 64), ROBE());
  X.crease(f, [lp(SN, EN, 0.3, 10), lp(SN, EN, 0.6, 16), lp(SN, EN, 0.85, 10)], 3, { col: P.robeS, lit: P.robeL });
  f.bone('forearm_n');
  f.part(limb(EN, WN, 64, 52), ROBE());
  f.part(K.ragLimb(f, lerp(EN, WN, 0.45), lerp(EN, WN, 0.95), 70, 64, { depth: 4, teeth: 3 }), ROCH({ fill: '#c8c2b6' })); // the rochet's cuff
  f.bone('hand_n');
  X.openHand(f, add(WN, [2, -4]), -0.55, 100, { look: { fill: skin, shadow: skinS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.4, maxShade: 6 }, back: true, flip: true, spread: 0.1, curl: 0.18, nail: '#a89a8c' });
  // ---- the ash of the world, settled round his feet and on the floor, never on him
  f.bone('root');
  for (const [c, w, h] of [[[380, gy], 260, 34], [[720, gy], 240, 30]]) X.ashHeap(f, c, w, h);
  X.ash(f, [540, gy - 40], 10, 300, 60, 1.2);
  return f;
}

// ------------------------------------------------------------------ PYRE SERAPH (elite, 2.4)
// An angel sent to put out the pyre. It went in to look. A tall angel hovering, six wings spread and burned to black
// skeletons: charred bones from shoulder to wingtip, the feathers gone to stubs of quill with a few lace tufts, edged
// all along in black flame with violet edges. The body is grey ash held together by will: cracked into violet-lipped
// seams, flaking, crumbling at the edges, ash falling from it; a long ash robe whose hem crumbles away. The halo is broken
// and its gold burned black (the Saint's halo stays the only gold). The face is beautiful, and half of it is burned away
// to a void with a clean rim; in the dark where that half was, one eye is open: it went in to look (the void's eye).
// Rig: standard humanoid + wing_n1..3, wing_f1..3 (torso) + halo (head) + robe (pelvis).
// Motion: idle slow wing beats shedding ash; attack a dive of black fire (wings swept back, body pitched forward).
function pyreSeraph() {
  const [CW, CH] = TIERS.elite, seed = 1302;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const H = 168, gy = f.o.groundY;
  const ASHB = (o = {}) => Object.assign({ fill: '#8e8a88', shadow: '#2c2630', light: '#c4c0ba', shade: 0.36, tex: 'craze' + seed, texOp: 0.4 }, o);
  const ROBE = (o = {}) => Object.assign({ fill: '#76726e', shadow: '#24202a', light: '#a8a49e', shade: 0.4, tex: 'weave' + seed, texOp: 0.35 }, o);
  const BONE = (o = {}) => Object.assign({ fill: P.charL, shadow: P.charS, light: '#8a807c', shade: 0.4, tex: 'craze' + seed, texOp: 0.5 }, o);
  const N = [580, 470], C = [574, 620], Pv = [560, 790];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.4, 0.1);
  const EN = [500, 690], WN = [470, 840];        // near arm hanging open at the side
  const EF = [700, 600], WF = [820, 600];        // far arm reaching toward the party, palm down
  const HN = S.at(-0.2, 1.0), KN = [548, 1000], AN = [540, 1170];
  const HF = S.at(0.3, 1.0), KF = [612, 990], AF = [616, 1160];
  const HC = [612, 352], hA = 0.12, neck0 = S.at(0.12, -0.04);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('halo', HC, 'head').joint('robe', S.at(0, 0.84), 'pelvis');
  // six wings, each shoulder -> elbow -> wrist -> tip with the hand breaking back at the wrist; the near three spread back
  // behind it (upper raised, middle level, lower lowered over the feet), the far three foreshortened behind the body
  const W = {
    // final pass 2026-11-25: the six wings read as near-radial spokes (each pair mirrored, every bone line pointing out
    // from the body). Now each pair does its own work and the two sides differ: the upper pair raised and arched over the
    // halo, the hands breaking forward so the tips curl in above the head (the pair that covers the face); the middle
    // pair are the flying wings, bent hard at the wrist with the primaries swept back and down, the near one lower and
    // further back than the far; the lower pair hang folded down beside the robe, their hands turning in toward the
    // dangling feet (the pair that covers the feet), the far one crossing behind the shins
    n1: [S.at(-0.5, 0.06), [430, 320], [360, 180], [470, 104], 1], n2: [S.at(-0.5, 0.16), [380, 580], [210, 560], [90, 720], -1], n3: [S.at(-0.46, 0.26), [430, 780], [400, 950], [470, 1110], -1],
    f1: [S.at(0.1, 0.06), [700, 330], [800, 180], [700, 100], -1], f2: [S.at(0.12, 0.14), [760, 500], [900, 410], [1060, 430], 1], f3: [S.at(0.1, 0.24), [690, 760], [700, 930], [610, 1070], 1],
  };
  for (const [k, [r, e, w]] of Object.entries(W)) f.joint('wing_' + k, r, 'torso').joint('wing_' + k + '_2', e, 'wing_' + k).joint('wing_' + k + '_3', w, 'wing_' + k + '_2');
  const wing = (k, far) => { const [r, e, w, tp, tr] = W[k]; return X.burntWing(f, r, e, w, tp, { bones: ['wing_' + k, 'wing_' + k + '_2', 'wing_' + k + '_3'], tr, dim: far ? 0.35 : 0, gone: 0.12, bare: k.endsWith('1') ? 0.5 : 0.35, np: 9, ns: 9 }); };
  // a hand of ash: cracks across the knuckles, a split along the back, the fingertips crumbling and shedding ash
  const handAsh = h => { X.hairline(f, [h.fing[0].k0, h.fing[1].k0, h.fing[2].k0, h.fing[3].k0], 1.4); X.hairline(f, [h.F([[0.05, 0.1]])[0], h.F([[0.2, 0.0]])[0], h.F([[0.34, 0.06]])[0]], 1.2); h.fing.forEach(g => { if (!g.cut) X.ash(f, g.k3, 2, 8, -26, 0.6); }); };
  // ---- far wings, behind everything
  wing('f1', true); wing('f2', true); wing('f3', true);
  // ---- the broken halo: a ring of blackened gold, cracked through, a piece hanging off it
  f.bone('halo');
  { const hc = add(HC, [-30, -10]), r0 = 160, e = ell(hc, r0, r0 * 0.96, 0, 60);
    const arc1 = e.slice(8, 44), arc2 = e.slice(48, 60).concat(e.slice(0, 4));
    for (const arc of [arc1, arc2]) { f.line(arc, 26, INK); f.line(arc, 21, '#2e2824'); f.line(arc, 8, '#3e3630', { op: 0.8 }); f.line(arc.map(q => add(q, [0, -2])), 3, '#5a504a', { op: 0.6 }); f.line(arc, 1.4, P.vio, { op: 0.6, dash: '6 10' }); }
    const pc = add(e[46], [10, 40]); f.part([add(pc, [-20, -6]), add(pc, [16, -10]), add(pc, [20, 4]), add(pc, [-16, 8])], { fill: '#2e2824', shadow: '#0a0808', shade: 0.35, inkW: 1.4, cast: false }); // the fallen piece, hanging in the air
    for (const q of [e[44], e[48], e[4], e[8]]) f.flat(ell(q, 5, 5, 0, 6), '#14100e'); }
  // ---- far arm reaching toward the party, the far leg dangling
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 54, 44, ASHB({ fill: mix('#8e8a88', '#000', 0.2) }), '_f', { lit: '#c4c0ba', vein: false });
  f.bone('forearm_f'); X.crackNet(f, lerp(EF, WF, 0.3), 0, 60, 1.8, { depth: 1 });
  f.bone('hand_f');
  const hF2 = X.openHand(f, lerp(EF, WF, 0.88), ang(EF, WF) + 0.15, 130, { look: ASHB({ fill: mix('#8e8a88', '#000', 0.15), maxShade: 8 }), back: true, flip: true, spread: 0.24, curl: 0.35, curls: [0.3, 0.2, 0.4, 0.55], bend: [0.1, 0, -0.08, -0.2], nail: '#4a4448', cut: [0, 0, 0.55, 0], tips: '#4a4448' });
  handAsh(hF2);
  for (const [Hp, Kn, A, sfx, tone] of [[HF, KF, AF, '_f', 0.22], [HN, KN, AN, '_n', 0]]) {
    const lk = ASHB({ fill: mix('#8e8a88', '#000', tone) });
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 100, 70, { steps: 8 }), lk);
    f.bone('shin' + sfx); f.part(limb(Kn, A, 70, 44, { steps: 8, q: [[0.25, 0.2, 0.2]] }), lk);
    f.bone('foot' + sfx); // the foot hanging, toes pointed down: it does not stand
    const ft = [add(A, [-22, -8]), add(A, [20, -10]), add(A, [30, 30]), add(A, [36, 74]), [...add(A, [28, 96]), 1], add(A, [14, 92]), add(A, [6, 60]), add(A, [-20, 24])];
    f.part(ft, Object.assign({}, lk, { maxShade: 8 }));
    for (let i = 0; i < 3; i++) f.line([add(A, [16 + i * 6, 84 - i * 3]), add(A, [20 + i * 6, 96 - i * 4])], 1, INK, { op: 0.6 });
    f.flat(ell(add(A, [6, 6]), 7, 5, 0, 8), mix(lk.fill, '#fff', 0.2), { op: 0.5 });
    X.ash(f, add(A, [26, 100]), 5, 20, -60, 0.9);
  }
  // ---- torso and the ash robe: belted under the breast, falling past the knees and crumbling away at the hem
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.4, 0.4], [0.06, 0.66, 0.58], [0.22, 0.68, 0.66], [0.42, 0.56, 0.58], [0.62, 0.46, 0.44], [0.8, 0.52, 0.48], [0.96, 0.56, 0.52]]);
  const tD = E.smooth(torso);
  X.cutHoles(f, [[S.at(0.18, 0.5), 15]], () => {
    f.part(torso, ASHB({ maxShade: 22 }));
    X.clipDraw(f, tD, () => {
      X.softTone(f, tD, [[[S.at(-0.7, 0.0), S.at(-0.2, 0.0), S.at(-0.2, 1.0), S.at(-0.7, 1.0)], '#1a1620', 0.45, 12], [[S.at(0.1, 0.1), S.at(0.6, 0.12), S.at(0.5, 0.3), S.at(0.1, 0.3)], '#e0dcd6', 0.35, 8]]);
      // a statue's anatomy gone to ash: pectorals, the sternum, the ribs under them, the belly's segments, the iliac line
      X.crease(f, [S.at(-0.1, 0.12), S.at(0.1, 0.3), S.at(0.38, 0.32), S.at(0.6, 0.24)], 2.6, { col: '#2c2630', lit: '#d0ccc6' });
      X.crease(f, [S.at(0.08, 0.06), S.at(0.1, 0.2), S.at(0.12, 0.4)], 1.8, { col: '#2c2630', lit: '#d0ccc6', op: 0.6 });
      for (let i = 0; i < 4; i++) X.crease(f, [S.at(-0.4, 0.34 + i * 0.07), S.at(-0.1, 0.38 + i * 0.075), S.at(0.1, 0.36 + i * 0.08)], 1.8, { col: '#2c2630', lit: '#d0ccc6', op: 0.5 });
      for (let i = 0; i < 3; i++) X.crease(f, [S.at(0.1, 0.48 + i * 0.09), S.at(0.3, 0.49 + i * 0.09), S.at(0.46, 0.47 + i * 0.09)], 1.8, { col: '#2c2630', lit: '#d0ccc6', op: 0.55 });
      X.crease(f, [S.at(0.12, 0.46), S.at(0.16, 0.6), S.at(0.18, 0.74)], 1.8, { col: '#2c2630', lit: '#d0ccc6', op: 0.6 });
      X.crease(f, [S.at(-0.2, 0.7), S.at(0.1, 0.8), S.at(0.3, 0.86)], 2, { col: '#2c2630', lit: '#d0ccc6', op: 0.55 });
      // held together by will: cracked into violet-lipped seams, flaking, ash caked in the hollows
      X.crackNet(f, S.at(0.0, 0.3), 0.4, 90, 2, { depth: 2 }); X.crackNet(f, S.at(-0.3, 0.6), 1.2, 70, 1.8, { depth: 1 });
      X.flakes(f, S.at(-0.2, 0.4), 40, 50, 7, 1);
      X.ashCake(f, S.at(0.0, 0.6), 40, 40, 6, 1);
    });
  }, { shape: tD });
  f.bone('robe');
  const hem = X.charHem(f, [470, 1150], [680, 1136], 11, 40, [0, 1]);
  const robe = [S.at(-0.54, 0.72), S.at(0.5, 0.7), [650, 900], [672, 1040], [680, 1136], ...hem.slice().reverse(), [466, 1060], [480, 900]];
  X.cutHoles(f, [[[520, 930], 18], [lerp(hem[3], hem[4], 0.5), 16]], () => f.part(robe, ROBE({ maxShade: 34 })), { shape: E.smooth(robe) });
  X.clipDraw(f, E.smooth(robe), () => {
    X.softTone(f, E.smooth(robe), [[[[460, 800], [510, 800], [500, 1150], [460, 1150]], '#000', 0.4, 12], [[[600, 800], [620, 800], [640, 1140], [612, 1140]], '#ffffff', 0.2, 8]]);
    for (const q of [[[530, 800], [524, 960], [520, 1140]], [[580, 800], [588, 960], [596, 1130]], [[630, 820], [650, 980], [664, 1130]], [[490, 840], [484, 980], [482, 1140]]]) X.crease(f, q, 3.2, { col: '#24202a', lit: '#b8b4ae' });
    X.crackNet(f, [560, 900], 1.6, 90, 2, { depth: 2 });
  });
  for (let i = 0; i < 14; i++) { const q = lerp(hem[0], hem[hem.length - 1], i / 13), l = R(f, 30, 90); f.stroke([add(q, [0, 4]), add(q, [R(f, -6, 6), l * 0.5]), add(q, [R(f, -10, 10), l])], R(f, 4, 9), '#76726e', { op: 0.45 }); } // the hem crumbling into falling ash
  X.ash(f, [560, 1080], 18, 220, -200, 1.2);
  f.bone('torso');
  // what is left of the robe above the girdle: a burnt panel over the far shoulder, falling across to the waist
  { const pan = [S.at(0.2, -0.04), S.at(0.5, 0.02), S.at(0.6, 0.2), S.at(0.54, 0.5), S.at(0.52, 0.72), ...X.charHem(f, S.at(0.44, 0.72), S.at(0.3, 0.1), 6, 18, E.norm(sub(S.at(-0.3, 0.4), S.at(0.4, 0.4)))).slice(0), S.at(0.24, 0.04)];
    f.part(pan, ROBE({ maxShade: 18 }));
    X.clipDraw(f, E.smooth(pan), () => { X.crease(f, [S.at(0.36, 0.06), S.at(0.44, 0.3), S.at(0.46, 0.6)], 2.6, { col: '#24202a', lit: '#b8b4ae' }); X.stains(f, E.smooth(pan), E.bbox(pan), P.charS, 0.03, 3, -1.4, 91, 0.8); });
    X.charEdge(f, pan.slice(5, -1), 6, { gap: 4 }); }
  X.rope(f, [S.at(-0.52, 0.7), S.at(0.0, 0.74), S.at(0.5, 0.68)], 7, '#5a5652');
  // ---- head: a beautiful face, half burned away to a void with a clean rim; in the void, one eye, open
  f.bone('head');
  f.part(limb(neck0, add(HC, [-24, 40]), 64, 58), ASHB());
  const hd = B.head(f, HC, H, hA, { skin: '#a8a4a0', jaw: 0.9, chin: -0.02, nose: 0.98, hook: 0.0, mouth: 'set', squint: 0.25, browDown: -0.02, lips: true, lashes: true, faceShade: 0.78, faceHatch: false, iris: '#6a6470', hairCol: '#5e5a58', browCol: '#4a4648', browW: 0.035,
    hair: [[-0.44, 0.06], [-0.5, -0.24], [-0.36, -0.5], [-0.08, -0.6], [0.2, -0.52], [0.26, -0.4], [0.06, -0.42], [-0.1, -0.34], [-0.22, -0.16], [-0.3, 0.06]] });
  X.greyFace(f, hd, '#a8a4a0', 0.98);
  for (let i = 0; i < 6; i++) X.hairClump(f, hd([[-0.4 + i * 0.1, -0.3 - i * 0.03], [-0.34 + i * 0.1, -0.46 - i * 0.02], [-0.22 + i * 0.1, -0.58]]), 9, { pal: ['#3e3a3a', '#5e5a58', '#8a8682'], gap: false, n: 3 }); // short ash curls
  // the void: the back and top of the head unmade along a clean curve; inside it the dark and one open eye
  const vc = hd([[-0.04, -0.22]])[0], vr = H * 0.27, vb = ell(vc, vr, vr, 0, 40);
  const headD = E.smooth(hd([[-0.46, 0.2], [-0.52, -0.2], [-0.38, -0.52], [-0.08, -0.62], [0.2, -0.54], [0.34, -0.32], [0.36, 0.0], [0.33, 0.25], [0.3, 0.46], [0.13, 0.54], [-0.06, 0.48], [-0.24, 0.3]]));
  X.clipDraw(f, headD, () => X.clipDraw(f, E.smooth(vb), () => {
    f.flat(ell(HC, H * 0.8, H * 0.8, 0, 30), '#040306');
    f.flat(ell(hd([[0.0, -0.2]])[0], H * 0.2, H * 0.18, 0, 20), P.vioS, { op: 0.9 });
    X.voidEye(f, hd([[0.08, -0.12]])[0], 14, hA);
  }));
  X.clipDraw(f, headD, () => { f.line(vb.concat([vb[0]]), 1.6, P.ashL, { op: 0.9 }); f.line(ell(vc, vr + 3, vr + 3, 0, 40).concat([ell(vc, vr + 3, vr + 3, 0, 40)[0]]), 1.2, P.vio, { op: 0.7 }); });
  // the clean rim drawn above
  X.ash(f, hd([[0.0, -0.6]])[0], 8, 50, 120, 1);
  // ---- near wings, then the near arm in front of them
  wing('n3', false); wing('n2', false); wing('n1', false);
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 58, 46, ASHB(), '_n', { lit: '#c4c0ba', vein: false });
  f.bone('upperarm_n'); X.crackNet(f, lerp(SN, EN, 0.5), 1.4, 70, 2, { depth: 1 }); X.flakes(f, lerp(SN, EN, 0.4), 14, 30, 4, 0.9);
  f.bone('hand_n');
  const hN2 = X.openHand(f, lerp(EN, WN, 0.88), ang(EN, WN) + 0.1, 130, { look: ASHB({ maxShade: 8 }), back: true, flip: false, spread: 0.16, curl: 0.45, curls: [0.35, 0.45, 0.55, 0.7], nail: '#4a4448', tips: '#4a4448' });
  handAsh(hN2);
  X.ash(f, add(WN, [0, 60]), 10, 60, -160, 1);
  f.bone('root');
  f.flat(ell([570, gy], 200, 12, 0, 18), '#000', { op: 0.28 }); // its shadow on the floor far below
  X.ashHeap(f, [570, gy], 260, 18);
  return f;
}

module.exports = {
  heroes: [
    { key: 'saint_unending', name: 'The Saint Unending', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: saintUnending },
    { key: 'unburnt_inquisitor', name: 'The Unburnt Inquisitor', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: unburntInquisitor },
    { key: 'pyre_seraph', name: 'Pyre Seraph', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: pyreSeraph },
    { key: 'ash_penitent', name: 'Ash Penitent', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: ashPenitent },
    { key: 'cinder_hound', name: 'Cinder Hound', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: cinderHound },
    { key: 'censer_deacon', name: 'Censer Deacon', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: censerDeacon },
    { key: 'candle_wraith', name: 'Candle Wraith', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: candleWraith },
    { key: 'pyre_knight', name: 'Pyre Knight', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: pyreKnight },
  ],
};
