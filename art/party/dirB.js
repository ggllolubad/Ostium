// Direction B: "Woodcut Brutes". Hard black shadow masses, 5.8 heads, huge hands and shoulders, aggressive poses.
'use strict';
const E = require('./engine');
const B = require('./body');
const G = require('./gear');
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;

const INK = '#0b0908';
const base = seed => ({ mode: 'block', seed, ink: INK, shadowTint: '#07060a', keyTint: '#fff4dc', rim: '#c9b48a', rimDir: [1, 0.3], grimeY: 620, groundY: 790, mud: '#1b140c', wobble: 2.2, inkW: 2.2, inkHeavy: 5 });

// ------------------------------------------------------------------ BULWARK: "The Wall"
// Squared up behind the raised door, only the eye slit over the rim, mace cocked back to fall.
function bulwark() {
  const f = new Fig(base(21));
  const H = 110;
  const steel = '#8a8f96', steelD = '#5d6269', oak = '#6a4a2c', gamb = '#7a6346', red = '#9a2018', mail = '#666a6e';
  const N = [296, 262], C = [270, 360], P = [262, 476];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.55, 0.14), SF = S.at(0.55, 0.1);
  const HN = S.at(-0.3, 1.0), HF = S.at(0.3, 0.98);
  const KF = [352, 616], AF = [368, 744], KN = [210, 622], AN = [168, 748];
  const EN = [176, 250], WN = [226, 168];

  // mace cocked back behind the head (drawn first, it is behind)
  const mH = [128, 112], mA = Math.atan2(mH[1] - WN[1], mH[0] - WN[0]);
  f.part(limb(WN, mH, 13, 12, { steps: 6 }), { fill: '#3b2a1c', shade: 0.4, tex: 'wood21' });
  G.maceHead(f, mH, mA, 38, '#55585d');
  // near arm raised behind
  f.part(limb(SN, EN, 62, 50, { p: [[0.4, 0.2, 0.2]] }), { fill: gamb, tex: 'quilt21' });
  f.part(plate(SN, EN, 0.25, 0.85, 62, 52, { bow: 4 }), { fill: steelD });
  f.part(limb(EN, WN, 54, 42), { fill: steelD });
  G.poleyn(f, EN, 2.3, 30, steel, steelD); // couter
  B.fist(f, WN, mA + Math.PI / 2, 34, steel);

  // legs: short, thick, planted
  f.part(limb(HF, KF, 84, 58, { q: [[0.35, 0.15, 0.2]] }), { fill: gamb, tex: 'quilt21' });
  f.part(limb(KF, AF, 58, 42, { p: [[0.3, 0.2, 0.18]] }), { fill: steelD });
  f.part(plate(KF, AF, 0.05, 0.95, 60, 44, { bow: 4 }), { fill: steel });
  G.poleyn(f, KF, 0.2, 38, steel, steelD);
  B.boot(f, AF, 1, 64, '#5d6269', { shaft: 0.2, toe: 1.15, style: 'sabaton' });
  f.part(limb(HN, KN, 86, 60, { p: [[0.4, 0.15, 0.25]] }), { fill: gamb, tex: 'quilt21' });
  f.part(plate(HN, KN, 0.5, 0.95, 70, 58, { bow: 5 }), { fill: steel });
  f.part(limb(KN, AN, 60, 42, { q: [[0.3, 0.25, 0.18]] }), { fill: steelD });
  f.part(plate(KN, AN, 0.06, 0.92, 62, 44, { bow: 4 }), { fill: steel });
  G.poleyn(f, KN, -0.3, 38, steel, steelD);
  B.boot(f, AN, 1, 64, '#6a6f76', { shaft: 0.2, toe: 1.15, style: 'sabaton' });

  // torso: barrel chest, gambeson, plates
  f.part(S.shape([[-0.06, 0.42, 0.4], [0.06, 1.0, 0.6], [0.2, 1.1, 0.95], [0.42, 1.0, 1.0], [0.65, 0.85, 0.92], [0.88, 0.9, 0.86], [1.04, 0.9, 0.78], [1.12, 0.7, 0.6]]), { fill: gamb, tex: 'quilt21', texOp: 0.6 });
  // breastplate edge showing at the armpit and neck, under the tabard
  f.part(S.shape([[0.05, 0.7, 0.62], [0.2, 0.95, 1.02], [0.45, 0.85, 0.98], [0.6, 0.8, 0.86]]), { fill: steelD, k: 0.7 });
  // tabard: filthy undyed linen over the plate, chest out, cinched at the waist, ragged hem, key sigil in ink
  const tab = '#7a6c52';
  f.part([[...S.at(-0.82, 0.18), 1], S.at(-0.2, 0.15), [...S.at(0.88, 0.18), 1], S.at(1.0, 0.36), S.at(0.9, 0.56), S.at(0.82, 0.78), S.at(0.95, 0.92), [330, 600], [312, 640, 1], [296, 610], [282, 622, 1], [262, 650, 1], [240, 604], [214, 632, 1], S.at(-0.96, 0.92), S.at(-0.84, 0.74), S.at(-0.9, 0.5), S.at(-0.94, 0.32)], { fill: tab, tex: 'weave21', texOp: 0.5, k: 0.7, over: `<rect x="150" y="240" width="260" height="420" fill="url(#mottle21)" opacity="0.7"/>` });
  f.flat([S.at(0.55, 0.2), S.at(0.98, 0.36), S.at(0.88, 0.56), S.at(0.6, 0.5)], '#000', { op: 0.25 }); // chest turning away from the light
  for (const q of [[[-0.6, 0.6], [-0.65, 0.78], [-0.7, 0.98]], [[0.1, 0.56], [0.15, 0.76], [0.1, 0.98]], [[0.55, 0.6], [0.62, 0.8], [0.66, 0.96]]]) f.stroke(q.map(([u, v]) => S.at(u, v)), 2.4);
  const kc = '#2a1f16';
  f.line([S.at(-0.2, 0.35), S.at(-0.2, 0.7)], 4, kc); // key sigil, inked
  f.line(ell(S.at(-0.2, 0.3), 9, 9, 0, 10).concat([ell(S.at(-0.2, 0.3), 9, 9, 0, 10)[0]]), 4, kc);
  f.line([S.at(-0.2, 0.62), S.at(-0.05, 0.62)], 4, kc); f.line([S.at(-0.2, 0.68), S.at(-0.08, 0.68)], 4, kc);
  f.flat([S.at(0.2, 0.42), S.at(0.5, 0.4), S.at(0.6, 0.6), S.at(0.45, 0.75), S.at(0.25, 0.6)], '#4a0c08', { op: 0.55 }); // old blood soaked into the linen
  f.spatter(S.at(0.4, 0.5), 30, 18);
  f.flat([S.at(-0.7, 0.3), S.at(-0.45, 0.28), S.at(-0.48, 0.45), S.at(-0.72, 0.44)], '#5a4a32', { op: 0.6 }); // patch
  f.stitches([S.at(-0.7, 0.3), S.at(-0.45, 0.28), S.at(-0.48, 0.45), S.at(-0.72, 0.44), S.at(-0.7, 0.3)], '#d8cbb0', 1);
  f.scratches(S.at(0.0, 0.5), 40, 6, '#1a0503', 1.4);
  // belt
  f.part([S.at(-0.95, 0.86), S.at(0.95, 0.84), S.at(0.96, 0.93), S.at(-0.97, 0.95)], { fill: '#2c1d12', shade: 0.4, sharp: true });
  f.part([S.at(0.25, 0.83), S.at(0.45, 0.83), S.at(0.45, 0.95), S.at(0.25, 0.95)], { fill: '#a08858', shade: 0.4, sharp: true });
  f.line([S.at(-0.5, 0.93), S.at(-0.48, 1.0), S.at(-0.52, 1.05)], 1.6, '#2b2119');
  G.badge(f, S.at(-0.52, 1.05), 12, '#74777b', 0.06);
  // mail skirt under tabard edges
  f.part([S.at(-0.95, 0.95), [202, 600], [222, 612], [238, 596], S.at(-0.6, 0.98)], { fill: mail, tex: 'mail21', texOp: 0.9 });

  // aventail + great helm with a rubric strip knotted round it
  const HC = [348, 196], hF = frame(HC, 0.05, 128);
  f.part([add(HC, [-58, 30]), add(HC, [50, 36]), S.at(0.75, 0.14), S.at(-0.3, 0.24), S.at(-0.9, 0.12)], { fill: mail, tex: 'mail21', texOp: 0.9 });
  G.pauldron(f, add(SN, [4, -2]), 54, -0.35, steel, steelD, 3);
  f.part(hF([[-0.44, -0.48], [-0.1, -0.58, 1], [0.32, -0.58, 1], [0.45, -0.36], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [-0.3, 0.53], [-0.46, 0.38, 1], [-0.48, -0.1]]), { fill: steel, k: 0.8 });
  f.part(hF([[0.2, -0.58, 1], [0.32, -0.58, 1], [0.45, -0.36], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [0.22, 0.53, 1], [0.24, 0.1]]), { fill: steelD, inkW: 1.5 });
  f.flat(hF([[-0.02, -0.17], [0.21, -0.17], [0.21, -0.07], [-0.02, -0.08]]), '#000', { sharp: true });
  f.flat(hF([[0.27, -0.17], [0.47, -0.17], [0.47, -0.08], [0.27, -0.08]]), '#000', { sharp: true });
  f.flat(hF(ell([0.1, -0.12], 0.03, 0.02, 0, 8)), '#ffcf6a');
  f.part(hF([[-0.46, -0.33], [0.45, -0.35], [0.46, -0.27], [-0.47, -0.25]]), { fill: red, inkW: 1.4, sharp: true }); // rubric strip round the brow
  f.part(hF([[-0.47, -0.3], [-0.72, -0.18], [-0.86, 0.1], [-0.74, 0.12], [-0.62, -0.08], [-0.48, -0.22]]), { fill: mix(red, '#000', 0.2), inkW: 1.4 }); // knot tails
  f.part(hF([[-0.47, -0.26], [-0.62, 0.05], [-0.58, 0.3], [-0.5, 0.28], [-0.52, 0.04], [-0.46, -0.2]]), { fill: red, inkW: 1.4 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) f.flat(hF(ell([0.3 + c * 0.055, 0.08 + r * 0.09], 0.014, 0.018, 0, 6)), '#000');
  for (let i = 0; i < 5; i++) f.rivet(hF([[-0.36 + i * 0.17, 0.46]])[0], 3);
  f.flat(hF([[-0.3, 0.02], [0.2, -0.22], [0.22, -0.19], [-0.28, 0.06]]), '#1b1c1f'); // old gash
  f.line(hF([[-0.3, 0.01], [0.21, -0.23]]), 1.4, '#eee', { op: 0.8 });

  // the door raised high: only the eye slit clears the top rim
  const DX = -58; const TL = [394 + DX, 246], TR = [540 + DX, 232], BR = [548 + DX, 712], BL = [402 + DX, 722];
  f.part([[378 + DX, 254], TL, BL, [386 + DX, 726]], { fill: '#3a2516', sharp: true });
  f.part([TL, TR, BR, BL], { fill: oak, tex: 'wood21', texOp: 0.8, sharp: true });
  for (let i = 1; i < 5; i++) { const t = i / 5; f.line([lerp(TL, TR, t), lerp(BL, BR, t)], 2.6, INK, { straight: true }); }
  f.line([TL, TR], 2.4, '#c4a070', { straight: true, op: 0.7 });
  for (const y0 of [282, 466, 650]) {
    const y = y0 + 12;
    f.part([[384 + DX, y - 11], [520 + DX, y - 22], [548 + DX, y - 12], [520 + DX, y], [384 + DX, y + 14]], { fill: '#2a2a2c', sharp: true, inkW: 1.6 });
    for (let k = 0; k < 5; k++) f.rivet([400 + DX + k * 28, y - 1 - k * 2.4], 3, '#777');
  }
  // great iron ring handle, keyhole plate, nail-studded face, rubric ribbon
  f.part([[340, 520], [368, 518], [370, 582], [342, 584]], { fill: '#2a2a2c', sharp: true });
  f.flat([[352, 538], [358, 538], [359, 556], [351, 556]], '#000');
  f.line(ell([442, 380], 18, 26, 0.1, 18).concat([ell([442, 380], 18, 26, 0.1, 18)[0]]), 5.5, '#2b2b2b');
  f.part([[454, 400], [468, 404], [478, 476], [464, 520], [454, 514], [462, 470]], { fill: red, inkW: 1.4 });
  for (let i = 0; i < 18; i++) f.rivet([360 + (i % 6) * 22, 330 + Math.floor(i / 6) * 120 + (i % 2) * 6], 2.4, '#8a8a86');
  // gouges, arrows, blood
  for (const [x, y, a] of [[382, 300, 0.9], [412, 560, -0.4], [450, 610, 0.5]]) f.flat([[x, y], add([x, y], rot([30, 0], a)), add([x, y], rot([30, 4], a)), add([x, y], [0, 5])], '#160d06');
  f.line([[402, 420], [372, 398]], 4, '#3a2a1a', { straight: true });
  f.line([[372, 398], [362, 388]], 3, '#6a5a4a', { straight: true });
  f.line([[456, 300], [434, 270]], 4, '#3a2a1a', { straight: true });
  f.spatter([412, 380], 50, 34);
  f.flat([[362, 610], [394, 600], [402, 690], [382, 700]], '#4a0c08', { op: 0.7 });
  // far hand is behind the door: only the gauntlet fingers hook round its edge
  G.fingersOver(f, [490, 424], [0.02, 1], [-1, 0.12], 30, steelD, 4);
  return f;
}

// ------------------------------------------------------------------ DUELIST: "The Wolf in the Hat"
// Low and coiled in a hanging guard, cape wrapped on the off arm, grinning under a wide brim.
function duelist() {
  const f = new Fig(base(22));
  const H = 106;
  const coat = '#54443a', coatL = '#665446', shirt = '#a59d8c', breech = '#4a4038', boot = '#4a3424', red = '#9a2018', skin = '#c69673', steel = '#c5cbd2';
  const N = [334, 338], C = [298, 420], P = [292, 520];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.05, 0.12), SF = S.at(0.45, 0.08);
  const HN = S.at(0.1, 1.0), HF = S.at(-0.25, 0.98);
  const KN = [398, 640], AN = [418, 746], KF = [210, 652], AF = [140, 748];
  const EN = [384, 430], WN = [440, 446];
  const EF = [470, 322], WF = [508, 220];

  // coat tails flying back
  f.part([S.at(-0.55, 0.7), S.at(-0.2, 0.9), [240, 640], [178, 700, 1], [150, 676], [112, 690, 1], [140, 620], [130, 600, 1], [190, 560]], { fill: coat, tex: 'mottle22', k: 0.6 });
  f.part([[190, 560], [130, 600], [140, 620], [112, 690], [104, 672], [122, 610], [118, 590]], { fill: red, inkW: 1.4 });
  // far arm (left-handed): hanging guard, hilt above and ahead of the head, blade down at the enemy
  f.part(limb(SF, EF, 42, 32, { p: [[0.35, 0.2, 0.2]], folds: [[0.9, 'p', 0.3]] }), { fill: coat, tex: 'mottle22' });
  f.part(limb(EF, WF, 36, 26), { fill: coat, tex: 'mottle22' });
  f.part(plate(EF, WF, 0.6, 1.0, 38, 42), { fill: '#1d1510' });
  const tip = [596, 414], gh = [514, 232], bA = Math.atan2(tip[1] - gh[1], tip[0] - gh[0]);
  f.part(limb(gh, tip, 10, 3, { steps: 6, capK: 2 }), { fill: steel, shade: 0.35, inkW: 1.6, inkHeavy: 2.4 });
  f.line([lp(gh, tip, 0.06, 0), lp(gh, tip, 0.95, 0)], 1, '#fff', { straight: true });
  for (const tt of [0.3, 0.55, 0.7]) f.line([lp(gh, tip, tt, -2), lp(gh, tip, tt + 0.03, 3), lp(gh, tip, tt + 0.05, -2)], 1.2, '#4a3a22', { op: 0.85, straight: true }); // lightning scorch
  G.rapierHilt(f, gh, bA, 21, '#8a8478', { only: 'back', side: -1 });
  B.fist(f, WF, bA + Math.PI / 2, 24, '#1d1510', { cuff: true });
  G.rapierHilt(f, gh, bA, 21, '#8a8478', { only: 'front', side: -1 });
  // far leg back, extended
  f.part(limb(HF, KF, 60, 40, { q: [[0.3, 0.18, 0.2]], folds: [[0.85, 'q', 0.3]] }), { fill: breech });
  f.part(limb(KF, AF, 42, 28, { q: [[0.3, 0.25, 0.16]] }), { fill: boot, tex: 'mottle22' });
  B.boot(f, AF, 1, 56, boot, { knee: add(KF, [0, 8]), kneeW: 44, cuff: true, toe: 1.2, tex: 'mottle22' });
  // torso coiled forward
  f.part(S.shape([[-0.05, 0.34, 0.34], [0.06, 0.7, 0.5], [0.22, 0.68, 0.8], [0.45, 0.58, 0.72], [0.68, 0.5, 0.56], [0.88, 0.62, 0.56], [1.05, 0.66, 0.56], [1.12, 0.52, 0.44]]), { fill: coat, tex: 'mottle22' });
  f.part([S.at(0.3, -0.02), S.at(0.6, 0.12), S.at(0.58, 0.5), S.at(0.38, 0.58), S.at(0.32, 0.2)], { fill: shirt, tex: 'weave22', k: 0.6 }); // open collar shirt
  f.line([S.at(0.36, 0.1), S.at(0.45, 0.35)], 1.4, INK);
  f.part([S.at(-0.66, 0.66), S.at(0.56, 0.64), S.at(0.6, 0.79), S.at(-0.68, 0.82)], { fill: red, tex: 'weave22', k: 0.5 });
  for (let i = 0; i < 4; i++) f.stroke([S.at(-0.5 + i * 0.28, 0.8), S.at(-0.38 + i * 0.28, 0.73), S.at(-0.24 + i * 0.28, 0.66)], 3, '#2b0604');
  // bandolier with knives and the ostium badge
  f.line([S.at(0.5, 0.05), S.at(-0.1, 0.4), S.at(-0.66, 0.68)], 8, '#1d1510');
  for (let i = 0; i < 3; i++) { const q = lerp(S.at(0.3, 0.17), S.at(-0.35, 0.55), i / 2); f.part([add(q, [-4, -10]), add(q, [4, -10]), add(q, [3, 12]), add(q, [-3, 12])], { fill: '#8a8278', sharp: true, inkW: 1.4 }); }
  G.badge(f, S.at(0.12, 0.26), 9, '#74777b', 0.5);
  // near leg forward, deep bend
  f.part(limb(HN, KN, 64, 40, { p: [[0.3, 0.2, 0.2]], q: [[0.3, 0.22, 0.22]], folds: [[0.88, 'p', 0.35]] }), { fill: breech, tex: 'weave22', texOp: 0.3 });
  f.part(limb(KN, AN, 44, 28, { p: [[0.25, 0.3, 0.16]] }), { fill: boot, tex: 'mottle22' });
  B.boot(f, AN, 1, 56, boot, { knee: add(KN, [0, 8]), kneeW: 46, cuff: true, toe: 1.2, tex: 'mottle22', strap: true });
  // head: chin down, eyes up, wolf grin under the brim
  const HC = [372, 288];
  f.part(limb(S.at(0.1, -0.05), add(HC, [-4, 30]), 38, 34), { fill: skin, shade: 0.5 });
  B.head(f, HC, H, 0.04, {
    skin, jaw: 1.12, chin: 0.03, nose: 1.0, hook: 0.2, mouth: 'snarl', squint: 0.55, browDown: 0.05, age: true, glint: true,
    hairCol: '#1e1813', beard: 'short', beardCol: '#241c16',
    scar: [[0.18, -0.25], [0.14, -0.08], [0.1, 0.1]],
    hairBack: [[-0.42, -0.1], [-0.5, 0.25], [-0.42, 0.42], [-0.3, 0.3], [-0.3, 0.0]],
  });
  // wide brim hat with a red band
  const hf = frame(HC, -0.04, H);
  f.part(hf([[-0.04, -0.48], [-0.22, -0.8], [-0.44, -1.08], [-0.6, -1.14], [-0.5, -1.0], [-0.34, -0.78], [-0.14, -0.5]]), { fill: '#1c1a18', inkW: 1.2 }); f.line(hf([[-0.1, -0.52], [-0.3, -0.84], [-0.54, -1.1]]), 0.9, '#6a6460', { op: 0.6 }); // crow feather in the band
  f.part(hf([[-0.75, -0.3], [-0.3, -0.42], [0.3, -0.44], [0.8, -0.36], [1.0, -0.2], [0.98, -0.12, 1], [0.62, -0.2], [0.0, -0.22], [-0.6, -0.18], [-0.86, -0.22]]), { fill: '#2a221c', tex: 'mottle22' });
  f.part(hf([[-0.38, -0.38, 1], [-0.35, -0.7], [-0.2, -0.82], [-0.02, -0.73], [0.14, -0.84], [0.3, -0.76], [0.37, -0.42, 1]]), { fill: '#322820', tex: 'mottle22', k: 0.7 });
  f.line(hf([[-0.02, -0.73], [0.0, -0.55]]), 1.4, INK, { op: 0.7 }); // pinch crease
  f.line(hf([[0.5, -0.33], [0.85, -0.3]]), 1, '#6a5a4a', { op: 0.5 }); // worn brim edge
  f.part(hf([[-0.36, -0.46], [0.36, -0.5], [0.36, -0.4], [-0.36, -0.37]]), { fill: red, inkW: 1.4, k: 0.5 });
  f.flat(hf([[-0.3, -0.22], [0.45, -0.24], [0.4, -0.16], [-0.2, -0.12]]), '#000', { op: 0.3 }); // brim shadow on the face
  // near arm forward and low, the cape wrapped round the forearm as a buckler
  f.part(limb(SN, EN, 46, 36, { p: [[0.35, 0.25, 0.2]], folds: [[0.9, 'q', 0.3]] }), { fill: coatL, tex: 'mottle22' });
  f.part(limb(EN, WN, 38, 30), { fill: coatL, tex: 'mottle22' });
  f.part([[380, 408], [440, 420], [470, 436], [474, 462], [462, 560, 1], [444, 540], [430, 580, 1], [414, 540], [394, 520, 1], [384, 460]], { fill: '#2a2320', tex: 'weave22', k: 0.6 });
  f.part([[462, 560], [444, 540], [430, 580], [436, 586], [448, 552], [466, 568]], { fill: red, inkW: 1.2 });
  for (const q of [[[400, 430], [420, 470], [416, 520]], [[440, 436], [450, 480], [444, 540]]]) f.stroke(q, 2.4);
  B.hand(f, add(WN, [20, 4]), 0.15, 24, skin, { spread: 0.35, curl: 0.4 });
  return f;
}

// ------------------------------------------------------------------ ELEMENTALIST: "The Mad Conjoiner"
// Arms flung wide, coat whipping, shouting the six signs into being between his hands.
function elementalist() {
  const f = new Fig(base(23));
  const H = 104;
  const coatC = '#6c5c43', coatD = '#4d412f', hose = '#3a3229', skin = '#c9a283', ink6 = ['#d23a1c', '#9cc3dc', '#e2b83a', '#3a5fb0', '#8fb03a', '#6a3a8a'];
  const N = [300, 310], C = [286, 410], P = [292, 506];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.3, 0.14), SF = S.at(0.4, 0.1);
  const HN = S.at(-0.1, 1.0), HF = S.at(0.25, 0.98);
  const KN = [224, 630], AN = [184, 748], KF = [370, 622], AF = [404, 744];
  const EN = [192, 322], WN = [168, 240], EF = [444, 344], WF = [482, 274];

  // the conjunction: six ink threads crackling between the hands. jagged, tangled, crossing each other, not a rainbow
  const hA = [158, 218], hB = [500, 256];
  for (let i = 0; i < 6; i++) {
    const lift = [30, 95, 55, 120, 15, 75][i], twist = [0.3, -0.4, 0.8, -0.2, 0.5, -0.7][i];
    const pts = [];
    for (let k = 0; k <= 18; k++) {
      const t = k / 18, p = lerp(hA, hB, t), j = (k === 0 || k === 18) ? 0 : (f.r() - 0.5) * 26;
      pts.push(add(p, [j * 0.4, -Math.sin(t * Math.PI) * lift + Math.sin(t * Math.PI * 3 + twist * 4) * 16 + j]));
    }
    f.raw(`<path d="M${pts.map(q => q.map(E.f1).join(',')).join('L')}" fill="none" stroke="${ink6[i]}" stroke-width="7" opacity="0.13" filter="url(#soft23)"/>`);
    f.line(pts, 3.2, '#0b0908', { straight: true, op: 0.8 });
    f.line(pts, 1.8, ink6[i], { straight: true });
    // forks spitting off the thread
    for (const k of [5, 11]) { const a = pts[k], b = add(a, [(f.r() - 0.5) * 30, -10 - f.r() * 22]); f.line([a, lerp(a, b, 0.5).map(v => v + (f.r() - 0.5) * 8), b], 1.2, ink6[i], { straight: true, op: 0.9 }); }
  }
  // ink droplets flung off the threads
  for (let i = 0; i < 18; i++) { const q = [170 + f.r() * 320, 120 + f.r() * 120]; f.flat(ell(q, 1.6 + f.r() * 2, 1.4 + f.r() * 2, f.r() * 3, 6), ink6[i % 6], { op: 0.85 }); }
  // coat skirts whipping back
  f.part([S.at(-0.6, 0.7), S.at(0.5, 0.7), [380, 640], [408, 700, 1], [372, 690], [350, 730, 1], [320, 690], [262, 716, 1], [236, 676], [168, 706, 1], [150, 668], [108, 690, 1], [130, 620], [170, 580]], { fill: coatD, tex: 'mottle23', k: 0.6 });
  // far leg, near leg: thin, wrapped shins, sandals
  f.part(limb(HF, KF, 60, 42, { q: [[0.35, 0.18, 0.2]], p: [[0.3, 0.1, 0.2]], folds: [[0.85, 'q', 0.3]] }), { fill: hose });
  f.part(limb(KF, AF, 44, 30, { p: [[0.3, 0.22, 0.18]] }), { fill: '#5a4a36', tex: 'weave23', texOp: 0.4 });
  for (let i = 0; i < 4; i++) f.stroke([lp(KF, AF, 0.18 + i * 0.18, -22), lp(KF, AF, 0.24 + i * 0.18, 0), lp(KF, AF, 0.3 + i * 0.18, 22)], 2.6);
  B.boot(f, AF, 1, 50, '#5a3e24', { shaft: 0.35, toe: 1.2, strap: true });
  f.part(limb(HN, KN, 62, 44, { p: [[0.35, 0.18, 0.2]], q: [[0.3, 0.1, 0.2]], folds: [[0.85, 'p', 0.3]] }), { fill: hose });
  f.part(limb(KN, AN, 46, 30, { q: [[0.3, 0.22, 0.18]] }), { fill: '#5a4a36', tex: 'weave23', texOp: 0.4 });
  for (let i = 0; i < 4; i++) f.stroke([lp(KN, AN, 0.18 + i * 0.18, -22), lp(KN, AN, 0.24 + i * 0.18, 0), lp(KN, AN, 0.3 + i * 0.18, 22)], 2.6);
  B.boot(f, AN, 1, 50, '#5a3e24', { shaft: 0.35, toe: 1.2 });
  // far arm flung forward-up
  f.part(limb(SF, EF, 44, 38, { p: [[0.4, 0.15, 0.2]], folds: [[0.85, 'q', 0.3]] }), { fill: coatC, tex: 'mottle23' });
  f.part(limb(EF, WF, 42, 30, { p: [[0.2, 0.3, 0.2]], folds: [[0.12, 'p', 0.3]] }), { fill: coatC, tex: 'mottle23' });
  f.part(plate(EF, WF, 0.72, 1.0, 40, 44), { fill: coatD, cast: false }); // turned-back cuff
  B.hand(f, add(WF, [12, -8]), -0.75, 27, skin, { spread: 0.8, curl: 0.05, fingerCols: [mix(skin, ink6[3], 0.6), mix(skin, ink6[4], 0.6), mix(skin, ink6[5], 0.6), mix(skin, ink6[5], 0.6)], tipCols: [ink6[3], ink6[4], ink6[5], ink6[5]] });
  // torso, open coat over a stained shirt
  f.part(S.shape([[-0.05, 0.3, 0.3], [0.06, 0.6, 0.45], [0.22, 0.56, 0.64], [0.45, 0.5, 0.6], [0.7, 0.46, 0.5], [0.9, 0.56, 0.52], [1.06, 0.6, 0.52]]), { fill: '#8f8670', tex: 'weave23' });
  for (let i = 0; i < 4; i++) f.spatter(S.at(0.1 + i * 0.1, 0.3 + i * 0.12), 10, 5, ink6[i + 1]);
  f.part([S.at(-0.4, -0.04), S.at(0.0, 0.0), S.at(-0.05, 0.6), S.at(0.1, 1.0), S.at(-0.66, 1.0), S.at(-0.7, 0.3)], { fill: coatC, tex: 'mottle23' });
  f.part([S.at(0.35, -0.02), S.at(0.62, 0.15), S.at(0.6, 0.9), S.at(0.38, 1.0), S.at(0.3, 0.5)], { fill: coatC, tex: 'mottle23' });
  for (let i = 0; i < 6; i++) { const q = S.at(-0.02, 0.15 + i * 0.13); f.line(ell(q, 5, 5, 0, 8).concat([ell(q, 5, 5, 0, 8)[0]]), 1.8, ink6[i]); } // sigils inked down the lapel
  f.part([S.at(-0.66, 0.72), S.at(0.6, 0.7), S.at(0.62, 0.79), S.at(-0.68, 0.81)], { fill: '#2c2016', sharp: true });
  // satchel swinging out behind on its strap
  f.line([S.at(0.35, 0.02), S.at(-0.3, 0.5), [140, 560]], 6, '#2f2216');
  f.part([[96, 548], [176, 540], [184, 610], [168, 626], [104, 628], [90, 610]], { fill: '#4a3322', tex: 'mottle23', k: 0.6 });
  f.part([[92, 544], [180, 536], [176, 574], [100, 584]], { fill: '#3a2818', k: 0.6 });
  for (let i = 0; i < 3; i++) f.part(limb([104 + i * 18, 520], [112 + i * 16, 560], 14, 14, { steps: 4 }), { fill: '#d1c09a', shade: 0.4, inkW: 1.4 });
  f.line([[176, 616], [170, 630]], 1.4, INK); G.badge(f, [170, 630], 11, '#74777b', 0.2);
  // head thrown back, shouting, wild hair
  const HC = [314, 252];
  f.part(limb(S.at(0.1, -0.05), add(HC, [-6, 30]), 30, 28), { fill: skin, shade: 0.5 });
  B.head(f, HC, H, -0.32, {
    skin, jaw: 0.95, chin: 0.0, nose: 1.15, hook: 0.7, mouth: 'snarl', squint: -0.4, browDown: -0.05, gaunt: true, age: true, glint: true,
    hairCol: '#3b3128', beard: 'short', beardCol: '#4a3d30', noEar: true,
    hairBack: [[-0.3, -0.3], [-0.62, -0.42], [-0.56, -0.2], [-0.8, -0.12], [-0.6, 0.0], [-0.74, 0.18], [-0.5, 0.16], [-0.5, 0.34], [-0.3, 0.2]],
  });
  // linen coif, ink-blotched, ties flying loose
  const cf = frame(HC, -0.32, H);
  f.part(cf([[-0.42, 0.12], [-0.4, -0.36], [-0.16, -0.58], [0.14, -0.58], [0.34, -0.42], [0.31, -0.3], [0.1, -0.36], [0.0, -0.28], [-0.06, -0.08], [-0.04, 0.2], [-0.02, 0.36], [-0.16, 0.4], [-0.34, 0.32]]), { fill: '#8a7f68', tex: 'weave23', texOp: 0.4 });
  f.line(cf([[-0.12, -0.55], [-0.18, -0.2], [-0.22, 0.3]]), 1.4, INK, { op: 0.7 });
  f.flat(cf(ell([-0.22, -0.3], 0.07, 0.05, 0.4, 8)), '#3a5fb0', { op: 0.55 });
  f.flat(cf(ell([0.12, -0.46], 0.05, 0.035, 0.2, 8)), '#8fb03a', { op: 0.55 });
  f.stroke(cf([[-0.06, 0.36], [-0.22, 0.6], [-0.42, 0.7]]), 3.2, '#8a7f68');
  // near arm flung back and up
  f.part(limb(SN, EN, 46, 38, { q: [[0.4, 0.15, 0.2]], folds: [[0.85, 'p', 0.3]] }), { fill: coatC, tex: 'mottle23' });
  f.part(limb(EN, WN, 42, 30, { q: [[0.2, 0.3, 0.2]], folds: [[0.12, 'q', 0.3]] }), { fill: coatC, tex: 'mottle23' });
  f.part(plate(EN, WN, 0.72, 1.0, 40, 44), { fill: coatD, cast: false });
  // rubric strip knotted round the wrist, tails whipping back
  const rw = lerp(EN, WN, 0.6);
  f.part([add(rw, [-20, -6]), add(rw, [20, -8]), add(rw, [21, 4]), add(rw, [-20, 6])], { fill: '#9a2018', inkW: 1.4, cast: false });
  f.part([add(rw, [-16, 0]), add(rw, [-34, 6]), add(rw, [-52, 2]), add(rw, [-62, 10]), add(rw, [-48, 14]), add(rw, [-32, 14]), add(rw, [-14, 8])], { fill: '#a8261c', inkW: 1.4 });
  f.part([add(rw, [-14, 6]), add(rw, [-30, 22]), add(rw, [-40, 36]), add(rw, [-30, 34]), add(rw, [-12, 12])], { fill: '#86180f', inkW: 1.4 });
  B.hand(f, add(WN, [-4, -14]), -1.75, 27, skin, { spread: 0.85, curl: 0.05, fingerCols: [mix(skin, ink6[0], 0.6), mix(skin, ink6[1], 0.6), mix(skin, ink6[2], 0.6), mix(skin, ink6[2], 0.6)], tipCols: [ink6[0], ink6[1], ink6[2], ink6[2]] });
  // sparks at the fingertips
  for (const c of [[150, 196], [492, 226]]) { f.raw(`<circle cx="${c[0]}" cy="${c[1]}" r="30" fill="#fff2c0" opacity="0.25" filter="url(#soft23)"/>`); for (let i = 0; i < 8; i++) { const a = i * 0.8, l = 10 + f.r() * 14; f.line([add(c, rot([6, 0], a)), add(c, rot([l, 0], a))], 1.8, ink6[i % 6], { straight: true }); } }
  return f;
}

module.exports = {
  heroes: [{ key: 'bulwark', build: bulwark }, { key: 'duelist', build: duelist }, { key: 'elementalist', build: elementalist }],
  lineupX: [30, 440, 890],
  scene: (W, H) => `<defs><radialGradient id="skyB" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#4a3a28"/><stop offset="1" stop-color="#0a0807"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#skyB)"/><rect y="${H - 60}" width="${W}" height="60" fill="#0b0907"/>`,
};
