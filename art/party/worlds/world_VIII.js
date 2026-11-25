// World VIII, The Sundered Rime (Fire + Frost, Thermal Shock): every creature in the world's bible file.
// A northern hold of miners and shieldmaidens on a glacier; the miners dug down and met fire coming up. Every body is
// split, one side rimed white, the other charred with glowing orange seams, and the line between them cracking. The
// split falls in a different place on each creature so the cast does not read as one half-and-half gimmick:
//   Riven Jarl     left / right, exactly down the middle (the bible's entry)
//   Jotun Thane    diagonal: the frozen back and shoulders above, the heat from the deep blistering him from below
//   Seeress        two faces front and back, the robe split on a diagonal running the other way
//   Thrall         front / back (front burned where the fire met him, back rimed), along every limb
//   Magma Hound    top / bottom: frost forming on the back as it cools, molten belly and jaws
//   Shieldmaiden   per limb: shield arm and leading leg rimed, spear arm and back leg charred, a crack across the chest
//   Steam Wraith   inside / outside: a hot core showing through, the edges condensing into rime and icicles
//   Fissure Worm   along its length: the reared head end rimed, the body melting out of the crack glowing
// Drawn facing right with kit.foeBase (light from the upper right) and flipped, so foes face left lit from the upper
// left. Built for the rig: joints first, f.bone() before every part, parts drawn complete, overlaps at every joint.
'use strict';
const K = require('../kit');
const V = require('./kit_VIII');
const VB = require('./kit_VIII_b'); // final pass: hank and fur-clump helpers for the Thane's pelt
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P } = V;

// a front/back split along one part's axis: the line runs from a to b (extended), the ice goes on the side toward
// `back` (a screen vector), the char on the other.
function axisSplit(f, a, b, back, amp = 6, ext = 80, step = 15) {
  const d = E.norm(sub(b, a)), line = V.jag(f, [add(a, mul(d, -ext)), add(b, mul(d, ext))], amp, step), n = [d[1], -d[0]];
  return { line, ice: (n[0] * back[0] + n[1] * back[1]) > 0 ? 1 : -1, dir: E.norm(back) };
}

// ------------------------------------------------------------------ RIMEBURNT THRALL (cast, human 1.0)
// A glacier miner who dug too deep and met the fire coming up: burned black on the front where it met him, rimed white
// on the back where the ice kept what the fire left. He trudges stooped under the pick on his shoulder, the hunch of a
// man who spent his life bent in a gallery; the far arm hangs frozen half-clenched. Split: front / back along every part.
// Rig: standard humanoid + pick (on hand_n) + rope (coil on the back).
function thrall() {
  const CW = TIERS.human[0], CH = TIERS.human[1];
  const f = new Fig(V.base(803, CH)); V.textures(f);
  const gy = f.o.groundY, H = 96, back = [-1, 0.1];
  const N = [296, 300], C = [252, 384], Pv = [276, 486];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.15, 0.12), SF = S.at(0.42, 0.1);
  const HN = S.at(-0.25, 1.0), HF = S.at(0.3, 0.98);
  const KN = [236, 628], AN = [212, 748], KF = [350, 616], AF = [356, 748];
  const WN = [344, 372], EN = [300, 440];
  const EF = [348, 424], WF = [364, 506];
  const HC = [334, 236], hA = 0.18;
  const hd = E.norm([-0.82, -0.5]), hEnd = add(WN, mul(hd, -46)), hTop = add(WN, mul(hd, 214)), pA = Math.atan2(hd[1], hd[0]);
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.85), N: S.at(0.2, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('pick', WN, 'hand_n').joint('rope', S.at(-0.7, 0.3), 'torso');
  const SKIl = V.SKI(f), SKCl = V.SKC(f, { fill: '#45372f' });
  const LEAl = V.LEA(f), WOOLl = V.WOOL(f, { fill: '#5e5a52' });

  // ---- far arm (behind the torso): wool sleeve to the elbow, burned bare forearm, hand frozen half-clenched
  const SpFA = axisSplit(f, SF, WF, back, 9, 80, 9);
  V.armRig(f, SF, EF, WF, [40, 36, 30], () => {
    V.thermal(f, K.chain([SF, EF, lerp(EF, WF, 0.22)], [42, 38, 34], { bp: [[0, 0.4, 0.1]] }), SpFA, V.rimed(WOOLl), V.charred(WOOLl, 0.45), { riftW: 2, faint: true });
    V.thermal(f, K.chain([lerp(EF, WF, 0.18), lerp(EF, WF, 0.45), WF], [34, 32, 26], { bq: [[0, 0.5, 0.18]], bp: [[0, 0.3, 0.1]] }), SpFA, SKIl, SKCl, { riftW: 2, faint: true });
    f.part(ell(lerp(EF, WF, 0.2), 19, 7, V.ang(EF, WF) + Math.PI / 2, 12), V.charred(WOOLl, 0.5)); // ragged sleeve end
  }, '_f');
  f.bone('hand_f');
  V.clawHand(f, add(WF, [0, -4]), Math.PI / 2 - 0.1, 60, { look: SKCl, curl: [0.9, 0.8, 0.75, 0.6], spread: 0.08, thumbAng: 0.6, flip: true });
  V.seam(f, [add(WF, [-6, 10]), add(WF, [0, 22]), add(WF, [-4, 34])], 1.6);

  // ---- far leg, forward: wool breeches to the knee, wrapped shin, miner's boot with crampon
  const legSet = (Hp, Kn, A, sfx, shade) => {
    const SpT = axisSplit(f, Hp, Kn, back, 9, 80, 9), SpS = axisSplit(f, Kn, A, back, 9, 80, 9);
    V.legRig(f, Hp, Kn, A, 50, () => {
      V.thermal(f, K.chain([Hp, lerp(Hp, Kn, 0.45), Kn, lerp(Kn, A, 0.2)], [70, 66, 50, 48], { bp: [[0, 0.6, 0.1], [1, 0.3, 0.06]], bq: [[0, 0.7, 0.14], [1, 0.2, 0.08]] }), SpT, V.rimed(WOOLl), V.charred(WOOLl, 0.5 + shade), { riftW: 2.2, faint: true });
      f.stroke([lp(Hp, Kn, 0.82, 16), lp(Hp, Kn, 0.95, 2), lp(Kn, A, 0.12, -14)], 2); // knee crease
      V.thermal(f, K.chain([lerp(Kn, A, 0.12), lerp(Kn, A, 0.38), lerp(Kn, A, 0.92)], [48, 50, 34], { bp: [[0, 0.7, 0.2], [1, 0.1, 0.16]], bq: [[1, 0.2, 0.05]] }), SpS, V.rimed(LEAl, 0.4), V.charred(LEAl, 0.45), { riftW: 2, faint: true });
      for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.12; f.line([lp(Kn, A, t, 22), lp(Kn, A, t + 0.06, -22)], 1.6, INK, { op: 0.55 }); } // leg wraps
      // leather knee pad strapped on
      const kd = E.norm(sub(A, Kn)), KP = (u, v) => add(add(Kn, mul(kd, u)), mul([kd[1], -kd[0]], v)); // u down the shin, v toward the front
      f.part([KP(-30, 4), KP(-34, 16), KP(-22, 30), KP(4, 31), KP(24, 26), KP(30, 14), KP(26, 2), KP(-6, -2)], V.charred(LEAl, 0.3));
      f.line([KP(-24, 8), KP(-26, 18), KP(-16, 26), KP(2, 27), KP(20, 23)], 0.9, '#b8a890', { op: 0.6, dash: '2 2' });
      f.line([KP(-14, -18), KP(-12, 30)], 3, P.leathD); f.line([KP(14, -22), KP(16, 30)], 3, P.leathD); // straps round the knee
      f.part([KP(-16, 22), KP(-8, 22), KP(-8, 30), KP(-16, 30)], { fill: P.ironL, shade: 0.3, inkW: 1, cast: false, sharp: true });
    }, sfx);
    V.footRig(f, Kn, A, 52, () => {
      V.sides(f, SpS, () => B.boot(f, A, 1, 52, mix(P.leath, P.ice, 0.4), { shaft: 0.55, strap: true, tex: 'rime' + f.o.seed, texOp: 0.6 }), () => B.boot(f, A, 1, 52, mix(P.leath, P.char, 0.5), { shaft: 0.55, strap: true, tex: 'craze' + f.o.seed, texOp: 0.6 }));
      // crampon: an iron frame under the sole, teeth biting into the ice, a strap over the instep
      const X = u => A[0] + u * 52;
      f.part([[X(-0.44), gy - 7], [X(1.22), gy - 8], [X(1.24), gy - 3], [X(-0.46), gy - 2]], { fill: P.iron, shadow: '#141212', shade: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, sharp: true });
      for (let i = 0; i < 6; i++) { const x = X(-0.36 + i * 0.3); f.part([[x - 4, gy - 3], [x + 4, gy - 3], [x + 1, gy + 6, 1]], { fill: P.ironL, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false }); }
      f.part([[X(0.95), gy - 12], [X(1.3), gy - 16], [X(1.32), gy - 10], [X(1.0), gy - 6]], { fill: P.ironL, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false }); // front points
      f.line([[X(0.0), gy - 6], [X(0.18), A[1] + 8], [X(0.5), A[1] + 4]], 3, P.leathD);
      V.rimeCrust(f, [[X(-0.42), gy - 30], [X(-0.38), A[1] + 4], [X(-0.3), A[1] - 18]], 6, [-1, 0], { gap: 6 });
      V.embers(f, [X(0.9), gy - 18], 12, 6, 3);
    }, sfx);
  };
  legSet(HF, KF, AF, '_f', 0.1);

  // ---- coil of safety rope slung on the back, rimed and hung with icicles
  f.bone('rope');
  const rc = S.at(-0.82, 0.42);
  for (let i = 0; i < 4; i++) { const e = ell(add(rc, [i * 3, i * 2]), 34 - i * 1.5, 50 - i * 2, 0.3, 22); V.rope(f, e.concat([e[0]]), 6, { col: mix('#6a5e48', P.ice, 0.15) }); }
  V.rimeCrust(f, ell(rc, 36, 52, 0.3, 22).slice(10, 16), 6, [-1, 0.1], { gap: 7 });
  V.icicles(f, ell(add(rc, [4, 8]), 36, 50, 0.3, 22).slice(3, 7), 5, 8, 20);

  // ---- near leg, back and straight: it carries the weight
  legSet(HN, KN, AN, '_n', 0);

  // ---- torso: wool shirt under a leather jerkin, hunched over a sunken chest
  f.bone('torso');
  const SpT = { line: V.jag(f, [S.at(-0.05, -0.6), S.at(-0.1, 0.1), S.at(-0.25, 0.45), S.at(-0.2, 0.75), S.at(-0.3, 1.0), S.at(-0.2, 1.4)], 7, 14), ice: 0, dir: back };
  SpT.ice = 1; { const d = E.norm(sub(SpT.line[SpT.line.length - 1], SpT.line[0])), n = [d[1], -d[0]]; SpT.ice = (n[0] * back[0] + n[1] * back[1]) > 0 ? 1 : -1; }
  const torso = S.shape([[-0.06, 0.34, 0.32], [0.06, 0.72, 0.5], [0.22, 0.86, 0.66], [0.42, 0.8, 0.62], [0.62, 0.7, 0.6], [0.82, 0.72, 0.62], [1.0, 0.76, 0.6], [1.1, 0.6, 0.45]]);
  V.thermal(f, torso, SpT, V.rimed(WOOLl), V.charred(WOOLl, 0.55), { riftW: 2.4 });
  // leather jerkin, open at the front, laced
  const jer = S.shape([[0.04, 0.74, 0.3], [0.22, 0.9, 0.48], [0.45, 0.84, 0.4], [0.7, 0.76, 0.42], [0.92, 0.8, 0.46], [1.04, 0.82, 0.4]]);
  V.thermal(f, jer, SpT, V.rimed(LEAl, 0.45), V.charred(LEAl, 0.5), { riftW: 2.6, charAfter: () => { V.crackNet(f, S.at(0.3, 0.3), 1.5, 70, 2.4, { depth: 2 }); V.flakes(f, S.at(0.36, 0.6), 18, 30, 6); } });
  for (let i = 0; i < 5; i++) f.line([S.at(0.38, 0.28 + i * 0.12), S.at(0.5, 0.33 + i * 0.12)], 1.6, P.leathD); // lacing
  f.line([S.at(0.42, 0.2), S.at(0.44, 0.6), S.at(0.38, 0.98)], 1.6, INK, { op: 0.7 });
  f.stitches([S.at(-0.6, 0.2), S.at(-0.72, 0.55), S.at(-0.74, 0.95)], '#c8c0b0', 0.9);
  f.part([S.at(-0.55, 0.52), S.at(-0.2, 0.5), S.at(-0.18, 0.7), S.at(-0.56, 0.72)], V.rimed(LEAl, 0.55)); // patch
  f.stitches([S.at(-0.55, 0.52), S.at(-0.2, 0.5), S.at(-0.18, 0.7), S.at(-0.56, 0.72), S.at(-0.55, 0.52)], '#d8d0c0', 0.8);
  V.icicles(f, [S.at(-0.8, 1.04), S.at(-0.4, 1.06), S.at(-0.05, 1.05)], 5, 8, 20);
  V.steam(f, S.at(0.2, 0.2), 90, 16, { sway: 10, phase: 1 });
  // belt: iron wedges, a stone hammer in a loop, an ore pouch, a dead lamp hanging frozen
  f.bone('pelvis');
  f.part([S.at(-0.78, 0.9), S.at(0.62, 0.88), S.at(0.64, 0.97), S.at(-0.8, 0.99)], { fill: P.leathD, shade: 0.4, sharp: true, tex: 'craze803', texOp: 0.3 });
  f.part([S.at(0.2, 0.88), S.at(0.34, 0.88), S.at(0.34, 0.98), S.at(0.2, 0.98)], { fill: P.ironL, shade: 0.3, inkW: 1.1, sharp: true });
  for (const u of [0.48, 0.56]) f.part([S.at(u, 0.92), S.at(u + 0.06, 0.92), S.at(u + 0.04, 1.18), S.at(u + 0.02, 1.2)], { fill: P.iron, shade: 0.4, inkW: 1.1, cast: false }); // iron wedges
  f.part([S.at(-0.5, 0.96), S.at(-0.18, 0.97), S.at(-0.16, 1.2), S.at(-0.48, 1.22)], V.rimed(LEAl, 0.4)); // ore pouch
  f.part([S.at(-0.52, 0.95), S.at(-0.16, 0.96), S.at(-0.18, 1.04), S.at(-0.5, 1.04)], V.rimed(LEAl, 0.55));
  V.icicles(f, [S.at(-0.48, 1.22), S.at(-0.18, 1.2)], 3, 6, 14);
  const lampTop = S.at(-0.05, 0.98);
  f.line([lampTop, add(lampTop, [-2, 22])], 1.6, P.iron);
  const lc = add(lampTop, [-2, 44]);
  f.part([add(lc, [-10, -20]), add(lc, [10, -20]), add(lc, [12, 18]), add(lc, [-12, 18])], { fill: P.iron, shade: 0.4, inkW: 1.2, sharp: true });
  f.flat([add(lc, [-7, -14]), add(lc, [7, -14]), add(lc, [8, 12]), add(lc, [-8, 12])], P.glass, { op: 0.6 }); // frosted glass, the flame long dead
  f.line([add(lc, [-11, -2]), add(lc, [11, -2])], 1.4, P.iron);
  V.icicle(f, add(lc, [0, 18]), 14, 4);
  G.badge; // (no ostium badge on foes)

  // ---- head: the miner's leather hood, the face burned black, one dull ember of an eye
  f.bone('head');
  f.part(limb(S.at(0.2, -0.05), add(HC, [-8, 32]), 40, 36), SKCl); // neck
  const hF = frame(HC, hA, H);
  const SpH = { line: V.jag(f, [hF([[-0.02, -1.0]])[0], hF([[-0.08, -0.2]])[0], hF([[-0.12, 0.4]])[0], hF([[-0.1, 1.2]])[0]], 3, 10), ice: 0, dir: back };
  { const d = E.norm(sub(SpH.line[SpH.line.length - 1], SpH.line[0])), n = [d[1], -d[0]]; SpH.ice = (n[0] * back[0] + n[1] * back[1]) > 0 ? 1 : -1; }
  const hp = { skin: '#4a3c34', jaw: 1.1, chin: 0.0, nose: 1.05, hook: 0.1, mouth: 'set', squint: 0.55, browDown: 0.06, age: true, faceShade: 0.82, noEar: true, eyeWhite: '#8a6046', iris: P.lamp, browCol: '#1c1412', hairCol: '#1c1412', beard: 'stubble', beardCol: '#140e0c' };
  B.head(f, HC, H, hA, hp);
  // the burned face: open seams across cheek and brow, the lip split, teeth showing
  V.seam(f, hF([[0.3, 0.02], [0.18, 0.06], [0.08, 0.16], [0.02, 0.3]]), 1.8);
  V.seam(f, hF([[0.22, -0.2], [0.12, -0.22], [0.02, -0.16]]), 1.4);
  V.seam(f, hF([[0.3, 0.29], [0.24, 0.32], [0.18, 0.3]]), 1.2);
  f.flat(hF([[0.19, 0.29], [0.26, 0.285], [0.31, 0.3], [0.29, 0.35], [0.24, 0.37], [0.2, 0.34]]), '#120806'); // slack open mouth, the breath gone
  f.flat(hF([[0.25, 0.29], [0.28, 0.292], [0.275, 0.31], [0.255, 0.308]]), P.boneD); // one tooth
  V.flakes(f, hF([[0.1, 0.42]])[0], 12, 8, 4, 0.8);
  // hood: leather, over the skull and wrapped under the chin, its back rimed
  const hood = hF([[0.34, -0.44], [0.12, -0.62], [-0.22, -0.64], [-0.5, -0.46], [-0.62, -0.1], [-0.6, 0.32], [-0.48, 0.62], [-0.22, 0.74], [0.06, 0.7], [0.24, 0.62], [0.3, 0.54], [0.1, 0.5], [-0.04, 0.3], [-0.08, 0.0], [0.02, -0.28], [0.2, -0.38]]);
  V.thermal(f, hood, SpH, V.rimed(LEAl, 0.55), V.charred(LEAl, 0.45), { riftW: 2, iceAfter: () => V.frostCracks(f, hF([[-0.35, 0.0]])[0], 20, 26, 3) });
  f.part(K.chain(hF([[0.36, -0.42], [0.18, -0.36], [0.0, -0.24], [-0.07, 0.02], [-0.03, 0.3], [0.1, 0.48], [0.3, 0.55]]), [9, 10, 10, 10, 10, 10, 9]), V.charred(LEAl, 0.35)); // rolled rim of the face opening
  f.stitches(hF([[-0.2, -0.6], [-0.42, -0.44], [-0.52, -0.1]]), '#d8d4cc', 0.9);
  V.rimeCrust(f, hF([[-0.22, -0.66], [-0.52, -0.48], [-0.64, -0.1], [-0.62, 0.3]]), 8, [-1, -0.1], { gap: 6 });
  V.icicles(f, hF([[-0.5, 0.64], [-0.22, 0.76], [0.04, 0.72]]), 4, 10, 22);

  // ---- shoulder cape of the hood over the hunch (on the torso, so it stays when the arm lifts)
  f.bone('torso');
  const capeP = [S.at(-0.9, 0.0), S.at(-0.3, -0.12), S.at(0.35, -0.06), S.at(0.62, 0.1), S.at(0.6, 0.24), S.at(0.3, 0.26), S.at(-0.2, 0.32), S.at(-0.7, 0.36), S.at(-0.98, 0.26)];
  V.thermal(f, capeP, SpT, V.rimed(LEAl, 0.6), V.charred(LEAl, 0.5), { riftW: 2.2 });
  f.line([S.at(-0.95, 0.27), S.at(-0.6, 0.34), S.at(-0.2, 0.31)], 1, '#d8d4cc', { op: 0.5, dash: '2 2' });
  V.icicles(f, [S.at(-0.95, 0.28), S.at(-0.6, 0.36), S.at(-0.25, 0.32)], 5, 10, 24);
  V.rimeCrust(f, [S.at(-0.88, 0.0), S.at(-0.4, -0.12), S.at(0.0, -0.1)], 7, [-1, -0.1]);

  // ---- near arm: hand on the pick haft in front of the chest, the haft over the shoulder
  const SpNA = axisSplit(f, SN, EN, back, 9, 80, 9), SpNF = axisSplit(f, EN, WN, back, 9, 80, 9);
  f.bone('pick');
  f.part(limb(hEnd, hTop, 15, 13, { steps: 8 }), Object.assign(V.charred({ fill: P.wood, shadow: P.woodD }, 0.2), { tex: 'wood803', texOp: 0.7 }));
  f.line([lp(hEnd, hTop, 0.05, -4), lp(hEnd, hTop, 0.95, -4)], 1, P.iceL, { op: 0.55, straight: true });
  V.rimeCrust(f, [lp(hEnd, hTop, 0.55, -7), lp(hEnd, hTop, 0.9, -7)], 5, [-0.5, -1]);
  for (const t of [0.16, 0.2, 0.24]) f.line([lp(hEnd, hTop, t, -8), lp(hEnd, hTop, t + 0.015, 8)], 2.4, P.leathD, { straight: true }); // grip wrap
  // the pick head: iron, square to the haft; the forward point still glowing where it last struck fire, the back point iced
  const PH = frame(hTop, pA + Math.PI / 2, 1);
  f.part(PH([[-14, -14], [14, -14], [16, 14], [-16, 14]]), { fill: P.iron, shadow: '#121010', shade: 0.4, inkW: 1.3 }); // eye
  f.part(PH([[-10, -12], [-88, -6], [-122, 2, 1], [-86, 6], [-10, 12]]), { fill: mix(P.iron, P.ice, 0.35), shadow: '#141418', light: P.iceL, shade: 0.4, tex: 'rime803', texOp: 0.7 });
  f.part(PH([[10, -12], [80, -8], [114, -2, 1], [80, 8], [10, 12]]), { fill: mix(P.iron, P.char, 0.4), shadow: '#100a08', shade: 0.4, tex: 'craze803', texOp: 0.6 });
  V.glow(f, PH([[104, 0]])[0], 18, 12, P.lamp, 0.5);
  f.flat(PH([[84, -4], [112, -1], [84, 4]]), P.lamp); f.flat(PH([[96, -2], [110, -1], [96, 2]]), P.hot);
  f.line(PH([[-14, -6], [-80, -2]]), 1.2, P.iceL, { op: 0.6 });
  V.icicles(f, [PH([[-30, 8]])[0], PH([[-90, 6]])[0]], 3, 8, 18);
  f.flat(PH([[30, -4], [42, -6], [40, 2]]), P.rust, { op: 0.6 });
  V.armRig(f, SN, EN, WN, [42, 38, 30], () => {
    V.thermal(f, K.chain([SN, EN], [44, 40], { bp: [[0, 0.45, 0.12]] }), SpNA, V.rimed(WOOLl), V.charred(WOOLl, 0.5), { riftW: 2, faint: true });
    V.thermal(f, K.chain([lerp(EN, SN, 0.08), EN, lerp(EN, WN, 0.35)], [40, 40, 34]), SpNF, V.rimed(WOOLl), V.charred(WOOLl, 0.5), { riftW: 2, faint: true });
    V.thermal(f, K.chain([lerp(EN, WN, 0.3), lerp(EN, WN, 0.7), WN], [30, 30, 26], { bp: [[0, 0.5, 0.12]] }), SpNF, SKIl, SKCl, { riftW: 1.8, faint: true });
    f.part(ell(lerp(EN, WN, 0.32), 20, 8, V.ang(EN, WN) + Math.PI / 2, 12), V.charred(WOOLl, 0.4)); // rolled cuff
  }, '_n');
  f.bone('forearm_n');
  V.seam(f, [lp(EN, WN, 0.45, 10), lp(EN, WN, 0.6, 6), lp(EN, WN, 0.76, 9)], 1.4);
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.atan2(hTop[1] - WN[1], hTop[0] - WN[0]), 26, '#4e3e34', { shadow: P.charS, tex: 'craze803', texOp: 0.5, name: 'thrall pick' });
  V.embers(f, WN, 10, 8, 3);

  // ---- slush and meltwater at the feet, on the ground (root)
  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [20, 42]), 48, 5, 0, 14), P.iceM, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ OBSIDIAN SHIELDMAIDEN (cast, human 1.05)
// A shieldmaiden of the hold in the guard she was taught: low lunge, round shield up and forward so she looks over its
// rim, spear drawn back at the hip under it. Her armour is chipped volcano glass over mail; it bites her arms.
// Split per limb: the shield arm, shield and leading leg rimed; the spear arm and back leg charred, glowing between the
// glass plates; a jagged crack runs down through the breastplate between the two.
// Rig: standard humanoid + shield (on hand_f) + spear (on hand_n) + braids (head) + skirt (mail skirt).
function shieldmaiden() {
  const CW = TIERS.human[0], CH = TIERS.human[1];
  const f = new Fig(V.base(805, CH)); V.textures(f);
  const gy = f.o.groundY, H = 102;
  const N = [298, 286], C = [272, 370], Pv = [268, 474];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.2, 0.12), SF = S.at(0.46, 0.1);
  const HN = S.at(-0.3, 0.98), HF = S.at(0.3, 0.98);
  const KF = [372, 596], AF = [382, 744], KN = [196, 606], AN = [142, 742];
  const EN = [234, 392], WN = [252, 470];
  const EF = [378, 368], WF = [424, 330];
  const HC = [326, 214], hA = 0.1;
  const shC = [446, 340], shRx = 78, shRy = 128, shA = 0.05;
  const spD = E.norm([0.97, -0.1]), spP = add(WN, mul(spD, 330)), spB = add(WN, mul(spD, -210)), spA = Math.atan2(spD[1], spD[0]);
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.85), N: S.at(0.2, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('shield', WF, 'hand_f').joint('spear', WN, 'hand_n').joint('braids', add(HC, [-40, 20]), 'head').joint('skirt', S.at(0, 0.9), 'pelvis');
  const skin = '#c8b0a0', SKN = { fill: skin, shadow: '#5a4048', shade: 0.34, tex: 'mottle805', texOp: 0.45 };
  const SKNc = V.charred(SKN, 0.35), SKNi = V.rimed(SKN, 0.3);
  const MAIL = { fill: P.mail, shadow: '#1e1e24', shade: 0.4, tex: 'mail805', texOp: 0.85 };
  const WOOLl = V.WOOL(f, { fill: '#5a5650' });
  const cut = (a, b) => { f.line([a, b], 2.4, P.blood); f.line([a, b], 1, P.bloodD, { op: 0.8 }); f.flat([lerp(a, b, 0.5), add(lerp(a, b, 0.5), [1.5, 0]), add(lerp(a, b, 0.5), [0.5, 9])], P.blood, { op: 0.85 }); };
  const plates = (a, b, n, w, state, o = {}) => { for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n + 0.04, d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; const p0 = lerp(a, b, t0), p1 = lerp(a, b, t1), ww = w * (1 - i * (o.taper || 0)); V.glassPlate(f, [add(p0, mul(nn, ww / 2)), add(lerp(p0, p1, 0.5), mul(nn, ww * 0.56)), add(p1, mul(nn, ww * 0.46)), add(p1, mul(nn, -ww * 0.46)), add(lerp(p0, p1, 0.5), mul(nn, -ww * 0.54)), add(p0, mul(nn, -ww / 2))], { state, chip: i % 2 === 0, crust: o.crust }); if (state === 'hot' && i < n - 1) V.seam(f, [add(p1, mul(nn, ww * 0.4)), lerp(p1, add(p1, mul(nn, -ww * 0.4)), 0.5), add(p1, mul(nn, -ww * 0.4))], 1.4); } };

  // ---- braids hanging plumb down the back, frozen stiff, beaded with ice
  f.bone('braids');
  for (const [dx, l, w] of [[-34, 170, 15], [-50, 150, 13]]) {
    const top = add(HC, [dx, 18]), pts = [top, add(top, [-6, l * 0.35]), add(top, [-4, l * 0.7]), add(top, [0, l])];
    f.part(K.chain(pts, [w, w * 0.95, w * 0.85, w * 0.6]), { fill: mix('#5a4a3a', P.ice, 0.35), shadow: '#1a1a22', shade: 0.4, tex: 'hatch805', texOp: 0.4, light: P.iceL });
    for (let i = 0; i < 7; i++) { const q = lerp(pts[0], pts[3], (i + 0.5) / 7); f.line([add(q, [-w * 0.5, -4]), add(q, [w * 0.5, 4])], 1.2, INK, { op: 0.6 }); }
    V.rimeCrust(f, pts.slice(0, 3).map(q => add(q, [-w * 0.45, 0])), 4, [-1, 0], { gap: 6, inkW: 0.8 });
    f.part(ell(add(pts[3], [0, 8]), 6, 9, 0, 10), { fill: P.bone, shade: 0.4, inkW: 1, cast: false }); // bone bead
    V.icicle(f, add(pts[3], [0, 16]), 18, 5, { drop: true });
  }

  // ---- far arm (shield arm): mail sleeve, obsidian vambrace, rimed, the glass biting at the wrist
  V.armRig(f, SF, EF, WF, [38, 34, 30], () => {
    f.part(K.chain([SF, EF, lerp(EF, WF, 0.3)], [40, 36, 34]), V.rimed(MAIL, 0.3));
    f.part(K.chain([lerp(EF, WF, 0.25), WF], [32, 28]), SKNi);
    plates(lerp(EF, WF, 0.3), lerp(EF, WF, 0.95), 2, 34, 'ice', { crust: false });
  }, '_f');
  f.bone('forearm_f');
  cut(lp(EF, WF, 0.28, 10), lp(EF, WF, 0.34, -6));

  // ---- far (leading) leg: wool trousers, obsidian greave, fur-topped boot; rimed
  const Spf = { line: [[-10, -10], [-9, 2000]], ice: 1 }; // (the whole leading leg is on the ice side)
  V.legRig(f, HF, KF, AF, 52, () => {
    f.part(K.chain([HF, lerp(HF, KF, 0.5), KF, lerp(KF, AF, 0.3)], [66, 62, 50, 46], { bq: [[0, 0.6, 0.12]], bp: [[1, 0.4, 0.08]] }), V.rimed(WOOLl, 0.5));
    f.raw(`<g opacity="0.5">`); f.raw(`</g>`);
    plates(lerp(KF, AF, 0.08), lerp(KF, AF, 0.72), 3, 44, 'ice', { taper: 0.1 });
    G.poleyn(f, KF, V.ang(KF, AF) - Math.PI / 2, 22, mix(P.obs, P.iceD, 0.3), P.obs);
  }, '_f');
  V.footRig(f, KF, AF, 52, () => {
    B.boot(f, AF, 1, 52, mix(P.leath, P.ice, 0.35), { shaft: 0.7, strap: true, tex: 'fur805', texOp: 0.5 });
    f.part([add(AF, [-22, -40]), add(AF, [26, -44]), add(AF, [28, -26]), add(AF, [-24, -22])], V.FUR(f, { fill: mix(P.fur, P.ice, 0.4) }));
    V.rimeCrust(f, [add(AF, [-24, -40]), add(AF, [26, -44])], 5, [-1, 0], { gap: 6 });
    V.icicles(f, [add(AF, [-22, -22]), add(AF, [26, -26])], 4, 6, 14);
  }, '_f');

  // ---- near (back) leg, straight and braced: charred, seams between the greave plates
  V.legRig(f, HN, KN, AN, 50, () => {
    f.part(K.chain([HN, lerp(HN, KN, 0.5), KN, lerp(KN, AN, 0.3)], [68, 62, 48, 44], { bp: [[0, 0.6, 0.1]], bq: [[1, 0.3, 0.1]] }), V.charred(WOOLl, 0.55));
    V.crackNet(f, lerp(HN, KN, 0.4), 2.2, 40, 1.8, { depth: 1 });
    plates(lerp(KN, AN, 0.08), lerp(KN, AN, 0.72), 3, 42, 'hot', { taper: 0.1 });
    G.poleyn(f, KN, V.ang(KN, AN) - Math.PI / 2, 22, P.obsM, P.obs);
  }, '_n');
  V.footRig(f, KN, AN, 52, () => {
    B.boot(f, AN, 1, 52, mix(P.leath, P.char, 0.5), { shaft: 0.7, strap: true, tex: 'craze805', texOp: 0.6 });
    f.part([add(AN, [-22, -40]), add(AN, [26, -44]), add(AN, [28, -26]), add(AN, [-24, -22])], V.charred(V.FUR(f), 0.5));
    V.embers(f, add(AN, [0, -34]), 20, 6, 4);
  }, '_n');

  // ---- torso: mail hauberk over a wool tunic; glass lamellar on the chest, split by a jagged crack
  f.bone('torso');
  const SpT = { line: V.jag(f, [S.at(0.1, -0.7), S.at(0.15, 0.1), S.at(0.0, 0.35), S.at(0.2, 0.62), S.at(0.05, 0.9), S.at(0.1, 1.5)], 8, 16), ice: 1 };
  const torso = S.shape([[-0.06, 0.34, 0.32], [0.06, 0.74, 0.52], [0.22, 0.86, 0.72], [0.42, 0.78, 0.74], [0.62, 0.62, 0.62], [0.82, 0.68, 0.62], [1.0, 0.74, 0.66], [1.1, 0.6, 0.5]]);
  V.thermal(f, torso, SpT, V.rimed(MAIL, 0.25), V.charred(MAIL, 0.3), { riftW: 2, faint: true, facets: false, rimeOp: 0.35, crazeOp: 0.3 });
  // lamellar rows of glass plates over the chest and belly, laced; each plate on its side of the crack
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
    const u0 = -0.62 + c * 0.24 + (r % 2) * 0.1, v0 = 0.16 + r * 0.13;
    if (u0 > 0.66 - r * 0.02 || u0 < -0.7) continue;
    const q = [S.at(u0, v0), S.at(u0 + 0.22, v0 - 0.005), S.at(u0 + 0.23, v0 + 0.13), S.at(u0 + 0.11, v0 + 0.15), S.at(u0 - 0.005, v0 + 0.13)];
    const mid = S.at(u0 + 0.11, v0 + 0.07), side = (() => { let best = 1e9, sg = 1; for (let i = 0; i < SpT.line.length - 1; i++) { const a = SpT.line[i], b = SpT.line[i + 1], t = Math.max(0, Math.min(1, ((mid[0] - a[0]) * (b[0] - a[0]) + (mid[1] - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2))), p = lerp(a, b, t), dd = E.len(sub(mid, p)); if (dd < best) { best = dd; const d2 = E.norm(sub(b, a)); sg = ((mid[0] - p[0]) * d2[1] - (mid[1] - p[1]) * d2[0]) > 0 ? 1 : -1; } } return sg; })();
    V.glassPlate(f, q, { state: side === SpT.ice ? 'ice' : 'hot', chip: (r + c) % 3 === 0, inkW: 1.1, inkH: 1.6, crust: r === 0 });
  }
  for (let r = 0; r < 5; r++) f.line([S.at(-0.66, 0.29 + r * 0.13), S.at(0.0, 0.3 + r * 0.13), S.at(0.6, 0.28 + r * 0.13)], 1.4, P.leathD, { op: 0.8, dash: '4 3' }); // lacing between the rows
  V.clipDraw(f, E.smooth(torso), () => V.rift(f, SpT, 2.6));
  V.steam(f, S.at(0.12, 0.2), 70, 14, { sway: 8, phase: 2 });
  // pauldron plates on the shoulders (torso bone, so they stay when the arm lifts)
  for (let i = 2; i >= 0; i--) V.glassPlate(f, [S.at(0.18 + i * 0.05, 0.02 + i * 0.07), S.at(0.62 + i * 0.04, 0.0 + i * 0.07), S.at(0.7 + i * 0.03, 0.1 + i * 0.07), S.at(0.6 + i * 0.03, 0.17 + i * 0.07), S.at(0.24 + i * 0.05, 0.15 + i * 0.07)], { state: 'ice', chip: i === 1 });
  for (let i = 2; i >= 0; i--) V.glassPlate(f, [S.at(-0.68 - i * 0.05, 0.04 + i * 0.07), S.at(-0.15, 0.0 + i * 0.07), S.at(-0.1, 0.11 + i * 0.07), S.at(-0.2, 0.2 + i * 0.07), S.at(-0.66 - i * 0.05, 0.17 + i * 0.07)], { state: 'hot', chip: i === 0 });
  // belt with a seax in its sheath and a pouch
  f.bone('pelvis');
  f.part([S.at(-0.8, 0.86), S.at(0.7, 0.84), S.at(0.72, 0.94), S.at(-0.82, 0.96)], V.LEA(f, { fill: P.leathD }));
  f.part([S.at(0.1, 0.84), S.at(0.24, 0.84), S.at(0.24, 0.95), S.at(0.1, 0.95)], { fill: P.ironL, shade: 0.3, inkW: 1, sharp: true });
  f.part([S.at(-0.6, 0.9), S.at(-0.48, 0.9), S.at(-1.3, 1.22), S.at(-1.38, 1.16)], V.charred(V.LEA(f), 0.4)); // seax sheath angled back
  f.part([S.at(-0.66, 0.84), S.at(-0.48, 0.85), S.at(-0.5, 0.9), S.at(-0.66, 0.9)], { fill: P.bone, shade: 0.4, inkW: 1 }); // bone grip
  f.part([S.at(0.36, 0.94), S.at(0.6, 0.93), S.at(0.6, 1.12), S.at(0.38, 1.13)], V.rimed(V.LEA(f), 0.35));
  // mail skirt, split for the stride
  f.bone('skirt');
  const sk = [S.at(-0.8, 0.88), S.at(0.72, 0.86), add(S.at(0.76, 1.0), [18, 40]), add(S.at(0.6, 1.0), [10, 64]), [300, 560], add(S.at(-0.3, 1.0), [-10, 58]), add(S.at(-0.84, 1.0), [-16, 40])];
  V.thermal(f, sk, SpT, V.rimed(MAIL, 0.25), V.charred(MAIL, 0.3), { faint: true, facets: false, rimeOp: 0.35, crazeOp: 0.3, nEmbers: 3 });
  f.line([add(S.at(0.6, 1.0), [10, 64]), [300, 560], add(S.at(-0.3, 1.0), [-10, 58])], 1.2, '#14141a', { op: 0.6 });
  V.icicles(f, [add(S.at(0.6, 1.0), [10, 64]), add(S.at(0.76, 1.0), [18, 40])], 3, 6, 14);

  // ---- head: obsidian nasal helm, a weathered face set hard, looking over the shield rim
  f.bone('head');
  f.part(limb(S.at(0.2, -0.05), add(HC, [-6, 32]), 34, 32), SKN);
  f.part([S.at(-0.4, -0.08), add(HC, [-46, 34]), add(HC, [18, 46]), S.at(0.5, -0.02), S.at(0.2, 0.06)], V.rimed(MAIL, 0.2)); // mail aventail
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin, jaw: 0.9, chin: -0.01, nose: 1.0, hook: 0.15, mouth: 'set', squint: 0.35, browDown: 0.07, lips: true, lashes: true, faceShade: 0.8, faceHatch: false, jawShade: 0.3, hairCol: '#4a3a2c', browCol: '#3a2c22', noEar: true, scar: [[0.12, 0.02], [0.2, 0.14], [0.24, 0.26]] });
  // the burn on the near jaw and a seam at the throat, the cheek rimed white on the far side of the nose
  f.flat(hF([[-0.14, 0.22], [-0.02, 0.28], [0.02, 0.4], [-0.08, 0.46], [-0.18, 0.36]]), P.char, { op: 0.35 });
  V.seam(f, hF([[-0.08, 0.2], [0.0, 0.3], [0.02, 0.42]]), 1.3);
  f.flat(hF([[0.3, -0.02], [0.36, 0.0], [0.35, 0.1], [0.3, 0.08]]), P.rime, { op: 0.7 });
  // helm: conical, iron frame with glass plates, a nasal bar, brow band
  const helm = hF([[-0.44, 0.06], [-0.47, -0.28], [-0.3, -0.58], [-0.04, -0.8, 1], [0.22, -0.6], [0.36, -0.34], [0.39, -0.2], [0.1, -0.18], [-0.2, -0.12]]);
  V.glassPlate(f, helm, { state: 'ice', chip: true });
  V.clipDraw(f, E.smooth(helm), () => { V.seam(f, hF([[-0.44, -0.14], [-0.32, -0.1], [-0.2, -0.2]]), 1.4); f.line(hF([[-0.04, -0.8], [0.04, -0.5], [0.08, -0.2]]), 2.2, P.iron); f.line(hF([[-0.3, -0.58], [-0.24, -0.34], [-0.28, -0.08]]), 2.2, P.iron); });
  f.part(hF([[-0.47, -0.1], [-0.2, -0.2], [0.1, -0.26], [0.39, -0.27], [0.4, -0.18], [0.1, -0.17], [-0.2, -0.1], [-0.45, 0.02]]), { fill: P.iron, shadow: '#101010', shade: 0.4, inkW: 1.2, tex: 'mottle805', texOp: 0.5 }); // brow band, following the rim
  for (let i = 0; i < 4; i++) f.rivet(hF([[-0.36 + i * 0.22, -0.12 - i * 0.03]])[0], 2.2, '#6a6a6a');
  f.part(hF([[0.3, -0.24], [0.36, -0.24], [0.355, 0.04], [0.33, 0.08], [0.31, 0.04]]), { fill: P.iron, shadow: '#101010', shade: 0.4, inkW: 1.2 }); // nasal over the bridge of the nose
  V.icicles(f, hF([[-0.45, 0.0], [-0.2, -0.1]]), 3, 6, 12);

  // the shield hand, behind the boss on the grip bar (hidden in the rest pose; there for the rig)
  f.bone('hand_f');
  B.grip(f, WF, EF, -Math.PI / 2, 22, V.rimed(SKN, 0.3).fill, { shadow: P.iceS, tex: 'mottle805', texOp: 0.4, name: 'maiden shield' });
  // ---- shield: round, wood faced with knapped obsidian, iron rim and boss; frosted, the glass cracked hot on one quarter
  f.bone('shield');
  const SH = (u, v) => add(shC, rot([u * shRx, v * shRy], shA));
  const rim = ell(shC, shRx, shRy, shA, 40);
  f.part(ell(add(shC, [-7, 1]), shRx, shRy, shA, 40), { fill: P.woodD, shade: 0.3, inkW: 1.4 }); // the shield's thickness, its back edge
  f.part(rim, { fill: P.obs, shadow: P.obsS, light: P.obsL, shade: 0.4, tex: 'mottle805', texOp: 0.4 });
  // the glass facing: wedge plates radiating from the boss
  // two rings of irregular knapped shards (not a wheel): jittered angles and radii, wood showing in the gaps
  for (const [r0, r1, n, ph] of [[0.24, 0.52, 6, 0.4], [0.5, 0.9, 11, 0.1]]) {
    const cuts = [], rad = []; for (let i = 0; i <= n; i++) { cuts.push(ph + i * Math.PI * 2 / n + (i % n ? (f.r() - 0.5) * 0.3 : 0)); rad.push([r0 + (f.r() - 0.5) * 0.06, r1 + (f.r() - 0.5) * 0.05]); }
    rad[n] = rad[0];
    for (let i = 0; i < n; i++) {
      const a0 = cuts[i] + 0.025, a1 = cuts[i + 1] - 0.025, am = (a0 + a1) / 2, [i0, o0] = rad[i], [i1, o1] = rad[i + 1];
      const q = [SH(Math.cos(a0) * i0, Math.sin(a0) * i0), SH(Math.cos(a0) * o0, Math.sin(a0) * o0), SH(Math.cos(am) * ((o0 + o1) / 2 + 0.02), Math.sin(am) * ((o0 + o1) / 2 + 0.02)), SH(Math.cos(a1) * o1, Math.sin(a1) * o1), SH(Math.cos(a1) * i1, Math.sin(a1) * i1), SH(Math.cos(am) * ((i0 + i1) / 2 - 0.02), Math.sin(am) * ((i0 + i1) / 2 - 0.02))];
      const hot = r1 > 0.6 ? (i === 1 || i === 2) : i === 1, top = Math.sin(am) < -0.4 && Math.cos(am) < 0.3;
      V.glassPlate(f, q, { state: hot ? 'hot' : 'ice', chip: (i + n) % 3 === 0, crust: top && r1 > 0.6, inkW: 1.1, inkH: 1.8 });
    }
  }
  const rimL = ell(shC, shRx * 0.94, shRy * 0.95, shA, 40);
  f.line(rimL.concat([rimL[0]]), 9, INK); f.line(rimL.concat([rimL[0]]), 6, P.iron); f.line(rimL.slice(26, 36), 1.6, P.iceL, { op: 0.7 });
  for (let i = 0; i < 12; i++) f.rivet(rimL[Math.round(i * 40 / 12) % 40], 2.4, '#6a6a6a');
  f.part(ell(SH(0, 0), 26, 34, shA, 16), { fill: P.ironL, shadow: '#141414', shade: 0.45, tex: 'mottle805', texOp: 0.5 }); // boss
  f.flat(ell(SH(0.1, -0.08), 8, 10, shA, 10), P.iceL, { op: 0.55 });
  f.line(ell(SH(0, 0), 26, 34, shA, 16).slice(10, 15), 1.2, P.iceL, { op: 0.7 });
  V.rimeCrust(f, rimL.slice(26, 38), 9, [-1, -0.2], { gap: 6 });
  V.icicles(f, rimL.slice(5, 15), 7, 10, 26);
  V.glow(f, SH(0.4, 0.4), 40, 50, P.lamp, 0.25);
  f.scratches(SH(-0.3, 0.3), 24, 5, '#c8ccd8');
  f.spatter(SH(0.3, -0.4), 18, 8, P.bloodD);

  // ---- spear (on the near hand): ash shaft, knapped obsidian head bound with sinew, iron butt spike
  f.bone('spear');
  f.part(limb(spB, spP, 12, 11, { steps: 10 }), Object.assign(V.charred({ fill: P.wood, shadow: P.woodD }, 0.25), { tex: 'wood805', texOp: 0.6 }));
  f.line([lp(spB, spP, 0.03, -3), lp(spB, spP, 0.97, -3)], 1, P.woodL, { op: 0.5, straight: true });
  const SPH = frame(spP, spA, 1);
  f.part(SPH([[-8, -7], [6, -7], [6, 7], [-8, 7]]), { fill: P.leath, shade: 0.4, inkW: 1, cast: false }); // sinew binding
  for (let i = 0; i < 4; i++) f.line(SPH([[-6 + i * 4, -7], [-4 + i * 4, 7]]), 1, INK, { op: 0.6 });
  V.glassPlate(f, SPH([[4, -10], [30, -16], [64, -10], [96, 0, 1], [64, 10], [30, 16], [4, 10]]), { state: 'hot', chip: true });
  for (let i = 0; i < 5; i++) f.line(SPH([[14 + i * 14, -12 + (i % 2) * 2], [20 + i * 14, -4]]), 0.8, '#8a8aa0', { op: 0.6 }); // flake scars
  const BT = frame(spB, spA, 1);
  f.part(BT([[-26, 0, 1], [-4, -6], [10, -6], [10, 6], [-4, 6]]), { fill: P.iron, shadow: '#101010', shade: 0.4, inkW: 1.1 });
  f.line([lp(spB, spP, 0.5, 6), lp(spB, spP, 0.5, 6)].map((q, i) => add(q, [0, i * 26])), 2, P.leathD); // a thong hanging from the shaft
  // ---- near arm (spear arm): mail sleeve to the elbow, bare forearm in a glass vambrace that cuts her, charred
  V.armRig(f, SN, EN, WN, [40, 36, 30], () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.2)], [42, 38, 36], { bp: [[0, 0.4, 0.1]] }), V.charred(MAIL, 0.3));
    f.part(K.chain([lerp(EN, WN, 0.15), lerp(EN, WN, 0.5), WN], [34, 32, 28], { bq: [[0, 0.5, 0.12]] }), SKNc);
    plates(lerp(EN, WN, 0.3), lerp(EN, WN, 0.92), 2, 34, 'hot');
  }, '_n');
  f.bone('upperarm_n');
  f.part(ell(lerp(SN, EN, 0.92), 22, 9, V.ang(SN, EN) + Math.PI / 2, 12), V.charred(MAIL, 0.4)); // mail sleeve edge
  f.bone('forearm_n');
  cut(lp(EN, WN, 0.24, 12), lp(EN, WN, 0.28, -8)); cut(lp(EN, WN, 0.94, 10), lp(EN, WN, 0.98, -4));
  f.bone('hand_n');
  B.grip(f, WN, EN, spA, 24, mix(skin, P.char, 0.35), { shadow: P.charS, tex: 'craze805', texOp: 0.4, name: 'maiden spear' });
  cut(add(WN, [-10, -8]), add(WN, [2, -14]));

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [20, 42]), 46, 5, 0, 14), P.iceM, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ STEAM WRAITH (cast, human 1.1, floating)
// A man caught where fire met ice: a column of steam rising out of a crack, a man's chest, head and arms leaning out of
// it to embrace you. Split inside / outside: the hot core shows orange through the steam at the breastbone; outward
// the steam condenses and freezes into a cracked shell of rime that crusts the shoulders, the back of the skull and the
// hands, with icicles hanging off it. The line between them is the shell cracking open round the core.
// Rig: column (root, at the crack) > pelvis (waist) > torso > head / arms; wisp_1..3 (loose steam off the back).
function steamWraith() {
  const CW = TIERS.human[0], CH = TIERS.human[1];
  const f = new Fig(V.base(806, CH, { grimeY: 900 })); V.textures(f);
  const gy = f.o.groundY, H = 104;
  const N = [314, 284], C = [282, 368], Pv = [270, 478];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.25, 0.12), SF = S.at(0.5, 0.08);
  const EN = [330, 400], WN = [420, 412];
  const EF = [402, 262], WF = [476, 222];
  const HC = [352, 206], hA = -0.06;
  const crackC = [282, gy - 6];
  f.joint('column', crackC).joint('pelvis', Pv, 'column').joint('torso', S.at(0, 0.85), 'pelvis').joint('head', S.at(0.2, -0.05), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  for (let i = 1; i <= 3; i++) f.joint('wisp_' + i, S.at(-0.8, 0.2 + i * 0.25), 'torso');
  const ST = (o = {}) => Object.assign({ fill: '#d2d8da', shadow: '#94a0aa', light: '#f6f8f8', shade: 0.3, tex: 'mottle806', texOp: 0.3, opacity: 0.84, hatch: false, inkW: 0.9, inkHeavy: 1.3 }, o);
  const SHELL = (o = {}) => Object.assign({ fill: P.rime, shadow: P.iceD, light: '#ffffff', shade: 0.34, tex: 'crack806', texOp: 0.6, inkW: 1.3, inkHeavy: 2, hatch: false }, o);
  const curls = (c, rx, ry, n, op = 0.5) => { for (let i = 0; i < n; i++) { const p = V.scatter(f, c, rx, ry), r = V.R(f, 6, 14), a0 = f.r() * 6; const e = []; for (let k = 0; k < 9; k++) { const t = a0 + k * 0.6; e.push(add(p, [Math.cos(t) * r * (1 - k * 0.07), Math.sin(t) * r * 0.7 * (1 - k * 0.07)])); } f.line(e, 1.1, '#7e8a94', { op }); } };
  // a cracked shell of rime over a region: plates of white crust with dark gaps, broken off toward `open`
  const shell = (pts, open, o = {}) => {
    const d = f.part(pts, SHELL(o.look));
    V.clipDraw(f, d, () => {
      f.raw(`<rect x="0" y="0" width="${CW}" height="${CH}" fill="url(#rime806)" opacity="0.6"/>`);
      const bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2];
      for (let i = 0; i < (o.n || 6); i++) { const p = V.scatter(f, c, (bb[2] - bb[0]) / 2, (bb[3] - bb[1]) / 2); let q = p; const L = [p]; for (let k = 0; k < 3; k++) { q = add(q, rot([V.R(f, 8, 18), 0], f.r() * 6.3)); L.push(q); } f.line(L, 1.4, INK, { op: 0.75, straight: true }); f.line(L.map(z => add(z, [1, 1])), 0.8, P.iceD, { op: 0.6, straight: true }); }
      V.facets(f, c, (bb[2] - bb[0]) / 2, (bb[3] - bb[1]) / 2, o.facets || 4, { op: 0.3 });
    });
    return d;
  };

  // ---- loose steam peeling off the back, drifting up
  for (let i = 1; i <= 3; i++) { f.bone('wisp_' + i); V.steam(f, S.at(-0.7 - i * 0.12, 0.25 + i * 0.25), 150 + i * 30, 30, { sway: 26, phase: i * 1.7, drift: -30, op: 0.32, big: true }); }

  // ---- the column: steam twisting up out of the crack, widening into the waist
  f.bone('column');
  f.flat([[150, gy], [210, gy - 10], [282, gy - 4], [360, gy - 12], [430, gy], [360, gy + 10], [200, gy + 10]], P.iceM, { op: 0.5 }); // ice floor
  f.part([[190, gy - 2], [232, gy - 10], [272, gy - 6], [300, gy - 14], [346, gy - 6], [380, gy], [340, gy + 6], [240, gy + 6]], { fill: P.charS, shade: 0.2, inkW: 1.4, cast: false }); // the crack
  V.glow(f, [282, gy - 6], 80, 16, P.lamp, 0.5);
  V.seam(f, [[214, gy - 3], [250, gy - 6], [286, gy - 4], [320, gy - 9], [360, gy - 2]], 3);
  V.rimeCrust(f, [[150, gy - 2], [200, gy - 10], [230, gy - 10]], 6, [-1, 0]); V.rimeCrust(f, [[360, gy - 10], [400, gy - 4], [432, gy]], 6, [1, 0]);
  // a soft blurred body of steam, then twisting ribbons that give it form, inked only by their curl lines
  const col = [[262, gy - 8], [238, 700], [222, 630], [216, 560], [224, 500], S.at(-0.8, 0.9), S.at(0.6, 0.9), [336, 520], [326, 590], [312, 660], [300, 720], [292, gy - 8]];
  f.raw(`<path d="${E.smooth(col)}" fill="#dfe4e5" opacity="0.5" filter="url(#smkL806)"/>`);
  f.raw(`<path d="${E.smooth(col.map(q => add(lerp(q, [280, 600], 0.25), [0, 0])))}" fill="#eef1f1" opacity="0.45" filter="url(#smk806)"/>`);
  V.glow(f, [276, 740], 26, 70, P.lamp, 0.3);
  for (let i = 0; i < 5; i++) {
    const ph = i * 1.3 + f.r(), fr = 3.2 + f.r() * 2.6, am = 0.5 + f.r() * 0.5, rib = []; for (let k = 0; k <= 10; k++) { const t = k / 10, y = gy - 10 - t * (gy - 470) - (i % 2) * 20 * t, w = 16 + t * 70; rib.push([278 + Math.sin(t * fr + ph) * w * am + (t - 0.5) * (i - 2) * 14, y]); }
    f.stroke(rib, 16 + i * 4, '#e8ecec', { op: 0.55 });
    f.line(rib.map((q, k) => add(q, [-4, 2])), 1.2, '#7e8a94', { op: 0.6 });
  }
  curls([276, 620], 44, 110, 9, 0.55);
  for (const [x, y] of [[238, 640], [320, 560], [250, 520]]) V.steam(f, [x, y], 60, 14, { sway: 10, phase: x, op: 0.3 });
  for (let i = 0; i < 5; i++) V.steam(f, [V.R(f, 220, 330), gy - 10], V.R(f, 80, 200), 18, { sway: 12, phase: i, op: 0.3 });

  // ---- far arm reaching high: steam forearm rimed toward the hand, hand frozen in a claw
  V.armRig(f, SF, EF, WF, [44, 38, 32], () => {
    f.part(K.chain([SF, lerp(SF, EF, 0.45), EF, lerp(EF, WF, 0.3), WF], [46, 50, 34, 40, 30], { bp: [[0, 0.6, 0.1], [2, 0.2, 0.1]], bq: [[1, 0.6, 0.08]] }), ST({ fill: '#c4cacc' }));
    for (const t of [0.3, 0.7]) V.steam(f, lp(SF, WF, t, 10), 40, 10, { sway: 8, phase: t * 5, drift: -30, op: 0.35 });
    shell(K.chain([lerp(EF, WF, 0.3), WF], [38, 34]), WF, { n: 3, facets: 2 });
    curls(lerp(SF, EF, 0.5), 14, 10, 3);
  }, '_f');
  f.bone('forearm_f');
  V.icicles(f, [lp(EF, WF, 0.35, 18), lp(EF, WF, 0.95, 17)], 4, 10, 24);
  f.bone('hand_f');
  V.clawHand(f, WF, V.ang(EF, WF) - 0.2, 74, { look: SHELL({ inkW: 1.2 }), curl: [0.7, 0.55, 0.45, 0.35], spread: 0.2, thumbAng: 1.1, flip: true, nail: P.iceD });
  V.icicles(f, [add(WF, [6, 14]), add(WF, [40, 14])], 3, 8, 18);

  // ---- torso: a man's chest and shoulders made of steam; the shell crusts the shoulders and back, broken open over
  // the breastbone where the core burns
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.34, 0.34], [0.06, 0.78, 0.56], [0.22, 0.9, 0.82], [0.42, 0.82, 0.86], [0.62, 0.72, 0.74], [0.8, 0.7, 0.62], [0.92, 0.6, 0.5], [1.0, 0.3, 0.2]]);
  f.raw(`<path d="${E.smooth(torso)}" fill="#e2e7e8" opacity="0.55" transform="translate(${-4} ${-6}) scale(1)" filter="url(#smkL806)"/>`); // steam haloing off the edges
  const td = f.part(torso, ST());
  V.clipDraw(f, td, () => {
    // ribs and breastbone ghosting through the steam (the man it was)
    for (let i = 0; i < 5; i++) f.stroke([S.at(-0.5, 0.3 + i * 0.09), S.at(0.1, 0.27 + i * 0.1), S.at(0.62, 0.34 + i * 0.1)], 2.4, '#8a949c');
    curls(S.at(0.0, 0.5), 50, 60, 9, 0.45);
    // the core: a faint orange heat at the breastbone, a crack of light
    V.glow(f, S.at(0.35, 0.42), 44, 54, P.lamp, 0.32, true);
    V.glow(f, S.at(0.35, 0.42), 16, 22, P.lampL, 0.5);
    f.part([S.at(0.26, 0.36), S.at(0.42, 0.33), S.at(0.48, 0.44), S.at(0.38, 0.54), S.at(0.26, 0.48)], { fill: P.lamp, shadow: P.ember, light: P.hot, shade: 0.3, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, tex: 'craze806', texOp: 0.7 }); // the coal at its heart
    V.crackNet(f, S.at(0.36, 0.38), -1.2, 70, 2.4, { depth: 2, glowOp: 0.3 });
    V.crackNet(f, S.at(0.36, 0.44), 1.9, 60, 2, { depth: 1, glowOp: 0.3 });
  });
  // the chest dissolving into the column: a soft band over the hem of the body, tendrils curling off it
  f.raw(`<path d="${E.smooth([S.at(-0.95, 0.62), S.at(0.0, 0.7), S.at(0.72, 0.6), S.at(0.76, 0.9), [330, 540], [276, 556], [220, 540], S.at(-0.9, 0.92)])}" fill="#dde2e3" opacity="0.9" filter="url(#smk806)"/>`);
  for (const [u, l, ph] of [[-0.7, 60, 0], [-0.3, 80, 2], [0.2, 70, 4], [0.55, 50, 1]]) V.steam(f, S.at(u, 0.82), l, 18, { sway: 14, phase: ph, op: 0.45, lineOp: 0.6 });
  curls(S.at(-0.1, 0.84), 50, 16, 4, 0.5);
  // the rime shell over the back and shoulders, its broken edge round the core
  const shellT = [S.at(-0.88, 0.04), S.at(-0.5, -0.08), S.at(-0.05, -0.1), S.at(0.3, -0.04), S.at(0.12, 0.08, 1), S.at(-0.12, 0.14), S.at(-0.3, 0.3, 1), S.at(-0.36, 0.44), S.at(-0.56, 0.54, 1), S.at(-0.84, 0.5)];
  shell(shellT, S.at(0.3, 0.4), { n: 6, facets: 4 });
  V.icicles(f, [S.at(-0.84, 0.5), S.at(-0.56, 0.54)], 3, 12, 28);
  V.icicles(f, [S.at(0.66, 0.16), S.at(0.42, 0.18)], 2, 8, 16);
  // broken-off shell fragments lifting off at the edge of the opening
  for (const [u, v, a] of [[0.24, 0.22, 0.4], [0.02, 0.4, -0.3], [-0.1, 0.64, 0.6]]) { const q = S.at(u, v); f.part([add(q, rot([-12, -4], a)), add(q, rot([8, -8], a)), add(q, rot([13, 3], a)), add(q, rot([-2, 6], a))], SHELL({ inkW: 1, inkHeavy: 1.4, cast: false, sharp: true })); }
  V.steam(f, S.at(0.36, 0.3), 120, 24, { sway: 14, phase: 0.5, op: 0.35 });
  // steam boiling off the outline, breaking it: wisps over the shoulder and the flank
  for (const [u, v, l, ph] of [[0.6, 0.1, 70, 1], [0.7, 0.5, 60, 3], [-0.9, 0.3, 90, 2], [0.1, -0.08, 60, 5]]) V.steam(f, S.at(u, v), l, 22, { sway: 12, phase: ph, op: 0.5, lineOp: 0.55, big: true });
  for (const t of [0.2, 0.45, 0.7]) V.melt(f, S.at(-0.6 + t * 0.4, 0.88), 18 + t * 10);

  // ---- head: a man's face in the steam, mouth open in a hiss, the shell over the skull and down the far cheek
  f.bone('head');
  f.part(limb(S.at(0.2, -0.05), add(HC, [-8, 34]), 44, 40), ST());
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, { skin: '#cdd3d4', jaw: 1.08, chin: 0.01, nose: 1.06, hook: 0.1, mouth: 'snarl', squint: 0.1, browDown: 0.1, age: true, gaunt: true, faceShade: 0.78, jawShade: 0.3, faceHatch: false, eyeWhite: '#eef2f2', iris: '#6a7480', browCol: '#7e8a94', hairCol: '#9aa4aa', noEar: true });
  f.flat(hF([[0.17, 0.27], [0.25, 0.25], [0.32, 0.27], [0.31, 0.38], [0.24, 0.42], [0.18, 0.37]]), '#3a2a26'); // mouth wide, the hiss
  V.glow(f, hF([[0.25, 0.33]])[0], 10, 10, P.lamp, 0.6);
  f.flat(hF([[0.2, 0.3], [0.25, 0.29], [0.29, 0.31], [0.28, 0.36], [0.23, 0.38]]), P.lamp, { op: 0.55 });
  curls(hF([[0.05, 0.1]])[0], 16, 18, 3, 0.4);
  // the frozen crust: over the back of the skull and the nape only, broken off in a ragged edge behind the eye
  const shellH = hF([[0.04, -0.52], [-0.2, -0.6], [-0.44, -0.44], [-0.52, -0.08], [-0.46, 0.24], [-0.34, 0.36, 1], [-0.3, 0.16], [-0.18, 0.04, 1], [-0.22, -0.16], [-0.08, -0.3, 1], [-0.04, -0.42]]);
  shell(shellH, HC, { n: 4, facets: 2 });
  V.icicles(f, hF([[-0.46, 0.24], [-0.34, 0.36]]), 2, 10, 22);
  for (let i = 0; i < 5; i++) { const q = hF([[0.1 - i * 0.06, -0.5 + i * 0.02]])[0]; f.line([q, add(q, [-6 - i, -10 - i * 2]), add(q, [-14 - i, -14 - i * 2])], 2.2, '#c8d0d4', { op: 0.75 }); } // hair, half steam, half frost
  V.icicles(f, hF([[0.1, 0.5], [0.3, 0.5]]), 3, 8, 18); // from the chin and jaw, condensation frozen as it fell
  V.steam(f, hF([[0.35, 0.3]])[0], 70, 12, { sway: 10, phase: 3, drift: 20, op: 0.3 });

  // ---- near arm reaching low and forward: the steam thickening into a frozen hand
  V.armRig(f, SN, EN, WN, [46, 40, 34], () => {
    f.part(K.chain([SN, lerp(SN, EN, 0.45), EN, lerp(EN, WN, 0.3), WN], [48, 52, 36, 42, 32], { bp: [[0, 0.6, 0.1], [2, 0.3, 0.12]], bq: [[1, 0.6, 0.08]] }), ST());
    f.line([lp(SN, EN, 0.2, -10), lp(SN, EN, 0.55, -14), lp(SN, EN, 0.85, -8)], 1.2, '#7e8a94', { op: 0.6 }); f.line([lp(EN, WN, 0.1, 10), lp(EN, WN, 0.4, 14)], 1.2, '#7e8a94', { op: 0.6 });
    shell(K.chain([lerp(EN, WN, 0.45), WN], [38, 34]), WN, { n: 3, facets: 2 });
    curls(lerp(SN, EN, 0.5), 16, 12, 3); curls(lerp(EN, WN, 0.3), 12, 10, 2);
    V.crackNet(f, lp(EN, WN, 0.2, 4), 0.1, 40, 1.6, { depth: 1, glowOp: 0.25 });
  }, '_n');
  f.bone('upperarm_n');
  f.bone('forearm_n');
  V.icicles(f, [lp(EN, WN, 0.5, 18), lp(EN, WN, 0.96, 17)], 4, 10, 26);
  f.bone('hand_n');
  V.clawHand(f, WN, V.ang(EN, WN) + 0.1, 78, { look: SHELL({ inkW: 1.2 }), curl: [0.8, 0.6, 0.5, 0.4], spread: 0.22, thumbAng: 1.0, flip: true, back: true, nail: P.iceD });
  V.icicles(f, [add(WN, [10, 20]), add(WN, [46, 22])], 4, 8, 20);
  for (const p of [add(WN, [20, 30]), add(EN, [20, 26])]) V.melt(f, p, 22);
  return f;
}

// ------------------------------------------------------------------ MAGMA HOUND (cast, large, 1.2 long)
// The hold's war-dog, a rough-coated wolfhound gone to cooling basalt, stalking low: the head carried under the line of
// the back, the shoulders forward over a deep chest, the loin tucked up, the hindquarters crouched and loaded, one fore
// paw set ahead. Canine anatomy throughout: shoulder blade and upper arm, an elbow behind the brisket, a straight
// forearm, the wrist and a sloped pastern into a weight-bearing paw; a heavy thigh, the stifle forward, the gaskin, the
// hock point behind, the rear pastern down to the paw. A wolfhound's head: brow, stop, long muzzle, flews, a jaw on its
// hinge parted on the heat.
// Split top / bottom, the line a wandering crack: frost forms on the back as the rock cools (rime along the spine, frost
// on the crust, icicles off the flanks); below it the crust is cracked open on molten orange, brightest at the jaws.
// Rig: spine_1 (hips, root) > spine_2 (ribcage) > neck > head > jaw; tail; legs leg_[f|h][n|f]_1..3.
function magmaHound() {
  const CW = TIERS.large[0], CH = TIERS.large[1];
  const f = new Fig(V.base(804, CH)); V.textures(f);
  const gy = f.o.groundY;
  const BAS = (o = {}) => Object.assign({ fill: '#2e2a2c', shadow: '#0a0809', light: '#605858', shade: 0.38, tex: 'craze804', texOp: 0.55, maxShade: 30 }, o);
  const Sp = { line: V.jag(f, [[-40, 770], [120, 774], [190, 806], [250, 780], [330, 770], [400, 800], [470, 772], [520, 800], [570, 764], [640, 776], [700, 812], [760, 800], [820, 822], [960, 812]], 7, 12) };
  { const d = E.norm(sub(Sp.line[Sp.line.length - 1], Sp.line[0])), n = [d[1], -d[0]]; Sp.ice = n[1] < 0 ? 1 : -1; }
  const ICEB = BAS({ fill: mix('#2e2a2c', P.ice, 0.42), shadow: '#1c2230', light: P.iceL });
  const HOTB = BAS({ fill: '#2a2224', shadow: '#080506', light: '#6a5a50' });
  const lava = (c, rx, ry, n, w = 2.2) => { for (let i = 0; i < n; i++) V.crackNet(f, V.scatter(f, c, rx, ry), f.r() * 6.3, V.R(f, 30, 60), w, { depth: 1, fork: 0.5, glowOp: 0.4 }); };
  const body = (pts, o = {}) => V.thermal(f, pts, Sp, o.iceL || ICEB, o.hotL || HOTB, Object.assign({ riftW: 2.6, nEmbers: 6, charAfter: () => { const bb = E.bbox(pts); lava([(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2 + 20], (bb[2] - bb[0]) / 2, (bb[3] - bb[1]) / 2, o.nLava ?? 3, o.lw ?? 2.2); }, iceAfter: () => { const bb = E.bbox(pts); V.frostCracks(f, [(bb[0] + bb[2]) / 2, bb[1] + 20], (bb[2] - bb[0]) / 2, 20, o.nFrost ?? 3); } }, o));
  const groove = (pts, w = 3, op = 0.6) => f.stroke(pts, w, '#0a0606', { op });
  // legs. Front: H shoulder point, K elbow, A wrist, T paw. Hind: H hip, K stifle, A hock, T paw.
  const LEG = {
    fn: { H: [610, 800], K: [566, 900], A: [608, 1004], T: [650, gy] },
    ff: { H: [628, 790], K: [592, 892], A: [578, 1002], T: [566, gy] },
    hn: { H: [244, 744], K: [308, 862], A: [198, 970], T: [228, gy] },
    hf: { H: [264, 736], K: [334, 852], A: [246, 962], T: [274, gy] },
  };
  const NK = [576, 712], HC = [742, 812], hA = 0.36; // neck base, skull centre (carried low), head angle
  f.joint('spine_1', [270, 730]).joint('spine_2', [400, 740], 'spine_1').joint('neck', NK, 'spine_2').joint('head', [700, 790], 'neck').joint('jaw', add(HC, rot([-20, 22], hA)), 'head').joint('tail', [168, 712], 'spine_1');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.H, par).joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }

  // one leg: three bones, each a muscled segment that overlaps the next; the paw bears the weight (flat pads, splayed toes)
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.3 : 0;
    const iceL = BAS({ fill: mix(mix('#2e2a2c', P.ice, 0.42), '#000', tone), shadow: '#1c2230', light: P.iceL }), hotL = BAS({ fill: mix('#2a2224', '#000', tone) });
    const seg = (a, b, wa, wb, o) => body(limb(a, b, wa, wb, Object.assign({ steps: 12, capK: 0.9 }, o)), { iceL, hotL, nLava: 1, lw: 1.6, nFrost: 1, riftW: 2, faint: true, nEmbers: 2 });
    if (part & 1) {
      f.bone(`leg_${k}_1`);
      if (front) seg(L.H, L.K, 78, 46, { p: [[0.55, 0.28, 0.2]], q: [[0.25, 0.1, 0.18]] }); // upper arm, triceps behind
      else seg(L.H, L.K, 132, 56, { p: [[0.4, 0.3, 0.22]], q: [[0.45, 0.16, 0.2]] }); // thigh: hamstrings behind, quadriceps in front
      groove(front ? [lp(L.H, L.K, 0.2, 16), lp(L.H, L.K, 0.75, 10)] : [lp(L.H, L.K, 0.15, -20), lp(L.H, L.K, 0.6, 4), lp(L.H, L.K, 0.9, 10)], 2.4, 0.55);
    }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      if (front) {
        seg(L.K, L.A, 46, 26, { q: [[0.22, 0.22, 0.18]] }); // forearm: extensors in front below the elbow, lean to the wrist
        const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]]; f.part([add(L.K, mul(nk, 10)), add(add(L.K, mul(nk, 30)), mul(dk, -6)), add(add(L.K, mul(nk, 30)), mul(dk, 14)), add(add(L.K, mul(nk, 12)), mul(dk, 24))], BAS({ fill: mix('#2a2224', '#000', tone + 0.1), inkW: 1.2, inkHeavy: 1.6, cast: false })); // the point of the elbow
      } else {
        seg(L.K, L.A, 60, 26, { p: [[0.22, 0.3, 0.18]] }); // gaskin: the calf muscle high behind
        const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]]; f.part([add(L.A, mul(nk, 6)), add(add(L.A, mul(nk, 24)), mul(dk, -8)), add(add(L.A, mul(nk, 22)), mul(dk, 8)), add(L.A, mul(dk, 14))], BAS({ fill: mix('#2a2224', '#000', tone + 0.1), inkW: 1.2, inkHeavy: 1.6, cast: false })); // the point of the hock
      }
      f.line([lp(L.K, L.A, 0.15, front ? -8 : 8), lp(L.K, L.A, 0.85, front ? -6 : 6)], 1.2, P.lampL, { op: 0.35 });
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T, pt = [T[0] - 10, gy - 34]; // the pastern runs down to the back of the paw, sloped
      body(K.chain([lerp(L.A, pt, -0.1), L.A, lerp(L.A, pt, 0.55), pt], [28, 26, 22, 30]), { iceL, hotL, nLava: 0, nFrost: 0, rift: false, nEmbers: 2 });
      V.seam(f, [lp(L.A, pt, 0.2, 2), lp(L.A, pt, 0.55, -2), lp(L.A, pt, 0.85, 1)], 1.2);
      if (front) f.part([add(L.A, [-12, -8]), add(L.A, [8, -12]), add(L.A, [14, 4]), add(L.A, [-2, 12]), add(L.A, [-12, 6])], BAS({ fill: mix('#2a2224', '#000', tone + 0.1), inkW: 1, inkHeavy: 1.4, cast: false })); // the knob of the wrist
      // the paw: heel pad behind, three knuckled toes splayed on the ground, blunt glass claws
      const X = u => T[0] + u * 34;
      f.part([[X(-0.9), gy - 4, 1], [X(-1.0), gy - 26], [X(-0.6), gy - 42], [X(0.2), gy - 44], [X(0.8), gy - 34], [X(1.3), gy - 18], [X(1.4), gy - 3, 1]], hotL);
      for (let i = 0; i < 3; i++) { const tx = X(0.05 + i * 0.42); f.part([[tx - 13, gy - 2, 1], [tx - 14, gy - 22], [tx - 4, gy - 32], [tx + 9, gy - 28], [tx + 15, gy - 14], [tx + 14, gy - 2, 1]], BAS({ fill: mix('#2a2224', '#000', tone - 0.05), inkW: 1.1, inkHeavy: 1.6, cast: false })); f.part([[tx + 10, gy - 16], [tx + 24, gy - 7], [tx + 22, gy - 1, 1], [tx + 12, gy - 4]], { fill: P.obs, shade: 0.3, inkW: 1, cast: false, light: P.obsL }); f.line([[tx - 6, gy - 26], [tx + 4, gy - 22]], 1, P.lampL, { op: 0.5 }); }
      f.part([[X(-1.0), gy - 22], [X(-0.65), gy - 32], [X(-0.45), gy - 14], [X(-0.8), gy - 3]], BAS({ inkW: 1, cast: false })); // the stopper pad behind
      V.glow(f, [X(0.4), gy], 40, 7, P.lamp, 0.35);
    }
  };

  // ---- far legs (behind the body)
  leg('hf', true); leg('ff', true);

  // ---- tail: carried low, a stone whip cracked in segments, the tip iced
  f.bone('tail');
  const tl = V.spline([[172, 712], [126, 756], [100, 840], [106, 912], [132, 956]], 6);
  const tk = tl.filter((_, i) => i % 3 === 0).concat([tl[tl.length - 1]]);
  f.part(K.chain(tk, tk.map((_, i, a) => 40 - i * 26 / a.length)), BAS({ fill: mix('#2e2a2c', P.ice, 0.3), light: P.iceL, shadow: '#1c2230' }));
  for (let i = 1; i < 5; i++) { const q = tl[Math.floor(i * tl.length / 5)], q2 = tl[Math.floor(i * tl.length / 5) + 1]; const d = E.norm(sub(q2, q)), n = [-d[1], d[0]]; f.line([add(q, mul(n, 16 - i * 2)), add(q, mul(n, -16 + i * 2))], 2, INK, { op: 0.8 }); }
  V.rimeCrust(f, tl.slice(0, Math.floor(tl.length * 0.7)).map(q => add(q, [-14, 0])), 6, [-1, 0], { gap: 7 });
  V.icicles(f, [tl[Math.floor(tl.length * 0.4)], tl[Math.floor(tl.length * 0.55)]].map(q => add(q, [6, 8])), 2, 10, 18);

  // ---- body: croup, a loin arched over a tucked waist, the ribcage deep to the elbow, the withers; cut at the loin
  const torso = [[166, 716], [210, 694], [290, 690], [350, 704], [420, 716], [490, 700], [548, 684], [596, 700], [636, 740], [656, 800], [640, 850], [596, 880], [530, 890], [460, 872], [404, 836], [356, 800], [316, 798], [278, 822], [226, 828], [176, 806], [150, 762]];
  const cut = [380, 720], cd = [1, 0];
  V.split(f, () => {
    body(torso, { nLava: 5, nFrost: 6, iceAfter: () => { V.frostCracks(f, [360, 720], 200, 24, 7); } });
    V.clipDraw(f, E.smooth(torso), () => {
      // form: the barrel of the ribs turning under, the tuck in shadow, the brisket's underside
      f.raw(`<path d="${E.smooth([[380, 860], [460, 890], [600, 900], [650, 840], [560, 850], [450, 840]])}" fill="#000" opacity="0.45" filter="url(#smk804)"/>`);
      f.raw(`<path d="${E.smooth([[300, 800], [360, 790], [410, 840], [330, 830]])}" fill="#000" opacity="0.5" filter="url(#smk804)"/>`);
      for (let i = 0; i < 6; i++) groove([[436 + i * 24, 744 + i * 3], [446 + i * 22, 800], [438 + i * 19, 862 - i * 4]], 3, 0.55); // ribs as stone ridges
      // the shoulder blade, laid back from the withers to the shoulder point; the haunch muscle over the hip
      groove([[540, 690], [570, 744], [604, 796]], 3.4, 0.7); groove([[520, 700], [548, 760], [580, 800]], 2, 0.4); f.line([[546, 692], [576, 744]], 1.4, P.iceL, { op: 0.5 });
      groove([[186, 714], [226, 740], [262, 786]], 3.4, 0.7); groove([[300, 700], [330, 740]], 2.4, 0.45);
    });
  }, [['spine_1', V.side(cut, mul(cd, -1), 40)], ['spine_2', V.side(cut, cd, 40)]]);
  // frost forming along the spine as it cools: a rime crust from the croup to the withers, icicles off the flank
  f.bone('spine_1');
  V.rimeCrust(f, [[162, 718], [210, 692], [290, 688], [356, 704]], 11, [-1, -0.2], { gap: 6 });
  V.icicles(f, [[190, 800], [250, 790], [330, 780]], 4, 10, 24);
  f.bone('spine_2');
  V.rimeCrust(f, [[356, 704], [420, 714], [490, 698], [550, 684]], 11, [-1, -0.2], { gap: 6 });
  V.icicles(f, [[400, 802], [470, 778], [530, 802]], 4, 12, 28);
  for (const x of [300, 450, 560]) V.steam(f, [x, Sp.line.find(q => q[0] >= x)[1]], 80, 16, { sway: 12, phase: x, op: 0.3 });

  // ---- near legs: the shoulder and haunch masses lie on the surface of the flank, the lower legs in front
  leg('hn', false, 1); leg('fn', false, 1);

  // ---- neck: thick, carried forward and down from the withers; an iron war-collar, spiked, bent open by the heat
  f.bone('neck');
  const neck = [[520, 688], [578, 684], [640, 708], [700, 746], [736, 790], [722, 846], [680, 860], [640, 846], [606, 812], [570, 772]];
  body(neck, { nLava: 2, nFrost: 2 });
  for (let i = 0; i < 4; i++) groove([[586 + i * 26, 706 + i * 12], [596 + i * 26, 752 + i * 8], [588 + i * 26, 800 + i * 6]], 2, 0.5); // rough coat as stone shards
  const cA = [618, 700], cM = [640, 760], cB = [646, 836];
  f.part(K.chain([cA, cM, cB], [22, 24, 22]), { fill: P.iron, shadow: '#0c0a0a', shade: 0.4, tex: 'mottle804', texOp: 0.6, inkW: 1.3 });
  for (const q of [lerp(cA, cM, 0.3), cM, lerp(cM, cB, 0.6)]) f.part([add(q, [8, -7]), add(q, [34, -2], 1), add(q, [8, 7])], { fill: P.ironL, shade: 0.35, inkW: 1.1, cast: false, sharp: true });
  f.part([[632, 768], [648, 768], [648, 786], [632, 786]], { fill: P.bone, shade: 0.3, inkW: 1, sharp: true }); f.line([[634, 772], [646, 782]], 1.2, INK); // the hold's mark
  f.flat(ell([630, 716], 6, 3, 0.5, 8), P.rust, { op: 0.6 });
  V.rimeCrust(f, [[524, 686], [580, 682], [640, 706], [690, 740]], 8, [-1, -0.3], { gap: 6 });

  // ---- head: a wolfhound's long skull carried low: occiput, brow, a clear stop, a long muzzle, flews; the jaw hangs on
  // its hinge under the ear and is parted on the molten heat; a rose ear folded back and rimed; an ember eye
  const HF = frame(HC, hA, 1);
  f.bone('jaw');
  const jR = pts => pts.map(([u, v]) => { const q = rot([u + 20, v - 22], 0.2); return [q[0] - 20, q[1] + 22]; }); // the jaw dropped on its hinge
  const jaw = HF(jR([[-30, 18], [0, 30], [56, 38], [104, 42], [118, 46], [114, 58], [82, 64], [30, 62], [-12, 54], [-36, 36]]));
  body(jaw, { nLava: 1, nFrost: 0, rift: false });
  V.clipDraw(f, E.smooth(jaw), () => { V.crackNet(f, HF(jR([[10, 50]]))[0], 0.3, 80, 1.8, { depth: 1 }); V.embers(f, HF(jR([[60, 50]]))[0], 40, 8, 6); });
  for (const [u, l] of [[92, 13], [104, 9], [114, 8]]) { const q = HF(jR([[u, 40]]))[0]; f.part([add(q, rot([-3.5, 0], hA)), add(q, rot([3.5, 0], hA)), add(q, rot([0, -l], hA))], { fill: P.bone, shade: 0.3, inkW: 0.9, inkHeavy: 1.2, cast: false }); } // lower canine and incisors
  for (let i = 0; i < 5; i++) { const q = HF(jR([[-4 + i * 20, 60 + (i % 2) * 3]]))[0]; f.stroke([q, add(q, [2, 10]), add(q, [-1, 18])], 4, mix(P.ice, '#2e2a2c', 0.62)); } // the wiry beard, frozen stiff
  f.bone('head');
  V.glow(f, HF([[70, 34]])[0], 64, 22, P.lamp, 0.5, false, hA);
  f.flat(HF([[-4, 26], [60, 28], [112, 30], [128, 34], ...jR([[110, 44], [56, 38], [0, 32]])]), '#3a0e06'); // the gape
  f.flat(HF([[10, 30], [60, 32], [100, 34], ...jR([[96, 40], [56, 36], [14, 32]])]), P.lamp); f.flat(HF([[40, 33], [80, 35], ...jR([[76, 38], [40, 35]])]), P.hot); // the molten heat inside
  const skull = HF([[-72, -12], [-64, -44], [-38, -64], [-4, -68], [22, -58], [36, -42], [46, -28], [88, -20], [124, -12], [140, 0], [138, 16], [124, 26], [92, 30], [56, 30], [20, 28], [-6, 30], [-30, 34], [-58, 22]]);
  body(skull, { nLava: 1, nFrost: 2, riftW: 2 });
  V.clipDraw(f, E.smooth(skull), () => {
    V.rimeCrust(f, HF([[-64, -46], [-34, -64], [10, -64], [36, -42], [80, -22], [120, -14]]), 7, [-1, -0.3], { gap: 6 });
    f.raw(`<path d="${E.smooth(HF([[-30, 0], [0, -6], [10, 20], [-10, 32], [-36, 26]]))}" fill="#ffffff" opacity="0.08" filter="url(#smk804)"/>`); // the round of the cheek muscle
  });
  groove(HF([[34, -44], [44, -30], [46, -16]]), 2.6, 0.75); // the stop
  groove(HF([[-36, 30], [-30, 6], [-40, -16]]), 2.2, 0.6); groove(HF([[60, -12], [110, -6]]), 1.6, 0.4); // the cheek muscle's edge, the muzzle's side
  groove(HF([[24, 28], [60, 30], [96, 30], [122, 26]]), 2.4, 0.8); // the flews' line
  // brow ridge, deep socket, ember eye; nose pad; upper canines
  f.flat(HF([[2, -30], [30, -34], [40, -22], [12, -16]]), '#0a0606', { op: 0.9 });
  V.glow(f, HF([[24, -24]])[0], 10, 7, P.lamp, 0.7);
  f.flat(ell(HF([[25, -24]])[0], 5, 2.6, hA, 8), P.lampL); f.flat(ell(HF([[27, -25]])[0], 1.8, 1.3, hA, 6), P.core);
  f.stroke(HF([[-8, -40], [18, -46], [42, -32]]), 6, '#0a0606');
  f.part(HF([[128, -8], [144, -2], [146, 14], [134, 20], [124, 8]]), { fill: P.obs, light: P.obsL, shade: 0.3, inkW: 1.2, cast: false });
  f.flat(ell(HF([[140, 8]])[0], 2.6, 2, hA, 6), '#000');
  for (const [u, l] of [[96, 16], [110, 10], [120, 8]]) { const q = HF([[u, 28]])[0]; f.part([add(q, rot([-3.5, 0], hA)), add(q, rot([3.5, 0], hA)), add(q, rot([0, l], hA))], { fill: P.bone, shade: 0.3, inkW: 0.9, inkHeavy: 1.2, cast: false }); }
  f.stroke(HF([[108, 40], [110, 56], [108, 72]]), 3, P.lamp); f.flat(ell(HF([[109, 78]])[0], 3, 4, 0, 8), P.hot); // molten drool
  const ear = HF([[-28, -56], [-50, -84], [-86, -86], [-104, -66], [-84, -56], [-54, -42]]);
  f.part(ear, ICEB); V.rimeCrust(f, HF([[-50, -84], [-86, -86], [-102, -68]]), 5, [-1, -0.2], { gap: 5 });
  f.line(HF([[-40, -56], [-74, -68]]), 1.2, INK, { op: 0.6 });
  V.icicle(f, HF([[-90, -64]])[0], 14, 5);
  V.ash(f, HF([[110, 34]])[0], 9, 30, 90, 1);
  V.steam(f, HF([[128, 30]])[0], 80, 16, { sway: 10, phase: 2, drift: 10, op: 0.3 });

  // ---- near lower legs, in front
  leg('hn', false, 6); leg('fn', false, 6);
  f.bone('root');
  for (const L of Object.values(LEG)) f.flat(ell(add(L.T, [10, 0]), 50, 5, 0, 12), P.iceS, { op: 0.4 });
  f.flat(ell([420, gy + 2], 340, 8, 0, 20), P.charS, { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ FISSURE WORM (cast, large 1.6, reared)
// A pale burrowing worm of the deep ice, reared out of a fissure in the glacier floor, swaying, its head bent toward the
// front rank with the round maw open: a lamprey's sucking disc seen at an angle, a fleshy fringed lip, the disc set
// with radial rows of dirty ice teeth hooking in toward a small throat that glows far down.
// The body is one muscular tube: a thick trunk with a heavy collar where it leaves the crack, then irregular annuli that
// bunch into deep creases on the inside of each bend and in a contracted band, and stretch thin where the body is
// drawn out (peristalsis). One ink edge runs the whole length, heavier on the shadow side.
// Split along its length, the line a jagged crack: the reared head end pale, rimed and icicled, frozen stiff; the trunk
// still in the crack seared dark, cracked on molten orange, wet with meltwater sheen and steaming; a tongue of rime has
// crept down one flank and a hot seam licks up the other.
// A miner's pick is still lodged in its side.
// Rig: crack (root) > seg_1 .. seg_8 (one chain up the body) > head.
function fissureWorm() {
  const CW = TIERS.large[0], CH = TIERS.large[1];
  const f = new Fig(V.base(807, CH)); V.textures(f);
  const gy = f.o.groundY;
  const ctrl = [[360, gy + 40], [386, 940], [356, 800], [316, 664], [320, 520], [372, 388], [462, 290], [562, 246], [642, 270], [692, 334]];
  const C = V.spline(ctrl, 4), S = V.arcLen(C), T = S[S.length - 1];
  const g = (t, c, s) => Math.exp(-(((t - c) / s) ** 2));
  // the width: thick trunk, a muscular collar at the crack, a bunched band, a contracted (stretched) band, the hood behind the maw
  const Wd = u => { const t = Math.max(0, Math.min(1, u / T)); return 292 - 118 * t + 44 * g(t, 0.1, 0.05) + 20 * g(t, 0.42, 0.05) - 26 * g(t, 0.6, 0.06) + 70 * g(t, 0.985, 0.035); };
  const NSEG = 8, segU = []; for (let i = 0; i <= NSEG; i++) segU.push(T * 0.08 + (T * 0.84) * i / NSEG);
  const AT = u => V.at(C, S, Math.max(0, Math.min(T, u)));
  // curvature (1/px, + when the body turns toward +n)
  const kap = u => { const a = AT(u - 10).d, b = AT(u + 10).d; return (a[0] * b[1] - a[1] * b[0]) / 20; };
  // final pass 2026-11-25: the body read as a ringed pipe (even width, even rings). Now each flank has its own lumps
  // (muscle knots, a sagging belly where it hangs, a pinched waist), the annuli come in bunched fold groups with
  // stretched smooth spans between, and the creases run oblique. A local PRNG keeps the rest of the figure's stream.
  const LR = (() => { let s = 80731; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const bumps = { 1: [], '-1': [] };
  for (const sd of [1, -1]) for (let k = 0; k < 9; k++) bumps[sd].push([0.12 + LR() * 0.78, 0.03 + LR() * 0.05, (LR() - 0.42) * 0.42]);
  bumps[-1].push([0.5, 0.07, 0.26], [0.7, 0.05, 0.14], [0.8, 0.035, -0.16]); bumps[1].push([0.6, 0.06, -0.14], [0.32, 0.04, 0.14], [0.8, 0.035, -0.12]); // the belly sags under the arch, the back is drawn tight over it
  const lump = (u, s) => { const t = u / T; let v = 0; for (const [c, w, a] of bumps[s >= 0 ? 1 : -1]) v += a * g(t, c, w); return v * (1 - g(t, 1, 0.07)); };
  // annuli in fold groups: three to six tight creases where the skin bunches, then a stretched span with one faint ring
  const ringsU = [], ringK = []; { let u = 24; while (u < T - 30) { const t = u / T, bend = Math.min(1, Math.abs(kap(u)) * 150), grp = LR() < 0.3 + 0.45 * bend + 0.4 * g(t, 0.42, 0.06) + 0.3 * g(t, 0.1, 0.05);
    if (grp) { const n = 3 + Math.floor(LR() * 3); for (let k = 0; k < n && u < T - 30; k++) { ringsU.push(u); ringK.push(0.2 + LR() * 0.3 + (k > 0 && k < n - 1 ? 0.3 : 0)); u += 15 + LR() * 12; } u += 40 + LR() * 50; }
    else { ringsU.push(u); ringK.push(-0.3 - LR() * 0.2); u += 70 + LR() * 60 + 30 * g(t, 0.6, 0.08); } } }
  const ringTilt = ringsU.map(() => (LR() - 0.5) * 0.36);
  // the edge: rolled out between creases inside a fold group, nearly straight across a stretched span
  const scal = (u, s) => { let best = 1e9, bk = 0, bw = 1e-6; for (let i = 0; i < ringsU.length; i++) { const d = Math.abs(u - ringsU[i]), wq = Math.exp(-((d / 28) ** 2)); best = Math.min(best, d); bk += ringK[i] * wq; bw += wq; } bk /= bw; const kk = Math.max(0, s * kap(u)) * Wd(u); return Math.min(1, best / 9) * Math.max(0.004, 0.02 + 0.07 * kk + 0.03 * g(u / T, 0.42, 0.05) + 0.045 * bk); };
  const edge = (u, s, k = 1) => { const a = AT(u); return add(a.p, mul(a.n, s * Wd(u) * 0.5 * (1 + scal(u, s) + lump(u, s)) * k)); };
  const halfW = (u, s) => Wd(u) * 0.5 * (1 + lump(u, s));
  const outline = (u0, u1, k = 1) => { const L = [], R2 = []; for (let u = u0; u <= u1 + 0.1; u += 5) { L.push(edge(u, 1, k)); R2.push(edge(u, -1, k)); } const a0 = AT(u0), w0 = Wd(u0) * 0.5 * k, cap = []; for (let j = 1; j < 10; j++) { const t = Math.PI * j / 10; cap.push(add(add(a0.p, mul(a0.n, -Math.cos(t) * w0)), mul(a0.d, -Math.sin(t) * w0 * 0.2))); } return [...L, ...R2.reverse(), ...cap]; };
  // the crack between the halves: oblique across the trunk, with a rime tongue down the +n flank and a seam up the other
  const E0 = (t, s) => edge(T * t, s);
  const Sp = { line: V.jag(f, [add(E0(0.3, 1), mul(AT(T * 0.3).n, 300)), E0(0.31, 1), add(E0(0.24, 0.6), [0, 0]), AT(T * 0.27).p, AT(T * 0.36).p, add(AT(T * 0.4).p, mul(AT(T * 0.4).n, -0.3 * Wd(T * 0.4))), E0(0.38, -1), add(E0(0.38, -1), mul(AT(T * 0.38).n, -300))], 9, 13) };
  { const d = E.norm(sub(Sp.line[Sp.line.length - 1], Sp.line[0])), n = [d[1], -d[0]]; Sp.ice = n[1] < 0 ? 1 : -1; }
  const NI = { inkW: 0, inkHeavy: 0 };
  const PALE = { fill: '#c8c4bc', shadow: '#5e5a6a', light: '#f0eee8', shade: 0.36, tex: 'mottle807', texOp: 0.55, maxShade: 12 };
  const ICEW = Object.assign(V.rimed(PALE, 0.25), NI, { shade: 0, hi: 0 }), SEAR = Object.assign({ fill: '#3e3230', shadow: P.charS, light: '#6e5a4e', shade: 0, hi: 0, tex: 'craze807', texOp: 0.6 }, NI);
  f.joint('crack', [370, gy]);
  for (let i = 0; i < NSEG; i++) f.joint('seg_' + (i + 1), AT(segU[i]).p, i ? 'seg_' + i : 'crack');
  f.joint('head', AT(segU[NSEG]).p, 'seg_' + NSEG);

  // ---- the fissure behind: the far lip of the crack, ice slabs heaved up, glow from below
  f.bone('crack');
  V.glow(f, [370, gy - 20], 280, 60, P.lamp, 0.45, true);
  f.part([[60, gy - 10], [150, gy - 60], [250, gy - 70], [300, gy - 40], [460, gy - 44], [560, gy - 80], [700, gy - 64], [830, gy - 20], [840, gy], [60, gy]], V.ICE(f, { fill: P.iceM, maxShade: 30 }));
  for (const [a, b, c, d] of [[[100, gy - 50], [170, gy - 150], [240, gy - 130], [230, gy - 50]], [[540, gy - 60], [620, gy - 170], [710, gy - 140], [670, gy - 50]]]) { f.part([a, b, c, d].map(q => [...q, 1]), V.ICE(f, { fill: P.ice })); f.line([lerp(a, b, 0.5), lerp(d, c, 0.6)], 1.2, INK, { op: 0.5, straight: true }); V.rimeCrust(f, [b, c], 7, [-1, -0.2]); V.icicles(f, [lerp(a, b, 0.1), lerp(a, b, 0.6)], 2, 10, 20); }

  // ---- the body, one bone per segment from the crack up; each part overlaps the one below and carries no ink of its own
  for (let i = 0; i < NSEG; i++) {
    f.bone('seg_' + (i + 1));
    const u0 = segU[i] - (i ? 16 : 90), u1 = segU[i + 1] + 4, mid = (u0 + u1) / 2;
    const pts = outline(u0, u1);
    const d = V.thermal(f, pts, Sp, ICEW, SEAR, { riftW: 3, nFacets: 2, rimeOp: 0.35, nEmbers: 6,
      charAfter: () => { V.crackNet(f, AT(mid).p, AT(mid).d[0] > 0 ? 0.2 : 3.3, Wd(mid) * 0.4, 2.4, { depth: 1 }); for (let k = 0; k < 3; k++) { const a = AT(mid + (k - 1) * 18); f.line([add(a.p, mul(a.n, -Wd(mid) * 0.12)), add(AT(mid + (k - 1) * 18 + 22).p, mul(a.n, -Wd(mid) * 0.16))], 2.2, '#c8b8a8', { op: 0.55 }); } }, // wet sheen streaks
      iceAfter: () => { V.frostCracks(f, AT(mid).p, Wd(mid) * 0.3, 30, 2); } });
    V.clipDraw(f, d, () => {
      // annuli inside this segment: a crease across the body (bowed toward the tail end, as a ring seen from below)
      // with a pale lip above it; deep where the body bunches, faint where it is drawn out
      for (let ri = 0; ri < ringsU.length; ri++) { const r = ringsU[ri]; if (r < u0 - 2 || r > u1 + 2) continue; const a = AT(r), w = Wd(r) * 0.5, t = r / T, deep = Math.max(0.05, Math.min(1, 0.3 + ringK[ri] + 0.7 * g(t, 0.42, 0.06) + 0.5 * g(t, 0.1, 0.05) + 2.2 * Math.abs(kap(r)) * w - 0.3 * g(t, 0.6, 0.07))), tl = ringTilt[ri], bow = 0.1 + 0.08 * f.r();
        const arc = []; for (let k = 0; k <= 12; k++) { const th = Math.PI * k / 12, sd = Math.cos(th) > 0 ? 1 : -1, ww = halfW(r, sd) * (1 + scal(r, sd)); arc.push(add(add(a.p, mul(a.n, Math.cos(th) * ww)), mul(a.d, -Math.sin(th) * ww * bow + Math.cos(th) * ww * tl))); }
        // a faint ring only shows at the edges; a deep crease runs right across
        const k0 = deep > 0.6 ? 0 : Math.floor(f.r() * 3), k1 = deep > 0.6 ? 12 : 12 - Math.floor(f.r() * 3), seg2 = deep > 0.45 ? arc.slice(k0, k1 + 1) : (f.r() < 0.5 ? arc.slice(0, 4) : arc.slice(9));
        f.line(seg2, 1 + deep * 2.6, '#1e1a22', { op: 0.3 + deep * 0.45 });
        if (deep > 0.45) f.line(arc.slice(3, 9).map(q => add(q, mul(a.d, 3 + deep * 3))), 1 + deep * 1.4, '#f6f2ea', { op: 0.2 + deep * 0.3 });
        // on the inside of a bend the crease folds the skin into a short wrinkle at the edge
        const si = kap(r) > 0 ? 1 : -1; if (Math.abs(kap(r)) * w > 0.25) { const q = edge(r, si); f.line([q, add(q, mul(a.n, -si * w * 0.3))], 1.6, '#1e1a22', { op: 0.5 }); }
        // a stretched span: the skin pulled thin along the body, fine lengthwise stretch lines instead of rings
        if (ringK[ri] < 0) for (let k = 0; k < 3; k++) { const v = (LR() - 0.5) * 1.3, ua = r + 8 + LR() * 10, ub = ua + 26 + LR() * 30, pts2 = []; for (let uu = ua; uu <= ub; uu += 6) { const b = AT(uu); pts2.push(add(b.p, mul(b.n, v * halfW(uu, v > 0 ? 1 : -1)))); } f.line(pts2, 1, '#1e1a22', { op: 0.28 }); }
      }
      // pits and grit ground into the hide
      for (let k = 0; k < 5; k++) { const q = add(AT(mid + (f.r() - 0.5) * 50).p, mul(AT(mid).n, (f.r() - 0.4) * Wd(mid) * 0.7)); f.flat(ell(q, 2.5 + f.r() * 3, 2 + f.r() * 2, f.r() * 3, 8), i > 2 ? '#5a5664' : '#120a08', { op: 0.7 }); }
    });
    // bristles (setae) along the sides, frosted on the pale end
    for (const sg of [1, -1]) for (let k = 0; k < 2; k++) { const a = AT(mid + (k - 0.5) * 26), q = edge(mid + (k - 0.5) * 26, sg); f.line([q, add(q, add(mul(a.n, sg * 11), mul(a.d, -6)))], 1.4, i > 2 ? P.iceL : P.char, { op: 0.8, straight: true }); }
    if (i === 4) for (let k = 0; k < 3; k++) f.line([add(AT(mid - 20).p, [-40 + k * 14, -10]), add(AT(mid + 10).p, [-10 + k * 14, 10])], 2.4, '#e8e4da', { op: 0.7 }); // old claw rakes healed pale
    if (i === 3) { // a miner's pick still lodged in its side, the haft rimed, a rope tangle hanging off it
      const q = add(AT(mid).p, mul(AT(mid).n, -Wd(mid) * 0.18)), hd = E.norm([-0.9, 0.42]), he = add(q, mul(hd, 150));
      f.part(limb(q, he, 13, 12, { steps: 6 }), Object.assign(V.rimed({ fill: P.wood, shadow: P.woodD }, 0.35), { tex: 'wood807', texOp: 0.6 }));
      V.rimeCrust(f, [lerp(q, he, 0.3), lerp(q, he, 0.95)].map(z => add(z, [0, -6])), 4, [-1, -0.3], { gap: 6 });
      const PH = frame(q, Math.atan2(hd[1], hd[0]) + Math.PI / 2, 1);
      f.part(PH([[-12, -10], [-70, -4], [-96, 2, 1], [-66, 6], [-12, 10]]), { fill: mix(P.iron, P.ice, 0.3), shade: 0.4, inkW: 1.2, tex: 'rime807', texOp: 0.6 });
      f.flat(ell(q, 12, 9, 0.4, 10), '#1a0e0c'); f.part(PH([[-12, -12], [12, -12], [12, 12], [-12, 12]]), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false });
      V.rope(f, [lerp(q, he, 0.8), add(lerp(q, he, 0.8), [-8, 40]), add(lerp(q, he, 0.8), [6, 80]), add(lerp(q, he, 0.8), [-4, 110])], 5, { col: mix('#6a5e48', P.ice, 0.3) });
      V.icicle(f, add(lerp(q, he, 0.8), [-4, 110]), 16, 5);
      f.flat(ell(add(q, [10, 16]), 4, 10, 0.2, 8), '#6a1e14', { op: 0.6 }); // a dark old wound weep
    }
  }

  // ---- the body's own shading and its one ink edge, per segment so the rig keeps them
  { const step = 6;
    for (let i = 0; i < NSEG; i++) {
      f.bone('seg_' + (i + 1));
      const u0 = segU[i] - (i ? 0 : 90), u1 = segU[i + 1] + (i < NSEG - 1 ? 0 : 4), B2 = [], L3 = [], EL = [], ER = [];
      for (let u = u0; u <= u1; u += step) { const a = AT(u); B2.push(edge(u, -1, 1.02)); L3.push(add(a.p, mul(a.n, -Wd(u) * (0.08 - 0.5 * lump(u, -1) + 0.25 * lump(u, 1) + 0.06 * Math.sin(u * 0.037 + 1) * Math.sin(u * 0.011))))); EL.push(edge(u, 1)); ER.push(edge(u, -1)); }
      V.clipDraw(f, E.smooth(outline(u0 - (i ? 16 : 0), u1 + 4)), () => { f.flat([...B2, ...L3.slice().reverse()], '#262432', { op: 0.42 }); f.raw(`<path d="${E.smooth([...B2, ...L3.slice().reverse()])}" fill="url(#xhatch807)" opacity="0.45"/>`); f.line(EL.map((q, k) => add(q, mul(AT(u0 + k * step).n, -Wd(u0 + k * step) * 0.16))), 3, '#ffffff', { op: 0.16 }); });
      f.line(EL, 2.2, INK); f.line(ER, 3.6, INK);
    }
  }
  // the collar where it leaves the crack: a heavy ring of muscle, three deep folds, seared and glowing in the creases
  f.bone('seg_1');
  for (let k = 0; k < 3; k++) { const r = T * (0.075 + k * 0.025), a = AT(r), w = Wd(r) * 0.52, arc = []; for (let j = 0; j <= 12; j++) { const th = Math.PI * j / 12; arc.push(add(add(a.p, mul(a.n, Math.cos(th) * w)), mul(a.d, -Math.sin(th) * w * 0.16))); } V.seam(f, arc.slice(1, 12), 2.6 - k * 0.5, { glowOp: 0.25 }); }
  V.steam(f, edge(T * 0.12, 1), 140, 30, { sway: 16, phase: 0.4, op: 0.32, big: true }); V.steam(f, edge(T * 0.16, -1), 120, 26, { sway: 16, phase: 2.1, op: 0.3, big: true });
  V.melt(f, edge(T * 0.2, -0.7), 40); V.melt(f, edge(T * 0.24, 0.6), 34);
  // the crossing: a rime tongue creeping down one flank, a hot seam licking up into the ice on the other
  f.bone('seg_3');
  V.rimeCrust(f, [edge(T * 0.31, 0.98), edge(T * 0.26, 0.98), edge(T * 0.22, 0.95)], 8, [-1, -0.2], { gap: 6 });
  V.crackNet(f, edge(T * 0.39, -0.6), -1.9, 70, 2.2, { depth: 1 });

  // ---- the head: the hood behind the maw, and the maw itself, a sucking disc turned three-quarter toward us
  f.bone('head');
  const hU = segU[NSEG], hd2 = AT(T).d, hn2 = AT(T).n, mA = Math.atan2(hd2[1], hd2[0]);
  const headP = outline(hU - 16, T - 4, 1.0);
  const hdD = V.thermal(f, headP, Sp, ICEW, SEAR, { rift: false, nFacets: 3, rimeOp: 0.45 });
  f.line(headP.slice(0, Math.floor(headP.length / 2) - 4), 2.2, INK); f.line(headP.slice(Math.floor(headP.length / 2) + 4, headP.length - 9), 3.6, INK);
  V.clipDraw(f, hdD, () => { for (let k = 0; k < 4; k++) { const r = hU + 10 + k * 18, a = AT(r), w = Wd(r) * 0.5, arc = []; for (let j = 0; j <= 10; j++) { const th = Math.PI * j / 10; arc.push(add(add(a.p, mul(a.n, Math.cos(th) * w)), mul(a.d, -Math.sin(th) * w * 0.14))); } f.line(arc, 2.4, '#1e1a22', { op: 0.6 }); f.line(arc.slice(2, 8).map(q => add(q, mul(a.d, 4))), 1.6, '#f6f2ea', { op: 0.4 }); } });
  // the disc: an uneven fleshy rim (wobbled, not a lens), a fringe of papillae, the cupped inner face
  const mc = add(AT(T).p, mul(hd2, 4)), rx = Wd(T) * 0.56, ry = Wd(T) * 0.27; // rx across the body, ry along it (foreshortened)
  const D = (c, pts) => pts.map(([u, v]) => add(c, rot([v, u], mA))); // u across (along n), v along the body axis
  const wob = (a, b, ph, n = 24) => { const r = []; for (let k = 0; k < n; k++) { const t = Math.PI * 2 * k / n, j = 1 + 0.07 * Math.sin(t * 3 + ph) + 0.05 * Math.sin(t * 5 + ph * 2); r.push([Math.cos(t) * a * j, Math.sin(t) * b * j]); } return r; };
  const LIP = { fill: '#b6aca4', shadow: '#4e4656', light: '#ece6de', shade: 0.4, tex: 'mottle807', texOp: 0.5, maxShade: 10, inkW: 1.6, inkHeavy: 2.4, cast: false };
  const rim = wob(rx, ry, 0.7);
  rim.forEach(q => { if (f.r() < 0.7) f.part(ell(D(mc, [[q[0] * 1.06, q[1] * 1.08]])[0], 4 + f.r() * 4, 3 + f.r() * 2, f.r() * 3, 7), Object.assign({}, LIP, { inkW: 0.8, inkHeavy: 1, shade: 0.2 })); }); // papillae
  f.part(D(mc, rim), LIP);
  const tc = add(mc, mul(hd2, 4)), inner = rim.map(q => [q[0] * 0.8, q[1] * 0.76]);
  f.part(D(tc, inner), { fill: '#b2a29c', shadow: '#4a3a44', shade: 0.45, inkW: 1.2, inkHeavy: 1.4, cast: false, hatch: false, tex: 'mottle807', texOp: 0.5 });
  for (let k = 0; k < 16; k++) { const a = Math.PI * 2 * k / 16; f.line(D(tc, [[Math.cos(a) * rx * 0.3, Math.sin(a) * ry * 0.3], [Math.cos(a + 0.1) * rx * 0.74, Math.sin(a + 0.1) * ry * 0.72]]), 1.2, '#4a3a44', { op: 0.5 }); } // furrows of the disc
  // radial rows of hooked ice teeth on the disc face, all pointing in toward the throat, smaller toward it
  const thr = add(tc, rot([ry * 0.18, -rx * 0.22], mA)); // the throat sits off-centre, toward the far side of the disc
  for (let k = 0; k < 13; k++) { const a = Math.PI * 2 * k / 13 + 0.2 + (f.r() - 0.5) * 0.2; for (const r of [0.72, 0.55, 0.38]) { if (f.r() < 0.1) continue; const rr = r + (f.r() - 0.5) * 0.06, base = D(tc, [[Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]])[0], inw = E.norm(sub(thr, base)), sd = [-inw[1], inw[0]], l = (8 + r * 22 + f.r() * 6), w = (4 + r * 8);
    f.part([[...add(base, mul(sd, w / 2)), 1], [...add(lerp(base, add(base, mul(inw, l)), 0.6), mul(sd, w * 0.25))], [...add(base, mul(inw, l)), 1], [...add(base, mul(sd, -w / 2)), 1]], { fill: mix(P.glass, '#8a8a80', 0.2 + f.r() * 0.3), shadow: P.iceS, light: P.iceL, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, tex: 'crack807', texOp: 0.6 });
    f.line([base, add(base, mul(inw, l * 0.6))], 0.8, P.iceL, { op: 0.6 }); } }
  // the throat: a puckered, irregular gullet off to the far side of the disc, its creases radiating, a dull glow far down
  const thO = []; for (let k = 0; k < 14; k++) { const t = Math.PI * 2 * k / 14, rr = k % 2 ? 0.55 : 1; thO.push([Math.cos(t) * rx * 0.2 * rr, Math.sin(t) * ry * 0.3 * rr]); }
  f.flat(D(thr, thO), '#120707');
  for (let k = 0; k < 7; k++) { const t = Math.PI * 2 * k / 7; f.line(D(thr, [[Math.cos(t) * rx * 0.12, Math.sin(t) * ry * 0.18], [Math.cos(t) * rx * 0.3, Math.sin(t) * ry * 0.42]]), 1.4, '#2a1c22', { op: 0.7 }); }
  V.glow(f, add(thr, mul(hd2, -4)), rx * 0.07, ry * 0.08, P.lamp, 0.25, false, mA + Math.PI / 2);
  const tg = add(thr, rot([ry * 0.22, rx * 0.18], mA)); f.part(D(tg, wob(rx * 0.1, ry * 0.12, 3, 10)), { fill: '#8e8088', shade: 0.4, inkW: 1, cast: false }); for (let k = -1; k <= 1; k++) { const p = D(tg, [[k * rx * 0.05, 0]])[0], inw = E.norm(sub(thr, p)); f.flat([add(p, [-2.5, 0]), add(p, [2.5, 0]), add(p, mul(inw, 9))], '#c8ccd0'); } // the rasping tongue
  f.line(D(mc, rim.slice(13, 22).map(q => [q[0] * 0.96, q[1] * 0.96])), 1.6, '#f4ecd8', { op: 0.55 }); // wet rim
  // frost on the crown of the head, icicles off the lip, the frozen breath
  V.rimeCrust(f, outline(hU, T - 10, 1.0).slice(0, 10), 10, [-1, -0.3], { gap: 6 });
  V.icicles(f, D(mc, rim.slice(4, 9).map(q => [q[0] * 1.02, q[1] * 1.02])), 4, 12, 28);
  V.steam(f, add(mc, mul(hd2, 24)), 90, 20, { sway: 14, phase: 1.3, drift: 20, op: 0.32 });

  // ---- the near lip of the crack in front of the body, its broken ice edge glowing
  f.bone('crack');
  f.part([[40, gy + 40], [120, gy - 6], [230, gy - 18], [300, gy - 2], [440, gy - 6], [520, gy - 22], [640, gy - 10], [760, gy - 2], [880, gy + 30], [880, gy + 40]], V.ICE(f, { fill: P.ice, maxShade: 30 }));
  V.seam(f, [[230, gy - 16], [300, gy - 4], [380, gy - 6], [450, gy - 6], [520, gy - 20]], 4);
  V.rimeCrust(f, [[60, gy + 10], [120, gy - 8], [220, gy - 18]], 7, [-1, -0.1]); V.rimeCrust(f, [[540, gy - 20], [640, gy - 12], [760, gy - 4]], 7, [1, -0.1]);
  V.frostCracks(f, [160, gy + 10], 80, 10, 4); V.frostCracks(f, [680, gy + 10], 90, 10, 4);
  for (let i = 0; i < 3; i++) V.steam(f, [300 + i * 70, gy - 8], 140 + i * 20, 24, { sway: 18, phase: i * 2, op: 0.28, big: true });
  return f;
}

// ------------------------------------------------------------------ TWINFLAME SEERESS (elite, 1.9)
// The hold's old seeress, leaning her weight on the fire staff planted ahead of her: the staff slants back to her hand,
// the arm braced straight down on it, the shoulders and head carried forward over it; her back leg is straight and
// carries the rest, the front knee is bent and slack under the robe, the hip on that side dropped. The frost staff is
// carried loose in the other hand, tilted back, its butt off the ice. One head, two faces under one crown of braids: the face that looks ahead burns, the face that
// looks back has frozen solid; both mouths murmur. Split: the head front / back (the two faces); the robe on a diagonal
// from the back of the shoulders to the front of the hem: everything above and ahead of it charred, below and behind
// it rimed.
// Rig: standard humanoid + staff_fire (on hand_f) + staff_frost (on hand_n) + mantle + skirt + charms.
function seeress() {
  const CW = TIERS.elite[0], CH = TIERS.elite[1];
  const f = new Fig(V.base(802, CH)); V.textures(f);
  const gy = f.o.groundY, H = 176;
  const N = [600, 414], C = [536, 580], Pv = [512, 796];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.22, 0.1), SF = S.at(0.42, 0.08);
  const fsB = [892, gy], fsT = [770, 168], rsB = [384, gy - 74], rsT = [258, 196];
  const onF = y => [fsB[0] + (fsT[0] - fsB[0]) * (fsB[1] - y) / (fsB[1] - fsT[1]), y], onR = y => [rsB[0] + (rsT[0] - rsB[0]) * (rsB[1] - y) / (rsB[1] - rsT[1]), y];
  const EF = [726, 528], WF = onF(546), EN = [418, 610], WN = onR(704);
  const HC = [628, 286], hA = 0.14;
  const HN = S.at(-0.25, 0.98), HF = S.at(0.3, 0.98), KN = [456, 1060], AN = [420, 1300], KF = [660, 1030], AF = [640, 1300];
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.85), N: S.at(0.15, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('staff_fire', WF, 'hand_f').joint('staff_frost', WN, 'hand_n').joint('mantle', S.at(0, 0.05), 'torso').joint('skirt', S.at(0, 0.9), 'pelvis').joint('charms', S.at(0.2, 0.86), 'pelvis');
  const Sp = { line: V.jag(f, [[300, 180], [440, 380], [520, 520], [470, 600], [560, 660], [640, 900], [700, 1000], [640, 1060], [760, 1200], [860, 1460]], 10, 14), ice: 0 };
  { const d = E.norm(sub(Sp.line[Sp.line.length - 1], Sp.line[0])), n = [d[1], -d[0]]; Sp.ice = n[0] < 0 ? 1 : -1; } // the rime goes behind and below the diagonal
  const WOOLl = V.WOOL(f, { fill: '#5e584e', maxShade: 60 }), FURl = V.FUR(f, { fill: '#6a6258', maxShade: 40 });
  const skinW = '#c4ae9c', SKO = { fill: skinW, shadow: '#5a4048', shade: 0.34, tex: 'mottle802', texOp: 0.45 };
  const runes = (c, n, ang = 0, col = '#c8bca4') => { for (let i = 0; i < n; i++) { const q = add(c, rot([i * 22, 0], ang)), k = i % 4; const g = k === 0 ? [[0, -8], [0, 8], [6, -2]] : k === 1 ? [[-5, 8], [0, -8], [5, 8]] : k === 2 ? [[0, -8], [0, 8], [-5, -3], [5, 3]] : [[-5, -8], [5, 0], [-5, 8]]; f.line(g.map(p => add(q, rot(p, ang))), 1.6, col, { op: 0.85, dash: '3 1.5', straight: true }); } };

  // ---- the frost staff, planted behind (drawn first: it is behind her)
  f.bone('staff_frost');
  f.part(K.chain([rsB, lerp(rsB, rsT, 0.35), lerp(rsB, rsT, 0.7), rsT], [20, 22, 20, 24], { bp: [[1, 0.5, 0.15], [2, 0.3, 0.2]] }), Object.assign(V.rimed({ fill: P.bone, shadow: P.boneD }, 0.2), { tex: 'crack802', texOp: 0.6 })); // a whale-bone staff, knotted
  for (const t of [0.2, 0.45, 0.62]) f.line([lp(rsB, rsT, t, -12), lp(rsB, rsT, t + 0.01, 12)], 1.6, INK, { op: 0.6 });
  // its head: a forked antler crown holding a holed stone crusted in rime, icicles hanging off every tine
  const RH = frame(rsT, Math.atan2(rsT[1] - rsB[1], rsT[0] - rsB[0]), 1);
  for (const [a, l] of [[-0.6, 90], [0.5, 80], [-0.1, 110]]) { const tip = RH([[l, a * 70]])[0]; f.part(K.chain([RH([[0, 0]])[0], lerp(RH([[0, 0]])[0], tip, 0.5), tip], [18, 12, 6]), V.rimed({ fill: P.bone, shadow: P.boneD }, 0.3)); V.icicles(f, [lerp(RH([[0, 0]])[0], tip, 0.4), tip], 2, 14, 32); }
  const st = RH([[60, -4]])[0];
  // eye audit 2026-11-23: a round grey disc with a black hole in its centre, held up between the tines, read as an eye
  // on a stalk (an eye motif outside a void world). The stone is now a lumpy, longer river stone, and the hole worn
  // through it is a narrow, ragged slot near its upper edge (a thong runs through it), not a centred dark pupil.
  const stP = V.lumpy(f, ell(st, 38, 24, 0.75, 14), 6);
  f.part(stP, V.ICE(f, { fill: mix(P.greyD, P.ice, 0.4) }));
  const sh = [add(st, rot([-14, -10], 0.75)), add(st, rot([2, -14], 0.75)), add(st, rot([12, -12], 0.75)), add(st, rot([3, -9], 0.75))];
  f.flat(sh, '#0e0c10'); // the slot worn through it
  f.line([sh[1], add(sh[1], [6, 20]), add(sh[1], [2, 34])], 1.6, P.leathD); // a thong through the slot
  V.rimeCrust(f, stP.slice(9, 14), 7, [-1, -0.3], { gap: 5 });
  V.icicles(f, stP.slice(2, 6), 3, 16, 34);
  runes(add(st, [-14, 14]), 2, 0.3, '#2a2430');
  f.line([lp(rsB, rsT, 0.88, 10), add(lp(rsB, rsT, 0.88, 10), [8, 50]), add(lp(rsB, rsT, 0.88, 10), [2, 90])], 2, P.leathD); // a thong of charms
  f.part(ell(add(lp(rsB, rsT, 0.88, 10), [2, 100]), 7, 12, 0, 10), { fill: P.bone, shade: 0.4, inkW: 1, cast: false });

  // ---- far arm (fire staff arm) behind the body: wool sleeve, the hand charred
  V.armRig(f, SF, EF, WF, [70, 60, 50], () => {
    V.thermal(f, K.chain([SF, lerp(SF, EF, 0.5), EF, lerp(EF, WF, 0.6)], [78, 74, 64, 56], { bq: [[1, 0.5, 0.1]] }), Sp, V.rimed(WOOLl), V.charred(WOOLl, 0.55), { faint: true, riftW: 2.4 });
    runes(lp(EF, WF, 0.1, 10), 3, V.ang(EF, WF));
  }, '_f');
  f.bone('forearm_f');
  f.part(K.chain([lerp(EF, WF, 0.55), WF], [60, 52]), V.charred(FURl, 0.45)); // fur cuff
  // ---- legs under the robe (hidden in the rest pose; there for the rig) and fur boots at the hem
  for (const [sfx, Hp, Kn, A] of [['_f', HF, KF, AF], ['_n', HN, KN, AN]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 110, 90), V.charred(WOOLl, 0.3));
    f.bone('shin' + sfx); f.part(limb(Kn, A, 90, 70), V.rimed(WOOLl, 0.3));
    V.footRig(f, Kn, A, 92, () => {
      V.sides(f, Sp, () => B.boot(f, A, 1, 92, mix(P.fur, P.ice, 0.4), { shaft: 0.8, tex: 'fur802', texOp: 0.6 }), () => B.boot(f, A, 1, 92, mix(P.fur, P.char, 0.5), { shaft: 0.8, tex: 'craze802', texOp: 0.6 }));
      for (let i = 0; i < 4; i++) f.line([add(A, [-36 + i * 4, -60 + i * 18]), add(A, [40 - i * 4, -66 + i * 18])], 2.4, P.leathD, { op: 0.8 }); // binding thongs
    }, sfx);
  }

  // ---- the robe: heavy rune-stitched wool to the ground, cut at the belt; frozen stiff and icicled behind, the front
  // burned through, its hem charred
  const robeTop = S.shape([[-0.06, 0.4, 0.36], [0.08, 0.7, 0.54], [0.25, 0.8, 0.7], [0.5, 0.74, 0.68], [0.72, 0.72, 0.62], [0.9, 0.84, 0.66]]);
  const robe = [...robeTop.slice(0, 6), [700, 900], [756, 1030], [770, 1200], [800, 1336], [740, 1348, 1], [690, 1336], [640, 1350, 1], [580, 1338], [520, 1352, 1], [460, 1338], [400, 1350, 1], [360, 1330], [372, 1200], [380, 1040], [400, 900], ...robeTop.slice(6)];
  const WB = S.at(0, 0.88), dW = S.T(0.88);
  V.split(f, () => {
    V.thermal(f, robe, Sp, V.rimed(WOOLl, 0.5), V.charred(WOOLl, 0.6), { riftW: 3.4, nFacets: 8, nEmbers: 14, charAfter: () => { V.crackNet(f, [640, 640], 1.6, 160, 2.6, { depth: 2 }); V.crackNet(f, [700, 1000], 1.4, 130, 2.4, { depth: 2 }); V.flakes(f, [700, 1200], 50, 80, 10, 1.4); for (const [x, y, r] of [[660, 760, 14], [720, 1150, 18], [610, 900, 10]]) { f.flat(lumpyEll(f, [x, y], r), '#0a0606'); f.line(ell([x, y], r + 3, r * 0.8 + 3, 0.3, 12).slice(0, 8), 2, P.lamp, { op: 0.8 }); } }, iceAfter: () => { V.frostCracks(f, [460, 1000], 60, 200, 8); } });
    for (const [a, b2, c] of [[[440, 860], [420, 1060], [410, 1320]], [[520, 880], [520, 1100], [500, 1330]], [[600, 880], [640, 1020], [620, 1330]], [[690, 1040], [720, 1180], [750, 1320]], [[650, 1060], [680, 1200], [690, 1330]]]) f.stroke([a, b2, c], 3.2, '#14100e', { op: 0.7 }); // straight folds off the standing leg, folds dragged off the bent front knee
    f.raw(`<ellipse cx="690" cy="1010" rx="60" ry="40" fill="#ffffff" opacity="0.12" filter="url(#smk802)"/>`); for (const a of [[[640, 960], [690, 1000]], [[640, 1080], [700, 1030]], [[620, 1020], [680, 1012]]]) f.stroke(a, 3, '#14100e', { op: 0.6 }); // the knee pushing the robe
    // a broad stitched rune band above the hem and a fur trim at the hem itself
    V.clipDraw(f, E.smooth(robe), () => {
    f.part([[340, 1200], [800, 1236], [806, 1276], [336, 1244]], { fill: mix(P.wool, '#2a2620', 0.4), shade: 0.4, tex: 'weave802', texOp: 0.6, inkW: 1.2, cast: false });
    runes([380, 1226], 19, 0.085, '#d4c8b0');
    f.line([[370, 1204], [770, 1240]], 1.2, '#d4c8b0', { op: 0.7, dash: '4 3' }); f.line([[368, 1242], [774, 1278]], 1.2, '#d4c8b0', { op: 0.7, dash: '4 3' });
    for (let i = 0; i < 24; i++) { const x = 366 + i * 18, y = 1300 + (x - 366) * 0.04; f.stroke([[x, y - 20], [x + 3, y + 4], [x - 2, y + 30]], 9, i % 2 ? '#5e564e' : '#4a443e', { op: 0.85 }); }
    });
    // patches darned on, a scorched hole, a long rent
    f.part([[440, 960], [500, 956], [504, 1030], [444, 1034]], { fill: mix(P.wool, '#3a3428', 0.4), shade: 0.4, tex: 'weave802', texOp: 0.6, inkW: 1.2, sharp: true });
    f.stitches([[440, 960], [500, 956], [504, 1030], [444, 1034], [440, 960]], '#d4c8b0', 1);
    f.line([[560, 1080], [566, 1120], [560, 1170]], 3, '#14100e'); f.stitches([[552, 1086], [570, 1100], [552, 1120], [570, 1140], [554, 1160]], '#c8bca4', 1);
    for (const [a, b2, c] of [[[400, 900], [390, 1000], [384, 1120]], [[480, 880], [470, 980], [470, 1180]], [[560, 900], [580, 1020], [590, 1180]]]) f.stroke([a, b2, c], 4.4, '#14100e', { op: 0.55 });
  }, [['skirt', V.side(S.at(0, 0.7), dW)], ['torso', V.side(WB, mul(dW, -1))]]);
  f.bone('skirt');
  V.icicles(f, [[372, 1330], [440, 1342], [520, 1348], [570, 1340]], 8, 14, 36);
  V.ash(f, [740, 1330], 14, 60, 160, 1.4);
  for (let i = 0; i < 3; i++) V.steam(f, [560 + i * 50, 700 + i * 220], 140, 30, { sway: 18, phase: i * 2, op: 0.3, big: true });
  // belt: a braided cord, a bag of rune bones, a bundle of dried herbs gone to frost, bone charms
  f.bone('torso');
  const bl = [[-0.84, 0.86], [-0.4, 0.875], [0.0, 0.88], [0.4, 0.875], [0.7, 0.86], [0.7, 0.9], [0.4, 0.915], [0.0, 0.92], [-0.4, 0.915], [-0.85, 0.9]].map(([u, v], i) => [...S.at(u, v), i === 0 || i === 4 || i === 5 || i === 9 ? 1 : 0]);
  const blC = S.at(0, 0.89), tilt = q => { const r = add(blC, rot(sub(q, blC), 0.1)); return q.length > 2 ? [...r, q[2]] : r; }; // the belt drops toward the slack front hip
  f.part(bl.map(tilt), { fill: '#6a5e48', shade: 0.4, tex: 'hatch802', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 14; i++) f.line([tilt(S.at(-0.8 + i * 0.11, 0.865)), tilt(S.at(-0.76 + i * 0.11, 0.915))], 1.1, INK, { op: 0.6 });
  { const kn = tilt(S.at(0.3, 0.9)); f.part(ell(kn, 12, 10, 0.3, 10), { fill: '#5e523e', shade: 0.4, tex: 'hatch802', texOp: 0.5 }); f.stroke([kn, add(kn, [-6, 50]), add(kn, [-2, 96])], 7, '#5e523e'); f.stroke([kn, add(kn, [8, 40]), add(kn, [12, 76])], 6, '#4e4430'); }
  f.bone('charms');
  f.part([S.at(0.18, 0.92), S.at(0.46, 0.92), S.at(0.5, 1.2), S.at(0.32, 1.26), S.at(0.14, 1.18)], V.charred(V.LEA(f), 0.4)); // the bag of rune bones
  f.line([S.at(0.18, 0.95), S.at(0.46, 0.95)], 2.4, P.leathD);
  for (let i = 0; i < 3; i++) { const q = S.at(0.22 + i * 0.1, 1.08); f.part([add(q, [-7, -5]), add(q, [7, -6]), add(q, [6, 6]), add(q, [-6, 6])], { fill: P.bone, shade: 0.35, inkW: 1, cast: false }); runes(add(q, [0, 0]), 1, 0, '#3a2a20'); }
  for (let i = 0; i < 4; i++) { const q = S.at(-0.6 + i * 0.12, 0.94); f.line([q, add(q, [0, 40 + i * 12])], 1.6, P.leathD); f.part(ell(add(q, [0, 50 + i * 12]), 6, 10, 0, 8), { fill: i % 2 ? P.bone : P.boneD, shade: 0.4, inkW: 1, cast: false }); V.icicle(f, add(q, [0, 60 + i * 12]), 10, 4); }

  // ---- fur mantle over the shoulders and hunched back (on the torso, so it stays when the arms lift)
  f.bone('mantle');
  const mantle = [S.at(-1.0, 0.0), S.at(-0.6, -0.12), S.at(0.1, -0.12), S.at(0.6, -0.02), S.at(0.74, 0.18), S.at(0.6, 0.34), S.at(0.3, 0.38), S.at(-0.2, 0.46), S.at(-0.7, 0.48), S.at(-1.04, 0.3)];
  V.thermal(f, mantle, Sp, V.rimed(FURl, 0.5), V.charred(FURl, 0.6), { riftW: 2.6, nFacets: 4 });
  for (let i = 0; i < 26; i++) { const u = -1.0 + (i % 13) * 0.14, v = (i < 13 ? 0.42 : 0.3) + f.r() * 0.05, q = S.at(u, v); f.stroke([add(q, [0, -18]), add(q, [2, 0]), add(q, [-1, 16])], 6, mix(P.furD, '#000', 0.2), { op: 0.7 }); } // fur tufts at the hem
  V.icicles(f, [S.at(-1.02, 0.32), S.at(-0.7, 0.48), S.at(-0.4, 0.46)], 6, 12, 30);
  V.rimeCrust(f, [S.at(-1.0, 0.0), S.at(-0.6, -0.12), S.at(-0.2, -0.12)], 10, [-1, -0.2]);
  // a necklace of bear teeth over the mantle
  for (let i = 0; i < 9; i++) { const t = i / 8, q = lerp(lerp(S.at(-0.3, 0.02), S.at(0.1, 0.36), t), lerp(S.at(0.1, 0.36), S.at(0.55, 0.06), t), t); f.part([add(q, [-5, -4]), add(q, [5, -4]), add(q, [1, 18])], { fill: P.bone, shade: 0.4, inkW: 1, cast: false }); }

  // ---- the head: two faces back to back under one crown of braids
  f.bone('head');
  f.part(limb(S.at(0.15, -0.05), add(HC, [0, 60]), 74, 70), V.charred(SKO, 0.3)); // neck
  const SpH = { line: V.jag(f, [add(HC, [-10, -200]), add(HC, [-6, -80]), add(HC, [8, -30]), add(HC, [-8, 20]), add(HC, [6, 70]), add(HC, [-4, 200])], 7, 9), ice: 0 };
  { const d = E.norm(sub(SpH.line[SpH.line.length - 1], SpH.line[0])), n = [d[1], -d[0]]; SpH.ice = n[0] < 0 ? 1 : -1; }
  const off = 0.17 * H, HCf = add(HC, [off, 0]), HCb = add(HC, [-off, 0]);
  const faceBase = { jaw: 1.0, chin: 0.02, nose: 1.1, hook: 0.4, mouth: 'set', squint: 0.25, browDown: 0.05, age: true, gaunt: true, lips: true, faceShade: 0.8, faceHatch: false, noEar: true, hairCol: '#8a8478', browCol: '#6a645c' };
  // the frozen face, looking back: drawn facing right, mirrored about the head's middle, with the light mirrored too so
  // after the mirror it is still lit from the same side as everything else
  V.clipDraw(f, V.halfRegion(SpH.line, SpH.ice), () => {
    const L0 = f.L; f.L = [-L0[0], L0[1]];
    f.raw(`<g transform="translate(${2 * HC[0]} 0) scale(-1 1)">`);
    const bF = frame(add(HC, [off, 0]), -hA, H);
    B.head(f, add(HC, [off, 0]), H, -hA, Object.assign({}, faceBase, { skin: mix(skinW, P.ice, 0.55), eyeWhite: '#e8eef0', iris: '#9aaab4', mouth: 'grim', squint: 0.45 }));
    f.raw(`<rect x="${HC[0] - 20}" y="${HC[1] - 100}" width="${H * 0.6}" height="${H * 1.1}" fill="url(#rime802)" opacity="0.5"/>`);
    V.facets(f, bF([[0.15, 0.1]])[0], 40, 50, 6, { op: 0.35 });
    f.line(bF([[0.06, -0.08], [0.12, -0.1], [0.18, -0.08]]), 2.4, P.rime, { op: 0.9 }); // rime on the lashes
    f.flat(bF([[0.14, -0.02], [0.155, 0.0], [0.15, 0.12], [0.14, 0.12]]), P.iceL, { op: 0.85 }); // a frozen tear
    V.icicles(f, [bF([[0.3, 0.16]])[0], bF([[0.35, 0.18]])[0]], 1, 16, 22); // off the nose
    V.icicles(f, [bF([[0.14, 0.52]])[0], bF([[0.32, 0.48]])[0]], 3, 16, 30); // off the chin
    f.raw('</g>');
    f.L = L0;
  });
  // the burning face, looking ahead
  V.clipDraw(f, V.halfRegion(SpH.line, -SpH.ice), () => {
    const fF = frame(HCf, hA, H);
    B.head(f, HCf, H, hA, Object.assign({}, faceBase, { skin: '#5a4840', eyeWhite: '#a0603a', iris: P.hot, browCol: '#1a1210', mouth: 'grim' }));
    V.seam(f, fF([[0.28, 0.0], [0.18, 0.08], [0.1, 0.2], [0.04, 0.38]]), 2.4);
    V.seam(f, fF([[0.24, -0.22], [0.12, -0.26], [0.0, -0.18]]), 2);
    V.seam(f, fF([[0.2, 0.3], [0.26, 0.32], [0.3, 0.3]]), 1.6);
    V.glow(f, fF([[0.13, -0.06]])[0], 14, 10, P.lamp, 0.7);
    V.flakes(f, fF([[0.0, 0.1]])[0], 26, 30, 8, 1.2);
    V.ash(f, fF([[0.1, -0.4]])[0], 10, 40, 120, 1.2);
  });
  V.clipDraw(f, E.smooth(ell(HC, H * 0.6, H * 0.62, 0, 24)), () => { V.rift(f, SpH, 3); V.crackNet(f, add(HC, [6, -30]), 0.4, 40, 1.8, { depth: 1 }); V.crackNet(f, add(HC, [-6, 30]), 2.6, 34, 1.6, { depth: 1 }); });
  // the crown of braids: heavy grey braids wound round the head, bone pins, the front half scorched, the back frosted
  // grey hair over the skull top, then the crown of braids wound round it like a band seen from the side
  const hairTop = [add(HC, [-0.62 * H, -0.3 * H]), add(HC, [-0.5 * H, -0.56 * H]), add(HC, [-0.16 * H, -0.7 * H]), add(HC, [0.2 * H, -0.68 * H]), add(HC, [0.52 * H, -0.52 * H]), add(HC, [0.62 * H, -0.3 * H]), add(HC, [0.2 * H, -0.36 * H]), add(HC, [-0.2 * H, -0.36 * H])];
  const HICE = { fill: '#aaa496', shadow: '#3e3a40', light: P.iceL, shade: 0.4, tex: 'hatch802', texOp: 0.4 }, HCH = { fill: '#4a4038', shadow: P.charS, light: '#7a6656', shade: 0.4, tex: 'craze802', texOp: 0.5 };
  V.thermal(f, hairTop, SpH, HICE, HCH, { riftW: 2, nFacets: 1 });
  for (let i = 0; i < 7; i++) f.line([add(HC, [(-0.5 + i * 0.16) * H, -0.62 * H + Math.abs(i - 3) * 6]), add(HC, [(-0.46 + i * 0.15) * H, -0.4 * H])], 1.2, INK, { op: 0.5 });
  const band = []; for (let k = 0; k <= 12; k++) { const t = k / 12; band.push(add(HC, [(-0.68 + 1.36 * t) * H, (-0.38 - 0.1 * Math.sin(t * Math.PI)) * H])); }
  V.thermal(f, K.chain(band, band.map((_, k) => 0.2 * H * (0.85 + 0.15 * Math.sin(k / 12 * Math.PI)))), SpH, HICE, HCH, { riftW: 2.2, nFacets: 2 });
  for (let k = 0; k < 12; k++) { const q = lerp(band[k], band[k + 1], 0.5), d = E.norm(sub(band[k + 1], band[k])), n = [-d[1], d[0]]; f.line([add(q, mul(n, 0.09 * H)), add(add(q, mul(d, 8)), mul(n, -0.09 * H))], 1.8, INK, { op: 0.65 }); f.line([add(add(q, mul(d, -6)), mul(n, 0.08 * H)), add(q, mul(n, 0.02 * H))], 1, '#e8e4da', { op: 0.4 }); } // the plaits
  for (const k of [3, 9]) { const q = band[k]; f.part(limb(add(q, [0, 0.08 * H]), add(q, [k < 6 ? -10 : 10, -0.26 * H]), 9, 7), { fill: P.bone, shade: 0.4, inkW: 1.1, cast: false }); } // bone pins
  V.icicles(f, band.slice(0, 5).map(q => add(q, [0, 0.09 * H])), 3, 10, 22);
  V.embers(f, band[9], 30, 10, 6);
  // the parting braid: one thick plait from the crown down the back of the skull between the two faces
  { const pts = [add(HC, [0, -0.36 * H]), add(HC, [2, 0.1 * H]), add(HC, [-2, 0.7 * H]), add(HC, [0, 1.3 * H])]; V.thermal(f, K.chain(pts, [44, 42, 36, 24]), SpH, { fill: '#aaa496', shadow: '#3e3a40', light: P.iceL, shade: 0.4, tex: 'hatch802', texOp: 0.4 }, { fill: '#4a4038', shadow: P.charS, light: '#7a6656', shade: 0.4, tex: 'craze802', texOp: 0.5 }, { riftW: 2, nFacets: 1 }); for (let i = 0; i < 14; i++) { const q = lerp(pts[0], pts[3], (i + 0.5) / 14); f.line([add(q, [-18, -6]), add(q, [18, 6])], 1.6, INK, { op: 0.65 }); } f.part([add(pts[3], [-10, -4]), add(pts[3], [10, -4]), add(pts[3], [8, 22]), add(pts[3], [-8, 22])], { fill: P.bone, shade: 0.4, inkW: 1.1 }); }
  // both mouths murmur: breath steams off the burning lips, frost smoke sinks off the frozen ones
  V.steam(f, add(HC, [0.62 * H, 0.18 * H]), 120, 20, { sway: 12, phase: 1, drift: 30, op: 0.35 });
  V.steam(f, add(HC, [-0.66 * H, 0.2 * H]), -60, 16, { sway: 8, phase: 2, op: 0.3, col: P.iceL });

  // ---- the fire staff, planted ahead: blackened ash wood, an iron fork at its head cradling a live coal
  f.bone('staff_fire');
  f.part(K.chain([fsB, lerp(fsB, fsT, 0.4), lerp(fsB, fsT, 0.75), fsT], [22, 24, 22, 22], { bq: [[1, 0.5, 0.12]] }), Object.assign(V.charred({ fill: P.wood, shadow: P.woodD }, 0.5), { tex: 'craze802', texOp: 0.7 }));
  for (const t of [0.3, 0.55]) V.seam(f, [lp(fsB, fsT, t, -8), lp(fsB, fsT, t + 0.02, 0), lp(fsB, fsT, t + 0.035, 6)], 1.6);
  runes(lp(fsB, fsT, 0.45, -4), 4, Math.atan2(fsT[1] - fsB[1], fsT[0] - fsB[0]), P.lampL);
  const FH = frame(fsT, Math.atan2(fsT[1] - fsB[1], fsT[0] - fsB[0]), 1);
  for (const sg of [-1, 1]) f.part(K.chain([FH([[0, sg * 6]])[0], FH([[40, sg * 30]])[0], FH([[96, sg * 26]])[0], FH([[110, sg * 12]])[0]], [10, 9, 7, 5]), { fill: P.iron, shadow: '#0c0a0a', shade: 0.4, inkW: 1.2, tex: 'mottle802', texOp: 0.5 });
  const coal = FH([[66, 0]])[0];
  V.glow(f, coal, 70, 70, P.lamp, 0.5, true); V.glow(f, coal, 30, 30, P.lampL, 0.6);
  f.part(lumpyEll(f, coal, 28), { fill: P.ember, shadow: '#5a1a08', light: P.hot, shade: 0.35, inkW: 1.4, inkHeavy: 2, hatch: false, tex: 'craze802', texOp: 0.8 });
  V.crackNet(f, add(coal, [-12, 4]), -0.5, 30, 1.8, { depth: 1, glowOp: 0.2, hot: P.core });
  V.ash(f, add(coal, [0, -24]), 16, 60, 200, 1.4);
  f.line([lp(fsB, fsT, 0.86, -12), add(lp(fsB, fsT, 0.86, -12), [-6, 60])], 2, P.leathD); f.part(ell(add(lp(fsB, fsT, 0.86, -12), [-6, 70]), 6, 12, 0, 10), { fill: P.boneD, shade: 0.4, inkW: 1, cast: false });
  f.bone('hand_f');
  B.grip(f, WF, EF, Math.atan2(fsT[1] - fsB[1], fsT[0] - fsB[0]), 40, '#4e3e34', { shadow: P.charS, tex: 'craze802', texOp: 0.5, name: 'seeress fire staff' });
  V.seam(f, [add(WF, [-10, -14]), add(WF, [2, -4]), add(WF, [8, 8])], 1.4);

  // ---- near arm (frost staff arm), reaching back to the staff: rimed sleeve, frozen hand
  V.armRig(f, SN, EN, WN, [74, 64, 52], () => {
    V.thermal(f, K.chain([SN, lerp(SN, EN, 0.5), EN, lerp(EN, WN, 0.6)], [82, 78, 66, 58], { bp: [[1, 0.5, 0.1]] }), Sp, V.rimed(WOOLl, 0.5), V.charred(WOOLl, 0.55), { faint: true, riftW: 2.4 });
    runes(lp(SN, EN, 0.3, -12), 3, V.ang(SN, EN));
    V.icicles(f, [lp(EN, WN, 0.1, 30), lp(EN, WN, 0.6, 28)], 4, 14, 34);
  }, '_n');
  f.bone('forearm_n');
  f.part(K.chain([lerp(EN, WN, 0.55), WN], [62, 54]), V.rimed(FURl, 0.5));
  V.rimeCrust(f, [lp(EN, WN, 0.55, -30), lp(EN, WN, 0.95, -26)], 6, [-0.3, -1]);
  f.bone('staff_frost');
  f.part(K.chain([add(WN, mul(E.norm(sub(rsT, rsB)), -40)), add(WN, mul(E.norm(sub(rsT, rsB)), 40))], [21, 21]), Object.assign(V.rimed({ fill: P.bone, shadow: P.boneD }, 0.2), { tex: 'crack802', texOp: 0.6, cast: false })); // the shaft where her hand closes on it, in front of her body
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.atan2(rsT[1] - rsB[1], rsT[0] - rsB[0]), 40, mix(skinW, P.ice, 0.55), { shadow: P.iceS, tex: 'rime802', texOp: 0.5, name: 'seeress frost staff' });
  V.icicles(f, [add(WN, [-14, 22]), add(WN, [18, 22])], 3, 10, 24);

  f.bone('root');
  for (const a of [AN, AF, fsB]) f.flat(ell(add(a, [10, a === fsB ? 2 : 66]), 70, 7, 0, 14), P.iceS, { op: 0.35 });
  return f;
}
function lumpyEll(f, c, r) { return ell(c, r, r * 0.82, 0.3, 14).map((q, i) => add(q, [(f.r() - 0.5) * r * 0.25, (f.r() - 0.5) * r * 0.25])); }

// ------------------------------------------------------------------ JOTUN THANE (elite, 2.5)
// A frost giant of the old glacier, hunched under the roof of the hall (his back breaks the top of the frame), the
// glacier-ice club dragging from one fist, the other fist clenched; the heat from the deep has driven him mad and he
// roars. Split on a diagonal: above it the old ice still holds his shoulders, back and beard (rime crust, faceted
// frozen flesh, icicles); below it the heat coming up through the floor has blistered and charred him, the blisters
// glowing, steam rising, meltwater streaming down off the frozen half.
// Rig: standard humanoid + club (on hand_n) + kilt + beard (head) + chain (the broken manacle chain).
function jotunThane() {
  const CW = TIERS.elite[0], CH = TIERS.elite[1];
  const f = new Fig(V.base(801, CH)); V.textures(f);
  const gy = f.o.groundY, H = 270;
  const N = [690, 380], C = [420, 200], Pv = [480, 820];
  const S = B.spine(N, C, Pv, H);
  const SN = [636, 372], SF = [742, 360];
  const EN = [586, 634], WN = [620, 872], EF = [806, 622], WF = [830, 836];
  const HN = [420, 840], HF = [560, 836], KN = [520, 1066], AN = [470, 1296], KF = [652, 1046], AF = [666, 1290];
  const HC = [806, 346], hA = 0.12;
  const clubE = add(WN, [-30, -40]), clubH = [994, 1300], cA = Math.atan2(clubH[1] - WN[1], clubH[0] - WN[0]);
  V.humanJoints(f, { P: Pv, T: [480, 760], N: [700, 390], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('club', WN, 'hand_n').joint('kilt', [480, 840], 'pelvis').joint('beard', add(HC, [20, 90]), 'head').joint('chain', WF, 'hand_f');
  const Sp = { line: V.jag(f, [[1100, 260], [860, 470], [700, 600], [540, 760], [380, 920], [100, 1180]], 12, 18), ice: 0 };
  { const d = E.norm(sub(Sp.line[Sp.line.length - 1], Sp.line[0])), n = [d[1], -d[0]]; Sp.ice = n[1] < 0 ? 1 : -1; } // the ice above the diagonal
  const SKIN = { fill: '#a9bccb', shadow: '#3a4866', light: '#e4eef4', shade: 0.34, tex: 'mottle801', texOp: 0.5, maxShade: 150 };
  const ICEK = Object.assign({}, SKIN, { tex: 'crack801', texOp: 0.55 }), HOTK = { fill: '#5e4c4c', shadow: '#1a1010', light: '#8a6e62', shade: 0.36, tex: 'craze801', texOp: 0.55, maxShade: 150 };
  const blist = (c, rx, ry, n, s = 1) => { for (let i = 0; i < n; i++) { const p = V.scatter(f, c, rx, ry), r = V.R(f, 6, 14) * s; f.flat(ell(add(p, [0, r * 0.2]), r * 1.4, r * 1.0, 0, 12), '#2a1410', { op: 0.6 }); V.glow(f, p, r * 1.6, r * 1.3, P.lamp, 0.45); f.part(ell(p, r, r * 0.82, f.r(), 12), { fill: P.lamp, shadow: P.ember, light: P.hot, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, gritOp: 0.2 }); f.flat(ell(add(p, [r * 0.3, -r * 0.3]), r * 0.3, r * 0.2, -0.5, 6), P.core, { op: 0.8 }); if (f.r() < 0.3) { f.flat([add(p, [-r * 0.7, r * 0.2]), add(p, [-r * 0.1, -r * 0.15]), add(p, [r * 0.75, -r * 0.05]), add(p, [0, r * 0.2])], '#1a0c08'); } } }; // a burst blister splits along a ragged line (eye audit 2026-11-23: a centred dark core in a glowing ring read as an eye)
  const ARMK = Object.assign({}, ICEK, { fill: '#8ea2b4', shadow: '#26324c', light: '#d4e0ea' });
  const skin = (pts, o = {}) => V.thermal(f, pts, Sp, o.iceLook || ICEK, o.hotLook || HOTK, Object.assign({ riftW: 4, nFacets: 6, nEmbers: 8, charAfter: () => { const bb = E.bbox(pts); blist([(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2 + 30], (bb[2] - bb[0]) * 0.4, (bb[3] - bb[1]) * 0.35, o.nBl ?? 5, o.bs ?? 1); }, iceAfter: () => { const bb = E.bbox(pts); V.frostCracks(f, [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2 - 20], (bb[2] - bb[0]) * 0.4, (bb[3] - bb[1]) * 0.3, o.nFr ?? 5); } }, o));
  const HIDE = { fill: '#5e5248', shadow: '#1e1814', shade: 0.4, tex: 'fur801', texOp: 0.8, maxShade: 50 };

  // ---- far arm, hanging forward, the fist clenched; a broken manacle on the wrist
  V.armRig(f, SF, EF, WF, [150, 120, 100], () => {
    skin(limb(add(SF, [-10, -30]), EF, 176, 116, { p: [[0.3, 0.12, 0.16]], q: [[0.55, 0.14, 0.18]] }), { nBl: 2, nFr: 4 });
    skin(limb(lerp(EF, SF, 0.08), WF, 128, 94, { p: [[0.25, 0.16, 0.16]] }), { nBl: 4, nFr: 1 });
  }, '_f');
  f.bone('forearm_f');
  f.part(K.chain([lp(EF, WF, 0.8, 0), lp(EF, WF, 0.95, 0)], [124, 124]), { fill: P.iron, shadow: '#0c0a0a', shade: 0.4, tex: 'mottle801', texOp: 0.6, inkW: 1.6 }); // manacle
  for (const t of [0.82, 0.93]) f.line([lp(EF, WF, t, -62), lp(EF, WF, t, 62)], 2, P.ironL, { op: 0.6 });
  f.rivet(lp(EF, WF, 0.87, 40), 4, '#6a6a6a');
  f.bone('chain');
  V.chainLinks(f, [lp(EF, WF, 0.9, -40), add(WF, [-40, 120]), add(WF, [-20, 220])], 30, P.iron);
  f.flat(ell(add(WF, [-20, 236]), 14, 8, 0.6, 10), P.ironL); // the sprung last link
  f.bone('hand_f');
  B.fist(f, WF, Math.PI / 2 + 0.15, 92, '#5a4a4c', { shadow: '#140c0c', tex: 'craze801', texOp: 0.5, flip: true }); // clenched, knuckles down and forward
  blist(add(WF, [10, 10]), 40, 30, 3, 0.8);

  // ---- legs: thighs under the kilt, bare blistered shins and feet, toenails like cracked horn
  for (const [sfx, Hp, Kn, A, tone] of [['_f', HF, KF, AF, 0.15], ['_n', HN, KN, AN, 0]]) {
    V.legRig(f, Hp, Kn, A, 150, () => {
      skin(K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.2)], [210, 200, 150, 140], { bq: [[1, 0.4, 0.1]] }), { nBl: 3 });
    }, sfx);
    V.footRig(f, Kn, A, 150, () => {
      V.sides(f, Sp, () => K.bareLeg(f, lerp(Kn, A, 0.12), A, 1, 150, 140, Object.assign({}, ICEK, { fill: mix(ICEK.fill, '#000', tone) })), () => K.bareLeg(f, lerp(Kn, A, 0.12), A, 1, 150, 140, Object.assign({}, HOTK, { fill: mix(HOTK.fill, '#000', tone) })));
      V.clipDraw(f, V.halfRegion(Sp.line, -Sp.ice), () => { blist(lerp(Kn, A, 0.5), 30, 70, 4, 1.1); V.crackNet(f, lerp(Kn, A, 0.3), 1.6, 120, 3, { depth: 2 }); V.flakes(f, add(A, [60, 40]), 50, 20, 8, 1.4); });
      for (let i = 0; i < 4; i++) V.melt(f, add(lerp(Kn, A, 0.1 + i * 0.2), [-40 + i * 16, 0]), 50);
    }, sfx);
  }
  f.bone('root');
  f.flat(ell([560, gy + 4], 360, 16, 0, 24), P.iceS, { op: 0.45 }); // meltwater pooling round his feet
  for (let i = 0; i < 5; i++) V.steam(f, [380 + i * 90, gy - 4], 160 + i * 30, 40, { sway: 20, phase: i, op: 0.28, big: true });

  // ---- torso: the hunch is the body itself: the trapezius climbing from the neck to a crest behind the head, the
  // shoulder blades and the lats under rimed skin, a frozen bear pelt slung over the back; the chest and belly hang below
  f.bone('torso');
  const torso = V.lumpy(f, [[724, 300], [672, 236], [620, 186], [560, 156], [494, 158], [436, 200], [390, 280], [362, 390], [352, 510], [372, 630], [362, 740], [384, 836], [440, 878], [600, 884], [760, 862], [830, 782], [852, 664], [834, 560], [796, 476], [764, 418]], 8);
  const toD = skin(torso, { nBl: 9, bs: 1.3, nFr: 8, nFacets: 10 });
  V.clipDraw(f, toD, () => {
    // form: the round of the upper back turning away, the trapezius slope catching the light, the lats, the belly's underside
    f.raw(`<path d="${E.smooth([[350, 300], [430, 240], [450, 500], [420, 780], [340, 760]])}" fill="#0c1220" opacity="0.4" filter="url(#smkL801)"/>`);
    f.raw(`<path d="${E.smooth([[720, 300], [640, 210], [540, 170], [560, 230], [660, 300]])}" fill="#ffffff" opacity="0.28" filter="url(#smk801)"/>`);
    f.stroke([[730, 312], [650, 240], [560, 196]], 7, '#1e2638', { op: 0.35 }); // the trapezius' lower edge running down into the shoulder
    // the near shoulder blade: a raised plate with its spine ridge, the medial border throwing a shadow toward the spine
    f.part([[490, 226], [570, 236], [592, 300], [550, 420], [490, 466], [450, 400], [458, 290]], Object.assign({}, ICEK, { maxShade: 40, cast: false, inkW: 0, inkHeavy: 0, fill: mix(ICEK.fill, '#ffffff', 0.12) }));
    f.stroke([[458, 280], [448, 380], [486, 466]], 8, '#1e2638', { op: 0.5 }); f.stroke([[466, 270], [530, 262], [592, 300]], 5, '#1e2638', { op: 0.45 });
    f.stroke([[540, 166], [470, 210], [420, 300], [394, 420], [384, 560]], 5, '#1e2638', { op: 0.45 }); // the spine furrow
    f.stroke([[390, 560], [440, 650], [490, 760]], 6, '#1e2638', { op: 0.35 }); // the lat's edge
    f.stroke([[740, 480], [800, 540], [846, 556]], 6, '#1e2638', { op: 0.5 }); // the pectoral's sag
    f.stroke([[690, 760], [780, 790], [846, 760]], 6, '#140c0c', { op: 0.6 }); // the belly's overhang
    f.flat(ell([780, 700], 8, 5, 0, 8), '#140c0c', { op: 0.7 }); // navel
    f.raw(`<path d="${E.smooth([[560, 330], [520, 420], [500, 560], [520, 700], [580, 700], [600, 520], [640, 380]])}" fill="#0a0e1a" opacity="0.55" filter="url(#smk801)"/>`); // the shadow of the near arm on the body
    for (let i = 0; i < 5; i++) f.line([[400 + i * 30, 560 + i * 10], [420 + i * 30, 620 + i * 8]], 1.4, '#1e2638', { op: 0.5 }); // stretch and frost scars
  });
  // a bear pelt slung over the hunch, frozen stiff. Final pass 2026-11-25: it read as a pack (a lumpy brown slab with
  // rolled scallops along its edge). Now it is plainly a skinned bear: its head hangs head-down off the back edge (ears,
  // brow, muzzle, nose leather, a lip with a fang, the eye slit sewn shut), a hind leg hangs plumb off the lower corner
  // ending in a paw with five claws, the fur lies in clumps that follow the drape down the back, and the edges break
  // into frozen hanks. No straps: it lies on the hump by its own weight. A local PRNG draws it, and the old stream is
  // consumed unchanged, so the rest of the figure stays as it was.
  const peltO = [[340, 450], [330, 560], [344, 650]], peltB = [[344, 650], [392, 676], [428, 610], [450, 520]];
  const pelt = V.lumpy(f, [[420, 196], [500, 152], [580, 160], [640, 200], [600, 244], [540, 266], [490, 330], [462, 420], ...peltB.slice().reverse(), ...peltO.slice().reverse(), [356, 330]], 10);
  for (let i = 0; i < 220; i++) f.r();
  const LRp = (() => { let s = 80141; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const fP = new Proxy(f, { get: (t, k) => k === 'r' ? LRp : (typeof t[k] === 'function' ? t[k].bind(t) : t[k]) });
  const FURP = ['#4a4038', '#5e5248', '#6e6052', '#3a322c'], FURI = ['#7a7e84', '#8e949a', '#5e5248', '#a4acb2'];
  // the head, hanging head-down off the back edge: the scalp, ear stubs, the brow, the muzzle tapering to the nose
  { const r0 = [316, 350], tipH = [266, 540], ax = E.norm(sub(tipH, r0)), nx = [-ax[1], ax[0]], L = E.len(sub(tipH, r0));
    const Hh = (u, v) => add(add(r0, mul(ax, u * L)), mul(nx, v * L)); // u along the head (0 scalp, 1 nose), v across
    const HL = Object.assign(V.rimed(HIDE, 0.2), { fill: '#54483e', maxShade: 24, inkW: 1.6, inkHeavy: 2.4 });
    for (const sv of [-1, 1]) f.part([Hh(0.04, sv * 0.26), Hh(-0.08, sv * 0.4), Hh(0.02, sv * 0.54), Hh(0.16, sv * 0.46)], Object.assign({}, HL, { fill: '#463a32', cast: false })); // the ear stubs, flattened
    const hp = [Hh(-0.06, -0.3), Hh(0.12, -0.42), Hh(0.3, -0.4), Hh(0.44, -0.26), Hh(0.52, -0.15), Hh(0.72, -0.12), Hh(0.9, -0.11), Hh(1.0, -0.07), Hh(1.03, 0.0), Hh(1.0, 0.07), Hh(0.88, 0.1), Hh(0.7, 0.11), Hh(0.54, 0.15), Hh(0.44, 0.28), Hh(0.28, 0.42), Hh(0.1, 0.44), Hh(-0.04, 0.34), Hh(-0.13, 0.18), Hh(-0.16, 0.02), Hh(-0.13, -0.16)];
    const hD = f.part(hp, HL);
    V.clipDraw(f, hD, () => {
      for (let i = 0; i < 14; i++) { const u = 0.04 + LRp() * 0.5, v = (LRp() - 0.5) * 0.5, q = Hh(u, v); VB.hairClump(fP, [q, Hh(u + 0.08, v * 0.9), Hh(u + 0.17, v * 0.85)], 12 + LRp() * 6, { pal: FURP, n: 2 }); }
      f.flat([Hh(0.5, -0.3), Hh(0.6, 0.0), Hh(1.05, -0.05), Hh(1.05, -0.3)], '#0c0a08', { op: 0.35 }); // the muzzle's shadow side
      f.stroke([Hh(0.44, -0.26), Hh(0.47, -0.05), Hh(0.44, 0.15), Hh(0.42, 0.28)], 9, '#0c0a08', { op: 0.45 }); // the stop, where the brow drops to the muzzle
      f.stroke([Hh(0.2, 0.36), Hh(0.34, 0.3)], 7, '#8a7e70', { op: 0.4 }); // the cheek's lit roll
      f.stroke([Hh(0.5, -0.12), Hh(0.75, -0.08), Hh(0.95, -0.06)], 6, '#7a6e62', { op: 0.5 }); // the lit bridge of the muzzle
      f.raw(`<rect x="250" y="300" width="160" height="260" fill="url(#rime801)" opacity="0.4"/>`);
    });
    f.part([Hh(0.9, -0.12), Hh(0.97, -0.13), Hh(1.03, -0.04), Hh(1.0, 0.1), Hh(0.92, 0.1), Hh(0.88, 0.0)], { fill: '#201a18', shadow: '#050404', light: '#5a5250', shade: 0.4, inkW: 1.3, cast: false }); // nose leather
    f.flat(ell(Hh(0.99, -0.06), 4, 3, 0, 8), '#000'); f.flat(ell(Hh(0.99, 0.05), 4, 3, 0, 8), '#000');
    f.line([Hh(0.58, 0.13), Hh(0.78, 0.1), Hh(0.92, 0.08)], 2.4, INK, { op: 0.8 }); // the lip line
    f.part([Hh(0.7, 0.1), Hh(0.75, 0.095), Hh(0.73, 0.19)], { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1, cast: false }); // a fang showing at the lip
    f.line([Hh(0.36, -0.24), Hh(0.41, -0.14)], 2.2, INK, { op: 0.8 }); for (const t of [0, 0.5, 1]) { const q = lerp(Hh(0.36, -0.24), Hh(0.41, -0.14), t); f.line([add(q, mul(ax, -4)), add(q, mul(ax, 4))], 1, '#8a7e70', { op: 0.7 }); } // the eye slit, sewn shut
    f.line([Hh(0.3, -0.3), Hh(0.32, -0.1), Hh(0.3, 0.1), Hh(0.32, 0.28)], 2.2, '#120e0a', { op: 0.5 }); // the brow fold
    V.rimeCrust(f, [Hh(0.0, -0.3), Hh(0.3, -0.31), Hh(0.6, -0.2)], 6, [-1, -0.2], { gap: 6 });
    V.icicle(f, Hh(1.02, -0.02), 26, 7);
  }
  const peD = f.part(pelt, V.rimed(HIDE, 0.25));
  V.clipDraw(f, peD, () => {
    // fur clumps following the drape: from the crest they fall back and down over the round of the hump
    for (let i = 0; i < 34; i++) { const t = LRp(), r0 = add(lerp([620, 196], [372, 360], t), [(LRp() - 0.5) * 60, (LRp() - 0.3) * 120 + t * 60]), d = E.norm([-0.55 + t * 0.35, 1]), l = 90 + LRp() * 90, bend = (LRp() - 0.5) * 30;
      VB.hairClump(fP, [r0, add(r0, add(mul(d, l * 0.4), [bend * 0.4, 0])), add(r0, add(mul(d, l * 0.75), [bend, 0])), add(r0, mul(d, l))], 20 + LRp() * 14, { pal: i % 4 === 0 ? FURI : FURP, n: 3 }); }
    f.raw(`<rect x="250" y="120" width="420" height="580" fill="url(#rime801)" opacity="0.45"/>`);
    f.raw(`<path d="${E.smooth([[340, 300], [420, 250], [470, 420], [430, 660], [330, 640]])}" fill="#0c0a08" opacity="0.4" filter="url(#smkL801)"/>`); // the back edge turning away from the light
    f.stroke([[600, 214], [520, 250], [470, 330], [450, 460]], 10, '#120e0a', { op: 0.35 }); // the fold where the hide breaks over the shoulder blade
  });
  // the hind leg hanging plumb off the lower corner, the hide narrowing to the paw; five claws
  { const top = [[374, 640], [430, 622]], paw = [398, 784];
    const legP = [top[0], add(top[0], [6, 60]), add(paw, [-24, -40]), add(paw, [-26, 0]), add(paw, [-8, 18]), add(paw, [24, 16]), add(paw, [26, -6]), add(paw, [18, -46]), add(top[1], [-4, 70]), top[1]];
    const lD = f.part(legP, Object.assign(V.rimed(HIDE, 0.25), { maxShade: 24 }));
    V.clipDraw(f, lD, () => { for (let i = 0; i < 9; i++) { const q = [378 + LRp() * 46, 640 + LRp() * 100]; VB.hairClump(fP, [q, add(q, [(LRp() - 0.5) * 6, 30]), add(q, [(LRp() - 0.5) * 8, 56])], 14 + LRp() * 6, { pal: FURP, n: 2 }); } f.flat([add(paw, [-30, -60]), add(paw, [-8, -60]), add(paw, [-10, 30]), add(paw, [-30, 30])], '#0c0a08', { op: 0.35 }); });
    f.part([add(paw, [-22, 4]), add(paw, [0, -4]), add(paw, [22, 4]), add(paw, [18, 16]), add(paw, [-18, 18])], { fill: '#2a2220', shadow: '#060404', shade: 0.4, inkW: 1.2, cast: false }); // the pad
    for (let k = 0; k < 5; k++) { const q = add(paw, [-20 + k * 10, 16 - Math.abs(k - 2) * 2]); f.part([add(q, [-3.5, 0]), add(q, [3.5, 0]), add(q, [2, 14]), add(q, [-2 + (k - 2) * 1.5, 22])], { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1, cast: false }); }
    V.icicles(f, [add(paw, [-20, 22]), add(paw, [20, 22])], 2, 10, 20);
  }
  // the frozen hanks along the back and lower edges break the outline (plumb, stiff, rimed tips)
  VB.hanks(fP, [[334, 540], [330, 590], [344, 650]], 4, 30, 60, 18, { state: 'ice', strands: 3, pal: FURP, icicleK: 0.5 });
  VB.hanks(fP, [[440, 600], [452, 520]], 3, 26, 50, 16, { state: 'ice', strands: 3, pal: FURP, icicleK: 0.4 });
  // glacier ice still grown out of the crest: jagged dirty slabs and stones, frost crust, icicles hanging plumb
  for (const [u, v, a, l, w] of [[500, 158, -1.9, 90, 60], [438, 196, -2.4, 70, 50], [572, 164, -1.5, 66, 46]]) { const q = [u, v], tip = add(q, rot([l, 0], a)); const sh = [[...add(q, rot([0, -w / 2], a)), 1], [...add(q, rot([l * 0.6, -w * 0.4], a))], [...tip, 1], [...add(q, rot([l * 0.7, w * 0.3], a))], [...add(q, rot([0, w / 2], a)), 1]]; f.part(sh, V.ICE(f, { fill: mix(P.glass, P.iceM, 0.3), inkW: 1.6, maxShade: 20 })); V.clipDraw(f, E.smooth(sh.map(z => [z[0], z[1], 1])), () => { f.line([q, lerp(q, tip, 0.85)], 1.6, INK, { op: 0.5 }); f.flat([add(q, rot([0, -w / 2], a)), lerp(q, tip, 0.9), q], P.iceL, { op: 0.45 }); f.raw(`<rect x="0" y="0" width="${CW}" height="${CH}" fill="url(#rime801)" opacity="0.4"/>`); }); }
  for (const [u, v] of [[536, 170], [466, 190]]) f.part(lumpyEll(f, [u, v], 15), { fill: P.greyD, shade: 0.4, inkW: 1.2, cast: false }); // stones frozen in
  V.rimeCrust(f, [[356, 330], [420, 196], [500, 152], [580, 160], [640, 200], [672, 236]], 16, [-1, -0.3], { gap: 7, feather: 1.8 });
  V.icicles(f, [[344, 650], [392, 676], [428, 610]], 6, 26, 64);
  V.icicles(f, [[606, 186], [668, 240], [724, 304]], 4, 18, 40);
  for (let i = 0; i < 6; i++) V.melt(f, [380 + i * 44, 680 + (i % 2) * 30 + i * 16], 70 + i * 10, 1.6); // water streaming off the ice
  for (let i = 0; i < 4; i++) V.steam(f, [640 + i * 50, 640 + i * 40], 180, 40, { sway: 20, phase: i * 1.3, op: 0.3, big: true });

  // ---- kilt of mammoth hide: shaggy, belted with rope and an ivory toggle, the hair singed below, frozen behind
  f.bone('kilt');
  const kilt = [[330, 800], [440, 830], [600, 834], [800, 816], [800, 900], [770, 1010], [700, 1060, 1], [640, 1040], [580, 1074, 1], [500, 1050], [440, 1080, 1], [380, 1046], [336, 1064, 1], [310, 1010], [320, 920]];
  V.thermal(f, kilt, Sp, V.rimed(HIDE, 0.35), V.charred(HIDE, 0.5), { riftW: 3, nFacets: 4, charAfter: () => { V.embers(f, [600, 1000], 140, 50, 20, 1.4); V.ash(f, [640, 1050], 12, 120, 140, 1.4); } });
  for (let i = 0; i < 27; i++) { const x = 340 + i * 17, y = 940 + f.r() * 90; f.stroke([[x, y], [x + 3, y + 40], [x - 2, y + 80]], 6, i % 3 ? '#3a322c' : '#7a6e60', { op: 0.6 }); } // long shaggy hair
  V.icicles(f, [[316, 1010], [336, 1064], [380, 1046], [440, 1080]], 6, 18, 40);
  f.part([[326, 790], [440, 818], [600, 822], [806, 804], [806, 836], [600, 852], [440, 848], [326, 822]].map((q, i) => [...q, i % 4 === 0 || i % 4 === 3 ? 1 : 0]), { fill: '#6e6450', shade: 0.4, tex: 'hatch801', texOp: 0.5, k: 0.6 }); // rope belt
  for (let i = 0; i < 18; i++) { const x = 334 + i * 27; f.line([[x, 796 + (x < 600 ? (x - 326) * 0.08 : 22)], [x + 8, 826 + (x < 600 ? (x - 326) * 0.07 : 19)]], 1.4, INK, { op: 0.6 }); }
  const tg = [700, 830]; f.part([add(tg, [-50, -12]), add(tg, [40, -20]), add(tg, [56, -6]), add(tg, [44, 6]), add(tg, [-46, 12])], { fill: P.bone, shadow: P.boneD, shade: 0.4, tex: 'crack801', texOp: 0.5 }); // an ivory toggle, a split tusk tip
  // trophies on the belt: a miner's iron helmet and a string of finger bones
  const hm = [380, 880]; f.part([add(hm, [-34, 0]), add(hm, [-30, -26]), add(hm, [0, -40]), add(hm, [30, -26]), add(hm, [34, 0])], { fill: P.iron, shadow: '#0c0a0a', shade: 0.4, tex: 'mottle801', texOp: 0.6 }); f.part([add(hm, [-40, 0]), add(hm, [40, 0]), add(hm, [40, 8]), add(hm, [-40, 8])], { fill: P.ironL, shade: 0.4, inkW: 1.2, sharp: true }); f.flat(ell(add(hm, [-6, -16]), 8, 6, 0, 8), '#0c0a0a'); V.icicles(f, [add(hm, [-34, 8]), add(hm, [34, 8])], 3, 10, 24);
  for (let i = 0; i < 6; i++) { const q = add([520, 850], [i * 4, 20 + i * 18]); f.part(limb(q, add(q, [4, 14]), 8, 7), { fill: P.bone, shade: 0.4, inkW: 1, cast: false }); }

  // ---- head: a huge head carried low on a thick neck, roaring, wild-eyed, the beard frozen into icicles
  f.bone('head');
  f.part(K.chain([[650, 330], [700, 330], add(HC, [-60, 50])], [230, 220, 200]), ICEK); // the bull neck, coming forward out of the hump
  const hF = frame(HC, hA, H);
  // long wild hair behind the head first: frozen clumps falling back and down onto the hump
  const HAIRL = { fill: '#c4ccd4', shadow: '#3e4862', light: '#f4f6f8', shade: 0.38, tex: 'hatch801', texOp: 0.35, maxShade: 26, cast: false, inkW: 1.3 };
  for (let i = 0; i < 7; i++) { const r0 = hF([[0.1 - i * 0.07, -0.52 + i * 0.07]])[0], l = 160 + i * 18 + (i % 2) * 40; const pts = [r0, add(r0, [-50 - i * 6, l * 0.3]), add(r0, [-80 - i * 4, l * 0.65]), add(r0, [-70 - i * 6, l])]; f.part(V.tube(pts, [44 - i * 2, 40 - i * 2, 30, 14]), HAIRL); f.line(pts.slice(0, 3).map(z => add(z, [6, 2])), 1.3, '#5a667e', { op: 0.6 }); V.icicle(f, add(pts[3], [0, -4]), 20 + (i % 3) * 8, 7); }
  B.head(f, HC, H, hA, { skin: SKIN.fill, jaw: 1.32, chin: 0.03, nose: 1.18, hook: 0.15, mouth: 'set', squint: 0.35, browDown: 0.16, browW: 0.085, age: true, gaunt: true, faceShade: 0.85, jawShade: 0.45, eyeWhite: '#dfe6ea', iris: '#1a120c', browCol: '#56627a', hairCol: '#c4ccd4', noEar: true });
  // the roaring mouth: the jaw dropped, teeth like cracked ice, a hot breath glowing in the throat
  f.flat(hF([[0.12, 0.25], [0.24, 0.22], [0.34, 0.25], [0.35, 0.36], [0.3, 0.5], [0.2, 0.54], [0.12, 0.46], [0.1, 0.34]]), '#120a0a');
  V.glow(f, hF([[0.18, 0.4]])[0], 20, 22, P.lamp, 0.5);
  for (let i = 0; i < 4; i++) { const q = hF([[0.15 + i * 0.05, 0.25]])[0]; f.part([add(q, [-5, 0]), add(q, [5, 0]), add(q, rot([0, 16 - (i % 2) * 5], hA))], { fill: P.bone, shade: 0.3, inkW: 1, cast: false }); }
  for (let i = 0; i < 3; i++) { const q = hF([[0.16 + i * 0.06, 0.5]])[0]; f.part([add(q, [-5, 0]), add(q, [5, 0]), add(q, rot([0, -14], hA))], { fill: P.boneD, shade: 0.3, inkW: 1, cast: false }); }
  // the face of an old giant: furrows, frost in the creases, frost crust on the cheekbone and brow, icicles off the brow
  for (const l of [[[0.02, -0.22], [0.16, -0.24], [0.27, -0.17]], [[0.0, -0.3], [0.14, -0.33], [0.24, -0.28]], [[-0.02, 0.04], [0.08, 0.14], [0.06, 0.26]]]) f.line(hF(l), 2, '#1e2638', { op: 0.7 });
  f.line(hF([[0.07, -0.03], [0.15, -0.015]]), 1.4, '#7a2a20', { op: 0.55 }); // blood vessels burst in the wild eye
  V.rimeCrust(f, hF([[-0.02, 0.06], [0.1, 0.1], [0.2, 0.08]]), 6, [-1, 0], { gap: 5 });
  V.rimeCrust(f, hF([[0.0, -0.16], [0.14, -0.2], [0.3, -0.16]]), 7, [-0.4, -1], { gap: 5 });
  V.icicles(f, hF([[0.02, -0.12], [0.3, -0.12]]), 3, 8, 16);
  V.frostCracks(f, hF([[-0.15, -0.2]])[0], 30, 30, 4);
  // the skull top: hair over it, plastered back, frozen
  const cap = hF([[0.32, -0.38], [0.14, -0.58], [-0.2, -0.64], [-0.5, -0.52], [-0.62, -0.2], [-0.46, 0.05], [-0.3, -0.12], [-0.12, -0.3], [0.1, -0.36]]);
  f.part(cap, Object.assign({}, HAIRL, { cast: true, tex: 'mottle801', texOp: 0.4, hatch: false, maxShade: 18 }));
  for (let i = 0; i < 7; i++) f.line(hF([[0.26 - i * 0.06, -0.44 - i * 0.02], [0.0 - i * 0.06, -0.5], [-0.3 - i * 0.04, -0.38 + i * 0.04], [-0.48 - i * 0.02, -0.1 + i * 0.03]]), 1.4, '#5a667e', { op: 0.65 });
  V.rimeCrust(f, hF([[0.14, -0.58], [-0.2, -0.64], [-0.5, -0.52]]), 8, [-1, -0.3]);
  // the beard: frozen ropes of uneven length hanging plumb (on its own bone), a moustache mass over them
  f.bone('beard');
  const bTop = hF([[-0.14, 0.3], [0.0, 0.52], [0.16, 0.6], [0.34, 0.56]]);
  const BCOL = { fill: '#c8d2da', shadow: '#3a4660', light: '#ffffff', shade: 0.4, tex: 'hatch801', texOp: 0.4, maxShade: 30 };
  f.part([bTop[0], bTop[1], bTop[2], bTop[3], add(bTop[3], [6, 70]), add(bTop[1], [-10, 90]), add(bTop[0], [-24, 60])], BCOL);
  const ropes = [[0.05, 150, 40, -6], [0.18, 230, 34, 4], [0.3, 190, 46, -2], [0.45, 280, 38, 6], [0.58, 210, 44, -4], [0.72, 250, 30, 2], [0.86, 160, 36, 0], [0.97, 120, 28, -3]];
  for (const [t, l, w, sw] of ropes) { const q = lerp(lerp(bTop[0], bTop[1], Math.min(1, t * 2)), lerp(bTop[2], bTop[3], Math.max(0, t * 2 - 1)), t), pts = [add(q, [0, 20]), add(q, [sw, l * 0.4]), add(q, [-sw, l * 0.72]), add(q, [sw * 0.5, l])]; f.part(V.tube(pts, [w, w * 0.78, w * 0.55, w * 0.26]), Object.assign({}, BCOL, { cast: true, inkW: 1.3 })); f.line(pts.map(z => add(z, [-w * 0.18, 0])), 1.2, '#4a566e', { op: 0.6 }); V.icicle(f, add(pts[3], [0, -4]), 18 + (l % 30), 7, { drop: l > 200 }); }
  f.part(hF([[0.14, 0.2], [0.26, 0.17], [0.38, 0.2], [0.42, 0.28], [0.34, 0.3], [0.24, 0.26], [0.14, 0.3], [0.08, 0.26]]), Object.assign({}, BCOL, { cast: false })); // the moustache over the roar
  V.icicles(f, hF([[0.16, 0.3], [0.4, 0.3]]), 3, 10, 20);
  V.steam(f, hF([[0.36, 0.4]])[0], 160, 34, { sway: 18, phase: 1.5, drift: 40, op: 0.35, big: true }); // the hot roar

  // ---- near arm with the club: the glacier-ice club, dirty and cloudy, stones and a miner's pick frozen inside it
  f.bone('club');
  const CL = frame(WN, cA, 1), cLen = E.len(sub(clubH, WN));
  const club = CL([[-60, -26], [40, -34], [cLen * 0.5, -70], [cLen * 0.86, -110], [cLen + 20, -70, 1], [cLen + 40, 10], [cLen + 10, 90, 1], [cLen * 0.8, 96], [cLen * 0.5, 60], [40, 34], [-60, 28]]);
  f.part(club.map((q, i) => i % 3 === 0 ? [...q, 1] : q), V.ICE(f, { fill: '#b4c6d0', maxShade: 50, tex: 'crack801', texOp: 0.7 }));
  V.clipDraw(f, E.smooth(club), () => {
    f.part(CL([[cLen * 0.55, -10], [cLen * 0.62, -40], [cLen * 0.8, -50], [cLen * 0.84, 10]]), { fill: P.iron, shade: 0.4, inkW: 1.2, cast: false, opacity: 0.5 }); // a pick head frozen inside
    for (const [u, v, r] of [[0.7, 40, 18], [0.9, -30, 22], [0.4, 10, 12], [0.95, 50, 14]]) f.part(lumpyEll(f, CL([[cLen * u, v]])[0], r), { fill: P.greyD, shade: 0.4, inkW: 1, cast: false, opacity: 0.6 }); // stones
    V.facets(f, CL([[cLen * 0.7, 0]])[0], 120, 70, 14, { op: 0.4, s: 2 });
    V.frostCracks(f, CL([[cLen * 0.6, 0]])[0], 140, 60, 10);
    f.raw(`<rect x="0" y="0" width="${CW}" height="${CH}" fill="url(#rime801)" opacity="0.4"/>`);
    f.line(CL([[60, -26], [cLen * 0.5, -60], [cLen * 0.86, -98]]), 3, P.iceL, { op: 0.7 });
    // where it rests on the hot floor it is melting: dripping, steaming, a glowing scorch under it
    V.glow(f, CL([[cLen, 40]])[0], 60, 30, P.lamp, 0.4);
  });
  V.icicles(f, [CL([[cLen * 0.3, 50]])[0], CL([[cLen * 0.75, 94]])[0]], 4, 16, 40);
  V.steam(f, CL([[cLen, 60]])[0], 140, 34, { sway: 14, phase: 3, op: 0.3, big: true });
  f.part(CL([[-70, -24], [60, -24], [60, 24], [-70, 24]]), Object.assign(V.charred(HIDE, 0.3), { inkW: 1.4 })); // hide wrapped round the grip
  for (let i = 0; i < 6; i++) f.line(CL([[-60 + i * 20, -26], [-50 + i * 20, 26]]), 2, P.leathD);
  V.armRig(f, SN, EN, WN, [160, 120, 100], () => {
    skin(limb(add(SN, [0, -30]), EN, 176, 120, { p: [[0.55, 0.16, 0.16]], q: [[0.3, 0.14, 0.18], [0.75, 0.06, 0.1]] }), { nBl: 2, nFr: 5, iceLook: ARMK });
    skin(limb(lerp(EN, SN, 0.08), WN, 136, 98, { p: [[0.25, 0.18, 0.16]], q: [[0.2, 0.12, 0.15]] }), { nBl: 4, nFr: 2, iceLook: ARMK });
    // the deltoid: its own rounded mass capping the shoulder, rimed on top
    f.stroke([lp(SN, EN, 0.1, 60), lp(SN, EN, 0.35, 70), lp(SN, EN, 0.5, 50)], 5, '#1e2638', { op: 0.5 }); // the deltoid's edge
    V.rimeCrust(f, [lp(SN, EN, -0.14, 60), lp(SN, EN, -0.1, -10), lp(SN, EN, 0.04, -90)], 9, [-1, -0.4], { gap: 6 });
    f.stroke([lp(SN, EN, 0.55, -40), lp(SN, EN, 0.8, -50), lp(SN, EN, 0.95, -36)], 4, '#1e2638', { op: 0.45 }); // the bicep
    f.stroke([lp(EN, WN, 0.05, 50), lp(EN, WN, 0.3, 62), lp(EN, WN, 0.55, 44)], 4, '#1e1414', { op: 0.5 }); // the forearm's mass
  }, '_n');
  f.bone('upperarm_n');
  V.icicles(f, [lp(SN, EN, 0.2, 96), lp(SN, EN, 0.45, 84)], 4, 20, 50);
  // the trapezius runs on over the top of the shoulder into the deltoid (torso bone, drawn over the arm's cap), so the
  // hunch, neck and arm are one mass
  f.bone('torso');
  const trap = V.lumpy(f, [[730, 296], [676, 232], [620, 188], [566, 206], [548, 262], [568, 318], [618, 352], [682, 372], [744, 350]], 5);
  V.thermal(f, trap, Sp, Object.assign({}, ICEK, { inkW: 0, inkHeavy: 0, cast: false }), Object.assign({}, HOTK, { inkW: 0, inkHeavy: 0, cast: false }), { rift: false, nFacets: 3, nEmbers: 0 });
  f.line([[548, 262], [566, 206], [620, 188], [676, 232], [730, 296]], 2.4, INK);
  f.stroke([[560, 300], [620, 346], [700, 372]], 6, '#1e2638', { op: 0.45 }); // where the deltoid tucks under it
  V.rimeCrust(f, [[566, 206], [620, 188], [676, 232], [730, 296]], 11, [-0.6, -1], { gap: 6 });
  V.icicles(f, [[560, 290], [620, 350], [690, 372]], 4, 16, 40);
  f.bone('hand_n');
  B.grip(f, WN, EN, cA, 96, '#5e4c4c', { shadow: '#1a1010', tex: 'craze801', texOp: 0.5, inline: true, bend: -0.45, name: 'thane club' });
  blist(add(WN, [10, 20]), 40, 26, 2, 0.8);
  return f;
}

// ------------------------------------------------------------------ THE RIVEN JARL (ruler, 3.5)
// The jarl of the hold, seated in his glacier throne, a great bearded axe leaning on his shoulder, the frame cropping
// him at the shins and taking the top of the throne. Half of him froze in the fall and half burned. The line between the
// halves is not a cut but a crack: it runs off the crown of the helm, between the eyes and across the nose off-centre,
// splits the mouth, forks down the breastbone (a tongue of rime has crept over onto the burned breast, and a glowing seam
// licks back into the frozen belly), and wanders over the lap onto the inner far thigh. His near half (screen left
// before the mirror) is frozen white, the beard full of icicles, the horn whole; the far half is charred with molten
// cracks, the beard burned to stubble, the horn melted to a stump. Steam rises where they meet.
// Built in a three-quarter front view facing right: a heavy seated man, forearms laid on the throne arms, the near hand
// spread over the arm's carved end, the far fist round the axe haft, whose butt (the Tooth) stands on the dais.
// The throne is glacier ice, blackened and fissured on the far side where the fire came up through it (a soot gradient
// and a crack field, not a second split line).
// Rig: throne (root) > pelvis > torso > head, cloak; arms; axe on hand_f; thighs and shins (the feet are off-frame).
function rivenJarl() {
  const CW = TIERS.ruler[0], CH = TIERS.ruler[1];
  const f = new Fig(V.base(800, CH, { grimeY: 1700 })); V.textures(f);
  const H = 350;
  const HC = [858, 300], hA = 0.06, hF = frame(HC, hA, H);
  const Pv = [820, 1200];
  const SN = [520, 660], EN = [330, 958], WN = [596, 1062];
  const SF = [1150, 650], EF = [1196, 962], WF = [1384, 950];
  const HN = [660, 1196], KN = [900, 1392], AN = [884, 1780];
  const HF = [1000, 1180], KF = [1270, 1352], AF = [1290, 1740];
  const aD = E.norm([-130, -400]), aA = Math.atan2(aD[1], aD[0]), aTop = add(WF, mul(aD, 830)), aEnd = add(WF, mul(aD, -470));
  f.joint('throne', [820, 1500]).joint('pelvis', Pv, 'throne').joint('torso', [820, 1120], 'pelvis').joint('head', [850, 545], 'torso').joint('cloak', [840, 560], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('axe', WF, 'hand_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f');

  // ---- the crack between the halves: wanders across the forms; a rime tongue over the far breast, a char tongue into the
  // near belly. Ice on the side the line has on its screen left.
  const headCtl = hF([[0.06, -1.45], [0.1, -0.74], [0.15, -0.5], [0.17, -0.3], [0.19, -0.15], [0.2, -0.07], [0.26, 0.0], [0.31, 0.07], [0.27, 0.15], [0.2, 0.22], [0.185, 0.3], [0.12, 0.42], [0.1, 0.56]]);
  const ctl = [...headCtl, [896, 596], [934, 650], [894, 704], [964, 730], [1050, 772], [1000, 810], [904, 800], [866, 866], [884, 936], [776, 924], [706, 958], [790, 996], [836, 1034], [852, 1110], [800, 1188], [790, 1262], [846, 1330], [930, 1400], [990, 1480], [1040, 1800]];
  const Sp = { line: V.jag(f, ctl, 8, 15) };
  { const d = E.norm(sub(Sp.line[Sp.line.length - 1], Sp.line[0])), n = [d[1], -d[0]]; Sp.ice = n[0] < 0 ? 1 : -1; }
  const onLine = t => Sp.line[Math.min(Sp.line.length - 1, Math.round(t * (Sp.line.length - 1)))];

  const SKIc = { fill: '#c2cbd1', shadow: '#3e4660', light: '#eef4f6', shade: 0.36, tex: 'crack800', texOp: 0.45, maxShade: 90 };
  const SKCc = { fill: '#47372f', shadow: '#0e0808', light: '#7a5c4a', shade: 0.38, tex: 'craze800', texOp: 0.6, maxShade: 90 };
  const MAIL = { fill: '#5e6066', shadow: '#16161c', shade: 0.42, tex: 'mail800', texOp: 0.85, maxShade: 110 };
  const FURc = V.FUR(f, { fill: '#6a5e52', maxShade: 120 });
  const WOOLc = V.WOOL(f, { fill: '#4e4a44', maxShade: 110 });
  const LEAc = V.LEA(f, { maxShade: 50 });
  const iceOf = (l, k = 0.58) => V.rimed(l, k), charOf = (l, k = 0.55) => V.charred(l, k);
  const both = (pts, look, o = {}) => V.thermal(f, pts, Sp, iceOf(look), charOf(look), Object.assign({ riftW: 4, nFacets: 5, nEmbers: 8 }, o));
  const skin = (pts, o = {}) => V.thermal(f, pts, Sp, SKIc, SKCc, Object.assign({ riftW: 4, nFacets: 4, nEmbers: 8 }, o));
  const fold = (pts, w = 6, op = 0.55, c = '#0c0a10') => f.stroke(pts, w, c, { op });
  const blob = (c, rx, ry, a = 0) => ell(c, rx, ry, a, 12).map(q => add(q, [(f.r() - 0.5) * rx * 0.45, (f.r() - 0.5) * ry * 0.45]));
  // rime creeping over the burned side: a pale lumpy film with hoar specks, ink-edged on its lit side
  const creep = (c, rx, ry, a = 0) => { const b = blob(c, rx, ry, a); f.flat(b, P.rime, { op: 0.45 }); V.clipDraw(f, E.smooth(b), () => f.raw(`<rect x="${c[0] - rx * 1.5}" y="${c[1] - ry * 1.5}" width="${rx * 3}" height="${ry * 3}" fill="url(#rime800)" opacity="0.9"/>`)); f.line(b.slice(0, 6), 1.4, P.iceD, { op: 0.6 }); };
  // a hot seam licking off the crack into the ice: tapering, forking once
  const lick = (p, a, len, w) => V.crackNet(f, p, a, len, w, { depth: 1, fork: 0.45 });
  const plumbSteam = (p, h, w, ph) => V.steam(f, p, h, w, { sway: 22, phase: ph, op: 0.3, big: true });

  // ================= the throne: one block of glacier ice; the fire came up through its far side
  f.bone('throne');
  const throne = [[170, 1500, 1], [190, 1000], [204, 640], [236, 420, 1], [262, 170, 1], [318, 300, 1], [392, 50, 1], [452, 250, 1], [540, 110, 1], [600, 330, 1], [660, 230, 1], [700, 440], [1000, 470], [1160, 520, 1], [1290, 610, 1], [1360, 530, 1], [1420, 610, 1], [1500, 480, 1], [1560, 650, 1], [1550, 1500, 1]];
  const thD = f.part(throne, V.ICE(f, { fill: '#7a909e', light: '#b8c8d0', maxShade: 160, tex: 'crack800', texOp: 0.7 }));
  V.clipDraw(f, thD, () => {
    f.raw(`<rect x="0" y="0" width="${CW}" height="${CH}" fill="url(#rime800)" opacity="0.4"/>`);
    V.facets(f, [420, 700], 260, 520, 26, { op: 0.3, s: 3 }); V.frostCracks(f, [420, 800], 240, 600, 18);
    for (let i = 0; i < 5; i++) f.line([[240 + i * 90, 120 + i * 50], [262 + i * 84, 700], [270 + i * 80, 1400]], 2, '#5a6a7a', { op: 0.35 }); // strata in the glacier
    // the far side blackened from below: soot rising through the ice, fissures glowing, meltwater
    f.raw(`<path d="${E.smooth([[1040, 430], [1250, 520], [1380, 470], [1620, 360], [1620, 1620], [980, 1620], [1060, 1180], [1000, 820]])}" fill="#140f10" opacity="0.88" filter="url(#smkL800)"/>`);
    V.crackNet(f, [1300, 1400], -1.45, 520, 3.4, { depth: 2 }); V.crackNet(f, [1460, 1300], -1.9, 380, 2.8, { depth: 2 }); V.crackNet(f, [1240, 560], -0.4, 220, 2.2, { depth: 1 });
    V.embers(f, [1360, 900], 200, 500, 30, 1.6);
    for (const x of [1300, 1440, 1520]) V.melt(f, [x, 560 + (x % 7) * 10], 60, 2);
  });
  V.rimeCrust(f, [[236, 420], [262, 170], [318, 300], [392, 50], [452, 250], [540, 110], [600, 330]], 12, [-1, -0.3]);
  V.icicles(f, [[318, 300], [452, 250], [600, 330]], 6, 30, 70);
  V.icicles(f, [[190, 1000], [204, 640]], 5, 40, 90);
  V.ash(f, [1420, 520], 22, 160, 260, 2);

  // ================= the fur cloak behind him, spread over the seat: frozen stiff on the near side, smouldering on the far
  f.bone('cloak');
  const cloak = V.lumpy(f, [[470, 560], [700, 520], [980, 520], [1200, 560], [1320, 690], [1384, 900], [1420, 1180], [1452, 1470], [1300, 1494], [1150, 1470], [500, 1470], [330, 1494], [200, 1470], [222, 1180], [262, 900], [330, 690]], 14);
  both(cloak, FURc, { rift: false, nFacets: 8, nEmbers: 26, charAfter: () => { for (const [x, y] of [[1350, 1160], [1300, 1380], [1340, 820]]) { const b = blob([x, y], 24, 18); f.flat(b, '#0a0606'); f.line(b.slice(0, 8), 3, P.lamp, { op: 0.85 }); } V.ash(f, [1340, 1000], 20, 120, 360, 2); } });
  for (let i = 0; i < 9; i++) { const x = 236 + i * 30 + (i > 4 ? 900 : 0); fold([[x, 760 + (i % 3) * 60], [x - 6, 1100], [x + 8, 1460]], 12, 0.5, '#16120e'); } // heavy vertical folds of the fur
  V.icicles(f, [[200, 1470], [222, 1180], [262, 900]], 7, 40, 100);
  V.rimeCrust(f, [[470, 560], [330, 690], [262, 900], [222, 1180]], 14, [-1, -0.2], { feather: 2 });

  // ================= far throne arm: blackened ice block, glowing runes cut in its side, a carved end under his fist
  f.bone('throne');
  const armFlook = { fill: '#2c2628', shadow: '#080506', light: '#5a4c48', shade: 0.42, tex: 'craze800', texOp: 0.6, maxShade: 70 };
  f.part([[1120, 1040], [1330, 1046], [1336, 1130], [1124, 1124]], armFlook); // the arm's side
  f.part([[1316, 1036], [1424, 1048, 1], [1440, 1136], [1430, 1530, 1], [1320, 1530, 1], [1318, 1130]], armFlook); // the front post
  f.part([[1306, 1030], [1340, 1000], [1410, 1004], [1440, 1040], [1430, 1076], [1330, 1076]], Object.assign({}, armFlook, { fill: '#3a3032' })); // the carved end
  for (let i = 0; i < 4; i++) { const q = [1340 + (i % 2) * 34, 1180 + i * 70]; f.line([q, add(q, [0, 40]), add(q, [22, 18])], 4, P.ember, { op: 0.8 }); f.line([q, add(q, [0, 40])], 1.6, P.hot, { op: 0.6 }); } // runes, glowing in their cuts
  V.crackNet(f, [1380, 1480], -1.6, 160, 2.4, { depth: 1 });

  // ================= far upper arm (behind the body): mail sleeve over a heavy shoulder and arm
  f.bone('upperarm_f');
  both(K.chain([add(SF, [10, -50]), lerp(SF, EF, 0.45), EF], [280, 252, 200], { bp: [[0, 0.25, 0.12, 0.25]], bq: [[0, 0.55, 0.08, 0.25]] }), MAIL, { rift: false, nEmbers: 10 });
  fold([lp(SF, EF, 0.3, 90), lp(SF, EF, 0.5, 60), lp(SF, EF, 0.7, 100)], 5);

  // ================= legs: shins in leg-wraps, thighs in wool breeches coming toward us, heavy knees
  const leg = (sfx, Hp, Kn, A, wT, wK) => {
    f.bone('shin' + sfx);
    const sh = K.chain([add(Kn, [0, -40]), lerp(Kn, A, 0.32), A], [wK * 0.9, wK * 0.9, wK * 0.7], { bq: [[0, 0.3, 0.12, 0.25]], bp: [[0, 0.25, 0.05, 0.3]] });
    const shD = both(sh, { fill: '#8a7e6a', shadow: '#2a221c', shade: 0.42, tex: 'weave800', texOp: 0.5, maxShade: 70 }, { riftW: 3, nEmbers: 6 });
    V.clipDraw(f, shD, () => { for (let i = 0; i < 7; i++) { const t = 0.08 + i * 0.07; f.line([lp(Kn, A, t, -wK * 0.55), lp(Kn, A, t + 0.05, wK * 0.55)], 3, '#1c1612', { op: 0.75 }); } for (let i = 0; i < 4; i++) { const t = 0.12 + i * 0.12; f.line([lp(Kn, A, t, wK * 0.5), lp(Kn, A, t + 0.1, -wK * 0.5)], 7, P.leathD, { op: 0.85 }); } }); // linen wraps, cross-gartered with thongs
    f.bone('thigh' + sfx);
    const th = K.chain([sub(Hp, mul(E.norm(sub(Kn, Hp)), 70)), lerp(Hp, Kn, 0.55), Kn], [wT, wT * 0.9, wK], { bp: [[0, 0.5, 0.06, 0.3]], bq: [[0, 0.6, 0.1, 0.3]] });
    const thD = both(th, WOOLc, { riftW: 3, nEmbers: 8 });
    V.clipDraw(f, thD, () => {
      fold([lp(Hp, Kn, 0.4, wT * 0.3), lp(Hp, Kn, 0.6, wT * 0.1), lp(Hp, Kn, 0.78, wT * 0.34)], 6);
      fold([lp(Hp, Kn, 0.5, -wT * 0.36), lp(Hp, Kn, 0.7, -wT * 0.2), lp(Hp, Kn, 0.85, -wT * 0.4)], 5);
      // the knee: a heavy cap, the breeches straining over it
      f.flat(ell(add(Kn, [10, -20]), wK * 0.36, wK * 0.3, 0.2, 14), '#ffffff', { op: 0.12 });
      f.line(ell(add(Kn, [4, 4]), wK * 0.44, wK * 0.36, 0.2, 16).slice(1, 9), 5, '#0c0a10', { op: 0.5 });
      for (let i = 0; i < 3; i++) f.line([lp(Hp, Kn, 0.86 - i * 0.05, wT * 0.42), lp(Hp, Kn, 0.9 - i * 0.05, 0), lp(Hp, Kn, 0.86 - i * 0.05, -wT * 0.42)], 2, '#0c0a10', { op: 0.35 });
    });
  };
  // the near throne arm's front post stands behind the near knee
  f.bone('throne');
  const armNlook = V.ICE(f, { fill: '#b0c0c8', maxShade: 60 });
  const postN = [[500, 1176], [636, 1190, 1], [646, 1530, 1], [510, 1530, 1]];
  f.part(postN, Object.assign({}, armNlook, { fill: '#9eb0ba' }));
  V.clipDraw(f, E.smooth(postN), () => { V.frostCracks(f, [570, 1340], 50, 150, 6); for (let i = 0; i < 3; i++) f.line([[516, 1240 + i * 90], [630, 1252 + i * 90]], 3, '#3a4654', { op: 0.6 }); });
  leg('_f', HF, KF, AF, 320, 236);
  leg('_n', HN, KN, AN, 346, 252);

  // ================= torso: a big man gone to fat over muscle: wide shoulders, deep chest, a gut over the belt,
  // the mail shirt hanging on it and spreading over the lap
  f.bone('torso');
  const torso = [[700, 536], [560, 586], [464, 646], [424, 760], [430, 920], [446, 1060], [468, 1190], [500, 1290], [620, 1352], [760, 1376], [880, 1384], [960, 1360], [1040, 1318], [1110, 1330], [1200, 1336], [1262, 1300], [1244, 1200], [1254, 1046], [1240, 934], [1236, 806], [1224, 700], [1184, 612], [1060, 556], [960, 536]];
  const toD = both(torso, MAIL, { riftW: 5, nFacets: 8, rimeOp: 0.45, crazeOp: 0.45, nEmbers: 18 });
  V.clipDraw(f, toD, () => {
    // form: the barrel turning away on the far side, the shadow under the breast, the gut catching the light and its underside
    f.raw(`<path d="${E.smooth([[1110, 560], [1280, 640], [1300, 1000], [1250, 1280], [1130, 1280], [1170, 1000], [1150, 700]])}" fill="#0a080c" opacity="0.5" filter="url(#smkL800)"/>`);
    f.raw(`<path d="${E.smooth([[420, 640], [520, 640], [500, 900], [530, 1250], [420, 1250], [400, 900]])}" fill="#0a080c" opacity="0.35" filter="url(#smkL800)"/>`);
    f.raw(`<path d="${E.smooth([[500, 820], [700, 870], [860, 860], [1000, 870], [1190, 820], [1150, 880], [860, 912], [560, 900]])}" fill="#0a080c" opacity="0.45" filter="url(#smk800)"/>`);
    f.raw(`<ellipse cx="930" cy="1000" rx="210" ry="120" fill="#ffffff" opacity="0.1" filter="url(#smkL800)"/>`);
    f.raw(`<path d="${E.smooth([[560, 1150], [860, 1190], [1180, 1120], [1150, 1190], [860, 1250], [580, 1210]])}" fill="#0a080c" opacity="0.5" filter="url(#smk800)"/>`);
    f.raw(`<ellipse cx="640" cy="700" rx="140" ry="80" fill="#ffffff" opacity="0.12" filter="url(#smkL800)"/>`);
    // the breasts and the gut drawn by the mail's sag: folds hanging in curves under each mass, tension pulling to the far shoulder
    fold([[520, 830], [640, 872], [790, 858]], 7); fold([[930, 860], [1060, 880], [1190, 818]], 7);
    for (let i = 0; i < 3; i++) fold([[560 + i * 20, 950 + i * 46], [860, 1010 + i * 56], [1190 - i * 16, 940 + i * 50]], 5 - i, 0.45);
    fold([[1150, 640], [1060, 760], [980, 900]], 5, 0.4); fold([[1200, 700], [1140, 840], [1100, 980]], 4, 0.35);
    fold([[470, 900], [480, 1020], [500, 1160]], 6, 0.5); fold([[1220, 960], [1206, 1080], [1170, 1200]], 6, 0.5);
    // the mail hem over the lap: rows of heavier rings, a split at the front, worn rings hanging loose
    for (let i = 0; i < 3; i++) f.line([[500 + i * 4, 1290 - i * 14], [620, 1352 - i * 14], [760, 1376 - i * 14], [880, 1384 - i * 14], [960, 1360 - i * 14], [1040, 1318 - i * 14], [1110, 1330 - i * 14], [1200, 1336 - i * 14], [1262, 1300 - i * 14]], 3, '#101016', { op: 0.55 - i * 0.12 });
    // the byrnie's skirt lies over the thighs: tension along each thigh, a deep fold dropping between them
    fold([[640, 1240], [760, 1300], [880, 1360]], 8, 0.45); fold([[600, 1280], [700, 1330]], 5, 0.4);
    fold([[1010, 1230], [1030, 1280], [1040, 1318]], 12, 0.6); fold([[1080, 1240], [1150, 1290], [1230, 1320]], 7, 0.45);
    f.raw(`<ellipse cx="780" cy="1300" rx="120" ry="44" transform="rotate(30 780 1300)" fill="#ffffff" opacity="0.12" filter="url(#smkL800)"/>`);
    f.raw(`<ellipse cx="1160" cy="1290" rx="90" ry="34" transform="rotate(25 1160 1290)" fill="#ffffff" opacity="0.08" filter="url(#smkL800)"/>`);
    f.scratches([700, 760], 60, 8, '#c8ccd4'); f.scratches([1040, 980], 50, 6, '#a89080');
    // where the halves meet he is cracking open: a wider glowing rift over the breastbone and belly, forks off it
    V.glowLine(f, [onLine(0.36), onLine(0.48), onLine(0.62)], 70, P.lamp, 0.3, true);
    lick([990, 805], 0.4, 140, 3.4); lick([884, 936], -2.7, 90, 2.6); lick([852, 1110], -2.9, 150, 3); lick([800, 1188], -2.4, 110, 2.6);
    lick([894, 704], -2.6, 120, 2.6);
    // rime creeping over onto the burned breast and belly
    creep([1030, 840], 40, 22, 0.3); creep([1000, 1060], 34, 20, -0.2); creep([960, 1210], 30, 18, 0.1);
  });
  for (let i = 0; i < 4; i++) plumbSteam(onLine(0.38 + i * 0.09), 240, 44, i * 1.3);

  // ================= the belt under the gut: broad leather, iron buckle off to the side, a seax slung across the near thigh
  f.bone('pelvis');
  const belt = [[446, 1112], [640, 1170], [820, 1198], [1000, 1182], [1204, 1120], [1212, 1178], [1000, 1240], [820, 1256], [640, 1230], [450, 1170]];
  const beD = both(belt, V.LEA(f, { fill: P.leathD, maxShade: 30 }), { riftW: 3, nFacets: 1, nEmbers: 5 });
  V.clipDraw(f, beD, () => { f.line([[446, 1122], [820, 1208], [1206, 1130]], 1.6, '#c8bca4', { op: 0.5, dash: '6 5' }); f.line([[450, 1160], [820, 1246], [1208, 1168]], 1.6, '#c8bca4', { op: 0.5, dash: '6 5' }); });
  // the gut rolls over the belt's middle
  f.part([[640, 1150], [760, 1186], [880, 1196], [1000, 1178], [1060, 1160], [1010, 1206], [880, 1226], [740, 1214], [660, 1182]], Object.assign(charOf(MAIL, 0.2), { inkW: 1.4, cast: true, fill: '#4e4f56', maxShade: 20 }));
  f.part([[1080, 1150], [1160, 1130], [1170, 1210], [1088, 1226]], { fill: P.iron, shadow: '#0c0a0a', shade: 0.42, tex: 'mottle800', texOp: 0.6, inkW: 2, sharp: true });
  f.part([[1098, 1162], [1150, 1148], [1156, 1196], [1104, 1206]], { fill: '#1a1414', shade: 0.3, inkW: 1.4, sharp: true });
  f.line([[1124, 1150], [1128, 1204]], 6, P.ironL);
  f.part([[520, 1180], [560, 1170], [760, 1330], [736, 1350]], iceOf(V.LEA(f), 0.3)); // the seax sheath across the near thigh
  f.part([[506, 1150], [548, 1142], [566, 1178], [522, 1188]], { fill: P.bone, shade: 0.4, inkW: 1.4 }); // its bone grip
  f.line([[536, 1186], [744, 1338]], 1.4, '#c8bca4', { op: 0.5, dash: '5 4' });
  V.rimeCrust(f, [[520, 1180], [640, 1270]], 6, [-1, 0], { gap: 7 });

  // ================= near throne arm: rimed ice, runes cut in its side, a carved end his hand spreads over
  f.bone('throne');
  const sideN = [[230, 1060], [620, 1124], [640, 1200], [244, 1160]];
  f.part(sideN, armNlook); // the arm's side
  f.part(ell([652, 1132], 62, 70, 0.2, 18), Object.assign({}, armNlook, { fill: '#c4d0d6' })); // its carved end, a curled scroll
  f.line(ell([656, 1134], 40, 46, 0.2, 14).concat(ell([660, 1136], 20, 24, 0.2, 10)), 3, '#3a4654', { op: 0.6 });
  V.clipDraw(f, E.smooth(sideN), () => { f.raw(`<rect x="200" y="1000" width="460" height="220" fill="url(#rime800)" opacity="0.6"/>`); for (let i = 0; i < 5; i++) { const q = [300 + i * 56, 1080 + i * 10]; f.line([q, add(q, [0, 50]), add(q, [24, 20])], 4, '#3a4654', { op: 0.7 }); } });
  V.icicles(f, [[244, 1160], [600, 1196]], 8, 24, 60);

  // ================= near upper arm: a heavy shoulder and arm, the mail sleeve to above the elbow, frozen stiff
  f.bone('upperarm_n');
  const uaN = K.chain([add(SN, [10, -50]), lerp(SN, EN, 0.4), lerp(SN, EN, 0.78)], [244, 214, 190], { bp: [[0, 0.5, 0.1, 0.3]], bq: [[0, 0.75, 0.12, 0.25]] });
  const uaSk = K.chain([lerp(SN, EN, 0.6), EN, add(EN, mul(E.norm(sub(EN, SN)), 30))], [196, 176, 150], { bq: [[0, 0.3, 0.08, 0.3]] });
  skin(uaSk, { rift: false, nFacets: 2 });
  f.part(ell(add(EN, [-26, 10]), 54, 46, 0.5, 14), Object.assign({}, SKIc, { maxShade: 30, cast: false })); // the point of the elbow
  const uaD = both(uaN, MAIL, { rift: false, nFacets: 6 });
  V.clipDraw(f, uaD, () => { fold([lp(SN, EN, 0.3, 80), lp(SN, EN, 0.5, 50), lp(SN, EN, 0.7, 86)], 6, 0.5); fold([lp(SN, EN, 0.45, -70), lp(SN, EN, 0.66, -40)], 5, 0.45); f.raw(`<ellipse cx="${lp(SN, EN, 0.35, -40)[0]}" cy="${lp(SN, EN, 0.35, -40)[1]}" rx="60" ry="90" fill="#ffffff" opacity="0.12" filter="url(#smkL800)"/>`); });
  f.stroke([lp(SN, EN, 0.74, 100), lp(SN, EN, 0.8, 0), lp(SN, EN, 0.76, -104)], 8, '#101016', { op: 0.7 }); // the sleeve's hem
  for (const t of [0.86, 0.92]) f.stroke([lp(SN, EN, t, 92), lp(SN, EN, t + 0.015, 0), lp(SN, EN, t, -90)], 11, '#5a5e66'); // arm rings above the elbow
  V.icicles(f, [lp(SN, EN, 0.78, 96), lp(SN, EN, 0.78, -90)], 5, 18, 44);

  // ================= the fur mantle over the shoulders (on the torso, so it stays when the arms lift): it lies on the
  // trapezius and the deltoids, falls in heavy clumps, and its two front ends hang down the breast, pinned by brooches
  f.bone('torso');
  const mEdgeN = [[436, 690], [500, 742], [566, 762], [632, 706], [700, 646]], mEdgeF = [[990, 640], [1064, 690], [1140, 746], [1210, 764], [1256, 706]];
  const mantle = V.lumpy(f, [[452, 612], [540, 548], [680, 506], [840, 496], [1000, 506], [1140, 552], [1232, 622], ...mEdgeF.slice().reverse(), [900, 616], [780, 616], ...mEdgeN.slice().reverse()], 10);
  const maD = both(mantle, FURc, { riftW: 4, nFacets: 5, nEmbers: 12 });
  V.clipDraw(f, maD, () => {
    fold([[560, 556], [590, 640], [566, 740]], 16, 0.35); fold([[680, 520], [690, 600], [660, 660]], 12, 0.3); fold([[1110, 556], [1110, 650], [1150, 736]], 16, 0.4); fold([[1000, 520], [1010, 590], [1040, 660]], 12, 0.3);
    f.raw(`<ellipse cx="560" cy="600" rx="90" ry="50" fill="#ffffff" opacity="0.12" filter="url(#smkL800)"/>`);
    for (let i = 0; i < 30; i++) { const q = [460 + f.r() * 760, 520 + f.r() * 120]; f.line([q, add(q, [2 + f.r() * 4, 16 + f.r() * 12])], 1.4, '#1a1410', { op: 0.5 }); }
  });
  // the fur hangs in heavy locks along its edge
  for (const edge of [mEdgeN, mEdgeF]) for (let i = 0; i < edge.length - 1; i++) for (let k = 0; k < 3; k++) {
    const q = lerp(edge[i], edge[i + 1], (k + 0.5) / 3), l = 34 + f.r() * 30, w = 16 + f.r() * 8;
    const tuft = [add(q, [-w, -l * 0.4]), add(q, [w * 0.3, -l * 0.5]), add(q, [w, -l * 0.2]), add(q, [w * 0.4, l * 0.5]), add(q, [0, l]), add(q, [-w * 0.6, l * 0.5])];
    V.sides(f, Sp, () => f.part(tuft, Object.assign(iceOf(FURc, 0.5), { inkW: 1, inkHeavy: 1.4, cast: false, maxShade: 12 })), () => f.part(tuft, Object.assign(charOf(FURc, 0.5), { inkW: 1, inkHeavy: 1.4, cast: false, maxShade: 12 })));
    f.line([add(q, [-2, -l * 0.2]), add(q, [1, l * 0.8])], 1, '#14100c', { op: 0.6 });
  }
  V.icicles(f, mEdgeN.slice(0, 4).map(q => add(q, [0, 40])), 7, 22, 56);
  V.rimeCrust(f, [[438, 620], [540, 548], [680, 506]], 12, [-1, -0.3], { feather: 2 });
  for (const [x, y] of [[1130, 700], [1200, 760]]) { const b = blob([x, y], 16, 12); f.flat(b, '#0a0606'); f.line(b.slice(0, 8), 2.4, P.lamp, { op: 0.85 }); } // burn holes
  V.ash(f, [1180, 600], 14, 80, 220, 1.8);
  for (const [x, y] of [[640, 716], [1074, 712]]) { f.part(ell([x, y], 32, 28, 0, 16), { fill: P.iron, shadow: '#0c0a0a', shade: 0.42, inkW: 1.8, tex: 'mottle800', texOp: 0.6 }); const r = ell([x, y], 19, 16, 0, 12); f.line(r.concat([r[0]]), 3, P.ironL, { op: 0.7 }); f.rivet([x, y], 6, '#6a6a6a'); } // two iron brooches
  // the chain of office: heavy links sagging between the brooches, a hammer pendant hanging plumb on the gut
  V.chainLinks(f, [[640, 730], [700, 840], [830, 900], [960, 870], [1074, 728]], 36, P.iron);
  f.part([[808, 904], [852, 902], [852, 940], [884, 940], [884, 978], [776, 978], [776, 940], [808, 940]], { fill: P.iron, shade: 0.42, inkW: 1.6, sharp: true, tex: 'mottle800', texOp: 0.6 });
  f.line([[780, 944], [880, 944]], 2, P.ironL, { op: 0.6 });

  // ================= the head
  f.bone('head');
  // the neck: thick, rising out of the trapezius, under the beard
  skin(K.chain([[846, 640], [852, 560], add(HC, [-22, 120])], [330, 300, 250]), { rift: false });
  // a mail aventail from the helm's back edge over the nape
  both(hF([[-0.46, -0.12], [-0.52, 0.2], [-0.48, 0.46], [-0.3, 0.6], [-0.18, 0.46], [-0.24, 0.2], [-0.3, -0.04]]), MAIL, { rift: false, nFacets: 2 });
  V.icicles(f, hF([[-0.5, 0.46], [-0.3, 0.6]]), 4, 16, 36);
  const hpBase = { jaw: 1.3, chin: 0.02, nose: 1.12, hook: 0.18, squint: 0.42, browDown: 0.07, age: true, faceShade: 0.8, jawShade: 0.42, browW: 0.06 };
  V.sides(f, Sp,
    () => B.head(f, HC, H, hA, Object.assign({}, hpBase, { skin: SKIc.fill, mouth: 'set', eyeWhite: '#dfe8ec', iris: '#8696a2', browCol: '#e8eef2', hairCol: '#d0d8de' })),
    () => B.head(f, HC, H, hA, Object.assign({}, hpBase, { skin: SKCc.fill, mouth: 'snarl', noEar: true, eyeWhite: '#2a0e06', iris: P.lamp, browCol: '#140c0a', hairCol: '#140c0a', beard: 'stubble', beardCol: '#0e0a08' })));
  const faceO = hF([[-0.3, -0.4], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.33, 0.37], [0.31, 0.47], [0.14, 0.54], [-0.11, 0.49], [-0.26, 0.27], [-0.3, 0.08], [-0.37, -0.13]]);
  V.clipDraw(f, E.smooth(faceO), () => {
    V.sides(f, Sp, () => { f.raw(`<rect x="${HC[0] - 200}" y="${HC[1] - 200}" width="400" height="400" fill="url(#rime800)" opacity="0.4"/>`); V.facets(f, hF([[0.0, 0.12]])[0], 50, 50, 5, { op: 0.32 }); V.frostCracks(f, hF([[-0.05, 0.2]])[0], 40, 30, 3); },
      () => { V.crackNet(f, hF([[0.31, 0.24]])[0], 0.9, 50, 2.2, { depth: 1 }); V.flakes(f, hF([[0.28, -0.2]])[0], 14, 20, 5, 1.2); });
    V.rift(f, Sp, 3.4);
    creep(hF([[0.3, 0.0]])[0], 12, 9, 0.4);
  });
  // the frozen near eye: milky, a ghost of a pupil, frost on the lashes; the burned far eye: a coal in a black socket
  f.flat(hF(ell([0.12, -0.056], 0.05, 0.022, 0, 12)), '#e6eef2', { op: 0.9 }); f.flat(hF(ell([0.135, -0.056], 0.016, 0.016, 0, 8)), '#9aaab6', { op: 0.8 });
  f.line(hF([[0.05, -0.06], [0.11, -0.082], [0.175, -0.066]]), 2.6, '#f4f8fa', { op: 0.85 });
  V.icicles(f, hF([[0.0, -0.135], [0.2, -0.125]]), 3, 10, 24);
  V.glow(f, hF([[0.295, -0.064]])[0], 22, 16, P.lamp, 0.7);
  f.flat(hF(ell([0.295, -0.064], 0.026, 0.018, 0, 10)), P.lampL); f.flat(hF(ell([0.298, -0.066], 0.011, 0.009, 0, 8)), P.core);
  // the beard: the near half full and frozen, hanging in icicled ropes down the breast; the far half burned to stubble
  V.clipDraw(f, V.halfRegion(Sp.line, Sp.ice), () => {
    const BC = { fill: '#d0d8de', shadow: '#3e4862', light: '#ffffff', shade: 0.4, tex: 'hatch800', texOp: 0.4, maxShade: 40 };
    f.part(hF([[-0.22, 0.12], [-0.08, 0.3], [0.12, 0.34], [0.3, 0.35], [0.35, 0.5], [0.3, 0.76], [0.18, 1.0], [0.02, 1.12], [-0.14, 1.0], [-0.26, 0.74], [-0.3, 0.4]]), BC);
    for (const [u, v, l, w, sw] of [[-0.24, 0.72, 140, 40, -10], [-0.14, 0.92, 240, 50, 8], [-0.04, 1.0, 300, 56, -6], [0.06, 1.02, 260, 50, 12], [0.14, 0.92, 200, 40, -8], [0.24, 0.74, 150, 34, 6]]) {
      const q = hF([[u, v]])[0], pts = [add(q, [0, -30]), add(q, [sw, l * 0.4]), add(q, [-sw * 0.6, l * 0.75]), add(q, [sw * 0.3, l])];
      f.part(V.tube(pts, [w, w * 0.8, w * 0.55, w * 0.25]), Object.assign({}, BC, { cast: true, inkW: 1.4 }));
      f.line(pts.map(z => add(z, [-w * 0.2, 0])), 1.4, '#4a566e', { op: 0.6 });
      for (let k = 0; k < 3; k++) f.line([lerp(pts[1], pts[2], k / 3), add(lerp(pts[1], pts[2], k / 3), [w * 0.4, 10])], 1.2, '#4a566e', { op: 0.5 });
      V.icicle(f, add(pts[3], [0, -6]), 30 + (Math.round(u * 50) % 3) * 12, 10, { drop: v > 0.9 });
    }
    f.part(hF([[0.14, 0.215], [0.22, 0.196], [0.3, 0.205], [0.345, 0.245], [0.3, 0.262], [0.22, 0.252], [0.15, 0.285], [0.11, 0.268]]), BC); // the moustache
    for (let i = 0; i < 9; i++) f.line(hF([[-0.2 + i * 0.05, 0.38], [-0.21 + i * 0.05, 0.6]]), 1.2, '#4a566e', { op: 0.5 });
  });
  V.clipDraw(f, V.halfRegion(Sp.line, -Sp.ice), () => {
    for (let i = 0; i < 26; i++) { const q = hF([[0.2 + f.r() * 0.14, 0.34 + f.r() * 0.3]])[0]; f.flat(ell(q, 2.2, 2, 0, 6), '#0a0606', { op: 0.85 }); }
    for (let i = 0; i < 5; i++) { const q = hF([[0.22 + i * 0.025, 0.38 + (i % 2) * 0.06]])[0]; f.line([q, add(q, [4, 16]), add(q, [-2, 26])], 3, '#1a1210'); f.flat(ell(add(q, [-2, 28]), 3, 2.4, 0, 6), P.lampL); } // singed ends still glowing
    V.embers(f, hF([[0.27, 0.46]])[0], 20, 24, 6); V.ash(f, hF([[0.28, 0.36]])[0], 10, 40, 160, 1.4);
  });
  // the horned helm: iron, riveted, a comb over the crown; the near horn whole and rimed, the far horn melted to a stump
  const helm = hF([[-0.46, -0.08], [-0.48, -0.3], [-0.36, -0.5], [-0.12, -0.66, 1], [0.12, -0.56], [0.3, -0.42], [0.37, -0.28], [0.37, -0.17], [0.2, -0.2], [0.0, -0.22], [-0.22, -0.18], [-0.4, -0.02]]);
  const heD = both(helm, { fill: P.iron, shadow: '#0c0a0a', light: '#8a8a8e', shade: 0.42, tex: 'mottle800', texOp: 0.6, maxShade: 60 }, { riftW: 3.6, nFacets: 3, nEmbers: 5 });
  V.clipDraw(f, heD, () => { f.scratches(hF([[-0.2, -0.4]])[0], 40, 8, '#c8ccd2'); for (const u of [-0.34, 0.12]) f.line(hF([[u * 0.3 - 0.08, -0.62], [u, -0.4], [u * 1.1, -0.18]]), 10, '#2a2a2e', { op: 0.7 }); /* spangen straps */ creep(hF([[0.24, -0.4]])[0], 18, 12, 0.6); });
  f.part(hF([[-0.47, -0.12], [-0.2, -0.2], [0.1, -0.235], [0.38, -0.22], [0.38, -0.16], [0.1, -0.17], [-0.2, -0.14], [-0.47, -0.05]]), { fill: '#4a4a4e', shadow: '#0c0a0a', shade: 0.42, inkW: 1.6, tex: 'mottle800', texOp: 0.6 }); // brow band
  for (let i = 0; i < 6; i++) f.rivet(hF([[-0.4 + i * 0.15, -0.1 - Math.sin(i / 5 * Math.PI) * 0.09]])[0], 5, '#6a6a6a');
  f.part(V.tube(hF([[-0.38, -0.46], [-0.12, -0.64], [0.12, -0.54]]), [22, 22, 16]), { fill: '#3a3a3e', shadow: '#0c0a0a', shade: 0.42, inkW: 1.4, cast: false }); // the comb
  const horn = hF([[-0.38, -0.4], [-0.64, -0.5], [-0.86, -0.72], [-0.94, -0.98], [-0.86, -1.2]]);
  f.part(V.tube(horn, [70, 60, 46, 30, 12]), { fill: mix(P.bone, P.ice, 0.4), shadow: '#4a5266', light: '#ffffff', shade: 0.4, tex: 'crack800', texOp: 0.6, inkW: 1.8 });
  for (let i = 1; i < 4; i++) f.line([lp(horn[i], horn[i + 1], 0.2, -24 + i * 5), lp(horn[i], horn[i + 1], 0.25, 24 - i * 5)], 2, '#3e4660', { op: 0.6 });
  V.rimeCrust(f, horn.slice(0, 4).map(q => add(q, [0, -16])), 8, [-1, -0.4]);
  V.icicles(f, horn.slice(0, 3).map(q => add(q, [0, 22])), 4, 16, 40);
  const stump = hF([[0.2, -0.48], [0.3, -0.6], [0.41, -0.56], [0.41, -0.42], [0.3, -0.38]]);
  f.part(stump, { fill: '#3a2a26', shadow: P.charS, light: '#6a5040', shade: 0.4, inkW: 1.6, tex: 'craze800', texOp: 0.7 });
  // eye audit 2026-11-23: the molten end was a round glowing disc with a hot centre on the helm, above the burned-side
  // eye, and read as a second glowing eye. Now the heat runs as a ragged molten lip along the broken top edge.
  V.glowLine(f, hF([[0.27, -0.585], [0.33, -0.6], [0.4, -0.565]]), 14, P.lamp, 0.5);
  f.stroke(hF([[0.25, -0.57], [0.3, -0.595], [0.35, -0.585], [0.405, -0.56], [0.41, -0.5]]), 5, P.lamp); f.line(hF([[0.29, -0.59], [0.34, -0.583], [0.39, -0.565]]), 1.8, P.hot);
  for (const [x, l] of [[0.3, 0.12], [0.36, 0.16]]) f.stroke(hF([[x, -0.4], [x + 0.01, -0.4 + l * 0.5], [x - 0.005, -0.4 + l]]), 10, '#3a2a26'); // the melted horn dribbling down the helm
  V.ash(f, hF([[0.37, -0.58]])[0], 14, 60, 240, 1.8);
  plumbSteam(hF([[0.2, -0.3]])[0], 200, 36, 0.4); plumbSteam(hF([[0.27, 0.3]])[0], 160, 30, 2.2);

  // ================= the axe on his far shoulder: ash haft, a huge bearded head, the Tooth set in the pommel and
  // standing on the dais
  f.bone('axe');
  f.part(limb(aEnd, aTop, 40, 34, { steps: 10 }), Object.assign(charOf({ fill: P.wood, shadow: P.woodD }, 0.35), { tex: 'wood800', texOp: 0.7, maxShade: 20 }));
  for (const t of [0.42, 0.45, 0.48, 0.51]) f.line([lp(aEnd, aTop, t, -21), lp(aEnd, aTop, t + 0.015, 21)], 4, P.leathD); // grip wrap below the fist
  V.crackNet(f, lp(aEnd, aTop, 0.25, 0), aA + Math.PI, 120, 1.8, { depth: 1 });
  V.rimeCrust(f, [lp(aEnd, aTop, 0.72, -18), lp(aEnd, aTop, 0.95, -18)], 6, [-1, -0.2], { gap: 7 });
  const AX = frame(aTop, aA, 1); // u along the haft toward its top, v to the right of it (forward)
  const blade = AX([[-70, 20], [30, 24], [54, 80], [62, 180], [44, 292, 1], [-60, 302], [-190, 282, 1], [-160, 222], [-120, 140], [-100, 60], [-90, 24]]);
  const blD = f.part(blade, { fill: '#4e4e54', shadow: '#0c0a0a', light: '#b8bcc4', shade: 0.4, tex: 'mottle800', texOp: 0.6, maxShade: 60 });
  V.clipDraw(f, blD, () => {
    f.line(AX([[46, 286], [-60, 298], [-186, 278]]), 9, '#c8ccd2', { op: 0.75 }); // the ground edge
    for (const [u, v] of [[0, 296], [-90, 296]]) f.flat(ell(AX([[u, v]])[0], 11, 7, aA, 8), '#141414'); // nicks
    V.crackNet(f, AX([[-30, 150]])[0], aA + 1.6, 100, 2.2, { depth: 1 });
    f.line(AX([[-70, 40], [-60, 130], [-40, 220]]), 2, '#2a2a2e', { op: 0.6 });
    for (let i = 0; i < 4; i++) f.line(AX([[-60 - i * 10, 90 + i * 34], [-50 - i * 10, 104 + i * 34]]), 3, P.lampL, { op: 0.8 }); // knotwork inlay glowing
    f.raw(`<rect x="${aTop[0] - 200}" y="${aTop[1] - 200}" width="500" height="200" fill="url(#rime800)" opacity="0.5"/>`);
  });
  V.rimeCrust(f, AX([[30, 26], [56, 100], [62, 180]]), 7, [-0.4, -1]);
  f.part(AX([[-90, -26], [44, -26], [44, 28], [-90, 28]]), { fill: '#3a3a3e', shadow: '#0c0a0a', shade: 0.42, inkW: 1.6, tex: 'mottle800', texOp: 0.6 }); // the socket
  for (const u of [-60, -10, 26]) f.rivet(AX([[u, 0]])[0], 5, '#6a6a6a');
  f.part(AX([[44, -14], [76, -10], [76, 10], [44, 14]]), { fill: '#3a3a3e', shade: 0.4, inkW: 1.4 }); // the haft's end cap
  // the Tooth: a long pale fang of stone in an iron claw setting at the haft's foot, its point on the dais
  const PM = frame(aEnd, aA + Math.PI, 1);
  f.part(PM([[-20, -28], [30, -30], [42, 0], [30, 30], [-20, 28]]), { fill: P.iron, shadow: '#0c0a0a', shade: 0.42, inkW: 1.6, tex: 'mottle800', texOp: 0.6 });
  f.part(PM([[34, -15], [88, -11], [146, 1, 1], [88, 12], [34, 15]]), { fill: '#dcd8ca', shadow: '#8a8478', light: '#ffffff', shade: 0.4, inkW: 1.8, inkHeavy: 2.6, tex: 'mottle800', texOp: 0.4 });
  f.line(PM([[44, -2], [130, 1]]), 1.6, INK, { op: 0.6 }); f.line(PM([[50, -9], [100, -7]]), 2, '#ffffff', { op: 0.6 });
  for (let i = 0; i < 4; i++) f.part(PM([[26, -20 + i * 12], [48, -22 + i * 12], [50, -14 + i * 12], [26, -12 + i * 12]]), { fill: '#5a5a5e', shade: 0.3, inkW: 1, cast: false }); // the claws of the setting

  // ================= the far forearm laid on the throne arm, charred, the fist round the haft
  f.bone('forearm_f');
  const faF = K.chain([add(EF, [-40, 6]), lerp(EF, WF, 0.45), lerp(EF, WF, 0.92)], [216, 204, 160], { bp: [[0, 0.3, 0.12, 0.25]], bq: [[0, 0.4, 0.08, 0.3]] });
  const faD = skin(faF, { rift: false, nEmbers: 10 });
  V.clipDraw(f, faD, () => { V.crackNet(f, lerp(EF, WF, 0.3), -0.2, 120, 2.8, { depth: 2 }); V.flakes(f, lerp(EF, WF, 0.5), 40, 40, 6, 1.4); creep(lp(EF, WF, 0.25, 70), 26, 14, 0.1); f.line([lp(EF, WF, 0.1, 50), lp(EF, WF, 0.5, 60), lp(EF, WF, 0.86, 46)], 3, '#0a0606', { op: 0.5 }); });
  // a leather bracer studded with iron, and two arm rings at the elbow
  f.part(K.chain([lerp(EF, WF, 0.52), lerp(EF, WF, 0.7), lerp(EF, WF, 0.88)], [214, 200, 176]), charOf(LEAc, 0.35));
  f.line([lp(EF, WF, 0.53, 104), lp(EF, WF, 0.54, -104)], 3, P.leathL, { op: 0.4 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) f.rivet(lp(EF, WF, 0.56 + i * 0.12, -60 + j * 60), 5, '#5a5a5a');
  for (const t of [0.16, 0.22]) f.stroke([lp(EF, WF, t, 112), lp(EF, WF, t + 0.01, 0), lp(EF, WF, t, -110)], 12, P.iron);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, aA, 112, '#3e3230', { shadow: P.charS, tex: 'craze800', texOp: 0.6, name: 'jarl axe' });
  V.seam(f, [add(WF, [-40, -20]), add(WF, [-6, -4]), add(WF, [24, 14])], 2.6);
  for (const q of gF.F([[0.46, -0.45], [0.48, 0.15]])) { f.part(ell(q, 13, 20, aA, 10), { fill: P.iron, shadow: '#0c0a0a', shade: 0.4, inkW: 1.4, cast: false }); f.flat(ell(add(q, [-3, -6]), 3, 5, aA, 6), P.ironL, { op: 0.7 }); } // iron rings on burned fingers

  // ================= the near forearm on the throne arm, frozen, the hand spread over the carved end
  f.bone('forearm_n');
  const faN = K.chain([add(EN, [-20, -6]), lerp(EN, WN, 0.3), lerp(EN, WN, 0.7), lerp(EN, WN, 1.02)], [184, 176, 150, 134], { bq: [[0, 0.6, 0.14, 0.3]], bp: [[0, 0.5, 0.06, 0.3]] });
  const fnD = skin(faN, { rift: false, nFacets: 6 });
  V.clipDraw(f, fnD, () => { V.frostCracks(f, lerp(EN, WN, 0.4), 60, 40, 5); lick(lp(EN, WN, 0.2, -80), -0.5, 70, 2); f.line([lp(EN, WN, 0.1, -60), lp(EN, WN, 0.5, -70), lp(EN, WN, 0.86, -50)], 3, '#2a3044', { op: 0.5 }); f.line([lp(EN, WN, 0.15, 30), lp(EN, WN, 0.6, 40)], 2, '#4a5670', { op: 0.5 }); });
  f.part(K.chain([lerp(EN, WN, 0.52), lerp(EN, WN, 0.7), lerp(EN, WN, 0.88)], [168, 156, 146]), Object.assign(iceOf(LEAc, 0.35), { tex: 'rime800', texOp: 0.6 })); // leather bracer
  for (let i = 0; i < 4; i++) f.line([lp(EN, WN, 0.56 + i * 0.09, -70), lp(EN, WN, 0.6 + i * 0.09, -20)], 2, P.leathD, { op: 0.8 }); // its lacing
  for (let i = 0; i < 3; i++) f.rivet(lp(EN, WN, 0.58 + i * 0.12, 40), 5, '#6a6e74');
  V.icicles(f, [lp(EN, WN, 0.52, 82), lp(EN, WN, 0.88, 74)], 4, 18, 40);
  f.bone('hand_n');
  const hAng = 1.0, hS = 118, hC = add(WN, rot([0.62 * hS * 1.2, 0], hAng));
  const hn = B.hand(f, hC, hAng, hS, mix(SKIc.fill, '#ffffff', 0.1), { spread: 0.22, curl: 0.55, shadow: '#5a6478' });
  for (const y of [-0.11, 0.12]) { const q = hn.F([[0.62, y - 0.17], [0.72, y - 0.16], [0.72, y + 0.16], [0.62, y + 0.17]]); f.part(q, { fill: '#6e727a', shadow: '#22262e', shade: 0.4, inkW: 1.4, cast: false, sharp: true }); f.line([q[0], q[3]], 1.6, '#e8eef0', { op: 0.6 }); } // iron rings
  V.clipDraw(f, E.smooth(hn.F([[-0.7, -0.6], [0.7, -0.6], [1.5, 0.0], [0.7, 0.7], [-0.7, 0.6]])), () => f.raw(`<rect x="${WN[0] - 60}" y="${WN[1] - 120}" width="320" height="360" fill="url(#rime800)" opacity="0.4"/>`));
  for (const q of hn.tips) V.icicle(f, add(q, [0, 8]), 18 + f.r() * 16, 7, { drop: f.r() < 0.5 });

  // ================= the dais step in front of his shins: glacier ice; a glowing fissure has opened under the axe's
  // foot and runs back across it, steaming
  f.bone('throne');
  const dais = [[0, 1530], [400, 1520], [820, 1528], [1200, 1516], [1600, 1528], [1600, 1600], [0, 1600]];
  const daD = f.part(dais, V.ICE(f, { fill: '#b6c4cc', maxShade: 60 }));
  V.clipDraw(f, daD, () => {
    f.raw(`<rect x="0" y="1460" width="1600" height="160" fill="url(#rime800)" opacity="0.5"/>`);
    V.facets(f, [500, 1540], 460, 50, 16, { op: 0.3, s: 2 }); V.frostCracks(f, [420, 1540], 380, 50, 12);
    f.raw(`<path d="${E.smooth([[1060, 1470], [1300, 1460], [1640, 1470], [1640, 1620], [1180, 1620]])}" fill="#140f10" opacity="0.8" filter="url(#smkL800)"/>`);
    const fis = V.jag(f, [[1600, 1540], [1300, 1556], [1060, 1550], [820, 1574], [640, 1610]], 10, 18);
    V.glowLine(f, fis, 40, P.lamp, 0.4, true); V.seam(f, fis, 5);
    for (const [p, a] of [[[1300, 1556], -1.2], [[1060, 1550], 2.4], [[820, 1574], -2.6]]) lick(p, a, 70, 2.4);
  });
  V.rimeCrust(f, [[0, 1530], [400, 1520], [800, 1528]], 14, [-1, -0.2], { feather: 2 });
  for (let i = 0; i < 2; i++) V.steam(f, [1120 + i * 260, 1556], 160, 44, { sway: 30, phase: i * 1.7, op: 0.22, big: true });
  return f;
}

module.exports = {
  heroes: [
    { key: 'riven_jarl', name: 'The Riven Jarl', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: rivenJarl },
    { key: 'jotun_thane', name: 'Jotun Thane', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: jotunThane },
    { key: 'twinflame_seeress', name: 'Twinflame Seeress', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: seeress },
    { key: 'fissure_worm', name: 'Fissure Worm', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: fissureWorm },
    { key: 'magma_hound', name: 'Magma Hound', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: magmaHound },
    { key: 'obsidian_shieldmaiden', name: 'Obsidian Shieldmaiden', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: shieldmaiden },
    { key: 'steam_wraith', name: 'Steam Wraith', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: steamWraith },
    { key: 'rimeburnt_thrall', name: 'Rimeburnt Thrall', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: thrall },
  ],
};
