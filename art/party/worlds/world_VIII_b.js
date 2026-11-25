// World VIII, The Sundered Rime (Fire + Frost, Thermal Shock), second batch (VIII_b): the eleven creatures of the
// bible file not built in the first batch. Seeds 820 + bible order (rulers, elites, cast).
// Every body is split, one side rimed white, the other charred with glowing orange seams, the line between them a
// crack (never ruler-straight). The split falls in a different place on each creature, as the bible says:
//   The Sleeper Under the Hold  outside / inside: ice skin outside, the miners' adits burning inside her
//   The Firstbreaker            horizontal at the shaft rim: rimed above, burning below; the crack rings his chest
//   Berserker                   diagonal, near shoulder to far hip: iced above and behind, burnt below and in front
//   Musk Ox                     lengthwise along the flank: frozen back and hump, burnt belly and legs
//   Fire-Setter                 one limb: the fork arm burnt to the shoulder blade, a crack round the shoulder
//   The Skald                   across the face at the mouth: frozen brow and hair, burnt jaw, throat and chest
//   Mead-Bearer                 at the knees: burnt below, frozen above, the crack ringing both knees
//   Ore-Hauler                  along the harness: a burnt stripe under the strap, frozen either side
//   Snow Hare                   a crazing: a mosaic of rimed and singed plates over the whole body
//   Pit Adder                   a spiral with the coils: burnt where they lay on the rock, rimed outside
//   Glacier Wolverine           front / back: burnt head and forelegs, rimed from the shoulders back
// Drawn facing right with kit.foeBase (light from the upper right) and flipped, so foes face left lit from the upper
// left. Built for the rig: joints first, f.bone() before every part, parts drawn complete, overlaps at every joint.
// No lightning anywhere in this world; no eye motifs (VIII is not a void world): animal eyes are small and dark.
'use strict';
const K = require('../kit');
const V = require('./kit_VIII_b');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P } = V;

// a front/back split along one part's axis (as in world_VIII.js): the ice goes on the side toward `back`
function axisSplit(f, a, b, back, amp = 6, ext = 80, step = 15) {
  const d = E.norm(sub(b, a)), line = V.jag(f, [add(a, mul(d, -ext)), add(b, mul(d, ext))], amp, step), n = [d[1], -d[0]];
  return { line, ice: (n[0] * back[0] + n[1] * back[1]) > 0 ? 1 : -1, dir: E.norm(back) };
}
const fold = (f, pts, w = 3, op = 0.5, c = '#10141c') => f.stroke(pts, w, c, { op });

// ------------------------------------------------------------------ FIRE-SETTER (cast, human 1.0)
// A miner who cracked the rock face by fire-setting: a fire stacked against the stone, then cold water thrown on it.
// He rears back on his back foot with the long iron fork raised high in the near hand, a smouldering bundle of birch
// faggots on its tines, about to drive the fire forward; the far hand swings the bucket back. Lean and wiry.
// Split: one limb. The fork arm is burnt from the fingers to the shoulder blade, split in glowing seams and flaking ash;
// a crack rings the shoulder like the edge of a pauldron. The rest of him is rimed white from the quench water that
// splashed back on him: the jerkin frozen into creases, icicles off the bucket hand and the knees.
// Rig: standard humanoid + fork (on hand_n) + bucket (on hand_f).
function fireSetter() {
  const CW = 700, CH = 900;
  const f = new Fig(V.base(824, CH)); V.texturesB(f);
  const gy = f.o.groundY, H = 94;
  const N = [298, 350], C = [290, 452], Pv = [314, 562];
  const S = B.spine(N, C, Pv, H);
  const SN = [292, 372], EN = [236, 282], WN = [228, 168];
  const SF = [344, 366], EF = [300, 492], WF = [192, 552];
  const HN = S.at(-0.2, 1.0), KN = [262, 706], AN = [222, 830];
  const HF = S.at(0.32, 0.98), KF = [404, 696], AF = [430, 830];
  const HC = [324, 296], hA = 0.02, hF = frame(HC, hA, H);
  const fA = -0.31, fd = [Math.cos(fA), Math.sin(fA)], fButt = add(WN, mul(fd, -120)), fNeck = add(WN, mul(fd, 236));
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.8), N: S.at(0.1, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('fork', WN, 'hand_n').joint('bucket', WF, 'hand_f');
  const WOOLl = V.WOOL(f, { fill: '#5c5850' }), LEAl = V.LEA(f);
  const ICEW = V.rimed(WOOLl, 0.42), ICEL = V.rimed(LEAl, 0.28);
  const SKC = V.SKC(f, { fill: '#40322c', maxShade: 26 }), SKI = V.SKI(f);
  const crease = (pts, w = 2.6) => { f.stroke(pts, w, '#1a2232', { op: 0.55 }); f.line(pts.map(q => add(q, [1.5, -1.5])), 1, P.iceL, { op: 0.6 }); };

  // ---- far arm, behind the body: rimed wool sleeve, the hand swinging the bucket back by its bail
  V.armRig(f, SF, EF, WF, [38, 34, 28], () => {
    V.iced(f, K.chain([SF, EF, lerp(EF, WF, 0.3)], [40, 36, 32], { bp: [[0, 0.45, 0.12]] }), V.rimed(WOOLl, 0.55), { nFacets: 2 });
    V.iced(f, K.chain([lerp(EF, WF, 0.22), lerp(EF, WF, 0.6), WF], [30, 30, 24], { bq: [[0, 0.4, 0.14]] }), SKI, { nFacets: 1 });
    f.part(ell(lerp(EF, WF, 0.26), 17, 7, V.ang(EF, WF) + Math.PI / 2, 12), ICEW); // rolled, frozen cuff
    V.icicles(f, [lerp(EF, WF, 0.3), lerp(EF, WF, 0.8)].map(q => add(q, [0, 12])), 3, 8, 18);
  }, '_f');
  // the bucket: iron-hooped staves, its bail in the fist, the water frozen in a slop over the rim; it lags the swing
  f.bone('bucket');
  const bk = add(WF, [-16, 100]), bkA = 0.2, BK = frame(bk, bkA, 1);
  const staves = BK([[-40, -52], [40, -52], [32, 50], [-32, 50]]);
  const sD = f.part(staves, V.rimed({ fill: P.wood, shadow: P.woodD, tex: 'grain824', texOp: 0.7, shade: 0.4 }, 0.3));
  V.clipDraw(f, sD, () => { for (let i = -3; i <= 3; i++) f.line(BK([[i * 12.5, -44], [i * 11, 46]]), 1.2, INK, { op: 0.6 }); f.raw(`<path d="${E.smooth(staves)}" fill="url(#rime824)" opacity="0.6"/>`); });
  for (const v of [-30, 4, 36]) f.part(K.chain(BK([[-46 + Math.abs(v) * 0.08, v], [46 - Math.abs(v) * 0.08, v]]), [5, 5]), { fill: P.ironL, shadow: '#1a1a1e', shade: 0.35, inkW: 1, cast: false }); // hoops
  for (const v of [-30, 36]) f.rivet(BK([[-30, v]])[0], 2);
  f.part(BK([[-46, -46], [-30, -54], [0, -56], [30, -54], [46, -46], [30, -40], [0, -38], [-30, -40]]), { fill: P.woodD, shade: 0.3, inkW: 1.2, cast: false }); // the rim seen from above, dark inside
  // the frozen slop: a tongue of ice spilled over the rim on the side the swing threw it, hanging in icicles
  const slop = BK([[14, -50], [40, -58], [56, -46], [52, -14], [58, 14], [50, 30], [44, 8], [40, -30], [22, -42]]);
  f.part(slop, V.ICE(f, { fill: P.glass }));
  V.icicles(f, BK([[46, 30], [58, 16]]), 2, 10, 22); V.icicles(f, BK([[-40, 46], [36, 46]]), 3, 6, 14);
  f.flat(BK([[-34, -52], [10, -54], [20, -46], [-26, -44]]), P.iceL, { op: 0.5 });
  // the bail: an iron hoop from the ears up into the fist
  const e1 = BK([[-44, -30]])[0], e2 = BK([[44, -30]])[0];
  f.line([e1, add(WF, [-14, 2]), WF], 3.4, INK); f.line([e1, add(WF, [-14, 2]), WF], 2, P.ironL);
  f.line([e2, add(WF, [16, 10]), WF], 3.4, INK); f.line([e2, add(WF, [16, 10]), WF], 2, P.ironL);
  for (const e of [e1, e2]) f.rivet(e, 2.6);
  f.bone('hand_f');
  B.grip(f, WF, EF, V.ang(e1, e2) + Math.PI, 23, P.skinI, { shadow: P.skinIS, tex: 'rime824', texOp: 0.5, name: 'fire-setter bail' });
  V.icicles(f, [add(WF, [-12, 16]), add(WF, [12, 18])], 3, 8, 20);

  // ---- legs: wool leggings frozen stiff, puttee wraps on the shins, iron-shod boots; icicles from the knees
  const legSet = (Hp, Kn, A, sfx, tone) => {
    const LW = Object.assign({}, ICEW, { fill: mix(ICEW.fill, '#000', tone) });
    V.legRig(f, Hp, Kn, A, 46, () => {
      V.iced(f, K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.15)], [62, 56, 46, 44], { bp: [[0, 0.55, 0.12]], bq: [[0, 0.5, 0.1], [1, 0.25, 0.06]] }), LW, { nFacets: 3 });
      crease([lp(Hp, Kn, 0.78, 14), lp(Hp, Kn, 0.96, 0), lp(Kn, A, 0.08, -12)]);
      crease([lp(Hp, Kn, 0.35, -18), lp(Hp, Kn, 0.5, -6)], 2);
      // puttees: a band wound up the shin, each turn overlapping the one below
      const pu = K.chain([lerp(Kn, A, 0.1), lerp(Kn, A, 0.5), lerp(Kn, A, 0.92)], [44, 42, 32], { bp: [[0, 0.7, 0.2]] });
      V.iced(f, pu, Object.assign({}, V.rimed({ fill: '#6a6050', shadow: '#2a241e', tex: 'weave824', texOp: 0.6 }, 0.35), { fill: mix('#6a6050', P.ice, 0.3 + tone) }), { nFacets: 2 });
      for (let i = 0; i < 7; i++) { const t = 0.16 + i * 0.11; f.line([lp(Kn, A, t, 22), lp(Kn, A, t + 0.07, -22)], 2, INK, { op: 0.6 }); f.line([lp(Kn, A, t - 0.01, 20), lp(Kn, A, t + 0.06, -20)], 1, P.iceL, { op: 0.5 }); }
      V.icicles(f, [lp(Kn, A, 0.02, 22), lp(Kn, A, 0.06, -20)], 3, 10, 24);
    }, sfx);
    V.footRig(f, Kn, A, 48, () => {
      B.boot(f, A, 1, 48, mix(P.leath, P.ice, 0.3), { shaft: 0.5, tex: 'rime824', texOp: 0.6 });
      const X = u => A[0] + u * 48;
      f.part([[X(-0.46), gy - 6], [X(1.24), gy - 6], [X(1.2), gy], [X(-0.42), gy]], { fill: P.iron, shadow: '#101010', shade: 0.4, inkW: 1.1, cast: false, sharp: true }); // the iron shoeing
      for (let i = 0; i < 5; i++) f.rivet([X(-0.3 + i * 0.34), gy - 3], 1.8);
      V.rimeCrust(f, [[X(-0.4), gy - 28], [X(-0.36), A[1] + 2]], 5, [-1, 0], { gap: 6 });
    }, sfx);
  };
  legSet(HF, KF, AF, '_f', 0.12);
  legSet(HN, KN, AN, '_n', 0);

  // ---- torso: wool shirt under a leather jerkin frozen into creases; the near shoulder blade burnt (the fork arm's
  // burn reaches in over it), the crack ringing the shoulder like a pauldron's edge
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.3, 0.3], [0.08, 0.66, 0.5], [0.24, 0.74, 0.6], [0.45, 0.62, 0.52], [0.66, 0.56, 0.5], [0.86, 0.62, 0.52], [1.02, 0.66, 0.5], [1.1, 0.56, 0.42]]);
  const shoulderZone = V.jagLoop(f, [S.at(-0.9, -0.1), S.at(-0.4, -0.16), S.at(0.0, -0.1), S.at(0.12, 0.06), S.at(0.0, 0.22), S.at(-0.3, 0.26), S.at(-0.62, 0.34), S.at(-0.9, 0.28)], 6, 11);
  V.zone(f, torso, ICEW, V.charred(WOOLl, 0.6), shoulderZone, { riftW: 2.6 });
  const jer = S.shape([[0.04, 0.7, 0.28], [0.2, 0.8, 0.5], [0.45, 0.7, 0.42], [0.7, 0.62, 0.44], [0.92, 0.68, 0.48], [1.06, 0.7, 0.42]]);
  V.zone(f, jer, ICEL, V.charred(LEAl, 0.5), shoulderZone, { riftW: 3, iceO: { cracks: 3 } });
  for (const [u0, v0, u1, v1] of [[-0.5, 0.5, 0.1, 0.62], [-0.55, 0.7, 0.2, 0.74], [-0.5, 0.86, 0.3, 0.84], [0.2, 0.3, 0.4, 0.5]]) crease([S.at(u0, v0), S.at((u0 + u1) / 2, (v0 + v1) / 2 + 0.03), S.at(u1, v1)]);
  for (let i = 0; i < 4; i++) f.line([S.at(0.34, 0.3 + i * 0.13), S.at(0.46, 0.35 + i * 0.13)], 1.6, P.leathD); // lacing
  f.line([S.at(0.38, 0.22), S.at(0.4, 0.62), S.at(0.36, 0.98)], 1.5, INK, { op: 0.7 });
  V.icicles(f, [S.at(-0.66, 1.04), S.at(-0.2, 1.08), S.at(0.3, 1.06)], 6, 8, 22);
  // belt: tinder pouch, an iron wedge and a wooden mallet in loops, a net bag with a chunk of split rock
  f.bone('pelvis');
  f.part([S.at(-0.7, 0.9), S.at(0.56, 0.88), S.at(0.58, 0.98), S.at(-0.72, 1.0)], { fill: P.leathD, shade: 0.4, sharp: true, tex: 'rime824', texOp: 0.35 });
  f.part([S.at(0.16, 0.88), S.at(0.3, 0.88), S.at(0.3, 0.99), S.at(0.16, 0.99)], { fill: P.ironL, shade: 0.3, inkW: 1.1, sharp: true });
  f.part([S.at(0.36, 0.96), S.at(0.5, 0.97), S.at(0.48, 1.22), S.at(0.38, 1.24)], V.rimed(LEAl, 0.35)); // tinder pouch
  f.part([S.at(0.35, 0.95), S.at(0.51, 0.96), S.at(0.5, 1.03), S.at(0.36, 1.03)], V.rimed(LEAl, 0.55));
  f.line([S.at(0.43, 1.03), S.at(0.43, 1.12)], 1.2, P.leathD);
  f.part([S.at(0.6, 0.94), S.at(0.68, 0.94), S.at(0.66, 1.3, 1), S.at(0.63, 1.31)], { fill: P.iron, shade: 0.4, inkW: 1.1, cast: false }); // iron wedge
  // mallet: wooden head on a short haft hanging from a loop behind the hip
  const mh = S.at(-0.6, 1.24);
  f.line([S.at(-0.52, 0.96), mh], 6, INK); f.line([S.at(-0.52, 0.96), mh], 4, P.woodL);
  f.part([add(mh, [-26, -8]), add(mh, [18, -10]), add(mh, [20, 14]), add(mh, [-24, 16])], V.rimed({ fill: P.wood, shadow: P.woodD, tex: 'grain824', texOp: 0.7 }, 0.3));
  f.part([add(mh, [-28, -9]), add(mh, [-22, -9]), add(mh, [-20, 17]), add(mh, [-26, 17])], { fill: P.woodD, shade: 0.3, inkW: 1, cast: false });
  // net bag of split rock
  const nb = S.at(-0.2, 1.3);
  f.line([S.at(-0.24, 0.98), add(nb, [-10, -30])], 2, P.leathD); f.line([S.at(-0.12, 0.98), add(nb, [10, -30])], 2, P.leathD);
  const rock = [add(nb, [-24, -22]), add(nb, [12, -32]), add(nb, [28, -6]), add(nb, [20, 22]), add(nb, [-12, 26]), add(nb, [-30, 4])];
  f.part(rock.map(q => [...q, 1]), { fill: '#4a4644', shadow: '#16161a', shade: 0.4, tex: 'crack824', texOp: 0.7, inkW: 1.3 });
  f.line([add(nb, [-4, -30]), add(nb, [2, -4]), add(nb, [-6, 24])], 1.6, INK); // the fresh split face
  for (let i = 0; i < 4; i++) { f.line([add(nb, [-30 + i * 16, -24]), add(nb, [-24 + i * 14, 26])], 1, '#8a8070', { op: 0.85 }); f.line([add(nb, [-30, -14 + i * 12]), add(nb, [28, -18 + i * 12])], 1, '#8a8070', { op: 0.85 }); }
  V.rimeCrust(f, [add(nb, [-24, -24]), add(nb, [12, -34])], 4, [-1, -0.2], { gap: 5 });

  // ---- head: soot-black face under the leather hood, the sooty rag over the mouth, eyes screwed up against smoke
  f.bone('head');
  f.part(limb(S.at(0.12, -0.05), add(HC, [-6, 30]), 34, 30), V.rimed(SKC, 0.2)); // neck, rag-wrapped below
  B.head(f, HC, H, hA, { skin: '#64524a', jaw: 1.02, nose: 1.05, hook: 0.15, mouth: 'set', squint: 0.8, browDown: 0.08, age: true, gaunt: true, faceShade: 0.8, noEar: true, eyeWhite: '#9a8a78', browCol: '#141010', hairCol: '#141010', beard: 'stubble', beardCol: '#100c0a' });
  V.splats(f, hF([[0.0, 0.1]])[0], 14, 10, 3, '#1a1412'); // soot smears
  f.line(hF([[0.05, -0.04], [0.14, -0.02], [0.22, -0.05]]), 1, '#8a7a6a', { op: 0.6 }); // tear tracks in the soot
  // the rag: grey linen tied over nose and mouth, sooty at the breath, frozen at the edge
  const rag = hF([[0.36, 0.1], [0.37, 0.3], [0.3, 0.46], [0.12, 0.54], [-0.08, 0.48], [-0.2, 0.28], [-0.12, 0.12], [0.1, 0.12], [0.24, 0.08]]);
  V.iced(f, rag, { fill: '#5a544c', shadow: '#221e1a', tex: 'weave824', texOp: 0.6, shade: 0.4 }, { nFacets: 1 });
  f.flat(hF([[0.22, 0.2], [0.34, 0.22], [0.32, 0.34], [0.2, 0.32]]), '#1a1412', { op: 0.55 }); // soot at the breath
  fold(f, hF([[0.3, 0.2], [0.2, 0.3], [0.04, 0.36]]), 2, 0.5); fold(f, hF([[0.28, 0.38], [0.1, 0.44]]), 2, 0.5);
  V.icicles(f, hF([[0.3, 0.44], [0.12, 0.53]]), 2, 6, 12);
  // the hood, rimed, a burn hole through it on the fork side with a glowing, curling edge
  const hood = hF([[0.34, -0.44], [0.12, -0.62], [-0.22, -0.64], [-0.5, -0.46], [-0.62, -0.1], [-0.6, 0.32], [-0.48, 0.62], [-0.22, 0.74], [0.06, 0.7], [0.24, 0.62], [0.3, 0.54], [0.1, 0.52], [-0.06, 0.3], [-0.1, 0.0], [0.02, -0.28], [0.2, -0.38]]);
  V.iced(f, hood, V.rimed(LEAl, 0.36), { cracks: 3, nFacets: 3 });
  fold(f, hF([[-0.1, -0.56], [-0.3, -0.4], [-0.44, -0.1]]), 3, 0.45); fold(f, hF([[-0.3, 0.2], [-0.4, 0.5]]), 3, 0.45);
  f.part(K.chain(hF([[0.36, -0.42], [0.18, -0.36], [0.0, -0.24], [-0.09, 0.02], [-0.05, 0.3], [0.1, 0.5], [0.3, 0.56]]), [9, 10, 10, 10, 10, 10, 9]), V.rimed(LEAl, 0.4));
  const hole = hF([[-0.44, -0.3], [-0.36, -0.42], [-0.3, -0.36], [-0.2, -0.44], [-0.16, -0.36], [-0.22, -0.28], [-0.34, -0.22], [-0.42, -0.2]]);
  f.flat(hole, '#1a100c');
  f.flat(hF([[-0.36, -0.34], [-0.24, -0.38], [-0.26, -0.3], [-0.36, -0.27]]), '#3a2a24'); // the scalp showing through
  f.line(hole.concat([hole[0]]), 2.6, P.charS); V.embers(f, hF([[-0.3, -0.4]])[0], 8, 3, 3, 0.8); // the edge charred, a few embers caught in it
  f.line(hole.slice(4).concat([hole[0]]), 2, '#2a1c16');
  V.flakes(f, hF([[-0.3, -0.46]])[0], 10, 6, 3, 0.7);
  f.stitches(hF([[-0.2, -0.6], [-0.42, -0.44], [-0.54, -0.1]]), '#d8d4cc', 0.9);
  V.rimeCrust(f, hF([[-0.3, -0.64], [-0.52, -0.48], [-0.64, -0.1], [-0.62, 0.3]]), 7, [-1, -0.1], { gap: 6 });
  V.icicles(f, hF([[-0.5, 0.64], [-0.22, 0.76], [0.04, 0.72]]), 4, 8, 20);
  // shoulder cape of the hood over both shoulders (torso bone)
  f.bone('torso');
  const cape = [S.at(-0.86, 0.02), S.at(-0.3, -0.12), S.at(0.32, -0.06), S.at(0.6, 0.1), S.at(0.56, 0.22), S.at(0.24, 0.24), S.at(-0.2, 0.3), S.at(-0.66, 0.34), S.at(-0.9, 0.24)];
  V.zone(f, cape, V.rimed(LEAl, 0.6), V.charred(LEAl, 0.5), shoulderZone, { riftW: 2.4 });
  V.icicles(f, [S.at(0.56, 0.22), S.at(0.24, 0.25)], 3, 8, 18);
  f.line([S.at(-0.88, 0.25), S.at(-0.6, 0.33), S.at(-0.2, 0.3)], 1, '#d8d4cc', { op: 0.5, dash: '2 2' });

  // ---- the fork: a long iron shaft, the leather-bound grip in the fist, two tines through a bundle of birch faggots
  f.bone('fork');
  const fn = [-fd[1], fd[0]];
  f.part(limb(fButt, fNeck, 12, 11, { steps: 10 }), { fill: P.iron, shadow: '#0e0c0c', light: P.ironL, shade: 0.4, tex: 'mottle824', texOp: 0.6, inkW: 1.4 });
  f.line([lp(fButt, fNeck, 0.04, -3), lp(fButt, fNeck, 0.98, -3)], 1, P.greyL, { op: 0.6, straight: true });
  for (let i = 0; i < 6; i++) { const t = 0.4 + i * 0.024; f.line([lp(fButt, fNeck, t, -7), lp(fButt, fNeck, t + 0.012, 7)], 2.4, P.leathD, { straight: true }); } // grip wrap
  f.flat(ell(lp(fButt, fNeck, 0.2, 0), 6, 3, fA, 8), P.rust, { op: 0.6 }); f.flat(ell(lp(fButt, fNeck, 0.8, 1), 5, 2.4, fA, 8), P.rust, { op: 0.5 });
  // the crosspiece and the two tines
  const cr = fNeck;
  f.part([add(cr, mul(fn, -26)), add(add(cr, mul(fn, -24)), mul(fd, 10)), add(add(cr, mul(fn, 24)), mul(fd, 10)), add(cr, mul(fn, 26))], { fill: P.iron, shade: 0.4, inkW: 1.3, cast: false });
  const tine = s => { const a = add(cr, mul(fn, s * 20)), b = add(add(cr, mul(fn, s * 16)), mul(fd, 150)); f.part(limb(a, b, 9, 4, { steps: 6 }), { fill: mix(P.iron, P.char, 0.5), shadow: '#0e0c0c', shade: 0.4, inkW: 1.2, cast: false }); return b; };
  tine(-1);
  // the bundle: a sheaf of birch faggots bound with withies, charred black, ember-cored, shedding ash; no flame
  const bc = add(cr, mul(fd, 92)), BF = frame(bc, fA, 1), sticks = [];
  for (let i = 0; i < 15; i++) { const v = -32 + i * 4.6 + (f.r() - 0.5) * 3, l0 = -62 - f.r() * 22, l1 = 58 + f.r() * 16; sticks.push([v, l0, l1]); }
  const fan = v => v * 1.12; // (review) the sheaf barely spreads behind the binding: a bound bundle, not a broom
  const bOut = BF([[-80, -40], [-34, -38], [20, -36], [66, -30], [74, 0], [66, 32], [20, 36], [-34, 38], [-82, 42], [-90, 0]]);
  f.part(bOut, { fill: P.char, shadow: P.charS, light: P.charL, shade: 0.4, tex: 'craze824', texOp: 0.8, inkW: 1.6 });
  V.clipDraw(f, E.smooth(bOut), () => {
    for (const [v, l0, l1] of sticks) { f.line(BF([[l0, fan(v)], [-30, v * 1.05], [l1, v * 0.95]]), 4.4, '#0e0a08'); f.line(BF([[l0 + 6, fan(v) - 1], [-30, v * 1.05 - 1], [l1 - 6, v * 0.95 - 1]]), 1.2, f.r() > 0.5 ? '#6a5a4e' : '#a49a88', { op: 0.55 }); } // birch bark, charred to silver in strips
    for (let i = 0; i < 6; i++) V.seam(f, BF([[-40 + i * 18, -20 + (i % 3) * 16], [-32 + i * 18, -14 + (i % 3) * 16], [-22 + i * 18, -18 + (i % 3) * 16]]), 1.6);
    V.glow(f, BF([[50, 4]])[0], 50, 30, P.lamp, 0.55, false, fA);
  });
  for (const [v, l0] of sticks.filter((_, i) => i % 4 === 0)) f.line(BF([[l0, fan(v)], [l0 - 10 - f.r() * 8, fan(v) * 1.05]]), 2.6, '#1a1410'); // loose twigs past the outline
  // the front: end grain glowing at the cores
  for (const [v, , l1] of sticks) { const q = BF([[l1 - 2, v * 0.95]])[0]; f.flat(ell(q, 3.4, 2.6, fA, 6), '#1a0c06'); if (f.r() < 0.75) f.flat(ell(q, 2, 1.6, fA, 6), f.r() > 0.5 ? P.lamp : P.hot); }
  for (const u of [-30, 30]) { f.line(BF([[u, -38], [u + 4, 0], [u, 37]]), 5, INK); f.line(BF([[u, -38], [u + 4, 0], [u, 37]]), 3, '#5a4c3a'); } // withy bands
  tine(1); // the near tine passes in front of the bundle
  V.ash(f, BF([[30, -30]])[0], 22, 70, 200, 1.1);
  V.embers(f, BF([[40, 60]])[0], 40, 30, 8, 1.2); // embers falling off it
  V.puff(f, BF([[-10, -30]])[0], 110, 26, { sway: 10, phase: 1.3, op: 0.3, col: '#4a4440' }); // grey smoke

  // ---- near arm: the sleeve burnt away; the skin charred from the shoulder blade to the fingers, split in seams
  V.armRig(f, SN, EN, WN, [42, 36, 28], () => {
    V.burnt(f, K.chain([add(SN, [0, 14]), EN, lerp(EN, WN, 0.2)], [44, 32, 32], { bp: [[0, 0.45, 0.2, 0.18], [0, 0.15, 0.1, 0.1]], bq: [[0, 0.6, 0.16, 0.16]] }), SKC, { seams: 2, seamW: 1.8 });
    V.burnt(f, K.chain([lerp(EN, SN, 0.08), lerp(EN, WN, 0.45), WN], [34, 30, 22], { bp: [[0, 0.25, 0.22, 0.16]], bq: [[0, 0.35, 0.12, 0.2]] }), SKC, { seams: 2, seamW: 1.6 });
    f.stroke([lp(EN, WN, 0.1, 10), lp(EN, WN, 0.35, 14), lp(EN, WN, 0.6, 8)], 3, '#0a0606', { op: 0.5 }); // the forearm's muscle edge
    f.stroke([lp(SN, EN, 0.4, -14), lp(SN, EN, 0.65, -18), lp(SN, EN, 0.9, -12)], 3, '#0a0606', { op: 0.5 }); // the triceps
    V.seam(f, [lp(SN, EN, 0.3, 8), lp(SN, EN, 0.55, 2), lp(SN, EN, 0.8, 9)], 2);
    V.seam(f, [lp(EN, WN, 0.25, -6), lp(EN, WN, 0.5, -2), lp(EN, WN, 0.75, -6)], 1.6);
    V.flakes(f, lerp(SN, EN, 0.5), 16, 30, 5, 0.8); V.flakes(f, lerp(EN, WN, 0.4), 12, 22, 4, 0.7);
    f.part(ell(lerp(SN, EN, 0.1), 24, 8, V.ang(SN, EN) + Math.PI / 2, 12), V.charred(WOOLl, 0.7)); // the burnt sleeve's last rag
  }, '_n');
  f.bone('upperarm_n'); V.ash(f, lp(SN, EN, 0.4, 20), 8, 30, 90, 0.9);
  f.bone('hand_n');
  B.grip(f, WN, EN, fA, 24, '#46362e', { shadow: P.charS, tex: 'craze824', texOp: 0.6, name: 'fire-setter fork' });
  V.seam(f, [add(WN, [-10, -2]), add(WN, [0, 6]), add(WN, [10, 2])], 1.2);
  V.embers(f, WN, 12, 10, 3);

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [20, 40]), 46, 5, 0, 14), P.iceM, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ THE SKALD (cast, human 1.0)
// The jarl's skald, a thick-necked man in his fifties, upright with the chest out and the head thrown back mid-verse,
// weight back on his heels; the lyre stands against his far hip in the crook of the far arm, the near hand lifted off the
// strings. The finest cloak in the cast, pinned at the near shoulder with a big iron ring brooch, its hem scorched.
// Split: across the face at the mouth, ear to ear through the open mouth. Above the upper lip frozen white (frosted
// eyes, a frozen brow, hair frozen stiff); below it charred and split in glowing seams, the jaw, throat and chest, as
// if the words burn on the way out. Steam leaks between the lips. Below the head the line has nowhere to go but down:
// everything under the mouth is scorched, except the frost that has settled on the cloak's shoulders.
// Rig: standard humanoid + lyre (on hand_f) + cloak (torso) + skirt (pelvis) + horn (pelvis).
function skald() {
  const [CW, CH] = TIERS.human;
  const f = new Fig(V.base(825, CH)); V.texturesB(f);
  const gy = f.o.groundY, H = 96;
  const N = [298, 270], C = [280, 372], Pv = [306, 480];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.12, 0.12), EN = [318, 396], WN = [404, 330];
  const SF = S.at(0.5, 0.1), EF = [296, 420], WF = [375, 459];
  const HN = S.at(-0.2, 1.0), KN = [292, 632], AN = [276, 760];
  const HF = S.at(0.32, 0.98), KF = [352, 630], AF = [376, 760];
  const HC = [314, 212], hA = -0.5, hF = frame(HC, hA, H);
  const lyB = [352, 610], lyT = [444, 358], lyA = V.ang(lyB, lyT), lyD = E.norm(sub(lyT, lyB)), lyN = [-lyD[1], lyD[0]];
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.8), N: S.at(0.15, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('lyre', WF, 'hand_f').joint('cloak', S.at(-0.3, 0.05), 'torso').joint('skirt', S.at(0, 0.95), 'pelvis').joint('horn', S.at(-0.6, 0.9), 'pelvis');
  const WOOLl = V.WOOL(f, { fill: '#4e5258', maxShade: 40 }), CLOAK = V.WOOL(f, { fill: '#3e4a56', maxShade: 60 });
  const CHW = V.charred(WOOLl, 0.45), CHC = V.charred(CLOAK, 0.3), LEAl = V.LEA(f);
  const SKC = V.SKC(f, { fill: '#45362f', maxShade: 26 }), SKI = V.SKI(f, { fill: '#c4ccd0' });
  const border = (a, b, w, o = {}) => { // a tablet-woven band: dark ground, a running lozenge in grey and bone
    const d = E.norm(sub(b, a)), n = [-d[1], d[0]], L = E.len(sub(b, a));
    f.part([add(a, mul(n, w / 2)), add(b, mul(n, w / 2)), add(b, mul(n, -w / 2)), add(a, mul(n, -w / 2))].map(q => [...q, 1]), { fill: '#2a2a2e', shade: 0.3, inkW: 1, cast: false, tex: 'weave825', texOp: 0.5 });
    for (let t = 0; t < L; t += w * 0.9) { const q = add(a, mul(d, t)); f.line([add(q, mul(n, -w * 0.32)), add(add(q, mul(d, w * 0.45)), mul(n, w * 0.32)), add(q, mul(d, w * 0.9)).map((v, j) => v + mul(n, -w * 0.32)[j])], 1.3, o.col || P.greyL, { op: 0.85 }); }
  };

  // ---- the cloak behind him: heavy wool from the shoulders to the calves, frost on its shoulders, the hem scorched
  f.bone('cloak');
  const cl = [S.at(-0.4, -0.08), S.at(-0.9, 0.05), S.at(-1.1, 0.4), S.at(-1.2, 0.9), [176, 640], [168, 700], [196, 716], [230, 704], [262, 720], [292, 706], S.at(-0.3, 1.3), S.at(-0.1, 0.6), S.at(0.0, 0.0)];
  const clZ = V.jagLoop(f, [S.at(-1.6, -0.6), S.at(0.4, -0.6), S.at(0.3, 0.25), S.at(-0.5, 0.3), S.at(-1.0, 0.36), S.at(-1.6, 0.4)], 6, 12);
  // here the zone is the ICE (frost settled on the shoulders): draw it the other way round
  const clD = V.burnt(f, cl, CHC, { nEmbers: 6 });
  V.clipDraw(f, clZ, () => V.iced(f, cl, V.rimed(CLOAK, 0.5), { nFacets: 3 }));
  V.clipDraw(f, clD, () => V.ringRift(f, clZ.concat([clZ[0]]), S.at(-0.6, 1.0), 2.4, { faint: true }));
  for (let i = 0; i < 5; i++) fold(f, [S.at(-0.6 - i * 0.1, 0.35), [214 + i * 18, 560], [190 + i * 22, 690]], 5, 0.45);
  // scorched hem: charred and curled, a glowing edge in places, ash lifting
  const hem = [[168, 700], [196, 716], [230, 704], [262, 720], [292, 706]];
  f.line(hem, 7, P.charS); V.seam(f, hem.slice(1, 4), 1.6); V.flakes(f, [230, 700], 50, 12, 6, 0.8); V.ash(f, [230, 700], 8, 60, 70, 0.9);
  V.icicles(f, [S.at(-1.0, 0.3), S.at(-1.12, 0.6)], 3, 8, 18);

  // ---- far arm: wool sleeve, the forearm laid round the lyre, iron arm rings (the jarl's gifts)
  V.armRig(f, SF, EF, WF, [38, 34, 28], () => {
    V.burnt(f, K.chain([SF, EF, lerp(EF, WF, 0.3)], [40, 36, 32], { bp: [[0, 0.45, 0.12]] }), mix(CHW.fill, '#000', 0.1) && Object.assign({}, CHW, { fill: mix(CHW.fill, '#000', 0.15) }), { nEmbers: 3 });
    V.burnt(f, K.chain([lerp(EF, WF, 0.2), WF], [32, 28]), SKC, { nEmbers: 2 });
    for (const t of [0.4, 0.55]) f.part(K.chain([lp(EF, WF, t, 17), lp(EF, WF, t + 0.04, -17)], [6, 6]), { fill: P.ironL, shade: 0.35, inkW: 1, cast: false });
  }, '_f');

  // ---- legs: wool trousers, leg wraps, leather shoes with ankle thongs; scorched below the mouth's line like the rest
  const legSet = (Hp, Kn, A, sfx, tone) => {
    const LW = Object.assign({}, CHW, { fill: mix(CHW.fill, '#000', tone) });
    V.legRig(f, Hp, Kn, A, 46, () => {
      V.burnt(f, K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.15)], [60, 54, 46, 44], { bp: [[0, 0.5, 0.1]], bq: [[0, 0.5, 0.1]] }), LW, { nEmbers: 3 });
      V.burnt(f, K.chain([lerp(Kn, A, 0.1), lerp(Kn, A, 0.5), A], [44, 42, 30], { bp: [[0, 0.6, 0.2]] }), Object.assign({}, LW, { fill: mix('#5a5046', '#000', tone) }), { nEmbers: 2 });
      for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.12; f.line([lp(Kn, A, t, 21), lp(Kn, A, t + 0.06, -21)], 1.8, INK, { op: 0.55 }); }
    }, sfx);
    V.footRig(f, Kn, A, 46, () => {
      B.boot(f, A, 1, 46, mix(P.leath, P.char, 0.3), { shaft: 0.32, tex: 'craze825', texOp: 0.5 });
      const X = u => A[0] + u * 46;
      for (let i = 0; i < 3; i++) f.line([[X(-0.34), A[1] - 6 - i * 12], [X(0.32), A[1] + 8 - i * 12]], 2.2, P.leathD); // ankle thongs
      f.line([[X(0.3), A[1] + 8], [X(0.5), A[1] + 20], [X(0.42), A[1] + 30]], 1.6, P.leathD);
    }, sfx);
  };
  legSet(HF, KF, AF, '_f', 0.12);
  legSet(HN, KN, AN, '_n', 0);

  // ---- torso: tunic with a tablet-woven border at the neck; the chest charred, split in seams
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.42, 0.36], [0.1, 0.72, 0.62], [0.3, 0.74, 0.74], [0.55, 0.64, 0.66], [0.8, 0.66, 0.62], [1.0, 0.7, 0.58], [1.1, 0.62, 0.46]]);
  V.burnt(f, torso, CHW, { seams: 3, seamW: 2 });
  // the chest at the open neck: charred skin, seams glowing brightest at the throat
  const chest = [S.at(0.2, 0.0), S.at(0.52, 0.06), S.at(0.66, 0.24), S.at(0.5, 0.36), S.at(0.3, 0.3)];
  V.burnt(f, chest, SKC, { seams: 2, seamW: 2 });
  V.glow(f, S.at(0.4, 0.1), 30, 16, P.lamp, 0.4);
  border(S.at(0.66, 0.24), S.at(0.3, 0.32), 9); border(S.at(0.18, 0.0), S.at(0.3, 0.32), 9);
  for (const [u0, v0, u1, v1] of [[0.4, 0.5, 0.1, 0.62], [0.5, 0.7, 0.2, 0.78], [-0.4, 0.3, -0.5, 0.6]]) fold(f, [S.at(u0, v0), S.at((u0 + u1) / 2, (v0 + v1) / 2 + 0.03), S.at(u1, v1)], 4, 0.45, '#0a0808');
  // the horn's strap from the far shoulder to the near hip
  f.part(K.chain([S.at(0.52, 0.0), S.at(0.2, 0.4), S.at(-0.3, 0.8), S.at(-0.6, 0.94)], [10, 10, 10, 10]), Object.assign({}, LEAl, { shade: 0.3, cast: false }));
  f.stitches([S.at(0.5, 0.02), S.at(0.18, 0.42), S.at(-0.3, 0.8)], '#a89a86', 0.8);

  // ---- tunic skirt to the knee (pelvis): scorched lower border, belt with knife and pouch
  f.bone('skirt');
  const sk = [S.at(-0.68, 0.92), S.at(0.6, 0.9), [392, 560], [410, 610], [372, 622], [330, 614], [290, 626], [246, 612], [228, 600], [236, 540]];
  V.burnt(f, sk, CHW, { nEmbers: 5 });
  fold(f, [S.at(0.2, 1.0), [330, 560], [324, 612]], 4, 0.5, '#0a0808'); fold(f, [S.at(-0.3, 1.0), [268, 570], [262, 616]], 4, 0.5, '#0a0808');
  border([240, 600], [404, 600], 10);
  f.line([[228, 610], [262, 624], [300, 618], [340, 616], [380, 624], [410, 612]], 4, P.charS); V.seam(f, [[262, 622], [300, 617], [340, 616]], 1.2);
  f.bone('pelvis');
  f.part([S.at(-0.72, 0.88), S.at(0.62, 0.86), S.at(0.64, 0.96), S.at(-0.74, 0.98)], { fill: P.leathD, shade: 0.4, sharp: true, tex: 'craze825', texOp: 0.3 });
  f.part([S.at(0.02, 0.86), S.at(0.16, 0.86), S.at(0.16, 0.97), S.at(0.02, 0.97)], { fill: P.ironL, shade: 0.3, inkW: 1.1, sharp: true });
  f.part([S.at(0.3, 0.94), S.at(0.42, 0.95), S.at(0.4, 1.2), S.at(0.32, 1.21)], V.charred(LEAl, 0.3)); // pouch
  f.part([S.at(0.29, 0.93), S.at(0.43, 0.94), S.at(0.42, 1.0), S.at(0.3, 1.0)], LEAl);
  // belt knife in its sheath, slung flat along the belt
  const kn = [S.at(-0.2, 0.97), S.at(-0.56, 1.1)];
  f.part(limb(kn[0], kn[1], 12, 7, { steps: 6 }), { fill: P.leathD, shade: 0.4, inkW: 1.2, cast: false });
  f.part(limb(add(kn[0], [10, -4]), kn[0], 8, 9, { steps: 4 }), { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 1, cast: false });
  // the drinking horn on its strap, hanging behind the near hip, rim up
  f.bone('horn');
  const hb = S.at(-0.6, 0.98), hornC = V.spline([add(hb, [10, 0]), add(hb, [-18, 40]), add(hb, [-12, 90]), add(hb, [8, 116])], 4);
  f.part(K.chain(hornC.filter((_, i) => i % 3 === 0).concat([hornC[hornC.length - 1]]), hornC.filter((_, i) => i % 3 === 0).concat([0]).map((_, i, a) => 26 - i * 22 / a.length)), { fill: '#7a6e5a', shadow: '#2a221a', light: '#b8ac94', shade: 0.38, inkW: 1.3 });
  f.part(K.chain([add(hb, [-4, -6]), add(hb, [22, 4])], [12, 12]), { fill: P.ironL, shade: 0.35, inkW: 1.1, cast: false });
  for (let i = 1; i < 5; i++) f.line([add(hornC[i * 3], [-10, 0]), add(hornC[i * 3], [10, -3])], 0.9, INK, { op: 0.5 });
  f.part(ell(add(hb, [8, 118]), 5, 6, 0, 8), { fill: P.ironL, shade: 0.35, inkW: 1, cast: false });

  // ---- head: thrown back, mouth wide on the verse; frozen above the lip, burnt below; the crack ear to ear
  f.bone('head');
  f.part(limb(S.at(0.18, -0.02), hF([[-0.02, 0.38]])[0], 64, 58, { p: [[0.5, 0.08, 0.2]] }), SKC); // the thick neck
  V.burnt(f, limb(S.at(0.3, 0.0), hF([[0.1, 0.42]])[0], 30, 26), SKC, { seams: 1, seamW: 1.6 }); // the throat, glowing
  V.glow(f, hF([[0.12, 0.62]])[0], 22, 30, P.lamp, 0.45, false, hA);
  const Sp = V.splitLine(f, hF([[-0.7, -0.06], [-0.35, 0.04], [-0.16, 0.13], [0.06, 0.2], [0.18, 0.25], [0.3, 0.28], [0.42, 0.29], [0.6, 0.3]]), rot([0, -1], hA), 2.5, 7);
  const hp = { jaw: 1.18, chin: 0.02, nose: 1.1, hook: 0.1, mouth: 'set', squint: 0.6, browDown: 0.02, age: true, faceShade: 0.8, noEar: false, beard: 'stubble' };
  const faceOut = E.smooth(hF([[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.33, 0.37], [0.31, 0.47], [0.14, 0.54], [-0.07, 0.48], [-0.23, 0.27], [-0.30, 0.08], [-0.37, -0.13]]));
  // the hair, frozen stiff and swept back off the thrown-back head, falls from the back of the skull in hanks
  V.hanks(f, hF([[-0.2, -0.54], [-0.4, -0.4], [-0.5, -0.16], [-0.46, 0.06]]), 7, 34, 64, 14, { state: 'ice', dir: [-0.3, 1], strands: 3, sway: 0.3, pal: ['#aeb8be', '#c8d0d4', '#8a96a0', '#dde4e6'] });
  V.sides(f, Sp, () => B.head(f, HC, H, hA, Object.assign({}, hp, { skin: '#c4ccd2', eyeWhite: '#a8b4bc', iris: '#6a7a86', browCol: '#e6ecee', hairCol: '#c8d0d4', beardCol: '#dde4e6', hair: [[0.06, -0.5], [-0.06, -0.58], [-0.24, -0.6], [-0.42, -0.5], [-0.52, -0.26], [-0.46, -0.04], [-0.36, -0.2], [-0.22, -0.4], [-0.06, -0.48]], hairLines: [[[0.0, -0.54], [-0.2, -0.56], [-0.42, -0.42]], [[-0.08, -0.5], [-0.26, -0.48], [-0.46, -0.22]]] })),
    () => B.head(f, HC, H, hA, Object.assign({}, hp, { skin: '#7a5c4a', eyeWhite: '#5a4036', iris: P.lamp, browCol: '#140e0c', hairCol: '#140e0c', beard: null, faceShade: 0.7 })));
  V.clipDraw(f, faceOut, () => V.clipDraw(f, V.halfRegion(Sp.line, Sp.ice), () => { f.raw(`<rect x="${HC[0] - 70}" y="${HC[1] - 70}" width="140" height="140" fill="url(#rime825)" opacity="0.5"/>`); V.facets(f, hF([[0.1, -0.15]])[0], 26, 20, 4, { op: 0.3 }); }));
  V.clipDraw(f, faceOut, () => V.clipDraw(f, V.halfRegion(Sp.line, -Sp.ice), () => { f.raw(`<rect x="${HC[0] - 70}" y="${HC[1] - 70}" width="140" height="140" fill="url(#craze825)" opacity="0.3"/>`); V.seam(f, hF([[0.0, 0.32], [0.06, 0.38], [0.03, 0.45]]), 1.2); }));
  // the eyes frosted over: a film of rime over half-shut lids, the lashes iced (no staring discs)
  f.flat(hF([[0.06, -0.06], [0.11, -0.075], [0.17, -0.066], [0.12, -0.045]]), '#9aa6ae', { op: 0.85 });
  f.line(hF([[0.05, -0.07], [0.11, -0.085], [0.18, -0.072]]), 2, P.rime, { op: 0.9 });
  // the open mouth, wide on the verse: the crack runs through it, the throat glows inside, steam leaks out
  const mouth = hF([[0.17, 0.25], [0.26, 0.232], [0.345, 0.255], [0.355, 0.33], [0.3, 0.4], [0.21, 0.385], [0.17, 0.32]]); // (review) opened wider on the verse
  f.flat(mouth, '#2a0a06');
  f.flat(hF([[0.2, 0.3], [0.25, 0.29], [0.27, 0.33], [0.22, 0.345]]), P.ember); f.flat(hF([[0.21, 0.31], [0.245, 0.305], [0.25, 0.33], [0.22, 0.335]]), P.lamp); // the glow deep in the throat
  f.flat(hF([[0.22, 0.255], [0.32, 0.252], [0.32, 0.272], [0.22, 0.275]]), '#b8bcc0'); // upper teeth, rimed
  f.stroke(hF([[0.17, 0.25], [0.26, 0.228], [0.35, 0.255]]), 3.2, '#6a7480'); // upper lip, frozen
  f.stroke(hF([[0.18, 0.345], [0.26, 0.39], [0.34, 0.335]]), 3.2, '#2a1a14'); // lower lip, burnt and split
  V.clipDraw(f, faceOut, () => V.rift(f, Sp, 1.6, true));
  // (review) the burnt lower face modelled, so it no longer reads as a dark mass: warm planes on the jaw and chin lit by
  // the glow in the mouth, a dark plane under the jaw that parts it from the throat, the jaw's edge lit by the heat
  f.flat(hF([[-0.22, 0.32], [-0.02, 0.5], [0.14, 0.56], [0.1, 0.7], [-0.12, 0.66], [-0.26, 0.46]]), '#0a0605', { op: 0.65 }); // under the jaw
  V.mass(f, hF([[-0.22, 0.24], [0.04, 0.3], [0.18, 0.36], [0.16, 0.5], [-0.02, 0.48], [-0.18, 0.36]]), { s: 10, op: 0.35, hiOp: 0.55, light: '#b07a56', shadow: '#0a0605', sharp: true }); // the cheek and jaw plane
  V.mass(f, hF([[0.16, 0.38], [0.33, 0.37], [0.31, 0.5], [0.15, 0.54]]), { s: 8, op: 0.3, hiOp: 0.6, light: '#d08a50', shadow: '#0a0605', sharp: true }); // the chin, lit from the mouth
  V.glow(f, hF([[0.27, 0.42]])[0], 14, 10, P.lampL, 0.45, false, hA);
  f.stroke(hF([[-0.22, 0.29], [-0.04, 0.47], [0.14, 0.535], [0.3, 0.48]]), 3.4, P.lampL, { op: 0.75 }); // the jaw's edge lit by the heat under it
  f.line(hF([[-0.1, 0.32], [0.0, 0.4], [-0.02, 0.46]]), 1.4, '#0a0605', { op: 0.7 }); // the cheek's fold
  V.seam(f, [hF([[0.06, 0.6]])[0], S.at(0.42, -0.02), S.at(0.38, 0.1)], 1.8); V.seam(f, [hF([[-0.06, 0.62]])[0], S.at(0.3, 0.0)], 1.4); // the throat splitting as the words burn out
  // the braided beard burned to stubs along the jaw: short charred tufts, embers caught in their ends
  for (const [u, v] of [[0.02, 0.44], [0.1, 0.5], [0.2, 0.52], [-0.08, 0.36]]) { const a = hF([[u, v]])[0], b = hF([[u + 0.015, v + 0.07]])[0]; for (let k = -1; k <= 1; k++) f.line([add(a, [k * 2, 0]), add(b, [k * 2.5, 0])], 1.6, '#100a08'); f.flat(ell(b, 1.8, 1.4, 0, 6), P.lamp); }
  V.puff(f, hF([[0.36, 0.3]])[0], 90, 18, { drift: 16, op: 0.4 });

  // ---- the lyre against his far hip: a six-string round lyre, frosted at its top, charred at its base, one string
  // snapped and curled; the far hand round its arm
  f.bone('lyre');
  const L2 = (u, v) => add(add(lyB, mul(lyD, u)), mul(lyN, v)), len = E.len(sub(lyT, lyB));
  const body = [L2(0, -30), L2(len * 0.62, -31), L2(len * 0.9, -31), L2(len, -23), L2(len * 1.02, 0), L2(len, 23), L2(len * 0.9, 31), L2(len * 0.62, 31), L2(0, 29), L2(-8, 0)];
  f.part([L2(-4, -26), L2(len * 0.98, -22), L2(len * 0.98, -34), L2(-2, -38)], { fill: '#3a2e22', shade: 0.35, inkW: 1.2, tex: 'grain825', texOp: 0.6 }); // its side, the thickness of the sound box
  const lyLook = { fill: '#6a5a46', shadow: '#2a2018', light: '#9a8a70', shade: 0.38, tex: 'grain825', texOp: 0.6, maxShade: 26 };
  const lySp = V.splitLine(f, [L2(len * 0.55, -80), L2(len * 0.5, -20), L2(len * 0.56, 20), L2(len * 0.5, 80)], lyD, 5, 10);
  V.thermal(f, body, lySp, V.rimed(lyLook, 0.4), V.charred(lyLook, 0.5), { riftW: 1.8, faint: true, nFacets: 2 });
  const hole = [L2(len * 0.68, -19), L2(len * 0.9, -20), L2(len * 0.91, 19), L2(len * 0.68, 19)];
  f.flat(hole, '#120e0c'); // the open frame at the top, through which the strings run to the pegs
  f.part(K.chain([L2(len * 0.95, -25), L2(len * 0.95, 25)], [10, 10]), V.rimed(lyLook, 0.5)); // yoke
  for (let i = 0; i < 6; i++) f.part(ell(L2(len * 0.95, -20 + i * 8), 3, 3.4, lyA, 6), { fill: P.boneD, shade: 0.3, inkW: 0.8, cast: false }); // pegs
  f.part([L2(len * 0.2, -16), L2(len * 0.2, 16), L2(len * 0.24, 16), L2(len * 0.24, -16)], { fill: P.bone, shade: 0.3, inkW: 1, cast: false, sharp: true }); // bridge
  f.part([L2(10, -18), L2(10, 18), L2(20, 18), L2(20, -18)], { fill: P.iron, shade: 0.3, inkW: 1, cast: false, sharp: true }); // tailpiece
  for (let i = 0; i < 6; i++) { const v = -14 + i * 5.6; if (i === 4) { f.line([L2(16, v), L2(len * 0.4, v + 1), L2(len * 0.46, v + 8), L2(len * 0.42, v + 14)], 1, '#c8c4b8', { op: 0.9 }); f.line([L2(len * 0.95, -20 + i * 8), L2(len * 0.8, v + 2), L2(len * 0.76, v - 6)], 1, '#c8c4b8', { op: 0.9 }); continue; } f.line([L2(16, v), L2(len * 0.95, -20 + i * 8)], 1, '#c8c4b8', { op: 0.85, straight: true }); }
  V.icicles(f, [L2(len * 0.62, -33), L2(len * 0.9, -33)], 3, 6, 14);
  V.embers(f, L2(len * 0.2, 0), 30, 30, 5);
  f.bone('hand_f');
  B.grip(f, WF, EF, V.ang(lyB, lyT), 24, '#45362f', { shadow: P.charS, tex: 'craze825', texOp: 0.5, name: 'skald lyre' });

  // ---- near arm: wool sleeve to the elbow with a woven cuff, the forearm and hand lifted off the strings, open
  V.armRig(f, SN, EN, WN, [42, 36, 28], () => {
    V.burnt(f, K.chain([SN, EN, lerp(EN, WN, 0.35)], [44, 40, 36], { bp: [[0, 0.45, 0.12]] }), CHW, { nEmbers: 3 });
    border(lerp(EN, WN, 0.32), lerp(EN, WN, 0.4), 40);
    V.burnt(f, K.chain([lerp(EN, WN, 0.36), lerp(EN, WN, 0.7), WN], [32, 30, 26], { bp: [[0, 0.3, 0.12]] }), SKC, { seams: 1, seamW: 1.4 });
    for (const t of [0.6, 0.7]) f.part(K.chain([lp(EN, WN, t, 16), lp(EN, WN, t + 0.04, -16)], [6, 6]), { fill: P.ironL, shade: 0.35, inkW: 1, cast: false }); // arm rings
  }, '_n');
  f.bone('hand_n');
  B.hand(f, add(WN, [4, -6]), -1.1, 22, '#4a3a32', { spread: 0.5, curl: 0.25, shadow: P.charS });
  // the cloak's front fall from the brooch at the near shoulder (torso), and the ring brooch
  f.bone('torso');
  const br = S.at(-0.36, 0.24);
  const fall = [add(br, [-16, -10]), add(br, [14, -6]), add(br, [6, 60]), add(br, [-8, 120]), add(br, [-30, 160]), add(br, [-44, 110]), add(br, [-30, 30])];
  V.burnt(f, fall, CHC, { nEmbers: 2 });
  V.clipDraw(f, E.smooth(fall), () => V.iced(f, [add(br, [-60, -40]), add(br, [40, -40]), add(br, [30, 30]), add(br, [-60, 50])], V.rimed(CLOAK, 0.5), { nFacets: 1 }));
  fold(f, [add(br, [0, 10]), add(br, [-10, 80]), add(br, [-28, 140])], 4, 0.5);
  const ring = ell(br, 16, 13, -0.2, 18);
  f.line(ring.concat([ring[0]]), 7, INK); f.line(ring.concat([ring[0]]), 4.4, P.ironL); f.line(ring.slice(10, 16), 1.4, P.greyL, { op: 0.8 });
  f.part(limb(add(br, [-24, 14]), add(br, [28, -16]), 6, 4, { steps: 4 }), { fill: P.iron, shade: 0.35, inkW: 1, cast: false }); // the pin
  V.rimeCrust(f, [S.at(-0.6, -0.08), S.at(-0.2, -0.14), S.at(0.3, -0.08)], 6, [-1, -0.3], { gap: 6 });

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [20, 30]), 44, 5, 0, 14), P.charS, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ MEAD-BEARER (cast, human 0.95)
// A serving woman of the jarl's hall, sturdy, in her thirties, stepping forward with the long drinking horn held out
// level in both hands, offering it; the weight on the front foot, the back heel raised. Both hands cup the horn from
// below (an offering hold, not a fist grip): the near hand under its tip end, the far hand under its middle.
// Split: at the knees. She stood in the hall when the floor cracked open and her feet and shins went into the crack:
// from the knees down charred black with molten seams; from the knees up frozen, rime over the dress, icicles at the
// elbows and hem. The crack rings both knees, glowing; the dress hem is burnt to a ragged edge there.
// Rig: standard humanoid + horn (on hand_n; the far hand needs IK onto it) + skirt + pitcher.
function meadBearer() {
  const CW = 680, CH = TIERS.human[1];
  const f = new Fig(V.base(826, CH)); V.texturesB(f);
  const gy = f.o.groundY, H = 92;
  const N = [314, 292], C = [298, 392], Pv = [292, 494];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.12, 0.13), EN = [308, 420], WN = [394, 452];
  const SF = S.at(0.48, 0.1), EF = [384, 418], WF = [466, 444];
  const HN = S.at(-0.24, 1.0), KN = [256, 622], AN = [212, 738];
  const HF = S.at(0.3, 0.98), KF = [372, 614], AF = [398, 756];
  const HC = [342, 238], hA = 0.12, hF = frame(HC, hA, H);
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.8), N: S.at(0.1, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('horn', WN, 'hand_n').joint('skirt', S.at(0, 0.95), 'pelvis').joint('pitcher', S.at(-0.5, 0.9), 'pelvis');
  const LIN = { fill: '#76767a', shadow: '#2e3038', shade: 0.4, tex: 'weave826', texOp: 0.5, maxShade: 40 };
  const APR = V.WOOL(f, { fill: '#4a5058', maxShade: 50 });
  const ICEN = V.rimed(LIN, 0.3), ICEA = V.rimed(APR, 0.22);
  const SKI = V.SKI(f, { fill: '#c4c8ca' }), SKC = V.SKC(f, { fill: '#3e302a', maxShade: 24 });
  const crease = (pts, w = 2.4) => { f.stroke(pts, w, '#1a2232', { op: 0.5 }); f.line(pts.map(q => add(q, [1.5, -1.5])), 1, P.iceL, { op: 0.55 }); };

  // ---- far arm (behind): linen sleeve frozen stiff, icicles at the elbow
  V.armRig(f, SF, EF, WF, [36, 32, 26], () => {
    V.iced(f, K.chain([SF, EF, lerp(EF, WF, 0.55)], [38, 34, 30], { bp: [[0, 0.5, 0.12]] }), Object.assign({}, ICEN, { fill: mix(ICEN.fill, '#000', 0.15) }), { nFacets: 2 });
    V.iced(f, K.chain([lerp(EF, WF, 0.5), WF], [28, 24]), SKI, { nFacets: 1 });
    V.icicles(f, [lp(SF, EF, 0.85, 16), lp(EF, WF, 0.15, 16)], 3, 10, 22);
  }, '_f');

  // ---- legs: frozen linen to the knee, the ragged burnt hem, then the burnt bare shins and feet; the crack rings each
  // knee. The back leg goes up on its toes.
  const leg = (Hp, Kn, A, sfx, tone, tiptoe) => {
    const Lk = Object.assign({}, ICEN, { fill: mix(ICEN.fill, '#000', tone) });
    const kd = E.norm(sub(A, Kn));
    // (review) the foot is drawn first, under the shin, so the shin's end covers its top: no gap, no boot-top edge
    f.bone('foot' + sfx);
    if (tiptoe) {
      // up on the toes: the heel lifted, the ball and toes flat on the ground
      const ball = [A[0] + 34, gy - 6], toe = [A[0] + 62, gy - 4];
      const ft = [add(A, [-16, -26]), add(A, [15, -24]), [ball[0] - 2, ball[1] - 14], [toe[0], toe[1] - 8], [toe[0] + 4, gy, 1], [ball[0] - 8, gy, 1], add(A, [-6, 20]), add(A, [-16, 8])];
      V.burnt(f, ft, SKC, { seams: 1, seamW: 1.2 });
      f.flat(ell(add(A, [-2, -6]), 9, 7, 0, 8), '#120c0a', { op: 0.4 }); // the ankle bone's shadow
      f.line([[ball[0] - 4, gy - 10], [toe[0] - 2, gy - 8]], 1, INK, { op: 0.6 });
      for (let i = 0; i < 3; i++) f.line([[toe[0] - 6 - i * 7, gy - 1], [toe[0] - 10 - i * 7, gy - 9]], 1, INK, { op: 0.6 }); f.flat(ell([toe[0] - 2, gy - 6], 3, 2, 0, 6), P.lamp, { op: 0.8 });
    } else {
      const fl = K.bareLeg(f, lerp(Kn, A, 0.6), A, 1, 48, 30, Object.assign({}, SKC, { fill: mix(SKC.fill, '#000', tone) }));
      V.clipDraw(f, E.smooth(fl), () => { f.raw(`<rect x="${A[0] - 40}" y="${A[1] - 50}" width="110" height="90" fill="url(#craze826)" opacity="0.8"/>`); V.seam(f, [add(A, [8, 18]), add(A, [26, 30]), add(A, [46, 40])], 1.4); V.embers(f, add(A, [20, 30]), 20, 10, 4); });
    }
    f.bone('shin' + sfx);
    V.legRig(f, Hp, Kn, A, 44, () => {
      V.iced(f, K.chain([Hp, lerp(Hp, Kn, 0.5), add(Kn, mul(kd, -6))], [58, 52, 44], { bp: [[0, 0.5, 0.1]], bq: [[0, 0.5, 0.1]] }), Lk, { nFacets: 2 });
      // the burnt shin: charred skin, molten seams, the calf
      V.burnt(f, K.chain([add(Kn, mul(kd, -10)), lerp(Kn, A, 0.35), lerp(Kn, A, 0.94)], [44, 40, 26], { bp: [[0, 0.5, 0.3, 0.22]], bq: [[0, 0.3, 0.08, 0.2], [1, 0.6, -0.12, 0.2]] }), Object.assign({}, SKC, { fill: mix(SKC.fill, '#000', tone) }), { seams: 2, seamW: 1.6 });
      V.seam(f, [lp(Kn, A, 0.3, 6), lp(Kn, A, 0.55, -2), lp(Kn, A, 0.8, 4)], 1.8);
      // the crack ringing the knee, glowing
      const kr = [lp(Kn, A, -0.02, -26), lp(Kn, A, 0.03, -12), lp(Kn, A, -0.04, 0), lp(Kn, A, 0.04, 12), lp(Kn, A, 0.0, 26)];
      V.glowLine(f, kr, 14, P.lamp, 0.35); V.seam(f, kr, 2.6, { glow: false });
      V.icicles(f, [lp(Kn, A, -0.1, -22), lp(Kn, A, -0.08, 22)], 3, 8, 16);
    }, sfx);
    V.glow(f, [A[0] + 20, gy], 40, 6, P.lamp, 0.35);
  };
  leg(HF, KF, AF, '_f', 0.1, false);
  leg(HN, KN, AN, '_n', 0, true);

  // ---- torso: linen underdress, the apron dress over it held by two oval brooches; frozen, rime over all
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.36, 0.32], [0.1, 0.62, 0.6], [0.3, 0.64, 0.8], [0.48, 0.58, 0.7], [0.7, 0.62, 0.58], [0.9, 0.72, 0.62], [1.06, 0.7, 0.56]]);
  V.iced(f, torso, ICEN, { nFacets: 3 });
  const apr = S.shape([[0.12, 0.5, 0.5], [0.3, 0.56, 0.74], [0.5, 0.54, 0.66], [0.7, 0.6, 0.6], [0.92, 0.7, 0.64], [1.06, 0.7, 0.58]]);
  V.iced(f, apr, ICEA, { nFacets: 3, cracks: 2 });
  for (const [u0, v0, u1, v1] of [[0.5, 0.35, 0.2, 0.55], [0.4, 0.6, 0.1, 0.8], [-0.3, 0.4, -0.4, 0.8]]) crease([S.at(u0, v0), S.at((u0 + u1) / 2, (v0 + v1) / 2 + 0.03), S.at(u1, v1)]);
  // apron straps and the two oval brooches, the bead swag between them
  const b1 = S.at(-0.06, 0.16), b2 = S.at(0.5, 0.16);
  for (const b of [b1, b2]) f.part(K.chain([add(b, [0, -26]), b], [10, 10]), V.rimed(APR, 0.3));
  const bead = (q, i) => { const c = i % 3 === 1 ? '#e8e8e0' : '#121014'; f.part(ell(q, 4, 3.6, 0, 8), { fill: c, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false, light: c === '#121014' ? '#6a6a80' : '#ffffff' }); };
  const sw = V.spline([b1, lerp(lerp(b1, b2, 0.5), S.at(0.24, 0.42), 0.9), b2], 9);
  sw.forEach(bead); const sw2 = V.spline([b1, lerp(lerp(b1, b2, 0.5), S.at(0.24, 0.32), 0.9), b2], 10); sw2.forEach((q, i) => bead(q, i + 1));
  for (const b of [b1, b2]) { const o = ell(b, 16, 11, -0.3, 16); f.part(o, { fill: P.ironL, shadow: '#141418', shade: 0.4, inkW: 1.4 }); f.line(ell(b, 10, 6, -0.3, 12).concat([ell(b, 10, 6, -0.3, 12)[0]]), 1, INK, { op: 0.6 }); for (let i = 0; i < 4; i++) f.rivet(add(b, rot([9, 0], i * 1.57 - 0.3)), 1.6); f.flat(ell(add(b, [-4, -4]), 4, 2, -0.3, 6), P.rime, { op: 0.6 }); }
  // knife and needle case hanging from the far brooch on cords
  const kc = add(b2, [6, 70]), nc = add(b2, [20, 52]);
  f.line([b2, kc], 1.4, P.leathD); f.line([b2, nc], 1.4, P.leathD);
  f.part(limb(kc, add(kc, [4, 46]), 10, 6, { steps: 5 }), { fill: P.leathD, shade: 0.4, inkW: 1.1, cast: false });
  f.part(limb(nc, add(nc, [2, 26]), 7, 6, { steps: 4 }), { fill: P.boneD, shadow: '#3a3428', shade: 0.4, inkW: 1, cast: false });
  V.icicles(f, [add(kc, [0, 46]), add(nc, [2, 26])], 2, 5, 10);
  // belt with the ring of storeroom keys
  f.bone('pelvis');
  f.part([S.at(-0.62, 0.86), S.at(0.6, 0.84), S.at(0.62, 0.92), S.at(-0.64, 0.94)], { fill: P.leathD, shade: 0.4, sharp: true, tex: 'rime826', texOp: 0.4 });
  const kr = S.at(0.28, 1.02);
  f.line(ell(kr, 13, 13, 0, 14).concat([ell(kr, 13, 13, 0, 14)[0]]), 4, INK); f.line(ell(kr, 13, 13, 0, 14).concat([ell(kr, 13, 13, 0, 14)[0]]), 2.4, P.ironL);
  for (let i = 0; i < 4; i++) { const a = 0.9 + i * 0.35, q = add(kr, rot([13, 0], a)), e = add(q, rot([34, 0], a + 0.3 - i * 0.12)); f.part(limb(q, e, 5, 3, { steps: 4 }), { fill: P.iron, shade: 0.35, inkW: 1, cast: false }); f.part([add(e, [-4, 0]), add(e, [4, 0]), add(e, [4, 8]), add(e, [-4, 8])], { fill: P.iron, shade: 0.35, inkW: 0.9, cast: false, sharp: true }); }
  // ---- the skirt to the knee: frozen, the hem burnt off ragged where the floor opened under her
  f.bone('skirt');
  const hemPts = [[402, 580], [382, 594], [358, 576], [334, 600], [312, 582], [288, 604], [262, 584], [238, 598], [216, 578]];
  const sk = [S.at(-0.66, 0.9), S.at(0.62, 0.88), [398, 540], ...hemPts.map(q => [...q, 1]), [212, 540]];
  V.iced(f, sk, ICEA, { nFacets: 3, cracks: 2 });
  for (const x of [250, 300, 350]) crease([[x + 4, 512], [x, 556], [x - 2, 588]], 3);
  f.line(hemPts, 6, P.charS); V.seam(f, hemPts.slice(2, 6), 1.4); V.flakes(f, [310, 592], 80, 10, 6, 0.8); V.ash(f, [300, 590], 6, 120, 40, 0.8);
  V.icicles(f, hemPts.filter((_, i) => i % 2 === 0).map(q => add(q, [0, -14])), 4, 8, 20);
  // the clay pitcher on a cord at the near hip
  f.bone('pitcher');
  const pc = S.at(-0.66, 1.3);
  f.line([S.at(-0.5, 0.92), add(pc, [-6, -40])], 1.8, P.leathD);
  const jug = [add(pc, [-12, -40]), add(pc, [10, -40]), add(pc, [14, -28]), add(pc, [26, -6]), add(pc, [24, 22]), add(pc, [10, 36]), add(pc, [-14, 36]), add(pc, [-26, 20]), add(pc, [-24, -8]), add(pc, [-14, -28])];
  V.iced(f, jug, V.rimed({ fill: '#6a5a4a', shadow: '#2a201a', shade: 0.4, tex: 'mottle826', texOp: 0.6 }, 0.25), { nFacets: 1 });
  f.line([add(pc, [24, -16]), add(pc, [38, -6]), add(pc, [36, 14]), add(pc, [22, 16])], 4, INK); f.line([add(pc, [24, -16]), add(pc, [38, -6]), add(pc, [36, 14]), add(pc, [22, 16])], 2.4, '#5a4a3c');
  f.part(ell(add(pc, [0, -40]), 12, 4, 0, 10), { fill: '#2a201a', shade: 0.3, inkW: 1, cast: false });
  f.line([add(pc, [-10, 0]), add(pc, [-2, 14]), add(pc, [-12, 26])], 1, INK, { op: 0.6 }); // a crack in the glaze

  // ---- head: broad, tired face, frost on the lashes, cracked lips, headscarf knotted at the nape
  f.bone('head');
  f.part(limb(S.at(0.12, -0.05), add(HC, [-8, 30]), 32, 28), SKI);
  B.head(f, HC, H, hA, { skin: '#c4c8ca', jaw: 1.08, chin: 0.0, nose: 0.95, mouth: 'set', squint: 0.45, browDown: 0.05, lips: true, lashes: true, age: true, faceShade: 0.8, noEar: true, browCol: '#8a8e94', hairCol: '#8a8e94', eyeWhite: '#b0b8bc' });
  V.clipDraw(f, E.smooth(hF([[-0.3, -0.4], [0.18, -0.47], [0.35, -0.13], [0.33, 0.21], [0.29, 0.47], [0.13, 0.535], [-0.21, 0.27]])), () => f.raw(`<rect x="${HC[0] - 60}" y="${HC[1] - 60}" width="120" height="120" fill="url(#rime826)" opacity="0.4"/>`));
  f.line(hF([[0.06, -0.07], [0.11, -0.085], [0.18, -0.075]]), 1.6, P.rime, { op: 0.95 }); // frost on the lashes
  for (const [a, b] of [[[0.22, 0.29], [0.23, 0.31]], [[0.27, 0.29], [0.26, 0.315]]]) f.line(hF([a, b]), 1, '#5a2a24', { op: 0.8 }); // cracked lips
  const scarf = hF([[0.3, -0.38], [0.1, -0.58], [-0.24, -0.6], [-0.5, -0.42], [-0.6, -0.1], [-0.56, 0.24], [-0.4, 0.42], [-0.2, 0.4], [-0.14, 0.12], [-0.1, -0.1], [0.06, -0.3], [0.2, -0.36]]);
  V.iced(f, scarf, V.rimed({ fill: '#6a6a66', shadow: '#26282e', shade: 0.42, tex: 'weave826', texOp: 0.6 }, 0.35), { nFacets: 2 });
  f.line(hF([[0.3, -0.38], [0.12, -0.44], [-0.04, -0.34], [-0.12, -0.1], [-0.12, 0.1]]), 2.2, '#2a2c30', { op: 0.7 }); // the scarf's folded front edge
  // the knot at the nape and its two tails, frozen stiff
  const kn = hF([[-0.56, 0.22]])[0];
  f.part(ell(kn, 11, 9, 0.4, 10), V.rimed({ fill: '#6e6e6a', shadow: '#3a3c42', shade: 0.36 }, 0.4));
  for (const [dx, l] of [[-6, 56], [6, 46]]) f.part(limb(add(kn, [dx * 0.4, 6]), add(kn, [dx, l]), 13, 8, { steps: 5 }), V.rimed({ fill: '#7a7a76', shadow: '#3a3c42', shade: 0.36, tex: 'weave826', texOp: 0.5 }, 0.4));
  V.icicles(f, [add(kn, [-6, 56]), add(kn, [6, 46])], 2, 6, 12);
  fold(f, hF([[-0.1, -0.5], [-0.32, -0.36], [-0.46, -0.06]]), 3, 0.4); fold(f, hF([[-0.3, -0.2], [-0.42, 0.14]]), 2.6, 0.4);
  V.rimeCrust(f, hF([[0.2, -0.46], [-0.1, -0.6], [-0.42, -0.5], [-0.58, -0.14]]), 6, [-1, -0.3], { gap: 6 });

  // ---- the hands cup the horn from below: the palm and the heel of each hand under it, the fingers wrapping up the far
  // side (their tips just showing over the top edge), the thumb laid over the near side
  const hc = V.spline([[350, 452], [404, 466], [472, 460], [542, 436], [600, 398]], 4), hw = t => 9 + t * 46;
  const hornTop = x => { let best = hc[0]; for (const q of hc) if (Math.abs(q[0] - x) < Math.abs(best[0] - x)) best = q; return best; };
  const cup = (W, look, sfx) => {
    const q = hornTop(W[0]), w = hw((hc.indexOf(q)) / (hc.length - 1));
    f.bone('hand' + sfx);
    const palm = [add(q, [-22, w * 0.3]), add(q, [-6, w * 0.45 + 2]), add(q, [16, w * 0.42 + 4]), add(q, [24, w * 0.3 + 12]), add(q, [8, w * 0.5 + 16]), add(q, [-18, w * 0.5 + 14]), add(W, [-16, 10])];
    f.part(palm, look);
    f.line([add(q, [-10, w * 0.5 + 8]), add(q, [10, w * 0.5 + 10])], 1, INK, { op: 0.5 });
    for (let i = 0; i < 3; i++) f.part(ell(add(q, [-8 + i * 11, -w * 0.5 - 2]), 5.5, 4.4, 0.2, 8), Object.assign({}, look, { cast: false, inkW: 1, inkHeavy: 1.4 })); // fingertips over the far side
    return { q, w };
  };
  const ha = cup(WF, { fill: '#b8bec2', shadow: P.skinIS, shade: 0.4, tex: 'mottle826', texOp: 0.4 }, '_f');
  V.armRig(f, SN, EN, WN, [40, 34, 28], () => {
    V.iced(f, K.chain([SN, EN, lerp(EN, WN, 0.6)], [42, 38, 34], { bp: [[0, 0.5, 0.12]] }), ICEN, { nFacets: 2 });
    V.iced(f, K.chain([lerp(EN, WN, 0.55), WN], [30, 26]), SKI, { nFacets: 1 });
    f.line([lp(EN, WN, 0.78, -8), lp(EN, WN, 0.86, 6)], 5, '#d8c8c0', { op: 0.7 }); f.line([lp(EN, WN, 0.78, -8), lp(EN, WN, 0.86, 6)], 1, '#8a5a50', { op: 0.6 }); // an old burn scar on the wrist
    V.icicles(f, [lp(SN, EN, 0.9, 18), lp(EN, WN, 0.1, 18)], 3, 10, 24);
    crease([lp(SN, EN, 0.5, -10), lp(SN, EN, 0.7, 6)]);
  }, '_n');
  const hn = cup(WN, { fill: '#c0c6c8', shadow: P.skinIS, shade: 0.4, tex: 'mottle826', texOp: 0.4 }, '_n');
  // ---- the horn, held out level: an ox horn with an iron rim and tip; the mead boils in the bottom and freezes at the
  // lip, steam rising from it
  f.bone('horn');
  const hornL = K.chain(hc.filter((_, i) => i % 3 === 0).concat([hc[hc.length - 1]]), hc.filter((_, i) => i % 3 === 0).concat([0]).map((_, i, a) => hw(i / (a.length - 1))));
  const hD = f.part(hornL, { fill: '#9a8a6a', shadow: '#3a2c1e', light: '#d4c6a4', shade: 0.38, inkW: 1.5, tex: 'mottle826', texOp: 0.5 });
  V.clipDraw(f, hD, () => {
    for (let i = 2; i < hc.length - 2; i += 3) { const a = hc[i - 1], b = hc[i + 1], d = E.norm(sub(b, a)), n = [-d[1], d[0]], w = hw(i / (hc.length - 1)); f.line([add(hc[i], mul(n, w * 0.55)), add(hc[i], mul(n, -w * 0.55))], 1, INK, { op: 0.35 }); } // growth rings
    V.glow(f, hc[6], 26, 12, P.lamp, 0.5); // the mead boiling in the bottom, showing through the horn
    f.line(hc.slice(2, -2).map(q => add(q, [0, -8])), 2, '#f0e8d0', { op: 0.5 }); // sheen
  });
  // iron tip and rim
  f.part(limb(add(hc[0], [-14, -3]), hc[2], 8, 12, { steps: 4 }), { fill: P.iron, shadow: '#120e0c', shade: 0.4, inkW: 1.2, cast: false });
  f.flat(ell(add(hc[0], [-12, -2]), 3, 2.4, 0, 6), P.lamp); // the iron tip hot
  const rimC = hc[hc.length - 1], rD = E.norm(sub(hc[hc.length - 1], hc[hc.length - 3])), rA = Math.atan2(rD[1], rD[0]);
  f.part(ell(rimC, 11, 28, rA, 16), { fill: P.ironL, shade: 0.35, inkW: 1.3, cast: false });
  f.part(ell(add(rimC, mul(rD, 2)), 8, 22, rA, 14), V.ICE(f, { fill: '#e0d8b8', light: '#fffbe8' })); // the mead frozen across the mouth
  f.flat(ell(add(rimC, mul(rD, 3)), 2.4, 8, rA, 8), P.iceL, { op: 0.8 });
  V.icicles(f, [add(rimC, [-4, 18]), add(rimC, [6, 14])], 2, 8, 16);
  V.puff(f, add(rimC, [6, -18]), 80, 18, { drift: 10, op: 0.34 });
  for (let i = 0; i < 4; i++) f.flat(ell(add(hc[5 + i], [0, -2 - i * 2]), 2, 2, 0, 6), P.hot, { op: 0.7 }); // bubbles rising inside
  // thumbs laid over the near side of the horn
  for (const [h, sfx, col] of [[ha, '_f', '#b8bec2'], [hn, '_n', '#c0c6c8']]) { f.bone('hand' + sfx); f.part(limb(add(h.q, [-20, h.w * 0.3]), add(h.q, [8, -h.w * 0.05]), 13, 10, { steps: 5 }), { fill: col, shadow: P.skinIS, shade: 0.4, inkW: 1.2, cast: false }); f.flat(ell(add(h.q, [6, -h.w * 0.03]), 3, 2.2, 0, 6), P.bone, { op: 0.8 }); }
  V.icicles(f, [add(ha.q, [-10, ha.w * 0.5 + 16]), add(ha.q, [8, ha.w * 0.5 + 18])], 2, 5, 12);
  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [24, 48]), 46, 5, 0, 14), P.charS, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ ORE-HAULER (cast, large 1.4)
// A huge, broad thrall who dragged the ore sledges up from the shaft head. Bent nearly double into the leather harness,
// the back humped high, the chest down by the front knee, the near hand flat on the ice, the far hand on the breast
// strap; the back leg driven out behind on its toes, the front leg folded under him; the low iron-shod sledge heaped
// with ore dragging behind on chained traces. The weight is thrown forward into the harness.
// Split: along the harness. The broad strap from the near shoulder across the chest to the far hip carried the heat of
// the last load, and under it the skin is burnt in a stripe a hand wide, black and split in orange seams; either side
// of the stripe he is frozen, rime thick on the back and arms. The crack runs along both edges of the stripe.
// Rig: pelvis (root) > torso > head; standard arms and legs; sledge (on pelvis, pivot at the trace ring) for the swing.
function oreHauler() {
  const CW = 1300, CH = 1100;
  const f = new Fig(V.base(827, CH, { grimeY: 900 })); V.texturesB(f);
  const gy = f.o.groundY, H = 140;
  const N = [920, 748], C = [796, 616], Pv = [666, 690];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(0.05, 0.08), EN = [972, 906], WN = [1020, 1030];
  const SF = S.at(0.3, 0.1), WF = S.at(0.9, 0.3), EF = add(WF, mul(S.T(0.3), -130));
  const HN = S.at(0.1, 0.96), KN = [850, 840], AN = [812, 1020];
  const HF = S.at(-0.2, 0.98), KF = [556, 872], AF = [452, 1012];
  const HC = [1012, 790], hA = 0.32, hF = frame(HC, hA, H);
  const ring = [712, 792]; // the trace ring at the far hip
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.85), N: S.at(0.1, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('sledge', ring, 'pelvis');
  // (review) frozen flesh, not cloth: a violet-grey skin with a narrow shadow band, then muscle, mottling and veins
  const SKI = V.SKI(f, { fill: '#b8babc', shadow: '#464658', maxShade: 38, shade: 0.4 }), SKC = V.SKC(f, { fill: '#3a2e28', maxShade: 40 });
  const flesh = (a, b, w, k = 1) => {
    V.mass(f, [lp(a, b, 0.08, w * 0.5), lp(a, b, 0.42, w * 0.6), lp(a, b, 0.8, w * 0.44), lp(a, b, 0.62, -w * 0.1), lp(a, b, 0.2, -w * 0.1)], { s: w * 0.35, op: 0.4, hiOp: 0.35, shadow: '#34344a' }); // a muscle belly
    V.mass(f, [lp(a, b, 0.15, -w * 0.5), lp(a, b, 0.5, -w * 0.55), lp(a, b, 0.85, -w * 0.4), lp(a, b, 0.6, w * 0.05)], { s: w * 0.3, op: 0.35, hiOp: 0.25, shadow: '#3a3048' });
    for (let i = 0; i < 3 * k; i++) f.flat(ell(lp(a, b, V.R(f, 0.12, 0.88), V.R(f, -w * 0.35, w * 0.35)), V.R(f, 6, 16), V.R(f, 4, 9), f.r() * 3, 10), '#7a7484', { op: 0.24 }); // frost mottling
    let q = lp(a, b, 0.15, (f.r() - 0.5) * w * 0.4); const vp = [q], dd = E.norm(sub(b, a)); for (let j = 0; j < 4; j++) { q = add(q, add(mul(dd, V.R(f, 0.16, 0.24) * E.len(sub(b, a))), [(f.r() - 0.5) * 10, (f.r() - 0.5) * 10])); vp.push(q); }
    f.line(vp, 1.7, '#46507a', { op: 0.55 }); f.line([vp[2], add(vp[2], [(f.r() - 0.5) * 26, (f.r() - 0.5) * 26])], 1.1, '#46507a', { op: 0.5 }); // a vein
  };
  const ICES = Object.assign({}, SKI, { tex: 'mottle827', texOp: 0.3 });
  // the burnt stripe under the strap: a band a hand wide from the near shoulder over the side of the chest to the far hip
  const strapC = [[952, 650], [904, 690], [836, 734], [768, 768], ring];
  const band = (w) => { const C2 = V.spline(strapC, 6); return [...V.offsetLine(C2, () => w / 2), ...V.offsetLine(C2, () => -w / 2).reverse()]; };
  const stripe = V.jagLoop(f, band(84), 6, 11);

  // ---- the sledge behind him: oak runners shod with iron, curling up at the front; ore heaped on its deck under a crust
  // of frost, glowing at the core; a frayed rope lashing; a lump fallen off behind, smoking
  f.bone('sledge');
  const deckY = 990, x0 = 70, x1 = 430;
  const runner = [[x0 - 10, gy - 10], [x1 - 20, gy - 10], [x1 + 30, gy - 30], [x1 + 54, gy - 76], [x1 + 40, gy - 92], [x1 + 24, gy - 60], [x1 - 10, gy - 36], [x0 - 6, gy - 34]];
  V.timber(f, [x0, deckY], [x1 + 10, deckY], 26, { state: 'ice', ends: 'a' });
  f.part(runner, Object.assign(V.rimed({ fill: P.wood, shadow: P.woodD, tex: 'grain827', texOp: 0.7, shade: 0.4 }, 0.25), { inkW: 1.6 }));
  f.part([[x0 - 14, gy - 2], [x1 - 18, gy - 2], [x1 + 34, gy - 22], [x1 + 58, gy - 70], [x1 + 50, gy - 74], [x1 + 26, gy - 30], [x1 - 20, gy - 12], [x0 - 12, gy - 12]], { fill: P.iron, shadow: '#0e0c0c', shade: 0.4, inkW: 1.3, cast: false }); // iron shoe
  for (let i = 0; i < 6; i++) f.rivet([x0 + 20 + i * 66, gy - 7], 2.4);
  for (const x of [x0 + 40, (x0 + x1) / 2, x1 - 30]) f.part([[x - 8, deckY + 12], [x + 8, deckY + 12], [x + 6, gy - 30], [x - 6, gy - 30]], V.rimed({ fill: P.woodD, shadow: '#120e0a', shade: 0.4 }, 0.2)); // stanchions
  // the ore heap: black lumps, cores glowing through cracks, a frost crust on top
  const lumps = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6 - row * 2; i++) { const r = V.R(f, 34, 46) - row * 4, x = x0 + 40 + row * 50 + i * (x1 - x0 - 80 - row * 100) / Math.max(1, 5 - row * 2), y = deckY - 18 - row * 50 - r * 0.5; lumps.push([x, y, r]); }
  for (const [x, y, r] of lumps) {
    const pts = ell([x, y], r, r * 0.78, f.r() * 3, 9).map((q, i) => [q[0] + (f.r() - 0.5) * r * 0.3, q[1] + (f.r() - 0.5) * r * 0.3, i % 3 === 0 ? 1 : 0]);
    const d = f.part(pts, { fill: '#2a2628', shadow: '#060506', light: '#6a6268', shade: 0.42, tex: 'craze827', texOp: 0.7, inkW: 1.6, maxShade: 30 });
    V.clipDraw(f, d, () => { V.crackNet(f, [x + (f.r() - 0.5) * r, y + r * 0.2], f.r() * 6.3, r * 1.1, 2, { depth: 1 }); V.glow(f, [x, y + r * 0.2], r * 0.6, r * 0.4, P.lamp, 0.35); });
  }
  V.rimeCrust(f, [[x0 + 20, deckY - 60], [x0 + 110, deckY - 120], [x0 + 200, deckY - 160], [x1 - 80, deckY - 120], [x1, deckY - 50]], 12, [-1, -0.3], { gap: 7 });
  V.rope(f, [[x0 + 10, deckY + 6], [x0 + 120, deckY - 100], [x0 + 230, deckY - 150], [x1 - 40, deckY - 90], [x1 + 4, deckY + 4]], 5, { col: mix('#6a5e48', P.ice, 0.2) });
  f.line([[x1 + 4, deckY + 4], [x1 + 14, deckY + 28], [x1 + 6, deckY + 40]], 2, '#8a7e64'); f.line([[x1 + 4, deckY + 4], [x1 - 2, deckY + 34]], 1.4, '#8a7e64'); // frayed end
  for (let i = 0; i < 3; i++) V.puff(f, [x0 + 120 + i * 110, deckY - 140 + (i % 2) * 40], 120, 26, { phase: i, op: 0.24 });
  // the lump fallen behind, smoking on the ice
  const fl = [x0 - 40, gy - 18];
  const fld = f.part(ell(fl, 26, 18, 0.3, 9).map((q, i) => [q[0] + (f.r() - 0.5) * 6, Math.min(gy, q[1] + (f.r() - 0.5) * 6), i % 3 === 0 ? 1 : 0]), { fill: '#2a2628', shadow: '#060506', light: '#6a6268', shade: 0.42, tex: 'craze827', texOp: 0.7 });
  V.clipDraw(f, fld, () => V.crackNet(f, fl, -0.5, 30, 2, { depth: 1 }));
  V.glow(f, [fl[0], gy], 40, 8, P.lamp, 0.4); V.puff(f, add(fl, [0, -20]), 110, 20, { op: 0.3, col: '#5a5450', sway: 10 });
  // the traces: two iron chains from the sledge's front to the ring at his far hip
  V.chainLinks(f, [[x1 + 30, gy - 56], lerp([x1 + 30, gy - 56], ring, 0.5).map((v, i) => v + (i ? 26 : 0)), ring], 16);
  V.chainLinks(f, [[x1 + 10, deckY - 4], lerp([x1 + 10, deckY - 4], ring, 0.5).map((v, i) => v + (i ? 10 : 0)), add(ring, [-8, 4])], 14, P.ironL);

  // ---- far arm (behind): frozen, the hand on the breast strap
  V.armRig(f, SF, EF, WF, [70, 60, 48], () => {
    V.iced(f, K.chain([SF, EF], [74, 62], { bp: [[0, 0.5, 0.14]] }), Object.assign({}, ICES, { fill: mix(ICES.fill, '#000', 0.2) }), { nFacets: 3, rimeOp: 0.1 });
    V.iced(f, K.chain([lerp(EF, SF, 0.08), WF], [60, 46], { bq: [[0, 0.3, 0.16]] }), Object.assign({}, ICES, { fill: mix(ICES.fill, '#000', 0.2) }), { nFacets: 2, rimeOp: 0.1, after: () => flesh(EF, WF, 52, 0.7) });
  }, '_f');
  // ---- far (back) leg, driven out behind on its toes: wool leg wraps, a bare foot black with frost
  const legSet = (Hp, Kn, A, sfx, tone, tiptoe) => {
    V.legRig(f, Hp, Kn, A, 70, () => {
      V.iced(f, K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.12)], [104, 90, 72, 68], { bp: [[0, 0.5, 0.12]], bq: [[0, 0.5, 0.12]] }), Object.assign({}, ICES, { fill: mix(ICES.fill, '#000', tone) }), { nFacets: 3, rimeOp: 0.1 });
      fold(f, [lp(Hp, Kn, 0.2, 30), lp(Hp, Kn, 0.6, 34), lp(Hp, Kn, 0.9, 22)], 4, 0.4); fold(f, [lp(Hp, Kn, 0.3, -26), lp(Hp, Kn, 0.7, -30)], 3, 0.35); // quadriceps and hamstring edges
      V.clipDraw(f, E.smooth(K.chain([Hp, lerp(Hp, Kn, 0.5), Kn], [104, 90, 72])), () => flesh(Hp, Kn, 90)); fold(f, [lp(Hp, Kn, 0.92, -30), lp(Hp, Kn, 1.0, -6), lp(Kn, A, 0.06, 20)], 3, 0.5); // the knee's crease
      const wr = K.chain([lerp(Kn, A, 0.08), lerp(Kn, A, 0.5), lerp(Kn, A, 0.94)], [68, 62, 46], { bp: [[0, 0.6, 0.18]] });
      V.iced(f, wr, V.rimed({ fill: mix('#5a5448', '#000', tone), shadow: '#1e1a16', tex: 'weave827', texOp: 0.6, shade: 0.4 }, 0.3), { nFacets: 2 });
      for (let i = 0; i < 8; i++) { const t = 0.12 + i * 0.1; f.line([lp(Kn, A, t, 32), lp(Kn, A, t + 0.06, -32)], 2.2, INK, { op: 0.55 }); }
      f.line([lp(Kn, A, 0.9, -20), lp(Kn, A, 1.0, -34), lp(Kn, A, 1.06, -30)], 2, '#5a5448'); // a loose end
    }, sfx);
    f.bone('foot' + sfx);
    const FROST = { fill: '#2e2a2c', shadow: '#0a0808', light: '#7a8088', shade: 0.4, tex: 'rime827', texOp: 0.5 };
    if (tiptoe) {
      const ball = [A[0] + 58, gy - 8], toe = [A[0] + 98, gy - 4];
      const ft = [add(A, [-26, -10]), add(A, [24, -12]), [ball[0], ball[1] - 26], [toe[0], toe[1] - 14], [toe[0] + 6, gy, 1], [ball[0] - 14, gy, 1], add(A, [-4, 34]), add(A, [-24, 14])];
      f.part(ft, FROST);
      for (let i = 0; i < 4; i++) f.line([[toe[0] - 4 - i * 10, gy - 1], [toe[0] - 10 - i * 10, gy - 14]], 1.2, INK, { op: 0.6 });
    } else B.bareFoot(f, A, 1, 70, FROST.fill, { shadow: FROST.shadow, tex: 'rime827', texOp: 0.6 });
    V.rimeCrust(f, [add(A, [-30, 10]), add(A, [20, -6])], 6, [-1, -0.3], { gap: 6 });
  };
  legSet(HF, KF, AF, '_f', 0.15, true);

  // ---- torso: humped high, broad; rimed thick on the back, the burnt stripe under the strap; old whip scars
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.5, 0.42], [0.06, 0.84, 0.8], [0.26, 0.9, 0.96], [0.5, 0.78, 0.86], [0.72, 0.62, 0.7], [0.9, 0.66, 0.62], [1.04, 0.72, 0.62], [1.14, 0.56, 0.44]]);
  V.zone(f, torso, ICES, SKC, stripe, { riftW: 3, iceO: { nFacets: 6, cracks: 4, rimeOp: 0.1 }, charO: { seams: 3, seamW: 2.4 } });
  V.clipDraw(f, E.smooth(torso), () => {
    f.raw(`<path d="${E.smooth([S.at(0.5, 0.2), S.at(0.95, 0.4), S.at(0.9, 0.9), S.at(0.4, 0.9)])}" fill="#000" opacity="0.35" filter="url(#smkL827)"/>`); // the chest in shadow underneath
    for (let i = 0; i < 5; i++) f.stroke([S.at(-0.85, 0.25 + i * 0.13), S.at(-0.55, 0.3 + i * 0.13), S.at(-0.2, 0.26 + i * 0.14)], 3.4, '#e8dcd4', { op: 0.6 }); // whip scars, pale welts
    for (let i = 0; i < 5; i++) f.line([S.at(-0.85, 0.25 + i * 0.13), S.at(-0.55, 0.3 + i * 0.13), S.at(-0.2, 0.26 + i * 0.14)], 1, '#6a4040', { op: 0.6 });
    fold(f, [S.at(-0.2, 0.08), S.at(-0.6, 0.2), S.at(-0.82, 0.42)], 4, 0.4); // the shoulder blade's edge
    fold(f, [S.at(-0.78, 0.04), S.at(-0.86, 0.4), S.at(-0.72, 0.7), S.at(-0.66, 1.0)], 5, 0.4); // the spine's furrow, along the top of the hump
    fold(f, [S.at(-0.1, 0.06), S.at(-0.42, 0.3), S.at(-0.64, 0.36)], 4, 0.45); fold(f, [S.at(-0.3, 0.42), S.at(-0.6, 0.38)], 3, 0.4); // the far shoulder blade's ridge and point
    for (let i = 0; i < 4; i++) fold(f, [S.at(0.2 + i * 0.04, 0.46 + i * 0.09), S.at(0.5 + i * 0.03, 0.42 + i * 0.1), S.at(0.7, 0.4 + i * 0.11)], 3, 0.35); // ribs under the side
    fold(f, [S.at(-0.2, 0.62), S.at(0.1, 0.72), S.at(0.3, 0.82)], 4, 0.4); // the lat's lower edge into the waist
    f.raw(`<path d="${E.smooth([S.at(-0.5, 0.0), S.at(0.1, 0.05), S.at(0.3, 0.3), S.at(-0.2, 0.35)])}" fill="#ffffff" opacity="0.12" filter="url(#smkL827)"/>`); // the trapezius mass catching the light
    fold(f, [S.at(0.2, 0.75), S.at(0.6, 0.8)], 5, 0.4); // the belly's fold, folded on itself
  });
  V.clipDraw(f, E.smooth(torso), () => { for (let i = 0; i < 7; i++) { const q = S.at(-0.8 + (i % 2) * 0.02, 0.1 + i * 0.12); V.mass(f, ell(q, 13, 9, 0.5, 10), { s: 6, op: 0.45, hiOp: 0.5, shadow: '#3a3048', sharp: true }); } for (let i = 0; i < 6; i++) f.flat(ell(S.at(V.R(f, -0.7, 0.2), V.R(f, 0.1, 0.8)), V.R(f, 10, 22), V.R(f, 6, 12), f.r() * 3, 10), '#7a7484', { op: 0.22 }); }); // the vertebrae along the hump, frost mottling
  V.rimeCrust(f, [S.at(-0.6, -0.1), S.at(-0.85, 0.3), S.at(-0.82, 0.7), S.at(-0.7, 1.0)], 14, [-0.3, -1], { gap: 6, feather: 1.5 });
  V.icicles(f, [S.at(0.9, 0.5), S.at(0.85, 0.8)], 4, 14, 30);
  // the harness: the broad strap along the stripe, iron rings, a breast strap round the chest
  const strap = V.spline(strapC, 6);
  f.part([...V.offsetLine(strap, () => 17), ...V.offsetLine(strap, () => -17).reverse()], Object.assign(V.charred(V.LEA(f), 0.3), { inkW: 1.5, cast: true }));
  f.stitches(V.offsetLine(strap, () => 11), '#a8987c', 0.8); f.stitches(V.offsetLine(strap, () => -11), '#a8987c', 0.8);
  V.embers(f, S.at(0.7, 0.5), 30, 40, 6);
  const rr = ell(ring, 18, 18, 0, 14); f.line(rr.concat([rr[0]]), 8, INK); f.line(rr.concat([rr[0]]), 5, P.ironL);
  const bs = [[852, 626], [870, 720], [896, 826]];
  f.part([...V.offsetLine(V.spline(bs, 6), () => 12), ...V.offsetLine(V.spline(bs, 6), () => -12).reverse()], V.rimed(V.LEA(f), 0.25));
  const br = S.at(0.62, 0.16); const brr = ell(br, 13, 13, 0, 12); f.line(brr.concat([brr[0]]), 6, INK); f.line(brr.concat([brr[0]]), 3.6, P.ironL);
  // breechcloth at the hips (pelvis)
  f.bone('pelvis');
  const bc = [S.at(-0.66, 0.84), S.at(0.6, 0.82), S.at(0.7, 1.08), S.at(0.3, 1.3), S.at(-0.1, 1.22), S.at(-0.6, 1.12)];
  V.iced(f, bc, V.rimed(V.WOOL(f, { fill: '#5a564e' }), 0.3), { nFacets: 2 });
  f.part([S.at(-0.7, 0.8), S.at(0.66, 0.78), S.at(0.68, 0.88), S.at(-0.72, 0.9)], V.rimed({ fill: '#3a3634', shadow: '#121012', shade: 0.4 }, 0.2));
  V.icicles(f, [S.at(0.3, 1.3), S.at(-0.1, 1.22), S.at(-0.6, 1.12)], 4, 10, 22);

  // ---- near (front) leg, folded under him
  legSet(HN, KN, AN, '_n', 0, false);

  // ---- head: shaven, heavy brow, jaw clenched, steam from the nose; the iron thrall collar with a broken link and a
  // tally stick tied to it
  f.bone('head');
  f.part(limb(S.at(0.1, -0.08), add(HC, rot([-20, 30], hA)), 96, 84), ICES); // the bull neck
  B.head(f, HC, H, hA, { skin: '#b8c0c4', jaw: 1.25, chin: 0.04, nose: 1.15, hook: 0.2, mouth: 'set', squint: 0.6, browDown: 0.1, browW: 0.07, age: true, faceShade: 0.82, scar: [[0.0, -0.36], [0.12, -0.2]], hair: [[0.24, -0.46], [0.0, -0.56], [-0.3, -0.48], [-0.42, -0.2], [-0.36, -0.36], [-0.1, -0.5]], hairCol: '#8a9298', browCol: '#3a3c40', eyeWhite: '#9aa4aa' });
  V.clipDraw(f, E.smooth(hF([[-0.3, -0.4], [0.18, -0.47], [0.35, -0.13], [0.33, 0.21], [0.29, 0.47], [0.13, 0.535], [-0.21, 0.27], [-0.37, -0.13]])), () => { f.raw(`<rect x="${HC[0] - 90}" y="${HC[1] - 90}" width="180" height="180" fill="url(#rime827)" opacity="0.45"/>`); V.facets(f, hF([[-0.1, -0.2]])[0], 40, 30, 4, { op: 0.25 }); });
  f.line(hF([[0.17, 0.3], [0.24, 0.29], [0.31, 0.3]]), 2, '#1a1c22'); // the clenched set of the lips
  fold(f, hF([[0.33, 0.3], [0.3, 0.42]]), 2.4, 0.5); // the jaw muscle
  V.puff(f, hF([[0.4, 0.16]])[0], 70, 18, { drift: 30, op: 0.36 });
  const n0 = S.at(-0.2, -0.04), n1 = add(HC, rot([-30, 70], hA)), cd = E.norm(sub(n1, n0)), cnn = [-cd[1], cd[0]], cm = lerp(n0, n1, 0.45);
  const cr = [add(cm, mul(cnn, 52)), add(add(cm, mul(cnn, 20)), mul(cd, 6)), add(cm, mul(cd, 8)), add(add(cm, mul(cnn, -24)), mul(cd, 6)), add(cm, mul(cnn, -54))];
  f.part([...V.offsetLine(cr, () => 11), ...V.offsetLine(cr, () => -11).reverse()], { fill: P.iron, shadow: '#0c0a0a', light: P.ironL, shade: 0.4, inkW: 1.6, tex: 'mottle827', texOp: 0.6 });
  for (let i = 0; i < 4; i++) f.rivet(lerp(cr[0], cr[4], 0.12 + i * 0.25), 2.8);
  f.flat(ell(cr[1], 6, 3, 0.4, 8), P.rust, { op: 0.6 });
  cr[6] = cr[4]; cr[8] = cr[3];
  const lk = add(cr[6], [0, 8]); V.chainLinks(f, [lk, add(lk, [-6, 30])], 14); // the broken link hanging
  f.line([add(lk, [-6, 30]), add(lk, [-2, 38])], 3, P.ironL);
  const ts = add(cr[8], [4, 6]); f.line([cr[8], ts], 1.6, '#8a7e64');
  f.part(limb(ts, add(ts, [10, 56]), 10, 9, { steps: 4 }), V.rimed({ fill: P.woodL, shadow: P.woodD, shade: 0.4 }, 0.2)); for (let i = 0; i < 5; i++) f.line([add(ts, [-2 + i * 2, 12 + i * 9]), add(ts, [8 + i * 2, 10 + i * 9])], 1.2, INK);

  // ---- near arm, braced to the ice: the hand flat, fingers splayed
  V.armRig(f, SN, EN, WN, [76, 64, 50], () => {
    V.zone(f, K.chain([add(SN, [-10, -20]), EN, lerp(EN, WN, 0.1)], [80, 66, 62], { bp: [[0, 0.5, 0.14]], bq: [[0, 0.4, 0.1]] }), ICES, SKC, stripe, { riftW: 2.4, iceO: { nFacets: 3, rimeOp: 0.1 }, charO: { seams: 1 } });
    V.iced(f, K.chain([lerp(EN, SN, 0.08), lerp(EN, WN, 0.4), WN], [70, 64, 44], { bp: [[0, 0.3, 0.2]], bq: [[0, 0.25, 0.14]] }), ICES, { nFacets: 3, rimeOp: 0.1 });
    fold(f, [lp(EN, WN, 0.1, -20), lp(EN, WN, 0.4, -26), lp(EN, WN, 0.7, -18)], 4, 0.45);
    V.clipDraw(f, E.smooth(K.chain([lerp(EN, SN, 0.08), lerp(EN, WN, 0.5), WN], [62, 58, 46])), () => flesh(EN, WN, 58)); V.clipDraw(f, E.smooth(K.chain([SN, EN], [80, 66])), () => flesh(SN, EN, 74, 0.6));
    fold(f, [lp(SN, EN, 0.9, 30), lp(SN, EN, 1.0, 6), lp(EN, WN, 0.08, 24)], 3, 0.5); // the elbow's crease
    V.rimeCrust(f, [lp(SN, EN, 0.1, -34), lp(SN, EN, 0.6, -36), lp(EN, WN, 0.3, -30)], 8, [-1, -0.3], { gap: 6 });
  }, '_n');
  f.bone('hand_n');
  const palm = [add(WN, [-24, -8]), add(WN, [22, -12]), add(WN, [46, gy - WN[1] - 12]), add(WN, [-14, gy - WN[1] - 6])];
  f.part(palm, ICES);
  for (let i = 0; i < 4; i++) { const b = add(WN, [36 - i * 2, gy - WN[1] - 18 + i * 1]), t = [b[0] + 46 - i * 6, gy - 4]; f.part(limb(b, t, 16, 13, { steps: 5, capK: 0.9 }), Object.assign({}, ICES, { cast: false, inkW: 1.2 })); f.line([lerp(b, t, 0.5), add(lerp(b, t, 0.5), [2, -7])], 1, INK, { op: 0.6 }); f.flat(ell(lerp(b, t, 0.86), 7, 5, V.ang(b, t), 8), '#4a3e56', { op: 0.75 }); f.flat(ell(lerp(b, t, 0.92), 3.4, 2.4, V.ang(b, t), 8), '#c8c4c8', { op: 0.8 }); f.flat(ell(add(b, [0, -3]), 5, 3, 0, 8), '#e4e2e6', { op: 0.5 }); } // knuckles, frostbitten fingertips, nails
  f.part(limb(add(WN, [-10, gy - WN[1] - 30]), [WN[0] - 34, gy - 6], 18, 14, { steps: 5 }), Object.assign({}, ICES, { cast: false, inkW: 1.2 })); // thumb
  f.bone('hand_f');
  B.grip(f, WF, EF, Math.atan2(S.F(0.3)[1], S.F(0.3)[0]), 34, mix(ICES.fill, '#000', 0.2), { shadow: P.skinIS, tex: 'rime827', texOp: 0.5, name: 'hauler strap' });
  f.bone('root');
  f.flat(ell([700, gy + 2], 520, 10, 0, 22), P.iceS, { op: 0.35 });
  return f;
}

// ------------------------------------------------------------------ SNOW HARE (cast, small 0.4)
// A big mountain hare in its winter white, come down for the moss the vents had thawed, sitting bolt upright on its
// haunches: the long hind feet flat on the ice and carrying the weight, the haunch folded over them, the chest deep
// over a tucked belly, the forepaws drawn up against the chest, the head turned to the company and listening, the ears
// straight up. The eye is a dark almond set under the brow, wet-glinting, not a white disc.
// Split: a crazing. It bolted through the steam when a vent broke under it and heat and cold struck it at once, so the
// whole body is a fine net of cracks like crackled glaze; each plate is either winter fur rimed stiff and white or
// singed to the skin, charred and glowing: a mosaic of white and orange. The cracks open widest at the joints and up
// the tall ears.
// Rig: body (root) > head > ear_n, ear_f; fore_n, fore_f; foot_n, foot_f (the drumming feet); snare (on head).
function snowHare() {
  const [CW, CH] = TIERS.small;
  const f = new Fig(V.base(828, CH, { grimeY: 720 })); V.texturesB(f);
  const gy = f.o.groundY, k = 0.84, Z = pts => pts.map(q => [260 + (q[0] - 260) * k, gy + (q[1] - gy) * k, q[2]].filter(v => v !== undefined)), z = q => Z([q])[0];
  const FURW = { fill: '#d4dadc', shadow: '#5a6274', light: '#f4f8f8', shade: 0.4, tex: 'fur828', texOp: 0.45, maxShade: 26 };
  const FURD = Object.assign({}, FURW, { fill: '#aab2b8' });
  const HC = z([314, 604]), hA = 0.28;
  f.joint('body', z([250, 740])).joint('head', z([282, 612]), 'body').joint('ear_n', z([284, 580]), 'head').joint('ear_f', z([296, 578]), 'head').joint('snare', z([284, 626]), 'head');
  f.joint('fore_n', z([300, 660]), 'body').joint('fore_f', z([310, 664]), 'body').joint('foot_n', z([222, 776]), 'body').joint('foot_f', z([236, 772]), 'body');
  const wide = q => { const jn = [z([300, 694]), z([226, 770]), z([290, 640])]; return 1 + jn.reduce((a, j) => a + Math.max(0, 1 - E.len(sub(q, j)) / 22), 0) * 0.9; };
  const craze = (d, pts, cell = 11, kk = 0.3) => V.crazing(f, d, E.bbox(pts), cell * k, kk, { wide, hotAt: (q, r) => r < kk + (q[1] - 680) / 900 + Math.sin(q[0] * 0.07 + q[1] * 0.05) * 0.12 });
  const moult = (edge, n, l0, l1, dir) => V.hanks(f, Z(edge), n, l0 * k, l1 * k, 6 * k, { state: 'ice', dir: [dir[0] * 0.4, 1], strands: 2, icicleK: 0.2, icS: 0.4, gap: false, pal: ['#a8b0b6', '#c8d0d4', '#8a929a', '#d8dee0'] });

  // ---- far hind foot and far foreleg (behind)
  f.bone('foot_f');
  const footF = Z([[214, 762], [246, 760], [304, 774], [318, 786], [312, 790, 1], [212, 790, 1], [204, 778]]);
  const dFF = f.part(footF, FURD); craze(dFF, footF, 14);
  f.bone('fore_f');
  const fore = (sh, el, pw, look) => { const leg = Z([add(sh, [-8, -4]), add(sh, [8, -4]), add(el, [8, 0]), add(pw, [4, -8]), add(pw, [14, -2]), add(pw, [10, 8]), add(el, [-4, 8]), add(sh, [-10, 10])]); const d = f.part(leg, look); craze(d, leg, 12, 0.5); return leg; };
  fore([312, 662], [314, 700], [338, 680], FURD);
  // ---- body: the haunch low and heavy, the back near upright, the chest deep, the belly tucked
  f.bone('body');
  const body = Z([[196, 776], [184, 740], [188, 696], [202, 656], [222, 622], [248, 598], [272, 592], [304, 618], [324, 650], [332, 688], [322, 718], [304, 736], [296, 760], [286, 782], [240, 788]]);
  const dB = f.part(body, FURW);
  V.clipDraw(f, dB, () => { f.raw(`<path d="${E.smooth(Z([[296, 700], [330, 690], [320, 740], [290, 770]]))}" fill="#2a3040" opacity="0.4" filter="url(#smk828)"/>`); fold(f, Z([[300, 712], [312, 730], [302, 750]]), 2, 0.4); }); // the belly tucked in under the chest
  craze(dB, body, 16, 0.45);
  moult([[188, 700], [196, 660], [214, 628], [240, 604]], 7, 8, 16, [-0.9, 0.3]);
  // the near haunch: the thigh folded on the hip, the hock angled down to the heel
  const haunch = Z([[206, 700], [244, 690], [280, 712], [292, 748], [284, 778], [246, 788], [208, 782], [192, 750]]);
  const dH = f.part(haunch, FURW); craze(dH, haunch, 15, 0.4);
  fold(f, Z([[214, 708], [260, 704], [286, 740]]), 2.2, 0.45);
  moult([[200, 760], [214, 784], [250, 790]], 4, 6, 10, [-0.3, 1]);
  // ---- near hind foot: long, flat, furred and balled with ice under the toes; a cracked claw
  f.bone('foot_n');
  const footN = Z([[200, 766], [240, 764], [300, 778], [326, 786], [322, 790, 1], [196, 790, 1], [190, 780]]);
  const dFN = f.part(footN, FURW); craze(dFN, footN, 14);
  for (const x of [262, 284, 306]) { const q = z([x, 789]); f.part(ell(q, 7 * k, 5 * k, 0, 8), V.ICE(f, { fill: P.glass, cast: false, inkW: 1 })); } // ice balls in the foot fur
  for (let i = 0; i < 3; i++) { const q = z([318 + i * 3, 784 + i]); f.part([q, add(q, [8, 2]), add(q, [2, 5])], { fill: P.boneD, shade: 0.3, inkW: 0.8, cast: false }); }
  f.line([z([322, 785]), z([327, 788])], 1, INK); // the cracked claw
  // ---- near foreleg, the paw drawn up against the chest
  f.bone('fore_n');
  fore([302, 658], [300, 698], [330, 676], FURW);
  for (let i = 0; i < 3; i++) f.line([z([334 + i * 2, 670 + i * 4]), z([342 + i * 2, 672 + i * 4])], 1, INK, { op: 0.7 });
  // ---- head: long and narrow, the eye a dark almond under the brow, nostrils twitching, moss in the mouth
  f.bone('head');
  const head = Z([[262, 604], [270, 584], [292, 574], [316, 578], [338, 594], [354, 612], [352, 622], [340, 630], [318, 632], [296, 628], [276, 620]]);
  const dHd = f.part(head, FURW);
  V.clipDraw(f, dHd, () => f.raw(`<path d="${E.smooth(Z([[290, 600], [330, 604], [340, 626], [300, 630]]))}" fill="#2a3040" opacity="0.25" filter="url(#smk828)"/>`));
  craze(dHd, head, 9, 0.24);
  V.animalEye(f, z([310, 594]), 10 * k, hA, { frost: true });
  f.part(Z([[344, 608], [354, 611], [355, 620], [347, 622]]), { fill: '#3a2a2a', shade: 0.3, inkW: 1, cast: false }); // nose pad
  f.line(Z([[348, 614], [352, 618]]), 1, '#000');
  f.line(Z([[350, 622], [346, 628], [338, 630]]), 1.2, INK); // the split lip
  for (let i = 0; i < 5; i++) f.line([z([336 + i * 3, 630]), z([342 + i * 4, 642 + (i % 2) * 3])], 1.4, i % 2 ? '#4a6a3a' : '#6a7a4a'); // a tuft of moss
  for (let i = 0; i < 3; i++) { f.line([z([344, 618 + i * 3]), z([372, 610 + i * 7])], 0.9, P.rime, { op: 0.85 }); f.flat(ell(z([372, 610 + i * 7]), 1.4, 1.4, 0, 6), P.iceL); } // frost on the near whiskers
  for (let i = 0; i < 2; i++) { f.line([z([346, 622 + i * 3]), z([354, 624 + i * 4])], 1.2, P.charS); f.flat(ell(z([354, 624 + i * 4]), 1.2, 1, 0, 6), P.lamp); } // singed stubs on the far side
  V.puff(f, z([356, 612]), 40, 8, { drift: 12, op: 0.36 });
  // the snare: a wire drawn tight round the neck, its broken end and the wooden peg trailing down to the ice
  f.bone('snare');
  const sn = Z([[268, 616], [282, 628], [300, 634], [314, 632]]);
  f.line(sn, 2.6, INK); f.line(sn, 1.4, P.greyL);
  const tr = Z([[272, 618], [262, 650], [254, 700], [244, 740], [238, 772]]);
  f.line(tr, 2.4, INK); f.line(tr, 1.2, P.greyL);
  const pg = z([238, 772]); f.part([add(pg, [-3, 0]), add(pg, [3, 0]), add(pg, [2, 18]), add(pg, [0, 22, 1]), add(pg, [-2, 18])], { fill: P.woodL, shadow: P.woodD, shade: 0.4, inkW: 1, cast: false });
  // ---- ears: tall, straight up, the cracks widest along them, black tips, the near ear notched
  const ear = (bone, base, tip, w, notch, look) => {
    f.bone(bone);
    const d = E.norm(sub(tip, base)), n = [-d[1], d[0]], L = E.len(sub(tip, base));
    const pts = [add(base, mul(n, -w * 0.45)), add(add(base, mul(d, L * 0.45)), mul(n, -w * 0.55)), add(add(base, mul(d, L * 0.85)), mul(n, -w * 0.4)), tip, add(add(base, mul(d, L * 0.8)), mul(n, w * 0.42)), ...(notch ? [add(add(base, mul(d, L * 0.6)), mul(n, w * 0.5)), add(add(base, mul(d, L * 0.56)), mul(n, w * 0.18)), add(add(base, mul(d, L * 0.52)), mul(n, w * 0.5))] : []), add(add(base, mul(d, L * 0.4)), mul(n, w * 0.55)), add(base, mul(n, w * 0.45))];
    const dd = f.part(pts, look);
    V.clipDraw(f, dd, () => { f.flat([add(add(base, mul(d, L * 0.15)), mul(n, -w * 0.12)), add(add(base, mul(d, L * 0.75)), mul(n, -w * 0.1)), add(add(base, mul(d, L * 0.7)), mul(n, w * 0.2)), add(add(base, mul(d, L * 0.15)), mul(n, w * 0.2))], '#6a4a48', { op: 0.35 }); f.flat([add(add(base, mul(d, L * 0.8)), mul(n, -w)), add(add(base, mul(d, L * 0.8)), mul(n, w)), add(tip, mul(d, 6))], '#141214'); });
    V.crazing(f, dd, E.bbox(pts), 9 * k, 0.28, { wide: () => 1.5, rot: 1.2 });
  };
  ear('ear_f', z([296, 580]), z([300, 470]), 22 * k, false, FURD);
  ear('ear_n', z([284, 582]), z([266, 474]), 24 * k, true, FURW);
  f.bone('root');
  f.flat(ell(z([260, 792]), 70, 5, 0, 14), P.iceS, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ PIT ADDER (cast, small 0.45 reared)
// The largest adder of the jarl's snake pit: heavy, short-tailed, three tight coils on the ice with the front third
// raised in an S and the head drawn back to strike. The body tapers from a thick neck behind the broad head through the
// heavy coils to a short tail; overlapping keeled scales all over, a black zigzag down the back.
// Split: a spiral that follows the coils. Wherever the coils lay pressed on the warm rock of the pit (the bottom coil
// almost wholly, the middle coil along its underside) the scales are charred black and split along the zigzag into
// glowing seams; every outward face, the top coil and the raised neck are rimed white, the scales frozen up into stiff
// faceted plates. The crack climbs the coil, so the pile reads as a twist of white and burning black.
// Rig: coil (root) > neck_1 > neck_2 > neck_3 > head > jaw. Motion: tongue flick and neck sway; the strike unrolls the S.
function pitAdder() {
  const [CW, CH] = TIERS.small;
  const f = new Fig(V.base(829, CH, { grimeY: 720 })); V.texturesB(f);
  const gy = f.o.groundY;
  const T3 = 5 * Math.PI, cx = 262; // (review) two and a half turns, seen a little from above
  // the coil spiral, outer (tail) to inner (top); front half where sin > 0
  // (review) the coils are not a spring: each turn wanders (its centre drifts, its radius, flattening and tilt change),
  // so the loops lie on one another unevenly, the way a heavy snake settles into a knot
  const sp = t => { const u = t / T3, rx = 128 - u * 80 + 7 * Math.sin(t * 0.83 + 0.5), ry = rx * (0.46 + 0.05 * Math.sin(t * 0.61 + 1.2)), yc = gy - 40 - u * 74 + 4 * Math.sin(t * 0.47), c0 = cx + 12 * Math.sin(t * 0.37 + 0.9), tl = 0.08 * Math.sin(t * 0.29 + 0.4); const q = [rx * Math.cos(t + 0.4 + Math.PI), ry * Math.sin(t + 0.4 + Math.PI)]; /* the tail starts behind the pile; the top coil ends at the front right, where the neck rises */ return [c0 + q[0] * Math.cos(tl) - q[1] * Math.sin(tl), yc + q[0] * Math.sin(tl) + q[1] * Math.cos(tl)]; };
  const W = t => { const u = t / T3; return t < 2.2 ? 5 + ((t + 1.3) / 3.5) * 41 : 46 + Math.sin(u * Math.PI) * 10; }; // from the tail tip (t -1.3) to the heavy middle coils
  const neckC = V.spline([sp(T3), [cx + 92, gy - 150], [cx + 98, gy - 206], [cx + 64, gy - 244], [cx + 54, gy - 276], [cx + 80, gy - 296]], 4);
  const NW = i => { const u = i / (neckC.length - 1); return 58 - u * 30 + Math.sin(u * Math.PI) * 4; };
  const SCI = { fill: '#c6ced2', shadow: '#4a5468', light: '#f2f6f6', shade: 0.42, tex: 'scales829', texOp: 0.7, maxShade: 26 };
  const SCC = { fill: '#3a2e2a', shadow: P.charS, light: '#6a564a', shade: 0.42, tex: 'scales829', texOp: 0.8, maxShade: 26 };
  const ribbon = (C, wf) => [...V.offsetLine(C, t => wf(t) / 2), ...V.offsetLine(C, t => -wf(t) / 2).reverse()];
  // one half-turn of coil as a ribbon, split along its length: char below the line, ice above. ice: 0..1 where the
  // line sits (0 = at the top edge, so the band is nearly all char; 1 = at the bottom edge, nearly all ice)
  const zig = (C, wf, hot) => { const z = []; for (let i = 0; i < C.length; i += 2) { const a = C[i], b = C[Math.min(C.length - 1, i + 1)], d = E.norm(sub(b, a)), n = [-d[1], d[0]], up = n[1] < 0 ? n : mul(n, -1); z.push(add(a, mul(up, wf(i / (C.length - 1)) * ((i / 2) % 2 ? 0.08 : 0.3)))); } if (hot) { V.glowLine(f, z, 8, P.lamp, 0.4); V.seam(f, z, 2.2, { glow: false }); } else { f.line(z, 7, '#141216'); f.line(z, 2, '#3a3a44', { op: 0.6 }); } };
  const coil = (t0, t1, iceK) => {
    const C = []; for (let t = t0; t <= t1 + 1e-6; t += 0.08) C.push(sp(t));
    const wf = q => W(t0 + (t1 - t0) * q);
    const pts = ribbon(C, wf);
    const L = C.map((q, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], d = E.norm(sub(b, a)), n = [-d[1], d[0]], up = n[1] < 0 ? n : mul(n, -1); return add(q, mul(up, wf(i / (C.length - 1)) * (0.5 - iceK) * 0.9)); });
    const ext = (a, b) => add(a, mul(E.norm(sub(a, b)), 40));
    const Sp = V.splitLine(f, [ext(L[0], L[1]), ...V.jag(f, L, 4, 9).slice(1, -1), ext(L[L.length - 1], L[L.length - 2])], [0, -1], 0, 9);
    const d = V.thermal(f, pts, Sp, SCI, SCC, { riftW: 2, nFacets: 3, fs: 0.6, nEmbers: 3, faint: true });
    V.clipDraw(f, d, () => { V.clipDraw(f, V.halfRegion(Sp.line, Sp.ice), () => zig(C, wf, false)); V.clipDraw(f, V.halfRegion(Sp.line, -Sp.ice), () => zig(C, wf, true)); f.raw(`<path d="${E.smooth(ribbon(C.map(q => add(q, [0, 10])), q => wf(q) * 0.7))}" fill="#000" opacity="0.18" filter="url(#smk829)"/>`); });
    return { C, d };
  };
  f.joint('coil', [cx, gy - 60]);
  const NP = i => neckC[Math.max(0, Math.min(neckC.length - 1, Math.round(i)))], nn = neckC.length - 1;
  f.joint('neck_1', NP(nn * 0.12), 'coil').joint('neck_2', NP(nn * 0.4), 'neck_1').joint('neck_3', NP(nn * 0.68), 'neck_2').joint('head', NP(nn), 'neck_3');
  const HC = add(NP(nn), [30, 0]), hA = 0.12, HF = frame(HC, hA, 1.22);
  f.joint('jaw', HF([[-22, 6]])[0], 'head');

  f.bone('coil');
  // backs of the coils, bottom to top; then the fronts, bottom to top (each coil sits on the one below)
  const halves = []; for (let k = 0; k < 3; k++) { const a = k * 2 * Math.PI; halves.push([a - 0.4, a + Math.PI - 0.4, 'back', k], [a + Math.PI - 0.4, a + 2 * Math.PI - 0.4, 'front', k]); } halves.unshift([-1.3, -0.4, 'front', 0]); // the short tail lying out on the ice in front
  const iceOf = k => [0.08, 0.45, 0.85][k];
  for (const [a, b, side, k] of halves.filter(h => h[2] === 'back' && h[0] < T3)) coil(Math.max(-1.3, a), Math.min(T3, b), iceOf(k));
  // the half-shed skin, frozen stiff, hanging off the lowest coil's front
  const fr = []; for (const [a, b, side, k] of halves.filter(h => h[2] === 'front' && h[0] < T3 - 0.5)) { if (k > 0) { const C = []; for (let t = Math.max(-1.3, a); t <= Math.min(T3, b); t += 0.1) C.push(add(sp(t), [-6, 16])); f.raw(`<path d="${E.smooth(ribbon(C, q => W(a + (b - a) * q) * 0.9))}" fill="#000" opacity="0.45" filter="url(#mblurS829)"/>`); } fr.push(coil(Math.max(-1.3, a), Math.min(T3, b), iceOf(k))); } // each coil throws its shadow on the one under it
  const sk0 = sp(4.3);
  const shed = [add(sk0, [-20, 4]), add(sk0, [18, 8]), add(sk0, [28, 22]), add(sk0, [20, 30]), add(sk0, [8, 26]), add(sk0, [-4, 34]), add(sk0, [-16, 22])].map(q => [q[0], Math.min(gy - 1, q[1])]);
  f.part(shed, { fill: '#d8d6cc', shadow: '#7a7a74', shade: 0.35, tex: 'scales829', texOp: 0.45, inkW: 1.1, cast: false, hatch: false });
  f.line([add(sk0, [-10, 12]), add(sk0, [14, 18])], 0.8, INK, { op: 0.5 }); V.icicles(f, [add(sk0, [-6, 30]), add(sk0, [12, 28])], 2, 5, 9);
  // a finger bone from the pit, caught between the coils
  const fb = add(sp(3 * Math.PI + 0.6), [0, -18]);
  f.part(limb(fb, add(fb, [26, -6]), 7, 6, { steps: 4 }), { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 1, cast: false });
  f.flat(ell(add(fb, [26, -6]), 4, 3.4, 0, 8), P.bone);
  // ash flaking off the tail tip, steam off the seams
  V.ash(f, sp(-1.2), 6, 20, 40, 0.7);
  for (const t of [3.5, 10.6]) V.puff(f, add(sp(t), [0, -14]), 70, 14, { op: 0.28, phase: t });

  // ---- the raised neck in an S, rimed, its scales frozen into stiff faceted plates; the jarl's arm ring grown through
  const neckPts = ribbon(neckC, q => NW(q * nn));
  const cuts = [0.12, 0.4, 0.68].map(t => { const i = Math.round(nn * t), d = E.norm(sub(NP(i + 1), NP(i - 1))); return [NP(i), d]; });
  const r0 = 30;
  V.split(f, () => {
    const d = V.iced(f, neckPts, SCI, { nFacets: 6, fs: 0.6 });
    V.clipDraw(f, d, () => {
      const zz = []; for (let i = 0; i <= nn; i += 2) { const a = NP(i - 1), b = NP(i + 1), dd = E.norm(sub(b, a)), n2 = [-dd[1], dd[0]]; zz.push(add(NP(i), mul(n2, NW(i) * ((i / 2) % 2 ? -0.05 : 0.22) * -1))); }
      f.line(zz, 7, '#141216'); f.line(zz, 2, '#3a3a44', { op: 0.6 });
      for (let i = 3; i < nn - 2; i += 3) { const q = V.offsetLine(neckC, t => (f.r() - 0.5) * NW(t * nn) * 0.5)[i]; f.part([add(q, [-4, -3]), add(q, [3, -5]), add(q, [5, 2]), add(q, [-3, 3])].map(z2 => [...z2, 1]), { fill: '#e2e8ea', shadow: '#5a6274', light: '#ffffff', shade: 0.35, inkW: 0.9, cast: false, hatch: false }); } // frozen scale plates standing up
      const bp = NP(Math.round(nn * 0.5)); f.flat([add(bp, [-6, -6]), add(bp, [8, -4]), add(bp, [4, 6])], '#3a3a44'); f.line([add(bp, [-6, -6]), add(bp, [4, 6])], 1, P.iceL); // a broken scale plate
      f.raw(`<path d="${E.smooth(ribbon(neckC.map(q => add(q, [6, 0])), q => NW(q * nn) * 0.5))}" fill="#000" opacity="0.15" filter="url(#smk829)"/>`);
    });
    V.rimeCrust(f, V.offsetLine(neckC, t => NW(t * nn) * 0.46).slice(2, -3), 4, [-1, -0.3], { gap: 6 });
  }, [['coil', V.side(cuts[0][0], mul(cuts[0][1], -1), r0)], ['neck_1', [V.side(cuts[0][0], cuts[0][1], r0), V.side(cuts[1][0], mul(cuts[1][1], -1), r0)]], ['neck_2', [V.side(cuts[1][0], cuts[1][1], r0), V.side(cuts[2][0], mul(cuts[2][1], -1), r0)]], ['neck_3', V.side(cuts[2][0], cuts[2][1], r0)]]);
  // the arm ring the snake grew through, behind the head: iron, the flesh bulging round it
  f.bone('neck_3');
  const ri = Math.round(nn * 0.86), rq = NP(ri), rd = E.norm(sub(NP(ri + 1), NP(ri - 1))), ra = Math.atan2(rd[1], rd[0]);
  const ringE = ell(rq, 9, NW(ri) * 0.62, ra, 16);
  f.line(ringE.slice(4, 13), 9, INK); f.line(ringE.slice(4, 13), 6, P.ironL); f.line(ringE.slice(6, 10), 1.6, P.greyL, { op: 0.8 });
  f.line([add(rq, rot([-12, -NW(ri) * 0.5], ra)), add(rq, rot([-12, NW(ri) * 0.5], ra))], 2, '#4a5468', { op: 0.5 }); f.line([add(rq, rot([12, -NW(ri) * 0.5], ra)), add(rq, rot([12, NW(ri) * 0.5], ra))], 2, '#4a5468', { op: 0.5 });

  // ---- the head: broad, flat and heavy-browed, drawn back; the mouth half open on the fangs, the tongue out
  f.bone('jaw');
  const jaw = HF([[-30, 2], [0, 8], [30, 14], [42, 20], [34, 24], [0, 22], [-28, 16]]);
  f.part(jaw, Object.assign({}, SCI, { tex: 'scales829', texOp: 0.5 }));
  f.part(HF([[30, 14], [36, 6], [38, 16]]), { fill: P.bone, shade: 0.3, inkW: 0.9, cast: false }); // lower fang tip
  f.bone('head');
  f.flat(HF([[-24, 0], [10, 4], [38, 8], [36, 14], [8, 12], [-22, 8]]), '#2a0a0a'); // the gape
  const head = HF([[-40, -8], [-32, -22], [-6, -26], [24, -20], [44, -12], [52, -2], [46, 6], [20, 4], [-10, 2], [-34, 8]]);
  const dh = V.iced(f, head, SCI, { nFacets: 3, fs: 0.5 });
  V.clipDraw(f, dh, () => { f.line(HF([[-30, -14], [-10, -10], [10, -16], [30, -12]]), 5, '#141216'); f.line(HF([[-6, -24], [6, -10], [20, -20]]), 1, INK, { op: 0.6 }); });
  // (review) the brow: the heavy supraocular scales standing over the eye as a ridge, the small scales of the crown
  // between them, a row of lip scales, and the adder's dark stripe running back from the eye
  for (const [u0, w0] of [[6, 12], [17, 13], [29, 11]]) { const q = HF([[u0, -21]])[0]; f.part(HF([[u0 - w0 / 2, -18], [u0 - w0 / 2 + 2, -25], [u0 + w0 / 2, -24], [u0 + w0 / 2 + 1, -17]]).map(z => [...z, 1]), { fill: '#a8b2b8', shadow: '#3a4250', light: '#f2f6f6', shade: 0.4, inkW: 1.1, cast: false, hatch: false, maxShade: 6 }); }
  for (let i = 0; i < 6; i++) f.line(HF([[-26 + i * 6, -24 + (i % 2) * 3], [-22 + i * 6, -19 + (i % 2) * 3]]), 0.9, INK, { op: 0.6 });
  f.stroke(HF([[26, -11], [8, -6], [-14, -2], [-36, 2]]), 6, '#1a1a20', { op: 0.8 }); // the dark stripe from the eye back to the jaw's angle
  for (let i = 0; i < 6; i++) f.line(HF([[42 - i * 9, 4], [40 - i * 9, 8]]), 1, INK, { op: 0.55 }); // lip scales
  V.animalEye(f, HF([[22, -13]])[0], 6, hA, { frost: true });
  f.flat(ell(HF([[46, -4]])[0], 1.8, 1.4, hA, 6), '#000'); // nostril
  // fangs: one whole, one chipped short
  f.part(HF([[30, 4], [36, 4], [33, 18]]), { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 0.9, cast: false });
  f.part(HF([[20, 3], [26, 3], [24, 10], [21, 9]]), { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 0.9, cast: false });
  // forked tongue out, frost on the fork
  const tg = HF([[40, 12], [58, 12], [72, 8]]);
  f.line(tg, 3.4, INK); f.line(tg, 2, '#4a2a2e');
  for (const dy of [-6, 6]) { const tip = HF([[84, 8 + dy]])[0]; f.line([tg[2], tip], 2.6, INK); f.line([tg[2], tip], 1.4, '#4a2a2e'); f.flat(ell(tip, 2, 1.6, 0, 6), P.rime); }
  V.rimeCrust(f, HF([[-34, -20], [-6, -26], [24, -20]]), 4, [-1, -0.3], { gap: 5 });
  f.bone('root');
  f.flat(ell([cx, gy + 2], 150, 7, 0, 18), P.charS, { op: 0.4 });
  V.glow(f, [cx, gy - 6], 120, 16, P.lamp, 0.3);
  return f;
}

// ------------------------------------------------------------------ GLACIER WOLVERINE (cast, small, 0.5 tall, 1.0 long)
// A scavenger of the glacier, thick-set and short-legged like a small bear: low and humped, the back arched highest
// over the loin, the forequarters heavy, the legs short and splayed on broad, flat-footed paws with big hooked claws,
// the broad head swung low under the line of the back with the jaws open on heavy teeth, a strip of miner's leather in
// them. Small dark eyes under the brow; a torn ear.
// Split: front to back. The head and forelegs, which it put into a vent to feed, are charred black with glowing seams,
// the fur singed to the skin; from the shoulders back it is rimed white, the long shaggy fur frozen into clumps, the
// pale side stripe hung with icicled tags, the bushy tail stiff with ice. The crack rings the shoulders like a collar.
// Rig: spine_1 (hips, root) > spine_2 > neck > head > jaw; tail; legs leg_[f|h][n|f]_1..3.
function glacierWolverine() {
  const CW = 820, CH = 820;
  const f = new Fig(V.base(830, CH, { grimeY: 700 })); V.texturesB(f);
  const gy = f.o.groundY;
  const FURI = { fill: '#b6bcc0', shadow: '#40465a', light: '#eef2f4', shade: 0.4, tex: 'fur830', texOp: 0.8, maxShade: 34 };
  const FURC = { fill: '#3a302c', shadow: P.charS, light: '#6a5648', shade: 0.4, tex: 'craze830', texOp: 0.7, maxShade: 30 };
  const collar = [[476, 430], [462, 520], [470, 580], [452, 640], [466, 700], [456, 800]];
  const Sp = V.splitLine(f, collar, [-1, 0], 8, 12);
  const LEG = {
    fn: { H: [474, 600], K: [454, 690], A: [474, 752], T: [492, gy] },
    ff: { H: [500, 596], K: [500, 684], A: [528, 748], T: [548, gy] },
    hn: { H: [196, 600], K: [246, 676], A: [198, 742], T: [218, gy] },
    hf: { H: [222, 596], K: [278, 668], A: [244, 738], T: [270, gy] },
  };
  const NK = [520, 560], HC = [604, 642], hA = 0.36, HF = frame(HC, hA, 1);
  f.joint('spine_1', [220, 580]).joint('spine_2', [360, 560], 'spine_1').joint('neck', NK, 'spine_2').joint('head', [580, 620], 'neck').joint('jaw', HF([[-30, 18]])[0], 'head').joint('tail', [118, 600], 'spine_1');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.H, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`);
  const both = (pts, o = {}) => V.thermal(f, pts, Sp, o.iceL || FURI, o.charL || FURC, Object.assign({ riftW: 2.6, nFacets: 2, nEmbers: 4, charAfter: () => { const bb = E.bbox(pts); V.crackNet(f, [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], f.r() * 6.3, 40, 1.8, { depth: 1 }); } }, o));
  const GP = ['#8e969c', '#a6aeb4', '#767e86', '#bcc4c8'];
  const groove = (pts, w = 2.6, op = 0.5) => f.stroke(pts, w, '#12100e', { op });
  // a leg: three thick segments, plantigrade-flat paw with five hooked claws
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.3 : 0;
    const iL = Object.assign({}, FURI, { fill: mix(FURI.fill, '#000', tone) }), cL = Object.assign({}, FURC, { fill: mix(FURC.fill, '#000', tone) });
    if (part & 1) { f.bone(`leg_${k}_1`); both(limb(L.H, L.K, front ? 92 : 104, 60, { steps: 10, capK: 0.9, p: [[0.5, 0.2, 0.2]], q: [[0.4, 0.15, 0.2]] }), { iceL: iL, charL: cL, nEmbers: 2, faint: true, riftW: 2 }); if (!far) V.hanks(f, [lp(L.H, L.K, 0.4, front ? -40 : 46), lp(L.H, L.K, 0.9, front ? -26 : 30)], 3, 14, 24, 9, { state: front ? 'singed' : 'ice', dir: [front ? 0.2 : -0.3, 1], strands: 3, gap: false, pal: front ? undefined : GP }); }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      both(limb(L.K, L.A, 60, 44, { steps: 10, capK: 0.9, q: [[0.3, 0.2, 0.2]] }), { iceL: iL, charL: cL, nEmbers: 2, faint: true, riftW: 2 });
      if (!front) groove([lp(L.K, L.A, 0.3, -14), lp(L.K, L.A, 0.9, -10)], 1.8, 0.5);
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T, X = u => T[0] + u * 40;
      const paw = [[X(-1.0), gy, 1], [X(-1.05), gy - 22], [X(-0.6), gy - 40], add(L.A, [-14, -6]), add(L.A, [16, -6]), [X(0.7), gy - 34], [X(1.1), gy - 14], [X(1.15), gy, 1]];
      both(paw, { iceL: iL, charL: cL, nEmbers: 2, rift: false });
      for (let i = 0; i < 5; i++) { const b = [X(0.45 + i * 0.16), gy - 16 + Math.abs(i - 2) * 2], c = [X(0.95 + i * 0.16), gy - 2]; if (k === 'fn' && i === 2) { f.part([b, add(b, [14, 2]), add(b, [8, 8])], { fill: P.boneD, shade: 0.3, inkW: 1, cast: false }); continue; } f.part([add(b, [-4, -4]), add(b, [4, -6]), [c[0] + 6, c[1] - 2], [c[0] + 4, c[1] + 1, 1], add(b, [2, 6])], { fill: '#d0c8b4', shadow: '#5a5446', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false }); } // big hooked claws, one broken
      for (let i = 1; i < 4; i++) f.line([[X(0.2 + i * 0.22), gy - 30], [X(0.3 + i * 0.22), gy - 6]], 1.2, INK, { op: 0.55 }); // toe divisions
      V.glow(f, [X(0.2), gy], 40, 6, P.lamp, front ? 0.35 : 0.0);
    }
  };
  leg('hf', true); leg('ff', true);
  // ---- tail: bushy, stiff with ice, carried low
  f.bone('tail');
  const tl = [[132, 590], [96, 610], [62, 650], [50, 690], [64, 708], [92, 690], [122, 650], [150, 624]];
  V.iced(f, tl, FURI, { nFacets: 2 });
  V.hanks(f, [[110, 620], [78, 650], [60, 690]], 6, 16, 30, 9, { state: 'ice', dir: [-0.3, 1], strands: 3, icicleK: 0.6, gap: false, pal: GP });
  // ---- body: humped over the loin, the forequarters heavy, the chest deep, the waist tucked; cut at the loin
  const body = [[110, 650], [116, 596], [160, 548], [232, 510], [310, 494], [380, 502], [440, 522], [500, 540], [548, 566], [560, 620], [540, 680], [500, 712], [440, 718], [380, 690], [330, 676], [280, 684], [230, 692], [170, 690]];
  V.split(f, () => {
    const d = both(body, { nEmbers: 6, nFacets: 5 });
    V.clipDraw(f, d, () => {
      f.raw(`<path d="${E.smooth([[300, 670], [400, 690], [520, 720], [540, 680], [420, 660]])}" fill="#000" opacity="0.4" filter="url(#smk830)"/>`); // the belly in shadow, tucked
      groove([[430, 530], [446, 590], [470, 640]], 3, 0.45); groove([[190, 560], [220, 610], [238, 660]], 3, 0.45); // shoulder blade, haunch
      // the pale side stripe from the shoulder to the rump
      f.flat([[170, 600], [260, 590], [360, 596], [440, 612], [440, 640], [360, 628], [260, 622], [176, 628]], '#e8ecee', { op: 0.5 });
    });
  }, [['spine_1', V.side([330, 600], [-1, 0], 0)], ['spine_2', V.side([330, 600], [1, 0], 50)]]);
  f.bone('spine_1');
  V.hanks(f, [[140, 680], [220, 690], [300, 678], [370, 690]], 24, 24, 40, 17, { state: 'ice', dir: [-0.15, 1], strands: 4, gap: false, pal: GP }); // the long frozen belly fringe
  V.hanks(f, [[180, 626], [260, 624], [340, 630]], 8, 16, 26, 9, { state: 'ice', dir: [-0.2, 1], strands: 3, icicleK: 0.8, gap: false, pal: ['#c8d0d4', '#dde2e4', '#a8b0b6', '#e8ecee'] }); // the pale stripe in icicled tags
  V.rimeCrust(f, [[116, 596], [160, 548], [232, 510], [310, 494]], 7, [-1, -0.3], { gap: 9, feather: 0.6 });
  for (let i = 0; i < 34; i++) { const q = V.scatter(f, [290, 590], 160, 70); V.hairClump(f, [q, add(q, [-6, 14]), add(q, [-8, 30])], 15, { pal: ['#a2aab0', '#b6bcc0', '#8a9298', '#c8cfd2'], n: 4, gap: false }); } // frozen fur clumps over the flank
  V.hanks(f, [[140, 570], [220, 520], [300, 500]], 12, 16, 28, 15, { state: 'ice', dir: [-1, -0.2], strands: 3, sway: 0.4, gap: false, pal: GP }); // shag standing off the rump
  f.bone('spine_2');
  V.rimeCrust(f, [[310, 494], [380, 502], [440, 522]], 7, [-1, -0.3], { gap: 9, feather: 0.6 });
  V.hanks(f, [[370, 704], [420, 712], [446, 716]], 4, 22, 36, 12, { state: 'ice', dir: [0, 1], strands: 3, gap: false, pal: GP });
  V.hanks(f, [[476, 714], [520, 706]], 3, 12, 18, 10, { state: 'singed', dir: [0, 1], strands: 2 });
  V.puff(f, [470, 540], 60, 14, { op: 0.28 });
  leg('hn', false, 1); leg('fn', false, 1);
  // ---- neck and head: broad and low, small ears (one torn), the jaws open on heavy teeth, leather in them; all burnt
  f.bone('neck');
  const neck = [[470, 526], [530, 540], [580, 580], [610, 620], [590, 676], [540, 690], [500, 660], [480, 600]];
  V.burnt(f, neck, FURC, { seams: 2 });
  V.hanks(f, [[540, 686], [580, 676]], 3, 10, 18, 9, { state: 'singed', dir: [0, 1], strands: 2 });
  f.bone('jaw');
  const jR = pts => pts.map(([u, v]) => { const q = rot([u + 30, v - 18], 0.28); return [q[0] - 30, q[1] + 18]; });
  const jaw = HF(jR([[-34, 14], [6, 22], [40, 24], [54, 26], [52, 36], [24, 42], [-24, 40]]));
  V.burnt(f, jaw, FURC, { seams: 1 });
  for (const [u, l] of [[48, 12], [36, 8], [26, 7], [16, 7]]) { const q = HF(jR([[u, 24]]))[0]; f.part([add(q, rot([-3.5, 0], hA)), add(q, rot([3.5, 0], hA)), add(q, rot([0, -l], hA))], { fill: '#d8d0bc', shade: 0.3, inkW: 0.9, cast: false }); }
  f.bone('head');
  f.flat(HF([[-24, 10], [26, 16], [54, 18], ...jR([[54, 26], [26, 24], [-20, 18]])]), '#2a0a06'); // the gape
  V.glow(f, HF([[30, 20]])[0], 20, 8, P.lamp, 0.4, false, hA);
  const skull = HF([[-52, -4], [-48, -32], [-22, -48], [8, -46], [32, -34], [50, -24], [62, -12], [64, 4], [54, 14], [30, 16], [6, 16], [-22, 20], [-48, 14]]);
  V.burnt(f, skull, FURC, { seams: 2, after: () => f.raw(`<path d="${E.smooth(HF([[-30, -20], [10, -30], [20, 0], [-20, 6]]))}" fill="#ffffff" opacity="0.08" filter="url(#smk830)"/>`) });
  V.animalEye(f, HF([[22, -18]])[0], 7, hA, { ember: true });
  f.part(HF([[56, -14], [66, -8], [68, 4], [58, 6]]), { fill: '#141012', shade: 0.3, inkW: 1, cast: false }); // nose
  for (const [u, l] of [[52, 13], [40, 8], [30, 7]]) { const q = HF([[u, 15]])[0]; f.part([add(q, rot([-3.5, 0], hA)), add(q, rot([3.5, 0], hA)), add(q, rot([0, l], hA))], { fill: '#d8d0bc', shade: 0.3, inkW: 0.9, cast: false }); }
  // ears: small, round, one torn
  f.part(HF([[-36, -32], [-50, -50], [-34, -56], [-20, -42]]), FURC);
  f.part(HF([[-18, -38], [-26, -56], [-12, -60], [-8, -50], [-4, -54], [0, -40]]), FURC); f.line(HF([[-10, -52], [-6, -46]]), 1.2, INK);
  // the strip of miner's leather in the jaws, hanging
  const ls = HF([[34, 20]])[0];
  f.part([add(ls, [-12, -4]), add(ls, [12, -2]), add(ls, [16, 20]), add(ls, [8, 38]), add(ls, [-4, 34]), add(ls, [-10, 16])], Object.assign(V.charred(V.LEA(f), 0.3), { inkW: 1.2 }));
  f.stitches([add(ls, [2, 4]), add(ls, [4, 30])], '#a89a80', 0.8); f.rivet(add(ls, [2, 18]), 2);
  V.ash(f, HF([[64, -10]])[0], 8, 20, 60, 0.8); V.puff(f, HF([[58, 24]])[0], 60, 14, { drift: 14, op: 0.34 });
  leg('hn', false, 6); leg('fn', false, 6);
  f.bone('root');
  for (const L of Object.values(LEG)) f.flat(ell(add(L.T, [10, 0]), 46, 5, 0, 12), P.iceS, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ MUSK OX (elite, 1.8 at the hump, 2.4 long)
// A bull musk ox of the glacier herds, yoked by the hold to haul ore sledges: a massive humped bulk braced on four
// short, thick legs, the weight in the shoulders and the hump, the head carried low with the horn boss forward, the
// horns sweeping down past the small eyes and hooking up at the tips.
// Split: lengthwise along the flank. Above the line the back and hump are frozen, the long guard hair stiffened into a
// curtain of icicled tags and rime; below it the hair is burned away, and the belly, legs and hooves are charred black,
// the hide split in molten seams where it stood over a vent. The crack runs the length of the body where the burnt
// hair ends; steam rolls out from under the frozen curtain.
// True size wins over the elite canvas (GUIDE 2): the canvas is widened to 1700 so the 2.4-long body fits at scale.
// Rig: spine_1 (hips, root) > spine_2 (shoulders) > neck > head; tail; yoke (neck) > chain; trace (spine_1);
// legs leg_[f|h][n|f]_1..3.
function muskOx() {
  // (independent review) rebuilt: the hump now rises over the withers; the coat is three tiers of heavy, uneven hanks
  // of guard hair (V.hank: different widths and lengths, swinging, split tips, ice-clotted) with the woolly underlayer
  // showing as a pale saddle on the hump; the head is a musk ox's: a long face held low, a pale muzzle, a heavy boss
  // over the brow, the horn sweeping down past the eye and hooking up; short thick legs on broad cloven hooves.
  const CW = 1700, CH = 1400;
  const f = new Fig(V.base(823, CH, { grimeY: 1150 })); V.texturesB(f);
  const gy = f.o.groundY;
  const HIDE = { fill: '#2e2624', shadow: '#080505', light: '#5e4e46', shade: 0.4, tex: 'craze823', texOp: 0.7, maxShade: 60 };
  const COAT = { fill: '#8e9294', shadow: '#363a46', light: '#e4e8ea', shade: 0.4, tex: 'fur823', texOp: 0.8, maxShade: 80 };
  const GP = ['#9a9ea2', '#b0b4b6', '#868a90', '#c4c8ca', '#a29e96', '#7c8086'];
  const hemY = x => 1010 + Math.sin(x * 0.011) * 22 - (x > 1150 ? (x - 1150) * 0.5 : 0) - (x < 300 ? (300 - x) * 0.6 : 0);
  const splitCtl = []; for (let x = 60; x <= 1360; x += 70) splitCtl.push([x, hemY(x)]);
  const Sp = V.splitLine(f, splitCtl, [0, -1], 8, 12);
  const LEG = {
    fn: { H: [1110, 1010], K: [1100, 1190], A: [1112, 1298], T: [1128, gy] },
    ff: { H: [1190, 1000], K: [1204, 1182], A: [1220, 1294], T: [1238, gy] },
    hn: { H: [380, 1000], K: [318, 1170], A: [330, 1296], T: [346, gy] },
    hf: { H: [460, 1000], K: [400, 1160], A: [414, 1292], T: [432, gy] },
  };
  const NK = [1240, 640], HC = [1450, 1010], hA = 0.95, HF = frame(HC, hA, 1);
  f.joint('spine_1', [420, 700]).joint('spine_2', [880, 640], 'spine_1').joint('neck', NK, 'spine_2').joint('head', [1380, 880], 'neck').joint('tail', [170, 520], 'spine_1');
  f.joint('yoke', [1300, 690], 'neck').joint('chain', [1230, 660], 'yoke').joint('trace', [200, 840], 'spine_1');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.H, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`);
  const groove = (pts, w = 4, op = 0.5) => f.stroke(pts, w, '#0a0606', { op });
  // a leg: a column-thick forearm or gaskin, a knee or hock, a short cannon, the fetlock, a broad split cloven hoof
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.35 : 0, look = Object.assign({}, HIDE, { fill: mix(HIDE.fill, '#000', tone) });
    if (part & 1) { f.bone(`leg_${k}_1`); V.burnt(f, limb(L.H, L.K, front ? 176 : 196, 110, { steps: 12, capK: 0.9, p: [[0.3, 0.18, 0.2]], q: [[0.35, 0.2, 0.22]] }), look, { seams: 2, seamW: 2.4 }); groove([lp(L.H, L.K, 0.2, front ? 40 : -44), lp(L.H, L.K, 0.8, front ? 30 : -30)], 4, 0.45); }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      V.burnt(f, limb(lerp(L.K, L.H, 0.12), L.A, 112, 76, { steps: 10, capK: 0.9, p: [[0.12, 0.2, 0.1]], q: [[0.14, 0.16, 0.1]] }), look, { seams: 1, seamW: 2, after: () => V.mass(f, ell(L.K, 46, 36, V.ang(L.K, L.A), 12), { s: 14, op: 0.5, hiOp: 0.12, sharp: true }) });
      V.seam(f, [lp(L.K, L.A, 0.3, 10), lp(L.K, L.A, 0.6, -6), lp(L.K, L.A, 0.85, 8)], 2.2);
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T;
      V.burnt(f, K.chain([lerp(L.A, L.K, 0.12), L.A, [T[0] - 6, gy - 66]], [78, 74, 80], { bq: [[1, 0.6, 0.18]] }), look, { seams: 1 }); // the fetlock swelling over the hoof
      // the cloven hoof seen from the side: a far claw behind, the near claw in front, each a broad wedge with a
      // rounded toe, a heel bulb and a worn sole; the cleft glows; a dewclaw behind the fetlock
      const claw = (dx, c0, c1) => { const X = T[0] + dx; const h = [[X - 46, gy - 44], [X - 20, gy - 66], [X + 26, gy - 60], [X + 52, gy - 26], [X + 58, gy, 1], [X - 40, gy, 1], [X - 54, gy - 18]]; const d = f.part(h, { fill: c0, shadow: '#000', light: c1, shade: 0.4, inkW: 1.5, tex: 'craze823', texOp: 0.7, maxShade: 20 }); V.clipDraw(f, d, () => { f.line([[X - 30, gy - 50], [X + 10, gy - 46], [X + 40, gy - 22]], 1.2, INK, { op: 0.5 }); f.line([[X - 34, gy - 36], [X + 8, gy - 32], [X + 36, gy - 10]], 1.1, INK, { op: 0.4 }); f.flat([[X - 54, gy - 8], [X + 58, gy - 8], [X + 58, gy], [X - 54, gy]], '#0a0606', { op: 0.6 }); }); f.flat(ell([X - 40, gy - 30], 12, 14, 0, 10), '#2a1e1c', { op: 0.8 }); return d; };
      claw(26, '#140e0e', '#3a302c');
      V.seam(f, [[T[0] - 2, gy - 58], [T[0] + 6, gy - 30], [T[0] + 2, gy - 4]], 1.8);
      claw(-14, '#1e1716', '#54463e');
      f.part([[T[0] - 70, gy - 92], [T[0] - 56, gy - 102], [T[0] - 48, gy - 78], [T[0] - 62, gy - 70]], { fill: '#1a1414', shade: 0.3, inkW: 1.1, cast: false }); // dewclaw
      V.glow(f, [T[0], gy], 70, 8, P.lamp, 0.4);
    }
  };
  leg('hf', true); leg('ff', true);
  // ---- the length of sledge trace dragging behind: a frayed leather strap and a hooked iron end on the ice
  f.bone('trace');
  const tr = [[300, 1060], [280, 1250], [240, gy - 10], [120, gy - 8], [30, gy - 6]];
  f.part([...V.offsetLine(V.spline(tr, 8), () => 10), ...V.offsetLine(V.spline(tr, 8), () => -10).reverse()], Object.assign(V.rimed(V.LEA(f), 0.2), { inkW: 1.4 }));
  f.line([[30, gy - 6], [6, gy - 16], [0, gy - 4]], 2, '#8a7a64'); f.line([[30, gy - 6], [8, gy + 2]], 1.4, '#8a7a64'); // the frayed end
  V.rimeCrust(f, [[280, 1250], [240, gy - 10], [120, gy - 8]], 5, [-1, -0.3], { gap: 6 });
  // ---- tail: short, lost in the coat
  f.bone('tail');
  V.hank(f, [[180, 520], [160, 570], [150, 640]], 44, { look: Object.assign({}, COAT, { fill: GP[0] }), ice: true });
  // ---- the body: the hump high over the withers, the back falling to a rounded rump, the chest deep, the belly low
  const body = [[150, 780], [150, 650], [190, 566], [270, 506], [420, 470], [600, 420], [780, 332], [920, 236], [1020, 186], [1110, 200], [1190, 290], [1260, 450], [1310, 640], [1320, 830], [1280, 1020], [1150, 1080], [960, 1090], [720, 1070], [520, 1080], [380, 1060], [240, 1010], [160, 880]];
  V.split(f, () => {
    const d = V.thermal(f, body, Sp, COAT, HIDE, { riftW: 4, nFacets: 6, nEmbers: 14, charAfter: () => { V.crackNet(f, [700, 1010], 0.2, 200, 3, { depth: 2 }); V.crackNet(f, [1120, 1000], 2.8, 160, 3, { depth: 2 }); V.crackNet(f, [380, 990], -0.3, 140, 2.6, { depth: 1 }); } });
    V.clipDraw(f, d, () => {
      f.raw(`<path d="${E.smooth([[400, 990], [800, 1030], [1250, 1000], [1200, 960], [700, 980]])}" fill="#000" opacity="0.4" filter="url(#smkL823)"/>`);
      for (let i = 0; i < 5; i++) groove([[780 + i * 70, 1010], [800 + i * 66, 1040], [790 + i * 60, 1070]], 4, 0.4); // ribs under the burnt belly hide
      for (let i = 0; i < 3; i++) { f.stroke([[1150 + i * 24, 1000 + i * 12], [1200 + i * 20, 1030 + i * 6], [1250 + i * 10, 1010 + i * 10]], 6, '#6a5a52', { op: 0.75 }); f.line([[1150 + i * 24, 1000 + i * 12], [1200 + i * 20, 1030 + i * 6], [1250 + i * 10, 1010 + i * 10]], 1.2, '#1a0e0c'); } // old gore scars on the shoulder
    });
  }, [['spine_1', V.side([760, 700], [-1, 0], 0)], ['spine_2', V.side([760, 700], [1, 0], 80)]]);
  leg('hn', false, 1); leg('fn', false, 1);
  // ---- the woolly underlayer, showing as a pale saddle where the guard hair parts over the hump
  f.bone('spine_2');
  const wool = [[700, 380], [820, 296], [930, 226], [1024, 184], [1112, 198], [1196, 296], [1170, 360], [1080, 330], [990, 372], [880, 400], [780, 420]];
  { const top = wool.slice(0, 6), lo = []; const a = [1196, 296], b = [700, 380]; for (let i = 0; i <= 22; i++) { const t = i / 22, q = lerp(a, b, t), dip = Math.sin(Math.PI * t) * 70; lo.push(add(q, [0, dip + (i % 2 ? 18 : -6) + (f.r() - 0.5) * 12])); } V.underwool(f, [...top, ...lo], { density: 70 }); } // the wool's lower edge tufted where the guard hair parts
  // ---- the guard hair: three tiers of heavy hanks, the lower tiers first, each tier hanging over the one below. They
  // swing together a little (a slow wave along the body, as when it shakes its head) and each varies in width, length,
  // lean and curve; their tips end round the crack line, a few frozen tags hanging past it.
  const backY = x => { let best = 9999; for (let i = 0; i < 10; i++) { const a = body[i], b = body[i + 1]; if ((x - a[0]) * (x - b[0]) <= 0 && a[0] !== b[0]) best = Math.min(best, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])); } return best === 9999 ? 500 : best; };
  const swing = x => 0.14 * Math.sin(x * 0.006 + 1.1);
  const hlook = (w) => { const c = GP[Math.floor(f.r() * GP.length)]; return Object.assign({}, COAT, { fill: c, shadow: mix(c, '#2a2e38', 0.5), maxShade: w * 0.2, shade: 0.4 }); };
  let curB = null;
  const tier = (rootK, x0, x1, step, wMin, wMax, extra, shortK) => {
    const xs = []; for (let x = x0; x < x1; x += V.R(f, step * 0.5, step * 1.5)) xs.push(x);
    for (const x of xs) {
      const top = backY(x) + 12 + (hemY(x) - backY(x)) * rootK + (rootK > 0 ? (f.r() - 0.3) * 90 : f.r() * 30);
      let bot = hemY(x) + V.R(f, -60, 30) + (f.r() < extra ? V.R(f, 40, 90) : 0);
      if (f.r() < shortK) bot = top + (bot - top) * V.R(f, 0.4, 0.75); // a shorter hank: its tips land on the hanks below
      const L = bot - top; if (L < 60) continue;
      const w = V.R(f, wMin, wMax), a = swing(x) + (f.r() - 0.5) * 0.26 + (x - 760) / 760 * 0.2, d = [Math.sin(a), Math.cos(a)], sd = [d[1], -d[0]];
      const wv = w * V.R(f, 0.1, 0.3) * (f.r() < 0.5 ? 1 : -1); // each hank waves: an S through its length
      const path = [[x, top], add(add([x, top], mul(d, L * 0.25)), mul(sd, wv)), add(add([x, top], mul(d, L * 0.5)), mul(sd, -wv * 0.4)), add(add([x, top], mul(d, L * 0.75)), mul(sd, wv * 0.7)), add(add([x, top], mul(d, L)), mul(sd, wv * 0.2))];
      const bn = x < 760 ? 'spine_1' : 'spine_2'; if (bn !== curB) { f.bone(bn); curB = bn; } // one layer run per bone, not per hank
      V.hank(f, path, w, { look: hlook(w), ice: true, ballK: 0.22, icicleK: 0.3 });
    }
  };
  tier(0.72, 170, 1290, 40, 28, 60, 0.25, 0.0);
  tier(0.5, 170, 1290, 44, 30, 66, 0.1, 0.1);
  tier(0.24, 180, 1250, 56, 40, 92, 0.15, 0.35);
  tier(0.0, 190, 1210, 66, 50, 116, 0.2, 0.45);
  // the lower curtain in shadow, the depth under the overhang of the coat
  f.bone('spine_1'); V.clipDraw(f, [[100, 760], [760, 760], [760, 1160], [100, 1160]], () => f.raw(`<path d="${E.smooth([[150, 880], [760, 900], [760, 1060], [150, 1040]])}" fill="#141824" opacity="0.3" filter="url(#glowL823)"/>`));
  f.bone('spine_2'); V.clipDraw(f, [[760, 760], [1320, 760], [1320, 1160], [760, 1160]], () => f.raw(`<path d="${E.smooth([[760, 900], [1300, 880], [1300, 1040], [760, 1060]])}" fill="#141824" opacity="0.3" filter="url(#glowL823)"/>`));
  // the hanks round the hump's front, falling over the withers toward the head
  f.bone('spine_2'); for (let i = 0; i < 4; i++) { const x = 1130 + i * 30, top = backY(x) + 110; V.hank(f, [[x, top], [x + 30 + i * 10, top + 160], [x + 50 + i * 14, top + 340], [x + 60 + i * 16, Math.min(hemY(x) + 20, top + 520)]], V.R(f, 50, 90), { look: hlook(56), ice: true }); }
  f.bone('spine_2');
  V.rimeCrust(f, [[170, 570], [250, 506], [420, 470], [600, 420], [700, 382]], 14, [-0.6, -1], { gap: 8, feather: 0.8 });
  V.rimeCrust(f, [[820, 296], [930, 226], [1024, 184], [1112, 198], [1196, 296]], 12, [-0.6, -1], { gap: 8, feather: 0.8 });
  // the hold's brand on the hump, burned through the wool
  const bd = [960, 290];
  f.flat([add(bd, [-44, -10]), add(bd, [-20, -22]), add(bd, [10, -18]), add(bd, [40, -26]), add(bd, [46, 6]), add(bd, [20, 20]), add(bd, [-12, 14]), add(bd, [-40, 18])], '#3a302c', { op: 0.8 });
  f.line([add(bd, [-30, 8]), add(bd, [-14, -12]), add(bd, [2, 8]), add(bd, [18, -12]), add(bd, [34, 6])], 5, '#1a0e0a'); f.line([add(bd, [-14, -12]), add(bd, [-14, 12])], 4, '#1a0e0a');
  // below the crack the hair is burned away: singed stubs curling up along the line, steam rolling out from under
  f.bone('spine_1'); V.hanks(f, splitCtl.slice(1, 10).map(q => add(q, [0, 6])), 12, 16, 34, 14, { state: 'singed', strands: 2 });
  f.bone('spine_2'); V.hanks(f, splitCtl.slice(10, 18).map(q => add(q, [0, 6])), 10, 16, 34, 14, { state: 'singed', strands: 2 });
  for (const x of [380, 760, 1080]) V.puff(f, [x, hemY(x) + 20], 140, 40, { op: 0.32, sway: 16, phase: x, big: true });
  // ---- neck: short and buried in coat, burnt below; the heavy wooden yoke across it, the broken trace chain
  f.bone('neck');
  const neck = [[1150, 330], [1260, 470], [1340, 620], [1420, 780], [1460, 880], [1400, 960], [1330, 990], [1260, 900], [1200, 700]];
  V.thermal(f, neck, Sp, Object.assign({}, COAT, { maxShade: 30 }), HIDE, { riftW: 3, nFacets: 3, nEmbers: 6 });
  for (let i = 0; i < 5; i++) { const x = 1230 + i * 40, top = 470 + i * 70; V.hank(f, [[x, top], [x + 10, top + 120], [x + 4, top + 240], [x + 14, Math.min(hemY(x) + 60, top + 330)]], V.R(f, 44, 80), { look: hlook(56), ice: true }); }
  f.bone('yoke');
  V.timber(f, [1210, 600], [1420, 770], 54, { state: 'ice', ends: true });
  const bow = [[1240, 620], [1280, 820], [1370, 860], [1408, 742]];
  f.part([...V.offsetLine(V.spline(bow, 8), () => 9), ...V.offsetLine(V.spline(bow, 8), () => -9).reverse()], V.rimed({ fill: P.woodL, shadow: P.woodD, shade: 0.4, tex: 'grain823', texOp: 0.6 }, 0.2)); // the bow under the throat
  for (const q of [[1240, 616], [1404, 734]]) f.rivet(q, 5);
  f.part(ell([1230, 620], 16, 16, 0, 12), { fill: P.ironL, shade: 0.35, inkW: 1.2, cast: false });
  f.bone('chain');
  V.chainLinks(f, [[1230, 636], [1206, 720], [1216, 800], [1196, 860]], 20);
  f.line([[1196, 860], [1188, 878]], 4, P.ironL); f.line([[1196, 860], [1206, 876]], 4, P.ironL); // the broken link
  // ---- head: a musk ox's long face held low, the muzzle near the ice. Local frame: +x down the face to the nose,
  // +y toward the jaw. Coat above the line, burnt below (the head's line follows the flank's).
  f.bone('head');
  for (let i = 0; i < 6; i++) { const q = HF([[-60 + i * 50, 84 - i * 4]])[0]; V.hank(f, [q, add(q, [-8, 70]), add(q, [-2, 140]), add(q, [-14, 200 - i * 18])], V.R(f, 30, 54), { look: hlook(56), ice: true, icicleK: 0.5 }); } // the beard of guard hair off the jaw and throat
  const head = HF([[-150, -70], [-60, -104], [40, -96], [140, -82], [220, -66], [272, -52], [302, -18], [304, 22], [282, 50], [222, 64], [120, 76], [20, 92], [-60, 98], [-130, 62], [-170, 0]]);
  const hsp = { line: V.jag(f, HF([[-260, 30], [-40, 40], [120, 52], [360, 40]]), 6, 12), ice: 1 };
  const dh = V.thermal(f, head, hsp, Object.assign({}, COAT, { maxShade: 36 }), HIDE, { riftW: 2.6, nFacets: 3, nEmbers: 5 });
  V.clipDraw(f, dh, () => {
    V.mass(f, HF([[-40, -96], [140, -80], [270, -50], [280, 0], [120, -20], [-20, -40]]), { s: 30, op: 0.45, hiOp: 0.4 }); // the long nasal plane
    V.mass(f, HF([[-60, -10], [60, -20], [150, 10], [120, 70], [-20, 90], [-80, 60]]), { s: 40, op: 0.4, hiOp: 0.2 }); // the cheek and jaw
    f.flat(HF([[200, -56], [272, -50], [300, -16], [302, 22], [282, 48], [222, 58], [200, 20]]), '#c8c2b4', { op: 0.55 }); // the pale muzzle
    V.mass(f, HF([[210, -50], [290, -30], [300, 20], [270, 50], [220, 40], [204, 0]]), { s: 18, op: 0.4, hiOp: 0.4, sharp: true });
    groove(HF([[210, 46], [250, 40], [290, 36]]), 3, 0.55); // the lip line
    f.flat(HF([[110, 40], [220, 50], [240, 70], [130, 80]]), P.charS, { op: 0.45 }); // the scorched jaw
    for (let i = 0; i < 40; i++) { const q = HF([[-120 + f.r() * 330, -90 + f.r() * 130]])[0], l = V.R(f, 14, 30); f.line([q, add(q, rot([l, (f.r() - 0.3) * 8], hA)), add(q, rot([l * 1.5, 4], hA))], 1.3, f.r() < 0.6 ? '#3a3e44' : '#e8ecee', { op: 0.6 }); } // the hair lying down the face toward the nose
  });
  // the nostril, wide and flared; the nose ring and the rope halter
  f.part(HF([[268, -20], [292, -24], [300, 0], [284, 10], [266, 0]]), { fill: '#1a1414', shade: 0.3, inkW: 1.2, cast: false }); f.flat(HF([[274, -12], [290, -14], [292, 0], [278, 2]]), '#000');
  const nr = ell(HF([[294, 30]])[0], 14, 14, 0, 14); f.line(nr.concat([nr[0]]), 6, INK); f.line(nr.concat([nr[0]]), 3.6, P.ironL);
  V.rope(f, HF([[-60, -96], [60, -70], [180, -50], [256, -40]]), 7, { col: mix('#6a5e48', P.ice, 0.2) });
  V.rope(f, HF([[180, -50], [190, 20], [160, 76]]), 7, { col: mix('#6a5e48', P.ice, 0.2) });
  V.icicles(f, [HF([[250, 60]])[0], HF([[296, 40]])[0]].sort((p, q) => p[0] - q[0]), 3, 18, 44); // frozen breath off the muzzle
  V.puff(f, HF([[320, 0]])[0], 120, 30, { drift: 30, op: 0.36 });
  // the small dark eye deep in hair, set under the boss, just above where the horn sweeps past it
  V.animalEye(f, HF([[78, -46]])[0], 13, hA, { frost: true });
  f.stroke(HF([[48, -64], [80, -70], [112, -60]]), 7, '#2a2e34', { op: 0.7 }); // the brow over it
  // the horn boss: two heavy bosses meeting in a groove across the top of the head, ridged and rough, rimed
  const BOSS = { fill: '#9a907c', shadow: '#2a241c', light: '#d8d0bc', shade: 0.42, tex: 'crack823', texOp: 0.7, maxShade: 46 };
  const bossP = HF([[-176, -56], [-160, -136], [-80, -190], [30, -186], [96, -140], [90, -98], [20, -92], [-60, -84], [-120, -60], [-150, -30]]); // a heavy plate over the brow, horn-coloured, running on into the horn's base
  V.iced(f, bossP, BOSS, { nFacets: 3, cracks: 3, after: () => {
    V.mass(f, bossP, { s: 30, op: 0.45, hiOp: 0.4, shadow: '#2a2016' });
    for (let i = 0; i < 6; i++) f.line(HF([[-140 + i * 36, -150 + Math.abs(i - 2.5) * 6], [-130 + i * 36, -104 + Math.abs(i - 2.5) * 4]]), 1.6, INK, { op: 0.45 }); // the ridged, rough boss
  } });
  groove(HF([[-120, -150], [-30, -168], [60, -146]]), 4, 0.5); // the groove where the bosses meet
  // the near horn: out of the boss, down the side of the head behind the eye, round under it, then forward and up into
  // a hook; broad and rough at the base, smooth and dark toward the tip, the tip chipped
  const hc = V.spline(HF([[-40, -110], [-96, -60], [-104, 10], [-70, 76], [0, 100], [70, 70], [98, 20], [100, -18]]), 6);
  const wf = t => 78 * Math.pow(1 - t, 1.1) + 10;
  const hpts = [...V.offsetLine(hc, t => wf(t) / 2), ...V.offsetLine(hc, t => -wf(t) / 2).reverse()];
  const hd = V.iced(f, hpts, Object.assign({}, BOSS, { fill: '#a89e8a', light: '#e8e0cc', maxShade: 26 }), { nFacets: 2, after: () => {
    V.mass(f, hpts, { s: 18, op: 0.45, hiOp: 0.45, sharp: true, shadow: '#2a2016' });
    const tipD = [...V.offsetLine(hc.slice(-9), () => 18), ...V.offsetLine(hc.slice(-9), () => -18).reverse()];
    f.raw(`<path d="${E.smooth(tipD)}" fill="#1a1612" opacity="0.85"/>`); // the dark tip
    const A2 = V.offsetLine(hc, t => wf(t) * 0.48), B2 = V.offsetLine(hc, t => -wf(t) * 0.48);
    for (let i = 1; i < Math.floor(hc.length * 0.55); i += 2) f.line([A2[i], lerp(A2[i], B2[i], 0.5), B2[i]], 1.3, INK, { op: 0.5 }); // the rough growth rings at the base
  } });
  const tip = hc[hc.length - 1]; f.flat([add(tip, [-6, -6]), add(tip, [6, -4]), add(tip, [2, 6])], '#3a3228'); f.line([add(tip, [-6, -6]), add(tip, [6, -4])], 1, P.iceL); // the chipped tip
  { const t = HF([[40, 96]])[0]; f.part([add(t, [-10, -8]), add(t, [12, -14]), add(t, [30, -40]), add(t, [18, -4])], { fill: '#2a241e', shade: 0.3, inkW: 1.1, cast: false }); } // the far horn's hook, just showing under the jaw
  V.rimeCrust(f, HF([[-150, -130], [-70, -176], [30, -170], [86, -132]]), 10, [-1, -0.3], { gap: 6 });
  V.icicles(f, [hc[Math.floor(hc.length * 0.35)], hc[Math.floor(hc.length * 0.5)]].sort((p, q) => p[0] - q[0]), 3, 14, 30);
  leg('hn', false, 6); leg('fn', false, 6);
  f.bone('root');
  for (const L of Object.values(LEG)) f.flat(ell(add(L.T, [0, 0]), 90, 8, 0, 14), P.charS, { op: 0.4 });
  f.flat(ell([780, gy + 2], 640, 12, 0, 22), P.charS, { op: 0.3 });
  return f;
}

// ------------------------------------------------------------------ BERSERKER (elite, 2.0)
// One of the jarl's berserkers, sworn to fight in a bearskin and no armour: a heavy, barrel-chested man bare to the
// waist under the pelt, wide-legged and leaning forward with the chest out and the weight forward on bent knees, a
// bearded axe in each hand held low and out from the hips (the near one trailing back, the far one forward), the bear's
// head worn as a hood and pulled far forward over his face.
// Split: diagonal, from the near shoulder across the chest to the far hip. Above and behind it the near shoulder and arm
// are iced (the near axe frozen to the hand) and the bearskin over his back is frozen stiff and hung with icicles; below
// and in front of it the belly, far side and far arm are charred black and split with glowing seams, ash curling off.
// The crack is jagged and glows at its deepest.
// Rig: standard humanoid + axe_n (hand_n) + axe_f (hand_f) + pelt (torso) + hood (head).
function berserker() {
  const [CW, CH] = TIERS.elite;
  const f = new Fig(V.base(822, CH, { grimeY: 1150 })); V.texturesB(f);
  const gy = f.o.groundY, H = 196;
  const N = [650, 520], C = [566, 660], Pv = [520, 840];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), EN = [470, 730], WN = [452, 880];
  const SF = S.at(0.42, 0.1), EF = [730, 712], WF = [750, 872];
  const HN = S.at(-0.3, 1.0), KN = [350, 1086], AN = [240, 1290];
  const HF = S.at(0.3, 0.98), KF = [720, 1066], AF = [810, 1290];
  const HC = [752, 436], hA = 0.18, hF = frame(HC, hA, H);
  V.humanJoints(f, { P: Pv, T: S.at(0, 0.8), N: S.at(0.15, -0.05), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('axe_n', WN, 'hand_n').joint('axe_f', WF, 'hand_f').joint('pelt', S.at(-0.5, 0.0), 'torso').joint('hood', add(HC, [-40, -40]), 'head');
  // the diagonal: near shoulder (back, top) to far hip (front, bottom); ice above-behind
  const Sp = V.splitLine(f, [S.at(-1.4, -0.5), S.at(-0.6, 0.0), S.at(-0.2, 0.2), S.at(0.2, 0.45), S.at(0.45, 0.7), S.at(0.55, 1.0), S.at(0.8, 1.4)], [-1, -1], 12, 16);
  const SKI = V.SKI(f, { fill: '#b8c0c4', maxShade: 80 }), SKC = V.SKC(f, { fill: '#3e302a', maxShade: 70 });
  const skin = (pts, o = {}) => V.thermal(f, pts, Sp, SKI, SKC, Object.assign({ riftW: 4, nFacets: 4, nEmbers: 8 }, o));
  const PELT = { fill: '#5a4e44', shadow: '#1a1410', shade: 0.4, tex: 'fur822', texOp: 0.8, maxShade: 90 };
  const PI = V.rimed(PELT, 0.45), BREE = V.WOOL(f, { fill: '#4e4a44', maxShade: 60 });
  const GP = ['#9aa2a8', '#b6bcc0', '#7a8288', '#d0d6d8'];
  const blood = (p, l) => { f.line([p, add(p, [1, l * 0.5]), add(p, [-1, l])], 3, P.blood, { op: 0.9 }); f.flat(ell(add(p, [-1, l + 3]), 2.4, 3, 0, 6), P.bloodD); };
  // the bearded axe: haft from the fist, an iron head with a long lower beard; o.state ice/char
  const axe = (W, Eb, dir, len, state) => {
    const d = E.norm(dir), n = [-d[1], d[0]], butt = add(W, mul(d, -60)), top = add(W, mul(d, len));
    const HAFT = state === 'ice' ? V.rimed({ fill: P.wood, shadow: P.woodD, tex: 'grain822', texOp: 0.7, shade: 0.4 }, 0.35) : V.charred({ fill: P.wood, shadow: P.woodD, tex: 'craze822', texOp: 0.8, shade: 0.4 }, 0.6);
    f.part(limb(butt, top, 24, 22, { steps: 10 }), Object.assign({}, HAFT, { inkW: 1.6 }));
    if (state === 'char') { V.seam(f, [lp(butt, top, 0.3, 2), lp(butt, top, 0.45, -3), lp(butt, top, 0.6, 2)], 2); V.ash(f, lp(butt, top, 0.5, 0), 8, 20, 80, 1); }
    else { V.rimeCrust(f, [lp(butt, top, 0.1, -12), lp(butt, top, 0.9, -12)], 6, [-1, -0.3], { gap: 7 }); V.icicles(f, [lp(butt, top, 0.2, 12), lp(butt, top, 0.7, 12)], 4, 10, 26); }
    // the head: socket, a short upper horn, the long bearded lower edge hooking back down the haft
    const sg = n[1] > 0 ? -1 : 1, A = (u, v) => add(add(top, mul(d, u)), mul(n, v * sg));
    const head = [A(-30, -16), A(-30, -50), A(-40, -80), A(-74, -130), A(-96, -186, 1), A(-50, -200), A(0, -212), A(36, -204, 1), A(40, -160), A(26, -100), A(22, -50), A(24, -14), A(28, 18)];
    const IRON = state === 'ice' ? { fill: mix(P.iron, P.ice, 0.35), shadow: '#141418', light: P.iceL, shade: 0.4, tex: 'rime822', texOp: 0.7 } : { fill: mix(P.iron, P.char, 0.3), shadow: '#0e0a08', light: '#7a6a5e', shade: 0.4, tex: 'craze822', texOp: 0.6 };
    const hd = f.part(head, Object.assign({}, IRON, { inkW: 1.8 }));
    V.clipDraw(f, hd, () => { f.line([A(-92, -184), A(-50, -198), A(0, -210), A(34, -202)], 4, state === 'ice' ? P.iceL : '#a89888', { op: 0.8 }); f.flat([A(-14, -200), A(2, -204), A(-6, -188)], '#141010'); for (let i = 0; i < 3; i++) f.line([A(-10 + i * 12, -60), A(-16 + i * 14, -130)], 1, INK, { op: 0.4 }); }); // the worn edge, a nick, hammer marks
    f.part([A(-48, -24), A(30, -24), A(30, 20), A(-48, 20)], Object.assign({}, IRON, { inkW: 1.4 })); // the socket
    f.rivet(A(-10, 0), 3.4);
    if (state === 'ice') V.icicles(f, [A(-30, -50), A(24, -50)].sort((p, q) => p[0] - q[0]), 2, 10, 24); else V.glow(f, A(-10, -150), 30, 20, P.lamp, 0.3);
    return top;
  };

  // ---- the bearskin behind him: hung from the hood down his back to the calves, frozen stiff, icicles off its edge;
  // the pelt's hind claws hanging at his calves
  f.bone('pelt');
  const pelt = [add(HC, [-40, -60]), S.at(-0.8, -0.1), S.at(-1.2, 0.4), S.at(-1.4, 1.0), [300, 1080], [270, 1180], [330, 1200], [400, 1150], [470, 1190], S.at(-0.5, 1.1), S.at(-0.2, 0.5), add(HC, [-10, 40])];
  const pd = V.iced(f, pelt, PI, { nFacets: 8, cracks: 6 });
  V.clipDraw(f, pd, () => { for (let i = 0; i < 26; i++) { const q = V.scatter(f, [400, 820], 140, 300); V.hairClump(f, [q, add(q, [-8, 24]), add(q, [-14, 52])], 18, { pal: GP, n: 3, gap: false }); } });
  V.hanks(f, [[300, 1080], [270, 1180], [330, 1200], [400, 1150], [470, 1190]], 9, 20, 40, 16, { state: 'ice', dir: [-0.1, 1], strands: 3, pal: GP });
  V.icicles(f, [S.at(-1.2, 0.4), S.at(-1.4, 1.0)], 6, 20, 50);
  for (const [x, y] of [[300, 1200], [440, 1200]]) { f.part([[x - 18, y - 10], [x + 18, y - 10], [x + 22, y + 40], [x - 16, y + 44]], PI); for (let i = 0; i < 4; i++) f.part([[x - 14 + i * 10, y + 40], [x - 8 + i * 10, y + 40], [x - 10 + i * 10, y + 64, 1]], { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 1, cast: false }); } // the hind paws and claws

  // ---- far arm (behind the body, toward the front): charred, the hand forward and low on the far axe
  V.armRig(f, SF, EF, WF, [130, 108, 86], () => {
    V.burnt(f, limb(SF, EF, 140, 108, { p: [[0.5, 0.18, 0.2]], q: [[0.4, 0.14, 0.2]] }), mix(SKC.fill, '#000', 0.1) && Object.assign({}, SKC, { fill: '#342824' }), { seams: 3, seamW: 2.4 });
    V.burnt(f, limb(lerp(EF, SF, 0.08), WF, 104, 80, { p: [[0.25, 0.18, 0.18]], q: [[0.2, 0.12, 0.16]] }), Object.assign({}, SKC, { fill: '#342824' }), { seams: 2, seamW: 2 });
    // knotwork tattoos, smeared and blistered on the burnt arm
    for (let i = 0; i < 3; i++) f.line([lp(SF, EF, 0.3 + i * 0.12, -30), lp(SF, EF, 0.36 + i * 0.12, 0), lp(SF, EF, 0.3 + i * 0.12, 30)], 3, '#1a2a3a', { op: 0.55 });
    f.line([lp(SF, EF, 0.3, -30), lp(SF, EF, 0.66, 30)], 3, '#1a2a3a', { op: 0.5 }); f.line([lp(SF, EF, 0.66, -30), lp(SF, EF, 0.3, 30)], 3, '#1a2a3a', { op: 0.5 });
    for (let i = 0; i < 4; i++) f.flat(ell(lp(SF, EF, 0.4 + i * 0.1, (f.r() - 0.5) * 40), 6, 4, 0, 8), '#6a4a3a', { op: 0.8 }); // blisters
    for (let i = 0; i < 3; i++) f.part(K.chain([lp(EF, WF, 0.74 + i * 0.06, 42), lp(EF, WF, 0.76 + i * 0.06, -42)], [10, 10]), Object.assign(V.charred(V.LEA(f), 0.4), { cast: false })); // wrist wraps
    V.ash(f, lerp(SF, EF, 0.5), 10, 60, 160, 1.4);
  }, '_f');
  f.bone('axe_f');
  axe(WF, EF, [0.99, 0.1], 250, 'char');
  f.bone('hand_f');
  B.grip(f, WF, EF, V.ang(WF, add(WF, [0.99, 0.1])), 50, '#342824', { shadow: P.charS, tex: 'craze822', texOp: 0.6, name: 'berserker far axe' });

  // ---- legs: wool breeches cross-gartered to the knee, fur-wrapped boots; scorched below the line
  const legSet = (Hp, Kn, A, sfx, tone, arrow) => {
    const BL = Object.assign(V.charred(BREE, 0.35), { fill: mix(V.charred(BREE, 0.35).fill, '#000', tone) });
    V.legRig(f, Hp, Kn, A, 120, () => {
      V.burnt(f, K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.15)], [176, 150, 118, 112], { bp: [[0, 0.5, 0.14]], bq: [[0, 0.45, 0.12]] }), BL, { nEmbers: 5 });
      fold(f, [lp(Hp, Kn, 0.3, 40), lp(Hp, Kn, 0.5, 20), lp(Hp, Kn, 0.7, 44)], 5, 0.45, '#0a0808'); fold(f, [lp(Hp, Kn, 0.8, -30), lp(Hp, Kn, 0.95, 0)], 5, 0.45, '#0a0808');
      V.burnt(f, K.chain([lerp(Kn, A, 0.1), lerp(Kn, A, 0.5), lerp(Kn, A, 0.9)], [112, 100, 80], { bp: [[0, 0.5, 0.2]] }), BL, { nEmbers: 3 });
      for (let i = 0; i < 5; i++) { const t = 0.15 + i * 0.15; f.line([lp(Kn, A, t, 52), lp(Kn, A, t + 0.12, -48)], 5, P.leathD); f.line([lp(Kn, A, t + 0.12, 52), lp(Kn, A, t, -48)], 5, P.leathD); } // cross-garters
      if (arrow) { const q = lp(Hp, Kn, 0.55, 10); f.part(limb(q, add(q, [-60, -40]), 8, 7, { steps: 4 }), V.charred({ fill: P.woodL, shadow: P.woodD, shade: 0.4 }, 0.2)); f.line([add(q, [-60, -40]), add(q, [-66, -38])], 2, P.woodD); f.line([add(q, [-56, -42]), add(q, [-62, -52])], 1.4, P.woodD); f.flat(ell(q, 8, 6, 0, 8), P.bloodD); blood(add(q, [0, 6]), 40); } // the broken arrow shaft in the thigh
    }, sfx);
    V.footRig(f, Kn, A, 100, () => {
      B.boot(f, A, 1, 100, mix(PELT.fill, P.char, 0.3), { shaft: 0.75, tex: 'fur822', texOp: 0.8 });
      for (let i = 0; i < 3; i++) f.line([[A[0] - 36, A[1] - 60 + i * 22], [A[0] + 34, A[1] - 50 + i * 22]], 4, P.leathD); // the fur wrapping's thongs
      V.hanks(f, [[A[0] - 40, A[1] - 72], [A[0] + 36, A[1] - 70]], 5, 16, 26, 12, { state: 'singed', dir: [0, 1], strands: 2 });
    }, sfx);
  };
  legSet(HF, KF, AF, '_f', 0.15, false);
  legSet(HN, KN, AN, '_n', 0, true);

  // ---- torso: barrel chest bare under the pelt, split on the diagonal
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.5, 0.42], [0.08, 0.78, 0.7], [0.3, 0.82, 0.92], [0.55, 0.7, 0.88], [0.78, 0.66, 0.76], [0.98, 0.7, 0.66], [1.1, 0.58, 0.5]]);
  const td = skin(torso, { charAfter: () => { V.crackNet(f, S.at(0.6, 0.7), 0.4, 140, 3, { depth: 2 }); V.flakes(f, S.at(0.5, 0.8), 40, 50, 10, 1.2); } });
  V.clipDraw(f, td, () => {
    fold(f, [S.at(0.1, 0.3), S.at(0.5, 0.42), S.at(0.85, 0.36)], 7, 0.5, '#0a0808'); // under the chest
    fold(f, [S.at(0.3, 0.56), S.at(0.55, 0.62)], 4, 0.4, '#0a0808'); fold(f, [S.at(0.28, 0.72), S.at(0.6, 0.78)], 4, 0.4, '#0a0808'); // the belly's rolls
    fold(f, [S.at(0.35, 0.18), S.at(0.38, 0.5), S.at(0.34, 0.9)], 4, 0.35, '#0a0808'); // the breastbone and the belly's line
  });
  V.clipDraw(f, td, () => V.rift(f, Sp, 4)); V.ash(f, S.at(0.0, 0.3), 14, 60, 180, 1.4);
  for (const [u, v, l] of [[-0.4, 0.25, 50], [-0.3, 0.1, 36], [-0.15, 0.32, 44]]) { const q = S.at(u, v); f.line([add(q, [-14, -6]), add(q, [14, 6])], 2.4, P.bloodD); blood(q, l); } // cuts on the frozen side, bleeding
  // belt, the seax in its scorched sheath
  f.bone('pelvis');
  f.part([S.at(-0.72, 0.9), S.at(0.66, 0.88), S.at(0.68, 0.99), S.at(-0.74, 1.01)], Object.assign(V.charred(V.LEA(f), 0.3), { sharp: true }));
  f.part([S.at(0.0, 0.88), S.at(0.16, 0.88), S.at(0.16, 1.0), S.at(0.0, 1.0)], { fill: P.ironL, shade: 0.3, inkW: 1.2, sharp: true });
  const sx = [S.at(0.36, 0.96), S.at(0.6, 1.36)];
  f.part(limb(sx[0], sx[1], 34, 18, { steps: 6 }), Object.assign(V.charred(V.LEA(f), 0.6), { inkW: 1.4 }));
  V.seam(f, [lp(sx[0], sx[1], 0.3, 4), lp(sx[0], sx[1], 0.6, -4), lp(sx[0], sx[1], 0.85, 2)], 1.6);
  f.part(limb(add(sx[0], [-6, -46]), sx[0], 18, 20, { steps: 4 }), { fill: P.boneD, shadow: '#3a3428', shade: 0.4, inkW: 1.2, cast: false });

  // ---- head: bearded face, teeth bared, the beard frozen into a stiff fork, one eye rimed shut; the bear's upper
  // skull and snout over it as a hood, pulled far forward
  f.bone('head');
  f.part(limb(S.at(0.15, -0.05), add(HC, [-14, 70]), 150, 130), Object.assign({}, SKI, { tex: 'mottle822', texOp: 0.5 }));
  const SpH = V.splitLine(f, hF([[0.7, -0.6], [0.34, -0.1], [0.3, 0.12], [0.12, 0.34], [-0.2, 0.6], [-0.5, 0.9]]), rot([-1, -1], hA), 3, 8);
  const hp = { jaw: 1.2, chin: 0.02, nose: 1.15, hook: 0.25, mouth: 'snarl', squint: 0.65, browDown: 0.12, browW: 0.06, age: true, faceShade: 0.82, noEar: true, beard: 'stubble' };
  V.sides(f, SpH, () => B.head(f, HC, H, hA, Object.assign({}, hp, { skin: '#bcc4c8', browCol: '#d8e0e2', hairCol: '#c8d0d4', beardCol: '#d8e0e2', eyeWhite: '#9aa4aa' })), () => B.head(f, HC, H, hA, Object.assign({}, hp, { skin: '#4a3a32', browCol: '#140e0c', hairCol: '#140e0c', beardCol: '#140e0c', eyeWhite: '#6a4a3a' })));
  f.flat(hF([[0.04, -0.07], [0.12, -0.1], [0.2, -0.075], [0.12, -0.06]]), '#9aa4ac'); f.line(hF([[0.04, -0.07], [0.12, -0.1], [0.2, -0.07]]), 2.4, '#5a6470'); V.facets(f, hF([[0.12, -0.07]])[0], 8, 4, 2, { op: 0.5 }); // the near eye rimed shut: a grey crust over the lid
  f.flat(hF([[0.18, 0.27], [0.32, 0.27], [0.3, 0.3], [0.2, 0.3]]), '#d8d0bc'); // the bared teeth
  V.clipDraw(f, E.smooth(hF([[-0.3, -0.4], [0.18, -0.47], [0.35, -0.13], [0.33, 0.21], [0.29, 0.47], [0.13, 0.535], [-0.21, 0.27], [-0.37, -0.13]])), () => V.rift(f, SpH, 2.4));
  // the beard: frozen into a stiff fork, icicles off the prongs
  const fork = [hF([[-0.12, 0.3]]), hF([[0.34, 0.32]]), hF([[0.3, 0.6]]), hF([[0.26, 0.98]]), hF([[0.16, 0.7]]), hF([[0.06, 1.02]]), hF([[-0.02, 0.62]])].map(q => q[0]);
  V.iced(f, fork, { fill: '#c4ccd0', shadow: '#4a5468', light: '#f2f6f6', shade: 0.4, tex: 'fur822', texOp: 0.6 }, { nFacets: 3 });
  for (let i = 0; i < 5; i++) f.line([lerp(fork[0], fork[1], i / 4), lerp(fork[3], fork[5], i / 4)], 1, '#6a7480', { op: 0.6 });
  V.icicles(f, [fork[3], fork[5]], 2, 20, 40); V.icicles(f, [fork[2], fork[3]], 2, 10, 20);
  // the bear's head as a hood: the upper skull, brow and snout pulled far forward over the face, ears, the hide behind
  f.bone('hood');
  const HD = (u, v) => hF([[u, v]])[0];
  const hood = [HD(-0.62, 0.5), HD(-0.72, -0.1), HD(-0.52, -0.62), HD(-0.1, -0.82), HD(0.3, -0.74), HD(0.54, -0.56), HD(0.7, -0.42), HD(0.74, -0.22), HD(0.66, -0.08), HD(0.46, -0.1), HD(0.3, -0.2), HD(0.08, -0.24), HD(-0.12, -0.12), HD(-0.36, 0.2), HD(-0.4, 0.6)];
  V.iced(f, hood, PI, { nFacets: 4, cracks: 3, after: () => { for (let i = 0; i < 16; i++) { const q = V.scatter(f, HD(-0.05, -0.45), 80, 44); V.hairClump(f, [q, add(q, [-10, 10]), add(q, [-18, 26])], 14, { pal: GP, n: 3, gap: false }); } } });
  f.flat([HD(0.36, -0.56), HD(0.7, -0.4), HD(0.72, -0.22), HD(0.5, -0.3)], '#3a3430', { op: 0.5 }); // the darker muzzle
  f.part([HD(0.62, -0.34), HD(0.76, -0.3), HD(0.78, -0.16), HD(0.66, -0.12)], { fill: '#1a1416', shade: 0.3, inkW: 1.3, cast: false }); // the bear's nose
  f.flat([HD(0.3, -0.2), HD(0.6, -0.11), HD(0.58, -0.06), HD(0.28, -0.14)], '#120c0c'); // the upper lip's edge over his brow
  for (let i = 0; i < 4; i++) { const q = HD(0.34 + i * 0.07, -0.16 + i * 0.012); f.part([add(q, [-5, 0]), add(q, [5, 0]), add(q, [0, 16])], { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 1, cast: false }); }
  f.line([HD(0.2, -0.44), HD(0.32, -0.42)], 2.4, '#141010'); f.line([HD(0.2, -0.44), HD(0.32, -0.42)], 1, '#8a7a6a', { dash: '2 2' }); // the bear's sewn-shut eye
  f.part([HD(-0.3, -0.62), HD(-0.42, -0.8), HD(-0.3, -0.92), HD(-0.16, -0.82), HD(-0.14, -0.68)], PI); f.part([HD(0.0, -0.74), HD(-0.02, -0.92), HD(0.12, -0.96), HD(0.2, -0.84), HD(0.16, -0.7)], PI); // round ears
  V.rimeCrust(f, [HD(-0.6, -0.2), HD(-0.4, -0.66), HD(0.1, -0.8), HD(0.5, -0.58), HD(0.7, -0.42)], 10, [-1, -0.4], { gap: 6 });
  V.icicles(f, [HD(0.36, -0.14), HD(0.66, -0.08)], 4, 12, 26);
  // the forepaws knotted at his throat, frost crusted on them, and the necklace of bear teeth
  f.bone('torso');
  const kn = S.at(0.18, 0.02);
  for (const [a, b] of [[S.at(-0.5, 0.0), kn], [S.at(0.6, -0.02), kn]]) f.part(limb(a, b, 54, 44, { steps: 6 }), PI);
  f.part(ell(kn, 34, 28, 0.3, 12), PI);
  for (let i = 0; i < 4; i++) f.part([add(kn, [-20 + i * 12, 22]), add(kn, [-14 + i * 12, 22]), add(kn, [-18 + i * 12, 46, 1])], { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 1, cast: false });
  V.rimeCrust(f, [add(kn, [-40, -20]), add(kn, [0, -30]), add(kn, [40, -16])], 8, [-1, -0.4], { gap: 5 });
  const nk = V.spline([S.at(-0.3, 0.12), S.at(0.1, 0.24), S.at(0.5, 0.16)], 14);
  f.line(nk, 2, P.leathD); nk.forEach((q, i) => { if (i % 2) f.part([add(q, [-4, 0]), add(q, [4, 0]), add(q, [0, 20])], { fill: P.bone, shadow: P.boneD, shade: 0.35, inkW: 0.9, cast: false }); });

  // ---- near arm: iced from the shoulder down, arm rings, the near axe frozen to the hand and trailing back
  V.armRig(f, SN, EN, WN, [140, 116, 92], () => {
    V.iced(f, limb(SN, EN, 150, 116, { p: [[0.5, 0.18, 0.2]], q: [[0.35, 0.16, 0.2]] }), SKI, { nFacets: 4, cracks: 3 });
    V.iced(f, limb(lerp(EN, SN, 0.08), WN, 112, 86, { p: [[0.25, 0.18, 0.18]], q: [[0.2, 0.14, 0.16]] }), SKI, { nFacets: 3, cracks: 2 });
    fold(f, [lp(SN, EN, 0.2, 50), lp(SN, EN, 0.45, 60), lp(SN, EN, 0.6, 40)], 5, 0.45); // the deltoid's edge
    for (const t of [0.62, 0.7]) f.part(K.chain([lp(SN, EN, t, 60), lp(SN, EN, t + 0.03, -60)], [14, 14]), { fill: P.ironL, shadow: '#141418', shade: 0.35, inkW: 1.3, cast: false }); // arm rings
    for (let i = 0; i < 3; i++) f.part(K.chain([lp(EN, WN, 0.74 + i * 0.07, 46), lp(EN, WN, 0.76 + i * 0.07, -46)], [11, 11]), Object.assign(V.rimed(V.LEA(f), 0.35), { cast: false })); // wrist wraps
    blood(lp(EN, WN, 0.4, 20), 50);
    V.rimeCrust(f, [lp(SN, EN, -0.1, 40), lp(SN, EN, 0.4, 70), lp(EN, WN, 0.2, 54)], 10, [-1, -0.4], { gap: 6 });
    V.icicles(f, [lp(SN, EN, 0.9, -50), lp(EN, WN, 0.4, -50)], 4, 16, 36);
  }, '_n');
  f.bone('axe_n');
  axe(WN, EN, [-0.99, -0.06], 250, 'ice');
  f.bone('hand_n');
  B.grip(f, WN, EN, V.ang(WN, add(WN, [-0.99, -0.06])), 52, '#aab2b8', { shadow: P.skinIS, tex: 'rime822', texOp: 0.6, name: 'berserker near axe' });
  f.part(ell(add(WN, [0, 8]), 40, 30, 0.6, 12), V.ICE(f, { fill: P.glass, cast: false })); // the hand frozen to the haft in a clot of ice
  V.icicles(f, [add(WN, [-24, 30]), add(WN, [20, 34])], 3, 12, 26);

  f.bone('root');
  for (const a of [AN, AF]) f.flat(ell(add(a, [40, 80]), 110, 8, 0, 14), P.charS, { op: 0.4 });
  return f;
}

// ------------------------------------------------------------------ THE SLEEPER UNDER THE HOLD (ruler, 3 high, 6 long)
// A giantess of the old ice, the eldest of the jotnar, asleep under the glacier long before the hold was built; the
// miners' deep galleries were cut into her. She lies on her back in the glacier floor, seen from the side: the hill of
// her ribs, breast and shoulder fills the frame and runs off both sides; her head is thrown back at the far edge (the
// left edge in the game, after the mirror), cropped; the near arm lifts out of the ice, up off the top of the frame, and
// the forearm comes back down so the hand hangs open over the company, an ore bucket hanging from a finger.
// Split: outside / inside. Her skin is old glacier ice, faceted in broad planes, rimed thick and hung with downward
// icicles (frost); the miners' adits in her chest and shoulder have filled with the fire coming up from below, so every
// tunnel mouth glows molten from within, charred at its edges, ash curling out (fire), and cracks run out from each one
// across the ice skin like crazed glaze, glowing at their roots and white at their tips. Steam rises where fire meets
// the surface.
// True size wins over the canvas (GUIDE 2): the ruler canvas is widened to 2400 at the same pixel scale and still crops
// her; her head is about 640 px (a human is 640 tall).
// Rig (the Motion line): body (the hill, pivot low at her hips so one slow breath lifts it) > head; upperarm > forearm >
// hand > bucket (the hand coming down across two ranks); glacier floor and rubble on root.
function sleeper() {
  const CW = 2400, CH = 1600;
  const f = new Fig(V.base(820, CH, { grimeY: 1700 })); V.texturesB(f);
  const gy = f.o.groundY;
  const SKIN = { fill: '#b2c0ca', shadow: '#18203a', light: '#f4f8fa', shade: 0.5, tex: 'crack820', texOp: 0.7, maxShade: 260 }; // (ruler upgrade pass) a step darker, a deeper shadow and a wider shadow band
  const SKIN2 = Object.assign({}, SKIN, { fill: '#a0aebb', maxShade: 120 });
  const SH = [1330, 760], EL = [1560, -160], WR = [1760, 330];
  const HC = [2200, 1000], hA = -1.2, HH = 640;
  f.joint('body', [300, 1500]).joint('head', [1960, 960], 'body').joint('upperarm', SH, 'body').joint('forearm', EL, 'upperarm').joint('hand', WR, 'forearm').joint('bucket', [1800, 640], 'hand');
  const big = (pts, look, o = {}) => V.iced(f, pts, look, Object.assign({ nFacets: 14, fs: 4, cracks: 10, rimeOp: 0.45 }, o));
  const plane = (pts, op = 0.22, c = '#ffffff') => f.flat(pts, c, { op }); // broad faceted planes of old ice
  const groove = (pts, w = 8, op = 0.45) => f.stroke(pts, w * 1.2, '#0a0f1c', { op: Math.min(0.8, op * 1.4) });
  // (ruler upgrade pass) the value range pushed: every modelled mass casts a deeper shadow plane and a brighter lit plane,
  // and the form-following hatching is heavier and wider, so the hill reads as a body (lit hip, ribs, breast; dark
  // undersides and crevices) at game size instead of a pale snowfield
  const mass = (pts, o = {}) => V.mass(f, pts, Object.assign({}, o, { op: Math.min(0.82, (o.op ?? 0.42) * 1.45), hiOp: o.hiOp === 0 ? 0 : Math.min(0.68, (o.hiOp ?? 0.3) * 1.6) }));
  const bH = (A0, B0, n, w, o = {}) => V.bandHatch(f, A0, B0, n, w * 1.25, Object.assign({}, o, { op: Math.min(0.72, (o.op ?? 0.35) * (o.col ? 1.25 : 1.55)) }));
  const wH = (a0, b0, wa, wb, sd, n, o = {}) => V.wrapHatch(f, a0, b0, wa, wb, sd, n, Object.assign({}, o, { op: Math.min(0.66, (o.op ?? 0.35) * 1.5), w: (o.w || 4) * 1.2 }));

  // ================= the hill (independent review: rebuilt with giant anatomy). Seen from her near side, lying on her
  // back: the pubis runs off the left edge, the iliac crest rises over the hip, the belly sags into a saddle, the
  // ribcage climbs to the breast (the peak), the pectoral runs into the lifted arm, the clavicle runs to the neck. The
  // long back muscles are pressed against the glacier floor along the bottom and the body darkens where it meets it.
  // Every mass is modelled by the key light (mass()), hatched along its form (bandHatch / wrapHatch) in ink on the
  // shadow side and in rime on the lit side, and the old ice skin carries old cracks and refrozen seams.
  f.bone('body');
  const body = [[-80, 1600], [-80, 872], [40, 820], [140, 742], [228, 702], [300, 712], [372, 760], [470, 800], [580, 784], [680, 702], [780, 590], [880, 492], [980, 432], [1080, 408], [1180, 420], [1290, 470], [1400, 560], [1520, 650], [1680, 740], [1820, 820], [1940, 880], [2030, 900], [2080, 1000], [2060, 1200], [2000, 1400], [1980, 1600]];
  // the ribs: from the spine at the floor, up and toward her feet to the costal margin under the breast
  const ribs = []; for (let i = 0; i < 7; i++) { const s0 = [940 + i * 82, 1372 - i * 6], e0 = [632 + i * 86, 936 - i * 62]; ribs.push([s0, add(lerp(s0, e0, 0.45), [-74 + i * 4, 42]), e0]); }
  const latEdge = [[470, 1300], [720, 1190], [960, 1040], [1140, 900], [1230, 820]];
  const bd = big(body, SKIN, { nFacets: 8, cracks: 6, after: () => {
    // --- the darker underside: the body turning under into the floor, crosshatched
    const ub = [[-80, 1180], [300, 1250], [700, 1290], [1100, 1310], [1500, 1290], [1820, 1230], [2080, 1140], [2080, 1600], [-80, 1600]];
    f.raw(`<path d="${E.smooth(ub)}" fill="#060a14" opacity="0.78" filter="url(#glowL820)"/>`);
    const xm = f.id('ub'); f.defs.push(`<mask id="${xm}" maskUnits="userSpaceOnUse" x="-200" y="900" width="2600" height="800"><path d="${E.smooth(ub.map(q => add(q, [0, 40])))}" fill="#fff" filter="url(#glowL820)"/></mask>`);
    f.raw(`<rect x="-200" y="900" width="2600" height="800" fill="url(#xhatch820)" opacity="0.95" mask="url(#${xm})"/>`);
    // (ruler upgrade pass) the whole lower flank turning away from the light toward the floor: a broad core shadow and a
    // second, lighter crosshatch rising above the underside, so only the upper faces stay pale
    const fl = [[-80, 1020], [300, 1060], [700, 1110], [1100, 1140], [1500, 1110], [1820, 1050], [2080, 960], [2080, 1600], [-80, 1600]];
    f.raw(`<path d="${E.smooth(fl)}" fill="#0a1020" opacity="0.42" filter="url(#glowL820)"/>`);
    const xm2 = f.id('ub'); f.defs.push(`<mask id="${xm2}" maskUnits="userSpaceOnUse" x="-200" y="800" width="2600" height="900"><path d="${E.smooth(fl.map(q => add(q, [0, 50])))}" fill="#fff" opacity="0.6" filter="url(#glowL820)"/></mask>`);
    f.raw(`<rect x="-200" y="800" width="2600" height="900" fill="url(#xhatch820)" opacity="0.7" mask="url(#${xm2})"/>`);
    // --- the long back muscles pressed into the floor: one rolled mass from the hip to the shoulder blade
    const erector = [[40, 1450], [110, 1340], [400, 1296], [800, 1312], [1200, 1336], [1520, 1300], [1700, 1350], [1680, 1460], [1000, 1470], [400, 1470]];
    mass(erector, { s: 60, op: 0.5, hiOp: 0.18 });
    bH([[120, 1352], [500, 1316], [900, 1326], [1300, 1344], [1640, 1330]], [[120, 1440], [500, 1440], [900, 1448], [1300, 1452], [1640, 1440]], 9, 4, { op: 0.4, ragged: 0.25 });
    groove([[110, 1340], [400, 1294], [800, 1310], [1200, 1334], [1520, 1298], [1680, 1344]], 10, 0.4); // its upper edge
    // --- the hip: the iliac crest rising under the skin, the hip's side mass, the groin line to the pubis off-frame
    mass([[-80, 900], [60, 812], [180, 730], [290, 716], [380, 790], [410, 960], [360, 1140], [240, 1260], [40, 1300], [-80, 1260]], { s: 90, op: 0.45 });
    mass([[20, 960], [150, 900], [260, 950], [290, 1100], [200, 1220], [60, 1230], [-20, 1120]], { s: 60, op: 0.38, hiOp: 0.22 }); // the great trochanter's swell
    groove([[296, 724], [372, 820], [404, 960], [388, 1110], [330, 1240]], 13, 0.5); // the crest's ridge
    f.line([[306, 722], [380, 824], [412, 962], [396, 1110]], 4, '#ffffff', { op: 0.45 }); // its lit lip
    groove([[290, 722], [180, 770], [60, 830], [-60, 880]], 9, 0.4); // the groin line
    bH([[300, 760], [366, 900], [360, 1080], [300, 1220]], [[120, 820], [190, 960], [180, 1110], [120, 1240]], 6, 4, { op: 0.3 });
    // --- the belly: a soft saddle between hip and ribs, the oblique bulging over the crest, sagging toward the floor
    mass([[372, 790], [470, 806], [600, 790], [700, 820], [760, 980], [700, 1180], [560, 1270], [430, 1220], [400, 1000]], { s: 80, op: 0.4, hiOp: 0.25 });
    bH([[420, 880], [430, 1020], [450, 1180]], [[700, 860], [730, 1010], [740, 1160]], 7, 4, { op: 0.26, ragged: 0.35 });
    groove([[560, 800], [610, 900], [600, 1000]], 7, 0.28); // the navel's fold
    f.flat(ell([592, 812], 16, 9, 0.3, 10), '#141c2c', { op: 0.55 });
    // --- the ribcage: each rib a ridge of ice, lit along its upper edge, a hatched trough below it; the costal margin
    // arching under the breast; the ribs show through the latissimus where it lies over them
    ribs.forEach((r, i) => {
      mass([add(r[0], [24, -10]), add(r[1], [20, -26]), add(r[2], [14, -22]), add(r[2], [-10, 16]), add(r[1], [-22, 26]), add(r[0], [-24, 14])], { s: 22, op: 0.5, hiOp: 0.38, sharp: true });
      bH(r.map(q => add(q, [-16, 14])), r.map(q => add(q, [-44, 40])), 3, 4, { op: 0.42, ragged: 0.2, fade: true });
      f.stroke(r.map(q => add(q, [18, -24])), 16, '#ffffff', { op: 0.2 }); f.line(r.map(q => add(q, [14, -18])), 6, '#ffffff', { op: 0.65 }); // the lit ridge, and the lit face above it
      V.rimeCrust(f, [lerp(r[1], r[2], 0.1), lerp(r[1], r[2], 0.8)].map(q => add(q, [16, -20])), 7, [-0.6, -1], { gap: 10, inkW: 0.8 });
    });
    groove(ribs.map(r => add(r[2], [-8, 16])), 12, 0.45); // the costal margin
    // --- the latissimus: a broad fan from the low back up into the armpit, its front edge a soft ridge over the ribs
    mass([...latEdge, [1380, 900], [1460, 1100], [1420, 1290], [900, 1320]], { s: 70, op: 0.32, hiOp: 0.22 });
    groove(latEdge, 12, 0.42);
    bH(latEdge.map(q => add(q, [-10, 12])), latEdge.map(q => add(q, [-60, 60])), 4, 4, { op: 0.32, fade: true });
    // serratus: finger-like slips on the upper ribs under the armpit
    for (let i = 3; i < 7; i++) { const q = lerp(ribs[i][1], ribs[i][2], 0.35); mass([add(q, [-30, 24]), add(q, [10, -30]), add(q, [70, -36]), add(q, [40, 20])], { s: 16, op: 0.4, hiOp: 0.3, sharp: true }); }
    // --- the breast, the peak of the hill: a heavy mass sagging toward the floor; its underside fold in deep shadow,
    // hatched along the curve; the pectoral running from the breastbone into the arm
    mass([[860, 520], [980, 440], [1100, 414], [1210, 446], [1260, 560], [1230, 710], [1140, 790], [1000, 812], [880, 760], [840, 640]], { s: 110, op: 0.5, hiOp: 0.32 });
    f.raw(`<path d="${E.smooth([[840, 760], [980, 820], [1120, 810], [1240, 730], [1230, 840], [1100, 890], [940, 880], [830, 830]])}" fill="#060a14" opacity="0.8" filter="url(#glowL820)"/>`);
    groove([[850, 770], [990, 822], [1130, 806], [1236, 724]], 16, 0.55); // the fold under the breast
    bH([[870, 740], [990, 790], [1120, 780], [1220, 700]], [[900, 640], [1000, 690], [1110, 680], [1190, 610]], 5, 4, { op: 0.35, fade: true });
    mass([[1140, 440], [1290, 470], [1400, 560], [1360, 700], [1240, 700], [1200, 560]], { s: 60, op: 0.36, hiOp: 0.28 }); // the pectoral
    // --- the clavicle, the hollow above it, the neck's tendon and the trapezius into the neck
    groove([[1400, 600], [1560, 690], [1760, 800]], 11, 0.5); f.line([[1404, 590], [1562, 678], [1760, 788]], 4, '#ffffff', { op: 0.45 });
    mass([[1560, 700], [1760, 800], [1900, 900], [1840, 1000], [1640, 900]], { s: 50, op: 0.45, hiOp: 0.15 }); // the hollow over the collarbone
    groove([[1700, 800], [1800, 920], [1870, 1120]], 9, 0.38);
    mass([[1500, 820], [1700, 900], [1900, 1000], [2000, 1220], [1880, 1300], [1600, 1200], [1440, 1000]], { s: 80, op: 0.35, hiOp: 0.2 }); // the shoulder blade and trapezius, pressed down
    // --- rime hatching: white feathered strokes along the lit faces, following each form
    bH([[160, 752], [228, 716], [300, 726], [372, 774]], [[170, 800], [236, 764], [300, 776], [366, 820]], 3, 3, { col: '#ffffff', op: 0.45, ragged: 0.45 });
    bH([[690, 712], [790, 604], [890, 506], [990, 446], [1090, 424], [1190, 436], [1290, 486]], [[700, 770], [800, 664], [900, 566], [1000, 506], [1090, 484], [1180, 496], [1270, 540]], 5, 3, { col: '#ffffff', op: 0.4, ragged: 0.45 });
    bH([[1420, 580], [1530, 668], [1680, 756], [1820, 836]], [[1420, 630], [1530, 714], [1670, 800], [1800, 874]], 3, 3, { col: '#ffffff', op: 0.4, ragged: 0.45 });
    // --- (ruler upgrade pass) faceted lit planes where the forms turn to the key light: the hip crest's top, the belly's
    // upper slope, the ribcage's upper face, the top of the breast, the shoulder; and the crevices cut dark: the groin, the
    // fold where the belly meets the hip, the trough between the ribs and the latissimus, the underside of the hip
    const lit = (pts, op) => f.flat(pts.map(q => [...q, 1]), '#ffffff', { op });
    lit([[150, 752], [228, 708], [300, 716], [360, 770], [300, 800], [210, 800]], 0.34);
    lit([[380, 790], [470, 806], [580, 790], [600, 850], [480, 870], [400, 850]], 0.22);
    lit([[690, 712], [790, 600], [880, 500], [930, 560], [840, 660], [740, 760]], 0.26);
    lit([[900, 480], [990, 436], [1090, 412], [1190, 424], [1220, 470], [1110, 470], [980, 500]], 0.38);
    lit([[1290, 476], [1400, 562], [1520, 650], [1500, 690], [1380, 610], [1280, 530]], 0.3);
    for (const [pts, w, op] of [[[[290, 722], [180, 790], [60, 850], [-60, 900]], 22, 0.55], [[[372, 800], [420, 900], [430, 1040], [400, 1160]], 20, 0.45], [[[720, 1190], [960, 1050], [1140, 910], [1230, 830]], 18, 0.5], [[[40, 1280], [240, 1290], [380, 1250]], 26, 0.5]]) { f.stroke(pts, w, '#04060e', { op: op * 0.6 }); f.stroke(pts, w * 0.4, '#04060e', { op }); }
    // --- the old ice skin: old cracks across the forms, and seams where earlier splits refroze
    V.oldCrack(f, [[200, 1000], [330, 1060], [470, 1120], [560, 1110]], 5);
    V.oldCrack(f, [[40, 1100], [120, 1180], [100, 1290]], 4);
    V.oldCrack(f, [[1180, 1320], [1260, 1200], [1380, 1150], [1440, 1060]], 5);
    V.oldCrack(f, [[1560, 1240], [1700, 1150], [1840, 1180], [1960, 1100]], 5);
    V.oldCrack(f, [[900, 980], [960, 900], [1060, 880]], 3.5);
    V.healedSeam(f, [[460, 860], [560, 940], [620, 1060], [640, 1180]], 7);
    V.healedSeam(f, [[1480, 960], [1560, 1080], [1700, 1100]], 6);
    V.rimeCrust(f, [[-80, 872], [40, 820], [140, 742], [228, 702], [300, 712], [372, 760], [470, 800], [580, 784], [680, 702], [780, 590], [880, 492], [980, 432], [1080, 408], [1180, 420], [1290, 470], [1400, 560]], 22, [-0.6, -1], { gap: 7, feather: 2.5 });
  } });
  V.icicles(f, [[860, 774], [990, 826], [1130, 810], [1230, 732]].sort((a, b) => a[0] - b[0]), 9, 30, 90); // under the breast
  V.icicles(f, [[372, 764], [470, 804], [580, 788]], 4, 24, 60);
  // ---- the rib gallery low between the ribs: ore-cart rails running into it down to the floor, a tipped cart beside
  const g1 = [990, 1220];
  V.adit(f, g1, 180, 200, -0.08, { cracks: 5 });
  const rA = [g1[0] - 70, g1[1] + 100], rB = [g1[0] - 250, gy - 30];
  for (const dx of [0, 40]) { f.line([add(rA, [dx, 0]), add(rB, [dx, 0])], 7, INK); f.line([add(rA, [dx, 0]), add(rB, [dx, 0])], 4, P.ironL); } // rails
  for (let i = 0; i < 5; i++) { const a = add(lerp(rA, rB, i / 4), [20, 0]); f.part([add(a, [-30, -6]), add(a, [30, -2]), add(a, [30, 12]), add(a, [-30, 8])], { fill: P.woodD, shade: 0.3, inkW: 1.2, cast: false }); }
  // the tipped cart: an iron-banded wooden box on its side, its ore spilled, glowing
  const ct = [1200, 1460];
  f.part([add(ct, [-90, -60]), add(ct, [70, -86]), add(ct, [96, 40]), add(ct, [-70, 70])].map(q => [...q, 1]), V.rimed({ fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'grain820', texOp: 0.7, maxShade: 50 }, 0.3));
  for (const t of [0.25, 0.75]) f.line([lerp(add(ct, [-90, -60]), add(ct, [70, -86]), t), lerp(add(ct, [-70, 70]), add(ct, [96, 40]), t)], 9, P.iron);
  for (const [dx, dy] of [[-96, 76], [86, 52]]) { const w0 = add(ct, [dx, dy]); f.part(ell(w0, 30, 30, 0, 14), { fill: P.iron, shade: 0.4, inkW: 1.6 }); f.rivet(w0, 5); }
  for (let i = 0; i < 5; i++) { const q = add(ct, [-140 - i * 30, 90 - (i % 2) * 18]); f.part(ell(q, 20, 14, f.r(), 8).map(z => [...z, 1]), { fill: '#2a2628', shadow: '#060506', light: '#6a6268', shade: 0.4, tex: 'craze820', texOp: 0.7 }); V.glow(f, q, 16, 10, P.lamp, 0.4); }
  // ---- the breast adit, with the miners' ladder of lashed poles up her flank to it and tally marks beside it
  const g2 = [870, 680];
  V.adit(f, g2, 220, 240, -0.35, { cracks: 7 });
  V.tally(f, [1010, 600], 13, 44, -0.35);
  const lad = [[380, gy - 40], [790, 820]], lad2 = [[460, gy - 30], [870, 830]];
  for (const [a0, b0] of [lad, lad2]) V.timber(f, a0, b0, 22, { state: 'ice', ends: 'b', crust: false });
  for (let i = 1; i < 10; i++) { const a0 = lerp(lad[0], lad[1], i / 10), b0 = lerp(lad2[0], lad2[1], i / 10); f.line([a0, b0], 10, INK); f.line([a0, b0], 6, P.woodL); if (i % 2) { f.line([add(a0, [-6, -8]), add(a0, [8, 8])], 3, '#7a6e58'); f.line([add(b0, [-6, -8]), add(b0, [8, 8])], 3, '#7a6e58'); } } // rungs, lashed
  // iron spikes and the abandoned pick in the ice skin
  for (const q of [[1150, 690], [1190, 730], [640, 960]]) { f.part([add(q, [-6, 0]), add(q, [6, 0]), add(q, [2, -60]), add(q, [-2, -62])], { fill: P.iron, shade: 0.35, inkW: 1.2, cast: false }); f.flat(ell(q, 12, 6, 0, 10), P.charS, { op: 0.6 }); }
  const pk = [560, 1020]; f.part(limb(pk, add(pk, [-120, -150]), 18, 16, { steps: 6 }), V.rimed({ fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'grain820', texOp: 0.6 }, 0.3));
  f.part([add(pk, [-60, 30]), add(pk, [10, -8]), add(pk, [60, 4]), add(pk, [10, 14])], { fill: P.iron, shadow: '#101012', shade: 0.4, inkW: 1.4 }); V.icicles(f, [add(pk, [-120, -150]), add(pk, [-60, -76])], 2, 12, 26);
  // ---- the shoulder adit under the collarbone, and the winch post driven into the breast, its rope coil
  const g3 = [1660, 1060];
  V.adit(f, g3, 170, 190, 0.12, { cracks: 6 });
  const wp = [1120, 560];
  V.timber(f, add(wp, [0, 60]), add(wp, [-10, -190]), 44, { state: 'ice', ends: 'b' });
  V.timber(f, add(wp, [-60, -170]), add(wp, [60, -176]), 56, { state: 'ice', ends: true }); // the winch drum
  for (let i = 0; i < 7; i++) { const x = -44 + i * 14; f.line([add(wp, [x, -196]), add(wp, [x + 4, -150])], 7, INK); f.line([add(wp, [x, -196]), add(wp, [x + 4, -150])], 4.4, mix('#6a5e48', P.ice, 0.25)); } // the rope wound on it
  f.line([add(wp, [64, -174]), add(wp, [96, -174]), add(wp, [96, -120]), add(wp, [118, -120])], 8, INK); f.line([add(wp, [64, -174]), add(wp, [96, -174]), add(wp, [96, -120]), add(wp, [118, -120])], 5, P.ironL); // the crank
  V.rope(f, [add(wp, [20, -120]), add(wp, [80, -60]), add(wp, [100, 40]), add(wp, [90, 120])], 7, { col: mix('#6a5e48', P.ice, 0.25) });
  // ---- the torque of black obsidian beads across her collarbone, each the size of a boulder
  const tq = V.spline([[1580, 690], [1720, 772], [1860, 856], [1990, 940]], 72);
  tq.forEach((q, i) => { const r = 56 + (i % 3) * 12, b = ell(q, r, r * 0.86, 0.4, 12).map((z, j) => [z[0] + (f.r() - 0.5) * 10, z[1] + (f.r() - 0.5) * 10, j % 3 === 0 ? 1 : 0]); V.glassPlate(f, b, { state: i % 2 ? 'ice' : undefined, chip: i % 2 === 0 }); });
  V.puff(f, [870, 470], 300, 90, { op: 0.26, big: true, sway: 30 }); V.puff(f, [1660, 940], 240, 70, { op: 0.24, big: true });

  // ================= the lifted arm, its root: a deltoid cap over the shoulder joint, the arm swelling with the
  // biceps toward the head and the triceps toward her feet, never an even tube. The pectoral and latissimus folds and
  // the armpit hollow are drawn on the body over the arm's root, so the arm grows out of the chest wall.
  f.bone('upperarm');
  const aL = E.len(sub(EL, SH)), ad = E.norm(sub(EL, SH)), an = [-ad[1], ad[0]], A = (u, v) => add(add(SH, mul(ad, u * aL)), mul(an, v));
  const armO = [[-0.06, 150], [0.02, 214], [0.12, 230], [0.24, 204], [0.33, 160], [0.45, 170], [0.62, 176], [0.8, 152], [0.95, 140], [1.08, 140], [1.08, -140], [0.92, -150], [0.75, -170], [0.58, -180], [0.42, -166], [0.28, -150], [0.14, -162], [0.04, -184], [-0.06, -164], [-0.13, 0]].map(([u, v]) => A(u, v));
  const rootCut = [A(0.24, -420), A(0.2, -182), A(0.13, -112), A(0.06, -34), A(0.035, 100), A(0.0, 250), A(0.0, 420), A(2, 420), A(2, -420)];
  V.clipDraw(f, rootCut, () => {
      V.iced(f, armO, Object.assign({}, SKIN, { maxShade: 64 }), { nFacets: 6, fs: 3, cracks: 5, after: () => {
      mass([A(-0.06, 150), A(0.04, 220), A(0.16, 222), A(0.3, 150), A(0.24, 20), A(0.06, -60), A(-0.04, 40)], { s: 70, op: 0.45, hiOp: 0.35 }); // the deltoid
      mass([A(0.3, 40), A(0.45, 166), A(0.62, 172), A(0.8, 120), A(0.7, 10), A(0.45, -10)], { s: 60, op: 0.3, hiOp: 0.3 }); // the biceps
      mass([A(0.3, -150), A(0.42, -40), A(0.6, -40), A(0.8, -150), A(0.6, -184)], { s: 50, op: 0.45, hiOp: 0.15 }); // the triceps
      groove([A(0.04, 210), A(0.2, 120), A(0.33, 40), A(0.38, -10)], 10, 0.42); // the deltoid's front edge
      groove([A(0.34, 150), A(0.4, 110)], 8, 0.4);
      wH(A(0.05, 0), A(1.05, 0), 170, 150, -1, 14, { w: 4, op: 0.36, bow: 0.25 });
      bH([A(0.1, 200), A(0.4, 150), A(0.8, 140)], [A(0.1, 150), A(0.4, 100), A(0.8, 100)], 3, 3, { col: '#ffffff', op: 0.4, ragged: 0.45 });
      V.oldCrack(f, [A(0.5, -170), A(0.56, -60), A(0.66, 20)], 4);
    } });
    V.icicles(f, [A(0.3, -152), A(0.78, -152)].sort((a, b) => a[0] - b[0]), 7, 40, 110);
    V.rimeCrust(f, [A(0.02, 214), A(0.12, 230), A(0.24, 204), A(0.45, 170), A(0.9, 150)], 18, [-0.6, -1], { gap: 7, feather: 2 });
  });
  f.bone('body');
  // the arm is cut along its root line (rootCut), so the body runs on under it with no outline or shadow band; across
  // that line the pectoral fold sweeps up onto the arm, the latissimus fold comes up from the back, the armpit hollows
  // between them, and the deltoid cap runs on over the shoulder toward the collarbone
  mass([A(0.18, -200), A(0.12, -120), A(0.02, -60), [1180, 760], [1060, 700], [1040, 560], [1150, 480]], { s: 60, op: 0.38, hiOp: 0.32 }); // the pectoral fold
  mass([A(0.14, 230), A(0.0, 262), A(-0.14, 220), A(-0.12, 60), A(0.06, 80)], { s: 60, op: 0.35, hiOp: 0.3 }); // the deltoid cap running on over the shoulder
  f.raw(`<path d="${E.smooth([[1070, 760], [1150, 726], [1206, 800], [1170, 866], [1090, 846]])}" fill="#04060e" opacity="0.85" filter="url(#glow820)"/>`); // the armpit
  mass([[1090, 850], [1170, 860], [1250, 900], [1230, 1000], [1120, 960]], { s: 30, op: 0.4, hiOp: 0.25 }); // the latissimus fold
  f.stroke([A(0.2, -198), A(0.15, -150), A(0.1, -100), A(0.05, -36)], 9, '#141c2c', { op: 0.5 }); // the pectoral fold's edge over the arm
  f.line([A(0.185, -192), A(0.135, -140), A(0.09, -94)].map(q => add(q, [-4, 8])), 3.5, '#ffffff', { op: 0.5 });
  groove([[1076, 740], [1150, 732], [1200, 790]], 8, 0.5); groove([[1100, 870], [1170, 880], [1236, 866]], 8, 0.45);
  groove([[1400, 600], [1500, 668], A(0.02, 200)], 10, 0.45); // the collarbone running into the shoulder

  // ================= the head: thrown back at the edge, cropped; eyes frozen shut, lips parted breathing steam;
  // the miners' lamp hook hammered into the jaw; grey frozen braids spilling off the frame like a second glacier
  f.bone('head');
  V.rimeCrust(f, [[2220, 1010], [2400, 990]], 16, [-0.5, -1], { gap: 7 });
  // the head in profile, thrown back (independent review: rebuilt): face up, the throat rising out of the chest to the
  // chin, the lips, the nose the peak, the brow and the forehead falling away past the frame's edge; the back of the
  // skull and neck rest on the floor. The neck is cut along a line inside the body so it flows into the shoulder with
  // no outline. Jaw line, cheekbone, brow ridge and the long neck muscle are modelled; the ear sits behind the jaw's
  // angle, mostly lost in the braids.
  const face = [[1900, 860], [1960, 872], [2010, 858], [2060, 832], [2090, 806], [2112, 792], [2136, 774], [2150, 752], [2162, 730], [2178, 704], [2192, 692], [2208, 700], [2222, 722], [2244, 734], [2280, 718], [2320, 718], [2372, 748], [2420, 800], [2460, 880], [2460, 1480], [1990, 1480], [1900, 1300]];
  const HSK = Object.assign({}, SKIN, { maxShade: 70 });
  const shC = [[1946, 600], [1946, 878], [2004, 980], [2056, 1120], [2068, 1300], [2040, 1500]]; // the near shoulder's contour, in front of the neck
  const fd = V.clipDraw(f, [...shC, [2040, 1700], [2600, 1700], [2600, 600]], () => V.iced(f, face, HSK, { nFacets: 8, fs: 3, cracks: 6, after: () => {
    // under the jaw and down the neck: the plane turned away from the light, crosshatched
    mass([[2000, 880], [2090, 820], [2250, 1010], [2320, 1120], [2300, 1400], [2040, 1440], [1980, 1100]], { s: 120, op: 0.45, hiOp: 0.15 });
    bH([[2020, 900], [2140, 960], [2250, 1060]], [[2010, 1200], [2140, 1260], [2260, 1330]], 7, 4, { op: 0.32 });
    // the long neck muscle from behind the ear to the breastbone, a ridge with its lit edge
    mass([[1960, 890], [2060, 920], [2250, 1040], [2350, 1100], [2330, 1160], [2200, 1110], [2040, 990], [1950, 950]], { s: 30, op: 0.42, hiOp: 0.4, sharp: true });
    groove([[1960, 950], [2060, 1000], [2200, 1110], [2320, 1160]], 9, 0.45);
    // the jaw: its lower edge from the chin back to the angle and up the ramus to the ear
    mass([[2090, 806], [2160, 820], [2260, 900], [2290, 1000], [2250, 1012], [2160, 920], [2086, 840]], { s: 26, op: 0.35, hiOp: 0.35, sharp: true });
    groove([[2084, 830], [2160, 900], [2246, 1010], [2290, 1000], [2310, 960]], 11, 0.55);
    // the cheekbone, the hollow under it, the temple
    mass([[2200, 820], [2260, 790], [2330, 820], [2330, 880], [2260, 900], [2200, 870]], { s: 30, op: 0.4, hiOp: 0.45, sharp: true });
    groove([[2190, 880], [2250, 910], [2320, 900]], 8, 0.35);
    mass([[2330, 770], [2400, 780], [2440, 860], [2380, 900], [2330, 850]], { s: 40, op: 0.35, hiOp: 0.2 });
    // the brow ridge over the shut eye, and the nose's side plane
    mass([[2236, 736], [2280, 720], [2330, 722], [2360, 750], [2300, 760], [2250, 752]], { s: 16, op: 0.45, hiOp: 0.5, sharp: true });
    mass([[2160, 736], [2190, 696], [2214, 708], [2230, 760], [2200, 790], [2166, 770]], { s: 16, op: 0.4, hiOp: 0.45, sharp: true });
    // the eye socket: a soft hollow between brow, nose and cheek
    mass([[2226, 760], [2276, 752], [2326, 770], [2316, 812], [2260, 824], [2222, 800]], { s: 18, op: 0.55, hiOp: 0.1, shadow: '#141a2c', sharp: true });
    // rime hatching on the lit faces: brow, cheek, the throat's top
    bH([[1960, 876], [2040, 852], [2086, 816]], [[1966, 904], [2046, 880], [2094, 846]], 2, 3, { col: '#ffffff', op: 0.45, ragged: 0.4 });
    bH([[2290, 732], [2360, 754], [2420, 806]], [[2290, 762], [2356, 784], [2410, 836]], 3, 3, { col: '#ffffff', op: 0.4, ragged: 0.4 });
    V.oldCrack(f, [[2140, 1180], [2220, 1240], [2340, 1250]], 4);
    V.oldCrack(f, [[2350, 900], [2390, 960], [2380, 1020]], 3);
    f.raw(`<path d="${E.smooth(shC.slice(1).concat([[2120, 1500], [2130, 1200], [2060, 950]]))}" fill="#0a0f1c" opacity="0.5" filter="url(#glow820)"/>`); // the shoulder's shadow on the neck
  } }));
  f.stroke(shC.slice(1), 8, INK, { op: 0.6 }); f.line(shC.slice(1).map(q => add(q, [-5, -3])), 3, '#ffffff', { op: 0.35 }); // the shoulder's edge
  // the closed eye, frozen shut: the lid's curve, the crease above, lashes caked in rime
  f.stroke([[2236, 790], [2272, 806], [2312, 796]], 8, '#1a2132'); f.line([[2238, 794], [2272, 811], [2312, 800]], 3.4, P.rime, { op: 0.9 });
  f.line([[2244, 772], [2276, 778], [2306, 770]], 2.6, '#2a3446', { op: 0.7 });
  // the nose: the wing and the nostril, rime in it
  f.line([[2164, 744], [2184, 760], [2206, 754]], 4, '#22293a'); f.flat(ell([2178, 748], 12, 6, -0.6, 10), '#141a28');
  // the lips, parted, breathing steam
  f.stroke([[2100, 798], [2120, 782], [2146, 770]], 10, '#5a6a7a'); f.stroke([[2090, 814], [2112, 806], [2138, 792]], 9, '#4a5868');
  f.flat([[2104, 800], [2124, 786], [2142, 778], [2128, 796], [2108, 808]], '#0e1420');
  V.puff(f, [2124, 770], 300, 70, { op: 0.36, big: true, drift: -60, sway: 26 });
  // the ear behind the jaw's angle, tilted with the thrown-back head: helix, bowl and lobe, braids falling over it
  const ear = [[2316, 974], [2352, 950], [2400, 960], [2428, 1000], [2420, 1050], [2386, 1080], [2350, 1070], [2330, 1030]];
  f.part(ear, Object.assign({}, SKIN2, { maxShade: 24, inkW: 1.6 }));
  f.flat([[2350, 986], [2390, 980], [2408, 1010], [2394, 1046], [2362, 1040], [2346, 1012]], '#2a3446', { op: 0.55 });
  f.line([[2334, 980], [2370, 958], [2410, 972], [2424, 1010]], 3, '#ffffff', { op: 0.45 });
  for (let i = 0; i < 4; i++) { const x = 2372 + i * 34; V.hairClump(f, [[x, 940], [x + 10, 1100], [x + 6, 1300], [x + 20, gy + 20]], 52, { pal: ['#7a8288', '#8e969c', '#a2aab0', '#62686e'], n: 6 }); for (let k = 0; k < 4; k++) f.line([[x - 22, 1000 + k * 90], [x + 28, 1016 + k * 90]], 3, INK, { op: 0.5 }); }
  V.icicles(f, [[2050, 838], [2100, 812]], 3, 24, 60); V.icicles(f, [[2100, 850], [2170, 914], [2240, 1000]], 6, 30, 80); // icicles hanging from the jaw
  V.rimeCrust(f, [[1960, 872], [2060, 832], [2136, 774], [2178, 704], [2192, 692]], 14, [-0.6, -1], { gap: 7 });
  const hF = frame([2140, 1060], 0, 640);
  // the lamp hook hammered into her jaw, a dead lamp still on it
  const lh = [2120, 1090];
  f.part([add(lh, [-8, 0]), add(lh, [8, 0]), add(lh, [6, 50]), add(lh, [30, 70]), add(lh, [24, 80]), add(lh, [-4, 58])], { fill: P.iron, shade: 0.35, inkW: 1.4, cast: false });
  const lc = add(lh, [28, 130]); f.line([add(lh, [26, 76]), add(lc, [0, -44])], 2.4, P.iron);
  f.part([add(lc, [-20, -40]), add(lc, [20, -40]), add(lc, [24, 34]), add(lc, [-24, 34])], { fill: P.iron, shade: 0.4, inkW: 1.4, sharp: true }); f.flat([add(lc, [-14, -30]), add(lc, [14, -30]), add(lc, [16, 24]), add(lc, [-16, 24])], P.glass, { op: 0.6 }); V.icicle(f, add(lc, [0, 34]), 30, 8);

  // ================= the lifted arm, coming back down off the top of the frame: the forearm, the hand hanging open,
  // long cracked nails; an ore bucket hanging from the little finger by its bail
  f.bone('forearm');
  V.iced(f, limb(lerp(EL, SH, 0.05), WR, 280, 210, { steps: 14, p: [[0.3, 0.12, 0.2]], q: [[0.25, 0.1, 0.2]] }), Object.assign({}, SKIN, { maxShade: 70 }), { nFacets: 8, fs: 3, cracks: 6, after: () => {
    mass([lp(EL, WR, 0.15, 150), lp(EL, WR, 0.45, 160), lp(EL, WR, 0.7, 100), lp(EL, WR, 0.6, 0), lp(EL, WR, 0.2, 20)], { s: 60, op: 0.4, hiOp: 0.25 }); // the forearm's flexor mass
    wH(lerp(EL, WR, 0.15), WR, 140, 105, 1, 12, { w: 4, op: 0.36, t1: 0.92 });
  } });
  groove([lp(EL, WR, 0.4, -80), lp(EL, WR, 0.7, -90), lp(EL, WR, 0.95, -70)], 8, 0.4);
  V.icicles(f, [lp(EL, WR, 0.4, 110), lp(EL, WR, 0.95, 96)].sort((a, b) => a[0] - b[0]), 8, 40, 120);
  V.adit(f, lp(EL, WR, 0.55, 0), 110, 120, V.ang(EL, WR) - Math.PI / 2, { cracks: 4, ash: 10 }); // a trial cut even in her forearm
  f.bone('hand');
  const tips = V.clawHand(f, add(WR, [0, -30]), Math.PI / 2 + 0.08, 470, { look: Object.assign({}, SKIN, { maxShade: 50 }), curl: [0.35, 0.3, 0.28, 0.24], spread: 0.14, thumbAng: 0.6, nail: '#8a96a0', flip: true });
  for (const t of tips) { f.line([add(t, [-6, -20]), add(t, [4, -4])], 2, INK, { op: 0.7 }); V.icicle(f, add(t, [0, 4]), V.R(f, 20, 50), 9); } // cracked nails, icicles off the fingertips
  f.bone('bucket');
  const ft = tips[3], bb2 = add(ft, [10, 150]);
  f.line([ft, add(bb2, [-40, -36])], 4, INK); f.line([ft, add(bb2, [40, -36])], 4, INK); f.line([ft, add(bb2, [-40, -36])], 2.4, P.ironL); f.line([ft, add(bb2, [40, -36])], 2.4, P.ironL);
  const buck = [add(bb2, [-46, -40]), add(bb2, [46, -40]), add(bb2, [36, 46]), add(bb2, [-36, 46])];
  V.iced(f, buck, V.rimed({ fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'grain820', texOp: 0.7 }, 0.3), { nFacets: 1 });
  for (const v of [-24, 26]) f.line([add(bb2, [-44 + Math.abs(v) * 0.1, v]), add(bb2, [44 - Math.abs(v) * 0.1, v])], 6, P.iron);
  for (let i = 0; i < 3; i++) { const q = add(bb2, [-24 + i * 24, -46]); f.part(ell(q, 16, 12, f.r(), 8).map(z => [...z, 1]), { fill: '#2a2628', shadow: '#060506', shade: 0.4, tex: 'craze820', texOp: 0.7, cast: false }); V.glow(f, q, 12, 8, P.lamp, 0.45); }
  V.icicles(f, [add(bb2, [-36, 46]), add(bb2, [36, 46])], 3, 14, 30);

  // ================= the glacier floor she lies in, heaped against her side; obsidian rubble along it (root)
  f.bone('root');
  const floor = [[0, 1470], [300, 1450], [700, 1480], [1100, 1460], [1500, 1490], [1900, 1470], [2400, 1490], [2400, 1600], [0, 1600]];
  V.iced(f, floor, V.ICE(f, { fill: '#8a9aa8', light: '#c8d4dc', maxShade: 40 }), { nFacets: 10, fs: 3, cracks: 8 });
  V.rimeCrust(f, floor.slice(0, 7), 12, [-1, -0.3], { gap: 8 });
  V.rubble(f, 260, 2300, gy - 2, 22, 1.8);
  for (const x of [600, 1300, 1900]) V.crackNet(f, [x, gy - 30], -Math.PI / 2 + (f.r() - 0.5), 90, 3, { depth: 1 });
  return f;
}

// ------------------------------------------------------------------ THE FIRSTBREAKER (ruler, 3.5)
// The hold's foreman of miners, who was at the face of the deepest shaft when it broke into fire, grown vast and
// climbing out of the shaft ever since: only his head, shoulders, arms and chest show above the timbered collar of the
// shaft. Both forearms are hooked over the rim; the near hand grips the pick he has driven into the ice for purchase;
// the far hand hooks over the rim's edge. He leans out over the company, the head near the top of the frame, cropped at
// both sides by the headframe's legs, its pulley wheel cut by the top edge. His weight hangs on his forearms.
// Split: horizontal, exactly at the shaft rim. Below it what is still down the shaft burns: the chest just above the
// collar charred with wide molten seams, the tunic charred away, curls of ash and heat rolling up out of the shaft.
// Above it the glacier wind across the shaft mouth has rimed his shoulders, arms and head white, icicles in the brows
// and beard. The crack rings his chest at the level of the rim, glowing and steaming.
// Rig (the Motion line): shaft (root: collar, headframe, pulley) > torso (pivot at the rim, so he hauls up an inch) >
// head; upperarm_n > forearm_n > hand_n > pick (the downward pick blow); upperarm_f > forearm_f > hand_f; chain and
// bucket on the torso; the two clinging thralls on the torso.
function firstbreaker() {
  const [CW, CH] = TIERS.ruler;
  const f = new Fig(V.base(821, CH, { grimeY: 1800 })); V.texturesB(f);
  const gy = f.o.groundY, H = 350, rimY = 1090;
  const N = [830, 520], C = [744, 760], Pv = [720, 1280];
  const S = B.spine(N, C, Pv, H);
  const SN = [610, 610], EN = [340, 1040], WN = [812, 1014]; // (review) elbow set out wide so the arm covers less chest
  const SF = [1030, 560], EF = [1060, 1050], WF = [1300, 1070];
  const HC = [1000, 316], hA = 0.26, hF = frame(HC, hA, H);
  const pickTop = [798, 700], pickHead = [822, rimY + 20];
  f.joint('shaft', [800, 1500]).joint('torso', [740, rimY], 'shaft').joint('head', S.at(0.2, -0.05), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('pick', WN, 'hand_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('chain', [760, 600], 'torso').joint('bucket', [470, 1040], 'chain').joint('thralls', [520, 660], 'torso');
  const SKI = { fill: '#bcc6cc', shadow: '#36425a', light: '#f0f4f6', shade: 0.5, tex: 'mottle821', texOp: 0.6, maxShade: 200 };
  const SKC = { fill: '#3a2c26', shadow: P.charS, light: '#7a5a48', shade: 0.42, tex: 'craze821', texOp: 0.8, maxShade: 90 };
  const LEAi = V.rimed(V.LEA(f, { maxShade: 90 }), 0.42), WOOLc = V.charred(V.WOOL(f, { maxShade: 80 }), 0.5);
  // the crack ringing his chest at the rim: ice above, fire below
  const Sp = V.splitLine(f, [[200, rimY - 110], [500, rimY - 96], [760, rimY - 124], [1000, rimY - 100], [1400, rimY - 112]], [0, -1], 14, 16);
  const both = (pts, iL, cL, o = {}) => V.thermal(f, pts, Sp, iL, cL, Object.assign({ riftW: 8, nFacets: 6, nEmbers: 10, fs: 2 }, o));
  const groove = (pts, w = 6, op = 0.45, c = '#10141e') => f.stroke(pts, w, c, { op });

  // ================= the headframe: two rimed timber legs either side, a cross-beam, the pulley wheel cut by the top
  f.bone('shaft');
  V.glow(f, [760, rimY], 700, 200, P.lamp, 0.35, true); // heat rolling up out of the shaft behind him
  // (review) the headframe broken in silhouette, so he is no longer a framed block: the cross-beam has snapped and its
  // two halves sag from the legs with splintered ends; the pulley wheel hangs tilted off a sprung axle bracket, cut by
  // the top edge; the hoist chain with its hook and a frayed rope hang from the broken ends
  const pc = [1000, 30], pA = -0.45;
  f.line([[1110, -60], [1060, -10], pc], 18, INK); f.line([[1110, -60], [1060, -10], pc], 11, P.ironL); // the bent axle bracket
  const wheel = ell(pc, 230, 118, pA, 44);
  f.line(wheel.concat([wheel[0]]), 42, INK); f.line(wheel.concat([wheel[0]]), 33, V.rimed({ fill: P.wood }, 0.3).fill);
  f.line(ell(pc, 214, 104, pA, 44).slice(26, 40), 3, P.iceL, { op: 0.6 }); f.line(ell(pc, 246, 132, pA, 44).slice(4, 16), 4, '#141010', { op: 0.5 }); // the rim's groove and its lit lip
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2, q = add(pc, rot([Math.cos(a) * 214, Math.sin(a) * 106], pA)); f.line([pc, q], 20, INK); f.line([pc, q], 13, P.wood); }
  f.part(ell(pc, 40, 26, pA, 14), { fill: P.iron, shade: 0.4, inkW: 1.6 }); f.rivet(pc, 8, P.ironL);
  V.icicles(f, wheel.slice(14, 28).sort((p, q) => p[0] - q[0]), 8, 20, 60);
  const snap = (a0, b0, w) => { // a beam half: its fixed end on the leg, a splintered snapped end hanging
    V.timber(f, a0, b0, w, { state: 'ice', ends: 'a' });
    const d = E.norm(sub(b0, a0)), n = [-d[1], d[0]];
    for (let k = 0; k < 5; k++) { const o = (k / 4 - 0.5) * w * 0.9, q = add(b0, mul(n, o)), l = V.R(f, 20, 70); f.part([add(q, mul(n, -w * 0.1)), add(q, mul(n, w * 0.1)), add(add(q, mul(d, l)), mul(n, (f.r() - 0.5) * 12))], { fill: P.woodL, shadow: P.woodD, shade: 0.3, inkW: 1.1, cast: false }); }
    V.rimeCrust(f, [add(a0, mul(n, -w / 2)), add(b0, mul(n, -w / 2))], 14, [-0.6, -1], { gap: 7 });
  };
  snap([140, 40], [600, 150], 72); snap([1500, 20], [1190, 78], 64);
  V.chainLinks(f, [[560, 150], [552, 300], [560, 440]], 30); // the hoist chain from the snapped end, its hook swinging
  f.part([[548, 440], [574, 440], [578, 500], [610, 520], [604, 470], [624, 476], [624, 530], [584, 552], [552, 510]], { fill: P.iron, shadow: '#0e0c0c', shade: 0.4, inkW: 1.6 });
  V.rope(f, [[1300, 60], [1296, 200], [1310, 330], [1302, 420]], 12, { col: mix('#6a5e48', P.ice, 0.25) }); // a rope off the other half, frayed
  for (let k = -2; k <= 2; k++) f.line([[1302, 418], [1302 + k * 7, 448 + Math.abs(k) * 4]], 2.4, '#5a4e3a');
  V.icicles(f, [[1290, 200], [1316, 330]], 2, 14, 30);

  // ================= the two small rimeburnt thralls clinging to his back, climbing out with him (behind his shoulder)
  f.bone('thralls');
  const thrall = (c, s, lean) => {
    const T = pts => pts.map(q => add(c, rot([q[0] * s, q[1] * s], lean)));
    const body = T([[-40, 0], [40, -10], [56, 150], [-30, 170]]);
    V.thermal(f, body, V.splitLine(f, T([[0, -100], [-4, 60], [6, 260]]), rot([-1, 0], lean), 4, 10), V.rimed(V.LEA(f), 0.25), V.charred(V.LEA(f), 0.6), { riftW: 2, faint: true });
    f.part(limb(T([[-20, 20]])[0], T([[-70, 110]])[0], 30 * s, 24 * s, { steps: 6 }), V.rimed(V.LEA(f), 0.3)); // the back arm, clutching lower
    const hc = T([[6, -60]])[0], h = 62 * s, hf = frame(hc, lean + 0.1, h);
    B.head(f, hc, h, lean + 0.1, { skin: '#4a3c34', jaw: 1.05, nose: 1.05, mouth: 'set', squint: 0.6, faceShade: 0.8, noEar: true, eyeWhite: '#6a4a3a', iris: P.lamp, browCol: '#1c1412', hairCol: '#1c1412', beard: 'stubble', beardCol: '#140e0c' });
    V.seam(f, hf([[0.3, 0.02], [0.16, 0.08], [0.06, 0.2]]), 1.4);
    const hood = hf([[0.34, -0.44], [0.12, -0.62], [-0.22, -0.64], [-0.5, -0.46], [-0.62, -0.1], [-0.6, 0.32], [-0.48, 0.62], [-0.22, 0.74], [0.06, 0.7], [0.24, 0.62], [0.3, 0.54], [0.1, 0.5], [-0.04, 0.3], [-0.08, 0.0], [0.02, -0.28], [0.2, -0.38]]);
    V.iced(f, hood, V.rimed(V.LEA(f), 0.4), { nFacets: 2 });
    V.rimeCrust(f, hf([[-0.22, -0.66], [-0.52, -0.48], [-0.64, -0.1]]), 5, [-1, -0.2], { gap: 5 });
    f.part(limb(T([[30, 10]])[0], T([[118, -40]])[0], 32 * s, 26 * s, { steps: 6 }), V.charred(V.LEA(f), 0.4)); // the arm reaching onto his shoulder
    f.part(ell(T([[122, -44]])[0], 17 * s, 13 * s, lean, 8), { fill: '#3a2e28', shade: 0.4, inkW: 1.2 }); // the gripping fist
    V.icicles(f, [T([[-46, 40]])[0], T([[-30, 160]])[0]].sort((p, q) => p[0] - q[0]), 3, 8, 20);
  };
  thrall([380, 700], 2.0, -0.35); thrall([470, 470], 1.8, 0.1);

  // ================= far arm (behind, toward the front): rimed; the forearm hooked over the rim, the hand over the edge
  f.bone('upperarm_f');
  f.part(limb(SF, EF, 230, 190, { steps: 12, p: [[0.4, 0.14, 0.2]], q: [[0.3, 0.12, 0.2]] }), Object.assign({}, SKI, { fill: mix(SKI.fill, '#000', 0.18) }));
  V.icicles(f, [lp(SF, EF, 0.4, -110), lp(SF, EF, 0.85, -94)].sort((p, q) => p[0] - q[0]), 5, 30, 70);
  f.bone('forearm_f');
  both(limb(lerp(EF, SF, 0.08), WF, 190, 150, { steps: 12, p: [[0.25, 0.14, 0.2]] }), Object.assign({}, SKI, { fill: mix(SKI.fill, '#000', 0.18) }), SKC, { riftW: 3, faint: true });
  f.bone('hand_f');
  const tipsF = V.clawHand(f, add(WF, [10, 0]), 0.9, 230, { look: Object.assign({}, SKI, { fill: mix(SKI.fill, '#000', 0.18), maxShade: 40 }), curl: [0.9, 0.95, 0.95, 0.9], spread: 0.08, thumbAng: 0.3, flip: true });
  V.icicles(f, tipsF.slice(0, 4).sort((p, q) => p[0] - q[0]), 4, 14, 34);

  // ================= torso: the chest above the rim, rimed; just above the collar charred with wide molten seams
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.62, 0.52], [0.05, 1.0, 0.92], [0.25, 1.06, 1.12], [0.45, 0.98, 1.08], [0.65, 0.96, 0.98], [0.9, 0.98, 0.92], [1.1, 0.96, 0.9]]);
  const td = both(torso, SKI, SKC, { charAfter: () => { for (const x of [520, 700, 900]) V.crackNet(f, [x, rimY - 20], -Math.PI / 2 + (f.r() - 0.5), 80, 4, { depth: 1 }); V.flakes(f, [760, rimY - 30], 260, 30, 18, 1.6); } });
  // (review) the chest modelled: two pectoral masses meeting at a grooved breastbone, the near one broad and turning
  // toward the light, the far one foreshortened; under them the ribcage shows through the frost, the serratus slips on
  // the far side, the gut rolls over the rim; the trapezius climbs from the shoulders into the neck
  V.clipDraw(f, td, () => {
    const pecN = [S.at(-0.2, 0.04), S.at(0.15, -0.06), S.at(0.5, -0.02), S.at(0.54, 0.22), S.at(0.44, 0.4), S.at(0.15, 0.44), S.at(-0.15, 0.34)];
    const pecF = [S.at(0.58, -0.02), S.at(0.86, -0.04), S.at(1.04, 0.1), S.at(1.02, 0.32), S.at(0.84, 0.42), S.at(0.62, 0.36)];
    V.mass(f, pecN, { s: 70, op: 0.5, hiOp: 0.38 }); V.mass(f, pecF, { s: 50, op: 0.55, hiOp: 0.3 });
    f.raw(`<path d="${E.smooth([S.at(-0.1, 0.38), S.at(0.45, 0.42), S.at(1.0, 0.36), S.at(1.0, 0.5), S.at(0.4, 0.56), S.at(-0.1, 0.5)])}" fill="#0e1422" opacity="0.5" filter="url(#glow821)"/>`); // the shadow under the pectorals
    groove([S.at(-0.14, 0.36), S.at(0.15, 0.45), S.at(0.44, 0.41), S.at(0.55, 0.3)], 14, 0.55); groove([S.at(0.6, 0.36), S.at(0.84, 0.43), S.at(1.03, 0.32)], 12, 0.5); // their heavy lower edges
    V.bandHatch(f, [S.at(-0.1, 0.32), S.at(0.15, 0.4), S.at(0.42, 0.36)], [S.at(-0.05, 0.18), S.at(0.15, 0.24), S.at(0.38, 0.2)], 4, 5, { op: 0.32, fade: true });
    V.bandHatch(f, [S.at(0.62, 0.32), S.at(0.84, 0.38), S.at(1.0, 0.28)], [S.at(0.7, 0.1), S.at(0.86, 0.14), S.at(1.0, 0.1)], 5, 5, { op: 0.34 });
    groove([S.at(0.54, -0.04), S.at(0.56, 0.2), S.at(0.55, 0.46), S.at(0.52, 0.56)], 12, 0.5); f.line([S.at(0.5, -0.02), S.at(0.52, 0.2), S.at(0.51, 0.44)], 4, '#ffffff', { op: 0.4 }); // the breastbone
    f.flat(ell(S.at(0.53, 0.56), 16, 12, 0, 10), '#10141e', { op: 0.5 }); // the pit under the breastbone
    // the ribs under the frost, arching out and down from the breastbone; the costal margin
    for (const [sg, u0, n] of [[-1, 0.5, 4], [1, 0.58, 3]]) for (let i = 0; i < n; i++) {
      const v0 = 0.46 + i * 0.07, r = [S.at(u0 + sg * 0.04, v0), S.at(u0 + sg * (0.3 + i * 0.04), v0 + 0.06), S.at(u0 + sg * (0.62 + i * 0.05), v0 + 0.16)];
      V.mass(f, [add(r[0], [0, -8]), add(r[1], [0, -12]), add(r[2], [0, -12]), add(r[2], [0, 10]), add(r[1], [0, 12]), add(r[0], [0, 8])], { s: 14, op: 0.45, hiOp: 0.4, sharp: true });
      f.stroke(r.map(q => add(q, [0, 14])), 6, '#10141e', { op: 0.4 }); f.line(r.map(q => add(q, [4, -9])), 3, '#ffffff', { op: 0.4 });
    }
    groove([S.at(0.0, 0.62), S.at(0.3, 0.6), S.at(0.53, 0.56), S.at(0.8, 0.6), S.at(1.0, 0.66)], 10, 0.4);
    for (let i = 0; i < 3; i++) V.mass(f, [S.at(0.95, 0.4 + i * 0.07), S.at(1.06, 0.38 + i * 0.07), S.at(1.08, 0.44 + i * 0.07), S.at(0.96, 0.46 + i * 0.07)], { s: 10, op: 0.45, hiOp: 0.4, sharp: true }); // serratus
    // the trapezius rising from both shoulders into the neck, and the hollow above the collarbone
    V.mass(f, [S.at(-0.7, 0.04), S.at(-0.3, -0.24), S.at(0.1, -0.34), S.at(0.32, -0.16), S.at(0.0, -0.04), S.at(-0.4, 0.06)], { s: 60, op: 0.45, hiOp: 0.35 });
    V.mass(f, [S.at(0.6, -0.14), S.at(0.82, -0.12), S.at(1.0, -0.02), S.at(0.88, 0.02), S.at(0.66, -0.02)], { s: 30, op: 0.45, hiOp: 0.3 });
    groove([S.at(0.12, -0.03), S.at(0.35, 0.0), S.at(0.56, -0.04)], 10, 0.45); groove([S.at(0.62, -0.04), S.at(0.82, -0.02), S.at(0.98, 0.04)], 9, 0.4); // the collarbones
    groove([S.at(-0.6, -0.04), S.at(-0.2, -0.2), S.at(0.15, -0.3)], 10, 0.4); // the trapezius' edge
    V.bandHatch(f, [S.at(-0.6, 0.04), S.at(-0.2, -0.12), S.at(0.15, -0.22)], [S.at(-0.6, 0.14), S.at(-0.2, -0.02), S.at(0.15, -0.1)], 3, 4, { op: 0.3 });
    // rime hatching on the lit faces of the chest
    V.bandHatch(f, [S.at(0.0, 0.06), S.at(0.25, 0.0), S.at(0.48, 0.04)], [S.at(0.0, 0.16), S.at(0.25, 0.1), S.at(0.48, 0.14)], 3, 3, { col: '#ffffff', op: 0.45, ragged: 0.4 });
    V.oldCrack(f, [S.at(0.2, 0.12), S.at(0.3, 0.22), S.at(0.26, 0.32)], 3);
  });
  // the tunic charred away below the rim: ragged burnt rags at the collar, glowing edges
  const rag = []; for (let x = 420; x <= 1100; x += 34) rag.push([x, rimY - 40 + (f.r() - 0.5) * 30]);
  f.line(rag, 14, P.charS); V.seam(f, rag, 2.4); V.ash(f, [760, rimY - 40], 30, 500, 360, 2);
  // the crack ringing his chest steams
  for (const x of [520, 760, 980]) V.puff(f, [x, rimY - 80], 260, 60, { op: 0.3, big: true, phase: x, sway: 20 });
  // the hood pushed back and its short cape over the shoulders, frozen stiff; the rope coil across the shoulder
  const cape = [S.at(-0.95, -0.2), S.at(-0.5, -0.36), S.at(-0.12, -0.34), S.at(-0.02, -0.2), S.at(-0.2, -0.04), S.at(-0.45, 0.12), S.at(-0.75, 0.2), S.at(-0.98, 0.16)]; // (review) cut back to the near shoulder
  V.iced(f, cape, LEAi, { nFacets: 5, fs: 2, cracks: 4 });
  V.icicles(f, [S.at(-0.98, 0.17), S.at(-0.75, 0.21), S.at(-0.45, 0.13)], 6, 24, 70);
  f.stitches([S.at(-0.92, 0.1), S.at(-0.7, 0.14), S.at(-0.45, 0.06)], '#d8d4cc', 1.4);
  const hood = [S.at(-0.6, -0.36), S.at(-0.2, -0.56), S.at(0.3, -0.5), S.at(0.4, -0.3), S.at(0.0, -0.26), S.at(-0.5, -0.2)];
  V.iced(f, hood, V.rimed(V.LEA(f), 0.5), { nFacets: 3 }); fold(f, [S.at(-0.4, -0.4), S.at(0.0, -0.44), S.at(0.3, -0.36)], 6, 0.45);
  for (let i = 0; i < 3; i++) { const e = ell(add(S.at(-0.5, 0.0), [i * 8, i * 6]), 90, 60, -0.3, 22); V.rope(f, e.slice(12, 22).concat(e.slice(0, 3)), 12, { col: mix('#6a5e48', P.ice, 0.25) }); }
  // the ring of iron wedges and feathers on a cord at his neck, the horn whistle, the lamp on its hook, burnt black
  const nk = V.spline([S.at(-0.1, -0.06), S.at(0.3, 0.06), S.at(0.7, 0.0)], 10);
  f.line(nk, 4, P.leathD);
  nk.forEach((q, i) => { if (i % 2) f.part([add(q, [-7, 0]), add(q, [7, 0]), add(q, [4, 44]), add(q, [-2, 46])], { fill: P.iron, shadow: '#101012', shade: 0.4, inkW: 1.2, cast: false }); else f.part([add(q, [-4, 0]), add(q, [4, 0]), add(q, [3, 30]), add(q, [-3, 30])], { fill: P.ironL, shade: 0.4, inkW: 1, cast: false }); });
  const hw = S.at(0.75, 0.06); f.line([nk[nk.length - 1], hw], 3, P.leathD);
  f.part(limb(hw, add(hw, [40, 60]), 22, 10, { steps: 6 }), { fill: '#9a8e78', shadow: '#3a3028', shade: 0.4, inkW: 1.3, cast: false }); f.part(ell(hw, 12, 9, 0.6, 8), { fill: P.ironL, shade: 0.35, inkW: 1, cast: false });
  const lmp = S.at(0.6, 0.5); f.part([add(lmp, [-6, -60]), add(lmp, [6, -60]), add(lmp, [4, -20]), add(lmp, [-4, -20])], { fill: P.iron, shade: 0.35, inkW: 1, cast: false });
  f.part([add(lmp, [-30, -20]), add(lmp, [30, -20]), add(lmp, [34, 50]), add(lmp, [-34, 50])], { fill: '#1e1814', shadow: '#000', shade: 0.35, inkW: 1.6, sharp: true, tex: 'craze821', texOp: 0.8 }); f.flat([add(lmp, [-22, -10]), add(lmp, [22, -10]), add(lmp, [24, 40]), add(lmp, [-24, 40])], '#120c0a'); f.line([add(lmp, [-34, 16]), add(lmp, [34, 16])], 4, P.iron);
  // the hoist chain wrapped twice round his shoulders, one end hanging down over the rim with its ore bucket
  f.bone('chain');
  V.chainLinks(f, [S.at(-0.95, 0.05), S.at(-0.2, -0.12), S.at(0.6, -0.04), S.at(1.0, 0.1)], 34);
  V.chainLinks(f, [S.at(-0.98, 0.22), S.at(-0.2, 0.08), S.at(0.6, 0.18), S.at(0.98, 0.3)], 34, P.ironL);
  V.chainLinks(f, [S.at(-0.98, 0.22), [470, 880], [470, 1000]], 34);
  f.bone('bucket');
  const bk = [470, 1130];
  const bkP = [add(bk, [-80, -90]), add(bk, [80, -90]), add(bk, [64, 80]), add(bk, [-64, 80])];
  V.iced(f, bkP, V.rimed({ fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'grain821', texOp: 0.7 }, 0.3), { nFacets: 2 });
  for (const v of [-56, 50]) f.line([add(bk, [-80 + Math.abs(v) * 0.15, v]), add(bk, [80 - Math.abs(v) * 0.15, v])], 10, P.iron);
  f.line([add(bk, [-80, -84]), [470, 1000], add(bk, [80, -84])], 7, P.ironL);
  for (let i = 0; i < 4; i++) { const q = add(bk, [-50 + i * 32, -96]); f.part(ell(q, 22, 16, f.r(), 8).map(z => [...z, 1]), { fill: '#2a2628', shadow: '#060506', shade: 0.4, tex: 'craze821', texOp: 0.7, cast: false }); V.glow(f, q, 14, 10, P.lamp, 0.4); }
  V.icicles(f, [add(bk, [-64, 80]), add(bk, [64, 80])], 4, 16, 40);

  // ================= head: broad, flat face, the mouth open in a roar of steam, frost in the brows and beard, icicles
  f.bone('head');
  const nk0 = S.at(0.2, -0.04), nk1 = add(HC, rot([-30, 140], hA));
  // the bull neck (review): clipped along its base so it runs into the trapezius and chest with no ring outline
  V.clipDraw(f, [[680, -100], [680, 400], [770, 420], [845, 468], [930, 516], [1010, 536], [1090, 516], [1220, 380], [1220, -100]], () => V.iced(f, limb(nk0, nk1, 300, 260), Object.assign({}, SKI, { maxShade: 60 }), { nFacets: 3, fs: 2, after: () => {
    V.mass(f, [lp(nk0, nk1, 0.0, -150), lp(nk0, nk1, 0.5, -130), lp(nk0, nk1, 1.0, -120), lp(nk0, nk1, 1.0, -40), lp(nk0, nk1, 0.3, -60)], { s: 50, op: 0.45, hiOp: 0.2 }); // the trapezius at the back of the neck
    const scm = [add(HC, rot([-60, 120], hA)), S.at(0.52, -0.06)]; // the long neck muscle, from behind the ear to the breastbone
    V.mass(f, [add(scm[0], [-24, -10]), add(scm[0], [24, 4]), add(scm[1], [24, 0]), add(scm[1], [-30, 10])], { s: 24, op: 0.5, hiOp: 0.45, sharp: true });
    groove([add(scm[0], [-20, 10]), lerp(scm[0], scm[1], 0.5), add(scm[1], [-24, 8])], 9, 0.45);
    f.raw(`<path d="${E.smooth([lp(nk0, nk1, 0.2, 40), lp(nk0, nk1, 0.9, 60), lp(nk0, nk1, 0.9, 150), lp(nk0, nk1, 0.2, 150)])}" fill="#0e1422" opacity="0.4" filter="url(#glow821)"/>`); // the throat under the jaw
    V.wrapHatch(f, nk0, nk1, 150, 130, 1, 6, { w: 4, op: 0.3, t0: 0.1, t1: 0.9 });
  } }));
  // (ruler upgrade pass) the face rebuilt as a weathered giant's, not B.head's egg with a white open mouth: a broad flat
  // skull with a heavy brow ridge shelving over deep sockets, small eyes narrowed under it, wide cheekbones with hollows
  // under them, a broad broken nose, deep folds from the nose to the beard; the mouth a dark roar with uneven worn teeth
  // (one missing, one broken), the tongue in shadow and only a deep ember far down the throat; the beard and moustache
  // frozen into separate hanks hung with icicles, rime in the brows, the furrows of a lifetime at the face
  const SKH = Object.assign({}, SKI, { maxShade: 120, shade: 0.5 }), dkF = '#141a28', ltF = '#f4f8fa';
  const headP = hF([[-0.4, -0.06], [-0.4, -0.3], [-0.26, -0.5], [-0.02, -0.58], [0.2, -0.52], [0.33, -0.36], [0.4, -0.2], [0.41, -0.13], [0.35, -0.07], [0.37, 0.0], [0.4, 0.06], [0.41, 0.17], [0.36, 0.2], [0.38, 0.27], [0.38, 0.34], [0.36, 0.44], [0.26, 0.54], [0.04, 0.54], [-0.16, 0.42], [-0.3, 0.22]]);
  const hd = V.iced(f, headP, SKH, { nFacets: 4, fs: 2, rimeOp: 0.35, after: () => {
    // planes, broad enough to read at sheet size: the brow ridge's lit shelf, the socket under it, the cheekbone's lit
    // plane and the hollow below it, the temple, the jaw's mass under the beard
    V.mass(f, hF([[0.02, -0.26], [0.22, -0.28], [0.4, -0.2], [0.38, -0.12], [0.2, -0.13], [0.04, -0.15]]), { s: 30, op: 0.4, hiOp: 0.55, sharp: true }); // the brow ridge
    f.flat(hF([[0.04, -0.13], [0.2, -0.12], [0.36, -0.1], [0.34, -0.02], [0.22, 0.02], [0.06, -0.01]]), dkF, { op: 0.62 }); // the sockets under the shelf
    V.mass(f, hF([[0.02, 0.04], [0.2, 0.02], [0.3, 0.08], [0.26, 0.16], [0.08, 0.15]]), { s: 24, op: 0.35, hiOp: 0.6, sharp: true }); // the cheekbone
    f.flat(hF([[0.02, 0.16], [0.2, 0.18], [0.26, 0.28], [0.14, 0.34], [0.0, 0.28]]), dkF, { op: 0.4 }); // the hollow under it
    f.flat(hF([[-0.12, -0.34], [0.02, -0.3], [0.02, -0.14], [-0.1, -0.16]]), dkF, { op: 0.28 }); // the temple
    f.flat(hF([[-0.4, -0.3], [-0.2, -0.3], [-0.18, 0.3], [-0.3, 0.22], [-0.42, -0.06]]), dkF, { op: 0.3 }); V.bandHatch(f, hF([[-0.38, -0.3], [-0.38, 0.0], [-0.3, 0.2]]), hF([[-0.24, -0.32], [-0.22, 0.0], [-0.18, 0.26]]), 6, 4, { op: 0.35 }); // the back of the head turned from the light
    // the furrows: each a dark crease with a lit lip under it, following the brow's curve; crow's feet; the folds from
    // the nose; an old scar across the brow
    for (const [v, u0, u1, w] of [[-0.33, -0.06, 0.26, 4], [-0.39, -0.02, 0.22, 3.4], [-0.44, 0.04, 0.18, 3]]) { f.line(hF([[u0, v + 0.02], [(u0 + u1) / 2, v - 0.01], [u1, v + 0.03]]), w, INK, { op: 0.6 }); f.line(hF([[u0 + 0.01, v + 0.035], [(u0 + u1) / 2, v + 0.005], [u1, v + 0.045]]), w * 0.7, ltF, { op: 0.4 }); }
    for (const a2 of [-0.5, -0.1, 0.3]) f.line(hF([[0.05, -0.05 + a2 * 0.04], [-0.04, -0.06 + a2 * 0.12], [-0.1, -0.06 + a2 * 0.2]]), 3, INK, { op: 0.55 });
    f.stroke(hF([[0.36, 0.14], [0.3, 0.22], [0.27, 0.3]]), 12, dkF, { op: 0.6 }); f.line(hF([[0.38, 0.15], [0.32, 0.23], [0.29, 0.31]]), 4, ltF, { op: 0.45 }); // the nasolabial fold, deep
    f.line(hF([[0.06, -0.36], [0.14, -0.26], [0.2, -0.17]]), 6, '#e8eef0', { op: 0.7 }); f.line(hF([[0.06, -0.36], [0.14, -0.26], [0.2, -0.17]]), 2, INK, { op: 0.6 }); // the old scar
  } });
  // the ear, frosted, behind the jaw
  f.stroke(hF([[-0.2, -0.06], [-0.26, -0.06], [-0.29, 0.02], [-0.27, 0.1], [-0.22, 0.13]]), 10, '#0a0e18', { op: 0.6 }); f.line(hF([[-0.205, -0.07], [-0.265, -0.07], [-0.295, 0.02], [-0.275, 0.1]]), 3, '#8a96a4', { op: 0.6 }); // the ear in shadow behind the jaw: only its helix catches a little light
  // the broad, broken nose: a flattened bridge with a kink, a heavy bulb, the nostril wing, the dark nostril
  V.iced(f, hF([[0.34, -0.08], [0.39, -0.02], [0.42, 0.04], [0.47, 0.11], [0.46, 0.17], [0.4, 0.19], [0.34, 0.18], [0.31, 0.13], [0.33, 0.06]]), Object.assign({}, SKH, { maxShade: 24 }), { nFacets: 1, after: () => {
    f.line(hF([[0.36, -0.06], [0.4, 0.0], [0.41, 0.03], [0.45, 0.1]]), 5, ltF, { op: 0.6 }); f.line(hF([[0.4, 0.0], [0.42, 0.02]]), 3, INK, { op: 0.6 }); // the lit bridge and its old break
    f.flat(hF(ell([0.41, 0.165], 0.03, 0.016, 0.2, 8)), '#0c0c12', { op: 0.9 }); f.line(hF([[0.33, 0.1], [0.32, 0.15], [0.36, 0.18]]), 3, INK, { op: 0.7 }); } });
  // small eyes narrowed under the shelf: dark, with a wet glint, frost on the lashes
  V.animalEye(f, hF([[0.16, -0.06]])[0], H * 0.07, hA, { frost: true }); V.animalEye(f, hF([[0.33, -0.065]])[0], H * 0.04, hA, { frost: true });
  for (const [u, v] of [[0.08, -0.01], [0.24, -0.02]]) f.line(hF([[u, v], [u + 0.04, v + 0.03], [u + 0.1, v + 0.02]]), 3, INK, { op: 0.5 }); // bags under the eyes
  // the brows: heavy, rimed, short stiff hanks over the shelf
  V.hanks(f, hF([[0.02, -0.18], [0.14, -0.2], [0.26, -0.18]]), 8, 22, 40, 11, { state: 'ice', dir: rot([1, 0.5], hA), strands: 3, pal: ['#c8d0d4', '#e8eef0', '#9aa4ac', '#dde2e4'], icicleK: 0.4 });
  V.hanks(f, hF([[0.3, -0.18], [0.37, -0.17]]), 3, 16, 26, 9, { state: 'ice', dir: rot([1, 0.5], hA), strands: 2, pal: ['#c8d0d4', '#e8eef0', '#9aa4ac'], icicleK: 0.3 });
  // the roar: the jaw dropped, a dark mouth with worn uneven teeth, the tongue low in shadow, an ember far down the throat
  // final pass 2026-11-25: the roar was still a round dark O ringed by white icicle hanks, which read as a cartoon open
  // mouth with white fangs at sheet size. Now a wide, low, uneven roar pulled down at the far corner, a heavy lower lip
  // with a lit roll and a shadow under it, the teeth half hidden by the upper lip, and the moustache hanks darker and
  // shorter so they hang over the lip instead of framing the hole.
  const mo = hF([[0.18, 0.315], [0.23, 0.29], [0.3, 0.282], [0.36, 0.29], [0.4, 0.31], [0.395, 0.345], [0.36, 0.385], [0.3, 0.4], [0.24, 0.395], [0.2, 0.36]]);
  f.part(mo, { fill: '#100806', shadow: '#000', shade: 0.3, inkW: 2.2, inkHeavy: 3, cast: false, maxShade: 20 });
  V.clipDraw(f, mo, () => {
    f.flat(hF(ell([0.24, 0.345], 0.02, 0.012, 0, 8)), P.ember, { op: 0.6 }); f.flat(hF(ell([0.238, 0.345], 0.009, 0.006, 0, 8)), P.lamp, { op: 0.7 }); // the fire deep in the throat
    f.flat(hF([[0.2, 0.375], [0.28, 0.362], [0.37, 0.37], [0.36, 0.42], [0.2, 0.42]]), '#3a1e1a', { op: 0.9 }); f.line(hF([[0.24, 0.374], [0.33, 0.368]]), 2, '#6a3a30', { op: 0.6 }); // the tongue
    const tooth = (u0, u1, v0, l, down, col) => f.part(hF([[u0, v0], [u1, v0 - 0.002], [u1 - 0.004, v0 + (down ? l : -l)], [(u0 + u1) / 2, v0 + (down ? l * 1.1 : -l * 1.1)], [u0 + 0.004, v0 + (down ? l * 0.9 : -l * 0.9)]]), { fill: col, shadow: '#3a3228', shade: 0.4, inkW: 1.4, cast: false, maxShade: 6 });
    // upper teeth, worn and yellowed, uneven, a gap where one is gone and one snapped short; lower teeth smaller
    for (const [u0, u1, l, c] of [[0.24, 0.265, 0.024, '#8e8472'], [0.27, 0.297, 0.03, '#9a907c'], [0.302, 0.322, 0.012, '#847a68'], [0.352, 0.376, 0.026, '#968c78']]) tooth(u0, u1, 0.284, l, true, c);
    for (const [u0, u1, l, c] of [[0.25, 0.272, 0.018, '#7a7260'], [0.278, 0.3, 0.022, '#857c68'], [0.31, 0.335, 0.02, '#7e7662']]) tooth(u0, u1, 0.398, l, false, c);
    f.flat(hF([[0.17, 0.27], [0.41, 0.27], [0.41, 0.305], [0.17, 0.305]]), '#000', { op: 0.35 }); // the shadow of the upper lip on the teeth
  });
  // the heavy lower lip: a fleshy roll, lit along its top edge, a dark shadow under it on the chin, chapped and split
  V.iced(f, hF([[0.21, 0.395], [0.27, 0.402], [0.33, 0.398], [0.37, 0.383], [0.39, 0.395], [0.36, 0.43], [0.3, 0.445], [0.24, 0.438], [0.205, 0.415]]), Object.assign({}, SKH, { fill: '#8e98a4', maxShade: 16 }), { nFacets: 1, after: () => {
    f.line(hF([[0.22, 0.402], [0.28, 0.408], [0.34, 0.402], [0.37, 0.39]]), 3, ltF, { op: 0.55 }); f.line(hF([[0.28, 0.41], [0.285, 0.43]]), 1.6, INK, { op: 0.6 }); f.line(hF([[0.33, 0.405], [0.334, 0.425]]), 1.4, INK, { op: 0.5 }); } });
  f.stroke(hF([[0.21, 0.45], [0.29, 0.462], [0.36, 0.442]]), 8, dkF, { op: 0.5 }); // the shadow under the lip
  f.line(hF([[0.18, 0.312], [0.23, 0.286], [0.3, 0.278], [0.36, 0.286], [0.4, 0.308]]), 4, '#c8d0d6', { op: 0.45 }); // the upper lip's rimed edge
  f.stroke(hF([[0.395, 0.345], [0.41, 0.38], [0.405, 0.41]]), 5, dkF, { op: 0.55 }); // the far corner pulled down into the fold
  V.rimeCrust(f, hF([[0.21, 0.29], [0.3, 0.272], [0.38, 0.29]]), 5, [-0.4, -1], { gap: 7 });
  // the beard and moustache frozen into separate hanks, darker roots, rime-white tips, icicles; the jaw shows between
  V.hanks(f, hF([[-0.18, 0.3], [-0.06, 0.44], [0.08, 0.52], [0.2, 0.52], [0.3, 0.5]]), 20, 80, 180, 20, { state: 'ice', dir: [0.05, 1], strands: 4, pal: ['#8a949c', '#c4ccd0', '#6a7480', '#e2e8ea'], icicleK: 0.7, icS: 2.2 });
  V.hanks(f, hF([[0.2, 0.25], [0.26, 0.24], [0.32, 0.24], [0.39, 0.25]]), 7, 26, 48, 12, { state: 'ice', dir: [0.2, 1], strands: 3, pal: ['#6a747e', '#8a949c', '#545c68', '#a4aeb4'], icicleK: 0.25, icS: 1.2 }); // the moustache, dark at the roots, hanging over the upper lip
  V.icicles(f, [hF([[-0.1, 0.7]])[0], hF([[0.3, 0.74]])[0]].sort((p, q) => p[0] - q[0]), 7, 30, 80);
  V.puff(f, hF([[0.42, 0.36]])[0], 260, 70, { op: 0.4, big: true, drift: 120, sway: 20 }); // the steam of the roar
  V.rimeCrust(f, hF([[-0.34, -0.36], [-0.08, -0.56], [0.18, -0.52], [0.32, -0.36]]), 14, [-0.6, -1], { gap: 7 });
  // the hair, frozen, swept back off the brow where the hood was pushed off
  V.hanks(f, hF([[-0.1, -0.52], [-0.34, -0.42], [-0.44, -0.16]]), 10, 60, 120, 17, { state: 'ice', dir: [-0.5, 1], strands: 4, pal: ['#aab4ba', '#c8d0d4', '#8a949c', '#dde2e4'] });
  void hd;

  // ================= near arm: the upper arm rimed, the forearm on the rim, the hand on the pick driven into the ice
  f.bone('pick');
  const ph = E.norm(sub(pickTop, pickHead));
  f.part(limb(pickHead, pickTop, 40, 34, { steps: 10 }), V.rimed({ fill: P.wood, shadow: P.woodD, tex: 'grain821', texOp: 0.7, shade: 0.4 }, 0.35));
  V.clipDraw(f, E.smooth(limb(pickHead, pickTop, 44, 38)), () => { f.raw(`<rect x="${pickHead[0] - 40}" y="${pickHead[1] - 110}" width="80" height="110" fill="url(#craze821)"/>`); V.seam(f, [lp(pickHead, pickTop, 0.08, 6), lp(pickHead, pickTop, 0.2, -4), lp(pickHead, pickTop, 0.32, 4)], 2.4); }); // the haft charred at the head end
  V.rimeCrust(f, [lp(pickHead, pickTop, 0.5, -20), lp(pickHead, pickTop, 0.95, -18)], 8, [-1, -0.3], { gap: 7 });
  const PH2 = frame(pickHead, Math.atan2(ph[1], ph[0]) + Math.PI / 2, 1);
  f.part(PH2([[-30, -26], [30, -26], [34, 22], [-34, 22]]), { fill: P.iron, shadow: '#0e0c0c', shade: 0.4, inkW: 1.6 }); // the eye of the pick head; its points are sunk in the ice
  f.part(PH2([[-30, -20], [-150, -6], [-220, 10, 1], [-150, 14], [-30, 18]]), { fill: mix(P.iron, P.ice, 0.3), shadow: '#141418', light: P.iceL, shade: 0.4, tex: 'rime821', texOp: 0.7, inkW: 1.6 });
  f.bone('upperarm_n');
  f.stroke([lp(SN, EN, 0.05, -96), lp(SN, EN, 0.4, -104), lp(SN, EN, 0.8, -88)], 40, '#0e1422', { op: 0.3 }); // the arm's shadow on the chest
  V.iced(f, limb(SN, EN, 176, 150, { steps: 12, p: [[0.3, 0.2, 0.18]], q: [[0.5, 0.16, 0.2]] }), Object.assign({}, SKI, { fill: '#aab6be', maxShade: 90 }), { nFacets: 6, fs: 2, cracks: 4, after: () => V.wrapHatch(f, SN, EN, 88, 75, 1, 9, { w: 4, op: 0.35, t0: 0.15, t1: 0.95 }) });
  groove([lp(SN, EN, -0.08, 50), lp(SN, EN, 0.12, 86), lp(SN, EN, 0.3, 74)], 10, 0.45); // the deltoid's rounded edge
  groove([lp(SN, EN, 0.08, 86), lp(SN, EN, 0.3, 104), lp(SN, EN, 0.5, 80)], 7, 0.4); groove([lp(SN, EN, 0.55, -66), lp(SN, EN, 0.85, -74)], 6, 0.35);
  V.icicles(f, [lp(SN, EN, 0.3, -100), lp(SN, EN, 0.8, -84)].sort((p, q) => p[0] - q[0]), 6, 30, 80);
  V.rimeCrust(f, [lp(SN, EN, -0.05, 92), lp(SN, EN, 0.6, 92)], 12, [-1, -0.3], { gap: 7 });
  f.bone('forearm_n');
  both(limb(lerp(EN, SN, 0.06), WN, 200, 160, { steps: 12, p: [[0.3, 0.14, 0.2]], q: [[0.2, 0.1, 0.18]] }), SKI, SKC, { riftW: 3, faint: true });
  groove([lp(EN, WN, 0.1, -60), lp(EN, WN, 0.4, -74), lp(EN, WN, 0.7, -56)], 6, 0.4);
  for (let i = 0; i < 3; i++) f.part(K.chain([lp(EN, WN, 0.78 + i * 0.05, 74), lp(EN, WN, 0.8 + i * 0.05, -74)], [18, 18]), Object.assign(V.rimed(V.LEA(f), 0.4), { cast: false })); // wrist wraps
  V.icicles(f, [lp(EN, WN, 0.2, -70), lp(EN, WN, 0.7, -60)], 5, 20, 50);
  f.bone('hand_n');
  B.grip(f, WN, EN, Math.atan2(-ph[1] * -1, -ph[0] * -1) + Math.PI, 96, '#b2bcc2', { shadow: P.skinIS, tex: 'rime821', texOp: 0.5, name: 'firstbreaker pick' });

  // ================= the shaft collar in front of him: stacked squared logs, rimed outside and charred along the top
  // where the heat comes up; tally notches cut in the top log; splintered ladder rungs; obsidian rubble on the rim
  f.bone('shaft');
  // (ruler upgrade pass) the collar was five full-width logs: a ruled block under him. Now it is broken by his weight and
  // the fire: the top log snapped under his chest, both halves bent down into the break; the second burnt through, its
  // charred end short of the next piece; the third shoved out of line; a length of the fourth fallen into the shaft;
  // the glowing shaft shows through every gap. Ropes hang down the face (the hoist rope into the shaft, a rope ladder's
  // remains, lashings round a log end) and his hooked fingers come down over the front of the top log
  const gapGlow = (pts) => { f.flat(pts, '#120806', { op: 0.95 }); V.clipDraw(f, pts, () => { const bb = E.bbox(pts); V.glow(f, [(bb[0] + bb[2]) / 2, bb[3]], (bb[2] - bb[0]) * 0.6, (bb[3] - bb[1]) * 0.9, P.lamp, 0.55, true); V.glow(f, [(bb[0] + bb[2]) / 2, bb[3]], (bb[2] - bb[0]) * 0.3, (bb[3] - bb[1]) * 0.5, P.lampL, 0.4); }); };
  const y0 = rimY + 40;
  gapGlow([[-20, y0 - 50], [1620, y0 - 50], [1620, gy + 40], [-20, gy + 40]]); // the shaft behind the collar, burning
  // fifth (bottom) and fourth logs: the fourth has lost a length into the shaft
  V.timber(f, [-20, y0 + 4 * 96 + 6], [1620, y0 + 4 * 96 - 4], 100, { state: 'ice', ends: false });
  V.timber(f, [-20, y0 + 3 * 96], [420, y0 + 3 * 96 + 8], 100, { state: 'ice', ends: 'b' }); V.timber(f, [700, y0 + 3 * 96 - 4], [1620, y0 + 3 * 96 + 4], 100, { state: 'ice', ends: 'a' });
  // the third shoved out of line, tilted, its end standing proud of the collar
  V.timber(f, [-20, y0 + 2 * 96 + 18], [1640, y0 + 2 * 96 - 22], 102, { state: 'ice', ends: false });
  // the second burnt through near the far side
  V.timber(f, [10, y0 + 96 + 6], [1080, y0 + 96 - 2], 98, { state: 'char', ends: 'b' }); V.timber(f, [1200, y0 + 96 - 6], [1600, y0 + 96 + 2], 98, { state: 'ice', ends: 'a' });
  for (const q of [[1082, y0 + 96 - 30], [1086, y0 + 96 + 20]]) V.glow(f, q, 30, 20, P.lamp, 0.5); V.seam(f, [[1076, y0 + 60], [1090, y0 + 96], [1078, y0 + 136]], 4); // its end still smouldering
  // the top log snapped under his chest, the halves bent down into the break, splinters standing up
  V.timber(f, [70, y0 - 10], [700, y0 + 62], 100, { state: 'char', ends: 'b' }); V.timber(f, [1520, y0 - 12], [790, y0 + 68], 100, { state: 'char', ends: 'b' });
  for (let k = 0; k < 7; k++) { const x = 700 + k * 15, l = 40 + ((k * 37) % 50); f.part([[x - 6, y0 + 40], [x + 6, y0 + 42], [x + (k % 2 ? 10 : -8), y0 + 40 - l]], { fill: P.woodL, shadow: P.woodD, shade: 0.3, inkW: 1.1, cast: false }); }
  V.glow(f, [745, y0 + 30], 70, 40, P.lamp, 0.5);
  // lashings round the far log ends, and ropes hanging down the face of the collar
  for (const [x, y] of [[1560, y0 + 96], [1580, y0 + 2 * 96 - 20]]) for (let k = 0; k < 4; k++) V.rope(f, [[x - 30 + k * 12, y - 52], [x - 24 + k * 12, y], [x - 30 + k * 12, y + 52]], 9, { col: mix('#6a5e48', P.ice, 0.25) });
  V.rope(f, [[930, y0 - 20], [944, y0 + 160], [930, y0 + 330], [948, gy + 40]], 16, { col: mix('#6a5e48', P.ice, 0.25) }); V.icicles(f, [[930, y0 + 150], [960, y0 + 160]], 2, 30, 60); // the hoist rope running down into the shaft
  { const lx = [470, 580]; for (const x of lx) V.rope(f, [[x, y0 - 30], [x + 6, y0 + 140], [x - 4, y0 + 300], [x + 10, y0 + 400]], 10, { col: mix('#5a4e3a', P.ice, 0.2) }); // a rope ladder's remains: two side ropes and a few broken rungs
    for (const [y, br] of [[y0 + 60, false], [y0 + 180, true], [y0 + 290, false]]) { const a2 = [lx[0] + 3, y], b2 = [br ? lx[0] + 60 : lx[1] + 3, y + (br ? 26 : 4)]; f.part(limb(a2, b2, 18, 14, { steps: 4 }), V.rimed({ fill: P.woodL, shadow: P.woodD, shade: 0.4 }, 0.3)); }
    V.icicles(f, [[470, y0 + 300], [586, y0 + 300]], 4, 20, 50); }
  // a coil of rope tumbling over the rim at the near side, one bight hanging down the logs
  for (let k = 0; k < 3; k++) { const e = ell([250 + k * 10, y0 - 8 + k * 4], 80, 26, -0.05, 22); V.rope(f, e.slice(11, 22).concat(e.slice(0, 4)), 12, { col: mix('#6a5e48', P.ice, 0.25) }); }
  V.rope(f, [[180, y0 - 6], [170, y0 + 120], [200, y0 + 210], [230, y0 + 150], [236, y0 + 40]], 12, { col: mix('#6a5e48', P.ice, 0.25) });
  V.rimeCrust(f, [[70, rimY - 6], [500, rimY - 10], [1000, rimY - 4], [1520, rimY - 10]], 10, [-0.6, -1], { gap: 8 });
  V.tally(f, [1180, rimY + 4], 17, 54, 0);
  for (const [x, a] of [[300, -0.3], [360, 0.2], [240, -0.1]]) { const b0 = [x, rimY - 10], t0 = add(b0, rot([0, -110], a)); f.part(limb(b0, t0, 22, 16, { steps: 4 }), V.rimed({ fill: P.woodL, shadow: P.woodD, shade: 0.4 }, 0.3)); f.part([add(t0, [-10, 0]), add(t0, [4, -24]), add(t0, [10, 4])], { fill: P.woodL, shade: 0.3, inkW: 1, cast: false }); } // splintered ladder rungs
  V.rubble(f, 40, 1560, rimY + 6, 16, 1.4);
  V.icicles(f, [[0, gy - 120], [1600, gy - 130]], 16, 24, 60);
  for (const x of [200, 700, 1300]) V.puff(f, [x, rimY], 300, 80, { op: 0.22, big: true, phase: x, col: '#6a5a50' }); // heat and ash rolling up behind the rim
  // (ruler upgrade pass) his far hand hooked down over the front of the snapped top log, fingers clawed into it
  f.bone('hand_f');
  { const tips = V.clawHand(f, [WF[0] - 10, rimY - 10], 1.5, 250, { look: Object.assign({}, SKI, { fill: mix(SKI.fill, '#000', 0.12), maxShade: 40 }), curl: [0.55, 0.6, 0.6, 0.5], spread: 0.1, thumbAng: 0.4, flip: true });
    V.icicles(f, tips.slice(0, 4).sort((p, q) => p[0] - q[0]), 4, 18, 44); }
  f.bone('shaft');
  // the headframe's legs in front of him, cropping him at both sides
  for (const [a0, b0] of [[[110, gy], [330, -40]], [[1590, gy], [1370, -40]]]) { /* (review) leaning in: their outer edges run on the diagonal */ V.timber(f, a0, b0, 160, { state: 'ice', ends: false }); V.icicles(f, [lerp(a0, b0, 0.3), lerp(a0, b0, 0.7)].sort((p, q) => p[0] - q[0]), 6, 30, 80); }
  V.rimeCrust(f, [[150, gy - 200], [310, 200]], 14, [1, -0.2], { gap: 8 });
  for (const [c, a] of [[[262, 520], -1], [[1424, 700], 1]]) { const e = ell(add(c, [a * 70, 40]), 46, 70, 0, 20); f.line([c, add(c, [a * 70, -24])], 12, INK); f.line([c, add(c, [a * 70, -24])], 8, P.iron); for (let k = 0; k < 3; k++) V.rope(f, ell(add(c, [a * (64 + k * 6), 44 + k * 4]), 40, 66, 0, 20).slice(14, 20).concat(ell(add(c, [a * (64 + k * 6), 44 + k * 4]), 40, 66, 0, 20).slice(0, 12)), 9, { col: mix('#6a5e48', P.ice, 0.25) }); } // rope coils hung on pegs outside the legs
  return f;
}

module.exports = {
  heroes: [
    { key: 'sleeper_under_the_hold', name: 'The Sleeper Under the Hold', tier: 'ruler', w: 2400, h: 1600, flip: true, build: sleeper },
    { key: 'firstbreaker', name: 'The Firstbreaker', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: firstbreaker },
    { key: 'berserker', name: 'Berserker', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: berserker },
    { key: 'musk_ox', name: 'Musk Ox', tier: 'elite', w: 1700, h: 1400, flip: true, build: muskOx },
    { key: 'fire_setter', name: 'Fire-Setter', tier: 'human', w: 700, h: 900, flip: true, build: fireSetter },
    { key: 'skald', name: 'The Skald', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: skald },
    { key: 'mead_bearer', name: 'Mead-Bearer', tier: 'human', w: 680, h: TIERS.human[1], flip: true, build: meadBearer },
    { key: 'ore_hauler', name: 'Ore-Hauler', tier: 'large', w: 1300, h: 1100, flip: true, build: oreHauler },
    { key: 'snow_hare', name: 'Snow Hare', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: snowHare },
    { key: 'pit_adder', name: 'Pit Adder', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: pitAdder },
    { key: 'glacier_wolverine', name: 'Glacier Wolverine', tier: 'small', w: 820, h: 820, flip: true, build: glacierWolverine },
  ],
};
