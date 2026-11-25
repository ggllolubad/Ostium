// World IX, The Hollow Barrow (Frost + Toxin, cryo-rot). A plague-struck kingdom that buried itself alive to stop the
// plague; the cold preserved everything, the plague included. Frost (dominant) keeps the bodies grey and stiff, rimed in
// the hollows; toxin blooms on them anyway: grey-green mould, plague sores and buboes, fungal fur, grave caps.
// The cast are the buried household, the barrow's guards, its sick and its scavengers: each reads as who it was in life.
// Palette: grey-green frost, bone, mould; plus ink black and grey (rust, tarnished silver, black frostbite where named).
// Foes face left: every figure is drawn facing right with kit.foeBase (key light upper right in drawing space) and
// flipped. Windward = drawing -x (the barrow's cold pours down the passage behind them) and every hollow.
// Built for the rig from the start: joints first, f.bone() before every part, parts drawn whole, overlaps at the joints.
'use strict';
const K = require('../kit');
const X = require('./kit_IX');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang } = X;
const deg = d => d * Math.PI / 180;

// ------------------------------------------------------------------ BARROW DRAUGR (cast, human 1.05)
// A household warrior buried with his axe so he could keep fighting. Stooped from the upper back, stiff-kneed, the far
// arm raised with the bearded axe cocked back over the hump for the chop; the near arm hangs forward with the frozen hand
// still clawed. Rotting mail byrnie over a wool tunic, wool trousers and shin wraps, rotted turnshoes. Frost packed in
// the eye sockets, a frozen braided beard, mould on the cheek and in the mail's rents.
// Rig: standard humanoid + axe (parent hand_f) + cape (pelt) + hair (plait). Motion: idle a stiff sway; attack the chop.
function draugr() {
  const [CW, CH] = TIERS.human, seed = 903;
  const f = new Fig(X.base(seed, CH, { grimeY: 600 }));
  X.textures(f); const FX = X.fx(f);
  const H = 104, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, o);
  const mailC = '#5b5f58', tunic = P.wool, trou = mix(P.wool, P.furD, 0.3);
  const MAIL = (o = {}) => Object.assign({ fill: mailC, shadow: '#262826', tex: 'mail' + seed, texOp: 0.85, shade: 0.4 }, o);
  const WOOL = (o = {}) => Object.assign({ fill: tunic, shadow: '#24251f', tex: 'weave' + seed, texOp: 0.5 }, o);
  const N = [330, 344], C = [284, 430], Pv = [262, 508];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.32, 0.17), SF = S.at(0.45, 0.1);
  const EN = [326, 456], WN = [446, 480];                      // near arm hanging forward, the claw still reaching
  const EF = [298, 250], WF = [346, 136];                      // far arm raised: elbow cocked back over the hump, fist above the crown
  const HN = S.at(-0.25, 1.0), KN = [214, 630], AN = [188, 748];
  const HF = S.at(0.32, 1.0), KF = [338, 622], AF = [356, 748];
  const neck0 = S.at(0.2, -0.04), HC = [372, 292], hA = 0.16;
  const axA = ang(EF, WF) - Math.PI / 2, axD = [Math.cos(axA), Math.sin(axA)]; // haft square to the forearm, head on the thumb side
  const axHead = add(WF, mul(axD, 178)), axButt = add(WF, mul(axD, -34));
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('axe', WF, 'hand_f').joint('cape', S.at(-0.3, 0.02), 'torso').joint('hair', add(HC, [-46, 6]), 'head');

  // ---- the axe, behind everything (it is raised over the far side): ash haft, rope grip, iron bearded head
  f.bone('axe');
  f.part(limb(axButt, axHead, 13, 12, { steps: 8 }), { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.7 });
  f.line([lp(axButt, axHead, 0.03, -3), lp(axButt, axHead, 0.95, -3)], 1, P.woodL, { op: 0.6, straight: true });
  for (const t of [0.42, 0.46, 0.5]) f.line([lp(axButt, axHead, t, -8), lp(axButt, axHead, t + 0.015, 8)], 2.6, P.linenD, { straight: true }); // a cord binding over a split
  f.line([lp(axButt, axHead, 0.44, 0), lp(axButt, axHead, 0.52, 3)], 1, INK, { op: 0.6 });
  {
    // the head: eye round the haft, a long beard hooking down toward the hand, the edge facing up and forward (the chop)
    const F0 = frame(axHead, axA, 1), F = pts => F0(pts.map(q => q.length > 2 ? [q[0], -q[1], q[2]] : [q[0], -q[1]])); // local +x along the haft away from the hand, -y = edge side (up and forward)
    f.part(F([[-16, -10], [14, -10], [16, 10], [-16, 10]]), { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.4 });
    const blade = F([[-10, -9], [12, -9], [20, -30], [26, -58, 1], [-4, -70], [-40, -64], [-62, -58, 1], [-50, -44], [-30, -30], [-16, -12]]);
    f.part(blade, { fill: mix(P.iron, P.rust, 0.3), shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.8, inkW: 1.6 });
    f.part(F([[26, -58, 1], [-4, -70], [-40, -64], [-62, -58, 1], [-58, -52], [-36, -58], [-4, -63], [22, -53]]), { fill: P.ironL, shadow: P.iron, shade: 0.3, inkW: 1, cast: false }); // the honed edge, worn bright
    for (const [x, d] of [[-20, 4], [6, 3]]) f.flat(F([[x - 3, -66], [x + 3, -67], [x, -66 + d * 2]]), '#121212'); // nicks
    f.flat(F(ell([-14, -34], 12, 9, 0.3, 10)), P.rust, { op: 0.6 });
    f.flat(F(ell([4, -24], 6, 4, 0, 8)), P.rustD, { op: 0.7 });
    FX.rime(F([[16, -14], [20, -34], [24, -56]]), 6, 1);
    X.mould(f, F([[-24, -48]])[0], 9, 6, { rings: 1 });
    FX.icicle(F([[-50, -48]])[0], 22, 5);
    f.rivet(F([[0, 0]])[0], 3, P.ironL);
  }

  // ---- far arm, raised behind the head: wool sleeve under a mail sleeve to the elbow, bare grey forearm
  const [cUF, cFF] = jcut(SF, EF, WF, 22);
  split(f, () => {
    f.part(X.jointLimb(SF, EF, lerp(EF, WF, 0.9), [52, 42, 36], { point: 0.35, mus0: 0.14, mus1: 0.18 }), SKd({ fill: mix(P.skin, P.skinD, 0.25), maxShade: 14 }));
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('upperarm_f');
  f.part(K.ragLimb(f, SF, lerp(SF, EF, 0.86), 58, 52, { depth: 8, teeth: 6 }), MAIL({ fill: mix(mailC, '#000', 0.15) }));
  f.bone('forearm_f');
  X.creases(f, lerp(EF, WF, 0.2), ang(EF, WF) + Math.PI / 2, 22, 3, INK, 0.5);
  f.part(plate(EF, WF, 0.55, 0.78, 44, 42), { fill: P.silver, shadow: P.silverD, tex: 'mottle' + seed, texOp: 0.5, shade: 0.4 }); // a twisted arm ring, grave silver gone dark
  for (let i = 0; i < 4; i++) f.line([lp(EF, WF, 0.57 + i * 0.05, -20), lp(EF, WF, 0.6 + i * 0.05, 20)], 1.1, INK, { op: 0.6 });
  X.livid(f, lerp(EF, WF, 0.35), 12, 18, 4); X.mould(f, lp(EF, WF, 0.3, -6), 8, 11, { rings: 1 });
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, axA, 26, mix(P.skin, P.skinD, 0.2), { shadow: P.skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'draugr axe' });
  X.fistDetail(f, gF, 26, P.skin, { nail: '#4a4844' });

  // ---- the pelt cape: a wolfskin scrap over the far shoulder and down the back, stiff with frost
  f.bone('cape');
  const cape = [S.at(0.3, -0.06), S.at(-0.2, -0.08), S.at(-0.7, 0.04), S.at(-0.92, 0.22), [...S.at(-0.96, 0.46), 1], S.at(-0.84, 0.42), [...S.at(-0.88, 0.62), 1], S.at(-0.7, 0.52), [...S.at(-0.66, 0.66), 1], S.at(-0.5, 0.46), S.at(-0.3, 0.22), S.at(0.1, 0.12)];
  f.part(cape, { fill: P.fur, shadow: P.furD, tex: 'fur' + seed, texOp: 0.9, shade: 0.4 });
  for (let i = 0; i < 5; i++) X.hairClump(f, [S.at(-0.9 + i * 0.08, 0.2 + i * 0.04), S.at(-0.94 + i * 0.07, 0.36 + i * 0.05), S.at(-0.9 + i * 0.06, 0.5 + i * 0.04)], 9, { gap: false, n: 3 });
  FX.rime([S.at(-0.2, -0.1), S.at(-0.6, 0.0), S.at(-0.9, 0.2), S.at(-0.98, 0.42)], 9, 1);
  FX.icicles([S.at(-0.96, 0.46), S.at(-0.88, 0.62), S.at(-0.66, 0.66)], 4, 22, 5);

  // ---- far leg (forward): wool trouser to the knee, shin wraps, rotted turnshoe
  const leg = (Hp, Kn, A, sfx, look, wr) => {
    const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => {
      f.part(X.jointLimb(Hp, Kn, lerp(Kn, A, 0.92), [76, 54, 40], { point: 0.3, mus0: 0.1, mus1: 0.18 }), Object.assign({ maxShade: 20 }, look));
    }, [['thigh' + sfx, side(Kn, mul(de, -1), 30)], ['shin' + sfx, side(Kn, de, 30)]]);
    f.bone('thigh' + sfx);
    f.stroke([lp(Hp, Kn, 0.55, 22), lp(Hp, Kn, 0.72, 6), lp(Hp, Kn, 0.84, -18)], 2.2, '#1a1a16'); // folds dragging to the knee
    f.stroke([lp(Hp, Kn, 0.25, -14), lp(Hp, Kn, 0.4, 0), lp(Hp, Kn, 0.45, 14)], 1.8, '#1a1a16');
    f.bone('shin' + sfx);
    // linen wraps over the wool from knee to ankle, crossed by a garter thong
    const a = lerp(Kn, A, 0.12), b = lerp(Kn, A, 0.94);
    f.part(K.chain([a, lerp(a, b, 0.45), b], [48, 46, 36]), { fill: wr, shadow: P.linenD, tex: 'weave' + seed, texOp: 0.6, inkW: 1.3, cast: false });
    X.wraps(f, a, b, 48, 36, 7, wr, { stain: 0.5 });
    f.line([lp(a, b, 0.05, -22), lp(a, b, 0.4, 22), lp(a, b, 0.75, -20), lp(a, b, 0.98, 16)], 2.2, P.leatherD);
    f.line([lp(a, b, 0.05, 22), lp(a, b, 0.4, -22), lp(a, b, 0.75, 20)], 2.2, P.leather, { op: 0.9 });
    split(f, () => B.boot(f, A, 1, 50, P.leather, { shaft: 0.42, tex: 'mottle' + seed, toe: 1.12 }), [['shin' + sfx, side(A, mul(da, -1), 18)], ['foot' + sfx, side(A, da, 18)]]);
    f.bone('foot' + sfx);
    f.flat([add(A, [44, 18]), add(A, [62, 26]), add(A, [56, 36]), add(A, [42, 32])], P.skinD); // the rotted toe-cap: a grey toe through it
    f.line([add(A, [44, 18]), add(A, [62, 26])], 1.2, INK, { op: 0.8 });
    FX.frost(add(A, [10, 26]), 34, 10, 8);
  };
  leg(HF, KF, AF, '_f', WOOL({ fill: mix(trou, '#000', 0.1) }), mix(P.linen, P.linenD, 0.3));

  // ---- torso: wool tunic, mail byrnie over it to mid-thigh, torn open over the ribs
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.3, 0.36], [0.04, 0.62, 0.5], [0.16, 0.8, 0.64], [0.32, 0.78, 0.7], [0.5, 0.66, 0.66], [0.7, 0.58, 0.6], [0.88, 0.6, 0.6], [1.04, 0.6, 0.56], [1.14, 0.5, 0.42]]);
  f.part(torso, WOOL());
  f.bone('pelvis');
  // tunic hem below the byrnie, ragged, then the byrnie skirt over the hips (both on the pelvis so the stride drags them)
  const tHem = [S.at(-0.78, 0.9), S.at(0.72, 0.9), S.at(0.86, 1.08), add(S.at(0.84, 1.22), [6, 26]), [...add(S.at(0.6, 1.22), [0, 34]), 1], add(S.at(0.36, 1.2), [0, 22]), [...add(S.at(0.1, 1.22), [0, 36]), 1], add(S.at(-0.2, 1.2), [0, 20]), [...add(S.at(-0.5, 1.22), [-4, 32]), 1], add(S.at(-0.8, 1.16), [-8, 18]), S.at(-0.86, 1.0)];
  f.part(tHem, WOOL({ fill: mix(tunic, P.mould, 0.15) }));
  X.stains(f, E.smooth(tHem), [150, 470, 420, 620], P.mouldD, 0.03, 2.4, -1.2, 11, 0.55);
  const bSk = [S.at(-0.66, 0.74), S.at(0.7, 0.72), S.at(0.8, 0.96), add(S.at(0.82, 1.12), [4, 10]), [...add(S.at(0.66, 1.12), [0, 18]), 1], add(S.at(0.4, 1.12), [0, 8]), [...add(S.at(0.14, 1.12), [0, 22]), 1], add(S.at(-0.16, 1.1), [0, 6]), [...add(S.at(-0.46, 1.12), [0, 18]), 1], add(S.at(-0.74, 1.08), [-6, 6]), S.at(-0.74, 0.9)];
  f.part(bSk, MAIL());
  for (const [u, v] of [[0.3, 1.0], [-0.4, 0.98]]) { const q = S.at(u, v); f.flat(ell(q, 10, 7, 0.3, 10), '#121210'); f.line(ell(q, 12, 9, 0.3, 10).slice(0, 7), 1.4, P.rust, { op: 0.8 }); } // rents with rusted ring ends
  for (let i = 0; i < 6; i++) { const q = S.at(-0.7 + i * 0.26, 1.08); f.stroke([q, add(q, [2, 14]), add(q, [0, 22 + (i % 3) * 8])], 3, P.rust, { op: 0.55 }); } // rust run down from the hem
  f.bone('torso');
  const byr = S.shape([[-0.06, 0.36, 0.44], [0.04, 0.68, 0.56], [0.16, 0.86, 0.72], [0.32, 0.84, 0.78], [0.5, 0.72, 0.74], [0.7, 0.66, 0.68], [0.86, 0.68, 0.68]]);
  f.part(byr, MAIL());
  // the rent over the ribs: grey skin and ribs showing through, mould grown into it, the broken ring ends rusted
  const rent = [S.at(0.42, 0.4), S.at(0.7, 0.36), S.at(0.78, 0.5), S.at(0.68, 0.64), S.at(0.46, 0.62), S.at(0.38, 0.5)];
  f.part(rent, SKd({ inkW: 1.3, cast: false }));
  for (let i = 0; i < 3; i++) X.crease(f, [S.at(0.4, 0.44 + i * 0.07), S.at(0.56, 0.42 + i * 0.07), S.at(0.74, 0.46 + i * 0.07)], 3, { col: '#1e1c1a', lit: P.skinL });
  X.mould(f, S.at(0.5, 0.58), 12, 8, { rings: 1 });
  f.line(rent.concat([rent[0]]), 2.2, P.rust, { op: 0.75 });
  for (const q of rent) f.flat(ell(add(q, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 6]), 3, 2, 0, 6), P.rustL, { op: 0.8 });
  // mail neckline and the tunic collar under it
  f.part([S.at(-0.4, -0.06), S.at(0.38, -0.04), S.at(0.5, 0.06), S.at(0.1, 0.1), S.at(-0.44, 0.08)], WOOL({ fill: mix(tunic, '#000', 0.1), inkW: 1.3 }));
  f.line([S.at(-0.4, 0.1), S.at(0.0, 0.14), S.at(0.5, 0.1)], 2.4, mix(mailC, '#000', 0.4));
  // rime on the hump (windward), fungal fur along the shoulder line, a bubo swelling in the near armpit
  FX.rime([S.at(-0.4, 0.02), S.at(-0.78, 0.14), S.at(-0.98, 0.32), S.at(-1.0, 0.5)], 10, 1);
  X.fungalFur(f, [S.at(-0.6, 0.06), S.at(-0.2, -0.02), S.at(0.2, -0.02)], 7, 1);
  X.mould(f, S.at(-0.55, 0.62), 16, 12); X.mould(f, S.at(0.0, 0.3), 10, 8, { rings: 1 });
  FX.frost(S.at(-0.4, 0.4), 26, 40, 10);
  // belt round the waist: a seax in its sheath slung across the front, a pouch, a bone comb tied on
  f.part([S.at(-0.66, 0.74), S.at(0.7, 0.72), S.at(0.72, 0.8), S.at(-0.68, 0.82)], { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.5, shade: 0.4 });
  f.part([S.at(0.36, 0.72), S.at(0.5, 0.72), S.at(0.5, 0.81), S.at(0.36, 0.81)], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.1, sharp: true });
  f.line([S.at(0.38, 0.765), S.at(0.6, 0.77)], 2, P.leatherD);
  {
    const s0 = S.at(-0.42, 0.86), s1 = S.at(0.36, 0.92); // seax sheath hanging under the belt from two thongs
    f.part(limb(s0, s1, 22, 14, { steps: 6, capK: 0.6 }), { fill: P.leatherL, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4 });
    for (const t of [0.1, 0.5, 0.86]) f.line([lp(s0, s1, t, -10), lp(s0, s1, t + 0.02, 10)], 1.6, P.iron);
    f.stitches([lp(s0, s1, 0.05, 6), lp(s0, s1, 0.95, 4)], P.linenL, 0.8);
    const g0 = lp(s0, s1, -0.02, 0), g1 = lp(s0, s1, -0.22, -2);
    f.part(limb(g1, g0, 14, 13, { steps: 4 }), { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 1.1, cast: false });
    for (let i = 1; i < 4; i++) f.line([lp(g1, g0, i / 4, -6), lp(g1, g0, i / 4, 6)], 0.9, INK, { op: 0.5 });
    f.line([S.at(-0.36, 0.79), lp(s0, s1, 0.1, -10)], 2, P.leatherD); f.line([S.at(0.2, 0.8), lp(s0, s1, 0.86, -8)], 2, P.leatherD);
  }
  f.part([S.at(0.52, 0.8), S.at(0.76, 0.8), S.at(0.78, 0.98), S.at(0.62, 1.02), S.at(0.5, 0.96)], { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4 }); // pouch
  f.part([S.at(0.5, 0.79), S.at(0.78, 0.79), S.at(0.76, 0.86), S.at(0.52, 0.86)], { fill: P.leatherL, shade: 0.4, inkW: 1.1 });
  f.flat(ell(S.at(0.64, 0.92), 5, 4, 0, 8), P.mould, { op: 0.8 });
  { const q = S.at(-0.62, 0.84); f.line([q, add(q, [-2, 14])], 1.2, P.linenD); f.part([add(q, [-14, 14]), add(q, [10, 14]), add(q, [10, 26]), add(q, [-14, 26])], { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 1, cast: false, sharp: true }); for (let i = 0; i < 6; i++) f.line([add(q, [-12 + i * 4, 26]), add(q, [-12 + i * 4, 32])], 1.6, P.boneD); } // bone comb

  // ---- head: bowed forward on the line of the neck; frost packed in the sockets, lips shrunk off the teeth, frozen beard
  f.bone('head');
  const hF = frame(HC, hA, H);
  // lank grey hair hanging plumb from the back of the skull, frozen in clumps
  const nape = hF([[-0.34, 0.0]])[0];
  for (let i = 0; i < 5; i++) { const p0 = add(nape, [6 - i * 8, -26 + i * 10]); X.hairClump(f, [p0, add(p0, [-6, 40]), add(p0, [-4, 78 + i * 6]), add(p0, [-8, 104 + i * 8])], 13 - i, { pal: [P.furD, P.grey, '#5e5e56'] }); }
  f.part(K.chain([add(neck0, [-8, 12]), hF([[-0.1, 0.42]])[0]], [56, 42]), SKd());
  X.crease(f, [add(neck0, [10, 4]), lerp(neck0, hF([[0.06, 0.44]])[0], 0.5), hF([[0.06, 0.44]])[0]], 2.4, { col: '#1e1c1a', lit: P.skinL }); // neck tendon
  X.sore(f, add(neck0, [-4, -6]), 6);
  B.head(f, HC, H, hA, {
    skin: P.skin, jaw: 1.12, chin: 0.02, nose: 1.04, hook: 0.35, mouth: 'snarl', blind: true, browDown: 0.06, faceShade: 0.8, jawShade: 0.55, gaunt: true, age: true,
    hairCol: '#5e5e56', browCol: '#3e3e38', beard: 'full', beardCol: '#6e6e66',
    hairBack: [[-0.44, 0.14], [-0.5, -0.16], [-0.4, -0.42], [-0.16, -0.54], [-0.26, -0.2], [-0.32, 0.1]],
    hair: [[-0.42, 0.04], [-0.44, -0.22], [-0.32, -0.44], [-0.08, -0.55], [0.16, -0.53], [0.3, -0.42], [0.18, -0.4], [0.02, -0.46], [-0.12, -0.36], [-0.22, -0.2], [-0.26, 0.0], [-0.32, 0.1]],
    hairLines: [[[-0.32, -0.4], [-0.1, -0.5], [0.14, -0.49]], [[-0.38, -0.2], [-0.22, -0.4], [0.0, -0.46]]],
  });
  X.greyFace(f, hF, P.skin, 1.04);
  // frost packed into both sockets, the lids gone
  FX.socket(hF([[0.11, -0.06]])[0], H * 0.085, H * 0.055, hA);
  FX.socket(hF([[0.29, -0.065]])[0], H * 0.035, H * 0.048, hA);
  f.flat(hF([[0.02, -0.12], [0.2, -0.12], [0.2, -0.1], [0.02, -0.1]]), INK, { op: 0.45 });
  // lips shrunk back off the teeth
  for (let i = 0; i < 5; i++) { const x = 0.18 + i * 0.026; f.flat(hF([[x, 0.272], [x + 0.022, 0.27], [x + 0.02, 0.3 + (i % 2) * 0.008], [x + 0.002, 0.302]]), i === 2 ? '#3a3632' : P.boneD); }
  f.line(hF([[0.17, 0.266], [0.25, 0.256], [0.32, 0.268]]), 1.4, '#2e2a28');
  X.mould(f, hF([[0.06, 0.12]])[0], 11, 8, { rings: 1 }); // mould blooming on the cheek
  X.peel(f, hF([[0.14, -0.3]])[0], 2, 1.1, 14);
  FX.rime(hF([[-0.38, -0.3], [-0.2, -0.5], [0.06, -0.56]]), 6, 1);
  // braided beard hanging plumb from the chin, iced
  const ch = hF([[0.2, 0.56]])[0];
  for (const [dx, l, w] of [[-14, 56, 11], [0, 70, 13], [12, 50, 10]]) { const p0 = add(ch, [dx, -6]); X.hairClump(f, [p0, add(p0, [1, l * 0.5]), add(p0, [-1, l])], w, { pal: ['#6e6e66', '#7e7e74', '#5a5a52'], n: 3 }); for (let k = 1; k < 4; k++) f.line([add(p0, [-w * 0.45, l * k / 4.2]), add(p0, [w * 0.45, l * k / 4.2 + 3])], 1.1, INK, { op: 0.55 }); FX.icicle(add(p0, [0, l - 2]), 4 + l * 0.08, 3); }
  f.bone('hair');
  X.hairClump(f, [add(HC, [-44, 4]), add(HC, [-52, 44]), add(HC, [-50, 86]), add(HC, [-54, 118])], 14, { pal: ['#5e5e56', P.grey] }); // a warrior's plait
  for (let k = 1; k < 5; k++) f.line([add(HC, [-58, 4 + k * 24]), add(HC, [-46, 10 + k * 24])], 1.1, INK, { op: 0.6 });
  f.line([add(HC, [-60, 100]), add(HC, [-46, 104])], 3, P.leatherD);

  // ---- near leg (back, the weight on it)
  leg(HN, KN, AN, '_n', WOOL({ fill: trou }), P.linen);
  f.bone('thigh_n');
  f.part([lp(HN, KN, 0.45, -18), lp(HN, KN, 0.45, 14), lp(HN, KN, 0.68, 14), lp(HN, KN, 0.68, -16)].map(q => [...q, 1]), WOOL({ fill: mix(trou, P.linenD, 0.4), inkW: 1.1 })); // a patch
  f.stitches([lp(HN, KN, 0.45, -18), lp(HN, KN, 0.45, 14), lp(HN, KN, 0.68, 14)], P.linenL, 0.8);

  // ---- near arm: mail sleeve to the elbow over wool, the bare forearm reaching, the hand still clawed
  const [cUN, cFN] = jcut(SN, EN, WN, 24);
  split(f, () => {
    f.part(X.jointLimb(SN, EN, lerp(EN, WN, 0.92), [50, 44, 30], { point: 0.4, mus0: 0.12, mus1: 0.38 }), SKd({ maxShade: 13 }));
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('forearm_n');
  X.veins(f, lerp(EN, WN, 0.5), 14, 8, 3); X.livid(f, lerp(EN, WN, 0.6), 16, 10, 4);
  X.sore(f, lp(EN, WN, 0.45, 10), 5.5); X.peel(f, lp(EN, WN, 0.7, -6), 2, 1, 12);
  FX.rime([lp(EN, WN, 0.15, -19), lp(EN, WN, 0.55, -18), lp(EN, WN, 0.85, -16)], 5, -1);
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [-2, -6]), lerp(SN, EN, 0.9), 58, 52, { depth: 8, teeth: 7, p: [[0.4, 0.1, 0.2]] }), MAIL());
  for (let i = 0; i < 3; i++) f.stroke([lp(SN, EN, 0.95, -22 + i * 18), lp(SN, EN, 1.02, -20 + i * 18), lp(SN, EN, 1.08, -24 + i * 18)], 2.4, P.rust, { op: 0.55 });
  X.mould(f, lp(SN, EN, 0.4, 12), 10, 14, { rings: 1 });
  FX.rime([lp(SN, EN, 0.0, -30), lp(SN, EN, 0.4, -32), lp(SN, EN, 0.8, -28)], 7, -1);
  f.bone('hand_n');
  const hn = X.openHand(f, WN, ang(EN, WN) + 0.55, 92, { look: SKd({ fill: mix(P.skin, P.skinD, 0.15) }), back: true, flip: true, spread: 0.16, curl: 0.62, curls: [0.7, 0.62, 0.55, 0.5], swell: 0.35, nail: '#6a6a60' });
  FX.cracks(lerp(WN, hn.fing[2].k0, 0.5), 14, 2, 0.4);
  FX.frost(lerp(WN, hn.fing[1].k1, 0.6), 12, 8, 4, 1.2);

  // frozen earth round the feet: on the ground, so on no bone
  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 42]), 50, 5, 0, 14), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ FROSTBITTEN LEPER (cast, human 0.95)
// A leper of the kingdom, turned out before the barrow was sealed and sealed in with the rest. Hunched under a sackcloth
// robe and a hooded shoulder cape, bandaged head to foot, the bandages frozen stiff; the far arm thrust up and forward
// ringing the leper's hand bell, the near hand leaning on a stick. Black frostbitten fingertips, two fingers gone.
// Rig: standard humanoid + bell (parent hand_f, pivot at the fist so it can swing), stick (parent hand_n), skirt, hood
// (parent head), clapper (parent bell). Motion: idle a slow ring; attack a toll (bell arm jerks, the bell swings).
function leper() {
  const [CW, CH] = TIERS.human, seed = 905;
  const f = new Fig(X.base(seed, CH, { grimeY: 600 }));
  X.textures(f); const FX = X.fx(f);
  const H = 95, gy = f.o.groundY;
  const band = '#a9a898', bandD = '#6e6d62', sack = '#615f52', sackD = '#3e3d34', cap = '#4e5048';
  const BAND = (o = {}) => Object.assign({ fill: band, shadow: '#4a4a42', tex: 'weave' + seed, texOp: 0.45, shade: 0.34 }, o);
  const SACK = (o = {}) => Object.assign({ fill: sack, shadow: '#22221c', tex: 'weave' + seed, texOp: 0.55, maxShade: 26 }, o);
  const N = [330, 384], C = [280, 446], Pv = [256, 528];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.16), SF = S.at(0.42, 0.1);
  const EF = [436, 296], WF = [532, 258];                       // far arm thrust up and forward, the bell aloft
  const EN = [316, 482], WN = [404, 498];                       // near forearm forward to the stick
  const HN = S.at(-0.2, 1.0), KN = [222, 646], AN = [196, 754];
  const HF = S.at(0.3, 1.0), KF = [330, 640], AF = [352, 752];
  const neck0 = S.at(0.2, -0.04), HC = [376, 330], hA = 0.22;
  const stT = [410, 436], stB = [458, gy], stA = ang(stB, stT);
  const WB = S.at(0, 0.8), dW = S.T(0.8);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('bell', WF, 'hand_f').joint('clapper', add(WF, [0, 70]), 'bell').joint('stick', WN, 'hand_n').joint('skirt', WB, 'pelvis').joint('hood', add(HC, [-30, -20]), 'head').joint('cape', S.at(-0.2, 0.0), 'torso');

  // a bandaged limb: the limb in linen, wound turns, stains, a frozen loose end
  const bandLimb = (A, J, Bp, ws, sfx0, sfx1, o = {}) => {
    const [c0, c1] = jcut(A, J, Bp, ws[1] * 0.5);
    split(f, () => {
      f.part(X.jointLimb(A, J, Bp, ws, { point: 0.35, mus0: 0.1, mus1: 0.16 }), BAND({ maxShade: ws[1] * 0.3 }));
      X.wraps(f, A, J, ws[0], ws[1], o.n0 || 5, band, { stain: 0.4, stainCol: P.mouldD });
      X.wraps(f, J, Bp, ws[1], ws[2], o.n1 || 6, band, { stain: 0.5, stainCol: P.bruise });
    }, [[sfx0, c0], [sfx1, c1]]);
  };

  // ---- the bell, aloft: drawn first so the far fist closes over its handle
  f.bone('bell');
  const hT = add(WF, [0, -30]), hB = add(WF, [0, 34]), bc = add(hB, [0, 4]);
  f.part(limb(hT, hB, 13, 15, { steps: 5 }), { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.6, inkW: 1.3, cast: false });
  f.part(ell(add(hT, [0, -3]), 9, 6, 0, 10), { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1.1, cast: false });
  const bell = [add(bc, [-12, 0]), add(bc, [12, 0]), add(bc, [22, 10]), add(bc, [26, 36]), add(bc, [32, 58]), [...add(bc, [40, 70]), 1], add(bc, [0, 74]), [...add(bc, [-40, 70]), 1], add(bc, [-32, 58]), add(bc, [-26, 36]), add(bc, [-22, 10])];
  f.part(bell, { fill: P.silverD, shadow: '#262a28', tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, inkW: 1.6 });
  f.part([add(bc, [-40, 66]), add(bc, [0, 70]), add(bc, [40, 66]), add(bc, [40, 72]), add(bc, [0, 78]), add(bc, [-40, 72])], { fill: P.silver, shadow: P.silverD, shade: 0.3, inkW: 1.2, cast: false }); // the lip, worn bright
  f.line([add(bc, [6, 8]), add(bc, [16, 36]), add(bc, [26, 62])], 2, P.silverL, { op: 0.6 });
  f.line([add(bc, [-20, 30]), add(bc, [-10, 40]), add(bc, [-16, 54])], 1.3, INK, { op: 0.8 }); // the crack that spoils its note
  X.mould(f, add(bc, [-14, 50]), 9, 7, { rings: 1 }); FX.rime([add(bc, [-22, 10]), add(bc, [-28, 36]), add(bc, [-34, 60])], 5, 1);
  FX.icicles([add(bc, [-38, 72]), add(bc, [0, 76]), add(bc, [38, 72])], 3, 14, 4);
  f.bone('clapper');
  f.line([add(bc, [0, 40]), add(bc, [6, 76])], 2.4, P.iron);
  f.part(ell(add(bc, [7, 82]), 7, 9, 0.2, 10), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.2, cast: false });

  // ---- far arm thrust up and forward: bandaged under the robe's wide sleeve
  bandLimb(SF, EF, lerp(EF, WF, 0.9), [44, 38, 28], 'upperarm_f', 'forearm_f');
  f.bone('upperarm_f');
  f.part(K.ragLimb(f, add(SF, [-6, 4]), lerp(SF, EF, 0.72), 56, 58, { depth: 10, teeth: 6 }), SACK({ fill: sackD }));
  f.stroke([lp(SF, EF, 0.2, -18), lp(SF, EF, 0.45, -22), lp(SF, EF, 0.66, -16)], 2, '#14140e');
  FX.icicles([lp(SF, EF, 0.35, 26), lp(SF, EF, 0.7, 28)], 3, 12, 4);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, -Math.PI / 2, 24, band, { shadow: '#4a4a42', tex: 'weave' + seed, texOp: 0.4, name: 'leper bell' });
  X.fistDetail(f, gF, 24, band, { tips: P.black, wrinkle: false });
  X.wraps(f, add(WF, [-26, -2]), add(WF, [-6, 0]), 30, 30, 2, band);

  // ---- legs: bandaged shins below the robe, bandaged stumps of feet frozen to the floor
  const leg = (Hp, Kn, A, sfx, sw) => {
    const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 56, 44, { steps: 8 }), SACK({ fill: sackD }));
    split(f, () => {
      const pts = X.fullLeg(f, lerp(Kn, A, 0.05), lerp(Kn, A, 0.1), A, 1, 50, 44, 42, BAND({ maxShade: 14 }), { swell: sw, nail: P.black });
      X.wraps(f, lerp(Kn, A, 0.1), lerp(Kn, A, 0.95), 42, 32, 7, band, { stain: 0.5, stainCol: P.bruise });
      for (let i = 0; i < 3; i++) f.line([add(A, [10 + i * 12, 22]), add(A, [16 + i * 12, 38])], 1.2, bandD, { op: 0.8 }); // turns round the foot
      f.flat([add(A, [48, 26]), add(A, [62, 30]), add(A, [64, 38]), add(A, [50, 38])], P.black, { op: 0.9 }); // black toes where the wrap has worn through
      FX.frost(add(A, [14, 30]), 30, 8, 7);
    }, [['shin' + sfx, side(A, mul(da, -1), 18)], ['foot' + sfx, side(A, da, 18)]]);
  };
  leg(HF, KF, AF, '_f', 0.4);
  leg(HN, KN, AN, '_n', 0.6);

  // ---- the robe skirt, from the rope belt to a ragged hem at mid-calf (behind the near leg's front)
  f.bone('skirt');
  const hem = [];
  { let x = 404; const dep = [4, 22, 8, 30, 2, 14, 26, 6, 18, 3, 24, 10, 16]; let i = 0; while (x > 150) { hem.push([x, 690 + dep[i % dep.length] + (f.r() - 0.5) * 6, dep[i % dep.length] > 12 ? 1 : 0]); x -= 12 + f.r() * 22; i++; } }
  const sk = [S.at(-0.62, 0.7), S.at(0.6, 0.7), [392, 600], [406, 690], ...hem, [150, 690], [168, 600]];
  const skD = f.part(sk, SACK());
  X.stains(f, skD, [140, 500, 420, 720], '#1e1e18', 0.025, 2.6, -1.4, 3, 0.7);
  X.stains(f, skD, [140, 600, 420, 720], P.mouldD, 0.05, 3.2, -2.0, 7, 0.6);
  for (const [a, b2, c] of [[[230, 560], [214, 620], [206, 700]], [[300, 556], [312, 630], [316, 706]], [[360, 570], [378, 640], [388, 700]], [[264, 600], [262, 650], [258, 704]]]) f.stroke([a, b2, c], 2.4, '#14140e');
  f.part([[330, 610], [362, 606], [366, 640], [334, 644]].map(q => [...q, 1]), SACK({ fill: mix(sack, P.linen, 0.3), inkW: 1.1 }));
  f.stitches([[330, 610], [362, 606], [366, 640], [334, 644], [330, 610]], P.linenL, 0.8);
  FX.icicles(hem.map(q => [q[0], q[1] - 2]), 6, 18, 5);
  X.mould(f, [190, 664], 16, 10); X.mould(f, [372, 680], 12, 8, { rings: 1 });
  X.fungalFur(f, hem.slice(2, 7).map(q => [q[0], q[1] - 3]), 6, -1);

  // ---- torso: the robe body, a rope belt, the clapper and a begging bowl on cords
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.32, 0.38], [0.04, 0.66, 0.52], [0.18, 0.84, 0.66], [0.36, 0.82, 0.72], [0.56, 0.72, 0.7], [0.74, 0.66, 0.66], [0.88, 0.66, 0.64]]);
  const tD = f.part(torso, SACK());
  X.stains(f, tD, [170, 330, 430, 540], '#1e1e18', 0.03, 2.4, -1.3, 5, 0.6);
  for (const [u0, v0, u1, v1] of [[0.4, 0.2, 0.55, 0.62], [0.0, 0.3, 0.1, 0.72], [-0.5, 0.3, -0.4, 0.7]]) f.stroke([S.at(u0, v0), S.at((u0 + u1) / 2 + 0.06, (v0 + v1) / 2), S.at(u1, v1)], 2.2, '#14140e');
  FX.rime([S.at(-0.4, 0.06), S.at(-0.76, 0.2), S.at(-0.84, 0.46)], 8, 1);
  X.rope(f, [S.at(-0.66, 0.78), S.at(-0.2, 0.82), S.at(0.3, 0.82), S.at(0.68, 0.78)], 6, P.linenD);
  const kn = S.at(0.4, 0.82);
  f.part(ell(kn, 8, 7, 0, 10), { fill: P.linenD, shade: 0.4, inkW: 1.2, cast: false });
  X.rope(f, [kn, add(kn, [4, 30]), add(kn, [0, 56])], 4, P.linenD, { fray: true });
  { // the lazarus clapper: three boards on a thong, hung from the belt at the back
    const c0 = S.at(-0.4, 0.84); f.line([c0, add(c0, [-4, 24])], 1.6, P.leatherD);
    for (let i = 0; i < 3; i++) f.part([add(c0, [-22 + i * 4, 22 + i * 3]), add(c0, [10 + i * 4, 18 + i * 3]), add(c0, [12 + i * 4, 68 + i * 2]), add(c0, [-20 + i * 4, 72 + i * 3])].map(q => [...q, 1]), { fill: mix(P.wood, P.woodL, i * 0.3), shadow: P.woodD, tex: 'wood' + seed, texOp: 0.6, shade: 0.4, inkW: 1.1 });
  }
  { // a wooden begging bowl on a cord at the hip
    const b0 = S.at(0.12, 0.86); f.line([b0, add(b0, [2, 26])], 1.4, P.linenD);
    f.part([add(b0, [-24, 26]), add(b0, [26, 24]), add(b0, [20, 44]), add(b0, [0, 50]), add(b0, [-18, 44])], { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.6, shade: 0.4 });
    f.part(ell(add(b0, [1, 25]), 25, 5, 0, 12), { fill: P.woodD, shade: 0.2, inkW: 1, cast: false });
    FX.frost(add(b0, [0, 24]), 18, 3, 5, 1.2);
  }

  // ---- shoulder cape with the hood, frozen stiff
  f.bone('cape');
  const capeP = [S.at(0.5, -0.04), S.at(-0.1, -0.12), S.at(-0.6, -0.02), S.at(-0.92, 0.2), [...S.at(-0.98, 0.42), 1], S.at(-0.8, 0.36), [...S.at(-0.74, 0.52), 1], S.at(-0.5, 0.4), [...S.at(-0.36, 0.5), 1], S.at(-0.1, 0.36), [...S.at(0.1, 0.44), 1], S.at(0.3, 0.3), [...S.at(0.56, 0.34), 1], S.at(0.66, 0.16)];
  const cD = f.part(capeP, { fill: cap, shadow: '#1e201c', tex: 'weave' + seed, texOp: 0.55, maxShade: 24 });
  X.stains(f, cD, [170, 300, 440, 460], P.mouldD, 0.045, 3, -1.8, 9, 0.7);
  for (const u of [-0.6, -0.2, 0.2]) f.stroke([S.at(u, 0.0), S.at(u - 0.06, 0.2), S.at(u - 0.04, 0.38)], 2.2, '#121410');
  FX.rime([S.at(0.2, -0.1), S.at(-0.3, -0.12), S.at(-0.7, 0.0), S.at(-0.96, 0.24)], 9, 1);
  FX.icicles([S.at(-0.98, 0.42), S.at(-0.74, 0.52), S.at(-0.36, 0.5), S.at(0.1, 0.44)], 5, 18, 5);
  X.mould(f, S.at(0.36, 0.2), 10, 8, { rings: 1 });

  // ---- head: the skull wound in frozen linen, one eye left open in a slit, the hood over it
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-6, 10]), hF([[-0.08, 0.42]])[0]], [50, 40]), BAND({ maxShade: 10 }));
  const skull = hF([[-0.34, -0.36], [-0.06, -0.52], [0.2, -0.48], [0.32, -0.32], [0.36, -0.12], [0.33, -0.04], [0.38, 0.08], [0.35, 0.16], [0.33, 0.3], [0.3, 0.44], [0.14, 0.52], [-0.06, 0.46], [-0.22, 0.28], [-0.36, 0.06]]);
  f.part(skull, BAND({ maxShade: H * 0.32, shade: 0.4 }));
  // turns of linen round the head, each crossing the face at its own angle; the nose and brow push through
  for (let i = 0; i < 7; i++) { const v = -0.44 + i * 0.13, tl = (i % 2 ? 0.08 : -0.06); f.line(hF([[-0.34, v + tl], [0.0, v - tl * 0.5], [0.37, v + tl * 0.4]]), 1.4, '#4a4a42', { op: 0.8 }); f.line(hF([[-0.3, v + tl - 0.02], [0.0, v - tl * 0.5 - 0.02], [0.34, v + tl * 0.4 - 0.02]]), 0.9, '#d8d6c8', { op: 0.5 }); }
  f.flat(hF([[0.28, -0.08], [0.39, 0.06], [0.37, 0.16], [0.3, 0.14]]), '#3e3e36', { op: 0.35 }); // the nose under the linen
  f.flat(hF([[-0.34, -0.3], [-0.1, -0.44], [0.0, -0.2], [-0.04, 0.2], [-0.1, 0.42], [-0.22, 0.28], [-0.36, 0.06]]), '#2a2a24', { op: 0.3 }); // the side plane of the skull turning away
  f.flat(hF([[-0.1, -0.46], [0.2, -0.48], [0.34, -0.3], [0.36, -0.18], [0.1, -0.22], [-0.06, -0.26]]), '#1a1a16', { op: 0.35 }); // the hood's shadow across the brow
  f.flat(hF([[0.02, 0.28], [0.3, 0.36], [0.3, 0.44], [0.12, 0.52], [-0.04, 0.44]]), '#2a2a24', { op: 0.28 }); // under the jaw
  // the eye slit: a gap between two turns, a filmed grey eye frozen open in it, frost on the lashes
  f.flat(hF([[0.04, -0.1], [0.2, -0.12], [0.32, -0.1], [0.3, -0.04], [0.18, -0.03], [0.06, -0.05]]), '#141412');
  f.flat(hF(ell([0.16, -0.07], 0.06, 0.022, 0, 10)), '#8a8e86');
  f.flat(hF(ell([0.18, -0.068], 0.02, 0.018, 0, 8)), '#3a3c38');
  f.line(hF([[0.06, -0.1], [0.18, -0.115], [0.3, -0.1]]), 1.6, P.hoar, { op: 0.8 });
  // the mouth: a damp stain through the wraps, the linen sucked in over the lips
  f.flat(hF(ell([0.24, 0.3], 0.09, 0.05, 0.1, 10)), P.mouldD, { op: 0.6 });
  f.line(hF([[0.17, 0.3], [0.25, 0.29], [0.32, 0.3]]), 1.6, '#2a2a24');
  X.sore(f, hF([[0.02, 0.16]])[0], 5.5); // a sore weeping through the wraps on the cheek
  FX.rime(hF([[0.36, 0.2], [0.34, 0.36], [0.26, 0.48]]), 4, -1);
  // a loose end of the head wrap, frozen stiff where it fell
  f.part([hF([[-0.3, 0.2]])[0], hF([[-0.22, 0.24]])[0], add(hF([[-0.3, 0.3]])[0], [-6, 60]), add(hF([[-0.36, 0.3]])[0], [-14, 56])], BAND({ inkW: 1.2, cast: false }));
  f.bone('hood');
  const hood = hF([[-0.5, 0.5], [-0.58, 0.0], [-0.5, -0.4], [-0.26, -0.66], [0.06, -0.72], [0.34, -0.58], [0.46, -0.36], [0.44, -0.24], [0.3, -0.42], [0.06, -0.52], [-0.18, -0.46], [-0.34, -0.2], [-0.4, 0.2], [-0.32, 0.56]]);
  const hD = f.part(hood, { fill: cap, shadow: '#1e201c', tex: 'weave' + seed, texOp: 0.55, maxShade: 20 });
  f.flat(hF([[0.44, -0.26], [0.3, -0.42], [0.06, -0.52], [-0.18, -0.46], [-0.1, -0.4], [0.1, -0.44], [0.3, -0.34]]), '#101210', { op: 0.6 }); // the hood's inner shadow on the brow
  f.stroke(hF([[-0.3, -0.5], [-0.42, -0.2], [-0.44, 0.2]]), 2.2, '#121410');
  FX.rime(hF([[-0.5, -0.36], [-0.26, -0.62], [0.06, -0.7], [0.34, -0.56]]), 9, 1);
  X.mould(f, hF([[-0.3, 0.1]])[0], 10, 14, { rings: 1 });


  // ---- the stick, planted ahead; a rag tied on it
  f.bone('stick');
  f.part(limb(stB, add(stT, mul(E.norm(sub(stT, stB)), 6)), 14, 12, { steps: 10, p: [[0.35, 0.25, 0.04], [0.7, 0.2, 0.04]] }), { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.7, maxShade: 6 });
  f.line([lerp(stB, stT, 0.05), lerp(stB, stT, 0.95)].map(q => add(q, [3, 0])), 1, P.woodL, { op: 0.5 });
  const rg = lerp(stB, stT, 0.82);
  f.part([add(rg, [-9, -6]), add(rg, [9, -8]), add(rg, [8, 6]), add(rg, [-8, 8])], BAND({ fill: mix(band, P.mouldD, 0.3), inkW: 1.1, cast: false }));
  f.part([add(rg, [6, 2]), add(rg, [14, 4]), add(rg, [12, 40]), add(rg, [6, 34])], BAND({ fill: mix(band, P.mouldD, 0.3), inkW: 1, cast: false }));
  FX.rime([lerp(stB, stT, 0.3), lerp(stB, stT, 0.6)].map(q => add(q, [-6, 0])), 4, 1);
  X.mould(f, lerp(stB, stT, 0.12), 8, 10, { rings: 0 });

  // ---- near arm: bandaged, under the sleeve, the hand on the stick
  bandLimb(SN, EN, lerp(EN, WN, 0.9), [46, 40, 30], 'upperarm_n', 'forearm_n');
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [-4, -6]), lerp(SN, EN, 0.96), 60, 66, { depth: 12, teeth: 6, p: [[0.5, 0.1, 0.2]] }), SACK());
  f.stroke([lp(SN, EN, 0.3, 18), lp(SN, EN, 0.6, 22), lp(SN, EN, 0.9, 16)], 2, '#14140e');
  X.pustules(f, lp(SN, EN, 0.5, -6), 12, 16, 4, 2.4, 4);
  f.bone('forearm_n');
  X.sore(f, lp(EN, WN, 0.45, 6), 5);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, stA, 24, band, { shadow: '#4a4a42', tex: 'weave' + seed, texOp: 0.4, name: 'leper stick' });
  X.fistDetail(f, gN, 24, band, { tips: P.black, wrinkle: false });
  f.flat(gN.F(ell([0.5, 0.42], 0.22, 0.16, 0, 8)), P.black, { op: 0.9 }); // the little finger gone to a black stump

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 42]), 50, 5, 0, 14), P.frostD, { op: 0.45 });
  f.flat(ell(add(stB, [0, 0]), 16, 3, 0, 10), P.frostD, { op: 0.5 });
  return f;
}

// ------------------------------------------------------------------ MOULD WIGHT (cast, human 1.1)
// Mould on the barrow walls that grew a shape in the dark around the bones it fed on. A lurching man-shape of grey-green
// mould and frost, furred and soft, sagging off its frame and trailing long filaments like old-man's-beard; the bones
// show where it is thin: a skull with the jaw hanging, ribs, the bones of a forearm, finger bones for claws. Both arms
// reach to smother, the far one high, the near one low; the near leg drags behind. Rig: standard humanoid + jaw (parent
// head) + shroud (scrap). Motion: idle spores drifting off; attack a grasping smother (arms forward, body pitching in).
function mouldWight() {
  const [CW, CH] = TIERS.human, seed = 906;
  const f = new Fig(X.base(seed, CH, { grimeY: 620 }));
  X.textures(f); const FX = X.fx(f);
  const H = 110, gy = f.o.groundY;
  const MB = mix(P.mould, P.grey, 0.4), MBD = mix(P.mouldD, '#30332c', 0.4);
  const M = (o = {}) => Object.assign({ fill: MB, shadow: '#1c201a', tex: 'mfur' + seed, texOp: 0.75, shade: 0.4, maxShade: 18 }, o);
  const MD = (o = {}) => M(Object.assign({ fill: MBD }, o));
  const BONE = (o = {}) => Object.assign({ fill: P.bone, shadow: P.boneS, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.3, inkHeavy: 2, cast: false, hatch: false }, o);
  const bloom = (d, bb, k) => { X.stains(f, d, bb, P.frost, 0.035, 3.4, -2.3, k, 0.75); X.stains(f, d, bb, '#121610', 0.028, 2.8, -1.5, k + 5, 0.6); X.stains(f, d, bb, P.mouldL, 0.06, 3, -2, k + 9, 0.45); };
  const N = [342, 336], C = [290, 400], Pv = [262, 506];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.16), SF = S.at(0.42, 0.1);
  const EF = [444, 312], WF = [524, 280];                     // far arm reaching high
  const EN = [352, 452], WN = [452, 470];                     // near arm reaching low
  const HN = S.at(-0.24, 1.0), KN = [206, 640], AN = [150, 752]; // near leg dragging behind
  const HF = S.at(0.3, 1.0), KF = [348, 628], AF = [362, 752];
  const neck0 = S.at(0.22, -0.04), HC = [392, 300], hA = 0.32;
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('jaw', frame(HC, hA, H)([[-0.12, 0.22]])[0], 'head').joint('shroud', S.at(-0.4, 0.3), 'torso');

  const mLimb = (A, J, Bp, ws, s0, s1, look) => {
    const [c0, c1] = jcut(A, J, Bp, ws[1] * 0.5);
    split(f, () => { const d = f.part(X.jointLimb(A, J, Bp, ws, { point: 0.25, mus0: 0.3, mus1: 0.34 }), look); const bb = E.bbox([A, J, Bp]); bloom(d, [bb[0] - 40, bb[1] - 40, bb[2] + 40, bb[3] + 40], 3); }, [[s0, c0], [s1, c1]]);
  };
  const under = (a, b, off) => [lp(a, b, 0.02, off), lp(a, b, 0.5, off * 1.05), lp(a, b, 0.98, off * 0.9)]; // a limb's underside line
  const boneShow = (a, b, w) => { // a thin patch with the bone lying in it
    const d = E.norm(sub(b, a)), n = [-d[1], d[0]], gap = [add(a, mul(n, w * 0.9)), lerp(add(a, mul(n, w)), add(b, mul(n, w)), 0.5), add(b, mul(n, w * 0.8)), add(b, mul(n, -w * 0.8)), lerp(add(a, mul(n, -w)), add(b, mul(n, -w)), 0.5), add(a, mul(n, -w * 0.9))];
    f.flat(gap, '#101410', { op: 0.95 });
    f.part(limb(lerp(a, b, 0.05), lerp(a, b, 0.95), w * 0.9, w * 0.8, { steps: 6, p: [[0.0, 0.35, 0.1], [1.0, 0.3, 0.1]], q: [[0.0, 0.35, 0.1], [1.0, 0.3, 0.1]] }), BONE());
    f.line([lp(a, b, 0.15, w * 0.2), lp(a, b, 0.85, w * 0.15)], 1, P.boneD, { op: 0.7 });
    X.fungalFur(f, gap.slice(0, 3), 5, 1); X.fungalFur(f, gap.slice(3), 5, 1);
  };
  const boneHand = (W, a0, s, look) => {
    const h = X.openHand(f, W, a0, s, { look, back: true, flip: true, spread: 0.22, curl: 0.55, tips: P.bone, swell: 0.15, nail: P.boneD, vein: false });
    h.fing.forEach(g => { f.line([g.k1, g.k2], 1.2, P.boneS, { op: 0.7 }); f.part(limb(g.k2, add(g.k3, mul(E.norm(sub(g.k3, g.k2)), 8)), g.W * 0.5, g.W * 0.25, { steps: 4, capK: 1.4 }), BONE({ inkW: 1, inkHeavy: 1.4 })); }); // bare finger bones for claws
    X.shag(f, h.fing.map(g => g.k0), 22, { n: 2 });
    return h;
  };

  // ---- far arm, reaching high (behind the torso)
  mLimb(SF, EF, lerp(EF, WF, 0.92), [54, 44, 34], 'upperarm_f', 'forearm_f', MD());
  f.bone('forearm_f');
  boneShow(lp(EF, WF, 0.3, -2), lp(EF, WF, 0.72, -2), 8);
  X.shag(f, under(EF, WF, 16), 54, { ice: true });
  f.bone('upperarm_f');
  X.shag(f, under(SF, EF, 18), 60);
  f.bone('hand_f');
  boneHand(WF, ang(EF, WF) + 0.25, 92, MD({ maxShade: 5, fill: mix(MBD, P.boneD, 0.35) }));

  // ---- legs: soft sagging columns of mould trailing filaments; the dragged foot a bare bone foot
  const leg = (Hp, Kn, A, sfx, look, drag) => {
    const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => {
      const d = drag ? f.part(X.jointLimb(Hp, Kn, A, [74, 52, 34], { point: 0.3, mus0: 0.25, mus1: 0.3 }), look) : E.smooth(X.fullLeg(f, Hp, Kn, A, 1, 52, 72, 52, look, { thigh: 0.16, swell: 0.6, nail: P.boneD }));
      bloom(d, [Hp[0] - 120, Hp[1] - 40, Hp[0] + 160, gy + 10], drag ? 31 : 37);
    }, [['thigh' + sfx, side(Kn, mul(de, -1), 28)], ['shin' + sfx, [side(Kn, de, 28), side(A, mul(da, -1), 18)]], ['foot' + sfx, side(A, da, 18)]]);
    // sagging lobes of mould hanging off the thigh and knee, each with filaments under it; bloom patches between
    const lobe = (c, w, h) => { const q = [add(c, [-w, -h * 0.3]), add(c, [0, -h * 0.5]), add(c, [w, -h * 0.25]), add(c, [w * 0.8, h * 0.5]), add(c, [w * 0.1, h]), add(c, [-w * 0.7, h * 0.6])]; f.part(q, Object.assign({}, look, { maxShade: 6, cast: false, inkW: 1, inkHeavy: 1.2, fill: mix(look.fill, P.mouldD, 0.25) })); X.shag(f, [add(c, [-w * 0.7, h * 0.6]), add(c, [w * 0.1, h]), add(c, [w * 0.8, h * 0.5])], 26, { n: 1 }); };
    f.bone('thigh' + sfx); X.shag(f, [lp(Hp, Kn, 0.2, 30), lp(Hp, Kn, 0.45, 32)], 40, { n: 1 }); X.shag(f, [lp(Hp, Kn, 0.6, -10), lp(Hp, Kn, 0.85, 4)], 34, { n: 1 }); X.mould(f, lp(Hp, Kn, 0.3, 4), 14, 10, { rings: 1 });
    X.shag(f, under(Hp, Kn, -30), 46); X.shag(f, [lp(Hp, Kn, 0.55, 28), lp(Hp, Kn, 0.95, 20)], 30, { n: 1 });
    f.bone('shin' + sfx); X.shag(f, [lp(Kn, A, 0.1, 18), lp(Kn, A, 0.3, 8)], 30, { n: 1 }); X.mould(f, lp(Kn, A, 0.55, 2), 10, 14, { rings: 1 }); FX.frost(lp(Kn, A, 0.4, 0), 14, 30, 6); X.shag(f, [lp(Kn, A, 0.45, 20), lp(Kn, A, 0.8, 16)], 24, { n: 1 });
    f.bone('shin' + sfx); X.shag(f, under(Kn, A, -22), 34, { ice: true });
    if (drag) {
      f.bone('foot' + sfx);
      const toe = [A[0] - 36, gy - 4];
      f.part(limb(A, toe, 28, 14, { steps: 5 }), MD());
      for (let i = 0; i < 4; i++) f.part(limb(add(toe, [6, -7 + i * 3.4]), add(toe, [-14 - i * 3, -2 + i * 2]), 5, 3.4, { steps: 3 }), BONE({ inkW: 0.9, inkHeavy: 1.2 }));
      f.bone('root'); f.flat([add(toe, [-6, 2]), add(toe, [-90, 4]), add(toe, [-80, 8]), add(toe, [0, 8])], P.mouldD, { op: 0.55 });
    }
  };
  leg(HN, KN, AN, '_n', M({ fill: mix(MB, MBD, 0.4) }), true);

  // ---- torso: a sagging mass of mould over the ribcage, hump high, belly low, thin where the ribs show
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.36, 0.42], [0.04, 0.74, 0.56], [0.18, 0.94, 0.72], [0.36, 0.92, 0.8], [0.56, 0.8, 0.88], [0.76, 0.7, 0.94], [0.94, 0.66, 0.86], [1.08, 0.62, 0.64]]);
  const tD = f.part(torso, M({ maxShade: 30 }));
  bloom(tD, [150, 260, 480, 580], 3);
  const rc = [S.at(0.2, 0.26), S.at(0.6, 0.22), S.at(0.78, 0.4), S.at(0.7, 0.62), S.at(0.32, 0.66), S.at(0.16, 0.46)];
  f.flat(rc, '#0e120c', { op: 0.95, k: 0.8 });
  for (let i = 0; i < 4; i++) { const v = 0.3 + i * 0.09; f.part(K.chain([S.at(0.14, v - 0.02), S.at(0.44, v - 0.04), S.at(0.74, v + 0.03)], [9, 8, 6]), BONE({ inkW: 1, inkHeavy: 1.4 })); }
  f.part(limb(S.at(0.76, 0.26), S.at(0.76, 0.6), 10, 8, { steps: 5 }), BONE({ inkW: 1, inkHeavy: 1.4 }));
  X.fungalFur(f, rc, 6, 1, { gaps: 0.4 });
  FX.rime([S.at(-0.2, -0.06), S.at(-0.62, 0.04), S.at(-0.92, 0.24), S.at(-0.98, 0.5)], 10, 1);
  FX.frost(S.at(-0.5, 0.3), 30, 40, 12);
  X.graveCaps(f, S.at(-0.7, 0.14), deg(-150), 40, 3);
  { const b0 = S.at(-0.6, 0.52), b1 = add(b0, [-58, -40]); f.part([add(b0, [-2, 4]), add(b0, [4, -4]), add(b1, [3, -4]), [...add(b1, [-8, -2]), 1], add(b1, [-2, 6])], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.6 }); f.flat(ell(lerp(b0, b1, 0.4), 10, 4, ang(b0, b1), 8), P.rust, { op: 0.6 }); f.part(limb(add(b1, [-4, 1]), add(b1, [-26, -16]), 10, 9, { steps: 4 }), { fill: P.leatherD, shade: 0.4, inkW: 1.1, cast: false }); f.flat(ell(b0, 9, 7, 0, 8), '#10140e'); } // a broken sword in its back, from someone it fed on
  X.shag(f, [S.at(-0.6, 0.92), S.at(-0.1, 1.04), S.at(0.5, 1.02), S.at(0.9, 0.9)], 70, { ice: true });
  X.shag(f, [S.at(-0.92, 0.3), S.at(-0.84, 0.6), S.at(-0.7, 0.86)], 44);
  X.shag(f, [S.at(-0.7, 0.36), S.at(-0.3, 0.44), S.at(0.1, 0.4)], 36, { n: 1 }); X.shag(f, [S.at(-0.6, 0.66), S.at(-0.2, 0.72)], 30, { n: 1 });
  X.mould(f, S.at(-0.36, 0.58), 16, 12, { rings: 2, col: mix(P.mould, P.grey, 0.2) }); X.mould(f, S.at(0.4, 0.82), 12, 9, { rings: 1 });
  X.spores(f, S.at(-0.3, -0.3), 70, 40, 14, 1.2);

  // ---- a scrap of grave shroud caught in it, hanging from the far shoulder
  f.bone('shroud');
  const sh0 = S.at(-0.2, 0.1);
  const shr = [sh0, add(sh0, [40, 6]), add(sh0, [34, 80]), [...add(sh0, [26, 130]), 1], add(sh0, [12, 100]), [...add(sh0, [0, 148]), 1], add(sh0, [-10, 96]), [...add(sh0, [-22, 120]), 1], add(sh0, [-20, 40])];
  const shD = f.part(shr, { fill: P.linen, shadow: P.linenD, tex: 'weave' + seed, texOp: 0.6, maxShade: 14 });
  X.stains(f, shD, [250, 340, 360, 520], P.mouldD, 0.06, 3, -1.6, 21, 0.8);
  f.stroke([add(sh0, [10, 20]), add(sh0, [14, 70]), add(sh0, [8, 110])], 1.8, '#2a2a22');

  // ---- far leg (forward, bearing the weight)
  leg(HF, KF, AF, '_f', M(), false);
  f.bone('foot_f');
  FX.frost(add(AF, [10, 30]), 34, 8, 8);
  for (let i = 0; i < 4; i++) f.part(limb(add(AF, [36 + i * 8, 22 - i]), add(AF, [52 + i * 9, 36]), 6, 4, { steps: 3 }), BONE({ inkW: 0.9, inkHeavy: 1.2 })); // toe bones through the fur

  // ---- head: the bare skull pushed forward out of a cowl of mould that drapes off the cranium and down the back
  f.bone('head');
  const hF = frame(HC, hA, H);
  // the cowl behind: a hanging hood of mould from the crown down over the nape, ragged with filaments
  const cowl = hF([[-0.02, -0.62], [-0.3, -0.6], [-0.56, -0.3], [-0.66, 0.2], [-0.6, 0.62], [-0.3, 0.7], [-0.1, 0.4], [0.06, 0.1], [0.12, -0.3]]);
  const cwD = f.part(cowl, M({ maxShade: 22 }));
  bloom(cwD, [260, 200, 460, 400], 41);
  X.shag(f, hF([[-0.62, 0.5], [-0.4, 0.66], [-0.16, 0.5]]), 56, { ice: true });
  // the skull: cranium, brow, sockets, nasal hole, cheekbone, upper teeth
  const sk = hF([[-0.14, -0.44], [0.08, -0.54], [0.26, -0.48], [0.38, -0.3], [0.41, -0.08], [0.39, 0.1], [0.32, 0.2], [0.14, 0.24], [0.0, 0.18], [-0.08, 0.0], [-0.16, -0.24]]);
  f.part(sk, BONE({ cast: true, shade: 0.45, maxShade: 14, inkW: 1.6 }));
  f.flat(hF([[-0.16, -0.24], [-0.08, 0.0], [0.0, 0.18], [0.06, 0.06], [0.0, -0.2], [-0.06, -0.4]]), P.boneS, { op: 0.45 }); // the temple turning away
  f.flat(hF([[0.0, -0.1], [0.4, -0.14], [0.41, -0.08], [0.0, -0.04]]), P.boneS, { op: 0.45 }); // under the brow ridge
  f.line(hF([[0.08, -0.4], [0.2, -0.44], [0.28, -0.34]]), 1, P.boneS, { op: 0.6 }); // a suture
  // angular orbits, deep and empty, rime caked in their lower rims
  f.flat(hF([[0.02, -0.12], [0.26, -0.13], [0.27, -0.04], [0.22, 0.04], [0.12, 0.06], [0.04, 0.02]]), '#121210');
  f.flat(hF([[0.03, -0.12], [0.26, -0.13], [0.2, -0.07], [0.06, -0.06]]), '#000', { op: 0.6 });
  f.flat(hF([[0.31, -0.14], [0.4, -0.14], [0.4, -0.04], [0.37, 0.02], [0.32, 0.02]]), '#121210');
  FX.rime(hF([[0.05, 0.03], [0.14, 0.07], [0.23, 0.05]]), 3, 1); // rime on the orbit's lower rim, outside the hole
  f.flat(hF([[0.35, 0.02], [0.4, 0.05], [0.39, 0.11], [0.34, 0.1]]), '#0e0e0c');
  f.line(hF([[0.04, 0.1], [0.16, 0.08], [0.27, 0.14]]), 1.4, P.boneS, { op: 0.8 });
  for (let i = 0; i < 5; i++) { const x = 0.17 + i * 0.04; f.part(hF([[x, 0.2], [x + 0.034, 0.2], [x + 0.03, 0.26], [x + 0.004, 0.265]]), BONE({ inkW: 0.8, inkHeavy: 1, fill: i === 2 ? P.boneD : P.bone })); }
  // the cowl's front edge over the brow, filaments hanging across the sockets
  f.part(hF([[-0.1, -0.64], [0.16, -0.62], [0.34, -0.5], [0.4, -0.38], [0.26, -0.4], [0.08, -0.46], [-0.1, -0.4]]), M({ maxShade: 8 }));
  X.shag(f, hF([[-0.04, -0.44], [0.14, -0.46], [0.3, -0.4]]), 30, { n: 1 });
  X.graveCaps(f, hF([[-0.3, -0.6]])[0], deg(-120), 32, 3);
  FX.rime(hF([[-0.56, -0.3], [-0.3, -0.6], [0.0, -0.66], [0.2, -0.62]]), 8, 1);
  f.bone('jaw');
  f.flat(hF([[0.04, 0.24], [0.36, 0.22], [0.36, 0.42], [0.04, 0.36]]), '#0c0e0a'); // the open mouth
  const jw = hF([[0.0, 0.32], [0.16, 0.36], [0.32, 0.4], [0.36, 0.52], [0.3, 0.62], [0.14, 0.62], [-0.04, 0.52]]);
  f.part(jw, BONE({ cast: true }));
  for (let i = 0; i < 4; i++) { const x = 0.2 + i * 0.035; f.part(hF([[x, 0.38], [x + 0.03, 0.38], [x + 0.028, 0.33], [x + 0.004, 0.33]]), BONE({ inkW: 0.8, inkHeavy: 1, fill: P.boneD })); }
  X.shag(f, hF([[0.0, 0.56], [0.14, 0.62], [0.3, 0.6]]), 50, { ice: true });

  // ---- near arm reaching low: mould over the bones, a grave torque caught round the wrist
  mLimb(SN, EN, lerp(EN, WN, 0.92), [60, 50, 38], 'upperarm_n', 'forearm_n', M());
  f.bone('upperarm_n');
  X.shag(f, under(SN, EN, -26), 58);
  FX.rime([lp(SN, EN, -0.05, -30), lp(SN, EN, 0.4, -32), lp(SN, EN, 0.8, -28)], 7, -1);
  X.graveCaps(f, lp(SN, EN, 0.1, -26), deg(-140), 26, 2);
  f.bone('forearm_n');
  boneShow(lp(EN, WN, 0.25, 4), lp(EN, WN, 0.7, 4), 9);
  X.shag(f, under(EN, WN, 18), 56, { ice: true });
  f.part(plate(EN, WN, 0.8, 0.9, 46, 44), { fill: P.silverD, shadow: '#262a28', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.81 + i * 0.03, -22), lp(EN, WN, 0.83 + i * 0.03, 22)], 1, INK, { op: 0.6 });
  f.bone('hand_n');
  boneHand(WN, ang(EN, WN) + 0.45, 98, M({ maxShade: 5, fill: mix(MB, P.boneD, 0.3) }));
  X.spores(f, add(WN, [40, -30]), 40, 30, 8, 1.1);

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [16, 42]), 50, 5, 0, 14), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ PLAGUE WOLF (cast, large, 1.1 long)
// A barrow wolf that carries the old plague in its teeth. Stalking low, the head dropped below the withers on a thick
// neck, hackles standing in a ridge from the nape to the middle of the back, the lip curled off green-stained fangs.
// Mangy: the fur is patchy with mould and frost, bare grey skin over the ribs and the haunch, plague sores on the muzzle.
// Long legs as thick jointed segments over slim pasterns, splayed and planted. Rig: spine_1 (root, hips) > spine_2 >
// spine_3 (withers) > neck > head > jaw; tail_1 > tail_2; legs leg_fn/ff/hn/hf _1.._3.
// Motion: idle a low growl (jaw, hackles); attack a plague bite (neck and head lunge, jaw drops).
function plagueWolf() {
  const [CW, CH] = TIERS.large, seed = 904;
  const f = new Fig(X.base(seed, CH, { grimeY: 900 }));
  X.textures(f); const FX = X.fx(f);
  const gy = f.o.groundY;
  const fur = mix(P.fur, P.grey, 0.3), furD = mix(P.furD, '#2a2a26', 0.3), furL = mix(P.furL, P.frost, 0.15);
  const FUR = (o = {}) => Object.assign({ fill: fur, shadow: '#3c3a33', tex: 'fur' + seed, texOp: 0.85, shade: 0.4, maxShade: 22, inkHeavy: 2.4, castOp: 0.25 }, o);
  const BARE = (o = {}) => X.SK(f, Object.assign({ fill: mix(P.skin, P.bruise, 0.22), maxShade: 8, cast: false, inkW: 0.7, inkHeavy: 0.9 }, o));
  const hair = (pts, len, o = {}) => X.shag(f, pts, len, Object.assign({ pal: [furD, fur, furL, P.grey], n: 2, sway: 4 }, o));
  const brist = (pts, len, dir, o = {}) => X.bristles(f, pts, len, dir, Object.assign({ pal: [furD, fur, furL, P.grey] }, o));
  // joints
  const Pv = [276, 790], M2 = [410, 780], W3 = [540, 770], NK = [600, 790], HC = [706, 850], hA = 0.38, HS = 0.82;
  // canine legs. Front: H shoulder point, K elbow (behind the brisket), A wrist, T paw. Hind: H hip, K stifle, A hock, T paw.
  const LEG = {
    fn: { H: [604, 818], K: [560, 912], A: [584, 1012], T: [616, gy] },
    ff: { H: [626, 810], K: [604, 902], A: [640, 1004], T: [676, gy] },
    hn: { H: [282, 798], K: [344, 900], A: [266, 990], T: [292, gy] },
    hf: { H: [262, 792], K: [318, 892], A: [226, 980], T: [248, gy] },
  };
  const T1 = [222, 778], T2 = [162, 822];
  f.joint('spine_1', Pv).joint('spine_2', M2, 'spine_1').joint('spine_3', W3, 'spine_2').joint('neck', NK, 'spine_3').joint('head', add(NK, [70, 30]), 'neck');
  f.joint('jaw', frame(HC, hA, HS)([[0, 30]])[0], 'head').joint('tail_1', T1, 'spine_1').joint('tail_2', T2, 'tail_1');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.H, k[0] === 'f' ? 'spine_3' : 'spine_1').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`);

  const groove = (pts, wd = 2.6, op = 0.55) => f.stroke(pts, wd, '#141210', { op });
  // a clump of mangy fur standing off an edge, frozen: breaks the outline
  const tuft = (q, dir, l, wd) => { const d = E.norm(dir); X.hairClump(f, [q, add(q, add(mul(d, l * 0.5), [(f.r() - 0.5) * 6, 0])), add(q, mul(d, l))], wd, { pal: [furD, mix(fur, furD, 0.4), fur], n: 3 }); };
  // one leg: three bones, each a muscled segment overlapping the next; the paw carries the weight (pads flat, toes splayed)
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.45 : 0, look = FUR({ fill: mix(fur, furD, tone), maxShade: 16 });
    if (part & 1) {
      f.bone(`leg_${k}_1`);
      if (front) f.part(limb(L.H, L.K, 74, 44, { steps: 12, capK: 0.9, p: [[0.55, 0.26, 0.2]], q: [[0.25, 0.1, 0.18]] }), look); // upper arm, triceps behind
      else if (far) f.part(limb(L.H, L.K, 128, 54, { steps: 12, capK: 0.9, p: [[0.4, 0.3, 0.22]], q: [[0.45, 0.16, 0.2]] }), look);
      else { const top = add(L.H, mul(sub(L.H, L.K), 0.7)), clip = E.smooth(body) + ' M0,846 L900,846 L900,1100 L0,1100 Z'; X.clipDraw(f, clip, () => f.part(limb(top, L.K, 112, 50, { steps: 14, capK: 0.9, capA: false, p: [[0.5, 0.34, 0.2]], q: [[0.62, 0.24, 0.16]] }), look)); } // thigh: hamstrings behind, quadriceps in front; its top merges into the croup
      groove(front ? [lp(L.H, L.K, 0.2, 14), lp(L.H, L.K, 0.75, 9)] : [lp(L.H, L.K, 0.15, -20), lp(L.H, L.K, 0.6, 4), lp(L.H, L.K, 0.9, 10)]);
      if (!front) { for (let i = 0; i < 4; i++) tuft(lp(L.H, L.K, 0.3 + i * 0.16, 52 - i * 8), [-0.8, 0.6], 18 + f.r() * 10, 12); } // the breeches behind the thigh
      else for (let i = 0; i < 2; i++) tuft(lp(L.H, L.K, 0.7 + i * 0.15, 22), [-0.6, 0.8], 16, 10); // feathering at the elbow
    }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]];
      if (front) {
        f.part(limb(L.K, L.A, 44, 26, { steps: 12, capK: 0.9, q: [[0.22, 0.22, 0.18]] }), look); // forearm: muscle below the elbow, lean to the wrist
        f.part([add(L.K, mul(nk, 10)), add(add(L.K, mul(nk, 28)), mul(dk, -6)), add(add(L.K, mul(nk, 28)), mul(dk, 14)), add(add(L.K, mul(nk, 12)), mul(dk, 24))], FUR({ fill: mix(fur, furD, tone + 0.15), inkW: 1.1, inkHeavy: 1.5, cast: false, maxShade: 4 })); // the point of the elbow
      } else {
        f.part(limb(L.K, L.A, 58, 24, { steps: 12, capK: 0.9, p: [[0.22, 0.3, 0.18]] }), look); // gaskin: the calf muscle high behind
        f.part([add(L.A, mul(nk, 4)), add(add(L.A, mul(nk, 22)), mul(dk, -8)), add(add(L.A, mul(nk, 20)), mul(dk, 8)), add(L.A, mul(dk, 14))], FUR({ fill: mix(fur, furD, tone + 0.15), inkW: 1.1, inkHeavy: 1.5, cast: false, maxShade: 4 })); // the point of the hock
        f.line([lp(L.K, L.A, 0.3, -10), lp(L.K, L.A, 0.9, -6)], 1.6, '#141210', { op: 0.5 }); // the Achilles cord
      }
      f.line([lp(L.K, L.A, 0.15, front ? -8 : 8), lp(L.K, L.A, 0.85, front ? -6 : 6)], 1.2, furL, { op: 0.4 });
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T, pt = [T[0] - 10, gy - 30]; // the pastern runs down to the back of the paw, sloped
      f.part(K.chain([lerp(L.A, pt, -0.12), L.A, lerp(L.A, pt, 0.55), pt], [26, 24, 20, 28]), FUR({ fill: mix(fur, furD, tone), maxShade: 6, cast: false }));
      if (front) f.part([add(L.A, [-11, -8]), add(L.A, [8, -11]), add(L.A, [13, 4]), add(L.A, [-2, 11]), add(L.A, [-11, 6])], FUR({ fill: mix(fur, furD, tone + 0.15), inkW: 1, inkHeavy: 1.3, cast: false, maxShade: 3 })); // the knob of the wrist
      // the paw: a heel pad behind, three knuckled toes splayed flat on the ground, dark claws, frost on them
      const Xp = u => T[0] + u * 30;
      f.part([[Xp(-0.9), gy - 4, 1], [Xp(-1.0), gy - 24], [Xp(-0.6), gy - 38], [Xp(0.2), gy - 40], [Xp(0.8), gy - 30], [Xp(1.3), gy - 16], [Xp(1.4), gy - 3, 1]], FUR({ fill: mix(fur, furD, tone + 0.1), maxShade: 6, cast: false }));
      for (let i = 0; i < 3; i++) { const tx = Xp(0.05 + i * 0.42); f.part([[tx - 12, gy - 2, 1], [tx - 13, gy - 20], [tx - 4, gy - 29], [tx + 8, gy - 26], [tx + 14, gy - 13], [tx + 13, gy - 2, 1]], FUR({ fill: mix(fur, furD, tone), inkW: 1.1, inkHeavy: 1.5, cast: false, maxShade: 4 })); f.part([[tx + 9, gy - 14], [tx + 22, gy - 6], [tx + 20, gy - 1, 1], [tx + 11, gy - 4]], { fill: P.black, shade: 0.3, inkW: 0.9, cast: false, hatch: false }); f.line([[tx - 6, gy - 24], [tx + 4, gy - 20]], 1, furL, { op: 0.5 }); }
      f.part([[Xp(-1.0), gy - 20], [Xp(-0.65), gy - 30], [Xp(-0.45), gy - 12], [Xp(-0.8), gy - 3]], FUR({ inkW: 1, cast: false, maxShade: 3 })); // the stopper pad behind
      FX.frost([Xp(0.4), gy - 8], 30, 5, 5, 1.1);
    }
  };

  // ---- far legs and the tail, behind the body
  leg('hf', true); leg('ff', true);
  // the tail hangs low and stiff: narrow at the root, a long brush below tapering to a dark tip
  f.bone('tail_1');
  f.part([add(T1, [14, -10]), add(T1, [-8, -14]), add(T2, [-22, -6]), add(T2, [-20, 20]), add(T2, [14, 22]), add(T1, [16, 18])], FUR({ maxShade: 8, inkHeavy: 2 }));
  brist([add(T1, [-4, -12]), add(T2, [-20, -8])], 14, [-0.6, -0.8], { n: 2 });
  f.bone('tail_2');
  const T3 = [130, 910], T4 = [116, 1000];
  const tl = [add(T2, [-22, -8]), add(T2, [16, -4]), add(T3, [22, -10]), add(T3, [20, 26]), add(T4, [6, -4]), [T4[0] - 2, T4[1] + 14, 1], add(T4, [-10, -8]), add(T3, [-22, 22]), add(T3, [-26, -12])];
  const tD = f.part(tl, FUR({ maxShade: 10, inkHeavy: 2 }));
  X.stains(f, tD, [60, 790, 210, 1020], furD, 0.05, 2.6, -1.2, 31, 0.6);
  f.flat([add(T4, [6, -4]), [T4[0] - 2, T4[1] + 14], add(T4, [-10, -8]), add(T4, [-8, -26]), add(T4, [8, -24])], '#1a1816', { op: 0.7 }); // the dark tip
  hair([add(T2, [-20, 0]), add(T3, [-24, 0]), add(T3, [-20, 30]), add(T4, [-10, -10])], 22); hair([add(T3, [20, 0]), add(T3, [18, 30]), add(T4, [4, -8])], 18);
  brist([add(T3, [-24, -8]), add(T3, [-22, 24])], 10, [-1, 0.3], { n: 1 });
  FX.icicles([add(T3, [-20, 26]), add(T4, [-6, 4])], 2, 12, 4);

  // ---- the body: deep narrow chest, tucked belly, a dip behind the withers; split over three spine bones
  const body = [[200, 792], [238, 756], [300, 744], [370, 754], [430, 762], [490, 746], [548, 728], [600, 742], [640, 780], [656, 830], [640, 884], [600, 914], [540, 924], [480, 902], [420, 860], [372, 836], [332, 834], [296, 856], [250, 858], [214, 834]];
  const bodyCut = [['spine_1', side([350, 800], [-1, 0], 0)], ['spine_2', [side([350, 800], [1, 0], 50), side([480, 800], [-1, 0], 0)]], ['spine_3', side([480, 800], [1, 0], 50)]];
  split(f, () => {
    const d = f.part(body, FUR({ maxShade: 34 }));
    X.stains(f, d, [190, 700, 660, 940], furD, 0.025, 2.6, -1.3, 5, 0.65); // the darker saddle
    X.stains(f, d, [190, 700, 660, 940], P.mouldD, 0.05, 3.4, -2.4, 9, 0.55);
    f.flat([[400, 866], [460, 880], [516, 904], [560, 914], [600, 900], [560, 880], [470, 860], [400, 852]], furL, { op: 0.35 }); // the pale belly
    // mange: bare grey skin over the ribs with a ragged fur edge, sores and blisters in it
    const mg = [[380, 806], [420, 796], [470, 808], [492, 840], [478, 870], [430, 868], [388, 852]];
    f.part(mg.map(q => add(q, [(f.r() - 0.5) * 10, (f.r() - 0.5) * 10])), BARE({ fill: mix(P.skin, fur, 0.35), inkW: 0, inkHeavy: 0 }));
    for (let i = 0; i < 3; i++) X.crease(f, [[404 + i * 6, 822 + i * 14], [432 + i * 3, 816 + i * 14], [458 - i * 2, 824 + i * 13]], 1.8, { col: '#2a2626', lit: P.skinL, op: 0.45 });
    X.sore(f, [446, 846], 6); X.pustules(f, [410, 858], 14, 6, 4, 2.2, 3.4);
    brist(mg.concat([mg[0]]), 7, [0, -1], { n: 1 }); X.fungalFur(f, mg, 4, 1, { col: furL, gaps: 0.6 });
    const mh = [[236, 790], [272, 778], [300, 798], [292, 830], [256, 836], [234, 820]];
    f.part(mh.map(q => add(q, [(f.r() - 0.5) * 8, (f.r() - 0.5) * 8])), BARE({ fill: mix(mix(P.skin, P.bruise, 0.3), fur, 0.3), inkW: 0, inkHeavy: 0 })); brist(mh.concat([mh[0]]), 6, [0, -1], { n: 1 });
    X.sore(f, [266, 806], 7, { ang: 0.4 }); X.creaseField(f, [262, 812], 18, 12, 3, 1.1, 16, 1.8, { lit: P.skinL });
    X.mould(f, [340, 810], 15, 11); X.mould(f, [560, 860], 11, 9, { rings: 1 }); X.mould(f, [500, 776], 10, 7, { rings: 1 });
    FX.frost([330, 766], 70, 10, 14);
    hair([[372, 838], [420, 860], [480, 902], [540, 924], [600, 914]], 30, { ice: true }); // belly fringe
    X.clipDraw(f, d, () => { X.softTone(f, d, [[[[372, 830], [480, 860], [600, 920], [460, 930], [360, 860]], '#000', 0.45, 10], [[[250, 760], [340, 750], [330, 800], [260, 810]], '#ffffff', 0.12, 12]]); for (let i = 0; i < 5; i++) groove([[440 + i * 24, 790 + i * 3], [452 + i * 22, 840], [446 + i * 19, 890 - i * 4]], 2.4, 0.35); }); // the ribs under the mange, the tuck in shadow
    for (const [q, dd] of [[[300, 746], [-0.3, -1]], [[420, 760], [0.2, -1]], [[214, 800], [-1, -0.3]], [[340, 838], [0, 1]], [[452, 878], [0.2, 1]]]) tuft(q, dd, 18 + f.r() * 10, 14); // mangy clumps standing off the outline
  }, bodyCut);

  // ---- near hind leg: the heavy thigh, the hock angled back; mange down the shin
  const L1 = LEG.hn;
  leg('hn', false, 1);
  f.bone('leg_hn_1');
  X.softTone(f, E.smooth([[180, 700], [380, 700], [380, 940], [180, 940]]), [[[[236, 766], [292, 758], [324, 792], [300, 820], [250, 810]], '#ffffff', 0.14, 10], [[[256, 846], [330, 850], [340, 880], [270, 884]], '#000', 0.35, 10]]); // the haunch muscle over the hip, by light and shadow
  groove([[246, 770], [290, 800], [318, 860]], 2.6, 0.5);
  { const bm = [[270, 790], [302, 784], [318, 806], [312, 832], [292, 844], [272, 826], [262, 808]]; f.part(bm.map(q => add(q, [(f.r() - 0.5) * 8, (f.r() - 0.5) * 8])), BARE({ fill: mix(mix(P.skin, P.bruise, 0.3), fur, 0.3), inkW: 0, inkHeavy: 0 })); X.sore(f, [288, 818], 7, { ang: 0.4 }); X.creaseField(f, [284, 814], 14, 10, 3, 1.1, 14, 1.8, { lit: P.skinL }); }
  FX.rime([[232, 764], [268, 752], [300, 756]], 6, 1);
  X.mould(f, lp(L1.H, L1.K, 0.5, 4), 12, 9, { rings: 1 });

  // ---- near foreleg: the shoulder blade under the fur, a thick forearm, the paw splayed
  leg('fn', false, 1);
  f.bone('spine_3');
  X.softTone(f, E.smooth([[500, 700], [680, 700], [680, 940], [500, 940]]), [[[[556, 756], [600, 762], [614, 806], [590, 820], [566, 800]], '#ffffff', 0.14, 10], [[[560, 850], [612, 856], [606, 890], [566, 886]], '#000', 0.35, 10]]); // the shoulder blade's mass, laid back from the withers
  groove([[556, 752], [584, 800], [604, 846]], 2.8, 0.55);
  hair([[566, 880], [590, 886], [610, 876]], 24);

  // ---- neck and head: low, thrust forward, the snarl
  f.bone('neck');
  const neck = [[520, 744], [584, 742], [646, 776], [692, 806], [702, 858], [666, 900], [626, 904], [596, 880], [568, 840]];
  const nD = f.part(neck, FUR({ maxShade: 20, inkHeavy: 1.2, cast: false }));
  X.stains(f, nD, [500, 720, 720, 920], furD, 0.035, 2.6, -1.4, 17, 0.55);
  hair([[612, 896], [642, 904], [672, 896]], 30); // throat ruff
  f.bone('head');
  const hF = frame(HC, hA, HS);
  // laid-back ears behind the skull
  f.part(hF([[-46, -38], [-92, -70], [-66, -78, 1], [-26, -50]]), FUR({ maxShade: 6, fill: mix(fur, furD, 0.35) }));
  f.part(hF([[-28, -44], [-78, -70], [-52, -80, 1], [-8, -50]]), FUR({ maxShade: 6 }));
  f.flat(hF([[-30, -50], [-66, -70], [-52, -74], [-18, -54]]), '#2a2622', { op: 0.85 });
  brist(hF([[-64, -76], [-44, -86]]), 6, rot([-0.4, -1], hA), { n: 1 });
  // skull, stop and muzzle: a wedge, deepest at the stop, the nose blunt
  const skull = hF([[-68, -6], [-58, -36], [-28, -52], [10, -50], [38, -40], [56, -30], [96, -24], [130, -18], [146, -10], [150, 2], [144, 12], [120, 16], [84, 18], [52, 20], [30, 26], [0, 38], [-36, 40], [-62, 22]]);
  const kD = f.part(skull, FUR({ maxShade: 16 }));
  X.stains(f, kD, [580, 760, 880, 960], furD, 0.05, 2.6, -1.4, 23, 0.45);
  f.flat(hF([[40, -38], [130, -18], [146, -8], [110, -10], [60, -20]]), furD, { op: 0.35 }); // the dark muzzle bridge
  f.flat(hF([[30, 24], [84, 18], [120, 16], [96, 8], [48, 10]]), furL, { op: 0.35 }); // the pale lip line
  hair(hF([[-60, 16], [-38, 36], [-8, 40]]), 26); // the cheek ruff
  // bare sore-crusted skin on the muzzle; the nose wrinkled back in folds
  f.part(hF([[70, -26], [124, -20], [140, -12], [128, 0], [90, 4], [72, -6]]), BARE());
  for (let i = 0; i < 3; i++) X.crease(f, hF([[82 + i * 14, -24], [86 + i * 14, -14], [82 + i * 14, -4]]), 2.4, { col: '#2a2626', lit: P.skinL });
  X.sore(f, hF([[104, -6]])[0], 5, { ang: hA }); X.pustules(f, hF([[62, -8]])[0], 8, 5, 3, 1.8, 2.8);
  // the nose: black, cracked with cold, a frost rim on the nostril
  f.part(hF([[134, -18], [148, -14], [156, -2], [152, 10], [140, 10], [134, -2]]), { fill: P.black, shade: 0.35, inkW: 1.2, cast: false, hatch: false });
  f.flat(hF([[142, 0], [150, 2], [148, 6], [142, 6]]), '#000');
  f.line(hF([[138, -14], [150, -10]]), 1.2, P.hoar, { op: 0.6 });
  // the eye: narrow and slanted under a dragged-down brow, filmed with frost
  f.flat(hF([[6, -28], [22, -34], [38, -30], [26, -23], [10, -22]]), '#121210');
  f.flat(hF([[12, -27], [22, -31], [32, -28], [24, -25]]), '#8c928a');
  f.flat(hF(ell([24, -28], 2.6, 2.2, 0, 8)), '#2e322c');
  f.stroke(hF([[0, -36], [22, -42], [44, -34]]), 4, '#161412');
  f.line(hF([[8, -29], [22, -34], [36, -30]]), 1, P.hoar, { op: 0.7 });
  // the snarl: the upper lip curled off the front teeth only, the gum showing; fangs stained green to the root
  f.flat(hF([[56, 18], [140, 12], [142, 24], [120, 30], [84, 32], [58, 28]]), '#0e0c0c');
  f.part(hF([[88, 12], [140, 8], [142, 16], [120, 22], [92, 20]]), { fill: mix(P.bruise, P.skin, 0.25), shadow: P.bruiseD, shade: 0.35, inkW: 1, cast: false, hatch: false });
  const tooth = (x, y, l, w, up) => { const s2 = up ? -1 : 1; f.part(hF([[x - w, y], [x + w, y], [x + w * 0.25, y + l * s2], [x - w * 0.3, y + l * 0.85 * s2]]), { fill: P.bone, shadow: P.boneS, shade: 0.35, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(hF([[x - w, y], [x + w, y], [x + w * 0.8, y + l * 0.4 * s2], [x - w * 0.8, y + l * 0.4 * s2]]), P.mouldD, { op: 0.7 }); };
  for (const [x, l, w] of [[136, 8, 2.6], [130, 8, 2.6], [118, 24, 5], [100, 9, 4.5], [86, 10, 5]]) tooth(x, 18, l, w, false);
  f.stroke(hF([[80, 14], [104, 6], [128, 2], [146, 10]]), 3, '#1c1818'); // the lip's curled edge
  f.line(hF([[50, 20], [66, 16], [60, 30]]), 1.4, INK, { op: 0.75 });
  FX.rime(hF([[-58, -36], [-28, -52], [10, -50], [38, -40]]), 6, 1);
  f.bone('jaw');
  const jaw = hF([[-24, 34], [40, 32], [100, 30], [136, 26], [140, 34], [124, 46], [84, 50], [30, 50], [-18, 46]]);
  f.part(jaw, FUR({ maxShade: 6, cast: false }));
  f.part(hF([[90, 30], [136, 26], [138, 32], [120, 38], [94, 38]]), { fill: mix(P.bruise, P.skin, 0.2), shadow: P.bruiseD, shade: 0.3, inkW: 0.9, cast: false, hatch: false });
  for (const [x, l, w] of [[124, 18, 4.5], [108, 8, 3.6], [96, 7, 3.6]]) tooth(x, 30, l, w, true);
  f.line(hF([[96, 48], [102, 66], [98, 80]]), 1.4, P.mouldL, { op: 0.6 }); // spittle frozen as it fell
  FX.icicle(hF([[98, 50]])[0], 16, 3);
  hair(hF([[-10, 46], [30, 50], [70, 48]]), 18);

  // ---- hackles: stiff fur standing up from the nape to the middle of the back, highest over the withers
  f.bone('neck');
  brist([[690, 806], [660, 784], [624, 762], [584, 744], [546, 734]], 46, [-0.35, -1], { n: 3, taper: t => 0.5 + t * 0.6, ice: true });
  f.bone('spine_3');
  brist([[546, 734], [516, 740], [486, 748]], 44, [-0.4, -1], { n: 3, taper: t => 1 - t * 0.4 });
  FX.rime([[640, 770], [590, 744], [520, 738]], 6, 1);
  f.bone('spine_2');
  brist([[486, 748], [440, 756], [390, 758]], 26, [-0.4, -1], { n: 2, taper: t => 1 - t * 0.7 });
  X.spores(f, [740, 930], 50, 30, 8, 1.2);

  // ---- near lower legs, in front
  leg('hn', false, 6); leg('fn', false, 6);
  f.bone('leg_hn_2'); X.sore(f, lp(LEG.hn.K, LEG.hn.A, 0.45, 2), 4.5, { ang: ang(LEG.hn.K, LEG.hn.A) });
  f.bone('leg_fn_2'); X.mould(f, lp(LEG.fn.K, LEG.fn.A, 0.4, 0), 7, 10, { rings: 0 });
  f.bone('root');
  for (const L of Object.values(LEG)) f.flat(ell(add(L.T, [10, 0]), 46, 5, 0, 12), P.frostD, { op: 0.4 });
  f.flat(ell([420, gy + 2], 320, 8, 0, 20), P.frostD, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ GRAVE WORM (cast, large 1.5, reared)
// A grave worm that has eaten so many of the barrow's dead it has begun to look like them. Rebuilt in review the way the
// Fissure Worm was: one muscular body with one continuous ink edge, heavier on the shadow side; a thick trunk with a heavy
// collar where it rises off the coiled tail; irregular annuli that bunch into deep creases on the inside of each bend and
// stretch thin where it is drawn out; swellings where swallowed bodies lie in the gut. The head is bent down at the front
// rank with the maw open: a lamprey's disc seen at an angle, a fleshy puckered lip, radial rows of bone-like teeth hooking
// in toward an off-centre gullet (never a round pupil-like hole: eyes are for void worlds).
// Frost rimes its back (the windward side) and hangs icicles under the bends; toxin furs the creases and the underside
// with mould, opens sores, fruits grave caps on the coil. The dead press out through the skin: faces, a hand, ribs, a ring.
// Rig: seg_1 (root, the coil) .. seg_8 (one chain up the body) > head. Motion: idle a slow writhe; attack a lunging bite.
function graveWorm() {
  const [CW, CH] = TIERS.large, seed = 907;
  const f = new Fig(X.base(seed, CH, { grimeY: 880 }));
  X.textures(f); const FX = X.fx(f);
  const gy = f.o.groundY;
  const skin = mix(P.skin, P.bone, 0.3), dkC = '#3a3632', ltC = mix(skin, '#fff', 0.45);
  const SKW = (o = {}) => Object.assign({ fill: skin, shadow: '#4e4a46', light: '#e4e2d8', shade: 0, hi: 0, tex: 'mottle' + seed, texOp: 0.55, inkW: 0, inkHeavy: 0 }, o);
  // centreline: the tail lies coiled on the floor behind, the trunk rises off it, rears in an S and bends the head down
  const ctrl = [[110, 1046], [230, 1058], [360, 1050], [470, 1010], [520, 920], [500, 800], [446, 690], [418, 576], [440, 462], [504, 372], [590, 318], [670, 318], [724, 368], [748, 430]];
  const C = X.spline(ctrl, 4), Sx = X.arcLen(C), T = Sx[Sx.length - 1];
  const g = (t, c, s) => Math.exp(-(((t - c) / s) ** 2));
  const AT = u => { u = Math.max(0, Math.min(T, u)); let i = Sx.findIndex(v => v >= u); if (i < 1) i = 1; const a = C[i - 1], b = C[i], k = (u - Sx[i - 1]) / Math.max(1e-6, Sx[i] - Sx[i - 1]), d = E.norm(sub(b, a)); return { p: lerp(a, b, k), d, n: [-d[1], d[0]] }; };
  // width: a thin tail tip, a thick trunk with a muscular collar, swallowed bodies swelling the gut, the neck drawn thin,
  // the hood flaring behind the maw
  const Wd = u => { const t = Math.max(0, Math.min(1, u / T)); return Math.min(1, t / 0.22) * 250 - 110 * Math.max(0, t - 0.32) / 0.68 + 36 * g(t, 0.3, 0.04) + 30 * g(t, 0.46, 0.04) + 26 * g(t, 0.64, 0.035) - 20 * g(t, 0.76, 0.05) + 90 * g(t, 0.985, 0.04) + 24; };
  const kap = u => { const a = AT(u - 10).d, b = AT(u + 10).d; return (a[0] * b[1] - a[1] * b[0]) / 20; };
  // final pass 2026-11-25: the body read as a ringed tube (even width, even rings). Each flank now has its own lumps
  // (the swallowed dead bulge one side, not both; the belly sags where the trunk leans), the annuli bunch in fold groups
  // with stretched smooth spans between, and the creases run oblique. A local PRNG keeps the rest of the figure's stream.
  const LR = (() => { let s = 90731; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const bumps = { 1: [], '-1': [] };
  for (const sd of [1, -1]) for (let k = 0; k < 9; k++) bumps[sd].push([0.26 + LR() * 0.66, 0.025 + LR() * 0.045, (LR() - 0.42) * 0.4]);
  bumps[-1].push([0.46, 0.05, 0.28], [0.64, 0.04, -0.12], [0.9, 0.03, -0.12]); bumps[1].push([0.46, 0.04, -0.1], [0.64, 0.045, 0.3], [0.82, 0.04, 0.14], [0.9, 0.03, -0.1]); // the dead push out one flank at a time
  const lump = (u, s) => { const t = u / T; let v = 0; for (const [c, w, a] of bumps[s >= 0 ? 1 : -1]) v += a * g(t, c, w); return v * (1 - g(t, 1, 0.07)) * Math.min(1, t / 0.24); };
  const ringsU = [], ringK = []; { let u = 40; while (u < T - 30) { const t = u / T, bend = Math.min(1, Math.abs(kap(u)) * 150), grp = LR() < 0.3 + 0.45 * bend + 0.35 * g(t, 0.3, 0.05);
    if (grp) { const n = 3 + Math.floor(LR() * 3); for (let k = 0; k < n && u < T - 30; k++) { ringsU.push(u); ringK.push(0.2 + LR() * 0.3 + (k > 0 && k < n - 1 ? 0.3 : 0)); u += 14 + LR() * 12; } u += 40 + LR() * 50; }
    else { ringsU.push(u); ringK.push(-0.3 - LR() * 0.2); u += 66 + LR() * 60 + 30 * g(t, 0.76, 0.06); } } }
  const ringTilt = ringsU.map(() => (LR() - 0.5) * 0.36);
  const scal = (u, s) => { let best = 1e9, bk = 0, bw = 1e-6; for (let i = 0; i < ringsU.length; i++) { const d = Math.abs(u - ringsU[i]), wq = Math.exp(-((d / 28) ** 2)); best = Math.min(best, d); bk += ringK[i] * wq; bw += wq; } bk /= bw; const kk = Math.max(0, s * kap(u)) * Wd(u); return Math.min(1, best / 9) * Math.max(0.004, 0.02 + 0.08 * kk + 0.03 * g(u / T, 0.3, 0.05) + 0.045 * bk); };
  const edge = (u, s, k = 1) => { const a = AT(u); return add(a.p, mul(a.n, s * Wd(u) * 0.5 * (1 + scal(u, s) + lump(u, s)) * k)); };
  const halfW = (u, s) => Wd(u) * 0.5 * (1 + lump(u, s));
  const outline = (u0, u1, k = 1, capA = true) => { const L = [], R2 = []; for (let u = u0; u <= u1 + 0.1; u += 5) { L.push(edge(u, 1, k)); R2.push(edge(u, -1, k)); } const cap = []; if (capA) { const a0 = AT(u0), w0 = Wd(u0) * 0.5 * k; for (let j = 1; j < 10; j++) { const t = Math.PI * j / 10; cap.push(add(add(a0.p, mul(a0.n, -Math.cos(t) * w0)), mul(a0.d, -Math.sin(t) * w0 * (u0 < 5 ? 1.2 : 0.2)))); } } return [...L, ...R2.reverse(), ...cap]; };
  const P2 = (t, v) => { const a = AT(t * T); return add(a.p, mul(a.n, v * halfW(t * T, v))); };
  const NSEG = 8, segU = []; for (let i = 0; i <= NSEG; i++) segU.push(T * 0.26 + T * 0.68 * i / NSEG);
  f.joint('seg_1', AT(T * 0.18).p);
  for (let i = 1; i < NSEG; i++) f.joint('seg_' + (i + 1), AT(segU[i]).p, 'seg_' + i);
  f.joint('head', AT(segU[NSEG]).p, 'seg_' + NSEG);
  // which side is up (windward back): the n side faces -x on the rising part
  const segRange = i => [i ? segU[i] - 16 : 0, segU[i + 1] + 4];

  // ---- the body, one bone per segment; each copy overlaps the one below and carries no ink of its own
  for (let i = 0; i < NSEG; i++) {
    f.bone('seg_' + (i + 1));
    const [u0, u1] = segRange(i), mid = (u0 + u1) / 2;
    const d = f.part(outline(u0, u1, 1, i === 0), SKW());
    X.clipDraw(f, d, () => {
      X.stains(f, d, [0, 200, 900, 1100], P.mouldD, 0.045, 3.2, -2.3, 7 + i, 0.5);
      for (let ri = 0; ri < ringsU.length; ri++) { const r = ringsU[ri]; if (r < u0 - 2 || r > u1 + 2) continue; const a = AT(r), w = Wd(r) * 0.5, t = r / T, deep = Math.max(0.05, Math.min(1, 0.3 + ringK[ri] + 0.6 * g(t, 0.3, 0.05) + 2.2 * Math.abs(kap(r)) * w - 0.35 * g(t, 0.76, 0.06))), tl = ringTilt[ri], bow = 0.1 + 0.08 * f.r();
        const arc = []; for (let k = 0; k <= 12; k++) { const th = Math.PI * k / 12, sd = Math.cos(th) > 0 ? 1 : -1, ww = halfW(r, sd) * (1 + scal(r, sd)); arc.push(add(add(a.p, mul(a.n, Math.cos(th) * ww)), mul(a.d, -Math.sin(th) * ww * bow + Math.cos(th) * ww * tl))); }
        const k0 = deep > 0.6 ? 0 : Math.floor(f.r() * 3), k1 = deep > 0.6 ? 12 : 12 - Math.floor(f.r() * 3), seg2 = deep > 0.45 ? arc.slice(k0, k1 + 1) : (f.r() < 0.5 ? arc.slice(0, 4) : arc.slice(9));
        f.line(seg2, 1 + deep * 2.8, '#24201c', { op: 0.3 + deep * 0.45 });
        if (deep > 0.45) f.line(arc.slice(3, 9).map(q => add(q, mul(a.d, 3 + deep * 3))), 1 + deep * 1.4, '#f2f0e6', { op: 0.2 + deep * 0.3 });
        const si = kap(r) > 0 ? 1 : -1; if (Math.abs(kap(r)) * w > 0.25) { const q = edge(r, si); f.line([q, add(q, mul(a.n, -si * w * 0.3))], 1.6, '#24201c', { op: 0.5 }); X.fungalFur(f, [edge(r - 6, si, 0.96), edge(r + 6, si, 0.96)], 8, -si, { gaps: 0.2 }); } // mould furred in the folds of the bend
        if (ringK[ri] < 0) for (let k = 0; k < 3; k++) { const v = (LR() - 0.5) * 1.3, ua = r + 8 + LR() * 10, ub = ua + 26 + LR() * 30, pts2 = []; for (let uu = ua; uu <= ub; uu += 6) { const b = AT(uu); pts2.push(add(b.p, mul(b.n, v * halfW(uu, v > 0 ? 1 : -1)))); } f.line(pts2, 1, '#24201c', { op: 0.28 }); } // stretch lines on a drawn-out span
      }
      for (let k = 0; k < 5; k++) { const q = add(AT(mid + (f.r() - 0.5) * 50).p, mul(AT(mid).n, (f.r() - 0.4) * Wd(mid) * 0.7)); f.flat(ell(q, 2.5 + f.r() * 3, 2 + f.r() * 2, f.r() * 3, 8), '#5a5650', { op: 0.6 }); } // pits
    });
    for (const sg of [1, -1]) for (let k = 0; k < 2; k++) { const a = AT(mid + (k - 0.5) * 26), q = edge(mid + (k - 0.5) * 26, sg); f.line([q, add(q, add(mul(a.n, sg * 12), mul(a.d, -6)))], 1.4, P.boneD, { op: 0.8, straight: true }); } // setae
  }
  // ---- shading and the one ink edge, per segment so the rig keeps them; frost and mould on top
  for (let i = 0; i < NSEG; i++) {
    f.bone('seg_' + (i + 1));
    const [u0, u1] = segRange(i), B2 = [], L3 = [], EL = [], ER = [];
    for (let u = i ? segU[i] : 0; u <= u1; u += 6) { const a = AT(u); B2.push(edge(u, -1, 1.02)); L3.push(add(a.p, mul(a.n, -Wd(u) * (0.06 - 0.5 * lump(u, -1) + 0.25 * lump(u, 1) + 0.06 * Math.sin(u * 0.037 + 1) * Math.sin(u * 0.011))))); EL.push(edge(u, 1)); ER.push(edge(u, -1)); }
    X.clipDraw(f, E.smooth(outline(u0, u1 + 4, 1, i === 0)), () => { f.flat([...B2, ...L3.slice().reverse()], '#2a2826', { op: 0.42 }); f.raw(`<path d="${E.smooth([...B2, ...L3.slice().reverse()])}" fill="url(#xhatch${seed})" opacity="0.45"/>`); f.line(EL.map((q, k) => add(q, mul(AT((i ? segU[i] : 0) + k * 6).n, -Wd((i ? segU[i] : 0) + k * 6) * 0.16))), 3, '#ffffff', { op: 0.18 }); });
    if (i === 0) { const a0 = AT(0), cap = []; for (let j = 0; j <= 10; j++) { const t = Math.PI * j / 10; cap.push(add(add(a0.p, mul(a0.n, Math.cos(t) * Wd(0) * 0.5)), mul(a0.d, -Math.sin(t) * Wd(0) * 0.6))); } f.line(cap, 3, INK); }
    f.line(EL, 2.2, INK); f.line(ER, 3.6, INK);
  }
  // ---- the dead pressing out from inside: faces (shut, no eyes), a hand, ribs, a ring. Low relief in the skin's tone
  const pressedFace = (bone, c, s, a0) => {
    f.bone(bone); const F = frame(c, a0, s);
    const hd = F([[-0.5, -0.5], [0.5, -0.5], [0.6, 0.2], [0.3, 0.8], [-0.3, 0.8], [-0.6, 0.2]]);
    X.softTone(f, E.smooth(F([[-0.9, -0.9], [0.9, -0.9], [0.9, 1.1], [-0.9, 1.1]])), [[hd, '#ffffff', 0.18, 6], [hd.map(q => add(q, [-5, 6])), '#000', 0.25, 6]]);
    f.line(F([[-0.6, 0.1], [-0.55, -0.4], [0.0, -0.62], [0.55, -0.4], [0.62, 0.1]]), 2.2, ltC, { op: 0.6 }); f.line(F([[-0.62, 0.2], [-0.36, 0.74], [0.0, 0.9], [0.36, 0.74]]), 2.4, dkC, { op: 0.6 }); // the skull's rim pushing the skin
    f.flat(F([[-0.42, -0.1], [-0.24, -0.16], [-0.06, -0.1], [-0.24, -0.02]]), dkC, { op: 0.65 }); f.flat(F([[0.06, -0.1], [0.24, -0.16], [0.42, -0.1], [0.24, -0.02]]), dkC, { op: 0.65 });
    f.line(F([[-0.38, -0.06], [-0.24, -0.02], [-0.1, -0.06]]), 1.3, dkC, { op: 0.7 }); f.line(F([[0.1, -0.06], [0.24, -0.02], [0.38, -0.06]]), 1.3, dkC, { op: 0.7 });
    f.stroke(F([[-0.42, -0.24], [0.0, -0.3], [0.42, -0.24]]), s * 0.08, ltC, { op: 0.75 });
    f.stroke(F([[0.02, -0.18], [0.06, 0.12], [0.0, 0.22]]), s * 0.08, ltC, { op: 0.75 }); f.line(F([[-0.06, 0.06], [-0.1, 0.22], [0.02, 0.26]]), 1.4, dkC, { op: 0.55 });
    f.flat(F([[-0.16, 0.44], [0.0, 0.4], [0.16, 0.44], [0.1, 0.56], [-0.1, 0.56]]), dkC, { op: 0.85 }); f.stroke(F([[-0.2, 0.62], [0.0, 0.7], [0.2, 0.62]]), s * 0.06, ltC, { op: 0.6 }); // the mouth open in a scream, pushing the skin
    f.line(F([[-0.5, 0.2], [-0.3, 0.7], [0.0, 0.85], [0.3, 0.7], [0.5, 0.2]]), 1.4, dkC, { op: 0.35 });
  };
  const pressedHand = (bone, c, s, a0) => { f.bone(bone); const F = frame(c, a0, s); f.flat(F([[-0.4, -0.2], [0.3, -0.3], [0.4, 0.3], [-0.3, 0.35]]), dkC, { op: 0.14 }); for (let k = 0; k < 4; k++) { const y = -0.24 + k * 0.17; f.stroke(F([[0.3, y], [0.7, y - 0.02], [0.95 - (k === 3 ? 0.2 : 0), y + 0.02]]), s * 0.08, ltC, { op: 0.5 }); f.line(F([[0.3, y + 0.07], [0.9 - (k === 3 ? 0.2 : 0), y + 0.08]]), 1.2, dkC, { op: 0.45 }); } f.stroke(F([[-0.1, 0.3], [0.2, 0.5], [0.45, 0.55]]), s * 0.08, ltC, { op: 0.5 }); };
  const pressedRibs = (bone, c, s, a0) => { f.bone(bone); const F = frame(c, a0, s); for (let k = 0; k < 5; k++) { const y = -0.5 + k * 0.25; f.stroke(F([[-0.6, y + 0.2], [-0.1, y - 0.05], [0.5, y + 0.05], [0.7, y + 0.25]]), s * 0.05, ltC, { op: 0.5 }); f.stroke(F([[-0.6, y + 0.3], [-0.1, y + 0.06], [0.5, y + 0.15]]), s * 0.04, dkC, { op: 0.4 }); } };
  const bAt = t => 'seg_' + Math.max(1, Math.min(NSEG, 1 + segU.findIndex(u => u > t * T) - 1));
  const dirA = t => { const a = AT(t * T).d; return Math.atan2(a[1], a[0]); };
  pressedFace(bAt(0.46), P2(0.46, 0.1), 100, dirA(0.46) - Math.PI / 2);
  pressedFace(bAt(0.64), P2(0.64, -0.05), 88, dirA(0.64) - Math.PI / 2);
  pressedFace(bAt(0.83), P2(0.83, 0.05), 66, dirA(0.83) - Math.PI / 2);
  pressedHand(bAt(0.55), P2(0.55, -0.35), 56, dirA(0.55) + Math.PI);
  pressedRibs(bAt(0.36), P2(0.36, -0.1), 78, dirA(0.36) + Math.PI / 2);
  pressedHand('seg_1', P2(0.2, 0.05), 50, -2.8);
  { f.bone(bAt(0.7)); const q = P2(0.7, 0.3); f.part(ell(q, 9, 6, 0.4, 10), { fill: P.silverD, shadow: '#262a28', shade: 0.4, inkW: 1.1, cast: false }); f.flat(ell(q, 5, 3, 0.4, 8), skin, { op: 0.9 }); } // a ring pressed out from a finger inside

  // which edge is the back: on the rising trunk the +n side faces left (windward)
  f.bone(bAt(0.42)); FX.rime([edge(T * 0.36, 1), edge(T * 0.42, 1), edge(T * 0.48, 1)], 10, 1);
  f.bone(bAt(0.62)); FX.rime([edge(T * 0.56, 1), edge(T * 0.62, 1), edge(T * 0.68, 1)], 9, 1);
  f.bone(bAt(0.83)); FX.rime([edge(T * 0.78, 1), edge(T * 0.83, 1), edge(T * 0.88, 1)], 8, 1);
  f.bone(bAt(0.32)); FX.icicles([edge(T * 0.3, -1), edge(T * 0.34, -1)], 3, 28, 7);
  f.bone(bAt(0.72)); FX.icicles([edge(T * 0.7, -1), edge(T * 0.74, -1)], 3, 22, 6);
  f.bone(bAt(0.52)); X.shag(f, [edge(T * 0.48, -0.96), edge(T * 0.52, -0.96), edge(T * 0.56, -0.96)], 30, { n: 2, ice: true }); X.sore(f, P2(0.5, 0.4), 9, { ang: 1.4 }); X.mould(f, P2(0.52, -0.5), 18, 12, { rings: 1 });
  f.bone(bAt(0.38)); X.mould(f, P2(0.34, 0.45), 30, 18); X.mould(f, P2(0.4, -0.7), 26, 16, { rings: 2 }); X.fungalFur(f, [edge(T * 0.3, 1, 0.97), edge(T * 0.36, 1, 0.97), edge(T * 0.42, 1, 0.97)], 12, 1); X.sore(f, P2(0.4, -0.4), 8, { ang: 1.2 }); X.pustules(f, P2(0.42, 0.3), 14, 14, 5, 3, 5);
  f.bone(bAt(0.7)); X.mould(f, P2(0.72, -0.4), 20, 14, { rings: 1 }); X.mould(f, P2(0.78, 0.6), 22, 14); X.fungalFur(f, [edge(T * 0.66, 1, 0.97), edge(T * 0.72, 1, 0.97), edge(T * 0.78, 1, 0.97)], 10, 1); X.sore(f, P2(0.68, 0.45), 7, { ang: 1.2 });
  f.bone('seg_1');
  X.shag(f, [edge(T * 0.06, -0.96), edge(T * 0.14, -0.96), edge(T * 0.22, -0.96)], 22, { n: 2, ice: true });
  X.graveCaps(f, P2(0.1, 0.9), deg(-100), 40, 3); X.graveCaps(f, P2(0.24, 0.95), deg(-80), 34, 2);
  X.mould(f, P2(0.16, 0.2), 20, 12); FX.frost(P2(0.14, 0.4), 60, 14, 14);
  f.flat([[60, 1010], [520, 990], [530, 1090], [60, 1090]], P.earth, { op: 0.3 });
  // shroud linen from the dead it swallowed, caught in a fold and wound round it (the remnant of what it ate)
  f.bone(bAt(0.6)); { const a = P2(0.6, 0.95); const pts = [[...add(a, [-15, -4]), 1], [...add(a, [15, -2]), 1], add(a, [18, 40]), [...add(a, [20, 82]), 1], add(a, [6, 66]), [...add(a, [0, 96]), 1], add(a, [-8, 62]), [...add(a, [-18, 74]), 1], add(a, [-16, 36])]; const d = f.part(pts, { fill: P.linen, shadow: P.linenD, tex: 'weave' + seed, texOp: 0.6, maxShade: 7, inkW: 1.1, inkHeavy: 1.5 }); X.stains(f, d, [a[0] - 60, a[1] - 10, a[0] + 60, a[1] + 110], P.mouldD, 0.07, 3, -1.6, 43, 0.7); FX.icicle(add(a, [0, 94]), 14, 4); }
  f.bone(bAt(0.42)); f.part(K.chain([P2(0.4, 0.95), P2(0.42, 0.1), P2(0.44, -0.95)], [18, 20, 16]), { fill: mix(P.linen, P.linenD, 0.3), tex: 'weave' + seed, texOp: 0.6, maxShade: 5, inkW: 1.1, cast: false });

  // ---- the head: the hood behind the maw, and the maw itself, a sucking disc turned three-quarter toward us
  f.bone('head');
  const hU = segU[NSEG], hd2 = AT(T).d, mA = Math.atan2(hd2[1], hd2[0]);
  const headP = outline(hU - 16, T - 4, 1.0, false);
  f.part(headP, SKW({ inkW: 0 }));
  f.line(headP.slice(0, Math.floor(headP.length / 2) - 1), 2.2, INK); f.line(headP.slice(Math.floor(headP.length / 2) + 1), 3.6, INK);
  X.clipDraw(f, E.smooth(headP), () => { for (let k = 0; k < 4; k++) { const r = hU + 10 + k * 18, a = AT(r), w = Wd(r) * 0.5, arc = []; for (let j = 0; j <= 10; j++) { const th = Math.PI * j / 10; arc.push(add(add(a.p, mul(a.n, Math.cos(th) * w)), mul(a.d, -Math.sin(th) * w * 0.14))); } f.line(arc, 2.4, '#24201c', { op: 0.6 }); f.line(arc.slice(2, 8).map(q => add(q, mul(a.d, 4))), 1.6, '#f2f0e6', { op: 0.4 }); } });
  const mc = add(AT(T).p, mul(hd2, 4)), rx = Wd(T) * 0.56, ry = Wd(T) * 0.3;
  const D = (c, pts) => pts.map(([u, v]) => add(c, rot([v, u], mA)));
  const wob = (a, b, ph, n = 24) => { const r = []; for (let k = 0; k < n; k++) { const t = Math.PI * 2 * k / n, j = 1 + 0.08 * Math.sin(t * 3 + ph) + 0.05 * Math.sin(t * 5 + ph * 2); r.push([Math.cos(t) * a * j, Math.sin(t) * b * j]); } return r; };
  const LIP = { fill: mix(skin, P.bruise, 0.25), shadow: '#4a4044', light: '#e0dad2', shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, maxShade: 10, inkW: 1.6, inkHeavy: 2.4, cast: false };
  const rim = wob(rx, ry, 0.7);
  rim.forEach(q => { if (f.r() < 0.7) f.part(ell(D(mc, [[q[0] * 1.06, q[1] * 1.08]])[0], 4 + f.r() * 4, 3 + f.r() * 2, f.r() * 3, 7), Object.assign({}, LIP, { inkW: 0.8, inkHeavy: 1, shade: 0.2 })); }); // papillae
  f.part(D(mc, rim), LIP);
  for (let k = 0; k < 14; k++) { const a = Math.PI * 2 * k / 14; X.crease(f, D(mc, [[Math.cos(a) * rx * 0.8, Math.sin(a) * ry * 0.8], [Math.cos(a) * rx * 0.98, Math.sin(a) * ry * 0.98]]), 2, { col: '#24201c', lit: P.skinL, op: 0.6 }); } // the lip puckered in radial folds
  const tc = add(mc, mul(hd2, 4)), inner = rim.map(q => [q[0] * 0.8, q[1] * 0.76]);
  f.part(D(tc, inner), { fill: '#8e8480', shadow: '#3a3034', shade: 0.45, inkW: 1.2, inkHeavy: 1.4, cast: false, hatch: false, tex: 'mottle' + seed, texOp: 0.5 });
  for (let k = 0; k < 16; k++) { const a = Math.PI * 2 * k / 16; f.line(D(tc, [[Math.cos(a) * rx * 0.3, Math.sin(a) * ry * 0.3], [Math.cos(a + 0.1) * rx * 0.74, Math.sin(a + 0.1) * ry * 0.72]]), 1.2, '#3a3034', { op: 0.5 }); }
  // the gullet sits off-centre toward the far side: a puckered, irregular slit with creases radiating, dark, no glow
  const thr = add(tc, rot([ry * 0.18, -rx * 0.24], mA));
  // radial rows of hooked bone teeth, all pointing in toward the gullet, smaller toward it
  for (let k = 0; k < 13; k++) { const a = Math.PI * 2 * k / 13 + 0.2 + (f.r() - 0.5) * 0.2; for (const r of [0.72, 0.55, 0.38]) { if (f.r() < 0.1) continue; const rr = r + (f.r() - 0.5) * 0.06, base = D(tc, [[Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]])[0], inw = E.norm(sub(thr, base)), sd = [-inw[1], inw[0]], l = 8 + r * 22 + f.r() * 6, w = 4 + r * 9;
    f.part([[...add(base, mul(sd, w / 2)), 1], [...add(lerp(base, add(base, mul(inw, l)), 0.6), mul(sd, w * 0.25))], [...add(base, mul(inw, l)), 1], [...add(base, mul(sd, -w / 2)), 1]], { fill: r > 0.6 ? P.bone : mix(P.bone, P.boneD, 0.4), shadow: P.boneS, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
    f.flat([add(base, mul(sd, w * 0.4)), add(base, mul(sd, -w * 0.4)), lerp(base, add(base, mul(inw, l)), 0.35)], P.mouldD, { op: 0.5 }); } } // mould stains at the roots
  const thO = []; for (let k = 0; k < 14; k++) { const t = Math.PI * 2 * k / 14, rr = k % 2 ? 0.5 : 1; thO.push([Math.cos(t) * rx * 0.22 * rr, Math.sin(t) * ry * 0.26 * rr]); }
  f.flat(D(thr, thO), '#0e0b0b');
  for (let k = 0; k < 7; k++) { const t = Math.PI * 2 * k / 7; f.line(D(thr, [[Math.cos(t) * rx * 0.12, Math.sin(t) * ry * 0.16], [Math.cos(t) * rx * 0.32, Math.sin(t) * ry * 0.4]]), 1.4, '#2a2024', { op: 0.7 }); }
  f.line(D(mc, rim.slice(13, 22).map(q => [q[0] * 0.96, q[1] * 0.96])), 1.6, '#e8e4d4', { op: 0.5 });
  FX.rime(outline(hU, T - 10, 1.0, false).slice(0, 10), 10, 1);
  FX.icicles(D(mc, rim.slice(4, 9).map(q => [q[0] * 1.02, q[1] * 1.02])), 4, 14, 4);
  { const a = D(mc, [[-rx * 0.2, ry * 0.9]])[0]; const pts = [[...add(a, [-14, -4]), 1], [...add(a, [14, -2]), 1], add(a, [16, 50]), [...add(a, [12, 104]), 1], add(a, [0, 80]), [...add(a, [-8, 116]), 1], add(a, [-14, 60])]; const d = f.part(pts, { fill: P.linen, shadow: P.linenD, tex: 'weave' + seed, texOp: 0.6, maxShade: 7, inkW: 1.1, inkHeavy: 1.5 }); X.stains(f, d, [a[0] - 60, a[1] - 10, a[0] + 60, a[1] + 130], P.mouldD, 0.07, 3, -1.6, 47, 0.7); } // a strip of shroud trailing from the maw
  X.spores(f, add(mc, [60, 40]), 50, 40, 10, 1.2);

  f.bone('root');
  f.flat(ell([320, gy + 2], 300, 9, 0, 20), P.frostD, { op: 0.5 });
  return f;
}

// ------------------------------------------------------------------ ROT WITCH (elite 1.8)
// The court's embalmer, still at her work: she keeps the barrow's dead from rotting, and their plague from dying.
// A gaunt woman bent double at the hips and the upper back over a broad bowl of embalming salts, the bowl cradled on the
// far palm, the near hand pinching salts into it; the cold pours off the salts and sinks over the rim. Grey grave-linen
// wrappings under a long gown and an embalmer's apron; a linen hood, sharp eyes, mould growing at the hairline.
// Remnant of the trade: the embalmer's kit (apron, bone needle and thread, linen roll, shears). The one mark pushed hard
// is toxin's, as the bible gives it: her hands stained mould-green to the wrist from the salts and the plague.
// Rig: standard humanoid + bowl (parent hand_f) + skirt + hood (parent head) + apron + herbs. Motion: idle stirring the
// bowl (near forearm and hand); attack a hurled handful of plague salts (near arm flung forward).
function rotWitch() {
  const [CW, CH] = TIERS.elite, seed = 902;
  const f = new Fig(X.base(seed, CH, { grimeY: 1140 }));
  X.textures(f); const FX = X.fx(f);
  const H = 180, gy = f.o.groundY;
  const gown = '#5e5d54', gownD = '#3e3d36', wrap = '#8e8c80', hoodC = '#7a786c', apronC = '#4a4840';
  const GOWN = (o = {}) => Object.assign({ fill: gown, shadow: '#2a2a24', tex: 'weave' + seed, texOp: 0.5, maxShade: 40 }, o);
  const WRAP = (o = {}) => Object.assign({ fill: wrap, shadow: '#4a4a42', tex: 'weave' + seed, texOp: 0.5, maxShade: 18 }, o);
  const green = mix(P.mould, '#5f7a52', 0.35), greenD = mix(P.mouldD, '#2e3a28', 0.3);
  const HAND = (o = {}) => Object.assign({ fill: green, shadow: greenD, shade: 0.34, tex: 'mottle' + seed, texOp: 0.6 }, o);
  const N = [756, 566], C = [560, 520], Pv = [480, 840];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.28, 0.14), SF = S.at(0.38, 0.12);
  const bowlC = [900, 850];                                     // the bowl, below her face
  const EF = [742, 800], WF = [806, 912];                       // far forearm down under the bowl, palm up
  const EN = [716, 746], WN = [826, 776];                       // near forearm over the rim, the hand pinching salts
  const HN = S.at(-0.3, 1.0), KN = [440, 1110], AN = [400, 1330];
  const HF = S.at(0.3, 1.0), KF = [560, 1100], AF = [560, 1330];
  const neck0 = S.at(0.2, -0.04), HC = [858, 610], hA = 0.95;
  const WB = S.at(0, 0.82), dW = S.T(0.82);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('bowl', WF, 'hand_f').joint('skirt', WB, 'pelvis').joint('hood', add(HC, [-60, -30]), 'head').joint('apron', S.at(0.5, 0.82), 'torso').joint('herbs', S.at(-0.3, 0.86), 'pelvis');

  // ---- legs under the gown (whole, for the rig), wrapped feet showing at the hem
  for (const [sfx, Hp, Kn, A] of [['_f', HF, KF, AF], ['_n', HN, KN, AN]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 110, 84, { steps: 8 }), WRAP());
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.95), 84, 60, { steps: 8 }), WRAP());
    X.wraps(f, Kn, A, 84, 60, 8, wrap, { stain: 0.4 });
    const da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => { B.boot(f, A, 1, 84, mix(wrap, P.linenD, 0.4), { shaft: 0.5, toe: 1.1, tex: 'weave' + seed }); for (let i = 0; i < 4; i++) f.line([add(A, [-24 + i * 22, 6]), add(A, [-14 + i * 22, 50])], 1.4, '#3a3a32', { op: 0.6 }); FX.frost(add(A, [30, 30]), 50, 10, 8); }, [['shin' + sfx, side(A, mul(da, -1), 24)], ['foot' + sfx, side(A, da, 24)]]);
  }

  // ---- far arm down under the bowl (behind the torso): wrapped, the sleeve pushed up, the forearm green to the elbow
  const [cUF, cFF] = jcut(SF, EF, WF, 30);
  split(f, () => {
    f.part(X.jointLimb(SF, EF, lerp(EF, WF, 0.95), [66, 54, 44], { point: 0.3, mus0: 0.12, mus1: 0.2 }), WRAP());
    f.part(X.jointLimb(lerp(SF, EF, 0.8), EF, lerp(EF, WF, 0.96), [56, 54, 44], { point: 0.3, mus0: 0.1, mus1: 0.18 }), HAND({ maxShade: 14 }));
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('forearm_f');
  for (let i = 0; i < 4; i++) X.crease(f, [lp(EF, WF, 0.2 + i * 0.18, -20), lp(EF, WF, 0.24 + i * 0.18, 0), lp(EF, WF, 0.2 + i * 0.18, 20)], 1.6, { col: greenD, lit: P.mouldL, op: 0.5 }); // tendons and the stain's tide marks
  f.bone('upperarm_f');
  f.part(K.ragLimb(f, add(SF, [-6, -10]), lerp(SF, EF, 0.74), 72, 64, { depth: 12, teeth: 6 }), GOWN({ fill: gownD }));
  f.bone('hand_f');
  // the palm up under the bowl, the long green fingers spread round its foot
  const hf = X.openHand(f, WF, -0.12, 150, { look: HAND({ maxShade: 8 }), back: false, flip: false, spread: 0.12, curl: 0.35, curls: [0.5, 0.4, 0.35, 0.3], swell: 0.05, prune: true });

  // ---- the bowl: turned ash, a thick rim, salts heaped in it; seen from her side, a sliver of the salt surface
  f.bone('bowl');
  const bw = 136, bd = 74;
  const bowl = [add(bowlC, [-bw, -6]), add(bowlC, [bw, -10]), add(bowlC, [bw - 14, 34]), add(bowlC, [bw * 0.5, bd - 4]), add(bowlC, [0, bd]), add(bowlC, [-bw * 0.5, bd - 2]), add(bowlC, [-bw + 14, 36])];
  const bD = f.part(bowl, { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.6, shade: 0.42, maxShade: 26 });
  X.stains(f, bD, [bowlC[0] - 150, bowlC[1] - 20, bowlC[0] + 150, bowlC[1] + 90], P.mouldD, 0.05, 3, -1.6, 51, 0.65);
  f.part([add(bowlC, [-52, bd - 6]), add(bowlC, [52, bd - 8]), add(bowlC, [44, bd + 12]), add(bowlC, [-44, bd + 14])], { fill: P.woodD, shade: 0.4, inkW: 1.2, cast: false }); // the foot ring
  f.line([add(bowlC, [-bw + 20, 30]), add(bowlC, [0, bd - 10]), add(bowlC, [bw - 20, 26])], 1.2, P.woodL, { op: 0.5 }); // a turning line
  f.line([add(bowlC, [60, 4]), add(bowlC, [76, 30]), add(bowlC, [70, 50])], 1.6, INK, { op: 0.8 }); // a split, bound with a strip of linen
  f.part([add(bowlC, [52, 18]), add(bowlC, [88, 14]), add(bowlC, [90, 30]), add(bowlC, [54, 34])], WRAP({ inkW: 1, cast: false }));
  // the rim and the heaped grey salts, crystalline and dull, a pinch-hollow where she has been taking from it
  f.part(ell(add(bowlC, [0, -8]), bw, 16, -0.03, 24), { fill: P.woodL, shadow: P.wood, shade: 0.3, inkW: 1.4, cast: false });
  const salt = [add(bowlC, [-bw + 10, -8]), add(bowlC, [-60, -30]), add(bowlC, [-10, -40]), add(bowlC, [40, -34]), add(bowlC, [90, -24]), add(bowlC, [bw - 10, -12]), add(bowlC, [0, -2])];
  f.part(salt, { fill: '#b8bcb0', shadow: '#6e7268', shade: 0.35, tex: 'hoar' + seed, texOp: 0.9, inkW: 1.1, cast: false, hatch: false });
  for (let i = 0; i < 26; i++) { const q = add(bowlC, [(f.r() - 0.5) * bw * 1.6, -14 - f.r() * 22]); f.flat([q, add(q, [3, -2]), add(q, [4, 2])], f.r() > 0.5 ? P.hoar : '#7e8278', { op: 0.85 }); }
  f.flat(ell(add(bowlC, [-20, -26]), 18, 6, 0, 10), '#6e7268', { op: 0.7 });
  X.mould(f, add(bowlC, [40, -24]), 12, 5, { rings: 1, col: mix(P.mould, '#b8bcb0', 0.3) });
  // the cold pours off the salts, over the rim, and sinks down the bowl's side
  for (const [x0, l, w] of [[-bw + 6, 150, 26], [bw - 10, 120, 22], [-40, 60, 18]]) { const p0 = add(bowlC, [x0, -10]), dir = x0 < 0 ? -1 : 1, pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(add(p0, [dir * (Math.sin(t * 2.4) * 18 + t * 30), t * l])); } f.stroke(pts, w, '#d6ddd4', { op: 0.22 }); f.stroke(pts.map(q => add(q, [dir * 4, 0])), w * 0.4, '#eef2ec', { op: 0.2 }); } // the cold sinking over the rim in slow falls
  FX.icicles([add(bowlC, [-bw + 14, 30]), add(bowlC, [-40, bd]), add(bowlC, [60, bd - 4]), add(bowlC, [bw - 14, 30])], 5, 22, 6);

  // ---- the gown's skirt, from the belt to the floor, falling straight from the bent hips; ragged, wet, stiff
  f.bone('skirt');
  const hem = []; { let x = 660; const dep = [6, 26, 10, 34, 4, 18, 30, 8, 22, 2, 28, 14, 20]; let i = 0; while (x > 300) { hem.push([x, 1330 + dep[i % dep.length] + (f.r() - 0.5) * 8, dep[i % dep.length] > 14 ? 1 : 0]); x -= 18 + f.r() * 28; i++; } }
  const sk = [S.at(-0.66, 0.66), S.at(0.6, 0.62), [632, 980], [650, 1180], ...hem.filter(q => q[0] > 340), [350, 1300], [370, 1100], [384, 960]];
  const skD = f.part(sk, GOWN());
  X.stains(f, skD, [280, 760, 700, 1380], '#1e1e18', 0.02, 2.6, -1.4, 3, 0.6);
  X.stains(f, skD, [280, 1100, 700, 1380], P.mouldD, 0.015, 3.2, -1.7, 7, 0.6, 2);
  for (const q of [[[420, 900], [412, 1080], [410, 1310]], [[470, 920], [470, 1100], [466, 1330]], [[560, 920], [580, 1120], [590, 1320]], [[620, 960], [640, 1140], [650, 1300]], [[400, 1010], [396, 1170], [392, 1300]]]) f.stroke(q, 3, '#16160f');
  for (const [x, y, w] of [[420, 1180, 36], [560, 1040, 30]]) { f.part([[x, y, 1], [x + w, y - 2, 1], [x + w + 2, y + w * 1.2, 1], [x + 2, y + w * 1.2, 1]], GOWN({ fill: mix(gown, P.linen, 0.25), inkW: 1.1 })); f.stitches([[x, y], [x + w, y - 2], [x + w + 2, y + w * 1.2], [x + 2, y + w * 1.2], [x, y]], P.linenL, 0.9); }
  FX.icicles(hem.map(q => [q[0], q[1] - 2]), 7, 26, 6);
  X.fungalFur(f, hem.slice(1, 9).map(q => [q[0], q[1] - 3]), 8, -1);
  X.mould(f, [360, 1300], 22, 12); X.mould(f, [610, 1290], 16, 10, { rings: 1 });

  // ---- torso: the gown body over grey wrappings, the spine standing out along the bent back
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.26, 0.32], [0.04, 0.54, 0.44], [0.18, 0.64, 0.54], [0.36, 0.62, 0.56], [0.56, 0.54, 0.52], [0.74, 0.52, 0.5], [0.9, 0.58, 0.54]]);
  const tD = f.part(torso, GOWN());
  X.stains(f, tD, [340, 440, 820, 880], '#1e1e18', 0.025, 2.4, -1.3, 13, 0.55);
  for (let i = 0; i < 9; i++) { const q = S.at(-0.72, 0.1 + i * 0.075); f.part(ell(q, 9, 7, 0, 10), GOWN({ maxShade: 4, cast: false, inkW: 1, inkHeavy: 1.2, fill: mix(gown, '#fff', 0.06) })); } // the knuckles of her spine through the cloth
  for (const [u0, v0, u1, v1] of [[0.3, 0.2, 0.5, 0.6], [-0.2, 0.3, -0.1, 0.7], [0.0, 0.15, 0.2, 0.4]]) f.stroke([S.at(u0, v0), S.at((u0 + u1) / 2 + 0.08, (v0 + v1) / 2), S.at(u1, v1)], 2.6, '#16160f');
  FX.rime([S.at(-0.3, 0.0), S.at(-0.7, 0.14), S.at(-0.76, 0.5), S.at(-0.72, 0.8)], 11, 1);
  // wrappings showing at the neck and through a tear
  f.part([S.at(0.2, 0.3), S.at(0.5, 0.28), S.at(0.54, 0.44), S.at(0.24, 0.46)], WRAP({ inkW: 1.2 })); X.wraps(f, S.at(0.37, 0.28), S.at(0.37, 0.46), 50, 50, 3, wrap);
  // the bone needle stuck through the gown at the breast, its thread trailing to a spool on the belt
  { const n0 = S.at(0.56, 0.2), n1 = add(n0, [-40, -26]); f.part(limb(n0, n1, 5, 3, { steps: 4, capK: 1.6 }), { fill: P.bone, shadow: P.boneS, shade: 0.3, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(ell(lerp(n0, n1, 0.85), 1.6, 1, ang(n0, n1), 6), '#000'); f.line([lerp(n0, n1, 0.85), add(n1, [10, 20]), S.at(0.5, 0.5), S.at(0.3, 0.84)], 1, P.linenL, { op: 0.85 }); }

  // ---- the apron: an embalmer's leather bib apron, stiff, stained with salts and green
  f.bone('apron');
  const ap = [S.at(0.36, 0.3), S.at(0.62, 0.28), S.at(0.66, 0.6), [700, 960], [720, 1120], [690, 1180, 1], [660, 1150], [630, 1190, 1], [600, 1150], [590, 1000], S.at(0.3, 0.86)];
  const apD = f.part(ap, { fill: apronC, shadow: '#1e1d18', tex: 'mottle' + seed, texOp: 0.6, maxShade: 20 });
  X.stains(f, apD, [580, 560, 760, 1200], green, 0.012, 3, -1.5, 61, 0.45, 2);
  for (let i = 0; i < 4; i++) f.stroke([[612 + i * 22, 700 + i * 60], [620 + i * 22, 760 + i * 60], [616 + i * 22, 800 + i * 60]], 3, '#a8ab9e', { op: 0.5 }); // salt runs dried on the leather
  f.stroke([S.at(0.5, 0.4), [660, 900], [670, 1100]], 2.4, '#141410');
  f.line([S.at(0.36, 0.3), S.at(0.3, 0.12), S.at(0.2, 0.02)], 3.4, P.leatherD); // the neck strap

  // ---- the belt: a cord with herb bundles, a linen roll, shears and a stoppered jar hung from it
  f.bone('torso');
  X.rope(f, [S.at(-0.7, 0.8), S.at(-0.2, 0.84), S.at(0.3, 0.84), S.at(0.66, 0.8)], 7, P.linenD);
  { const q = S.at(0.06, 0.86); f.part(ell(add(q, [0, 34]), 24, 30, 0.2, 14), WRAP({ fill: P.linenL })); for (let i = 0; i < 3; i++) f.line(ell(add(q, [0, 34]), 8 + i * 6, 10 + i * 7, 0.2, 12).slice(0, 7), 1, '#4a4a42', { op: 0.7 }); f.line([q, add(q, [0, 6])], 2, P.linenD); } // a roll of linen strips
  { const q = S.at(0.24, 0.88); f.line([q, add(q, [2, 20])], 1.6, P.leatherD); f.part([add(q, [-12, 20]), add(q, [12, 20]), add(q, [14, 58]), add(q, [-14, 58])], { fill: '#5a5e56', shadow: '#2a2e2a', shade: 0.3, inkW: 1.2, cast: false }); f.part([add(q, [-8, 14]), add(q, [8, 14]), add(q, [8, 22]), add(q, [-8, 22])], { fill: P.wood, shade: 0.3, inkW: 1, cast: false }); f.flat([add(q, [-10, 40]), add(q, [10, 40]), add(q, [12, 56]), add(q, [-12, 56])], green, { op: 0.6 }); } // a stoppered jar of the green
  f.bone('herbs');
  for (const [u, l] of [[-0.5, 90], [-0.32, 110], [-0.62, 70]]) { const q = S.at(u, 0.84); f.line([q, add(q, [0, 14])], 1.4, P.linenD); for (let i = -3; i <= 3; i++) f.line([add(q, [i * 2, 14]), add(q, [i * 5, l])], 2, i % 2 ? '#4e5a40' : P.boneD); f.part(ell(add(q, [0, 22]), 10, 5, 0, 8), { fill: P.linenD, shade: 0.3, inkW: 1, cast: false }); for (let i = 0; i < 5; i++) f.flat(ell(add(q, [(f.r() - 0.5) * 24, l - f.r() * 14]), 3, 2, f.r() * 3, 6), f.r() > 0.5 ? P.mouldY : P.boneD, { op: 0.9 }); FX.frost(add(q, [0, l - 10]), 12, 8, 3, 1); }
  { const q = S.at(-0.14, 0.88); f.line([q, add(q, [0, 18])], 1.4, P.leatherD); const a = add(q, [0, 18]); f.part([a, add(a, [8, 4]), add(a, [4, 70]), add(a, [0, 72])], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1, cast: false }); f.part([a, add(a, [-8, 4]), add(a, [-2, 66]), add(a, [0, 70])], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1, cast: false }); f.line(ell(add(a, [-6, -6]), 7, 7, 0, 10).concat([ell(add(a, [-6, -6]), 7, 7, 0, 10)[0]]), 2.2, P.iron); f.line(ell(add(a, [6, -6]), 7, 7, 0, 10).concat([ell(add(a, [6, -6]), 7, 7, 0, 10)[0]]), 2.2, P.iron); f.flat(ell(add(a, [2, 30]), 3, 8, 0, 6), P.rust, { op: 0.7 }); } // shears

  // ---- head bowed over the bowl: gaunt, sharp-eyed, grey hair under a hood of grave linen, mould at the hairline
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-6, 10]), hF([[-0.1, 0.4]])[0]], [74, 58]), X.SK(f, { maxShade: 12 }));
  for (let i = 0; i < 2; i++) X.crease(f, [add(neck0, [10 + i * 14, -6 + i * 10]), lerp(neck0, hF([[0.0 + i * 0.08, 0.42]])[0], 0.5), hF([[0.0 + i * 0.08, 0.42]])[0]], 2.6, { col: '#1e1c1a', lit: P.skinL }); // the cords of her neck
  B.head(f, HC, H, hA, {
    skin: mix(P.skin, '#a8a294', 0.4), jaw: 0.94, chin: 0.03, nose: 1.14, hook: 0.55, mouth: 'set', squint: 0.55, browDown: 0.07, faceShade: 0.78, jawShade: 0.3, gaunt: true, age: true, lashes: true,
    iris: '#2e322c', eyeWhite: '#b8b8a8', hairCol: '#8a887c', browCol: '#4a4a42', faceHatch: false, noEar: true,
    hair: [[-0.4, 0.06], [-0.44, -0.2], [-0.32, -0.42], [-0.08, -0.54], [0.16, -0.5], [0.26, -0.42], [0.12, -0.4], [-0.04, -0.44], [-0.16, -0.34], [-0.24, -0.16], [-0.3, 0.08]],
    hairLines: [[[-0.32, -0.36], [-0.1, -0.48], [0.12, -0.46]], [[-0.38, -0.14], [-0.22, -0.34], [0.0, -0.42]]],
  });
  X.greyFace(f, hF, mix(P.skin, '#a8a294', 0.4), 1.14, { noEar: true });
  f.line(hF([[0.06, 0.22], [0.12, 0.34], [0.17, 0.4]]), 1.2, INK, { op: 0.6 }); f.line(hF([[0.24, -0.2], [0.28, -0.14]]), 1, INK, { op: 0.5 }); // nasolabial line, a frown cut
  X.mould(f, hF([[-0.04, -0.4]])[0], 16, 9, { rings: 2 }); X.mould(f, hF([[0.14, -0.44]])[0], 11, 7, { rings: 1 }); // mould at the hairline
  X.fungalFur(f, hF([[-0.2, -0.46], [0.0, -0.5], [0.2, -0.46]]), 6, 1);
  X.sore(f, hF([[0.06, 0.08]])[0], 6, { ang: hA });
  f.bone('hood');
  const hood = hF([[-0.66, 0.6], [-0.7, 0.0], [-0.56, -0.48], [-0.22, -0.74], [0.16, -0.74], [0.38, -0.56], [0.44, -0.4], [0.3, -0.48], [0.1, -0.56], [-0.16, -0.5], [-0.32, -0.2], [-0.36, 0.2], [-0.24, 0.6]]);
  const hdD = f.part(hood, { fill: hoodC, shadow: '#34342c', tex: 'weave' + seed, texOp: 0.6, maxShade: 24 });
  X.stains(f, hdD, [700, 440, 960, 760], P.mouldD, 0.045, 3, -1.7, 71, 0.6);
  f.flat(hF([[0.44, -0.4], [0.3, -0.48], [0.1, -0.56], [-0.16, -0.5], [-0.1, -0.42], [0.1, -0.46], [0.3, -0.36]]), '#141410', { op: 0.55 });
  for (const q of [[[-0.5, -0.3], [-0.56, 0.1], [-0.5, 0.5]], [[-0.2, -0.64], [-0.4, -0.3], [-0.42, 0.1]]]) f.stroke(hF(q), 2.6, '#1a1a14');
  // the hood's torn tail hanging plumb from the back of the head, stiff with rime
  { const t0 = hF([[-0.6, 0.4]])[0]; f.part([t0, add(t0, [40, 6]), add(t0, [34, 120]), [...add(t0, [22, 170]), 1], add(t0, [10, 120]), [...add(t0, [-4, 150]), 1], add(t0, [-10, 60])], { fill: hoodC, shadow: '#34342c', tex: 'weave' + seed, texOp: 0.6, maxShade: 10 }); FX.icicles([add(t0, [22, 170]), add(t0, [-4, 150])], 2, 20, 5); }
  FX.rime(hF([[-0.66, -0.2], [-0.5, -0.56], [-0.2, -0.74], [0.16, -0.74]]), 12, 1);

  // ---- near arm over the rim: the sleeve pushed back, the forearm green to the elbow, long fingers pinching salts
  const [cUN, cFN] = jcut(SN, EN, WN, 30);
  split(f, () => {
    f.part(X.jointLimb(SN, EN, lerp(EN, WN, 0.95), [70, 56, 44], { point: 0.35, mus0: 0.12, mus1: 0.2 }), WRAP());
    f.part(X.jointLimb(lerp(SN, EN, 0.82), EN, lerp(EN, WN, 0.96), [58, 56, 44], { point: 0.35, mus0: 0.1, mus1: 0.22 }), HAND({ maxShade: 14 }));
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('forearm_n');
  for (let i = 0; i < 3; i++) X.crease(f, [lp(EN, WN, 0.25 + i * 0.2, -22), lp(EN, WN, 0.3 + i * 0.2, 0), lp(EN, WN, 0.25 + i * 0.2, 22)], 1.6, { col: greenD, lit: P.mouldL, op: 0.5 });
  f.line([lp(EN, WN, 0.1, 6), lp(EN, WN, 0.9, 4)], 2, greenD, { op: 0.6 }); // a tendon standing out
  X.mould(f, lp(EN, WN, 0.4, -10), 12, 8, { rings: 1 });
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [-4, -8]), lerp(SN, EN, 0.72), 68, 60, { depth: 12, teeth: 6, p: [[0.35, 0.12, 0.2]], q: [[0.6, 0.1, 0.2]] }), GOWN());
  f.stroke([lp(SN, EN, 0.15, 24), lp(SN, EN, 0.4, 30), lp(SN, EN, 0.62, 20)], 2.4, '#16160f'); f.stroke([lp(SN, EN, 0.3, -20), lp(SN, EN, 0.5, -26)], 2, '#16160f');
  f.part(ell(lerp(SN, EN, 0.72), 38, 14, ang(SN, EN) + Math.PI / 2, 14), GOWN({ fill: gownD, maxShade: 8 })); // the bunched sleeve roll
  f.bone('hand_n');
  const hn = X.openHand(f, WN, ang(EN, WN) + 0.75, 150, { look: HAND({ maxShade: 8 }), back: true, flip: true, spread: 0.1, curl: 0.5, curls: [0.75, 0.7, 0.5, 0.3], swell: 0.05, nail: '#3e4a36' });
  X.fistDetail; for (let i = 0; i < 6; i++) { const q = add(hn.fing[3].k3, [(f.r() - 0.5) * 14, 8 + f.r() * 40]); f.flat([q, add(q, [3, -2]), add(q, [4, 2])], P.hoar, { op: 0.9 }); } // salts trickling from the pinch into the bowl
  return f;
}

// ------------------------------------------------------------------ BARROW THANE (elite 2.0)
// A lord of the king's court, buried with his household; he still keeps them in line. Upright and commanding, feet wide,
// the near fist planted on his hip; the far arm thrust forward and up with the flail raised, three chains of frozen
// weights hanging plumb from its head. Rusted lamellar over mail, a fur mantle stiff with frost hanging to the calf,
// a spangenhelm with a mail face-curtain; above the curtain the face is mould round frost-packed sockets.
// Remnant of rank: the silver mantle brooch, arm rings, a lord's belt and drinking horn. The one mark pushed hard is the
// bible's mould on the face: the face above the curtain is eaten to mould round frost-packed sockets. Frost holds the
// bared flail arm stilled mid-command, rimed along its back; toxin swells a gland in the armpit.
// Rig: standard humanoid + flail (parent hand_f) + chain_1..3 (parent flail) + cape + skirt (lamellar skirt).
// Motion: idle a slow scan (head, torso); attack a flail blow (far arm drops, chains swing through).
function barrowThane() {
  const [CW, CH] = TIERS.elite, seed = 901;
  const f = new Fig(X.base(seed, CH, { grimeY: 1140 }));
  X.textures(f); const FX = X.fx(f);
  const H = 200, gy = f.o.groundY;
  const LAM = (o = {}) => Object.assign({ fill: mix(P.iron, P.rust, 0.42), shadow: '#1e1a16', tex: 'lamellar' + seed, texOp: 0.85, shade: 0.42, maxShade: 40 }, o);
  const MAIL = (o = {}) => Object.assign({ fill: '#5b5f58', shadow: '#262826', tex: 'mail' + seed, texOp: 0.85, shade: 0.4, maxShade: 30 }, o);
  const FUR = (o = {}) => Object.assign({ fill: P.fur, shadow: '#2e2c26', tex: 'fur' + seed, texOp: 0.9, shade: 0.4, maxShade: 40 }, o);
  const WOOL = (o = {}) => Object.assign({ fill: P.wool, shadow: '#24251f', tex: 'weave' + seed, texOp: 0.5, maxShade: 30 }, o);
  const N = [468, 304], C = [446, 520], Pv = [430, 760];     // the upper body leans into the raised arm
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.14), SF = S.at(0.42, 0.1);
  const EF = [670, 402], WF = [740, 212];                      // far arm cocked: the elbow dropped and forward, the fist raised over it, the flail drawn back to strike
  const EN = [292, 486], WN = [392, 628];                      // near fist on the hip, elbow out behind
  const HN = S.at(-0.22, 1.0), KN = [352, 1046], AN = [306, 1290];
  const HF = S.at(0.3, 1.0), KF = [566, 1036], AF = [606, 1290];
  const neck0 = S.at(0.12, -0.04), HC = [496, 200], hA = 0.02;
  const fA = deg(-12), fTip = add(WF, rot([200, 0], fA)), fButt = add(WF, rot([-48, 0], fA));
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('flail', WF, 'hand_f').joint('cape', S.at(-0.3, 0.0), 'torso').joint('skirt', S.at(0, 0.9), 'pelvis');
  ['chain_1', 'chain_2', 'chain_3'].forEach(c => f.joint(c, fTip, 'flail'));

  // ---- the fur mantle's back half, hanging behind everything to the calf, frozen stiff, the hem torn
  f.bone('cape');
  const hemC = []; { let x = 170; const dep = [10, 40, 16, 56, 6, 30, 48, 12, 36]; let i = 0; while (x < 470) { hemC.push([x, 1140 + dep[i % dep.length] + (f.r() - 0.5) * 10, dep[i % dep.length] > 20 ? 1 : 0]); x += 22 + f.r() * 26; i++; } }
  const capeB = [S.at(-0.2, -0.08), S.at(-0.7, 0.04), S.at(-0.98, 0.3), [196, 760], [176, 1000], ...hemC, [470, 1120], [460, 900], S.at(-0.1, 0.5)];
  const cbD = f.part(capeB, FUR({ fill: mix(P.fur, P.furD, 0.35) }));
  X.stains(f, cbD, [150, 280, 520, 1220], P.mouldD, 0.02, 3, -1.6, 3, 0.6, 2);
  for (let i = 0; i < 9; i++) { const x0 = 190 + i * 30, y0 = 420 + (i % 3) * 60; X.hairClump(f, [[x0, y0], [x0 - 6, y0 + 200], [x0 - 2, y0 + 420], [x0 + 4, 1110 + (i % 2) * 30]], 22, { pal: [P.furD, P.fur, mix(P.fur, P.frost, 0.3)], gap: true, n: 4 }); } // the fur lies in long matted locks
  FX.icicles(hemC.map(q => [q[0], q[1] - 3]), 9, 40, 9);
  FX.rime([S.at(-0.6, 0.0), S.at(-0.98, 0.28), [192, 760], [176, 1000]], 14, -1);

  // ---- far arm: the overlong bare arm, sinew and veins under grey skin; arm rings; the flail held up
  const [cUF, cFF] = jcut(SF, EF, WF, 34);
  split(f, () => {
    f.part(X.jointLimb(SF, EF, lerp(EF, WF, 0.94), [96, 72, 54], { point: 0.45, mus0: 0.12, mus1: 0.3 }), X.SK(f, { maxShade: 18, fill: mix(P.skin, P.skinD, 0.15) }));
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('upperarm_f');
  for (let i = 0; i < 3; i++) X.crease(f, [lp(SF, EF, 0.15 + i * 0.25, -30), lp(SF, EF, 0.25 + i * 0.25, -6), lp(SF, EF, 0.2 + i * 0.25, 26)], 2.4, { col: '#1e1c1a', lit: P.skinL, op: 0.55 });
  X.bubo(f, lp(SF, EF, 0.12, 30), 22, { sag: 0.5 }); // a bubo swollen in the armpit under the frost
  X.veins(f, lerp(SF, EF, 0.5), 30, 20, 5, 1.6);
  f.bone('forearm_f');
  for (const o of [-16, 0, 16]) f.line([lp(EF, WF, 0.08, o), lp(EF, WF, 0.5, o * 0.8 + 3), lp(EF, WF, 0.9, o * 0.5)], 2.6, '#3a3834', { op: 0.55 }); // the tendons standing in the forearm
  f.line([lp(EF, WF, 0.1, -26), lp(EF, WF, 0.3, -20), lp(EF, WF, 0.5, -24), lp(EF, WF, 0.8, -18)], 3.4, '#4a4e4c', { op: 0.6 }); // a swollen vein
  for (const t of [0.62, 0.72]) { f.part(plate(EF, WF, t, t + 0.06, 62, 58), { fill: P.silver, shadow: P.silverD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4 }); for (let i = 0; i < 4; i++) f.line([lp(EF, WF, t + 0.01, -26 + i * 2), lp(EF, WF, t + 0.05, 26 - i * 2)], 1.1, INK, { op: 0.6 }); } // twisted silver arm rings
  X.sore(f, lp(EF, WF, 0.35, 18), 9); X.mould(f, lp(EF, WF, 0.25, -18), 14, 10, { rings: 1 });
  FX.rime([lp(EF, WF, 0.0, -36), lp(EF, WF, 0.5, -30), lp(EF, WF, 0.9, -24)], 7, -1, { wind: [-0.3, -1] });
  // the flail: an ash haft bound in iron, the chains and frozen weights hanging plumb from its head
  f.bone('flail');
  f.part(limb(fButt, fTip, 26, 24, { steps: 8 }), { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.7, maxShade: 8 });
  for (const t of [0.04, 0.82, 0.92]) f.part(plate(fButt, fTip, t, t + 0.05, 32, 32), { fill: P.iron, shadow: P.ironD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  f.part(ell(fTip, 16, 14, fA, 12), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.4 });
  f.rivet(fTip, 4, P.ironL);
  FX.rime([lp(fButt, fTip, 0.3, -14), lp(fButt, fTip, 0.75, -14)], 6, -1);
  const weight = (c, r, k) => { // an iron weight clotted in ice: a lumpy ball, the ice built up on its top, studs, a hanging icicle
    const pts = ell(c, r, r * 0.92, 0, 12).map((q, i) => add(q, [(f.r() - 0.5) * r * 0.2, (f.r() - 0.5) * r * 0.2]));
    f.part(pts, { fill: P.iron, shadow: P.ironD, shade: 0.45, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.6, maxShade: 12 });
    f.line([add(c, [-r * 0.6, r * 0.1]), add(c, [r * 0.6, r * 0.2])], 1.6, P.ironD, { op: 0.7 }); // the casting seam
    f.part([add(c, [-r * 0.9, -r * 0.2]), add(c, [-r * 0.5, -r * 0.9]), add(c, [r * 0.3, -r * 1.05]), add(c, [r * 0.9, -r * 0.4]), add(c, [r * 0.5, -r * 0.3]), add(c, [-r * 0.4, -r * 0.4])], FX.IC({ inkW: 1, inkHeavy: 1.3 }));
    f.flat(ell(add(c, [-r * 0.2, r * 0.2]), r * 0.35, r * 0.25, 0.5, 8), P.rust, { op: 0.55 });
    FX.icicle(add(c, [r * 0.1, r * 0.8]), r * (0.6 + k * 0.2), r * 0.24);
  };
  [[0, -16, 196, 30], [1, 10, 250, 36], [2, 30, 168, 26]].forEach(([k, dx, L, r]) => {
    f.bone('chain_' + (k + 1));
    const end = add(fTip, [dx, L]);
    X.ironChain(f, [fTip, add(fTip, [dx * 0.6, L * 0.5]), end], 22, 6, P.iron, { phase: k % 2 });
    weight(add(end, [0, r * 0.8]), r, k);
  });
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, fA, 34, mix(P.skin, P.skinD, 0.15), { shadow: P.skinS, tex: 'mottle' + seed, texOp: 0.5, name: 'thane flail' });
  X.fistDetail(f, gF, 34, P.skin, { nail: '#4a4844' });

  // ---- legs: wool trousers, wrapped shins, iron-shod boots; far leg forward, the weight on the back leg
  const leg = (Hp, Kn, A, sfx, look) => {
    const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
    split(f, () => f.part(X.jointLimb(Hp, Kn, lerp(Kn, A, 0.92), [150, 104, 76], { point: 0.3, mus0: 0.1, mus1: 0.2 }), look), [['thigh' + sfx, side(Kn, mul(de, -1), 50)], ['shin' + sfx, side(Kn, de, 50)]]);
    f.bone('thigh' + sfx);
    f.stroke([lp(Hp, Kn, 0.55, 40), lp(Hp, Kn, 0.72, 10), lp(Hp, Kn, 0.84, -30)], 3, '#1a1a16');
    f.bone('shin' + sfx);
    const a = lerp(Kn, A, 0.12), b = lerp(Kn, A, 0.86);
    f.part(K.chain([a, lerp(a, b, 0.45), b], [96, 90, 72]), { fill: P.linenD, shadow: '#2e2e28', tex: 'weave' + seed, texOp: 0.6, inkW: 1.4, cast: false, maxShade: 14 });
    X.wraps(f, a, b, 96, 72, 8, P.linenD, { stain: 0.5 });
    f.line([lp(a, b, 0.05, -44), lp(a, b, 0.4, 44), lp(a, b, 0.75, -40), lp(a, b, 0.98, 32)], 3.4, P.leatherD);
    split(f, () => B.boot(f, A, 1, 100, P.leather, { shaft: 0.7, tex: 'mottle' + seed, toe: 1.12, strap: true }), [['shin' + sfx, side(A, mul(da, -1), 34)], ['foot' + sfx, side(A, da, 34)]]);
    f.bone('foot' + sfx);
    FX.frost(add(A, [30, 60]), 70, 14, 12);
  };
  leg(HN, KN, AN, '_n', WOOL({ fill: mix(P.wool, P.furD, 0.3) }));
  leg(HF, KF, AF, '_f', WOOL());

  // ---- the lamellar skirt over the hips and the mail under it
  f.bone('skirt');
  const skP = [S.at(-0.72, 0.84), S.at(0.7, 0.84), [600, 900], [616, 980], [560, 990, 1], [540, 960], [498, 996, 1], [466, 968], [424, 1000, 1], [392, 970], [350, 996, 1], [320, 966], [300, 980, 1], [310, 900]];
  f.part(skP.map(q => add(q, [0, 18])), MAIL());
  // three lamellar flaps (front, side, back) hung from the belt, gaps between them showing the mail, each flaring and torn
  let skD = '';
  for (const [x0, x1, l] of [[300, 400, 220], [396, 500, 236], [494, 618, 214]]) { const fl = [[x0 + 6, 770], [x1 - 6, 772], [x1 + 8, 770 + l * 0.7], [x1 + 4, 770 + l, 1], [(x0 + x1) / 2 + 10, 770 + l - 18], [(x0 + x1) / 2 - 10, 770 + l + 6, 1], [x0 - 4, 770 + l - 10, 1], [x0 - 10, 770 + l * 0.6]]; skD = f.part(fl, LAM({ maxShade: 20 })); X.stains(f, skD, [x0 - 20, 760, x1 + 20, 1010], P.rust, 0.04, 3, -1.5, 13 + x0, 0.75); }
  for (let i = 0; i < 6; i++) { const x = 330 + i * 46; f.stroke([[x, 990], [x + 2, 1010], [x, 1030 + (i % 3) * 12]], 3, P.rust, { op: 0.6 }); } // rust run down from the plates
  FX.rime([S.at(-0.72, 0.86), [306, 900], [300, 980]], 8, 1);

  // ---- torso: mail shirt, the rusted lamellar cuirass laced over it, a lord's belt
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.4], [0.04, 0.8, 0.66], [0.2, 0.92, 0.94], [0.36, 0.86, 1.02], [0.52, 0.74, 0.9], [0.68, 0.6, 0.66], [0.8, 0.62, 0.64], [0.92, 0.7, 0.72]]);
  f.part(torso, MAIL());
  const cu = S.shape([[0.06, 0.72, 0.6], [0.2, 0.86, 0.88], [0.36, 0.8, 0.96], [0.52, 0.68, 0.84], [0.68, 0.56, 0.62], [0.8, 0.58, 0.62]]);
  const cuD = f.part(cu, LAM());
  X.stains(f, cuD, [280, 300, 640, 760], P.rust, 0.035, 3, -1.5, 17, 0.75); // rust blooming on the iron plates and in the laces
  X.stains(f, cuD, [280, 300, 640, 760], P.mouldD, 0.03, 3.4, -2.3, 19, 0.6);
  for (let i = 0; i < 5; i++) f.line([S.at(-0.6, 0.2 + i * 0.12), S.at(0.7, 0.18 + i * 0.12)], 2, '#1c140e', { op: 0.6 }); // the laced rows
  for (const [u, v] of [[0.3, 0.36], [-0.2, 0.5], [0.5, 0.62]]) { const q = S.at(u, v); f.flat([add(q, [-14, -10]), add(q, [12, -12]), add(q, [16, 10]), add(q, [-10, 14])], '#121010'); f.line([add(q, [-14, -10]), add(q, [12, -12])], 1.4, P.rustL, { op: 0.8 }); } // plates fallen out of the lacing
  FX.rime([S.at(-0.3, 0.06), S.at(-0.66, 0.2), S.at(-0.7, 0.5)], 10, 1);
  // belt with an iron buckle and a hanging strap end; a drinking horn on a thong (a lord's grave good)
  f.part([S.at(-0.62, 0.78), S.at(0.64, 0.77), S.at(0.66, 0.84), S.at(-0.64, 0.85)].map(q => [...q, 1]), { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4 });
  f.part([S.at(0.3, 0.76), S.at(0.44, 0.76), S.at(0.44, 0.86), S.at(0.3, 0.86)], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.3, sharp: true });
  f.stroke([S.at(0.46, 0.81), S.at(0.52, 0.92), S.at(0.48, 1.04)], 8, P.leatherD);
  for (let i = 0; i < 4; i++) f.rivet(S.at(-0.5 + i * 0.26, 0.81), 3, P.ironL);
  { const h0 = S.at(-0.36, 0.88), h1 = add(h0, [-70, 90]); f.line([S.at(-0.3, 0.86), h0], 2.4, P.leatherD); f.part(limb(h0, h1, 34, 10, { steps: 6, capK: 0.8, p: [[0.5, 0.15, 0.25]] }), { fill: P.bone, shadow: P.boneS, shade: 0.4, tex: 'mottle' + seed, texOp: 0.4, maxShade: 8 }); f.part(plate(h0, h1, -0.04, 0.08, 38, 36), { fill: P.silverD, shade: 0.4, inkW: 1.1 }); for (let i = 1; i < 4; i++) f.line([lp(h0, h1, i * 0.2, -14), lp(h0, h1, i * 0.2, 14)], 1, P.boneS, { op: 0.6 }); }

  // ---- the mantle's front: a thick fur collar over both shoulders, pinned at the breast with the silver brooch
  f.bone('cape');
  const collar = [S.at(-0.84, 0.04), S.at(-0.5, -0.12), S.at(0.0, -0.14), S.at(0.5, -0.06), S.at(0.74, 0.08), S.at(0.6, 0.24), S.at(0.3, 0.3), S.at(0.0, 0.26), S.at(-0.4, 0.3), S.at(-0.8, 0.26)];
  const colD = f.part(collar, FUR());
  for (let i = 0; i < 16; i++) { const u = -0.8 + i * 0.1, q = S.at(u, 0.0 + (i % 2) * 0.06), l = 50 + (i % 3) * 18; X.hairClump(f, [add(q, [0, -10]), add(q, [4, l * 0.5]), add(q, [-2, l])], 18, { pal: [P.furD, P.fur, mix(P.fur, P.frost, 0.35)], n: 3 }); }
  FX.rime([S.at(-0.84, 0.0), S.at(-0.4, -0.14), S.at(0.1, -0.16), S.at(0.6, -0.06)], 14, 1);
  FX.icicles([S.at(-0.8, 0.26), S.at(-0.4, 0.3), S.at(0.3, 0.3), S.at(0.6, 0.24)], 7, 30, 7);
  { const q = S.at(0.42, 0.22); f.part(ell(q, 26, 24, 0, 16), { fill: P.silver, shadow: P.silverD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.6 }); f.line(ell(q, 16, 15, 0, 14).concat([ell(q, 16, 15, 0, 14)[0]]), 2, P.silverD); for (let i = 0; i < 6; i++) f.line([add(q, rot([8, 0], i)), add(q, rot([20, 0], i + 0.3))], 1.2, INK, { op: 0.6 }); f.part([add(q, [-4, -40]), add(q, [4, -40]), add(q, [3, 38]), add(q, [-3, 38])], { fill: P.silverD, shade: 0.4, inkW: 1, cast: false }); f.flat(ell(add(q, [-6, 6]), 8, 5, 0, 8), P.mouldD, { op: 0.6 }); } // the silver brooch, tarnished

  // ---- head: the spangenhelm, a mail curtain over the face below the eyes; above it mould round frost-packed sockets
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [0, 20]), hF([[-0.06, 0.4]])[0]], [96, 84]), MAIL());
  B.head(f, HC, H, hA, { skin: mix(P.skin, P.skinD, 0.2), jaw: 1.18, chin: 0.02, nose: 1.1, hook: 0.2, mouth: 'set', blind: true, browDown: 0.08, faceShade: 0.8, jawShade: 0.5, gaunt: true, age: true, noEar: true });
  FX.socket(hF([[0.12, -0.06]])[0], H * 0.085, H * 0.055, hA);
  FX.socket(hF([[0.29, -0.065]])[0], H * 0.035, H * 0.048, hA);
  // the face eaten to mould above the curtain: a furred bloom over the cheek, brow and temple, spreading into the sockets
  X.mould(f, hF([[0.02, 0.06]])[0], 30, 20, { rings: 3 }); X.mould(f, hF([[0.2, -0.16]])[0], 20, 12, { rings: 2 }); X.mould(f, hF([[-0.18, -0.06]])[0], 22, 22, { rings: 2 });
  X.graveCaps(f, hF([[-0.1, 0.02]])[0], deg(-160), 34, 3);
  X.fungalFur(f, hF([[-0.3, -0.1], [-0.02, 0.0], [0.1, 0.06], [0.24, 0.04]]), 10, 1, { gaps: 0.1 });
  // the mail curtain hanging from the helm's rim round the face to the shoulders, covering the nose and mouth
  const cur = hF([[-0.42, -0.2], [-0.48, 0.2], [-0.4, 0.58], [-0.1, 0.74], [0.22, 0.66], [0.36, 0.46], [0.38, 0.24], [0.3, 0.18], [0.14, 0.21], [0.0, 0.22], [-0.2, 0.0], [-0.4, -0.22]]);
  const cD = f.part(cur, MAIL({ maxShade: 16 }));
  for (let i = 0; i < 5; i++) f.line([hF([[-0.3 + i * 0.12, 0.54 + (i % 2) * 0.04]])[0], hF([[-0.28 + i * 0.12, 0.66 + (i % 2) * 0.04]])[0]], 1.4, P.rust, { op: 0.7 });
  f.line(hF([[-0.3, 0.1], [-0.1, 0.3], [0.1, 0.36], [0.3, 0.3]]), 1.6, '#1a1a18', { op: 0.6 }); f.line(hF([[0.36, 0.1], [0.3, 0.3], [0.14, 0.5]]), 1.6, '#1a1a18', { op: 0.5 }); // the curtain drapes over the jaw and nose
  FX.frost(hF([[0.2, 0.3]])[0], 20, 26, 8); FX.icicles(hF([[-0.1, 0.7], [0.2, 0.64], [0.34, 0.48]]), 4, 20, 5);
  X.mould(f, hF([[0.14, 0.22]])[0], 24, 9, { rings: 2 }); X.fungalFur(f, hF([[-0.1, 0.16], [0.14, 0.24], [0.34, 0.24]]), 9, -1, { gaps: 0.1 }); // the bloom spreading out over the curtain's edge
  // the helm: four iron plates on a riveted frame, a brow band, a nasal bar down over the curtain
  const helm = hF([[-0.43, -0.18], [-0.44, -0.42], [-0.3, -0.64], [-0.06, -0.8], [0.04, -0.84], [0.2, -0.68], [0.34, -0.42], [0.38, -0.18]]);
  f.part(helm, { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.45, maxShade: 18, inkW: 1.8 });
  for (const q of [[[0.02, -0.82], [-0.06, -0.5], [-0.1, -0.22]], [[0.02, -0.82], [0.2, -0.5], [0.3, -0.22]]]) { f.stroke(hF(q), 10, P.ironL); f.line(hF(q), 1.4, INK, { op: 0.7 }); }
  f.part(hF([[-0.43, -0.27], [0.37, -0.25], [0.39, -0.14], [-0.44, -0.15]]), { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.4, cast: false });
  for (let i = 0; i < 6; i++) f.rivet(hF([[-0.4 + i * 0.15, -0.2]])[0], 3.4, P.ironL);
  f.part(hF([[0.3, -0.2], [0.38, -0.2], [0.39, 0.12], [0.35, 0.16], [0.31, 0.12]]), { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.4, cast: false }); // nasal down the bridge of the nose
  f.flat(hF(ell([-0.1, -0.5], 0.12, 0.08, 0.3, 10)), P.rust, { op: 0.55 }); f.scratches(hF([[0.1, -0.5]])[0], 20, 5, '#b8bcb0');
  FX.rime(hF([[-0.46, -0.3], [-0.3, -0.6], [0.02, -0.82], [0.24, -0.66]]), 12, 1);


  // ---- near arm: mail sleeve over the shoulder, the fist planted on the hip, elbow out behind
  const [cUN, cFN] = jcut(SN, EN, WN, 34);
  split(f, () => f.part(X.jointLimb(SN, EN, lerp(EN, WN, 0.92), [100, 82, 64], { point: 0.4, mus0: 0.14, mus1: 0.22 }), MAIL()), [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('forearm_n');
  f.part(plate(EN, WN, 0.4, 0.9, 80, 72, { bow: 3 }), { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4 }); // a leather bracer
  for (const t of [0.5, 0.7]) f.line([lp(EN, WN, t, -38), lp(EN, WN, t + 0.01, 38)], 3, P.leatherD);
  f.bone('upperarm_n');
  FX.rime([lp(SN, EN, -0.05, -50), lp(SN, EN, 0.5, -46)], 8, -1);
  f.bone('torso');
  G.pauldron(f, add(SN, [-6, -12]), 52, 0.4, mix(P.iron, P.rust, 0.45), P.rustD, 3); // a rusted shoulder plate (on the torso so it stays when the arm moves)
  f.bone('hand_n');
  const fa = ang(EN, WN);
  const gN = B.fist(f, WN, fa, 34, mix(P.skin, P.skinD, 0.2), { shadow: P.skinS, tex: 'mottle' + seed, texOp: 0.5 }); // the fist planted on the hip, continuing the forearm
  X.fistDetail(f, { F: gN }, 34, P.skin, { nail: '#4a4844' });

  f.bone('root');
  f.flat(ell([460, gy + 4], 260, 10, 0, 20), P.frostD, { op: 0.5 });
  return f;
}

// ------------------------------------------------------------------ THE BARROW KING (ruler 3.5)
// The king who ordered the burial: he sealed his kingdom in the barrow to stop the plague, and the plague was already
// inside. Rebuilt in review as a seated ruler in three-quarter front view, like the Drowned King and the Riven Jarl: the
// frame takes his shins and the top of the throne, so he fills it.
// A big frame gone to bone: heavy shoulders under a fur-collared burial mantle, the chest sunk inside the mail shirt so
// it hangs loose from the collarbones, a shrunken waist cinched by a king's belt that no longer fits. Both elbows rest on
// the throne's arms; the near fist holds the long sword's grip and the far hand lies on the blade, so the sword lies
// across his knees (the bible's signature). The knees come toward us under the long burial gown.
// Frost (dominant) has stiffened him where he sat: grey skin drawn tight, rime in every hollow, the beard frozen in
// clumps with icicles, the heavy lids frozen half-open over filmed eyes, the lips cracked. Toxin blooms anyway: buboes at
// the neck and both armpits, grey-green mould in the beard, on the mantle and in the throne's joints, rot holes.
// Remnant of the king: the iron crown, the silver burial mask slipped aside on its cord, the belt mounts, the sword, the
// signet with the Tooth. The relic carries the heaviest rot: the ring finger blackened round the band, rot veins up the
// hand. The throne is carved stone, worn smooth on its edges, rimed, mould grown into every joint.
// Rig: throne (root) > pelvis > torso > head > breath, mask; cloak (torso); arms; sword (hand_n); thighs and shins.
// Motion: idle a slow breath of frozen spores (torso, breath); attack a sword sweep that spreads rot.
function barrowKing() {
  const [CW, CH] = TIERS.ruler, seed = 900;
  const f = new Fig(X.base(seed, CH, { grimeY: 1380 }));
  X.textures(f); const FX = X.fx(f);
  const gy = f.o.groundY, H = 350;
  const skinC = '#a8aa9b', skinS = '#3c3b35', skinL = '#cdd0c2';
  const SKK = (o = {}) => X.SK(f, Object.assign({ fill: skinC, shadow: skinS, maxShade: 40, texOp: 0.7 }, o));
  const MANT = (o = {}) => Object.assign({ fill: '#525a4b', shadow: '#1b1e18', tex: 'weave' + seed, texOp: 0.5, shade: 0.42, maxShade: 110 }, o);
  const MAIL = (o = {}) => Object.assign({ fill: '#686c64', shadow: '#1d1f1b', tex: 'mail' + seed, texOp: 0.8, shade: 0.42, maxShade: 110 }, o);
  const GOWN = (o = {}) => Object.assign({ fill: '#77786a', shadow: '#22231d', tex: 'weave' + seed, texOp: 0.55, shade: 0.42, maxShade: 90 }, o);
  const STONE = (o = {}) => Object.assign({ fill: '#7d837b', shadow: '#2c302c', shade: 0.42, tex: 'mottle' + seed, texOp: 0.85, maxShade: 120 }, o);
  const FURc = (o = {}) => Object.assign({ fill: '#7e7c6e', shadow: '#2e2c26', tex: 'fur' + seed, texOp: 0.9, shade: 0.42, maxShade: 60 }, o);
  const stoneL = '#a6aca2', stoneD = '#3a3e3a', stoneK = '#1c1f1c';
  const fold = (pts, w = 6, op = 0.55, c = '#0f110e') => f.stroke(pts, w, c, { op });
  const soft = (d, list) => X.softTone(f, d, list);
  const jit = (pts, a) => pts.map(q => q.length > 2 ? q : add(q, [(f.r() - 0.5) * a, (f.r() - 0.5) * a]));
  const tornHem = (a, b, n, depth) => { const r = []; for (let i = 1; i < n; i++) { const q = lerp(a, b, (i + (f.r() - 0.5) * 0.9) / n), d = depth * (0.15 + Math.pow(f.r(), 1.5) * 1.3); r.push([q[0], q[1] + d, d > depth * 0.8 ? 1 : 0]); if (d > depth * 0.9) r.push([q[0] + (b[0] - a[0]) / n * 0.3, q[1] + d * 0.35]); } return r; };
  // a groove cut in stone (joint, carving): dark valley with a lit lip on the wall that faces the key light
  const groove = (pts, w = 4, op = 0.8) => X.crease(f, pts, w, { col: stoneK, lit: stoneL, op, litOp: 0.55, lip: w * 0.7 });
  // a strand carved in relief: cast shadow, an ink edge, the strand, a worn-bright top
  const relief = (pts, w, col = '#8c9288') => { f.line(pts.map(q => add(q, [-3, 4])), w + 5, stoneK, { op: 0.55 }); f.line(pts, w + 2.4, '#20241f', { op: 0.9 }); f.line(pts, w, col); f.line(pts.map(q => add(q, [w * 0.18, -w * 0.16])), Math.max(1, w * 0.22), stoneL, { op: 0.55 }); };
  // a two-strand plait running down a band (x0 centre, w band width), worn: crossings alternate over and under
  const plait = (x0, y0, y1, w, per, ph = 0) => {
    const S2 = (k, y) => [x0 + Math.sin((y - y0) / per * 2 * Math.PI + ph + k * Math.PI) * w * 0.3, y];
    const n = Math.ceil((y1 - y0) / (per / 2)) + 1;
    for (let c = 0; c < n; c++) {
      const yc = y0 + (c - ph / Math.PI) * per / 2, ya = Math.max(y0, yc - per / 4 - 3), yb = Math.min(y1, yc + per / 4 + 3); if (yb <= ya) continue;
      const seg = k => { const r = []; for (let y = ya; y <= yb; y += 5) r.push(S2(k, y)); return r; };
      for (const k of c % 2 ? [0, 1] : [1, 0]) relief(seg(k), w * 0.2);
    }
    f.line([[x0 - w / 2, y0], [x0 - w / 2, y1]], 3, stoneK, { op: 0.6 }); f.line([[x0 + w / 2, y0], [x0 + w / 2, y1]], 3, stoneK, { op: 0.6 }); // the band's fillets
    f.line([[x0 + w / 2 + 3, y0], [x0 + w / 2 + 3, y1]], 1.4, stoneL, { op: 0.5 });
  };

  // ---------------- skeleton
  const HC = [884, 336], hA = 0.14, hF = frame(HC, hA, H);
  const NB = [850, 612];                                          // neck base, under the beard
  const Pv = [840, 1190];
  const SN = [584, 700], EN = [488, 1008], WN = [598, 1228];      // near elbow on the throne arm, fist on the sword grip
  const SF = [1118, 690], EF = [1304, 958], WF = [1238, 1228];    // far elbow on the throne arm, the hand down on the blade
  const HN = [702, 1192], KN = [904, 1326], AN = [890, 1700];
  const HF = [1012, 1180], KF = [1252, 1298], AF = [1272, 1680];
  const swA = 0.074, swD = [Math.cos(swA), Math.sin(swA)];
  const swP = add(WN, mul(swD, -128)), swG = add(WN, mul(swD, 104)), swT = add(WN, mul(swD, 958));
  f.joint('throne', [800, 1530]).joint('pelvis', Pv, 'throne').joint('torso', [840, 1110], 'pelvis').joint('head', NB, 'torso');
  f.joint('breath', hF([[0.34, 0.28]])[0], 'head').joint('mask', hF([[-0.2, 0.12]])[0], 'head').joint('cloak', [840, 600], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('sword', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f');

  // ================= the grave-throne: an arched back of laid blocks between two carved posts with knotted finials,
  // worn round on every edge, rimed on the windward side and the tops, mould grown into the joints and the carving
  f.bone('throne');
  const AC = [818, 724], ARX = 452, ARY = 500, archAt = (t, k = 0) => { const a = Math.PI * (1 + t); return [AC[0] + Math.cos(a) * (ARX + k), AC[1] + Math.sin(a) * (ARY + k)]; };
  const back = [[300, 1530], [300, 724]]; for (let t = 0; t <= 1.0001; t += 0.04) back.push(archAt(t, 46)); back.push([1336, 724], [1336, 1530]);
  const bkD = f.part(back, STONE({ fill: '#5c6259', maxShade: 60 }));
  X.stains(f, bkD, [280, 0, 1360, 1540], P.mouldD, 0.012, 3, -1.6, 3, 0.55, 3);
  X.clipDraw(f, bkD, () => {
    // courses of blocks: joints thick with mould, every block's arris worn round and chipped
    const rows = [60, 220, 390, 570, 760, 950, 1140, 1340, 1530];
    for (let i = 1; i < rows.length - 1; i++) {
      const y = rows[i] + (f.r() - 0.5) * 10; groove([[300, y], [600, y + 3], [1000, y - 2], [1340, y + 2]], 5, 0.85);
      X.fungalFur(f, [[300, y + 2], [800, y + 3], [1340, y + 3]], 9, 1, { gaps: 0.55 });
      for (let k = 0; k < 3; k++) X.mould(f, [340 + f.r() * 960, y + 2], 16 + f.r() * 14, 6 + f.r() * 4, { rings: 1 });
      for (let x = 300 + (i % 2) * 170 + 90; x < 1340; x += 340) { groove([[x, rows[i - 1] + 4], [x + 3, rows[i] - 4]], 4.4, 0.8); X.fungalFur(f, [[x + 3, rows[i - 1] + 8], [x + 5, rows[i] - 6]], 7, -1, { gaps: 0.6 }); }
      soft(E.smooth(back), [[[[300, y + 4], [1340, y + 4], [1340, y + 40], [300, y + 40]], '#000', 0.18, 12], [[[300, y - 30], [1340, y - 30], [1340, y - 6], [300, y - 6]], '#ffffff', 0.08, 10]]);
    }
    // the carved arch: a raised band with a worn plait, the bare stone showing where the carving has worn away
    const arc = []; for (let t = 0; t <= 1.0001; t += 0.02) arc.push(archAt(t, 0));
    f.line(arc.map(q => add(q, [-4, 6])), 92, stoneK, { op: 0.45 }); f.line(arc, 86, '#737970'); f.line(arc, 86, 'url(#mottle' + seed + ')', { op: 0.6 });
    f.line(arc.map((q, i) => archAt(i * 0.02, 40)), 3, stoneK, { op: 0.7 }); f.line(arc.map((q, i) => archAt(i * 0.02, -40)), 3, stoneK, { op: 0.7 });
    for (let k = 0; k < 2; k++) { const s2 = arc.map((q, i) => archAt(i * 0.02, Math.sin(i * 0.9 + k * Math.PI) * 22)); for (let j = 0; j < s2.length - 2; j += 2) relief(s2.slice(j, j + 3), 14); }
    for (const t of [0.3, 0.62, 0.8]) { const q = archAt(t); f.flat(jit(ell(q, 30, 22, 0, 10), 8), '#5e645c'); groove([add(q, [-26, -6]), add(q, [0, 4]), add(q, [24, -4])], 3); }
  });
  FX.rime(back.slice(2, 16), 12, 1);
  FX.icicles(back.slice(8, 20).map(q => add(q, [0, 4])), 4, 30, 7);
  // the two carved posts: plaited bands, chipped arrises, rime down the windward faces; each ends in a knotted finial
  for (const [x0, x1] of [[226, 370], [1266, 1410]]) {
    const xc = (x0 + x1) / 2, near = x0 < 800;
    const fin = jit([[x0 + 10, 200], [x0 + 4, 150], [xc - 46, 118], [xc - 60, 80], [xc - 34, 40], [xc, 26], [xc + 36, 40], [xc + 60, 80], [xc + 46, 118], [x1 - 4, 150], [x1 - 10, 200]], 4);
    const fD = f.part(fin, STONE({ fill: near ? '#80867e' : '#6c7269', maxShade: 30 }));
    X.clipDraw(f, fD, () => { const kc = [xc, 82]; for (let k = 0; k < 3; k++) { const pts = []; for (let t = 0; t <= Math.PI * 2 + 0.01; t += 0.3) pts.push(add(kc, rot([Math.cos(t) * 40, Math.sin(t) * 18], k * Math.PI / 3))); relief(pts, 8); } groove([[x0 + 8, 160], [xc, 140], [x1 - 8, 160]], 3); }); // a worn triquetra knot
    FX.rime([[x0 + 4, 150], [xc - 60, 80], [xc - 34, 40], [xc, 26], [xc + 36, 40]], 8, 1);
    const post = [[x0, 196], [x1, 196], [x1 + 4, 1530], [x0 - 4, 1530]];
    const pD = f.part(post, STONE({ fill: near ? '#80867e' : '#6c7269', maxShade: 40 }));
    X.clipDraw(f, pD, () => {
      plait(xc + 6, 200, 1000, (x1 - x0) * 0.62, 150, near ? 0 : 1.2);
      for (const y of [200, 212, 1000, 1012]) groove([[x0, y], [x1, y]], 3.4);
      for (let y = 1060; y < 1530; y += 120) { groove([[x0 + 20, y], [x1 - 20, y + 4]], 3); groove([[x0 + 20, y + 50], [xc, y + 20], [x1 - 20, y + 54]], 2.6, 0.6); } // lower panels: worn chevrons
      for (let k = 0; k < 4; k++) { const y = 260 + k * 200 + f.r() * 60; f.flat(jit([[x0 - 2, y], [x0 + 14, y + 6], [x0 + 10, y + 26], [x0 - 2, y + 34]], 3), stoneK, { op: 0.85 }); } // chips out of the arris
      X.mould(f, [x0 + 30, 1040], 26, 18, { rings: 1 }); X.mould(f, [x1 - 30, 620], 18, 26, { rings: 1 }); X.mould(f, [xc, 1300], 22, 30, { rings: 2 });
      f.line([[x1 - 3, 200], [x1 - 2, 1530]], 3, stoneL, { op: 0.45 }); // the edge toward the light, worn bright
    });
    FX.rime([[x0 - 2, 220], [x0 - 4, 600], [x0 - 6, 1000]], 12, -1, { wind: [-1, 0] });
    X.graveCaps(f, [x0 + 6, 1000], deg(-160), 46, 3);
  }

  // ================= the burial mantle behind him, spread over the seat, mouldering: rot holes, mould tide marks
  f.bone('cloak');
  const cloak = jit([[520, 600], [700, 550], [980, 550], [1150, 590], [1250, 700], [1262, 900], [1270, 1120], [1250, 1260], [1180, 1300], [620, 1300], [500, 1270], [466, 1100], [470, 880], [480, 700]], 14);
  const clD = f.part(cloak, MANT({ fill: '#424938', maxShade: 120 }));
  X.stains(f, clD, [400, 520, 1320, 1320], P.mouldD, 0.014, 3, -1.5, 5, 0.75, 2);
  X.clipDraw(f, clD, () => {
    for (let i = 0; i < 4; i++) { const x = 490 + i * 36; fold([[x, 760 + i * 40], [x - 6, 1000], [x + 6, 1260]], 10, 0.5); }
    for (let i = 0; i < 3; i++) { const x = 1180 + i * 28; fold([[x, 740 + i * 50], [x + 6, 1000], [x - 4, 1250]], 10, 0.5); }
    soft(E.smooth(cloak), [[[[460, 600], [560, 600], [560, 1280], [460, 1280]], '#000', 0.4, 30]]);
  });
  for (const [x, y] of [[508, 940], [1232, 1180], [1214, 830]]) { const b = jit(ell([x, y], 18, 24, 0, 10), 8); f.flat(b, '#090a08'); f.line(b.slice(0, 6), 1.6, P.mouldL, { op: 0.6 }); }
  FX.rime([[520, 600], [480, 700], [470, 880], [466, 1100]], 14, -1, { wind: [-1, -0.2] });

  // ================= the throne arms: a side rail on each, ending in a carved scroll, a front leg down to the dais
  const armrest = (x0, x1, yT, far) => {
    const look = STONE({ fill: far ? '#6e746b' : '#878d84', maxShade: 50 });
    const side = [[x0, yT + 18], [x1 - 20, yT + 28], [x1 - 14, yT + 132], [x0, yT + 120]];
    const leg = [[x1 - 150, yT + 60], [x1 - 6, yT + 66], [x1 + 2, 1530, 1], [x1 - 156, 1530, 1]];
    const lD = f.part(leg, look);
    X.clipDraw(f, lD, () => { relief([[x1 - 120, yT + 180], [x1 - 118, 1500]], 10); relief([[x1 - 40, yT + 180], [x1 - 42, 1500]], 10); for (let y = yT + 200; y < 1500; y += 46) groove([[x1 - 112, y], [x1 - 50, y + 18]], 2.4, 0.6); X.mould(f, [x1 - 80, yT + 170], 40, 14, { rings: 1 }); X.mould(f, [x1 - 90, 1420], 30, 40, { rings: 2 }); });
    const sD = f.part(side, look);
    X.clipDraw(f, sD, () => { groove([[x0, yT + 70], [x1 - 20, yT + 80]], 3); for (let x = x0 + 40; x < x1 - 60; x += 70) relief([[x, yT + 92], [x + 30, yT + 50], [x + 60, yT + 92]], 7); });
    const top = [[x0, yT], [x1 - 40, yT + 6], [x1 - 18, yT + 30], [x0, yT + 22]];
    f.part(top, Object.assign({}, look, { fill: stoneL, shade: 0.3, maxShade: 14 }));
    // the scroll at the end: a volute, its spiral groove worn shallow, a chip out of its lip
    const sc = [x1 - 30, yT + 54], scr = jit(ell(sc, 62, 70, 0.2, 18), 5);
    f.part(scr, Object.assign({}, look, { fill: mix(look.fill, '#ffffff', 0.08) }));
    const sp = []; for (let t = 0; t < 4.2 * Math.PI; t += 0.3) sp.push(add(sc, rot([Math.cos(t) * (50 - t * 3.2), Math.sin(t) * (56 - t * 3.6)], 0.2)));
    groove(sp, 3.6, 0.8);
    f.flat(jit([add(sc, [-56, 30]), add(sc, [-40, 48]), add(sc, [-56, 60])], 2), stoneK, { op: 0.8 });
    FX.rime([[x0, yT - 2], [(x0 + x1) / 2, yT + 2], [x1 - 40, yT + 4], add(sc, [-30, -66])], 10, 1);
    FX.icicles([[x0 + 10, yT + 122], [x1 - 160, yT + 130]], 7, 46, 9);
    X.fungalFur(f, [[x0, yT + 21], [x1 - 40, yT + 28]], 8, 1, { gaps: 0.5 });
    return sc;
  };
  armrest(1110, 1452, 1022, true);

  // ================= far upper arm (behind the body): a big bony shoulder and arm in a mail sleeve, the elbow on the rail
  f.bone('upperarm_f');
  const uaF = K.chain([add(SF, [0, -40]), lerp(SF, EF, 0.5), EF], [196, 150, 120], { bp: [[0, 0.3, 0.1, 0.25]], bq: [[0, 0.6, 0.12, 0.25]] });
  f.part(uaF, SKK({ maxShade: 26 }));
  f.part(ell(add(EF, [10, 14]), 58, 50, 0.3, 14), SKK({ maxShade: 26, cast: false })); // the bony point of the elbow on the rail
  f.line([add(EF, [-30, 50]), add(EF, [20, 66]), add(EF, [62, 40])], 2.4, '#26241f', { op: 0.6 });
  const slF = f.part(K.ragLimb(f, add(SF, [-6, -50]), lerp(SF, EF, 0.74), 214, 156, { p: [[0.3, 0.12, 0.2]], q: [[0.35, 0.08, 0.2]],  depth: 22, teeth: 7 }), MAIL({ fill: '#73776e', maxShade: 40 }));
  X.clipDraw(f, slF, () => { fold([lp(SF, EF, 0.3, 70), lp(SF, EF, 0.5, 40), lp(SF, EF, 0.68, 76)], 6, 0.5); fold([lp(SF, EF, 0.4, -60), lp(SF, EF, 0.62, -40)], 5, 0.45); soft(slF, [[[lp(SF, EF, 0.1, -110), lp(SF, EF, 0.8, -110), lp(SF, EF, 0.8, -40), lp(SF, EF, 0.1, -50)], '#000', 0.35, 16]]); });
  f.line([lp(SF, EF, 0.2, 104), lp(SF, EF, 0.6, 88)], 3, '#e8ece4', { op: 0.35 }); // its lit edge, apart from the dark mantle behind
  FX.rime([lp(SF, EF, 0.05, 108), lp(SF, EF, 0.4, 96), lp(SF, EF, 0.7, 82)], 8, 1);
  for (let i = 0; i < 3; i++) f.stroke([lp(SF, EF, 0.76, -90 + i * 66), lp(SF, EF, 0.84, -86 + i * 66), lp(SF, EF, 0.9, -94 + i * 66)], 4, P.rust, { op: 0.5 });

  // ================= legs. Shins in linen wraps and cross-garters (cut off by the dais), the burial gown hanging from
  // the knees in folds to a torn, iced hem; the thighs coming toward us under the gown, the knees heavy caps
  const leg = (sfx, Hp, Kn, A, wT, wK, far) => {
    const tone = far ? 0.14 : 0;
    f.bone('shin' + sfx);
    const sh = K.chain([add(Kn, [0, -40]), lerp(Kn, A, 0.4), A], [wK * 0.8, wK * 0.74, wK * 0.6], { bq: [[0, 0.3, 0.12, 0.25]], bp: [[0, 0.25, 0.05, 0.3]] });
    const shD = f.part(sh, { fill: mix('#8a887a', '#000', tone), shadow: '#26251f', shade: 0.42, tex: 'weave' + seed, texOp: 0.55, maxShade: 50 });
    X.clipDraw(f, shD, () => { for (let i = 0; i < 9; i++) { const t = 0.2 + i * 0.07; f.line([lp(Kn, A, t, -wK * 0.5), lp(Kn, A, t + 0.04, wK * 0.5)], 2.4, '#1c1b16', { op: 0.65 }); } for (let i = 0; i < 4; i++) { const t = 0.36 + i * 0.1; f.line([lp(Kn, A, t, wK * 0.45), lp(Kn, A, t + 0.08, -wK * 0.45)], 6, P.leatherD, { op: 0.9 }); } X.stains(f, shD, [Kn[0] - 150, Kn[1], Kn[0] + 150, 1560], P.mouldD, 0.04, 3, -1.8, 61 + Math.round(Kn[0]), 0.6); });
    // the gown falling from the knee: plumb folds, a torn hem with icicles; on the shin so it travels with the lower leg.
    // Its top runs up under the knee, so the knee's round edge reads as the cloth turning over it
    const gl = Kn[0] - wK * 0.6, gr = Kn[0] + wK * 0.62, hy = 1494 + (far ? -14 : 0);
    const gHem = tornHem([gr, hy], [gl, hy + 6], 9, 30);
    const drape = [[gl + 14, Kn[1] - 20], [gr - 10, Kn[1] - 26], [gr + 10, hy - 50], [gr, hy], ...gHem, [gl, hy + 6], [gl - 12, hy - 60]];
    const dD = f.part(drape, GOWN({ fill: mix('#6e6f62', '#000', tone), maxShade: 22 }));
    X.stains(f, dD, [gl - 30, Kn[1] - 20, gr + 30, hy + 60], P.mouldD, 0.03, 3, -1.6, 71 + Math.round(Kn[0]), 0.7);
    X.clipDraw(f, dD, () => { for (const t of [0.16, 0.4, 0.66, 0.88]) { const x = gl + (gr - gl) * t; fold([[x + 6, Kn[1] + 60], [x - 6, Kn[1] + 120], [x + 4, hy + 10]], 7, 0.6); } soft(E.smooth(drape), [[[[gl, Kn[1]], [gr, Kn[1]], [gr, Kn[1] + 110], [gl, Kn[1] + 110]], '#000', 0.3, 18], [[[gr - 50, Kn[1] + 100], [gr, Kn[1] + 100], [gr, hy], [gr - 50, hy]], '#ffffff', 0.08, 14]]); });
    FX.icicles(gHem.map(q => [q[0], q[1] - 3]), 6, 30, 7);
    X.fungalFur(f, gHem.map(q => [q[0], q[1] - 2]), 8, -1, { gaps: 0.4 });
    f.bone('thigh' + sfx);
    const th = X.tube([sub(Hp, mul(E.norm(sub(Kn, Hp)), 70)), lerp(Hp, Kn, 0.55), Kn], [wT, wT * 0.86, wK], 0.9);
    const thD = f.part(th, GOWN({ fill: mix('#7c7d70', '#000', tone), maxShade: 28 }));
    X.clipDraw(f, thD, () => {
      fold([lp(Hp, Kn, 0.3, wT * 0.3), lp(Hp, Kn, 0.6, wT * 0.12), lp(Hp, Kn, 0.86, wT * 0.34)], 6);
      fold([lp(Hp, Kn, 0.45, -wT * 0.36), lp(Hp, Kn, 0.72, -wT * 0.2), lp(Hp, Kn, 0.92, -wT * 0.4)], 5);
      X.stains(f, thD, [Hp[0] - 250, Hp[1] - 250, Kn[0] + 200, Kn[1] + 200], P.mouldD, 0.03, 3, -1.8, 81 + Math.round(Hp[0]), 0.6);
      // the knee: the cap of bone pushing the cloth, lit on top, the cloth pulled into it in short strain folds
      soft(thD, [[ell(add(Kn, [24, -10]), wK * 0.34, wK * 0.26, 0.3, 10), '#ffffff', 0.22, 12], [ell(add(Kn, [-30, 60]), wK * 0.5, wK * 0.22, 0.3, 10), '#000', 0.4, 12]]);
      for (let i = 0; i < 3; i++) fold([add(Kn, [-wK * 0.46 + i * 10, -30 - i * 24]), add(Kn, [-wK * 0.2, -10 - i * 22]), add(Kn, [-wK * 0.1 + i * 8, 20 - i * 20])], 3.4, 0.35);
    });
    FX.frost(add(Kn, [16, -30]), wK * 0.26, 18, 10);
  };
  leg('_f', HF, KF, AF, 290, 206, true);
  // the gown's fold dropping between the knees (on the pelvis, behind both lower legs' drapes)
  f.bone('pelvis');
  f.part([[880, 1250], [1080, 1240], [1110, 1480], [1060, 1508], [980, 1486], [920, 1512], [870, 1478]], GOWN({ fill: '#55564b', maxShade: 40 }));
  fold([[990, 1280], [980, 1380], [990, 1490]], 12, 0.7);
  leg('_n', HN, KN, AN, 316, 222, false);
  // a rot hole worn through the gown over the near knee: the grey kneecap under it, frost in the hole
  f.bone('thigh_n');
  { const c = add(KN, [-70, 10]), hl = jit(ell(c, 26, 20, 0.5, 12), 5); f.part(hl, SKK({ maxShade: 10, cast: false, inkW: 1.4 })); f.line(ell(c, 30, 20, 0.3, 10).slice(5, 10), 2, '#2a2824', { op: 0.6 }); f.line(hl.concat([hl[0]]), 3, '#14150f', { op: 0.8 }); X.fungalFur(f, hl, 6, 1, { gaps: 0.3 }); FX.frost(c, 20, 14, 6); }

  // ================= torso: a big frame shrunk inside its mail: the shirt hangs from the collarbones, the chest caves in
  // under it, the belly sinks below the ribs; the hem of the shirt spreads over the lap
  f.bone('torso');
  const torso = [[730, 570], [640, 598], [566, 650], [532, 744], [538, 880], [562, 1010], [576, 1110], [562, 1220], [630, 1290], [750, 1312], [880, 1318], [980, 1298], [1060, 1280], [1130, 1288], [1196, 1268], [1186, 1180], [1150, 1080], [1134, 960], [1144, 830], [1162, 730], [1146, 656], [1090, 604], [1000, 570], [860, 560]];
  const toD = f.part(torso, MAIL());
  X.stains(f, toD, [500, 540, 1220, 1340], P.rustD, 0.02, 3, -1.6, 9, 0.55, 2);
  X.stains(f, toD, [500, 540, 1220, 1340], P.mouldD, 0.02, 3.2, -1.9, 11, 0.6, 2);
  X.clipDraw(f, toD, () => {
    soft(toD, [
      [[[760, 700], [960, 690], [1000, 900], [940, 1010], [800, 1010], [740, 880]], '#000', 0.5, 30], // the sunken breast
      [[[590, 1040], [1150, 1040], [1120, 1110], [610, 1120]], '#000', 0.55, 18], // the hollow under the ribs
      [[[540, 640], [660, 680], [650, 1260], [560, 1260], [560, 900]], '#000', 0.5, 30], // the near flank, away from the key light
      [[[960, 640], [1100, 660], [1110, 800], [980, 790]], '#ffffff', 0.16, 26], // the far pectoral ridge facing the light
      [[[1150, 700], [1190, 720], [1180, 1240], [1150, 1240]], '#000', 0.3, 14], // the far edge turning under
      [[[620, 990], [1090, 985], [1080, 1020], [630, 1030]], '#ffffff', 0.14, 10], // the lower edge of the ribcage
    ]);
    // the mail hangs off the collarbones and pectorals in long vertical folds, sags in catenaries across the sunken belly
    for (const x of [660, 736, 980, 1050]) fold([[x, 640], [x - 6, 820], [x + 4, 1020]], 6, 0.5);
    for (let i = 0; i < 4; i++) fold([[600 + i * 10, 880 + i * 50], [860, 960 + i * 54], [1126 - i * 10, 890 + i * 50]], 5 - i * 0.6, 0.42);
    fold([[760, 640], [850, 700], [960, 640]], 5, 0.5); // the shirt dragged into the pit between the collarbones
    // the collarbones and sternum standing up under the rings
    f.line([[620, 640], [740, 660], [826, 676]], 4, '#d0d4c8', { op: 0.3 }); f.line([[880, 676], [980, 656], [1080, 646]], 4, '#d0d4c8', { op: 0.25 });
    f.line([[852, 700], [858, 820], [854, 960]], 5, '#d0d4c8', { op: 0.18 });
    // the skirt over the lap: heavier ring rows at the hem, a deep fold between the thighs
    for (let i = 0; i < 3; i++) f.line([[562 + i * 4, 1220 - i * 14], [630, 1290 - i * 14], [750, 1312 - i * 14], [880, 1318 - i * 14], [980, 1298 - i * 14], [1060, 1280 - i * 14], [1130, 1288 - i * 14], [1196, 1268 - i * 14]], 3, '#0e100d', { op: 0.5 - i * 0.12 });
    fold([[980, 1180], [990, 1250], [984, 1300]], 12, 0.6); fold([[700, 1220], [800, 1290]], 6, 0.4); fold([[1060, 1220], [1160, 1270]], 6, 0.4);
    f.scratches([700, 760], 60, 8, '#c8ccc4');
  });
  // the mail torn open over the far side of the chest: grey skin drawn on the ribs, frost lying between them
  { const rent = jit([[1000, 836], [1046, 812], [1100, 840], [1112, 900], [1090, 960], [1050, 950], [1020, 976], [996, 920], [976, 880]], 10);
    const rD = f.part(rent, SKK({ maxShade: 14, inkW: 1.8, cast: false }));
    X.clipDraw(f, rD, () => { for (let i = 0; i < 4; i++) X.crease(f, [[970, 846 + i * 34], [1040, 836 + i * 36], [1120, 856 + i * 34]], 5, { col: '#24221d', lit: skinL }); FX.frost([1046, 890], 40, 50, 12); X.livid(f, [1040, 900], 40, 40, 5, 1.6); });
    for (let i = 0; i < rent.length; i += 2) { const q = rent[i]; f.line([q, add(q, [(f.r() - 0.5) * 16, 8 + f.r() * 10])], 2.4, P.rust, { op: 0.75 }); f.flat(ell(add(q, [(f.r() - 0.5) * 8, (f.r() - 0.5) * 8]), 4, 3, 0, 6), P.rustL, { op: 0.8 }); } }
  X.bubo(f, [1158, 772], 44, { sag: 0.6, mixSkin: 0.7 }); // the far armpit bubo, swollen out between the arm and the chest
  X.mould(f, [650, 1000], 36, 26); X.mould(f, [1100, 1180], 30, 20, { rings: 2 });
  // the shirt bloused over the belt where it is cinched, a shadow under the overhang
  f.part([[566, 1100], [720, 1140], [860, 1158], [1010, 1142], [1150, 1094], [1156, 1136], [1010, 1186], [860, 1200], [720, 1186], [570, 1146]], MAIL({ fill: '#70746b', maxShade: 20, cast: true }));
  for (let i = 0; i < 6; i++) { const x = 620 + i * 96; fold([[x, 1110 + Math.sin(i) * 10], [x + 10, 1150], [x + 4, 1180]], 5, 0.45); }
  // the king's belt, cinched to the last hole and still loose: silver mounts tarnished black, the tongue hanging long
  const belt = [[566, 1128], [720, 1170], [860, 1186], [1010, 1170], [1150, 1120], [1158, 1176], [1010, 1226], [860, 1242], [720, 1226], [570, 1184]];
  f.part(belt, { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, maxShade: 26 });
  for (let i = 0; i < 7; i++) { const t = i / 6, q = add(lerp([596, 1160], [1126, 1152], t), [0, Math.sin(t * Math.PI) * 52]); f.part(jit(ell(q, 18, 16, 0, 8), 2), { fill: P.silverD, shadow: '#232624', shade: 0.42, inkW: 1.3, cast: false }); f.flat(ell(add(q, [3, -3]), 6, 5, 0, 8), P.silver, { op: 0.6 }); }
  f.part([[1040, 1152], [1110, 1140], [1116, 1214], [1046, 1224]], { fill: P.silverD, shade: 0.42, inkW: 1.6, sharp: true });
  f.part([[1058, 1164], [1098, 1158], [1102, 1202], [1062, 1208]], { fill: '#1a1c1a', shade: 0.3, inkW: 1.2, sharp: true });
  f.stroke([[1114, 1180], [1150, 1240], [1140, 1310]], 22, P.leatherD); f.part([[1124, 1300], [1156, 1296], [1152, 1336], [1128, 1338]], { fill: P.silverD, shade: 0.4, inkW: 1.1, cast: false }); // the tongue and its strap end
  FX.rime([[566, 1126], [720, 1166], [860, 1182]], 6, 1);

  // ================= near throne arm, then the near upper arm on it
  f.bone('throne');
  armrest(220, 650, 1062, false);
  f.bone('upperarm_n');
  const uaN = K.chain([add(SN, [0, -40]), lerp(SN, EN, 0.5), EN], [206, 156, 124], { bp: [[0, 0.6, 0.1, 0.25]], bq: [[0, 0.3, 0.12, 0.25]] });
  f.part(uaN, SKK({ maxShade: 26 }));
  f.part(ell(add(EN, [-14, 18]), 60, 52, 0.6, 14), SKK({ maxShade: 26, cast: false }));
  f.line([add(EN, [-60, 30]), add(EN, [-20, 70]), add(EN, [36, 62])], 2.4, '#26241f', { op: 0.6 });
  X.creaseField(f, add(EN, [-6, 8]), 30, 20, 4, 0.4, 30, 3, { lit: skinL });
  X.bubo(f, lp(SN, EN, 0.3, 96), 34, { sag: 0.6, mixSkin: 0.75, cast: false }); // the near armpit bubo, pressing out at the inside of the arm
  const slN = f.part(K.ragLimb(f, add(SN, [0, -56]), lerp(SN, EN, 0.74), 224, 162, { depth: 24, teeth: 8, p: [[0.3, 0.12, 0.2]], q: [[0.35, 0.08, 0.2]] }), MAIL({ fill: '#71756c', maxShade: 40 }));
  X.clipDraw(f, slN, () => { fold([lp(SN, EN, 0.3, -70), lp(SN, EN, 0.5, -40), lp(SN, EN, 0.7, -80)], 6, 0.5); fold([lp(SN, EN, 0.4, 60), lp(SN, EN, 0.66, 40)], 5, 0.45); soft(slN, [[[lp(SN, EN, 0.1, 30), lp(SN, EN, 0.8, 20), lp(SN, EN, 0.8, 110), lp(SN, EN, 0.1, 120)], '#000', 0.35, 18]]); });
  for (let i = 0; i < 3; i++) f.stroke([lp(SN, EN, 0.78, -90 + i * 70), lp(SN, EN, 0.86, -86 + i * 70), lp(SN, EN, 0.92, -94 + i * 70)], 4, P.rust, { op: 0.5 });
  FX.rime([lp(SN, EN, 0.05, -112), lp(SN, EN, 0.4, -98), lp(SN, EN, 0.7, -84)], 10, -1);

  // ================= the shoulder mantle over both shoulders (on the torso): heavy wool lined with fur, piled on the
  // shoulders so they read broad; its front edges hang down either side of the chest; a ring brooch on the near shoulder
  f.bone('torso');
  const mEdgeN = [[474, 792], [548, 836], [624, 820], [696, 756], [756, 652]], mEdgeF = [[964, 642], [1032, 716], [1100, 790], [1178, 826], [1242, 782]];
  const mant = jit([[488, 650], [560, 584], [690, 532], [860, 518], [1020, 528], [1150, 570], [1230, 642], ...mEdgeF.slice().reverse(), [880, 600], ...mEdgeN.slice().reverse()], 10);
  const maD = f.part(mant, MANT({ maxShade: 70 }));
  X.stains(f, maD, [460, 500, 1260, 860], P.mouldD, 0.014, 3, -1.5, 15, 0.75, 2);
  X.stains(f, maD, [460, 500, 1260, 860], '#c8ccc0', 0.03, 3.4, -2.6, 17, 0.4);
  X.clipDraw(f, maD, () => {
    fold([[590, 574], [606, 660], [590, 780]], 14, 0.4); fold([[700, 540], [710, 610], [690, 700]], 10, 0.35); fold([[1100, 572], [1100, 670], [1130, 780]], 14, 0.45); fold([[1000, 540], [1010, 600], [1030, 680]], 10, 0.35);
    soft(maD, [[[[500, 600], [650, 560], [630, 640], [510, 700]], '#ffffff', 0.08, 20], [[[1080, 560], [1240, 640], [1230, 840], [1100, 800]], '#000', 0.4, 26]]);
  });
  for (const [x, y] of [[640, 720], [1130, 700]]) { const b = jit(ell([x, y], 22, 16, 0, 10), 6); f.flat(b, '#090a08'); f.line(b.slice(0, 6), 1.6, P.mouldL, { op: 0.7 }); } // rot holes
  // the fur lining turned out along the front edges, in matted, frozen locks
  // the fur lining turned out along both front edges: a matted band, lumpy, a few frozen tufts breaking its lower edge
  for (const edge of [mEdgeN, mEdgeF]) {
    const C2 = X.spline(edge, 6), W2 = C2.map((_, i) => 44 + Math.sin(i * 1.7) * 8 + f.r() * 10);
    const fb = jit(X.ribbon(C2, W2), 2); f.part(fb, FURc({ fill: '#625f54', maxShade: 16 }));
    X.clipDraw(f, E.smooth(fb), () => { for (let i = 1; i < C2.length - 1; i += 2) { const q = C2[i]; f.line([add(q, [-6, -14]), add(q, [2, 0]), add(q, [-2, 16])], 2, '#24231e', { op: 0.6 }); f.line([add(q, [4, -12]), add(q, [8, 6])], 1.4, '#8e8c80', { op: 0.45 }); } });
    for (let i = 3; i < C2.length - 1; i += 5) { const q = C2[i], l = 20 + f.r() * 20; X.hairClump(f, [add(q, [0, 6]), add(q, [3, l * 0.6]), add(q, [-1, l])], 22, { pal: ['#3c3a32', '#4a4840'], n: 3 }); if (f.r() < 0.5) FX.icicle(add(q, [-1, l - 2]), 12 + f.r() * 14, 5); }
    FX.rime(C2.filter((_, i) => i % 2 === 0).map(q => add(q, [0, -18])), 6, 1);
  }
  
  FX.rime([[452, 650], [520, 582], [660, 530], [850, 516]], 14, 1);
  X.mould(f, [760, 600], 30, 18, { rings: 2 }); X.graveCaps(f, [1180, 600], deg(-70), 40, 3);
  { const q = [712, 704]; f.part(ell(q, 40, 36, 0, 18), { fill: P.silverD, shadow: '#222624', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2 }); f.flat(ell(q, 22, 19, 0, 14), '#2a2e2a'); const r2 = ell(q, 31, 27, 0, 16); f.line(r2.concat([r2[0]]), 3, P.silver, { op: 0.6 }); for (let i = 0; i < 8; i++) f.line([add(q, rot([24, 0], i * 0.78)), add(q, rot([38, 0], i * 0.78 + 0.2))], 1.4, INK, { op: 0.6 }); f.part([add(q, [-8, -64]), add(q, [2, -66]), add(q, [10, 60]), add(q, [2, 64])], { fill: P.silverD, shade: 0.42, inkW: 1.3, cast: false }); f.flat(ell(add(q, [-10, 10]), 10, 6, 0, 8), P.mouldD, { op: 0.7 }); } // the ring brooch, its long pin through the wool

  // ================= head
  f.bone('head');
  // lank grey hair hanging plumb from under the crown at the back, frozen into clumps on the mantle
  for (let i = 0; i < 6; i++) { const p0 = hF([[-0.42 + i * 0.02, -0.2 + i * 0.1]])[0]; X.hairClump(f, [p0, add(p0, [-8, 60]), add(p0, [-4, 130 + i * 10]), add(p0, [-10, 180 + i * 16])], 26 - i * 1.5, { pal: ['#5e6058', '#7e8076', '#9a9c90', '#6a6c62'], n: 4 }); if (i % 2 === 0) FX.icicle(add(p0, [-10, 176 + i * 16]), 24, 6); }
  // the neck: a thick column gone to cords, the tendons and the windpipe standing under tight skin
  const nk = K.chain([add(NB, [0, 20]), lerp(NB, hF([[-0.04, 0.38]])[0], 0.5), hF([[-0.04, 0.36]])[0]], [250, 220, 200]);
  const nD = f.part(nk, SKK({ maxShade: 30 }));
  X.clipDraw(f, nD, () => { for (const [a, b] of [[[790, 620], hF([[-0.16, 0.36]])[0]], [[930, 610], hF([[0.12, 0.42]])[0]]]) X.crease(f, [a, lerp(a, b, 0.5), b], 6, { col: '#24221d', lit: skinL }); f.line([[862, 600], hF([[0.04, 0.48]])[0]], 7, skinL, { op: 0.35 }); soft(nD, [[[[740, 460], [800, 460], [800, 640], [740, 640]], '#000', 0.4, 16]]); FX.frost([860, 590], 40, 20, 10); });
  X.bubo(f, hF([[-0.2, 0.48]])[0], 54, { sag: 0.7, mixSkin: 0.7 }); // the neck bubo below the ear, sagging under its frost skin
  // the fur collar of the mantle round the neck, under the beard
  const col = jit([[640, 590], [720, 548], [850, 540], [990, 550], [1080, 590], [1040, 640], [960, 646], [850, 660], [740, 648], [660, 640]], 8);
  f.part(col, FURc());
  for (let i = 0; i < 11; i++) { const t = (i + f.r() * 0.6) / 11, q = lerp([660, 600], [1060, 604], t), l = 30 + f.r() * 36; X.hairClump(f, [add(q, [0, -22]), add(q, [4, l * 0.5]), add(q, [-2, l])], 30 + f.r() * 10, { pal: ['#4a483f', '#66645a', '#7a786c'], n: 4 }); }
  FX.rime([[640, 588], [720, 546], [850, 538]], 9, 1);
  B.head(f, HC, H, hA, {
    skin: skinC, jaw: 1.16, chin: 0.03, nose: 1.04, hook: 0.6, mouth: 'set', blind: true, browDown: 0.07, browW: 0.055, faceShade: 0.8, jawShade: 0.55, gaunt: true, age: true,
    hairCol: '#8a8c80', browCol: '#b8bcb0', hairBack: [[-0.46, 0.2], [-0.52, -0.16], [-0.42, -0.42], [-0.2, -0.52], [-0.26, -0.2], [-0.32, 0.16]],
  });
  X.greyFace(f, hF, skinC, 1.04);
  const faceO = hF([[-0.3, -0.4], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.335, 0.37], [0.32, 0.47], [0.145, 0.54], [-0.12, 0.49], [-0.27, 0.27], [-0.3, 0.08], [-0.37, -0.13]]);
  X.clipDraw(f, E.smooth(faceO), () => {
    // the skull under the skin: temple hollow, cheek sunk under the cheekbone, the jaw's angle and the chin's bone
    soft(E.smooth(faceO), [
      [hF([[-0.06, -0.34], [0.1, -0.33], [0.12, -0.2], [-0.02, -0.18]]), '#1a1814', 0.5, 6],
      [hF([[0.0, 0.1], [0.24, 0.13], [0.27, 0.25], [0.14, 0.32], [0.0, 0.24]]), '#1a1814', 0.6, 6],
      [hF([[-0.3, 0.0], [-0.14, 0.04], [-0.12, 0.4], [-0.28, 0.3]]), '#1a1814', 0.45, 8],
      [hF([[0.02, 0.0], [0.14, -0.02], [0.24, 0.05], [0.12, 0.07]]), '#ffffff', 0.25, 4],
      [hF([[0.04, -0.3], [0.2, -0.32], [0.28, -0.24], [0.1, -0.22]]), '#ffffff', 0.18, 5],
    ]);
    f.line(hF([[0.0, 0.05], [0.12, 0.03], [0.25, 0.085]]), 3, skinL, { op: 0.6 }); // the cheekbone's edge
    X.crease(f, hF([[0.27, 0.11], [0.235, 0.18], [0.205, 0.25], [0.19, 0.3]]), 3.4, { col: '#1e1c18', lit: skinL }); // the fold from nose to mouth, deep
    X.crease(f, hF([[-0.16, 0.22], [-0.06, 0.38], [0.06, 0.46]]), 2.6, { col: '#1e1c18', lit: skinL, op: 0.6 }); // the jaw's edge under the skin
    for (let i = 0; i < 3; i++) X.crease(f, hF([[0.0, -0.24 - i * 0.05], [0.1, -0.26 - i * 0.05], [0.2, -0.25 - i * 0.05]]), 2, { col: '#1e1c18', lit: skinL, op: 0.6 });
    X.crease(f, hF([[0.2, -0.17], [0.215, -0.12]]), 2.2, { col: '#1e1c18', lit: skinL }); // the frown between the brows
    for (let i = 0; i < 3; i++) f.line(hF([[0.17, -0.02 + i * 0.03], [0.21, -0.03 + i * 0.035]]), 1.2, '#1e1c18', { op: 0.5 }); // crow's feet
    X.livid(f, hF([[0.0, 0.1]])[0], 40, 34, 7, 1.6); X.peel(f, hF([[-0.05, -0.36]])[0], 4, 1.8, 40);
    FX.frost(hF([[0.06, -0.3]])[0], 14, 6, 6, 1.4); FX.frost(hF([[0.2, 0.22]])[0], 8, 12, 6, 1.4); // frost settled in the hollows
  });
  // the eyes: heavy lids frozen half-shut over filmed eyes, the lashes rimed. Near eye, then the foreshortened far eye
  const eye = (cx, cy, w, h, lid) => {
    const E2 = pts => hF(pts.map(([u, v]) => [cx + u * w, cy + v * h]));
    f.flat(E2([[-1, 0.1], [0, -0.5], [1, 0.05], [0.4, 0.6], [-0.5, 0.55]]), '#141311', { op: 0.85 }); // the socket's dark
    f.flat(E2([[-0.86, 0.12], [-0.1, -0.18], [0.84, 0.06], [0.3, 0.42], [-0.4, 0.38]]), '#8b8f86'); // the filmed eye
    f.flat(E2([[-0.2, 0.0], [0.24, -0.04], [0.26, 0.3], [-0.16, 0.32]]), '#5c6059', { op: 0.75 }); // a ghost of the iris
    f.part(E2([[-1.1, -0.5], [-0.2, -1.0], [0.9, -0.62], [1.05, 0.06], [0.3, lid], [-0.5, lid - 0.04], [-1.0, 0.14]]), SKK({ maxShade: 6, cast: false, inkW: 1, inkHeavy: 1.2, texOp: 0.5 })); // the upper lid, heavy
    f.line(E2([[-0.98, 0.12], [-0.5, lid - 0.04], [0.3, lid], [1.0, 0.06]]), 3, '#141210'); // its edge
    f.line(E2([[-0.8, -0.56], [0.0, -0.82], [0.8, -0.5]]), 1.6, '#24221d', { op: 0.7 }); // the lid's crease
    f.line(E2([[-0.7, 0.5], [0.0, 0.62], [0.7, 0.4]]), 1.6, '#24221d', { op: 0.6 }); // the lower lid
    f.flat(E2([[-0.8, 0.6], [0.0, 0.8], [0.8, 0.5], [0.4, 1.1], [-0.4, 1.1]]), '#1e1c18', { op: 0.35 }); // the sunk bag under it
    f.line(E2([[-0.9, 0.06], [-0.4, lid - 0.06], [0.3, lid - 0.04], [0.9, 0.02]]), 1.4, P.hoar, { op: 0.5 }); // rime on the lashes
    for (let k = 0; k < 3; k++) { const q = E2([[-0.5 + k * 0.45, lid + 0.04]])[0]; f.line([q, add(q, [0.5, 3 + (k % 2) * 2])], 1.1, P.hoar, { op: 0.55 }); }
  };
  eye(0.115, -0.05, 0.056, 0.034, 0.02); eye(0.292, -0.058, 0.024, 0.032, 0.08);
  // the mouth: the lips shrunk and split with cold, parted on a dark gap, the tips of teeth in it
  f.flat(hF([[0.17, 0.278], [0.24, 0.27], [0.31, 0.276], [0.3, 0.288], [0.24, 0.286], [0.18, 0.29]]), '#161412');
  for (let i = 0; i < 3; i++) { const x = 0.22 + i * 0.026; f.flat(hF([[x, 0.275], [x + 0.02, 0.273], [x + 0.019, 0.283], [x + 0.002, 0.284]]), i === 1 ? '#3a3632' : P.boneD, { op: 0.85 }); }
  f.part(hF([[0.16, 0.266], [0.24, 0.252], [0.318, 0.264], [0.31, 0.276], [0.24, 0.266], [0.17, 0.278]]), { fill: '#7c7472', shadow: '#2e2828', shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  f.part(hF([[0.18, 0.29], [0.24, 0.288], [0.302, 0.29], [0.29, 0.31], [0.24, 0.316], [0.19, 0.306]]), { fill: '#887e7a', shadow: '#2e2828', shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  for (const [x, y] of [[0.19, 0.3], [0.215, 0.302], [0.245, 0.304], [0.27, 0.302], [0.29, 0.3], [0.2, 0.268], [0.235, 0.26], [0.27, 0.262], [0.3, 0.266]]) f.line(hF([[x, y], [x + 0.004, y + 0.014]]), 1.1, INK, { op: 0.75 }); // the splits
  f.line(hF([[0.2, 0.312], [0.27, 0.316]]), 1.6, P.hoar, { op: 0.6 });
  // the nose: bone ridge, a pinched tip whitened by frost, the nostril dark, its cast shadow on the lip
  f.line(hF([[0.305, -0.06], [0.33, 0.0], [0.37, 0.08]]), 2.6, skinL, { op: 0.6 }); f.line(hF([[0.324, -0.02], [0.334, 0.0]]), 2, '#1e1c18', { op: 0.5 });
  f.flat(hF(ell([0.375, 0.115], 0.02, 0.015, 0.4, 8)), P.frost, { op: 0.5 }); f.flat(hF([[0.27, 0.1], [0.33, 0.13], [0.36, 0.165], [0.3, 0.165], [0.26, 0.14]]), '#1a1814', { op: 0.3 });
  f.flat(hF([[0.27, 0.168], [0.33, 0.172], [0.34, 0.2], [0.29, 0.21]]), '#1a1814', { op: 0.35 });
  // the beard: a mass under the jaw, then long locks frozen into clumps hanging plumb down the chest, some grown through
  // with grey-green mould, icicles at the tips
  const lock = (q, l, w, sw, BC, i) => {
    const pts = [add(q, [0, -40]), add(q, [sw, l * 0.25]), add(q, [-sw * 0.7, l * 0.5]), add(q, [sw * 0.5, l * 0.76]), add(q, [-sw * 0.2, l])];
    f.part(X.tube(pts, [w, w * 0.9, w * 0.74, w * 0.5, w * 0.16], 1.6), BC);
    const C2 = X.spline(pts, 6);
    for (let k = 0; k < 5; k++) { const o = (k - 2) / 2; f.line(X.offsetLine(C2, t => o * w * 0.4 * (1 - t * 0.85)), 1.1, k % 2 ? '#2e302a' : '#e4e6dc', { op: k % 2 ? 0.55 : 0.35 }); }
    f.line(X.offsetLine(C2, t => -w * 0.42 * (1 - t)).slice(1, -2), 2.4, '#1c1d19', { op: 0.5 }); // the shadowed side of the lock
    FX.icicle(add(pts[4], [0, -4]), 16 + (i % 3) * 12, 7);
    return pts;
  };
  [[-0.16, 0.48, 160, 40, 8], [0.0, 0.62, 250, 46, -10], [0.14, 0.66, 290, 50, 12], [0.27, 0.56, 200, 40, -8], [0.07, 0.54, 230, 38, 6]].forEach(([u, v, l, w, sw], i) => lock(hF([[u, v]])[0], l, w, sw, { fill: i === 2 ? mix('#6e7066', P.mould, 0.5) : '#6e7066', shadow: '#22231f', shade: 0.42, tex: 'fur' + seed, texOp: 0.8, maxShade: 16, inkW: 1.4, inkHeavy: 2 }, i));
  [[-0.1, 0.56, 190, 34, -6], [0.05, 0.66, 270, 40, 8], [0.2, 0.62, 236, 38, -10], [0.32, 0.48, 140, 30, 6]].forEach(([u, v, l, w, sw], i) => { const pts = lock(hF([[u, v]])[0], l, w, sw, { fill: i === 1 ? mix('#9c9e92', P.mould, 0.45) : '#9c9e92', shadow: '#2a2b26', shade: 0.42, tex: 'fur' + seed, texOp: 0.7, maxShade: 14, inkW: 1.5, inkHeavy: 2.2 }, i + 5); if (i === 1) X.mould(f, lerp(pts[1], pts[2], 0.5), 18, 26, { rings: 1 }); });
  f.part(hF([[-0.22, 0.22], [-0.06, 0.36], [0.1, 0.33], [0.18, 0.33], [0.34, 0.33], [0.36, 0.46], [0.3, 0.6], [0.2, 0.56], [0.1, 0.64], [0.0, 0.58], [-0.12, 0.64], [-0.24, 0.5]]), { fill: '#7c7e72', shadow: '#2c2d28', tex: 'fur' + seed, texOp: 0.9, shade: 0.42, maxShade: 20 });
  for (let i = 0; i < 9; i++) { const q = hF([[-0.18 + i * 0.06, 0.4 + (i % 3) * 0.04]])[0]; f.line([q, add(q, [2, 30]), add(q, [-1, 54])], 1.4, i % 2 ? '#2e302a' : '#c8cabe', { op: 0.55 }); }
  f.part(hF([[0.15, 0.232], [0.24, 0.206], [0.33, 0.214], [0.356, 0.25], [0.33, 0.29], [0.3, 0.262], [0.24, 0.252], [0.17, 0.29], [0.13, 0.27]]), { fill: '#9a9c90', shadow: '#2c2d28', shade: 0.4, inkW: 1.2, tex: 'fur' + seed, texOp: 0.7 }); // the moustache, drooping past the corners
  for (const [u, l] of [[0.16, 30], [0.335, 24]]) { const q = hF([[u, 0.27]])[0]; X.hairClump(f, [q, add(q, [u < 0.2 ? -3 : 3, l * 0.6]), add(q, [u < 0.2 ? -2 : 4, l])], 13, { pal: ['#7e8076', '#5e6058'], n: 3 }); }
  X.mould(f, hF([[0.08, 0.6]])[0], 30, 20, { rings: 2, op: 0.75 }); X.fungalFur(f, hF([[-0.2, 0.7], [0.08, 0.82], [0.3, 0.7]]), 10, 1);
  FX.rime(hF([[-0.22, 0.24], [-0.24, 0.48], [-0.16, 0.68]]), 7, -1);
  // the crown: a band of tarnished iron seen from a little below, tall points riveted on, one bent, one snapped
  const band = []; for (let t = 0; t <= 1.0001; t += 0.1) band.push(hF([[-0.46 + t * 0.88, -0.36 + Math.sin(t * Math.PI) * 0.05 - t * 0.04]])[0]);
  const bandT = band.map(q => add(q, rot([0, -0.13 * H], hA)));
  f.part([...bandT, ...band.slice().reverse()], { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, maxShade: 20, inkW: 2 });
  f.line(band.slice(1, -1).map(q => add(q, rot([0, -6], hA))), 2.4, P.ironL, { op: 0.6 });
  [[0.05, 0.85, 0.12, 0], [0.27, 1.0, 0.14, 0.1], [0.5, 1.12, 0.16, 0], [0.72, 0.96, 0.15, -0.35], [0.93, 0.5, 0.11, 0]].forEach(([t, hgt, w, bend], i) => {
    const b0 = bandT[Math.round(t * 10)], up = rot([0, -1], hA + bend), sd = rot([1, 0], hA), tip = add(b0, mul(up, hgt * 0.32 * H));
    const pt = i === 4 ? [add(b0, mul(sd, -w * H * 0.5)), add(b0, mul(sd, w * H * 0.5)), add(add(b0, mul(sd, w * H * 0.3)), mul(up, 0.12 * H)), [...add(add(b0, mul(sd, 0)), mul(up, 0.15 * H)), 1], add(add(b0, mul(sd, -w * H * 0.3)), mul(up, 0.1 * H))] : [add(b0, mul(sd, -w * H * 0.5)), add(b0, mul(sd, w * H * 0.5)), add(lerp(b0, tip, 0.55), mul(sd, w * H * 0.16)), [...tip, 1], add(lerp(b0, tip, 0.55), mul(sd, -w * H * 0.16))];
    f.part(pt, { fill: i === 2 ? P.ironL : P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, maxShade: 14, inkW: 1.8, cast: true });
    f.rivet(add(b0, mul(up, 0.05 * H)), 6, P.ironL);
    f.flat(ell(add(b0, mul(up, 0.1 * H)), 0.03 * H, 0.05 * H, hA, 8), P.rust, { op: 0.55 });
    if (i < 4) FX.rime([add(b0, mul(sd, -w * H * 0.46)), add(lerp(b0, tip, 0.6), mul(sd, -w * H * 0.14)), tip], 5, 1);
  });
  for (const t of [0.15, 0.4, 0.62, 0.84]) f.rivet(lerp(band[Math.round(t * 10)], bandT[Math.round(t * 10)], 0.5), 6, P.ironL);
  FX.rime(bandT.slice(0, 6), 8, 1); X.mould(f, lerp(band[3], bandT[3], 0.5), 12, 8, { rings: 1 });
  f.flat(hF([[-0.44, -0.34], [0.4, -0.38], [0.36, -0.3], [0.0, -0.28], [-0.4, -0.28]]), '#121210', { op: 0.35 }); // the band's shadow on the brow
  // the silver burial mask: slipped off the face, hanging on one cord below the near ear, turned so we see its hollow back
  f.bone('mask');
  { // it hangs face-out, tilted, the beaten silver dented and tarnished black in its recesses, the eye and mouth slits empty
    const top = hF([[-0.2, 0.12]])[0], mc = add(top, [-26, 150]), M = frame(mc, 0.26, H * 0.36);
    f.line([hF([[-0.1, -0.3]])[0], hF([[-0.26, -0.06]])[0], top, M([[-0.3, -0.6]])[0]], 4, P.leatherD); f.line([M([[0.34, -0.5]])[0], add(top, [34, 24])], 3, P.leatherD, { op: 0.8 });
    const ms = M([[-0.34, -0.62], [0.0, -0.74], [0.34, -0.6], [0.42, -0.2], [0.38, 0.2], [0.26, 0.52], [0.08, 0.7], [-0.1, 0.7], [-0.28, 0.52], [-0.4, 0.2], [-0.42, -0.2]]);
    const mD = f.part(ms, { fill: P.silver, shadow: P.silverD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, maxShade: 16, inkW: 2 });
    X.clipDraw(f, mD, () => {
      X.stains(f, mD, [mc[0] - 120, mc[1] - 160, mc[0] + 120, mc[1] + 160], '#1e2220', 0.05, 3, -1.6, 101, 0.6); // tarnish
      for (const s2 of [-1, 1]) { f.stroke(M([[s2 * 0.34, -0.3], [s2 * 0.18, -0.38], [s2 * 0.04, -0.32]]), 9, P.silverL, { op: 0.6 }); f.flat(M([[s2 * 0.3, -0.22], [s2 * 0.08, -0.26], [s2 * 0.06, -0.19], [s2 * 0.28, -0.16]]), '#121412'); } // brows and the empty eye slits
      f.part(M([[-0.05, -0.3], [0.05, -0.3], [0.1, 0.1], [0.02, 0.16], [-0.08, 0.1]]), { fill: P.silverL, shadow: P.silverD, shade: 0.4, inkW: 1.2, cast: false }); // the beaten nose
      f.flat(M([[-0.16, 0.36], [0.16, 0.34], [0.14, 0.39], [-0.14, 0.41]]), '#121412'); // the mouth slit
      X.crease(f, M([[0.2, 0.0], [0.28, 0.16], [0.24, 0.3]]), 2.4, { col: '#1a1c1a', lit: P.silverL }); // a dent
      f.scratches(M([[0.2, 0.3]])[0], 20, 5, P.silverL);
    });
    for (const u of [-0.36, 0.36]) f.rivet(M([[u, -0.5]])[0], 5, P.silver); // the cord holes
    X.mould(f, M([[-0.2, 0.5]])[0], 16, 12, { rings: 1 }); FX.rime(M([[-0.42, -0.2], [-0.34, -0.62], [0.0, -0.74]]), 6, 1); }
  // the breath of frozen spores leaving the parted lips
  f.bone('breath');
  FX.breath(hF([[0.36, 0.3]])[0], [1, 0.22], 170, 120, 16);

  // ================= the sword across the knees: a long blade with a fuller, a straight guard, a lobed pommel
  f.bone('sword');
  const blade = [lp(swG, swT, 0, 30), lp(swG, swT, 0.86, 24), [...swT, 1], lp(swG, swT, 0.86, -24), lp(swG, swT, 0, -30)];
  const blD = f.part(blade, { fill: '#8e958f', shadow: '#2c302d', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 20, inkW: 2 });
  X.clipDraw(f, blD, () => {
    f.line([lp(swG, swT, 0.02, 0), lp(swG, swT, 0.8, 0)], 10, '#4a504b', { op: 0.75 }); f.line([lp(swG, swT, 0.02, -4), lp(swG, swT, 0.8, -3)], 2, '#c8cec6', { op: 0.5 }); // the fuller
    f.line([lp(swG, swT, 0.02, -28), lp(swG, swT, 0.96, -10)], 3, '#d4dad2', { op: 0.6 }); // the edge, honed bright
    for (const t of [0.22, 0.48, 0.7]) f.flat(jit(ell(lp(swG, swT, t, 10), 40, 14, swA, 10), 6), P.rust, { op: 0.55 });
    X.stains(f, blD, [swG[0], swG[1] - 40, swT[0], swT[1] + 40], P.mouldD, 0.05, 3, -2, 93, 0.5);
  });
  for (const t of [0.34, 0.58]) f.flat([lp(swG, swT, t, 30), lp(swG, swT, t + 0.012, 30), lp(swG, swT, t + 0.006, 20)], '#161816'); // nicks in the edge
  FX.rime([lp(swG, swT, 0.05, -30), lp(swG, swT, 0.5, -28), lp(swG, swT, 0.9, -20)], 7, 1);
  FX.icicles([lp(swG, swT, 0.35, 30), lp(swG, swT, 0.75, 26)], 4, 34, 7);
  const grd = [lp(swG, swT, -0.02, 110), lp(swG, swT, 0.02, 116), lp(swG, swT, 0.025, -116), lp(swG, swT, -0.015, -110), lp(swG, swT, -0.035, -96), lp(swG, swT, -0.03, 96)];
  f.part(grd, { fill: P.iron, shadow: P.ironD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2 });
  for (const s2 of [1, -1]) f.part(ell(lp(swG, swT, 0.0, s2 * 118), 16, 18, swA, 10), { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.6, cast: false }); // the guard's knobbed ends
  f.part(limb(swP, swG, 50, 46, { steps: 6 }), { fill: P.leatherD, shade: 0.4, inkW: 1.6, maxShade: 10 });
  for (let i = 1; i < 9; i++) f.line([lp(swP, swG, i / 9, -24), lp(swP, swG, i / 9 + 0.04, 24)], 1.6, P.silverD, { op: 0.8 }); // the wire wrap
  const pm = add(swP, mul(swD, -10)), PM = frame(pm, swA, 1);
  f.part(PM([[-40, -44], [-16, -50], [6, -36], [10, 0], [6, 36], [-16, 50], [-40, 44], [-52, 24], [-46, 0], [-52, -24]]), { fill: P.iron, shadow: P.ironD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.8, maxShade: 14 }); // the lobed pommel
  for (const v of [-22, 22]) f.line(PM([[-44, v], [-4, v * 0.8]]), 2, INK, { op: 0.6 });
  f.flat(PM(ell([-26, 0], 10, 12, 0, 8)), P.rust, { op: 0.5 });

  // ================= far forearm, down from the elbow onto the blade, and the hand lying over it with the Tooth
  f.bone('forearm_f');
  const faF = K.chain([add(EF, mul(E.norm(sub(EF, WF)), 30)), lerp(EF, WF, 0.34), lerp(EF, WF, 0.8), add(WF, mul(E.norm(sub(WF, EF)), 16))], [128, 124, 84, 72], { bp: [[0, 0.5, 0.12, 0.3]], bq: [[0, 0.6, 0.1, 0.3]] });
  const ffD = f.part(faF, SKK({ maxShade: 24 }));
  X.clipDraw(f, ffD, () => {
    soft(ffD, [[[lp(EF, WF, 0, -80), lp(EF, WF, 1, -60), lp(EF, WF, 1, -8), lp(EF, WF, 0, -16)], '#000', 0.55, 12], [[lp(EF, WF, 0.1, 10), lp(EF, WF, 0.45, 20), lp(EF, WF, 0.45, 56), lp(EF, WF, 0.1, 56)], '#ffffff', 0.2, 10]]);
    f.flat(ell(lp(EF, WF, 0.95, 30), 12, 9, 0, 8), skinL, { op: 0.6 }); f.line(ell(lp(EF, WF, 0.95, 30), 13, 10, 0, 8).slice(4, 8), 1.4, '#24221d', { op: 0.6 }); // the wrist bone
    f.line([lp(EF, WF, 0.08, 46), lp(EF, WF, 0.5, 40), lp(EF, WF, 0.92, 30)], 3, skinL, { op: 0.55 }); // the ulna's edge under the skin
    for (const o of [-16, 4, 22]) X.crease(f, [lp(EF, WF, 0.55, o), lp(EF, WF, 0.75, o * 0.8), lp(EF, WF, 0.96, o * 0.6)], 2.6, { col: '#24221d', lit: skinL, op: 0.6 }); // tendons running into the wrist
    X.livid(f, lerp(EF, WF, 0.4), 40, 30, 6, 1.6); X.peel(f, lerp(EF, WF, 0.25), 3, 1.6, 40);
    for (let i = 0; i < 4; i++) f.line([lp(EF, WF, 0.98, -24 + i * 14), lp(EF, WF, 0.8, -30 + i * 16), lp(EF, WF, 0.6, -34 + i * 18)], 3 - i * 0.4, '#2c3028', { op: 0.6 }); // rot rising from the ring
  });
  f.part(plate(EF, WF, 0.78, 0.86, 96, 92, { bow: 3 }), { fill: P.silver, shadow: P.silverD, tex: 'mottle' + seed, texOp: 0.55, shade: 0.42, inkW: 1.6 }); // a twisted silver arm ring
  for (let i = 0; i < 5; i++) f.line([lp(EF, WF, 0.785 + i * 0.014, -44), lp(EF, WF, 0.8 + i * 0.014, 44)], 1.2, INK, { op: 0.55 });
  FX.rime([lp(EF, WF, 0.05, 66), lp(EF, WF, 0.5, 60), lp(EF, WF, 0.9, 46)], 8, 1);
  f.bone('hand_f');
  const hAng = ang(EF, WF) - 0.18;
  const hf = X.openHand(f, WF, hAng, 270, { look: SKK({ maxShade: 10 }), back: true, spread: 0.08, curl: 0.7, curls: [0.8, 0.7, 0.66, 0.6], swell: 0.08, nail: '#5c5a52' });
  { // the signet on the ring finger: a heavy silver bezel holding the Tooth, a long pale fang; the finger rotted black past it
    const g = hf.fing[1], rp = lerp(g.k0, g.k1, 0.45), dA = ang(g.k0, g.k1);
    f.part(X.tube([lerp(g.k0, g.k1, 0.62), g.k1, g.k2, g.k3], [g.W * 1.02, g.W * 0.96, g.W * 0.86, g.W * 0.76]), { fill: '#2a2626', shadow: '#0c0a0a', shade: 0.4, inkW: 1.4, inkHeavy: 2, cast: false, tex: 'mottle' + seed, texOp: 0.5 });
    f.line([lerp(g.k1, g.k2, 0.1), lerp(g.k2, g.k3, 0.8)], 1.6, '#6c6262', { op: 0.6 });
    f.part(plate(g.k0, g.k1, 0.32, 0.56, g.W * 1.22, g.W * 1.22), { fill: P.silverD, shadow: '#1e2220', shade: 0.42, inkW: 1.6, cast: false });
    const bz = ell(rp, 34, 28, dA, 14);
    f.part(bz, { fill: P.silver, shadow: P.silverD, shade: 0.42, inkW: 2, tex: 'mottle' + seed, texOp: 0.5 });
    const T0 = frame(rp, dA, 1);
    f.part(T0([[-34, -12], [-6, -18], [30, -15], [66, -4, 1], [30, 8], [-6, 15], [-34, 12]]), { fill: '#e2ddcc', shadow: '#8a8478', shade: 0.4, inkW: 2, inkHeavy: 2.6, cast: false, tex: 'mottle' + seed, texOp: 0.35 }); // The Tooth
    f.line(T0([[-26, -2], [52, -2]]), 1.4, INK, { op: 0.55 }); f.line(T0([[-24, -9], [26, -11]]), 2.4, '#ffffff', { op: 0.7 }); for (const u of [-14, 8, 30]) f.line(T0([[u, -12], [u + 2, 10]]), 1, '#8a8478', { op: 0.6 }); // growth lines across the fang
    for (const s2 of [-1, 1]) for (const u of [-20, 4]) f.part(T0([[u, s2 * 10], [u + 10, s2 * 10], [u + 8, s2 * 18], [u - 2, s2 * 18]]), { fill: P.silverD, shade: 0.3, inkW: 1, cast: false }); // the claws of the bezel
    X.pustules(f, lerp(g.k1, g.k2, 0.5), 10, 8, 3, 2.6, 4);
    FX.rime([add(rp, rot([-30, -26], dA)), add(rp, rot([10, -30], dA))], 4, 1);
  }
  { const g = hf.fing[3]; f.part(plate(g.k0, g.k1, 0.36, 0.56, g.W * 1.2, g.W * 1.2), { fill: P.ironL, shadow: P.ironD, shade: 0.42, inkW: 1.4, cast: false }); } // an iron ring on the forefinger
  for (const g of hf.fing) FX.icicle(add(g.k3, [0, 4]), 12 + f.r() * 12, 5);
  FX.frost(add(WF, [10, 40]), 50, 30, 10);

  // ================= near forearm from the elbow on the rail to the fist on the grip
  f.bone('forearm_n');
  const faN = K.chain([add(EN, mul(E.norm(sub(EN, WN)), 30)), lerp(EN, WN, 0.34), lerp(EN, WN, 0.8), add(WN, mul(E.norm(sub(WN, EN)), 10))], [132, 126, 86, 74], { bp: [[0, 0.5, 0.12, 0.3]], bq: [[0, 0.6, 0.1, 0.3]] });
  const fnD = f.part(faN, SKK({ maxShade: 24 }));
  X.clipDraw(f, fnD, () => {
    soft(fnD, [[[lp(EN, WN, 0, 80), lp(EN, WN, 1, 60), lp(EN, WN, 1, 8), lp(EN, WN, 0, 16)], '#000', 0.5, 12], [[lp(EN, WN, 0.1, -10), lp(EN, WN, 0.45, -20), lp(EN, WN, 0.45, -56), lp(EN, WN, 0.1, -56)], '#ffffff', 0.2, 10]]);
    f.flat(ell(lp(EN, WN, 0.95, -30), 12, 9, 0, 8), skinL, { op: 0.6 });
    f.line([lp(EN, WN, 0.08, -46), lp(EN, WN, 0.5, -40), lp(EN, WN, 0.92, -30)], 3, skinL, { op: 0.55 });
    for (const o of [-18, 2, 20]) X.crease(f, [lp(EN, WN, 0.55, o), lp(EN, WN, 0.75, o * 0.8), lp(EN, WN, 0.96, o * 0.6)], 2.6, { col: '#24221d', lit: skinL, op: 0.6 });
    X.veins(f, lerp(EN, WN, 0.45), 40, 30, 4, 1.6); X.livid(f, lerp(EN, WN, 0.5), 40, 30, 6, 1.6); X.sore(f, lp(EN, WN, 0.4, 20), 11);
  });
  f.part(plate(EN, WN, 0.76, 0.84, 98, 94, { bow: 3 }), { fill: P.silver, shadow: P.silverD, tex: 'mottle' + seed, texOp: 0.55, shade: 0.42, inkW: 1.6 });
  for (let i = 0; i < 5; i++) f.line([lp(EN, WN, 0.765 + i * 0.014, -44), lp(EN, WN, 0.78 + i * 0.014, 44)], 1.2, INK, { op: 0.55 });
  FX.rime([lp(EN, WN, 0.05, -66), lp(EN, WN, 0.5, -60), lp(EN, WN, 0.9, -46)], 8, -1);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, swA, 100, skinC, { shadow: skinS, tex: 'mottle' + seed, texOp: 0.6, name: 'king sword' });
  X.fistDetail(f, gN, 100, skinC, { nail: '#5c5a52' });
  for (const q of gN.F([[0.46, -0.45], [0.48, 0.15]])) { f.part(ell(q, 13, 22, gN.ang, 10), { fill: P.silverD, shadow: '#1e2220', shade: 0.4, inkW: 1.4, cast: false }); f.flat(ell(add(q, [3, -6]), 3, 5, gN.ang, 6), P.silverL, { op: 0.7 }); } // rings on the fingers round the grip
  FX.rime(gN.F([[-0.6, -0.6], [0.0, -0.7], [0.4, -0.66]]), 6, 1);

  // ================= the dais step in front of his shins, and the grave goods set round the throne
  f.bone('throne');
  const dais = [[0, 1536], [400, 1528], [820, 1534], [1200, 1524], [1600, 1532], [1600, 1600], [0, 1600]];
  const daD = f.part(dais, STONE({ fill: '#868c83', maxShade: 40 }));
  X.clipDraw(f, daD, () => { for (const x of [300, 700, 1100, 1450]) groove([[x, 1532], [x + 6, 1600]], 4); f.line([[0, 1546], [1600, 1542]], 3, stoneL, { op: 0.5 }); X.mould(f, [500, 1580], 60, 14, { rings: 2 }); X.mould(f, [1250, 1586], 40, 10, { rings: 1 }); });
  FX.rime([[0, 1536], [400, 1528], [820, 1534], [1200, 1524]], 10, 1);
  // a round shield leaning on the near post, an iron-bound chest, an urn of grave food frost-split, coin spilled
  { const c = [96, 1356]; const sh = jit(ell(c, 118, 168, 0.1, 26), 6); f.part(sh, { fill: P.wood, shadow: P.woodD, tex: 'wood' + seed, texOp: 0.7, maxShade: 50 }); X.clipDraw(f, E.smooth(sh), () => { for (let i = -2; i <= 2; i++) f.line([add(c, [i * 44, -170]), add(c, [i * 44, 170])], 1.6, INK, { op: 0.5 }); X.stains(f, E.smooth(sh), [-30, 1180, 220, 1530], P.mouldD, 0.04, 3, -1.6, 97, 0.6); }); f.line(sh.concat([sh[0]]), 7, P.ironD); f.part(ell(c, 30, 40, 0.1, 16), { fill: P.iron, shadow: P.ironD, shade: 0.45, inkW: 1.6 }); FX.rime(sh.slice(14, 22), 9, 1); }
  { const c = [302, 1512]; f.part([add(c, [-46, -130]), add(c, [46, -130]), add(c, [76, -64]), add(c, [66, 0]), add(c, [40, 30]), add(c, [-40, 30]), add(c, [-66, 0]), add(c, [-76, -64])], { fill: '#6a6c60', shadow: P.stoneD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.7, maxShade: 30 }); f.part([add(c, [-52, -150]), add(c, [52, -150]), add(c, [46, -128]), add(c, [-46, -128])], { fill: '#7a7c70', shade: 0.4, inkW: 1.4 }); f.line([add(c, [10, -128]), add(c, [0, -60]), add(c, [16, 0])], 2.4, INK, { op: 0.8 }); for (let i = 0; i < 3; i++) groove([add(c, [-60, -90 + i * 26]), add(c, [60, -90 + i * 26])], 2, 0.5); FX.rime([add(c, [-76, -64]), add(c, [-52, -150]), add(c, [52, -150])], 8, 1); X.mould(f, add(c, [30, -40]), 20, 16, { rings: 1 }); }
  for (let i = 0; i < 18; i++) { const q = [180 + f.r() * 380 + (i > 11 ? 760 : 0), 1548 + f.r() * 36]; f.part(ell(q, 11, 5, (f.r() - 0.5) * 0.4, 10), { fill: P.silver, shadow: P.silverD, shade: 0.3, inkW: 1, cast: false }); }
  FX.frost([800, 1560], 700, 20, 40);
  return f;
}

module.exports = {
  heroes: [
    { key: 'barrow_king', name: 'The Barrow King', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: barrowKing },
    { key: 'barrow_thane', name: 'Barrow Thane', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: barrowThane },
    { key: 'rot_witch', name: 'Rot Witch', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: rotWitch },
    { key: 'barrow_draugr', name: 'Barrow Draugr', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: draugr },
    { key: 'frostbitten_leper', name: 'Frostbitten Leper', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: leper },
    { key: 'mould_wight', name: 'Mould Wight', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: mouldWight },
    { key: 'plague_wolf', name: 'Plague Wolf', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: plagueWolf },
    { key: 'grave_worm', name: 'Grave Worm', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: graveWorm },
  ],
};
