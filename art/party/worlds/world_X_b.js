// World X, The Venom Spires (Lightning + Toxin, Neurotoxin), second batch "b": the eleven entries added to the bible.
// A plain of travellers' roads; lightning struck it and the insects built towers to catch the lightning. Lightning
// (dominant) marks chitin and flesh with branching white-violet burns, fuses metal into flesh and stands hair on end;
// toxin swells, paralyses and hollows. The cast are the hive's insects and the travellers it has taken.
// Palette: chitin black, venom green, white-violet strikes, plus ink black, bone and grey (dust grey road cloth, worn
// wood, earth and clay where the bible names them; dull gilt only on the saint's halo, which is holy).
// No arcs or bolts on any figure: strikes are engine effects. No eye motifs: insects' eyes are dull faceted masses.
// Foes face left: every figure is drawn facing right with kit.foeBase (light from the upper right) and flipped.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
// Seeds 1020..1030 in bible order (The Procession, The Cicada Under the Road, The Courier, Road Centipede, The Dowser,
// Struck Shepherd, Highwayman, The Tinker, Road-Warden, Spire Termites, Antlion).
'use strict';
const K = require('../kit');
const X = require('./kit_X_b');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, ang, elb, dir } = X;
const D = 180 / Math.PI;
const R = (f, a, b) => a + (b - a) * f.r();

// ------------------------------------------------------------------ THE DOWSER (cast, human 1.0)
// A travelling water-diviner, bent forward after his forked hazel rod: both elbows tucked to the ribs, the fists palm-up
// round the fork's two arms, the point jutting level ahead and dipping, the head dragged down after it. Weight on the
// front foot. The strike came down the raised tip: the copper ferrule a scorched bead, the hazel split along the grain,
// its arms burned into his palms; ferns run from both wrists up the arms, meet across the chest and branch to the belt;
// hair and beard stand out stiff. Venom hollowed him (sunk cheeks and belly, tight shiny skin), hard green welts at the
// stings on the neck and wrists, the neck locked in a spasm, the jaw clenched.
// Rig: standard humanoid + rod (hand_n) + bob (hand_n) + skirt (pelvis). Motion: the rod dips (rod, forearms); attack
// the rod snaps down to point at a hero (both arms drop with it: the far hand needs IK on the fork).
function dowser() {
  const seed = 1024, h = TIERS.human[1];
  const f = new Fig(X.base(seed, h, { grimeY: 560 }));
  X.texturesX(f);
  const H = 96, gy = f.o.groundY, sd = seed;
  const skin = mix(P.skin, '#9a7a5a', 0.32), SKN = (o = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: '#3e3036' }, o));
  const COAT = (o = {}) => X.CLK(f, Object.assign({ fill: P.dust, shadow: '#26221e', light: P.dustL, tex: 'weave' + sd, texOp: 0.5 }, o));
  const LEG = (o = {}) => X.CLK(f, Object.assign({ fill: '#5a5246', shadow: '#1e1a16', tex: 'weave' + sd, texOp: 0.5 }, o));
  const HZ = (o = {}) => Object.assign({ fill: P.hazel, shadow: P.hazelD, light: P.hazelL, shade: 0.42, tex: 'wood' + sd, texOp: 0.5, inkW: 1.3, inkHeavy: 2 }, o);
  const Pv = [250, 474], N0 = [338, 300];
  const S = B.spine(N0, [282, 352], Pv, H);
  const HC = [386, 258], hA = 0.55;
  const SN = [328, 322], EN = [324, 410], WN = [420, 432];
  const SF = [350, 312], EF = [348, 402], WF = [434, 420];
  const HN = [262, 480], KN = [330, 604], AN = [316, 742];
  const HF = [236, 474], KF = [220, 608], AF = [172, 740];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const V = [492, 420], tip = [580, 440];
  f.joint('rod', WN, 'hand_n').joint('bob', add(WN, [-2, 10]), 'hand_n').joint('skirt', [252, 478], 'pelvis');

  // ---- coat skirt, back panel: long homespun, the hem scorched and frayed stiff into split points
  f.bone('skirt');
  const hem = (x0, x1, y0, y1, n) => X.hemLine(f, [x0, y0], [x1, y1], n, 12);
  const SKB = [[214, 470], [276, 468], [300, 520], [304, 600], ...hem(300, 160, 668, 650, 12).slice(1), [168, 580], [192, 510]];
  f.part(SKB, COAT({ fill: mix(P.dust, '#000', 0.2) }));
  X.clipDraw(f, SKB, () => { for (const [a, b] of [[[226, 500], [190, 640]], [[256, 500], [240, 650]], [[284, 520], [290, 650]]]) f.stroke([a, lerp(a, b, 0.5), b], 3, '#221e1a', { op: 0.55 }); f.flat([[150, 620], [320, 620], [320, 700], [150, 700]], '#14110f', { op: 0.45 }); });
  X.wear(f, SKB, 5); X.hemThreads(f, SKB.slice(4, 14), '#3a362e', 5);
  for (let i = 0; i < 4; i++) X.scorch(f, [180 + i * 32, 650 - i * 4], 16, 9, 0.5);

  // ---- far leg: legging and a road shoe
  X.mLeg(f, HF, KF, AF, [70, 52, 34], LEG({ fill: '#4e473e' }), { sfx: '_f', bare: false, build: 'lean' });
  f.bone('shin_f'); for (let i = 0; i < 5; i++) f.line([lp(KF, AF, 0.42 + i * 0.1, -17), lp(KF, AF, 0.48 + i * 0.1, 15)], 1.6, '#221e1a', { op: 0.6 });
  X.bootRig(f, KF, AF, 50, '#3a3028', '_f', { tex: 'mottle' + sd, shaft: 0.36, toe: 1.12 });

  // ---- far arm: sleeve to mid-forearm, then the burnt bare wrist; the fist round the far arm of the fork
  const sleeveF = X.mArm(f, SF, EF, WF, [44, 38, 28], COAT({ fill: mix(P.dust, '#000', 0.18), shade: 0.26 }), { sfx: '_f', bare: false });
  f.bone('forearm_f');
  const bwF = X.mArm(f, lerp(EF, WF, 0.45), lerp(EF, WF, 0.7), WF, [30, 28, 24], SKN({ fill: mix(skin, '#000', 0.1) }), { build: 'lean' });
  X.fern(f, bwF.pts, add(WF, [-6, 2]), Math.PI + 0.1, 70, 1.6, { depth: 2 });
  f.bone('rod');
  const armF = [WF, lerp(WF, V, 0.5), V];
  f.part(X.ribbon(X.spline([add(WF, [-18, 4]), ...armF]), t => 13 - t * 3), HZ({ fill: mix(P.hazel, '#000', 0.15) }));
  f.bone('hand_f');
  X.gripK(f, WF, EF, ang(WF, V), 22, mix(skin, '#000', 0.12), { inline: true, tex: 'mottle' + sd, shadow: '#3e3036', name: 'dowser far' });
  X.scorch(f, add(WF, [6, -2]), 10, 7, 0.5);

  // ---- torso: a long homespun coat over a hollowed body, open at the throat; the cord belt; the fern across the chest
  f.bone('torso');
  const TOR = S.shape([[0, 0.34, 0.28], [0.1, 0.64, 0.44], [0.3, 0.7, 0.5], [0.55, 0.58, 0.42], [0.8, 0.54, 0.44], [1.04, 0.58, 0.52]]);
  f.part(TOR, COAT());
  X.wear(f, TOR, 6, { hem: false });
  X.clipDraw(f, TOR, () => {
    f.line([S.at(-0.2, 0.02), S.at(-0.3, 0.5), S.at(-0.2, 1.0)], 1.2, '#1a1714', { op: 0.5 }); f.stitches([S.at(-0.24, 0.04), S.at(-0.34, 0.5), S.at(-0.24, 1.0)], '#a8a090', 0.8); // the side seam, darned
    for (const v of [0.2, 0.45, 0.7]) f.stroke([S.at(-0.5, v), S.at(-0.1, v + 0.06), S.at(0.3, v + 0.02)], 2.4, '#26221c', { op: 0.5 }); // folds dragged by the bend
    f.stroke([S.at(-0.66, 0.08), S.at(-0.7, 0.4), S.at(-0.6, 0.8)], 3, mix(P.dust, '#fff', 0.3), { op: 0.35 }); // the lit hump of the back
    f.flat([S.at(-1, 0.85), S.at(1, 0.85), S.at(1, 1.2), S.at(-1, 1.2)], '#14110f', { op: 0.3 });
    // the bare chest in the coat's open throat: tight shiny skin over the ribs, the fern meeting there
    const V0 = [S.at(0.42, 0.02), S.at(0.5, 0.14), S.at(0.38, 0.4), S.at(0.16, 0.16), S.at(0.12, 0.02)];
    f.part(V0, SKN({ cast: false, inkW: 1.2 }));
    for (let i = 0; i < 3; i++) f.line([S.at(0.2, 0.14 + i * 0.07), S.at(0.42, 0.12 + i * 0.07)], 1.1, '#3e3036', { op: 0.6 });
    X.fern(f, V0, S.at(0.36, 0.12), 2.2, 60, 1.6, { depth: 2 });
    X.fern(f, TOR, S.at(0.36, 0.34), 1.7, 110, 2, { cloth: true, depth: 2 }); // branching down the coat to the belt
  });
  // the coat's front edge and lapel
  f.line([S.at(0.38, 0.38), S.at(0.46, 0.6), S.at(0.5, 0.95)], 2, '#1e1a16', { op: 0.7 });
  f.part([S.at(0.12, 0.0), S.at(0.3, 0.02), S.at(0.38, 0.38), S.at(0.24, 0.3)], COAT({ fill: mix(P.dust, '#000', 0.1), cast: false, inkW: 1.2 }));
  // cord belt knotted, ends hanging plumb
  f.bone('pelvis');
  const bl = [S.at(-0.62, 0.9), S.at(-0.1, 0.94), S.at(0.5, 0.9)];
  X.rope(f, bl, 6, { col: '#7a6a4c' });
  X.rope(f, [S.at(0.36, 0.92), add(S.at(0.36, 0.92), [6, 30]), add(S.at(0.36, 0.92), [2, 56])], 4, { col: '#7a6a4c', fray: true });
  // gear at the belt, back to front: two spare forks tied at the hip, the knotted cord coiled, the dry bottle, trowel,
  // the tally board, the purse
  const hip = S.at(-0.45, 0.95);
  for (const [dx, a] of [[0, 1.85], [10, 1.72]]) { const a0 = add(hip, [dx - 20, -30]), b0 = add(a0, rot([118, 0], a)); f.part(X.ribbon([a0, lerp(a0, b0, 0.6)], t => 9 - t * 2), HZ()); for (const s of [-1, 1]) f.part(X.ribbon([lerp(a0, b0, 0.58), add(lerp(a0, b0, 0.58), rot([56, 0], a + s * 0.28))], t => 7 - t * 2), HZ()); }
  f.line([add(hip, [-24, 2]), add(hip, [18, -2])], 4, '#6e5e40');
  X.ropeCoil(f, add(hip, [16, 24]), 22, 12, 4, 3, { col: '#8a7a5a' });
  for (let i = 0; i < 4; i++) f.flat(ell(add(hip, [-2 + i * 10, 30 + (i % 2) * 6]), 3.2, 3.2, 0, 6), '#4a3e2a'); // the knots
  const bt = S.at(0.1, 1.02);
  f.line([S.at(0.06, 0.92), add(bt, [0, 6])], 2, '#5a4a30');
  f.part([add(bt, [-16, 8]), add(bt, [16, 6]), add(bt, [20, 30]), add(bt, [16, 58]), add(bt, [-14, 60]), add(bt, [-20, 32])], Object.assign({}, X.CLK(f, { fill: '#6a5638', shadow: '#2a2014', light: '#9a8058', tex: 'wood' + sd, texOp: 0.5 })));
  for (const y of [18, 46]) f.line([add(bt, [-18, y]), add(bt, [18, y])], 2.2, '#3a2a18'); // the hoops
  f.part(ell(add(bt, [0, 5]), 6, 4, 0, 8), { fill: '#2a2014', shade: 0.3, inkW: 1, cast: false });
  X.miniWasp(f, add(bt, [4, -4]), -1.2, 0.5); X.miniWasp(f, add(bt, [-12, 18]), 2.4, 0.45, { wings: false });
  const tb = S.at(0.48, 1.0);
  f.part([add(tb, [0, 0]), add(tb, [12, 2]), add(tb, [10, 62]), add(tb, [-2, 60])].map(q => [...q, 1]), HZ({ fill: '#6a5840', cast: false }));
  for (let i = 0; i < 9; i++) { const q = add(tb, [i % 2 ? 9 : 0, 6 + i * 6]); f.flat([q, add(q, [5, -1]), add(q, [5, 2]), add(q, [0, 3])], '#120e0c'); } // notches, burned through
  X.scorch(f, add(tb, [6, 30]), 7, 20, 0.5);
  f.part([add(S.at(-0.2, 1.0), [0, 4]), add(S.at(-0.2, 1.0), [22, 6]), add(S.at(-0.2, 1.0), [20, 30]), add(S.at(-0.2, 1.0), [2, 32])], X.CLK(f, { fill: P.leath, shadow: P.leathD, tex: 'wrinkle' + sd })); // purse
  f.line([add(S.at(-0.2, 1.0), [4, 10]), add(S.at(-0.2, 1.0), [18, 11])], 1.4, P.leathD);
  // ---- near leg, carrying the weight, and the burst shoe
  X.mLeg(f, HN, KN, AN, [76, 56, 36], LEG(), { sfx: '_n', bare: false });
  f.bone('shin_n'); for (let i = 0; i < 5; i++) f.line([lp(KN, AN, 0.42 + i * 0.1, -18), lp(KN, AN, 0.48 + i * 0.1, 16)], 1.6, '#221e1a', { op: 0.6 });
  f.line([lp(KN, AN, 0.9, 16), lp(KN, AN, 0.95, 26), lp(KN, AN, 1.02, 28)], 2, '#5a5246'); // the wrap's loose end
  f.bone('foot_n');
  B.boot(f, AN, 1, 52, '#40342a', { tex: 'mottle' + sd, shaft: 0.36, toe: 1.12 });
  // the burst sole: split open at the toe where the strike left him, two toes out, scorched
  f.flat([[AN[0] + 34, gy - 12], [AN[0] + 66, gy - 16], [AN[0] + 64, gy - 4], [AN[0] + 36, gy - 4]], '#0c0a08');
  for (let i = 0; i < 2; i++) f.part(ell([AN[0] + 46 + i * 9, gy - 9], 5, 4, 0.2, 8), SKN({ fill: mix(skin, '#4a3a3a', 0.25), cast: false, inkW: 1 }));
  X.scorch(f, [AN[0] + 48, gy - 14], 18, 8, 0.45);
  X.clipDraw(f, [[AN[0] - 20, gy - 40], [AN[0] + 66, gy - 40], [AN[0] + 66, gy], [AN[0] - 20, gy]], () => X.burn(f, [AN[0] + 20, gy - 16], -0.1, 40, 1.2, { depth: 1 }));

  // ---- coat skirt, front panel over the near thigh
  f.bone('skirt');
  const SKF = [[254, 470], [322, 472], [342, 516], [366, 596], [378, 640], ...hem(376, 266, 652, 666, 8).slice(1), [262, 612], [252, 540]];
  f.part(SKF, COAT());
  X.clipDraw(f, SKF, () => {
    for (const [a, b, w] of [[[286, 486], [296, 660], 3.2], [[318, 492], [350, 650], 2.8], [[266, 500], [270, 640], 2]]) { f.stroke([a, add(lerp(a, b, 0.5), [4, 0]), b], w, '#1a1714', { op: 0.6 }); f.stroke([add(a, [6, 4]), add(lerp(a, b, 0.5), [10, 0]), add(b, [6, -10])], w * 0.7, P.dustL, { op: 0.35 }); }
    f.stroke([[300, 600], [330, 590], [362, 598]], 2.6, '#1a1714', { op: 0.5 }); // the knee pushing the cloth forward
    f.flat([[240, 630], [380, 630], [380, 700], [240, 700]], '#14110f', { op: 0.4 });
  });
  X.wear(f, SKF, 6); X.hemThreads(f, SKF.slice(5, 14), '#4a463c', 6);
  for (let i = 0; i < 3; i++) X.scorch(f, [282 + i * 30, 652], 14, 8, 0.5);
  const pt0 = [[318, 548], [338, 546], [342, 568], [330, 574], [318, 570]]; f.part(pt0, COAT({ fill: mix(P.dust, P.leath, 0.4), cast: false, inkW: 1 })); f.stitches([...pt0, pt0[0]], '#c8bca0', 0.8); // a patch

  // ---- head: neck in spasm, the long sun-cracked face dragged down after the rod, beard in a stiff fan
  f.bone('head');
  const nk = add(HC, rot([-10, 44], hA));
  f.part(limb(add(N0, [-6, 4]), nk, 46, 38, { steps: 5, q: [[0.4, 0.14, 0.25]] }), SKN());
  f.stroke([add(N0, [8, -4]), lerp(N0, nk, 0.5), add(nk, [6, 2])], 6, '#3e3036', { op: 0.45 }); // the corded neck muscle in spasm
  X.weal(f, lerp(N0, nk, 0.55), 5.5); X.weal(f, add(lerp(N0, nk, 0.3), [-12, 4]), 4);
  // hair standing out stiff behind and below the brim, matted grey-brown hanks
  const hF0 = frame(HC, hA, H);
  X.stiffHair(f, [[-0.36, -0.16], [-0.4, -0.04], [-0.38, 0.08], [-0.34, 0.18], [-0.3, 0.26]].map(q => hF0([q])[0]), 38, '#8a8274', { out: (p, i) => Math.PI + hA - 0.6 + i * 0.22, w: 5 });
  const hF = X.pHead(f, HC, H, hA, { skin, jaw: 0.96, chin: 0.03, nose: 1.1, hook: 0.25, rolled: true, clench: true, mouth: 'set', browDown: 0.04, age: true, gaunt: true, hairCol: '#5e5448', beard: false });
  // sun cracks and the sunk cheek; the skin tight and shiny over the cheekbone
  for (const q of [[[0.0, -0.3], [0.08, -0.26], [0.14, -0.3]], [[0.02, 0.06], [0.08, 0.12], [0.06, 0.2]], [[0.16, -0.2], [0.24, -0.24]]]) f.line(hF(q), 1, INK, { op: 0.5 });
  f.flat(hF([[0.02, 0.1], [0.18, 0.16], [0.2, 0.26], [0.06, 0.28], [-0.02, 0.2]]), '#2a1e22', { op: 0.35 });
  f.line(hF([[0.06, 0.02], [0.2, 0.05]]), 1.6, '#f0e6d6', { op: 0.5 });
  // the beard standing out in a stiff fan from the jaw, a dead wasp caught in it
  const bpts = [[0.38, 0.4], [0.36, 0.5], [0.28, 0.6], [0.16, 0.64], [0.04, 0.6], [-0.08, 0.5]].map(q => hF([q])[0]);
  f.part(hF([[-0.2, 0.2], [0.0, 0.3], [0.16, 0.33], [0.36, 0.33], [0.42, 0.5], [0.26, 0.66], [0.02, 0.6], [-0.18, 0.4]]), { fill: '#8a8274', shadow: '#4a463c', shade: 0.22, tex: 'hatch' + sd, texOp: 0.3, inkW: 1.3 });
  X.stiffHair(f, [...bpts, ...bpts.slice(1, 5).map(q => add(q, [-4, 3]))], 40, '#9a9282', { out: (p, i) => hA - 0.45 + (i % 6) * 0.36 + (i > 5 ? 0.18 : 0), w: 5.5, jit: 0.15 });
  X.miniWasp(f, hF([[0.12, 0.62]])[0], hA + 2.6, 0.55, { wings: false });
  f.part(hF([[0.17, 0.23], [0.25, 0.205], [0.33, 0.215], [0.35, 0.25], [0.31, 0.26], [0.24, 0.255], [0.17, 0.27]]), { fill: '#8a8274', shade: 0.4, inkW: 1 }); // moustache
  X.feltHat(f, hF, { col: P.felt, hole: [0.04, -0.66], front: 1.02, back: 0.92 });

  // ---- near arm: coat sleeve, the burnt bare forearm, the fist round the near arm of the fork, the rod jutting ahead
  X.mArm(f, SN, EN, WN, [48, 40, 30], COAT({ shade: 0.26 }), { sfx: '_n', bare: false });
  f.bone('forearm_n');
  const bw = X.mArm(f, lerp(EN, WN, 0.42), lerp(EN, WN, 0.7), WN, [34, 31, 26], SKN(), { build: 'lean' });
  X.fern(f, bw.pts, add(WN, [-8, 4]), Math.PI + 0.06, 80, 1.8, { depth: 3 });
  X.weal(f, lerp(EN, WN, 0.82), 5.5);
  f.part(K.ragLimb(f, lerp(EN, WN, 0.15), lerp(EN, WN, 0.5), 46, 42, { depth: 8, teeth: 5 }), COAT()); // the frayed cuff
  X.scorch(f, lerp(EN, WN, 0.46), 12, 18, 0.45);
  f.bone('rod');
  // the near arm of the fork, the vertex, and the point: worn smooth where the hands held it, split along the grain
  // near the tip, the copper ferrule fused into a scorched bead
  f.part(X.ribbon(X.spline([add(WN, [-20, 6]), lerp(WN, V, 0.5), V]), t => 14 - t * 3), HZ());
  f.part(X.ribbon(X.spline([add(V, [-6, 1]), lerp(V, tip, 0.5), tip]), t => 15 - t * 6), HZ());
  f.line([lerp(WN, V, 0.2), lerp(WN, V, 0.8)], 1.6, P.hazelL, { op: 0.6 }); // worn bright
  f.line([lerp(V, tip, 0.4), add(lerp(V, tip, 0.75), [0, 2]), add(lerp(V, tip, 0.95), [0, -1])], 1.6, INK); f.line([lerp(V, tip, 0.55), lerp(V, tip, 0.9)], 1, P.hazelL, { op: 0.6 }); // the split along the grain
  for (const t of [0.15, 0.32]) f.flat(ell(lerp(V, tip, t), 2.5, 1.6, 0.2, 6), P.hazelD, { op: 0.8 }); // bark knots
  X.scorch(f, lerp(V, tip, 0.85), 22, 9, 0.55, 0.2);
  f.part(X.lumpy(f, ell(add(tip, [4, 1]), 10, 9, 0, 12), 2), { fill: P.copperD, shadow: '#140c08', light: P.copperL, shade: 0.42, inkW: 1.3, inkHeavy: 2, cast: false, tex: 'pit' + sd, texOp: 0.6 });
  f.flat(ell(add(tip, [1, -3]), 4, 2.6, -0.3, 8), mix(P.copperL, P.vioL, 0.5), { op: 0.7 }); // the bead fused glassy at its lit top
  X.clipDraw(f, X.ribbon(X.spline([V, lerp(V, tip, 0.5), add(tip, [10, 0])]), t => 15 - t * 4), () => X.burn(f, add(tip, [-4, 0]), Math.PI + 0.12, 70, 1.6, { depth: 2 }));
  f.bone('hand_n');
  X.gripK(f, WN, EN, ang(WN, V), 23, skin, { inline: true, tex: 'mottle' + sd, shadow: '#3e3036', name: 'dowser near' });
  X.scorch(f, add(WN, [8, 0]), 10, 7, 0.5); X.weal(f, add(WN, [-18, -8]), 5);
  // the lead plumb bob on its cord looped round the wrist, swinging forward toward the spire (not plumb: the bible's pull)
  f.bone('bob');
  const lp0 = add(WN, [-12, 8]);
  f.line(ell(add(WN, [-14, 0]), 6, 16, 0.2, 10).concat([ell(add(WN, [-14, 0]), 6, 16, 0.2, 10)[0]]), 1.6, '#5a4a30');
  const bob = add(lp0, [40, 78]);
  f.line([lp0, lerp(lp0, bob, 0.5), bob], 1.4, '#5a4a30');
  f.part([add(bob, [-6, -2]), add(bob, [6, -4]), add(bob, [10, 10]), add(bob, [8, 22]), add(bob, [-2, 30]), add(bob, [-4, 14])], { fill: '#6a6a6e', shadow: '#26262a', light: '#a2a2a6', shade: 0.42, inkW: 1.2, inkHeavy: 1.6, tex: 'pit' + sd, texOp: 0.6 });

  f.bone('root');
  f.flat(ell([300, gy + 2], 200, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ STRUCK SHEPHERD (cast, human 1.0)
// A shepherd of the road verges: a dead lamb across his shoulders, the far hand holding its front legs bunched at his
// chest (the hind legs hang down his back), the crook held out in the near hand with its iron hook forward. Weight on the back leg. The strike came down the
// crook: the iron shank is fused into his palm (a scorched weld bead round the fist), and a fern spreads from the hand up
// the bare forearm and across the chest; his hair stands up in a stiff fan. The lamb is hollowed and full of larvae that
// move under the fleece, and where it lies on his neck the two have grown together, swollen and stiff.
// Rig: standard humanoid + crook (hand_n) + lamb (torso) + cape (torso). Motion: idle a slow nod while the lamb twitches
// (head, lamb); attack the crook hooks a hero and pulls (the near arm reaches and draws back: crook rides on hand_n).
function struckShepherd() {
  const seed = 1025, h = TIERS.human[1];
  const f = new Fig(X.base(seed, h, { grimeY: 580 }));
  X.texturesX(f);
  const H = 96, gy = f.o.groundY, sd = seed;
  const skin = mix(P.skin, '#8a6a50', 0.38), SKN = (o = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: '#3a2c30' }, o));
  const WOOL = (o = {}) => X.CLK(f, Object.assign({ fill: '#5a564e', shadow: '#1e1c18', light: '#8a8478', tex: 'knit' + sd, texOp: 0.45 }, o));
  const HIDE = (o = {}) => X.CLK(f, Object.assign({ fill: '#6a5642', shadow: '#241a12', light: '#9a8264', tex: 'wrinkle' + sd, texOp: 0.5 }, o));
  const FLC = (o = {}) => Object.assign({ fill: P.fleece, shadow: P.fleeceD, light: P.fleeceL, shade: 0.36, tex: 'mottle' + sd, texOp: 0.5 }, o);
  const Pv = [252, 476], N0 = [278, 298];
  const S = B.spine(N0, [262, 380], Pv, H);
  const HC = [292, 238], hA = -0.12;
  const SN = [262, 324], EN = [306, 418], WN = [384, 456];
  const SF = [296, 316], EF = [292, 424], WF = [326, 384];
  const HN = [270, 480], KN = [334, 612], AN = [354, 746];
  const HF = [240, 474], KF = [234, 620], AF = [226, 748];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const cu = E.norm([68, -80]), sock = WN, shankE = add(WN, mul(cu, 112)), butt = add(WN, mul(cu, -(790 - 4 - 456) / 0.762));
  f.joint('crook', WN, 'hand_n').joint('lamb', [262, 296], 'torso').joint('cape', [262, 310], 'torso');

  // ---- wool cloak hanging behind from the shoulder pin, a scorched hole where the strike left him, the hem frayed
  f.bone('cape');
  const CB = [[262, 300], [228, 310], [206, 360], [190, 470], [178, 560], ...X.hemLine(f, [170, 640], [292, 650], 9, 12), [300, 560], [296, 430], [290, 330]];
  f.part(CB, WOOL({ fill: '#46433d' }));
  X.clipDraw(f, CB, () => { for (const [a, b] of [[[222, 340], [196, 620]], [[250, 340], [240, 630]], [[278, 360], [282, 630]]]) f.stroke([a, lerp(a, b, 0.5), b], 3, '#16140f', { op: 0.55 }); });
  X.wear(f, CB, 5); X.hemThreads(f, CB.slice(5, 14), '#3a362e', 5);
  X.hole(f, [214, 520], 12, 16, 0.2, { lip: '#2a2018', bruise: '#14110e' }); X.scorch(f, [214, 520], 26, 30, 0.5); X.fern(f, CB, [214, 506], -1.5, 70, 1.4, { cloth: true, depth: 2 });

  // ---- far leg: the back leg, straight and carrying the weight; leg wraps; a boot burst at the seam
  X.mLeg(f, HF, KF, AF, [72, 54, 36], WOOL({ fill: '#4a463e' }), { sfx: '_f', bare: false });
  f.bone('shin_f'); for (let i = 0; i < 6; i++) f.line([lp(KF, AF, 0.3 + i * 0.1, -18), lp(KF, AF, 0.36 + i * 0.1, 16)], 1.8, '#1e1c18', { op: 0.65 });
  X.bootRig(f, KF, AF, 50, '#3e3226', '_f', { tex: 'mottle' + sd, shaft: 0.5, toe: 1.1 });
  f.bone('foot_f'); f.flat([[AF[0] + 10, gy - 30], [AF[0] + 22, gy - 34], [AF[0] + 26, gy - 18], [AF[0] + 14, gy - 16]], '#120e0a'); f.part(ell([AF[0] + 18, gy - 24], 5, 6, 0, 8), SKN({ cast: false, inkW: 1 }));

  // ---- far arm: rolled wool sleeve, the bare forearm up to the lamb's bunched legs
  X.mArm(f, SF, EF, WF, [42, 36, 26], WOOL({ fill: '#4e4a42', shade: 0.26 }), { sfx: '_f', bare: false });
  f.bone('forearm_f'); X.mArm(f, lerp(EF, WF, 0.3), lerp(EF, WF, 0.65), WF, [32, 30, 25], SKN({ fill: mix(skin, '#000', 0.12) }), { build: 'lean' });

  // ---- torso: a sheepskin jerkin (hide out, fleece showing at every edge) over a wool shirt; belt and its gear
  f.bone('torso');
  const SH = S.shape([[0, 0.36, 0.34], [0.12, 0.6, 0.52], [0.36, 0.6, 0.56], [0.6, 0.52, 0.5], [0.85, 0.54, 0.52], [1.04, 0.6, 0.56]]);
  f.part(SH, WOOL({ fill: '#5e5a50' }));
  const JK = S.shape([[0.02, 0.4, 0.06], [0.14, 0.62, 0.2], [0.4, 0.62, 0.36], [0.7, 0.56, 0.46], [0.95, 0.6, 0.54], [1.12, 0.64, 0.58]]);
  f.part(JK, HIDE());
  X.wear(f, JK, 6, { hem: false });
  X.clipDraw(f, JK, () => {
    for (const v of [0.3, 0.55, 0.8]) f.stroke([S.at(-0.5, v), S.at(0, v + 0.04), S.at(0.4, v)], 2.2, '#1e160e', { op: 0.5 });
    f.line([S.at(-0.1, 0.05), S.at(-0.2, 0.6), S.at(-0.1, 1.1)], 1.2, '#1e160e', { op: 0.5 }); f.stitches([S.at(-0.14, 0.05), S.at(-0.24, 0.6), S.at(-0.14, 1.1)], '#c8b48c', 0.9);
    X.fern(f, JK, S.at(0.3, 0.28), 2.6, 120, 2.2, { cloth: true, depth: 3 }); // the strike's fern scorched across the hide
  });
  // the fleece showing at the jerkin's front edge and hem: clumped, matted locks
  X.furMass(f, [S.at(0.02, 0.1), S.at(0.24, 0.16), S.at(0.38, 0.42), S.at(0.5, 0.74), S.at(0.6, 1.02), S.at(0.46, 1.04), S.at(0.38, 0.74), S.at(0.26, 0.42), S.at(0.1, 0.2)], FLC({ inkW: 1.2 }), { len: 9, flow: () => 1.5, edge: 10 });
  X.furMass(f, [S.at(-0.64, 1.06), S.at(0.0, 1.1), S.at(0.6, 1.08), S.at(0.6, 1.16), S.at(0.0, 1.2), S.at(-0.66, 1.16)], FLC({ inkW: 1.2 }), { len: 9, flow: () => 1.6, edge: 9 });
  // the bare throat and upper chest in the jerkin's V: the fern coming in from the arm, tight skin over the collarbone
  const VC = [S.at(0.06, -0.04), S.at(0.34, 0.0), S.at(0.3, 0.2), S.at(0.12, 0.26), S.at(0.02, 0.1)];
  f.part(VC, SKN({ cast: false, inkW: 1.1 }));
  X.fern(f, VC, S.at(0.3, 0.12), 2.9, 46, 1.6, { depth: 2 });
  f.line([S.at(0.08, 0.04), S.at(0.3, 0.05)], 1.2, '#3a2c30', { op: 0.6 });
  // belt, bellwether's bell (cracked by the strike), knife, sling and stone pouch, horn of salve, water bottle
  f.bone('pelvis');
  f.part([S.at(-0.62, 0.92), S.at(0.0, 0.96), S.at(0.6, 0.92), S.at(0.62, 1.0), S.at(0.0, 1.04), S.at(-0.62, 1.0)], HIDE({ fill: '#3a2c20', k: 0.5 }));
  f.part([S.at(0.2, 0.93), S.at(0.32, 0.93), S.at(0.32, 1.03), S.at(0.2, 1.03)].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  const bl = S.at(0.42, 1.02);
  f.line([bl, add(bl, [2, 14])], 3, '#2a2018');
  const BL = [add(bl, [-12, 14]), add(bl, [14, 12]), add(bl, [18, 30]), add(bl, [22, 46]), add(bl, [-20, 48]), add(bl, [-16, 30])];
  f.part(BL, X.IR(f, { fill: '#4a4844' }));
  f.flat(ell(add(bl, [0, 47]), 20, 5, 0, 12), '#0c0a0a'); f.part(ell(add(bl, [2, 52]), 5, 5, 0, 8), X.IR(f, { cast: false }));
  f.line([add(bl, [2, 16]), add(bl, [-2, 28]), add(bl, [4, 36]), add(bl, [0, 46])], 1.6, '#0a0808'); f.line([add(bl, [3, 16]), add(bl, [-1, 28])], 0.8, P.vioL, { op: 0.6 }); // the crack, its edge scorched
  f.line([add(bl, [-10, 20]), add(bl, [12, 18])], 1.2, P.ironL, { op: 0.6 });
  const kn = S.at(-0.3, 1.0);
  f.part([add(kn, [-5, 0]), add(kn, [5, 0]), add(kn, [7, 50]), add(kn, [0, 62]), add(kn, [-6, 48])], HIDE({ fill: '#2a2018', cast: false })); f.part([add(kn, [-6, -14]), add(kn, [6, -14]), add(kn, [5, 2]), add(kn, [-5, 2])], X.WD(f, { cast: false }));
  const pu = S.at(-0.56, 1.04);
  f.part([add(pu, [-14, 0]), add(pu, [12, 2]), add(pu, [16, 28]), add(pu, [2, 40]), add(pu, [-16, 30])], HIDE({ fill: '#5a4636' }));
  for (const q of [[-6, 6], [3, 8], [-2, 2]]) f.part(ell(add(pu, q), 4, 3, 0.3, 8), { fill: P.stone, shade: 0.4, inkW: 0.9, cast: false });
  X.rope(f, [add(pu, [10, 4]), add(pu, [24, 30]), add(pu, [20, 60]), add(pu, [12, 76])], 2.4, { col: '#8a7a5a', fray: true }); // the sling's cords
  f.part([add(pu, [18, 50]), add(pu, [30, 54]), add(pu, [28, 66]), add(pu, [16, 64])], HIDE({ fill: '#4a3a2a', cast: false }));
  const hn = S.at(-0.7, 0.78);
  f.part([add(hn, [0, 0]), add(hn, [12, -4]), add(hn, [10, 20]), add(hn, [-6, 50]), add(hn, [-14, 54]), add(hn, [-6, 22])], { fill: '#8a7c62', shadow: '#3a2e1e', light: '#c8b896', shade: 0.42, tex: 'growth' + sd, texOp: 0.6, inkW: 1.2 }); // horn of salve
  f.part(ell(add(hn, [6, -2]), 7, 4, 0.2, 8), X.WD(f, { cast: false }));

  // ---- near leg: forward, relaxed, its knee soft; leg wraps; the boot burst open at the side seam
  X.mLeg(f, HN, KN, AN, [76, 56, 38], WOOL(), { sfx: '_n', bare: false });
  f.bone('shin_n'); for (let i = 0; i < 6; i++) f.line([lp(KN, AN, 0.3 + i * 0.1, -19), lp(KN, AN, 0.36 + i * 0.1, 17)], 1.8, '#1e1c18', { op: 0.65 });
  f.line([lp(KN, AN, 0.34, 18), lp(KN, AN, 0.3, 30), lp(KN, AN, 0.36, 38)], 2.2, '#5a564e');
  X.bootRig(f, KN, AN, 52, '#463828', '_n', { tex: 'mottle' + sd, shaft: 0.5, toe: 1.12 });
  f.bone('foot_n');
  f.flat([[AN[0] + 2, gy - 34], [AN[0] + 16, gy - 40], [AN[0] + 30, gy - 30], [AN[0] + 34, gy - 16], [AN[0] + 12, gy - 14]], '#120e0a'); // the burst seam
  f.part(ell([AN[0] + 18, gy - 24], 9, 7, 0.2, 10), SKN({ fill: mix(skin, '#5a4050', 0.25), cast: false, inkW: 1 }));
  for (let i = 0; i < 4; i++) f.line([[AN[0] + 4 + i * 8, gy - 36 + i * 2], [AN[0] + 8 + i * 8, gy - 30 + i * 2]], 1, '#c8b48c', { op: 0.7 }); // broken stitches

  // ---- the lamb across his shoulders: hollowed, larvae shifting under the matted fleece. It lies round the back of his
  // neck: the rump and hind legs hang down his back, the forequarters over his near shoulder with the head lolling in front.
  f.bone('lamb');
  const LB = [[168, 372], [164, 330], [176, 290], [204, 260], [240, 240], [282, 232], [318, 240], [346, 262], [358, 292], [352, 322], [330, 330], [304, 310], [276, 300], [246, 304], [222, 322], [206, 352], [192, 380]];
  X.furMass(f, LB, FLC({ fill: mix(P.fleece, '#5a564a', 0.15) }), { len: 15, flow: p => 0.3 + (p[0] - 200) * 0.006, edge: 10, matted: p => p[1] > 330,
    inner: () => {
      for (const [c, r] of [[[214, 300], 16], [[254, 268], 18], [[300, 262], 15], [[188, 344], 12]]) { f.flat(ell(add(c, [3, 7]), r * 1.1, r * 0.6, 0.2, 10), '#2a2822', { op: 0.5 }); f.flat(ell(add(c, [-2, -3]), r, r * 0.55, 0.2, 10), P.fleeceL, { op: 0.45 }); } // larvae lifting the fleece
      X.fern(f, LB, [318, 246], 2.9, 110, 1.6, { cloth: true, depth: 2 });
      f.flat([[150, 330], [360, 300], [360, 400], [150, 400]], '#1a1814', { op: 0.25 });
    } });
  X.hole(f, [236, 290], 7, 6, 0.2, { lip: P.fleeceL }); X.grub(f, [240, 286], -0.6, 0.5, { curl: 0.5 });
  X.hole(f, [190, 320], 5, 4, 0.5, { lip: P.fleeceL });
  X.mould(f, [180, 360], 16, 12, 12);
  // the rump's tail, and the hind legs hanging down his back
  f.part(limb([170, 344], [154, 372], 16, 9, { steps: 4 }), FLC({ cast: false, inkW: 1.1 }));
  const legL = (a, k, hoof, w) => { f.part(X.mchain([a, k, hoof], [[[[0, w * 0.5], [0.5, w * 0.56], [1, w * 0.34]], [[0, w * 0.5], [1, w * 0.36]]], [[[0, w * 0.34], [1, w * 0.24]], [[0, w * 0.34], [1, w * 0.24]]]]), FLC({ fill: mix(P.fleece, '#6a6458', 0.3), inkW: 1.2, cast: false })); f.part([add(hoof, [-w * 0.32, -3]), add(hoof, [w * 0.32, -3]), add(hoof, [w * 0.36, w * 0.7]), add(hoof, [0, w * 0.5]), add(hoof, [-w * 0.32, w * 0.62])], { fill: '#2a2622', shade: 0.3, inkW: 1, cast: false }); };
  legL([186, 370], [176, 414], [182, 452], 16);
  legL([204, 366], [200, 408], [208, 444], 14);
  // ---- head: weathered, the eyes rolled up, the hair standing up in a stiff fan; the neck grown into the lamb
  f.bone('head');
  const nk = add(HC, rot([-6, 44], hA));
  f.part(limb(add(N0, [-2, 6]), nk, 50, 42, { steps: 5 }), SKN());
  const hF0 = frame(HC, hA, H);
  const hF = X.pHead(f, HC, H, hA, { skin, jaw: 1.08, chin: 0.02, nose: 1.05, hook: 0.1, rolled: true, mouth: 'set', browDown: 0.0, age: true, hairCol: '#4a4036', beard: 'stubble', beardCol: '#3a342c' });
  X.stiffMane(f, hF, Math.PI * 0.9, Math.PI * 1.84, 0.22, '#7a6e5e', { n: 11, taper: t => 0.5 + Math.sin(t * Math.PI) * 0.7 });
  f.flat(hF([[0.18, 0.27], [0.25, 0.262], [0.31, 0.27], [0.29, 0.31], [0.23, 0.32]]), '#1a1210'); // the slack mouth
  for (const q of [[[0.02, -0.22], [0.16, -0.24]], [[0.03, -0.27], [0.15, -0.29]], [[0.22, 0.04], [0.26, 0.1]]]) f.line(hF(q), 1, INK, { op: 0.5 }); // weather lines
  X.fern(f, X.lumpy(f, hF(ell([0.0, 0.0], 0.4, 0.55, 0, 14)), 0), hF([[-0.2, 0.36]])[0], hA - 1.2, 40, 1.2, { depth: 2 }); // the fern's last branch up the jaw
  // ---- the lamb's front end on the near shoulder, its head lolling; the neck where lamb and man have grown together
  f.bone('lamb');
  const JN = [add(N0, [-24, -26]), add(N0, [6, -34]), add(N0, [30, -24]), add(N0, [36, -6]), add(N0, [20, 4]), add(N0, [-6, 0]), add(N0, [-26, -10])];
  f.part(X.lumpy(f, JN, 3), SKN({ fill: mix(skin, P.ven, 0.22), shade: 0.4 }));
  X.clipDraw(f, JN, () => { for (const [c, r] of [[add(N0, [0, -10]), 11], [add(N0, [24, 0]), 9]]) { f.flat(ell(add(c, [2, 4]), r, r * 0.6, 0.3, 10), '#3a2c30', { op: 0.4 }); f.flat(ell(c, r * 0.8, r * 0.5, 0.3, 10), '#f0e8d4', { op: 0.4 }); } for (let i = 0; i < 6; i++) { const q = add(N0, [R(f, -24, 30), R(f, -24, 12)]); f.line([q, add(q, [6, 3]), add(q, [9, 10])], 0.9, '#5a4e6a', { op: 0.6 }); } });
  X.furMass(f, [add(N0, [-20, -40]), add(N0, [20, -42]), add(N0, [44, -24]), add(N0, [26, -18]), add(N0, [0, -24]), add(N0, [-24, -22])], FLC(), { len: 8, flow: () => 0.4, edge: 7 }); // fleece growing into the skin
  X.pustules(f, add(N0, [12, 8]), 16, 6, 3, 2.2, 3.6);
  // the lamb's head lolling down over his near shoulder, eyes shut, ears hanging, its mouth slack
  const lh = [340, 316], lF = frame(lh, 1.22, 1.25);
  f.part(limb([326, 292], lh, 38, 30, { steps: 4 }), FLC({ inkW: 1.2 }));
  // the head hanging muzzle-down: a broad poll under a cap of fleece, a long narrow face, the muzzle soft and dark-lipped
  f.part(lF([[-10, -15], [6, -15], [22, -11], [36, -8], [48, -6], [56, -2], [56, 5], [48, 9], [34, 10], [18, 12], [2, 14], [-10, 10], [-14, 0]]), { fill: '#a8a090', shadow: '#4e4a42', light: '#cec6b4', shade: 0.34, tex: 'mottle' + sd, texOp: 0.5, inkW: 1.4 });
  f.flat(lF([[30, -7], [50, -4], [52, 6], [30, 8]]), '#4e4a42', { op: 0.25 }); // the shadowed bridge of the nose
  f.line(lF([[4, -8], [10, -5], [16, -7]]), 1.5, INK); f.line(lF([[5, -10], [15, -10]]), 1, '#4e4a42', { op: 0.6 }); // the eye, shut
  f.flat(lF(ell([53, -1], 2.4, 1.6, 0.3, 6)), '#1a1410'); f.line(lF([[44, 8], [52, 6], [56, 4]]), 1.2, INK, { op: 0.8 }); // nostril, the slack mouth
  f.flat(lF([[46, 7], [54, 5], [52, 10], [46, 10]]), '#5a3a3a', { op: 0.5 });
  X.furMass(f, lF([[-14, -16], [6, -20], [12, -10], [6, 0], [-8, 4], [-16, -4]]), FLC(), { len: 7, flow: () => 3.4, edge: 6 });
  // the ear hanging plumb from the poll
  const er = lF([[-2, 6]])[0];
  f.part([er, add(er, [8, 2]), add(er, [10, 22]), add(er, [6, 32]), add(er, [0, 30]), add(er, [-3, 14])], { fill: '#948c7c', shadow: '#3e3a32', shade: 0.36, inkW: 1.1, cast: false });
  f.line([add(er, [4, 6]), add(er, [4, 26])], 1, '#5a3a3a', { op: 0.5 });
  // the lamb's front legs hanging in front of his chest into his far fist
  legL([318, 318], [314, 350], [322, 376], 12); legL([306, 314], [302, 348], [314, 378], 11);
  f.bone('hand_f');
  X.knuckleFist(f, WF, ang(EF, WF), 21, mix(skin, '#000', 0.08), { tex: 'mottle' + sd, shadow: '#3a2c30' });

  // ---- near arm: rolled wool sleeve, the bare forearm with the fern running up from the fused hand; the crook
  X.mArm(f, SN, EN, WN, [48, 40, 30], WOOL({ shade: 0.26 }), { sfx: '_n', bare: false });
  f.bone('forearm_n');
  const fa = X.mArm(f, lerp(EN, WN, 0.25), lerp(EN, WN, 0.6), WN, [38, 35, 28], SKN(), {});
  X.fern(f, fa.pts, add(WN, [-6, -4]), ang(WN, EN) + 0.05, 90, 2, { depth: 3 });
  f.part(K.ragLimb(f, lerp(EN, SN, 0.1), lerp(EN, WN, 0.28), 52, 44, { depth: 7, teeth: 5 }), WOOL({ fill: '#625e54' })); // the rolled cuff above the elbow
  f.bone('crook');
  // the ash staff, worn pale where hands held it; the iron shank fused into the fist and the hook curled forward
  f.part(limb(add(sock, mul(cu, 6)), butt, 15, 13, { steps: 10, capK: 0.5 }), X.WD(f, { fill: P.hazel, light: P.hazelL, shadow: P.hazelD }));
  f.line([lp(sock, butt, 0.05, -4), lp(sock, butt, 0.95, -3)], 1, P.hazelL, { op: 0.6, straight: true });
  f.part(limb(add(butt, mul(cu, 16)), add(butt, mul(cu, -4)), 15, 14, { steps: 3 }), X.IR(f, { cast: false })); // the iron shoe on the butt
  for (const t of [0.3, 0.55]) X.scorch(f, lp(sock, butt, t, 0), 8, 14, 0.4, Math.atan2(cu[1], cu[0]));
  const hook = [shankE, add(shankE, [10, -22]), add(shankE, [28, -34]), add(shankE, [50, -32]), add(shankE, [62, -16]), add(shankE, [60, 4]), add(shankE, [50, 16])];
  f.part(limb(add(sock, mul(cu, -8)), shankE, 13, 10, { steps: 6 }), X.IR(f));
  const HK = X.ribbon(X.spline(hook), t => 11 - t * 4);
  f.part(HK, X.IR(f));
  f.line(X.spline(hook).slice(2, 30).map(q => add(q, [-2, -3])), 1.4, P.ironL, { op: 0.6 });
  f.part(ell(add(shankE, [52, 18]), 6, 5, 0.4, 8), X.IR(f, { cast: false })); // the hook's turned knob
  X.clipDraw(f, [...limb(add(sock, mul(cu, -8)), shankE, 14, 11, { steps: 6 })], () => X.burn(f, shankE, Math.atan2(-cu[1], -cu[0]), 110, 1.4, { depth: 2 }));
  X.scorch(f, lerp(sock, shankE, 0.3), 10, 14, 0.5, Math.atan2(cu[1], cu[0]));
  f.bone('hand_n');
  const g = X.gripK(f, WN, EN, Math.atan2(cu[1], cu[0]), 23, skin, { tex: 'mottle' + sd, shadow: '#3a2c30', name: 'shepherd crook' });
  // the weld: iron run out over the knuckles and set hard, scorched skin round it
  X.scorch(f, add(WN, [4, -6]), 18, 12, 0.5);
  f.part(X.lumpy(f, ell(add(WN, mul(cu, 26)), 11, 8, Math.atan2(cu[1], cu[0]), 12), 2), X.IR(f, { fill: '#2a2826', light: '#7a7680', cast: false }));
  f.line([add(WN, mul(cu, 20)), add(WN, add(mul(cu, 30), [3, 0]))], 1.6, mix(P.ironL, P.vioL, 0.5), { op: 0.7 });

  f.bone('root');
  f.flat(ell([290, gy + 2], 200, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ HIGHWAYMAN (cast, human 1.0)
// A road robber crouched low behind a levelled crossbow, the butt braced at his shoulder and his cheek down on the stock;
// the near knee nearly on the ground, the far knee up, the weight on bent knees. The strike hit the steel prod and ran
// into his hands: both hands fused to the stock, the fingers welded black, burns branching up the forearms. A sting at
// the neck paralysed the near side of his face, swollen and drooping over the kerchief; the trigger finger never stops.
// Rig: standard humanoid + crossbow (hand_n; the far hand needs IK on the fore-stock) + cape (torso) + quiver (pelvis).
// Motion: idle the crouched aim, the finger twitching (hand_n); attack a bolt at the back rank (the bow kicks: crossbow).
function highwayman() {
  const seed = 1026, h = TIERS.human[1];
  const f = new Fig(X.base(seed, h, { grimeY: 600 }));
  X.texturesX(f);
  const H = 96, gy = f.o.groundY, sd = seed;
  const skin = mix(P.skin, '#8a6a52', 0.3), SKN = (o = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: '#3a2c30' }, o));
  const LTH = (o = {}) => X.CLK(f, Object.assign({ fill: '#3a3530', shadow: '#12100e', light: '#6a6258', tex: 'wrinkle' + sd, texOp: 0.5 }, o)); // chitin black leather
  const BUFF = (o = {}) => X.CLK(f, Object.assign({ fill: '#7a6a52', shadow: '#2a2016', light: '#a8946e', tex: 'wrinkle' + sd, texOp: 0.45 }, o));
  const CLO = (o = {}) => X.CLK(f, Object.assign({ fill: '#3e3a36', shadow: '#14120f', light: '#6a645a', tex: 'weave' + sd, texOp: 0.5 }, o));
  const Pv = [216, 602], N0 = [280, 410];
  const S = B.spine(N0, [236, 484], Pv, H);
  const HC = [314, 356], hA = 0.06;
  const SN = [272, 426], EN = [250, 530], WN = [326, 404];
  const SF = [300, 418], EF = [352, 512], WF = [426, 400];
  const HN = [212, 606], KN = [190, 760], AN = [76, 724];
  const HF = [232, 598], KF = [368, 548], AF = [378, 744];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const butt = [258, 392], nose = [520, 378], sa = ang(butt, nose), sn = [-Math.sin(sa), Math.cos(sa)];
  const st = t => lerp(butt, nose, t);
  f.joint('crossbow', WN, 'hand_n').joint('cape', [262, 420], 'torso').joint('quiver', [180, 590], 'pelvis');

  // ---- short hooded cloak, behind: frayed and stiff at the hem
  f.bone('cape');
  const CB = [[250, 404], [206, 420], [176, 470], [160, 540], ...X.hemLine(f, [150, 586], [262, 600], 7, 10), [270, 520], [276, 440]];
  f.part(CB, CLO({ fill: '#33302c' }));
  X.clipDraw(f, CB, () => { for (const [a, b] of [[[220, 430], [180, 580]], [[248, 430], [236, 590]]]) f.stroke([a, lerp(a, b, 0.5), b], 3, '#100e0c', { op: 0.55 }); });
  X.wear(f, CB, 4); X.hemThreads(f, CB.slice(4, 12), '#2a2622', 4);
  // ---- quiver of bolts at the back hip
  f.bone('quiver');
  const QV = [[150, 560], [190, 548], [204, 650], [166, 662]];
  f.part(QV.map(q => [...q, 1]), LTH({ fill: '#2e2a26' }));
  for (let i = 0; i < 5; i++) { const b0 = [158 + i * 8, 556 - i * 2], t0 = add(b0, [-10 + i * 2, -40 - (i % 2) * 8]); f.line([b0, t0], 3, P.wood); f.line([b0, t0], 1, P.woodL, { op: 0.6 }); f.part([t0, add(t0, [-6, -8]), add(t0, [-2, -14]), add(t0, [4, -6])], { fill: '#8a8478', shade: 0.4, inkW: 0.9, cast: false }); } // fletched butts
  f.line([[154, 600], [200, 594]], 2.4, '#1a1614'); f.line([[158, 640], [202, 634]], 2.4, '#1a1614');

  // ---- far leg: the knee up, the foot planted ahead
  const lf = X.mLeg(f, HF, KF, AF, [74, 54, 36], CLO({ fill: '#46423c' }), { sfx: '_f', bare: false, after: () => {} });
  f.bone('thigh_f'); X.wear(f, X.mchain([HF, KF], [[[[0, 34], [1, 26]], [[0, 34], [1, 26]]]]), 4, { hem: false });
  { const pc = lerp(HF, KF, 0.55); const pt = [add(pc, [-16, -14]), add(pc, [18, -18]), add(pc, [20, 10]), add(pc, [-14, 14])]; f.part(pt, CLO({ fill: '#5a5248', cast: false, inkW: 1 })); f.stitches([...pt, pt[0]], '#b8a888', 0.8); }
  X.bootRig(f, KF, AF, 50, '#2e2924', '_f', { tex: 'mottle' + sd, shaft: 0.7, toe: 1.1 });
  f.bone('foot_f'); f.scratches([AF[0] + 30, gy - 20], 14, 4);

  // ---- far arm: up under the fore-stock, the forearm burnt
  X.mArm(f, SF, EF, WF, [42, 36, 26], LTH({ fill: '#2c2824', shade: 0.28 }), { sfx: '_f', bare: false });
  f.bone('forearm_f');
  const fF = X.mArm(f, lerp(EF, WF, 0.45), lerp(EF, WF, 0.72), WF, [30, 28, 24], SKN({ fill: mix(skin, '#000', 0.15) }), { build: 'lean' });
  X.fern(f, fF.pts, WF, ang(WF, EF), 60, 1.6, { depth: 2 });

  // ---- torso: buff leather jerkin over a dark shirt, the belt hung with stolen purses, the long knife, the lever
  f.bone('torso');
  const TOR = S.shape([[0, 0.38, 0.3], [0.12, 0.62, 0.46], [0.36, 0.62, 0.5], [0.62, 0.52, 0.46], [0.86, 0.52, 0.48], [1.04, 0.58, 0.54]]);
  f.part(TOR, BUFF());
  X.wear(f, TOR, 6, { hem: false });
  X.clipDraw(f, TOR, () => {
    for (const v of [0.25, 0.5, 0.74]) f.stroke([S.at(-0.5, v), S.at(0, v + 0.05), S.at(0.45, v)], 2.4, '#2a2016', { op: 0.5 });
    f.line([S.at(0.3, 0.05), S.at(0.36, 0.5), S.at(0.34, 1.0)], 1.6, '#1a140e', { op: 0.7 }); // the jerkin's lacing edge
    for (let i = 0; i < 6; i++) f.line([S.at(0.26, 0.12 + i * 0.13), S.at(0.42, 0.18 + i * 0.13)], 1.4, '#2a2016', { op: 0.7 });
    f.flat([S.at(-1, 0.86), S.at(1, 0.86), S.at(1, 1.2), S.at(-1, 1.2)], '#14100c', { op: 0.3 });
  });
  f.bone('pelvis');
  f.part([S.at(-0.6, 0.9), S.at(0.0, 0.95), S.at(0.58, 0.9), S.at(0.6, 0.99), S.at(0.0, 1.03), S.at(-0.6, 0.99)], LTH({ fill: '#221e1a', k: 0.5 }));
  f.part([S.at(0.26, 0.9), S.at(0.38, 0.9), S.at(0.38, 1.0), S.at(0.26, 1.0)].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  // the purses, each a different leather and cord, one cut from its owner's belt
  for (const [u, dy, w, col] of [[-0.42, 0, 26, '#5a4636'], [-0.12, 4, 22, '#6e5a42'], [0.1, 2, 18, '#4a3a2e'], [0.5, 0, 20, '#7a6248']]) {
    const c = add(S.at(u, 1.0), [0, dy]);
    f.line([c, add(c, [0, 10])], 2, '#2a2018');
    f.part([add(c, [-w * 0.5, 10]), add(c, [w * 0.5, 9]), add(c, [w * 0.6, 26]), add(c, [w * 0.3, 10 + w * 1.2]), add(c, [-w * 0.4, 10 + w * 1.1]), add(c, [-w * 0.6, 24])], X.CLK(f, { fill: col, shadow: '#1a120c', tex: 'wrinkle' + sd, cast: false, inkW: 1.2 }));
    f.line([add(c, [-w * 0.4, 14]), add(c, [w * 0.4, 13])], 1.4, '#1a120c', { op: 0.8 });
  }
  // the goat's-foot lever hung at the hip: a forked iron with two claws and a pivot
  const gf = S.at(-0.66, 0.96);
  f.part(limb(gf, add(gf, [-18, 70]), 10, 8, { steps: 4 }), X.IR(f));
  for (const s2 of [-1, 1]) f.part([add(gf, [s2 * 3, 0]), add(gf, [s2 * 10 - 4, -16]), add(gf, [s2 * 12 - 2, -24]), add(gf, [s2 * 6, -14])], X.IR(f, { cast: false }));
  f.rivet(add(gf, [-6, 30]), 2.6);

  // ---- near leg: kneeling, the knee a hand off the ground, the toes tucked under, the heel up
  X.mLeg(f, HN, KN, AN, [80, 56, 38], CLO(), { sfx: '_n', bare: false });
  f.bone('shin_n'); f.part(plate(KN, AN, 0.0, 0.3, 50, 44), BUFF({ fill: '#5a4a38', cast: false })); f.stitches([lp(KN, AN, 0.02, -20), lp(KN, AN, 0.3, -18)], '#c8b48c', 0.8); // a leather knee patch, worn through
  f.bone('foot_n');
  // the tucked boot: shaft from the ankle, the heel cocked up, the vamp bent, the toe cap flat on the ground
  const tb = [[AN[0] - 22, AN[1] - 18], [AN[0] + 20, AN[1] - 22], [AN[0] + 26, AN[1] + 6], [AN[0] + 34, gy - 22], [AN[0] + 46, gy - 6], [AN[0] + 40, gy, 1], [AN[0] - 2, gy, 1], [AN[0] - 16, gy - 12], [AN[0] - 20, AN[1] + 28], [AN[0] - 30, AN[1] + 8]];
  f.part(tb, LTH({ fill: '#2e2924', tex: 'mottle' + sd }));
  f.part([[AN[0] - 30, AN[1] + 6], [AN[0] - 20, AN[1] + 30], [AN[0] - 14, AN[1] + 26], [AN[0] - 22, AN[1] + 4]], LTH({ fill: '#1a1614', cast: false })); // the heel block, pointing up and back
  f.line([[AN[0] + 2, gy - 3], [AN[0] + 40, gy - 3]], 2.2, '#100e0c'); f.scratches([AN[0] + 12, AN[1] + 20], 12, 5);
  f.line([[AN[0] + 24, AN[1] + 8], [AN[0] + 30, gy - 24], [AN[0] + 40, gy - 10]], 1.2, INK, { op: 0.6 }); // the vamp's crease

  // ---- head: hood up, a grey kerchief over the nose and mouth; the near side of the face paralysed and drooping
  f.bone('head');
  const nk = add(HC, rot([-12, 42], hA));
  f.part(limb(add(N0, [-6, 4]), nk, 48, 42, { steps: 4 }), SKN());
  X.weal(f, lerp(N0, nk, 0.5), 7);
  const hF0 = frame(HC, hA, H);
  f.part(hF0([[-0.62, -0.1], [-0.5, -0.5], [-0.2, -0.7], [0.18, -0.66], [0.42, -0.44], [0.46, 0.0], [0.4, 0.5], [-0.1, 0.7], [-0.6, 0.6]]), CLO({ fill: '#2a2724' })); // the hood's back, behind the head
  const hF = X.pHead(f, HC, H, hA, { skin, jaw: 1.04, chin: 0.0, nose: 1.0, hook: 0.3, droop: true, mouth: 'grim', squint: 0.45, browDown: 0.06, age: true, hairCol: '#2a2420' });
  X.weal(f, hF([[-0.1, 0.3]])[0], 9);
  // the kerchief: tied behind, pulled up over the nose, bulging over the swollen jaw, its edge frayed
  const KC = hF([[-0.3, 0.04], [0.16, 0.06], [0.33, 0.04], [0.43, 0.12], [0.42, 0.3], [0.38, 0.5], [0.22, 0.66], [0.0, 0.68], [-0.22, 0.56], [-0.34, 0.3]]);
  f.part(KC, X.CLK(f, { fill: '#6a6862', shadow: '#24221e', light: '#9a968c', tex: 'weave' + sd, texOp: 0.5 }));
  X.clipDraw(f, KC, () => { for (const q of [[[0.0, 0.2], [0.2, 0.3], [0.36, 0.26]], [[-0.1, 0.4], [0.14, 0.5], [0.34, 0.44]], [[0.36, 0.12], [0.38, 0.3]]]) f.stroke(hF(q), 2.2, '#24221e', { op: 0.55 }); f.flat(hF(ell([0.08, 0.34], 0.16, 0.12, 0, 10)), '#c8c4b8', { op: 0.18 }); });
  f.line(hF([[0.2, 0.08], [0.3, 0.07], [0.38, 0.1]]), 1.2, '#9a968c', { op: 0.6 });
  // the hood: up over the head, its peak shading the brow, the stolen lead badge pinned on it
  const HD = hF([[-0.58, 0.2], [-0.6, -0.2], [-0.44, -0.6], [-0.1, -0.78], [0.24, -0.72], [0.44, -0.5], [0.5, -0.26], [0.42, -0.2], [0.3, -0.42], [0.04, -0.52], [-0.22, -0.42], [-0.3, -0.1], [-0.3, 0.3], [-0.44, 0.5]]);
  f.part([hF([[-0.5, -0.36]])[0], hF([[-0.66, -0.1]])[0], add(hF([[-0.66, 0.2]])[0], [-4, 30]), add(hF([[-0.6, 0.2]])[0], [2, 52]), add(hF([[-0.5, 0.2]])[0], [6, 40]), hF([[-0.44, 0.1]])[0]], CLO({ fill: '#4a4540' })); // the hood's tail hanging plumb down his back
  f.part(HD, CLO({ fill: '#4a4540', light: '#7a7268' }));
  X.clipDraw(f, HD, () => {
    for (const q of [[[-0.1, -0.7], [-0.2, -0.5], [-0.26, -0.3]], [[0.2, -0.66], [0.14, -0.52]], [[-0.5, -0.36], [-0.44, 0.0]]]) f.stroke(hF(q), 2.4, '#16140f', { op: 0.55 }); f.stroke(hF([[-0.4, -0.5], [-0.46, -0.1], [-0.42, 0.3]]), 2.6, '#100e0c', { op: 0.5 }); f.stroke(hF([[0.0, -0.66], [0.3, -0.56]]), 2, '#8a847a', { op: 0.35 }); });
  X.wear(f, HD, 3, { hem: false });
  f.flat(hF([[0.42, -0.22], [0.3, -0.4], [0.04, -0.48], [0.1, -0.36], [0.3, -0.3]]), '#0c0a0a', { op: 0.5 }); // the peak's shadow on the brow
  X.leadBadge(f, hF([[-0.3, -0.48]])[0], 7, -0.3);
  X.stiffMane(f, hF, Math.PI * 0.96, Math.PI * 1.22, 0.2, '#3a322a', { n: 3, r: 0.36 }); // hair standing out of the hood at the brow

  // ---- the crossbow: tiller, steel prod (fused and scorched), the spanned string, a bolt in the groove; hands fused to it
  f.bone('crossbow');
  const TL = [add(butt, mul(sn, -16)), add(st(0.25), mul(sn, -13)), add(st(0.62), mul(sn, -10)), add(nose, mul(sn, -9)), add(nose, mul(sn, 10)), add(st(0.62), mul(sn, 12)), add(st(0.4), mul(sn, 22)), add(st(0.25), mul(sn, 24)), add(st(0.1), mul(sn, 30)), add(butt, mul(sn, 22))];
  f.part(TL, X.WD(f, { fill: '#4a3a2a', light: '#7a644a', shadow: '#1e160e' }));
  f.line([add(st(0.1), mul(sn, -12)), add(st(0.98), mul(sn, -7))], 1.4, '#9a8460', { op: 0.5 });
  f.part([add(st(0.42), mul(sn, 18)), add(st(0.48), mul(sn, 22)), add(st(0.36), mul(sn, 70)), add(st(0.31), mul(sn, 66))], X.IR(f, { cast: false })); // the trigger lever, long, under the stock
  f.part(ell(add(st(0.62), mul(sn, -10)), 9, 7, sa, 10), X.IR(f, { fill: '#2a2826', cast: false })); // the nut
  // the prod seen three-quarter: a heavy steel bow arching across the nose, the strike's scorch and a fused, sagging lump
  const pc = st(0.95), PR = [add(pc, [-8, -72]), add(pc, [10, -40]), add(pc, [16, 0]), add(pc, [8, 46]), add(pc, [-12, 80])];
  f.part(X.ribbon(X.spline(PR), t => 13 - Math.abs(t - 0.5) * 12), X.IR(f, { fill: '#4a4a52', light: '#8a8a96' }));
  f.line(X.spline(PR).slice(4, 40).map(q => add(q, [3, -2])), 1.4, '#9a98a8', { op: 0.6 });
  for (const e of [PR[0], PR[4]]) f.line([e, add(st(0.62), mul(sn, -11))], 1.6, '#c8c0a8'); // the string, spanned back to the nut
  X.scorch(f, add(pc, [10, 8]), 20, 34, 0.55);
  f.part(X.lumpy(f, ell(add(pc, [16, 10]), 10, 14, 0.2, 12), 3), X.IR(f, { fill: '#2a2a2e', light: P.vioL, cast: false })); // the fused lump
  X.clipDraw(f, X.ribbon(X.spline(PR), t => 14), () => X.burn(f, add(pc, [16, 4]), -1.7, 70, 1.4, { depth: 2 }));
  f.part([add(nose, [-4, 8]), add(nose, [14, 10]), add(nose, [18, 34]), add(nose, [10, 42]), add(nose, [2, 34]), add(nose, [2, 14])], X.IR(f, { cast: false })); // the stirrup
  f.flat([add(nose, [6, 16]), add(nose, [12, 16]), add(nose, [12, 32]), add(nose, [7, 34])], '#0c0a0a');
  // the bolt in the groove, its head past the nose
  const b0 = add(st(0.62), mul(sn, -14)), b1 = add(nose, add(mul(E.norm(sub(nose, butt)), 26), mul(sn, -12)));
  f.line([b0, b1], 4.4, INK); f.line([b0, b1], 2.6, P.woodL);
  f.part([add(b1, mul(sn, -5)), add(b1, mul(E.norm(sub(nose, butt)), 18)), add(b1, mul(sn, 5))], X.IR(f, { cast: false, inkW: 1 }));
  f.part([b0, add(b0, add(mul(sn, -9), mul(E.norm(sub(nose, butt)), 10))), add(b0, mul(E.norm(sub(nose, butt)), 16))], { fill: '#8a8478', shade: 0.4, inkW: 0.9, cast: false });

  // ---- near arm: tucked, the hand fused on the grip with the trigger finger out along the lever
  X.mArm(f, SN, EN, WN, [46, 38, 28], LTH({ shade: 0.28 }), { sfx: '_n', bare: false });
  f.bone('forearm_n');
  const fN = X.mArm(f, lerp(EN, WN, 0.42), lerp(EN, WN, 0.72), WN, [33, 30, 26], SKN(), {});
  X.fern(f, fN.pts, WN, ang(WN, EN), 70, 1.8, { depth: 3 });
  f.part(K.ragLimb(f, lerp(EN, WN, 0.1), lerp(EN, WN, 0.45), 44, 40, { depth: 6, teeth: 4 }), LTH({ fill: '#3e3832' }));
  f.bone('hand_n');
  const fist = (c, el, nm) => {
    const g = X.gripK(f, c, el, sa, 22, '#2a2220', { tex: 'pit' + sd, texOp: 0.6, shadow: '#0c0a0a', nail: '#4a3a3a', name: nm });
    // welded black: the fingers run together into the wood, a charred seam where skin meets stock, stolen rings sunk in
    X.scorch(f, add(c, mul(sn, -8)), 16, 10, 0.55, sa);
    f.part(X.lumpy(f, ell(add(c, mul(sn, -12)), 14, 5, sa, 10), 1.5), { fill: '#1a1614', light: '#5a5060', shade: 0.4, inkW: 1, cast: false, hatch: false });
    for (const [dx, col] of [[-6, '#8a8a8c'], [5, '#6e6e70']]) { const rc = add(add(c, mul(sn, 6)), rot([dx, 0], sa)), d2 = rot([0, 1], sa); f.line([add(rc, mul(d2, -5)), add(rc, mul(d2, 5))], 3.4, INK); f.line([add(rc, mul(d2, -4)), add(rc, mul(d2, 4))], 2, col); } // stolen rings sunk into the welded fingers
    return g;
  };
  fist(WN, EN, 'highwayman grip');
  // the trigger finger: out of the fist and along the lever, bent, twitching (a doubled ghost of its tip)
  const tf0 = add(WN, mul(sn, 16)), tf1 = add(tf0, [12, 20]), tf2 = add(tf1, [10, 10]);
  f.part(X.mchain([tf0, tf1, tf2], [[[[0, 5.5], [1, 5]], [[0, 5.5], [1, 5]]], [[[0, 5], [1, 4]], [[0, 5], [1, 4]]]]), { fill: '#2a2220', shadow: '#0c0a0a', light: '#5a4a48', shade: 0.4, inkW: 1.2, cast: false });
  f.line([add(tf2, [3, -2]), add(tf2, [7, 2])], 1, INK, { op: 0.35 }); f.line([add(tf2, [2, -4]), add(tf2, [8, -1])], 1, INK, { op: 0.25 });
  f.bone('hand_f');
  fist(WF, EF, 'highwayman fore-stock');
  X.fern(f, ell(WF, 30, 22, 0, 12), add(WF, [-4, 10]), 2.4, 30, 1.2, { depth: 1 });

  f.bone('root');
  f.flat(ell([230, gy + 2], 210, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE TINKER (cast, human 1.0, 1.35 to the top of his load)
// A travelling tinker bent forward under a towering wooden frame of pots, kettles and pans, a small hammer in the near
// hand, the weight forward over his toes to balance the load. The strike hit the load: copper and tin fused into one
// lumpy shell grown into his back, the frame charred inside it; ferns spread down his arms and legs from wherever metal
// touches skin, and his hair stands out under the cap. Wasps nest in the kettles; the skin round the fused metal is
// swollen and blistered. Canvas heightened to 960 at the same pixel scale so the load's true height fits (GUIDE 2).
// Rig: standard humanoid + load (torso) + lantern (load) + hammer (hand_n) + apron (pelvis). Motion: idle a clank as he
// shifts the load (load); attack a turn that swings the whole load into a hero (torso and load rotate together).
function tinker() {
  const seed = 1027, h = 960;
  const f = new Fig(X.base(seed, h, { grimeY: 700 }));
  X.texturesX(f);
  const H = 96, gy = f.o.groundY, sd = seed;
  const skin = mix(P.skin, '#7a5a48', 0.36), SKN = (o = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: '#36282c' }, o));
  const COAT = (o = {}) => X.CLK(f, Object.assign({ fill: '#4e4a44', shadow: '#16140f', light: '#7a746a', tex: 'weave' + sd, texOp: 0.5 }, o));
  const APR = (o = {}) => X.CLK(f, Object.assign({ fill: '#4a3a2c', shadow: '#16100a', light: '#7a6650', tex: 'wrinkle' + sd, texOp: 0.55 }, o));
  const CPR = (o = {}) => Object.assign({ fill: mix(P.copper, '#1a1410', 0.25), shadow: '#0e0a08', light: P.copperL, shade: 0.42, tex: 'pit' + sd, texOp: 0.6 }, o); // scorched copper
  const TIN = (o = {}) => Object.assign({ fill: mix(P.tin, '#1a1a1e', 0.3), shadow: '#0c0c0e', light: P.tinL, shade: 0.42, tex: 'pit' + sd, texOp: 0.6 }, o); // scorched tin
  const verd = '#5e7a62';
  const Pv = [300, 612], N0 = [396, 452];
  const S = B.spine(N0, [330, 492], Pv, H);
  const HC = [440, 404], hA = -0.08;
  const SN = [384, 474], EN = [392, 568], WN = [414, 652];
  const SF = [406, 466], EF = [420, 556], WF = [446, 632];
  const HN = [312, 616], KN = [372, 750], AN = [380, 884];
  const HF = [290, 610], KF = [300, 752], AF = [262, 880];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('load', [340, 470], 'torso').joint('lantern', [196, 360], 'load').joint('hammer', WN, 'hand_n').joint('apron', [330, 600], 'pelvis');

  // ---- the load: one lumpy shell of fused vessels on a charred frame, towering over him
  f.bone('load');
  const MASS = X.lumpy(f, [[262, 620], [228, 590], [210, 530], [204, 470], [198, 420], [206, 360], [212, 300], [226, 236], [244, 186], [270, 150], [300, 136], [334, 140], [362, 170], [372, 220], [380, 280], [392, 340], [396, 400], [384, 450], [370, 490], [346, 520], [326, 570], [300, 612]], 6);
  f.part(MASS, CPR({ fill: '#1e1814', light: '#5a4636' }));
  // the charred frame showing between the vessels: two uprights and the cross-bars
  X.clipDraw(f, MASS, () => { for (const [a, b] of [[[250, 640], [272, 120]], [[330, 560], [360, 120]]]) f.part(limb(a, b, 16, 14, { steps: 8 }), X.WD(f, { fill: '#2a2018', light: '#5a4430', cast: false })); for (const y of [520, 380, 240]) f.part(limb([200, y], [410, y - 10], 12, 12, { steps: 6 }), X.WD(f, { fill: '#2a2018', light: '#5a4430', cast: false })); });
  const rim = (c, rx, ry, a, look, open = true) => { f.part(ell(c, rx, ry, a, 18), Object.assign({}, look, { cast: false, inkW: 1.3 })); if (open) f.flat(ell(add(c, rot([0, ry * 0.1], a)), rx * 0.82, ry * 0.62, a, 16), '#0a0808'); };
  const pot = (c, w, hh, a, look, o = {}) => {
    const F = frame(c, a, 1);
    f.part(F([[-w * 0.42, -hh * 0.5], [-w * 0.5, -hh * 0.36], [-w * 0.6, -hh * 0.04], [-w * 0.58, hh * 0.22], [-w * 0.46, hh * 0.44], [-w * 0.26, hh * 0.55], [w * 0.26, hh * 0.55], [w * 0.46, hh * 0.44], [w * 0.58, hh * 0.22], [w * 0.6, -hh * 0.04], [w * 0.5, -hh * 0.36], [w * 0.42, -hh * 0.5]]), Object.assign({ k: 0.9 }, look));
    f.line(F([[-w * 0.44, -hh * 0.3], [-w * 0.46, hh * 0.3]]), 2, look.light, { op: 0.5 });
    f.line(F([[-w * 0.5, -hh * 0.2], [w * 0.5, -hh * 0.2]]), 1.2, INK, { op: 0.45 });
    if (o.rim !== false) rim(F([[0, -hh * 0.5]])[0], w * 0.45, w * 0.13, a, look, !o.lid);
    if (o.lid) { f.part(F([[-w * 0.46, -hh * 0.5], [-w * 0.3, -hh * 0.64], [w * 0.3, -hh * 0.64], [w * 0.46, -hh * 0.5]]), Object.assign({}, look, { cast: false })); f.part(F(ell([0, -hh * 0.68], 6, 4, 0, 8)), Object.assign({}, look, { cast: false })); }
    if (o.ears) for (const s2 of [-1, 1]) f.line(F([[s2 * w * 0.5, -hh * 0.38], [s2 * w * 0.66, -hh * 0.36], [s2 * w * 0.64, -hh * 0.2], [s2 * w * 0.52, -hh * 0.18]]), 4, INK);
    if (o.spout) { f.part(F([[w * 0.44, -hh * 0.05], [w * 0.7, -hh * 0.3], [w * 0.92, -hh * 0.66], [w * 0.98, -hh * 0.6], [w * 0.8, -hh * 0.18], [w * 0.5, hh * 0.22]]), Object.assign({}, look, { cast: false })); f.flat(F(ell([w * 0.95, -hh * 0.64], 4, 2.6, -0.8, 8)), '#0a0808'); }
    if (o.bail) { const bp = F([[-w * 0.46, -hh * 0.5], [-w * 0.3, -hh * 1.05], [w * 0.3, -hh * 1.05], [w * 0.46, -hh * 0.5]]); f.line(bp, 5, INK); f.line(bp, 3, look.light); }
    return F;
  };
  const pan = (c, r, a, hl, look) => { f.part(limb(c, add(c, rot([hl, 0], a)), 10, 7, { steps: 6 }), Object.assign({}, look, { cast: false })); f.part(ell(c, r, r * 0.3, a + Math.PI / 2, 18), look); f.part(ell(add(c, rot([0, -3], a)), r * 0.86, r * 0.2, a + Math.PI / 2, 16), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.3), cast: false, inkW: 1 })); f.flat(ell(add(c, rot([hl, 0], a)), 3.2, 3.2, 0, 6), '#0a0808'); };
  // back to front, bottom to top: each vessel big enough to break the outline (rims, handles, a spout)
  pot([252, 572], 140, 110, 0.08, CPR(), { ears: true });
  pan([200, 474], 54, 2.55, 104, TIN());
  pot([340, 492], 110, 90, 0.2, TIN(), { spout: true, lid: true, bail: true });
  pot([258, 418], 122, 84, -0.12, CPR({ fill: mix(P.copper, '#1a1410', 0.15) }), {});
  pan([376, 380], 60, -0.4, 96, CPR());
  pot([300, 330], 112, 76, 0.1, TIN(), { ears: true });
  pot([238, 262], 98, 80, -0.25, CPR(), { spout: true, lid: true });
  pan([360, 236], 52, -0.9, 72, TIN());
  pot([298, 170], 92, 70, 0.15, CPR({ fill: mix(P.copper, '#1a1410', 0.2) }), { bail: true });
  // the ladle handle sticking out of the top like a horn
  f.part(limb([310, 150], [372, 52], 14, 9, { steps: 8 }), TIN());
  f.part(ell([372, 52], 9, 7, 0.4, 8), TIN({ cast: false }));
  // fused: weld seams between the vessels, metal run and set in drips, scorched black, verdigris in the hollows
  X.clipDraw(f, MASS, () => {
    for (const q of [[[196, 510], [300, 520], [372, 506]], [[210, 380], [300, 370], [396, 360]], [[214, 300], [300, 290], [380, 280]], [[236, 210], [300, 212], [356, 196]]]) { f.stroke(q, 7, '#0c0a08', { op: 0.75 }); f.line(q.map(p => add(p, [0, -3])), 1.6, P.copperL, { op: 0.45 }); }
    for (let i = 0; i < 14; i++) X.verdigris(f, [R(f, 200, 400), R(f, 150, 600)], 18, 12, 2, 0.7);
    for (let i = 0; i < 8; i++) X.scorch(f, [R(f, 200, 400), R(f, 140, 600)], R(f, 16, 34), R(f, 12, 26), 0.45);
    X.burn(f, [330, 130], 1.4, 260, 2.4, { depth: 3 }); X.burn(f, [270, 300], 2.0, 180, 1.8, { depth: 2 });
  });
  for (const [x, y] of [[250, 512], [300, 640], [360, 520], [214, 410], [394, 410]]) X.fusedRun(f, [x, y], R(f, 16, 30), 6, P.copper);
  for (const q of [[268, 600], [344, 470], [226, 300]]) X.verdigris(f, q, 14, 10, 3, 0.8);
  // the string of spoons melted together, sagging across the load
  const sp = []; for (let i = 0; i <= 8; i++) { const t = i / 8; sp.push(add(lerp([206, 330], [400, 318], t), [0, Math.sin(t * Math.PI) * 26])); }
  f.line(sp, 3, INK); f.line(sp, 1.6, P.tinL, { op: 0.7 });
  sp.slice(1, 8).forEach((q, i) => { const F = frame(q, Math.PI / 2 + (i - 3) * 0.12, 1); f.part(F([[0, -3], [18, -2], [26, -6], [34, -4], [34, 4], [26, 6], [18, 2], [0, 3]]), TIN({ cast: false, inkW: 1 })); if (i % 3 === 1) X.fusedRun(f, F([[30, 0]])[0], 10, 4, P.tin); });
  // wasps nesting in the kettles: paper comb in the spout and under a lid, wasps coming and going
  X.comb(f, [[352, 422], [372, 416], [378, 436], [360, 444]], { cell: 6 });
  X.miniWasp(f, [392, 400], -0.6, 0.6); X.miniWasp(f, [416, 430], 0.3, 0.55); X.miniWasp(f, [212, 224], -2.4, 0.55); X.miniWasp(f, [190, 250], 3.6, 0.5, { wings: false });
  // the lantern hung off the back of the frame, its glass burst
  f.bone('lantern');
  f.line([[196, 360], [190, 380]], 2.4, INK);
  const lc = [188, 410];
  f.part([add(lc, [-16, -26]), add(lc, [16, -26]), add(lc, [14, -32]), add(lc, [0, -40]), add(lc, [-14, -32])], TIN({ cast: false }));
  f.part([add(lc, [-14, -26]), add(lc, [14, -26]), add(lc, [16, 22]), add(lc, [-16, 22])].map(q => [...q, 1]), TIN({ fill: '#2a2a2e' }));
  f.flat([add(lc, [-10, -20]), add(lc, [2, -20]), add(lc, [-2, 4]), add(lc, [6, 16]), add(lc, [-10, 16])], '#0c0a0e');
  f.part([add(lc, [2, -20]), add(lc, [10, -20]), add(lc, [10, 2]), add(lc, [4, -4])], { fill: '#9a98a8', shadow: '#3a3842', shade: 0.3, inkW: 0.9, cast: false, hatch: false, opacity: 0.7 }); // a shard of glass left
  for (const x of [-14, 14]) f.line([add(lc, [x, -26]), add(lc, [x * 1.1, 22])], 2.6, INK);
  f.part([add(lc, [-18, 20]), add(lc, [18, 20]), add(lc, [16, 28]), add(lc, [-16, 28])], TIN({ cast: false }));

  // ---- far leg and arm
  X.mLeg(f, HF, KF, AF, [78, 56, 38], COAT({ fill: '#3e3a34' }), { sfx: '_f', bare: false });
  X.bootRig(f, KF, AF, 52, '#2e2620', '_f', { tex: 'mottle' + sd, shaft: 0.6, toe: 1.12 });
  X.mArm(f, SF, EF, WF, [44, 38, 28], COAT({ fill: '#3e3a34', shade: 0.28 }), { sfx: '_f', bare: false });
  f.bone('hand_f');
  X.openHand(f, WF, 1.25, 50, { look: SKN({ fill: mix(skin, '#000', 0.15) }), back: true, curl: 0.5, spread: 0.06, flip: true });

  // ---- torso: a patched coat; the frame's straps over the shoulders; the shell fused over the shoulder blade
  f.bone('torso');
  const TOR = S.shape([[0, 0.4, 0.34], [0.12, 0.66, 0.5], [0.38, 0.66, 0.52], [0.62, 0.56, 0.48], [0.86, 0.56, 0.5], [1.04, 0.6, 0.56]]);
  f.part(TOR, COAT());
  X.wear(f, TOR, 5, { hem: false });
  X.clipDraw(f, TOR, () => {
    for (const v of [0.3, 0.55, 0.78]) f.stroke([S.at(-0.5, v), S.at(0, v + 0.05), S.at(0.45, v)], 2.4, '#16140f', { op: 0.5 });
    const pc = S.at(-0.2, 0.5), pt = [add(pc, [-20, -16]), add(pc, [16, -20]), add(pc, [22, 14]), add(pc, [-16, 18])]; f.part(pt, COAT({ fill: '#5e584e', cast: false, inkW: 1 })); f.stitches([...pt, pt[0]], '#b8a888', 0.8);
  });
  // the shell's lip fused over his back and shoulder, the skin round it swollen and blistered
  const LIP = [S.at(-0.7, -0.04), S.at(-0.2, -0.12), S.at(0.12, 0.02), S.at(-0.1, 0.16), S.at(-0.54, 0.3), S.at(-0.74, 0.5), S.at(-0.82, 0.2)];
  f.part(X.lumpy(f, LIP, 4), CPR({ fill: '#2a1e16' }));
  X.verdigris(f, S.at(-0.4, 0.12), 20, 12, 4, 0.7);
  const SW = [S.at(0.12, 0.02), S.at(0.28, 0.12), S.at(0.2, 0.24), S.at(-0.1, 0.2)];
  f.part(X.lumpy(f, SW, 3), SKN({ fill: mix(skin, '#b08070', 0.3), shade: 0.3 }));
  X.pustules(f, S.at(0.1, 0.14), 14, 8, 4, 2.4, 4, { col: mix(P.skin, '#e0d0b0', 0.4) });
  for (const u of [-0.3, 0.2]) f.part([S.at(u - 0.08, -0.06), S.at(u + 0.08, -0.04), S.at(u + 0.12, 0.6), S.at(u - 0.04, 0.6)], APR({ fill: '#2a2018', cast: false, inkW: 1.2 })); // the frame's shoulder straps
  // ---- belt gear: a pouch of rivets, the solder pot, tongs, the stake anvil
  f.bone('pelvis');
  f.part([S.at(-0.6, 0.9), S.at(0.0, 0.95), S.at(0.58, 0.9), S.at(0.6, 0.99), S.at(0.0, 1.03), S.at(-0.6, 0.99)], APR({ fill: '#221a12', k: 0.5 }));
  const rp = S.at(-0.5, 1.0);
  f.part([add(rp, [-12, 0]), add(rp, [12, 0]), add(rp, [16, 24]), add(rp, [0, 34]), add(rp, [-14, 24])], APR({ fill: '#5a4636' }));
  for (let i = 0; i < 4; i++) f.rivet(add(rp, [-6 + i * 4, -2 - (i % 2) * 3]), 2);
  const tg = S.at(-0.24, 1.0);
  for (const s2 of [-1, 1]) f.part(limb(tg, add(tg, [s2 * 6 - 4, 80]), 6, 5, { steps: 6 }), X.IR(f, { cast: false }));
  f.rivet(add(tg, [0, 14]), 3); f.part([add(tg, [-6, 76]), add(tg, [6, 78]), add(tg, [0, 92])], X.IR(f, { cast: false }));
  const sa0 = S.at(-0.72, 0.92);
  f.part([add(sa0, [-14, 6]), add(sa0, [14, 6]), add(sa0, [12, 30]), add(sa0, [-12, 30])].map(q => [...q, 1]), X.IR(f, { fill: '#2e2e30' })); // the solder pot
  f.part(ell(add(sa0, [0, 6]), 14, 4, 0, 12), X.IR(f, { cast: false })); f.line([add(sa0, [-14, 8]), add(sa0, [-4, -12]), add(sa0, [8, -12]), add(sa0, [14, 8])], 2, INK);
  f.flat(ell(add(sa0, [0, 6]), 10, 2.6, 0, 10), '#7a7a80');

  // ---- near leg: forward, the weight over the toes; a burn from the knee where the frame's end strap rubbed
  X.mLeg(f, HN, KN, AN, [82, 58, 40], COAT({ fill: '#46413a' }), { sfx: '_n', bare: false, after: (th, sh) => { const pt = [th(0.5, -0.2), th(0.48, 0.3), th(0.74, 0.32), th(0.76, -0.22)]; f.part(pt, COAT({ fill: '#5a5248', cast: false, inkW: 1 })); f.stitches([...pt, pt[0]], '#b8a888', 0.8); } });
  X.bootRig(f, KN, AN, 54, '#3a3028', '_n', { tex: 'mottle' + sd, shaft: 0.6, toe: 1.12 });
  f.bone('shin_n'); X.fern(f, X.mchain([KN, AN], [[[[0, 28], [1, 20]], [[0, 28], [1, 20]]]]), lerp(KN, AN, 0.1), 1.6, 120, 1.4, { cloth: true, depth: 2 });

  // ---- leather apron hanging plumb off the bent body, scorched and pocked
  f.bone('apron');
  const aw0 = S.at(-0.05, 0.9), aw1 = S.at(0.6, 0.86);
  const AP = [aw0, aw1, [aw1[0] + 14, 700], ...X.hemLine(f, [aw1[0] + 16, 742], [aw0[0] + 6, 754], 6, 8), [aw0[0] + 4, 700]];
  f.part(AP, APR());
  X.wear(f, AP, 5, { dust: '#8a7a64' });
  X.clipDraw(f, AP, () => { for (const k of [0.25, 0.55, 0.8]) { const a = lerp(aw0, aw1, k); f.stroke([add(a, [2, 20]), add(a, [6, 90]), add(a, [8 + k * 6, 150])], 2.4, '#100c08', { op: 0.55 }); } for (let i = 0; i < 6; i++) X.scorch(f, [R(f, aw0[0], aw1[0] + 10), R(f, 640, 740)], R(f, 5, 10), R(f, 4, 8), 0.5); });
  f.line([aw1, S.at(-0.3, 0.88), S.at(-0.62, 0.9)], 2.4, '#2a2018'); // the apron string round him
  f.part(ell(lerp(aw0, aw1, 0.5), 9, 6, 0, 8), APR({ fill: '#2a2018', cast: false })); // its pocket button
  // ---- head: the soot-streaked face under a leather cap, teeth gritted, hair standing out under it
  f.bone('head');
  const nk = add(HC, rot([-12, 42], hA));
  f.part(limb(add(N0, [-4, 6]), nk, 52, 44, { steps: 4 }), SKN());
  const hF = X.pHead(f, HC, H, hA, { skin, jaw: 1.12, chin: 0.02, nose: 1.15, hook: 0.0, clench: true, mouth: 'set', squint: 0.6, browDown: 0.12, age: true, hairCol: '#3a3028', beard: 'stubble', beardCol: '#2a241e' });
  X.clipDraw(f, hF(ell([0.02, 0.0], 0.42, 0.56, 0, 16)), () => { for (const q of [[[0.0, -0.3], [0.1, 0.1], [0.06, 0.4]], [[0.2, -0.1], [0.26, 0.2]], [[-0.1, 0.1], [-0.16, 0.4]]]) f.stroke(hF(q), H * 0.05, '#1a1410', { op: 0.35 }); }); // soot streaks
  X.stiffMane(f, hF, Math.PI * 0.62, Math.PI * 1.05, 0.26, '#4a3e32', { n: 6, r: 0.42 });
  X.stiffMane(f, hF, Math.PI * 1.7, Math.PI * 1.86, 0.2, '#4a3e32', { n: 2, r: 0.42 });
  // the leather cap, close on the skull, its lappet turned up, scorched
  const CP = hF([[-0.46, -0.04], [-0.44, -0.34], [-0.24, -0.56], [0.06, -0.6], [0.3, -0.48], [0.4, -0.28], [0.36, -0.2], [0.1, -0.28], [-0.2, -0.24], [-0.34, -0.06]]);
  f.part(CP, APR({ fill: '#3e3024' }));
  f.line(hF([[-0.1, -0.58], [-0.04, -0.3]]), 1.2, INK, { op: 0.6 }); f.stitches(hF([[-0.14, -0.56], [-0.08, -0.3]]), '#a89070', 0.8);
  f.part(hF([[0.36, -0.2], [0.44, -0.3], [0.46, -0.2], [0.38, -0.14]]), APR({ fill: '#2e2418', cast: false })); // the turned-up peak
  X.scorch(f, hF([[0.0, -0.46]])[0], 12, 8, 0.4);

  // ---- near arm: hanging forward with the small hammer, the burn running down from the strap at the shoulder
  X.mArm(f, SN, EN, WN, [48, 40, 30], COAT({ shade: 0.28 }), { sfx: '_n', bare: false });
  f.bone('forearm_n');
  const fa = X.mArm(f, lerp(EN, WN, 0.4), lerp(EN, WN, 0.7), WN, [34, 31, 27], SKN(), {});
  X.fern(f, fa.pts, lerp(EN, WN, 0.42), ang(EN, WN), 80, 1.8, { depth: 3 });
  f.part(K.ragLimb(f, lerp(EN, SN, 0.05), lerp(EN, WN, 0.45), 48, 42, { depth: 7, teeth: 5 }), COAT({ fill: '#56514a' }));
  f.bone('hammer');
  const hd = [468, 640];
  f.part(limb(add(WN, [-14, 2]), hd, 10, 9, { steps: 6 }), X.WD(f, { fill: P.hazel, light: P.hazelL, shadow: P.hazelD }));
  f.part([add(hd, [-6, -24]), add(hd, [8, -26]), add(hd, [12, -10]), add(hd, [10, 22]), add(hd, [2, 30]), add(hd, [-6, 22])], X.IR(f));
  f.line([add(hd, [4, -22]), add(hd, [6, 20])], 1.2, P.ironL, { op: 0.6 }); f.part(ell(add(hd, [4, 28]), 6, 3, 0, 8), X.IR(f, { fill: '#6a6a70', cast: false }));
  f.bone('hand_n');
  X.gripK(f, WN, EN, ang(WN, hd), 22, skin, { tex: 'mottle' + sd, shadow: '#36282c', name: 'tinker hammer' });

  f.bone('root');
  f.flat(ell([320, gy + 2], 200, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ ROAD-WARDEN (cast, human 1.05, a twelve-foot pike)
// A road-warden stiff at attention, a twelve-foot pike upright in the near hand, its butt grounded beside his foot and its
// head far above his own. Weight even on both locked legs. The strike came down the pike: the head melted into a fused
// lump, the langets welded to the shaft; the burn runs down the shaft into his hand (hand fused to the wood) and branches
// in ferns over his whole body to his feet, where the boots have burst at the soles; hair stands out under the kettle hat.
// Venom locks him at attention with the jaw clenched; the hive has built grey paper comb inside his open brigandine.
// Canvas 600 x 1400 at the game's one pixel scale, so the pike's true length fits (GUIDE 2).
// Rig: standard humanoid + pike (hand_n) + lantern (pelvis). Motion: idle a rigid stand with small twitches; attack a
// stiff pike thrust (the pike tips forward about the fist, the arm drives: pike, upperarm_n, forearm_n, torso).
function roadWarden() {
  const seed = 1028, h = 1400;
  const f = new Fig(X.base(seed, h, { grimeY: 1200 }));
  X.texturesX(f);
  const H = 100, gy = f.o.groundY, sd = seed;
  const skin = mix(P.skin, '#8a6a52', 0.3), SKN = (o = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: '#3a2c30' }, o));
  const CNV = (o = {}) => X.CLK(f, Object.assign({ fill: '#2e2c32', shadow: '#0e0d10', light: '#5e5a68', tex: 'weave' + sd, texOp: 0.45 }, o)); // chitin black canvas
  const HOSE = (o = {}) => X.CLK(f, Object.assign({ fill: '#4a4640', shadow: '#16140f', light: '#7a746a', tex: 'weave' + sd, texOp: 0.5 }, o));
  const ST = (o = {}) => Object.assign({ fill: '#58585e', shadow: '#16161a', light: '#9a9aa4', shade: 0.42, tex: 'pit' + sd, texOp: 0.6 }, o); // steel
  const Pv = [290, 1022], N0 = [302, 822];
  const S = B.spine(N0, [292, 920], Pv, H);
  const HC = [314, 762], hA = 0.0;
  const SN = [282, 852], EN = [306, 960], WN = [370, 936];
  const SF = [318, 844], EF = [326, 950], WF = [334, 1046];
  const HN = [306, 1030], KN = [314, 1182], AN = [318, 1324];
  const HF = [276, 1026], KF = [278, 1180], AF = [270, 1322];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const pB = [374, gy - 2], pT = [384, 150], pa = ang(pB, pT);
  f.joint('pike', WN, 'hand_n').joint('lantern', S.at(-0.6, 1.0), 'pelvis');

  // ---- far leg and arm: locked straight at attention
  X.mLeg(f, HF, KF, AF, [80, 56, 38], HOSE({ fill: '#3a3630' }), { sfx: '_f', bare: false, after: (th, sh) => X.wear(f, [th(0, -1), th(0, 1), sh(1, 1), sh(1, -1)], 4) });
  X.bootRig(f, KF, AF, 54, '#2a2622', '_f', { tex: 'mottle' + sd, shaft: 0.9, toe: 1.12 });
  f.bone('foot_f'); f.flat([[AF[0] + 6, gy - 6], [AF[0] + 60, gy - 6], [AF[0] + 58, gy - 1], [AF[0] + 8, gy - 1]], '#0a0808'); // the sole burst away
  X.mArm(f, SF, EF, WF, [46, 40, 30], CNV({ fill: '#24222a', shade: 0.28 }), { sfx: '_f', bare: false });
  f.bone('hand_f'); X.knuckleFist(f, WF, ang(EF, WF), 22, '#3a3028', { tex: 'wrinkle' + sd, shadow: '#120e0a', nail: '#3a3028' }); // the scorched glove
  X.scorch(f, WF, 16, 12, 0.5);

  // ---- torso: the brigandine (riveted plates under chitin-black canvas), open at the front with comb built inside it
  f.bone('torso');
  const SH = S.shape([[0, 0.38, 0.34], [0.14, 0.62, 0.52], [0.4, 0.6, 0.56], [0.66, 0.54, 0.5], [0.9, 0.56, 0.52], [1.04, 0.6, 0.56]]);
  f.part(SH, HOSE({ fill: '#5a564c' })); // the arming shirt under it
  // the comb in the open front, wasps at the opening
  const CMB = [S.at(0.18, 0.12), S.at(0.5, 0.2), S.at(0.58, 0.5), S.at(0.54, 0.86), S.at(0.3, 0.92), S.at(0.16, 0.6)];
  X.comb(f, X.lumpy(f, CMB, 4), { cell: 12 });
  const BR = S.shape([[0.02, 0.42, 0.1], [0.14, 0.66, 0.2], [0.4, 0.64, 0.24], [0.66, 0.58, 0.2], [0.9, 0.6, 0.22], [1.12, 0.66, 0.26]]);
  f.part(BR, CNV());
  X.wear(f, BR, 5, { hem: false, dust: '#7a7684' });
  X.clipDraw(f, BR, () => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) { const v = 0.1 + r * 0.11, u = -0.58 + c * 0.16; if (f.r() < 0.08) continue; f.rivet(S.at(u + (r % 2) * 0.06, v), 2.4, '#8a8a90'); } // the plate rivets in rows
    for (let r = 0; r < 9; r++) f.line([S.at(-0.66, 0.06 + r * 0.11), S.at(0.24, 0.08 + r * 0.11)], 1, '#08080a', { op: 0.45 }); // the plates' lapped edges under the cloth
    f.stroke([S.at(-0.6, 0.1), S.at(-0.66, 0.6), S.at(-0.6, 1.0)], 3, '#5e5a68', { op: 0.3 });
    X.fern(f, BR, S.at(0.0, 0.08), 1.5, 220, 2.2, { cloth: true, depth: 3 });
  });
  // the front panel's edge and a second panel gapping across the comb, both with rivet rows
  const FP = [S.at(0.42, 0.14), S.at(0.62, 0.2), S.at(0.66, 0.5), S.at(0.62, 0.88), S.at(0.52, 0.92), S.at(0.5, 0.5)];
  f.part(FP, CNV({ fill: '#26242c' }));
  for (let r = 0; r < 6; r++) f.rivet(S.at(0.56, 0.24 + r * 0.12), 2.2, '#8a8a90');
  X.miniWasp(f, S.at(0.36, 0.3), -1.2, 0.55); X.miniWasp(f, S.at(0.44, 0.62), 0.4, 0.5); X.miniWasp(f, S.at(0.24, 0.8), 2.2, 0.5, { wings: false }); X.miniWasp(f, S.at(0.7, 0.4), -0.4, 0.5);
  // the warden's badge on a chain round the neck, the horn on its baldric
  const bd = S.at(0.2, 0.22);
  X.chainLinks(f, [S.at(-0.2, 0.0), lerp(S.at(-0.2, 0.0), bd, 0.5), bd], 7, P.iron);
  f.part([add(bd, [-12, 0]), add(bd, [12, 0]), add(bd, [14, 14]), add(bd, [0, 30]), add(bd, [-14, 14])], ST({ cast: false, inkW: 1.3 }));
  f.line([add(bd, [-6, 6]), add(bd, [6, 6])], 1.4, INK, { op: 0.6 }); f.line([add(bd, [0, 4]), add(bd, [0, 22])], 1.4, INK, { op: 0.6 }); // a cross of the road
  f.part([S.at(-0.5, -0.02), S.at(-0.36, -0.06), S.at(0.5, 0.86), S.at(0.38, 0.9)], X.CLK(f, { fill: '#3a2c20', shadow: '#120c08', tex: 'wrinkle' + sd, cast: false, inkW: 1.2 })); // the baldric
  // ---- belt: shackles, the short sword, the horn
  f.bone('pelvis');
  f.part([S.at(-0.62, 0.92), S.at(0.0, 0.96), S.at(0.62, 0.92), S.at(0.64, 1.0), S.at(0.0, 1.04), S.at(-0.62, 1.0)], X.CLK(f, { fill: '#221a12', shadow: '#0c0806', k: 0.5 }));
  f.part([S.at(0.04, 0.92), S.at(0.16, 0.92), S.at(0.16, 1.02), S.at(0.04, 1.02)].map(q => [...q, 1]), ST({ cast: false, inkW: 1 }));
  const hn = S.at(0.46, 0.98);
  f.part([add(hn, [-30, -6]), add(hn, [-6, -10]), add(hn, [14, -4]), add(hn, [26, 8]), add(hn, [20, 14]), add(hn, [-4, 6]), add(hn, [-30, 6])], { fill: '#8a7c62', shadow: '#3a2e1e', light: '#c8b896', shade: 0.42, tex: 'growth' + sd, texOp: 0.6, inkW: 1.3 });
  f.part(ell(add(hn, [24, 10]), 6, 9, 0.3, 10), { fill: '#5a4a32', shade: 0.4, inkW: 1.1, cast: false });
  for (const x of [-18, 4]) f.part([add(hn, [x, -8]), add(hn, [x + 5, -8]), add(hn, [x + 5, 8]), add(hn, [x, 8])].map(q => [...q, 1]), ST({ cast: false, inkW: 1 }));
  const sh0 = S.at(-0.12, 1.0);
  for (const dx of [-12, 12]) { const c = add(sh0, [dx, 28]); f.line(ell(c, 11, 9, 0, 12).concat([ell(c, 11, 9, 0, 12)[0]]), 5, INK); f.line(ell(c, 11, 9, 0, 12).concat([ell(c, 11, 9, 0, 12)[0]]), 3, P.ironL); }
  X.chainLinks(f, [add(sh0, [-12, 18]), add(sh0, [0, 4]), add(sh0, [12, 18])], 6, P.iron);
  const sw = S.at(-0.5, 0.98), swT = add(sw, [-40, 210]);
  f.part(limb(sw, swT, 18, 12, { steps: 6, capK: 0.4 }), X.CLK(f, { fill: '#2a2018', shadow: '#0c0806', tex: 'wrinkle' + sd, cast: false })); // the scabbard
  f.part(limb(add(sw, [8, -40]), add(sw, [2, 0]), 9, 9, { steps: 3 }), X.WD(f, { cast: false }));
  f.part(limb(add(sw, [-18, -2]), add(sw, [22, 2]), 8, 8, { steps: 3 }), ST({ cast: false }));
  f.part(ell(add(sw, [9, -44]), 7, 6, 0, 8), ST({ cast: false }));
  // ---- the lantern on its belt hook, behind the hip
  f.bone('lantern');
  const lc = add(S.at(-0.6, 1.0), [-14, 46]);
  f.line([S.at(-0.6, 1.0), add(lc, [0, -34])], 3, INK);
  f.part([add(lc, [-16, -28]), add(lc, [16, -28]), add(lc, [12, -36]), add(lc, [0, -42]), add(lc, [-12, -36])], ST({ cast: false }));
  f.part([add(lc, [-14, -28]), add(lc, [14, -28]), add(lc, [16, 20]), add(lc, [-16, 20])].map(q => [...q, 1]), ST({ fill: '#2a2a2e' }));
  f.flat([add(lc, [-10, -22]), add(lc, [10, -22]), add(lc, [11, 14]), add(lc, [-11, 14])], '#4a4654', { op: 0.8 }); f.flat([add(lc, [-6, -18]), add(lc, [0, -18]), add(lc, [-2, 8]), add(lc, [-8, 8])], '#8a86a0', { op: 0.35 }); // horn panes, dull
  for (const x of [-14, 14]) f.line([add(lc, [x, -28]), add(lc, [x * 1.1, 20])], 2.6, INK);
  f.part([add(lc, [-18, 18]), add(lc, [18, 18]), add(lc, [16, 26]), add(lc, [-16, 26])], ST({ cast: false }));

  // ---- near leg: locked; the boot burst open at the sole, toes out, scorched
  X.mLeg(f, HN, KN, AN, [84, 58, 40], HOSE({ fill: '#4a453e' }), { sfx: '_n', bare: false, after: (th, sh) => { X.wear(f, [th(0, -1), th(0, 1), sh(1, 1), sh(1, -1)], 5); const pt = [th(0.55, -0.3), th(0.52, 0.2), th(0.76, 0.24), th(0.78, -0.26)]; f.part(pt, HOSE({ fill: '#5e584c', cast: false, inkW: 1 })); f.stitches([...pt, pt[0]], '#b8a888', 0.8); } });
  X.bootRig(f, KN, AN, 56, '#2e2924', '_n', { tex: 'mottle' + sd, shaft: 0.9, toe: 1.12 });
  f.bone('foot_n');
  f.flat([[AN[0] - 14, gy - 10], [AN[0] + 66, gy - 12], [AN[0] + 66, gy - 2], [AN[0] - 14, gy - 2]], '#0a0808'); // the sole torn away
  for (let i = 0; i < 4; i++) f.part(ell([AN[0] + 34 + i * 8, gy - 6], 5, 4, 0, 8), SKN({ fill: mix(skin, '#4a3a3a', 0.3), cast: false, inkW: 0.9 }));
  X.scorch(f, [AN[0] + 20, gy - 14], 30, 10, 0.5);
  // the fern over his whole body: down both legs to the feet
  for (const [Hp, Kn, A, sfx] of [[HN, KN, AN, '_n'], [HF, KF, AF, '_f']]) { f.bone('shin' + sfx); X.fern(f, X.mchain([Kn, A], [[[[0, 28], [1, 22]], [[0, 28], [1, 22]]]]), Kn, ang(Kn, A), 150, 1.6, { cloth: true, depth: 2 }); f.bone('thigh' + sfx); X.fern(f, X.mchain([Hp, Kn], [[[[0, 38], [1, 28]], [[0, 38], [1, 28]]]]), Hp, ang(Hp, Kn), 150, 1.8, { cloth: true, depth: 2 }); }

  // ---- head: a set face, eyes wide, jaw clenched; hair standing out under the scorched kettle hat
  f.bone('head');
  const nk = add(HC, rot([-8, 44], hA));
  f.part(limb(add(N0, [-2, 4]), nk, 52, 46, { steps: 4 }), SKN());
  f.stroke([add(N0, [-12, 2]), add(nk, [-14, 0])], 6, '#3a2c30', { op: 0.4 }); // the neck corded with the spasm
  const hF = X.pHead(f, HC, H, hA, { skin, jaw: 1.14, chin: 0.03, nose: 1.05, hook: 0.1, clench: true, mouth: 'set', squint: 0.08, browDown: -0.05, age: true, hairCol: '#3a3028', beard: 'stubble', beardCol: '#2e2620', eyeWhite: '#b0a898' });
  X.fern(f, hF(ell([0.0, 0.0], 0.38, 0.56, 0, 16)), hF([[-0.24, 0.4]])[0], hA - 1.0, 50, 1.3, { depth: 2 });
  X.stiffMane(f, hF, Math.PI * 0.72, Math.PI * 1.04, 0.3, '#4a4036', { n: 6, r: 0.42 });
  // the kettle hat: a steel dome with a raised comb and a broad sloping brim, scorched black where the strike passed
  const KH = hF([[-0.36, -0.3], [-0.32, -0.56], [-0.14, -0.72], [0.12, -0.72], [0.3, -0.58], [0.36, -0.3]]);
  f.part(KH, ST());
  f.line(hF([[-0.12, -0.72], [0.0, -0.76], [0.14, -0.72]]), 3, '#9a9aa4', { op: 0.5 });
  const BRM = hF([[-0.74, -0.14], [-0.4, -0.32], [0.0, -0.34], [0.42, -0.3], [0.76, -0.12], [0.8, -0.04], [0.42, -0.18], [0.0, -0.22], [-0.4, -0.2], [-0.78, -0.06]]);
  f.part(BRM, ST({ fill: '#4e4e56' }));
  f.line(hF([[-0.7, -0.08], [-0.3, -0.21], [0.3, -0.2], [0.74, -0.06]]), 1.6, '#a8a8b2', { op: 0.5 });
  for (let i = 0; i < 7; i++) f.rivet(hF([[-0.3 + i * 0.1, -0.32]])[0], 1.8, '#8a8a90');
  X.scorch(f, hF([[0.1, -0.6]])[0], 22, 16, 0.6); X.clipDraw(f, KH, () => X.burn(f, hF([[0.06, -0.72]])[0], 1.9, 60, 1.4, { depth: 2 }));
  f.part(X.lumpy(f, ell(hF([[0.3, -0.1]])[0], 6, 4, 0, 8), 1), ST({ fill: '#2a2a30', cast: false })); // a dent fused to a bead

  // ---- near arm: forearm forward to the pike, the hand fused to the wood
  X.mArm(f, SN, EN, WN, [50, 42, 32], CNV({ shade: 0.28 }), { sfx: '_n', bare: false });
  f.bone('upperarm_n'); for (let i = 0; i < 3; i++) f.rivet(lp(SN, EN, 0.2 + i * 0.22, 8), 2.2, '#8a8a90'); // the brigandine's sleeve plates
  f.bone('pike');
  // the ash shaft, worn pale at his grip, scorched in a spiral down from the head; the langets welded on; the head melted
  f.part(limb(pB, pT, 16, 14, { steps: 16, capK: 0.5 }), X.WD(f, { fill: '#5a4a38', light: '#8a765a' }));
  f.line([lp(pB, pT, 0.02, -4), lp(pB, pT, 0.98, -3)], 1, '#9a8668', { op: 0.6, straight: true });
  f.part(limb(add(pB, [0, 4]), lp(pB, pT, 0.02, 0), 17, 16, { steps: 3 }), X.IR(f, { cast: false })); // the butt spike's socket
  X.clipDraw(f, limb(pB, pT, 17, 15, { steps: 16 }), () => { for (let i = 0; i < 7; i++) { const t = 0.55 + i * 0.06 + R(f, -0.02, 0.02); X.scorch(f, lp(pB, pT, t, R(f, -4, 4)), R(f, 6, 9), R(f, 16, 40), 0.35, pa); } f.stroke([lp(pB, pT, 0.99, 3), lp(pB, pT, 0.8, -4), lp(pB, pT, 0.6, 2)], 5, '#141210', { op: 0.5 }); X.burn(f, lp(pB, pT, 0.98, 0), pa + Math.PI, 700, 1.8, { depth: 2, fork: 0.5 }); });
  for (const s2 of [-1, 1]) f.part([lp(pB, pT, 0.86, s2 * 6), lp(pB, pT, 0.86, s2 * 9), lp(pB, pT, 1.0, s2 * 10), lp(pB, pT, 1.0, s2 * 6)], X.IR(f, { cast: false, inkW: 1.1 })); // langets
  for (let i = 0; i < 4; i++) f.rivet(lp(pB, pT, 0.88 + i * 0.03, 0), 2, '#6a6a70');
  const ph = add(pT, [2, -24]);
  const HEAD = X.lumpy(f, [add(ph, [-22, 16]), add(ph, [-26, -10]), add(ph, [-14, -40]), add(ph, [-4, -70]), add(ph, [6, -54]), add(ph, [20, -34]), add(ph, [26, -6]), add(ph, [20, 18]), add(ph, [4, 26])], 4);
  f.part(HEAD, ST({ fill: '#3a3a40', light: '#8a86a0' }));
  X.clipDraw(f, HEAD, () => { X.scorch(f, ph, 22, 30, 0.5); f.flat(ell(add(ph, [6, -30]), 6, 14, 0.2, 10), mix(P.vioL, '#9a9aa4', 0.5), { op: 0.55 }); X.burn(f, add(ph, [0, -40]), 1.6, 70, 1.6, { depth: 2 }); });
  for (const q of [[-20, 20], [18, 22], [-8, 26]]) X.fusedRun(f, add(ph, q), R(f, 10, 22), 5, '#5a5a62'); // the head ran down over the langets and set
  f.bone('hand_n');
  X.gripK(f, WN, EN, -Math.PI / 2, 23, '#3a3028', { tex: 'wrinkle' + sd, shadow: '#120e0a', nail: '#3a3028', name: 'warden pike' });
  X.scorch(f, add(WN, [8, 0]), 14, 16, 0.55);
  f.part(X.lumpy(f, ell(add(WN, [12, -2]), 6, 16, 0, 10), 1.5), { fill: '#1a1614', light: '#5a5060', shade: 0.4, inkW: 1, cast: false, hatch: false }); // the glove charred into the wood

  f.bone('root');
  f.flat(ell([300, gy + 2], 170, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ SPIRE TERMITES (cast, small 0.6)
// A cone of grey clay, half built round a traveller's sword stuck point-down in the road, its hilt out of the tip; a few
// hundred termites swarm over it and a column of workers streams in. Pale soft workers carry clay pellets; big-headed
// soldiers with black heads and venom-green mandible tips stand at the openings, their heads swollen with venom glands.
// Lightning struck the hilt: the crossguard fused and drooping, the clay round it baked glassy and branched with ferns.
// Rig: cone (root) + hilt (cone) + swarm (cone) + column (cone) + soldier_1..3 (cone, rear and spray) + alate (cone).
// Motion: idle the swarm building (swarm, column); attack the soldiers rear and spray at a hero's legs (soldier_n).
function termite(f, c, a, s, kind, o = {}) {
  const F = frame(c, a, s), soft = kind === 'worker' || kind === 'alate';
  const body = { fill: soft ? '#c8bea8' : '#b8ae98', shadow: '#5a5244', light: '#e8e0cc', shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false };
  const leg = (b, k, t) => { f.line(F([b, k]), 2.4 * s, INK); f.line(F([k, t]), 1.7 * s, INK); f.flat(F(ell(k, 1.1, 1.1, 0, 5)), '#2a2420'); };
  for (const sg of [1, -1]) { leg([2, sg * 2], [4, sg * 8], [10, sg * 11]); leg([-1, sg * 2], [-3, sg * 9], [-1, sg * 13]); leg([-4, sg * 2], [-9, sg * 7], [-13, sg * 11]); }
  // the abdomen: soft, segmented, swelling to the rear; the thorax in two plates
  f.part(F([[-3, -3.5], [-10, -5], [-17, -4], [-20, 0], [-17, 4], [-10, 5], [-3, 3.5]]), body);
  for (const x of [-7, -11, -15]) f.line(F([[x, -4], [x - 0.6, 4]]), 0.7, '#6a6250', { op: 0.7 });
  f.part(F(ell([0, 0], 3.6, 3, 0, 8)), body);
  if (kind === 'soldier') {
    // a long dark head capsule, swollen at the back with the venom gland, and long hooked mandibles tipped venom green
    f.part(F([[3, -4], [6, -6.5], [16, -6], [20, -3.5], [20, 3.5], [16, 6], [6, 6.5], [3, 4]]), { fill: '#1e1c22', shadow: '#060608', light: '#6a6678', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
    // the venom glands swelling the back of the head: two dull olive lobes straining the cuticle apart along the suture
    for (const sg of [-1, 1]) f.part(F([[3, sg * 0.6], [4, sg * 6.4], [10, sg * 7.2], [16, sg * 5.6], [12, sg * 1.2]]), { fill: mix(P.ven, '#1e1c22', 0.62), shadow: '#0c0e08', light: mix(P.ven, '#6a6678', 0.5), shade: 0.45, inkW: 0.9, cast: false, hatch: false }); // review: dulled and stretched along the head so the lobes read as swelling, not as eyes
    f.line(F([[4, 0], [16, 0]]), 1.2 * s, '#060608'); f.line(F([[5, -5], [14, -5.8]]), 0.8 * s, '#9a9aa8', { op: 0.4 });
    for (const sg of [1, -1]) { f.stroke(F([[19, sg * 2], [25, sg * 3], [29, sg * 1], [30, -sg * 1.4]]), 2.6 * s, '#141216'); f.stroke(F([[27.5, sg * 2.2], [29.5, sg * 0.6], [30, -sg * 1.4]]), 2 * s, P.venL); }
    f.line(F([[20, -4], [24, -10], [27, -12]]), 0.8 * s, INK); // antenna
  } else {
    f.part(F(ell([5.5, 0], 3.6, 3.4, 0, 10)), Object.assign({}, body, { fill: '#a89c82' }));
    f.line(F([[8, -2], [12, -6], [15, -6]]), 0.7 * s, INK);
    if (o.pellet) f.part(F(ell([10.5, 0], 3.2, 3, 0, 8)), { fill: P.clayL, shadow: P.clayD, shade: 0.4, inkW: 0.8, cast: false, hatch: false });
  }
  if (kind === 'alate') for (const sg of [-1, 1]) { const wg = F([[2, sg * 1.5], [-6, sg * 8], [-34, sg * 7], [-38, sg * 3], [-10, sg * 1]]); f.flat(wg, '#c8c2d6', { op: 0.45 }); f.line(wg.concat([wg[0]]), 0.8, INK, { op: 0.7 }); f.line(F([[0, sg * 2], [-34, sg * 5]]), 0.6, INK, { op: 0.5 }); }
}
function spireTermites() {
  const seed = 1029, h = TIERS.small[1];
  const f = new Fig(X.base(seed, h, { grimeY: 700 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const CL = (o = {}) => Object.assign({ fill: P.clay, shadow: P.clayD, light: P.clayL, shade: 0.4, tex: 'mottle' + sd, texOp: 0.55 }, o);
  f.joint('cone', [300, gy], null).joint('hilt', [300, 470], 'cone').joint('swarm', [300, 640], 'cone').joint('column', [120, gy - 10], 'cone').joint('alate', [250, 560], 'cone');
  const SOL = [[236, 700, -2.6], [352, 612, -0.5], [298, 520, -1.4]];
  SOL.forEach((q, i) => f.joint('soldier_' + (i + 1), [q[0], q[1]], 'cone'));

  // ---- the road under it: a few cobbles, dust; the dead traveller's glove half built into the cone's foot
  f.bone('cone');
  for (const [x, w] of [[96, 60], [168, 70], [444, 66], [520, 56]]) f.part([[x - w / 2, gy + 2], [x - w / 2 + 6, gy - 12], [x + w / 2 - 4, gy - 14], [x + w / 2, gy + 2]], { fill: P.stone, shadow: P.stoneD, light: P.stoneL, shade: 0.4, tex: 'pit' + sd, texOp: 0.6, inkW: 1.2, cast: false });
  // the glove lies palm-down, fingers out toward the road, its cuff swallowed by the cone
  const GL = [[396, gy - 2], [402, gy - 22], [424, gy - 30], [446, gy - 26], [452, gy - 10], [440, gy - 2]];
  f.part(GL, X.CLK(f, { fill: P.leath, shadow: P.leathD, light: P.leathL, tex: 'wrinkle' + sd }));
  for (let i = 0; i < 4; i++) { const b = [446 + i * 1.5, gy - 24 + i * 6], t = add(b, [24 - Math.abs(i - 1.5) * 4, 3 + i]); f.part(limb(b, t, 8, 7, { steps: 3, capK: 0.9 }), X.CLK(f, { fill: mix(P.leath, '#000', i * 0.08), shadow: P.leathD, light: P.leathL, cast: false, inkW: 1 })); f.line([lerp(b, t, 0.5), add(lerp(b, t, 0.5), [0, 3])], 0.9, INK, { op: 0.6 }); }
  f.part(limb([424, gy - 26], [438, gy - 34], 9, 8, { steps: 3 }), X.CLK(f, { fill: P.leath, shadow: P.leathD, cast: false, inkW: 1 })); // the thumb
  f.stitches([[410, gy - 18], [430, gy - 24], [446, gy - 20]], '#a8906c', 0.8);
  // ---- the cone: lumpy courses of pellets with buttress ribs, chimneys, openings; baked glassy at the top
  const CONE = X.lumpy(f, [[154, gy], [176, 730], [196, 680], [214, 630], [228, 580], [244, 530], [262, 492], [280, 470], [320, 468], [338, 488], [354, 530], [366, 580], [384, 630], [402, 680], [422, 730], [446, gy]], 5);
  f.part(CONE, CL());
  X.clipDraw(f, CONE, () => {
    // pellet courses: rows of small lumps, lit on top
    for (let y = gy - 8; y > 470; y -= 9) for (let x = 150; x < 450; x += 11) { const p = [x + R(f, -3, 3) + ((y / 9) % 2) * 5, y + R(f, -2, 2)]; f.flat(ell(add(p, [0, 1.6]), 5, 3, 0, 6), P.clayD, { op: 0.5 }); f.flat(ell(add(p, [-0.6, -0.8]), 3.6, 2, 0, 6), P.clayL, { op: 0.45 }); }
    // buttress ribs running up the cone, with shadow beside each
    for (const [b, t] of [[[196, gy], [272, 490]], [[266, gy], [290, 476]], [[350, gy], [316, 476]], [[420, gy], [340, 500]]]) { f.stroke([b, lerp(b, t, 0.5), t], 14, P.clayL, { op: 0.35 }); f.stroke([add(b, [10, 0]), add(lerp(b, t, 0.5), [8, 0]), add(t, [5, 0])], 8, P.clayD, { op: 0.5 }); }
    f.flat([[140, gy - 40], [460, gy - 40], [460, gy + 4], [140, gy + 4]], '#26221c', { op: 0.35 });
    // the baked glassy top round the hilt, with ferns burnt into the clay
    f.flat(X.lumpy(f, ell([300, 482], 66, 40, 0, 16), 6), P.glassD, { op: 0.7 });
    f.flat(X.lumpy(f, ell([302, 478], 48, 26, 0, 14), 5), P.glass, { op: 0.7 });
    f.flat(ell([292, 470], 20, 8, -0.2, 10), P.glassL, { op: 0.4 });
    X.burn(f, [300, 494], 2.2, 130, 2, { depth: 3 }); X.burn(f, [310, 494], 0.9, 120, 1.8, { depth: 3 });
    X.scorch(f, [300, 500], 60, 30, 0.35);
  });
  // ventilation chimneys standing off the cone's shoulder, each with a dark flue
  for (const [x, y, hh, lean] of [[220, 650, 40, -0.25], [382, 610, 46, 0.2], [256, 566, 30, -0.15]]) {
    const F2 = frame([x, y], lean, 1), CH2 = F2([[-17, 12], [-13, -hh * 0.5], [-11, -hh], [-6, -hh - 4], [3, -hh - 1], [9, -hh - 5], [13, -hh], [14, -hh * 0.5], [18, 12]]);
    f.part(X.lumpy(f, CH2, 2), CL());
    f.flat(X.lumpy(f, F2(ell([0, -hh - 1], 7, 3.2, 0, 10)), 1), '#0c0a0a');
    for (let k = 0; k < 3; k++) f.line(F2([[-14, -k * hh * 0.3], [15, -k * hh * 0.3 - 2]]), 1, P.clayD, { op: 0.5 });
  }
  // openings: ragged dark mouths in the clay (soldiers' heads fill them)
  for (const [c, rx, ry] of [[[236, 708], 16, 11], [[352, 618], 14, 10], [[298, 528], 12, 9], [[408, 734], 12, 8]]) { f.flat(X.lumpy(f, ell(c, rx, ry, 0, 10), 2), '#0c0a0c'); f.line(ell(c, rx, ry, 0, 10).slice(5, 10), 1.6, P.clayL, { op: 0.6 }); }
  // the glove's cuff built over with clay
  f.part(X.lumpy(f, [[380, gy], [392, gy - 40], [410, gy - 44], [420, gy - 20], [418, gy]], 3), CL());

  // ---- the sword: the hilt out of the tip, the grip's leather charred, the crossguard fused and drooping, the pommel
  f.bone('hilt');
  const g0 = [300, 476], g1 = [304, 400];
  f.part(limb(add(g0, [0, 30]), g0, 22, 20, { steps: 3 }), X.IR(f, { fill: '#2a2a2e' })); // the blade's root in the glass
  const XG = [[246, 486], [262, 474], [300, 470], [340, 472], [356, 480], [360, 498], [352, 508], [346, 492], [320, 486], [284, 488], [258, 494], [250, 512], [242, 506]];
  f.part(X.lumpy(f, XG, 1.5), X.IR(f, { fill: '#3a3a40', light: '#8a86a0' }));
  for (const q of [[250, 508], [356, 504]]) X.fusedRun(f, q, 16, 5, '#5a5a62');
  f.flat(ell([330, 478], 10, 3, 0, 8), mix(P.vioL, '#9a9aa4', 0.5), { op: 0.6 });
  f.part(limb(g0, g1, 18, 16, { steps: 6 }), X.CLK(f, { fill: '#2a201a', shadow: '#0a0806', tex: 'wrinkle' + sd }));
  for (let i = 0; i < 6; i++) f.line([lerp(g0, g1, 0.1 + i * 0.15).map((v, j) => v + (j ? 0 : -9)), lerp(g0, g1, 0.16 + i * 0.15).map((v, j) => v + (j ? 0 : 9))], 1.4, '#0a0806', { op: 0.7 }); // wire wrap
  f.part(X.lumpy(f, ell(add(g1, [1, -12]), 15, 13, 0, 12), 1.5), X.IR(f, { fill: '#46464c', light: '#9a96aa' }));
  X.clipDraw(f, ell(add(g1, [1, -12]), 15, 13, 0, 12), () => X.burn(f, add(g1, [2, -24]), 1.6, 40, 1.4, { depth: 1 }));
  f.flat(ell(add(g1, [-4, -18]), 5, 3, -0.4, 8), '#c4c0d4', { op: 0.5 });

  // ---- the swarm: workers carrying pellets up the cone, the alate, the column of workers streaming in at the foot
  f.bone('swarm');
  for (let i = 0; i < 70; i++) {
    const y = R(f, 500, gy - 10), half = 30 + (y - 470) / (gy - 470) * 150, x = 300 + R(f, -half, half) * 0.92;
    termite(f, [x, y], -Math.PI / 2 + R(f, -0.9, 0.9), R(f, 0.55, 0.75), 'worker', { pellet: f.r() < 0.5 });
  }
  f.bone('column');
  for (let i = 0; i < 16; i++) { const t = i / 15, p = [40 + t * 150 + R(f, -4, 4), gy - 6 - Math.sin(t * Math.PI) * 10 - t * 12]; termite(f, p, 0.05 - t * 0.3 + R(f, -0.2, 0.2), 0.7, 'worker', { pellet: i % 3 === 0 }); }
  f.bone('alate');
  termite(f, [254, 580], -0.4, 1.0, 'alate');
  // ---- soldiers at the openings: black heads out of the mouths, one rearing at the cone's mouth
  SOL.forEach(([x, y, a], i) => { f.bone('soldier_' + (i + 1)); termite(f, [x, y], a, i === 0 ? 1.9 : 1.5, 'soldier'); });
  f.bone('cone');
  for (let i = 0; i < 4; i++) X.drip(f, [R(f, 220, 380), R(f, 600, 740)], 0.6, P.venL);

  f.bone('root');
  f.flat(ell([300, gy + 2], 200, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ ANTLION (cast, large 1.2 high and 1.8 wide)
// A funnel pit in the sand verge with a raised crater lip of fused, glassy sand; from its bottom the antlion heaves its
// flat head and front up, the sickle jaws spread wide. The rest stays buried, its weight in the sand. A fat bristled
// larva: the strike fused the pit's sand into fulgurite, glass tubes and branching glassy roots out of the rim and out of
// the larva's own back, scorched where they enter (lightning); venom swells the jaw bases, the body puffy and pale,
// banded venom green (toxin). Canvas widened to 1250 at the game's pixel scale so the 1.8 width fits (GUIDE 2).
// Rig: crater (root) + body (pit bottom) + head (body) + jaw_n, jaw_f (head) + leg_n1, leg_n2, leg_f1 (body).
// Motion: idle sand trickling while the jaws open and close slowly; attack a flick of sand (head jerks up) that drags a
// hero into the pit (Pull, Paralyse).
function antlion() {
  const seed = 1030, w = 1250, h = 1100;
  const f = new Fig(X.base(seed, h, { grimeY: 2000 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const SAND = (o = {}) => Object.assign({ fill: '#7a7264', shadow: '#2e2a24', light: '#aca28e', shade: 0.4, tex: 'mottle' + sd, texOp: 0.6 }, o);
  const GLS = (o = {}) => Object.assign({ fill: mix(P.glass, '#7a7264', 0.6), shadow: '#2e2a2c', light: '#c4bcc8', shade: 0.42, tex: 'pit' + sd, texOp: 0.45 }, o);
  const LV = (o = {}) => Object.assign({ fill: P.adult, shadow: '#5a5846', light: P.adultL, shade: 0.38, tex: 'mottle' + sd, texOp: 0.5 }, o); // pale puffy larva
  const C0 = [600, 880], RX = 500, RY = 110;
  const HD = [820, 706], ha = -1.0, HF = frame(HD, ha, 1);
  const jbN = HF([[76, 44]])[0], jbF = HF([[76, -44]])[0], NK = [770, 770];
  f.joint('crater', [600, gy], null).joint('body', [600, 950], 'crater').joint('head', NK, 'body').joint('jaw_n', jbN, 'head').joint('jaw_f', jbF, 'head');
  const LEGS = { leg_f1: [[720, 770], [690, 720], [640, 760], [620, 830]], leg_f2: [[660, 800], [610, 770], [560, 820], [540, 890]], leg_n1: [[744, 830], [820, 840], [850, 900], [880, 950]], leg_n2: [[690, 870], [760, 900], [780, 950], [800, 1000]] };
  for (const [nm, J] of Object.entries(LEGS)) f.joint(nm, J[0], 'body');
  const rimPt = (t, k = 1) => add(C0, [Math.cos(t) * RX * k, Math.sin(t) * RY * k]);
  // a fulgurite: a crusted tube of fused sand, knobbly, glassy and white-violet where it is broken, one or two short
  // branches, scorched at its root
  const fulg = (b, a, L, wd, o = {}) => {
    X.scorch(f, b, wd * 1.8, wd * 1.1, 0.6);
    const go = (p, aa, l, ww, d) => {
      const pts = [p]; let q = p, ab = aa; for (let i = 0; i < 4; i++) { ab += R(f, -0.3, 0.3); q = add(q, rot([l / 4, 0], ab)); pts.push(q); }
      const Sx = X.spline(pts), out = X.lumpy(f, X.ribbon(Sx, t => ww * (1 - t * 0.45)), ww * 0.12);
      f.part(out, GLS({ inkW: 1.3, cast: false }));
      f.line(Sx.slice(1, -3).map(z => add(z, [ww * 0.2, -ww * 0.22])), Math.max(1.2, ww * 0.2), P.glassL, { op: 0.55 });
      for (let i = 1; i < 4; i++) f.flat(ell(add(pts[i], [R(f, -2, 2), R(f, -2, 2)]), ww * 0.22, ww * 0.16, ab, 6), '#3a3630', { op: 0.6 }); // sand crust grains
      const e = pts[pts.length - 1]; f.part(ell(e, ww * 0.42, ww * 0.3, ab, 10), { fill: P.glassL, shadow: P.glassD, shade: 0.3, inkW: 1, cast: false, hatch: false }); f.flat(ell(e, ww * 0.2, ww * 0.14, ab, 8), P.glassD); // the broken glassy end, hollow
      if (d > 0 && f.r() < 0.8) go(pts[2], ab + (f.r() > 0.5 ? 1 : -1) * R(f, 0.6, 1.0), l * R(f, 0.35, 0.5), ww * 0.55, d - 1);
    };
    go(b, a, L, wd, o.depth ?? 1);
  };

  // ---- the crater: the back lip raised and glazed, the funnel wall falling to the dark bottom
  f.bone('crater');
  const OUT = []; for (let i = 0; i <= 24; i++) OUT.push(add(rimPt(Math.PI + i * Math.PI / 24, 1.06), [0, -16 - Math.sin(i / 24 * Math.PI) * 30]));
  const BACK = [[0, gy], [0, C0[1] - 20], [C0[0] - RX - 70, C0[1] - 34], ...X.lumpy(f, OUT, 8), [C0[0] + RX + 70, C0[1] - 34], [w, C0[1] - 20], [w, gy]]; // the sand verge runs out flat on both sides: the pit is sunk in the ground
  f.part(BACK, SAND({ fill: '#6a6356' }));
  X.clipDraw(f, BACK, () => { for (let i = 0; i < 10; i++) { const x = C0[0] - RX + i * RX / 4.5; f.stroke([[x, C0[1] - RY - 10], [x - 30 + i * 6, C0[1] + 20]], 3, '#2e2a24', { op: 0.3 }); } });
  const FUN = []; for (let i = 0; i <= 24; i++) FUN.push(add(rimPt(Math.PI + i * Math.PI / 24, 0.97), [0, -10 - Math.sin(i / 24 * Math.PI) * 22])); FUN.push(add(C0, [RX * 0.6, 50]), add(C0, [0, 80]), add(C0, [-RX * 0.6, 50]));
  f.part(FUN, SAND({ fill: '#5a5448', shade: 0.25 }));
  X.clipDraw(f, FUN, () => {
    // the funnel's far wall: bands of shade deepening toward the bottom, sand slid down in runnels
    for (let k = 0; k < 4; k++) f.flat(ell(add(C0, [0, 40 + k * 8]), RX * (0.9 - k * 0.18), RY * (1.2 - k * 0.22) + 20, 0, 20), '#14120e', { op: 0.16 + k * 0.08 });
    for (let i = 0; i < 22; i++) { const t = Math.PI + (i + 0.5) * Math.PI / 22, a = add(rimPt(t, 0.95), [0, -14]), b = lerp(a, add(C0, [0, 70]), R(f, 0.55, 0.9)); f.line([a, add(lerp(a, b, 0.5), [R(f, -6, 6), 0]), b], R(f, 1, 2.4), i % 2 ? '#2a2620' : '#9a907e', { op: 0.5 }); }
    for (let i = 0; i < 80; i++) { const t = R(f, Math.PI * 1.05, Math.PI * 1.95), p = lerp(add(rimPt(t, 0.9), [0, -10]), add(C0, [0, 60]), R(f, 0, 0.85)); f.flat(ell(p, 1.4, 1.4, 0, 5), '#b8ae98', { op: 0.6 }); } // trickling grains
  });
  // the glazed back lip: sand fused into a knobbly glass crust, lit along its crest
  const GR = OUT.map(q => add(q, [0, 10]));
  const crust = (L, up) => { const out = X.lumpy(f, X.ribbon(L, t => 26 + 14 * Math.abs(Math.sin(t * Math.PI * 5.3)) + 6 * Math.sin(t * 31)), 7); f.part(out, GLS({ fill: mix(P.glass, '#8a8274', 0.7), shade: 0.2 })); X.clipDraw(f, out, () => { for (let i = 0; i < 18; i++) { const c = L[Math.floor(R(f, 0, L.length))]; f.flat(X.lumpy(f, ell(add(c, [R(f, -10, 10), up]), R(f, 8, 16), R(f, 4, 7), 0, 8), 2), f.r() < 0.6 ? P.glassL : P.glassD, { op: 0.45 }); } for (let i = 0; i < 30; i++) f.flat(ell(add(L[Math.floor(R(f, 0, L.length))], [R(f, -12, 12), R(f, -8, 8)]), 1.6, 1.4, 0, 5), '#2a2622', { op: 0.6 }); }); f.line(L.map(q => add(q, [0, up - 6])), 1.4, P.glassL, { op: 0.4 }); }; // the lip: sand fused into a knobbly glass crust, glazed in patches
  crust(GR, -8);
  for (let i = 0; i < 16; i++) { const p = add(GR[Math.floor(R(f, 1, 23))], [R(f, -10, 10), R(f, -8, 8)]); f.flat(ell(p, R(f, 4, 9), R(f, 3, 6), 0, 8), f.r() < 0.5 ? P.glassL : '#3a3630', { op: 0.45 }); }
  // the traveller's pack half sunk in the far slope, and the drained husk of a wasp
  const pk = add(C0, [-280, -50]);
  f.part([add(pk, [-44, 14]), add(pk, [-36, -30]), add(pk, [10, -46]), add(pk, [48, -28]), add(pk, [44, 16])], X.CLK(f, { fill: P.leath, shadow: P.leathD, light: P.leathL, tex: 'wrinkle' + sd }));
  f.part([add(pk, [-32, -28]), add(pk, [10, -42]), add(pk, [28, -30]), add(pk, [-12, -14])], X.CLK(f, { fill: P.leathD, cast: false }));
  f.line([add(pk, [-6, -38]), add(pk, [-22, -64]), add(pk, [-4, -74]), add(pk, [14, -42])], 3.4, P.leathD);
  f.part([add(pk, [-14, -6]), add(pk, [4, -8]), add(pk, [4, 6]), add(pk, [-14, 8])].map(q => [...q, 1]), X.IR(f, { cast: false }));
  f.flat([add(pk, [-56, 6]), add(pk, [56, 10]), add(pk, [50, 24]), add(pk, [-52, 22])], '#5a5448'); // sand over its foot
  X.miniWasp(f, add(C0, [220, -34]), 2.6, 1.1);
  f.flat(ell(add(C0, [216, -34]), 16, 7, 0.3, 10), '#e0d8c8', { op: 0.25 }); // the husk drained pale

  // ---- the larva, lying in the pit's bottom with its rear sunk into the far wall: a fat, flattened oval abdomen of
  // overlapping segment plates, bristly, pale and puffy and banded venom green; a narrow thorax; a small flat head
  // lifted at the front with two huge sickle mandibles spread wide; short thick legs braced in the sand.
  const legLook = X.CH(f, { fill: '#4a4236', light: '#8a826a', shadow: '#16140f' });
  const leg = (nm, far) => { const J = LEGS[nm]; f.bone(nm); X.ileg(f, [J[0], lerp(J[0], J[1], 0.3), J[1], J[2], J[3]], far ? 24 : 30, far ? X.CH(f, { fill: '#2e2a22', light: '#5a5444' }) : legLook, { spines: 3, hairs: 10, tib: 1.4, planted: true }); };
  leg('leg_f1', true); leg('leg_f2', true);
  f.bone('body');
  const AC2 = [400, 880], arx = 250, ary = 128, aa = -0.2, AF2 = frame(AC2, aa, 1);
  const ABO = AF2([[-250, 10], [-236, -50], [-190, -100], [-110, -128], [0, -132], [110, -124], [196, -96], [246, -50], [256, 0], [240, 54], [180, 100], [80, 126], [-40, 128], [-160, 110], [-226, 70]]);
  f.part(ABO, LV({ fill: mix(P.adult, '#9a9478', 0.15) }));
  X.clipDraw(f, ABO, () => {
    // the segment plates: seven tergites across the back, each a curved shell plate, its front margin lapping the one
    // behind it (lit edge, a shadow under the overlap), a venom-green band at its hind edge, punctures and bristles
    for (let i = 0; i < 7; i++) {
      const x0 = -250 + i * 72, x1 = x0 + 92, bow = 30 + Math.sin(i / 6 * Math.PI) * 18;
      const PLT = AF2([[x0, -140], [x0 + 20, -60], [x0 + 22, 20], [x0 + 10, 140], [x1 - 10, 140], [x1 + 8, 20], [x1 + 4, -60], [x1 - 14, -140]].map(([x, y]) => [x + Math.cos(y / 140 * 1.4) * bow * 0.0, y]));
      const cx = (x0 + x1) / 2, curve = y => -Math.pow(Math.abs(y) / 140, 2) * bow;
      const band = AF2([[x0 + curve(-130), -140], [x0 + 18 + curve(0), 0], [x0 + curve(130), 140], [x0 + 16 + curve(130), 140], [x0 + 34 + curve(0), 0], [x0 + 16 + curve(-130), -140]]);
      f.flat(band, mix(P.ven, P.adult, 0.3), { op: 0.9 }); // the green band at the hind edge of the plate in front
      const lipP = AF2([[x1 + curve(-130), -140], [x1 + 18 + curve(0), 0], [x1 + curve(130), 140]]);
      f.stroke(lipP.map(q => add(q, rot([10, 0], aa))), 12, '#000', { op: 0.32 }); // the shadow under the next plate's lapping margin
      f.line(lipP, 2.6, P.adultL, { op: 0.6 }); // its lit edge
      f.line(lipP.map(q => add(q, rot([-3, 0], aa))), 1.4, INK, { op: 0.7 });
      for (let k = 0; k < 5; k++) f.flat(ell(AF2([[cx + R(f, -26, 26), R(f, -110, 110)]])[0], 2, 1.6, 0, 5), '#3a3a28', { op: 0.6 });
      for (let k = 0; k < 9; k++) { const q = AF2([[cx + R(f, -30, 30), R(f, -120, 120)]])[0]; f.line([q, add(q, [R(f, -5, 5), -R(f, 8, 16)])], 1.3, '#2a2620', { op: 0.75 }); } // bristles over the plate
    }
    f.flat(AF2([[-260, 30], [260, 30], [260, 140], [-260, 140]]), '#000', { op: 0.2 }); // the flank turned down into the sand
    f.flat(AF2(ell([40, -80], 150, 30, 0, 14)), P.adultL, { op: 0.3 }); // the lit back
    f.line(AF2([[-230, 0], [-120, -6], [0, -4], [120, -8], [230, -2]]), 2, '#5a5a44', { op: 0.5 }); // the dorsal midline
  });
  X.pustules(f, AF2([[40, -40]])[0], 160, 60, 8, 5, 10, { burst: 0.3 });
  // bristle tufts standing off the rim of the oval (lightning stood them on end), clumped
  for (let i = 0; i < 22; i++) { const t = Math.PI * (1.05 + i / 21 * 0.95), q = AF2([[Math.cos(t) * 248, Math.sin(t) * 128]])[0], d = E.norm(sub(q, AC2)); for (let k = -1; k <= 1; k++) { const l = R(f, 14, 30); f.stroke([q, add(q, mul(rot(d, k * 0.2), l * 0.5)), add(q, mul(rot(d, k * 0.25), l))], 2.4, '#2a2620'); } }
  X.hole(f, AF2([[-60, -40]])[0], 8, 6, aa, { lip: P.adultL });
  fulg(AF2([[-120, -100]])[0], -2.3, 150, 20); fulg(AF2([[60, -110]])[0], -1.7, 120, 15); // the strike's glass roots out of its back
  // the thorax: three narrow plates, the prothorax a slim neck lifting the head
  for (const [c, rx2, ry2, a2] of [[[650, 830], 70, 80, -0.5], [[712, 790], 54, 62, -0.7], [[762, 744], 40, 48, -0.85]]) {
    const pl2 = X.lumpy(f, ell(c, rx2, ry2, a2, 16), 2);
    f.part(pl2, LV({ fill: mix(P.adult, '#8a8468', 0.25) }));
    X.clipDraw(f, pl2, () => { f.flat(ell(add(c, rot([rx2 * 0.5, 0], a2)), rx2 * 0.4, ry2 * 1.2, a2, 10), mix(P.ven, P.adult, 0.3), { op: 0.8 }); f.flat(ell(add(c, rot([-rx2 * 0.2, ry2 * 0.5], a2)), rx2, ry2 * 0.5, a2, 10), '#000', { op: 0.2 }); f.line(ell(c, rx2 * 0.9, ry2 * 0.9, a2, 16).slice(10, 15), 2, P.adultL, { op: 0.5 }); });
    for (let k = 0; k < 5; k++) { const q = add(c, rot([R(f, -rx2, rx2) * 0.8, -ry2 * 0.9], a2)); f.line([q, add(q, [R(f, -4, 4), -R(f, 10, 18)])], 1.6, '#2a2620'); }
  }
  // ---- the far mandible, behind the head
  const jaw = (b, a0, L, wd, bend) => { // a sickle mandible: broad at the base, curving in to a hooked point, three long teeth on its inner edge
    const Cc = []; for (let i = 0; i <= 14; i++) { const t = i / 14; Cc.push(add(b, rot([L * t * (1 - 0.18 * t * t), L * bend * (0.06 * Math.sin(t * Math.PI) + 0.62 * Math.pow(t, 2.3))], a0))); } // a sickle: straight from the base, hooking hard inward at the point
    const S2 = X.spline(Cc), J = X.ribbon(S2, t => wd * Math.pow(1 - t, 0.75) + 3);
    f.part(J, X.CH(f, { fill: '#5a4e3a', light: '#a8987a', shadow: '#14100a', tex: 'growth' + sd, texOp: 0.4 }));
    const AL = X.arcLen(S2), Lt = AL[AL.length - 1], sg = Math.sign(bend);
    for (const u of [0.3, 0.46, 0.6]) { const A = X.at(S2, AL, Lt * u), ww = (wd * Math.pow(1 - u, 0.75) + 3) / 2, bse = add(A.p, mul(A.n, sg * ww * 0.9)); f.part([add(bse, mul(A.d, -7)), add(bse, add(mul(A.n, sg * 34 * (1 - u * 0.6)), mul(A.d, 10))), add(bse, mul(A.d, 7))], { fill: '#d0c8b0', shadow: '#5a5444', shade: 0.4, inkW: 1, cast: false, hatch: false }); }
    f.line(S2.slice(2, -6).map((q, k) => add(q, mul(X.at(S2, AL, AL[k + 2]).n, -sg * wd * 0.22))), 2.4, '#b8a888', { op: 0.55 }); // the lit back of the blade
    for (let k = 0; k < 8; k++) { const A = X.at(S2, AL, Lt * (0.1 + k * 0.1)); const q = add(A.p, mul(A.n, -sg * wd * 0.4 * (1 - k * 0.1))); f.line([q, add(q, mul(A.n, -sg * 12))], 1.2, '#2a2620'); } // bristles along its back
    const tip = S2[S2.length - 1]; X.clipDraw(f, J, () => { f.flat(X.ribbon(S2.slice(-9), () => wd * 2), '#1a140e', { op: 0.55 }); }); X.clipDraw(f, J, () => X.burn(f, tip, Math.atan2(S2[S2.length - 8][1] - tip[1], S2[S2.length - 8][0] - tip[0]), 120, 1.8, { depth: 2 }));
    f.part(ell(tip, 4, 3, a0, 8), { fill: mix(P.glassL, '#fff', 0.1), shade: 0.3, inkW: 0.9, cast: false, hatch: false }); // the tip fused glassy
    f.part(X.lumpy(f, ell(add(b, rot([16, 0], a0)), 30, 22, a0, 12), 2), { ...X.VN(f), fill: mix(P.ven, P.adult, 0.3), shade: 0.4 }); // the base swollen with venom
    f.flat(ell(add(b, rot([8, -8], a0)), 12, 5, a0, 8), P.venP, { op: 0.5 });
    return tip;
  };
  f.bone('jaw_f'); jaw(jbF, ha - 1.15, 330, 42, 1.0);
  // ---- the head: small, flat and square, lifted at the front; dull eye tubercles on stalks at its corners
  f.bone('head');
  const HDP = HF([[-40, -40], [0, -54], [56, -56], [82, -40], [88, 0], [82, 40], [56, 56], [0, 54], [-40, 40], [-50, 0]]);
  f.part(HDP, X.CH(f, { fill: '#6a5e48', light: '#aa9a7a', shadow: '#2a2418', shade: 0.3, tex: 'growth' + sd, texOp: 0.5 }));
  X.clipDraw(f, HDP, () => { f.flat(HF([[-50, 10], [90, 14], [90, 60], [-50, 60]]), '#000', { op: 0.22 }); f.line(HF([[-30, -36], [40, -46], [80, -36]]), 2, '#a89e84', { op: 0.5 }); f.line(HF([[-30, 0], [20, -4], [80, 0]]), 1.6, INK, { op: 0.5 }); for (let k = 0; k < 10; k++) f.flat(ell(HF([[R(f, -40, 80), R(f, -50, 50)]])[0], 1.8, 1.8, 0, 5), '#1a1812', { op: 0.6 }); X.burn(f, HF([[70, -20]])[0], ha + Math.PI + 0.3, 80, 1.4, { depth: 2 }); });
  for (const q of [[30, -56], [30, 56]]) f.part(X.lumpy(f, HF(ell(q, 10, 7, 0, 10)), 1), { fill: '#1e1c18', shadow: '#060604', light: '#4a4638', shade: 0.4, tex: 'facet' + sd, texOp: 0.6, inkW: 1, cast: false }); // dull eye tubercles, no glint
  for (let i = 0; i < 12; i++) { const t = i / 11, q = HF([[-40 + t * 120, (i % 2 ? 1 : -1) * (48 + t * 8)]])[0], d = E.norm(sub(q, HD)); f.stroke([q, add(q, mul(d, 12)), add(q, add(mul(d, 22), [R(f, -3, 3), 0]))], 2.2, '#2a2620'); } // standing bristles
  f.bone('jaw_n'); jaw(jbN, ha + 0.72, 350, 46, -1.0);
  leg('leg_n2', false); leg('leg_n1', false);
  // ---- sand drifted over the larva's rear and flank: it lies half buried in the pit
  f.bone('crater');
  const DR = X.lumpy(f, [[120, 960], [180, 870], [250, 860], [330, 900], [420, 940], [520, 960], [600, 990], [560, 1020], [200, 1020]], 8);
  f.part(DR, SAND({ fill: '#6a6356', shade: 0.3 }));
  X.clipDraw(f, DR, () => { for (let i = 0; i < 40; i++) f.flat(ell([R(f, 140, 600), R(f, 880, 1010)], 1.4, 1.4, 0, 5), '#b8ae98', { op: 0.6 }); f.line([[190, 872], [260, 864], [340, 904], [430, 944], [540, 966]], 2, '#a8a08c', { op: 0.5 }); });
  for (let i = 0; i < 12; i++) { const q = [R(f, 200, 560), R(f, 860, 960)]; f.line([q, add(q, [R(f, -4, 4), R(f, 10, 30)])], 1.2, '#b8ae98', { op: 0.5 }); } // sand trickling off its back

  // ---- the near lip: a raised mound of glazed sand in front, fulgurites out of it, a cart wheel's iron rim half buried
  f.bone('crater');
  const NR = []; for (let i = 0; i <= 24; i++) NR.push(add(rimPt(i * Math.PI / 24, 1.0), [0, -6]));
  const NEAR = [[0, gy], [0, C0[1] + RY - 6], [C0[0] - RX - 60, C0[1] + RY - 16], ...X.lumpy(f, NR.slice().reverse(), 7), [C0[0] + RX + 60, C0[1] + RY - 16], [w, C0[1] + RY - 6], [w, gy]];
  f.part(NEAR, SAND());
  X.clipDraw(f, NEAR, () => { for (let i = 0; i < 12; i++) { const x = C0[0] - RX + i * RX / 5.5; f.stroke([[x, C0[1] + RY - 10], [x + R(f, -20, 20), gy]], 3, '#2e2a24', { op: 0.3 }); } f.flat([[0, gy - 26], [w, gy - 26], [w, gy + 4], [0, gy + 4]], '#1e1c18', { op: 0.35 }); });
  crust(NR.slice().reverse(), -6);
  for (let i = 0; i < 30; i++) { const t = R(f, 0.08, 0.92) * Math.PI, p = add(rimPt(t, 1.0), [0, -4]); f.line([p, add(p, [R(f, -8, 8), R(f, 20, 60)])], 1.2, '#b8ae98', { op: 0.5 }); } // sand trickling over the lip
  const wc = add(C0, [-240, 160]), wr = ell(wc, 110, 42, -0.12, 32).filter(q => q[1] < wc[1] + 4);
  f.line(wr, 17, INK); f.line(wr, 12, P.rust); f.line(wr.map(q => add(q, [0, -3])), 3, P.rustL, { op: 0.6 });
  for (const q of [wr[2], wr[Math.floor(wr.length / 2)], wr[wr.length - 3]]) f.rivet(q, 3, P.rustL);
  fulg(rimPt(Math.PI * 1.06, 1.0), -2.1, 160, 22); fulg(rimPt(Math.PI * 1.72, 1.0), -1.3, 120, 17); fulg(rimPt(Math.PI * 0.16, 1.0), -0.7, 150, 20); fulg(rimPt(Math.PI * 0.8, 1.0), -2.5, 110, 16); fulg(rimPt(Math.PI * 1.94, 1.0), -0.4, 96, 14);

  f.bone('root');
  f.flat(ell([600, gy + 2], 600, 9, 0, 24), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ ROAD CENTIPEDE (elite, 1.9 reared and 4 long)
// A giant centipede of the plain: the front third reared high and curved over the company, the rest lying in a long S
// across the ground, its legs low and splayed with the tips planted. Thirty segments of black chitin, each a domed
// tergite with a lit rim lapping the next and edged venom green, tapering at both ends; one pair of long, thick-based
// jointed legs per segment, each in its own phase so the row reads as a walking wave. A flat plated head with the
// forcipules (the venom claws) huge and hooked beneath it, and long segmented antennae swept back. A strike ran the
// length of its back and fused six middle segments into one rigid scorched section, ferns over the plates and the
// bristles standing (lightning); the venom glands at the claw bases are swollen and strain the head plates apart (toxin).
// Built on the reviewed Pit Crawler method (world_IV.js): the dorsal line is the spine, the cross-section runs down the
// normal (ventral: down on the lying length, forward on the reared third). Canvas 2200 x 1400 at the game's scale.
// Rig: body (root) + seg_b1..3 (the tail) + rear_1..3 (the reared third) + head + claw_n, claw_f + antenna_n, antenna_f.
// Motion: idle the antennae sweep while the legs ripple; attack a downward strike with the claws (rear_1..3 bow forward,
// head pitches down, claws close).
function roadCentipede() {
  const seed = 1023, w = 2200, h = 1400;
  const f = new Fig(X.base(seed, h, { grimeY: 3000 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed, NS = 30;
  const plateC = '#34323c', plateD = '#16151a', plateL = '#7a7690', rimC = '#22212a', pleura = '#4a4a3a', legC = '#2a2830', legL = '#6a6678', jointC = mix(P.ven, '#3a3a2a', 0.45), edge = mix(P.ven, P.chit, 0.25);
  const ctrl = [[60, 1176], [220, 1206], [420, 1186], [620, 1156], [820, 1186], [1020, 1210], [1220, 1200], [1400, 1166], [1540, 1080], [1640, 920], [1700, 740], [1730, 520], [1770, 320], [1850, 180], [1960, 210], [2030, 330]];
  const C = X.spline(ctrl, 3), S = X.arcLen(C), Lt = S[S.length - 1];
  const AT = u => X.at(C, S, Math.max(0, Math.min(1, u)) * Lt);
  const wOf = u => u < 0.12 ? 22 + 36 * Math.pow(u / 0.12, 0.6) : u > 0.93 ? 58 - (u - 0.93) * 150 : 58 + Math.sin(u * 13) * 1.5;
  const sideP = (u, k) => { const a = AT(u); return add(a.p, mul(a.n, (k + 1) * wOf(u))); };
  const BR = [['seg_b3', 0, 0.12, 'seg_b2'], ['seg_b2', 0.12, 0.26, 'seg_b1'], ['seg_b1', 0.26, 0.4, 'body'], ['body', 0.4, 0.62, null], ['rear_1', 0.62, 0.74, 'body'], ['rear_2', 0.74, 0.86, 'rear_1'], ['rear_3', 0.86, 1.01, 'rear_2']];
  const boneAt = u => BR.find(([, a, b2]) => u >= a && u < b2)[0];
  f.joint('body', AT(0.5).p);
  for (const [nm, a, b2, par] of BR) if (par) f.joint(nm, AT(nm.startsWith('seg_b') ? b2 : a).p, par);
  const neck = sideP(1, -0.1), A1 = AT(1), hd = E.norm(add(A1.d, [0.4, 0.9])), hn = [-hd[1], hd[0]];
  const HP = (x, y) => add(add(neck, mul(hd, x * 2.1)), mul(hn, y * 2.1)); // the head drawn large enough to read at sheet size
  f.joint('head', neck, 'rear_3').joint('claw_n', HP(20, 30), 'head').joint('claw_f', HP(14, 22), 'head').joint('antenna_n', HP(66, -6), 'head').joint('antenna_f', HP(60, -12), 'head');
  const FUSED = [13, 18], MISSING = [6, 9, 22];
  const LG = (o = {}) => ({ fill: legC, light: legL, shadow: '#08080a', shade: 0.42, tex: 'growth' + sd, texOp: 0.25, inkW: 1.2, inkHeavy: 2, cast: false, k: 0.85, ...o });
  const lseg = (a, b, wa, wb, look, last) => {
    const sp = limb(a, b, wa, wb, { steps: 8, capK: 0.5, p: [[0.32, 0.26, 0.32]] });
    f.part(sp, look);
    X.clipDraw(f, sp, () => { f.stroke([lp(a, b, 0.05, -wa * 0.42), lp(a, b, 0.5, -wa * 0.5), lp(a, b, 0.95, -wb * 0.42)], wa * 0.38, '#000', { op: 0.45 }); f.flat([lp(a, b, 0.02, wa * 0.48), lp(a, b, 0.98, wb * 0.48), lp(a, b, 0.98, wb * 0.12), lp(a, b, 0.02, wa * 0.1)], look.light, { op: 0.22 }); }); // rounded: dark under, lit above
    f.line([lp(a, b, 0.12, wa * 0.26), lp(a, b, 0.45, wa * 0.36), lp(a, b, 0.85, wb * 0.26)], Math.max(1.2, wb * 0.14), mix(look.light, '#fff', 0.2), { op: 0.75 });
    for (let k = 0; k < 2; k++) { const q = lp(a, b, 0.3 + k * 0.35, -wa * 0.48); f.line([q, add(q, mul(E.norm(sub(b, a)), wa * 0.4)).map((v, j) => v + (j ? wa * 0.3 : 0))], 1.2, INK, { op: 0.8 }); } // spines
    if (!last) f.part(limb(lp(a, b, 0.97, 0), add(b, mul(E.norm(sub(b, a)), wb * 0.3)), wb * 0.95, wb * 0.85, { steps: 2, capK: 0.3 }), { fill: jointC, shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false, gritOp: 0.2 });
  };
  const leg = (P2, ws, look, o = {}) => {
    const [c0, c1, k, an, tip] = P2;
    f.part(ell(c0, ws * 0.72, ws * 0.55, ang(c0, c1), 10), { ...look, fill: mix(look.fill, '#000', 0.2) });
    lseg(c0, c1, ws * 1.15, ws * 1.0, look); lseg(c1, k, ws * 1.0, ws * 0.66, look); lseg(k, an, ws * 0.62, ws * 0.36, look);
    for (const [j, r] of [[c1, ws * 0.5], [k, ws * 0.38]]) f.part(ell(j, r, r * 0.8, 0, 10), { ...look, fill: mix(look.fill, '#fff', 0.08), cast: false, inkW: 1 }); // the knobbed joints
    const d = E.norm(sub(tip, an)), nn = [-d[1], d[0]];
    f.part([add(an, mul(nn, ws * 0.22)), add(lerp(an, tip, 0.7), mul(nn, ws * 0.12)), [...tip, 1], add(lerp(an, tip, 0.7), mul(nn, -ws * 0.12)), add(an, mul(nn, -ws * 0.22))], { ...look, fill: '#0a090c' });
    if (o.planted) f.flat(ell(add(tip, [0, 1]), ws * 0.6, 2.4, 0, 8), '#0c0b0e', { op: 0.6 });
  };
  // leg geometry for segment i, in its own phase of the walking wave: on the floor the femur rises and splays, the knee
  // stands above the back on the far side, the tibia comes down and the claw bites the floor; a leg in its swing phase
  // is lifted clear. On the reared third the legs reach forward and curl.
  const legGeo = (i, far) => {
    const u = (i + 0.5) / NS, a = AT(u), wv = wOf(u), ph = i * 0.72, sw = Math.sin(ph), lift = Math.cos(ph) > 0.72;
    const L = wv * 2.6, ws = wv * 0.62 * (far ? 0.82 : 1); // a leg about 1.3 body depths long, a third of a depth thick at its base
    if (a.p[1] > gy - 300) { // on the floor (or near it): the femur splays out to the side, forward or back by phase
      const c0 = far ? sideP(u, 0.25) : sideP(u, 0.58), spread = sw * L * 0.55 + (u - 0.45) * L * 0.6;
      const c1 = add(c0, [sw * 10, far ? -10 : 10]);
      const k = add(c1, [spread * 0.7 + (far ? -6 : 10), far ? -L * 0.08 : -L * 0.3]);
      const an = [k[0] + spread * 0.6 + 8, lift ? gy - 70 : gy - (far ? 40 : 34)];
      return { P: [c0, c1, k, an, [an[0] + sw * 12 + 16, lift ? gy - 46 : gy - (far ? 22 : 4)]], planted: !lift, w: ws };
    }
    const up = Math.min(1, (u - 0.6) / 0.35), c0 = far ? sideP(u, -0.5) : sideP(u, 0.55);
    const out = E.norm(add(mul(a.n, 1), mul(a.d, 0.3 + sw * 0.25))), dn = E.norm(add(out, [0, 0.9]));
    const c1 = add(c0, mul(out, 16)), k = add(c1, add(mul(out, L * 0.5), mul(a.d, far ? -10 : 0))), an = add(k, mul(dn, L * 0.4)), tip = add(an, mul(E.norm(add(dn, mul(a.d, -0.9))), L * 0.22));
    return { P: [c0, c1, k, an, tip], planted: false, w: ws * (1 - up * 0.2) };
  };
  const antenna = (ctl2, w2) => { const P2 = X.spline(ctl2, 2), SS = X.arcLen(P2), L = SS[SS.length - 1], n = 30; for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, a = X.at(P2, SS, t0 * L).p, b = X.at(P2, SS, t1 * L - 1).p, ww = Math.max(2.4, w2 * (1 - t0 * 0.75)); f.part(limb(a, b, ww, ww * 0.85, { steps: 3, capK: 0.5 }), LG({ inkW: 0.9, inkHeavy: 1.2 })); f.line([lp(a, b, 0.2, ww * 0.3), lp(a, b, 0.7, ww * 0.25)], 0.9, legL, { op: 0.7 }); } };

  // ---- far antenna and far legs behind the body; the two long rear legs trailing; the shed skin on the tail
  f.bone('antenna_f'); antenna([HP(60, -12), HP(50, -70), HP(20, -120), HP(-30, -150), HP(-90, -160), HP(-150, -150)], 10);
  for (let i = 1; i < NS; i++) { const g = legGeo(i, true); f.bone(boneAt((i + 0.5) / NS)); leg(g.P, g.w, LG({ fill: '#18171c', light: '#45424e' }), { planted: g.planted }); }
  f.bone('seg_b3');
  const t0 = sideP(0.01, -0.2), t1 = sideP(0.01, 0.6);
  leg([t0, add(t0, [-14, -6]), add(t0, [-70, -40]), add(t0, [-140, -40]), add(t0, [-190, -24])], 12, LG({ fill: '#18171c' }));
  const SK = [add(t1, [10, -8]), add(t1, [-30, -20]), add(t1, [-70, -6]), add(t1, [-110, 24]), add(t1, [-118, 50]), add(t1, [-92, 40]), add(t1, [-60, 16]), add(t1, [-24, 6])];
  f.part(SK, { fill: '#b8b2a4', shadow: '#5a564c', light: '#e0dace', shade: 0.35, inkW: 1.1, cast: false, hatch: false, tex: 'wrinkle' + sd, texOp: 0.6 });
  for (let i = 1; i < 4; i++) f.line([lerp(SK[i], SK[8 - i], 0.1), lerp(SK[i], SK[8 - i], 0.9)], 0.9, INK, { op: 0.5 }); // the shed skin's old segment rings

  // ---- the body, tail to head: each tergite a domed shield with a lit rim, its posterior margin lapping the plate
  // behind; the pleural membrane under the rim with a sclerite; the plates' green edge; the fused section
  for (let i = 0; i < NS; i++) {
    const u0 = i / NS, u1 = (i + 1) / NS, um = (u0 + u1) / 2, ov = 0.36 / NS, st = 7, U = k => u0 - ov + (u1 - u0 + ov) * k / st, fused = i >= FUSED[0] && i <= FUSED[1];
    f.bone(boneAt(um));
    const pl = []; for (let k = 0; k <= st; k++) pl.push(sideP(U(k), 0.25)); for (let k = st; k >= 0; k--) pl.push(sideP(U(k), 0.98));
    f.part(pl, { fill: pleura, shadow: '#141410', shade: 0.4, tex: 'wrinkle' + sd, texOp: 0.6, inkW: 1, inkHeavy: 1.6 });
    f.part([sideP(um - 0.3 / NS, 0.48), sideP(um + 0.2 / NS, 0.45), sideP(um + 0.22 / NS, 0.72), sideP(um - 0.3 / NS, 0.74)], { fill: '#3a3a30', shade: 0.4, inkW: 0.9, cast: false, hatch: false });
    const rim = []; for (let k = 0; k <= st; k++) rim.push(sideP(U(k), -0.02)); rim.push(sideP(u1, 0.22)); for (let k = st; k >= 0; k--) rim.push(sideP(U(k), 0.34));
    f.part(rim, { fill: rimC, shadow: '#08080a', shade: 0.45, inkW: 1.2, inkHeavy: 2.2, cast: false });
    const top = []; for (let k = 0; k <= st; k++) top.push(sideP(U(k), -1 - Math.sin(k / st * Math.PI) * 0.12)); // the dome rises above the spine line
    top.push(sideP(u1 + 0.04 / NS, -0.6)); top.push(sideP(u1, -0.02));
    for (let k = st; k >= 1; k--) top.push(sideP(U(k), -0.02));
    top.push([...sideP(u0 - ov * 1.05, -0.12), 1]); top.push(sideP(u0 - ov * 1.5, -0.55)); top.push([...sideP(u0 - ov * 1.05, -0.95), 1]);
    f.part(top, { fill: fused ? '#22212a' : i % 3 === 1 ? mix(plateC, plateD, 0.18) : plateC, shadow: plateD, light: plateL, shade: 0.42, maxShade: 26, tex: 'growth' + sd, texOp: 0.45, inkW: 1.4, inkHeavy: 2.6, k: 0.85, castOp: 0.55 });
    X.clipDraw(f, top, () => {
      f.flat([sideP(u0 - ov * 2, -1.3), sideP(u0 + 0.16 / NS, -1.3), sideP(u0 + 0.16 / NS, 0.1), sideP(u0 - ov * 2, 0.1)], '#000', { op: 0.4 }); // the raised posterior margin in shadow
      f.line([sideP(u0 + 0.16 / NS, -1.0), sideP(u0 + 0.16 / NS, -0.1)], 1.8, plateL, { op: 0.6 }); // its lit lip
      f.flat(ell(sideP(um, -0.72), (u1 - u0) * Lt * 0.32, wOf(um) * 0.16, Math.atan2(AT(um).d[1], AT(um).d[0]), 10), '#a8a4c0', { op: 0.18 }); // the lit crown of the dome
      for (const kk of [-0.7, -0.34]) f.line([sideP(u0 + 0.3 / NS, kk), sideP(um, kk - 0.03), sideP(u1, kk)], 1.2, INK, { op: 0.45 }); // paramedian sutures
      for (let q = 0; q < 3; q++) f.flat(ell(sideP(u0 + (0.25 + f.r() * 0.6) / NS, -0.9 + f.r() * 0.8), 2.4, 1.8, 0, 6), '#0a090d', { op: 0.6 });
      if (i === 8) { f.line([sideP(u0 + 0.004, -0.95), sideP(um, -0.5), sideP(u0 + 0.01, -0.1)], 2.2, '#000'); f.line([sideP(u0 + 0.006, -0.93), sideP(um + 0.002, -0.48)], 1, '#c8c4d4', { op: 0.6 }); } // a cracked plate
      if (i === 24 || i === 4) X.burn(f, sideP(um, -0.9), Math.atan2(AT(um).d[1], AT(um).d[0]), 70, 1.4, { depth: 1 });
    });
    f.line([sideP(u0 - ov * 0.6, -0.04), sideP(um, -0.03), sideP(u1, -0.04)], 3, edge, { op: 0.9 }); // the venom-green edge of the plate
    f.line([sideP(u0 - ov * 0.6, -0.1), sideP(um, -0.09), sideP(u1, -0.1)], 1.2, mix(plateL, '#fff', 0.3), { op: 0.55 });
  }
  // the fused section: six plates welded rigid, the seams run over in bright metal, scorched, ferns, bristles standing
  f.bone('body');
  const fu0 = FUSED[0] / NS, fu1 = (FUSED[1] + 1) / NS, FS = [];
  for (let k = 0; k <= 16; k++) FS.push(sideP(fu0 + (fu1 - fu0) * k / 16, -1.12)); for (let k = 16; k >= 0; k--) FS.push(sideP(fu0 + (fu1 - fu0) * k / 16, -0.05));
  X.clipDraw(f, FS, () => {
    for (let s2 = FUSED[0]; s2 <= FUSED[1] + 1; s2++) { const u = s2 / NS; f.line([sideP(u, -1.1), sideP(u + 0.004, -0.5), sideP(u, -0.05)], 3, mix(P.copperL, P.vioL, 0.5), { op: 0.5 }); }
    for (let k = 0; k < 5; k++) X.scorch(f, sideP(R(f, fu0, fu1), R(f, -0.9, -0.3)), R(f, 30, 50), R(f, 18, 26), 0.5);
    X.burn(f, sideP(fu0, -0.8), Math.atan2(AT(fu0).d[1], AT(fu0).d[0]), (fu1 - fu0) * Lt * 0.9, 2.4, { depth: 3 });
  });
  for (let k = 0; k < 40; k++) { const u = R(f, fu0, fu1), p = sideP(u, -1.08), d = mul(AT(u).n, -1), l = R(f, 12, 26); f.stroke([p, add(p, mul(d, l * 0.5)), add(p, add(mul(d, l), [R(f, -3, 3), 0]))], 2.2, '#1a1820'); }
  // the cart's iron tyre jammed round a segment, rusted, biting into the plates
  const tu = 7.5 / NS, tyre = [sideP(tu - 0.004, -1.25), sideP(tu + 0.004, -0.5), sideP(tu + 0.004, 0.4), sideP(tu - 0.004, 1.05)];
  f.bone(boneAt(tu)); f.part(X.ribbon(X.spline(tyre), () => 20), X.RU(f)); f.line(X.spline(tyre).map(z => add(z, [3, 0])), 2, P.rustL, { op: 0.5 }); for (const z of [tyre[0], tyre[2]]) f.rivet(z, 3.4, P.rustL);

  // ---- the head: a flat cephalic plate with a green rim, its sutures, ocelli; the forcipules hooked beneath it
  const forcipule = (b, s, col, spread = 0.25) => {
    const F0 = frame(b, Math.atan2(hd[1], hd[0]) + spread, s);
    const look = { fill: col, shadow: '#08070a', light: '#8a86a0', shade: 0.42, inkW: 1.3, inkHeavy: 2.4, cast: false, tex: 'growth' + sd, texOp: 0.3 };
    // the coxosternite swollen by the venom gland: stretched pale-green membrane, veined, between dark plates
    const GL = X.lumpy(f, F0([[-14, -20], [14, -28], [40, -22], [50, 0], [40, 22], [10, 26], [-12, 16]]), 1.2);
    f.part(GL, { fill: mix(P.ven, '#3a3a2c', 0.4), shadow: '#141a0c', light: P.venL, shade: 0.45, inkW: 1.3, cast: false, tex: 'mottle' + sd, texOp: 0.5 });
    X.clipDraw(f, GL, () => { for (let k = 0; k < 4; k++) f.line(F0([[2 + k * 10, -20], [6 + k * 10, -4], [2 + k * 10, 18]]), 1, '#3a3450', { op: 0.6 }); f.flat(F0([[-14, -20], [44, -24], [40, -8], [-10, -6]]), plateC, { op: 0.9 }); f.line(F0([[-10, -8], [40, -10]]), 1.4, plateL, { op: 0.6 }); });
    // prefemur, femur, tibia: short ringed segments curving inward, the fang (tarsungula) last
    const J = F0([[40, 0], [62, 8], [80, 20], [94, 34]]), wsg = [22, 18, 15];
    for (let k = 0; k < 3; k++) { const sp = limb(J[k], J[k + 1], wsg[k], wsg[k] * 0.86, { steps: 4, capK: 0.6, p: [[0.4, 0.18, 0.3]] }); f.part(sp, look); f.line([lp(J[k], J[k + 1], 0.2, -wsg[k] * 0.24), lp(J[k], J[k + 1], 0.8, -wsg[k] * 0.2)], 1.4, look.light, { op: 0.7 }); f.part(ell(J[k + 1], wsg[k] * 0.36, wsg[k] * 0.3, 0, 8), { fill: jointC, shade: 0.4, inkW: 0.9, cast: false, hatch: false }); }
    const FANG = F0([[88, 26], [100, 30], [112, 46], [118, 66], [116, 88], [108, 104, 1], [106, 86], [100, 64], [90, 46], [84, 36]]);
    f.part(FANG, { ...look, fill: '#0c0b10', light: '#5a566a', shade: 0.4 }); // the fang: hooked, black and glossy
    f.line(F0([[100, 34], [112, 52], [114, 76], [110, 96]]), 1.8, '#a6a2bc', { op: 0.7 }); // its lit outer curve
    f.flat(ell(F0([[110, 88]])[0], 2.2, 1.6, 0, 6), P.venL, { op: 0.8 }); // the venom pore near the tip
    for (const x of [92, 100]) f.flat(F0([[x, 40], [x + 6, 40], [x + 2, 48]]), '#0a090c'); // inner teeth
    X.scorch(f, F0([[108, 96]])[0], 10, 8, 0.4); // the tip scorched
    return F0([[108, 104]])[0];
  };
  f.bone('claw_f'); forcipule(HP(10, 20), 1.9, '#22212a', -0.15);
  f.bone('head');
  f.part([HP(-4, 6), HP(34, 4), HP(46, 18), HP(36, 34), HP(4, 36), HP(-8, 22)], { fill: '#2a2830', shadow: '#0a0a0c', shade: 0.42, inkW: 1.2, inkHeavy: 2, cast: false });
  const headP = [HP(-10, -26), HP(14, -32), HP(44, -32), HP(66, -26), HP(80, -12), HP(82, 2), HP(72, 12), HP(46, 16), HP(16, 16), HP(-6, 12), HP(-14, -6)];
  f.part(headP, { fill: plateC, shadow: plateD, light: plateL, shade: 0.42, maxShade: 14, tex: 'growth' + sd, texOp: 0.4, inkW: 1.5, inkHeavy: 2.8 });
  X.clipDraw(f, headP, () => { X.burn(f, HP(30, -30), Math.atan2(hd[1], hd[0]) + 0.6, 80, 1.6, { depth: 2 }); f.flat([HP(-2, -16), HP(20, -26), HP(56, -26), HP(40, -20), HP(10, -14)], '#e8e4f8', { op: 0.18 }); });
  f.part([HP(-6, 8), HP(20, 12), HP(50, 12), HP(74, 8), HP(72, 16), HP(46, 22), HP(16, 22), HP(-6, 18)], { fill: rimC, shadow: '#08080a', shade: 0.45, inkW: 1.1, inkHeavy: 1.8, cast: false });
  f.line([HP(-10, -24), HP(30, -32), HP(66, -26), HP(80, -12)], 4, edge, { op: 0.9 }); // the green rim
  f.line([HP(4, -20), HP(30, -22), HP(60, -16)], 1.2, INK, { op: 0.45 }); f.line([HP(10, -6), HP(40, -6), HP(64, -2)], 1.2, INK, { op: 0.4 });
  f.part([HP(10, 16), HP(34, 14), HP(40, 24), HP(14, 26)], { fill: mix(P.ven, P.adult, 0.45), shadow: P.venD, shade: 0.35, inkW: 1.1, cast: false, hatch: false }); // the plates strained apart, pale membrane between
  for (const [x, y] of [[68, -8], [72, -3], [64, -3]]) f.flat(ell(HP(x, y), 2.6, 2.2, 0, 6), '#0a090c'); // ocelli, small and dull
  f.bone('antenna_n'); antenna([HP(66, -6), HP(84, -64), HP(70, -130), HP(30, -180), HP(-30, -210), HP(-100, -214)], 12);
  f.bone('claw_n');
  const ft = forcipule(HP(22, 26), 2.2, '#2e2c36', 0.55);
  f.part(ell(add(ft, [0, 6]), 4, 6, 0, 8), { fill: P.venL, shade: 0.4, inkW: 0.9, cast: false, hatch: false }); X.drip(f, add(ft, [0, 12]), 1.1, P.venL); // a drop held on the claw tip

  // ---- near legs in front, one bone each; the gear caught on them
  for (let i = 1; i < NS; i++) {
    const u = (i + 0.5) / NS, g = legGeo(i, false), nm = 'leg_' + i;
    f.joint(nm, g.P[0], boneAt(u)); f.bone(nm);
    if (MISSING.includes(i)) { f.part(limb(g.P[0], g.P[1], g.w * 1.05, g.w * 0.9, { steps: 3 }), LG()); f.part(ell(g.P[1], g.w * 0.4, g.w * 0.32, 0, 8), { fill: '#060608', shade: 0.3, inkW: 1, cast: false, hatch: false }); continue; } // a stump healed black
    leg(g.P, g.w, LG(), { planted: g.planted });
    if (i >= FUSED[0] && i <= FUSED[1]) { X.scorch(f, g.P[2], 14, 10, 0.6); f.flat(ell(g.P[2], 5, 4, 0, 8), P.vioL, { op: 0.5 }); }
    if (i === 3) { const tp = g.P[4]; f.part([add(tp, [-26, 2]), add(tp, [-20, -18]), add(tp, [4, -26]), add(tp, [22, -16]), add(tp, [26, 2])], X.CLK(f, { fill: P.leath, shadow: P.leathD, light: P.leathL, tex: 'wrinkle' + sd })); f.line([add(tp, [-24, -2]), add(tp, [24, -2])], 3, '#14100c'); } // a traveller's shoe on a leg tip
    if (i === 11) { const a0 = g.P[2], b0 = g.P[3]; f.part([add(a0, [-8, -6]), add(a0, [10, -2]), add(b0, [12, 4]), add(b0, [24, 30]), add(b0, [14, 34]), add(b0, [-2, 8])], X.CLK(f, { fill: '#4a3a2a', shadow: '#1a120c', tex: 'wrinkle' + sd, cast: false })); f.part([add(b0, [2, 6]), add(b0, [14, 4]), add(b0, [16, 16]), add(b0, [4, 18])].map(z => [...z, 1]), X.IR(f, { cast: false })); } // a scrap of harness strap
    if (i === 15) { const sp0 = lerp(g.P[2], g.P[3], 0.5); f.line([sp0, add(sp0, [16, -14])], 2.4, '#0c0b0e'); X.miniWasp(f, add(sp0, [18, -16]), -0.6, 0.9); } // a dead wasp on a leg spine
  }
  f.bone('seg_b3');
  leg([t1, add(t1, [-16, 4]), add(t1, [-80, -20]), add(t1, [-160, -10]), add(t1, [-214, 6])], 13, LG()); // the near rear leg, trailing like an antenna

  f.bone('root');
  f.flat(ell([900, gy + 2], 860, 10, 0, 24), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE COURIER (elite, 2.2 to the rider's head)
// A mounted courier of the plain roads and his horse, side-on: the horse's near foreleg raised mid-step and locked
// there by venom, the rider upright and stiff with the message tube held out at arm's length. Weight on the horse's three
// planted legs. The strike hit the rider and ran through him into the horse: one fern from his crown down his back,
// through the saddle, across the flank and down all four legs; stirrups and bit fused into the flesh; mane and hair
// stand stiff (lightning). Venom locks them: the horse's head pulled up stiff, its neck knotted in spasm and swollen where
// wasps nest in it, comb under the saddle flap; the rider's face slack and swollen (toxin). The bible's 2.2 to the
// rider's head puts horse and rider at 1.5 times life against the game's pixel scale; drawn at that scale (canvas
// 1900 x 1500, GUIDE 2) and flagged in the review.
// Rig: body (root, at the hips) + neck + head + tail + leg_<fn|ff|hn|hf>_1..3 + rider (body) + torso + head_r + the
// rider's arms (upperarm_n.. hand_n + tube, upperarm_f.. hand_f + crop) and near leg (thigh_n, shin_n, foot_n) + cloak.
// Motion: idle the horse twitching in spasm and the rider jerking with it; attack a trampling lunge (body pitches up,
// the raised foreleg strikes down).
function courier() {
  const seed = 1022, w = 1900, h = 1500;
  const f = new Fig(X.base(seed, h, { grimeY: 1260 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed, k = 1.5, H = 150;
  const HD = (o = {}) => Object.assign({ fill: P.horse, shadow: '#120e0c', light: P.horseL, shade: 0.42, maxShade: 40, tex: 'mottle' + sd, texOp: 0.5 }, o);
  const skin = mix(P.skin, '#a8a080', 0.2), SKN = (o = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: '#3e3238' }, o));
  const LTH = (o = {}) => X.CLK(f, Object.assign({ fill: '#3a3028', shadow: '#120c08', light: '#6e5e4a', tex: 'wrinkle' + sd, texOp: 0.5 }, o));
  const CLO = (o = {}) => X.CLK(f, Object.assign({ fill: '#4a4640', shadow: '#16140f', light: '#7a746a', tex: 'weave' + sd, texOp: 0.5 }, o));
  // ---- joints. Horse legs: T (top, inside the body), J1 (elbow or stifle), J2 (knee or hock), A (fetlock), C (coronet)
  const LG = {
    hf: { T: [560, 860], J1: [590, 980], J2: [512, 1200], A: [540, 1390], C: [552, 1428], far: true, hind: true },
    ff: { T: [1080, 880], J1: [1086, 1000], J2: [1098, 1196], A: [1090, 1388], C: [1100, 1428], far: true },
    hn: { T: [520, 850], J1: [548, 990], J2: [452, 1206], A: [480, 1392], C: [492, 1430], hind: true },
    fn: { T: [1110, 880], J1: [1120, 990], J2: [1236, 1110], A: [1206, 1262], C: [1176, 1296], raised: true },
  };
  const HIP = [560, 760], POLL = [1330, 360], hA = 0.58, hF = frame(POLL, hA, 1);
  f.joint('body', HIP, null).joint('neck', [1110, 700], 'body').joint('head', POLL, 'neck').joint('tail', [372, 660], 'body');
  for (const [nm, L] of Object.entries(LG)) f.joint(`leg_${nm}_1`, L.J1, 'body').joint(`leg_${nm}_2`, L.J2, `leg_${nm}_1`).joint(`leg_${nm}_3`, L.A, `leg_${nm}_2`);
  const RP = [860, 596], RN = [884, 306], RHC = [904, 226], rhA = -0.06;
  const SN = [868, 340], EN = [1026, 352], WN = [1178, 352], SF = [900, 336], EF = [930, 470], WF = [960, 560];
  const HN = [884, 606], KN = [980, 744], AN = [946, 916];
  f.joint('rider', RP, 'body').joint('torso', [866, 560], 'rider').joint('head_r', RN, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('tube', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('crop', WF, 'hand_f');
  f.joint('thigh_n', HN, 'rider').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n').joint('cloak', [850, 330], 'torso');

  // a horse leg: one outline from the body through the joints, knobbed at the knee or hock and the fetlock, a tendon down
  // the back of the cannon, the pastern and a heavy hoof with its iron shoe (o.cast: the shoe thrown, nail holes showing)
  const horseLeg = (nm) => {
    const L = LG[nm], far = !!L.far, look = HD(far ? { fill: mix(P.horse, '#000', L.hind ? 0.16 : 0.3), light: '#5a4e44' } : {});
    // one outline from inside the body to the coronet, with the horse's masses: the hind leg's thigh and gaskin bulging
    // behind and tapering hard to the hock (its point sticking back), the foreleg's forearm muscle swelling at the top
    // and tapering to a flat knee; a slim cannon with the tendon behind; a round knobbed fetlock; a sloping pastern
    const wA = 54, w2 = L.hind ? 66 : 60;
    const sc2 = (arr, w) => arr.map(([t, k]) => [t, k * w]);
    const P1 = L.hind ? [sc2([[0, 0.5], [0.4, 0.56], [1, 0.46]], 190), sc2([[0, 0.5], [0.5, 0.6], [1, 0.5]], 190)] : [sc2([[0, 0.5], [0.5, 0.52], [1, 0.48]], 150), sc2([[0, 0.5], [0.5, 0.5], [1, 0.46]], 150)];
    const P2 = L.hind ? [sc2([[0, 0.46], [0.3, 0.4], [0.7, 0.3], [1, 0.32]], 150), sc2([[0, 0.5], [0.3, 0.62], [0.6, 0.48], [0.85, 0.3], [1, 0.3]], 150)] : [sc2([[0, 0.5], [0.2, 0.58], [0.55, 0.42], [0.85, 0.3], [1, 0.32]], 120), sc2([[0, 0.5], [0.25, 0.54], [0.6, 0.4], [0.88, 0.3], [1, 0.32]], 120)];
    const P3 = [sc2([[0, 0.5], [0.15, 0.42], [0.5, 0.38], [0.85, 0.4], [1, 0.5]], w2), sc2([[0, 0.5], [0.15, 0.46], [0.5, 0.46], [0.85, 0.5], [1, 0.6]], w2)];
    const P4 = [sc2([[0, 0.5], [0.5, 0.42], [1, 0.42]], wA), sc2([[0, 0.56], [0.5, 0.46], [1, 0.5]], wA)];
    const pts = X.mchain([L.T, L.J1, L.J2, L.A, L.C], [P1, P2, P3, P4], { knob: [1.05, L.hind ? 1.45 : 1.3, 1.35] });
    const d2 = elb(L.J1, L.J2, L.A), d3 = elb(L.J2, L.A, L.C);
    split(f, () => {
      f.part(pts, look);
      X.clipDraw(f, pts, () => {
        f.stroke([lp(L.J2, L.A, 0.1, -w2 * 0.32), lp(L.J2, L.A, 0.9, -wA * 0.36)], 5, '#000', { op: 0.4 }); // the tendon down the cannon
        f.line([lp(L.J2, L.A, 0.15, w2 * 0.3), lp(L.J2, L.A, 0.85, wA * 0.3)], 2, P.horseL, { op: far ? 0.15 : 0.45 });
        f.stroke([lp(L.T, L.J1, 0.3, 30), lp(L.J1, L.J2, 0.2, 10), lp(L.J1, L.J2, 0.6, -6)], 5, '#000', { op: 0.3 }); // the muscle groove
        f.flat(ell(lp(L.J1, L.J2, 0.3, L.hind ? -20 : 10), 26, 60, ang(L.J1, L.J2) + Math.PI / 2, 12), far ? '#000' : P.horseL, { op: far ? 0.1 : 0.2 }); // the gaskin or forearm muscle, rounded to the light
        f.flat(ell(L.A, wA * 0.5, wA * 0.42, 0, 10), '#000', { op: 0.25 }); f.line([lp(L.A, L.J2, 0.04, wA * 0.4), add(L.A, [wA * 0.5, 4])], 2, P.horseL, { op: far ? 0.15 : 0.5 }); // the fetlock joint's round
        f.stroke([lp(L.J2, L.A, 0.0, -w2 * 0.2), lp(L.J2, L.A, 0.08, w2 * 0.1)], 4, '#000', { op: 0.35 }); // the crease at the hock or knee
        X.skinBurn(f, lerp(L.A, L.C, 0.4), ang(L.A, L.J2) + R(f, -0.1, 0.1), E.len(sub(L.J1, L.A)) * 0.9, far ? 2 : 2.6, { depth: 2 }); // the fern running up the leg from the shoe
        f.flat(ell([L.C[0], L.C[1] + 10], 70, 50, 0, 12), P.mud, { op: 0.3 });
      });
      for (let i = 0; i < 4; i++) { const q = lp(L.J2, L.A, 0.78 + i * 0.06, -wA * 0.5); f.stroke([q, add(q, [-10, 8]), add(q, [-16, 22])], 3, '#1a1410'); } // feather at the fetlock, standing stiff
      if (L.hind) { // director's callout: the hind cannons read too dark at sheet size; a cool rim down the back edge and the lit front edge lift them
        f.flat([lp(L.J2, L.A, 0.06, -w2 * 0.1), lp(L.J2, L.A, 0.94, -wA * 0.1), lp(L.J2, L.A, 0.94, -wA * 0.5), lp(L.J2, L.A, 0.06, -w2 * 0.5)], P.horseL, { op: far ? 0.22 : 0.3 }); // the cannon's front plane, catching the key
        f.line([lp(L.J2, L.A, 0.04, w2 * 0.4), lp(L.J2, L.A, 0.5, wA * 0.42), lp(L.J2, L.A, 0.96, wA * 0.44), lp(L.A, L.C, 0.4, wA * 0.42)], 5, '#b4aec8', { op: far ? 0.55 : 0.7 });
        f.line([lp(L.J2, L.A, 0.1, -w2 * 0.36), lp(L.J2, L.A, 0.9, -wA * 0.4)], 3, '#9a8a74', { op: far ? 0.45 : 0.6 });
        f.line([lp(L.J1, L.J2, 0.2, 60), lp(L.J1, L.J2, 0.7, 40), lp(L.J1, L.J2, 0.98, w2 * 0.5)], 3, '#a8a2bc', { op: far ? 0.35 : 0.45 }); // the rim on round the hock
      }
    }, [[`leg_${nm}_1`, side(L.J2, mul(d2, -1), w2 * 0.6)], [`leg_${nm}_2`, [side(L.J2, d2, w2 * 0.6), side(L.A, mul(d3, -1), wA * 0.6)]], [`leg_${nm}_3`, [side(L.J2, d2, w2 * 0.6), side(L.A, d3, wA * 0.6)]]]);
    f.bone(`leg_${nm}_3`);
    // pastern and hoof: planted (wall down to the ground) or raised (curled back, the sole showing, the shoe cast)
    const dP = E.norm(sub(L.C, L.A)), pa = Math.atan2(dP[1], dP[0]);
    const HFr = L.raised ? frame(L.C, pa - Math.PI / 2 + 0.5, 1) : frame([L.C[0] + 6, gy], 0, 1);
    const wall = L.raised ? HFr([[-30, -8], [30, -8], [36, 40], [-30, 46]]) : HFr([[-36, 0, 1], [42, 0, 1], [30, -24], [12, -46], [-20, -44], [-34, -26]]);
    f.part(wall, { fill: far ? '#1e1a16' : '#2e2824', shadow: '#060504', light: '#6e645a', shade: 0.4, tex: 'pit' + sd, texOp: 0.5 });
    X.clipDraw(f, wall, () => { for (let i = 0; i < 3; i++) f.line(L.raised ? HFr([[-30, 8 + i * 10], [34, 8 + i * 10]]) : HFr([[-34, -12 - i * 10], [36, -10 - i * 10]]), 1.2, '#000', { op: 0.5 }); });
    if (L.raised) { // the sole turned back: the frog, the bare horn where the shoe was cast, the nail holes
      const sole = HFr([[-30, 46], [36, 40], [40, 52], [0, 60], [-32, 56]]);
      f.part(sole, { fill: '#4a4238', shade: 0.3, inkW: 1.2, cast: false });
      for (const u of [-20, -4, 12, 26]) f.flat(ell(HFr([[u, 50]])[0], 2, 1.6, 0, 5), '#0a0808');
    } else {
      f.part(HFr([[-40, 0, 1], [46, 0, 1], [46, -9], [-40, -9]]), X.IR(f, { fill: '#2a2826', cast: false })); // the iron shoe
      for (const u of [-26, -4, 18, 36]) f.rivet(HFr([[u, -4]])[0], 1.8, '#6a645c');
      X.scorch(f, HFr([[0, -10]])[0], 34, 10, 0.5); X.fusedRun(f, HFr([[20, -10]])[0], 8, 4, '#4a4842');
    }
  };

  // ---- far legs, behind the body
  horseLeg('hf'); horseLeg('ff');
  // ---- the tail standing out stiff behind, coarse hanks fanned
  f.bone('tail');
  for (let i = 0; i < 16; i++) { const b0 = add([372, 660], [R(f, -6, 6), R(f, -10, 14)]), a = Math.PI + R(f, -0.35, 0.32), l = R(f, 160, 280); const m1 = add(b0, rot([l * 0.5, R(f, -8, 8)], a)), m2 = add(b0, rot([l, R(f, -10, 10)], a + R(f, -0.08, 0.08))); f.stroke([b0, m1, m2], R(f, 10, 18), i % 3 ? '#2a221c' : '#4a3e34'); f.line([lerp(b0, m1, 0.3), m1, lerp(m1, m2, 0.6)], 1.2, '#7a6a58', { op: 0.5 }); }
  f.part(limb([380, 650], [330, 664], 48, 38, { steps: 4 }), HD());
  // ---- the body: chest, withers, back, croup and buttock, the belly; the near shoulder and haunch masses modelled on it
  f.bone('body');
  const BODY = [[1206, 880], [1200, 790], [1160, 716], [1080, 650], [1000, 610], [930, 634], [820, 660], [700, 652], [610, 626], [520, 618], [440, 636], [386, 676], [360, 740], [366, 830], [396, 910], [452, 966], [540, 990], [610, 984], [690, 1010], [800, 1050], [920, 1058], [1030, 1040], [1110, 1000], [1176, 940]];
  f.part(BODY, HD());
  X.clipDraw(f, BODY, () => {
    f.flat(X.lumpy(f, [[400, 660], [560, 620], [640, 700], [620, 900], [480, 960], [390, 860]], 4), P.horseL, { op: 0.18 }); // the round of the haunch to the light
    f.flat(X.lumpy(f, [[1000, 640], [1120, 700], [1160, 820], [1100, 920], [1000, 880]], 4), P.horseL, { op: 0.16 }); // the shoulder
    f.stroke([[1010, 640], [1060, 760], [1090, 900]], 6, '#000', { op: 0.35 }); // the shoulder blade's back edge
    f.stroke([[640, 700], [600, 840], [560, 960]], 6, '#000', { op: 0.3 }); // the haunch's front groove
    for (let i = 0; i < 6; i++) f.line([[700 + i * 40, 720], [690 + i * 40, 900]], 2, '#000', { op: 0.25 }); // ribs under the hide
    f.flat([[300, 900], [1200, 900], [1200, 1010], [300, 1010]], '#000', { op: 0.3 });
    X.skinBurn(f, [760, 650], 1.75, 360, 3.6, { depth: 3 }); // the fern across the flank, carried on from the rider
    X.skinBurn(f, [560, 640], 1.9, 260, 2.8, { depth: 3 });
  });
  for (let i = 0; i < 4; i++) f.line([[420 + i * 6, 700 + i * 30], [450 + i * 4, 720 + i * 30]], 1.2, P.horseL, { op: 0.3 });
  // ---- near hind and near (raised) fore
  horseLeg('hn');
  // ---- the neck: arched up stiff, the muscles knotted in spasm and swollen where wasps nest in it; the mane standing
  f.bone('neck');
  const NECK = [[1010, 660], [1060, 560], [1130, 470], [1220, 390], [1300, 344], [1362, 372], [1374, 432], [1344, 500], [1296, 580], [1258, 660], [1226, 760], [1206, 860], [1120, 800]];
  f.part(NECK, HD());
  X.clipDraw(f, NECK, () => {
    for (const [c, r] of [[[1200, 560], 40], [[1250, 480], 34], [[1160, 660], 30]]) { f.flat(ell(add(c, [6, 10]), r, r * 0.6, -0.8, 12), '#000', { op: 0.35 }); f.flat(ell(add(c, [-4, -6]), r * 0.8, r * 0.5, -0.8, 12), P.horseL, { op: 0.3 }); } // knots of muscle in spasm
    f.stroke([[1100, 600], [1200, 520], [1290, 420]], 8, '#000', { op: 0.3 });
    X.skinBurn(f, [1300, 380], 2.3, 220, 2.2, { depth: 2 });
  });
  // the wasps' nest swelling the underside of the neck: stretched hide over comb, holes, wasps coming and going
  const NW = [[1220, 640], [1280, 580], [1330, 560], [1350, 610], [1310, 680], [1250, 720], [1210, 700]];
  f.part(X.lumpy(f, NW, 4), HD({ fill: mix(P.horse, P.ven, 0.14), light: mix(P.horseL, P.venP, 0.2), shade: 0.42 }));
  X.hole(f, [1300, 610], 12, 9, -0.6, { lip: mix(P.horseL, P.venP, 0.3) }); X.comb(f, X.lumpy(f, ell([1300, 612], 9, 6, -0.6, 10), 1), { cell: 4 });
  X.hole(f, [1262, 680], 8, 6, -0.4, { lip: mix(P.horseL, P.venP, 0.3) });
  X.pustules(f, [1290, 650], 26, 16, 3, 3, 5);
  for (let i = 0; i < 6; i++) { const q = [R(f, 1230, 1330), R(f, 590, 700)]; f.line([q, add(q, [8, 6]), add(q, [12, 16])], 1.2, '#5a4e6a', { op: 0.6 }); } // veins over the stretched hide
  for (const [p, a] of [[[1330, 590], -0.4], [[1352, 560], -1.4], [[1236, 720], 2.4], [[1380, 620], 0.3]]) X.miniWasp(f, p, a, 0.9);
  // the mane standing stiff along the crest in clumped hanks
  for (let i = 0; i < 16; i++) { const t = i / 15, b0 = lerp([1050, 630], [1320, 350], t), a = -2.4 + t * 0.3 + R(f, -0.2, 0.2), l = R(f, 50, 90); const m = add(b0, rot([l * 0.55, R(f, -4, 4)], a)), e = add(b0, rot([l, 0], a + R(f, -0.15, 0.15))); f.stroke([b0, m, e], R(f, 12, 18), i % 3 ? '#221c18' : '#3a3028'); f.line([lerp(b0, m, 0.3), m], 1.2, '#7a6a58', { op: 0.5 }); }
  // ---- the head: long, pulled up stiff; the bit fused into the mouth, the lips drawn back from it; the bridle
  f.bone('head');
  const HEAD = hF([[-30, -44], [40, -50], [120, -36], [200, -24], [250, -16], [284, 0], [292, 26], [276, 50], [240, 58], [190, 58], [130, 70], [80, 100], [20, 112], [-30, 90], [-50, 30]]);
  f.part(HEAD, HD());
  X.clipDraw(f, HEAD, () => {
    f.flat(hF([[-40, 40], [100, 60], [200, 50], [280, 40], [280, 100], [-40, 100]]), '#000', { op: 0.3 });
    f.line(hF([[40, -30], [140, -26], [240, -18]]), 3, P.horseL, { op: 0.5 }); // the bony ridge of the face
    f.flat(hF(ell([10, 30], 40, 30, 0, 12)), '#000', { op: 0.22 }); // the cheek's hollow
    X.skinBurn(f, hF([[250, 10]])[0], hA + Math.PI - 0.2, 200, 2, { depth: 2 });
  });
  // the eye rolled white, dull and half-lidded; the ear pinned stiff; the nostril flared
  f.part(hF(ell([40, -14], 14, 9, 0, 10)), { fill: '#c8c0b0', shadow: '#5a524a', shade: 0.3, inkW: 1.2, cast: false, hatch: false });
  f.flat(hF([[26, -22], [54, -20], [52, -12], [28, -14]]), '#2a2420', { op: 0.85 }); f.flat(hF(ell([46, -8], 4, 3, 0, 6)), '#3a3430', { op: 0.6 });
  f.part(hF([[-24, -40], [-30, -96], [-12, -110], [4, -60]]), HD({ cast: false }));
  f.part(hF([[-6, -42], [0, -94], [14, -104], [22, -52]]), HD({ fill: mix(P.horse, '#000', 0.25), cast: false }));
  for (let i = 0; i < 5; i++) { const b0 = hF([[-20 + i * 6, -48]])[0]; f.stroke([b0, add(b0, [-6 - i * 2, -36]), add(b0, [-14 - i * 3, -60])], 8, '#221c18'); } // forelock standing
  f.flat(hF(ell([272, 20], 12, 8, 0.3, 10)), '#0c0a08');
  // the lips drawn back from the fused bit: bared teeth and gums, the bit's iron run into the corner of the mouth
  f.flat(hF([[200, 50], [250, 44], [284, 46], [276, 70], [232, 76], [200, 70]]), '#2a1210');
  for (let i = 0; i < 5; i++) f.flat(hF([[214 + i * 13, 50], [225 + i * 13, 49], [224 + i * 13, 64], [215 + i * 13, 64]]), '#cfc6aa');
  f.part(hF([[190, 44], [236, 36], [270, 36], [290, 30], [292, 42], [262, 48], [226, 48], [196, 56]]), HD({ fill: mix(P.horse, '#6a3a3a', 0.4), cast: false })); // the upper lip, curled back
  const bit = hF([[196, 60]])[0];
  f.part(X.lumpy(f, ell(bit, 18, 14, 0, 12), 2), X.IR(f, { fill: '#2a2826', light: '#8a86a0' })); X.scorch(f, bit, 26, 20, 0.5);
  f.flat(ell(add(bit, [-4, -4]), 6, 4, 0, 8), mix(P.vioL, '#888', 0.4), { op: 0.6 });
  // the bridle: cheek strap, nose band, brow band, the reins hanging slack to the rider
  for (const q of [[[0, -40], [10, 20], [196, 56]], [[150, -30], [150, 74]], [[-20, -36], [30, -48]]]) { f.line(hF(q), 9, INK); f.line(hF(q), 6, '#4a3a2a'); }
  X.rope(f, [bit, add(bit, [-120, 120]), add(bit, [-260, 200]), [WF[0] + 20, WF[1] - 6]], 4, { col: '#4a3a2a' });

  // ---- the saddle, its flap lifted on grey comb, the saddlebags bulging with comb; the fern through the saddle
  f.bone('body');
  const SD = [[760, 650], [800, 620], [900, 616], [960, 590], [990, 604], [980, 650], [940, 700], [800, 706], [760, 690]];
  f.part(SD, LTH({ fill: '#4a3a2a' }));
  X.clipDraw(f, SD, () => X.fern(f, SD, [870, 616], 1.6, 120, 2.4, { cloth: true, depth: 2 }));
  const FL = [[790, 700], [940, 704], [960, 820], [930, 860], [800, 866], [776, 820]];
  X.comb(f, X.lumpy(f, [[790, 760], [950, 770], [970, 880], [790, 890]], 5), { cell: 10 });
  f.part(FL.map((q, i) => i > 1 && i < 5 ? add(q, [6, -24]) : q), LTH({ fill: '#3a2c20' })); // the flap, lifted
  X.miniWasp(f, [960, 860], 0.6, 0.8); X.miniWasp(f, [784, 880], 2.8, 0.8);
  const SB = [[680, 690], [760, 690], [776, 800], [756, 830], [690, 830], [668, 790]];
  f.part(SB, LTH({ fill: '#5a4636' }));
  X.comb(f, X.lumpy(f, [[690, 680], [750, 676], [758, 704], [696, 708]], 3), { cell: 7 });
  f.part([[676, 690], [764, 688], [760, 730], [684, 732]], LTH({ fill: '#4a3828', cast: false }));
  f.part([[714, 720], [730, 720], [730, 740], [714, 740]].map(q => [...q, 1]), X.IR(f, { cast: false }));
  // the girth and the broken far stirrup leather hanging
  f.part([[930, 700], [960, 700], [990, 990], [960, 994]], LTH({ fill: '#2e2418', cast: false }));
  X.rope(f, [[820, 704], [818, 790], [812, 860]], 6, { col: '#3a2c20', fray: true });

  // ---- the rider: the cloak blown stiff behind, the far arm with the crop and reins, the torso upright and locked
  f.bone('cloak');
  const CK = [[884, 316], [830, 330], [760, 360], [690, 380], [650, 400], [664, 420], [628, 452], [660, 466], [640, 500], [700, 494], [744, 470], [800, 440], [850, 420]];
  f.part(CK, CLO({ fill: '#3e3a34' }));
  X.clipDraw(f, CK, () => { for (const q of [[[860, 340], [740, 400], [660, 440]], [[860, 380], [760, 430], [680, 480]]]) f.stroke(q, 4, '#100e0c', { op: 0.5 }); X.fern(f, CK, [860, 330], 3.0, 200, 2, { cloth: true, depth: 2 }); });
  X.hemThreads(f, CK.slice(4, 10), '#2a2622', 6);
  X.mArm(f, SF, EF, WF, [70, 60, 44], LTH({ fill: '#2a2018', shade: 0.28 }), { sfx: '_f', bare: false });
  f.bone('crop');
  f.part(limb(add(WF, [0, -10]), add(WF, [-220, 160]), 12, 6, { steps: 8 }), LTH({ fill: '#2a2018', cast: false }));
  f.bone('hand_f');
  X.knuckleFist(f, WF, ang(EF, WF), 32, '#3a2e24', { tex: 'wrinkle' + sd, shadow: '#120c08', nail: '#3a2e24' });
  X.rope(f, [add(WF, [8, 18]), add(WF, [18, 60]), add(WF, [10, 104])], 4, { col: '#4a3a2a', fray: true }); // the rein's tail out under the fist: it runs through the grip
  f.bone('torso');
  const RS = B.spine(RN, [874, 460], RP, H);
  const TOR = RS.shape([[0, 0.36, 0.32], [0.12, 0.6, 0.48], [0.4, 0.58, 0.5], [0.7, 0.5, 0.46], [1.0, 0.56, 0.5]]);
  f.part(TOR, LTH());
  X.wear(f, TOR, 5, { hem: false });
  X.clipDraw(f, TOR, () => {
    for (const v of [0.3, 0.55, 0.8]) f.stroke([RS.at(-0.5, v), RS.at(0, v + 0.04), RS.at(0.45, v)], 3, '#120c08', { op: 0.5 });
    X.fern(f, TOR, RS.at(-0.4, 0.0), 1.6, 300, 3, { cloth: true, depth: 3 }); // the fern down his back
  });
  // the courier's badge, the horn on its cord fused to his chest, the road-pass token on a thong
  const bd = RS.at(0.3, 0.3);
  f.part([add(bd, [-18, -16]), add(bd, [18, -16]), add(bd, [20, 10]), add(bd, [0, 26]), add(bd, [-20, 10])], X.IR(f, { fill: '#5a5a60', cast: false }));
  f.line([add(bd, [-8, -4]), add(bd, [8, -4]), add(bd, [0, 14]), add(bd, [-8, -4])], 1.6, INK, { op: 0.7 }); // a horn device
  const hr = RS.at(0.2, 0.5);
  f.part([add(hr, [-40, -10]), add(hr, [0, -16]), add(hr, [40, -6]), add(hr, [52, 12]), add(hr, [40, 18]), add(hr, [0, 8]), add(hr, [-40, 10])], { fill: '#8a7c62', shadow: '#3a2e1e', light: '#c8b896', shade: 0.42, tex: 'growth' + sd, texOp: 0.6, inkW: 1.3 });
  f.part(ell(add(hr, [50, 14]), 9, 13, 0.3, 10), { fill: '#5a4a32', shade: 0.4, inkW: 1.1, cast: false });
  X.scorch(f, add(hr, [0, 0]), 40, 16, 0.5); X.fusedRun(f, add(hr, [-20, 10]), 18, 5, '#8a7c62'); // fused to his chest
  f.line([RS.at(-0.2, 0.02), add(hr, [-36, -6])], 2.4, '#2a2018');
  f.line([RS.at(0.1, 0.02), add(RS.at(0.36, 0.2), [0, 0])], 1.6, '#2a2018'); f.part(ell(RS.at(0.38, 0.24), 8, 10, 0, 8), X.WD(f, { cast: false })); // the road-pass token
  // belt and sword at the hip, its scabbard over the horse's flank
  f.part([RS.at(-0.56, 0.9), RS.at(0.5, 0.88), RS.at(0.52, 0.98), RS.at(-0.56, 1.0)], LTH({ fill: '#1e160e', cast: false }));
  const sw0 = RS.at(-0.4, 0.96);
  f.part(limb(sw0, add(sw0, [-180, 230]), 22, 14, { steps: 6, capK: 0.4 }), LTH({ fill: '#2a2018', cast: false }));
  f.part(limb(add(sw0, [18, -48]), add(sw0, [6, 0]), 12, 12, { steps: 3 }), X.WD(f, { cast: false })); f.part(limb(add(sw0, [-22, -4]), add(sw0, [30, 4]), 10, 10, { steps: 3 }), X.IR(f, { cast: false }));
  // the near stirrup leather from the bar under the saddle down to the stirrup iron, behind the rider's leg
  f.bone('body');
  f.part(X.ribbon([[910, 690], [928, 800], [AN[0] + 14, AN[1] - 26]], t => 14 - t * 2), LTH({ fill: '#3a2c20', cast: false })); f.rivet([914, 712], 3, '#6a645c');
  f.bone('torso');
  // ---- the rider's near leg: thigh along the horse's side, the high boot, the stirrup and the spur fused into the flank
  X.mLeg(f, HN, KN, AN, [100, 76, 52], CLO({ fill: '#3a3630' }), { sfx: '_n', bare: false });
  f.bone('shin_n');
  const BT = X.mchain([lerp(KN, AN, -0.05), AN], [[[[0, 42], [0.5, 36], [1, 30]], [[0, 42], [0.5, 40], [1, 30]]]]);
  f.part(BT, LTH({ fill: '#2a2018' }));
  f.part(X.lumpy(f, ell(lerp(KN, AN, -0.02), 46, 20, ang(KN, AN) + Math.PI / 2, 12), 2), LTH({ fill: '#3a2c20', cast: false })); // the boot's top
  f.bone('foot_n');
  f.part([add(AN, [-30, -10]), add(AN, [30, -12]), add(AN, [70, 10]), add(AN, [84, 30]), add(AN, [40, 38]), add(AN, [-28, 34])], LTH({ fill: '#2a2018' }));
  const st = add(AN, [20, 30]);
  f.line([add(AN, [-6, -30]), add(st, [-30, 8]), add(st, [40, 8]), add(AN, [40, -30])], 6, '#2a2826'); f.line([add(st, [-30, 10]), add(st, [40, 10])], 3, P.ironL, { op: 0.6 });
  X.scorch(f, st, 40, 14, 0.55); f.part(X.lumpy(f, ell(add(st, [6, 10]), 24, 8, 0, 10), 2), X.IR(f, { fill: '#2a2826', cast: false })); // the stirrup fused into the hide
  const spur = add(AN, [-32, 8]);
  f.line([spur, add(spur, [-34, 6])], 5, '#2a2826'); f.part(X.lumpy(f, ell(add(spur, [-38, 6]), 12, 10, 0, 10), 2), X.IR(f, { fill: '#2a2826', light: '#8a86a0', cast: false })); X.scorch(f, add(spur, [-38, 6]), 24, 18, 0.5); // the spur rowel welded into the flank
  // ---- the raised near foreleg, in front of everything at the shoulder
  horseLeg('fn');

  // ---- the rider's head: the felt hood blown back, hair on end, a slack swollen face, the eyes rolled up
  f.bone('head_r');
  const nk = add(RHC, rot([-12, 66], rhA));
  f.part(limb(add(RN, [0, 8]), nk, 74, 64, { steps: 4 }), SKN());
  f.part(X.lumpy(f, [add(RN, [-70, 0]), add(RN, [-40, -40]), add(RN, [10, -30]), add(RN, [6, 20]), add(RN, [-50, 30])], 4), CLO({ fill: '#4e4a40' })); // the hood blown back off the head, stiff at the nape
  const hF2 = X.pHead(f, RHC, H, rhA, { skin, jaw: 1.12, chin: -0.02, nose: 1.05, hook: 0.05, rolled: true, slack: true, mouth: 'set', browDown: -0.04, age: true, hairCol: '#3a3028', beard: 'stubble', beardCol: '#2e2620', droop: true });
  X.stiffMane(f, hF2, Math.PI * 0.82, Math.PI * 1.9, 0.26, '#5a4e40', { n: 12, taper: t => 0.6 + Math.sin(t * Math.PI) * 0.6 });
  X.fern(f, hF2(ell([0, 0], 0.4, 0.56, 0, 16)), hF2([[-0.1, -0.46]])[0], rhA + 2.2, 120, 2, { depth: 2 }); // the strike's entry at the crown, its fern down the back of the head
  X.weal(f, hF2([[-0.16, 0.36]])[0], 10);

  // ---- the near arm held out stiff at arm's length, the leather message tube in the fist, its seal broken, a wasp out
  X.mArm(f, SN, EN, WN, [78, 64, 48], LTH({ shade: 0.28 }), { sfx: '_n', bare: false });
  f.bone('tube');
  const t0 = add(WN, [6, 110]), t1 = add(WN, [6, -96]);
  f.part(limb(t0, t1, 46, 44, { steps: 6, capK: 0.3 }), LTH({ fill: '#5a4632', light: '#8a7458' }));
  for (const t of [0.12, 0.88]) f.line([lp(t0, t1, t, -23), lp(t0, t1, t, 23)], 4, '#2a2018');
  f.part(ell(add(t1, [0, -4]), 24, 9, 0, 12), LTH({ fill: '#4a3828', cast: false }));
  f.part(X.lumpy(f, ell(add(t1, [-6, -4]), 13, 6, 0.2, 10), 2), { fill: '#2a1a16', shadow: '#0a0606', light: '#5a3a32', shade: 0.4, inkW: 1, cast: false, hatch: false }); f.flat(ell(add(t1, [-8, -6]), 5, 2, 0.2, 6), '#3a1210', { op: 0.8 }); // the seal: old black wax, crusted with dried blood, broken
  f.line([add(t1, [-14, -6]), add(t1, [0, -2]), add(t1, [8, -8])], 1.6, INK);
  X.miniWasp(f, add(t1, [14, -18]), -1.0, 1.0); X.miniWasp(f, add(t1, [-4, -40]), -1.9, 0.9);
  f.bone('hand_n');
  X.gripK(f, WN, EN, -Math.PI / 2, 33, '#3a2e24', { tex: 'wrinkle' + sd, shadow: '#120c08', nail: '#3a2e24', name: 'courier tube' }); // the gauntlet
  f.part([add(WN, [-62, -26]), add(WN, [-30, -32]), add(WN, [-26, 30]), add(WN, [-60, 28])], LTH({ fill: '#3a2e24', cast: false })); // the gauntlet's cuff

  f.bone('root');
  f.flat(ell([820, gy + 2], 600, 9, 0, 24), '#14121a', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE CICADA UNDER THE ROAD (ruler, 4)
// A cicada nymph that burrowed under the plain road the year of the first storm, heaving up through the broken paving:
// its front half reared out of the ground, the digging forelegs hooked over the cobbles, its back split open along its
// length, and the pale adult pushing up out of the old shell, cropped by the frame top. The weight hangs on the hooked
// forelegs. The split follows the lightning scar where a storm struck the road above it: scorched edges, ferns across
// the shell, the seams fused shut everywhere but along the strike (lightning). The adult is wrong: puffy and pale,
// banded venom green, pustules along the abdomen, the wings thick-veined and wet, the whole body swollen (toxin).
// The adult is seen three-quarter from its back as it rises: a broad blunt head with wide-set compound eyes (dark glossy
// domes, no pupil) and three ocelli, the beak tucked under; the shield of the pronotum with its raised collar; the
// mesonotum with its W and the cruciform swelling; a tapering abdomen of overlapping tergites. The near forewing lies
// folded like a tent along the abdomen; the far forewing is half unfolded, raised, and reaches the frame top. The
// nymph's husk is the old exoskeleton: the same plates, hollow and brittle, split down the back, lit through the split.
// True size: 4 humans (2560 px) on a 2000 x 2600 canvas at the game's pixel scale (GUIDE 2).
// Rig: road (root) + shell (road) + shell_lip (shell) + foreleg_n, foreleg_f (shell, the nymph's) + adult (shell) +
// adult_head (adult) + wing_n (adult, folded) + wing_f (adult, unfolding) + aleg_n, aleg_f (adult) + stones (road).
// Motion: idle the split widening a little while the shell creaks (shell_lip, adult, wing_f); attack the song (the
// adult's abdomen pulses, the stones rattle: adult, stones; the stun is an engine effect).
function cicadaUnderTheRoad() {
  const seed = 1021, w = 2000, h = 2600;
  const f = new Fig(X.base(seed, h, { grimeY: 5000 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  // the husk: a dull black-brown shell, lifted enough that its plates read on a dark ground; the adult: pale, puffy
  const NY = (o = {}) => ({ fill: '#3c342b', shadow: '#110e0b', light: '#86745a', shade: 0.42, tex: 'growth' + sd, texOp: 0.4, ...o });
  const AD = (o = {}) => ({ fill: P.adult, shadow: '#56563e', light: P.adultL, shade: 0.42, maxShade: 46, tex: 'growth' + sd, texOp: 0.3, ...o });
  const ST = (o = {}) => ({ fill: P.stone, shadow: P.stoneD, light: P.stoneL, shade: 0.4, tex: 'pit' + sd, texOp: 0.6, ...o });
  const EA = (o = {}) => ({ fill: P.earth, shadow: P.earthD, light: P.earthL, shade: 0.4, tex: 'mottle' + sd, texOp: 0.6, ...o });
  const HO = [1000, 2330], HRX = 450, HRY = 104; // the hole in the road
  // ---- the nymph's body line (head first): the head lowered to the road at the front, the thorax reared, the abdomen
  // curving down into the hole. npt(u, k): k -1 dorsal (the top), +1 ventral
  const NC = [[1690, 2060], [1550, 1930], [1360, 1876], [1180, 1924], [1050, 2070], [985, 2280], [965, 2480]];
  const nhw = u => u < 0.12 ? 150 + u / 0.12 * 60 : u < 0.5 ? 210 + Math.sin((u - 0.12) / 0.38 * Math.PI) * 32 : 210 - (u - 0.5) * 100;
  const CN = X.spline(NC, 3), SN = X.arcLen(CN), LN = SN[SN.length - 1];
  const npt = (u, k) => { const uu = Math.max(0, Math.min(1, u)), A = X.at(CN, SN, uu * LN); return add(A.p, mul(A.n, -k * nhw(uu))); };
  const NSEG = [[0, 0.12], [0.12, 0.3], [0.3, 0.44], [0.44, 0.5]]; for (let i = 0; i < 8; i++) NSEG.push([0.5 + i * 0.0625, 0.5625 + i * 0.0625]);
  // ---- the split along the back of the thorax, centred where the adult comes up through it
  let uMid = 0.3; { let best = 1e9; for (let u = 0.1; u < 0.6; u += 0.002) { const d = Math.abs(npt(u, -1)[0] - 1262); if (d < best) { best = d; uMid = u; } } }
  const uA = 0.07, uB = uMid + 0.2, sw = u => Math.max(0, Math.sin((u - uA) / (uB - uA) * Math.PI));
  const kFar = u => -1.0 - 0.07 * sw(u), kNear = u => -1.0 + 0.62 * Math.pow(sw(u), 0.7);
  const US = []; for (let i = 0; i <= 24; i++) US.push(uA + (uB - uA) * i / 24);
  // ---- the adult's axis, tail (inside the husk) up to the head: M(x, y), x in px along it (0 = the pronotum's rear
  // margin, + toward the head), y across it (+ to the right, the lit side)
  const AXP = [[1250, 2080], [1258, 1860], [1272, 1620], [1296, 1380], [1326, 1166], [1356, 975]]; // (ruler pass) the body arches toward the light as it pulls free
  const CA = X.spline(AXP, 3), SA2 = X.arcLen(CA), LA = SA2[SA2.length - 1], X0 = 760;
  // ruler pass: the adult is turned three-quarter toward us and twists as it pulls free. Across the body the near (+y, lit)
  // side widens and the far side foreshortens, a little at the tail still in the husk and most at the thorax and head
  const tw = x => 0.18 + 0.6 * Math.max(0, Math.min(1, (x + 620) / 820)), wy = (x, y) => y >= 0 ? y * (1 + 0.3 * tw(x)) : y * (1 - 0.74 * tw(x));
  const M = (x, y0) => { const y = wy(x, y0), s = X0 + x; if (s > LA) { const A = X.at(CA, SA2, LA); return add(add(A.p, mul(A.d, s - LA)), mul(A.n, y)); } const A = X.at(CA, SA2, Math.max(0, s)); return add(A.p, mul(A.n, y)); };
  const Ms = pts => pts.map(([x, y, s2]) => s2 ? [...M(x, y), 1] : M(x, y));
  const axA = ang(M(0, 0), M(100, 0)); // the adult's axis heading (up)
  const WRf = M(-70, -165), WRn = M(-90, 196);
  f.joint('road', [1000, gy], null).joint('shell', [1000, 2300], 'road').joint('shell_lip', npt(uMid, -0.5), 'shell').joint('stones', [1500, 2480], 'road');
  f.joint('foreleg_n', npt(0.14, 0.8), 'shell').joint('foreleg_f', npt(0.12, 0.5), 'shell');
  f.joint('adult', M(-480, 0), 'shell').joint('adult_head', M(150, 0), 'adult').joint('wing_n', WRn, 'adult').joint('wing_f', WRf, 'adult').joint('aleg_n', M(90, 160), 'adult').joint('aleg_f', M(90, -160), 'adult');
  // a cobble: a rounded sett seen from the chest-high camera, its top face and the depth of its front face; tilt heaves it
  const cobble = (c, cw, ch, tilt = 0, o = {}) => {
    const F = frame(c, tilt, 1), d = ch * 0.55;
    const top = X.lumpy(f, F([[-cw * 0.5, 0], [-cw * 0.46, -ch * 0.42], [0, -ch * 0.5], [cw * 0.46, -ch * 0.42], [cw * 0.5, 0], [cw * 0.44, ch * 0.12], [-cw * 0.44, ch * 0.12]]), Math.min(cw, ch) * 0.06);
    const front = F([[-cw * 0.5, 0], [-cw * 0.44, ch * 0.12], [cw * 0.44, ch * 0.12], [cw * 0.5, 0], [cw * 0.48, d], [cw * 0.38, d + ch * 0.12], [-cw * 0.38, d + ch * 0.12], [-cw * 0.48, d]]);
    f.part(front, ST({ fill: mix(o.col || P.stone, '#000', 0.4), cast: o.cast ?? true, inkW: 1.2 }));
    f.part(top, ST({ fill: o.col || P.stone, cast: false, inkW: 1.3 }));
    f.line(F([[-cw * 0.4, -ch * 0.34], [0, -ch * 0.44], [cw * 0.36, -ch * 0.36]]), 1.6, P.stoneL, { op: 0.5 });
    if (f.r() < 0.4) f.scratches(c, cw * 0.25, 2, '#a8a49c', 0.8);
  };
  const road = (front) => { // rows of setts receding in depth; near the hole they are heaved up and tilted away from it
    for (let y = 2190, r = 0; y < gy + 20; r++) {
      const sz = 54 + (y - 2190) * 0.32, ch = sz * 0.5;
      if ((y > HO[1]) === front) for (let x = -20 + (r % 2) * sz * 0.5; x < w + 40; x += sz * 1.02) {
        const dx = (x - HO[0]) / (HRX + 60), dy = (y - HO[1]) / (HRY + 50), dd = dx * dx + dy * dy;
        if (dd < 1) continue; // the hole
        const heave = Math.max(0, 1 - (Math.sqrt(dd) - 1) / 0.9), tilt = heave * (dx > 0 ? 0.5 : -0.5) * (0.6 + f.r() * 0.6), lift = heave * (40 + f.r() * 30);
        cobble([x + f.r() * 6, y - lift], sz * R(f, 0.88, 1.0), ch, tilt, { col: mix(P.stone, f.r() < 0.5 ? '#5a5650' : '#7a766e', 0.5) });
      }
      y += ch * 0.95;
    }
  };

  // ---- the far road: setts, the toppled milestone, the bent waypost, the hole
  f.bone('road');
  f.part([[0, 2170], [2000, 2160], [2000, gy + 4], [0, gy + 4]], ST({ fill: '#2a2826', shade: 0.2 }));
  road(false);
  const MS = [[100, 2150], [150, 2060], [320, 2090], [360, 2150], [346, 2216], [120, 2224]];
  f.part(MS, ST({ fill: '#7a7670' }));
  f.part([[320, 2090], [360, 2150], [346, 2216], [312, 2160]], ST({ fill: '#4a4844', cast: false }));
  f.line([[170, 2110], [192, 2150], [181, 2130], [170, 2150], [192, 2110]], 3, '#2a2826', { op: 0.75 }); f.line([[212, 2110], [216, 2152]], 3, '#2a2826', { op: 0.75 }); f.line([[238, 2112], [248, 2152], [258, 2114]], 3, '#2a2826', { op: 0.3 }); // its miles, half worn
  f.part(X.ribbon(X.spline([[1890, 2240], [1896, 2060], [1870, 1940], [1800, 1890]]), t => 18 - t * 5), X.IR(f));
  f.part([[1756, 1858], [1832, 1878], [1826, 1920], [1750, 1902]].map(q => [...q, 1]), X.IR(f, { fill: '#46464a' }));
  f.part(X.lumpy(f, ell(HO, HRX + 40, HRY + 30, -0.03, 24), 16), EA({ fill: '#2a241e', shade: 0.25 }));
  f.flat(X.lumpy(f, ell(add(HO, [0, 14]), HRX * 0.9, HRY * 0.8, -0.03, 22), 12), '#0c0a08');

  // ---- the adult's far forewing, half unfolded and raised: a translucent membrane, the sky and the road behind it
  // showing through tinted, strong dark veins in the cicada pattern, a thick costa, torn and wet and still crumpled
  f.bone('wing_f');
  X.cicadaWing(f, WRf, axA - 0.38 - Math.PI * 0.02, 1500, 650, { tr: 1, tears: [[0.56, 0.05], [0.63, 0.09], [0.69, 0.04]], chunk: [0.74, 0.79], crumple: 0.8, op: 0.2, beads: 7 });

  // ---- the nymph's far foreleg, and far mid leg braced on the rim
  const foreleg = (b0, kn, tb, tip, wd, near) => {
    const lk = NY(near ? {} : { fill: '#211d18', light: '#4e463c' }), fd = E.norm(sub(kn, b0)), fn = [-fd[1], fd[0]], td = E.norm(sub(tb, kn)), tn = [-td[1], td[0]];
    f.part(X.mchain([b0, kn], [[[[0, wd * 0.46], [0.35, wd * 0.62], [0.8, wd * 0.48], [1, wd * 0.36]], [[0, wd * 0.46], [0.45, wd * 0.72], [1, wd * 0.4]]]]), lk);
    X.clipDraw(f, X.mchain([b0, kn], [[[[0, wd * 0.46], [1, wd * 0.36]], [[0, wd * 0.46], [1, wd * 0.4]]]]), () => { f.line([lp(b0, kn, 0.1, wd * 0.25), lp(b0, kn, 0.85, wd * 0.2)], 3, lk.light, { op: 0.6 }); f.stroke([lp(b0, kn, 0.1, -wd * 0.1), lp(b0, kn, 0.9, -wd * 0.12)], 6, '#000', { op: 0.35 }); });
    for (let i = 0; i < 5; i++) { const q = add(lerp(b0, kn, 0.3 + i * 0.14), mul(fn, -wd * (0.64 - i * 0.05))); f.part([add(q, mul(fd, -wd * 0.12)), add(add(q, mul(fn, -wd * (0.34 - i * 0.03))), mul(fd, wd * 0.06)), add(q, mul(fd, wd * 0.14))], NY({ fill: near ? '#463e34' : '#2a251f', cast: false, inkW: 1.3 })); } // the femur's spade teeth
    f.part(X.mchain([kn, tb], [[[[0, wd * 0.36], [0.5, wd * 0.33], [1, wd * 0.32]], [[0, wd * 0.38], [0.6, wd * 0.46], [1, wd * 0.4]]]]), lk);
    for (let i = 0; i < 5; i++) { const q = add(lerp(kn, tb, 0.25 + i * 0.17), mul(tn, -wd * 0.42)); f.part([add(q, mul(td, -wd * 0.08)), add(add(q, mul(tn, -wd * 0.26)), mul(td, wd * 0.04)), add(q, mul(td, wd * 0.08))], NY({ fill: near ? '#463e34' : '#2a251f', cast: false, inkW: 1.1 })); } // the tibia's rake
    f.part(ell(kn, wd * 0.34, wd * 0.28, ang(b0, kn), 10), NY({ fill: mix(lk.fill, '#000', 0.3), cast: false }));
    f.part(X.ribbon(X.spline([tb, lerp(tb, tip, 0.5), tip]), t => wd * 0.2 * (1 - t * 0.6)), NY({ fill: lk.fill, cast: false }));
    for (let i = 0; i < 10; i++) { const q = lp(b0, tb, 0.08 + i * 0.09, wd * 0.4); f.line([q, add(q, [R(f, -6, 6), -R(f, 10, 22)])], 1.6, '#14120e'); } // bristles standing
    if (near) X.burn(f, lerp(b0, kn, 0.2), ang(b0, kn), E.len(sub(kn, b0)) * 0.8, 2, { depth: 2 });
    for (let i = 0; i < 4; i++) f.flat(X.lumpy(f, ell(lp(b0, kn, R(f, 0.2, 0.9), R(f, 0, wd * 0.3)), R(f, 6, 12), R(f, 4, 7), R(f, 0, 3), 8), 2), P.earth, { op: 0.75 }); // earth caked in the crook
  };
  f.bone('foreleg_f');
  cobble([1830, 2262], 150, 70, 0.4);
  foreleg(npt(0.12, 0.7), [1680, 2200], [1810, 2230], [1846, 2256], 130, false);
  f.bone('shell');
  X.ileg(f, [npt(0.42, 0.6), npt(0.44, 0.9), [880, 2170], [790, 2296], [764, 2352]], 62, NY({ fill: '#211d18', light: '#4e463c' }), { spines: 4, hairs: 8, tib: 1.3, planted: true });

  // ---- the husk: the old exoskeleton, whole except along the strike; dull and earth-caked, the seams fused shut
  X.segBody(f, NC, nhw, NSEG.length, NY(), { vs: -1, wrap: 0.6, segU: i => NSEG[i], sternCol: '#463c32', ov: 0.22,
    deco: (i, u0, u1, ptq) => {
      for (let k = 0; k < 3; k++) f.flat(X.lumpy(f, ell(npt(R(f, u0, u1), R(f, 0.1, 0.7)), R(f, 10, 22), R(f, 6, 12), R(f, 0, 3), 8), 3), P.earth, { op: 0.55 }); // earth caked low on the plate
      f.line([npt(u1, -1.0), npt(u1 + 0.006, -0.3), npt(u1, 0.6)], 2.2, '#9a8462', { op: 0.32 }); // the seam fused shut, a bright weld line
      f.flat([npt(u0 + 0.01, -0.95), npt(u1 - 0.005, -0.95), npt(u1 - 0.005, -0.72), npt(u0 + 0.01, -0.76)], '#a8946e', { op: 0.12 }); // the dull sheen along the plate's crown
      if (i === 2) { const wp = [npt(u0 + 0.02, -0.4), npt(u1 + 0.12, -0.2), npt(u1 + 0.18, 0.3), npt(u0 + 0.04, 0.4)]; f.part(wp, NY({ fill: '#463c30', cast: false })); f.line([wp[0], lerp(wp[1], wp[2], 0.5)], 2, '#0c0a08', { op: 0.6 }); } // the wing pad
    } });
  // ruler pass: the husk's abdomen gets its own overlapping plates (the slats fanned at the bend). Each tergite is a
  // domed plate wrapping the back and flank, drawn tail first so that its hind margin laps over the plate behind it:
  // the margin bulges back at the middle, its edge lit, its shadow thrown on the next plate; below it the pleural
  // groove and the narrower sternite; each plate a little different (span, bulge, a chipped margin, a spiracle, earth)
  { const L0 = f.L, litK = (() => { const u = 0.8, a = npt(u, 0), b = npt(u, 1), d = E.norm(sub(b, a)); return d[0] * L0[0] + d[1] * L0[1] > 0 ? 1 : -1; })();
    const cuts = [0.47]; for (let i = 0; i < 8; i++) cuts.push(Math.min(1.02, cuts[i] + 0.066 * R(f, 0.86, 1.12)));
    const TK0 = -1.05, TK1 = 0.5, SK1 = 1.04, bulge = (k, k0, k1, b) => b * Math.max(0, 1 - ((k - (k0 + k1) / 2) / ((k1 - k0) / 2)) ** 2);
    for (let i = 7; i >= 0; i--) {
      const u0 = cuts[i] - 0.012, u1 = cuts[i + 1], bt = R(f, 0.014, 0.024), chip = i === 2 || i === 5 ? R(f, -0.7, -0.1) : null;
      const marg = []; for (let j = 0; j <= 10; j++) { const k = TK0 + (TK1 - TK0) * j / 10; let uu = u1 + bulge(k, TK0, TK1, bt); if (chip !== null && Math.abs(k - chip) < 0.12) uu -= 0.012; marg.push([uu, k]); }
      const ter = [...marg.map(([u, k]) => npt(u, k)), npt(u0, TK1), npt(u0 + 0.004, -0.3), npt(u0, TK0 - 0.01)];
      const tD = f.part(ter, NY({ fill: mix('#3c342b', '#4a4034', (i % 3) * 0.3), light: '#8a7658', inkW: 1.6 }));
      X.clipDraw(f, tD, () => {
        f.flat([npt(u0, litK * 0.2), npt(u1 + 0.03, litK * 0.2), npt(u1 + 0.03, litK * 1.1), npt(u0, litK * 1.1)], '#c0a478', { op: 0.16 }); f.flat([npt(u0, -litK * 0.45), npt(u1 + 0.03, -litK * 0.45), npt(u1 + 0.03, -litK * 1.2), npt(u0, -litK * 1.2)], '#000', { op: 0.32 }); // the plate's lit crown and its flank turning into shadow
        for (let k = 0; k < 3; k++) f.flat(X.lumpy(f, ell(npt(R(f, u0, u1), R(f, -0.2, 0.4)), R(f, 8, 18), R(f, 5, 10), R(f, 0, 3), 8), 3), P.earth, { op: 0.5 }); // earth caked in the plate
        for (let k = 0; k < 4; k++) f.flat(ell(npt(R(f, u0 + 0.01, u1 - 0.005), R(f, -0.9, 0.3)), 2.4, 1.8, 0, 5), '#16120e', { op: 0.6 }); // pits
      });
      f.part(ell(npt((u0 + u1) / 2 + 0.006, 0.28), 9, 6, 0.4, 8), NY({ fill: '#1a1612', cast: false, inkW: 1 })); // a spiracle low on the flank
      const mp = marg.map(([u, k]) => npt(u, k));
      f.stroke(marg.map(([u, k]) => npt(u + 0.012, k)), 14, '#0a0806', { op: 0.45 }); // the margin's shadow on the plate behind
      f.line(mp.slice(litK > 0 ? 4 : 0, litK > 0 ? 11 : 7), 3, '#a08a64', { op: 0.75 }); // the hind margin's worn bright edge
      f.line(mp, 1.6, '#c8b08a', { op: 0.25, dash: '6 9' }); // the seam fused shut, a weld bead
      if (chip !== null) { const q = npt(u1 - 0.006, chip); f.flat([add(q, [-6, -4]), add(q, [8, -6]), add(q, [4, 8])], '#0a0806', { op: 0.8 }); } // a chipped edge
      // the sternite under the pleural groove, narrower and darker, its own lapping margin
      const st = [npt(u0 + 0.004, TK1 - 0.04), npt(u1 + bt * 0.5, TK1 - 0.04), npt(u1 + bt * 0.6, (TK1 + SK1) / 2), npt(u1 + bt * 0.3, SK1), npt(u0 + 0.004, SK1)];
      f.part(st, NY({ fill: '#2e2822', light: '#6a5a44', inkW: 1.3 }));
      f.line([npt(u1 + bt * 0.5, TK1 - 0.02), npt(u1 + bt * 0.6, (TK1 + SK1) / 2), npt(u1 + bt * 0.3, SK1 - 0.04)], 2, '#7a6a50', { op: 0.5 });
      f.line([npt(u0, TK1 - 0.02), npt(u1 + 0.01, TK1 - 0.02)], 3.4, '#0a0806', { op: 0.7 }); // the pleural groove
    }
  }
  const SIL = []; for (let i = 0; i <= 40; i++) SIL.push(npt(i / 40, -1.08)); for (let i = 40; i >= 0; i--) SIL.push(npt(i / 40, 1.05));
  X.clipDraw(f, SIL, () => { // the strike's burns branching from the split across the shell
    X.burn(f, npt(uA + 0.03, kNear(uA + 0.03) + 0.06), 0.9, 420, 3, { depth: 3 }); X.burn(f, npt(uB - 0.04, kNear(uB - 0.04) + 0.06), 2.3, 440, 3, { depth: 3 });
    X.burn(f, npt(uMid, kNear(uMid) + 0.1), 1.75, 260, 2.4, { depth: 2 }); X.burn(f, npt(uB + 0.02, -0.95), 2.0, 520, 2.4, { depth: 3 });
    f.flat([npt(0.62, -1.4), npt(1, -1.4), npt(1, 1.2), npt(0.62, 1.2)], '#000', { op: 0.2 }); // the abdomen going down into the dark
  });
  // the split: the shell torn open along its back; inside it is hollow. The far inner wall shows through the opening,
  // thin and amber where light comes through it, ribbed by the plates' inner ridges; the far lip curls back
  const SPL = [...US.map(u => npt(u, kFar(u))), ...US.slice().reverse().map(u => npt(u, kNear(u)))];
  f.flat(SPL, '#0a0806');
  X.clipDraw(f, SPL, () => {
    f.flat([...US.map(u => npt(u, kFar(u) - 0.05)), ...US.slice().reverse().map(u => npt(u, kFar(u) + 0.3 * sw(u)))], '#5e4428', { op: 0.85 });
    f.flat([...US.map(u => npt(u, kFar(u) - 0.05)), ...US.slice().reverse().map(u => npt(u, kFar(u) + 0.1 * sw(u)))], '#c89c62', { op: 0.45 });
    for (const u of [0.3, 0.44, uA + 0.05, uB - 0.05]) if (u > uA && u < uB) f.line([npt(u, kFar(u)), npt(u + 0.004, kFar(u) + 0.28 * sw(u))], 3, '#2a1c10', { op: 0.7 }); // the plates' inner ridges
  });
  const FL = [...US.map(u => npt(u, kFar(u))), ...US.slice().reverse().map(u => npt(u, kFar(u) - 0.1 * sw(u) - (Math.round(u * 400) % 3 === 0 ? 0.03 * sw(u) : 0)))]; // the far lip, curled back off the split
  f.part(FL, NY({ fill: '#4a4034', cast: false, inkW: 1.4 }));
  f.line(US.map(u => npt(u, kFar(u) - 0.1 * sw(u))), 2, '#c8a070', { op: 0.55 }); // its thin torn edge, lit through
  X.scorch(f, npt(uMid - 0.06, kFar(uMid) - 0.02), 120, 22, 0.5, -0.1);

  // ---- the adult, rising out of the split: the abdomen first (its lower part still inside the husk, hidden below the
  // near lip). Eight tergites, each an arched shell plate whose hind margin laps over the plate behind it, drawn tail
  // first; each plate rounds off to the shadowed flank, its hind margin lit and casting a shadow on the next plate;
  // the swollen venom-green membrane shows between them
  f.bone('adult');
  const lipY = US.map(u => npt(u, kNear(u)));
  const inside = [...lipY, [lipY[lipY.length - 1][0] - 200, 0], [lipY[0][0] + 200, 0]];
  const i0ab = f.out.length;
  const abw = x => { const t = (-200 - x) / 560; return (186 - t * 96) * (1 + 0.08 * Math.sin(t * Math.PI)); };
  for (let i = 7; i >= 0; i--) {
    const x0 = -196 - i * 70, x1 = x0 - 84, arch = 26, n = 12, pl = [];
    for (let k = 0; k <= n; k++) { const y = -1 + 2 * k / n; pl.push([x0 + arch * (1 - y * y) * 0.5, y * abw(x0) * 0.98]); }
    for (let k = n; k >= 0; k--) { const y = -1 + 2 * k / n; pl.push([x1 - arch * (1 - y * y), y * abw(x1)]); }
    const mem = []; for (let k = 0; k <= n; k++) { const y = -1 + 2 * k / n; mem.push([x0 + arch * (1 - y * y) * 0.5 + 16, y * abw(x0) * 0.96]); } for (let k = n; k >= 0; k--) { const y = -1 + 2 * k / n; mem.push([x0 + arch * (1 - y * y) * 0.5 - 8, y * abw(x0) * 0.98]); }
    f.part(Ms(mem), AD({ fill: mix(P.ven, P.adult, 0.3), shadow: '#2e3a16', cast: false, inkW: 1 })); // the swollen membrane at the plate's front
    const PL = Ms(pl);
    f.part(PL, AD({ fill: mix(P.adult, '#a4a084', 0.12 + (i % 2) * 0.1) }));
    X.clipDraw(f, PL, () => {
      f.flat(Ms([[x0 + 30, -260], [x1 - 40, -260], [x1 - 40, -abw(x0) * 0.45], [x0 + 30, -abw(x0) * 0.55]]), '#24241a', { op: 0.32 }); // the left flank rounding away from the light
      f.flat(Ms([[x0 + 30, -260], [x1 - 40, -260], [x1 - 40, -abw(x0) * 0.8], [x0 + 30, -abw(x0) * 0.84]]), '#14140e', { op: 0.3 });
      f.flat(Ms([[x0 - 10, abw(x0) * 0.12], [x1 + 10, abw(x0) * 0.1], [x1 + 14, abw(x0) * 0.42], [x0 - 6, abw(x0) * 0.46]]), P.adultL, { op: 0.28 }); // the lit crown of the curve
      f.flat(Ms([[x0 + 30, abw(x0) * 0.86], [x1 - 40, abw(x0) * 0.86], [x1 - 40, 260], [x0 + 30, 260]]), '#3a3a28', { op: 0.25 }); // the turn of the right flank
      f.flat(Ms([[(x0 + x1) / 2, -abw(x0)], [x1 - 30, -abw(x0)], [x1 - 30, abw(x0)], [(x0 + x1) / 2, abw(x0)]]), P.ven, { op: 0.14 }); // the venom-green band on the plate's rear
      for (let k = 0; k < 5; k++) f.flat(ell(M(R(f, x1, x0), R(f, -0.8, 0.6) * abw(x0)), 2, 1.6, 0, 5), '#5a5a44', { op: 0.6 }); // punctures
      f.flat(Ms([[x0 + 30, abw(x0) * 0.7], [x1 - 40, abw(x1) * 0.7], [x1 - 40, abw(x1) * 1.05], [x0 + 30, abw(x0) * 1.05]]), mix(P.ven, '#2e3a16', 0.5), { op: 0.3 }); // (ruler pass) the near flank turned toward us, the pleural skin green between the plates
      f.line(Ms([[x0 + 10, abw(x0) * 0.7], [x1 - 10, abw(x1) * 0.7]]), 2.4, '#3a3a26', { op: 0.55 }); // the plate's lateral edge where the flank turns
      f.part(ell(M((x0 + x1) / 2, abw(x0) * 0.84), 9, 5, axA, 8), AD({ fill: '#4a4a36', cast: false, inkW: 1 })); // a spiracle on the near flank
    });
    const edge = []; for (let k = 0; k <= n; k++) { const y = -1 + 2 * k / n; edge.push([x1 - arch * (1 - y * y) + 3, y * abw(x1) * 0.97]); }
    f.stroke(Ms(edge.map(([x, y]) => [x - 10, y])), 16, '#2a2a1c', { op: 0.4 }); // the margin's shadow on the plate behind
    f.line(Ms(edge.slice(5, n)), 3, P.adultL, { op: 0.8 }); // the hind margin's lit edge, brightest on the lit side
    f.line(Ms(edge.slice(1, 6)), 2, P.adultL, { op: 0.35 });
    X.pustules(f, M((x0 + x1) / 2, R(f, -0.2, 0.5) * abw(x0)), 30, 14, 2, 5, 10, { burst: 0.3 });
  }
  { const body = f.out.splice(i0ab).join('\n'), id = f.id('ab'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(inside.map(q => [q[0], q[1], 1]))}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`); }

  // ---- the near lip of the husk over the adult's abdomen: the split's near edge, thin and curled out toward us,
  // its inner face turned out pale amber, scorched, brittle flakes breaking off
  f.bone('shell_lip');
  const CUR = [...US.map(u => npt(u, kNear(u) - 0.03 * sw(u))), ...US.slice().reverse().map(u => npt(u, kNear(u) + 0.2 * sw(u) + 0.03))];
  f.flat([...US.map(u => npt(u, kNear(u) + 0.1 * sw(u))), ...US.slice().reverse().map(u => npt(u, kNear(u) + 0.32 * sw(u) + 0.03))], '#000', { op: 0.35 }); // the curl's shadow on the shell below it
  f.part(CUR, NY({ fill: '#7e5e3c', light: '#c09662', shadow: '#2a1c10', cast: false, inkW: 1.4 }));
  f.line(US.map(u => npt(u, kNear(u) - 0.02 * sw(u))), 3.2, '#e2bc84', { op: 0.8 }); // the torn edge, so thin the light comes through
  X.clipDraw(f, CUR, () => { for (let k = 0; k < 4; k++) X.scorch(f, npt(R(f, uA + 0.04, uB - 0.04), kNear(uMid) + 0.06), 70, 18, 0.55, -0.1); f.line(US.map(u => npt(u, kNear(u) + 0.14 * sw(u))), 1.6, '#2a1c10', { op: 0.6 }); });
  for (const u of [uA + 0.06, uMid + 0.05, uB - 0.05]) { const q = npt(u, kNear(u)); f.flat([q, add(q, [-12, -26]), add(q, [10, -8])], '#3a2e22'); f.line([q, add(q, [-12, -26])], 1.4, '#c8a070', { op: 0.6 }); } // brittle flakes curling off the edge

  // ---- the adult's forelegs, their swollen spined femurs pulling up on the rims of the split (drawn under the thorax)
  const aleg = (nm, base, tip, side2, wd, ko = 150, kd = 210) => {
    f.bone(nm);
    const lk = AD({ fill: mix(P.adult, '#7a7a5e', side2 < 0 ? 0.35 : 0.12) });
    const c1 = add(base, rot([0, side2 * 40], axA)), out = E.norm(sub(c1, M(0, 0))), dn = rot([-1, 0], axA), kn = add(add(c1, mul(out, ko)), mul(dn, kd)), an = lerp(kn, tip, 0.74);
    X.ileg(f, [base, c1, kn, an, tip], wd, lk, { spines: 5, hairs: 6, tib: 1.25, femurSpines: 0, mem: mix(P.ven, P.adult, 0.4) });
    const fd = E.norm(sub(kn, c1)), fn = [-fd[1], fd[0]], sgn = Math.sign(fn[1]) || 1; // spines on the femur's lower edge
    f.part(X.mchain([c1, kn], [[[[0, wd * 0.5], [0.4, wd * 0.74], [1, wd * 0.42]], [[0, wd * 0.5], [0.5, wd * 0.58], [1, wd * 0.4]]]]), lk);
    for (let i = 0; i < 4; i++) { const q = add(lerp(c1, kn, 0.3 + i * 0.16), mul(fn, sgn * wd * (0.62 - i * 0.06))); f.part([add(q, mul(fd, -wd * 0.1)), add(add(q, mul(fn, sgn * wd * (0.4 - i * 0.05))), mul(fd, wd * 0.1)), add(q, mul(fd, wd * 0.12))], { ...lk, fill: '#3a3a2a', cast: false, inkW: 1.2 }); }
    f.line([lp(c1, kn, 0.15, -sgn * wd * 0.2), lp(c1, kn, 0.85, -sgn * wd * 0.15)], 2.4, P.adultL, { op: 0.55 });
  };
  { // ruler pass: the thorax's near side wall, seen because the body is turned toward us; the legs come out of it
    f.bone('adult');
    const PLW = Ms([[-250, 150], [-200, 228], [-120, 262], [0, 272], [120, 268], [196, 238], [200, 170], [100, 200], [0, 206], [-120, 196], [-210, 160]]);
    const pD = f.part(PLW, AD({ fill: mix(P.adult, '#6a6a50', 0.35), shadow: '#3a3a28' }));
    X.clipDraw(f, PLW, () => { for (const x of [-150, -40, 70, 160]) f.line(Ms([[x, 200], [x - 10, 240], [x - 24, 272]]), 3, '#3a3a26', { op: 0.6 }); f.flat(Ms([[-260, 245], [210, 255], [210, 300], [-260, 300]]), '#22221a', { op: 0.35 }); X.pustules(f, M(-60, 236), 40, 14, 2, 4, 6); });
  }
  const tipF = npt(uB - 0.03, kFar(uB - 0.03) - 0.02), tipN = [1600, 1290];
  aleg('aleg_f', M(70, -150), tipF, -1, 84, 120, 260); // the far foreleg down, hauling on the rim behind
  aleg('aleg_n', M(60, 170), tipN, 1, 104, 230, 230); // the near foreleg lifted clear of the rim, reaching out over it for the next hold

  // ---- the thorax: the mesonotum with its W in raised relief and the cruciform elevation, then the pronotum
  f.bone('adult');
  const MES = Ms([[-232, 0], [-214, -84], [-160, -156], [-70, -204], [20, -216], [36, -150], [36, 150], [20, 216], [-70, 204], [-160, 156], [-214, 84]]);
  f.part(MES, AD({ fill: mix(P.adult, '#aaa48a', 0.25) }));
  X.clipDraw(f, MES, () => {
    f.flat(Ms([[-240, -100], [60, -110], [60, -260], [-240, -260]]), '#22221a', { op: 0.3 }); // the left side rounding away from the light
    f.flat(Ms(ell([-50, 70], 80, 60, 0, 14)), P.adultL, { op: 0.28 }); // the lit swell of the plate
    for (const s2 of [-1, 1]) f.flat(Ms([[34, s2 * 120], [34, s2 * 190], [-80, s2 * 170], [-150, s2 * 140]]), mix(P.ven, P.adultD, 0.5), { op: 0.35 }); // venom green swelling along the sides
    for (const s2 of [-1, 1]) f.line(Ms([[34, s2 * 150], [-50, s2 * 150], [-150, s2 * 120]]), 2.2, '#5a5a40', { op: 0.6 }); // the parapsidal grooves
    // the W: a raised ridge in the plate, not a mark on it. Its cast shadow, its body, the shaded and the lit flank
    const Wc = [[-96, -112], [-176, -58], [-128, 0], [-176, 58], [-96, 112]];
    f.line(Ms(Wc).map(q => add(q, [-6, 8])), 22, '#2e2e1e', { straight: true, op: 0.4 });
    f.line(Ms(Wc), 21, INK, { straight: true, op: 0.25 });
    f.line(Ms(Wc), 17, mix(P.adult, P.adultL, 0.15), { straight: true });
    f.line(Ms(Wc).map(q => add(q, [-4, 4])), 7, mix(P.adultD, '#4a4a30', 0.4), { straight: true, op: 0.55 });
    f.line(Ms(Wc).map(q => add(q, [4, -4])), 3, '#eeead2', { straight: true, op: 0.6 });
    X.fern(f, MES, M(10, 150), 3.6, 200, 1.8, { depth: 2 });
  });
  const CRU = Ms([[-178, 0], [-206, -64], [-232, -40], [-246, 0], [-232, 40], [-206, 64]]); // the cruciform elevation at the plate's rear
  f.part(CRU, AD({ fill: mix(P.adult, '#cac6aa', 0.3) }));
  f.line(Ms([[-182, 0], [-242, 0]]), 3, '#5a5a40', { op: 0.6 }); f.line(Ms([[-196, -46], [-236, 36]]), 2.4, '#5a5a40', { op: 0.5 }); f.line(Ms([[-196, 46], [-236, -36]]), 2.4, '#5a5a40', { op: 0.5 }); f.line(Ms([[-186, 10], [-208, 54]]), 2, '#eeead2', { op: 0.6 });
  X.pustules(f, M(-110, 150), 36, 26, 3, 6, 11);
  // the pronotum: a broad shield, its lateral angles flaring at the rear; a raised collar along its rear margin; the
  // paired irregular grooves of the disc
  const PRO = Ms([[34, -222], [50, -246], [84, -240], [140, -214], [180, -186], [196, 0], [180, 186], [140, 214], [84, 240], [50, 246], [34, 222], [18, 0]]);
  f.part(PRO, AD({ fill: mix(P.adult, '#b6b296', 0.2) }));
  X.clipDraw(f, PRO, () => {
    f.flat(Ms([[0, -120], [200, -110], [200, -300], [0, -300]]), '#22221a', { op: 0.3 });
    f.flat(Ms(ell([110, 90], 50, 70, 0, 12)), P.adultL, { op: 0.3 });
    for (const s2 of [-1, 1]) { f.line(Ms([[170, s2 * 34], [128, s2 * 72], [104, s2 * 64], [72, s2 * 118]]), 4, '#4a4a32', { op: 0.6 }); f.line(Ms([[172, s2 * 38], [130, s2 * 78]]).map(q => add(q, [3, -3])), 1.6, '#eeead2', { op: 0.5 }); f.line(Ms([[160, s2 * 140], [110, s2 * 170], [70, s2 * 200]]), 3, '#4a4a32', { op: 0.5 }); } // the grooves
    f.line(Ms([[184, 0], [40, 0]]), 2.4, '#4a4a32', { op: 0.5 });
    X.pustules(f, M(120, -170), 20, 30, 2, 5, 8);
  });
  const COL = Ms([[32, -224], [50, -232], [44, 0], [50, 232], [32, 224], [14, 0]]); // the raised collar
  f.part(COL, AD({ fill: mix(P.adult, P.ven, 0.22), cast: false }));
  f.line(Ms([[50, -226], [46, 0], [50, 226]]), 2.4, P.adultL, { op: 0.7 }); f.line(Ms([[30, -220], [16, 0], [30, 220]]), 1.6, INK, { op: 0.7 });

  // ---- the head, broad and blunt, tipped toward us so we see it from above and in front: the wide-set compound eyes
  // bulging out at the sides (dark, faceted, no pupil); the vertex with three small ocelli; the frons between the eyes
  // with the antenna stubs; the ribbed postclypeus bulging forward as a raised plate with its transverse grooves
  f.bone('adult_head');
  // head frame: x across (to the right), y down toward the thorax; the head bowed toward us over the pronotum
  // (ruler pass, round 2) after a real cicada's head: very broad and short, blunt across the front; the compound eyes are
  // the head's own lateral ends, set low and flattened (wide, not tall), so they read as part of the head and never as
  // ears on top of it; the vertex a narrow band behind with the three ocelli; the postclypeus the dominant form, a great
  // swollen dome down the middle of the face, ribbed across by its grooves, lit on its near shoulder and throwing a
  // shadow over the genae; the antenna bristles in front of the eyes; the beak folded under.
  const AH0 = frame(M(262, 0), axA + Math.PI / 2 + 0.1, 1), thH = 0.85; // turned three-quarter: the near half wide, the far half foreshortened
  const AH = pts => AH0(pts.map(([x, y]) => [x >= 0 ? x * (1 + 0.26 * thH) : x * (1 - 0.66 * thH), y]));
  const HEAD = AH([[-262, -6], [-232, -58], [-160, -92], [-60, -104], [0, -106], [60, -104], [160, -92], [232, -58], [262, -6], [276, 30], [262, 70], [214, 92], [160, 104], [122, 150], [60, 168], [0, 172], [-60, 168], [-122, 150], [-160, 104], [-214, 92], [-262, 70], [-276, 30]]);
  f.flat(HEAD.map(q => add(q, [-12, 20])), '#1a1a12', { op: 0.45 }); // the head's shadow on the pronotum
  f.part(HEAD, AD({ fill: mix(P.adult, '#a8a488', 0.2) }));
  X.clipDraw(f, HEAD, () => {
    f.flat(AH([[-300, -120], [-100, -120], [-120, 200], [-300, 200]]), '#22221a', { op: 0.32 }); // the far side turned from the light
    f.flat(AH(ell([110, -74], 80, 22, 0, 12)), P.adultL, { op: 0.32 }); // the vertex lit
    f.line(AH([[-200, -50], [-90, -70], [0, -74], [90, -70], [200, -50]]), 2.4, '#4a4a32', { op: 0.55 }); // the vertex's front margin
    f.line(AH([[0, -106], [0, -74]]), 2.2, '#4a4a32', { op: 0.55 }); // the epicranial suture
    for (const s2 of [-1, 1]) { f.flat(AH(ell([s2 * 180, 96], 52, 22, 0, 10)), '#14140e', { op: 0.4 }); f.line(AH([[s2 * 140, 60], [s2 * 180, 86], [s2 * 230, 84]]), 2, '#4a4a32', { op: 0.5 }); } // the genae under the eyes, in the dome's shadow
    X.pustules(f, AH([[-170, -60]])[0], 20, 14, 2, 4, 6); X.pustules(f, AH([[190, -50]])[0], 20, 14, 2, 4, 6);
  });
  // final pass 2026-11-25: at sheet size the dark eyes at the head's upper corners still read as a mouse's ears. They now
  // sit lower on the sides inside the head's outline, ringed all round by the pale socket rim, still dull black (bible).
  const cEye = s2 => { // the compound eyes: the head's lateral ends, low, wide and flattened, dark and faceted, no pupil
    const near = s2 > 0, ec = AH([[s2 * (near ? 196 : 200), near ? 50 : 56]])[0], ea2 = axA + Math.PI / 2 + 0.1 + s2 * 0.16, ex = near ? 1.1 : 0.78, rx = 60 * ex, ry = near ? 38 : 28; // (final pass) set lower and inside the head's outline, rimmed all round, so they never read as ears
    const ee = ell(ec, rx, ry, ea2, 24).map((q, i) => { const t = i / 24 * Math.PI * 2, inner = Math.max(0, Math.cos(t - (near ? Math.PI : 0))) ** 2 * 0.22; return lerp(q, ec, inner); }); // flattened on the side toward the face, where it sits in the head
    f.part(ee, { fill: near ? '#2e2e24' : '#24241a', shadow: '#0c0c08', light: '#6e6c58', shade: 0.5, maxShade: 26, tex: 'facet' + f.o.seed, texOp: 0.7, inkW: 1.4, inkHeavy: 2.4, cast: false });
    X.clipDraw(f, ee, () => {
      for (let r = -3; r <= 3; r++) for (let c2 = -6; c2 <= 6; c2++) { const q = add(ec, rot([(c2 * 13 + (r % 2) * 6.5) * ex, r * 14], ea2)); f.line(ell(q, 5.5 * Math.max(0.6, ex), 5.5, 0, 6).concat([ell(q, 5.5 * Math.max(0.6, ex), 5.5, 0, 6)[0]]), 0.8, '#7a7864', { op: 0.3 }); } // the facets
      f.flat(ell(add(ec, rot([s2 * 8 * ex, -14], ea2)), 44 * ex, 14, ea2, 12), '#c8c4a8', { op: 0.3 }); // a dull broad sheen along its top, no glint
      f.flat(ell(add(ec, rot([-s2 * 10 * ex, 26], ea2)), 60 * ex, 24, ea2, 12), '#000', { op: 0.4 });
    });
    const rim = ell(ec, rx + 4, ry + 4, ea2, 24); f.line(rim.concat([rim[0]]), 5, '#8a8670', { op: 0.55 }); f.line(rim.slice(14, 22), 2.4, '#d8d4b8', { op: 0.5 }); // the socket's rim where the head's cuticle meets the eye
  };
  cEye(-1); // the far eye first: the face's dome overlaps its inner edge, as in a three-quarter view
  for (const [x, y] of [[0, -90], [-26, -76], [26, -76]]) { const c = AH([[x, y]])[0]; f.part(ell(c, 9, 7, axA, 10), { fill: '#5a5440', shadow: '#1e1c14', light: '#8a826a', shade: 0.45, inkW: 1.1, inkHeavy: 1.5, cast: false, hatch: false }); f.flat(ell(add(c, [2, -2]), 2.6, 2, 0, 6), '#b4ae94', { op: 0.45 }); } // the three ocelli on the vertex, small and dull
  for (const s2 of [-1, 1]) { const a0 = AH([[s2 * 150, -36]])[0]; f.part(ell(a0, 11, 9, axA, 10), AD({ fill: '#6a6a52', cast: false, inkW: 1.1 })); const b1 = AH([[s2 * 176, -14], [s2 * 196, 6]]); f.line([a0, ...b1], 4.6, INK); f.line([a0, ...b1], 2.2, '#6a6a52'); } // the antenna bristles in front of the eyes
  // the postclypeus: the dominant form, a swollen dome down the middle of the face from the vertex to past the head's
  // front, its grooves curving round it, lit on its near shoulder, its far flank and underside in shadow
  const PC = AH([[-126, -26], [-72, -44], [0, -50], [72, -44], [126, -26], [150, 30], [146, 96], [120, 160], [78, 206], [30, 228], [0, 232], [-30, 228], [-78, 206], [-120, 160], [-146, 96], [-150, 30]]);
  f.raw(`<path d="${E.smooth(PC.map(q => add(q, [-22, 26])))}" fill="#0e0e0a" opacity="0.55" filter="url(#puff${sd})"/>`); // its shadow thrown on the genae and pronotum
  f.part(PC, AD({ fill: mix(P.adult, '#a09c7e', 0.3), shade: 0.48, maxShade: 60 }));
  X.clipDraw(f, PC, () => {
    for (let k = 0; k < 8; k++) { const y = -26 + k * 30, ww = 146 - Math.max(0, y - 60) * 0.6, sag = 14 + k * 1.5; f.line(AH([[-ww, y], [-ww * 0.5, y + sag * 0.8], [0, y + sag], [ww * 0.5, y + sag * 0.8], [ww, y]]), 5, '#34341f', { op: 0.75 }); f.line(AH([[4, y + sag + 6], [ww * 0.5, y + sag * 0.8 + 6], [ww * 0.95, y + 6]]), 2.4, '#f0ecd4', { op: 0.6 }); f.line(AH([[-ww * 0.95, y + 6], [-ww * 0.5, y + sag * 0.8 + 6], [-4, y + sag + 6]]), 1.4, '#c8c4aa', { op: 0.25 }); } // each groove, the ridge below it lit
    f.line(AH([[0, -50], [0, 230]]), 3.6, '#34341f', { op: 0.55 }); // the median groove
    f.flat(AH([[-170, -100], [-56, -100], [-40, 250], [-170, 250]]), '#1a1a12', { op: 0.36 }); // the dome's far flank turning from the light
    f.flat(AH([[-170, 150], [170, 150], [170, 260], [-170, 260]]), '#1a1a12', { op: 0.3 }); // its underside
    f.raw(`<path d="${E.smooth(AH(ell([58, 40], 46, 80, 0, 12)))}" fill="#f6f2da" opacity="0.32" filter="url(#puff${sd})"/>`); // the lit shoulder of the dome
  });
  cEye(1); // the near eye
  f.part(AH([[-40, 224], [40, 224], [32, 260], [0, 272], [-32, 260]]), AD({ fill: '#7a7a5e', cast: false, inkW: 1.2 })); // the anteclypeus, the beak folding under it
  f.line(AH([[-28, 244], [28, 244]]), 1.6, '#3a3a28', { op: 0.6 });

  // ---- the near forewing, still crumpled and wet, hanging down the right flank over the shell's lip; the shell and
  // the body show through it
  f.bone('wing_n');
  X.cicadaWing(f, WRn, axA + Math.PI - 0.2, 660, 300, { tr: -1, tears: [[0.6, 0.07]], chunk: [0.66, 0.72], crumple: 1, op: 0.22, beads: 5 });
  f.part(ell(WRn, 26, 18, axA, 10), AD({ fill: '#6a6a50', cast: false, inkW: 1.2 })); // the tegula over the wing root
  for (let i = 0; i < 3; i++) X.drip(f, add(WRn, rot([R(f, 300, 600), R(f, -60, 60)], axA + Math.PI - 0.2)), 2.2, mix(P.venP, '#fff', 0.3));

  // ---- the nymph's head, blunt and lowered to the road: the frons bulging forward with its ribs, a small dull eye,
  // the beak folded under; and the near foreleg hooked over the setts, the weight on it
  f.bone('shell');
  const HC = add(NC[0], [40, 30]), ha = 0.62, HF = frame(HC, ha, 1);
  const NHP = HF([[-150, -140], [-40, -172], [60, -152], [130, -104], [164, -20], [154, 62], [104, 122], [0, 150], [-110, 142], [-162, 40]]);
  f.part(NHP, NY());
  X.clipDraw(f, NHP, () => { f.flat(HF([[-170, 30], [180, 40], [180, 160], [-170, 160]]), '#000', { op: 0.25 }); for (let i = 0; i < 6; i++) f.flat(X.lumpy(f, ell(HF([[R(f, -110, 120), R(f, 0, 120)]])[0], R(f, 8, 18), R(f, 5, 10), 0, 8), 2), P.earth, { op: 0.6 }); X.burn(f, HF([[-80, -130]])[0], ha + 1.3, 200, 2.2, { depth: 2 }); f.line(HF([[-150, -40], [-40, -60], [60, -40]]), 2, '#a8946e', { op: 0.3 }); });
  const FR = HF([[40, -128], [118, -98], [162, -20], [152, 62], [108, 118], [64, 96], [82, 0]]);
  f.part(FR, NY({ fill: '#463c31' }));
  X.clipDraw(f, FR, () => { for (let k = 0; k < 6; k++) { f.line(HF([[60 + k * 17, -110 + k * 6], [74 + k * 17, -10], [60 + k * 17, 100 - k * 6]]), 3.4, '#0c0a08', { op: 0.65 }); f.line(HF([[66 + k * 17, -104 + k * 6], [80 + k * 17, -10]]), 1.6, '#9a8462', { op: 0.45 }); } });
  X.ceye(f, HF([[-62, -108]])[0], 34, 24, ha + 0.3, { col: '#1e1b16', glints: 0, kidney: 0.2 });
  X.antenna(f, [HF([[20, -150]])[0], HF([[60, -200]])[0], HF([[120, -214]])[0]], 7, NY({ fill: '#3a3229' }), { n: 8 });
  f.part(X.ribbon([HF([[110, 120]])[0], HF([[40, 180]])[0], HF([[-60, 200]])[0]], t => 30 - t * 16), NY({ fill: '#463c31', cast: false })); // the beak folded under
  for (let i = 0; i < 10; i++) { const b0 = npt(R(f, 0.55, 0.9), 0.9); const pts = [b0]; let q = b0; for (let k = 0; k < 4; k++) { q = add(q, [R(f, -14, 14), R(f, 24, 44)]); pts.push(q); } f.line(pts, R(f, 2.4, 5), '#3a2e22'); } // roots hanging off the husk
  f.bone('foreleg_n');
  cobble([1880, 2378], 190, 80, 0.45);
  foreleg(npt(0.14, 0.9), [1700, 2270], [1860, 2330], [1910, 2372], 150, true);
  const hk = [1720, 2190], HKF = frame(add(hk, [-10, -60]), -0.6, 1.2);
  f.part(HKF([[-40, -10], [-10, -22], [30, -18], [44, 0], [30, 16], [-10, 20], [-40, 10]]), { fill: '#8a7a5a', shadow: '#3a2e1e', light: '#c8b88e', shade: 0.38, inkW: 1.2, cast: false });
  f.line(HKF([[-30, -16], [24, -16]]), 2.4, '#2a2014'); for (const s2 of [-1, 1]) f.line(HKF([[10, s2 * 14], [18, s2 * 34], [30, s2 * 38]]), 2.4, '#5a4a32'); // a small cicada's empty husk, split down its back

  // ---- the near road: heaved setts round the hole, a cart wheel turned up with the stones, clods, loose stones
  f.bone('stones');
  road(true);
  const WC = [560, 2400], rimE = ell(WC, 80, 150, -0.3, 32);
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, e2 = add(WC, rot([Math.cos(a) * 76, Math.sin(a) * 144], -0.3)); f.line([WC, e2], 10, INK); f.line([WC, e2], 6, P.wood); }
  f.line(rimE.concat([rimE[0]]), 28, INK); f.line(rimE.concat([rimE[0]]), 22, P.woodD); f.line(rimE.slice(20, 30), 4, P.woodL, { op: 0.5 });
  const rimI = ell(WC, 90, 160, -0.3, 32); f.line(rimI.concat([rimI[0]]), 9, INK); f.line(rimI.concat([rimI[0]]), 5, P.ironL);
  f.part(ell(WC, 22, 34, -0.3, 10), X.WD(f));
  for (let i = 0; i < 16; i++) f.part(X.lumpy(f, ell([R(f, 620, 1500), R(f, 2380, 2560)], R(f, 10, 26), R(f, 8, 14), R(f, 0, 3), 9), 3), EA()); // clods

  f.bone('adult');
  for (const [p, a] of [[[1640, 1300], 2.6], [[860, 1200], -0.4], [[1600, 1560], 3.4], [[1520, 860], 2.2], [[780, 1500], 0.6]]) X.miniWasp(f, p, a, 1.5); // wasps circling the soft new body
  f.bone('root');
  return f;
}

// ------------------------------------------------------------------ THE PROCESSION (ruler, 3.5 to the saint's head)
// A pilgrim procession on the plain road and the painted wooden saint they carried on a float: twelve pilgrims shoulder
// to shoulder under the carrying poles, the saint standing above them, cropped by the frame top; moving left at a slow
// sway, the weight in the bearers' bent knees. Lightning struck the saint's iron halo and ran down the statue and the
// poles into every bearer: one fern crosses all their backs as a single pattern, and the poles are scorched and fused
// into their shoulders, so the bearers have grown together into one mass of bowed backs and legs. The hive filled the
// hollow statue with grey paper comb, spilling over the float's edge onto the bearers; their skin swells and shifts with
// larvae, their muscles are locked with venom, their heads loll. Canvas 2400 x 2400 at the game's pixel scale.
// Every bearer comes from one builder with a persona (face, age, build, height, dress, hat, affliction, what the free hand
// does), so no two are clones; the limbs carry forearm and calf modelling (kit mArm / mLeg).
// Rig: mass (root) + bearer_1..12 (mass, pivot at the feet: the sway) + float (mass, on the poles) + saint (float) +
// saint_head (saint, the nod) + banner, votives (float). Motion: idle a slow sway, the saint nodding; attack the
// procession lurches a step forward as the float tips and brings the saint down on the front rank (float, saint).
function pilgrim(f, x0, per, PY, o = {}) {
  const gy = f.o.groundY, s = per.h, H = 96 * s, sd = f.o.seed, far = !!o.far, dim = far ? 0.36 : 0;
  const tint = c => mix(c, '#14121a', dim);
  const skin = tint(mix(P.skin, per.skin || '#9a7a5a', 0.34)), SKN = (x = {}) => X.SKX(f, Object.assign({ fill: skin, shadow: tint('#3e3028'), shade: 0.3 }, x));
  const cl = tint(mix('#7a746a', P.ven, per.green || 0)), CL = (x = {}) => X.CLK(f, Object.assign({ fill: cl, shadow: '#16140f', light: mix(cl, '#fff', 0.25), tex: 'weave' + sd, texOp: 0.5 }, x));
  const tun = tint(per.tunic || '#6a645a'), TU = (x = {}) => X.CLK(f, Object.assign({ fill: tun, shadow: '#14120e', light: mix(tun, '#fff', 0.25), tex: 'weave' + sd, texOp: 0.45 }, x));
  const bw = per.build === 'stout' ? 1.14 : per.build === 'lean' ? 0.88 : 1;
  // the bend: the shoulder must meet the pole, so a taller bearer bends further
  const kb = per.knee ?? 1, st = per.stride ?? 0, stb = per.stumble ? 1 : 0; // stride: the near foot forward (+) or back; stumble: the near knee buckling
  const AN = [x0 + 30 * s + st, gy - 44 * s], AF = [x0 - 50 * s - st * 0.7 - (per.trail || 0), gy - 42 * s];
  const KN = [x0 + 64 * s * kb + st * 0.55 + stb * 40, gy - 190 * s + stb * 60], KF = [x0 - 4 * s * kb - st * 0.35 - (per.trail || 0) * 0.5, gy - 196 * s];
  const hipY = gy - 300 * s * (1.04 - kb * 0.08) + stb * 40, HN = [x0 - 6 * s, hipY + 6], HF = [x0 - 30 * s, hipY], Pv = [x0 - 18 * s, hipY];
  const tl = 192 * s, dy = hipY - (PY + 26 * s), lean = Math.sqrt(Math.max(0, tl * tl - dy * dy)), N0 = [Pv[0] + lean, PY + 26 * s];
  const S = B.spine(N0, add(lerp(N0, Pv, 0.45), [(-20 + (per.lean || 0)) * s, -44 * s]), Pv, H); // the back bowed up under the pole
  const hA = per.loll ?? 1.1, HC = add(N0, [66 * s, 64 * s]), hF = frame(HC, hA, H); // the head hanging forward and down, clear below the pole
  const SN = S.at(0.05, 0.14), SF = S.at(0.3, 0.1);
  const grip = per.grip ?? 'near'; // which hand is up on the pole (the other hangs, locked)
  const WP = [N0[0] + 26 * s, PY - 2];
  const EN = grip === 'near' ? [SN[0] + 66 * s, SN[1] + 30 * s] : [SN[0] + 14 * s, SN[1] + 104 * s], WN = grip === 'near' ? WP : add(EN, [44 * s, 86 * s]);
  const EF = grip === 'far' ? [SF[0] + 64 * s, SF[1] + 26 * s] : [SF[0] + 18 * s, SF[1] + 100 * s], WF = grip === 'far' ? add(WP, [24 * s, -4]) : add(EF, [36 * s, 84 * s]);
  const look = { SKN, CL, TU };
  const R2 = (a, b) => a + (b - a) * f.r();
  // ---- far leg and far arm
  X.mLeg(f, HF, KF, AF, [76 * s * bw, 56 * s * bw, 34 * s * bw], SKN({ fill: mix(skin, '#000', 0.15) }), { swell: per.swell || 0.2 });
  B.bareFoot(f, AF, 1, 44 * s, mix(skin, '#000', 0.15), { swell: 0.6, shadow: tint('#3e3028'), tex: 'mottle' + sd });
  X.mArm(f, SF, EF, WF, [40 * s * bw, 34 * s * bw, 24 * s], SKN({ fill: mix(skin, '#000', 0.18) }), {});
  if (grip === 'far') X.knuckleFist(f, WF, ang(EF, WF), 20 * s, mix(skin, '#000', 0.18), { shadow: tint('#3e3028'), tex: 'mottle' + sd });
  // ---- the body: a knee-length tunic under a pilgrim's cloak, a scrip on its strap
  const TOR = S.shape([[0, 0.38, 0.3], [0.14, 0.62 * bw, 0.46 * bw], [0.4, 0.6 * bw, 0.5 * bw], [0.7, 0.54 * bw, 0.5 * bw], [1.0, 0.58 * bw, 0.54 * bw]]);
  const SKIRT = [S.at(-0.66 * bw, 0.86), S.at(0.6 * bw, 0.86), add(KN, [24 * s, -10 * s]), ...X.hemLine(f, add(KN, [26 * s, 24 * s]), add(KF, [-40 * s, 34 * s]), 5, 10 * s), add(KF, [-50 * s, -20 * s])];
  f.part(SKIRT, TU());
  X.clipDraw(f, SKIRT, () => { for (let i = 0; i < 3; i++) f.stroke([lerp(S.at(-0.4, 0.95), S.at(0.4, 0.95), i / 2), lerp(KF, KN, i / 2)], 2.6 * s, '#100e0a', { op: 0.5 }); f.flat([[x0 - 120 * s, KN[1] - 10], [x0 + 140 * s, KN[1] - 10], [x0 + 140 * s, gy], [x0 - 120 * s, gy]], P.mud, { op: 0.3 }); });
  f.part(TOR, TU());
  // the cloak over the shoulders and down the back, its edge frayed
  const CK = [S.at(-0.1, -0.06), S.at(0.34, 0.0), S.at(0.66 * bw, 0.2), S.at(0.6 * bw, 0.46), S.at(0.3, 0.56), ...X.hemLine(f, S.at(0.0, 0.74), S.at(-0.8 * bw, 0.7), 4, 10 * s), S.at(-0.8 * bw, 0.2), S.at(-0.6, -0.02)];
  f.part(CK, CL());
  X.wear(f, CK, 3, { hem: false });
  X.clipDraw(f, CK, () => { for (let i = 0; i < 3; i++) f.stroke([S.at(-0.5 + i * 0.3, 0.05), S.at(-0.6 + i * 0.3, 0.6)], 2.4 * s, '#100e0a', { op: 0.5 }); if (per.green) f.flat(X.lumpy(f, ell(S.at(-0.2, 0.4), 40 * s, 50 * s, 0, 10), 6), mix(P.ven, '#2a2a1a', 0.3), { op: 0.35 }); });
  // the strap of the scrip across the chest and the scrip at the hip
  f.line([S.at(0.3, 0.02), S.at(-0.5, 0.86)], 5 * s, tint('#3a2c20'));
  const sc = S.at(-0.56 * bw, 0.96);
  f.part([add(sc, [-18 * s, 0]), add(sc, [18 * s, -2]), add(sc, [20 * s, 34 * s]), add(sc, [-16 * s, 36 * s])], X.CLK(f, { fill: tint('#5a4636'), shadow: '#1a120c', tex: 'wrinkle' + sd }));
  f.part([add(sc, [-18 * s, 0]), add(sc, [18 * s, -2]), add(sc, [12 * s, 14 * s]), add(sc, [-14 * s, 14 * s])], X.CLK(f, { fill: tint('#3e3024'), cast: false, inkW: 1 }));
  if (per.gourd) { const gc = S.at(-0.3, 1.02); f.line([gc, add(gc, [2, 16 * s])], 2, '#5a4a30'); f.part([add(gc, [-6 * s, 14 * s]), add(gc, [8 * s, 14 * s]), add(gc, [14 * s, 32 * s]), add(gc, [10 * s, 52 * s]), add(gc, [-4 * s, 58 * s]), add(gc, [-12 * s, 40 * s])], { fill: tint('#8a7a52'), shadow: '#3a2e1a', light: '#b8a676', shade: 0.42, tex: 'mottle' + sd, texOp: 0.5, inkW: 1.2 }); }
  // ---- the near leg: bare from under the tunic, the calf swollen and knotted, the foot bare and swollen
  const lg = X.mLeg(f, HN, KN, AN, [82 * s * bw, 58 * s * bw, 36 * s * bw], SKN(), { swell: per.swell || 0.2 });
  if (per.wraps) { for (let i = 0; i < 5; i++) f.line([lp(KN, AN, 0.36 + i * 0.1, -20 * s), lp(KN, AN, 0.42 + i * 0.1, 18 * s)], 2 * s, tint('#4a4238'), { op: 0.8 }); }
  if (per.aff === 'larvae') { const c = lp(KN, AN, 0.34, -10 * s); f.flat(ell(add(c, [2, 6]), 12 * s, 6 * s, 1.3, 10), '#3a2c26', { op: 0.35 }); f.flat(ell(c, 10 * s, 5 * s, 1.3, 10), mix(skin, '#fff', 0.3), { op: 0.4 }); f.line([add(c, [-6, -8]), add(c, [4, -12])], 1.2, '#f0e8d8', { op: 0.6 }); } // larvae lifting the skin of the calf
  B.bareFoot(f, AN, 1, 46 * s, skin, { swell: 0.8, shadow: tint('#3e3028'), tex: 'mottle' + sd });
  // the skirt's front over the near thigh
  f.part([S.at(0.0, 0.9), S.at(0.56 * bw, 0.88), add(KN, [26 * s, -6 * s]), ...X.hemLine(f, add(KN, [30 * s, 26 * s]), add(KN, [-40 * s, 30 * s]), 3, 8 * s), lerp(HN, KN, 0.4)], TU({ fill: mix(tun, '#000', 0.06) }));
  // ---- the head: bowed under the pole, lolling; hair standing stiff under the brim; the hat or hood per persona
  f.part(limb(add(N0, [-14 * s, -6 * s]), add(HC, rot([-16 * s, 30 * s], hA)), 50 * s, 42 * s, { steps: 4 }), SKN()); f.line([add(N0, [0, 4 * s]), add(HC, rot([-20 * s, 20 * s], hA))], 2, '#2a2018', { op: 0.6 }); // the neck stretched forward, its cords standing
  if (per.aff === 'swollen') { const g = add(N0, [20 * s, -10 * s]); f.part(X.lumpy(f, ell(g, 30 * s, 22 * s, 0.4, 12), 3), SKN({ fill: mix(skin, P.venP, 0.25), shade: 0.3 })); X.pustules(f, g, 18 * s, 12 * s, 3, 3 * s, 5 * s); }
  const hp = Object.assign({ skin, jaw: 1, chin: 0, nose: 1, hook: 0, mouth: 'set', squint: 0.4, browDown: 0.04, hairCol: tint('#3a3028'), faceShade: 0.8 }, per.face, { rolled: per.rolled ?? true, slack: per.slack ?? true });
  const HF2 = X.pHead(f, HC, H, hA, hp);
  if (per.weal) X.weal(f, HF2([per.weal])[0], 6 * s);
  if (per.hat === 'broad') {
    // the broad hat fallen back off the bowed head, hanging on its cord across the upper back, badges pinned on the brim
    X.stiffMane(f, HF2, Math.PI * 0.85, Math.PI * 1.9, 0.24, tint(per.face.hairCol || '#4a3e32'), { n: 9, taper: t => 0.6 + Math.sin(t * Math.PI) * 0.6 });
    const hc = S.at(-0.62, 0.5), ba = Math.atan2(N0[1] - Pv[1], N0[0] - Pv[0]);
    f.line([HF2([[-0.2, 0.3]])[0], lerp(HF2([[-0.2, 0.3]])[0], hc, 0.5), add(hc, rot([40 * s, 0], ba))], 2, tint('#3a2c20'));
    const brim = ell(hc, 62 * s, 24 * s, ba, 22), hcol = tint(per.hatCol || P.felt);
    f.part(brim, X.CLK(f, { fill: hcol, shadow: mix(hcol, '#0e0c0a', 0.55), light: mix(hcol, '#fff', 0.25), tex: 'mottle' + sd, texOp: 0.6, shade: 0.28 }));
    f.part(ell(add(hc, rot([0, -8 * s], ba)), 32 * s, 18 * s, ba, 16), X.CLK(f, { fill: mix(hcol, '#000', 0.2), shadow: '#0e0c0a', tex: 'mottle' + sd, cast: false }));
    f.line(ell(hc, 72 * s, 26 * s, ba, 22).slice(12, 20), 1.6, mix(hcol, '#fff', 0.3), { op: 0.5 });
    for (let k = 0; k < (per.badges || 0); k++) X.leadBadge(f, add(hc, rot([(-40 + k * 34) * s, 14 * s], ba)), 7 * s, ba);
    if (per.hatHole) X.scorch(f, add(hc, rot([10 * s, -6 * s], ba)), 14 * s, 8 * s, 0.6);
  } else if (per.hat === 'hood') {
    f.part(HF2([[-0.56, 0.2], [-0.58, -0.2], [-0.42, -0.58], [-0.08, -0.74], [0.26, -0.68], [0.44, -0.46], [0.46, -0.24], [0.34, -0.38], [0.04, -0.48], [-0.22, -0.4], [-0.3, -0.06], [-0.32, 0.3], [-0.46, 0.46]]), CL({ fill: mix(cl, '#000', 0.08) }));
    X.stiffMane(f, HF2, Math.PI * 1.55, Math.PI * 1.75, 0.18, tint('#4a3e32'), { n: 2, r: 0.34 });
    if (per.badges) X.leadBadge(f, HF2([[-0.3, -0.5]])[0], 6 * s, -0.3);
  } else if (per.hat === 'kerchief') {
    f.part(HF2([[-0.4, 0.0], [-0.36, -0.36], [-0.14, -0.54], [0.16, -0.54], [0.36, -0.36], [0.4, -0.2], [0.2, -0.3], [-0.1, -0.34], [-0.3, -0.18], [-0.36, 0.1], [-0.56, 0.3], [-0.6, 0.12]]), CL({ fill: tint(per.hatCol || '#6a6458') }));
    X.stiffMane(f, HF2, Math.PI * 0.86, Math.PI * 1.0, 0.18, tint(per.face.hairCol || '#4a3e32'), { n: 3, r: 0.4 });
  } else {
    X.stiffMane(f, HF2, Math.PI * 0.85, Math.PI * 1.9, 0.26, tint(per.face.hairCol || '#4a3e32'), { n: 10, taper: t => 0.6 + Math.sin(t * Math.PI) * 0.6 });
  }
  if (per.aff === 'larvae') { X.hole(f, HF2([[0.06, 0.16]])[0], 5 * s, 4 * s, hA); X.grub(f, add(HF2([[0.06, 0.16]])[0], [2, 3]), hA + 1.2, 0.4 * s, { curl: 0.4 }); }
  // ---- the near arm: up to the pole (the hand fused round it) or hanging with a rosary wound round the wrist
  const sleeve = per.sleeve ?? 0.5;
  X.mArm(f, SN, EN, WN, [44 * s * bw, 38 * s * bw, 27 * s], SKN(), { build: per.build === 'lean' ? 'lean' : per.build === 'stout' ? 'stout' : undefined });
  f.part(K.ragLimb(f, add(SN, [-4, -6]), lerp(SN, EN, 0.3 + sleeve * 0.6), 54 * s * bw, 48 * s * bw, { depth: 7 * s, teeth: 4 }), TU());
  if (per.aff === 'larvae') for (const t of [0.4, 0.62]) { const c = lerp(EN, WN, t); f.flat(ell(c, 9 * s, 5 * s, ang(EN, WN), 10), mix(skin, '#fff', 0.3), { op: 0.5 }); f.flat(ell(add(c, [2, 5]), 9 * s, 4 * s, ang(EN, WN), 10), '#3a2c30', { op: 0.35 }); }
  if (grip === 'near') X.knuckleFist(f, WN, ang(EN, WN), 21 * s, skin, { shadow: tint('#3e3028'), tex: 'mottle' + sd });
  else { X.openHand(f, WN, ang(EN, WN), 46 * s, { look: SKN(), back: true, curl: 0.6, spread: 0.08, swell: 0.3 }); }
  if (per.rosary) { const rc = lerp(EN, WN, 0.88); for (let i = 0; i < 9; i++) f.part(ell(add(rc, rot([12 * s, 0], i * 0.7)), 3 * s, 3 * s, 0, 6), { fill: tint('#3a2a20'), shade: 0.3, inkW: 0.8, cast: false, hatch: false }); f.line([add(rc, [0, 10 * s]), add(rc, [2, 34 * s])], 1.4, tint('#3a2a20')); f.line([add(rc, [-4, 30 * s]), add(rc, [8, 30 * s])], 2.4, tint('#6a6a6e')); f.line([add(rc, [2, 26 * s]), add(rc, [2, 40 * s])], 2.4, tint('#6a6a6e')); } // the rosary and its cross, round the wrist
  return { N0, SN, SF, HC, TOR, CK, WN, WF, EN, EF, s, grip, skin, tint };
}

function procession() {
  const seed = 1020, w = 2400, h = 2400;
  const f = new Fig(X.base(seed, h, { grimeY: 2050 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed, PY = 1934, PYf = 1904;
  const WDS = (o = {}) => Object.assign({ fill: '#5a4a38', shadow: '#1e160e', light: '#8a765a', shade: 0.42, tex: 'wood' + sd, texOp: 0.55 }, o);
  const PAINT = (o = {}) => Object.assign({ fill: '#6e6a62', shadow: '#26221e', light: '#a49e90', shade: 0.4, tex: 'wood' + sd, texOp: 0.35 }, o);
  // twelve personas: face, age, build, height, headgear, affliction, which hand is up on the pole
  const PER = [
    { stride: 60, lean: 10, h: 0.9, build: 'stout', face: { jaw: 1.2, nose: 1.15, age: true, beard: 'full', beardCol: '#4a4036', hairCol: '#4a4036' }, hat: 'broad', badges: 2, aff: 'swollen', gourd: true, grip: 'near', loll: 1.0 },
    { stride: -20, trail: 60, lean: -20, h: 1.12, build: 'lean', face: { jaw: 0.94, nose: 1.1, hook: 0.3, age: true, gaunt: true, hairCol: '#8a847a', beard: 'stubble', beardCol: '#6a645a' }, hat: 'bare', aff: 'larvae', grip: 'far', rosary: true, loll: 1.25, wraps: true, knee: 0.9 },
    { stride: 30, stumble: true, lean: 24, h: 0.86, build: 'mid', face: { jaw: 0.9, chin: 0.02, nose: 0.95, lips: true, lashes: true, hairCol: '#3a2a20' }, hat: 'kerchief', hatCol: '#6a6458', aff: 'swollen', grip: 'near', green: 0.3, loll: 0.9, skin: '#a8826a', rolled: false },
    { stride: 80, lean: -10, h: 1.06, build: 'broad', face: { jaw: 1.25, nose: 1.2, browDown: 0.12, age: true, beard: 'short', beardCol: '#2a221c', hairCol: '#2a221c', scar: [[0.1, -0.24], [0.2, -0.04]] }, hat: 'broad', hatCol: '#4a4438', badges: 1, aff: 'larvae', gourd: true, grip: 'near', loll: 1.05, knee: 1.1 },
    { stride: -40, trail: 40, lean: 30, h: 0.94, build: 'lean', face: { jaw: 1.0, nose: 1.05, age: true, gaunt: true, hairCol: '#c8c0b0', beard: 'full', beardCol: '#c8c0b0' }, hat: 'hood', badges: 1, aff: 'swollen', grip: 'far', rosary: true, green: 0.45, loll: 1.3, swell: 0.5 },
    { stride: 20, stumble: true, lean: -14, h: 1.0, build: 'stout', face: { jaw: 1.1, nose: 1.0, chin: 0.02, hairCol: '#5a4030', beard: 'stubble', beardCol: '#3a2a20' }, hat: 'broad', badges: 3, aff: 'larvae', grip: 'near', hatHole: [0.0, -0.66], wraps: true, loll: 0.95, knee: 0.95 },
  ];
  const farP = [
    { stride: 40, h: 1.02, build: 'mid', face: { jaw: 1.05, nose: 1.1, age: true, hairCol: '#3a3028' }, hat: 'broad', aff: 'swollen', grip: 'far', loll: 1.0 },
    { stride: -30, trail: 50, h: 0.88, build: 'stout', face: { jaw: 1.15, nose: 1.0, hairCol: '#2a2420', beard: 'full', beardCol: '#2a2420' }, hat: 'hood', aff: 'larvae', grip: 'near', loll: 1.1 },
    { stride: 70, h: 1.1, build: 'lean', face: { jaw: 0.95, nose: 1.2, hook: 0.4, age: true, hairCol: '#9a948a' }, hat: 'bare', aff: 'larvae', grip: 'far', loll: 1.2 },
    { stride: 0, stumble: true, h: 0.96, build: 'broad', face: { jaw: 1.2, nose: 1.05, hairCol: '#4a3a2a', beard: 'stubble', beardCol: '#3a2a20' }, hat: 'kerchief', hatCol: '#5a5448', aff: 'swollen', grip: 'near', loll: 0.95 },
    { stride: 50, h: 0.9, build: 'mid', face: { jaw: 0.92, nose: 0.95, lips: true, hairCol: '#2a1e18' }, hat: 'hood', aff: 'swollen', grip: 'far', loll: 1.05, green: 0.4 },
    { stride: -10, trail: 30, h: 1.06, build: 'lean', face: { jaw: 1.0, nose: 1.1, age: true, gaunt: true, hairCol: '#6a645a' }, hat: 'broad', aff: 'larvae', grip: 'near', loll: 1.15 },
  ];
  const XS = [450, 690, 980, 1190, 1470, 1740], XF = [600, 830, 1080, 1330, 1580, 1860];
  f.joint('mass', [1150, gy], null);
  XS.forEach((x, i) => f.joint('bearer_' + (i + 1), [x, gy], 'mass')); XF.forEach((x, i) => f.joint('bearer_' + (i + 7), [x, gy - 20], 'mass'));
  f.joint('float', [1220, PY], 'mass').joint('saint', [1220, 1420], 'float').joint('saint_head', [1220, 330], 'saint').joint('banner', [2050, 1860], 'float').joint('votives', [1220, 1880], 'float');
  // one fern across every back: drawn once into a buffer, then a copy clipped into each bearer's back
  const fernBuf = (() => { const i0 = f.out.length; X.lichtenberg(f, [2060, 1950], Math.PI + 0.03, 1800, 5, { col: P.scar, lite: P.scarL, depth: 3, fork: 0.85 }); X.lichtenberg(f, [1300, 1940], 1.7, 380, 3, { col: P.scar, lite: P.scarL, depth: 2 }); return f.out.splice(i0).join('\n'); })();
  const fernInto = (region) => { const id = f.id('fn'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(region)}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${fernBuf}</g>`); };

  // ---- the far pole and the far rank, behind
  f.bone('float');
  f.part(limb([330, PYf], [2110, PYf - 6], 30, 30, { steps: 16, capK: 0.4 }), WDS({ fill: '#3e3226' }));
  XF.forEach((x, i) => { f.bone('bearer_' + (i + 7)); const B0 = pilgrim(f, x, farP[i], PYf, { far: true }); fernInto(B0.CK); });

  // ---- the float: a deck on the poles with carved side boards and a scorched fringe; the carved plinth; candles
  f.bone('float');
  const DK = [[360, 1836], [2090, 1820], [2100, 1900], [360, 1916]];
  f.part(DK.map(q => [...q, 1]), WDS());
  X.clipDraw(f, DK, () => { for (let i = 0; i < 12; i++) { const x = 400 + i * 142; f.part([[x, 1846], [x + 112, 1844], [x + 112, 1898], [x, 1900]].map(q => [...q, 1]), WDS({ fill: '#4a3c2c', cast: false, inkW: 1.2 })); f.line([[x + 56, 1852], [x + 56, 1892]], 2, '#1e160e', { op: 0.6 }); f.line(ell([x + 56, 1874], 30, 16, 0, 12).slice(10, 18), 2, '#8a765a', { op: 0.5 }); } for (let i = 0; i < 8; i++) X.scorch(f, [R(f, 400, 2060), R(f, 1840, 1900)], R(f, 30, 60), 20, 0.5); X.burn(f, [2060, 1860], Math.PI, 1600, 2, { depth: 2 }); }); // carved arcading, scorched
  const SKR = [[360, 1906, 1], [2100, 1890, 1], ...X.hemLine(f, [2100, 1930], [360, 1946], 36, 10)];
  f.part(SKR, X.CLK(f, { fill: '#5a5446', shadow: '#16140f', light: '#8a8478', tex: 'weave' + sd }));
  X.clipDraw(f, SKR, () => { for (let i = 0; i < 9; i++) X.scorch(f, [R(f, 400, 2060), 1930], R(f, 30, 60), 12, 0.6); });
  X.hemThreads(f, SKR.slice(2, 40), '#2a2622', 16);
  // the plinth: stepped carved wood, painted once, flaking; a split in it packed with grey comb, spilling over the edge
  const PL1 = [[1000, 1840], [1440, 1840], [1440, 1760], [1000, 1760]], PL2 = [[1040, 1760], [1400, 1760], [1400, 1490], [1040, 1490]], PL3 = [[1016, 1490], [1424, 1490], [1424, 1420], [1016, 1420]];
  for (const pl of [PL1, PL2, PL3]) { f.part(pl.map(q => [...q, 1]), PAINT({ fill: '#5e584e' })); X.clipDraw(f, pl, () => { for (let i = 0; i < 10; i++) f.flat(X.lumpy(f, ell([R(f, pl[0][0], pl[1][0]), R(f, pl[2][1], pl[0][1])], R(f, 8, 24), R(f, 5, 12), 0, 8), 2), '#4a3c2c', { op: 0.85 }); }); f.line([pl[3], pl[2]], 2.4, '#a49e90', { op: 0.5 }); }
  for (let i = 0; i < 3; i++) { const x = 1080 + i * 110; const A0 = [[x, 1740], [x, 1580], [x + 40, 1530], [x + 80, 1580], [x + 80, 1740]]; f.part(A0, PAINT({ fill: '#3e3a34', cast: false })); f.line(A0, 2.4, '#8a8478', { op: 0.5 }); } // carved niches
  X.burn(f, [1220, 1430], 1.5, 400, 3, { depth: 3 });
  for (const x of [1030, 1110, 1330, 1410]) { const c = [x, 1420]; f.part([add(c, [-12, 0]), add(c, [12, 0]), add(c, [10, -26]), add(c, [-10, -30])], { fill: P.wax, shadow: '#5a4e30', light: '#e4d8a8', shade: 0.4, inkW: 1.1, cast: false }); f.line([add(c, [0, -30]), add(c, [1, -38])], 1.6, INK); f.line([add(c, [-8, -4]), add(c, [-10, 14])], 3, P.wax); } // candle stubs, guttered
  for (const x of [470, 600, 1840, 1980]) { const c = [x, 1830]; f.part([add(c, [-12, 0]), add(c, [12, 0]), add(c, [10, -22]), add(c, [-10, -28])], { fill: P.wax, shadow: '#5a4e30', light: '#e4d8a8', shade: 0.4, inkW: 1.1, cast: false }); f.line([add(c, [0, -28]), add(c, [1, -36])], 1.6, INK); }
  // ---- the saint: carved and painted wood, flaking; a pilgrim saint in contrapposto, the weight on one leg, the other
  // knee pushing the robe forward; a cord belt; the robe in deep carved folds (V folds between the arms, long folds
  // fanning to an undulating hem); a hooded mantle over the shoulders hanging down the back; a staff and a gourd
  f.bone('saint');
  const ROBE = [[1040, 1424], [1052, 1330], [1080, 1200], [1100, 1060], [1112, 900], [1108, 800], [1102, 640], [1110, 520], [1150, 468], [1220, 446], [1300, 470], [1340, 530], [1346, 660], [1330, 800], [1338, 880], [1372, 1000], [1402, 1160], [1420, 1300], [1436, 1424]];
  const HEMR = []; for (let i = 0; i <= 12; i++) { const x = 1436 - i * 33; HEMR.push([x, 1424 - (i % 2 ? 26 : 0) - Math.sin(i * 0.9) * 8, i % 2 ? 0 : 1]); }
  const RB = [...ROBE.slice(0, -1), ...HEMR];
  f.part(RB, PAINT());
  X.clipDraw(f, RB, () => {
    // long folds fanning from the belt to the hem: each a dark carved groove beside a lit ridge, curving with the knee
    for (let i = 0; i < 8; i++) { const x0 = 1130 + i * 26, x1 = 1050 + i * 52; const g = [[x0, 830], [lerp([x0, 0], [x1, 0], 0.5)[0] + (i > 4 ? 14 : -6), 1120], [x1, 1416]]; f.stroke(g, 16, '#1a1612', { op: 0.5 }); f.stroke(g.map(([x, y]) => [x + 12, y]), 7, '#b4ae9e', { op: 0.35 }); }
    // the near knee forward: the cloth pulled taut over it, a lit oval, folds radiating from it
    f.flat(ell([1350, 1150], 50, 70, -0.2, 14), '#c4bead', { op: 0.3 }); for (const a of [-2.4, -1.9, 2.2]) f.line([[1350, 1150], add([1350, 1150], rot([90, 0], a))], 3, '#1a1612', { op: 0.45 });
    // V folds hanging between the arms across the chest
    for (let i = 0; i < 4; i++) { const y = 560 + i * 50; f.stroke([[1130, y - 20], [1225, y + 40], [1320, y - 20]], 10, '#1a1612', { op: 0.45 }); f.stroke([[1130, y - 8], [1225, y + 52], [1320, y - 8]], 4, '#b4ae9e', { op: 0.35 }); }
    for (let k = 0; k < 2; k++) { const y = 1380 - k * 26; f.line([[1030, y], [1440, y]], 5, '#3a3a40', { op: 0.6 }); for (let x = 1040; x < 1440; x += 30) f.line([[x, y - 10], [x + 15, y + 10]], 2, '#8a8478', { op: 0.5 }); } // the painted hem border, faded
    for (let i = 0; i < 30; i++) f.flat(X.lumpy(f, ell([R(f, 1060, 1420), R(f, 500, 1400)], R(f, 8, 26), R(f, 5, 14), R(f, 0, 3), 8), 3), '#5a4a38', { op: 0.85 }); // paint flaked to bare wood
    X.burn(f, [1230, 450], 1.55, 1000, 4, { depth: 3 }); // the strike's path down the statue
    f.flat([[1020, 1240], [1450, 1240], [1450, 1430], [1020, 1430]], '#000', { op: 0.22 });
  });
  // the cord belt, knotted, ends hanging
  X.rope(f, [[1106, 806], [1220, 826], [1334, 806]], 9, { col: '#7a6a50' });
  X.rope(f, [[1240, 826], [1250, 900], [1240, 980]], 6, { col: '#7a6a50', fray: true });
  // the mantle over the shoulders and down the back, its edge in carved zigzag folds, the hood fallen behind the neck
  const MAN = [[1104, 520], [1150, 452], [1270, 440], [1336, 500], [1352, 620], [1330, 700], [1290, 650], [1240, 700], [1180, 660], [1130, 720], [1090, 1000], [1060, 1220], [1030, 1200], [1050, 960], [1080, 700]];
  f.part(MAN, PAINT({ fill: '#56544e', light: '#8a867c' }));
  X.clipDraw(f, MAN, () => { for (let i = 0; i < 12; i++) f.flat(X.lumpy(f, ell([R(f, 1060, 1350), R(f, 460, 1200)], R(f, 8, 22), R(f, 5, 12), 0, 8), 2), '#5a4a38', { op: 0.85 }); for (let i = 0; i < 3; i++) f.stroke([[1110 - i * 10, 600 + i * 40], [1080 - i * 8, 900], [1060 - i * 6, 1180]], 10, '#1a1612', { op: 0.45 }); });
  f.line([[1330, 700], [1290, 650], [1240, 700], [1180, 660], [1130, 720]], 5, '#3a3428', { op: 0.8 });
  f.part([[1150, 452], [1110, 420], [1120, 390], [1200, 400], [1270, 440]], PAINT({ fill: '#4a4842', cast: false })); // the hood fallen back
  X.leadBadge(f, [1300, 560], 18, -0.2); // the carved scallop on the mantle
  // the staff rising past the head, the gourd tied under its knob; the carved hands
  f.part(limb([1400, 1424], [1420, 60], 26, 22, { steps: 16 }), WDS());
  X.clipDraw(f, limb([1400, 1424], [1420, 60], 28, 24, { steps: 16 }), () => { for (let i = 0; i < 6; i++) f.flat(ell([1410, R(f, 200, 1400)], 12, R(f, 14, 30), 0, 8), '#7a6a50', { op: 0.6 }); X.burn(f, [1418, 80], 1.56, 600, 1.6, { depth: 1 }); });
  const gc = [1432, 190];
  f.line([gc, add(gc, [10, 30])], 4, '#5a4a30');
  f.part([add(gc, [-6, 28]), add(gc, [30, 26]), add(gc, [46, 60]), add(gc, [44, 110]), add(gc, [16, 140]), add(gc, [-16, 120]), add(gc, [-16, 70])], { fill: '#8a7a52', shadow: '#3a2e1a', light: '#b8a676', shade: 0.42, tex: 'wood' + sd, texOp: 0.5, inkW: 1.4 });
  f.part(X.mchain([[1320, 520], [1380, 640], [1408, 700]], [[[[0, 34], [1, 26]], [[0, 34], [1, 26]]], [[[0, 26], [1, 22]], [[0, 26], [1, 22]]]]), PAINT({ fill: '#5e5c56' })); // the sleeve and forearm to the staff
  X.knuckleFist(f, [1408, 700], -Math.PI / 2 + 0.05, 42, '#8a7e6c', { shadow: '#3a3028', tex: 'wood' + sd, texOp: 0.3 });
  f.part(X.mchain([[1150, 520], [1170, 680], [1250, 690]], [[[[0, 34], [1, 28]], [[0, 34], [1, 28]]], [[[0, 28], [1, 22]], [[0, 28], [1, 22]]]]), PAINT({ fill: '#5e5c56' })); // the other arm bent to the chest
  X.openHand(f, [1252, 690], -1.3, 100, { look: PAINT({ fill: '#8a7e6c' }), back: false, curl: 0.15, spread: 0.12 });
  // the hive's comb: one continuous mass of layered grey paper comb welling out of the split in the statue's side, over
  // the shoulder, down the robe to the feet, across the plinth and over the deck's edge onto the bearers' backs; the
  // part above the plinth top rides with the saint, the rest with the float
  f.flat([[1320, 900], [1356, 960], [1366, 1120], [1340, 1200], [1312, 1100], [1306, 980]], '#0a0808');
  const COMB = [[1318, 858], [1362, 836], [1414, 884], [1442, 990], [1462, 1140], [1484, 1290], [1470, 1390], [1508, 1436], [1530, 1500], [1548, 1590], [1530, 1650], [1552, 1736], [1572, 1812], [1640, 1826], [1672, 1880], [1664, 1950], [1636, 1996], [1606, 1960], [1590, 1910], [1556, 1940], [1530, 1890], [1470, 1846], [1420, 1800], [1394, 1720], [1400, 1640], [1372, 1570], [1356, 1490], [1300, 1460], [1240, 1470], [1170, 1452], [1100, 1460], [1082, 1520], [1060, 1560], [1036, 1520], [1040, 1452], [1090, 1400], [1180, 1386], [1250, 1340], [1290, 1250], [1300, 1120], [1288, 990]];
  const VEIN = X.lumpy(f, X.ribbon(X.spline([[1318, 470], [1346, 600], [1352, 740], [1340, 880]], 3), t => 46 + t * 30), 6);
  const drawComb = (clip) => X.clipDraw(f, clip, () => {
    const CM = []; COMB.forEach((p0, i) => { const p1 = COMB[(i + 1) % COMB.length], d = sub(p1, p0), L = E.len(d), nn = [d[1] / L, -d[0] / L]; CM.push(p0); if (L > 50) CM.push(add(lerp(p0, p1, 0.5), mul(nn, -Math.min(22, L * 0.2) * R(f, 0.5, 1.2)))); }); // the outer edge in bulging lobes
    f.flat(CM.map(q => add(q, [-10, 14])), '#0a0808', { op: 0.5 }); // its shadow on the statue and plinth
    X.comb(f, VEIN, { cell: 10 });
    X.comb(f, CM, { cell: 12, patches: 16 });
    X.clipDraw(f, CM, () => {
      // layered shelves: short cupped lips of paper, staggered like scales, each overhanging the course below and
      // casting a dark recess on it; the recesses between them darkest
      const bb = E.bbox(COMB);
      for (let k = 0; k < 34; k++) { const c = [R(f, bb[0], bb[2]), bb[1] + 40 + k * (bb[3] - bb[1] - 60) / 34 + R(f, -10, 10)], wl = R(f, 110, 230), lip = []; for (let i = 0; i <= 8; i++) { const t = -1 + i / 4; lip.push([c[0] + t * wl / 2, c[1] + 24 * (1 - t * t)]); } f.flat([...lip, ...lip.slice().reverse().map(([x, y]) => [x, y + 22 + 10 * (1 - Math.abs(x - c[0]) / wl * 2)])], '#0c0a0a', { op: 0.45 }); f.line(lip.map(([x, y]) => [x, y - 2]), 2.4, P.paperL, { op: 0.6 }); f.line(lip.slice(1, 4).map(([x, y]) => [x, y - 10]), 1.2, P.paperD, { op: 0.5 }); }
      // torn windows in the envelope where the comb itself shows: hexagonal cells in rows, each mouth darker toward the
      // middle of the hollow, a few capped pale, a grub in one
      for (const [c, r] of [[[1390, 1010], 46], [[1410, 1250], 60], [[1300, 1420], 50], [[1480, 1620], 54], [[1560, 1860], 44], [[1120, 1480], 36]]) {
        const win = X.lumpy(f, ell(c, r * 1.25, r, R(f, -0.4, 0.4), 12), r * 0.22), cs = 11;
        f.flat(win, '#2a2622');
        X.clipDraw(f, win, () => { for (let yy = c[1] - r * 1.3; yy < c[1] + r * 1.3; yy += cs * 1.5) for (let xx = c[0] - r * 1.5 + (Math.round((yy - c[1]) / (cs * 1.5)) % 2 ? cs * 0.87 : 0); xx < c[0] + r * 1.5; xx += cs * 1.74) { const q = [xx, yy], dd = E.len(sub(q, c)) / (r * 1.25), hx = []; for (let i = 0; i < 6; i++) hx.push([...add(q, rot([cs * 0.86, 0], i * Math.PI / 3 + Math.PI / 6)), 1]); f.flat(hx, mix(P.paper, P.paperL, 0.3)); const k2 = f.r(); if (k2 < 0.14) f.flat(hx.map(z => [...lerp(z, q, 0.2), 1]), mix(P.paperL, P.bone, 0.5)); else { f.flat(hx.map(z => [...lerp(z, q, 0.2), 1]), '#0a0808', { op: Math.min(0.95, 0.5 + (1 - dd) * 0.5) }); if (k2 > 0.95) X.grub(f, q, R(f, 0, 6), 0.3); } } f.flat(win.map(z => lerp(z, c, 0.5)), '#000', { op: 0.25 }); });
        f.line(win.slice(0, 7), 2, P.paperL, { op: 0.7 }); f.line(win.slice(6, 12), 2, '#0a0808', { op: 0.6 }); // the torn envelope's rim
      }
      f.flat([[1270, 840], [1330, 840], [1310, 1440], [1250, 1440]], '#0e0c0c', { op: 0.3 }); // darker where it sinks against the statue
      f.flat([[1370, 1560], [1440, 1560], [1440, 1840], [1380, 1840]], '#0e0c0c', { op: 0.3 });
    });
    f.line(CM.slice(1, 12), 2.2, P.paperL, { op: 0.45 }); // the lit outer edge of the mass
  });
  drawComb([[0, 0], [2400, 0], [2400, 1430], [0, 1430]]);
  // ---- the head: the iron halo behind it with its rays, struck, melted at the rim, the gilt flaking (holy); the
  // painted face split from brow to chin, comb in the split, wasps coming and going
  f.bone('saint_head');
  const SH = [1220, 300], HSz = 170, sF = frame(SH, 0.04, HSz), hc0 = add(SH, [-20, -30]);
  for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (i - 7.5) * 0.36, r0 = 170, r1 = 300 + (i % 2) * 70 - (Math.abs(i - 7.5) > 6 ? 60 : 0); const p0 = add(hc0, rot([r0, 0], a)), p1 = add(hc0, rot([r1, 0], a)); f.part(X.ribbon([p0, p1], t => 16 - t * 12), X.IR(f, { fill: '#3a3a40', light: '#7a7a84' })); if (i % 3 === 0) f.line([lerp(p0, p1, 0.2), lerp(p0, p1, 0.6)], 3, P.gilt, { op: 0.7 }); } // the rays
  const HR = ell(hc0, 180, 190, 0, 40);
  f.line(HR.concat([HR[0]]), 34, INK); f.line(HR.concat([HR[0]]), 26, '#3a3a40'); f.line(HR.slice(24, 36), 10, P.gilt, { op: 0.85 }); f.line(HR.slice(26, 32), 4, P.giltL, { op: 0.6 }); f.line(HR.slice(2, 10), 8, P.giltD, { op: 0.6 });
  for (const i of [3, 8, 14, 18]) X.fusedRun(f, HR[i], R(f, 30, 60), 10, '#4a4a50'); // the rim melted and run
  X.scorch(f, HR[30], 60, 50, 0.65); f.flat(ell(HR[30], 18, 10, 0, 8), mix(P.vioL, P.gilt, 0.4), { op: 0.6 }); // where the strike hit
  for (let i = 0; i < 12; i++) f.flat(ell(add(HR[Math.floor(R(f, 20, 38))], [R(f, -10, 10), R(f, -10, 10)]), 4, 3, 0, 6), P.giltL, { op: 0.7 }); // gilt flakes
  f.part(limb([1215, 450], [1225, 370], 100, 92, { steps: 4 }), PAINT({ fill: '#9a8e7a' }));
  B.head(f, SH, HSz, 0.04, { skin: '#a89a84', jaw: 1.0, chin: 0.02, nose: 1.0, hook: 0.1, mouth: 'set', squint: 0.65, browDown: 0.02, faceShade: 0.8, eyeWhite: '#8a7e6c', iris: '#4a3e32', hairCol: '#4a3e32', beard: 'full', beardCol: '#4a3e32' });
  f.part(sF([[-0.42, -0.1], [-0.38, -0.44], [-0.14, -0.58], [0.16, -0.56], [0.36, -0.42], [0.2, -0.4], [-0.02, -0.42], [-0.22, -0.3], [-0.28, -0.04]]), PAINT({ fill: '#4a3e32' }));
  for (let i = 0; i < 6; i++) f.line(sF([[-0.36 + i * 0.12, -0.5], [-0.3 + i * 0.12, -0.36]]), 3, '#1a1410', { op: 0.6 }); // carved locks
  for (let i = 0; i < 5; i++) f.line(sF([[-0.1 + i * 0.07, 0.36], [-0.08 + i * 0.07, 0.56]]), 2.4, '#1a1410', { op: 0.6 });
  f.flat(sF([[0.02, 0.02], [0.14, 0.06], [0.12, 0.2], [0.0, 0.16]]), '#5a4a38', { op: 0.85 }); f.flat(sF([[-0.2, -0.24], [-0.06, -0.22], [-0.1, -0.12]]), '#5a4a38', { op: 0.85 }); // paint gone
  const SPF = sF([[0.2, -0.58], [0.25, -0.3], [0.21, -0.1], [0.27, 0.12], [0.23, 0.34], [0.27, 0.6], [0.17, 0.6], [0.13, 0.32], [0.15, 0.1], [0.09, -0.1], [0.13, -0.32], [0.11, -0.58]]);
  f.flat(SPF, '#0a0808');
  X.comb(f, X.lumpy(f, sF([[0.13, -0.3], [0.21, -0.28], [0.21, 0.24], [0.15, 0.26]]), 2), { cell: 8 });
  X.scorch(f, sF([[0.18, 0.0]])[0], 30, 110, 0.55);
  for (const [q, a, sc2] of [[[0.2, -0.62], -1.5, 1.0], [[0.24, 0.62], 1.6, 0.9], [[0.62, -0.36], 0.3, 1.1], [[0.7, 0.2], -0.6, 1.0], [[0.5, 0.62], 2.2, 0.9]]) X.miniWasp(f, sF([q])[0], a, sc2); // wasps at the ends of the split and going out

  f.bone('float');
  drawComb([[0, 1410], [2400, 1410], [2400, 2400], [0, 2400]]);
  // ---- the near rank under the near pole: the pole scorched and fused into each back, one fern over every back
  const NB = [];
  XS.forEach((x, i) => { f.bone('bearer_' + (i + 1)); const B0 = pilgrim(f, x, PER[i], PY, {}); NB.push(B0); fernInto(B0.CK); fernInto(B0.TOR);
    if (i === 4 || i === 5) X.comb(f, X.lumpy(f, [add(B0.N0, [-110, -60]), add(B0.N0, [-20, -70]), add(B0.N0, [40, -40]), add(B0.N0, [30, 30]), add(B0.N0, [-20, 70]), add(B0.N0, [-60, 30]), add(B0.N0, [-120, 10])], 8), { cell: 10 }); // the spill carried on over the bearers' backs, up to the pole
  });
  f.bone('float');
  f.part(limb([300, PY], [2130, PY - 8], 36, 36, { steps: 18, capK: 0.4 }), WDS());
  X.clipDraw(f, limb([300, PY], [2130, PY - 8], 38, 38, { steps: 18 }), () => { for (let i = 0; i < 14; i++) X.scorch(f, [R(f, 320, 2110), PY], R(f, 20, 50), 16, 0.5); f.line([[320, PY - 10], [2110, PY - 18]], 2, '#8a765a', { op: 0.5 }); });
  // the fused joins: the pole grown into each back in a scorched swollen weld of wood, cloth and flesh, bridging to the next
  const welds = XS.map(x => [x + 30, PY - (x - 270) * 8 / 1830]);
  for (let i = 0; i < welds.length; i++) { const c = welds[i], WL = X.lumpy(f, [add(c, [-58, 8]), add(c, [0, 12]), add(c, [66, 8]), add(c, [84, 26]), add(c, [40, 46]), add(c, [-10, 52]), add(c, [-52, 38])], 5); f.part(WL, X.SKX(f, { fill: mix(P.skin, '#2a2018', 0.42), shadow: '#120e0c', shade: 0.42 })); X.clipDraw(f, WL, () => { X.scorch(f, add(c, [10, 14]), 60, 14, 0.5); f.line([add(c, [-50, 14]), add(c, [-20, 18]), add(c, [10, 13]), add(c, [40, 19]), add(c, [70, 14])], 2, '#1a120c', { op: 0.7 }); }); X.pustules(f, add(c, [20, 34]), 36, 8, 2, 3, 5); } // the pole fused into the back: scar tissue welded round its underside
  for (let i = 0; i < welds.length - 1; i++) { const a = welds[i], b = welds[i + 1]; f.part(X.lumpy(f, [add(a, [70, 14]), add(lerp(a, b, 0.5), [0, 16]), add(b, [-50, 14]), add(b, [-50, 26]), add(lerp(a, b, 0.5), [0, 34]), add(a, [70, 30])], 3), X.SKX(f, { fill: mix(P.skin, '#3a3028', 0.5), shadow: '#120e0c', shade: 0.4, cast: false })); } // grown together, back to back along the pole
  // the hands on the pole, over the welds: each fist closed round the pole and charred into it
  NB.forEach((B0, i) => { f.bone('bearer_' + (i + 1)); const W0 = B0.grip === 'near' ? B0.WN : B0.WF, E0 = B0.grip === 'near' ? B0.EN : B0.EF, sk = B0.grip === 'near' ? B0.skin : mix(B0.skin, '#000', 0.18); const fc = [W0[0], PY - 10 - (W0[0] - 300) * 8 / 1830]; X.knuckleFist(f, fc, -Math.PI / 2 + 0.25, 21 * B0.s, sk, { shadow: B0.tint('#3e3028'), tex: 'mottle' + sd }); const py = PY - (W0[0] - 300) * 8 / 1830; f.part([[fc[0] - 34, py - 12], [fc[0] + 34, py - 13], [fc[0] + 34, py + 18], [fc[0] - 34, py + 18]].map(q => [...q, 1]), WDS({ cast: false, inkW: 0 })); f.line([[fc[0] - 34, py - 12], [fc[0] + 34, py - 13]], 2, '#8a765a', { op: 0.5 }); X.scorch(f, [fc[0], py], 34 * B0.s, 10, 0.55); }); // the fingers over the top of the pole, the palm behind it
  // the votives hung from the deck's edge: wax limbs sagging, tin hearts
  f.bone('votives');
  for (const [x, kind] of [[420, 'wax'], [650, 'tin'], [880, 'wax'], [1100, 'tin'], [1560, 'wax'], [1800, 'tin'], [1960, 'wax'], [2060, 'tin']]) { const t = [x, 1916 - (x - 360) * 0.009]; if (kind === 'wax') X.waxLimb(f, t, 64, R(f, -0.1, 0.1)); else X.tinHeart(f, t, 13); }
  // ---- the processional banner on its pole at the float's rear corner, burnt to a rag
  f.bone('banner');
  f.part(limb([2050, 1900], [2080, 900], 18, 16, { steps: 12 }), WDS());
  f.part(limb([2000, 920], [2160, 910], 12, 12, { steps: 4 }), WDS());
  const BN = [[2010, 926], [2150, 916], [2140, 1000], [2120, 1040], [2100, 1120], [2080, 1070], [2050, 1160], [2030, 1060], [2016, 1020]];
  f.part(BN, X.CLK(f, { fill: '#5a5446', shadow: '#16140f', tex: 'weave' + sd }));
  X.clipDraw(f, BN, () => { X.scorch(f, [2080, 1060], 70, 80, 0.7); f.line([[2040, 950], [2080, 980], [2120, 950]], 3, P.giltD, { op: 0.5 }); });
  X.hemThreads(f, BN.slice(2, 9), '#1a1614', 6);
  // ---- the road: a dropped staff
  f.bone('mass');
  f.part(limb([140, gy - 10], [600, gy - 22], 18, 16, { steps: 8 }), WDS({ fill: '#4a3e30' }));
  f.part(ell([600, gy - 22], 16, 14, 0, 10), WDS());
  f.flat(ell([1200, gy + 2], 1050, 12, 0, 30), '#14121a', { op: 0.45 });

  f.bone('root');
  return f;
}

module.exports = {
  heroes: [
    { key: 'procession', name: 'The Procession', tier: 'ruler', w: 2400, h: 2400, flip: true, build: procession },
    { key: 'cicada_under_the_road', name: 'The Cicada Under the Road', tier: 'ruler', w: 2000, h: 2600, flip: true, build: cicadaUnderTheRoad },
    { key: 'courier', name: 'The Courier', tier: 'elite', w: 1900, h: 1500, flip: true, build: courier },
    { key: 'road_centipede', name: 'Road Centipede', tier: 'elite', w: 2200, h: 1400, flip: true, build: roadCentipede },
    { key: 'dowser', name: 'The Dowser', tier: 'human', w: 600, h: 820, flip: true, build: dowser },
    { key: 'struck_shepherd', name: 'Struck Shepherd', tier: 'human', w: 600, h: 820, flip: true, build: struckShepherd },
    { key: 'highwayman', name: 'Highwayman', tier: 'human', w: 600, h: 820, flip: true, build: highwayman },
    { key: 'tinker', name: 'The Tinker', tier: 'human', w: 640, h: 960, flip: true, build: tinker },
    { key: 'road_warden', name: 'Road-Warden', tier: 'human', w: 600, h: 1400, flip: true, build: roadWarden },
    { key: 'spire_termites', name: 'Spire Termites', tier: 'small', w: 600, h: 820, flip: true, build: spireTermites },
    { key: 'antlion', name: 'Antlion', tier: 'large', w: 1250, h: 1100, flip: true, build: antlion },
  ],
};
// every figure's ground line is its canvas height minus 30 (the rig export reads groundY from the figure options)
for (const e of module.exports.heroes) { const b = e.build; e.build = () => { const f = b(); if (f.o.groundY !== e.h - 30) throw new Error(`${e.key}: groundY ${f.o.groundY}, expected ${e.h - 30}`); return f; }; }
