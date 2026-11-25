// World III, The Boiling Baths (Fire + Water, Scald), second batch: the 11 entries of bible/world_III_boiling_baths.md
// not built in world_III.js. Same world, same rules: fire (dominant) cooks from the outside in (skin boiled pink and white,
// peeling in sheets, blistered, split seams glowing raw); water keeps everything wet, swollen, pruned and steaming.
// Palette: pink-white marble, steam white, boiled red, plus ink black, bone and grey and the bible's named materials.
// Gold only on holy temple objects (the Lustral Priest's aspergillum and stole); the nobles wear pearls and silver.
// Foes face left: every figure is drawn facing right with kit.foeBase (via kit_III.base) and flipped.
// Built for the rig: joints first, f.bone() before every part, parts drawn complete, overlap at every joint.
'use strict';
const K = require('../kit');
const T = require('./kit_III');
const X = require('./kit_III_b');
const { E, B, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P, split, side, ang, elb } = T;
const { Q } = X;

// ------------------------------------------------------------------ HYPOCAUST STOKER (cast, human 0.95)
// He kept the fires under the floors, in the brick crawlspace where the hot air ran, and he has not come up in a hundred
// years. A permanent deep crouch: knees up, the back flat as a table, the head pushed forward under a ceiling that is not
// there; the long iron fire-hook held out ahead and low in both hands, between his knees. Fire's mark, pushed hard: his
// back, cooked for a century under the hot floor tiles, is a stiff boiled shell, cracked deep along the spine and the
// shoulder blades, its edges lifting and peeling; a broken floor tile is baked into it. Water swelled and pruned his arms
// and legs. A scorched leather cap with a neck flap, a wet rag tied over nose and mouth, an ash-greyed squint with the
// brows burnt away. Rag-wrapped knees, a loincloth under a short leather apron, a water skin, an iron ash pan dragged on a
// short chain from his belt.
// Rig: standard humanoid + hook (parent hand_n) + ashpan (parent pelvis) + apron (parent pelvis) + flap (cap's neck flap,
// parent head). Motion: idle raking at nothing along the floor (arms and hook); attack a hooked pull (arms haul back,
// hook drags in). The hook is held in both hands: the far hand needs IK onto the rod in animation.
function hypocaustStoker() {
  const seed = 324, h = TIERS.human[1];
  const f = new Fig(T.base(seed, h, { grimeY: 640 }));
  X.textures(f);
  const gy = f.o.groundY, H = 92;
  const skin = '#ecccc0', skinD = '#d8aca2', skinS = '#6e4450';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'pruned' + seed, texOp: 0.45, maxShade: 20 }, o);
  const SHELL = (o = {}) => Object.assign({ fill: '#f2dcd2', shadow: '#8a5a5e', shade: 0.34, tex: 'mottle' + seed, texOp: 0.55, maxShade: 14 }, o);
  // a flat back: neck, control and pelvis nearly level; the belly (the spine's facing side) hangs down
  const N = [412, 566], C = [318, 560], Pv = [222, 624];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(0.36, 0.1), SF = S.at(-0.02, 0.06);
  const HN = [228, 642], KN = [374, 612], AN = [298, 744];
  const HF = [248, 634], KF = [400, 600], AF = [346, 742];
  // the hook: butt under his hips, both hands on it between the knees, the crook raking the floor ahead
  const R0 = [176, 712], R1 = [566, 758];
  const WN = lerp(R0, R1, 0.64), WF = lerp(R0, R1, 0.47), rA = ang(R0, R1);
  const EN = [488, 646], EF = [446, 640];
  const neck0 = S.at(0.0, -0.02), hd = E.norm(add(E.norm(sub(N, C)), [0, -0.32])), HC = add(N, mul(hd, H * 0.56)), hA = 0.16;
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('hook', WN, 'hand_n').joint('ashpan', S.at(0.3, 0.92), 'pelvis').joint('apron', S.at(0.5, 0.86), 'pelvis').joint('flap', add(HC, rot([-H * 0.36, -H * 0.1], hA)), 'head');

  // ---- the ash pan, dragged behind him on the floor on its short chain
  f.bone('ashpan');
  const pan = [70, gy - 14];
  T.chainLinks(f, [S.at(0.3, 0.92), [150, 720], [118, 748], add(pan, [34, -26])], 7, P.iron);
  f.part([add(pan, [-58, -24]), add(pan, [52, -30]), add(pan, [62, -6]), add(pan, [50, 12]), add(pan, [-50, 14]), add(pan, [-64, -4])], { fill: P.iron, shadow: '#100c0c', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  f.part([add(pan, [-56, -24]), add(pan, [52, -30]), add(pan, [50, -22]), add(pan, [-52, -16])], { fill: P.ironL, shade: 0.3, inkW: 1, cast: false });
  f.part(T.lumpy(f, [add(pan, [-48, -20]), add(pan, [-20, -34]), add(pan, [16, -38]), add(pan, [46, -26])], 3), { fill: Q.ash, shadow: '#4a4442', shade: 0.35, tex: 'grit' + seed, inkW: 1, cast: false }); // heaped ash
  for (const [x, y] of [[-14, -30], [10, -32], [-30, -24]]) f.flat(ell(add(pan, [x, y]), 3, 2, 0, 6), Q.ember, { op: 0.6 });
  T.dents(f, add(pan, [0, -4]), 40, 8, 3);
  f.flat(ell([80, gy + 2], 90, 7, 0, 14), '#2a2020', { op: 0.35 }); f.line([[160, gy + 2], [250, gy + 4]], 2, Q.ash, { op: 0.4 }); // the drag mark through the ash

  // ---- far arm (behind the body): down between the knees to the rod
  X.muscleArm(f, SF, EF, WF, 52, 44, SK({ fill: mix(skin, skinS, 0.18) }), '_f', { castShadow: false });
  f.bone('forearm_f');
  T.wrinkles(f, lp(EF, WF, 0.3), WF, 44, 5);
  // ---- far leg
  X.bentLeg(f, HF, KF, AF, [70, 56, 30], 56, SK({ fill: mix(skin, skinS, 0.2) }), '_f');
  f.bone('foot_f'); B.bareFoot(f, AF, 1, 54, mix(skin, skinS, 0.2), { swell: 0.4, shadow: skinS, tex: 'pruned' + seed });
  f.bone('shin_f');
  for (let i = 0; i < 4; i++) f.line([lp(KF, AF, 0.02 + i * 0.07, -30), lp(KF, AF, 0.06 + i * 0.07, 30)], 4, '#8a7a62', { op: 0.9 }); // knee rags

  // ---- the hook: drawn before the near leg (it runs between his knees) and before both fists
  f.bone('hook');
  X.fireHook(f, R0, R1, 11, { up: -1 });
  // ---- torso: the flat cooked back on top, the soft belly hanging under it toward the thighs
  f.bone('torso');
  const torso = S.shape([[-0.12, 0.36, 0.36], [0.04, 0.44, 0.66], [0.2, 0.46, 0.84], [0.4, 0.46, 0.92], [0.6, 0.46, 0.9], [0.8, 0.46, 0.8], [0.96, 0.48, 0.66], [1.1, 0.42, 0.44]]);
  f.part(torso, SK({ fill: mix(skin, skinD, 0.2), tex: 'mottle' + seed }));
  f.stroke([S.at(0.7, 0.3), S.at(0.8, 0.5), S.at(0.76, 0.7)], 2, '#5a3040', { op: 0.5 }); // the belly fold under the ribs
  for (let i = 0; i < 4; i++) f.line([S.at(0.3, 0.2 + i * 0.09), S.at(0.55, 0.24 + i * 0.09)], 1, INK, { op: 0.35 }); // ribs
  T.scald(f, S.at(0.5, 0.5), 50, 30, 10, { pink: skinD });
  T.blisters(f, S.at(0.4, 0.3), 20, 10, 4, 2.5, 4.5);
  // the shell: we look down a little onto his back, so it shows as a broad cooked plate from the nape to the loins,
  // stiff, its surface split in deep plates along the spine and round the shoulder blades, its lower edge lifting
  const shellTop = [S.at(-0.36, -0.08), S.at(-0.45, 0.06), S.at(-0.47, 0.3), S.at(-0.47, 0.5), S.at(-0.47, 0.7), S.at(-0.48, 0.88), S.at(-0.43, 1.06)];
  const shellBot = [S.at(0.06, 1.02), S.at(0.0, 0.88), S.at(0.04, 0.72), S.at(-0.02, 0.56), S.at(0.06, 0.4), S.at(0.12, 0.24), S.at(0.16, 0.08), S.at(0.02, -0.06)];
  const shell = [...shellTop, ...shellBot.map((q, i) => i % 2 ? [...q, 1] : q)];
  f.part(shell, SHELL());
  f.line(shellTop, 2.4, '#fff8f2', { op: 0.5 }); // the dry lit crest of the back
  // the plates: one deep crack along the spine, two arcs round the shoulder blades, cross splits; each glows raw
  T.seam(f, [S.at(-0.26, 0.0), S.at(-0.24, 0.2), S.at(-0.28, 0.4), S.at(-0.22, 0.6), S.at(-0.26, 0.8), S.at(-0.22, 0.98)], 3.2);
  T.seam(f, [S.at(-0.14, 0.02), S.at(-0.04, 0.12), S.at(0.0, 0.26), S.at(-0.1, 0.36)], 2.4);
  T.seam(f, [S.at(-0.38, 0.12), S.at(-0.3, 0.22), S.at(-0.36, 0.34)], 2);
  for (const [v, w0] of [[0.5, 2.2], [0.66, 1.8], [0.86, 2]]) T.seam(f, [S.at(-0.44, v), S.at(-0.34, v + 0.03), S.at(-0.24, v + 0.01)], w0);
  T.seam(f, [S.at(-0.22, 0.46), S.at(-0.08, 0.5), S.at(0.0, 0.48)], 1.8);
  T.flakes(f, S.at(-0.3, 0.6), 40, 10, 6, { col: '#faeee6' });
  // the peeling edge: the shell's lower rim lifts away from the soft flesh below in curled flaps and hanging sheets
  for (const [v, w0, l] of [[0.3, 20, 30], [0.62, 22, 40], [0.9, 18, 28]]) T.peelSheet(f, S.at(0.04, v), w0, l, { bed: false, col: '#f6e8e0' });
  for (const v of [0.18, 0.48, 0.78]) f.line([S.at(0.02, v), S.at(0.12, v + 0.04), S.at(0.08, v + 0.09)], 1.2, INK, { op: 0.6 }); // the lifted lip
  // a broken terracotta floor tile baked into the back: the flesh has cooked up round its edges
  const tile = [S.at(-0.44, 0.58), S.at(-0.2, 0.52, 1), S.at(-0.12, 0.66), S.at(-0.16, 0.8), S.at(-0.34, 0.84), S.at(-0.46, 0.74)];
  f.part(T.lumpy(f, [S.at(-0.48, 0.55), S.at(-0.16, 0.48), S.at(-0.06, 0.68), S.at(-0.12, 0.86), S.at(-0.38, 0.9), S.at(-0.52, 0.76)], 2), SHELL({ fill: '#e0b8ac', cast: false })); // swollen rim of flesh
  f.part(tile.map((q, i) => i === 1 || i === 3 ? [...q, 1] : q), { fill: Q.terra, shadow: '#3a1810', shade: 0.4, tex: 'grit' + seed, texOp: 0.7, k: 0.4, inkW: 1.3 });
  f.line([S.at(-0.42, 0.6), S.at(-0.22, 0.55)], 1.6, Q.terraL, { op: 0.7 });
  f.line([S.at(-0.3, 0.56), S.at(-0.26, 0.7), S.at(-0.32, 0.8)], 1.2, INK, { op: 0.7 }); // the tile's own crack
  f.flat(ell(S.at(-0.24, 0.72), 6, 3, 0.2, 8), Q.soot, { op: 0.5 });
  // soot smeared over the back from a century of brick
  for (const [u, v] of [[-0.4, 0.2], [-0.1, 0.9], [-0.42, 0.98]]) f.flat(T.lumpy(f, ell(S.at(u, v), 16, 7, -0.1, 10), 3), Q.soot, { op: 0.35 });
  T.beads(f, S.at(-0.1, 0.3), 30, 10, 5, 1);
  // ---- loincloth and belt under the belly
  f.bone('pelvis');
  // the seat: buttocks round out behind and under the pelvis, wrapped in the loincloth
  const seat = [S.at(-0.36, 0.84), S.at(-0.4, 1.0), add(S.at(-0.2, 1.16), [-6, 0]), add(S.at(0.2, 1.22), [-4, 6]), add(S.at(0.6, 1.14), [0, 4]), S.at(0.76, 0.96), S.at(0.6, 0.84)];
  f.part(seat, T.LIN(f, { fill: '#a89e8e', maxShade: 18 }));
  f.stroke([S.at(0.1, 0.9), S.at(0.3, 1.04), S.at(0.5, 1.12)], 1.8); f.stroke([S.at(-0.2, 0.94), S.at(-0.1, 1.08)], 1.6);
  f.flat(T.lumpy(f, ell(S.at(0.3, 1.1), 18, 10, 0.4, 10), 2), P.mud, { op: 0.3 });
  f.stroke([S.at(0.2, 0.92), S.at(0.4, 1.0)], 1.6);
  f.part([S.at(-0.36, 0.86), S.at(0.68, 0.82), S.at(0.72, 0.9), S.at(-0.38, 0.95)], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  // the water skin hanging plumb from the belt at the side of the hip
  const ws = S.at(0.1, 0.92);
  f.line([ws, add(ws, [2, 22])], 2, P.leatherD);
  f.part(T.lumpy(f, [add(ws, [-18, 22]), add(ws, [16, 20]), add(ws, [26, 50]), add(ws, [18, 74]), add(ws, [-4, 80]), add(ws, [-22, 62])], 3), { fill: '#6a4a36', shadow: '#2a1810', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  f.part([add(ws, [-6, 14]), add(ws, [8, 14]), add(ws, [8, 24]), add(ws, [-6, 24])], { fill: '#3a2a20', shade: 0.3, inkW: 1, cast: false, sharp: true });
  f.line([add(ws, [-12, 40]), add(ws, [10, 60])], 1.4, '#a07a5a', { op: 0.5 }); T.drip(f, add(ws, [4, 82]), 0.8);
  // ---- the short leather apron hanging plumb between the knees
  f.bone('apron');
  const ap0 = S.at(0.5, 0.86), ap1 = S.at(0.76, 0.82);
  f.part([ap0, ap1, add(ap1, [6, 70]), add(ap1, [0, 88], 1), add(ap1, [-16, 80]), add(ap0, [-6, 92], 1), add(ap0, [-10, 60])], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  f.flat(ell(add(ap0, [16, 50]), 7, 5, 0.3, 8), '#1a0e0a', { op: 0.6 }); f.line([add(ap0, [6, 20]), add(ap0, [10, 70])], 1.4, P.leatherL, { op: 0.5 });

  // ---- near leg: up under the chest, the knee rag-wrapped and worn through
  X.bentLeg(f, HN, KN, AN, [74, 58, 32], 56, SK(), '_n');
  f.bone('foot_n'); B.bareFoot(f, AN, 1, 56, skin, { swell: 0.5, shadow: skinS, tex: 'pruned' + seed });
  f.bone('shin_n');
  for (let i = 0; i < 5; i++) f.stroke([lp(KN, AN, -0.02 + i * 0.06, -34), lp(KN, AN, 0.0 + i * 0.06, 0), lp(KN, AN, 0.03 + i * 0.06, 32)], 5, i % 2 ? '#9a8a70' : '#7a6a52'); // knee rags
  f.flat(ell(lp(KN, AN, 0.1, 18), 10, 7, 0.4, 8), P.raw, { op: 0.8 }); f.line(ell(lp(KN, AN, 0.1, 18), 11, 8, 0.4, 8).slice(0, 6), 1, '#9a8a70'); // worn through to the knee
  f.stroke([lp(KN, AN, 0.3, 30), add(lp(KN, AN, 0.3, 30), [10, 26]), add(lp(KN, AN, 0.3, 30), [4, 44])], 3.2, '#8a7a62'); // a loose rag end
  T.wrinkles(f, lp(KN, AN, 0.4), lp(KN, AN, 0.9), 50, 6);
  T.scald(f, lp(KN, AN, 0.6), 14, 30, 6);
  f.bone('thigh_n');
  T.wrinkles(f, lp(HN, KN, 0.3), lp(HN, KN, 0.8), 64, 7);
  T.scald(f, lp(HN, KN, 0.45, -8), 50, 18, 10, { ang: ang(HN, KN) });
  T.blisters(f, lp(HN, KN, 0.3, -24), 14, 6, 3, 2.5, 4);
  for (const t of [0.2, 0.75]) f.flat(T.lumpy(f, ell(lp(HN, KN, t, 10), 14, 6, ang(HN, KN), 8), 2), Q.soot, { op: 0.28 });
  T.peelSheet(f, lp(HN, KN, 0.6, -20), 16, 30, { sway: -2 });
  f.bone('foot_n');
  f.flat(ell([AN[0] + 30, gy - 6], 46, 6, 0, 10), Q.soot, { op: 0.3 }); // the soles black with ash

  // ---- far fist on the rod
  f.bone('hand_f');
  X.gripK(f, WF, EF, rA, 26, mix(skin, skinS, 0.18), { tex: 'pruned' + seed, texOp: 0.5, shadow: skinS, name: 'stoker far' });

  // ---- the head: pushed forward under a low ceiling, ash-grey squint, brows burnt off, a wet rag over nose and mouth
  f.bone('head');
  f.part(K.chain([S.at(-0.02, 0.06), add(HC, rot([-H * 0.2, H * 0.24], hA))], [70, 56]), SK({ tex: 'mottle' + seed }));
  f.stroke([S.at(-0.3, 0.02), add(HC, rot([-H * 0.36, -H * 0.04], hA))], 2.4, '#5a3040', { op: 0.5 }); // the neck's back muscle
  const hF = X.face(f, HC, H, hA, { skin: mix(skin, Q.ash, 0.28), jaw: 1.08, chin: 0.0, nose: 1.0, mouth: 'set', squint: 0.86, browDown: 0.06, browW: 0.012, browCol: mix(skin, Q.ash, 0.4), age: true, iris: '#2a1a18', eyeWhite: '#d8c4b8', hairCol: '#3a2a24', noEar: false });
  for (let i = 0; i < 4; i++) f.line(hF([[0.04 + i * 0.05, -0.16], [0.08 + i * 0.05, -0.1]]), 1, INK, { op: 0.5 }); // squint creases
  f.flat(hF([[0.06, -0.1], [0.18, -0.12], [0.2, -0.08], [0.08, -0.07]]), P.rawD, { op: 0.35 }); // raw lids, the lashes gone
  f.stroke(hF([[0.06, -0.066], [0.12, -0.072], [0.18, -0.064]]), 3, '#1a0e0c'); f.stroke(hF([[0.27, -0.068], [0.31, -0.07]]), 2.2, '#1a0e0c'); // the squinting slits
  f.flat(hF(ell([0.135, -0.07], 0.012, 0.006, 0, 6)), '#e8dcd0', { op: 0.8 });
  for (const [x, y] of [[0.0, -0.2], [0.2, 0.0], [-0.1, 0.1]]) f.flat(T.lumpy(f, hF(ell([x, y], 0.08, 0.04, 0.2, 8)), 1), Q.soot, { op: 0.35 }); // ash in the creases
  // the rag over nose and mouth: wet linen tied behind the head, the knot and two ends hanging plumb
  const rag = [[0.42, 0.02], [0.44, 0.2], [0.36, 0.44], [0.12, 0.52], [-0.1, 0.4], [-0.24, 0.18], [-0.2, 0.06], [0.1, 0.06], [0.3, 0.0]];
  f.part(hF(rag.map((q, i) => i === 3 || i === 5 ? [...q, 1] : q)), T.LIN(f, { fill: '#c4bcaa', shadow: '#5e5450', tex: 'weave' + seed, maxShade: 8 }));
  for (const [x, y] of [[0.3, 0.46], [0.18, 0.5], [0.0, 0.46]]) f.line(hF([[x, y - 0.02], [x - 0.02, y + 0.06]]), 1, '#8a8272', { op: 0.8 }); // frayed threads at the lower edge
  f.stroke(hF([[0.36, 0.1], [0.3, 0.24], [0.32, 0.4]]), 1.8); f.stroke(hF([[0.1, 0.14], [0.14, 0.3]]), 1.6);
  f.flat(T.lumpy(f, hF(ell([0.3, 0.3], 0.06, 0.05, 0, 8)), 1), '#4a3e3a', { op: 0.5 }); // wet over the mouth
  f.line(hF([[0.42, 0.08], [0.44, 0.18]]), 1.4, '#5a4e48', { op: 0.6 }); // the nose's ridge under the cloth
  T.drip(f, hF([[0.2, 0.52]])[0], 0.8);
  // the scorched leather cap, tight to the skull
  f.part(hF([[0.3, -0.36], [0.12, -0.54], [-0.16, -0.58], [-0.44, -0.42], [-0.52, -0.1], [-0.42, 0.04], [-0.24, -0.08], [-0.02, -0.26], [0.26, -0.26]]), { fill: '#3a2a22', shadow: '#120a08', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  f.line(hF([[0.28, -0.3], [0.0, -0.32], [-0.2, -0.18]]), 1.6, '#6a5040', { op: 0.6 }); f.stitches(hF([[0.1, -0.5], [-0.2, -0.52], [-0.42, -0.36]]), '#7a6050', 1);
  f.flat(T.lumpy(f, hF(ell([-0.1, -0.44], 0.1, 0.05, 0.2, 8)), 1), '#120a08', { op: 0.6 }); // a burnt patch
  // ---- the knot of the rag behind the head, its ends hanging plumb
  { const kn = hF([[-0.3, 0.14]])[0]; f.part(ell(kn, 8, 7, 0, 8), T.LIN(f, { fill: '#8a8272', cast: false, inkW: 1.1 })); f.stroke([kn, add(kn, [-4, 18]), add(kn, [-2, 32])], 5, '#8a8272'); f.stroke([kn, add(kn, [4, 16]), add(kn, [6, 26])], 4, '#7a7262'); }
  // ---- the cap's neck flap, hanging down over the nape onto the shell
  f.bone('flap');
  const fl0 = hF([[-0.5, -0.16]])[0], fl1 = hF([[-0.4, 0.02]])[0];
  f.part([fl0, fl1, add(fl1, [-4, 22]), [...add(fl1, [-10, 30]), 1], add(fl1, [-16, 22]), [...add(fl0, [-22, 30]), 1], add(fl0, [-20, 12])], { fill: '#4a3628', shadow: '#120a08', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6 });
  f.stitches([add(fl0, [-4, 4]), add(fl0, [-16, 22])], '#8a7060', 0.9);

  // ---- near arm: down in front of the knee to the rod
  X.muscleArm(f, SN, EN, WN, 56, 46, SK(), '_n');
  f.bone('forearm_n');
  T.wrinkles(f, lp(EN, WN, 0.35), WN, 48, 5);
  T.peelSheet(f, lp(EN, WN, 0.3, 18), 14, 30, { sway: 2 });
  f.flat(ell(lp(EN, WN, 0.6, -10), 14, 6, 1.6, 8), Q.soot, { op: 0.3 });
  f.bone('upperarm_n');
  T.blisters(f, lp(SN, EN, 0.4, -8), 10, 14, 3, 2.5, 4);
  T.scald(f, lp(SN, EN, 0.6), 16, 20, 5);
  f.bone('hand_n');
  X.gripK(f, WN, EN, rA, 27, skin, { tex: 'pruned' + seed, texOp: 0.5, shadow: skinS, name: 'stoker near' });

  // ---- vapour lifting off the cooked back
  f.bone('torso');
  T.wisp(f, S.at(-0.5, 0.3), 70, { w: 6, op: 0.3, drift: -10 });
  T.wisp(f, S.at(-0.5, 0.8), 56, { w: 5, op: 0.26, drift: 6 });
  f.bone('root');
  f.flat(ell([300, gy + 2], 200, 9, 0, 16), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ VOTIVE PILGRIM (cast, human 0.95)
// A lame, poor woman who came to the healing spring with a clay leg to hang at the shrine, and was dipped until the
// waters cooked the lame leg. She leans hard on a wooden tau crutch under the near arm, the near hand on its peg; the
// boiled leg is held up off the floor, bent back at the knee: fire has cooked it pink-white and peeling in sheets from
// hip to foot, water has swollen it to twice the width of the other, soft, wrinkled and steaming, an old bandage
// unwinding from it and trailing. A cord of clay and wax votives (a little leg, a hand, a foot, a swaddled baby) hangs
// from the crutch's peg and knocks against it. Undyed wool pilgrim's cloak, a lead temple badge pinned at the shoulder,
// a clay ampulla of temple water on a cord at her neck that her far hand touches, hoping; a wooden begging bowl at her
// belt, a knotted-cord rosary at the wrist, a rag shoe on the one good foot. A gaunt face under a wet headscarf, turned up.
// Rig: standard humanoid + crutch (parent hand_n) + votives (parent crutch) + cloak (parent torso) + skirt (parent pelvis)
// + bandage (parent shin_f). Motion: idle a hop and a touch of the ampulla; attack a swing of the crutch, votives rattling.
function votivePilgrim() {
  const seed = 325, h = TIERS.human[1];
  const f = new Fig(T.base(seed, h, { grimeY: 620 }));
  X.textures(f);
  const gy = f.o.groundY, H = 90;
  const skin = '#dcb4a4', skinS = '#5e3a44';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle' + seed, texOp: 0.45, maxShade: 18 }, o);
  const BOIL = (o = {}) => Object.assign({ fill: '#f0d8ce', shadow: '#8a5662', shade: 0.3, tex: 'pruned' + seed, texOp: 0.55, maxShade: 26 }, o);
  const WOOL = (o = {}) => Object.assign({ fill: '#b4aa94', shadow: '#4a4038', shade: 0.38, tex: 'weave' + seed, texOp: 0.45, maxShade: 40 }, o);
  const N = [338, 270], C = [302, 362], Pv = [288, 470];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.12, 0.1), SF = S.at(0.36, 0.08);
  const HN = [282, 482], KN = [314, 626], AN = [316, 748];
  const HF = [290, 478], KF = [250, 614], AF = [164, 648]; // the boiled leg, bent a little back at the knee, foot off the floor
  // the crutch: tau top in the near armpit, shaft down and forward to its foot; a peg for the hand
  const CT = [304, 314], CB = [440, 788], cA = ang(CT, CB), peg0 = lerp(CT, CB, 0.33), peg1 = add(peg0, [34, 2]);
  const WN = lerp(peg0, peg1, 0.55), EN = [326, 392];
  const amp = add(S.at(0.62, 0.3), [6, 0]); // the ampulla on her breast
  const EF = [380, 420], WF = add(amp, [12, -6]);
  const neck0 = S.at(0.1, -0.03), HC = [348, 212], hA = -0.46;
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('crutch', WN, 'hand_n').joint('votives', peg1, 'crutch').joint('cloak', S.at(-0.3, 0.05), 'torso').joint('skirt', S.at(0, 0.86), 'pelvis').joint('bandage', lerp(KF, AF, 0.5), 'shin_f');

  // ---- the cloak's back, hanging plumb behind her to the knee
  f.bone('cloak');
  // a pilgrim's shoulder cape (the short travelling cloak), hanging plumb behind her to the hip
  const ck = [S.at(-0.2, -0.04), S.at(-0.62, 0.1), [226, 380], [214, 450], [212, 492, 1], [228, 482], [244, 500, 1], [258, 484], [274, 498, 1], [282, 440], S.at(-0.2, 0.5)];
  f.part(ck, WOOL());
  for (const [a, b] of [[[238, 340], [226, 420], [222, 488]], [[262, 350], [256, 430], [256, 490]]]) f.stroke([a, lerp(a, b, 0.5), b], 2.2);
  f.part([[212, 470], [282, 466], [276, 500], [212, 494]], WOOL({ fill: '#5a5040', opacity: 0.35, cast: false, inkW: 0 })); // the wet, dirty hem
  // ---- far arm, behind the body: the forearm comes round in front of the chest to the ampulla
  X.muscleArm(f, SF, EF, WF, 34, 28, SK({ fill: mix(skin, skinS, 0.15) }), '_f', { castShadow: false });
  // ---- the boiled leg: far, behind the good one, swollen to twice its width, bent back at the knee and held up
  f.bone('thigh_f');
  X.bentLeg(f, HF, KF, AF, [116, 100, 76], 60, BOIL(), '_f', { after: () => {
    T.wrinkles(f, lp(HF, KF, 0.2), lp(HF, KF, 0.9), 110, 9, { w: 1.1 });
    T.wrinkles(f, lp(KF, AF, 0.1), lp(KF, AF, 0.95), 90, 8, { w: 1.1 });
    T.scald(f, lerp(KF, AF, 0.5), 50, 30, 14, { pink: P.rawL, ang: ang(KF, AF) });
    T.blisters(f, lp(KF, AF, 0.4, -24), 30, 12, 5, 3, 7, { burst: 0.4 });
    T.seam(f, [lp(KF, AF, 0.15, 30), lp(KF, AF, 0.4, 34), lp(KF, AF, 0.7, 30)], 2.2);
  } });
  f.bone('foot_f');
  { const fa = AF, tilt = 0.62; f.raw(`<g transform="rotate(${(tilt * 180 / Math.PI).toFixed(1)} ${fa[0]} ${fa[1]})">`);
    B.bareFoot(f, fa, -1, 64, '#f0d8ce', { swell: 1, shadow: '#8a5662', tex: 'pruned' + seed, groundY: fa[1] + 52 });
    f.raw('</g>'); }
  T.peelSheet(f, add(AF, [-20, 10]), 18, 34, { sway: -3 });
  f.bone('shin_f');
  // the swollen calf hangs under the raised shin like a full wineskin, sagging toward the floor
  { const c0 = lp(KF, AF, 0.15, 30), c1 = lp(KF, AF, 0.85, 26); f.part([c0, add(lerp(c0, c1, 0.25), [0, 26]), add(lerp(c0, c1, 0.55), [0, 34]), add(lerp(c0, c1, 0.85), [0, 18]), c1, lerp(c0, c1, 0.5)], BOIL({ cast: true, castOp: 0.3, inkW: 1.4, inkHeavy: 2.4, maxShade: 14 }));
    T.wrinkles(f, add(lerp(c0, c1, 0.2), [0, 16]), add(lerp(c0, c1, 0.8), [0, 14]), 30, 6, { w: 1 });
    f.line([add(lerp(c0, c1, 0.3), [0, 22]), add(lerp(c0, c1, 0.6), [0, 28])], 2, '#fff8f4', { op: 0.5 }); T.drip(f, add(lerp(c0, c1, 0.55), [0, 34]), 1); }
  T.peelSheet(f, lp(KF, AF, 0.45, 34), 28, 50, { sway: 2 });
  T.flakes(f, lp(KF, AF, 0.5, -20), 30, 10, 4, { col: '#faeee6' });
  f.bone('thigh_f');
  T.peelSheet(f, lp(HF, KF, 0.8, -40), 24, 46, { sway: -4 });
  // ---- the old bandage unwinding off the swollen shin, trailing to the floor
  f.bone('bandage');
  const bd0 = lp(KF, AF, 0.86, 30);
  for (let i = 0; i < 2; i++) { const t = 0.78 + i * 0.1, a0 = lp(KF, AF, t, -34), a1 = lp(KF, AF, t + 0.04, 0), a2 = lp(KF, AF, t - 0.02, 36); f.stroke([a0, a1, a2], 10, INK); f.stroke([a0, a1, a2], 8, i % 2 ? '#c8bca4' : '#b4a88e'); f.line([a0, a1], 1, '#e8e0d0', { op: 0.6 }); } // the last turns of the bandage round the ankle
  { // the loose end, hanging slack in a twisting ribbon, frayed at its end, stained
    const rib = [bd0, add(bd0, [-6, 18]), add(bd0, [4, 40]), add(bd0, [-4, 62]), add(bd0, [6, 82])], wL = [], wR = [];
    rib.forEach((q, i) => { const w = 7 * (i === 2 ? 0.45 : 1); wL.push(add(q, [-w, 0])); wR.push(add(q, [w, 0])); });
    const end = rib[rib.length - 1];
    f.part([...wL, add(end, [-4, 8]), [...add(end, [0, 4]), 1], add(end, [4, 10]), ...wR.reverse()], T.LIN(f, { fill: '#c4b8a0', maxShade: 4, cast: true, castOp: 0.25 }));
    f.flat([add(bd0, [-6, 22]), add(bd0, [4, 26]), add(bd0, [6, 40]), add(bd0, [-4, 38])], '#9a6a50', { op: 0.55 }); // old stains
    for (let i = 0; i < 4; i++) f.line([add(end, [-5 + i * 3, 6]), add(end, [-6 + i * 4, 16 + (i % 2) * 5])], 0.8, '#b0a48c'); }

  // ---- the good leg: thin, carrying all her weight, a rag shoe
  T.legRig(f, HN, KN, AN, 50, 62, 44, SK(), '_n', { thigh: 0.06 });
  T.legDetail(f, HN, KN, AN, 44, SK(), '_n', { calf: 0.08 });
  f.bone('foot_n');
  { const rs = [add(AN, [-26, 10]), add(AN, [20, 0]), add(AN, [56, 22]), add(AN, [66, 40]), [...add(AN, [62, 44]), 1], [...add(AN, [-24, 44]), 1], add(AN, [-30, 26])];
    f.part(rs, T.LIN(f, { fill: '#7a6e5a', shadow: '#2a2420', maxShade: 8 }));
    for (let i = 0; i < 4; i++) f.line([add(AN, [-20 + i * 18, 6 + i * 4]), add(AN, [-12 + i * 18, 42])], 1.6, '#4a4034', { op: 0.7 });
    f.stroke([add(AN, [-20, 4]), add(AN, [-4, -10]), add(AN, [16, -4])], 3, '#6a5e4a'); }
  f.bone('shin_n');
  T.scald(f, lp(KN, AN, 0.5), 10, 30, 4, { pink: P.poachD });
  // ---- torso: a thin, stooped woman in a hitched kirtle
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.26, 0.3], [0.06, 0.42, 0.5], [0.2, 0.46, 0.66], [0.36, 0.44, 0.66], [0.52, 0.4, 0.54], [0.7, 0.44, 0.5], [0.86, 0.52, 0.56], [1.0, 0.56, 0.58]]);
  f.part(torso, WOOL({ fill: '#9a8c74', shadow: '#3a3028' }));
  X.clothWear(f, torso, [260, 280, 360, 460], 4);
  f.part(S.shape([[0.0, -0.1, 0.32], [0.05, -0.12, 0.42], [0.1, -0.16, 0.46]]), SK({ cast: false })); // the throat, collarbones
  f.line([S.at(0.1, 0.06), S.at(0.3, 0.1), S.at(0.44, 0.06)], 1.2, INK, { op: 0.6 });
  for (const [a, b] of [[[0.4, 0.2], [0.3, 0.5]], [[-0.2, 0.3], [-0.1, 0.6]], [[0.2, 0.62], [0.36, 0.8]]]) f.stroke([S.at(...a), S.at(...b)], 1.8);
  f.part([S.at(-0.2, 0.36), S.at(0.04, 0.34), S.at(0.06, 0.5), S.at(-0.18, 0.52)], WOOL({ fill: '#6a5a46', inkW: 1, sharp: true, cast: false })); // a patch
  f.stitches([S.at(-0.2, 0.36), S.at(0.04, 0.34), S.at(0.06, 0.5), S.at(-0.18, 0.52), S.at(-0.2, 0.36)], '#c8b890', 0.8);
  // ---- the kirtle's skirt, hitched up into the belt to the knee for walking; stretched over the swollen thigh
  f.bone('skirt');
  const sk = [S.at(-0.6, 0.84), S.at(0.6, 0.82), [356, 540], [366, 600, 1], [340, 592], [318, 606, 1], [296, 596], [272, 610, 1], [250, 594], [228, 600, 1], [226, 540]];
  f.part(sk, WOOL({ fill: '#9a8c74', shadow: '#3a3028' }));
  f.stroke([[300, 500], [306, 560], [300, 598]], 2); f.stroke([[250, 510], [244, 590]], 1.8); f.stroke([[340, 510], [352, 590]], 1.8);
  f.stroke([[244, 492], [276, 488], [318, 494]], 2.6, '#3a2a20', { op: 0.6 }); // the hitched-up fold
  f.flat([[226, 580], [366, 574], [366, 604], [226, 610]], P.mud, { op: 0.25 });
  X.clothWear(f, sk, [230, 480, 360, 600], 5, { tide: 560 });
  // a split seam on the far side where the swollen thigh has burst the cloth, boiled flesh bulging through
  f.part(T.lumpy(f, [[332, 520], [352, 516], [360, 550], [352, 580], [336, 574], [330, 550]], 2), BOIL({ cast: false }));
  f.line([[332, 520], [330, 550], [336, 574]], 1.4, INK, { op: 0.7 }); f.line([[352, 516], [360, 550], [352, 580]], 1.4, INK, { op: 0.7 });
  for (let i = 0; i < 4; i++) f.line([[328, 526 + i * 14], [336, 528 + i * 14]], 1, '#c8b890', { op: 0.7 }); // the broken stitches
  // ---- belt: a cord, the begging bowl and the knotted rosary hanging from it
  f.bone('pelvis');
  T.rope(f, [S.at(-0.62, 0.8), S.at(0.0, 0.84), S.at(0.6, 0.8)], 6, '#8a7a5a');
  const bw = S.at(0.36, 0.88);
  f.line([bw, add(bw, [4, 22])], 1.6, '#5a4a36');
  f.part([add(bw, [-22, 20]), add(bw, [30, 18]), add(bw, [24, 40]), add(bw, [4, 46]), add(bw, [-16, 40])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5 }); // the begging bowl, hung by its rim
  f.line([add(bw, [-18, 24]), add(bw, [26, 22])], 1.4, P.woodL, { op: 0.6 }); f.line([add(bw, [8, 26]), add(bw, [12, 38])], 1.1, INK, { op: 0.6 }); // a crack
  // ---- head: gaunt, wet hair under a headscarf, the look turned up, hoping
  f.bone('head');
  f.part(K.chain([add(neck0, [0, 10]), add(HC, [-14, 34])], [36, 30]), SK());
  f.line([add(neck0, [10, 6]), add(HC, [6, 40])], 1.2, INK, { op: 0.5 }); // the cord of the neck
  const hF = X.face(f, HC, H, hA, { skin, jaw: 0.92, chin: 0.02, nose: 1.02, hook: 0.2, mouth: 'set', squint: 0.2, browDown: -0.04, gaunt: true, age: true, lips: true, lashes: true, iris: '#2a1e1a', eyeWhite: '#e4d6cc', hairCol: '#3a2c24', browCol: '#4a3a30', browW: 0.035, noEar: true });
  f.flat(hF(ell([0.14, -0.075], 0.02, 0.012, 0, 6)), '#fff', { op: 0.7 }); // a wet glint, looking up
  T.beads(f, hF([[0.1, -0.24]])[0], 14, 6, 3, 0.9);
  // the headscarf: undyed linen over the crown, wet, tied at the nape, strands of hair escaping and hanging plumb
  f.part(hF([[0.3, -0.4], [0.1, -0.56], [-0.2, -0.6], [-0.48, -0.42], [-0.56, -0.06], [-0.5, 0.3], [-0.36, 0.46], [-0.22, 0.4], [-0.24, 0.06], [-0.12, -0.24], [0.12, -0.36]]), T.LIN(f, { fill: '#cfc4b0', maxShade: 12 }));
  f.stroke(hF([[0.1, -0.5], [-0.2, -0.52], [-0.44, -0.34]]), 1.6); f.stroke(hF([[-0.36, -0.2], [-0.42, 0.2]]), 1.6);
  f.flat(hF([[0.12, -0.36], [-0.12, -0.24], [-0.22, 0.04], [-0.18, 0.06], [-0.06, -0.2]]), '#3a2c24', { op: 0.7 }); // hair at the scarf's edge
  for (const [x, y, l] of [[-0.18, 0.1, 50], [-0.24, 0.3, 40]]) { const p = hF([[x, y]])[0]; f.stroke([p, add(p, [2, l * 0.5]), add(p, [-1, l])], 2.6, '#3a2c24'); }
  { const kn = hF([[-0.5, 0.36]])[0]; f.part(ell(kn, 8, 6, 0, 8), T.LIN(f, { fill: '#c4b8a4', cast: false })); f.stroke([kn, add(kn, [-6, 26]), add(kn, [-4, 44])], 6, '#c4b8a4'); f.stroke([kn, add(kn, [2, 22])], 5, '#b8ac98'); }
  T.drip(f, hF([[-0.36, 0.5]])[0], 0.9);
  // ---- the ampulla of temple water on its cord at her breast, the lead badge pinned on the cloak
  f.bone('torso');
  f.line([S.at(0.0, -0.02), S.at(0.3, 0.14), amp], 1.4, '#3a2a20'); f.line([S.at(0.5, 0.0), amp], 1.4, '#3a2a20');
  f.part([add(amp, [-10, 0]), add(amp, [-6, -10]), add(amp, [6, -10]), add(amp, [10, 0]), add(amp, [14, 18]), add(amp, [4, 30]), add(amp, [-8, 30]), add(amp, [-14, 16])], { fill: Q.clay, shadow: Q.clayD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.2 });
  f.line([add(amp, [-6, 12]), add(amp, [6, 14])], 1, INK, { op: 0.5 }); f.flat(ell(add(amp, [0, 18]), 3, 3, 0, 6), Q.clayD, { op: 0.8 }); // a stamped cross
  // the cloak's front edge falling over the near shoulder; the badge pinned there
  f.bone('cloak');
  f.part([S.at(-0.3, -0.06), S.at(0.02, -0.08), S.at(0.12, 0.1), S.at(0.0, 0.3), S.at(-0.24, 0.36), S.at(-0.4, 0.2)], WOOL());
  f.stroke([S.at(-0.1, 0.0), S.at(-0.2, 0.24)], 1.8);
  { const bg = S.at(-0.06, 0.12); f.part([add(bg, [-8, -10]), add(bg, [8, -10]), add(bg, [10, 4]), add(bg, [0, 14]), add(bg, [-10, 4])], { fill: Q.lead, shadow: '#2a2a2e', shade: 0.4, inkW: 1.1, cast: false }); f.line([add(bg, [-4, -4]), add(bg, [4, -4]), add(bg, [0, 6]), add(bg, [-4, -4])], 1, '#2a2a2e'); f.line([add(bg, [-6, -8]), add(bg, [6, -8])], 0.9, '#c8c8cc', { op: 0.7 }); }

  // ---- the crutch: oak, dark with hands, the tau head padded with rag in the armpit, a peg for the hand
  f.bone('crutch');
  f.part(limb(CT, CB, 20, 16, { steps: 10 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(CT, CB, 0.02, -5), lp(CT, CB, 0.98, -4)], 1.4, P.woodL, { op: 0.6 });
  f.part([add(CT, [-40, -6]), add(CT, [38, -14]), add(CT, [42, 4]), add(CT, [-38, 12])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 }); // the tau head
  f.part(T.lumpy(f, [add(CT, [-36, -12]), add(CT, [32, -22]), add(CT, [36, -8]), add(CT, [-34, 2])], 2), T.LIN(f, { fill: '#a89c84', cast: false, maxShade: 6 })); // rag padding
  for (let i = 0; i < 4; i++) f.line([add(CT, [-24 + i * 16, -16 - i * 2]), add(CT, [-20 + i * 16, -2 - i * 2])], 1.2, '#5a5040', { op: 0.7 });
  f.part([add(CB, [-12, -16]), add(CB, [10, -16]), add(CB, [12, 0]), add(CB, [-12, 0])], { fill: P.iron, shade: 0.4, inkW: 1.1, cast: false, sharp: true }); // iron ferrule
  f.part(limb(peg0, peg1, 13, 11, { steps: 4 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.2 });
  f.part(ell(peg0, 9, 9, 0, 8), { fill: P.woodD, shade: 0.3, inkW: 1, cast: false });
  for (let i = 0; i < 5; i++) f.line([lp(CT, CB, 0.6 + i * 0.012, -10), lp(CT, CB, 0.61 + i * 0.012, 10)], 1.6, '#3a2a1a'); // a cord binding over a split
  f.line([lp(CT, CB, 0.66, -4), lp(CT, CB, 0.78, 2)], 1.1, INK, { op: 0.6 });
  // ---- the votives on their cord, hanging plumb from the peg's end
  f.bone('votives');
  const vc = add(peg1, [2, 4]);
  f.line([vc, add(vc, [0, 236])], 1.6, '#5a4a36');
  const clay = (o = {}) => Object.assign({ fill: Q.clay, shadow: Q.clayD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.1, inkHeavy: 1.6 }, o);
  const wax = (o = {}) => Object.assign({ fill: Q.wax, shadow: '#7a6a44', shade: 0.38, inkW: 1.1, inkHeavy: 1.6 }, o);
  { const v = add(vc, [0, 30]); // a little clay leg: thigh, knee, shin, foot
    f.part([add(v, [-7, 0]), add(v, [7, 0]), add(v, [8, 24]), add(v, [5, 46]), add(v, [16, 54]), add(v, [16, 60]), add(v, [-4, 60]), add(v, [-5, 46]), add(v, [-8, 24])], clay());
    f.line([add(v, [-6, 24]), add(v, [6, 26])], 0.9, INK, { op: 0.6 }); f.flat(ell(add(v, [-2, 6]), 2, 2, 0, 6), Q.clayD); }
  { const v = add(vc, [0, 96]); // a wax hand, palm out, fingers down
    f.part([add(v, [-9, 0]), add(v, [9, 0]), add(v, [12, 16]), add(v, [12, 34]), add(v, [8, 36]), add(v, [6, 24]), add(v, [3, 38]), add(v, [-1, 38]), add(v, [-2, 26]), add(v, [-6, 36]), add(v, [-10, 34]), add(v, [-10, 20]), add(v, [-16, 22]), add(v, [-14, 12])], wax());
    f.flat([add(v, [6, 34]), add(v, [8, 42]), add(v, [5, 44])], Q.wax, { op: 0.9 }); } // a wax drip, softened by the heat
  { const v = add(vc, [0, 152]); // a clay foot
    f.part([add(v, [-6, 0]), add(v, [6, 0]), add(v, [7, 16]), add(v, [22, 22]), add(v, [24, 30]), add(v, [-8, 30]), add(v, [-8, 16])], clay({ fill: mix(Q.clay, '#fff', 0.1) }));
    f.line([add(v, [10, 22]), add(v, [10, 28])], 0.8, INK, { op: 0.6 }); f.line([add(v, [16, 23]), add(v, [16, 29])], 0.8, INK, { op: 0.6 }); }
  { const v = add(vc, [0, 200]); // a swaddled wax baby
    f.part([add(v, [-10, 2]), add(v, [0, -4]), add(v, [10, 2]), add(v, [12, 22]), add(v, [8, 38]), add(v, [0, 44]), add(v, [-8, 38]), add(v, [-12, 20])], wax({ fill: mix(Q.wax, '#c8b88a', 0.3) }));
    for (let i = 0; i < 4; i++) f.line([add(v, [-10, 12 + i * 8]), add(v, [10, 8 + i * 8])], 1, '#7a6a44', { op: 0.7 }); // the swaddling bands
    f.part(ell(add(v, [0, 4]), 7, 7, 0, 10), wax({ cast: false }));
    f.line([add(v, [-3, 3]), add(v, [-1, 3])], 0.9, INK, { op: 0.7 }); f.line([add(v, [2, 3]), add(v, [4, 3])], 0.9, INK, { op: 0.7 }); }

  // ---- near arm: over the crutch head, down to the peg
  T.armRig(f, SN, EN, add(WN, [-10, -6]), [42, 32, 26], SK(), '_n');
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [-2, -6]), lp(SN, EN, 0.7), 52, 46, { depth: 8, teeth: 5 }), WOOL({ fill: '#9a8c74', shadow: '#3a3028' })); // the kirtle sleeve
  f.bone('forearm_n');
  T.scald(f, lp(EN, WN, 0.5), 10, 20, 4, { pink: P.poachD });
  for (let i = 0; i < 6; i++) f.flat(ell(lp(EN, WN, 0.6 + i * 0.05, (i % 2 ? 1 : -1) * 4), 4, 3.4, 0, 6), '#6a5a40'); // the knotted cord rosary wound round the wrist
  f.bone('hand_n');
  X.gripK(f, WN, EN, Math.PI, 22, skin, { tex: 'mottle' + seed, texOp: 0.4, shadow: skinS, name: 'pilgrim peg' });
  // ---- far hand at the ampulla, fingertips on it
  f.bone('hand_f');
  T.handBack(f, add(WF, [6, -2]), 1.9, 17, mix(skin, skinS, 0.1), { shadow: skinS, curl: 0.4, spread: 0.18, lean: true, flip: true });
  // ---- steam off the boiled leg
  f.bone('shin_f');
  T.wisp(f, lp(KF, AF, 0.4, -40), 70, { w: 7, op: 0.32, drift: -8 });
  T.wisp(f, lp(KF, AF, 0.8, -30), 50, { w: 6, op: 0.28, drift: 6 });
  f.bone('thigh_f');
  T.wisp(f, lp(HF, KF, 0.6, -50), 60, { w: 6, op: 0.25, drift: -12 });
  f.bone('root');
  f.flat(ell([320, gy + 2], 150, 8, 0, 16), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ PHYSIC OF THE WATERS (cast, human 1.0)
// The temple's physician, who examined the nobility and prescribed their soaks, and now takes the waters hourly himself.
// Upright and pompous, weight back on his heels, belly forward, chin up: the far arm raised high, elbow up beside his
// head, the forearm forward, pinching the neck of a glass urine flask that hangs below his fist against the light; its
// contents are boiling. He squints up at it through spectacles fogged white. The near hand is folded behind his back.
// Fire boiled his face and hands bright pink-white and his scalp peels in sheets round a velvet cap stuck flat to it;
// water swelled his lips and eyelids and left his fingers pruned. A short open physician's gown over a buttoned doublet
// and wet hose; the flask's wicker basket at his belt, a wax tablet and stylus, a leather lancet case, a sand-glass on a
// cord for timing soaks, a sponge, a bronze physician's ring, a list of prescriptions pinned to the gown, ink running.
// Rig: standard humanoid + flask (parent hand_f) + gown (back panel, parent torso) + skirt (gown skirt, parent pelvis) +
// kit (the belt hangings, parent pelvis). Motion: idle squinting at the flask and nodding (head, forearm_f); attack
// flinging the boiling flask (upperarm_f / forearm_f whip forward; the flask leaves the hand as an effect).
function physicOfTheWaters() {
  const seed = 326, h = TIERS.human[1];
  const f = new Fig(T.base(seed, h, { grimeY: 620 }));
  X.textures(f);
  const gy = f.o.groundY, H = 98;
  const skin = '#f0d0c4', skinS = '#7a4a56';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle' + seed, texOp: 0.45, maxShade: 18 }, o);
  const GOWN = (o = {}) => Object.assign({ fill: '#6a3a36', shadow: '#24100e', shade: 0.38, tex: 'weave' + seed, texOp: 0.4, maxShade: 46 }, o);
  const DBL = (o = {}) => Object.assign({ fill: '#cfc2b2', shadow: '#4e4246', shade: 0.36, tex: 'weave' + seed, texOp: 0.35, maxShade: 30 }, o);
  const HOSE = (o = {}) => Object.assign({ fill: '#8a7470', shadow: '#2e2226', shade: 0.36, tex: 'weave' + seed, texOp: 0.3, maxShade: 20 }, o);
  // leaning back on his heels: the pelvis forward of the shoulders, the belly the most forward thing on him
  const N = [302, 278], C = [342, 380], Pv = [314, 478];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.24, 0.12), SF = S.at(0.3, 0.06);
  const HN = [302, 490], KN = [306, 636], AN = [288, 752];
  const HF = [330, 486], KF = [352, 634], AF = [358, 752];
  const HC = [348, 210], hA = -0.6, neck0 = S.at(0.1, -0.04);
  // far arm up: the elbow high beside his head, the forearm forward, the fist pinching the flask's neck
  const EF = [364, 110], WF = [432, 98];
  const EN = [236, 400], WN = [272, 446]; // near hand folded behind the small of his back
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('flask', WF, 'hand_f').joint('gown', S.at(-0.3, 0.02), 'torso').joint('skirt', S.at(0, 0.84), 'pelvis').joint('kit', S.at(0.4, 0.86), 'pelvis');

  // ---- near forearm and hand, folded behind his back (behind the body)
  f.bone('forearm_n');
  f.part(limb(EN, WN, 40, 34), GOWN({ fill: '#5a302c' }));
  f.bone('hand_n');
  T.handBack(f, add(WN, [10, 2]), 0.3, 18, mix(skin, skinS, 0.2), { shadow: skinS, curl: 0.4, spread: 0.1 });
  // ---- the gown's back panel, hanging from the shoulders behind him to the knee
  f.bone('gown');
  const gb = [S.at(-0.3, -0.04), S.at(-0.72, 0.1), [228, 420], [214, 560], [206, 640, 1], [226, 630], [246, 648, 1], [268, 634], [288, 646, 1], [300, 560], S.at(-0.2, 0.7)];
  f.part(gb, GOWN());
  for (const [a, b] of [[[240, 360], [224, 500], [218, 636]], [[268, 380], [258, 520], [256, 640]]]) f.stroke([a, lerp(a, b, 0.5), b], 2.2, '#1a0a08');
  X.clothWear(f, gb, [210, 320, 300, 640], 4, { tide: 590, damp: '#1a0a0a' });
  // ---- far arm, raised behind the head: the gown's sleeve fallen back down to the shoulder
  T.armRig(f, SF, EF, WF, [40, 32, 28], SK({ fill: mix(skin, skinS, 0.12) }), '_f');
  f.bone('forearm_f');
  T.wrinkles(f, lp(EF, WF, 0.5), WF, 30, 4);
  f.bone('upperarm_f');
  f.part(K.chain([lp(SF, EF, -0.05), lp(SF, EF, 0.35), lp(SF, EF, 0.62)], [70, 66, 56]), GOWN({ fill: '#5e3430' })); // the sleeve, slid down the raised arm
  for (const t of [0.15, 0.3, 0.45]) f.stroke([lp(SF, EF, t, -30), lp(SF, EF, t + 0.05, 0), lp(SF, EF, t, 30)], 2, '#1a0a08');
  f.part(K.chain([lp(SF, EF, 0.55), lp(SF, EF, 0.66)], [62, 58]), DBL({ fill: '#c8baa8', cast: false })); // the doublet's shirt cuff showing past the sleeve
  // ---- legs in wet hose; soft physician's shoes
  for (const [Hp, Kn, A, sfx, dk] of [[HF, KF, AF, '_f', 0.18], [HN, KN, AN, '_n', 0]]) {
    T.legRig(f, Hp, Kn, A, 50, 70, 50, HOSE({ fill: mix('#8a7470', '#2e2226', dk) }), sfx, { thigh: 0.1, calf: 0.08 });
    f.bone('shin' + sfx);
    for (let i = 0; i < 4; i++) f.line([lp(Kn, A, 0.68 + i * 0.07, -22), lp(Kn, A, 0.7 + i * 0.07, 0), lp(Kn, A, 0.67 + i * 0.07, 22)], 1.2, INK, { op: 0.5 }); // wet hose bunched at the ankle
    f.line([lp(Kn, A, 0.05, -20), lp(Kn, A, 0.1, 0), lp(Kn, A, 0.04, 20)], 1.4, INK, { op: 0.5 });
    f.bone('foot' + sfx);
    B.boot(f, A, 1, 50, mix('#4a3226', '#000', dk), { tex: 'mottle' + seed, shaft: 0.25, toe: 1.25, style: 'shoe' });
    f.line([add(A, [-16, 4]), add(A, [18, -4])], 2, '#2a1a12');
  }
  f.bone('shin_n');
  f.flat(ell(lp(KN, AN, 0.4, -6), 10, 22, 0.1, 10), '#3a2a2a', { op: 0.3 }); // the hose soaked darker
  // ---- the gown's skirt (front edges) and the doublet
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.3, 0.32], [0.06, 0.5, 0.56], [0.2, 0.56, 0.74], [0.38, 0.5, 0.92], [0.56, 0.44, 1.04], [0.72, 0.48, 1.02], [0.86, 0.56, 0.86], [1.0, 0.6, 0.66]]);
  f.part(torso, DBL());
  f.line([S.at(0.36, 0.06), S.at(0.7, 0.3), S.at(0.96, 0.56), S.at(0.9, 0.8)], 1.6, INK, { op: 0.7 }); // the doublet's front edge over the belly
  for (let i = 0; i < 8; i++) { const q = S.at(0.62 + Math.sin(i / 7 * Math.PI) * 0.36, 0.16 + i * 0.085); f.part(ell(q, 4, 4, 0, 8), { fill: Q.bone, shadow: Q.boneD, shade: 0.4, inkW: 0.9, cast: false }); if (i === 5) f.line([add(q, [-3, -3]), add(q, [6, -8])], 1, INK, { op: 0.7 }); } // bone buttons, one straining
  for (const [a, b] of [[[0.86, 0.5], [0.6, 0.56]], [[0.92, 0.64], [0.66, 0.7]], [[0.8, 0.36], [0.6, 0.42]]]) f.stroke([S.at(...a), S.at(...b)], 1.8); // drag folds from the buttons over the belly
  X.clothWear(f, torso, [280, 300, 400, 470], 4, { damp: '#4e3a3a' });
  f.raw(`<path d="${E.smooth([S.at(0.2, 0.4), S.at(0.7, 0.3), S.at(0.9, 0.5), S.at(0.6, 0.66), S.at(0.24, 0.6)])}" fill="#5a3a3a" opacity="0.25" filter="url(#steamblur${seed})"/>`); // sweat soaked through
  f.part(S.shape([[0.0, -0.1, 0.34], [0.05, -0.12, 0.46], [0.1, -0.18, 0.5]]), SK({ cast: false })); // the fat neck rising from the collar
  f.part([S.at(-0.3, -0.06), S.at(0.4, -0.06), S.at(0.46, 0.06), S.at(-0.34, 0.08)], DBL({ fill: '#e2d8c8', cast: false })); // the shirt collar
  f.bone('skirt');
  const gs = [S.at(-0.66, 0.84), S.at(0.0, 0.86), S.at(0.5, 0.9), [372, 560], [366, 630, 1], [346, 622], [326, 636, 1], [306, 620], [290, 632, 1], [270, 600], [262, 520]];
  f.part(gs, GOWN());
  f.stroke([[330, 520], [340, 580], [334, 626]], 2.2, '#1a0a08'); f.stroke([[296, 510], [290, 600]], 2, '#1a0a08');
  X.clothWear(f, gs, [266, 500, 370, 630], 3, { tide: 600, damp: '#1a0a0a' });
  // the gown's near front edge, falling down past the belly
  f.bone('torso');
  const gf = [S.at(-0.36, -0.04), S.at(0.06, -0.04), S.at(0.3, 0.2), S.at(0.5, 0.5), S.at(0.6, 0.84), S.at(0.3, 0.86), S.at(0.0, 0.6), S.at(-0.3, 0.3)];
  f.part(gf, GOWN());
  f.part([S.at(0.06, -0.04), S.at(0.16, -0.02), S.at(0.4, 0.24), S.at(0.6, 0.6), S.at(0.66, 0.84), S.at(0.6, 0.84), S.at(0.5, 0.5), S.at(0.3, 0.2)], GOWN({ fill: '#8a5a4a', cast: false, inkW: 1.1 })); // the facing turned back along the edge
  f.stroke([S.at(-0.1, 0.2), S.at(0.1, 0.5), S.at(0.2, 0.8)], 2, '#1a0a08');
  // the list of prescriptions pinned to the gown, the ink running in the steam
  { const lc = S.at(0.24, 0.42), F2 = frame(lc, 0.12, 1);
    f.part(F2([[-16, -24], [16, -26], [18, 22], [6, 28], [-14, 24]]), { fill: '#e8dcc4', shadow: '#7a6a5a', shade: 0.3, inkW: 1.1, cast: true, castOp: 0.3, hatch: false });
    for (let i = 0; i < 6; i++) { f.line(F2([[-12, -18 + i * 7], [10 - (i % 3) * 4, -18 + i * 7]]), 1, '#3a2a40', { op: 0.75 }); if (i % 2) f.line(F2([[-6 + i * 2, -18 + i * 7], [-5 + i * 2, -6 + i * 7]]), 0.9, '#3a2a40', { op: 0.4 }); } // ink lines, runs
    f.part(F2(ell([0, -24], 3, 3, 0, 8)), { fill: P.iron, shade: 0.3, inkW: 0.8, cast: false }); }
  // ---- the belt, and what hangs from it
  f.bone('pelvis');
  f.part([S.at(-0.62, 0.8), S.at(0.0, 0.82), S.at(0.62, 0.86), S.at(0.62, 0.92), S.at(0.0, 0.9), S.at(-0.64, 0.88)], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5 });
  f.part([S.at(0.3, 0.82), S.at(0.44, 0.83), S.at(0.44, 0.92), S.at(0.3, 0.91)], { fill: P.bronze, shadow: P.bronzeD, shade: 0.4, inkW: 1.1, sharp: true });
  f.bone('kit');
  { // the flask's wicker carrying basket: a tall cylinder with a lid, on a strap, woven
    const bk = add(S.at(-0.3, 0.9), [-4, 6]);
    f.line([S.at(-0.2, 0.86), add(bk, [8, -6])], 2.2, P.leatherD);
    f.part([add(bk, [-16, 0]), add(bk, [16, 0]), add(bk, [18, 70]), add(bk, [10, 80]), add(bk, [-10, 80]), add(bk, [-18, 70])], { fill: '#a88a5a', shadow: '#3a2a14', shade: 0.4, inkW: 1.2 });
    for (let i = 0; i < 8; i++) f.line([add(bk, [-17, 6 + i * 9]), add(bk, [17, 4 + i * 9])], 1.2, '#4a3418', { op: 0.75 });
    for (let i = 0; i < 4; i++) f.line([add(bk, [-12 + i * 8, 2]), add(bk, [-12 + i * 8, 78])], 1, '#e0c890', { op: 0.4 });
    f.part([add(bk, [-18, -8]), add(bk, [18, -8]), add(bk, [18, 4]), add(bk, [-18, 4])], { fill: '#8a6a3e', shade: 0.4, inkW: 1.1, cast: false, sharp: true }); }
  { // the wax tablet and stylus on a cord
    const wt = S.at(0.1, 0.92);
    f.line([wt, add(wt, [2, 30])], 1.4, '#3a2a20');
    f.part([add(wt, [-14, 30]), add(wt, [18, 28]), add(wt, [20, 70]), add(wt, [-12, 72])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.2, sharp: true });
    f.part([add(wt, [-9, 35]), add(wt, [14, 34]), add(wt, [15, 64]), add(wt, [-7, 66])], { fill: '#3a2c1c', shade: 0.3, inkW: 0.8, cast: false, sharp: true });
    for (let i = 0; i < 3; i++) f.line([add(wt, [-4, 42 + i * 8]), add(wt, [10, 41 + i * 8])], 0.9, '#8a7050', { op: 0.8 });
    f.line([add(wt, [20, 34]), add(wt, [30, 80])], 2.2, Q.bone); }
  { // the lancet case: a slim tooled leather case with a flap
    const lc = S.at(0.46, 0.94);
    f.part([add(lc, [-6, 0]), add(lc, [8, 0]), add(lc, [12, 56]), add(lc, [0, 62]), add(lc, [-6, 56])], { fill: P.leatherL, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.1 });
    f.stitches([add(lc, [-3, 6]), add(lc, [0, 54])], '#c8a878', 0.8); f.line([add(lc, [-6, 14]), add(lc, [9, 14])], 1.2, P.leatherD); }
  { // the sand-glass on a cord for timing soaks, and a sponge
    const sg = add(S.at(-0.5, 0.9), [0, 4]);
    f.line([sg, add(sg, [2, 34])], 1.4, '#3a2a20');
    const g0 = add(sg, [2, 40]);
    for (const dy of [0, 44]) f.part([add(g0, [-12, dy - 3]), add(g0, [12, dy - 3]), add(g0, [12, dy + 3]), add(g0, [-12, dy + 3])], { fill: P.wood, shadow: P.woodD, shade: 0.4, inkW: 1, cast: false, sharp: true });
    X.glassPart(f, [add(g0, [-9, 3]), add(g0, [9, 3]), add(g0, [2, 22]), add(g0, [9, 41]), add(g0, [-9, 41]), add(g0, [-2, 22])], { op: 0.7 });
    f.flat([add(g0, [-6, 34]), add(g0, [6, 34]), add(g0, [8, 40]), add(g0, [-8, 40])], '#c8b090'); f.line([add(g0, [0, 22]), add(g0, [0, 34])], 1, '#c8b090');
    f.line([add(g0, [-11, 4]), add(g0, [-11, 40])], 1.2, P.wood); f.line([add(g0, [11, 4]), add(g0, [11, 40])], 1.2, P.wood);
    const sp = add(S.at(-0.66, 0.9), [-2, 30]);
    f.part(T.lumpy(f, ell(sp, 14, 16, 0, 12), 4), { fill: '#c8a868', shadow: '#5a4020', shade: 0.4, tex: 'pores' + seed, texOp: 0.8, inkW: 1.1 });
    T.drip(f, add(sp, [0, 16]), 0.8); }

  // ---- head: fleshy, satisfied, tipped back to squint up at the flask through fogged spectacles
  f.bone('head');
  f.part(K.chain([add(neck0, [-4, 14]), add(HC, [-18, 40])], [64, 54]), SK());
  f.stroke([add(neck0, [12, 8]), add(HC, [16, 44])], 2.2, '#8a5a60', { op: 0.5 }); // the double chin's fold
  const hF = X.face(f, HC, H, hA, { skin, jaw: 1.24, chin: -0.02, nose: 1.1, hook: -0.1, mouth: 'smirk', squint: 0.7, browDown: -0.02, age: true, lips: true, iris: '#2a1a18', eyeWhite: '#e8d8d0', hairCol: '#6a5a50', browCol: '#7a6a60', browW: 0.04 });
  f.flat(hF([[0.17, 0.27], [0.25, 0.26], [0.32, 0.25], [0.33, 0.3], [0.25, 0.33], [0.18, 0.32]]), '#c46a66', { op: 0.75 }); // swollen boiled lips
  f.line(hF([[0.19, 0.31], [0.3, 0.3]]), 1.4, '#fff0ea', { op: 0.5 });
  f.part(hF([[0.04, -0.11], [0.12, -0.13], [0.19, -0.11], [0.18, -0.06], [0.11, -0.05], [0.05, -0.07]]), SK({ fill: '#ecbcb0', cast: false, inkW: 1, maxShade: 3 })); // the swollen upper lid
  f.line(hF([[0.02, 0.3], [0.1, 0.42], [0.04, 0.54]]), 2, '#8a5058', { op: 0.5 }); f.line(hF([[0.06, 0.56], [0.2, 0.6], [0.3, 0.56]]), 1.6, '#8a5058', { op: 0.45 }); // the jowl's fold and the double chin
  f.raw(`<path d="${E.smooth(hF(T.lumpy(f, ell([0.12, 0.14], 0.1, 0.06, 0.2, 10), 0.01)))}" fill="#e0707a" opacity="0.3" filter="url(#steamblur${seed})"/>`); // boiled flush
  T.beads(f, hF([[0.1, -0.24]])[0], 18, 6, 4, 1);
  // the velvet cap, soaked and stuck flat to the skull; the scalp round it peeling in sheets
  f.part(hF([[0.24, -0.4], [0.06, -0.54], [-0.22, -0.56], [-0.46, -0.4], [-0.5, -0.16], [-0.36, -0.12], [-0.14, -0.3], [0.1, -0.34]]), { fill: Q.velvet, shadow: Q.velvetD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.55 });
  f.line(hF([[0.2, -0.4], [-0.1, -0.44], [-0.4, -0.32]]), 1.6, Q.velvetL, { op: 0.6 }); f.line(hF([[0.0, -0.5], [-0.2, -0.36]]), 1.2, Q.velvetD, { op: 0.8 });
  T.peelSheet(f, hF([[-0.4, -0.08]])[0], 20, 40, { sway: -2 });
  T.peelSheet(f, hF([[0.18, -0.34]])[0], 14, 18, { bed: false, sway: 3 });
  for (const [x, y, l] of [[-0.44, -0.12, 0.18], [-0.38, -0.12, 0.2], [-0.3, -0.14, 0.14]]) f.stroke([hF([[x, y]])[0], hF([[x - 0.02, y + l * 0.6]])[0], hF([[x + 0.01, y + l]])[0]], 3, '#a89c94'); // a few wet grey hairs below the cap
  // the spectacles: two rimmed lenses on a riveted bridge, fogged white with condensation
  { const e1 = hF([[0.13, -0.07]])[0], e2 = hF([[0.31, -0.07]])[0];
    f.part(ell(e1, 13, 11, hA, 14), { fill: '#eef0ee', shade: 0.2, hatch: false, cast: false, inkW: 0, opacity: 0.82 });
    f.line(ell(e1, 13, 11, hA, 14).concat([ell(e1, 13, 11, hA, 14)[0]]), 3, '#3a2a1e');
    f.part(ell(e2, 6, 10, hA, 12), { fill: '#eef0ee', shade: 0.2, hatch: false, cast: false, inkW: 0, opacity: 0.8 });
    f.line(ell(e2, 6, 10, hA, 12).concat([ell(e2, 6, 10, hA, 12)[0]]), 2.4, '#3a2a1e');
    f.line([add(e1, rot([12, -4], hA)), hF([[0.24, -0.12]])[0], add(e2, rot([-5, -4], hA))], 2.4, '#3a2a1e');
    f.rivet(hF([[0.24, -0.12]])[0], 2, P.bronzeL);
    for (const [dx, dy] of [[-4, 3], [5, -2], [1, 6]]) f.flat(ell(add(e1, [dx, dy]), 1.4, 1.6, 0, 6), '#c8d0d0', { op: 0.9 }); // beads of condensation
    f.line([add(e1, rot([-8, -6], hA)), add(e1, rot([-2, -8], hA))], 1.6, '#fff', { op: 0.8 }); }
  // steam rising from his collar
  f.bone('torso');
  T.wisp(f, S.at(0.0, -0.06), 80, { w: 7, op: 0.32, drift: -14 });
  T.wisp(f, S.at(-0.3, 0.0), 60, { w: 6, op: 0.26, drift: 8 });

  // ---- the flask: a round-bellied glass urinal hanging from his pinched fingers by its neck, boiling
  f.bone('flask');
  const fn0 = add(WF, [4, -26]), fb = add(WF, [8, 64]); // neck top, bulb centre
  X.glassPart(f, [add(fn0, [-6, 0]), add(fn0, [6, 0]), add(fn0, [7, 52]), add(fb, [26, -16]), add(fb, [34, 6]), add(fb, [26, 30]), add(fb, [0, 40]), add(fb, [-26, 30]), add(fb, [-34, 6]), add(fb, [-26, -16]), add(fn0, [-7, 52])], { op: 0.7 });
  f.flat([add(fb, [-31, 4]), add(fb, [31, 0]), add(fb, [26, 28]), add(fb, [0, 38]), add(fb, [-26, 28])], Q.urine, { op: 0.75 }); // the boiling contents
  f.line([add(fb, [-31, 4]), add(fb, [31, 0])], 1.4, '#f0e0a0', { op: 0.8 }); // the surface, level
  for (const [dx, dy, r] of [[-12, 14, 4], [6, 20, 3], [16, 8, 2.4], [-2, 28, 2], [-20, 22, 2.4], [10, 30, 1.6]]) { f.flat(ell(add(fb, [dx, dy]), r, r, 0, 8), '#f8eed0', { op: 0.8 }); f.line(ell(add(fb, [dx, dy]), r, r, 0, 8).slice(4, 8), 0.7, '#7a6020', { op: 0.6 }); } // boiling bubbles
  f.line([add(fb, [16, -14]), add(fb, [28, 4]), add(fb, [22, 22])], 2.4, '#fff', { op: 0.8 }); // the glass's lit sheen (light behind it)
  f.line([add(fn0, [3, 4]), add(fn0, [4, 40])], 1.2, '#fff', { op: 0.7 });
  f.part([add(fn0, [-8, -6]), add(fn0, [8, -6]), add(fn0, [8, 2]), add(fn0, [-8, 2])], { fill: Q.glass, shadow: Q.glassD, shade: 0.3, inkW: 1, cast: false, hatch: false }); // the rolled lip
  T.steam(f, add(fn0, [0, -8]), 110, 10, { drift: -30, op: 0.5, grow: 2, n: 5, curls: 2 });
  // ---- the raised fist pinching the neck, the bronze physician's ring
  f.bone('hand_f');
  const g = X.gripK(f, WF, EF, -Math.PI / 2, 22, skin, { tex: 'pruned' + seed, texOp: 0.6, shadow: skinS, name: 'physic flask' });
  X.silverRing(f, g.F([[0.5, 0.2]])[0], g.ang, 10);
  f.part(ell(g.F([[0.5, 0.2]])[0], 4, 3, g.ang, 8), { fill: P.bronze, shadow: P.bronzeD, shade: 0.4, inkW: 0.8, cast: false }); // the ring's bronze bezel

  // ---- near upper arm, folded back to the hand behind him: gown sleeve hanging wide
  f.bone('upperarm_n');
  f.part(K.chain([add(SN, [4, -8]), lerp(SN, EN, 0.5), add(EN, [-4, 6])], [58, 54, 46]), GOWN({ fill: '#62362f' }));
  const sl = [lerp(SN, EN, 0.4), add(EN, [-8, 10]), add(EN, [-14, 70]), add(EN, [0, 96], 1), add(EN, [16, 84]), add(EN, [30, 92], 1), add(EN, [36, 40]), add(EN, [24, 10])];
  f.part(sl, GOWN());
  f.stroke([add(EN, [0, 16]), add(EN, [8, 80])], 2, '#1a0a08'); f.flat([add(EN, [10, 60]), add(EN, [30, 54]), add(EN, [32, 88]), add(EN, [18, 84])], '#1a0a08', { op: 0.5 });
  f.bone('root');
  f.flat(ell([320, gy + 2], 130, 8, 0, 16), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ LUSTRAL PRIEST (cast, human 1.05)
// A priest of the temple who sprinkled every bather with consecrated water as they went down into the pools. Striding,
// the weight on the front foot, the near arm flung out ahead mid-sprinkle with the aspergillum in his fist, its pierced
// ball dripping and steaming; a bronze bucket of steaming holy water hanging by its bail from the far hand behind him.
// Lean, bare-chested: fire blistered the sprinkling arm and the chest where the water splashes back, burst the blisters
// and peeled them in sheets, cooked the arm red to the shoulder; water swelled his hands and feet. Eyes squeezed shut in
// devotion, the mouth open in a chant, the head shaved. A wet linen kilt to the knee belted with cord; a linen stole
// embroidered with waves in gold thread (holy); the gilded aspergillum (holy); prayer beads wound round the far wrist; a
// small marble prayer tablet at the belt; leather sandals with curling soles; a temple seal ring; a burn bandage on the
// near forearm. Steam lifts off his shoulders.
// Rig: standard humanoid + aspergillum (parent hand_n) + bucket (parent hand_f) + stole (parent torso) + skirt (kilt,
// parent pelvis) + tablet (parent pelvis). Motion: idle dipping the aspergillum and shaking it out (near arm down to the
// bucket and back; IK not needed, the bucket hangs from the far hand); attack a sweeping sprinkle across a rank.
function lustralPriest() {
  const seed = 327, h = TIERS.human[1];
  const f = new Fig(T.base(seed, h, { grimeY: 630 }));
  X.textures(f);
  const gy = f.o.groundY, H = 102;
  const skin = '#e8c4b4', skinS = '#6a3a44', red = '#c45a46', redS = '#4e1a1e';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle' + seed, texOp: 0.45, maxShade: 18 }, o);
  const RD = (o = {}) => Object.assign({ fill: red, shadow: redS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5, maxShade: 16 }, o);
  const N = [318, 262], C = [302, 360], Pv = [282, 462];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(0.02, 0.1), SF = S.at(0.36, 0.08);
  const HN = [292, 474], KN = [356, 612], AN = [348, 748];   // the near leg forward, bent, carrying him
  const HF = [270, 470], KF = [226, 612], AF = [178, 748];   // the far leg back, pushing off
  const EN = [426, 288], WN = [492, 228];                    // the sprinkling arm flung out ahead and up
  const EF = [244, 372], WF = [222, 452];                    // the far arm down and back, the bucket hanging behind him
  const HC = [354, 196], hA = -0.14, neck0 = S.at(0.1, -0.04);
  const aT = [566, 150], aA = ang(WN, aT);                   // the aspergillum: fist to the ball
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('aspergillum', WN, 'hand_n').joint('bucket', WF, 'hand_f').joint('stole', S.at(0.1, 0.0), 'torso').joint('skirt', S.at(0, 0.86), 'pelvis').joint('tablet', S.at(-0.3, 0.9), 'pelvis');
  const sandal = (A, s, dk) => { // a sandal whose sole has dried and curled up at the toe, straps sunk in the swollen foot
    const sole = [[A[0] - s * 0.46, gy - 1], [A[0] + s * 0.9, gy - 2], [A[0] + s * 1.24, gy - 10], [A[0] + s * 1.3, gy - 18], [A[0] + s * 1.2, gy - 8], [A[0] + s * 0.9, gy + 3, 1], [A[0] - s * 0.5, gy + 4, 1]];
    f.part(sole, { fill: mix(P.leather, '#000', dk), shadow: P.leatherD, shade: 0.4, inkW: 1.2, cast: false });
    for (const [u0, v0, u1, v1] of [[0.0, -0.5, 0.5, -0.1], [0.5, -0.5, 0.1, -0.05], [0.7, -0.24, 0.96, -0.12]]) { const a = [A[0] + s * u0, gy + s * v0], b = [A[0] + s * u1, gy + s * v1]; f.stroke([a, b], 5, mix(P.leatherL, '#000', dk)); f.line([a, b], 1, skin, { op: 0.4 }); }
  };

  // ---- the far leg, back, pushing off
  T.legRig(f, HF, KF, AF, 52, 64, 46, SK({ fill: mix(skin, skinS, 0.2) }), '_f', { thigh: 0.08, swell: 0.4 });
  T.legDetail(f, HF, KF, AF, 46, SK({ fill: mix(skin, skinS, 0.2) }), '_f', { calf: 0.1 });
  f.bone('foot_f'); sandal(AF, 52, 0.2);
  // ---- the bucket, hanging from the far fist by its bail behind his hip, steaming
  f.bone('bucket');
  const bt = add(WF, [0, 34]), bw = 90, bh = 96; // top centre of the rim
  f.line([add(bt, [-bw * 0.5, 6]), add(WF, [0, -6]), add(bt, [bw * 0.5, 6])], 6, INK); f.line([add(bt, [-bw * 0.5, 6]), add(WF, [0, -6]), add(bt, [bw * 0.5, 6])], 3.6, P.bronze); // the bail
  const bk = [add(bt, [-bw * 0.5, 0]), add(bt, [bw * 0.5, 0]), add(bt, [bw * 0.42, bh * 0.6]), add(bt, [bw * 0.32, bh]), add(bt, [-bw * 0.32, bh]), add(bt, [-bw * 0.42, bh * 0.6])];
  f.part(bk, { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, tex: 'hammer' + seed, texOp: 0.6 });
  for (const v of [0.18, 0.72]) f.line([add(bt, [-bw * (0.48 - v * 0.14), bh * v]), add(bt, [0, bh * v + 4]), add(bt, [bw * (0.48 - v * 0.14), bh * v])], 3, P.bronzeD, { op: 0.8 }); // bands
  for (let i = 0; i < 7; i++) { const x = -bw * 0.38 + i * bw * 0.127; f.line([add(bt, [x, bh * 0.3]), add(bt, [x + 4, bh * 0.4]), add(bt, [x, bh * 0.5])], 1.4, P.bronzeD, { op: 0.6 }); } // a running wave chased round it
  T.verdigris(f, add(bt, [-10, bh * 0.7]), 30, 14, 5); T.dents(f, add(bt, [10, bh * 0.5]), 20, 14, 2);
  f.part(ell(bt, bw * 0.5, 9, 0, 16), { fill: P.bronzeL, shadow: P.bronzeD, shade: 0.4, inkW: 1.2, cast: false });
  f.flat(ell(add(bt, [0, 1]), bw * 0.44, 6, 0, 16), '#4a3a36'); f.flat(ell(add(bt, [6, 0]), bw * 0.2, 2.4, 0, 10), '#8a7a74', { op: 0.6 }); // the dark water, boiling
  for (const x of [-26, 30]) { f.part(ell(add(bt, [x, -6]), 8, 7, 0, 10), { fill: P.bronze, shade: 0.4, inkW: 1, cast: false }); } // bail lugs
  f.stroke([add(bt, [bw * 0.36, 4]), add(bt, [bw * 0.4, bh * 0.4]), add(bt, [bw * 0.34, bh * 0.8])], 4, P.water, { op: 0.5 }); T.drip(f, add(bt, [bw * 0.3, bh + 4]), 1);
  T.steam(f, add(bt, [0, -4]), 170, 26, { drift: -36, op: 0.55, grow: 1.4, n: 6, curls: 2 });
  // ---- far arm: hanging down and back to the bail; prayer beads round the wrist
  T.armRig(f, SF, EF, WF, [40, 32, 28], SK({ fill: mix(skin, skinS, 0.16) }), '_f');
  f.bone('forearm_f');
  for (let i = 0; i < 9; i++) { const t = 0.72 + (i % 3) * 0.08, sd = i < 3 ? -1 : i < 6 ? 0.2 : 1; f.flat(ell(lp(EF, WF, t, sd * 12), 3.4, 3.4, 0, 6), '#4a3a30'); f.flat(ell(add(lp(EF, WF, t, sd * 12), [-1, -1]), 1.2, 1.2, 0, 5), '#c8b8a0', { op: 0.7 }); } // prayer beads
  T.wrinkles(f, lp(EF, WF, 0.6), WF, 26, 3);
  f.bone('hand_f');
  X.gripK(f, WF, EF, 0, 24, mix(skin, skinS, 0.16), { tex: 'pruned' + seed, texOp: 0.55, shadow: skinS, name: 'priest bucket' });

  // ---- near leg forward: swollen foot in a curling sandal
  T.legRig(f, HN, KN, AN, 54, 66, 48, SK(), '_n', { thigh: 0.08, swell: 0.5 });
  T.legDetail(f, HN, KN, AN, 48, SK(), '_n', { calf: 0.1 });
  f.bone('foot_n'); sandal(AN, 54, 0);
  f.bone('shin_n'); T.scald(f, lp(KN, AN, 0.4), 12, 30, 5, { pink: P.poachD });
  // ---- the kilt: wet linen to the knee, pulled by the stride
  f.bone('skirt');
  const kt = [S.at(-0.6, 0.84), S.at(0.62, 0.82), [356, 520], [384, 590], [372, 604, 1], [350, 596], [330, 610, 1], [306, 598], [280, 612, 1], [256, 598], [232, 608, 1], [212, 590], [226, 520]];
  f.part(kt, T.LIN(f, { fill: '#d6cfc2', maxShade: 26 }));
  for (const [a, b, c] of [[[300, 500], [320, 556], [330, 604]], [[264, 506], [254, 560], [252, 604]], [[332, 500], [356, 560], [370, 600]], [[284, 510], [286, 600]]]) f.stroke([a, b, c || b], 1.8);
  X.clothWear(f, kt, [220, 490, 380, 610], 4, { tide: 570 });
  // ---- torso: lean, bare, ribs and the breastbone showing; the chest blistered and peeling where the water splashes back
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.28, 0.3], [0.06, 0.48, 0.52], [0.2, 0.52, 0.66], [0.36, 0.48, 0.64], [0.52, 0.42, 0.54], [0.7, 0.44, 0.48], [0.86, 0.5, 0.52], [1.0, 0.54, 0.56]]);
  f.part(torso, SK());
  f.stroke([S.at(0.1, 0.12), S.at(0.4, 0.2), S.at(0.6, 0.18)], 2, '#7a4450', { op: 0.5 }); // the pectoral's lower edge
  for (let i = 0; i < 5; i++) f.stroke([S.at(-0.1 + i * 0.04, 0.3 + i * 0.07), S.at(0.24 + i * 0.03, 0.34 + i * 0.07), S.at(0.5, 0.3 + i * 0.07)], 1.6, '#7a4450', { op: 0.5 }); // ribs
  f.line([S.at(0.5, 0.06), S.at(0.56, 0.3), S.at(0.5, 0.5)], 1.4, '#7a4450', { op: 0.5 }); // the breastbone
  f.stroke([S.at(0.3, 0.62), S.at(0.4, 0.72), S.at(0.36, 0.82)], 1.6, '#7a4450', { op: 0.4 }); // the hollow belly
  f.raw(`<path d="${E.smooth([S.at(0.0, 0.06), S.at(0.6, 0.1), S.at(0.66, 0.36), S.at(0.2, 0.46), S.at(-0.1, 0.3)])}" fill="${red}" opacity="0.45" filter="url(#steamblur${seed})"/>`); // the scalded chest
  T.blisters(f, S.at(0.3, 0.24), 30, 22, 9, 3, 6.5, { burst: 0.45 });
  T.peelSheet(f, S.at(0.4, 0.34), 22, 50, { sway: 3 });
  T.peelSheet(f, S.at(0.0, 0.3), 18, 40, { sway: -2 });
  T.scald(f, S.at(0.2, 0.5), 40, 30, 8);
  T.beads(f, S.at(0.0, 0.6), 30, 20, 5, 1);
  // ---- the belt cord and the marble prayer tablet
  f.bone('pelvis');
  T.rope(f, [S.at(-0.62, 0.8), S.at(0.0, 0.83), S.at(0.62, 0.8)], 7, '#b8a888');
  T.rope(f, [S.at(0.3, 0.84), add(S.at(0.3, 0.84), [6, 40]), add(S.at(0.3, 0.84), [4, 70])], 5, '#b8a888', { fray: true });
  f.bone('tablet');
  { const tb = add(S.at(-0.3, 0.9), [0, 26]); f.line([S.at(-0.3, 0.86), tb], 1.4, '#3a2a20');
    f.part([add(tb, [-14, 0]), add(tb, [14, -2]), add(tb, [16, 34]), add(tb, [-12, 36])], T.MAR(f, { inkW: 1.2, sharp: true }));
    for (let i = 0; i < 3; i++) f.line([add(tb, [-8, 9 + i * 8]), add(tb, [8, 8 + i * 8])], 1, P.marbleS, { op: 0.8 }); f.flat([add(tb, [10, 30]), add(tb, [16, 26]), add(tb, [16, 34])], P.marbleS, { op: 0.6 }); }
  // ---- head: shaved, ascetic, eyes squeezed shut, mouth open on the chant
  f.bone('head');
  f.part(K.chain([add(neck0, [-6, 12]), add(HC, [-18, 38])], [52, 44]), SK());
  f.line([add(neck0, [14, 4]), add(HC, [8, 46])], 1.6, '#7a4450', { op: 0.55 }); // the neck's cord, strained by the chant
  const hF = X.face(f, HC, H, hA, { skin, jaw: 0.96, chin: 0.03, nose: 1.08, hook: 0.5, mouth: 'set', blind: true, gaunt: true, age: true, browDown: 0.08, lips: true, hairCol: '#4a3a34', browCol: '#4a3a34', browW: 0.04 });
  for (const [x, w] of [[0.11, 0.06], [0.29, 0.028]]) { f.stroke(hF([[x - w, -0.06], [x, -0.05], [x + w, -0.062]]), 2.6, INK); for (let i = 0; i < 3; i++) f.line(hF([[x + w * (0.4 + i * 0.3), -0.07 - i * 0.012], [x + w * (0.9 + i * 0.35), -0.09 - i * 0.02]]), 1, INK, { op: 0.6 }); } // squeezed shut, crow's feet
  f.flat(hF([[0.18, 0.27], [0.26, 0.26], [0.32, 0.27], [0.3, 0.38], [0.22, 0.39]]), '#3a1014'); f.flat(hF([[0.2, 0.27], [0.3, 0.27], [0.29, 0.29], [0.21, 0.29]]), '#e0d0c0', { op: 0.8 }); // open mouth, upper teeth
  f.part(hF([[0.22, -0.42], [0.02, -0.54], [-0.24, -0.54], [-0.44, -0.36], [-0.46, -0.1], [-0.36, -0.1], [-0.2, -0.3], [0.04, -0.4]]), SK({ fill: mix(skin, '#8a7a7a', 0.15), cast: false, inkW: 0, tex: 'grit' + seed, texOp: 0.6 })); // the shaved scalp's stubble shadow
  T.blisters(f, hF([[-0.1, -0.4]])[0], 16, 8, 3, 2.5, 4.5);
  T.beads(f, hF([[0.1, -0.24]])[0], 18, 6, 4, 1);
  // ---- the stole: linen, round the neck and down the chest, its ends hanging plumb, embroidered with waves in gold thread
  f.bone('stole');
  const stoleBand = (pts, w) => { f.part(K.chain(pts, pts.map(() => w)), T.LIN(f, { fill: '#e6e0d4', maxShade: 8 })); for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; for (let k = 0; k < 2; k++) { const c = lerp(a, b, 0.25 + k * 0.5), d = E.norm(sub(b, a)), n = [-d[1], d[0]]; f.line([add(c, mul(n, -w * 0.3)), add(add(c, mul(d, 5)), mul(n, -w * 0.05)), add(c, mul(n, w * 0.1)), add(add(c, mul(d, -4)), mul(n, w * 0.3))], 1.4, P.gold, { op: 0.9 }); } } f.line(pts.map((q, i) => i ? q : add(q, [0, 0])), 0.8, P.goldD, { op: 0.6, dash: '3 3' }); };
  stoleBand([S.at(-0.3, -0.06), S.at(0.1, 0.02), S.at(0.34, 0.12), add(S.at(0.4, 0.5), [4, 0]), add(S.at(0.44, 0.9), [6, 12])], 22);
  stoleBand([S.at(0.36, -0.02), S.at(0.58, 0.1), add(S.at(0.62, 0.5), [6, 0]), add(S.at(0.66, 0.86), [10, 10])], 18);
  for (const e of [add(S.at(0.44, 0.9), [6, 12]), add(S.at(0.66, 0.86), [10, 10])]) { for (let i = 0; i < 5; i++) f.line([add(e, [-8 + i * 4, 6]), add(e, [-8 + i * 4, 18])], 1.2, '#d8d0c2'); f.line([add(e, [-10, 6]), add(e, [10, 6])], 1.6, P.gold); } // fringed ends, a gold band
  T.drip(f, add(S.at(0.44, 0.9), [6, 32]), 0.9);

  // ---- the aspergillum: a gilded bronze rod with a pierced ball head, dripping, steaming (holy: gold)
  f.bone('aspergillum');
  const aB = add(WN, rot([-30, 0], aA)), aN = add(aT, rot([-18, 0], aA));
  f.part(limb(aB, aN, 10, 8, { steps: 8 }), { fill: P.gold, shadow: P.goldD, shade: 0.42, inkW: 1.2, tex: 'mottle' + seed, texOp: 0.3 });
  f.line([lp(aB, aN, 0.05, -2), lp(aB, aN, 0.95, -2)], 1.2, P.goldL, { op: 0.8 });
  for (const t of [0.25, 0.55, 0.8]) f.part(ell(lerp(aB, aN, t), 6, 7, aA, 10), { fill: P.gold, shadow: P.goldD, shade: 0.4, inkW: 1, cast: false }); // knops
  f.part(ell(aB, 8, 8, 0, 10), { fill: P.gold, shadow: P.goldD, shade: 0.4, inkW: 1.1, cast: false }); // the pommel
  f.part(ell(aT, 20, 20, 0, 16), { fill: P.gold, shadow: P.goldD, shade: 0.45, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.3 });
  for (let i = 0; i < 8; i++) { const a2 = i * 0.8, q = add(aT, [Math.cos(a2) * 11 * (i % 2 ? 0.6 : 1), Math.sin(a2) * 11 * (i % 2 ? 0.6 : 1)]); f.flat(ell(q, 2.6, 2.6, 0, 6), '#2a1a08'); } // pierced holes
  f.flat(ell(add(aT, [6, -7]), 5, 3, -0.5, 8), P.goldL, { op: 0.9 });
  T.verdigris(f, add(aT, [-6, 8]), 6, 4, 2);
  for (const [dx, l] of [[-8, 14], [4, 22], [12, 10]]) { f.stroke([add(aT, [dx, 16]), add(aT, [dx, 16 + l])], 2.4, P.water, { op: 0.7 }); T.drip(f, add(aT, [dx, 18 + l]), 0.8); } // holy water dripping from the holes
  T.steam(f, add(aT, [0, -18]), 90, 12, { drift: -20, op: 0.5, grow: 1.8, n: 5, curls: 1 });
  // ---- near arm flung out ahead: cooked red to the shoulder, burst and peeling, a burn bandage on the forearm
  X.muscleArm(f, SN, EN, WN, 42, 36, RD(), '_n', { lit: '#e8967a', dark: '#3a0e10' });
  f.bone('upperarm_n');
  T.blisters(f, lp(SN, EN, 0.5, -6), 30, 10, 6, 3, 6, { burst: 0.5, col: '#f4c8b8', shadow: '#a05040' });
  T.peelSheet(f, lp(SN, EN, 0.45, 18), 20, 46, { sway: -2, col: '#f0d8cc', bedCol: '#a8342a' });
  f.bone('forearm_n');
  T.peelSheet(f, lp(EN, WN, 0.2, 16), 16, 34, { sway: 2, col: '#f0d8cc', bedCol: '#a8342a' });
  for (let i = 0; i < 4; i++) { const t = 0.45 + i * 0.08; f.stroke([lp(EN, WN, t, -20), lp(EN, WN, t + 0.04, 0), lp(EN, WN, t, 20)], 7, INK); f.stroke([lp(EN, WN, t, -20), lp(EN, WN, t + 0.04, 0), lp(EN, WN, t, 20)], 5.4, i % 2 ? '#d8d0c0' : '#c8bca8'); } // the burn bandage
  f.flat(ell(lp(EN, WN, 0.6, -6), 6, 4, 0, 8), '#a86a50', { op: 0.5 }); // seeping through
  f.bone('torso');
  T.wisp(f, S.at(-0.4, 0.04), 80, { w: 7, op: 0.32, drift: -12 });
  T.wisp(f, S.at(0.2, -0.04), 60, { w: 6, op: 0.26, drift: 10 });
  f.bone('hand_n');
  const g = X.gripK(f, WN, EN, aA, 25, red, { tex: 'pruned' + seed, texOp: 0.55, shadow: redS, inline: true, name: 'priest aspergillum' });
  X.silverRing(f, g.F([[0.5, -0.1]])[0], g.ang + 1.57, 8, { signet: true }); // the temple seal ring
  f.bone('root');
  f.flat(ell([280, gy + 2], 170, 8, 0, 16), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ LAPDOG (cast, small 0.35)
// A countess's lapdog that followed her into the pools. It bites everyone but her. Braced stiff-legged on its short legs,
// head lowered and pushed out, barking: fire boiled it hairless, the skin pink-white, wrinkled and flaking, blistered along
// the back, the last tufts of fur clumped wet on the ears, the topknot and the tail; water swelled it round and soft, the
// belly sagging nearly to the floor, steam rising off its back. A soaked velvet collar with a small silver bell and an
// engraved name disc; a limp silk bow on the topknot; a tiny embroidered coat buttoned under the swollen belly and split at
// the seams; overgrown claws; a broken lead trailing; a missing front tooth. A squashed face, small wet eyes deep in
// wrinkles, lips peeled back from tiny teeth.
// Rig: body (root), neck, head, jaw, ear_n, ear_f, tail, lead (parent neck), four legs of three bones (leg_fn_1..3,
// leg_ff_1..3, leg_hn_1..3, leg_hf_1..3). Motion: idle a shiver and a growl (body, jaw); attack a snapping bite at the
// ankles (neck and head lunge down and forward, the jaw snaps).
function lapdog() {
  const seed = 328, h = TIERS.small[1];
  const f = new Fig(T.base(seed, h, { grimeY: 700 }));
  X.textures(f);
  const gy = f.o.groundY;
  const hide = '#f0d0c4', hideD = '#d0a69c', hideS = '#6a3e48';
  const SK = (o = {}) => Object.assign({ fill: hide, shadow: hideS, shade: 0.34, tex: 'pruned' + seed, texOp: 0.55, maxShade: 14 }, o);
  const FAR = SK({ fill: mix(hide, hideS, 0.22) });
  const VEL = (o = {}) => Object.assign({ fill: '#8a5464', shadow: '#2a121e', shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, maxShade: 14 }, o);
  const fur = (pts, w, col = '#8a6a5a') => { f.stroke(pts, w * 1.25, INK); f.stroke(pts, w, col); f.line(pts.slice(0, -1), Math.max(0.8, w * 0.25), '#c8a898', { op: 0.6 }); };
  // legs: [top (in the body), elbow or stifle, wrist or hock, paw back]
  const L = {
    fn: [[344, 690], [348, 738], [370, 770], [374, 788]], ff: [[362, 684], [368, 734], [390, 768], [394, 786]],
    hn: [[214, 700], [236, 740], [200, 764], [196, 788]], hf: [[234, 694], [258, 734], [226, 760], [222, 786]],
  };
  const NK = [372, 640], HC = [438, 640], hA = 0.24, HS = 1.42;
  f.joint('body', [280, 690]).joint('neck', NK, 'body').joint('head', add(NK, [34, 6]), 'neck').joint('jaw', add(HC, rot([-8 * HS, 22 * HS], hA)), 'head');
  f.joint('ear_n', add(HC, rot([-24 * HS, -28 * HS], hA)), 'head').joint('ear_f', add(HC, rot([-8 * HS, -34 * HS], hA)), 'head').joint('tail', [198, 630], 'body').joint('lead', [388, 668], 'body');
  for (const [k, q] of Object.entries(L)) f.joint(`leg_${k}_1`, q[0], 'body').joint(`leg_${k}_2`, q[1], `leg_${k}_1`).joint(`leg_${k}_3`, q[2], `leg_${k}_2`);
  const leg = (k, look, w) => {
    const [A, Bk, Cw, Pw] = L[k], front = k[0] === 'f', dir = 1;
    f.bone(`leg_${k}_3`);
    X.paw(f, Pw, gy - (k[1] === 'f' ? 3 : 0), dir, w * 0.36, look, { claw: 0.5 });
    f.part(K.chain([lerp(Cw, Pw, -0.2), Cw, Pw], [w * 0.62, w * 0.56, w * 0.6]), look); // the pastern, short and thick
    f.bone(`leg_${k}_2`);
    f.part(T.mlimb(Bk, Cw, [[0, w * 0.46], [0.3, w * 0.42], [1, w * 0.32]], [[0, w * 0.48], [0.35, w * 0.4], [1, w * 0.32]], { capK: 0.9 }), look);
    if (!front) f.part(ell(add(Cw, [-w * 0.18, -2]), w * 0.2, w * 0.16, 0, 8), Object.assign({}, look, { cast: false, inkW: 1, fill: mix(look.fill, '#fff', 0.15) })); // the point of the hock
    T.wrinkles(f, Bk, Cw, w * 0.8, 3, { w: 0.8 });
    f.bone(`leg_${k}_1`);
    { const pts = T.mlimb(A, Bk, [[0, w * 0.62], [0.4, w * 0.58], [1, w * 0.46]], [[0, w * 0.6], [0.5, w * 0.56], [1, w * 0.46]], { capK: 0.8, capA: false }); f.part(pts, Object.assign({}, look, { inkW: 0, inkHeavy: 0, cast: false, hatch: false, maxShade: 4 })); const n = pts.length; f.line(pts.slice(Math.floor(n * 0.35), Math.floor(n * 0.65)), 1.6, INK, { op: 0.7 }); }
    if (front) f.part(ell(add(Bk, [-w * 0.3, 0]), w * 0.2, w * 0.18, 0, 8), Object.assign({}, look, { cast: false, inkW: 1, fill: mix(look.fill, '#fff', 0.12) })); // the elbow's point
  };
  // ---- far legs (behind the body)
  leg('hf', FAR, 34); leg('ff', FAR, 32);
  // ---- the broken lead trailing back along the floor from the collar
  f.bone('lead');
  { const pts = [[388, 668], [372, 720], [330, gy - 6], [250, gy - 4], [190, gy - 8], [130, gy - 3]]; f.stroke(pts, 7, INK); f.stroke(pts, 5, P.leatherL); f.line(pts.slice(2), 1, '#c89a7a', { op: 0.5 }); const e = pts[pts.length - 1]; for (let i = 0; i < 4; i++) f.line([e, add(e, [-8 - i * 2, -3 + i * 2])], 1, P.leatherL); } // its torn end frayed
  // ---- the tail: a short curl over the rump with a wet tuft
  f.bone('tail');
  f.part(K.chain([[204, 636], [182, 612], [188, 588], [208, 582]], [20, 16, 12, 9]), SK());
  fur([[208, 584], [218, 572], [226, 576]], 6); fur([[208, 584], [214, 596], [222, 602]], 5); fur([[204, 582], [202, 570]], 5);
  // ---- body: a swollen round bean, the belly sagging toward the floor; blistered along the back
  f.bone('body');
  const body = [[338, 612], [296, 606], [252, 610], [214, 620], [190, 646], [184, 684], [194, 722], [226, 754], [272, 768], [318, 764], [352, 742], [374, 708], [380, 668], [364, 632]];
  f.part(T.lumpy(f, body, 3), SK({ maxShade: 26 }));
  f.raw(`<path d="${E.smooth([[210, 740], [270, 764], [340, 750], [362, 726], [290, 740]])}" fill="${hideS}" opacity="0.3" filter="url(#steamblur${seed})"/>`); // the sagging belly's underside
  for (let i = 0; i < 5; i++) f.line([[200 + i * 5, 650 + i * 14], [208 + i * 5, 660 + i * 14], [202 + i * 5, 672 + i * 14]], 1.2, INK, { op: 0.45 }); // haunch wrinkles
  // the bare boiled hindquarters of a small dog: the haunch's round lit, the hip bone's point, the thigh's edge, the tuck
  // of the flank before the swollen belly, ribs showing behind the coat; wrinkled and pruned, peeling
  f.raw(`<path d="${E.smooth([[196, 640], [240, 624], [262, 660], [244, 712], [204, 706]])}" fill="#fff8f2" opacity="0.35" filter="url(#steamblur${seed})"/>`);
  f.part(ell([226, 630], 9, 6, -0.3, 8), SK({ cast: false, inkW: 0.9, fill: mix(hide, '#fff', 0.2), maxShade: 2 }));
  f.stroke([[250, 640], [262, 690], [246, 738]], 2.2, '#7a3e46', { op: 0.6 }); // the thigh's front edge
  f.stroke([[264, 720], [252, 744], [240, 756]], 2, '#7a3e46', { op: 0.5 });
  for (let i = 0; i < 3; i++) f.line([[262 - i * 4, 630 + i * 12], [256 - i * 4, 650 + i * 12]], 1.2, INK, { op: 0.4 });
  T.wrinkles(f, [200, 680], [250, 700], 30, 5, { op: 0.45 });
  T.peelSheet(f, [232, 690], 12, 26, { sway: 2 });
  // ---- the coat: tiny, embroidered velvet, buttoned under the belly, split at the seams over the swollen body
  const coat = [[350, 616], [318, 606], [290, 608], [268, 618], [258, 656], [262, 706], [276, 748], [306, 760], [336, 748], [356, 712], [362, 666]];
  f.part(coat, VEL());
  f.line([[346, 620], [358, 660], [354, 708], [336, 744]], 2.2, '#d8c4c8', { op: 0.7 }); f.line([[268, 620], [258, 660], [262, 706], [276, 746]], 2.2, '#d8c4c8', { op: 0.7 }); // the silver-thread edging
  for (let i = 0; i < 4; i++) { const c = [276 + i * 20, 676 + (i % 2) * 10]; f.line([add(c, [-6, 0]), add(c, [0, -6]), add(c, [6, 0]), add(c, [0, 6]), add(c, [-6, 0])], 1, '#c8b0b8', { op: 0.6 }); } // embroidered lozenges
  X.clothWear(f, coat, [260, 612, 360, 760], 4, { damp: '#1a0810', stain: '#3a1a24' });
  for (const [p0, p1] of [[[276, 630], [282, 700]], [[316, 616], [330, 660]], [[280, 720], [310, 748]]]) f.stroke([p0, lerp(p0, p1, 0.5), p1], 1.8, '#2a0e18', { op: 0.7 }); // creases in the soaked velvet
  for (const x of [292, 318]) { f.part(ell([x, 760], 4, 3.4, 0, 8), { fill: Q.bone, shade: 0.3, inkW: 0.8, cast: false }); } // buttons along the belly
  // the seams burst: swollen pink skin bulging through two splits
  for (const [a, b] of [[[296, 610], [290, 680]], [[330, 698], [342, 742]]]) { const m = lerp(a, b, 0.5), d = E.norm(sub(b, a)), n = [-d[1], d[0]]; f.part(T.lumpy(f, [a, add(m, mul(n, 9)), b, add(m, mul(n, -7))], 1.5), SK({ cast: false, inkW: 1.1 })); for (let i = 1; i < 4; i++) { const q = lerp(a, b, i / 4); f.line([add(q, mul(n, -7)), add(q, mul(n, 7))], 0.9, '#c8b0b8', { op: 0.8 }); } } // broken threads across the split
  f.raw(`<path d="${E.smooth([[270, 640], [330, 628], [350, 680], [290, 700], [270, 690]])}" fill="#1a0a12" opacity="0.3" filter="url(#steamblur${seed})"/>`); // soaked darker across the back
  // the back above the coat: hairless, blistered, flaking, peeling
  T.blisters(f, [276, 612], 50, 5, 7, 2.5, 5, { burst: 0.4 });
  T.flakes(f, [208, 640], 14, 12, 4, { col: '#faeee6', s: 0.7 });
  T.peelSheet(f, [204, 690], 14, 30, { sway: -2 });
  T.scald(f, [204, 700], 14, 30, 5);
  f.bone('neck');
  f.part(T.lumpy(f, [[330, 616], [366, 614], [404, 632], [418, 668], [404, 700], [380, 708], [350, 690], [334, 660]], 2), SK());
  for (let i = 0; i < 4; i++) f.line([[342 + i * 12, 632 + i * 2], [338 + i * 12, 660 + i * 4], [344 + i * 12, 690]], 1.2, INK, { op: 0.45 }); // the neck's rolls
  // the collar: soaked velvet, a silver bell and an engraved disc hanging at the throat
  f.part([[360, 620], [378, 618], [396, 690], [380, 698]], VEL({ inkW: 1.2, fill: '#5a2a3e' }));
  f.line([[368, 622], [386, 692]], 1, '#c8b0b8', { op: 0.6, dash: '3 3' });
  { const bl = [396, 704]; f.line([[390, 694], bl], 1.2, Q.silverD); f.part([add(bl, [-7, 0]), add(bl, [-6, -6]), add(bl, [6, -6]), add(bl, [7, 0]), add(bl, [8, 8]), add(bl, [-8, 8])], { fill: Q.silver, shadow: Q.silverD, shade: 0.4, inkW: 1, cast: false }); f.line([add(bl, [-8, 8]), add(bl, [8, 8])], 1.2, INK); f.flat(ell(add(bl, [0, 10]), 2, 2, 0, 6), Q.silverD); f.flat(ell(add(bl, [2, -2]), 2, 1.4, 0, 6), '#fff', { op: 0.8 }); }
  { const nd = [380, 710]; f.part(ell(nd, 7, 8, 0.2, 10), { fill: Q.silver, shadow: Q.silverD, shade: 0.4, inkW: 1, cast: false }); f.line([add(nd, [-3, -2]), add(nd, [3, -2])], 0.8, INK, { op: 0.7 }); f.line([add(nd, [-3, 2]), add(nd, [2, 2])], 0.8, INK, { op: 0.7 }); }
  // ---- near legs
  leg('hn', SK(), 38); leg('fn', SK(), 35);
  f.bone('leg_fn_1'); T.blisters(f, lerp(L.fn[0], L.fn[1], 0.4), 8, 8, 2, 2, 3.5);
  f.bone('leg_hn_1'); T.peelSheet(f, lerp(L.hn[0], L.hn[1], 0.5), 10, 18, { sway: 2 });

  // ---- the head (independent review: the first head, a flat snout under a roll and small ears, read as a pig): a toy
  // spaniel's head, lowered and pushed out, barking. A domed skull with a clear stop, a short square muzzle ending in a
  // black nose, long ears hanging to the jaw with the last wet fur clumped at their ends, a dark wet eye deep in the
  // boiled wrinkles of the brow, the jaw dropped on its hinge, lips peeled back from tiny teeth, a front tooth missing.
  const F = frame(HC, hA, HS);
  f.bone('ear_f');
  f.part(F([[-8, -44], [6, -50], [10, -34], [4, -14], [-6, -20]]), SK({ fill: mix(hide, hideS, 0.25) })); // the far ear's root over the dome
  f.bone('jaw');
  // the lower jaw, dropped on its hinge under the ear: the chin, the lower lip peeled from the teeth, a canine, the tongue
  const J = pts => F(pts.map(([u, v]) => { const q = rot([u + 4, v - 12], 0.38); return [q[0] - 4, q[1] + 12]; }));
  f.part(J([[-10, 10], [12, 16], [36, 18], [52, 16], [54, 24], [44, 32], [20, 34], [-6, 30], [-16, 22]]), SK({ fill: hideD, maxShade: 4 }));
  f.flat(J([[6, 17], [50, 18], [44, 25], [10, 24]]), '#7a2030');
  f.part(J([[16, 18], [42, 17], [50, 20], [46, 28], [22, 27]]), { fill: '#c45a62', shadow: '#5a1a24', shade: 0.3, inkW: 0.9, cast: false, hatch: false }); // the tongue
  for (let i = 0; i < 4; i++) f.part(J([[34 + i * 4, 17], [36 + i * 4, 12], [38 + i * 4, 17]]), { fill: '#efe2cc', shade: 0.3, inkW: 0.6, inkHeavy: 0.8, cast: false, hatch: false });
  f.part(J([[28, 17], [31, 6], [34, 17]]), { fill: '#efe2cc', shade: 0.3, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); // the lower canine
  for (let i = 0; i < 3; i++) f.line(J([[4 + i * 9, 28], [8 + i * 9, 33]]), 1, INK, { op: 0.45 });
  f.bone('head');
  // the skull: the round dome, the stop, the short square muzzle
  const skull = [[-40, -8], [-38, -32], [-22, -50], [2, -56], [24, -50], [34, -36], [40, -26], [54, -24], [64, -18], [68, -6], [66, 4], [56, 12], [40, 16], [18, 20], [-8, 22], [-30, 14]];
  f.part(F(skull), SK({ fill: mix(hide, '#e8b8ac', 0.25), maxShade: 12 }));
  f.raw(`<path d="${E.smooth(F([[-36, -10], [-10, 0], [-6, 20], [-30, 16]]))}" fill="${hideS}" opacity="0.35" filter="url(#steamblur${seed})"/>`); // the cheek turning away
  f.raw(`<path d="${E.smooth(F([[-20, -46], [10, -52], [20, -40], [-10, -36]]))}" fill="#fff8f2" opacity="0.4" filter="url(#steamblur${seed})"/>`); // the lit dome
  // the mouth open on the bark: the dark gape, the upper lip (flews) peeled up off the teeth, a front tooth missing
  f.flat(F([[24, 12], [60, 10], [58, 18], [28, 20]]), '#3a0e14');
  for (let i = 0; i < 5; i++) { if (i === 2) continue; f.part(F([[36 + i * 4.4, 9], [38 + i * 4.4, 15], [40 + i * 4.4, 9]]), { fill: '#efe2cc', shade: 0.3, inkW: 0.6, inkHeavy: 0.8, cast: false, hatch: false }); }
  f.part(F([[30, 9], [33, 19], [36, 9]]), { fill: '#efe2cc', shade: 0.3, inkW: 0.7, inkHeavy: 0.9, cast: false, hatch: false }); // the upper canine
  f.part(F([[20, 4], [40, 0], [60, 2], [66, 6], [58, 11], [40, 10], [22, 12]]), SK({ fill: '#e4a49c', cast: false, inkW: 1.1, maxShade: 3 })); // the upper lip, peeled
  f.line(F([[24, 10], [40, 9], [56, 10]]), 1.1, '#7a2030', { op: 0.7 });
  // the muzzle's top and the black nose; a fold of boiled skin across the stop; whisker pits, the whiskers boiled off
  f.part(F([[40, -26], [56, -24], [66, -16], [68, -6], [60, -2], [48, -8], [40, -14]]), SK({ fill: mix(hide, '#e8b8ac', 0.35), cast: false, inkW: 0, inkHeavy: 0, maxShade: 4 }));
  f.part(F([[58, -16], [66, -18], [71, -11], [70, -3], [62, -2], [57, -8]]), { fill: '#3a2426', shadow: '#0a0404', shade: 0.4, inkW: 1.1, cast: false }); f.flat(F(ell([67, -6], 1.6, 1.2, 0.4, 6)), '#0a0404'); f.flat(F(ell([62, -14], 2, 1.2, 0, 6)), '#fff', { op: 0.5 }); // the nose leather
  f.stroke(F([[34, -36], [40, -28], [38, -20]]), 2.4, '#7a3e46', { op: 0.65 }); // the stop, a fold of skin across it
  for (const [x, y] of [[48, -4], [52, 0], [44, 0], [54, -8]]) f.flat(F(ell([x, y], 0.9, 0.9, 0, 6)), INK, { op: 0.6 });
  // the eye: dark and wet, deep in the boiled wrinkles of the brow, the red lower lid
  f.flat(F(ell([24, -28], 8.5, 7, 0.1, 12)), '#4a1e28', { op: 0.85 });
  f.flat(F(ell([25, -28], 6, 5.4, 0, 10)), '#140608'); f.flat(F(ell([27, -30.5], 1.8, 1.4, 0, 6)), '#fff', { op: 0.95 }); f.flat(F(ell([23, -25.5], 1, 0.7, 0, 6)), '#fff', { op: 0.5 });
  f.line(F([[17, -24], [24, -21], [32, -24]]), 1.4, '#c45a62', { op: 0.85 }); f.stroke(F([[15, -34], [24, -38], [33, -34]]), 2.2, '#7a3e46', { op: 0.7 }); // the lids
  for (let i = 0; i < 3; i++) f.line(F([[8 + i * 6, -44 + i * 1.5], [18 + i * 6, -40 + i * 2], [28 + i * 4, -42 + i * 2]]), 1.1, INK, { op: 0.5 }); // the brow knotted
  T.drip(f, F([[22, -21]])[0], 0.5);
  T.blisters(f, F([[-16, -30]])[0], 9, 6, 3, 2, 3.5); T.flakes(f, F([[-24, 0]])[0], 8, 6, 3, { col: '#faeee6', s: 0.6 });
  // the topknot: the last tuft of wet fur on the crown, a limp silk bow tied in it
  fur(F([[-6, -50], [-12, -62], [-6, -70], [2, -66]]), 7); fur(F([[0, -52], [4, -64], [12, -66]]), 6);
  { const bw = F([[-4, -60]])[0]; f.part([add(bw, [-2, -2]), add(bw, [-20, -8]), add(bw, [-24, 2]), add(bw, [-16, 10]), add(bw, [-2, 4])], { fill: '#c8909a', shadow: '#6a3a44', shade: 0.4, inkW: 1, cast: false }); f.part([add(bw, [2, -2]), add(bw, [16, 2]), add(bw, [18, 14]), add(bw, [8, 12]), add(bw, [2, 4])], { fill: '#b88088', shadow: '#6a3a44', shade: 0.4, inkW: 1, cast: false }); f.part(ell(bw, 4, 4, 0, 8), { fill: '#a8707a', shade: 0.3, inkW: 0.9, cast: false }); f.stroke([add(bw, [-14, 8]), add(bw, [-16, 22])], 3.6, '#b88088'); f.stroke([add(bw, [10, 12]), add(bw, [12, 26])], 3.2, '#b88088'); }
  // the near ear: long, hanging from the top of the skull down past the jaw, boiled bare, the last fur clumped wet at its end
  f.bone('ear_n');
  { const ear = [[-24, -44], [-8, -46], [-4, -30], [-6, -4], [-10, 22], [-18, 38], [-30, 40], [-36, 22], [-34, -6], [-32, -30]]; // hangs plumb whatever the head does: drawn in the head frame at this tilt it hangs nearly down
    f.part(F(ear), SK({ fill: mix(hide, '#e8b8ac', 0.2), maxShade: 8 }));
    f.line(F([[-18, -36], [-16, -10], [-20, 20], [-24, 34]]), 1.2, INK, { op: 0.45 }); f.line(F([[-12, -38], [-10, -12]]), 1.4, '#fff8f2', { op: 0.5 });
    T.blisters(f, F([[-20, -10]])[0], 6, 10, 2, 2, 3);
    for (const [x, l, w] of [[-30, 26, 7], [-24, 30, 8], [-17, 26, 7], [-10, 20, 6], [-34, 18, 5]]) fur(F([[x, 34], [x - 2, 34 + l * 0.5], [x + 1, 34 + l]]), w); }
  // ---- steam lifting off its back
  f.bone('body');
  T.wisp(f, [280, 610], 60, { w: 6, op: 0.32, drift: -10 });
  T.wisp(f, [218, 620], 46, { w: 5, op: 0.28, drift: 6 });
  f.bone('root');
  f.flat(ell([280, gy + 2], 150, 7, 0, 16), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ HYPOCAUST ROACHES (cast, small, a heap 0.4 high)
// The cockroaches that bred in the warm brick under the pools, cooked boiled-red like shrimp, shells cracked and split,
// legs curled, swollen soft and glossy, and still moving. They pour up out of a drain in the marble floor in a heap about
// knee high, and their tide has tipped the bronze drain grate (cast with a lion's mask) up on its edge behind them.
// Broken marble tiles round the hole; carried on the heap: a lost bone hairpin, a silver ring, a sodden sponge, a scrap of
// towel, a lost sandal; dead roaches upturned round the edge. Steam rises off the heap.
// Rig: heap (root, the mound), grate (pivot on its hinge edge), crest (the top of the heap, parent heap), spill_1 and
// spill_2 (the tongue flooding forward, a chain), runner_1..3 (single roaches out ahead). Motion: idle the heap seething
// and the grate rattling (crest, grate); attack the heap flooding over a hero's feet (spill_1/2 reach forward, runners).
function hypocaustRoaches() {
  const seed = 329, h = TIERS.small[1];
  const f = new Fig(T.base(seed, h, { grimeY: 9999 }));
  X.textures(f);
  const gy = f.o.groundY;
  const rc = () => ['#b8402a', '#c44c30', '#a83824', '#cc5a38', '#9a3020'][Math.floor(f.r() * 5)];
  const R = (a, b) => a + (b - a) * f.r();
  f.joint('heap', [300, 760]).joint('grate', [270, 744], 'heap').joint('crest', [300, 640], 'heap').joint('spill_1', [420, 760], 'heap').joint('spill_2', [500, 776], 'spill_1');
  for (const [i, q] of [[1, [560, 780]], [2, [126, 784]], [3, [470, 742]]]) f.joint(`runner_${i}`, q, 'heap');
  // a roach heap: fill a region with shadowed mass, then roaches over it, back to front
  const fillRoaches = (poly, n, s0, s1, o = {}) => {
    const bb = E.bbox(poly), inside = q => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const pts = []; let tries = 0; while (pts.length < n && tries < n * 20) { tries++; const q = [R(bb[0], bb[2]), R(bb[1], bb[3])]; if (inside(q)) pts.push(q); }
    pts.sort((a, b) => a[1] - b[1]); // back (higher) first
    for (const q of pts) X.roach(f, q, (o.dir ?? -1.57) + R(-1.3, 1.3), R(s0, s1), { col: rc(), dead: f.r() < (o.dead ?? 0.08) });
  };

  // ---- the floor: broken marble tiles round the drain hole, wet
  f.bone('heap');
  for (const [a, b] of [[[60, gy - 6], [50, gy + 8]], [[470, gy - 8], [480, gy + 8]], [[30, gy + 2], [570, gy - 2]]]) f.line([a, b], 1.6, P.marbleS, { op: 0.5 }); // tile joints in the wet floor
  // the hole: a dark square throat in the floor, seen low
  f.flat([[170, gy - 52], [400, gy - 58], [420, gy - 30], [150, gy - 24]], '#0a0606');
  f.flat([[176, gy - 50], [396, gy - 56], [400, gy - 46], [180, gy - 42]], '#3a1a14', { op: 0.8 }); // brick lining showing in the throat
  // broken tiles lifted round it: shards tipped up at the rim
  for (const [c, w, a] of [[[140, gy - 26], 46, -0.3], [[430, gy - 34], 52, 0.25], [[92, gy - 14], 36, 0.1], [[500, gy - 22], 40, -0.15]]) {
    const F2 = frame(c, a, 1), sh = [[-w / 2, 6], [-w * 0.4, -10, 1], [w * 0.1, -16], [w / 2, -6, 1], [w * 0.46, 8]];
    f.part(F2(sh), T.MAR(f, { fill: P.marbleL, inkW: 1.2, maxShade: 6 })); f.line(F2([[-w * 0.4, -10], [w * 0.1, -16], [w / 2, -6]]), 1.4, '#fff8f4', { op: 0.6 }); f.line(F2([[-w * 0.1, -12], [0, 4]]), 1, INK, { op: 0.6 });
  }
  f.flat(ell([300, gy - 4], 280, 10, 0, 18), '#5a4a4a', { op: 0.3 }); f.line([[90, gy + 2], [200, gy]], 1.4, P.wet, { op: 0.5 });
  // ---- the grate: a square bronze plate pierced with slots round a lion's mask, tipped up on its hinge edge behind the heap
  f.bone('grate');
  const g0 = [176, 746], g1 = [386, 742], g2 = [470, 548], g3 = [262, 520];
  const G = (u, v) => lerp(lerp(g0, g1, u), lerp(g3, g2, u), v); // u along the hinge, v up the plate
  f.part([add(g0, [-8, 10]), add(g1, [8, 8]), add(g2, [10, -6]), add(g3, [-10, -4])].map(q => [...q, 1]), { fill: P.bronzeD, shade: 0.3, inkW: 1.4, cast: true }); // the plate's thickness
  f.part([g0, g1, g2, g3].map(q => [...q, 1]), { fill: mix(P.bronze, P.bronzeD, 0.35), shadow: '#2a1a0c', shade: 0.42, tex: 'hammer' + seed, texOp: 0.6, maxShade: 22 });
  T.verdigris(f, G(0.5, 0.2), 90, 20, 12); T.verdigris(f, G(0.1, 0.6), 20, 60, 6); f.flat([G(0.0, 0.0), G(1, 0), G(1, 0.3), G(0, 0.3)], '#1a120c', { op: 0.25 }); // verdigris, the wet dark lower edge
  f.line([G(0.02, 0.98), G(0.98, 0.98)], 2.4, P.bronzeL, { op: 0.7 }); f.line([G(0.98, 0.04), G(0.98, 0.96)], 2, P.bronzeL, { op: 0.5 });
  // slots in two rings round the mask, dark, a few roaches pushing through them
  for (let k = 0; k < 14; k++) { const u = 0.1 + (k % 7) * 0.13, v = k < 7 ? 0.14 : 0.86; f.flat([G(u - 0.035, v - 0.05), G(u + 0.035, v - 0.05), G(u + 0.035, v + 0.05), G(u - 0.035, v + 0.05)], '#0a0606'); }
  for (let k = 0; k < 8; k++) { const v = 0.26 + (k % 4) * 0.16, u = k < 4 ? 0.12 : 0.88; f.flat([G(u - 0.05, v - 0.03), G(u + 0.05, v - 0.03), G(u + 0.05, v + 0.03), G(u - 0.05, v + 0.03)], '#0a0606'); }
  // the lion's mask: mane in a ring of locks, brow, muzzle, the open mouth that took the water
  const lc = G(0.5, 0.52);
  for (let i = 0; i < 12; i++) { const a2 = i / 12 * Math.PI * 2, q = add(lc, [Math.cos(a2) * 52, Math.sin(a2) * 50]); f.part(ell(q, 15, 11, a2, 10), { fill: P.bronze, shadow: P.bronzeD, shade: 0.45, inkW: 1.1, cast: false, tex: 'hammer' + seed, texOp: 0.5 }); f.line([add(q, [-Math.cos(a2) * 8, -Math.sin(a2) * 8]), add(q, [Math.cos(a2) * 8, Math.sin(a2) * 8])], 1, P.bronzeD, { op: 0.7 }); }
  f.part(ell(lc, 40, 42, 0, 16), { fill: P.bronze, shadow: P.bronzeD, shade: 0.45, inkW: 1.3, cast: false, tex: 'hammer' + seed, texOp: 0.5 });
  f.stroke([add(lc, [-26, -14]), add(lc, [-10, -22]), add(lc, [0, -16])], 4, P.bronzeD); f.stroke([add(lc, [26, -14]), add(lc, [10, -22]), add(lc, [0, -16])], 4, P.bronzeD); // the brow
  f.flat(ell(add(lc, [-14, -8]), 6, 3, 0, 8), '#1a0e06'); f.flat(ell(add(lc, [14, -8]), 6, 3, 0, 8), '#1a0e06');
  f.part([add(lc, [-10, -6]), add(lc, [10, -6]), add(lc, [14, 8]), add(lc, [0, 14]), add(lc, [-14, 8])], { fill: P.bronzeL, shadow: P.bronzeD, shade: 0.4, inkW: 1, cast: false }); // the muzzle
  f.flat(ell(add(lc, [0, 24]), 16, 10, 0, 12), '#0a0606'); // the mouth: the drain
  T.verdigris(f, add(lc, [0, 30]), 30, 14, 7); T.verdigris(f, G(0.2, 0.3), 30, 30, 6); T.dents(f, G(0.8, 0.7), 20, 20, 3);
  f.flat([G(0.04, 0.0), G(0.96, 0.0), G(0.96, 0.1), G(0.04, 0.1)], '#e8e0d4', { op: 0.35 }); // white lime scale along the wet bottom edge
  // roaches crawling on the grate, one coming out of the lion's mouth
  X.roach(f, add(lc, [4, 30]), 1.4, 26, { col: '#c44c30' });
  for (const [u, v, a] of [[0.15, 0.9, -0.4], [0.82, 0.8, 2.2], [0.88, 0.35, 1.2], [0.3, 0.6, -2.4]]) X.roach(f, G(u, v), a, 24, { col: rc() });

  // ---- the heap: a mound pouring up out of the hole, spreading over the floor
  f.bone('heap');
  const mound = [[110, gy], [130, 770], [158, 736], [188, 694], [216, 660], [252, 636], [300, 628], [350, 640], [392, 670], [430, 712], [470, 748], [520, 774], [540, gy]];
  const mc = [325, 760], shrink = (pts, k) => pts.map(q => add(q, mul(E.norm(sub(mc, q)), k)));
  f.part(T.lumpy(f, shrink(mound, 12), 6), { fill: '#3a0e0a', shadow: '#1a0404', shade: 0.4, inkW: 0, cast: true, hatch: false });
  fillRoaches(mound.map(q => [q[0], q[1] + 6]), 80, 20, 30);
  // the outline is roaches: bodies and legs breaking the edge all round, not a smooth slope
  for (let i = 1; i < mound.length - 1; i++) for (let k = 0; k < 3; k++) { const q = lerp(mound[i], mound[i + 1] || mound[i], k / 3); X.roach(f, add(q, [R(-6, 6), R(-2, 8)]), Math.atan2(q[1] - mc[1], q[0] - mc[0]) + R(-0.8, 0.8), R(22, 30), { col: rc(), dead: f.r() < 0.1 }); }
  // ---- things carried on the tide: a sandal, a scrap of towel, a sodden sponge
  { const sd = [196, 742], F2 = frame(sd, -0.5, 1); f.part(F2([[-34, 0], [30, -6], [40, 2], [32, 10], [-34, 10]]), { fill: P.leather, shadow: P.leatherD, shade: 0.4, inkW: 1.2 }); f.stroke(F2([[-20, 0], [-6, -14], [10, -4]]), 4, P.leatherL); f.stroke(F2([[6, -2], [16, -14], [26, -2]]), 3.6, P.leatherL); } // a lost sandal
  { const tw = [360, 680]; f.part(T.lumpy(f, [add(tw, [-30, -6]), add(tw, [20, -12]), add(tw, [34, 10]), add(tw, [10, 30]), add(tw, [-24, 22])], 3), T.LIN(f, { fill: '#d6cec0', maxShade: 6 })); f.stroke([add(tw, [-20, 4]), add(tw, [16, 0])], 1.6); f.flat(ell(add(tw, [0, 10]), 10, 5, 0, 8), P.raw, { op: 0.4 }); f.stitches([add(tw, [-26, -2]), add(tw, [18, -8])], P.linenD, 0.8); }
  { const sp = [262, 700]; f.part(T.lumpy(f, ell(sp, 22, 17, 0.2, 12), 4), { fill: '#c8a868', shadow: '#5a4020', shade: 0.4, tex: 'pores' + seed, texOp: 0.9, inkW: 1.2 }); T.drip(f, add(sp, [6, 16]), 0.9); }
  fillRoaches([[150, 760], [200, 690], [260, 650], [330, 650], [400, 700], [450, 760]], 34, 22, 34);
  // ---- the crest: the top of the heap boiling up out of the hole, the hairpin and ring carried on it
  f.bone('crest');
  const crest = [[220, 690], [236, 650], [262, 616], [298, 600], [334, 608], [362, 634], [380, 676], [300, 690]];
  f.part(T.lumpy(f, crest.map(q => add(q, mul(E.norm(sub([300, 660], q)), 10))), 5), { fill: '#3a0e0a', shadow: '#1a0404', shade: 0.4, inkW: 0, cast: false, hatch: false });
  fillRoaches(crest.map(q => [q[0], q[1] + 8]), 26, 22, 32, { dir: -1.57 });
  for (let i = 0; i < crest.length - 2; i++) X.roach(f, add(crest[i], [R(-4, 4), R(0, 6)]), Math.atan2(crest[i][1] - 660, crest[i][0] - 300) + R(-0.7, 0.7), R(22, 30), { col: rc() }); // rearing off the crest
  { const hp = [[286, 626], [340, 596]]; f.stroke(hp, 5, INK); f.stroke(hp, 3.4, Q.bone); f.part(ell([342, 595], 6, 6, 0, 8), { fill: Q.pearl, shade: 0.3, inkW: 1, cast: false }); } // a bone hairpin with a pearl head
  { const rg = [304, 650]; const e = ell(rg, 9, 6, 0.3, 12); f.line(e.concat([e[0]]), 4.4, Q.silverD); f.line(e.slice(6, 11), 1.6, Q.silverL, { op: 0.9 }); } // a silver ring
  // ---- the spill: the tide running forward over the floor
  f.bone('spill_1');
  const sp1 = [[400, gy], [420, 760], [460, 752], [500, 764], [520, gy]];
  f.part(T.lumpy(f, sp1, 3), { fill: '#3a0e0a', shade: 0.4, inkW: 1.2, cast: false, hatch: false });
  fillRoaches(sp1, 12, 20, 28, { dir: 0 });
  f.bone('spill_2');
  for (const [x, y, a] of [[518, 780, 0.1], [540, 770, -0.3], [506, 770, 0.4]]) X.roach(f, [x, y], a, R(20, 26), { col: rc() });
  // ---- runners out ahead, and the dead round the edge (upturned, legs curled)
  for (const [i, q, a, sz] of [[1, [566, 782], 0.05, 26], [2, [118, 784], 3.1, 24], [3, [470, 736], -0.6, 24]]) { f.bone(`runner_${i}`); X.roach(f, q, a, sz, { col: rc() }); }
  f.bone('heap');
  for (const [q, a] of [[[80, gy - 4], 0.4], [[590 - 20, gy - 2], 2.8], [[150, gy + 6], -0.2], [[440, gy + 8], 1.2]]) X.roach(f, q, a, 22, { dead: true, col: '#9a3424' });
  // ---- steam off the heap
  f.bone('crest');
  T.steam(f, [330, 600], 200, 30, { drift: 60, op: 0.38, grow: 1.6, n: 7, curls: 3 });
  f.bone('heap');
  T.wisp(f, [200, 700], 80, { w: 7, op: 0.3, drift: -10 });
  T.wisp(f, [430, 720], 70, { w: 6, op: 0.28, drift: 10 });
  return f;
}

// ------------------------------------------------------------------ PUMP MULE (cast, large 1.4)
// The mule that walked in circles turning the wheel that lifted spring water to the cisterns. Nobody told it to stop. It
// leans into its collar, head down, dragging: the front legs angled back under the body, the hind legs driving from behind,
// the weight thrown forward. Fire boiled its hide hairless and pink-white, peeling in sheets along the flanks where the
// traces rub, and cooked the mane into a stiff ridge; water swells the legs and belly and has softened and split the
// hooves. Ribs show under the soft skin; steam rises off the back. A padded leather collar boiled hard and cracked, wooden
// hames; a bridle with blinkers; rope and leather traces running back to a broken length of the wheel's oak sweep-beam,
// still hooked behind it, its splintered end scraping the floor; a bronze bell on the collar; a holed sackcloth blanket;
// a temple brand on the hip; one hind shoe missing; a broken chain hobble on one fetlock. A long bony head held low, ears
// flat, lips peeled back from long teeth.
// Rig: spine_1 (root, hindquarters), spine_2 (barrel and chest), neck, head, jaw, ears, tail, collar (parent spine_2),
// beam (parent spine_1, pivot at the hook), legs of three bones each (leg_fn_1..3, leg_ff_1..3, leg_hn_1..3, leg_hf_1..3).
// Motion: idle plodding on the spot, the beam scraping; attack a kick with both hind legs (leg_hn_1/leg_hf_1 swing back,
// spine_1 lifts), then a swing of the beam (beam).
function pumpMule() {
  // independent review rebuild: a mule's anatomy at true size (1.4 at the hames) on a widened canvas so the broken
  // sweep-beam's splintered end shows. A long bony head with long ears laid flat, a deep chest, the belly tucked up to the
  // flank (the soft skin hanging in wet folds under it), a dipped back and a steep croup; legs with the knee, the hock and
  // the sloping fetlock, small boxy hooves. Leaning into the collar: the forelegs set back under the chest, the near hind
  // driving far back, the head thrust down and forward. Fire's mark: the hide boiled pink-white and hairless in great
  // patches, the last of the dun coat clinging in ragged islands (shoulder, haunch, legs), peeling in sheets along the
  // flanks under the traces; the mane cooked into a stiff ridge. The harness sits on the body: collar and hames round the
  // neck, a back-band with a girth round the barrel carrying the traces, taut back to the beam's hook.
  const seed = 330, w = 2000, h = 1100;
  const f = new Fig(T.base(seed, h, { grimeY: 860 }));
  X.textures(f);
  const gy = f.o.groundY;
  const hide = '#eecdc2', hideS = '#9a5a64', sore = '#c45a4a', coat = '#9a887a';
  const SK = (o = {}) => Object.assign({ fill: hide, shadow: hideS, shade: 0.34, tex: 'pores' + seed, texOp: 0.4, maxShade: 34 }, o);
  const FAR = (o = {}) => SK(Object.assign({ fill: mix(hide, '#6a3a48', 0.26), shadow: '#6a3a48' }, o));
  const dkL = '#7a3a46', ltL = '#fff8f2';
  // legs: [top (in the body), elbow or stifle, knee or hock, fetlock, hoof toe]
  const L = {
    hf: [[740, 400], [800, 610], [716, 822], [690, 990], [726, gy]],
    ff: [[1330, 460], [1316, 610], [1362, 812], [1392, 984], [1444, gy]],
    hn: [[700, 410], [790, 624], [626, 816], [566, 990], [602, gy]],
    fn: [[1360, 470], [1344, 620], [1300, 822], [1258, 990], [1300, gy]],
  };
  const NB = [1350, 380], POLL = [1690, 486], hA = 1.02, HL = 330, HC = add(POLL, rot([HL * 0.45, 0], hA));
  const HOOK = [470, 760], BEND = [60, gy - 12];
  f.joint('spine_1', [820, 420]).joint('spine_2', [1100, 420], 'spine_1').joint('neck', NB, 'spine_2').joint('head', POLL, 'neck').joint('jaw', add(POLL, rot([90, 70], hA)), 'head');
  f.joint('ears', add(POLL, [-10, -10]), 'head').joint('tail', [590, 300], 'spine_1').joint('collar', [1400, 400], 'spine_2').joint('beam', HOOK, 'spine_1');
  for (const [k, q] of Object.entries(L)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, q[0], par).joint(`leg_${k}_2`, q[1], `leg_${k}_1`).joint(`leg_${k}_3`, q[2], `leg_${k}_2`); }
  // a ragged island of the old dun coat clinging to the boiled hide: short hairs laid along the hair's direction
  const coatPatch = (c, rx, ry, a, o = {}) => { const e = T.lumpy(f, ell(c, rx, ry, a, 14), Math.min(rx, ry) * 0.35); f.part(e, { fill: o.col || coat, shadow: '#2a1e1a', shade: 0.34, tex: 'hatch' + seed, texOp: 0.4, inkW: 0, inkHeavy: 0, cast: false, opacity: 0.72, maxShade: 10 }); const hd = o.dir ?? a + 1.4; for (let i = 0; i < Math.round(rx * ry / 120); i++) { const q = T.scatter(f, c, rx * 0.8, ry * 0.8); f.line([q, add(q, rot([5 + f.r() * 5, 0], hd))], 1, '#3a2e28', { op: 0.6 }); } e.forEach((q, i) => { if (i % 2) f.line([q, add(q, rot([6, 0], hd + (f.r() - 0.5)))], 1.2, '#4a3a32', { op: 0.7 }); }); };
  // one leg: the forearm or gaskin (muscled) through the knee or hock to the cannon and the fetlock as one outline, then the
  // sloping pastern and a small hoof; the shoulder or thigh above is drawn with the body
  const leg = (k, look, o = {}) => {
    const [A, Bk, Kn, Fl, Tp] = L[k], front = k[0] === 'f', sw = 1.18;
    const S_ = arr => arr.map(([t, w0]) => [t, w0 * sw]);
    const prof = front
      ? [[S_([[0, 46], [0.25, 44], [0.7, 30], [1, 28]]), S_([[0, 44], [0.2, 46], [0.6, 32], [1, 28]])], [S_([[0, 26], [0.25, 21], [0.7, 20], [0.9, 24], [1, 27]]), S_([[0, 26], [0.25, 22], [0.7, 21], [0.9, 25], [1, 27]])]]
      : [[S_([[0, 58], [0.3, 52], [0.7, 34], [1, 30]]), S_([[0, 56], [0.3, 48], [0.7, 30], [1, 28]])], [S_([[0, 28], [0.25, 22], [0.7, 21], [0.9, 25], [1, 28]]), S_([[0, 26], [0.25, 21], [0.7, 20], [0.9, 24], [1, 27]])]];
    const dk = elb(Bk, Kn, Fl);
    f.bone(`leg_${k}_3`);
    X.hoof(f, Fl, Tp[1], 1, 56, look, { split: o.split, shoe: o.shoe });
    split(f, () => {
      const pts = T.mchain([Bk, Kn, Fl], prof, { knob: [front ? 1.2 : 1.35] });
      f.part(pts, Object.assign({}, look, { k: 0.9 }));
      const dk2 = mix(look.fill, '#1a0a0a', 0.5), lt = mix(look.fill, '#fff', 0.38);
      f.part(T.lumpy(f, ell(add(Fl, [-2, 2]), 30 * sw, 26 * sw, 0, 12), 2), Object.assign({}, look, { cast: false, inkW: 0, inkHeavy: 0, fill: mix(look.fill, '#fff', 0.05) })); // the fetlock joint, puffed with water
      f.line(ell(add(Fl, [-2, 2]), 30 * sw, 26 * sw, 0, 12).slice(1, 8), 1.4, INK, { op: 0.6 });
      f.line([lp(Kn, Fl, 0.12, 18 * sw), lp(Kn, Fl, 0.88, 19 * sw)], 2.2, dk2, { op: 0.6 }); // the flexor tendon standing behind the cannon bone
      f.line([lp(Kn, Fl, 0.1, -12 * sw), lp(Kn, Fl, 0.85, -12 * sw)], 2, lt, { op: 0.5 }); // the cannon's lit front edge
      f.flat(ell(lp(Kn, Fl, 0.99, 22 * sw), 9, 7, 0, 8), '#5a4a42', { op: 0.7 }); // the ergot
      if (front) {
        f.part([add(Kn, [-24, -22]), add(Kn, [20, -26]), add(Kn, [30, 0]), add(Kn, [20, 24]), add(Kn, [-22, 22])].map(q => q), Object.assign({}, look, { cast: false, inkW: 0, inkHeavy: 0, fill: mix(look.fill, '#fff', 0.1), maxShade: 6 })); // the knee's flat bony front
        f.line([add(Kn, [18, -24]), add(Kn, [30, 0]), add(Kn, [20, 24])], 1.8, INK, { op: 0.6 });
        f.line([lp(Bk, Kn, 0.08, -20 * sw), lp(Bk, Kn, 0.5, -14 * sw), lp(Bk, Kn, 0.85, -12 * sw)], 2.2, dk2, { op: 0.5 }); // the forearm's muscle groove
        f.line([lp(Bk, Kn, 0.1, 24 * sw), lp(Bk, Kn, 0.55, 20 * sw)], 2, lt, { op: 0.45 });
        f.flat(ell(lp(Bk, Kn, 0.78, 20 * sw), 7, 11, 0, 8), '#6a5a50', { op: 0.75 }); // the chestnut
      } else {
        f.part([add(Kn, [-4, -34]), add(Kn, [-40, -24]), add(Kn, [-44, 0]), add(Kn, [-14, 14])], Object.assign({}, look, { cast: false, inkW: 1.3 })); // the point of the hock
        f.line([lp(Bk, Kn, 0.25, 34 * sw), lp(Bk, Kn, 0.95, 26 * sw)], 2.4, dk2, { op: 0.55 }); // the hamstring cord to the hock
        f.line([lp(Bk, Kn, 0.15, -26 * sw), lp(Bk, Kn, 0.6, -22 * sw)], 2, lt, { op: 0.45 });
        f.flat(ell(lp(Kn, Fl, 0.12, -14 * sw), 6, 9, 0, 8), '#6a5a50', { op: 0.7 }); // the chestnut inside the hock
      }
      coatPatch(lp(Kn, Fl, 0.55, 0), 60, 16, Math.atan2(Fl[1] - Kn[1], Fl[0] - Kn[0]), { dir: 1.6 }); // the coat survives low on the legs
      T.wrinkles(f, lp(Kn, Fl, 0.6), Fl, 40, 4, { w: 0.9 });
    }, [[`leg_${k}_2`, side(Kn, mul(dk, -1), 26 * sw)], [`leg_${k}_3`, side(Kn, dk, 26 * sw)]]);
    if (o.upper) { f.bone(`leg_${k}_1`); const pts = T.mlimb(A, Bk, front ? [[0, 70], [0.5, 66], [1, 50]] : [[0, 110], [0.4, 106], [1, 62]], front ? [[0, 68], [0.5, 60], [1, 48]] : [[0, 100], [0.5, 90], [1, 58]], { capK: 0.8, capA: false }); f.part(pts, Object.assign({}, look, { maxShade: 24 })); }
  };

  // ---- the broken sweep-beam: squared oak, black with a century of hands, hooked behind it, its splintered end on the floor
  f.bone('beam');
  { const bw0 = 44, bw1 = 40, d = E.norm(sub(BEND, HOOK)), n = [-d[1], d[0]];
    f.part([add(HOOK, mul(n, bw0 / 2)), add(BEND, mul(n, bw1 / 2)), add(add(BEND, mul(n, bw1 * 0.2)), mul(d, 36)), add(add(BEND, mul(n, -bw1 * 0.05)), mul(d, 14)), add(add(BEND, mul(n, -bw1 * 0.25)), mul(d, 52)), add(add(BEND, mul(n, -bw1 * 0.4)), mul(d, 20)), add(BEND, mul(n, -bw1 / 2)), add(HOOK, mul(n, -bw0 / 2))].map((q, i) => [2, 3, 4, 5].includes(i) ? [...q, 1] : q), { fill: P.woodD, shadow: '#140c08', shade: 0.42, tex: 'wood' + seed, texOp: 0.7, maxShade: 16 });
    f.part([add(HOOK, mul(n, bw0 / 2)), add(BEND, mul(n, bw1 / 2)), add(add(BEND, mul(n, bw1 / 2)), [-14, -10]), add(add(HOOK, mul(n, bw0 / 2)), [-16, -12])], { fill: P.wood, shadow: P.woodD, shade: 0.3, inkW: 1.2, cast: false, tex: 'wood' + seed, texOp: 0.6 }); // its upper face, worn smooth by hands
    for (let i = 0; i < 7; i++) f.line([lp(HOOK, BEND, 0.05 + i * 0.13, -bw0 * 0.3), lp(HOOK, BEND, 0.13 + i * 0.13, -bw0 * 0.32)], 1.4, INK, { op: 0.6 }); // checks in the grain
    for (let i = 0; i < 8; i++) { const b0 = add(BEND, mul(n, -bw1 * 0.45 + i * bw1 * 0.13)); f.part([add(b0, mul(n, -3)), add(add(b0, mul(d, 22 + (i % 3) * 16)), mul(n, (i % 2 ? 4 : -4))), add(b0, mul(n, 3))], { fill: i % 2 ? P.woodL : '#c8b090', shade: 0.3, inkW: 0.8, cast: false }); } // the splinters of the break, pale fresh wood
    f.flat([add(BEND, mul(n, -bw1 * 0.4)), add(add(BEND, mul(n, -bw1 * 0.1)), mul(d, 10)), add(add(BEND, mul(n, bw1 * 0.3)), mul(d, 4)), add(BEND, mul(n, bw1 * 0.45))], '#c8a880', { op: 0.6 }); // the raw broken face
    f.part([add(HOOK, mul(n, -bw0 * 0.62)), add(add(HOOK, mul(n, -bw0 * 0.62)), mul(d, 50)), add(add(HOOK, mul(n, bw0 * 0.62)), mul(d, 50)), add(HOOK, mul(n, bw0 * 0.62))], { fill: P.iron, shade: 0.4, inkW: 1.3, sharp: true }); // the iron strap round its end
    for (const t of [0.3, 0.7]) f.rivet(add(add(HOOK, mul(n, -bw0 * 0.62 + bw0 * 1.24 * t)), mul(d, 25)), 3.6, P.ironL);
    const e = ell(add(HOOK, mul(d, -16)), 22, 15, Math.atan2(d[1], d[0]), 14); f.line(e.concat([e[0]]), 9, INK); f.line(e.concat([e[0]]), 6, P.iron);
    f.flat(ell(add(BEND, [30, 8]), 90, 7, 0, 12), '#1a1010', { op: 0.4 }); for (let i = 0; i < 3; i++) f.line([add(BEND, [60, 6 + i * 4]), add(BEND, [300, 4 + i * 5])], 1.4, P.marbleS, { op: 0.5 }); } // scraped tracks on the floor
  // ---- far legs, then the tail (behind the body)
  leg('hf', FAR(), { shoe: true, upper: false }); leg('ff', FAR(), { shoe: true, upper: false });
  f.bone('tail');
  { const tl = [[600, 296], [560, 330], [540, 420], [548, 520], [540, 600]]; f.part(K.chain(tl, [52, 40, 30, 22, 14]), SK()); T.wrinkles(f, tl[0], tl[3], 36, 6, { w: 0.9 }); X.peel(f, tl[1], 22, 50, { sway: -2 });
    for (let i = 0; i < 7; i++) { const q = tl[4], pts = [q, add(q, [-10 + i * 4, 40]), add(q, [-16 + i * 6, 90 + (i % 2) * 20])]; f.stroke(pts, 7, INK); f.stroke(pts, 5, '#5a4a42'); } } // a mule's thin tail, the switch of hair clumped wet
  // ---- the body: deep chest, the belly tucked up to the flank, a dipped back, a steep croup; cut at the loin for the rig
  const body = [[1300, 236], [1200, 262], [1080, 296], [960, 300], [840, 284], [740, 262], [660, 266], [600, 296], [570, 360], [572, 450], [600, 540], [660, 600], [750, 640], [820, 610], [900, 606], [1000, 630], [1110, 660], [1220, 664], [1310, 640], [1380, 600], [1420, 540], [1440, 460], [1420, 380], [1380, 300]];
  split(f, () => {
    f.part(body, SK({ maxShade: 44 }));
    const cid = f.id('mb'); f.defs.push(`<clipPath id="${cid}"><path d="${E.smooth(body)}"/></clipPath>`); f.raw(`<g clip-path="url(#${cid})">`);
    f.raw(`<path d="${E.smooth([[900, 580], [1100, 620], [1300, 600], [1300, 700], [880, 700]])}" fill="${hideS}" opacity="0.45" filter="url(#steamblur2${seed})"/>`); // the barrel turning under
    // the haunch: the great round of the hindquarter from the croup to the stifle, lit on top, its hamstring edge behind
    f.raw(`<path d="${E.smooth([[620, 300], [760, 280], [830, 360], [800, 540], [700, 600], [600, 520]])}" fill="${ltL}" opacity="0.26" filter="url(#steamblur2${seed})"/>`);
    f.stroke([[820, 300], [840, 420], [800, 560], [760, 620]], 3.6, dkL, { op: 0.55 }); // the front edge of the thigh
    f.stroke([[600, 380], [620, 480], [680, 580]], 3, dkL, { op: 0.45 }); // the hamstring groove
    f.part(ell([712, 296], 22, 14, -0.2, 10), SK({ cast: false, inkW: 1.1, fill: mix(hide, '#fff', 0.2), maxShade: 4 })); // the point of the hip, bony
    // the shoulder: the blade laid back from the withers, its spine, the point of the shoulder, the triceps over the elbow
    f.raw(`<path d="${E.smooth([[1290, 260], [1380, 380], [1420, 480], [1360, 560], [1280, 480], [1240, 320]])}" fill="${ltL}" opacity="0.26" filter="url(#steamblur2${seed})"/>`);
    f.stroke([[1290, 250], [1330, 360], [1400, 470]], 3.4, dkL, { op: 0.5 }); // the spine of the blade
    f.stroke([[1250, 300], [1250, 440], [1290, 560], [1320, 610]], 3.6, dkL, { op: 0.55 }); // the back edge of the shoulder and triceps
    f.part(ell([1420, 470], 24, 20, 0.4, 10), SK({ cast: false, inkW: 1.1, fill: mix(hide, '#fff', 0.15), maxShade: 4 })); // the point of the shoulder
    // ribs under the soft skin of the barrel, each lit along its top; the tuck of the flank; the belly's wet hanging folds
    for (let i = 0; i < 8; i++) { const x = 1000 + i * 30; f.stroke([[x - 20, 380 + i * 2], [x - 6, 480], [x - 14, 600 - i * 4]], 3.2, dkL, { op: 0.5 }); f.line([[x - 12, 384 + i * 2], [x + 2, 480]], 1.8, ltL, { op: 0.4 }); }
    f.stroke([[960, 330], [900, 460], [880, 600]], 3, dkL, { op: 0.45 }); f.raw(`<path d="${E.smooth([[840, 470], [920, 440], [960, 560], [880, 620], [820, 580]])}" fill="${hideS}" opacity="0.3" filter="url(#steamblur2${seed})"/>`); // the hollow of the flank
    for (const [a, b, c] of [[[920, 620], [1060, 650], [1220, 652]], [[960, 600], [1080, 628], [1200, 630]]]) f.stroke([a, b, c], 3, dkL, { op: 0.5 }); // folds of wet skin under the belly
    f.raw('</g>');
    // what is left of the coat: islands of dun hair on the shoulder, the haunch and the back, ragged at their edges
    coatPatch([1320, 420], 70, 110, 0.4, { dir: 1.8 }); coatPatch([700, 420], 90, 120, -0.3, { dir: 1.9 }); coatPatch([1000, 340], 70, 30, 0, { dir: 1.6 }); coatPatch([1180, 560], 40, 30, 0.3);
    T.scald(f, [1000, 480], 300, 150, 36, { pink: P.rawL });
    T.blisters(f, [1000, 330], 140, 20, 10, 3, 8, { burst: 0.4 }); T.flakes(f, [860, 320], 80, 20, 8, { col: '#faeee6' });
    f.line([[1060, 640], [1100, 660], [1160, 654], [1220, 668]], 2, mix(hide, '#6a5a8a', 0.5), { op: 0.5 }); // the girth vein
    // the temple brand burned into the hip: a wave in a circle
    { const bc = [660, 400]; f.line(ell(bc, 30, 28, 0, 16).concat([ell(bc, 30, 28, 0, 16)[0]]), 5, '#7a2a24'); f.line([add(bc, [-20, 4]), add(bc, [-9, -9]), add(bc, [2, 4]), add(bc, [13, -9]), add(bc, [22, 2])], 4.4, '#7a2a24'); f.line(ell(bc, 30, 28, 0, 16).slice(2, 7), 1.4, '#f0d0c4', { op: 0.6 }); }
  }, [['spine_1', side([900, 460], [-1, 0], 90)], ['spine_2', side([900, 460], [1, 0], 90)]]);
  // ---- the near leg tops: the hind thigh down to the stifle, the arm down to the elbow, faded out at the top so they melt
  // into the body's masses instead of ending in a hard edge
  const fadeTop = (A, Bk, draw) => { const gid = f.id('fg'), mid = f.id('fm'), m0 = lerp(A, Bk, 0.05), m1 = lerp(A, Bk, 0.45); f.defs.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${m0[0]}" y1="${m0[1]}" x2="${m1[0]}" y2="${m1[1]}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="${mid}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#${gid})"/></mask>`); f.raw(`<g mask="url(#${mid})">`); draw(); f.raw('</g>'); };
  f.bone('leg_hn_1');
  { const [A, Bk] = L.hn; fadeTop(A, Bk, () => f.part(T.mlimb(A, Bk, [[0, 120], [0.4, 112], [1, 62]], [[0, 100], [0.5, 90], [1, 58]], { capK: 0.8, capA: false }), SK({ maxShade: 26, cast: false }))); f.line([lp(A, Bk, 0.3, -70), lp(A, Bk, 0.8, -50)], 2.4, ltL, { op: 0.45 }); f.flat(ell(add(Bk, [10, -6]), 28, 22, 0.4, 10), ltL, { op: 0.3 }); f.line(ell(add(Bk, [10, -2]), 30, 24, 0.4, 10).slice(0, 5), 1.6, dkL, { op: 0.5 }); } // the stifle
  f.bone('leg_fn_1');
  { const [A, Bk] = L.fn; fadeTop(A, Bk, () => f.part(T.mlimb(A, Bk, [[0, 80], [0.5, 74], [1, 58]], [[0, 76], [0.5, 66], [1, 54]], { capK: 0.8, capA: false }), SK({ maxShade: 22, cast: false }))); f.line([add(Bk, [-60, -30]), add(Bk, [-62, 0]), add(Bk, [-40, 20])], 2.4, dkL, { op: 0.6 }); f.flat(ell(add(Bk, [-36, -10]), 22, 18, 0, 10), ltL, { op: 0.25 }); } // the point of the elbow
  // ---- the holed sackcloth blanket and the back-band with its girth round the barrel, the traces' tugs on it
  f.bone('spine_2');
  const bl = [[900, 290], [1010, 302], [1120, 286], [1200, 266], [1220, 330], [1210, 440], [1160, 462, 1], [1100, 450], [1040, 472, 1], [980, 452], [920, 470, 1], [880, 446], [884, 340]];
  f.part(bl, { fill: '#9a8a6a', shadow: '#3a3020', shade: 0.38, tex: 'weave' + seed, texOp: 0.7, maxShade: 30 });
  for (const [c, r] of [[[1000, 380], 14], [[1140, 400], 10], [[930, 420], 8]]) { f.flat(T.lumpy(f, ell(c, r, r * 0.8, 0, 10), 2), hide); f.line(ell(c, r + 1, r * 0.8 + 1, 0, 10), 1.2, '#4a3a28', { op: 0.8 }); }
  for (const x of [940, 1020, 1100, 1170]) f.stroke([[x, 300], [x + 6, 380], [x - 4, 456]], 2.4, '#3a3020', { op: 0.6 });
  X.clothWear(f, bl, [880, 290, 1220, 470], 5, { damp: '#2a2014' });
  { const band = [[1190, 268], [1230, 270], [1250, 420], [1262, 560], [1250, 664], [1210, 664], [1214, 560], [1206, 420]]; f.part(band, { fill: P.leather, shadow: P.leatherD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, maxShade: 14 }); f.stitches([[1214, 280], [1230, 420], [1238, 560], [1232, 650]], '#a08060', 1); f.part([[1200, 520], [1262, 516], [1266, 556], [1204, 560]], { fill: P.iron, shade: 0.4, inkW: 1.2, sharp: true }); f.flat(ell([1232, 538], 12, 9, 0, 8), INK, { op: 0.7 }); // the back-band down over the ribs into the girth, the trace's ring
    f.stroke([[1200, 560], [1150, 600], [1110, 640]], 3, '#5a2a24', { op: 0.6 }); f.flat([[1180, 600], [1130, 636], [1140, 650], [1196, 610]], sore, { op: 0.6 }); } // the girth gall
  // ---- the neck: thick, thrust forward and down into the collar; the mane cooked into a stiff ridge
  f.bone('neck');
  const neck = [[1290, 240], [1380, 252], [1500, 300], [1610, 380], [1700, 460], [1724, 520], [1690, 600], [1630, 620], [1560, 590], [1480, 540], [1420, 500], [1380, 420], [1330, 330]];
  f.part(neck, SK({ maxShade: 30 }));
  f.stroke([[1440, 330], [1520, 400], [1600, 470], [1660, 560]], 3, dkL, { op: 0.45 }); // the jugular groove
  for (let i = 0; i < 5; i++) f.stroke([[1480 + i * 40, 320 + i * 26], [1470 + i * 40, 380 + i * 26], [1490 + i * 38, 450 + i * 22]], 2.4, dkL, { op: 0.4 }); // the neck's folds, pulled
  coatPatch([1560, 420], 60, 40, 0.5, { dir: 2.1 });
  X.peel(f, [1600, 520], 34, 70, { sway: 3 });
  { const crest = []; for (let i = 0; i <= 16; i++) { const q = lerp([1300, 236], [1690, 470], i / 16); crest.push(add(q, [0, -Math.sin(i / 16 * Math.PI) * 30])); } // the mane: a stiff cooked ridge of short clumps
    for (let i = 0; i < crest.length - 1; i++) { const a = crest[i], b = crest[i + 1], m = add(lerp(a, b, 0.5), [-6, -26 - (i % 3) * 7]); f.part([add(a, [0, 6]), [...m, 1], add(b, [0, 6])], { fill: '#5a4038', shadow: '#1a0e0a', shade: 0.4, inkW: 1.1, cast: false, k: 0.4 }); }
    f.line(crest.map(q => add(q, [0, 3])), 4, '#3a2620'); }
  T.blisters(f, [1500, 340], 60, 20, 8, 3, 7);
  // ---- the collar round the base of the neck: padded leather boiled hard and cracked, the wooden hames over it, the bell
  f.bone('collar');
  const cl = [[1340, 250], [1392, 244], [1432, 290], [1480, 400], [1500, 520], [1490, 620], [1452, 640], [1440, 560], [1420, 440], [1380, 330], [1350, 290]];
  f.part(cl, { fill: P.leather, shadow: P.leatherD, shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, maxShade: 22 });
  f.part([[1372, 264], [1404, 260], [1446, 330], [1478, 450], [1476, 590], [1462, 596], [1452, 450], [1420, 340], [1384, 290]], { fill: P.leatherL, shadow: P.leatherD, shade: 0.4, cast: false, inkW: 1.1 }); // the rolled pad
  for (const [a, b] of [[[1390, 280], [1404, 310]], [[1446, 360], [1462, 370], [1468, 392]], [[1476, 470], [1488, 488]], [[1410, 256], [1430, 246]]]) f.line([a, b, b], 1.8, '#1a0e08');
  f.stitches([[1366, 262], [1414, 290], [1456, 380], [1478, 480], [1480, 600]], '#c8a878', 1.2);
  f.part([[1362, 196], [1388, 190], [1436, 270], [1474, 380], [1496, 520], [1480, 524], [1458, 384], [1418, 276]], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.3 }); // the hame, standing up off the collar: the highest point, 1.4
  f.part([[1350, 184], [1394, 176], [1398, 200], [1354, 206]], { fill: P.iron, shade: 0.4, inkW: 1.1, sharp: true });
  f.part(ell([1474, 460], 13, 15, 0, 10), { fill: P.iron, shade: 0.4, inkW: 1.1, cast: false }); // the trace tug on the hame
  { const bb = [1500, 640]; f.line([[1490, 620], bb], 2.4, P.iron); f.part([add(bb, [-16, 0]), add(bb, [-13, -14]), add(bb, [13, -14]), add(bb, [16, 0]), add(bb, [22, 26]), add(bb, [-22, 26])], { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, inkW: 1.2, tex: 'hammer' + seed, texOp: 0.5 }); f.line([add(bb, [-22, 26]), add(bb, [22, 26])], 2, INK); f.flat(ell(add(bb, [0, 30]), 5, 5, 0, 8), P.bronzeD); T.verdigris(f, add(bb, [0, 8]), 12, 8, 3); }
  // ---- the head: long and bony, carried low, the long ears laid flat back, lips peeled back from long teeth
  const F = frame(POLL, hA, 1);
  f.bone('ears');
  for (const [dy, c] of [[-14, mix(hide, '#6a3a48', 0.25)], [6, hide]]) { const e = [[10, dy - 14], [-70, dy - 22], [-160, dy + 2], [-190, dy + 16], [-160, dy + 28], [-70, dy + 16], [10, dy + 12]]; f.part(F(e), SK({ fill: c, maxShade: 10 })); f.flat(F([[0, dy - 4], [-70, dy - 10], [-150, dy + 8], [-70, dy + 6]]), '#8a4a52', { op: 0.5 }); coatPatch(F([[-170, dy + 14]])[0], 20, 9, hA + 0.2, { dir: hA + Math.PI }); } // long, laid flat back along the neck, the inner ear raw, a tuft at the tip
  f.bone('jaw');
  const jaw = [[60, 64], [140, 86], [220, 70], [290, 60], [330, 56], [336, 70], [300, 84], [220, 96], [140, 112], [70, 100]];
  f.part(F(jaw), SK({ fill: mix(hide, '#6a3a48', 0.1), maxShade: 10 }));
  for (let i = 0; i < 5; i++) f.part(F([[262 + i * 14, 60], [266 + i * 14, 46], [274 + i * 14, 60]]), { fill: '#e4d6b8', shadow: '#8a7a5a', shade: 0.3, inkW: 0.9, cast: false, hatch: false }); // long lower teeth
  f.part(F([[250, 64], [334, 58], [330, 72], [256, 76]]), { fill: '#7a2a2e', shade: 0.3, inkW: 1, cast: false }); // the lower gum
  f.bone('head');
  // the skull: poll, the broad forehead, the long straight face to the muzzle; the big round jowl below; the throatlatch
  const skull = [[-20, -40], [40, -60], [110, -58], [200, -46], [280, -38], [320, -30], [346, -8], [348, 16], [338, 40], [300, 48], [240, 52], [180, 64], [130, 100], [70, 104], [20, 80], [-10, 40], [-30, 0]];
  f.part(F(skull), SK({ maxShade: 22 }));
  f.raw(`<path d="${E.smooth(F([[30, 20], [110, 30], [130, 90], [70, 100], [20, 70]]))}" fill="${hideS}" opacity="0.35" filter="url(#steamblur${seed})"/>`); // the round of the jowl turning away
  f.stroke(F([[100, 34], [150, 70], [130, 100]]), 3, dkL, { op: 0.55 }); // the jowl's edge
  f.stroke(F([[60, -10], [140, -4], [210, 6]]), 2.6, dkL, { op: 0.5 }); // the facial crest
  f.line(F([[40, -56], [140, -52], [260, -40]]), 3, ltL, { op: 0.5 }); // the bony bridge of the nose, lit
  for (let i = 0; i < 3; i++) f.line(F([[30 + i * 20, -30], [26 + i * 20, -54]]), 1.2, dkL, { op: 0.4 }); // creases over the brow
  coatPatch(F([[150, -30]])[0], 50, 18, hA, { dir: hA });
  // the muzzle: the soft nose, the big flared nostril, the upper lip peeled back off long yellow teeth, the gums showing
  f.part(F([[260, -36], [320, -30], [348, -6], [350, 20], [330, 34], [280, 30], [250, 6]]), SK({ fill: mix(hide, '#c88a88', 0.25), cast: false, inkW: 1.2, maxShade: 8 }));
  f.flat(F(ell([316, -6], 14, 7, 0.5, 10)), '#3a1a1a'); f.line(F(ell([316, -6], 18, 10, 0.5, 10).slice(5, 10)), 1.6, INK, { op: 0.7 }); // the nostril, flared
  f.part(F([[248, 36], [300, 34], [338, 40], [340, 52], [300, 54], [250, 52]]), { fill: '#7a2a2e', shade: 0.3, inkW: 1, cast: false });
  for (let i = 0; i < 6; i++) f.part(F([[252 + i * 14, 40], [256 + i * 14, 58], [264 + i * 14, 40]]), { fill: '#e4d6b8', shadow: '#8a7a5a', shade: 0.3, inkW: 0.9, cast: false, hatch: false });
  f.part(F([[250, 22], [300, 18], [344, 24], [344, 36], [300, 34], [252, 38]]), SK({ fill: '#e0a49c', cast: false, inkW: 1.2, maxShade: 4 })); // the peeled-back lip
  for (let i = 0; i < 4; i++) f.line(F([[300 + i * 8, 6], [304 + i * 8, 16]]), 1, INK, { op: 0.5 }); // whisker pits, the whiskers boiled off
  // the eye: deep in a bony socket, half shut, wet, rimmed raw; the blinker over it
  f.part(F(ell([70, -22], 22, 15, 0, 12)), SK({ fill: mix(hide, '#6a3a48', 0.3), cast: false, inkW: 1.2, maxShade: 4 }));
  f.flat(F(ell([72, -20], 13, 7, 0, 10)), '#2a0e12'); f.flat(F(ell([76, -22], 3, 2, 0, 6)), '#fff', { op: 0.85 });
  f.stroke(F([[50, -34], [72, -38], [94, -30]]), 3, '#6a3a40', { op: 0.7 }); f.line(F([[52, -14], [72, -10], [92, -16]]), 1.6, '#c45a5a', { op: 0.7 });
  // the bridle: crown strap behind the ears, cheekpiece, noseband, browband; the blinker; a ring at the bit
  const strap = pts => { f.stroke(F(pts), 11, INK); f.stroke(F(pts), 8, P.leather); f.line(F(pts), 1.2, P.leatherL, { op: 0.6 }); };
  strap([[0, -56], [0, 0], [20, 84]]); strap([[240, -42], [246, 0], [250, 50]]); strap([[0, 10], [120, 14], [244, 6]]); strap([[0, -52], [60, -60]]);
  f.part(F([[30, -62], [110, -62], [116, -18], [36, -12]]), { fill: P.leatherD, shadow: '#120a06', shade: 0.4, inkW: 1.3, tex: 'mottle' + seed, texOp: 0.5 }); // the blinker
  f.line(F([[36, -56], [104, -56]]), 1.4, P.leatherL, { op: 0.6 }); f.rivet(F([[44, -50]])[0], 3, P.bronzeL); f.rivet(F([[100, -50]])[0], 3, P.bronzeL);
  { const r0 = F([[250, 50]])[0]; const e = ell(r0, 12, 12, 0, 12); f.line(e.concat([e[0]]), 5, INK); f.line(e.concat([e[0]]), 3, P.iron); }
  X.peel(f, F([[150, 60]])[0], 24, 50, { sway: 2 });
  T.drip(f, F([[330, 60]])[0], 1.2); T.drip(f, F([[310, 64]])[0], 1);

  // ---- near hind leg (the broken hobble), the traces, near front leg
  leg('hn', SK(), { split: true });
  f.bone('leg_hn_3');
  { const fl = L.hn[3]; for (let i = 0; i < 3; i++) { const e = ell(add(fl, [-6 + i * 10, -18 + i * 7]), 12, 7, 0.4, 10); f.line(e.concat([e[0]]), 4.4, INK); f.line(e.concat([e[0]]), 2.8, P.iron); } T.chainLinks(f, [add(fl, [16, 0]), add(fl, [34, 34]), add(fl, [30, 70])], 8, P.iron); } // the broken hobble, its chain hanging
  f.bone('leg_hn_1');
  X.peel(f, lp(L.hn[0], L.hn[1], 0.55, 40), 40, 80, { sway: 3 });
  // the traces: rope and leather, taut from the hame's tug along the flank, through the back-band ring, back to the hook
  f.bone('spine_1');
  { const tr = [[1474, 460], [1232, 538], [1000, 590], [780, 650], [560, 730], HOOK]; f.stroke(tr, 18, INK); f.stroke(tr, 14, P.leather); f.line(tr.map(q => add(q, [0, -4])), 1.6, P.leatherL, { op: 0.6 }); f.stitches(tr.map(q => add(q, [0, 3])), '#a08060', 0.9);
    // where they rubbed, the hide has peeled raw in a long sore along the flank
    f.flat([[1180, 536], [1000, 574], [820, 624], [826, 640], [1000, 600], [1180, 556]], sore, { op: 0.6 });
    X.peel(f, [1060, 596], 40, 70, { sway: -2, bed: false }); X.peel(f, [900, 626], 34, 60, { sway: 3, bed: false }); }
  leg('fn', SK(), { shoe: true });
  f.bone('leg_fn_2'); T.blisters(f, lp(L.fn[1], L.fn[2], 0.3), 16, 26, 5, 3, 7);
  // ---- steam off the back
  f.bone('spine_2');
  T.wisp(f, [1000, 290], 130, { w: 10, op: 0.32, drift: -20 }); T.wisp(f, [1180, 260], 110, { w: 9, op: 0.28, drift: 12 });
  f.bone('spine_1');
  T.wisp(f, [740, 260], 120, { w: 9, op: 0.3, drift: -10 });
  f.bone('root');
  f.flat(ell([1000, gy + 4], 620, 14, 0, 18), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ THE STRIGIL-MASTER (elite 2.1)
// The temple's chief masseur, who oiled the bathers and scraped them clean with a bronze strigil. He has not stopped at
// the dirt. A huge, heavy-shouldered bald man leaning forward over an unseen massage slab, knees bent, the weight on the
// front foot, like a man about to lean into his work: the near arm raised, the long curved strigil held up ready to rake;
// the far hand forward, pressing down on the slab. Fire's mark, pushed hard: his hands are cooked and swollen to twice
// their size, and the skin of both has come away whole and hangs from his wrists like a pair of empty gloves, leaving raw
// boiled-red hands. Chest and arms boiled pink-white and peeling; water keeps the folds of his belly swollen, wrinkled and
// steaming; oil and sweat run down him. Linen loincloth under a wide leather belt and a short leather apron dark with
// oil; a second, broken strigil in the belt; a bronze oil flask on a cord; a sponge in a net; leather wristbands sunk in
// the wrists; a marble temple token on a thong; a towel over the shoulder; burst blisters down the shins; wooden bath
// clogs, one strap broken; a bronze ring in one ear. A shaved head with a sweat rag tied round it, a heavy patient face,
// eyes half shut in the steam, a split lower lip.
// Rig: standard humanoid + strigil (parent hand_n) + glove_n, glove_f (the hanging skins, parent hand_n / hand_f) +
// apron, flask (parent pelvis) + towel, token (parent torso). Motion: idle drawing the strigil slowly down his own forearm
// (near arm lowers across the far forearm); attack a long raking scrape (upperarm_n / forearm_n sweep down and forward).
function strigilMaster() {
  const seed = 322, h = TIERS.elite[1];
  const f = new Fig(T.base(seed, h, { grimeY: 1120 }));
  X.textures(f);
  const gy = f.o.groundY, H = 206;
  const skin = '#e4b8a8', skinS = '#6a3e48', raw = '#a23e30', rawS = '#3e1010'; // consistency pass 2026-11-25: deeper pink, raw hands darker and less glove-bright
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: '#84424e', shade: 0.36, tex: 'mottle' + seed, texOp: 0.42, maxShade: 60 }, o);
  const RAW = (o = {}) => Object.assign({ fill: raw, shadow: rawS, shade: 0.34, tex: 'pores' + seed, texOp: 0.6, maxShade: 20 }, o);
  // consistency pass 2026-11-25: the boiled hands read as clean red rubber gloves. meat() breaks each one up: clotted
  // dark blood soaking the grooves, blanched dead patches, burst blisters with torn rims, a scrap of skin still stuck on,
  // a glint of exposed knuckle (local random stream, so the rest of the figure is unchanged)
  const rM = E.rng(3227);
  const meat = (c, rx, ry, a, k) => {
    for (let i = 0; i < 5; i++) { const q = add(c, rot([(rM() - 0.5) * rx * 1.4, (rM() - 0.5) * ry * 1.4], a)), r = 6 + rM() * 10; X.softAt(f, ell(q, r * 1.5, r, a + rM(), 10), '#3a0808', 0.5); }
    for (let i = 0; i < 3; i++) { const q = add(c, rot([(rM() - 0.5) * rx * 1.2, (rM() - 0.5) * ry * 1.2], a)), r = 5 + rM() * 7; f.flat(ell(q, r * 1.3, r, a + rM() * 2, 9).map(p => add(p, [(rM() - 0.5) * 3, (rM() - 0.5) * 3])), '#d6a090', { op: 0.55 }); } // blanched, dead
    for (let i = 0; i < 3; i++) { const q = add(c, rot([(rM() - 0.5) * rx, (rM() - 0.5) * ry], a)), r = 4 + rM() * 4; f.flat(ell(q, r, r * 0.8, 0, 8), '#5a0c10', { op: 0.85 }); f.line(ell(q, r + 1.6, r * 0.8 + 1.6, 0, 9).slice(0, 6), 1.3, '#f0d8cc', { op: 0.75 }); } // burst blisters, the torn rim
    const sq = add(c, rot([-rx * 0.35, ry * 0.25 * (k === 1 ? 1 : -1)], a)); f.flat([sq, add(sq, rot([18, -4], a)), add(sq, rot([26, 8], a)), add(sq, rot([10, 14], a)), add(sq, rot([-4, 8], a))], '#ead2c6', { op: 0.9 }); f.line([add(sq, rot([18, -4], a)), add(sq, rot([26, 8], a)), add(sq, rot([10, 14], a))], 1, INK, { op: 0.6 }); // a scrap of skin still stuck on
    for (let i = 0; i < 4; i++) { const q = add(c, rot([(rM() - 0.4) * rx, (rM() - 0.5) * ry], a)); f.flat(ell(q, 2.2, 1.4, a, 6), '#fff4ec', { op: 0.85 }); } // wet glints
  };
  const fold = (pts, w = 3.4) => { f.stroke(pts, w, '#5a2a36'); f.line(pts.map(q => add(q, [2, -5])), 1.8, '#fbe8e0', { op: 0.55 }); };
  const DX = -110, N = [706 + DX, 430], C = [618 + DX, 566], Pv = [528 + DX, 788];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.06, 0.12), SF = S.at(0.42, 0.1);
  const HN = [546 + DX, 800], KN = [676 + DX, 1040], AN = [640 + DX, 1276];  // the near leg forward, bent, carrying him
  const HF = [520 + DX, 792], KF = [452 + DX, 1056], AF = [372 + DX, 1276];  // the far leg back
  const EN = [820 + DX, 600], WN = [936 + DX, 452];                          // the strigil arm forward, the fist raised before him at the height of his chin
  const EF = [870 + DX, 620], WF = [990 + DX, 730];                          // the far arm forward, the hand pressing on the slab
  const hd = E.norm(sub(N, C)), HC = add(N, mul(hd, H * 0.44)), hA = 0.42, neck0 = S.at(0.12, -0.03);
  T.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('strigil', WN, 'hand_n').joint('glove_n', add(WN, [-30, 30]), 'hand_n').joint('glove_f', add(WF, [-40, 20]), 'hand_f');
  f.joint('apron', S.at(0.6, 0.86), 'pelvis').joint('flask', S.at(-0.3, 0.92), 'pelvis').joint('towel', S.at(-0.3, 0.05), 'torso').joint('token', S.at(0.4, -0.02), 'torso');
  const clog = (A, s, dk, broken) => {
    f.part([[A[0] - s * 0.5, gy - s * 0.22], [A[0] + s * 1.3, gy - s * 0.26], [A[0] + s * 1.36, gy, 1], [A[0] - s * 0.56, gy, 1]], { fill: mix(P.wood, '#000', dk), shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.3 });
    f.line([[A[0] - s * 0.4, gy - s * 0.16], [A[0] + s * 1.2, gy - s * 0.2]], 1.4, P.woodL, { op: 0.5 });
    if (!broken) { f.stroke([[A[0] + s * 0.1, gy - s * 0.24], [A[0] + s * 0.5, gy - s * 0.62], [A[0] + s * 0.9, gy - s * 0.26]], s * 0.2, INK); f.stroke([[A[0] + s * 0.1, gy - s * 0.24], [A[0] + s * 0.5, gy - s * 0.6], [A[0] + s * 0.9, gy - s * 0.26]], s * 0.15, P.leather); }
    else { f.stroke([[A[0] + s * 0.1, gy - s * 0.24], [A[0] + s * 0.3, gy - s * 0.56]], s * 0.15, P.leather); f.stroke([[A[0] + s * 0.9, gy - s * 0.26], [A[0] + s * 1.1, gy - s * 0.1], [A[0] + s * 1.3, gy - s * 0.06]], s * 0.14, P.leather); } // the strap snapped, its end trailing
  };

  // ---- far arm (behind the chest), forward to the slab: the wristband, the raw hand pressing down
  X.muscleArm(f, SF, EF, WF, 150, 124, SK({ fill: mix(skin, skinS, 0.14) }), '_f', { castShadow: false });
  f.bone('forearm_f');
  T.peelSheet(f, lp(EF, WF, 0.3, 40), 34, 70, { sway: 3 }); T.scald(f, lp(EF, WF, 0.5), 50, 20, 8, { ang: ang(EF, WF) });
  // ---- far leg, back
  T.legRig(f, HF, KF, AF, 100, 190, 128, SK({ fill: mix(skin, skinS, 0.18) }), '_f', { thigh: 0.14, calf: 0.1, swell: 0.4 });
  T.legDetail(f, HF, KF, AF, 128, SK({ fill: mix(skin, skinS, 0.18) }), '_f', { calf: 0.12 });
  f.bone('shin_f'); T.blisters(f, lp(KF, AF, 0.5, 20), 20, 60, 6, 4, 9, { burst: 0.6 });
  f.bone('foot_f'); clog(AF, 100, 0.2, false);
  // ---- near leg, forward and bent, carrying him; burst blisters down the shin
  T.legRig(f, HN, KN, AN, 102, 200, 134, SK(), '_n', { thigh: 0.16, calf: 0.12, swell: 0.4 });
  T.legDetail(f, HN, KN, AN, 134, SK(), '_n', { calf: 0.14 });
  f.bone('shin_n'); T.blisters(f, lp(KN, AN, 0.45, 30), 20, 80, 9, 4, 10, { burst: 0.7 }); T.scald(f, lp(KN, AN, 0.5), 30, 80, 10, { ang: ang(KN, AN) }); T.wrinkles(f, lp(KN, AN, 0.7), AN, 90, 4);
  f.bone('thigh_n'); T.peelSheet(f, lp(HN, KN, 0.6, -40), 30, 70, { sway: 4 }); T.scald(f, lp(HN, KN, 0.5), 40, 60, 10, { ang: ang(HN, KN) });
  f.bone('foot_n'); clog(AN, 104, 0, true);
  // ---- torso: huge, heavy-shouldered, the chest and belly hanging forward over the belt, swollen and pruned in folds
  f.bone('torso');
  // independent review: a masseur's heavy build (the first build was a smooth pink sack): the trapezius sloping thick into
  // the neck, the shoulder blade, heavy pectorals sagging over their fold, the gut hanging in rolls over the belt
  X.bfTorso(f, S, 'fat', SK({ shadow: '#9a5a66', maxShade: 46, texOp: 0.5, fold: '#5a2a36' }), { occ: false });
  { const tr = [S.at(-0.66, -0.06), S.at(-0.2, -0.16), S.at(0.3, -0.1), S.at(0.36, 0.06), S.at(-0.1, 0.12), S.at(-0.6, 0.12)]; f.part(T.lumpy(f, tr, 3), SK({ inkW: 0, inkHeavy: 0, cast: false, hatch: false, maxShade: 12 })); f.stroke([S.at(-0.6, 0.12), S.at(-0.2, 0.14), S.at(0.3, 0.06)], 3.4, '#5a2a36', { op: 0.6 }); } // the trapezius
  // the broad back he turns to us: the shoulder blade's ridge and its shadow, the spine's furrow, the lats, fat rolling
  // over the belt at the loins, the back's lit edge
  { const bl = [S.at(-0.3, 0.08), S.at(-0.62, 0.14), S.at(-0.72, 0.3), S.at(-0.6, 0.44), S.at(-0.34, 0.42)]; f.part(bl, SK({ inkW: 0, inkHeavy: 0, cast: false, hatch: false, maxShade: 14, fill: mix(skin, '#fff', 0.08) }));
    fold([S.at(-0.3, 0.1), S.at(-0.5, 0.26), S.at(-0.34, 0.42)], 3.6); f.line([S.at(-0.64, 0.16), S.at(-0.7, 0.3)], 2.4, '#fbe8e0', { op: 0.5 }); }
  f.stroke([S.at(-0.8, 0.04), S.at(-0.84, 0.3), S.at(-0.78, 0.56), S.at(-0.74, 0.72)], 4, '#5a2a36', { op: 0.55 }); // the spine's furrow
  fold([S.at(-0.2, 0.5), S.at(-0.4, 0.58), S.at(-0.7, 0.6)], 3); // the lat's lower edge
  for (const v of [0.66, 0.74]) fold([S.at(-0.1, v), S.at(-0.5, v + 0.03), S.at(-0.86, v)], 4); // rolls over the belt
  T.sheen(f, [S.at(-0.9, 0.1), S.at(-0.94, 0.3), S.at(-0.92, 0.5), S.at(-0.86, 0.66)], 4, 0.55);
  X.peel(f, S.at(-0.5, 0.36), 44, 100, { sway: -3 }); X.peel(f, S.at(-0.1, 0.5), 38, 80, { sway: 2 });
  // boiled mottling: blotches of boiled red and dead white over the pink
  for (let i = 0; i < 14; i++) { const c = S.at(T.R(f, -0.7, 1.1), T.R(f, 0.05, 0.95)); X.softAt(f, T.lumpy(f, ell(c, T.R(f, 8, 18), T.R(f, 6, 12), f.r() * 3, 10), 3), '#c25460', 0.44); }
  T.wrinkles(f, S.at(0.7, 0.5), S.at(0.8, 0.86), 160, 12, { w: 1.2 });
  T.scald(f, S.at(0.2, 0.4), 160, 160, 34);
  T.peelSheet(f, S.at(0.5, 0.2), 40, 90, { sway: 5 }); T.peelSheet(f, S.at(-0.2, 0.3), 34, 80, { sway: -4 }); T.peelSheet(f, S.at(0.9, 0.62), 30, 60, { sway: 3, bed: false });
  T.blisters(f, S.at(0.0, 0.16), 60, 30, 9, 4, 9);
  T.seam(f, [S.at(-0.4, 0.5), S.at(-0.3, 0.6), S.at(-0.42, 0.72), S.at(-0.34, 0.84)], 3);
  // oil and sweat running down him: glossy runs and beads
  for (const [u, v, l] of [[0.3, 0.1, 140], [0.0, 0.3, 120], [0.6, 0.5, 100], [-0.3, 0.2, 160]]) { const p0 = S.at(u, v); f.stroke([p0, add(p0, [3, l * 0.5]), add(p0, [-2, l])], 5, '#f8f0e0', { op: 0.35 }); f.line([p0, add(p0, [3, l * 0.5])], 1.4, '#fff', { op: 0.6 }); }
  T.beads(f, S.at(0.2, 0.3), 140, 120, 24, 2);
  T.sheen(f, [S.at(-0.7, 0.06), S.at(-0.8, 0.2), S.at(-0.84, 0.4), S.at(-0.8, 0.6)], 4.4, 0.55);
  // (consistency pass) value for the mass: the belly's underside and the flank turned from the light fall into a soft
  // form shadow, the chest's top plane and the shoulder take the light, so he reads as a heavy round body, not a flat pink
  X.softAt(f, [S.at(0.1, 0.78), S.at(0.6, 0.74), S.at(1.0, 0.82), S.at(0.9, 1.0), S.at(0.3, 1.02), S.at(-0.1, 0.92)], '#5a1e2a', 0.55);
  X.softAt(f, [S.at(-0.9, 0.2), S.at(-0.6, 0.3), S.at(-0.5, 0.6), S.at(-0.8, 0.78), S.at(-1.0, 0.5)], '#5a1e2a', 0.4);
  X.softAt(f, [S.at(-0.3, -0.05), S.at(0.3, -0.08), S.at(0.5, 0.12), S.at(0.0, 0.2), S.at(-0.4, 0.16)], '#fff2ea', 0.32);
  for (const [u, v, r] of [[-0.46, 0.2, 18], [-0.72, 0.46, 14], [-0.3, 0.58, 15], [0.3, 0.84, 12]]) { const q = S.at(u, v); f.flat(ell(q, r * 1.4, r, 0.4, 10).map((p, i) => i % 2 ? add(p, [2, -2]) : p), raw, { op: 0.75 }); f.line(ell(q, r * 1.5, r * 1.1, 0.4, 12).slice(0, 8), 1.6, '#f6e2d8', { op: 0.85 }); } // patches where the skin has sloughed: raw red under a pale curled rim
  // ---- the loincloth, belt and the short leather apron dark with oil
  f.bone('pelvis');
  f.part([S.at(-0.66, 0.84), S.at(0.9, 0.82), S.at(0.96, 1.0), [660, 900], [560, 896], [470, 880], S.at(-0.72, 1.04)], T.LIN(f, { fill: '#d2c8b6', maxShade: 30 }));
  f.stroke([[560, 850], [600, 896]], 2.2); f.stroke([[500, 840], [480, 878]], 2);
  f.part([S.at(-0.72, 0.78), S.at(0.96, 0.74), S.at(1.0, 0.86), S.at(-0.74, 0.9)], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.55 });
  f.stitches([S.at(-0.7, 0.8), S.at(0.96, 0.76)], '#a08060', 1.2); f.stitches([S.at(-0.72, 0.88), S.at(0.98, 0.84)], '#a08060', 1.2);
  f.part([S.at(0.36, 0.73), S.at(0.6, 0.73), S.at(0.6, 0.88), S.at(0.36, 0.88)], { fill: P.bronze, shadow: P.bronzeD, shade: 0.4, inkW: 1.3, sharp: true });
  T.verdigris(f, S.at(0.48, 0.8), 14, 10, 3);
  // the broken strigil tucked in the belt: a snapped bronze blade standing up behind the buckle
  { const b0 = S.at(-0.2, 0.84); f.part([add(b0, [-8, 30]), add(b0, [8, 30]), add(b0, [10, -40]), add(b0, [24, -76]), add(b0, [14, -82]), [...add(b0, [-2, -56]), 1], add(b0, [-10, -20])], { fill: P.bronze, shadow: P.bronzeD, shade: 0.4, inkW: 1.3 }); f.line([add(b0, [4, -30]), add(b0, [16, -72])], 1.4, P.bronzeL, { op: 0.7 }); T.verdigris(f, add(b0, [2, -10]), 6, 14, 3); }
  // the sponge in a net hanging at the hip
  { const sp = S.at(0.0, 0.96); f.line([sp, add(sp, [0, 30])], 2, '#5a4a36'); const c = add(sp, [0, 64]); f.part(T.lumpy(f, ell(c, 34, 30, 0, 14), 6), { fill: '#c8a868', shadow: '#5a4020', shade: 0.4, tex: 'pores' + seed, texOp: 0.9, inkW: 1.3 }); for (let i = 0; i < 5; i++) { f.line([add(c, [-30 + i * 14, -26]), add(c, [-20 + i * 12, 28])], 1.2, '#4a3a28', { op: 0.8 }); f.line([add(c, [-32, -18 + i * 12]), add(c, [32, -22 + i * 12])], 1.2, '#4a3a28', { op: 0.8 }); } T.drip(f, add(c, [6, 30]), 1.2); }
  // the gut, swollen and wrinkled, hanging out over the belt's front: its lower fold steaming, the navel in its roll
  f.bone('torso');
  { const g = [S.at(0.3, 0.6), S.at(0.9, 0.6), S.at(1.18, 0.7), S.at(1.2, 0.84), S.at(1.02, 0.94), S.at(0.6, 0.94), S.at(0.3, 0.86)];
    f.part(T.lumpy(f, g, 4), SK({ shadow: '#9a5a66', maxShade: 26, texOp: 0.5 }));
    fold([S.at(0.36, 0.86), S.at(0.7, 0.95), S.at(1.04, 0.93), S.at(1.2, 0.84)], 4); fold([S.at(0.4, 0.66), S.at(0.8, 0.7), S.at(1.12, 0.72)], 3);
    f.flat(ell(S.at(0.92, 0.78), 12, 7, 0.2, 8), '#4a1a24', { op: 0.8 });
    T.wrinkles(f, S.at(0.6, 0.72), S.at(1.0, 0.88), 120, 9, { w: 1.1 }); T.blisters(f, S.at(0.8, 0.9), 70, 10, 6, 3, 7, { burst: 0.6 });
    T.wisp(f, S.at(1.0, 0.92), 90, { w: 10, op: 0.3, drift: 16 }); }
  f.bone('apron');
  const ap0 = S.at(0.5, 0.86), ap1 = S.at(1.0, 0.84);
  const ap = [ap0, ap1, add(ap1, [10, 120]), add(ap1, [-6, 150], 1), add(ap1, [-40, 140]), add(ap0, [-20, 156], 1), add(ap0, [-14, 100])];
  f.part(ap, { fill: '#3a2820', shadow: '#120a06', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 20 });
  f.line([add(ap0, [6, 20]), add(ap0, [0, 130])], 1.6, '#7a5a44', { op: 0.6 }); f.line([add(ap1, [-10, 30]), add(ap1, [-16, 130])], 1.6, '#7a5a44', { op: 0.5 });
  for (const [dx, dy] of [[20, 60], [40, 110], [60, 40]]) f.flat(T.lumpy(f, ell(add(ap0, [dx, dy]), 14, 20, 0.2, 10), 3), '#f0e0b0', { op: 0.16 }); // oil sheen
  f.line([add(ap0, [30, 50]), add(ap0, [40, 120])], 3, '#f8f0d0', { op: 0.3 });
  f.bone('flask');
  { const fl = S.at(-0.3, 0.92); f.line([fl, add(fl, [-4, 50])], 2, '#3a2a20'); const c = add(fl, [-4, 84]); f.part(T.lumpy(f, ell(c, 26, 30, 0, 14), 2), { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, tex: 'hammer' + seed, texOp: 0.6, inkW: 1.3 }); f.part([add(c, [-10, -40]), add(c, [10, -40]), add(c, [8, -26]), add(c, [-8, -26])], { fill: P.bronzeD, shade: 0.4, inkW: 1.1, cast: false, sharp: true }); T.verdigris(f, add(c, [-6, 10]), 12, 14, 4); f.flat(ell(add(c, [10, -10]), 5, 8, 0.3, 8), P.bronzeL, { op: 0.6 }); f.stroke([add(c, [8, -24]), add(c, [12, 6]), add(c, [10, 40])], 3, '#f0e0b0', { op: 0.5 }); }

  // ---- the head: shaved, a sweat rag tied round it, a heavy patient face, eyes half shut, a split lower lip
  f.bone('head');
  f.part(K.chain([S.at(-0.1, 0.06), add(HC, rot([-H * 0.18, H * 0.26], hA))], [230, 190]), SK());
  fold([S.at(-0.5, 0.0), add(HC, rot([-H * 0.36, -H * 0.08], hA))], 3); // the trapezius rolling up into the back of the skull
  const hF = X.face(f, HC, H, hA, { skin, jaw: 1.3, chin: 0.02, nose: 1.12, hook: -0.1, mouth: 'set', squint: 0.74, browDown: 0.04, age: true, lips: true, iris: '#2a1a18', eyeWhite: '#e2d2c8', hairCol: skin, browCol: '#8a6a5a', browW: 0.04 });
  f.part(hF([[-0.36, 0.08], [-0.44, -0.2], [-0.32, -0.42], [-0.04, -0.54], [0.2, -0.48], [0.3, -0.32], [0.1, -0.36], [-0.12, -0.34], [-0.26, -0.12], [-0.3, 0.1]]), SK({ fill: mix(skin, '#fff', 0.12), cast: false, inkW: 0, maxShade: 10 })); // the shaved dome, lit
  f.part(hF([[0.0, -0.34], [-0.12, -0.36], [-0.3, -0.24]]).concat(hF([[-0.32, -0.18], [-0.12, -0.3], [0.0, -0.28]])), { fill: '#8a8070', shade: 0.3, inkW: 0, cast: false }); // stubble shadow
  for (const [x, w] of [[0.11, 0.075], [0.295, 0.032]]) f.part(hF([[x - w, -0.08], [x, -0.1], [x + w, -0.08], [x + w * 0.9, -0.055], [x, -0.05], [x - w * 0.9, -0.054]]), SK({ fill: '#e4b2a6', cast: false, inkW: 1.2, maxShade: 4 })); // heavy lids
  f.line(hF([[0.22, 0.3], [0.24, 0.33], [0.23, 0.36]]), 2, '#7a1a1a'); f.flat(hF(ell([0.235, 0.33], 0.012, 0.018, 0, 6)), P.raw); // the split in the lower lip
  for (let i = 0; i < 3; i++) f.line(hF([[0.02, -0.22 - i * 0.05], [0.18, -0.24 - i * 0.05]]), 1.4, INK, { op: 0.45 });
  f.line(hF([[0.27, 0.12], [0.22, 0.22], [0.2, 0.3]]), 2.2, '#6a4048', { op: 0.5 });
  T.beads(f, hF([[0.1, -0.1]])[0], 50, 30, 14, 1.8);
  T.blisters(f, hF([[-0.2, -0.3]])[0], 30, 20, 5, 4, 8);
  // the bronze ring in the ear (the ear is hidden under the rag's knot side: the ring hangs below the lobe)
  { const lob = hF([[-0.2, 0.18]])[0]; const e = ell(add(lob, [0, 12]), 9, 11, 0, 12); f.line(e.concat([e[0]]), 5, INK); f.line(e.concat([e[0]]), 3, P.bronze); f.line(e.slice(7, 11), 1.2, P.bronzeL); }
  // the sweat rag tied round the shaved head, soaked dark, the knot and ends hanging plumb behind
  { const band = [[0.34, -0.3], [0.1, -0.4], [-0.2, -0.38], [-0.44, -0.22], [-0.46, -0.08], [-0.2, -0.22], [0.1, -0.26], [0.34, -0.18]]; f.part(hF(band), T.LIN(f, { fill: '#b8ae9a', shadow: '#4e4440', maxShade: 10 }));
    f.stroke(hF([[0.3, -0.24], [0.0, -0.32], [-0.3, -0.26]]), 2); f.flat(hF([[0.1, -0.3], [-0.1, -0.32], [-0.1, -0.26], [0.1, -0.24]]), '#5a4e44', { op: 0.4 });
    const kn = hF([[-0.46, -0.14]])[0]; f.part(ell(kn, 16, 13, 0, 10), T.LIN(f, { fill: '#a89e8a', cast: false })); f.stroke([kn, add(kn, [-10, 40]), add(kn, [-6, 70])], 10, '#a89e8a'); f.stroke([kn, add(kn, [8, 36]), add(kn, [10, 56])], 9, '#988e7a'); }
  // ---- the marble token on a thong round the neck, hanging plumb clear of the leaning chest
  f.bone('token');
  { const t0 = S.at(0.4, -0.02), tk = add(t0, [0, 120]); f.line([S.at(-0.1, 0.02), add(t0, [0, 20]), tk], 2.2, '#3a2a20'); f.line([S.at(0.7, 0.0), tk], 2.2, '#3a2a20');
    f.part([add(tk, [-18, 0]), add(tk, [18, -2]), add(tk, [20, 36]), add(tk, [0, 44]), add(tk, [-18, 36])], T.MAR(f, { inkW: 1.3 })); f.line([add(tk, [-8, 14]), add(tk, [8, 12]), add(tk, [0, 30]), add(tk, [-8, 14])], 1.4, P.marbleS); }
  // ---- the towel over the near shoulder, hanging down the back
  f.bone('towel');
  { const t0 = S.at(-0.4, -0.04), t1 = S.at(0.1, -0.02); f.part([add(t0, [-20, -10]), add(t1, [10, -14]), add(t1, [20, 30]), add(t0, [10, 40]), add(t0, [-40, 190]), [...add(t0, [-60, 230]), 1], add(t0, [-86, 206]), [...add(t0, [-104, 220]), 1], add(t0, [-90, 120])], T.LIN(f, { fill: '#e2dcd0', maxShade: 20 }));
    f.stroke([add(t0, [-20, 40]), add(t0, [-60, 190])], 2.2); f.stroke([add(t0, [-50, 40]), add(t0, [-84, 180])], 2); f.stitches([add(t0, [-64, 210]), add(t0, [-98, 212])], P.linenD, 1); f.flat(T.lumpy(f, ell(add(t0, [-50, 120]), 20, 30, 0.3, 10), 4), P.raw, { op: 0.35 }); T.drip(f, add(t0, [-62, 232]), 1.4); }

  // ---- the far hand pressing on the slab: the raw boiled hand, swollen; its skin hanging off the wrist like an empty glove
  f.bone('glove_f');
  X.skinGlove(f, add(WF, [-40, 26]), 96, 150, { sway: -6, thumb: 1 });
  f.bone('hand_f');
  X.rawHand(f, add(WF, [46, 20]), 0.55, 86, { col: raw, curl: 0.85, spread: 0.25, fat: 1.25 });
  meat(add(WF, [80, 46]), 70, 46, 0.55, 1);
  f.bone('forearm_f');
  for (let i = 0; i < 2; i++) f.part(K.chain([lp(EF, WF, 0.72 + i * 0.12, -64), lp(EF, WF, 0.74 + i * 0.12, 64)], [40, 40]), { fill: P.leather, shadow: P.leatherD, shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.5 }); // the wristband sunk in the swollen wrist
  fold([lp(EF, WF, 0.68, -60), lp(EF, WF, 0.7, 0), lp(EF, WF, 0.68, 60)], 3); fold([lp(EF, WF, 0.98, -56), lp(EF, WF, 1.0, 0), lp(EF, WF, 0.98, 56)], 3);

  // ---- near arm raised: the strigil up, ready to rake
  X.muscleArm(f, SN, EN, WN, 156, 130, SK(), '_n');
  f.bone('upperarm_n');
  T.peelSheet(f, lp(SN, EN, 0.5, 40), 40, 80, { sway: -4 }); T.blisters(f, lp(SN, EN, 0.3, -30), 30, 40, 6, 4, 9); T.scald(f, lp(SN, EN, 0.5), 40, 60, 10, { ang: ang(SN, EN) });
  f.bone('torso');
  { const dl = [S.at(-0.5, 0.02), S.at(-0.1, -0.08), add(SN, [60, -30]), lp(SN, EN, 0.5, -40), lp(SN, EN, 0.55, 10), lp(SN, EN, 0.3, 60), S.at(-0.4, 0.26)]; f.part(T.lumpy(f, dl, 3), SK({ inkW: 0, inkHeavy: 0, cast: false, hatch: false, maxShade: 18 })); f.stroke([lp(SN, EN, 0.52, -36), lp(SN, EN, 0.5, 0), lp(SN, EN, 0.3, 50)], 3.4, '#5a2a36', { op: 0.65 }); f.line([S.at(-0.36, -0.02), add(SN, [30, -34]), lp(SN, EN, 0.4, -40)], 2.4, '#fbe8e0', { op: 0.5 }); } // the deltoid capping the arm's root
  f.bone('forearm_n');
  T.wrinkles(f, lp(EN, WN, 0.3), lp(EN, WN, 0.8), 110, 6);
  for (let i = 0; i < 2; i++) f.part(K.chain([lp(EN, WN, 0.74 + i * 0.12, -64), lp(EN, WN, 0.76 + i * 0.12, 64)], [40, 40]), { fill: P.leather, shadow: P.leatherD, shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.5 }); // wristband
  // ---- the strigil: a long curved bronze scraping blade like a sickle, edgeless, curls of scraped skin caught on its edge
  f.bone('strigil');
  // the blade rises from the fist and arcs forward and down like a sickle; its concave scraping side faces down, toward the slab
  const ctrl = [[0, -20], [6, -110], [40, -190], [100, -230], [160, -220], [196, -170], [204, -110]].map(q => add(WN, q));
  const st = []; for (let i = 0; i < ctrl.length - 1; i++) for (let k = 0; k < 2; k++) st.push(lerp(ctrl[i], ctrl[i + 1], k / 2)); st.push(ctrl[ctrl.length - 1]);
  { const nrmAt = i => { const a = st[Math.max(0, i - 1)], b = st[Math.min(st.length - 1, i + 1)], d = E.norm(sub(b, a)); return [-d[1], d[0]]; };
    const outer = st.map((q, i) => add(q, mul(nrmAt(i), -(28 - i * 1.5)))), inner = st.map((q, i) => add(q, mul(nrmAt(i), 18 - i * 1.0))).reverse();
    f.part([...outer, ...inner], { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, tex: 'hammer' + seed, texOp: 0.6, inkW: 1.6 });
    f.line(outer.slice(1, 13).map(q => add(q, [0, 5])), 2, P.bronzeL, { op: 0.7 }); // the lit back of the blade
    f.line(inner.slice(2, 13), 2.4, '#3a2410', { op: 0.6 }); // the scraping edge
    for (let i = 0; i < 4; i++) { const q = inner[1 + i * 3]; if (!q) continue; const cp = []; for (let k = 0; k <= 10; k++) { const aa = k * 0.62, rr = 14 - k * 1.1; cp.push(add(q, [Math.cos(aa) * rr * 0.8, 6 + Math.sin(aa) * rr])); } f.stroke(cp, 7, '#e8c8bc'); f.line(cp, 1, INK, { op: 0.6 }); f.line(cp.slice(0, 5), 1, P.rawL, { op: 0.7 }); } // curls of scraped skin rolled up on the edge
    T.verdigris(f, st[6], 20, 10, 4); T.dents(f, st[9], 12, 8, 2);
    f.part(limb(add(WN, [-4, 60]), add(WN, [0, -30]), 32, 30, { steps: 4 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.3 }); } // the wooden grip
  // ---- the near hand: the raw swollen fist on the grip; its whole skin hanging off the wrist below the raised arm
  f.bone('glove_n');
  X.skinGlove(f, add(WN, [-30, 70]), 100, 160, { sway: 4 });
  f.bone('hand_n');
  const gN = X.gripK(f, add(WN, [-2, 16]), EN, -Math.PI / 2, 92, raw, { tex: 'pores' + seed, texOp: 0.6, shadow: rawS, inline: true, raw: true, name: 'strigil' });
  T.drip(f, gN.F([[0.2, 0.7]])[0], 1.4); T.drip(f, gN.F([[-0.4, 0.6]])[0], 1.2);
  meat(gN.F([[0.1, 0]])[0], 66, 70, -0.6, 2);
  // ---- steam off the belly folds and the shoulders
  f.bone('torso');
  T.wisp(f, S.at(0.9, 0.7), 120, { w: 12, op: 0.32, drift: 20 });
  T.wisp(f, S.at(-0.6, 0.1), 140, { w: 12, op: 0.3, drift: -16 });
  T.wisp(f, S.at(0.2, 0.06), 120, { w: 10, op: 0.26, drift: 6 });
  f.bone('root');
  f.flat(ell([420, gy + 4], 340, 14, 0, 18), '#4a3a3a', { op: 0.35 });
  for (const x of [280, 600]) f.flat(ell([x, gy + 2], 60, 5, 0, 10), '#e8e0b0', { op: 0.18 }); // oil on the floor
  return f;
}

// ------------------------------------------------------------------ THE INVALID COUNTESS (elite, 2.0 tall, 2.5 long)
// A sick noblewoman carried to the temple in a litter, with the two bearers who carried her. Her bearers were told not
// to put her down. A curtained oak litter on two long poles, one bearer at the front and one behind, both between the
// poles and bent at the knee under the load, the poles in their fists at the hip and leather straps over their shoulders
// biting in. Their hands are cooked onto the poles: the palm skin wrapped round the wood like bark. Lean, boiled red,
// steam off their shoulders, heads bowed, bald patches boiled shiny; livery tabards with the family badge, short breeches,
// bare scalded feet; the back bearer's head bandaged. The countess sits upright inside and leans out of the front
// opening over the front pole: water has swollen her into a soft, wrinkled bulk that fills the litter, fire has boiled
// her pink-white, peeling at the face and forearms. A long noble face under a lace nightcap soaked flat, heavy lids, a
// pursed, turned-down mouth; a bed jacket of soaked velvet over a nightgown; a pearl collar sunk into her neck; a
// medicine bottle on a cord; a tasselled hand-bell rung at the bearers; a clay flask of temple water; a lap rug; a
// cushion boiled shapeless. The curtains are wet linen tied back with cord, tide-lined with scale; an empty lapdog's
// basket hangs from the front pole. Independent review: the canvas is widened at the same pixel scale so the litter is
// the full 2.5 long (poles 1644 px), the front bearer set back so the box rides between them and the pole's end runs on ahead of him
// as the ram of the attack.
// Rig: litter (root: box, poles, curtains) + countess (parent litter) + c_head, c_upperarm, c_forearm, c_hand, bell
// (the near arm with the hand-bell) + basket (parent litter) + two bearers, each a full humanoid set prefixed fb_ (front)
// and bb_ (back), the pelvis of each parented to the litter. Motion: idle the countess ringing the bell while the
// bearers shift; attack the bearers ram the front pole into a hero (litter lunges forward and tips; the bearers' fists
// are cooked onto the poles, so their arms need IK onto the poles), and the countess throws a bottle (c_ arm).
function invalidCountess() {
  const seed = 323, h = TIERS.elite[1];
  const f = new Fig(T.base(seed, h, { grimeY: 1140 }));
  X.textures(f);
  const gy = f.o.groundY;
  const red = '#c45a46', redS = '#4a1a1c', redL = '#e08a6c';
  const RD = (o = {}) => Object.assign({ fill: red, shadow: redS, shade: 0.34, tex: 'mottle' + seed, texOp: 0.5, maxShade: 22 }, o);
  const skin = '#f0d6cc', skinS = '#7a4a56';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'pruned' + seed, texOp: 0.5, maxShade: 30 }, o);
  const OAK = (o = {}) => Object.assign({ fill: '#5e4230', shadow: '#1e140c', shade: 0.4, tex: 'wood' + seed, texOp: 0.6, maxShade: 30 }, o);
  const VEL = (o = {}) => Object.assign({ fill: Q.velvet, shadow: Q.velvetD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, maxShade: 50 }, o);
  const LIV = (o = {}) => Object.assign({ fill: '#8a7e70', shadow: '#2a2420', shade: 0.38, tex: 'weave' + seed, texOp: 0.4, maxShade: 30 }, o);
  const PY = 1044, PYf = 1020; // the near pole's height (at the bearers' hips) and the far pole's, a little higher (further away)
  const X0 = 20, X1 = 1620;    // the poles' ends (independent review: canvas widened at the elite scale so the litter is the bible's 2.5 long)
  const BX0 = 330, BX1 = 790, BY0 = 300, BY1 = 1004; // the box: back, front, eaves line, floor
  f.joint('litter', [560, PY]).joint('countess', [700, 760], 'litter').joint('c_head', [820, 560], 'countess').joint('basket', [930, PY], 'litter');
  f.joint('c_upperarm', [790, 610], 'countess').joint('c_forearm', [870, 700], 'c_upperarm').joint('c_hand', [930, 640], 'c_forearm').joint('bell', [930, 640], 'c_hand');
  // a bearer between the poles, facing forward, bent at the knee, the poles in his fists at the hip
  const bearer = (px, pre, o = {}) => {
    const H = 94, bd = o.bend ?? 1, Pv = [px - 6, 1068 + 14 * bd], N = [px + 50 + 20 * bd, 880 + 16 * bd], C = [px + 36, 978 + 6 * bd];
    const S = B.spine(N, C, Pv, H);
    const SN = S.at(-0.2, 0.12), SF = S.at(0.36, 0.1);
    const HN = [px - 12, 1078 + 14 * bd], KN = [px + 70 + 14 * bd, 1200], AN = [px + 28, 1322];
    const HF = [px + 10, 1074 + 14 * bd], KF = [px - 20, 1206], AF = [px - 70, 1318];
    const WN = [px + 46, PY], EN = [px + 16 + 10 * bd, 966 + 10 * bd], WF = [px + 72, PYf], EF = [px + 70, 954 + 10 * bd];
    const hd = E.norm(add(E.norm(sub(N, C)), [0.6, 0.3])), HC = add(N, mul(hd, H * 0.42)), hA = 0.75 + 0.1 * bd, neck0 = S.at(0.1, -0.03);
    f.joint(pre + 'pelvis', Pv, 'litter').joint(pre + 'torso', S.at(0, 0.86), pre + 'pelvis').joint(pre + 'head', neck0, pre + 'torso');
    f.joint(pre + 'upperarm_n', SN, pre + 'torso').joint(pre + 'forearm_n', EN, pre + 'upperarm_n').joint(pre + 'hand_n', WN, pre + 'forearm_n');
    f.joint(pre + 'upperarm_f', SF, pre + 'torso').joint(pre + 'forearm_f', EF, pre + 'upperarm_f').joint(pre + 'hand_f', WF, pre + 'forearm_f');
    f.joint(pre + 'thigh_n', HN, pre + 'pelvis').joint(pre + 'shin_n', KN, pre + 'thigh_n').joint(pre + 'foot_n', AN, pre + 'shin_n');
    f.joint(pre + 'thigh_f', HF, pre + 'pelvis').joint(pre + 'shin_f', KF, pre + 'thigh_f').joint(pre + 'foot_f', AF, pre + 'shin_f');
    return { S, H, Pv, N, SN, SF, HN, KN, AN, HF, KF, AF, WN, EN, WF, EF, HC, hA, neck0, pre, o };
  };
  const bF = bearer(1110, 'fb_', { bend: 0.6 }), bB = bearer(168, 'bb_', { bandage: true, bend: 1.6 });
  // the cooked hand: a fist on the pole, the palm's skin run out over the wood like bark, split and peeling
  const cookedFist = (bb, side) => {
    const W = side === 'n' ? bb.WN : bb.WF, E0 = side === 'n' ? bb.EN : bb.EF, py = side === 'n' ? PY : PYf;
    f.bone(bb.pre + 'hand_' + side);
    for (const dir of [-1, 1]) { const a = [W[0] + dir * 30, py - 13], b = [W[0] + dir * 64, py - 12]; f.part([a, b, [b[0], py + 13], [a[0], py + 14]].map((q, i) => i === 1 || i === 2 ? q : [...q, 1]), RD({ fill: mix(red, '#d8a898', 0.35), inkW: 1, cast: false, maxShade: 4 })); for (let i = 0; i < 4; i++) f.line([[a[0] + dir * (6 + i * 8), py - 12], [a[0] + dir * (8 + i * 8), py + 12]], 1, '#3a1410', { op: 0.6 }); f.line([b, [b[0] + dir * 3, py], [b[0], py + 13]], 1.6, '#f0d8cc', { op: 0.8 }); } // bark of skin on the wood
    X.gripK(f, W, E0, 0, 30, red, { tex: 'pores' + seed, texOp: 0.6, shadow: redS, name: 'bearer ' + bb.pre + side, maxBend: 40 });
  };
  const drawBearerFar = bb => {
    const { S, H, HF, KF, AF, SF, EF, WF, pre } = bb;
    X.muscleArm(f, SF, EF, WF, 34, 28, RD({ fill: mix(red, redS, 0.2) }), '_f'.replace('_', '_'), { castShadow: false });
    // rename the arm bones to the bearer's prefix: muscleArm drew on upperarm_f/forearm_f, move them
    f.marks.forEach(m => { if (m.bone === 'upperarm_f' || m.bone === 'forearm_f') m.bone = pre + m.bone; });
    T.legRig(f, HF, KF, AF, 50, 66, 48, RD({ fill: mix(red, redS, 0.22) }), '_f');
    f.marks.forEach(m => { if (['thigh_f', 'shin_f', 'foot_f'].includes(m.bone)) m.bone = pre + m.bone; });
    cookedFist(bb, 'f');
  };
  const drawBearerNear = bb => {
    const { S, H, Pv, N, SN, EN, WN, HN, KN, AN, HC, hA, neck0, pre, o } = bb;
    // leg, breeches, bare scalded foot
    T.legRig(f, HN, KN, AN, 50, 68, 50, RD(), '_n');
    T.legDetail(f, HN, KN, AN, 50, RD(), '_n', { calf: 0.1 });
    f.marks.forEach(m => { if (['thigh_n', 'shin_n', 'foot_n'].includes(m.bone)) m.bone = pre + m.bone; });
    f.bone(pre + 'shin_n'); T.blisters(f, lp(KN, AN, 0.5, 10), 10, 30, 4, 2.5, 5, { col: '#f4c8b8', shadow: '#a05040', burst: 0.5 }); T.peelSheet(f, lp(KN, AN, 0.35, 16), 14, 30, { col: '#f0d8cc', bedCol: '#a8342a' });
    f.bone(pre + 'thigh_n'); f.part(K.ragLimb(f, add(HN, [-4, -10]), lp(HN, KN, 0.62), 80, 70, { depth: 6, teeth: 5 }), LIV({ fill: '#6a5a4c' })); // short breeches
    // torso: lean, the tabard of the family's livery over it, the strap over the shoulder biting in
    f.bone(pre + 'torso');
    const torso = S.shape([[-0.06, 0.28, 0.32], [0.06, 0.46, 0.52], [0.2, 0.52, 0.64], [0.4, 0.48, 0.6], [0.6, 0.44, 0.52], [0.8, 0.5, 0.52], [0.96, 0.56, 0.56]]);
    f.part(torso, RD());
    const tab = S.shape([[0.04, 0.36, 0.44], [0.2, 0.5, 0.62], [0.4, 0.5, 0.62], [0.7, 0.52, 0.56], [1.0, 0.6, 0.62], [1.24, 0.64, 0.66]]);
    f.part(tab, LIV());
    f.stroke([S.at(0.2, 0.5), S.at(0.3, 0.8), S.at(0.24, 1.1)], 2); f.stroke([S.at(-0.3, 0.6), S.at(-0.36, 1.0)], 1.8);
    X.clothWear(f, tab, [Pv[0] - 60, N[1], Pv[0] + 80, Pv[1] + 40], 3);
    // the family badge: a silver heron on a wine roundel, worn
    { const bc = S.at(0.3, 0.4); f.part(ell(bc, 22, 24, 0, 14), VEL({ inkW: 1.2, maxShade: 6 })); f.line([add(bc, [-8, 12]), add(bc, [-2, -2]), add(bc, [4, -14]), add(bc, [12, -12])], 2.4, Q.silverL); f.line([add(bc, [-2, -2]), add(bc, [-10, 4])], 1.6, Q.silverL); f.line([add(bc, [-2, 12]), add(bc, [-6, 18])], 1.2, Q.silverL); f.stitches(ell(bc, 19, 21, 0, 14), Q.silver, 0.8); }
    f.part([S.at(-0.6, 0.86), S.at(0.62, 0.84), S.at(0.64, 0.92), S.at(-0.62, 0.94)], { fill: P.leather, shadow: P.leatherD, shade: 0.4 }); // belt
    T.wisp(f, S.at(-0.3, 0.0), 80, { w: 7, op: 0.32, drift: -10 });
    // the shoulder strap: leather from the near shoulder down to a loop round the near pole, biting into the boiled flesh
    { const st0 = S.at(-0.1, 0.02), st1 = [WN[0] - 40, PY - 8]; f.stroke([st0, lerp(st0, st1, 0.5), st1], 18, INK); f.stroke([st0, lerp(st0, st1, 0.5), st1], 14, P.leather); f.line([st0, st1], 1.4, P.leatherL, { op: 0.6 }); f.stroke([add(st0, [-12, 8]), add(st0, [12, 10])], 3, '#5a1a18', { op: 0.6 }); f.stitches([add(st0, [3, 4]), add(st1, [3, 0])], '#a08060', 0.8); }
    // head bowed, bald patch boiled shiny
    f.bone(pre + 'head');
    f.part(K.chain([add(neck0, [-4, 8]), add(HC, rot([-H * 0.2, H * 0.22], hA))], [42, 36]), RD());
    const hF = X.face(f, HC, H, hA, { skin: red, jaw: 1.02, chin: 0.02, nose: 1.05, mouth: 'set', squint: 0.6, browDown: 0.06, age: true, gaunt: true, iris: '#2a1414', eyeWhite: '#d8a898', hairCol: '#3a2620', browCol: '#3a2620', browW: 0.04 }, { tint: '#6a2a2a', shade: '#5a1a1a' });
    f.part(hF([[-0.42, 0.06], [-0.46, -0.2], [-0.32, -0.42], [-0.12, -0.36], [-0.22, -0.16], [-0.3, 0.08]]), { fill: '#3a2620', shadow: '#120a08', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, cast: false }); // a fringe of hair round the back
    f.part(hF([[-0.12, -0.36], [-0.32, -0.42], [-0.1, -0.54], [0.18, -0.48], [0.28, -0.3], [0.06, -0.3]]), RD({ fill: redL, cast: false, inkW: 0, maxShade: 4 })); // the bald patch
    T.sheen(f, hF([[-0.14, -0.46], [0.04, -0.52], [0.2, -0.44]]), 3, 0.7);
    if (o.bandage) { for (let i = 0; i < 3; i++) f.stroke(hF([[0.3, -0.36 + i * 0.1], [0.0, -0.44 + i * 0.12], [-0.44, -0.26 + i * 0.12]]), 12, i % 2 ? '#c8bca8' : '#d8d0c0'); f.flat(hF(ell([0.1, -0.36], 0.06, 0.04, 0, 8)), '#8a4a3a', { op: 0.6 }); f.stroke([hF([[-0.44, -0.1]])[0], add(hF([[-0.44, -0.1]])[0], [-6, 34])], 6, '#c8bca8'); }
    T.beads(f, hF([[0.06, -0.24]])[0], 18, 6, 4, 1);
    // near arm down to the near pole
    X.muscleArm(f, SN, EN, WN, 36, 30, RD(), '_n');
    f.marks.forEach(m => { if (m.bone === 'upperarm_n' || m.bone === 'forearm_n') m.bone = pre + m.bone; });
    f.bone(pre + 'forearm_n'); T.peelSheet(f, lp(EN, WN, 0.3, 12), 12, 26, { col: '#f0d8cc', bedCol: '#a8342a' });
  };

  // ======== back to front
  // ---- far pole (behind everything), its brackets
  f.bone('litter');
  const pole = (y, dk) => { f.part([[X0, y - 14], [X1, y - 16], [X1 + 4, y], [X1, y + 14], [X0, y + 14], [X0 - 4, y]], OAK({ fill: mix('#5e4230', '#000', dk), maxShade: 12 })); f.line([[X0 + 10, y - 9], [X1 - 10, y - 10]], 1.6, '#8a6a4a', { op: 0.6 }); for (const x of [X0 + 6, X1 - 10]) f.part([[x, y - 16], [x + 10, y - 16], [x + 10, y + 16], [x, y + 16]], { fill: P.iron, shade: 0.4, inkW: 1.1, cast: false, sharp: true }); };
  pole(PYf, 0.3);
  // ---- the far bearers' far limbs (between the poles, behind their bodies)
  drawBearerFar(bB); drawBearerFar(bF);
  // ---- the box: oak, carved; the far wall and the dark inside
  f.bone('litter');
  f.part([[BX0 + 20, BY0 - 10], [BX1 + 20, BY0 - 14], [BX1 + 20, BY1 - 20], [BX0 + 20, BY1 - 16]].map(q => [...q, 1]), OAK({ fill: '#3a281c' })); // the far side, seen through
  f.flat([[BX0 + 30, BY0 + 20], [BX1 + 10, BY0 + 16], [BX1 + 10, BY1 - 40], [BX0 + 30, BY1 - 36]], '#1a120c', { op: 0.7 }); // the dark inside
  // ---- the countess: her swollen bulk filling the litter, seen through the window and leaning out of the front
  f.bone('countess');
  const bulk = [[420, 520], [520, 470], [640, 470], [740, 500], [810, 560], [840, 640], [830, 740], [780, 840], [700, 900], [560, 910], [430, 880], [380, 780], [380, 640]];
  f.part(T.lumpy(f, bulk, 8), VEL());
  for (const [a, b, c] of [[[480, 560], [470, 700], [500, 860]], [[600, 520], [620, 700], [600, 880]], [[720, 560], [760, 700], [740, 840]]]) f.stroke([a, b, c], 3, Q.velvetD); // folds of the soaked jacket
  X.clothWear(f, bulk, [400, 480, 820, 900], 6, { damp: '#14080e', stain: '#2a1018' });
  for (const [x, y] of [[520, 600], [660, 560], [560, 760]]) f.flat(T.lumpy(f, ell([x, y], 30, 20, 0.3, 10), 5), '#a87a8a', { op: 0.25 }); // the nap worn and steamed pale
  // the nightgown showing at the jacket's opening, the swollen bosom, the lap rug over her knees, the cushion behind her
  f.part([[700, 560], [780, 560], [820, 640], [810, 740], [760, 760], [720, 700]], T.LIN(f, { fill: '#e2d8ca', maxShade: 20 }));
  f.stroke([[730, 600], [760, 680], [750, 740]], 2.2); for (let i = 0; i < 4; i++) f.part(ell([712 + i * 4, 580 + i * 40], 4, 4, 0, 8), { fill: Q.bone, shade: 0.3, inkW: 0.8, cast: false });
  { const rug = [[420, 780], [560, 760], [700, 770], [800, 800], [820, 880], [780, 960, 1], [740, 950], [700, 976, 1], [640, 960], [590, 982, 1], [540, 960], [480, 980, 1], [430, 950]]; f.part(rug, { fill: '#7a6a5a', shadow: '#2a2018', shade: 0.4, tex: 'weave' + seed, texOp: 0.7, maxShade: 30 }); for (let i = 0; i < 5; i++) f.line([[440 + i * 70, 790], [430 + i * 74, 960]], 4, '#5a2a30', { op: 0.6 }); for (let i = 0; i < 3; i++) f.line([[430, 820 + i * 50], [810, 840 + i * 50]], 4, '#5a2a30', { op: 0.5 }); X.clothWear(f, rug, [420, 760, 820, 980], 4, { tide: 900 }); } // a plaid rug, its tide line
  { const cu = [[392, 560], [440, 520], [470, 600], [460, 720], [420, 760], [384, 700]]; f.part(T.lumpy(f, cu, 6), VEL({ fill: '#8a6a50', shadow: '#2a1a10' })); f.part(ell([440, 540], 8, 8, 0, 8), { fill: '#c8a870', shade: 0.3, inkW: 0.9, cast: false }); f.stroke([[400, 600], [430, 680]], 2, '#2a1a10'); } // the cushion, boiled shapeless, a tassel
  // the swollen forearm resting on the lap, peeling; the clay flask of temple water beside her
  f.part(K.chain([[560, 700], [640, 760], [700, 770]], [80, 74, 62]), SK());
  T.peelSheet(f, [620, 760], 30, 50, { sway: 3 }); T.wrinkles(f, [580, 720], [700, 770], 70, 8); T.blisters(f, [600, 740], 30, 14, 4, 3, 6);
  T.handBack(f, [724, 772], 0.2, 34, skin, { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.5, spread: 0.2, fat: 1.3 });
  X.silverRing(f, [758, 770], 0.2, 14, { signet: true });
  { const fl = [470, 900]; f.part(T.lumpy(f, [add(fl, [-24, 0]), add(fl, [-20, -36]), add(fl, [-8, -50]), add(fl, [8, -50]), add(fl, [20, -36]), add(fl, [24, 0])], 2), { fill: Q.clay, shadow: Q.clayD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, inkW: 1.2 }); f.part([add(fl, [-8, -62]), add(fl, [8, -62]), add(fl, [8, -48]), add(fl, [-8, -48])], { fill: '#8a6a4a', shade: 0.3, inkW: 1, cast: false, sharp: true }); f.line([add(fl, [-12, -20]), add(fl, [12, -22])], 1, INK, { op: 0.5 }); }
  // ---- her upper body leaning out of the front: swollen shoulders, the pearl collar sunk in the neck
  const N0 = [800, 540], HC = [842, 438], hA = 0.32, H = 132;
  f.part(T.lumpy(f, [[700, 500], [770, 470], [840, 490], [890, 540], [900, 620], [860, 650], [790, 640], [730, 600]], 6), VEL());
  f.stroke([[790, 500], [840, 560], [860, 620]], 3, Q.velvetD);
  f.bone('c_head');
  f.part(K.chain([add(N0, [-10, 20]), add(HC, rot([-H * 0.18, H * 0.3], hA))], [130, 110]), SK());
  for (let i = 0; i < 3; i++) f.stroke([add(N0, [-50 + i * 6, -10 + i * 18]), add(N0, [0 + i * 4, 4 + i * 18]), add(N0, [46, -6 + i * 18])], 3, '#8a5a64', { op: 0.6 }); // the neck's swollen rolls
  X.pearls(f, [add(N0, [-56, -16]), add(N0, [-10, 4]), add(N0, [40, -4]), add(N0, [56, -22])], 6.5); // sunk in the rolls
  f.stroke([add(N0, [-56, -24]), add(N0, [-10, -6]), add(N0, [40, -14])], 3, '#8a5a64', { op: 0.6 }); // flesh bulging over the collar
  { const mb = add(N0, [10, 60]); f.line([add(N0, [-20, 10]), mb], 1.6, '#3a2a20'); X.glassPart(f, [add(mb, [-8, 0]), add(mb, [8, 0]), add(mb, [10, 10]), add(mb, [14, 40]), add(mb, [-14, 40]), add(mb, [-10, 10])], { col: '#9aa8a0', op: 0.85 }); f.part([add(mb, [-5, -8]), add(mb, [5, -8]), add(mb, [5, 1]), add(mb, [-5, 1])], { fill: '#8a6a4a', shade: 0.3, inkW: 0.9, cast: false, sharp: true }); f.flat([add(mb, [-12, 24]), add(mb, [12, 24]), add(mb, [13, 38]), add(mb, [-13, 38])], '#6a3a30', { op: 0.7 }); f.line([add(mb, [6, 12]), add(mb, [9, 34])], 1.2, '#fff', { op: 0.7 }); } // the medicine bottle on its cord
  const hF = X.face(f, HC, H, hA, { skin, jaw: 1.12, chin: 0.06, nose: 1.18, hook: 0.5, mouth: 'set', squint: 0.6, browDown: -0.04, age: true, lips: true, lashes: true, iris: '#2a1a18', eyeWhite: '#eadcd2', hairCol: '#5a4a40', browCol: '#7a6a60', browW: 0.03 });
  for (const [x, w] of [[0.11, 0.072], [0.295, 0.03]]) f.part(hF([[x - w, -0.085], [x, -0.105], [x + w, -0.085], [x + w * 0.9, -0.054], [x, -0.048], [x - w * 0.9, -0.054]]), SK({ fill: '#e8c0b6', cast: false, inkW: 1.1, maxShade: 3 })); // heavy lids
  f.line(hF([[0.17, 0.3], [0.21, 0.285], [0.26, 0.29], [0.31, 0.3]]), 2.6, '#7a3a40'); f.line(hF([[0.17, 0.3], [0.15, 0.33]]), 2, '#7a3a40'); f.line(hF([[0.31, 0.3], [0.33, 0.33]]), 2, '#7a3a40'); // pursed, the corners turned down
  for (let i = 0; i < 4; i++) f.line(hF([[0.2 + i * 0.03, 0.27], [0.21 + i * 0.03, 0.25]]), 0.9, INK, { op: 0.5 }); // pursing lines
  f.line(hF([[0.28, 0.12], [0.24, 0.24], [0.22, 0.34]]), 2, '#6a4048', { op: 0.5 });
  T.peelSheet(f, hF([[-0.06, 0.22]])[0], 22, 50, { sway: -2 }); T.peelSheet(f, hF([[0.16, 0.42]])[0], 16, 30, { sway: 2, bed: false });
  T.blisters(f, hF([[-0.1, -0.12]])[0], 16, 14, 4, 3, 6); T.beads(f, hF([[0.1, -0.22]])[0], 30, 8, 6, 1.2);
  // the lace nightcap soaked flat to her head, its frill lying wet on the brow, the ties hanging
  f.part(hF([[0.3, -0.36], [0.1, -0.54], [-0.22, -0.56], [-0.5, -0.36], [-0.56, 0.0], [-0.44, 0.26], [-0.3, 0.2], [-0.32, -0.06], [-0.16, -0.28], [0.12, -0.32]]), T.LIN(f, { fill: '#ece6da', maxShade: 16 }));
  for (let i = 0; i < 9; i++) { const q = hF([[0.3 - i * 0.08, -0.34 + Math.abs(i - 2) * 0.012]])[0]; f.line(ell(q, 5, 4, 0, 8).concat([ell(q, 5, 4, 0, 8)[0]]), 1, '#9a9080', { op: 0.8 }); } // the lace frill, holes
  for (let i = 0; i < 5; i++) f.line(hF([[0.2 - i * 0.12, -0.5 + i * 0.02], [0.1 - i * 0.12, -0.38]]), 1, '#9a9080', { op: 0.6 }); // gathers
  f.flat(hF([[-0.3, -0.4], [-0.46, -0.2], [-0.4, -0.1], [-0.24, -0.3]]), '#5a4a40', { op: 0.3 }); // the hair dark through the wet lace
  { const tq = hF([[-0.3, 0.24]])[0]; f.stroke([tq, add(tq, [-4, 40]), add(tq, [0, 70])], 6, '#e2dcd0'); }
  // ---- the box's near side: carved lower panel, posts, the window with its curtains tied back, the roof
  f.bone('litter');
  const post = (x0, x1) => { f.part([[x0, BY0], [x1, BY0], [x1 + 2, BY1], [x0 - 2, BY1]].map(q => [...q, 1]), OAK()); f.line([[x0 + 4, BY0 + 10], [x0 + 4, BY1 - 10]], 1.6, '#8a6a4a', { op: 0.6 }); };
  f.part([[BX0, 800], [BX1, 798], [BX1, BY1], [BX0, BY1]].map(q => [...q, 1]), OAK()); // the lower panel
  for (const [x0, x1] of [[BX0 + 30, 540], [570, BX1 - 30]]) { f.part([[x0, 822], [x1, 820], [x1, 984], [x0, 986]].map(q => [...q, 1]), OAK({ fill: '#6a4a36', maxShade: 10 })); f.line([[x0 + 8, 830], [x1 - 8, 828]], 1.4, '#9a7a5a', { op: 0.6 }); const c = [(x0 + x1) / 2, 904]; for (let i = 0; i < 8; i++) { const a2 = i / 8 * Math.PI * 2; f.line([c, add(c, [Math.cos(a2) * 50, Math.sin(a2) * 44])], 2, '#2a1a10', { op: 0.6 }); } f.line(ell(c, 54, 48, 0, 16).concat([ell(c, 54, 48, 0, 16)[0]]), 2, '#2a1a10', { op: 0.7 }); } // carved rosettes
  { const cr = []; for (let i = 0; i <= 16; i++) cr.push([BX0 + i * (BX1 - BX0) / 16, BY1 - 16 - T.R(f, 0, 12) - (i % 3 === 0 ? 8 : 0)]); f.flat([...cr, [BX1, BY1], [BX0, BY1]], '#e8e0d4', { op: 0.5 }); f.line(cr, 1.2, '#8a8076', { op: 0.6 }); } // white bath scale crusted along the lower edge
  post(BX0 - 10, BX0 + 24); post(BX1 - 24, BX1 + 10);
  f.part([[BX0 - 10, 780], [BX1 + 10, 778], [BX1 + 10, 806], [BX0 - 10, 808]].map(q => [...q, 1]), OAK({ fill: '#6a4a36' })); // the sill
  // curtains: wet linen tied back to the posts with cord, tide lines of scale
  const curtain = (x, dir) => { const top = [[x, BY0 + 6], [x + dir * 90, BY0 + 6]], kn = [x + dir * 26, 600]; const c = [top[0], top[1], [x + dir * 60, 460], [x + dir * 34, 590], [x + dir * 44, 700], [x + dir * 70, 790], [x, 790]]; f.part(c, T.LIN(f, { fill: '#dcd4c6', maxShade: 20 })); for (const k of [0.3, 0.6]) f.stroke([[x + dir * 80 * k, BY0 + 10], [x + dir * 26 * k + dir * 10, 590], [x + dir * 50 * k, 780]], 2); const tl = []; for (let i = 0; i <= 6; i++) tl.push([x + dir * i * 11, 700 + Math.sin(i) * 6]); f.line(tl, 1.8, '#a89e8e', { op: 0.8 }); f.flat([...tl, [x + dir * 70, 790], [x, 790]], '#6a6058', { op: 0.25 }); f.line([[x, kn[1]], kn], 4, '#8a6a4a'); f.part(ell(kn, 8, 6, 0, 8), { fill: '#8a6a4a', shade: 0.3, inkW: 1, cast: false }); f.stroke([kn, add(kn, [dir * 4, 30]), add(kn, [0, 50])], 3, '#8a6a4a'); };
  curtain(BX0 + 24, 1); curtain(BX1 - 24, -1);
  // the roof: a curved lid with deep eaves, a carved cornice, finials at the corners
  const roof = [[BX0 - 40, BY0], [BX1 + 40, BY0 - 4], [BX1 + 20, BY0 - 50], [BX1 - 40, BY0 - 110], [(BX0 + BX1) / 2, BY0 - 140], [BX0 + 40, BY0 - 108], [BX0 - 20, BY0 - 46]];
  f.part(roof, OAK({ maxShade: 20 }));
  f.part([[BX0 - 44, BY0 - 8], [BX1 + 44, BY0 - 12], [BX1 + 44, BY0 + 18], [BX0 - 44, BY0 + 22]].map(q => [...q, 1]), OAK({ fill: '#6a4a36' })); // the cornice
  for (let i = 0; i < 14; i++) f.line([[BX0 - 34 + i * 38, BY0 - 4], [BX0 - 34 + i * 38, BY0 + 14]], 2, '#2a1a10', { op: 0.7 }); // dentils
  for (const x of [BX0 - 30, BX1 + 30]) { f.part([[x - 10, BY0 - 10], [x + 10, BY0 - 10], [x + 6, BY0 - 40], [x, BY0 - 60], [x - 6, BY0 - 40]], OAK({ fill: '#6a4a36', inkW: 1.2 })); f.part(ell([x, BY0 - 66], 9, 9, 0, 10), OAK({ fill: '#7a5a40', inkW: 1.1 })); }
  f.part(ell([(BX0 + BX1) / 2, BY0 - 150], 16, 14, 0, 12), OAK({ fill: '#7a5a40' }));
  f.flat([[BX0 + 40, BY0 - 100], [BX1 - 40, BY0 - 104], [BX1 - 20, BY0 - 60], [BX0 + 20, BY0 - 58]], '#e8e0d4', { op: 0.15 }); // pale scale crusted on the lid
  for (const x of [BX0 + 80, 560, BX1 - 60]) { f.stroke([[x, BY0 + 18], [x + 2, BY0 + 60], [x - 1, BY0 + 90]], 4, P.water, { op: 0.4 }); T.drip(f, [x - 1, BY0 + 96], 1.2); } // condensation running off the eaves
  // ---- near pole, its brackets on the box, the empty lapdog basket hanging from its front
  pole(PY, 0);
  for (const x of [BX0 + 40, BX1 - 40]) { f.part([[x - 18, BY1 - 20], [x + 18, BY1 - 20], [x + 22, PY + 18], [x - 22, PY + 18]].map(q => [...q, 1]), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false }); f.rivet([x, BY1 - 6], 3, P.ironL); }
  f.bone('basket');
  { const bk = [906, PY + 18]; f.line([[920, PY + 10], add(bk, [-24, 40])], 2, '#5a4a36'); f.line([[920, PY + 10], add(bk, [30, 40])], 2, '#5a4a36'); const c = add(bk, [4, 70]); f.part([add(c, [-40, -30]), add(c, [44, -30]), add(c, [36, 24]), add(c, [-32, 24])], { fill: '#a88a5a', shadow: '#3a2a14', shade: 0.4, inkW: 1.2 }); for (let i = 0; i < 6; i++) f.line([add(c, [-38 + i * 2, -22 + i * 8]), add(c, [42 - i * 2, -22 + i * 8])], 1.4, '#4a3418', { op: 0.75 }); for (let i = 0; i < 6; i++) f.line([add(c, [-30 + i * 13, -30]), add(c, [-26 + i * 12, 24])], 1, '#e0c890', { op: 0.4 }); f.part([add(c, [-28, -30]), add(c, [32, -30]), add(c, [28, -22]), add(c, [-24, -22])], { fill: '#2a1a10', shade: 0.3, inkW: 0.8, cast: false }); f.stroke([add(c, [10, -26]), add(c, [24, -50]), add(c, [36, -40])], 3, '#6a3a4e'); } // the basket, empty, a scrap of ribbon
  // ---- the bearers' near sides, in front of the near pole
  drawBearerNear(bB); cookedFist(bB, 'n');
  drawBearerNear(bF); cookedFist(bF, 'n');
  // ---- the countess's near arm, out over the front pole, ringing the tasselled hand-bell
  const cS = [790, 610], cE = [870, 700], cW = [930, 640];
  f.bone('c_upperarm');
  f.part(K.chain([cS, lerp(cS, cE, 0.5), cE], [96, 90, 80]), VEL()); // the jacket's sleeve, soaked
  f.stroke([lp(cS, cE, 0.3, 30), lp(cS, cE, 0.5, 0), lp(cS, cE, 0.4, -30)], 2.4, Q.velvetD);
  f.bone('c_forearm');
  f.part(K.chain([cE, lerp(cE, cW, 0.5), cW], [74, 64, 52]), SK());
  f.part(K.ragLimb(f, add(cE, [-8, 4]), lp(cE, cW, 0.3), 92, 88, { depth: 6, teeth: 5 }), VEL()); // the sleeve's cuff, lace showing
  for (let i = 0; i < 5; i++) f.line([lp(cE, cW, 0.3, -36 + i * 18), lp(cE, cW, 0.36, -36 + i * 18)], 2.6, '#ece6da');
  T.peelSheet(f, lp(cE, cW, 0.6, 16), 22, 40, { sway: 2 }); T.wrinkles(f, lp(cE, cW, 0.5), cW, 60, 5);
  f.bone('bell');
  { const bt = [cW[0] + 8, cW[1] - 60]; f.part(limb([cW[0] + 2, cW[1] + 18], bt, 12, 10, { steps: 4 }), { fill: '#5e4230', shadow: '#1e140c', shade: 0.4, inkW: 1.1, tex: 'wood' + seed, texOp: 0.5 }); // the bell's handle, held up, the bell hanging mouth down below the fist
    const bm = [cW[0] + 2, cW[1] + 40]; f.part([add(bm, [-6, -16]), add(bm, [6, -16]), add(bm, [10, -6]), add(bm, [22, 20]), add(bm, [-22, 20]), add(bm, [-10, -6])], { fill: Q.silver, shadow: Q.silverD, shade: 0.42, inkW: 1.2 }); f.line([add(bm, [-22, 20]), add(bm, [22, 20])], 2, INK); f.flat(ell(add(bm, [0, 24]), 4, 4, 0, 8), Q.silverD); f.flat(ell(add(bm, [8, 0]), 3, 8, 0.2, 8), Q.silverL, { op: 0.8 });
    for (let i = 0; i < 6; i++) f.line([add(bt, [-2, 0]), add(bt, [-8 + i * 3, -26])], 2, '#7a3a4a'); f.part(ell(bt, 6, 5, 0, 8), { fill: '#7a3a4a', shade: 0.3, inkW: 0.9, cast: false }); } // the tassel on the handle's end
  f.bone('c_hand');
  X.gripK(f, cW, cE, -Math.PI / 2, 30, skin, { tex: 'pruned' + seed, texOp: 0.6, shadow: skinS, name: 'countess bell' });
  // ---- steam off the litter roof and the bearers
  f.bone('litter');
  T.steam(f, [560, BY0 - 140], 150, 40, { drift: -20, op: 0.35, grow: 1.2, n: 5, curls: 2 });
  f.bone('root');
  f.flat(ell([560, gy + 4], 520, 14, 0, 18), '#4a3a3a', { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ THE GREAT COPPER (ruler 4)
// The great copper boiler that heats every pool in the temple, and the stokers who fed it. They are still on shift.
// A riveted copper boiler three storeys high squats on a brick firebox and leans forward over the company like a fat
// body; its dome and chimney are cut off by the frame's top and its lead pipes run out of frame to the pools; it never
// moves, its whole weight on the brick. Fire is the dominant mark: the plates are heat-blackened at the base and cooked a
// boiled red-brown above, blistered where the metal bubbled, split along two seams that glow from the fire inside. The
// stokers are cooked onto the firebox: four men pressed half into the hot brick round the fire door, their skin boiled
// pink-white and baked onto the brick like bread to an oven wall, eyes squeezed shut, their arms still working long iron
// rakes and a coal shovel in and out of the fire. Water swells the copper between the rivet rows into a bulging belly that
// weeps hot water from every seam, steam pouring from the cracks, lime scale crusting bone white round every leak. The
// fire door hangs open on one hinge, its latch broken: it is the mouth. A pressure valve with a weighted lever (the weight a
// lump of marble), a bronze stopcock wheel, lead pipes bandaged with rags where they leak, a carved stone tablet with the
// stokers' rota, a stoker's leather apron hung from a rivet, a burst coal sack heaped at the base, a cracked glass water
// gauge, an iron ladder bolted up the side with an attendant cooked onto its rungs with his bucket, a chalk tally on the
// brick, a dead Kettle Crab cooked on the warm brick ledge.
// Rig (the parts the Motion line moves): firebox (root), boiler (the plates' slow swell, pivot on the brick), valve (the
// lever lifting), door (the fire door on its hinge), stoker_1..4 (each fused stoker's arms with his tool: rake_1, rake_2,
// shovel, and the latch-hand), steam_1..3 (parent boiler), attendant (parent boiler). Motion: idle a slow swelling and
// settling of the plates (boiler scale is not a rotation: a small boiler rock and the steam bones) and a hiss from the
// valve; attack the valve lifts and steam rolls across the ranks (valve, steam), and the stokers rake burning coal out of
// the door at the front rank (stoker arms swing the rakes out).
function greatCopper() {
  const seed = 321, h = TIERS.ruler[1], w = TIERS.ruler[0];
  const f = new Fig(T.base(seed, h, { grimeY: 1300, inkW: 2, inkHeavy: 4.4 }));
  X.textures(f);
  const gy = f.o.groundY;
  const cop = '#a85a3a', copD = '#5e2a1c', copL = '#d08a62', black = '#2a1c18';
  const COP = (o = {}) => Object.assign({ fill: cop, shadow: '#3a1610', shade: 0.4, tex: 'hammer' + seed, texOp: 0.8, maxShade: 80 }, o);
  const BRK = (o = {}) => Object.assign({ fill: Q.brick, shadow: '#2a1210', shade: 0.4, tex: 'brick' + seed, texOp: 0.9, maxShade: 60 }, o);
  const skin = '#f0d4c8', skinS = '#7a4a56';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle' + seed, texOp: 0.45, maxShade: 26 }, o);
  // the firebox: a near side face and the front face (where the door is), meeting at the corner at x 900
  const CX = 860, TOPs = 1010, TOPf = 1040;
  const side = [[150, TOPs + 24], [CX, TOPs], [CX, gy + 30], [130, gy + 30]], front = [[CX, TOPs], [1480, TOPf], [1500, gy + 30], [CX, gy + 30]];
  // the boiler: a fat riveted body on the brick, leaning forward (its top shifted toward the company), off the top of frame
  const bodyL = [[210, 1040], [160, 900], [140, 760], [160, 520], [220, 280], [300, 60], [360, -60]], bodyR = [[1360, -60], [1400, 80], [1430, 300], [1450, 560], [1440, 800], [1390, 940], [1320, 1040]];
  const boiler = [...bodyL, ...bodyR];
  const bandY = [980, 790, 600, 400, 200, 0]; // rivet rows
  const xAt = (y, sideArr) => { for (let i = 0; i < sideArr.length - 1; i++) { const a = sideArr[i], b = sideArr[i + 1]; if ((y <= a[1] && y >= b[1]) || (y >= a[1] && y <= b[1])) return a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); } return sideArr[0][0]; };
  const band = y => { const x0 = xAt(y, bodyL), x1 = xAt(y, bodyR); const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI) * 26]); } return pts; }; // a seam bowing down (we look up at it)
  const DOOR = [1110, 1210, 1330, 1490]; // the fire opening on the front face: x0, y0, x1, y1
  f.joint('firebox', [800, gy]).joint('boiler', [760, 1040], 'firebox').joint('valve', [1180, 210], 'boiler').joint('door', [DOOR[0] - 4, DOOR[1] + 20], 'firebox');
  f.joint('steam_1', [1300, 640], 'boiler').joint('steam_2', [500, 820], 'boiler').joint('steam_3', [1180, 200], 'boiler').joint('attendant', [300, 640], 'boiler');
  const ST = [{ c: [990, 1290], a: -0.15 }, { c: [1440, 1300], a: 0.12 }, { c: [1220, 1120], a: 0 }, { c: [980, 1480], a: -0.05 }];
  const SHL = [[1070, 1230], [1370, 1230], [1160, 1130], [1050, 1420]]; // each fused stoker's working shoulder: the pivot of his arms and tool
  ST.forEach((s0, i) => f.joint(`stoker_${i + 1}`, SHL[i], 'firebox'));

  // ---- a lead pipe running off the back of the boiler out of frame toward the pools (behind everything)
  f.bone('boiler');
  const pipe = (pts, wd) => { f.part(K.chain(pts, pts.map(() => wd)), { fill: Q.lead, shadow: '#2a2a30', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 20 }); f.line(pts.map(q => add(q, [0, -wd * 0.3])), 2, '#b8bac0', { op: 0.6 }); };
  pipe([[300, 360], [120, 330], [-40, 340]], 54);
  // ---- the boiler body
  f.part(boiler, COP());
  // the heat-blackened base, cooked red-brown above; boiled patches; soft roundness of the belly
  f.raw(`<path d="${E.smooth([[200, 1040], [170, 900], [400, 860], [800, 880], [1200, 860], [1380, 900], [1320, 1040]])}" fill="${black}" opacity="0.6" filter="url(#steamblur2${seed})"/>`);
  f.raw(`<path d="${E.smooth([[220, 1040], [400, 980], [800, 1000], [1200, 980], [1320, 1040]])}" fill="${black}" opacity="0.5" filter="url(#steamblur2${seed})"/>`);
  // round the cylinder: dark at both edges, a broad lit band toward the light
  f.raw(`<path d="${E.smooth([[1380, 0], [1450, 400], [1440, 800], [1380, 1000], [1320, 980], [1370, 600], [1330, 100]])}" fill="#2a0e08" opacity="0.45" filter="url(#steamblur2${seed})"/>`);
  for (let i = 0; i < 7; i++) { const x = 300 + i * 150; f.line([[x + 60, 20], [x + 30, 500], [x + 10, 960]], 10, i % 2 ? '#3a1810' : '#c07a52', { op: 0.12 }); } // heat streaks running down the plates
  f.raw(`<path d="${E.smooth([[900, 300], [1250, 340], [1380, 600], [1300, 900], [1000, 860], [880, 560]])}" fill="${copL}" opacity="0.35" filter="url(#steamblur2${seed})"/>`); // the lit belly
  f.raw(`<path d="${E.smooth([[170, 300], [400, 260], [440, 700], [380, 1000], [180, 980]])}" fill="#2a0e08" opacity="0.4" filter="url(#steamblur2${seed})"/>`); // the shadow side turning away
  // the plates: rivet rows, each plate swollen out between them, a lit lip over each seam
  for (const y of bandY) { const b = band(y); f.stroke(b, 5, copD); f.line(b.map(q => add(q, [0, -6])), 2.4, copL, { op: 0.55 }); for (let i = 1; i < b.length - 1; i++) { f.rivet(lerp(b[i], b[i + 1], 0.0), 5, '#c07a52'); f.rivet(lerp(b[i], b[i + 1], 0.5), 5, '#c07a52'); } }
  for (let k = 0; k < bandY.length - 1; k++) { const y = (bandY[k] + bandY[k + 1]) / 2, b = band(y); f.line(b.slice(2, 11).map(q => add(q, [12, 0])), 6, copL, { op: 0.3 }); f.line(b.slice(1, 12).map(q => add(q, [0, 40])), 4, copD, { op: 0.35 }); } // the bulge of each plate
  for (const x of [520, 980]) { const pts = []; for (let y = 1140; y > -40; y -= 60) pts.push([x + (1140 - y) * 0.12, y]); f.line(pts, 3, copD, { op: 0.6 }); for (const q of pts) f.rivet(q, 4.4, '#c07a52'); } // vertical plate seams
  T.dents(f, [700, 700], 400, 400, 14);
  T.verdigris(f, [600, 1000], 300, 80, 16); T.verdigris(f, [1300, 700], 60, 300, 10);
  // blistered metal where it bubbled: domed blisters with a hot red rim
  for (let i = 0; i < 9; i++) { const c = [T.R(f, 600, 1340), T.R(f, 600, 960)], r = T.R(f, 8, 20); f.flat(T.lumpy(f, ell(add(c, [-r * 0.3, r * 0.4]), r * 1.1, r * 0.6, 0, 10), r * 0.2), '#2a0e08', { op: 0.4 }); f.flat(T.lumpy(f, ell(c, r, r * 0.7, 0, 10), r * 0.15), copL, { op: 0.75 }); f.flat(ell(add(c, [r * 0.3, -r * 0.3]), r * 0.3, r * 0.18, 0, 6), '#ffe0c0', { op: 0.7 }); f.line(T.lumpy(f, ell(c, r, r * 0.7, 0, 10), r * 0.15).slice(4, 9), 1.6, '#3a1208', { op: 0.6 }); } // the copper bubbled up in blisters near the fire
  // the two split seams glowing from the fire inside
  T.seam(f, [[1060, 1080], [1076, 980], [1066, 900], [1090, 820], [1084, 720]], 6);
  T.seam(f, [[420, 1060], [430, 960], [418, 880], [436, 790]], 5);
  // water weeping from every seam: runs, drips, and lime scale crusted bone-white round each leak
  for (const [x, y, l] of [[700, 812, 160], [1160, 600, 120], [380, 418, 200], [1020, 230, 140]]) {
    // the leak: a short split along the seam, lime scale crusted round it in a ragged white cake, runs of scale below
    f.line([[x - 30, y + 4], [x - 10, y + 10], [x + 12, y + 6], [x + 30, y + 12]], 3, '#1a0806');
    for (let k = 0; k < 7; k++) { const q = [x - 40 + k * 13 + T.R(f, -4, 4), y + T.R(f, 0, 18)]; f.flat(T.lumpy(f, ell(q, T.R(f, 8, 15), T.R(f, 5, 9), 0, 8), 3), k % 3 ? '#eee6da' : '#d8d0c4', { op: 0.9 }); }
    f.line([[x - 36, y + 18], [x, y + 24], [x + 36, y + 20]], 1.4, '#7a7068', { op: 0.6 });
    for (const dx of [-14, 8]) { f.stroke([[x + dx, y + 20], [x + dx + 3, y + 20 + l * 0.5], [x + dx - 2, y + 20 + l * (dx < 0 ? 1 : 0.6)]], 7, '#e8e0d4', { op: 0.55 }); f.line([[x + dx + 2, y + 24], [x + dx + 3, y + 20 + l * 0.4]], 1.4, '#fff', { op: 0.5 }); }
    T.drip(f, [x - 16, y + 24 + l], 1.8);
  }
  // the stopcock wheel on the side, bronze, and the cracked glass water gauge on the front
  { const wc = [430, 960]; f.part(ell(wc, 70, 64, 0, 20), { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, inkW: 1.8, tex: 'hammer' + seed, texOp: 0.5, maxShade: 14 }); f.flat(ell(wc, 54, 48, 0, 18), '#1a0e08'); for (let i = 0; i < 6; i++) { const a2 = i / 6 * Math.PI * 2; f.part(limb(wc, add(wc, [Math.cos(a2) * 58, Math.sin(a2) * 52]), 12, 10, { steps: 4 }), { fill: P.bronze, shadow: P.bronzeD, shade: 0.4, inkW: 1.2, cast: false }); } f.part(ell(wc, 18, 16, 0, 12), { fill: P.bronzeL, shadow: P.bronzeD, shade: 0.4, inkW: 1.4, cast: false }); T.verdigris(f, wc, 60, 50, 8); }
  { const gx = 1250, g0 = 780, g1 = 1040; f.part([[gx - 16, g0 - 20], [gx + 16, g0 - 20], [gx + 16, g0 + 10], [gx - 16, g0 + 10]], { fill: P.bronze, shade: 0.4, inkW: 1.4, sharp: true }); f.part([[gx - 16, g1 - 10], [gx + 16, g1 - 10], [gx + 16, g1 + 20], [gx - 16, g1 + 20]], { fill: P.bronze, shade: 0.4, inkW: 1.4, sharp: true });
    X.glassPart(f, [[gx - 10, g0 + 10], [gx + 10, g0 + 10], [gx + 10, g1 - 10], [gx - 10, g1 - 10]].map(q => [...q, 1]), { op: 0.8 }); f.flat([[gx - 8, 900], [gx + 8, 900], [gx + 8, g1 - 12], [gx - 8, g1 - 12]], '#6a5a52', { op: 0.6 }); f.line([[gx - 8, 900], [gx + 8, 900]], 2, '#e8f0ee'); f.line([[gx - 6, 830], [gx + 4, 860], [gx - 4, 880], [gx + 6, 920]], 1.8, INK); f.line([[gx + 4, g0 + 16], [gx + 4, g1 - 16]], 1.6, '#fff', { op: 0.6 }); }
  // a stoker's leather apron hung from a rivet
  { const r0 = [330, 1030]; f.rivet(r0, 7, '#c07a52'); f.part([add(r0, [-10, 0]), add(r0, [10, 0]), add(r0, [56, 40]), add(r0, [70, 190]), add(r0, [30, 214, 1]), add(r0, [-30, 200]), add(r0, [-60, 180, 1]), add(r0, [-48, 40])], { fill: P.leather, shadow: P.leatherD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 20 }); f.stroke([add(r0, [0, 40]), add(r0, [6, 190])], 2.4, P.leatherD); for (const [dx, dy] of [[-20, 120], [30, 90]]) f.flat(ell(add(r0, [dx, dy]), 12, 8, 0.3, 10), '#1a0e0a', { op: 0.6 }); }
  // the pressure valve on the shoulder: a bronze body, the weighted lever, the weight a lump of marble
  f.bone('valve');
  { const v0 = [1180, 210]; f.part([add(v0, [-40, 60]), add(v0, [40, 60]), add(v0, [30, 0]), add(v0, [16, -20]), add(v0, [-16, -20]), add(v0, [-30, 0])], { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, inkW: 1.6, tex: 'hammer' + seed, texOp: 0.5 });
    f.part(limb(add(v0, [-60, -26]), add(v0, [260, -10]), 22, 18, { steps: 6 }), { fill: P.iron, shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.5 }); f.part(ell(add(v0, [-60, -26]), 16, 16, 0, 10), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false }); f.rivet(add(v0, [0, -22]), 6, P.ironL);
    const mw = add(v0, [250, 30]); f.line([add(v0, [250, -10]), add(mw, [0, -30])], 4, P.iron); f.part(T.lumpy(f, [add(mw, [-44, -30]), add(mw, [40, -36]), add(mw, [54, 10]), add(mw, [30, 46]), add(mw, [-36, 40]), add(mw, [-54, 4])], 6), T.MAR(f, { inkW: 1.6, maxShade: 14 })); f.line([add(mw, [-30, -10]), add(mw, [10, 20])], 1.6, P.marbleS); }
  // ---- steam pouring from the cracks and the valve
  f.bone('steam_1'); T.steam(f, [1300, 640], 420, 70, { drift: 160, op: 0.55, grow: 1.4, n: 9, curls: 4, blur: 'steamblur2' });
  f.bone('steam_2'); T.steam(f, [500, 820], 360, 60, { drift: -140, op: 0.45, grow: 1.4, n: 8, curls: 3, blur: 'steamblur2' });
  f.bone('steam_3'); T.steam(f, [1180, 180], 300, 50, { drift: 80, op: 0.6, grow: 1.6, n: 7, curls: 3, blur: 'steamblur2' });
  // ---- the ladder bolted up the side, and the attendant cooked onto its rungs with his bucket
  f.bone('boiler');
  { const r0 = t => [220 + (1 - t) * 30 + t * 150, gy - t * (gy + 80)], r1 = t => [r0(t)[0] + 110, r0(t)[1] - 6];
    for (const rail of [r0, r1]) { const pts = [rail(0), rail(0.5), rail(1)]; f.part(K.chain(pts, [20, 18, 16]), { fill: P.iron, shadow: '#100c0c', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, inkW: 1.4 }); }
    for (let i = 1; i < 18; i++) { const t = i / 18; f.part(limb(r0(t), r1(t), 12, 12, { steps: 4, capK: 0.5 }), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false }); }
    for (const t of [0.1, 0.4, 0.7, 0.95]) { f.part([add(r1(t), [0, -8]), add(r1(t), [40, -10]), add(r1(t), [40, 8]), add(r1(t), [0, 8])], { fill: P.iron, shade: 0.4, inkW: 1.1, cast: false, sharp: true }); f.rivet(add(r1(t), [34, 0]), 4, P.ironL); } }
  f.bone('attendant');
  { // a bath attendant who was climbing with a bucket: baked onto the rungs, knees on one, hands on another, cheek pressed to the copper
    const A = [330, 640], ah = 96;
    f.part(T.lumpy(f, [add(A, [-40, -10]), add(A, [40, -40]), add(A, [70, 60]), add(A, [60, 220]), add(A, [20, 300]), add(A, [-40, 290]), add(A, [-60, 160])], 5), SK()); // the back, the boiled torso flat to the ladder
    f.part(T.lumpy(f, [add(A, [-30, 280]), add(A, [50, 270]), add(A, [80, 360]), add(A, [40, 430]), add(A, [-10, 420]), add(A, [-40, 340])], 4), T.LIN(f, { fill: '#c8beae' })); // the tunic's skirt
    f.part(K.chain([add(A, [20, 400]), add(A, [80, 470]), add(A, [40, 560])], [56, 46, 40]), SK()); f.part(K.chain([add(A, [-10, 400]), add(A, [-40, 480]), add(A, [-20, 560])], [56, 46, 40]), SK({ fill: mix(skin, skinS, 0.2) })); // legs folded on the rungs
    const hF = X.face(f, add(A, [50, -70]), ah, -0.3, { skin, jaw: 1.0, mouth: 'set', blind: true, squint: 0.9, age: true, hairCol: '#4a3830', noEar: false });
    f.stroke([hF([[0.06, -0.06]])[0], hF([[0.18, -0.06]])[0]], 3, INK);
    f.part(K.chain([add(A, [40, 10]), add(A, [110, -40]), add(A, [140, -120])], [44, 38, 32]), SK()); T.handBack(f, add(A, [140, -140]), -1.4, 30, skin, { shadow: skinS, curl: 0.7 }); // an arm up to the next rung, the hand baked round it
    T.peelSheet(f, add(A, [30, 120]), 30, 70, { sway: 3 }); T.peelSheet(f, add(A, [-30, 200]), 24, 60, { sway: -3 }); T.blisters(f, add(A, [0, 80]), 40, 60, 8, 4, 8);
    // the bucket on his far arm, hanging plumb from its rope bail
    const bk = add(A, [-100, 300]); f.line([add(A, [-40, 150]), add(bk, [0, -50])], 3, '#9a8462'); f.part([add(bk, [-46, -40]), add(bk, [46, -40]), add(bk, [38, 50]), add(bk, [-38, 50])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.4 }); for (const dy of [-24, 30]) f.line([add(bk, [-44, dy]), add(bk, [42, dy])], 4, P.iron); f.part(ell(add(bk, [0, -40]), 46, 10, 0, 14), { fill: '#3a2a24', shade: 0.3, inkW: 1.2, cast: false }); }

  // ---- the firebox: brick, the near side face and the front face with the door
  f.bone('firebox');
  f.part(side.map(q => [...q, 1]), BRK({ fill: mix(Q.brick, '#2a1010', 0.25) }));
  f.part(front.map(q => [...q, 1]), BRK());
  f.line([[CX, TOPs], [CX, gy + 30]], 3, INK, { op: 0.7 }); // the corner
  f.part([[130, TOPs + 10], [CX, TOPs - 16], [1500, TOPf - 14], [1500, TOPf + 16], [CX, TOPs + 20], [130, TOPs + 40]].map(q => [...q, 1]), { fill: '#8a7a70', shadow: '#2a2220', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 12 }); // the stone ledge where the copper sits
  f.raw(`<path d="${E.smooth([[CX, 1200], [1480, 1220], [1480, 1540], [CX, 1540]])}" fill="${Q.ember}" opacity="0.14" filter="url(#steamblur2${seed})"/>`); // the brick hot round the fire
  T.scald(f, [500, 1360], 300, 160, 30, { pink: Q.brickD, pale: Q.brickL, ang: 0 });
  for (let i = 0; i < 6; i++) f.line([[T.R(f, 200, 850), T.R(f, 1200, 1500)], [T.R(f, 200, 850), T.R(f, 1200, 1500)]], 2, INK, { op: 0.4 }); // cracks
  // the stokers' rota: a carved stone tablet set in the brick, its columns of names and marks
  { const t0 = [420, 1240]; f.part([t0, add(t0, [220, -8]), add(t0, [222, 150]), add(t0, [2, 158])].map(q => [...q, 1]), T.MAR(f, { inkW: 1.8, maxShade: 10 })); for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) f.line([add(t0, [20 + c * 52, 24 + r * 22]), add(t0, [52 + c * 52, 23 + r * 22])], 2, P.marbleS, { op: 0.8 }); f.flat([add(t0, [180, 110]), add(t0, [222, 100]), add(t0, [222, 150])], P.marbleS, { op: 0.6 }); }
  // the chalk tally: strokes in fives, the last group unfinished
  for (let g = 0; g < 5; g++) { const x0 = 700 + g * 34; for (let i = 0; i < (g === 4 ? 3 : 4); i++) f.line([[x0 + i * 6, 1420], [x0 + i * 6 - 2, 1470]], 2.4, '#e8e4dc', { op: 0.85 }); if (g < 4) f.line([[x0 - 4, 1462], [x0 + 24, 1426]], 2.4, '#e8e4dc', { op: 0.85 }); }
  // the fire opening: an arch in the front face, coals glowing inside, no flame
  const [dx0, dy0, dx1, dy1] = DOOR;
  const arch = [[dx0, dy1], [dx0, dy0 + 60], [dx0 + 30, dy0 + 10], [(dx0 + dx1) / 2, dy0 - 6], [dx1 - 30, dy0 + 14], [dx1, dy0 + 66], [dx1, dy1 + 4]];
  f.part(arch.map((q, i) => i === 0 || i === arch.length - 1 ? [...q, 1] : q), { fill: '#3a1208', shade: 0.2, inkW: 3, cast: false, hatch: false });
  f.raw(`<path d="${E.smooth(arch.map(q => lerp(q, [(dx0 + dx1) / 2, dy1 - 60], 0.2)))}" fill="${Q.ember}" opacity="0.6" filter="url(#steamblur${seed})"/>`);
  for (let i = 0; i < 26; i++) { const c = [T.R(f, dx0 + 20, dx1 - 20), T.R(f, dy1 - 90, dy1 - 10)], r = T.R(f, 8, 18); f.part(T.lumpy(f, ell(c, r, r * 0.7, 0, 8), 2), { fill: f.r() < 0.5 ? '#f0a060' : '#c04a20', shade: 0.3, inkW: 1, cast: false, hatch: false }); f.flat(ell(add(c, [2, -2]), r * 0.4, r * 0.3, 0, 6), '#ffe0a0', { op: 0.6 }); }
  for (let i = 0; i < 5; i++) { const x = dx0 + 20 + i * 26; f.line([[x, dy1 - 90], [x + 6, dy1 - 120], [x - 4, dy1 - 150]], 2, '#8a5040', { op: 0.5 }); } // heat shimmer, as dark wavering lines
  for (let i = 0; i < 9; i++) { const a2 = Math.PI + i / 8 * Math.PI, q = add([(dx0 + dx1) / 2, dy0 + 70], [Math.cos(a2) * 90, Math.sin(a2) * 80]); f.part([add(q, [-14, -8]), add(q, [14, -8]), add(q, [12, 10]), add(q, [-12, 10])], BRK({ fill: Q.brickD, inkW: 1.4, cast: false, maxShade: 6 })); } // the arch's voussoirs
  // ---- the fused stokers: four men pressed half into the hot brick round the door, baked on like bread to an oven wall
  const stoker = (i, o) => {
    const { c, a } = ST[i], H = 104, F = frame(c, a, 1);
    f.bone('firebox');
    // the torso emerges from the wall: a soft mass whose edges are lost in brick, crust baked round it
    const tor = F(o.body);
    f.part(T.lumpy(f, tor, 5), SK());
    f.raw(`<path d="${E.smooth(tor)}" fill="none" stroke="${Q.brickD}" stroke-width="22" opacity="0.6" filter="url(#steamblur${seed})"/>`); // flesh browned where it meets the brick
    for (let k = 0; k < tor.length; k += 2) { const q = tor[k]; f.part([add(q, [-16, -8]), add(q, [16, -10]), add(q, [18, 8]), add(q, [-14, 10])], BRK({ cast: false, inkW: 1.3, maxShade: 6, fill: mix(Q.brick, '#e0b0a0', 0.15) })); } // bricks lapping over the edges: half sunk in the wall
    // the man under the baking: collarbones, the chest, the belly's fold, a navel; the far arm sunk in the wall to the elbow
    const fo = (pts, w = 2.6) => { f.stroke(F(pts), w, '#7a4450', { op: 0.6 }); f.line(F(pts).map(q => add(q, [1, -3])), 1.2, '#fff4ee', { op: 0.5 }); };
    fo([[-70, -80], [-20, -70], [0, -84]]); fo([[0, -84], [30, -70], [76, -78]]);
    fo([[-74, -20], [-30, 6], [10, -10]], 3); fo([[16, -14], [50, 8], [86, -16]], 3);
    fo([[-80, 50], [-10, 70], [70, 50]], 3.2); f.line(F([[0, 84], [4, 92], [0, 100]]), 2, INK, { op: 0.6 });
    for (const q of [[-40, -6], [50, -4]]) f.flat(F(ell(q, 6, 5, 0, 8)), '#9a5a5a', { op: 0.6 });
    f.part(F([[-120, -60], [-150, -40], [-160, 10], [-130, 30], [-110, 0]]), SK({ fill: mix(skin, skinS, 0.2), cast: false })); // the far arm going into the brick
    for (const q of [[-150, -30], [-160, 10]]) f.part(F([[q[0] - 20, q[1] - 10], [q[0] + 10, q[1] - 12], [q[0] + 12, q[1] + 10], [q[0] - 18, q[1] + 12]]), BRK({ cast: false, inkW: 1.3, maxShade: 6 }));
    T.scald(f, c, 50, 60, 10, { pink: P.poachD });
    T.peelSheet(f, add(c, o.peel || [10, 20]), 24, 50, { sway: 2 });
    T.blisters(f, add(c, [0, -10]), 40, 30, 6, 3, 7);
    // the head, pressed sideways into the brick, eyes squeezed shut against the heat, pink and shining
    const hc = F([o.head])[0], hF = X.face(f, hc, H, a + (o.ha || 0), { skin, jaw: 1.06, mouth: 'set', blind: true, squint: 0.9, browDown: 0.08, age: true, hairCol: '#3a2a24', noEar: !!o.noEar });
    f.stroke([hF([[0.05, -0.06]])[0], hF([[0.11, -0.04]])[0], hF([[0.18, -0.06]])[0]], 3.4, INK); f.stroke([hF([[0.27, -0.06]])[0], hF([[0.31, -0.05]])[0]], 2.4, INK);
    for (let k = 0; k < 3; k++) f.line(hF([[0.16 + k * 0.03, -0.1], [0.22 + k * 0.03, -0.14]]), 1.2, INK, { op: 0.6 });
    T.sheen(f, hF([[-0.2, -0.4], [0.0, -0.5], [0.2, -0.44]]), 3, 0.65); T.beads(f, hF([[0.06, -0.2]])[0], 30, 10, 6, 1.4);
    f.part(hF([[-0.4, -0.1], [-0.46, -0.3], [-0.28, -0.48], [-0.02, -0.54], [0.18, -0.48], [-0.04, -0.4], [-0.24, -0.22], [-0.32, 0.04]]), { fill: '#3a2a24', shadow: '#120a08', shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, cast: false }); // singed hair
    // his arms, working the tool in and out of the fire: shoulder, elbow, the fists on the haft
    f.bone(`stoker_${i + 1}`);
    if (o.tool) {
      const { S0, E0, W0, W1, t0, t1 } = o.tool;
      X.muscleArm(f, S0, E0, W0, 50, 42, SK(), '_x', { castShadow: false });
      f.marks.forEach(m => { if (m.bone === 'upperarm_x' || m.bone === 'forearm_x') m.bone = `stoker_${i + 1}`; });
      f.bone(`stoker_${i + 1}`);
      const tA = ang(t0, t1);
      if (o.shovel) { f.part(limb(t0, t1, 18, 16, { steps: 8 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.4 }); const bl = frame(t1, tA, 1); f.part(bl([[-10, -40], [90, -50], [110, 0], [90, 50], [-10, 40]]), { fill: P.iron, shade: 0.42, inkW: 1.6, tex: 'mottle' + seed, texOp: 0.6 }); f.part(bl([[20, -36], [90, -40], [96, 30], [20, 30]]), { fill: '#1a1210', shade: 0.3, inkW: 0, cast: false }); for (let k = 0; k < 6; k++) f.flat(bl(ell([40 + k * 9, -14 + (k % 3) * 14], 7, 6, 0, 6)), k % 2 ? '#f0a060' : '#2a1a14'); } // a coal shovel, burning coal on its blade
      else { X.fireHook(f, t0, t1, 14, { up: o.up ?? -1 }); }
      const g1 = X.gripK(f, W0, E0, tA, 36, skin, { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: `stoker ${i + 1}`, maxBend: 40 });
      if (W1) { X.gripK(f, W1, lerp(E0, W1, 0.5), tA, 34, mix(skin, skinS, 0.2), { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, maxBend: 40, quiet: true }); }
    } else if (o.latch) { // the stoker above the door: his hands baked onto the broken latch bar
      X.muscleArm(f, o.latch.S0, o.latch.E0, o.latch.W0, 50, 42, SK(), '_x', { castShadow: false });
      f.marks.forEach(m => { if (m.bone === 'upperarm_x' || m.bone === 'forearm_x') m.bone = `stoker_${i + 1}`; });
      f.bone(`stoker_${i + 1}`);
      f.part(limb(add(o.latch.W0, [-60, 0]), add(o.latch.W0, [60, 6]), 16, 16, { steps: 4 }), { fill: P.iron, shade: 0.4, inkW: 1.3 });
      f.flat([add(o.latch.W0, [56, -6]), add(o.latch.W0, [66, 2]), add(o.latch.W0, [58, 10])], '#0a0606'); // the snapped end
      T.handBack(f, o.latch.W0, 0.1, 34, skin, { shadow: skinS, curl: 0.9, spread: 0.1 });
    }
  };
  // stoker 4, low by the door, the coal shovel; stoker 1 left of the door, a rake; stoker 2 right of the door, a rake; stoker 3 above
  const torsoP = (k = 1) => [[-96, -86], [-40, -110], [40, -112], [100, -86], [118, -10], [96, 90], [40, 120], [-40, 122], [-98, 92], [-118, -6]].map(q => mul(q, k)); // shoulders, chest, the belly lost in the brick
  stoker(3, { body: torsoP(0.9), head: [-20, -150], ha: 0.2, tool: { S0: [1050, 1420], E0: [1124, 1418], W0: [1140, 1500], t0: [1560, 1420], t1: [1190, 1470] }, shovel: true, peel: [40, -20] });
  stoker(0, { body: torsoP(1), head: [0, -170], ha: 0.1, tool: { S0: [1070, 1230], E0: [1140, 1248], W0: [1150, 1330], W1: null, t0: [1590, 1220], t1: [1200, 1340] }, peel: [-40, 0] });
  stoker(1, { body: torsoP(0.95), head: [10, -160], ha: -0.2, noEar: true, tool: { S0: [1370, 1230], E0: [1306, 1250], W0: [1290, 1330], t0: [1640, 1280], t1: [1260, 1400] }, up: 1, peel: [50, 10] });
  stoker(2, { body: torsoP(0.7).map(q => [q[0] * 1.3, q[1] * 0.7]), head: [0, -96], ha: 0, latch: { S0: [1160, 1130], E0: [1130, 1180], W0: [1216, 1190] }, peel: [-60, 20] });
  // ---- the fire door hanging open on one hinge, its latch broken, swung out toward us
  f.bone('door');
  { const hx = dx0 - 4; f.part([[hx, dy0 + 30], [hx - 120, dy0 + 70], [hx - 130, dy1 + 30], [hx - 6, dy1 - 10]].map(q => [...q, 1]), { fill: P.iron, shadow: '#0c0a0a', shade: 0.42, tex: 'mottle' + seed, texOp: 0.7, inkW: 2, maxShade: 20 });
    for (let k = 0; k < 4; k++) { const t = 0.15 + k * 0.23; f.rivet(lerp([hx - 16, dy0 + 40], [hx - 18, dy1 - 20], t), 5, P.ironL); f.rivet(lerp([hx - 110, dy0 + 76], [hx - 118, dy1 + 20], t), 5, P.ironL); }
    f.part([[hx - 4, dy0 + 40], [hx + 14, dy0 + 40], [hx + 14, dy0 + 70], [hx - 4, dy0 + 70]], { fill: P.iron, shade: 0.4, inkW: 1.4, sharp: true }); // the surviving hinge
    f.line([[hx - 6, dy1 - 40], [hx + 10, dy1 - 20]], 3, INK); // the torn lower hinge
    T.dents(f, [hx - 60, dy0 + 160], 40, 80, 4); f.raw(`<path d="${E.smooth([[hx - 20, dy0 + 60], [hx - 4, dy0 + 60], [hx - 6, dy1 - 20], [hx - 24, dy1]])}" fill="${Q.ember}" opacity="0.35" filter="url(#steamblur${seed})"/>`); }
  // ---- the burst coal sack heaped at the base of the corner, and the dead Kettle Crab cooked on the ledge
  f.bone('firebox');
  { const sk = [820, 1500]; f.part(T.lumpy(f, [add(sk, [-90, 60]), add(sk, [-100, 0]), add(sk, [-60, -60]), add(sk, [-10, -70]), add(sk, [30, -20]), add(sk, [60, 60])], 6), { fill: '#7a6a4a', shadow: '#2a2014', shade: 0.4, tex: 'weave' + seed, texOp: 0.7 }); f.flat([add(sk, [-20, -40]), add(sk, [20, -16]), add(sk, [10, 10]), add(sk, [-30, -10])], '#1a1210'); for (let i = 0; i < 30; i++) { const c = add(sk, [T.R(f, -10, 180), T.R(f, 20, 66)]), r = T.R(f, 8, 18); f.part(T.lumpy(f, ell(c, r, r * 0.7, f.r() * 3, 7), 3).map(q => [...q, 1]), { fill: '#1e1a1c', shade: 0.3, inkW: 1, cast: false, hatch: false }); f.flat(ell(add(c, [2, -3]), r * 0.4, r * 0.2, 0.4, 6), '#6a6a74', { op: 0.7 }); } }
  { const kc = [1420, 1004], F2 = frame(kc, Math.PI, 1); // upside down, legs curled up, cooked red
    for (let i = 0; i < 4; i++) { const a0 = [-30 + i * 20, 6], k1 = add(a0, [-6 + i * 4, 30]), k2 = add(k1, [10, 14]); f.part(F2(K.chain([a0, k1, k2], [10, 8, 5])), { fill: '#a83424', shade: 0.4, inkW: 1, cast: false }); }
    f.part(F2([[-50, 0], [-40, -20], [0, -26], [40, -20], [50, 0], [30, 10], [-30, 10]]), { fill: '#c4442c', shadow: '#4a1414', shade: 0.4, inkW: 1.4, tex: 'mottle' + seed, texOp: 0.5 }); f.part(F2([[-30, 8], [30, 8], [20, 22], [-20, 22]]), { fill: '#ecccb8', shade: 0.3, inkW: 1.1, cast: false }); f.part(F2([[40, -6], [76, -20], [84, -2], [60, 6]]), { fill: '#c4442c', shade: 0.4, inkW: 1.2, cast: false }); T.wisp(f, add(kc, [0, -20]), 60, { w: 5, op: 0.3 }); }
  // ---- lead pipe running out of frame to the pools at the front, bandaged with rags where it leaks
  f.bone('boiler');
  pipe([[1400, 420], [1520, 400], [1660, 420]], 56);
  for (const x of [1480, 1560]) { for (let k = 0; k < 3; k++) f.stroke([[x + k * 10, 370], [x + 4 + k * 10, 400], [x + k * 10, 446]], 10, k % 2 ? '#c8bca4' : '#b4a88e'); f.stroke([[x + 10, 446], [x + 14, 480], [x + 10, 520]], 6, '#b4a88e'); T.drip(f, [x + 10, 526], 2); } // rag bandages, a dripping end
  T.wisp(f, [1520, 380], 120, { w: 10, op: 0.32, drift: 20 });
  f.bone('root');
  f.flat(ell([820, gy + 6], 820, 18, 0, 20), '#2a1e1e', { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ THE BEST FAMILIES (ruler 3)
// The seventh pool was kept for the best families. They have climbed out to complain about the water. Twenty and more
// nobles, cooked together where they sat when the water rose to the boil, are one soft heap: it spills over the marble lip
// of their pool onto the floor tiles and hauls itself forward on many arms; the back of the heap and the pool are cut off
// by the frame (top, and the right edge once it faces left). Centre of mass low and forward; it drags. Fire dominates:
// the skin boiled pink-white and shining, peeling in long sheets, blistered at every fold, and where bodies touch the
// flesh has run together like meat poached in one pot. Water keeps the heap swollen, wrinkled and steaming.
// Independent review rebuild: the heap is people, each a distinct age and build with real anatomy and a face at true
// size. Highest, head and shoulders free, the PATRIARCH: fat, bald, a grey fringe, jowls and a double chin, mouth open in
// complaint, the bay wreath cooked grey slipping over his ear, the pool token VII on his breast, his silver cup raised.
// Below him at the left the DOWAGER: gaunt, collarbones and ribs, a long hooked face turned up to him mid-sentence, a
// collapsed coiffure with bone hairpins, pearls sunk in her stringy neck, fanning him with the wilted stalk of her fan;
// her legs hang over the pool's lip. In front, poured over the lip and down onto the floor, the HEIR: soft and young,
// dozing, his arms hauling the heap forward over the tiles, an empty lapdog's collar on one wrist. On the patriarch's
// side a dozing MATRON whose hand pats the heir's back; at the back an old lord SNORING; more backs, a buttock, a knee
// and a foot in a bath clog in the mass. Arms out of the mass: the cracked bronze strigil waved, the towel boy's arm
// still holding out a towel, hands flat on the rim and gripping the lip. Bath sheets with the families' badges, pearls,
// silver signet rings, a soaked cushion, a cracked oil flask, bath clogs and a slab of the marble coping baked into the
// underside.
// Rig: heap (root: pool, floor, rim, the back of the mass, the snorer) + patriarch (his body) + p_head + dowager + matron
// + front (the heir and the leading lobe) + arm_1..arm_9 (one bone each, at the shoulder) + towel. Motion: idle the heap
// shifting and murmuring (front, matron, arm_9 patting, p_head complaining); attack the heap surging forward (front, heap)
// and the arms taking hold of a hero (arm_1, arm_2, arm_3 reach; arm_4 rakes the strigil).
function bestFamilies() {
  const seed = 320, h = TIERS.ruler[1];
  const f = new Fig(T.base(seed, h, { grimeY: 1350, inkW: 1.8, inkHeavy: 4 }));
  X.textures(f);
  const gy = f.o.groundY;
  const skin = '#f2d8ce', skinS = '#7e4a58', skinL = '#fbeee8';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: '#a45e6c', shade: 0.34, tex: 'mottle' + seed, texOp: 0.22, maxShade: 46, fold: '#7a3440' }, o);
  const RING = (c, a, w) => X.silverRing(f, c, a, w, { signet: true });
  const RIM = 1230, RIMX = 640;
  // ---- skeleton of the heap
  const PH = 228, pN = [650, 420], pS = B.spine(pN, [690, 610], [680, 880], PH * 0.84), pHC = [708, 222], pA = -0.12;
  const DH = 182, dN = [300, 716], dS = B.spine(dN, [266, 884], [290, 1084], DH * 0.86), dHC = [400, 560], dA = -0.62;
  const HH = 186, hN = [1130, 984], hS = B.spine(hN, [1080, 1130], [990, 1290], HH * 0.86), hHC = [1226, 870], hA0 = 0.36;
  const MH = 168, mN = [968, 776], mS = B.spine(mN, [990, 884], [980, 1014], MH * 0.86), mHC = [1022, 640], mA = 0.3;
  f.joint('heap', [700, gy]).joint('patriarch', [680, 860], 'heap').joint('p_head', pN, 'patriarch').joint('dowager', [290, 1080], 'heap')
    .joint('matron', [980, 1000], 'heap').joint('front', [930, 1300], 'heap').joint('towel', [700, 1120], 'heap');

  // ---- the pool behind (cut off by the frame): steaming water above the rim, and the steam rising off it
  f.bone('heap');
  f.flat([[-20, 980], [700, 1000], [700, RIM], [-20, RIM]], '#9a888c', { op: 0.6 });
  T.steam(f, [200, 1000], 1000, 220, { drift: -60, op: 0.5, grow: 0.8, n: 12, curls: 6, curlW: 2, blur: 'steamblur2' });
  // ---- the floor tiles, wet
  f.part([[-20, 1430], [1620, 1420], [1620, 1620], [-20, 1620]], T.MAR(f, { maxShade: 8, cast: false }));
  for (let i = 0; i < 9; i++) f.line([[i * 200 - 40, 1424], [i * 230 - 120, 1620]], 2, P.marbleS, { op: 0.6 }); f.line([[-20, 1500], [1620, 1494]], 2, P.marbleS, { op: 0.5 });
  for (let i = 0; i < 6; i++) f.flat(T.lumpy(f, ell([T.R(f, 900, 1580), T.R(f, 1450, 1590)], T.R(f, 40, 90), T.R(f, 5, 10), 0, 10), 4), P.water, { op: 0.4 });
  // ---- the marble lip of the pool, seen end-on at the left: its top, its moulded face, the end the heap pours over
  f.part([[-20, RIM - 20], [RIMX, RIM - 30], [RIMX + 30, RIM - 10], [RIMX + 30, gy], [-20, gy]].map(q => [...q, 1]), T.MAR(f, { maxShade: 30 }));
  f.part([[-20, RIM - 44], [RIMX + 10, RIM - 54], [RIMX + 40, RIM - 24], [-20, RIM - 10]], T.MAR(f, { fill: P.marbleL, maxShade: 8 }));
  f.line([[-20, RIM + 60], [RIMX + 30, RIM + 50]], 3, P.marbleS, { op: 0.7 }); f.line([[-20, RIM + 200], [RIMX + 30, RIM + 194]], 3, P.marbleS, { op: 0.7 });
  for (let i = 0; i < 4; i++) { const x0 = 40 + i * 150; const sp = []; for (let k = 0; k <= 14; k++) { const aa = -k * 0.5, rk = 40 * (1 - k / 16); sp.push(add([x0 + 60, RIM + 126], [Math.cos(aa) * rk, Math.sin(aa) * rk])); } f.line([[x0, RIM + 166], [x0 + 26, RIM + 100], ...sp], 2.6, P.marbleS, { op: 0.7 }); } // the carved wave frieze
  { const tk = [80, RIM + 290]; f.part([tk, add(tk, [120, -2]), add(tk, [120, 70]), add(tk, [0, 72])].map(q => [...q, 1]), T.MAR(f, { fill: P.marbleD, inkW: 1.6 })); f.line([add(tk, [30, 16]), add(tk, [38, 56]), add(tk, [46, 16])], 3, P.marbleS); f.line([add(tk, [60, 16]), add(tk, [60, 56])], 3, P.marbleS); f.line([add(tk, [78, 16]), add(tk, [78, 56])], 3, P.marbleS); } // VII carved on the pool's face
  for (let i = 0; i < 5; i++) { const x = T.R(f, 40, 600); f.stroke([[x, RIM - 10], [x + 3, RIM + 100], [x - 2, RIM + 200]], 6, P.water, { op: 0.4 }); } // water spilling over the lip
  T.verdigris(f, [600, RIM + 40], 30, 20, 4);

  // ======== the back of the heap: more bodies in the steam's shadow, run together
  const BK = (o = {}) => SK(Object.assign({ fill: mix(skin, '#4a2232', 0.5), shadow: '#2a1018', maxShade: 26, texOp: 0.3 }, o));
  const back = [[-30, 1240], [-30, 230], [60, 190], [200, 230], [330, 330], [450, 420], [560, 520], [780, 640], [1000, 760], [1210, 840], [1380, 1000], [1470, 1240], [1490, 1420], [1480, 1560], [700, 1560], [660, 1240]];
  f.part(T.lumpy(f, back, 14), BK({ maxShade: 40 }));
  // a broad back seen from behind (spine furrow, shoulder blades), a pair of buttocks, a knee, a foot in a bath clog
  const blade = (c, s, a) => { const F2 = frame(c, a, s); f.part(F2([[-1, -0.5], [-0.3, -0.9], [0.6, -0.8], [1.05, -0.2], [0.9, 0.7], [0.2, 1.0], [-0.7, 0.8], [-1.1, 0.2]]), BK({ inkW: 1.4, inkHeavy: 2.4, maxShade: 30 })); f.stroke(F2([[0.0, -0.8], [0.04, 0.0], [-0.02, 0.9]]), s * 0.05, '#5a2836', { op: 0.7 }); for (const sg of [-1, 1]) f.stroke(F2([[sg * 0.5, -0.6], [sg * 0.38, -0.2], [sg * 0.52, 0.12]]), s * 0.04, '#5a2836', { op: 0.6 }); f.line(F2([[-0.8, -0.4], [-0.4, -0.7], [0.2, -0.74]]), 2, skinL, { op: 0.4 }); T.blisters(f, c, s * 0.5, s * 0.4, 4, 3, 7, { burst: 0.5 }); T.scald(f, c, s * 0.6, s * 0.5, 8, { pink: P.poachD }); };
  blade([110, 700], 150, 0.15);
  blade([1270, 950], 120, -0.5);
  { const c = [390, 470], F2 = frame(c, -0.5, 110); f.part(F2([[-1, 0.2], [-0.8, -0.7], [0.0, -1.0], [0.9, -0.7], [1.1, 0.2], [0.6, 0.9], [-0.4, 0.9]]), BK({ inkW: 1.4, inkHeavy: 2.4, maxShade: 26 })); f.stroke(F2([[0.0, -0.9], [0.06, 0.1], [0.0, 0.9]]), 6, '#5a2836', { op: 0.75 }); f.stroke(F2([[-0.8, 0.6], [-0.4, 0.86], [-0.05, 0.7]]), 5, '#5a2836', { op: 0.6 }); f.stroke(F2([[0.1, 0.7], [0.5, 0.86], [0.9, 0.5]]), 5, '#5a2836', { op: 0.6 }); T.scald(f, c, 80, 60, 8, { pink: P.poachD }); } // buttocks
  { const ft = [250, 360], F2 = frame(ft, -0.7, 1); f.part(F2([[-60, -34], [60, -40], [116, -22], [124, 6], [60, 22], [-60, 26]]), BK({ inkW: 1.4 })); for (let i = 0; i < 4; i++) f.part(F2(ell([100 + i * 4, -18 + i * 10], 13, 8, 0.2, 8)), BK({ cast: false, inkW: 1 })); f.part(F2([[-50, 22], [128, 12], [132, 36], [-50, 44]]), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.4 }); f.stroke(F2([[0, 16], [30, -42], [70, 8]]), 8, P.leather); f.line(F2([[-40, 32], [120, 24]]), 1.4, P.woodL, { op: 0.5 }); } // a foot in its wooden bath clog
  { const kc = [560, 760]; f.part(T.lumpy(f, [add(kc, [-110, 40]), add(kc, [-40, -60]), add(kc, [60, -70]), add(kc, [110, 10]), add(kc, [60, 80]), add(kc, [-60, 90])], 6), BK({ inkW: 1.4, maxShade: 26 })); f.flat(ell(add(kc, [20, -30]), 34, 24, 0.3, 10), skinL, { op: 0.3 }); f.stroke([add(kc, [-60, 50]), add(kc, [0, 70]), add(kc, [60, 40])], 4, '#5a2836', { op: 0.6 }); } // a knee
  // the snorer: an old lord asleep at the back, his head and one shoulder above the mass, mouth open
  { const sS = B.spine([130, 470], [110, 600], [110, 760], 135);
    f.part(T.lumpy(f, sS.shape([[-0.06, 0.5, 0.5], [0.08, 0.9, 0.8], [0.3, 1.0, 1.0], [0.6, 1.0, 1.1], [0.9, 0.9, 1.0]]), 4), BK({ fill: mix(skin, skinS, 0.2), maxShade: 40 }));
    f.stroke([sS.at(0.2, 0.36), sS.at(0.6, 0.42), sS.at(0.96, 0.36)], 4, '#5a2836');
    const hc = [205, 345]; f.part(K.chain([sS.at(0.1, 0.0), add(hc, [-10, 60])], [150, 120]), BK({ fill: mix(skin, skinS, 0.2) }));
    X.bfHead(f, hc, 150, 0.42, 'snorer', { skin: mix(skin, skinS, 0.14), hair: '#a49e94' });
    X.fuse(f, [200, 560], 110, 40, 0.1); }
  f.raw(`<path d="${E.smooth([[-30, 380], [300, 420], [700, 640], [1300, 860], [1480, 1100], [1480, 1500], [-30, 1500]])}" fill="#cfc4c4" opacity="0.16" filter="url(#steamblur2${seed})"/>`); // the steam's veil over the back of the heap

  // ======== an arm out of the mass behind the matron, waving the cracked bronze strigil
  f.bone('arm_4'); f.joint('arm_4', [1190, 800], 'heap');
  { const S0 = [1190, 800], E0 = [1300, 720], W0 = [1380, 590];
    const A = X.fleshArm(f, S0, E0, W0, [110, 92, 70], SK({ fill: mix(skin, skinS, 0.1) }), { build: 'soft' });
    const c = add(W0, mul(A.dF, 34));
    // the strigil: a curved bronze scraper, its handle in the fist, the blade arcing forward; a crack across it
    const g = B.gripAngle(c, E0, -Math.PI / 2 + 0.2, { inline: true, name: 'arm_4 strigil' });
    const d = [Math.cos(g.ang), Math.sin(g.ang)], n = [-d[1], d[0]], s0 = add(c, mul(d, 40));
    const ctrl = [add(s0, mul(d, -90)), s0, add(add(s0, mul(d, 70)), mul(n, -30)), add(add(s0, mul(d, 130)), mul(n, -30)), add(add(s0, mul(d, 170)), mul(n, 10))];
    f.part(K.chain(ctrl, [22, 22, 26, 24, 14]), { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, inkW: 1.4, tex: 'hammer' + seed, texOp: 0.5 });
    f.line(ctrl.slice(1).map(q => add(q, mul(n, -6))), 2, P.bronzeL, { op: 0.7 }); f.line([add(ctrl[2], mul(n, -10)), add(ctrl[2], mul(n, 12))], 2.4, INK); T.verdigris(f, ctrl[3], 16, 8, 3);
    X.knuckleFist(f, c, g.ang, 52, mix(skin, skinS, 0.1), { flip: g.flip, tex: 'pruned' + seed, texOp: 0.6, fat: true, shadow: skinS });
    RING(lerp(c, add(c, mul(d, 50)), 0.5), g.ang, 14); }

  // ======== the PATRIARCH: highest, head and shoulders free, fat and bald, complaining, the cup raised
  f.bone('patriarch');
  const pt = X.bfTorso(f, pS, 'fat', SK({ fill: '#f0d0c6' }));
  X.peel(f, pS.at(1.0, 0.56), 46, 110, { sway: 4 }); X.peel(f, pS.at(0.3, 0.64), 40, 96, { sway: -3 });
  // the neck: thick, rolls at the nape, the cord of the token
  f.bone('p_head');
  const pHF = frame(pHC, pA, PH);
  f.part(K.chain([pS.at(0.05, 0.02), pHF([[-0.12, 0.38]])[0]], [PH * 1.08, PH * 0.82]), SK({ fill: '#f0d0c6' }));
  for (let i = 0; i < 2; i++) f.stroke([add(pN, [-80 + i * 10, -30 - i * 34]), add(pN, [-40, -10 - i * 34]), add(pN, [0, -30 - i * 30])], 4, '#7a3440');
  X.bfHead(f, pHC, PH, pA, 'patriarch', { skin: '#f0d0c6' });
  // the bay wreath, cooked grey, slipping down over the ear
  { const wr = []; for (let i = 0; i <= 12; i++) { const t = i / 12; wr.push(pHF([[0.22 - t * 0.62, -0.42 + t * 0.62 + Math.sin(t * 3) * 0.04]])[0]); }
    f.stroke(wr, 6, '#4a4a3a');
    wr.forEach((q, i) => { for (const sd of [-1, 1]) { const a2 = -0.6 + i * 0.12 + sd * 0.8, L = 34; f.part([q, add(q, rot([L * 0.5, -8 * sd], a2)), add(q, rot([L, 0], a2)), add(q, rot([L * 0.5, 8 * sd], a2))], { fill: i % 3 ? '#8a8a78' : '#7a7a66', shadow: '#2a2a20', shade: 0.4, inkW: 1, cast: false }); f.line([q, add(q, rot([L * 0.9, 0], a2))], 0.8, '#2a2a20', { op: 0.6 }); } }); }
  f.bone('patriarch');
  // the pool token, a bronze disc stamped VII, on a cord round his neck, lying on his breast
  { const tk = pS.at(0.72, 0.3); f.line([pS.at(0.0, 0.02), add(tk, [-30, -10]), tk], 2.6, '#3a2a20'); f.line([pS.at(0.8, 0.0), tk], 2.6, '#3a2a20');
    f.part(ell(tk, 34, 36, 0, 16), { fill: P.bronze, shadow: P.bronzeD, shade: 0.42, inkW: 1.6, tex: 'hammer' + seed, texOp: 0.5 }); f.line(ell(tk, 27, 29, 0, 16).concat([ell(tk, 27, 29, 0, 16)[0]]), 1.4, P.bronzeD);
    f.line([add(tk, [-16, -11]), add(tk, [-11, 11]), add(tk, [-6, -11])], 2.6, P.bronzeD); for (const dx of [2, 10, 18]) f.line([add(tk, [dx, -11]), add(tk, [dx, 11])], 2.6, P.bronzeD);
    T.verdigris(f, add(tk, [-10, 14]), 12, 8, 3); f.line([add(tk, [-24, -16]), add(tk, [-8, -28])], 2, P.bronzeL, { op: 0.7 }); }
  X.bathSheet(f, [pS.at(0.24, 0.22), pS.at(-0.24, -0.05), pS.at(-0.74, 0.06), pS.at(-0.98, 0.4), pS.at(-0.94, 0.8)], [64, 96, 116, 104, 90], { badge: 'heron', col: '#6a3a4e', bend: 1, at: 3 });
  // his cup arm, raised: the silver cup held up in complaint, wine slopping over the rim and down his wrist
  f.bone('arm_8'); f.joint('arm_8', [722, 452], 'patriarch');
  { const S0 = [722, 452], E0 = [876, 332], W0 = [1046, 300];
    const A = X.fleshArm(f, S0, E0, W0, [138, 112, 84], SK({ fill: '#f0d0c6' }), { build: 'fat', occ: true, deltoid: true, peel: true });
    const c = add(W0, mul(A.dF, 46)), s = 84;
    const g = B.gripAngle(c, E0, -Math.PI / 2, { name: 'arm_8 cup' });
    const ax = [Math.cos(g.axis), Math.sin(g.axis)];
    const st0 = add(c, mul(ax, -60)), st1 = add(c, mul(ax, 64)), bw = add(c, mul(ax, 120));
    f.part(K.chain([st0, st1], [16, 14]), { fill: Q.silver, shadow: Q.silverD, shade: 0.42, inkW: 1.4, tex: 'hammer' + seed, texOp: 0.4 }); // stem
    f.part(ell(st0, 40, 12, g.axis + Math.PI / 2, 14), { fill: Q.silver, shadow: Q.silverD, shade: 0.42, inkW: 1.4, cast: false }); // foot
    const cu = bw, cuF = frame(cu, g.axis - Math.PI / 2, 1); // local +y toward the rim (up the cup's axis)
    // the bowl: a deep silver cup flaring to its rim, a knop where it meets the stem, chased bands, dents, the wine at the rim
    f.part(cuF([[-58, 52], [-62, 20], [-52, -20], [-30, -48], [-12, -58], [12, -58], [30, -48], [52, -20], [62, 20], [58, 52]]), { fill: Q.silver, shadow: Q.silverD, shade: 0.45, inkW: 1.8, tex: 'hammer' + seed, texOp: 0.4, maxShade: 14 });
    f.part(cuF(ell([0, -60], 16, 9, 0, 10)), { fill: Q.silver, shadow: Q.silverD, shade: 0.4, inkW: 1.4, cast: false });
    f.part(cuF(ell([0, 52], 58, 13, 0, 16)), { fill: '#3a1020', shade: 0.3, inkW: 1.6, cast: false }); f.line(cuF(ell([0, 52], 52, 9, 0, 16).slice(9, 16)), 2, '#8a3a5a', { op: 0.8 });
    f.line(cuF([[-54, 30], [0, 36], [54, 30]]), 2, Q.silverD, { op: 0.7 }); f.line(cuF([[-50, 6], [0, 12], [50, 6]]), 1.4, Q.silverD, { op: 0.6 });
    f.stroke(cuF([[-20, -50], [-28, -10], [-24, 40]]), 14, '#4a4c52', { op: 0.6 }); f.stroke(cuF([[30, -46], [40, -6], [36, 44]]), 10, '#5a5c62', { op: 0.45 }); // dark reflections in polished silver
    f.line(cuF([[-44, -26], [-54, 8], [-50, 40]]), 5, '#ffffff', { op: 0.9 }); f.line(cuF([[8, -40], [12, 20]]), 3, '#f4f6f8', { op: 0.7 });
    for (let i = 0; i < 3; i++) f.flat(cuF(ell([-24 + i * 26, -20 + (i % 2) * 22], 7, 4, 0, 8)), Q.silverD, { op: 0.5 }); // dents
    f.stroke([cuF([[56, 50]])[0], cuF([[62, 10]])[0], add(c, [36, -10]), add(c, [40, 50]), add(W0, [10, 60])], 6, '#5a1a2a', { op: 0.7 }); // wine running down the cup, over the fist and down the wrist
    g.F = X.knuckleFist(f, c, g.ang, s, '#f0d0c6', { flip: g.flip, tex: 'pruned' + seed, texOp: 0.6, fat: true, shadow: skinS });
    RING(g.F([[0.62, -0.12]])[0], g.ang, 22); RING(g.F([[0.6, 0.16]])[0], g.ang, 20); }

  // ======== the DOWAGER: gaunt, her face turned up to the patriarch mid-sentence, her legs over the pool's lip
  f.bone('dowager');
  const dsk = '#eedad2';
  // her thighs on the coping and the shins hanging down its face, the swollen feet against the frieze
  { const Hp = dS.at(0.2, 1.0), Kn = [540, 1150], An = [560, 1380];
    f.part(T.mchain([Hp, Kn, An], [[[[0, 70], [0.4, 74], [1, 56]], [[0, 70], [0.5, 66], [1, 54]]], [[[0, 50], [0.3, 48], [0.8, 34], [1, 36]], [[0, 50], [0.25, 54], [0.6, 42], [1, 36]]]], { knob: [1.3] }), SK({ fill: mix(dsk, skinS, 0.12) }));
    f.flat(ell(add(Kn, [8, -14]), 30, 20, 0.4, 10), '#fff8f2', { op: 0.3 }); f.line(ell(add(Kn, [8, -10]), 32, 24, 0.4, 10).slice(5, 10), 1.4, '#7a3440', { op: 0.5 }); // the bony knee
    X.peel(f, lp(Kn, An, 0.35, 30), 22, 70, { sway: 2 }); T.wrinkles(f, lp(Kn, An, 0.6), An, 60, 4);
    B.bareFoot(f, An, 1, 92, mix(dsk, skinS, 0.12), { swell: 1, shadow: skinS, tex: 'mottle' + seed, groundY: An[1] + 70 });
    f.part([add(An, [-40, 70]), add(An, [110, 66]), add(An, [112, 86]), add(An, [-42, 90])], { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.4 }); f.stroke([add(An, [0, 66]), add(An, [40, 20]), add(An, [80, 62])], 8, P.leather); } // the clog still on her foot
  X.bfTorso(f, dS, 'gaunt', SK({ fill: dsk }));
  X.peel(f, dS.at(0.5, 0.62), 34, 84, { sway: 2 });
  X.bathSheet(f, [dS.at(0.3, 0.24), dS.at(-0.12, -0.05), dS.at(-0.62, 0.06), dS.at(-0.84, 0.42), dS.at(-0.78, 0.86)], [44, 70, 86, 80, 70], { badge: 'tower', col: '#4a4a6a', fill: '#e2dccf', bend: 1, at: 3 });
  // the neck: long and stringy, the cords standing, the pearl collar sunk into it
  const dHF = frame(dHC, dA, DH);
  { const nb = dS.at(0.1, 0.0), nt = dHF([[-0.12, 0.38]])[0];
    f.part(K.chain([nb, nt], [DH * 0.62, DH * 0.46]), SK({ fill: dsk }));
    f.line([lerp(nb, nt, 0.0), lerp(add(nb, [30, 0]), add(nt, [24, 4]), 0.5), add(nt, [30, 10])], 2, '#7a3440', { op: 0.6 }); // the cord from ear to breastbone
    f.line([add(nb, [-10, -6]), add(lerp(nb, nt, 0.5), [6, -4]), add(nt, [10, 0])], 1.6, skinL, { op: 0.5 });
    for (let i = 0; i < 4; i++) f.line([add(lerp(nb, nt, 0.3 + i * 0.12), [-30, 0]), add(lerp(nb, nt, 0.32 + i * 0.12), [30, 4])], 1, '#7a3440', { op: 0.4 }); // creped skin across the throat
    for (let k = 0; k < 3; k++) { const y0 = 0.3 + k * 0.14; const a = add(lerp(nb, nt, y0), [-DH * 0.24, 4]), b = add(lerp(nb, nt, y0), [DH * 0.26, -4]); f.stroke([a, add(lerp(a, b, 0.5), [0, 8]), b], 3, '#7a3440', { op: 0.6 }); X.pearls(f, [a, add(lerp(a, b, 0.5), [0, 6]), b], 6.5); } } // three strands sunk in
  X.bfHead(f, dHC, DH, dA, 'dowager', { skin: dsk, hair: '#5a4034' });
  X.fuse(f, [520, 760], 90, 50, 0.6); // where her shoulder has run into the patriarch's belly
  // her fan arm: fanning him with the stalk of her lady's feather fan, wilted bare; signet rings on bony fingers
  f.bone('arm_7'); f.joint('arm_7', dS.at(0.22, 0.1), 'dowager');
  { const S0 = dS.at(0.22, 0.1), E0 = [420, 884], W0 = [560, 820];
    const A = X.fleshArm(f, S0, E0, W0, [72, 60, 42], SK({ fill: dsk }), { build: 'gaunt', occ: true, deltoid: true, peel: true });
    const c = add(W0, mul(A.dF, 28));
    const g = B.gripAngle(c, E0, -Math.PI / 2 + 0.12, { name: 'arm_7 fan' });
    const ax = [Math.cos(g.axis), Math.sin(g.axis)], st = [add(c, mul(ax, -40)), add(c, mul(ax, 120)), add(add(c, mul(ax, 240)), [20, 0]), add(add(c, mul(ax, 330)), [50, 10])];
    f.stroke(st, 17, INK); f.stroke(st, 13, '#d8c8a8'); f.line(st.map(q => add(q, [-3, 0])), 2, '#fff', { op: 0.6 }); for (let i = 1; i < 6; i++) { const q = lerp(st[1], st[3], i / 6); f.line([add(q, [-6, -2]), add(q, [6, 2])], 1.4, '#8a7a60'); } // the ivory stalk, carved
    for (let i = 0; i < 9; i++) { const q = lerp(st[1], st[3], 0.25 + i * 0.09), sg = i % 2 ? 1 : -1, qs = [q, add(q, [sg * (16 + i * 3), 14 + i]), add(q, [sg * (22 + i * 3), 44 + i * 4]), add(q, [sg * (16 + i * 2), 74 + i * 5])]; f.stroke(qs, 6, INK, { op: 0.8 }); f.stroke(qs, 4, i % 2 ? '#c8c0b0' : '#b0a898'); for (let j = 1; j < 3; j++) { const b0 = lerp(qs[j], qs[j + 1], 0.5); f.line([b0, add(b0, [sg * 8, 6])], 1.2, '#8a8070', { op: 0.8 }); } } // the feathers wilted to bare drooping quills, a few wet barbs left // the feathers, wilted to bare drooping quills
    g.F = X.knuckleFist(f, c, g.ang, 50, dsk, { flip: g.flip, tex: 'pruned' + seed, texOp: 0.5, shadow: skinS });
    RING(g.F([[0.6, -0.12]])[0], g.ang, 12); RING(g.F([[0.58, 0.44]])[0], g.ang, 10); }

  // ======== the MATRON, dozing against the patriarch's side; her pearls sunk in her neck
  f.bone('matron');
  const msk = '#f0d2c6';
  X.bfTorso(f, mS, 'soft', SK({ fill: msk }));
  { const mHF = frame(mHC, mA, MH), nb = mS.at(0.1, 0.0), nt = mHF([[-0.1, 0.38]])[0];
    f.part(K.chain([nb, nt], [MH * 0.86, MH * 0.7]), SK({ fill: msk }));
    X.pearls(f, [add(nb, [-MH * 0.34, -14]), add(lerp(nb, nt, 0.2), [0, 14]), add(nt, [MH * 0.3, 10])], 7);
    X.bfHead(f, mHC, MH, mA, 'matron', { skin: msk, hair: '#3a2a24' });
    X.bathSheet(f, [mS.at(0.24, 0.24), mS.at(-0.24, -0.05), mS.at(-0.76, 0.1), mS.at(-0.92, 0.5)], [56, 82, 92, 82], { badge: 'fish', col: '#3a5a6a', bend: 1, at: 2 }); }
  X.fuse(f, [930, 700], 60, 90, 1.2); // her cheek and shoulder run into his belly

  // ======== the towel boy's arm, caught in the mass under the patriarch, still holding out a folded towel
  f.bone('towel');
  { const S0 = [700, 1120], E0 = [790, 1060], W0 = [880, 1084];
    X.fleshArm(f, S0, E0, W0, [52, 46, 36], SK({ fill: '#ecd0c4' }), { build: 'gaunt', peel: false });
    const tw = [930, 1050];
    for (let i = 0; i < 3; i++) f.part([add(tw, [-66, -i * 11]), add(tw, [56, -6 - i * 11]), add(tw, [58, -19 - i * 11]), add(tw, [-64, -13 - i * 11])], T.LIN(f, { fill: mix('#d8d0c4', '#fff', i * 0.1), maxShade: 6, inkW: 1.2 }));
    f.stitches([add(tw, [-56, -28]), add(tw, [48, -34])], P.linenD, 1);
    f.part([add(tw, [-66, -20]), add(tw, [-76, 46]), add(tw, [-68, 80]), add(tw, [-50, 46]), add(tw, [-50, -14])], T.LIN(f, { fill: '#d0c8bc', maxShade: 6 }));
    f.flat(ell(add(tw, [0, -26]), 20, 5, 0, 10), P.raw, { op: 0.45 });
    T.handBack(f, add(W0, [36, 0]), 0.1, 30, '#ecd0c4', { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.15, spread: 0.1, lean: true }); }

  // ======== the HEIR: poured over the lip, sprawled forward onto the floor, dozing, hauling the heap on his arms
  f.bone('front');
  const hsk = '#f4d4ca';
  // his far arm (behind the body), reaching out over the floor for the front rank, an empty lapdog's collar on the wrist
  f.bone('arm_2'); f.joint('arm_2', hS.at(-0.2, 0.1), 'front');
  { const S0 = hS.at(-0.2, 0.1), E0 = [1290, 1090], W0 = [1460, 1170];
    const A = X.fleshArm(f, S0, E0, W0, [104, 86, 64], SK({ fill: mix(hsk, skinS, 0.08) }), { build: 'soft', occ: true });
    const hb = T.handBack(f, add(W0, mul(A.dF, 46)), Math.atan2(A.dF[1], A.dF[0]) + 0.25, 54, mix(hsk, skinS, 0.08), { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.7, spread: 0.3, fat: 1.15 });
    RING(lerp(hb.fingers[1], hb.tips[1], 0.3), Math.atan2(A.dF[1], A.dF[0]), 13);
    const cw = lerp(E0, W0, 0.84); const e = ell(add(cw, [0, 34]), 46, 18, 0.5, 14); f.line(e.concat([e[0]]), 11, INK); f.line(e.concat([e[0]]), 8, '#5a2a3e'); f.stitches(e, '#c8b8a0', 1);
    const bl = add(cw, [20, 66]); f.line([add(cw, [16, 48]), bl], 2, Q.silverD); f.part([add(bl, [-9, 0]), add(bl, [9, 0]), add(bl, [12, 18]), add(bl, [-12, 18])], { fill: Q.silver, shadow: Q.silverD, shade: 0.4, inkW: 1, cast: false }); f.flat(ell(add(bl, [0, 18]), 4, 2, 0, 6), INK); } // the empty lapdog collar and its bell
  f.bone('front');
  // his thigh and hip, back over the lip of the pool into the mass
  { const th = [hS.at(-0.5, 0.9), hS.at(0.5, 1.02), [780, 1260], [640, 1180], [620, 1110], [740, 1130]]; f.part(T.lumpy(f, th, 4), SK({ fill: mix(hsk, skinS, 0.1) })); f.stroke([[860, 1236], [760, 1196], [680, 1160]], 3.4, '#7a3440'); f.line([[870, 1200], [760, 1160]], 2, skinL, { op: 0.4 }); X.peel(f, [780, 1220], 24, 60, { sway: 2 }); }
  const ht = X.bfTorso(f, hS, 'soft', SK({ fill: hsk }));
  X.peel(f, hS.at(0.86, 0.5), 42, 100, { sway: 3 });
  X.fuse(f, hS.at(-0.6, 0.0), 80, 50, 0.4); // where his back has run into the matron
  { const hHF = frame(hHC, hA0, HH), nb = hS.at(0.15, 0.0), nt = hHF([[-0.14, 0.36]])[0];
    f.part(K.chain([nb, nt], [HH * 0.9, HH * 0.72]), SK({ fill: hsk }));
    f.stroke([add(nb, [20, -10]), lerp(nb, nt, 0.5), add(nt, [30, 10])], 3, '#7a3440', { op: 0.5 });
    X.bfHead(f, hHC, HH, hA0, 'heir', { skin: hsk, hair: '#6a5040' }); }
  // the slab of marble coping baked into his underside, flesh run onto it
  { const mr = [[900, 1440], [1200, 1424], [1210, 1490], [910, 1508]]; f.part(mr.map(q => [...q, 1]), T.MAR(f, { inkW: 1.8, maxShade: 10 })); f.line([[900, 1440], [1200, 1424]], 2.4, '#fff8f4', { op: 0.7 }); X.fuse(f, [1050, 1430], 160, 26, 0); }
  // his near arm hauling: the hand flat on the tiles, fingers spread and pressing, the arm taking his weight
  f.bone('arm_1'); f.joint('arm_1', hS.at(0.2, 0.2), 'front');
  { const S0 = hS.at(0.2, 0.2), E0 = [1340, 1210], W0 = [1380, 1424];
    const A = X.fleshArm(f, S0, E0, W0, [112, 92, 70], SK({ fill: hsk }), { build: 'soft', occ: true, deltoid: true, peel: true });
    const hb = T.handBack(f, [1450, 1488], 0.15, 60, hsk, { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.25, spread: 0.5, fat: 1.2 });
    RING(lerp(hb.fingers[2], hb.tips[2], 0.3), 0.15, 14); f.flat(ell([1470, 1530], 90, 8, 0, 12), INK, { op: 0.3 }); }

  // ======== the matron's hand patting the heir's back
  f.bone('arm_9'); f.joint('arm_9', mS.at(0.5, 0.12), 'matron');
  { const S0 = mS.at(0.5, 0.12), E0 = [1130, 860], W0 = [1110, 960];
    const A = X.fleshArm(f, S0, E0, W0, [96, 80, 60], SK({ fill: msk }), { build: 'fat', occ: true, deltoid: true });
    const hb = T.handBack(f, add(W0, mul(A.dF, 40)), Math.atan2(A.dF[1], A.dF[0]) - 0.5, 50, msk, { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.6, spread: 0.2, fat: 1.25 });
    RING(lerp(hb.fingers[2], hb.tips[2], 0.3), Math.atan2(A.dF[1], A.dF[0]) - 0.5, 13); }

  // ======== the floor and what lies on it: arms hauling, a hand on the rim, a hand gripping the lip; clogs, cushion, flask
  f.bone('front');
  for (const [x, y, a] of [[760, 1534, -0.2], [1250, 1550, 0.15]]) { const F2 = frame([x, y], a, 1); f.part(F2([[-50, -10], [46, -14], [54, 12], [-52, 14]]), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 1.4 }); f.stroke(F2([[-20, -12], [0, -30], [20, -14]]), 5, P.leather); X.fuse(f, [x, y - 20], 50, 14, a); } // bath clogs embedded in the base
  { const cu = [790, 1470], cp = [add(cu, [-80, 10]), add(cu, [-60, -40]), add(cu, [40, -50]), add(cu, [90, -10]), add(cu, [70, 40]), add(cu, [-50, 44])]; f.part(T.lumpy(f, cp, 8), { fill: Q.velvet, shadow: Q.velvetD, shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 20 }); f.part(ell(add(cu, [-70, -30]), 10, 10, 0, 8), { fill: '#c8a870', shade: 0.3, inkW: 1, cast: false }); f.stroke([add(cu, [-40, -10]), add(cu, [40, 0])], 2.4, Q.velvetD); X.clothWear(f, cp, [710, 1420, 880, 1514], 3); } // the soaked cushion
  { const ofl = [610, 1500]; f.part([add(ofl, [-30, 20]), add(ofl, [-34, -10]), add(ofl, [-14, -34]), add(ofl, [14, -34]), add(ofl, [34, -10]), add(ofl, [30, 20])], { fill: '#8a6a52', shadow: '#2a1a10', shade: 0.42, inkW: 1.4 }); f.part([add(ofl, [-10, -50]), add(ofl, [10, -50]), add(ofl, [10, -32]), add(ofl, [-10, -32])], { fill: '#6a4a3a', shade: 0.4, inkW: 1.1, cast: false, sharp: true }); f.line([add(ofl, [-20, -24]), add(ofl, [-6, 0]), add(ofl, [-16, 18])], 2, INK); f.stroke([add(ofl, [-6, 20]), add(ofl, [-4, 50]), add(ofl, [4, 64])], 6, '#e0c880', { op: 0.6 }); } // the cracked oil flask
  // another arm from under the heir, its hand clawing at the tiles
  f.bone('arm_3'); f.joint('arm_3', [1120, 1300], 'front');
  { const S0 = [1120, 1300], E0 = [1220, 1400], W0 = [1300, 1470];
    X.fleshArm(f, S0, E0, W0, [96, 80, 62], SK({ fill: mix(skin, skinS, 0.06) }), { build: 'fat' });
    const hb = T.handBack(f, [1336, 1510], 0.5, 52, mix(skin, skinS, 0.06), { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.8, spread: 0.4, fat: 1.2 }); RING(lerp(hb.fingers[1], hb.tips[1], 0.3), 0.5, 12); }
  // a hand gripping the pool's lip
  f.bone('arm_6'); f.joint('arm_6', [800, 1250], 'front');
  { const S0 = [800, 1250], E0 = [720, 1290], W0 = [660, 1250];
    X.fleshArm(f, S0, E0, W0, [76, 64, 52], SK({ fill: mix(skin, skinS, 0.05) }), { build: 'soft', peel: false });
    const hb = T.handBack(f, [630, 1222], -2.4, 44, mix(skin, skinS, 0.05), { shadow: skinS, tex: 'pruned' + seed, texOp: 0.6, curl: 0.95, spread: 0.1, fat: 1.2, flip: true }); RING(lerp(hb.fingers[2], hb.tips[2], 0.3), -2.4, 11); }

  // the steam rising off the whole heap
  f.bone('heap');
  for (const [x, y, hh] of [[620, 130, 220], [960, 560, 220], [380, 620, 200], [1250, 840, 180], [180, 230, 160]]) T.wisp(f, [x, y], hh, { w: 14, op: 0.3, drift: T.R(f, -30, 30) });
  f.bone('root');
  f.flat(ell([1000, gy + 6], 640, 16, 0, 20), '#2a1e1e', { op: 0.4 });
  return f;
}

module.exports = {
  heroes: [
    { key: 'best_families', name: 'The Best Families', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: bestFamilies },
    { key: 'great_copper', name: 'The Great Copper', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: greatCopper },
    { key: 'strigil_master', name: 'The Strigil-Master', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: strigilMaster },
    { key: 'invalid_countess', name: 'The Invalid Countess', tier: 'elite', w: 1700, h: TIERS.elite[1], flip: true, build: invalidCountess }, // widened at the elite scale (guide 2): the bible's 2.5 length
    { key: 'hypocaust_stoker', name: 'Hypocaust Stoker', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: hypocaustStoker },
    { key: 'votive_pilgrim', name: 'Votive Pilgrim', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: votivePilgrim },
    { key: 'physic_of_the_waters', name: 'Physic of the Waters', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: physicOfTheWaters },
    { key: 'lustral_priest', name: 'Lustral Priest', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: lustralPriest },
    { key: 'lapdog', name: 'Lapdog', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: lapdog },
    { key: 'hypocaust_roaches', name: 'Hypocaust Roaches', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: hypocaustRoaches },
    { key: 'pump_mule', name: 'Pump Mule', tier: 'large', w: 2000, h: 1100, flip: true, build: pumpMule }, // widened at the large tier's scale (guide 2): the beam's splintered end shows
  ],
};
