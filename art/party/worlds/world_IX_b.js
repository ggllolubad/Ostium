// World IX, The Hollow Barrow (Frost + Toxin, cryo-rot), second batch (IX_b). Eleven figures in bible order, seeds 920
// to 930: The Rat King, The Dead-Cart (rulers), Barrow Chaplain, Pest-House Watchman (elites), Gravedigger, The Swollen,
// Court Fool, The King's Hawk, Sexton Beetles, Barrow Mason, Rat-Catcher (cast).
// The first batch (world_IX.js, kit_IX.js) is required, never edited: same palette, the same course marks (frost
// dominant: rime in the hollows and on the windward back, icicles hanging plumb, bodies stilled mid-gesture; toxin:
// grey-green mould, plague sores and buboes, fungal fur, grave caps, spores; never clean crystals, slime or glow) and the
// same finish (Living Ink via kit.foeBase, ink-modelled grey dead skin, faces at faceShade about 0.78).
// Foes face left: every figure is drawn facing right with kit.foeBase and flipped. Windward = drawing -x.
// Built for the rig from the start: joints first, f.bone() before every part, parts drawn whole, overlaps at the joints.
'use strict';
const K = require('../kit');
const X = require('./kit_IX_b');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang, R, angLerp } = X;
const deg = d => d * Math.PI / 180;

// ------------------------------------------------------------------ GRAVEDIGGER (cast, human 1.0)
// The household's gravedigger, who buried the first plague dead inside the barrow and has not stopped digging. A
// stringy old labourer with long arms and a stoop, leaning his weight hard over a long-handled spade: both hands on the
// shaft, the near foot up on the blade's shoulder driving it into frozen earth, the far leg braced behind.
// Remnant of the trade: the iron-shod wooden spade with a notch cut in the handle for every grave, a mattock slung on
// the back, a coil of lowering rope, a lime sack. The one mark pushed hard is toxin's: pale grave caps and mould fruiting
// in a crop from his shoulders and back where grave earth has stuck to him. Frost greys him and rimes the hollows.
// Rig: standard humanoid + spade (parent hand_f) + mattock, rope (torso) + sack, skirt (pelvis).
// Motion: idle a slow scoop of frozen earth over the shoulder; attack a chop with the spade's edge.
function gravedigger() {
  const [CW, CH] = TIERS.human, seed = 924;
  const f = new Fig(X.base(seed, CH, { grimeY: 560 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 98, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, o);
  const WOOL = (o = {}) => Object.assign({ fill: mix(P.wool, P.mould, 0.12), shadow: '#20211b', tex: 'weave' + seed, texOp: 0.5, shade: 0.4, maxShade: 22 }, o);
  const HOSE = (o = {}) => Object.assign({ fill: mix(P.woolD, P.earth, 0.3), shadow: '#161712', tex: 'weave' + seed, texOp: 0.45, shade: 0.4 }, o);
  const N = [384, 338], C = [318, 372], Pv = [282, 486];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.15), SF = S.at(0.12, 0.1);
  const spB = [452, 700], spT = add(spB, mul(E.norm([0.11, -1]), 480)), spA = ang(spB, spT); // the spade: tread (blade shoulder) to the top of the shaft
  const at = t => lerp(spB, spT, t);
  const WF = at(0.6), WN = at(0.37);                                          // both hands on the shaft, far hand higher
  const EF = X.ik(SF, WF, 126, 110, 1)[0], EN = X.ik(SN, WN, 128, 112, 1)[0];   // long arms, elbows dropped under the shoulders
  const HN = [288, 478], AN = [436, 668], KN = X.ik(HN, AN, 150, 130, -1)[0];  // near leg up, the foot on the tread
  const HF = [304, 472], KF = [262, 620], AF = [226, 748];                    // far leg braced behind, the weight on it
  const neck0 = S.at(0.2, -0.04), HC = [430, 298], hA = 0.42;
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('spade', WF, 'hand_f').joint('mattock', S.at(-0.4, 0.2), 'torso').joint('rope', S.at(0.1, 0.1), 'torso').joint('sack', S.at(-0.2, 0.92), 'pelvis').joint('skirt', S.at(0, 0.82), 'pelvis');

  // ---- the mattock slung across the back on a cord: ash helve, iron head with a pick and an adze, behind everything
  f.bone('mattock');
  { const m0 = S.at(-0.5, -0.16), m1 = S.at(-1.0, 0.78), dh = E.norm(sub(m1, m0)), nh = [-dh[1], dh[0]];
    f.part(limb(m0, add(m1, mul(dh, 16)), 15, 13, { steps: 8 }), { fill: mix(P.wood, P.woodL, 0.2), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.7, maxShade: 6 });
    // the head: a long iron bar across the helve, a pick point one way and a flared adze blade the other, an eye round the helve
    const hd = m1, PK = (u, v) => add(add(hd, mul(nh, u)), mul(dh, v));
    f.part([PK(-12, -10), PK(12, -12), PK(13, 12), PK(-12, 13)], { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.3, cast: false });
    f.part([PK(10, -8), PK(60, -4), [...PK(104, 4), 1], PK(58, 8), PK(10, 9)], { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.4, inkW: 1.4 }); // the pick, upward
    f.part([PK(-10, -8), PK(-50, -10), PK(-78, -20), [...PK(-86, -6), 1], [...PK(-86, 12), 1], PK(-50, 9), PK(-10, 9)], { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.4, inkW: 1.4 }); // the adze, down along the back
    f.line([PK(-84, -4), PK(-84, 10)], 2, P.ironL, { op: 0.7 });
    f.flat(ell(PK(40, 0), 12, 4, ang(m0, m1) + Math.PI / 2, 8), mix(P.ironD, P.mouldD, 0.35), { op: 0.6 });
    FX.rime([PK(14, -12), PK(60, -6), PK(100, 2)], 4, 1);
    X.rope(f, [S.at(0.0, 0.08), lerp(m0, m1, 0.2), S.at(-0.3, 0.3)], 3, P.linenD); X.rope(f, [lerp(m0, m1, 0.7), S.at(-0.5, 0.8)], 3, P.linenD); }

  // ---- far arm (behind the shaft): the sleeve torn off at the elbow, a long stringy forearm, the fist high on the shaft
  X.arm(f, SF, EF, WF, '_f', { ws: [40, 32, 26], skin: SKd({ fill: mix(P.skin, P.skinD, 0.25) }), sleeve: { look: WOOL({ fill: mix(P.wool, '#000', 0.12) }), to: 1.08, rag: 9, teeth: 6 } });
  f.bone('forearm_f');
  for (const o of [-8, 4]) f.line([lp(EF, WF, 0.15, o), lp(EF, WF, 0.85, o * 0.6)], 1.6, '#2e2c28', { op: 0.5 }); // tendons
  X.livid(f, lerp(EF, WF, 0.5), 12, 8, 3);

  // ---- far leg: earth-caked hose tied below the knee with twine, a rotted shoe caked with frozen clods
  X.leg(f, FX, HF, KF, AF, '_f', { ws: [54, 38, 28], look: HOSE({ fill: mix(P.woolD, '#000', 0.15) }), garter: P.linenD, foot: 'shoe', fs: 44, clods: 5, shoe: mix(P.leather, P.earth, 0.4), dirt: 0.5 });

  // ---- the spade: an iron-shod wooden blade in the frozen earth, a long ash shaft notched for every grave
  f.bone('spade');
  { const dS = E.norm(sub(spT, spB)), nS = [-dS[1], dS[0]];
    // the blade: a long narrow board seen three-quarter on, its face toward him, the thickness on the near edge, curved
    // shoulders for the tread, an iron shoe riveted over the cutting edge where it goes into the frozen earth
    const tl = [spB[0] - 30, spB[1] + 4], tr = [spB[0] + 22, spB[1] + 2], bl = [spB[0] - 26, gy + 2], br = [spB[0] + 16, gy + 2];
    const face = [[spB[0] - 6, spB[1] - 8], [tr[0] - 4, tr[1] - 6], [...tr, 1], [br[0], br[1], 1], [bl[0], bl[1], 1], [...tl, 1], [tl[0] + 6, tl[1] - 8]];
    const fD = f.part(face, { fill: mix(P.wood, P.woodL, 0.45), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.6, shade: 0.4, maxShade: 8, inkW: 1.6 });
    X.stains(f, fD, [tl[0] - 10, spB[1] - 20, tr[0] + 20, gy + 10], P.earth, 0.06, 3, -1.0, 21, 0.85);
    f.part([[...tr, 1], [tr[0] + 8, tr[1] + 2, 1], [br[0] + 7, br[1], 1], [br[0], br[1], 1]], { fill: P.woodD, shade: 0.3, inkW: 1.2, cast: false }); // the blade's thickness
    f.part([[bl[0] - 1, gy - 26, 1], [br[0] + 7, gy - 26, 1], [br[0] + 7, gy + 2, 1], [bl[0] - 1, gy + 2, 1]], { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.4, inkW: 1.4, cast: false }); // the iron shoe on the cut
    for (const x of [-16, 0, 12]) f.rivet([spB[0] + x - 4, gy - 16], 2.4, P.ironL);
    f.flat(ell([spB[0] - 4, gy - 8], 12, 3, 0, 8), mix(P.ironD, P.mouldD, 0.35), { op: 0.6 });
    f.line([[tl[0] + 4, spB[1] + 10], [tr[0] - 2, spB[1] + 8]], 1.4, '#e0dccc', { op: 0.45 }); // the tread worn bright
    // the shaft
    f.part(limb(spB, spT, 20, 17, { steps: 10 }), { fill: mix(P.wood, P.woodL, 0.3), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.7, maxShade: 6 });
    f.line([lp(spB, spT, 0.02, 6), lp(spB, spT, 0.98, 5)], 1.4, '#a8a290', { op: 0.5 }); // worn bright by the hands
    f.part(plate(spB, spT, -0.02, 0.06, 26, 24), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.1, cast: false }); // the iron strap where shaft meets blade
    // a notch cut in the handle for every grave, too many to count, running up the shaft
    for (let i = 0; i < 34; i++) { const t = 0.08 + i * 0.024 + (i % 5 === 4 ? 0.006 : 0); if (t > 0.3 && t < 0.42) continue; if (t > 0.55 && t < 0.66) continue; f.line([lp(spB, spT, t, -9), lp(spB, spT, t + 0.004, 2)], i % 5 === 4 ? 2 : 1.4, '#1c1a14', { op: 0.85 }); }
    FX.rime([lp(spB, spT, 0.66, -10), lp(spB, spT, 0.86, -10), lp(spB, spT, 0.99, -9)], 4, 1);
    FX.icicle(lp(spB, spT, 0.99, -2), 10, 4);
    // frozen earth thrown up round the blade
    for (let i = 0; i < 9; i++) { const q = [spB[0] + R(f, -70, 60), gy - R(f, 0, 6)], rr = R(f, 5, 10); f.part(ell(q, rr * 1.8, rr * 0.75, R(f, -0.3, 0.3), 8).map(p => add(p, [R(f, -2, 2), R(f, -2, 2)])), { fill: mix(P.earth, P.stoneD, 0.5), shadow: '#101110', shade: 0.4, inkW: 1, cast: false, k: 0.6, tex: 'mottle' + seed, texOp: 0.6 }); f.flat(ell(add(q, [2, -rr * 0.5]), rr * 0.5, rr * 0.25, 0, 6), P.frost, { op: 0.6 }); } }

  // ---- torso: a ragged wool tunic over a sunk chest, hitched up through the belt; the lowering rope coiled over it
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.3, 0.34], [0.04, 0.62, 0.48], [0.18, 0.74, 0.6], [0.34, 0.7, 0.62], [0.5, 0.6, 0.56], [0.66, 0.52, 0.5], [0.82, 0.54, 0.52], [0.96, 0.58, 0.54]]);
  const tD = f.part(torso, WOOL());
  X.stains(f, tD, [180, 280, 480, 560], P.earth, 0.03, 3, -1.4, 3, 0.7);
  X.stains(f, tD, [180, 280, 480, 560], P.mouldD, 0.04, 3.2, -2.1, 5, 0.55);
  X.clipDraw(f, tD, () => {
    X.softTone(f, tD, [[[S.at(-0.8, 0.1), S.at(-0.2, 0.1), S.at(-0.2, 0.9), S.at(-0.8, 0.9)], '#000', 0.35, 12]]);
    for (let i = 0; i < 4; i++) f.stroke([S.at(-0.5 + i * 0.3, 0.2), S.at(-0.45 + i * 0.3, 0.5), S.at(-0.5 + i * 0.32, 0.78)], 2.6, '#121310', { op: 0.45 }); // the wool hanging off the stooped back in folds
    f.part([S.at(0.1, 0.3), S.at(0.4, 0.3), S.at(0.42, 0.5), S.at(0.12, 0.5)].map(q => [...q, 1]), WOOL({ fill: mix(P.wool, P.linenD, 0.4), inkW: 1.1, cast: false })); f.stitches([S.at(0.1, 0.3), S.at(0.4, 0.3), S.at(0.42, 0.5)], P.linenL, 0.8); // a patch
  });
  for (const q of [S.at(-0.36, 0.5)]) { const hl = [add(q, [-16, -4]), add(q, [-2, -8]), add(q, [14, -2]), add(q, [4, 4]), add(q, [-8, 6])]; f.part(hl, SKd({ inkW: 1, cast: false, maxShade: 3 })); f.line(hl.concat([hl[0]]), 1.6, '#121210', { op: 0.6 }); } // holes worn through
  // the tunic hitched up through the belt on the near side, its hem bunched and hanging ragged on the far side
  f.bone('skirt');
  const hem = [S.at(-0.66, 0.82), S.at(0.58, 0.8), S.at(0.7, 0.96), add(S.at(0.68, 1.1), [6, 20]), [...add(S.at(0.5, 1.12), [0, 26]), 1], add(S.at(0.3, 1.08), [0, 10]), [...add(S.at(0.12, 1.1), [0, 20]), 1], add(S.at(-0.1, 1.0), [0, 6]), add(S.at(-0.4, 0.96), [0, 2]), add(S.at(-0.66, 0.94), [-4, 4])];
  const hD = f.part(hem, WOOL({ fill: mix(P.wool, P.mould, 0.2) }));
  X.stains(f, hD, [180, 430, 460, 600], P.earth, 0.05, 3, -1.2, 9, 0.7);
  for (let i = 0; i < 4; i++) f.stroke([S.at(-0.5 + i * 0.32, 0.84), S.at(-0.46 + i * 0.32, 0.95), S.at(-0.5 + i * 0.3, 1.04)], 2.4, '#121310', { op: 0.5 });
  FX.icicles([add(S.at(0.68, 1.1), [6, 20]), add(S.at(0.5, 1.12), [0, 26]), add(S.at(0.12, 1.1), [0, 20])], 3, 14, 4);
  f.bone('torso');
  // the belt: a strip of hide knotted, the tunic's bunched fold pulled up through it
  f.part([S.at(-0.6, 0.78), S.at(0.6, 0.76), S.at(0.62, 0.84), S.at(-0.6, 0.86)].map(q => [...q, 1]), { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4 });
  f.part([S.at(-0.4, 0.7), S.at(-0.1, 0.7), S.at(-0.04, 0.9), S.at(-0.2, 0.96), S.at(-0.42, 0.9)], WOOL({ fill: mix(P.wool, '#000', 0.1), inkW: 1.2 })); // the bunched hitch
  f.stroke([S.at(0.36, 0.8), S.at(0.4, 0.92), S.at(0.34, 1.04)], 6, P.leatherD); f.stroke([S.at(0.4, 0.8), S.at(0.5, 0.9), S.at(0.5, 1.0)], 5, P.leatherD); // the knot's ends
  // the toxin pushed hard: a crop of grave caps and mould fruiting from the stooped back and shoulders where grave earth stuck
  for (const [u, v, r] of [[-0.62, 0.12, 22], [-0.4, -0.02, 16], [-0.68, 0.34, 16], [0.0, -0.06, 12]]) { const q = S.at(u, v); f.part(ell(q, r * 1.3, r * 0.8, -0.4, 9).map(p => add(p, [R(f, -3, 3), R(f, -3, 3)])), { fill: P.earth, shadow: '#101110', shade: 0.4, inkW: 1, cast: false, tex: 'mottle' + seed, texOp: 0.7 }); X.mould(f, add(q, [0, -2]), r, r * 0.6, { rings: 1 }); }
  X.graveCaps(f, S.at(-0.66, 0.1), deg(-125), 40, 4); X.graveCaps(f, S.at(-0.42, -0.04), deg(-100), 30, 3); X.graveCaps(f, S.at(-0.7, 0.34), deg(-150), 28, 3);
  X.fungalFur(f, [S.at(-0.8, 0.4), S.at(-0.66, 0.1), S.at(-0.3, -0.06), S.at(0.1, -0.08)], 7, 1, { gaps: 0.3 });
  FX.rime([S.at(-0.2, -0.08), S.at(-0.6, 0.0), S.at(-0.78, 0.22), S.at(-0.84, 0.5)], 7, 1);
  X.spores(f, S.at(-0.9, -0.3), 30, 26, 8);

  // ---- head: a long grey face bowed over the work, the cheeks fallen in on a toothless mouth, a knotted rag on the head
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-6, 12]), hF([[-0.08, 0.4]])[0]], [44, 34]), SKd({ maxShade: 6 }));
  X.crease(f, [add(neck0, [8, 2]), lerp(neck0, hF([[0.06, 0.44]])[0], 0.5), hF([[0.06, 0.44]])[0]], 2.2, { col: '#1e1c1a', lit: P.skinL });
  X.deadHead(f, FX, HC, H, hA, { head: { jaw: 1.18, chin: 0.06, nose: 1.08, hook: 0.3, mouth: 'set', hairCol: '#6e6e64', noEar: false }, lid: 0.1, stubble: '#4a4a44' });
  // the toothless mouth: the lips sucked in over bare gums, the chin up toward the nose
  f.flat(hF([[0.17, 0.27], [0.24, 0.258], [0.3, 0.266], [0.28, 0.284], [0.22, 0.286]]), '#1a1614', { op: 0.85 });
  for (let i = 0; i < 4; i++) f.line(hF([[0.18 + i * 0.03, 0.29], [0.19 + i * 0.03, 0.31]]), 1, '#1e1c18', { op: 0.6 });
  X.crease(f, hF([[0.06, 0.2], [0.1, 0.32], [0.14, 0.42]]), 2, { col: '#1e1c18', lit: P.skinL, op: 0.6 });
  // the knotted rag on his head, tied at the nape, the ends hanging plumb
  const rag = hF([[-0.38, -0.12], [-0.4, -0.36], [-0.24, -0.52], [0.02, -0.56], [0.24, -0.48], [0.34, -0.32], [0.3, -0.24], [0.1, -0.3], [-0.12, -0.26], [-0.3, -0.08]]);
  const rD = f.part(rag, { fill: mix(P.linenD, P.earth, 0.3), shadow: '#1c1c16', tex: 'weave' + seed, texOp: 0.6, shade: 0.4, maxShade: 10, inkW: 1.4 });
  X.stains(f, rD, [HC[0] - 60, HC[1] - 70, HC[0] + 60, HC[1] + 10], P.mouldD, 0.06, 3, -1.6, 13, 0.6);
  for (let i = 0; i < 3; i++) f.line(hF([[-0.3 + i * 0.2, -0.46], [-0.24 + i * 0.2, -0.32]]), 1.4, '#141410', { op: 0.5 });
  { const kn = hF([[-0.4, -0.18]])[0]; f.part(ell(kn, 9, 7, 0, 8), { fill: mix(P.linenD, P.earth, 0.4), shade: 0.4, inkW: 1.2, cast: false }); for (const [dx, l] of [[-4, 30], [5, 22]]) f.stroke([add(kn, [dx, 4]), add(kn, [dx - 3, l * 0.6]), add(kn, [dx - 1, l])], 7, mix(P.linenD, P.earth, 0.3)); FX.icicle(add(kn, [-6, 32]), 9, 3); }
  for (let i = 0; i < 4; i++) { const p0 = hF([[-0.38, -0.02 + i * 0.06]])[0]; X.hairClump(f, [p0, add(p0, [-3, 18]), add(p0, [-2, 34])], 7, { pal: ['#6e6e64', '#8a8a80'], n: 2 }); } // grey hair from under the rag, hanging plumb
  FX.rime(hF([[-0.38, -0.36], [-0.2, -0.54], [0.06, -0.58], [0.26, -0.5]]), 5, 1);

  // ---- near leg, raised: the foot on the blade's shoulder driving it in
  X.leg(f, FX, HN, KN, AN, '_n', { ws: [56, 40, 28], look: HOSE(), garter: P.linenD, foot: 'shoe', fs: 44, clods: 4, shoe: mix(P.leather, P.earth, 0.4), gy: spB[1] + 4, dirt: 0.5 });
  FX.frost(lerp(KN, AN, 0.5), 14, 30, 6);
  // the sack of lime at the hip on a cord, slit, white powder dusting the hose
  f.bone('sack');
  { const s0 = S.at(-0.62, 0.9), q = add(s0, [-12, 40]); f.line([S.at(-0.5, 0.82), s0, add(q, [-2, -26])], 2, P.linenD);
    const sk = [add(q, [-18, -30]), add(q, [8, -32]), add(q, [20, -8]), add(q, [22, 22]), add(q, [4, 30]), add(q, [-16, 26]), add(q, [-24, 4])];
    const sD = f.part(sk, { fill: mix(P.linen, P.linenD, 0.4), shadow: '#22221c', tex: 'weave' + seed, texOp: 0.6, shade: 0.42, maxShade: 12 });
    X.stains(f, sD, [q[0] - 30, q[1] - 40, q[0] + 30, q[1] + 40], '#0b0b08', 0.07, 3, -1.4, 41, 0.6);
    f.line([add(q, [-10, -30]), add(q, [-2, -24]), add(q, [8, -32])], 2.2, P.linenD); f.line([add(q, [-16, -8]), add(q, [-4, 6]), add(q, [-10, 22])], 1.4, '#141410', { op: 0.5 });
    f.line([add(q, [10, 6]), add(q, [18, 14])], 2, '#141410'); for (let i = 0; i < 10; i++) f.flat(ell(add(q, [R(f, 12, 30), R(f, 14, 60)]), R(f, 1, 2.4), R(f, 1, 2), 0, 5), P.hoar, { op: 0.7 }); } // a slit sack of lime, spilling white

  // the rope: a coil of lowering rope over the near shoulder and across the chest (on the torso, over the arm's root)
  f.bone('rope');
  { // a coil of lowering rope hung over the near shoulder, lying on the back: five loops, bound where they hang
    const c0 = S.at(-0.42, 0.42), a0 = ang(Pv, N);
    for (let k = 0; k < 5; k++) { const lo = ell(add(c0, rot([k * 3 - 6, k * 2], a0)), 58 - k * 2, 36 + k, a0, 18); X.rope(f, lo.concat([lo[0], lo[1]]), 5, mix(P.linenD, P.earth, 0.15 + k * 0.05), { lit: k > 2 }); }
    const tb = add(c0, rot([50, 0], a0)); for (let i = 0; i < 4; i++) f.line([add(tb, rot([i * 5 - 8, -22], a0)), add(tb, rot([i * 5 - 6, 22], a0))], 3, P.linenD);
    FX.icicles([add(c0, rot([-40, 34], a0)), add(c0, rot([10, 40], a0))], 3, 14, 4); X.mould(f, add(c0, rot([-30, 26], a0)), 9, 6, { rings: 0 }); }
  // ---- near arm, in front: a long bare arm reaching down the shaft, the broken finger set crooked on the fist
  X.arm(f, SN, EN, WN, '_n', { ws: [42, 34, 27], skin: SKd(), sleeve: { look: WOOL({ fill: mix(P.wool, P.mould, 0.1) }), to: 0.9, rag: 10, teeth: 7 } });
  f.bone('forearm_n');
  X.veins(f, lerp(EN, WN, 0.5), 14, 8, 3); X.sore(f, lp(EN, WN, 0.4, 6), 4.5);
  FX.rime([lp(EN, WN, 0.1, -15), lp(EN, WN, 0.5, -14), lp(EN, WN, 0.85, -12)], 4, -1);
  f.bone('upperarm_n'); X.mould(f, lp(SN, EN, 0.3, -10), 10, 12, { rings: 1 }); X.graveCaps(f, lp(SN, EN, 0.15, -18), deg(-140), 24, 2);
  // the hands last, round the shaft
  f.bone('hand_f');
  X.grip(f, WF, EF, spA, 25, mix(P.skin, P.skinD, 0.2), 'gravedigger far');
  f.bone('hand_n');
  const gN = X.grip(f, WN, EN, spA, 26, P.skin, 'gravedigger near');
  { const k0 = gN.F([[0.5, 0.0]])[0], k1 = gN.F([[0.74, 0.12]])[0], k2 = add(k1, rot([10, 6], gN.ang + 0.9)); f.part(limb(k0, k1, 9, 8, { steps: 3 }), SKd({ inkW: 1, cast: false, maxShade: 2 })); f.part(limb(k1, k2, 8, 6, { steps: 3 }), SKd({ inkW: 1, cast: false, maxShade: 2 })); f.line([lerp(k0, k1, 0.9), add(lerp(k0, k1, 0.9), [3, 3])], 1.2, INK, { op: 0.7 }); } // the broken finger, set crooked, sticking out
  FX.frost(WN, 10, 8, 4);
  f.bone('root');
  f.flat(ell([330, gy + 2], 170, 6, 0, 16), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ RAT-CATCHER (cast, human 1.0)
// The household's rat-catcher, paid by the tail; there is no one left to pay him and he has not stopped. Thin and
// weathered, shuffling forward with a limp, the weight on the good (far) leg and the near leg dragging; a long pole over
// the near shoulder hung with a dozen dead rats by their tails, a wicker cage-trap swinging from the far hand, a small
// dead terrier frozen stiff and dragged on a cord at his heel.
// Remnant of the trade: the rat pole, the trap, the tails tied at his belt to be counted, the lidded pot of poison, the
// gauntlets bitten through. The one mark pushed hard is toxin's: flea bites ripened into crusted sores up both forearms
// and the neck, and the groin bubo that makes him limp. Frost greys him, whitens his stubble and rimes the hanging rats.
// Rig: standard humanoid + pole (parent hand_n, carries the rats) + trap (parent hand_f) + hood (head) + dog (root) +
// skirt (jerkin skirt). Motion: idle counting the tails at his belt; attack a swing of the rat pole shaking fleas.
function ratCatcher() {
  const [CW, CH] = TIERS.human, seed = 930;
  const f = new Fig(X.base(seed, CH, { grimeY: 580 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 98, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, o);
  const LTH = (o = {}) => Object.assign({ fill: mix(P.leather, P.leatherL, 0.5), shadow: '#16150f', tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, maxShade: 24 }, o);
  const WOOL = (o = {}) => Object.assign({ fill: mix(P.wool, P.mould, 0.15), shadow: '#1e1f19', tex: 'weave' + seed, texOp: 0.5, shade: 0.4, maxShade: 22 }, o);
  const N = [338, 306], C = [314, 384], Pv = [300, 474];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.16, 0.13), SF = S.at(0.3, 0.1);
  const pF = [470, 412], pB = [36, 158], pA = ang(pF, pB);                     // the pole: front end in the near hand, over the shoulder, back
  const WN = lerp(pF, pB, 0.12), EN = X.ik(SN, WN, 112, 100, 1)[0];            // near hand up on the pole in front of the shoulder
  const WF = [422, 520], EF = X.ik(SF, WF, 112, 102, -1)[0];                   // far arm hanging forward, the trap from the fist
  const HF = [318, 470], AF = [370, 748], KF = X.ik(HF, AF, 150, 132, -1)[0];  // the good leg forward, straight, the weight on it
  const HN = [286, 476], AN = [210, 736], KN = X.ik(HN, AN, 150, 132, 1)[0];   // the near leg dragging behind
  const neck0 = S.at(0.16, -0.04), HC = [366, 258], hA = 0.16;
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('pole', WN, 'hand_n').joint('trap', WF, 'hand_f').joint('hood', add(HC, [-30, 10]), 'head').joint('skirt', S.at(0, 0.84), 'pelvis').joint('dog', [150, 760]);

  // ---- the terrier, frozen stiff on its side and dragged on a cord at his heel (on the ground: its own bone)
  f.bone('dog');
  { const dc = [118, 752], DL = (o = {}) => Object.assign({ fill: mix(P.fur, P.frostS, 0.25), shadow: '#22221d', tex: 'fur' + seed, texOp: 0.85, shade: 0.42, maxShade: 12, inkW: 1.3 }, o);
    // four legs stiff out from the body in rigor, the far pair behind
    for (const [h0, a0, l] of [[[70, 760], -1.9, 64], [[160, 752], -1.4, 60]]) { const k = add(h0, rot([l * 0.55, 0], a0)), t = add(k, rot([l * 0.5, 0], a0 + 0.15)); f.part(limb(h0, k, 20, 12, { steps: 5 }), DL({ fill: mix(P.fur, '#000', 0.25) })); f.part(limb(k, t, 12, 9, { steps: 4 }), DL({ fill: mix(P.fur, '#000', 0.25) })); }
    const body = [[30, 772], [44, 736], [90, 722], [150, 718], [196, 728], [214, 750], [200, 780], [150, 788], [90, 788], [44, 786]];
    const bD = f.part(body, DL());
    X.stains(f, bD, [20, 700, 230, 800], '#0b0b08', 0.05, 3, -1.5, 51, 0.5);
    for (let i = 0; i < 9; i++) { const q = [44 + i * 19, 724 + Math.sin(i) * 4]; X.hairClump(f, [q, add(q, [-4, -10]), add(q, [-10, -16])], 8, { pal: [P.furD, P.fur, P.furL], n: 2, gap: false }); } // wiry coat standing stiff
    FX.rime([[40, 740], [90, 722], [150, 716], [196, 726]], 6, -1);
    for (const [h0, a0, l] of [[[80, 780], -2.4, 66], [[176, 776], -1.0, 62]]) { const k = add(h0, rot([l * 0.55, 0], a0)), t = add(k, rot([l * 0.5, 0], a0 - 0.1)); f.part(limb(h0, k, 22, 13, { steps: 5 }), DL()); f.part(limb(k, t, 13, 10, { steps: 4 }), DL()); for (let j = -1; j <= 1; j++) f.line([t, add(t, rot([8, j * 4], a0))], 1.4, P.bone); FX.icicle(lerp(h0, k, 0.7), 8, 3); }
    // the head toward him, the lips drawn back off small teeth, the ear folded, frost in the eye
    const hc = [232, 742], hF2 = frame(hc, 0.25, 1);
    f.part(hF2([[-28, -20], [-4, -30], [24, -26], [52, -14], [62, -2], [58, 8], [30, 14], [0, 18], [-26, 12]]), DL({ maxShade: 6 }));
    f.part(hF2([[-14, -28], [-2, -46], [12, -40], [6, -26]]), DL({ fill: mix(P.fur, '#000', 0.2), maxShade: 3 }));
    f.part(hF2([[56, -6], [66, -4], [66, 4], [58, 6]]), { fill: P.black, shade: 0.3, inkW: 0.9, cast: false, hatch: false });
    f.flat(hF2([[26, 6], [56, 4], [52, 12], [30, 14]]), '#0e0c0c'); for (let i = 0; i < 4; i++) f.flat(hF2([[30 + i * 6, 6], [33 + i * 6, 6], [32 + i * 6, 11]]), P.bone);
    f.line(hF2([[12, -14], [22, -16], [30, -13]]), 2, '#121010'); f.flat(ell(hF2([[22, -13]])[0], 4, 1.6, 0.25, 6), P.hoar, { op: 0.7 });
    X.sore(f, hF2([[0, 4]])[0], 4);
    // the cord from its neck to his belt, frozen into a stiff curve
    X.rope(f, [hF2([[-20, 0]])[0], [260, 720], [290, 650], S.at(-0.3, 0.9)], 2.4, P.linenD);
    f.part(hF2([[-26, -18], [-18, -20], [-16, 16], [-24, 16]]), LTH({ fill: P.leatherD, maxShade: 2, cast: false })); // a leather collar
    X.mould(f, [120, 770], 14, 8, { rings: 1 }); f.flat(ell([120, gy + 2], 110, 5, 0, 12), P.frostD, { op: 0.45 }); }

  // ---- the pole's back half and its rats (behind him), then the far arm and the trap
  const poleDraw = (t0, t1) => {
    f.part(limb(lerp(pF, pB, t0), lerp(pF, pB, t1), 15, 14, { steps: 8, capA: t0 === 0, capB: t1 === 1 }), { fill: mix(P.wood, P.woodL, 0.25), shadow: P.woodD, tex: 'grain' + seed, texOp: 0.7, maxShade: 5, inkW: 1.4 });
    f.line([lp(pF, pB, t0 + 0.01, 5), lp(pF, pB, t1 - 0.01, 5)], 1.2, '#a8a290', { op: 0.4 });
  };
  f.bone('pole');
  poleDraw(0.3, 1);
  FX.rime([lp(pF, pB, 0.4, 7), lp(pF, pB, 0.7, 7), lp(pF, pB, 0.98, 6)], 4, -1);
  // a dozen dead rats tied by their tails along the pole, hanging plumb, rimed white and furred with mould; each its own
  const rats = [];
  for (let i = 0; i < 12; i++) { const t = 0.42 + i * 0.047 + R(f, -0.01, 0.01), T = lerp(pF, pB, t), tl = R(f, 22, 58) + (i % 3) * 16, s = R(f, 72, 96); rats.push([T, tl, s, i]); }
  rats.sort((a, b) => (a[3] % 2) - (b[3] % 2));
  for (const [T, tl, s, i] of rats) {
    const c = add(T, [R(f, -6, 6), tl + s * 0.5]);
    const r = X.bigRat(f, FX, add(c, [0, -s * 0.1]), Math.PI / 2 + R(f, -0.1, 0.1), s * 0.95, { pose: 'hung', old: i % 4 === 1, tone: R(f, 0.1, 0.8), cast: false }); // a real rat hung by its tail (the Rat King's builder)
    X.ratTail(f, [lp(pF, pB, 0, 0).length ? add(T, [0, -4]) : T, add(T, [R(f, -3, 3), tl * 0.5]), r.root], 6, { rime: true });
    f.line([add(T, [-7, -6]), add(T, [7, 6])], 2.4, P.linenD); f.line([add(T, [-7, 6]), add(T, [7, -6])], 2.2, P.linenD); // the tail knotted round the pole
    if (i % 3 === 0) FX.icicle(add(r.head, [0, 2]), 10 + (i % 4) * 4, 3);
  }

  X.arm(f, SF, EF, WF, '_f', { ws: [38, 30, 24], skin: SKd({ fill: mix(P.skin, P.skinD, 0.25) }), sleeve: { look: WOOL({ fill: mix(P.wool, '#000', 0.12) }), to: 0.95, roll: true } });
  f.bone('forearm_f');
  for (let i = 0; i < 5; i++) X.sore(f, lp(EF, WF, 0.15 + i * 0.16, R(f, -7, 7)), R(f, 2.6, 4)); // flea bites ripened into sores
  // the trap: a wicker cage on a loop handle, its door a sliding grid, swinging from the fist
  f.bone('trap');
  { // a bell of woven withies on a wooden base: upright ribs bent over the top, the weavers round them in bands, the dark
    // inside showing between, a sliding grid door at the front, the loop handle through his fist
    const tc = add(WF, [6, 90]), TW = 50, TH = 64, base = tc[1] + TH * 0.5, top = tc[1] - TH;
    const bell = [[tc[0] - TW, base], [tc[0] - TW * 1.02, tc[1] - TH * 0.2], [tc[0] - TW * 0.8, tc[1] - TH * 0.72], [tc[0] - TW * 0.3, top], [tc[0] + TW * 0.3, top], [tc[0] + TW * 0.8, tc[1] - TH * 0.72], [tc[0] + TW * 1.02, tc[1] - TH * 0.2], [tc[0] + TW, base]];
    f.part(bell, { fill: '#121310', shade: 0.3, inkW: 1.6, cast: true, hatch: false });
    X.clipDraw(f, bell, () => {
      f.flat(ell([tc[0] + 8, tc[1] + 6], TW * 0.6, TH * 0.5, 0, 12), '#2a2b24', { op: 0.8 });
      for (let i = 0; i < 9; i++) { const u = -1 + i * 0.25, x0 = tc[0] + u * TW, xt = tc[0] + u * TW * 0.4; f.line([[x0, base], [tc[0] + u * TW * 1.02, tc[1] - TH * 0.2], [xt, top + 4]], 4.2, mix(P.wood, P.linenD, 0.5)); f.line([[x0 + 1, base], [tc[0] + u * TW * 1.02 + 1, tc[1] - TH * 0.2]], 1, '#c8c4b0', { op: 0.35 }); } // the ribs
      for (const yb of [-0.62, -0.1, 0.32]) for (let k = 0; k < 3; k++) { const y = tc[1] + TH * yb + k * 5; f.line([[tc[0] - TW * 1.1, y + 6], [tc[0], y], [tc[0] + TW * 1.1, y + 6]], 3.4, k % 2 ? P.woodL : mix(P.wood, P.linenD, 0.4)); f.line([[tc[0] - TW * 1.1, y + 7.5], [tc[0], y + 1.5], [tc[0] + TW * 1.1, y + 7.5]], 0.8, INK, { op: 0.6 }); } // bands of weavers
    });
    f.part([[tc[0] - TW * 1.08, base - 6], [tc[0] + TW * 1.08, base - 6], [tc[0] + TW * 1.04, base + 6], [tc[0] - TW * 1.04, base + 6]].map(q => [...q, 1]), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'grain' + seed, texOp: 0.6, inkW: 1.3, cast: false }); // the board base
    f.part([[tc[0] + TW * 0.25, tc[1] - TH * 0.25], [tc[0] + TW * 0.85, tc[1] - TH * 0.3], [tc[0] + TW * 0.85, base - 6], [tc[0] + TW * 0.25, base - 6]].map(q => [...q, 1]), { fill: '#1a1b18', shade: 0.3, inkW: 1.4, cast: false, hatch: false, opacity: 0.6 }); // the drop door: an iron grid
    for (let i = 0; i < 4; i++) f.line([[tc[0] + TW * (0.32 + i * 0.16), tc[1] - TH * 0.26], [tc[0] + TW * (0.32 + i * 0.16), base - 6]], 1.8, P.ironL, { op: 0.8 });
    f.line([[tc[0] + TW * 0.25, tc[1] + TH * 0.05], [tc[0] + TW * 0.85, tc[1] + TH * 0.05]], 1.6, P.ironL, { op: 0.8 });
    f.line([[tc[0] - TW * 0.45, top + 6], add(WF, [-12, -6]), add(WF, [14, -6]), [tc[0] + TW * 0.45, top + 6]], 4, mix(P.wood, P.linenD, 0.3)); // the loop handle through the fist
    X.mould(f, [tc[0] - TW * 0.5, tc[1] + TH * 0.1], 10, 7, { rings: 1 }); FX.rime(bell.slice(1, 5), 5, -1); FX.icicles([[tc[0] - TW, base + 6], [tc[0] + TW, base + 6]], 3, 16, 4);
    // the last rat it caught, dead inside, its tail through the weave
    X.ratTail(f, [[tc[0] - TW * 0.6, base - 10], [tc[0] - TW * 1.0, base + 10], [tc[0] - TW * 1.2, base + 40]], 4, { rime: true }); }

  // ---- legs: wool hose, the near leg dragging, the knees bound; worn shoes
  X.leg(f, FX, HF, KF, AF, '_f', { ws: [56, 40, 30], look: WOOL({ fill: mix(P.woolD, P.mould, 0.15) }), garter: P.leatherD, foot: 'shoe', fs: 44, dirt: 0.4, clods: 2 });

  // ---- torso: a wool shirt under a stained leather jerkin, laced; the jerkin's skirt to mid-thigh
  f.bone('skirt');
  const jsk = [S.at(-0.62, 0.8), S.at(0.62, 0.78), S.at(0.74, 0.96), [...add(S.at(0.74, 1.16), [6, 8]), 1], add(S.at(0.44, 1.18), [0, 10]), [...add(S.at(0.18, 1.2), [0, 18]), 1], add(S.at(-0.1, 1.16), [0, 6]), [...add(S.at(-0.42, 1.18), [-2, 14]), 1], add(S.at(-0.7, 1.08), [-4, 4])];
  const jD = f.part(jsk, LTH());
  X.stains(f, jD, [200, 420, 440, 600], '#0b0b08', 0.05, 3, -1.4, 55, 0.6);
  for (let i = 0; i < 3; i++) f.stroke([S.at(-0.4 + i * 0.4, 0.84), S.at(-0.36 + i * 0.4, 1.0), S.at(-0.42 + i * 0.38, 1.12)], 2.4, '#100f0c', { op: 0.55 });
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.28, 0.32], [0.04, 0.56, 0.44], [0.18, 0.66, 0.54], [0.34, 0.62, 0.56], [0.5, 0.54, 0.5], [0.66, 0.48, 0.46], [0.82, 0.5, 0.48]]);
  f.part(torso, WOOL());
  const jk = S.shape([[0.02, 0.5, 0.3], [0.14, 0.62, 0.46], [0.3, 0.6, 0.52], [0.5, 0.52, 0.48], [0.66, 0.48, 0.46], [0.84, 0.5, 0.5]]);
  const jkD = f.part(jk, LTH());
  X.stains(f, jkD, [220, 280, 440, 500], '#0b0b08', 0.04, 3, -1.3, 57, 0.6); X.stains(f, jkD, [220, 280, 440, 500], P.mouldD, 0.05, 3.2, -2.1, 59, 0.5);
  for (let i = 0; i < 4; i++) { const a = S.at(0.32, 0.22 + i * 0.12), b = S.at(0.48, 0.26 + i * 0.12); f.line([a, b], 1.8, P.linenD); f.line([S.at(0.48, 0.22 + i * 0.12), S.at(0.32, 0.28 + i * 0.12)], 1.8, P.linenD, { op: 0.8 }); } // the lacing
  f.part([S.at(-0.6, 0.76), S.at(0.6, 0.74), S.at(0.62, 0.82), S.at(-0.6, 0.84)].map(q => [...q, 1]), { fill: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  f.part([S.at(0.2, 0.74), S.at(0.32, 0.74), S.at(0.32, 0.84), S.at(0.2, 0.84)], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.1, sharp: true });
  FX.rime([S.at(-0.2, -0.06), S.at(-0.5, 0.06), S.at(-0.62, 0.3)], 6, 1);
  // the tails tied at his belt to be counted: a hank of thin grey tails knotted at the root, hanging plumb
  { const q = S.at(0.48, 0.84); f.part(ell(q, 9, 7, 0, 8), LTH({ fill: P.leatherD, cast: false, maxShade: 2 })); for (let i = 0; i < 14; i++) { const e = add(q, [R(f, -14, 16), R(f, 56, 96)]); X.ratTail(f, [add(q, [R(f, -4, 4), 2]), lerp(q, e, 0.5).map((v, j) => j ? v : v + R(f, -6, 6)), e], 3.4, { inkW: 0.7, inkH: 0.9 }); } f.line([add(q, [-8, -2]), add(q, [8, 2])], 3, P.linenD); }
  // the lidded pot of poison on a thong at the hip, a skull scratched on it as a warning
  { const q = S.at(-0.1, 0.98); f.line([S.at(-0.1, 0.82), add(q, [0, -22])], 2, P.leatherD); f.part([add(q, [-18, -18]), add(q, [18, -18]), add(q, [22, 6]), add(q, [14, 26]), add(q, [-14, 26]), add(q, [-22, 6])], { fill: '#5e5a4c', shadow: '#24221c', shade: 0.42, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.3, maxShade: 8 }); f.part([add(q, [-20, -24]), add(q, [20, -24]), add(q, [18, -16]), add(q, [-18, -16])], { fill: P.wood, shade: 0.4, inkW: 1.1, cast: false }); f.line([add(q, [-6, 0]), add(q, [6, 0]), add(q, [4, 8]), add(q, [-4, 8]), add(q, [-6, 0])], 1.2, '#1a1814'); f.line([add(q, [-4, 12]), add(q, [4, 12])], 1.2, '#1a1814'); f.flat(ell(add(q, [10, 16]), 6, 4, 0, 6), P.mouldD, { op: 0.7 }); }
  // the groin bubo on the near side, pushing the jerkin's skirt out (the cause of the limp)
  X.bubo(f, S.at(-0.36, 1.04), 15, { sag: 0.5 });

  // ---- head in a wool hood: a narrow sharp face, frost-white stubble, a sore at the lip
  f.bone('hood');
  const hF = frame(HC, hA, H);
  const hoodB = hF([[-0.5, 0.5], [-0.62, 0.0], [-0.56, -0.38], [-0.34, -0.62], [0.0, -0.68], [0.3, -0.56], [0.42, -0.34], [0.3, -0.36], [0.0, -0.48], [-0.3, -0.36], [-0.36, 0.1], [-0.3, 0.5]]);
  f.part(hoodB, WOOL({ fill: mix(P.wool, P.furD, 0.25), maxShade: 10 }));
  { const t0 = hF([[-0.56, -0.2]])[0]; f.part([t0, add(t0, [-26, 30]), add(t0, [-36, 90]), [...add(t0, [-30, 132]), 1], add(t0, [-18, 96]), add(t0, [-6, 40])], WOOL({ fill: mix(P.wool, P.furD, 0.3), maxShade: 6 })); FX.icicle(add(t0, [-30, 130]), 12, 4); } // the hood's long tail
  f.bone('head');
  f.part(K.chain([add(neck0, [-4, 10]), hF([[-0.06, 0.4]])[0]], [40, 32]), SKd({ maxShade: 5 }));
  for (let i = 0; i < 3; i++) X.sore(f, lerp(neck0, hF([[0.0, 0.42]])[0], 0.3 + i * 0.2), 3.2);
  X.deadHead(f, FX, HC, H, hA, { head: { jaw: 0.96, chin: 0.03, nose: 1.14, hook: 0.5, mouth: 'set', noEar: true, hairCol: '#5a5a52' }, lid: 0.0, stubble: '#e0e4dc' });
  X.sore(f, hF([[0.27, 0.3]])[0], 3, { ang: hA });
  f.bone('hood');
  // the hood's face opening and the cape over the shoulders, round the head, frozen stiff in folds
  const hoodF = hF([[-0.3, 0.5], [-0.4, 0.1], [-0.36, -0.36], [-0.04, -0.52], [0.26, -0.48], [0.42, -0.34], [0.38, -0.3], [0.2, -0.38], [-0.02, -0.4], [-0.24, -0.26], [-0.26, 0.1], [-0.12, 0.44], [0.12, 0.56], [0.36, 0.6], [0.58, 0.82], [0.5, 1.0], [0.0, 1.06], [-0.5, 0.98], [-0.76, 0.8], [-0.66, 0.5]]);
  const hfD = f.part(hoodF, WOOL({ fill: mix(P.wool, P.furD, 0.15), maxShade: 16 }));
  X.stains(f, hfD, [HC[0] - 90, HC[1] - 70, HC[0] + 70, HC[1] + 110], P.mouldD, 0.05, 3, -1.8, 61, 0.6);
  for (let i = 0; i < 4; i++) f.stroke(hF([[-0.5 + i * 0.25, 0.7], [-0.46 + i * 0.24, 0.85], [-0.5 + i * 0.25, 1.0]]), 2.4, '#121310', { op: 0.5 });
  f.line(hF([[-0.38, 0.1], [-0.34, -0.36], [-0.02, -0.5], [0.4, -0.34]]), 2, '#121310', { op: 0.6 });
  FX.rime(hF([[-0.6, -0.2], [-0.4, -0.56], [0.0, -0.66], [0.3, -0.56]]), 6, 1);
  FX.icicles(hF([[-0.5, 0.98], [0.0, 1.06], [0.5, 1.0]]), 4, 16, 4);
  X.mould(f, hF([[0.2, 0.8]])[0], 10, 6, { rings: 1 });

  // ---- near leg, dragging: the knee bent, the toe trailing
  X.leg(f, FX, HN, KN, AN, '_n', { ws: [58, 40, 30], look: WOOL({ fill: mix(P.woolD, P.mould, 0.1) }), garter: P.leatherD, foot: 'shoe', fs: 44, dirt: 0.4, clods: 2, torn: 0.45 });

  // ---- near arm up to the pole: the sleeve rolled, the forearm bare and bitten, a gauntlet bitten through at the fingers
  X.arm(f, SN, EN, WN, '_n', { ws: [40, 32, 25], skin: SKd(), sleeve: { look: WOOL(), to: 0.95, roll: true } });
  f.bone('forearm_n');
  for (let i = 0; i < 6; i++) X.sore(f, lp(EN, WN, 0.12 + i * 0.13, R(f, -7, 7)), R(f, 2.4, 3.8), { ang: ang(EN, WN) });
  f.part(plate(EN, WN, 0.72, 1.02, 34, 36, { bow: 2 }), LTH({ fill: P.leather, maxShade: 4 })); // the gauntlet's cuff
  f.bone('pole');
  poleDraw(0, 0.3);
  f.bone('hand_n');
  X.grip(f, WN, EN, pA, 25, mix(P.leather, P.leatherL, 0.4), 'ratcatcher pole', { tips: P.skin, nail: '#3a3830' });
  f.bone('hand_f');
  X.grip(f, WF, EF, 0, 24, mix(P.leather, P.leatherL, 0.4), 'ratcatcher trap', { tips: P.skin, nail: '#3a3830' });
  f.bone('root');
  f.flat(ell([310, gy + 2], 150, 6, 0, 16), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE SWOLLEN (cast, human 0.95)
// A laundress of the royal household. A stout woman lurching sideways onto her far leg, the near arm held out stiff from
// her body by a bubo in the armpit the size of a man's head; the far hand drags a wooden laundry beetle, its blade
// scraping the floor. A wet sheet frozen stiff over the far shoulder, a headcloth, a sacking apron over the shift.
// Remnant of the trade: the beetle worn smooth, the frozen sheet, the peg bag, the lye scars, the suds frozen on the apron.
// The one mark pushed hard is toxin's, as the bible gives it: the armpit bubo, huge and taut, grey-green and veined
// black, rimed white where the frost lies on it and frozen hard as a bladder of ice. Smaller buboes at the neck and groin.
// Rig: standard humanoid + beetle (parent hand_f) + skirt + apron (pelvis) + sheet (torso) + bubo (torso) + cloth (head).
// Motion: idle a lurching sway while the bubo creaks; attack a beetle swing (far arm). On death the bubo bursts.
function swollen() {
  const [CW, CH] = TIERS.human, seed = 925;
  const f = new Fig(X.base(seed, CH, { grimeY: 580 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 95, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, o);
  const LIN = (o = {}) => Object.assign({ fill: mix(P.linen, P.linenL, 0.35), shadow: '#26251f', tex: 'weave' + seed, texOp: 0.55, shade: 0.42, maxShade: 26 }, o);
  const SACK = (o = {}) => Object.assign({ fill: mix(P.linenD, P.wood, 0.35), shadow: '#1c1b16', tex: 'weave' + seed, texOp: 0.8, shade: 0.42, maxShade: 20 }, o);
  const N = [336, 296], C = [306, 382], Pv = [296, 472];             // the trunk leans onto the far leg
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.5, 0.16), SF = S.at(0.42, 0.1);
  const EN = [176, 392], WN = [118, 470];                               // the near arm forced out stiff by the bubo
  const WF = [442, 520], EF = X.ik(SF, WF, 112, 100, -1)[0];            // the far hand low and forward, on the beetle
  const HF = [320, 470], AF = [344, 742], KF = X.ik(HF, AF, 148, 130, -1)[0];
  const HN = [266, 476], AN = [196, 742], KN = X.ik(HN, AN, 148, 130, 1)[0];
  const neck0 = S.at(0.14, -0.04), HC = [362, 250], hA = 0.22;
  const btE = [560, 772], btA = ang(WF, btE);                           // the beetle: handle in the fist, blade dragging on the floor
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('beetle', WF, 'hand_f').joint('skirt', S.at(0, 0.86), 'pelvis').joint('apron', S.at(0.2, 0.84), 'pelvis').joint('sheet', S.at(0.3, 0.0), 'torso').joint('bubo', S.at(-0.6, 0.3), 'torso').joint('cloth', add(HC, [-40, 0]), 'head');

  // ---- the frozen sheet's back half, hanging stiff down her back from the far shoulder
  f.bone('sheet');
  { const sh = [S.at(0.3, -0.12), S.at(-0.3, -0.1), S.at(-0.66, 0.1), [210, 520], [...[204, 600], 1], [226, 584], [...[246, 610], 1], [262, 588], [...[286, 604], 1], [300, 560], S.at(0.0, 0.5)];
    const sD = f.part(sh, LIN({ fill: mix(P.linenL, P.frost, 0.3), maxShade: 20 }));
    X.stains(f, sD, [190, 260, 380, 620], P.mouldD, 0.04, 3, -1.9, 3, 0.5);
    for (let i = 0; i < 4; i++) f.stroke([S.at(-0.2 - i * 0.12, 0.0), [240 + i * 14, 420], [222 + i * 18, 590]], 3, '#16170f', { op: 0.45 });
    FX.icicles([[204, 600], [246, 610], [286, 604]], 4, 26, 6); FX.rime([S.at(-0.3, -0.12), S.at(-0.66, 0.08), [210, 520]], 8, 1); }

  // ---- far arm (behind), the beetle in its fist
  f.bone('beetle');
  { const h0 = add(WF, rot([-20, 0], btA)), h1 = add(WF, rot([56, 0], btA)), bL = E.len(sub(btE, h1)), dB = E.norm(sub(btE, h1)), nB = [-dB[1], dB[0]];
    f.part(limb(h0, h1, 18, 20, { steps: 5 }), { fill: mix(P.wood, P.woodL, 0.5), shadow: P.woodD, tex: 'grain' + seed, texOp: 0.6, maxShade: 4 });
    // the blade: a flat bat, its face turned a little to us, worn smooth and pale along the striking face
    const bl = [add(h1, mul(nB, 14)), add(add(h1, mul(dB, 20)), mul(nB, 26)), add(add(h1, mul(dB, bL)), mul(nB, 24)), add(add(h1, mul(dB, bL + 6)), mul(nB, 4)), add(add(h1, mul(dB, bL)), mul(nB, -18)), add(add(h1, mul(dB, 20)), mul(nB, -20)), add(h1, mul(nB, -12))];
    const bD = f.part(bl, { fill: mix(P.wood, P.linenL, 0.45), shadow: P.woodD, tex: 'grain' + seed, texOp: 0.55, shade: 0.42, maxShade: 10, inkW: 1.6 });
    X.clipDraw(f, bD, () => { f.line([add(add(h1, mul(dB, 24)), mul(nB, 20)), add(add(h1, mul(dB, bL - 4)), mul(nB, 18))], 4, '#e4e0d0', { op: 0.4 }); X.stains(f, bD, [h1[0] - 60, h1[1] - 60, btE[0] + 60, btE[1] + 60], P.mouldD, 0.06, 3, -1.8, 7, 0.5); });
    f.part([add(add(h1, mul(dB, bL)), mul(nB, 24)), add(add(h1, mul(dB, bL)), mul(nB, 30)), add(add(h1, mul(dB, 22)), mul(nB, 32)), add(add(h1, mul(dB, 20)), mul(nB, 26))], { fill: P.woodD, shade: 0.3, inkW: 1.1, cast: false }); // its thickness
    FX.rime([add(add(h1, mul(dB, 30)), mul(nB, 28)), add(add(h1, mul(dB, bL)), mul(nB, 26))], 5, 1);
    FX.icicles([add(add(h1, mul(dB, 30)), mul(nB, -20)), add(add(h1, mul(dB, bL - 10)), mul(nB, -18))], 3, 14, 4);
    for (let i = 0; i < 5; i++) f.line([add(btE, [-30 - i * 22, 12 + (i % 2) * 2]), add(btE, [-50 - i * 22, 12])], 1.6, P.frostS, { op: 0.6 }); } // scrape marks on the frozen floor
  X.arm(f, SF, EF, WF, '_f', { ws: [46, 38, 30], skin: SKd({ fill: mix(P.skin, P.skinD, 0.25) }), sleeve: { look: LIN({ fill: mix(P.linen, '#000', 0.12) }), to: 0.85, roll: true } });
  f.bone('forearm_f'); for (let i = 0; i < 3; i++) f.line([lp(EF, WF, 0.3 + i * 0.15, -10), lp(EF, WF, 0.34 + i * 0.15, 10)], 2, P.skinL, { op: 0.55 }); // old lye scars

  // ---- legs: grey shins under the shift, the feet in wooden pattens on their iron rings
  X.leg(f, FX, HF, KF, AF, '_f', { ws: [74, 52, 36], look: SKd({ fill: mix(P.skin, P.skinD, 0.2) }), foot: 'patten', fs: 46, shoe: P.leatherD });
  X.leg(f, FX, HN, KN, AN, '_n', { ws: [74, 52, 36], look: SKd(), foot: 'patten', fs: 46, shoe: P.leatherD });
  f.bone('shin_n'); X.livid(f, lerp(KN, AN, 0.5), 14, 30, 4); X.sore(f, lp(KN, AN, 0.55, 8), 4);
  f.bone('shin_f'); X.livid(f, lerp(KF, AF, 0.5), 14, 30, 4);

  // ---- the shift's skirt, heavy linen to mid-calf, the hem frozen in folds; the sacking apron over it
  f.bone('skirt');
  const skL = [], hem = []; { let x = 172; const dep = [6, 20, 10, 26, 4, 16, 24, 8, 18, 2]; let i = 0; while (x < 430) { hem.push([x, 690 + (x - 172) * 0.05 + dep[i % dep.length] * 0.8 + R(f, -3, 3), dep[i % dep.length] > 15 ? 1 : 0]); x += 18 + f.r() * 20; i++; } }
  const skirt = [S.at(-0.72, 0.78), S.at(0.68, 0.76), [404, 560], [432, 650], ...hem.slice().reverse(), [178, 660], [200, 560]];
  const skD = f.part(skirt, LIN({ fill: mix(P.linen, P.linenD, 0.2), maxShade: 40 }));
  X.stains(f, skD, [160, 440, 450, 720], '#0b0b08', 0.03, 3, -1.6, 11, 0.6); X.stains(f, skD, [160, 440, 450, 720], P.mouldD, 0.04, 3.2, -2.0, 13, 0.55);
  X.clipDraw(f, skD, () => { for (let i = 0; i < 6; i++) { const x = 196 + i * 42; f.stroke([[x + 8, 500], [x, 600], [x + 6, 700]], 4, '#141410', { op: 0.5 }); } X.softTone(f, skD, [[[[160, 460], [260, 460], [240, 720], [160, 720]], '#000', 0.35, 16]]); });
  FX.icicles(hem.map(q => [q[0], q[1] - 3]), 7, 20, 5); X.fungalFur(f, hem, 6, -1, { gaps: 0.4 });
  X.bubo(f, S.at(-0.3, 1.04), 14, { sag: 0.5, cast: false }); // the groin bubo pushing the shift out
  f.bone('apron');
  const ap = [S.at(-0.3, 0.8), S.at(0.62, 0.78), [420, 590], [...[428, 676], 1], [400, 664], [...[372, 684], 1], [340, 668], [...[300, 682], 1], [276, 660], [262, 560]];
  const apD = f.part(ap, SACK());
  X.stains(f, apD, [250, 450, 440, 700], '#0b0b08', 0.04, 3, -1.4, 15, 0.6);
  X.clipDraw(f, apD, () => { for (let i = 0; i < 3; i++) f.stroke([[300 + i * 40, 520], [296 + i * 42, 600], [302 + i * 40, 670]], 3, '#100f0c', { op: 0.5 }); });
  for (let i = 0; i < 14; i++) { const q = [R(f, 280, 420), R(f, 560, 660)]; f.part(ell(q, R(f, 4, 9), R(f, 3, 6), 0, 8).map(p => add(p, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), { fill: '#d6dcd4', shadow: P.frostS, shade: 0.4, inkW: 0.8, cast: false, hatch: false, k: 0.8 }); } // frozen suds crusted on the apron
  // the peg bag at the apron's corner: a little sack on a tape, wooden pegs sticking out of its mouth
  { const q = [404, 600]; f.line([S.at(0.5, 0.82), add(q, [-4, -26])], 2, P.linenD); f.part([add(q, [-20, -24]), add(q, [16, -26]), add(q, [20, 14]), add(q, [0, 26]), add(q, [-22, 14])], SACK({ fill: P.linenD, maxShade: 8 })); for (let i = 0; i < 4; i++) { const b0 = add(q, [-12 + i * 8, -24]); f.part(limb(b0, add(b0, [-3 + i * 2, -22]), 6, 5, { steps: 3 }), { fill: mix(P.wood, P.linenL, 0.4), shade: 0.4, inkW: 0.9, cast: false }); f.line([add(b0, [-1, -10]), add(b0, [-1, -20])], 1, INK, { op: 0.7 }); } }

  // ---- torso: a stout body in the linen shift, a belt of tape, the heavy bosom and belly
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.36], [0.04, 0.72, 0.56], [0.18, 0.86, 0.82], [0.34, 0.84, 0.94], [0.5, 0.82, 0.92], [0.66, 0.84, 0.9], [0.82, 0.88, 0.86], [0.94, 0.9, 0.84]]);
  const tD = f.part(torso, LIN());
  X.stains(f, tD, [190, 270, 450, 520], P.mouldD, 0.04, 3, -1.9, 17, 0.55);
  X.clipDraw(f, tD, () => { X.softTone(f, tD, [[[S.at(-1, 0), S.at(-0.4, 0), S.at(-0.4, 1), S.at(-1, 1)], '#000', 0.4, 14], [[S.at(0.2, 0.3), S.at(0.9, 0.3), S.at(0.9, 0.5), S.at(0.2, 0.5)], '#000', 0.3, 10]]); for (let i = 0; i < 3; i++) f.stroke([S.at(0.0 + i * 0.25, 0.1), S.at(0.1 + i * 0.25, 0.3), S.at(0.15 + i * 0.25, 0.45)], 2.4, '#141410', { op: 0.45 }); });
  f.part([S.at(-0.8, 0.76), S.at(0.8, 0.74), S.at(0.82, 0.82), S.at(-0.8, 0.84)].map(q => [...q, 1]), LIN({ fill: P.linenD, maxShade: 4 })); // apron tape
  FX.rime([S.at(-0.3, -0.06), S.at(-0.7, 0.1), S.at(-0.8, 0.4)], 7, 1);

  // ---- the sheet's front half over the far shoulder, a stiff frozen fold hanging down her front
  f.bone('sheet');
  { const fr = [S.at(-0.3, -0.12), S.at(0.3, -0.14), S.at(0.72, 0.02), S.at(0.84, 0.3), [...S.at(0.8, 0.56), 1], S.at(0.66, 0.5), [...S.at(0.6, 0.62), 1], S.at(0.48, 0.48), S.at(0.3, 0.2), S.at(0.0, 0.04)];
    const fD = f.part(fr, LIN({ fill: mix(P.linenL, P.frost, 0.35), maxShade: 16 }));
    X.clipDraw(f, fD, () => { for (let i = 0; i < 3; i++) f.stroke([S.at(0.2 + i * 0.16, -0.06), S.at(0.4 + i * 0.12, 0.2), S.at(0.5 + i * 0.1, 0.5)], 3, '#16170f', { op: 0.45 }); FX.glaze(fr, 0.25); });
    FX.icicles([S.at(0.8, 0.56), S.at(0.6, 0.62)], 3, 22, 5); FX.rime([S.at(0.3, -0.14), S.at(0.72, 0.0)], 6, 1); }

  // ---- the head: a round sagging face under a headcloth, the neck swollen on the near side, mould at the lips
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-8, 14]), hF([[-0.08, 0.42]])[0]], [56, 44]), SKd({ maxShade: 6 }));
  X.bubo(f, hF([[-0.16, 0.5]])[0], 22, { sag: 0.6, mixSkin: 0.6 });
  X.deadHead(f, FX, HC, H, hA, { head: { jaw: 1.22, chin: 0.0, nose: 0.92, hook: 0.0, mouth: 'grim', noEar: true }, lid: 0.12 });
  f.flat(hF([[-0.1, 0.3], [0.05, 0.44], [0.2, 0.5], [0.3, 0.46], [0.24, 0.56], [0.06, 0.58], [-0.12, 0.46]]), '#1e1c18', { op: 0.35 }); // the jowl sagging under the jaw
  X.crease(f, hF([[0.02, 0.34], [0.12, 0.46], [0.24, 0.5]]), 2, { col: '#1e1c18', lit: P.skinL, op: 0.6 });
  X.mould(f, hF([[0.27, 0.3]])[0], 8, 5, { rings: 0 }); X.fungalFur(f, hF([[0.18, 0.31], [0.26, 0.32], [0.32, 0.3]]), 4, 1, { gaps: 0.2 });
  f.bone('cloth');
  // the headcloth: linen over the hair, tied at the nape, a corner hanging down the back
  const hc = hF([[-0.42, 0.18], [-0.48, -0.16], [-0.36, -0.46], [-0.08, -0.58], [0.2, -0.54], [0.36, -0.36], [0.38, -0.24], [0.26, -0.3], [0.02, -0.34], [-0.2, -0.24], [-0.28, 0.06], [-0.26, 0.2]]);
  const hcD = f.part(hc, LIN({ fill: mix(P.linenL, P.frost, 0.15), maxShade: 10 }));
  X.stains(f, hcD, [HC[0] - 60, HC[1] - 70, HC[0] + 50, HC[1] + 30], P.mouldD, 0.06, 3, -1.9, 19, 0.5);
  for (let i = 0; i < 3; i++) f.line(hF([[-0.3 + i * 0.2, -0.46], [-0.26 + i * 0.2, -0.28]]), 1.4, '#16170f', { op: 0.45 });
  { const kn = hF([[-0.44, 0.06]])[0]; f.part(ell(kn, 9, 8, 0, 8), LIN({ cast: false, maxShade: 2 })); f.part([add(kn, [-4, 2]), add(kn, [-20, 40]), [...add(kn, [-14, 62]), 1], add(kn, [-2, 36])], LIN({ maxShade: 4 })); FX.icicle(add(kn, [-14, 62]), 12, 4); }
  FX.rime(hF([[-0.46, -0.2], [-0.32, -0.5], [-0.04, -0.6], [0.24, -0.52]]), 5, 1);

  // ---- the great bubo in the near armpit: grey-green, taut, veined black, rimed and frozen hard, holding the arm out
  f.bone('bubo');
  { const c = [222, 384], r = 62;
    // a heavy pear sagging from a pinched root in the armpit, a second lobe pushing out low on the outside: never a ball
    const pts = [[0.42, -0.98], [-0.18, -0.95], [-0.58, -0.62], [-0.9, -0.16], [-1.12, 0.36], [-1.04, 0.8], [-0.72, 1.1], [-0.22, 1.24], [0.3, 1.2], [0.72, 1.0], [0.98, 0.56], [0.96, 0.06], [0.76, -0.46]].map(([x, y]) => [c[0] + r * x, c[1] + r * y]);
    const gD = f.part(pts, { fill: mix(P.skin, P.mould, 0.45), shadow: '#232820', shade: 0.42, tex: 'mottle' + seed, texOp: 0.7, inkW: 2, inkHeavy: 3, maxShade: 30 });
    X.clipDraw(f, gD, () => {
      X.softTone(f, gD, [[[[c[0] - r, c[1] + r * 0.2], [c[0] + r, c[1] + r * 0.4], [c[0] + r, c[1] + r * 1.3], [c[0] - r, c[1] + r * 1.3]], '#000', 0.45, 16], [[[c[0], c[1] - r * 0.7], [c[0] + r * 0.6, c[1] - r * 0.6], [c[0] + r * 0.5, c[1] - r * 0.2], [c[0] - r * 0.1, c[1] - r * 0.3]], '#ffffff', 0.25, 10]]);
      // black veins dragged taut round the swelling, branching
      for (let i = 0; i < 7; i++) { const a0 = -2.8 + i * 0.7 + R(f, -0.2, 0.2), p0 = add(c, rot([r * 1.05, 0], a0)), p1 = add(c, rot([r * 0.55, R(f, -8, 8)], a0 + 0.4)), p2 = add(c, rot([r * 0.15, R(f, -6, 6)], a0 + 0.9)); f.line([p0, p1, p2], 2.2, '#121410', { op: 0.85 }); f.line([p1, add(p1, rot([12, 8], a0 + 1.2))], 1.2, '#121410', { op: 0.7 }); }
      FX.glaze(pts, 0.28);
      FX.cracks(add(c, [10, -10]), 30, 3, -0.4);
      X.crease(f, [add(c, [-r * 0.98, r * 0.28]), add(c, [-r * 0.72, r * 0.62]), add(c, [-r * 0.36, r * 0.82])], 3.2, { col: '#121410', lit: P.skinL }); // the fold between the lobes
      for (let i = 0; i < 3; i++) X.crease(f, [add(c, [-r * 0.45 + i * r * 0.3, -r * 0.86 + i * 3]), add(c, [-r * 0.3 + i * r * 0.3, -r * 0.7 + i * 4]), add(c, [-r * 0.1 + i * r * 0.32, -r * 0.82 + i * 3])], 2.2, { col: '#121410', lit: P.skinL, op: 0.6 }); // the skin gathered where it swells out of the armpit
      for (let i = 0; i < 9; i++) { const a0 = R(f, 0, Math.PI * 2), q = add(c, [Math.cos(a0) * r * R(f, 0.4, 0.8), Math.sin(a0) * r * R(f, 0.4, 0.9) + r * 0.2]); f.line([q, add(q, rot([R(f, 8, 16), 0], a0 + Math.PI / 2))], 1.2, P.skinL, { op: 0.45 }); } // stretch marks
    });
    FX.rime([pts[8], pts[0], pts[1], pts[2]], 10, 1); FX.frost(add(c, [0, -r * 0.4]), r * 0.5, r * 0.2, 8);
    f.flat(ell(add(c, [r * 0.3, -r * 0.5]), r * 0.22, r * 0.1, -0.5, 8), P.hoar, { op: 0.55 }); // the taut shine
    FX.icicles([[c[0] - r * 0.6, c[1] + r * 0.95], [c[0] + r * 0.1, c[1] + r * 1.2], [c[0] + r * 0.6, c[1] + r * 0.9]], 3, 22, 6); }

  // ---- the near arm, held out stiff: the sleeve torn open by the swelling, hanging in a flap; the bare forearm
  X.arm(f, SN, EN, WN, '_n', { ws: [52, 42, 32], skin: SKd(), mus1: 0.32, sleeve: { look: LIN({ fill: mix(P.linen, P.linenL, 0.2) }), to: 0.55, rag: 16, teeth: 7 } });
  f.bone('upperarm_n');
  f.part([lp(SN, EN, 0.4, 26), lp(SN, EN, 0.58, 30), [...lp(SN, EN, 0.7, 48), 1], lp(SN, EN, 0.62, 56), [...lp(SN, EN, 0.5, 66), 1], lp(SN, EN, 0.44, 44)], LIN({ maxShade: 6 })); // the torn sleeve flap hanging off the arm
  FX.rime([lp(SN, EN, 0.0, -28), lp(SN, EN, 0.6, -26), lp(SN, EN, 1.0, -22)], 6, -1);
  f.bone('forearm_n'); X.livid(f, lerp(EN, WN, 0.5), 14, 10, 4); FX.rime([lp(EN, WN, 0.1, -20), lp(EN, WN, 0.8, -15)], 5, -1); FX.icicle(lp(EN, WN, 0.04, 18), 18, 5);
  f.bone('hand_n');
  const hn = X.openHand(f, WN, ang(EN, WN) + 0.4, 78, { look: SKd({ fill: mix(P.skin, P.skinD, 0.1) }), back: true, flip: true, spread: 0.12, curl: 0.45, swell: 0.3, nail: '#5a5a52' });
  for (const g of hn.fing.slice(0, 3)) f.line([lerp(g.k0, g.k1, 0.1), lerp(g.k0, g.k1, 0.5)], 2, P.skinL, { op: 0.6 }); // lye scars across the knuckles
  f.bone('hand_f');
  X.grip(f, WF, EF, btA, 25, mix(P.skin, P.skinD, 0.2), 'swollen beetle', { inline: true });
  f.bone('root');
  f.flat(ell([300, gy + 2], 170, 6, 0, 16), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ BARROW MASON (cast, large 1.4)
// The mason who walled up the barrow's entrance from within: he laid the last stone from the inside and is still laying
// them. Huge, broad and heavy, legs planted wide and bent under the load: a hod of three squared stones on the near
// shoulder, his near hand on its pole; a big mallet hanging from the far fist.
// Remnant of the trade: the hod, the mallet, the trowel, the chisel roll, the plumb bob, the set square, his mark on a
// lead tag, the apron white with frozen lime. The one mark pushed hard is toxin's in his hands: the knuckles swollen into
// knots, mould grown in the cracks of the skin like mortar in a wall. Frost freezes the stone dust into his skin and beard.
// Rig: standard humanoid + hod (torso; the near hand on its pole) + mallet (parent hand_f) + apron (pelvis) + cap (head).
// Motion: idle tapping a stone with the mallet; attack a mallet blow; his action walls a hero in (Stun).
function barrowMason() {
  const [CW, CH] = TIERS.large, seed = 929;
  const f = new Fig(X.base(seed, CH, { grimeY: 800 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 140, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, Object.assign({ fill: mix(P.skin, P.stoneL, 0.25), maxShade: 30 }, o));
  const WOOL = (o = {}) => Object.assign({ fill: mix(P.wool, P.stone, 0.3), shadow: '#1e1f1a', tex: 'weave' + seed, texOp: 0.5, shade: 0.42, maxShade: 40 }, o);
  const APR = (o = {}) => Object.assign({ fill: mix(P.leather, P.linenL, 0.35), shadow: '#1a1913', tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, maxShade: 40 }, o);
  const STN = (o = {}) => Object.assign({ fill: P.stone, shadow: P.stoneD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.85, inkW: 1.8, maxShade: 30 }, o);
  const N = [470, 372], C = [446, 520], Pv = [434, 660];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.34, 0.12), SF = S.at(0.4, 0.1);
  const hodP0 = [392, 396], hodP1 = [452, 790], hodA = ang(hodP1, hodP0);   // the hod's pole, from under the trough down in front
  const WN = lerp(hodP0, hodP1, 0.62), EN = X.ik(SN, WN, 168, 150, -1)[0]; // the hand low on the hod pole, the elbow hanging down at his side
  const WF = [616, 690], EF = X.ik(SF, WF, 168, 150, -1)[0];
  const HN = [390, 668], AN = [262, 1010], KN = X.ik(HN, AN, 210, 182, 1)[0];
  const HF = [472, 660], AF = [618, 1010], KF = X.ik(HF, AF, 210, 182, -1)[0];
  const neck0 = S.at(0.16, -0.04), HC = [506, 302], hA = 0.05;
  const mA = deg(76), mHead = add(WF, rot([196, 0], mA));                      // the mallet hangs from the fist
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('hod', S.at(-0.4, 0.0), 'torso').joint('mallet', WF, 'hand_f').joint('apron', S.at(0.2, 0.84), 'pelvis').joint('cap', add(HC, [0, -40]), 'head');

  // ---- far arm (behind) and the mallet: a turned beech head bound in iron, an ash handle through the fist
  f.bone('mallet');
  { const h0 = add(WF, rot([-34, 0], mA)), dM = rot([1, 0], mA), nM = [-dM[1], dM[0]];
    f.part(limb(h0, mHead, 34, 30, { steps: 6 }), { fill: mix(P.wood, P.woodL, 0.3), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.6, maxShade: 6 });
    const mc = add(mHead, mul(dM, 50)), MW = 92, ML = 150; // the head: a drum seen three-quarter on, the striking face toward us
    const drum = [add(add(mc, mul(nM, ML / 2)), mul(dM, -MW / 2)), add(add(mc, mul(nM, ML / 2)), mul(dM, MW / 2)), add(add(mc, mul(nM, -ML / 2)), mul(dM, MW / 2)), add(add(mc, mul(nM, -ML / 2)), mul(dM, -MW / 2))];
    const dD = f.part(drum.map(q => [...q, 0]), { fill: mix(P.wood, P.woodL, 0.35), shadow: P.woodD, tex: 'grain' + seed, texOp: 0.6, shade: 0.42, maxShade: 26, inkW: 2 });
    X.clipDraw(f, dD, () => { X.stains(f, dD, [mc[0] - 120, mc[1] - 120, mc[0] + 120, mc[1] + 120], '#0b0b08', 0.05, 3, -1.5, 7, 0.6); for (const k of [-0.36, 0.36]) f.line([add(add(mc, mul(nM, ML * k)), mul(dM, -MW / 2)), add(add(mc, mul(nM, ML * k)), mul(dM, MW / 2))], 10, P.iron); });
    const face = ell(add(mc, mul(nM, -ML / 2)), 16, MW / 2, mA, 16);
    f.part(face, { fill: mix(P.wood, P.linenL, 0.45), shadow: P.woodD, shade: 0.4, inkW: 1.8, cast: false }); // the striking face, battered and pale
    for (let i = 0; i < 5; i++) f.line([add(add(mc, mul(nM, -ML / 2)), mul(dM, R(f, -40, 40))), add(add(mc, mul(nM, -ML / 2 + 4)), mul(dM, R(f, -40, 40)))], 1.2, INK, { op: 0.6 });
    FX.rime(drum.slice(0, 2), 7, 1); X.mould(f, add(mc, mul(dM, 26)), 16, 10, { rings: 1 }); FX.icicles([drum[2], drum[3]], 3, 22, 6); }
  X.arm(f, SF, EF, WF, '_f', { ws: [86, 72, 54], skin: SKd({ fill: mix(P.skin, P.skinD, 0.3) }), mus0: 0.2, mus1: 0.34, point: 0.2, model: true });
  f.bone('upperarm_f'); X.creaseField(f, lerp(SF, EF, 0.5), 20, 30, 4, ang(SF, EF), 30, 2.2, { lit: P.skinL });
  f.bone('forearm_f'); X.mould(f, lp(EF, WF, 0.4, 10), 14, 10, { rings: 1 }); for (let i = 0; i < 4; i++) X.crease(f, [lp(EF, WF, 0.2 + i * 0.18, -16), lp(EF, WF, 0.26 + i * 0.18, 0), lp(EF, WF, 0.22 + i * 0.18, 18)], 2.6, { col: '#1e1c1a', lit: P.skinL, op: 0.55 });

  // ---- legs: wool breeches, linen wraps to the knee, heavy shoes, white with lime and stone dust
  X.leg(f, FX, HF, KF, AF, '_f', { ws: [120, 86, 62], look: WOOL({ fill: mix(P.wool, '#000', 0.12) }), wraps: mix(P.linen, P.stoneL, 0.3), turns: 8, foot: 'boot', fs: 82, shoe: P.leather, dirt: 0.3 });

  // ---- the apron's skirt (leather, white with frozen lime mortar) and the tunic under it
  f.bone('apron');
  const apS = [S.at(-0.5, 0.8), S.at(0.7, 0.78), [604, 760], [...[612, 880], 1], [570, 870], [...[530, 892], 1], [480, 872], [...[430, 890], 1], [390, 866], [370, 760]];
  const aD = f.part(apS, APR());
  X.stains(f, aD, [350, 600, 640, 900], '#8a8e86', 0.06, 3, -1.5, 3, 0.6); // lime
  X.stains(f, aD, [350, 600, 640, 900], '#0b0b08', 0.04, 3, -1.6, 5, 0.5);
  for (let i = 0; i < 4; i++) f.stroke([[410 + i * 52, 700], [404 + i * 54, 800], [412 + i * 50, 874]], 4, '#100f0c', { op: 0.45 });
  for (let i = 0; i < 18; i++) { const q = [R(f, 390, 600), R(f, 720, 870)]; f.part(ell(q, R(f, 4, 10), R(f, 3, 7), 0, 8).map(p => add(p, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), { fill: '#d2d6cc', shadow: P.frostS, shade: 0.4, inkW: 0.8, cast: false, hatch: false, k: 0.8 }); } // lumps of frozen mortar
  // the set square tucked in the apron's top, an iron L
  { const q = S.at(0.56, 0.86); f.part([q, add(q, [10, -4]), add(q, [6, 92]), add(q, [64, 92]), add(q, [64, 104]), add(q, [-4, 104])].map(p => [...p, 1]), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.3, cast: true, tex: 'mottle' + seed, texOp: 0.6 }); for (let i = 1; i < 6; i++) f.line([add(q, [0, 16 * i]), add(q, [6, 16 * i])], 1.2, P.ironL); }

  // ---- torso: a sleeveless wool tunic over a huge chest; the apron's bib over it on a neck strap
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.42, 0.44], [0.04, 0.86, 0.66], [0.18, 1.0, 0.92], [0.34, 0.96, 1.02], [0.5, 0.88, 0.96], [0.66, 0.82, 0.88], [0.82, 0.84, 0.86], [0.96, 0.86, 0.84]]);
  const tD = f.part(torso, WOOL());
  X.stains(f, tD, [300, 330, 640, 700], '#8a8e86', 0.05, 3, -1.7, 9, 0.5);
  X.clipDraw(f, tD, () => X.softTone(f, tD, [[[S.at(-1.1, 0), S.at(-0.5, 0), S.at(-0.5, 1), S.at(-1.1, 1)], '#000', 0.35, 20]]));
  const bib = [S.at(-0.3, 0.18), S.at(0.56, 0.16), S.at(0.7, 0.5), S.at(0.72, 0.82), S.at(-0.5, 0.82), S.at(-0.44, 0.5)];
  const bD = f.part(bib, APR());
  X.stains(f, bD, [330, 380, 640, 700], '#8a8e86', 0.06, 3, -1.5, 11, 0.6);
  f.line([S.at(-0.3, 0.18), S.at(-0.1, -0.04), S.at(0.2, -0.06), S.at(0.56, 0.16)], 5, P.leatherD); // the neck strap
  f.part([S.at(-0.6, 0.76), S.at(0.76, 0.74), S.at(0.78, 0.84), S.at(-0.6, 0.86)].map(q => [...q, 1]), { fill: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  // trowel through the belt, chisels in a leather roll, a plumb bob on a cord
  { const q = S.at(0.4, 0.8); f.part([add(q, [-6, -70]), add(q, [6, -70]), add(q, [8, 0]), add(q, [-8, 0])], { fill: P.wood, shade: 0.4, inkW: 1.2, cast: false }); f.part([add(q, [0, 0]), add(q, [-30, 20]), [...add(q, [-4, 110]), 1], add(q, [28, 22])], { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.6 }); f.flat([add(q, [-10, 60]), add(q, [10, 60]), add(q, [-2, 100])], '#d8dcd2', { op: 0.6 }); }
  { const q = S.at(-0.36, 0.9); f.part([add(q, [-26, -10]), add(q, [30, -10]), add(q, [32, 60]), add(q, [-24, 64])], { fill: P.leather, shadow: P.leatherD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.4 }); for (let i = 0; i < 4; i++) { const b0 = add(q, [-16 + i * 13, -10]); f.part([add(b0, [-4, 0]), add(b0, [4, 0]), add(b0, [3, -30 - i * 4]), add(b0, [-3, -30 - i * 4])], { fill: P.iron, shade: 0.4, inkW: 1, cast: false }); f.rivet(add(b0, [0, -30 - i * 4]), 2.6, P.ironL); } f.line([add(q, [-26, 20]), add(q, [32, 18])], 3, P.leatherD); }
  { const q = S.at(0.0, 0.92); f.line([q, add(q, [4, 90])], 1.4, P.linenL); f.part([add(q, [-8, 90]), add(q, [12, 88]), add(q, [4, 124])], { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.2, cast: false }); }
  FX.rime([S.at(-0.4, -0.06), S.at(-0.8, 0.1), S.at(-0.96, 0.4)], 10, 1);
  X.fungalFur(f, [S.at(-0.9, 0.5), S.at(-0.9, 0.7)], 8, 1, { gaps: 0.3 });

  // ---- head: square and heavy, a broken nose, stone dust frozen in the beard, a cloth cap, his mark on a lead tag
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-10, 20]), hF([[-0.08, 0.4]])[0]], [100, 82]), SKd({ maxShade: 10 }));
  { const q = add(neck0, [24, 26]); f.line([add(neck0, [-30, 0]), q, add(neck0, [60, -6])], 1.6, P.leatherD); f.part([add(q, [-14, 0]), add(q, [14, 0]), add(q, [14, 28]), add(q, [-14, 28])].map(p => [...p, 1]), { fill: '#6c706c', shadow: '#2c2e2c', shade: 0.4, inkW: 1.2, cast: false }); f.line([add(q, [-6, 8]), add(q, [6, 8]), add(q, [0, 22]), add(q, [-6, 8])], 1.6, INK, { op: 0.8 }); f.line([add(q, [0, 8]), add(q, [0, 22])], 1.4, INK, { op: 0.8 }); } // the lead tag cut with his mark
  X.deadHead(f, FX, HC, H, hA, { head: { jaw: 1.3, chin: 0.06, nose: 1.12, hook: -0.2, mouth: 'set', noEar: false, beard: 'full', beardCol: mix('#8a8c84', P.stoneL, 0.4), hairCol: '#7a7c74' }, lid: 0.08 });
  f.line(hF([[0.31, -0.06], [0.355, 0.0], [0.33, 0.04], [0.38, 0.1]]), 3, '#1e1c18', { op: 0.6 }); // the nose broken, bent off its line
  f.flat(hF(ell([0.33, 0.02], 0.03, 0.02, 0.5, 6)), P.bruise, { op: 0.4 });
  for (let i = 0; i < 40; i++) { const q = hF([[R(f, -0.1, 0.36), R(f, 0.3, 0.62)]])[0]; f.flat(ell(q, R(f, 0.8, 2), R(f, 0.8, 1.6), 0, 5), f.r() > 0.5 ? '#e4e8e0' : P.stoneL, { op: 0.75 }); } // stone dust frozen in the beard
  FX.icicles(hF([[0.0, 0.62], [0.2, 0.66], [0.34, 0.56]]), 4, 18, 5);
  f.bone('cap');
  { const cap = hF([[-0.46, -0.12], [-0.46, -0.4], [-0.3, -0.6], [0.0, -0.66], [0.28, -0.58], [0.4, -0.38], [0.36, -0.26], [0.1, -0.3], [-0.2, -0.2]]);
    const cD = f.part(cap, WOOL({ fill: mix(P.linen, P.stone, 0.3), maxShade: 14 }));
    X.stains(f, cD, [HC[0] - 80, HC[1] - 100, HC[0] + 70, HC[1]], '#8a8e86', 0.07, 3, -1.6, 13, 0.6);
    for (let i = 0; i < 3; i++) f.line(hF([[-0.3 + i * 0.22, -0.56], [-0.28 + i * 0.22, -0.3]]), 1.6, '#16170f', { op: 0.45 });
    f.line(hF([[-0.46, -0.16], [-0.1, -0.24], [0.36, -0.28]]), 3, '#16170f', { op: 0.5 });
    FX.rime(hF([[-0.46, -0.38], [-0.3, -0.6], [0.0, -0.68], [0.28, -0.6]]), 7, 1); }

  // ---- near leg
  X.leg(f, FX, HN, KN, AN, '_n', { ws: [124, 88, 64], look: WOOL(), wraps: mix(P.linen, P.stoneL, 0.35), turns: 8, foot: 'boot', fs: 84, shoe: P.leather, dirt: 0.3 });
  f.bone('shin_n'); X.mould(f, lp(KN, AN, 0.5, 20), 14, 18, { rings: 1 });

  // ---- the hod on the near shoulder: a wooden V-trough on its pole, three squared stones in it, rimed, mortar on the lip
  f.bone('hod');
  { const t0 = [462, 384], t1 = [208, 350], dT = E.norm(sub(t0, t1)), nT = [-dT[1], dT[0]];
    // the stones first, sitting in the trough and standing above its rim, each with a lit top face and tool marks
    const stone = (c, w, h, k) => {
      const dp = [w * 0.22, -h * 0.26], fr = [[c[0] - w / 2, c[1] - h / 2], [c[0] + w / 2, c[1] - h / 2 + 4], [c[0] + w / 2, c[1] + h / 2], [c[0] - w / 2, c[1] + h / 2 - 3]];
      const top = [fr[0], add(fr[0], dp), add(fr[1], dp), fr[1]], sd = [fr[1], add(fr[1], dp), add(fr[2], dp), fr[2]];
      f.part(sd.map(q => [...q, 1]), STN({ fill: P.stoneD, maxShade: 6 }));
      const fD = f.part(fr.map(q => [...q, 1]), STN());
      f.part(top.map(q => [...q, 1]), STN({ fill: P.stoneL, maxShade: 4 }));
      X.clipDraw(f, fD, () => { for (let i = 0; i < 7; i++) f.line([[fr[0][0] + 6 + i * w / 7, fr[0][1] + 4], [fr[0][0] + 2 + i * w / 7, fr[3][1] - 4]], 1, INK, { op: 0.35 }); }); // the tooling: drafted face
      FX.rime(top.slice(0, 3), 6, -1); if (k === 1) X.mould(f, add(c, [0, h * 0.2]), 12, 8, { rings: 1 });
    };
    stone([256, 300], 84, 76, 0); stone([334, 296], 80, 82, 1); stone([408, 316], 74, 70, 2);
    // the trough: two boards in a V, its closed end toward the back, seen from below and the near side
    const tr = [add(t1, mul(nT, -46)), add(t0, mul(nT, -40)), add(t0, mul(nT, 26)), add(lerp(t0, t1, 0.5), mul(nT, 54)), add(t1, mul(nT, 30))];
    const trD = f.part(tr.map(q => [...q, 1]), { fill: mix(P.wood, P.woodL, 0.2), shadow: P.woodD, tex: 'grain' + seed, texOp: 0.7, shade: 0.42, maxShade: 20, inkW: 2 });
    X.clipDraw(f, trD, () => { f.line([add(t1, mul(nT, -4)), add(t0, mul(nT, -2))], 3, '#141410', { op: 0.7 }); X.stains(f, trD, [180, 280, 500, 460], '#8a8e86', 0.07, 3, -1.6, 17, 0.6); });
    f.part([add(t1, mul(nT, -50)), add(t1, mul(nT, -40)), add(t1, mul(nT, 34)), add(t1, mul(nT, 26))].map(q => [...q, 1]), { fill: P.woodD, shade: 0.3, inkW: 1.4, cast: false }); // the end board
    for (const t of [0.2, 0.8]) { const q = lerp(t1, t0, t); f.rivet(add(q, mul(nT, -30)), 3, P.ironL); }
    FX.rime([add(t1, mul(nT, -46)), add(lerp(t0, t1, 0.5), mul(nT, -44)), add(t0, mul(nT, -40))], 6, 1);
    FX.icicles([add(t1, mul(nT, 30)), add(lerp(t0, t1, 0.5), mul(nT, 54)), add(t0, mul(nT, 26))], 5, 26, 6);
    // the pole, from the trough's underside down in front of the chest
    f.part(limb(hodP0, hodP1, 26, 22, { steps: 8 }), { fill: mix(P.wood, P.woodL, 0.25), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.6, maxShade: 6 });
    f.part([add(hodP0, [-30, -14]), add(hodP0, [30, -18]), add(hodP0, [22, 14]), add(hodP0, [-22, 16])], { fill: P.woodD, shade: 0.4, inkW: 1.3, cast: false }); // the shoulder pad block
    f.line([lp(hodP0, hodP1, 0.1, 6), lp(hodP0, hodP1, 0.95, 5)], 1.4, '#a8a290', { op: 0.4 }); }

  // ---- near arm, the hand on the hod pole: a huge bare arm, the knuckles swollen into knots, mould in the cracks
  X.arm(f, SN, EN, WN, '_n', { ws: [92, 74, 56], skin: SKd(), mus0: 0.2, mus1: 0.34, point: 0.12, model: true });
  f.bone('upperarm_n'); X.creaseField(f, lerp(SN, EN, 0.5), 20, 34, 4, ang(SN, EN), 30, 2.4, { lit: P.skinL }); FX.rime([lp(SN, EN, 0.0, -48), lp(SN, EN, 0.6, -44), lp(SN, EN, 1.0, -36)], 8, -1);
  f.bone('forearm_n'); for (let i = 0; i < 5; i++) { const q = lp(EN, WN, 0.15 + i * 0.16, R(f, -14, 14)); f.line([q, add(q, [R(f, -10, 10), R(f, 8, 16)]), add(q, [R(f, -6, 6), R(f, 18, 26)])], 2.4, P.mouldD, { op: 0.8 }); f.line([add(q, [1, 0]), add(q, [R(f, -8, 8), 12])], 1.2, P.mouldL, { op: 0.7 }); } // cracks in the skin, mould grown in them like mortar
  const knots = (g, s) => { for (let i = 0; i < 4; i++) { const q = g.F([[0.38, -0.45 + i * 0.3]])[0]; f.part(ell(q, s * 0.16, s * 0.13, 0, 9), SKd({ fill: mix(P.skin, P.bruise, 0.3), inkW: 1, inkHeavy: 1.3, cast: false, maxShade: 3 })); f.flat(ell(add(q, [2, -2]), s * 0.05, s * 0.04, 0, 6), P.skinL, { op: 0.6 }); } X.mould(f, g.F([[0.1, 0.0]])[0], s * 0.22, s * 0.14, { rings: 1 }); };
  f.bone('hand_n');
  const gN = X.grip(f, WN, EN, hodA, 46, mix(P.skin, P.stoneL, 0.2), 'mason hod', { nail: '#5a5a52' });
  knots(gN, 46);
  { const tn = gN.F([[0.5, -0.74]])[0]; f.line([add(tn, [-3, -4]), add(tn, [3, 4])], 1.6, INK); } // the split thumbnail
  f.bone('hand_f');
  const gF = X.grip(f, WF, EF, mA + Math.PI, 44, mix(P.skin, P.skinD, 0.2), 'mason mallet', { inline: true, nail: '#5a5a52' });
  knots(gF, 44);
  f.bone('root');
  f.flat(ell([440, gy + 2], 260, 8, 0, 18), P.frostD, { op: 0.45 });
  for (let i = 0; i < 10; i++) f.flat(ell([R(f, 220, 680), gy - R(f, 0, 4)], R(f, 4, 10), R(f, 2, 4), 0, 6), '#d8dcd2', { op: 0.7 }); // spilled mortar
  return f;
}

// ------------------------------------------------------------------ COURT FOOL (cast, human 0.9 standing, 0.55 seated)
// The king's fool, who kept the court laughing while the doors were sealed, then sat down on the dais steps after the
// last joke to wait. Seated and slumped (the bible's pose): knees drawn up and splayed, forearms resting on them with the
// hands hanging limp, the marotte lying across his lap, the hooded head sunk forward between the hunched shoulders and
// the face looking up from under the three limp points of the hood.
// Remnant of the trade: the motley of chequered halves, the three-pointed hood with its bells, the marotte carved with the
// king's head, the slapstick, the ruff, the wrist bells, the cracked face paint. The one mark pushed hard is frost's: he
// froze where he sat, frost settled on every upturned surface (shoulders, knees, the crown of the hood, the steps) and
// icicles hang from the elbows and the hood's points; toxin furs his armpits and groin and sores the corners of the grin.
// Rig: pelvis (root, on the step) > torso > head > hood > point_1..3; arms; legs; marotte (pelvis); steps (root).
// Motion: idle the head lifting slowly and the marotte giving one half-hearted jingle; attack a joke that causes stress.
function courtFool() {
  const [CW, CH] = TIERS.human, seed = 926;
  const f = new Fig(X.base(seed, CH, { grimeY: 600 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 90, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, o);
  const BONE = '#b8b2a0', GREEN = mix(P.mould, P.frostS, 0.25);
  f.defs.push(`<pattern id="chkA${seed}" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(-8)"><rect width="24" height="24" fill="${BONE}"/><rect width="12" height="12" fill="${mix(BONE, '#2a2a24', 0.45)}"/><rect x="12" y="12" width="12" height="12" fill="${mix(BONE, '#2a2a24', 0.45)}"/></pattern>`);
  f.defs.push(`<pattern id="chkB${seed}" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(-8)"><rect width="24" height="24" fill="${GREEN}"/><rect width="12" height="12" fill="${mix(GREEN, '#141612', 0.5)}"/><rect x="12" y="12" width="12" height="12" fill="${mix(GREEN, '#141612', 0.5)}"/></pattern>`);
  const MOT = (k, o = {}) => Object.assign({ fill: k ? GREEN : BONE, shadow: '#1c1d18', tex: k ? 'chkB' + seed : 'chkA' + seed, texOp: 0.75, shade: 0.42, maxShade: 18 }, o);
  const STP = (o = {}) => Object.assign({ fill: mix(P.stone, P.mould, 0.15), shadow: P.stoneD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.85, inkW: 1.6, maxShade: 30 }, o);
  const s1 = 722, s2 = 652;                                               // the dais steps: lower tread, upper tread (his seat)
  const N = [300, 456], C = [228, 548], Pv = [250, 626];                  // the back slumped round, the shoulders hunched up
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.1), SF = S.at(0.36, 0.08);
  const HN = [240, 636], KN = [340, 548], AN = [370, s1 - 52];            // knees drawn up and splayed, the feet on the lower step
  const HF = [266, 628], KF = [376, 532], AF = [410, s1 - 58];
  const EN = add(KN, [-12, -28]), WN = add(EN, rot([86, 0], deg(28)));    // forearms resting on the knees, the hands hanging past them
  const EF = add(KF, [-10, -26]), WF = add(EF, rot([84, 0], deg(34)));
  const neck0 = S.at(0.16, -0.04), HC = [338, 444], hA = 0.34;
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('steps', [300, s2]).joint('marotte', [260, 600], 'pelvis').joint('hood', add(HC, [-20, -30]), 'head');
  ['point_1', 'point_2', 'point_3'].forEach((k, i) => f.joint(k, add(HC, [-10 + i * 18, -40]), 'hood'));

  // ---- the dais steps under him: stone, rimed grey-green, mould in the joints, a dropped silver cup frozen to the tread
  f.bone('steps');
  const step = (yT, yF, x0, x1, dz, far) => {
    const top = [[x0, yT], [x1, yT], [x1 + dz, yT - dz * 0.4], [x0 + dz, yT - dz * 0.4]].map(q => [...q, 1]);
    f.part(top, STP({ fill: mix(P.stoneL, P.mould, 0.15), maxShade: 6 }));
    const fr = [[x0, yT], [x1, yT], [x1, yF], [x0, yF]].map(q => [...q, 1]);
    const fD = f.part(fr, STP());
    X.clipDraw(f, fD, () => { for (let x = x0 + 120 + (far ? 60 : 0); x < x1; x += 190) X.crease(f, [[x, yT + 2], [x + 3, yF - 2]], 3.4, { col: '#141614', lit: P.stoneL }); X.stains(f, fD, [x0, yT, x1, yF], P.mouldD, 0.05, 3, -1.8, 3 + yT, 0.6); for (let i = 0; i < 4; i++) X.mould(f, [x0 + R(f, 40, x1 - x0 - 40), yF - R(f, 6, 20)], R(f, 16, 30), 6, { rings: 1 }); });
    FX.rime([[x0, yT], [x0 + 300, yT + 1], [x1, yT]], 6, -1);
    X.fungalFur(f, [[x0, yF - 2], [x1, yF - 2]], 6, -1, { gaps: 0.5 });
    FX.icicles([[x0 + 10, yF], [x1 - 10, yF]], 8, 14, 4);
    FX.frost([(x0 + x1) / 2, yT - dz * 0.2], (x1 - x0) / 2, dz * 0.15, 26);
  };
  step(s2, s1, -20, 620, 44, true);
  step(s1, gy + 4, -20, 620, 40, false);
  { const q = [458, s1 - 8]; f.part([add(q, [-16, -30]), add(q, [16, -30]), add(q, [10, -10]), add(q, [4, -8]), add(q, [6, 0]), add(q, [-6, 0]), add(q, [-4, -8]), add(q, [-10, -10])], { fill: P.silver, shadow: P.silverD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.3, cast: true }); f.part(ell(add(q, [0, -30]), 16, 5, 0, 12), { fill: P.silverD, shade: 0.3, inkW: 1.1, cast: false }); f.part(ell(add(q, [0, 2]), 12, 4, 0, 10), { fill: P.silverD, shade: 0.3, inkW: 1, cast: false }); X.stains(f, E.smooth([add(q, [-16, -30]), add(q, [16, -30]), add(q, [6, 0]), add(q, [-6, 0])]), [q[0] - 20, q[1] - 40, q[0] + 20, q[1] + 6], '#1e2220', 0.08, 3, -1.4, 23, 0.6); FX.rime([add(q, [-16, -32]), add(q, [-6, -36]), add(q, [10, -34])], 3, 1); f.flat(ell(add(q, [6, 4]), 22, 4, 0, 10), P.hoar, { op: 0.6 }); } // the dropped cup, frozen to the tread

  // ---- far leg (the hose's grey-green half), far arm resting on the far knee
  X.leg(f, FX, HF, KF, AF, '_f', { ws: [52, 38, 26], look: MOT(1, { texOp: 0 }), foot: 'boot', fs: 40, toe: 1.7, shoe: mix(P.leather, GREEN, 0.3), gy: s1 - 6 });
  f.bone('foot_f'); { const t = [AF[0] + 40 * 1.75, s1 - 18]; f.part([t, add(t, [14, -12]), add(t, [18, -26]), add(t, [8, -14])], { fill: mix(P.leather, GREEN, 0.3), shade: 0.4, inkW: 1, cast: false }); } // the shoe's curled point
  X.arm(f, SF, EF, WF, '_f', { ws: [34, 28, 22], skin: SKd(), sleeve: { look: MOT(0), to: 1.85, slack: 1.3, rag: 6 } });
  f.bone('hand_f');
  X.openHand(f, WF, deg(84), 60, { look: SKd({ fill: mix(P.skin, P.skinD, 0.25) }), back: true, spread: 0.1, curl: 0.5, swell: 0.1, nail: '#5a5a52' });
  f.bone('forearm_f'); FX.icicle(add(EF, [0, 12]), 18, 4); FX.frost(lerp(EF, WF, 0.3), 18, 4, 4);

  // ---- torso: the motley tunic of chequered halves, stiff with frost, slumped; a slapstick of two laths in the belt
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.32, 0.34], [0.04, 0.58, 0.48], [0.2, 0.64, 0.56], [0.36, 0.6, 0.58], [0.52, 0.56, 0.6], [0.7, 0.56, 0.66], [0.86, 0.6, 0.7], [1.0, 0.62, 0.7]]);
  const halfA = [S.at(-1.2, -0.2), S.at(0.06, -0.2), S.at(0.06, 1.2), S.at(-1.2, 1.2)];
  const tD = f.part(torso, MOT(1));
  X.clipDraw(f, tD, () => {
    f.part(halfA, MOT(0, { inkW: 0, inkHeavy: 0, cast: false }));
    f.line([S.at(0.06, -0.06), S.at(0.06, 1.0)], 2.4, '#141410', { op: 0.7 });
    X.softTone(f, tD, [[[S.at(-1, 0), S.at(-0.3, 0), S.at(-0.3, 1), S.at(-1, 1)], '#000', 0.4, 12], [[S.at(0.2, 0.5), S.at(0.8, 0.5), S.at(0.8, 1), S.at(0.2, 1)], '#000', 0.35, 12]]);
    for (let i = 0; i < 4; i++) f.stroke([S.at(-0.4 + i * 0.3, 0.3), S.at(-0.36 + i * 0.3, 0.6), S.at(-0.4 + i * 0.32, 0.92)], 2.4, '#141410', { op: 0.45 });
    X.stains(f, tD, [180, 420, 380, 660], P.mouldD, 0.05, 3, -1.8, 31, 0.55);
  });
  // the tunic's dagged hem over the hips, frozen stiff
  const hm = []; for (let i = 0; i <= 8; i++) { const q = S.at(-0.66 + i * 0.17, 1.02); hm.push(add(q, [0, i % 2 ? 4 : 22]), ...(i % 2 ? [] : [])); }
  f.part([S.at(-0.66, 0.86), S.at(0.7, 0.86), ...hm.slice().reverse()].map((q, i) => i > 1 && i % 2 ? [...q, 1] : q), MOT(0, { maxShade: 6 }));
  FX.icicles(hm.filter((_, i) => i % 2 === 0), 4, 12, 4);
  f.part([S.at(-0.62, 0.8), S.at(0.68, 0.8), S.at(0.7, 0.88), S.at(-0.62, 0.88)].map(q => [...q, 1]), { fill: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  { const a0 = S.at(0.36, 0.76), a1 = add(a0, [-60, 90]); for (const o of [-5, 5]) f.part(limb(lp(a0, a1, 0, o), lp(a1, a0, 0, -o), 10, 9, { steps: 4, capK: 0.4 }), { fill: mix(P.wood, P.linenL, 0.4), shade: 0.4, inkW: 1.1, tex: 'grain' + seed, texOp: 0.5, cast: false }); f.line([lp(a0, a1, 0.06, -10), lp(a0, a1, 0.06, 10)], 3, P.leatherD); } // the slapstick
  // mould fur in the armpit and groin; frost on the hunched shoulders
  X.mould(f, S.at(-0.4, 0.28), 14, 10, { rings: 1 }); X.fungalFur(f, [S.at(-0.5, 0.2), S.at(-0.3, 0.34)], 6, 1);
  X.mould(f, S.at(0.4, 0.98), 14, 8, { rings: 1 }); X.fungalFur(f, [S.at(0.2, 1.0), S.at(0.6, 0.96)], 6, -1);
  FX.rime([S.at(-0.66, 0.06), S.at(-0.3, -0.08), S.at(0.1, -0.1), S.at(0.5, -0.04)], 8, 1);

  // ---- head sunk forward between the shoulders: the frayed ruff, the cracked painted face, the fixed grin
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-4, 8]), hF([[-0.08, 0.4]])[0]], [34, 28]), SKd({ maxShade: 4 }));
  const face = '#c4c2b4';
  X.deadHead(f, FX, HC, H, hA, { skin: face, head: { jaw: 1.0, chin: 0.06, nose: 1.0, hook: 0.1, mouth: 'set', noEar: true, browDown: -0.04 }, lid: -0.1 });
  // the painted face cracked like old plaster: a web of dark cracks with lifted pale edges, grey skin showing in the flakes
  for (let i = 0; i < 9; i++) { const q = hF([[R(f, -0.15, 0.3), R(f, -0.3, 0.36)]])[0]; const pts = [q]; let a = R(f, 0, 6); for (let k = 0; k < 3; k++) { a += R(f, -1, 1); pts.push(add(pts[pts.length - 1], rot([R(f, 5, 11), 0], a))); } f.line(pts, 1, '#1c1a16', { op: 0.75, straight: true }); f.line(pts.map(p => add(p, [0.8, -0.8])), 0.7, '#ece8dc', { op: 0.5, straight: true }); }
  for (let i = 0; i < 4; i++) { const q = hF([[R(f, -0.1, 0.25), R(f, -0.25, 0.3)]])[0]; f.flat(ell(q, R(f, 3, 6), R(f, 2, 4), R(f, 0, 3), 6), P.skin, { op: 0.9 }); }
  // the fixed grin: wide, the lips drawn back off mouldy teeth, sores at the corners
  f.flat(hF([[0.12, 0.25], [0.2, 0.27], [0.28, 0.27], [0.34, 0.235], [0.31, 0.29], [0.24, 0.32], [0.16, 0.31]]), '#141210');
  for (let i = 0; i < 6; i++) { const x = 0.15 + i * 0.03; f.flat(hF([[x, 0.268], [x + 0.025, 0.27], [x + 0.022, 0.29], [x + 0.003, 0.29]]), i % 3 === 1 ? P.mouldD : mix(P.bone, P.mouldY, 0.35)); }
  f.line(hF([[0.1, 0.24], [0.2, 0.262], [0.3, 0.258], [0.36, 0.225]]), 1.8, '#1c1a16');
  X.sore(f, hF([[0.11, 0.25]])[0], 2.6, { ang: hA + 0.6 }); X.sore(f, hF([[0.355, 0.23]])[0], 2.4, { ang: hA - 0.6 });
  f.flat(hF([[0.06, 0.06], [0.14, 0.04], [0.16, 0.1], [0.08, 0.12]]), mix(GREEN, '#000', 0.2), { op: 0.3 }); // painted cheek
  // the frayed ruff round the neck: a band of pleats, limp and torn, frozen
  f.bone('torso');
  { const rc = add(neck0, [8, 10]), rp = []; for (let i = 0; i < 12; i++) { const a = Math.PI * (0.95 + i / 11 * 1.1); rp.push(add(rc, [Math.cos(a) * 52, Math.sin(a) * 20 + 10])); }
    for (let i = 0; i < rp.length; i++) { const q = rp[i]; f.part(ell(q, 9, 13, 0.3 * (i % 2 ? 1 : -1), 9).map(p => add(p, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), { fill: mix(P.linenL, P.frost, 0.2), shadow: '#26251f', shade: 0.42, inkW: 1, inkHeavy: 1.3, cast: false, tex: 'weave' + seed, texOp: 0.4 }); } FX.icicles([rp[3], rp[8]], 2, 10, 3); }
  // ---- the hood: a cap round the head and over the shoulders, three limp points hanging forward over his face, each
  // ending in a little bell packed with ice; frost on the crown
  f.bone('hood');
  const hood = hF([[-0.5, 0.7], [-0.62, 0.2], [-0.56, -0.3], [-0.3, -0.6], [0.06, -0.66], [0.34, -0.5], [0.44, -0.3], [0.4, -0.18], [0.22, -0.3], [-0.02, -0.38], [-0.24, -0.24], [-0.32, 0.12], [-0.2, 0.46], [0.1, 0.6], [0.3, 0.72], [0.0, 0.86], [-0.36, 0.86]]);
  const hdD = f.part(hood, MOT(0, { maxShade: 14 }));
  X.clipDraw(f, hdD, () => { f.part(hF([[0.0, -0.8], [0.6, -0.8], [0.6, 1.0], [0.0, 1.0]]), MOT(1, { inkW: 0, inkHeavy: 0, cast: false })); X.stains(f, hdD, [HC[0] - 80, HC[1] - 70, HC[0] + 60, HC[1] + 90], P.mouldD, 0.05, 3, -1.8, 37, 0.5); });
  f.line(hF([[0.0, -0.66], [0.02, -0.38]]), 2, '#141410', { op: 0.6 });
  FX.rime(hF([[-0.6, -0.1], [-0.5, -0.4], [-0.24, -0.62], [0.08, -0.68], [0.32, -0.54]]), 8, 1);
  FX.frost(hF([[-0.1, -0.56]])[0], 26, 6, 10);
  const bell = (p, r) => { f.part(ell(p, r, r * 0.95, 0, 10), { fill: P.silverD, shadow: '#232624', shade: 0.42, inkW: 1.1, cast: false, tex: 'mottle' + seed, texOp: 0.5 }); f.line([add(p, [-r * 0.7, r * 0.2]), add(p, [r * 0.7, r * 0.2])], 1.1, INK, { op: 0.7 }); f.flat(ell(add(p, [0, r * 0.45]), r * 0.5, r * 0.28, 0, 8), P.hoar, { op: 0.85 }); f.flat(ell(add(p, [-r * 0.3, -r * 0.35]), r * 0.25, r * 0.18, 0, 6), P.silverL, { op: 0.6 }); };
  [[[-0.36, -0.46], [-0.3, -0.1], [-0.36, 0.3], [-0.32, 0.66], 1], [[0.02, -0.64], [0.3, -0.42], [0.42, -0.08], [0.44, 0.34], 0], [[0.22, -0.54], [0.6, -0.36], [0.78, -0.02], [0.84, 0.3], 1]].forEach(([a, b, c, d, k], i) => {
    f.bone('point_' + (i + 1));
    const pts = hF([a, b, c, d]), C2 = X.spline(pts, 4), ws = C2.map((_, j) => 24 * (1 - j / C2.length * 0.8));
    const out = X.ribbon(C2, ws);
    const pD = f.part(out, MOT(k, { maxShade: 6, inkW: 1.3 }));
    X.clipDraw(f, pD, () => { for (let j = 3; j < C2.length - 2; j += 4) f.line([X.offsetLine(C2, () => 10)[j], X.offsetLine(C2, () => -10)[j + 1]], 1.2, '#141410', { op: 0.45 }); });
    FX.rime(C2.slice(0, Math.round(C2.length * 0.6)).map(q => add(q, [0, -9])), 4, 1);
    bell(add(pts[3], [0, 10]), 10); FX.icicle(add(pts[3], [0, 20]), 12 + i * 4, 4);
  });

  // ---- near leg (the bone-white half of the hose, torn at the knee), near arm resting on the near knee
  X.leg(f, FX, HN, KN, AN, '_n', { ws: [54, 40, 27], look: MOT(0, { texOp: 0, fill: mix(BONE, P.linenD, 0.2) }), foot: 'boot', fs: 40, toe: 1.7, shoe: mix(P.leather, BONE, 0.2), torn: 0.25, gy: s1 - 2 });
  f.bone('foot_n'); { const t = [AN[0] + 40 * 1.75, s1 - 12]; f.part([t, add(t, [14, -12]), add(t, [18, -26]), add(t, [8, -14])], { fill: mix(P.leather, BONE, 0.2), shade: 0.4, inkW: 1, cast: false }); bell(add(t, [18, -30]), 6); }
  f.bone('thigh_n'); FX.rime([lerp(HN, KN, 0.4), lerp(HN, KN, 0.8), add(KN, [6, -22])].map(q => add(q, [0, -22])), 6, 1); FX.frost(add(KN, [0, -24]), 18, 4, 6);
  // the marotte lying face-up across his lap: a turned stick, the carved head of the king in his crown at its end
  f.bone('marotte');
  { const m1 = [286, 608], m0 = [486, 590], dM = E.norm(sub(m0, m1)); // the stick from the lap out past his knees
    const WD = { fill: mix(P.wood, P.linenL, 0.45), shadow: P.woodD, shade: 0.42, tex: 'grain' + seed, texOp: 0.45, cast: false };
    f.part(limb(m1, m0, 11, 13, { steps: 8 }), Object.assign({}, WD, { fill: mix(P.wood, P.linenL, 0.3), maxShade: 4, inkW: 1.3 }));
    for (let i = 1; i < 6; i++) f.line([lp(m1, m0, i * 0.15, -6), lp(m1, m0, i * 0.15 + 0.02, 6)], 1.4, '#16150f', { op: 0.6 });
    // the carved head of the king at the stick's end, lying face up in his lap and so turned to us in the three-quarter
    // camera: the crown toward the stick's end, a long solemn face with lidded eyes, the nose, a moustache, the beard in locks
    // running back to the collar where the stick enters. Local: x across the face, y up the head (along the stick)
    const Sk = 60, up = dM, ac = [-dM[1], dM[0]], hc = add(m0, mul(dM, Sk * 0.66)), KH = pts => pts.map(([x, y, k]) => { const q = add(add(hc, mul(ac, x * Sk)), mul(up, y * Sk)); return k ? [...q, 1] : q; });
    f.part(KH([[-0.26, -0.66], [0.26, -0.66], [0.3, -0.54], [-0.3, -0.54]]), Object.assign({}, WD, { fill: mix(P.wood, '#000', 0.1), inkW: 1.1 })); // the collar
    const head = KH([[0.0, -0.62], [-0.2, -0.5], [-0.34, -0.2], [-0.38, 0.1], [-0.36, 0.36], [0.0, 0.42], [0.36, 0.36], [0.38, 0.1], [0.34, -0.2], [0.2, -0.5]]);
    const hD = f.part(head, Object.assign({}, WD, { inkW: 1.4, inkHeavy: 2, maxShade: 10 }));
    X.clipDraw(f, hD, () => { X.softTone(f, hD, [[KH([[0.12, -0.7], [0.5, -0.7], [0.5, 0.5], [0.12, 0.5]]), '#000', 0.35, 4], [KH([[-0.3, 0.3], [-0.05, 0.3], [-0.05, -0.1], [-0.3, -0.1]]), '#ffffff', 0.18, 4]]); X.stains(f, hD, [hc[0] - 60, hc[1] - 60, hc[0] + 60, hc[1] + 60], '#1a1814', 0.08, 3, -1.4, 43, 0.4);
      f.flat(KH([[-0.3, -0.12], [0.3, -0.12], [0.24, -0.34], [0.1, -0.52], [0.0, -0.6], [-0.1, -0.52], [-0.24, -0.34]]), mix(P.wood, '#000', 0.3), { op: 0.55 }); }); // the beard, darkened by old handling
    for (const sx of [-1, 1]) { f.flat(KH([[sx * 0.06, 0.12], [sx * 0.16, 0.16], [sx * 0.26, 0.12], [sx * 0.16, 0.08]]), '#1a1814'); f.line(KH([[sx * 0.05, 0.19], [sx * 0.16, 0.24], [sx * 0.28, 0.18]]), 1.6, INK); } // lidded carved eyes under the brow
    f.part(KH([[-0.05, 0.14], [0.05, 0.14], [0.08, -0.06], [0.0, -0.1], [-0.08, -0.06]]), Object.assign({}, WD, { fill: mix(P.wood, P.linenL, 0.55), inkW: 1.1 })); // the nose
    f.line(KH([[-0.2, -0.14], [-0.06, -0.1], [0.0, -0.13], [0.06, -0.1], [0.2, -0.14]]), 2, '#14120e'); f.line(KH([[-0.1, -0.2], [0.1, -0.2]]), 1.4, INK); // moustache and the solemn mouth
    for (let i = 0; i < 5; i++) { const x = -0.2 + i * 0.1; f.line(KH([[x, -0.24], [x * 0.8, -0.38], [x * 0.4, -0.54]]), 1.1, '#14120e', { op: 0.8 }); } // the beard's carved locks
    // the crown: a band and five points with knobs, tarnished silver leaf on the wood
    const CR = { fill: P.silver, shadow: P.silverD, shade: 0.4, inkW: 1.1, cast: false, tex: 'mottle' + seed, texOp: 0.5 };
    f.part(KH([[-0.4, 0.3, 1], [0.4, 0.3, 1], [0.42, 0.46, 1], [-0.42, 0.46, 1]]), CR);
    for (const x of [-0.36, -0.18, 0, 0.18, 0.36]) { f.part(KH([[x - 0.07, 0.46, 1], [x + 0.07, 0.46, 1], [x, 0.62, 1]]), CR); f.part(ell(KH([[x, 0.65]])[0], 3.4, 3.4, 0, 8), CR); }
    for (const x of [-0.2, 0.2]) f.flat(ell(KH([[x, 0.38]])[0], 3, 3, 0, 6), '#2a2e2c');
    for (const q of KH([[-0.3, -0.62], [0.3, -0.62]])) bell(add(q, [0, 8]), 6);
    FX.rime(KH([[-0.42, 0.46], [-0.38, 0.1], [-0.34, -0.2]]), 3, -1); X.mould(f, KH([[0.3, -0.3]])[0], 6, 5, { rings: 0 }); }
  X.arm(f, SN, EN, WN, '_n', { ws: [36, 30, 23], skin: SKd(), sleeve: { look: MOT(1), to: 1.85, slack: 1.3, rag: 6 } });
  f.bone('upperarm_n');
  { const pc = lerp(SN, EN, 0.9); f.part(ell(pc, 14, 11, ang(SN, EN), 8).map(q => [...q, 0]), MOT(0, { texOp: 0.2, fill: P.linenD, inkW: 1.1, cast: false, maxShade: 3 })); f.stitches(ell(pc, 12, 9, ang(SN, EN), 8).slice(0, 6), P.linenL, 0.8); } // a patch on the elbow
  FX.rime([lp(SN, EN, 0.0, -18), lp(SN, EN, 0.5, -16), lp(SN, EN, 1.0, -14)], 5, -1); FX.icicle(add(EN, [-2, 14]), 22, 4);
  f.bone('hand_n');
  X.openHand(f, WN, deg(80), 62, { look: SKd(), back: true, flip: true, spread: 0.12, curl: 0.45, swell: 0.1, nail: '#5a5a52' });
  f.bone('forearm_n'); { for (let i = 0; i < 5; i++) { const q = lp(EN, WN, 0.86, -14 + i * 7); f.line([lp(EN, WN, 0.82, -14 + i * 7), q], 1, P.leatherD); bell(add(q, [0, 8]), 5); } } // the string of tarnished bells at the wrist
  f.bone('root');
  return f;
}


// The Dead-Cart's canvas is heightened (2400 x 2140) so the rebuilt heap stands in frame: the figure is built on its
// design canvas (ground 1770) and every element is moved down 340 px at the same pixel scale; joints move with it and
// groundY = 2110 = canvas h - 30. The shared defs (mud gradient) keep the design-space ground the parts were drawn in.
function deadCart() {
  const f = deadCartBody(), dy = 0, g0 = f.o.groundY, gr0 = f.o.grimeY; // the lower mound fits the 1800 canvas (true size kept)
  f.out = f.out.map(x => `<g transform="translate(0,${dy})">${x}</g>`);
  for (const j of Object.values(f.joints)) j.pivot = [j.pivot[0], E.f1(j.pivot[1] + dy)];
  const sd = f.sharedDefs.bind(f);
  f.sharedDefs = () => { const g = f.o.groundY, r = f.o.grimeY; f.o.groundY = g0; f.o.grimeY = gr0; const out = sd(); f.o.groundY = g; f.o.grimeY = r; return out; };
  f.o.groundY = g0 + dy; f.o.grimeY = gr0 + dy;
  return f;
}

// ------------------------------------------------------------------ BARROW CHAPLAIN (elite 1.9)
// The royal household's chaplain, who said the rites in the barrow's chapel and over its dead and is giving them again.
// A heavy old priest walking slowly in procession, the tall processional cross held upright in both hands, its foot on
// the floor ahead so he leans his weight into the pole at each step; the cross rises well above his head. The cope, the
// great semicircular cape, is frozen stiff into a wide rigid bell round him; the alb beneath, its hem frozen in folds.
// Canvas: true size wins (guide 2): at 1.9 the cross does not fit the elite canvas, so the canvas is heightened to
// 1100 x 1600 at the same pixel scale (ground = 1570).
// Remnant of the office: the cope with its orphrey and silver morse, the stole, the cross, the holy-water bucket, the
// chained book of rites, the rosary, the reliquary, the candle stubs. The one mark pushed hard is toxin's, as the bible
// gives it: a plague bubo the size of a loaf swelling the near side of the neck, pushing the head over so it tilts away.
// Frost greys him, stiffens the cope into its bell and hangs drips from the cross's arms. Gold only on the cross (holy).
// Rig: standard humanoid + cope (torso) + alb (pelvis) + pole (parent hand_f; the near hand on it needs IK) + bucket
// (parent hand_n) + book (pelvis). Motion: idle a slow processional step, the lips moving; action: strike the frozen
// holy water across the field (the near arm flicks the bucket and sprinkler).
function barrowChaplain() {
  const CW = 1100, CH = 1600, seed = 922;
  const f = new Fig(X.base(seed, CH, { grimeY: 1250 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 186, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, Object.assign({ maxShade: 30 }, o));
  const ALB = (o = {}) => Object.assign({ fill: mix(P.linenL, P.bone, 0.35), shadow: '#2a2a22', tex: 'weave' + seed, texOp: 0.45, shade: 0.42, maxShade: 60 }, o);
  const COPE = (o = {}) => Object.assign({ fill: mix(P.wool, P.mould, 0.35), shadow: '#151812', tex: 'weave' + seed, texOp: 0.4, shade: 0.42, maxShade: 90 }, o);
  const GILT = '#8c8264', GILTL = '#b8ad86', GILTD = '#4a4434';
  const N = [530, 606], C = [506, 790], Pv = [500, 990];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.14), SF = S.at(0.4, 0.1);
  const pB = [800, gy - 4], pT = [760, 270], pA = ang(pB, pT);                   // the processional cross's pole, its foot on the floor ahead
  const WF = lerp(pB, pT, 0.63), EF = X.ik(SF, WF, 230, 206, 1)[0];             // far hand high on the pole
  const WN = lerp(pB, pT, 0.43), EN = X.ik(SN, WN, 230, 206, 1)[0];             // near hand lower, the bucket hooked on its wrist
  const HN = [470, 1000], AN = [430, 1484], KN = X.ik(HN, AN, 290, 252, 1)[0];   // the near leg back
  const HF = [540, 994], AF = [640, 1488], KF = X.ik(HF, AF, 290, 252, -1)[0];   // the far leg stepping forward
  const neck0 = S.at(0.16, -0.04), HC = [604, 474], hA = 0.46;                  // the head pushed over by the bubo, tilting away from it
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('cope', S.at(0, 0.0), 'torso').joint('alb', S.at(0, 0.9), 'pelvis').joint('pole', WF, 'hand_f').joint('bucket', WN, 'hand_n').joint('book', S.at(0.3, 0.92), 'pelvis');

  // ---- feet under the alb: soft shoes, the far foot stepping
  for (const [A, sfx, Kn] of [[AN, '_n', KN], [AF, '_f', KF]]) { f.bone('shin' + sfx); f.part(K.chain([lerp(Kn, A, 0.4), A], [96, 80]), ALB({ fill: mix(P.linenD, '#000', 0.2), maxShade: 10 })); f.bone('foot' + sfx); B.boot(f, A, 1, 112, P.leatherD, { shaft: 0.4, tex: 'mottle' + seed, toe: 1.2 }); FX.frost(add(A, [40, 70]), 80, 12, 10); }

  // ---- the cope's far half, behind the opening: frozen stiff, the hem rimed
  f.bone('cope');
  const copeF = [S.at(0.3, -0.1), S.at(0.6, 0.0), [742, 760], [826, 1080], [880, 1356], [...[846, 1376], 1], [810, 1352], [...[776, 1372], 1], [720, 1200], S.at(0.44, 0.3)];
  const cfD = f.part(copeF, COPE({ fill: mix(P.wool, P.mould, 0.3) }));
  X.stains(f, cfD, [640, 600, 900, 1400], P.mouldD, 0.025, 3, -1.6, 3, 0.65);
  FX.icicles([[880, 1356], [846, 1376], [776, 1372]], 4, 34, 7);

  // ---- the far arm (its upper arm under the cope), the alb sleeve wide at the wrist
  X.arm(f, SF, EF, WF, '_f', { ws: [78, 64, 50], skin: SKd({ fill: mix(P.skin, P.skinD, 0.25) }), sleeve: { look: ALB({ fill: mix(P.linenL, '#000', 0.12) }), to: 1.84, slack: 1.5, rag: 8, roll: true } });

  // ---- the alb: bone-white linen to the ankles, its hem frozen in folds and stained with mould to the knee
  f.bone('alb');
  const ahem = []; { let x = 340; const dep = [6, 26, 10, 34, 4, 18, 30, 8, 22]; let i = 0; while (x < 760) { ahem.push([x, 1470 + dep[i % dep.length] * 0.7 + R(f, -4, 4), dep[i % dep.length] > 20 ? 1 : 0]); x += 26 + f.r() * 24; i++; } }
  const alb = [S.at(-0.6, 0.6), S.at(0.62, 0.58), [700, 1100], [760, 1300], ...ahem.slice().reverse(), [350, 1300], [380, 1100]];
  const aD = f.part(alb, ALB());
  X.stains(f, aD, [320, 1000, 800, 1520], P.mouldD, 0.025, 3, -1.0, 5, 0.8); // the mould tide to the knee
  X.stains(f, aD, [320, 1200, 800, 1520], '#0b0b08', 0.04, 3, -1.4, 7, 0.5);
  X.clipDraw(f, aD, () => { for (let i = 0; i < 7; i++) { const x = 380 + i * 54; f.stroke([[x + 10, 1060], [x - 4, 1260], [x + 8, 1490]], 6, '#16170f', { op: 0.45 }); f.line([[x + 22, 1080], [x + 12, 1260], [x + 22, 1480]], 2, '#e8e4d8', { op: 0.3 }); } });
  FX.icicles(ahem.map(q => [q[0], q[1] - 3]), 9, 30, 7); X.fungalFur(f, ahem, 8, -1, { gaps: 0.4 });
  // the stole: two dark bands hanging under the cope's opening to the shins, one end torn and frozen
  for (const [x0, x1, torn] of [[640, 682, false], [700, 740, true]]) { const y1 = torn ? 1300 : 1380; const st = [[x0, 880], [x0 + 40, 880], [x1 + 8, y1], ...(torn ? [[x1 - 4, y1 + 30, 1], [x1 - 14, y1 + 6], [x1 - 22, y1 + 40, 1], [x1 - 30, y1 + 4]] : [[x1 - 6, y1 + 20], [x1 - 34, y1 + 20]]), [x1 - 40, y1]]; const sD = f.part(st, COPE({ fill: mix(P.wool, '#1a1c18', 0.4), maxShade: 10 })); X.stains(f, sD, [x0 - 10, 880, x1 + 20, y1 + 50], P.mouldD, 0.06, 3, -1.6, 9 + x0, 0.6); for (let k = 0; k < 3; k++) f.line([[x0 + 6, 960 + k * 120], [x0 + 34, 960 + k * 120], [x0 + 20, 990 + k * 120], [x0 + 6, 960 + k * 120]], 1.4, GILTD, { op: 0.8 }); FX.icicle([x1 - 20, y1 + (torn ? 34 : 20)], 22, 6); } // small crosses worked on the stole, dark

  // ---- torso under it all (the alb's body), the girdle, the book of rites chained to it, candle stubs, the rosary
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.4, 0.4], [0.04, 0.8, 0.6], [0.2, 0.92, 0.86], [0.36, 0.9, 0.98], [0.52, 0.86, 1.0], [0.68, 0.84, 0.98], [0.84, 0.86, 0.92], [0.98, 0.88, 0.88]]);
  f.part(torso, ALB());
  f.part([S.at(-0.8, 0.8), S.at(0.9, 0.78), S.at(0.92, 0.86), S.at(-0.8, 0.88)].map(q => [...q, 1]), { fill: P.linenD, shade: 0.4, tex: 'weave' + seed, texOp: 0.5 }); // the girdle cord
  for (let i = 0; i < 3; i++) { const q = S.at(0.56 + i * 0.1, 0.78); f.part([add(q, [-8, -40]), add(q, [8, -40]), add(q, [9, 8]), add(q, [-9, 8])], { fill: '#c8c2a8', shadow: '#5e584a', shade: 0.42, inkW: 1.2, cast: false, tex: 'mottle' + seed, texOp: 0.5 }); f.flat(ell(add(q, [0, -40]), 8, 3, 0, 8), '#1a1814'); f.line([add(q, [0, -40]), add(q, [2, -50])], 1.6, '#1a1814'); f.flat([add(q, [-8, -30]), add(q, [-11, -10]), add(q, [-8, -14])], '#d8d2b8'); } // candle stubs pushed into the girdle, wax run down


  // ---- the near arm: the alb sleeve over the forearm, the holy-water bucket hooked on the wrist, the hand on the pole
  X.arm(f, SN, EN, WN, '_n', { ws: [80, 66, 52], skin: SKd(), sleeve: { look: ALB(), to: 1.82, slack: 1.5, roll: true } });
  f.bone('forearm_n'); X.stains(f, E.smooth(X.sleeveShape(f, [EN, lerp(EN, WN, 0.82)], [100, 90], { roll: true })), [EN[0] - 80, EN[1] - 80, WN[0] + 40, WN[1] + 40], P.mouldD, 0.05, 3, -1.9, 21, 0.5);
  // ---- the cope's near half: from the neck over the near shoulder, round the back to the stiff hem, the front edge with
  // its orphrey band down to the hem; frozen into a rigid bell, rimed on the windward back, mould in the folds
  f.bone('cope');
  const chem = []; { let x = 210; const dep = [10, 30, 14, 40, 6, 24, 36, 12]; let i = 0; while (x < 690) { chem.push([x, 1362 + (x - 210) * 0.08 + dep[i % dep.length] * 0.6 + R(f, -4, 4), dep[i % dep.length] > 24 ? 1 : 0]); x += 30 + f.r() * 26; i++; } }
  const cope = [S.at(-0.1, -0.14), S.at(0.3, -0.12), S.at(0.5, 0.06), [660, 760], [672, 1000], [700, 1380], ...chem.slice().reverse(), [196, 1300], [230, 1060], [300, 820], S.at(-0.8, 0.12), S.at(-0.5, -0.06)];
  const cD = f.part(cope, COPE());
  X.stains(f, cD, [180, 560, 720, 1420], P.mouldD, 0.02, 3, -1.5, 11, 0.7);
  X.stains(f, cD, [180, 560, 720, 1420], P.mouldL, 0.035, 3.4, -2.4, 13, 0.4);
  X.clipDraw(f, cD, () => {
    X.softTone(f, cD, [[[[180, 700], [380, 700], [320, 1420], [180, 1420]], '#000', 0.45, 30], [[[480, 640], [620, 660], [640, 1000], [520, 1000]], '#ffffff', 0.1, 24]]);
    // frozen folds: long rigid flutes from the shoulder to the hem, each a dark valley with a lit ridge beside it
    // frozen folds: rigid flutes fanning out from the shoulders to the bell of the hem, each bowing a little, some splitting
    // or dying out, a dark valley with a lit ridge on its key-light side; a few crumples frozen across them
    for (const [t, k, w] of [[0.0, 1, 12], [0.11, 0.7, 7], [0.2, 1, 14], [0.36, 0.85, 9], [0.43, 1, 12], [0.58, 0.6, 6], [0.66, 1, 13], [0.8, 0.8, 8], [0.92, 1, 10]]) {
      const top = lerp(S.at(-0.6, 0.1), S.at(0.3, 0.06), t), bot = [200 + t * 480 + R(f, -20, 20), 1380 - R(f, 0, 30)], t0 = lerp(top, bot, 1 - k), bow = R(f, -22, 22);
      const m1 = add(lerp(t0, bot, 0.33), [bow, 0]), m2 = add(lerp(t0, bot, 0.68), [bow * 0.4 + R(f, -10, 10), 0]), fl = [t0, m1, m2, bot];
      f.stroke(fl, w, '#0e100c', { op: 0.5 }); f.line(fl.slice(0, 3).map((q, i) => add(q, [-(w * 0.6 + 3), 10 - i * 6])), Math.max(1.2, w * 0.22), '#c8ccbe', { op: 0.28 });
      if (f.r() < 0.5) { const sp = lerp(m1, m2, R(f, 0.2, 0.7)); f.stroke([sp, add(sp, [R(f, -40, 40), 90]), add(bot, [R(f, 20, 50) * (f.r() < 0.5 ? -1 : 1), -20])], w * 0.6, '#0e100c', { op: 0.42 }); } }
    for (let i = 0; i < 5; i++) { const q = [R(f, 260, 640), R(f, 900, 1300)]; X.crease(f, [q, add(q, [R(f, 20, 40), R(f, -8, 8)]), add(q, [R(f, 50, 80), R(f, -6, 10)])], 3, { col: '#0e100c', lit: '#c8ccbe', op: 0.5 }); }
    FX.cracks([340, 1100], 60, 4, 1.4); FX.cracks([520, 1250], 50, 3, 1.4);
  });
  for (const [x, y] of [[300, 1180], [560, 980]]) { const b = ell([x, y], 16, 22, 0.3, 10).map(q => add(q, [R(f, -4, 4), R(f, -4, 4)])); f.flat(b, '#0a0b08'); X.fungalFur(f, b.concat([b[0]]), 6, 1, { gaps: 0.3 }); } // rot holes
  FX.rime([S.at(-0.5, -0.06), S.at(-0.8, 0.12), [300, 820], [230, 1060], [196, 1300]], 16, -1, { wind: [-1, -0.2] });
  FX.icicles(chem, 12, 50, 9); X.fungalFur(f, chem, 10, -1, { gaps: 0.35 });
  // the orphrey: the embroidered band down the front edge, its worked squares furred with mould
  const orf = [S.at(0.32, -0.1), S.at(0.5, 0.06), [660, 760], [672, 1000], [700, 1380], [640, 1388], [612, 1000], [600, 770], S.at(0.3, 0.12), S.at(0.18, -0.06)];
  const oD = f.part(orf, COPE({ fill: mix('#6a6c5c', P.mould, 0.3), maxShade: 16, inkW: 2 }));
  X.clipDraw(f, oD, () => { for (let i = 0; i < 9; i++) { const q = lerp([620, 700], [670, 1360], i / 8); f.flat(ell(q, 18, 22, 0, 4), GILTD, { op: 0.55 }); f.line(ell(q, 14, 18, 0, 4).concat([ell(q, 14, 18, 0, 4)[0]]), 1.4, '#1a1a14', { op: 0.6 }); X.mould(f, add(q, [R(f, -10, 10), 10]), 14, 10, { rings: 1, ink: 0 }); } });
  X.fungalFur(f, [[606, 780], [618, 1000], [644, 1380]], 9, -1, { gaps: 0.2 });
  // the morse: the clasp at the chest, tarnished silver, a boss and a worn cross on it
  { const q = S.at(0.48, 0.2); f.part(ell(q, 40, 32, 0, 14), { fill: P.silver, shadow: P.silverD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2 }); X.stains(f, E.smooth(ell(q, 40, 32, 0, 14)), [q[0] - 44, q[1] - 36, q[0] + 44, q[1] + 36], '#1e2220', 0.08, 3, -1.4, 17, 0.6); f.line([add(q, [0, -22]), add(q, [0, 22])], 4, P.silverD); f.line([add(q, [-16, -4]), add(q, [16, -4])], 4, P.silverD); f.flat(ell(add(q, [-10, -12]), 8, 5, 0, 6), P.silverL, { op: 0.6 }); }

  f.bone('book');
  { const ch0 = [716, 980], bc = [742, 1170]; X.ironChain(f, [ch0, add(ch0, [10, 90]), add(bc, [10, -60])], 20, 5, P.iron);
    const bk = [add(bc, [-44, -60]), add(bc, [40, -66]), add(bc, [48, 60]), add(bc, [-38, 66])];
    f.part(bk.map(q => [...q, 1]), { fill: P.leatherD, shadow: '#100f0c', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.8, maxShade: 20 }); // the book's back board toward us (its pages face him)
    f.part([add(bc, [40, -66]), add(bc, [52, -62]), add(bc, [60, 56]), add(bc, [48, 60])].map(q => [...q, 1]), { fill: '#bdb7a0', shadow: '#5e584a', shade: 0.4, inkW: 1.2, cast: false }); // the frozen page edges
    for (let i = 0; i < 6; i++) f.line([add(bc, [44, -50 + i * 20]), add(bc, [56, -48 + i * 20])], 0.8, INK, { op: 0.6 });
    for (const q of [add(bc, [-30, -44]), add(bc, [30, -48]), add(bc, [-26, 46]), add(bc, [34, 42])]) f.rivet(q, 4, P.ironL);
    f.part([add(bc, [-6, -20]), add(bc, [6, -20]), add(bc, [6, 30]), add(bc, [-6, 30])], { fill: P.iron, shade: 0.4, inkW: 1, cast: false }); f.part([add(bc, [-20, -6]), add(bc, [20, -6]), add(bc, [20, 4]), add(bc, [-20, 4])], { fill: P.iron, shade: 0.4, inkW: 1, cast: false }); // an iron cross on the board
    FX.rime([add(bc, [-44, -62]), add(bc, [40, -68])], 6, 1); FX.icicles([add(bc, [-38, 66]), add(bc, [48, 60])], 3, 22, 5); X.mould(f, add(bc, [-20, 30]), 14, 10, { rings: 1 }); }

  // ---- head: tonsured, pushed over by the loaf-sized bubo on the near side of the neck; the mouth slack and murmuring
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-10, 26]), hF([[-0.06, 0.42]])[0]], [120, 100]), SKd({ maxShade: 14 }));
  X.deadHead(f, FX, HC, H, hA, { head: { jaw: 1.24, chin: 0.02, nose: 1.1, hook: 0.3, mouth: 'set', noEar: false, hairCol: '#8a8c84', hairBack: [[-0.46, 0.2], [-0.52, -0.06], [-0.44, -0.24], [-0.36, -0.1], [-0.36, 0.14]], hair: [[-0.44, 0.14], [-0.48, -0.1], [-0.4, -0.26], [-0.28, -0.3], [-0.3, -0.14], [-0.34, 0.08]] }, lid: 0.0, stubble: '#5a5c54' });
  // the tonsure: the shaved crown, a ring of grey hair, frost on the bare scalp
  f.flat(hF([[-0.32, -0.36], [-0.14, -0.5], [0.1, -0.5], [0.24, -0.42], [0.04, -0.4], [-0.18, -0.34]]), P.skinL, { op: 0.35 });
  FX.frost(hF([[-0.04, -0.46]])[0], 30, 8, 10, 1.6); FX.rime(hF([[-0.36, -0.32], [-0.16, -0.5], [0.1, -0.52], [0.26, -0.42]]), 7, 1);
  // the slack mouth, parted on the murmur; mould at the lips and in the stubble
  f.flat(hF([[0.18, 0.272], [0.25, 0.262], [0.31, 0.27], [0.29, 0.31], [0.22, 0.318]]), '#141210');
  f.line(hF([[0.17, 0.27], [0.25, 0.258], [0.32, 0.268]]), 2.2, '#1c1a16');
  X.mould(f, hF([[0.2, 0.32]])[0], 12, 7, { rings: 1 }); X.mould(f, hF([[0.06, 0.4]])[0], 14, 10, { rings: 1 }); X.fungalFur(f, hF([[0.16, 0.33], [0.26, 0.34], [0.32, 0.3]]), 6, 1, { gaps: 0.2 });
  X.crease(f, hF([[0.0, 0.3], [0.1, 0.44], [0.24, 0.5]]), 2.6, { col: '#1e1c18', lit: P.skinL, op: 0.6 }); // the heavy jowl
  // the bubo: the size of a loaf, swelling the near side of the neck under the ear, pushing the head over
  f.bone('torso');
  { // the bubo: a loaf of swollen gland down the near side of the neck from under the ear to the collarbone, sagging, the
    // skin stretched shiny and bruised grey-green, veins dragged round it, frost filmed on its top
    // it hangs from a pinched root under the ear and sags onto the collar of the cope, lumped in two lobes: never an egg
    const c = hF([[-0.2, 0.62]])[0], L = pts => pts.map(([x, y]) => [c[0] + x, c[1] + y]);
    const loaf = L([[-46, -82], [4, -90], [40, -74], [66, -44], [90, -10], [104, 30], [98, 66], [70, 90], [30, 98], [-6, 94], [-38, 98], [-70, 84], [-86, 52], [-84, 12], [-72, -36]].map(([x, y]) => [x * 0.9 + R(f, -3, 3), y * 0.9 + R(f, -3, 3)]));
    const lD = f.part(loaf, { fill: mix(mix(P.skin, P.bruise, 0.45), P.mould, 0.2), shadow: P.bruiseD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2, inkHeavy: 3, maxShade: 40 });
    X.clipDraw(f, lD, () => {
      X.softTone(f, lD, [[L([[-100, 40], [110, 30], [110, 110], [-100, 110]]), '#000', 0.42, 14], [L([[-40, -76], [40, -66], [50, -20], [-30, -30]]), '#ffffff', 0.22, 10]]);
      X.crease(f, L([[-4, 20], [14, 48], [8, 86]]), 3.4, { col: '#1a1416', lit: P.skinL }); // the cleft between the two lobes
      for (let i = 0; i < 3; i++) X.crease(f, L([[-40 + i * 16, -78 + i * 4], [-20 + i * 16, -64 + i * 4], [4 + i * 14, -72 + i * 4]]), 2.2, { col: '#1a1416', lit: P.skinL, op: 0.6 }); // the skin gathered under the jaw
      X.crease(f, L([[-70, 82], [-20, 92], [40, 90], [80, 80]]), 3, { col: '#120f10', lit: P.skinL, op: 0.6 }); // pressed flat on the cope's collar
      for (let i = 0; i < 6; i++) { const a0 = -2.6 + i * 0.9, p0 = add(c, rot([88, 0], a0)); f.line([p0, add(c, rot([50, 8], a0 + 0.4)), add(c, rot([16, -6], a0 + 0.8))], 2, '#24201e', { op: 0.65 }); }
      FX.glaze(loaf, 0.22); X.livid(f, c, 60, 40, 5, 2);
    });
    FX.rime(L([[-60, -70], [-20, -86], [30, -78], [66, -48]]), 8, -1); f.flat(L(ell([10, -50], 26, 9, 0.3, 8)), P.hoar, { op: 0.5 }); X.sore(f, L([[50, 40]])[0], 9); }
  // the rosary of bone beads hanging from the morse, and the reliquary pendant on its chain
  { const q = S.at(0.48, 0.24); const pts = [q, add(q, [-30, 80]), add(q, [-10, 150]), add(q, [30, 120]), add(q, [20, 40])]; const C2 = X.spline(pts, 12); for (const b of C2) f.part(ell(b, 6, 5.4, 0, 8), { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 0.9, cast: false, hatch: false }); const cr = add(q, [-12, 170]); f.part([add(cr, [-4, -16]), add(cr, [4, -16]), add(cr, [4, 16]), add(cr, [-4, 16])], { fill: P.bone, shade: 0.4, inkW: 1, cast: false }); f.part([add(cr, [-12, -6]), add(cr, [12, -6]), add(cr, [12, 2]), add(cr, [-12, 2])], { fill: P.bone, shade: 0.4, inkW: 1, cast: false }); }
  { const q = S.at(0.2, 0.36); f.line([S.at(0.0, 0.02), q], 1.6, P.silverD); f.part([add(q, [-22, -6]), add(q, [22, -6]), add(q, [24, 30]), add(q, [0, 44]), add(q, [-24, 30])], { fill: P.silverD, shadow: '#222624', shade: 0.42, inkW: 1.4, cast: false, tex: 'mottle' + seed, texOp: 0.6 }); f.part(ell(add(q, [0, 16]), 10, 12, 0, 10), { fill: '#bdb7a0', shade: 0.4, inkW: 1, cast: false }); f.line([add(q, [-4, 12]), add(q, [4, 20])], 1.2, '#4a4434'); } // the reliquary: a silver case, a sliver of bone behind its window

  // ---- the processional cross: an ash pole bound in tarnished silver, a gilt cross worn dull, a small crucifix figure,
  // frost hanging in drips from its arms
  f.bone('pole');
  { const top = add(pT, rot([-6, 0], pA)), dP = E.norm(sub(pT, pB)), nP = [-dP[1], dP[0]];
    f.part(limb(pB, top, 30, 26, { steps: 12 }), { fill: mix(P.wood, P.woodL, 0.3), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.6, maxShade: 8, inkW: 1.6 });
    f.line([lp(pB, pT, 0.02, 9), lp(pB, pT, 0.96, 8)], 2, '#a8a290', { op: 0.4 });
    for (const t of [0.12, 0.66, 0.84]) { f.part(plate(pB, pT, t, t + 0.025, 38, 38), { fill: P.silver, shadow: P.silverD, shade: 0.4, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.6 }); }
    f.part(plate(pB, pT, -0.01, 0.03, 34, 30), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.3, cast: false }); // the iron ferrule on the floor
    const cc = lerp(pB, pT, 0.985), CF = (u, v) => add(add(cc, mul(dP, -v)), mul(nP, -u)); // the cross: u across, v down the shaft from the crossing
    const arm2 = (u0, v0, u1, v1) => { const q = [CF(u0, v0), CF(u1, v0), CF(u1, v1), CF(u0, v1)]; return q.map(p => [...p, 1]); };
    const CL = { fill: GILT, shadow: GILTD, light: GILTL, shade: 0.42, tex: 'mottle' + seed, texOp: 0.65, inkW: 2, maxShade: 16 };
    // the knop where cross meets pole, then the cross's four arms with flared, budded ends
    f.part(ell(CF(0, 150), 40, 30, pA + Math.PI / 2, 14), CL);
    for (const [u0, v0, u1, v1] of [[-24, -200, 24, 130], [-180, -24, 180, 24]]) f.part(arm2(u0, v0, u1, v1), CL);
    for (const [u, v] of [[0, -200], [-180, 0], [180, 0]]) { f.part(ell(CF(u, v), 32, 32, 0, 12), CL); for (const [du, dv] of [[0, -1], [-1, 0], [1, 0]]) if (du * u >= 0 && dv * v >= 0) f.part(ell(CF(u + du * 30, v + dv * 30), 12, 12, 0, 8), CL); } // the budded, trefoil ends
    f.part(ell(CF(0, 0), 46, 46, 0, 14), Object.assign({}, CL, { fill: mix(GILT, '#000', 0.15) }));
    X.stains(f, E.smooth(arm2(-180, -24, 180, 24)), [cc[0] - 220, cc[1] - 240, cc[0] + 220, cc[1] + 180], '#141410', 0.06, 3, -1.5, 19, 0.6); // the gilt worn to the base
    // the small crucifix figure on it: arms out along the cross beam, head bowed, in darkened silver
    const FL = { fill: P.silverD, shadow: '#1c1e1c', shade: 0.4, inkW: 1.3, cast: false, maxShade: 4 };
    f.part(limb(CF(0, -30), CF(0, 90), 26, 16, { steps: 5 }), FL); f.part(limb(CF(-130, -8), CF(130, -8), 11, 11, { steps: 6 }), FL); f.part(ell(CF(8, -44), 15, 16, 0, 10), FL);
    for (const u of [-130, 130]) f.flat(ell(CF(u, -8), 5, 5, 0, 6), '#141410');
    f.part(limb(CF(-6, 90), CF(2, 128), 12, 9, { steps: 3 }), FL); f.line([CF(-8, 40), CF(8, 50)], 2, '#141410', { op: 0.6 });
    FX.rime([CF(-184, -26), CF(-60, -26), CF(60, -26), CF(184, -26)], 7, 1); FX.rime([CF(-26, -200), CF(26, -200)], 6, 1);
    FX.icicles([CF(-180, 26), CF(-60, 26)], 3, 50, 8); FX.icicles([CF(60, 26), CF(180, 26)], 3, 56, 8); FX.icicle(CF(0, 156), 36, 8);
    X.mould(f, CF(40, 8), 12, 8, { rings: 1 }); }

  f.bone('bucket');
  { const hk = lerp(EN, WN, 0.82), bc = add(hk, [-10, 190]);
    f.line([add(hk, [-20, 0]), add(bc, [-56, -70])], 4, P.silverD); f.line([add(hk, [20, 0]), add(bc, [56, -70])], 4, P.silverD); // the bail hooked on the wrist
    const bu = [add(bc, [-60, -74]), add(bc, [60, -74]), add(bc, [50, 50]), add(bc, [0, 66]), add(bc, [-50, 50])];
    const buD = f.part(bu, { fill: P.silver, shadow: P.silverD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 2, maxShade: 20 });
    X.stains(f, buD, [bc[0] - 70, bc[1] - 80, bc[0] + 70, bc[1] + 80], '#1e2220', 0.06, 3, -1.4, 23, 0.6);
    for (const y of [-56, 20]) f.line([add(bc, [-58, y]), add(bc, [0, y + 10]), add(bc, [56, y])], 4, P.silverD);
    f.part(ell(add(bc, [0, -74]), 60, 16, 0, 16), { fill: mix(P.glaze, P.frost, 0.4), shadow: P.frostS, shade: 0.4, inkW: 1.6, cast: false, tex: 'icetex' + seed, texOp: 0.5 }); // the water frozen solid
    const a0 = add(bc, [14, -80]), a1 = add(bc, [80, -210]); f.part(limb(a0, a1, 12, 10, { steps: 6 }), { fill: P.silverD, shade: 0.4, inkW: 1.3, cast: false }); f.part(ell(a1, 18, 16, 0, 10), { fill: P.silver, shadow: P.silverD, shade: 0.42, inkW: 1.4, cast: false }); for (let i = 0; i < 6; i++) f.flat(ell(add(a1, rot([10, 0], i)), 2, 2, 0, 5), '#141410'); // the sprinkler frozen in it
    f.part(ell(add(bc, [10, -74]), 22, 8, 0, 10), { fill: P.frost, shade: 0.4, inkW: 1, cast: false }); FX.icicles([add(bc, [-50, 50]), add(bc, [0, 66]), add(bc, [50, 50])], 4, 26, 6); }
  f.bone('hand_n');
  X.grip(f, WN, EN, pA, 54, mix(P.skin, P.skinD, 0.1), 'chaplain near', { nail: '#5a5a52' });
  f.bone('hand_f');
  X.grip(f, WF, EF, pA, 52, mix(P.skin, P.skinD, 0.25), 'chaplain far', { nail: '#5a5a52' });
  f.bone('root');
  f.flat(ell([560, gy + 2], 340, 10, 0, 20), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ PEST-HOUSE WATCHMAN (elite 2.1)
// The watchman of the barrow's pest-house, who nailed the sick into their houses until someone nailed him into his
// watch-box. Big and square, feet planted wide and the weight low; the tall oak watch-box strapped to his back like a
// shell, its front torn away round him and its roof boards jutting over his iron kettle hat; the iron door-bar held
// two-handed as a club across his body, its hasp end raised to swing.
// Canvas: true size wins (guide 2): at 2.1 with the roof over his head the figure does not fit the elite canvas, so it is
// heightened to 1100 x 1600 at the same pixel scale (ground = 1570).
// Remnant of the trade: the box, the door-bar with its hasp and staple, the pest-house keys, the nail apron, the claw
// hammer, the padlock, the lantern hook, the vinegar rag. The plague cross daubed red on the roof board (red: doom) with a
// plea lettered under it. The one mark pushed hard is toxin's in the wounds: the nail holes through both hands where he
// was nailed to the box's sides, grey-green mould blooming out of each and along the finger joints; buboes in the armpits
// split the jack's seams. Frost greys him, rimes the box and freezes his breath on the rag.
// Rig: standard humanoid + box (torso) + bar (parent hand_f; the near hand on it needs IK) + apron (pelvis) + hat (head).
// Motion: idle a heavy shift that knocks the box against his shoulders; attack a door-bar blow that pins a hero (Stun).
function pestWatchman() {
  const CW = 1100, CH = 1600, seed = 923;
  const f = new Fig(X.base(seed, CH, { grimeY: 1250 }));
  X.texturesB(f); const FX = X.fx(f);
  const H = 206, gy = f.o.groundY;
  const SKd = (o = {}) => X.SK(f, Object.assign({ maxShade: 30 }, o));
  const IRNW = (o = {}) => Object.assign({ fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, inkW: 1.6, cast: false }, o);
  const JACK = (o = {}) => Object.assign({ fill: mix(P.leather, P.leatherL, 0.55), shadow: '#14130e', tex: 'quilt' + seed, texOp: 0.6, shade: 0.42, maxShade: 60 }, o);
  const OAK = (o = {}) => Object.assign({ fill: mix(P.wood, P.woodL, 0.3), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.75, shade: 0.42, inkW: 1.8, maxShade: 50 }, o);
  const DOOM = '#7a2a22';
  const N = [548, 578], C = [528, 770], Pv = [524, 960];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.42, 0.14), SF = S.at(0.42, 0.1);
  const bB = [672, 1010], bT = [860, 440], bA = ang(bB, bT);                   // the door-bar held across the body, the hasp end raised
  const WF = lerp(bB, bT, 0.12), WN = lerp(bB, bT, 0.0);                     // two hands close together near its butt, the far hand above
  const EF = X.ik(SF, WF, 300, 260, 1)[0], EN = X.ik(SN, WN, 300, 260, 1)[0];
  const HN = [470, 968], AN = [330, 1440], KN = X.ik(HN, AN, 300, 270, 1)[0];  // feet planted wide, the knees bent, the weight low
  const HF = [566, 960], AF = [790, 1440], KF = X.ik(HF, AF, 300, 270, -1)[0];
  const neck0 = S.at(0.14, -0.04), HC = [592, 432], hA = 0.08;
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('box', S.at(-0.6, 0.2), 'torso').joint('bar', WF, 'hand_f').joint('apron', S.at(0.3, 0.86), 'pelvis').joint('hat', add(HC, [0, -70]), 'head');

  // ---- the watch-box on his back: oak planks, the near side wall receding behind him, the inside of the back wall round
  // his body, the far wall's torn front edge with the bent nails still pointing inward; the roof jutting over his head
  f.bone('box');
  const xn = 404, xb = 140, xf = 760, yT = 236, yB = 1190;
  // the inside: the back wall seen through the torn-away front, dark, mould grown in the corners and the plank joints
  const inside = [[xn, yT - 6], [xf, yT - 40], [xf, yB - 40], [xn, yB]];
  const iD = f.part(inside.map(q => [...q, 1]), OAK({ fill: mix(P.woodD, '#000', 0.25), maxShade: 10 }));
  X.clipDraw(f, iD, () => { for (let x = xn + 40; x < xf; x += 58) f.line([[x, yT], [x + 2, yB]], 3, '#0a0a08', { op: 0.8 }); X.mould(f, [xn + 30, yB - 60], 40, 30, { rings: 2 }); X.mould(f, [xf - 30, yT + 40], 36, 28, { rings: 2 }); X.mould(f, [xn + 30, yT + 50], 30, 40, { rings: 1 }); X.fungalFur(f, [[xn + 6, yT + 20], [xn + 8, yB - 20]], 10, 1, { gaps: 0.3 }); X.softTone(f, iD, [[[[xn, yT], [xf, yT], [xf, yT + 200], [xn, yT + 200]], '#000', 0.5, 30]]); });
  // the far wall's front edge: a plank seen edge-on, splintered where the front was torn off, bent nails pointing inward
  f.part([[xf - 6, yT - 44], [xf + 26, yT - 50], [xf + 30, yB - 46], [xf - 2, yB - 40]].map(q => [...q, 1]), OAK({ maxShade: 6 }));
  for (let i = 0; i < 7; i++) { const y = yT + 40 + i * 130 + R(f, -20, 20); f.part([[xf + 26, y - 10], [xf + 44 + R(f, 0, 20), y - 4], [xf + 26, y + 8]], OAK({ maxShade: 3, inkW: 1.2 })); const n0 = [xf + 6, y + 30]; f.line([n0, add(n0, [-22, 2]), add(n0, [-30, 14])], 3, P.iron); f.flat(ell(add(n0, [-30, 14]), 2, 2, 0, 5), mix(P.ironD, P.mouldD, 0.35), { op: 0.8 }); }
  // the near side wall in perspective: its back edge further off, so shorter and drawn toward the eye-level line; the
  // planks run back along it and close up as they recede; two battens across, a lantern hook at the back corner
  const hz = 1090, kb = 0.12, yTb = yT + 30 + (hz - yT) * kb, yBb = yB - (yB - hz) * kb;
  const WP = (t, y) => { const yy = lerp([0, yT + 30 - (yT - y) * 0], [0, 0], 0)[1]; const top = yT + 30 + (yTb - yT - 30) * t, bot = yB + (yBb - yB) * t, k = (y - (yT + 30)) / (yB - yT - 30); return [xn + (xb - xn) * t, top + (bot - top) * k]; }; // t 0 front edge -> 1 back edge, y on the front edge
  const wall = [WP(1, yT + 30), WP(0, yT + 30), WP(0, yB), WP(1, yB)];
  const wD = f.part(wall.map(q => [...q, 1]), OAK({ tex: 'grain' + seed }));
  X.stains(f, wD, [xb, yT, xn, yB], P.mouldD, 0.02, 3, -1.6, 3, 0.7); X.stains(f, wD, [xb, yT, xn, yB], '#0b0b08', 0.03, 3, -1.5, 5, 0.5);
  X.clipDraw(f, wD, () => {
    for (let i = 1; i < 9; i++) { const y = yT + 30 + i * (yB - yT - 30) / 9; f.line([WP(0, y), WP(1, y)], 3.4, '#0e0d0a', { op: 0.8 }); f.line([add(WP(0, y), [0, 4]), add(WP(1, y), [0, 3])], 1.4, P.woodL, { op: 0.35 }); } // plank seams running back
    for (const y of [yT + 120, yB - 160]) { const b0 = [WP(0, y - 24), WP(0, y + 24), WP(1, y + 24), WP(1, y - 24)]; f.part(b0.map(q => [...q, 1]), OAK({ fill: P.wood, inkW: 1.4, maxShade: 6, cast: true })); for (let t = 0.08; t < 1; t += 0.2) f.rivet(WP(t, y), 4.4 * (1 - t * 0.12), P.ironL); } // battens, nailed
    X.softTone(f, wD, [[[WP(0.6, yT), WP(1.1, yT), WP(1.1, yB), WP(0.6, yB)], '#000', 0.45, 30], [[WP(0, yT), WP(0.25, yT), WP(0.25, yB), WP(0, yB)], '#ffffff', 0.08, 20]]);
    X.mould(f, WP(0.8, yB - 60), 30, 22, { rings: 1 });
  });
  // the front edge of the near wall: the plank ends with their thickness, torn where the front was ripped away
  f.part([WP(0, yT + 30), add(WP(0, yT + 30), [26, -4]), add(WP(0, yB), [26, -2]), WP(0, yB)].map(q => [...q, 1]), OAK({ fill: mix(P.wood, P.woodL, 0.45), maxShade: 4, tex: 'grainv' + seed }));
  for (let i = 0; i < 8; i++) { const y = yT + 80 + i * 112 + R(f, -20, 20); f.part([[xn + 22, y - 10], [xn + 46 + R(f, 0, 24), y - 2], [xn + 22, y + 9]], OAK({ maxShade: 3, inkW: 1.2 })); }
  FX.rime([WP(1, yT + 40), WP(1, (yT + yB) / 2), WP(1, yB - 40)], 14, 1, { wind: [-1, 0] });
  FX.icicles([WP(1, yB), WP(0, yB)], 7, 50, 9); X.fungalFur(f, [WP(1, yB - 2), WP(0, yB - 2)], 10, -1, { gaps: 0.4 });
  { const q = add(WP(0.94, yT + 70), [0, 0]); f.line([q, add(q, [-40, 0]), add(q, [-46, 30]), add(q, [-36, 40])], 6, P.iron); f.rivet(q, 5, P.ironL); FX.icicle(add(q, [-46, 32]), 20, 5); } // the lantern hook
  // the strap fittings: iron plates bolted to the box's front edges at his shoulders, a D-ring in each, the straps
  // running from them over his shoulders
  for (const [q, k] of [[[xn + 14, 560], 0], [[xn + 14, 840], 1], [[xf + 10, 540], 2]]) { f.part([add(q, [-16, -30]), add(q, [16, -30]), add(q, [16, 30]), add(q, [-16, 30])].map(p => [...p, 1]), IRNW()); for (const dy2 of [-18, 18]) f.rivet(add(q, [0, dy2]), 4, P.ironL); f.line(ell(add(q, [24, 0]), 14, 20, 0, 12).slice(3, 11), 7, P.iron); f.rivet(add(q, [10, 0]), 3, P.ironL); }
  // the roof: a thick slab of boards pitched forward, overhanging the near wall and jutting over his head. Above eye level,
  // so its underside shows: the eaves board, the rafter ends, the overhang in shadow; the front board carries the cross
  const rE = [[xb - 50, yT - 14], [xn - 10, yT - 52], [xf + 150, yT - 120]], rT = 76;
  const under = [add(rE[0], [0, rT]), add(rE[1], [0, rT]), add(rE[2], [0, rT]), add(rE[2], [-40, rT + 34]), add(rE[1], [20, rT + 40]), add(WP(1, yT + 30), [-10, 0])];
  f.part(under.map(q => [...q, 1]), OAK({ fill: mix(P.woodD, '#000', 0.2), maxShade: 6, cast: false })); // the underside of the overhang, in shadow
  for (let t = 0.05; t < 1; t += 0.11) { const q = lerp(add(rE[1], [10, rT + 4]), add(rE[2], [-30, rT + 4]), t); f.part([q, add(q, [16, 0]), add(q, [14, 30]), add(q, [-2, 30])].map(p => [...p, 1]), OAK({ fill: P.wood, maxShade: 3, inkW: 1.1, cast: false })); } // rafter ends
  for (let t = 0.1; t < 1; t += 0.25) { const q = lerp(add(rE[0], [10, rT + 4]), add(rE[1], [0, rT + 4]), t); f.part([q, add(q, [14, -2]), add(q, [12, 26]), add(q, [-2, 26])].map(p => [...p, 1]), OAK({ fill: P.wood, maxShade: 3, inkW: 1.1, cast: false })); }
  const slab = [rE[0], rE[1], rE[2], add(rE[2], [0, rT]), add(rE[1], [0, rT]), add(rE[0], [0, rT])];
  const slD = f.part(slab.map(q => [...q, 1]), OAK({ fill: mix(P.wood, P.woodL, 0.35), maxShade: 10 }));
  X.clipDraw(f, slD, () => { f.line([add(rE[0], [0, rT * 0.5]), add(rE[1], [0, rT * 0.5]), add(rE[2], [0, rT * 0.5])], 3, '#0e0d0a', { op: 0.6 }); X.stains(f, slD, [xb - 60, yT - 110, xf + 160, yT + 60], P.mouldD, 0.04, 3, -1.8, 41, 0.5); for (let t = 0.1; t < 1; t += 0.12) { const q = lerp(rE[1], rE[2], t); f.line([q, add(q, [0, rT])], 1.6, '#0e0d0a', { op: 0.5 }); } });
  // the front board, its face toward us past his head, with the plague cross daubed red and the plea under it
  const fascia = [add(rE[2], [0, 0]), add(rE[2], [20, -14]), add(rE[2], [20, rT + 30]), add(rE[2], [0, rT + 34])];
  f.part(fascia.map(q => [...q, 1]), OAK({ fill: P.woodL, maxShade: 3, cast: false }));
  { const cc = lerp(add(rE[1], [0, rT * 0.5]), add(rE[2], [0, rT * 0.5]), 0.3); for (const [a2, b2] of [[[-50, 0], [52, -6]], [[0, -32], [2, 32]]]) { const p0 = add(cc, a2), p1 = add(cc, b2); f.stroke([p0, lerp(p0, p1, 0.5).map((v, j) => v + (j ? 3 : 0)), p1], 20, DOOM, { op: 0.9 }); f.line([add(p1, [2, 4]), add(p1, [4, 34])], 4, DOOM, { op: 0.8 }); } // the plague cross daubed red on the roof board, run down
    for (let i = 0; i < 11; i++) { const q = add(cc, [76 + i * 24, -8 - i * 3.2]); f.line([q, add(q, [4 + R(f, -3, 3), 20]), add(q, [11, 5])], 3.4, DOOM, { op: 0.85 }); } } // the plea lettered beside it
  FX.rime([rE[0], rE[1], rE[2]].map(q => add(q, [0, -2])), 14, 1);
  FX.icicles([add(rE[1], [20, rT + 40]), add(rE[2], [-40, rT + 34])], 9, 56, 9); FX.icicles([add(rE[0], [10, rT]), add(rE[1], [0, rT])], 4, 40, 8);

  // ---- far arm (behind), jack sleeve
  X.arm(f, SF, EF, WF, '_f', { ws: [124, 104, 84], skin: SKd({ fill: mix(P.skin, P.skinD, 0.3) }), sleeve: { look: JACK({ fill: mix(P.leather, P.leatherL, 0.3) }), to: 1.86, slack: 1.12, rag: 10 } });

  // ---- legs: leather breeches, the knees bound, boots; feet planted wide
  X.leg(f, FX, HF, KF, AF, '_f', { ws: [170, 124, 92], look: JACK({ fill: mix(P.leather, '#000', 0.1), tex: 'mottle' + seed }), wraps: mix(P.linenD, P.wool, 0.3), turns: 8, foot: 'boot', fs: 122, shoe: P.leatherD, dirt: 0.3 });
  X.leg(f, FX, HN, KN, AN, '_n', { ws: [176, 128, 94], look: JACK({ tex: 'mottle' + seed }), wraps: mix(P.linenD, P.wool, 0.2), turns: 8, foot: 'boot', fs: 124, shoe: P.leatherD, dirt: 0.3 });

  // the jack's skirt below the belt, flaring over the hips in heavy folds, split at the side seam
  f.bone('apron');
  { const sk = [S.at(-1.0, 0.8), S.at(1.06, 0.78), add(S.at(1.12, 1.0), [10, 30]), [...add(S.at(0.9, 1.06), [0, 60]), 1], add(S.at(0.5, 1.06), [0, 40]), [...add(S.at(0.1, 1.08), [0, 62]), 1], add(S.at(-0.4, 1.06), [0, 40]), [...add(S.at(-0.84, 1.06), [-10, 56]), 1], add(S.at(-1.1, 1.0), [-14, 20])];
    const skD = f.part(sk, JACK({ fill: mix(P.leather, P.leatherL, 0.45) })); X.stains(f, skD, [280, 900, 820, 1200], '#0b0b08', 0.04, 3, -1.5, 63, 0.55);
    X.clipDraw(f, skD, () => { for (const u of [-0.8, -0.4, 0.0, 0.4, 0.8]) f.stroke([S.at(u, 0.84), S.at(u + 0.06, 0.96), S.at(u - 0.02, 1.1)], 7, '#100f0c', { op: 0.5 }); X.softTone(f, skD, [[[S.at(-1.2, 0.8), S.at(1.2, 0.8), S.at(1.2, 0.9), S.at(-1.2, 0.9)], '#000', 0.4, 12]]); }); }
  // ---- the nail apron over the jack's skirt
  f.bone('apron');
  const ap = [S.at(-0.3, 0.8), S.at(0.8, 0.78), [748, 1100], [...[760, 1200], 1], [700, 1186], [...[640, 1206], 1], [590, 1186], [...[530, 1204], 1], [490, 1180], [480, 1080]];
  const apD = f.part(ap, { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, maxShade: 30 });
  X.stains(f, apD, [470, 900, 780, 1220], '#0b0b08', 0.04, 3, -1.4, 11, 0.6);
  for (let i = 0; i < 5; i++) { const q = [520 + i * 46, 1020 + (i % 2) * 20]; f.part([add(q, [-20, -24]), add(q, [20, -24]), add(q, [18, 22]), add(q, [-18, 22])], { fill: P.leatherD, shade: 0.4, inkW: 1.2, cast: false, tex: 'mottle' + seed, texOp: 0.5 }); for (let k = 0; k < 3; k++) { const n0 = add(q, [-10 + k * 10, -24]); f.line([n0, add(n0, [R(f, -3, 3), -22])], 3, P.iron); f.flat(ell(add(n0, [0, -22]), 4, 2, 0, 6), P.ironL); } } // the nail pockets, a fistful of nails in each
  f.bone('torso');
  f.bone('torso');
  // the padded jack shaped over the body: the shoulders sloping off the neck, the barrel of the chest, the hard belly
  // pushing the quilting out over the belt, which cinches it into folds above and below
  const torso = S.shape([[-0.1, 0.3, 0.3], [0.0, 0.74, 0.56], [0.08, 0.98, 0.86], [0.2, 1.06, 1.06], [0.32, 1.04, 1.14], [0.44, 0.98, 1.08], [0.56, 0.96, 1.16], [0.68, 0.94, 1.18], [0.78, 0.9, 1.06], [0.84, 0.92, 1.02], [0.96, 1.0, 1.06]]);
  const tD = f.part(torso, JACK({ tex: 'mottle' + seed, texOp: 0.6 }));
  X.stains(f, tD, [300, 480, 800, 1000], '#0b0b08', 0.03, 3, -1.5, 13, 0.55); X.stains(f, tD, [300, 480, 800, 1000], P.mouldD, 0.04, 3.2, -2.0, 15, 0.5);
  X.clipDraw(f, tD, () => {
    // the quilting following the form: rows bowing round the chest and the belly, stitched
    for (let v = 0.1; v < 0.8; v += 0.075) { const row = []; for (let u = -1.1; u <= 1.25; u += 0.15) row.push(S.at(u, v + 0.05 * Math.cos(u * 1.3) - (v > 0.45 ? 0.03 * Math.cos(u) : 0))); f.line(row, 2.2, '#16140f', { op: 0.55 }); f.line(row.map(q => add(q, [0, -3])), 1, P.leatherL, { op: 0.35 }); }
    for (let u = -0.9; u < 1.2; u += 0.3) { const col = []; for (let v = 0.06; v < 0.8; v += 0.06) col.push(S.at(u + 0.08 * Math.sin(v * 4) * (u > 0 ? 1 : -1), v)); f.line(col, 1.4, '#16140f', { op: 0.35, dash: '3 3' }); }
    X.softTone(f, tD, [
      [[S.at(-1.3, 0), S.at(-0.55, 0), S.at(-0.55, 1), S.at(-1.3, 1)], '#000', 0.45, 24], // the flank away from the light
      [[S.at(0.0, 0.36), S.at(1.2, 0.36), S.at(1.2, 0.46), S.at(0.0, 0.46)], '#000', 0.4, 14], // under the chest
      [[S.at(0.2, 0.12), S.at(1.0, 0.12), S.at(0.9, 0.3), S.at(0.3, 0.3)], '#ffffff', 0.16, 18], // the chest's upper plane, lit
      [[S.at(0.3, 0.54), S.at(1.1, 0.54), S.at(1.0, 0.7), S.at(0.4, 0.7)], '#ffffff', 0.12, 16], // the belly's front, lit
      [[S.at(-1.2, 0.0), S.at(1.0, -0.05), S.at(0.9, 0.06), S.at(-1.1, 0.08)], '#000', 0.25, 12], // the shoulders turning over
    ]);
    // folds bunched above and below the belt
    for (let i = 0; i < 6; i++) { const u = -0.8 + i * 0.36; f.stroke([S.at(u, 0.7), S.at(u + 0.05, 0.75), S.at(u - 0.02, 0.79)], 5, '#100f0c', { op: 0.55 }); }
    for (let i = 0; i < 14; i++) f.rivet(S.at(-0.6 + (i % 5) * 0.4, 0.16 + Math.floor(i / 5) * 0.2), 4.4, P.ironL);
  });
  // the shoulder seams standing up where the box's straps press the padding down
  for (const u of [-0.6, 0.5]) X.crease(f, [S.at(u - 0.15, -0.02), S.at(u, 0.04), S.at(u + 0.15, 0.0)], 3, { col: '#100f0c', lit: P.leatherL, op: 0.6 });
  // the seams split by the armpit buboes: the quilting torn open, grey-green swelling pushing out with stuffing
  for (const [u, v, r] of [[-0.8, 0.32, 44]]) { const q = S.at(u, v); f.flat(ell(q, r * 0.9, r * 1.2, 0.3, 12).map(p => add(p, [R(f, -5, 5), R(f, -5, 5)])), '#100f0c'); X.bubo(f, q, r * 0.8, { sag: 0.5, mixSkin: 0.4 }); for (let i = 0; i < 6; i++) { const a = i * 1.05, p0 = add(q, rot([r * 0.9, 0], a)); f.line([p0, add(p0, rot([10, 4], a))], 2.4, P.linenL, { op: 0.8 }); } }
  // the box's straps over his shoulders and under his arms, iron buckles
  for (const [a, b, c] of [[[xn + 38, 560], S.at(-0.5, -0.08), S.at(0.2, 0.3), S.at(0.6, 0.5)].slice(1), [S.at(-0.9, 0.2), S.at(-0.6, 0.5), S.at(-0.3, 0.7)]]) { f.line([a, b, c], 30, P.leatherD); f.line([a, b, c].map(q => add(q, [4, -10])), 3, P.leatherL, { op: 0.4 }); }
  { const q = S.at(0.2, 0.3); f.part([add(q, [-22, -20]), add(q, [22, -16]), add(q, [20, 22]), add(q, [-24, 18])], { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.6, cast: false }); f.flat(ell(q, 12, 10, 0, 8), '#141410'); }
  f.part([S.at(-0.96, 0.775), S.at(1.08, 0.765), S.at(1.1, 0.855), S.at(-0.96, 0.87)], { fill: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.8 }); f.line([S.at(-0.96, 0.785), S.at(1.08, 0.775)], 2, P.leatherL, { op: 0.4 }); { const q = S.at(0.36, 0.82); f.part([add(q, [-26, -24]), add(q, [26, -24]), add(q, [26, 24]), add(q, [-26, 24])].map(p => [...p, 1]), IRNW()); f.flat(ell(q, 12, 14, 0, 8), '#141410'); }
  // the ring of pest-house keys, the claw hammer through the belt, the padlock on its chain
  { const q = S.at(-0.36, 0.92); f.part(ell(q, 26, 24, 0, 14).concat([]), { fill: 'none', shade: 0.3, inkW: 0, cast: false }); f.line(ell(q, 26, 22, 0, 14).concat([ell(q, 26, 22, 0, 14)[0]]), 5, P.iron); for (let i = 0; i < 6; i++) { const a = 1.2 + i * 0.32, k0 = add(q, rot([24, 0], a)), k1 = add(k0, rot([60, 0], a - 0.2)); f.part(limb(k0, k1, 8, 7, { steps: 4 }), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.1, cast: false }); f.part([add(k1, rot([0, -8], a)), add(k1, rot([14, -8], a)), add(k1, rot([14, 2], a)), add(k1, rot([6, 2], a))], { fill: P.iron, shade: 0.4, inkW: 1, cast: false }); f.flat(ell(add(k0, rot([20, 0], a)), 5, 3, a, 6), mix(P.ironD, P.mouldD, 0.35), { op: 0.6 }); } }
  { const q = S.at(0.58, 0.82); f.part([add(q, [-8, -30]), add(q, [8, -30]), add(q, [8, 120]), add(q, [-8, 120])], { fill: P.wood, shadow: P.woodD, shade: 0.4, inkW: 1.3, cast: false, tex: 'grainv' + seed, texOp: 0.6 }); f.part([add(q, [-36, -44]), add(q, [10, -50]), add(q, [40, -40]), add(q, [44, -24]), add(q, [12, -30]), add(q, [-30, -24])], { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.6 }); f.line([add(q, [44, -24]), add(q, [56, -6])], 5, P.iron); f.line([add(q, [40, -40]), add(q, [60, -30])], 5, P.iron); } // the claw hammer
  { const q = S.at(-0.66, 0.84); X.ironChain(f, [q, add(q, [-6, 70]), add(q, [4, 120])], 20, 5, P.iron); const pl = add(q, [4, 160]); f.part([add(pl, [-28, -26]), add(pl, [28, -26]), add(pl, [30, 26]), add(pl, [-30, 26])].map(p => [...p, 1]), { fill: P.iron, shadow: P.ironD, shade: 0.42, inkW: 1.6, tex: 'mottle' + seed, texOp: 0.7 }); f.line([add(pl, [-18, -26]), add(pl, [-18, -50]), add(pl, [18, -50]), add(pl, [18, -26])], 7, P.ironL); f.flat(ell(pl, 5, 9, 0, 6), '#0a0a08'); f.flat(ell(add(pl, [10, 10]), 10, 6, 0, 8), mix(P.ironD, P.mouldD, 0.35), { op: 0.6 }); FX.icicle(add(pl, [0, 26]), 18, 5); }
  FX.rime([S.at(-0.4, -0.06), S.at(-0.9, 0.1), S.at(-1.04, 0.4)], 12, 1);

  // ---- head: a broad frozen face under the kettle hat, the vinegar rag over nose and mouth with frozen breath on it
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(K.chain([add(neck0, [-10, 30]), hF([[-0.08, 0.4]])[0]], [150, 122]), SKd({ maxShade: 14 }));
  X.deadHead(f, FX, HC, H, hA, { head: { jaw: 1.32, chin: 0.04, nose: 1.0, hook: 0.1, mouth: 'set', noEar: false, browDown: 0.1 }, lid: 0.1 });
  // the rag tied over nose and mouth, frozen stiff, the breath frozen on it in a crust
  const rag = hF([[0.04, 0.04], [0.2, 0.02], [0.38, 0.06], [0.42, 0.24], [0.36, 0.44], [0.2, 0.56], [0.0, 0.5], [-0.14, 0.32], [-0.22, 0.12], [-0.1, 0.08]]);
  const rD = f.part(rag, { fill: mix(P.linen, P.linenD, 0.3), shadow: '#24231d', tex: 'weave' + seed, texOp: 0.6, shade: 0.42, maxShade: 12 });
  X.stains(f, rD, [HC[0] - 60, HC[1] - 20, HC[0] + 100, HC[1] + 130], P.mouldD, 0.06, 3, -1.6, 19, 0.5);
  for (let i = 0; i < 3; i++) f.line(hF([[0.0 + i * 0.12, 0.12], [0.06 + i * 0.12, 0.3], [0.0 + i * 0.12, 0.48]]), 1.6, '#16150f', { op: 0.45 });
  FX.glaze(hF([[0.26, 0.14], [0.42, 0.2], [0.44, 0.34], [0.3, 0.36], [0.24, 0.26]]), 0.45); FX.frost(hF([[0.36, 0.26]])[0], 18, 16, 14, 1.6); // the breath frozen on the rag
  { const kn = hF([[-0.3, 0.16]])[0]; f.part(ell(kn, 14, 12, 0, 8), { fill: P.linenD, shade: 0.4, inkW: 1.2, cast: false }); f.stroke([kn, add(kn, [-14, 40]), add(kn, [-8, 70])], 12, P.linenD); FX.icicle(add(kn, [-8, 70]), 18, 5); }
  f.bone('hat');
  // the iron kettle hat: a round crown and a wide flat brim, riveted, dented, rust bloom
  { const cr = hF([[-0.44, -0.18], [-0.42, -0.46], [-0.24, -0.66], [0.04, -0.72], [0.28, -0.6], [0.4, -0.38], [0.38, -0.18]]), br = hF([[-0.66, -0.16], [-0.6, -0.26], [0.0, -0.3], [0.58, -0.24], [0.66, -0.12], [0.6, -0.06], [0.0, -0.12], [-0.6, -0.08]]);
    f.part(cr, { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.45, inkW: 2, maxShade: 20 }); f.part(br, { fill: P.ironL, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, inkW: 2, maxShade: 10 });
    f.line(hF([[-0.1, -0.7], [-0.14, -0.4], [-0.16, -0.22]]), 4, P.ironD, { op: 0.7 }); for (let i = 0; i < 7; i++) f.rivet(hF([[-0.42 + i * 0.13, -0.22]])[0], 4, P.ironL);
    f.flat(hF(ell([0.1, -0.48], 0.1, 0.06, 0, 8)), mix(P.ironD, P.mouldD, 0.35), { op: 0.55 }); X.crease(f, hF([[0.16, -0.62], [0.24, -0.5]]), 3, { col: '#0e0e0c', lit: P.ironL });
    FX.rime(hF([[-0.66, -0.18], [-0.3, -0.3], [0.2, -0.3], [0.6, -0.26]]), 6, 1); FX.icicles(hF([[-0.6, -0.06], [0.0, -0.1], [0.6, -0.04]]), 5, 22, 5); }

  // ---- the door-bar: an iron bar, square in section, the hasp and staple still on its raised end
  f.bone('bar');
  { const b0 = add(bB, rot([-30, 0], bA)), dB = E.norm(sub(bT, bB)), nB = [-dB[1], dB[0]];
    f.part([add(b0, mul(nB, 18)), add(bT, mul(nB, 16)), add(bT, mul(nB, -16)), add(b0, mul(nB, -18))].map(q => [...q, 1]), { fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, inkW: 2, maxShade: 10 });
    f.line([add(b0, mul(nB, 10)), add(bT, mul(nB, 8))], 3, P.ironL, { op: 0.6 }); // the lit arris
    for (const t of [0.3, 0.55, 0.8]) f.flat(ell(lerp(b0, bT, t), 18, 8, bA, 8), mix(P.ironD, P.mouldD, 0.35), { op: 0.55 });
    const hs = lerp(b0, bT, 0.92); f.part([add(hs, mul(nB, 18)), add(add(hs, mul(nB, 70)), mul(dB, -10)), add(add(hs, mul(nB, 74)), mul(dB, 30)), add(hs, add(mul(nB, 18), mul(dB, 40)))].map(q => [...q, 1]), { fill: P.ironL, shadow: P.ironD, shade: 0.4, inkW: 1.6, cast: false }); f.flat(ell(add(add(hs, mul(nB, 52)), mul(dB, 10)), 10, 6, bA, 8), '#0a0a08'); // the hasp
    const st = lerp(b0, bT, 0.8); f.line([add(st, mul(nB, -16)), add(add(st, mul(nB, -44)), mul(dB, 6)), add(add(st, mul(nB, -44)), mul(dB, 32)), add(add(st, mul(nB, -16)), mul(dB, 36))], 7, P.iron); // the staple
    FX.rime([add(b0, mul(nB, 20)), add(bT, mul(nB, 18))], 6, 1); FX.icicles([add(lerp(b0, bT, 0.4), mul(nB, -18)), add(lerp(b0, bT, 0.9), mul(nB, -16))], 3, 30, 6); X.mould(f, lerp(b0, bT, 0.65), 14, 8, { rings: 1 }); }

  // ---- near arm, the hands on the bar: the nail holes through the backs, mould blooming out of each wound
  X.arm(f, SN, EN, WN, '_n', { ws: [128, 108, 86], skin: SKd(), sleeve: { look: JACK(), to: 1.86, slack: 1.12, rag: 10 } });
  f.bone('upperarm_n'); for (let i = 0; i < 4; i++) f.stroke([lp(SN, EN, 0.2 + i * 0.18, -50), lp(SN, EN, 0.24 + i * 0.18, 0), lp(SN, EN, 0.2 + i * 0.18, 50)], 4, '#100f0c', { op: 0.45 }); for (let i = 0; i < 4; i++) f.rivet(lp(SN, EN, 0.2 + i * 0.16, -20 + (i % 2) * 40), 4, P.ironL);
  FX.rime([lp(SN, EN, 0.0, -70), lp(SN, EN, 0.5, -66), lp(SN, EN, 0.9, -56)], 10, -1);
  const wound = g => { const q = g.F([[0.0, 0.0]])[0]; f.flat(ell(q, 9, 7, g.ang, 8), '#0a0a08'); X.mould(f, q, 22, 16, { rings: 2 }); X.fungalFur(f, ell(q, 14, 11, g.ang, 10), 9, 1, { gaps: 0.2 }); for (let i = 0; i < 4; i++) { const k = g.F([[0.36, -0.45 + i * 0.3]])[0]; X.mould(f, k, 7, 5, { rings: 0, ink: 0 }); } };
  f.bone('hand_f');
  wound(X.grip(f, WF, EF, bA, 68, mix(P.skin, P.skinD, 0.25), 'watchman far', { nail: '#4a4844' }));
  f.bone('hand_n');
  wound(X.grip(f, WN, EN, bA, 70, P.skin, 'watchman near', { nail: '#4a4844' }));
  f.bone('root');
  f.flat(ell([560, gy + 2], 380, 10, 0, 20), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE KING'S HAWK (cast, small 0.5 to the hood)
// The Barrow King's falcon, set on its block among the grave goods at his right hand and sealed in alive. A big falcon,
// once white barred with grey, standing upright on a turned oak block on an iron spike; the wings half opened and
// drooping over the block's edge, the blind hooded head turned toward the company; the weight on the clenched feet.
// Wings: the reviewed kit_VI builder (slotted primaries, secondaries, layered greater, median and marginal coverts).
// The hood: still on, tooled leather with a plume; its near eye-piece has split along the stitching, and a small dark,
// filmed eye shows under the brow ridge through the split (no staring disc; IX is not a void world).
// Remnant: the falconer's furniture (hood, jesses with silver rings, bells, leash, block). The one mark pushed hard is
// frost's: the feathers frozen into hard overlapping plates, rime crusting the windward wing, icicles from the tail and
// the jesses; toxin swells the feet into sore-crusted pads sunk in the cushion and bulges the crop like a bubo.
// Rig: block (root) > body > head, tail, wing_n_1..3, wing_f_1..3, leg_n, leg_f. Motion: idle the hooded head jerking
// toward each sound while the bells clink; attack a bating lunge to the end of the leash, the swollen talons raking.
function kingsHawk() {
  const [CW, CH] = TIERS.small, seed = 927;
  const f = new Fig(X.base(seed, CH, { grimeY: 640 }));
  X.texturesB(f); const FX = X.fx(f);
  const gy = f.o.groundY;
  const FW = '#cfd3cb', FG = '#7e857e', BAR = '#5a615a';
  const FE = (o = {}) => Object.assign({ fill: FW, shadow: '#3c423e', light: '#eef0ea', shade: 0.42, tex: 'barb' + seed, texOp: 0.5, inkW: 1, inkHeavy: 1.4 }, o);
  const SKN = (o = {}) => Object.assign({ fill: mix('#b8b498', P.mouldY, 0.25), shadow: '#4a4838', shade: 0.4, tex: 'scute' + seed, texOp: 0.6, inkW: 1.1, inkHeavy: 1.6 }, o);
  const bx = 300, bTop = 662, bBot = 738, bR = 60;
  const Bd = [304, 588], N0 = [322, 530], HC = [334, 504], hA = -0.08;          // body centre, neck base, head
  const SN = [296, 548], SF = [326, 544];
  const wN = { S: SN, E: [262, 586], W: [286, 628], T: [270, 664] }, wF = { S: SF, E: [352, 584], W: [372, 624], T: [386, 660] };
  const FtN = [292, bTop - 2], FtF = [324, bTop - 6], KN = [290, 626], KF = [320, 624];
  f.joint('block', [bx, bBot]).joint('body', Bd, 'block').joint('head', N0, 'body').joint('tail', [280, 640], 'body');
  for (const [k, w] of [['n', wN], ['f', wF]]) f.joint(`wing_${k}_1`, w.S, 'body').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  f.joint('leg_n', KN, 'body').joint('leg_f', KF, 'body');

  // ---- the block: a turned oak drum on an iron spike driven into the floor, a leather cushion on top, an iron ring
  f.bone('block');
  f.part([[bx - 8, bBot], [bx + 8, bBot], [bx + 3, gy + 2], [bx - 3, gy + 2]], { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.7 });
  f.flat(ell([bx, gy + 1], 20, 4, 0, 10), '#0e0e0c', { op: 0.6 }); for (let i = 0; i < 5; i++) f.flat(ell([bx + R(f, -26, 26), gy - R(f, 0, 3)], R(f, 3, 7), 2, 0, 6), P.earth, { op: 0.8 });
  const prof = [[bR * 0.86, bBot], [bR * 0.9, bBot - 10], [bR * 0.78, bBot - 18], [bR * 0.72, bBot - 40], [bR * 0.8, bBot - 58], [bR, bTop + 10], [bR * 0.96, bTop]];
  const drum = [...prof.map(([r, y]) => [bx + r, y]), ...prof.slice().reverse().map(([r, y]) => [bx - r, y])];
  const dD = f.part(drum, { fill: mix(P.wood, P.woodL, 0.3), shadow: P.woodD, tex: 'grainv' + seed, texOp: 0.6, shade: 0.42, maxShade: 20, inkW: 1.6 });
  X.clipDraw(f, dD, () => { for (const y of [bBot - 10, bBot - 18, bBot - 58, bTop + 10]) f.line([[bx - bR, y], [bx, y + 6], [bx + bR, y]], 1.6, '#141410', { op: 0.7 }); X.softTone(f, dD, [[[[bx - bR, bTop], [bx - 20, bTop], [bx - 20, bBot], [bx - bR, bBot]], '#000', 0.4, 10]]); for (let i = 0; i < 4; i++) f.line([[bx + 30 + i * 6, bTop + 14], [bx + 28 + i * 5, bBot - 6]], 2.4, '#e8ece4', { op: 0.75 }); }); // droppings frozen white down the side
  f.part(ell([bx, bTop], bR * 0.96, 16, 0, 20), { fill: mix(P.wood, P.woodL, 0.45), shadow: P.woodD, shade: 0.35, inkW: 1.4, cast: false }); // the turned top
  f.part([[bx - 52, bTop - 2], [bx - 44, bTop - 14], [bx, bTop - 18], [bx + 44, bTop - 14], [bx + 52, bTop - 2], [bx + 40, bTop + 8], [bx, bTop + 10], [bx - 40, bTop + 8]], { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.4, inkW: 1.3, cast: false }); // the leather cushion
  for (let i = 0; i < 8; i++) f.rivet([bx - 46 + i * 13, bTop + 2 + Math.sin(i / 7 * Math.PI) * 6], 1.6, P.ironL);
  FX.rime([[bx - bR, bTop + 8], [bx - bR * 0.9, bBot - 40], [bx - bR * 0.8, bBot - 10]], 5, -1, { wind: [-1, 0] }); X.mould(f, [bx - 30, bBot - 30], 12, 8, { rings: 1 });
  const ring = [bx + bR * 0.55, bTop + 30]; f.line(ell(ring, 9, 11, 0, 12).concat([ell(ring, 9, 11, 0, 12)[0]]), 3, P.iron); f.rivet(add(ring, [0, -11]), 2.4, P.ironL);
  // the dead mouse left as an offering, rotted to fur, on the cushion's edge
  X.rat(f, FX, [bx - 34, bTop - 4], Math.PI - 0.1, 34, { state: 'dead', legs: 'splay', G: 0.2, ha: 0.3, tone: 0.2 });
  X.ratTail(f, [[bx - 16, bTop - 2], [bx - 2, bTop + 4], [bx + 10, bTop + 14]], 2.4);

  // ---- the far wing, half open behind the body, drooping past the block's far edge
  const look = FE({ fill: mix(FW, FG, 0.55), inkW: 1.6, inkHeavy: 2.6, shadow: '#262a26' });
  X.wing(f, wF.S, wF.E, wF.W, wF.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: 1, Lp: 92, Ls: 56, Wp: 15, Ws: 15, np: 9, ns: 9, nt: 3, look: FE({ fill: mix(FG, '#000', 0.25), inkW: 1.6, inkHeavy: 2.6, shadow: '#1c1f1c' }), skin: SKN(), notchP: [3], rake: -0.3, wS: 18, wE: 12, wW: 9, bars: 3, barCol: '#2a2e2a', cover: true, spreadP: 0.32, darkTips: 0.45 });
  // ---- the tail hanging down behind the block, barred, frozen into one board, icicles at its tips
  f.bone('tail');
  for (let i = 0; i < 6; i++) { const r0 = add([282, 640], [i * 3, 0]), a = deg(104 + i * 4); X.feather(f, r0, a, 98 + (i % 2) * 6, 17, FE({ fill: mix(FW, '#000', 0.06 + i * 0.03) }), { lead: 0.45, round: true, bars: 4, barCol: BAR }); }
  FX.rime([[270, 650], [262, 700], [256, 736]], 4, 1, { wind: [-1, 0] }); FX.icicles([[256, 738], [286, 742]], 3, 16, 3);

  // ---- legs: feathered trousers to the hock, scaled shanks, the feet swollen into sore-crusted pads, jesses, bells
  for (const [k, Kp, Ft, far] of [['f', KF, FtF, true], ['n', KN, FtN, false]]) {
    f.bone('leg_' + k);
    const lk = SKN(far ? { fill: mix('#a8a690', '#000', 0.25) } : {});
    X.talonFoot(f, add(Kp, [0, 10]), Ft, [[deg(-6), 36, 1], [deg(24), 30, 1], [deg(-30), 28, 1], [deg(186), 24, -1, 'back']], 8, { look: lk, swell: 0.9 });
    X.plumeMass(f, [add(Kp, [-16, -26]), add(Kp, [16, -28]), add(Kp, [18, 8]), add(Kp, [8, 20]), add(Kp, [-4, 12]), add(Kp, [-16, 18])], deg(96), 12, FE({ fill: far ? mix(FW, '#000', 0.2) : FW, maxShade: 4 }), { w: 0.9, op: 0.5, bar: 0.5, barCol: BAR });
    // the jess: a leather strap round the shank, its silver ring, the bell packed with ice
    f.part(limb(add(Kp, [-8, 26]), add(Kp, [10, 26]), 9, 9, { steps: 3 }), { fill: P.leather, shade: 0.4, inkW: 1, cast: false });
    const j1 = add(Kp, [far ? 18 : -4, 58]); f.stroke([add(Kp, [0, 28]), add(Kp, [far ? 10 : -2, 44]), j1], 6, P.leather);
    f.line(ell(j1, 5, 6, 0, 10).concat([ell(j1, 5, 6, 0, 10)[0]]), 2.2, P.silver); FX.icicle(add(j1, [0, 6]), 10, 3);
    const bl = add(Kp, [far ? 22 : -14, 30]); f.part(ell(bl, 7, 7, 0, 10), { fill: P.silverD, shadow: '#222624', shade: 0.42, inkW: 1, cast: false }); f.line([add(bl, [-6, 1]), add(bl, [6, 1])], 1, INK); f.flat(ell(add(bl, [0, 3]), 4, 2.4, 0, 6), P.hoar, { op: 0.85 });
  }
  // the leash from the jesses' rings to the block's iron ring
  f.bone('block'); X.rope(f, [add(KN, [-4, 58]), [bx + 10, bTop + 26], add(ring, [0, 10])], 2.6, P.leatherL);

  // ---- body: the breast barred, the feathers frozen into hard overlapping plates; the crop bulging under the throat
  f.bone('body');
  const body = [[318, 530], [338, 546], [348, 574], [346, 606], [334, 634], [312, 650], [288, 652], [272, 636], [270, 600], [280, 562], [298, 538]];
  X.plumeMass(f, body, deg(92), 13, FE({ maxShade: 10, inkW: 1.4, inkHeavy: 2 }), { w: 1, op: 0.55, bar: 0.6, barCol: BAR, dark: 0.15 });
  X.clipDraw(f, body, () => { X.softTone(f, E.smooth(body), [[[[270, 540], [296, 540], [296, 660], [270, 660]], '#000', 0.35, 8]]); });
  // the crop: a bubo-like swelling under the throat, the feathers parted off it, bruised and taut
  X.bubo(f, [340, 550], 16, { sag: 0.4, mixSkin: 0.5 });
  X.fungalFur(f, ell([340, 552], 18, 15, 0, 10), 4, 1, { gaps: 0.3 });
  // moult: tufts out, the bare patches furred with mould
  for (const q of [[284, 610], [330, 620]]) { f.part(ell(q, 9, 7, 0.4, 8).map(p => add(p, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), X.SK(f, { fill: mix(P.skin, P.mould, 0.4), inkW: 0.8, cast: false, maxShade: 2 })); X.mould(f, q, 8, 6, { rings: 0, ink: 0 }); X.fungalFur(f, ell(q, 9, 7, 0.4, 8), 4, 1); }

  // ---- the near wing, half open and drooping over the block's near edge; rime crusting its windward leading edge
  X.wing(f, wN.S, wN.E, wN.W, wN.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: -1, Lp: 100, Ls: 60, Wp: 16, Ws: 16, np: 9, ns: 10, nt: 3, look, skin: SKN(), notchP: [2, 6], notchS: [4], rake: -0.3, wS: 20, wE: 13, wW: 10, bars: 3, barCol: '#30352f', cover: true, spreadP: 0.3, broken: 5, moult: [3], darkTips: 0.45 });
  f.bone('wing_n_2'); FX.rime([wN.S, wN.E, wN.W], 5, -1, { wind: [-1, -0.3] }); FX.icicles([lerp(wN.E, wN.W, 0.3), lerp(wN.E, wN.W, 0.9)], 2, 12, 3);
  f.bone('wing_n_3'); FX.icicles([wN.W, wN.T], 2, 14, 3);

  // ---- the head: the hooded falcon's head turned toward the company, the hooked beak open below the hood, frost on
  // the cere; the tooled leather hood with its braces and the mould-furred plume
  f.bone('head');
  const hF = frame(HC, hA, 1);
  X.plumeMass(f, hF([[-20, 30], [-22, 4], [-8, -6], [14, -2], [24, 14], [20, 32], [4, 40]]), deg(96), 9, FE({ maxShade: 4 }), { w: 0.8, op: 0.5, bar: 0.4, barCol: BAR }); // the nape and throat below the hood
  // the beak: a deep hooked bill, open, the tomial tooth, the cere above it rimed with frost
  f.part(hF([[18, 2], [30, -2], [40, 4], [44, 16], [38, 22], [36, 14], [26, 12], [18, 14]]), { fill: '#3a3a34', shadow: '#121210', light: '#8a8a80', shade: 0.4, inkW: 1.2, cast: false, hatch: false });
  f.part(hF([[20, 16], [32, 16], [36, 20], [26, 24], [18, 22]]), { fill: '#2e2e2a', shade: 0.4, inkW: 1, cast: false, hatch: false });
  f.flat(hF([[24, 13], [36, 15], [34, 18], [24, 17]]), '#0c0a0a');
  f.part(hF([[14, -4], [26, -6], [30, 0], [18, 4]]), { fill: mix('#9a9880', P.mouldY, 0.3), shade: 0.4, inkW: 0.9, cast: false, hatch: false }); FX.frost(hF([[22, -3]])[0], 6, 2, 3, 0.9); // the cere
  f.line(hF([[32, 4], [38, 10]]), 1, '#9a9a90', { op: 0.6 });
  // the hood: a rounded cap of tooled leather over the crown and eyes, the beak opening cut away, braces at the back
  const hood = hF([[-24, 6], [-28, -14], [-18, -32], [0, -40], [18, -34], [28, -18], [30, -4], [20, 0], [14, -2], [8, 8], [-4, 10], [-16, 12]]);
  const hdD = f.part(hood, { fill: '#3a3226', shadow: '#0e0c08', light: '#6e604a', shade: 0.42, tex: 'mottle' + seed, texOp: 0.5, inkW: 2, inkHeavy: 3, maxShade: 6 });
  f.line(hF([[-24, 4], [-16, 10], [-4, 10], [8, 8], [14, -2]]), 2.4, '#d8ccb0', { op: 0.8 }); f.line(hF([[-26, -12], [-18, -30], [0, -38], [18, -32], [28, -16]]), 1.6, '#c8b898', { op: 0.6 }); // the hood's stitched rim and crown seam, pale against the dark leather
  X.clipDraw(f, hdD, () => { f.line(hF([[-20, -10], [-2, -26], [20, -24]]), 1.2, '#1c1a14', { op: 0.7, dash: '2 2' }); for (let i = 0; i < 3; i++) f.line(hF([[-14 + i * 8, -2], [-10 + i * 8, -16], [-4 + i * 8, -2]]), 0.9, '#1c1a14', { op: 0.6 }); X.mould(f, hF([[-14, 0]])[0], 6, 4, { rings: 0, ink: 0 }); }); // tooling and the stitched seam
  // the split in the near eye-piece: the leather parted along its stitching, and under the brow ridge a small dark, filmed eye
  f.flat(hF([[7, -12.5], [16, -14], [21, -11], [13, -9.5], [6, -10.5]]), '#141210');
  X.animalEye(f, hF([[14, -11.5]])[0], 2.2, hA - 0.1, { film: true, frost: true });
  f.line(hF([[4, -9], [12, -5], [22, -10]]), 1, mix(P.leather, P.leatherL, 0.4));
  // braces and the plume on top, furred with mould
  for (const [a, b] of [[[-26, 0], [-38, 14]], [[-24, 4], [-34, 22]]]) f.stroke(hF([a, lerp(a, b, 0.5), b]), 4, P.leatherD);
  f.part(hF([[-6, -40], [2, -40], [2, -46], [-6, -46]]), { fill: P.silverD, shade: 0.4, inkW: 0.8, cast: false }); // the knot of the topknot
  for (let i = 0; i < 5; i++) { const b0 = hF([[-2, -46]])[0], tp = add(b0, [-8 + i * 4 + R(f, -2, 2), -26 - (i % 2) * 6]); f.stroke([b0, lerp(b0, tp, 0.5).map((v, j) => v + (j ? 0 : R(f, -3, 3))), tp], 5, mix(FW, P.mould, 0.5)); }
  X.mould(f, hF([[-2, -58]])[0], 8, 6, { rings: 0 }); X.fungalFur(f, hF([[-8, -66], [0, -72], [8, -66]]), 4, -1);
  FX.rime(hF([[-26, -12], [-16, -32], [0, -42], [16, -36]]), 3, 1);
  f.bone('root');
  return f;
}

// ------------------------------------------------------------------ SEXTON BEETLES (cast, small, a heap 0.5 high)
// The burying beetles of the barrow earth: a dozen glossy black beetles, each the size of a fist, working over a mound of
// grave earth from which a frozen hand reaches up. Each beetle: a head with mandibles and clubbed antennae (all pointing
// toward the company), a shield-shaped pronotum, short elytra with two bone-white bands, the banded abdomen tip showing;
// six legs thick at the base and jointed (coxa, femur, the flattened spiny digging tibia, tarsus), the Pit Crawler habit.
// The one mark pushed hard is frost's: rime on their backs, one frozen on its back with its legs in the air, the hand
// grey and frozen hard; toxin furs the joints of the older beetles and grows a pale fungal stalk out of a dead one.
// Secondary: the ring on the hand, mites riding the beetles, frozen clods, scraps of grave linen, a beetle dragging a
// finger bone, a scatter of pale eggs in the loosened earth.
// Rig: mound (root) > hand; beetle_1..12 (each its own bone, parent mound). Motion: idle digging, earth flicking; attack
// the swarm pouring over a hero's feet and dragging at them (Toxin, Slow).
function sextonBeetles() {
  const [CW, CH] = TIERS.small, seed = 928;
  const f = new Fig(X.base(seed, CH, { grimeY: 660 }));
  X.texturesB(f); const FX = X.fx(f);
  const gy = f.o.groundY;
  const CH0 = '#1c1c1a', CHL = '#5a5c58', BAND = '#c8c2aa';
  const SHELL = (o = {}) => Object.assign({ fill: CH0, shadow: '#060606', light: '#6a6e6a', shade: 0.42, tex: 'mottle' + seed, texOp: 0.4, inkW: 1.1, inkHeavy: 1.6, maxShade: 6, cast: false }, o);
  const mound = [[90, gy + 2], [120, 730], [170, 676], [230, 642], [300, 626], [370, 634], [430, 660], [484, 708], [520, 760], [536, gy + 2]];
  f.joint('mound', [310, 700]).joint('hand', [318, 640], 'mound');
  // ---- the mound of grave earth: loosened, frozen in clods, rimed on top, mould in it, scraps of linen
  f.bone('mound');
  const mD = f.part(mound, { fill: mix(P.earth, P.stoneD, 0.35), shadow: '#0e0f0c', shade: 0.42, tex: 'mottle' + seed, texOp: 0.85, inkW: 1.8, maxShade: 40 });
  X.stains(f, mD, [80, 600, 540, gy], '#0b0b08', 0.05, 3, -1.2, 3, 0.6); X.stains(f, mD, [80, 600, 540, gy], P.mouldD, 0.05, 3, -1.9, 5, 0.5);
  X.clipDraw(f, mD, () => { for (let i = 0; i < 40; i++) { const q = [R(f, 110, 520), R(f, 640, gy)], r = R(f, 4, 11); f.part(ell(q, r * 1.5, r * 0.8, R(f, -0.4, 0.4), 7).map(p => add(p, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), { fill: mix(P.earth, P.stone, 0.3), shadow: '#0e0f0c', shade: 0.42, inkW: 0.9, cast: false, k: 0.6, tex: 'mottle' + seed, texOp: 0.6 }); f.flat(ell(add(q, [0, -r * 0.4]), r * 0.8, r * 0.2, 0, 5), P.frostS, { op: 0.5 }); } });
  FX.rime([[170, 676], [230, 642], [300, 626], [370, 634], [430, 660]], 7, 1);
  for (const [q, a] of [[[190, 700], -0.3], [[420, 690], 0.4]]) { const pts = [q, add(q, rot([40, -6], a)), add(q, rot([56, 12], a)), add(q, rot([20, 20], a)), add(q, rot([-6, 12], a))]; const lD = f.part(pts, { fill: P.linen, shadow: P.linenD, tex: 'weave' + seed, texOp: 0.6, shade: 0.4, inkW: 1.1, cast: false, maxShade: 4 }); X.stains(f, lD, [q[0] - 20, q[1] - 30, q[0] + 70, q[1] + 30], P.mouldD, 0.08, 3, -1.6, 7, 0.6); } // scraps of grave linen
  for (let i = 0; i < 9; i++) { const q = [R(f, 230, 400), R(f, 700, 760)]; f.part(ell(q, 4.5, 3, R(f, 0, 3), 8), { fill: '#d6d0bc', shadow: '#7a7460', shade: 0.4, inkW: 0.7, cast: false, hatch: false }); } // pale eggs in the loosened earth
  X.mould(f, [150, 740], 18, 10, { rings: 1 }); X.mould(f, [470, 740], 14, 8, { rings: 1 });
  // ---- the hand: grey and frozen, reaching up out of the earth, a ring on one finger, the forearm's sleeve in rags
  f.bone('hand');
  { const W0 = [326, 560], E0 = [300, 700], aH = ang(E0, W0);
    f.part(limb(E0, W0, 36, 30, { steps: 8, p: [[0.3, 0.12, 0.2]], q: [[0.6, 0.08, 0.2]] }), X.SK(f, { fill: mix(P.skin, P.frost, 0.2), maxShade: 6 }));
    X.livid(f, lerp(E0, W0, 0.5), 10, 20, 4); X.veins(f, lerp(E0, W0, 0.4), 8, 14, 2);
    f.part(X.sleeveShape(f, [lerp(E0, W0, -0.1), lerp(E0, W0, 0.4)], [50, 46], { rag: 10, teeth: 6 }), { fill: P.linenD, shadow: '#1e1e18', tex: 'weave' + seed, texOp: 0.6, shade: 0.4, maxShade: 8 }); // a rag of shroud on the forearm
    const hd = X.openHand(f, W0, aH + 0.12, 96, { look: X.SK(f, { fill: mix(P.skin, P.frost, 0.25) }), back: true, flip: true, spread: 0.22, curl: 0.55, curls: [0.7, 0.5, 0.45, 0.6], swell: 0.15, nail: '#4a4a44', tips: '#3e3e3a' });
    { const g = hd.fing[2]; f.part(plate(g.k0, g.k1, 0.32, 0.6, g.W * 1.25, g.W * 1.25), { fill: P.silverD, shadow: '#1e2220', shade: 0.42, inkW: 1.2, cast: false }); f.flat(ell(lerp(g.k0, g.k1, 0.46), g.W * 0.3, g.W * 0.2, aH, 6), P.silverL, { op: 0.7 }); } // the ring
    FX.rime([lp(E0, W0, 0.2, -18), lp(E0, W0, 0.7, -16), add(W0, [-14, -24])], 4, 1); for (const g of hd.fing) FX.icicle(add(g.k3, [0, 2]), 6 + f.r() * 6, 2.4); FX.frost(W0, 16, 12, 6); }

  // ---- one beetle. c: centre of the elytra, a: heading (toward the head), s: body length (px), o.back: frozen on its
  // back with its legs in the air; o.dead (+ o.stalk: a fungal stalk growing out of it), o.old (mould in the joints),
  // o.mite, o.bone: dragging a finger bone in the mandibles.
  const beetle = (c, a, s, o = {}) => {
    const sg = Math.cos(a) < 0 ? -1 : 1, sq = 0.62, F0 = frame(c, a, s), F = pts => F0(pts.map(p => p.length > 2 ? [p[0], p[1] * sg * sq, p[2]] : [p[0], p[1] * sg * sq]));
    const tone = R(f, -0.05, 0.08), shell = mix(CH0, '#3a3c38', Math.max(0, tone));
    // legs: three pairs, splayed; the far side first (behind), each thick at the base and jointed
    const legs = side2 => { for (let i = 0; i < 3; i++) { const hip = [0.12 - i * 0.16, side2 * 0.1], sp = side2 * (o.back ? -1 : 1), la = [-0.9, -0.15, 0.6][i] * 0.7, out = (u, v) => F([[hip[0] + u, hip[1] + v * sp]])[0]; const P2 = o.back ? [out(0, 0), out(-0.02, -0.08), out(0.06 + la * 0.1, -0.36), out(0.1 + la * 0.2, -0.58), out(0.14 + la * 0.2, -0.74)] : [out(0, 0), out(0.02 * (1 - i), 0.16), out(0.1 * (1 - i) + la * 0.2, side2 < 0 ? 0.34 : 0.42), out(0.16 * (1 - i) + la * 0.4, side2 < 0 ? 0.46 : 0.66), out(0.2 * (1 - i) + la * 0.52, side2 < 0 ? 0.52 : 0.84)]; X.insectLeg(f, P2, s * (side2 < 0 ? 0.085 : 0.105), SHELL({ fill: side2 < 0 ? '#0e0e0c' : shell }), { planted: !o.back && side2 > 0, sp: 1.2 }); if (o.old && i === 1) X.mould(f, P2[2], s * 0.06, s * 0.04, { rings: 0, ink: 0 }); } };
    legs(-1);
    if (o.back) { // frozen on its back: the pale underside up, the segmented abdomen, the legs stiff in the air
      const ub = F([[-0.4, -0.04], [-0.3, -0.22], [0.0, -0.26], [0.26, -0.2], [0.36, -0.06], [0.36, 0.06], [0.26, 0.2], [0.0, 0.26], [-0.3, 0.22], [-0.4, 0.04]]);
      f.part(ub, SHELL({ fill: '#3a3832', light: '#8a8676' }));
      for (let i = 0; i < 5; i++) f.line(F([[-0.32 + i * 0.12, -0.2], [-0.3 + i * 0.12, 0.2]]), 1, '#0a0a08', { op: 0.7 });
      FX.rime(F([[-0.4, -0.2], [0.0, -0.3], [0.3, -0.22]]), 4, sg); FX.frost(c, s * 0.3, s * 0.12, 6);
      legs(1); return;
    }
    // the abdomen tip showing past the short elytra, banded
    f.part(F([[-0.56, 0.0], [-0.5, -0.14], [-0.36, -0.2], [-0.36, 0.2], [-0.5, 0.14]]), SHELL({ fill: '#2a2a26' }));
    for (let i = 0; i < 2; i++) f.line(F([[-0.46 + i * 0.06, -0.15], [-0.47 + i * 0.06, 0.15]]), 1, BAND, { op: 0.5 });
    // the elytra: two wing cases, a seam down the middle, the two bone-white bands across, a gloss on the lit shoulder
    const ely = F([[-0.38, -0.26], [-0.04, -0.3], [0.16, -0.26], [0.2, 0.0], [0.16, 0.26], [-0.04, 0.3], [-0.38, 0.26], [-0.42, 0.0]]);
    const eD = f.part(ely, SHELL({ fill: shell, maxShade: 4, inkW: 1.4, inkHeavy: 2 }));
    X.clipDraw(f, eD, () => { for (const [u0, u1] of [[0.06, 0.13], [-0.22, -0.13]]) f.flat(F([[u0, -0.34], [u1, -0.34], [u1 + 0.02, -0.12], [u1 - 0.02, 0.0], [u1 + 0.03, 0.14], [u1, 0.34], [u0, 0.34], [u0 - 0.02, 0.12], [u0 + 0.02, 0.0]]), BAND, { op: 0.92 }); f.flat(F([[0.02, -0.22], [0.14, -0.2], [0.12, -0.12], [0.0, -0.14]]), '#9aa09a', { op: 0.5 }); });
    f.line(F([[-0.4, 0.0], [0.2, 0.0]]), 1.3, '#050505', { op: 0.9 });
    // the pronotum: a broad shield, raised edges, a gloss
    const pro = F([[0.16, -0.26], [0.34, -0.24], [0.42, -0.1], [0.43, 0.1], [0.34, 0.24], [0.16, 0.26], [0.2, 0.0]]);
    f.part(pro, SHELL({ fill: shell, maxShade: 3, inkW: 1.3 })); f.flat(F([[0.26, -0.16], [0.36, -0.12], [0.34, -0.04], [0.26, -0.06]]), '#a0a6a0', { op: 0.45 });
    // the head: mandibles, the clubbed antennae reaching forward toward the company
    f.part(F([[0.42, -0.12], [0.54, -0.1], [0.58, 0.0], [0.54, 0.1], [0.42, 0.12]]), SHELL({ fill: shell }));
    for (const sd of [-1, 1]) { f.part(F([[0.55, sd * 0.06], [0.68, sd * 0.08], [0.72, sd * 0.02], [0.62, sd * 0.02]]), SHELL({ fill: '#2a1e18', inkW: 0.8 })); const a0 = F([[0.52, sd * 0.1]])[0], a1 = F([[0.74, sd * 0.22]])[0], a2 = F([[0.9, sd * 0.2]])[0]; f.line([a0, a1, a2], Math.max(1, s * 0.022), '#0a0a08'); f.part(ell(a2, s * 0.05, s * 0.035, a, 8), SHELL({ fill: mix(BAND, '#6a5a40', 0.3), light: '#e8e2cc', inkW: 0.8 })); for (let k = 0; k < 3; k++) f.line([add(a2, rot([s * (k * 0.025 - 0.025), -s * 0.035], a)), add(a2, rot([s * (k * 0.025 - 0.025), s * 0.035], a))], 0.7, '#3a2e20', { op: 0.7 }); }
    legs(1);
    // the marks: rime on the back; mould in the older ones' joints; a pale fungal stalk out of a dead one; a mite
    FX.rime(F([[-0.36, -0.28], [-0.04, -0.32], [0.16, -0.28], [0.34, -0.26]]), Math.max(2.5, s * 0.05), sg);
    if (o.old) { X.mould(f, F([[0.17, 0.2]])[0], s * 0.07, s * 0.05, { rings: 0 }); X.fungalFur(f, F([[0.14, -0.26], [0.18, 0.0], [0.14, 0.26]]), s * 0.05, 1, { gaps: 0.3 }); }
    if (o.stalk) { const b0 = F([[-0.1, 0.0]])[0], b1 = add(b0, [R(f, -6, 6), -s * 1.1]); f.part(limb(b0, b1, s * 0.07, s * 0.04, { steps: 6, p: [[0.6, 0.2, 0.2]] }), { fill: '#d4cfba', shadow: '#7a7462', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); f.part(ell(b1, s * 0.09, s * 0.06, 0, 8), { fill: '#b8b29a', shadow: '#5e584a', shade: 0.4, inkW: 0.9, cast: false }); X.mould(f, b0, s * 0.12, s * 0.08, { rings: 1 }); }
    if (o.mite) for (let k = 0; k < 3; k++) { const q = F([[R(f, -0.3, 0.3), R(f, -0.2, 0.2)]])[0]; f.part(ell(q, 2.8, 2.2, 0, 8), { fill: '#6a5a44', shade: 0.3, inkW: 0.6, cast: false, hatch: false }); for (const d of [-1, 1]) f.line([q, add(q, [d * 3.6, 1.4])], 0.6, '#1a1410'); }
    if (o.bone) { const b0 = F([[0.66, 0.0]])[0], b1 = add(b0, rot([-s * 0.8, s * 0.3], a)); f.part(limb(b0, b1, 8, 9, { steps: 4, capK: 1.2 }), { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 1, cast: false, tex: 'mottle' + seed, texOp: 0.4 }); for (const q of [b0, b1]) f.part(ell(q, 6, 5, 0, 8), { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 0.9, cast: false }); }
  };
  const BTL = [
    [[176, 704], deg(-12), 70, {}], [[248, 664], deg(-30), 75, { old: true }], [[404, 664], deg(18), 73, { mite: true }], [[450, 722], deg(8), 68, {}],
    [[214, 748], deg(4), 65, { bone: true }], [[352, 702], deg(-6), 78, { old: true }], [[286, 736], deg(20), 63, { back: true }], [[132, 760], deg(-4), 61, {}],
    [[500, 766], deg(14), 63, { dead: true, stalk: true }], [[388, 754], deg(-20), 70, { mite: true }], [[300, 612], deg(-50), 61, {}], [[372, 600], deg(40), 56, {}],
  ];
  BTL.forEach(([c, a, sz, o], i) => { f.joint('beetle_' + (i + 1), c, 'mound'); f.bone('beetle_' + (i + 1)); beetle(c, a, sz, o); });
  f.bone('mound');
  for (let i = 0; i < 6; i++) { const q = [R(f, 120, 520), gy - R(f, 6, 40)]; f.flat(ell(q, R(f, 2, 4), R(f, 1.5, 3), 0, 6), P.earth, { op: 0.9 }); } // earth flicked up by the digging
  f.flat(ell([310, gy + 2], 240, 6, 0, 16), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE RAT KING (ruler 3)
// The barrow rats froze together at the tails: one monstrous knot of rats, a heaving mound three men high and wider than
// it is tall, its weight sagging across the floor; it rolls forward as the rats at its front claw at the ground.
// Rebuilt on the coordinator's review (the first build read as a gravel heap): about a hundred rats, each large and
// modelled (X.bigRat: the haunch and shoulder masses, a pointed head with a thin ear, whiskers, a small dark eye, the
// incisors), each its own build and pose: straining outward, clawing, biting a neighbour, or dead and limp. Their heads
// thrust outward all round, so the mound's outline is lumpy and broken by heads, legs, tails and bones, with rats
// spilling and scrabbling at its foot. The focal point sits at the centre-front: the knot itself, a great braided fist of
// frozen tails, black with tar and filth, wound with grave rags and bound with bones, every tail in view running into it.
// Value models the mass: the top lit, the underside dark, crosshatched shadow in the gaps between the bodies.
// Canvas: true size wins (guide 2): 2200 x 2000 at the same pixel scale (ground = 1970); the mound stands about 3 men
// high with its broken crest in frame.
// Frost: rime on the outer and dead rats, icicles from the mound's lower edge. Toxin: buboes and sores on the living, fur
// rotted off in patches, mould fur and fruiting bodies on the dead. Grave goods dragged into it.
// Rig: floor (root) > mound > crest, mass_front > front_1..4, core (the knot). Motion: idle a constant seethe (mound, crest
// and mass_front breathe a few degrees, the front rats claw); attack the mound surging forward to bury the front rank.
function ratKing() {
  const CW = 2200, CH = 2000, seed = 920;
  const f = new Fig(X.base(seed, CH, { grimeY: 1600 }));
  X.texturesB(f); const FX = X.fx(f);
  const gy = f.o.groundY;
  const MC = [1100, 1240], K0 = [1060, 1500];                  // the mound's centre; the knot at the centre-front
  // the mound: a lumpy dome, wider than tall, sagging onto the floor; topY(x) gives its rough crest
  const topY = x => { const t = (x - 1100) / 1000; return gy - 1700 * Math.pow(Math.max(0, 1 - t * t), 0.38) - 60 * Math.sin(x / 140 + 0.5) - 30 * Math.sin(x / 47 + 1); };
  const dome = []; for (let x = 160; x <= 2040; x += 40) dome.push([x, Math.min(gy, topY(x) + 90)]); dome.push([2040, gy + 4], [160, gy + 4]);
  const inDome = q => q[0] > 110 && q[0] < 2090 && q[1] > topY(q[0]) - 10 && q[1] < gy - 40;
  const region = q => (q[1] < 700 ? 'crest' : (q[0] > 1300 && q[1] > 1100 ? 'mass_front' : 'mound'));
  f.joint('floor', [1100, gy]).joint('mound', [1100, 1700], 'floor').joint('crest', [1000, 800], 'mound').joint('mass_front', [1600, 1700], 'mound').joint('core', K0, 'mound');
  let curB = null; const setB = n => { if (n !== curB) { f.bone(n); curB = n; } };
  const tailCol = mix(P.skin, P.bone, 0.25);

  // ================= the dark mass between the bodies: crosshatched shadow, frozen fur, the plaited tails running in
  setB('mound');
  const back = dome.map(q => [1100 + (q[0] - 1100) * 0.88, gy + (q[1] - gy) * 0.96]); // nearly the full dome: the crest rats lie on the mass, not on air
  const mD = f.part(back, { fill: '#22221e', shadow: '#0c0c0a', shade: 0.42, tex: 'fur' + seed, texOp: 0.7, inkW: 0, inkHeavy: 0, maxShade: 160, cast: true });
  X.clipDraw(f, mD, () => { f.raw(`<path d="${E.smooth(back)}" fill="url(#xhatch${seed})" opacity="0.7"/>`); f.raw(`<path d="${E.smooth(back)}" fill="url(#hatch${seed})" opacity="0.5"/>`); X.stains(f, mD, [100, 0, 2100, gy], P.mouldD, 0.01, 3, -1.6, 3, 0.5, 3); });

  // ================= the rats: a jittered set of places over the dome, the back (upper) ones first. Each faces outward
  // from the knot and mound; the outer ring is pushed out so the heads break the outline.
  const pts = []; let tries = 0;
  while (pts.length < 150 && tries < 9000) { tries++; const q = [R(f, 120, 2080), R(f, 140, gy - 60)]; if (!inDome(q)) continue; if (E.len(sub(q, K0)) < 420) continue; if (pts.some(p2 => E.len(sub(p2, q)) < 126)) continue; pts.push(q); }
  for (let i = 0; i < 600 && pts.length < 172; i++) { const q = [f.r() < 0.5 ? R(f, 170, 560) : R(f, 1640, 2030), R(f, 1300, gy - 80)]; if (!inDome(q) || pts.some(p2 => E.len(sub(p2, q)) < 112)) continue; pts.push(q); } // the low flanks, spilling onto the floor
  // push the outer ones outward so their heads stand beyond the crest
  const placed = pts.map(q => { if (q[1] - topY(q[0]) < 90) q = [q[0], topY(q[0]) + 90]; const edge = q[1] - topY(q[0]) < 200; const d = E.norm(sub(q, MC)); return edge ? add(q, [d[0] * 60, d[1] * 24]) : q; });
  placed.sort((p0, p1) => p0[1] - p1[1]);
  const poses = ['strain', 'claw', 'bite', 'limp'];
  const tails = [];
  for (const q of placed) {
    setB(region(q));
    const out = ang(q[1] > 1300 ? K0 : MC, q), lowSide = q[1] > 1550;
    const k = f.r(), pose = lowSide ? (k < 0.6 ? 'claw' : 'strain') : (k < 0.32 ? 'strain' : k < 0.62 ? 'claw' : k < 0.86 ? 'bite' : 'limp');
    const a = pose === 'limp' ? Math.PI / 2 + R(f, 0.35, 0.8) * (q[0] > 1100 ? -1 : 1) : out + R(f, -0.4, 0.4);
    const sz = R(f, 250, 320) * (q[1] > 1300 ? 1.1 : 1) * (q[1] < 600 ? 0.92 : 1);
    // its tail first, running in toward the knot under the rats in front of it
    const sg = Math.cos(a) < 0 ? -1 : 1, root = add(q, rot([-0.51 * sz, 0.04 * sz * sg], a)), to = lerp(root, K0, R(f, 0.14, 0.26)), tn = E.norm(sub(to, root)), bend = R(f, 30, 70) * (f.r() < 0.5 ? -1 : 1);
    X.ratTail(f, [root, add(lerp(root, to, 0.45), [-tn[1] * bend, tn[0] * bend]), to], sz * 0.045, { col: mix(tailCol, '#000', R(f, 0.1, 0.3)), rime: pose === 'limp', inkW: 1.2, inkH: 1.6 });
    X.bigRat(f, FX, q, a, sz, { pose, tone: Math.max(0, Math.min(1, 1.05 - (q[1] - 150) / 1700 + R(f, -0.2, 0.2))), fleas: q[0] > 1300 && q[1] > 1300 ? 10 : 0 });
    tails.push(root);
  }

  // ================= the light on the mass: the crest lit, the underside dark, the far flank in shadow
  setB('mound');
  X.clipDraw(f, E.smooth(back), () => X.softTone(f, E.smooth(back), [[[[0, 1650], [2200, 1650], [2200, 2000], [0, 2000]], '#000', 0.42, 60], [[[0, 300], [380, 300], [300, 1900], [0, 1900]], '#000', 0.3, 80]]));

  // ================= grave goods dragged into it, gnawed bones jutting out like spines
  setB('crest');
  for (const [x, l, w, aa] of [[330, 170, 24, -2.5], [900, 200, 26, -1.8], [1560, 180, 24, -1.1], [1900, 160, 22, -0.6]]) { const b0 = [x, topY(x) + 120], b1 = add(b0, rot([l, 0], aa)); f.part(limb(b0, b1, w, w * 0.8, { steps: 6, capK: 1.2, p: [[0.2, 0.15, 0.2]] }), { fill: P.bone, shadow: P.boneS, shade: 0.42, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.8 }); f.part(ell(b1, w * 0.85, w * 0.65, aa, 10), { fill: P.bone, shadow: P.boneS, shade: 0.42, inkW: 1.6, cast: false }); for (let k = 0; k < 4; k++) f.line([lp(b0, b1, 0.3 + k * 0.12, -w * 0.4), lp(b0, b1, 0.33 + k * 0.12, -w * 0.1)], 1.6, INK, { op: 0.7 }); FX.rime([lp(b0, b1, 0.2, w * 0.5), lp(b0, b1, 0.9, w * 0.5)], 5, 1); }
  setB('mound');
  const SIL = { fill: P.silver, shadow: P.silverD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.8, maxShade: 24 };
  { const q = [560, 1300]; f.part([add(q, [-50, -70]), add(q, [50, -70]), add(q, [36, -24]), add(q, [10, 0]), add(q, [12, 60]), add(q, [40, 72]), add(q, [-40, 72]), add(q, [-12, 60]), add(q, [-10, 0]), add(q, [-36, -24])], SIL); f.part(ell(add(q, [0, -70]), 50, 14, 0, 14), Object.assign({}, SIL, { fill: P.silverD })); FX.rime([add(q, [-50, -72]), add(q, [50, -72])], 5, 1); f.flat(ell(add(q, [10, -20]), 14, 20, 0.3, 8), '#1e2220', { op: 0.6 }); } // a tarnished silver goblet
  { const q = [1560, 900], M = frame(q, -0.5, 90); const ms = M([[-0.34, -0.62], [0.0, -0.74], [0.34, -0.6], [0.42, -0.2], [0.38, 0.2], [0.26, 0.52], [0.08, 0.7], [-0.1, 0.7], [-0.28, 0.52], [-0.4, 0.2], [-0.42, -0.2]]); f.part(ms, SIL); for (const s2 of [-1, 1]) f.flat(M([[s2 * 0.3, -0.22], [s2 * 0.08, -0.26], [s2 * 0.06, -0.19], [s2 * 0.28, -0.16]]), '#121412'); f.flat(M([[-0.16, 0.36], [0.16, 0.34], [0.14, 0.39], [-0.14, 0.41]]), '#121412'); X.crease(f, M([[-0.3, -0.5], [0.0, 0.0], [0.3, 0.5]]), 3, { col: '#1a1c1a', lit: P.silverL }); } // a bent burial mask of beaten silver
  for (let i = 0; i < 26; i++) { const q = [R(f, 700, 1500), R(f, 1200, 1800)]; if (E.len(sub(q, K0)) < 260) continue; f.part(ell(q, 12, 5, R(f, -0.6, 0.6), 10), { fill: P.silver, shadow: P.silverD, shade: 0.3, inkW: 1, cast: false }); } // coins frozen into the fur
  { const q = [1300, 1240]; f.part([add(q, [-50, -12]), add(q, [50, -20]), add(q, [52, 4]), add(q, [-50, 12])].map(p2 => [...p2, 1]), { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 1.3, cast: false }); for (let k = 0; k < 10; k++) f.line([add(q, [-44 + k * 10, 8 - k * 0.6]), add(q, [-44 + k * 10, 32 - k * 0.6])], 3.4, P.boneD); } // a bone comb
  { const q = [820, 1760]; f.part([add(q, [-44, -30]), add(q, [12, -38]), add(q, [38, -18]), add(q, [56, 6]), add(q, [50, 20]), add(q, [-38, 20]), add(q, [-50, 0])], { fill: P.leather, shadow: P.leatherD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.6 }); f.flat(ell(add(q, [-16, -22]), 18, 8, 0, 8), '#0e0e0c'); } // a child's shoe
  { const q = [280, 1500]; f.part(X.sleeveShape(f, [q, add(q, [150, 80]), add(q, [240, 180])], [100, 90, 80], { rag: 16 }), { fill: '#5b5f58', shadow: '#262826', tex: 'mail' + seed, texOp: 0.85, shade: 0.42, maxShade: 24 }); f.flat(ell(add(q, [130, 80]), 34, 22, 0.5, 10), mix(P.ironD, P.mouldD, 0.35), { op: 0.5 }); } // a ring-mail sleeve
  { const q = [1880, 1620]; f.part([add(q, [-70, -36]), add(q, [64, -46]), add(q, [70, 34]), add(q, [-66, 46])].map(p2 => [...p2, 1]), { fill: '#6c706c', shadow: '#2c2e2c', shade: 0.42, tex: 'mottle' + seed, texOp: 0.7, inkW: 1.8 }); for (let k = 0; k < 8; k++) f.flat(ell(add(q, [R(f, -50, 50), R(f, -26, 26)]), R(f, 5, 10), R(f, 3, 6), 0, 6), '#2a2c2a', { op: 0.85 }); for (const c2 of [[-58, -30], [54, -40], [60, 28], [-56, 38]]) f.rivet(add(q, c2), 4, '#8a8e8a'); } // a lead coffin plate, its name gnawed off

  // ================= THE KNOT at the centre-front: the frozen tails plaited and knotted into a great fist, black with tar
  // and filth, wound with grave rags and bound with bones; the tails of the rats round it run into it
  setB('core');
  { const KR = 290;
    f.part(ell(K0, KR * 1.15, KR * 0.95, 0.1, 24).map(q => add(q, [R(f, -12, 12), R(f, -12, 12)])), { fill: '#141210', shade: 0.3, inkW: 2.4, inkHeavy: 3.6, cast: true, castOp: 0.6, hatch: false, tex: 'mottle' + seed, texOp: 0.6 }); // the tarred core
    // the plaits: thick tails wound round the core in loops, crossing over and under, each scaly and frozen pale
    for (let k = 0; k < 16; k++) { const a0 = k / 16 * Math.PI * 2 + R(f, -0.3, 0.3), r0 = KR * R(f, 0.3, 1.0), a1 = a0 + R(f, 1.2, 3.0), lp0 = []; for (let t = 0; t <= 10; t++) { const aa = a0 + (a1 - a0) * t / 10, rr = r0 * (0.75 + 0.25 * Math.sin(t * 0.9 + k)); lp0.push(add(K0, [Math.cos(aa) * rr * 1.15, Math.sin(aa) * rr * 0.9])); } X.ratTail(f, lp0, R(f, 24, 34), { col: mix(tailCol, '#fff', R(f, -0.1, 0.1)), rime: f.r() < 0.4, inkW: 1.8, inkH: 2.6 }); }
    // the plaited braid: three thick strands crossing in front, the over-under made by drawing alternate crossings last
    const BR = [add(K0, [-260, -70]), add(K0, [-80, -10]), add(K0, [100, 24]), add(K0, [270, -36])], BC = X.spline(BR, 8);
    for (let st = 0; st < 3; st++) { const path = BC.map((q, i) => { const d = E.norm(sub(BC[Math.min(BC.length - 1, i + 1)], BC[Math.max(0, i - 1)])), n = [-d[1], d[0]]; return add(q, mul(n, Math.sin(i * 0.45 + st * 2.1) * 34)); }); X.ratTail(f, path.filter((_, i) => i % 2 === 0), 30, { col: mix(tailCol, '#000', 0.08 * st), rime: st === 0, inkW: 2, inkH: 2.8 }); }
    // tar run and glossy on the plaits, filth caked in the crossings
    for (let k = 0; k < 46; k++) { const q = add(K0, [R(f, -KR, KR), R(f, -KR * 0.8, KR * 0.8)]), r = R(f, 10, 30); const ba = R(f, 0, 3), blob = ell(q, r * 2.2, r * 0.62, ba, 11).map(p2 => add(p2, [R(f, -r * 0.3, r * 0.3), R(f, -r * 0.3, r * 0.3)])); f.flat(blob, '#0a0908', { op: 0.9 }); f.line([add(q, rot([-r * 1.2, -r * 0.2], ba)), add(q, rot([r * 1.0, -r * 0.3], ba))], Math.max(1.2, r * 0.12), '#7a7c76', { op: 0.6 }); if (f.r() < 0.5) f.stroke([add(q, [0, r * 0.6]), add(q, [R(f, -4, 4), r * 0.6 + R(f, 14, 40)])], r * 0.5, '#0a0908', { op: 0.9 }); }
    X.stains(f, E.smooth(ell(K0, KR * 1.2, KR, 0.1, 20)), [K0[0] - 300, K0[1] - 260, K0[0] + 300, K0[1] + 260], '#2a2418', 0.04, 3, -1.5, 37, 0.55);
    // grave rags wound round it, frozen, stained
    for (const [a0, a1, r0] of [[-2.6, -0.6, 0.85], [0.4, 2.2, 0.7], [-1.2, 0.9, 0.55]]) { const C2 = []; for (let t = 0; t <= 12; t++) { const aa = a0 + (a1 - a0) * t / 12; C2.push(add(K0, [Math.cos(aa) * KR * r0 * 1.15, Math.sin(aa) * KR * r0 * 0.9])); } const rD = f.part(X.ribbon(C2, C2.map((_, i) => 44 - Math.abs(i - 6) * 2)), { fill: mix(P.linen, P.linenD, 0.3), shadow: '#22221c', tex: 'weave' + seed, texOp: 0.6, shade: 0.42, inkW: 1.6, maxShade: 10 }); X.stains(f, rD, [K0[0] - 300, K0[1] - 260, K0[0] + 300, K0[1] + 260], '#1a1610', 0.06, 3, -1.3, 41, 0.6); for (let i = 1; i < C2.length - 1; i += 3) f.line([X.offsetLine(C2, () => 18)[i], X.offsetLine(C2, () => -18)[i + 1]], 1.6, '#16150f', { op: 0.5 }); }
    // bones bound into it: a long bone across the front and a few finger bones under the rags
    { const b0 = add(K0, [-220, 150]), b1 = add(K0, [200, 80]); f.part(limb(b0, b1, 30, 26, { steps: 8, capK: 1.2, p: [[0.5, 0.06, 0.3]] }), { fill: P.bone, shadow: P.boneS, shade: 0.42, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.8 }); for (const q of [b0, b1]) f.part(ell(q, 30, 24, 0.2, 10), { fill: P.bone, shadow: P.boneS, shade: 0.42, inkW: 1.6, cast: false }); for (const t of [0.3, 0.7]) { const q = lerp(b0, b1, t); for (let k = 0; k < 4; k++) f.line([add(q, [-10 + k * 6, -24]), add(q, [-6 + k * 6, 26])], 3.6, '#1c1814'); } }
    for (let k = 0; k < 5; k++) { const q = add(K0, [R(f, -150, 150), R(f, -150, 40)]); f.part(limb(q, add(q, rot([34, 0], R(f, 0, 6))), 10, 9, { steps: 3, capK: 1.2 }), { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 1.1, cast: false }); }
    FX.rime([add(K0, [-240, -120]), add(K0, [-80, -210]), add(K0, [100, -200]), add(K0, [230, -100])], 12, 1); FX.icicles([add(K0, [-180, 160]), add(K0, [160, 170])], 6, 50, 9);
    X.mould(f, add(K0, [-120, -40]), 40, 26, { rings: 2 }); X.mould(f, add(K0, [130, 90]), 34, 22, { rings: 2 }); X.graveCaps(f, add(K0, [40, -200]), deg(-95), 60, 4); }
  // the rats hanging off the knot, rumps to it, heads straining out; their tails run into it over the rags
  const ringR = []; for (let i = 0; i < 9; i++) { const aa = Math.PI * (0.15 + i / 8 * 0.7) + Math.PI, q = add(K0, [Math.cos(aa) * 470, Math.sin(aa) * 390]); ringR.push([q, aa]); }
  for (const [q, aa] of [[add(K0, [-470, 150]), Math.PI * 0.9], [add(K0, [470, 150]), Math.PI * 0.1]]) ringR.push([q, aa]);
  for (const [q, aa] of ringR) { setB(region(q)); const sz = R(f, 260, 320), a = aa + R(f, -0.25, 0.25), sg = Math.cos(a) < 0 ? -1 : 1, root = add(q, rot([-0.51 * sz, 0.02 * sz * sg], a)); X.bigRat(f, FX, q, a, sz, { pose: f.r() < 0.6 ? 'strain' : 'bite', tone: R(f, 0.2, 0.7) }); setB('core'); { const e = lerp(root, K0, 0.62), d0 = E.norm(sub(e, root)), n0 = [-d0[1], d0[0]], bend = R(f, 50, 110) * (f.r() < 0.5 ? -1 : 1); X.ratTail(f, [root, add(lerp(root, e, 0.35), mul(n0, bend)), add(lerp(root, e, 0.75), mul(n0, -bend * 0.6)), e], sz * 0.05, { col: tailCol, inkW: 1.4, inkH: 2 }); } curB = 'core'; }

  // ================= the underside along the floor: dead rats picked to skeletons, icicles from the lower edge
  setB('mass_front');
  for (let i = 0; i < 6; i++) { const q = [R(f, 300, 1900), gy - R(f, 6, 30)]; X.rat(f, FX, q, R(f, -0.4, 0.4) + (f.r() < 0.5 ? Math.PI : 0), R(f, 120, 160), { state: 'bones' }); }
  // ================= the front: the largest rats spilling off the mound and clawing at the floor, fleas in their fur
  const fronts = [[1560, 1820], [700, 1840], [1880, 1800], [420, 1830]];
  fronts.forEach((q, i) => { f.joint('front_' + (i + 1), add(q, [-80, 0]), 'mass_front'); curB = null; setB('front_' + (i + 1)); const a = (q[0] > 1100 ? 0 : Math.PI) + R(f, -0.25, 0.1) * (q[0] > 1100 ? 1 : -1), sz = R(f, 330, 380); X.bigRat(f, FX, q, a, sz, { pose: 'claw', fleas: 40, bubo: i % 2 === 0, ha: R(f, 0.05, 0.3) }); { const sgn = Math.cos(a) < 0 ? -1 : 1; FX.icicles([add(q, rot([-0.4 * sz, 0.2 * sz * sgn], a)), add(q, rot([-0.05 * sz, 0.15 * sz * sgn], a))], 4, 34, 6); } /* frost hanging from the mound's lowest edge */ for (let k = 0; k < 4; k++) f.line([add(q, [R(f, -60, 60), 150 + k * 4]), add(q, [R(f, -20, 80), 150 + k * 3])], 1.6, P.frostS, { op: 0.7 }); });
  curB = null; setB('floor');
  for (let i = 0; i < 16; i++) { const x = R(f, 250, 2000); f.line([[x, gy - 1], [x + R(f, 30, 80), gy - R(f, 0, 3)]], 1.8, P.frostS, { op: 0.6 }); } // claw scratches in the frozen floor
  f.flat(ell([1100, gy + 2], 1050, 14, 0, 24), P.frostD, { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE DEAD-CART (ruler 3.5 to the top of its load)
// The plague cart that went round the barrow collecting its dead, with its carter and the horse that pulled it; it no
// longer waits for them to finish dying. Moving right to left (drawn left to right, flipped): a heavy two-wheeled cart
// drawn by a gaunt draught horse in the shafts, the carter walking at the horse's head with his long hook, and the heap of
// the dead frozen together on the cart, rising out of the frame top. The weight sits on the horse's braced forelegs and the
// cart's wheels.
// Built as a vehicle with real depth: every part of the cart is placed in 3D (x along the cart, h height above the floor,
// z depth away from us) and projected toward a vanishing point at chest height off the right of the frame (the camera
// stands in front of the battle line), so the far wheel, far shaft and the bed's far side recede and shrink; planks have
// thickness, wheels have tyres, felloes, spokes, hubs with iron hoops, an axle and linchpins. The horse follows the Plague
// Wolf's habits: deep chest, tucked belly, jointed legs (elbow, knee, fetlock, pastern; stifle, hock), weight-bearing hooves.
// Canvas: true size wins (guide 2): 2400 x 1800 at the same pixel scale (ground = 1770); the heap is a broad mound (director, review).
// The heap is the creature: forty and more plague dead in grave linen frozen together, rimed on the windward (rear) side
// with icicles from the cart bed (frost), felted through with grey-green mould between the bodies like moss in a dry-stone
// wall, fruiting bodies in the folds (toxin); arms hang over the side and some of them reach; heads loll.
// Rig: floor (root) > cart > wheel_n, wheel_f, heap > arm_1..5; horse: hips (parent cart via the shafts) > barrel > withers
// > neck > head; legs leg_fn/ff/hn/hf_1..3; tail; carter: carter (pelvis) > carter_torso > carter_head, arms, legs, hook.
// Motion: idle the horse stamping while the heap shifts and its arms sway; attack the cart rolling forward a rank as the
// arms of the heap seize a hero and drag them up into it.
function deadCartBody() {
  const CW = 2400, CH = 1800, seed = 921;
  const f = new Fig(X.base(seed, CH, { grimeY: 1500 }));
  X.texturesB(f); const FX = X.fx(f);
  const gy = f.o.groundY;
  const cx = 2600, hy = gy - 480, Dp = 4500;
  const sc = z => Dp / (Dp + z);
  const P3 = (x, h, z = 0) => { const k = sc(z); return [cx + (x - cx) * k, hy + (gy - h - hy) * k]; };
  const OAK = (o = {}) => Object.assign({ fill: mix(P.wood, P.woodL, 0.25), shadow: P.woodD, tex: 'grain' + seed, texOp: 0.7, shade: 0.42, inkW: 1.8, maxShade: 30 }, o);
  const OAKV = (o = {}) => OAK(Object.assign({ tex: 'grainv' + seed }, o));
  const IRN = (o = {}) => Object.assign({ fill: P.iron, shadow: P.ironD, tex: 'mottle' + seed, texOp: 0.7, shade: 0.42, inkW: 1.6, maxShade: 16 }, o);
  const quad = (pts, look) => f.part(pts.map(q => [...q, 1]), look);
  // the cart's dimensions (px at the near plane)
  const X0 = 300, X1 = 1180, Z0 = 70, Z1 = 530, hF = 340, hS = 560, WX = 720, WR = 262, WZn = 0, WZf = 600;
  f.joint('floor', [1200, gy]).joint('cart', P3(WX, WR, 300), 'floor').joint('wheel_n', P3(WX, WR, WZn), 'cart').joint('wheel_f', P3(WX, WR, WZf), 'cart').joint('heap', P3(740, hS, 300), 'cart');

  // ---- a spoked wheel with an iron tyre, in the plane z: the tyre's tread with depth, the felloe, twelve spokes, the hub
  // (nave) with iron hoops standing out toward us, the axle end and linchpin. o.buckle: the rim bent, a spoke broken.
  const wheel = (z, o = {}) => {
    const at = (a, r, dz = 0) => P3(WX + Math.cos(a) * r * (1 + (o.buckle ? 0.06 * Math.sin(a * 2 + 1) : 0)), WR - Math.sin(a) * r * (1 + (o.buckle ? 0.06 * Math.sin(a * 2 + 1) : 0)), z + dz);
    const ring = (r, dz, n = 48) => { const out = []; for (let i = 0; i < n; i++) out.push(at(i / n * Math.PI * 2, r, dz)); return out; };
    const tB = ring(WR, 16), tF = ring(WR, -16), tI = ring(WR - 16, -16), fI = ring(WR - 52, -14), fIB = ring(WR - 52, 14);
    f.part(E.smooth(tB) + ' ' + E.smooth(ring(WR - 16, 16).reverse()), Object.assign(IRN({ fill: P.ironD, cast: false }), { bbPts: tB })); // the tyre's back edge, a ring
    // the tread between the back and front edges: the part of the tyre's outer face we see
    const tread = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; tread.push(at(a, WR, 16)); } for (let i = 48; i >= 0; i--) { const a = i / 48 * Math.PI * 2; tread.push(at(a, WR, -16)); }
    f.part(E.smooth(tF) + ' ' + E.smooth(tB.slice().reverse()), Object.assign(IRN({ maxShade: 10 }), { bbPts: tF })); // the tread between the tyre's two edges
    f.part(E.smooth(tF) + ' ' + E.smooth(fI.slice().reverse()), Object.assign(OAK({ fill: mix(P.wood, P.woodL, 0.15), maxShade: 20 }), { bbPts: tF }));
    f.part(E.smooth(tF) + ' ' + E.smooth(tI.slice().reverse()), Object.assign(IRN({ maxShade: 6, inkW: 1.2 }), { bbPts: tF })); // the iron tyre's face
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; f.line([at(a, WR - 18, -16), at(a, WR - 50, -16)], 2.2, '#141410', { op: 0.7 }); } // the felloe joints
    for (let i = 0; i < 10; i++) f.rivet(at(i / 10 * Math.PI * 2 + 0.1, WR - 8, -16), 3.4, P.ironL);
    // spokes: tapered, each a turned bar from the hub to the felloe, lit on its upper edge
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2 + 0.13, a0 = at(a, 44, -30), a1 = at(a, WR - 50, -14);
      if (o.buckle && i === 4) { const m = lerp(a0, a1, 0.55); f.part(limb(a0, m, 22, 18, { steps: 4, capK: 0.3 }), OAKV({ maxShade: 4 })); f.part(limb(a1, lerp(a1, a0, 0.3), 18, 16, { steps: 3, capK: 0.3 }), OAKV({ maxShade: 4 })); f.line([m, add(m, [6, -4]), add(m, [2, 6])], 1.6, INK); continue; }
      f.part(limb(a0, a1, 24, 16, { steps: 6, p: [[0.25, 0.1, 0.2]] }), OAKV({ maxShade: 5, inkW: 1.4 }));
      f.line([lp(a0, a1, 0.1, 6), lp(a0, a1, 0.9, 4)], 1.4, '#c8c0a8', { op: 0.35 });
    }
    // the nave: a turned hub standing out toward us, two iron hoops, the axle end and the linchpin through it
    const hubR = 58, hb = ring(hubR, -20, 24), hf = ring(hubR * 0.86, -90, 24);
    f.part(hb, OAK({ fill: mix(P.wood, P.woodL, 0.35), maxShade: 14 }));
    const side = []; for (let i = 0; i <= 24; i++) side.push(at(i / 24 * Math.PI * 2, hubR, -20)); for (let i = 24; i >= 0; i--) side.push(at(i / 24 * Math.PI * 2, hubR * 0.86, -90));
    f.part(hf, OAK({ fill: mix(P.wood, P.woodL, 0.3), maxShade: 10 }));
    for (const dz of [-34, -78]) { const r0 = hubR * (1 - (dz + 20) / -70 * 0.14); f.line(ring(r0, dz, 24).concat([ring(r0, dz, 24)[0]]), 7, P.iron); }
    f.part(ring(26, -96, 16), IRN({ fill: P.ironL, maxShade: 6 })); f.flat(ring(10, -100, 10), '#0a0a08');
    const lp0 = at(Math.PI / 2, 22, -100); f.part([add(lp0, [-5, -26]), add(lp0, [5, -26]), add(lp0, [4, 30]), add(lp0, [-4, 30])], IRN({ maxShade: 3, inkW: 1.1 })); // the linchpin
    FX.rime(ring(WR + 2, -16, 48).slice(14, 30).map(q => add(q, [0, -2])), 7, 1); FX.icicles(ring(WR - 52, -14, 48).slice(32, 42), 4, 26, 6);
    X.mould(f, at(2.3, WR - 34, -16), 16, 10, { rings: 1 }); X.mould(f, at(-0.6, 40, -40), 14, 10, { rings: 1 });
  };

  // frozen ruts behind the wheels
  f.bone('floor');
  for (const z of [WZn, WZf]) { const c0 = P3(WX, 0, z), c1 = P3(0, 0, z); f.line([add(c0, [-20, 0]), c1], 10 * sc(z), '#0e0f0c', { op: 0.6 }); f.line([add(c0, [-20, -5 * sc(z)]), add(c1, [0, -5 * sc(z)])], 2, P.frost, { op: 0.6 }); }
  // ================= the far side first: far wheel (buckled), the axle, the far shaft
  f.bone('wheel_f'); wheel(WZf, { buckle: true });
  f.bone('cart');
  { const a0 = P3(WX, WR, WZf - 20), a1 = P3(WX, WR, WZn + 20); f.part(limb(a0, a1, 46 * sc(WZf), 52, { steps: 8 }), OAK({ fill: P.woodD, maxShade: 10 })); FX.icicles([lerp(a0, a1, 0.2), lerp(a0, a1, 0.8)], 3, 30, 6); } // the axle beam
  // the bed's underside frame and the floor's far edge, seen under the bed between the wheels
  quad([P3(X0, hF - 40, Z1), P3(X1, hF - 40, Z1), P3(X1, hF, Z1), P3(X0, hF, Z1)], OAK({ fill: P.woodD, maxShade: 6 }));
  // the shafts: two long ash poles from under the bed forward to the horse's sides, the far one first
  const shaft = z => { const a0 = P3(X1 - 280, hF - 30, z), a1 = P3(X1 + 140, hF + 10, z), a2 = P3(1790, 420, z), a3 = P3(1880, 436, z); const C2 = X.spline([a0, a1, a2, a3], 10), W = 34 * sc(z); const sd = f.part(X.ribbon(C2, C2.map((_, i) => W * (1 - i / C2.length * 0.25))), OAK({ tex: 'grain' + seed, maxShade: 8 })); f.line(X.offsetLine(C2, () => -W * 0.25), 1.6, '#c8c0a8', { op: 0.35 }); for (const t of [0.3, 0.92]) { const q = C2[Math.round(t * (C2.length - 1))]; f.part(ell(q, 8 * sc(z), W * 0.62, 0, 10), IRN({ maxShade: 3, inkW: 1.1 })); } FX.rime(X.offsetLine(C2, () => -W * 0.5).filter((_, i) => i % 3 === 0), 4, 1); return C2; };
  const shF = shaft(440);


  // ================= THE HORSE: a gaunt draught horse between the shafts, starved to the bones, the head hung low by the
  // buboes at its throat; the forelegs braced ahead under the load. Drawn on its own plane (z about 300); the near legs'
  // hooves meet the floor a little lower than the far legs' (the floor recedes).
  const HG = (o = {}) => Object.assign({ fill: '#7a7c72', shadow: '#2a2b26', tex: 'fur' + seed, texOp: 0.55, shade: 0.42, maxShade: 40, inkHeavy: 2.6 }, o);
  const groove = (pts, w = 3, op = 0.55) => f.stroke(pts, w, '#141412', { op });
  const gN = gy - 8, gF = gy - 26;
  const LEG = {
    fn: { H: [1830, 1350], K: [1806, 1458], A: [1858, 1596], F: [1888, 1704], T: [1906, gN] },
    ff: { H: [1846, 1338], K: [1826, 1444], A: [1880, 1580], F: [1912, 1688], T: [1932, gF] },
    hn: { H: [1404, 1300], K: [1440, 1446], A: [1356, 1588], F: [1378, 1704], T: [1394, gN] },
    hf: { H: [1424, 1290], K: [1462, 1432], A: [1384, 1572], F: [1406, 1688], T: [1420, gF] },
  };
  f.joint('hips', [1400, 1260], 'cart').joint('barrel', [1600, 1260], 'hips').joint('withers', [1760, 1260], 'barrel').joint('neck', [1860, 1260], 'withers').joint('head', [2020, 1340], 'neck').joint('tail', [1320, 1210], 'hips');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.K, k[0] === 'f' ? 'withers' : 'hips').joint(`leg_${k}_2`, L.A, `leg_${k}_1`).joint(`leg_${k}_3`, L.F, `leg_${k}_2`);
  // one leg (Plague Wolf habit): muscled forearm or gaskin overlapping a lean cannon, the knee or hock as a bony knob, the
  // fetlock joint, the sloped pastern, the hoof planted with its shoe and frog; feathering at the fetlock frozen in icicles
  const hleg = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', look = HG(far ? { fill: '#55574f', maxShade: 20 } : { maxShade: 24 }), gyL = L.T[1];
    const hf = [L.T[0] - 4, gyL - 54], dKA = E.norm(sub(L.A, L.K)), dAF = E.norm(sub(L.F, L.A)), dFH = E.norm(sub(hf, L.F));
    // one outline from the forearm (or gaskin) to the hoof: a muscled top tapering hard into the knee (or hock), the lean
    // flat cannon of bone and tendon, the fetlock's knuckle, the sloped pastern; cut over the three bones with round overlaps
    const pts = [add(L.K, mul(dKA, -16)), lerp(L.K, L.A, 0.45), L.A, lerp(L.A, L.F, 0.5), L.F, hf];
    const ws = front ? [104, 80, 60, 46, 60, 50] : [120, 86, 66, 46, 60, 50];
    const outl = K.chain(pts, ws, { steps: 8, bp: front ? [[0, 0.4, 0.16, 0.3]] : [[0, 0.3, 0.2, 0.3]], bq: front ? [[0, 0.3, 0.1, 0.3], [3, 0.6, 0.1, 0.25]] : [[0, 0.4, 0.12, 0.3], [3, 0.6, 0.1, 0.25]] });
    split(f, () => {
      const d = f.part(outl, look);
      X.stains(f, d, [L.K[0] - 90, L.K[1] - 30, L.K[0] + 120, gyL], '#0b0b08', 0.05, 3, -1.6, 7 + Math.round(L.K[0]), 0.45);
      X.clipDraw(f, d, () => {
        X.softTone(f, d, [[[lp(L.K, L.A, 0, -60), lp(L.K, L.A, 1, -40), lp(L.A, L.F, 1, -30), lp(L.A, L.F, 1, -6), lp(L.K, L.A, 0, -14)], '#000', 0.35, 10], [[lp(L.K, L.A, 0.05, 24), lp(L.K, L.A, 0.6, 18), lp(L.K, L.A, 0.6, 40), lp(L.K, L.A, 0.05, 50)], '#ffffff', 0.14, 8]]);
        groove([lp(L.K, L.A, 0.15, front ? -12 : 14), lp(L.K, L.A, 0.85, front ? -6 : 8)], 2.4, 0.5); // the muscle's division
        f.line([lp(L.A, L.F, 0.12, front ? 14 : -14), lp(L.A, L.F, 0.88, front ? 12 : -12)], 2.2, '#141210', { op: 0.55 }); // the tendon behind the cannon
        f.line([lp(L.A, L.F, 0.1, front ? -12 : 12), lp(L.A, L.F, 0.9, front ? -12 : 12)], 1.8, '#d0d2c6', { op: 0.35 }); // the shin bone's lit front
        f.flat(ell(lp(L.A, L.F, 0.02, front ? -14 : 0), 18, 12, ang(L.A, L.F), 8), '#d0d2c6', { op: 0.18 }); // the flat front of the knee
        X.crease(f, [lp(L.F, hf, -0.3, -20), lp(L.F, hf, 0.0, -24), lp(L.F, hf, 0.25, -18)], 2, { col: '#141210', lit: '#c8cabe', op: 0.5 }); // the fetlock's fold
        X.livid(f, lerp(L.K, L.A, 0.5), 20, 40, 3, 1.4);
      });
    }, [[`leg_${k}_1`, side(L.A, mul(dKA, -1), 34)], [`leg_${k}_2`, [side(L.A, dKA, 34), side(L.F, mul(dAF, -1), 32)]], [`leg_${k}_3`, side(L.F, dAF, 32)]]);
    if (front) { f.bone(`leg_${k}_1`); f.part([lp(L.K, L.A, -0.06, 30), lp(L.K, L.A, -0.1, 52), lp(L.K, L.A, 0.12, 54), lp(L.K, L.A, 0.2, 34)], HG({ fill: mix(look.fill, '#000', 0.1), inkW: 1.1, cast: false, maxShade: 4 })); } // the point of the elbow
    else { f.bone(`leg_${k}_2`); const nA = [-dAF[1], dAF[0]]; f.part([add(L.A, mul(nA, 22)), add(add(L.A, mul(nA, 48)), mul(dAF, -22)), add(add(L.A, mul(nA, 44)), mul(dAF, 6)), add(L.A, add(mul(nA, 20), mul(dAF, 26)))], HG({ fill: mix(look.fill, '#fff', 0.05), inkW: 1.2, cast: false, maxShade: 4 })); } // the point of the hock, angular
    f.bone(`leg_${k}_3`);
    const T = L.T;
    f.part([[T[0] - 42, gyL - 60], [T[0] + 28, gyL - 62], [T[0] + 62, gyL - 2, 1], [T[0] - 50, gyL - 2, 1]], { fill: '#3a3832', shadow: '#121210', shade: 0.42, tex: 'grainv' + seed, texOp: 0.5, inkW: 1.6, cast: true, maxShade: 10 });
    f.part([[T[0] - 52, gyL - 9], [T[0] + 62, gyL - 9], [T[0] + 64, gyL + 1], [T[0] - 52, gyL + 1]].map(q => [...q, 1]), IRN({ maxShade: 2, inkW: 1.1, cast: false }));
    for (let i = 0; i < 3; i++) f.rivet([T[0] - 30 + i * 36, gyL - 5], 2.4, P.ironL);
    for (let i = 0; i < 4; i++) f.line([[T[0] - 30 + i * 22, gyL - 56], [T[0] - 24 + i * 24, gyL - 12]], 1, '#141210', { op: 0.4 });
    X.shag(f, [[L.F[0] - 30, L.F[1] + 6], [L.F[0] - 14, L.F[1] + 26], [L.F[0] + 18, L.F[1] + 34]], 46, { pal: ['#4a4b44', '#6a6c62', '#8a8c80'], n: 2, ice: true });
    FX.icicles([[T[0] - 40, gyL - 44], [T[0] + 10, gyL - 44]], 3, 18, 4); FX.frost([T[0] + 6, gyL - 4], 56, 4, 6);
  };
  hleg('hf', true); hleg('ff', true);
  // the tail: hanging stiff, mould in it, frozen into clumps with icicles
  f.bone('tail');
  { const t0 = [1322, 1206]; for (let i = 0; i < 7; i++) { const x0 = t0[0] - 10 + i * 5, l = 260 + (i % 3) * 40; X.hairClump(f, [[x0, t0[1]], [x0 - 18 - i * 2, t0[1] + l * 0.4], [x0 - 14 - i * 3, t0[1] + l * 0.75], [x0 - 22 - i * 2, t0[1] + l]], 20 - i, { pal: ['#3e3f38', '#5e5f56', '#7a7c70', mix(P.mould, '#000', 0.1)], n: 3 }); if (i % 2 === 0) FX.icicle([x0 - 22 - i * 2, t0[1] + l - 2], 22, 5); } X.mould(f, [t0[0] - 20, t0[1] + 120], 18, 26, { rings: 1 }); }
  // the body: deep starved barrel, the ribs standing, the hip bones up like a rack, the spine a ridge, the flank sunk
  const hBody = [[1286, 1300], [1296, 1236], [1330, 1200], [1388, 1172], [1432, 1194], [1520, 1212], [1600, 1218], [1690, 1196], [1760, 1166], [1826, 1196], [1882, 1258], [1904, 1340], [1884, 1420], [1846, 1470], [1780, 1488], [1690, 1486], [1600, 1470], [1520, 1440], [1470, 1426], [1450, 1456], [1400, 1468], [1346, 1446], [1312, 1384]];
  const bodyCut = [['hips', side([1500, 1300], [-1, 0], 0)], ['barrel', [side([1500, 1300], [1, 0], 60), side([1700, 1300], [-1, 0], 0)]], ['withers', side([1700, 1300], [1, 0], 60)]];
  split(f, () => {
    const d = f.part(hBody, HG({ maxShade: 60 }));
    X.stains(f, d, [1280, 1160, 1900, 1480], '#0b0b08', 0.03, 3, -1.6, 5, 0.55); X.stains(f, d, [1280, 1160, 1900, 1480], P.mouldD, 0.05, 3.2, -2.2, 7, 0.5);
    X.clipDraw(f, d, () => {
      X.softTone(f, d, [[[[1460, 1380], [1840, 1400], [1850, 1480], [1460, 1480]], '#000', 0.45, 18], [[[1300, 1200], [1440, 1190], [1440, 1300], [1300, 1300]], '#ffffff', 0.12, 16], [[[1440, 1300], [1520, 1290], [1520, 1390], [1450, 1390]], '#000', 0.4, 14]]);
      for (let i = 0; i < 8; i++) { const x = 1540 + i * 30; groove([[x, 1236 + i * 2], [x + 8, 1320], [x - 4, 1420 - i * 2]], 3.2, 0.5); f.line([[x + 12, 1244], [x + 18, 1320], [x + 8, 1410]], 2, '#c8cabe', { op: 0.3 }); } // the ribs standing under the hide
      groove([[1388, 1190], [1430, 1240], [1450, 1300]], 3, 0.5); f.flat(ell([1412, 1214], 30, 22, 0.3, 10), '#c8cabe', { op: 0.2 }); // the hip bone up like a rack
      f.line([[1400, 1190], [1520, 1216], [1600, 1224], [1700, 1200], [1760, 1176]], 3, '#c8cabe', { op: 0.3 }); // the spine's ridge
      groove([[1770, 1210], [1806, 1290], [1830, 1360]], 3, 0.5); // the shoulder blade's spine
      groove([[1310, 1300], [1340, 1380], [1380, 1440]], 2.6, 0.45); // the back of the thigh
      X.livid(f, [1600, 1330], 120, 60, 10, 2); for (const q of [[1560, 1300], [1700, 1360]]) X.sore(f, q, 7);
      for (const q of [[1480, 1260], [1650, 1260]]) { X.mould(f, q, 26, 16, { rings: 1 }); }
    });
    FX.rime([[1300, 1240], [1388, 1172], [1520, 1210], [1690, 1196], [1760, 1168]], 9, 1);
    FX.frost([1560, 1240], 160, 20, 20);
  }, bodyCut);
  // the cart saddle and backband over the back, the belly band, the breeching round the buttocks, the crupper to the tail
  f.bone('barrel');
  { const sd = [[1640, 1196], [1730, 1182], [1744, 1214], [1730, 1240], [1650, 1250], [1630, 1226]]; f.part(sd, { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, inkW: 1.6, maxShade: 10 }); f.part([[1668, 1180], [1706, 1176], [1708, 1196], [1670, 1200]], IRN({ maxShade: 3 })); for (const q of [[1650, 1214], [1726, 1206]]) f.rivet(q, 4, P.ironL);
    f.stroke([[1690, 1236], [1694, 1330], [1690, 1452]], 18, P.leatherD); // the belly band
    f.part([[1666, 1286], [1718, 1284], [1718, 1336], [1666, 1338]], { fill: P.leather, shade: 0.4, inkW: 1.3, cast: false }); // the tug where the shaft rides
    f.stroke([[1640, 1214], [1500, 1210], [1380, 1196], [1330, 1214], [1316, 1240]], 9, P.leatherD); // the crupper
    f.stroke([[1300, 1270], [1340, 1320], [1450, 1338], [1560, 1330]], 16, P.leatherD); f.line([[1300, 1262], [1340, 1312], [1450, 1330]], 2, P.leatherL, { op: 0.4 }); // the breeching
    FX.rime([[1640, 1194], [1730, 1180]], 4, 1); }
  // the neck: long, the crest gone thin, hanging forward and down, the throat swollen with buboes; the mane in frozen clumps
  f.bone('neck');
  const neck = [[1736, 1170], [1800, 1158], [1890, 1194], [1970, 1248], [2036, 1306], [2060, 1378], [2034, 1450], [1994, 1500], [1932, 1484], [1884, 1436], [1862, 1374], [1820, 1318]];
  const nD = f.part(neck, HG({ maxShade: 40 }));
  X.clipDraw(f, nD, () => { X.softTone(f, nD, [[[[1860, 1380], [2040, 1380], [2040, 1460], [1860, 1460]], '#000', 0.4, 14]]); groove([[1840, 1220], [1920, 1280], [1990, 1350]], 2.6, 0.45); X.stains(f, nD, [1730, 1160, 2050, 1460], '#0b0b08', 0.04, 3, -1.6, 9, 0.5); });
  for (const [q, r] of [[[1970, 1480], 40], [[1922, 1456], 28], [[2008, 1466], 26]]) X.bubo(f, q, r, { sag: 0.6, mixSkin: 0.5 }); // the buboes swelling the throat
  // the collar: a thick padded ring round the neck at the shoulders, the hames along its front, trace hooks
  { const cc = [1870, 1300], C2 = []; for (let i = 0; i <= 28; i++) { const a = -2.0 + i / 28 * 3.2; C2.push(add(cc, [Math.cos(a) * 46, Math.sin(a) * 128])); }
    const cr = X.ribbon(C2, C2.map((_, i) => 56 - Math.abs(i - 14) * 0.8)); const cD = f.part(cr, { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, inkW: 1.8, maxShade: 20 }); X.stains(f, cD, [1790, 1150, 1960, 1450], P.mouldD, 0.06, 3, -1.8, 11, 0.5);
    f.line(X.offsetLine(C2, () => -10), 2, P.leatherL, { op: 0.4 }); f.stitches(X.offsetLine(C2, () => 16), '#8a8676', 1);
    const hm = C2.slice(4, 26).map(q => add(q, [26, 0])); f.line(hm, 12, P.iron); f.line(hm.map(q => add(q, [-3, -3])), 2, P.ironL, { op: 0.6 }); // the hames
    f.part(ell(add(hm[0], [4, -14]), 10, 16, 0.3, 10), IRN({ fill: P.ironL, maxShade: 3, inkW: 1.1 })); f.rivet(hm[11], 6, P.ironL); f.line(ell(hm[12], 10, 10, 0, 10).concat([ell(hm[12], 10, 10, 0, 10)[0]]), 4, P.iron); // the hame tip, the trace hook
    FX.rime(C2.slice(0, 10).map(q => add(q, [0, -20])), 6, 1); FX.icicles(C2.slice(18, 28).map(q => add(q, [0, 20])), 3, 20, 5);
    X.ironChain(f, [hm[12], [1760, 1340], [1640, 1350], [1520, 1352]], 26, 6, P.iron); } // the trace chain back along its side to the shaft
  // the mane: frozen clumps along the crest, hanging down the near side, mould grown in it
  X.shag(f, [[1760, 1176], [1840, 1196], [1920, 1236], [2000, 1286], [2030, 1314]], 70, { pal: ['#2e2f2a', '#4a4b44', '#62645a', mix(P.mould, '#000', 0.15), P.mouldD], n: 3, sway: 8, ice: true }); for (const t of [0.2, 0.5, 0.8]) X.mould(f, lerp([1780, 1210], [2010, 1330], t), 14, 20, { rings: 0, ink: 0 }); // the mane hanging plumb off the crest, frozen in strands, mould grown through it
  // the head: long and bowed, hanging low, in its bridle and blinkers; the bit fixed in frozen lips
  f.bone('head');
  const i0h = f.out.length;
  { const hd = [[2020, 1316], [2052, 1330], [2084, 1400], [2104, 1470], [2120, 1530], [2124, 1570], [2104, 1592], [2070, 1590], [2052, 1560], [2036, 1510], [2000, 1470], [1978, 1430], [1990, 1360]];
    const hD = f.part(hd, HG({ fill: '#80827a', maxShade: 24 }));
    X.clipDraw(f, hD, () => { X.softTone(f, hD, [[[[1970, 1400], [2030, 1410], [2040, 1520], [1990, 1500]], '#000', 0.4, 12], [[[2060, 1360], [2100, 1400], [2110, 1470], [2080, 1440]], '#ffffff', 0.15, 10]]); groove([[2050, 1340], [2066, 1400]], 2.6, 0.5); f.flat(ell([2030, 1380], 20, 14, 1.2, 8), '#141412', { op: 0.35 }); X.livid(f, [2060, 1450], 30, 50, 4, 1.4); }); // the hollow above the eye, the cheekbone's ridge
    f.part([[1990, 1350], [2024, 1440], [2010, 1478], [1980, 1450], [1974, 1400]], HG({ fill: '#6e7068', maxShade: 8, cast: false })); // the round jowl
    // ears: long, laid back and drooping
    f.part([[2014, 1324], [1990, 1300], [1966, 1290], [1980, 1306], [2024, 1330]], HG({ maxShade: 4 })); f.part([[2030, 1320], [2030, 1292], [2040, 1278], [2046, 1296], [2044, 1324]], HG({ fill: '#5e6058', maxShade: 4 })); // ears, small, drooping sideways
    // the muzzle: the nostril, the lips drawn back frozen round the bit, frost on the whiskers
    f.flat(ell([2108, 1560], 9, 6, 1.1, 8), '#141412'); f.part([[2056, 1566], [2096, 1584], [2104, 1596], [2070, 1600], [2050, 1584]], X.SK(f, { fill: mix(P.skin, P.bruise, 0.25), inkW: 1.2, cast: false, maxShade: 3 }));
    for (let i = 0; i < 3; i++) f.flat([[2062 + i * 10, 1580], [2070 + i * 10, 1580], [2068 + i * 10, 1592]], P.bone);
    FX.frost([2100, 1580], 20, 10, 8); FX.icicles([[2070, 1598], [2104, 1596]], 3, 18, 4);
    // bridle: headstall, browband, cheek strap, noseband, the bit ring at the mouth's corner, the blinker square on its strap
    const BR = P.leatherD; f.stroke([[2016, 1318], [2034, 1328], [2054, 1334]], 10, BR); f.stroke([[2040, 1330], [2046, 1420], [2058, 1540]], 9, BR); f.stroke([[2048, 1504], [2088, 1500], [2116, 1494]], 9, BR); f.stroke([[2026, 1336], [2066, 1340], [2084, 1352]], 8, BR);
    f.line(ell([2060, 1552], 13, 13, 0, 12).concat([ell([2060, 1552], 13, 13, 0, 12)[0]]), 5, P.iron); f.rivet([2060, 1552], 3, P.ironL);
    const bl = [[2028, 1366], [2088, 1372], [2094, 1426], [2032, 1430]]; f.part(bl.map(q => [...q, 1]), { fill: P.leather, shadow: P.leatherD, tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, inkW: 1.6, cast: true, maxShade: 6 }); for (const q of [[2036, 1372], [2084, 1376], [2086, 1420], [2038, 1424]]) f.rivet(q, 3, P.ironL); FX.rime([bl[0], bl[1]], 4, 1);
    X.animalEye(f, [2080, 1440], 5, 1.0, { film: true, frost: true }); // the eye just showing under the blinker
    // the forelock, frozen, mould in it
    X.hairClump(f, [[2030, 1326], [2048, 1356], [2056, 1384]], 14, { pal: ['#3e3f38', mix(P.mould, '#000', 0.1)], n: 2 }); }
  { const poll = [2020, 1316], k = 1.34, body = f.out.splice(i0h).join('\n'); f.raw(`<g transform="translate(${poll[0]},${poll[1]}) scale(${k}) translate(${-poll[0]},${-poll[1]})">${body}</g>`); }
  // near legs, in front of the body
  hleg('hn', false); hleg('fn', false);
  f.bone('leg_fn_1'); X.mould(f, lp(LEG.fn.K, LEG.fn.A, 0.4, 10), 10, 14, { rings: 1 });
  f.bone('hips'); X.softTone(f, E.smooth([[1300, 1180], [1520, 1180], [1520, 1480], [1300, 1480]]), [[[[1330, 1230], [1440, 1226], [1460, 1300], [1360, 1310]], '#ffffff', 0.12, 12]]);
  { const hp = [[1316, 1250], [1404, 1232], [1450, 1300], [1460, 1430], [1420, 1458], [1356, 1440], [1320, 1370]]; f.part(hp, HG({ maxShade: 30, cast: false, inkW: 0, inkHeavy: 0, opacity: 0.6 })); groove([[1330, 1280], [1400, 1300], [1440, 1420]], 2.6, 0.45); X.sore(f, [1380, 1350], 7); X.mould(f, [1360, 1300], 16, 12, { rings: 1 }); } // the near thigh over the hip

  // ================= THE HEAP (rebuilt on independent review): a low, broad mound of the dead, every body lying with its
  // weight on the bodies under it, composed by hand from the bed up. Each body has a pose that shows its weight: one lies
  // along the bed with its head hanging over the tail-board; one is jackknifed over another with its head down the rear
  // slope; one is draped belly-down over the crest, its arms hanging plumb down the front and its legs down the back; one
  // lies on its back head-first down the slope; legs hang over the tail-board; heads loll toward the floor. Bodies further
  // down are drawn first, so each upper body overlaps and rests on the ones below. Between them, in the dark mass, more of
  // the dead: a face, a hand, a foot. The bible's forty dead read as the mass; the dozen in front carry the anatomy.
  f.bone('heap');
  const plumb = Math.PI / 2, AL = angLerp;
  const MO = [[330, 1225], [372, 1080], [434, 955], [515, 838], [612, 732], [720, 660], [800, 648], [880, 684], [962, 760], [1042, 866], [1112, 990], [1170, 1115], [1200, 1225]].map(([x, y], i) => [Math.min(1214, 760 + (x - 760) * 1.14), 1211 - (1211 - y) * 1.32 + (i > 0 && i < 12 ? (i % 2 ? -26 : 22) : 0)]); // the pile's outline, lumped by the bodies in it: a broad mound, wider than it is tall, spilling past the tail-board
  const mound = MO.map(q => add(q, [0, 36])).concat([P3(X1 + 20, hS - 20, Z0), P3(X0 - 20, hS - 20, Z0)]);
  const mdD = f.part(mound, { fill: '#25231e', shadow: '#0c0b09', shade: 0.42, tex: 'weave' + seed, texOp: 0.4, inkW: 0, inkHeavy: 0, maxShade: 80 });
  X.clipDraw(f, mdD, () => f.raw(`<path d="${E.smooth(mound)}" fill="url(#xhatch${seed})" opacity="0.7"/>`));
  const hcid = f.id('hc'); f.defs.push(`<clipPath id="${hcid}"><path d="${E.smooth(mound)}"/></clipPath>`); // the bodies' shadows fall only on the pile
  // the outline by arc length: a body is laid along it, its pelvis just inside, its spine following the surface downhill,
  // its thighs and shins following it the other way; past the bed's ends a limb or a head hangs plumb
  const OC = X.spline(MO, 6), OL = [0]; for (let i = 1; i < OC.length; i++) OL.push(OL[i - 1] + E.len(sub(OC[i], OC[i - 1])));
  const LT = OL[OL.length - 1], onO = (c, inset) => { c = Math.max(0, Math.min(LT, c)); let i = OL.findIndex(v => v >= c); i = Math.max(1, i); const t = (c - OL[i - 1]) / (OL[i] - OL[i - 1] || 1), q = lerp(OC[i - 1], OC[i], t), d = E.norm(sub(OC[i], OC[i - 1])); return add(q, mul([-d[1], d[0]], inset)); };
  const lay = (cF, dirH, inset, o = {}) => { // cF: pelvis position as a fraction of the outline; dirH -1: head toward the rear end, +1 toward the front
    const s = o.s || 600, c = cF * LT, pel = onO(c, inset), hd = onO(c + dirH * 0.4 * s, inset), past = c + dirH * 0.4 * s < 0 || c + dirH * 0.4 * s > LT;
    const a = Math.atan2(hd[1] - pel[1], hd[0] - pel[0]), hA = past ? AL(a, plumb, 0.85) : AL(a, plumb, o.loll ?? 0.45) + R(f, -0.15, 0.15);
    const leg = (spread, ins) => { const cK = c - dirH * 0.25 * s, cA = c - dirH * 0.48 * s, K2 = cK < 0 || cK > LT ? add(pel, rot([0.25 * s, 0], AL(a + Math.PI, plumb, 0.5))) : onO(cK, inset + ins), ta = Math.atan2(K2[1] - pel[1], K2[0] - pel[0]) + spread; const Kp = add(pel, rot([0.25 * s, 0], ta)); const A2 = cA < 0 || cA > LT ? add(Kp, [0, 0.235 * s]) : onO(cA, inset + ins * 0.6); return { ta, sa: Math.atan2(A2[1] - Kp[1], A2[0] - Kp[0]) + R(f, -0.1, 0.1) }; };
    const arm = (hang) => { if (hang) { const ua = plumb + R(f, -0.18, 0.18); return { ua, fa: AL(ua, plumb, 0.6) + R(f, -0.1, 0.1), wa: plumb + R(f, -0.1, 0.1) }; } const S = onO(c + dirH * 0.3 * s, inset), Dn = onO(c + dirH * 0.6 * s, inset + 30), ua = Math.atan2(Dn[1] - S[1], Dn[0] - S[0]) + R(f, -0.25, 0.25); return { ua, fa: AL(ua, plumb, 0.35), wa: AL(ua, plumb, 0.6) }; };
    return Object.assign({ pel, a, s, bend: 0, hA, depth: Math.max(0, Math.min(0.85, (inset - 40) / 420)), arms: [arm(o.hang ?? false), arm(false)], legs: [leg(0, 34), leg(R(f, 0.08, 0.22) * (f.r() < 0.5 ? -1 : 1), 50)], feet: f.r() < 0.4 ? 'shoe' : 'bare' }, o);
  };
  const T = (pel, a, o) => Object.assign({ pel, a, s: 600, bend: 0, feet: 'bare' }, o);
  const DK = mix(P.woolD, '#000', 0.25), RW = mix(P.leather, P.woolD, 0.45), LN = mix(P.linen, P.linenD, 0.45), LT2 = mix(P.leather, P.leatherL, 0.4), MW = mix(P.wool, P.mould, 0.25);
  const heap = [
    // the bed: a body along it, head hanging over the tail-board, arms hanging plumb
    T([560, 1185], Math.PI - 0.22, { hA: AL(Math.PI - 0.22, plumb, 0.8), arms: [{ ua: plumb + 0.12, fa: plumb, wa: plumb + 0.1 }, { ua: plumb - 0.1, fa: plumb + 0.05, wa: plumb }], legs: [{ ta: -0.22, sa: 0.5 }, { ta: -0.12, sa: 0.75 }], dress: 'tunic', col: DK, hose: P.wool, feet: 'shoe', depth: 0.1 }),
    // legs over the tail-board: a body face-down along the bed, its thighs over the end and its shins hanging plumb
    T([430, 1160], -0.28, { hA: AL(-0.28, plumb, 0.35), arms: [{ ua: 0.9, fa: 1.3, wa: 1.5 }, { ua: 0.6, fa: 1.1, wa: 1.4 }], legs: [{ ta: Math.PI + 0.25, sa: plumb + 0.08 }, { ta: Math.PI + 0.4, sa: plumb - 0.1 }], dress: 'shift', col: mix(LN, '#000', 0.15), bald: true, depth: 0.15 }),
    // the front of the bed: face down, the head lolling over the front board
    T([915, 1190], 0.12, { hA: AL(0.12, plumb, 0.6), arms: [{ ua: plumb + 0.25, fa: plumb + 0.1, wa: plumb }, { ua: 1.0, fa: 1.4, wa: 1.5 }], legs: [{ ta: Math.PI + 0.25, sa: Math.PI + 0.9 }, { ta: Math.PI + 0.1, sa: Math.PI + 0.6 }], dress: 'tunic', col: RW, hose: P.woolD, depth: 0.12 }),
    // the deep layers, filling the pile from the bed up (mostly covered; their heads, hands and folds show between the others)
    T([700, 1060], Math.PI + 0.06, { hA: AL(Math.PI + 0.06, plumb, 0.3), arms: [{ ua: plumb + 0.6, fa: Math.PI - 0.2, wa: plumb + 0.8 }, { ua: plumb - 0.3, fa: 0.4, wa: 0.9 }], legs: [{ ta: 0.06, sa: 0.5 }, { ta: 0.2, sa: 0.7 }], dress: 'tunic', col: mix(P.woolD, P.wool, 0.4), hose: DK, depth: 0.6 }),
    T([900, 1020], 0.08, { hA: AL(0.08, plumb, 0.4), arms: [{ ua: 1.2, fa: 1.5, wa: 1.6 }, { ua: 0.8, fa: 1.2, wa: 1.4 }], legs: [{ ta: Math.PI + 0.2, sa: Math.PI + 0.5 }, { ta: Math.PI + 0.05, sa: Math.PI + 0.3 }], dress: 'shift', col: mix(LN, '#000', 0.2), depth: 0.6 }),
    lay(0.5, 1, 430, { dress: 'tunic', col: mix(P.woolD, P.wool, 0.3), hose: P.woolD, hang: false }),
    lay(0.36, -1, 340, { dress: 'shift', col: mix(LN, '#000', 0.25), hang: false }),
    lay(0.68, 1, 330, { dress: 'tunic', col: LT2, hose: P.wool, hang: false }),
    lay(0.5, -1, 320, { dress: 'shroud', col: mix(P.linen, P.linenD, 0.45) }),
    lay(0.42, -1, 235, { dress: 'tunic', col: RW, hose: P.woolD, hang: false }),
    lay(0.62, 1, 240, { dress: 'tunic', col: DK, hose: P.wool, hang: false }),
    // a wrapped body in the pile
    lay(0.56, 1, 170, { dress: 'shroud', col: mix(P.linen, P.linenD, 0.35) }),
    // the inner layer: bodies lying deeper in the pile, partly covered by the outer ones
    lay(0.3, -1, 120, { dress: 'tunic', col: LT2, hose: DK, hang: false }),
    lay(0.74, -1, 110, { dress: 'tunic', col: MW, hose: P.woolD }),
    // the outer layer, lying along the mound's surface with their weight on the bodies below
    'rope',
    lay(0.16, -1, 48, { dress: 'shift', col: mix(P.linen, '#000', 0.12), bald: true, loll: 0.7, hang: true }),   // head over the tail end
    lay(0.86, -1, 48, { dress: 'tunic', col: RW, hose: P.wool, loll: 0.35 }),                            // head up the slope, sliding feet-first over the front board                                       // head-first down the front, face to the pile
    lay(0.36, -1, 44, { dress: 'tunic', col: DK, hose: P.wool, loll: 0.55, hang: false }),                          // on its back down the rear slope
    lay(0.66, -1, 44, { dress: 'shift', col: LN, loll: 0.4 }),                                                     // face-down on the front slope
    lay(0.5, 1, 40, { dress: 'tunic', col: MW, hose: DK, loll: 0.75, hang: true }),                                // draped over the crest, belly-down
  ];
  // sacks thrown on with the dead, one split at the seam
  const sack = (q, aa, split) => { const F2 = frame(q, aa, 1), sk = F2([[-90, -40], [-20, -58], [70, -50], [100, -6], [92, 40], [10, 52], [-80, 46], [-104, 8]]); const sD = f.part(sk, { fill: mix(P.linenD, P.wood, 0.3), shadow: '#14130f', tex: 'weave' + seed, texOp: 0.8, shade: 0.42, maxShade: 26, inkW: 1.8 }); X.stains(f, sD, [q[0] - 120, q[1] - 90, q[0] + 120, q[1] + 90], '#100e0a', 0.05, 3, -1.4, 61 + (split ? 1 : 0), 0.6); f.line(F2([[-104, 8], [-120, -16], [-112, 28]]), 4, P.linenD); for (let i = 0; i < 3; i++) f.stroke(F2([[-60 + i * 50, -50], [-50 + i * 48, 0], [-60 + i * 50, 46]]), 4, '#0e0d0a', { op: 0.5 }); if (split) { f.flat(F2([[40, -24], [80, -16], [70, 0]]), '#0c0b09'); { const q0 = F2([[62, 6]])[0]; for (let i = 0; i < 9; i++) f.flat(ell(add(q0, [R(f, -10, 10) * (1 + i * 0.1), i * 7 + R(f, -2, 2)]), R(f, 2, 3.4), R(f, 1.6, 2.6), R(f, 0, 3), 6), mix('#c8c2a8', '#5c5b52', R(f, 0, 0.5)), { op: 0.75 }); } } FX.rime(F2([[-90, -42], [-20, -60], [70, -52]]), 6, 1); };
  heap.forEach((b, i) => { if (b === 'rope') { X.rope(f, [P3(X0 + 60, hS + 20, Z0), ...[0.12, 0.3, 0.46, 0.6, 0.76, 0.9].map(t => onO(t * LT, 30)), P3(X1 - 40, hS + 20, Z0)], 8, mix(P.linenD, P.wood, 0.45), { lit: false }); return; } X.deadBody(f, FX, Object.assign({ clip: hcid }, b)); if (i === 12) sack(onO(0.8 * LT, 120), 0.7, false); if (i === 13) sack(onO(0.24 * LT, 110), -0.8, true); }); // the rope thrown over the pile lies under the outer dead, frozen in
  // the child's bundle laid on the top of the heap
  X.deadBody(f, FX, lay(0.43, -1, 26, { s: 330, dress: 'shroud', col: mix(P.linenL, P.linen, 0.4), clip: hcid }));
  // frozen together: rime along the windward (rear) side of the pile, the rope thrown over it and frozen in
  FX.rime(MO.slice(1, 5).map(q => add(q, [16, 22])), 7, 1, { wind: [-1, 0] });

  // the random stream after the heap replayed as reviewed, so the cart, lantern, side arms and carter stay as they were
  f.r = E.rng(seed); for (let i = 0; i < 11510; i++) f.r();
  // ================= the bed's near side: the floor's edge, the side boards with stakes and iron straps, chalked tallies
  f.bone('cart');
  quad([P3(X1, hF - 40, Z0), P3(X1, hF - 40, Z1), P3(X1, hS + 20, Z1), P3(X1, hS + 20, Z0)], OAKV({ fill: mix(P.wood, P.woodL, 0.1), maxShade: 20 })); // the front board's outer face, seen past the side
  for (let i = 1; i < 3; i++) f.line([P3(X1, hF - 40 + i * 80, Z0), P3(X1, hF - 40 + i * 80, Z1)], 2.6, '#0e0d0a', { op: 0.7 });
  quad([P3(X0 - 20, hF - 48, Z0), P3(X1 + 20, hF - 48, Z0), P3(X1 + 20, hF, Z0), P3(X0 - 20, hF, Z0)], OAK({ fill: P.woodD, maxShade: 10 })); // the floor's thick near edge
  FX.icicles([P3(X0, hF - 48, Z0), P3(X1, hF - 48, Z0)], 18, 70, 10);
  const sideB = [P3(X0, hF, Z0), P3(X1, hF, Z0), P3(X1, hS, Z0), P3(X0, hS, Z0)];
  const sbD = quad(sideB, OAK());
  X.stains(f, sbD, [X0 - 20, 1150, X1 + 20, 1460], P.mouldD, 0.025, 3, -1.6, 13, 0.6); X.stains(f, sbD, [X0 - 20, 1150, X1 + 20, 1460], '#0b0b08', 0.04, 3, -1.5, 15, 0.5);
  X.clipDraw(f, sbD, () => { for (const hh of [hF + 74, hF + 148]) { f.line([P3(X0, hh, Z0), P3(X1, hh, Z0)], 4, '#0c0b09', { op: 0.85 }); f.line([P3(X0, hh - 4, Z0), P3(X1, hh - 4, Z0)], 1.4, P.woodL, { op: 0.45 }); } }); // the plank seams
  // chalked tallies of the dead along the rear end of the side board, more than the board will hold
  for (let r = 0; r < 3; r++) X.tally(f, P3(X0 + 20, hS - 30 - r * 72, Z0), 23 - r * 4, 26, 0.02, '#d8dcd2');
  // the stakes: posts up the side, standing above it, iron straps, frost
  for (const x of [X0 + 6, 520, 760, 980, X1 - 6]) { const a = P3(x, hF - 50, Z0 - 8), b = P3(x, hS + 70, Z0 - 8); f.part(limb(a, b, 30, 26, { steps: 6, capK: 0.4 }), OAKV({ maxShade: 8 })); for (const hh of [hF + 30, hS - 30]) { const q = P3(x, hh, Z0 - 10); f.part([add(q, [-20, -8]), add(q, [20, -8]), add(q, [20, 8]), add(q, [-20, 8])].map(p => [...p, 1]), IRN({ maxShade: 2, inkW: 1.1, cast: false })); f.rivet(q, 3, P.ironL); } FX.rime([add(b, [-14, 2]), add(b, [14, 0])], 5, 1); FX.icicle(add(P3(x, hF - 50, Z0 - 8), [0, 2]), 30, 7); }
  // the shovel lashed to the side, the slit sack of lime spilling white down it
  { const s0 = P3(560, hF + 20, Z0 - 14), s1 = P3(940, hS - 20, Z0 - 14); f.part(limb(s0, s1, 16, 14, { steps: 6 }), OAKV({ maxShade: 4 })); const bl0 = s1, bd = E.norm(sub(s1, s0)), bn = [-bd[1], bd[0]]; f.part([add(bl0, mul(bn, -30)), add(bl0, mul(bn, 30)), add(add(bl0, mul(bn, 34)), mul(bd, 90)), add(add(bl0, mul(bd, 110)), [0, 0]), add(add(bl0, mul(bn, -34)), mul(bd, 90))], IRN({ fill: P.ironL, maxShade: 6 })); f.flat(ell(add(bl0, mul(bd, 60)), 14, 8, 0, 8), mix(P.ironD, P.mouldD, 0.35), { op: 0.6 }); for (const t of [0.25, 0.7]) { const q = lerp(s0, s1, t); for (let k = 0; k < 3; k++) f.line([add(q, [-14 + k * 4, -16]), add(q, [-10 + k * 4, 18])], 3, P.linenD); } }
  { const q = P3(1090, hS - 10, Z0 - 14); f.line([P3(1080, hS + 20, Z0), q], 2.4, P.linenD); const sk = [add(q, [-40, -10]), add(q, [30, -16]), add(q, [44, 40]), add(q, [30, 90]), add(q, [-24, 96]), add(q, [-46, 50])]; const skD = f.part(sk, { fill: P.linenD, shadow: '#1e1e18', tex: 'weave' + seed, texOp: 0.7, shade: 0.42, maxShade: 14 }); X.stains(f, skD, [q[0] - 50, q[1] - 20, q[0] + 50, q[1] + 100], '#0b0b08', 0.06, 3, -1.5, 17, 0.5); f.line([add(q, [10, 60]), add(q, [30, 70])], 3, '#0e0e0c'); for (let k = 0; k < 6; k++) { const x0 = q[0] + 14 + k * 8 + R(f, -3, 3); f.stroke([[x0, q[1] + 66], [x0 + R(f, -4, 4), q[1] + 160], [x0 + R(f, -6, 6), q[1] + 240 + k * 20]], 6 - k * 0.5, '#e4e6de', { op: 0.75 }); } }
  // the tail-chain dragging on the floor behind the cart
  X.ironChain(f, [P3(X0 + 20, hF - 48, Z0 + 60), [250, 1520], [160, gy - 6], [40, gy - 4]], 26, 6, P.iron);
  // the unlit lantern on its pole at the front corner
  { const pl0 = P3(X1 - 6, hF, Z0 - 10), pl1 = add(P3(X1 - 6, 1200, Z0 - 10), [30, 0]); f.part(limb(pl0, pl1, 18, 14, { steps: 8 }), OAKV({ maxShade: 4 })); const hk = add(pl1, [60, 10]); f.line([pl1, add(pl1, [40, -10]), hk], 6, P.iron); const lc = add(hk, [0, 90]); f.line([hk, add(lc, [0, -60])], 3, P.iron); f.part([add(lc, [-34, -50]), add(lc, [34, -50]), add(lc, [38, 40]), add(lc, [-38, 40])].map(q => [...q, 1]), { fill: '#3a3c38', shadow: '#121210', shade: 0.42, inkW: 1.8, tex: 'mottle' + seed, texOp: 0.6, maxShade: 10 }); f.part([add(lc, [-24, -36]), add(lc, [24, -36]), add(lc, [26, 30]), add(lc, [-26, 30])].map(q => [...q, 1]), { fill: '#5e625e', shade: 0.3, inkW: 1, cast: false, opacity: 0.8 }); for (const x of [-10, 10]) f.line([add(lc, [x, -36]), add(lc, [x, 30])], 3, '#2a2c28'); f.part([add(lc, [-6, -6]), add(lc, [6, -6]), add(lc, [6, 20]), add(lc, [-6, 20])], { fill: P.bone, shade: 0.3, inkW: 0.9, cast: false }); f.part([add(lc, [-40, -50]), add(lc, [0, -84]), add(lc, [40, -50])], { fill: '#3a3c38', shade: 0.42, inkW: 1.6, cast: false }); FX.rime([add(lc, [-40, -52]), add(lc, [0, -86]), add(lc, [40, -52])], 5, 1); FX.icicles([add(lc, [-38, 40]), add(lc, [38, 40])], 3, 22, 5); }

  // ================= arms of the heap hanging over the side, some reaching; heads lolling over the edge
  for (let i = 0; i < 3; i++) {
    f.joint('arm_' + (i + 1), P3(420 + i * 300, hS + 20, Z0), 'heap'); f.bone('arm_' + (i + 1));
    const S2 = P3(420 + i * 300 + R(f, -20, 20), hS + 30, Z0 - 10), reach = i === 1;
    // an arm of the heap hanging over the side board (the middle one reaching out); the torn sleeve over the shoulder
    const ua = reach ? plumb - 0.35 : plumb + R(f, -0.15, 0.15), fa = reach ? 0.25 : AL(ua, plumb, 0.6), wa = reach ? 0.0 : plumb;
    X.deadArm(f, FX, S2, ua, fa, wa, 600, { skin: mix(P.skin, P.frost, 0.12), flip: i % 2 === 1, rime: true });
    f.part(X.sleeveShape(f, [add(S2, [0, -46]), add(S2, [0, -8]), add(S2, rot([26, 0], ua))], [66, 60, 52], { rag: 10, teeth: 5 }), { fill: mix(P.woolD, P.linenD, 0.3 + i * 0.2), shadow: '#161612', tex: 'weave' + seed, texOp: 0.55, shade: 0.42, maxShade: 10 }); // the torn sleeve at the shoulder, over the board's edge
  }

  // ================= the near wheel, in front of the bed, and the near shaft over the horse's side
  f.bone('wheel_n'); wheel(WZn);
  f.bone('cart');
  const shN = shaft(170);
  { const q = shN[Math.round(shN.length * 0.72)]; f.line([q, add(q, [0, 40])], 2.6, P.leatherD); const rc = add(q, [0, 76]); f.part([add(rc, [-12, -34]), add(rc, [12, -34]), add(rc, [16, 30]), add(rc, [-16, 30])], OAKV({ maxShade: 3 })); f.part(ell(add(rc, [0, -40]), 20, 10, 0, 10), OAK({ maxShade: 3, cast: false })); for (let k = 0; k < 4; k++) f.line([add(rc, [-12, -24 + k * 14]), add(rc, [12, -22 + k * 14])], 1.4, INK, { op: 0.7 }); f.part(limb(add(rc, [0, 30]), add(rc, [0, 70]), 10, 9, { steps: 3 }), OAKV({ maxShade: 2, cast: false })); } // the wooden rattle hung on the shaft
  f.flat(ell([1200, gy + 4], 1100, 16, 0, 24), P.frostD, { op: 0.4 });

  // ================= THE CARTER at the horse's head: a long waxed leather coat stiff with frost, gauntlets, a vinegar rag
  // over the mouth, the long hooked pole planted ahead in the near hand, the far hand back on the horse's bridle
  { const dy = gy - 790, xc = 2250, H = 100, J = (x, y) => [x, y + dy];
    const SKd = (o = {}) => X.SK(f, o);
    const COAT = (o = {}) => Object.assign({ fill: mix(P.leather, P.leatherL, 0.55), shadow: '#14130e', tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, maxShade: 40 }, o);
    const N = J(xc + 24, 300), C = J(xc + 6, 390), Pv = J(xc, 478), S = B.spine(N, C, Pv, H);
    const SN = S.at(-0.3, 0.14), SF = S.at(0.36, 0.1);
    const plB = J(2392, 788), plT = J(2366, 70), plA = ang(plB, plT);
    const WN = lerp(plB, plT, 0.5), EN = X.ik(SN, WN, 122, 108, 1)[0];
    const WF = [2080, 1630], EF = X.ik(SF, WF, 122, 108, 1)[0];
    const HF = J(xc + 16, 470), AF = J(xc + 96, 744), KF = X.ik(HF, AF, 150, 132, -1)[0];
    const HN = J(xc - 18, 476), AN = J(xc - 66, 748), KN = X.ik(HN, AN, 150, 132, 1)[0];
    const neck0 = S.at(0.14, -0.04), HC = J(xc + 50, 254), hA = 0.12;
    f.joint('carter', Pv, 'floor').joint('carter_torso', S.at(0, 0.86), 'carter').joint('carter_head', neck0, 'carter_torso');
    f.joint('upperarm_cn', SN, 'carter_torso').joint('forearm_cn', EN, 'upperarm_cn').joint('hand_cn', WN, 'forearm_cn').joint('carter_hook', WN, 'hand_cn');
    f.joint('upperarm_cf', SF, 'carter_torso').joint('forearm_cf', EF, 'upperarm_cf').joint('hand_cf', WF, 'forearm_cf');
    f.joint('thigh_cn', HN, 'carter').joint('shin_cn', KN, 'thigh_cn').joint('foot_cn', AN, 'shin_cn').joint('thigh_cf', HF, 'carter').joint('shin_cf', KF, 'thigh_cf').joint('foot_cf', AF, 'shin_cf');
    // far arm reaching back to the bit ring, the gauntlet closed on the cheek strap
    X.arm(f, SF, EF, WF, '_cf', { ws: [44, 36, 30], skin: SKd(), sleeve: { look: COAT({ fill: mix(P.leather, P.leatherL, 0.35) }), to: 1.9, slack: 1.3, rag: 6, roll: true } });
    f.bone('hand_cf'); X.grip(f, WF, EF, ang(EF, WF) - Math.PI / 2, 26, mix(P.leather, P.leatherL, 0.4), 'carter bridle', { nail: '#2a2820' });
    // legs: leather boots under the coat
    X.leg(f, FX, HF, KF, AF, '_cf', { ws: [60, 44, 34], look: COAT({ fill: P.woolD, tex: 'weave' + seed }), foot: 'boot', fs: 48, shoe: P.leatherD, dirt: 0.4 });
    X.leg(f, FX, HN, KN, AN, '_cn', { ws: [62, 46, 34], look: COAT({ fill: P.wool, tex: 'weave' + seed }), foot: 'boot', fs: 48, shoe: P.leatherD, dirt: 0.4 });
    // the long coat: waxed leather to the calf, stiff with frost, flaring; the skirt splits over the stride
    f.bone('carter_torso');
    const coat = [S.at(-0.5, -0.06), S.at(0.5, -0.04), S.at(0.64, 0.3), S.at(0.7, 0.7), J(xc + 120, 620), J(xc + 136, 690), [...J(xc + 120, 706), 1], J(xc + 90, 694), [...J(xc + 60, 712), 1], J(xc + 20, 690), [...J(xc - 20, 708), 1], J(xc - 60, 692), [...J(xc - 96, 702), 1], J(xc - 110, 640), J(xc - 90, 540), S.at(-0.66, 0.4)];
    const cD = f.part(coat, COAT());
    X.stains(f, cD, [xc - 130, 270 + dy, xc + 150, 720 + dy], P.mouldD, 0.04, 3, -1.8, 23, 0.55); X.stains(f, cD, [xc - 130, 560 + dy, xc + 150, 720 + dy], '#0b0b08', 0.04, 3, -1.4, 25, 0.5);
    X.clipDraw(f, cD, () => {
      X.softTone(f, cD, [[[J(xc - 120, 300), J(xc - 40, 300), J(xc - 40, 720), J(xc - 120, 720)], '#000', 0.4, 14], [[J(xc + 40, 330), J(xc + 120, 360), J(xc + 120, 470), J(xc + 50, 470)], '#ffffff', 0.12, 12]]);
      // folds: drag folds falling from the belt to the stiff hem, splitting and curving over the stride; tension folds pulled
      // across the chest toward the far arm reaching back to the bridle; a crease field at the elbow side
      const fold = (pts, w, op = 0.55) => { f.stroke(pts, w, '#0c0b08', { op }); f.line(pts.slice(0, -1).map(q => add(q, [-2.5, -1.5])), Math.max(1, w * 0.3), '#8a8470', { op: 0.35 }); };
      for (const [x0, x1, x2, w] of [[-78, -84, -92, 5], [-44, -50, -40, 6], [-14, -6, -22, 4.5], [18, 26, 12, 6], [50, 62, 74, 5], [84, 100, 116, 4.5], [104, 122, 132, 3.5]]) fold([J(xc + x0, 482), J(xc + x1 * 0.9 + x0 * 0.1, 590), J(xc + x2, 700)], w);
      for (const [x0, x1] of [[-30, 10], [-4, 24], [-50, 0]]) fold([J(xc + x0, 452), J(xc + (x0 + x1) / 2 - 6, 470), J(xc + x1, 484)], 3.5, 0.45); // the cloth bunched over the belt
      for (let k = 0; k < 4; k++) fold([J(xc - 40 + k * 18, 330 + k * 8), J(xc + 10 + k * 16, 360 + k * 10), J(xc + 70 + k * 10, 372 + k * 12)], 3.2, 0.42); // pulled toward the far arm
      // wear: the waxed leather cracked into a crazing on the chest and the skirt, edges and seams scuffed bright
      for (let k = 0; k < 30; k++) { const q = J(xc + R(f, -90, 110), R(f, 320, 690)); f.line([q, add(q, [R(f, -9, 9), R(f, 3, 10)]), add(q, [R(f, -12, 12), R(f, 8, 16)])], 1, '#100f0b', { op: 0.5 }); }
      for (let k = 0; k < 16; k++) { const q = J(xc + R(f, -100, 120), R(f, 320, 700)); f.line([q, add(q, [R(f, 6, 16), R(f, -3, 3)])], 1.6, '#9a937c', { op: 0.4 }); }
      f.line([J(xc + 28, 310), J(xc + 32, 480), J(xc + 26, 700)], 2.4, '#100f0c', { op: 0.65 }); f.line([J(xc + 25, 310), J(xc + 29, 480), J(xc + 23, 700)], 1.2, '#9a937c', { op: 0.45 }); // the front edge, its lap worn pale
      // stains: lime splashed white from the cart, black grave-earth to the knee, a frozen dark tide where the dead were carried
      for (let k = 0; k < 12; k++) { const q = J(xc + R(f, -100, 120), R(f, 560, 700)), r = R(f, 2, 7); f.flat(ell(q, r * 1.6, r, R(f, 0, 3), 7).map(p2 => add(p2, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), '#d8dad0', { op: 0.6 }); if (k % 3 === 0) f.stroke([q, add(q, [R(f, -2, 2), R(f, 8, 20)])], r * 0.8, '#d8dad0', { op: 0.5 }); }
      X.stains(f, cD, [xc - 130, 380 + dy, xc + 150, 560 + dy], '#17150f', 0.05, 3, -1.6, 29, 0.45);
      FX.glaze([J(xc - 100, 320), J(xc + 60, 320), J(xc + 60, 700), J(xc - 100, 700)], 0.18);
    });
    // horn toggles and leather loops down the front; a patch stitched over a tear at the hip; the hem torn and split
    for (const y of [330, 372, 414]) { const q = J(xc + 32, y); f.part(ell(q, 4, 9, 0.2, 8), { fill: P.boneD, shadow: P.boneS, shade: 0.4, inkW: 1, cast: false, hatch: false }); f.line([add(q, [-8, -3]), add(q, [-2, 0]), add(q, [-8, 4])], 2, P.leatherD); }
    { const q = J(xc - 30, 540), pt = ell(q, 26, 20, 0.2, 6).map(p2 => [...add(p2, [R(f, -3, 3), R(f, -3, 3)]), 1]); f.part(pt, { fill: mix(P.leather, P.leatherL, 0.25), shadow: '#14130e', tex: 'mottle' + seed, texOp: 0.6, shade: 0.42, inkW: 1.2, cast: false, maxShade: 6 }); f.stitches(pt.concat([pt[0]]), '#8a8676', 1); }
    for (const x of [-60, 70]) { const q = J(xc + x, 704); f.flat([add(q, [-7, 2]), add(q, [0, -30]), add(q, [7, 2])], '#16150f'); }
    f.part([S.at(-0.6, 0.78), S.at(0.68, 0.76), S.at(0.7, 0.84), S.at(-0.6, 0.86)].map(q => [...q, 1]), { fill: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
    FX.rime([S.at(-0.5, -0.06), S.at(-0.66, 0.4), J(xc - 90, 540), J(xc - 110, 640)], 8, 1); FX.icicles([J(xc + 136, 690), J(xc - 96, 702)], 8, 26, 5);
    // head: grey face over the rag, mould in his beard, a leather coif
    f.bone('carter_head');
    const hF2 = frame(HC, hA, H);
    f.part(K.chain([add(neck0, [-4, 10]), hF2([[-0.06, 0.4]])[0]], [44, 34]), SKd({ maxShade: 5 }));
    X.deadHead(f, FX, HC, H, hA, { head: { jaw: 1.14, chin: 0.03, nose: 1.1, hook: 0.3, mouth: 'set', noEar: true, beard: 'full', beardCol: '#6a6c62' }, lid: 0.06 });
    X.mould(f, hF2([[0.12, 0.5]])[0], 12, 9, { rings: 1 }); X.fungalFur(f, hF2([[0.0, 0.56], [0.2, 0.6]]), 6, 1);
    const rag = hF2([[0.04, 0.06], [0.22, 0.03], [0.4, 0.08], [0.43, 0.24], [0.36, 0.4], [0.18, 0.46], [0.0, 0.4], [-0.16, 0.26], [-0.2, 0.1]]);
    const rD = f.part(rag, { fill: mix(P.linen, P.linenD, 0.35), shadow: '#24231d', tex: 'weave' + seed, texOp: 0.6, shade: 0.42, maxShade: 8 }); X.stains(f, rD, [HC[0] - 40, HC[1] - 10, HC[0] + 50, HC[1] + 60], P.mouldD, 0.08, 3, -1.5, 27, 0.6); FX.frost(hF2([[0.36, 0.24]])[0], 8, 8, 6, 1.2);
    const coif = hF2([[-0.42, 0.3], [-0.5, -0.1], [-0.4, -0.44], [-0.12, -0.58], [0.18, -0.54], [0.36, -0.36], [0.34, -0.24], [0.14, -0.32], [-0.1, -0.3], [-0.26, -0.12], [-0.26, 0.2], [-0.1, 0.5], [0.0, 0.66], [-0.3, 0.66]]);
    f.part(coif, COAT({ fill: mix(P.leather, P.leatherL, 0.3), maxShade: 10 })); FX.rime(hF2([[-0.5, -0.1], [-0.4, -0.44], [-0.12, -0.6], [0.18, -0.56]]), 5, 1);
    // the hooked pole: a long ash pole, an iron hook at its head for dragging the dead
    f.bone('carter_hook');
    { f.part(limb(plB, plT, 18, 15, { steps: 12 }), OAKV({ maxShade: 4 })); const dP = E.norm(sub(plT, plB)), nP = [-dP[1], dP[0]], hk = [plT, add(plT, add(mul(dP, 40), mul(nP, -6))), add(plT, add(mul(dP, 64), mul(nP, -40))), add(plT, add(mul(dP, 40), mul(nP, -74))), add(plT, add(mul(dP, 6), mul(nP, -70)))]; f.line(hk, 14, P.iron); f.line(hk.map(q => add(q, [-2, -2])), 2.4, P.ironL, { op: 0.6 }); f.part(plate(plB, plT, 0.96, 1.02, 26, 24), IRN({ maxShade: 3, cast: false })); FX.rime([lp(plB, plT, 0.6, -9), lp(plB, plT, 0.98, -9)], 4, -1); FX.icicle(hk[3], 20, 5); X.mould(f, hk[2], 8, 6, { rings: 0 }); }
    X.arm(f, SN, EN, WN, '_cn', { ws: [46, 38, 30], skin: SKd(), sleeve: { look: COAT(), to: 1.9, slack: 1.3, rag: 6, roll: true } });
    f.bone('upperarm_cn'); FX.rime([lp(SN, EN, 0.0, -28), lp(SN, EN, 0.8, -24)], 6, -1);
    f.bone('hand_cn'); X.grip(f, WN, EN, plA, 27, mix(P.leather, P.leatherL, 0.4), 'carter hook', { nail: '#2a2820' }); }
  f.bone('root');
  return f;

}


module.exports = {
  heroes: [
    { key: 'rat_king', name: 'The Rat King', tier: 'ruler', w: 2200, h: 2000, flip: true, build: ratKing },
    { key: 'dead_cart', name: 'The Dead-Cart', tier: 'ruler', w: 2400, h: 1800, flip: true, build: deadCart },
    { key: 'barrow_chaplain', name: 'Barrow Chaplain', tier: 'elite', w: 1100, h: 1600, flip: true, build: barrowChaplain },
    { key: 'pest_house_watchman', name: 'Pest-House Watchman', tier: 'elite', w: 1100, h: 1600, flip: true, build: pestWatchman },
    { key: 'gravedigger', name: 'Gravedigger', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: gravedigger },
    { key: 'the_swollen', name: 'The Swollen', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: swollen },
    { key: 'court_fool', name: 'Court Fool', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: courtFool },
    { key: 'kings_hawk', name: "The King's Hawk", tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: kingsHawk },
    { key: 'sexton_beetles', name: 'Sexton Beetles', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: sextonBeetles },
    { key: 'barrow_mason', name: 'Barrow Mason', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: barrowMason },
    { key: 'rat_catcher', name: 'Rat-Catcher', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: ratCatcher },
  ],
};
