// World V, The Storm Foundry (Fire + Lightning, Plasma). A smiths' guild-city that forged bells, armour and automata;
// the forge fire caught a storm and kept it. Fire (dominant) blackens, splits and glows; lightning scars metal and flesh
// with branching burns and fuses bronze. Palette: bronze, white-gold arcs, soot, plus ink black, bone and grey.
// Foes face left: every figure is drawn facing right with kit.foeBase (light from the upper right) and flipped.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
// Seeds: 500 + index in the bible's order (ruler 500, elites 501-502, cast 503-507).
'use strict';
const K = require('../kit');
const W = require('./kit_V');
const { fxCapture } = require('./kit_fx'); // consistency pass 2026-11-25: arcs go to an FX layer
const { E, B, G, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { split, side, P } = W;
const ang = W.ang, elb = W.elb;
const ankleCut = (Kn, A) => add(E.norm(sub(A, Kn)), [0.6, 0]); // ankle cut: the instep goes with the foot

// ------------------------------------------------------------------ SLAG SLAVE (cast, human 1.0)
// Chained at the neck to the anvil line, an iron cage riveted shut over its head. Stooped and starved: the hunch is in
// the upper back, the head hangs forward on the neck inside the cage, the knees never straighten. Both fists gather the
// neck chain (the far one near the collar, the near one lower) ready to swing it; the rest drags on the floor behind,
// ending in a sheared link fused into a lump of slag. Skin crusted with slag droplets, some still glowing; a fresh
// Lichtenberg burn across the back; a foundry brand on the shoulder.
// Rig: standard humanoid + chain (parent hand_n, the hanging run and the trail) + chain_up (collar to far fist, on hand_f)
// + cage (parent head). Motion: idle a shuffle; attack swings the chain (near arm whips round, chain follows).
function slagSlave() {
  const seed = 503, f = new Fig(W.base(seed, 820, { grimeY: 600 }));
  W.textures(f);
  const skin = '#8c7c6c', skinS = '#3a2e2a';
  const SKs = (o = {}) => W.SK(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const sack = '#5a544a', sackD = '#3e3a32';
  const Pv = [258, 524], T0 = [262, 500], NB = [352, 372];
  const SN = [316, 388], EN = [292, 484], WN = [364, 502];
  const collar = [386, 398];
  const WF = [420, 452], EF = [352, 488], SF = [356, 386];
  const HN = [278, 530], KN = [330, 640], AN = [314, 748];
  const HF = [244, 524], KF = [226, 644], AF = [188, 748];
  const HC = [402, 322], hA = 0.22, HH = 90;

  W.humanJoints(f, { P: Pv, T: T0, N: NB, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('chain', WN, 'hand_n').joint('chain_up', WF, 'hand_f').joint('cage', HC, 'head');
  const gy = f.o.groundY;

  // ---- the trailing chain on the floor, behind everything: from the plumb run under the near fist back along the
  // ground to a sheared link fused into a lump of slag
  f.bone('chain');
  W.chainLinks(f, [[WN[0] + 2, WN[1] + 18], [WN[0] + 2, 690], [WN[0] - 8, gy - 6], [WN[0] - 44, gy - 3], [250, gy - 6], [170, gy - 3], [110, gy - 7], [62, gy - 5]], 15, P.iron);
  const lump = [44, gy - 12];
  f.part(W.lumpy(f, ell(lump, 24, 14, 0.1, 12), 5), { fill: P.slag, shadow: '#000', light: P.slagL, shade: 0.4, inkW: 1.2, cast: false, hatch: false });
  f.flat(ell(add(lump, [6, -4]), 7, 4, 0, 8), P.ember, { op: 0.85 }); f.flat(ell(add(lump, [6, -4]), 3, 2, 0, 6), P.hot);
  f.flat(ell(add(lump, [-8, -6]), 5, 2.4, -0.4, 6), '#d8d0c4', { op: 0.6 });
  f.line([[64, gy - 10], [72, gy - 15], [70, gy - 6]], 2.4, P.ironL);
  for (let i = 0; i < 6; i++) f.line([[90 + i * 26, gy + 2], [104 + i * 26, gy + 1]], 1.2, P.sootL, { op: 0.6, straight: true }); // drag marks

  // ---- far arm, in front of the chest but behind the near arm: bony, knobbed elbow, fist up on the chain by the collar
  W.armRig(f, SF, EF, WF, [32, 27, 22], SKs({ fill: mix(skin, skinS, 0.12) }), '_f', { bp: [[0, 0.3, 0.14, 0.2], [1, 0.0, 0.3, 0.08]], bq: [[0, 0.98, 0.3, 0.07], [1, 0.3, 0.12, 0.2]] });

  // ---- legs: ragged breeches cut off above the knee, knobbed knees, bony shins, big splayed feet
  const leg = (Hp, Kn, A, sfx, tint) => {
    const look = SKs({ fill: mix(skin, skinS, tint) });
    W.legRig(f, Hp, Kn, A, 50, 50, 36, look, sfx, { thigh: 0.04, calf: 1.12 });
    f.bone('shin' + sfx);
    const d = E.norm(sub(A, Kn)), nn = [-d[1], d[0]];
    f.part(ell(add(Kn, mul(d, 4)), 17, 14, Math.atan2(d[1], d[0]), 12), SKs({ fill: mix(skin, '#fff', 0.08 - tint * 0.4), inkW: 1, inkHeavy: 1.6, cast: false, shade: 0.5 })); // kneecap
    f.line([add(Kn, mul(d, 16)), lerp(Kn, A, 0.75)], 1.3, mix(skin, '#fff', 0.35), { op: 0.5 }); // shin bone edge
    f.line([add(add(Kn, mul(d, 22)), mul(nn, -12)), add(lerp(Kn, A, 0.5), mul(nn, -15)), add(lerp(Kn, A, 0.8), mul(nn, -9))], 1, INK, { op: 0.45 }); // calf line
    W.slag(f, lerp(Kn, A, 0.5), 10, 26, 3, 2, 3.4);
    W.lichtenberg(f, add(lerp(Kn, A, 0.3), mul(nn, 6)), Math.atan2(d[1], d[0]) - 0.2, 40, 2.4, { depth: 2, op: 0.6 });
    f.bone('foot' + sfx);
    W.splats(f, add(A, [10, 28]), 30, 10, 7, '#1a1612');
    const cu = lerp(Hp, Kn, 0.78);
    W.legTube(f, Hp, Kn, cu, [70, 58, 56], { fill: sfx === '_n' ? sack : sackD, shadow: '#221e18', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 }, sfx, { A });
    f.bone('thigh' + sfx);
    const dt = E.norm(sub(Kn, Hp)), nt = [-dt[1], dt[0]];
    const hem = []; const hl = [2, 16, 6, 9, 22, 4, 12, 3, 8]; for (let i = 0; i <= 8; i++) { const u = -29 + i * 58 / 8; hem.push([...add(add(cu, mul(nt, u)), mul(dt, hl[(i + (sfx === '_n' ? 3 : 0)) % 9] + W.R(f, -2, 3))), i % 3 === 1 ? 1 : 0]); }
    f.part([add(add(cu, mul(nt, -30)), mul(dt, -18)), ...hem, add(add(cu, mul(nt, 30)), mul(dt, -18))], { fill: sfx === '_n' ? sack : sackD, shadow: '#221e18', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, inkW: 1.2, cast: false });
    f.stroke(hem.map(q => add(q, mul(dt, -1))), 3.4, P.char, { op: 0.85 }); // charred hem
    W.flakes(f, add(cu, mul(dt, 4)), 18, 5, 3, 0.7);
    f.stroke([lp(Hp, Kn, 0.35, 18), lp(Hp, Kn, 0.5, 4), lp(Hp, Kn, 0.6, -14)], 2, INK, { op: 0.6 });
  };
  leg(HF, KF, AF, '_f', 0.2);
  f.bone('foot_f'); // rag wrap round the far foot
  for (let i = 0; i < 4; i++) f.stroke([[AF[0] - 16, AF[1] + 2 + i * 8], [AF[0] + 8, AF[1] + 8 + i * 8], [AF[0] + 30, AF[1] + 16 + i * 6]], 6, i % 2 ? '#6a6050' : '#5a5244');
  f.stroke([[AF[0] - 18, AF[1] + 30], [AF[0] - 28, AF[1] + 40], [AF[0] - 26, AF[1] + 34]], 3, '#5a5244');

  // ---- torso: a starved body under a hump of trapezius built by hauling; ribs bowed under the chest, belly sunk
  f.bone('torso');
  const torso = [[364, 386], [382, 410], [376, 440], [360, 466], [338, 484], [316, 496], [300, 516], [296, 548], [262, 556], [228, 548], [214, 512], [219, 486], [216, 462], [212, 440], [214, 414], [210, 396], [218, 372], [224, 356], [236, 344], [250, 334], [262, 330], [276, 322], [294, 324], [312, 328], [342, 348]];
  f.part(torso, SKs({ shade: 0.5, k: 0.85 }));
  const inTorso = draw => W.clipDraw(f, torso, draw);
  inTorso(() => {
    W.soot(f, [240, 470], 50, 70, 0.4); W.soot(f, [330, 470], 30, 24, 0.35); W.soot(f, [290, 530], 40, 16, 0.4);
    // ribs: arcs round the barrel of the chest under the hump, shadow bar with a lit upper lip
    for (let i = 0; i < 6; i++) { const y = 386 + i * 17; f.stroke([[214, y - 8], [262, y + 4], [318, y + 12 + i * 2], [356, y + 4 + i * 3]], 4, mix(skinS, skin, 0.35), { op: 0.6 }); f.line([[222, y - 14], [266, y - 2], [320, y + 6 + i * 2], [350, y + i * 3]], 1.1, mix(skin, '#fff', 0.4), { op: 0.45 }); }
    // spine knobs along the hump and shoulder-blade ridge
    for (let i = 0; i < 8; i++) { const t = i / 7, q = [lerp([270, 324], [204, 470], t)[0] + Math.sin(t * 3) * 10, lerp([270, 324], [204, 470], t)[1]]; f.part(ell(q, 6, 5, 0.6, 8), SKs({ fill: mix(skin, '#fff', 0.12), inkW: 1, inkHeavy: 1.4, cast: false, shade: 0.5 })); }
    f.stroke([[300, 338], [260, 372], [244, 430]], 3, skinS, { op: 0.45 }); // shoulder blade edge
    // the Lichtenberg burn spreading over the hump
    W.lichtenberg(f, [276, 344], 2.4, 110, 5);
    // fresh slag burns: one split open and still glowing, droplets crusted round it
    W.seam(f, [[238, 470], [250, 484], [244, 500]], 2.2);
    W.slag(f, [264, 450], 40, 34, 10, 2.4, 4.8, { hot: 0.3 });
    W.slag(f, [330, 360], 18, 12, 4, 2.2, 3.6);
    f.stroke([[334, 472], [318, 490], [312, 512]], 3, skinS, { op: 0.6 }); // sunken belly under the ribs
    f.line([[300, 516], [316, 530]], 1.2, INK, { op: 0.5 });
    // foundry brand on the hump: a hammer mark burned in
    const br = [300, 352];
    f.flat(ell(br, 16, 12, 0.5, 12), P.scar, { op: 0.6 });
    f.stroke([add(br, [-9, 7]), add(br, [6, -6])], 3.4, '#2a1410'); f.stroke([add(br, [1, -12]), add(br, [12, -1])], 4.4, '#2a1410');
    f.line([add(br, [-9, 5]), add(br, [5, -7])], 1, P.scarL, { op: 0.6 });
  });

  // ---- pelvis: breeches seat, rope belt, knot and burnt rag
  f.bone('pelvis');
  f.part([[206, 526], [300, 520], [314, 560], [304, 600], [272, 596], [236, 604], [212, 590], [200, 556]], { fill: sack, shadow: '#221e18', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 });
  f.part([[200, 520], [252, 528], [304, 516], [306, 530], [252, 542], [200, 534]], { fill: '#7a6a4e', shade: 0.4, tex: 'hatch' + seed, texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 8; i++) f.line([[206 + i * 13, 521 + (i < 4 ? i * 2 : 8 - (i - 4) * 3)], [210 + i * 13, 533 + (i < 4 ? i * 2 : 8 - (i - 4) * 3)]], 1, INK, { op: 0.55, straight: true });
  const kn = [290, 528];
  f.part(ell(kn, 8, 7, 0, 10), { fill: '#6e5e44', tex: 'hatch' + seed, inkW: 1.2 });
  W.rope(f, [add(kn, [-2, 6]), add(kn, [-6, 30]), add(kn, [0, 54])], 3.4, { col: '#6e5e44' });
  W.rope(f, [add(kn, [4, 6]), add(kn, [10, 26]), add(kn, [8, 40])], 3, { col: '#62533c' });
  f.part([[226, 562], [250, 560], [252, 586], [228, 588]], { fill: mix(sack, '#000', 0.25), sharp: true, inkW: 1.1, cast: false }); // patch
  f.stitches([[226, 562], [250, 560], [252, 586], [228, 588], [226, 562]], '#9a907a', 0.8);
  W.flakes(f, [216, 596], 16, 6, 3, 0.8);

  // ---- near leg, forward
  leg(HN, KN, AN, '_n', 0);

  // ---- head inside the cage: gaunt, soot-ringed eyes, mouth hanging open
  f.bone('head');
  const cF = frame(HC, hA, 1), cageR = [72, 80];
  const iron = (q, w, c = P.iron) => { f.line(q, w + 2.4, INK); f.line(q, w, c); f.line(q.map(p => add(p, [1, -1])), Math.max(0.8, w * 0.3), P.ironL, { op: 0.7 }); };
  // back bars of the cage first (behind the skull)
  for (const u of [-0.5, 0.2, 0.7]) iron(cF([[u * cageR[0] * 0.9, -cageR[1] * 0.96], [u * cageR[0], 0], [u * cageR[0] * 0.92, cageR[1] * 0.9]]), 3.4, P.ironD);
  f.part(limb(NB, add(HC, rot([-14, 28], hA)), 36, 32), SKs()); // neck
  f.line([add(NB, [10, 8]), add(HC, rot([6, 38], hA))], 1.3, INK, { op: 0.5 }); // tendon standing out
  B.head(f, HC, HH, hA, {
    skin: mix(skin, '#a08a74', 0.4), jaw: 1.04, chin: -0.02, nose: 1.1, hook: 0.5, mouth: 'set', squint: 0.15, browDown: 0.05, age: true, gaunt: true, faceShade: 1.1,
    iris: '#2a1a12', eyeWhite: '#bfb19a', hairCol: '#2a241e', jawShade: 0.6, beard: 'stubble', beardCol: '#2a241e',
    hair: [[-0.4, 0.04], [-0.42, -0.24], [-0.26, -0.48], [0.02, -0.56], [0.24, -0.5], [0.3, -0.42], [0.12, -0.44], [-0.08, -0.4], [-0.24, -0.26], [-0.32, 0.02]],
  });
  const hF = frame(HC, hA, HH);
  f.flat(hF(ell([0.17, -0.05], 0.16, 0.085, 0.05, 12)), P.sootD, { op: 0.4 }); // soot ringed eyes
  f.flat(hF([[0.17, 0.27], [0.25, 0.26], [0.31, 0.28], [0.3, 0.37], [0.23, 0.4], [0.18, 0.36]]), '#1a100c'); // slack open mouth
  f.flat(hF([[0.2, 0.27], [0.27, 0.27], [0.27, 0.295], [0.2, 0.295]]), '#c0b49c', { op: 0.8 }); // teeth
  W.lichtenberg(f, hF([[-0.12, 0.4]])[0], -2.4, 30, 2.2, { depth: 2, op: 0.7 });
  W.standingHair(f, hF([[-0.3, -0.4], [-0.18, -0.48], [-0.04, -0.53], [0.08, -0.53], [0.18, -0.49]]), 36, { w: 3.2, col: '#2e2620', lean: 0.15, fan: 1.0 });
  // leather pad and riveted iron collar round the neck, the chain ring at the throat
  f.bone('torso');
  const colPts = [[338, 346], [372, 372], [396, 398], [390, 414], [362, 392], [330, 366]];
  f.part([[332, 336], [376, 362], [402, 392], [396, 420], [360, 398], [324, 374]], W.LEA(f, { inkW: 1.3 }));
  f.part(colPts, W.IR(f, { inkW: 1.4 }));
  W.rivetRow(f, [340, 354], [384, 392], 4, 2.4, P.ironL);
  f.flat([[330, 372], [362, 398], [356, 410], [328, 384]], P.rust, { op: 0.5 }); // rust run onto the skin
  f.line([[344, 392], [340, 412]], 1.8, P.rust, { op: 0.6 });
  const rg = ell(collar, 9, 11, 0.3, 12); f.line(rg.concat([rg[0]]), 6, INK); f.line(rg.concat([rg[0]]), 3.6, P.ironL);

  // ---- the cage front: bands over the dome, brow and jaw rings, riveted shut with a hasp, a hanging loop on top
  f.bone('cage');
  const ringPts = (v, rx) => { const pts = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * (0.05 + 0.9 * i / 12); pts.push(cF([[-Math.cos(t) * rx, v + Math.sin(t) * 10]])[0]); } return pts; };
  iron(ringPts(-16, cageR[0] * 1.02), 5); // brow ring
  iron(ringPts(46, cageR[0] * 0.95), 4.5); // jaw ring
  for (const u of [-0.95, -0.35, 0.3, 0.85]) iron(cF([[u * cageR[0] * 0.88, -cageR[1] * Math.sqrt(1 - u * u * 0.72)], [u * cageR[0] * 1.02, -10], [u * cageR[0] * 0.98, 46], [u * cageR[0] * 0.88, cageR[1] * 0.96]]), 4.6);
  const top = cF([[0, -cageR[1] - 2]])[0];
  iron(cF([[-cageR[0] * 0.95, -16], [-cageR[0] * 0.75, -62], [0, -cageR[1] - 2], [cageR[0] * 0.75, -60], [cageR[0] * 0.98, -16]]), 5);
  const lp0 = ell(add(top, [2, -10]), 9, 10, 0, 12); f.line(lp0.concat([lp0[0]]), 6.5, INK); f.line(lp0.concat([lp0[0]]), 4, P.iron);
  for (const q of cF([[-cageR[0] * 0.93, -16], [-cageR[0] * 0.33, -12], [cageR[0] * 0.3, -12], [cageR[0] * 0.86, -14], [-cageR[0] * 0.88, 46], [cageR[0] * 0.82, 46], [0, -cageR[1] - 2]])) f.rivet(q, 3.2, P.ironL);
  const hp = cF([[cageR[0] * 0.86, 28]])[0];
  f.part([add(hp, [-7, -16]), add(hp, [7, -16]), add(hp, [8, 18]), add(hp, [-6, 18])], W.IR(f, { inkW: 1.3, sharp: true, cast: false }));
  f.rivet(add(hp, [0, -8]), 3, P.ironL); f.rivet(add(hp, [1, 8]), 3, P.ironL);
  f.flat(ell(add(hp, [2, 22]), 3, 6, 0, 8), P.rust, { op: 0.7 });
  f.scratches(cF([[0, -40]])[0], 40, 5, '#9a948a', 0.8);
  for (const u of [-0.95, -0.35, 0.3, 0.85]) f.flat(ell(cF([[u * cageR[0] * 0.88, cageR[1] * 0.96]])[0], 4, 4, 0, 8), P.ironD);

  // ---- the short run from the collar ring to the far fist, then the fist
  f.bone('chain_up');
  W.chainLinks(f, [add(collar, [6, 8]), lerp(collar, WF, 0.55), add(WF, [-4, -10])], 13, P.ironL);
  f.bone('hand_f');
  B.grip(f, WF, EF, ang(WF, collar), 22, mix(skin, skinS, 0.15), { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: 'slave far chain' });

  // ---- slack loop between the fists, near arm (forearm level, square to the hanging chain), near fist
  f.bone('chain');
  W.chainLinks(f, [add(WF, [2, 14]), [WF[0] - 6, WF[1] + 54], [WN[0] + 22, WN[1] + 34], add(WN, [8, 10])], 13, P.ironL);
  W.armRig(f, SN, EN, WN, [32, 25, 21], SKs({ fill: mix(skin, '#c0aa90', 0.25), shade: 0.5 }), '_n', { bp: [[0, 0.18, 0.22, 0.12], [1, 0.0, 0.32, 0.07]], bq: [[0, 0.96, 0.34, 0.06], [1, 0.3, 0.16, 0.18]] });
  f.bone('upperarm_n');
  f.stroke([lp(SN, EN, 0.05, 10), lp(SN, EN, 0.25, 15), lp(SN, EN, 0.4, 8)], 2.4, skinS, { op: 0.6 }); // deltoid edge
  f.line([lp(SN, EN, 0.45, -6), lp(SN, EN, 0.85, -4)], 1.2, INK, { op: 0.5 });
  f.flat(ell(add(EN, [-2, 4]), 9, 7, 0.3, 8), skinS, { op: 0.35 }); // elbow point
  f.bone('upperarm_n');
  W.slag(f, lerp(SN, EN, 0.5), 10, 24, 4, 2, 3.4);
  f.bone('forearm_n');
  for (let i = 0; i < 3; i++) { const t = 0.3 + i * 0.12; f.part([lp(EN, WN, t, -14), lp(EN, WN, t + 0.03, 14), lp(EN, WN, t + 0.12, 13), lp(EN, WN, t + 0.09, -13)], { fill: '#8e8470', shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.1, cast: false }); }
  f.flat(ell(lp(EN, WN, 0.46, 3), 5, 7, 0.4, 8), '#5c1a10', { op: 0.65 }); // blood seeping through the bandage
  f.line([lp(EN, WN, 0.56, 12), lp(EN, WN, 0.6, 24), lp(EN, WN, 0.58, 32)], 2.4, '#8e8470'); // loose tail, hanging
  f.bone('hand_n');
  B.grip(f, WN, EN, -Math.PI / 2, 24, skin, { tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: 'slave near chain' });
  W.slag(f, add(WN, [-6, -10]), 8, 6, 2, 1.8, 2.6);
  f.bone('torso');
  W.ash(f, [250, 330], 10, 60, 110, 0.9);
  return f;
}

// ------------------------------------------------------------------ ARC-SMITH (cast, human 1.05)
// A journeyman smith who welds with his hammer. Weight forward over a bent front knee, the hammer cocked high behind
// his head at the top of the swing; a constant arc crackles from the hammer head down to a tall copper rod clipped to
// the back of his belt, so the arc runs behind him and never across his face. The far gloved hand reaches out to grab.
// Bare arms branded with Lichtenberg scars, hair stood on end, the smoked-glass welding mask pushed up on his brow; a
// clean oval on the face where the mask sat, soot everywhere else. Layers: scorched shirt, leather bib apron, belt
// and rod, gloves, breeches, boots.
// Rig: standard humanoid + hammer (hand_n) + arc (hammer) + rod (pelvis) + apron (pelvis) + mask (head).
// Motion: idle sparks crackling (arc and hammer bob); attack a charged hammer strike (near arm comes down and forward).
function arcSmith() {
  const seed = 505, f = new Fig(W.base(seed, 820, { grimeY: 600 }));
  W.textures(f);
  const H = 104;
  const skin = '#a88a6e', skinS = '#3e2a22';
  const SKs = (o = {}) => W.SK(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const N = [340, 272], C = [304, 366], Pv = [288, 478];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.32, 0.12), SF = S.at(0.46, 0.1);
  const EN = [236, 200], WN = [272, 124];
  const EF = [404, 352], WF = [452, 314];
  const HN = S.at(0.18, 0.98), KN = [376, 606], AN = [398, 744];
  const HF = S.at(-0.24, 0.96), KF = [226, 618], AF = [164, 744];
  const HC = [360, 210], hA = -0.02, HH = H;
  const hamHead = [196, 46], hamA = ang(WN, hamHead);
  const rod0 = S.at(-0.66, 0.86), rodTip = [190, 250];

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.1, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('hammer', WN, 'hand_n').joint('arc', hamHead, 'hammer').joint('rod', rod0, 'pelvis').joint('apron', S.at(0.3, 0.84), 'pelvis').joint('mask', add(HC, [-6, -40]), 'head');

  // ---- copper rod clipped to the back of the belt, rising behind the shoulders
  f.bone('rod');
  f.part(limb(rod0, rodTip, 9, 7, { steps: 6 }), W.CU(f, { inkW: 1.4 }));
  for (const t of [0.15, 0.5, 0.85]) f.line([lp(rod0, rodTip, t, -6), lp(rod0, rodTip, t + 0.02, 6)], 2.2, P.copperD, { straight: true });
  const coil = []; for (let i = 0; i <= 24; i++) { const t = i / 24; coil.push(add(lerp(add(rodTip, [2, 30]), rodTip, t), [Math.sin(t * Math.PI * 8) * 9, 0])); }
  f.line(coil, 4.2, INK); f.line(coil, 2.4, P.copperL);
  f.part(ell(add(rodTip, [0, -6]), 8, 8, 0, 10), W.CU(f, { fill: P.copperL, inkW: 1.2, cast: false }));
  W.lichtenberg(f, lp(rod0, rodTip, 0.6), -1.6, 30, 1.6, { metal: true, depth: 1 });

  // ---- far arm (bare, scarred) reaching forward, gloved hand open to grab
  W.muscleArm(f, SF, EF, WF, [40, 34, 28], SKs({ fill: mix(skin, skinS, 0.12) }), '_f');
  f.bone('upperarm_f');
  W.lichtenberg(f, lp(SF, EF, 0.2), ang(SF, EF) - 0.3, 60, 3.2, { depth: 2 });
  f.bone('forearm_f');
  W.lichtenberg(f, lp(EF, WF, 0.1), ang(EF, WF) + 0.4, 40, 2.6, { depth: 2 });
  f.part(plate(EF, WF, 0.55, 1.08, 40, 50), W.LEA(f, { fill: '#3e2c1c' })); // gauntlet cuff
  f.line([lp(EF, WF, 0.62, -20), lp(EF, WF, 0.62, 20)], 1.4, INK, { op: 0.6 });
  f.stitches([lp(EF, WF, 0.68, -22), lp(EF, WF, 0.68, 22)], '#a08a6a', 0.8);
  f.bone('hand_f');
  B.hand(f, WF, -0.35, 24, '#3e2c1c', { spread: 0.5, curl: 0.45, shadow: '#1a120a' });
  W.scorch(f, add(WF, [10, -4]), 16, 10, 0.4);

  // ---- legs: wool breeches tucked into heavy boots
  const leg = (Hp, Kn, A, sfx, col) => {
    const cu = lerp(Kn, A, 0.56);
    W.bootRig(f, Kn, A, 52, '#2e2218', sfx, { tex: 'mottle' + seed, shaft: 1.3, strap: sfx === '_n' });
    W.legTube(f, Hp, Kn, cu, [72, 56, 52], { fill: col, shadow: '#1e1a16', shade: 0.42, tex: 'weave' + seed, texOp: 0.45 }, sfx, { A });
    f.bone('shin' + sfx);
    f.stroke([lp(Kn, cu, 0.5, -24), lp(Kn, cu, 0.8, 0), lp(Kn, cu, 0.9, 22)], 2.2, INK, { op: 0.7 }); // the blouse over the boot top
    f.bone('thigh' + sfx);
    f.stroke([lp(Hp, Kn, 0.7, 22), lp(Hp, Kn, 0.85, 4), lp(Hp, Kn, 0.92, -18)], 2, INK, { op: 0.6 });
    f.stroke([lp(Hp, Kn, 0.25, -20), lp(Hp, Kn, 0.4, -6), lp(Hp, Kn, 0.5, 10)], 1.8, INK, { op: 0.5 });
    f.line([lp(Hp, Kn, 0.1, 6), lp(Hp, Kn, 0.9, 10)], 1.2, mix(col, '#fff', 0.25), { op: 0.4 });
    W.soot(f, lp(Hp, Kn, 0.55, 8), 18, 26, 0.35);
    for (let i = 0; i < 5; i++) { const q = lp(Hp, Kn, W.R(f, 0.2, 0.9), W.R(f, -18, 18)); f.flat(ell(q, 2.4, 1.8, 0, 6), '#140c08', { op: 0.85 }); } // spark pocks
    f.bone('shin' + sfx);
    f.part([lp(Kn, cu, -0.15, -20), lp(Kn, cu, -0.12, 18), lp(Kn, cu, 0.35, 20), lp(Kn, cu, 0.4, -18)], { fill: mix(col, '#6a5a40', 0.4), shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.1, cast: false }); // knee patch
    f.stitches([lp(Kn, cu, -0.15, -20), lp(Kn, cu, -0.12, 18), lp(Kn, cu, 0.35, 20), lp(Kn, cu, 0.4, -18), lp(Kn, cu, -0.15, -20)], '#9a8c70', 0.8);
  };
  leg(HF, KF, AF, '_f', '#3e3830');
  f.bone('foot_f'); W.splats(f, add(AF, [14, 34]), 30, 10, 6, '#15110e');

  // ---- torso: broad chest under a scorched linen shirt, sleeves torn off at the shoulder
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.36, 0.3], [0.06, 0.64, 0.5], [0.2, 0.68, 0.74], [0.42, 0.62, 0.72], [0.62, 0.54, 0.62], [0.8, 0.58, 0.6], [0.98, 0.64, 0.6], [1.08, 0.56, 0.5]]);
  f.part(torso, { fill: '#8a8070', shadow: '#2e2a24', shade: 0.42, tex: 'weave' + seed, texOp: 0.45 });
  W.clipDraw(f, torso, () => {
    W.soot(f, S.at(-0.3, 0.5), 40, 60, 0.45); W.soot(f, S.at(0.5, 0.3), 24, 30, 0.3);
    for (const [u, v, r] of [[-0.4, 0.3, 7], [0.1, 0.62, 5], [-0.2, 0.75, 6]]) { f.flat(ell(S.at(u, v), r, r * 0.8, 0, 10), '#1a120c', { op: 0.9 }); f.line(ell(S.at(u, v), r + 2, r * 0.8 + 2, 0, 10).slice(0, 7), 1.4, P.char, { op: 0.7 }); } // burn holes
    f.stroke([S.at(-0.55, 0.2), S.at(-0.4, 0.4), S.at(-0.45, 0.62)], 2, INK, { op: 0.5 }); f.stroke([S.at(-0.2, 0.3), S.at(-0.3, 0.5), S.at(-0.2, 0.7)], 1.8, INK, { op: 0.45 }); f.flat(ell(S.at(-0.35, 0.35), 22, 36, 0.2, 14), '#4a4236', { op: 0.35 }); W.lichtenberg(f, S.at(-0.5, 0.15), 1.9, 50, 2.2, { depth: 2, col: '#3a2a20', op: 0.5 }); W.slag(f, S.at(-0.2, 0.62), 20, 20, 4, 1.8, 3); f.stroke([S.at(0.3, 0.15), S.at(0.45, 0.32)], 1.8, INK, { op: 0.5 });
  });
  // the torn armhole edge at both shoulders: frayed linen over the bare deltoid
  for (const [sh, a] of [[SN, -2.2], [SF, -0.9]]) { const pts = []; for (let i = 0; i <= 6; i++) pts.push(add(sh, rot([26 + (i % 2 ? 6 : 0), 0], a + i * 0.32))); f.line(pts, 2, '#6a6254'); for (let i = 1; i < 6; i += 2) f.line([pts[i], add(pts[i], rot([7, 0], a + i * 0.32 + 0.3))], 1, '#8a8070'); }
  // open collar: neck and chest hair, a burn scar in the V
  f.part([S.at(0.2, -0.1), S.at(0.62, 0.04), S.at(0.5, 0.3), S.at(0.3, 0.12)], SKs({ inkW: 1.2, cast: false }));
  W.lichtenberg(f, S.at(0.42, 0.12), 0.9, 30, 2, { depth: 2 });

  // ---- near leg, forward
  leg(HN, KN, AN, '_n', '#4a443a');
  f.bone('foot_n'); W.splats(f, add(AN, [14, 34]), 30, 10, 6, '#15110e');
  // ---- apron: heavy leather bib from the chest to below the knee, neck strap, scorched and burn-pocked
  f.bone('apron');
  const apron = [S.at(0.15, 0.08), S.at(0.62, 0.1), S.at(0.74, 0.5), S.at(0.72, 0.8), add(S.at(0.76, 1.0), [8, 30]), [404, 604], [392, 626, 1], [362, 618], [328, 630, 1], [300, 612], add(S.at(-0.05, 1.0), [0, 34]), S.at(-0.12, 0.8), S.at(0.0, 0.55), S.at(0.05, 0.25)];
  f.part(apron, W.LEA(f, { fill: '#5a3e26', shade: 0.45 }));
  W.clipDraw(f, apron, () => {
    W.scorch(f, [370, 590], 40, 30, 0.5); W.scorch(f, S.at(0.5, 0.45), 30, 26, 0.35);
    for (let i = 0; i < 9; i++) { const p = W.scatter(f, [360, 540], 40, 60), r = W.R(f, 2, 5); f.flat(ell(p, r, r * 0.8, 0, 8), '#140c08', { op: 0.85 }); f.line(ell(p, r + 1.5, r * 0.8 + 1.5, 0, 8).slice(4, 8), 1, '#a8865a', { op: 0.6 }); } // spark burns
    f.stroke([[350, 470], [354, 550], [344, 624]], 2, INK, { op: 0.5 }); f.stroke([[386, 500], [396, 570], [392, 616]], 1.8, INK, { op: 0.45 });
    f.line([[300, 628], [410, 606]], 3, '#2a1c12', { op: 0.6 }); // charred hem
  });
  f.line([S.at(0.15, 0.09), S.at(0.62, 0.11)], 1.2, '#a08a6a', { op: 0.6, dash: '3 3' });
  // pocket with a file and chalk
  const pk = [S.at(0.38, 0.62), S.at(0.7, 0.6), S.at(0.72, 0.78), S.at(0.4, 0.8)];
  f.part(pk, W.LEA(f, { fill: '#4a321e', inkW: 1.3, cast: false }));
  f.stitches([pk[0], pk[1], pk[2], pk[3], pk[0]], '#a08a6a', 0.8);
  f.part([add(pk[0], [8, -30]), add(pk[0], [14, -30]), add(pk[0], [16, 2]), add(pk[0], [8, 2])], W.IR(f, { inkW: 1, sharp: true, cast: false }));
  f.part([add(pk[1], [-14, -12]), add(pk[1], [-6, -12]), add(pk[1], [-6, 2]), add(pk[1], [-14, 2])], { fill: P.bone, shade: 0.3, inkW: 1, sharp: true, cast: false });
  // neck strap up to the collar
  f.part([S.at(0.15, 0.08), S.at(0.24, 0.08), S.at(0.0, -0.12), S.at(-0.1, -0.12)], W.LEA(f, { fill: '#3e2a18', inkW: 1.1, cast: false }));

  // ---- belt with the rod clip, a hand-brush and a ring of copper wire
  f.bone('pelvis');
  f.part([S.at(-0.66, 0.84), S.at(0.6, 0.82), S.at(0.62, 0.9), S.at(-0.68, 0.92)], W.LEA(f, { fill: '#2a1c12', sharp: true }));
  f.part([S.at(-0.7, 0.8), S.at(-0.56, 0.8), S.at(-0.56, 0.94), S.at(-0.7, 0.94)], W.CU(f, { inkW: 1.2, sharp: true, cast: false })); // rod clip
  f.rivet(S.at(-0.63, 0.87), 2.6, P.copperL);
  W.rope(f, [S.at(-0.2, 0.92), S.at(-0.26, 1.05), S.at(-0.14, 1.12), S.at(-0.06, 1.02), S.at(-0.12, 0.92)], 2.2, { col: P.copper });
  f.part([S.at(0.0, 0.9), S.at(0.1, 0.9), S.at(0.12, 1.08), S.at(0.0, 1.08)], { fill: P.wood, shade: 0.4, inkW: 1, sharp: true, cast: false });
  for (let i = 0; i < 5; i++) f.line([S.at(0.01 + i * 0.022, 1.08), S.at(0.0 + i * 0.026, 1.2)], 1.6, '#2a2018');


  // ---- head: scorched, squinting into the work, teeth set; soot outside a clean oval where the mask sat
  f.bone('head');
  f.part(limb(S.at(0.1, -0.02), add(HC, [-6, 34]), 46, 40), SKs());
  B.head(f, HC, HH, hA, {
    skin, jaw: 1.14, chin: 0.02, nose: 1.08, hook: 0.3, mouth: 'snarl', squint: 0.55, browDown: 0.07, age: true, faceShade: 1.05,
    iris: '#1a120c', eyeWhite: '#c8b89a', hairCol: '#2a221c', beard: 'stubble', beardCol: '#2a221c', browW: 0.055,
    scar: [[0.02, 0.06], [0.12, 0.16], [0.2, 0.22]],
    hair: [[-0.42, 0.06], [-0.44, -0.2], [-0.3, -0.44], [-0.04, -0.54], [0.2, -0.5], [0.3, -0.42], [0.12, -0.42], [-0.08, -0.36], [-0.24, -0.22], [-0.32, 0.04]],
  });
  const hF = frame(HC, hA, HH);
  W.clipDraw(f, hF(W.faceOutline(1.14, 0.02)), () => { // soot round the edge of the face; clean where the mask sat
    for (const [u, v, rx, ry] of [[-0.24, 0.2, 0.14, 0.3], [-0.12, -0.44, 0.3, 0.1], [0.16, 0.5, 0.2, 0.08], [0.34, -0.3, 0.06, 0.1]]) f.flat(hF(ell([u, v], rx, ry, 0, 12)), P.sootD, { op: 0.35 });
  });
  W.lichtenberg(f, hF([[-0.08, 0.36]])[0], 2.2, 34, 2.2, { depth: 2, op: 0.7 });
  // hair stood on end: wiry, singed, fanning up and back
  W.standingHair(f, hF([[-0.4, -0.22], [-0.36, -0.34], [-0.3, -0.42], [-0.24, -0.47], [-0.16, -0.51], [-0.08, -0.54], [0.0, -0.55], [0.08, -0.54], [0.16, -0.52], [0.22, -0.48]]), 46, { w: 4.2, col: '#2a221c', lean: -0.25, fan: 1.4 });
  // ---- welding mask pushed up: a hardened leather frame with a smoked glass plate, strap round the head
  f.bone('mask');
  f.line(hF([[-0.38, -0.04], [-0.3, -0.24], [-0.1, -0.34]]), 5, '#2a1c12'); f.rivet(hF([[-0.37, -0.04]])[0], 3, P.bronzeL);
  const mk = hF([[-0.1, -0.5], [0.26, -0.62], [0.5, -0.5], [0.52, -0.36], [0.16, -0.26], [-0.08, -0.32]]);
  f.part(mk, W.LEA(f, { fill: '#3a2a1a', inkW: 1.6 }));
  const gl = hF([[0.04, -0.5], [0.3, -0.58], [0.44, -0.48], [0.18, -0.38], [0.04, -0.42]]);
  f.part(gl, { fill: '#1e1c18', shadow: '#0a0806', light: '#5a5048', shade: 0.4, inkW: 1.2, cast: false, hatch: false });
  f.line(hF([[0.1, -0.48], [0.3, -0.54]]), 1.6, '#c8b898', { op: 0.55 }); // glass sheen
  f.line(hF([[0.24, -0.42], [0.34, -0.5], [0.38, -0.47]]), 1, '#e8dcc0', { op: 0.5 }); // crack in the glass
  for (const q of hF([[-0.04, -0.44], [0.46, -0.42], [0.2, -0.58]])) f.rivet(q, 2.2, P.bronzeL);
  W.scorch(f, hF([[0.3, -0.52]])[0], 14, 6, 0.3);

  // ---- hammer: ash haft, a squat iron head scorched blue-black, a copper strap round the haft; the arc leaves it
  f.bone('hammer');
  const hb = add(WN, rot([-26, 0], hamA)); // butt below the fist
  f.part(limb(hb, hamHead, 13, 12, { steps: 6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(hb, hamHead, 0.05, -3), lp(hb, hamHead, 0.9, -3)], 1, P.woodL, { op: 0.5, straight: true });
  for (const t of [0.62, 0.68]) f.line([lp(hb, hamHead, t, -8), lp(hb, hamHead, t + 0.02, 8)], 3.2, P.copper, { straight: true });
  const HD = frame(hamHead, hamA, 1);
  f.part(HD([[-22, -34], [16, -32], [22, -24], [22, 26], [16, 34], [-22, 36], [-26, 26], [-26, -26]]), W.IR(f, { fill: '#2e2c2c', inkW: 1.8 }));
  f.part(HD([[-24, -40], [20, -40], [20, -30], [-24, -30]]), W.IR(f, { fill: '#4a4644', inkW: 1.2, sharp: true, cast: false })); // striking face, mushroomed
  f.flat(HD([[-18, -36], [14, -36], [10, -33], [-14, -33]]), '#c8c0b0', { op: 0.55 }); // worn bright
  f.part(HD([[-22, 34], [18, 34], [12, 54], [-16, 54]]), W.IR(f, { fill: '#3a3634', inkW: 1.4, cast: false })); // cross peen
  f.part(HD([[14, -12], [28, -12], [28, 12], [14, 12]]), W.IR(f, { fill: '#26221e', sharp: true, inkW: 1.2, cast: false })); // wedge
  W.lichtenberg(f, HD([[-10, -10]])[0], hamA + 2.6, 26, 1.8, { metal: true, depth: 1 });
  f.bone('arc');
  // the hammer-rod arc is an FX layer (out/worlds/world_V_arc_smith_fx.*), anchored on the 'arc' bone; sparks stay
  fxCapture(f, () => {
    W.bolt(f, HD([[-2, 40]])[0], add(rodTip, [0, -10]), { w: 2.6, forks: 4, jit: 0.34 });
    W.bolt(f, HD([[10, 30]])[0], add(rodTip, [4, -6]), { w: 1.2, forks: 2, jit: 0.5, bloom: false, ends: false });
  });
  W.sparks(f, HD([[0, 42]])[0], 9, 26, { ang: Math.PI / 2, spread: 2.4 });
  W.sparks(f, rodTip, 6, 18, { ang: -Math.PI / 2, spread: 2.6 });

  // ---- near arm raised: bare, scarred, the elbow up and back so it never crosses the face
  W.muscleArm(f, SN, EN, WN, [46, 38, 30], SKs(), '_n');
  f.bone('upperarm_n');
  W.lichtenberg(f, lp(SN, EN, 0.15, 4), ang(SN, EN) + 0.3, 66, 3.4, { depth: 3 });
  W.slag(f, lp(SN, EN, 0.6, -6), 8, 12, 3, 1.6, 2.6);
  f.bone('forearm_n');
  W.lichtenberg(f, lp(EN, WN, 0.1), ang(EN, WN) - 0.3, 34, 2.6, { depth: 2 });
  f.part(plate(EN, WN, 0.5, 1.1, 44, 52), W.LEA(f, { fill: '#3e2c1c' }));
  f.line([lp(EN, WN, 0.58, -22), lp(EN, WN, 0.58, 22)], 1.4, INK, { op: 0.6 });
  f.bone('hand_n');
  B.grip(f, WN, EN, hamA, 26, '#3e2c1c', { shadow: '#1a120a', cuff: false, name: 'arcsmith hammer' });
  return f;
}

// ------------------------------------------------------------------ BELLOWS IMP (cast, small 0.45)
// A forge-spirit whose body is a pair of smith's bellows: two pear-shaped boards hinged at a brass nozzle, pleated
// leather between them. The nozzle is its nose; its eyes are two ember-lit nail holes under the iron hinge strap; its
// mouth is a split in the leather below the nozzle, nail-toothed and glowing. The top board's handle sweeps back like a
// horn, the bottom one hangs as a tail. Small leathery wings on iron ribs beat from the top board; thin clawed arms and
// dangling legs hang underneath. Hovering, tipped nose-down toward its target.
// Rig: body (root of the creature) + lid (top board, hinged at the nozzle: lifts to inhale, slams to blast) + wing_n,
// wing_f (lid) + arm_n, arm_f, leg_n, leg_f (body) + tail (body). Motion: idle puffing (lid rises and falls, wings beat);
// attack a blast of hot air (lid slams shut, body pitches forward).
function bellowsImp() {
  const seed = 506, f = new Fig(W.base(seed, 820, { grimeY: 9999 }));
  W.textures(f);
  const gy = f.o.groundY;
  const BA = 0.16, bF = frame([300, 548], BA, 1); // the body frame: x along the bellows toward the nozzle, tipped nose-down
  const hinge = bF([[112, 6]])[0], tipN = bF([[176, 12]])[0];
  const wood = '#5a4430', woodD = '#2e2216', leath = '#6a4a2e', leathD = '#3a2616';
  const skin = '#3e3530', skinS = '#161110';
  f.joint('body', bF([[0, 10]])[0], null).joint('lid', hinge, 'body').joint('tail', bF([[-112, 34]])[0], 'body');
  const wrN = bF([[-36, -36]])[0], wrF = bF([[-56, -40]])[0];
  f.joint('wing_f', wrF, 'lid').joint('wing_n', wrN, 'lid');
  const aN = bF([[58, 50]])[0], aF = bF([[72, 44]])[0], lN = bF([[-24, 62]])[0], lF = bF([[-44, 58]])[0];
  f.joint('arm_f', aF, 'body').joint('arm_n', aN, 'body').joint('leg_f', lF, 'body').joint('leg_n', lN, 'body');

  // ground shadow and hot-air scorch on the floor (on root, it does not move with the imp)
  f.bone('root');
  f.flat(ell([310, gy + 2], 80, 10, 0, 18), '#000', { op: 0.35 });
  W.splats(f, [380, gy + 2], 40, 3, 6, '#15110e');

  // ---- far wing (behind everything): iron ribs, a charred leather web with holes
  const wing = (root, upA, span, sfx, dark) => {
    f.bone('wing' + sfx);
    const wrist = add(root, rot([span * 0.5, 0], upA));
    const fa = [upA - 0.5, upA - 1.05, upA - 1.6], fl = [0.78, 0.72, 0.52];
    const tips = fa.map((a, i) => add(wrist, rot([span * fl[i], 0], a)));
    const back = add(root, rot([span * 0.42, 0], upA - 1.95));
    const mem = [root, wrist, tips[0]];
    for (let i = 0; i < 3; i++) { const nx = i < 2 ? tips[i + 1] : back; mem.push(lerp(lerp(tips[i], nx, 0.5), wrist, 0.22)); mem.push(nx); }
    f.part(mem.map((q, i) => i === 2 || i === 4 || i === 6 ? [q[0], q[1], 1] : q), { fill: dark ? leathD : '#5a3e26', shadow: '#1a100a', shade: 0.4, tex: 'craze' + seed, texOp: 0.5, k: 0.75 });
    W.clipDraw(f, mem, () => {
      W.scorch(f, lerp(wrist, tips[1], 0.6), span * 0.3, span * 0.2, 0.5);
      for (let i = 0; i < 3; i++) { const p = lerp(wrist, tips[i], W.R(f, 0.45, 0.75)), r = W.R(f, 3, 6); f.flat(W.lumpy(f, ell(p, r, r * 0.8, 0, 8), 1.5), '#0e0a08'); f.line(ell(p, r + 1.5, r * 0.8 + 1.5, 0, 8).slice(0, 5), 1.2, P.ember, { op: 0.7 }); }
      for (const q of tips) f.line([wrist, lerp(wrist, q, 0.5), lerp(root, q, 0.7)], 1, INK, { op: 0.35 });
    });
    const rib = (a2, b2, w) => { f.line([a2, b2], w + 2, INK); f.line([a2, b2], w, P.ironL); };
    rib(root, wrist, 4); tips.forEach(q => rib(wrist, q, 2.6));
    f.part(ell(wrist, 5, 5, 0, 8), W.IR(f, { inkW: 1.1, cast: false }));
    f.part(ell(root, 7, 6, 0, 10), W.IR(f, { inkW: 1.2, cast: false }));
    for (const q of tips) f.part(limb(q, add(q, mul(sub(q, wrist), 0.12)), 3, 1, { steps: 3, capK: 1.5 }), { fill: P.bone, shade: 0.3, inkW: 0.9, cast: false, hatch: false });
  };
  wing(wrF, -1.75, 150, '_f', true);

  // ---- far limbs: thin, knobbed, sooty, clawed
  const imLimb = (a, k, e, sfx, w0, tint, foot) => {
    f.bone(sfx);
    const look = { fill: mix(skin, '#000', tint), shadow: skinS, shade: 0.4, tex: 'craze' + seed, texOp: 0.5 };
    f.part(K.chain([a, k, e], [w0, w0 * 0.72, w0 * 0.6], { bp: [[0, 0.4, 0.2, 0.2], [1, 0.0, 0.3, 0.08]], bq: [[1, 0.3, 0.15, 0.2]] }), look);
    f.flat(ell(k, w0 * 0.42, w0 * 0.36, 0, 8), mix(skin, '#000', 0.4), { op: 0.4 });
    W.hairline(f, [lerp(a, k, 0.3), lerp(a, k, 0.6), lerp(k, e, 0.3)], 1);
    const d = E.norm(sub(e, k));
    for (let i = 0; i < 3; i++) { const ca = Math.atan2(d[1], d[0]) + (i - 1) * 0.45, b0 = add(e, rot([w0 * 0.2, 0], ca)), t0 = add(b0, rot([w0 * (foot ? 0.9 : 1.0), 0], ca + 0.5)); f.part(limb(b0, t0, w0 * 0.34, 1.5, { steps: 3, capK: 1.4 }), { fill: P.bone, shadow: P.boneD, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); }
    f.part(ell(e, w0 * 0.42, w0 * 0.36, 0, 8), Object.assign({}, look, { inkW: 1.1, cast: false }));
  };
  imLimb(lF, bF([[-36, 92]])[0], bF([[-64, 112]])[0], 'leg_f', 15, 0.25, true);
  imLimb(aF, bF([[70, 78]])[0], bF([[104, 70]])[0], 'arm_f', 13, 0.25);

  // ---- tail: the bottom board's handle hanging back and down
  f.bone('tail');
  const tl0 = bF([[-104, 34]])[0], tl1 = bF([[-150, 62]])[0], tl2 = bF([[-170, 104]])[0];
  f.part(K.chain([tl0, tl1, tl2], [20, 14, 10]), { fill: wood, shadow: woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.part(ell(tl2, 9, 10, 0.4, 10), { fill: wood, shadow: woodD, shade: 0.4, inkW: 1.2, cast: false }); // turned knob
  f.line([lerp(tl0, tl1, 0.2), lerp(tl1, tl2, 0.6)], 1, P.woodL, { op: 0.5 });
  W.rope(f, [lerp(tl0, tl1, 0.5), add(lerp(tl0, tl1, 0.5), [-6, 16]), add(lerp(tl0, tl1, 0.5), [-2, 30])], 2, { col: '#6a5a40' }); // a loop of cord on the handle

  // ---- body: bottom board, pleated leather sides (drawn complete under where the lid lifts), nozzle
  f.bone('body');
  const bot = bF([[-118, 30], [-104, 50], [-40, 70], [40, 60], [104, 26], [124, 14], [118, 30], [40, 74], [-40, 82], [-108, 64], [-126, 42]]);
  f.part(bot, { fill: wood, shadow: woodD, shade: 0.42, tex: 'wood' + seed, texOp: 0.55 });
  // the leather: back is tall, it narrows to the hinge; the top edge reaches up under the lid
  const topE = t => bF([[-110 + t * 222, -50 + t * 46 - Math.sin(t * Math.PI * 0.9) * 18]])[0], botE = t => bF([[-110 + t * 222, 48 - t * 36 + Math.sin(t * Math.PI * 0.9) * 24]])[0];
  const leatherPts = []; for (let i = 0; i <= 12; i++) leatherPts.push(topE(i / 12)); for (let i = 12; i >= 0; i--) leatherPts.push(botE(i / 12));
  f.part(leatherPts, { fill: leath, shadow: leathD, shade: 0.42, tex: 'craze' + seed, texOp: 0.45 });
  W.clipDraw(f, leatherPts, () => {
    // accordion pleats: alternating lit and shadowed bands, converging on the hinge
    for (let i = 0; i < 9; i++) { const t0 = i / 9, t1 = (i + 0.5) / 9, t2 = (i + 1) / 9; f.flat([topE(t0), topE(t1), botE(t1), botE(t0)], i % 2 ? '#1e140c' : mix(leath, '#d8b890', 0.15), { op: i % 2 ? 0.5 : 0.35 }); f.line([topE(t1), lerp(topE(t1), botE(t1), 0.5), botE(t1)], 1.3, INK, { op: 0.7 }); }
    W.scorch(f, bF([[-60, 10]])[0], 40, 30, 0.4);
    W.lichtenberg(f, bF([[-90, -20]])[0], BA + 0.3, 60, 2.2, { depth: 2, col: '#1a100a', op: 0.7 });
  });
  // the mouth: a split in the leather under the nozzle, nail teeth, the fire inside
  const mo = [bF([[60, 14]])[0], bF([[92, 6]])[0], bF([[108, 12]])[0], bF([[94, 24]])[0], bF([[64, 26]])[0]];
  f.flat(mo, P.char);
  f.flat([bF([[68, 18]])[0], bF([[92, 12]])[0], bF([[100, 15]])[0], bF([[90, 21]])[0], bF([[70, 22]])[0]], P.ember);
  f.flat([bF([[76, 18]])[0], bF([[90, 15]])[0], bF([[86, 19]])[0]], P.hot);
  for (const [x, y, d] of [[74, 13, 8], [92, 10, -6]]) f.line([bF([[x, y]])[0], bF([[x + 1, y + 5]])[0], bF([[x + 3, y + 5 + d * 0.3]])[0]], 1.6, '#8a847a'); // two bent nails in the split
  f.line([bF([[60, 14]])[0], bF([[52, 20]])[0]], 1.2, INK, { op: 0.6 }); f.line([bF([[64, 26]])[0], bF([[58, 32]])[0]], 1.2, INK, { op: 0.6 }); // the tear runs on
  W.glow(f, bF([[86, 18]])[0], 18, 10, P.lamp, 0.35);
  // nozzle: a brass cone, a ring where it meets the boards, fused at the tip, glowing
  const nz = [bF([[104, -6]])[0], bF([[172, 6]])[0], bF([[178, 12]])[0], bF([[172, 18]])[0], bF([[104, 28]])[0]];
  f.part(nz, W.BR(f, { inkW: 1.5 }));
  f.line([bF([[110, -1]])[0], bF([[168, 8]])[0]], 1.4, P.bronzeP, { op: 0.7 });
  f.part([bF([[98, -10]])[0], bF([[112, -10]])[0], bF([[112, 32]])[0], bF([[98, 32]])[0]], W.IR(f, { inkW: 1.3, sharp: true }));
  f.rivet(bF([[105, -2]])[0], 2.2, P.ironL); f.rivet(bF([[105, 24]])[0], 2.2, P.ironL);
  W.lichtenberg(f, bF([[130, 4]])[0], BA - 0.1, 30, 1.4, { metal: true, depth: 1 });
  W.fusedRun(f, bF([[150, 16]])[0], 12, 3);
  f.flat(ell(tipN, 4, 5, BA, 8), P.char); f.flat(ell(tipN, 2.4, 3, BA, 8), P.hot);
  // hot breath leaving the nose: heat smudge, ash and a few sparks
  W.smoke(f, add(tipN, [10, 0]), 60, 22, { sway: 10, drift: 26, op: 0.2, col: '#8a6a4a', line: '#a88a6a' });
  W.ash(f, add(tipN, [12, -4]), 8, 30, 50, 0.8);
  W.sparks(f, add(tipN, [6, 0]), 5, 16, { ang: BA, spread: 1.0 });

  // ---- near limbs (in front of the leather)
  imLimb(lN, bF([[-16, 98]])[0], bF([[-46, 120]])[0], 'leg_n', 17, 0, true);
  imLimb(aN, bF([[54, 88]])[0], bF([[92, 84]])[0], 'arm_n', 15, 0);

  // ---- lid: the top board seen from above, its handle swept back like a horn; the hinge strap is the brow
  f.bone('lid');
  const lid = bF([[-126, -40], [-110, -66], [-60, -80], [0, -76], [60, -58], [100, -34], [122, -12], [116, 2], [80, -8], [20, -20], [-50, -32], [-110, -30]]);
  f.part(lid, { fill: mix(wood, '#000', 0.05), shadow: woodD, shade: 0.42, tex: 'wood' + seed, texOp: 0.6 });
  W.clipDraw(f, lid, () => {
    W.scorch(f, bF([[90, -24]])[0], 30, 18, 0.6); W.scorch(f, bF([[-110, -50]])[0], 26, 30, 0.45);
    W.lichtenberg(f, bF([[-20, -40]])[0], BA - 2.9, 80, 2.4, { metal: false, depth: 2, col: '#1a100a', op: 0.75 });
    f.line(bF([[-110, -46], [-40, -58], [40, -48], [100, -24]]), 1.4, P.woodL, { op: 0.45 }); // worn bright rim
  });
  // the board's charred edge flaking up
  W.flakes(f, bF([[-60, -76]])[0], 40, 6, 5, 0.7);
  // horn: the top handle sweeping back and up
  const h0 = bF([[-112, -52]])[0], h1 = bF([[-158, -82]])[0], h2 = bF([[-176, -126]])[0];
  f.part(K.chain([h0, h1, h2], [22, 15, 9]), { fill: wood, shadow: woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.part(ell(h2, 8, 9, 0.4, 10), { fill: wood, shadow: woodD, shade: 0.4, inkW: 1.2, cast: false });
  f.line([lerp(h0, h1, 0.3), lerp(h1, h2, 0.6)], 1, P.woodL, { op: 0.5 });
  // iron hinge strap across the front of the lid: the brow; two nail holes under it glow: the eyes
  const st = bF([[70, -56], [98, -40], [116, -18], [118, -8], [100, -22], [70, -42]]);
  f.part(st, W.IR(f, { inkW: 1.4 }));
  W.rivetRow(f, bF([[76, -50]])[0], bF([[112, -16]])[0], 3, 2.4, P.ironL);
  for (const [x, y, l] of [[84, -26, 6], [100, -16, 4.4]]) { const c = bF([[x, y]])[0], a = BA + 0.5; f.flat(ell(c, l, 1.7, a, 8), '#080504'); f.line([add(c, rot([-l * 0.6, 0], a)), add(c, rot([l * 0.6, 0.2], a))], 1.2, P.lamp); W.glow(f, c, 6, 3, P.lamp, 0.3, false, a); } // narrow ember slits under the strap (eye audit 2026-11-23: no round glowing dots)
  // a brass maker's plate nailed to the lid, half burnt away
  const pl = bF([[-40, -62], [-6, -62], [-4, -46], [-38, -44]]);
  f.part(pl, W.BR(f, { inkW: 1.1, sharp: true, cast: false }));
  for (const q of pl) f.rivet(lerp(q, bF([[-22, -54]])[0], 0.2), 1.6, P.bronzeL);
  f.line(bF([[-34, -56], [-14, -56]]), 1, INK, { op: 0.6 }); f.line(bF([[-34, -51], [-20, -51]]), 1, INK, { op: 0.6 });

  // ---- near wing (in front)
  wing(wrN, -1.45, 160, '_n', false);
  return f;
}

// ------------------------------------------------------------------ SPARK SWARM (cast, small, a cloud 0.6 across)
// Sparks struck from the anvil that never cooled. A clinker of slag, black-crusted and split by white-hot seams, hangs
// in the middle; around it eight knots of sparks swirl on one tilted orbit, each a bright head dragging a fading tail,
// with fragments of hot slag tumbling among them. Short jagged arcs jump between neighbouring knots and down to the core.
// Molten drops fall from the core's underside; the floor under it is scorched with a branching burn.
// Rig: core (root of the creature) + spark_1..8 (one per knot, pivot at the core so turning them orbits the knot) +
// arcs (core). Motion: idle a buzzing swirl (sparks orbit, core bobs); attack a burst (sparks fly outward; scale or
// translate keys on the spark bones, see the review).
function sparkSwarm() {
  const seed = 507, f = new Fig(W.base(seed, 820, { grimeY: 9999 }));
  W.textures(f);
  const gy = f.o.groundY, C0 = [300, 500], TILT = -0.22, RX = 178, RY = 104;
  // each knot: offset of its head from the core, curl radius, heading, curl direction. The cloud is lopsided and rises
  // (more sparks above the core than below), so it never reads as a ring round a centre.
  const KN = [[-170, -30, 70, -1.2, 1], [-110, -140, 56, -0.4, -1], [-10, -190, 80, 0.2, 1], [96, -136, 60, 0.9, -1], [176, -54, 76, 1.5, 1], [128, 52, 48, 2.6, -1], [-128, 64, 52, -2.4, 1], [40, -88, 40, 1.0, 1]];
  const orbitK = (th, k) => { const [dx, dy, r, a0, sg] = KN[k], head = add(C0, [dx, dy]), lc = add(head, rot([-r, 0], a0)); return add(lc, rot([r, 0], a0 + (th - heads[k]) * sg * 2.8)); };
  const orbit = th => add(C0, rot([Math.cos(th) * RX, Math.sin(th) * RY], TILT));
  f.joint('core', C0, null).joint('arcs', C0, 'core');
  const N = 8, heads = [];
  for (let i = 0; i < N; i++) { const th = -Math.PI / 2 + i * Math.PI * 2 / N + (i % 2 ? 0.18 : -0.1); heads.push(th); f.joint('spark_' + (i + 1), C0, 'core'); }
  const front = th => Math.sin(th) > -0.05;

  // ---- floor: a scorch with a branching burn where sparks land, a few cooling beads
  f.bone('root');
  f.flat(ell([300, gy + 2], 120, 12, 0, 20), '#000', { op: 0.3 });
  W.lichtenberg(f, [300, gy - 1], Math.PI + 0.05, 80, 2.2, { col: P.sootD, depth: 2, op: 0.8 });
  W.lichtenberg(f, [300, gy - 1], -0.05, 70, 2, { col: P.sootD, depth: 2, op: 0.8 });
  for (const x of [222, 268, 352, 388]) { f.flat(ell([x, gy - 2], 3.4, 2, 0, 6), P.char); f.flat(ell([x, gy - 2.5], 1.6, 1, 0, 6), P.lamp); }
  W.glow(f, [300, gy], 90, 10, P.lamp, 0.15);

  // a knot of sparks: a comet head on the orbit with a curved tail behind it, a few loose sparks, a slag fragment
  const knot = (th, k) => {
    const head = orbitK(th, k), tail = [];
    // (consistency pass 2026-11-25: the tails wiggled and read as arcs; now a smooth comet trail that cools and fades)
    for (let j = 0; j <= 8; j++) tail.push(add(orbitK(th - j * 0.07 * (1 + (k % 3) * 0.3), k), [Math.sin(j * 1.7 + k) * 0.8, Math.cos(j * 1.3 + k) * 0.8]));
    const wv = 4.4 + (k % 3);
    f.stroke(tail.slice().reverse(), wv + 3, P.sootD, { op: 0.4 });
    f.stroke(tail.slice(3).reverse(), wv * 0.8, P.ochD || P.sootL, { op: 0.45 }); // the cooled end: dull ember
    f.stroke(tail.slice(0, 6).reverse(), wv, P.arcD, { op: 0.9 });
    f.stroke(tail.slice(0, 5).reverse(), wv * 0.6, P.arcG);
    f.line(tail.slice(0, 4), wv * 0.35, P.arc);
    W.glow(f, head, 14, 10, P.arcG, 0.4);
    f.flat(ell(head, wv * 0.9, wv * 0.8, 0, 10), P.arc);
    // loose sparks around the head
    for (let j = 0; j < 5; j++) { const p = add(head, [W.R(f, -26, 26), W.R(f, -20, 20)]), d = rot([1, 0], th + Math.PI / 2 + TILT + W.R(f, -0.4, 0.4)), l = W.R(f, 6, 14); f.line([add(p, mul(d, -l)), p], 2.6, P.sootD, { straight: true, op: 0.5 }); f.line([add(p, mul(d, -l)), p], 1.5, j % 2 ? P.arcG : P.lampL, { straight: true }); f.flat(ell(p, 1.5, 1.5, 0, 6), P.arc); }
    // a tumbling fragment of hot slag riding the knot
    if (k % 2 === 0) { const q = lerp(orbitK(th, k), C0, 0.42), r = 7 + (k % 3) * 2; f.part(W.lumpy(f, ell(q, r * 1.2, r, th, 9), r * 0.4), { fill: P.slag, shadow: '#000', light: P.slagL, shade: 0.4, inkW: 1.1, cast: false, hatch: false }); W.seam(f, [add(q, rot([-r * 0.7, -r * 0.2], th)), add(q, rot([0, r * 0.15], th)), add(q, rot([r * 0.6, -r * 0.3], th))], 1.1, { glow: false }); }
    return head;
  };
  // loose sparks filling the cloud: short streaks roughly along the swirl, thicker toward the middle
  const loose = (frontHalf) => { for (let j = 0; j < 80; j++) { const th = W.R(f, 0, Math.PI * 2), rr = Math.sqrt(W.R(f, 0.15, 1.1)); if ((j % 2 === 0) !== frontHalf) continue; const p = add(C0, [Math.cos(th) * RX * rr, Math.sin(th) * RY * rr * 1.3 - (Math.sin(th) < 0 ? 60 * rr : 0)]), d = rot([1, 0], th + Math.PI / 2 + TILT + W.R(f, -0.6, 0.6)), l = W.R(f, 5, 16); f.line([add(p, mul(d, -l)), p], 3, P.sootD, { straight: true, op: 0.45 }); f.line([add(p, mul(d, -l)), p], 1.6, j % 3 ? P.arcG : P.lampL, { straight: true }); f.flat(ell(p, 1.6, 1.6, 0, 6), P.arc); } };
  // ---- the back half of the swarm
  f.bone('core'); loose(false);
  heads.forEach((th, i) => { if (i % 2 === 1) { f.bone('spark_' + (i + 1)); knot(th, i); } });
  // a thin haze of soot and heat round the core (the cloud's body)
  f.bone('core');
  W.smoke(f, add(C0, [-10, -40]), 200, 60, { sway: 24, drift: 30, op: 0.22, col: P.sootL, line: P.ochL }); W.smoke(f, add(C0, [20, -30]), 160, 40, { sway: 18, phase: 2, drift: -40, op: 0.18, col: P.sootL, line: P.ochL });
  W.glow(f, C0, 70, 60, P.lamp, 0.35, true);

  // ---- the core: a split clinker of slag, black crust, white-hot seams, molten drops falling
  const core = [[-48, -24, 1], [-40, -38], [-22, -50, 1], [-8, -48], [6, -58, 1], [30, -46], [42, -30, 1], [56, -10], [58, 8, 1], [48, 22], [46, 38, 1], [24, 44], [10, 54, 1], [-8, 48], [-26, 50, 1], [-40, 36], [-50, 20, 1], [-60, 2]].map(q => [q[0] + C0[0], q[1] + C0[1], q[2] || 0]);
  f.part(core, { fill: P.slag, shadow: '#000', light: P.slagL, shade: 0.42, tex: 'pit' + seed, texOp: 0.8, inkW: 2, k: 0.8 });
  W.clipDraw(f, core, () => {
    // one dominant fracture running diagonally off-centre, fine dim crazing off it (no paired bright points, no
    // central split: nothing that can read as a face)
    W.seam(f, [add(C0, [-62, 34]), add(C0, [-34, 22]), add(C0, [-12, 16]), add(C0, [10, -2]), add(C0, [30, -20]), add(C0, [60, -34])], 3.6, { hot: P.core });
    W.seam(f, [add(C0, [-12, 16]), add(C0, [-6, 34]), add(C0, [4, 58])], 2, { glow: false });
    for (const [a0, a1, a2] of [[[-40, 24], [-46, 4], [-40, -18]], [[18, -10], [26, 8], [44, 20]], [[34, -22], [30, -42], [40, -56]], [[-20, 18], [-30, 40], [-24, 52]]]) W.hairline(f, [add(C0, a0), add(C0, a1), add(C0, a2)], 1.2);
    // cooling plates of crust lifting at the edges
    for (const [x, y, a] of [[-38, -26, 2.4], [30, -34, -0.8], [36, 20, 0.6]]) { const q = add(C0, [x, y]); f.part([add(q, rot([-10, -5], a)), add(q, rot([12, -7], a)), add(q, rot([10, 6], a)), add(q, rot([-8, 7], a))], { fill: P.slagL, shadow: P.slag, shade: 0.4, inkW: 1, cast: false, hatch: false }); f.line([add(q, rot([-10, -5], a)), add(q, rot([12, -7], a))], 1.2, P.lampL, { op: 0.7 }); }
    f.flat(ell(add(C0, [-22, -34]), 14, 4, -0.3, 8), '#e8e0d0', { op: 0.3 }); // glassy shine, one long streak
  });
  W.flakes(f, add(C0, [0, -50]), 30, 6, 4, 0.8);
  W.ash(f, add(C0, [0, -54]), 10, 50, 120, 1);
  for (const [x, l] of [[8, 70], [-38, 26]]) { const p0 = add(C0, [x, 46 - Math.abs(x) * 0.3]); f.stroke([p0, add(p0, [0, l * 0.5]), add(p0, [1, l * 0.8])], 4, P.lamp); f.flat(ell(add(p0, [1, l]), 3.4, 4.2, 0, 8), P.hot); W.glow(f, add(p0, [1, l]), 6, 6, P.lamp, 0.5); }

  // ---- arcs: short jagged threads jumping between neighbouring knots and down to the core
  f.bone('arcs');
  const hp = heads.map((th, k) => orbitK(th, k));
  // (consistency pass 2026-11-25: the arcs are an FX layer, out/worlds/world_V_spark_swarm_fx.*; the sparks stay as embers)
  fxCapture(f, () => {
    for (const [i, j] of [[0, 1]]) W.bolt(f, hp[i], lerp(hp[i], hp[j], 0.6), { w: 1.4, forks: 1, jit: 0.45, bloomOp: 0.1, ends: false });
    W.bolt(f, hp[2], lerp(hp[2], hp[3], 0.8), { w: 1.4, forks: 1, jit: 0.5, bloom: false, ends: false }); W.bolt(f, lerp(hp[7], C0, 0.2), lerp(hp[7], C0, 0.6), { w: 1.4, forks: 1, jit: 0.5, bloom: false, ends: false });
  });

  // ---- the front half of the swarm
  f.bone('core'); loose(true);
  heads.forEach((th, i) => { if (i % 2 === 0) { f.bone('spark_' + (i + 1)); knot(th, i); } });
  return f;
}

// ------------------------------------------------------------------ BRONZE AUTOMATON (cast, large 1.5)
// A guild-made worker machine: heavy, hunched over bent piston legs, the near arm driven straight out in a piston punch,
// the far arm chambered back for the next. The torso is a riveted bronze cuirass of overlapping plates (deep chest,
// sloping shoulders, lames over the belly), scorched black, seams glowing where the furnace heat leaks; a grilled window
// in the chest shows the copper coil crackling with arcs. A wind-up key the length of a man's arm stands out of its
// back. The head is a small bronze dome sunk between the shoulder plates: a heavy brow visor over a pierced brass
// sensing grille (a row of small vent holes, no lens eyes: eye audit 2026-11-23), a grille for a mouth. Exposed pistons and gears at the elbows, hips and knees; flat toed feet.
// Rig: pelvis (root), torso, head, the arms (upperarm/forearm/hand), piston_n and piston_f (the rods, parent forearm:
// they slide, so the punch needs a translate key), legs (thigh/shin/foot), key (torso; turning it is a squash on its
// shaft axis, see the review), arcs (torso). Motion: idle a ticking whir (key turns, head ticks); attack a piston punch.
function bronzeAutomaton() {
  const seed = 504, CH = 1100, f = new Fig(W.base(seed, CH, { grimeY: 860 }));
  W.textures(f);
  const gy = f.o.groundY;
  const N = [512, 352], C = [404, 424], Pv = [432, 648];
  const S = B.spine(N, C, Pv, 150);
  const SN = [456, 388], EN = [584, 404], WN = [722, 400];
  const SF = [560, 372], EF = [500, 520], WF = [566, 590];
  const HN = [470, 664], KN = [556, 830], AN = [548, 1000];
  const HF = [398, 652], KF = [356, 838], AF = [300, 1002];
  const HC = [572, 296], hA = 0.1;
  const BRZ = (o = {}) => W.BR(f, o), BRD = (o = {}) => W.BR(f, Object.assign({ fill: mix(P.bronze, P.sootD, 0.35) }, o));
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.3, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('piston_n', EN, 'forearm_n').joint('piston_f', EF, 'forearm_f').joint('key', S.at(-0.78, 0.3), 'torso').joint('arcs', [524, 452], 'torso');

  // shared bits: an exposed piston (cylinder and bright rod), a riveted plate with soot and a glowing seam
  const piston = (a, b, w, frac = 0.55) => {
    const m = lerp(a, b, frac);
    f.part(limb(a, m, w, w * 0.92, { steps: 4, capK: 0.3 }), W.IR(f, { inkW: 1.6 }));
    f.part(limb(m, b, w * 0.42, w * 0.42, { steps: 4, capK: 0.3 }), { fill: '#8a8680', shadow: '#2e2c2a', light: '#e8e4dc', shade: 0.4, inkW: 1.3, cast: false, hatch: false });
    f.line([lp(m, b, 0.05, -w * 0.1), lp(m, b, 0.95, -w * 0.1)], 1.4, '#f0ece4', { op: 0.75, straight: true });
    f.part(limb(lp(a, m, 0.92), lp(a, m, 1.05), w * 1.14, w * 1.14, { steps: 2, capK: 0.2 }), W.IR(f, { fill: P.ironL, inkW: 1.2, cast: false }));
    f.flat(ell(lp(m, b, 0.3, w * 0.3), 2, 3.4, 0, 6), '#1a1612', { op: 0.8 }); // oil
  };
  const platePart = (pts, o = {}) => {
    if (o.hard !== false) pts = pts.map(q => [q[0], q[1], 1]);
    const d = f.part(pts, Object.assign(o.dark ? BRD() : BRZ(), { k: 0.6 }, o.look || {}));
    W.bevel(f, d, E.bbox(pts), o.bev ?? 5);
    if (o.hard !== false && pts.length >= 3) { f.line([lerp(pts[0], pts[1], 0.04), lerp(pts[0], pts[1], 0.96)].map(q => add(q, [1.5, 3])), 2, P.bronzeP, { op: 0.55, straight: true }); f.line([lerp(pts[pts.length - 2], pts[pts.length - 1], 0.04), lerp(pts[pts.length - 2], pts[pts.length - 1], 0.96)].map(q => add(q, [0, -3])), 2, P.bronzeD, { op: 0.6, straight: true }); }
    W.clipDraw(f, pts, () => {
      if (o.scorch) W.scorch(f, o.scorch[0], o.scorch[1], o.scorch[2], 0.55);
      if (o.lich) W.lichtenberg(f, o.lich[0], o.lich[1], o.lich[2], o.lich[3] || 2.6, { metal: true, depth: 2 });
      if (o.dents) for (let i = 0; i < o.dents[2]; i++) { const q = W.scatter(f, o.dents[0], o.dents[1], o.dents[1]), r = W.R(f, 4, 9); f.flat(ell(q, r, r * 0.6, f.r() * 3, 10), '#000', { op: 0.25 }); f.line(ell(q, r, r * 0.6, 0, 10).slice(0, 4), 1, P.bronzeP, { op: 0.5 }); }
    });
    if (o.rivets) for (const [a, b, n] of o.rivets) W.rivetRow(f, a, b, n, 3.4, P.bronzeL, { fused: 0.15, missing: 0.1 });
    return d;
  };
  const gearAt = (c, r, a) => W.gear(f, c, r, Math.round(r * 0.7), { a, look: { fill: mix(P.bronze, P.sootD, 0.2) } });

  // ---- far arm, chambered back behind the body: the rod drawn in, a clamp of a hand by the hip
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [44, 40]), W.IR(f, { inkW: 1.6 }));
  W.cylinder(f, lerp(SF, EF, 0.14), lerp(SF, EF, 0.86), 72, 62, BRD({ shade: 0.5 }), { flanges: [[0.04, 80], [0.96, 70]] });
  f.bone('forearm_f');
  f.part(K.chain([EF, WF], [40, 36]), W.IR(f, { inkW: 1.6 }));
  W.cylinder(f, lerp(EF, WF, 0.18), lerp(EF, WF, 0.9), 62, 54, BRD({ shade: 0.5 }), { flanges: [[0.04, 70], [0.96, 62]] });
  W.hinge(f, EF, 24);
  f.bone('piston_f'); piston(lp(EF, WF, 0.1, -26), lp(EF, WF, 0.85, -26), 18, 0.7);
  f.bone('hand_f');
  W.gauntlet(f, WF, ang(EF, WF), 40, true, BRD({ fill: mix(P.bronze, P.sootD, 0.4) }), { scale: 1.1 });

  // ---- far leg
  const leg = (Hp, Kn, A, sfx, dark) => {
    const look = dark ? BRD : BRZ;
    f.bone('thigh' + sfx);
    f.part(K.chain([Hp, Kn], [70, 56]), W.IR(f, { inkW: 1.6 })); // iron frame under the plates
    const dT = E.norm(sub(Kn, Hp)), nT = [-dT[1], dT[0]];
    W.cylinder(f, lerp(Hp, Kn, 0.06), lerp(Hp, Kn, 0.86), 124, 98, look({ shade: 0.46 }), { p: [[0.35, 0.06, 0.25]], flanges: [[0.04, 132], [0.96, 106]] });
    W.clipDraw(f, limb(lerp(Hp, Kn, 0.06), lerp(Hp, Kn, 0.86), 124, 98), () => { W.scorch(f, lerp(Hp, Kn, 0.3), 40, 60, 0.55); W.dent(f, lerp(Hp, Kn, 0.55), 12); if (sfx === '_n') W.lichtenberg(f, lerp(Hp, Kn, 0.2), ang(Hp, Kn) + 0.3, 90, 2.6, { metal: true, depth: 2 }); });
    f.line([lp(Hp, Kn, 0.4, -62), lp(Hp, Kn, 0.43, 0), lp(Hp, Kn, 0.4, 60)], 2.4, INK, { op: 0.6 }); // the seam round the thigh tube
    piston(add(lerp(Hp, Kn, 0.35), mul(nT, -60)), add(lerp(Kn, A, 0.3), mul(nT, -44)), 20, 0.5); // hamstring piston behind the knee
    f.bone('shin' + sfx);
    const dS = E.norm(sub(A, Kn)), nS = [-dS[1], dS[0]];
    f.part(K.chain([Kn, A], [54, 44]), W.IR(f, { inkW: 1.6 }));
    W.cylinder(f, lerp(Kn, A, 0.12), lerp(Kn, A, 0.9), 92, 72, look({ shade: 0.46 }), { q: [[0.3, 0.08, 0.2]], flanges: [[0.04, 100], [0.96, 80]] });
    W.clipDraw(f, limb(lerp(Kn, A, 0.12), lerp(Kn, A, 0.9), 92, 72), () => { W.scorch(f, lerp(Kn, A, 0.78), 46, 70, 0.55); W.dent(f, lerp(Kn, A, 0.5), 10); });
    W.seam(f, [add(lerp(Kn, A, 0.4), mul(nS, -8)), add(lerp(Kn, A, 0.5), mul(nS, 6)), add(lerp(Kn, A, 0.62), mul(nS, -4))], 2, { glowOp: 0.25 });
    W.hinge(f, Kn, 30); // the knee: an iron ball in a bronze socket, and a faceted cop over it
    const KF2 = frame(Kn, ang(Kn, A) - Math.PI / 2, 0.8);
    platePart(KF2([[-40, -34], [6, -50], [48, -30], [44, 20], [0, 30], [-40, 18]]), { dark: !dark, bev: 4, rivets: [[KF2([[-26, 14]])[0], KF2([[30, 12]])[0], 2]] });
    f.line(KF2([[4, -48], [0, 28]]), 2.2, P.bronzeP, { op: 0.6 });
    f.bone('foot' + sfx);
    // flat toed foot: a heel block, an instep plate and three riveted toe plates
    const gx = A[0], hf = [[gx - 52, gy], [gx - 56, gy - 34], [gx - 30, A[1] - 6], [gx + 30, A[1] - 2], [gx + 70, gy - 36], [gx + 112, gy - 24], [gx + 118, gy]];
    f.part(hf.map(q => [q[0], q[1], 1]), look({ k: 0.8 }));
    for (let i = 0; i < 3; i++) { const x0 = gx + 46 + i * 24; f.part([[x0, gy - 34 + i * 4], [x0 + 26, gy - 30 + i * 4], [x0 + 30, gy], [x0 - 2, gy]].map(q => [q[0], q[1], 1]), look({ inkW: 1.3, cast: false })); f.rivet([x0 + 12, gy - 20 + i * 3], 2.6, P.bronzeL); }
    f.part([[gx - 58, gy - 12], [gx + 122, gy - 12], [gx + 124, gy], [gx - 58, gy]].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 1.2, cast: false })); // iron sole
    W.splats(f, [gx + 30, gy - 20], 70, 14, 8, '#15110e');
    f.part(ell(A, 22, 20, 0, 12), W.IR(f, { fill: P.ironL, inkW: 1.3, cast: false })); // ankle ball
    f.rivet(A, 5, P.ironL);
  };
  leg(HF, KF, AF, '_f', true);
  // a broken shackle still riveted round the far ankle, its chain links hanging
  f.bone('shin_f');
  f.part([add(AF, [-40, -60]), add(AF, [36, -66]), add(AF, [38, -44]), add(AF, [-40, -38])], W.IR(f, { inkW: 1.4 }));
  W.chainLinks(f, [add(AF, [-30, -44]), add(AF, [-46, -10]), add(AF, [-52, 30])], 16, P.ironL);

  f.bone('root');
  f.flat(ell([430, gy + 4], 250, 18, 0, 20), '#000', { op: 0.3 });
  // ---- the wind-up key in the back: square shaft, collar, a figure-eight bow standing in the picture plane
  f.bone('key');
  const k0 = S.at(-0.72, 0.3), k1 = add(k0, [-118, -22]), kb = add(k1, [-26, -4]);
  f.part(limb(k0, k1, 30, 26, { steps: 4, capK: 0.3 }), W.IR(f, { inkW: 1.5 }));
  f.line([lp(k0, k1, 0.0, -8), lp(k0, k1, 1, -7)], 1.2, P.ironL, { op: 0.6, straight: true });
  f.part(ell(lerp(k0, k1, 0.15), 14, 26, ang(k0, k1), 12), BRZ({ inkW: 1.4 })); // collar where it enters the back
  f.part(ell(k1, 12, 22, ang(k0, k1), 12), BRZ({ inkW: 1.4 }));
  f.part(limb(add(kb, [0, -40]), add(kb, [0, 40]), 40, 40, { steps: 4, capK: 0.4 }), BRZ({ inkW: 1.6 })); // the waist between the eyes
  for (const [dy, a] of [[-72, -0.2], [72, 0.15]]) {
    const c = add(kb, [-6, dy]), o = ell(c, 54, 64, a, 24), i = ell(add(c, [0, dy > 0 ? 6 : -6]), 27, 30, a, 20).reverse();
    const d = E.smooth(o) + ' ' + E.smooth(i);
    f.part(d, BRZ({ inkW: 2, shade: 0.45, bbPts: o }));
    W.clipDraw(f, o, () => { W.scorch(f, add(c, [-16, 0]), 34, 40, 0.4); f.line(ell(add(c, [0, dy > 0 ? 6 : -6]), 29, 32, a, 20).slice(10, 18), 2, P.bronzeP, { op: 0.6 }); });
  }
  W.rivetRow(f, add(kb, [-2, -30]), add(kb, [-2, 30]), 3, 3.6, P.bronzeL);
  W.lichtenberg(f, add(kb, [-20, -100]), 2.2, 50, 2.2, { metal: true, depth: 2 });
  f.scratches(add(kb, [0, 60]), 30, 6, P.bronzeP, 0.9);

  // ---- torso: deep riveted cuirass, scorched; plates overlap down the belly to a pelvis girdle
  f.bone('pelvis');
  platePart([S.at(-0.66, 0.84), S.at(0.62, 0.82), add(S.at(0.7, 1.0), [10, 30]), add(S.at(0.2, 1.06), [0, 40]), add(S.at(-0.5, 1.04), [-6, 34]), S.at(-0.72, 0.98)], { dark: true, scorch: [S.at(-0.2, 0.95), 40, 30], rivets: [[S.at(-0.6, 0.88), S.at(0.56, 0.86), 7]] });
  gearAt(HN, 46, 0.3); f.part(ell(HN, 15, 15, 0, 10), W.IR(f, { fill: P.ironL, inkW: 1.2, cast: false }));
  f.bone('torso');
  const cuir = S.shape([[-0.08, 0.5, 0.36], [0.05, 0.86, 0.62], [0.2, 0.98, 0.86], [0.4, 0.94, 0.9], [0.58, 0.8, 0.78], [0.72, 0.7, 0.66], [0.84, 0.66, 0.6]]);
  platePart(cuir, { bev: 8, scorch: [S.at(-0.5, 0.45), 60, 90], dents: [S.at(-0.2, 0.3), 50, 5], lich: [S.at(-0.7, 0.18), 0.9, 130, 3.2] });
  for (const u of [-0.3, 0.3]) { f.line([S.at(u, 0.08), S.at(u + 0.04, 0.32), S.at(u, 0.56)], 2.6, INK, { op: 0.7 }); f.line([S.at(u + 0.03, 0.08), S.at(u + 0.07, 0.32), S.at(u + 0.03, 0.56)], 1.6, P.bronzeP, { op: 0.5 }); W.rivetRow(f, S.at(u + 0.07, 0.1), S.at(u + 0.07, 0.54), 6, 3, P.bronzeL, { fused: 0.15 }); } // the barrel is three plates riveted at two seams
  // back plate over the hump and a pectoral plate over the chest: separate plates overlapping the cuirass
  platePart([S.at(-0.55, 0.02), S.at(-0.1, -0.06), S.at(-0.2, 0.2), S.at(-0.88, 0.36), S.at(-0.96, 0.16)], { dark: true, scorch: [S.at(-0.6, 0.15), 40, 30], rivets: [[S.at(-0.5, 0.06), S.at(-0.85, 0.26), 4]] });
  platePart([S.at(0.15, 0.04), S.at(0.8, 0.12), S.at(0.94, 0.26), S.at(0.84, 0.3), S.at(0.2, 0.28)], { scorch: [S.at(0.6, 0.12), 30, 20], rivets: [[S.at(0.22, 0.1), S.at(0.8, 0.18), 5]], dents: [S.at(0.5, 0.18), 20, 2] });
  W.clipDraw(f, cuir, () => { W.soot(f, S.at(0.4, 0.62), 40, 30, 0.45); });
  // belly lames, each overlapping the one below, glowing seams between them
  for (let i = 0; i < 3; i++) { const v = 0.58 + i * 0.08; platePart([S.at(-0.7 + i * 0.02, v), S.at(0.76 - i * 0.04, v - 0.01), S.at(0.74 - i * 0.04, v + 0.085), S.at(-0.68 + i * 0.02, v + 0.09)], { dark: i % 2 === 1, look: { inkW: 1.6, sharp: true }, rivets: [[S.at(-0.6 + i * 0.02, v + 0.045), S.at(0.6 - i * 0.04, v + 0.035), 5]] }); W.seam(f, [S.at(-0.5, v + 0.09), S.at(0.0, v + 0.095), S.at(0.5, v + 0.085)], 1.4, { glowOp: 0.3 }); }
  // the chest window: a grille over the copper coil
  const win = [[540, 432], [604, 440], [598, 522], [540, 524]];
  f.part(win.map(q => [q[0], q[1], 1]), { fill: '#120c08', shade: 0.2, inkW: 2, cast: false, hatch: false });
  W.clipDraw(f, win, () => {
    W.glow(f, [572, 478], 50, 50, P.arcG, 0.3);
    f.part(limb([572, 424], [572, 530], 20, 20, { steps: 4 }), W.IR(f, { inkW: 1.2, cast: false })); // the coil's iron core
    for (let i = 0; i < 10; i++) { const y = 436 + i * 9; f.part(limb([536, y], [608, y + 3], 10, 10, { steps: 4, capK: 0.6 }), W.CU(f, { inkW: 1, inkHeavy: 1.4, cast: false })); }
    W.bolt(f, [548, 440], [556, 516], { w: 1.4, forks: 2, jit: 0.5, bloomOp: 0.25 });
    W.bolt(f, [594, 446], [588, 512], { w: 1.2, forks: 1, jit: 0.5, bloom: false });
  });
  for (let i = 1; i < 4; i++) { const t = i / 4; f.part(limb(lerp(win[0], win[1], t), lerp(win[3], win[2], t), 8, 8, { steps: 4, capK: 0.2 }), BRZ({ inkW: 1.2, cast: false })); }
  f.part([win[0], win[1], win[2], win[3], win[0], add(win[0], [-10, -8]), add(win[3], [-10, 8]), add(win[2], [10, 8]), add(win[1], [10, -8]), add(win[0], [-10, -8])].map(q => [q[0], q[1], 1]), BRZ({ inkW: 1.4, cast: false, fill: P.bronzeL }));
  W.rivetRow(f, add(win[0], [-4, -6]), add(win[1], [4, -6]), 5, 3, P.bronzeP);
  // guild stamp and chalked tally on the flank
  const gp = S.at(-0.45, 0.62);
  f.part([add(gp, [-22, -14]), add(gp, [22, -16]), add(gp, [24, 14]), add(gp, [-20, 16])], BRZ({ fill: P.bronzeL, inkW: 1.2, sharp: true, cast: false }));
  f.stroke([add(gp, [-10, 6]), add(gp, [6, -8])], 3, INK); f.stroke([add(gp, [0, -12]), add(gp, [10, -2])], 4, INK);
  for (let i = 0; i < 5; i++) f.line([add(gp, [-30 + i * 7, 26]), add(gp, [-33 + i * 7, 46])], 2, P.bone, { op: 0.75, straight: true });
  f.line([add(gp, [-36, 44]), add(gp, [2, 28])], 2, P.bone, { op: 0.75, straight: true });
  // a steam vent on the shoulder plate, smoking. Consistency pass 2026-11-25: the old wisp's thin zigzag curl read as an
  // arc; now soft billows that widen as they rise, with one smooth curl line
  { const v0 = S.at(-0.4, -0.02);
    for (let i = 0; i < 7; i++) { const t = i / 6, c = add(v0, [-46 * t + Math.sin(t * 3.4) * 10, -14 - 130 * t]), r = 9 + 24 * t;
      f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.78).toFixed(1)}" fill="${P.smoke}" opacity="${(0.5 - 0.05 * i).toFixed(2)}" filter="url(#smk${seed})"/>`);
      if (i > 0 && i < 6) f.raw(`<ellipse cx="${(c[0] - r * 0.25).toFixed(1)}" cy="${(c[1] - r * 0.2).toFixed(1)}" rx="${(r * 0.55).toFixed(1)}" ry="${(r * 0.4).toFixed(1)}" fill="${P.ochL}" opacity="${(0.22 - 0.03 * i).toFixed(2)}" filter="url(#smk${seed})"/>`); } }

  // ---- head: a small bronze dome sunk between the shoulders; brow visor, a pierced sensing grille, grille mouth
  f.bone('head');
  const hF = frame(HC, hA, 1);
  const dome = hF([[-80, 44], [-86, -6], [-70, -54], [-26, -82], [26, -80], [62, -56], [76, -30], [90, 0], [92, 40], [70, 64], [-54, 66]]);
  const dmd = f.part(dome, BRZ({ shade: 0.48 })); W.bevel(f, dmd, E.bbox(dome), 6);
  W.clipDraw(f, dome, () => {
    W.scorch(f, hF([[-40, -40]])[0], 40, 30, 0.5);
    W.lichtenberg(f, hF([[-64, -16]])[0], hA - 0.6, 64, 2.2, { metal: true, depth: 2 });
    f.line(hF([[-56, -62], [-10, -78], [30, -72]]), 2, P.bronzeP, { op: 0.55 });
    for (let i = 0; i < 4; i++) f.line(hF([[-70 + i * 10, -40 + i * 26], [-30 + i * 6, -60 + i * 30]]), 1, INK, { op: 0.3 }); // hammer facets
  });
  for (const g of [[[-60, -58], [-48, -10], [-44, 50]], [[-20, -80], [-16, -20], [-14, 56]]]) { f.line(hF(g), 2.6, INK, { op: 0.7 }); f.line(hF(g.map(q => [q[0] + 4, q[1]])), 1.4, P.bronzeP, { op: 0.5 }); W.rivetRow(f, hF([[g[0][0] + 6, g[0][1] + 8]])[0], hF([[g[2][0] + 6, g[2][1] - 6]])[0], 4, 2.6, P.bronzeL); } // gore seams of the riveted dome
  platePart(hF([[-88, 40], [94, 36], [96, 62], [-84, 70]]), { dark: true, bev: 3, rivets: [[hF([[-74, 54]])[0], hF([[-6, 52]])[0], 4]] }); // the brim flange
  f.line(hF([[-78, 4], [-40, -4], [0, -10]]), 2, INK, { op: 0.7 });
  W.rivetRow(f, hF([[-74, 2]])[0], hF([[-6, -8]])[0], 4, 3, P.bronzeL, { fused: 0.25 });
  // the face plate: a flat, sloping plate riveted over the front of the dome
  const fp = hF([[6, -46], [62, -50], [86, -24], [94, 30], [74, 58], [14, 58], [4, 10]]).map(q => [q[0], q[1], 1]);
  f.part(fp, BRD({ k: 0.6, inkW: 2 }));
  W.clipDraw(f, fp, () => { W.scorch(f, hF([[60, 20]])[0], 30, 30, 0.45); f.flat(hF([[6, -46], [62, -50], [86, -24], [84, -14], [6, -24]]), '#000', { op: 0.35 }); });
  for (const q of hF([[14, -38], [56, -42], [82, -18], [86, 40], [20, 50]])) f.rivet(q, 2.8, P.bronzeL);
  f.part(hF([[2, -52], [66, -56], [92, -30], [88, -22], [60, -40], [4, -38]]).map(q => [q[0], q[1], 1]), BRZ({ inkW: 1.6, fill: P.bronzeL })); // brow ridge
  f.flat(hF([[8, -36], [88, -26], [88, -8], [10, -12]]), '#0a0706', { op: 0.55 }); // the brow's shadow over the eye line
  // the sensing grille (eye audit 2026-11-23: no lens eyes outside the void worlds): a pierced brass plate let into the
  // face across the eye line, a row of small vent holes drilled through it (two staggered ranks, eleven holes, so it
  // reads as a vent and never as a pair of eyes), the furnace's dim heat behind the holes; a riveted rim, a soot streak.
  const sg = hF([[10, -32], [86, -24], [88, -6], [12, -12]]).map(q => [q[0], q[1], 1]);
  f.part(sg, BRZ({ fill: mix(P.bronze, P.bronzeD, 0.35), inkW: 1.6, cast: false, k: 0.5 }));
  f.line(hF([[12, -30], [86, -22]]), 1.4, P.bronzeP, { op: 0.6 }); // the lit upper lip of the recess
  for (let r = 0; r < 2; r++) for (let k = 0; k < (r ? 5 : 6); k++) {
    const x = 18 + k * 12 + r * 6 - (x0 => x0 > 60 ? (x0 - 60) * 0.25 : 0)(18 + k * 12), y = -24 + r * 8 + (18 + k * 12) * 0.08; // the far holes crowd a little with the turn of the plate
    const c = hF([[x, y]])[0];
    f.flat(ell(c, 2.2, 2, hA, 8), '#0a0706');
    f.flat(ell(add(c, [0.4, 0.6]), 1, 0.9, hA, 6), P.ember, { op: 0.45 });
    f.line(ell(c, 2.6, 2.4, hA, 8).slice(5, 8), 0.8, P.bronzeP, { op: 0.55 });
  }
  for (const q of hF([[14, -22], [84, -14]])) f.rivet(q, 2.2, P.bronzeL);
  W.soot(f, hF([[66, -10]])[0], 14, 4, 0.35, hA);
  // grille mouth: a recessed plate across the jaw, three slots, the furnace glowing behind it
  const gm = hF([[30, 22], [86, 18], [88, 44], [34, 50]]).map(q => [q[0], q[1], 1]);
  f.part(gm, BRD({ inkW: 1.6, cast: false }));
  W.glow(f, hF([[60, 34]])[0], 22, 10, P.lamp, 0.35);
  for (let i = 0; i < 3; i++) { const y0 = 26 + i * 7; f.flat(hF([[36, y0], [84, y0 - 3], [84, y0 + 2.6], [36, y0 + 5]]), '#0a0706'); f.flat(hF([[44, y0 + 2], [76, y0], [76, y0 + 2], [44, y0 + 4]]), P.ember, { op: 0.7 }); }
  f.rivet(hF([[34, 36]])[0], 2.4, P.bronzeL); f.rivet(hF([[84, 32]])[0], 2.4, P.bronzeL);
  // neck collar: iron ring and cables sunk into the shoulders
  f.bone('torso');
  f.part([S.at(-0.3, -0.08), S.at(0.62, -0.1), S.at(0.66, 0.06), S.at(-0.36, 0.08)], W.IR(f, { inkW: 1.6 }));
  W.rivetRow(f, S.at(-0.24, -0.02), S.at(0.58, -0.04), 6, 3, P.ironL);

  // ---- near leg
  leg(HN, KN, AN, '_n', false);

  // ---- near arm: driven out in the punch, plates over an iron frame, the piston rod run out, a geared elbow
  f.bone('upperarm_n');
  f.part(K.chain([SN, EN], [54, 46]), W.IR(f, { inkW: 1.6 }));
  const dU = E.norm(sub(EN, SN)), nU = [-dU[1], dU[0]];
  W.cylinder(f, lerp(SN, EN, 0.12), lerp(SN, EN, 0.86), 92, 80, BRZ(), { flanges: [[0.96, 88]] });
  W.clipDraw(f, limb(lerp(SN, EN, 0.12), lerp(SN, EN, 0.86), 92, 80), () => W.scorch(f, lerp(SN, EN, 0.5), 30, 30, 0.5));
  f.bone('forearm_n');
  f.part(K.chain([EN, WN], [46, 40]), W.IR(f, { inkW: 1.6 }));
  const dF = E.norm(sub(WN, EN)), nF = [-dF[1], dF[0]];
  W.cylinder(f, lerp(EN, WN, 0.14), lerp(EN, WN, 0.88), 80, 70, BRZ(), { flanges: [[0.03, 88], [0.97, 78]] });
  W.clipDraw(f, limb(lerp(EN, WN, 0.14), lerp(EN, WN, 0.88), 80, 70), () => { W.scorch(f, lerp(EN, WN, 0.7), 30, 24, 0.5); W.dent(f, lerp(EN, WN, 0.45), 10); W.lichtenberg(f, lerp(EN, WN, 0.3), 0.2, 70, 2.4, { metal: true, depth: 2 }); });
  f.bone('piston_n'); piston(add(lerp(EN, WN, 0.0), mul(nF, 40)), add(lerp(EN, WN, 0.95), mul(nF, 36)), 22, 0.45);
  f.bone('forearm_n'); W.hinge(f, EN, 30);
  f.bone('torso'); // the shoulder plate belongs to the torso
  for (let i = 2; i >= 0; i--) { const c = add(SN, [-4 - i * 6, 10 + i * 22]); platePart([add(c, [-62 + i * 6, -4]), add(c, [-38, -34 + i * 4]), add(c, [36, -36 + i * 4]), add(c, [60 - i * 8, -2]), add(c, [52 - i * 8, 18]), add(c, [-54 + i * 6, 20])], { dark: i % 2 === 1, scorch: [add(c, [-20, -10]), 30, 14], rivets: [[add(c, [-48, 6]), add(c, [48, 6]), 4]] }); }
  platePart([add(SN, [-74, -6]), add(SN, [-56, -52]), add(SN, [-4, -74]), add(SN, [54, -60]), add(SN, [80, -20]), add(SN, [64, 4]), add(SN, [-60, 6])], { scorch: [add(SN, [-20, -40]), 40, 24], dents: [add(SN, [10, -30]), 24, 3], lich: [add(SN, [-50, -30]), -0.4, 70, 2.2] });
  W.seam(f, [add(SN, [-60, 50]), add(SN, [-10, 58]), add(SN, [50, 46])], 1.8, { glowOp: 0.3 });
  f.bone('hand_n');
  // the piston fist: a knuckle block of bronze, fingers in riveted segments, thumb locked over
  W.gauntlet(f, WN, ang(EN, WN), 54, false, BRZ(), { scale: 1.1 });
  W.scorch(f, add(WN, [40, 0]), 24, 30, 0.45);
  W.sparks(f, add(WN, [70, 0]), 6, 20, { ang: 0, spread: 1.6 });

  // ---- arcs off the coil, through the grille
  f.bone('arcs');
  fxCapture(f, () => W.bolt(f, [604, 470], [660, 500], { w: 1.6, forks: 2, jit: 0.5 })); // FX layer (consistency pass)
  W.sparks(f, [606, 470], 5, 24, { ang: 0.3, spread: 1.6 });
  return f;
}

// ------------------------------------------------------------------ SPARKBLIND SMITH (elite 2.3)
// The guild's master smith, a giant hunched over the work. Sparks burned his eyes out at the anvil; he wears a riveted,
// welded iron visor with one narrow slit that glows with the forge light caught inside it, and under its lower edge
// his cheeks are spark-pitted and scarred where the burns ran down. He works by feel and sound: the visor is bowed to
// the hot bar held out in the tongs. The far arm, gloved to the elbow in a forge-glove, holds the tongs out; the near arm hangs with
// a sledge carried low by the end of its haft, the head behind the near leg. A scorched leather bib apron over a bare,
// burn-scarred body; Lichtenberg scars spread across both shoulders. Arms like pillars, a heavy belly, knees bent.
// (Lore change 2026-11-23: was the Cyclops Smith; the single eye went, as eye motifs belong to the void worlds only.)
// Rig: standard humanoid + hammer (hand_n) + tongs (hand_f) + bar (tongs) + apron (torso).
// Motion: idle turns the hot bar in the tongs (bar and hand_f); attack a branding hammer blow (near arm swings the
// sledge up and over: big rotation of upperarm_n with the hammer following).
// an iron weld bead: tempered straw-to-umber either side, a lumpy run of re-set iron with lit tops, ripple lines
function ironWeld(f, pts, w) {
  const C = W.spline(pts, w * 0.9);
  W.heatTint(f, C, w * 1.2);
  f.stroke(C, w * 2.6, P.sootD, { op: 0.4 });
  for (let i = 0; i < C.length; i++) { const r = w * W.R(f, 0.6, 0.9); f.part(ell(add(C[i], [W.R(f, -1, 1) * w * 0.15, W.R(f, -1, 1) * w * 0.15]), r * 1.1, r, f.r() * 3, 8), { fill: '#4e4842', shadow: P.ironD, light: '#8a847a', shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, gritOp: 0.2 }); }
  f.line(C.filter((_, i) => i % 2 === 0).map(q => add(q, [1, -1])), Math.max(0.8, w * 0.22), '#a8a094', { op: 0.6 });
}
function sparkblindSmith() {
  const seed = 501, CW = 1100, CH = 1400, f = new Fig(W.base(seed, CH, { grimeY: 1060 }));
  W.textures(f);
  const gy = f.o.groundY;
  const skin = '#8c6a50', skinS = '#2e1c16', skinL = '#b48e70';
  const SKs = (o = {}) => W.SK(f, Object.assign({ fill: skin, shadow: mix(skin, skinS, 0.55), texOp: 0.22, maxShade: 46 }, o));
  const grime = (c, rx, ry, op = 0.35) => W.glow(f, c, rx, ry, P.sootD, op, true); // soft soot, never a hard blotch
  const N = [626, 334], C = [470, 410], Pv = [544, 742];
  const S = B.spine(N, C, Pv, 230); // the lower trunk (belt, seat, apron ties); the upper body is drawn from explicit points
  const NB = [672, 452]; // the neck's root, hidden in the mantle of muscle
  const SN = [640, 500], EN = [606, 742], WN = [716, 918];
  const SF = [722, 476], EF = [748, 664], WF = [856, 612];
  const HN = [582, 762], KN = [668, 1040], AN = [690, 1290];
  const HF = [496, 750], KF = [436, 1046], AF = [380, 1292];
  const HC = [752, 400], hA = 0.36, HH = 290;
  const hamHead = [410, 1118], hamA = ang(WN, hamHead);
  const tongA = ang(EF, WF), jaw = add(WF, rot([196, 0], tongA + 0.06));
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: NB, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('hammer', WN, 'hand_n').joint('tongs', WF, 'hand_f').joint('bar', jaw, 'tongs').joint('apron', [740, 560], 'torso');
  // the upper body as one mass: from the base of the skull the trapezius climbs to the hump, rolls over the shoulder
  // blades and drops down the back; in front the chest hangs under the jaw and the gut pushes forward over the belt
  const TOR = [[712, 476], [664, 444], [630, 404], [624, 360], [642, 318], [668, 290], [612, 262], [552, 250], [496, 252], [462, 258], [418, 270], [370, 304], [332, 372], [318, 452], [330, 540], [356, 620], [342, 720], [400, 800], [560, 826], [760, 840], [852, 790], [862, 700], [824, 612], [802, 552], [770, 506]];
  // the mantle: the same top line, the trapezius and the shoulder blade, rolling into the near shoulder cap whose
  // deltoid runs down into the arm as a wedge (drawn over the near arm's top, on the torso)
  const MAN = [[712, 476], [664, 444], [630, 404], [624, 360], [642, 318], [668, 290], [612, 262], [552, 250], [496, 252], [462, 258], [418, 270], [370, 304], [334, 370], [376, 420], [462, 466], [536, 512], [592, 600], [618, 640], [656, 612], [706, 560], [728, 504]];

  f.bone('root');
  f.flat(ell([540, gy + 4], 330, 22, 0, 20), '#000', { op: 0.32 });

  // ---- far arm: gloved to the elbow, holding the tongs out at the work
  W.muscleArm(f, SF, EF, WF, [150, 124, 104], SKs({ fill: mix(skin, skinS, 0.14), shade: 0.42 }), '_f');
  f.bone('upperarm_f');
  W.lichtenberg(f, lp(SF, EF, 0.08), ang(SF, EF) - 0.4, 120, 4.4, { depth: 3 });
  f.bone('forearm_f');
  // the forge-glove: a heavy leather gauntlet to the elbow, riveted studs, scorched, a strap at the cuff
  const glove = [lp(EF, WF, -0.02, 58), lp(EF, WF, 0.5, 50), lp(EF, WF, 1.0, 44), lp(EF, WF, 1.0, -44), lp(EF, WF, 0.5, -52), lp(EF, WF, -0.06, -60)];
  f.part(glove, W.LEA(f, { fill: '#4a3420', k: 0.8 }));
  f.part([lp(EF, WF, -0.1, 66), lp(EF, WF, 0.08, 64), lp(EF, WF, 0.12, -66), lp(EF, WF, -0.12, -68)], W.LEA(f, { fill: '#3a2818', inkW: 1.8 })); // flared cuff
  W.clipDraw(f, glove, () => { W.scorch(f, lp(EF, WF, 0.8, 10), 50, 30, 0.6); for (let i = 0; i < 7; i++) { const q = lp(EF, WF, W.R(f, 0.2, 0.9), W.R(f, -40, 40)), r = W.R(f, 3, 6); f.flat(ell(q, r, r * 0.8, 0, 8), '#140c08', { op: 0.85 }); f.line(ell(q, r + 2, r * 0.8 + 2, 0, 8).slice(4, 8), 1.2, '#a8865a', { op: 0.6 }); } });
  W.rivetRow(f, lp(EF, WF, 0.25, 30), lp(EF, WF, 0.85, 26), 5, 4, P.ironL);
  f.part([lp(EF, WF, 0.3, 54), lp(EF, WF, 0.38, 54), lp(EF, WF, 0.36, -56), lp(EF, WF, 0.28, -56)], W.LEA(f, { fill: '#2a1c12', inkW: 1.3, cast: false }));
  f.part(ell(lp(EF, WF, 0.33, 40), 9, 12, tongA, 8), W.IR(f, { inkW: 1.2, cast: false }));

  // ---- the tongs: two long iron reins out of the fist to a pivot, curved jaws closed on a white-hot bar
  f.bone('tongs');
  const tF = frame(WF, tongA + 0.06, 1);
  for (const sgn of [-1, 1]) f.part(tF([[-60, sgn * 6 - 2], [140, sgn * 7], [148, sgn * 3], [-60, sgn * 2 - 2]].map(q => [q[0], q[1], 1])), W.IR(f, { inkW: 1.6 }));
  f.part(tF([[-72, -10], [-56, -10], [-56, 10], [-72, 10]].map(q => [q[0], q[1], 1])), W.IR(f, { inkW: 1.2, cast: false })); // ring on the reins
  f.part(ell(tF([[148, 0]])[0], 13, 13, 0, 12), W.IR(f, { fill: P.ironL, inkW: 1.4 }));
  f.rivet(tF([[148, 0]])[0], 5, '#9a948a');
  for (const sgn of [-1, 1]) f.part(tF([[148, sgn * 4], [176, sgn * 20], [200, sgn * 16], [206, sgn * 4], [196, sgn * 2], [178, sgn * 10]]), W.IR(f, { inkW: 1.6, fill: mix(P.iron, P.ember, 0.25) }));
  W.lichtenberg(f, tF([[60, 0]])[0], tongA, 50, 1.6, { metal: true, depth: 1 });
  f.bone('bar');
  const bF = frame(jaw, tongA + 1.3, 1);
  f.raw(`<rect x="${(jaw[0] - 70).toFixed(1)}" y="${(jaw[1] - 70).toFixed(1)}" width="140" height="140" fill="${P.lamp}" opacity="0.4" filter="url(#glowL${seed})"/>`);
  const bar = bF([[-70, -11], [64, -12], [72, 0], [64, 12], [-70, 11]]);
  f.part(bar, { fill: P.lamp, shadow: P.ember, light: P.core, shade: 0.35, inkW: 1.6, cast: false, hatch: false, gritOp: 0.15 });
  f.flat(bF([[-50, -4], [56, -5], [60, 0], [56, 4], [-50, 4]]), P.hot);
  f.flat(bF([[-20, -2], [40, -2], [40, 2], [-20, 2]]), P.core);
  f.flat(bF([[-70, -11], [-46, -11], [-46, 11], [-70, 11]]), P.ember, { op: 0.8 }); // the end cooling darker
  W.sparks(f, bF([[60, 0]])[0], 7, 34, { ang: -1.2, spread: 2.2 });
  W.ash(f, bF([[0, -12]])[0], 6, 40, 80, 1.2);

  // ---- far leg: leather breeches into heavy iron-toed boots
  const leg = (Hp, Kn, A, sfx, col) => {
    const cu = lerp(Kn, A, 0.5);
    W.bootRig(f, Kn, A, 118, '#2a1e14', sfx, { tex: 'mottle' + seed, shaft: 1.1, strap: true });
    f.bone('foot' + sfx);
    f.part([[A[0] + 70, gy - 58], [A[0] + 150, gy - 40], [A[0] + 156, gy - 12], [A[0] + 70, gy - 14]].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 1.4 })); // iron toecap
    W.rivetRow(f, [A[0] + 80, gy - 46], [A[0] + 140, gy - 34], 3, 3.4, P.ironL);
    W.splats(f, [A[0] + 40, gy - 30], 90, 20, 9, '#15110e');
    W.legTube(f, Hp, Kn, cu, [196, 132, 138], W.LEA(f, { fill: col, shade: 0.42 }), sfx, { A, bp: [[0, 0.55, 0.12, 0.22], [1, 0.45, 0.2, 0.22]], bq: [[0, 0.3, 0.16, 0.22], [1, 0.08, 0.1, 0.12]] });
    f.bone('thigh' + sfx);
    f.stroke([lp(Hp, Kn, 0.7, 50), lp(Hp, Kn, 0.86, 10), lp(Hp, Kn, 0.94, -40)], 3.4, INK, { op: 0.6 });
    f.stroke([lp(Hp, Kn, 0.3, -60), lp(Hp, Kn, 0.45, -20), lp(Hp, Kn, 0.5, 30)], 3, INK, { op: 0.5 });
    W.soot(f, lp(Hp, Kn, 0.6), 40, 60, 0.4);
    f.bone('shin' + sfx);
    f.stroke([lp(Kn, cu, 0.4, -60), lp(Kn, cu, 0.75, 0), lp(Kn, cu, 0.85, 56)], 3.4, INK, { op: 0.7 });
    f.part([lp(Kn, cu, -0.2, -50), lp(Kn, cu, -0.18, 48), lp(Kn, cu, 0.3, 50), lp(Kn, cu, 0.34, -46)], W.LEA(f, { fill: mix(col, '#6a5030', 0.4), inkW: 1.3, cast: false })); // knee patch
    f.stitches([lp(Kn, cu, -0.2, -50), lp(Kn, cu, -0.18, 48), lp(Kn, cu, 0.3, 50), lp(Kn, cu, 0.34, -46), lp(Kn, cu, -0.2, -50)], '#a08a6a', 1);
  };
  leg(HF, KF, AF, '_f', '#3a2a1c');

  // ---- torso: one mass. Soot lies in soft gradients (heaviest down the back and in the creases), old burns are
  // glossy keloid patches with puckered edges, the Lichtenberg fern is fresh.
  f.bone('torso');
  f.part(TOR, SKs({ shade: 0.42 }));
  W.clipDraw(f, TOR, () => {
    grime([380, 560], 70, 200, 0.5); grime([560, 790], 140, 50, 0.35); grime([780, 700], 60, 80, 0.3);
    for (let i = 0; i < 8; i++) { const q = [360 + i * 34, 470 + (i % 3) * 30]; f.stroke([q, add(q, [W.R(f, -4, 4), 70 + (i % 4) * 30]), add(q, [W.R(f, -6, 6), 120 + (i % 4) * 40])], 7, P.sootD, { op: 0.18 }); } // sweat runs
    f.stroke([[352, 470], [346, 580], [362, 690]], 9, skinS, { op: 0.35 }); // spine furrow down the lower back
    f.stroke([[420, 520], [446, 620], [420, 720]], 5, skinS, { op: 0.4 }); // the lat's edge
    f.stroke([[700, 600], [770, 640], [820, 620]], 6, skinS, { op: 0.5 }); // under the chest
    f.stroke([[560, 790], [700, 800], [830, 770]], 5, skinS, { op: 0.5 }); // belly fold over the belt
    for (let i = 0; i < 30; i++) { const q = W.scatter(f, [770, 580], 50, 50); f.line([q, add(q, [3, 8])], 1.3, '#2a201a', { op: 0.5 }); } // chest hair
    for (let i = 0; i < 26; i++) { const q = W.scatter(f, [790, 600], 46, 60), r = W.R(f, 1.6, 3.4); f.flat(ell(q, r, r * 0.85, 0, 7), '#2a1610', { op: 0.75 }); f.line(ell(q, r + 1.2, r + 1.2, 0, 8).slice(1, 4), 1, skinL, { op: 0.55 }); } // old spark pits
    for (const [c, rx, ry, a] of [[[420, 640], 34, 22, 0.5], [[500, 730], 24, 14, 0.2]]) {
      const e = W.lumpy(f, ell(c, rx, ry, a, 14), 4);
      f.flat(e, mix(skinL, '#c09080', 0.3), { op: 0.55 }); f.line(e.concat([e[0]]), 1.6, skinS, { op: 0.55 });
      f.line(ell(c, rx * 0.5, ry * 0.5, a, 10).slice(5, 9), 1.8, '#f0e0d0', { op: 0.5 });
    }
    W.slag(f, [470, 600], 50, 50, 7, 3, 6, { hot: 0.2 });
  });

  // ---- belt and breeches seat; tools hanging: punches, a chisel, a rasp
  f.bone('pelvis');
  f.part([S.at(-0.66, 0.92), S.at(0.7, 0.9), add(S.at(0.76, 1.06), [10, 40]), add(S.at(0.0, 1.1), [0, 60]), add(S.at(-0.66, 1.06), [-10, 44])], W.LEA(f, { fill: '#3a2a1c', shade: 0.42 }));
  f.part([S.at(-0.7, 0.88), S.at(0.74, 0.86), S.at(0.76, 0.96), S.at(-0.72, 0.98)], W.LEA(f, { fill: '#2a1c12', sharp: true }));
  f.part([S.at(-0.2, 0.86), S.at(-0.02, 0.86), S.at(-0.02, 0.98), S.at(-0.2, 0.98)], W.IR(f, { inkW: 1.4, sharp: true }));
  f.part([S.at(-0.16, 0.89), S.at(-0.06, 0.89), S.at(-0.06, 0.95), S.at(-0.16, 0.95)], { fill: '#0e0a08', inkW: 0, cast: false });
  for (const [u, l, w] of [[-0.48, 120, 12], [-0.4, 96, 10], [-0.56, 140, 14]]) { const a0 = S.at(u, 0.96); f.part([add(a0, [-w / 2, 0]), add(a0, [w / 2, 0]), add(a0, [w * 0.3, l]), add(a0, [0, l + 10]), add(a0, [-w * 0.3, l])].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 1.3, cast: false })); f.line([add(a0, [-w * 0.3, 8]), add(a0, [-w * 0.2, l - 10])], 1.2, P.ironL, { op: 0.6 }); }
  W.rope(f, [S.at(-0.6, 0.97), S.at(-0.62, 1.04), S.at(-0.4, 1.04)], 3, { col: '#6e5e44' });

  // ---- near leg
  leg(HN, KN, AN, '_n', '#4a3624');

  // ---- apron: heavy leather bib hung from the neck over the chest and gut to above the knees, a pocket of files
  f.bone('apron');
  const apron = [[700, 528, 1], [800, 552, 1], [818, 620], [852, 730], [858, 846], [826, 922], [800, 956, 1], [740, 940], [680, 966, 1], [620, 944], [604, 860], [620, 720], [650, 610]];
  f.part(apron, W.LEA(f, { fill: '#5a3e26', shade: 0.45 }));
  W.clipDraw(f, apron, () => {
    W.scorch(f, [760, 900], 90, 60, 0.55); W.scorch(f, [760, 600], 60, 50, 0.4); W.scorch(f, [840, 780], 40, 70, 0.45);
    for (let i = 0; i < 16; i++) { const q = W.scatter(f, [740, 760], 110, 180), r = W.R(f, 3, 8); f.flat(ell(q, r, r * 0.8, 0, 8), '#140c08', { op: 0.85 }); f.line(ell(q, r + 2, r * 0.8 + 2, 0, 8).slice(4, 8), 1.2, '#a8865a', { op: 0.6 }); }
    f.stroke([[700, 640], [716, 800], [712, 940]], 3, INK, { op: 0.5 }); f.stroke([[790, 660], [810, 820], [796, 940]], 2.6, INK, { op: 0.45 });
    f.line([[620, 950], [830, 920]], 5, '#2a1c12', { op: 0.6 });
    W.lichtenberg(f, [740, 620], 1.2, 80, 2.6, { col: '#1a100a', depth: 2, op: 0.7 });
  });
  f.stitches([[704, 536], [800, 568]], '#a08a6a', 1);
  const pk = [[704, 700], [832, 690], [848, 792], [716, 800]];
  f.part(pk, W.LEA(f, { fill: '#4a321e', inkW: 1.6, cast: false }));
  f.stitches([pk[0], pk[1], pk[2], pk[3], pk[0]], '#a08a6a', 1);
  for (const [dx, l, c] of [[14, 70, P.iron], [34, 54, P.iron], [56, 40, P.bone]]) f.part([add(pk[0], [dx, -l]), add(pk[0], [dx + 10, -l]), add(pk[0], [dx + 12, 4]), add(pk[0], [dx, 4])].map(q => [q[0], q[1], 1]), c === P.bone ? { fill: P.bone, shade: 0.3, inkW: 1.1, cast: false } : W.IR(f, { inkW: 1.1, cast: false }));
  // neck strap up behind the jaw, with a nail driven through it as a pin
  f.part([[700, 528], [726, 534], [700, 446], [676, 446]], W.LEA(f, { fill: '#3e2a18', inkW: 1.3, cast: false }));
  f.line([[700, 500], [722, 508]], 3, P.ironL);

  // ---- the sledge: a long ash haft held at its end, the head hanging behind the near leg
  f.bone('hammer');
  const hb = add(WN, rot([-40, 0], hamA));
  f.part(limb(hb, hamHead, 30, 27, { steps: 8 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(hb, hamHead, 0.05, -7), lp(hb, hamHead, 0.85, -7)], 1.4, P.woodL, { op: 0.5, straight: true });
  for (const t of [0.4, 0.44, 0.48]) f.line([lp(hb, hamHead, t, -16), lp(hb, hamHead, t + 0.01, 16)], 3, P.leathD, { straight: true }); // a wrap where the hands slide
  const HD = frame(hamHead, hamA, 1);
  f.part(HD([[-30, -86], [26, -84], [36, -70], [36, 70], [26, 86], [-30, 84], [-38, 70], [-38, -70]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#2c2a28', inkW: 2.2 }));
  f.part(HD([[-34, -98], [30, -98], [30, -84], [-34, -84]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#4a4644', inkW: 1.6, cast: false })); // mushroomed face
  f.part(HD([[-34, 84], [30, 84], [30, 98], [-34, 98]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#4a4644', inkW: 1.6, cast: false }));
  f.flat(HD([[-28, -94], [24, -94], [20, -88], [-24, -88]]), '#c8c0b0', { op: 0.5 });
  W.lichtenberg(f, HD([[0, -30]])[0], hamA + 1.6, 60, 2.4, { metal: true, depth: 2 });
  f.part(HD([[30, -16], [52, -16], [52, 16], [30, 16]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#26221e', inkW: 1.4, cast: false })); // wedge
  // the branding mark cast into the face of the hammer, still hot
  const bm = HD([[0, -91]])[0]; W.glow(f, bm, 24, 10, P.lamp, 0.5);
  f.line(HD([[-16, -91], [14, -91]]), 3, P.lamp);

  // ---- near arm: hanging forward of the body, pillar-thick, a smith's forearm swelling under the elbow, veined,
  // a thick wrist, a big knuckled fist carrying the sledge low
  W.muscleArm(f, SN, EN, WN, [176, 132, 122], SKs({ shade: 0.4, fill: mix(skin, skinS, 0.06) }), '_n', { muscle: false, bp: [[0, 0.5, 0.1, 0.2], [1, 0.26, 0.34, 0.2]], bq: [[0, 0.55, 0.14, 0.2], [1, 0.3, 0.26, 0.22], [1, 0.95, 0.06, 0.08]] });
  f.bone('upperarm_n');
  W.clipDraw(f, K.chain([SN, EN], [190, 150]), () => {
    f.flat([lp(SN, EN, 0.0, -90), lp(SN, EN, 1.0, -76), lp(SN, EN, 1.0, -30), lp(SN, EN, 0.3, -40)], skinS, { op: 0.3 }); // the back of the arm turns away from the light
    f.stroke([lp(SN, EN, 0.45, -10), lp(SN, EN, 0.7, -20), lp(SN, EN, 0.96, -14)], 5, skinS, { op: 0.55 }); // biceps / triceps split
    f.line([lp(SN, EN, 0.5, 40), lp(SN, EN, 0.82, 52)], 3, skinL, { op: 0.45 }); // the biceps' lit edge
    grime(lp(SN, EN, 0.7, -30), 40, 50, 0.35);
    for (let i = 0; i < 14; i++) { const q = lp(SN, EN, W.R(f, 0.3, 0.9), W.R(f, -50, 50)); f.line([q, add(q, [2, 7])], 1.3, '#2a201a', { op: 0.5 }); }
    const sc = W.lumpy(f, ell(lp(SN, EN, 0.7, -30), 20, 34, ang(SN, EN), 14), 3); f.flat(sc, mix(skinL, '#c09080', 0.3), { op: 0.5 }); f.line(sc.concat([sc[0]]), 1.4, skinS, { op: 0.55 });
  });
  f.flat(ell(lp(SN, EN, 1.0, -46), 24, 18, ang(SN, EN), 10), skinS, { op: 0.3 }); f.line(ell(lp(SN, EN, 1.0, -46), 24, 18, ang(SN, EN), 10).slice(2, 7), 2.2, skinL, { op: 0.45 }); // the elbow's point
  f.bone('forearm_n');
  W.clipDraw(f, K.chain([EN, WN], [190, 130]), () => {
    f.stroke([lp(EN, WN, 0.04, 50), lp(EN, WN, 0.3, 72), lp(EN, WN, 0.62, 48)], 6, skinS, { op: 0.45 }); f.line([lp(EN, WN, 0.08, 40), lp(EN, WN, 0.36, 58)], 3, skinL, { op: 0.5 }); // brachioradialis
    f.stroke([lp(EN, WN, 0.12, -40), lp(EN, WN, 0.4, -56), lp(EN, WN, 0.7, -44)], 5, skinS, { op: 0.35 }); // flexors
    // veins standing out along the forearm: a dark channel with a lit ridge beside it
    for (const v of [[[0.18, 10], [0.36, 22], [0.5, 8], [0.72, 18], [0.9, 10]], [[0.3, -20], [0.46, -8], [0.62, -26], [0.82, -14]], [[0.5, 8], [0.6, 30], [0.74, 40]]]) { const pts = v.map(([t, o]) => lp(EN, WN, t, o)); f.line(pts, 4.4, skinS, { op: 0.45 }); f.line(pts.map(q => add(q, [2, -2])), 1.8, skinL, { op: 0.6 }); }
    grime(lp(EN, WN, 0.75, 0), 50, 50, 0.3);
    for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.82 + i * 0.03, -36), lp(EN, WN, 0.86 + i * 0.03, -10)], 1.6, INK, { op: 0.45 }); // tendons at the wrist
  });
  W.slag(f, lp(EN, WN, 0.45, -20), 26, 30, 5, 3, 5);
  for (let i = 0; i < 30; i++) { const q = lp(EN, WN, W.R(f, 0.12, 0.78), W.R(f, -50, 56)), r = W.R(f, 1.8, 3.8); f.flat(ell(q, r, r * 0.85, 0, 7), '#2a1610', { op: 0.75 }); f.line(ell(q, r + 1.2, r + 1.2, 0, 8).slice(1, 4), 1, skinL, { op: 0.55 }); } // old spark pits peppering the forearm
  // a leather wrist strap, riveted
  f.part([lp(EN, WN, 0.8, -66), lp(EN, WN, 0.8, 66), lp(EN, WN, 0.93, 62), lp(EN, WN, 0.93, -62)], W.LEA(f, { fill: '#2a1c12', inkW: 1.6, cast: false }));
  f.rivet(lp(EN, WN, 0.865, 24), 5, P.ironL); f.rivet(lp(EN, WN, 0.865, -24), 5, P.ironL);
  // ---- the mantle: trapezius and shoulder blade rolling into the near shoulder cap (torso: it does not lift with the
  // arm). Its top line is the body's own outline, so skull, hump and back read as one curve with muscle breaks.
  f.bone('torso');
  f.part(MAN, SKs({ shade: 0.4, maxShade: 14, k: 1, inkW: 0, cast: false }));
  W.clipDraw(f, MAN, () => {
    grime([380, 360], 50, 120, 0.5); grime([600, 560], 60, 60, 0.3);
    f.stroke([[596, 600], [618, 640], [650, 612]], 5, skinS, { op: 0.4 }); // where the deltoid's wedge sinks into the arm
    f.stroke([[676, 430], [640, 470], [628, 540], [640, 610]], 7, skinS, { op: 0.5 }); f.line([[684, 438], [652, 476], [642, 540]], 2.4, skinL, { op: 0.5 }); // the deltoid's front edge
    f.stroke([[650, 392], [600, 410], [548, 452], [536, 512]], 7, skinS, { op: 0.45 }); f.line([[644, 384], [594, 400], [542, 444]], 2.4, skinL, { op: 0.5 }); // the trapezius' lower edge over the shoulder cap
    f.stroke([[470, 290], [430, 360], [440, 430], [480, 470]], 8, skinS, { op: 0.45 }); f.line([[480, 288], [442, 358], [452, 424]], 2.6, skinL, { op: 0.5 }); // the shoulder blade under the skin
    f.stroke([[466, 262], [446, 276], [426, 274]], 6, skinS, { op: 0.4 }); // the break between trapezius and shoulder blade
    for (let i = 0; i < 4; i++) f.part(ell([384 - i * 11, 312 + i * 34], 9, 7, 0.9, 8), SKs({ fill: mix(skin, '#fff', 0.08), inkW: 1, cast: false, shade: 0.4, maxShade: 6 }));
    W.lichtenberg(f, [560, 300], 2.4, 240, 6.4, { depth: 3 }); // the burn spreading over both shoulders
    W.lichtenberg(f, [610, 420], 1.3, 170, 5, { depth: 3 });
    const e = W.lumpy(f, ell([500, 380], 30, 20, 0.3, 14), 4); f.flat(e, mix(skinL, '#c09080', 0.3), { op: 0.55 }); f.line(e.concat([e[0]]), 1.6, skinS, { op: 0.55 }); f.line(ell([500, 380], 15, 10, 0.3, 10).slice(5, 9), 1.8, '#f0e0d0', { op: 0.5 });
    W.slag(f, [460, 300], 40, 30, 6, 3, 5, { hot: 0.25 });
    for (let i = 0; i < 16; i++) { const q = W.scatter(f, [600, 480], 50, 50); f.line([q, add(q, [2, 7])], 1.3, '#2a201a', { op: 0.45 }); }
  });
  f.line(MAN.slice(5, 14), 3.4, INK); f.line(MAN.slice(18, 21).concat([MAN[0]]), 2.4, INK, { op: 0.8 }); // the body's outline over the mantle
  W.ash(f, [480, 230], 12, 120, 200, 1.6);
  // ---- head: slung low in front of the hump, bowed over the work. A heavy ridged skull sloping back from a jutting
  // brow, one big deep-set eye under it, a nose broken flat and knocked aside, a lantern jaw with jowls, a cauliflower
  // ear, a burned and scarred scalp with singed tufts.
  f.bone('head');
  const neckTop = add(HC, rot([-0.12 * HH, 0.4 * HH], hA));
  f.part(limb(NB, neckTop, 190, 170, { steps: 6 }), SKs({ shade: 0.3, maxShade: 16, cast: false })); // the bull neck, mostly under the jaw
  f.line([lp(NB, neckTop, 0.2, -60), lp(NB, neckTop, 0.85, -50)], 2.4, skinS, { op: 0.5 }); // sternomastoid
  const hF = frame(HC, hA, HH);
  const skull = [[-0.46, 0.04], [-0.46, -0.14, 1], [-0.38, -0.28], [-0.22, -0.37], [-0.04, -0.42], [0.08, -0.45, 1], [0.2, -0.41], [0.32, -0.33], [0.42, -0.24], [0.5, -0.17], [0.5, -0.08], [0.44, -0.04], [0.46, 0.06], [0.5, 0.16], [0.48, 0.24], [0.5, 0.3], [0.55, 0.38], [0.56, 0.47], [0.51, 0.58], [0.32, 0.65], [0.06, 0.65], [-0.16, 0.57], [-0.3, 0.43], [-0.42, 0.25]];
  f.part(hF(skull), SKs({ shade: 0.4, maxShade: 30 }));
  W.clipDraw(f, hF(skull), () => {
    grime(hF([[-0.34, 0.1]])[0], 60, 90, 0.4); grime(hF([[0.36, 0.52]])[0], 60, 30, 0.35);
    f.flat(hF([[0.06, 0.1], [0.3, 0.2], [0.36, 0.52], [0.06, 0.62], [-0.18, 0.46], [-0.12, 0.2]]), skinS, { op: 0.26 }); // the side of the jaw under the cheekbone
    f.stroke(hF([[0.02, 0.06], [0.22, 0.11], [0.38, 0.13]]), 6, skinL, { op: 0.4 }); // cheekbone ridge
    f.stroke(hF([[-0.06, 0.24], [0.0, 0.42], [0.12, 0.56]]), 7, skinS, { op: 0.35 }); // masseter
    f.flat(hF([[0.2, 0.48], [0.54, 0.46], [0.54, 0.6], [0.24, 0.66]]), skinS, { op: 0.32 }); // under the chin
    f.flat(hF([[0.0, -0.3], [0.2, -0.28], [0.16, -0.16], [-0.02, -0.18]]), skinS, { op: 0.2 }); // temple hollow
    // the ridged crown: a raised keel of bone along the top, lit along its crest, shadowed beside it
    f.stroke(hF([[-0.34, -0.24], [-0.14, -0.35], [0.08, -0.4], [0.28, -0.32]]), 12, skinS, { op: 0.3 });
    f.line(hF([[-0.32, -0.28], [-0.12, -0.38], [0.08, -0.43], [0.26, -0.36]]), 3, skinL, { op: 0.6 });
    for (let i = 0; i < 4; i++) f.line(hF([[0.14, -0.4 + i * 0.045], [0.3, -0.36 + i * 0.045], [0.42, -0.27 + i * 0.04]]), 2, INK, { op: 0.45 }); // forehead furrows
    // burned scalp: a glossy keloid sheet over the back of the crown with a puckered rim; a split stitched shut
    const sc = W.lumpy(f, hF(ell([-0.22, -0.22], 0.2, 0.13, -0.5, 14)), 3);
    f.flat(sc, mix(skinL, '#c09080', 0.35), { op: 0.6 }); f.line(sc.concat([sc[0]]), 1.8, skinS, { op: 0.65 }); f.line(hF([[-0.32, -0.26], [-0.2, -0.32], [-0.1, -0.3]]), 2.4, '#f0e0d0', { op: 0.5 });
    W.lichtenberg(f, hF([[-0.34, 0.3]])[0], hA - 1.6, 100, 3.4, { depth: 2 });
    for (let i = 0; i < 90; i++) { const q = hF([[W.R(f, -0.06, 0.54), W.R(f, 0.32, 0.62)]])[0]; f.flat(ell(q, 1.4, 1.4, 0, 5), '#1e1814', { op: 0.6 }); } // stubble
    for (let i = 0; i < 70; i++) { const u = [W.R(f, 0.0, 0.56), W.R(f, 0.42, 0.66)], q = hF([u])[0], d = rot([4 + f.r() * 4, 0], hA + 1.4 + (f.r() - 0.5) * 0.8); f.line([q, add(q, d)], 1.6, f.r() > 0.7 ? '#5a3a24' : '#1a1410', { op: 0.75 }); if (f.r() > 0.75) f.flat(ell(add(q, d), 1.3, 1.3, 0, 5), '#2a1a10', { op: 0.8 }); } // a beard singed short, the ends curled and balled by the heat
  });
  // the ear: big, thick, cauliflowered, behind the jaw hinge
  f.part(hF([[-0.14, -0.1], [-0.24, -0.16], [-0.32, -0.08], [-0.32, 0.1], [-0.24, 0.2], [-0.14, 0.16], [-0.16, 0.04]]), SKs({ fill: mix(skin, '#9a4c3a', 0.16), shade: 0.45, inkW: 1.8, cast: false }));
  f.line(hF([[-0.2, -0.08], [-0.27, -0.02], [-0.24, 0.1]]), 1.8, skinS, { op: 0.8 }); f.flat(hF(ell([-0.24, 0.03], 0.03, 0.05, 0, 8)), skinS, { op: 0.6 });
  for (const q of hF([[-0.28, -0.1], [-0.3, 0.04]])) f.flat(ell(q, 4, 3, 0, 6), mix(skin, '#9a4c3a', 0.3), { op: 0.7 });
  // the nose: broad, broken at the bridge and knocked aside; the bridge runs up under the visor, the bulb flattened
  f.part(hF([[0.44, -0.06], [0.5, 0.0], [0.48, 0.05], [0.56, 0.12], [0.58, 0.18], [0.54, 0.23], [0.46, 0.24], [0.4, 0.2], [0.42, 0.13], [0.45, 0.05], [0.42, -0.02]]), SKs({ fill: mix(skin, '#a3553f', 0.2), shade: 0.45, inkW: 1.9, cast: false }));
  f.flat(hF(ell([0.5, 0.2], 0.04, 0.02, 0.2, 8)), '#1a100c');
  f.line(hF([[0.4, 0.21], [0.34, 0.3], [0.32, 0.4]]), 2.4, INK, { op: 0.7 }); // nasolabial fold, deep
  f.line(hF([[0.26, 0.32], [0.22, 0.46], [0.28, 0.56]]), 1.8, INK, { op: 0.45 }); // jowl
  // the mouth: a heavy downturned set, lower lip pushed out, one broken tooth, a scar through the lip
  f.flat(hF([[0.36, 0.33], [0.45, 0.32], [0.54, 0.35], [0.54, 0.41], [0.4, 0.41]]), mix(skin, '#6a2a22', 0.4), { op: 0.8 });
  f.stroke(hF([[0.32, 0.36], [0.41, 0.32], [0.5, 0.33], [0.55, 0.35]]), 5, INK);
  f.flat(hF([[0.46, 0.325], [0.49, 0.325], [0.485, 0.35], [0.47, 0.35]]), '#c8b890', { op: 0.9 });
  f.line(hF([[0.46, 0.27], [0.47, 0.35], [0.45, 0.46]]), 4, skinL, { op: 0.5 }); f.line(hF([[0.46, 0.27], [0.47, 0.35], [0.45, 0.46]]), 1.2, skinS, { op: 0.7 });
  // the cheeks under the visor's edge: spark-pitted (small dark pocks, each with a pale rim on its lower lip), and the
  // glossy burn scars that ran down out of the sockets when the sparks took the eyes
  W.clipDraw(f, hF(skull), () => {
    for (let i = 0; i < 46; i++) {
      const u = [W.R(f, 0.0, 0.46), W.R(f, 0.12, 0.34)]; if (u[0] > 0.38 && u[1] < 0.26) continue; // not on the nose
      const q = hF([u])[0], r = W.R(f, 1.6, 3.6);
      f.flat(ell(q, r, r * 0.8, 0, 7), '#2a1610', { op: 0.75 }); f.line(ell(q, r + 1.2, r * 0.8 + 1.2, 0, 8).slice(1, 4), 1, skinL, { op: 0.6 });
    }
    for (const [pts, w] of [[[[0.3, 0.1], [0.32, 0.18], [0.28, 0.26], [0.3, 0.31]], 15], [[[0.14, 0.1], [0.12, 0.16], [0.15, 0.22]], 10]]) {
      const C = hF(pts);
      f.stroke(C, w + 5, skinS, { op: 0.4 }); f.stroke(C, w, mix(skinL, '#c09080', 0.35), { op: 0.75 }); f.line(C.slice(0, -1).map(q => add(q, [2, -2])), 2.4, '#f0e0d0', { op: 0.55 }); // keloid, puckered and shiny
      for (let k = 0; k < C.length - 1; k++) { const m = lerp(C[k], C[k + 1], 0.5); f.line([add(m, [-w * 0.5, 0]), add(m, [w * 0.5, 1])], 1.2, skinS, { op: 0.6 }); } // the pucker lines across it
    }
    f.flat(hF([[-0.02, 0.06], [0.2, 0.12], [0.44, 0.13], [0.6, 0.09], [0.6, 0.15], [0.42, 0.19], [0.2, 0.18], [-0.02, 0.12]]), '#000', { op: 0.32 }); // the visor's cast shadow on the cheeks
  });
  f.line(hF([[0.08, 0.16], [0.12, 0.26], [0.1, 0.36]]), 6, skinL, { op: 0.45 }); f.line(hF([[0.08, 0.16], [0.12, 0.26], [0.1, 0.36]]), 1.4, skinS, { op: 0.7 }); // burn welt down the cheek
  // ---- the visor. Forged for him after the sparks took his eyes: an iron band riveted round the skull above the ears,
  // and a heavy wrought-iron face plate riveted to it at the temple, welded up from a brow plate and a cheek plate
  // (a bead down the bend where the face turns, a bead across under the brow), with one narrow slit cut across it that
  // glows from the forge light caught inside. It stands proud of the face and juts over the nose like a shelf.
  const IRv = (o = {}) => W.IR(f, Object.assign({ fill: '#4c4640', shade: 0.42, inkW: 2.2 }, o));
  const band = hF([[0.0, -0.33, 1], [-0.18, -0.36], [-0.34, -0.32], [-0.44, -0.25], [-0.49, -0.15, 1], [-0.45, -0.1], [-0.36, -0.17], [-0.18, -0.21], [0.0, -0.19, 1]]);
  const dB = f.part(band, IRv({ fill: '#3c3732' }));
  W.bevel(f, dB, E.bbox(band), 4, { lite: '#8a847a', lite2: '#c8c0b0', lite2Op: 0.4 });
  for (const u of [[-0.08, -0.27], [-0.2, -0.285], [-0.32, -0.25], [-0.42, -0.19]]) f.rivet(hF([u])[0], 5, P.ironL);
  const VIS = hF([[0.0, -0.4, 1], [0.08, -0.47], [0.22, -0.45], [0.36, -0.39], [0.48, -0.29], [0.58, -0.18], [0.65, -0.07, 1], [0.64, 0.04], [0.6, 0.1, 1], [0.44, 0.135], [0.26, 0.13], [0.1, 0.105], [-0.03, 0.07, 1], [-0.04, -0.16]]);
  const dV = f.part(VIS, IRv());
  W.bevel(f, dV, E.bbox(VIS), 6, { lite: '#8a847a', lite2: '#d0c8b8', lite2Op: 0.45 });
  W.clipDraw(f, VIS, () => {
    f.flat(hF([[0.46, -0.34], [0.66, -0.1], [0.66, 0.06], [0.6, 0.12], [0.46, 0.14]]), '#c8c0b0', { op: 0.18 }); // the front plane, turned to the light
    f.flat(hF([[-0.04, -0.4], [0.1, -0.46], [0.1, 0.12], [-0.04, 0.08]]), '#000', { op: 0.22 }); // the side turning away at the temple
    W.scorch(f, hF([[0.3, -0.2]])[0], 50, 26, 0.45); W.scorch(f, hF([[0.52, 0.06]])[0], 30, 16, 0.4);
    W.heatTint(f, hF([[0.14, -0.08], [0.4, -0.08], [0.62, -0.09]]), 5); // tempered straw-to-umber above the slit, where the heat comes through
    f.scratches(hF([[0.26, -0.3]])[0], 34, 7, '#b8b0a2', 1, -0.4);
    f.scratches(hF([[0.32, 0.07]])[0], 26, 5, '#b8b0a2', 1, 0.2);
    for (let i = 0; i < 26; i++) { const q = hF([[W.R(f, 0.04, 0.62), W.R(f, -0.42, 0.11)]])[0], r = W.R(f, 1.4, 3); f.flat(ell(q, r, r, 0, 6), '#0e0c0a', { op: 0.7 }); f.line(ell(q, r + 1, r + 1, 0, 8).slice(1, 4), 0.9, '#a8a094', { op: 0.5 }); } // spark pits in the iron
    const dq = hF([[0.34, -0.3]])[0], de = ell(dq, 16, 10, hA + 0.4, 14); f.flat(de, '#000', { op: 0.2 }); f.line(de.slice(2, 8), 2, '#a8a094', { op: 0.55 }); // an old dent from a hammer
  });
  // the bend where the face plate turns, and the welds: down the bend, and across under the brow
  f.line(hF([[0.455, -0.28], [0.47, -0.2], [0.47, 0.125]]), 2.4, '#c8c0b0', { op: 0.45 }); f.line(hF([[0.435, -0.28], [0.45, -0.2], [0.45, 0.125]]), 2, INK, { op: 0.5 });
  ironWeld(f, hF([[0.46, -0.2], [0.468, -0.14], [0.47, -0.09]]), 7);
  f.line(hF([[0.04, -0.168], [0.26, -0.188], [0.46, -0.208], [0.61, -0.172]]), 2.2, '#c8c0b0', { op: 0.5 }); f.line(hF([[0.04, -0.13], [0.26, -0.15], [0.46, -0.17], [0.61, -0.14]]), 3, '#000', { op: 0.3 }); // the brow plate lapped over the cheek plate: its lit edge, its shadow
  ironWeld(f, hF([[0.04, -0.15], [0.26, -0.17], [0.46, -0.19], [0.61, -0.155]]), 6.4);
  for (const u of [[0.1, -0.225], [0.22, -0.24], [0.34, -0.255], [0.54, -0.235]]) f.rivet(hF([u])[0], 4.4, P.ironL); // a row of rivets along the lap
  for (const u of [[0.415, -0.3], [0.425, -0.12], [0.43, 0.06]]) f.rivet(hF([u])[0], 4.2, P.ironL); // and along the bend's seam
  ironWeld(f, hF([[0.47, -0.005], [0.47, 0.11]]), 6.4);
  // the slit: a narrow cut straight across both planes, bent at the turn; inside it the light of the forge
  const slit = hF([[0.12, -0.07], [0.3, -0.072], [0.46, -0.075], [0.64, -0.06], [0.64, -0.035], [0.46, -0.045], [0.3, -0.042], [0.12, -0.04]]);
  W.glow(f, hF([[0.4, -0.06]])[0], 0.34 * HH, 0.08 * HH, P.lamp, 0.25, false, hA); W.glow(f, hF([[0.42, -0.06]])[0], 0.28 * HH, 0.05 * HH, P.arcG, 0.45, false, hA);
  f.part(slit, { fill: '#0a0604', inkW: 2, cast: false, hatch: false, gritOp: 0 });
  f.line(hF([[0.16, -0.056], [0.3, -0.058], [0.46, -0.06], [0.62, -0.048]]), 3.6, P.arcD, { op: 0.95 });
  f.line(hF([[0.2, -0.057], [0.46, -0.06], [0.6, -0.05]]), 2.2, P.arcG, { op: 0.95 });
  f.line(hF([[0.28, -0.058], [0.46, -0.06], [0.54, -0.056]]), 1.3, P.arc, { op: 0.95 }); // white-gold: the forge heat inside; nothing shows through
  f.line(hF([[0.13, -0.036], [0.3, -0.038], [0.46, -0.041], [0.63, -0.03]]), 1.6, P.arcG, { op: 0.4 }); // the light catching the lower lip of the cut
  // rivets: the visor to the band at the temple, and a row along the cheek plate's lower lip
  for (const u of [[0.03, -0.3], [0.03, -0.2], [0.02, -0.06], [0.03, 0.04]]) f.rivet(hF([u])[0], 5.4, P.ironL);
  for (const u of [[0.16, 0.08], [0.3, 0.1], [0.42, 0.105], [0.56, 0.075]]) f.rivet(hF([u])[0], 4.6, P.ironL);
  W.slag(f, hF([[0.22, -0.3]])[0], 30, 16, 4, 2, 3.4, { hot: 0.3 }); // spatter beads stuck to the plate
  // what hair is left stands on end behind the band: singed tufts over the crown and the back of the skull
  W.standingHair(f, hF([[-0.38, -0.31], [-0.3, -0.36], [-0.2, -0.39], [-0.1, -0.42]]), 58, { w: 4.6, col: '#3a3028', lean: -0.3, fan: 1.6 });

  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, hamA, 96, skin, { tex: 'mottle' + seed, texOp: 0.4, shadow: mix(skin, skinS, 0.6), name: 'sparkblind sledge', maxBend: 40 });
  for (const [x, y] of [[0.3, -0.45], [0.32, -0.15], [0.3, 0.15], [0.28, 0.42]]) { const q = gN.F([[x, y]])[0]; f.flat(ell(q, 7, 5, 0, 8), skinL, { op: 0.5 }); } // knuckles worn shiny
  for (const [x, y] of [[0.3, -0.3], [0.32, 0.02]]) { const q = gN.F([[x, y]])[0]; f.line([q, add(q, [8, 10])], 3, skinL, { op: 0.55 }); f.line([q, add(q, [8, 10])], 1.2, skinS, { op: 0.7 }); } // split knuckles healed white
  f.line(gN.F([[-0.6, -0.2], [-0.2, -0.3], [0.1, -0.24]]), 3, skinS, { op: 0.5 }); // a vein over the back of the hand
  W.slag(f, gN.F([[-0.3, 0.1]])[0], 14, 14, 3, 2.4, 3.6);
  W.glow(f, gN.F([[0, 0]])[0], 50, 40, P.sootD, 0.3);

  // ---- the far fist on the tongs (inline: the reins run on from the forearm through the palm)
  f.bone('hand_f');
  B.grip(f, WF, EF, tongA - Math.PI / 2, 82, '#4a3420', { inline: true, cuff: false, shadow: '#1a100a', tex: 'craze' + seed, texOp: 0.4, name: 'sparkblind tongs' });
  return f;
}

// ------------------------------------------------------------------ TALOS SENTINEL (elite 2.4)
// The foundry's gate guardian: a hollow bronze warrior cast in classical form, a statue's sculpted anatomy for a body,
// split by cracks where the molten ichor inside glows through. A hoplite's guard: the round shield forward on the far
// arm, the spear held low on the near side ready to thrust up under a guard (so the shaft never crosses its face), weight
// sunk into a long stance, the near leg braced back. A single bronze nail plugs the vein at the back of the near heel;
// ichor beads round it and drips. Corinthian helm with a tall sooted horsehair crest on a bronze holder; behind the
// helm's T-opening a blank, expressionless bronze face. Pteruges of scorched leather at the hips, bronze greaves, a
// soot-black cloak pinned at the near shoulder.
// Rig: standard humanoid + spear (hand_n) + shield (hand_f) + crest (head) + cape (torso) + kilt (pelvis) + ichor
// (foot_n). Motion: idle ichor dripping from the heel (ichor); attack a spear thrust (near arm drives forward, torso
// turns into it).
function talosSentinel() {
  const seed = 502, CW = 1100, CH = 1400, f = new Fig(W.base(seed, CH, { grimeY: 1100 }));
  W.textures(f);
  const gy = f.o.groundY;
  const BRZ = (o = {}) => W.BR(f, Object.assign({ fill: '#8a6236', shadow: '#3a2410', maxShade: 40 }, o));
  const N = [604, 392], C = [530, 560], Pv = [520, 770];
  const S = B.spine(N, C, Pv, 240);
  const SN = [540, 440], EN = [430, 586], WN = [524, 690];
  const SF = [660, 430], EF = [760, 540], WF = [790, 452];
  const HF = [566, 786], KF = [726, 1000], AF = [780, 1262];
  const HN = [486, 800], KN = [390, 1040], AN = [262, 1262];
  const HC = [668, 262], hA = 0.12, HH = 236;
  const spT = [940, 600], spB = [216, 788], spA = ang(spB, spT);
  const shC = [876, 640];
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.25, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('spear', WN, 'hand_n').joint('shield', WF, 'hand_f').joint('crest', add(HC, [-20, -110]), 'head').joint('cape', S.at(-0.2, 0.06), 'torso').joint('kilt', S.at(0, 0.9), 'pelvis').joint('ichor', add(AN, [-40, 40]), 'foot_n');

  f.bone('root');
  f.flat(ell([520, gy + 4], 360, 22, 0, 20), '#000', { op: 0.32 });
  // ichor pooled under the heel, glowing, crusting black at its rim
  f.flat(ell([214, gy - 2], 50, 9, 0, 16), P.char, { op: 0.9 }); f.flat(ell([216, gy - 3], 36, 6, 0, 14), P.ember); f.flat(ell([218, gy - 3.5], 18, 3, 0, 10), P.hot);
  W.glow(f, [216, gy - 4], 60, 14, P.lamp, 0.4);

  // ---- cloak: soot-black wool pinned at the near shoulder, hanging behind, the hem burnt to rags
  f.bone('cape');
  const cape = [S.at(-0.1, 0.0), S.at(-0.6, 0.06), [300, 560], [250, 760], [262, 880], [300, 852, 1], [330, 900], [360, 860, 1], [400, 910], [420, 840, 1], S.at(-0.5, 0.7), S.at(-0.3, 0.3)];
  f.part(cape, { fill: '#2a2624', shadow: '#0e0c0a', shade: 0.42, tex: 'weave' + seed, texOp: 0.4 });
  W.clipDraw(f, cape, () => { for (const [a0, b0, c0] of [[[380, 470], [320, 640], [310, 840]], [[440, 500], [400, 680], [380, 860]]]) f.stroke([a0, b0, c0], 4, '#0e0c0a', { op: 0.6 }); W.ash(f, [330, 880], 8, 80, 60, 1); });
  f.stroke([[262, 880], [300, 852], [330, 900], [360, 860], [400, 910]], 4, P.ember, { op: 0.5 }); // the burnt hem still smouldering
  W.flakes(f, [330, 880], 70, 14, 6, 1);

  // ---- far arm with the shield: forearm up behind the shield, hand on the grip
  W.muscleArm(f, SF, EF, WF, [104, 82, 70], BRZ({ shade: 0.42, fill: mix('#8a6236', '#000', 0.15) }), '_f');

  // ---- far leg, forward: sculpted bronze, a greave over the shin
  const legB = (Hp, Kn, A, sfx, tint) => {
    const look = BRZ({ fill: mix('#8a6236', '#000', tint), shade: 0.42 });
    W.legRig(f, Hp, Kn, A, 104, 128, 86, look, sfx, { thigh: 0.08, calf: 1.16 });
    f.bone('thigh' + sfx);
    W.groove(f, [lp(Hp, Kn, 0.25, 24), lp(Hp, Kn, 0.6, 34), lp(Hp, Kn, 0.9, 20)], 2.2); W.groove(f, [lp(Hp, Kn, 0.5, -10), lp(Hp, Kn, 0.8, -4), lp(Hp, Kn, 0.95, 10)], 1.8); // the sculpted quad
    W.verdigris(f, lp(Hp, Kn, 0.95, 0), 20, 14, 0.45); W.dent(f, lp(Hp, Kn, 0.45, -20), 10); f.scratches(lp(Hp, Kn, 0.4, 10), 30, 6, P.bronzeP, 1, 0.8);
    W.crackNet(f, lp(Hp, Kn, 0.35, 10), ang(Hp, Kn) + 0.6, 90, 2.6, { depth: 1, fork: 0.4 });
    f.bone('shin' + sfx);
    const dS = E.norm(sub(A, Kn)), nS = [-dS[1], dS[0]];
    const gv = [add(lerp(Kn, A, 0.1), mul(nS, 46)), add(lerp(Kn, A, 0.4), mul(nS, 46)), add(lerp(Kn, A, 0.76), mul(nS, 32)), add(lerp(Kn, A, 0.8), mul(nS, -30)), add(lerp(Kn, A, 0.4), mul(nS, -54)), add(lerp(Kn, A, 0.06), mul(nS, -42))];
    f.part(gv, BRZ({ fill: mix('#9a7040', '#000', tint), k: 0.8 }));
    W.clipDraw(f, gv, () => { W.scorch(f, lerp(Kn, A, 0.6), 40, 70, 0.5); W.lichtenberg(f, lerp(Kn, A, 0.2), ang(Kn, A) + 0.3, 100, 2.4, { metal: true, depth: 2 }); f.stroke([add(lerp(Kn, A, 0.1), mul(nS, 30)), add(lerp(Kn, A, 0.45), mul(nS, 34)), add(lerp(Kn, A, 0.72), mul(nS, 22))], 3, P.bronzeP, { op: 0.5 }); });
    f.line([add(lerp(Kn, A, 0.1), mul(nS, 44)), add(lerp(Kn, A, 0.06), mul(nS, -40))], 3, P.bronzeP, { op: 0.6 });
    f.bone('foot' + sfx);
    W.splats(f, add(A, [60, 90]), 90, 14, 9, '#15110e');
  };
  legB(HF, KF, AF, '_f', 0.18);

  // ---- torso: a statue's torso cast in bronze, cracked open over the molten ichor inside
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.34, 0.3], [0.06, 0.62, 0.5], [0.2, 0.7, 0.72], [0.4, 0.62, 0.74], [0.6, 0.5, 0.6], [0.78, 0.5, 0.56], [0.94, 0.56, 0.6], [1.06, 0.5, 0.5]]);
  f.part(torso, BRZ({ shade: 0.5 }));
  W.clipDraw(f, torso, () => {
    W.scorch(f, S.at(-0.4, 0.5), 70, 120, 0.45); W.scorch(f, S.at(0.3, 0.86), 60, 30, 0.35);
    // sculpted anatomy: pectorals, the arch of the ribs, the abdominal grid, the iliac line
    // sculpted anatomy cut as a statue's: the pectoral shelf with its shadowed underside, the sternum line, the arch of
    // the ribs, six abdominal blocks with lit tops, the serratus fingers, the iliac line; verdigris packed in every cut
    f.flat([S.at(0.04, 0.38), S.at(0.4, 0.43), S.at(0.68, 0.36), S.at(0.64, 0.45), S.at(0.38, 0.5), S.at(0.06, 0.45)], '#000', { op: 0.3 });
    W.groove(f, [S.at(0.04, 0.37), S.at(0.24, 0.42), S.at(0.42, 0.43), S.at(0.68, 0.35)], 3);
    W.groove(f, [S.at(0.42, 0.14), S.at(0.43, 0.28), S.at(0.42, 0.42)], 2.4);
    f.flat([S.at(0.1, 0.18), S.at(0.4, 0.2), S.at(0.42, 0.34), S.at(0.12, 0.33)], P.bronzeP, { op: 0.3 }); f.flat([S.at(0.46, 0.2), S.at(0.66, 0.22), S.at(0.66, 0.32), S.at(0.46, 0.33)], P.bronzeP, { op: 0.2 }); // the lit planes of the chest
    W.groove(f, [S.at(0.66, 0.44), S.at(0.5, 0.5), S.at(0.3, 0.52), S.at(0.06, 0.5)], 2.4);
    for (let i = 0; i < 3; i++) { const v = 0.55 + i * 0.09; W.groove(f, [S.at(0.2, v), S.at(0.42, v + 0.012), S.at(0.6, v - 0.008)], 2); for (const [u0, u1] of [[0.22, 0.4], [0.44, 0.58]]) f.flat([S.at(u0, v + 0.01), S.at(u1, v + 0.012), S.at(u1 - 0.01, v + 0.035), S.at(u0 + 0.01, v + 0.033)], P.bronzeP, { op: 0.28 }); }
    W.groove(f, [S.at(0.42, 0.5), S.at(0.43, 0.68), S.at(0.41, 0.84)], 2);
    W.groove(f, [S.at(0.0, 0.7), S.at(0.2, 0.84), S.at(0.42, 0.93)], 2.6);
    for (let i = 0; i < 3; i++) W.groove(f, [S.at(-0.12 + i * 0.06, 0.46 + i * 0.07), S.at(0.02 + i * 0.06, 0.5 + i * 0.07)], 1.8); // serratus
    // wear: dents, scratches, a verdigris bloom in the armpit and down the flank
    for (const [u, v, r] of [[0.28, 0.24, 14], [0.5, 0.66, 10], [-0.2, 0.6, 16]]) W.dent(f, S.at(u, v), r, 0.3);
    f.scratches(S.at(0.3, 0.3), 60, 14, P.bronzeP, 1, -0.6); f.scratches(S.at(0.4, 0.7), 40, 8, P.bronzeP, 1, 0.4);
    W.verdigris(f, S.at(-0.05, 0.22), 30, 40, 0.45); W.verdigris(f, S.at(-0.3, 0.72), 40, 50, 0.35);
    // the cracks: molten ichor glowing through split bronze
    W.crackNet(f, S.at(-0.2, 0.3), 1.1, 170, 4, { depth: 2, fork: 0.6 });
    W.crackNet(f, S.at(0.5, 0.62), 1.9, 110, 3, { depth: 1 });
    W.lichtenberg(f, S.at(-0.5, 0.1), 1.3, 180, 3.2, { metal: true, depth: 3 });
    for (let i = 0; i < 6; i++) { const q = W.scatter(f, S.at(0.1, 0.5), 60, 80); f.flat(ell(q, 6, 4, f.r() * 3, 10), '#000', { op: 0.22 }); }
  });
  W.fusedRun(f, S.at(-0.3, 0.42), 40, 6, { col: P.ember });
  // ---- kilt: two rows of scorched leather pteruges over a bronze belt
  f.bone('kilt');
  const kl = [128, 150, 118, 160, 136, 146, 122, 154, 140];
  for (let row = 0; row < 2; row++) for (let i = 0; i < 9; i++) {
    const u = -0.62 + i * 0.145 + row * 0.07, top = S.at(u, 0.88 + row * 0.03), l = kl[(i + row * 4) % 9] - row * 26, w = 30, sk = u > 0 ? 14 : -6;
    const strip = [[...add(top, [-w / 2, 0]), 1], [...add(top, [w / 2, 0]), 1], add(top, [w / 2 + sk, l - 6]), add(top, [sk * 0.9, l + 4]), add(top, [-w / 2 + sk, l - 4])];
    f.part(strip, W.LEA(f, { fill: row ? '#4a3020' : '#36241a', inkW: 1.6, k: 0.8 }));
    f.line([add(top, [-w / 2 + 6, l - 22]), add(top, [w / 2 + sk - 4, l - 20])], 1.4, '#a08a6a', { op: 0.5, dash: '3 3' });
    if ((i + row) % 3 === 0) W.scorch(f, add(top, [sk, l - 16]), 14, 20, 0.6);
    f.stroke([add(top, [-w / 2 + sk, l - 4]), add(top, [sk * 0.9, l + 4]), add(top, [w / 2 + sk, l - 6])], 3, P.char, { op: 0.8 });
  }
  f.bone('pelvis');
  f.part([S.at(-0.6, 0.84), S.at(0.56, 0.82), S.at(0.6, 0.92), S.at(-0.62, 0.94)].map(q => [q[0], q[1], 1]), BRZ({ fill: '#9a7040', inkW: 1.8 }));
  W.rivetRow(f, S.at(-0.54, 0.88), S.at(0.5, 0.86), 8, 4, P.bronzeL, { fused: 0.2 });

  // ---- near leg, braced back: the heel and its nail toward the viewer
  legB(HN, KN, AN, '_n', 0);
  f.bone('foot_n');
  const heel = add(AN, [-46, 46]);
  f.part(ell(heel, 15, 15, 0, 12), BRZ({ fill: P.bronzeL, inkW: 1.8, cast: false })); // the nail head, peened flat
  f.flat(ell(add(heel, [3, 3]), 7, 6, 0, 8), mix(P.bronzeD, '#000', 0.2), { op: 0.6 });
  f.line(ell(heel, 15, 15, 0, 12).slice(10, 14), 2, P.bronzeP, { op: 0.8 });
  f.raw(`<circle cx="${heel[0]}" cy="${heel[1]}" r="26" fill="${P.lamp}" opacity="0.45" filter="url(#glow${seed})"/>`);
  W.seam(f, [add(heel, [-8, 14]), add(heel, [-2, 22]), add(heel, [-6, 34])], 2.4, { hot: P.core });
  W.seam(f, [add(heel, [10, -12]), add(heel, [22, -40]), add(heel, [28, -80])], 2, {}); // the vein's line up the calf
  f.bone('ichor');
  for (const [dx, l] of [[-10, 50], [-2, 90]]) { const p0 = add(heel, [dx, 20]); f.stroke([p0, add(p0, [-1, l * 0.5]), add(p0, [-2, l * 0.8])], 5, P.lamp); f.flat(ell(add(p0, [-2, l]), 4.6, 6, 0, 8), P.hot); f.flat(ell(add(p0, [-2, l]), 2, 2.6, 0, 6), P.core); }

  // ---- head: Corinthian helm with a tall crest; a blank bronze face behind the T-opening
  f.bone('head');
  f.part(limb(S.at(0.2, -0.04), add(HC, [-14, 70]), 120, 104), BRZ({ shade: 0.5 })); // neck
  W.crackNet(f, add(HC, [-30, 100]), 1.6, 50, 2, { depth: 0 });
  const hF = frame(HC, hA, HH);
  const helm = [[-0.42, 0.06], [-0.4, -0.24], [-0.26, -0.42], [-0.02, -0.5], [0.22, -0.44], [0.36, -0.28], [0.42, -0.06], [0.44, 0.1], [0.42, 0.3], [0.34, 0.46], [0.22, 0.52], [0.16, 0.44], [0.08, 0.5], [-0.04, 0.52], [-0.18, 0.46], [-0.3, 0.46], [-0.36, 0.3]];
  // behind the openings: the blank face (drawn first so the helm frames it)
  f.part(hF([[0.06, -0.2], [0.42, -0.2], [0.46, 0.5], [0.08, 0.5]]), BRZ({ fill: '#7a5630', shade: 0.4, cast: false }));
  f.part(hF(helm), BRZ({ fill: '#9a7040', shade: 0.5, maxShade: 50 }));
  // the T-opening: eye slots and the gap between the cheek guards; inside, the blank face
  const eyeSlot = hF([[0.12, -0.12], [0.44, -0.1], [0.44, -0.02], [0.3, 0.0], [0.24, 0.04], [0.12, -0.03]]);
  f.flat(eyeSlot, '#120c08');
  f.flat(hF([[0.27, 0.0], [0.34, 0.0], [0.38, 0.5], [0.31, 0.5]]), '#120c08');
  // blank bronze eyes: smooth, no pupils, the ichor's light faint behind them
  for (const [x, rx] of [[0.2, 0.06], [0.39, 0.035]]) { const c = hF([[x, -0.06]])[0]; f.part(ell(c, rx * HH, 0.032 * HH, hA, 12), BRZ({ fill: '#6e4c28', shade: 0.35, inkW: 1.2, cast: false, hatch: false })); f.flat(ell(add(c, [2, -3]), rx * HH * 0.35, 0.01 * HH, hA, 8), P.bronzeL, { op: 0.5 }); }
  f.flat(hF([[0.31, 0.28], [0.37, 0.28], [0.37, 0.3], [0.31, 0.3]]), '#2a1a0c'); // the closed mouth: one straight line
  // helm detail: brow ridge, nose guard, the rim with a rolled edge, cheek guard lines, a dent and scorch
  f.part(hF([[0.06, -0.2], [0.46, -0.18], [0.47, -0.12], [0.1, -0.13]]).map(q => [q[0], q[1], 1]), BRZ({ fill: '#a07848', inkW: 1.6, cast: false }));
  f.part(hF([[0.25, -0.12], [0.33, -0.12], [0.36, 0.06], [0.3, 0.08], [0.26, 0.04]]), BRZ({ fill: '#a07848', inkW: 1.4, cast: false })); // nose guard
  W.clipDraw(f, hF(helm), () => {
    W.scorch(f, hF([[-0.2, -0.2]])[0], 60, 50, 0.5);
    W.lichtenberg(f, hF([[-0.3, 0.1]])[0], hA - 0.9, 110, 3, { metal: true, depth: 2 });
    f.stroke(hF([[-0.38, 0.24], [-0.14, 0.18], [0.08, 0.22]]), 3, INK, { op: 0.5 });
    f.flat(hF(ell([-0.05, -0.3], 0.08, 0.05, 0.4, 10)), '#000', { op: 0.3 });
    f.line(hF([[-0.3, -0.36], [-0.04, -0.46], [0.2, -0.42]]), 3, P.bronzeP, { op: 0.55 });
  });
  f.line(hF([[-0.36, 0.42], [-0.18, 0.46], [-0.04, 0.52], [0.16, 0.44], [0.22, 0.52], [0.34, 0.46]]), 3, P.bronzeP, { op: 0.5 }); // rolled rim
  W.fusedRun(f, hF([[0.0, 0.5]])[0], 30, 5);
  // ---- the crest: a bronze holder on a stilt, a tall fan of sooted horsehair from brow to nape
  f.bone('crest');
  const st0 = hF([[0.0, -0.5]])[0];
  const base = hF([[0.3, -0.44], [0.12, -0.53], [-0.1, -0.54], [-0.3, -0.44], [-0.42, -0.26]]);
  const cr = [base[0], hF([[0.42, -0.62]])[0], hF([[0.36, -0.86]])[0], hF([[0.14, -1.02]])[0], hF([[-0.14, -1.06]])[0], hF([[-0.42, -0.96]])[0], hF([[-0.64, -0.7]])[0], hF([[-0.76, -0.36]])[0], hF([[-0.82, 0.0]])[0], hF([[-0.8, 0.26]])[0], hF([[-0.7, 0.36]])[0], hF([[-0.64, 0.08]])[0], hF([[-0.52, -0.2]])[0], base[4], base[3], base[2], base[1]];
  f.part(cr, { fill: '#2a2420', shadow: '#0c0a08', light: '#5a4e44', shade: 0.42, tex: 'hatch' + seed, texOp: 0.5, k: 0.9 });
  W.clipDraw(f, cr, () => { for (let i = 0; i < 26; i++) { const tt = i / 25, a0 = hF([[0.3 - tt * 0.8, -0.5 + tt * 0.1]])[0], a1 = hF([[0.36 - tt * 1.3, -1.0 + tt * 1.3]])[0]; f.line([a0, lerp(a0, a1, 0.5).map((v, j) => v + (j ? -10 : 0)), a1], 1.6, i % 3 ? '#4a4038' : '#0e0c0a', { op: 0.7 }); } W.scorch(f, hF([[-0.2, -0.8]])[0], 80, 50, 0.4); });
  f.part(K.chain(base, [30, 30, 30, 28, 24]), BRZ({ fill: '#9a7040', inkW: 1.6 })); // the bronze holder along the crown
  W.rivetRow(f, base[0], base[3], 5, 3.4, P.bronzeL);
  const st0b = hF([[-0.1, -0.86]])[0];
  W.ash(f, add(st0b, [0, -40]), 10, 160, 120, 1.6);
  W.flakes(f, add(st0b, [-40, 20]), 90, 20, 6, 1.2);

  // ---- the shield: a round aspis turned three-quarter, bronze face over oak, a thick rim, beaten and cracked
  f.bone('shield');
  const shR = [118, 232], shA = -0.06;
  f.part(ell(add(shC, [-22, 6]), shR[0] * 0.5, shR[1], shA, 32), { fill: P.woodD, shadow: '#120c06', shade: 0.4, tex: 'wood' + seed, texOp: 0.6, inkW: 2 }); // the thick edge and oak core seen past the face
  const face = ell(shC, shR[0], shR[1], shA, 40);
  f.part(face, BRZ({ fill: '#94683a', shade: 0.48, maxShade: 60 }));
  W.clipDraw(f, face, () => {
    W.scorch(f, add(shC, [-30, 80]), 90, 140, 0.5);
    W.lichtenberg(f, add(shC, [10, -40]), 2.0, 200, 3.6, { metal: true, depth: 3 }); // struck at the gate, the burn fans over the face
    for (let i = 0; i < 6; i++) { const q = W.scatter(f, shC, 90, 200), r = W.R(f, 8, 16); f.flat(ell(q, r * 0.6, r, shA, 12), '#000', { op: 0.25 }); f.line(ell(q, r * 0.6, r, shA, 12).slice(0, 5), 1.4, P.bronzeP, { op: 0.5 }); } // dents
    W.crackNet(f, add(shC, [40, 120]), -1.9, 80, 2.4, { depth: 1 });
    f.flat(ell(add(shC, [30, -100]), 22, 50, shA, 14), P.bronzeP, { op: 0.3 });
  });
  const rimO = ell(shC, shR[0] + 12, shR[1] + 14, shA, 44), rimI = ell(shC, shR[0] - 8, shR[1] - 12, shA, 44).reverse();
  f.part(E.smooth(rimO) + ' ' + E.smooth(rimI), BRZ({ fill: '#a07848', bbPts: rimO, inkW: 2 }));
  W.rivetRow(f, add(shC, [-80, -200]), add(shC, [-110, 120]), 0, 3);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; f.rivet(add(shC, rot([Math.cos(a) * (shR[0] + 2), Math.sin(a) * (shR[1] + 2)], shA)), 3.8, P.bronzeL); }
  // a boss: an embossed bull's head worn almost flat
  f.part(ell(add(shC, [6, -6]), 34, 50, shA, 18), BRZ({ fill: '#a07848', inkW: 1.6 }));
  f.line([add(shC, [-14, -40]), add(shC, [-30, -60]), add(shC, [-20, -66])], 3, INK, { op: 0.6 }); f.line([add(shC, [24, -42]), add(shC, [40, -62]), add(shC, [30, -68])], 3, INK, { op: 0.6 });
  f.flat(ell(add(shC, [6, 20]), 10, 8, 0, 8), '#000', { op: 0.35 });

  // ---- the spear: ash shaft, a leaf blade of bronze, a bronze butt-spike; carried low on the near side
  f.bone('spear');
  f.part(limb(spB, spT, 22, 18, { steps: 10 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(spB, spT, 0.02, -5), lp(spB, spT, 0.98, -5)], 1.6, P.woodL, { op: 0.5, straight: true });
  for (const t of [0.34, 0.37, 0.4]) f.line([lp(spB, spT, t, -12), lp(spB, spT, t + 0.008, 12)], 3, P.leathD, { straight: true });
  const sF = frame(spT, spA, 1);
  f.part(sF([[-20, -13], [10, -26], [90, -14], [150, 0], [90, 14], [10, 26], [-20, 13]]), BRZ({ fill: '#a07848', inkW: 1.8 }));
  f.line(sF([[-16, 0], [140, 0]]), 2.6, INK, { op: 0.6 }); f.line(sF([[-10, -4], [120, -3]]), 1.6, P.bronzeP, { op: 0.7 });
  f.part(sF([[-60, -14], [-16, -14], [-16, 14], [-60, 14]]).map(q => [q[0], q[1], 1]), BRZ({ inkW: 1.4 })); // socket
  W.lichtenberg(f, sF([[30, 0]])[0], spA, 50, 1.8, { metal: true, depth: 1 });
  const bF = frame(spB, spA + Math.PI, 1);
  f.part(bF([[-30, -13], [20, -10], [70, 0], [20, 10], [-30, 13]]), BRZ({ inkW: 1.6 })); // sauroter
  f.flat(sF(ell([60, 0], 30, 8, 0, 10)), P.sootD, { op: 0.5 });

  // ---- near arm: drawn back, the fist low at the hip on the spear
  W.muscleArm(f, SN, EN, WN, [118, 80, 72], BRZ({ shade: 0.42 }), '_n', { muscle: false, bp: [[0, 0.3, 0.2, 0.18], [1, 0.25, 0.24, 0.2]], bq: [[0, 0.55, 0.18, 0.18], [1, 0.2, 0.12, 0.2]] });
  f.bone('upperarm_n');
  W.clipDraw(f, K.chain([SN, EN], [140, 100]), () => {
    W.crackNet(f, lp(SN, EN, 0.5), ang(SN, EN) + 0.5, 60, 2.4, { depth: 1 }); W.scorch(f, lp(SN, EN, 0.8), 30, 30, 0.4);
    W.groove(f, [lp(SN, EN, 0.45, -50), lp(SN, EN, 0.62, -8), lp(SN, EN, 0.95, 0)], 2.2); // biceps / triceps split
    f.flat([lp(SN, EN, 0.4, 8), lp(SN, EN, 0.5, 46), lp(SN, EN, 0.85, 34), lp(SN, EN, 0.8, 4)], P.bronzeP, { op: 0.22 }); // the lit belly of the biceps
    W.verdigris(f, lp(SN, EN, 0.95, -10), 16, 16, 0.5); W.dent(f, lp(SN, EN, 0.7, -24), 9, ang(SN, EN));
  });
  // the deltoid: a sculpted cap over the shoulder, its lower edge cut deep
  const dl = [lp(SN, EN, -0.14, -50), lp(SN, EN, -0.2, 8), lp(SN, EN, -0.1, 58), lp(SN, EN, 0.2, 60), lp(SN, EN, 0.52, 44), lp(SN, EN, 0.3, -6), lp(SN, EN, 0.1, -44)];
  f.part(dl, BRZ({ shade: 0.3, maxShade: 16, cast: false, k: 1, inkW: 1.2, inkHeavy: 2 }));
  W.groove(f, [lp(SN, EN, 0.1, -44), lp(SN, EN, 0.3, -6), lp(SN, EN, 0.52, 44)], 2.4);
  f.line([lp(SN, EN, -0.14, 30), lp(SN, EN, 0.1, 54), lp(SN, EN, 0.3, 50)], 2.4, P.bronzeP, { op: 0.5 });
  f.scratches(lp(SN, EN, 0.1, 10), 24, 6, P.bronzeP, 1, -0.3);
  f.bone('forearm_n');
  W.clipDraw(f, K.chain([EN, WN], [98, 78]), () => { W.lichtenberg(f, lp(EN, WN, 0.1), ang(EN, WN), 70, 2.2, { metal: true, depth: 2 }); W.groove(f, [lp(EN, WN, 0.05, 20), lp(EN, WN, 0.3, 30), lp(EN, WN, 0.55, 14)], 1.8); W.verdigris(f, lp(EN, WN, 0.02, -10), 14, 14, 0.5); });
  f.part(plate(EN, WN, 0.6, 1.0, 92, 86), BRZ({ fill: '#9a7040' })); // a bronze bracer
  W.rivetRow(f, lp(EN, WN, 0.64, -36), lp(EN, WN, 0.64, 36), 3, 3, P.bronzeL);
  f.bone('torso');
  // the cloak's pin at the near shoulder: a bronze disc brooch
  f.part(ell(add(SN, [-44, -36]), 22, 20, 0, 14), BRZ({ fill: '#a07848', inkW: 1.6 }));
  f.flat(ell(add(SN, [-44, -36]), 8, 7, 0, 10), '#2a1a0c', { op: 0.6 });
  f.bone('hand_n');
  B.grip(f, WN, EN, spA, 52, '#8a6236', { tex: 'hammer' + seed, texOp: 0.6, shadow: '#3a2410', name: 'talos spear' });
  return f;
}

// ------------------------------------------------------------------ THE ANVIL TITAN (ruler 4)
// The foundry's first automaton, a riveted bronze colossus hunched over the great anvil. At true scale it stands 2560 px,
// so the frame shows it from the hips up, like a cathedral seen from inside (the bible says "cropped at the shoulders";
// the art director kept the hips crop so the helm, hammer and spike stay in frame). Under the plates it has a giant's
// build: a hump of trapezius behind the neck, a chest that swells forward, a waist pulled in under the ribcage, hips
// flaring into faulds. Its plates follow that form: curved pectoral plates with rolled lower edges, rib lames down the
// flank, belly lames bowed round the gut, a back plate over the lats, a pauldron of arched lames over the shoulder dome;
// every plate bevelled, dented, sooted, heat-tinted where the seams glow. The near arm holds the cart-sized hammer cocked
// at the top of the backswing (elbow back and up, fist by the crown, the haft running back to a battered head the size
// of a man's chest); the far fist pins what is on the anvil: a knight, flattened. A copper lightning rod rises from
// between the shoulder blades; arcs crawl from its tip to the hammer. Lightning has scarred it: Lichtenberg burns
// fanning from the rod's root across the back and pauldron, a strike crater on the chest, plates fused together by
// the bolt. Furnace grilles in the solar plexus show the fire; the Tooth is riveted into the sternum as the maker's seal.
// The helm is faceless: a keeled bronze great helm with a jutting brow over a single white slit.
// Rig: torso (root, pivot at the waist) + head + spike + arcs (torso, FX) + upperarm_n/forearm_n/hand_n + hammer +
// upperarm_f/forearm_f/hand_f + anvil and victim on root. Motion: idle a slow rhythmic tap (the hammer drops a little
// and rises); attack the full hammer blow (near arm from cocked back to the anvil).
function anvilTitan() {
  const seed = 500, CW = 1600, CH = 1600, f = new Fig(W.base(seed, CH, { groundY: 2880, grimeY: 99999 }));
  W.textures(f);
  const BRZ = (o = {}) => W.BR(f, Object.assign({ fill: '#7e5a32', shadow: '#24170b', light: '#c99a5e', shade: 0.46 }, o));
  const BRS = (o = {}) => W.BR(f, Object.assign({ fill: '#46321f', shadow: '#130c07', light: '#7a5a3a', shade: 0.46 }, o)); // soot-blackened plate
  const IRN = (o = {}) => W.IR(f, Object.assign({ fill: '#2e2a26', shadow: '#0c0a08' }, o));
  const N = [930, 770], S = B.spine(N, [770, 1030], [830, 1660], 330);
  const prof = [[-0.02, 0.45, 0.42], [0.06, 0.95, 0.75], [0.16, 1.08, 1.15], [0.28, 1.05, 1.32], [0.42, 0.98, 1.22], [0.54, 0.86, 1.02], [0.66, 0.74, 0.86], [0.78, 0.8, 0.9], [0.9, 0.86, 0.95], [1.02, 0.88, 0.95]];
  const pAt = (v, k) => { for (let i = 0; i < prof.length - 1; i++) if (v <= prof[i + 1][0]) { const t = (v - prof[i][0]) / (prof[i + 1][0] - prof[i][0]); return prof[i][k] + (prof[i + 1][k] - prof[i][k]) * t; } return prof[prof.length - 1][k]; };
  const back = v => pAt(v, 1), front = v => pAt(v, 2);
  // a band across the body between v0 and v1, from u0 to u1, bowed down round the body's front (sag in v units)
  const UM = 0.45;
  const bow = (u, hw) => 1 - Math.min(1, ((u - UM) / hw) ** 2);
  const band = (v0, v1, u0, u1, sag, n = 9, o = {}) => {
    const top = [], bot = [];
    for (let i = 0; i <= n; i++) { const t = i / n, u = u0 + (u1 - u0) * t, b = bow(u, 1.6); top.push(S.at(u, v0 + sag * b)); bot.push(S.at(u + (o.taper || 0) * (t - 0.5), v1 + sag * b * (o.sagB ?? 1))); }
    return [[...top[0], 1], ...top.slice(1, -1), [...top[n], 1], [...bot[n], 1], ...bot.slice(1, -1).reverse(), [...bot[0], 1]];
  };
  const edge = (v, u0, u1, sag, n = 9) => { const r = []; for (let i = 0; i <= n; i++) { const u = u0 + (u1 - u0) * i / n; r.push(S.at(u, v + sag * bow(u, 1.6))); } return r; };
  const glowSeam = (pts, w = 3) => W.seam(f, pts, w, { hot: P.arc, glowOp: 0.35 });

  const WAIST = S.B(0.7);
  const SN = [800, 800], EN = [400, 620], WN = [530, 262];
  const SF = [1180, 900], EF = [1290, 1150], WF = [1396, 1330];
  const HC = [1040, 640], hA = 0.66;
  const hamA = Math.PI - 0.04, HM = add(WN, rot([380, 0], hamA));
  const spB = S.at(-0.42, 0.08), spT = [790, 30];
  const ANV = 1392; // the anvil face
  f.joint('torso', WAIST, null).joint('head', N, 'torso').joint('spike', spB, 'torso').joint('arcs', spB, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('hammer', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');

  // ================= the lightning rod: a tapering square copper spike with bronze insulator collars, its tip fused
  f.bone('spike');
  const dS = E.norm(sub(spT, spB)), nS = [-dS[1], dS[0]];
  const spk = [add(spB, mul(nS, 50)), add(lerp(spB, spT, 0.55), mul(nS, 32)), add(lerp(spB, spT, 0.9), mul(nS, 14)), [...spT, 1], add(lerp(spB, spT, 0.9), mul(nS, -14)), add(lerp(spB, spT, 0.55), mul(nS, -34)), add(spB, mul(nS, -52))];
  const spd = f.part(spk, W.CU(f, { fill: '#7a4a2c', shadow: '#22110a', light: '#c8845a', inkW: 2.2, inkHeavy: 4, k: 0.5 }));
  W.bevel(f, spd, E.bbox(spk), 6);
  W.clipDraw(f, spk, () => {
    f.line([add(spB, mul(nS, 18)), add(lerp(spB, spT, 0.95), mul(nS, 3))], 3, '#e0a070', { op: 0.45 }); // the lit arris of the square rod
    W.scorch(f, lerp(spB, spT, 0.82), 30, 90, 0.7);
    W.lichtenberg(f, lerp(spB, spT, 0.3), ang(spB, spT) + 0.15, 200, 3, { metal: true, depth: 2 });
    W.verdigris(f, lerp(spB, spT, 0.45), 16, 60, 0.35);
  });
  // insulators: thick bronze discs seen edge-on, ribbed, with a soot ring above each
  for (const t of [0.3, 0.48, 0.64]) {
    const c = lerp(spB, spT, t), w = 46 - t * 30;
    const ins = [add(add(c, mul(nS, w + 12)), mul(dS, -6)), add(add(c, mul(nS, w + 9)), mul(dS, 26)), add(add(c, mul(nS, -w - 9)), mul(dS, 26)), add(add(c, mul(nS, -w - 12)), mul(dS, -6)), add(add(c, mul(nS, -w - 4)), mul(dS, -18)), add(add(c, mul(nS, w + 4)), mul(dS, -18))];
    const d = f.part(ins, BRZ({ inkW: 2, cast: false, k: 0.6 })); W.bevel(f, d, E.bbox(ins), 4);
    f.line([add(add(c, mul(nS, w + 8)), mul(dS, 8)), add(add(c, mul(nS, -w - 8)), mul(dS, 8))], 2, INK, { op: 0.6, straight: true });
    W.rivetRow(f, add(add(c, mul(nS, -w)), mul(dS, 13)), add(add(c, mul(nS, w)), mul(dS, 13)), 3, 4.4, P.bronzeL, { fused: 0.3 });
    W.soot(f, add(c, mul(dS, 40)), w * 0.7, 26, 0.45, ang(spB, spT) + Math.PI / 2);
  }
  // the fused tip: the point melted into a bead, re-set bright, a split collar below it
  f.part(ell(add(spT, mul(dS, -18)), 16, 22, ang(spB, spT), 10), BRZ({ fill: '#b88450', inkW: 1.8, cast: false }));
  f.flat(ell(add(spT, mul(dS, -14)), 6, 9, ang(spB, spT), 8), P.arcG, { op: 0.8 });
  W.fusedRun(f, add(lerp(spB, spT, 0.9), mul(nS, 8)), 60, 7, { col: P.copper });

  // ================= the hammer: an iron-strapped oak haft, a forged head the size of a man's chest, battered
  f.bone('hammer');
  const hbt = add(WN, rot([-150, 0], hamA)), heye = HM;
  const hft = f.part(limb(hbt, add(heye, rot([40, 0], hamA)), 76, 70, { steps: 8, capK: 0.3 }), { fill: P.wood, shadow: P.woodD, shade: 0.42, tex: 'wood' + seed, texOp: 0.6, inkW: 2.2, inkHeavy: 4 });
  W.bevel(f, hft, E.bbox([add(hbt, [-60, -60]), add(heye, [60, 60]), add(hbt, [60, 60]), add(heye, [-60, -60])]), 5, { lite: P.woodL });
  f.line([lp(hbt, heye, 0.05, 20), lp(hbt, heye, 0.9, 18)], 2, P.woodL, { op: 0.5 }); for (let i = 0; i < 5; i++) f.line([lp(hbt, heye, 0.1 + i * 0.12, -24 + i * 9), lp(hbt, heye, 0.2 + i * 0.12, -20 + i * 9)], 1.2, P.woodD, { op: 0.7 }); // grain and checks
  // butt cap and a leather wrap where the hand rides
  f.part(limb(add(hbt, rot([-24, 0], hamA)), add(hbt, rot([26, 0], hamA)), 88, 86, { steps: 2, capK: 0.3 }), IRN({ inkW: 2 })); f.rivet(hbt, 6, P.ironL);
  for (let i = 0; i < 6; i++) { const t = 0.08 + i * 0.045; f.line([lp(hbt, heye, t, -38), lp(hbt, heye, t + 0.03, 38)], 7, i % 2 ? P.leathD : P.leath, { straight: true }); }
  // langets: two iron straps from the head down the haft, riveted through
  for (const sg of [-1, 1]) { const a0 = lp(heye, hbt, 0.06, sg * 30), a1 = lp(heye, hbt, 0.5, sg * 30); f.part(limb(a0, a1, 18, 16, { steps: 4, capK: 0.3 }), IRN({ inkW: 1.6, cast: false })); for (const t of [0.3, 0.6, 0.9]) f.rivet(lerp(a0, a1, t), 4.4, P.ironL); }
  const HD = frame(HM, hamA, 1); // local x points from the haft into the head, y along the head's long axis
  // the far cheek and top showing past the near cheek: the block's depth
  const cheek = [[-112, -196, 1], [112, -196, 1], [120, -174, 1], [98, -92], [90, 0], [98, 92], [120, 174, 1], [112, 196, 1], [-112, 196, 1], [-120, 174, 1], [-98, 92], [-90, 0], [-98, -92], [-120, -174, 1]];
  const depth = HD(cheek).map(q => [q[0] + 22, q[1] - 18, q[2] || 0]);
  f.part(depth, IRN({ fill: '#1e1b18', inkW: 2.4, inkHeavy: 5 }));
  const hdP = HD(cheek);
  const hdd = f.part(hdP, IRN({ fill: '#3a3530', light: '#7a746c', inkW: 2.6, inkHeavy: 6, k: 0.7 }));
  W.bevel(f, hdd, E.bbox(hdP), 10, { lite: '#9a948a', lite2: '#c8c2b8' });
  W.clipDraw(f, hdP, () => {
    W.lichtenberg(f, HD([[-40, -150]])[0], hamA + 1.3, 260, 4, { metal: true, depth: 3 });
    W.scorch(f, HD([[30, 100]])[0], 90, 80, 0.5);
    for (let i = 0; i < 5; i++) f.line(HD([[-100, -130 + i * 60], [100, -126 + i * 60 + (i % 2 ? 8 : -4)]]), 2, '#6a645c', { op: 0.35 }); // forge laps
    for (const [x, y, r] of [[-40, -60, 26], [50, 40, 20], [-30, 120, 18], [60, -130, 14]]) { const c = HD([[x, y]])[0], e = ell(c, r, r * 0.7, hamA, 12); f.flat(e, '#000', { op: 0.25 }); f.line(e.slice(1, 7), 2, '#9a948a', { op: 0.6 }); } // dents from old blows
    f.line(HD([[-112, 150], [-80, 140], [-60, 158], [-30, 146]]), 3, INK, { op: 0.7 }); f.line(HD([[-80, 140], [-70, 120]]), 2, INK, { op: 0.6 }); // a crack in the cheek
  });
  // the striking faces: mushroomed rims, burrs curling over the cheek edge, chips; the upper face is stained
  for (const sy of [-1, 1]) {
    const lip = HD([[-124, sy * 182], [124, sy * 182], [130, sy * 206], [96, sy * 214], [40, sy * 208], [-20, sy * 216], [-80, sy * 210], [-130, sy * 206]]).map(q => [q[0], q[1], 1]);
    const ld = f.part(lip, IRN({ fill: '#4e4844', light: '#a8a098', inkW: 2.2, cast: false }));
    W.bevel(f, ld, E.bbox(lip), 5, { lite: '#b8b0a6' });
    for (const x of [-100, -40, 30, 90]) f.part(HD([[x, sy * 206], [x + 16, sy * 224], [x + 28, sy * 208]]), IRN({ fill: '#5a544e', inkW: 1.3, cast: false })); // burrs
    f.flat(HD([[-60, sy * 210], [-44, sy * 218], [-30, sy * 209]]), '#120e0c'); // chip
  }
  f.flat(HD([[-122, 206], [128, 206], [110, 214], [-120, 214]]), '#5a120a', { op: 0.8 });
  f.spatter(HD([[0, 212]])[0], 70, 30);
  for (const x of [-60, 20, 80]) f.stroke(HD([[x, 186], [x + 2, 166], [x - 1, 150]]), 5, '#4a0e08', { op: 0.7 }); // the striking face leads the swing
  f.flat(HD([[-122, -206], [128, -206], [110, -214], [-120, -214]]), '#c8c0b0', { op: 0.35 }); // the back face worn bright
  // the eye: the haft's end through the head with an iron wedge, rivets of the langet collar
  f.part(HD([[-150, -44], [-112, -44], [-112, 44], [-150, 44]]).map(q => [q[0], q[1], 1]), { fill: P.woodD, shade: 0.4, tex: 'wood' + seed, inkW: 1.8, cast: false });
  f.part(HD([[-156, -10], [-118, -14], [-118, 14], [-156, 10]]).map(q => [q[0], q[1], 1]), IRN({ inkW: 1.4, cast: false }));
  W.rivetRow(f, HD([[106, -60]])[0], HD([[106, 60]])[0], 3, 6, P.ironL);
  W.glow(f, HD([[0, 200]])[0], 110, 40, P.arcG, 0.2);

  // ================= far arm: down to the anvil, behind the chest
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [220, 190]), IRN({ inkW: 2.4 }));
  W.cylinder(f, lerp(SF, EF, 0.16), lerp(SF, EF, 0.86), 228, 196, BRS(), { p: [[0.4, 0.08, 0.25]], flanges: [[0.96, 206]] });
  f.bone('forearm_f');
  f.part(K.chain([EF, WF], [190, 160]), IRN({ inkW: 2.4 }));
  W.hinge(f, EF, 64);
  W.cylinder(f, lerp(EF, WF, 0.26), lerp(EF, WF, 0.92), 196, 168, BRZ({ fill: '#6a4a2a' }), { flanges: [[0.04, 206], [0.96, 178]] });
  W.clipDraw(f, limb(lerp(EF, WF, 0.26), lerp(EF, WF, 0.92), 196, 168), () => { W.scorch(f, lerp(EF, WF, 0.6), 70, 50, 0.55); W.lichtenberg(f, lerp(EF, WF, 0.3), ang(EF, WF) + 0.4, 120, 3, { metal: true, depth: 2 }); });
  const cop = [lp(EF, WF, -0.24, -110), lp(EF, WF, -0.34, 0), lp(EF, WF, -0.2, 112), lp(EF, WF, 0.2, 104), lp(EF, WF, 0.26, 0), lp(EF, WF, 0.2, -104)];
  W.bplate(f, cop, BRZ({ inkW: 2.2, inkHeavy: 4, k: 0.7 }), { bev: 8, dents: [[lp(EF, WF, -0.08, 30), 18]] });
  f.line([lp(EF, WF, -0.3, 0), lp(EF, WF, 0.22, 4)], 3, P.bronzeP, { op: 0.5 });

  // ================= torso: the iron body under the plates
  f.bone('torso');
  const core = S.shape(prof);
  f.part(core, IRN({ k: 0.85, inkW: 2.6, inkHeavy: 7, shade: 0.5 }));
  // the exposed waist: corded iron cables like muscle between the ribcage and the girdle
  W.clipDraw(f, core, () => {
    for (let i = 0; i < 16; i++) { const u = -0.72 + i * 0.105; f.part(limb(S.at(u, 0.58), S.at(u + 0.03, 0.76), 28, 30, { steps: 4, p: [[0.5, 0.25, 0.3]], q: [[0.5, 0.25, 0.3]] }), IRN({ fill: i % 2 ? '#3a3530' : '#2c2824', inkW: 1.4, cast: false })); }
    W.glow(f, S.at(0.3, 0.66), 200, 40, P.lamp, 0.2);
  });

  // back plate over the lats: one great curved plate following the back from the hump to the waist
  const bpE = []; for (let i = 0; i <= 10; i++) { const v = 0.06 + i * 0.06; bpE.push(S.at(-back(v) + 0.03, v)); }
  const bpF = []; for (let i = 10; i >= 0; i--) { const v = 0.06 + i * 0.06; bpF.push(S.at(-0.32 + Math.sin(i / 10 * Math.PI) * 0.12, v)); }
  const bp = [[...bpE[0], 1], ...bpE.slice(1, -1), [...bpE[10], 1], [...bpF[0], 1], ...bpF.slice(1, -1), [...bpF[10], 1]];
  W.bplate(f, bp, BRS({ k: 0.8, inkW: 2.4, inkHeavy: 6 }), { bev: 10, scorch: [[S.at(-0.7, 0.4), 120, 180, 0.6]], dents: [[S.at(-0.6, 0.48), 24, 0.3], [S.at(-0.45, 0.26), 16]], scr: [[S.at(-0.5, 0.36), 60, 12]],
    lich: [[S.at(-0.5, 0.12), 1.7, 380, 5.4, 3]], heat: [[bpF.slice(2, 9), 14]] });
  // a riveted repair patch on the back plate, and a steam valve
  const rp = [S.at(-0.64, 0.5), S.at(-0.4, 0.49), S.at(-0.39, 0.6), S.at(-0.64, 0.61)];
  W.bplate(f, rp.map(q => [q[0], q[1], 1]), BRZ({ fill: '#8a6a40', inkW: 1.8, cast: false }), { bev: 5, rivets: [[add(rp[0], [12, 12]), add(rp[1], [-12, 12]), 4, 4.4], [add(rp[3], [12, -12]), add(rp[2], [-12, -12]), 4, 4.4]] });
  const vv = S.at(-0.78, 0.3);
  f.part(limb(vv, add(vv, [-50, -14]), 34, 30, { steps: 3, capK: 0.3 }), IRN({ inkW: 1.8 })); f.part(ell(add(vv, [-54, -15]), 12, 22, -0.3, 10), IRN({ fill: P.ironL, inkW: 1.6, cast: false }));
  W.smoke(f, add(vv, [-60, -26]), 160, 34, { sway: 20, drift: -50, op: 0.3 });

  // belly lames: four bands bowed round the gut, each overlapping the one below; glowing seams between
  const lam = [[0.545, 0.64, -0.3, 1.3], [0.47, 0.565, -0.28, 1.4], [0.4, 0.49, -0.26, 1.5]];
  W.clipDraw(f, core, () => lam.forEach(([v0, v1, u0, u1], i) => {
    const pts = band(v0, v1, u0, u1 - 0.04, 0.055, 10);
    W.bplate(f, pts, (i % 2 ? BRS : BRZ)({ k: 0.85, inkW: 2.2, inkHeavy: 5 }), { bev: 8, scorch: [[S.at(-0.1, v1), 90, 30, 0.55], [S.at(0.9, v0 + 0.03), 60, 24, 0.4]], dents: i === 1 ? [[S.at(0.5, (v0 + v1) / 2 + 0.03), 16]] : null, heat: [[edge(v1 - 0.004, u0 + 0.05, u1 - 0.1, 0.055), 9]],
      rivets: [[S.at(u0 + 0.08, v0 + 0.03), S.at(u0 + 0.08, v1 - 0.015), 2, 5], [S.at(0.8, v0 + 0.03 + 0.055 * bow(0.8, 1.6)), S.at(0.8, v1 - 0.015 + 0.055 * bow(0.8, 1.6)), 2, 5]] });
    glowSeam(edge(v1 + 0.002, u0 + 0.12, front(v1) - 0.08, 0.055, 8), 3);
  }));
  f.line(core.slice(2, 10), 2.8, INK); // the belly's own outline over the clipped lame ends
  // assembly marks scratched into the lames (the foundry's numbering)
  for (const [u, v, n] of [[0.2, 0.59, 3], [0.2, 0.515, 2]]) { const c = S.at(u, v + 0.055 * bow(u, 1.6)); for (let k = 0; k < n; k++) f.line([add(c, [k * 9, -9]), add(c, [k * 9 + 2, 9])], 2.2, P.bronzeP, { op: 0.6, straight: true }); }

  // rib lames down the flank under the near arm: three arched plates, overlapping downward
  for (let i = 2; i >= 0; i--) {
    const v0 = 0.2 + i * 0.075, v1 = v0 + 0.11, pts = [];
    for (let k = 0; k <= 6; k++) { const t = k / 6; pts.push(S.at(-0.62 + t * 0.62, v0 - Math.sin(t * Math.PI) * 0.025 + t * 0.02)); }
    for (let k = 6; k >= 0; k--) { const t = k / 6; pts.push(S.at(-0.62 + t * 0.62 - 0.03, v1 - Math.sin(t * Math.PI) * 0.03 + t * 0.03)); }
    W.bplate(f, pts.map((q, j) => j === 0 || j === 6 || j === 7 || j === 13 ? [q[0], q[1], 1] : q), (i % 2 ? BRZ : BRS)({ k: 0.9, inkW: 2.2, inkHeavy: 5 }), { bev: 8, scorch: [[S.at(-0.5, v1), 80, 30, 0.6]], heat: [[pts.slice(8, 13), 8]], rivets: [[S.at(-0.5, v0 + 0.03), S.at(-0.1, v0 + 0.05), 4, 5]] });
  }
  // the weld: lightning fused the back plate to the rib lames
  W.weld(f, [S.at(-0.36, 0.2), S.at(-0.3, 0.27), S.at(-0.36, 0.34), S.at(-0.31, 0.4)], 9, { a: 2.6 });

  // the furnace plate in the solar plexus: three arched barred ports, the fire behind them
  const fpP = band(0.28, 0.4, -0.05, 1.27, 0.03, 10, { sagB: 1 });
  W.bplate(f, fpP, BRS({ k: 0.85, inkW: 2.4, inkHeavy: 5 }), { bev: 9, heat: [[edge(0.396, 0.05, 1.12, 0.03), 12]], rivets: [[S.at(0.0, 0.3), S.at(0.0, 0.38), 2, 5.4]] });
  for (const [u, w] of [[0.18, 0.2], [0.55, 0.22], [0.92, 0.18]]) {
    const vT = 0.305 + 0.03 * bow(u, 1.6), vB = 0.375 + 0.03 * bow(u, 1.6);
    const port = [S.at(u - w / 2, vB), S.at(u - w / 2, vT + 0.02), S.at(u - w * 0.3, vT), S.at(u, vT - 0.008), S.at(u + w * 0.3, vT), S.at(u + w / 2, vT + 0.02), S.at(u + w / 2, vB)];
    const frm = [S.at(u - w / 2 - 0.05, vB + 0.012), S.at(u - w / 2 - 0.05, vT + 0.015), S.at(u - w * 0.3, vT - 0.018), S.at(u, vT - 0.026), S.at(u + w * 0.3, vT - 0.018), S.at(u + w / 2 + 0.05, vT + 0.015), S.at(u + w / 2 + 0.05, vB + 0.012)];
    const fd = f.part(frm.map((q, j) => j === 0 || j === 6 ? [q[0], q[1], 1] : q), BRZ({ fill: '#8e6a3e', inkW: 2, cast: false })); W.bevel(f, fd, E.bbox(frm), 5);
    W.furnace(f, port.map((q, j) => j === 0 || j === 6 ? [q[0], q[1], 1] : q), { coals: 6, glowOp: 0.45 });
    for (let k = 1; k < 5; k++) { const uu = u - w / 2 + k * w / 5; f.part(limb(S.at(uu, vT - 0.012), S.at(uu, vB + 0.004), 12, 12, { steps: 3, capK: 0.2 }), IRN({ inkW: 1.6, cast: false })); }
  }
  W.glow(f, S.at(0.55, 0.34), 300, 90, P.lamp, 0.22, true);

  // pectoral plates: the far one foreshortened past the keel, then the near one, both domed with rolled lower edges
  const pec = (u0, u1, v0, v1, dark, o = {}) => {
    const pts = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8, u = u0 + (u1 - u0) * t; pts.push(S.at(u, v0 + Math.sin(t * Math.PI) * -0.012)); }
    for (let k = 8; k >= 0; k--) { const t = k / 8, u = u0 + (u1 - u0) * t; pts.push(S.at(u, v1 + Math.sin(t * Math.PI * 0.9 + 0.2) * 0.075)); }
    return W.bplate(f, pts.map((q, j) => j === 0 || j === 17 ? [q[0], q[1], 1] : q), (dark ? BRS : BRZ)({ k: 0.9, inkW: 2.4, inkHeavy: 6, shade: 0.5 }), Object.assign({ bev: 11 }, o)) && pts;
  };
  const pecF = pec(0.8, 1.3, 0.08, 0.27, true, { scorch: [[S.at(1.2, 0.24), 50, 60, 0.6]], heat: [], rivets: [[S.at(0.86, 0.1), S.at(1.2, 0.12), 3, 5]] });
  W.heatTint(f, pecF.slice(10, 17), 8);
  const pecN = pec(-0.18, 0.86, 0.06, 0.25, false, { scorch: [[S.at(0.0, 0.2), 110, 70, 0.55], [S.at(0.6, 0.27), 70, 30, 0.45]], dents: [[S.at(0.15, 0.14), 26, 0.4], [S.at(0.45, 0.2), 14]], scr: [[S.at(0.3, 0.12), 70, 16]], rivets: [[S.at(-0.1, 0.085), S.at(0.75, 0.075), 7, 5.4]] });
  // the rolled lower rim of the near pec, heat-tinted over the furnace plate's seam
  const rim = pecN.slice(10, 17);
  f.stroke(rim.map(q => add(q, [0, -4])), 22, '#1a120a', { op: 0.5 }); f.line(rim.map(q => add(q, [2, -12])), 5, P.bronzeP, { op: 0.45 });
  W.heatTint(f, rim.map(q => add(q, [0, -6])), 9);
  glowSeam(edge(0.4, 0.05, 1.1, 0.03, 9), 3.4);
  glowSeam([S.at(-0.12, 0.27), S.at(0.3, 0.29), S.at(0.7, 0.3)], 3);
  // the strike crater on the near pec: a burnt-through pit with a fused rim, the burn fanning out from it
  const cr = S.at(0.12, 0.15);
  W.clipDraw(f, core, () => { W.lichtenberg(f, cr, 2.8, 150, 4, { metal: true, depth: 3 }); W.lichtenberg(f, cr, 0.6, 120, 3.4, { metal: true, depth: 2 }); });
  f.flat(W.lumpy(f, ell(cr, 26, 20, 0.3, 12), 6), '#0a0605'); f.line(ell(cr, 26, 20, 0.3, 12).concat([ell(cr, 26, 20, 0.3, 12)[0]]), 5, mix(P.bronze, '#000', 0.2)); f.line(ell(cr, 24, 18, 0.3, 12).slice(1, 6), 3, P.arcG, { op: 0.7 });
  W.glow(f, cr, 20, 16, P.lamp, 0.4);

  // the sternum keel and the Tooth: a pale shard of stone riveted into a seat plate as the maker's seal
  f.line([S.at(0.84, 0.07), S.at(0.85, 0.16), S.at(0.83, 0.27)], 7, INK, { op: 0.8 }); f.line([S.at(0.81, 0.07), S.at(0.82, 0.16), S.at(0.8, 0.26)], 3, P.bronzeP, { op: 0.5 });
  const T0 = S.at(0.84, 0.15);
  const seat = [add(T0, [-62, -56]), add(T0, [58, -60]), add(T0, [66, 58]), add(T0, [-58, 64])].map(q => [q[0], q[1], 1]);
  W.bplate(f, seat, BRS({ inkW: 2.2, cast: true }), { bev: 6 });
  const tooth = [add(T0, [-6, -50]), add(T0, [20, -30]), add(T0, [24, 8]), add(T0, [6, 52]), add(T0, [-10, 24]), add(T0, [-18, -16])];
  f.part(tooth, { fill: '#d8d0bc', shadow: '#7a7262', light: '#f4efe2', shade: 0.4, inkW: 2, cast: false, hatch: false, k: 0.5 });
  f.line([add(T0, [-4, -46]), add(T0, [6, 0]), add(T0, [4, 46])], 1.6, '#9a9282', { op: 0.7 }); f.line([add(T0, [8, -10]), add(T0, [16, 4])], 1.2, '#6a6252', { op: 0.7 });
  for (const sg of [-1, 1]) { f.part([add(T0, [sg * 74, -14]), add(T0, [sg * 12, -10]), add(T0, [sg * 12, 8]), add(T0, [sg * 74, 12])].map(q => [q[0], q[1], 1]), IRN({ inkW: 1.8, cast: false })); f.rivet(add(T0, [sg * 54, -1]), 7, P.ironL); }
  for (const q of [[-50, -44], [48, -48], [54, 46], [-48, 50]]) f.rivet(add(T0, q), 6, P.bronzeL);

  // gorget: three lames round the neck, stepping down onto the chest
  for (let i = 2; i >= 0; i--) {
    const v0 = -0.05 + i * 0.04, pts = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(S.at(-0.5 + t * 1.12 - i * 0.04, v0 + Math.sin(t * Math.PI) * 0.03)); }
    for (let k = 8; k >= 0; k--) { const t = k / 8; pts.push(S.at(-0.5 + t * 1.12 - i * 0.04, v0 + 0.06 + Math.sin(t * Math.PI) * 0.035)); }
    W.bplate(f, pts.map((q, j) => j === 0 || j === 8 || j === 9 || j === 17 ? [q[0], q[1], 1] : q), (i % 2 ? BRS : BRZ)({ k: 0.9, inkW: 2, inkHeavy: 4 }), { bev: 6, rivets: [[S.at(-0.36 - i * 0.04, v0 + 0.03), S.at(0.5 - i * 0.04, v0 + 0.035), 5, 4.6]] });
  }

  // girdle and faulds: a heavy riveted belt across the waist, three lames flaring over the hips, cut by the frame
  const hips = S.shape([[0.7, 0.82, 0.92], [0.8, 0.95, 1.04], [0.92, 1.06, 1.14], [1.06, 1.12, 1.2]]);
  W.clipDraw(f, hips, () => { for (let i = 1; i >= 0; i--) {
    const v0 = 0.75 + i * 0.12, pts = band(v0, v0 + 0.15, -1.3, 1.4, 0.06, 12);
    W.bplate(f, pts, (i % 2 ? BRZ : BRS)({ k: 0.9, inkW: 2.2, inkHeavy: 5 }), { bev: 9, scorch: [[S.at(0.2, v0 + 0.1), 180, 40, 0.5]], heat: [[edge(v0 + 0.145, -0.9, 1.0, 0.06), 9]], rivets: [[S.at(-0.6, v0 + 0.04), S.at(0.8, v0 + 0.04 + 0.06 * bow(0.8, 1.6)), 6, 6]], dents: i === 1 ? [[S.at(-0.2, v0 + 0.08), 22]] : [[S.at(0.6, v0 + 0.1), 16]] });
  } });
  f.line(hips.slice(1, 4), 2.8, INK); f.line(hips.slice(5, 8), 2.8, INK);
  const gird = band(0.665, 0.765, -back(0.7) - 0.04, front(0.7) + 0.05, 0.05, 10);
  W.bplate(f, gird, IRN({ fill: '#3a342e', k: 0.9, inkW: 2.4, inkHeavy: 6 }), { bev: 7, bevO: { lite: '#9a948a' }, rivets: [[S.at(-0.66, 0.715), S.at(0.88, 0.715 + 0.05 * bow(0.88, 1.6)), 9, 6.4]] });
  glowSeam(edge(0.665, -0.6, 0.86, 0.05, 9), 3.6);
  // a broken shackle chain still hanging from the girdle's ring
  const ring = S.at(-0.32, 0.765 + 0.05 * bow(-0.32, 1.6));
  const rg = ell(ring, 18, 22, 0, 12); f.line(rg.concat([rg[0]]), 10, INK); f.line(rg.concat([rg[0]]), 6, P.ironL);
  W.chainLinks(f, [add(ring, [0, 20]), add(ring, [-6, 120]), add(ring, [4, 240])], 34, P.iron);

  // ================= the helm: faceless bronze great helm, keeled, a jutting brow over a single white slit
  f.bone('head');
  f.part(limb(N, add(HC, rot([-20, 120], hA)), 230, 200, { steps: 4 }), IRN({ inkW: 2.2 })); // the iron neck
  const hF = frame(HC, hA, 1);
  // aventail: three flared lames under the helm, behind it
  for (let i = 2; i >= 0; i--) { const y0 = 120 + i * 34, w0 = 150 + i * 18; const pts = hF([[-w0, y0], [w0 * 0.72, y0 - 6], [w0 * 0.8, y0 + 46], [-w0 - 10, y0 + 50]]).map(q => [q[0], q[1], 1]); W.bplate(f, pts, (i % 2 ? BRS : BRZ)({ inkW: 2, inkHeavy: 4 }), { bev: 5, rivets: [[hF([[-w0 + 30, y0 + 24]])[0], hF([[w0 * 0.6, y0 + 20]])[0], 5, 4.4]] }); }
  const helm = hF([[-136, -58], [-122, -128], [-74, -168, 1], [0, -180], [62, -166], [108, -128], [128, -86, 1], [134, -64, 1], [114, -46, 1], [118, -10], [132, 50], [136, 96, 1], [114, 134], [80, 166, 1], [-24, 168], [-112, 150], [-142, 90], [-146, 10]]);
  const hd = f.part(helm, BRZ({ shade: 0.5, inkW: 2.6, inkHeavy: 7, k: 0.8 }));
  W.bevel(f, hd, E.bbox(helm), 11);
  // the face plane: a narrow strip right of the keel, turned toward the light
  const facePl = hF([[96, -140], [108, -128], [128, -86, 1], [134, -64, 1], [114, -46, 1], [118, -10], [132, 50], [136, 96, 1], [114, 134], [96, 150], [86, 60], [84, -40]]);
  W.clipDraw(f, helm, () => {
    f.flat(facePl, '#b88a52', { op: 0.35 });
    W.scorch(f, hF([[-70, -60]])[0], 80, 110, 0.6); W.scorch(f, hF([[20, 130]])[0], 80, 40, 0.5);
    W.lichtenberg(f, hF([[-40, -168]])[0], hA + 1.9, 280, 4.4, { metal: true, depth: 3 });
    W.heatTint(f, hF([[-10, -34], [70, -36], [128, -40]]), 12);
    for (const [x, y, r] of [[-60, 70, 26], [40, -130, 18]]) W.dent(f, hF([[x, y]])[0], r, hA);
    f.scratches(hF([[-80, 20]])[0], 50, 10, P.bronzeP, 1.1, -0.9);
    W.verdigris(f, hF([[-128, 60]])[0], 12, 50, 0.3);
  });
  f.line(hF([[92, -150], [86, -40], [88, 60], [104, 152]]), 4, INK, { op: 0.7 }); f.line(hF([[100, -146], [96, -40], [98, 60], [110, 146]]), 2.4, P.bronzeP, { op: 0.55 }); // the keel
  // the low comb along the crown, riveted
  const comb = hF([[-120, -126], [-70, -186], [0, -198], [70, -180], [104, -140], [96, -130], [62, -162], [0, -176], [-66, -164], [-110, -118]]);
  const cd = f.part(comb, BRZ({ fill: '#94703e', inkW: 2, cast: false, k: 0.8 })); W.bevel(f, cd, E.bbox(comb), 4);
  W.rivetRow(f, hF([[-90, -150]])[0], hF([[70, -168]])[0], 6, 4.4, P.bronzeL, { fused: 0.3 });
  // the riveted band down the side where the two halves of the helm were joined, and the brow band
  const sideB = hF([[-24, -172], [8, -174], [12, 160], [-20, 162]]).map(q => [q[0], q[1], 1]);
  W.bplate(f, sideB, BRS({ inkW: 1.8, cast: false }), { bev: 4, rivets: [[hF([[-6, -150]])[0], hF([[-4, 146]])[0], 8, 5]] });
  // the jutting brow: a heavy ridge over the slit casting it into shadow
  const brow = hF([[-30, -96], [60, -102], [132, -92, 1], [140, -60, 1], [116, -56], [40, -62], [-30, -66]]);
  W.bplate(f, brow, BRZ({ fill: '#8e6a3c', inkW: 2.2, cast: true }), { bev: 6, rivets: [[hF([[-10, -82]])[0], hF([[96, -86]])[0], 4, 4.6]] });
  f.flat(hF([[-30, -62], [116, -54], [118, -42], [-26, -50]]), '#000', { op: 0.45 }); // the brow's shadow
  // the slit: a long cut from the side round onto the face, white light bleeding out of it
  const slit = hF([[10, -30], [118, -36], [124, -20], [16, -16]]).map(q => [q[0], q[1], 1]);
  f.raw(`<path d="${E.smooth(slit)}" fill="${P.arc}" opacity="0.7" filter="url(#glowL${seed})"/>`);
  f.flat(slit, '#120c08');
  f.flat(hF([[22, -27], [116, -31], [118, -24], [24, -21]]).map(q => [q[0], q[1], 1]), P.arc);
  f.line(hF([[30, -24], [112, -28]]), 2, '#ffffff');
  f.flat(hF([[16, -16], [124, -20], [124, -8], [18, -4]]).map(q => [q[0], q[1], 1]), P.arcG, { op: 0.28 });
  // breathing holes drilled in rows on the jaw plate, following its curve
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const q = hF([[48 + c * 20 + r * 4, 40 + r * 24]])[0]; f.flat(ell(q, 5, 6.4, hA, 8), '#0a0706'); f.flat(ell(add(q, [1, 3]), 3, 2, hA, 6), P.ember, { op: 0.6 }); }
  // a riveted boss where the visor hinges, and a fused run from the brow
  const boss = hF([[-70, -10]])[0]; const bsd = f.part(ell(boss, 30, 30, 0, 14), BRZ({ fill: '#94703e', inkW: 2, cast: false })); W.bevel(f, bsd, [boss[0] - 30, boss[1] - 30, boss[0] + 30, boss[1] + 30], 4); f.rivet(boss, 8, P.bronzeL);
  W.fusedRun(f, hF([[124, -50]])[0], 54, 8);
  W.ash(f, hF([[-60, -190]])[0], 14, 200, 220, 2.4);

  // ================= near arm, raised: the elbow back and up, the fist by the crown, nothing across the helm
  f.bone('upperarm_n');
  f.part(K.chain([SN, EN], [250, 214]), IRN({ inkW: 2.4 }));
  W.cylinder(f, lerp(SN, EN, 0.3), lerp(SN, EN, 0.84), 250, 214, BRZ(), { p: [[0.45, 0.1, 0.25]], q: [[0.35, 0.06, 0.25]], flanges: [[0.97, 226]] });
  W.clipDraw(f, limb(lerp(SN, EN, 0.3), lerp(SN, EN, 0.84), 250, 214), () => { W.scorch(f, lerp(SN, EN, 0.55), 90, 60, 0.55); W.lichtenberg(f, lp(SN, EN, 0.32, -60), ang(SN, EN) - 0.4, 200, 3.6, { metal: true, depth: 3 }); W.dent(f, lp(SN, EN, 0.6, 40), 20, ang(SN, EN)); });
  // banded lames round the upper arm, showing it is round
  for (const t of [0.46, 0.62]) { const a0 = lp(SN, EN, t, -120), a1 = lp(SN, EN, t + 0.03, 0), a2 = lp(SN, EN, t, 118); f.line([a0, a1, a2], 4, INK, { op: 0.7 }); f.line([a0, a1, a2].map(q => add(q, [3, -5])), 2, P.bronzeP, { op: 0.4 }); }
  f.bone('forearm_n');
  f.part(K.chain([EN, WN], [206, 172]), IRN({ inkW: 2.4 }));
  W.hinge(f, EN, 70);
  W.cylinder(f, lerp(EN, WN, 0.24), lerp(EN, WN, 0.84), 206, 176, BRS(), { flanges: [[0.03, 218], [0.97, 186]] });
  W.clipDraw(f, limb(lerp(EN, WN, 0.24), lerp(EN, WN, 0.84), 206, 176), () => { W.scorch(f, lerp(EN, WN, 0.5), 60, 70, 0.5); W.heatTint(f, [lp(EN, WN, 0.82, -80), lp(EN, WN, 0.84, 0), lp(EN, WN, 0.82, 80)], 10); });
  glowSeam([lp(EN, WN, 0.5, -88), lp(EN, WN, 0.52, 0), lp(EN, WN, 0.5, 86)], 3);
  // the couter: a faceted elbow cop with a fan wing
  // the couter: a faceted cop pointing out of the elbow, a ridge from its point, a fan wing on the outside
  const eo = E.norm(add(E.norm(sub(EN, SN)), E.norm(sub(EN, WN)))), CF = frame(EN, Math.atan2(eo[1], eo[0]), 1);
  const wing = CF([[-20, 96, 1], [70, 150, 1], [96, 120, 1], [40, 70, 1]]);
  W.bplate(f, wing, BRS({ inkW: 2, inkHeavy: 4 }), { bev: 5, rivets: [[CF([[30, 92]])[0], CF([[60, 116]])[0], 2, 4.4]] });
  const cn = CF([[-70, -96, 1], [40, -92, 1], [128, -6, 1], [40, 88, 1], [-70, 94, 1], [-96, 0, 1]]);
  W.bplate(f, cn, BRZ({ inkW: 2.4, inkHeavy: 5 }), { bev: 8, dents: [[CF([[10, 40]])[0], 18]], scr: [[CF([[0, -30]])[0], 40, 8]] });
  f.line(CF([[-90, 0], [124, -4]]), 3.4, INK, { op: 0.7 }); f.line(CF([[-86, -6], [118, -10]]), 2, P.bronzeP, { op: 0.6 });
  f.flat(CF([[-68, 4], [120, 0], [40, 84], [-68, 90]]), '#000', { op: 0.22 });
  for (const q of CF([[-50, -70], [-50, 70]])) f.rivet(q, 5, P.bronzeL);
  // the near pauldron belongs to the torso: arched lames over the shoulder dome, a standing haute-piece by the neck
  f.bone('torso');
  const PC = add(SN, [-40, -96]), PF = frame(PC, -0.5, 0.86);
  for (let i = 1; i >= 0; i--) {
    const y0 = 70 + i * 50, w0 = 196 - i * 6;
    const pts = PF([[-w0, y0 + 40, 1], [-w0 * 0.72, y0 - 6], [0, y0 - 24], [w0 * 0.72, y0 - 6], [w0, y0 + 40, 1], [w0 * 0.96, y0 + 78, 1], [0, y0 + 56], [-w0 * 0.96, y0 + 78, 1]]);
    W.bplate(f, pts, (i % 2 ? BRS : BRZ)({ k: 0.9, inkW: 2.4, inkHeavy: 5 }), { bev: 8, scorch: [[PF([[-w0 * 0.4, y0 + 40]])[0], w0 * 0.5, 40, 0.5]], heat: [[PF([[-w0 * 0.9, y0 + 74], [0, y0 + 54], [w0 * 0.9, y0 + 74]]), 8]], rivets: [[PF([[-w0 * 0.78, y0 + 44]])[0], PF([[w0 * 0.78, y0 + 44]])[0], 6, 5]] });
  }
  const cap = PF([[-212, 70, 1], [-170, -40], [-90, -100], [20, -116], [130, -90], [200, -20], [216, 70, 1], [190, 110], [0, 92], [-190, 110]]);
  W.bplate(f, cap, BRZ({ k: 0.9, inkW: 2.6, inkHeavy: 6, shade: 0.5 }), { bev: 12, scorch: [[PF([[-60, -20]])[0], 130, 70, 0.6]], dents: [[PF([[60, -30]])[0], 22, -0.4], [PF([[-120, 30]])[0], 16]], scr: [[PF([[0, 0]])[0], 90, 14]],
    lich: [[PF([[-180, 40]])[0], -0.6, 320, 5, 3]], rivets: [[PF([[-180, 84]])[0], PF([[180, 84]])[0], 8, 6]] });
  f.line(PF([[-150, -30], [-60, -88], [40, -100], [140, -64]]), 5, '#f0d8a8', { op: 0.35 });
  const haute = PF([[90, -84], [120, -176], [168, -170], [200, -24], [160, -40]]);
  W.bplate(f, haute, BRS({ inkW: 2.2, k: 0.6 }), { bev: 6, rivets: [[PF([[140, -60]])[0], PF([[150, -150]])[0], 3, 4.6]] });
  W.weld(f, [PF([[-200, 64]])[0], PF([[-206, 110]])[0], PF([[-196, 150]])[0]], 9, { a: 3.4 }); // the bolt fused the cap to the lame below
  glowSeam(PF([[-180, 196], [0, 178], [180, 196]]), 3);
  // the fist on the haft: articulated gauntlet, knuckles toward the elbow side, thumb toward the head
  f.bone('hand_n');
  W.gauntletGrip(f, WN, EN, hamA, 132, BRZ({ fill: '#86603a' }), { name: 'titan hammer', maxBend: 40 });

  // ================= arcs crawling between the rod's tip and the hammer head (FX, on its own bone)
  f.bone('arcs');
  // consistency pass 2026-11-25: the arcs are an FX layer (out/worlds/world_V_anvil_titan_fx.*), the sparks stay
  fxCapture(f, () => {
    W.bolt(f, lerp(spB, spT, 0.97), HD([[-40, 214]])[0], { w: 4.4, forks: 4, jit: 0.34, bloomOp: 0.25 });
    W.bolt(f, lerp(spB, spT, 0.9), HD([[80, 200]])[0], { w: 2.4, forks: 2, jit: 0.45, bloomOp: 0.12 });
    W.bolt(f, lerp(spB, spT, 0.99), add(spT, [40, -40]), { w: 1.8, forks: 2, jit: 0.5, bloom: false });
  });
  W.sparks(f, HD([[-40, 214]])[0], 14, 70, { ang: -Math.PI / 2, spread: 2.4, s: 2 });

  // ================= the great anvil in front, on its block, and what is on it (root: it does not move)
  f.bone('root');
  const anv = [[1120, ANV + 30], [1170, ANV + 2], [1250, ANV - 2], [1640, ANV - 8], [1640, ANV + 70], [1520, ANV + 96], [1440, ANV + 130], [1410, ANV + 230], [1180, ANV + 230], [1200, ANV + 130], [1210, ANV + 76], [1150, ANV + 56]];
  const ad = f.part(anv.map((q, i) => i > 2 ? [q[0], q[1], 1] : q), IRN({ fill: '#2a2826', shadow: '#0a0908', inkW: 2.6, inkHeavy: 6, k: 0.7 }));
  W.bevel(f, ad, E.bbox(anv), 8, { lite: '#8a847c' });
  W.clipDraw(f, anv, () => {
    f.flat([[1170, ANV + 2], [1640, ANV - 8], [1640, ANV + 16], [1170, ANV + 22]], '#6a6662', { op: 0.8 }); // the worn bright face
    f.line([[1180, ANV + 5], [1630, ANV - 4]], 2, '#c8c2b8', { op: 0.7 });
    W.scorch(f, [1320, ANV + 160], 120, 80, 0.5);
    for (const [x, l] of [[1290, 120], [1350, 190], [1420, 80]]) f.stroke([[x, ANV + 14], [x + 3, ANV + l * 0.5], [x + 1, ANV + l]], 8, '#5a120a', { op: 0.85 }); // blood running down the waist
    W.lichtenberg(f, [1300, ANV + 60], 1.2, 160, 3, { metal: true, depth: 2 });
  });
  f.part([[1100, ANV + 228], [1540, ANV + 228], [1560, 1640], [1080, 1640]].map(q => [q[0], q[1], 1]), { fill: '#3a3632', shadow: '#121010', shade: 0.4, tex: 'pit' + seed, texOp: 0.6, inkW: 2.2 }); // block
  // the knight: a breastplate and helm hammered flat, a mail sleeve hanging over the edge, blood
  f.part([[1250, ANV - 2], [1262, ANV - 46], [1350, ANV - 60], [1440, ANV - 40], [1458, ANV - 2]].map(q => [q[0], q[1], 1]), { fill: '#6a6e72', shadow: '#222428', shade: 0.4, inkW: 2, k: 0.7 });
  f.line([[1270, ANV - 30], [1350, ANV - 46], [1430, ANV - 30]], 2, '#b8bcc0', { op: 0.6 });
  f.part([[1470, ANV - 2], [1480, ANV - 34], [1540, ANV - 42], [1590, ANV - 26], [1600, ANV - 2]].map(q => [q[0], q[1], 1]), { fill: '#7a7e84', shadow: '#222428', shade: 0.4, inkW: 2, k: 0.7 });
  f.flat([[1496, ANV - 20], [1570, ANV - 24], [1570, ANV - 16], [1496, ANV - 13]], '#0a0808');
  f.part(K.chain([[1250, ANV + 4], [1226, ANV + 60], [1232, ANV + 130]], [44, 38, 34]), { fill: '#5a5e62', shadow: '#1a1c1e', shade: 0.4, tex: 'pit' + seed, texOp: 0.7, inkW: 1.8 }); // mail sleeve
  f.part(ell([1234, ANV + 150], 22, 26, 0.2, 10), { fill: '#6a6e72', shadow: '#222428', shade: 0.4, inkW: 1.8 }); // its gauntlet, open
  f.flat([[1240, ANV - 2], [1610, ANV - 8], [1620, ANV + 8], [1230, ANV + 10]], '#6a120a', { op: 0.85 });
  f.spatter([1380, ANV - 20], 130, 40);

  // ================= the far fist last: knuckles down, pinning the knight to the anvil
  f.bone('hand_f');
  W.gauntlet(f, WF, ang(EF, WF), 124, true, BRZ({ fill: '#74522e' }));
  W.scorch(f, add(WF, [20, 20]), 70, 50, 0.4);
  return f;
}
// a soft band along a polyline (a hanging mail sleeve)
function chainBand(pts, w) { return K.chain(pts, pts.map(() => w)); }

module.exports = {
  heroes: [
    { key: 'anvil_titan', name: 'The Anvil Titan', tier: 'ruler', w: 1600, h: 1600, flip: true, build: anvilTitan },
    { key: 'spark_swarm', name: 'Spark Swarm', tier: 'small', w: 600, h: 820, flip: true, build: sparkSwarm },
    { key: 'bellows_imp', name: 'Bellows Imp', tier: 'small', w: 600, h: 820, flip: true, build: bellowsImp },
    { key: 'sparkblind_smith', name: 'The Sparkblind Smith', tier: 'elite', w: 1100, h: 1400, flip: true, build: sparkblindSmith },
    { key: 'talos_sentinel', name: 'Talos Sentinel', tier: 'elite', w: 1100, h: 1400, flip: true, build: talosSentinel },
    { key: 'bronze_automaton', name: 'Bronze Automaton', tier: 'large', w: 900, h: 1100, flip: true, build: bronzeAutomaton },
    { key: 'arc_smith', name: 'Arc-Smith', tier: 'human', w: 600, h: 820, flip: true, build: arcSmith },
    { key: 'slag_slave', name: 'Slag Slave', tier: 'human', w: 600, h: 820, flip: true, build: slagSlave },
  ],
};
