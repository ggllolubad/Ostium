// Direction C: "Living Ink". Evolved manuscript crosshatch, 7 heads, heavy natural builds, calm dignified poses.
'use strict';
const E = require('./engine');
const B = require('./body');
const G = require('./gear');
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;

const INK = '#1a120c';
const base = seed => ({ mode: 'ink', seed, ink: INK, shadowTint: '#2a1f2a', keyTint: '#fff3d8', rim: null, grimeY: 640, groundY: 790, mud: '#3a2a18', wobble: 1.8, inkW: 1.6, inkHeavy: 3.6 });

// ------------------------------------------------------------------ BULWARK: "The Sentinel"
// At rest and listening: hands stacked on the planted mace, the door leaning on his shoulder.
function bulwark() {
  const f = new Fig(base(31));
  const H = 96;
  const steel = '#8f959c', steelD = '#656a72', oak = '#6b4c2e', wool = '#4a4038', fur = '#5b4a38', red = '#9a2a1e', mail = '#6c7074';
  const N = [272, 262], C = [270, 356], P = [252, 470];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.55, 0.15), SF = S.at(0.5, 0.12);
  const HN = S.at(-0.3, 1.0), HF = S.at(0.32, 0.98);
  const KN = [228, 620], AN = [222, 748], KF = [324, 612], AF = [350, 746];
  const EN = [206, 402], WN = [276, 512];
  const EF = [352, 334], WF = [380, 258];

  // heavy wool mantle hanging down the back
  f.part([S.at(-0.6, -0.08), S.at(0.2, -0.1), S.at(-0.3, 0.3), [196, 520], [178, 650], [160, 690, 1], [190, 680], [206, 700, 1], [222, 660], S.at(-0.6, 0.6), S.at(-0.95, 0.3)], { fill: wool, tex: 'weave31', texOp: 0.5 });
  for (const q of [[[190, 330], [176, 480], [170, 660]], [[214, 340], [200, 500], [196, 680]]]) f.stroke(q, 2.4);
  // far arm up to the door's top edge (behind the door)
  f.part(limb(SF, EF, 44, 36), { fill: mail, tex: 'mail31', texOp: 0.9 });
  f.part(limb(EF, WF, 38, 30), { fill: steelD });
  // legs, weight on the near leg
  f.part(limb(HF, KF, 64, 44, { q: [[0.35, 0.12, 0.2]] }), { fill: mail, tex: 'mail31', texOp: 0.9 });
  f.part(plate(HF, KF, 0.45, 0.95, 54, 46, { bow: 3 }), { fill: steel });
  f.part(limb(KF, AF, 44, 30), { fill: steelD });
  f.part(plate(KF, AF, 0.05, 0.92, 46, 34, { bow: 3 }), { fill: steel });
  G.poleyn(f, KF, 0.1, 30, steel, steelD);
  B.boot(f, AF, 1, 54, '#6e737a', { shaft: 0.2, style: 'sabaton', toe: 1.15 });
  f.part(limb(HN, KN, 66, 46, { p: [[0.35, 0.12, 0.2]] }), { fill: mail, tex: 'mail31', texOp: 0.9 });
  f.part(plate(HN, KN, 0.45, 0.95, 56, 48, { bow: 3 }), { fill: steel });
  f.part(limb(KN, AN, 46, 30), { fill: steelD });
  f.part(plate(KN, AN, 0.05, 0.92, 48, 34, { bow: 3 }), { fill: steel });
  G.poleyn(f, KN, -0.1, 31, steel, steelD);
  B.boot(f, AN, 1, 54, '#7a7f86', { shaft: 0.2, style: 'sabaton', toe: 1.15 });
  // torso in mail and a torn surcoat
  f.part(S.shape([[-0.06, 0.36, 0.34], [0.06, 0.85, 0.55], [0.2, 0.95, 0.85], [0.42, 0.88, 0.88], [0.66, 0.75, 0.8], [0.88, 0.8, 0.76], [1.04, 0.82, 0.7], [1.12, 0.65, 0.55]]), { fill: mail, tex: 'mail31', texOp: 0.9 });
  f.part([S.at(-0.6, 0.12), S.at(0.7, 0.12), S.at(0.82, 0.6), S.at(0.85, 0.95), [344, 590], [320, 612, 1], [300, 586], [276, 628, 1], [256, 590], [232, 616, 1], [214, 584], S.at(-0.85, 0.95), S.at(-0.75, 0.6)], { fill: '#cbbd9e', tex: 'weave31', texOp: 0.5, k: 0.7, over: `<rect x="150" y="250" width="260" height="400" fill="url(#mottle31)" opacity="0.8"/><rect x="150" y="470" width="260" height="170" fill="url(#surdirt31)"/>` });
  f.defs.push(`<linearGradient id="surdirt31" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a18" stop-opacity="0"/><stop offset="0.6" stop-color="#3a2a18" stop-opacity="0.35"/><stop offset="1" stop-color="#2a1d10" stop-opacity="0.7"/></linearGradient>`);
  f.flat([S.at(-0.6, 0.35), S.at(-0.3, 0.32), S.at(-0.32, 0.48), S.at(-0.62, 0.5)], '#8a7a5a', { op: 0.55 }); // darned patch
  f.stitches([S.at(-0.6, 0.35), S.at(-0.3, 0.32), S.at(-0.32, 0.48), S.at(-0.62, 0.5), S.at(-0.6, 0.35)], '#3a2a18', 1);
  f.part([S.at(-0.15, 0.12), S.at(0.15, 0.12), S.at(0.2, 0.95), [290, 600], [280, 618, 1], [268, 598], S.at(-0.1, 0.95)], { fill: red, tex: 'weave31', texOp: 0.4, k: 0.6 }); // rubric stripe down the surcoat
  f.line([S.at(0.38, 0.3), S.at(0.38, 0.55)], 3.4, '#2a1f18'); // key sigil
  f.line(ell(S.at(0.38, 0.26), 7, 7, 0, 10).concat([ell(S.at(0.38, 0.26), 7, 7, 0, 10)[0]]), 3, '#2a1f18');
  f.line([S.at(0.38, 0.5), S.at(0.5, 0.5)], 3, '#2a1f18');
  for (const q of [[[230, 470], [226, 540], [218, 600]], [[330, 470], [336, 540], [340, 590]]]) f.stroke(q, 2);
  f.flat([[300, 540], [330, 560], [326, 580], [296, 560]], '#5a2a1a', { op: 0.5 }); // old blood stain
  f.flat([[214, 584], [344, 590], [340, 618], [216, 620]], '#3a2a18', { op: 0.35 });
  // sword belt and badge
  f.part([S.at(-0.85, 0.84), S.at(0.85, 0.82), S.at(0.86, 0.9), S.at(-0.86, 0.92)], { fill: '#3a2618', sharp: true });
  f.part([S.at(0.0, 0.82), S.at(0.16, 0.82), S.at(0.16, 0.92), S.at(0.0, 0.92)], { fill: '#a08858', sharp: true });
  f.line([S.at(-0.5, 0.9), S.at(-0.48, 0.98), S.at(-0.5, 1.04)], 1.4, '#2b2119');
  G.badge(f, S.at(-0.5, 1.04), 10, '#74777b', 0.05);
  // fur collar on the mantle
  f.part([S.at(-1.0, 0.05), S.at(-0.6, -0.14), S.at(0.0, -0.16), S.at(0.6, -0.06), S.at(0.75, 0.1), S.at(0.3, 0.12), S.at(-0.4, 0.2), S.at(-0.95, 0.24)], { fill: fur, tex: 'hatch31', texOp: 0.5 });
  for (let i = 0; i < 9; i++) f.stroke([S.at(-0.9 + i * 0.19, 0.0), S.at(-0.86 + i * 0.19, 0.12), S.at(-0.9 + i * 0.19, 0.2)], 2, '#2a2016');
  // helm, slightly bowed, listening; bevor at the chin
  const HC = [292, 216], hF = frame(HC, 0.2, 112);
  f.part(hF([[-0.44, -0.48], [-0.1, -0.58, 1], [0.3, -0.58, 1], [0.44, -0.36], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [-0.3, 0.53], [-0.46, 0.38, 1], [-0.48, -0.1]]), { fill: steel, k: 0.8 });
  f.part(hF([[0.2, -0.58, 1], [0.3, -0.58, 1], [0.44, -0.36], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [0.22, 0.53, 1], [0.24, 0.1]]), { fill: steelD, inkW: 1.3 });
  f.flat(hF([[-0.02, -0.17], [0.21, -0.17], [0.21, -0.08], [-0.02, -0.09]]), '#0a0705', { sharp: true });
  f.flat(hF([[0.27, -0.17], [0.46, -0.17], [0.46, -0.09], [0.27, -0.09]]), '#0a0705', { sharp: true });
  f.part(hF([[0.21, -0.36], [0.27, -0.36], [0.28, 0.5], [0.22, 0.5]]), { fill: '#9aa0a8', inkW: 1 });
  f.part(hF([[-0.47, -0.32], [0.45, -0.34], [0.46, -0.25], [-0.48, -0.23]]), { fill: steelD, inkW: 1.2, sharp: true });
  for (let i = 0; i < 6; i++) f.rivet(hF([[-0.38 + i * 0.16, -0.285]])[0], 2.5);
  // cross of breaths and a small brass saint's medal riveted to the brow
  for (let r = 0; r < 4; r++) f.flat(hF(ell([0.36, 0.05 + r * 0.08], 0.013, 0.017, 0, 6)), '#0a0705');
  for (let c = 0; c < 3; c++) f.flat(hF(ell([0.3 + c * 0.06, 0.2], 0.013, 0.017, 0, 6)), '#0a0705');
  f.part(hF([[-0.2, -0.47], [-0.16, -0.47], [-0.16, -0.42], [-0.1, -0.42], [-0.1, -0.38], [-0.16, -0.38], [-0.16, -0.3], [-0.2, -0.3], [-0.2, -0.38], [-0.26, -0.38], [-0.26, -0.42], [-0.2, -0.42]]), { fill: '#b89a4a', inkW: 1, sharp: true }); // brass cross riveted to the brow
  f.scratches(hF([[0.0, 0.2]])[0], 20, 6, '#f4efe2');
  // near pauldron
  G.pauldron(f, add(SN, [8, -2]), 42, -0.32, steel, steelD, 3);
  // near arm down to the stacked hands on the pommel
  f.part(limb(SN, EN, 46, 38), { fill: mail, tex: 'mail31', texOp: 0.9 });
  f.part(plate(SN, EN, 0.3, 0.85, 46, 40, { bow: 3 }), { fill: steel });
  f.part(limb(EN, WN, 40, 32), { fill: steelD });
  f.part(plate(EN, WN, 0.12, 0.85, 42, 34, { bow: 2 }), { fill: steel });
  G.poleyn(f, EN, -2.4, 24, steel, steelD);
  // the door, planted and leaning on his far shoulder
  const TL = [354, 254], TR = [474, 244], BR = [488, 766], BL = [372, 774];
  f.part([[340, 262], TL, BL, [358, 778]], { fill: '#3a2818', sharp: true });
  f.part([TL, TR, BR, BL], { fill: oak, tex: 'wood31', texOp: 0.7, sharp: true });
  for (let i = 1; i < 4; i++) { const t = i / 4; f.line([lerp(TL, TR, t), lerp(BL, BR, t)], 2, INK, { straight: true }); }
  for (const y of [320, 510, 700]) {
    f.part([[346, y - 9], [452, y - 20], [474, y - 11], [452, y + 2], [346, y + 13]], { fill: '#2f2f31', sharp: true, inkW: 1.4 });
    for (let k = 0; k < 4; k++) f.rivet([360 + k * 26, y + 1 - k * 2.4], 2.6, '#777');
  }
  f.part([[362, 560], [384, 558], [386, 610], [364, 612]], { fill: '#2f2f31', sharp: true });
  f.flat([[371, 576], [376, 576], [377, 592], [370, 592]], '#000');
  f.line(ell([446, 430], 14, 20, 0.1, 18).concat([ell([446, 430], 14, 20, 0.1, 18)[0]]), 4, '#2b2b2b');
  // a prayer cut into the door: lines of script
  for (let i = 0; i < 4; i++) f.line([[390, 372 + i * 12], [446 - (i % 2) * 8, 366 + i * 12]], 1.2, '#2a1a0e', { dash: '5 2 2 2', op: 0.8 });
  // rubric strip tied round the ring and blood on the lower planks
  f.part([[452, 446], [462, 448], [468, 500], [460, 540], [452, 538], [458, 498]], { fill: red, inkW: 1.2 });
  f.spatter([420, 680], 36, 20);
  // the far hand is behind the door: gauntlet fingers hooked over its top edge
  G.fingersOver(f, [364, 246], [0.995, -0.085], [0.06, 1], 28, steel, 4);
  // mace planted head-down, hands stacked on the pommel
  const mTop = [286, 486], mHead = [300, 754];
  f.part(limb(mTop, mHead, 13, 12, { steps: 6 }), { fill: '#3b2a1c', tex: 'wood31' });
  for (let i = 0; i < 4; i++) f.line([lp(mTop, mHead, 0.02 + i * 0.03, -7), lp(mTop, mHead, 0.04 + i * 0.03, 7)], 1.4, '#1a120b', { straight: true });
  G.maceHead(f, mHead, Math.PI / 2 - 0.05, 26, '#5a5d62');
  f.part([add(mTop, [-9, 2]), add(mTop, [-7, -10]), add(mTop, [0, -15]), add(mTop, [7, -10]), add(mTop, [9, 2]), add(mTop, [0, 6])], { fill: '#6a6a6a', k: 0.7 }); // pommel
  f.line([lp(mTop, mHead, 0.12, -6), [262, 560], [268, 586], lp(mTop, mHead, 0.14, 7)], 2, '#2a1a10'); // wrist loop hanging
  B.fist(f, add(WN, [6, 0]), -0.05, 25, steel, { plate: true, cuff: true });
  return f;
}

// ------------------------------------------------------------------ DUELIST: "The Widow's Blade"
// Classic line: arm and blade one straight bar at the enemy's throat, chin up, off hand open behind for balance.
// Built heavy: wide hips, thick thighs, low stance with the front knee over the foot. Nothing lanky.
function duelist() {
  const f = new Fig(base(32));
  const H = 94;
  const jerk = '#5e2a22', jerkD = '#47201a', shirt = '#cfc4ac', breech = '#4a4038', boot = '#3d2c1e', steel = '#cdd3d9', skin = '#d2a688', mail = '#7a7e84', red = '#a82a1e', cloak = '#3e4238';
  const N = [258, 286], C = [284, 388], P = [270, 488];
  const S = B.spine(N, C, P, H);
  const SN = S.at(0.12, 0.12), SF = S.at(-0.36, 0.1);
  const HN = S.at(0.2, 1.0), HF = S.at(-0.25, 0.98);
  const KN = [362, 616], AN = [378, 748], KF = [196, 630], AF = [146, 750];
  const EN = [346, 314], WN = [414, 308];
  const EF = [184, 296], WF = [170, 232];

  // braid falling down the back, tied with a rubric strip
  f.part([[244, 200], [224, 228], [206, 294], [206, 372], [222, 376], [224, 302], [242, 240], [256, 214]], { fill: '#3a2414', tex: 'hatch32', texOp: 0.4 });
  for (let i = 0; i < 6; i++) f.line([[208, 252 + i * 20], [226, 262 + i * 20]], 1.4, INK);
  f.part([[202, 368], [228, 368], [230, 384], [200, 384]], { fill: red, sharp: true, inkW: 1.2 });
  f.part([[208, 384], [200, 418], [210, 420], [216, 386]], { fill: red, inkW: 1.1 });
  f.part([[222, 384], [230, 412], [238, 408], [228, 384]], { fill: mix(red, '#000', 0.2), inkW: 1.1 });
  // capelet over the far shoulder, hanging down the back to the hip, weighted hem, frayed
  f.part([S.at(0.1, -0.06), S.at(-0.4, -0.08), S.at(-0.78, 0.1), [168, 400], [150, 470], [162, 500, 1], [178, 482], [192, 506, 1], [206, 480], [222, 498, 1], [230, 452], S.at(-0.5, 0.5), S.at(-0.2, 0.3), S.at(0.15, 0.1)], { fill: cloak, tex: 'weave32', texOp: 0.4, k: 0.8 });
  for (const q of [[[196, 330], [176, 420], [170, 490]], [[222, 340], [206, 430], [206, 496]]]) f.stroke(q, 2.2);
  f.line([[160, 494], [226, 494]], 1, '#cfc4ac', { op: 0.4, dash: '2 3' });
  // far arm raised behind, open hand for balance; bandaged forearm
  f.part(limb(SF, EF, 38, 32, { p: [[0.4, 0.18, 0.2]], folds: [[0.85, 'p', 0.3]] }), { fill: shirt, tex: 'weave32' });
  f.part(limb(EF, WF, 34, 26, { q: [[0.25, 0.25, 0.2]] }), { fill: shirt, tex: 'weave32' });
  for (let i = 0; i < 4; i++) f.part([lp(EF, WF, 0.3 + i * 0.13, -15), lp(EF, WF, 0.38 + i * 0.13, -15), lp(EF, WF, 0.33 + i * 0.13, 15), lp(EF, WF, 0.25 + i * 0.13, 15)], { fill: '#ddd2ba', shade: 0.35, inkW: 1, inkHeavy: 1.4, cast: false });
  f.flat(ell(lp(EF, WF, 0.5, 4), 5, 3, 0.5, 8), '#6a1a12', { op: 0.6 }); // blood seeping through the bandage
  B.hand(f, add(WF, [-2, -16]), -1.45, 22, skin, { spread: 0.55, curl: 0.28 });
  // far leg back and braced, knee soft
  f.part(limb(HF, KF, 70, 46, { q: [[0.3, 0.18, 0.2]], p: [[0.35, 0.12, 0.2]], folds: [[0.86, 'q', 0.3]] }), { fill: breech, tex: 'weave32', texOp: 0.35 });
  f.part(limb(KF, AF, 46, 30, { q: [[0.25, 0.3, 0.16]] }), { fill: boot, tex: 'mottle32' });
  B.boot(f, AF, 1, 50, boot, { tex: 'mottle32', knee: add(KF, [-2, 10]), kneeW: 46, cuff: true, toe: 1.2 });
  // torso: fitted jerkin, wide hips, high collar
  f.part(S.shape([[-0.05, 0.3, 0.3], [0.06, 0.58, 0.46], [0.22, 0.56, 0.68], [0.42, 0.48, 0.6], [0.62, 0.46, 0.5], [0.85, 0.66, 0.62], [1.04, 0.76, 0.66], [1.12, 0.6, 0.5]]), { fill: jerk, tex: 'mottle32' });
  // jerkin skirt: flared panels to mid-thigh, split at the sides
  f.part([S.at(-0.62, 0.84), S.at(0.62, 0.82), [348, 540], [336, 566, 1], [312, 552], [296, 572, 1], [270, 556], [240, 574, 1], [218, 556], [196, 548, 1]], { fill: jerkD, tex: 'mottle32', k: 0.6 });
  for (const x of [262, 300]) f.line([[x - 4, 506], [x, 560]], 1.4, INK, { op: 0.7 });
  f.stitches([[200, 544], [240, 568], [270, 552], [296, 566], [334, 560]], '#c7a864', 0.9);
  f.part([S.at(-0.3, -0.12), S.at(0.3, -0.12), S.at(0.38, 0.02), S.at(-0.36, 0.06)], { fill: jerkD, sharp: true }); // high collar
  f.line([S.at(0.36, 0.06), S.at(0.6, 0.3), S.at(0.45, 0.62), S.at(0.42, 0.82)], 1.6, INK);
  for (let i = 0; i < 8; i++) f.line([S.at(0.5 - i * 0.012, 0.18 + i * 0.08), S.at(0.6 - i * 0.012, 0.2 + i * 0.08)], 1.4, '#c7a864'); // laces
  f.scratches(S.at(0.1, 0.45), 18, 4, '#d8b8a0', 0.8);
  // belt with two pouches, badge, main gauche at the back hip
  f.part([S.at(-0.66, 0.78), S.at(0.62, 0.76), S.at(0.64, 0.85), S.at(-0.68, 0.87)], { fill: '#1e1610', sharp: true });
  f.part(ell(S.at(-0.1, 0.815), 6, 6), { fill: '#b59a5e' });
  f.part([S.at(0.22, 0.84), S.at(0.46, 0.83), S.at(0.46, 1.02), S.at(0.24, 1.04)], { fill: '#4a3424', tex: 'mottle32', k: 0.5 });
  f.part([S.at(0.21, 0.83), S.at(0.47, 0.82), S.at(0.46, 0.9), S.at(0.22, 0.91)], { fill: '#3a281a', k: 0.5, inkW: 1.2 });
  f.rivet(S.at(0.34, 0.89), 2, '#b59a5e');
  f.line([S.at(0.0, 0.86), S.at(0.04, 0.95)], 1.2, '#2b2119');
  G.badge(f, S.at(0.04, 0.95), 9, '#74777b', 0.15);
  f.part([S.at(-0.56, 0.82), S.at(-0.42, 0.84), [196, 606], [184, 602]], { fill: '#1e1610', sharp: true });
  f.part([S.at(-0.58, 0.72), S.at(-0.4, 0.74), S.at(-0.42, 0.82), S.at(-0.58, 0.8)], { fill: '#8a8478', sharp: true });
  // near leg forward, knee over the foot
  f.part(limb(HN, KN, 72, 46, { p: [[0.3, 0.2, 0.2]], q: [[0.4, 0.12, 0.2]], folds: [[0.88, 'p', 0.35], [0.5, 'q', 0.15]] }), { fill: breech, tex: 'weave32', texOp: 0.35 });
  f.stroke([lp(HN, KN, 0.5, -22), lp(HN, KN, 0.6, -6), lp(HN, KN, 0.64, 10)], 2);
  f.stroke([lp(HN, KN, 0.8, 18), lp(HN, KN, 0.85, 4)], 1.8);
  // thigh strap with a throwing knife, a darned patch above the knee
  const ts0 = lp(HN, KN, 0.42, 36), ts1 = lp(HN, KN, 0.5, -36);
  f.part([ts0, ts1, add(ts1, [0, 9]), add(ts0, [0, 9])], { fill: '#2a1d15', shade: 0.3, inkW: 1.1, inkHeavy: 1.6, sharp: true, cast: false });
  const kh = lp(HN, KN, 0.46, 6);
  f.part([add(kh, [-6, -26]), add(kh, [5, -26]), add(kh, [4, 22]), add(kh, [0, 30]), add(kh, [-5, 22])], { fill: '#3a281a', shade: 0.4, inkW: 1.1, cast: false });
  f.part([add(kh, [-4, -40]), add(kh, [3, -40]), add(kh, [3, -26]), add(kh, [-4, -26])], { fill: '#2a1d15', inkW: 1, cast: false });
  f.part([add(kh, [-7, -28]), add(kh, [6, -28]), add(kh, [6, -24]), add(kh, [-7, -24])], { fill: '#8a8478', inkW: 0.9, cast: false, sharp: true });
  f.rivet(add(ts0, [-6, 4]), 2, '#b59a5e');
  const pk = lp(HN, KN, 0.78, -6);
  f.flat([add(pk, [-12, -8]), add(pk, [12, -11]), add(pk, [13, 9]), add(pk, [-11, 11])], '#5a4c40', { op: 0.8 });
  f.stitches([add(pk, [-12, -8]), add(pk, [12, -11]), add(pk, [13, 9]), add(pk, [-11, 11]), add(pk, [-12, -8])], '#cfc4ac', 0.8);
  f.part(limb(KN, AN, 48, 32, { p: [[0.25, 0.3, 0.16]] }), { fill: boot, tex: 'mottle32' });
  B.boot(f, AN, 1, 52, boot, { tex: 'mottle32', knee: add(KN, [0, 10]), kneeW: 48, cuff: true, toe: 1.22, strap: true });
  // head: chin up, cropped hair shaved at the side, scar through the lips
  const HC = [268, 226];
  f.part(limb(S.at(0.0, -0.05), add(HC, [-2, 30]), 32, 30), { fill: skin, shade: 0.5 });
  B.head(f, HC, H, -0.12, {
    skin, jaw: 0.86, chin: -0.01, nose: 0.9, hook: 0.1, mouth: 'set', squint: 0.4, browDown: 0.04, glint: true, iris: '#2a3a2a',
    hairCol: '#3a2414', browW: 0.03, jawShade: 0.12, faceShade: 0.55, faceHatch: false, lips: true, lashes: true,
    scar: [[0.27, 0.18], [0.24, 0.3], [0.2, 0.4]],
    hair: [[-0.36, -0.18], [-0.26, -0.44], [-0.04, -0.56], [0.2, -0.52], [0.34, -0.38], [0.3, -0.3], [0.12, -0.36], [-0.02, -0.3], [-0.12, -0.36], [-0.2, -0.24], [-0.3, -0.06]],
    hairLines: [[[-0.2, -0.4], [0.0, -0.5], [0.2, -0.46]]],
  });
  f.flat(frame(HC, -0.12, H)([[-0.3, -0.06], [-0.18, -0.2], [-0.16, 0.02], [-0.26, 0.12]]), '#3a2414', { op: 0.3 }); // shaved side stubble
  f.line(ell(add(HC, [-18, 18]), 2.6, 3.6, 0, 8).concat([ell(add(HC, [-18, 18]), 2.6, 3.6, 0, 8)[0]]), 1.4, '#9a9a9a'); // iron earring
  // near arm: mail sleeve on the sword arm only, single shoulder cop
  f.part(limb(SN, EN, 44, 36, { q: [[0.3, 0.15, 0.2]], p: [[0.35, 0.12, 0.2]] }), { fill: mail, tex: 'mail32', texOp: 0.9 });
  f.part(limb(EN, WN, 38, 30, { p: [[0.25, 0.15, 0.2]] }), { fill: mail, tex: 'mail32', texOp: 0.9 });
  f.part(plate(EN, WN, 0.5, 1.0, 40, 46), { fill: '#2a1d15' }); // glove cuff
  f.stitches([lp(EN, WN, 0.6, -18), lp(EN, WN, 0.6, 18)], '#c7a864', 0.9);
  f.part(G.lame(add(SN, [-4, -14]), 56, 28, 0.25, 8), { fill: '#7a8088' });
  f.part(G.lame(add(SN, [-2, 4]), 50, 20, 0.3, 6), { fill: '#6a7078', cast: false });
  f.rivet(add(SN, [-6, -4]), 2.6); f.rivet(add(SN, [14, 2]), 2.2);
  // rapier in line
  const gh = [424, 308], tip = [596, 300], bA = Math.atan2(tip[1] - gh[1], tip[0] - gh[0]);
  f.part(limb(gh, tip, 8, 2.5, { steps: 6, capK: 2 }), { fill: steel, shade: 0.3, inkW: 1.2, inkHeavy: 1.8 });
  f.line([lp(gh, tip, 0.06, -1), lp(gh, tip, 0.95, -1)], 0.8, '#fff', { straight: true });
  for (const tt of [0.4, 0.62]) f.line([lp(gh, tip, tt, -2), lp(gh, tip, tt + 0.03, 3), lp(gh, tip, tt + 0.05, -2)], 1, '#4a3a22', { op: 0.8, straight: true }); // lightning scorch
  G.rapierHilt(f, gh, bA, 19, '#7a746a', { only: 'back' });
  B.fist(f, add(WN, [-2, 0]), bA + Math.PI / 2, 20, '#2a1d15');
  G.rapierHilt(f, gh, bA, 19, '#7a746a', { only: 'front' });
  return f;
}

// ------------------------------------------------------------------ ELEMENTALIST: "The Lector"
// A heavy old reader walking with a scroll that unrolls to the ground, plucking a sign out of the air.
function elementalist() {
  const f = new Fig(base(33));
  const H = 94;
  const wool = '#857862', woolD = '#655a48', skin = '#d0a88a', ink6 = ['#c0341c', '#7fa9c6', '#c9a43a', '#2f4f9a', '#6f9a30', '#5a2f72'];
  const N = [282, 274], C = [312, 384], P = [272, 486];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.4, 0.14), SF = S.at(0.5, 0.12);
  const EN = [214, 352], WN = [196, 270];
  const EF = [388, 388], WF = [412, 340];

  // ink trails rising from the pinched fingers
  // like ink dropped in water: six tendrils leave the pinched fingers, wander apart, curl and thin out to nothing
  const src = [186, 248];
  for (let i = 0; i < 6; i++) {
    const pts = [src], drift = [-1.1, -0.6, -0.2, 0.25, 0.7, 1.2][i], len = 7 + (i % 3);
    let p = src, a = -Math.PI / 2 + drift * 0.25;
    for (let k = 1; k <= len; k++) { a += (Math.sin(k * 1.3 + i * 2.1) * 0.55) + drift * 0.08; p = add(p, [Math.cos(a) * 13, Math.sin(a) * 13]); pts.push(p); }
    f.stroke(pts, 5.5 - (i % 3), INK, { op: 0.35, taper: 'start' });
    f.stroke(pts, 3.6 - (i % 3) * 0.6, ink6[i], { op: 0.9, taper: 'start' });
    const e = pts[pts.length - 1];
    f.flat(ell(add(e, [2, -4]), 2.2, 1.8, 0, 6), ink6[i], { op: 0.5 });
  }
  // far arm, scroll in hand
  f.part(limb(SF, EF, 44, 38, { folds: [[0.85, 'q', 0.3]] }), { fill: wool, tex: 'weave33' });
  f.part(limb(EF, WF, 42, 32, { q: [[0.25, 0.3, 0.2]] }), { fill: wool, tex: 'weave33' });
  // feet
  B.boot(f, [340, 760], 1, 40, '#3a2a1c', { shaft: 0.35, toe: 1.1 });
  B.boot(f, [218, 762], 1, 40, '#33251a', { shaft: 0.35, toe: 1.1 });
  // robe: heavy, belly forward, tabard of sigils over it
  const top = S.shape([[-0.05, 0.4, 0.36], [0.1, 0.8, 0.62], [0.35, 0.8, 0.92], [0.62, 0.8, 1.05], [0.88, 0.86, 0.95]]);
  f.part([...top.slice(0, 5), [400, 600], [404, 700], [396, 752, 1], [360, 742], [330, 758, 1], [290, 744], [250, 760, 1], [210, 746], [176, 756, 1], [170, 690], [182, 590], ...top.slice(5)], { fill: wool, tex: 'weave33', texOp: 0.5 });
  for (const q of [[[320, 560], [338, 660], [334, 748]], [[240, 570], [226, 660], [228, 748]], [[370, 600], [384, 680], [382, 744]], [[200, 600], [194, 690], [190, 750]]]) f.stroke(q, 2.4);
  f.part([S.at(0.1, 0.12), S.at(0.6, 0.12), S.at(0.95, 0.6), S.at(0.95, 0.9), [376, 690], [366, 712, 1], [354, 698], [346, 724, 1], [334, 702], [328, 690], S.at(0.4, 0.9)], { fill: '#27303d', tex: 'weave33', texOp: 0.5, k: 0.6, over: `<rect x="250" y="250" width="200" height="500" fill="url(#mottle33)" opacity="0.9"/>` }); // faded blue tabard, ragged
  f.line([S.at(0.14, 0.14), S.at(0.44, 0.9), [330, 692]], 1.2, '#8a8478', { op: 0.5, dash: '3 2' }); // seam, re-stitched
  f.flat([S.at(0.6, 0.42), S.at(0.8, 0.44), S.at(0.78, 0.56), S.at(0.62, 0.55)], '#3a4656', { op: 0.9 }); // patch
  f.stitches([S.at(0.6, 0.42), S.at(0.8, 0.44), S.at(0.78, 0.56), S.at(0.62, 0.55), S.at(0.6, 0.42)], '#a89c84', 0.8);
  for (const [x, y, c] of [[366, 560, '#c0341c'], [356, 610, '#6f9a30'], [372, 646, '#2f4f9a']]) { f.flat([[x - 2, y], [x + 2, y], [x + 1.5, y + 18], [x, y + 22], [x - 1.5, y + 18]], c, { op: 0.6 }); } // ink drips down the cloth
  for (let i = 0; i < 6; i++) { const q = lerp(S.at(0.55, 0.3), [350, 680], i / 5); f.line(ell(q, 8, 8, 0, 10).concat([ell(q, 8, 8, 0, 10)[0]]), 1.8, ink6[i]); f.line([add(q, [-5, 5]), add(q, [5, -5])], 1.4, ink6[i], { straight: true }); }
  f.part([S.at(-0.85, 0.8), S.at(0.98, 0.78), S.at(0.98, 0.86), S.at(-0.86, 0.88)], { fill: '#6e5434', tex: 'hatch33', texOp: 0.4, sharp: true }); // rope belt
  for (let i = 0; i < 12; i++) f.line([S.at(-0.8 + i * 0.15, 0.79), S.at(-0.74 + i * 0.15, 0.87)], 1.1, INK, { op: 0.6 });
  f.line([S.at(-0.4, 0.86), [214, 560], [206, 610]], 2.4, '#6e5434');
  f.part(ell([204, 622], 13, 13, 0, 12), { fill: '#a5713a', inkW: 1.3 });
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; f.part(ell(add([204, 622], [Math.cos(a) * 9, Math.sin(a) * 9]), 2.6, 2.6, 0, 6), { fill: ink6[i], inkW: 0.8 }); }
  // girdle book hanging from the belt on a strap, a rubric ribbon marking the page
  const gb = [196, 590];
  f.line([S.at(-0.55, 0.86), [204, 560], add(gb, [8, 0])], 3, '#3a2618');
  f.part([add(gb, [-20, 0]), add(gb, [24, -4]), add(gb, [28, 52]), add(gb, [-18, 56])].map(q => [...q, 1]), { fill: '#5a2a1c', tex: 'mottle33', k: 0.4 });
  f.part([add(gb, [-14, 6]), add(gb, [20, 2]), add(gb, [22, 48]), add(gb, [-12, 50])].map(q => [...q, 1]), { fill: '#6a3424', tex: 'mottle33', inkW: 1, cast: false });
  for (const q of [[-8, 12], [14, 10], [16, 42], [-6, 44]]) f.rivet(add(gb, q), 2, '#9a8a6a');
  f.line([add(gb, [26, 6]), add(gb, [30, 30]), add(gb, [26, 50])], 2.4, '#d8c8a0'); // page edges
  f.part([add(gb, [2, 54]), add(gb, [8, 54]), add(gb, [10, 92]), add(gb, [5, 86]), add(gb, [0, 94])], { fill: '#a82a1e', inkW: 1.1 }); // rubric ribbon
  // ostium badge on the belt
  f.line([S.at(-0.2, 0.87), S.at(-0.18, 0.95)], 1.2, '#2b2119');
  G.badge(f, S.at(-0.18, 0.95), 10, '#74777b', -0.05);
  // quill tucked through the rope belt
  f.part([S.at(0.06, 0.95), S.at(0.11, 0.95), S.at(0.2, 0.62), S.at(0.26, 0.5), S.at(0.16, 0.56)], { fill: '#e6dcc4', inkW: 1, k: 0.5, hatch: false, shade: 0.15, cast: false });
  f.line([S.at(0.08, 0.95), S.at(0.16, 0.56)], 0.8, INK, { op: 0.6 });
  // ink pots hanging from the belt
  for (let i = 0; i < 3; i++) { const q = S.at(0.2 + i * 0.25, 0.92); f.line([S.at(0.2 + i * 0.25, 0.86), q], 1.4, '#3a2a1a'); f.part([add(q, [-7, 0]), add(q, [7, 0]), add(q, [9, 18]), add(q, [-9, 18])], { fill: ['#3a2a5a', '#2a3a1a', '#5a1a14'][i], k: 0.6, inkW: 1.2 }); }
  // head: heavy jowls, spectacles, long beard, eyes on the page
  const HC = [300, 222];
  f.part(limb(S.at(0.1, -0.06), add(HC, [-6, 28]), 40, 38), { fill: skin, shade: 0.5 });
  const hf = B.head(f, HC, H, 0.16, {
    skin, jaw: 1.2, chin: -0.02, nose: 1.1, hook: 0.0, mouth: 'grim', squint: 0.6, browDown: -0.02, age: true,
    hairCol: '#b8b0a2', beard: 'full', beardCol: '#c2baa8', browCol: '#8a8478',
    hair: [[-0.38, 0.2], [-0.44, -0.05], [-0.4, -0.28], [-0.26, -0.42], [-0.22, -0.3], [-0.28, -0.1], [-0.26, 0.1]],
  });
  f.part(hf([[0.0, 0.5], [0.3, 0.5], [0.34, 0.75], [0.24, 0.95], [0.18, 0.78], [0.06, 0.7]]), { fill: '#c2baa8', tex: 'hatch33', texOp: 0.3 }); // beard length
  // spectacles
  f.line(hf(ell([0.12, -0.05], 0.08, 0.06, 0, 12).concat([ell([0.12, -0.05], 0.08, 0.06, 0, 12)[0]])), 1.8, '#5a4a2a');
  f.line(hf(ell([0.31, -0.06], 0.045, 0.055, 0, 10).concat([ell([0.31, -0.06], 0.045, 0.055, 0, 10)[0]])), 1.8, '#5a4a2a');
  f.line(hf([[0.2, -0.06], [0.26, -0.07]]), 1.6, '#5a4a2a');
  f.line(hf([[0.04, -0.06], [-0.14, -0.02]]), 1.4, '#5a4a2a');
  // near arm raised back, fingers pinching a sign out of the air
  f.part(limb(SN, EN, 48, 42, { p: [[0.5, 0.3, 0.2]], folds: [[0.88, 'q', 0.3]] }), { fill: wool, tex: 'weave33' });
  f.part(limb(EN, WN, 46, 30, { q: [[0.25, 0.4, 0.2]] }), { fill: wool, tex: 'weave33' });
  f.part(plate(EN, WN, 0.55, 0.78, 44, 38), { fill: woolD });
  B.hand(f, add(WN, [-6, -14]), -1.8, 22, skin, { spread: 0.2, curl: 0.75, fingerCols: [mix(skin, ink6[0], 0.5), mix(skin, ink6[1], 0.5), mix(skin, ink6[2], 0.5), mix(skin, ink6[3], 0.5)], tipCols: [ink6[0], ink6[1], ink6[2], ink6[3]], thumbTip: ink6[5] });
  // the scroll: wooden roller in hand, sheet unrolling to the ground
  f.part([[410, 342], [440, 360], [452, 440], [436, 520], [450, 600], [432, 680], [452, 760, 1], [478, 772], [468, 690], [482, 600], [466, 520], [480, 440], [462, 352], [428, 330]], { fill: '#e3d4b0', shade: 0.3, k: 0.7 });
  for (let i = 0; i < 18; i++) { const y = 372 + i * 20; const x = 440 + Math.sin(y / 60) * 10; f.line([[x, y], [x + 18 + (i % 3) * 3, y + 2]], 1.1, i % 5 === 0 ? ink6[0] : '#3a2a1a', { op: 0.8 }); }
  f.part(limb([404, 330], [474, 346], 12, 12, { steps: 4 }), { fill: '#6a4a2a' });
  f.part(limb([456, 772], [500, 776], 12, 12, { steps: 4 }), { fill: '#6a4a2a' });
  B.hand(f, WF, -0.35, 22, skin, { spread: 0.1, curl: 0.7, tipCols: [ink6[4], ink6[4], ink6[5], ink6[5]] });
  return f;
}

module.exports = {
  heroes: [{ key: 'bulwark', build: bulwark }, { key: 'duelist', build: duelist }, { key: 'elementalist', build: elementalist }],
  scene: (W, H) => `<defs><radialGradient id="skyC" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#5a4d3b"/><stop offset="1" stop-color="#16120e"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#skyC)"/><rect y="${H - 60}" width="${W}" height="60" fill="#120f0b"/>`,
};
