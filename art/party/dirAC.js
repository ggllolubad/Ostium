// Direction A+C: A's veterans (6.4 heads, heavy) rendered in C's Living Ink crosshatch. Bulwark stands taller.
'use strict';
const E = require('./engine');
const B = require('./body');
const G = require('./gear');
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;

const INK = '#1a120c';
const base = seed => ({ mode: 'ink', seed, ink: INK, shadowTint: '#2a1f2a', keyTint: '#fff3d8', rim: null, grimeY: 640, groundY: 790, mud: '#3a2a18', wobble: 1.8, inkW: 1.6, inkHeavy: 3.6 });

// ---- rig helpers (used by dirAC2.js too)
// side(P, d, r): the region on the d side of the line through P (square to d), plus a disk of radius r round P, as an
// SVG path. A joint cut gives the parent side(P, -d, r) and the child side(P, d, r): both own the disk, so the child's
// round end always covers the parent's when it turns about P, and nothing opens at the joint.
function side(P, d, r = 0, L = 3000) {
  d = E.norm(d); const n = [-d[1], d[0]], pts = [add(P, mul(n, L)), add(add(P, mul(n, L)), mul(d, L)), add(add(P, mul(n, -L)), mul(d, L)), add(P, mul(n, -L))];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; pts.push(add(P, add(mul(n, -Math.cos(a) * r), mul(d, -Math.sin(a) * r)))); }
  return 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
}
// split(f, draw, cuts): one shape that spans a joint (a tall boot, a trouser tube from hip to shin, a robe from shoulder
// to hem) is drawn once by draw(), then given to each bone in cuts = [[bone, region or [regions]], ...], clipped to its
// region, in that order (the child last, on top). In the rest pose the copies coincide, so the render does not change.
function split(f, draw, cuts) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  for (const [bone, reg] of cuts) {
    let g = body;
    for (const r of [].concat(reg)) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; }
    f.bone(bone); f.raw(g);
  }
  return res;
}

// ------------------------------------------------------------------ BULWARK
function bulwark() {
  const f = new Fig(base(11));
  const H = 100;
  const steel = '#7b8189', steelD = '#5c6168', gamb = '#6e5c43', oak = '#5b412a', leather = '#46301f', mail = '#5d6064', red = '#8e1f17';
  const N = [306, 248], C = [270, 338], P = [270, 470];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.42, 0.13), SF = S.at(0.5, 0.1);
  const HN = S.at(-0.25, 1.0), HF = S.at(0.3, 0.98);
  const KF = [368, 604], AF = [376, 734], KN = [208, 612], AN = [146, 742];
  const EN = [252, 418], WN = [336, 408];
  const EF = [402, 372], WF = [430, 420];

  // skeleton: pelvis is the root; every bone rotates about its joint
  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.25, -0.08), 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('mace', WN, 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('door', [470, 420], 'hand_f').joint('bedroll', S.at(-0.75, -0.12), 'torso');
  // far arm (behind torso), mostly hidden by shield
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 44, 36, { q: [[0.4, 0.15, 0.2]] }), { fill: gamb, tex: 'quilt11' });
  f.part(plate(SF, EF, 0.15, 0.75, 46, 40), { fill: steelD });

  // far (left) leg, forward and bent
  f.bone('thigh_f');
  f.part(limb(HF, KF, 62, 44, { q: [[0.35, 0.18, 0.2]] }), { fill: gamb, tex: 'quilt11' });
  f.bone('shin_f');
  f.part(limb(KF, AF, 42, 30, { p: [[0.3, 0.2, 0.18]] }), { fill: gamb });
  f.part(plate(KF, AF, 0.05, 0.95, 44, 34, { bow: 3 }), { fill: steelD });
  G.poleyn(f, KF, 0.15, 30, steel, steelD);
  f.bone('foot_f');
  B.boot(f, AF, 1, 54, '#5d6268', { tex: 'mottle11', shaft: 0.2, style: 'sabaton', toe: 1.2 });

  // near (right) leg, braced back
  f.bone('thigh_n');
  f.part(limb(HN, KN, 66, 46, { p: [[0.4, 0.15, 0.25]] }), { fill: gamb, tex: 'quilt11' });
  f.part(plate(HN, KN, 0.55, 0.95, 52, 44, { bow: 4 }), { fill: steel });
  f.bone('shin_n');
  f.part(limb(KN, AN, 44, 30, { q: [[0.3, 0.25, 0.18]] }), { fill: gamb });
  f.part(plate(KN, AN, 0.06, 0.92, 46, 33, { bow: 3 }), { fill: steel });
  G.poleyn(f, KN, -0.35, 31, steel, steelD);
  f.scratches(lerp(KN, AN, 0.5), 14, 5);
  f.bone('foot_n');
  B.boot(f, AN, 1, 54, '#666b72', { tex: 'mottle11', shaft: 0.2, style: 'sabaton', toe: 1.2 });

  // bedroll strapped high on the back
  f.bone('bedroll');
  f.part(limb(S.at(-0.95, -0.02), S.at(-0.55, -0.22), 46, 46, { steps: 6, capK: 0.5 }), { fill: '#6b5a3e', tex: 'weave11', texOp: 0.5 });
  f.part(ell(S.at(-0.55, -0.22), 14, 23, -0.5, 12), { fill: '#7a684a', shade: 0.3 });
  f.line(ell(S.at(-0.55, -0.22), 7, 12, -0.5, 10), 1, INK, { op: 0.6 });
  for (const tt of [0.3, 0.72]) f.line([lp(S.at(-0.95, -0.02), S.at(-0.55, -0.22), tt, -24), lp(S.at(-0.95, -0.02), S.at(-0.55, -0.22), tt, 24)], 4, '#2b1c12', { straight: true });
  // gambeson torso
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.3], [0.05, 0.78, 0.55], [0.18, 0.92, 0.8], [0.4, 0.86, 0.86], [0.62, 0.74, 0.8], [0.85, 0.78, 0.76], [1.02, 0.8, 0.68], [1.1, 0.62, 0.5]]);
  f.part(torso, { fill: gamb, tex: 'quilt11', texOp: 0.6 });

  // mail skirt to mid-thigh, split over the stride
  f.bone('pelvis');
  const sk = [S.at(-0.82, 0.8), S.at(0.8, 0.8), add(S.at(0.85, 1.0), [10, 30]), [395, 560], [372, 586, 1], [330, 556], [300, 590, 1], [262, 560], [225, 590, 1], [200, 556], add(S.at(-0.85, 1.0), [-8, 26])];
  f.part(sk, { fill: mail, tex: 'mail11', texOp: 0.8 });
  f.line([[332, 556], [300, 590], [262, 560], [225, 590]], 1.2, '#2a2a2a', { op: 0.6 });

  f.bone('torso');
  // breastplate: dented, mismatched, with a lead patch
  const bp = S.shape([[0.12, 0.7, 0.62], [0.3, 0.8, 0.9], [0.5, 0.74, 0.88], [0.64, 0.7, 0.78]]);
  f.part(bp, { fill: steel, shade: 0.45, k: 0.7 });
  f.line([S.at(0.55, 0.14), S.at(0.62, 0.35), S.at(0.55, 0.6)], 1.6, INK, { op: 0.6 }); // medial ridge
  f.flat(ell(S.at(0.2, 0.38), 14, 9, -0.4), '#2b2e33', { op: 0.5 }); // dent
  f.line([S.at(0.05, 0.33), S.at(0.3, 0.42)], 1.2, '#e6e2d8', { op: 0.7 });
  f.part([S.at(-0.45, 0.42), S.at(-0.1, 0.4), S.at(-0.05, 0.56), S.at(-0.48, 0.58)], { fill: '#6d6f70', shade: 0.3, inkW: 1.2 }); // lead patch
  for (const q of [[-0.42, 0.44], [-0.1, 0.43], [-0.08, 0.54], [-0.45, 0.55]]) f.rivet(S.at(q[0], q[1]), 2.4, '#999');
  f.scratches(S.at(0.3, 0.3), 30, 8);
  // faulds (three lames)
  for (let i = 0; i < 3; i++) {
    const v0 = 0.64 + i * 0.075;
    f.part([S.at(-0.72 - i * 0.03, v0), S.at(0.8 + i * 0.03, v0 - 0.01), S.at(0.82 + i * 0.03, v0 + 0.1), S.at(-0.75 - i * 0.03, v0 + 0.1)], { fill: i % 2 ? steelD : steel, shade: 0.5, inkW: 1.4, sharp: true });
    f.rivet(S.at(0.6, v0 + 0.05), 2.4); f.rivet(S.at(-0.5, v0 + 0.05), 2.4);
  }
  // belt with pouch and ostium badge on cord
  f.part([S.at(-0.82, 0.86), S.at(0.82, 0.85), S.at(0.83, 0.93), S.at(-0.84, 0.95)], { fill: leather, shade: 0.4 });
  f.part([S.at(0.3, 0.85), S.at(0.48, 0.85), S.at(0.48, 0.95), S.at(0.3, 0.95)], { fill: '#8c7a52', shade: 0.4, inkW: 1.2 });
  f.part([S.at(-0.7, 0.9), S.at(-0.4, 0.91), S.at(-0.38, 1.1), S.at(-0.68, 1.11)], { fill: '#563a24', shade: 0.4, tex: 'mottle11', sharp: true });
  f.part([S.at(-0.72, 0.89), S.at(-0.38, 0.9), S.at(-0.4, 0.99), S.at(-0.55, 1.01), S.at(-0.7, 0.98)], { fill: '#4a301c', shade: 0.4, inkW: 1.2 });
  f.rivet(S.at(-0.55, 0.98), 2.2, '#a08a5a');
  // ostium badge on a cord at the belt
  f.line([S.at(0.05, 0.93), S.at(0.1, 1.02), S.at(0.06, 1.08)], 1.2, '#2b2119');
  G.badge(f, S.at(0.06, 1.08), 11, '#74777b', 0.08);

  // mail aventail over the shoulders
  f.bone('head');
  const HC = [328, 198];
  f.part([add(HC, [-46, 30]), add(HC, [40, 32]), S.at(0.7, 0.12), S.at(0.45, 0.2), S.at(-0.2, 0.22), S.at(-0.72, 0.12)], { fill: mail, tex: 'mail11', texOp: 0.85 });

  // great helm: flat top, riveted, eye slit, gash
  const hF = frame(HC, 0.1, 112);
  f.part(hF([[-0.42, -0.5], [-0.1, -0.6, 1], [0.3, -0.6, 1], [0.44, -0.38], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [-0.3, 0.53], [-0.45, 0.38, 1], [-0.47, -0.1]]), { fill: steel, shade: 0.5 });
  f.part(hF([[0.2, -0.6, 1], [0.3, -0.6, 1], [0.44, -0.38], [0.47, 0.1], [0.45, 0.42, 1], [0.32, 0.54], [0.22, 0.53, 1], [0.24, 0.1]]), { fill: steelD, shade: 0.4, inkW: 1.2 });
  // brow band and rivets
  f.part(hF([[-0.43, -0.31], [0.44, -0.33], [0.46, -0.22], [-0.46, -0.2]]), { fill: steelD, shade: 0.4, inkW: 1.2, sharp: true });
  for (let i = 0; i < 6; i++) f.rivet(hF([[-0.38 + i * 0.16, -0.255]])[0], 2.6);
  // eye slit (two halves split by the central ridge)
  f.flat(hF([[-0.02, -0.17], [0.21, -0.17], [0.21, -0.07], [-0.02, -0.08]]), '#050404');
  f.flat(hF([[0.27, -0.17], [0.46, -0.17], [0.46, -0.08], [0.27, -0.08]]), '#050404');
  f.flat(hF(ell([0.12, -0.12], 0.025, 0.018, 0, 8)), '#f2c46e'); // one eye catches the light
  f.part(hF([[0.21, -0.36], [0.27, -0.36], [0.28, 0.5], [0.22, 0.5]]), { fill: '#8a9099', shade: 0.4, inkW: 1 }); // central ridge
  // breaths
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) f.flat(hF(ell([0.31 + c * 0.05, 0.1 + r * 0.08], 0.012, 0.016, 0, 6)), '#050404');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) f.flat(hF(ell([0.05 + c * 0.07, 0.12 + r * 0.08], 0.013, 0.018, 0, 6)), '#050404');
  // sword gash across the face
  f.flat(hF([[-0.18, -0.02], [0.4, 0.3], [0.38, 0.33], [-0.19, 0.01]]), '#1b1c1f');
  f.line(hF([[-0.18, -0.03], [0.41, 0.28]]), 1.2, '#e8e8e8', { op: 0.8 });
  f.scratches(hF([[-0.2, 0.25]])[0], 22, 6);
  f.spatter(hF([[0.35, 0.35]])[0], 20, 14);
  // bottom rim rivets
  for (let i = 0; i < 5; i++) f.rivet(hF([[-0.35 + i * 0.17, 0.46]])[0], 2.3);


  f.bone('door');
  // shield: church door. thickness edge, planks, hinges, ring handle, keyhole
  const TL = [404, 262], TR = [524, 246], BR = [530, 786], BL = [412, 789]; // planted: the bottom edge stands on the ground line
  f.part([[390, 270], TL, BL, [398, 790]], { fill: '#3a2818', shade: 0.3, inkW: 1.4, sharp: true });
  f.part([TL, TR, BR, BL].map(p => [...p, 1]), { fill: oak, tex: 'wood11', texOp: 0.7, shade: 0.35 });
  for (let i = 1; i < 4; i++) { const t = i / 4; f.line([lerp(TL, TR, t), lerp(BL, BR, t)], 2.2, INK, { straight: true, op: 0.9 }); }
  // worn bright edges + gouges
  f.line([TL, TR], 2, '#a98a62', { straight: true, op: 0.7 });
  f.flat([[470, 300], [500, 290], [495, 296], [468, 306]], '#1c120a');
  f.flat([[430, 610], [452, 640], [447, 642], [426, 614]], '#1c120a');
  // three strap hinges with spear ends
  for (const y of [318, 498, 678]) {
    const a = [402, y + 3], b = [508, y - 12];
    f.part([[396, y - 9], [b[0] - 8, b[1] - 8], [b[0] + 14, b[1]], [b[0] - 8, b[1] + 8], [396, y + 13]], { fill: '#2f2f31', shade: 0.4, inkW: 1.4, sharp: true });
    f.part(ell([392, y + 2], 9, 13, 0), { fill: '#2f2f31', shade: 0.4, inkW: 1.2 });
    for (let k = 0; k < 4; k++) f.rivet(lerp(a, b, 0.12 + k * 0.24), 2.6, '#777');
    f.flat([[420, y + 10], [470, y + 4], [470, y + 7], [420, y + 13]], '#5a2a12', { op: 0.5 }); // rust bleed
  }
  // tally of kills scratched into the planks
  for (let i = 0; i < 7; i++) f.line([[436 + i * 6, 380 + i * -0.7], [433 + i * 6, 412]], 1.3, '#c8ab80', { straight: true, op: 0.85 });
  f.line([[431, 405], [478, 384]], 1.3, '#c8ab80', { straight: true, op: 0.85 });
  // keyhole plate on the rim and ring handle
  f.part([[410, 540], [432, 538], [434, 590], [412, 592]], { fill: '#2f2f31', shade: 0.4, inkW: 1.2, sharp: true });
  f.flat([[420, 556], [424, 556], [425, 570], [419, 570]], '#000');
  f.part(ell([496, 452], 9, 9), { fill: '#3a3a3a', shade: 0.4 });
  f.line(ell([497, 478], 15, 22, 0.1, 18).concat([ell([497, 478], 15, 22, 0.1, 18)[0]]), 4, '#2b2b2b', { k: 1 });
  f.line(ell([497, 478], 15, 22, 0.1, 18).slice(10, 16), 1.5, '#9a9a9a', { op: 0.8 });
  // red rubric strip tied to the ring
  f.part([[505, 494], [516, 496], [522, 560], [514, 600], [506, 598], [510, 556]], { fill: red, shade: 0.45, inkW: 1.2 });
  f.part([[500, 488], [514, 490], [512, 504], [500, 502]], { fill: mix(red, '#000', 0.2), shade: 0.4, inkW: 1 });
  // broken arrow stuck in the door
  f.line([[470, 345], [448, 330]], 3.2, '#3a2a1a', { straight: true });
  f.line([[448, 330], [443, 326], [446, 322]], 2, '#3a2a1a', { straight: true });
  f.flat([[466, 342], [474, 346], [471, 350]], '#000');
  // old blood: a dragged hand print and smears
  f.flat([[452, 620], [470, 618], [474, 640], [466, 700], [458, 702], [454, 650]], '#4a0c08', { op: 0.75 });
  f.spatter([480, 560], 40, 26);

  // near arm crossing to the shield top, mace resting on the rim
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 46, 38, { p: [[0.45, 0.15, 0.2]] }), { fill: gamb, tex: 'quilt11' });
  f.part(plate(SN, EN, 0.25, 0.85, 46, 40, { bow: 3 }), { fill: steel });
  G.pauldron(f, add(SN, [6, -4]), 42, -0.28, steel, steelD, 3);
  f.scratches(add(SN, [0, -8]), 18, 5);
  f.spatter(add(SN, [20, 4]), 18, 10);
  f.bone('forearm_n');
  f.part(limb(EN, WN, 40, 32, { q: [[0.3, 0.2, 0.2]] }), { fill: gamb });
  f.part(plate(EN, WN, 0.12, 0.88, 42, 34, { bow: 2 }), { fill: steel });
  // gambeson bulging out of the elbow joint, then the couter over it
  f.part(ell(add(EN, [4, 10]), 22, 13, 0.3, 12), { fill: gamb, tex: 'quilt11', shade: 0.5, cast: false });
  // couter: a plain cop capping the point of the elbow, no fan wing or knuckle-like rivet row, so the elbow does not read as a second fist beside the real one
  const uA = Math.atan2(EN[1] - SN[1], EN[0] - SN[0]);
  f.part(ell(add(EN, [-6, 6]), 17, 12, uA + 0.6, 14), { fill: steelD, shade: 0.5, k: 0.8 });
  f.line([lp(add(EN, [-6, 6]), add(EN, [10, -8]), -0.6, 0), lp(add(EN, [-6, 6]), add(EN, [10, -8]), 0.4, 0)], 1.2, INK, { op: 0.6 });
  f.rivet(add(EN, [-10, 10]), 2);
  f.bone('mace');
  // mace haft from fist to the rim, flanged head resting on the door top
  const mH = [500, 236], mP = [318, 424];
  f.part(limb(mP, mH, 11, 10, { steps: 6 }), { fill: '#3c2a1c', shade: 0.4, tex: 'wood11' });
  for (let i = 0; i < 5; i++) f.line([lp(mP, mH, 0.04 + i * 0.03, -6), lp(mP, mH, 0.06 + i * 0.03, 6)], 1.4, '#1a120b', { straight: true }); // leather grip wrap
  const mA = Math.atan2(mH[1] - mP[1], mH[0] - mP[0]);
  G.maceHead(f, mH, mA, 30);
  f.spatter(mH, 18, 14);
  // leather wrist loop
  f.line([lp(mP, mH, 0.02, -4), [302, 430], [312, 438], lp(mP, mH, 0.04, 6)], 2, '#2a1a10');
  // gauntleted fist on the haft
  f.bone('hand_n');
  B.grip(f, WN, EN, mA, 26, steel, { plate: true, cuff: true, maxBend: 40, name: 'bulwark mace' }); // thumb toward the head, back of the hand toward the elbow; the haft lies diagonally across the palm like a sword grip

  return f;
}


// ------------------------------------------------------------------ DUELIST
// The old bravo: side-on, weight back, blade low and forward, dagger cocked behind. Cocky.
function duelist() {
  const f = new Fig(base(12));
  const H = 96;
  const leath = '#3b302a', leathL = '#4d4038', linen = '#8d877b', breech = '#4a4038', boot = '#3a2a1f', red = '#8e1f17', skin = '#c79a78';
  const N = [276, 266], C = [304, 366], P = [282, 466];
  const S = B.spine(N, C, P, H);
  const SN = S.at(0.15, 0.1), SF = S.at(-0.35, 0.08);
  const HN = S.at(0.15, 1.0), HF = S.at(-0.2, 0.98);
  const KN = [372, 606], AN = [402, 742], KF = [214, 602], AF = [156, 744];
  const EN = [366, 352], WN = [432, 388];
  const EF = [148, 272], WF = [207, 238]; // elbow cocked back, forearm rising forward so the grip is square to it
  const HC = [296, 210];

  // skeleton: pelvis is the root; every bone rotates about its joint
  f.joint('pelvis', P).joint('torso', S.at(0, 0.9), 'pelvis').joint('head', S.at(0.05, -0.05), 'torso').joint('hair_queue', add(HC, [-42, -8]), 'head');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('dagger', WF, 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('rapier', add(WN, [-4, -2]), 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('cape', S.at(-0.45, 0.02), 'torso');
  // ankle cut for the tall boots: square to a line between the shin and the toe, so the instep goes with the foot
  const ankle = (K, A) => add(E.norm(sub(A, K)), [0.6, 0]);

  // half cape thrown back over the far shoulder
  f.bone('cape');
  f.part([S.at(-0.2, -0.02), S.at(-0.7, 0.05), [150, 380], [128, 470], [150, 520], [178, 486], [200, 510], [226, 470], S.at(-0.6, 0.62)], { fill: '#24201f', tex: 'weave12', texOp: 0.4 });
  f.line([[200, 330], [165, 450], [150, 515]], 1.3, INK, { op: 0.7 });
  f.line([[228, 340], [190, 470], [200, 508]], 1.3, INK, { op: 0.7 });
  f.part([S.at(-0.68, 0.06), [146, 384], [122, 474], [130, 482], [160, 392]], { fill: red, shade: 0.4, inkW: 1 }); // red lining edge

  // far arm raised behind, parrying dagger held point up
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 34, 28, { p: [[0.4, 0.2, 0.2]] }), { fill: linen, tex: 'weave12' });
  f.bone('forearm_f');
  f.part(limb(EF, WF, 28, 22), { fill: leath });
  // dagger: the grip runs through the fist square to the forearm, guard and blade leave on the thumb side, point up and back
  const dA = Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) - Math.PI / 2 + 0.2, DG = frame(WF, dA, 1);
  f.bone('dagger');
  f.part(DG([[-30, -4], [-22, -5], [-22, 5], [-30, 4]]), { fill: '#5a4a32', shade: 0.4, inkW: 1.1, cast: false }); // pommel past the little finger
  f.part(DG([[20, -9], [108, 0], [20, 9]]), { fill: '#b6bcc2', shade: 0.4, inkW: 1.2, sharp: true });
  f.line(DG([[26, 0], [100, 0]]), 0.8, '#eef', { op: 0.8 });
  f.part(DG([[15, -17], [21, -17], [21, 17], [15, 17]]), { fill: '#5a4a32', shade: 0.4, inkW: 1.2, sharp: true }); // cross guard
  f.bone('hand_f');
  B.grip(f, WF, EF, dA, 20, leathL, { name: 'duelist dagger' });

  // far leg back
  f.bone('thigh_f');
  f.part(limb(HF, KF, 56, 34, { q: [[0.3, 0.2, 0.2]], p: [[0.25, 0.12, 0.2]], folds: [[0.85, 'q', 0.35]] }), { fill: breech, tex: 'weave12', texOp: 0.3 });
  f.bone('shin_f');
  f.part(limb(KF, AF, 38, 24, { q: [[0.25, 0.3, 0.16]], folds: [[0.75, 'p', 0.25], [0.55, 'q', 0.2]] }), { fill: boot, tex: 'mottle12' });
  split(f, () => B.boot(f, AF, 1, 50, boot, { tex: 'mottle12', knee: add(KF, [-2, 8]), kneeW: 40, cuff: true, strap: true }), [['shin_f', side(AF, mul(ankle(KF, AF), -1), 17)], ['foot_f', side(AF, ankle(KF, AF), 17)]]);

  // torso: lean, broad chested, doublet
  f.bone('torso');
  const torso = S.shape([[-0.05, 0.3, 0.32], [0.06, 0.62, 0.45], [0.2, 0.6, 0.72], [0.42, 0.52, 0.66], [0.65, 0.45, 0.5], [0.85, 0.55, 0.5], [1.05, 0.6, 0.52], [1.12, 0.5, 0.42]]);
  f.part(torso, { fill: leath, tex: 'mottle12', texOp: 0.5 });
  f.stroke([S.at(-0.1, 0.12), S.at(0.25, 0.2), S.at(0.55, 0.32)], 2.4); // shoulder seam
  f.stroke([S.at(0.0, 0.48), S.at(0.3, 0.46), S.at(0.6, 0.38)], 2); // pectoral
  // doublet front edge, buttons, collar
  f.line([S.at(0.38, 0.02), S.at(0.62, 0.22), S.at(0.5, 0.55), S.at(0.42, 0.8)], 1.6, INK);
  for (let i = 0; i < 7; i++) f.rivet(S.at(0.6 - i * 0.025, 0.2 + i * 0.085), 2, '#8a7c6c'); // horn buttons
  f.part([S.at(-0.32, -0.1), S.at(0.38, -0.08), S.at(0.45, 0.04), S.at(-0.35, 0.06)], { fill: linen, shade: 0.4, inkW: 1.2 }); // shirt collar
  // stitched old cut across the chest
  f.stitches([S.at(-0.2, 0.3), S.at(0.1, 0.38), S.at(0.4, 0.5)]);
  // red sash with trailing tails (sash, belt and their hangings sit on the hips)
  f.bone('pelvis');
  f.part([S.at(-0.58, 0.66), S.at(-0.1, 0.68), S.at(0.52, 0.64), S.at(0.56, 0.71), S.at(0.53, 0.79), S.at(0.0, 0.8), S.at(-0.6, 0.82), S.at(-0.62, 0.74)], { fill: red, shade: 0.45, tex: 'weave12', texOp: 0.4, k: 0.5 });
  for (let i = 0; i < 4; i++) f.stroke([S.at(-0.45 + i * 0.25, 0.8), S.at(-0.32 + i * 0.25, 0.73), S.at(-0.2 + i * 0.25, 0.67)], 2.4, mix(red, '#000', 0.55));
  f.part([S.at(-0.55, 0.72), [212, 520], [190, 590], [205, 596], [222, 560], [215, 610], [234, 612], [240, 540], S.at(-0.35, 0.82)], { fill: mix(red, '#000', 0.15), shade: 0.45 });
  // belt, sword hanger, ostium badge
  f.part([S.at(-0.6, 0.84), S.at(0.55, 0.82), S.at(0.56, 0.89), S.at(-0.61, 0.91)], { fill: '#1d1612', shade: 0.4, sharp: true });
  f.part([S.at(0.3, 0.82), S.at(0.44, 0.82), S.at(0.44, 0.91), S.at(0.3, 0.91)], { fill: '#a08858', shade: 0.4, inkW: 1, sharp: true });
  f.part([S.at(-0.5, 0.88), S.at(-0.35, 0.9), [180, 610], [170, 604]], { fill: '#1d1612', shade: 0.3, sharp: true }); // empty scabbard angled back
  f.line([S.at(0.1, 0.9), S.at(0.15, 0.98)], 1.2, '#2b2119');
  G.badge(f, S.at(0.15, 0.98), 9, '#74777b', 0.1);

  // near leg forward: breeches + tall boot with folded cuff
  f.bone('thigh_n');
  f.part(limb(HN, KN, 58, 36, { p: [[0.3, 0.18, 0.2]], q: [[0.3, 0.2, 0.22]], folds: [[0.88, 'p', 0.35], [0.5, 'p', 0.15]] }), { fill: breech, tex: 'weave12', texOp: 0.3 });
  f.stroke([lp(HN, KN, 0.86, 14), lp(HN, KN, 0.78, 2), lp(HN, KN, 0.7, -6)], 2.2);
  f.stroke([lp(HN, KN, 0.45, -18), lp(HN, KN, 0.55, -6), lp(HN, KN, 0.6, 6)], 1.8);
  f.line([lerp(HN, KN, 0.3), lerp(HN, KN, 0.55)], 1.1, INK, { op: 0.5 });
  f.bone('shin_n');
  f.part(limb(KN, AN, 40, 26, { p: [[0.25, 0.3, 0.16]], folds: [[0.7, 'q', 0.25], [0.55, 'p', 0.2]] }), { fill: boot, tex: 'mottle12' });
  f.stroke([lp(KN, AN, 0.68, -12), lp(KN, AN, 0.72, 0), lp(KN, AN, 0.66, 10)], 2);
  split(f, () => B.boot(f, AN, 1, 50, boot, { tex: 'mottle12', knee: add(KN, [0, 8]), kneeW: 42, cuff: true }), [['shin_n', side(AN, mul(ankle(KN, AN), -1), 17)], ['foot_n', side(AN, ankle(KN, AN), 17)]]);
  f.bone('shin_n');
  f.scratches(lerp(KN, AN, 0.5), 10, 4, '#7a6650');

  // head: tied-back hair streaked grey, moustache, duelling scar, smirk, chin up
  f.bone('head');
  f.part(limb(S.at(0.05, -0.05), add(HC, [-4, 30]), 34, 30), { fill: skin, shade: 0.5 }); // neck
  B.head(f, HC, H, -0.1, {
    skin, jaw: 1.08, chin: 0.03, nose: 1.05, hook: 0.6, mouth: 'smirk', squint: 0.45, browDown: 0.03, age: true, glint: true,
    hairCol: '#2a2420', moustache: true, beard: 'stubble', beardCol: '#3a3430',
    scar: [[0.05, 0.02], [0.17, 0.12], [0.26, 0.2]],
    hair: [[-0.38, -0.12], [-0.33, -0.36], [-0.12, -0.54], [0.12, -0.53], [0.3, -0.4], [0.26, -0.33], [0.06, -0.36], [-0.12, -0.28], [-0.22, -0.12], [-0.3, 0.02]],
    hairLines: [[[-0.25, -0.35], [-0.05, -0.47], [0.2, -0.45]], [[-0.3, -0.2], [-0.15, -0.38], [0.05, -0.43]]],
  });
  // queue of hair tied back with a cord
  f.bone('hair_queue');
  f.part([add(HC, [-36, -18]), add(HC, [-58, -6]), add(HC, [-70, 30]), add(HC, [-60, 52]), add(HC, [-52, 20]), add(HC, [-38, 0])], { fill: '#2a2420', shade: 0.4 });
  f.line([add(HC, [-50, -16]), add(HC, [-44, -2])], 2.5, red);
  // earring
  f.bone('head');
  f.line(ell(add(HC, [-17, 21]), 3.5, 4.5, 0, 8).concat([ell(add(HC, [-17, 21]), 3.5, 4.5, 0, 8)[0]]), 1.6, '#8a8680'); // iron earring (gold is for holy things only)

  // near arm: slashed sleeve, extended forward
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 44, 30, { p: [[0.3, 0.28, 0.2]], q: [[0.35, 0.2, 0.2]], folds: [[0.9, 'q', 0.3]] }), { fill: leath, tex: 'mottle12' });
  for (const off of [-9, 0, 9]) f.part(limb(lp(SN, EN, 0.18, off), lp(SN, EN, 0.75, off * 0.7), 5, 4, { steps: 5 }), { fill: linen, shade: 0.35, inkW: 1, inkHeavy: 1.5, cast: false }); // slashes show the shirt
  f.bone('forearm_n');
  f.part(limb(EN, WN, 34, 24, { p: [[0.25, 0.25, 0.2]], folds: [[0.15, 'q', 0.3]] }), { fill: leath, tex: 'mottle12' });
  f.bone('torso'); // the shoulder roll is part of the doublet, so it stays with the torso when the arm lifts
  f.part(ell(add(SN, [8, -2]), 26, 18, -0.4, 14), { fill: leathL, shade: 0.5 }); // shoulder roll
  f.stitches([lp(SN, EN, 0.05, -14), lp(SN, EN, 0.08, 14)]);
  f.bone('forearm_n');
  f.part(plate(EN, WN, 0.55, 1.0, 34, 38), { fill: '#241c17', shade: 0.4 }); // glove cuff
  // rapier: swept hilt, long narrow blade, scorch marks
  const bA = Math.atan2(518 - 396, 588 - 446), tip = [588, 518], gh = [444, 396];
  f.bone('rapier');
  f.part(limb(gh, tip, 8.5, 2.5, { steps: 6, capK: 2 }), { fill: '#c6ccd2', shade: 0.35, inkW: 1.2, inkHeavy: 1.8 });
  f.line([lp(gh, tip, 0.05, 0), lp(gh, tip, 0.95, 0)], 0.8, '#eef2f5', { straight: true, op: 0.9 });
  for (const tt of [0.35, 0.6]) f.line([lp(gh, tip, tt, -2), lp(gh, tip, tt + 0.03, 3), lp(gh, tip, tt + 0.06, -1)], 1, '#5b4a2c', { op: 0.8, straight: true });
  G.rapierHilt(f, gh, bA, 19, '#7a746a', { only: 'back' });
  f.bone('hand_n');
  B.grip(f, add(WN, [-4, -2]), EN, -Math.PI / 2, 20, '#2a201a', { cuff: true, inline: true }); // sword grip: the hilt runs along the forearm through the palm, thumb on top
  f.bone('rapier');
  G.rapierHilt(f, gh, bA, 19, '#7a746a', { only: 'front' });
  return f;
}


// The Elementalist's sign, one form per course, drawn to the bible's shape language for that course.
// The ring of six course dots stays; the attuned course's dot swells.
const COURSES = ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'];
function sign(f, fx, el, ink6) {
  const s = f.o.seed, X = (dx, dy) => [fx[0] + dx, fx[1] + dy];
  const glow = (col, r, op) => f.raw(`<circle cx="${fx[0]}" cy="${fx[1]}" r="${r}" fill="${col}" opacity="${op}" filter="url(#soft${s})"/>`);
  if (el === 'fire') {
    // consumes from inside: a guttering tongue of flame with ash curling up
    f.line([X(6, 30), X(0, 22), X(4, 14)], 1.4, '#3a2a40', { op: 0.6 });
    glow('#ff9c3a', 46, 0.16);
    f.flat([X(-10, 26), X(-14, 4), X(-4, -20), X(2, -34), X(6, -14), X(14, 6), X(10, 26)], '#e0662a', { op: 0.95 });
    f.flat([X(-5, 24), X(-6, 6), X(0, -10), X(6, 8), X(5, 24)], '#ffd27a');
    for (const [dx, dy] of [[-8, -40], [10, -46], [2, -54]]) f.flat(ell(X(dx, dy), 2, 1.2, 0.6, 6), '#3a3030', { op: 0.7 }); // ash flecks
  } else if (el === 'frost') {
    // stills and preserves: a rough rime-crusted shard, faceted and dull, with cold breath sinking off it
    glow('#9cc8e0', 40, 0.14);
    f.part([X(-12, 22), X(-16, 2), X(-6, -24), X(4, -30), X(12, -10), X(14, 12), X(6, 24)], { fill: '#a9c4d2', shade: 0.45, sharp: true, inkW: 1.3, cast: false });
    f.line([X(-6, -24), X(-2, 0), X(6, 24)], 1, '#5a7a8a', { straight: true, op: 0.8 }); f.line([X(-2, 0), X(12, -10)], 1, '#5a7a8a', { straight: true, op: 0.8 });
    f.flat([X(-14, 4), X(-6, -22), X(-3, -4)], '#e4eef2', { op: 0.75 }); // lit facet
    for (const [dx, dy] of [[-10, 24], [0, 26], [8, 24]]) f.flat([X(dx - 2, dy), X(dx + 2, dy), X(dx, dy + 9)], '#c8dce6', { op: 0.85 }); // icicles pointing down
    for (let i = 0; i < 3; i++) f.line([X(-18 + i * 14, 30), X(-22 + i * 14, 44), X(-18 + i * 14, 56)], 1.6, '#c8dce6', { op: 0.35 }); // cold breath sinking
  } else if (el === 'lightning') {
    // strikes and scars: a knot of branching forks jumping between the fingertips, scorch on the pages
    glow('#f2e4a0', 44, 0.2);
    const fork = (pts, w) => { f.line(pts, w + 2.4, '#f6e7a8', { straight: true, op: 0.35 }); f.line(pts, w, '#fff8dc', { straight: true }); };
    fork([X(-4, 26), X(2, 10), X(-6, -2), X(4, -16), X(0, -30)], 2.2);
    fork([X(2, 10), X(14, 4), X(18, -8)], 1.4); fork([X(-6, -2), X(-18, -10), X(-22, -22)], 1.4); fork([X(4, -16), X(14, -22)], 1);
    fork([X(14, 4), X(22, 12)], 0.9); fork([X(-18, -10), X(-26, -4)], 0.9);
    f.flat(ell(X(-2, 30), 9, 3, 0, 8), '#2a1a10', { op: 0.6 }); // scorch where it grounds
  } else if (el === 'water') {
    // fills and bloats: a wobbling orb of dark seawater, a drip falling from it, a thread of kelp turning inside
    glow('#4a7aa8', 40, 0.16);
    f.part([X(-16, 6), X(-14, -12), X(-2, -22), X(12, -18), X(18, -2), X(14, 14), X(0, 20), X(-12, 18)], { fill: '#2e5a86', shade: 0.4, inkW: 1.3, cast: false, k: 1 });
    f.line([X(-6, 10), X(-2, 0), X(4, -6), X(2, -14)], 1.6, '#3a5a2a', { op: 0.9 }); // kelp thread
    f.flat(ell(X(-6, -10), 5, 3, -0.5, 8), '#c8e0f0', { op: 0.75 }); // highlight
    f.flat([X(2, 20), X(6, 20), X(4, 32)], '#2e5a86'); f.flat(ell(X(4, 38), 2.4, 3.2, 0, 6), '#5a8ab0');
    f.line(ell(X(0, 0), 22, 22, 0, 16).slice(2, 7), 1, '#8ab0c8', { op: 0.5 }); // meniscus
  } else if (el === 'toxin') {
    // ripens and rots: a swollen spore pod splitting open, mould bloom on its skin, a slow drip of sap
    glow('#8a9a3a', 36, 0.14);
    f.part([X(-14, 18), X(-16, 0), X(-8, -18), X(4, -24), X(14, -10), X(14, 8), X(6, 20)], { fill: '#6a7a2e', shade: 0.45, inkW: 1.3, cast: false, tex: 'mottle' + s, texOp: 0.6 });
    f.flat([X(-2, -20), X(4, -6), X(2, 8), X(-4, -6)], '#2a2a10'); // split
    for (const [dx, dy, r] of [[-8, 2, 4], [8, -4, 3], [-4, 12, 3], [6, 10, 2.4]]) { f.flat(ell(X(dx, dy), r, r, 0, 8), '#c8c48a', { op: 0.8 }); f.flat(ell(X(dx, dy), r * 0.4, r * 0.4, 0, 6), '#4a4a1a'); } // pustules
    for (let i = 0; i < 5; i++) f.flat(ell(X(-10 + i * 6, -30 - (i % 2) * 6), 1.6, 1.6, 0, 6), '#a8a868', { op: 0.75 }); // spores
    f.flat([X(4, 20), X(8, 20), X(6, 34)], '#8a8a3a');
  } else if (el === 'void') {
    // unmakes: a clean-rimmed hole in the air; nothing glows, the ring of course dots bends toward it
    f.flat(ell(X(0, -2), 17, 17, 0, 20), '#050407');
    f.line(ell(X(0, -2), 18, 18, 0, 20).concat([ell(X(0, -2), 18, 18, 0, 20)[0]]), 1.2, '#d8d0e0', { op: 0.85 });
    f.line(ell(X(0, -2), 24, 24, 0, 20).slice(0, 9), 0.9, '#4a2a5c', { op: 0.6, dash: '2 3' }); // edge thinning into nothing
    for (const [dx, dy] of [[-26, -14], [24, 10], [-14, 22]]) f.line([X(dx, dy), X(dx * 0.75, dy * 0.75)], 1, '#4a2a5c', { straight: true, op: 0.7 }); // matter drawn in
    f.flat(ell(X(-6, -10), 4, 2.4, -0.6, 8), '#1a1420'); // the page's corner, missing
  }
  const k = COURSES.indexOf(el);
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + Math.PI / 6 + i * Math.PI / 3, pull = el === 'void' ? 0.8 : 1, q = add(fx, [Math.cos(a) * 46 * pull, Math.sin(a) * 34 * pull - 2]);
    const r = i === k ? 5 : 3;
    if (i === k) f.raw(`<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="${ink6[i]}" opacity="0.3" filter="url(#soft${s})"/>`);
    f.flat(ell(q, r, r, 0, 8), ink6[i]);
  }
}

// ------------------------------------------------------------------ ELEMENTALIST
// The burnt-out scholar: hunched, book clutched, stained hand cupping a guttering sign. Obsessed.
function elementalist(el = 'fire') {
  const f = new Fig(base(13));
  const H = 94;
  const wool = '#7c705d', woolD = '#5f5546', leather = '#4b3322', skin = '#c4a184', ink6 = ['#b8341f', '#8fb2c9', '#c9a43a', '#2f4f8f', '#7d9a3a', '#4b2a5c'];
  const N = [312, 280], C = [256, 362], P = [266, 486];
  const S = B.spine(N, C, P, H);
  const SN = S.at(-0.25, 0.14), SF = S.at(0.42, 0.12);
  const EN = [317, 395], WN = [368, 318];  // near forearm raised so the hand cups the flame
  const EF = [350, 425], WF = [396, 416];  // far elbow at the side, forearm forward under the book
  const AF = [356, 752], AN = [214, 754], KF = [326, 628], KN = [228, 630], HF = S.at(0.3, 1.0), HN = S.at(-0.2, 1.0); // legs under the robe
  const WB = S.at(0, 0.82), dW = S.T(0.82); // waist, on the rope belt

  // skeleton: pelvis is the root; the robe is cut at the belt into the torso and a swinging skirt
  f.joint('pelvis', P).joint('torso', S.at(0, 0.85), 'pelvis').joint('head', S.at(0.15, -0.05), 'torso');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('book', [412, 410], 'hand_f');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('sign', [394, 270], 'hand_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('skirt', WB, 'pelvis').joint('satchel', [268, 568], 'torso');

  // far arm (under the book)
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 36, 30), { fill: woolD, tex: 'weave13' });
  // feet under the robe, mid-stride
  f.bone('foot_f');
  B.boot(f, AF, 1, 44, '#3d2d1f', { shaft: 0.3, toe: 1.15, strap: true });
  f.bone('foot_n');
  B.boot(f, AN, 1, 44, '#35271b', { shaft: 0.3, toe: 1.15 });
  // robe: heavy, dragging, inked hem
  const robe = [...S.shape([[-0.05, 0.36, 0.34], [0.08, 0.66, 0.5], [0.3, 0.7, 0.72], [0.6, 0.66, 0.72], [0.9, 0.78, 0.74]]).slice(0, 5),
    [392, 560], [418, 690], [408, 748, 1], [380, 740], [350, 756, 1], [310, 742], [270, 760, 1], [230, 744], [186, 758, 1], [168, 690], [184, 560], ...S.shape([[-0.05, 0.36, 0.34], [0.08, 0.66, 0.5], [0.3, 0.7, 0.72], [0.6, 0.66, 0.72], [0.9, 0.78, 0.74]]).slice(5)];
  // one robe shape, cut at the belt: the skirt copy reaches up under the torso copy, the torso copy stops under the belt
  split(f, () => f.part(robe, { fill: wool, tex: 'weave13', texOp: 0.5 }), [['skirt', side(S.at(0, 0.66), dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('skirt');
  // folds
  for (const [a, b2, c] of [[[300, 520], [320, 640], [312, 740]], [[250, 540], [232, 650], [236, 740]], [[350, 560], [378, 660], [386, 740]], [[205, 600], [198, 700], [192, 750]]]) f.line([a, b2, c], 1.5, INK, { op: 0.65 });
  // inked course sigils in a ring around the hem
  for (let i = 0; i < 6; i++) {
    const x = 194 + i * 37, y = 722 - (i % 2) * 6;
    const ring = ell([x, y], 8, 8, 0, 9).concat([ell([x, y], 8, 8, 0, 9)[0]]);
    f.line(ring, 3.6, '#a89c84', { op: 0.35 });
    f.line(ring, 2, i === 5 ? '#5e3a74' : ink6[i], { op: 0.95 });
    f.line([[x - 6, y + 6], [x + 6, y - 6]], 1.6, i === 5 ? '#5e3a74' : ink6[i], { straight: true });
  }
  f.line([[180, 712], [400, 700]], 1.2, '#2a2016', { op: 0.6 });
  f.line([[176, 742], [404, 730]], 1.2, '#2a2016', { op: 0.6 });
  // mud and wet at the hem
  f.flat([[170, 730], [410, 716], [412, 750], [170, 760]], '#1e160d', { op: 0.45 });
  // rope belt with the six-sign ring, satchel of scrolls on the hip
  // rope belt: hard-cornered band that sags at the front, knotted, frayed ends hanging
  f.bone('torso');
  const belt = [[-0.8, 0.775], [-0.4, 0.79], [0.0, 0.8], [0.4, 0.8], [0.76, 0.785], [0.76, 0.845], [0.4, 0.86], [0.0, 0.86], [-0.4, 0.85], [-0.81, 0.835]].map(([u, v]) => S.at(u, v));
  f.part(belt.map((q, i) => (i === 0 || i === 4 || i === 5 || i === 9) ? [...q, 1] : q), { fill: '#8a7552', shade: 0.4, tex: 'hatch13', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 14; i++) f.line([S.at(-0.76 + i * 0.11, 0.785), S.at(-0.71 + i * 0.11, 0.85)], 1, INK, { op: 0.55, straight: true });
  const kn = S.at(0.42, 0.83);
  f.part(ell(kn, 9, 8, 0.3, 10), { fill: '#7c6848', shade: 0.45, tex: 'hatch13', texOp: 0.5 });
  f.stroke([add(kn, [-2, 4]), add(kn, [-8, 40]), add(kn, [-4, 84])], 6, '#7c6848');
  f.stroke([add(kn, [3, 4]), add(kn, [8, 34]), add(kn, [12, 66])], 5.5, '#6e5c3e');
  for (const e of [add(kn, [-4, 84]), add(kn, [12, 66])]) for (let k = -1; k <= 1; k++) f.line([e, add(e, [k * 3, 9])], 1, '#8a7552');
  f.line([S.at(0.2, 0.84), [300, 560], [296, 600]], 2.2, '#8a7552');
  f.part(ell([296, 616], 16, 16, 0, 14), { fill: '#a5713a', shade: 0.5, inkW: 1.3 });
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; f.part(ell(add([296, 616], [Math.cos(a) * 12, Math.sin(a) * 12]), 3, 3, 0, 6), { fill: ink6[i], shade: 0.3, inkW: 0.8 }); }
  f.part(ell([296, 616], 6, 6, 0, 8), { fill: '#6b4520', shade: 0.4, inkW: 1 });
  // satchel strap: over the far shoulder, across the chest, down the hip to the bag's front ring
  const strap = [S.at(0.35, 0.05), S.at(-0.2, 0.4), S.at(-0.72, 0.8), [262, 540], [268, 568]];
  f.line(strap, 6, '#3a2618');
  f.line(strap, 1, '#7a5a3a', { op: 0.6, dash: '3 3' });
  f.bone('satchel');
  f.line([[176, 572], [180, 530], S.at(-0.86, 0.88)], 6, '#2e1e12'); // the other end, coming round the back
  f.bone('torso');
  // rubric strip knotted round the strap at the chest
  const rk = [212, 468];
  f.part([add(rk, [-7, -6]), add(rk, [7, -9]), add(rk, [8, 4]), add(rk, [-6, 7])], { fill: '#8e1f17', shade: 0.4, inkW: 1.1, cast: false });
  f.part([add(rk, [-2, 4]), add(rk, [-10, 34]), add(rk, [-4, 38]), add(rk, [4, 6])], { fill: '#8e1f17', shade: 0.4, inkW: 1.1 });
  f.part([add(rk, [3, 4]), add(rk, [10, 26]), add(rk, [15, 24]), add(rk, [7, 3])], { fill: '#6e1610', shade: 0.4, inkW: 1.1 });
  // scroll ends sticking out
  f.bone('satchel');
  for (let i = 0; i < 4; i++) f.part(limb([172 + i * 14, 545 - i * 3], [184 + i * 12, 600], 13, 13, { steps: 4 }), { fill: '#d1c09a', shade: 0.4, inkW: 1.1 });
  f.part([[140, 570], [240, 566], [246, 650], [232, 666], [150, 668], [136, 650]].map(q => add(q, [22, 0])), { fill: leather, shade: 0.45, tex: 'mottle13', k: 0.6 });
  f.part([[136, 566], [244, 562], [240, 610], [190, 622], [140, 606]].map(q => add(q, [22, 0])), { fill: '#3e2a1b', shade: 0.4, k: 0.6 });
  f.rivet([212, 612], 3, '#a08a5a');
  f.part([[260, 562], [276, 562], [276, 578], [260, 578]], { fill: '#6a5a3a', shade: 0.3, inkW: 1, cast: false }); // strap ring
  // ostium badge hung from the belt beside the ring
  f.bone('torso');
  f.line([S.at(-0.28, 0.85), S.at(-0.26, 0.92)], 1.2, '#2b2119');
  G.badge(f, S.at(-0.26, 0.92), 10, '#74777b', -0.06);
  f.bone('satchel');
  f.stitches([[168, 650], [258, 648]]);
  f.spatter([232, 640], 18, 6, '#2f4f8f');

  // hood down on the back + head in a scholar's coif
  f.bone('torso');
  f.part([S.at(-0.55, -0.12), S.at(-0.1, -0.16), S.at(0.45, -0.04), S.at(0.55, 0.14), S.at(0.3, 0.24, ), S.at(0.0, 0.2), S.at(-0.4, 0.34), S.at(-0.78, 0.3), S.at(-0.85, 0.1)], { fill: woolD, tex: 'weave13', k: 0.7 });
  f.stroke([S.at(-0.5, 0.0), S.at(-0.3, 0.12), S.at(-0.2, 0.28)], 2.2);
  f.stroke([S.at(0.0, -0.05), S.at(0.15, 0.08), S.at(0.25, 0.2)], 2);
  const HC = [338, 232], hA = 0.4; // bowed toward the flame he is staring into
  f.bone('head');
  f.part(limb(S.at(0.15, -0.05), add(HC, [-6, 28]), 26, 24), { fill: skin, shade: 0.5 });
  B.head(f, HC, H, hA, {
    skin, jaw: 0.92, chin: -0.01, nose: 1.12, hook: 0.3, mouth: 'set', squint: 0.05, browDown: -0.02, gaunt: true, age: true, glint: true,
    iris: '#2a1d10', hairCol: '#8a8170', beard: 'stubble', beardCol: '#6a6258', browCol: '#5a544a', noEar: true,
    hair: [[-0.42, 0.0], [-0.38, -0.36], [-0.14, -0.57], [0.14, -0.57], [0.33, -0.42], [0.31, -0.3], [0.12, -0.36], [0.0, -0.3], [-0.06, -0.12], [-0.04, 0.12], [-0.02, 0.36], [-0.12, 0.42], [-0.3, 0.36], [-0.42, 0.2]],
  });
  const cF = frame(HC, hA, H);
  f.line(cF([[-0.15, -0.55], [-0.2, -0.2], [-0.24, 0.3]]), 1.2, INK, { op: 0.6 }); // coif seam
  f.stitches(cF([[-0.13, -0.5], [-0.17, -0.2], [-0.21, 0.28]]), '#d8cbb0', 0.8);
  for (const l of [[[0.02, -0.33], [0.1, -0.24], [0.06, -0.14]], [[-0.02, -0.28], [0.04, -0.16], [0.0, -0.06]]]) f.line(cF(l), 1.1, '#9a948a', { op: 0.85 }); // grey strands escaping
  f.flat(cF(ell([0.02, 0.2], 0.06, 0.05, 0.2, 8)), '#3a1d24', { op: 0.3 }); // ink thumbprint on the linen
  // coif ties knotted under the jaw
  f.stroke(cF([[-0.06, 0.38], [0.04, 0.52], [0.1, 0.6]]), 3.4, '#8a8170');
  f.stroke(cF([[0.08, 0.56], [0.06, 0.72], [0.0, 0.82]]), 3, '#7a7262');
  // ink smear on the cheek, dark rings under the eyes
  f.flat(cF(ell([0.12, 0.03], 0.07, 0.025, 0.1, 8)), '#3a1d24', { op: 0.35 });
  f.line(cF([[0.08, 0.13], [0.2, 0.17]]), 2, '#2f4f8f', { op: 0.7 });

  // far forearm coming forward from the side to carry the book
  f.bone('forearm_f');
  f.part(limb(EF, WF, 32, 24, { folds: [[0.3, 'q', 0.25]] }), { fill: woolD, tex: 'weave13' });
  f.part(limb(lp(EF, WF, 0.7), add(WF, [2, -1]), 18, 16), { fill: mix(skin, '#2f4f8f', 0.25), shade: 0.45, tex: 'mottle13', cast: false });
  // book: held open toward his own face. From our side we see the back of the near cover, the spine
  // turned toward us with its raised bands, the fore-edge of the pages and a sliver of the far cover.
  const sT = [420, 312], sB = [432, 398];           // spine, top and bottom
  f.bone('book');
  const cT = [380, 322], cB = [390, 406];           // outer edge of the near cover (toward his face)
  f.part([[360, 330], [374, 324], [384, 408], [370, 412]], { fill: '#3a1a10', sharp: true, inkW: 1.3 }); // far cover, peeking
  f.part([[372, 324], [384, 320], [394, 406], [382, 408]], { fill: '#dccaa0', sharp: true, shade: 0.25, inkW: 1.2 }); // fore-edge of the pages
  for (let k = 1; k < 4; k++) f.line([[372 + k * 3, 324 - k], [382 + k * 3, 408 - k * 0.5]], 0.8, '#7a6a48', { op: 0.75, straight: true });
  f.part([[374, 318], [416, 308], [422, 314], [384, 322]], { fill: '#e4d6b0', sharp: true, shade: 0.2, inkW: 1.1 }); // top edge of the page block
  f.part([cT, sT, sB, cB], { fill: '#5a2a1c', sharp: true, tex: 'mottle13', shade: 0.4 }); // back of the near cover
  f.line([add(cT, [6, 6]), add(sT, [-6, 6]), add(sB, [-6, -6]), add(cB, [6, -6]), add(cT, [6, 6])], 1.1, '#2a120a', { straight: true, op: 0.8 }); // tooled border
  f.flat(ell(lerp(lerp(cT, sT, 0.5), lerp(cB, sB, 0.5), 0.5), 9, 12, 0.12, 10), '#3a160c', { op: 0.7 }); // worn blind-stamped boss
  for (const c of [cT, cB]) f.part([c, add(c, [10, -2]), add(c, [11, c === cT ? 10 : -10]), add(c, [1, c === cT ? 12 : -12])], { fill: '#6e6a62', sharp: true, inkW: 1 }); // iron corner fittings
  f.part([sT, [430, 314], [442, 396], sB], { fill: '#4a2216', sharp: true, shade: 0.35, inkW: 1.3 }); // spine, rounded toward us
  for (let k = 0; k < 4; k++) { const a = lerp(sT, sB, 0.15 + k * 0.23); f.line([a, add(a, [11, 1])], 2.4, '#2a120a', { straight: true }); } // raised bands
  f.line([[386, 322], [380, 352], [386, 376], [380, 398]], 2, '#b8341f'); // ribbon marker trailing from the pages
  if (el === 'fire' || el === 'lightning') f.part([[384, 318], [396, 284], [410, 278], [404, 314]], { fill: '#e6d9b8', shade: 0.3, inkW: 1 }); // a page lifting in the heat (only when there is heat)
  // far hand under the book: palm up along the bottom edge, stained fingertips curling up round the foot of the spine
  f.bone('hand_f');
  B.hand(f, [412, 414], -0.22, 20, skin, { spread: 0.15, curl: -0.55, tipCols: [ink6[3], ink6[4], ink6[5], ink6[5]] });

  // near arm: sleeve rolled back, hand cupping the guttering sign
  f.bone('upperarm_n');
  f.part(limb(SN, EN, 40, 36, { p: [[0.5, 0.18, 0.2]], q: [[0.3, 0.1, 0.2]], folds: [[0.85, 'q', 0.3], [0.45, 'p', 0.2]] }), { fill: wool, tex: 'weave13' });
  f.stroke([lp(SN, EN, 0.6, -14), lp(SN, EN, 0.72, -2), lp(SN, EN, 0.86, 8)], 2);
  // bell sleeve: top edge along the forearm, wide mouth at the wrist, a heavy droop of wool underneath
  f.bone('forearm_n');
  const sleeve = [lp(EN, WN, -0.08, 18), lp(EN, WN, 0.4, 19), lp(EN, WN, 0.78, 21), [WN[0] - 10, WN[1] - 20, 1], [WN[0] - 4, WN[1] + 4], [WN[0] - 14, WN[1] + 36], [WN[0] - 26, WN[1] + 66, 1], [WN[0] - 52, WN[1] + 72], [EN[0] + 26, EN[1] + 44], [EN[0] - 2, EN[1] + 20], lp(EN, WN, -0.12, -14)];
  f.part(sleeve, { fill: wool, tex: 'weave13', k: 0.8 });
  f.flat([[WN[0] - 10, WN[1] - 16], [WN[0] - 5, WN[1] + 4], [WN[0] - 14, WN[1] + 32], [WN[0] - 20, WN[1] + 10]], '#1a1410', { op: 0.85 }); // dark sleeve mouth
  f.stroke([[EN[0] + 20, EN[1] + 12], [EN[0] + 46, EN[1] + 40], [WN[0] - 40, WN[1] + 62]], 2.2);
  f.stroke([[EN[0] + 40, EN[1] + 4], [WN[0] - 36, WN[1] + 22], [WN[0] - 28, WN[1] + 50]], 1.8);
  f.line([[WN[0] - 50, WN[1] + 70], [WN[0] - 28, WN[1] + 64]], 1, '#cfc3a8', { op: 0.5, dash: '2 2' }); // frayed hem
  f.flat(ell([WN[0] - 30, WN[1] + 46], 7, 4, 0.4, 8), '#2f4f8f', { op: 0.5 }); // ink wiped on the sleeve
  f.part(limb(lp(EN, WN, 0.82), WN, 20, 18), { fill: mix(skin, '#2f4f8f', 0.35), shade: 0.45, tex: 'mottle13', cast: false }); // ink-stained wrist
  // the sign above the palm: its form follows the course he is attuned to (fire, frost, lightning, water, toxin, void)
  f.bone('sign'); // its own bone, so the game can swap the attuned course's sign and spin it
  sign(f, [394, 270], el, ink6);
  f.bone('hand_n');
  B.hand(f, WN, -0.78, 24, skin, { spread: 0.45, curl: 0.5, fingerCols: [mix(skin, ink6[0], 0.5), mix(skin, ink6[1], 0.5), mix(skin, ink6[2], 0.5), mix(skin, ink6[3], 0.5)], tipCols: [ink6[0], ink6[1], ink6[2], ink6[3]], thumbTip: ink6[4] });
  return f;
}

module.exports = {
  heroes: [{ key: 'bulwark', build: bulwark }, { key: 'duelist', build: duelist }, { key: 'elementalist', build: elementalist }],
  signs: COURSES.map(el => ({ key: 'elementalist_' + el, build: () => elementalist(el) })),
  split, side, // rig helpers, shared with dirAC2.js
  scene: (W, H) => `<defs><radialGradient id="sky" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="#3a3026"/><stop offset="1" stop-color="#0d0b0a"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#sky)"/><rect y="${H - 60}" width="${W}" height="60" fill="#0f0c0a"/>`,
};
