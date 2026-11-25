// World I, The Drowned Kingdom (Water + Void): batch c. Eight cast foes, built facing right and mirrored (foes face left).
// Every figure is rigged from the start: joints first, then f.bone() before each part.
'use strict';
const K = require('../kit');
const KI = require('./kit_I_c');
const { E, B, G, INK, foeBase, TIERS, chain, ragLimb, bareLeg, ring } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { PAL, fx, humanJoints, webHand, scaleDefs, poolBack, ripples, waveLock, hairMass, ik, spline, arcLen, clipDraw, strip, lamprey, biteMark, lampreyScar, jointLimb } = KI;
const { split, side } = require('../dirAC');

const GY = TIERS.human[1] - 30; // 790, the ground line for small and human tiers

// ------------------------------------------------------------------ BRINE SIREN (Human 0.9)
// Half-raised from a pool of black water on a heavy eel body that sweeps back and then forward into the waist; the
// gaunt ribcage thrust out and leaning at the heroes; the jaw dropped far too wide. The tail end loops out behind.
// The far hand claws out at the heroes, the near hand is spread on her own breastbone.
function brineSiren() {
  const f = new Fig(foeBase(120, { shadowTint: '#26304a', mud: '#16222a', grimeY: 700 }));
  const X = fx(f), sc = scaleDefs(f);
  const H = 82;
  const skin = '#c6cdd0', skinS = '#646a86', scaleC = '#9fb2ae', tailC = '#5f7a6e', tailD = '#3e5248', fin = '#3a4c44', hair = '#1d281c', hairD = '#141c14', hairL = '#4f6a52', rag = '#8e8a78';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle120', texOp: 0.5 }, o);
  const TL = (o = {}) => Object.assign({ fill: tailC, shadow: '#26323a', tex: sc, texOp: 0.6 }, o);
  const HR = (o = {}) => Object.assign({ fill: hair, shadow: hairD, tex: 'hatch120', texOp: 0.3, inkW: 1.3, inkHeavy: 2.4 }, o);
  const N = [332, 418], C = [298, 500], P = [242, 600];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const HC = add(N, add(mul(up, 66), [8, 0])), hA = -0.2, hF = frame(HC, hA, H);
  const SF = S.at(0.42, 0.03), EF = [452, 516], WF = [538, 498];
  const SN = S.at(-0.5, 0.1), EN = [256, 530], WN = [322, 500];
  const PC = [250, 770], tailBase = [190, 770], hips = [220, 636];
  // ---- skeleton
  f.joint('pool', PC).joint('tail_1', tailBase, 'pool').joint('tail_2', hips, 'tail_1').joint('torso', S.at(0, 0.8), 'tail_2');
  f.joint('head', N, 'torso').joint('jaw', hF([[-0.16, 0.16]])[0], 'head').joint('hair', hF([[-0.2, -0.36]])[0], 'head');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('tail_end', [92, 772], 'pool');

  // ---- pool: back half and broken flagstones at its rim
  f.bone('pool');
  poolBack(f, PC, 246, 28);
  for (const [x, w, a] of [[30, 40, -0.1], [478, 46, 0.12], [520, 34, -0.2]]) f.part([[x - w / 2, 774], [x - w / 2 + 6, 762, 1], [x + w / 2, 760 + a * 30, 1], [x + w / 2 + 4, 776], [x + w / 2 - 4, 789, 1], [x - w / 2 + 2, 789, 1]], { fill: '#4a4e52', tex: 'mottle120', shade: 0.4, inkW: 1.3 });

  // ---- a coil of the eel body breaking the surface behind her: rising steeply, sliding long and thin back under,
  // a ragged dorsal fin along the crest whose edge thins away into nothing
  f.bone('tail_end');
  const loop = [[124, 784], [118, 730], [100, 690], [72, 676], [46, 694], [32, 740], [24, 784]];
  const loopW = [62, 56, 48, 40, 32, 26, 22];
  const finIn = [], finOut = [];
  for (let i = 1; i < loop.length - 1; i++) { const a = loop[i - 1], b = loop[i + 1], d = E.norm(sub(b, a)), n = [-d[1], d[0]]; finIn.push(add(loop[i], mul(n, loopW[i] / 2 - 5))); finOut.push(add(loop[i], mul(n, loopW[i] / 2 + 12 + 14 * Math.sin((i - 0.5) / (loop.length - 2) * Math.PI)))); }
  const fo = finOut.map((q, i) => i % 2 ? q : [...q, 1]);
  f.part([...finIn, ...fo.slice().reverse()], { fill: fin, shade: 0.3, inkW: 1, inkHeavy: 1.4, opacity: 0.85, shadow: '#1c2422', hatch: false });
  for (let i = 0; i < finIn.length; i++) { f.line([finIn[i], finOut[i]], 0.9, INK, { op: 0.6 }); if (i) f.line([lerp(finIn[i - 1], finIn[i], 0.5), lerp(finOut[i - 1], finOut[i], 0.45)], 0.8, INK, { op: 0.45 }); }
  f.part(chain(loop, loopW), TL());
  f.line(loop.slice(1, -1).map((q, i) => { const a = loop[i], b = loop[i + 2], d = E.norm(sub(b, a)); return add(q, mul([d[1], -d[0]], loopW[i + 1] * 0.3)); }), 1.2, '#c8d4cc', { op: 0.45 }); // pale belly line
  X.barnacles([[116, 740, 6], [110, 754, 5], [122, 762, 4], [78, 694, 4]]);
  X.mussel([60, 712], 0.6);

  // ---- far arm clawing out at the heroes, behind the chest
  // one outline from shoulder to wrist: a gaunt arm, the elbow bent and pointed, a wiry forearm narrowing to the wrist
  const armCut = (A, J, Bp, r) => [side(J, mul(E.norm(sub(J, A)), -1), r), side(J, E.norm(sub(Bp, J)), r)];
  const fc = armCut(SF, EF, WF, 15);
  split(f, () => {
    f.part(jointLimb(SF, EF, WF, [36, 24, 15], { point: 0.55, mus0: 0.14, mus1: 0.3 }), SK({ fill: mix(skin, skinS, 0.15) }));
    f.line([lp(EF, WF, 0.12, 6), lp(EF, WF, 0.5, 4), lp(EF, WF, 0.9, 3)], 1, INK, { op: 0.45 }); // tendon
    f.line([lp(EF, WF, 0.2, -3), lp(EF, WF, 0.85, -2)], 1, '#eef0ee', { op: 0.4 }); // the ulna's edge catching light
    f.line([lp(SF, EF, 0.86, 3), lp(SF, EF, 0.96, -6), lp(EF, WF, 0.06, -9)], 1.1, INK, { op: 0.55 }); // crease inside the elbow
    X.pucker(lerp(EF, WF, 0.6), 4, 1.4, 6);
  }, [['upperarm_f', fc[0]], ['forearm_f', fc[1]]]);
  f.bone('hand_f');
  webHand(f, add(WF, [16, 2]), 0.1, 30, mix(skin, skinS, 0.12), { spread: 0.75, curl: 0.55, shadow: skinS, nailL: 0.36 });

  // ---- hair drifting up and back off the head in heavy wet locks
  f.bone('hair');
  const cr = hF([[-0.2, -0.36]])[0];
  // two heavy masses lifting off the head as if still under water, split into wet points at the ends
  hairMass(f, [add(cr, [-4, 40]), add(cr, [-50, 36]), add(cr, [-110, 16]), add(cr, [-166, 18]), add(cr, [-200, 44])], [56, 64, 60, 46, 30], HR({ fill: hairD }), { tips: 4, tipL: 46, phase: 1.3, lit: hairL, tipCurl: 0.6 });
  hairMass(f, [add(cr, [12, 6]), add(cr, [-30, -40]), add(cr, [-90, -66]), add(cr, [-150, -72]), add(cr, [-204, -56])], [64, 84, 76, 58, 38], HR(), { tips: 5, tipL: 50, phase: 0.2, lit: hairL, tipCurl: -0.5 });
  f.part(ell(add(cr, [-92, -80]), 7, 3.6, 0.4, 8), { fill: '#7a8a6a', inkW: 0.8, cast: false }); // weed snagged in the hair
  f.part(ell(add(cr, [-120, 26]), 5, 3, -0.2, 8), { fill: PAL.bone, inkW: 0.8, cast: false, hatch: false }); // a shell

  // ---- the eel body: from the water, sweeping back and up into the waist
  f.bone('tail_1');
  f.part(chain([add(hips, [6, -16]), [206, 700], [188, 780]], [100, 118, 134]), TL({ fill: mix(scaleC, tailC, 0.6) }));
  X.livid([190, 744], 40, 26, 8, [tailD, '#2a3a36'], 0.45);
  X.barnacles([[156, 724, 7], [148, 740, 5], [166, 744, 5], [158, 760, 4]]);
  X.mussel([238, 732], 0.8); X.mussel([244, 750], 1.2); X.mussel([230, 748], 0.3);

  // ---- torso: gaunt, ribcage flared, waist sunken; pale scales creep up the belly
  f.bone('torso');
  const torso = S.shape([[-0.12, 0.36, 0.32], [0.04, 0.82, 0.6], [0.2, 0.74, 0.78], [0.38, 0.64, 0.74], [0.54, 0.52, 0.56], [0.72, 0.38, 0.38], [0.86, 0.42, 0.42]]);
  f.part(torso, SK());
  f.flat([S.at(-0.5, 0.06), S.at(-0.2, 0.0), S.at(-0.3, 0.14)], mix(skinS, '#000', 0.2), { op: 0.35 }); // shoulder blade
  for (let i = 0; i < 5; i++) { const v = 0.3 + i * 0.07; f.line([S.at(-0.5, v - 0.02), S.at(-0.1, v + 0.035), S.at(0.4, v - 0.02)], 1.4, mix(skinS, '#000', 0.25), { op: 0.75 }); f.line([S.at(-0.44, v - 0.045), S.at(-0.08, v + 0.01), S.at(0.34, v - 0.045)], 1, '#eef0ee', { op: 0.5 }); }
  f.flat([S.at(-0.4, 0.6), S.at(0.0, 0.64), S.at(0.38, 0.6), S.at(0.34, 0.74), S.at(-0.34, 0.74)], skinS, { op: 0.35 }); // the hollow under the ribs
  f.line([S.at(0.56, 0.02), S.at(0.2, 0.06), S.at(-0.24, 0.03)], 1.5, INK, { op: 0.6 }); // collarbone
  f.line([S.at(0.6, 0.12), S.at(0.7, 0.24), S.at(0.6, 0.34)], 1.2, INK, { op: 0.4 });
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const q = S.at(-0.32 + i * 0.22 + (r % 2) * 0.11, 0.7 - r * 0.06); f.line([add(q, [-4, 2]), add(q, [0, -2.5]), add(q, [4, 2])], 0.9, INK, { op: 0.65 - r * 0.15 }); } // scales fading up the belly
  X.livid(S.at(-0.1, 0.5), 20, 18, 5, ['#8a8ab0', '#7a9a8a'], 0.3);
  X.barnacles([[...S.at(-0.6, 0.08), 6], [...S.at(-0.72, 0.16), 5], [...S.at(-0.5, 0.02), 4]]);
  X.voidHole(S.at(-0.06, 0.6), 15, 12, 0.4); // void: a clean round hole through the sunken waist
  // far shoulder: the deltoid shows over the front of the chest, so the reaching arm hangs from a shoulder
  f.part(ell(S.at(0.4, 0.06), 25, 21, -0.5, 14), SK({ fill: mix(skin, skinS, 0.08), cast: false }));
  // a strand of kelp over the near shoulder, across the chest
  f.stroke([S.at(-0.8, 0.0), S.at(-0.2, 0.05), S.at(0.3, 0.16), S.at(0.6, 0.3), S.at(0.55, 0.46)], 8, PAL.kelp);
  f.line([S.at(-0.76, -0.02), S.at(-0.2, 0.03), S.at(0.28, 0.14)], 1, PAL.kelpL, { op: 0.7 });
  // shell necklace on a cord with a verdigris copper pendant
  const nk = [S.at(0.4, -0.06), S.at(0.44, 0.06), S.at(0.34, 0.14), S.at(0.12, 0.16), S.at(-0.18, 0.1)];
  f.line(nk, 1.3, '#3a2a1a');
  nk.slice(1, 4).forEach((q, i) => f.part(ell(add(q, [0, 3]), 4.4, 3.2, i, 8), { fill: PAL.bone, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }));
  f.part([add(nk[2], [-5, 6]), add(nk[2], [5, 6]), add(nk[2], [4, 17]), add(nk[2], [0, 20]), add(nk[2], [-4, 17])], { fill: PAL.verd, inkW: 0.9, inkHeavy: 1.2, cast: false });

  // ---- scaled hips: the pale scales begin at the waist in a scalloped edge over the skin
  f.bone('tail_2');
  const hp = chain([S.at(0, 0.72), P, hips, [214, 652]], [58, 84, 102, 106]), nh = hp.length / 2;
  const qa = hp[hp.length - 1], pb = hp[0], dn = E.norm(sub(P, S.at(0, 0.72))), sc8 = [];
  for (let i = 1; i < 8; i++) sc8.push(i % 2 ? add(lerp(qa, pb, i / 8), mul(dn, -9)) : [...lerp(qa, pb, i / 8), 1]);
  f.part([...hp, ...sc8], TL({ fill: mix(scaleC, tailC, 0.25) }));
  f.line([S.at(0.38, 0.85), lp(P, hips, 0.5, -44), [262, 650]], 1, '#dfe6e0', { op: 0.35 }); // pale belly line

  // ---- torn shawl over the cut between waist and tail: a sodden band slung round the hips, knotted at the front
  const band = [[166, 650], [204, 628], [262, 602], [274, 606], [280, 624], [266, 634, 1], [254, 626], [236, 648, 1], [222, 640], [202, 664, 1], [188, 660], [172, 672, 1]];
  f.part(band, { fill: rag, tex: 'weave120', texOp: 0.5, shadow: '#3a3a3a' });
  f.stroke([[196, 640], [222, 630], [258, 616]], 1.6);
  f.part(ell([270, 618], 10, 8, 0.3, 10), { fill: mix(rag, '#000', 0.15), tex: 'weave120', inkW: 1.2, cast: false }); // knot
  f.part([[264, 624], [276, 626], [282, 672], [278, 700, 1], [272, 690], [268, 706, 1], [262, 680]], { fill: mix(rag, '#000', 0.08), tex: 'weave120', texOp: 0.5, shadow: '#3a3a3a', inkW: 1.2 });
  f.part([[276, 622], [286, 626], [296, 660], [292, 684, 1], [286, 670], [282, 680, 1], [280, 650]], { fill: mix(rag, '#000', 0.2), tex: 'weave120', texOp: 0.5, shadow: '#3a3a3a', inkW: 1.2 });
  X.drip([279, 712]); X.drip([290, 692], 0.8);

  // ---- neck (moves with the head) and head: a sweet face over a mouth opened far too wide
  f.bone('head');
  f.part(limb(add(N, mul(up, -10)), hF([[-0.08, 0.2]])[0], 38, 32), SK());
  f.line([S.at(0.3, 0.0), hF([[0.02, 0.36]])[0]], 1.2, INK, { op: 0.45 }); // throat tendon
  // the open mouth is a real gap in the profile: a mask cuts the air in front of the gape out of the face, so the
  // wedge between upper lip and dropped jaw reads in silhouette
  const U = [0.36, 0.262], A = [0.16, 0.56], LW = [0.37, 0.81];
  const gid = f.id('m'), gap = hF([U, [0.8, 0.16], [0.95, 1.0], LW, A]).map(q => [q[0], q[1], 1]);
  f.defs.push(`<mask id="${gid}" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="820"><rect width="600" height="820" fill="#fff"/><path d="${E.smooth(gap)}" fill="#000"/></mask>`);
  f.raw(`<g mask="url(#${gid})">`);
  B.head(f, HC, H, hA, { skin, jaw: 0.86, chin: -0.02, nose: 0.9, mouth: 'set', squint: 0.05, lips: true, lashes: true, faceHatch: false, faceShade: 0.7, jawShade: 0.2, noEar: true, iris: '#2a3a44', eyeWhite: '#e4e8e4', hairCol: hair, browCol: '#2a3426', browW: 0.035 });
  f.flat(hF(ell([0.11, -0.03], 0.08, 0.03, 0, 10)), '#7a7a9a', { op: 0.45 }); // shadowed lower lid
  f.flat(hF([[0.0, 0.22], [0.12, 0.24], [0.3, 0.25], U, A, [0.3, 0.76], [0.18, 0.78], [0.06, 0.62], [-0.02, 0.42]]), '#120a10'); // the dark of the mouth
  f.flat(hF([[0.04, 0.34], [0.18, 0.36], [0.14, 0.6], [0.04, 0.52]]), '#3a1a24', { op: 0.6 }); // the throat
  f.part(hF([[-0.04, 0.2], [0.04, 0.24], [0.0, 0.44], [0.06, 0.64], [-0.02, 0.62], [-0.08, 0.4]]), SK({ inkW: 1, cast: false, fill: mix(skin, '#8a6a7a', 0.2) })); // cheek membrane stretched at the back of the mouth
  for (const y of [0.3, 0.38, 0.46, 0.54]) f.line(hF([[-0.05, y], [0.03, y + 0.03]]), 0.8, INK, { op: 0.55 });
  f.raw('</g>');
  // upper jaw: rows of fine needle teeth hanging from the lip line, the front ones long enough to break the outline
  for (let i = 0; i < 10; i++) { const x = 0.07 + i * 0.03, l = 0.08 + (i % 2) * 0.03 + (i > 6 ? 0.05 : 0); f.flat(hF([[x - 0.01, 0.245], [x + 0.012, 0.25], [x + 0.004 + (i > 6 ? 0.02 : 0), 0.25 + l]]), '#dcd8c8'); }
  for (let i = 0; i < 6; i++) { const x = 0.1 + i * 0.035; f.flat(hF([[x - 0.008, 0.29], [x + 0.008, 0.29], [x, 0.35]]), '#9a968a', { op: 0.85 }); }
  f.line(hF([[0.08, 0.235], [0.24, 0.24], [0.37, 0.262]]), 2.4, mix(skin, '#4a5a7a', 0.45)); // blue upper lip
  f.line(hF([U, [0.28, 0.36], A]), 1.6, INK, { op: 0.8 }); // the inner edge of the gape
  // sodden mat of hair over the crown, a lock clinging down the cheek
  f.part(hF([[-0.46, 0.24], [-0.52, -0.14], [-0.4, -0.46], [-0.08, -0.6], [0.22, -0.54], [0.38, -0.38], [0.3, -0.3], [0.2, -0.4], [0.1, -0.3], [-0.04, -0.42], [-0.16, -0.24], [-0.24, -0.04], [-0.28, 0.24]]), HR());
  f.line(hF([[-0.36, -0.36], [-0.1, -0.5], [0.16, -0.48]]), 1.1, hairL, { op: 0.6 });
  f.stroke([hF([[-0.2, -0.2]])[0], hF([[-0.14, 0.1]])[0], hF([[-0.2, 0.36]])[0], hF([[-0.12, 0.5]])[0]], 7, hair);

  // ---- the dropped jaw, needle teeth along its inner edge
  f.bone('jaw');
  const jaw = [[-0.24, 0.1], [-0.16, 0.36], [-0.06, 0.62], [0.06, 0.86], [0.18, 0.96], [0.33, 0.94], [0.4, 0.86], [0.37, 0.81], [0.22, 0.79], [0.1, 0.68], [0.02, 0.46], [-0.06, 0.24], [-0.12, 0.1]];
  f.part(hF(jaw), SK({ inkW: 1.3 }));
  f.flat(hF([[-0.18, 0.3], [-0.06, 0.6], [0.08, 0.88], [0.24, 0.94], [0.06, 0.94], [-0.12, 0.6]]), mix(skinS, '#000', 0.2), { op: 0.4 });
  for (let i = 0; i < 9; i++) { const q = lerp([0.36, 0.8], [0.04, 0.5], i / 9), l = 0.07 + (i % 2) * 0.03 + (i < 2 ? 0.04 : 0); f.flat(hF([[q[0] - 0.012, q[1] + 0.012], [q[0] + 0.012, q[1] + 0.006], [q[0] - 0.006, q[1] - l]]), '#dcd8c8'); }
  f.line(hF([[0.39, 0.82], [0.22, 0.8], [0.12, 0.7]]), 2.4, mix(skin, '#4a5a7a', 0.45)); // blue lower lip
  f.line(hF([[0.2, 0.92], [0.31, 0.9]]), 1, INK, { op: 0.4 });
  X.drip(hF([[0.28, 1.01]])[0]); X.drip(hF([[0.22, 1.12]])[0], 0.8);

  // ---- near arm: elbow back, the webbed hand spread on her breastbone
  const nc = armCut(SN, EN, WN, 16);
  split(f, () => {
    f.part(jointLimb(SN, EN, WN, [40, 26, 18], { point: 0.6, mus0: 0.16, mus1: 0.28 }), SK());
    X.livid(lerp(SN, EN, 0.55), 9, 18, 3, ['#8a8ab0', '#7a9a8a'], 0.35);
    f.flat(ell(add(EN, mul(E.norm(mul(add(E.norm(sub(SN, EN)), E.norm(sub(WN, EN))), -1)), 9)), 4, 3, 0, 8), '#eef0ee', { op: 0.45 }); // the bare point of the elbow
    f.line([lp(EN, WN, 0.2, 5), lp(EN, WN, 0.8, 4)], 1, INK, { op: 0.45 }); // tendon
    X.pucker(lerp(EN, WN, 0.5), 4, 0.4, 6);
  }, [['upperarm_n', nc[0]], ['forearm_n', nc[1]]]);
  f.bone('hand_n');
  webHand(f, add(WN, [16, -10]), -0.75, 27, skin, { spread: 0.6, curl: 0.12, shadow: skinS, nailL: 0.3 });

  // ---- front lip of the pool: the surface closing round the body
  f.bone('pool');
  f.flat(ell([192, 776], 80, 8, 0, 18), PAL.water, { op: 0.75 });
  f.flat(ell([96, 778], 46, 6, 0, 18), PAL.water, { op: 0.75 });
  ripples(f, [192, 774], 76, 8, 3);
  ripples(f, [96, 776], 44, 5, 2);
  for (const q of [[330, 760], [380, 772], [440, 764]]) f.line([q, add(q, [16, 0])], 1, '#6e8e9e', { op: 0.5, straight: true });
  return f;
}

// ------------------------------------------------------------------ EEL-KIN BITER (Small 0.6)
// A harbour urchin gone to eel, crouched like an animal about to spring: rump up, spine bowed with every vertebra
// showing, thighs folded tight against the ribs with the heels lifted, the bony elbows cocked back and the long webbed
// fingers dug into the floor. The head is pushed out long and low with the eel jaw hinged open. Slick blue-black skin,
// a pale belly, the last of his breeches.
function eelKinBiter() {
  const f = new Fig(foeBase(121, { shadowTint: '#1c2232', mud: '#1a2420', grimeY: 700 }));
  const X = fx(f);
  const skin = '#3a4758', skinL = '#6a7c92', skinS = '#18202e', belly = '#b4b5a6', bellyS = '#5e6070', cloth = '#5e5644', clothD = '#454032', sheen = '#9ab2ca';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'mottle121', texOp: 0.45, light: mix(skin, '#9ab0c8', 0.35) }, o);
  const SKN = (o = {}) => SK(Object.assign({ fill: '#4a5a70', light: '#8aa0ba', shade: 0.26 }, o)); // the near limbs, nearer the light
  const SKF = (o = {}) => SK(Object.assign({ fill: mix(skin, skinS, 0.3) }, o));
  const BL = (o = {}) => Object.assign({ fill: belly, shadow: bellyS, shade: 0.3, tex: 'mottle121', texOp: 0.4 }, o);
  // landmarks (build coords, facing right)
  const P = [200, 644], T = [262, 626], NK = [350, 676];
  const HC = [406, 712], hA = 0.14, Hh = 58, hF = frame(HC, hA, Hh), hinge = hF([[-0.02, 0.26]])[0];
  const SN = [334, 676], EN = [302, 722], WN = [362, 768];
  const SF = [346, 668], EF = [326, 712], WF = [404, 766];
  const HN = [208, 646], KN = [300, 660], AN = [262, 754];
  const HF = [222, 638], KF = [320, 652], AF = [284, 750];
  f.joint('pelvis', P).joint('spine_1', T, 'pelvis').joint('neck', NK, 'spine_1').joint('head', add(NK, [30, 10]), 'neck').joint('jaw', hinge, 'head');
  f.joint('leg_fn_1', SN, 'spine_1').joint('leg_fn_2', EN, 'leg_fn_1').joint('leg_fn_3', WN, 'leg_fn_2');
  f.joint('leg_ff_1', SF, 'spine_1').joint('leg_ff_2', EF, 'leg_ff_1').joint('leg_ff_3', WF, 'leg_ff_2');
  f.joint('leg_hn_1', HN, 'pelvis').joint('leg_hn_2', KN, 'leg_hn_1').joint('leg_hn_3', AN, 'leg_hn_2');
  f.joint('leg_hf_1', HF, 'pelvis').joint('leg_hf_2', KF, 'leg_hf_1').joint('leg_hf_3', AF, 'leg_hf_2');
  const nrm = (a, b) => E.norm(sub(b, a));
  const cut = (J, a, b, r) => [side(J, mul(nrm(a, J), -1), r), side(J, nrm(J, b), r)];
  // A webbed hand or foot dug into the floor: the heel of the palm (or the raised heel), knuckles arched up like a cat's,
  // long fingers running forward and hooking down so the claws bite the ground, webbing slung between them.
  const grip = (W, s, look, o = {}) => {
    const gy = GY, kn = [W[0] + s * (o.foot ? 0.56 : 0.36), gy - s * 0.3];
    const heel = o.foot ? [W[0] - s * 0.04, W[1] + (gy - W[1]) * 0.55] : [W[0] + s * 0.02, gy - 3];
    f.part([[W[0] - s * 0.16, W[1] - 2], [W[0] + s * 0.12, W[1] - 5], [kn[0] + s * 0.08, kn[1] - s * 0.12], [kn[0] + s * 0.12, kn[1] + s * 0.07], [kn[0] - s * 0.04, gy - 2], heel, [W[0] - s * 0.17, (W[1] + heel[1]) / 2]], Object.assign({}, look, { k: 0.7 }));
    f.line([lerp(W, kn, 0.2), lerp(W, kn, 0.75)], 1, INK, { op: 0.45 }); // tendons of the long instep / back of the hand
    const tips = [];
    for (let i = 3; i >= 0; i--) { // far finger first
      const k0 = add(kn, [-i * s * 0.06, i * s * 0.03]), L = s * (o.foot ? 1.15 : 1.35) * [0.84, 1, 0.94, 0.76][i];
      const k1 = add(k0, [L * 0.36, -s * 0.2 + i * 1.5]), k2 = add(k1, [L * 0.38, s * 0.3]), tip = [k2[0] + L * 0.2, gy - 2];
      const col = mix(look.fill, '#000', i * 0.07);
      f.part(chain([k0, k1, k2, tip], [s * 0.15, s * 0.115, s * 0.095, s * 0.05], { bp: [[1, 0.0, 0.35, 0.08], [2, 0.0, 0.35, 0.08]] }), Object.assign({}, look, { fill: col, inkW: 1, inkHeavy: 1.4, cast: false, shade: 0.4, k: 0.85 }));
      f.line([add(k1, [-1, -s * 0.07]), add(k1, [1, s * 0.07])], 0.8, INK, { op: 0.5 }); // joint crease
      f.stroke([add(tip, [-2, -3]), add(tip, [s * 0.1, 0]), add(tip, [s * 0.13, 4])], 3.4, '#2e2c28'); // claw into the floor
      tips.push([k1, k2]);
    }
    for (let i = 0; i < 3; i++) { const a = tips[i], b = tips[i + 1]; f.flat([a[0], lerp(a[0], a[1], 0.85), lerp(b[0], b[1], 0.85), b[0]], '#26323e', { op: 0.6 }); f.line([lerp(a[0], a[1], 0.8), lerp(lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5), 0.6), lerp(b[0], b[1], 0.8)], 0.8, INK, { op: 0.5 }); } // webbing
    if (!o.foot) f.part(chain([add(W, [s * 0.1, s * 0.12]), add(W, [s * 0.38, s * 0.3]), [W[0] + s * 0.56, gy - 3]], [s * 0.2, s * 0.15, s * 0.1]), Object.assign({}, look, { inkW: 1, inkHeavy: 1.4, cast: false, shade: 0.4 })); // thumb
    f.line([add(kn, [-s * 0.02, -s * 0.1]), add(kn, [s * 0.04, s * 0.12])], 1, mix(look.fill, '#fff', 0.3), { op: 0.5 }); // knuckle shine
  };
  // ---- a limb drawn as one outline across the joint (bony point on the outside of the bend), split for the rig
  const limb3 = (b1, b2, A, J, Bp, ws, bumps, look, after) => split(f, () => { f.part(chain([A, J, Bp], ws, bumps), look); if (after) after(); }, [[b1, cut(J, A, Bp, ws[1] * 0.55)[0]], [b2, cut(J, A, Bp, ws[1] * 0.55)[1]]]);

  X.puddle([300, 786], 190, 0.35);

  // ---- far legs, behind the body
  limb3('leg_hf_1', 'leg_hf_2', HF, KF, AF, [36, 20, 14], { bq: [[0, 1, 0.45, 0.07], [1, 0, 0.45, 0.07]], bp: [[0, 0.3, 0.18, 0.18], [1, 0.3, 0.3, 0.16]] }, SKF());
  f.bone('leg_hf_3'); grip(AF, 40, SKF(), { foot: true });
  limb3('leg_ff_1', 'leg_ff_2', SF, EF, WF, [26, 16, 12], { bp: [[0, 1, 0.55, 0.06], [1, 0, 0.55, 0.06]], bq: [[1, 0.25, 0.25, 0.14]] }, SKF());
  f.bone('leg_ff_3'); grip(WF, 34, SKF());

  // ---- body: rump high, spine bowed like a drawn bow, ribs and shoulder blades under slick skin
  f.bone('pelvis');
  f.part([[166, 666], [170, 636], [192, 616], [226, 608], [252, 618], [256, 660], [238, 690], [204, 694], [178, 686]], SK());
  f.bone('spine_1');
  const back = [[214, 612], [240, 606], [270, 614], [300, 632], [324, 646], [344, 660], [362, 676]];
  const body = [...back, [368, 704], [350, 718], [322, 722], [290, 710], [262, 694], [240, 690], [218, 680], [208, 652]];
  f.part(body, SK());
  f.part([[244, 690], [266, 698], [292, 712], [322, 720], [350, 712], [356, 704], [346, 724], [318, 730], [286, 722], [256, 708]], BL({ inkW: 1.2 })); // pale belly
  for (let i = 0; i < 6; i++) { const x = 258 + i * 13, y0 = 640 + i * 6; f.line([[x, y0], [x + 7, y0 + 26], [x + 3, y0 + 50 - i * 2]], 1.4, skinS, { op: 0.85 }); f.line([[x + 3, y0 + 2], [x + 9, y0 + 24]], 1, skinL, { op: 0.5 }); } // ribs
  // vertebrae: a knuckled ridge breaking the line of the back, each with its own highlight
  const spinePt = t => { const k = Math.min(back.length - 2, Math.floor(t * (back.length - 1))), u = t * (back.length - 1) - k; return lerp(back[k], back[k + 1], u); };
  f.part([[180, 622], [196, 612], [214, 608]].concat(back.slice(1)).concat(back.slice().reverse().map(q => add(q, [0, 8]))), SK({ inkW: 0, cast: false, fill: mix(skin, skinS, 0.15) }));
  for (let i = 0; i < 12; i++) { const t = i / 11, q = add(spinePt(t), [0, 1]), r = 5.2 - Math.abs(t - 0.35) * 3; f.part(ell(q, r * 1.1, r * 0.85, 0.4 + t * 0.6, 9), SK({ inkW: 1, inkHeavy: 1.3, cast: false, fill: mix(skin, skinL, 0.3), shade: 0.4 })); f.flat(ell(add(q, [r * 0.3, -r * 0.35]), r * 0.35, r * 0.25, 0, 6), '#c8d8e8', { op: 0.6 }); }
  f.part([[296, 632], [320, 636], [334, 656], [312, 660], [298, 648]], SK({ inkW: 1.1, cast: false, fill: mix(skin, skinL, 0.2) })); // shoulder blade jutting
  f.stroke([[220, 616], [262, 614], [300, 632]], 2.4, sheen, { op: 0.5 }); // wet sheen along the back
  f.stroke([[324, 646], [344, 662], [358, 680]], 2, sheen, { op: 0.45 });
  X.voidHole([284, 678], 10, 8, 0.2); // void: a clean hole through the flank
  X.barnacles([[326, 652, 5], [338, 662, 4], [314, 648, 3.5]]);
  // torn short breeches: the last of the urchin, rope-belted
  f.bone('pelvis');
  const br = [[164, 668], [168, 632], [192, 612], [228, 604], [256, 614], [262, 650], [256, 674, 1], [244, 664], [236, 684, 1], [220, 672], [206, 692, 1], [194, 676], [176, 688, 1]];
  f.part(br, { fill: cloth, tex: 'weave121', texOp: 0.5, shadow: '#2a281e' });
  f.stroke([[194, 632], [202, 670]], 2); f.stroke([[226, 626], [234, 660]], 1.8);
  f.part([[176, 644], [194, 642], [196, 660], [178, 662]], { fill: clothD, tex: 'weave121', sharp: true, inkW: 1 }); // patch
  f.stitches([[176, 644], [194, 642], [196, 660], [178, 662], [176, 644]], '#a89a78', 0.8);
  f.part([[214, 606], [256, 614], [260, 624], [214, 616]], { fill: '#7a6a4a', tex: 'hatch121', texOp: 0.5, k: 0.6, inkW: 1.1 }); // rope belt
  f.stroke([[254, 620], [262, 640], [258, 656]], 3, '#6a5a3a');
  X.mussel([172, 664], 0.6);

  // ---- neck and head: a child's brow and wet eye over the eel jaws
  f.bone('neck');
  f.part([[324, 646], [350, 658], [372, 676], [388, 700], [382, 724], [362, 728], [344, 714], [330, 694]], SK());
  for (let i = 0; i < 3; i++) f.line([[362 + i * 7, 688], [358 + i * 7, 702], [362 + i * 7, 716]], 1.4, INK, { op: 0.75 }); // gill slits
  f.line([[334, 670], [352, 710], [364, 726]], 1.2, '#3a2a1a'); // a coin on a cord: the last thing he dived for
  f.part(ell([362, 732], 7, 7, 0, 12), { fill: PAL.verd, inkW: 1, inkHeavy: 1.4, cast: false });
  ring(f, [362, 732], 4, 4, 0.9, '#2a3a30', { op: 0.8 });
  f.bone('head');
  const skull = [[-0.5, -0.06], [-0.44, -0.4], [-0.12, -0.56], [0.24, -0.48], [0.44, -0.3], [0.56, -0.16], [0.92, -0.1], [1.32, -0.04], [1.52, 0.04], [1.5, 0.14], [1.1, 0.16], [0.6, 0.2], [0.2, 0.3], [-0.16, 0.42], [-0.44, 0.26]];
  f.part(hF(skull), SK({ maxShade: 26 }));
  f.flat(hF([[0.6, 0.2], [1.1, 0.16], [1.5, 0.14], [1.46, 0.1], [1.0, 0.1], [0.6, 0.14]]), belly, { op: 0.7 }); // pale lip edge
  f.stroke(hF([[-0.1, -0.5], [0.3, -0.44], [0.9, -0.14], [1.3, -0.06]]), 2.4, '#8ea4bc', { op: 0.5 });
  f.flat(hF(ell([0.24, -0.17], 0.15, 0.11, 0.1, 12)), '#0a0c12', { op: 0.75 }); // sunken socket
  f.flat(hF([[0.14, -0.16], [0.24, -0.21], [0.34, -0.17], [0.24, -0.13]]), '#b8bcae'); // milky drowned eye, half-lidded
  f.flat(hF(ell([0.26, -0.165], 0.03, 0.035, 0, 8)), '#5a6060', { op: 0.8 });
  f.stroke(hF([[0.06, -0.26], [0.24, -0.29], [0.42, -0.22]]), 4, '#141a24'); // heavy brow
  f.line(hF([[0.13, -0.17], [0.24, -0.215], [0.35, -0.17]]), 1.6, INK);
  f.line(hF([[0.12, -0.1], [0.26, -0.08], [0.38, -0.12]]), 1, skinL, { op: 0.6 });
  f.line(hF([[0.1, -0.06], [0.28, -0.02]]), 1, INK, { op: 0.4 });
  f.flat(hF([[1.22, -0.06], [1.32, -0.05], [1.3, -0.02], [1.22, -0.03]]), '#06080a'); // nostril slit
  f.line(hF([[-0.3, -0.1], [-0.24, 0.02], [-0.3, 0.12]]), 1.2, INK, { op: 0.6 }); // ear hole, rimmed
  f.flat(hF(ell([-0.28, 0.0], 0.03, 0.06, 0, 8)), '#06080a');
  for (const q of [[-0.3, -0.34], [-0.1, -0.46], [0.1, -0.5]]) f.line(hF([q, [q[0] - 0.06, q[1] + 0.2], [q[0] - 0.1, q[1] + 0.34]]), 1.2, '#46524a', { op: 0.8 }); // last hair plastered flat
  for (let i = 0; i < 9; i++) { const x = 0.42 + i * 0.12, y = 0.16 - i * 0.004; f.flat(hF([[x, y], [x + 0.07, y - 0.005], [x - 0.04, y + 0.15 + (i % 2) * 0.04]]), '#d8d4c2'); } // upper teeth hooked back
  f.flat(hF([[0.1, 0.26], [0.6, 0.2], [1.2, 0.17], [1.1, 0.4], [0.5, 0.5], [0.0, 0.44]]), '#1a0a10');
  f.bone('jaw');
  const jF = pts => hF(pts).map(q => add(hinge, rot(sub(q, hinge), 0.42)));
  f.part(jF([[-0.18, 0.22], [0.3, 0.26], [0.9, 0.24], [1.36, 0.22], [1.44, 0.3], [1.36, 0.4], [0.9, 0.46], [0.4, 0.5], [0.0, 0.48], [-0.2, 0.36]]), BL({ fill: mix(belly, skin, 0.35), maxShade: 18 }));
  f.part(jF([[-0.18, 0.22], [0.3, 0.26], [0.9, 0.24], [1.36, 0.22], [1.4, 0.27], [0.9, 0.31], [0.3, 0.33], [-0.16, 0.3]]), SK({ inkW: 1, cast: false }));
  for (let i = 0; i < 8; i++) { const x = 0.36 + i * 0.13; f.flat(jF([[x, 0.23], [x + 0.07, 0.225], [x - 0.05, 0.08 - (i % 2) * 0.04]]), '#d8d4c2'); }
  f.line(jF([[0.2, 0.42], [0.7, 0.44], [1.2, 0.36]]), 1, bellyS, { op: 0.6 });
  X.drip(jF([[1.3, 0.48]])[0]); X.drip(jF([[0.9, 0.56]])[0], 0.8);

  // ---- near hind leg: the thigh folded tight up against the ribs, a bony knee, the heel lifted to spring
  limb3('leg_hn_1', 'leg_hn_2', HN, KN, AN, [40, 22, 15], { bq: [[0, 1, 0.5, 0.07], [1, 0, 0.5, 0.07]], bp: [[0, 0.3, 0.2, 0.18], [1, 0.28, 0.34, 0.15]] }, SKN(), () => {
    f.flat([lp(KN, AN, 0.1, -10), lp(KN, AN, 0.6, -6), lp(KN, AN, 0.9, -5), lp(KN, AN, 0.5, -2)], skinL, { op: 0.35 }); // the shin edge catching light
    f.part(ell(add(KN, [3, -4]), 9, 7, 0.5, 10), SK({ inkW: 1, cast: false, fill: mix(skin, skinL, 0.25) })); // kneecap
    f.line([lp(HN, KN, 0.25, 12), lp(HN, KN, 0.6, 14), lp(HN, KN, 0.92, 9)], 1.2, INK, { op: 0.5 }); // hamstring
    f.stroke([lp(HN, KN, 0.2, -14), lp(HN, KN, 0.6, -13), lp(HN, KN, 0.9, -10)], 2.4, sheen, { op: 0.45 });
    f.line([lp(KN, AN, 0.7, 6), lp(KN, AN, 0.95, 4)], 1, INK, { op: 0.5 }); // Achilles
    f.part(ragLimb(f, lerp(HN, KN, -0.05), lerp(HN, KN, 0.26), 46, 42, { depth: 6, teeth: 5 }), { fill: cloth, tex: 'weave121', texOp: 0.5, shadow: '#2a281e' }); // breeches leg, torn
  });
  f.bone('leg_hn_3'); grip(AN, 42, SKN(), { foot: true });
  // ---- near front leg: the elbow cocked back to a bony point, the forearm driving down to the dug-in hand
  limb3('leg_fn_1', 'leg_fn_2', SN, EN, WN, [28, 17, 12], { bp: [[0, 1, 0.6, 0.06], [1, 0, 0.6, 0.06]], bq: [[0, 0.3, 0.2, 0.15], [1, 0.22, 0.3, 0.14]] }, SKN(), () => {
    f.flat(ell(add(EN, [-5, 2]), 4, 3, 0.4, 8), skinL, { op: 0.5 }); // the point of the elbow, wet
    f.line([lp(EN, WN, 0.3, -4), lp(EN, WN, 0.85, -3)], 1, INK, { op: 0.45 }); // tendon down the forearm
    f.stroke([lp(SN, EN, 0.2, -10), lp(SN, EN, 0.7, -8)], 2, sheen, { op: 0.45 });
    X.barnacles([[...lp(SN, EN, 0.4, 6), 3.5], [...lp(SN, EN, 0.55, 7), 3]]);
  });
  f.bone('leg_fn_3'); grip(WN, 36, SKN());
  return f;
}

// ------------------------------------------------------------------ DROWNED BELL-RINGER (Human 1.0)
// A drowned sexton bent double under a great coil of bell rope worn across his back, knees bent, still hauling the
// funeral bell up over his head in one raw fist, mid-toll, its mouth to the heroes. Both ears are clean void holes.
function drownedBellRinger() {
  const f = new Fig(foeBase(122, { shadowTint: '#262a3a', mud: '#1e2620', grimeY: 610 }));
  const X = fx(f);
  const H = 96;
  const cass = '#262832', cassL = '#3e4150', cassD = '#17181f', skin = '#b6b4a6', skinS = '#6a667c', raw = '#9a5c50', rope = '#7c6c4a', ropeD = '#544630', bronze = '#6e5c3a', bronzeD = '#4a3c24', iron = '#3a3a3c';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle122', texOp: 0.55 }, o);
  const CS = (o = {}) => Object.assign({ fill: cass, shadow: '#0e0e14', tex: 'weave122', texOp: 0.45, light: cassL }, o);
  const RP = (o = {}) => Object.assign({ fill: rope, shadow: '#3a2e1c', tex: 'hatch122', texOp: 0.5, shade: 0.4 }, o);
  const P = [240, 476], C = [196, 386], N = [306, 334];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const HC = add(N, add(mul(up, 48), [14, -2])), hA = 0.1, hF = frame(HC, hA, H);
  const SF = S.at(0.5, 0.1), EF = [372, 262], WF = [424, 184];
  const SN = S.at(-0.3, 0.16), EN = [300, 440], WN = [334, 516];
  const HN = S.at(-0.2, 1.0), KN = [206, 612], AN = [182, 748];
  const HF = S.at(0.35, 0.98), KF = [326, 600], AF = [340, 748];
  // ---- skeleton
  humanJoints(f, { P, T: S.at(0, 0.75), N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('bell', WF, 'hand_f').joint('rope_end', WN, 'hand_n').joint('coil', S.at(-0.4, 0.3), 'torso').joint('skirt', S.at(0, 0.9), 'pelvis');

  // ---- far leg (behind the cassock): wool hose, worn shoe
  f.bone('thigh_f');
  f.part(limb(HF, KF, 62, 44), CS({ fill: cassD }));
  f.bone('shin_f');
  f.part(chain([KF, lerp(KF, AF, 0.45), AF], [44, 42, 26], { bp: [[0, 0.7, 0.2, 0.25]], bq: [[1, 0.85, 0.12, 0.1]] }), { fill: '#3a3830', tex: 'weave122', shadow: '#1a1814' }); // calf, then the hose sagging at the ankle
  for (let i = 0; i < 3; i++) f.line([lp(KF, AF, 0.72 + i * 0.07, -12), lp(KF, AF, 0.74 + i * 0.07, 0), lp(KF, AF, 0.71 + i * 0.07, 11)], 1, '#14120e', { op: 0.6 });
  f.bone('foot_f');
  B.boot(f, AF, 1, 50, '#2e2620', { style: 'shoe', shaft: 0.3, tex: 'mottle122' });
  // ---- far arm raised behind the head: raw rope-burned forearm, the bell held up mid-toll, its mouth to the heroes
  const fa = Math.atan2(WF[1] - EF[1], WF[0] - EF[0]);
  const fcut = [side(EF, mul(E.norm(sub(EF, SF)), -1), 20), side(EF, E.norm(sub(WF, EF)), 20)];
  split(f, () => {
    // a sinewy old forearm, one outline through the elbow: the point of the elbow, a ropy flexor, the wrist narrowing
    f.part(jointLimb(SF, EF, WF, [50, 34, 24], { point: 0.5, mus0: 0.1, mus1: 0.34 }), SK({ fill: mix(skin, skinS, 0.12) }));
    f.line([lp(EF, WF, 0.15, -7), lp(EF, WF, 0.55, -6), lp(EF, WF, 0.92, -4)], 1.1, INK, { op: 0.5 }); // tendon
    f.line([lp(EF, WF, 0.3, 9), lp(EF, WF, 0.7, 8)], 1.4, '#3a4a6a', { op: 0.55 }); // a raised vein
    // rope burns: raw welts wound slantwise round the forearm, uneven, broken, blistered at the edges
    for (const [t, w, l, o] of [[0.42, 3.4, 13, 0], [0.5, 2.2, 9, 3], [0.6, 3, 12, -2], [0.7, 4, 10, 1], [0.8, 2.4, 8, 0]]) { const q = lp(EF, WF, t, o), a = fa + 1.2 + (f.r() - 0.5) * 0.3; f.stroke([add(q, rot([-l, 0], a)), add(q, rot([l * 0.2, 1], a)), add(q, rot([l, 0], a))], w, raw, { op: 0.8 }); }
    f.flat(ell(lp(EF, WF, 0.62, -4), 6, 4, fa, 8), mix(raw, '#e8c8b0', 0.3), { op: 0.5 }); // weeping raw patch
    f.part(ragLimb(f, lerp(SF, EF, 0.5), lerp(EF, WF, 0.2), 56, 52, { depth: 8, teeth: 6 }), CS({ fill: cassD })); // the sleeve fallen back, bunched at the elbow
    for (let i = 0; i < 3; i++) f.line([lp(SF, EF, 0.72 + i * 0.08, -22), lp(SF, EF, 0.76 + i * 0.08, 0), lp(SF, EF, 0.72 + i * 0.08, 22)], 1.4, '#0a0a10', { op: 0.7 }); // bunched folds
  }, [['upperarm_f', fcut[0]], ['forearm_f', fcut[1]]]);
  f.bone('forearm_f');
  f.bone('bell');
  const bA = fa + 0.25, bF = frame(WF, bA, 1);
  f.part(bF([[-34, -9], [26, -10], [26, 10], [-34, 9]]), { fill: '#4a3424', tex: 'wood122', shadow: '#22160e' }); // oak handle
  for (let i = 0; i < 5; i++) f.line(bF([[-30 + i * 10, -10], [-24 + i * 10, 10]]), 1.2, '#2a1a10', { op: 0.8 });
  const bell = [[24, -26], [36, -40], [70, -44], [118, -54], [140, -72, 1], [150, -70], [150, 70], [140, 72, 1], [118, 54], [70, 44], [36, 40], [24, 26]];
  f.part(bF(bell), { fill: bronze, shadow: '#2a2014', tex: 'mottle122', texOp: 0.5, shade: 0.42 });
  f.part(bF([[140, -72, 1], [156, -76], [162, -40], [164, 0], [162, 40], [156, 76], [140, 72, 1], [150, 40], [152, 0], [150, -40]]), { fill: mix(bronze, '#000', 0.2), shade: 0.35 }); // lip ring
  f.flat(bF([[150, -64], [160, -60], [162, 0], [160, 60], [150, 64], [154, 0]]), '#0c0c10'); // the dark of the mouth
  f.part(bF(ell([150, 14], 7, 12, 0, 10)), { fill: iron, inkW: 1, cast: false }); // clapper ball, swung to the lip
  f.part(bF([[60, -46], [62, 46], [74, 48], [72, -48]]), { fill: bronzeD, shade: 0.3, inkW: 1 }); // inscription band
  for (let i = 0; i < 6; i++) f.flat(bF([[64 + (i % 2) * 2, -36 + i * 13], [70, -34 + i * 13], [69, -28 + i * 13], [63, -30 + i * 13]]), PAL.dgold, { op: 0.8 }); // worn letters
  X.verdi(bF([[100, 20]])[0], 34, 26, 14); X.verdi(bF([[40, -20]])[0], 14, 12, 5);
  f.line(bF([[30, -30], [70, -40], [118, -50], [140, -64]]), 1.6, '#c8b080', { op: 0.55 }); // worn-bright edge
  f.scratches(bF([[96, 0]])[0], 26, 6, '#d8c090');
  X.barnacles(bF([[46, 34], [56, 38], [100, 50]]).map((q, i) => [q[0], q[1], 5 - i]));
  for (let i = 0; i < 3; i++) X.drip(add(bF([[150 - i * 30, 64 - i * 10]])[0], [0, 10]));
  f.bone('hand_f');
  B.grip(f, WF, EF, bA, 30, mix(skin, skinS, 0.08), { inline: true, bend: 0.25, tex: 'mottle122', texOp: 0.5, shadow: skinS, name: 'bell' });
  f.flat(ell(add(WF, [-6, 6]), 8, 5, bA, 8), raw, { op: 0.6 }); // raw palm edge

  // ---- near leg, under the cassock skirt
  f.bone('thigh_n');
  f.part(limb(HN, KN, 66, 46), CS());
  f.bone('shin_n');
  f.part(chain([KN, lerp(KN, AN, 0.45), AN], [46, 44, 27], { bp: [[0, 0.7, 0.2, 0.25]], bq: [[1, 0.85, 0.12, 0.1]] }), { fill: '#46433a', tex: 'weave122', shadow: '#1e1c18' }); // calf, then the hose sagging at the ankle
  for (let i = 0; i < 3; i++) f.line([lp(KN, AN, 0.72 + i * 0.07, -12), lp(KN, AN, 0.74 + i * 0.07, 0), lp(KN, AN, 0.71 + i * 0.07, 12)], 1, '#14120e', { op: 0.6 });
  f.part([lp(KN, AN, 0.3, -6), lp(KN, AN, 0.28, 8), lp(KN, AN, 0.46, 9), lp(KN, AN, 0.48, -4)], SK({ inkW: 1, cast: false })); // a hole worn in the hose
  f.bone('foot_n');
  B.boot(f, AN, 1, 52, '#342a22', { style: 'shoe', shaft: 0.3, tex: 'mottle122', strap: true });

  f.defs.push(`<linearGradient id="slime122" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3e5a44" stop-opacity="0"/><stop offset="0.5" stop-color="#3e5a44" stop-opacity="0.35"/><stop offset="1" stop-color="#3e5a44" stop-opacity="0.6"/></linearGradient>`);
  // ---- cassock: the torso hunched over, the skirt hanging to the shins in rotten tatters
  f.bone('skirt');
  const sk = [S.at(-0.85, 0.82), S.at(0.85, 0.8), [370, 560], [392, 654], [388, 668, 1], [380, 664], [374, 688, 1], [366, 672], [352, 677], [344, 702, 1], [338, 684], [322, 690], [314, 726, 1], [306, 690], [290, 695, 1], [280, 684], [268, 688], [258, 734, 1], [252, 692], [238, 698], [228, 707, 1], [220, 690], [206, 695], [196, 722, 1], [190, 700], [178, 694], [168, 710, 1], [160, 664], [166, 560]];
  f.part(sk, CS({ over: `<rect x="150" y="610" width="260" height="120" fill="url(#slime122)"/>` }));
  for (const q of [[[214, 560], [206, 640], [200, 690]], [[262, 560], [262, 640], [262, 700]], [[312, 560], [326, 640], [330, 690]], [[350, 600], [366, 650], [372, 680]]]) f.stroke(q, 2.6, '#0a0a10');
  f.line([[300, 520], [316, 620], [322, 690]], 1, cassL, { op: 0.6 });
  for (const [x, y] of [[190, 676], [240, 668], [300, 672], [356, 660]]) f.flat(ell([x, y], 10, 5, 0.2, 8), PAL.verd, { op: 0.45 });
  f.part([[230, 600], [262, 598], [264, 630], [232, 634]], CS({ fill: mix(cass, '#4a3a2a', 0.35), sharp: true, inkW: 1.1 })); // patch
  f.stitches([[230, 600], [262, 598], [264, 630], [232, 634], [230, 600]], '#8a8a7a', 0.8);

  f.bone('torso');
  const torso = S.shape([[-0.14, 0.42, 0.36], [0.06, 1.0, 0.7], [0.26, 1.06, 0.86], [0.5, 0.92, 0.86], [0.72, 0.8, 0.82], [0.9, 0.84, 0.86], [1.0, 0.86, 0.86]]);
  f.part(torso, CS());
  // button row down the front, every other one gone
  for (let i = 0; i < 9; i++) { const q = S.at(0.74 - i * 0.004, 0.1 + i * 0.09); if (i % 3 === 1) f.line([add(q, [-2, 0]), add(q, [2, 0])], 1, '#8a8a7a', { op: 0.6 }); else f.part(ell(q, 3.6, 3.2, 0, 8), { fill: '#16161c', inkW: 0.9, inkHeavy: 1, cast: false, hatch: false }); }
  f.stroke([S.at(0.2, 0.2), S.at(0.3, 0.5), S.at(0.2, 0.78)], 2.4, '#0a0a10');
  f.stroke([S.at(-0.4, 0.3), S.at(-0.3, 0.6), S.at(-0.4, 0.8)], 2.2, '#0a0a10');
  f.flat([S.at(0.0, 0.3), S.at(0.3, 0.34), S.at(0.2, 0.5)], '#4a5a52', { op: 0.3 }); // salt bloom
  // short shoulder cape, ragged, barnacled
  f.part([S.at(-1.0, 0.0), S.at(-0.3, -0.12), S.at(0.5, -0.06), S.at(0.86, 0.12), S.at(0.9, 0.34), [...S.at(0.7, 0.4), 1], S.at(0.56, 0.32), [...S.at(0.36, 0.44), 1], S.at(0.14, 0.36), [...S.at(-0.1, 0.48), 1], S.at(-0.36, 0.4), [...S.at(-0.66, 0.5), 1], S.at(-0.9, 0.38), [...S.at(-1.12, 0.42), 1], S.at(-1.12, 0.2)], CS({ fill: '#1d1e26' }));
  f.stroke([S.at(-0.5, 0.06), S.at(-0.56, 0.3)], 2, '#0a0a10'); f.stroke([S.at(0.2, 0.04), S.at(0.24, 0.3)], 2, '#0a0a10');
  X.barnacles([[...S.at(-0.7, 0.02), 6], [...S.at(-0.5, -0.04), 5], [...S.at(-0.84, 0.1), 4], [...S.at(-0.3, -0.06), 4]]);
  // the rope crosses his chest from the far shoulder to the coil at the near hip
  f.part(chain([S.at(0.62, -0.08), S.at(0.6, 0.2), S.at(0.3, 0.4), S.at(-0.42, 0.42)], [16, 16, 16, 16]), RP());
  for (let i = 0; i < 12; i++) { const q = lerp(S.at(0.62, -0.08), S.at(-0.42, 0.42), i / 12); f.line([add(q, [-4, -5]), add(q, [4, 5])], 1, INK, { op: 0.5 }); }
  // cincture: a knotted cord belt, a sexton's iron church key on a thong
  f.part([S.at(-0.88, 0.8), S.at(0.88, 0.78), S.at(0.88, 0.86), S.at(-0.88, 0.88)], RP({ fill: '#5a5040', k: 0.6 }));
  const kk = S.at(0.3, 0.88);
  f.part(ell(kk, 7, 6, 0, 10), RP({ fill: '#5a5040', inkW: 1.1, cast: false }));
  f.stroke([kk, add(kk, [4, 40]), add(kk, [0, 70])], 4, '#5a5040'); f.stroke([add(kk, [4, 2]), add(kk, [12, 30]), add(kk, [10, 48])], 3.4, '#4a4030');
  const key0 = S.at(-0.3, 0.9);
  f.line([key0, add(key0, [2, 26])], 1.6, '#2a2018');
  f.line(ell(add(key0, [2, 34]), 8, 8, 0, 12).concat([ell(add(key0, [2, 34]), 8, 8, 0, 12)[0]]), 3.4, iron);
  f.part([add(key0, [0, 41]), add(key0, [5, 41]), add(key0, [5, 82]), add(key0, [12, 82]), add(key0, [12, 90]), add(key0, [5, 90]), add(key0, [5, 94]), add(key0, [0, 94])], { fill: iron, sharp: true, inkW: 1, inkHeavy: 1.3, cast: false });
  f.flat(ell(add(key0, [3, 66]), 3, 6, 0, 8), '#7a4a2a', { op: 0.6 }); // rust

  // ---- the coil of bell rope slung from the far shoulder: a heavy bundle of loops on his near hip and back
  f.bone('coil');
  // the loops hang plumb from where the coil is gathered under the rope band: each a sagging teardrop, no two alike
  const G = S.at(-0.42, 0.42), cc = add(G, [-8, 80]);
  const loops = [[50, 150, -14, 0.06], [58, 168, -4, -0.04], [46, 140, 6, 0.1], [62, 176, 2, -0.08], [54, 158, -10, 0.02]];
  loops.forEach(([rx, ry, dx, tilt], i) => {
    const pts = []; for (let k = 0; k <= 30; k++) { const a = Math.PI * 2 * k / 30, y = (1 - Math.cos(a)) / 2, x = rx * Math.sin(a) * (0.32 + 0.68 * Math.pow(y, 0.6)) * (1 + 0.06 * Math.sin(a * 3 + i)); pts.push(add(G, rot([x + dx * y, ry * y * (1 + 0.04 * Math.sin(a * 2 + i))], tilt))); }
    f.line(pts, 17, INK); f.line(pts, 13, i % 2 ? rope : ropeD);
    f.line(pts.slice(3, 12), 2, '#b8a878', { op: 0.55 });
    for (let k = 1; k < 30; k += 2) { const q = pts[k], d = E.norm(sub(pts[k + 1], pts[k - 1])); f.line([add(q, rot([-3, -4], Math.atan2(d[1], d[0]) - 1.57)), add(q, rot([3, 4], Math.atan2(d[1], d[0]) - 1.57))], 1, INK, { op: 0.45 }); } // the twist of the lay
  });
  f.part(ell(G, 16, 10, 0.3, 12), RP({ fill: ropeD, cast: false })); // the gathered top, lashed
  for (let k = 0; k < 3; k++) f.line([add(G, [-12 + k * 9, -7]), add(G, [-8 + k * 9, 8])], 2, '#2a2014');
  X.barnacles([[cc[0] - 50, cc[1] - 10, 5], [cc[0] - 52, cc[1] + 6, 4]]);
  X.mussel(add(cc, [50, 60]), 1.2); X.mussel(add(cc, [44, 72]), 0.7);
  f.stroke([add(cc, [-30, 60]), add(cc, [-36, 104]), add(cc, [-30, 140])], 6, PAL.kelp); // kelp caught in the loops

  // ---- head on a short thick neck: swollen, dead white eyes, mouth open in the toll; clean void holes where the ears were
  f.bone('head');
  f.part(limb(add(N, mul(up, -12)), hF([[-0.1, 0.26]])[0], 54, 46), SK());
  B.head(f, HC, H, hA, { skin, jaw: 1.24, chin: 0.0, nose: 1.08, hook: 0.1, mouth: 'set', squint: -0.2, age: true, faceShade: 0.8, jawShade: 0.35, noEar: true, iris: '#d0d2c8', eyeWhite: '#e2e2d8', hairCol: '#6a6a62', browCol: '#5a5a54' });
  f.flat(hF([[0.17, 0.26], [0.26, 0.25], [0.31, 0.27], [0.3, 0.38], [0.24, 0.41], [0.18, 0.37]]), '#4a5a7a'); // blue lips round the open mouth
  f.flat(hF([[0.19, 0.28], [0.25, 0.275], [0.29, 0.29], [0.28, 0.35], [0.23, 0.38], [0.2, 0.35]]), '#0c1012');
  f.flat(hF(ell([0.1, 0.12], 0.16, 0.12, 0, 12)), '#d4d6c8', { op: 0.3 }); // swollen cheek
  X.livid(hF([[0.0, 0.1]])[0], 16, 12, 5);
  // bald pate with a lank grey fringe hanging plumb
  f.part(hF([[-0.42, 0.14], [-0.48, -0.12], [-0.4, -0.34], [-0.3, -0.38], [-0.26, -0.1], [-0.24, 0.16]]), { fill: '#6a6a62', tex: 'hatch122', texOp: 0.4, shadow: '#2a2a28' });
  f.line(hF([[-0.2, -0.46], [0.06, -0.52], [0.24, -0.44]]), 1.2, '#e8e8dc', { op: 0.6 }); // wet shine on the scalp
  X.voidHole(hF([[-0.2, 0.06]])[0], 6.5, 9, hA, { glow: false }); // where the ear was: a clean hole through the skull
  for (const [q, l] of [[[-0.44, 0.1], 46], [[-0.36, 0.14], 38], [[-0.3, 0.16], 30], [[-0.24, -0.06], 40]]) f.stroke([hF([q])[0], add(hF([q])[0], [-2, l * 0.5]), add(hF([q])[0], [1, l])], 5, '#6a6a62');
  X.drip(hF([[0.25, 0.46]])[0]); X.drip(hF([[-0.3, 0.5]])[0], 0.8);

  // ---- near arm hanging heavy: sleeve, raw fist on the rope's end, which hangs slack and lies in loops on the floor
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 54, 46, { p: [[0.4, 0.1, 0.2]] }), CS());
  f.stroke([lp(SN, EN, 0.3, 16), lp(SN, EN, 0.55, 8), lp(SN, EN, 0.8, 16)], 2.2, '#0a0a10');
  f.bone('forearm_n');
  f.part(ragLimb(f, EN, lerp(EN, WN, 0.55), 46, 52, { depth: 7, teeth: 5 }), CS());
  f.part(chain([lerp(EN, WN, 0.3), lerp(EN, WN, 0.62), WN], [34, 30, 22], { bq: [[0, 0.2, 0.2, 0.25]] }), SK()); // forearm narrowing to a bony wrist
  f.line([lp(EN, WN, 0.5, 6), lp(EN, WN, 0.92, 4)], 1, INK, { op: 0.45 });
  f.flat(ell(lp(EN, WN, 0.96, -9), 3, 2.4, 0, 6), '#e6e4d8', { op: 0.5 }); // wrist bone
  for (let i = 0; i < 2; i++) { const q = lp(EN, WN, 0.66 + i * 0.12, 0); f.line([add(q, [-13, -3]), add(q, [13, 3])], 3, raw, { op: 0.7 }); } // rope burns
  f.bone('rope_end');
  const cB = S.at(-0.5, 1.12), fN = Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), rd = rot([1, 0], fN + Math.PI / 2); // the rope leaves the fist square to the forearm, then sags
  const rp = [add(WN, mul(rd, 4)), add(WN, add(mul(rd, 36), [0, 24])), add(WN, add(mul(rd, 52), [0, 90])), add(WN, [-74, 124]), add(cB, [20, 20]), cB];
  f.part(chain(rp, rp.map(() => 12)), RP());
  for (let i = 1; i < rp.length - 1; i++) f.line([add(rp[i], [-4, -4]), add(rp[i], [4, 4])], 1, INK, { op: 0.5 });
  const tail = [add(WN, mul(rd, -14)), add(WN, add(mul(rd, -20), [4, 34])), add(WN, add(mul(rd, -18), [2, 70]))]; f.part(chain(tail, [10, 10, 8]), RP()); f.stroke([tail[2], add(tail[2], [-3, 12]), add(tail[2], [2, 20])], 4, ropeD); // the frayed end hanging from the fist
  f.bone('hand_n');
  B.grip(f, WN, EN, fN + Math.PI / 2, 30, skin, { tex: 'mottle122', texOp: 0.5, shadow: skinS, name: 'rope' });
  f.flat(ell(add(WN, [4, 8]), 7, 4, 0.3, 8), raw, { op: 0.6 }); // raw knuckles
  f.bone('root');
  X.puddle([270, 786], 150, 0.4);
  return f;
}

// ------------------------------------------------------------------ LAMPREY SWARM (Small, a knot about 0.6 high)
// A drowned sailor's leg, torn off at the hip, still standing in its sea boot: swollen flesh in rotten canvas trousers,
// the broken femur in the wound at the top. Grey-brown lampreys feed on it: two rear out of the wound, one clamps onto
// the swollen thigh through a rip, one feeds behind it, one coils round the boot top and bites the back of the knee,
// one writhes on the floor. Their mouths are seen from the side, clamped, and twice three-quarter with their teeth.
// Rig: the leg is the root; every lamprey is one bone pivoting where it holds on.
function lampreySwarm() {
  const f = new Fig(foeBase(123, { shadowTint: '#2a2830', mud: '#22261e', grimeY: 640 }));
  const X = fx(f);
  const trou = '#545b64', flesh = '#aeac9e', fleshS = '#5c5874', boot = '#3a2a1e', bone = '#d2c9b0', wound = '#5a3a44';
  const TR = (o = {}) => Object.assign({ fill: trou, shadow: '#161c26', tex: 'weave123', texOp: 0.55, light: '#68707a' }, o);
  const FL = (o = {}) => Object.assign({ fill: flesh, shadow: '#6c6a76', shade: 0.24, tex: 'mottle123', texOp: 0.6 }, o);
  const AN = [296, 742], KB = [302, 626];
  // the torn cloth round a rot hole: a ring whose inner edge is ragged teeth lying over the swollen flesh
  const raggedRim = (P, look) => { const c = P.reduce((a, q) => add(a, mul(q, 1 / P.length)), [0, 0]), out = P.map(q => add(c, mul(sub(q, c), 1.05))), inn = [];
    for (let i = 0; i < P.length; i++) for (let k = 0; k < 2; k++) { const q = lerp(P[i], P[(i + 1) % P.length], k * 0.5), sc = k ? 0.9 - f.r() * 0.08 : 0.78 - f.r() * 0.12; inn.push([...add(c, mul(sub(q, c), sc)), k ? 0 : 1]); }
    f.part([...out, out[0], ...inn.reverse(), inn[0]], Object.assign(TR({ inkW: 1.1, inkHeavy: 1.6, castOp: 0.5 }), look || {})); };
  const LK = { col: '#867a68', colD: '#3a3129', belly: '#c6ba9f', mouth: '#d2c4aa' };
  // the lampreys, mouth first
  const LS = {
    l1: { c: [[444, 400], [416, 388], [390, 398], [376, 424], [348, 440], [318, 450], [296, 470]], w: 30, head: 'q3', piv: [300, 464], seed: 31, discX: 0.36, len: 300 },
    l2: { c: [[378, 392], [364, 364], [338, 348], [306, 350], [284, 370], [274, 404], [278, 440], [288, 472]], w: 27, head: 'side', piv: [284, 466], seed: 32, len: 330 },
    l8: { c: [[174, 476], [178, 448], [198, 426], [228, 418], [250, 430], [264, 456], [274, 474]], w: 25, head: 'side', piv: [270, 468], seed: 38, len: 260 },
    l3: { c: [[360, 514], [384, 512], [406, 528], [412, 556], [400, 590], [414, 624], [438, 640], [460, 628]], w: 26, head: 'bite', piv: [360, 514], seed: 33 },
    l4: { c: [[300, 500], [262, 512], [232, 532], [218, 556], [236, 572], [280, 576], [330, 570], [366, 580], [376, 612], [366, 648], [376, 680], [398, 700], [414, 690]], w: 25, head: 'hidden', piv: [262, 512], seed: 34 },
    l5: { c: [[258, 600], [232, 606], [216, 624], [236, 642], [280, 650], [326, 647], [352, 656], [352, 678], [320, 692], [280, 696], [250, 702], [226, 716], [208, 740], [200, 766], [182, 782]], w: 24, head: 'bite', piv: [258, 600], seed: 35, dorsal: -1 },
    l6: { c: [[490, 706], [484, 736], [462, 760], [428, 774], [392, 780], [352, 784], [310, 784], [278, 782], [256, 776]], w: 26, head: 'q3', piv: [330, 784], seed: 36, discX: 0.5 },
  };
  f.joint('leg', [296, 780]);
  for (const k in LS) f.joint('lamprey_' + k.slice(1), LS[k].piv, 'leg');
  const eel = k => lamprey(f, LS[k].c, Object.assign({ w: LS[k].w, head: LS[k].head, seed: LS[k].seed, dorsal: LS[k].dorsal, discX: LS[k].discX, len: LS[k].len }, LK));

  f.bone('root');
  X.puddle([300, 786], 170, 0.45);
  for (let i = 0; i < 3; i++) ring(f, [470 + i * 6, 784], 12 + i * 9, 2 + i, 1, '#7a9aa8', { op: 0.35 - i * 0.08 });

  // ---- behind the leg: one feeding on the back of the thigh, the coil round the boot, one on the floor
  f.bone('lamprey_4'); const l4 = eel('l4');
  f.bone('lamprey_6'); eel('l6');
  f.bone('lamprey_5'); const l5 = eel('l5');

  // ---- the leg: swollen thigh in rotten canvas trousers, torn off at the hip
  f.bone('leg');
  // a real leg: buttock fold and hamstring behind, the swollen quad in front, tapering to a bony knee
  const thigh = [[236, 466], [228, 490], [228, 516], [236, 544], [250, 572], [262, 594, 1], [266, 610], [264, 634], [338, 630], [340, 612], [344, 600], [334, 586], [344, 560], [352, 528], [352, 500], [344, 480],
    [338, 474, 1], [322, 480], [306, 466, 1], [290, 472], [272, 460, 1], [256, 466], [244, 456, 1]];
  // base and details in one deterministic pass, so the clipped copy over the lampreys' roots matches it exactly
  const thighBody = () => {
    const r0 = f.r; f.r = E.rng(1231);
    f.part(thigh, TR({ k: 0.9 }));
    // fabric: the outseam with its stitching, pull lines from the knee, creases in the bend, a patch, salt tide lines
    f.line([[290, 470], [292, 530], [300, 588], [302, 628]], 1.8, '#1a2028', { op: 0.8 });
    f.stitches([[294, 470], [296, 530], [304, 588], [306, 626]], '#8a9098', 0.8);
    for (const q of [[[338, 600], [322, 566], [314, 530]], [[340, 584], [334, 552]], [[326, 610], [300, 592], [280, 584]]]) f.stroke(q, 2.2, '#10161e'); // pull lines from the knee
    f.flat([[336, 588], [344, 598], [342, 612], [334, 606]], '#141a22', { op: 0.5 }); // under the kneecap
    for (let i = 0; i < 4; i++) f.line([[262 + i * 2, 600 - i * 6], [276 + i * 5, 594 - i * 8], [288 + i * 6, 598 - i * 11]], 1.1, '#0c1018', { op: 0.7 }); // creases behind the knee
    f.part([[268, 520], [296, 516], [298, 548], [270, 552]], TR({ fill: mix(trou, '#4a4030', 0.45), sharp: true, inkW: 1.1 })); // patch
    f.stitches([[268, 520], [296, 516], [298, 548], [270, 552], [268, 520]], '#a8a08a', 0.8);
    f.flat([[300, 482], [330, 486], [322, 520], [300, 540], [282, 520], [286, 494]], '#141a22', { op: 0.3 }); // wet dark stain
    for (let i = 0; i < 3; i++) f.line([[248, 570 + i * 9], [272, 574 + i * 9 + (i % 2) * 3], [304, 570 + i * 8], [338, 574 + i * 9]], 1, '#b8b4a4', { op: 0.35 - i * 0.07 }); // salt tide lines
    // rips: swollen flesh bulging out through the front of the thigh (the lamprey clamps on here) and behind the knee
    const ripF = [[328, 486], [350, 490], [362, 506], [364, 526], [356, 544], [338, 548], [326, 530], [322, 506]];
    f.part(ripF, FL());
    raggedRim(ripF.slice(2).concat(ripF.slice(0, 2)));
    f.flat([[330, 492], [348, 494], [354, 510], [340, 506]], '#d0ccc0', { op: 0.35 }); // stretched shine
    for (let i = 0; i < 4; i++) f.line([[328 + i * 3, 520 + i * 5], [338 + i * 4, 524 + i * 5]], 0.9, '#e0dcd0', { op: 0.5 }); // stretch marks
    X.livid([348, 520], 8, 16, 4, ['#8a849a', '#7a8a7c'], 0.35); X.veins([342, 504], 6, 12, 3, '#54507a', 0.8);
    f.line([[338, 490], [344, 494], [342, 500], [348, 498]], 1.2, INK); f.line([[336, 546], [342, 550], [338, 554]], 1.2, INK); // frayed cloth edges
    for (const [a, b] of [[[338, 494], [332, 486]], [[340, 546], [334, 556]], [[344, 544], [348, 554]]]) f.line([a, b], 0.8, '#8a9098', { op: 0.8 }); // threads
    const ripK = [[250, 576], [266, 582], [274, 600], [268, 616], [254, 612]];
    f.part(ripK, FL({ fill: mix(flesh, fleshS, 0.2) }));
    raggedRim(ripK);
    f.line([[250, 578], [262, 582], [272, 594]], 1.2, INK);
    // a long split down the back of the thigh, swollen skin pressing out between the edges, old lamprey scars on it
    const ripB = [[226, 478], [242, 474], [254, 490], [256, 516], [246, 534], [232, 528], [224, 504]];
    f.part(ripB, FL()); // a rot hole over the buttock and hamstring, flesh pressing out
    raggedRim(ripB);
    X.livid([240, 506], 10, 18, 5, ['#8a849a', '#7a8a7c'], 0.35); X.veins([236, 488], 8, 16, 3, '#54507a', 0.8);
    f.line([[224, 476], [232, 472], [244, 472], [256, 488]], 1.3, INK); f.line([[230, 528], [244, 536], [254, 518]], 1.3, INK);
    f.part([[300, 590], [318, 592], [322, 608], [306, 612]], FL({ fill: mix(flesh, fleshS, 0.15) })); // the cloth worn through at the knee
    lampreyScar(f, [346, 532], 5);
    lampreyScar(f, [262, 604], 4.5);
    biteMark(f, add(LS.l3.c[0], [-3, 0]), Math.atan2(LS.l3.c[0][1] - LS.l3.c[1][1], LS.l3.c[0][0] - LS.l3.c[1][0]), 22, { weep: true });
    biteMark(f, add(LS.l5.c[0], [-1, 0]), Math.atan2(LS.l5.c[0][1] - LS.l5.c[1][1], LS.l5.c[0][0] - LS.l5.c[1][0]), 20, { weep: false });
    X.voidHole([312, 556], 7, 13, -0.2); // void: a clean hole through the thigh, the dark behind it
    f.r = r0;
  };
  thighBody();
  // the sea boot: knee-high, salt-stained, its top turned down, a strap at the instep
  B.boot(f, AN, 1, 62, boot, { knee: KB, kneeW: 78, tex: 'mottle123', strap: true });
  f.part([[262, 626], [302, 630], [342, 620], [345, 642], [302, 648], [264, 646]], { fill: mix(boot, '#5a4a38', 0.3), shadow: '#140e08', tex: 'mottle123', texOp: 0.5, k: 0.8 }); // turned-down top
  f.line([[266, 642], [302, 645], [342, 638]], 1.2, '#7a6a52', { op: 0.6 });
  for (const q of [[[272, 676], [266, 716]], [[324, 672], [318, 708]], [[300, 690], [302, 720]]]) f.stroke(q, 2, '#120c08'); // slumped folds of the shaft
  for (let i = 0; i < 2; i++) f.line([[262, 712 + i * 10], [292, 716 + i * 10], [322, 710 + i * 10]], 1.1, '#c8c0aa', { op: 0.4 - i * 0.12 }); // salt line
  f.scratches([300, 700], 16, 5, '#8a7a62');
  X.barnacles([[262, 764, 6], [256, 776, 5], [272, 776, 4], [348, 772, 4]]);
  X.verdi([306, 736], 6, 4, 4);
  f.stroke([[352, 744], [334, 752], [308, 750], [282, 756], [268, 770]], 6, PAL.kelp); // kelp round the ankle
  f.line([[350, 742], [332, 749], [306, 747]], 1, PAL.kelpL, { op: 0.6 });
  // the trousers tucked in, sagging over the boot top in a wet roll
  f.part([[258, 612], [280, 620], [304, 622], [326, 618], [346, 608], [350, 624], [340, 636, 1], [324, 630], [306, 638, 1], [288, 630], [272, 638, 1], [258, 628]], TR({ k: 0.85 }));
  for (const x of [278, 304, 332]) f.line([[x, 620], [x - 4, 632]], 1.2, '#0c1018', { op: 0.7 });
  // the wound at the top: torn meat round the broken thighbone
  f.part(ell([290, 468], 56, 12, -0.1, 22).map((q, i) => add(q, [0, Math.sin(i * 2.1) * 2])), { fill: wound, shadow: '#24141a', shade: 0.3, tex: 'mottle123', texOp: 0.6, inkW: 1.3, cast: false });
  f.flat(ell([292, 468], 38, 7, -0.1, 16), '#2a161c', { op: 0.75 });
  f.part([[280, 466], [277, 444], [282, 430, 1], [287, 438], [293, 426, 1], [299, 440], [302, 466]], { fill: bone, shadow: '#7a705a', shade: 0.35, inkW: 1.3, inkHeavy: 1.8, cast: false, hatch: false }); // the femur, snapped
  f.flat(ell([290, 436], 5, 3, 0, 8), '#5a3a2a', { op: 0.85 }); // marrow
  for (const [x, y] of [[262, 458], [314, 456], [330, 462]]) f.part([[x - 6, y + 4], [x - 2, y - 6], [x + 5, y - 3], [x + 6, y + 5]], { fill: mix(wound, flesh, 0.3), inkW: 1, cast: false, hatch: false }); // shreds of meat

  // ---- out of the wound: two rearing at the heroes and over the top, one twisting back
  f.bone('lamprey_8'); eel('l8');
  f.bone('lamprey_2'); eel('l2');
  f.bone('lamprey_1'); eel('l1');
  // the near lip of the torn cloth over their roots: the same trousers clipped below a ragged tear
  f.bone('leg');
  const lipR = [[200, 470], [232, 466], [242, 474, 1], [254, 466], [266, 480, 1], [280, 472], [292, 486, 1], [306, 476], [320, 486, 1], [334, 478], [352, 484], [372, 480], [372, 520], [200, 520]];
  clipDraw(f, lipR, thighBody);
  f.line([[232, 466], [242, 474], [254, 466], [266, 480], [280, 472], [292, 486], [306, 476], [320, 486], [334, 478], [350, 484]], 1.4, INK, { op: 0.85, straight: true });
  for (const x of [244, 268, 294, 322]) f.line([[x, 478], [x + 2, 490]], 0.8, '#8a9098', { op: 0.7 }); // threads
  for (const [x, l] of [[262, 30], [310, 22]]) f.part([[x - 4, 476], [x + 5, 478], [x + 3, 478 + l], [x - 1, 478 + l + 4], [x - 3, 478 + l]], TR({ inkW: 1, cast: false })); // torn strips hanging
  X.drip([300, 498]); X.drip([266, 494], 0.7);

  // ---- in front: the coil across the boot top (clipped copy), and the one clamped to the thigh
  f.bone('lamprey_5');
  const i5 = l5.C.findIndex(q => q[0] > 348 && q[1] > 650);
  clipDraw(f, strip(l5.C, 0, i5, 22), () => eel('l5'));
  f.bone('lamprey_4');
  const i4a = l4.C.findIndex(q => q[0] < 228), i4b = l4.C.findIndex(q => q[0] > 352 && q[1] > 572);
  clipDraw(f, strip(l4.C, i4a, i4b, 22), () => eel('l4')); // it comes round the front of the thigh before it hangs
  f.bone('lamprey_3'); eel('l3');
  X.drip([466, 640], 0.8); X.drip([452, 422]); X.drip([382, 404], 0.8);
  return f;
}

// ------------------------------------------------------------------ BLOATED CORPSE (Human 1.0, nearly round)
// A drowned townsman blown up with gas until he is nearly as wide as he is tall, and it all sags: the chest hangs in a
// fold, the gut drops over the belt and the tops of the thighs, the body is widest at the bottom and the thin bowed legs
// buckle under it. The shirt has ridden up off the gut, the waistcoat can no longer meet, every seam has failed, and
// shore crabs climb out of his pockets. Mid-waddle: the weight on the straight near leg, the far foot lifting.
function bloatedCorpse() {
  const f = new Fig(foeBase(124, { shadowTint: '#283040', mud: '#202620', grimeY: 660 }));
  const X = fx(f);
  const skin = '#a9b3ae', skinS = '#5e6680', skinL = '#d2d8d2', vein = '#3e4c7e', coat = '#5e4630', coatD = '#46341f', shirt = '#a29e8c', breech = '#54412c', hose = '#6c6a62', crab = '#5c6040', crabD = '#3a3e28';
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle124', texOp: 0.6 }, o);
  const CT = (o = {}) => Object.assign({ fill: coat, shadow: '#22180e', tex: 'weave124', texOp: 0.5 }, o);
  const SH = (o = {}) => Object.assign({ fill: shirt, shadow: '#4a4a44', tex: 'weave124', texOp: 0.5 }, o);
  const HC = [334, 236], hA = -0.08, H = 84, hF = frame(HC, hA, H);
  const P = [300, 612], N = [326, 290];
  const SN = [292, 340], EN = [232, 410], WN = [256, 484];
  const SF = [372, 332], EF = [448, 378], WF = [482, 440];
  const HN = [262, 628], KN = [254, 704], AN = [262, 756];
  const HF = [344, 634], KF = [374, 706], AF = [392, 750];
  humanJoints(f, { P, T: [300, 560], N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('belly', [372, 500], 'torso');
  const knee = (a, k, b) => E.norm(sub(E.norm(sub(k, a)), E.norm(sub(b, k))));
  const cutAt = (J, a, b, r) => [side(J, mul(E.norm(sub(J, a)), -1), r), side(J, E.norm(sub(b, J)), r)];
  // a shore crab: carapace, eye stalks, legs, claws
  const crabAt = (c, s, ang) => {
    const F = frame(c, ang, s);
    for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) f.stroke(F([[sd * 0.5, 0.1 + i * 0.1], [sd * (0.95 + i * 0.05), -0.1 + i * 0.22], [sd * (1.1 + i * 0.05), 0.4 + i * 0.2]]), s * 0.1, crabD);
    f.part(F([[-0.7, 0.2], [-0.62, -0.28], [0, -0.48], [0.62, -0.28], [0.7, 0.2], [0.3, 0.42], [-0.3, 0.42]]), { fill: crab, shadow: '#22241a', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'mottle124' });
    for (const sd of [-1, 1]) { f.part(F([[sd * 0.5, -0.3], [sd * 0.9, -0.7], [sd * 1.1, -0.66], [sd * 1.05, -0.95], [sd * 0.78, -0.92], [sd * 0.6, -0.5]]), { fill: crab, shadow: '#22241a', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false }); f.line(F([[sd * 0.16, -0.44], [sd * 0.2, -0.62]]), 1.4, INK); f.flat(ell(F([[sd * 0.2, -0.64]])[0], 1.8, 1.8, 0, 6), '#0a0a0a'); }
    f.line(F([[-0.4, -0.1], [0, -0.22], [0.4, -0.1]]), 1, '#9a9a70', { op: 0.6 });
  };
  // stretch marks: pale streaks following the curve of the swelling
  const striae = (c, r, a0, a1, n, len) => { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i + f.r() * 0.6) / n, rr = r * (0.9 + f.r() * 0.12), p = add(c, [Math.cos(a) * rr, Math.sin(a) * rr * 0.92]), t = [-Math.sin(a), Math.cos(a)]; f.stroke([add(p, mul(t, -len / 2)), add(p, mul(t, len * 0.05)), add(p, mul(t, len / 2))], 2.2, skinL, { op: 0.55 }); f.line([add(p, mul(t, -len / 2)), add(p, mul(t, len / 2))], 0.6, '#6a7088', { op: 0.35 }); } };
  // branching blue marbling
  const branch = (p, a, l, d) => { if (d > 3 || l < 7) return; const q = add(p, rot([l, 0], a)), m = add(lerp(p, q, 0.5), rot([0, (f.r() - 0.5) * l * 0.5], a)); f.line([p, m, q], 1.9 - d * 0.35, vein, { op: 0.8 - d * 0.12 }); branch(q, a + 0.45 + f.r() * 0.4, l * 0.68, d + 1); branch(q, a - 0.45 - f.r() * 0.4, l * 0.64, d + 1); };
  const blister = (c, r) => { f.part(ell(c, r, r * 0.8, f.r(), 10), SK({ fill: mix(skin, '#e8ecd8', 0.4), shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false })); f.flat(ell(add(c, [r * 0.3, -r * 0.3]), r * 0.3, r * 0.22, 0, 6), '#fff', { op: 0.7 }); };

  X.puddle([320, 786], 170, 0.45);

  // ---- far leg, bent, the bare swollen foot lifting off the floor mid-waddle
  split(f, () => {
    f.part(chain([HF, KF, lerp(KF, AF, 0.25)], [50, 40, 34], { bq: [[0, 0.35, 0.12]] }), { fill: mix(breech, '#000', 0.2), tex: 'weave124', shadow: '#1e160c' });
    f.part([lp(HF, KF, 0.3, 2), lp(HF, KF, 0.36, 10), lp(HF, KF, 0.8, 9), lp(HF, KF, 0.84, 2)], SK({ fill: mix(skin, skinS, 0.3), inkW: 1, cast: false }));
    f.part(chain([lerp(KF, AF, 0.15), AF], [34, 26], { bp: [[0, 0.3, 0.15]] }), { fill: mix(hose, '#000', 0.2), tex: 'weave124', shadow: '#2a2a26' });
    f.part(plate(KF, AF, 0.02, 0.16, 40, 36), { fill: mix(breech, '#000', 0.3), tex: 'weave124', inkW: 1.1, cast: false }); // knee band of the breeches
  }, [['thigh_f', side(KF, mul(knee(HF, KF, AF), -1), 20)], ['shin_f', side(KF, knee(HF, KF, AF), 20)]]);
  f.bone('foot_f');
  B.bareFoot(f, AF, 1, 48, mix(skin, skinS, 0.25), { shadow: skinS, swell: 1, tex: 'mottle124', groundY: 774 });
  // ---- far arm pushed out in front of the chest by the bulk
  split(f, () => {
    f.part(chain([SF, EF, WF], [60, 50, 34], { bq: [[0, 0.5, 0.18, 0.25], [1, 0.25, 0.14]], bp: [[0, 0.95, 0.2, 0.08]] }), SK({ fill: mix(skin, skinS, 0.22) }));
    f.part(chain([SF, lerp(SF, EF, 0.9)], [62, 54]), SH({ fill: mix(shirt, '#000', 0.2) })); // sleeve, split along the seam
    f.part([lp(SF, EF, 0.3, -8), lp(SF, EF, 0.4, -24), lp(SF, EF, 0.85, -22), lp(SF, EF, 0.9, -8)], SK({ fill: mix(skin, skinS, 0.3), inkW: 1, cast: false }));
    f.line([lp(EF, WF, 0.8, -15), lp(EF, WF, 0.82, 0), lp(EF, WF, 0.8, 15)], 1.4, INK, { op: 0.7 }); // the fat crease at the wrist
  }, [['upperarm_f', side(EF, mul(E.norm(sub(EF, SF)), -1), 22)], ['forearm_f', side(EF, E.norm(sub(WF, EF)), 22)]]);
  f.bone('hand_f');
  B.hand(f, add(WF, [12, 14]), 1.0, 34, mix(skin, skinS, 0.18), { spread: 0.45, curl: 0.35, shadow: skinS }); // fingers fat as sausages, hanging

  // ---- the body: a sack of gas-blown flesh, widest at the bottom, sagging
  f.bone('torso');
  const sack = [[300, 280], [262, 290], [222, 314], [192, 350], [176, 396], [170, 420, 1], [162, 454], [156, 506], [160, 538], [172, 552, 1], [166, 572], [172, 600], [190, 624], [214, 636], [248, 644], [292, 646],
    [340, 650], [392, 662], [440, 656], [476, 632], [496, 592], [500, 546], [490, 500], [468, 456], [442, 424], [424, 406, 1], [428, 378], [412, 338], [384, 308], [356, 292]];
  f.part(sack, SK({ shade: 0.36, maxShade: 80 }));
  X.livid([190, 470], 26, 80, 10, ['#6a6a9a', '#5a7a6a'], 0.3);
  f.stroke([[172, 420], [196, 430], [222, 428]], 2.2, '#2a2a3a', { op: 0.7 }); // a fold of back fat under the shoulder blade
  // shirt, ridden up off the gut in front, still tucked at the back; its side seam burst
  const shirtP = [[262, 290], [300, 282], [356, 292], [384, 308], [410, 338], [426, 378], [424, 406], [436, 440], [426, 462, 1], [410, 452], [396, 474, 1], [380, 462], [362, 488, 1], [346, 478], [330, 506, 1], [312, 500], [300, 540], [256, 566], [204, 560], [170, 546],
    [163, 480], [172, 404], [190, 354], [222, 316]];
  f.part(shirtP, SH());
  f.part([[296, 382], [312, 386], [316, 440], [306, 500], [292, 496], [290, 440]], SK({ inkW: 1.1, cast: false })); // the side seam split open, skin bulging through
  for (let i = 0; i < 5; i++) f.line([[292, 398 + i * 20], [314, 402 + i * 20]], 0.9, '#c8b890', { op: 0.8 }); // threads still across it
  f.stroke([[350, 300], [380, 340], [404, 392]], 2.2, '#3a3a32'); f.stroke([[216, 350], [200, 430], [196, 520]], 2.2, '#3a3a32'); // drag folds
  // waistcoat: the panels can no longer meet; buttons torn off, the back seam burst
  const wc = [[256, 292], [300, 286], [346, 296], [372, 312], [386, 348], [392, 400], [398, 442], [384, 462], [356, 452], [340, 470], [300, 476], [250, 480], [196, 474], [168, 460], [168, 404], [186, 352], [220, 318]];
  f.part(wc, CT());
  f.stroke([[380, 318], [388, 380], [392, 440]], 2.2, '#140e08'); // the front edge, pulled taut
  for (let i = 0; i < 4; i++) { const q = [386 + i * 1.5, 340 + i * 28]; f.line([add(q, [-6, 0]), add(q, [2, 0])], 1.6, '#140e08'); }
  for (const [x, y, l] of [[398, 352, 18], [402, 410, 24]]) { f.line([[x, y], [x + 2, y + l]], 0.9, '#c8b890'); f.part(ell([x + 2, y + l + 4], 4.4, 4.4, 0, 8), { fill: '#3a3024', inkW: 0.9, inkHeavy: 1, cast: false }); } // buttons hanging on threads
  f.part([[214, 330], [232, 322], [222, 420], [208, 470], [192, 466], [204, 400]], SK({ inkW: 1.2, cast: false })); // the burst back seam
  for (let i = 0; i < 5; i++) f.line([[212 - i * 3, 344 + i * 26], [230 - i * 4, 340 + i * 26]], 0.9, '#c8b890', { op: 0.85 });
  f.stroke([[300, 300], [292, 380], [300, 470]], 2, '#140e08');
  f.part([[350, 420], [384, 416], [386, 446], [352, 450]], CT({ fill: coatD, sharp: true, inkW: 1.2 })); // pocket
  crabAt([368, 418], 20, -0.3); // a crab climbing out of it
  X.barnacles([[276, 300, 6], [296, 294, 5], [258, 308, 4], [314, 296, 4]]);
  X.voidHole([194, 404], 11, 15, 0.3); // void: a clean hole through the shoulder blade
  f.stroke([[176, 420], [166, 480], [172, 540]], 6, PAL.kelp); // kelp stuck to the back
  f.line([[178, 422], [168, 480]], 1, PAL.kelpL, { op: 0.6 });

  // ---- breeches seat and belt round the back, the back fat rolling over the belt
  f.bone('pelvis');
  const seat = [[164, 552], [210, 566], [262, 574], [310, 584], [344, 596], [352, 640], [300, 652], [244, 646], [204, 632], [180, 608], [166, 580]];
  f.part(seat, { fill: breech, tex: 'weave124', texOp: 0.5, shadow: '#1e160c' });
  f.part([[188, 590], [204, 600], [206, 630], [192, 624]], SK({ inkW: 1, cast: false })); // the seat seam split
  for (let i = 0; i < 3; i++) f.line([[188, 598 + i * 9], [206, 604 + i * 9]], 0.8, '#c8b890', { op: 0.8 });
  f.part([[162, 548], [210, 560], [262, 568], [312, 578], [346, 590], [344, 604], [310, 594], [262, 584], [210, 576], [164, 564]], { fill: '#2e2218', shade: 0.4, inkW: 1.3, inkHeavy: 2, tex: 'mottle124', k: 0.7 }); // belt, cutting in
  f.part([[200, 568], [214, 570], [214, 582], [200, 580]], { fill: '#6a5a3a', inkW: 1, sharp: true, cast: false }); // buckle
  f.line([[166, 546], [212, 556], [262, 562], [310, 572], [344, 584]], 2, INK, { op: 0.6 }); // the roll of fat over it
  f.flat([[160, 534], [210, 548], [262, 556], [312, 566], [346, 580], [312, 572], [262, 562], [210, 556], [166, 546]], '#1c1c28', { op: 0.5 });
  crabAt([238, 612], 15, 0.4); // a second crab in the breeches pocket
  f.stroke([[220, 596], [226, 634]], 1.6, '#1e160c');

  // ---- near leg, straight and carrying the weight: thin, bowed under the load, a buckled shoe
  split(f, () => {
    f.part(chain([HN, KN, lerp(KN, AN, 0.25)], [56, 42, 34], { bp: [[0, 0.4, 0.12]] }), { fill: breech, tex: 'weave124', shadow: '#1e160c' });
    f.part([lp(HN, KN, 0.32, -3), lp(HN, KN, 0.4, 7), lp(HN, KN, 0.82, 6), lp(HN, KN, 0.86, -2)], SK({ inkW: 1, cast: false })); // split seam
    for (let i = 0; i < 4; i++) f.line([lp(HN, KN, 0.42 + i * 0.1, -5), lp(HN, KN, 0.44 + i * 0.1, 8)], 0.8, '#c8b890', { op: 0.8 });
    f.part(chain([lerp(KN, AN, 0.12), AN], [34, 26], { bp: [[0, 0.3, 0.16]] }), { fill: hose, tex: 'weave124', shadow: '#2a2a26' });
    f.part([lp(KN, AN, 0.38, -2), lp(KN, AN, 0.36, 7), lp(KN, AN, 0.6, 7), lp(KN, AN, 0.62, -1)], SK({ inkW: 1, cast: false })); // a ladder in the hose
    for (let i = 0; i < 3; i++) f.line([lp(KN, AN, 0.4 + i * 0.07, -3), lp(KN, AN, 0.4 + i * 0.07, 8)], 0.8, hose, { op: 0.9 });
    f.part(plate(KN, AN, 0.0, 0.15, 44, 38), { fill: mix(breech, '#000', 0.15), tex: 'weave124', inkW: 1.1, cast: false });
    f.flat([lp(KN, AN, 0.18, 12), lp(KN, AN, 0.3, 14), lp(KN, AN, 0.26, 4)], '#1a1814', { op: 0.5 }); // the calf hollow under the load
  }, [['thigh_n', side(KN, mul(knee(HN, KN, AN), -1), 20)], ['shin_n', side(KN, knee(HN, KN, AN), 20)]]);
  f.bone('foot_n');
  B.boot(f, AN, 1, 50, '#2e241c', { style: 'shoe', shaft: 0.25, strap: true, tex: 'mottle124' });

  // ---- the gut: hangs over the belt and the tops of the thighs, drum-tight above and folded below
  f.bone('belly');
  // a drooping teardrop, not an egg: tight above, the weight slumped to the bottom front, a lump where the skin gave
  const gut = [[340, 474], [372, 456], [410, 446], [440, 440], [464, 452], [482, 480], [494, 520], [502, 566], [504, 604], [494, 636], [474, 658], [438, 672], [396, 674], [356, 664], [326, 646], [308, 616], [304, 576], [312, 530]];
  f.part(gut, SK({ shade: 0.34, maxShade: 60, inkW: 0 })); // no ink where it melts into the body
  f.line([[440, 440], [464, 452], [482, 480], [494, 520], [502, 566], [504, 604], [494, 636], [474, 658], [438, 672], [396, 674], [356, 664], [326, 646]], 3.2, INK); // ink only on the silhouette and under it
  f.flat([[318, 610], [350, 640], [400, 656], [456, 650], [490, 626], [486, 642], [462, 664], [420, 674], [370, 668], [332, 648]], '#4a3a5a', { op: 0.45 }); // lividity pooled where it hangs lowest
  for (const [x, y, a] of [[456, 500, 2.2], [420, 520, 1.6], [470, 560, 2.6], [380, 560, 1.2], [440, 600, 2.9], [350, 520, 0.9]]) branch([x, y], a, 22, 0);
  striae([404, 566], 96, 0.15, 1.35, 10, 26); // stretch marks round the lower curve
  striae([400, 540], 80, -0.9, -0.3, 4, 20);
  f.stroke([[452, 462], [480, 492], [492, 530]], 6, '#eef2ee', { op: 0.5 }); // drum-tight shine
  f.stroke([[470, 476], [486, 500]], 2.6, '#ffffff', { op: 0.6 });
  f.flat([[468, 548], [476, 544], [480, 556], [472, 560]], '#2a2430', { op: 0.85 }); f.line([[466, 546], [474, 542], [480, 552]], 1, skinL, { op: 0.6 }); // the navel, pulled into a slit
  f.line([[472, 562], [470, 584], [466, 604]], 1, '#3a3428', { op: 0.5, dash: '1.5 3' }); // a line of hair
  blister([432, 590], 7); blister([444, 604], 4.5); blister([360, 540], 5);
  X.peel([410, 620], 3, 18);
  // folds: where the gut meets the chest sag, the deep crease under the overhang, a fat fold on the flank
  f.stroke([[350, 474], [392, 452], [430, 444]], 3, '#1a1a24', { op: 0.8 });
  f.stroke([[322, 640], [362, 662], [412, 672], [456, 664]], 3.2, '#140e18', { op: 0.85 });
  f.stroke([[310, 560], [330, 574], [350, 578]], 2.4, '#2a2a3a', { op: 0.7 });
  f.line([[312, 566], [334, 582], [356, 584]], 1, skinL, { op: 0.5 });
  // the shirt hem lying ragged on top of the gut
  f.part([[338, 476], [362, 462], [384, 456], [410, 448], [436, 440], [426, 462, 1], [410, 456], [396, 476, 1], [380, 466], [362, 490, 1], [346, 480], [330, 506, 1], [324, 490]], SH({ inkW: 1.2, cast: true }));

  // ---- head sunk into the swell: puffed face, eyes pushed shut, the tongue swollen between split blue lips
  f.bone('head');
  f.part([[262, 300], [270, 262], [300, 250], [356, 258], [392, 280], [396, 312], [370, 320], [330, 318], [290, 316]], SK()); // the neck gone to rolls of fat
  f.stroke([[300, 296], [340, 306], [384, 300]], 2, '#2a2a3a', { op: 0.7 }); f.stroke([[290, 310], [334, 318], [376, 314]], 1.8, '#2a2a3a', { op: 0.6 });
  B.head(f, HC, H, hA, { skin, jaw: 1.5, chin: 0.02, nose: 0.95, mouth: 'set', squint: 0.85, faceShade: 0.7, jawShade: 0.3, hairCol: '#4a4436', browCol: '#3a3428', iris: '#c8ccc4', eyeWhite: '#d8dcd4' });
  f.flat(hF(ell([0.1, 0.12], 0.22, 0.16, 0, 12)), '#d8dcd8', { op: 0.3 }); // swollen cheek
  f.flat(hF([[0.16, 0.26], [0.25, 0.25], [0.33, 0.28], [0.31, 0.36], [0.22, 0.37]]), '#4a5a86'); // blue lips
  f.part(hF([[0.22, 0.29], [0.32, 0.29], [0.38, 0.32], [0.36, 0.37], [0.26, 0.35]]), { fill: '#6a5a78', shade: 0.3, inkW: 1, cast: false, hatch: false }); // swollen tongue pushed out
  f.line(hF([[0.2, 0.31], [0.24, 0.28]]), 1, INK);
  X.livid(hF([[0.0, 0.0]])[0], 14, 12, 4, ['#6a6a9a', '#5a7a6a'], 0.4);
  f.part(hF([[-0.5, -0.24], [-0.4, -0.5], [0.0, -0.62], [0.36, -0.52], [0.6, -0.36], [0.62, -0.28], [0.3, -0.3], [-0.1, -0.24]]), { fill: '#3e3a30', tex: 'weave124', texOp: 0.5, shadow: '#1a1812' }); // sodden flat cap
  f.line(hF([[0.0, -0.3], [0.4, -0.38], [0.6, -0.3]]), 1.2, INK, { op: 0.6 });
  X.drip(hF([[0.6, -0.22]])[0]); X.drip(hF([[0.34, 0.42]])[0], 0.8);

  // ---- near arm: fat sleeve split down its seam, resting on the swell, the hand hanging off the gut
  split(f, () => {
    f.part(chain([SN, EN, WN], [66, 52, 36], { bp: [[0, 0.55, 0.2, 0.25], [1, 0.3, 0.16]], bq: [[0, 0.95, 0.18, 0.08]] }), SK());
    f.part(chain([SN, lerp(SN, EN, 0.92)], [70, 58]), SH()); // shirt sleeve
    f.part([lp(SN, EN, 0.24, 6), lp(SN, EN, 0.32, 26), lp(SN, EN, 0.84, 24), lp(SN, EN, 0.9, 6)], SK({ inkW: 1.1, cast: false })); // the sleeve seam burst along the back of the arm
    for (let i = 0; i < 4; i++) f.line([lp(SN, EN, 0.36 + i * 0.13, 4), lp(SN, EN, 0.38 + i * 0.13, 26)], 0.8, '#c8b890', { op: 0.8 });
    f.part(plate(SN, EN, 0.82, 0.98, 60, 56), SH({ fill: mix(shirt, '#000', 0.1), inkW: 1.1, cast: false })); // bunched cuff of the burst sleeve
    f.line([lp(EN, WN, 0.84, -17), lp(EN, WN, 0.86, 0), lp(EN, WN, 0.84, 17)], 1.4, INK, { op: 0.7 }); // the fat crease at the wrist
    X.livid(lerp(EN, WN, 0.5), 10, 14, 4, ['#6a6a9a', '#5a7a6a'], 0.35);
  }, [['upperarm_n', side(EN, mul(E.norm(sub(EN, SN)), -1), 24)], ['forearm_n', side(EN, E.norm(sub(WN, EN)), 24)]]);
  f.bone('hand_n');
  B.hand(f, add(WN, [4, 16]), 1.5, 36, skin, { spread: 0.4, curl: 0.3, shadow: skinS });
  X.peel(add(WN, [0, 12]), 3);
  return f;
}

// ------------------------------------------------------------------ HOOKLINE FISHER (Human 1.0)
// A drowned line fisherman braced in a wide stance, leaning back against the pull, both hands on a long rod held high
// and bent over at the tip; the line hangs plumb to a heavy iron hook. Sou'wester brim, oilskin coat, waders, and a
// creel at the hip with something in it that looks out. The face has slipped down the skull.
function hooklineFisher() {
  const f = new Fig(foeBase(125, { shadowTint: '#28283a', mud: '#22261e', grimeY: 600 }));
  const X = fx(f);
  const H = 94;
  const oil = '#5e5028', oilL = '#8a7a44', oilD = '#40361a', hat = '#5e5022', skin = '#a8aaa0', skinS = '#626478', wader = '#2e2a24', wick = '#7a6a48', rodC = '#4a3a26';
  const OS = (o = {}) => Object.assign({ fill: oil, shadow: '#241e0c', tex: 'mottle125', texOp: 0.5, light: oilL }, o);
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle125', texOp: 0.55 }, o);
  const P = [258, 474], C = [280, 382], N = [292, 296];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const HC = add(N, add(mul(up, 60), [10, 0])), hA = 0.34, hF = frame(HC, hA, H); // tipped down to watch his line
  // the rod: a quadratic curve from the butt, bent over at the tip
  const R0 = [236, 524], RC = [520, 70], R1 = [568, 168];
  const rodAt = t => add(add(mul(R0, (1 - t) ** 2), mul(RC, 2 * t * (1 - t))), mul(R1, t * t));
  const rodDir = t => E.norm(add(mul(sub(RC, R0), 2 * (1 - t)), mul(sub(R1, RC), 2 * t)));
  const tN = 0.08, tF = 0.31, WN = rodAt(tN), WF = rodAt(tF);
  const SN = S.at(-0.3, 0.12), EN = [214, 420];
  const SF = S.at(0.45, 0.1), EF = add(WF, [58, 52]);
  const HN = S.at(-0.3, 1.0), KN = [204, 616], AN = [180, 748];
  const HF = S.at(0.35, 1.0), KF = [336, 608], AF = [364, 748];
  humanJoints(f, { P, T: S.at(0, 0.75), N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('rod', WN, 'hand_n').joint('line', R1, 'rod').joint('creel', S.at(-0.9, 0.9), 'pelvis').joint('coat_tail', S.at(-0.4, 1.0), 'pelvis');

  // ---- far leg and the line, behind
  // waders: one outline hip to ankle, the knee breaking it, rubbered canvas creased behind the knee and slumped at the ankle
  const jcut = (A, J, Bp, r) => [side(J, mul(E.norm(sub(J, A)), -1), r), side(J, E.norm(sub(Bp, J)), r)];
  const wad = (b1, b2, A, J, Bp, ws, col, extra) => { const c = jcut(A, J, Bp, ws[1] * 0.55); split(f, () => {
    f.part(jointLimb(A, J, Bp, ws, { point: 0.28, mus0: 0.1, mus1: 0.22 }), { fill: col, tex: 'mottle125', shadow: '#121010', light: mix(col, '#8a8a7a', 0.4) });
    const out = E.norm(mul(add(E.norm(sub(A, J)), E.norm(sub(Bp, J))), -1)), inn = mul(out, -1);
    for (let i = 0; i < 3; i++) f.line([add(J, add(mul(inn, ws[1] * 0.18), [-10 + i * 3, -8 + i * 7])), add(J, add(mul(inn, ws[1] * 0.42), [-2 + i * 3, i * 7]))], 1.4, '#060606', { op: 0.8 }); // creases in the bend
    for (let i = 0; i < 3; i++) f.line([lp(J, Bp, 0.74 + i * 0.08, -ws[2] * 0.5), lp(J, Bp, 0.77 + i * 0.08, 0), lp(J, Bp, 0.73 + i * 0.08, ws[2] * 0.5)], 1.3, '#060606', { op: 0.7 }); // slumped at the ankle
    f.line([lp(A, J, 0.3, -ws[0] * 0.3), lp(A, J, 0.8, -ws[1] * 0.3), lp(J, Bp, 0.4, -ws[2] * 0.4)], 1.3, '#7a7a6c', { op: 0.45 }); // wet shine
    if (extra) extra();
  }, [[b1, c[0]], [b2, c[1]]]); };
  wad('thigh_f', 'shin_f', HF, KF, AF, [64, 46, 34], mix(wader, '#000', 0.1), null);
  f.bone('foot_f');
  B.boot(f, AF, 1, 54, mix(wader, '#000', 0.1), { shaft: 0.3, tex: 'mottle125' });
  // ---- far arm up to the rod
  split(f, () => {
    f.part(jointLimb(SF, EF, WF, [50, 42, 36], { point: 0.25, mus0: 0.08, mus1: 0.1 }), OS({ fill: oilD }));
    for (let i = 0; i < 3; i++) f.line([lp(EF, WF, 0.06 + i * 0.1, -14), lp(EF, WF, 0.1 + i * 0.1, 0), lp(EF, WF, 0.05 + i * 0.1, 14)], 1.4, '#120e04', { op: 0.7 }); // the stiff oilskin creased at the elbow
  }, (c => [['upperarm_f', c[0]], ['forearm_f', c[1]]])(jcut(SF, EF, WF, 22)));

  // ---- near leg: waders to the thigh, under the long coat
  wad('thigh_n', 'shin_n', HN, KN, AN, [66, 48, 36], wader, () => {
    X.barnacles([[...lp(KN, AN, 0.5, -18), 5], [...lp(KN, AN, 0.58, -20), 4]]);
    f.part([lp(HN, KN, 0.5, -14), lp(HN, KN, 0.5, 10), lp(HN, KN, 0.72, 12), lp(HN, KN, 0.74, -12)], { fill: mix(wader, '#5a4a30', 0.4), tex: 'mottle125', sharp: true, inkW: 1.1, cast: false }); // a tarred patch
  });
  // ---- the long coat tail behind the legs
  f.bone('coat_tail');
  f.part([S.at(-0.9, 0.8), S.at(0.9, 0.8), [372, 560], [398, 650], [388, 668, 1], [360, 660], [340, 676, 1], [300, 662], [240, 672, 1], [196, 664], [158, 672, 1], [150, 640], [178, 540]], OS({ over: `<rect x="140" y="620" width="280" height="70" fill="#2a3a30" opacity="0.4"/>` }));
  for (const q of [[[200, 540], [184, 620], [176, 664]], [[330, 560], [354, 630], [362, 660]], [[262, 560], [262, 640]]]) f.stroke(q, 2.4, '#1e180a');
  f.part([[280, 600], [308, 598], [310, 628], [282, 630]], OS({ fill: mix(oil, '#3a2a1a', 0.4), sharp: true, inkW: 1.1 })); // patch
  f.stitches([[280, 600], [308, 598], [310, 628], [282, 630], [280, 600]], '#b8a870', 0.8);


  f.bone('foot_n');
  B.boot(f, AN, 1, 56, wader, { shaft: 0.3, tex: 'mottle125', strap: true });

  // ---- torso in the oilskin: heavy collar, toggles, a strap across the chest to the creel
  f.bone('torso');
  f.part(S.shape([[-0.12, 0.44, 0.4], [0.06, 0.96, 0.66], [0.3, 0.92, 0.8], [0.55, 0.84, 0.78], [0.8, 0.86, 0.82], [1.0, 0.9, 0.86]]), OS());
  f.stroke([S.at(0.6, 0.12), S.at(0.7, 0.5), S.at(0.62, 0.95)], 2.2, '#1e180a'); // front opening
  for (let i = 0; i < 4; i++) { const q = S.at(0.66, 0.2 + i * 0.2); f.part([add(q, [-7, -3]), add(q, [7, -3]), add(q, [7, 3]), add(q, [-7, 3])], { fill: '#d8d0b8', inkW: 0.9, inkHeavy: 1.1, cast: false, sharp: true }); f.line([add(q, [7, 0]), add(q, [16, 2])], 1.2, '#2a2014'); } // horn toggles and loops
  f.stroke([S.at(-0.2, 0.3), S.at(-0.1, 0.6), S.at(-0.24, 0.9)], 2.2, '#1e180a');
  f.stroke([S.at(0.2, 0.1), S.at(0.6, 0.22), S.at(0.8, 0.34)], 3, oilL, { op: 0.5 }); // oilskin shine
  f.stroke([S.at(-0.6, 0.4), S.at(-0.5, 0.7)], 2.4, oilL, { op: 0.4 });
  f.part([S.at(-0.5, 0.42), S.at(-0.2, 0.42), S.at(-0.2, 0.6), S.at(-0.5, 0.6)], OS({ fill: oilD, sharp: true, inkW: 1.1 })); // pocket
  X.mussel(S.at(-0.35, 0.44), 0.2); X.mussel(S.at(-0.28, 0.48), 1.2);
  f.part([S.at(-0.9, 0.86), S.at(0.9, 0.84), S.at(0.9, 0.93), S.at(-0.9, 0.95)], { fill: '#3a2a18', shade: 0.4, tex: 'mottle125' }); // belt
  f.part([S.at(0.2, 0.84), S.at(0.36, 0.84), S.at(0.36, 0.94), S.at(0.2, 0.94)], { fill: '#5a5448', shade: 0.4, inkW: 1.1, sharp: true });
  f.part(chain([S.at(0.7, -0.04), S.at(0.3, 0.3), S.at(-0.3, 0.7), S.at(-0.8, 0.88)], [12, 12, 12, 12]), { fill: '#4a3420', tex: 'mottle125', shade: 0.4 }); // creel strap
  // heavy collar turned up
  f.part([S.at(-0.6, -0.04), S.at(-0.3, -0.22), S.at(0.3, -0.2), S.at(0.66, -0.06), S.at(0.56, 0.12), S.at(0.0, 0.06), S.at(-0.5, 0.12)], OS({ fill: mix(oil, '#000', 0.1) }));

  // ---- the creel at the near hip, lid propped open: something inside looks out
  f.bone('creel');
  const cc = S.at(-0.98, 0.98);
  f.part([add(cc, [-36, -40]), add(cc, [40, -46]), add(cc, [44, 30]), add(cc, [28, 44]), add(cc, [-26, 46]), add(cc, [-40, 30])], { fill: wick, tex: 'weave125', texOp: 0.9, shadow: '#2a2418' });
  for (let i = 0; i < 5; i++) f.line([add(cc, [-38, -30 + i * 16]), add(cc, [42, -34 + i * 16])], 1.6, '#3a2e1c', { op: 0.7 });
  f.flat([add(cc, [-32, -40]), add(cc, [38, -46]), add(cc, [30, -36]), add(cc, [-26, -32])], '#0a0806');
  f.flat(ell(add(cc, [6, -40]), 5, 4, 0, 10), '#d8d4b0'); f.flat(ell(add(cc, [7, -40]), 2.4, 3.6, 0, 8), '#0a0a0a'); // an eye in the dark
  f.part([add(cc, [-40, -42]), add(cc, [36, -48]), add(cc, [24, -74]), add(cc, [-46, -66])], { fill: mix(wick, '#000', 0.15), tex: 'weave125', texOp: 0.9, shadow: '#2a2418' }); // lid, propped open
  f.stroke([add(cc, [22, -44]), add(cc, [40, -60]), add(cc, [52, -54]), add(cc, [58, -66])], 6, '#c8bca8'); // a pale feeler over the rim
  f.stroke([add(cc, [-10, -40]), add(cc, [-16, -54]), add(cc, [-8, -62])], 4, PAL.kelp);
  X.drip(add(cc, [20, 52])); X.drip(add(cc, [-10, 54]), 0.8);

  // ---- head: sou'wester, the face slipped down off the brow; a band of void where the forehead should be
  f.bone('head');
  f.part(limb(add(N, mul(up, -10)), hF([[-0.1, 0.26]])[0], 48, 42), SK());
  f.part(hF([[-0.64, 0.02], [-0.62, -0.34], [-0.3, -0.56], [0.2, -0.56], [0.5, -0.34], [0.5, 0.0]]), { fill: hat, tex: 'mottle125', shadow: '#201a08' }); // crown of the hat behind
  B.head(f, add(HC, [2, 24]), H, hA, { skin, jaw: 1.2, chin: -0.02, nose: 1.1, hook: 0.25, mouth: 'set', squint: 0.0, age: true, faceShade: 0.9, jawShade: 0.45, iris: '#c8ccc0', eyeWhite: '#d8dace', hairCol: '#4a4a44', browCol: '#4a4a44', noEar: true });
  const fF = frame(add(HC, [2, 24]), hA, H);
  f.flat(fF([[0.02, -0.02], [0.2, 0.02], [0.18, 0.08], [0.04, 0.06]]), mix(skinS, '#000', 0.3), { op: 0.6 }); // drooping lower lid
  // jowls hanging off the jaw where the skin has slid
  f.part(fF([[-0.16, 0.3], [0.06, 0.46], [0.26, 0.5], [0.34, 0.46], [0.3, 0.68], [0.16, 0.76], [0.0, 0.7], [-0.14, 0.52]]), SK({ inkW: 1.3 }));
  f.line(fF([[0.0, 0.52], [0.14, 0.6], [0.28, 0.56]]), 1.2, INK, { op: 0.6 });
  f.line(fF([[-0.08, 0.6], [0.08, 0.7]]), 1, INK, { op: 0.5 });
  X.livid(fF([[0.1, 0.55]])[0], 14, 10, 4);
  // the void where the brow was: clean-rimmed, between the slipped face and the brim
  f.part(hF([[-0.3, -0.4], [0.42, -0.4], [0.5, -0.2], [0.36, -0.1], [0.1, -0.12], [-0.2, -0.14], [-0.34, -0.26]]), { fill: '#e8e2d8', shade: 0.15, inkW: 1.1, inkHeavy: 1.2, cast: false, hatch: false });
  f.flat(hF([[-0.26, -0.37], [0.39, -0.37], [0.46, -0.21], [0.34, -0.13], [0.1, -0.15], [-0.2, -0.17], [-0.3, -0.26]]), PAL.voidC);
  f.flat(hF(ell([0.12, -0.26], 0.16, 0.05, 0, 10)), PAL.voidH, { op: 0.9 });
  f.line(hF([[-0.2, -0.15], [0.1, -0.13], [0.36, -0.11]]), 1.2, mix(skin, '#fff', 0.2), { op: 0.7 }); // the cut edge of the slipped skin
  // brim: long over the back of the neck, turned down over the eyes; tie under the chin
  f.part(hF([[-0.96, 0.18], [-0.86, -0.1], [-0.5, -0.36], [0.1, -0.46], [0.62, -0.42], [0.86, -0.28], [0.8, -0.2], [0.42, -0.26], [-0.1, -0.26], [-0.5, -0.12], [-0.8, 0.22]]), { fill: mix(hat, '#fff', 0.06), tex: 'mottle125', shadow: '#201a08', light: '#8a7a3a' });
  f.part(hF([[-0.58, -0.36], [-0.5, -0.72], [-0.1, -0.9], [0.28, -0.82], [0.5, -0.56], [0.46, -0.38], [0.0, -0.46]]), { fill: hat, tex: 'mottle125', shadow: '#201a08', light: '#8a7a3a' }); // crown
  f.stroke(hF([[-0.4, -0.56], [0.0, -0.7], [0.36, -0.62]]), 2.2, '#8a7a3a', { op: 0.6 });
  f.line(hF([[-0.84, -0.06], [-0.4, -0.28], [0.1, -0.36], [0.7, -0.32]]), 1.1, '#201a08', { op: 0.7 }); // brim stitching
  f.line(fF([[-0.3, 0.0], [-0.2, 0.4], [0.0, 0.62]]), 1.8, '#3a2a14'); // chin tie
  for (const x of [-0.7, 0.6, 0.8]) X.drip(add(hF([[x, -0.12]])[0], [0, 8]));

  // ---- the rod: ash pole bent over, cork-wrapped butt, rings; the line to an iron hook
  f.bone('rod');
  const rp = []; for (let i = 0; i <= 30; i++) rp.push(rodAt(i / 30));
  f.part(chain(rp, rp.map((_, i) => 13 - i * 0.32)), { fill: rodC, tex: 'wood125', shadow: '#1a120a' });
  f.line(rp.slice(2, 28).map((q, i) => add(q, mul([-rodDir(i / 30)[1], rodDir(i / 30)[0]], -3))), 1, '#9a8a6a', { op: 0.5 });
  for (const t of [0.0, 0.02, 0.04, 0.12, 0.14]) { const q = rodAt(t), d = rodDir(t), n = [-d[1], d[0]]; f.line([add(q, mul(n, -8)), add(q, mul(n, 8))], 2.6, '#2a1e10', { straight: true }); } // whipping
  for (const t of [0.4, 0.56, 0.7, 0.82, 0.92]) { const q = rodAt(t), d = rodDir(t), n = [-d[1], d[0]]; f.line(ell(add(q, mul(n, 7)), 3, 3, 0, 8).concat([ell(add(q, mul(n, 7)), 3, 3, 0, 8)[0]]), 1.2, '#4a4a48'); }
  f.bone('line');
  const hook = [R1[0] + 2, 452];
  f.line([R1, lerp(R1, hook, 0.5), hook], 1.2, '#c8c4b0', { op: 0.85 });
  const hkF = frame(hook, 0, 1);
  f.part(hkF([[-4, 0], [4, 0], [5, 40], [0, 56], [-16, 60], [-26, 48], [-24, 30], [-18, 32], [-18, 46], [-12, 50], [-4, 46], [-4, 8]]), { fill: '#3e3a36', shadow: '#121010', inkW: 1.4, tex: 'mottle125' });
  f.flat(hkF([[-24, 30], [-30, 22], [-18, 30]]), '#3e3a36');
  f.line(ell(hook, 4, 4, 0, 8).concat([ell(hook, 4, 4, 0, 8)[0]]), 2, '#3e3a36');
  f.flat(hkF([[-6, 20], [4, 18], [2, 30]]), '#7a4a2a', { op: 0.6 }); // rust
  f.stroke(hkF([[-14, 52], [-16, 70], [-10, 84], [-14, 100]]), 6, PAL.kelp); X.drip(hkF([[-14, 106]])[0]);
  // ---- far fist high on the rod, near fist on the butt
  f.bone('hand_f');
  B.grip(f, WF, EF, Math.atan2(rodDir(tF)[1], rodDir(tF)[0]), 30, mix(skin, skinS, 0.12), { tex: 'mottle125', texOp: 0.5, shadow: skinS, name: 'fisher far' });
  split(f, () => {
    f.part(jointLimb(SN, EN, WN, [54, 44, 38], { point: 0.3, mus0: 0.1, mus1: 0.1 }), OS());
    f.stroke([lp(SN, EN, 0.4, 14), lp(SN, EN, 0.7, 18)], 2.2, '#1e180a');
    for (let i = 0; i < 3; i++) f.line([lp(EN, WN, 0.04 + i * 0.09, -16), lp(EN, WN, 0.08 + i * 0.09, 0), lp(EN, WN, 0.03 + i * 0.09, 16)], 1.4, '#120e04', { op: 0.7 });
    f.part(ragLimb(f, lerp(EN, WN, 0.4), lerp(EN, WN, 0.78), 50, 52, { depth: 5 }), OS({ fill: mix(oil, '#000', 0.12) })); // cuff
  }, (c => [['upperarm_n', c[0]], ['forearm_n', c[1]]])(jcut(SN, EN, WN, 22)));
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.atan2(rodDir(tN)[1], rodDir(tN)[0]), 31, skin, { tex: 'mottle125', texOp: 0.5, shadow: skinS, name: 'fisher near' });
  X.peel(WN, 2);
  f.bone('root');
  X.puddle([270, 786], 150, 0.45);
  return f;
}

// ------------------------------------------------------------------ WEEPING NUN (Human 0.95)
// An infirmary sister standing still, head bowed deep under a heavy wet veil, hands folded at the waist. Two streams
// of water fall from her eyes, plumb, onto her hands and run down the black habit to a pool at her feet.
function weepingNun() {
  const f = new Fig(foeBase(126, { shadowTint: '#24283a', mud: '#1a2026', grimeY: 640 }));
  const X = fx(f);
  const H = 86;
  const hab = '#1e1f28', habL = '#3a3e52', habD = '#121218', wimp = '#d0c6aa', wimpS = '#6e6a66', tide = '#8a7450', skin = '#a8b0b6', skinS = '#5a6078', water = '#3a5a8a', waterL = '#8ab0d0';
  const HB = (o = {}) => Object.assign({ fill: hab, shadow: '#08080c', tex: 'weave126', texOp: 0.4, light: habL }, o);
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle126', texOp: 0.45 }, o);
  // the bow comes from the upper back rounding forward, not from the head sliding off the neck
  const P = [270, 474], C = [244, 380], N = [304, 318];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const HC = add(N, add(mul(up, 34), [10, 4])), hA = 0.72, hF = frame(HC, hA, H);
  const SN = S.at(-0.28, 0.14), EN = [262, 404], WN = [318, 436];
  const SF = S.at(0.42, 0.12), EF = [332, 398], WF = [330, 438];
  const HN = S.at(-0.2, 1.0), KN = [262, 622], AN = [252, 752];
  const HF = S.at(0.3, 1.0), KF = [306, 616], AF = [312, 752];
  humanJoints(f, { P, T: S.at(0, 0.75), N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('veil', hF([[-0.2, -0.3]])[0], 'head').joint('skirt', S.at(0, 0.9), 'pelvis').joint('rosary', WN, 'hand_n').joint('tears', hF([[0.15, 0.0]])[0], 'head');

  // ---- feet under the hem (and the legs, drawn whole for the rig)
  f.bone('thigh_f'); f.part(limb(HF, KF, 50, 38), HB({ fill: habD }));
  f.bone('shin_f'); f.part(limb(KF, AF, 36, 28), { fill: '#2a2a2e', tex: 'weave126', shadow: '#101012' });
  f.bone('foot_f'); B.boot(f, AF, 1, 44, '#1a1614', { style: 'shoe', shaft: 0.2, tex: 'mottle126' });
  f.bone('thigh_n'); f.part(limb(HN, KN, 52, 40), HB());
  f.bone('shin_n'); f.part(limb(KN, AN, 38, 28), { fill: '#2e2e32', tex: 'weave126', shadow: '#101012' });
  f.bone('foot_n'); B.boot(f, AN, 1, 46, '#201a16', { style: 'shoe', shaft: 0.2, tex: 'mottle126' });
  // ---- far arm in its wet sleeve, forearm forward to the folded hands
  f.bone('upperarm_f'); f.part(limb(SF, EF, 40, 36), HB({ fill: habD }));
  f.bone('forearm_f'); f.part(limb(EF, WF, 36, 30), HB({ fill: habD }));
  f.bone('hand_f'); B.grip(f, add(WF, [10, 0]), EF, Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), 20, mix(skin, skinS, 0.25), { shadow: skinS, tex: 'mottle126', texOp: 0.4, name: 'nun far' }); // far hand closed round the near wrist

  // ---- the veil's long back drape, behind the body
  f.bone('veil');
  const vb = hF([[-0.5, -0.3]])[0];
  f.part([vb, add(vb, [-30, 40]), add(vb, [-46, 140]), add(vb, [-50, 230]), add(vb, [-40, 252]), add(vb, [-18, 240]), add(vb, [0, 258]), add(vb, [22, 236]), add(vb, [40, 120]), add(vb, [36, 20])], HB({ fill: '#18181f' }));
  for (const q of [[[-30, 60], [-36, 160], [-34, 236]], [[-6, 80], [-4, 180], [0, 240]]]) f.stroke(q.map(p => add(vb, p)), 2.2, '#06060a');
  X.barnacles([[vb[0] - 34, vb[1] + 120, 5], [vb[0] - 38, vb[1] + 134, 4]]);

  // ---- habit: clinging wet over a thin body, the skirt to the floor, heavy and dragging
  f.bone('skirt');
  const sk = [S.at(-0.66, 0.78), S.at(0.62, 0.78), [330, 560], [326, 600], [342, 650], [360, 720], [376, 770], [366, 788, 1], [326, 784], [290, 790, 1], [246, 786], [204, 788, 1], [160, 789, 1], [128, 786], [136, 774], [176, 752], [196, 700], [212, 600], [216, 540]]; // the wet hem dragging behind her in a train
  f.part(sk, HB({ over: `<rect x="180" y="680" width="200" height="120" fill="url(#hem126)"/>` }));
  f.defs.push(`<linearGradient id="hem126" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a4a" stop-opacity="0"/><stop offset="1" stop-color="#2a3a4a" stop-opacity="0.6"/></linearGradient>`);
  // wet cloth clings to the knee, folds drag down to the hem
  f.part([[300, 590], [326, 600], [332, 640], [314, 650], [302, 630]], HB({ inkW: 0.9, cast: false, fill: mix(hab, habL, 0.25) }));
  for (const q of [[[236, 540], [228, 650], [222, 780]], [[262, 560], [258, 680], [256, 784]], [[300, 650], [318, 720], [330, 784]], [[338, 660], [348, 720], [354, 780]]]) f.stroke(q, 2.4, '#06060a');
  f.line([[284, 560], [286, 680], [290, 780]], 1.2, habL, { op: 0.6 });
  f.line([[318, 600], [330, 640]], 1.4, '#6a7290', { op: 0.6 }); // wet sheen on the knee
  f.part([[226, 680], [250, 676], [252, 706], [228, 708]], HB({ fill: mix(hab, '#3a3a2a', 0.4), sharp: true, inkW: 1 })); // darn
  f.stitches([[226, 680], [250, 676], [252, 706], [228, 708], [226, 680]], '#7a7a6a', 0.8);
  X.voidHole([248, 600], 10, 12, 0.1); // a clean hole through skirt and thigh
  // the tear-water running down the front in two dark wet streaks
  for (const x0 of [316, 330]) f.stroke([[x0, 470], [x0 + 6, 560], [x0 + 14, 660], [x0 + 22, 780]], 8, '#0a1020', { op: 0.6 });

  f.bone('torso');
  f.part(S.shape([[-0.12, 0.38, 0.36], [0.06, 0.8, 0.56], [0.3, 0.72, 0.64], [0.55, 0.62, 0.54], [0.78, 0.66, 0.6], [1.0, 0.74, 0.7]]), HB());
  f.stroke([S.at(-0.2, 0.3), S.at(-0.16, 0.6), S.at(-0.3, 0.9)], 2, '#06060a');
  f.line([S.at(0.3, 0.2), S.at(0.36, 0.4)], 1.2, habL, { op: 0.55 });
  // cincture cord, knotted, and an infirmarian's scissors and pouch on a chain
  f.part([S.at(-0.66, 0.8), S.at(0.62, 0.78), S.at(0.62, 0.85), S.at(-0.66, 0.87)], { fill: '#5a5448', tex: 'hatch126', texOp: 0.5, k: 0.6, inkW: 1.1 });
  const kn = S.at(0.5, 0.84);
  f.stroke([kn, add(kn, [6, 60]), add(kn, [2, 120])], 4, '#5a5448'); for (const y of [30, 60, 90]) f.part(ell(add(kn, [4, y]), 4.4, 4.4, 0, 8), { fill: '#5a5448', inkW: 1, cast: false });
  const ch = S.at(-0.4, 0.86);
  f.line([ch, add(ch, [-4, 30])], 1.4, '#6a6a68', { dash: '2 1.5' });
  f.part([add(ch, [-18, 30]), add(ch, [8, 30]), add(ch, [10, 62]), add(ch, [-16, 64])], { fill: '#3a2a1c', tex: 'mottle126', inkW: 1.1, sharp: true }); // pouch
  f.part([add(ch, [-16, 30]), add(ch, [8, 30]), add(ch, [6, 40]), add(ch, [-14, 42])], { fill: '#2e2216', inkW: 1, cast: false, sharp: true });
  f.line([add(ch, [12, 30]), add(ch, [16, 58])], 2, '#5a5a5c'); f.line([add(ch, [18, 30]), add(ch, [16, 58])], 2, '#5a5a5c'); ring(f, add(ch, [10, 26]), 3, 3, 1.2, '#5a5a5c'); ring(f, add(ch, [20, 26]), 3, 3, 1.2, '#5a5a5c'); // scissors

  // ---- head bowed deep: wimple close round the face, tide lines, eyes running
  f.bone('head');
  f.part(limb(add(N, mul(up, -8)), hF([[-0.08, 0.26]])[0], 36, 32), SK());
  // wimple and gorget: linen round the face, under the chin and over the upper chest
  f.part([hF([[-0.42, -0.36]])[0], hF([[0.1, -0.54]])[0], hF([[0.44, -0.34]])[0], hF([[0.46, 0.2]])[0], hF([[0.36, 0.6]])[0], S.at(0.6, 0.18), S.at(0.2, 0.3), S.at(-0.4, 0.2), S.at(-0.6, 0.04), hF([[-0.5, 0.2]])[0]], { fill: wimp, shadow: wimpS, tex: 'weave126', texOp: 0.35 });
  for (let i = 0; i < 4; i++) { const y = 0.1 + i * 0.12; f.line([S.at(-0.5, y * 0.4), S.at(0.0, y * 0.4 + 0.06), S.at(0.5, y * 0.4 + 0.02)].map((q, k) => add(q, [0, i * 6 + Math.sin(k * 2 + i) * 3])), 1.4, tide, { op: 0.65 }); } // tide lines
  B.head(f, HC, H, hA, { skin, jaw: 0.84, chin: -0.02, nose: 0.96, mouth: 'set', squint: 0.6, lips: true, lashes: true, faceHatch: false, faceShade: 0.6, jawShade: 0.25, noEar: true, iris: '#3a4a5a', eyeWhite: '#c8ccd0', hairCol: hab, browCol: '#3a3a3a', browW: 0.035 });
  f.flat(hF([[0.06, -0.08], [0.18, -0.1], [0.18, -0.03], [0.06, -0.02]]), '#4a5a7a', { op: 0.5 }); // wet, reddened? no: blue-shadowed lids
  // the face frame of the wimple over the brow and cheeks, with tide lines
  f.part(hF([[-0.42, -0.34], [-0.1, -0.56], [0.3, -0.5], [0.46, -0.32], [0.38, -0.3], [0.2, -0.4], [-0.08, -0.4], [-0.26, -0.24], [-0.3, 0.1], [-0.2, 0.42], [-0.36, 0.44], [-0.46, 0.0]]), { fill: wimp, shadow: wimpS, tex: 'weave126', texOp: 0.35 });
  f.line(hF([[-0.38, -0.2], [-0.1, -0.44], [0.3, -0.42]]), 1.3, tide, { op: 0.7 });
  f.line(hF([[-0.42, 0.06], [-0.28, -0.3]]), 1.2, tide, { op: 0.6 });
  // ---- veil: heavy black over the crown, hanging in a deep hood past the bowed face
  f.bone('veil');
  f.part(hF([[-0.72, 0.5], [-0.78, 0.0], [-0.66, -0.46], [-0.3, -0.74], [0.16, -0.78], [0.52, -0.6], [0.66, -0.34], [0.6, -0.26], [0.42, -0.42], [0.1, -0.56], [-0.3, -0.5], [-0.5, -0.2], [-0.52, 0.3]]), HB({ fill: '#1a1a22' }));
  f.stroke(hF([[-0.6, -0.4], [-0.2, -0.66], [0.3, -0.66]]), 2.6, '#4a5068', { op: 0.6 }); // wet sheen on the crown
  f.stroke(hF([[-0.62, -0.1], [-0.66, 0.2], [-0.62, 0.46]]), 2.2, '#06060a');
  X.barnacles(hF([[-0.5, -0.56], [-0.6, -0.44], [-0.36, -0.66]]).map((q, i) => [q[0], q[1], 5 - i]));
  f.stroke([hF([[-0.66, 0.0]])[0], add(hF([[-0.66, 0.0]])[0], [-6, 60]), add(hF([[-0.66, 0.0]])[0], [-2, 110])], 6, PAL.kelp); // weed hanging off the veil

  // ---- near arm, sleeve wet and clinging, the hands folded over each other
  f.bone('upperarm_n'); f.part(limb(SN, EN, 42, 38), HB());
  f.stroke([lp(SN, EN, 0.3, 12), lp(SN, EN, 0.7, 14)], 2, '#06060a');
  f.bone('forearm_n');
  f.part(limb(EN, WN, 38, 32), HB());
  f.part([lp(EN, WN, 0.2, -16), lp(EN, WN, 0.85, -18), add(WN, [-6, 34]), add(WN, [-30, 46]), add(EN, [10, 40])], HB({ fill: '#16161c' })); // the hanging sleeve mouth
  f.bone('hand_n');
  B.grip(f, add(WN, [8, 2]), EN, Math.atan2(WF[1] - EF[1], WF[0] - EF[0]), 21, skin, { shadow: skinS, tex: 'mottle126', texOp: 0.4, name: 'nun near' }); // near hand folded over it, fingers curled down round the other's back
  for (let i = 0; i < 3; i++) f.line([add(WN, [14 + i * 5, -6]), add(WN, [17 + i * 5, 4])], 0.9, INK, { op: 0.5 }); // knuckle creases
  // rosary: wooden beads looped through the fingers, a tarnished gold crucifix hanging plumb
  f.bone('rosary');
  const r0 = add(WN, [18, 8]);
  for (let i = 0; i < 9; i++) f.part(ell(add(r0, [Math.sin(i * 0.5) * 6, 8 + i * 9]), 3.4, 3.4, 0, 8), { fill: '#4a3424', inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
  const cx = add(r0, [2, 96]);
  f.part([add(cx, [-2, -6]), add(cx, [2, -6]), add(cx, [2, 2]), add(cx, [8, 2]), add(cx, [8, 6]), add(cx, [2, 6]), add(cx, [2, 22]), add(cx, [-2, 22]), add(cx, [-2, 6]), add(cx, [-8, 6]), add(cx, [-8, 2]), add(cx, [-2, 2])], { fill: PAL.dgold, inkW: 0.9, inkHeavy: 1.1, cast: false, sharp: true });
  f.flat(ell(add(cx, [0, 10]), 1.8, 3, 0, 6), PAL.verd, { op: 0.8 });

  // ---- the tears: two streams falling plumb from her eyes onto her hands, never stopping
  f.bone('tears');
  const e1 = hF([[0.16, -0.02]])[0], e2 = hF([[0.32, -0.04]])[0];
  for (const e of [e1, e2]) {
    f.stroke([e, add(e, [2, 10])], 3, water, { op: 0.8 });
    const fall = [add(e, [2, 10]), add(e, [3, 60]), add(e, [3, Math.max(40, WN[1] - e[1] - 4)])];
    f.line(fall, 2.6, water, { op: 0.8 }); f.line(fall.map(q => add(q, [-0.8, 0])), 0.9, waterL, { op: 0.8 });
  }
  for (let i = 0; i < 5; i++) X.drip(add(WN, [6 + i * 5, 26 + (i % 2) * 10]), 0.9);
  f.bone('root');
  X.puddle([290, 787], 120, 0.6);
  for (let i = 0; i < 3; i++) ring(f, [326 + i * 8, 786], 10 + i * 8, 2 + i, 1, waterL, { op: 0.4 - i * 0.1 });
  return f;
}

// ------------------------------------------------------------------ DROWNED CHOIRBOY (Small 0.6)
// A small drowned chorister standing perfectly still in a grey surplice and sodden ruff, head bowed over a hymnal
// swollen to twice its size, held up open to his face so the viewer sees its back. His mouth is open in song and the
// air in front of it is unmade: a clean-rimmed void that swallows the sound.
function drownedChoirboy() {
  const f = new Fig(foeBase(127, { shadowTint: '#262a3a', mud: '#1e2422', grimeY: 680 }));
  const X = fx(f);
  const H = 62;
  const surp = '#a6a69c', surpS = '#545666', cass = '#22232c', cassL = '#3a3c4c', skin = '#c2c6c6', skinS = '#646a80', leather = '#3a2a1e', pageC = '#c4b894', hairC = '#3a3428';
  const SP = (o = {}) => Object.assign({ fill: surp, shadow: surpS, tex: 'weave127', texOp: 0.4 }, o);
  const CS = (o = {}) => Object.assign({ fill: cass, shadow: '#0c0c10', tex: 'weave127', texOp: 0.4, light: cassL }, o);
  const SK = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle127', texOp: 0.45 }, o);
  const P = [292, 604], C = [284, 544], N = [290, 482];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const HC = add(N, add(mul(up, 32), [12, 2])), hA = 0.8, hF = frame(HC, hA, H);
  // the hymnal: spine away from him toward the viewer's right, boards open toward his face, tilted back to his eyes
  const BKc = [362, 560], bA = -0.36, bS = 0.74, bF = pts => frame(BKc, bA, bS)(pts);
  const SN = S.at(-0.34, 0.14), SF = S.at(0.42, 0.12);
  const [EN, WN] = ik(SN, bF([[-30, 56]])[0], 66, 60, 1), [EF, WF] = ik(SF, bF([[-40, 4]])[0], 64, 58, 1);
  const HN = S.at(-0.2, 1.0), KN = [282, 692], AN = [276, 760];
  const HF = S.at(0.3, 1.0), KF = [304, 690], AF = [312, 760];
  humanJoints(f, { P, T: S.at(0, 0.75), N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('hymnal', WN, 'hand_n').joint('surplice', S.at(0, 0.3), 'torso');

  // ---- legs under the cassock, small buckled shoes
  f.bone('thigh_f'); f.part(limb(HF, KF, 36, 28), CS({ fill: '#18181f' }));
  f.bone('shin_f'); f.part(limb(KF, AF, 28, 22), CS({ fill: '#18181f' }));
  f.bone('foot_f'); B.boot(f, AF, 1, 36, '#1a1612', { style: 'shoe', shaft: 0.25, tex: 'mottle127' });
  f.bone('thigh_n'); f.part(limb(HN, KN, 38, 30), CS());
  f.bone('shin_n'); f.part(limb(KN, AN, 30, 22), CS());
  f.bone('foot_n'); B.boot(f, AN, 1, 38, '#201a14', { style: 'shoe', shaft: 0.25, strap: true, tex: 'mottle127' });
  // ---- far arm up under the book
  const jc = (A, J, Bp, r, b1, b2) => [[b1, side(J, mul(E.norm(sub(J, A)), -1), r)], [b2, side(J, E.norm(sub(Bp, J)), r)]];
  split(f, () => { f.part(jointLimb(SF, EF, WF, [30, 24, 20], { point: 0.3, mus0: 0.08, mus1: 0.1 }), SP({ fill: mix(surp, surpS, 0.3) })); for (let i = 0; i < 2; i++) f.line([lp(EF, WF, 0.08 + i * 0.12, -9), lp(EF, WF, 0.12 + i * 0.12, 0), lp(EF, WF, 0.07 + i * 0.12, 9)], 1.1, '#3a3a40', { op: 0.7 }); }, jc(SF, EF, WF, 12, 'upperarm_f', 'forearm_f'));
  f.bone('hand_f'); B.grip(f, WF, EF, bA - Math.PI / 2, 16, mix(skin, skinS, 0.25), { shadow: skinS, tex: 'mottle127', texOp: 0.4, name: 'choir far' }); // fingers hooked over the top of the far board

  // ---- cassock to the ankles, the surplice over it to the knee
  f.bone('pelvis');
  f.part([S.at(-0.6, 0.6), S.at(0.6, 0.6), [330, 690], [338, 750], [330, 762, 1], [300, 756], [270, 764, 1], [246, 754], [250, 690]], CS({ over: `<rect x="230" y="700" width="120" height="70" fill="#2a3a3a" opacity="0.35"/>` }));
  f.stroke([[272, 660], [266, 720], [262, 756]], 2, '#06060a'); f.stroke([[310, 660], [318, 720], [322, 754]], 2, '#06060a');
  f.part([[262, 716], [280, 714], [282, 734], [264, 736]], CS({ fill: mix(cass, '#3a3a2a', 0.4), sharp: true, inkW: 1 })); // darn
  f.stitches([[262, 716], [280, 714], [282, 734], [264, 736], [262, 716]], '#7a7a6a', 0.7);
  f.bone('torso');
  f.part(S.shape([[-0.12, 0.36, 0.34], [0.08, 0.62, 0.5], [0.4, 0.56, 0.56], [0.7, 0.56, 0.54], [1.0, 0.62, 0.6]]), CS());
  f.bone('surplice');
  const su = [S.at(-0.7, 0.04), S.at(0.6, 0.02), S.at(0.8, 0.5), [356, 630], [370, 676], [356, 684, 1], [340, 676], [322, 690, 1], [300, 680], [278, 692, 1], [258, 680], [236, 688, 1], [222, 670], [232, 620], S.at(-0.8, 0.5)];
  f.part(su, SP({ over: `<rect x="200" y="640" width="200" height="80" fill="url(#tide127)"/>` }));
  f.defs.push(`<linearGradient id="tide127" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5a3a" stop-opacity="0"/><stop offset="0.6" stop-color="#6a5a3a" stop-opacity="0.35"/><stop offset="1" stop-color="#3a3a2a" stop-opacity="0.6"/></linearGradient>`);
  for (const q of [[[256, 560], [248, 640], [244, 690]], [[290, 580], [290, 650], [292, 696]], [[324, 590], [336, 650], [342, 692]]]) f.stroke(q, 1.8, '#3a3a40');
  for (let i = 0; i < 3; i++) f.line([[236, 650 + i * 12], [270, 656 + i * 12], [310, 650 + i * 12], [356, 656 + i * 12]].map((q, k) => add(q, [0, Math.sin(k * 2 + i) * 3])), 1.2, '#7a6a48', { op: 0.6 }); // tide lines
  X.barnacles([[...S.at(-0.5, 0.06), 4], [...S.at(-0.36, 0.02), 3.5]]);
  f.stroke([S.at(-0.6, 0.1), S.at(-0.66, 0.5), S.at(-0.6, 0.9)], 5, PAL.kelp); // weed down his back

  // ---- head bowed to the page: cropped hair, an angel's face gone grey, mouth open in song
  f.bone('head');
  f.part(limb(add(N, mul(up, -6)), hF([[-0.06, 0.26]])[0], 28, 24), SK());
  B.head(f, HC, H, hA, { skin, jaw: 0.8, chin: -0.04, nose: 0.82, mouth: 'set', squint: 0.25, lips: true, faceHatch: false, faceShade: 0.55, jawShade: 0.2, iris: '#3a4450', eyeWhite: '#d8dcd8', hairCol: hairC, browCol: '#3a3428', browW: 0.035 });
  f.part(hF([[-0.44, 0.16], [-0.5, -0.16], [-0.4, -0.46], [-0.08, -0.6], [0.24, -0.54], [0.38, -0.36], [0.3, -0.3], [0.2, -0.4], [0.04, -0.34], [-0.12, -0.38], [-0.22, -0.2], [-0.28, 0.0], [-0.3, 0.18]]), { fill: hairC, tex: 'hatch127', texOp: 0.4, shadow: '#14100a' }); // cropped hair, plastered wet
  for (const x of [0.24, 0.12, 0.0]) f.line(hF([[x, -0.46], [x + 0.04, -0.34]]), 1.2, '#6a6250', { op: 0.6 });
  f.flat(hF(ell([0.12, -0.03], 0.08, 0.03, 0, 10)), '#6a7898', { op: 0.45 }); // shadowed lower lid
  f.flat(hF([[0.16, 0.26], [0.24, 0.25], [0.31, 0.27], [0.3, 0.36], [0.23, 0.39], [0.17, 0.35]]), '#4a5a86'); // blue lips round the open mouth
  f.flat(hF([[0.18, 0.28], [0.24, 0.275], [0.28, 0.29], [0.27, 0.34], [0.22, 0.36], [0.19, 0.33]]), '#0a0c10');
  // the ruff: a sodden pleated collar drooping round the neck
  f.part([hF([[-0.5, 0.36]])[0], hF([[-0.1, 0.5]])[0], hF([[0.3, 0.52]])[0], S.at(0.6, 0.06), S.at(0.4, 0.16), S.at(-0.3, 0.14), S.at(-0.66, 0.04)], { fill: '#bcbcb0', shadow: '#5a5c66', tex: 'weave127', texOp: 0.3 });
  for (let i = 0; i < 8; i++) { const q = lerp(S.at(-0.6, 0.06), S.at(0.56, 0.08), i / 7); f.line([add(q, [0, -12]), add(q, [-2, 6])], 1.2, '#4a4c56', { op: 0.75 }); } // pleats
  // the void in front of the mouth: the air unmade, clean-rimmed, thinning to nothing at its edge
  const vc = hF([[0.42, 0.36]])[0];
  f.defs.push(`<radialGradient id="voidfade127"><stop offset="0.55" stop-color="#06050a" stop-opacity="0.95"/><stop offset="0.8" stop-color="#1a1230" stop-opacity="0.5"/><stop offset="1" stop-color="#1a1230" stop-opacity="0"/></radialGradient>`);
  // not a circle: an uneven hole in the air, longer along the line of the song, its rim present on one side and gone on the other
  const vA = hA - 0.35, vShape = k => { const r = []; for (let i = 0; i < 26; i++) { const a = Math.PI * 2 * i / 26, rr = k * (1 + 0.16 * Math.sin(3 * a + 1.1) + 0.09 * Math.sin(5 * a + 0.4)); r.push(add(vc, rot([Math.cos(a) * rr * 1.25, Math.sin(a) * rr * 0.85], vA))); } return r; };
  f.flat(vShape(27), 'url(#voidfade127)');
  f.flat(ell(add(vc, [2, 2]), 8, 8, 0, 12), PAL.voidH, { op: 0.9 });
  const rim = vShape(16); f.stroke(rim.slice(15, 26).concat(rim.slice(0, 3)), 2.4, '#e8e2d8', { op: 0.85 }); f.stroke(rim.slice(5, 9), 1.2, '#e8e2d8', { op: 0.4 }); // the clean rim, there on one side, thinning to nothing on the other

  // ---- the hymnal: back board to the viewer, swollen page block, brass corners green with verdigris, ribbons hanging
  f.bone('hymnal');
  f.part(bF([[-40, -64], [40, -70], [44, 62], [-36, 68]]), { fill: mix(leather, '#000', 0.2), tex: 'mottle127', shadow: '#120c08' }); // far board, behind
  f.part(bF([[-36, -60], [30, -66], [40, -40], [44, 0], [40, 40], [34, 60], [-30, 64], [-40, 30], [-46, 0], [-42, -30]]), { fill: pageC, shadow: '#9a8a64', shade: 0.25, tex: 'weave127', texOp: 0.3 }); // the swollen page block, cockled
  for (let i = 0; i < 7; i++) f.line(bF([[-40 + i * 2, -56 + i * 3], [-44 + i, 0], [-38 + i * 2, 58 - i * 3]]), 0.9, '#7a6a48', { op: 0.7 }); // page edges
  f.part(bF([[-10, -62], [40, -70], [50, -66], [56, 60], [48, 66], [-4, 70], [6, 0]]), { fill: leather, tex: 'mottle127', texOp: 0.6, shadow: '#120c08' }); // near board: its back to us
  f.part(bF([[40, -70], [52, -68], [58, 62], [48, 66]]), { fill: mix(leather, '#000', 0.25), shade: 0.3, inkW: 1.1 }); // spine
  for (const y of [-40, -10, 20, 48]) f.line(bF([[42, y], [56, y + 1]]), 2, '#1a120a'); // raised bands
  for (const [x, y, a] of [[44, -64, 0], [50, 58, 1]]) { f.part(bF([[x - 10, y - 4 + a * 8], [x + 4, y - 6 + a * 6], [x + 6, y + 6 - a * 2], [x - 8, y + 6]]), { fill: PAL.dgold, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false }); X.verdi(bF([[x - 2, y]])[0], 3, 2, 3); } // brass corners
  f.part(bF([[-6, 20], [10, 18], [10, 30], [-6, 32]]), { fill: PAL.dgold, inkW: 1, cast: false, sharp: true }); // clasp, hanging open
  f.line(bF([[2, 30], [0, 48]]), 2.4, '#2a1a10');
  f.scratches(bF([[20, 0]])[0], 16, 4, '#8a7a5a');
  X.barnacles([bF([[24, 40]])[0], bF([[30, 50]])[0]].map((q, i) => [q[0], q[1], 4 - i]));
  for (const [x, l, c] of [[-20, 50, PAL.bbL], [-12, 40, '#7a2a22']]) { const t = bF([[x, 64]])[0]; f.stroke([t, add(t, [1, l * 0.5]), add(t, [-1, l])], 4, c); } // ribbons hanging plumb, a faded rubric one among them
  X.drip(bF([[34, 70]])[0]);
  // ---- near arm in the wide surplice sleeve, fist under the near board
  split(f, () => { f.part(jointLimb(SN, EN, WN, [34, 28, 22], { point: 0.3, mus0: 0.08, mus1: 0.1 }), SP()); for (let i = 0; i < 2; i++) f.line([lp(EN, WN, 0.08 + i * 0.12, -11), lp(EN, WN, 0.12 + i * 0.12, 0), lp(EN, WN, 0.07 + i * 0.12, 11)], 1.1, '#3a3a40', { op: 0.7 }); }, jc(SN, EN, WN, 14, 'upperarm_n', 'forearm_n'));
  f.bone('forearm_n');
  f.part([lp(EN, WN, 0.2, -10), lp(EN, WN, 0.8, -12), add(WN, [-6, 30]), add(WN, [-30, 36]), add(EN, [8, 34])], SP({ fill: mix(surp, surpS, 0.15) })); // hanging sleeve
  f.bone('hand_n');
  B.grip(f, WN, EN, bA, 17, skin, { shadow: skinS, tex: 'mottle127', texOp: 0.4, name: 'choir near' }); // knuckles along the bottom edge of the near board
  f.bone('root');
  X.puddle([296, 786], 90, 0.45);
  return f;
}

module.exports = {
  heroes: [
    { key: 'brine_siren', name: 'Brine Siren', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: brineSiren },
    { key: 'eel_kin_biter', name: 'Eel-kin Biter', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: eelKinBiter },
    { key: 'drowned_bell_ringer', name: 'Drowned Bell-Ringer', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: drownedBellRinger },
    { key: 'lamprey_swarm', name: 'Lamprey Swarm', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: lampreySwarm },
    { key: 'bloated_corpse', name: 'Bloated Corpse', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: bloatedCorpse },
    { key: 'hookline_fisher', name: 'Hookline Fisher', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: hooklineFisher },
    { key: 'weeping_nun', name: 'Weeping Nun', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: weepingNun },
    { key: 'drowned_choirboy', name: 'Drowned Choirboy', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: drownedChoirboy },
  ],
};
