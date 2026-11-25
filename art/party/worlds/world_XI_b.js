// World XI, The Stilled Spire (Frost + Lightning, Lockdown), second batch of eleven: bible/world_XI_stilled_spire.md
// entries added 2026-11-23. Helpers in worlds/kit_XI_b.js (which requires and re-exports kit_XI, the first batch's kit).
// Frost (dominant) freezes bodies mid-motion: rime on the windward (front) side, icicles plumb, fur and cloth stopped.
// Lightning fuses brass and leaves aurora-green Lichtenberg burns. Palette: brass, pale blue, aurora green, plus ink
// black, bone and grey. No eye motifs: lenses and mirrors are shown at an angle with the room in them, frost and cracks.
// Foes are drawn facing right with kit.foeBase (light upper right in drawing space) and flipped. Seeds 1120 + index.
'use strict';
const K = require('../kit');
const W = require('./kit_XI_b');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P, split, side, ang, hard, band } = W;
const T = K.TIERS;
const deg = d => d * Math.PI / 180;

// ------------------------------------------------------------------ EPHEMERIS CLERK (cast, human 0.95)
// One of the observatory's computers, frozen mid-sum: thin and round-shouldered, the upper back curved over the slanted
// writing desk strapped to his chest, the head bent to the page, the near hand rigid round a quill lifted from a figure,
// a black icicle of frozen ink hanging from the nib. From the desk's far edge a fan of ruled paper tables stands out
// stiff with frost like a wing. Weight on the heels, the knees soft. Black short gown with ink-stained cuffs, pale blue
// sleeve garters, fingerless mittens, a felt cap with spare quills in its band, spectacles frosted white. Lightning ran
// from the desk's brass fittings into the fingers, which are fused to the quill.
// Rig: humanoid + desk (torso), fan (desk), quill (hand_n), inkhorn (desk), board (pelvis), skirt (pelvis), cap (head).
// Motion: idle is the quill scratching once and freezing; attack is writing a hero into the table (the hand strokes).
function ephemerisClerk() {
  const seed = 1124, CW = 760, CH = T.human[1], f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 95;
  const N = [330, 300], C = [258, 382], Pv = [298, 472];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.08, 0.1), SF = S.at(0.3, 0.06);
  const EN = [374, 393], WN = [468, 290];
  const EF = [392, 436], WF = [448, 404];
  const HN = S.at(-0.12, 1.0), KN = [334, 616], AN = [318, 744];
  const HF = S.at(0.28, 0.98), KF = [302, 612], AF = [276, 742];
  const HC = [374, 258], hA = 0.7;
  const SKN = (o = {}) => W.SKI(f, Object.assign({ shadow: '#565c72' }, o));
  const GOWN = (o = {}) => W.ROBE(f, Object.assign({ fill: '#25282f', shadow: '#111216', light: '#454b58' }, o));
  const TUN = (o = {}) => W.WOOL(f, Object.assign({ fill: '#5c5a56', shadow: '#2a2826' }, o));
  const hose = { fill: '#3e3e42', shadow: '#1a1a1e', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 };
  const OAK = (o = {}) => Object.assign({ fill: '#5a4a36', shadow: '#241c14', light: '#8a765a', shade: 0.42, tex: 'wood' + seed, texOp: 0.55 }, o);
  // the desk: side panel (trapezoid, thicker at the far edge), the slanted top seen almost edge-on
  const dNT = [366, 350], dFT = [502, 318], dFB = [506, 392], dNB = [370, 400];
  const qAx = deg(60), qc = WN, nib = add(qc, rot([28, 0], qAx)), fe = add(qc, rot([-54, 0], qAx));
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.15, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('desk', S.at(0.5, 0.36), 'torso').joint('fan', dFT, 'desk').joint('quill', WN, 'hand_n').joint('inkhorn', lerp(dNB, dFB, 0.35), 'desk');
  f.joint('board', S.at(-0.5, 0.9), 'pelvis').joint('skirt', S.at(0, 0.84), 'pelvis').joint('cap', add(HC, [-10, -30]), 'head');

  // ---- far leg: hose, rag-wrapped felt slipper, the heel taking the weight
  f.bone('thigh_f');
  W.legTube(f, HF, KF, AF, [70, 52, 38], Object.assign({}, hose, { fill: '#323236' }), '_f', { A: AF, bq: [[1, 0.3, 0.14, 0.18]] });
  f.bone('foot_f'); W.ragSlipper(f, [AF[0] + 62, gy], 82, W.WOOL(f, { fill: '#4a463e', shadow: '#201e1a' }), { rag: '#7a7468' });
  // ---- far arm under the desk, the palm up holding its weight
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [40, 34, 28], GOWN({ fill: '#22262e' }), '_f');
  f.bone('hand_f');
  W.openHand(f, WF, ang(EF, WF) - 0.1, 50, { look: SKN({ fill: mix(P.skinI, '#5a6070', 0.15) }), curl: 0.45, spread: 0.08, flip: true });
  f.part(K.chain([lp(EF, WF, 0.75), lp(EF, WF, 1.02)], [30, 30]), W.WOOL(f, { fill: '#3a3a40', cast: false })); // fingerless mitten cuff

  // ---- near leg
  f.bone('thigh_n');
  W.legTube(f, HN, KN, AN, [72, 54, 40], hose, '_n', { A: AN, bp: [[1, 0.3, 0.14, 0.18]] });
  f.bone('shin_n'); W.rimeCrust(f, [lp(KN, AN, 0.1, -18), lp(KN, AN, 0.85, -14)], 5, [1, -0.2]);
  f.bone('foot_n'); W.ragSlipper(f, [AN[0] + 64, gy], 84, W.WOOL(f, { fill: '#524c42', shadow: '#22201c' }), { rag: '#8a8478' });

  // ---- tunic body under the gown: thin, the upper back rounded from desk work
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.26, 0.3], [0.06, 0.52, 0.42], [0.22, 0.62, 0.5], [0.45, 0.52, 0.52], [0.7, 0.46, 0.48], [0.9, 0.5, 0.5], [1.04, 0.54, 0.52]]);
  f.part(torso, TUN());
  // the short black gown, open at the front, over the shoulders and down the back to the knee
  const gown = [S.at(-0.2, -0.08), S.at(0.3, -0.04), S.at(0.36, 0.3), S.at(0.24, 0.8), S.at(0.3, 1.1), [352, 590], [336, 604, 1], [318, 594], [296, 610, 1], [274, 596], [250, 606, 1], [234, 590], S.at(-0.66, 1.0), S.at(-0.7, 0.5), S.at(-0.6, 0.1)];
  f.part(gown, GOWN());
  W.clipDraw(f, gown, () => {
    for (const g of [[S.at(-0.4, 0.15), S.at(-0.5, 0.6), [250, 590]], [S.at(-0.1, 0.3), S.at(-0.2, 0.7), [290, 600]], [S.at(0.1, 0.5), S.at(0.1, 0.9), [330, 596]]]) W.fold(f, g, 2);
    W.hoar(f, S.at(-0.3, 0.1), 40, 30, 0.5);
    f.flat([[220, 560], [370, 560], [370, 620], [220, 620]], P.mud, { op: 0.3 });
    f.part(hard([S.at(-0.5, 0.62), S.at(-0.3, 0.6), S.at(-0.3, 0.76), S.at(-0.5, 0.78)]), GOWN({ fill: '#24282f', cast: false, inkW: 1 })); f.stitches([S.at(-0.5, 0.62), S.at(-0.3, 0.6), S.at(-0.3, 0.76), S.at(-0.5, 0.78), S.at(-0.5, 0.62)], '#8a92a0', 0.8);
    for (let i = 0; i < 6; i++) f.flat(ell([238 + i * 22, 598 + (i % 2) * 4], 6, 3, 0, 8), '#0c0e12', { op: 0.5 }); // worn hem
  });
  W.icicles(f, [[352, 590], [336, 604], [318, 594], [296, 610], [274, 596], [250, 606]], 7, 8, 22);
  // the gown's rimed shoulder and the round of the back
  W.rimeCrust(f, [S.at(-0.2, -0.1), S.at(0.2, -0.06), S.at(0.36, 0.1)], 7, [1, -0.3]);
  // belt, pen-knife, a counting board hung at the hip
  f.bone('pelvis');
  f.part([S.at(-0.56, 0.78), S.at(0.5, 0.76), S.at(0.52, 0.85), S.at(-0.58, 0.87)], W.LEA(f, { sharp: true }));
  f.part(hard([S.at(0.18, 0.75), S.at(0.3, 0.75), S.at(0.3, 0.86), S.at(0.18, 0.86)]), W.BRD(f, { inkW: 1, cast: false }));
  const pk = S.at(0.0, 0.84); // the pen-knife in a leather sheath, horn handle
  f.part(hard([add(pk, [-6, -2]), add(pk, [6, -2]), add(pk, [3, 44]), add(pk, [-3, 44])]), W.LEA(f, { fill: '#3a2e26', inkW: 1, cast: false }));
  f.part(limb(add(pk, [0, -2]), add(pk, [6, -30]), 7, 6, { steps: 3 }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1, cast: false });
  f.bone('board');
  const bc = S.at(-0.62, 0.98);
  W.rope(f, [S.at(-0.5, 0.84), add(bc, [10, -36])], 2, { col: '#5a4c3e' });
  const bp = hard([add(bc, [-30, -34]), add(bc, [34, -38]), add(bc, [36, 30]), add(bc, [-28, 34])]);
  f.part(bp, OAK());
  W.clipDraw(f, bp, () => { for (let i = 0; i < 4; i++) { const y = -24 + i * 16; f.line([add(bc, [-28, y + 2]), add(bc, [34, y - 2])], 1.4, P.brassD); for (let k = 0; k < 6; k++) { const x = -20 + k * 9 + (i % 2 ? 6 : 0) + (k > 2 ? 10 : 0); f.part(ell(add(bc, [x, y + 1 - x * 0.06]), 4, 3.4, 0, 8), { fill: P.boneD, shade: 0.4, inkW: 0.8, cast: false, light: P.bone }); } } });
  f.part(hard([add(bc, [-30, -34]), add(bc, [34, -38]), add(bc, [34, -32]), add(bc, [-30, -28])]), OAK({ fill: '#3e3226', cast: false, inkW: 1 }));
  W.icicles(f, [add(bc, [-28, 34]), add(bc, [36, 30])], 3, 8, 18);

  // ---- neck and head: long-nosed, tired, bent to the page; spectacles frosted white; lips moving on a number
  f.bone('head');
  f.part(limb(S.at(0.12, -0.04), add(HC, rot([-0.12 * H, 0.38 * H], hA)), 34, 30), SKN());
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: P.skinI, jaw: 0.94, chin: -0.01, nose: 1.3, hook: 0.2, mouth: 'set', squint: 0.5, browDown: 0.1, browW: 0.04, age: true, gaunt: true, faceShade: 0.8, jawShade: 0.42,
    eyeWhite: '#d8e2e8', iris: '#2a3038', hairCol: '#6e6a64', browCol: '#cfd8dc', beard: 'stubble', beardCol: '#7a7670',
  });
  f.flat(hF([[0.18, 0.282], [0.25, 0.275], [0.3, 0.285], [0.27, 0.31], [0.21, 0.31]]), '#16161a', { op: 0.85 }); // lips parted on a number
  W.frostSpecs(f, hF);
  W.clipDraw(f, hF([[0.12, -0.3], [0.4, -0.2], [0.38, 0.3], [0.2, 0.36], [0.12, 0.1]]), () => W.hoar(f, hF([[0.28, 0.02]])[0], 22, 26, 0.7)); // rime on the windward cheek
  W.facets(f, hF([[0.1, 0.12]])[0], 14, 12, 3, { s: 0.5, op: 0.22 });
  W.icicle(f, hF([[0.33, 0.16]])[0], 9, 3); W.icicle(f, hF([[0.12, 0.5]])[0], 8, 3);
  for (let i = 0; i < 6; i++) f.stroke(hF([[-0.38 + i * 0.03, -0.06 + i * 0.03], [-0.42 + i * 0.03, 0.06 + i * 0.03], [-0.38 + i * 0.03, 0.16 + i * 0.02]]), 3, i % 2 ? '#8a8680' : '#4a4844', { op: 0.8 }); // lank hair under the cap
  // felt cap: soft and slouched, a band with spare quills stuck in it
  f.bone('cap');
  const cap = hF([[-0.46, -0.08], [-0.5, -0.34], [-0.36, -0.58], [-0.08, -0.66], [0.18, -0.6], [0.3, -0.42], [0.3, -0.28], [0.0, -0.3], [-0.3, -0.2]]);
  f.part(cap, W.WOOL(f, { fill: '#3a3a3e', shadow: '#16161a', tex: 'weave' + seed }));
  W.clipDraw(f, cap, () => { W.fold(f, hF([[-0.3, -0.56], [-0.2, -0.36]]), 1.6); W.fold(f, hF([[0.0, -0.62], [0.06, -0.4]]), 1.4); W.hoar(f, hF([[0.1, -0.56]])[0], 22, 12, 0.8); });
  const capB = hF([[-0.48, -0.1], [-0.3, -0.22], [0.0, -0.32], [0.31, -0.3], [0.31, -0.22], [0.0, -0.24], [-0.3, -0.14], [-0.46, -0.02]]);
  f.part(capB, W.WOOL(f, { fill: '#4a4a4e', cast: false, inkW: 1.1 }));
  for (const [u, a, l] of [[-0.4, -2.75, 0.5], [-0.3, -2.6, 0.56], [-0.22, -2.9, 0.44]]) { // spare quills in the band
    const q0 = hF([[u, -0.16]])[0], q1 = add(q0, rot([l * H, 0], a + hA));
    f.line([q0, q1], 2.2, P.bone); f.line([q0, q1], 0.8, INK, { op: 0.5 });
    const vane = [lerp(q0, q1, 0.35), add(lerp(q0, q1, 0.6), rot([0, -4], a + hA)), q1, add(lerp(q0, q1, 0.7), rot([0, 3], a + hA))];
    f.part(vane, { fill: '#a8aca6', shadow: '#6a7078', shade: 0.35, inkW: 1, cast: false, light: '#ffffff' });
    for (let k = 1; k < 5; k++) f.line([lerp(q0, q1, 0.3 + k * 0.15), add(lerp(q0, q1, 0.25 + k * 0.15), rot([0, -6], a + hA))], 0.8, INK, { op: 0.5 });
  }
  W.rimeCrust(f, hF([[-0.36, -0.6], [-0.08, -0.68], [0.18, -0.62], [0.3, -0.44]]), 6, [1, -0.3]);
  W.icicles(f, hF([[0.31, -0.24], [0.0, -0.24], [-0.3, -0.14]]), 4, 6, 16);

  // ---- the paper tables: a fan of ruled sheets standing out stiff from the desk's far edge like a wing
  f.bone('fan');
  const root = add(dFT, [-6, 6]);
  const sheets = [[-88, 210], [-70, 232], [-52, 222], [-34, 214], [-16, 196], [2, 170]];
  sheets.forEach(([a0, L], i) => {
    const a = deg(a0), d = rot([1, 0], a), n2 = [-d[1], d[0]], w0 = 22, w1 = 64 + i * 2;
    const tip = add(root, mul(d, L)), curl = 8 + (i % 3) * 5;
    const sh = [add(root, mul(n2, -w0 / 2)), add(lerp(root, tip, 0.5), mul(n2, -w1 * 0.45 - 2)), add(tip, mul(n2, -w1 / 2)), add(add(tip, mul(d, curl * 0.4)), mul(n2, 0)), add(tip, mul(n2, w1 / 2 - curl)), add(lerp(root, tip, 0.5), mul(n2, w1 * 0.4)), add(root, mul(n2, w0 / 2))];
    f.part(sh, { fill: i % 2 ? '#ddd8c8' : '#d2ccba', shadow: '#6a6a66', light: '#f6f2e6', shade: 0.3, inkW: 1.3, tex: 'rime' + seed, texOp: 0.3, k: 0.7, cast: i === 0 });
    W.clipDraw(f, sh, () => {
      for (let r = 1; r < 9; r++) { const t = 0.16 + r * 0.1; f.line([add(lerp(root, tip, t), mul(n2, -w1 * 0.5)), add(lerp(root, tip, t), mul(n2, w1 * 0.5))], 0.7, '#6a6a70', { op: 0.6 }); } // ruled rows
      for (const c of [-0.2, 0.12]) f.line([add(lerp(root, tip, 0.1), mul(n2, c * w1)), add(tip, mul(n2, c * w1))], 0.9, '#8a3a30', { op: 0.55 }); // rubric column rules
      for (let r = 1; r < 9; r++) for (let k = 0; k < 4; k++) { const t = 0.2 + r * 0.1, q = add(lerp(root, tip, t), mul(n2, -w1 * 0.4 + k * w1 * 0.22)); f.line([q, add(q, mul(n2, 6 + (r * k % 3) * 3))], 1.1, INK, { op: 0.55 }); } // the figures
      W.hoar(f, add(tip, mul(d, -30)), 30, 24, 0.7);
      if (i === 2) W.lichtenberg(f, lerp(root, tip, 0.25), a, 70, 1.6, { depth: 2, col: '#3a3a36' });
    });
    W.rimeCrust(f, [add(tip, mul(n2, -w1 / 2)), add(add(tip, mul(d, curl * 0.4)), mul(n2, 0)), add(tip, mul(n2, w1 / 2 - curl))], 5, [1, -0.3]);
  });
  W.icicles(f, sheets.slice(3).map(([a0, L]) => add(add(root, mul(rot([1, 0], deg(a0)), L)), mul(rot([0, 1], deg(a0)), 20))), 4, 8, 20);

  // ---- the writing desk on its straps
  f.bone('desk');
  f.part([S.at(0.2, -0.04), S.at(0.34, -0.04), dFT, add(dFT, [-10, 6])], W.LEA(f, { sharp: true })); // neck strap to the far corner
  const top = hard([dNT, dFT, add(dFT, [-4, -8]), add(dNT, [-2, -6])]);
  f.part(top, { fill: '#d6d0c0', shadow: '#6a6660', shade: 0.3, inkW: 1.2, cast: false, light: '#f4f0e4' }); // the page on the slope, a sliver
  const side_ = hard([dNT, dFT, dFB, dNB]);
  f.part(side_, OAK());
  W.clipDraw(f, side_, () => {
    f.line([lerp(dNT, dNB, 0.25), lerp(dFT, dFB, 0.2)], 1.4, INK, { op: 0.5 }); // the drawer line
    f.part(hard([lerp(lerp(dNT, dNB, 0.45), lerp(dFT, dFB, 0.45), 0.4), lerp(lerp(dNT, dNB, 0.45), lerp(dFT, dFB, 0.45), 0.6), lerp(lerp(dNT, dNB, 0.7), lerp(dFT, dFB, 0.7), 0.6), lerp(lerp(dNT, dNB, 0.7), lerp(dFT, dFB, 0.7), 0.4)]), W.BR(f, { inkW: 1, cast: false })); // brass drawer pull plate
    f.flat(ell(lerp(lerp(dNT, dNB, 0.58), lerp(dFT, dFB, 0.58), 0.5), 3, 4, 0, 8), '#0c0c10');
    f.flat(ell(lerp(dNB, dFB, 0.3), 30, 16, -0.2, 12), '#101014', { op: 0.55 }); // frozen ink spill
    W.hoar(f, lerp(dFT, dFB, 0.4), 30, 40, 0.6);
    f.scratches(lerp(dNT, dFB, 0.5), 30, 6, '#a89878');
  });
  for (const [a, b] of [[dNT, [0, 1]], [dFT, [-1, 1]], [dFB, [-1, -1]], [dNB, [1, -1]]]) { // brass corner fittings
    const q = hard([a, add(a, [b[0] * 20, 0]), add(a, [b[0] * 14, b[1] * 8]), add(a, [0, b[1] * 18])]);
    f.part(q, W.BR(f, { inkW: 1.1, cast: false })); f.rivet(add(a, [b[0] * 6, b[1] * 6]), 2, P.brassL);
  }
  W.fusedBead(f, add(dFT, [-14, 10]), 3);
  // the lead weight on the page's far corner
  f.part(hard([add(dFT, [-46, 2]), add(dFT, [-20, -6]), add(dFT, [-18, -18]), add(dFT, [-44, -12])]), { fill: '#6a6e74', shadow: '#2a2c32', shade: 0.4, inkW: 1.2, tex: 'pit' + seed, texOp: 0.6 });
  // waist strap round the back
  f.part([dNB, add(dNB, [-6, -12]), S.at(-0.2, 0.56), S.at(-0.24, 0.64)], W.LEA(f, { sharp: true, fill: '#3e342c' }));
  W.rimeCrust(f, [add(dNT, [-2, -8]), add(dFT, [-4, -10])], 5, [1, -0.3]);
  W.icicles(f, [dNB, dFB], 6, 8, 24);
  // the ink horn on its cord, frozen solid, ink icicles at the lip
  f.bone('inkhorn');
  const ih = add(lerp(dNB, dFB, 0.35), [0, 40]);
  W.rope(f, [lerp(dNB, dFB, 0.35), add(ih, [-2, -14])], 1.8, { col: '#4a3e34' });
  // a cow's horn: the wide mouth up, stoppered, curving down and back to a curled tip, bound with two cord rings
  const hc = W.spline([add(ih, [0, -12]), add(ih, [2, 14]), add(ih, [-8, 34]), add(ih, [-22, 42])], 3);
  const horn = W.ribbon(hc, t => 24 * (1 - t * 0.85));
  f.part(horn, { fill: '#b8ac94', shadow: '#4a4236', light: '#e8dcc0', shade: 0.4, tex: 'mottle' + seed, texOp: 0.4 });
  f.part(ell(add(ih, [0, -13]), 12, 4, 0, 10), { fill: '#3a2e26', shade: 0.3, inkW: 1.1, cast: false }); // the cork
  for (const t of [0.15, 0.4]) { const q = hc[Math.floor(t * (hc.length - 1))]; f.line([add(q, [-11 * (1 - t), -1]), add(q, [11 * (1 - t), 1])], 1.6, '#4a3e34'); }
  f.flat(ell(add(ih, [6, 0]), 4, 10, 0.1, 8), '#0a0a0e', { op: 0.6 }); // ink frozen in a run down the side
  W.icicle(f, add(ih, [8, 8]), 16, 4, { col: '#202028' }); W.icicle(f, add(ih, [-20, 42]), 10, 3);

  // ---- near arm: gown sleeve, a pale blue garter, an ink-stained cuff, the mittened fist rigid round the quill
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [42, 36, 30], GOWN({ fill: '#30343e' }), '_n', { bp: [[0, 0.5, 0.1, 0.2]], bq: [[1, 0.3, 0.1, 0.2]] });
  f.bone('upperarm_n'); W.fold(f, [lp(SN, EN, 0.4, 10), lp(SN, EN, 0.75, -6)], 1.6);
  f.bone('forearm_n');
  f.part(K.chain([lp(EN, WN, 0.28), lp(EN, WN, 0.4)], [40, 39]), W.WOOL(f, { fill: '#8aa4b8', shadow: '#3a4a5c', light: '#c8dce8', cast: false })); // pale blue sleeve garter
  f.line([lp(EN, WN, 0.34, -19), lp(EN, WN, 0.34, 19)], 1, INK, { op: 0.5 });
  const cf = K.chain([lp(EN, WN, 0.66), lp(EN, WN, 0.84)], [38, 36]);
  f.part(cf, GOWN({ fill: '#3a3e48', cast: false })); // turned cuff
  W.clipDraw(f, cf, () => { f.flat(ell(lp(EN, WN, 0.76, 6), 12, 8, 0.4, 10), '#0a0a0e', { op: 0.75 }); f.flat(ell(lp(EN, WN, 0.7, -8), 6, 5, 0, 8), '#0a0a0e', { op: 0.6 }); }); // ink stains
  W.rimeCrust(f, [lp(EN, WN, 0.1, -16), lp(EN, WN, 0.6, -15)], 5, [1, -0.3]);
  W.icicles(f, [lp(SN, EN, 0.95, 14), lp(EN, WN, 0.3, 15)], 3, 6, 16);
  // the quill: feather up past the knuckles, nib below, ink frozen into a black icicle from the nib
  f.bone('quill');
  f.line([nib, fe], 3, P.bone); f.line([nib, fe], 1, INK, { op: 0.5 });
  const vd = rot([1, 0], qAx + Math.PI), vn = [-vd[1], vd[0]];
  const vane = [lerp(qc, fe, 0.35), add(lerp(qc, fe, 0.6), mul(vn, -9)), add(fe, mul(vn, -3)), fe, add(lerp(qc, fe, 0.75), mul(vn, 6))];
  f.part(vane, { fill: '#e0e2dc', shadow: '#6a7078', shade: 0.35, inkW: 1.1, cast: false, light: '#ffffff' });
  for (let k = 1; k < 6; k++) f.line([lerp(lerp(qc, fe, 0.35), fe, k / 6), add(lerp(lerp(qc, fe, 0.35), fe, k / 6 - 0.08), mul(vn, -8))], 0.8, INK, { op: 0.5 });
  W.hoar(f, lerp(qc, fe, 0.8), 10, 12, 0.7);
  f.part(hard([add(nib, rot([-8, -2.4], qAx)), add(nib, rot([2, 0], qAx)), add(nib, rot([-8, 2.4], qAx))]), { fill: '#2a2a2e', shade: 0.3, inkW: 0.8, cast: false });
  W.icicle(f, add(nib, [0, 1]), 13, 3.6, { col: '#1a1a22' });
  f.bone('hand_n');
  const g = B.grip(f, WN, EN, qAx, 26, P.skinI, { shadow: '#565c72', tex: 'mottle' + seed, texOp: 0.4, name: 'clerk quill' });
  W.fistDetail(f, g, 26 * 1.18, P.skinI, { wrinkle: false });
  f.part(K.chain([lp(EN, WN, 0.84), lp(EN, WN, 1.02)], [34, 34]), W.WOOL(f, { fill: '#3e3e44', cast: false })); // fingerless mitten
  for (let i = 0; i < 4; i++) f.line([lp(EN, WN, 0.86 + i * 0.04, -16), lp(EN, WN, 0.86 + i * 0.04, 16)], 0.8, INK, { op: 0.35 });
  // aurora burns run from the desk's brass corner into the fingers fused to the quill
  W.lichtenberg(f, add(dFT, [-8, 2]), deg(-135), 40, 1.6, { depth: 2 });
  W.weld(f, [add(WN, [6, 10]), add(WN, [12, 2])], 3, { lich: false });
  W.facets(f, WN, 10, 10, 2, { s: 0.5 });

  f.bone('root');
  f.flat(ell([310, gy + 4], 130, 10, 0, 18), '#000', { op: 0.28 });
  return f;
}

// ------------------------------------------------------------------ THE PATRONESS (cast, human 1.0)
// The noblewoman who paid for the spire, frozen as she turned to look: upright and imperious, weight on the back foot
// under the gown, a brass spyglass extended and levelled at the party in the far hand, the near fist on her hip with the
// elbow cocked back. A houppelande of pale blue velvet gone grey, belted high under the bust with a girdle of brass
// plaques, grey fur trim matted with frost, deep hanging sleeves frozen stiff and pointing straight down with dagged edges
// and icicles, the train frozen in a sweep behind her. A horned headdress: two padded horns wrapped in brass net. A heavy-
// jawed, middle-aged face, plucked high brow, pursed mouth, one cheek pushed up against the eyepiece as she squints.
// Aurora burns run from the spyglass's brass into her gloved hand and up the sleeve; a ring has fused through the glove.
// Rig: humanoid + spyglass (hand_f), sleeve_n (upperarm_n), sleeve_f (forearm_f), train, skirt (pelvis), headdress
// (head), chatelaine (pelvis). Motion: idle lowers the glass, sniffs and raises it; attack fixes a hero through it.
function patroness() {
  const seed = 1126, CW = 900, CH = T.human[1], f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 100;
  const N = [318, 270], C = [324, 372], Pv = [296, 470];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.28, 0.12), SF = S.at(0.34, 0.08);
  const EN = [212, 380], WN = S.at(-0.22, 0.76);
  const EF = [436, 314], WF = [486, 206];
  const HN = S.at(-0.24, 1.0), KN = [262, 620], AN = [236, 752];
  const HF = S.at(0.22, 0.98), KF = [330, 622], AF = [356, 752];
  const HC = [342, 200], hA = 0.02;
  const hF = frame(HC, hA, H);
  const eye = hF([[0.13, -0.06]])[0], sg0 = add(eye, [6, 2]), sg1 = [664, 196], sgA = ang(sg0, sg1); // the spyglass axis
  const VEL = (o = {}) => Object.assign({ fill: '#8794a0', shadow: '#36404e', light: '#c4d0da', shade: 0.42, tex: 'mottle' + seed, texOp: 0.45 }, o);
  const VELD = (o = {}) => VEL(Object.assign({ fill: '#76828e', shadow: '#2c3440' }, o));
  const FUR = (o = {}) => Object.assign({ fill: '#8a8680', shadow: '#3a3834', light: '#d8dcdc', shade: 0.42, tex: 'rime' + seed, texOp: 0.5 }, o);
  const GLV = (o = {}) => Object.assign({ fill: '#5a5450', shadow: '#24201e', light: '#8a827a', shade: 0.42, tex: 'craze' + seed, texOp: 0.3 }, o);
  const SKN = (o = {}) => W.SKI(f, Object.assign({ shadow: '#5a5e72' }, o));
  const furEdge = (pts, w) => { const C2 = W.spline(pts, 4); f.part(W.ribbon(C2, w), FUR({ k: 0.9 })); for (let i = 0; i < C2.length; i += 2) { const q = C2[i], d = E.norm(sub(C2[Math.min(C2.length - 1, i + 1)], C2[Math.max(0, i - 1)])), n2 = [-d[1], d[0]]; f.line([add(q, mul(n2, -w * 0.45)), add(add(q, mul(n2, w * 0.1)), mul(d, 3)), add(q, mul(n2, w * 0.5))], 1, i % 4 ? INK : '#f2f6f8', { op: 0.55 }); } };
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.15, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('spyglass', WF, 'hand_f').joint('sleeve_n', lerp(SN, EN, 0.7), 'upperarm_n').joint('sleeve_f', lerp(EF, WF, 0.1), 'forearm_f');
  f.joint('train', [230, 700], 'pelvis').joint('skirt', S.at(0, 0.62), 'pelvis').joint('headdress', hF([[0, -0.4]])[0], 'head').joint('chatelaine', S.at(0.2, 0.66), 'pelvis');

  // ---- the train, frozen in a sweep behind her (behind everything), a crust of frost along its hem
  f.bone('train');
  const tr = [[250, 560], [214, 640], [170, 700], [112, 742], [58, 760], [36, 778, 1], [60, 792, 1], [170, 794], [260, 794], [300, 700]];
  f.part(tr, VELD());
  W.clipDraw(f, tr, () => { for (const g of [[[230, 620], [160, 720], [90, 770]], [[260, 650], [210, 740], [170, 790]], [[280, 680], [260, 790]]]) W.fold(f, g, 2.2); W.hoar(f, [120, 760], 70, 30, 0.7); f.flat([[30, 760], [300, 760], [300, 800], [30, 800]], P.mud, { op: 0.3 }); });
  furEdge([[40, 780], [110, 790], [200, 792], [270, 792]], 16);
  W.rimeCrust(f, [[38, 774], [70, 758], [130, 740], [190, 706], [232, 650]], 9, [-0.6, -1]);
  W.icicles(f, [[60, 760], [120, 742], [180, 702]], 5, 8, 18);

  // ---- legs under the gown (whole, for the rig), pointed shoes; only the near toe shows at the hem
  const hose = { fill: '#4a4a50', shadow: '#1e1e24', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 };
  f.bone('thigh_n'); W.legTube(f, HN, KN, AN, [84, 60, 42], hose, '_n', { A: AN });
  f.bone('foot_n'); f.part([add(AN, [-26, -14]), add(AN, [20, -14]), add(AN, [70, 22]), add(AN, [96, 36]), add(AN, [60, 38]), add(AN, [-30, 38])], W.LEA(f, { fill: '#3a3438' }));
  f.bone('thigh_f'); W.legTube(f, HF, KF, AF, [84, 60, 42], hose, '_f', { A: AF });
  f.bone('foot_f'); f.part([add(AF, [-26, -14]), add(AF, [20, -14]), add(AF, [74, 24]), add(AF, [104, 36]), add(AF, [62, 38]), add(AF, [-30, 38])], W.LEA(f, { fill: '#423a3e' }));
  W.rimeCrust(f, [add(AF, [30, 8]), add(AF, [70, 24]), add(AF, [100, 34])], 5, [1, -0.3]);

  // ---- far arm (behind the body and head): forearm up to the spyglass; its deep sleeve hangs plumb, frozen
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [50, 44, 34], VELD({ fill: '#6c7884' }), '_f');
  f.bone('sleeve_f');
  const slf = [lp(EF, WF, 0.05, 26), lp(EF, WF, 0.3, 24), add(lp(EF, WF, 0.3, 24), [16, 170]), [480, 520, 1], [462, 500], [452, 528, 1], [436, 504], [424, 530, 1], [410, 504], add(EF, [-20, 10])];
  f.part(slf, VELD({ fill: '#6c7884', k: 0.8 }));
  W.clipDraw(f, slf, () => { W.fold(f, [add(EF, [10, 30]), [440, 420], [440, 500]], 2); W.fold(f, [add(EF, [30, 20]), [464, 400], [468, 500]], 1.6); W.hoar(f, [470, 420], 20, 60, 0.6); });
  furEdge([[486, 518], [468, 504], [452, 526], [436, 506], [424, 528], [410, 506]], 10);
  W.icicles(f, [[480, 520], [452, 528], [424, 530]], 5, 10, 26);
  W.rimeCrust(f, [lp(EF, WF, 0.2, -18), add(lp(EF, WF, 0.3, 24), [16, 100]), add(lp(EF, WF, 0.3, 24), [16, 168])], 6, [1, -0.2]);

  // ---- body: bodice with fur collar, the skirt to the floor, belted high under the bust
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.34], [0.06, 0.56, 0.5], [0.22, 0.6, 0.66], [0.36, 0.56, 0.62], [0.55, 0.5, 0.5], [0.8, 0.56, 0.52], [1.0, 0.62, 0.56]]);
  f.part(torso, VEL());
  W.clipDraw(f, torso, () => { W.fold(f, [S.at(0.1, 0.1), S.at(0.0, 0.4)], 1.8); W.fold(f, [S.at(-0.3, 0.1), S.at(-0.36, 0.4)], 1.8); W.hoar(f, S.at(0.5, 0.25), 24, 40, 0.7); W.lichtenberg(f, S.at(0.4, 0.06), deg(100), 60, 2, { depth: 2, col: '#2a3036' }); });
  f.bone('skirt');
  const sk = [S.at(-0.6, 0.46), S.at(0.58, 0.44), [384, 470], [406, 580], [432, 690], [452, 770], [462, 794, 1], [396, 794], [330, 794], [270, 794], [240, 700], [236, 600], S.at(-0.66, 0.7)];
  f.part(sk, VEL());
  W.clipDraw(f, sk, () => {
    W.softTone(f, E.smooth(sk), [[[[230, 460], [280, 470], [270, 800], [230, 800]], '#1a2230', 0.4, 22], [[[360, 470], [400, 480], [450, 790], [380, 790]], '#e8f0f4', 0.16, 22]]); // the skirt turning as a heavy cone: the back in shadow, the front lit
    for (const g of [[[300, 480], [296, 620], [292, 790]], [[340, 480], [356, 640], [376, 790]], [[264, 500], [256, 640], [258, 780]], [[378, 520], [404, 660], [428, 790]]]) W.trough(f, g, 14, { col: '#1a2230', lite: '#d8e4ec', liteOp: 0.45, op: 0.45 }); // deep tube folds of heavy velvet, frozen plumb
    W.fold(f, [[316, 560], [322, 790]], 2.2);
    for (const g of [[[290, 520], [284, 650]], [[360, 560], [372, 700]]]) { f.stroke(g, 6, '#000', { op: 0.18 }); f.line(g.map(q => add(q, [-4, 0])), 1.2, '#c4d0da', { op: 0.4 }); }
    W.hoar(f, [420, 640], 30, 120, 0.6); f.flat([[230, 730], [470, 730], [470, 800], [230, 800]], P.mud, { op: 0.32 });
    f.flat(ell([318, 690], 24, 14, 0.2, 10), '#4a5058', { op: 0.3 }); // a wine stain
    W.stains(f, E.smooth(sk), [230, 440, 470, 800], '#3a4452', 0.02, 3.2, -1.6, 21, 0.45); // the velvet gone grey in blotches
    for (let i = 0; i < 26; i++) { const x = 250 + f.r() * 200, y = 480 + f.r() * 300; f.line([[x, y], [x + 2, y + 14 + f.r() * 20]], 1.1, f.r() > 0.5 ? '#c4d0da' : '#2a323c', { op: 0.35 }); } // crushed pile
  });
  furEdge([[262, 792], [330, 794], [396, 794], [462, 792]], 18);
  f.bone('foot_n'); f.part([[440, 776], [484, 782], [500, 792, 1], [440, 794, 1]], W.LEA(f, { fill: '#3a3438', cast: false })); // the near toe at the hem
  f.bone('skirt');
  W.rimeCrust(f, [S.at(0.6, 0.48), [392, 500], [410, 600], [436, 700], [456, 780]], 9, [1, -0.2]);
  // the girdle of brass plaques, high under the bust
  f.bone('torso');
  const gd = [S.at(-0.62, 0.4), S.at(0.6, 0.38), S.at(0.62, 0.48), S.at(-0.64, 0.5)];
  f.part(gd, W.LEA(f, { sharp: true, fill: '#3a302a' }));
  for (let i = 0; i < 6; i++) { const u = -0.54 + i * 0.2, q = [S.at(u - 0.07, 0.39), S.at(u + 0.07, 0.39), S.at(u + 0.07, 0.49), S.at(u - 0.07, 0.49)]; W.bplate(f, q, W.BRD(f, { inkW: 1, cast: false }), { bev: 2, scr: [[S.at(u, 0.44), 6, 1]] }); f.flat(ell(S.at(u, 0.44), 2.6, 2.6, 0, 6), P.brassD); }
  W.fusedBead(f, S.at(0.46, 0.44), 3);
  // fur collar over the shoulders
  furEdge([S.at(-0.56, 0.02), S.at(-0.3, -0.08), S.at(0.0, -0.1), S.at(0.3, -0.04), S.at(0.56, 0.1), S.at(0.66, 0.3)], 30);
  W.rimeCrust(f, [S.at(-0.2, -0.14), S.at(0.2, -0.12), S.at(0.54, 0.02)], 7, [1, -0.3]);

  // ---- chatelaine of keys, pomander, fat purse, hanging plumb from the girdle
  f.bone('chatelaine');
  const ch0 = S.at(0.28, 0.5);
  W.chainLinks(f, [ch0, add(ch0, [2, 120])], 8, P.brassL);
  for (const [dx, l, a] of [[-6, 40, -0.2], [4, 52, 0.1], [12, 34, 0.3]]) { const top = add(ch0, [dx, 122]); f.line([add(ch0, [0, 118]), top], 2, P.brassL); const kb = add(top, rot([0, l], a)); f.part(limb(top, kb, 5, 5, { steps: 3 }), W.BR(f, { inkW: 1, cast: false })); f.part(ell(top, 6, 6, 0, 8), W.BR(f, { inkW: 1, cast: false })); f.flat(ell(top, 2.4, 2.4, 0, 6), '#0a0a0e'); f.part(hard([add(kb, [-2, -10]), add(kb, [8, -10]), add(kb, [8, 0]), add(kb, [-2, 0])]), W.BR(f, { inkW: 1, cast: false })); }
  W.icicle(f, add(ch0, [10, 170]), 12, 3);
  const pm = S.at(-0.2, 0.5); // pomander: a pierced brass ball on a chain
  W.chainLinks(f, [pm, add(pm, [0, 70])], 7, P.brassL);
  f.part(ell(add(pm, [0, 86]), 15, 16, 0, 14), W.BRD(f, {}));
  for (let i = 0; i < 6; i++) f.flat(ell(add(pm, [-8 + (i % 3) * 8, 80 + Math.floor(i / 3) * 10]), 2, 2.4, 0, 6), '#141418');
  W.lichtenberg(f, add(pm, [4, 90]), deg(70), 20, 1.2, { metal: true, depth: 1 });
  const pu = S.at(-0.56, 0.56); // the fat purse
  W.rope(f, [S.at(-0.5, 0.5), add(pu, [0, 10])], 2, { col: '#4a3e34' });
  f.part([add(pu, [-16, 10]), add(pu, [16, 8]), add(pu, [26, 40]), add(pu, [18, 66]), add(pu, [-18, 68]), add(pu, [-26, 40])], VELD({ fill: '#6a7480', shadow: '#2a3038' }));
  f.line([add(pu, [-14, 14]), add(pu, [14, 12])], 2, P.brassL); f.part(ell(add(pu, [0, 30]), 5, 5, 0, 8), W.BR(f, { inkW: 1, cast: false }));
  W.icicles(f, [add(pu, [-18, 68]), add(pu, [18, 66])], 3, 8, 16);

  // ---- near arm: fist on the hip, elbow cocked back; its deep sleeve hangs straight down from the elbow, dagged
  f.bone('sleeve_n');
  const sln = [lp(SN, EN, 0.5, 22), add(EN, [-26, -8]), add(EN, [-34, 120]), add(EN, [-38, 270]), [168, 668, 1], [184, 650], [196, 676, 1], [208, 650], [222, 674, 1], [232, 646], add(EN, [24, 230]), add(EN, [22, 60]), lp(SN, EN, 0.6, -20)];
  f.part(sln, VELD({ fill: '#7a8692', k: 0.8 }));
  W.clipDraw(f, sln, () => { for (const g of [[add(EN, [-14, 20]), add(EN, [-20, 140]), add(EN, [-22, 260])], [add(EN, [4, 30]), add(EN, [2, 150]), add(EN, [6, 260])]]) W.fold(f, g, 2.2); W.hoar(f, add(EN, [-10, 120]), 30, 80, 0.5); f.flat(ell(add(EN, [-6, 220]), 20, 30, 0, 10), '#2a3038', { op: 0.25 }); });
  furEdge([add(EN, [-38, 272]), [168, 668], [184, 650], [196, 676], [208, 650], [222, 674], [232, 646], add(EN, [24, 232])], 12);
  W.icicles(f, [[168, 668], [196, 676], [222, 674]], 6, 10, 30);
  W.rimeCrust(f, [add(EN, [22, 60]), add(EN, [24, 230])], 6, [1, -0.2]);
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [52, 44, 36], VEL({ fill: '#8a96a2' }), '_n', { bp: [[0, 0.5, 0.1, 0.2]] });
  f.bone('forearm_n'); W.fold(f, [lp(EN, WN, 0.2, 10), lp(EN, WN, 0.5, -8)], 1.6);
  furEdge([lp(EN, WN, 0.82, -20), lp(EN, WN, 0.84, 20)], 12);
  f.bone('hand_n');
  const gn = B.grip(f, WN, EN, -Math.PI / 2, 28, GLV().fill, { inline: true, bend: 0.25, shadow: GLV().shadow, tex: 'craze' + seed, texOp: 0.3 });
  W.fistDetail(f, gn, 28 * 1.18, GLV().fill, { wrinkle: false, nail: '#4a4440' });
  for (const [u, v] of [[0.34, -0.3], [0.34, 0.0], [0.34, 0.3]]) { const q = gn.F([[u, v]])[0]; f.part(ell(q, 4.4, 3.4, gn.ang, 8), W.BR(f, { fill: P.brassL, inkW: 0.9, cast: false })); } // rings over the glove

  // ---- neck and head: heavy jaw, rime thick in the folds of the neck
  f.bone('head');
  const nk = [S.at(-0.22, -0.02), S.at(0.34, 0.0), add(HC, [24, 60]), add(HC, [-20, 46])];
  f.part(nk, SKN());
  W.clipDraw(f, nk, () => { for (let i = 0; i < 3; i++) f.line([add(HC, [-14, 54 + i * 9]), add(HC, [10, 60 + i * 8]), add(HC, [28, 58 + i * 7])], 1.6, INK, { op: 0.55 }); W.hoar(f, add(HC, [20, 66]), 20, 20, 0.9); });
  B.head(f, HC, H, hA, {
    skin: '#b8bec4', jaw: 1.24, chin: 0.03, nose: 1.0, hook: 0.1, mouth: 'set', squint: 0.85, browDown: -0.04, browW: 0.018, browCol: '#c8d0d4', age: true, faceShade: 0.72, jawShade: 0.38, faceHatch: false,
    eyeWhite: '#d8e2e8', iris: '#2a3038', hairCol: '#5a5048', lips: true, noEar: true,
  });
  f.flat(hF([[0.2, 0.29], [0.26, 0.27], [0.3, 0.29], [0.26, 0.305]]), '#3a2a30', { op: 0.7 }); // pursed
  f.line(hF([[0.18, 0.31], [0.22, 0.33]]), 1, INK, { op: 0.6 }); f.line(hF([[0.29, 0.31], [0.25, 0.335]]), 1, INK, { op: 0.6 });
  f.flat(hF([[-0.3, -0.42], [0.3, -0.36], [0.33, -0.2], [0.0, -0.24], [-0.32, -0.26]]), '#d4dce0', { op: 0.35 }); // the plucked high brow
  W.softTone(f, E.smooth(hF([[-0.3, -0.4], [0.18, -0.47], [0.36, -0.13], [0.33, 0.3], [0.13, 0.56], [-0.22, 0.3], [-0.37, -0.13]])), [
    [hF([[0.0, 0.1], [0.16, 0.16], [0.2, 0.34], [0.06, 0.44], [-0.06, 0.3]]), '#4a5064', 0.45, 5], // under the cheekbone
    [hF([[-0.2, 0.3], [0.0, 0.46], [0.16, 0.56], [0.3, 0.5], [0.1, 0.62], [-0.2, 0.46]]), '#3a4054', 0.55, 4], // jowl and jaw
    [hF([[0.04, -0.34], [0.26, -0.34], [0.3, -0.2], [0.06, -0.22]]), '#ffffff', 0.35, 6]]); // the lit dome of the brow
  f.line(hF([[0.27, 0.16], [0.21, 0.24], [0.2, 0.32]]), 1.4, INK, { op: 0.7 }); // nasolabial fold
  f.line(hF([[0.1, 0.4], [0.18, 0.5], [0.3, 0.5]]), 1.3, INK, { op: 0.6 }); // the jowl's edge
  f.line(hF([[0.04, 0.5], [0.16, 0.6], [0.3, 0.58]]), 1.3, INK, { op: 0.6 }); // a second chin
  f.line(hF([[0.02, -0.3], [0.2, -0.32]]), 1, INK, { op: 0.35 });
  // the cheek pushed up against the eyepiece
  f.line(hF([[0.03, 0.06], [0.12, 0.1], [0.22, 0.08]]), 1.2, INK, { op: 0.55 }); // the cheek pushed up under the eyepiece
  f.line(hF([[0.04, -0.02], [0.12, -0.035], [0.2, -0.02]]), 1.4, INK, { op: 0.8 }); // the squeezed lid
  W.clipDraw(f, hF([[0.2, 0.2], [0.4, 0.2], [0.36, 0.5], [0.0, 0.56], [-0.2, 0.4], [0.0, 0.34]]), () => { W.hoar(f, hF([[0.22, 0.42]])[0], 22, 14, 0.8); });
  W.icicles(f, hF([[0.06, 0.52], [0.28, 0.48]]), 3, 6, 14);
  W.rimeCrust(f, hF([[0.31, 0.34], [0.3, 0.44], [0.1, 0.54]]), 5, [1, -0.2]); // rime on the jaw and throat, never over the nose
  f.flat(hF([[0.25, 0.19], [0.34, 0.2], [0.4, 0.17], [0.34, 0.235], [0.26, 0.235]]), '#3a4054', { op: 0.5 }); f.line(hF([[0.29, 0.13], [0.26, 0.19], [0.3, 0.225], [0.35, 0.215]]), 1.4, INK, { op: 0.75 }); // the nose's underside and nostril wing
  // the horned headdress: a padded roll over the brow, two horns rising up and out, wrapped in brass net; a short veil
  f.bone('headdress');
  const veil = hF([[-0.3, -0.3], [-0.62, -0.1], [-0.7, 0.3], [-0.66, 0.6], [-0.5, 0.66], [-0.42, 0.4], [-0.3, 0.1]]);
  f.part(veil, { fill: '#aeb6bc', shadow: '#4e5662', light: '#e8eef2', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 });
  W.clipDraw(f, veil, () => { W.fold(f, hF([[-0.5, -0.1], [-0.56, 0.4]]), 1.6); W.hoar(f, hF([[-0.5, 0.2]])[0], 20, 30, 0.5); });
  W.icicles(f, hF([[-0.66, 0.6], [-0.42, 0.42]]), 3, 8, 18);
  const horn = (base0, base1, tip, bend) => {
    const ctrl = [lerp(base0, base1, 0.5), add(lerp(lerp(base0, base1, 0.5), tip, 0.5), bend), tip];
    const C2 = W.spline(ctrl, 4), w0 = E.len(sub(base1, base0));
    const hp = W.ribbon(C2, t => w0 * (1.1 - t * 0.6) * (0.9 + 0.1 * Math.sin(t * 9)));
    f.part(hp, { fill: '#6a7480', shadow: '#262c36', light: '#aab6c0', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, k: 0.9 });
    W.clipDraw(f, hp, () => {
      for (let i = -6; i < 14; i++) { const a = C2[Math.max(0, Math.min(C2.length - 1, i * 4))], b = C2[Math.max(0, Math.min(C2.length - 1, i * 4 + 14))]; f.line([add(a, [-w0 * 0.6, 0]), add(b, [w0 * 0.6, 0])], 1.4, P.brassL, { op: 0.85 }); f.line([add(a, [w0 * 0.6, 0]), add(b, [-w0 * 0.6, 0])], 1.4, P.brassD, { op: 0.85 }); } // brass net
      for (let i = 2; i < C2.length - 2; i += 5) f.flat(ell(C2[i], 2.4, 2.4, 0, 6), P.brassP, { op: 0.9 }); // net knots
      W.hoar(f, C2[Math.floor(C2.length * 0.7)], 20, 26, 0.7);
    });
    return C2;
  };
  const hnr = horn(hF([[-0.42, -0.34]])[0], hF([[-0.08, -0.48]])[0], hF([[-1.12, -1.3]])[0], [-40, 26]);
  const hfr = horn(hF([[-0.02, -0.48]])[0], hF([[0.3, -0.36]])[0], hF([[0.92, -1.34]])[0], [44, 28]);
  const roll = hF([[-0.42, -0.3], [-0.3, -0.48], [0.0, -0.56], [0.26, -0.5], [0.36, -0.32], [0.24, -0.26], [0.0, -0.32], [-0.3, -0.24]]);
  f.part(roll, { fill: '#8a96a2', shadow: '#36404e', light: '#c4d0da', shade: 0.42, tex: 'mottle' + seed, texOp: 0.4 });
  W.clipDraw(f, roll, () => { for (let i = 0; i < 7; i++) f.line([hF([[-0.38 + i * 0.1, -0.5]])[0], hF([[-0.3 + i * 0.1, -0.26]])[0]], 1.4, P.brassD, { op: 0.7 }); });
  f.part(hard(hF([[-0.2, -0.46], [-0.13, -0.54], [-0.06, -0.46], [-0.13, -0.38]])), W.BR(f, { fill: P.brassL, inkW: 1.1, cast: false })); W.fusedBead(f, hF([[-0.04, -0.4]])[0], 2.6); // a lozenge brooch on the roll, off-centre, struck
  for (const C2 of [hnr, hfr]) { W.rimeCrust(f, C2.slice(Math.floor(C2.length * 0.3)).filter((_, i) => i % 3 === 0), 7, [1, -0.4]); W.icicle(f, add(C2[C2.length - 1], [2, 4]), 16, 4); W.icicle(f, C2[Math.floor(C2.length * 0.55)], 12, 3.6); }
  W.rimeCrust(f, hF([[-0.3, -0.5], [0.0, -0.58], [0.28, -0.5]]), 6, [1, -0.3]);

  // ---- the spyglass, levelled along her eye line: three draw tubes, eyepiece at the eye, the objective toward the party
  f.bone('spyglass');
  const sg = t => lerp(sg0, sg1, t), sd = E.norm(sub(sg1, sg0)), sn = [-sd[1], sd[0]];
  const tubes = [[0.0, 0.18, 14, 14], [0.16, 0.42, 20, 20], [0.4, 0.7, 26, 26], [0.68, 1.0, 34, 36]];
  tubes.forEach(([t0, t1, w0, w1], i) => {
    const d0 = f.part(limb(sg(t0), sg(t1), w0, w1, { steps: 4, capK: 0.15 }), W.BR(f, { fill: mix(P.brass, '#2a2a30', i === 3 ? 0.5 : 0.38), light: '#b8a478', k: 0.9 }));
    W.bevel(f, d0, E.bbox([add(sg(t0), [-w0, -w0]), add(sg(t1), [w1, w1])]), 3);
    f.part(limb(sg(t1 - 0.025), sg(t1), w1 + 8, w1 + 8, { steps: 2, capK: 0.2 }), W.BR(f, { fill: mix(P.brassL, '#3a3a40', 0.4), cast: false, inkW: 1.2 })); // the collar at each draw
    f.line([add(sg(t0 + 0.01), mul(sn, -w0 * 0.3)), add(sg(t1 - 0.03), mul(sn, -w1 * 0.3))], 1.6, P.brassP, { op: 0.35 }); f.flat(ell(add(sg(t1 - 0.04), mul(sn, w1 * 0.3)), 10, 4, 0, 8), '#4e7e70', { op: 0.4 }); // worn bright only along the top; verdigris at the collar
  });
  f.part(limb(sg(0.6), sg(0.88), 42, 42, { steps: 3, capK: 0.2 }), W.LEA(f, { fill: '#3a302a', inkW: 1.2 })); // shagreen grip on the outer tube
  W.clipDraw(f, limb(sg(0.6), sg(0.88), 42, 42, { steps: 3, capK: 0.2 }), () => { for (let i = 0; i < 12; i++) f.line([add(sg(0.6 + i * 0.024), mul(sn, -20)), add(sg(0.61 + i * 0.024), mul(sn, 20))], 0.9, INK, { op: 0.45 }); });
  f.part(limb(sg(0.97), add(sg(1.0), mul(sd, 12)), 46, 48, { steps: 2, capK: 0.1 }), W.BR(f, { fill: mix(P.brassL, '#3a3a40', 0.4), inkW: 1.3 })); // the sunshade lip at the objective, seen from the side
  f.flat([add(sg1, add(mul(sd, 10), mul(sn, -22))), add(sg1, add(mul(sd, 14), mul(sn, -22))), add(sg1, add(mul(sd, 14), mul(sn, 22))), add(sg1, add(mul(sd, 10), mul(sn, 22)))], '#c8dae4', { op: 0.6 }); // a sliver of the objective's rim, edge-on
  W.lichtenberg(f, sg(0.5), Math.PI + 0.3, 70, 2, { metal: true, depth: 2 });
  W.rimeCrust(f, [add(sg(0.2), mul(sn, -12)), add(sg(0.6), mul(sn, -16)), add(sg(0.98), mul(sn, -24))], 6, [1, -0.3]);
  W.icicles(f, [add(sg(0.42), mul(sn, 12)), add(sg(0.66), mul(sn, 14)), add(sg(0.98), mul(sn, 20))], 6, 8, 22);
  W.dent(f, sg(0.8), 8);
  f.bone('hand_f');
  const gf = B.grip(f, WF, EF, sgA, 27, GLV().fill, { shadow: GLV().shadow, tex: 'craze' + seed, texOp: 0.3, name: 'patroness spyglass' });
  W.fistDetail(f, gf, 27 * 1.18, GLV().fill, { wrinkle: false, nail: '#4a4440' });
  W.fusedBead(f, gf.F([[0.32, -0.12]])[0], 4); // the ring fused through the glove
  W.lichtenberg(f, gf.F([[0.0, 0.0]])[0], ang(WF, EF), 70, 2, { depth: 2 }); // the burn runs from the brass down the hand into the sleeve
  furEdge([lp(EF, WF, 0.8, -18), lp(EF, WF, 0.8, 18)], 10);

  f.bone('root');
  f.flat(ell([300, gy + 4], 220, 12, 0, 18), '#000', { op: 0.28 });
  return f;
}

// paint flaking off carved oak: irregular patches where the paint has lifted, bare oak inside with a lighter broken lip
function flakes(f, c, rx, ry, n, oak, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = W.scatter(f, c, rx, ry), r = W.R(f, 4, 11) * (o.s || 1), k = 7;
    const q = []; for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2; q.push(add(p, [Math.cos(a) * r * (0.6 + f.r() * 0.6), Math.sin(a) * r * (0.5 + f.r() * 0.5)])); }
    f.flat(hard(q), oak, { op: 0.95 });
    f.line(q.slice(0, 4), 1, INK, { op: 0.6, straight: true });
    f.line(q.slice(4).concat([q[0]]), 1, '#f2e8d0', { op: 0.45, straight: true });
  }
}
// a split along the grain of carved oak, where ice got in: a dark wandering crack with rime packed into its mouth
function grainSplit(f, a, b, w = 3) {
  const pts = [a]; for (let i = 1; i < 5; i++) pts.push(add(lerp(a, b, i / 5), [(f.r() - 0.5) * 6, (f.r() - 0.5) * 6])); pts.push(b);
  f.stroke(pts, w * 1.8, INK, { op: 0.85 });
  f.line(pts.slice(1, -1).map(q => add(q, [1.5, -1])), 1.2, P.rime, { op: 0.8 });
}

// ------------------------------------------------------------------ CLOCK JACK (cast, human 1.05, on its plinth)
// The carved oak man-at-arms that struck the hours on the spire's lower clock, standing stiff and square on its cast-
// iron bracket-plinth, the hammer cocked back over its near shoulder, the bell hanging from a wrought scroll-bracket in
// front of it. Jointed at shoulder and elbow with iron pins; the wood split along the grain where ice got in, frost
// faceted on the windward front, icicles off the hammer arm. Lightning fused the shoulder pins into one scorched lump
// and burns branch across the paint. Painted surcoat of pale blue and brass checks flaking to bare oak, a carved
// breastplate with painted rivets, a wooden kettle hat painted brass; the observatory's arms carved on its chest. The
// drive rod rises from the plinth into its back, a counterweight hangs on a chain, old nail holes, a bird's nest wedged
// behind one knee. Rig: plinth (root), pelvis > torso > head, upperarm_n > forearm_n > hand_n > hammer, upperarm_f >
// forearm_f > hand_f, legs fixed on pelvis (it is carved standing), bell (root), counterweight (root).
// Motion: idle is a single jerk of the hammer stopping an inch short of the bell; attack is the strike on the bell.
function clockJack() {
  const seed = 1129, CW = 800, CH = 940, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 108, top = 826; // plinth top: the jack's own ground line
  const N = [318, 338], C = [314, 424], Pv = [312, 514];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.36, 0.1);
  const EN = [162, 334], WN = [214, 242];
  const EF = [366, 452], WF = S.at(0.3, 0.86);
  const HN = S.at(-0.2, 1.0), KN = [302, 664], AN = [296, 790];
  const HF = S.at(0.24, 1.0), KF = [340, 666], AF = [346, 790];
  const HC = [328, 254], hA = 0.0;
  const hmA = ang(EN, WN) - Math.PI / 2, hm0 = add(WN, rot([46, 0], hmA + Math.PI)), hm1 = add(WN, rot([160, 0], hmA)); // hammer handle, butt to head
  const OAK = (o = {}) => Object.assign({ fill: '#6a5638', shadow: '#2a2014', light: '#a08a62', shade: 0.42, tex: 'wood' + seed, texOp: 0.6 }, o);
  const OAKB = '#8a7250'; // bare oak where the paint has gone
  const PBL = (o = {}) => Object.assign({ fill: '#8aa0b0', shadow: '#36424e', light: '#c8d8e2', shade: 0.42, tex: 'wood' + seed, texOp: 0.35 }, o);
  const PBR = (o = {}) => W.BR(f, Object.assign({ tex: 'wood' + seed, texOp: 0.35 }, o));
  const IRN = (o = {}) => W.IR(f, o);
  const pin = (c, r = 9) => { f.part(ell(c, r * 1.5, r * 1.5, 0, 12), IRN({ fill: P.ironL, inkW: 1.4, cast: false })); W.hinge(f, c, r, 0.3); };
  f.joint('plinth', [320, 860]).joint('pelvis', Pv, 'plinth').joint('torso', S.at(0, 0.86), 'pelvis').joint('head', S.at(0.1, -0.04), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('hammer', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n').joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('bell', [528, 444], 'plinth').joint('counterweight', [196, 840], 'plinth').joint('drive', [300, 820], 'plinth');

  // ---- the drive rod rising from the plinth into its back, with a crank
  f.bone('drive');
  f.part(limb([226, 822], [226, 560], 14, 14, { steps: 6, capK: 0.3 }), IRN({ fill: P.ironL }));
  f.part(limb([226, 560], [272, 520], 14, 14, { steps: 3 }), IRN({ fill: P.ironL, cast: false }));
  f.part(ell([226, 660], 16, 8, 0, 10), IRN({ cast: false })); f.rivet([226, 660], 3, P.steelL);
  W.rimeCrust(f, [[232, 560], [232, 700], [232, 816]], 4, [1, -0.2]);

  // ---- the plinth: a cast-iron bracket-shelf seen in three-quarter view: camera face, the right face receding, the top
  f.bone('plinth');
  const dz = [56, -30], A0 = [180, 834], A1 = [450, 834], B0 = [180, 904], B1 = [450, 904];
  const topF = hard([A0, A1, add(A1, dz), add(A0, dz)]), front = hard([A0, A1, B1, B0]), rside = hard([A1, add(A1, dz), add(B1, dz), B1]);
  f.part(topF, IRN({ fill: '#4e5056', light: '#7a7e86' }));
  W.clipDraw(f, topF, () => { W.hoar(f, [380, 818], 120, 16, 0.8); f.scratches([300, 820], 60, 5, '#9aa0a8'); });
  const dF = f.part(front, IRN({ fill: P.iron }));
  W.bevel(f, dF, E.bbox(front), 5, { lite: '#9aa0a8', lite2: '#c8ccd0' });
  W.clipDraw(f, front, () => {
    // a moulded cornice under the top edge, and a scrolled bracket cast in relief (it was a wall bracket)
    f.part(hard([[180, 834], [450, 834], [450, 848], [180, 848]]), IRN({ fill: P.ironL, cast: false, inkW: 1.2 }));
    f.line([[184, 852], [446, 852]], 1.4, INK, { op: 0.6 });
    const sc = [[230, 900], [210, 878], [222, 860], [246, 864], [250, 882], [236, 888]];
    f.line(sc, 4, INK, { op: 0.7 }); f.line(sc.map(q => add(q, [1.5, -1.5])), 1.8, '#8a8e96', { op: 0.6 });
    const sc2 = sc.map(q => [630 - q[0], q[1]]); f.line(sc2, 4, INK, { op: 0.7 }); f.line(sc2.map(q => add(q, [1.5, -1.5])), 1.8, '#8a8e96', { op: 0.6 });
    f.line([[250, 882], [380, 882]], 3, INK, { op: 0.6 });
    f.part(hard([[300, 862], [360, 862], [360, 880], [300, 880]]), W.BR(f, { inkW: 1, cast: false })); for (const x of [306, 354]) f.rivet([x, 871], 2.2, P.brassL); // the maker's plate
    for (let i = 0; i < 5; i++) f.line([[310 + i * 9, 866], [312 + i * 9, 876]], 1, INK, { op: 0.6 });
    W.lichtenberg(f, [420, 850], deg(120), 50, 2, { metal: true, depth: 2 });
    f.flat([[180, 880], [450, 880], [450, 906], [180, 906]], P.mud, { op: 0.35 });
  });
  f.part(rside, IRN({ fill: '#2a2a30' }));
  W.clipDraw(f, rside, () => W.hoar(f, add(A1, [30, 20]), 30, 40, 0.8));
  W.rimeCrust(f, [A0, A1, add(A1, dz)], 7, [1, -0.3]);
  W.icicles(f, [add(A0, [0, 2]), add(A1, [0, 2])], 8, 6, 16);
  for (const x of [196, 434]) f.rivet([x, 892], 3.4, P.steelL);

  // ---- the counterweight on its chain, hung from a hook at the plinth's back end
  f.bone('counterweight');
  f.part(hard([[180, 846], [156, 846], [150, 852], [156, 858], [180, 858]]), IRN({ fill: P.ironL, cast: false }));
  W.chainLinks(f, [[156, 854], [154, 866]], 8, P.ironL);
  f.part(hard([[134, 866], [174, 866], [178, 904], [130, 904]]), { fill: '#6a6e74', shadow: '#2a2c32', shade: 0.42, inkW: 1.3, tex: 'pit' + seed, texOp: 0.7 });
  f.part(ell([154, 866], 21, 5, 0, 12), { fill: '#8a8e94', shade: 0.3, inkW: 1, cast: false });
  W.rimeCrust(f, [[132, 866], [154, 862], [176, 866]], 5, [1, -0.3]);

  // ---- far arm: the carved hand resting on the hip (behind the body), elbow out; pinned at shoulder and elbow
  f.bone('upperarm_f');
  f.part(W.jointLimb(SF, EF, WF, [52, 46, 40]), PBL({ fill: '#76889a' }));
  f.bone('forearm_f'); pin(EF, 7);
  f.bone('hand_f');
  W.openHand(f, WF, ang(EF, WF) + 0.2, 62, { look: OAK({ fill: '#b8a888', shadow: '#4a3e2e', tex: 'wood' + seed }), curl: 0.3, spread: 0.06, back: true });

  // ---- legs: carved and stiff, square on the plinth; painted hose, carved boots
  const legL = (o = {}) => PBL(Object.assign({ fill: '#7a8c9c' }, o));
  f.bone('thigh_f'); W.legTube(f, HF, KF, AF, [74, 58, 46], legL({ fill: '#6a7a88' }), '_f', { A: AF, bq: [[1, 0.3, 0.16, 0.18]], bp: [[0, 0.5, 0.08, 0.2]] });
  f.bone('foot_f'); W.bootRig(f, KF, AF, 60, '#4a3e30', '_f', { groundY: top, tex: 'wood' + seed });
  f.bone('thigh_n'); W.legTube(f, HN, KN, AN, [76, 60, 48], legL(), '_n', { A: AN, bp: [[1, 0.3, 0.16, 0.18]], bq: [[0, 0.5, 0.08, 0.2]] });
  f.bone('shin_n');
  flakes(f, lerp(KN, AN, 0.4), 18, 40, 4, OAKB);
  grainSplit(f, lp(KN, AN, 0.1, 10), lp(KN, AN, 0.7, 14), 2.4);
  // the bird's nest wedged behind the knee: twigs, moss, a frozen feather
  const nc = add(KN, [-34, -6]);
  for (let i = 0; i < 14; i++) { const a = f.r() * 6.3, l = 10 + f.r() * 14, p0 = add(nc, [Math.cos(a) * 10, Math.sin(a) * 6]); f.line([p0, add(p0, rot([l, 0], a + 1.5))], 1.6, i % 3 ? '#4a3a28' : '#7a6a4a'); }
  f.part(ell(nc, 20, 12, 0.2, 12), { fill: '#3e3624', shadow: '#1a160e', shade: 0.4, inkW: 1.1, tex: 'craze' + seed, texOp: 0.6, cast: false });
  f.line([add(nc, [-6, -10]), add(nc, [-16, -26])], 2, '#c8ccc4');
  f.bone('foot_n'); W.bootRig(f, KN, AN, 62, '#54463a', '_n', { groundY: top, tex: 'wood' + seed });
  f.bone('shin_n'); W.rimeCrust(f, [lp(KN, AN, 0.05, -30), lp(KN, AN, 0.9, -26)], 6, [1, -0.2]);

  // ---- body: carved breastplate over a painted checked surcoat
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.4, 0.4], [0.06, 0.7, 0.62], [0.24, 0.74, 0.78], [0.45, 0.66, 0.74], [0.68, 0.6, 0.64], [0.86, 0.66, 0.66], [1.06, 0.7, 0.66]]);
  const dT = f.part(torso, PBL());
  W.clipDraw(f, torso, () => {
    const sq = 26; // painted checks, pale blue and brass, flaking
    for (let i = -10; i < 10; i++) for (let j = -2; j < 14; j++) if ((i + j) % 2 === 0) { const q = [i * sq + 314, j * sq + 330]; f.flat(hard([q, add(q, [sq, 3]), add(q, [sq + 2, sq + 3]), add(q, [2, sq])]), mix(P.brass, '#5a5a50', 0.3), { op: 0.7 }); }
    flakes(f, S.at(-0.2, 0.7), 50, 60, 9, OAKB);
    // the carved block's side plane: the back third of the body turns away from us, a hard plane break down the chest
    const pb = [S.at(-0.2, -0.1), S.at(-0.26, 0.4), S.at(-0.22, 0.9), S.at(-0.9, 0.9), S.at(-0.9, -0.1)];
    f.flat(pb, '#141a24', { op: 0.38 });
    f.line([S.at(-0.2, -0.06), S.at(-0.26, 0.4), S.at(-0.22, 0.86)], 2.4, INK, { op: 0.6 }); f.line([S.at(-0.16, -0.06), S.at(-0.22, 0.4), S.at(-0.18, 0.86)], 1.4, '#e8f0f4', { op: 0.45 });
  });
  W.bevel(f, dT, E.bbox(torso), 6, { lite: '#e8f0f4', lite2: '#ffffff', dark: '#000', darkOp: 0.35 });
  f.bone('pelvis');
  const sk = [S.at(-0.72, 0.84), S.at(0.68, 0.82), add(S.at(0.74, 1.1), [10, 30]), [404, 600, 1], [370, 604], [340, 596, 1], [300, 606], [262, 596, 1], [252, 560]];
  f.part(sk, PBL({ fill: '#7e92a2' }));
  W.clipDraw(f, sk, () => {
    const sq = 26;
    for (let i = -10; i < 10; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2 === 1) { const q = [i * sq + 316, j * sq + 506]; f.flat(hard([q, add(q, [sq, 2]), add(q, [sq + 3, sq + 2]), add(q, [3, sq])]), mix(P.brass, '#5a5a50', 0.3), { op: 0.7 }); }
    for (const x of [280, 320, 360]) W.trough(f, [[x, 520], [x + 4, 560], [x + 2, 598]], 10, { col: '#2a2418', lite: '#d8c8a8' }); // carved pleats
    flakes(f, [330, 560], 60, 30, 6, OAKB);
    f.flat([[240, 500], [286, 500], [282, 620], [240, 620]], '#141a24', { op: 0.34 }); f.line([[286, 506], [282, 604]], 2.2, INK, { op: 0.55 });
  });
  W.icicles(f, [[404, 600], [370, 604], [340, 596], [300, 606], [262, 596]], 6, 8, 22);
  f.part([S.at(-0.74, 0.8), S.at(0.7, 0.78), S.at(0.72, 0.88), S.at(-0.76, 0.9)], OAK({ fill: '#4a3c2a', sharp: true })); // carved belt
  f.part(hard([S.at(0.28, 0.77), S.at(0.44, 0.77), S.at(0.44, 0.9), S.at(0.28, 0.9)]), PBR({ inkW: 1, cast: false }));
  f.bone('torso');
  // the carved breastplate: a raised plate with a medial ridge and painted rivets, the observatory's arms (a star over a dome)
  const bp = S.shape([[0.04, -0.3, 0.6], [0.2, -0.32, 0.76], [0.45, -0.28, 0.72], [0.66, -0.24, 0.6]]);
  const dB = f.part(bp, OAK({ fill: '#8a9aa8', shadow: '#2e3844', light: '#d0dce4', tex: 'wood' + seed, texOp: 0.4 }));
  W.bevel(f, dB, E.bbox(bp), 5, { lite: '#e8f0f4' });
  W.clipDraw(f, bp, () => {
    f.line([S.at(0.36, 0.06), S.at(0.4, 0.4), S.at(0.34, 0.64)], 2.4, INK, { op: 0.5 }); f.line([S.at(0.4, 0.06), S.at(0.44, 0.4), S.at(0.38, 0.64)], 1.6, '#eef4f6', { op: 0.5 });
    const ac = S.at(0.2, 0.32); // the carved arms: a dome and a star above it, cut in and gilded paint worn off
    f.flat([add(ac, [-24, 14]), add(ac, [-20, -2]), add(ac, [0, -12]), add(ac, [20, -2]), add(ac, [24, 14])], P.brass, { op: 0.85 }); f.line([add(ac, [-24, 14]), add(ac, [-20, -2]), add(ac, [0, -12]), add(ac, [20, -2]), add(ac, [24, 14]), add(ac, [-24, 14])], 1.6, INK, { op: 0.7 });
    for (let i = 0; i < 5; i++) f.line([add(ac, [0, -26]), add(ac, rot([12, 0], -Math.PI / 2 + i * Math.PI * 2 / 5)).map((v, k) => v + (k ? -26 : 0))], 1.8, P.brassD);
    flakes(f, S.at(0.4, 0.5), 20, 30, 4, OAKB);
    for (const [u, v] of [[0.0, 0.1], [0.56, 0.12], [0.62, 0.5], [-0.1, 0.56]]) { f.flat(ell(S.at(u, v), 4, 4, 0, 8), P.brassD); f.flat(ell(add(S.at(u, v), [-1, -1]), 1.6, 1.6, 0, 6), P.brassP); } // painted rivets
    for (const [u, v] of [[0.1, 0.5], [0.3, 0.6], [0.5, 0.24]]) f.flat(ell(S.at(u, v), 2, 2, 0, 6), '#0a0806'); // old nail holes
    W.lichtenberg(f, S.at(-0.1, 0.0), deg(70), 90, 2.4, { depth: 3, col: '#2a2420' });
    grainSplit(f, S.at(0.5, 0.1), S.at(0.56, 0.6), 2.6);
    W.facets(f, S.at(0.6, 0.3), 16, 50, 5, { s: 0.8, op: 0.3 });
  });
  W.rimeCrust(f, [S.at(0.3, -0.04), S.at(0.7, 0.16), S.at(0.76, 0.5), S.at(0.68, 0.8)], 8, [1, -0.2]);

  // ---- head: a carved face, round cheeks, painted moustache, the mouth a fixed grim line; paint flaked; a wooden kettle hat painted brass
  f.bone('head');
  f.part(limb(S.at(0.1, -0.04), add(HC, [-6, 40]), 50, 46, { steps: 4 }), OAK({ fill: '#b8a888', shadow: '#4a3e2e' }));
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: '#c2b296', jaw: 1.18, chin: 0.02, nose: 1.0, hook: 0, mouth: 'set', squint: 0.25, browDown: 0.06, browW: 0.06, faceShade: 0.8, jawShade: 0.45,
    eyeWhite: '#d8ccb0', iris: '#2a2420', hairCol: '#3a2e22', browCol: '#2a2018', noEar: false,
  });
  // the face is carved oak under flaking paint (independent review): an oak tone over it, the grain running down it, flat
  // chisel planes on the brow, cheek and nose, and the round cheeks carved as lit knobs (no red: red is only for blood,
  // doom and rubric)
  { const fz = hF([[-0.3, -0.4], [0.18, -0.47], [0.36, -0.13], [0.33, 0.3], [0.13, 0.56], [-0.22, 0.3], [-0.37, -0.13]]);
    W.clipDraw(f, fz, () => {
      f.flat(fz, '#7a5e40', { op: 0.28 });
      for (let i = 0; i < 9; i++) { const u = -0.3 + i * 0.075; f.line(hF([[u, -0.44], [u + 0.02, -0.1], [u - 0.01, 0.2], [u + 0.015, 0.56]]), 1, '#3a2a1a', { op: 0.3 }); } // the grain
      for (const pl of [[[0.08, -0.2], [0.3, -0.22], [0.34, -0.12], [0.1, -0.1]], [[0.1, 0.0], [0.26, 0.02], [0.24, 0.12], [0.08, 0.1]], [[-0.12, 0.02], [0.04, 0.0], [0.06, 0.16], [-0.1, 0.18]]]) { const q = hF(pl); f.flat(hard(q), '#ffffff', { op: 0.12 }); f.line([q[2], q[3]], 1.2, '#2a1e14', { op: 0.45, straight: true }); } // chisel planes
      for (const [u, v] of [[0.2, 0.12], [0.02, 0.1]]) { f.flat(hF(ell([u, v], 0.07, 0.06, 0, 8)), '#f0e6d4', { op: 0.3 }); f.line(hF([[u - 0.07, v + 0.06], [u, v + 0.08], [u + 0.07, v + 0.06]]), 1.3, '#2a1e14', { op: 0.55 }); } // round carved cheeks
    }); }
  f.stroke(hF([[0.1, 0.23], [0.2, 0.21], [0.3, 0.215], [0.38, 0.25], [0.42, 0.3]]), 9, '#2a2018'); // painted moustache, flaring
  f.stroke(hF([[0.17, 0.26], [0.1, 0.28], [0.04, 0.33]]), 6, '#2a2018');
  f.line(hF([[0.17, 0.3], [0.31, 0.3]]), 2.2, INK); // the fixed grim line
  flakes(f, hF([[0.0, -0.2]])[0], 18, 18, 3, OAKB, { s: 0.7 });
  grainSplit(f, hF([[-0.1, -0.4]])[0], hF([[0.04, 0.3]])[0], 2);
  for (const [u, v] of [[0.32, 0.4], [-0.1, 0.1]]) f.flat(ell(hF([[u, v]])[0], 2, 2, 0, 6), '#0a0806');
  W.clipDraw(f, hF([[0.1, -0.2], [0.42, -0.2], [0.36, 0.5], [0.1, 0.56], [0.1, 0.2]]), () => { W.hoar(f, hF([[0.3, 0.1]])[0], 20, 30, 0.6); W.facets(f, hF([[0.28, 0.1]])[0], 16, 24, 3, { s: 0.6, op: 0.25 }); });
  W.icicles(f, hF([[0.36, 0.3], [0.1, 0.52]]), 3, 6, 14);
  const brim = hF([[-0.8, -0.2], [-0.5, -0.34], [0.0, -0.38], [0.6, -0.3], [0.9, -0.14], [0.92, -0.06], [0.6, -0.18], [0.0, -0.22], [-0.5, -0.16], [-0.84, -0.1]]);
  const dbr = f.part(brim, PBR({ k: 0.8 })); W.bevel(f, dbr, E.bbox(brim), 3);
  const crown = hF([[-0.52, -0.28], [-0.5, -0.52], [-0.32, -0.72], [-0.02, -0.8], [0.26, -0.72], [0.44, -0.52], [0.48, -0.3]]);
  const dcr = f.part(crown, PBR({ k: 0.8 })); W.bevel(f, dcr, E.bbox(crown), 5);
  W.clipDraw(f, crown, () => { f.line(hF([[-0.02, -0.8], [0.0, -0.5], [0.02, -0.3]]), 2.4, INK, { op: 0.5 }); flakes(f, hF([[-0.2, -0.56]])[0], 24, 14, 4, OAKB, { s: 0.8 }); W.lichtenberg(f, hF([[0.1, -0.7]])[0], deg(60), 40, 1.8, { metal: true, depth: 2 }); grainSplit(f, hF([[-0.3, -0.7]])[0], hF([[-0.36, -0.34]])[0], 2); });
  W.clipDraw(f, brim, () => flakes(f, hF([[0.4, -0.24]])[0], 30, 6, 3, OAKB, { s: 0.6 }));
  W.rimeCrust(f, hF([[-0.3, -0.72], [0.0, -0.82], [0.28, -0.72], [0.46, -0.5]]), 8, [1, -0.3]);
  W.icicles(f, hF([[-0.84, -0.1], [0.0, -0.22], [0.92, -0.06]]), 8, 8, 24);

  // ---- the bell on its wrought scroll-bracket, bolted to the plinth, in front of the jack
  f.bone('bell');
  const br = W.spline([[452, 830], [470, 760], [480, 640], [484, 520], [494, 450], [528, 432]], 4);
  f.line(br, 13, INK); f.line(br, 9, P.ironL); f.line(br.map(q => add(q, [2, -1])), 2, '#9aa0a8', { op: 0.5 });
  const scl = [[480, 700], [500, 690], [508, 704], [498, 716], [486, 712]]; f.line(scl, 6, INK); f.line(scl, 3.4, P.ironL);
  const scl2 = [[484, 560], [462, 552], [456, 566], [466, 576], [476, 572]]; f.line(scl2, 6, INK); f.line(scl2, 3.4, P.ironL);
  for (const q of [[460, 820], [474, 740]]) f.rivet(q, 3, P.steelL);
  f.line([[528, 432], [528, 452]], 5, P.ironL);
  const bc = [528, 452];
  const bell = [add(bc, [-10, 0]), add(bc, [10, 0]), add(bc, [26, 10]), add(bc, [32, 40]), add(bc, [38, 74]), add(bc, [52, 92]), add(bc, [50, 100, 1]), add(bc, [0, 104]), add(bc, [-50, 100, 1]), add(bc, [-52, 92]), add(bc, [-38, 74]), add(bc, [-32, 40]), add(bc, [-26, 10])];
  const dbl = f.part(bell, W.BRD(f, { k: 0.9 })); // frost-dulled brass, not gold
  W.bevel(f, dbl, E.bbox(bell), 6);
  W.clipDraw(f, bell, () => { f.line([add(bc, [-46, 88]), add(bc, [0, 92]), add(bc, [46, 88])], 2, INK, { op: 0.6 }); f.line([add(bc, [-34, 54]), add(bc, [0, 58]), add(bc, [34, 54])], 1.4, INK, { op: 0.5 }); W.lichtenberg(f, add(bc, [10, 30]), deg(100), 50, 2, { metal: true, depth: 2 }); W.hoar(f, add(bc, [24, 40]), 20, 40, 0.7); W.dent(f, add(bc, [-14, 70]), 8); });
  f.flat([add(bc, [-50, 100]), add(bc, [0, 104]), add(bc, [50, 100]), add(bc, [0, 108])], '#0a0a0e', { op: 0.85 }); // the lip, mouth down
  W.icicles(f, [add(bc, [-48, 102]), add(bc, [48, 102])], 6, 8, 22);
  W.rimeCrust(f, [add(bc, [10, 2]), add(bc, [28, 20]), add(bc, [36, 70])], 5, [1, -0.3]);

  // ---- near arm, raised: the hammer cocked back over the shoulder; iron pins at shoulder and elbow, fused at the shoulder
  f.bone('hammer');
  f.part(limb(hm0, hm1, 16, 18, { steps: 6 }), OAK());
  f.line([lp(hm0, hm1, 0.05, 4), lp(hm0, hm1, 0.95, 4)], 1.2, '#c0a880', { op: 0.5 });
  f.part(ell(hm0, 11, 11, 0, 10), OAK({ fill: '#4a3c2a', cast: false }));
  const hd = frame(hm1, hmA, 1);
  const head_ = hd([[-14, -44], [10, -44], [14, -36], [14, 40], [10, 50], [-14, 50], [-18, 40], [-18, -36]]);
  const dhd = f.part(hard(head_), IRN({ fill: P.ironL, light: '#9aa0a8' })); W.bevel(f, dhd, E.bbox(head_), 4, { lite: '#b0b6bc', lite2: '#e0e4e8' });
  f.part(hard(hd([[-18, 40], [14, 40], [12, 56], [-16, 56]])), IRN({ fill: '#7a8088', cast: false })); // the striking face, worn bright
  f.part(hard(hd([[-22, -10], [18, -10], [18, 12], [-22, 12]])), IRN({ cast: false })); // the iron strap round the eye
  for (const v of [-6, 6]) f.rivet(hd([[0, v]])[0], 2.6, P.steelL);
  W.rimeCrust(f, hd([[-18, -44], [-18, 0], [-18, 40]]), 6, [1, -0.2]);
  W.icicles(f, hd([[14, 50], [-14, 50]]), 3, 10, 26);
  f.bone('upperarm_n');
  f.part(W.jointLimb(SN, EN, WN, [58, 50, 42], { point: 0.3 }), PBL({ fill: '#8aa0b0' }));
  W.clipDraw(f, W.jointLimb(SN, EN, WN, [58, 50, 42]), () => { flakes(f, lerp(SN, EN, 0.5), 20, 20, 3, OAKB); grainSplit(f, lp(SN, EN, 0.2, 8), lp(SN, EN, 0.8, 10), 2); });
  f.bone('forearm_n'); pin(EN, 8);
  W.icicles(f, [lp(EN, WN, 0.0, -26), lp(EN, WN, 0.5, -20)], 4, 10, 28);
  W.icicles(f, [lp(SN, EN, 0.6, 24), lp(SN, EN, 1.0, 24)], 3, 8, 22);
  f.bone('hand_n');
  const gh = B.grip(f, WN, EN, hmA, 34, '#c2b296', { shadow: '#4a3e2e', tex: 'wood' + seed, texOp: 0.3, name: 'jack hammer' });
  W.fistDetail(f, gh, 34 * 1.18, '#c2b296', { wrinkle: false, nail: '#a89878' });
  f.bone('torso'); // the shoulder pin, fused into one scorched lump (on the torso, under the pauldron)
  f.flat(ell(SN, 30, 26, 0, 12), P.scorch, { op: 0.5 });
  f.part(W.lumpy(f, ell(SN, 18, 16, 0, 12), 5), IRN({ fill: '#2a2a2e', inkW: 1.6 }));
  W.weld(f, [add(SN, [-14, -6]), add(SN, [0, 4]), add(SN, [16, -4])], 4, { a: deg(110) });
  const pd = [add(SN, [-40, -10]), add(SN, [-10, -36]), add(SN, [30, -30]), add(SN, [44, 0]), add(SN, [20, 18]), add(SN, [-30, 18])];
  const dpd = f.part(pd, OAK({ fill: '#8a9aa8', shadow: '#2e3844', light: '#d0dce4' })); W.bevel(f, dpd, E.bbox(pd), 4, { lite: '#e8f0f4' }); // carved pauldron (on the torso)
  W.clipDraw(f, pd, () => flakes(f, SN, 30, 16, 3, OAKB));
  W.rimeCrust(f, [add(SN, [-30, -20]), add(SN, [-6, -38]), add(SN, [32, -30])], 6, [1, -0.3]);

  f.bone('root');
  f.flat(ell([330, gy + 2], 210, 10, 0, 18), '#000', { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ SPECULUM BEARER (cast, large 1.4)
// A glass-porter of the spire stair: a huge man bent nearly double under the great speculum strapped to his back, a
// disc of pale brass-grey mirror metal wider than he is tall, its polished face outwards. Knees bent in a long stride,
// weight forward and low, both fists on the straps at his chest. An enormous back and neck, forearms like posts, bare
// calves bound in rags, one boot and one foot in sacking. Lightning struck the mirror on the stair: the metal fused to
// his back at the centre, the skin grown into the frame, aurora burns branching out across his shoulders. The speculum
// is seen at an angle: the room and a window reflected in it, frost-blind from the rim, cracked once; never a dark
// centre. Rig: humanoid + speculum (torso), cloth and bag (speculum), cap (head).
// Motion: idle is a heavy shift of the load and a frozen breath; attack turns and swings the mirror edge-first.
function speculumBearer() {
  const seed = 1128, CW = 1300, CH = T.large[1], f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 118;
  const N = [700, 528], C = [560, 480], Pv = [440, 650];
  const S = B.spine(N, C, Pv, H * 1.1);
  const SN = S.at(-0.1, 0.12), SF = S.at(0.3, 0.14);
  const EN = [596, 722], WN = [724, 652]; // forearms like posts: long and heavy (the elbows tucked low and back under the chest)
  const EF = [636, 730], WF = [756, 648];
  const HN = S.at(-0.1, 1.0), KN = [520, 860], AN = [420, 1000];
  const HF = S.at(0.3, 0.96), KF = [652, 846], AF = [628, 1000];
  const HC = [806, 574], hA = 0.2;
  const DC = [560, 362], DA = deg(-24), DR = [410, 204]; // the speculum: centre, tilt, semi-axes
  const dk = (t, k = 1) => add(DC, rot([Math.cos(t) * DR[0] * k, Math.sin(t) * DR[1] * k], DA));
  const disc = []; for (let i = 0; i < 64; i++) disc.push(dk(i / 64 * Math.PI * 2));
  const SKN = (o = {}) => W.SKI(f, Object.assign({ fill: '#b6bcc2', shadow: '#545a6e' }, o));
  const JK = (o = {}) => Object.assign({ fill: '#5e5a52', shadow: '#24221e', light: '#8a8478', shade: 0.42, tex: 'quilt' + seed, texOp: 0.7 }, o);
  const TR = (o = {}) => Object.assign({ fill: '#4a4842', shadow: '#1e1c1a', shade: 0.42, tex: 'weave' + seed, texOp: 0.5 }, o);
  const OAK = (o = {}) => Object.assign({ fill: '#5a4a36', shadow: '#241c14', light: '#8a765a', shade: 0.42, tex: 'wood' + seed, texOp: 0.55 }, o);
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.1, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('speculum', DC, 'torso').joint('cloth', dk(2.1), 'speculum').joint('bag', dk(2.6), 'speculum').joint('cap', add(HC, [0, -40]), 'head');

  // ---- far leg (forward, bent, foot flat in sacking)
  f.bone('thigh_f');
  W.legTube(f, HF, KF, lerp(KF, AF, 0.28), [128, 100, 92], TR({ fill: '#3e3c38' }), '_f', { A: AF, bp: [[0, 0.45, 0.12, 0.2]] });
  f.bone('shin_f');
  f.part(K.chain([lerp(KF, AF, 0.18), lerp(KF, AF, 0.55), AF], [84, 74, 52], { bq: [[0, 0.4, 0.14, 0.2]] }), SKN({ fill: '#a2a8b0' }));
  f.part(K.chain([lerp(KF, AF, 0.12), lerp(KF, AF, 0.3)], [96, 90]), TR({ fill: '#46443e', cast: false })); // rolled breeches cuff
  f.line([lp(KF, AF, 0.22, -46), lp(KF, AF, 0.22, 46)], 1.4, INK, { op: 0.6 });
  for (let i = 0; i < 6; i++) { const t = 0.3 + i * 0.1; f.stroke([lp(KF, AF, t, 34), lp(KF, AF, t + 0.04, 0), lp(KF, AF, t + 0.07, -30)], 14, i % 2 ? '#6a665c' : '#5a564c'); f.line([lp(KF, AF, t, 30), lp(KF, AF, t + 0.06, -28)], 1, INK, { op: 0.5 }); }
  f.bone('foot_f');
  B.bareFoot(f, AF, 1, 92, '#7a705a', { tex: 'weave' + seed, texOp: 0.9, shadow: '#2a2418', nail: '#7a705a' });
  for (const u of [0.1, 0.5]) f.line([[AF[0] + u * 92, AF[1] + 6], [AF[0] + u * 92 + 14, gy - 4]], 3, '#5a4c3e');
  W.rope(f, [add(AF, [-24, 14]), add(AF, [20, 6]), add(AF, [50, 40])], 3, { col: '#5a4c3e' });
  W.rimeCrust(f, [add(AF, [40, -6]), add(AF, [96, 30]), add(AF, [124, 60])], 6, [1, -0.3]);

  // ---- far arm (behind the body), fist on the strap
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [86, 76, 66], JK({ fill: '#4e4a44' }), '_f');
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2 - 0.3, 40, '#9ea4ac', { shadow: '#4a4e5e', tex: 'mottle' + seed, texOp: 0.4, name: 'bearer strap far' });

  // ---- near leg (behind, driving), boot
  f.bone('thigh_n');
  W.legTube(f, HN, KN, lerp(KN, AN, 0.28), [134, 104, 96], TR(), '_n', { A: AN, bq: [[0, 0.4, 0.12, 0.2]] });
  f.bone('shin_n');
  const shN = K.chain([lerp(KN, AN, 0.18), lerp(KN, AN, 0.55), AN], [88, 76, 54], { bp: [[0, 0.4, 0.14, 0.2]] });
  f.part(shN, SKN());
  W.clipDraw(f, shN, () => { W.creaseField(f, lerp(KN, AN, 0.4), 20, 30, 4, ang(KN, AN), 18, 2, { col: '#2a2e3a' }); });
  for (let i = 0; i < 6; i++) { const t = 0.32 + i * 0.1; f.stroke([lp(KN, AN, t, 36), lp(KN, AN, t + 0.04, 0), lp(KN, AN, t + 0.07, -34)], 15, i % 2 ? '#7a766a' : '#68645a'); f.line([lp(KN, AN, t, 32), lp(KN, AN, t + 0.06, -30)], 1, INK, { op: 0.5 }); }
  f.part(K.chain([lerp(KN, AN, 0.12), lerp(KN, AN, 0.3)], [100, 94]), TR({ fill: '#52504a', cast: false }));
  f.line([lp(KN, AN, 0.22, -48), lp(KN, AN, 0.22, 48)], 1.4, INK, { op: 0.6 });
  W.rimeCrust(f, [lp(KN, AN, 0.0, -48), lp(KN, AN, 0.5, -38)], 7, [1, -0.2]);
  f.bone('foot_n');
  W.bootRig(f, KN, AN, 86, '#3e342c', '_n', { tex: 'mottle' + seed });

  // ---- body: the enormous back under a quilted jerkin, the porter's shoulder pad of stuffed leather
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.5, 0.5], [0.06, 0.86, 0.66], [0.25, 0.94, 0.84], [0.5, 0.88, 0.86], [0.72, 0.76, 0.84], [0.9, 0.7, 0.78], [1.06, 0.72, 0.7]]);
  f.part(torso, JK());
  W.clipDraw(f, torso, () => {
    for (let i = 0; i < 6; i++) f.line([S.at(-0.9, 0.1 + i * 0.16), S.at(0.0, 0.12 + i * 0.16), S.at(0.9, 0.1 + i * 0.16)], 1.8, INK, { op: 0.4 }); // quilting
    W.hoar(f, S.at(0.4, 0.3), 60, 40, 0.6);
    f.flat(ell(S.at(0.3, 0.7), 30, 16, 0.3, 10), '#3a3830', { op: 0.35 });
    f.part(hard([S.at(0.2, 0.5), S.at(0.5, 0.5), S.at(0.5, 0.7), S.at(0.2, 0.7)]), JK({ fill: '#4e4a42', cast: false, inkW: 1 })); f.stitches([S.at(0.2, 0.5), S.at(0.5, 0.5), S.at(0.5, 0.7), S.at(0.2, 0.7), S.at(0.2, 0.5)], '#a8a090', 0.9);
  });
  W.rope(f, [S.at(-0.9, 0.86), S.at(0.0, 0.88), S.at(0.88, 0.86)], 7, { col: '#5a4c3e' }); // rope belt
  // ---- the great speculum on his back (drawn behind the body; its frame and straps over the shoulders come after)
  f.bone('speculum');
  // the oak carrying frame: two crossed planks whose ends stand out past the rim
  for (const t of [0.25, 1.85]) { const a = dk(t, 1.08), b = dk(t + Math.PI, 1.08); f.part(limb(a, b, 40, 40, { steps: 6, capK: 0.15 }), OAK()); f.part(limb(dk(t, 1.0), dk(t, 1.1), 44, 44, { steps: 2, capK: 0.1 }), W.IR(f, { cast: false })); }
  // the disc's rim thickness, shown along the lower edge
  const rim = disc.map(q => add(q, [10, 22]));
  f.part(rim, Object.assign(W.BRD(f, { fill: '#6e6a5e', shadow: '#2a2a2c', light: '#c8c4b0' }), { cast: true }));
  W.glazed(f, disc, {
    axis: DA, base: '#8a8a7e', shadow: '#40403e', frost: 0.25, win: [-0.18, -0.12], crack: [dk(3.6, 0.95), dk(0.55, 0.92)], k: 1,
    after: (c, d, nn, Rw) => {
      // the speculum metal: a pale brass-grey cast disc, its bevelled edge catching the light, polishing swirls
      for (let r = 0; r < 4; r++) { const a0 = f.r() * 6.3; const arc = []; for (let i = 0; i < 12; i++) { const t = a0 + i * 0.14; arc.push(dk(t, 0.35 + r * 0.14)); } f.line(arc, 1.2, '#f4f2e6', { op: 0.25 }); }
      W.lichtenberg(f, dk(1.0, 0.5), deg(-160), 120, 2.4, { metal: true, depth: 3 });
      W.hoar(f, dk(4.4, 0.82), 150, 50, 0.7);
      f.flat([dk(0.2, 1.1), dk(1.0, 1.1), dk(1.6, 1.1), dk(2.4, 1.1), dk(2.9, 1.1), dk(2.6, 0.4), dk(0.6, 0.3)], '#2a2c30', { op: 0.28 }); // the lower half darker, turned from the light
      { const q = dk(2.8, 0.7); f.flat([add(q, [-26, 6]), add(q, [-4, -4]), add(q, [24, -10]), add(q, [4, 2])], '#3a4048', { op: 0.35 }); f.line([add(q, [-24, 4]), add(q, [22, -9])], 1.2, '#f2f6f8', { op: 0.6 }); } // a long dent and scratch, never a round dark spot (no pupil on the mirror)
    },
  });
  // the bevelled outer ring of the casting, lit along the top
  f.line(disc.concat([disc[0]]), 4, INK); f.line(disc.slice(34, 58), 3, '#e8e6d4', { op: 0.6 });
  f.line(disc.map(q => lerp(q, DC, 0.035)).concat([lerp(disc[0], DC, 0.035)]), 1.4, '#5a5a54', { op: 0.7 });
  W.rimeCrust(f, disc.slice(30, 60).filter((_, i) => i % 3 === 0), 10, [1, -0.3]);
  W.icicles(f, rim.slice(2, 30), 18, 14, 46);
  // a polishing cloth and a pumice bag hanging plumb from the frame's lower plank end
  f.bone('cloth');
  const ce = dk(2.1, 1.04);
  f.part([add(ce, [-14, 0]), add(ce, [18, -4]), add(ce, [26, 70]), add(ce, [14, 96, 1]), add(ce, [4, 80]), add(ce, [-8, 100, 1]), add(ce, [-18, 60])], W.WOOL(f, { fill: '#8a8270', shadow: '#3a3428' }));
  W.icicles(f, [add(ce, [14, 96]), add(ce, [-8, 100])], 2, 10, 20);
  f.bone('bag');
  const bg = dk(2.6, 1.06);
  W.rope(f, [bg, add(bg, [0, 40])], 2.4, { col: '#5a4c3e' });
  f.part([add(bg, [-22, 40]), add(bg, [20, 38]), add(bg, [30, 80]), add(bg, [16, 104]), add(bg, [-18, 104]), add(bg, [-30, 76])], W.LEA(f, { fill: '#5a4a3a' }));
  f.flat(ell(add(bg, [0, 74]), 10, 6, 0, 8), '#c8c4b8', { op: 0.6 }); // pumice dust
  W.icicles(f, [add(bg, [-18, 104]), add(bg, [16, 104])], 2, 8, 16);

  f.bone('torso');
  // where the disc fused into his back: the skin grown up over the frame's centre boss, burns branching out over the shoulders
  const fz = dk(1.25, 1.0);
  const fzr = [add(fz, [-70, 10]), add(fz, [-40, -18]), add(fz, [-10, -8]), add(fz, [20, -26]), add(fz, [56, -30]), add(fz, [70, -4]), add(fz, [30, 16]), add(fz, [-20, 22])];
  f.part(fzr, SKN({ fill: '#aab0b6', k: 0.7 })); // skin grown up over the frame's centre boss
  W.clipDraw(f, fzr, () => { for (let i = 0; i < 5; i++) f.line([add(fz, [-56 + i * 26, -14]), add(fz, [-48 + i * 26, 14])], 1.2, INK, { op: 0.5 }); });
  W.weld(f, [add(fz, [-60, 8]), add(fz, [0, -14]), add(fz, [60, -26])], 5, { a: deg(20) });
  W.clipDraw(f, torso, () => { W.lichtenberg(f, add(fz, [0, 14]), deg(80), 150, 3, { depth: 3 }); W.lichtenberg(f, add(fz, [-30, 10]), deg(140), 120, 2.6, { depth: 3 }); W.lichtenberg(f, add(fz, [20, 10]), deg(40), 100, 2.4, { depth: 2 }); });
  // the porter's shoulder pad of stuffed leather, low on the near shoulder under the strap
  const pad = [S.at(-0.2, -0.06), S.at(0.1, -0.16), S.at(0.5, -0.06), S.at(0.52, 0.12), S.at(0.1, 0.16), S.at(-0.24, 0.12)];
  f.part(pad, W.LEA(f, { fill: '#5a4a3a', k: 0.8 }));
  W.clipDraw(f, pad, () => { for (let i = 0; i < 3; i++) f.stitches([S.at(-0.1 + i * 0.2, -0.1), S.at(-0.08 + i * 0.2, 0.12)], '#b0a080', 0.9); W.hoar(f, S.at(0.3, -0.06), 30, 14, 0.7); });
  // straps: from the frame over the shoulders and down the front of the chest, lashed with rope
  for (const [a, b] of [[S.at(-0.4, -0.2), WN], [S.at(0.2, -0.24), WF]]) { const m = add(lerp(a, b, 0.5), [30, -10]); const st = W.ribbon(W.spline([a, m, add(b, [0, 30])], 4), 22); f.part(st, W.LEA(f, { fill: '#4a3e32' })); f.stitches(W.spline([a, m, add(b, [0, 30])], 6).map(q => add(q, [4, 0])), '#a89878', 0.8); }
  W.rope(f, [dk(0.9, 0.9), S.at(-0.4, -0.2), S.at(0.0, 0.3)], 4, { col: '#6a5c48' });
  W.rope(f, [dk(1.4, 0.95), S.at(-0.6, 0.6), S.at(-0.2, 0.9)], 4, { col: '#6a5c48' });
  W.rimeCrust(f, [S.at(-0.5, -0.2), S.at(0.1, -0.28), S.at(0.6, -0.08)], 9, [1, -0.3]);

  // ---- neck and head: a small head on a thick neck, pushed forward under the load; felt cap; broken nose; frost in the stubble
  f.bone('head');
  const nk = [S.at(-0.3, 0.06), S.at(-0.1, -0.2), add(HC, [-30, -40]), add(HC, [10, 40]), S.at(0.6, 0.2)];
  f.part(nk, SKN());
  W.clipDraw(f, nk, () => { for (let i = 0; i < 3; i++) f.line([add(S.at(0.2, 0.0), [i * 14, -10]), add(S.at(0.2, 0.1), [i * 14 + 10, 20])], 1.4, INK, { op: 0.5 }); W.lichtenberg(f, S.at(0.0, 0.0), deg(-20), 70, 2.2, { depth: 2 }); });
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: '#b6bcc2', jaw: 1.3, chin: 0.03, nose: 1.0, hook: -0.3, mouth: 'grim', squint: 0.6, browDown: 0.12, browW: 0.07, age: true, faceShade: 0.8, jawShade: 0.5,
    eyeWhite: '#d0dae0', iris: '#1e2228', hairCol: '#3a3836', browCol: '#2a2826', beard: 'stubble', beardCol: '#4a4a4c',
  });
  f.line(hF([[0.33, -0.03], [0.37, 0.04], [0.34, 0.08]]), 2.2, INK, { op: 0.7 }); // the break in the nose
  f.line(hF([[0.14, 0.22], [0.2, 0.32], [0.18, 0.4]]), 1.8, INK, { op: 0.6 }); // the set jaw muscle
  W.clipDraw(f, hF([[-0.2, 0.18], [0.36, 0.2], [0.34, 0.6], [0.0, 0.6], [-0.2, 0.36]]), () => W.hoar(f, hF([[0.14, 0.42]])[0], 34, 20, 0.8));
  for (const q of hF([[0.3, 0.5], [0.16, 0.55], [0.04, 0.52]])) W.icicle(f, q, 10 + f.r() * 8, 3.2);
  f.flat(ell(hF([[0.42, 0.24]])[0], 5, 3, 0, 8), '#e8eef2', { op: 0.6 }); // a frozen breath at the lips
  f.bone('cap');
  const cap = hF([[-0.42, -0.1], [-0.5, -0.36], [-0.32, -0.56], [-0.04, -0.62], [0.2, -0.54], [0.32, -0.36], [0.32, -0.26], [0.0, -0.28], [-0.3, -0.2]]);
  f.part(cap, W.WOOL(f, { fill: '#5a544a', shadow: '#221e1a' }));
  W.clipDraw(f, cap, () => { W.fold(f, hF([[-0.2, -0.56], [-0.1, -0.32]]), 1.6); W.hoar(f, hF([[0.0, -0.52]])[0], 30, 14, 0.8); });
  f.part(hF([[-0.44, -0.1], [0.0, -0.3], [0.33, -0.28], [0.33, -0.2], [0.0, -0.22], [-0.42, -0.02]]), W.WOOL(f, { fill: '#4a453c', cast: false, inkW: 1.1 }));
  W.rimeCrust(f, hF([[-0.32, -0.58], [-0.04, -0.64], [0.2, -0.56], [0.32, -0.38]]), 6, [1, -0.3]);

  // ---- near arm, forearm like a post, the fist on the strap at the chest
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [90, 80, 70], JK({ fill: '#625e56' }), '_n', { bp: [[0, 0.5, 0.22, 0.22]], bq: [[0, 0.6, 0.12, 0.2], [1, 0.3, 0.12, 0.2]] });
  f.bone('forearm_n');
  const fa = W.jointLimb(lerp(SN, EN, 0.7), EN, WN, [88, 80, 66], { point: 0.25 });
  f.part(K.chain([lerp(EN, WN, 0.16), lerp(EN, WN, 0.95)], [88, 58], { bp: [[0, 0.3, 0.2, 0.22]] }), SKN());
  W.clipDraw(f, K.chain([lerp(EN, WN, 0.16), lerp(EN, WN, 0.95)], [84, 60]), () => { W.creaseField(f, lerp(EN, WN, 0.5), 20, 16, 3, ang(EN, WN), 20, 2, { col: '#2a2e3a' }); W.lichtenberg(f, lerp(EN, WN, 0.3), deg(10), 60, 2, { depth: 2 }); });
  void fa;
  { const r0 = lerp(EN, WN, 0.1), r1 = lerp(EN, WN, 0.27), rc = K.chain([r0, r1], [96, 92]); f.part(rc, JK({ fill: '#625e56', cast: false })); W.clipDraw(f, rc, () => { for (const t of [0.15, 0.2, 0.25]) W.fold(f, [lp(EN, WN, t, -42), lp(EN, WN, t + 0.02, 0), lp(EN, WN, t, 42)], 1.6); }); } // the jerkin sleeve rolled up to the elbow
  W.crease(f, [lp(EN, WN, 0.32, -30), lp(EN, WN, 0.55, -34), lp(EN, WN, 0.85, -24)], 2.6, { col: '#2a2e3a', op: 0.5 }); f.line([lp(EN, WN, 0.34, -36), lp(EN, WN, 0.6, -38)], 1.4, '#e8eef0', { op: 0.4 }); // the brachioradialis swelling along the top
  W.rimeCrust(f, [lp(EN, WN, 0.2, -38), lp(EN, WN, 0.9, -32)], 6, [1, -0.3]);
  W.icicles(f, [lp(SN, EN, 0.95, 40), lp(EN, WN, 0.3, 40)], 3, 10, 26);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, -Math.PI / 2 - 0.3, 42, '#b0b6bc', { shadow: '#4e5466', tex: 'mottle' + seed, texOp: 0.4, name: 'bearer strap near' });
  W.fistDetail(f, gN, 42 * 1.18, '#b0b6bc', {});
  W.facets(f, WN, 18, 14, 3, { s: 0.7 });

  f.bone('root');
  f.flat(ell([560, gy + 4], 300, 16, 0, 18), '#000', { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ GATE MASTIFF (cast, large, 1.2 long)
// The observatory's gate dog, frozen mid-bark at the end of its chain. Rebuilt in the independent review on the Plague
// Wolf and Magma Hound habits, with a mastiff's mass:
//   - body: a deep rounded chest dropping to the elbows, a tucked loin behind the last rib, the croup low and loaded on
//     bent hindquarters; muscle masses modelled at the shoulder (the blade, the deltoid, the triceps bulging behind to
//     the elbow) and at the thigh (the round haunch, the biceps femoris, the gaskin into the hock);
//   - legs: they emerge from the body at the elbow and the stifle; thick forearms, the carpus, the hock point behind,
//     heavy paws;
//   - head: a massive broad skull (the far brow and the far ear show over its top), a pronounced stop, a short square
//     muzzle with heavy hanging flews, folded rose ears, deep furrows across the forehead and one up the middle; a small
//     dark eye deep under the brow; the snarl lifts the upper lip off the canine and wrinkles the top of the muzzle; the
//     jaw is dropped on its hinge mid-bark; a wide nose leather with slit nostrils.
// Frost: the frozen breath hangs from the flews and the jaw in a jagged beard of icicles, ice crusted on the teeth, rime
// thick on the windward front, the coat frozen in faceted plates. Lightning came down the chain: the hair along the
// spine stands in a frozen ridge and burns branch from the collar across the chest. Spiked iron collar fused to the chain;
// the chain runs back under the belly to the iron staple torn from the gatepost; a pilgrim's torn shoe in the links; a
// gnawed bone under the near forepaw; a brass name plate; old bite scars on the muzzle and flank; ice between the toes.
// Rig: spine_1 (hips, root) > spine_2 > neck > head > jaw; tail; legs leg_[f|h][n|f]_1..3; chain (neck).
// Motion: idle is a straining lean on the chain, then the jaws snapping; attack is a lunge and a holding bite.
function gateMastiff() {
  const seed = 1130, CW = 1300, CH = T.large[1], f = new Fig(W.base(seed, CH));
  W.textures(f); const fur = W.furTex(f);
  const gy = f.o.groundY, furC = '#7c7e80';
  const FUR = (o = {}) => Object.assign({ fill: furC, shadow: '#2a2e36', light: '#c8d0d6', shade: 0.4, tex: fur, texOp: 0.7, maxShade: 28 }, o);
  const groove = (pts, w = 3, op = 0.55) => W.crease(f, pts, w, { col: '#14161c', op });
  const ridge = (pts, w = 1.4, op = 0.4) => f.line(pts, w, '#e8eef0', { op });
  // legs: centre line from inside the body to the paw; half-widths [back (-x), front (+x)]; kI carpus / hock, fI pastern
  const WFo = [[72, 72], [66, 58], [52, 44], [36, 32], [31, 29], [29, 28]], WHi = [[92, 92], [88, 72], [70, 50], [44, 32], [32, 30], [30, 28]];
  const LEG = {
    hf: { C: [[520, 720], [516, 800], [470, 876], [430, 946], [444, 1004], [458, 1042]], W: WHi, T: [474, gy] },
    ff: { C: [[770, 760], [774, 852], [800, 930], [826, 990], [838, 1030], [850, 1048]], W: WFo, T: [866, gy] },
    hn: { C: [[470, 720], [462, 800], [414, 878], [370, 946], [384, 1004], [398, 1042]], W: WHi, T: [414, gy] },
    fn: { C: [[820, 760], [830, 856], [862, 932], [890, 990], [902, 1030], [914, 1048]], W: WFo, T: [930, gy] },
  };
  for (const L of Object.values(LEG)) { L.kI = 3; L.fI = 4; }
  const HC = [916, 650], hA = 0.04, hs = 0.96, HF = frame(HC, hA, hs), hinge = [0, 48], jO = 0.24;
  const jR = pts => pts.map(([u, v]) => { const q = rot([u - hinge[0], v - hinge[1]], jO); return [q[0] + hinge[0], q[1] + hinge[1]]; });
  f.joint('spine_1', [420, 680]).joint('spine_2', [640, 680], 'spine_1').joint('neck', [800, 640], 'spine_2').joint('head', HF([[-20, 0]])[0], 'neck').joint('jaw', HF([hinge])[0], 'head').joint('tail', [340, 636], 'spine_1').joint('chain', [880, 770], 'neck');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.C[1], par).joint(`leg_${k}_2`, L.C[L.kI], `leg_${k}_1`).joint(`leg_${k}_3`, L.C[L.fI], `leg_${k}_2`); }
  const leg = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', C = L.C, K0 = C[L.kI], F0 = C[L.fI];
    const look = FUR(far ? { fill: mix(furC, '#000', 0.3), shadow: '#1a1c22' } : {});
    const wl = L.W.map(w => w[0]), wr = L.W.map(w => w[1]);
    const out = W.legOutline(C, wl, wr);
    const cutK = lerp(C[L.kI - 1], K0, 0.7), dK = E.norm(sub(C[L.kI + 1], C[L.kI - 1])), dF = E.norm(sub(C[L.fI + 1], C[L.fI - 1]));
    W.split(f, () => {
      f.part(out, Object.assign({ k: 0.9 }, look));
      W.clipDraw(f, out, () => {
        for (let s0 = 1; s0 < C.length - 1; s0++) W.wrapHatch(f, C[s0], C[s0 + 1], (wl[s0] + wr[s0]) * 0.5, (wl[s0 + 1] + wr[s0 + 1]) * 0.5, -1, 3, { w: 2, op: 0.3, bow: 0.18 });
        if (front) { groove([lp(C[1], C[2], 0.0, 30), lp(C[1], C[2], 0.7, 24), lp(C[2], K0, 0.7, 14)], 2.6, 0.5); groove([lp(C[1], C[2], 0.1, -36), lp(C[2], K0, 0.3, -26)], 2.2, 0.4); } // the forearm's flexor and extensor edges
        else { groove([lp(C[1], C[2], 0.0, -46), lp(C[2], K0, 0.5, -20)], 2.6, 0.5); groove([lp(C[1], C[2], 0.1, 44), lp(C[2], K0, 0.4, 26)], 2.2, 0.45); f.line([lp(C[2], K0, 0.1, 30), lp(C[2], K0, 0.95, 20)], 1.4, '#e0e4e2', { op: 0.35 }); } // the gaskin, the Achilles to the hock
        f.flat(ell(K0, 20, 16, 0, 10), '#0e1014', { op: 0.18 });
        if (!far) W.furPlates(f, out, lerp(C[1], C[2], 0.5), 30, 40, 4, { dir: 1.5, s: 0.8 });
      });
      if (!front) f.part([add(K0, [-wl[L.kI] + 6, -16]), add(K0, [-wl[L.kI] - 16, 2]), add(K0, [-wl[L.kI] + 6, 18])], Object.assign({}, look, { inkW: 1.2, cast: false })); // the point of the hock
      else f.part(ell(add(K0, [-wl[L.kI] + 4, 6]), 10, 8, 0, 8), Object.assign({}, look, { inkW: 1.1, cast: false })); // the stopper pad at the back of the carpus
      if (!far) W.rimeCrust(f, [lp(C[1], C[2], 0.5, -wr[1] - 2), lp(C[2], K0, 0.6, -wr[2] - 2), lp(K0, F0, 0.5, -wr[3] - 2)], 6, [1, -0.2]);
      W.paw(f, L.T, 38, 1, FUR(far ? { fill: mix(furC, '#000', 0.3), tex: undefined } : { tex: undefined }));
    }, [[`leg_${k}_1`, W.side(cutK, mul(dK, -1), 24)], [`leg_${k}_2`, [W.side(cutK, dK, 24), W.side(F0, mul(dF, -1), 20)]], [`leg_${k}_3`, W.side(F0, dF, 20)]]);
  };

  // ---- the chain, behind everything: from the collar back under the belly to the staple snagged in the floor
  f.bone('chain');
  const st = [176, gy - 16];
  W.chainLinks(f, [[876, 780], [780, 900], [620, 970], [440, 1036], [300, 1048], add(st, [16, 0])], 22, P.ironL);
  f.bone('root');
  f.flat([[100, gy - 2], [150, gy - 8], [200, gy - 2], [260, gy + 2], [200, gy + 4], [120, gy + 4]], '#0c0c10', { op: 0.8 });
  f.part([add(st, [-56, -40]), add(st, [-10, -56]), add(st, [30, -40]), add(st, [36, 0]), add(st, [12, 14]), add(st, [-52, 12])], { fill: '#5a4a36', shadow: '#241c14', light: '#8a765a', shade: 0.42, tex: 'wood' + seed, texOp: 0.6 });
  for (let i = 0; i < 5; i++) f.line([add(st, [-56 + i * 8, -40 + i * 2]), add(st, [-70 + i * 6, -58 - i * 3])], 3, '#5a4a36');
  f.line([add(st, [-20, -30]), add(st, [-14, -64]), add(st, [16, -66]), add(st, [20, -32])], 10, INK); f.line([add(st, [-20, -30]), add(st, [-14, -64]), add(st, [16, -66]), add(st, [20, -32])], 6, P.ironL);
  W.rimeCrust(f, [add(st, [-56, -40]), add(st, [-10, -56]), add(st, [30, -40])], 6, [1, -0.3]);
  const sh = [600, 1010];
  f.part([add(sh, [-40, -8]), add(sh, [-10, -30]), add(sh, [26, -26]), add(sh, [44, -6]), add(sh, [30, 10]), add(sh, [-36, 12])], W.LEA(f, { fill: '#4e4238' }));
  f.flat([add(sh, [-14, -24]), add(sh, [14, -22]), add(sh, [10, -10]), add(sh, [-10, -10])], '#0e0c0a', { op: 0.85 });
  f.line([add(sh, [26, -24]), add(sh, [40, -40]), add(sh, [34, -52])], 2, '#4e4238');
  W.rimeCrust(f, [add(sh, [-10, -32]), add(sh, [26, -28]), add(sh, [44, -8])], 5, [1, -0.3]);

  // ---- the legs (far, then near), all emerging from under the body; the gnawed bone under the near forepaw
  leg('hf', true); leg('ff', true);
  f.bone('leg_fn_3');
  const bn = [900, gy - 10];
  f.part(limb(add(bn, [-80, 4]), add(bn, [10, -6]), 18, 16, { steps: 4 }), { fill: '#d8d0bc', shadow: '#6a6250', shade: 0.4, inkW: 1.2, light: '#ffffff' });
  for (const e of [add(bn, [-80, 4]), add(bn, [10, -6])]) f.part(ell(e, 14, 12, 0, 10), { fill: '#d0c8b0', shadow: '#6a6250', shade: 0.4, inkW: 1.2, cast: false });
  for (let i = 0; i < 4; i++) f.line([add(bn, [-50 + i * 14, -6]), add(bn, [-46 + i * 14, 4])], 1.2, INK, { op: 0.6 });
  leg('hn', false); leg('fn', false);

  // ---- tail: carried out stiff behind, frozen in the strain, thick at the root, the hair stood up along it
  f.bone('tail');
  const tl = W.spline([[344, 636], [300, 628], [250, 632], [206, 652], [176, 684]], 5);
  f.part(W.ribbon(tl, t => 44 - t * 28), FUR({ cast: false }));
  W.bristleRidge(f, tl.slice(0, -2), 16, { up: [0, -1], col: '#6a6c70', w: 6 });
  W.icicles(f, tl.map(q => add(q, [0, 14])), 3, 8, 18);

  // ---- the neck: short, thick, thrust forward from the withers, loose skin at the throat (under the body's front)
  f.bone('neck');
  const neck = [[650, 560], [740, 540], [830, 552], [900, 590], [944, 650], [952, 730], [924, 790], [876, 812], [820, 780], [760, 700], [700, 620]];
  f.part(neck, FUR({ maxShade: 20 }));
  W.clipDraw(f, neck, () => {
    W.softTone(f, E.smooth(neck), [[[[860, 700], [950, 720], [930, 800], [860, 800]], '#000', 0.4, 16], [[[700, 556], [830, 550], [880, 600], [760, 600]], '#ffffff', 0.2, 16]]);
    for (let i = 0; i < 4; i++) W.crease(f, [[840 + i * 20, 640 + i * 4], [850 + i * 20, 700], [842 + i * 20, 770]], 2.6, { col: '#1a1e26', op: 0.5 }); // the loose folds of the throat
    W.furPlates(f, neck, [890, 700], 50, 70, 8, { dir: 1.4 }); W.hoar(f, [930, 700], 30, 70, 0.8);
  });
  W.bristleRidge(f, [[660, 556], [740, 538], [820, 546], [880, 574]], 24, { up: [0.1, -1], col: '#5e6066', w: 8, taper: true });

  // ---- the body: the deep rounded chest dropping to the elbows, the loin tucked up, the croup low on bent haunches
  const body = [[336, 632], [370, 610], [430, 598], [500, 592], [580, 578], [650, 560], [700, 550], [760, 556], [840, 600], [894, 662], [916, 740], [904, 804], [872, 852], [820, 882], [756, 892], [690, 882], [630, 852], [584, 806], [548, 772], [506, 762], [474, 774], [446, 806], [404, 832], [364, 818], [350, 800], [328, 740], [322, 680]];
  const cut = [620, 700];
  W.split(f, () => {
    f.part(body, FUR());
    W.clipDraw(f, body, () => {
      W.softTone(f, E.smooth(body), [
        [[[620, 830], [740, 900], [880, 860], [920, 760], [840, 820], [700, 830]], '#000', 0.5, 20], // the chest turning under, deep and round
        [[[520, 640], [600, 640], [600, 790], [520, 770]], '#000', 0.4, 22], // the tucked loin behind the last rib
        [[[700, 560], [800, 570], [830, 640], [740, 660]], '#ffffff', 0.24, 18], // the lit withers and shoulder blade
        [[[340, 630], [440, 610], [470, 700], [400, 760], [340, 720]], '#ffffff', 0.2, 20], // the lit haunch
        [[[440, 740], [500, 760], [460, 820], [400, 830]], '#000', 0.3, 16],
        [[[700, 600], [790, 620], [810, 760], [750, 830], [690, 730]], '#ffffff', 0.16, 18], // the shoulder's muscle mass, lit
        [[[650, 690], [700, 700], [736, 860], [676, 852]], '#000', 0.32, 14], // the hollow behind the triceps
        [[[500, 610], [540, 640], [530, 760], [490, 790]], '#000', 0.34, 14]]); // the shadow in front of the thigh // under the thigh
      W.barrelHatch(f, 640, 900, x => 640, x => 890 - Math.abs(x - 760) * 0.2, { bow: 16, step: 15, op: 0.3 });
      W.barrelHatch(f, 340, 470, x => 680, x => 820, { bow: -12, step: 16, op: 0.26 });
      for (let i = 0; i < 5; i++) { const x0 = 610 + i * 30; groove([[x0 + 30, 690], [x0 + 16, 770], [x0 - 4, 850 - i * 8]], 4, 0.2); } // ribs under the frozen coat
      // the shoulder: the blade's spine, the deltoid's lower edge, the triceps bulging behind to the elbow
      groove([[700, 560], [736, 640], [776, 720]], 3.6, 0.6); ridge([[712, 562], [748, 640]]);
      groove([[776, 720], [820, 740], [870, 730]], 2.8, 0.5); // the deltoid over the point of the shoulder
      groove([[690, 700], [700, 790], [740, 860], [790, 880]], 4.2, 0.72); ridge([[704, 710], [714, 790], [748, 852]], 1.4, 0.35); // the triceps' back edge to the elbow
      f.flat(ell([760, 790], 46, 60, 0.3, 12), '#ffffff', { op: 0.08 });
      // the thigh: the round haunch over the stifle, the biceps femoris's groove, the hip and pin bones
      groove([[392, 606], [424, 690], [448, 790]], 3.4, 0.6); // the biceps femoris
      groove([[498, 600], [516, 680], [500, 748], [474, 782]], 4.4, 0.75); ridge([[486, 610], [502, 680], [488, 742]], 1.6, 0.4); // the front of the thigh's mass, into the stifle
      groove([[346, 624], [370, 640]], 2.4, 0.5); groove([[470, 600], [496, 616]], 2.4, 0.45); // the pin and hip bones
      groove([[566, 640], [580, 710], [572, 780]], 2.2, 0.25); // the last rib into the tuck
      W.furPlates(f, body, [780, 780], 90, 90, 14, { dir: 1.3, s: 1.0 });
      W.furPlates(f, body, [420, 710], 80, 60, 9, { dir: 1.5, s: 0.9, op: 0.7 });
      W.hoar(f, [880, 760], 40, 100, 0.85); W.hoar(f, [740, 600], 60, 40, 0.6);
      W.clipDraw(f, [[780, 680], [930, 660], [930, 920], [740, 920]], () => { W.lichtenberg(f, [870, 760], deg(140), 150, 2.8, { depth: 3 }); W.lichtenberg(f, [880, 790], deg(105), 120, 2.4, { depth: 3 }); });
      f.flat(ell([420, 700], 24, 6, -0.3, 10), '#3a3c40', { op: 0.5 }); f.line([[400, 704], [440, 696]], 1.2, '#d8dee2', { op: 0.6 }); // an old bite scar on the flank
    });
  }, [['spine_1', W.side(cut, [-1, 0], 200)], ['spine_2', W.side(cut, [1, 0], 200)]]); // a wide overlap disk so the back and chest stay closed when the spine bends
  f.bone('spine_2'); W.bristleRidge(f, [[540, 584], [610, 570], [680, 554], [740, 552]], 30, { up: [-0.15, -1], col: '#5e6066', w: 9, taper: true, icicle: 0.2 });
  f.bone('spine_1'); W.bristleRidge(f, [[350, 622], [400, 604], [470, 594], [540, 584]], 18, { up: [-0.1, -1], col: '#5e6066', w: 8, taper: true });
  f.bone('spine_2'); W.rimeCrust(f, [[840, 600], [894, 662], [916, 740], [904, 804], [872, 852]], 12, [1, -0.1]);
  W.icicles(f, [[630, 852], [690, 882], [756, 892], [820, 882], [872, 852]], 8, 12, 34);
  f.bone('spine_1'); W.icicles(f, [[364, 818], [404, 832], [446, 806], [506, 762]], 5, 10, 24);

  // ---- the spiked collar round the neck's base, fused to the chain; the brass name plate
  f.bone('neck');
  const cA = [846, 586], cM = [880, 690], cB = [872, 800];
  f.part(K.chain([cA, cM, cB], [30, 32, 30]), W.IR(f, { inkW: 1.4 }));
  for (const q of [lerp(cA, cM, 0.3), cM, lerp(cM, cB, 0.5), lerp(cA, cM, 0.75)]) { const d = rot([1, 0], ang(cA, cB) - Math.PI / 2); f.part(hard([add(q, rot([0, -8], ang(cA, cB) - Math.PI / 2)), add(q, mul(d, 36)), add(q, rot([0, 8], ang(cA, cB) - Math.PI / 2))]), W.IR(f, { fill: P.ironL, inkW: 1.1, cast: false })); }
  f.part(hard([[874, 722], [908, 718], [910, 748], [876, 752]]), W.BRD(f, { inkW: 1.1, cast: false })); for (let i = 0; i < 4; i++) f.line([[880 + i * 7, 728], [882 + i * 7, 742]], 1, INK, { op: 0.6 });
  W.fusedBead(f, [870, 784], 6); W.weld(f, [[864, 768], [868, 792], [874, 808]], 5, { lich: false });

  // ---- the head. Frame HF: +x toward the nose, -y the top of the skull, +y the jaw. The far rose ear and the far brow
  // show over the top of the broad skull.
  f.bone('head');
  const earF = HF([[-10, -124], [22, -140], [-4, -154], [-44, -146], [-60, -130]]);
  f.part(earF, FUR({ fill: '#5e6064', tex: undefined, k: 0.7, cast: false }));
  // the lower jaw, dropped on its hinge mid-bark (its own bone), drawn first so the upper flews hang over it
  f.bone('jaw');
  const jaw = HF(jR([[-24, 36], [60, 52], [140, 66], [190, 74], [208, 78], [214, 92], [206, 108], [170, 112], [100, 106], [30, 94], [-16, 70]]));
  f.part(jaw, FUR({ tex: undefined, fill: '#868890', maxShade: 10 }));
  W.clipDraw(f, jaw, () => { W.hoar(f, HF(jR([[160, 100]]))[0], 40, 14, 0.7); f.line(HF(jR([[40, 96], [140, 104], [200, 104]])), 1.6, INK, { op: 0.35 }); });
  f.flat(HF(jR([[140, 70], [190, 76], [208, 82], [190, 86], [140, 80]])), '#3a2a2e'); // the lower lip's dark edge
  for (const [u, l, w] of [[192, 24, 6], [206, 9, 3.4], [176, 7, 3]]) { const q = HF(jR([[u, 76]]))[0]; f.part([add(q, rot([-w, 0], hA + jO)), add(q, rot([w, 0], hA + jO)), add(q, rot([1, -l], hA + jO))], { fill: '#d8d4c4', shade: 0.3, inkW: 1, cast: false, light: '#ffffff' }); } // the lower canine and incisors
  W.rimeCrust(f, HF(jR([[182, 70], [206, 74]])), 3, [1, -0.3]);
  for (let i = 0; i < 6; i++) W.icicle(f, HF(jR([[50 + i * 28, 104 + i * 1]]))[0], 18 + f.r() * 22, 5); // the frozen breath from the lower jaw
  f.bone('head');
  // the gape: dark, from the upper teeth line to the lower jaw's top, the tongue lying in it
  f.flat(HF([[-6, 40], [60, 48], [140, 52], [190, 40], [214, 22], ...jR([[208, 78], [150, 68], [60, 54], [0, 46]])]), '#1c0e10');
  f.flat(HF([[70, 54], [140, 56], ...jR([[170, 70], [110, 62]])]), '#4a3438', { op: 0.7 });
  // the upper head: skull, stop and muzzle, with the flews hanging from the sides of the muzzle over the jaw
  const skull = HF([[-64, -10], [-64, -62], [-46, -108], [0, -138], [60, -148], [106, -138], [134, -120], [142, -100], [148, -76], [156, -58], [186, -54], [218, -54], [234, -48], [240, -30], [238, -6], [230, 8], [220, 14], [210, 18], [200, 26], [196, 50], [196, 84], [186, 106], [160, 110], [134, 92], [110, 64], [70, 62], [20, 64], [-26, 50], [-54, 24]]);
  f.part(skull, FUR({ fill: '#868890', maxShade: 16 }));
  W.clipDraw(f, skull, () => {
    W.softTone(f, E.smooth(skull), [
      [HF([[-60, 0], [40, 10], [100, 50], [20, 66], [-40, 50]]), '#000', 0.42, 10], // the cheek turning under
      [HF([[0, -138], [110, -136], [146, -80], [60, -86], [0, -96]]), '#ffffff', 0.26, 10], [HF([[60, -50], [140, -44], [130, 0], [60, -10]]), '#000', 0.22, 10], // the broad lit forehead
      [HF([[152, -54], [230, -50], [230, -26], [160, -32]]), '#ffffff', 0.18, 8], // the lit top of the muzzle
      [HF([[130, 10], [196, 30], [190, 104], [140, 90]]), '#000', 0.34, 10]]); // the flews' hollow
    // the far brow bulging over the top contour: the skull's breadth
    f.flat(HF([[40, -146], [96, -148], [126, -132], [90, -136], [50, -138]]), '#dfe6ea', { op: 0.25 });
    // deep furrows across the broad forehead, and the median furrow up from the stop
    for (const [a, m, b] of [[[16, -126], [66, -138], [118, -124]], [[20, -110], [72, -120], [128, -108]], [[36, -94], [78, -102], [118, -94]]]) groove(HF([a, m, b]), 4, 0.72);
    groove(HF([[144, -84], [120, -112], [84, -138]]), 3.2, 0.6);
    groove(HF([[140, -108], [148, -80], [156, -58]]), 4.2, 0.75); // the stop's deep step
    for (const u of [126, 136]) groove(HF([[u, -118], [u + 4, -104]]), 2.4, 0.55); // short furrows between the brows // the stop's deep step
    // snarl wrinkles bunched on the top of the muzzle, the lip lifted off the canine
    for (const u of [164, 180, 196, 212]) groove(HF([[u, -54], [u + 4, -40], [u - 2, -24]]), 2.4, 0.55);
    groove(HF([[156, -14], [180, 10], [188, 50], [182, 96]]), 2.8, 0.6); // the fold where the flew hangs from the muzzle
    groove(HF([[100, 56], [130, 76], [160, 100]]), 2.6, 0.5); // the lip fold at the corner of the mouth
    groove(HF([[30, -40], [60, 0], [70, 40]]), 2.6, 0.45); // the masseter's front edge
    W.wrapHatch(f, HF([[-40, 20]])[0], HF([[140, 30]])[0], 50, 40, 1, 7, { w: 2, op: 0.28 });
    W.rimeCrust(f, HF([[-46, -108], [0, -138], [60, -148], [106, -138], [142, -100]]), 8, [1, -0.3]);
    W.hoar(f, HF([[216, -24]])[0], 26, 22, 0.7);
    for (const [u, v] of [[184, -12], [200, -2]]) { f.line(HF([[u, v], [u + 12, v + 8]]), 3, '#d8dee2', { op: 0.6 }); f.line(HF([[u, v], [u + 12, v + 8]]), 1, INK, { op: 0.6 }); } // old bite scars on the muzzle
  });
  // the lifted upper lip at the front: the dark gum and the bared canine under it, ice crusted on the teeth
  f.flat(HF([[198, 28], [210, 18], [230, 12], [232, 24], [214, 30]]), '#3a1e22');
  for (const [u, l, w] of [[206, 40, 7], [222, 13, 3.4], [230, 11, 3]]) { const q = HF([[u, u > 210 ? 18 : 24]])[0]; f.part([add(q, rot([-w, 0], hA)), add(q, rot([w, 0], hA)), add(q, rot([1, l], hA))], { fill: '#d8d4c4', shade: 0.3, inkW: 1, cast: false, light: '#ffffff' }); } // the upper canine and incisors
  W.rimeCrust(f, HF([[200, 28], [226, 22]]), 3, [1, -0.3]);
  // the nose leather: wide and square at the front of the muzzle, slit nostrils (no round holes)
  const nose = HF([[212, -60], [234, -56], [246, -38], [244, -12], [234, -2], [218, -8], [210, -32]]);
  f.part(nose, { fill: '#2a2a2e', light: '#6a6e76', shade: 0.3, inkW: 1.3, cast: false });
  f.line(HF([[242, -28], [234, -24], [228, -14]]), 2.2, '#000'); f.line(HF([[230, -4], [234, -34]]), 1, INK, { op: 0.5 });
  f.line(HF([[218, -54], [238, -50]]), 1.6, '#8a9098', { op: 0.6 });
  // the eye: small and dark, deep under the heavy brow
  f.stroke(HF([[90, -98], [120, -108], [148, -94]]), 15, '#34363a');
  W.animalEye(f, HF([[120, -84]])[0], 9, hA + 0.1, { frost: true });
  f.line(HF([[70, -62], [110, -60], [146, -50]]), 2, '#e4eaee', { op: 0.45 }); W.crease(f, HF([[74, -54], [112, -50], [146, -40]]), 3, { col: '#14161c', op: 0.45 }); // the cheekbone's arch under the eye
  // the heavy flews hanging, and the frozen breath in a jagged beard from them
  W.icicles(f, HF([[134, 92], [160, 110], [186, 106], [196, 84]]), 7, 14, 38);
  // the near rose ear: small, folded back and over, the burr showing at its front
  const ear = HF([[14, -112], [-14, -128], [-56, -126], [-90, -100], [-96, -66], [-72, -72], [-52, -92], [-22, -98]]);
  f.part(ear, FUR({ fill: '#6e7074', tex: undefined, k: 0.7, maxShade: 8 }));
  f.flat(HF([[10, -112], [-12, -122], [-32, -112], [-12, -100]]), '#2a2a30', { op: 0.75 }); // the burr
  f.line(HF([[-16, -122], [-48, -112], [-80, -88]]), 1.6, INK, { op: 0.6 }); // the fold
  W.rimeCrust(f, HF([[-14, -128], [-56, -126], [-90, -100]]), 4, [1, -0.3]); W.icicle(f, HF([[-94, -66]])[0], 10, 3);

  f.bone('root');
  for (const L of Object.values(LEG)) f.flat(ell(add(L.T, [10, 0]), 50, 5, 0, 12), P.iceS, { op: 0.4 });
  f.flat(ell([620, gy + 4], 340, 10, 0, 20), '#000', { op: 0.28 });
  return f;
}

// ------------------------------------------------------------------ THE PATRONESS'S MONKEY (cast, small 0.4)
// Her pet monkey, which slipped its collar on the last night and stole a scholar's astrolabe: crouched low on its hind
// legs, running away from the company with the brass disc hugged to its chest in both hands, the long tail curled up and
// over in a hook behind, the head turned back over the shoulder toward the party (drawn facing left, the head turned
// right; mirrored in game, so the body flees and the face looks back). Lightning came down through the brass: the
// astrolabe is fused into its hands and chest, burns branch from it over the belly and arms, and every hair stands out
// from the strike, frozen in a stiff halo. Frost on the windward back and tail, icicles from the elbows and chin, the
// eyes small and filmed with frost under the brow. Velvet collar in the Patroness's pale blue gone grey with a broken
// brass chain and a tiny bell; an embroidered jacket with one sleeve torn off; a sugared almond in its cheek; a ring on a
// toe; a bald patch on the tail. Rig: pelvis (root) > torso > head; arms; legs; tail_1..3; astrolabe (torso).
// Motion: idle is stillness, then a jerk to a new crouch; attack is a leap onto a hero's back and a bite.
function monkey() {
  const seed = 1127, [CW, CH] = T.small, f = new Fig(W.base(seed, CH));
  W.textures(f); const fur = W.furTex(f);
  const gy = f.o.groundY;
  const FUR = (o = {}) => Object.assign({ fill: '#7e7c78', shadow: '#2e2e32', light: '#c8ccce', shade: 0.4, tex: fur, texOp: 0.7, maxShade: 14 }, o);
  const SKM = (o = {}) => Object.assign({ fill: '#a8a29a', shadow: '#4a4650', light: '#d8d4cc', shade: 0.4, tex: 'mottle' + seed, texOp: 0.5, maxShade: 10 }, o);
  const JK = (o = {}) => Object.assign({ fill: '#6a7c8c', shadow: '#28323e', light: '#a8bccc', shade: 0.42, tex: 'weave' + seed, texOp: 0.5, maxShade: 14 }, o);
  const Pv = [354, 730], TS = [290, 610], HC = [314, 572];
  const SN = [292, 626], EN = [314, 680], WN = [254, 668];
  const SF = [276, 618], EF = [262, 654], WF = [232, 624];
  const HN = [350, 734], KN = [244, 680], AN = [312, 764];
  const HF = [362, 726], KF = [262, 666], AF = [334, 760];
  const AC = [236, 640]; // astrolabe centre, hugged to the chest, seen nearly edge-on toward us
  f.joint('pelvis', Pv).joint('torso', [330, 660], 'pelvis').joint('head', [306, 576], 'torso').joint('astrolabe', AC, 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n').joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('tail_1', [370, 726], 'pelvis').joint('tail_2', [456, 636], 'tail_1').joint('tail_3', [440, 538], 'tail_2');
  // a long monkey foot planted flat, toes forward (left), with a ring on the big toe
  const foot = (A, s, look, ring) => {
    const h = [A[0] + 10, gy], t = [A[0] - s, gy];
    f.part([add(A, [-8, -6]), add(A, [10, -4]), add(h, [6, -6]), add(h, [0, 0]), add(t, [6, 0]), add(t, [-4, -3]), add(t, [2, -9]), add(A, [-s * 0.5, gy - A[1] - 14])], look);
    for (let i = 0; i < 4; i++) f.line([add(t, [8 + i * 7, -2]), add(t, [10 + i * 7, -12])], 1, INK, { op: 0.6 });
    f.part([add(A, [-s * 0.3, -2]), add(A, [-s * 0.55, 8]), add(A, [-s * 0.62, 18]), add(A, [-s * 0.46, 16])], Object.assign({}, look, { cast: false, inkW: 1 })); // the opposed big toe
    if (ring) { f.part(ell(add(A, [-s * 0.54, 13]), 5, 3, 0.4, 10), W.BR(f, { fill: P.brassL, inkW: 1, cast: false })); }
    f.flat(ell(add(t, [14, -2]), 5, 3, 0, 6), P.rime, { op: 0.9 });
  };

  // ---- tail: up and over behind in a hook, rimed on the windward side, a bald patch
  const tl = W.spline([[370, 726], [420, 700], [456, 640], [460, 576], [438, 536], [408, 528], [390, 546], [396, 566]], 5);
  const segs = [[0, 0.36, 'tail_1'], [0.34, 0.68, 'tail_2'], [0.66, 1, 'tail_3']];
  for (const [a, b, bn] of segs) {
    f.bone(bn);
    const C = tl.slice(Math.floor(a * (tl.length - 1)), Math.floor(b * (tl.length - 1)) + 1);
    const tp = K.chain(C, C.map((_, i) => 20 - (a + (b - a) * i / (C.length - 1)) * 10));
    f.part(tp, FUR());
    W.bristleRidge(f, C, 12, { out: 1, col: '#6e6c68', w: 5, rime: true });
    W.bristleRidge(f, C, 9, { out: -1, col: '#8a8884', w: 4, rime: false });
    if (bn === 'tail_2') { const q = C[Math.floor(C.length * 0.4)]; f.flat(ell(q, 9, 7, 0.8, 10), '#9a948c'); f.line(ell(q, 9, 7, 0.8, 10).slice(3, 9), 1, INK, { op: 0.6 }); } // the bald patch where it was gripped
    W.rimeCrust(f, C.filter((_, i) => i % 2 === 0).map(q => add(q, [6, -4])), 5, [1, -0.3]);
  }
  W.icicles(f, tl.slice(4, 12), 3, 6, 12);

  // ---- far leg and far arm (behind)
  const cutAt = (A0, J, B0, r) => { const d = E.norm(sub(B0, A0)); return [W.side(J, mul(d, -1), r), W.side(J, d, r)]; }; // split a limb drawn in one outline at its middle joint, for the rig
  { const [c1, c2] = cutAt(HF, KF, AF, 18); W.split(f, () => f.part(W.jointLimb(HF, KF, AF, [46, 30, 18], { point: 0.3 }), FUR({ fill: '#66645f' })), [['thigh_f', c1], ['shin_f', c2]]); }
  f.bone('thigh_f');
  W.bristleRidge(f, [HF, KF], 8, { out: -1, col: '#5e5c58', w: 4, rime: false });
  f.bone('foot_f'); foot(AF, 46, SKM({ fill: '#8a847c' }), false);
  { const [c1, c2] = cutAt(SF, EF, WF, 12); W.split(f, () => f.part(W.jointLimb(SF, EF, WF, [26, 20, 14], { point: 0.3 }), JK({ fill: '#5a6a78' })), [['upperarm_f', c1], ['forearm_f', c2]]); } // its sleeve still on
  f.bone('hand_f');
  W.openHand(f, WF, ang(EF, WF) + 0.6, 34, { look: SKM({ fill: '#958f86' }), curl: 0.6, spread: 0.05, back: true });

  // ---- body: thin, hunched over the disc; the jacket over it; the fur standing out in a frozen halo
  f.bone('torso');
  const body = [[380, 736], [380, 692], [364, 648], [336, 614], [300, 600], [268, 610], [252, 636], [256, 672], [284, 708], [322, 736], [358, 748]];
  W.bristleRidge(f, body.slice(0, 7), 24, { out: 1, col: '#6e6c68', w: 8 }); W.bristleRidge(f, body.slice(6).concat([body[0]]), 16, { out: 1, col: '#7a7874', w: 6, rime: false });
  f.part(body, FUR());
  const jk = [[368, 700], [366, 664], [350, 632], [326, 612], [296, 604], [272, 614], [260, 638], [264, 668], [288, 696], [330, 712]];
  f.part(jk, JK());
  W.clipDraw(f, jk, () => {
    for (let i = 0; i < 6; i++) { const q = [276 + i * 14, 640 + (i % 2) * 18]; f.line([add(q, [-5, 0]), add(q, [0, -6]), add(q, [5, 0]), add(q, [0, 6]), add(q, [-5, 0])], 1.2, P.brassL, { op: 0.8 }); } // embroidered lozenges
    f.stitches([[350, 690], [348, 650], [336, 620], [314, 600]], P.brassL, 0.9);
    W.hoar(f, [340, 620], 30, 40, 0.8);
    W.lichtenberg(f, [262, 650], deg(-20), 70, 1.6, { depth: 2, col: '#2a3036' });
    f.flat(ell([300, 676], 10, 6, 0, 8), '#14161a', { op: 0.6 }); // a burn hole
  });
  W.rimeCrust(f, [[358, 690], [358, 650], [346, 618], [320, 594]], 7, [1, -0.3]);
  // the velvet collar with a broken brass chain and a tiny bell
  f.part(K.chain([[268, 594], [292, 580], [316, 584]], [14, 14, 14]), JK({ fill: '#8a9aa8', cast: false }));
  W.chainLinks(f, [[300, 588], [326, 600], [348, 596]], 6, P.brassL);
  f.part(ell([276, 606], 7, 7, 0, 10), W.BR(f, { fill: P.brassL, inkW: 1, cast: false })); f.line([[272, 609], [280, 609]], 1, INK); W.icicle(f, [276, 612], 8, 2.6);

  // ---- the astrolabe, fused into its chest: the mater and its rim, the pierced star rete, the alidade, the throne ring
  f.bone('astrolabe');
  const AS = 46, Ak = 0.62, Aa = deg(-12), at = (u, v) => add(AC, rot([u * AS * Ak, v * AS], Aa));
  const rim = []; for (let i = 0; i < 36; i++) rim.push(at(Math.cos(i / 36 * 6.283), Math.sin(i / 36 * 6.283)));
  f.part(rim.map(q => add(q, [-6, 2])), W.BRD(f, { cast: false })); // the rim's thickness
  W.bplate(f, rim, W.BRD(f, {}), { hard: false, bev: 3 }); // tarnished, frost-dulled brass: never a gold disc
  W.clipDraw(f, rim, () => {
    // engraved almucantars as open arcs, and the rete: pierced curling star-pointers on a bar, never a closed ring at the centre
    for (const r of [0.55, 0.78]) { const arc = []; for (let i = 0; i < 14; i++) { const t = 3.6 + i * 0.16; arc.push(at(Math.cos(t) * r, Math.sin(t) * r + 0.1)); } f.line(arc, 1, INK, { op: 0.55 }); }
    for (const [t, r, c] of [[0.6, 0.7, 1], [2.0, 0.6, -1], [3.4, 0.74, 1], [4.6, 0.5, -1], [5.5, 0.68, 1]]) { const p0 = at(Math.cos(t) * r * 0.4, Math.sin(t) * r * 0.4), p1 = at(Math.cos(t) * r, Math.sin(t) * r), p2 = at(Math.cos(t + c * 0.3) * r * 0.86, Math.sin(t + c * 0.3) * r * 0.86); f.line([p0, p1, p2], 2.4, P.brassD); f.flat(ell(p1, 2.2, 2.2, 0, 6), P.brassP); }
    f.line([at(-0.9, 0.3), at(0.9, -0.3)], 5, P.brassD); f.line([at(-0.9, 0.3), at(0.9, -0.3)], 2, mix(P.brassL, '#3a3a40', 0.35)); // the alidade across
    f.part(hard([at(-0.12, -0.16), at(0.12, -0.12), at(0.12, 0.16), at(-0.12, 0.12)]), W.BRD(f, { inkW: 1, cast: false })); // the wedge pin, square, off the dark
    W.lichtenberg(f, at(0.2, 0.4), deg(80), 30, 1.4, { metal: true, depth: 2 });
    W.hoar(f, at(0.4, -0.5), 18, 14, 0.7);
  });
  f.part(ell(at(0, -1.12), 8, 8, Aa, 10), W.BRD(f, { inkW: 1, cast: false })); f.flat(ell(at(0, -1.16), 3, 4, Aa, 8), '#2a2418', { op: 0.7 }); // the throne and its shackle (off to one side, small)
  W.icicles(f, rim.slice(6, 14), 3, 6, 12);

  // ---- near leg: folded under, the long foot flat, a ring on its toe
  { const [c1, c2] = cutAt(HN, KN, AN, 20); W.split(f, () => f.part(W.jointLimb(HN, KN, AN, [50, 32, 20], { point: 0.3 }), FUR()), [['thigh_n', c1], ['shin_n', c2]]); }
  f.bone('thigh_n');
  W.bristleRidge(f, [HN, KN], 9, { out: -1, col: '#6e6c68', w: 4, rime: false });
  W.bristleRidge(f, [KN, AN], 7, { out: 1, col: '#6e6c68', w: 4 });
  f.bone('foot_n'); foot(AN, 48, SKM(), true);

  // ---- head turned back over the shoulder: small, wrinkled, old-looking; lips drawn back from small teeth
  f.bone('head');
  const hF = frame(HC, -0.08, 1);
  // a monkey's head (rebuilt in the independent review): a round cranium, the bare heart-shaped face turned three-quarter
  // back toward the party, flat, with a heavy brow ridge, two small frosted eyes set close, a flat nose with slit
  // nostrils, a short muzzle with the lips drawn back off small teeth, a human-like ear, the almond in its cheek
  const cran = hF([[-24, -8], [-22, -30], [-8, -42], [10, -45], [28, -38], [38, -24], [41, -6], [41, 12], [35, 28], [21, 38], [4, 38], [-10, 30], [-22, 14]]);
  W.bristleRidge(f, hF([[-12, 30], [-24, 10], [-26, -12], [-20, -32], [-6, -42], [12, -44], [28, -36]]), 18, { out: -1, col: '#6e6c68', w: 6 });
  f.part(cran, FUR({ maxShade: 10 }));
  W.clipDraw(f, cran, () => { for (let i = 0; i < 14; i++) { const q = hF([[-18 + (i % 5) * 8, -34 + Math.floor(i / 5) * 14]])[0]; f.line([q, add(q, [-6, 4])], 1, i % 2 ? INK : '#d8dcdc', { op: 0.5 }); } W.hoar(f, hF([[-12, -30]])[0], 18, 12, 0.8); });
  const face = hF([[6, -24], [20, -30], [34, -27], [44, -14], [47, 2], [46, 16], [40, 28], [30, 34], [18, 32], [10, 22], [5, 6], [3, -10]]);
  f.part(face, SKM({ k: 0.85, maxShade: 6 }));
  W.clipDraw(f, face, () => {
    W.softTone(f, E.smooth(face), [[hF([[4, 0], [14, 4], [16, 30], [6, 24]]), '#3a3640', 0.4, 4], [hF([[18, -26], [40, -22], [42, -12], [20, -14]]), '#ffffff', 0.25, 4]]); // the near cheek turning away; the lit brow
    for (const [a, b] of [[[12, -2], [18, 4]], [[30, -2], [36, 2]], [[14, 8], [20, 12]], [[22, -24], [32, -24]], [[24, -20], [34, -19]]]) f.line(hF([a, b]), 1, INK, { op: 0.55 }); // wrinkles round the eyes and across the brow
    f.flat(hF(ell([15, 18], 7, 6, 0, 8)), '#c8c2b8', { op: 0.55 }); f.line(hF([[9, 22], [15, 25], [21, 22]]), 1, INK, { op: 0.5 }); // the almond bulging in its cheek
    W.hoar(f, hF([[42, 20]])[0], 10, 8, 0.8);
  });
  f.stroke(hF([[8, -14], [20, -19], [30, -17], [42, -15]]), 5, '#3e3c3a'); // the brow ridge, one heavy bar over both eyes
  for (const [u, rx] of [[19, 3.2], [35, 2.4]]) { f.flat(hF(ell([u, -8], rx, 2, 0, 8)), '#141418'); f.flat(hF(ell([u, -8.6], rx * 0.7, 1, 0, 6)), '#c8d4dc', { op: 0.55 }); } // small eyes, set close, filmed with frost
  f.line(hF([[27, -6], [28, 2]]), 1.2, INK, { op: 0.5 }); // the flat bridge of the nose
  for (const u of [26, 32]) f.line(hF([[u, 4], [u + 1.5, 6.5]]), 1.6, '#141418'); // slit nostrils
  f.flat(hF([[18, 16], [30, 13], [44, 15], [40, 22], [26, 24]]), '#1c1416'); // the lips drawn back
  for (let i = 0; i < 4; i++) f.part(hard(hF([[24 + i * 4.5, 15.5], [27.5 + i * 4.5, 15], [26.5 + i * 4.5, 18.5]])), { fill: '#d8d4c4', shade: 0.3, inkW: 0.6, cast: false });
  f.line(hF([[18, 16], [30, 12], [44, 14]]), 1.2, INK, { op: 0.7 }); // the upper lip's edge, lifted
  for (const q of hF([[38, 24], [30, 26], [22, 25]])) W.icicle(f, q, 6 + f.r() * 5, 2.2);
  for (const [a, b] of [[[44, 8], [60, 4]], [[44, 10], [60, 14]], [[42, 12], [56, 20]]]) f.line(hF([a, b]), 0.9, P.rime, { op: 0.9 }); // frost in the whiskers
  const ear = hF([[-4, -14], [-12, -20], [-17, -10], [-14, 2], [-6, 4], [-2, -4]]);
  f.part(ear, SKM({ fill: '#9a948a', cast: false, inkW: 1.2 })); f.line(hF([[-8, -14], [-12, -8], [-9, -1]]), 1, INK, { op: 0.6 });
  W.rimeCrust(f, hF([[-12, -20], [-17, -10], [-14, 2]]), 3, [1, -0.3]);

  // ---- near arm: sleeve torn off, the bare furred arm wrapped round the disc, fingers fused to the rim
  { const [c1, c2] = cutAt(SN, EN, WN, 12); W.split(f, () => f.part(W.jointLimb(SN, EN, WN, [26, 20, 14], { point: 0.3 }), FUR()), [['upperarm_n', c1], ['forearm_n', c2]]); }
  f.bone('upperarm_n');
  f.part([add(SN, [-10, -10]), add(SN, [14, -12]), add(SN, [16, 10]), add(SN, [4, 18, 1]), add(SN, [-2, 8]), add(SN, [-10, 16, 1])], JK({ cast: false })); // the torn sleeve stump
  W.bristleRidge(f, [EN, lerp(EN, WN, 0.6)], 8, { out: 1, col: '#6e6c68', w: 4 });
  f.bone('forearm_n'); W.icicles(f, [add(EN, [-6, 10]), add(EN, [8, 10])], 2, 8, 14);
  W.clipDraw(f, W.jointLimb(SN, EN, WN, [26, 20, 14]), () => W.lichtenberg(f, lerp(EN, WN, 0.8), deg(10), 40, 1.4, { depth: 2 }));
  f.bone('hand_n');
  W.openHand(f, WN, ang(EN, WN) - 0.5, 34, { look: SKM(), curl: 0.7, spread: 0.06, back: true, flip: true });
  W.weld(f, [add(WN, [-14, -10]), add(WN, [-18, 4])], 3, { lich: false });

  f.bone('root');
  f.flat(ell([300, gy + 3], 90, 7, 0, 16), '#000', { op: 0.28 });
  return f;
}

// painted digits (a sign-writer's numerals) along a frame: n is a string of digits, c centre-left, h height, up (unit)
function digits(f, c, n, h, col, o = {}) {
  const S7 = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgcde', 7: 'abc', 8: 'abcdefg', 9: 'abcfgd' };
  const seg = { a: [[0, 0], [1, 0]], b: [[1, 0], [1, 0.5]], c: [[1, 0.5], [1, 1]], d: [[0, 1], [1, 1]], e: [[0, 0.5], [0, 1]], f: [[0, 0], [0, 0.5]], g: [[0, 0.5], [1, 0.5]] };
  const a = o.ang || 0, w = h * 0.5;
  // o.mirror: the figure is flipped for the game, so write the numerals mirrored to read true after the flip
  const m = o.mirror !== false, N = n.length;
  [...n].forEach((ch, i) => { const k = m ? N - 1 - i : i; for (const sg of S7[ch] || '') { const [p0, p1] = seg[sg]; const q = [p0, p1].map(([u, v]) => add(c, rot([k * w * 1.5 + (m ? 1 - u : u) * w * (1 - v * 0.15), v * h], a))); f.line(q, o.w || 2, col, { op: o.op ?? 0.85 }); } });
}

// ------------------------------------------------------------------ THE COLLEGE TORTOISE (cast, small 0.3)
// The college's two-hundred-year-old tortoise, frozen mid-step a century ago walking toward the party: a high-domed land
// tortoise on three planted feet, the near forefoot raised, the long wrinkled neck stretched out ahead. Scutes ridged
// with growth rings; rime crusts the windward side of the dome thick enough to facet it, icicles hang from the rim and
// the raised foot, the eyes filmed with frost. Lightning came down through the brass plate the college riveted to its
// shell: the plate is fused into the scutes, burns branch from it over the dome and the seams between the scutes are
// scorched black. The masters' years painted in a column down the shell (the oldest flaked away), a chalked wager
// number half rubbed out, a hole drilled through the rear rim with a frozen tether cord, a lettuce leaf frozen in the
// beak, a chip out of the front rim, scaly forelegs with blunt claws and ice balled between them, a scrap of star chart
// frozen to the underside. Rig: shell (root) > neck > head; legs leg_fn/ff/hn/hf (each _1 thigh, _2 foot); tail.
// Motion: idle is nothing for a long time, then the raised foot coming down and another rising; attack is a slow bite.
function collegeTortoise() {
  const seed = 1125, [CW, CH] = T.small, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY;
  const X0 = 140, L = 300, rimY = 734;
  const rimP = u => [X0 + L * u, rimY - 8 * Math.sin(Math.PI * u) + (u > 0.85 ? (u - 0.85) * 40 : 0)];
  const midP = u => [X0 + 14 + (L - 30) * u, rimY - 14 - 146 * Math.pow(Math.max(0, Math.sin(Math.PI * (0.04 + 0.92 * u))), 0.62)];
  const at = (u, v) => { const r = rimP(u), m = midP(u), k = Math.sin(v * Math.PI / 2); return [lerp(r, m, v)[0], r[1] + (m[1] - r[1]) * k]; };
  const SH = (o = {}) => Object.assign({ fill: '#6e624c', shadow: '#2a241a', light: '#a89a7a', shade: 0.4, tex: 'craze' + seed, texOp: 0.45, maxShade: 18 }, o);
  const SC = (o = {}) => Object.assign({ fill: '#8a8a84', shadow: '#363840', light: '#c8ccce', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6, maxShade: 12 }, o);
  const NK = [430, 722], HC = [530, 694], hA = 0.06, hF = frame(HC, hA, 1);
  const LEG = { hf: { H: [196, 716], T: [206, gy] }, ff: { H: [392, 716], T: [418, gy] }, hn: { H: [178, 728], T: [176, gy] }, fn: { H: [376, 728], T: [468, 742] } }; // the near forefoot raised, the leg bent at the wrist
  const KN2 = (k, Lg) => k === 'fn' ? add(Lg.H, [26, 34]) : lerp(Lg.H, Lg.T, 0.7); // the wrist (low and bent on the lifted leg)
  f.joint('shell', [290, 690]).joint('neck', NK, 'shell').joint('head', add(HC, [-20, 4]), 'neck').joint('tail', [140, 732], 'shell');
  for (const [k, Lg] of Object.entries(LEG)) f.joint(`leg_${k}_1`, Lg.H, 'shell').joint(`leg_${k}_2`, KN2(k, Lg), `leg_${k}_1`);
  // an elephantine scaly leg with a blunt-clawed foot; lifted: the foot hangs off the ground with icicles
  const leg = (k, far) => {
    const Lg = LEG[k], front = k[1] === 'f', lift = k === 'fn';
    const look = SC(far ? { fill: '#6e6e6a' } : {}), K2 = KN2(k, Lg);
    f.bone(`leg_${k}_1`);
    const th = K.chain([Lg.H, lerp(Lg.H, K2, 0.6), K2], [70, 60, 50], { bp: [[0, 0.5, 0.12, 0.2]] });
    f.part(th, look);
    W.clipDraw(f, th, () => { for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const q = add(lerp(Lg.H, K2, 0.1 + r * 0.16), [-24 + c * 16 + (r % 2) * 8, 0]); f.line([add(q, [-7, 2]), add(q, [0, -4]), add(q, [7, 2])], 1.2, INK, { op: 0.6 }); f.line([add(q, [-5, 0]), add(q, [0, -3])], 1, '#e0e4e4', { op: 0.4 }); } }); // overlapping scales
    f.bone(`leg_${k}_2`);
    const ft = lift ? Lg.T : [Lg.T[0], gy];
    const pad = K.chain([lerp(Lg.H, K2, 0.7), K2, add(ft, [front ? 10 : -4, -12])], [56, 50, 46]);
    f.part(pad, look);
    W.clipDraw(f, pad, () => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const q = add(lerp(K2, ft, 0.05 + r * 0.24), [-22 + c * 14 + (r % 2) * 7, 0]); f.line([add(q, [-6, 2]), add(q, [0, -4]), add(q, [6, 2])], 1.2, INK, { op: 0.6 }); } W.hoar(f, add(K2, [16, 0]), 16, 24, 0.6); });
    for (let i = 0; i < 4; i++) { const c = add(ft, [-18 + i * 13 + (front ? 6 : 0), lift ? 0 : -6]); f.part([add(c, [-5, -4]), add(c, [6, -6]), add(c, [9, 4]), add(c, [0, 8]), add(c, [-6, 4])], { fill: '#3a3632', light: '#8a8478', shade: 0.3, inkW: 1, cast: false }); if (!lift) f.flat(ell(add(c, [-7, 4]), 4, 3, 0, 6), P.rime, { op: 0.9 }); }
    if (lift) { W.icicles(f, [add(ft, [-24, 8]), add(ft, [26, 6])], 4, 8, 20); W.icicle(f, add(K2, [-20, 20]), 12, 4); }
  };

  // ---- far legs and tail (behind the shell)
  leg('hf', true); leg('ff', true);
  f.bone('tail');
  f.part([[150, 724], [120, 736], [104, 752], [118, 750], [146, 742]], SC());
  W.icicle(f, [112, 750], 10, 3);
  // ---- the neck stretched out ahead, wrinkled, with frost in its folds
  f.bone('neck');
  const nk = [[396, 708], [440, 690], [490, 680], [522, 682], [526, 718], [490, 726], [450, 732], [404, 742]];
  f.part(nk, SC({ k: 0.9 }));
  W.clipDraw(f, nk, () => { for (let i = 0; i < 7; i++) W.crease(f, [[420 + i * 14, 688 - i], [424 + i * 14, 710], [418 + i * 14, 734]], 2, { col: '#22242a' }); W.hoar(f, [470, 686], 40, 10, 0.7); });
  W.icicles(f, [[450, 732], [490, 726]], 3, 6, 14);
  // ---- the head: small, beaked, ancient, the mouth a little open on a lettuce leaf
  f.bone('head');
  const hd = hF([[-22, -8], [-14, -22], [4, -28], [24, -24], [40, -14], [50, 0], [50, 12], [40, 20], [20, 22], [0, 20], [-18, 12]]);
  f.part(hd, SC({ fill: '#8e8e86' }));
  W.clipDraw(f, hd, () => { for (const [a, b] of [[[-10, -16], [10, -22]], [[0, 4], [14, 10]], [[-14, 2], [-4, 12]], [[-16, -4], [-6, -10]], [[6, 12], [20, 16]]]) f.line(hF([a, b]), 1, INK, { op: 0.6 }); for (let i = 0; i < 4; i++) { const q = hF([[-12 + i * 9, -20 + (i % 2) * 3]])[0]; f.line([add(q, [-4, 2]), add(q, [0, -2]), add(q, [4, 2])], 1, INK, { op: 0.5 }); } W.hoar(f, hF([[10, -18]])[0], 14, 8, 0.6); });
  f.part(hF([[34, -10], [50, -2], [56, 8], [48, 14], [40, 8]]), { fill: '#3a3632', light: '#8a8478', shade: 0.3, inkW: 1.1, cast: false }); // the horny beak
  f.flat(hF([[24, 10], [48, 12], [44, 18], [26, 18]]), '#1a1416');
  const leaf = hF([[36, 14], [58, 8], [74, 16], [70, 30], [52, 30], [40, 22]]);
  f.part(leaf, { fill: '#7a9a78', shadow: '#2a3a2a', light: '#c8dcc4', shade: 0.4, inkW: 1, cast: false, tex: 'rime' + seed, texOp: 0.5 });
  f.line(hF([[40, 16], [56, 18], [70, 22]]), 1, '#2a3a2a', { op: 0.7 }); W.icicle(f, hF([[60, 30]])[0], 9, 3);
  f.flat(hF(ell([22, -6], 4, 3, 0, 8)), '#141418'); f.flat(hF(ell([22, -6.5], 3, 2, 0, 6)), '#c8d6de', { op: 0.6 }); // the small eye, frosted
  f.line(hF([[16, -12], [24, -14], [30, -10]]), 1.6, INK, { op: 0.7 }); f.flat(hF([[16, -12], [24, -14], [30, -10], [24, -10]]), P.rime, { op: 0.7 }); // frost on the lid
  W.rimeCrust(f, hF([[-10, -24], [10, -28], [30, -22], [44, -10]]), 4, [1, -0.3]);

  // ---- the shell: marginal rim with depth, costal and vertebral scutes with growth rings, the bridge to the plastron
  f.bone('shell');
  const plast = [rimP(0.04), rimP(0.96), add(rimP(0.92), [0, 18]), add(rimP(0.1), [0, 18])];
  f.part(plast, SH({ fill: '#8a7e60' })); // the plastron's edge under the rim
  f.part([add(rimP(0.42), [-30, 10]), add(rimP(0.6), [0, 8]), add(rimP(0.6), [4, 22]), add(rimP(0.42), [-26, 24])], { fill: '#d8d0bc', shadow: '#6a6250', shade: 0.35, inkW: 1, cast: false, tex: 'rime' + seed, texOp: 0.4 }); // the scrap of star chart frozen underneath
  f.flat(ell(add(rimP(0.5), [-6, 16]), 2, 2, 0, 6), '#2a2a30'); f.line([add(rimP(0.47), [-8, 14]), add(rimP(0.53), [-2, 18])], 0.9, '#2a2a30', { op: 0.6 });
  const outline = []; for (let i = 0; i <= 24; i++) outline.push(at(i / 24, 0)); for (let i = 24; i >= 0; i--) outline.push(at(i / 24, 1.0));
  const dome = []; for (let i = 0; i <= 24; i++) dome.push(add(rimP(i / 24), [0, 10])); for (let i = 24; i >= 0; i--) dome.push(midP(i / 24));
  // the far half of the dome shows above the midline: a shallow band beyond the vertebral ridge
  const far = []; for (let i = 0; i <= 24; i++) far.push(midP(i / 24)); for (let i = 24; i >= 0; i--) { const m = midP(i / 24); far.push(add(m, [8, -12 * Math.sin(Math.PI * i / 24)])); }
  f.part(far, SH({ fill: '#5a5040', cast: false }));
  const dD = f.part(dome, SH());
  W.clipDraw(f, dome, () => {
    // scutes (rebuilt in the independent review): a row of small marginals round the rim, four broad costals on the flank
    // and the vertebrals along the top set half a scute off them, meeting the costals on a zigzag seam, as on a real
    // tortoise; never a square grid. Each scute has polygonal growth rings round a raised, worn areola.
    const uC = [0.0, 0.17, 0.4, 0.62, 0.84, 1.0], uV = [0.0, 0.07, 0.285, 0.51, 0.73, 0.93, 1.0];
    const zz = [...uC.map(u => [u, 0.6]), ...uV.slice(1, -1).map(u => [u, 0.74])].sort((p, q) => p[0] - q[0]);
    const vb = u => { for (let i = 0; i < zz.length - 1; i++) if (u >= zz[i][0] && u <= zz[i + 1][0]) return lerp(zz[i], zz[i + 1], (u - zz[i][0]) / Math.max(1e-6, zz[i + 1][0] - zz[i][0]))[1]; return 0.6; };
    const edge = (u0, u1, vf, n = 8) => Array.from({ length: n + 1 }, (_, i) => { const u = u0 + (u1 - u0) * i / n; return at(u, typeof vf === 'function' ? vf(u) : vf); });
    const scute = (poly, shade) => {
      const c = poly.reduce((s0, p) => add(s0, mul(p, 1 / poly.length)), [0, 0]);
      f.flat(poly, shade, { op: 0.6 });
      for (const k of [0.78, 0.56, 0.36]) f.line(poly.map(p => lerp(c, p, k)).concat([lerp(c, poly[0], k)]), 1, INK, { op: 0.42 }); // growth rings
      f.flat(poly.map(p => lerp(c, p, 0.2)), '#8a7c5c', { op: 0.7 }); // the raised areola, worn pale
    };
    const nM = 11; for (let m = 0; m < nM; m++) { const q = [at(m / nM, 0), at((m + 1) / nM, 0), at((m + 1) / nM, 0.2), at(m / nM, 0.2)]; f.flat(q, m % 2 ? '#6a5e48' : '#5e5240', { op: 0.5 }); f.line(q.concat([q[0]]), 2, '#14100c', { op: 0.85 }); f.line([lerp(q[0], q[3], 0.5), lerp(q[1], q[2], 0.5)], 1, INK, { op: 0.35 }); } // marginals
    for (let i = 0; i < uC.length - 1; i++) scute([...edge(uC[i], uC[i + 1], 0.2), ...edge(uC[i + 1], uC[i], vb)], i % 2 ? '#7a6c52' : '#6a5e48'); // costals
    for (let j = 0; j < uV.length - 1; j++) scute([...edge(uV[j], uV[j + 1], vb), ...edge(uV[j + 1], uV[j], 1.0)], j % 2 ? '#6a5e48' : '#7a6c52'); // vertebrals
    // seams scorched black: the costal-vertebral zigzag, the costal and vertebral divisions, the marginal line
    f.stroke(edge(0, 1, vb, 40), 5, '#0e0c0a', { op: 0.85 }); f.stroke(edge(0, 1, 0.2, 20), 5, '#0e0c0a', { op: 0.85 });
    for (const u of uC) f.stroke([at(u, 0.2), at(u, vb(u))], 5, '#0e0c0a', { op: 0.85 });
    for (const u of uV.slice(1, -1)) f.stroke([at(u, vb(u)), at(u, 1.0)], 5, '#0e0c0a', { op: 0.85 });
    // the masters' years, painted in a column down the flank, the oldest flaked away
    const yrs = ['1688', '1702', '1719', '1731', '1748', '1760', '1777'];
    yrs.forEach((y, i) => { const p0 = at(0.36, 0.95 - i * 0.12); if (i > 4) { f.flat(hard([add(p0, [-2, -2]), add(p0, [30, -2]), add(p0, [30, 8]), add(p0, [-2, 8])]), '#5a4e3a', { op: 0.6 }); digits(f, p0, y.slice(0, 2), 9, '#d8d0bc', { w: 1.6, op: 0.4 }); } else digits(f, p0, y, 9, '#d8d0bc', { w: 1.6 }); });
    // the chalked wager number, half rubbed out
    digits(f, at(0.62, 0.78), '7', 22, '#eef2f2', { w: 3, op: 0.7 }); f.flat(ell(add(at(0.62, 0.78), [10, 16]), 14, 8, 0.4, 10), '#eef2f2', { op: 0.25 });
    // rime: the windward front of the dome faceted under a thick crust
    W.hoar(f, at(0.86, 0.7), 60, 50, 0.9); W.facets(f, at(0.82, 0.62), 40, 40, 9, { s: 1, op: 0.35 });
    W.lichtenberg(f, at(0.3, 0.6), deg(-20), 80, 2.2, { metal: true, depth: 2 });
    W.lichtenberg(f, at(0.3, 0.52), deg(50), 60, 1.8, { metal: true, depth: 2 });
  });
  W.bevel(f, dD, E.bbox(dome), 4, { lite: '#e8dcc0', liteOp: 0.2 });
  // the brass plate with the college arms, riveted and fused into the scutes
  const bp = [at(0.14, 0.42), at(0.3, 0.44), at(0.3, 0.7), at(0.14, 0.66)];
  W.bplate(f, bp, W.BR(f, {}), { bev: 3, scorch: [[at(0.22, 0.56), 30, 20, 0.4]] });
  const bc = lerp(at(0.22, 0.5), at(0.22, 0.62), 0.5);
  f.line([add(bc, [-14, 8]), add(bc, [-10, -2]), add(bc, [0, -8]), add(bc, [10, -2]), add(bc, [14, 8]), add(bc, [-14, 8])], 1.4, P.brassD); // the dome of the arms
  for (let i = 0; i < 5; i++) f.line([add(bc, [0, -16]), add(add(bc, [0, -16]), rot([7, 0], -Math.PI / 2 + i * 1.257))], 1.4, P.brassD);
  for (const q of bp) W.fusedBead(f, lerp(q, bc, 0.12), 3);
  W.weld(f, [at(0.3, 0.46), at(0.31, 0.58), at(0.3, 0.68)], 3, { lich: false });
  // the rim: chip out of the front, hole drilled through the rear with a frozen tether cord
  W.rimeCrust(f, [midP(0.5), midP(0.7), midP(0.86), at(0.96, 0.5), at(1.0, 0.1)], 12, [1, -0.3]);
  const ch = at(0.95, 0.08); f.flat(hard([add(ch, [-10, -4]), add(ch, [4, -12]), add(ch, [12, 2]), add(ch, [0, 6])]), '#c8b896'); f.line([add(ch, [-10, -4]), add(ch, [4, -12]), add(ch, [12, 2])], 1.4, INK, { op: 0.8 });
  const hl = at(0.03, 0.08); f.flat(ell(hl, 4, 5, 0, 8), '#0a0806');
  W.rope(f, [hl, add(hl, [-10, 14]), add(hl, [-16, 40]), add(hl, [-12, 60])], 2.4, { col: '#6a5c48' }); W.icicle(f, add(hl, [-12, 60]), 12, 3);
  W.icicles(f, Array.from({ length: 12 }, (_, i) => rimP(0.04 + i * 0.08)).map(q => add(q, [0, 10])), 14, 8, 22);
  // ---- near legs, in front of the shell
  leg('hn', false); leg('fn', false);
  f.bone('root');
  for (const k of ['hn', 'hf', 'ff']) f.flat(ell(add(LEG[k].T, [0, 0]), 34, 4, 0, 10), P.iceS, { op: 0.4 });
  f.flat(ell([300, gy + 3], 190, 7, 0, 18), '#000', { op: 0.28 });
  return f;
}

// rime grown so thick on a windward edge that it reads like bark: vertical ridged plates along a polyline, each a long
// pale shard with an inked groove beside it and wind feathers on its edge. pts: the edge; w: crust depth; out: +1/-1 side
function rimeBark(f, pts, w, out = 1) {
  // a deep rime crust, then bark-like ridges: broken grooves running along it and short cross-checks, never a row of tiles
  W.rimeCrust(f, pts, w * 1.3, [1, -0.2], { feather: 1.4 });
  const C = W.spline(pts, 4), Sx = W.arcLen(C), Tl = Sx[Sx.length - 1];
  for (const off of [-0.2, 0.15]) { let u = f.r() * 10; while (u < Tl - 8) { const l = 14 + f.r() * 40, a = W.at(C, Sx, u), b = W.at(C, Sx, Math.min(Tl, u + l)); f.line([add(a.p, mul(a.n, out * w * off)), add(b.p, mul(b.n, out * w * (off + (f.r() - 0.5) * 0.2)))], 1.2, P.iceS, { op: 0.55 }); u += l + 4 + f.r() * 14; } }
  for (let u = 8; u < Tl - 8; u += 18 + f.r() * 22) { const a = W.at(C, Sx, u); f.line([add(a.p, mul(a.n, -out * w * 0.4)), add(a.p, mul(a.n, out * w * 0.45))], 1, P.iceS, { op: 0.45 }); }
}

// ------------------------------------------------------------------ THE RODWARDEN (elite 2.0)
// The keeper of the spire's lightning rods, frozen at the instant the last strike went through him: tall and rawboned,
// bent forward under an oak back-frame of a dozen spare iron rods fanned upward above his head, each with a scorched
// brass point; the iron grounding pole planted ahead like a crutch, the near arm locked straight on it, the hand fused
// to its brass grip. Weight split between the rear foot and the pole. Rime so thick on his windward side it reads like
// bark; under it every inch of bare skin is covered in aurora-green Lichtenberg scars, old faded ones under new raw ones.
// Waxed canvas storm coat, a leather climbing harness with an iron hook at the chest, a sheet of lead flashing tucked in
// it, a coil of braided iron cable over the shoulder with its end trailing, wool mittens with the palms burned through,
// roofer's boots with iron cleats, a hammer and a bag of staples at the belt, an iron chain wrapped round one ankle and
// dragging, a leather strap clenched in his teeth. A long hollow face, the scalp scarred bare in patches, the hair left
// standing in frozen spikes, each hung with a small icicle. Two fingers of the far hand are cauterised stumps.
// Rig: humanoid + pole (hand_n), frame (torso), rods (frame), cable (torso), skirt (pelvis), chain (foot_n).
// Motion: idle is a twitch through the whole body; attack plants the pole and the strike comes down the rods.
function rodwarden() {
  const seed = 1123, CW = 1300, CH = 1500, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 184;
  const N = [782, 560], C = [650, 620], Pv = [560, 870];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.12, 0.12), SF = S.at(0.3, 0.1);
  const WN = [1150, 836], EN = lerp(SN, WN, 0.52);
  const EF = [800, 820], WF = [850, 990];
  const HN = S.at(-0.2, 1.0), KN = [470, 1166], AN = [376, 1404];
  const HF = S.at(0.26, 0.98), KF = [712, 1140], AF = [716, 1404];
  const HC = [884, 468], hA = 0.32;
  const pole0 = [1140, gy - 4], pole1 = [1168, 470], pA = ang(pole0, pole1);
  const COAT = (o = {}) => Object.assign({ fill: '#6a6a5c', shadow: '#26261f', light: '#9a9a88', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6 }, o);
  const SKN = (o = {}) => W.SKI(f, Object.assign({ fill: '#b4bcc2', shadow: '#525870' }, o));
  const MIT = (o = {}) => W.WOOL(f, Object.assign({ fill: '#5e5850', shadow: '#24201c' }, o));
  const OAK = (o = {}) => Object.assign({ fill: '#5a4a36', shadow: '#241c14', light: '#8a765a', shade: 0.42, tex: 'wood' + seed, texOp: 0.55 }, o);
  const scars = (c, rx, ry, n, s = 1) => { for (let i = 0; i < n; i++) { const p = W.scatter(f, c, rx, ry); W.lichtenberg(f, p, f.r() * 6.3, R(30, 70) * s, 1.6 * s, { depth: 2, col: i % 2 ? '#3a4a46' : '#2a3a3a', op: i % 2 ? 0.45 : 0.85 }); } };
  function R(a, b) { return a + (b - a) * f.r(); }
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.15, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const FC = S.at(-0.7, 0.2); // the back-frame's head, where the rods are seated
  f.joint('pole', WN, 'hand_n').joint('frame', S.at(-0.6, 0.4), 'torso').joint('rods', FC, 'frame').joint('cable', S.at(0.1, 0.1), 'torso').joint('skirt', S.at(0, 0.84), 'pelvis').joint('chain', AN, 'foot_n');

  // ---- the rods, fanned up above his head from the frame (behind everything)
  f.bone('rods');
  const rods = [];
  for (let i = 0; i < 12; i++) { const a = deg(-146 + i * 8.0 + (i % 3) * 1.6), l = 470 + (i % 4) * 34 - Math.abs(i - 6) * 8; rods.push([add(FC, rot([20, 0], a)), add(FC, rot([l, 0], a)), a]); }
  rods.forEach(([a, b, an], i) => {
    f.part(limb(a, b, 11, 9, { steps: 6, capK: 0.3 }), W.IR(f, { fill: i % 2 ? P.ironL : P.iron, inkW: 1.2, cast: i === 0 }));
    const tip = add(b, rot([34, 0], an));
    f.part(hard([add(b, rot([0, -7], an)), tip, add(b, rot([0, 7], an))]), W.BR(f, { fill: mix(P.brass, P.scorch, 0.35), inkW: 1.1, cast: false })); // scorched brass point
    f.flat(ell(lerp(b, tip, 0.6), 6, 3, an, 8), P.scorch, { op: 0.6 });
    if (i % 4 === 0) W.lichtenberg(f, lerp(a, b, 0.85), an + Math.PI, 40, 1.2, { metal: true, depth: 1 });
    if (i % 2 === 0) W.rimeCrust(f, [lerp(a, b, 0.4), lerp(a, b, 0.95)], 5, [1, -0.3]);
    if (i % 2 === 1) W.icicle(f, lerp(a, b, 0.7), 14 + (i % 4) * 4, 4);
  });
  for (const t of [0.35, 0.62]) { const pts = rods.map(([a, b]) => lerp(a, b, t)); f.line(pts, 4, INK); f.line(pts, 2.2, '#7a6a52'); } // twine lashings binding the fan

  // ---- far leg forward, roofer's boot with iron cleats
  f.bone('thigh_f');
  W.legTube(f, HF, KF, lerp(KF, AF, 0.92), [130, 96, 72], COAT({ fill: '#3e3e38', tex: 'weave' + seed }), '_f', { A: AF, bq: [[1, 0.3, 0.14, 0.18]] });
  f.bone('foot_f');
  W.bootRig(f, KF, AF, 110, '#3a322a', '_f', { knee: add(KF, [4, 60]), kneeW: 88, tex: 'mottle' + seed });
  for (let i = 0; i < 4; i++) f.part(hard([[AF[0] - 30 + i * 40, gy - 6], [AF[0] - 18 + i * 40, gy - 6], [AF[0] - 22 + i * 40, gy + 2]]), W.IR(f, { inkW: 1, cast: false })); // cleats
  // ---- far arm hanging forward, the mitten's palm burned through, two fingers burned off to stumps
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [74, 64, 52], COAT({ fill: '#4a4a40' }), '_f');
  f.bone('hand_f');
  W.openHand(f, WF, ang(EF, WF) + 0.2, 92, { look: SKN({ fill: '#9aa2aa' }), curl: 0.35, spread: 0.12, cut: [0, 0, 0.35, 0.2], tips: '#2a2a2e', back: true });
  f.part(K.chain([lp(EF, WF, 0.8), lp(EF, WF, 1.06)], [56, 58]), MIT({ cast: false }));
  scars(add(WF, [10, 40]), 20, 20, 2, 0.7);

  // ---- near leg back, straight, carrying the weight; the chain wrapped round the ankle and dragging
  f.bone('thigh_n');
  W.legTube(f, HN, KN, lerp(KN, AN, 0.92), [136, 100, 76], COAT({ fill: '#46463e', tex: 'weave' + seed }), '_n', { A: AN, bp: [[1, 0.3, 0.14, 0.18]] });
  f.bone('foot_n');
  W.bootRig(f, KN, AN, 112, '#40362e', '_n', { knee: add(KN, [0, 64]), kneeW: 92, tex: 'mottle' + seed, strap: true });
  for (let i = 0; i < 4; i++) f.part(hard([[AN[0] - 30 + i * 40, gy - 6], [AN[0] - 18 + i * 40, gy - 6], [AN[0] - 22 + i * 40, gy + 2]]), W.IR(f, { inkW: 1, cast: false }));
  f.bone('chain');
  for (let i = 0; i < 3; i++) W.chainLinks(f, [add(AN, [-44, -60 + i * 22]), add(AN, [44, -66 + i * 22])], 16, P.ironL);
  W.chainLinks(f, [add(AN, [-40, -14]), add(AN, [-110, 30]), [200, gy - 8], [120, gy - 6]], 18, P.ironL);
  f.bone('shin_n'); rimeBark(f, [lp(KN, AN, -0.05, -50), lp(KN, AN, 0.18, -52)], 14, -1); // rime on the shin's front above the boot top (the boot's own front is crusted with the boot)

  // ---- the back-frame: two oak uprights down the back, a crossbar, the rods' seat
  f.bone('frame');
  for (const [u0, u1] of [[-0.62, -0.7], [-0.86, -0.94]]) f.part(limb(S.at(u0, -0.1), S.at(u1, 0.9), 34, 30, { steps: 6, capK: 0.3 }), OAK());
  f.part(limb(S.at(-0.5, 0.36), S.at(-1.08, 0.44), 30, 30, { steps: 3, capK: 0.3 }), OAK({ cast: false }));
  const seat = [add(FC, [-40, -20]), add(FC, [40, -30]), add(FC, [46, 20]), add(FC, [-36, 30])];
  f.part(seat, OAK({ fill: '#4a3c2a' })); for (const q of seat) f.rivet(lerp(q, FC, 0.25), 3.6, P.steelL);
  W.rimeCrust(f, [S.at(-0.62, -0.1), S.at(-0.66, 0.4), S.at(-0.7, 0.9)], 7, [1, -0.3]);

  // ---- body: the storm coat, waxed canvas, bark-thick rime on the windward front
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.34], [0.06, 0.62, 0.5], [0.22, 0.66, 0.6], [0.45, 0.58, 0.56], [0.7, 0.52, 0.5], [0.9, 0.58, 0.52], [1.04, 0.62, 0.56]]);
  f.part(torso, COAT());
  W.clipDraw(f, torso, () => { for (const g of [[S.at(0.1, 0.1), S.at(0.0, 0.5), S.at(0.1, 0.9)], [S.at(-0.3, 0.2), S.at(-0.36, 0.7)]]) W.fold(f, g, 2.4); f.flat(ell(S.at(-0.2, 0.6), 40, 20, 0.6, 10), '#2a2a24', { op: 0.3 }); W.hoar(f, S.at(0.4, 0.3), 50, 80, 0.6); });
  f.bone('skirt');
  const sk = [S.at(-0.62, 0.82), S.at(0.58, 0.8), add(S.at(0.62, 1.0), [30, 30]), [800, 1110], [770, 1130, 1], [730, 1112], [690, 1136, 1], [640, 1112], [600, 1130, 1], [560, 1104], [500, 1120, 1], [470, 1080], add(S.at(-0.7, 1.0), [-20, 30])];
  f.part(sk, COAT({ fill: '#56564a' }));
  W.clipDraw(f, sk, () => { for (const g of [[[620, 920], [640, 1110]], [[700, 920], [730, 1110]], [[540, 940], [530, 1100]]]) W.fold(f, g, 2.4); f.flat([[440, 1060], [840, 1060], [840, 1140], [440, 1140]], P.mud, { op: 0.32 }); for (let i = 0; i < 5; i++) f.line([[480 + i * 60, 1000], [486 + i * 60, 1080]], 1.4, '#b8b8a8', { op: 0.3 }); }); // waxed sheen
  rimeBark(f, [add(S.at(0.62, 1.0), [30, 30]), [800, 1110]], 14, 1);
  W.icicles(f, [[800, 1110], [770, 1130], [730, 1112], [690, 1136], [640, 1112], [600, 1130], [560, 1104], [500, 1120]], 9, 12, 36);
  // belt: hammer, a bag of iron staples
  f.bone('pelvis');
  f.part([S.at(-0.68, 0.78), S.at(0.6, 0.76), S.at(0.62, 0.86), S.at(-0.7, 0.88)], W.LEA(f, { sharp: true }));
  const hm = S.at(-0.2, 0.84);
  f.part(limb(hm, add(hm, [-20, 130]), 14, 14, { steps: 4 }), OAK()); f.part(hard([add(hm, [-40, 130]), add(hm, [24, 124]), add(hm, [26, 150]), add(hm, [-38, 156])]), W.IR(f, {}));
  const bg = S.at(-0.6, 0.9);
  f.part([add(bg, [-30, 0]), add(bg, [30, -4]), add(bg, [40, 50]), add(bg, [24, 80]), add(bg, [-24, 82]), add(bg, [-40, 50])], W.LEA(f, { fill: '#4e4034' }));
  for (let i = 0; i < 3; i++) f.line([add(bg, [-14 + i * 10, -4]), add(bg, [-16 + i * 10, -18]), add(bg, [-8 + i * 10, -20]), add(bg, [-8 + i * 10, -6])], 2, P.ironL); // staples poking out
  W.icicles(f, [add(bg, [-24, 82]), add(bg, [24, 80])], 3, 10, 22);
  // the climbing harness: shoulder straps, a chest ring with an iron hook, lead flashing tucked in
  f.bone('torso');
  for (const [a, b] of [[S.at(-0.2, -0.08), S.at(0.4, 0.5)], [S.at(0.3, -0.06), S.at(0.5, 0.5)]]) f.part(W.ribbon([a, b], 22), W.LEA(f, { fill: '#3e342c' }));
  f.part(W.ribbon([S.at(-0.6, 0.6), S.at(0.6, 0.58)], 24), W.LEA(f, { fill: '#3e342c' }));
  const hk = S.at(0.48, 0.5);
  f.line(ell(hk, 16, 16, 0, 12).concat([ell(hk, 16, 16, 0, 12)[0]]), 7, INK); f.line(ell(hk, 16, 16, 0, 12).concat([ell(hk, 16, 16, 0, 12)[0]]), 4.4, P.ironL);
  f.line([add(hk, [0, 16]), add(hk, [8, 60]), add(hk, [30, 70]), add(hk, [36, 52])], 9, INK); f.line([add(hk, [0, 16]), add(hk, [8, 60]), add(hk, [30, 70]), add(hk, [36, 52])], 5.4, P.ironL);
  const fl = [S.at(0.06, 0.4), S.at(0.3, 0.36), S.at(0.34, 0.72), S.at(0.1, 0.76)];
  f.part(hard(fl), { fill: '#8a8e94', shadow: '#3a3c44', light: '#c8ccd0', shade: 0.4, inkW: 1.3, tex: 'pit' + seed, texOp: 0.6 }); // lead flashing
  W.clipDraw(f, fl, () => { f.line([S.at(0.1, 0.5), S.at(0.3, 0.48)], 1.2, INK, { op: 0.5 }); W.dent(f, S.at(0.2, 0.62), 10); });
  rimeBark(f, [S.at(0.3, -0.04), S.at(0.6, 0.2), S.at(0.62, 0.5), S.at(0.56, 0.8)], 30, 1); W.clipDraw(f, torso, () => W.hoar(f, S.at(0.5, 0.4), 40, 110, 0.9));

  // ---- the coil of braided iron cable over the near shoulder, its end trailing
  f.bone('cable');
  const cc = S.at(-0.1, 0.1);
  for (let k = 0; k < 4; k++) { const e = ell(add(cc, [k * 6 - 10, k * 4]), 86, 58, -0.5, 26); f.line(e.concat([e[0]]), 9, INK); f.line(e.concat([e[0]]), 6, k % 2 ? '#5e6066' : '#6e7076'); for (let i = 0; i < 26; i += 2) f.line([lerp(e[i], e[(i + 1) % 26], 0.3), lerp(e[i], e[(i + 1) % 26], 0.7)], 1, '#c8ccd0', { op: 0.5 }); }
  W.chainLinks(f, [add(cc, [70, 40]), add(cc, [90, 140]), add(cc, [70, 260])], 10, '#6e7076');
  W.lichtenberg(f, add(cc, [40, -30]), deg(-60), 50, 1.6, { metal: true, depth: 2 });
  W.rimeCrust(f, ell(add(cc, [6, 0]), 86, 58, -0.5, 26).slice(14, 24), 6, [1, -0.3]);

  // ---- neck and head: long and hollow, scalp scarred bare, frozen spikes of hair with icicles; a strap in his teeth
  f.bone('head');
  const nk = [S.at(-0.2, -0.02), S.at(0.34, 0.02), add(HC, rot([0.1 * H, 0.42 * H], hA)), add(HC, rot([-0.24 * H, 0.26 * H], hA))];
  f.part(nk, SKN());
  W.clipDraw(f, nk, () => scars(S.at(0.1, -0.06), 30, 20, 3));
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: '#b4bcc2', jaw: 1.02, chin: 0.03, nose: 1.15, hook: 0.3, mouth: 'set', squint: 0.65, browDown: 0.12, browW: 0.03, age: true, gaunt: true, faceShade: 0.8, jawShade: 0.45,
    eyeWhite: '#d8e2e8', iris: '#2a3038', hairCol: '#5a5852', browCol: '#cfd8dc',
  });
  W.clipDraw(f, hF([[-0.3, -0.4], [-0.08, -0.52], [0.18, -0.47], [0.36, -0.13], [0.33, 0.3], [0.13, 0.54], [-0.22, 0.3], [-0.37, -0.13]]), () => { scars(hF([[0.05, 0.1]])[0], 50, 50, 5); W.hoar(f, hF([[0.26, 0.1]])[0], 26, 40, 0.7); });
  // scalp scarred bare in patches; the hair left stands straight up in frozen spikes, each with a small icicle
  const sc = hF([[-0.34, -0.14], [-0.3, -0.38], [-0.12, -0.5], [0.1, -0.5], [0.26, -0.38], [0.3, -0.22]]);
  for (const q of hF([[-0.2, -0.36], [0.1, -0.42]])) f.flat(ell(q, 16, 9, hA, 10), '#d0d6da', { op: 0.6 });
  W.bristleRidge(f, sc.slice(0, 3), 70, { up: [-0.3, -1], col: '#4e4c48', w: 16, icicle: 0.7 });
  W.bristleRidge(f, sc.slice(3), 58, { up: [0.1, -1], col: '#5a5852', w: 14, icicle: 0.7 });
  W.icicles(f, hF([[0.3, 0.5], [0.12, 0.54]]), 3, 10, 22);
  // the leather strap clenched between the teeth, looped back to the harness
  const mt = hF([[0.26, 0.28]])[0];
  f.part(W.ribbon(W.spline([add(mt, [-20, -4]), add(mt, [24, 4]), add(mt, [10, 60]), S.at(0.4, 0.0)], 4), 14), W.LEA(f, { fill: '#4a3e34' }));
  f.flat(hF([[0.16, 0.26], [0.3, 0.24], [0.32, 0.31], [0.18, 0.32]]), '#d8d4c4', { op: 0.8 }); f.line(hF([[0.18, 0.28], [0.31, 0.27]]), 1, INK, { op: 0.6 }); // bared teeth on the strap
  rimeBark(f, hF([[0.24, -0.44], [0.32, -0.32], [0.355, -0.18]]), 8, 1); W.rimeCrust(f, hF([[0.31, 0.3], [0.32, 0.38], [0.29, 0.47]]), 5, [1, -0.2]); // brow and jaw only: never across the nose

  // ---- the grounding pole, planted ahead: iron with a forked foot, the brass grip where the hand is fused on
  f.bone('pole');
  f.part(limb(pole0, pole1, 26, 22, { steps: 8, capK: 0.3 }), W.IR(f, { fill: P.ironL }));
  f.line([lp(pole0, pole1, 0.02, 6), lp(pole0, pole1, 0.98, 5)], 2, '#9aa0a8', { op: 0.5 });
  for (const sx of [-1, 1]) f.part([add(pole0, [-4, -60]), add(pole0, [4, -60]), add(pole0, [sx * 40, 0]), add(pole0, [sx * 30, 0])], W.IR(f, { cast: false })); // the forked foot
  f.part(limb(lerp(pole0, pole1, 0.6), lerp(pole0, pole1, 0.76), 40, 40, { steps: 3, capK: 0.2 }), W.BR(f, { inkW: 1.4 })); // brass grip
  f.part(hard([add(pole1, [-10, 0]), add(pole1, [10, 0]), add(pole1, [4, -40]), add(pole1, [-4, -40])]), W.BR(f, { fill: mix(P.brass, P.scorch, 0.3), inkW: 1.2, cast: false }));
  W.lichtenberg(f, lerp(pole0, pole1, 0.4), deg(90), 140, 2.4, { metal: true, depth: 3 });
  rimeBark(f, [lp(pole0, pole1, 0.1, 13), lp(pole0, pole1, 0.9, 11)], 10, -1);
  W.icicles(f, [lp(pole0, pole1, 0.6, -20), lp(pole0, pole1, 0.6, 20)], 3, 12, 30);

  // ---- near arm locked straight on the pole, the mittened hand fused to the brass grip
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [106, 70, 56], COAT({ fill: '#6e6e62' }), '_n', { bp: [[0, 0.35, 0.18, 0.2], [1, 0.25, 0.14, 0.18]], bq: [[0, 0.6, 0.1, 0.2], [1, 0.1, 0.12, 0.12]] });
  f.bone('upperarm_n'); for (const t of [0.3, 0.55, 0.8]) W.fold(f, [lp(SN, EN, t, -30), lp(SN, EN, t + 0.06, 0), lp(SN, EN, t + 0.02, 30)], 2); W.clipDraw(f, K.chain([SN, EN], [92, 72]), () => W.stains(f, E.smooth(K.chain([SN, EN], [92, 72])), [700, 520, 1000, 780], '#26261f', 0.03, 3, -1.5, 3, 0.5));
  f.bone('forearm_n');
  for (const t of [0.15, 0.4, 0.62]) W.fold(f, [lp(EN, WN, t, -28), lp(EN, WN, t + 0.05, 0), lp(EN, WN, t + 0.01, 28)], 1.8);
  W.creases(f, EN, ang(SN, WN) + 1.57, 50, 3, INK, 0.6);
  rimeBark(f, [lp(SN, EN, 0.2, -40), lp(EN, WN, 0.1, -34), lp(EN, WN, 0.85, -30)], 12, -1);
  W.icicles(f, [lp(SN, EN, 0.9, 38), lp(EN, WN, 0.4, 34)], 4, 12, 30);
  f.part(K.chain([lp(EN, WN, 0.8), lp(EN, WN, 1.0)], [62, 60]), MIT({ cast: false }));
  { const c0 = lp(EN, WN, 0.7), c1 = lp(EN, WN, 0.8); const cf = K.chain([c0, c1], [72, 74]); f.part(cf, COAT({ fill: '#5e5e54', cast: false })); W.clipDraw(f, cf, () => { W.fold(f, [lp(EN, WN, 0.72, -34), lp(EN, WN, 0.76, 0), lp(EN, WN, 0.72, 34)], 1.6); W.hoar(f, lp(EN, WN, 0.75, -20), 16, 20, 0.7); }); } // the coat sleeve's turned cuff over the mitten
  { const el = lp(SN, WN, 0.52, 30); f.flat(ell(el, 16, 10, ang(SN, WN), 10), '#14161a', { op: 0.35 }); W.crease(f, [lp(SN, WN, 0.46, 36), lp(SN, WN, 0.52, 40), lp(SN, WN, 0.58, 36)], 3, { col: '#14161c', op: 0.6 }); } // the locked elbow's point pushing the sleeve
  f.bone('hand_n');
  const gn = B.grip(f, WN, EN, pA, 46, MIT().fill, { shadow: MIT().shadow, tex: 'weave' + seed, texOp: 0.5, name: 'rodwarden pole' });
  W.fistDetail(f, gn, 46 * 1.18, MIT().fill, { wrinkle: false });
  f.flat(ell(gn.F([[0.1, 0.2]])[0], 14, 9, gn.ang, 10), '#2a2420', { op: 0.8 }); // the palm burned through
  f.part(ell(gn.F([[0.2, 0.25]])[0], 9, 6, gn.ang, 8), SKN({ cast: false, inkW: 1 }));
  W.weld(f, [gn.F([[0.4, -0.6]])[0], gn.F([[0.5, 0.0]])[0], gn.F([[0.4, 0.6]])[0]], 5, { lich: false });
  W.icicle(f, gn.F([[0.6, 0.6]])[0], 20, 5);

  f.bone('root');
  f.flat(ell([700, gy + 4], 420, 16, 0, 20), '#000', { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ THE GIN OX (elite 1.9 at the hump)
// The draught ox that walked the dome round for forty years in the undercroft, still walking: long, low and heavy, the
// head carried low, leaning into its yoke with the near foreleg lifted mid-stride, the weight forward in the shoulders.
// Rebuilt in the independent review so it reads as an ox and never a horse or donkey:
//   - a long, low, rounded barrel (body 1.2 times its height at the hump), the belly deep and slung low between short,
//     thick legs; the top line broken by the hump over the withers, the dip behind it, the spine's knobs, the jutting
//     hook bones and the raised tail head;
//   - the legs emerge from the body at the elbow and the stifle (the upper arm and thigh are inside the hide, as on
//     cattle); thick cannons, knee and hock, short pasterns, cloven hooves shod in iron;
//   - a short, heavy neck carried forward and down from the hump, a great dewlap hanging in folds from the throat to
//     between the forelegs;
//   - a short, deep, wedge-shaped head: a broad flat forehead (seen as a lit plane, with the curled poll tuft), a broad,
//     deep, square muzzle with a wide wet muffle and comma nostrils, a deep cheek; heavy horns rising above the poll from
//     ringed bases and curving out and forward; the ears set out sideways under the horns; a small dark eye under the brow.
// Frost: the hide stiff, rime bark-thick on the windward front, the coat frozen in faceted plates, icicles from the
// dewlap, belly, muzzle and switch. Lightning came down the gin's iron shaft into the yoke: burns branch from the neck
// over the shoulders, the hair along the spine stands in a frozen ridge, the far horn is scorched black to the base.
// Gear: oak neck-yoke and iron bow, bolted to a broken length of the sweep beam jutting out from the near shoulder toward
// us and down to the floor (its stub stands up past the hump, its splintered end drags between the legs); brass tally
// plates along the beam; brass caps on the horn tips (the far one missing); a head collar with brass rosettes; a sacking
// blanket frozen stiff over the loins, tented by the hook bone and held by a girth rope round the barrel; a tug-chain;
// a halter rope gnawed through; a cow bell with its clapper frozen to one side; an old whip scar; ice in the cleats.
// Rig: spine_1 (hips, root) > spine_2 > neck > head; tail; legs leg_[f|h][n|f]_1..3 (upper, lower, pastern and hoof);
// yoke (neck) > beam; blanket (spine_1); bell (neck).
// Motion: idle is a slow trudge in place, turning a little left; attack is a head-down shove swinging the beam.
function ginOx() {
  const seed = 1122, CW = 2300, CH = 1400, f = new Fig(W.base(seed, CH));
  W.textures(f); const fur = W.furTex(f);
  const gy = f.o.groundY;
  const hideC = '#6a6a66';
  const HIDE = (o = {}) => Object.assign({ fill: hideC, shadow: '#2a2c32', light: '#c4c8ca', shade: 0.4, tex: fur, texOp: 0.6, maxShade: 36 }, o);
  const OAK = (o = {}) => Object.assign({ fill: '#5e4c36', shadow: '#241c14', light: '#8e7a5c', shade: 0.42, tex: 'wood' + seed, texOp: 0.6 }, o);
  const groove = (pts, w = 3, op = 0.55) => W.crease(f, pts, w, { col: '#14161c', op });
  const ridge = (pts, w = 1.6, op = 0.45) => f.line(pts, w, '#e8eef0', { op });
  // ---- legs: centre line from inside the body (hidden) to the hoof; half-widths L (back, -x) and R (front, +x).
  // kI: knee (fore) or hock (hind); fI: fetlock. The upper arm and thigh are inside the body outline.
  const WF = [[96, 96], [92, 80], [76, 62], [58, 50], [42, 38], [46, 44], [40, 38]];
  const WH = [[112, 112], [104, 90], [84, 60], [62, 40], [42, 38], [46, 44], [40, 38]];
  const LEG = {
    hf: { C: [[790, 700], [776, 810], [730, 930], [690, 1040], [698, 1170], [708, 1290], [722, 1324]], W: WH, T: [740, gy] },
    ff: { C: [[1560, 770], [1550, 900], [1532, 1000], [1514, 1090], [1508, 1200], [1512, 1290], [1524, 1322]], W: WF, T: [1542, gy] },
    hn: { C: [[650, 690], [624, 800], [566, 920], [506, 1040], [512, 1170], [520, 1290], [534, 1324]], W: WH, T: [550, gy] },
    fn: { C: [[1650, 770], [1660, 900], [1708, 990], [1756, 1066], [1738, 1160], [1722, 1222], [1734, 1258]], W: WF, T: [1752, 1294], tilt: 0.5 },
  };
  for (const L of Object.values(LEG)) { L.kI = 3; L.fI = 5; }
  const POLL = [1890, 472], hA = deg(60), HF = frame(POLL, hA, 1);
  const YN = [1706, 300], DRAG = [1170, gy - 14], bd = E.norm(sub(DRAG, YN)), STUB = add(YN, mul(bd, -190));
  f.joint('spine_1', [660, 520]).joint('spine_2', [1100, 520], 'spine_1').joint('neck', [1660, 420], 'spine_2').joint('head', [1880, 520], 'neck').joint('tail', [362, 300], 'spine_1');
  f.joint('yoke', [1700, 290], 'neck').joint('beam', YN, 'yoke').joint('blanket', [760, 300], 'spine_1').joint('bell', [1840, 800], 'neck');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.C[1], par).joint(`leg_${k}_2`, L.C[L.kI], `leg_${k}_1`).joint(`leg_${k}_3`, L.C[L.fI], `leg_${k}_2`); }

  // one leg: one outline split at the knee (hock) and the fetlock; anatomy grooves, wrapping hatch, rime on the front
  const leg = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', C = L.C, K0 = C[L.kI], F0 = C[L.fI];
    const look = HIDE(far ? { fill: mix(hideC, '#000', 0.3), shadow: '#1a1c22' } : {});
    const wl = L.W.map(w => w[0]), wr = L.W.map(w => w[1]);
    const out = W.legOutline(C, wl, wr);
    const cutK = lerp(C[L.kI - 1], K0, 0.65), cutF = F0, dK = E.norm(sub(C[L.kI + 1], C[L.kI - 1])), dF = E.norm(sub(C[L.fI + 1], C[L.fI - 1]));
    W.split(f, () => {
      f.part(out, Object.assign({ k: 0.9 }, look));
      W.clipDraw(f, out, () => {
        for (let s0 = 1; s0 < C.length - 1; s0++) W.wrapHatch(f, C[s0], C[s0 + 1], (wl[s0] + wr[s0]) * 0.5, (wl[s0 + 1] + wr[s0 + 1]) * 0.5, -1, 3, { w: 2.2, op: 0.3, bow: 0.18 });
        if (front) { groove([lp(C[1], C[2], 0.0, -36), lp(C[1], C[2], 0.8, -24), lp(C[2], K0, 0.8, -14)], 2.6); groove([lp(C[1], C[2], 0.1, 50), lp(C[1], C[2], 0.7, 36)], 2.6, 0.5); } // the forearm's muscle edges
        else { groove([lp(C[1], C[2], 0.0, 70), lp(C[2], K0, 0.6, 34)], 2.8); groove([lp(C[1], C[2], 0.2, -50), lp(C[2], K0, 0.7, -24)], 2.4, 0.45); } // the gaskin, the Achilles tendon to the hock
        f.line([lp(K0, F0, 0.1, 12), lp(K0, F0, 0.9, 12)], 1.6, '#e0e4e2', { op: 0.4 }); f.line([lp(K0, F0, 0.1, 18), lp(K0, F0, 0.9, 18)], 1.2, INK, { op: 0.45 }); // the flexor tendon down the cannon
        f.flat(ell(K0, 30, 24, 0, 12), '#0e1014', { op: 0.18 }); f.flat(ell(add(K0, [front ? 12 : -14, -8]), 14, 11, 0, 8), '#e0e6ea', { op: 0.3 }); // the knee / hock knuckle
        f.flat(ell(F0, 26, 20, 0, 10), '#0e1014', { op: 0.2 });
        if (!far) W.hoar(f, lp(C[2], K0, 0.5, -30), 30, 70, 0.6);
        if (!far) W.furPlates(f, out, lerp(C[1], C[2], 0.5), 40, 50, 5, { dir: 1.5, s: 0.9, op: 0.7 });
      });
      if (!front) f.part([add(K0, [-wl[L.kI] + 6, -20]), add(K0, [-wl[L.kI] - 20, 2]), add(K0, [-wl[L.kI] + 6, 22])], Object.assign({}, look, { inkW: 1.2, cast: false })); // the point of the hock
      f.part(ell(add(F0, [-wl[L.fI] - 2, 12]), 10, 8, 0.4, 8), Object.assign({}, look, { fill: '#2a2a2e', inkW: 1.1, cast: false })); // dewclaws
      f.part(ell(add(F0, [-wl[L.fI] + 8, 20]), 9, 7, 0.4, 8), Object.assign({}, look, { fill: '#222226', inkW: 1.1, cast: false }));
      if (!far) rimeBark(f, [lp(C[1], C[2], 0.3, -wr[1] - 2), lp(C[2], K0, 0.5, -wr[2] - 2), lp(K0, F0, 0.4, -wr[4] - 2)], 7, -1);
      W.clovenHoof(f, L.T, 112, Object.assign({}, look, { fill: far ? '#26242a' : '#34302e', light: '#6e6a66', tex: 'mottle' + seed, texOp: 0.5, maxShade: 14 }), { tilt: L.tilt || 0 });
      if (L.tilt) W.icicles(f, [add(L.T, [-30, -14]), add(L.T, [30, 14])], 3, 12, 26);
    }, [[`leg_${k}_1`, W.side(cutK, mul(dK, -1), 34)], [`leg_${k}_2`, [W.side(cutK, dK, 34), W.side(cutF, mul(dF, -1), 28)]], [`leg_${k}_3`, W.side(cutF, dF, 28)]]);
  };

  // ---- the far legs, then the near legs: all emerge from under the body, which is drawn over their tops
  leg('hf', true); leg('ff', true); leg('hn', false); leg('fn', false);

  // ---- the far horn and the far ear (to the right of the forehead in this three-quarter view), behind the skull
  f.bone('head');
  const hornP = (pts, w0) => { const C2 = W.spline(pts, 6); return { C2, out: W.ribbon(C2, t => w0 * (1 - t * 0.82)) }; };
  const hfar = hornP([[1962, 470], [2016, 432], [2052, 376], [2062, 312], [2044, 254], [2012, 222]], 62);
  f.part(hfar.out, { fill: '#1e1c1c', shadow: '#0a0a0c', light: '#5a5652', shade: 0.42, tex: 'craze' + seed, texOp: 0.5 });
  W.clipDraw(f, hfar.out, () => { for (let i = 1; i < 12; i += 2) { const C2 = hfar.C2, d = E.norm(sub(C2[i + 1], C2[i - 1])), n2 = [-d[1], d[0]]; f.line([add(C2[i], mul(n2, -32)), add(C2[i], mul(n2, 32))], i < 6 ? 1.8 : 1.2, '#5a5652', { op: 0.5 }); } f.line(hfar.C2.slice(4).map(q => add(q, [-6, -2])), 2, '#6a6660', { op: 0.5 }); W.lichtenberg(f, hfar.C2[5], deg(-80), 80, 1.6, { metal: true, depth: 1 }); });
  { const tip = hfar.C2[hfar.C2.length - 1]; for (let i = 0; i < 4; i++) f.line([tip, add(tip, rot([10, 0], 2.2 + i * 0.5))], 1.4, '#0a0a0c', { op: 0.8 }); } // the far tip, its brass cap gone, scorched and frayed
  W.rimeCrust(f, hfar.C2.slice(3).filter((_, i) => i % 2 === 0), 5, [1, -0.3]);
  const earF = [[1984, 484], [2040, 474], [2098, 482], [2126, 504], [2096, 520], [2036, 520], [1992, 510]];
  f.part(earF, HIDE({ fill: mix(hideC, '#000', 0.2), k: 0.7, cast: false, maxShade: 8 }));
  f.flat([[2010, 492], [2060, 486], [2100, 500], [2060, 508], [2014, 504]], '#2e2e32', { op: 0.6 });
  W.rimeCrust(f, [[2040, 474], [2098, 482], [2126, 504]], 4, [1, -0.3]); W.icicle(f, [2110, 516], 14, 4);
  // ---- the neck: short and heavy, carried forward and down from the hump to the poll (under the body's shoulder edge)
  f.bone('neck');
  const neck = [[1520, 170], [1620, 196], [1730, 270], [1810, 370], [1848, 452], [1860, 540], [1850, 640], [1836, 730], [1790, 800], [1720, 720], [1640, 560], [1560, 380]];
  f.part(neck, HIDE());
  W.clipDraw(f, neck, () => {
    W.softTone(f, E.smooth(neck), [[[[1760, 600], [1900, 640], [1960, 760], [1800, 800]], '#000', 0.45, 24], [[[1620, 200], [1760, 260], [1880, 400], [1760, 380]], '#ffffff', 0.2, 22]]);
    for (let i = 0; i < 4; i++) groove([[1780 + i * 40, 380 + i * 50], [1800 + i * 36, 500 + i * 44], [1790 + i * 30, 620 + i * 36]], 4, 0.45); // the heavy folds of the neck's hide
    W.furPlates(f, neck, [1880, 600], 70, 120, 12, { dir: 1.2, s: 1.3 }); W.hoar(f, [1940, 600], 50, 120, 0.8);
    W.lichtenberg(f, [1720, 300], deg(70), 260, 3.2, { depth: 3 });
  });
  W.bristleRidge(f, [[1560, 176], [1640, 200], [1730, 266], [1820, 360]], 40, { up: [0.25, -1], col: '#4e5056', w: 12, taper: true, icicle: 0.3 });

  // ---- the body: a long, low, rounded barrel; the hump, the dip behind it, the spine's knobs, the hook bone and the
  // raised tail head break the top line; the shoulder and the thigh are modelled inside it, the legs hang below it
  const body = [[352, 318], [372, 286], [430, 272], [512, 262], [580, 238], [612, 236], [654, 262], [740, 278], [820, 284], [900, 292], [980, 296], [1060, 290], [1140, 276], [1220, 250], [1300, 210], [1390, 168], [1470, 146], [1540, 148], [1610, 172], [1680, 226], [1736, 310], [1784, 430], [1808, 560], [1800, 690], [1772, 810], [1730, 900], [1660, 946], [1560, 962], [1440, 972], [1300, 980], [1160, 982], [1020, 972], [900, 948], [810, 910], [770, 884], [720, 862], [640, 836], [560, 800], [480, 740], [420, 660], [376, 560], [348, 480], [344, 380]];
  const cut = [1100, 600];
  W.split(f, () => {
    f.part(body, HIDE());
    W.clipDraw(f, body, () => {
      // the barrel as a cylinder: lit band high on the side, the core shadow low, reflected light from the floor
      W.softTone(f, E.smooth(body), [
        [[[600, 700], [900, 800], [1300, 840], [1700, 800], [1760, 980], [1200, 1010], [700, 980], [480, 880]], '#000', 0.62, 50], // the barrel turning under, a broad core shadow
        [[[860, 940], [1200, 966], [1560, 950], [1560, 990], [1200, 1000], [860, 980]], '#a8b4c0', 0.35, 10], // floor light on the belly's underside
        [[[820, 330], [1200, 320], [1450, 200], [1600, 220], [1500, 380], [1100, 420], [800, 420]], '#ffffff', 0.22, 40], // the lit top of the barrel and the hump
        [[[380, 320], [600, 300], [640, 460], [420, 520]], '#ffffff', 0.18, 30], // the lit rump
        [[[640, 330], [760, 340], [800, 600], [700, 760], [620, 600]], '#000', 0.3, 30], // the hollow of the flank before the hip
        [[[1580, 420], [1760, 440], [1790, 700], [1640, 740]], '#000', 0.2, 30]]); // the shoulder turning
      W.barrelHatch(f, 820, 1640, x => 520, x => 960 - Math.abs(x - 1220) * 0.08, { bow: 26, step: 18, op: 0.3 });
      W.barrelHatch(f, 380, 640, x => 560, x => 880, { bow: -18, step: 22, op: 0.26 });
      // ribs standing out under the frozen coat, curving down and back round the barrel
      for (let i = 0; i < 6; i++) { const x0 = 1020 + i * 62; groove([[x0 + 60, 440 + i * 4], [x0 + 30, 600], [x0 - 10, 760 - i * 8]], 6, 0.16); ridge([[x0 + 74, 452], [x0 + 44, 600], [x0 + 6, 750 - i * 8]], 1.6, 0.22); }
      // the shoulder: the blade's spine from the hump down to the point of the shoulder, the triceps mass behind the elbow
      groove([[1500, 200], [1590, 420], [1700, 600]], 4, 0.6); ridge([[1516, 206], [1604, 420]], 1.8);
      groove([[1700, 600], [1720, 700], [1690, 820]], 3, 0.5);
      groove([[1500, 640], [1540, 780], [1560, 900]], 3.4, 0.5); // the triceps' back edge to the elbow
      // the thigh: its front over the stifle, its back edge into the gaskin, the hook bone and pin bone jutting
      groove([[640, 300], [720, 520], [760, 760], [760, 900]], 3.2, 0.5); // the stifle line
      groove([[420, 360], [430, 520], [480, 700], [540, 860]], 3, 0.5); // the back of the thigh
      f.flat(ell([596, 246], 34, 20, 0.2, 12), '#d0d6da', { op: 0.35 }); groove([[556, 270], [596, 232], [640, 260]], 3, 0.6); // hook bone
      f.flat(ell([366, 300], 16, 12, 0, 10), '#d0d6da', { op: 0.4 }); groove([[352, 318], [370, 288], [394, 300]], 2.6, 0.6); // pin bone, tail head
      for (const x of [820, 900, 980, 1060]) f.flat(ell([x, 294 - (x === 1060 ? 4 : 0)], 9, 6, 0, 8), '#e0e6ea', { op: 0.35 }); // the spine's knobs along the dip
      W.furPlates(f, body, [1250, 640], 300, 200, 22, { dir: 1.5, s: 1.3, op: 0.35 });
      W.furPlates(f, body, [1720, 600], 60, 220, 14, { dir: 1.3, s: 1.5 });
      W.hoar(f, [1760, 600], 70, 240, 0.75); W.hoar(f, [1500, 220], 140, 60, 0.45);
      W.clipDraw(f, [[1380, 140], [1820, 220], [1820, 900], [1360, 900]], () => { W.lichtenberg(f, [1700, 300], deg(150), 320, 3.6, { depth: 3 }); W.lichtenberg(f, [1720, 360], deg(115), 280, 3.2, { depth: 3 }); W.lichtenberg(f, [1660, 260], deg(175), 220, 3, { depth: 2 }); });
      const ws = [[400, 420], [470, 380], [540, 372]]; f.line(ws, 7, '#a8acb0', { op: 0.8 }); f.line(ws, 2, INK, { op: 0.7 }); for (let i = 1; i < 4; i++) { const q = lerp(ws[0], ws[2], i / 4); f.line([add(q, [-4, -6]), add(q, [4, 6])], 1.4, INK, { op: 0.6 }); } // the old whip scar
    });
  }, [['spine_1', W.side(cut, [-1, 0], 420)], ['spine_2', W.side(cut, [1, 0], 420)]]); // a wide overlap disk so the hump and belly stay closed when the spine bends
  f.bone('spine_2'); W.bristleRidge(f, [[1140, 274], [1220, 248], [1300, 208], [1390, 166], [1470, 144], [1540, 146], [1610, 170]], 46, { up: [0.05, -1], col: '#4e5056', w: 12, taper: true, icicle: 0.25 });
  f.bone('spine_1'); W.bristleRidge(f, [[654, 262], [740, 278], [820, 284], [900, 292], [980, 296], [1060, 290], [1140, 276]], 20, { up: [0, -1], col: '#4e5056', w: 9, taper: true });
  f.bone('spine_2'); rimeBark(f, [[1680, 226], [1736, 310], [1784, 430], [1808, 560], [1800, 690], [1772, 810]], 16, 1);
  W.icicles(f, [[1160, 982], [1300, 980], [1440, 972], [1560, 962], [1660, 946]], 14, 16, 46);
  f.bone('spine_1'); W.icicles(f, [[810, 912], [900, 948], [1020, 972], [1100, 980]], 8, 14, 36);

  // ---- the sacking blanket over the loins and rump: draped over the spine, tented by the hook bone and the tail head,
  // the hem hanging in stiff frozen tatters over the thigh (tongues of different lengths, a torn strip, notches), a girth rope round the barrel holding it (its curve shows the
  // barrel's round). Kept near the hide's value so it reads as cloth over the body, not a patch on a box.
  f.bone('blanket');
  const bl = [[376, 300], [430, 276], [516, 262], [580, 234], [614, 228], [700, 254], [820, 266], [930, 276], [1000, 272], [1026, 330], [1036, 440], [1028, 500, 1], [1010, 512], [996, 560, 1], [978, 520], [950, 532], [930, 548, 1], [912, 526], [880, 540], [858, 590, 1], [846, 592, 1], [834, 548], [800, 566, 1], [770, 560], [742, 572], [722, 612, 1], [704, 618, 1], [690, 580], [664, 592], [640, 604], [618, 640, 1], [600, 652, 1], [586, 612], [560, 618], [540, 606], [512, 640, 1], [496, 626], [470, 600, 1], [452, 606], [432, 566, 1], [412, 540], [394, 500], [380, 420]];
  f.part(bl, { fill: '#857a62', shadow: '#2e281c', light: '#b6aa8c', shade: 0.44, tex: 'weave' + seed, texOp: 0.9, k: 0.8 });
  W.clipDraw(f, bl, () => {
    W.softTone(f, E.smooth(bl), [[[[380, 500], [700, 560], [1040, 460], [1040, 620], [400, 680]], '#000', 0.26, 30], [[[420, 270], [600, 230], [1000, 280], [900, 330], [440, 320]], '#ffffff', 0.2, 18]]);
    for (const g of [[[612, 234], [600, 420], [586, 640]], [[612, 234], [660, 420], [700, 630]], [[612, 234], [740, 420], [820, 600]], [[612, 234], [520, 420], [470, 630]], [[430, 280], [420, 400], [400, 510]], [[740, 262], [880, 400], [930, 556]], [[880, 272], [960, 380], [1010, 520]]]) W.fold(f, g, 2.6); // folds radiating from the tented hook bone and tail head
    W.barrelHatch(f, 440, 1000, x => 420, x => 600, { bow: 14, step: 26, op: 0.22 });
    W.hoar(f, [800, 290], 200, 50, 0.8); W.hoar(f, [600, 250], 40, 30, 0.7);
    const pq = [[800, 384], [862, 370], [874, 430], [812, 446]]; f.part(hard(pq), { fill: '#6e6450', shade: 0.3, inkW: 1, cast: false, tex: 'weave' + seed, texOp: 0.8 }); f.stitches([...pq, pq[0]], '#c8b896', 0.9); // a darned patch
    for (let i = 0; i < 7; i++) { const x = 470 + i * 84; f.line([[x, 580 - (i % 2) * 20], [x + 8, 606 - (i % 2) * 20]], 1.2, '#2a2418', { op: 0.5 }); } // frayed threads at the hem
  });
  W.rimeCrust(f, [[430, 276], [516, 262], [580, 234], [614, 228], [700, 254], [820, 266], [930, 276], [1000, 272]], 10, [1, -0.3]);
  W.icicles(f, [[1028, 500], [996, 560], [930, 548], [852, 591], [800, 566], [713, 615], [609, 646], [512, 640], [470, 600], [432, 566]], 12, 14, 40); // a tattered hem: tongues of different length, a torn strip, notches
  // the girth rope: over the blanket's front edge, down round the barrel's curve to under the belly
  W.rope(f, [[1000, 282], [1020, 420], [1040, 560], [1070, 720], [1100, 860], [1120, 962]], 7, { col: '#6a5c48' });
  W.rope(f, [[1120, 962], [1050, 974], [990, 970]], 6, { col: '#4a4034' });
  // ---- the tail: a thin rope of tail from the raised tail head, hanging close down the buttock, ending in a big switch
  f.bone('tail');
  const tl = W.spline([[364, 296], [340, 340], [326, 460], [326, 640], [334, 820], [340, 940]], 6);
  f.part(W.ribbon(tl, t => 30 - t * 12), HIDE({ cast: false, maxShade: 8 }));
  W.clipDraw(f, W.ribbon(tl, t => 30 - t * 12), () => { for (let i = 1; i < tl.length - 1; i += 2) f.line([add(tl[i], [-9, -3]), add(tl[i], [9, 3])], 1, INK, { op: 0.35 }); });
  const sw = tl[tl.length - 1];
  for (let i = 0; i < 13; i++) { const sx = (i - 6) * 4.6; W.hairClump(f, [add(sw, [sx * 0.4, -40]), add(sw, [sx * 1.1, 40]), add(sw, [sx * 1.6 + (f.r() - 0.5) * 12, 130 + f.r() * 50])], 12, { pal: ['#3e3e3c', '#5a5a56', '#4a4a46'] }); } // the switch, a heavy tuft frozen stiff
  W.rimeCrust(f, [add(sw, [-8, -30]), add(sw, [-6, 60]), add(sw, [10, 120])], 5, [1, -0.2]);
  W.icicles(f, [add(sw, [-26, 160]), add(sw, [28, 170])], 5, 12, 30);

  // ---- the dewlap: a great loose fold hanging from under the jaw to between the forelegs, frozen stiff in folds
  f.bone('neck');
  const dew = [[1790, 690], [1850, 800], [1910, 900], [1950, 980], [1910, 1016], [1840, 1036], [1770, 1030], [1712, 990], [1700, 920], [1730, 820]];
  f.part(dew, HIDE({ fill: '#868682', maxShade: 26 }));
  W.clipDraw(f, dew, () => {
    W.softTone(f, E.smooth(dew), [[[[1700, 930], [1800, 970], [1940, 960], [1880, 1040], [1720, 1020]], '#000', 0.45, 18]]);
    for (let i = 0; i < 5; i++) groove([[1750 + i * 36, 790 + i * 20], [1752 + i * 36, 900], [1740 + i * 34, 1010 - Math.abs(i - 2) * 8]], 3.2, 0.5); // the hanging folds
    W.hoar(f, [1910, 920], 30, 60, 0.8);
  });
  W.icicles(f, [[1950, 980], [1910, 1016], [1840, 1036], [1770, 1030], [1712, 990]], 10, 18, 56);

  // ---- the head, three-quarter toward the party and carried low: a short, deep wedge. The broad flat forehead faces us
  // between the horns and runs down to a broad square muzzle; the near cheek and the deep jaw show on its left.
  f.bone('head');
  const skull = [[1836, 466], [1880, 446], [1930, 440], [1972, 452], [1998, 500], [2022, 572], [2034, 614], [2050, 700], [2072, 790], [2096, 862], [2114, 918], [2106, 962], [2080, 986], [2030, 998], [1990, 992], [1950, 972], [1900, 922], [1852, 852], [1818, 770], [1800, 690], [1796, 600], [1808, 520]];
  f.part(skull, HIDE({ fill: '#868682', maxShade: 26 }));
  const face = [[1838, 470], [1972, 452], [1998, 500], [2030, 600], [2060, 740], [2092, 866], [1990, 884], [1946, 770], [1890, 630]];
  W.clipDraw(f, skull, () => {
    W.softTone(f, E.smooth(skull), [
      [[[1800, 640], [1880, 700], [1950, 900], [1990, 1000], [1840, 900], [1790, 760]], '#000', 0.42, 18], // the cheek and jaw turning under
      [[[1850, 470], [1970, 456], [2020, 600], [2060, 760], [2000, 760], [1920, 600]], '#ffffff', 0.3, 16], // the broad flat forehead, lit
      [[[1820, 520], [1880, 560], [1880, 660], [1820, 640]], '#000', 0.22, 12]]); // behind the eye
    f.flat(face, '#eef2f4', { op: 0.14 }); // the forehead plane facing the party
    f.line([[1838, 470], [1890, 630], [1946, 770], [1990, 884]], 2, INK, { op: 0.45 }); // the corner where the face turns to the cheek
    groove([[1820, 700], [1860, 800], [1912, 880], [1960, 950]], 3, 0.55); // the jaw line under the cheek muscle
    groove([[1806, 620], [1812, 700], [1830, 770]], 3.2, 0.5); // the back of the jaw at its angle
    groove([[1880, 660], [1890, 740], [1914, 820]], 2.4, 0.45); // the masseter's front edge
    for (const [a, b] of [[[1900, 520], [1960, 512]], [[1906, 548], [1972, 540]], [[1916, 580], [1982, 576]]]) groove([a, lerp(a, b, 0.5).map((v, i) => v + (i ? 4 : 0)), b], 2.2, 0.42); // wrinkles across the broad forehead
    f.line([[1960, 650], [1990, 740], [2030, 830]], 1.6, INK, { op: 0.35 }); // the nasal bone's ridge down the face
    W.wrapHatch(f, [1830, 600], [1940, 900], 50, 40, 1, 9, { w: 2, op: 0.3 });
    W.furPlates(f, skull, [1850, 720], 40, 70, 8, { dir: 1.4, s: 0.9 });
    W.rimeCrust(f, [[1972, 452], [1998, 500], [2022, 572], [2050, 700], [2072, 790]], 8, [1, -0.2]);
    W.hoar(f, [2030, 700], 30, 80, 0.8);
  });
  // the muffle: a wide, wet, bare nose pad across the end of the muzzle, two comma nostrils at its corners, frosted
  const muf = [[1986, 880], [2040, 872], [2094, 864], [2112, 918], [2102, 956], [2050, 966], [1998, 962], [1978, 922]];
  f.part(muf, { fill: '#48484c', shadow: '#16181c', light: '#9aa0a6', shade: 0.4, tex: 'mottle' + seed, texOp: 0.6, maxShade: 12 });
  W.clipDraw(f, muf, () => {
    for (let i = 0; i < 18; i++) { const q = [1990 + f.r() * 116, 876 + f.r() * 84]; f.flat(ell(q, 2.4, 1.6, 0, 6), '#e8f0f4', { op: 0.7 }); } // the wet sheen beaded and frozen
    f.line([[2000, 884], [2050, 878], [2096, 872]], 2.6, '#eef4f8', { op: 0.55 });
    f.line([[2044, 884], [2046, 920], [2044, 960]], 1.4, INK, { op: 0.45 }); // the groove down the middle of the pad
  });
  for (const [q, s, m] of [[[2010, 920], 1, -1], [[2084, 912], 0.9, 1]]) { const N = pts => pts.map(([u, v]) => add(q, [u * s * m, v * s])); f.flat(N([[6, -14], [-8, -12], [-14, 2], [-6, 14], [4, 10], [-2, 0]]), '#0a0a0e'); f.line(N([[10, -18], [-12, -16], [-18, 4], [-6, 18]]), 2, INK, { op: 0.7 }); } // comma nostrils, flared
  f.line([[1994, 978], [2040, 986], [2090, 976]], 2.4, INK, { op: 0.7 }); f.line([[1994, 978], [1950, 960], [1912, 924]], 2.2, INK, { op: 0.6 }); // the mouth line
  for (let i = 0; i < 9; i++) W.icicle(f, [1960 + i * 16, 992 - Math.abs(i - 4) * 3], 26 + f.r() * 34, 7); // frozen breath hanging from the lips
  W.icicles(f, [[2112, 918], [2102, 956], [2080, 986]], 3, 12, 26);
  // the curled poll tuft on the broad forehead between the horns, frozen into stiff curls
  for (let i = 0; i < 14; i++) { const q = [1852 + i * 9 + f.r() * 6, 462 + (i % 3) * 14 + f.r() * 8], sg = i % 2 ? 1 : -1, cl = [q, add(q, [7 * sg, -6]), add(q, [13 * sg, 3]), add(q, [7 * sg, 11]), add(q, [0, 5])]; f.stroke(cl, 7, INK, { op: 0.75 }); f.stroke(cl, 4.4, i % 3 ? '#8e8e8a' : '#a8aaa8'); f.line(cl.slice(0, 3), 1, '#eef2f4', { op: 0.5 }); } // tight frozen curls
  // the eyes: small and dark, set out at the sides of the forehead under the brow bulge, filmed with frost; the far eye
  // a bulge on the far contour
  f.stroke([[1842, 596], [1870, 584], [1900, 598]], 15, '#3a3c40'); W.animalEye(f, [1870, 612], 15, deg(-8), { frost: true });
  f.stroke([[2004, 574], [2024, 566], [2040, 584]], 11, '#3a3c40'); W.animalEye(f, [2024, 592], 9, deg(20), { frost: true });
  // the head collar: a noseband round the muzzle, a cheek strap up behind the near horn, brass rosettes; the gnawed
  // halter rope from the ring under the jaw
  f.part(W.ribbon(W.spline([[1888, 858], [1950, 822], [2016, 808], [2082, 800]], 6), 22), W.LEA(f, { fill: '#433628' }));
  f.part(W.ribbon(W.spline([[1840, 500], [1832, 640], [1860, 760], [1890, 856]], 6), 22), W.LEA(f, { fill: '#4a3c30' }));
  for (const q of [[1838, 560], [1888, 856], [2010, 810], [2080, 800]]) { f.part(ell(q, 11, 11, 0, 10), W.BRD(f, { inkW: 1.1, cast: false })); for (let i = 0; i < 6; i++) f.line([q, add(q, rot([10, 0], i * 1.05))], 1.2, P.brassD); }
  const ring = [1900, 900]; f.part(ell(ring, 15, 15, 0, 10), W.IR(f, { cast: false })); f.flat(ell(ring, 6, 6, 0, 8), '#0a0a0e', { op: 0.6 });
  W.rope(f, [ring, add(ring, [-14, 60]), add(ring, [-8, 116])], 6, { col: '#6a5c48', fray: true });
  // the near ear, set out sideways under the near horn, its hairy cup toward us, frost on the rim
  const ear = [[1822, 490], [1772, 496], [1716, 516], [1686, 546], [1714, 568], [1776, 566], [1818, 548]];
  f.part(ear, HIDE({ fill: '#7e7e7a', k: 0.75, maxShade: 10 }));
  f.flat([[1806, 506], [1760, 512], [1716, 532], [1730, 552], [1782, 550], [1810, 536]], '#2e2e32', { op: 0.7 });
  for (let i = 0; i < 4; i++) f.line([[1730 + i * 18, 548], [1740 + i * 18, 530]], 1.2, '#c8ccd0', { op: 0.55 }); // hair in the cup
  W.rimeCrust(f, [[1772, 496], [1716, 516], [1686, 546]], 4, [1, -0.3]); W.icicle(f, [1700, 564], 16, 4);
  // the near horn: a heavy ringed base on the poll's corner, rising above the poll, curving out and then forward, its
  // brass cap still on
  f.part(ell([1846, 464], 34, 26, -0.3, 12), HIDE({ fill: '#62605c', maxShade: 8 })); // the base boss
  const hn = hornP([[1846, 462], [1792, 436], [1768, 380], [1776, 316], [1806, 264], [1852, 236]], 76);
  f.part(hn.out, { fill: '#b8b0a0', shadow: '#2a2622', light: '#e4dccc', shade: 0.42, tex: 'craze' + seed, texOp: 0.5 });
  W.clipDraw(f, hn.out, () => {
    for (let i = 1; i < 10; i++) { const C2 = hn.C2, d = E.norm(sub(C2[i + 1], C2[i - 1])), n2 = [-d[1], d[0]]; f.line([add(C2[i], mul(n2, -40)), add(C2[i], mul(n2, 40))], i < 5 ? 2 : 1.2, INK, { op: i < 5 ? 0.55 : 0.38 }); } // growth rings, deep at the base
    f.flat(W.ribbon(hn.C2.slice(0, 8), 76), '#2a2622', { op: 0.28 });
    f.line(hn.C2.slice(5).map(q => add(q, [8, 2])), 3, '#f4ecdc', { op: 0.5 });
  });
  { const C2 = hn.C2, tip = C2[C2.length - 1], d = E.norm(sub(tip, C2[C2.length - 4])), a2 = Math.atan2(d[1], d[0]); f.part(hard([add(tip, rot([-40, -13], a2)), add(tip, rot([10, 0], a2)), add(tip, rot([-40, 13], a2))]), W.BRD(f, { inkW: 1.2, cast: false })); f.rivet(add(tip, rot([-28, 0], a2)), 2.6, P.brassL); }
  W.rimeCrust(f, hn.C2.slice(5).filter((_, i) => i % 2 === 0), 6, [1, -0.3]); W.icicle(f, hn.C2[Math.floor(hn.C2.length * 0.5)], 20, 5);

  // ---- the cow bell at the throat, hung on a strap over the dewlap, its clapper frozen to one side
  f.bone('bell');
  W.rope(f, [[1820, 780], [1846, 830], [1856, 860]], 5, { col: '#4a3e32' });
  const bb = [1856, 870];
  const bell = [add(bb, [-30, -8]), add(bb, [28, -10]), add(bb, [40, 60]), add(bb, [46, 90]), add(bb, [-46, 94]), add(bb, [-38, 60])];
  W.bplate(f, bell, W.BRD(f, {}), { bev: 3, dents: [[add(bb, [10, 50]), 9]], lich: [[add(bb, [-10, 30]), deg(80), 40, 1.6]] });
  f.part(ell(add(bb, [34, 98]), 9, 9, 0, 10), W.IR(f, { cast: false })); f.line([add(bb, [0, 20]), add(bb, [34, 90])], 3, P.ironL);
  W.icicles(f, [add(bb, [-46, 94]), add(bb, [46, 90])], 4, 10, 24);

  // ---- the yoke on the neck in front of the hump, its iron bow down round the throat; the broken sweep beam bolted to
  // its near end, jutting toward us and down to the floor between the legs
  f.bone('yoke');
  const bow = W.spline([add(YN, [10, 20]), [1752, 460], [1790, 600], [1820, 720], [1850, 750], [1862, 712]], 6);
  f.line(bow, 18, INK); f.line(bow, 13, P.ironL); f.line(bow.map(q => add(q, [3, -3])), 3, '#9aa0a8', { op: 0.5 });
  const YF = [1760, 236], yd = E.norm(sub(YN, YF)), yn = [-yd[1], yd[0]];
  const yk = [add(YF, mul(yn, 30)), add(YN, mul(yn, 40)), add(YN, mul(yn, -40)), add(YF, mul(yn, -30))];
  const dyk = f.part(hard(yk), OAK({ fill: '#6a5638' })); W.bevel(f, dyk, E.bbox(yk), 5, { lite: '#c8b896' });
  f.part(ell(add(YN, mul(yd, 4)), 42, 36, ang(YF, YN), 14), OAK({ fill: '#7a6646', cast: false })); // the end grain toward us
  W.weld(f, [add(YN, [-20, 30]), YN, add(YN, [24, -20])], 7, { a: deg(120) });
  f.bone('beam');
  const bn2 = [-bd[1], bd[0]], BW = t => 64 + t * 60, BP = t => lerp(STUB, DRAG, t);
  const beam = [add(STUB, mul(bn2, BW(0) / 2)), add(DRAG, mul(bn2, BW(1) / 2)), add(DRAG, add(mul(bn2, BW(1) * 0.2), mul(bd, 40))), add(DRAG, add(mul(bn2, -BW(1) * 0.1), mul(bd, 14))), add(DRAG, add(mul(bn2, -BW(1) * 0.4), mul(bd, 50))), add(DRAG, mul(bn2, -BW(1) / 2)), add(STUB, mul(bn2, -BW(0) / 2))];
  const dbm = f.part(hard(beam), OAK());
  W.bevel(f, dbm, E.bbox(beam), 6, { lite: '#c8b896' });
  W.clipDraw(f, beam, () => {
    for (let i = 0; i < 7; i++) f.line([add(STUB, mul(bn2, -24 + i * 8)), add(DRAG, mul(bn2, -50 + i * 16))], 1.2, INK, { op: 0.45 }); // grain
    W.wrapHatch(f, BP(0.05), BP(0.95), BW(0.05) / 2, BW(0.95) / 2, -1, 18, { w: 2.2, op: 0.35, bow: 0.1 });
    for (let kk = 0; kk < 6; kk++) { const t = 0.34 + kk * 0.1, c = BP(t), w0 = BW(t) * 0.5; const pl = [add(c, add(mul(bn2, -w0 * 0.7), mul(bd, -14))), add(c, add(mul(bn2, w0 * 0.7), mul(bd, -14))), add(c, add(mul(bn2, w0 * 0.7), mul(bd, 14))), add(c, add(mul(bn2, -w0 * 0.7), mul(bd, 14)))]; W.bplate(f, pl, W.BRD(f, {}), { bev: 2 }); for (const q of pl) f.rivet(lerp(q, c, 0.18), 2.4, P.brassL); for (let jj = 0; jj < kk + 1; jj++) f.line([add(c, add(mul(bn2, -w0 * 0.5 + jj * 8), mul(bd, -7))), add(c, add(mul(bn2, -w0 * 0.5 + jj * 8), mul(bd, 7)))], 1.4, INK); } // tally plates, one notch per thousand turns
    W.hoar(f, BP(0.4), 60, 80, 0.6);
    W.lichtenberg(f, BP(0.22), ang(STUB, DRAG), 200, 2.6, { metal: true, depth: 2 });
  });
  for (const t of [0.2, 0.28]) { const c = BP(t), w0 = BW(t) / 2 + 6; f.part(hard([add(c, add(mul(bn2, -w0), mul(bd, -10))), add(c, add(mul(bn2, w0), mul(bd, -10))), add(c, add(mul(bn2, w0), mul(bd, 10))), add(c, add(mul(bn2, -w0), mul(bd, 10)))]), W.IR(f, { fill: P.ironL, inkW: 1.4, cast: false })); for (const u of [-0.6, 0.6]) f.rivet(add(c, mul(bn2, u * w0)), 4, P.steelL); } // iron bolt plates
  f.part(ell(STUB, BW(0) / 2, BW(0) * 0.18, ang(STUB, DRAG) + Math.PI / 2, 12), OAK({ fill: '#7a6646', cast: false })); f.line([add(STUB, mul(bn2, -20)), add(STUB, mul(bn2, 14))], 1.2, INK, { op: 0.5 }); // the sawn end grain of the stub
  for (let i = 0; i < 8; i++) { const q = add(DRAG, add(mul(bn2, -BW(1) * 0.45 + i * BW(1) * 0.12), mul(bd, 10 + (i % 3) * 14))); f.line([add(q, mul(bd, -30)), q], 4, '#8e7a5c'); f.line([add(q, mul(bd, -30)), q], 1, INK, { op: 0.6 }); } // the splintered end
  rimeBark(f, [add(STUB, mul(bn2, BW(0) / 2)), add(DRAG, mul(bn2, BW(1) / 2))], 10, 1);
  W.icicles(f, [add(BP(0.3), mul(bn2, -BW(0.3) / 2)), add(BP(0.85), mul(bn2, -BW(0.85) / 2))], 7, 12, 34);
  // the tug-chain trailing from the yoke's near end down the shoulder to the floor
  W.chainLinks(f, [add(YN, [20, 40]), add(YN, [-10, 300]), [1640, 900], [1610, gy - 10], [1460, gy - 8]], 24, P.ironL); // back along the near shoulder, clear of the head

  f.bone('root');
  for (const k of ['hn', 'hf', 'ff']) f.flat(ell([LEG[k].T[0], gy], 80, 6, 0, 12), P.iceS, { op: 0.4 });
  f.flat(ell([1120, gy + 4], 760, 16, 0, 20), '#000', { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ THE GREAT REFRACTOR (ruler 4.5, frame-cropped)
// The observatory's great telescope, swung down on its mount until the tube lies nearly level across the frame, aimed at
// the party. The riveted iron pier rises behind it out of the top of the frame (game right after the flip), the rear of
// the tube high by the pier, the lens end hanging low over the front rank. Three hundred years of tarnish: the tube is
// dark bronze-brown brass with verdigris in its seams and round its rivets, tarnish runs streaking down from the
// flanges, bands of frost and rime round it, and only small worn highlights polished bright where hands touched it.
// Riveted in tapering sections, modelled as a cylinder (a narrow lit band, the core shadow, reflected light from the
// floor on the underside, and its cast shadow on the pier); clamp rings proud of the tube; rime thick on the windward
// top, a fringe of icicles along the underside. Lightning came down the spire into the mount: the declination gears
// are fused into one scorched lump and burns branch along the tube from the mount to the lens. The objective, seen
// almost edge-on inside its black iron dew cap, is frosted milky and cracked once across (never a dark centre: a pale
// sliver of glass in a brass cell). At the rear the night assistant stands frozen on the oak observing ladder, his brow
// fused to the eyepiece cup, his near hand still on the slow-motion handle, his far hand on the focus knob, his hair
// standing up from the strike, his scarf frozen sideways in a wind that stopped.
// Dress and gear: riveted iron pier with a cast maker's plate, lead counterweight on an iron arm, brass setting circle
// engraved with degrees, a finder scope strapped alongside, hand-wheels with oak grips worn bright, the clockwork drive
// in a glass-fronted case at the pier's foot with its drive cable up to the cradle, the ladder's rungs worn hollow, the
// dome-shutter chains hanging slack across the tube, the assistant's quilted coat, fingerless mittens, log board, a dark
// lantern with its shutter shut.
// Rig: pier (root) > tube (pivot at the declination cradle) > finder, dewcap; counterweight (pier); drive (root);
// ladder (root) > pelvis > the assistant's humanoid bones, scarf, board; chains (root).
// Motion: idle creeps the tube and clunks a gear; attack is a sighting (the tube settles, the drive stops, the lens frosts).
function greatRefractor() {
  const seed = 1121, CW = 2200, CH = 1600, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY;
  const R0 = [310, 330], L0 = [2130, 800], ax = E.norm(sub(L0, R0)), nx = [-ax[1], ax[0]], tA = Math.atan2(ax[1], ax[0]);
  const TL = E.len(sub(L0, R0)), tp = t => lerp(R0, L0, t), rad = t => 124 + 66 * t;
  const TP = (t, v) => add(tp(t), mul(nx, v * rad(t))); // v = -1 top edge, +1 underside
  const RK = 0.2, arc = (t, v0 = -1, v1 = 1, n = 12, k = 1) => Array.from({ length: n + 1 }, (_, i) => { const v = v0 + (v1 - v0) * i / n; return add(add(tp(t), mul(nx, v * rad(t) * k)), mul(ax, RK * rad(t) * k * Math.sqrt(Math.max(0, 1 - v * v)))); }); // a ring round the tube, its near half bulging toward us
  const CR = [640, 430]; // the declination cradle on the pier
  const PX0 = 470, PX1 = 790, PD = [70, -36];
  const IRN = (o = {}) => W.IR(f, o);
  const BLK = (o = {}) => Object.assign({ fill: '#26262a', shadow: '#0c0c0e', light: '#5a5a62', shade: 0.4, tex: 'pit' + seed, texOp: 0.6 }, o);
  const OAK = (o = {}) => Object.assign({ fill: '#5e4c36', shadow: '#241c14', light: '#8e7a5c', shade: 0.42, tex: 'wood' + seed, texOp: 0.6 }, o);
  // aged brass: a dark bronze-brown, verdigris in the seams, no gold read; the only bright metal is small worn highlights
  const AGE = (o = {}) => Object.assign({ fill: '#5e4a2e', shadow: '#1a120a', light: '#7e6a48', shade: 0.42, tex: 'hammer' + seed, texOp: 0.5 }, o);
  const VERD = '#4e7e70', VERDL = '#7aa898', HIL = '#d8c690';
  f.joint('pier', [630, 1500]).joint('tube', CR, 'pier').joint('finder', tp(0.42), 'tube').joint('dewcap', tp(0.88), 'tube').joint('counterweight', CR, 'pier');
  f.joint('drive', [610, 1460]).joint('ladder', [210, 1540]).joint('chains', [1300, 0]);

  // ---- the pier: cast iron, two faces in three-quarter view, rising out of the top of the frame
  f.bone('pier');
  const front = hard([[PX0, -20], [PX1, -20], [PX1 + 30, gy - 40], [PX0 - 30, gy - 40]]);
  const sideF = hard([[PX1, -20], add([PX1, -20], PD), add([PX1 + 30, gy - 40], PD), [PX1 + 30, gy - 40]]);
  f.part(sideF, IRN({ fill: '#1e1e22' }));
  const dp = f.part(front, IRN({ fill: '#34343a', light: '#6a6a72' }));
  W.bevel(f, dp, E.bbox(front), 6, { lite: '#8a8e96', lite2: '#b8bcc0' });
  W.clipDraw(f, front, () => {
    for (const x of [0.18, 0.5, 0.82]) f.part(hard([[lerp([PX0, 0], [PX1, 0], x)[0] - 10, -20], [lerp([PX0, 0], [PX1, 0], x)[0] + 10, -20], [lerp([PX0 - 30, 0], [PX1 + 30, 0], x)[0] + 12, gy], [lerp([PX0 - 30, 0], [PX1 + 30, 0], x)[0] - 12, gy]]), IRN({ fill: '#40404a', cast: false, inkW: 1.4 })); // cast ribs
    for (let y = 120; y < gy; y += 260) { W.rivetRow(f, [PX0 + 10, y], [PX1 - 10, y], 9, 5, P.steelL, { fused: 0.1 }); f.line([[PX0, y + 12], [PX1, y + 12]], 2, INK, { op: 0.5 }); }
    const mp = [[PX0 + 80, 980], [PX1 - 70, 980], [PX1 - 66, 1060], [PX0 + 76, 1060]]; W.bplate(f, mp, AGE({ fill: '#5a4a32', light: '#8a7a58' }), { bev: 3 }); for (let i = 0; i < 8; i++) f.line([[PX0 + 100 + i * 22, 1000], [PX0 + 104 + i * 22, 1040]], 2, INK, { op: 0.6 }); W.clipDraw(f, mp, () => { f.flat(ell([PX0 + 110, 1050], 50, 16, 0, 10), VERD, { op: 0.45 }); f.flat(ell([PX1 - 90, 990], 30, 10, 0, 10), VERD, { op: 0.35 }); }); for (const q of mp) f.rivet(lerp(q, [630, 1020], 0.1), 3, P.brassL); // the maker's plate, verdigris blooming on it
    W.lichtenberg(f, [PX0 + 120, 500], deg(90), 520, 4, { metal: true, depth: 3 });
    W.hoar(f, [PX1 - 40, 700], 80, 400, 0.6); W.streaks(f, [630, 300], 140, 12, 300, { col: '#0c0c10', op: 0.35 });
    f.flat([[PX0 - 40, 1400], [PX1 + 40, 1400], [PX1 + 40, gy], [PX0 - 40, gy]], P.mud, { op: 0.3 });
    // the tube's cast shadow on the pier: the key light is upper right in drawing space, so it falls down and left
    f.raw(`<path d="${E.smooth([TP(0.1, 0.6), TP(0.28, 0.7), add(TP(0.28, 1.0), [-60, 150]), add(TP(0.1, 1.0), [-60, 150])])}" fill="#000" opacity="0.45" filter="url(#glow${seed})"/>`);
  });
  rimeBark(f, [[PX1 + 6, 60], [PX1 + 16, 600], [PX1 + 26, 1200]], 16, 1);
  // the counterweight: a lead drum on an iron arm, up and back from the cradle, past the pier's edge out of the frame top
  f.bone('counterweight');
  const cwA = add(CR, [-40, -60]), cwB = [250, 40];
  f.part(limb(cwA, cwB, 50, 42, { steps: 6, capK: 0.3 }), IRN({ fill: P.ironL }));
  W.rivetRow(f, lerp(cwA, cwB, 0.1), lerp(cwA, cwB, 0.6), 5, 4, P.steelL);
  const cwc = lerp(cwA, cwB, 0.9);
  const drum = [add(cwc, [-110, -100]), add(cwc, [80, -120]), add(cwc, [96, 90]), add(cwc, [-96, 110])];
  const dd = f.part(hard(drum), { fill: '#6a6e74', shadow: '#2a2c32', light: '#aab0b8', shade: 0.42, inkW: 1.6, tex: 'pit' + seed, texOp: 0.7 });
  W.bevel(f, dd, E.bbox(drum), 6, { lite: '#c8ccd0' });
  W.clipDraw(f, drum, () => { W.hoar(f, add(cwc, [40, -60]), 70, 50, 0.8); f.line([add(cwc, [-100, -40]), add(cwc, [90, -50])], 2, INK, { op: 0.5 }); f.line([add(cwc, [-96, 40]), add(cwc, [94, 30])], 2, INK, { op: 0.5 }); W.dent(f, add(cwc, [-20, 60]), 16); });
  W.icicles(f, [add(cwc, [-96, 110]), add(cwc, [96, 90])], 7, 14, 40);

  // ---- the clockwork drive in its glass-fronted case at the pier's foot, still ticking; its cable up to the cradle
  f.bone('drive');
  const B0 = [380, 1300], B1 = [700, 1300], dz = [60, -34];
  const boxF = hard([B0, B1, [B1[0], gy], [B0[0], gy]]), boxT = hard([B0, B1, add(B1, dz), add(B0, dz)]), boxS = hard([B1, add(B1, dz), add([B1[0], gy], dz), [B1[0], gy]]);
  f.part(boxT, OAK({ fill: '#6a5638' })); f.part(boxS, OAK({ fill: '#3a2e20' }));
  f.part(boxF, OAK());
  const gl = hard([add(B0, [26, 26]), add(B1, [-26, 26]), [B1[0] - 26, gy - 30], [B0[0] + 26, gy - 30]]);
  f.part(gl, { fill: '#2a3038', shadow: '#0e1014', shade: 0.3, inkW: 1.4, cast: false });
  W.clipDraw(f, gl, () => {
    W.gear(f, [470, 1420], 64, 22, { a: 0.2, look: AGE({ fill: '#5a4a32', light: '#8a7a58' }) }); W.gear(f, [590, 1380], 44, 16, { a: 0.5, look: AGE({ fill: '#5a4a32', light: '#8a7a58' }) }); W.gear(f, [620, 1480], 30, 12, { a: 0.1, look: AGE({ fill: '#5a4a32', light: '#8a7a58' }) });
    f.line([[540, 1340], [560, 1500]], 4, P.steelL); f.part(ell([560, 1510], 20, 14, 0, 10), W.ST(f, { cast: false }));
    f.flat(gl, '#c8dae4', { op: 0.18 }); f.flat([add(B0, [30, 30]), add(B0, [120, 30]), add(B0, [40, 200])], '#ffffff', { op: 0.18 });
    W.hoar(f, add(B1, [-60, 60]), 80, 60, 0.9); W.frostCracks(f, [540, 1420], 80, 60, 3);
  });
  for (const q of [B0, B1, [B0[0], gy], [B1[0], gy]]) f.part(ell(q, 14, 14, 0, 8), AGE({ fill: '#4e4030', cast: false }));
  W.rimeCrust(f, [B0, add(B0, dz), add(B1, dz)], 8, [1, -0.3]);
  // the drive cable: a braided iron rope from the case up the pier's side to the cradle, slack and frozen, out past the pier edge
  W.rope(f, [add(B1, [40, -20]), [850, 1180], [880, 900], [860, 640], add(CR, [170, 80])], 7, { col: '#5a5e64' });
  W.icicles(f, [[850, 1180], [880, 900]], 3, 10, 26);

  // ---- the dome-shutter chains hanging slack, behind the tube (far side) first
  f.bone('chains');
  W.chainLinks(f, [[1180, -10], [1220, 300], [1280, 520], [1330, 760]], 22, P.ironL);

  // ---- the tube: aged brass in tapering sections, modelled as a cylinder
  f.bone('tube');
  const secs = [[0.0, 0.1, 0], [0.1, 0.36, 0.06], [0.36, 0.62, 0], [0.62, 0.87, 0.04]];
  for (const [t0, t1, dk] of secs) {
    const sec = [...arc(t1).map((q, i) => i === 0 || i === 12 ? [...q, 1] : q), ...arc(t0).reverse().map((q, i) => i === 0 || i === 12 ? [...q, 1] : q)];
    f.part(sec, AGE({ fill: mix('#5e4a2e', '#000', dk), maxShade: 10 }));
    W.clipDraw(f, sec, () => {
      const band = (v0, v1, col, op) => f.flat([...arc(t0 - 0.01, v0, v1, 6), ...arc(t1 + 0.01, v1, v0, 6)], col, { op });
      band(-0.98, -0.8, '#2a2014', 0.35); // the top edge turning away
      band(-0.72, -0.5, '#a88e5c', 0.5); band(-0.66, -0.58, HIL, 0.3); // the narrow lit band
      band(-0.5, 0.1, '#6a5638', 0.25);
      band(0.2, 0.72, '#120c06', 0.55); // the core shadow
      band(0.76, 0.98, '#6e7a7c', 0.45); // reflected light from the frosted floor along the underside
      W.streaks(f, tp((t0 + t1) / 2 + 0.01), (t1 - t0) * TL * 0.45, 9, 120, { col: '#1a120a', op: 0.4, w: 4 }); // tarnish streaks running down
      for (let k2 = 1; k2 < 4; k2++) { const tt = t0 + (t1 - t0) * k2 / 4; f.line(arc(tt, -0.98, 0.98), 2.6, VERD, { op: 0.55 }); f.line(arc(tt, -0.98, 0.98), 1.2, INK, { op: 0.5 }); f.line(arc(tt, -0.9, -0.5).map(q => add(q, mul(ax, 3))), 1, '#a88e5c', { op: 0.4 }); } // plate seams with verdigris in them
      W.rivetRow(f, TP(t0 + 0.01, -0.5), TP(t1 - 0.01, -0.5), Math.round((t1 - t0) * 60), 3.4, '#8a7650', { fused: 0.08 });
      W.rivetRow(f, TP(t0 + 0.01, 0.3), TP(t1 - 0.01, 0.3), Math.round((t1 - t0) * 60), 3.4, '#6a5a3c', { fused: 0.05 });
      for (let k2 = 0; k2 < 8; k2++) f.flat(ell(TP(t0 + (t1 - t0) * (k2 + 0.5) / 8, k2 % 2 ? -0.5 : 0.3), 7, 5, tA, 8), VERD, { op: 0.45 }); // verdigris blooms round the rivets
      for (let k2 = 0; k2 < 3; k2++) f.line([TP(t0 + (t1 - t0) * (0.2 + k2 * 0.3), -0.62), TP(t0 + (t1 - t0) * (0.26 + k2 * 0.3), -0.6)], 2, HIL, { op: 0.7 }); // small worn highlights
      W.dent(f, TP((t0 + t1) / 2 + 0.03, 0.1), 18, tA);
      // frost bands round the tube and rime on the windward top
      const tf = t0 + (t1 - t0) * (0.3 + f.r() * 0.4); f.flat([...arc(tf - 0.008, -1, -0.1, 8), ...arc(tf + 0.012, -0.3, -1, 8)], '#dfe8ee', { op: 0.3 }); W.hoar(f, TP(tf, -0.5), 30, 70, 0.7); // a frost band, thick on the windward top and thinning round the side
      W.hoar(f, TP((t0 + t1) / 2, -0.7), (t1 - t0) * TL * 0.45, 46, 0.8);
    });
  }
  // lightning burns along the tube from the mount to the lens
  W.clipDraw(f, [TP(0, -1), TP(0.87, -1), TP(0.87, 1), TP(0, 1)], () => { for (const [t, v, a, l] of [[0.2, 0.0, 0, 380], [0.42, -0.2, 0.1, 360], [0.62, 0.1, -0.05, 320], [0.3, 0.3, 0.3, 200]]) W.lichtenberg(f, TP(t, v), tA + a, l, 3.2, { metal: true, depth: 3 }); });
  // flanges and clamp rings with real thickness, proud of the tube's outline so they break its silhouette
  const ringAt = (t, k, w, look) => {
    const fa = arc(t, -1, 1, 12, k).map(q => add(q, mul(ax, -w))), fb = arc(t, -1, 1, 12, k).map(q => add(q, mul(ax, w)));
    f.part([...fb, ...fa.reverse()], Object.assign({}, look, { k: 0.6, cast: true }));
    f.line(arc(t, -1.0, -0.2, 8, k).map(q => add(q, mul(ax, w))), 2.4, look.light || '#8a8e96', { op: 0.6 });
    f.flat([...arc(t, 0.3, 1, 6, k).map(q => add(q, mul(ax, -w))), ...arc(t, 1, 0.3, 6, k).map(q => add(q, mul(ax, w)))], '#000', { op: 0.35 });
    for (const v of [-0.8, -0.4, 0, 0.4, 0.8]) f.rivet(add(add(tp(t), mul(nx, v * rad(t) * k)), mul(ax, RK * rad(t) * k * Math.sqrt(1 - v * v) + w)), 4.4, look === null ? P.steelL : '#9a8a64');
  };
  for (const [, t1] of secs) ringAt(t1, 1.1, 12, AGE({ fill: '#4a3a22', light: '#9a8460' }));
  for (const t of [0.14, 0.24]) ringAt(t, 1.16, 18, IRN({ fill: P.ironL, light: '#9aa0a8' })); // the iron clamp bands of the cradle
  // the rear cap, the eyepiece drawtube with its focus collar and oak knobs, and the black cup
  const rc = [...arc(0, -1.02, 1.02).map(q => add(q, mul(ax, 6))), ...arc(0, 1.02, -1.02).map((q, i) => add(q, mul(ax, -2 * RK * rad(0) * Math.sqrt(Math.max(0, 1 - Math.pow(1.02 - 2.04 * i / 12, 2))))))];
  f.part(rc, AGE({ fill: '#3a2c18' }));
  const ep0 = tp(0), ep1 = add(tp(0), mul(ax, -96)), cup = add(ep1, mul(ax, -14));
  f.part(limb(ep0, ep1, 56, 44, { steps: 3, capK: 0.2 }), AGE({}));
  f.part(limb(lerp(ep0, ep1, 0.4), lerp(ep0, ep1, 0.55), 72, 72, { steps: 2, capK: 0.2 }), AGE({ fill: '#7a6440', cast: false }));
  for (const sgn of [-1, 1]) { const kc = add(lerp(ep0, ep1, 0.47), mul(nx, sgn * 46)); f.part(ell(kc, 12, 12, 0, 10), OAK({ fill: '#a89070', cast: false })); }
  // the finder scope strapped alongside the top of the main tube
  f.bone('finder');
  const F0 = TP(0.3, -1.32), F1 = TP(0.56, -1.24);
  for (const t of [0.36, 0.5]) { const a = TP(t, -1.0), b = lerp(F0, F1, (t - 0.3) / 0.26); f.part(limb(a, b, 22, 22, { steps: 2, capK: 0.2 }), AGE({ fill: '#3a2c18', cast: false })); }
  f.part(limb(F0, F1, 56, 64, { steps: 4, capK: 0.15 }), AGE({}));
  W.clipDraw(f, limb(F0, F1, 56, 64, { steps: 4, capK: 0.15 }), () => { f.line([add(F0, mul(nx, -14)), add(F1, mul(nx, -16))], 3, '#a88e5c', { op: 0.5 }); f.line([add(F0, mul(nx, 16)), add(F1, mul(nx, 18))], 6, '#120c06', { op: 0.5 }); W.streaks(f, lerp(F0, F1, 0.5), 60, 4, 30, { col: '#1a120a', op: 0.4 }); });
  f.part(limb(add(F0, mul(ax, -30)), F0, 30, 40, { steps: 2, capK: 0.3 }), BLK());
  f.part(limb(F1, add(F1, mul(ax, 40)), 72, 76, { steps: 2, capK: 0.1 }), BLK());
  for (const t of [0.36, 0.5]) { const b = lerp(F0, F1, (t - 0.3) / 0.26); f.part(hard([add(b, add(mul(ax, -10), mul(nx, -36))), add(b, add(mul(ax, 10), mul(nx, -36))), add(b, add(mul(ax, 10), mul(nx, 36))), add(b, add(mul(ax, -10), mul(nx, 36)))]), IRN({ fill: P.ironL, inkW: 1.2, cast: false })); }
  rimeBark(f, [add(F0, mul(nx, -28)), add(F1, mul(nx, -32))], 8, -1);
  // the dew cap at the lens end: black-painted iron, hung with icicles; inside it, the objective seen nearly edge-on
  f.bone('dewcap');
  const dc0 = 0.87, dc1 = 1.0, DR = t => rad(t) + 18;
  const dcap = [add(tp(dc0), mul(nx, -DR(dc0))), add(tp(dc1), mul(nx, -DR(dc1))), add(tp(dc1), mul(nx, DR(dc1))), add(tp(dc0), mul(nx, DR(dc0))), add(tp(dc0), mul(ax, RK * DR(dc0)))];
  const ddc = f.part(hard(dcap), BLK());
  W.bevel(f, ddc, E.bbox(dcap), 8, { lite: '#8a8e96', lite2: '#c8ccd0', liteOp: 0.25 });
  W.clipDraw(f, dcap, () => { f.flat([TP(dc0, -0.72), TP(dc1, -0.72), TP(dc1, -0.5), TP(dc0, -0.5)], '#ffffff', { op: 0.12 }); f.flat([TP(dc0, 0.2), TP(dc1, 0.2), TP(dc1, 0.75), TP(dc0, 0.75)], '#000', { op: 0.35 }); f.flat([TP(dc0, 0.8), TP(dc1, 0.8), TP(dc1, 1), TP(dc0, 1)], '#6e7a7c', { op: 0.3 }); W.hoar(f, TP(0.94, -0.7), 100, 50, 0.9); f.scratches(TP(0.93, 0.2), 60, 6, '#8a8e96'); W.lichtenberg(f, TP(0.9, 0.0), tA, 160, 2.6, { metal: true, depth: 2 }); });
  const mc = add(tp(1), mul(ax, 6)), mR = DR(1), mk = 0.2;
  const mouth = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; mouth.push(add(mc, add(mul(ax, Math.cos(a) * mR * mk), mul(nx, Math.sin(a) * mR)))); }
  f.part(mouth, BLK({ fill: '#1a1a1e', cast: false, inkW: 2 }));
  const lc = add(mc, mul(ax, -14)), lens = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; lens.push(add(lc, add(mul(ax, Math.cos(a) * mR * 0.12), mul(nx, Math.sin(a) * (mR - 30))))); }
  W.glazed(f, lens, { axis: tA + Math.PI / 2, base: '#c8d4da', shadow: '#7a8a96', frost: 0.9, win: [-0.2, 0.05], crack: [add(lc, mul(nx, -(mR - 40))), add(lc, mul(nx, mR - 50))] });
  f.line(lens.slice(28, 40).concat(lens.slice(0, 6)), 5, '#8a7650', { op: 0.9 }); f.line(lens.slice(8, 22), 4, '#3a2c18');
  W.rimeCrust(f, [add(tp(dc0), mul(nx, -DR(dc0) - 2)), add(tp(dc1), mul(nx, -DR(dc1) - 2))], 14, [1, -0.3]);
  W.icicles(f, [add(tp(dc0), mul(nx, DR(dc0))), add(tp(dc1), mul(nx, DR(dc1)))], 10, 30, 90);
  W.icicles(f, [add(mc, mul(nx, mR * 0.5)), add(mc, mul(nx, mR * 0.95))], 3, 20, 50);
  f.bone('tube');
  rimeBark(f, [TP(0.02, -1.02), TP(0.3, -1.02), TP(0.6, -1.02), TP(0.86, -1.02)], 26, -1);
  W.icicles(f, [TP(0.03, 1.02), TP(0.3, 1.02), TP(0.6, 1.02), TP(0.86, 1.02)], 46, 30, 110, { wk: 0.18 });

  // ---- the declination cradle: an iron saddle, the gears fused into one scorched lump, the setting circle, a hand-wheel
  f.bone('pier');
  const sad = [add(CR, [-150, -170]), add(CR, [150, -150]), add(CR, [170, 120]), add(CR, [110, 200]), add(CR, [-110, 210]), add(CR, [-170, 120])];
  f.part(hard([sad[1], add(sad[1], [60, -30]), add(sad[2], [60, -30]), add(sad[3], [60, -30]), sad[3], sad[2]]), IRN({ fill: '#1e1e22' })); // the saddle's side face, receding
  f.part(hard([sad[0], add(sad[0], [60, -30]), add(sad[1], [60, -30]), sad[1]]), IRN({ fill: '#4a4a52' })); // its top face
  f.part(sad, IRN({ fill: '#3a3a40', light: '#6a6a72' }));
  W.clipDraw(f, sad, () => { W.hoar(f, add(CR, [100, -100]), 60, 60, 0.7); W.rivetRow(f, add(CR, [-140, -140]), add(CR, [140, -130]), 8, 5, P.steelL, { fused: 0.3 }); });
  const sc = add(CR, [-40, 120]), scR = 120, scK = 0.36;
  const scP = []; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; scP.push(add(sc, [Math.cos(a) * scR * scK, Math.sin(a) * scR])); }
  W.bplate(f, scP, AGE({ fill: '#5a4a32', light: '#8a7a58' }), { hard: false, bev: 4 });
  W.clipDraw(f, scP, () => { for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2, r1 = scR * (i % 6 ? 0.9 : 0.8); f.line([add(sc, [Math.cos(a) * scR * scK * 0.98, Math.sin(a) * scR * 0.98]), add(sc, [Math.cos(a) * r1 * scK, Math.sin(a) * r1])], 1, INK, { op: 0.7 }); } W.hoar(f, add(sc, [10, -60]), 30, 50, 0.8); W.lichtenberg(f, add(sc, [0, 40]), deg(80), 70, 1.6, { metal: true, depth: 2 }); f.line(scP.slice(30, 40), 2.4, VERD, { op: 0.6 }); });
  f.part(hard([add(sc, [-16, -22]), add(sc, [16, -22]), add(sc, [16, 22]), add(sc, [-16, 22])]), AGE({ fill: '#4e4030', inkW: 1.3, cast: false }));
  const gl2 = add(CR, [90, 60]);
  f.flat(ell(gl2, 120, 90, 0.3, 16), P.scorch, { op: 0.5 });
  W.gear(f, add(gl2, [-30, -20]), 70, 22, { a: 0.3, look: AGE({}) }); W.gear(f, add(gl2, [50, 30]), 54, 18, { a: 0.1, look: AGE({}), solid: true });
  f.part(W.lumpy(f, ell(add(gl2, [10, 10]), 70, 46, 0.4, 16), 14), AGE({ fill: mix('#5e4a2e', P.scorch, 0.45), inkW: 1.8 }));
  for (let i = 0; i < 6; i++) W.fusedBead(f, add(gl2, [-60 + i * 22, -10 + (i % 2) * 30]), 6);
  W.lichtenberg(f, gl2, deg(-20), 160, 3.4, { metal: true, depth: 3 }); W.lichtenberg(f, gl2, deg(150), 120, 3, { metal: true, depth: 2 });
  const hw = add(CR, [150, 160]);
  for (let i = 0; i < 4; i++) f.line([hw, add(hw, [Math.cos(i * 1.57 + 0.3) * 50 * 0.5, Math.sin(i * 1.57 + 0.3) * 50])], 6, P.ironL);
  const hwr = ell(hw, 25, 50, 0, 20); f.line(hwr.concat([hwr[0]]), 12, INK); f.line(hwr.concat([hwr[0]]), 8, P.ironL);
  f.part(limb(add(hw, [12, 46]), add(hw, [30, 90]), 18, 16, { steps: 3 }), OAK({ fill: '#b89a70', cast: false }));
  W.icicles(f, [add(CR, [-110, 210]), add(CR, [110, 200])], 7, 16, 46);

  // ---- the oak observing ladder at the rear, rungs worn hollow, on iron wheels
  f.bone('ladder');
  const lb0 = [90, gy - 20], lb1 = [360, gy - 20], lt0 = [150, 930], lt1 = [330, 930];
  for (const [a, b] of [[lb0, lt0], [lb1, lt1]]) f.part(limb(a, b, 30, 26, { steps: 6, capK: 0.2 }), OAK());
  for (let k2 = 1; k2 < 6; k2++) { const a = lerp(lb0, lt0, k2 / 6), b = lerp(lb1, lt1, k2 / 6); f.part(limb(a, b, 22, 22, { steps: 3, capK: 0.4 }), OAK({ fill: '#6a5840', cast: false })); f.flat(ell(lerp(a, b, 0.5), 40, 5, 0, 10), '#a89070', { op: 0.8 }); }
  const plat = hard([add(lt0, [-30, -4]), add(lt1, [40, -4]), add(lt1, [80, -30]), add(lt0, [10, -30])]);
  f.part(plat, OAK({ fill: '#6a5638' })); f.part(hard([add(lt0, [-30, -4]), add(lt1, [40, -4]), add(lt1, [40, 20]), add(lt0, [-30, 20])]), OAK({ cast: false }));
  for (const q of [lb0, lb1]) { f.part(ell(add(q, [0, 4]), 22, 22, 0, 12), IRN({ fill: P.ironL })); f.rivet(add(q, [0, 4]), 4, P.steelL); }
  W.rimeCrust(f, [add(lt0, [10, -30]), add(lt1, [80, -30])], 7, [1, -0.3]);
  W.icicles(f, [add(lt0, [-30, 20]), add(lt1, [40, 20])], 6, 10, 30);

  // ---- the night assistant, frozen at the eyepiece (a 1.0 human on the ladder platform)
  const H = 100, ag = lt0[1] - 30;
  const HC = add(cup, [-34, 8]), hA = tA;
  const N = [232, 420], C = [214, 510], Pv = [222, 600];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.12), EN = [262, 540], WN = [360, 560];
  const SF = S.at(0.32, 0.08), EF = [300, 450], WF = add(lerp(ep0, ep1, 0.5), mul(nx, 36));
  const HN = S.at(-0.14, 1.0), KN = [254, 760], AN = [232, ag - 54], HF = S.at(0.26, 0.98), KF = [270, 750], AF = [280, ag - 56];
  f.joint('pelvis', Pv, 'ladder').joint('torso', S.at(0, 0.86), 'pelvis').joint('head', S.at(0.1, -0.04), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('scarf', S.at(-0.2, -0.04), 'torso').joint('board', S.at(0.3, 0.3), 'torso');
  const QC = (o = {}) => Object.assign({ fill: '#5a6470', shadow: '#22282e', light: '#8a96a4', shade: 0.42, tex: 'quilt' + seed, texOp: 0.8 }, o);
  const hose = { fill: '#3e3e42', shadow: '#1a1a1e', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 };
  f.bone('thigh_f'); W.legTube(f, HF, KF, AF, [64, 48, 38], hose, '_f', { A: AF });
  f.bone('foot_f'); B.boot(f, AF, 1, 48, '#3a322a', { groundY: ag });
  f.bone('upperarm_f'); W.armRig(f, SF, EF, WF, [44, 38, 32], QC({ fill: '#4a545e' }), '_f');
  f.bone('hand_f'); { const gk = B.grip(f, WF, EF, ang(ep1, ep0), 26, P.skinI, { shadow: '#565c72', tex: 'mottle' + seed, texOp: 0.4, name: 'assistant focus knob' }); W.fistDetail(f, gk, 26 * 1.18, P.skinI, { wrinkle: false }); f.part(K.chain([lp(EF, WF, 0.8), lp(EF, WF, 1.0)], [34, 32]), W.WOOL(f, { fill: '#3e3e44', cast: false })); }
  f.bone('thigh_n'); W.legTube(f, HN, KN, AN, [66, 50, 40], Object.assign({}, hose, { fill: '#46464a' }), '_n', { A: AN });
  f.bone('foot_n'); B.boot(f, AN, 1, 50, '#40362e', { groundY: ag });
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.32], [0.06, 0.56, 0.5], [0.22, 0.6, 0.6], [0.45, 0.56, 0.56], [0.7, 0.52, 0.5], [0.9, 0.56, 0.52], [1.06, 0.6, 0.56]]);
  f.part(torso, QC());
  W.clipDraw(f, torso, () => { W.hoar(f, S.at(0.4, 0.3), 30, 50, 0.7); W.lichtenberg(f, S.at(0.1, 0.0), deg(100), 80, 2, { depth: 2, col: '#2a3036' }); });
  const sk = [S.at(-0.6, 0.84), S.at(0.56, 0.82), add(S.at(0.6, 1.1), [10, 40]), [288, 730, 1], [250, 722], [212, 736, 1], [180, 712], add(S.at(-0.66, 1.05), [-6, 30])];
  f.part(sk, QC({ fill: '#525c68' }));
  W.icicles(f, [[288, 730], [250, 722], [212, 736], [180, 712]], 5, 8, 22);
  f.part([S.at(-0.62, 0.8), S.at(0.58, 0.78), S.at(0.6, 0.87), S.at(-0.64, 0.89)], W.LEA(f, { sharp: true }));
  const dl = S.at(-0.5, 0.92);
  f.part(hard([add(dl, [-18, 0]), add(dl, [18, 0]), add(dl, [20, 56]), add(dl, [-20, 56])]), IRN({ fill: '#3a3a40' })); f.part(ell(add(dl, [0, -6]), 14, 8, 0, 10), IRN({ cast: false })); f.line([add(dl, [-12, 16]), add(dl, [12, 16])], 2, INK); f.line([add(dl, [-12, 40]), add(dl, [12, 40])], 2, INK); W.icicles(f, [add(dl, [-20, 56]), add(dl, [20, 56])], 2, 8, 16);
  f.bone('board');
  const lg = S.at(0.5, 0.5);
  W.rope(f, [S.at(0.2, 0.0), add(lg, [-20, -20])], 2, { col: '#4a3e34' });
  f.part(hard([add(lg, [-24, -26]), add(lg, [28, -30]), add(lg, [32, 50]), add(lg, [-22, 54])]), OAK({ fill: '#6a5638' })); f.part(hard([add(lg, [24, -28]), add(lg, [32, -30]), add(lg, [36, 50]), add(lg, [30, 52])]), { fill: '#d8d0bc', shade: 0.3, inkW: 1, cast: false });
  W.icicles(f, [add(lg, [-22, 54]), add(lg, [32, 50])], 2, 8, 16);
  f.bone('scarf');
  const so = S.at(-0.5, 0.0), scf = [S.at(-0.3, -0.06), S.at(0.3, -0.08), S.at(0.0, 0.06), add(so, [-60, -8]), add(so, [-120, -20]), add(so, [-150, -30], 1), add(so, [-146, -18]), add(so, [-166, -16], 1), add(so, [-152, -4]), add(so, [-170, 2], 1), add(so, [-148, 8]), add(so, [-158, 18], 1), add(so, [-120, 16]), add(so, [-60, 24])];
  f.part(scf, W.WOOL(f, { fill: '#8a98a6', shadow: '#36404c', light: '#c4d0da', k: 0.8 }));
  W.clipDraw(f, scf, () => { for (let i = 0; i < 4; i++) f.line([add(so, [-40 - i * 30, -10]), add(so, [-36 - i * 30, 20])], 2.4, '#4a5866', { op: 0.6 }); W.hoar(f, add(so, [-90, 0]), 50, 16, 0.7); });
  W.icicles(f, [add(so, [-60, 24]), add(so, [-140, 14])], 4, 8, 20);
  f.bone('head');
  f.part(limb(S.at(0.1, -0.04), add(HC, rot([-0.1 * H, 0.38 * H], hA)), 36, 32), W.SKI(f, { shadow: '#565c72' }));
  B.head(f, HC, H, hA, { skin: P.skinI, jaw: 0.96, chin: 0.0, nose: 1.0, mouth: 'set', squint: 0.6, faceShade: 0.8, jawShade: 0.4, eyeWhite: '#d8e2e8', iris: '#2a3038', hairCol: '#4a4038', browCol: '#3a3028' });
  const hF = frame(HC, hA, H);
  W.bristleRidge(f, hF([[-0.36, 0.0], [-0.34, -0.3], [-0.16, -0.48], [0.1, -0.5], [0.24, -0.4]]), 62, { up: [-0.1, -1], col: '#4a4038', w: 14, icicle: 0.6 });
  W.lichtenberg(f, hF([[-0.1, 0.3]])[0], deg(100), 60, 1.8, { depth: 2 });
  W.weld(f, hF([[0.2, -0.12], [0.3, -0.04]]), 4, { lich: false });
  f.bone('tube'); f.part(limb(ep1, cup, 50, 56, { steps: 2, capK: 0.3 }), BLK()); W.rimeCrust(f, [add(ep1, mul(nx, -26)), add(cup, mul(nx, -28))], 6, [1, -0.3]);
  const sm0 = TP(0.08, 0.9), sm1 = WN;
  f.part(limb(sm0, sm1, 14, 12, { steps: 6, capK: 0.3 }), W.ST(f, { fill: P.steelL }));
  f.part(limb(lerp(sm0, sm1, 0.86), add(sm1, mul(E.norm(sub(sm1, sm0)), 30)), 26, 24, { steps: 3, capK: 0.5 }), OAK({ fill: '#b89a70' }));
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [48, 42, 34], QC(), '_n');
  f.part(K.chain([lp(EN, WN, 0.8), lp(EN, WN, 1.0)], [36, 34]), W.WOOL(f, { fill: '#3e3e44', cast: false }));
  f.bone('hand_n');
  const gs = B.grip(f, WN, EN, ang(sm1, sm0), 28, P.skinI, { shadow: '#565c72', tex: 'mottle' + seed, texOp: 0.4, name: 'assistant handle' });
  W.fistDetail(f, gs, 28 * 1.18, P.skinI, { wrinkle: false });

  // ---- the dome-shutter chains hanging slack in front of the tube, out of the frame top
  f.bone('chains');
  W.chainLinks(f, [[1500, -10], [1520, 260], [1600, 560], [1700, 700], [1780, 760]], 24, P.ironL);
  W.chainLinks(f, [[980, -10], [960, 300], [1000, 600], [1060, 900], [1100, 1100]], 22, P.ironL);
  for (const q of [[1520, 300], [1000, 600]]) W.icicle(f, q, 20, 5);

  f.bone('root');
  f.flat(ell([700, gy + 4], 600, 16, 0, 20), '#000', { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ THE STILLED COLLEGE (ruler 3, frame-cropped)
// The college of astronomers, sitting in full chapter when the hour stopped: half of them rising from the benches to
// point at the sky, the lightning that came down the spire ran through every hand that held brass and fused each man to
// the next. A frozen surge of some thirty bodies heaped from the lecture-hall floor up and out of the frame top, leaning
// forward over the party like a wave about to break: a broken pyramid of men in clusters with gaps of ice between them,
// its weight in the broad base of fallen scholars pressed flat and faceted with ice like broken flagstones, the crest
// overhanging and cropped by the frame, heads and arms breaking its outline. Depth is staged: the men at the back of
// the heap are smaller and darker, sunk in the mass; the front lip of men rising out of the base is larger and lit. A
// forest of arms points up out of frame at one star. No two men alike: each has his own face, build, scale, beard, cap,
// gown and kit. Course marks: rime on the windward side of every arm, icicles plumb from elbows, sleeves and fingertips,
// faces frozen open-mouthed mid-argument, beards stiff, lips cracked and blue; burns branch across forearms and necks
// and run from one body into the next. Dress and gear: black gowns, pale blue hoods, square caps at odd angles; brass
// astrolabe, quadrant and dividers fused into hands; the cracked brass lectern on the crest with its chained book open;
// a chalk slate with a half-finished sum; spectacles frosted white; ink horns with the ink frozen into black icicles; the
// college mace held up by the dean, its brass head scorched; an hourglass with the sand stopped mid-fall; a torn star
// chart wound round four arms; oak bench splinters in the base; a fallen candle-stand; one bare foot without its shoe.
// The dean's old, furious face sits at the centre of the crest just under the frame line, forked beard frozen stiff,
// mouth open on "aye".
// Rig: mass (root); every man sN_torso > sN_head, sN_arm_n, sN_arm_f (arms pivot at the shoulder, so the attack swings
// every arm down at once); buried arms bN_arm; chart_arms (the four arms the star chart is wound round, and the chart,
// on one bone, so the chart stays pinned when they swing); lectern; mace on the dean's arm.
// Motion: idle creaks one arm down and back; attack swings every arm down to point at one hero.
function stilledCollege() {
  const seed = 1120, CW = 1800, CH = 1600, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY;
  const STAR = [1260, -900], toStar = p => ang(p, STAR) + (f.r() - 0.5) * 0.05;
  f.joint('mass', [800, 1400]);
  const OAK = (o = {}) => Object.assign({ fill: '#5e4c36', shadow: '#241c14', light: '#8e7a5c', shade: 0.42, tex: 'wood' + seed, texOp: 0.6 }, o);
  const FACES = [
    { jaw: 1.1, nose: 1.25, hook: 0.5, gaunt: true, browDown: 0.12, hairCol: '#8a8680' },
    { jaw: 1.2, nose: 1.0, hook: 0.0, browDown: -0.04, squint: 0.1, hairCol: '#5a5048' },
    { jaw: 0.95, nose: 1.15, hook: 0.3, gaunt: true, squint: 0.5, hairCol: '#a8a8a4' },
    { jaw: 1.28, chin: 0.04, nose: 0.95, browDown: 0.1, hairCol: '#4a4038' },
    { jaw: 1.0, nose: 1.3, hook: 0.6, squint: 0.2, hairCol: '#c8c8c4' },
    { jaw: 1.15, nose: 1.05, hook: -0.2, gaunt: true, browDown: 0.14, hairCol: '#6a625a' },
    { jaw: 0.92, nose: 1.1, hook: 0.1, squint: 0.6, browDown: -0.06, hairCol: '#3a3430' },
    { jaw: 1.22, nose: 1.2, hook: 0.4, squint: 0.0, hairCol: '#9a9690' },
  ];
  const BEARDS = ['long', 'short', null, 'stubble', 'long', null, 'short', 'stubble', 'long', null];
  const GOWNS = ['#262a32', '#22252c', '#2c2f38', '#1e2128', '#2a2c30', '#30333c'];
  const HOODS = ['#8aa2b6', '#7a94a8', '#9ab0c2', '#8098ac'];
  let n = 0;
  const sch = (P0, lean, o = {}) => {
    const i = n++, pre = `s${i}_`, sj = 0.95 + f.r() * 0.1;
    if (o.armF && o.armF.a !== undefined && !o.armF.hold && !o.armF.reach && i % 3 === 0) o.armF = Object.assign({}, o.armF, { sleeve: true }); // every third pointing arm keeps its sleeve
    const SKINS = ['#b4bcc2', '#a8b0ba', '#bec2c2', '#a2acb6', '#c4c6c4', '#9ca6b0', '#b8bab6'];
    return W.scholar(f, Object.assign({ P: P0, lean: Math.min(0.62, lean * 0.55) + (f.r() - 0.5) * 0.16, // upright enough to read as men rising; the wave leans by their stacking
      pre, parent: 'mass', face: Object.assign({}, FACES[i % FACES.length], o.face || {}), beard: BEARDS[i % BEARDS.length], gown: GOWNS[i % GOWNS.length], skin: SKINS[(i * 3) % SKINS.length], hood: HOODS[i % HOODS.length], cap: { a: (f.r() - 0.5) * 0.8, col: i % 3 ? '#1e2026' : '#2a2a30' }, build: { chest: 0.85 + f.r() * 0.35, belly: 0.8 + f.r() * 0.45, neck: 0.9 + f.r() * 0.3 }, patch: i % 4 === 1, inkhorn: i % 5 === 2 }, o, { s: (o.s ?? 1) * sj }));
  };
  const PT = (P0, d = 0, bend = 0.25) => ({ a: toStar(P0) + d, bend });
  const RCH = (a, o = {}) => Object.assign({ a, bend: 0.5, reach: true }, o);
  const INS = (kind, a) => ({ a, bend: 0.7, hold: (ff, Wr, aa, ss) => instrument(kind, Wr, aa, ss) });

  // ---------------------------------------------------------------- the frozen surge: a broken pyramid leaning forward
  f.bone('mass');
  const wave = [[110, gy], [190, 1380], [300, 1230], [360, 1120], [430, 1040], [520, 930], [600, 860], [650, 760], [740, 650], [820, 560], [880, 470], [960, 400], [1010, 300], [1080, 190], [1130, 70], [1180, -30], [1300, -30], [1350, 80], [1440, 200], [1540, 300], [1640, 420], [1720, 520], [1700, 610], [1610, 660], [1540, 700], [1490, 800], [1480, 960], [1530, 1140], [1580, 1340], [1630, gy]];
  f.part(wave, W.ROBE(f, { fill: '#171a20', shadow: '#08090c', light: '#343c4a', maxShade: 60 }));
  W.clipDraw(f, wave, () => {
    W.softTone(f, E.smooth(wave), [[[[1480, 640], [1700, 560], [1660, 700], [1500, 880]], '#000', 0.6, 30], [[[700, 600], [1100, 200], [1300, 200], [900, 700]], '#4a5a70', 0.22, 40]]);
    for (let i = 0; i < 46; i++) { const c = [150 + f.r() * 1450, 100 + f.r() * 1400], r = 30 + f.r() * 60, a0 = f.r() * 6.3, q = []; for (let m = 0; m < 4; m++) q.push(add(c, rot([r * (0.6 + f.r() * 0.5), 0], a0 + m * 1.57))); f.flat(hard(q), f.r() > 0.45 ? '#8a9cb0' : '#2a3442', { op: 0.28 }); f.line([q[0], q[1], q[2]], 1, INK, { op: 0.4, straight: true }); } // ice planes between the clusters
    for (let i = 0; i < 26; i++) { const c = [150 + f.r() * 1450, 200 + f.r() * 1300]; W.trough(f, [c, add(c, [8, 40 + f.r() * 40]), add(c, [4, 90 + f.r() * 40])], 10, { col: '#05060a', lite: '#4a5466', liteOp: 0.35, op: 0.5 }); } // frozen folds of buried gowns
    W.hoar(f, [1500, 520], 200, 160, 0.6); W.hoar(f, [800, 900], 260, 200, 0.4);
  });
  W.rimeCrust(f, [[650, 760], [740, 650], [820, 560], [880, 470], [960, 400], [1010, 300], [1080, 190], [1130, 70]], 10, [1, -0.3]);
  W.rimeCrust(f, [[1350, 80], [1440, 200], [1540, 300], [1640, 420], [1720, 520]], 12, [1, -0.3]);
  W.icicles(f, [[1720, 520], [1700, 610], [1610, 660], [1540, 700], [1490, 800]], 14, 22, 84); // the underside of the breaking crest

  // ---------------------------------------------------------------- the back of the heap: small, dark, sunk in the mass
  const BK = { s: 0.8, tone: 0.5, skirtL: 90 };
  sch([360, 1130], 0.3, Object.assign({}, BK, { armF: PT([360, 1130], 0.0, 0.1), armN: RCH(deg(-160), { curl: 0.5 }), hA: -0.6 }));
  sch([450, 980], 0.36, Object.assign({}, BK, { s: 0.76, armF: PT([450, 980], 0.03, 0.35), armN: null, hA: -0.7, specs: true }));
  sch([680, 700], 0.42, Object.assign({}, BK, { s: 0.82, armF: PT([680, 700], -0.02, 0.2), armN: PT([680, 700], 0.05, 0.05), hA: -0.5 }));
  sch([770, 590], 0.4, Object.assign({}, BK, { s: 0.74, armF: PT([770, 590], 0.0, 0.4), armN: null, hA: -0.8, cap: null }));
  sch([960, 420], 0.5, Object.assign({}, BK, { s: 0.78, armF: PT([960, 420], 0.02, 0.15), armN: RCH(deg(-40), { curl: 0.3 }), hA: -0.4 }));
  sch([1360, 260], 0.7, Object.assign({}, BK, { s: 0.84, tone: 0.4, armF: PT([1360, 260], 0.0, 0.3), armN: PT([1360, 260], 0.06, 0.1), hA: -0.3 }));

  // the cracked brass lectern carried up on the crest, its chained book frozen open (pages up, toward the men above)
  f.joint('lectern', [1240, 300], 'mass');
  f.bone('lectern');
  const lc = [1240, 300];
  f.part(limb(add(lc, [0, -10]), add(lc, [10, 200]), 30, 40, { steps: 6, capK: 0.3 }), W.BRD(f, { fill: P.brassD }));
  const desk = hard([add(lc, [-110, -20]), add(lc, [100, -60]), add(lc, [118, -36]), add(lc, [-96, 8])]);
  W.bplate(f, desk, W.BRD(f, {}), { bev: 4, lich: [[add(lc, [0, -20]), deg(-10), 100, 2.4]] });
  f.line([add(lc, [-20, 40]), add(lc, [10, 80]), add(lc, [-6, 130])], 2.4, INK, { op: 0.8 });
  const bk = [add(lc, [-90, -26]), add(lc, [-10, -58]), add(lc, [6, -40]), add(lc, [90, -70]), add(lc, [96, -54]), add(lc, [-84, -6])];
  f.part(bk, { fill: '#d8d0bc', shadow: '#6a6250', shade: 0.3, inkW: 1.3, cast: false, tex: 'rime' + seed, texOp: 0.3 });
  f.part(hard([add(lc, [-90, -26]), add(lc, [-84, -6]), add(lc, [-84, 2]), add(lc, [-92, -18])]), W.LEA(f, { fill: '#3a2a22', cast: false }));
  W.chainLinks(f, [add(lc, [-80, 0]), add(lc, [-60, 60]), add(lc, [-20, 90])], 8, P.ironL);
  W.rimeCrust(f, [add(lc, [-90, -30]), add(lc, [100, -72])], 7, [1, -0.3]);
  W.icicles(f, [add(lc, [-96, 8]), add(lc, [118, -36])], 6, 10, 28);

  // ---------------------------------------------------------------- the star chart, pinned: four arms on one bone
  f.bone('mass'); f.joint('chart_arms', [900, 560], 'mass'); f.bone('chart_arms');
  const CH4 = [[790, 520], [860, 470], [930, 440], [1010, 410]], FA = [];
  CH4.forEach((Sh, k) => {
    const a = toStar(Sh) + (k % 2 ? 0.08 : -0.06), E0 = add(Sh, rot([100, 0], a + 0.25)), W0 = add(E0, rot([96, 0], a - 0.1));
    f.part(K.chain([Sh, E0], [46, 40]), W.ROBE(f, { fill: '#1c1f25', shadow: '#0a0b0e' }));
    const fa = K.chain([lerp(E0, W0, -0.08), W0], [36, 28]); f.part(fa, W.SKI(f, { fill: '#9aa2aa', shadow: '#4a5064' }));
    W.clipDraw(f, fa, () => W.lichtenberg(f, lerp(E0, W0, 0.1), a, 80, 1.8, { depth: 2 }));
    const h = W.pointHand(f, W0, a, 56, W.SKI(f, { fill: '#9aa2aa', shadow: '#4a5064' })); W.icicle(f, add(h.fing[3].k3, [0, 2]), 9, 3);
    FA.push(lerp(E0, W0, 0.45));
  });
  const chp = [add(FA[0], [-60, 50]), ...FA.map((q, i) => add(q, [0, i % 2 ? -16 : 16])), add(FA[3], [70, -40])];
  const ch = W.spline(chp, 6), chart = W.ribbon(ch, t => 44 - t * 12);
  f.part(chart, { fill: '#c8c0a8', shadow: '#5a5446', light: '#ece6d4', shade: 0.4, tex: 'rime' + seed, texOp: 0.3, k: 0.8 });
  W.clipDraw(f, chart, () => { for (let i = 2; i < ch.length - 2; i += 3) { f.flat(ell(add(ch[i], [0, (i % 5) * 3 - 6]), 2.4, 2.4, 0, 6), '#2a2a30'); f.line([add(ch[i], [0, (i % 5) * 3 - 6]), add(ch[Math.min(ch.length - 1, i + 2)], [2, ((i + 2) % 5) * 3 - 6])], 0.9, '#3a3a44', { op: 0.7, dash: '3 2' }); } for (let i = 4; i < ch.length; i += 7) f.line([add(ch[i], [-4, -20]), add(ch[i], [2, 20])], 1, '#8a3a30', { op: 0.5 }); W.hoar(f, ch[Math.floor(ch.length / 2)], 120, 40, 0.6); });
  for (const q of FA) f.part(W.ribbon([add(q, [-24, -12]), add(q, [24, 8])], 28), { fill: '#b0a890', shadow: '#4a4438', shade: 0.4, inkW: 1.2, cast: false }); // the turns round each forearm
  for (const t of [0.12, 0.5, 0.9]) { const q = ch[Math.floor(t * (ch.length - 1))]; f.part(hard([add(q, [-10, 22]), add(q, [8, 26]), add(q, [2, 42]), add(q, [-14, 36])]), { fill: '#c0b8a0', shade: 0.3, inkW: 1, cast: false }); }
  W.icicles(f, ch.filter((_, i) => i % 3 === 0).map(q => add(q, [0, 20])), 7, 10, 24);

  // ---------------------------------------------------------------- the middle clusters, with ice between them
  sch([600, 1190], 0.5, { s: 0.94, tone: 0.2, skirtL: 140, armF: PT([600, 1190], 0.0, 0.35), armN: INS('quadrant', deg(-70)), hA: -0.45 });
  sch([720, 1060], 0.56, { s: 0.98, tone: 0.15, skirtL: 130, armF: PT([720, 1060], 0.03, 0.15), armN: INS('slate', deg(-60)), hA: -0.5 });
  sch([930, 890], 0.6, { s: 0.92, tone: 0.25, skirtL: 120, armF: PT([930, 890], -0.02, 0.4), armN: RCH(deg(-60), { curl: 0.3, spread: 0.3 }), hA: -0.3, specs: true });
  sch([1050, 770], 0.66, { s: 1.0, tone: 0.1, skirtL: 120, armF: PT([1050, 770], 0.02, 0.2), armN: INS('astrolabe', deg(-70)), hA: -0.25 });
  sch([1150, 900], 0.74, { s: 0.96, tone: 0.18, skirtL: 120, armF: PT([1150, 900], 0.05, 0.5), armN: null, hA: -0.6 });
  sch([1420, 560], 0.86, { s: 0.98, tone: 0.1, skirtL: 100, armF: PT([1420, 560], 0.04, 0.15), armN: RCH(deg(-10), { curl: 0.2, spread: 0.3 }), hA: -0.2 });
  sch([1560, 680], 1.05, { s: 1.0, skirtL: 80, armF: PT([1560, 680], 0.06, 0.4), armN: RCH(deg(20), { curl: 0.15, spread: 0.35 }), hA: -0.1, specs: true });
  sch([1360, 880], 0.9, { s: 0.98, tone: 0.12, skirtL: 120, armF: PT([1360, 880], 0.02, 0.5), armN: INS('hourglass', deg(-40)), hA: -0.1 });

  // ---------------------------------------------------------------- the dean, leaning out over the men below him
  const deanP = [1180, 470], deanL = 0.42;
  f.joint('mace', [0, 0], 'mass');
  const dean = sch(deanP, deanL, {
    s: 1.14, skirtL: 60, beard: 'forked', beardOver: true, hA: -0.22, cap: { a: -0.3, col: '#16181c' }, face: { jaw: 1.18, chin: 0.03, nose: 1.22, hook: 0.55, browDown: 0.18, browW: 0.07, squint: 0.45, age: true, gaunt: true, hairCol: '#d8dcdc', browCol: '#eef2f4', beardCol: '#dfe4e6' },
    armN: RCH(deg(-35), { curl: 0.55, spread: 0.1 }),
    armF: { a: toStar(deanP) - 0.08, bend: 0.2, hold: (ff, Wr, a) => {
      const up = rot([1, 0], a), m0 = add(Wr, mul(up, -150)), m1 = add(Wr, mul(up, 230));
      f.part(limb(m0, m1, 18, 22, { steps: 6, capK: 0.4 }), { fill: '#1e1a18', shadow: '#0a0808', light: '#5a524a', shade: 0.4, tex: 'wood' + seed, texOp: 0.5 });
      for (const t of [0.1, 0.6]) f.part(limb(lerp(m0, m1, t), lerp(m0, m1, t + 0.04), 28, 28, { steps: 2, capK: 0.3 }), W.BRD(f, { cast: false }));
      const hc = add(m1, mul(up, 40));
      f.part(W.lumpy(f, ell(hc, 46, 52, a, 16), 4), W.BRD(f, { fill: mix(P.brass, P.scorch, 0.4) }));
      for (const r of [0.0, 0.5, 1.0]) f.line(W.ringArc(hc, 46, 18, a + Math.PI / 2 + r * 0.6 - 0.3, 0, Math.PI, 12), 3, P.brassD);
      f.part(hard([add(hc, rot([-30, 40], a - Math.PI / 2)), add(hc, rot([-40, 70], a - Math.PI / 2)), add(hc, rot([-20, 56], a - Math.PI / 2)), add(hc, rot([0, 80], a - Math.PI / 2)), add(hc, rot([20, 56], a - Math.PI / 2)), add(hc, rot([40, 70], a - Math.PI / 2)), add(hc, rot([30, 40], a - Math.PI / 2))]), W.BRD(f, { fill: P.brassD, cast: false }));
      W.lichtenberg(f, hc, a + Math.PI, 120, 2.8, { metal: true, depth: 3 }); f.flat(ell(hc, 50, 56, a, 14), P.scorch, { op: 0.35 });
      const g = B.grip(f, Wr, add(Wr, rot([-90, 0], a + 0.9)), a, 40, '#b4bcc2', { shadow: '#525870', tex: 'mottle' + seed, texOp: 0.4 });
      W.fistDetail(f, g, 40 * 1.18, '#b4bcc2', {});
      W.icicles(f, [add(hc, [-40, 40]), add(hc, [30, 50])], 4, 12, 30);
    } },
  });
  f.flat(dean.hF([[0.16, 0.27], [0.27, 0.255], [0.33, 0.28], [0.32, 0.38], [0.22, 0.4], [0.17, 0.34]]), '#101014'); // the mouth, wide on "aye"

  // ---------------------------------------------------------------- the base: bodies pressed flat and faceted with ice
  f.bone('mass');
  const base = [[100, 1420], [300, 1340], [560, 1330], [820, 1310], [1080, 1310], [1320, 1320], [1500, 1360], [1580, 1440], [1520, gy], [100, gy]];
  f.part(base, { fill: '#3a404c', shadow: '#14161c', light: '#8a98a8', shade: 0.4, tex: 'crack' + seed, texOp: 0.6 });
  W.clipDraw(f, base, () => {
    for (const [c, a, l] of [[[300, 1450], -0.1, 300], [[700, 1410], 0.06, 340], [[1100, 1430], -0.04, 320], [[1400, 1470], 0.1, 220]]) {
      const b = [add(c, rot([-l / 2, -40], a)), add(c, rot([l / 2, -50], a)), add(c, rot([l / 2 + 20, 20], a)), add(c, rot([-l / 2, 50], a))];
      f.part(b, W.ROBE(f, { fill: '#22252c', shadow: '#0c0e12' }));
      f.part(ell(add(c, rot([l / 2 + 10, -20], a)), 44, 34, a, 12), W.SKI(f, { shadow: '#525870' }));
      f.line([add(c, rot([l / 2 + 20, -28], a)), add(c, rot([l / 2 + 40, -24], a))], 2, INK, { op: 0.6 }); f.flat(ell(add(c, rot([l / 2 + 30, -10], a)), 8, 5, a, 8), '#141418');
      f.part(ell(add(c, rot([-l / 4, -30], a)), 60, 24, a, 12), { fill: '#7a94a8', shadow: '#3a4a5c', shade: 0.4, inkW: 1.2 });
    }
    for (let i = 0; i < 26; i++) { const c = [140 + f.r() * 1400, 1350 + f.r() * 210], r = 40 + f.r() * 60, a0 = f.r() * 6.3, q = []; for (let k2 = 0; k2 < 5; k2++) q.push(add(c, rot([r * (0.6 + f.r() * 0.5), 0], a0 + k2 * 1.25))); f.part(hard(q), { fill: f.r() > 0.5 ? '#c8d6de' : '#9aaebe', shadow: '#4a5a6a', light: '#eef6fa', shade: 0.3, inkW: 1.4, hatch: false, cast: false, tex: 'rime' + seed, texOp: 0.4, opacity: 0.62 }); }
    W.frostCracks(f, [800, 1470], 700, 90, 14, 1.4);
    W.lichtenberg(f, [500, 1430], 0, 400, 3, { depth: 3 }); W.lichtenberg(f, [1000, 1450], deg(10), 380, 3, { depth: 3 });
  });
  for (const [a, b, w] of [[[180, 1390], [60, 1270], 26], [[640, 1360], [560, 1210], 30], [[1240, 1370], [1360, 1260], 28], [[900, 1350], [1000, 1230], 22]]) {
    f.part(limb(a, b, w, w * 0.7, { steps: 5, capB: false }), OAK());
    for (let k2 = 0; k2 < 4; k2++) { const d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; f.line([add(b, mul(nn, (k2 - 1.5) * w * 0.24)), add(add(b, mul(d, 14 + f.r() * 20)), mul(nn, (k2 - 1.5) * w * 0.3))], 3, '#8e7a5c'); }
    W.rimeCrust(f, [lp(a, b, 0.2, -w * 0.5), lp(a, b, 0.9, -w * 0.4)], 5, [1, -0.3]);
  }
  const cs0 = [1380, 1430], cs1 = [1700, 1210];
  f.part(limb(cs0, cs1, 18, 14, { steps: 6, capK: 0.3 }), W.IR(f, { fill: P.ironL }));
  f.part(ell(cs1, 40, 12, ang(cs0, cs1) + Math.PI / 2, 12), W.IR(f, {})); f.part(limb(cs1, add(cs1, rot([50, 0], ang(cs0, cs1))), 16, 14, { steps: 3 }), { fill: '#d8d0bc', shadow: '#6a6250', shade: 0.35, inkW: 1.2 });
  W.icicles(f, [add(cs1, [-30, 6]), add(cs1, [30, -6])], 3, 12, 30);
  const bf = [1560, 1310];
  B.bareFoot(f, bf, 1, 70, '#aab2b8', { groundY: bf[1] + 60, shadow: '#525870', tex: 'mottle' + seed });
  f.part(K.chain([add(bf, [-60, -10]), add(bf, [0, 0])], [56, 46]), W.WOOL(f, { fill: '#3e3e42', cast: false }));
  W.rimeCrust(f, [add(bf, [10, 10]), add(bf, [60, 30]), add(bf, [86, 50])], 5, [1, -0.3]);
  W.rimeCrust(f, [[100, 1420], [300, 1340], [560, 1330], [820, 1310], [1080, 1310], [1320, 1320], [1500, 1360]], 12, [1, -0.3]);

  // ---------------------------------------------------------------- buried arms thrust up out of the gaps
  [[520, 1240], [860, 1180], [1260, 1060], [1500, 980], [1250, 680], [560, 960]].forEach((Sh, k) => {
    const pre = `b${k}_`; f.joint(pre + 'arm', Sh, 'mass'); f.bone(pre + 'arm');
    const a = toStar(Sh) + (k % 2 ? 0.08 : -0.05), E0 = add(Sh, rot([110, 0], a + 0.25 - k * 0.04)), W0 = add(E0, rot([104, 0], a - 0.1)), dk = k > 3 ? 0.3 : 0.1;
    f.part(K.chain([Sh, E0], [50, 44]), W.ROBE(f, { fill: mix('#202329', '#000', dk), shadow: '#0c0e12' }));
    f.part([add(E0, [-16, -10]), add(E0, [18, 10]), add(E0, [8, 80]), add(E0, [-14, 96]), add(E0, [-26, 70])], W.ROBE(f, { fill: '#1a1d22', shadow: '#0a0b0e' }));
    const sk = W.SKI(f, { fill: mix('#b4bcc2', '#3a404e', dk), shadow: '#4a5064' });
    const fa = K.chain([lerp(E0, W0, -0.08), W0], [38, 30]); f.part(fa, sk);
    W.clipDraw(f, fa, () => W.lichtenberg(f, lerp(E0, W0, 0.1), a, 90, 2, { depth: 2 }));
    const h = W.pointHand(f, W0, a, 60, sk); W.icicle(f, add(h.fing[3].k3, [0, 2]), 10, 3);
    W.rimeCrust(f, [lp(Sh, E0, 0.3, -24), lp(E0, W0, 0.8, -16)], 5, [1, -0.3]); W.icicles(f, [add(E0, [-14, 96]), add(E0, [8, 80])], 2, 10, 22);
  });

  // ---------------------------------------------------------------- the front lip: men rising out of the base, larger and lit
  const FR = { tone: 0, skirtL: 70, gown: '#353a46', hood: '#a4bccc' };
  sch([500, 1470], 0.7, Object.assign({}, FR, { s: 1.18, armF: PT([500, 1470], 0.08, 0.45), armN: INS('dividers', deg(-50)), hA: -0.4 }));
  sch([800, 1450], 0.82, Object.assign({}, FR, { s: 1.24, armF: PT([800, 1450], 0.02, 0.2), armN: RCH(deg(-30), { curl: 0.3, spread: 0.3 }), hA: -0.2, specs: true }));
  sch([1130, 1440], 1.0, Object.assign({}, FR, { s: 1.2, armF: PT([1130, 1440], 0.06, 0.55), armN: RCH(deg(10), { curl: 0.3, spread: 0.3 }), hA: -0.1 }));
  sch([1400, 1420], 1.2, Object.assign({}, FR, { s: 1.16, armF: PT([1400, 1420], -0.05, 0.4), armN: RCH(deg(-20), { curl: 0.2, spread: 0.4 }), hA: 0.0 }));

  // ---------------------------------------------------------------- burns running from one body into the next
  f.bone('mass');
  for (const [p0, a, l] of [[[620, 1000], -0.4, 260], [[980, 760], 0.3, 240], [[1260, 820], -0.6, 220], [[760, 1180], 0.1, 300], [[1420, 1100], -0.3, 220]]) W.lichtenberg(f, p0, a, l, 2.6, { depth: 3, col: '#2a3a3a', op: 0.7 });
  f.bone('root');
  f.flat(ell([820, gy + 4], 760, 16, 0, 20), '#000', { op: 0.3 });
  return f;

  // instruments fused into the off hands: astrolabe, quadrant, dividers, chalk slate, hourglass
  function instrument(kind, Wr, a, s) {
    const g = B.grip(f, Wr, add(Wr, rot([-100, 0], a)), a - Math.PI / 2, 30 * s, '#b4bcc2', { shadow: '#525870', tex: 'mottle' + seed, texOp: 0.4, quiet: true });
    if (kind === 'astrolabe') { const c = add(Wr, [10, 60]); W.chainLinks(f, [Wr, add(c, [0, -40])], 6, P.brassL); const rim = ell(c, 24, 40, 0.1, 24); W.bplate(f, rim, W.BRD(f, {}), { hard: false, bev: 2 }); W.clipDraw(f, rim, () => { for (const t of [0.6, 2.2, 3.8, 5.0]) f.line([add(c, rot([6, 0], t)), add(c, rot([30, 0], t))], 2, P.brassD); f.line([add(c, [-18, 30]), add(c, [18, -30])], 4, P.brassD); }); W.fusedBead(f, add(Wr, [4, 14]), 4); }
    if (kind === 'quadrant') { const c = add(Wr, [0, 10]); const q = [c, add(c, [80, 10]), add(c, [72, 44]), add(c, [50, 70]), add(c, [16, 84])]; W.bplate(f, q, W.BRD(f, {}), { hard: false, bev: 2 }); for (let i = 0; i < 9; i++) { const t = 0.1 + i * 0.16; f.line([add(c, rot([76, 0], t)), add(c, rot([66, 0], t))], 1, INK); } f.line([add(c, [4, 4]), add(c, [4, 70])], 1, INK); W.fusedBead(f, add(Wr, [10, 6]), 4); }
    if (kind === 'dividers') { f.part(hard([add(Wr, [-4, 0]), add(Wr, [4, 0]), add(Wr, [-20, 110]), add(Wr, [-24, 108])]), W.ST(f, { cast: false })); f.part(hard([add(Wr, [-4, 0]), add(Wr, [4, 0]), add(Wr, [36, 104]), add(Wr, [32, 108])]), W.ST(f, { cast: false })); W.fusedBead(f, Wr, 5); }
    if (kind === 'slate') { const c = add(Wr, [0, 80]); W.rope(f, [Wr, add(c, [-30, -50]), add(c, [0, -60]), add(c, [30, -50])], 2, { col: '#5a4c3e' }); const sl = hard([add(c, [-50, -50]), add(c, [50, -54]), add(c, [54, 46]), add(c, [-46, 50])]); f.part(sl, OAK({ fill: '#5e4c36' })); const ins = hard([add(c, [-40, -40]), add(c, [40, -44]), add(c, [44, 36]), add(c, [-36, 40])]); f.part(ins, { fill: '#2a2e32', shadow: '#121416', shade: 0.3, inkW: 1, cast: false }); digits(f, add(c, [-34, -30]), '1477', 14, '#e8ecea', { w: 1.8 }); digits(f, add(c, [-34, -6]), '388', 14, '#e8ecea', { w: 1.8 }); f.line([add(c, [-34, 16]), add(c, [34, 14])], 1.6, '#e8ecea'); digits(f, add(c, [6, 20]), '9', 14, '#e8ecea', { w: 1.8 }); W.hoar(f, add(c, [20, -30]), 30, 20, 0.6); W.icicles(f, [add(c, [-46, 50]), add(c, [54, 46])], 3, 8, 20); }
    if (kind === 'hourglass') { const c = add(Wr, [0, 96]); W.chainLinks(f, [Wr, add(c, [0, -60])], 7, P.brassL); f.part(hard([add(c, [-30, -60]), add(c, [30, -60]), add(c, [30, -52]), add(c, [-30, -52])]), OAK()); f.part(hard([add(c, [-30, 52]), add(c, [30, 52]), add(c, [30, 60]), add(c, [-30, 60])]), OAK()); const gl = [add(c, [-24, -52]), add(c, [24, -52]), add(c, [4, -2]), add(c, [24, 52]), add(c, [-24, 52]), add(c, [-4, -2])]; f.part(gl, { fill: '#b4ccda', shadow: '#4a5a6a', shade: 0.3, inkW: 1.2, cast: false, hatch: false }); f.flat([add(c, [-18, -38]), add(c, [18, -38]), add(c, [3, -6]), add(c, [-3, -6])], '#c8b896'); f.line([add(c, [0, -6]), add(c, [0, 30])], 1.6, '#c8b896'); f.flat([add(c, [-20, 52]), add(c, [20, 52]), add(c, [8, 40]), add(c, [-8, 40])], '#c8b896'); for (const x of [-28, 28]) f.line([add(c, [x, -52]), add(c, [x, 52])], 3, P.wood); W.hoar(f, add(c, [10, -20]), 16, 24, 0.7); }
    W.fistDetail(f, g, 30 * 1.18 * s, '#b4bcc2', {});
  }
}

module.exports = {
  heroes: [
    { key: 'the_stilled_college', name: 'The Stilled College', tier: 'ruler', w: 1800, h: 1600, flip: true, build: stilledCollege },
    { key: 'the_great_refractor', name: 'The Great Refractor', tier: 'ruler', w: 2200, h: 1600, flip: true, build: greatRefractor },
    { key: 'ephemeris_clerk', name: 'Ephemeris Clerk', tier: 'human', w: 760, h: T.human[1], flip: true, build: ephemerisClerk },
    { key: 'the_patroness', name: 'The Patroness', tier: 'human', w: 900, h: T.human[1], flip: true, build: patroness },
    { key: 'clock_jack', name: 'Clock Jack', tier: 'human', w: 800, h: 940, flip: true, build: clockJack },
    { key: 'speculum_bearer', name: 'Speculum Bearer', tier: 'large', w: 1300, h: T.large[1], flip: true, build: speculumBearer },
    { key: 'gate_mastiff', name: 'Gate Mastiff', tier: 'large', w: 1300, h: T.large[1], flip: true, build: gateMastiff },
    { key: 'patroness_monkey', name: "The Patroness's Monkey", tier: 'small', w: T.small[0], h: T.small[1], flip: true, build: monkey },
    { key: 'college_tortoise', name: 'The College Tortoise', tier: 'small', w: T.small[0], h: T.small[1], flip: true, build: collegeTortoise },
    { key: 'the_rodwarden', name: 'The Rodwarden', tier: 'elite', w: 1300, h: 1500, flip: true, build: rodwarden },
    { key: 'the_gin_ox', name: 'The Gin Ox', tier: 'elite', w: 2300, h: 1400, flip: true, build: ginOx },
  ],
};
