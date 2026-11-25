// World XI, The Stilled Spire (Frost + Lightning, Lockdown). Every creature in bible/world_XI_stilled_spire.md.
// An observatory whose astronomers tried to stop time. Frost (dominant) freezes bodies mid-motion: cloth, hair and
// gestures stopped, rime on the windward (front) side, icicles plumb. Lightning fuses brass and leaves aurora-coloured
// burns. Palette: brass, pale blue, aurora green, plus ink black, bone and grey.
// Foes are drawn facing right with kit.foeBase (light upper right in drawing space) and flipped. Seeds 1100 + index.
'use strict';
const K = require('../kit');
const W = require('./kit_XI');
const { E, B, G, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P, split, side, ang, elb, hard, band } = W;
const T = K.TIERS;

// ---------------------------------------------------------------- shared figure bits
// a soft leather pilgrim's or guard's shoe in a local frame: x toward the toe, y down, origin at the ankle, s = foot unit.
// pitch turns the foot about its toe (heel lifted). toe: where the toe tip meets the ground. Returns { A (ankle), F }.
function shoe(f, toe, pitch, s, look, o = {}) {
  const loc = [[-0.16, -0.32], [0.22, -0.32], [0.3, 0.04], [0.62, 0.28], [0.95, 0.42], [1.06, 0.52], [1.0, 0.62, 1], [0.5, 0.62], [-0.3, 0.62, 1], [-0.37, 0.44], [-0.24, 0.1]];
  const tipL = [1.03, 0.62], A = sub(toe, rot(mul(tipL, s), pitch)), F = frame(A, pitch, s);
  f.part(F(loc), Object.assign({ k: 0.85 }, look));
  f.part(F([[-0.33, 0.52], [1.02, 0.52], [1.0, 0.64, 1], [-0.3, 0.64, 1]]), Object.assign({}, look, { fill: mix(look.fill, '#0e0c0a', 0.6), inkW: 1, inkHeavy: 1.4, cast: false })); // thin turned sole
  f.line(F([[0.3, 0.04], [0.16, 0.2], [0.24, 0.42]]), 1.1, INK, { op: 0.55 }); // instep crease
  f.line(F([[0.62, 0.28], [0.7, 0.45], [0.66, 0.56]]), 1, INK, { op: 0.5 });
  f.stitches(F([[-0.3, 0.46], [0.4, 0.5], [0.98, 0.52]]), mix(look.fill, '#fff', 0.35), 0.8);
  f.line(F([[0.8, 0.38], [0.98, 0.46]]), 1.4, mix(look.fill, '#fff', 0.4), { op: 0.5 }); // worn-bright toe
  if (o.strap) { f.part(hard(F([[0.08, -0.06], [0.34, 0.0], [0.4, 0.12], [0.1, 0.08]])), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.3), inkW: 1, cast: false })); f.rivet(F([[0.22, 0.04]])[0], 2.2, P.greyL); }
  return { A, F };
}
// puttee wraps spiralling down a shin from a to b over width w
function wraps(f, a, b, w, col, n = 7) {
  for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 0.7) / n; f.stroke([lp(a, b, t0, w * 0.5), lp(a, b, (t0 + t1) / 2 + 0.02, 0), lp(a, b, t1, -w * 0.5)], 2.6, mix(col, '#000', 0.45)); f.line([lp(a, b, t0 + 0.03, w * 0.42), lp(a, b, t1 - 0.02, -w * 0.3)], 1, mix(col, '#fff', 0.3), { op: 0.5 }); }
}

// ------------------------------------------------------------------ STOPPED PILGRIM (cast, human 1.0)
// It crossed the hive plain to watch the stars stop, and stopped with them: caught mid-step, the trailing foot up on its
// toes, the head tipped back to the sky, the far hand lifted toward the stars with the fingers spread. Grey-brown wool
// cloak and shoulder cape stiff with ice, swung back by the step and frozen there, icicles hanging plumb from the lifted
// hems. Pilgrim's staff with a dried gourd on a cord, a scrip on a strap, a string of lead tokens, a brass star badge
// on the turned-up hat brim (struck and fused). Eyes wide open under a white film; an aurora burn climbs the neck.
// Rig: humanoid + staff (hand_n), gourd (staff), hat (head), cloak and cape (torso), skirt and scrip (pelvis).
// Motion: idle is stillness then a jerk; attack is a staff blow (near arm swings the staff down).
function stoppedPilgrim() {
  const seed = 1103, [CW, CH] = T.human, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 100;
  const N = [304, 272], C = [284, 372], Pv = [290, 472];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.32, 0.12), SF = S.at(0.36, 0.1);
  const EN = [334, 392], WN = [437, 404];
  const EF = [404, 252], WF = [452, 182];
  const HN = S.at(-0.2, 1.0), HF = S.at(0.28, 0.98);
  const KF = [374, 612], AF = [398, 742];
  const KN = [216, 616];
  const st0 = [468, gy - 2], st1 = [430, 226], stA = ang(st0, st1); // staff foot planted ahead of the front foot
  const HC = [326, 208], hA = -0.52;
  const SKN = (o = {}) => W.SKI(f, Object.assign({ shadow: '#5a6074' }, o)), WO = (o = {}) => W.WOOL(f, o), WOD = (o = {}) => W.WOOL(f, Object.assign({ fill: P.woolD, shadow: '#26221e' }, o));
  const hose = { fill: '#5a564e', shadow: '#2a2826', shade: 0.4, tex: 'weave' + seed, texOp: 0.5 };
  const leather = W.LEA(f, { fill: '#4e4238' });

  // the trailing near foot is up on its toes; work its ankle from the toe contact
  const nearToe = [214, gy], nearPitch = 0.62;
  const AN = sub(nearToe, rot(mul([1.03, 0.62], 52), nearPitch));
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.15, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('staff', WN, 'hand_n').joint('gourd', add(st1, [0, 26]), 'staff').joint('hat', add(HC, [0, -30]), 'head');
  f.joint('cloak', S.at(-0.3, 0.06), 'torso').joint('cape', S.at(0, 0.02), 'torso').joint('skirt', S.at(0, 0.82), 'pelvis').joint('scrip', S.at(-0.5, 0.86), 'pelvis');

  // ---- cloak, swung back by the step and frozen there (behind everything)
  f.bone('cloak');
  const ck = [S.at(-0.2, -0.02), S.at(-0.66, 0.1), [180, 380], [128, 470], [86, 560], [70, 600, 1], [96, 596], [104, 616, 1], [128, 598], [146, 628, 1], [170, 604], [196, 634, 1], [214, 600], S.at(-0.2, 0.9), S.at(0.2, 0.6), S.at(0.3, 0.2)];
  f.part(ck, WOD({ k: 0.85 }));
  W.clipDraw(f, ck, () => {
    for (const g of [[[236, 300], [176, 440], [112, 586]], [[256, 320], [210, 470], [160, 612]], [[270, 360], [240, 480], [204, 620]], [[216, 300], [150, 420], [90, 580]]]) W.fold(f, g, 2.2);
    for (const g of [[[150, 420], [120, 500], [100, 580]], [[196, 430], [176, 520], [148, 600]]]) { f.stroke(g, 5, '#000', { op: 0.25 }); f.line(g.map(q => add(q, [4, 0])), 1.2, P.woolL, { op: 0.45 }); }
    f.flat([[60, 560], [230, 590], [230, 660], [60, 640]], '#1a1c20', { op: 0.35 }); // wet, dirtied hem
    f.part(hard([[200, 470], [236, 464], [240, 500], [204, 506]]), WO({ fill: '#5a5248', cast: false, inkW: 1.1 })); f.stitches([[200, 470], [236, 464], [240, 500], [204, 506], [200, 470]], '#a89a84', 0.8); // darned patch
    W.rimeCrust(f, [[180, 384], [130, 470], [90, 556]], 7, [-0.3, -1]);
  });
  W.icicles(f, [[86, 562], [100, 600], [128, 600], [170, 606], [210, 602]], 9, 10, 30);

  // ---- far leg, stepping forward: wool hose, puttee wraps, a shoe planted flat
  f.bone('thigh_f');
  W.legTube(f, HF, KF, lerp(KF, AF, 0.92), [76, 56, 42], hose, '_f', { A: AF, bq: [[1, 0.3, 0.16, 0.18]], bp: [[0, 0.4, 0.08, 0.2]] });
  f.bone('shin_f'); wraps(f, lerp(KF, AF, 0.25), lerp(KF, AF, 0.95), 50, '#6a6252');
  W.rimeCrust(f, [lp(KF, AF, 0.1, -22), lp(KF, AF, 0.5, -20), lp(KF, AF, 0.9, -16)], 6, [1, -0.2]);
  f.bone('foot_f');
  shoe(f, [AF[0] + 56, gy], 0, 52, leather, { strap: true });
  // ---- far arm raised to the sky, open hand, fingers spread, frozen
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [46, 38, 30], WO({ fill: P.woolD }), '_f');
  f.bone('forearm_f');
  // the sleeve's cuff stands off the wrist, frozen in the swing; icicles hang plumb from it
  const cuff = [lp(EF, WF, 0.62, 24), lp(EF, WF, 0.9, 26), lp(EF, WF, 0.92, -22), lp(EF, WF, 0.66, -20)];
  f.part(cuff, WO({ fill: P.woolD, k: 0.7 }));
  W.icicles(f, [lp(EF, WF, 0.64, -20), lp(EF, WF, 0.9, -22)], 3, 8, 18);
  f.bone('hand_f');
  const hd = B.hand(f, add(WF, [4, -10]), ang(EF, WF) - 0.12, 30, P.skinI, { spread: 0.5, curl: 0.25, shadow: P.skinIS });
  for (const t of hd.tips) W.icicle(f, add(t, [0, 2]), 7 + f.r() * 6, 3.2);
  W.facets(f, add(WF, [6, -8]), 14, 12, 3, { s: 0.6 });

  // ---- near leg, trailing on its toes
  f.bone('thigh_n');
  W.legTube(f, HN, KN, lerp(KN, AN, 0.92), [78, 58, 42], Object.assign({}, hose, { fill: '#625e56' }), '_n', { A: AN, bp: [[1, 0.3, 0.18, 0.18]], bq: [[0, 0.45, 0.08, 0.2]] });
  f.bone('shin_n'); wraps(f, lerp(KN, AN, 0.25), lerp(KN, AN, 0.95), 52, '#706856');
  f.flat(ell(lerp(KN, AN, 0.7), 20, 30, ang(KN, AN), 12), P.mud, { op: 0.3 });
  W.rimeCrust(f, [lp(KN, AN, 0.15, -24), lp(KN, AN, 0.6, -20)], 6, [1, -0.2]);
  f.bone('foot_n');
  shoe(f, nearToe, nearPitch, 52, Object.assign({}, leather, { fill: '#564a3e' }));

  // ---- tunic body and skirt
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.3, 0.32], [0.06, 0.6, 0.52], [0.2, 0.62, 0.72], [0.42, 0.55, 0.68], [0.65, 0.5, 0.58], [0.85, 0.56, 0.58], [1.04, 0.6, 0.56]]);
  f.part(torso, WO());
  W.clipDraw(f, torso, () => { W.fold(f, [S.at(0.1, 0.3), S.at(0.3, 0.5), S.at(0.25, 0.74)], 1.8); W.fold(f, [S.at(-0.2, 0.35), S.at(-0.1, 0.6)], 1.6); W.hoar(f, S.at(0.5, 0.3), 30, 50, 0.6); });
  f.bone('skirt');
  const sk = [S.at(-0.58, 0.8), S.at(0.6, 0.8), add(S.at(0.66, 1.0), [18, 30]), [402, 600], [380, 618, 1], [360, 604], [338, 622, 1], [304, 604], [276, 620, 1], [250, 604], [222, 616, 1], [206, 596], add(S.at(-0.66, 1.0), [-12, 20])];
  // the skirt swings back with the step (frozen): its front kicked forward over the striding knee
  f.part(sk, WO({ fill: '#746a5c' }));
  W.clipDraw(f, sk, () => { for (const g of [[[300, 520], [314, 560], [304, 610]], [[260, 520], [246, 570], [252, 612]], [[350, 520], [372, 570], [376, 606]]]) W.fold(f, g, 1.8); f.flat([[190, 580], [420, 580], [420, 630], [190, 630]], P.mud, { op: 0.35 }); for (const g of [[[230, 540], [226, 600]], [[330, 540], [340, 612]], [[286, 560], [282, 612]]]) W.fold(f, g, 1.4); f.part(hard([[318, 552], [350, 548], [352, 580], [320, 584]]), WO({ fill: '#5e564a', cast: false, inkW: 1 })); f.stitches([[318, 552], [350, 548], [352, 580], [320, 584], [318, 552]], '#a89a84', 0.8); W.rimeCrust(f, [[372, 520], [396, 560], [404, 598]], 6, [1, -0.2]); });
  W.icicles(f, [[222, 614], [276, 616], [338, 618], [380, 614]], 4, 8, 22);
  // belt, scrip strap, tokens
  f.bone('pelvis');
  const belt = [S.at(-0.6, 0.78), S.at(0.58, 0.76), S.at(0.6, 0.84), S.at(-0.62, 0.86)];
  f.part(belt, W.LEA(f, { sharp: true }));
  f.part(hard([S.at(0.2, 0.76), S.at(0.34, 0.76), S.at(0.34, 0.85), S.at(0.2, 0.85)]), W.BRD(f, { inkW: 1.1, cast: false }));
  // string of lead pilgrim tokens hanging from the belt (plumb)
  f.bone('scrip');
  const sc = S.at(-0.55, 0.94), scrip = [add(sc, [-30, -14]), add(sc, [26, -18]), add(sc, [30, 44]), add(sc, [8, 54]), add(sc, [-28, 48])];
  f.part(scrip, W.LEA(f, { fill: '#5a4c3e', k: 0.6 }));
  f.part([add(sc, [-32, -16]), add(sc, [28, -20]), add(sc, [26, 14]), add(sc, [-30, 18])], W.LEA(f, { fill: '#4a3e32', k: 0.5, cast: false }));
  f.stitches([add(sc, [-26, 12]), add(sc, [22, 8])], '#a89880', 0.8);
  W.icicles(f, [add(sc, [-26, 50]), add(sc, [8, 54])], 3, 8, 16);
  f.bone('torso');
  W.rope(f, [S.at(0.3, 0.04), S.at(0.0, 0.36), S.at(-0.4, 0.7), add(sc, [-20, -14])], 4, { col: '#5a4c3e' }); // the scrip strap across the chest

  // ---- shoulder cape over the cloak top: stiff, lifted at the back, icicles plumb
  f.bone('cape');
  const cp = [S.at(-0.1, -0.1), S.at(0.5, -0.04), S.at(0.8, 0.14), S.at(0.86, 0.36), S.at(0.6, 0.4), S.at(0.3, 0.44), S.at(-0.2, 0.42), S.at(-0.6, 0.36), [196, 330], S.at(-0.7, 0.08)];
  f.part(cp, WO({ fill: '#7c7262', k: 0.8 }));
  W.clipDraw(f, cp, () => { W.fold(f, [S.at(0.3, 0.0), S.at(0.4, 0.3)], 1.6); W.fold(f, [S.at(-0.2, 0.02), S.at(-0.3, 0.36)], 1.6); W.fold(f, [S.at(-0.5, 0.1), [210, 320]], 1.6); W.hoar(f, S.at(0.5, 0.1), 40, 20, 0.8); });
  W.rimeCrust(f, [S.at(0.0, -0.1), S.at(0.5, -0.04), S.at(0.82, 0.14), S.at(0.86, 0.34)], 9, [1, -0.3]);
  W.icicles(f, [S.at(0.84, 0.36), S.at(0.3, 0.44), S.at(-0.3, 0.42), [200, 332]], 7, 8, 24);
  // a second pilgrim token pinned on the cape: lead ampulla
  for (const [u, v, k] of [[0.18, 0.22, 0], [0.4, 0.26, 1], [0.04, 0.3, 2], [0.58, 0.2, 1]]) { const q = S.at(u, v); if (k === 0) f.part(ell(q, 7, 9, 0, 10), { fill: '#8a8c90', shadow: '#3a3c44', shade: 0.4, inkW: 1.1, cast: false }); else f.part(hard([add(q, [-6, 9]), add(q, [-6, -2]), add(q, [0, -9]), add(q, [6, -2]), add(q, [6, 9])]), { fill: k === 1 ? '#8a8c90' : '#7a7c80', shadow: '#3a3c44', shade: 0.4, inkW: 1.1, cast: false }); f.flat(ell(add(q, [0, 2]), 2, 3, 0, 6), '#1a1a1e'); f.line([add(q, [-7, -6]), add(q, [-4, -9])], 0.9, '#c8bca4', { op: 0.8 }); } // lead pilgrim tokens sewn on the cape

  // ---- head tipped back to the sky: wide frosted eyes under a film, mouth fallen open, frost in the beard
  f.bone('head');
  f.part(limb(S.at(0.12, -0.04), add(HC, [-6, 34]), 40, 34), SKN());
  W.lichtenberg(f, S.at(0.0, 0.02), -1.9, 60, 2.6, { depth: 2 }); // the burn climbs the neck from under the cape
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: P.skinI, jaw: 1.06, chin: 0.01, nose: 1.08, hook: 0.25, mouth: 'set', squint: -0.4, browDown: -0.06, age: true, gaunt: true, faceShade: 0.8, jawShade: 0.32,
    eyeWhite: '#e6eef2', iris: '#5a6a78', hairCol: '#7a7268', browCol: '#cfd8dc', beard: 'short', beardCol: '#8e877c', noEar: false,
  });
  // the mouth hangs open in awe
  f.flat(hF([[0.17, 0.27], [0.25, 0.262], [0.31, 0.275], [0.3, 0.33], [0.23, 0.35], [0.18, 0.32]]), '#141418');
  f.flat(hF([[0.19, 0.27], [0.26, 0.265], [0.28, 0.28], [0.2, 0.285]]), P.bone, { op: 0.7 }); // teeth edge
  // the frosted film over the open eyes and the rime on brows, lashes and beard
  f.flat(hF(ell([0.12, -0.058], 0.05, 0.028, 0, 10)), '#dfe8ee', { op: 0.35 });
  f.flat(hF(ell([0.29, -0.062], 0.022, 0.02, 0, 8)), '#dfe8ee', { op: 0.3 });
  W.clipDraw(f, hF([[-0.2, 0.18], [0.36, 0.2], [0.34, 0.62], [0.0, 0.6], [-0.2, 0.36]]), () => W.hoar(f, hF([[0.16, 0.42]])[0], 40, 22, 0.45));
  for (const q of hF([[0.3, 0.5], [0.22, 0.56], [0.12, 0.56], [0.36, 0.17]])) W.icicle(f, q, 8 + f.r() * 8, 3);
  W.facets(f, hF([[0.12, 0.1]])[0], 16, 14, 3, { s: 0.5, op: 0.25 });
  // hat: low felt crown, wide brim, the front turned up and pinned with a brass star badge
  f.bone('hat');
  const brim = hF([[-0.78, -0.28], [-0.5, -0.38], [-0.1, -0.42], [0.3, -0.42], [0.34, -0.33], [-0.1, -0.27], [-0.5, -0.21], [-0.8, -0.2]]);
  f.part(brim, WOD({ fill: '#3e3a34', k: 0.8 }));
  f.line(hF([[-0.74, -0.25], [-0.3, -0.31], [0.25, -0.36]]), 1.4, '#7a7468', { op: 0.6 }); // worn brim edge
  const crown = hF([[-0.4, -0.36], [-0.38, -0.6], [-0.24, -0.76], [0.04, -0.8], [0.22, -0.7], [0.28, -0.38]]);
  f.part(crown, WOD({ fill: '#4a453e' }));
  W.clipDraw(f, crown, () => { f.line(hF([[-0.1, -0.78], [-0.04, -0.6], [0.02, -0.42]]), 2, INK, { op: 0.6 }); W.hoar(f, hF([[0.0, -0.72]])[0], 26, 12, 0.6); });
  f.part(hF([[-0.39, -0.46], [0.26, -0.5], [0.28, -0.41], [-0.4, -0.38]]), W.LEA(f, { cast: false })); // hat band
  // the front brim turned up against the crown, pinned there by the badge
  const up = hF([[0.2, -0.36], [0.14, -0.62], [0.2, -0.88], [0.42, -0.94], [0.6, -0.8], [0.6, -0.52], [0.44, -0.34]]);
  f.part(up, WOD({ fill: '#4e483f', k: 0.8 }));
  W.clipDraw(f, up, () => { f.line(hF([[0.26, -0.4], [0.24, -0.66], [0.3, -0.86]]), 1.6, INK, { op: 0.5 }); f.line(hF([[0.56, -0.54], [0.58, -0.78]]), 1.4, '#8a8476', { op: 0.5 }); });
  const bc = hF([[0.38, -0.64]])[0];
  f.part(ell(bc, 11, 11, 0, 12), W.BR(f, { inkW: 1.2, cast: false }));
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; f.line([bc, add(bc, rot([13, 0], a))], 2.4, i % 2 ? P.brassD : P.brassL); }
  f.part(ell(bc, 5, 5, 0, 10), W.BR(f, { fill: P.brassL, inkW: 1, cast: false }));
  W.fusedBead(f, add(bc, [8, 8]), 3);
  W.lichtenberg(f, add(bc, [-6, 6]), 2.4, 30, 1.6, { metal: true, depth: 2 });
  W.rimeCrust(f, hF([[-0.4, -0.64], [-0.24, -0.78], [0.04, -0.82]]), 7, [1, -0.3]);
  W.rimeCrust(f, hF([[0.22, -0.9], [0.42, -0.96], [0.6, -0.82]]), 6, [1, -0.3]);
  W.icicles(f, hF([[-0.78, -0.22], [-0.4, -0.23], [-0.1, -0.27]]), 5, 10, 26);

  // ---- staff, planted ahead: ash pole, iron ferrule, a knob, a dried gourd on a cord
  f.bone('staff');
  f.part(limb(st0, st1, 14, 15, { steps: 8 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.part(limb(st0, lerp(st0, st1, 0.06), 15, 15, { steps: 3, capK: 0.3 }), W.IR(f, { inkW: 1.2, cast: false }));
  f.part(ell(st1, 13, 15, 0, 12), { fill: P.woodL, shadow: P.woodD, shade: 0.42, tex: 'wood' + seed });
  W.rimeCrust(f, [lp(st0, st1, 0.85, -8), lp(st0, st1, 0.5, -8), lp(st0, st1, 0.15, -8)], 5, [1, -0.2]);
  for (const t of [0.52, 0.62]) f.line([lp(st0, st1, t, -8), lp(st0, st1, t + 0.012, 8)], 3, '#5a4c3e', { straight: true });
  f.scratches(lerp(st0, st1, 0.3), 10, 4, P.woodL);
  W.icicles(f, [lp(st0, st1, 0.94, -6), lp(st0, st1, 0.94, 8)], 2, 10, 18);
  f.bone('gourd');
  const gc = add(st1, [16, 58]);
  W.rope(f, [add(st1, [6, 12]), add(st1, [14, 30]), add(gc, [0, -26])], 2.4, { col: '#5a4c3e' });
  f.part([add(gc, [-6, -28]), add(gc, [6, -28]), add(gc, [8, -14]), add(gc, [18, 2]), add(gc, [16, 22]), add(gc, [0, 30]), add(gc, [-16, 22]), add(gc, [-18, 2]), add(gc, [-8, -14])], { fill: '#8e8264', shadow: '#3e3628', shade: 0.42, tex: 'mottle' + seed, texOp: 0.6 });
  f.part(limb(add(gc, [0, -34]), add(gc, [0, -24]), 8, 9, { steps: 3 }), { fill: P.woodD, shadow: '#120e0a', shade: 0.3, inkW: 1, cast: false }); // stopper
  W.rimeCrust(f, [add(gc, [4, -20]), add(gc, [16, 0]), add(gc, [14, 20])], 5, [1, -0.2]);
  W.icicle(f, add(gc, [0, 29]), 18, 5, { drop: true });

  // ---- near arm, gripping the staff
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [54, 50, 42], WO({ fill: '#80776a' }), '_n', { bp: [[0, 0.5, 0.12, 0.2], [1, 0.45, 0.22, 0.25]], bq: [[0, 0.3, 0.1, 0.2], [1, 0.2, 0.08, 0.2]] });
  f.bone('forearm_n');
  // the loose sleeve sags under the forearm, frozen stiff in a hanging fold
  const dr = [lp(EN, WN, 0.12, 18), lp(EN, WN, 0.45, 30), lp(EN, WN, 0.6, 44), lp(EN, WN, 0.74, 34), lp(EN, WN, 0.86, 20)];
  f.part([...dr, lp(EN, WN, 0.86, 10), lp(EN, WN, 0.12, 10)], WO({ fill: '#746b5e', cast: false, k: 0.8 }));
  W.fold(f, [lp(EN, WN, 0.3, 14), lp(EN, WN, 0.55, 34)], 1.4);
  W.icicles(f, [dr[1], dr[2], dr[3]], 3, 10, 24);
  f.part(K.chain([lp(EN, WN, 0.8, 0), lp(EN, WN, 0.97, 0)], [50, 46]), WO({ fill: '#8a8072', cast: false })); // turned-back cuff
  f.line([lp(EN, WN, 0.82, -22), lp(EN, WN, 0.82, 24)], 1.4, INK, { op: 0.6, straight: true });
  f.bone('upperarm_n'); W.fold(f, [lp(SN, EN, 0.5, 12), lp(SN, EN, 0.7, -4)], 1.6);
  f.bone('forearm_n'); W.fold(f, [lp(EN, WN, 0.1, 14), lp(EN, WN, 0.2, -12)], 1.6);
  W.rimeCrust(f, [lp(EN, WN, 0.15, -18), lp(EN, WN, 0.8, -15)], 6, [1, -0.3]);
  W.icicles(f, [lp(SN, EN, 0.95, 18), lp(EN, WN, 0.4, 16), lp(EN, WN, 0.85, 14)], 4, 8, 20);
  f.bone('hand_n');
  B.grip(f, WN, EN, stA, 28, P.skinI, { shadow: P.skinIS, tex: 'mottle' + seed, texOp: 0.4, name: 'pilgrim staff' });
  W.facets(f, WN, 10, 10, 2, { s: 0.5 });

  f.bone('root');
  f.flat(ell([300, gy + 4], 170, 12, 0, 18), '#000', { op: 0.28 });
  return f;
}

// a guard's halberd head at the shaft end Hd, axis u (unit, toward the tip): socket and langets, an axe blade on the +n
// side, a back fluke on the -n side, a top spike. Icicles hang plumb from the blade. Returns the local frame.
function halberdHead(f, Hd, u, s, o = {}) {
  const Fh = frame(Hd, Math.atan2(u[1], u[0]), s), stl = W.ST(f), std = W.ST(f, { fill: P.steelD, shadow: '#1e242a' });
  f.part(Fh([[-70, -9], [-8, -10], [-4, -6], [-4, 6], [-8, 10], [-70, 9]]), W.IR(f, { inkW: 1.3 })); // socket
  for (const y of [-7, 7]) f.part(hard(Fh([[-130, y - 3], [-60, y - 3], [-60, y + 3], [-130, y + 3]])), W.IR(f, { inkW: 1, cast: false })); // langets
  for (const x of [-120, -94, -66]) f.rivet(Fh([[x, 0]])[0], 2.2, P.steelL);
  const blade = Fh([[-56, 6], [-58, 22], [-80, 44], [-92, 70, 1], [-60, 66], [-30, 72], [0, 82], [26, 90, 1], [30, 60], [22, 28], [10, 6]]);
  const d = f.part(blade, Object.assign({}, stl, { k: 0.7 }));
  W.bevel(f, d, E.bbox(blade), 2.5, { lite: P.steelL, lite2: '#f2f6f8' });
  W.clipDraw(f, blade, () => { f.line(Fh([[-86, 66], [-50, 62], [-10, 72], [22, 84]]), 3, P.steelL, { op: 0.75 }); f.line(Fh([[-40, 14], [-46, 40], [-30, 56]]), 1.4, INK, { op: 0.5 }); W.soot(f, Fh([[-20, 30]])[0], 22, 14, 0.4); W.lichtenberg(f, Fh([[-40, 20]])[0], Math.atan2(u[1], u[0]) + 1.2, 40, 1.8, { metal: true, depth: 2 }); f.flat(Fh([[-14, 70], [-4, 66], [0, 76]]), '#101418'); f.flat(Fh([[-56, 60], [-48, 58], [-46, 66]]), '#101418'); });
  f.part(Fh([[-50, -6], [-44, -26], [-26, -44], [-6, -60, 1], [-20, -36], [-30, -10]]), Object.assign({}, std, { k: 0.7 })); // back fluke
  f.part(Fh([[-6, -7], [60, -5], [130, 0, 1], [60, 5], [-6, 7]]), Object.assign({}, stl, { k: 0.6 })); // top spike
  f.line(Fh([[0, 0], [118, 0]]), 1, P.steelL, { op: 0.7, straight: true });
  return Fh;
}

// ------------------------------------------------------------------ FROZEN HALBERDIER (cast, human 1.05)
// An observatory guard frozen mid-patrol, still marching: the near knee lifted high in the step, the halberd sloped on
// the near shoulder, the far fist swung forward. Quilted coat frozen white, its skirt kicked up by the knee and stopped
// there with icicles hanging plumb from it; kettle hat with a ringed brim, rime on its crown, icicles off the brim and off
// the halberd blade. Guard kit: brass observatory badge on the chest, baldric and short falchion, a night lantern on the
// belt with its glass frosted blind, a whistle on a cord. Lightning struck the hat: an aurora burn over the crown, fused
// rivets on the brim. Rig: humanoid + halberd (hand_n), skirt, lantern (pelvis), sword (pelvis).
// Motion: idle is marching in place; attack is a halberd hook (the halberd comes down off the shoulder and pulls back).
function frozenHalberdier() {
  const seed = 1107, [CW, CH] = T.human, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 104;
  const N = [318, 290], C = [304, 382], Pv = [296, 470];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.34, 0.1);
  const EN = [292, 420], WN = [352, 394];
  const EF = [384, 386], WF = [424, 452];
  const HF = S.at(0.22, 0.98), KF = [306, 622], AF = [292, 744];
  const HN = S.at(-0.12, 1.0), KN = [404, 556], AN = [390, 682];
  const HC = [348, 228], hA = 0.04;
  const sh0 = [430, 512], shU = E.norm([-0.54, -0.84]), sh1 = add([352, 394], mul(shU, 330)); // butt, axis toward the head
  const coat = { fill: '#8c9294', shadow: '#3e434c', light: P.iceL, shade: 0.4, tex: 'quilt' + seed, texOp: 0.85 };
  const coatD = Object.assign({}, coat, { fill: '#7e858a' });
  const trou = { fill: '#4c4e52', shadow: '#22242a', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 };
  const bootC = '#3c342e';
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.2, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('halberd', WN, 'hand_n').joint('skirt', S.at(0, 0.82), 'pelvis').joint('lantern', S.at(-0.6, 0.86), 'pelvis').joint('sword', S.at(-0.3, 0.84), 'pelvis');

  // ---- far arm swung forward, gloved fist (behind the body)
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [50, 46, 40], coatD, '_f', { bp: [[0, 0.5, 0.12, 0.2]], bq: [[1, 0.3, 0.1, 0.2]] });
  f.bone('forearm_f');
  f.part(K.chain([lp(EF, WF, 0.72), lp(EF, WF, 0.95)], [50, 46]), W.LEA(f, { cast: false })); // glove cuff
  W.rimeCrust(f, [lp(SF, EF, 0.3, -24), lp(EF, WF, 0.2, -22), lp(EF, WF, 0.7, -22)], 6, [1, -0.3]);
  W.icicles(f, [lp(EF, WF, 0.1, 22), lp(EF, WF, 0.7, 22)], 3, 8, 18);
  f.bone('hand_f');
  B.fist(f, WF, ang(EF, WF), 26, '#4a3e36', { shadow: '#221a16', tex: 'craze' + seed, texOp: 0.3 });

  // ---- far leg, planted and straight: it carries the weight
  f.bone('thigh_f');
  W.legTube(f, HF, KF, lerp(KF, AF, 0.5), [80, 58, 50], trou, '_f', { A: AF, bq: [[0, 0.4, 0.08, 0.2]] });
  f.bone('shin_f');
  W.bootRig(f, KF, AF, 56, bootC, '_f', { knee: add(KF, [2, 26]), kneeW: 52, tex: 'mottle' + seed });
  f.bone('shin_f'); W.rimeCrust(f, [lp(KF, AF, 0.25, -27), lp(KF, AF, 0.85, -24)], 6, [1, -0.2]);

  // ---- body: quilted coat
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.34], [0.05, 0.7, 0.6], [0.2, 0.74, 0.8], [0.42, 0.66, 0.8], [0.65, 0.6, 0.7], [0.85, 0.64, 0.66], [1.04, 0.66, 0.62]]);
  f.part(torso, coat);
  W.clipDraw(f, torso, () => {
    for (let i = 0; i < 5; i++) f.line([S.at(-0.66 + i * 0.3, 0.06), S.at(-0.6 + i * 0.3, 0.5), S.at(-0.62 + i * 0.3, 0.9)], 1.8, INK, { op: 0.45 }); // quilting channels
    W.hoar(f, S.at(0.55, 0.3), 30, 50, 0.6);
    f.flat(ell(S.at(0.3, 0.62), 18, 12, 0.4, 10), '#5a5a52', { op: 0.35 }); f.flat(ell(S.at(-0.2, 0.8), 22, 10, 0, 10), '#4a463e', { op: 0.3 }); // old stains
    f.part(hard([S.at(0.1, 0.48), S.at(0.34, 0.46), S.at(0.36, 0.66), S.at(0.12, 0.68)]), Object.assign({}, coat, { fill: '#7a7e7c', cast: false, inkW: 1 })); f.stitches([S.at(0.1, 0.48), S.at(0.34, 0.46), S.at(0.36, 0.66), S.at(0.12, 0.68), S.at(0.1, 0.48)], '#c8ccc8', 0.8);
    W.lichtenberg(f, S.at(-0.6, 0.2), 1.3, 80, 2.6, { depth: 3, col: '#2a3036' }); // the strike went down the back
    f.flat(ell(S.at(-0.5, 0.44), 6, 4, 0, 8), '#14161a'); f.flat(ell(S.at(-0.36, 0.56), 4, 3, 0, 8), '#14161a'); // burn holes
  });
  W.rimeCrust(f, [S.at(0.3, 0.02), S.at(0.76, 0.18), S.at(0.8, 0.5), S.at(0.7, 0.8)], 8, [1, -0.2]);
  // brass observatory badge on the chest: a star in a ring
  const bd = S.at(0.48, 0.3);
  f.part(ell(bd, 14, 14, 0, 14), W.BR(f, { inkW: 1.3, cast: false }));
  f.line(ell(bd, 9, 9, 0, 14).concat([ell(bd, 9, 9, 0, 14)[0]]), 1.4, P.brassD);
  for (let i = 0; i < 8; i++) f.line([bd, add(bd, rot([i % 2 ? 6 : 12, 0], i * Math.PI / 4 - 0.2))], 1.6, i % 2 ? P.brassD : P.brassP);
  // whistle on a cord from the collar
  W.rope(f, [S.at(0.2, 0.0), S.at(0.36, 0.14), S.at(0.3, 0.26)], 1.6, { col: '#5a4c3e' });
  f.part(limb(S.at(0.3, 0.26), S.at(0.24, 0.36), 7, 6, { steps: 3 }), W.BR(f, { inkW: 1, cast: false }));
  // baldric across the chest
  f.part([S.at(0.5, 0.0), S.at(0.66, 0.02), S.at(-0.5, 0.86), S.at(-0.66, 0.82)], W.LEA(f, { sharp: true }));
  f.rivet(S.at(0.1, 0.4), 2.6, P.brassL);
  // high quilted collar
  f.part([S.at(-0.36, -0.12), S.at(0.5, -0.12), S.at(0.6, 0.06), S.at(-0.42, 0.08)], Object.assign({}, coat, { fill: '#a8aeb0', cast: false }));
  W.rimeCrust(f, [S.at(-0.3, -0.13), S.at(0.5, -0.12), S.at(0.62, 0.04)], 6, [1, -0.3]);

  // ---- falchion in its scabbard on the hip (behind the skirt edge)
  f.bone('sword');
  const sw0 = S.at(-0.4, 0.86), sw1 = add(sw0, [-82, 150]);
  f.part(limb(sw0, sw1, 20, 14, { steps: 6, capK: 0.5 }), W.LEA(f, { fill: '#3a302a' }));
  f.part(limb(lerp(sw0, sw1, 0.88), sw1, 18, 16, { steps: 3, capK: 0.6 }), W.ST(f, { cast: false })); // chape
  f.part(limb(sw0, add(sw0, [18, -34]), 9, 9, { steps: 3 }), W.LEA(f, { fill: '#2a2220', cast: false })); // grip
  f.part(hard([add(sw0, [-14, 4]), add(sw0, [16, -6]), add(sw0, [18, 0]), add(sw0, [-12, 10])]), W.ST(f, { cast: false })); // cross

  // ---- skirt of the coat, kicked up by the lifted knee and frozen there
  f.bone('skirt');
  const sk = [S.at(-0.66, 0.8), S.at(0.6, 0.78), add(S.at(0.62, 0.9), [30, 10]), [420, 536], [436, 556, 1], [404, 566], [366, 582, 1], [330, 600], [296, 624, 1], [268, 612], [240, 630, 1], [216, 614], add(S.at(-0.7, 1.0), [-14, 30])];
  f.part(sk, coat);
  W.clipDraw(f, sk, () => {
    for (let i = 0; i < 5; i++) f.line([lerp(S.at(-0.6 + i * 0.28, 0.82), [228 + i * 46, 600], 0.0), [232 + i * 46, 610 - i * 10]], 1.6, INK, { op: 0.45 });
    W.fold(f, [[350, 520], [374, 560]], 1.8); W.fold(f, [[300, 540], [286, 610]], 1.6);
    f.flat([[200, 590], [440, 540], [440, 640], [200, 640]], P.mud, { op: 0.3 });
    W.hoar(f, [400, 540], 30, 20, 0.5); f.flat(ell([300, 580], 16, 10, 0.3, 10), '#4a463e', { op: 0.35 });
  });
  W.icicles(f, [[436, 556], [404, 566], [366, 582], [330, 600], [296, 624]], 6, 10, 30);
  // belt with buckle
  f.bone('pelvis');
  f.part([S.at(-0.7, 0.78), S.at(0.64, 0.76), S.at(0.66, 0.85), S.at(-0.72, 0.87)], W.LEA(f, { sharp: true }));
  f.part(hard([S.at(0.26, 0.75), S.at(0.42, 0.75), S.at(0.42, 0.87), S.at(0.26, 0.87)]), W.ST(f, { inkW: 1.1, cast: false }));
  f.line([S.at(0.3, 0.78), S.at(0.38, 0.84)], 1.4, INK);

  // ---- night lantern on the belt, glass frosted blind, plumb
  f.bone('lantern');
  const lt = add(S.at(-0.6, 0.86), [0, 10]);
  f.line([lt, add(lt, [0, 18])], 2.4, P.ironL);
  const lb = add(lt, [0, 18]);
  f.part(hard([add(lb, [-16, 0]), add(lb, [16, 0]), add(lb, [20, 10]), add(lb, [-20, 10])]), W.IR(f, { inkW: 1.2 }));
  const gl = hard([add(lb, [-17, 10]), add(lb, [17, 10]), add(lb, [15, 56]), add(lb, [-15, 56])]);
  f.part(gl, { fill: '#c8d6de', shadow: '#5a6a7a', light: '#f2f8fa', shade: 0.35, inkW: 1.2, tex: 'rime' + seed, texOp: 0.8, hatch: false });
  W.clipDraw(f, gl, () => { f.flat(ell(add(lb, [0, 36]), 6, 10, 0, 10), '#2a2a2e', { op: 0.6 }); W.frostCracks(f, add(lb, [0, 30]), 12, 18, 3); }); // the dead wick behind the frost
  for (const x of [-16, 0, 16]) f.line([add(lb, [x, 10]), add(lb, [x * 0.9, 56])], 2, P.iron);
  f.part(hard([add(lb, [-20, 56]), add(lb, [20, 56]), add(lb, [16, 66]), add(lb, [-16, 66])]), W.IR(f, { inkW: 1.2 }));
  W.icicles(f, [add(lb, [-16, 66]), add(lb, [16, 66])], 3, 8, 22);

  // ---- near leg, knee lifted high mid-march, the boot in the air
  f.bone('thigh_n');
  W.legTube(f, HN, KN, lerp(KN, AN, 0.45), [84, 60, 52], Object.assign({}, trou, { fill: '#56585c' }), '_n', { A: AN, bp: [[0, 0.5, 0.1, 0.2]] });
  f.bone('shin_n');
  W.bootRig(f, KN, AN, 56, '#443a32', '_n', { knee: add(KN, [8, 22]), kneeW: 54, tex: 'mottle' + seed, groundY: AN[1] + 52, strap: true });
  f.bone('shin_n'); W.rimeCrust(f, [lp(KN, AN, 0.2, -30), lp(KN, AN, 0.85, -26)], 6, [1, -0.2]);
  f.bone('foot_n'); W.icicles(f, [add(AN, [-20, 52]), add(AN, [60, 52])], 4, 6, 14);

  // ---- head: hard old face set forward, frozen moustache, kettle hat
  f.bone('head');
  f.part(limb(S.at(0.2, -0.04), add(HC, [-8, 36]), 44, 38), W.SKI(f, { shadow: '#5a6074' }));
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: P.skinI, jaw: 1.18, chin: 0.02, nose: 1.1, hook: 0.35, mouth: 'set', squint: 0.45, browDown: 0.08, age: true, faceShade: 0.82, jawShade: 0.4,
    eyeWhite: '#dfe6ea', iris: '#2a3038', hairCol: '#8a8a86', browCol: '#d8e0e4', moustache: true, beard: 'stubble', beardCol: '#9aa0a4', scar: [[0.04, 0.0], [0.14, 0.14], [0.2, 0.24]],
  });
  W.clipDraw(f, hF([[0.1, 0.18], [0.38, 0.2], [0.36, 0.5], [0.1, 0.5]]), () => W.hoar(f, hF([[0.24, 0.3]])[0], 20, 14, 0.6));
  for (const q of hF([[0.2, 0.27], [0.27, 0.275], [0.33, 0.26]])) W.icicle(f, q, 9 + f.r() * 6, 3.2); // moustache frozen into icicles
  W.icicle(f, hF([[0.36, 0.15]])[0], 8, 3);
  W.facets(f, hF([[0.12, 0.08]])[0], 14, 12, 3, { s: 0.5, op: 0.22 });
  // kettle hat: a ridged crown that follows the skull, a broad brim sloping down, riveted, struck by lightning
  const ST = W.ST(f), STD = W.ST(f, { fill: P.steelD, shadow: '#1e242a' });
  const brim = hF([[-0.86, -0.12], [-0.6, -0.3], [0.0, -0.36], [0.56, -0.3], [0.9, -0.12], [0.94, -0.04], [0.6, -0.16], [0.0, -0.2], [-0.6, -0.14], [-0.9, -0.04]]);
  const bdp = f.part(brim, Object.assign({}, STD, { k: 0.8 }));
  W.bevel(f, bdp, E.bbox(brim), 3, { lite: P.steelL });
  const crown = hF([[-0.5, -0.26], [-0.48, -0.5], [-0.32, -0.68], [-0.04, -0.78], [0.22, -0.72], [0.42, -0.54], [0.48, -0.28]]);
  const cdp = f.part(crown, Object.assign({}, ST, { k: 0.8 }));
  W.bevel(f, cdp, E.bbox(crown), 5, { lite: P.steelL });
  W.clipDraw(f, crown, () => {
    f.line(hF([[-0.3, -0.7], [-0.02, -0.78], [0.2, -0.72]]), 2, INK, { op: 0.6 });
    f.line(hF([[-0.04, -0.79], [-0.02, -0.5], [0.0, -0.28]]), 2.4, INK, { op: 0.6 }); f.line(hF([[0.02, -0.78], [0.04, -0.5], [0.06, -0.28]]), 1.4, P.steelL, { op: 0.6 }); // the ridge
    W.lichtenberg(f, hF([[-0.1, -0.7]])[0], 2.2, 50, 2.2, { metal: true, depth: 3 });
    W.dent(f, hF([[-0.3, -0.44]])[0], 9);
  });
  W.rivetRow(f, hF([[-0.44, -0.3]])[0], hF([[0.44, -0.33]])[0], 7, 2.6, P.steelL, { fused: 0.3 });
  W.rimeCrust(f, hF([[-0.2, -0.76], [0.1, -0.76], [0.36, -0.6], [0.48, -0.36]]), 10, [1, -0.3]);
  W.rimeCrust(f, hF([[0.1, -0.36], [0.56, -0.3], [0.92, -0.1]]), 6, [1, -0.3]);
  W.icicles(f, hF([[-0.88, -0.04], [-0.4, -0.15], [0.3, -0.18], [0.92, -0.06]]), 9, 10, 30);
  f.part(K.chain([hF([[-0.3, -0.24]])[0], hF([[-0.22, 0.2]])[0], hF([[0.0, 0.46]])[0]], [5, 5, 5]), W.LEA(f, { cast: false })); // chin strap

  // ---- halberd sloped on the near shoulder
  f.bone('halberd');
  f.part(limb(sh0, sh1, 13, 13, { steps: 8 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(sh0, sh1, 0.02, 4), lp(sh0, sh1, 0.98, 4)], 1, P.woodL, { op: 0.5, straight: true });
  f.part(limb(sh0, lerp(sh0, sh1, 0.04), 14, 14, { steps: 3, capK: 0.4 }), W.IR(f, { inkW: 1.1, cast: false })); // butt cap
  W.rimeCrust(f, [lerp(sh0, sh1, 0.3), lerp(sh0, sh1, 0.95)], 5, [1, -0.3]);
  for (const t of [0.5, 0.56]) f.line([lp(sh0, sh1, t, -7), lp(sh0, sh1, t + 0.01, 7)], 2.6, '#3a302a', { straight: true });
  halberdHead(f, sh1, shU, 0.9);
  W.icicles(f, [add(sh1, [62, 26]), add(sh1, [44, 66]), add(sh1, [10, 76])], 5, 12, 30);

  // ---- near arm: upper arm under the shaft, fist on the haft
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [56, 48, 42], coat, '_n', { bp: [[0, 0.5, 0.12, 0.2]], bq: [[0, 0.3, 0.08, 0.2], [1, 0.3, 0.1, 0.2]] });
  f.bone('torso'); // quilted shoulder roll stays on the torso
  f.part(ell(add(SN, [6, -2]), 34, 24, -0.3, 14), Object.assign({}, coat, { fill: '#aab0b2' }));
  W.rimeCrust(f, [add(SN, [-20, -20]), add(SN, [16, -24]), add(SN, [36, -6])], 7, [1, -0.3]);
  f.bone('forearm_n');
  f.part(K.chain([lp(EN, WN, 0.7), lp(EN, WN, 0.96)], [52, 48]), W.LEA(f, { cast: false }));
  W.icicles(f, [lp(SN, EN, 0.9, 26), lp(EN, WN, 0.4, 24)], 3, 8, 20);
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.atan2(shU[1], shU[0]), 27, '#4a3e36', { shadow: '#221a16', tex: 'craze' + seed, texOp: 0.3, name: 'halberdier haft' });

  f.bone('root');
  f.flat(ell([310, gy + 4], 130, 11, 0, 18), '#000', { op: 0.28 });
  return f;
}

// a dial engraved with action glyphs instead of numbers (the Clock Sentry's chest). T: dial frame; R: px radius
function glyph(f, c, kind, s, col) {
  const L = (pts, w = 2) => f.line(pts.map(q => add(c, mul(q, s))), w, col, { straight: true });
  if (kind === 'halberd') { L([[0, -1], [0, 1]], 2.2); L([[0, -0.7], [0.5, -0.9], [0.55, -0.4], [0, -0.3]]); L([[0, -0.55], [-0.35, -0.75]]); }
  if (kind === 'shield') { L([[-0.6, -0.8], [0.6, -0.8], [0.55, 0.1], [0, 0.9], [-0.55, 0.1], [-0.6, -0.8]]); L([[0, -0.8], [0, 0.9]], 1.2); }
  if (kind === 'step') { L([[-0.3, -0.9], [-0.25, 0.5], [0.7, 0.6], [0.7, 0.9], [-0.35, 0.9], [-0.3, -0.9]]); }
  if (kind === 'hourglass') { L([[-0.55, -0.9], [0.55, -0.9], [-0.55, 0.9], [0.55, 0.9], [-0.55, -0.9]]); }
}

// ------------------------------------------------------------------ CLOCK SENTRY (cast, large 1.4)
// The observatory's mechanical gate guard, standing stiff at attention with its halberd upright. A barrel cuirass of
// riveted brass plates over a waist and hips, a great dial in the chest whose two hands point at engraved action glyphs
// (halberd, shield, step, hourglass) to show what it will do next. A faceted brass helm-head with a fan crest and a
// dark visor slot. Flanged cylinder limbs, iron hinge joints, articulated gauntlets, sabaton feet. Frost on the front
// and top edges, icicles under the bezel, arms and blade; lightning fused the near knee and burned the plates aurora.
// Gate keys on a ring at the hip are its trade's remnant. Rig: humanoid + halberd (hand_n), hand_hour and hand_min
// (torso, pivot at the dial centre), crest (head), keys (pelvis), tasset (pelvis). Motion: idle tick (minute hand) and
// tock (head); attack is a timed halberd blow (the haft comes down from upright).
function clockSentry() {
  const seed = 1104, [CW, CH] = T.large, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 140;
  const N = [440, 372], C = [428, 486], Pv = [430, 630];
  const S = B.spine(N, C, Pv, H);
  const SN = [384, 404], EN = [364, 552], WN = [380, 684];
  const SF = [512, 396], EF = [546, 540], WF = [612, 562];
  const HN = [400, 654], KN = [384, 840], AN = [372, 1000];
  const HF = [466, 650], KF = [490, 838], AF = [504, 998];
  const HC = [462, 284], hA = 0.03;
  const hx = WF[0] + 2, hb = [hx + 6, gy - 2], ht = [hx - 4, 196]; // halberd upright, butt on the ground ahead of the front foot
  const dull = c => mix(c, P.iceD, 0.18);
  const BRZ = (o = {}) => W.BR(f, Object.assign({ fill: dull(P.brass) }, o)), BRD = (o = {}) => W.BRD(f, o);
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.2, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const DC = S.at(0.22, 0.4);
  f.joint('halberd', WF, 'hand_f').joint('hand_hour', DC, 'torso').joint('hand_min', DC, 'torso').joint('keys', S.at(-0.7, 0.98), 'pelvis').joint('tasset', S.at(0, 0.92), 'pelvis');
  const platePart = (pts, o = {}) => W.bplate(f, pts, o.dark ? BRD(o.look) : BRZ(o.look), o);
  // a plate shaped like the muscle under it: a limb outline with bulges, bevelled, a lit ridge, lame lines and rivets
  const shaped = (a, b, wa, wb, o = {}) => {
    const pts = limb(a, b, wa, wb, { steps: 10, p: o.p, q: o.q, capK: o.capK ?? 0.35 });
    const d = f.part(pts, Object.assign({ k: 0.9 }, (o.dark ? BRD : BRZ)()));
    W.bevel(f, d, E.bbox(pts), 6);
    const dn = E.norm(sub(b, a)), nn = [-dn[1], dn[0]], sd = (nn[0] * f.L[0] + nn[1] * f.L[1]) > 0 ? 1 : -1;
    f.line([lp(a, b, 0.1, sd * wa * 0.2), lp(a, b, 0.5, sd * (wa + wb) * 0.14), lp(a, b, 0.9, sd * wb * 0.18)], 2.4, P.brassP, { op: 0.5 });
    for (const t of (o.lames || [])) { f.line([lp(a, b, t, -wa * 0.5), lp(a, b, t + 0.03, 0), lp(a, b, t, wa * 0.5)], 2.2, INK, { op: 0.7 }); W.rivetRow(f, lp(a, b, t + 0.05, -wa * 0.35), lp(a, b, t + 0.05, wa * 0.35), 3, 2.6, P.brassL, { fused: 0.2 }); }
    W.clipDraw(f, pts, () => { if (o.after) o.after(); });
    return pts;
  };

  // ---- near arm hanging at its side, behind nothing (drawn first, the body passes in front of the shoulder)
  // ---- far arm, forward to the haft (behind the body)
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [44, 40]), W.IR(f, { inkW: 1.6 }));
  shaped(SF, EF, 72, 60, { dark: true, p: [[0.4, 0.12, 0.2]], lames: [0.3] });
  f.bone('forearm_f');
  f.part(K.chain([EF, WF], [40, 36]), W.IR(f, { inkW: 1.6 }));
  shaped(lerp(EF, WF, 0.12), WF, 60, 50, { dark: true, q: [[0.3, 0.12, 0.2]] });
  W.hinge(f, EF, 24);

  // ---- legs
  const leg = (Hp, Kn, A, sfx, dark) => {
    f.bone('thigh' + sfx);
    f.part(K.chain([Hp, Kn], [70, 56]), W.IR(f, { inkW: 1.6 }));
    shaped(Hp, Kn, 112, 78, { dark, q: [[0.35, 0.14, 0.22]], p: [[0.45, 0.08, 0.25]], lames: [0.18], after: () => { W.dent(f, lerp(Hp, Kn, 0.6), 10); W.soot(f, lerp(Hp, Kn, 0.35), 30, 40, 0.25); W.hoar(f, lp(Hp, Kn, 0.55, -30), 26, 70, 0.6); } });
    W.rimeCrust(f, [lp(Hp, Kn, 0.25, -50), lp(Hp, Kn, 0.85, -38)], 7, [1, -0.2]);
    f.bone('shin' + sfx);
    f.part(K.chain([Kn, A], [54, 44]), W.IR(f, { inkW: 1.6 }));
    shaped(lerp(Kn, A, 0.06), lerp(Kn, A, 0.94), 82, 54, { dark, p: [[0.3, 0.2, 0.18]], after: () => { W.dent(f, lerp(Kn, A, 0.6), 8); W.lichtenberg(f, lerp(Kn, A, 0.25), 1.7, 70, 2.2, { metal: true, depth: 2 }); W.hoar(f, lp(Kn, A, 0.45, -22), 20, 60, 0.5); } });
    W.rimeCrust(f, [lp(Kn, A, 0.2, -38), lp(Kn, A, 0.85, -26)], 6, [1, -0.2]);
    W.icicles(f, [lp(Kn, A, 0.9, -26), lp(Kn, A, 0.9, 26)], 3, 8, 18);
    W.hinge(f, Kn, 26);
    const KF2 = frame(Kn, ang(Kn, A) - Math.PI / 2, 0.78);
    platePart(KF2([[-42, -30], [6, -50], [48, -28], [44, 22], [0, 34], [-40, 20]]), { dark: !dark, hard: false, bev: 4, rivets: [[KF2([[-26, 14]])[0], KF2([[30, 12]])[0], 2]] });
    f.line(KF2([[4, -48], [0, 30]]), 2.2, P.brassP, { op: 0.6 });
    if (sfx === '_n') W.weld(f, [add(Kn, [-30, 26]), add(Kn, [0, 38]), add(Kn, [30, 28])], 5, { a: 2.0 });
    W.bootRig(f, Kn, A, 62, dark ? '#6e5c34' : '#86703e', sfx, { style: 'sabaton', shaft: 0.3, toe: 1.25, tex: 'hammer' + seed });
    f.bone('foot' + sfx);
    W.rimeCrust(f, [add(A, [20, 4]), add(A, [70, 30]), add(A, [96, 44])], 5, [1, -0.3]);
    f.bone('shin' + sfx);
    f.part(ell(A, 22, 20, 0, 12), W.IR(f, { fill: P.ironL, inkW: 1.3, cast: false })); f.rivet(A, 5, P.ironL);
  };
  leg(HF, KF, AF, '_f', true);

  // ---- pelvis: hip girdle with a gear hub, tasset of lames
  f.bone('pelvis');
  platePart([S.at(-0.62, 0.84), S.at(0.62, 0.82), S.at(0.7, 0.98), S.at(0.2, 1.04), S.at(-0.6, 1.02), S.at(-0.7, 0.96)], { dark: true, rivets: [[S.at(-0.52, 0.88), S.at(0.52, 0.86), 7]] });
  W.gear(f, HN, 38, 24, { a: 0.3, look: BRD() });
  f.bone('tasset');
  for (let i = 0; i < 3; i++) { const v = 0.94 + i * 0.1, w0 = 0.7 + i * 0.05; platePart([[...S.at(-w0, v), 1], S.at(-w0 * 0.4, v + 0.03), S.at(w0 * 0.4, v + 0.02), [...S.at(w0, v - 0.03), 1], [...S.at(w0 + 0.04, v + 0.1), 1], S.at(w0 * 0.4, v + 0.15), S.at(-w0 * 0.4, v + 0.16), [...S.at(-w0 - 0.04, v + 0.12), 1]], { hard: false, dark: i % 2 === 1, bev: 4, rivets: [[S.at(-w0 + 0.12, v + 0.06), S.at(w0 - 0.12, v + 0.05), 5]] }); }
  W.icicles(f, [S.at(-0.8, 1.25), S.at(0.0, 1.27), S.at(0.8, 1.22)], 6, 10, 30);

  // ---- torso: a barrel chest of riveted plates that swells and narrows to the waist; the dial in it
  f.bone('torso');
  const cuir = S.shape([[-0.1, 0.42, 0.34], [0.04, 0.8, 0.66], [0.18, 0.9, 0.9], [0.38, 0.84, 0.92], [0.56, 0.66, 0.74], [0.7, 0.54, 0.58], [0.86, 0.6, 0.6]]);
  platePart(cuir, { hard: false, bev: 9, scorch: [[S.at(-0.55, 0.3), 46, 70, 0.35]], dents: [[S.at(-0.4, 0.62), 10], [S.at(0.7, 0.66), 7]], lich: [[S.at(-0.7, 0.1), 1.0, 120, 3]], frost: [[S.at(0.75, 0.3), 26, 80, 0.7]] });
  f.line([S.at(-0.56, 0.04), S.at(-0.6, 0.36), S.at(-0.5, 0.7)], 2.6, INK, { op: 0.7 }); f.line([S.at(-0.52, 0.04), S.at(-0.56, 0.36), S.at(-0.46, 0.7)], 1.6, P.brassP, { op: 0.5 });
  W.rivetRow(f, S.at(-0.5, 0.08), S.at(-0.44, 0.66), 7, 3, P.brassL, { fused: 0.15 });
  f.line([S.at(-0.6, 0.62), S.at(0.0, 0.66), S.at(0.74, 0.58)], 2.4, INK, { op: 0.6 }); // the barrel's lower seam
  for (let i = 0; i < 2; i++) { const v = 0.68 + i * 0.09; platePart([[...S.at(-0.52 + i * 0.04, v), 1], S.at(0, v + 0.025), [...S.at(0.6 - i * 0.04, v - 0.01), 1], [...S.at(0.58 - i * 0.04, v + 0.1), 1], S.at(0, v + 0.13), [...S.at(-0.5 + i * 0.04, v + 0.1), 1]], { hard: false, dark: i % 2 === 0, bev: 4, rivets: [[S.at(-0.42, v + 0.05), S.at(0.46, v + 0.04), 5]] }); }
  // the dial
  const R0 = 90, TD = W.dialFrame(DC, R0, 0.86, 0.05);
  const face = []; for (let j = 0; j < 40; j++) { const t = j / 40 * Math.PI * 2; face.push(TD(Math.cos(t), Math.sin(t))); }
  f.part(face, { fill: mix(P.bone, P.ice, 0.35), shadow: '#5a6274', light: '#fbfcfc', shade: 0.3, tex: 'crack' + seed, texOp: 0.5, cast: false });
  for (let k = 0; k < 60; k++) { const t = k / 60 * Math.PI * 2 - Math.PI / 2, r1 = k % 5 ? 0.86 : 0.76; f.line([TD(Math.cos(t) * r1, Math.sin(t) * r1), TD(Math.cos(t) * 0.92, Math.sin(t) * 0.92)], k % 5 ? 1 : 2.4, INK, { straight: true, op: 0.8 }); }
  const inner = ell(DC, R0 * 0.86 * 0.72, R0 * 0.72, 0.05, 32); f.line(inner.concat([inner[0]]), 1, INK, { op: 0.5 });
  [['halberd', 0], ['shield', 1], ['step', 2], ['hourglass', 3]].forEach(([g, i]) => { const t = i * Math.PI / 2 - Math.PI / 2; glyph(f, TD(Math.cos(t) * 0.5, Math.sin(t) * 0.5), g, 14, '#2a2420'); });
  const bz = W.ringPath(TD, 0.94, 1.14);
  const bzd = f.part(bz.d, BRZ({ fill: P.brassL, bbPts: bz.outer, shade: 0.45 }));
  W.bevel(f, bzd, E.bbox(bz.outer), 5);
  for (let k = 0; k < 16; k++) { const t = k / 16 * Math.PI * 2; f.rivet(TD(Math.cos(t) * 1.04, Math.sin(t) * 1.04), 2.4, P.brassP); }
  W.rimeCrust(f, [TD(-0.6, -1.0), TD(0, -1.16), TD(0.7, -0.96), TD(1.1, -0.3)], 10, [1, -0.3]);
  W.icicles(f, [TD(-0.9, 0.6), TD(-0.3, 1.12), TD(0.4, 1.1), TD(0.9, 0.6)], 7, 10, 30);
  f.bone('hand_min');
  W.clockHand(f, DC, Math.PI * 0.46, R0 * 0.84, 10, BRD({ inkW: 1.2, cast: false }));
  f.bone('hand_hour');
  W.clockHand(f, DC, -0.08, R0 * 0.56, 14, BRZ({ inkW: 1.3, cast: false }));
  f.part(ell(DC, 10, 10, 0, 12), BRZ({ fill: P.brassL, inkW: 1.2, cast: false })); f.flat(ell(DC, 3.4, 3.4, 0, 8), '#0a0a0c');
  f.bone('torso');
  W.clipDraw(f, face, () => { f.raw(`<ellipse cx="${DC[0]}" cy="${DC[1]}" rx="${R0}" ry="${R0}" fill="${P.iceL}" opacity="0.2"/>`); W.hoar(f, TD(0.5, -0.45), 44, 36, 0.7); W.frostCracks(f, TD(-0.35, 0.35), 34, 34, 4, 1.4); f.line([TD(-0.6, -0.5), TD(-0.2, -0.76)], 3, '#ffffff', { op: 0.35 }); });
  // gorget, and the near pauldron (on the torso)
  platePart([S.at(-0.42, -0.12), S.at(0.6, -0.12), S.at(0.68, 0.06), S.at(-0.48, 0.08)], { dark: true, bev: 4, rivets: [[S.at(-0.36, -0.03), S.at(0.56, -0.04), 6]] });
  W.icicles(f, [S.at(0.2, 0.07), S.at(0.66, 0.06)], 3, 8, 16);

  // ---- gate keys on a ring at the near hip
  f.bone('keys');
  W.ringR(f, S.at(-0.7, 0.98));
  // ---- near leg
  leg(HN, KN, AN, '_n', false);

  // ---- near arm hanging at its side, gauntlet loose
  f.bone('upperarm_n');
  f.part(K.chain([SN, EN], [54, 46]), W.IR(f, { inkW: 1.6 }));
  shaped(SN, EN, 84, 66, { p: [[0.45, 0.14, 0.2]], q: [[0.3, 0.08, 0.2]], lames: [0.62], after: () => { W.soot(f, lerp(SN, EN, 0.6), 24, 30, 0.3); W.hoar(f, lp(SN, EN, 0.5, -24), 20, 40, 0.6); } });
  f.bone('forearm_n');
  f.part(K.chain([EN, WN], [46, 40]), W.IR(f, { inkW: 1.6 }));
  shaped(lerp(EN, WN, 0.1), lerp(EN, WN, 0.92), 70, 54, { q: [[0.3, 0.14, 0.2]], after: () => { W.dent(f, lerp(EN, WN, 0.5), 8); W.lichtenberg(f, lerp(EN, WN, 0.2), 1.4, 60, 2.2, { metal: true, depth: 2 }); } });
  W.rimeCrust(f, [lp(EN, WN, 0.15, -30), lp(EN, WN, 0.85, -24)], 6, [1, -0.2]);
  W.icicles(f, [lp(SN, EN, 0.95, 36), lp(EN, WN, 0.8, 30)], 4, 10, 24);
  W.hinge(f, EN, 28);
  f.bone('hand_n');
  W.gauntlet(f, WN, ang(EN, WN), 44, false, BRZ(), { scale: 1.08 });
  f.bone('torso');
  for (let i = 2; i >= 0; i--) { const c = add(SN, [-2 - i * 3, 10 + i * 22]); platePart([add(c, [-52 + i * 6, -4]), add(c, [-32, -30 + i * 4]), add(c, [32, -32 + i * 4]), add(c, [52 - i * 8, -2]), add(c, [44 - i * 8, 18]), add(c, [-46 + i * 6, 20])], { dark: i % 2 === 1, bev: 4, rivets: [[add(c, [-40, 6]), add(c, [40, 6]), 4]] }); }
  platePart([add(SN, [-66, -2]), add(SN, [-50, -46]), add(SN, [-4, -66]), add(SN, [50, -52]), add(SN, [72, -16]), add(SN, [58, 8]), add(SN, [-56, 8])], { hard: false, lich: [[add(SN, [-40, -26]), -0.3, 60, 2.2]], scorch: [[add(SN, [-10, -30]), 30, 20, 0.3]] });
  W.rimeCrust(f, [add(SN, [-48, -44]), add(SN, [-4, -68]), add(SN, [50, -54]), add(SN, [72, -16])], 9, [1, -0.3]);

  // ---- head: an armet-like brass helm that follows a skull: rounded back, sloping visor, chin piece, comb ridge
  f.bone('head');
  f.part(K.chain([S.at(0.2, -0.05), add(HC, [-6, 66])], [52, 46]), W.IR(f, { inkW: 1.5 }));
  for (let i = 0; i < 3; i++) f.line([add(S.at(0.2, -0.05), [-14 + i * 12, 0]), add(HC, [-16 + i * 12, 66])], 1.2, P.ironL, { op: 0.6 });
  const hF = frame(HC, hA, 1);
  // a sallet: swept tail over the nape, sloping crown, a pointed visor that is part of the same outline, a bevor below
  const skull = hF([[-104, 46], [-90, 14], [-74, -30], [-46, -66], [-6, -84], [32, -76], [56, -52], [68, -26], [96, -8], [86, 12], [68, 34], [20, 42], [-30, 40], [-70, 46]]);
  platePart(skull, { hard: false, bev: 8, scorch: [[hF([[-40, -30]])[0], 30, 30, 0.3]], lich: [[hF([[-70, 0]])[0], -1.4, 56, 2.2]], dents: [[hF([[-30, 10]])[0], 8]] });
  W.clipDraw(f, skull, () => {
    f.flat(hF([[-104, 46], [-90, 14], [-60, 18], [-30, 40], [-70, 46]]), '#000', { op: 0.25 }); // the tail turns under
    f.line(hF([[-6, -84], [0, -40], [10, 0], [20, 40]]), 2.6, INK, { op: 0.6 }); f.line(hF([[-2, -84], [4, -40], [14, 0], [24, 40]]), 1.4, P.brassP, { op: 0.5 }); // the crown's ridge
    f.line(hF([[-84, 20], [-40, 26], [10, 28]]), 1.6, INK, { op: 0.5 });
  });
  f.flat(hF([[24, -18], [90, -9], [86, -1], [24, -6]]), '#08080a'); // the sight slot
  f.line(hF([[30, -10], [84, -6]]), 1.2, '#3a3428', { op: 0.6 }); // the slot's lower lip, worn (independent review: the green dot here read as a glowing eye; removed)
  f.line(hF([[22, -24], [68, -28], [94, -10]]), 1.8, P.brassP, { op: 0.6 }); // lit brow edge over the slot
  for (let r = 0; r < 2; r++) for (let c2 = 0; c2 < 4; c2++) f.flat(hF(ell([40 + c2 * 10 - r * 4, 12 + r * 9], 2.4, 1.8, 0, 6)), '#08080a'); // breaths
  f.rivet(hF([[-16, -10]])[0], 4, P.brassL);
  // bevor: a chin plate rising from the gorget, overlapping the sallet's lower edge
  platePart(hF([[-40, 34], [30, 28], [74, 30], [70, 58], [30, 80], [-24, 78], [-46, 60]]), { dark: true, hard: false, bev: 4 });
  W.rivetRow(f, hF([[-36, 56]])[0], hF([[60, 50]])[0], 6, 2.4, P.brassL, { fused: 0.25 });
  W.rimeCrust(f, hF([[-74, -32], [-46, -68], [-6, -86], [32, -78], [56, -54], [68, -28], [96, -10]]), 9, [1, -0.3]);
  W.icicles(f, hF([[-100, 46], [-70, 46]]), 2, 10, 20);
  W.icicles(f, hF([[30, 80], [70, 58]]), 3, 8, 18);
  W.icicles(f, hF([[68, 34], [86, 12]]), 2, 8, 16);

  // ---- halberd upright in the far hand
  f.bone('halberd');
  f.part(limb(hb, ht, 18, 17, { steps: 10 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.part(limb(hb, lerp(hb, ht, 0.04), 20, 20, { steps: 3, capK: 0.3 }), W.IR(f, { cast: false }));
  for (const t of [0.62, 0.68, 0.3]) f.part(limb(lerp(hb, ht, t), lerp(hb, ht, t + 0.02), 21, 21, { steps: 2, capK: 0.2 }), BRZ({ cast: false, inkW: 1.1 }));
  W.rimeCrust(f, [lp(hb, ht, 0.1, -10), lp(hb, ht, 0.9, -10)], 5, [1, -0.2]);
  const hu = E.norm(sub(ht, hb)), hn = [-hu[1], hu[0]];
  halberdHead(f, ht, hu, 1.2);
  W.icicles(f, [add(ht, add(mul(hu, -100), mul(hn, 96))), add(ht, add(mul(hu, 28), mul(hn, 104)))], 5, 12, 34);
  f.bone('hand_f');
  W.gauntletGrip(f, WF, EF, -Math.PI / 2, 40, BRD(), { scale: 1.08, name: 'sentry haft' });
  W.icicles(f, [add(WF, [-30, 30]), add(WF, [20, 34])], 2, 8, 16);

  f.bone('root');
  f.flat(ell([450, gy + 4], 210, 16, 0, 20), '#000', { op: 0.3 });
  return f;
}

// a coil spring between a and b, radius r, n turns: back half dark, front half bright, so it reads as a helix
function coil(f, a, b, r, n, col = P.brassR) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]], L = E.len(sub(b, a));
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 0.5) / n, t2 = (i + 1) / n;
    const p0 = add(lerp(a, b, t0), mul(nn, -r)), p1 = add(lerp(a, b, t1), mul(nn, r)), p2 = add(lerp(a, b, t2), mul(nn, -r));
    f.line([p1, p2], 3.2, INK, { straight: true }); f.line([p1, p2], 1.8, mix(col, '#000', 0.3), { straight: true });
    f.line([p0, p1], 3.6, INK, { straight: true }); f.line([p0, p1], 2.2, col, { straight: true }); f.line([lerp(p0, p1, 0.2), lerp(p0, p1, 0.6)], 0.8, P.brassP, { straight: true, op: 0.8 });
  }
  void L;
}

// ------------------------------------------------------------------ GEAR SPIDER (cast, small, 0.6 wide)
// A brass repair machine from the orrery: the abdomen is an open clock movement (a brass plate on pillars, the gear
// train and the mainspring barrel showing), the thorax a riveted faceted housing with a mechanism-front on its face (a stopped escapement under a
// cracked crystal, off-centre; no lens eye: eye audit 2026-11-23).
// Eight legs of flanged brass segments on hinge joints and coil springs, low and splayed, each tipped with a tool (awl,
// screwdriver, file, pliers, hook); the near front leg is raised with its needle. Its tweezer mandibles hold a spare
// gear. Frost on the back and the knees, icicles under the body; lightning fused one knee and burned the plate.
// Rig: body (root), head, mandibles (head), leg_<side><1..4>_1 (femur) and _2 (tibia with its tool).
// Motion: idle is tinkering (mandibles, front legs); attack is the needle-leg strike (leg_n1 drives forward).
function gearSpider() {
  const seed = 1105, [CW, CH] = T.small, f = new Fig(W.base(seed, CH, { grimeY: 720 }));
  W.textures(f);
  const gy = f.o.groundY;
  const BRZ = (o = {}) => W.BR(f, o), BRD = (o = {}) => W.BRD(f, o);
  const AB = [232, 652], TH = [368, 664];
  f.joint('body', [300, 660], null).joint('head', [342, 662], 'body').joint('mandibles', [420, 690], 'head');
  // legs: [side, index, coxa, knee, tip, tool]
  const legs = [
    ['f', 4, [262, 650], [176, 618], [92, gy - 10], 'hook'], ['f', 3, [292, 650], [240, 616], [198, gy - 10], 'file'], ['f', 2, [330, 652], [382, 614], [392, gy - 10], 'driver'], ['f', 1, [352, 656], [440, 620], [500, gy - 10], 'awl'],
    ['n', 4, [258, 672], [150, 642], [44, gy], 'pliers'], ['n', 3, [290, 676], [214, 646], [150, gy], 'awl'], ['n', 2, [330, 680], [380, 644], [420, gy], 'driver'], ['n', 1, [356, 680], [456, 584], [560, 640], 'needle'],
  ];
  for (const [sd, i, c, k] of legs) f.joint(`leg_${sd}${i}_1`, c, 'body').joint(`leg_${sd}${i}_2`, k, `leg_${sd}${i}_1`);
  const tool = (k, tp, kind, dark) => {
    const d = E.norm(sub(tp, k)), a = Math.atan2(d[1], d[0]), Fq = frame(tp, a, 1.3), st = W.ST(f, { inkW: 1.1, cast: false });
    if (kind === 'needle') { f.part(Fq([[-40, -4], [0, -1.5], [18, 0, 1], [0, 1.5], [-40, 4]]), st); f.line(Fq([[-36, 0], [10, 0]]), 0.8, '#fff', { op: 0.8 }); }
    if (kind === 'awl') f.part(Fq([[-26, -4], [0, -1.5], [6, 0, 1], [0, 1.5], [-26, 4]]), st);
    if (kind === 'driver') f.part(hard(Fq([[-26, -3.5], [-4, -3.5], [2, -6], [4, 6], [-4, 3.5], [-26, 3.5]])), st);
    if (kind === 'file') { f.part(hard(Fq([[-30, -5], [2, -4], [4, 4], [-30, 5]])), st); for (let j = 0; j < 6; j++) f.line(Fq([[-26 + j * 5, -4], [-23 + j * 5, 4]]), 0.8, INK, { straight: true, op: 0.6 }); }
    if (kind === 'pliers') { f.part(Fq([[-28, -4], [-8, -6], [4, -2], [0, 0], [-8, -1]]), st); f.part(Fq([[-28, 4], [-8, 6], [4, 2], [0, 0], [-8, 1]]), st); f.rivet(Fq([[-12, 0]])[0], 2, P.steelL); }
    if (kind === 'hook') { f.part(Fq([[-28, -3], [-4, -3], [6, 4], [2, 12, 1], [-2, 6], [-6, 3], [-28, 3]]), st); }
    void dark;
  };
  const leg = ([sd, i, c, k, tp, kind]) => {
    const dark = sd === 'f', look = dark ? BRD : BRZ, s = dark ? 0.86 : 1;
    f.bone(`leg_${sd}${i}_1`);
    f.part(K.chain([c, k], [24 * s, 18 * s]), W.IR(f, { inkW: 1.4 }));
    W.cylinder(f, lerp(c, k, 0.1), lerp(c, k, 0.86), 40 * s, 30 * s, look({ shade: 0.46 }), { flanges: [[0.06, 46 * s], [0.5, 36 * s], [0.94, 36 * s]] });
    coil(f, lp(c, k, 0.2, -26 * s), lp(c, k, 0.8, -22 * s), 5 * s, 5);
    W.rimeCrust(f, [lp(c, k, 0.2, 19 * s), lp(c, k, 0.85, 15 * s)], 5, [1, -0.3]);
    // the riveted bracket that carries the leg on the movement plate
    const bk = [0, 1, 2, 3, 4, 5].map(i => add(c, rot([20 * s, 0], i * Math.PI / 3 + 0.3)));
    f.part(bk.map(q => [q[0], q[1], 1]), W.IR(f, { fill: P.ironL, inkW: 1.4, cast: false })); f.rivet(add(c, [-7 * s, -5 * s]), 2.6, P.brassL); f.rivet(add(c, [7 * s, 6 * s]), 2.6, P.brassL);
    f.bone(`leg_${sd}${i}_2`);
    const tp2 = lerp(k, tp, 0.82);
    f.part(K.chain([k, tp2], [18 * s, 12 * s]), W.IR(f, { inkW: 1.3 }));
    W.cylinder(f, lerp(k, tp2, 0.12), lerp(k, tp2, 0.9), 30 * s, 20 * s, look({ shade: 0.46 }), { flanges: [[0.06, 36 * s], [0.96, 24 * s]], rivets: false });
    f.part(limb(lerp(k, tp2, 0.86), lerp(k, tp2, 1.0), 26 * s, 24 * s, { steps: 2, capK: 0.2 }), W.IR(f, { fill: P.ironL, inkW: 1.2, cast: false })); // the iron chuck that holds the tool
    tool(k, tp, kind, dark);
    W.hinge(f, k, 17 * s);
    if (sd === 'n' && i === 2) W.weld(f, [add(k, [-12, 8]), add(k, [0, 14]), add(k, [12, 8])], 3, { a: 1.8 });
    if (k[1] < 650) W.icicles(f, [add(k, [-10, 14]), add(k, [10, 14])], 2, 6, 14);
  };
  legs.filter(l => l[0] === 'f').forEach(leg);

  // ---- abdomen: an open clock movement on pillars
  f.bone('body');
  // the back plate: a cut brass plate with clipped corners, its thickness showing along the lower edge
  const pb = [[-104, 0], [-92, -36], [-56, -56], [0, -62], [56, -52], [96, -24], [106, 12], [90, 46], [40, 66], [-30, 64], [-84, 40]].map(q => [...add(add(AB, [8, 14]), q), 1]);
  f.part(pb.map(q => [q[0], q[1] + 10, 1]), BRD({ fill: mix(P.brass, '#1a1a1e', 0.6), shade: 0.4 })); // thickness
  W.bplate(f, pb, BRD({ shade: 0.5 }), { bev: 4, scorch: [[add(AB, [-40, 30]), 40, 20, 0.35]] });
  for (const q of [[-70, 20], [60, 34], [-20, 44], [70, -10]]) f.part(limb(add(AB, q), add(AB, add(q, [10, 14])), 10, 10, { steps: 3, capK: 0.4 }), W.IR(f, { fill: P.ironL, inkW: 1.1, cast: false })); // pillars
  // the train between the plates
  W.gear(f, add(AB, [-62, 4]), 46, 26, { a: 0.4, look: BRZ({ fill: P.brassL }) });
  W.gear(f, add(AB, [20, 18]), 24, 16, { a: 0.1, look: BRZ() });
  W.gear(f, add(AB, [70, 30]), 30, 18, { a: 0.2, look: BRZ({ fill: P.brassL }) });
  // mainspring barrel: a drum with the spring's coil seen through a window
  const bc = add(AB, [-6, -26]);
  f.part(ell(bc, 30, 26, 0, 20), BRZ({ shade: 0.45 }));
  f.flat(ell(bc, 20, 17, 0, 18), '#0c0c10');
  for (let r = 4; r < 18; r += 3.2) f.line(ell(bc, r * 1.15, r, 0.3, 14).slice(0, 12), 1.4, P.brassR);
  // the front plate: a cut-out bridge, not a solid shell, so the train shows
  const bridge = [add(AB, [-96, 6]), add(AB, [-80, -30]), add(AB, [-40, -52]), add(AB, [10, -56]), add(AB, [60, -44]), add(AB, [92, -14]), add(AB, [96, 10]), add(AB, [70, -6]), add(AB, [30, -30]), add(AB, [-30, -24]), add(AB, [-60, -4]), add(AB, [-74, 24])];
  W.bplate(f, bridge, BRZ(), { hard: false, bev: 5, lich: [[add(AB, [-50, -30]), 0.2, 60, 2]], scr: [[add(AB, [20, -40]), 20, 4]] });
  W.rivetRow(f, add(AB, [-70, -18]), add(AB, [70, -30]), 6, 3, P.brassL, { fused: 0.2 });
  f.line([add(AB, [-90, 8]), add(AB, [-40, -48]), add(AB, [40, -50]), add(AB, [92, -12])].map(q => add(q, [0, 4])), 1.4, P.brassP, { op: 0.5 });
  // jewel bearings (aurora-burned)
  W.fusedBead(f, add(AB, [36, -40]), 4); // a pillar screw fused by the strike
  W.rimeCrust(f, [add(AB, [-84, -26]), add(AB, [-40, -54]), add(AB, [10, -58]), add(AB, [62, -46])], 7, [1, -0.3]);
  W.icicles(f, [add(AB, [-80, 50]), add(AB, [-20, 74]), add(AB, [60, 60])], 6, 8, 22);

  // ---- thorax: a faceted riveted housing with the loupe eye
  f.bone('head');
  const th = [add(TH, [-44, -24]), add(TH, [-10, -42]), add(TH, [36, -36]), add(TH, [58, -10]), add(TH, [56, 20]), add(TH, [30, 38]), add(TH, [-20, 40]), add(TH, [-48, 20])];
  W.bplate(f, th, BRZ(), { bev: 5, dents: [[add(TH, [-10, 10]), 6]], scorch: [[add(TH, [-20, 10]), 20, 16, 0.3]] });
  f.line([add(TH, [-10, -42]), add(TH, [0, 0]), add(TH, [-20, 40])], 1.6, INK, { op: 0.5 }); f.line([add(TH, [0, 0]), add(TH, [56, 10])], 1.6, INK, { op: 0.5 }); // facet edges
  W.rivetRow(f, add(TH, [-36, -20]), add(TH, [30, -32]), 4, 2.6, P.brassL);
  W.rimeCrust(f, [add(TH, [-44, -26]), add(TH, [-10, -44]), add(TH, [36, -38]), add(TH, [58, -12])], 6, [1, -0.3]);
  // the mechanism-front (eye audit 2026-11-23: no lens eye outside the void worlds): a squared brass case riveted to the
  // front facet, showing a stopped escapement under a cracked crystal: the escape wheel set high in one corner and cut
  // off by the case edge, the anchor pallet locked in its teeth below it, nothing round and dark at the centre
  const cs = [[402, 640, 1], [430, 645, 1], [434, 690, 1], [404, 694, 1]];
  W.bplate(f, cs, BRZ({ fill: P.brassD }), { bev: 3 });
  const win = [[406, 645], [427, 649], [430, 686], [407, 689]];
  f.flat(win, '#3a3630', { op: 0.9 }); // the movement's back plate, dim brass
  W.clipDraw(f, win, () => {
    W.gear(f, [427, 681], 13, 15, { a: 0.2, solid: true, inkW: 1, look: BRZ({ fill: P.brassL, cast: false }) }); // the escape wheel, stopped
    f.part([[410, 660], [416, 656], [420, 664], [423, 672], [420, 674], [416, 666], [412, 670], [409, 676], [406, 673]], W.ST(f, { inkW: 1, cast: false })); // the anchor pallet, one pallet stone locked in a tooth
    f.flat(ell([412, 661], 1.6, 1.6, 0, 6), P.brassP); // its arbor, high in the corner
    f.line([[407, 684], [412, 680], [416, 684], [411, 688]], 1.2, P.brassR, { op: 0.85 }); // a loop of the hairspring
  });
  // the crystal cover over the window: pale, frosted at the top, cracked across
  f.flat(win, P.clear, { op: 0.22 });
  f.flat([[406, 645], [427, 649], [427, 655], [406, 652]], P.rime, { op: 0.45 });
  f.line([[408, 688], [415, 670], [418, 662], [428, 650]], 1, '#eef6fa', { op: 0.85 }); f.line([[415, 670], [424, 676]], 0.8, '#eef6fa', { op: 0.7 }); // the crack
  f.flat([[409, 660], [413, 656], [414, 659]], '#ffffff', { op: 0.6 }); // glint
  for (const q of [[404, 642], [430, 647], [432, 688], [406, 692]]) f.rivet(q, 1.8, P.brassL);
  // ---- mandibles: tweezer jaws holding a spare gear
  f.bone('mandibles');
  const mj = add(TH, [52, 26]);
  f.part([add(mj, [-6, -4]), add(mj, [40, 8]), add(mj, [44, 14]), add(mj, [36, 12]), add(mj, [-6, 4])], W.ST(f, { inkW: 1.1, cast: false }));
  f.part([add(mj, [-6, 6]), add(mj, [36, 30]), add(mj, [40, 36]), add(mj, [32, 32]), add(mj, [-8, 14])], W.ST(f, { fill: P.steelD, inkW: 1.1, cast: false }));
  W.gear(f, add(mj, [46, 26]), 12, 10, { a: 0.3, solid: true, look: BRZ({ fill: P.brassL, cast: false }) });

  // ---- near legs, in front
  legs.filter(l => l[0] === 'n').forEach(leg);
  f.bone('body');
  W.splats(f, [300, gy - 4], 220, 6, 8, '#1a1e22');
  f.bone('root');
  f.flat(ell([300, gy + 2], 250, 10, 0, 20), '#000', { op: 0.26 });
  return f;
}

// ------------------------------------------------------------------ AURORA MOTH (cast, small, 0.7 wingspan)
// Independent review rebuild (the first build read as a flat, symmetric cartoon butterfly). A large white moth drawn up
// the spire to the frozen stars, seen three-quarter from above and in front, gliding with its wings swept back like a
// moth's delta: the near pair spread toward us, large; the far pair raised behind the body, foreshortened and partly
// hidden. Moth anatomy: narrow triangular forewings with a straight costa and a pointed apex, small rounded hindwings
// tucked under them, a heavy furred thorax with a ruff of clumped hair, a furred tapering abdomen, broad feathered
// (bipectinate) antennae, furred legs folded under. The wings carry scale texture, fine veins, a wavy antemedial and
// postmedial line and a checkered fringe; the aurora is only a faint green and blue-violet colouring in the scales along
// the postmedial band, never stripes. Frost: rime along the leading edges and fringe, ice beads in the fur, icicles
// plumb under the lower margins. Lightning: the near hindwing is torn and scorched through, with a branching burn.
// Rig: body (root), head, abdomen, wing_fn / wing_hn (near fore and hind), wing_ff / wing_hf (far), legs.
// Motion: idle is a flutter (wings about their roots); attack is a dazzling wing beat (near wings sweep down).
function auroraMoth() {
  const seed = 1106, [CW, CH] = T.small, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, violet = '#7c86b8';
  // scales: tiny overlapping arcs in staggered rows, like roof tiles
  let sc = ''; for (let y = 0; y < 24; y += 4) for (let x = (y / 4) % 2 ? 3 : 0; x < 24; x += 6) sc += `<path d="M${x},${y + 3} a3,3 0 0 1 6,0" fill="none" stroke="#3a3c4a" stroke-width="0.6" opacity="0.5"/>`;
  f.defs.push(`<pattern id="scales${seed}" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(-30)">${sc}</pattern>`);
  f.defs.push(`<filter id="soft${seed}x" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>`);
  const fur = { fill: '#dedcd2', shadow: '#8a8e9e', light: '#ffffff', shade: 0.42, tex: 'weave' + seed, texOp: 0.35 };
  const Th = [300, 426], d = E.norm([0.846, -0.534]), n = [-d[1], d[0]];
  const at = (u, v, c = Th) => add(c, add(mul(d, u), mul(n, v)));
  // a furred mass: the outline broken into clumped tufts that sweep back from the head, soft shading, no hard hatch
  const furry = (pts, look, tuft = 8, o = {}) => {
    const C = W.spline(pts.concat([pts[0]]), 10), c = pts.reduce((m, p) => add(m, mul(p, 1 / pts.length)), [0, 0]), out = [];
    C.forEach((q, i) => { const r = E.norm(sub(q, c)), sw = add(r, mul(d, -0.6)); out.push(i % 2 ? add(q, mul(E.norm(sw), tuft * (0.6 + f.r() * 0.8))) : add(q, mul(r, -tuft * 0.2))); });
    f.part(out, Object.assign({}, look, { hatch: false, maxShade: o.maxShade ?? 14, inkW: 1.1, inkHeavy: 1.8, k: 0.75 }));
    return out;
  };
  const Hd = at(50, 2), Ab0 = at(-30, 0), Ab1 = at(-150, 4);
  const roots = { fn: at(4, 22), hn: at(-14, 22), ff: at(8, -20), hf: at(-12, -18) };
  f.joint('body', Th, null).joint('head', at(36, 0), 'body').joint('abdomen', Ab0, 'body').joint('legs', at(4, 22), 'body');
  for (const k of ['fn', 'hn', 'ff', 'hf']) f.joint('wing_' + k, roots[k], 'body');
  // a wing in a local frame: u along the costa from the root (0) to the apex (1), v toward the trailing edge
  const frameW = (R0, A, Wv) => (u, v) => add(R0, add(mul(sub(A, R0), u), mul(Wv, v)));
  const FORE = { out: [[0, 0], [0.5, -0.05], [0.86, -0.04], [1, 0, 1], [0.98, 0.26], [0.9, 0.56], [0.76, 0.84, 1], [0.5, 0.8], [0.22, 0.52], [0.04, 0.18]], costa: [[0.04, -0.02], [0.5, -0.05], [0.86, -0.04], [1, 0]], margin: [[1, 0], [0.98, 0.26], [0.9, 0.56], [0.76, 0.84]], inner: [[0.76, 0.84], [0.5, 0.8], [0.22, 0.52]] };
  const HIND = { out: [[0, 0], [0.42, -0.06], [0.8, 0.06], [0.98, 0.3], [0.94, 0.6], [0.7, 0.82], [0.4, 0.78], [0.16, 0.5], [0.02, 0.2]], costa: [[0.04, -0.02], [0.42, -0.06], [0.8, 0.06]], margin: [[0.8, 0.06], [0.98, 0.3], [0.94, 0.6], [0.7, 0.82], [0.4, 0.78]], inner: [[0.4, 0.78], [0.16, 0.5]] };
  const wing = (shape, F, o = {}) => {
    const P2 = q => { const p = F(q[0], q[1]); return q[2] ? [p[0], p[1], 1] : p; };
    let out = shape.out.map(P2);
    if (o.tear) { // a torn notch in the margin: the outline bites in
      const i = o.tear[0]; out = [...out.slice(0, i + 1), P2(o.tear[1]), [...P2(o.tear[2]), 1], P2(o.tear[3]), ...out.slice(i + 1)];
    }
    const far = !!o.far, base = far ? '#d4d4cc' : '#e8e6dc';
    f.part(out, { fill: base, shadow: far ? '#8a8e9e' : '#9a9eac', light: '#ffffff', shade: 0.2, maxShade: far ? 24 : 18, tex: 'scales' + seed, texOp: 0.55, hatch: !far ? false : undefined, k: 0.9 });
    W.clipDraw(f, out, () => {
      // dusky scales at the root, fading out
      f.raw(`<ellipse cx="${F(0.08, 0.1)[0].toFixed(1)}" cy="${F(0.08, 0.1)[1].toFixed(1)}" rx="40" ry="34" fill="#6a6a70" opacity="0.4" filter="url(#soft${seed}x)"/>`);
      // the aurora: a faint colouring of the scales along the postmedial band, green toward the root, blue-violet out
      const pm = [[0.6, -0.04], [0.56, 0.2], [0.6, 0.42], [0.54, 0.62], [0.5, 0.8]].map(q => F(q[0] * (o.hind ? 0.9 : 1), q[1]));
      f.raw(`<path d="${E.smooth(pm, false)}" fill="none" stroke="${P.aur}" stroke-width="${o.hind ? 26 : 34}" opacity="${far ? 0.32 : 0.42}" stroke-linecap="round" filter="url(#soft${seed}x)"/>`);
      f.raw(`<path d="${E.smooth(pm.map(q => lerp(q, F(1.05, 0.2), 0.32)), false)}" fill="none" stroke="${violet}" stroke-width="${o.hind ? 18 : 24}" opacity="${far ? 0.26 : 0.34}" stroke-linecap="round" filter="url(#soft${seed}x)"/>`);
      // veins: from the root, forking toward the margin
      shape.margin.concat(o.hind ? [] : [[0.7, 0.44]]).forEach((q, i) => { const m = F(q[0] * 0.5, q[1] * 0.5 + 0.02), e = F(q[0] * 0.97, q[1] * 0.97); f.line([F(0.06, 0.06), m, e], 0.9, '#6a6458', { op: 0.5 }); if (i % 2) f.line([m, F(q[0] * 0.9, q[1] * 0.9 + 0.06)], 0.8, '#6a6458', { op: 0.4 }); });
      // the antemedial and the wavy postmedial lines, a darker subterminal shade inside the margin
      const wavy = (u0, du) => { const r = []; for (let i = 0; i <= 10; i++) { const v = -0.04 + i * (o.hind ? 0.08 : 0.085); r.push(F(u0 + Math.sin(i * 1.9) * du - v * 0.15, v)); } return r; };
      f.line(wavy(0.34, 0.02), 1.4, '#4a4a54', { op: 0.55 }); f.line(wavy(0.66, 0.03), 1.6, '#4a4a54', { op: 0.6 });
      f.line(wavy(0.68, 0.03).map(q => add(q, mul(f.L, 2))), 1, '#ffffff', { op: 0.5 });
      f.line(shape.margin.map(q => F(q[0] - 0.08, q[1] - 0.02)), 10, '#8a8c98', { op: 0.25 });
      // the discal mark: a small dark crescent, not a spot
      if (!o.hind) f.line([F(0.44, 0.16), F(0.47, 0.26), F(0.44, 0.36)], 2.4, '#3a3a44', { op: 0.6 });
      if (o.camber) { f.line([F(0.1, 0.34), F(0.6, 0.5)], 10, '#2a2c40', { op: 0.1 }); f.line([F(0.1, 0.28), F(0.6, 0.44)], 2, '#ffffff', { op: 0.35 }); }
      if (o.after) o.after(F);
    });
    // checkered fringe of hair scales on the margin, light and dark by turns
    const M = W.spline(shape.margin.map(q => F(q[0], q[1])), 3);
    for (let i = 0; i < M.length - 1; i++) { const q = M[i], t = E.norm(sub(M[i + 1], q)), nn = [t[1], -t[0]], away = E.norm(sub(q, F(0.3, 0.2))), dir = E.len(add(nn, away)) > 1 ? nn : mul(nn, -1); f.line([q, add(q, mul(dir, 5 + (i % 3)))], 1.2, (i >> 2) % 2 ? '#e8e8e0' : '#6a6a70', { op: 0.8, straight: true }); }
    W.rimeCrust(f, shape.costa.map(q => F(q[0], q[1])), far ? 4 : 5, [1, -0.3], { feather: 0.7, gap: 7 });
    return { out, F };
  };

  // ---- far wings: raised behind the body, foreshortened, partly hidden
  f.bone('wing_hf');
  wing(HIND, frameW(roots.hf, [166, 330], [-70, 80]), { far: true, hind: true });
  f.bone('wing_ff');
  const ffw = wing(FORE, frameW(roots.ff, [158, 196], [-84, 70]), { far: true, tear: [5, [0.95, 0.4], [0.84, 0.44], [0.92, 0.5]] });
  W.icicles(f, [ffw.F(0.76, 0.84), ffw.F(0.5, 0.8)], 3, 8, 18);

  // ---- near wings, spread toward us
  f.bone('wing_hn');
  const hnw = wing(HIND, frameW(roots.hn, [150, 570], [-100, -64]), { hind: true, tear: [5, [0.86, 0.66], [0.66, 0.6], [0.76, 0.74]], after: F => { f.stroke([F(0.86, 0.66), F(0.7, 0.62), F(0.76, 0.74)], 6, '#1c1c20', { op: 0.7 }); W.lichtenberg(f, F(0.66, 0.52), Math.atan2(sub(F(0.2, 0.2), F(0.66, 0.52))[1], sub(F(0.2, 0.2), F(0.66, 0.52))[0]), 70, 1.8, { depth: 2, col: '#2a2c30' }); W.soot(f, F(0.74, 0.64), 18, 14, 0.45); } });
  W.icicles(f, [hnw.F(0.94, 0.6), hnw.F(0.7, 0.82), hnw.F(0.4, 0.78)], 5, 10, 26);
  f.bone('wing_fn');
  const fnw = wing(FORE, frameW(roots.fn, [128, 672], [-112, -84]), { camber: true, tear: [3, [0.99, 0.1], [0.92, 0.14], [0.98, 0.2]] });
  W.icicles(f, [fnw.F(0.98, 0.26), fnw.F(0.9, 0.56), fnw.F(0.76, 0.84)], 5, 10, 26);
  W.frostCracks(f, fnw.F(0.8, 0.2), 14, 14, 2, 0.8);

  // ---- abdomen: furred, tapering, the segments showing as rings of tufts, a tail tuft
  f.bone('abdomen');
  const ab = K.chain([Ab0, lerp(Ab0, Ab1, 0.45), Ab1], [62, 52, 20], { bq: [[0, 0.5, 0.08, 0.3]] });
  furry(ab.filter((_, i) => i % 2 === 0), Object.assign({}, fur, { fill: '#dcdad0', shadow: '#9a9eac' }), 7, { maxShade: 16 });
  W.clipDraw(f, ab, () => {
    for (let i = 1; i < 7; i++) { const t = i / 7, c = lerp(Ab0, Ab1, t), w2 = 30 - t * 20; f.stroke([at(2, -w2, c), at(-4, 0, c), at(2, w2, c)], 3, '#5a5e70', { op: 0.45 }); for (let j = -2; j <= 2; j++) f.stroke([at(0, j * w2 * 0.4, c), at(-10, j * w2 * 0.45, c)], 2.6, j % 2 ? '#f6f6f0' : '#9a9ca8', { op: 0.6 }); }
    W.hoar(f, lerp(Ab0, Ab1, 0.3), 26, 20, 0.6);
  });
  for (let i = 0; i < 7; i++) f.stroke([Ab1, at(-14 - i * 2, (i - 3) * 4, Ab1), at(-24 - (i % 3) * 3, (i - 3) * 6, Ab1)], 3, i % 2 ? '#e8e8e0' : '#a4a6b0', { op: 0.85 }); // the tail tuft
  W.icicle(f, at(-14, 6, Ab1), 16, 4, { drop: true });

  // ---- legs folded under the thorax: furred femora, thin jointed tarsi with hooked claws
  f.bone('legs');
  for (const [u, k1, t1] of [[24, [30, 52], [46, 74]], [6, [10, 58], [22, 84]], [-14, [-12, 54], [-6, 82]]]) {
    const a0 = at(u, 20), k0 = at(k1[0], k1[1]), t0 = at(t1[0], t1[1]);
    f.part(K.chain([a0, k0], [16, 11]), Object.assign({}, fur, { fill: '#d4d2c8', cast: false, maxShade: 6, hatch: false }));
    for (let i = 0; i < 5; i++) { const q = lerp(a0, k0, i / 5); f.line([q, add(q, mul(n, 7)), add(q, add(mul(n, 9), mul(d, -4)))], 1.2, i % 2 ? '#ffffff' : '#8a8e9e', { op: 0.7 }); }
    f.line([k0, lerp(k0, t0, 0.5), t0], 3.4, INK); f.line([k0, lerp(k0, t0, 0.5), t0], 1.6, '#8a8678');
    for (let i = 1; i < 4; i++) f.flat(ell(lerp(k0, t0, i / 4), 2.2, 2.2, 0, 6), '#5a564c');
    f.line([t0, add(t0, [5, 2]), add(t0, [6, 7])], 1.4, INK);
  }

  // ---- thorax: a heavy ruff of clumped hair over a furred mass, the patagia collar behind the head
  f.bone('body');
  const th = [at(-40, -32), at(-8, -46), at(28, -40), at(48, -18), at(50, 14), at(30, 38), at(-6, 44), at(-38, 30)];
  furry(th, fur, 10, { maxShade: 18 });
  W.clipDraw(f, th, () => {
    for (let i = 0; i < 34; i++) { const q = W.scatter(f, at(-2, 0), 40, 32), dir = rot(mul(d, -1), (f.r() - 0.5) * 1.2), l = 10 + f.r() * 10; f.stroke([q, add(q, mul(dir, l * 0.5)), add(q, mul(rot(dir, 0.35), l))], 3.6, i % 3 ? '#f4f4ee' : '#8a8e9e', { op: 0.75 }); }
    W.hoar(f, at(14, -14), 30, 24, 0.7);
  });
  // clumps breaking the outline: tufts of hair standing off the back and flanks
  for (let i = 0; i < 9; i++) { const t = i / 8, q = lerp(at(-30, -26), at(30, -32), t), dir = rot(mul(n, -1), -0.8 + t * 0.6); f.stroke([add(q, mul(dir, -6)), add(q, mul(dir, 8)), add(q, add(mul(dir, 14), mul(d, -6)))], 5, i % 2 ? '#e8e8e0' : '#c8c8be', { op: 0.95 }); }
  for (let i = 0; i < 8; i++) f.flat(ell(W.scatter(f, at(6, -6), 30, 26), 2.2, 2.2, 0, 6), P.iceL, { op: 0.9 }); // ice beads in the fur
  // the patagia: a raised collar of long hair behind the head
  const pg = [at(26, -34), at(40, -40), at(52, -24), at(52, 10), at(40, 26), at(30, 14), at(34, -10)];
  furry(pg, Object.assign({}, fur, { fill: '#eeede6', cast: false }), 7, { maxShade: 8 });
  for (let i = 0; i < 7; i++) f.stroke([at(32 + i, -30 + i * 8), at(26 + i, -28 + i * 8), at(18 + i, -24 + i * 8)], 3, i % 2 ? '#b4b6c0' : '#ffffff', { op: 0.6 });

  // ---- head: small, sunk in the fur; a dark faceted compound eye, a furred palp; broad feathered antennae
  f.bone('head');
  const hd = [at(44, -18), at(58, -15), at(66, -2), at(64, 12), at(54, 19), at(44, 16)];
  f.part(hd, Object.assign({}, fur, { fill: '#d8d6cc', maxShade: 8 }));
  const ey = ell(at(57, 4), 6, 8, Math.atan2(d[1], d[0]), 12);
  f.part(ey, { fill: '#2e3038', shadow: '#0a0a10', light: '#5a6070', shade: 0.5, inkW: 1.2, cast: false, hatch: false });
  W.clipDraw(f, ey, () => { for (let i = -3; i <= 3; i++) { f.line([at(52, 4 + i * 3), at(68, 4 + i * 3)], 0.6, '#5a6070', { op: 0.6, straight: true }); f.line([at(60 + i * 3, -8), at(60 + i * 3, 16)], 0.6, '#5a6070', { op: 0.6, straight: true }); } });
  f.flat(ell(at(55, 1), 2, 1.4, 0.4, 6), '#8a90a4', { op: 0.5 });
  for (let i = 0; i < 8; i++) f.stroke([at(44 + i * 3, -20 + (i % 2) * 2), at(52 + i * 3, -8)], 3, i % 3 ? '#f2f2ec' : '#a4a6b0', { op: 0.85 }); // hair over the brow
  for (let i = 0; i < 6; i++) f.stroke([at(46 + i * 3, 20), at(54 + i * 3, 12)], 2.6, '#e8e8e0', { op: 0.8 }); // and under the eye
  f.part([at(62, 10), at(72, 14), at(70, 20), at(60, 18)], Object.assign({}, fur, { fill: '#b8b6ac', cast: false, maxShade: 4 })); // palp
  for (const [b0, ctrl, tip, k] of [[at(62, -16), [16, -46], [-8, -96], 1], [at(56, -20), [-10, -40], [-44, -78], 0.8]]) {
    const C = W.spline([b0, add(b0, ctrl), add(b0, tip)], 3), NC = C.length;
    for (let i = 2; i < NC - 1; i++) { const q = C[i], dd = E.norm(sub(C[i + 1], C[i - 1])), nn = [-dd[1], dd[0]], t = i / NC, l = 18 * k * Math.sin(Math.PI * Math.min(1, t * 1.1)); for (const sg of [1, -1]) f.line([q, add(add(q, mul(nn, l * sg)), mul(dd, l * 0.55))], 1, '#7a7a70', { op: 0.85 }); } // the comb of pectinations
    f.line(C, 3.6 * k, INK); f.line(C, 2 * k, '#b8b4a6');
    for (let i = 4; i < NC - 1; i += 5) f.flat(ell(C[i], 2.2, 2.2, 0, 6), P.iceL, { op: 0.9 }); // beads of ice on the shaft
    W.icicle(f, add(C[NC - 1], [0, 1]), 8, 2.2);
  }

  f.bone('root');
  f.flat(ell([290, gy + 2], 150, 10, 0, 18), '#000', { op: 0.16 }); // its shadow far below
  return f;
}

// ------------------------------------------------------------------ THE HOROLOGIST (elite 1.9)
// The observatory's master and its last astronomer: a tall, gaunt old man stooped from the upper back, holding his
// pocket watch up on its chain at eye level and squinting at it through the brass lens clamped over his near eye. The
// far arm is raised (behind the head, so the beard and face stay clear); the near hand leans on a collapsed brass
// telescope used as a cane. On his back, strapped to a frame, a brass armillary sphere of tilted rings. A dark scholar's
// robe and open gown with hanging sleeves, frozen mid-swing and crusted with rime on the windward front; a star-chart
// stole embroidered with constellations; a belt with dividers, a quadrant and a chained almanac. Half frozen, half fused:
// brass gears are set into his elbow, wrist, neck and knee, welded in with aurora burns spreading into the skin.
// Rig: humanoid + watch (hand_f), cane (hand_n), armillary (torso), stole (torso), skirt (pelvis), sleeve_f (forearm_f),
// beard (head). Motion: idle is winding the watch (far hand and watch); attack is a click of the watch (watch lifts).
function horologist() {
  const seed = 1101, [CW, CH] = T.elite, f = new Fig(W.base(seed, CH));
  W.textures(f);
  const gy = f.o.groundY, H = 190;
  const N = [548, 452], C = [474, 604], Pv = [506, 822];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.34, 0.12), SF = S.at(0.34, 0.06);
  const EF = [732, 474], WF = [846, 338];
  const EN = [470, 712], WN = [600, 760];
  const HN = S.at(-0.2, 1.0), KN = [472, 1080], AN = [450, 1300];
  const HF = S.at(0.26, 0.98), KF = [574, 1076], AF = [604, 1300];
  const HC = [618, 334], hA = 0.3;
  const cb = [636, gy - 2], ct = [598, 712]; // telescope cane: eyepiece up as the handle
  const AC = [372, 360], AR = 176; // armillary centre and radius
  const SKN = (o = {}) => W.SKI(f, Object.assign({ shadow: '#565c72' }, o));
  const RB = (o = {}) => W.ROBE(f, Object.assign({ fill: '#3a4252', shadow: '#1a1e28', light: '#5a6478' }, o)), GOWN = (o = {}) => W.ROBE(f, Object.assign({ fill: '#3a4150', shadow: '#1a1e28' }, o));
  const BRZ = (o = {}) => W.BR(f, o);
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.2, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('watch', WF, 'hand_f').joint('cane', WN, 'hand_n').joint('armillary', S.at(-0.6, 0.2), 'torso').joint('stole', S.at(0.3, 0.02), 'torso');
  f.joint('skirt', S.at(0, 0.82), 'pelvis').joint('sleeve_f', lerp(EF, WF, 0.4), 'forearm_f').joint('beard', add(HC, [30, 50]), 'head');

  // ---- the armillary sphere on his back (behind everything)
  f.bone('armillary');
  // the post and back frame that carry it
  f.part(limb(add(AC, [10, AR * 0.95]), S.at(-0.6, 0.3), 22, 22, { steps: 4, capK: 0.3 }), BRZ({ inkW: 1.5 }));
  const rings = [[1.0, 0.28, 0.12, 14], [1.0, 0.46, -0.42, 11], [0.36, 1.0, 0.34, 12], [0.8, 1.0, -0.6, 9], [1.1, 0.2, 0.08, 16]];
  for (const [kx, ky, a, w] of rings) band(f, W.ringArc(AC, AR * kx, AR * ky, a, Math.PI, Math.PI * 2), w, mix(P.brass, '#1a1a20', 0.45), { lite: P.brassL }); // back halves, in shadow
  // the brass sun at the centre, on its axis
  const ax = [add(AC, rot([0, -AR * 1.08], 0.34)), add(AC, rot([0, AR * 1.08], 0.34))];
  band(f, ax, 7, P.brassD);
  f.part(ell(AC, 26, 26, 0, 16), BRZ({ fill: P.brassL, shade: 0.45 }));
  for (let i = 0; i < 12; i++) { const t = i * Math.PI / 6; f.line([add(AC, rot([28, 0], t)), add(AC, rot([40, 0], t + 0.1))], 3, P.brassL); }
  W.lichtenberg(f, add(AC, [-10, 6]), 2.6, 40, 1.8, { metal: true, depth: 2 });
  for (const [kx, ky, a, w] of rings) band(f, W.ringArc(AC, AR * kx, AR * ky, a, 0, Math.PI), w, P.brass); // front halves
  // engraved degree ticks on the horizon ring, fused joins, frost, icicles hanging plumb from the lowest rings
  for (let i = 0; i < 24; i++) { const t = i / 24 * Math.PI, q = add(AC, rot([Math.cos(t) * AR * 1.1, Math.sin(t) * AR * 0.2], 0.08)); f.line([add(q, [0, -5]), add(q, [0, 5])], 1, INK, { op: 0.6 }); }
  for (const t of [0.4, 1.9, 2.6]) W.fusedBead(f, add(AC, rot([Math.cos(t) * AR, Math.sin(t) * AR * 0.28], 0.12)), 4);
  W.rimeCrust(f, W.ringArc(AC, AR * 0.8, AR, -0.6, -2.6, -0.9, 10), 7, [1, -0.3]);
  W.rimeCrust(f, W.ringArc(AC, AR * 0.36, AR, 0.34, -2.2, -1.1, 6), 6, [1, -0.3]);
  W.icicles(f, W.ringArc(AC, AR * 1.1, AR * 0.2, 0.08, 0.3, 2.8, 12), 9, 12, 34);
  W.icicles(f, W.ringArc(AC, AR, AR * 0.46, -0.42, 0.6, 2.4, 10), 5, 10, 26);

  // ---- legs under the robe (drawn whole so the rig can move them), shoes at the hem
  const hose = { fill: '#2e3038', shadow: '#14161c', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 };
  f.bone('thigh_f'); W.legTube(f, HF, KF, lerp(KF, AF, 0.9), [120, 90, 70], hose, '_f', { A: AF });
  f.bone('foot_f'); shoe(f, [AF[0] + 96, gy], 0, 70, W.LEA(f, { fill: '#3a302a' }));
  f.bone('thigh_n'); W.legTube(f, HN, KN, lerp(KN, AN, 0.9), [124, 94, 72], hose, '_n', { A: AN });
  f.bone('foot_n'); shoe(f, [AN[0] + 96, gy], 0.0, 70, W.LEA(f, { fill: '#42362e' }));

  // ---- far arm raised forward, behind the head: torn sleeve over a fused brass gear at the elbow
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [76, 64, 50], GOWN(), '_f', { bp: [[0, 0.5, 0.12, 0.2]] });
  f.bone('forearm_f');
  // skin shows where the sleeve is burned away at the elbow: the gear is set into the joint
  const ew = add(EF, [-6, 6]);
  f.part(ell(ew, 40, 34, 0.4, 16), SKN());
  W.gear(f, ew, 34, 16, { a: 0.2, look: BRZ({ fill: P.brassL }), solid: true });
  W.weld(f, W.ringArc(ew, 38, 36, 0.4, -0.4, 2.2, 10), 4, { a: 0.8 });
  W.lichtenberg(f, add(ew, [26, -18]), -0.9, 70, 2.4, { depth: 2 });
  f.bone('sleeve_f');
  // the hanging sleeve of the gown, frozen in its swing, icicles plumb from its mouth
  const sl = [lp(EF, WF, 0.1, 26), lp(EF, WF, 0.7, 30), lp(EF, WF, 0.78, 60), add(lp(EF, WF, 0.62, 80), [10, 90]), add(lp(EF, WF, 0.3, 60), [-6, 120]), lp(EF, WF, 0.05, 40)];
  f.part(sl, GOWN({ k: 0.85 }));
  W.clipDraw(f, sl, () => { W.fold(f, [lp(EF, WF, 0.5, 34), add(lp(EF, WF, 0.45, 60), [0, 80])], 2); W.fold(f, [lp(EF, WF, 0.25, 34), add(lp(EF, WF, 0.2, 50), [0, 90])], 2); W.hoar(f, lp(EF, WF, 0.6, 40), 30, 40, 0.6); f.part(hard([lp(EF, WF, 0.4, 44), lp(EF, WF, 0.56, 46), lp(EF, WF, 0.56, 70), lp(EF, WF, 0.4, 68)]), GOWN({ fill: '#30363f', cast: false, inkW: 1 })); });
  W.icicles(f, [add(lp(EF, WF, 0.62, 80), [10, 90]), add(lp(EF, WF, 0.3, 60), [-6, 120])], 5, 12, 34);
  W.rimeCrust(f, [lp(EF, WF, 0.15, -28), lp(EF, WF, 0.8, -26)], 7, [1, -0.3]);
  // the watch: chain through the fist square to the forearm, then hanging plumb; the case back faces us, its face him
  f.bone('watch');
  const gw = K.B.gripAngle(WF, EF, Math.atan2(-1, -0.2) - 0.75, { name: 'horologist chain', quiet: false });
  const ax2 = [Math.cos(gw.axis), Math.sin(gw.axis)];
  const out = add(WF, mul(ax2, -30)), WC = add(out, [8, 96]);
  W.chainLinks(f, [add(WF, mul(ax2, 32)), add(WF, mul(ax2, 44)), add(WF, mul(ax2, 40))], 9, P.brassL); // the short tail out of the thumb side
  W.chainLinks(f, [out, add(out, [8, 22]), add(WC, [0, -46])], 10, P.brassL);
  f.part(limb(add(WC, [0, -50]), add(WC, [0, -36]), 10, 12, { steps: 3, capK: 0.5 }), BRZ({ fill: P.brassL, inkW: 1.2, cast: false })); // crown
  f.line(ell(add(WC, [0, -52]), 10, 8, 0, 12).concat([ell(add(WC, [0, -52]), 10, 8, 0, 12)[0]]), 3, P.brassL); // bow
  f.part(ell(add(WC, [-6, 0]), 36, 40, 0, 24), BRZ({ fill: P.brassD, cast: false })); // the case edge, toward him
  f.flat(ell(add(WC, [-9, 0]), 33, 38, 0, 24), '#c8dce6', { op: 0.55 }); // a sliver of the crystal on his side
  const back = ell(WC, 34, 40, 0, 24);
  W.bplate(f, back, BRZ({ shade: 0.4 }), { hard: false, bev: 4 });
  W.clipDraw(f, back, () => { for (let r = 6; r < 34; r += 5) f.line(ell(WC, r, r * 1.16, 0, 20).concat([ell(WC, r, r * 1.16, 0, 20)[0]]), 0.8, INK, { op: 0.4 }); for (let i = 0; i < 8; i++) f.line([WC, add(WC, rot([30, 0], i * Math.PI / 4))], 0.8, INK, { op: 0.35 }); W.hoar(f, add(WC, [14, -14]), 18, 18, 0.7); }); // engine-turned back
  W.lichtenberg(f, add(WC, [-10, 10]), 1.2, 30, 1.6, { metal: true, depth: 2 });
  W.icicle(f, add(WC, [4, 39]), 16, 4, { drop: true });
  f.bone('hand_f');
  K.B.fist(f, WF, gw.ang, 44, P.skinI, { flip: gw.flip, shadow: '#565c72', tex: 'mottle' + seed, texOp: 0.4 });
  for (let i = 0; i < 3; i++) f.line([add(WF, rot([-14 + i * 8, -10], gw.ang)), add(WF, rot([-8 + i * 8, -4], gw.ang))], 1, INK, { op: 0.5 }); // knuckle creases
  W.facets(f, WF, 16, 14, 3, { s: 0.6 });

  // ---- robe body and gown
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.34, 0.32], [0.06, 0.62, 0.48], [0.22, 0.66, 0.64], [0.45, 0.6, 0.62], [0.7, 0.56, 0.56], [0.9, 0.6, 0.58], [1.04, 0.66, 0.62]]);
  f.part(torso, RB());
  f.bone('skirt');
  const sk = [S.at(-0.62, 0.84), S.at(0.6, 0.82), add(S.at(0.7, 1.0), [20, 40]), [760, 1180], [784, 1342, 1], [740, 1326], [700, 1350, 1], [640, 1332], [590, 1352, 1], [530, 1330], [470, 1352, 1], [420, 1326], [360, 1340, 1], [330, 1300], [300, 1200], add(S.at(-0.74, 1.0), [-30, 30])];
  f.part(sk, RB());
  W.clipDraw(f, sk, () => {
    for (const g of [[[540, 900], [560, 1100], [560, 1330]], [[460, 900], [430, 1100], [420, 1320]], [[620, 920], [668, 1120], [690, 1330]], [[380, 960], [350, 1150], [350, 1300]], [[700, 980], [740, 1200]]]) W.fold(f, g, 2.4);
    f.flat([[300, 1220], [800, 1220], [800, 1360], [300, 1360]], P.mud, { op: 0.3 });
    W.hoar(f, [700, 1100], 60, 120, 0.6);
    for (const g of [[[500, 1180], [520, 1240], [510, 1330]], [[600, 1180], [628, 1260]], [[400, 1100], [390, 1200]]]) W.fold(f, g, 1.6);
    for (const [x, y] of [[470, 1000], [600, 1220], [380, 1180]]) { f.part(hard([[x, y], [x + 40, y - 4], [x + 42, y + 36], [x + 2, y + 40]]), RB({ fill: '#2a303c', light: '#3a4252', cast: false, inkW: 1.1, tex: 'weave' + seed, texOp: 0.7 })); f.stitches([[x, y], [x + 40, y - 4], [x + 42, y + 36], [x + 2, y + 40], [x, y]], '#8a92a0', 0.9); }
    f.flat(ell([520, 1060], 40, 22, 0.3, 12), '#5a5c58', { op: 0.25 }); f.flat(ell([640, 960], 26, 14, -0.2, 12), '#5a5c58', { op: 0.25 }); // old stains
    for (let i = 0; i < 12; i++) f.flat(ell([340 + i * 38 + (i % 3) * 6, 1300 - (i % 2) * 14], 10, 4, 0, 8), '#0e1014', { op: 0.5 }); // a burnt, holed hem
    // the robe is torn open over the far knee: a gear fused into the joint
    f.part([add(KF, [-20, -50]), add(KF, [40, -40]), add(KF, [46, 30]), add(KF, [0, 46]), add(KF, [-24, 20])], SKN({ cast: false }));
    W.gear(f, add(KF, [12, -4]), 32, 14, { a: 0.5, look: BRZ(), solid: true });
    W.lichtenberg(f, add(KF, [30, 20]), 1.2, 50, 2.2, { depth: 2 });
  });
  f.line([add(KF, [-20, -50]), add(KF, [40, -40]), add(KF, [46, 30])], 2, INK, { op: 0.7 });
  W.rimeCrust(f, [[684, 900], [742, 1060], [776, 1240], [784, 1330]], 9, [1, -0.2]);
  W.icicles(f, [[784, 1342], [700, 1350], [590, 1352], [470, 1352], [360, 1340]], 10, 12, 34);
  // the open gown over the robe: hangs from the shoulders down the back, its front edge stiff
  f.bone('torso');
  const gown = [S.at(-0.3, -0.08), S.at(0.1, -0.02), S.at(0.1, 0.4), S.at(-0.1, 0.86), [380, 1000], [330, 1150], [300, 1290], [258, 1310, 1], [270, 1270], [236, 1290, 1], [250, 1200], [262, 1000], S.at(-0.78, 0.5), S.at(-0.7, 0.12)];
  f.part(gown, GOWN());
  W.clipDraw(f, gown, () => { for (const g of [[S.at(-0.4, 0.2), [330, 900], [290, 1200]], [S.at(-0.2, 0.3), [380, 900], [320, 1250]]]) W.fold(f, g, 2.4); W.hoar(f, S.at(-0.3, 0.1), 50, 40, 0.5); });
  W.icicles(f, [[300, 1290], [258, 1310], [236, 1290]], 4, 12, 30);
  // the star-chart stole down the front: constellations in bone thread
  f.bone('stole');
  const st = [S.at(0.06, -0.04), S.at(0.34, -0.02), S.at(0.54, 0.4), S.at(0.6, 0.96), S.at(0.6, 1.3), [672, 1112], S.at(0.42, 1.32), S.at(0.38, 0.9), S.at(0.3, 0.4)];
  f.part(st, W.ROBE(f, { fill: '#34405a', shadow: '#161c2c', light: '#56688a', tex: 'weave' + seed }));
  W.clipDraw(f, st, () => {
    const star = (q, r = 2.4) => { f.flat(ell(q, r, r, 0, 6), P.bone); f.line([add(q, [-r * 2, 0]), add(q, [r * 2, 0])], 0.8, P.bone, { op: 0.7 }); f.line([add(q, [0, -r * 2]), add(q, [0, r * 2])], 0.8, P.bone, { op: 0.7 }); };
    const cons = [[[0.3, 0.1], [0.36, 0.18], [0.42, 0.16], [0.46, 0.26]], [[0.44, 0.46], [0.5, 0.52], [0.46, 0.6], [0.52, 0.68], [0.5, 0.76]], [[0.48, 0.9], [0.54, 0.98], [0.5, 1.08], [0.56, 1.16]]];
    for (const c2 of cons) { f.line(c2.map(([u, v]) => S.at(u, v)), 0.9, P.boneD, { op: 0.8, dash: '3 2' }); c2.forEach(([u, v], i) => star(S.at(u, v), i % 2 ? 2 : 3)); }
    f.stitches([S.at(0.36, 0.0), S.at(0.56, 0.4), S.at(0.6, 1.2)], P.boneD, 0.8);
    W.hoar(f, S.at(0.5, 0.3), 30, 60, 0.5);
  });
  W.icicles(f, [S.at(0.6, 1.3), [672, 1112], S.at(0.42, 1.32)], 3, 10, 22);
  // belt: dividers, quadrant, chained almanac
  f.bone('pelvis');
  f.part([S.at(-0.66, 0.78), S.at(0.62, 0.76), S.at(0.64, 0.85), S.at(-0.68, 0.87)], W.LEA(f, { sharp: true }));
  f.part(hard([S.at(0.14, 0.75), S.at(0.3, 0.75), S.at(0.3, 0.87), S.at(0.14, 0.87)]), BRZ({ inkW: 1.1, cast: false }));
  const dv = S.at(-0.1, 0.86); // dividers hanging point-down from a loop
  f.part(hard([add(dv, [-4, 0]), add(dv, [4, 0]), add(dv, [-6, 110]), add(dv, [-10, 110])]), W.ST(f, { inkW: 1, cast: false }));
  f.part(hard([add(dv, [-4, 0]), add(dv, [4, 0]), add(dv, [22, 106]), add(dv, [18, 108])]), W.ST(f, { inkW: 1, cast: false }));
  f.part(ell(add(dv, [0, 4]), 8, 8, 0, 10), BRZ({ cast: false, inkW: 1 }));
  const qd = S.at(-0.46, 0.9); // brass quadrant: a quarter-plate with a degree arc and a plumb bob
  W.bplate(f, [add(qd, [0, 0]), add(qd, [70, 6]), add(qd, [64, 30]), add(qd, [48, 52]), add(qd, [24, 66]), add(qd, [-4, 70])], BRZ(), { hard: false, bev: 3 });
  for (let i = 0; i < 9; i++) { const t = i / 8 * Math.PI / 2 * 0.9 + 0.1, q = add(qd, [Math.cos(t) * 62, Math.sin(t) * 62]); f.line([q, add(qd, [Math.cos(t) * 54, Math.sin(t) * 54])], 1, INK); }
  f.line([add(qd, [4, 4]), add(qd, [4, 60])], 0.9, INK); f.part(ell(add(qd, [4, 64]), 3.6, 4.6, 0, 8), W.IR(f, { cast: false, inkW: 1 }));
  const bk = S.at(-0.74, 0.98); // the almanac on a chain: closed, its cover toward us
  W.chainLinks(f, [S.at(-0.62, 0.86), add(bk, [20, -6])], 8, P.ironL);
  f.part(hard([add(bk, [-28, 0]), add(bk, [28, -4]), add(bk, [32, 74]), add(bk, [-24, 78])]), W.LEA(f, { fill: '#3e2e26' }));
  f.part(hard([add(bk, [-28, 0]), add(bk, [-22, -4]), add(bk, [-18, 74]), add(bk, [-24, 78])]), W.LEA(f, { fill: '#2a1e1a', cast: false }));
  f.part(ell(add(bk, [4, 36]), 12, 12, 0, 12), BRZ({ cast: false, inkW: 1.1 })); f.line([add(bk, [4, 26]), add(bk, [4, 46])], 1, INK);
  W.icicles(f, [add(bk, [-24, 78]), add(bk, [32, 74])], 3, 8, 18);

  // ---- back harness straps over the near shoulder
  f.bone('torso');
  f.part([S.at(-0.5, -0.02), S.at(-0.3, -0.06), S.at(0.3, 0.5), S.at(0.16, 0.54)], W.LEA(f, { sharp: true }));
  f.part(hard([S.at(0.12, 0.42), S.at(0.3, 0.42), S.at(0.3, 0.5), S.at(0.12, 0.5)]), BRZ({ inkW: 1.1, cast: false }));
  // the collar: a brass gear-ring fused round the base of the neck
  f.bone('head');
  f.part(limb(S.at(0.2, -0.06), add(HC, [-20, 70]), 74, 64), SKN());
  W.gear(f, S.at(0.18, -0.02), 52, 30, { a: 0.1, look: BRZ({ fill: P.brass }), solid: true });
  W.weld(f, [S.at(-0.1, -0.04), S.at(0.18, 0.08), S.at(0.46, -0.02)], 4, { a: -1.6 });
  // ---- head: gaunt, stooped forward, squinting through the brass lens at the watch
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: P.skinI, jaw: 1.05, chin: 0.02, nose: 1.12, hook: 0.6, mouth: 'set', squint: 0.6, browDown: 0.1, browW: 0.06, age: true, gaunt: true, faceShade: 0.82, jawShade: 0.4,
    eyeWhite: '#d8e2e8', iris: '#2a3038', hairCol: '#a8b0b4', browCol: '#dfe6ea', noEar: false,
    
  });
  W.clipDraw(f, hF([[-0.3, -0.42], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.35, -0.13], [-0.37, -0.13]]), () => { for (let i = 0; i < 4; i++) f.flat(ell(hF([[-0.1 + i * 0.1, -0.36 + (i % 2) * 0.04]])[0], 6, 3, hA, 8), '#7a8496', { op: 0.35 }); }); // frost on the bald crown, age spots
  W.facets(f, hF([[0.2, 0.08]])[0], 26, 20, 4, { s: 1, op: 0.25 });
  // a scholar's quilted coif over the crown, and long white hair frozen stiff out from under it
  f.part(hF([[-0.3, 0.06], [-0.52, 0.1], [-0.62, 0.3], [-0.6, 0.5], [-0.46, 0.4], [-0.4, 0.22]]), { fill: '#d4dade', shadow: '#5a6274', light: '#ffffff', shade: 0.4, tex: 'rime' + seed, texOp: 0.5 });
  for (let i = 0; i < 5; i++) f.stroke(hF([[-0.32 - i * 0.05, 0.06 + i * 0.02], [-0.44 - i * 0.04, 0.24 + i * 0.03], [-0.5 - i * 0.02, 0.44 + i * 0.02]]), 3, i % 2 ? '#f0f4f6' : '#7a8494', { op: 0.75 });
  W.icicles(f, hF([[-0.62, 0.42], [-0.48, 0.42]]), 2, 8, 18);
  const coif = hF([[-0.42, 0.06], [-0.46, -0.2], [-0.36, -0.42], [-0.14, -0.56], [0.12, -0.54], [0.28, -0.4], [0.3, -0.3], [0.1, -0.33], [-0.1, -0.28], [-0.24, -0.12], [-0.3, 0.08]]);
  f.part(coif, RB({ fill: '#2a303c', tex: 'quilt' + seed, texOp: 0.6 }));
  W.clipDraw(f, coif, () => { for (let i = 0; i < 4; i++) f.line(hF([[-0.36 + i * 0.14, -0.46 + i * 0.03], [-0.3 + i * 0.12, -0.2], [-0.26 + i * 0.1, 0.0]]), 1.4, INK, { op: 0.5 }); W.hoar(f, hF([[0.1, -0.46]])[0], 50, 22, 0.8); });
  f.part(hF([[0.3, -0.3], [0.1, -0.35], [-0.12, -0.3], [-0.26, -0.14], [-0.32, 0.06], [-0.4, 0.06], [-0.34, -0.18], [-0.16, -0.38], [0.12, -0.42], [0.32, -0.36]]), RB({ fill: '#3e4656', cast: false, inkW: 1.2 })); // rolled edge
  W.rimeCrust(f, hF([[-0.36, -0.42], [-0.14, -0.58], [0.12, -0.56], [0.28, -0.42]]), 10, [1, -0.3]);
  W.icicles(f, hF([[0.3, -0.31], [0.1, -0.34]]), 2, 8, 14);
  // the brass lens over the near eye: a thick ring clamped on a strap, a domed glass that catches aurora
  W.rope(f, hF([[0.06, -0.14], [-0.1, -0.2], [-0.3, -0.18], [-0.4, -0.06]]), 4, { col: '#3a302a' });
  const lc = hF([[0.13, -0.07]])[0];
  f.part(limb(lc, add(lc, rot([24, 0], hA)), 46, 42, { steps: 3, capK: 0.2 }), BRZ({ inkW: 1.4 }));
  f.part(ell(add(lc, rot([24, 0], hA)), 9, 21, hA, 16), { fill: P.clear, shadow: '#2a3848', light: '#eef6fa', shade: 0.35, inkW: 1.5, cast: false, hatch: false });
  f.flat(ell(add(lc, rot([24, -4], hA)), 3, 7, hA, 10), '#ffffff', { op: 0.75 });
  f.flat(ell(add(lc, rot([24, 8], hA)), 2, 4, hA, 8), P.aur, { op: 0.75 });
  for (let i = 0; i < 5; i++) f.line([add(lc, rot([4 + i * 4, -22], hA)), add(lc, rot([4 + i * 4, -18], hA))], 1, INK, { op: 0.7 }); // knurled ring
  // the long beard, frozen stiff mid-swing: it juts forward and down; icicles hang plumb from it
  f.bone('beard');
  const bd = [hF([[-0.14, 0.22]])[0], hF([[0.06, 0.3]])[0], hF([[0.32, 0.34]])[0], hF([[0.36, 0.5]])[0], add(hF([[0.3, 0.6]])[0], [40, 120]), add(hF([[0.1, 0.6]])[0], [70, 210]), add(hF([[0.0, 0.6]])[0], [30, 150]), add(hF([[-0.1, 0.5]])[0], [0, 90])];
  f.part(bd, { fill: '#c8cfd4', shadow: '#4e5668', light: '#ffffff', shade: 0.4, tex: 'rime' + seed, texOp: 0.6 });
  W.clipDraw(f, bd, () => { for (let i = 0; i < 9; i++) { const q0 = lerp(bd[1], bd[3], i / 9), q1 = lerp(bd[7], bd[5], i / 9); f.stroke([q0, lerp(q0, q1, 0.5).map((v, j) => v + (j ? 0 : 6)), q1], 3, i % 2 ? '#5a6274' : '#f2f6f8', { op: 0.7 }); } });
  for (let i = 0; i < 6; i++) f.stroke([hF([[0.18 + i * 0.03, 0.22]])[0], hF([[0.16 + i * 0.035, 0.3]])[0], add(hF([[0.14 + i * 0.04, 0.34]])[0], [0, 10])], 4, i % 2 ? '#e8eef0' : '#9aa4b0'); // moustache strands, frozen
  W.icicles(f, [add(hF([[0.3, 0.6]])[0], [40, 120]), add(hF([[0.1, 0.6]])[0], [70, 210]), add(hF([[0.0, 0.6]])[0], [30, 150])], 6, 12, 34);
  W.icicles(f, [hF([[0.36, 0.5]])[0], add(hF([[0.3, 0.6]])[0], [40, 120])], 3, 10, 24);

  // ---- the telescope cane (near hand)
  f.bone('cane');
  const segs = [[ct, lerp(ct, cb, 0.22), 18], [lerp(ct, cb, 0.2), lerp(ct, cb, 0.55), 24], [lerp(ct, cb, 0.53), cb, 30]];
  for (const [a, b2, w] of segs) { const d0 = f.part(limb(a, b2, w, w, { steps: 6, capK: 0.2 }), BRZ({ k: 0.9 })); W.bevel(f, d0, E.bbox([add(a, [-w, -w]), add(b2, [w, w])]), 3); f.part(limb(lerp(a, b2, 0.92), b2, w + 8, w + 8, { steps: 2, capK: 0.2 }), BRZ({ fill: P.brassL, cast: false, inkW: 1.2 })); }
  f.part(limb(add(ct, [2, -16]), ct, 14, 18, { steps: 3, capK: 0.6 }), W.IR(f, { cast: false })); // eyepiece
  f.part(limb(lerp(ct, cb, 0.98), cb, 34, 34, { steps: 2, capK: 0.3 }), W.IR(f, { cast: false })); // ferrule cap over the objective
  W.rimeCrust(f, [lp(cb, ct, 0.1, 14), lp(cb, ct, 0.9, 10)], 5, [1, -0.2]);
  W.lichtenberg(f, lerp(ct, cb, 0.6), 1.5, 80, 2, { metal: true, depth: 2 });
  W.icicles(f, [lp(ct, cb, 0.21, -14), lp(ct, cb, 0.21, 14)], 2, 8, 16);
  W.icicles(f, [lp(ct, cb, 0.55, -16), lp(ct, cb, 0.55, 18)], 2, 8, 18);

  // ---- near arm: a gown sleeve, the hand on the cane with a gear fused into the wrist
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [86, 74, 60], GOWN({ fill: '#343a48' }), '_n', { bp: [[0, 0.5, 0.15, 0.2], [1, 0.5, 0.2, 0.25]], bq: [[0, 0.3, 0.08, 0.2]] });
  f.bone('upperarm_n'); W.fold(f, [lp(SN, EN, 0.4, 20), lp(SN, EN, 0.7, -10)], 2.2); W.fold(f, [lp(SN, EN, 0.75, 30), lp(SN, EN, 0.95, -20)], 2.2);
  f.bone('forearm_n');
  const nsl = [lp(EN, WN, 0.1, 30), lp(EN, WN, 0.5, 56), add(lp(EN, WN, 0.6, 50), [0, 70]), add(lp(EN, WN, 0.3, 40), [-10, 92]), lp(EN, WN, 0.02, 40)];
  f.part(nsl, GOWN({ fill: '#2e3442', k: 0.85 }));
  W.icicles(f, [add(lp(EN, WN, 0.6, 50), [0, 70]), add(lp(EN, WN, 0.3, 40), [-10, 92])], 4, 10, 30);
  const wr = lp(EN, WN, 0.86, 0);
  f.part(ell(wr, 22, 26, ang(EN, WN), 12), SKN({ cast: false }));
  W.gear(f, wr, 22, 12, { a: 0.4, look: BRZ({ fill: P.brassL }), solid: true });
  W.lichtenberg(f, add(wr, [10, 8]), 0.5, 40, 1.8, { depth: 2 });
  W.rimeCrust(f, [lp(EN, WN, 0.2, -32), lp(EN, WN, 0.7, -28)], 6, [1, -0.3]);
  f.bone('hand_n');
  B.grip(f, WN, EN, ang(cb, ct), 42, P.skinI, { shadow: '#565c72', tex: 'mottle' + seed, texOp: 0.4, name: 'horologist cane' });
  W.facets(f, WN, 16, 12, 3, { s: 0.6 });
  f.bone('torso'); // the near shoulder of the gown, with rime
  W.rimeCrust(f, [S.at(-0.2, -0.1), S.at(0.2, -0.08), S.at(0.5, 0.0)], 9, [1, -0.3]);

  f.bone('root');
  f.flat(ell([540, gy + 4], 280, 18, 0, 20), '#000', { op: 0.3 });
  return f;
}

// a carved stone fist, closed on nothing, seen from the back of the hand with the thumb on the front edge: the wrist,
// the back of the hand with its tendons, a knuckle row, the curled fingers below it, the thumb lying across them.
// F's local x runs along the forearm (toward the knuckles), -y is the thumb side.
function carvedFist(f, c, a, s, look, thumbSide = -1) {
  const F0 = frame(c, a, s), F = pts => F0(pts.map(p => [p[0], p[1] * -thumbSide, p[2]]));
  const lt = '#f2f8fb', dk = '#2c3a50';
  const mass = F([[-0.2, -0.5], [0.4, -0.56], [0.86, -0.5], [1.1, -0.26], [1.14, 0.16], [1.04, 0.5], [0.62, 0.58], [0.1, 0.56], [-0.2, 0.5]]);
  f.part(mass, Object.assign({}, look, { k: 0.8, maxShade: s * 0.45 }));
  W.clipDraw(f, mass, () => {
    for (const y of [-0.24, 0.02, 0.26]) f.stroke(F([[0.0, y * 0.8], [0.3, y * 0.95], [0.62, y]]), s * 0.05, dk, { op: 0.35 }); // tendons
    for (let i = 0; i < 4; i++) { const y = -0.36 + i * 0.25; f.flat(F(ell([0.7, y], 0.1, 0.11, 0, 10)), lt, { op: 0.55 }); } // the knuckles
    f.stroke(F([[0.8, -0.5], [0.84, -0.1], [0.82, 0.3], [0.8, 0.54]]), s * 0.06, INK, { op: 0.7 }); // the crease under the knuckles
    for (let i = 0; i < 3; i++) { const y = -0.24 + i * 0.25; f.line(F([[0.84, y], [1.1, y + 0.02]]), Math.max(1.6, s * 0.03), INK, { op: 0.8 }); } // the curled fingers
    for (let i = 0; i < 4; i++) { const y = -0.36 + i * 0.25; f.line(F([[0.9, y - 0.08], [1.04, y - 0.06]]), Math.max(1.2, s * 0.02), lt, { op: 0.55 }); }
    f.flat(F([[0.98, -0.5], [1.12, -0.2], [1.12, 0.2], [1.04, 0.5], [0.98, 0.48], [1.04, 0.0]]), dk, { op: 0.35 });
  });
  // the thumb, lying across the front of the curled fingers
  const th = F([[0.2, -0.5], [0.42, -0.7], [0.78, -0.68], [1.02, -0.52], [1.06, -0.36], [0.92, -0.32], [0.62, -0.4], [0.36, -0.36]]);
  f.part(th, Object.assign({}, look, { k: 0.8, cast: false, maxShade: s * 0.2, inkW: 1.4 }));
  f.line(F([[0.94, -0.6], [1.0, -0.42]]), Math.max(1.2, s * 0.02), INK, { op: 0.7 }); // the nail
  f.line(F([[0.4, -0.62], [0.7, -0.64]]), Math.max(1.2, s * 0.025), lt, { op: 0.6 });
  f.line(F([[0.58, -0.48], [0.66, -0.4]]), Math.max(1.2, s * 0.02), INK, { op: 0.6 }); // the joint crease
  return F;
}

// ------------------------------------------------------------------ RIME COLOSSUS (elite 2.5)
// The founder's statue, carved from the spire's blue ice like a block of marble, wound up and walking. Independent
// review rebuild (the first build read as a soft snowman): a sculptor's statue with heroic proportions, stepping down
// off its stone plinth toward the party, the trailing foot still on the plinth top and rimed to it. A long tunic falls
// in deep chiselled tube folds, pressed forward by the stepping knee and slung between the legs; a heavy mantle is
// wrapped over the near shoulder and round the back, its rolled edge crossing the body to the far hip, where its end
// drops in a carved zigzag cascade. The far forearm comes forward out of a deep hanging sleeve, the carved hand closed
// round the founder's charter (a scroll with rolled ends, a ribbon tie and a hanging seal); the near arm hangs heavy,
// the great carved fist closed: the slow crushing fist. Head: a dignified carved face, heavy-lidded stone eyes with no
// pupils, a straight nose chipped at the tip, a long beard of drilled spiral locks, hair in carved waves under a fillet.
// Weathering: chips on every edge, cracks, runs of grime from the crevices. Frost (dominant): thick rime on the windward
// (front, top) faces, icicles plumb from every lower edge. Through the clearer ice of the chest the clockwork shows; a
// brass wind-up key turns in its back, its collar fused by lightning; aurora-green fern cracks run inside the ice.
// Rig: humanoid + key (torso), scroll (hand_f), skirt (pelvis); the plinth is on root. Motion: idle is ticking (key,
// head); attack is the slow fist coming up and down (upperarm_n, forearm_n).
function rimeColossus() {
  const seed = 1102, [CW, CH] = T.elite, f = new Fig(W.base(seed, CH, { grimeY: 1150 }));
  W.textures(f);
  const gy = f.o.groundY, H = 215;
  const N = [690, 318], C = [648, 540], Pv = [600, 792];
  const S = B.spine(N, C, Pv, 220);
  const SN = [588, 392], EN = [536, 606], WN = [566, 806];
  const SF = [782, 404], EF = [812, 604], WF = [986, 590];
  const HN = [640, 800], KN = [752, 1052], AN = [800, 1296];
  const HF = [575, 790], KF = [524, 985], AF = [390, 1134];
  const HC = [742, 160], hA = 0.04;
  const PL = [96, 474, 1190]; // plinth front face: x0, x1, top edge
  const IC = (o = {}) => Object.assign({ fill: '#b0c2cf', shadow: '#44566e', light: '#f2f7fa', shade: 0.42, maxShade: 60, tex: 'chisel' + seed, texOp: 0.7 }, o);
  const ICD = (o = {}) => IC(Object.assign({ fill: '#9cb0c0', shadow: '#3a4a62' }, o));
  const trough = (pts, w, o) => W.trough(f, pts, w, o), lock = (...a) => W.lock(f, ...a);
  W.humanJoints(f, { P: Pv, T: S.at(0, 0.88), N: S.at(0.2, -0.04), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('key', [508, 468], 'torso').joint('scroll', WF, 'hand_f').joint('skirt', S.at(0, 0.84), 'pelvis');

  // ---- the plinth: grey stone, a moulded cornice, the founder's brass plaque, its front corner broken where the foot
  // tore free (root: it does not move)
  f.bone('root');
  f.flat(ell([600, gy + 4], 380, 22, 0, 20), '#000', { op: 0.3 });
  const stone = { fill: '#7c8086', shadow: '#2e3238', light: '#b8bcc0', shade: 0.42, tex: 'pit' + seed, texOp: 0.8 };
  const plTop = [[PL[0] + 40, PL[2] - 24, 1], [PL[1] + 20, PL[2] - 24, 1], [PL[1], PL[2], 1], [PL[0], PL[2], 1]];
  f.part(plTop, Object.assign({}, stone, { fill: '#8e9298', cast: false }));
  const plF = [[PL[0], PL[2], 1], [PL[1] - 22, PL[2], 1], [PL[1] - 6, PL[2] + 26], [PL[1] + 10, PL[2] + 40, 1], [PL[1] - 4, PL[2] + 84], [PL[1] + 6, PL[2] + 112, 1], [PL[1] - 8, gy, 1], [PL[0], gy, 1]];
  f.part(plF, stone);
  W.clipDraw(f, plF, () => {
    // cornice mouldings: a lit roll and a shadowed cove under it; a plinth course at the foot
    f.flat([[PL[0], PL[2]], [PL[1], PL[2]], [PL[1], PL[2] + 16], [PL[0], PL[2] + 16]], '#a8acb0', { op: 0.7 });
    f.line([[PL[0], PL[2] + 16], [PL[1], PL[2] + 16]], 2.4, INK, { op: 0.7, straight: true });
    f.flat([[PL[0], PL[2] + 17], [PL[1], PL[2] + 17], [PL[1], PL[2] + 30], [PL[0], PL[2] + 30]], '#20242a', { op: 0.5 });
    f.line([[PL[0], gy - 26], [PL[1], gy - 26]], 2, INK, { op: 0.6, straight: true });
    f.flat([[PL[0], gy - 26], [PL[1], gy - 26], [PL[1], gy], [PL[0], gy]], '#2a2e34', { op: 0.3 });
    W.streaks(f, [280, PL[2] + 40], 170, 9, 90, { col: '#2a2e34', op: 0.25 });
    W.frostCracks(f, [420, PL[2] + 90], 40, 60, 3, 1.4);
    f.flat([[PL[1] - 30, PL[2] + 2], [PL[1] - 4, PL[2] + 26], [PL[1] + 10, PL[2] + 40], [PL[1] - 6, PL[2] + 84], [PL[1] - 30, PL[2] + 60]], '#c4c8cc', { op: 0.45 }); // the fresh break
  });
  const pq = [[PL[0] + 56, PL[2] + 54], [PL[0] + 260, PL[2] + 50], [PL[0] + 262, PL[2] + 128], [PL[0] + 58, PL[2] + 132]];
  W.bplate(f, pq, W.BRD(f), { bev: 4, after: () => { for (let i = 0; i < 4; i++) f.line([[PL[0] + 76, PL[2] + 72 + i * 15], [PL[0] + 76 + 150 - i * 22, PL[2] + 71 + i * 15]], 2.4, INK, { op: 0.65, straight: true }); W.hoar(f, [PL[0] + 230, PL[2] + 64], 40, 20, 0.6); W.lichtenberg(f, [PL[0] + 240, PL[2] + 60], 2.4, 50, 1.6, { metal: true, depth: 2 }); } });
  for (const q of pq) f.rivet([q[0] + (q[0] > PL[0] + 150 ? -9 : 9), q[1] + (q[1] > PL[2] + 90 ? -9 : 9)], 3, P.brassL);
  for (const [x, y, r] of [[548, gy - 12, 28], [596, gy - 6, 16], [520, gy - 4, 12], [52, gy - 8, 20]]) f.part(W.lumpy(f, ell([x, y], r * 1.4, r, 0.2, 7), r * 0.25).map(q => [q[0], q[1], 1]), Object.assign({}, stone, { fill: '#8a8e94' })); // broken chunks
  W.rimeCrust(f, [[PL[0] + 40, PL[2] - 24], [PL[1] + 20, PL[2] - 24], [PL[1], PL[2]]], 9, [1, -0.3]);
  W.icicles(f, [[PL[0] + 10, PL[2] + 30], [PL[1] - 40, PL[2] + 30]], 8, 10, 30);

  // ---- the wind-up key in the back (behind the body); its collar fused to the ice by the strike
  f.bone('key');
  const k0 = [520, 466], k1 = [372, 438], kb = [332, 430];
  f.part(limb(k0, k1, 34, 30, { steps: 4, capK: 0.3 }), W.IR(f, { inkW: 1.6 }));
  for (const t of [0.35, 0.6]) f.part(limb(lerp(k0, k1, t), lerp(k0, k1, t + 0.05), 40, 40, { steps: 2, capK: 0.2 }), W.BR(f, { inkW: 1.3, cast: false }));
  f.part(ell(lerp(k0, k1, 0.1), 18, 40, ang(k0, k1), 14), W.BR(f, { inkW: 1.5 }));
  W.weld(f, [add(lerp(k0, k1, 0.08), [0, -38]), add(lerp(k0, k1, 0.04), [6, 0]), add(lerp(k0, k1, 0.08), [0, 38])], 5, { a: 2.4 });
  f.part(limb(add(kb, [0, -44]), add(kb, [0, 44]), 46, 46, { steps: 4, capK: 0.4 }), W.BR(f, { inkW: 1.8 }));
  for (const [dy, a] of [[-84, -0.2], [84, 0.15]]) {
    const c = add(kb, [-8, dy]), o = ell(c, 60, 72, a, 26), i = ell(add(c, [0, dy > 0 ? 8 : -8]), 30, 34, a, 22).reverse();
    const d = f.part(E.smooth(o) + ' ' + E.smooth(i), W.BR(f, { inkW: 2.2, shade: 0.45, bbPts: o }));
    W.bevel(f, d, E.bbox(o), 7);
    W.clipDraw(f, o, () => { W.soot(f, add(c, [-20, 0]), 36, 44, 0.3); W.hoar(f, add(c, [30, -30]), 36, 26, 0.7); W.dent(f, add(c, [-30, 20]), 8); });
  }
  W.rivetRow(f, add(kb, [-2, -36]), add(kb, [-2, 36]), 3, 4, P.brassL);
  W.lichtenberg(f, add(kb, [-24, -120]), 2.2, 60, 2.4, { metal: true, depth: 2 });
  W.rimeCrust(f, [add(kb, [-56, -148]), add(kb, [-8, -162]), add(kb, [44, -138])], 9, [1, -0.3]);
  W.icicles(f, [add(kb, [-56, 150]), add(kb, [-8, 162]), add(kb, [44, 140])], 6, 14, 36);

  // ---- far arm: the upper arm mostly behind the chest, the forearm forward out of a deep hanging sleeve
  f.bone('upperarm_f');
  W.armRig(f, SF, EF, WF, [104, 100, 82], ICD(), '_f', { bp: [[0, 0.5, 0.1, 0.2]] });
  f.bone('forearm_f');
  // the sleeve: wide at the elbow, hanging below the forearm in heavy folds, its mouth open at the wrist
  const sv = [lp(EF, WF, -0.12, 60), lp(EF, WF, 0.3, 58), lp(EF, WF, 0.62, 54), lp(EF, WF, 0.7, 46), lp(EF, WF, 0.72, -44), [WF[0] - 60, 700], [WF[0] - 100, 742, 1], [WF[0] - 140, 716], [WF[0] - 180, 750, 1], [EF[0] - 10, 712], lp(EF, WF, -0.16, -50)];
  f.part(sv, IC({ fill: '#a8bccb' }));
  W.clipDraw(f, sv, () => {
    trough([lp(EF, WF, 0.1, -30), [WF[0] - 150, 680], [WF[0] - 166, 740]], 16, { open: true });
    trough([lp(EF, WF, 0.36, -30), [WF[0] - 96, 690], [WF[0] - 104, 736]], 14, { open: true });
    trough([lp(EF, WF, 0.05, 20), lp(EF, WF, 0.4, 10), lp(EF, WF, 0.62, 30)], 10);
    W.lichtenberg(f, lp(EF, WF, 0.2, 10), 0.4, 80, 2.2, { depth: 2, col: '#1e3a3c' });
  });
  f.flat([lp(EF, WF, 0.64, 44), lp(EF, WF, 0.72, 40), lp(EF, WF, 0.74, -36), lp(EF, WF, 0.66, -40)], '#1c2638', { op: 0.75 }); // the sleeve's mouth
  W.rimeCrust(f, [lp(EF, WF, -0.1, 58), lp(EF, WF, 0.3, 56), lp(EF, WF, 0.64, 52)], 11, [1, -0.3]);
  W.icicles(f, [[WF[0] - 100, 742], [WF[0] - 140, 716], [WF[0] - 180, 750]], 6, 16, 46);
  W.chip(f, [WF[0] - 140, 714], 9, 0.4);
  // ---- the charter: a carved scroll upright in the fist, rolled ends, a ribbon tie, a seal on a cord
  f.bone('scroll');
  const sT = add(WF, [-6, -150]), sB = add(WF, [6, 150]), sr = 30;
  const scr = limb(sB, sT, sr * 2, sr * 2, { steps: 6, capK: 0.05 });
  f.part(scr, IC({ fill: '#bccbd6', shade: 0.4 }));
  W.clipDraw(f, scr, () => {
    f.line([lp(sB, sT, 0.02, -sr * 0.35), lp(sB, sT, 0.98, -sr * 0.35)], 2.2, INK, { op: 0.6, straight: true }); // the outer sheet's edge
    f.line([lp(sB, sT, 0.02, -sr * 0.35 - 3), lp(sB, sT, 0.98, -sr * 0.35 - 3)], 1.4, '#f2f8fb', { op: 0.6, straight: true });
    W.frostCracks(f, lerp(sB, sT, 0.75), 16, 50, 2, 1.2);
    W.streaks(f, lerp(sB, sT, 0.8), 14, 3, 60);
  });
  for (const e of [sT, sB]) { // rolled ends: the sheet's spiral, seen a little from above (top) and below (bottom)
    const top = e === sT, ce = ell(e, sr, sr * 0.42, 0.04, 18);
    f.part(ce, IC({ fill: top ? '#d4e0e8' : '#8ea4b6', cast: false, inkW: 1.6 }));
    const sp = []; for (let i = 0; i <= 30; i++) { const t = i / 30, a = t * 3.5 * Math.PI * 2, r = sr * (0.92 - t * 0.8); sp.push(add(e, [Math.cos(a) * r, Math.sin(a) * r * 0.42])); }
    f.line(sp, 1.4, INK, { op: 0.7 });
  }
  W.rimeCrust(f, [add(sT, [-sr, -6]), add(sT, [0, -14]), add(sT, [sr + 2, -4]), add(sT, [sr + 6, 60])], 8, [1, -0.3]);
  f.part(K.chain([lp(sB, sT, 0.3, -sr - 2), lp(sB, sT, 0.32, 0), lp(sB, sT, 0.3, sr + 2)], [12, 14, 12]), ICD({ cast: false, inkW: 1.2 })); // the ribbon tie
  const knot = lp(sB, sT, 0.3, sr - 4);
  f.part(ell(knot, 10, 8, 0, 10), ICD({ cast: false, inkW: 1.2 }));
  const sealC = add(knot, [16, 92]);
  f.part(K.chain([knot, add(knot, [10, 40]), add(sealC, [0, -24])], [7, 7, 6]), ICD({ cast: false, inkW: 1 }));
  f.part(ell(sealC, 26, 28, 0.1, 16), IC({ fill: '#a4b8c8', inkW: 1.6, cast: false }));
  f.line(ell(sealC, 17, 19, 0.1, 16).concat([ell(sealC, 17, 19, 0.1, 16)[0]]), 1.8, '#3c4c64', { op: 0.7 });
  for (let i = 0; i < 8; i++) f.line([sealC, add(sealC, rot([i % 2 ? 7 : 14, 0], i * Math.PI / 4))], 1.6, '#3c4c64', { op: 0.7 }); // the founder's star, cut in the seal
  W.chip(f, add(sealC, [18, 14]), 7, 0.8);
  W.icicles(f, [add(sB, [-sr, 4]), add(sB, [sr, 4])], 3, 12, 34);
  W.icicle(f, add(sealC, [0, 26]), 26, 7, { drop: true });
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 66, '#b6c6d2', { shadow: '#3c4c62', tex: 'chisel' + seed, texOp: 0.6, name: 'colossus scroll' });
  W.rimeCrust(f, [add(WF, [-30, -40]), add(WF, [10, -46]), add(WF, [44, -30])], 8, [1, -0.3]);
  W.icicles(f, [add(WF, [-26, 40]), add(WF, [30, 40])], 3, 10, 26);

  // ---- legs (under the tunic: complete for the rig) and the carved sandalled feet
  const sandal = (A, toeDir, s, look) => {
    // a heavy carved foot, the heel down at A's foot, five separate toes, a slab sole, straps over the instep and ankle
    const Fq = frame(A, toeDir, s);
    const foot = Fq([[-0.34, -0.3], [0.02, -0.36], [0.3, -0.24], [0.58, -0.08], [0.8, 0.02], [0.98, 0.06], [1.08, 0.16], [1.1, 0.27], [1.04, 0.3, 1], [-0.36, 0.3, 1], [-0.46, 0.16], [-0.44, -0.06]]);
    f.part(foot, look);
    W.clipDraw(f, foot, () => {
      f.line(Fq([[0.08, -0.3], [0.4, -0.16], [0.7, -0.02]]), 2, '#f2f8fb', { op: 0.55 }); // the lit instep
      f.stroke(Fq([[-0.3, 0.12], [0.3, 0.22], [0.8, 0.24]]), s * 0.05, '#2c3a50', { op: 0.3 }); // the arch's shadow
      W.streaks(f, Fq([[0.2, -0.1]])[0], 40 * s / 100, 3, 30 * s / 100);
      for (const [x, w2] of [[0.36, 0.07], [0.0, 0.08]]) { f.flat(Fq([[x, -0.4], [x + w2, -0.4], [x + w2 + 0.1, 0.3], [x + 0.1, 0.3]]), '#6c8296', { op: 0.9 }); f.line(Fq([[x, -0.4], [x + 0.1, 0.3]]), 1.6, INK, { op: 0.8 }); f.line(Fq([[x + w2, -0.4], [x + w2 + 0.1, 0.3]]), 1.4, INK, { op: 0.6 }); } // straps over the instep and ankle
      f.line(Fq([[0.42, -0.16], [0.7, 0.04], [0.8, 0.16]]), 4, '#6c8296', { op: 0.9 }); // the toe thong
    });
    // the toes: separate carved pads along the front of the foot, the big toe nearest
    for (let i = 3; i >= 0; i--) { const tc = [0.78 + i * 0.075, 0.18 + i * 0.012], tp = Fq(ell(tc, 0.07 - i * 0.008, 0.11 - i * 0.01, 0.2, 10)); f.part(tp, Object.assign({}, look, { cast: false, inkW: 1.2, inkHeavy: 1.6, maxShade: 8 })); f.flat(Fq(ell([tc[0] + 0.02, tc[1] - 0.05], 0.03, 0.02, 0, 6)), '#f2f8fb', { op: 0.6 }); }
    f.part(Fq([[-0.46, 0.27], [1.14, 0.27], [1.12, 0.36, 1], [-0.46, 0.36, 1]]), ICD({ cast: false, inkW: 1.4, fill: '#8ea4b6', maxShade: 6 })); // the sole
    W.chip(f, Fq([[1.02, 0.32]])[0], 7, 0.6);
    return Fq;
  };
  // far leg, trailing: the foot still on the plinth top, rimed to it
  f.bone('thigh_f');
  W.legTube(f, HF, KF, lerp(KF, AF, 0.9), [190, 150, 110], ICD(), '_f', { A: AF });
  f.bone('foot_f');
  const FqF = sandal(add(AF, [10, 0]), -0.02, 120, ICD());
  W.rimeCrust(f, [FqF([[-0.5, 0.36]])[0], FqF([[1.12, 0.36]])[0]], 12, [1, -0.3]);
  W.icicles(f, [FqF([[0.0, 0.4]])[0], FqF([[1.0, 0.4]])[0]], 3, 10, 22);
  // near leg, stepping down: the foot planted on the floor
  f.bone('thigh_n');
  W.legTube(f, HN, KN, lerp(KN, AN, 0.9), [200, 156, 116], IC(), '_n', { A: AN });
  f.bone('foot_n');
  const FqN = sandal(add(AN, [0, 10]), 0.0, 136, IC());
  W.rimeCrust(f, [FqN([[0.1, -0.3]])[0], FqN([[0.56, -0.12]])[0], FqN([[1.0, 0.1]])[0]], 10, [1, -0.3]);

  // ---- the tunic: one carved outline from the neck to the hem, falling over the stepping knee and slung between the
  // legs; cut at the waist for the rig
  const robe = [[648, 312], [590, 336], [548, 356], [522, 400], [506, 480], [500, 580], [506, 680], [500, 762], [470, 862], [424, 962], [384, 1052], [352, 1060], [340, 1082, 1], [380, 1092], [430, 1098, 1], [474, 1090], [526, 1140], [584, 1196], [640, 1226, 1], [700, 1246], [738, 1262, 1], [782, 1268], [830, 1276, 1], [876, 1270], [904, 1258, 1], [892, 1180], [878, 1112], [882, 1060], [872, 1018], [850, 984], [836, 920], [830, 850], [836, 780], [832, 700], [842, 640], [858, 570], [868, 500], [860, 440], [836, 398], [800, 364], [744, 326]];
  const hemF = [[340, 1082], [380, 1092], [430, 1098], [474, 1090]], hemB = [[640, 1226], [700, 1246], [738, 1262], [782, 1268], [830, 1276], [876, 1270], [904, 1258]];
  const WB = S.at(0, 0.8), dW = S.T(0.8);
  split(f, () => {
    f.part(robe, IC({ maxShade: 90 }));
    W.clipDraw(f, robe, () => {
      // the body under the cloth: the stepping thigh and knee pushing forward (lit planes), the belly, the chest
      f.flat([[700, 860], [790, 900], [836, 1010], [800, 1070], [740, 1040], [690, 940]], '#eef4f8', { op: 0.28 });
      f.flat([[760, 560], [840, 560], [846, 700], [780, 720]], '#eef4f8', { op: 0.18 });
      // front panel: tube folds falling plumb from the knee to the hem
      trough([[790, 1080], [802, 1180], [812, 1272]], 22, { open: true });
      trough([[836, 1064], [856, 1170], [872, 1272]], 18, { open: true });
      trough([[756, 1090], [756, 1180], [764, 1262]], 16, { open: true });
      // tension folds dragging back from the knee to the seat
      trough([[780, 1030], [700, 960], [620, 900]], 14); trough([[806, 990], [730, 900], [660, 850]], 12);
      // between the legs: the cloth slung in deep catenary folds from the trailing knee to the forward shin
      trough([[490, 990], [560, 1070], [650, 1120], [724, 1110]], 20); trough([[490, 1050], [560, 1130], [650, 1180], [720, 1190]], 18); trough([[540, 940], [600, 1030], [680, 1070]], 14);
      // back panel: folds falling from the seat over the trailing calf
      trough([[530, 800], [470, 940], [404, 1070]], 20, { open: true }); trough([[580, 820], [520, 960], [450, 1086]], 16, { open: true });
      // chest: folds from the neck opening and the far shoulder, stretched over the chest and gathered at the roll
      trough([[770, 350], [808, 392], [842, 470]], 12); trough([[846, 520], [842, 600], [824, 680]], 14); trough([[680, 580], [716, 630], [760, 690]], 12); trough([[800, 590], [790, 650], [770, 700]], 10);
      trough([[700, 400], [672, 450], [656, 520]], 10); trough([[660, 380], [634, 440], [628, 500]], 9);
      // the neckline: a carved hem round the base of the neck, under the beard
      f.line([[640, 330], [690, 372], [748, 384], [800, 364]], 4, INK, { op: 0.6 }); f.line([[640, 336], [690, 380], [748, 392], [800, 372]], 2.4, '#f2f8fb', { op: 0.55 });
      // the knee pushing through: a lit plane with the cloth stretched over it
      f.flat([[812, 1000], [866, 1020], [876, 1070], [840, 1090], [806, 1060]], '#f2f8fb', { op: 0.3 }); f.line([[800, 1000], [850, 990], [878, 1040]], 2, '#f2f8fb', { op: 0.6 });
      // the hem: an incised border of chevrons, the dirt and frost of the floor frozen into it
      for (const hm of [hemF, hemB]) { const up = hm.map(q => add(q, [0, -30])); f.line(up, 2, INK, { op: 0.55 }); f.line(hm.map(q => add(q, [0, -12])), 1.6, INK, { op: 0.45 }); for (let i = 0; i < hm.length - 1; i++) for (let k = 0; k < 3; k++) { const a = lerp(up[i], up[i + 1], k / 3), b = lerp(up[i], up[i + 1], (k + 0.5) / 3), c2 = lerp(up[i], up[i + 1], (k + 1) / 3); f.line([add(a, [0, 4]), add(b, [0, 14]), add(c2, [0, 4])], 1.4, '#3a4a62', { op: 0.55, straight: true }); } }
      f.flat([[330, 1180], [920, 1180], [920, 1300], [330, 1300]], '#3a4656', { op: 0.18 });
      W.streaks(f, [700, 1000], 160, 12, 140); W.streaks(f, [520, 900], 60, 6, 120);
      W.frostCracks(f, [700, 980], 160, 200, 9, 1.6);
      W.lichtenberg(f, [620, 1150], -0.5, 120, 2.2, { depth: 2, col: '#1e3a3c', fork: 0.6 });
      W.hoar(f, [860, 900], 50, 240, 0.75); W.hoar(f, [820, 1200], 60, 70, 0.6);
      for (const [p, r, a] of [[[848, 760], 10, 1.4], [[860, 1150], 12, 1.6], [[620, 1212], 10, -0.4], [[508, 640], 9, -1.5], [[900, 1250], 9, 0.8]]) W.chip(f, p, r, a);
    });
  }, [['skirt', side(S.at(0, 0.7), dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('skirt');
  W.rimeCrust(f, [[858, 570], [868, 500], [860, 440], [836, 398]], 12, [1, -0.3]); W.rimeCrust(f, [[836, 920], [852, 990], [866, 1050], [874, 1110], [892, 1180], [904, 1256]], 13, [1, -0.2]);
  W.icicles(f, hemB, 10, 16, 46); W.icicles(f, hemF, 4, 12, 30);
  W.icicles(f, [[526, 1140], [584, 1196], [640, 1226]], 4, 14, 36);

  // ---- the chest: clearer ice showing the clockwork inside; its rim fractured
  f.bone('torso');
  const wc = [756, 492];
  const win = [[698, 430, 1], [742, 400, 1], [800, 410, 1], [836, 462, 1], [830, 520, 1], [804, 584, 1], [748, 566, 1], [712, 590, 1], [684, 520, 1], [690, 474, 1]];
  f.part(win, { fill: '#5a7690', shadow: '#24334a', shade: 0.3, inkW: 1.4, cast: false, hatch: false });
  W.clipDraw(f, win, () => {
    const dim = o => W.BR(f, Object.assign({ fill: mix(P.brass, '#5a7690', 0.35), inkW: 1, cast: false }, o));
    W.gear(f, [740, 478], 54, 22, { a: 0.3, look: dim() });
    W.gear(f, [806, 534], 36, 16, { a: 0.1, look: dim({ fill: mix(P.brassD, '#5a7690', 0.3) }) });
    W.gear(f, [710, 548], 28, 14, { a: 0.5, look: dim({ fill: mix(P.brassL, '#5a7690', 0.3) }) });
    f.part(limb([790, 420], [776, 590], 12, 12, { steps: 4 }), W.IR(f, { cast: false, inkW: 1 })); // an arbor
    f.raw(`<path d="${E.smooth(win)}" fill="${P.clear}" opacity="0.38"/>`);
    f.flat([[698, 430, 1], [742, 400, 1], [800, 410, 1], [792, 432, 1], [740, 424, 1], [708, 448, 1]], '#eaf2f6', { op: 0.3 }); f.line([[742, 400], [756, 470], [804, 584]], 1.6, '#eaf2f6', { op: 0.45, straight: true }); f.line([[756, 470], [684, 520]], 1.4, '#eaf2f6', { op: 0.4, straight: true }); // the facets of the cut // the depth of the ice above
    W.frostCracks(f, wc, 70, 70, 5, 1.4);
    W.lichtenberg(f, [694, 470], 0.3, 70, 1.8, { depth: 2, col: '#1e3a3c', fork: 0.5 });
    f.line([[704, 440], [742, 424]], 6, '#ffffff', { op: 0.4 }); f.line([[800, 444], [818, 470]], 4, '#ffffff', { op: 0.3 });
  });
  f.line(win.concat([win[0]]), 3, '#e8f2f6', { op: 0.6, straight: true }); // the chiselled lip of the clearer ice
  f.line(win.map(q => add(q, [-3, 4])).concat([add(win[0], [-3, 4])]), 2, INK, { op: 0.5, straight: true });
  for (const [p, r, a] of [[[700, 424], 10, -0.6], [[834, 506], 11, 1.4], [[760, 578], 9, 2.6]]) W.chip(f, p, r, a);

  // ---- the mantle: over the near shoulder, round the back, its rolled edge across the body to the far hip, where
  // its end drops in a carved zigzag cascade over the stepping thigh
  const roll = [[606, 336], [612, 430], [626, 510], [654, 584], [696, 644], [746, 694], [800, 736]];
  const mantle = [[606, 324], [570, 332], [530, 352], [496, 392], [476, 450], [472, 540], [480, 630], [472, 720], [456, 820], [444, 920], [436, 1010, 1], [474, 1000], [512, 1022, 1], [552, 986], [600, 998, 1], [640, 960], [690, 968, 1], [726, 930], [770, 946, 1], [806, 980, 1], [818, 940], [792, 914, 1], [822, 872], [796, 846, 1], [826, 806], [800, 782, 1], [820, 750], ...roll.slice().reverse().slice(1, -1)];
  f.part(mantle, IC({ fill: '#a6bac8', maxShade: 70 }));
  W.clipDraw(f, mantle, () => {
    // folds hang from the roll and fall diagonally back round the body
    trough([[632, 520], [580, 660], [530, 820], [492, 990]], 24, { open: true });
    trough([[664, 598], [610, 720], [570, 860], [550, 990]], 22, { open: true });
    trough([[712, 662], [670, 760], [640, 860], [626, 966]], 20, { open: true });
    trough([[750, 700], [720, 800], [706, 930]], 14, { open: true });
    trough([[612, 420], [560, 540], [510, 720], [470, 960]], 16);
    trough([[540, 380], [508, 500], [490, 700], [470, 900]], 14);
    // the cascade: zigzag pleats stacked down the far hip
    for (const [a, b] of [[[796, 760], [818, 776]], [[790, 806], [816, 832]], [[784, 852], [812, 880]], [[780, 900], [806, 930]], [[774, 940], [800, 970]]]) { f.line([a, b], 3, INK, { op: 0.7 }); f.line([add(a, [-2, -6]), add(b, [-2, -6])], 2, '#f2f8fb', { op: 0.6 }); }
    trough([[760, 740], [770, 840], [776, 960]], 14, { open: true });
    W.streaks(f, [560, 600], 80, 10, 160); W.frostCracks(f, [580, 700], 90, 160, 6, 1.6);
    W.lichtenberg(f, [520, 470], 1.2, 160, 3, { depth: 3, col: '#1e3a3c' }); // from the key collar into the ice
    for (const [p, r, a] of [[[452, 960], 10, 2.2], [[690, 962], 9, 1.6], [[478, 560], 9, 3.0]]) W.chip(f, p, r, a);
  });
  // the rolled edge: a thick twisted band
  const rollR = W.ribbon(W.spline(roll, 5), t => 62 - t * 16);
  f.stroke(W.spline(roll, 5).map(q => add(q, [-6, 26])), 40, '#141c2a', { op: 0.3 }); // its shadow on the body
  f.part(rollR, IC({ fill: '#c2d2dc', cast: false, k: 0.8, maxShade: 16, hatch: false }));
  W.clipDraw(f, rollR, () => { const RC = W.spline(roll, 5), RS = W.arcLen(RC); for (let u = 20; u < RS[RS.length - 1]; u += 40 + (u % 3) * 8) { const a = W.at(RC, RS, u); const tw = [add(a.p, add(mul(a.n, 30), mul(a.d, -14))), add(a.p, add(mul(a.n, 8), mul(a.d, -2))), add(a.p, add(mul(a.n, -12), mul(a.d, 10))), add(a.p, add(mul(a.n, -30), mul(a.d, 12)))]; f.flat(W.ribbon(W.spline(tw, 3), 7), '#3a4a62', { op: 0.35 }); f.stroke(tw, 4, INK, { op: 0.5 }); f.stroke(tw.map(q => add(q, mul(a.d, 7))), 3, '#f2f8fb', { op: 0.55 }); } f.line(RC.map(q => add(q, mul(f.L, 14))), 3, '#f2f8fb', { op: 0.6 }); f.stroke(RC.map(q => add(q, mul(f.L, -26))), 10, '#141c2a', { op: 0.35 }); });
  W.rimeCrust(f, [[606, 336], [612, 430], [626, 510]], 9, [1, -0.3]);
  W.rimeCrust(f, [[740, 690], [800, 736], [820, 750]], 8, [1, -0.3]);
  W.icicles(f, [[436, 1010], [512, 1022], [600, 998], [690, 968], [770, 946], [806, 980]], 10, 16, 48);
  W.icicles(f, [[818, 940], [822, 872], [826, 806]], 3, 12, 30);

  // ---- head: a carved, dignified face; heavy stone eyes without pupils; a beard of drilled spiral locks
  f.bone('head');
  f.part(K.chain([S.at(0.16, -0.04), add(HC, [-20, 70])], [150, 130]), IC()); // the neck
  const hF = frame(HC, hA, H);
  const hairLook = IC({ fill: '#a8bccb', shadow: '#3a4a62', tex: 'chisel' + seed, texOp: 0.5, maxShade: 30 });
  // hair: one carved mass over the skull to the nape (drawn first; the face sits over its front edge)
  const hair = hF([[0.24, -0.4], [0.16, -0.54], [-0.04, -0.64], [-0.3, -0.6], [-0.48, -0.42], [-0.54, -0.14], [-0.5, 0.2], [-0.42, 0.5], [-0.24, 0.46], [-0.2, 0.06], [-0.1, -0.2], [0.04, -0.36]]);
  f.part(hair, hairLook);
  B.head(f, HC, H, hA, {
    skin: '#b6c6d2', jaw: 1.16, chin: 0.03, nose: 1.06, hook: 0.08, mouth: 'set', browDown: 0.08, browW: 0.03, browCol: '#4a5c74', faceShade: 0.78, jawShade: 0.4,
    blind: true, age: true, noEar: true,
  });
  const FO = hF([[-0.3, -0.4], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.34, 0.37], [0.32, 0.47], [0.14, 0.54], [-0.07, 0.48], [-0.23, 0.27], [-0.3, 0.08], [-0.37, -0.13]]);
  // carved planes: the brow ridge as a lit shelf over a cut shadow, the cheek plane, the nasolabial cut
  f.line(hF([[0.02, -0.12], [0.18, -0.115], [0.33, -0.1]]), 2.6, INK, { op: 0.6 });
  W.clipDraw(f, FO, () => {
    // the eyes: heavy lids over smooth stone eyeballs, no pupils; lit tops, a carved crease above
    for (const [x, rx, ry] of [[0.115, 0.064, 0.03], [0.298, 0.03, 0.026]]) {
      const ec = hF([[x, -0.058]])[0];
      f.part(ell(ec, rx * H, ry * H, hA, 14), { fill: '#c4d2dc', shadow: '#4a5c74', light: '#f6fafc', shade: 0.45, inkW: 1.3, inkHeavy: 1.8, cast: false, hatch: false });
      f.flat(ell(add(ec, [rx * H * 0.15, -ry * H * 0.35]), rx * H * 0.5, ry * H * 0.3, hA, 10), '#ffffff', { op: 0.45 });
      f.stroke([add(ec, [-rx * H * 1.1, -ry * H * 0.2]), add(ec, [0, -ry * H * 1.15]), add(ec, [rx * H * 1.1, -ry * H * 0.3])], ry * H * 0.5, '#8ea4b6', { op: 0.95 }); // the upper lid, heavy
      f.line([add(ec, [-rx * H * 1.0, -ry * H * 0.4]), add(ec, [0, -ry * H * 1.5]), add(ec, [rx * H, -ry * H * 0.6])], 1.6, INK, { op: 0.75 });
      f.line([add(ec, [-rx * H * 0.8, ry * H * 0.9]), add(ec, [rx * H * 0.8, ry * H * 0.7])], 1.2, '#3a4a62', { op: 0.6 });
    }
    trough(hF([[0.27, 0.12], [0.23, 0.2], [0.2, 0.26]]), 8);
    f.flat(hF([[0.04, 0.02], [0.2, 0.05], [0.24, 0.18], [0.1, 0.22], [0.0, 0.12]]), '#eef4f8', { op: 0.25 }); // the cheek plane
    W.frostCracks(f, hF([[0.05, 0.1]])[0], 40, 40, 3, 1.3);
    W.lichtenberg(f, hF([[-0.1, -0.3]])[0], 1.0, 60, 1.8, { depth: 2, col: '#1e3a3c' });
    W.hoar(f, hF([[0.3, 0.0]])[0], 30, 50, 0.55);
  });
  W.chip(f, hF([[0.39, 0.12]])[0], 10, 0.3); // the nose broken at the tip
  // the beard: a long carved mass from the cheeks to the chest, cut into rows of locks that end in drilled spirals
  const bLook = IC({ fill: '#aec0ce', shadow: '#3a4a62', tex: 'chisel' + seed, texOp: 0.5, maxShade: 34 });
  const beard = hF([[-0.2, 0.0], [-0.06, 0.14], [0.12, 0.2], [0.2, 0.3], [0.34, 0.3], [0.4, 0.46], [0.36, 0.66], [0.3, 0.84], [0.18, 0.98], [0.04, 0.94], [-0.08, 0.82], [-0.18, 0.6], [-0.24, 0.34]]);
  f.part(beard, bLook);
  W.clipDraw(f, beard, () => {
    for (let i = 0; i < 7; i++) { const x = -0.16 + i * 0.08; lock(hF([[x, 0.2 + Math.abs(i - 3) * 0.02]])[0], hF([[x + 0.06, 0.62 + (i % 2) * 0.06]])[0], 22, bLook, { bend: [8, 0], curl: i % 2 ? 1 : -1 }); }
    for (let i = 0; i < 5; i++) { const x = -0.08 + i * 0.08; lock(hF([[x, 0.6]])[0], hF([[x + 0.05, 0.92 - Math.abs(i - 2) * 0.06]])[0], 20, bLook, { bend: [-6, 0], curl: i % 2 ? -1 : 1 }); }
    W.frostCracks(f, hF([[0.1, 0.6]])[0], 30, 50, 2, 1.2);
  });
  // the moustache: two carved locks swept from under the nose into the beard
  const ms = hF([[0.24, 0.205], [0.33, 0.2], [0.38, 0.26], [0.32, 0.29], [0.24, 0.27], [0.14, 0.32], [0.08, 0.28], [0.16, 0.23]]);
  f.part(ms, bLook);
  f.line(hF([[0.32, 0.22], [0.22, 0.25], [0.12, 0.3]]), 1.8, INK, { op: 0.7 });
  f.line(hF([[0.17, 0.295], [0.24, 0.31], [0.3, 0.3]]), 2.4, INK, { op: 0.7 }); // the set mouth under it
  W.rimeCrust(f, hF([[0.36, 0.34], [0.4, 0.46], [0.36, 0.64]]), 7, [1, -0.3]);
  W.icicles(f, hF([[0.36, 0.66], [0.3, 0.84], [0.18, 0.98], [0.04, 0.94]]), 7, 16, 46);
  W.icicle(f, hF([[0.36, 0.28]])[0], 16, 5);
  W.chip(f, hF([[0.3, 0.86]])[0], 11, 2.2);
  // the hair's carved waves swept back from the brow, and a plain fillet across it
  W.clipDraw(f, hair, () => {
    for (let i = 0; i < 6; i++) { const t = i / 5; lock(hF([[0.18 - t * 0.12, -0.48 + t * 0.06]])[0], hF([[-0.3 - t * 0.12, -0.5 + t * 0.62]])[0], 26, hairLook, { bend: [-8, -16], curl: 0 }); }
    W.lichtenberg(f, hF([[-0.2, -0.5]])[0], 2.4, 70, 2, { depth: 2, col: '#1e3a3c' });
  });
  W.rimeCrust(f, hF([[-0.4, -0.5], [-0.1, -0.64], [0.14, -0.56], [0.26, -0.4], [0.34, -0.26]]), 13, [1, -0.3]);
  W.icicles(f, hF([[-0.42, 0.5], [-0.24, 0.46]]), 3, 12, 30);

  // ---- near arm hanging heavy, the great carved fist closed; the tunic's short sleeve; bare forearm
  f.bone('upperarm_n');
  W.armRig(f, SN, EN, WN, [134, 118, 100], IC(), '_n', { bp: [[0, 0.5, 0.1, 0.2]], bq: [[0, 0.35, 0.14, 0.2], [1, 0.3, 0.12, 0.2]] });
  f.bone('forearm_n');
  W.clipDraw(f, K.chain([EN, WN], [118, 100]), () => {
    trough([lp(EN, WN, 0.05, 30), lp(EN, WN, 0.4, 36), lp(EN, WN, 0.8, 20)], 8); // the carved split of the forearm muscles
    f.flat([lp(EN, WN, 0.1, -10), lp(EN, WN, 0.15, -44), lp(EN, WN, 0.7, -36), lp(EN, WN, 0.7, -6)], '#eef4f8', { op: 0.22 });
    W.lichtenberg(f, lp(EN, WN, 0.3, 0), ang(EN, WN), 90, 2.2, { depth: 2, col: '#1e3a3c' });
    W.streaks(f, lp(EN, WN, 0.3, 0), 30, 4, 80);
  });
  W.rimeCrust(f, [lp(EN, WN, 0.1, -50), lp(EN, WN, 0.8, -42)], 8, [1, -0.2]);
  f.bone('upperarm_n');
  const sl = [lp(SN, EN, -0.1, -76), lp(SN, EN, -0.15, 70), lp(SN, EN, 0.4, 76), lp(SN, EN, 0.62, 88), [EN[0] + 44, EN[1] - 62, 1], [EN[0] + 16, EN[1] - 74], [EN[0] - 6, EN[1] - 44, 1], [EN[0] - 28, EN[1] - 72], [EN[0] - 54, EN[1] - 60, 1], lp(SN, EN, 0.55, -76)];
  f.part(sl, IC({ fill: '#b0c2cf', maxShade: 40 }));
  W.clipDraw(f, sl, () => { trough([lp(SN, EN, 0.3, 30), lp(SN, EN, 0.55, 40), [EN[0] + 16, EN[1] - 80]], 8, { op: 0.3 }); trough([lp(SN, EN, 0.35, -26), lp(SN, EN, 0.6, -34), [EN[0] - 30, EN[1] - 78]], 8, { op: 0.3 }); });
  W.icicles(f, [[EN[0] + 44, EN[1] - 62], [EN[0] - 6, EN[1] - 44], [EN[0] - 54, EN[1] - 60]], 4, 12, 30);
  f.bone('torso');
  // the mantle's fold over the shoulder (torso bone: it must not fly off when the arm lifts)
  const cap = [[612, 322], [570, 330], [524, 350], [494, 388], [478, 470], [474, 560], [496, 574, 1], [506, 530], [530, 540, 1], [540, 496], [566, 500, 1], [574, 462], [598, 470, 1], [614, 436]];
  f.part(cap, IC({ fill: '#a6bac8', maxShade: 40 }));
  W.clipDraw(f, cap, () => { trough([[588, 336], [536, 410], [516, 520]], 12); trough([[606, 364], [570, 430], [552, 490]], 9, { op: 0.32 }); trough([[548, 350], [500, 420], [490, 540]], 9, { op: 0.32 }); });
  W.rimeCrust(f, [[500, 392], [530, 350], [570, 330], [606, 324]], 11, [1, -0.3]);
  W.icicles(f, [[496, 574], [530, 540], [566, 500], [598, 470]], 4, 12, 32);
  f.bone('hand_n');
  carvedFist(f, add(WN, mul(E.norm(sub(WN, EN)), -18)), ang(EN, WN), 86, IC({ fill: '#b6c6d2', tex: 'chisel' + seed, texOp: 0.5 }));
  W.chip(f, add(WN, [30, 40]), 9, 1.2);
  W.rimeCrust(f, [add(WN, [36, -30]), add(WN, [50, 10]), add(WN, [44, 50])], 8, [1, -0.2]);
  W.icicles(f, [add(WN, [-30, 56]), add(WN, [34, 60])], 3, 12, 32);
  return f;
}

// zodiac sign glyphs as ink strokes in a unit box (-1..1), drawn at c with size s, 'up' toward the dial rim
const ZOD = [
  [[[-0.7, -0.1], [-0.5, -0.7], [-0.05, -0.4], [0, 0.8]], [[0.7, -0.1], [0.5, -0.7], [0.05, -0.4]]],
  [[[-0.75, -0.75], [-0.3, -0.2], [0.3, -0.2], [0.75, -0.75]], [[-0.4, 0.3], [0, -0.2], [0.4, 0.3], [0, 0.8], [-0.4, 0.3]]],
  [[[-0.6, -0.7], [0.6, -0.7]], [[-0.6, 0.7], [0.6, 0.7]], [[-0.25, -0.7], [-0.25, 0.7]], [[0.25, -0.7], [0.25, 0.7]]],
  [[[-0.7, -0.2], [-0.2, -0.6], [0.6, -0.4]], [[0.7, 0.2], [0.2, 0.6], [-0.6, 0.4]], [[-0.6, -0.1], [-0.4, -0.3], [-0.6, -0.4]]],
  [[[-0.5, 0.4], [-0.6, -0.2], [-0.2, -0.7], [0.2, -0.3], [0.1, 0.3], [0.4, 0.7], [0.7, 0.4]]],
  [[[-0.7, 0.7], [-0.7, -0.6], [-0.35, -0.6], [-0.35, 0.7]], [[-0.35, -0.6], [0, -0.6], [0, 0.6], [0.4, 0.8]], [[0, 0.1], [0.5, -0.2], [0.6, 0.3], [0.2, 0.5]]],
  [[[-0.7, 0.6], [0.7, 0.6]], [[-0.7, 0.2], [-0.3, 0.2], [-0.4, -0.3], [0, -0.6], [0.4, -0.3], [0.3, 0.2], [0.7, 0.2]]],
  [[[-0.7, 0.7], [-0.7, -0.6], [-0.35, -0.6], [-0.35, 0.7]], [[-0.35, -0.6], [0, -0.6], [0, 0.7], [0.5, 0.7], [0.7, 0.4]], [[0.5, 0.9], [0.7, 0.4], [0.3, 0.4]]],
  [[[-0.7, 0.7], [0.7, -0.7]], [[0.2, -0.7], [0.7, -0.7], [0.7, -0.2]], [[-0.4, -0.1], [0.1, 0.4]]],
  [[[-0.7, -0.5], [-0.4, 0.6], [0, -0.5], [0.2, 0.5], [0.6, 0.3], [0.5, 0.8], [0.1, 0.6]]],
  [[[-0.8, -0.2], [-0.4, -0.5], [0, -0.2], [0.4, -0.5], [0.8, -0.2]], [[-0.8, 0.3], [-0.4, 0.0], [0, 0.3], [0.4, 0.0], [0.8, 0.3]]],
  [[[-0.6, -0.8], [-0.25, 0], [-0.6, 0.8]], [[0.6, -0.8], [0.25, 0], [0.6, 0.8]], [[-0.4, 0], [0.4, 0]]],
];
function zodiac(f, c, i, s, up, col) { const ux = [-up[1], up[0]], Q = q => add(c, add(mul(ux, q[0] * s), mul(up, -q[1] * s))); for (const st of ZOD[i]) f.line(st.map(Q), 2, col); }

// ------------------------------------------------------------------ THE LAST HOUR (ruler 4)
// The great astronomical clock at the top of the spire, seen from inside the tower and cropped by the frame: a vast
// brass face with zodiac, hour and star rings, frosted over, its minute hand stopped one minute before twelve. At its
// centre a sun-and-moon volvelle makes a face, eyes shut; the Tooth, the clock's pointed central arbor, stands out
// from it and carries the hands. The lower dial is broken open on the mechanism: great wheels, the escape wheel, chains
// and weights, the pendulum, and caught in the train a frozen astronomer, torn half into the gears, one hand still
// reaching out with his astrolabe slipping on its cord. The chime bell and its hammer hang at the top of the case.
// Frost: rime on the upper and windward (left) rims, a frost veil over the lower dial, icicles plumb from every lower
// edge. Lightning (per the director, no arcs): branching aurora-green burns across the brass and the astronomer, fused
// teeth and chain links, re-set beads where the metal ran.
// Drawn already facing left, not mirrored, so the numerals read and the hands show one minute to twelve: kit.base
// (light upper left) and flip: false. Rig: case (root), dial, sunmoon, hand_hour, hand_min, hand_sec (dial),
// gear_1..3 (case), pendulum (case), hammer and bell (case), chain_l, chain_r (case), astronomer (gear_1), astro_arm_n,
// astro_hand_n (astronomer), astrolabe (astro_hand_n). Motion: idle the second hand ticks and stops; attack the hammer
// strikes the bell (the chime).
function lastHour() {
  const seed = 1100, [CW, CH] = T.ruler, gyy = CH - 30;
  const f = new Fig(K.base(seed, { groundY: gyy, grimeY: gyy - 300, shadowTint: '#232838', mud: P.mud }));
  W.textures(f);
  const gy = gyy, L = [-1, -0.3]; // windward: the heroes are on the left
  const DC = [800, 600], R = 660, KX = 0.88, TA = -0.03;
  const TD = W.dialFrame(DC, R, KX, TA), Tr = (r, t) => TD(Math.cos(t) * r, Math.sin(t) * r); // t from +x, clockwise on screen
  // independent review: the face is set back inside a thick bezel. The bezel's front plane sits left of the dial (the
  // case is turned toward the heroes), so the bezel's inner wall shows as a crescent on the left and the drum's side on
  // the right. BC: the bezel's centre; DV: the depth of the case, front to back.
  const BC = add(DC, [-40, -4]), TB = W.dialFrame(BC, R, KX, TA), TrB = (r, t) => TB(Math.cos(t) * r, Math.sin(t) * r), DV = [150, -8];
  const clk = h => h / 12 * Math.PI * 2 - Math.PI / 2; // clock position (hours) to t
  const BRZ = (o = {}) => W.BR(f, o), BRD = (o = {}) => W.BRD(f, o);
  const STONE = (o = {}) => Object.assign({ fill: '#6e7278', shadow: '#2a2e36', light: '#a8aeb6', shade: 0.4, tex: 'pit' + seed, texOp: 0.7 }, o);
  const hole = [Tr(0.46, clk(4.2)), Tr(0.62, clk(4.6)), Tr(0.9, clk(4.9)), Tr(0.98, clk(5.4)), Tr(0.92, clk(6.0)), Tr(0.98, clk(6.6)), Tr(0.86, clk(7.3)), Tr(0.94, clk(7.9)), Tr(0.7, clk(8.4)), Tr(0.5, clk(8.0)), Tr(0.4, clk(7.0)), Tr(0.36, clk(5.8)), Tr(0.4, clk(5.0))];
  const G1 = [770, 1200], G2 = Tr(0.7, clk(4.9)), G3 = Tr(0.66, clk(7.7)), PV = [DC[0] + 20, DC[1] + R * 0.9];
  f.joint('case', [DC[0], gy], null).joint('dial', DC, 'case').joint('sunmoon', DC, 'dial').joint('hand_hour', DC, 'dial').joint('hand_min', DC, 'dial').joint('hand_sec', DC, 'dial');
  f.joint('gear_1', G1, 'case').joint('gear_2', G2, 'case').joint('gear_3', G3, 'case').joint('pendulum', PV, 'case').joint('hammer', [1330, 330], 'case').joint('bell', [1470, 120], 'case');
  f.joint('chain_l', Tr(1.0, clk(8.6)), 'case').joint('chain_r', [1470, 640], 'case');
  f.joint('astronomer', [640, 1150], 'gear_1').joint('astrolabe', [370, 1060], 'hand_na');

  // ---- the case: a square brass frame with stone spandrels behind the round face, a stone pedestal below
  f.bone('case');
  const fb = hard([[DC[0] - R * 1.12, DC[1] + R * 1.04], [DC[0] + R * 1.18, DC[1] + R * 1.04], [DC[0] + R * 1.18, DC[1] + R * 1.12], [DC[0] - R * 1.12, DC[1] + R * 1.12]]);
  W.bplate(f, fb, BRD(), { bev: 5, rivets: [[fb[0], fb[1], 18]] });
  W.icicles(f, [fb[3], fb[2]], 28, 16, 60);
  // the stone pedestal the clock stands on, and the floor
  const pd2 = hard([[DC[0] - R * 0.9, DC[1] + R * 1.12], [DC[0] + R * 0.96, DC[1] + R * 1.12], [DC[0] + R * 1.04, gy], [DC[0] - R * 0.98, gy]]);
  f.part(pd2, STONE({ fill: '#5e6268' }));
  W.clipDraw(f, pd2, () => { for (let y = DC[1] + R * 1.12; y < gy; y += 60) f.line([[0, y], [1600, y]], 2, INK, { op: 0.45, straight: true }); f.flat([[0, gy - 120], [1600, gy - 120], [1600, gy], [0, gy]], P.mud, { op: 0.4 }); });
  // the drum of the case: its thickness shows on the right, the face turned toward the heroes on the left
  const drum = []; for (let j = 0; j <= 40; j++) drum.push(TrB(1.16, -Math.PI / 2 + j / 40 * Math.PI)); for (let j = 40; j >= 0; j--) drum.push(add(TrB(1.12, -Math.PI / 2 + j / 40 * Math.PI), DV));
  f.part(drum, BRD({ fill: mix(P.brass, '#14141a', 0.45), shade: 0.5, maxShade: 90 }));
  W.clipDraw(f, drum, () => {
    for (let i = 1; i < 12; i++) { const t = -Math.PI / 2 + i / 12 * Math.PI; f.line([TrB(1.16, t), add(TrB(1.12, t), DV)], 2.4, INK, { op: 0.55, straight: true }); f.line([add(TrB(1.16, t), [4, 0]), add(TrB(1.12, t), add(DV, [4, 0]))], 1.4, P.brassL, { op: 0.35, straight: true }); } // panel seams
    for (let i = 0; i < 11; i++) { const t = -Math.PI / 2 + (i + 0.5) / 12 * Math.PI; for (const k of [0.25, 0.75]) f.rivet(lerp(TrB(1.16, t), add(TrB(1.12, t), DV), k), 4, P.brassL); }
    f.line(drum.slice(0, 41).map(q => add(q, [12, 0])), 6, P.brassP, { op: 0.35 }); // the lit rolled edge of the front rim
    W.lichtenberg(f, add(TrB(1.14, 0.2), [60, 0]), 1.7, 220, 3.4, { metal: true, depth: 3 });
    W.lichtenberg(f, add(TrB(1.14, -1.0), [70, 0]), 2.0, 160, 3, { metal: true, depth: 2 });
    W.hoar(f, add(TrB(1.14, -1.3), [60, 0]), 70, 120, 0.7);
    W.soot(f, add(TrB(1.14, 0.5), [70, 0]), 50, 120, 0.35);
  });
  W.fusedBead(f, add(TrB(1.14, 0.9), [80, 0]), 10); W.fusedBead(f, add(TrB(1.14, -0.4), [90, 0]), 8);
  W.icicles(f, [add(TrB(1.14, 1.2), [40, 0]), add(TrB(1.12, 1.45), DV)], 4, 16, 50);
  // the bezel's inner wall, seen on the left between the front rim and the set-back dial
  const wall = []; for (let j = 0; j < 80; j++) wall.push(TrB(1.0, j / 80 * Math.PI * 2));
  f.part(wall, BRD({ fill: mix(P.brass, '#14141a', 0.55), shade: 0.4, cast: false }));
  W.clipDraw(f, wall, () => { for (let i = 0; i < 24; i++) { const t = Math.PI * 0.5 + i / 24 * Math.PI; f.line([TrB(0.99, t), add(TrB(0.99, t), [44, 0])], 1.6, INK, { op: 0.45, straight: true }); } W.hoar(f, TrB(0.96, Math.PI * 1.15), 40, 200, 0.7); });

  // ---- the hanging chains and weights (behind the dial edge)
  f.bone('chain_r');
  W.chainLinks(f, [[1470, 640], [1476, 1000], [1470, 1240]], 26, P.brassL);
  const wt = [1472, 1330];
  W.bplate(f, hard([add(wt, [-44, -90]), add(wt, [44, -90]), add(wt, [52, 90]), add(wt, [-52, 90])]), BRD(), { bev: 5, lich: [[add(wt, [0, -60]), 1.4, 120, 3]], frost: [[add(wt, [-30, -40]), 40, 60, 0.7]] });
  for (let i = 0; i < 4; i++) f.line([add(wt, [-48, -60 + i * 44]), add(wt, [48, -60 + i * 44])], 3, P.brassD, { op: 0.8, straight: true });
  W.icicles(f, [add(wt, [-52, 90]), add(wt, [52, 90])], 5, 14, 44);
  W.fusedBead(f, [1474, 1100], 8);

  // ---- the pendulum: a long rod and a lenticular brass bob, hanging below the open dial
  f.bone('pendulum');
  const pb = [PV[0] - 6, 1440];
  f.part(limb(PV, pb, 24, 24, { steps: 6, capK: 0.3 }), W.IR(f, { inkW: 1.6 }));
  f.line([lp(PV, pb, 0.02, -6), lp(PV, pb, 0.98, -6)], 2, P.ironL, { op: 0.6, straight: true });
  const bob = ell(pb, 104, 86, 0, 30);
  W.bplate(f, bob, BRZ(), { hard: false, bev: 8, frost: [[add(pb, [-40, -30]), 60, 40, 0.8]], lich: [[add(pb, [30, 10]), 0.4, 80, 2.6]], dents: [[add(pb, [20, 30]), 12]] });
  for (let r = 30; r < 90; r += 16) f.line(ell(pb, r, r * 0.83, 0, 24).concat([ell(pb, r, r * 0.83, 0, 24)[0]]), 1.2, INK, { op: 0.35 });
  W.icicles(f, ell(pb, 104, 86, 0, 30).slice(3, 13), 10, 14, 48);

  // ---- the dial
  f.bone('dial');
  const disc = []; for (let j = 0; j < 80; j++) { const t = j / 80 * Math.PI * 2; disc.push(Tr(1.0, t)); }
  f.part(disc, BRZ({ fill: mix(P.brass, '#2a2a30', 0.25) }));
  // zodiac ring: twelve cartouches with the signs, bone on brass
  const zr = W.ringPath(TD, 0.84, 0.98, 80);
  f.part(zr.d, BRZ({ bbPts: zr.outer, shade: 0.42 }));
  for (let i = 0; i < 12; i++) { const t0 = clk(i), t1 = clk(i + 1); f.line([Tr(0.84, t0), Tr(0.98, t0)], 2.6, INK, { straight: true, op: 0.8 }); const tm = (t0 + t1) / 2, c = Tr(0.91, tm), up = E.norm(sub(Tr(1, tm), Tr(0.8, tm))); zodiac(f, c, i, 18, up, P.brassD); }
  for (let j = 0; j < 72; j++) { const t = j / 72 * Math.PI * 2; f.flat(ell(Tr(1.03, t), 3, 3, 0, 6), P.bone, { op: 0.8 }); } // star dots on the bezel
  // hour ring: pale enamel with roman numerals
  const hr = W.ringPath(TD, 0.64, 0.84, 80);
  f.part(hr.d, { fill: mix(P.bone, P.ice, 0.35), shadow: '#5a6274', light: '#ffffff', shade: 0.3, tex: 'crack' + seed, texOp: 0.5, bbPts: hr.outer });
  for (let k = 0; k < 60; k++) { const t = clk(k / 5), r1 = k % 5 ? 0.81 : 0.78; f.line([Tr(r1, t), Tr(0.84, t)], k % 5 ? 1.2 : 3, INK, { straight: true, op: 0.85 }); }
  for (let h = 1; h <= 12; h++) { const t = clk(h), up = E.norm(sub(Tr(1, t), Tr(0.6, t))); W.numeral(f, Tr(0.71, t), h, 56, up, '#1a1410', 4); }
  // the star ring: blue enamel with constellations
  const sr = W.ringPath(TD, 0.36, 0.64, 70);
  f.part(sr.d, { fill: '#5a7a9a', shadow: '#24344a', light: '#9ab6cc', shade: 0.3, tex: 'crack' + seed, texOp: 0.4, bbPts: sr.outer });
  W.clipDraw(f, sr.outer, () => {
    for (let i = 0; i < 70; i++) { const q = Tr(0.38 + f.r() * 0.25, f.r() * 6.28); f.flat(ell(q, 2 + f.r() * 2.5, 2 + f.r() * 2.5, 0, 6), P.bone, { op: 0.85 }); }
    for (let c = 0; c < 6; c++) { const t0 = c * 1.05, pts = [0, 1, 2, 3].map(k => Tr(0.42 + ((k * 7 + c) % 4) * 0.05, t0 + k * 0.12)); f.line(pts, 1.2, P.bone, { op: 0.6, dash: '4 3' }); pts.forEach(q => f.flat(ell(q, 4, 4, 0, 6), P.bone)); }
  });
  // ring borders, brass, with rivets
  for (const r of [0.36, 0.64, 0.84, 0.98]) W.band(f, W.ringArc(DC, R * KX * r, R * r, TA, 0, Math.PI * 2, 90), r > 0.9 ? 10 : 6, P.brassL);
  // independent review: the rings are stepped plates, each set lower than the one outside it. A raised ring's inner
  // wall shades the ring below along the upper left and catches the light along the lower right.
  for (const [r, dd] of [[0.84, 16], [0.64, 14], [0.36, 12]]) {
    const inner = W.ringArc(DC, R * KX * r, R * r, TA, 0, Math.PI * 2, 90), sh = inner.map(q => add(q, [dd * 0.8, dd]));
    W.clipDraw(f, inner, () => f.raw(`<path d="${E.smooth(inner)} ${E.smooth(sh.slice().reverse())}" fill="#0c0e14" opacity="0.5" fill-rule="evenodd"/>`));
    f.line(W.ringArc(DC, R * KX * r - 3, R * r - 3, TA, -0.3, Math.PI * 0.8, 40), 3, P.brassP, { op: 0.6 });
  }
  // the bezel: a heavy brass ring, riveted, its upper rim rimed
  const bz = W.ringPath(TB, 0.99, 1.16, 90);
  const bzd = f.part(bz.d, BRZ({ bbPts: bz.outer, shade: 0.45 }));
  W.bevel(f, bzd, E.bbox(bz.outer), 10);
  W.band(f, W.ringArc(BC, R * KX * 1.04, R * 1.04, TA, 0, Math.PI * 2, 90), 5, P.brassL); W.band(f, W.ringArc(BC, R * KX * 1.13, R * 1.13, TA, 0, Math.PI * 2, 90), 4, P.brassL); // the bezel's mouldings
  for (let k = 0; k < 36; k++) f.rivet(TrB(1.085, k / 36 * Math.PI * 2), 5, P.brassP);
  W.clipDraw(f, bz.outer, () => { W.lichtenberg(f, TrB(1.08, clk(9.5)), 2.2, 220, 3.6, { metal: true, depth: 3 }); W.lichtenberg(f, TrB(1.08, clk(1.5)), 1.2, 160, 3, { metal: true, depth: 2 }); W.soot(f, TrB(1.08, clk(9.2)), 60, 80, 0.3); W.dent(f, TrB(1.08, clk(7.2)), 16); W.dent(f, TrB(1.08, clk(2.6)), 12); });
  for (const t of [clk(9.9), clk(1.1), clk(4.4)]) W.fusedBead(f, TrB(1.08, t), 9); // rivets the strike melted and re-set

  // ---- the broken lower dial: plates cracked away onto the train
  f.part(hole, { fill: '#0c0e14', shade: 0.2, inkW: 3, cast: false, hatch: false });
  W.clipDraw(f, hole, () => {
    f.flat(hole, '#141820');
    f.part(hole.map(q => lerp(q, Tr(0.66, clk(6.2)), 0.12)), BRD({ fill: mix(P.brass, '#5a6474', 0.45), shade: 0.4, maxShade: 60, cast: false })); // the movement's back plate, frosted
    W.hoar(f, Tr(0.66, clk(7.2)), 220, 160, 0.85); W.hoar(f, Tr(0.7, clk(5.2)), 160, 120, 0.6);
    for (const t of [clk(4.8), clk(6.0), clk(7.5)]) { f.part(ell(Tr(0.82, t), 18, 18, 0, 10), BRD({ inkW: 1.4, cast: false })); f.flat(ell(Tr(0.82, t), 6, 6, 0, 6), '#0c0e14'); } // pillar bolts
    W.gear(f, Tr(0.5, clk(5.5)), 120, 40, { a: 0.1, look: BRD({ fill: mix(P.brass, '#14141a', 0.55) }) }); // deep in the train, dark
    W.gear(f, Tr(0.7, clk(6.9)), 90, 30, { a: 0.3, look: BRD({ fill: mix(P.brass, '#14141a', 0.5) }) });
  });
  // jagged broken edges of the enamel and brass plates around the hole, with shards
  for (let i = 0; i < hole.length; i++) { const a = hole[i], b2 = hole[(i + 1) % hole.length], m = add(lerp(a, b2, 0.5), [(f.r() - 0.5) * 20, (f.r() - 0.5) * 20]); f.line([a, m, b2], 4, '#e8e0cc', { op: 0.5, straight: true }); }
  W.icicles(f, hole.slice(10).concat(hole.slice(0, 2)), 8, 14, 44);

  // ---- the great wheels the astronomer is caught in
  f.bone('gear_2');
  W.gear(f, G2, 150, 44, { a: 0.2, look: BRZ() });
  W.clipDraw(f, ell(G2, 150, 150, 0, 30), () => { W.hoar(f, add(G2, [-60, -60]), 80, 60, 0.7); W.lichtenberg(f, add(G2, [40, 20]), 0.7, 120, 3, { metal: true, depth: 2 }); });
  f.bone('gear_3');
  W.gear(f, G3, 110, 34, { a: 0.5, look: BRD() });
  W.icicles(f, W.ringArc(G3, 110, 110, 0, 0.3, 2.8, 12), 8, 12, 40);

  // ---- the frozen astronomer, caught in the train: dragged in to the hips, torso bent back against the great wheel,
  // head tipped back toward the stopped hands, one arm thrown out toward us with the astrolabe slipping from it,
  // the other clawed over a tooth of the wheel above. Human scale (head 100 px): he shows how big the clock is.
  const AH = 100, Pa = [640, 1150], Na = [566, 918], Ca = [548, 1040];
  const Sa = B.spine(Na, Ca, Pa, AH);
  const SNa = Sa.at(-0.34, 0.12), SFa = Sa.at(0.34, 0.08);
  const ENa = [470, 1060], WNa = [372, 1046];
  const EFa = [668, 880], WFa = [700, 800];
  const HCa = [612, 838], hAa = -0.62;
  const SKA = (o = {}) => W.SKI(f, Object.assign({ shadow: '#565c72' }, o));
  const RBa = (o = {}) => W.ROBE(f, Object.assign({ fill: '#4a5468', shadow: '#1e2230', light: '#74809a' }, o));
  f.joint('astro_head', Sa.at(0.15, -0.04), 'astronomer').joint('upperarm_na', SNa, 'astronomer').joint('forearm_na', ENa, 'upperarm_na').joint('hand_na', WNa, 'forearm_na');
  f.joint('upperarm_fa', SFa, 'astronomer').joint('forearm_fa', EFa, 'upperarm_fa').joint('hand_fa', WFa, 'forearm_fa');
  // far arm, flung up and back over his head onto the wheel above
  f.bone('upperarm_fa');
  W.armRig(f, SFa, EFa, WFa, [50, 42, 34], RBa({ fill: '#323a4a' }), '_fa', { bp: [[0, 0.5, 0.12, 0.2]] });
  f.bone('forearm_fa'); W.rimeCrust(f, [lp(EFa, WFa, 0.1, 18), lp(EFa, WFa, 0.7, 16)], 5, L);
  f.bone('hand_fa');
  B.grip(f, WFa, EFa, Math.atan2(-0.2, -1), 34, P.skinI, { shadow: '#565c72', tex: 'mottle' + seed, texOp: 0.4, name: 'astronomer tooth', maxBend: 40 });
  W.icicles(f, [add(WFa, [-16, 22]), add(WFa, [16, 22])], 2, 8, 18);
  // the robe: torso and the skirt that runs down into the teeth
  f.bone('astronomer');
  const tor = Sa.shape([[-0.06, 0.34, 0.3], [0.06, 0.62, 0.52], [0.22, 0.68, 0.68], [0.45, 0.62, 0.64], [0.7, 0.58, 0.58], [0.9, 0.64, 0.6], [1.1, 0.74, 0.7], [1.3, 0.8, 0.8]]);
  f.part(tor, RBa());
  W.clipDraw(f, tor, () => {
    for (const g of [[Sa.at(-0.3, 0.2), Sa.at(-0.22, 0.6), Sa.at(-0.4, 1.2)], [Sa.at(0.2, 0.3), Sa.at(0.34, 0.7), Sa.at(0.22, 1.2)], [Sa.at(0.0, 0.5), Sa.at(0.08, 1.0)], [Sa.at(-0.5, 0.9), Sa.at(-0.6, 1.25)]]) W.fold(f, g, 2.4);
    W.hoar(f, Sa.at(-0.4, 0.3), 40, 80, 0.75);
    W.lichtenberg(f, Sa.at(0.4, 0.9), -2.2, 120, 2.6, { depth: 3, col: '#1e2a30' });
    f.part(hard([Sa.at(-0.5, 0.5), Sa.at(-0.2, 0.48), Sa.at(-0.2, 0.7), Sa.at(-0.5, 0.72)]), RBa({ fill: '#323a4a', cast: false, inkW: 1 })); f.stitches([Sa.at(-0.5, 0.5), Sa.at(-0.2, 0.48), Sa.at(-0.2, 0.7), Sa.at(-0.5, 0.72), Sa.at(-0.5, 0.5)], '#8a92a0', 0.8);
  });
  W.rimeCrust(f, [Sa.at(-0.3, -0.06), Sa.at(-0.62, 0.1), Sa.at(-0.68, 0.5), Sa.at(-0.66, 0.9)], 7, L);
  // the college's pale blue hood, thrown back on his shoulders and frozen stiff, rime on its rolled edge
  const hood = [Sa.at(-0.7, -0.02), Sa.at(-0.3, -0.16), Sa.at(0.3, -0.14), Sa.at(0.62, 0.0), Sa.at(0.56, 0.2), Sa.at(0.2, 0.3), Sa.at(-0.2, 0.42), Sa.at(-0.56, 0.36), Sa.at(-0.76, 0.2)];
  f.part(hood, { fill: '#8ea8c4', shadow: '#3a4a64', light: '#d4e2ee', shade: 0.4, tex: 'weave' + seed, texOp: 0.4 });
  W.clipDraw(f, hood, () => { W.fold(f, [Sa.at(-0.4, 0.0), Sa.at(-0.3, 0.34)], 2.2); W.fold(f, [Sa.at(0.1, -0.08), Sa.at(0.0, 0.28)], 2); W.hoar(f, Sa.at(-0.4, 0.1), 40, 30, 0.8); });
  W.rimeCrust(f, [Sa.at(-0.76, 0.2), Sa.at(-0.7, -0.02), Sa.at(-0.3, -0.16), Sa.at(0.3, -0.14)], 8, L);
  W.icicles(f, [Sa.at(-0.56, 0.36), Sa.at(-0.2, 0.42), Sa.at(0.2, 0.3)], 4, 10, 28);
  // the star stole and a belt with an ink-horn
  f.part([Sa.at(0.04, -0.04), Sa.at(0.34, -0.02), Sa.at(0.54, 0.5), Sa.at(0.6, 1.0), Sa.at(0.42, 1.02), Sa.at(0.28, 0.5)], W.ROBE(f, { fill: '#34405a', shadow: '#161c2c', light: '#56688a' }));
  for (const [u, v] of [[0.26, 0.2], [0.36, 0.4], [0.44, 0.62], [0.5, 0.86]]) { f.flat(ell(Sa.at(u, v), 3, 3, 0, 6), P.bone); f.line([add(Sa.at(u, v), [-5, 0]), add(Sa.at(u, v), [5, 0])], 0.8, P.bone); }
  f.line([Sa.at(0.26, 0.2), Sa.at(0.36, 0.4), Sa.at(0.44, 0.62), Sa.at(0.5, 0.86)], 1, P.boneD, { dash: '3 2', op: 0.8 });
  f.part([Sa.at(-0.66, 0.8), Sa.at(0.62, 0.78), Sa.at(0.64, 0.86), Sa.at(-0.68, 0.88)], W.LEA(f, { sharp: true }));
  f.part(limb(Sa.at(-0.5, 0.86), add(Sa.at(-0.5, 0.86), [-6, 50]), 14, 10, { steps: 3, capK: 0.5 }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.1, cast: false }); // an ink-horn on a thong
  // the great wheel bites over his hips: the teeth run through the robe
  f.bone('gear_1');
  W.gear(f, G1, 170, 48, { a: 0.0, look: BRZ() });
  W.clipDraw(f, ell(G1, 170, 170, 0, 30), () => { W.hoar(f, add(G1, [-80, -90]), 90, 70, 0.7); W.lichtenberg(f, add(G1, [-30, 40]), 2.4, 140, 3.2, { metal: true, depth: 3 }); W.soot(f, add(G1, [40, -100]), 60, 40, 0.35); });
  f.bone('astronomer');
  // the robe caught in the teeth, pulled taut over the rim; the metal ran where the strike fused cloth and flesh to it
  const fl = [Sa.at(-0.66, 1.0), Sa.at(0.7, 0.98), add(G1, [-70, -150]), add(G1, [-120, -116]), add(G1, [-160, -50])];
  f.part(fl, RBa({ fill: '#363e4e' }));
  W.clipDraw(f, fl, () => { W.fold(f, [Sa.at(-0.4, 1.0), add(G1, [-140, -80])], 2.4); W.fold(f, [Sa.at(0.3, 1.0), add(G1, [-90, -130])], 2.4); });
  W.weld(f, [add(G1, [-164, -40]), add(G1, [-136, -100]), add(G1, [-80, -146])], 6, { a: 3.4 });
  W.icicles(f, [add(G1, [-160, -50]), add(G1, [-120, -116])], 4, 12, 36);
  // one shoe still out of the train, the leg gone into it
  shoe(f, [G1[0] + 150, G1[1] - 40], -1.1, 60, W.LEA(f, { fill: '#3a302a' }));
  // ---- head: tipped back, the shout never finished, eyes frosted wide, hair stopped mid-swing
  f.bone('astro_head');
  f.part(limb(Sa.at(0.15, -0.04), add(HCa, [-6, 38]), 44, 38), SKA());
  W.lichtenberg(f, Sa.at(0.1, 0.0), -2.4, 60, 2.2, { depth: 2 });
  const hFa = frame(HCa, hAa, AH);
  for (let i = 0; i < 6; i++) f.stroke(hFa([[-0.3 - i * 0.02, -0.34 + i * 0.1], [-0.5 - i * 0.04, -0.3 + i * 0.12], [-0.66 - i * 0.04, -0.2 + i * 0.14]]), 5, i % 2 ? '#6a6058' : '#3e3630', { op: 0.9 }); // hair flung back, frozen
  B.head(f, HCa, AH, hAa, {
    skin: P.skinI, jaw: 1.06, chin: 0.02, nose: 1.08, hook: 0.25, mouth: 'set', squint: -0.5, browDown: -0.1, browW: 0.055, age: true, gaunt: true, faceShade: 0.82, jawShade: 0.4,
    eyeWhite: '#e2eaee', iris: '#4a5a68', hairCol: '#4e463e', browCol: '#cfd6da', beard: 'stubble', beardCol: '#6a625a',
    hair: [[-0.38, 0.12], [-0.46, -0.16], [-0.36, -0.4], [-0.12, -0.54], [0.12, -0.52], [0.28, -0.4], [0.12, -0.38], [-0.1, -0.3], [-0.24, -0.1], [-0.28, 0.14]],
  });
  f.flat(hFa([[0.16, 0.25], [0.25, 0.235], [0.32, 0.26], [0.31, 0.4], [0.23, 0.45], [0.17, 0.39]]), '#101218'); // the open mouth
  f.flat(hFa([[0.18, 0.252], [0.27, 0.245], [0.29, 0.265], [0.19, 0.272]]), P.bone, { op: 0.8 }); // upper teeth
  f.flat(hFa(ell([0.24, 0.4], 0.04, 0.025, 0, 8)), '#5a3a40', { op: 0.6 }); // tongue
  f.flat(hFa(ell([0.12, -0.058], 0.05, 0.028, 0, 10)), '#dfe8ee', { op: 0.35 }); f.flat(hFa(ell([0.29, -0.062], 0.022, 0.02, 0, 8)), '#dfe8ee', { op: 0.3 });
  f.line(hFa([[0.02, -0.2], [0.1, -0.24], [0.2, -0.22]]), 1.2, INK, { op: 0.6 }); f.line(hFa([[0.0, -0.25], [0.12, -0.29]]), 1, INK, { op: 0.5 }); // the brow lifted, furrowed
  W.clipDraw(f, hFa([[-0.38, 0.12], [-0.46, -0.16], [-0.36, -0.4], [-0.12, -0.54], [0.12, -0.52], [0.28, -0.4], [0.12, -0.38], [-0.24, -0.1], [-0.28, 0.14]]), () => W.hoar(f, hFa([[0.0, -0.42]])[0], 44, 22, 0.85));
  W.facets(f, hFa([[0.14, 0.1]])[0], 18, 16, 4, { s: 0.6, op: 0.28 });
  for (const q of hFa([[0.36, 0.15], [0.32, 0.46], [0.2, 0.53]])) W.icicle(f, q, 10 + f.r() * 10, 3.4);
  // ---- near arm thrown out toward us, the astrolabe slipping on its cord
  f.bone('upperarm_na');
  W.armRig(f, SNa, ENa, WNa, [52, 46, 36], RBa({ fill: '#44506a' }), '_na', { bp: [[0, 0.5, 0.12, 0.2], [1, 0.4, 0.14, 0.2]] });
  f.bone('upperarm_na'); W.fold(f, [lp(SNa, ENa, 0.4, 14), lp(SNa, ENa, 0.7, -8)], 1.8);
  f.bone('forearm_na');
  const sl2 = [lp(ENa, WNa, 0.15, 20), lp(ENa, WNa, 0.72, 26), add(lp(ENa, WNa, 0.68, 30), [0, 52]), add(lp(ENa, WNa, 0.3, 24), [0, 64])];
  f.part(sl2, RBa({ fill: '#3a4256', cast: false }));
  W.fold(f, [lp(ENa, WNa, 0.4, 24), add(lp(ENa, WNa, 0.45, 26), [0, 44])], 1.6);
  W.icicles(f, [add(lp(ENa, WNa, 0.68, 30), [0, 52]), add(lp(ENa, WNa, 0.3, 24), [0, 64])], 4, 10, 30);
  W.rimeCrust(f, [lp(ENa, WNa, 0.1, -24), lp(ENa, WNa, 0.85, -20)], 6, L);
  f.bone('hand_na');
  const rh = B.hand(f, add(WNa, [-6, 4]), ang(ENa, WNa) + 0.15, 36, P.skinI, { spread: 0.45, curl: 0.4, shadow: '#565c72' });
  for (const t of rh.tips) W.icicle(f, add(t, [0, 2]), 8 + f.r() * 8, 3.2);
  W.lichtenberg(f, add(WNa, [24, -2]), 0.1, 50, 2, { depth: 2 });
  f.bone('astrolabe');
  const al = add(rh.tips[1], [-2, 92]);
  W.rope(f, [rh.tips[1], add(rh.tips[1], [-3, 30]), add(al, [0, -52])], 2.4, { col: '#5a4c3e' });
  // the astrolabe hangs plumb, edge-on: the back plate and the alidade face us, never the working face
  f.part(ell(add(al, [6, 0]), 17, 50, 0, 20), BRD({ shade: 0.45 }));
  W.bplate(f, ell(al, 15, 48, 0, 20), BRZ(), { hard: false, bev: 3 });
  f.part(limb(add(al, [0, -42]), add(al, [0, 42]), 6, 6, { steps: 3 }), BRZ({ fill: P.brassL, cast: false, inkW: 1 }));
  f.part(ell(add(al, [0, -54]), 8, 8, 0, 10), BRZ({ cast: false, inkW: 1.2 }));
  W.icicle(f, add(al, [0, 49]), 22, 5, { drop: true });

  // ---- the sun-and-moon dial (independent review: no painted face). An engraved astronomical disc: the day half is a
  // brass plate engine-turned in rings and cut with rays round an engraved sun boss; the night half is blue enamel with
  // bone stars and the moon, a silver sphere half in shadow, its maria and craters engraved. Sun and moon sit either
  // side of the Tooth, so the whole clock reads as a face only in its order, never as a drawn one.
  f.bone('sunmoon');
  const VR = R * 0.34, VF = (u, v) => add(DC, rot([u * VR * KX, v * VR], TA));
  const circ = (c, r, n = 40) => { const o = []; for (let j = 0; j < n; j++) { const t = j / n * Math.PI * 2; o.push(VF(c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r)); } return o; };
  const vol = circ([0, 0], 1, 60);
  f.part(vol, { fill: '#30425e', shadow: '#121a2a', light: '#5a7090', shade: 0.35, tex: 'crack' + seed, texOp: 0.4, maxShade: 50 });
  const sunHalf = [...Array(31).keys()].map(j => VF(Math.cos(Math.PI / 2 + j / 30 * Math.PI), Math.sin(Math.PI / 2 + j / 30 * Math.PI)));
  const nightHalf = [...Array(31).keys()].map(j => VF(Math.cos(-Math.PI / 2 + j / 30 * Math.PI), Math.sin(-Math.PI / 2 + j / 30 * Math.PI)));
  W.clipDraw(f, nightHalf, () => {
    for (let i = 0; i < 46; i++) { const r = 0.12 + f.r() * 0.8, t = -1.5 + f.r() * 3.0, q = VF(Math.cos(t) * r, Math.sin(t) * r), rr = 1.6 + f.r() * 2.6; f.flat(ell(q, rr, rr, 0, 6), P.bone, { op: 0.6 + f.r() * 0.35 }); }
    for (const pts of [[[0.2, -0.7], [0.34, -0.6], [0.5, -0.66], [0.62, -0.52]], [[0.7, 0.62], [0.56, 0.74], [0.4, 0.7]]]) { const q = pts.map(p => VF(p[0], p[1])); f.line(q, 1.2, P.boneD, { op: 0.7, dash: '4 3' }); q.forEach(z => f.flat(ell(z, 3.4, 3.4, 0, 6), P.bone)); } // two engraved asterisms
    W.hoar(f, VF(0.5, 0.6), 80, 60, 0.75);
  });
  f.part(sunHalf, BRZ({ fill: mix(P.brass, P.brassL, 0.35), shade: 0.4, maxShade: 50 }));
  W.clipDraw(f, sunHalf, () => {
    for (let k = 1; k < 7; k++) { const pts = []; for (let j = 0; j <= 60; j++) { const t = Math.PI / 2 + j / 60 * Math.PI, r = k * 0.14 + Math.sin(t * 18) * 0.012; pts.push(VF(Math.cos(t) * r, Math.sin(t) * r)); } f.line(pts, 1.3, INK, { op: 0.4 }); f.line(pts.map(q => add(q, [-1.4, -1.4])), 0.9, P.brassP, { op: 0.45 }); } // engine-turned rings
    const sc = [-0.5, 0.28];
    for (let i = 0; i < 28; i++) { const t = i / 28 * Math.PI * 2, r0 = 0.5, r1 = i % 2 ? 0.58 : 0.68; f.line([VF(sc[0] + Math.cos(t) * r0, sc[1] + Math.sin(t) * r0), VF(sc[0] + Math.cos(t) * r1, sc[1] + Math.sin(t) * r1)], i % 2 ? 1.4 : 2.4, INK, { op: 0.55, straight: true }); } // cut rays
    W.lichtenberg(f, VF(-0.7, -0.4), 2.2, 110, 2.6, { metal: true, depth: 3 });
    W.soot(f, VF(-0.8, -0.3), 40, 50, 0.3);
  });
  // the sun: a raised boss in a crown of sixteen wedge rays, straight and flamed by turns, engraved with fine radii
  for (let i = 0; i < 16; i++) { const t = i / 16 * Math.PI * 2, l = i % 2 ? 0.36 : 0.46, w2 = 0.09; f.part(hard([VF(-0.5 + Math.cos(t - w2) * 0.2, 0.28 + Math.sin(t - w2) * 0.2), VF(-0.5 + Math.cos(t) * l, 0.28 + Math.sin(t) * l), VF(-0.5 + Math.cos(t + w2) * 0.2, 0.28 + Math.sin(t + w2) * 0.2)]), BRZ({ fill: P.brassL, inkW: 1.2, cast: false, shade: 0.5 })); }
  const sb = circ([-0.5, 0.28], 0.22, 30);
  W.bplate(f, sb, BRZ({ fill: P.brassL, shade: 0.3, maxShade: 14 }), { hard: false, bev: 4 });
  for (let i = 0; i < 36; i++) { const t = i / 36 * Math.PI * 2; f.line([VF(-0.5 + Math.cos(t) * 0.03, 0.28 + Math.sin(t) * 0.03), VF(-0.5 + Math.cos(t) * 0.19, 0.28 + Math.sin(t) * 0.19)], 0.9, P.brassD, { op: 0.55, straight: true }); }
  // the moon: a silver sphere, waning, its shadowed side dark blue, maria and craters engraved
  const mc = [0.5, 0.28], mr = 0.25, moon = circ(mc, mr, 36);
  f.part(moon, { fill: '#c6ccd2', shadow: '#5a6478', light: '#f4f6f8', shade: 0.4, tex: 'crack' + seed, texOp: 0.3, cast: false });
  W.clipDraw(f, moon, () => {
    for (const [u, v, rx, ry] of [[0.44, 0.2, 0.09, 0.06], [0.56, 0.34, 0.07, 0.05], [0.5, 0.12, 0.05, 0.04]]) f.flat(circ([u, v], rx, 14).map((q, i) => lerp(q, VF(u, v), (i % 3) * 0.12)), '#7e8898', { op: 0.45 }); // maria
    for (const [u, v, r] of [[0.38, 0.32, 0.03], [0.6, 0.18, 0.025], [0.52, 0.44, 0.035], [0.64, 0.4, 0.02], [0.42, 0.1, 0.02]]) { const c = circ([u, v], r, 12); f.line(c.concat([c[0]]), 1.2, INK, { op: 0.55 }); f.line(c.slice(1, 6), 1, '#ffffff', { op: 0.6 }); }
    const term = circ([mc[0] + 0.13, mc[1]], mr * 1.05, 36); // the shadowed limb: waning gibbous, dark on the right
    f.raw(`<path d="${E.smooth(moon)} ${E.smooth(term.slice().reverse())}" fill="#1a2232" opacity="0.82" fill-rule="evenodd"/>`);
    W.hoar(f, VF(0.42, 0.18), 30, 30, 0.6);
  });
  f.line(circ(mc, mr + 0.03, 36).concat([circ(mc, mr + 0.03, 36)[0]]), 3, P.brassL);
  // the index between day and night, and the moon's age: thirty ticks on an engraved band round the rim
  f.part(hard([VF(-0.03, -1), VF(0.03, -1), VF(0.03, 1), VF(-0.03, 1)]), BRZ({ fill: P.brassL, inkW: 1.2, cast: false }));
  for (let i = 0; i < 30; i++) { const t = -Math.PI / 2 + i / 30 * Math.PI * 2; f.line([VF(Math.cos(t) * 0.9, Math.sin(t) * 0.9), VF(Math.cos(t) * (i % 5 ? 0.96 : 0.99), Math.sin(t) * (i % 5 ? 0.96 : 0.99))], i % 5 ? 1.2 : 2.4, i < 15 ? P.bone : INK, { op: 0.8, straight: true }); }
  W.band(f, W.ringArc(DC, VR * KX * 0.88, VR * 0.88, TA, 0, Math.PI * 2, 60), 3, P.brassL);
  W.band(f, W.ringArc(DC, VR * KX, VR, TA, 0, Math.PI * 2, 60), 6, P.brassL);

  // ---- frost over the dial: a veil thickest low and on the windward left, rime on the upper rim, icicles
  f.bone('dial');
  for (const r of [0.36, 0.64, 0.84]) W.rimeCrust(f, W.ringArc(DC, R * KX * r, R * r, TA, Math.PI * 1.0, Math.PI * 1.6, 24), 9, L);
  W.clipDraw(f, disc, () => { W.hoar(f, Tr(0.7, clk(9.2)), 300, 340, 0.95); W.hoar(f, Tr(0.75, clk(10.8)), 220, 200, 0.8); W.hoar(f, Tr(0.8, clk(3.5)), 160, 220, 0.6); W.hoar(f, Tr(0.6, clk(2.5)), 160, 140, 0.45); W.facets(f, Tr(0.5, clk(9.5)), 200, 200, 10, { s: 3, op: 0.18 }); W.frostCracks(f, Tr(0.6, clk(1.5)), 200, 140, 10, 2); });
  W.rimeCrust(f, W.ringArc(BC, R * KX * 1.16, R * 1.16, TA, Math.PI * 0.95, Math.PI * 1.85, 40), 26, L, { feather: 2 });
  W.icicles(f, W.ringArc(BC, R * KX * 1.16, R * 1.16, TA, Math.PI * 0.1, Math.PI * 0.35, 12), 8, 20, 70);
  W.icicles(f, W.ringArc(BC, R * KX * 1.16, R * 1.16, TA, Math.PI * 0.68, Math.PI * 0.92, 12), 8, 20, 70);

  // ---- the hands: hour at a breath before twelve, minute one minute before, the second hand mid-tick
  const handLook = BRZ({ fill: mix(P.brass, '#1a1a20', 0.35), inkW: 2, shade: 0.45 });
  f.bone('hand_sec');
  W.clockHand(f, DC, (47 / 60) * Math.PI * 2, R * 0.9, 12, BRZ({ fill: P.brassD, inkW: 1.4 }), { tail: 0.3 });
  f.bone('hand_hour');
  W.clockHand(f, DC, (11 + 59 / 60) / 12 * Math.PI * 2, R * 0.56, 58, handLook);
  f.bone('hand_min');
  const mA = (59 / 60) * Math.PI * 2;
  W.clockHand(f, DC, mA, R * 0.86, 40, handLook);
  W.rimeCrust(f, [add(DC, rot([0, -R * 0.2], mA)), add(DC, rot([0, -R * 0.8], mA))].map(q => add(q, [-14, 0])), 8, L);
  W.icicles(f, [add(DC, rot([20, -R * 0.3], mA)), add(DC, rot([16, -R * 0.75], mA))], 4, 14, 40);
  f.bone('dial');
  // the glass over the face: cracked from one blow at ten o'clock, rimed in patches, glinting; broken out over the train
  const glass = W.ringArc(BC, R * KX * 0.99, R * 0.99, TA, 0, Math.PI * 2, 80);
  const gcl = f.id('gl'); f.defs.push(`<clipPath id="${gcl}"><path clip-rule="evenodd" d="${E.smooth(glass)} ${E.smooth(hole)}"/></clipPath>`);
  { const i0 = f.out.length;
    const ip = Tr(0.56, clk(10.3));
    for (let i = 0; i < 11; i++) { const a = i / 11 * Math.PI * 2 + f.r() * 0.3, l = 160 + f.r() * 320; let q = ip; const pts = [q]; for (let k = 0; k < 4; k++) { q = add(q, rot([l / 4, 0], a + (f.r() - 0.5) * 0.25)); pts.push(q); } f.line(pts, 2.2, INK, { op: 0.55, straight: true }); f.line(pts.map(z => add(z, [1.6, 1.6])), 1.4, '#ffffff', { op: 0.55, straight: true }); }
    for (const rr of [40, 90, 150]) { const arc = []; for (let k = 0; k <= 16; k++) { const a = k / 16 * Math.PI * 2; arc.push(add(ip, [Math.cos(a) * rr * (0.9 + f.r() * 0.2), Math.sin(a) * rr * (0.9 + f.r() * 0.2)])); } for (let k = 0; k < 16; k += 2) f.line([arc[k], arc[k + 1]], 1.6, '#ffffff', { op: 0.5, straight: true }); }
    f.flat(ell(ip, 14, 12, 0.3, 8).map(q => [q[0], q[1], 1]), '#ffffff', { op: 0.7 });
    for (const [t, r, l] of [[clk(10.8), 0.8, 260], [clk(1.6), 0.7, 180], [clk(2.4), 0.5, 120]]) { const q = Tr(r, t); f.line([q, add(q, rot([l, 0], -0.75))], 10, '#ffffff', { op: 0.16, straight: true }); f.line([add(q, [16, 10]), add(add(q, [16, 10]), rot([l * 0.6, 0], -0.75))], 4, '#ffffff', { op: 0.22, straight: true }); } // glints
    const body = f.out.splice(i0).join('\n'); f.raw(`<g clip-path="url(#${gcl})">${body}</g>`); }
  for (let i = 0; i < 9; i++) { const t = clk(4.4 + i * 0.45), a = Tr(0.42 + (i % 3) * 0.05, t), b2 = Tr(0.5 + (i % 2) * 0.08, t + 0.12); f.part(hard([a, b2, add(lerp(a, b2, 0.5), [(f.r() - 0.5) * 30, 24])]), { fill: P.glass, shadow: P.iceS, light: P.iceL, shade: 0.3, inkW: 1.2, cast: false, hatch: false }); } // glass shards left in the bezel round the break
  // the Tooth: the central arbor, a long pointed brass boss standing out of the face
  f.bone('dial');
  const tb = [DC[0] - 10, DC[1] + 4];
  f.part(ell(tb, 46, 50, 0, 18), BRZ({ fill: P.brassD, shade: 0.45 }));
  const tooth = [add(tb, [-34, 8]), add(tb, [-30, -22]), add(tb, [-80, -46]), add(tb, [-118, -40]), add(tb, [-74, -10]), add(tb, [-20, 30]), add(tb, [20, 30]), add(tb, [34, 0])];
  W.bplate(f, tooth, BRZ({ fill: P.brassL }), { hard: false, bev: 5, lich: [[add(tb, [-40, -14]), 2.8, 60, 2]] });
  f.line([add(tb, [-28, -6]), add(tb, [-112, -38])], 2.4, P.brassP, { op: 0.7 });
  W.icicle(f, add(tb, [-96, -32]), 28, 7, { drop: true });

  // ---- the chime: the bell at the top of the case and its hammer on a lever
  f.bone('bell');
  const bl = [1470, 120];
  const bell = [add(bl, [-60, -170]), add(bl, [60, -170]), add(bl, [80, -60]), add(bl, [96, 40]), add(bl, [140, 90]), add(bl, [-140, 90]), add(bl, [-96, 40]), add(bl, [-80, -60])];
  W.bplate(f, bell, BRD({ fill: mix(P.brass, '#2a2420', 0.3) }), { hard: false, bev: 8, frost: [[add(bl, [-40, -80]), 60, 80, 0.8]], lich: [[add(bl, [40, 20]), 2.0, 120, 3]], dents: [[add(bl, [-30, 50]), 14]] });
  for (const y of [-20, 60]) f.line([add(bl, [-92 - y * 0.2, y]), add(bl, [92 + y * 0.2, y])], 3, P.brassD, { op: 0.8 });
  W.band(f, [add(bl, [-140, 90]), add(bl, [140, 90])], 12, P.brassL);
  W.icicles(f, [add(bl, [-140, 96]), add(bl, [140, 96])], 9, 18, 60);
  f.bone('hammer');
  const hm0 = [1330, 330], hm1 = [1400, 190];
  f.part(limb(hm0, hm1, 18, 16, { steps: 4 }), W.IR(f, { inkW: 1.5 }));
  W.bplate(f, hard([add(hm1, [-46, -30]), add(hm1, [30, -50]), add(hm1, [46, -10]), add(hm1, [-30, 12])]), BRD(), { bev: 4 });
  W.hinge(f, hm0, 20);
  W.icicles(f, [add(hm1, [-30, 12]), add(hm1, [46, -10])], 3, 12, 30);

  // ---- floor: frost and the broken glass of the face
  f.bone('case');
  for (let i = 0; i < 14; i++) { const q = [200 + f.r() * 1200, gy - 4 - f.r() * 10], r = 6 + f.r() * 14; f.part(hard([add(q, [-r, 0]), add(q, [-r * 0.2, -r * 0.6]), add(q, [r, -2]), add(q, [r * 0.4, 2])]), { fill: P.glass, shadow: P.iceS, light: P.iceL, shade: 0.3, inkW: 1, cast: false, hatch: false }); }
  W.rimeCrust(f, [[120, gy - 2], [800, gy - 6], [1500, gy - 2]], 10, L);
  return f;
}

module.exports = {
  heroes: [
    { key: 'the_last_hour', name: 'The Last Hour', tier: 'ruler', w: T.ruler[0], h: T.ruler[1], flip: false, build: lastHour },
    { key: 'horologist', name: 'The Horologist', tier: 'elite', w: T.elite[0], h: T.elite[1], flip: true, build: horologist },
    { key: 'rime_colossus', name: 'Rime Colossus', tier: 'elite', w: T.elite[0], h: T.elite[1], flip: true, build: rimeColossus },
    { key: 'stopped_pilgrim', name: 'Stopped Pilgrim', tier: 'human', w: T.human[0], h: T.human[1], flip: true, build: stoppedPilgrim },
    { key: 'frozen_halberdier', name: 'Frozen Halberdier', tier: 'human', w: T.human[0], h: T.human[1], flip: true, build: frozenHalberdier },
    { key: 'clock_sentry', name: 'Clock Sentry', tier: 'large', w: T.large[0], h: T.large[1], flip: true, build: clockSentry },
    { key: 'gear_spider', name: 'Gear Spider', tier: 'small', w: T.small[0], h: T.small[1], flip: true, build: gearSpider },
    { key: 'aurora_moth', name: 'Aurora Moth', tier: 'small', w: T.small[0], h: T.small[1], flip: true, build: auroraMoth },
  ],
};
