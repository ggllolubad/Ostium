// World V, The Storm Foundry (Fire + Lightning, Plasma), second batch: the eleven entries not in world_V.js.
// A smiths' guild-city that forged bells, armour and automata; the forge fire caught a storm and kept it. Fire
// (dominant) blackens, splits and glows; lightning scars metal and flesh with branching burns, fuses bronze and stands
// hair on end. Palette: bronze, white-gold burns and sparks, soot, plus ink black, bone and grey.
// No lightning arcs or bolts are drawn on any figure (GUIDE 8): strikes are engine effects.
// Foes face left: every figure is drawn facing right with kit.foeBase (via kit_V.base) and flipped.
// Built for the rig: joints first, f.bone() before every part, parts drawn whole, overlap at every joint.
// Seeds: 520 + index in the bible's order (Crucible 520 ... Hearth Cat 530). groundY = canvas h - 30 everywhere.
'use strict';
const K = require('../kit');
const W = require('./kit_V');
const V = require('./kit_V_b');
const { E, B, G, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { split, side, P } = W;
const ang = W.ang, elb = W.elb;
const ankleCut = (Kn, A) => add(E.norm(sub(A, Kn)), [0.6, 0]); // ankle cut: the instep goes with the foot

// ------------------------------------------------------------------ GUILD WARDEN (cast, human 1.05)
// The guild's warden of weights and measures: a lean old master, stiff as his own rod. He stands bolt upright, weight
// even, chin up, the bronze standard-yard held upright before him in both fists like a sceptre (the far fist high, the
// near fist low, both forearms square to the rod, the rod forward of his face so it never crosses it). Fire has
// blackened his face and hands and split them in glowing seams; lightning has fused his chain of office into his chest,
// the plates sunk into the skin with Lichtenberg ferns spreading from each link up the throat, and stood his white hair
// straight up round a flat cap fused to the scalp. Layers: hose, doublet, short belted livery gown with slashed sleeves
// charred at the edges, belt and its hangings.
// Rig: standard humanoid + rod (hand_f; the near hand will need IK onto it) + skirt (the gown below the belt, pelvis) +
// ledger (pelvis). Motion: idle taps the rod and peers; attack a rap of the rod (both arms drive it down and forward).
function guildWarden() {
  const seed = 528, f = new Fig(W.base(seed, 820, { grimeY: 610 }));
  W.textures(f);
  const gy = f.o.groundY, H = 104;
  const skin = '#6a5242', skinS = '#20140e';
  const SKC = (o = {}) => V.CHAR(f, Object.assign({ fill: '#4a382c', light: '#8a6e58' }, o));
  const gown = '#523a2a', gownL = '#7e5e46', lining = '#7a6440', doub = '#6a604c', hose = '#56524a';
  const GW = (o = {}) => Object.assign({ fill: gown, shadow: '#2a1c14', light: gownL, shade: 0.42, maxShade: 16, tex: 'weave' + seed, texOp: 0.45 }, o);
  const N = [338, 272], C = [334, 370], Pv = [326, 478];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.4, 0.1);
  const EN = [312, 418], WN = [428, 482];
  const EF = [338, 384], WF = [430, 402];
  const HN = S.at(-0.22, 1.0), KN = [304, 622], AN = [300, 742];
  const HF = S.at(0.26, 0.98), KF = [356, 624], AF = [370, 742];
  const HC = [352, 200], hA = -0.16, HH = H;
  const rodT = [434, 300], rodB = [434, 650];
  const WAIST = S.at(0, 0.8), dW = [0, 1];

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.08, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('rod', WF, 'hand_f').joint('skirt', WAIST, 'pelvis').joint('ledger', S.at(-0.46, 0.86), 'pelvis');

  f.bone('root');
  f.flat(ell([340, gy + 2], 120, 9, 0, 16), '#000', { op: 0.35 });

  // ---- far arm: behind the body, the elbow tucked back, the forearm out to the rod; only the slashed sleeve's front,
  // the cuff and the fist show past the chest
  W.armRig(f, SF, EF, WF, [40, 30, 24], GW({ fill: mix(gown, '#000', 0.2) }), '_f', { muscle: false });
  f.bone('forearm_f');
  f.part(plate(EF, WF, 0.7, 1.04, 30, 32), Object.assign({}, GW({ fill: doub }), { inkW: 1.2, cast: false })); // doublet cuff
  f.line([lp(EF, WF, 0.74, -14), lp(EF, WF, 0.74, 14)], 1, '#a89878', { op: 0.6, dash: '2 2' });

  // ---- the rod: the guild's bronze standard-yard, a square bar with cast end caps, stamped with the yard's marks
  f.bone('rod');
  const rd = f.part([[rodT[0] - 8, rodT[1] + 10], [rodT[0] + 8, rodT[1] + 10], [rodB[0] + 8, rodB[1] - 8], [rodB[0] - 8, rodB[1] - 8]].map(q => [q[0], q[1], 1]), W.BR(f, { fill: '#8e6a3e', shade: 0.45, tex: null }));
  f.scratches([rodT[0], 470], 8, 10, P.bronzeP, 0.8, 1.5);
  W.bevel(f, rd, [rodT[0] - 8, rodT[1], rodB[0] + 8, rodB[1]], 3);
  f.line([[rodT[0] - 3, rodT[1] + 14], [rodB[0] - 3, rodB[1] - 12]], 1.6, P.bronzeP, { op: 0.6, straight: true }); // the lit arris
  for (let i = 1; i < 36; i++) { const y = rodT[1] + 10 + i * (rodB[1] - rodT[1] - 18) / 36, l = i % 12 === 0 ? 14 : i % 3 === 0 ? 9 : 5; f.line([[rodT[0] + 8 - l, y], [rodT[0] + 8, y]], i % 3 === 0 ? 1.4 : 0.9, INK, { op: 0.8, straight: true }); } // inch, hand and foot marks
  for (const y of [360, 560]) { f.flat([[rodT[0] - 6, y - 6], [rodT[0] + 2, y - 6], [rodT[0] + 2, y + 6], [rodT[0] - 6, y + 6]], '#2a1a0c', { op: 0.6 }); f.line([[rodT[0] - 4, y - 3], [rodT[0], y + 3]], 1, P.bronzeP, { op: 0.7 }); } // the guild's stamps
  W.clipDraw(f, [[rodT[0] - 8, rodT[1]], [rodT[0] + 8, rodT[1]], [rodB[0] + 8, rodB[1]], [rodB[0] - 8, rodB[1]]], () => { W.lichtenberg(f, [rodT[0] - 4, 600], -1.6, 80, 1.8, { metal: true, depth: 2 }); W.verdigris(f, [rodT[0], 520], 6, 30, 0.4); });
  for (const [c, sg] of [[rodT, 1], [rodB, -1]]) { // cast end caps: a knop and a collar
    const cap = [[c[0] - 12, c[1] + sg * 26, 1], [c[0] - 12, c[1] + sg * 2, 1], [c[0] - 8, c[1] - sg * 3, 1], [c[0] + 8, c[1] - sg * 3, 1], [c[0] + 12, c[1] + sg * 2, 1], [c[0] + 12, c[1] + sg * 26, 1]];
    const cd = f.part(cap, W.BR(f, { fill: '#9a7040', inkW: 1.5, texOp: 0.3 })); W.bevel(f, cd, E.bbox(cap), 3);
    for (const v of [10, 18]) f.line([[c[0] - 12, c[1] + sg * v], [c[0] + 12, c[1] + sg * v]], 1.4, INK, { op: 0.6, straight: true });
    f.rivet([c[0], c[1] + sg * 14], 2.4, P.bronzeL);
  }
  f.flat(ell([rodB[0], rodB[1] + 2], 7, 3, 0, 8), '#c8c0b0', { op: 0.5 }); // the foot worn bright from rapping
  W.scorch(f, [rodT[0], 450], 10, 30, 0.35);

  // ---- legs in wool hose, old men's calves, square-toed shoes
  const leg = (Hp, Kn, A, sfx, col) => {
    split(f, () => B.boot(f, A, 1, 44, '#24180f', { shaft: 0.42, strap: true, tex: 'mottle' + seed }), [['shin' + sfx, side(A, mul(ankleCut(Kn, A), -1), 16)], ['foot' + sfx, side(A, ankleCut(Kn, A), 16)]]);
    W.legTube(f, Hp, Kn, add(A, [0, -6]), [66, 44, 30], { fill: col, shadow: '#16140f', shade: 0.42, tex: 'weave' + seed, texOp: 0.4 }, sfx, { A, bp: [[0, 0.4, 0.1, 0.25], [1, 0.25, 0.1, 0.14]], bq: [[0, 0.5, 0.08, 0.25], [1, 0.28, 0.26, 0.16]] });
    f.bone('shin' + sfx);
    f.line([lp(Kn, A, 0.1, 10), lp(Kn, A, 0.8, 6)], 1, mix(col, '#fff', 0.3), { op: 0.45 }); // shin bone
    f.stroke([lp(Kn, A, 0.86, -12), lp(Kn, A, 0.9, 0), lp(Kn, A, 0.86, 12)], 1.6, INK, { op: 0.5 }); // wrinkled at the ankle
    for (let i = 0; i < 3; i++) { const q = lp(Kn, A, 0.3 + i * 0.2, W.R(f, -8, 8)); f.flat(ell(q, 2.4, 1.8, 0, 6), '#0e0a08', { op: 0.85 }); } // spark pocks
    f.bone('thigh' + sfx);
    f.stroke([lp(Hp, Kn, 0.75, -16), lp(Hp, Kn, 0.88, 0), lp(Hp, Kn, 0.95, 14)], 1.6, INK, { op: 0.5 }); // knee
  };
  leg(HF, KF, AF, '_f', mix(hose, '#000', 0.2));
  f.bone('shin_f');
  f.part([lp(KF, AF, 0.35, -12), lp(KF, AF, 0.33, 12), lp(KF, AF, 0.52, 11), lp(KF, AF, 0.54, -11)], { fill: mix(hose, '#6a5a40', 0.4), shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1, cast: false }); // a darn
  f.stitches([lp(KF, AF, 0.35, -12), lp(KF, AF, 0.33, 12), lp(KF, AF, 0.52, 11), lp(KF, AF, 0.54, -11), lp(KF, AF, 0.35, -12)], '#a09070', 0.7);
  leg(HN, KN, AN, '_n', hose);

  // ---- torso: a lean old chest held out, the doublet, the gown's body over it (cut at the belt with the skirt)
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.26], [0.06, 0.52, 0.46], [0.2, 0.58, 0.66], [0.42, 0.5, 0.62], [0.62, 0.46, 0.5], [0.8, 0.5, 0.5], [0.98, 0.56, 0.54], [1.08, 0.5, 0.46]]);
  f.part(torso, { fill: doub, shadow: '#1a1610', shade: 0.42, tex: 'weave' + seed, texOp: 0.4 });
  W.clipDraw(f, torso, () => {
    for (let i = 0; i < 7; i++) { const q = S.at(0.46, 0.3 + i * 0.075); f.flat(ell(q, 3.4, 3, 0, 8), P.bone, { op: 0.9 }); f.line([add(q, [-2, -1]), add(q, [1, -2])], 0.8, '#fff', { op: 0.6 }); } // horn buttons down the front
    f.stroke([S.at(0.2, 0.4), S.at(0.25, 0.6), S.at(0.2, 0.8)], 1.8, INK, { op: 0.45 });
    W.soot(f, S.at(0.3, 0.7), 20, 24, 0.35);
  });
  // the gown: short, belted, open in front over the doublet; a turned-back collar charred at the edge
  const gownPts = [S.at(-0.1, -0.06), S.at(0.2, 0.04), S.at(0.36, 0.16), S.at(0.34, 0.4), S.at(0.28, 0.66), S.at(0.34, 0.8), S.at(0.46, 0.92), [400, 520], [414, 572],
    [418, 604], [396, 598], [376, 610, 1], [350, 600], [326, 612, 1], [302, 602], [278, 610, 1], [256, 600], [238, 606, 1], [240, 560], S.at(-0.68, 0.98), S.at(-0.5, 0.82), S.at(-0.5, 0.7), S.at(-0.6, 0.46), S.at(-0.58, 0.2), S.at(-0.36, -0.02)];
  split(f, () => {
    f.part(gownPts, GW());
    W.clipDraw(f, gownPts, () => {
      for (const q of [[S.at(-0.5, 0.2), S.at(-0.45, 0.5), S.at(-0.48, 0.76)], [S.at(-0.3, 0.3), S.at(-0.32, 0.55), S.at(-0.28, 0.76)], [S.at(-0.44, 0.9), [258, 560], [250, 604]], [S.at(-0.2, 0.9), [290, 556], [286, 606]], [S.at(0.04, 0.9), [326, 560], [328, 608]], [S.at(0.26, 0.9), [364, 556], [372, 604]], [S.at(0.42, 0.92), [394, 556], [404, 600]]]) { f.stroke(q, 2.6, INK, { op: 0.55 }); f.line(q.map(z => add(z, [3, 0])), 1.2, gownL, { op: 0.55 }); } // pleats gathered by the belt
      f.flat([S.at(-0.6, 0.5), S.at(-0.5, 0.7), S.at(-0.48, 0.82), S.at(-0.62, 0.76)], '#000', { op: 0.25 }); // the small of the back
      W.soot(f, [300, 590], 80, 20, 0.5); W.soot(f, S.at(-0.4, 0.4), 30, 50, 0.3);
      f.line([[250, 596], [300, 600], [350, 594], [404, 596]], 6, P.char, { op: 0.7 }); // the hem charred
      W.flakes(f, [320, 590], 60, 8, 6, 0.8);
      W.lichtenberg(f, S.at(-0.56, 0.4), 1.2, 70, 2.2, { col: '#140c08', depth: 2, op: 0.6 });
    });
    for (let i = 0; i < 7; i++) { const x = 256 + i * 22, y = 600 + (i % 2) * 6; f.flat([[x, y - 2], [x + 6, y + 10], [x + 12, y + 2], [x + 8, y - 4]], P.char, { op: 0.95 }); f.line([[x + 1, y - 1], [x + 6, y + 8]], 1, P.lamp, { op: 0.6 }); } // curled, split hem edge, an ember in each curl
  }, [['skirt', side(S.at(0, 0.86), dW)], ['torso', side(S.at(0, 0.8), mul(dW, -1))]]);
  f.bone('torso');
  // the lapel turned back over the shoulder: the lining shows, its edge burnt into a curled, fused fringe
  const lap = [S.at(0.2, 0.04), S.at(0.36, 0.16), S.at(0.3, 0.4), S.at(0.2, 0.34), S.at(0.1, 0.1)];
  f.part(lap, Object.assign({}, GW({ fill: lining }), { inkW: 1.3, cast: false }));
  f.line([S.at(0.36, 0.16), S.at(0.3, 0.4)], 3.4, P.char, { op: 0.85 });
  // ---- belt with a bronze buckle and its hangings: nested weights, touchstone, seal matrix
  f.bone('pelvis');
  const belt = [S.at(-0.7, 0.8), S.at(0.56, 0.78), S.at(0.58, 0.87), S.at(-0.72, 0.89)];
  f.part(belt, W.LEA(f, { fill: '#24180e', sharp: true }));
  f.stitches([lerp(belt[0], belt[3], 0.3), lerp(belt[1], belt[2], 0.3)], '#8a7454', 0.7);
  const bk = S.at(0.36, 0.83);
  f.part([add(bk, [-11, -10]), add(bk, [11, -10]), add(bk, [11, 10]), add(bk, [-11, 10])], W.BR(f, { inkW: 1.3, sharp: true, cast: false }));
  f.flat([add(bk, [-6, -5]), add(bk, [6, -5]), add(bk, [6, 5]), add(bk, [-6, 5])], '#140c06');
  // the pouch of nested cup-weights: the stack's lip showing at the mouth
  const pw = S.at(0.1, 0.9);
  const pouch = [add(pw, [-16, 0]), add(pw, [16, 0]), add(pw, [20, 34]), add(pw, [8, 48]), add(pw, [-10, 48]), add(pw, [-20, 32])];
  f.part(pouch, W.LEA(f, { fill: '#4a3420', inkW: 1.3 }));
  for (let i = 0; i < 3; i++) f.part(ell(add(pw, [0, -2 - i * 5]), 13 - i * 3, 4, 0, 12), W.BR(f, { fill: i % 2 ? '#a47a46' : '#8a6236', inkW: 1, cast: false }));
  f.line([add(pw, [-14, 10]), add(pw, [14, 10])], 1.6, '#2a1a0c'); f.stitches([add(pw, [-18, 30]), add(pw, [6, 46])], '#8a7454', 0.7);
  // the touchstone pouch, smaller, behind it, a black stone with a streak of tested gold-brass on it
  const pt = S.at(-0.22, 0.9);
  f.part([add(pt, [-10, 0]), add(pt, [10, 0]), add(pt, [12, 22]), add(pt, [0, 30]), add(pt, [-12, 22])], W.LEA(f, { fill: '#3a2818', inkW: 1.2, cast: false }));
  f.part([add(pt, [-6, -10]), add(pt, [6, -12]), add(pt, [8, 2]), add(pt, [-6, 2])], { fill: '#1a1816', light: '#5a5652', shade: 0.4, inkW: 1, cast: false });
  f.line([add(pt, [-3, -6]), add(pt, [4, -7])], 1.4, P.bronzeL, { op: 0.8 });
  // the seal matrix on a cord: a bronze cone with a ring handle
  const sc = add(S.at(0.46, 0.9), [4, 40]);
  W.rope(f, [S.at(0.46, 0.88), add(S.at(0.46, 0.88), [2, 20]), add(sc, [0, -12])], 1.6, { col: '#6a5a3a' });
  f.part([add(sc, [-8, -6]), add(sc, [8, -6]), add(sc, [12, 12]), add(sc, [-12, 12])], W.BR(f, { inkW: 1.2, cast: false }));
  f.part(ell(add(sc, [0, 13]), 12, 3.4, 0, 10), W.BR(f, { fill: '#5a3e20', inkW: 1, cast: false }));
  const hr = ell(add(sc, [0, -10]), 5, 5, 0, 10); f.line(hr.concat([hr[0]]), 3, INK); f.line(hr.concat([hr[0]]), 1.6, P.bronzeL);

  // ---- the ledger of fines, chained to the belt at the back hip; hanging plumb, its spine to the viewer
  f.bone('ledger');
  const lc = S.at(-0.46, 0.86), lb = add(lc, [-6, 70]);
  W.chainLinks(f, [lc, add(lc, [-2, 30]), add(lb, [2, -38])], 9, P.ironL);
  const book = [add(lb, [-22, -36]), add(lb, [16, -38]), add(lb, [18, 30]), add(lb, [-20, 32])].map(q => [q[0], q[1], 1]);
  f.part(book, W.LEA(f, { fill: '#3e2616', shade: 0.45 }));
  f.part([add(lb, [10, -36]), add(lb, [18, -38]), add(lb, [20, 30]), add(lb, [12, 31])].map(q => [q[0], q[1], 1]), { fill: '#c8bc9e', shade: 0.4, inkW: 1, cast: false, tex: 'hatch' + seed, texOp: 0.4 }); // page edges
  for (const y of [-22, 0, 20]) f.line([add(lb, [-21, y]), add(lb, [10, y - 1])], 3.4, '#1e140c'); // raised bands on the spine
  for (const q of [add(lb, [-16, -30]), add(lb, [-16, 26])]) f.rivet(q, 2.6, P.ironL); // corner bosses
  W.scorch(f, add(lb, [0, 20]), 18, 12, 0.4);
  f.flat(ell(add(lb, [-4, -6]), 6, 4, 0, 8), '#120a06', { op: 0.85 }); f.line(ell(add(lb, [-4, -6]), 8, 6, 0, 8).slice(4, 8), 1, P.lamp, { op: 0.7 }); // burnt through

  // ---- the open chest: the doublet unlaced at the throat; the chain of office sunk into the skin
  f.bone('torso');
  const chest = [S.at(0.06, -0.04), S.at(0.3, 0.0), S.at(0.42, 0.14), S.at(0.38, 0.3), S.at(0.26, 0.34), S.at(0.14, 0.2)];
  f.part(chest, SKC({ inkW: 1.4 }));
  W.clipDraw(f, chest, () => {
    f.stroke([S.at(0.36, 0.05), S.at(0.3, 0.2), S.at(0.32, 0.3)], 3, skinS, { op: 0.5 }); // the sternum's hollow, ribs under thin skin
    for (let i = 0; i < 3; i++) f.line([S.at(0.14 + i * 0.03, 0.12 + i * 0.07), S.at(0.34, 0.16 + i * 0.07)], 1, '#9a8068', { op: 0.5 });
  });
  // the chain: a U of bronze plates linked by rings, from shoulder to shoulder; the front plates sunk into the flesh,
  // swollen skin over their edges, a glowing seam round each, ferns spreading up the throat
  const chainU = [S.at(-0.2, 0.04), S.at(0.02, 0.16), S.at(0.16, 0.26), S.at(0.3, 0.3), S.at(0.42, 0.26), S.at(0.54, 0.14)];
  for (let i = 0; i < chainU.length - 1; i++) { const m = lerp(chainU[i], chainU[i + 1], 0.5), e = ell(m, 5, 3.6, ang(chainU[i], chainU[i + 1]), 10); f.line(e.concat([e[0]]), 4, INK); f.line(e.concat([e[0]]), 2.4, P.bronzeL); }
  chainU.forEach((q, i) => {
    const a = i < chainU.length - 1 ? ang(q, chainU[i + 1]) : ang(chainU[i - 1], q), sunk = i >= 2 && i <= 4;
    const pl = [[-9, -6], [9, -6], [9, 6], [0, 9], [-9, 6]].map(([u, v]) => add(q, rot([u, v], a))).map(z => [z[0], z[1], 1]);
    if (sunk) W.seam(f, [add(q, rot([-12, 2], a)), add(q, rot([-6, 12], a)), add(q, rot([6, 13], a)), add(q, rot([12, 4], a))], 1.1, { glowOp: 0.25 });
    const d = f.part(pl, W.BR(f, { fill: sunk ? '#7a5630' : '#a07444', shade: 0.25, tex: null, inkW: 1.3, cast: false, k: 0.3 })); W.bevel(f, d, E.bbox(pl), 2);
    f.line([add(q, rot([-5, -3], a)), add(q, rot([4, 4], a))], 1.6, '#2a1a0c'); f.line([add(q, rot([2, -5], a)), add(q, rot([6, -1], a))], 2.2, '#2a1a0c'); // a hammer cast in each
    if (sunk) { f.stroke([add(q, rot([-13, -8], a)), add(q, rot([0, -12], a)), add(q, rot([13, -8], a))], 3, skinS, { op: 0.6 }); V.lich(f, chest, add(q, rot([0, -10], a)), a - Math.PI / 2 + W.R(f, -0.4, 0.4), 34, 1.8, { depth: 2, col: '#1e120c', op: 0.8 }); }
  });
  // the spectacles on a cord round the neck, hanging on the chest
  const sp = S.at(-0.04, 0.4);
  f.line([S.at(-0.1, -0.02), S.at(-0.16, 0.2), add(sp, [-12, -2])], 1, '#2a2018', { op: 0.9 });
  for (const dx of [-11, 11]) { const e = ell(add(sp, [dx, 0]), 9, 8, 0.3, 12); f.flat(e, '#9a9890', { op: 0.35 }); f.line(e.concat([e[0]]), 3, INK); f.line(e.concat([e[0]]), 1.6, P.ironL); f.line(e.slice(9, 12), 1, '#fff', { op: 0.6 }); }
  f.line([add(sp, [-3, -2]), add(sp, [3, -2])], 2, P.ironL);

  // ---- head: old, narrow, chin up and peering down the nose; the face blackened and split, white hair standing
  // straight up round a flat cap fused to the scalp
  f.bone('head');
  f.part(limb(S.at(0.08, -0.02), add(HC, [-2, 36]), 38, 32), SKC({ fill: '#4e3a2e' }));
  f.line([S.at(0.24, 0.0), add(HC, [16, 40])], 1.3, INK, { op: 0.5 }); // the throat's cords in an old neck
  V.lich(f, limb(S.at(0.08, -0.02), add(HC, [-2, 36]), 38, 32), S.at(0.26, 0.0), -1.8, 50, 2.2, { depth: 2, col: '#1e120c' }); // the ferns run on up the throat
  f.line([S.at(0.12, 0.0), add(HC, [6, 42])], 1.1, INK, { op: 0.4 });
  const hF = B.head(f, HC, HH, hA, {
    skin, jaw: 0.92, chin: 0.03, nose: 1.14, hook: 0.45, mouth: 'set', squint: 0.42, browDown: 0.06, age: true, gaunt: true, faceShade: 0.8, faceHatch: false, jawShade: 0.3,
    iris: '#1a120c', eyeWhite: '#c0b296', hairCol: '#cfc8b8', browCol: '#d8d2c4', browW: 0.05, glint: true,
    hair: [[-0.42, 0.06], [-0.44, -0.16], [-0.38, -0.3], [-0.3, -0.3], [-0.3, -0.12], [-0.34, 0.06]],
  });
  W.clipDraw(f, hF(W.faceOutline(0.92, 0.03)), () => { // soot and char round the face; fire seams split the cheek and brow
    for (const [u, v, rx, ry] of [[-0.24, 0.2, 0.16, 0.34], [0.05, -0.38, 0.3, 0.1], [0.2, 0.48, 0.18, 0.08]]) f.flat(hF(ell([u, v], rx, ry, 0, 12)), P.sootD, { op: 0.4 });
    W.seam(f, hF([[-0.02, 0.06], [0.06, 0.14], [0.04, 0.24], [0.12, 0.32]]), 1.3, { glowOp: 0.25 });
    W.seam(f, hF([[0.02, -0.24], [0.1, -0.2], [0.2, -0.24]]), 1.0, { glowOp: 0.2 });
    W.hairline(f, hF([[-0.18, 0.3], [-0.1, 0.4], [-0.02, 0.44]]), 1.2);
    W.lichtenberg(f, hF([[0.12, 0.5]])[0], -1.9, 26, 1.6, { depth: 2, col: '#1e120c' });
  });
  f.line(hF([[0.18, 0.31], [0.26, 0.3], [0.31, 0.31]]), 1, '#a07a64', { op: 0.6 }); // thin lips pressed
  // white hair standing straight up round the cap: clumped, wiry, singed at the tips
  // clumps rising from under the cap's rim, each a matted lock fanning up and out, singed dark at the tip; wires between
  // the mass behind: a frizzed, uneven fleece standing off the scalp, densest at the back
  const fz = []; for (let i = 0; i <= 22; i++) { const t = i / 22, a = Math.PI * (1.05 + t * 0.95), r = 0.5 + (i % 2 ? 0.12 : 0.02) + Math.sin(t * Math.PI) * 0.12 + W.R(f, -0.03, 0.03); fz.push(hF([[-0.08 + Math.cos(a) * r * 0.9, -0.22 + Math.sin(a) * r]])[0]); }
  f.part(fz, { fill: '#a8a294', shadow: '#5a564e', light: '#e6e0d2', shade: 0.4, maxShade: 18, tex: 'hatch' + seed, texOp: 0.25, inkW: 1.2, inkHeavy: 2 });
  for (let i = 0; i < 26; i++) {
    const t = i / 25, base = hF([[-0.46 + t * 0.7, -0.2 - Math.sin(t * Math.PI) * 0.28 - t * 0.04]])[0], a = -Math.PI / 2 - 1.0 + t * 1.8 + W.R(f, -0.15, 0.15);
    V.clump(f, base, a, W.R(f, 26, 50) * (0.75 + Math.sin(t * Math.PI) * 0.35), W.R(f, 3, 5.5), i % 3 ? '#cfc8b8' : '#9e978a', { bend: W.R(f, -0.6, 0.6), tipCol: '#4a443c', lit: '#f2ece0', inkOp: 0.6 });
  }
  W.standingHair(f, hF([[-0.4, -0.2], [-0.32, -0.36], [-0.2, -0.44], [-0.04, -0.5], [0.1, -0.5], [0.22, -0.46]]), 50, { w: 1.4, col: '#d8d2c4', lean: 0.1, fan: 1.4 });
  // the flat cap fused to the scalp: a wide flat crown seen a little from below, the brim sunk into the hair line
  const cap = hF([[-0.44, -0.32], [-0.3, -0.48], [-0.04, -0.6], [0.24, -0.6], [0.4, -0.5], [0.38, -0.42], [0.14, -0.4], [-0.12, -0.34], [-0.34, -0.24]]);
  f.part(cap, GW({ fill: '#2a1e16', inkW: 1.6 }));
  f.part(hF([[-0.38, -0.3], [-0.1, -0.38], [0.16, -0.42], [0.38, -0.44], [0.4, -0.4], [0.14, -0.38], [-0.12, -0.32], [-0.36, -0.24]]), GW({ fill: '#3a2a1e', inkW: 1.1, cast: false })); // the turned brim
  f.line(hF([[-0.2, -0.5], [0.1, -0.58], [0.3, -0.54]]), 1.6, '#6a5240', { op: 0.6 });
  W.seam(f, hF([[-0.34, -0.26], [-0.16, -0.32], [0.02, -0.34]]), 1.0, { glowOp: 0.3 }); // the brim fused into the scalp, glowing where it sank
  for (let i = 0; i < 4; i++) { const q = hF([[-0.3 + i * 0.16, -0.46 + (i % 2) * 0.04]])[0]; f.flat(ell(q, 3, 2, 0, 6), '#0e0a08', { op: 0.9 }); }

  // ---- body over the far arm: the far gown sleeve's front edge at the shoulder (on the torso, so it stays put)
  f.bone('torso');
  W.ash(f, add(HC, [-30, -70]), 8, 60, 90, 0.8);

  // ---- near arm: a puffed, slashed gown sleeve over the doublet's tight forearm sleeve, the fist low on the rod
  W.armRig(f, SN, EN, WN, [54, 38, 28], GW({ fill: '#5e4432' }), '_n', { muscle: false, bp: [[0, 0.45, 0.3, 0.22]], bq: [[0, 0.5, 0.2, 0.22], [1, 0.2, 0.08, 0.2]] });
  f.bone('upperarm_n');
  for (const u of [-14, 2, 16]) { // long slashes down the puffed sleeve showing the lining, their edges burnt and curled
    const a0 = lp(SN, EN, 0.14, u * 0.8), a1 = lp(SN, EN, 0.78, u * 0.9), m = lp(SN, EN, 0.46, u * 1.1);
    f.part([a0, add(m, [5, 0]), a1, add(m, [-5, 0])], { fill: lining, shade: 0.4, tex: 'weave' + seed, texOp: 0.4, inkW: 1.1, cast: false });
    f.line([a0, add(m, [5, 0]), a1], 2.4, P.char, { op: 0.85 });
    f.line([lp(SN, EN, 0.5, u * 1.1 - 3), lp(SN, EN, 0.64, u - 3)], 1, P.lamp, { op: 0.6 });
  }
  f.stroke([lp(SN, EN, 0.08, -22), lp(SN, EN, 0.12, 0), lp(SN, EN, 0.08, 24)], 2.4, INK, { op: 0.5 }); // gathered at the shoulder seam
  f.stroke([lp(SN, EN, 0.85, -26), lp(SN, EN, 0.9, 0), lp(SN, EN, 0.86, 26)], 2.6, INK, { op: 0.6 });
  W.flakes(f, lp(SN, EN, 0.9), 16, 8, 4, 0.7);
  f.bone('forearm_n');
  f.part(plate(EN, WN, 0.04, 0.9, 32, 28), Object.assign({}, GW({ fill: doub }), { inkW: 1.2, cast: false }));
  f.part(plate(EN, WN, 0.78, 1.0, 34, 32), Object.assign({}, GW({ fill: mix(doub, '#000', 0.2) }), { inkW: 1.2, cast: false })); // turned cuff
  for (const t of [0.2, 0.42, 0.62]) f.stroke([lp(EN, WN, t, -14), lp(EN, WN, t + 0.08, 0), lp(EN, WN, t + 0.05, 14)], 1.6, INK, { op: 0.5 }); // creases
  W.soot(f, lp(EN, WN, 0.5, -6), 20, 8, 0.35);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, -Math.PI / 2, 22, skin, { tex: 'craze' + seed, texOp: 0.4, shadow: skinS, name: 'warden rod low' });
  W.seam(f, gN.F([[-0.6, -0.1], [-0.2, 0.0], [0.1, -0.1]]), 1.2, { glowOp: 0.3 });
  for (const [x, y] of [[0.3, -0.4], [0.3, -0.1], [0.28, 0.2]]) f.flat(ell(gN.F([[x, y]])[0], 3, 2.2, 0, 6), '#c8a888', { op: 0.5 }); // bony knuckles
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, -Math.PI / 2, 21, mix(skin, skinS, 0.2), { tex: 'craze' + seed, texOp: 0.4, shadow: skinS, name: 'warden rod high' });
  W.seam(f, gF.F([[-0.5, 0.1], [-0.1, 0.2]]), 1.1, { glowOp: 0.3 });
  f.line(gF.F([[0.24, 0.6], [0.4, 0.75]]), 3, '#7a6a5a'); // a signet ring of office
  // posture (independent review): the warden leans back from the hips, chest out, chin hoisted to peer down his nose
  return V.bake(f, { torso: -5, head: -8 });
}

// ------------------------------------------------------------------ AUTOMATON TENDER (cast, human 0.95)
// A stout winder of the guild's automata. The huge iron crank key rides over her near shoulder like a woodcutter's axe:
// the near fist holds the shaft just behind its T-handle in front of her chest, the bar runs back over the shoulder and
// up behind her to the square socket. The far hand hangs forward with the long-spouted oil can, fused into the hand by
// its handle. Weight sunk on the back foot, the front foot easy. Fire has blackened her forearms and split the backs of
// her hands; lightning has branched scars from the key hand across the shoulder. Layers: kirtle with the sleeves rolled
// above the elbow, an oil-black leather apron, belt and tool roll, scorched headscarf.
// Rig: standard humanoid + key (hand_n) + can (hand_f) + skirt (pelvis) + apron (torso) + keys (pelvis).
// Motion: idle oils the key's socket (can arm lifts); attack swings the key off the shoulder (near arm drives it round).
function automatonTender() {
  const seed = 529, f = new Fig(W.base(seed, 820, { grimeY: 620 }));
  W.textures(f);
  const gy = f.o.groundY, H = 95;
  const skin = '#93725c', skinS = '#3e2a22';
  const SKs = (o = {}) => W.SK(f, Object.assign({ fill: skin, shadow: mix(skin, skinS, 0.6), maxShade: 30 }, o));
  const ARM = (o = {}) => V.CHAR(f, Object.assign({ fill: '#4a382c', light: '#8a6e56', maxShade: 18 }, o)); // blackened forearms
  const kirt = '#5e5646', kirtD = '#4a4438', apronC = '#2a201a';
  const KT = (o = {}) => Object.assign({ fill: kirt, shadow: '#221e18', light: '#867c68', shade: 0.42, maxShade: 18, tex: 'weave' + seed, texOp: 0.5 }, o);
  const N = [318, 302], C = [300, 392], Pv = [296, 492];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.38, 0.13), SF = S.at(0.42, 0.1);
  const EN = [268, 444], WN = [356, 382];
  const EF = [378, 430], WF = [430, 516];
  const AF = [278, 750], AN = [394, 750];
  const HF = S.at(-0.16, 1.0), KF = [284, 628], HN = S.at(0.3, 0.98), KN = [370, 622];
  const HC = [330, 236], hA = 0.06;
  const WB = S.at(0, 0.8), dW = [0, 1];
  const shTop = [278, 312], kA = ang(WN, shTop), kSock = add(WN, rot([318, 0], kA)), kT = add(WN, rot([-34, 0], kA));

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.08, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('key', WN, 'hand_n').joint('can', WF, 'hand_f').joint('skirt', WB, 'pelvis').joint('apron', S.at(0.4, 0.78), 'torso').joint('keys', S.at(-0.5, 0.86), 'pelvis');

  f.bone('root');
  f.flat(ell([330, gy + 2], 120, 9, 0, 16), '#000', { op: 0.35 });
  f.flat(ell([470, gy + 1], 30, 4, 0, 12), '#0e0a08', { op: 0.6 }); // a drip of oil on the floor under the spout

  // ---- the key's socket end, up behind the near shoulder (the shaft is drawn later, over the shoulder)
  f.bone('key');
  const KF0 = frame(kSock, kA, 1);
  const sock = KF0([[-34, -22], [10, -22], [16, -16], [16, 16], [10, 22], [-34, 22], [-40, 16], [-40, -16]]).map(q => [q[0], q[1], 1]);
  const sd = f.part(sock, W.IR(f, { fill: '#34302c', inkW: 1.8 })); W.bevel(f, sd, E.bbox(sock), 4, { lite: '#8a847a', lite2: '#b8b2a8' });
  f.part(KF0([[-38, -14], [-46, -14], [-46, 14], [-38, 14]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#26221e', inkW: 1.3, cast: false })); // the square mouth
  f.flat(KF0([[-44, -8], [-50, -8], [-50, 8], [-44, 8]]).map(q => [q[0], q[1], 1]), '#060504');
  for (const v of [-14, 14]) f.rivet(KF0([[-10, v]])[0], 2.8, P.ironL);
  f.flat(KF0(ell([-46, 4], 4, 7, 0, 8)), '#0e0a06', { op: 0.85 }); f.line(KF0([[-46, 10], [-47, 22], [-45, 30]]), 2.2, '#1a120c', { op: 0.8 }); // oil running from the socket
  V.lich(f, sock, KF0([[0, -4]])[0], kA + 2.6, 30, 1.6, { metal: true, depth: 1 });

  // ---- far arm (behind the body): rolled sleeve, blackened forearm hanging forward to the can
  f.bone('upperarm_f');
  f.part(K.ragLimb(f, SF, lerp(SF, EF, 0.86), 44, 48, { q: [[0.5, 0.12, 0.2]], depth: 6, teeth: 5 }), KT({ fill: kirtD }));
  W.armRig(f, lerp(SF, EF, 0.7), EF, WF, [40, 38, 30], ARM({ fill: '#3e2e24' }), '_f', { bp: [[1, 0.25, 0.14, 0.2]] });
  f.bone('forearm_f');
  V.charCracks(f, K.chain([EF, WF], [38, 30]), lerp(EF, WF, 0.5), 10, 30, 2, 40, 1.5);
  f.part(ell(lerp(SF, EF, 0.84), 26, 10, ang(SF, EF) + Math.PI / 2, 12), KT({ fill: kirtD, inkW: 1.3 }));
  f.bone('upperarm_f');
  f.part(ell(lerp(SF, EF, 0.84), 26, 10, ang(SF, EF) + Math.PI / 2, 12), KT({ fill: kirtD, inkW: 1.3 })); // the roll of sleeve

  // ---- the oil can: a squat bronze body, a conical top, a long thin spout, the handle loop fused into the fist
  f.bone('can');
  const cc = [452, 606];
  const body = [[cc[0] - 40, cc[1] - 12], [cc[0] + 40, cc[1] - 12], [cc[0] + 41, cc[1] + 30], ...ell([cc[0], cc[1] + 30], 41, 11, 0, 16).slice(1, 8), [cc[0] - 41, cc[1] + 30]];
  const bd = f.part(body, W.BR(f, { fill: '#7e5a32', inkW: 1.6, k: 0.6, texOp: 0.3 })); W.bevel(f, bd, E.bbox(body), 4);
  W.clipDraw(f, body, () => { W.scorch(f, [cc[0] + 10, cc[1] + 24], 40, 12, 0.5); W.dent(f, [cc[0] + 18, cc[1] + 6], 8, 0); W.verdigris(f, [cc[0] - 30, cc[1] + 24], 10, 6, 0.5); f.line([[cc[0] - 40, cc[1] + 4], [cc[0], cc[1] + 10], [cc[0] + 40, cc[1] + 4]], 1.4, INK, { op: 0.5 }); f.line([[cc[0] - 22, cc[1] - 6], [cc[0] - 24, cc[1] + 24]], 3, P.bronzeP, { op: 0.35 }); });
  const cone = [[cc[0] - 40, cc[1] - 12], ...ell([cc[0], cc[1] - 12], 40, 10, 0, 16).slice(1, 8), [cc[0] + 40, cc[1] - 12], [cc[0] + 10, cc[1] - 50], [cc[0] - 10, cc[1] - 50]];
  const cnd = f.part(cone, W.BR(f, { fill: '#94683a', inkW: 1.5, texOp: 0.3, k: 0.6 })); W.bevel(f, cnd, E.bbox(cone), 3);
  f.part([[cc[0] - 11, cc[1] - 48], [cc[0] - 11, cc[1] - 58], [cc[0] + 11, cc[1] - 58], [cc[0] + 11, cc[1] - 48]].map(q => [q[0], q[1], 1]), W.BR(f, { fill: '#6a4a28', inkW: 1.2, cast: false })); // filler cap
  f.flat([[cc[0] - 26, cc[1] - 8], [cc[0] - 18, cc[1] + 14], [cc[0] - 22, cc[1] + 30], [cc[0] - 30, cc[1]]], '#0e0a06', { op: 0.7 }); // an oil run down the side
  const spout = [add(cc, [28, -22]), add(cc, [48, -42]), add(cc, [66, -62]), add(cc, [80, -78])];
  f.part(limb(spout[0], spout[3], 12, 5, { steps: 6 }), W.BR(f, { fill: '#8a6236', inkW: 1.3, cast: false, tex: null })); f.line([lp(spout[0], spout[3], 0.1, -2), lp(spout[0], spout[3], 0.85, -1)], 1.4, P.bronzeP, { op: 0.7 });
  f.part(ell(add(cc, [28, -20]), 10, 7, -0.8, 10), W.BR(f, { fill: '#6a4a28', inkW: 1.2, cast: false })); // the spout's collar
  f.flat(ell(add(cc, [80, -78]), 3, 2.4, 0, 8), '#060504');
  W.drip(f, add(cc, [80, -74]), 0.8, '#2a2016');
  // the handle: a loop from the cone's back up into the fist, its top welded into the palm
  f.stroke([[cc[0] - 30, cc[1] - 22], [cc[0] - 36, cc[1] - 52], [WF[0] - 8, WF[1] + 16], [WF[0] + 4, WF[1] + 8]], 9, INK);
  f.stroke([[cc[0] - 30, cc[1] - 22], [cc[0] - 36, cc[1] - 52], [WF[0] - 8, WF[1] + 16], [WF[0] + 4, WF[1] + 8]], 6, '#6a4a28');
  f.stroke([[WF[0] + 14, WF[1] + 6], [cc[0] - 4, cc[1] - 58], [cc[0] + 2, cc[1] - 52]], 6, INK); f.stroke([[WF[0] + 14, WF[1] + 6], [cc[0] - 4, cc[1] - 58], [cc[0] + 2, cc[1] - 52]], 3.4, '#6a4a28');

  // ---- legs in wool hose under the kirtle (hidden in the rest pose, there for the rig), then the clogs
  for (const [sfx, Hp, Kn, A] of [['_f', HF, KF, AF], ['_n', HN, KN, AN]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 66, 50, { steps: 8 }), { fill: '#4a463e', shadow: '#1a1814', tex: 'weave' + seed, maxShade: 16 });
    f.bone('shin' + sfx); f.part(limb(Kn, A, 50, 34, { steps: 8, q: [[0.3, 0.2, 0.2]] }), { fill: '#4a463e', shadow: '#1a1814', tex: 'weave' + seed, maxShade: 16 });
    V.clog(f, A, 52, sfx, Kn);
    f.bone('foot' + sfx); W.splats(f, add(A, [20, 34]), 34, 8, 5, '#15110e');
  }

  // ---- kirtle: square shoulders, a stout waist, the skirt full to mid-calf; cut at the belt
  const kirtle = [S.at(-0.2, -0.08), S.at(0.3, -0.04), S.at(0.56, 0.1), S.at(0.74, 0.32), S.at(0.62, 0.5), S.at(0.54, 0.7), S.at(0.6, 0.82), S.at(0.76, 1.0), [430, 600], [440, 650], [446, 692, 1],
    [418, 700], [394, 692, 1], [364, 704], [336, 694, 1], [306, 702], [278, 692, 1], [250, 700], [220, 690, 1], [212, 640], [218, 586], S.at(-0.8, 1.0), S.at(-0.58, 0.82), S.at(-0.54, 0.66), S.at(-0.66, 0.4), S.at(-0.6, 0.14)];
  split(f, () => {
    f.part(kirtle, KT());
    W.clipDraw(f, kirtle, () => {
      for (const q of [[[236, 560], [228, 620], [230, 696]], [[272, 556], [268, 630], [276, 700]], [[322, 556], [326, 630], [320, 700]], [[372, 556], [384, 620], [380, 698]], [[410, 566], [420, 640], [426, 696]]]) { f.stroke(q, 2.6, INK, { op: 0.55 }); f.line(q.map(z => add(z, [3, 0])), 1.1, '#867c68', { op: 0.5 }); }
      f.flat([[200, 650], [450, 650], [450, 712], [200, 712]], '#1a140e', { op: 0.35 }); // oil and soot up the hem
      for (let i = 0; i < 6; i++) { const p0 = W.scatter(f, [330, 670], 90, 20); f.flat(ell(p0, W.R(f, 4, 9), W.R(f, 3, 6), 0, 8), '#0e0a06', { op: 0.6 }); }
      W.soot(f, S.at(-0.5, 0.4), 30, 40, 0.3);
      f.part([[240, 600], [266, 598], [268, 628], [242, 630]], { fill: mix(kirt, '#6a5a40', 0.4), tex: 'weave' + seed, sharp: true, inkW: 1.1, cast: false }); // darn
      f.stitches([[240, 600], [266, 598], [268, 628], [242, 630], [240, 600]], '#a89878', 0.8);
    });
    f.line([[228, 690], [262, 696], [300, 694], [340, 700], [380, 692], [418, 698], [438, 690]], 4, P.char, { op: 0.8 }); // the hem scorched and split
    for (let i = 0; i < 6; i++) { const x = 236 + i * 36; f.flat([[x, 694], [x + 6, 706], [x + 12, 696]], P.char); f.line([[x + 3, 696], [x + 6, 703]], 1, P.lamp, { op: 0.6 }); }
  }, [['skirt', side(S.at(0, 0.86), dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('torso');
  f.line([S.at(0.2, -0.04), S.at(0.3, 0.06), S.at(0.5, 0.08)], 2, INK, { op: 0.5 }); // the neckline

  // ---- apron: a bib of leather black with oil, stiff to the knee, rags stuffed in the pocket
  f.bone('apron');
  const ap = [S.at(0.18, 0.18), S.at(0.6, 0.16), S.at(0.66, 0.5), S.at(0.62, 0.8), [420, 560], [430, 640, 1], [404, 648], [372, 640, 1], [344, 650], [322, 640, 1], S.at(0.0, 0.9), S.at(0.06, 0.6), S.at(0.1, 0.36)];
  f.part(ap, W.LEA(f, { fill: apronC, shadow: '#0a0806', light: '#5a4a3e', shade: 0.42, maxShade: 20 }));
  W.clipDraw(f, ap, () => {
    for (const q of [[[360, 420], [366, 520], [362, 620]], [[396, 430], [404, 540], [408, 630]]]) { f.stroke(q, 2.4, '#000', { op: 0.5 }); f.line(q.map(z => add(z, [4, 0])), 2, '#8a7a6a', { op: 0.35 }); } // oil sheen on the folds
    for (let i = 0; i < 8; i++) { const q = W.scatter(f, [370, 560], 50, 70); f.line([q, add(q, [W.R(f, -2, 2), W.R(f, 10, 26)])], 2, '#8a7e70', { op: 0.3 }); } // runs of oil, catching light
    W.lichtenberg(f, S.at(0.5, 0.3), 1.6, 50, 2.2, { col: '#0a0604', depth: 2, op: 0.7 });
  });
  f.line([S.at(0.18, 0.19), S.at(0.6, 0.17)], 1.2, '#7a6a5a', { op: 0.6, dash: '3 3' });
  const pk = [[340, 530], [404, 526], [408, 580], [344, 584]];
  f.part(pk, W.LEA(f, { fill: '#1a1410', inkW: 1.3, cast: false, sharp: true }));
  f.stitches([pk[0], pk[1], pk[2], pk[3], pk[0]], '#8a7a6a', 0.8);
  for (const [x, c, h] of [[348, '#8a7e64', 34], [366, '#6a5e4a', 26], [386, '#9a8c70', 30]]) { f.part([[x, 532], [x + 6, 532 - h], [x + 14, 532 - h + 6], [x + 22, 528 - h * 0.4], [x + 18, 534]], { fill: c, shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.1, cast: false }); f.flat(ell([x + 10, 532 - h * 0.6], 3, 2, 0, 6), '#0e0a06', { op: 0.6 }); } // rags stuffed in
  f.part([S.at(0.18, 0.18), S.at(0.26, 0.18), S.at(0.12, -0.02), S.at(0.04, -0.02)], W.LEA(f, { fill: '#1e1812', inkW: 1.1, cast: false })); // neck strap

  // ---- belt, the tool roll of spanners, the ring of winding keys on a chain
  f.bone('pelvis');
  f.part([S.at(-0.76, 0.8), S.at(0.62, 0.78), S.at(0.63, 0.88), S.at(-0.78, 0.9)], W.LEA(f, { fill: '#2e2016', sharp: true }));
  f.part([S.at(-0.12, 0.78), S.at(0.04, 0.78), S.at(0.04, 0.9), S.at(-0.12, 0.9)], W.IR(f, { inkW: 1.2, sharp: true, cast: false }));
  const tr = S.at(-0.5, 0.96); // the tool roll: waxed canvas rolled round spanners, tied, the jaws poking out
  f.part([add(tr, [-30, -16]), add(tr, [30, -18]), add(tr, [34, 0]), add(tr, [30, 18]), add(tr, [-30, 18]), add(tr, [-34, 0])], W.CAN(f, { fill: '#6a5e48', inkW: 1.4 }));
  for (const x of [-18, 0, 18]) f.line([add(tr, [x, -16]), add(tr, [x + 2, 18])], 1.4, INK, { op: 0.55 });
  for (const [dx, l] of [[-20, 30], [-8, 40], [6, 34]]) { const b0 = add(tr, [dx, -16]); f.part([add(b0, [-3, 0]), add(b0, [3, 0]), add(b0, [3, -l]), add(b0, [-3, -l])].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 1, cast: false })); f.part([add(b0, [-8, -l - 10]), add(b0, [8, -l - 10]), add(b0, [8, -l + 2]), add(b0, [3, -l + 2]), add(b0, [3, -l - 4]), add(b0, [-3, -l - 4]), add(b0, [-3, -l + 2]), add(b0, [-8, -l + 2])].map(q => [q[0], q[1], 1]), W.IR(f, { fill: P.ironL, inkW: 1, cast: false })); }
  W.rope(f, [add(tr, [-34, -4]), add(tr, [-10, 2]), add(tr, [20, 0])], 2, { col: '#6e5e44' });
  f.bone('keys');
  const kr = add(S.at(-0.5, 0.88), [-4, 60]);
  W.chainLinks(f, [S.at(-0.5, 0.88), add(kr, [0, -10])], 8, P.ironL);
  K.ring(f, kr, 11, 11, 3.4, '#3a3632'); K.ring(f, kr, 11, 11, 1, '#9a948a', { op: 0.6 });
  for (let i = 0; i < 4; i++) { const a = 1.2 + i * 0.24, k0 = add(kr, rot([10, 0], a)), k1 = add(kr, rot([34 - i * 3, 0], a)); f.line([k0, k1], 3.4, P.bronzeD, { straight: true }); f.line([k0, k1], 2, P.bronze, { straight: true }); f.part([add(k1, [-4, -2]), add(k1, [4, -2]), add(k1, [4, 5]), add(k1, [-4, 5])].map(q => [q[0], q[1], 1]), W.BR(f, { inkW: 1, cast: false })); f.part(ell(k0, 4, 4, 0, 8), W.BR(f, { inkW: 1, cast: false })); }

  // ---- head: a round, practical face smeared with oil; a scorched headscarf knotted at the nape, hair escaping and
  // standing out with static
  f.bone('head');
  f.part(limb(S.at(0.08, -0.02), add(HC, [-4, 34]), 46, 40), SKs());
  const hF = B.head(f, HC, H, hA, {
    skin, jaw: 1.02, chin: -0.02, nose: 0.94, hook: -0.15, mouth: 'set', squint: 0.3, browDown: 0.03, age: true, faceShade: 0.84, faceHatch: false, lips: true, lashes: true, glint: true,
    iris: '#2a1a12', eyeWhite: '#b4a488', hairCol: '#4a3a2c', browCol: '#3a2c20', browW: 0.045, jawShade: 0.34,
    hair: [[-0.4, 0.14], [-0.44, -0.1], [-0.34, -0.24], [-0.26, -0.1], [-0.3, 0.1]],
  });
  W.clipDraw(f, hF(W.faceOutline(1.12, 0)), () => {
    f.stroke(hF([[-0.1, 0.12], [-0.02, 0.2], [0.04, 0.3]]), 5, '#1a120c', { op: 0.3 }); // oil wiped down the cheek with the back of a hand
    f.stroke(hF([[0.06, -0.3], [0.16, -0.28]]), 3, '#1a120c', { op: 0.3 });
    W.lichtenberg(f, hF([[-0.18, 0.46]])[0], -2.2, 26, 1.6, { depth: 2 });
  });
  // the hair escaping at the brow and nape, frizzed and lifted with static
  for (let i = 0; i < 12; i++) { const t = i / 11, b0 = hF([[-0.42 + t * 0.12, 0.1 - t * 0.3]])[0]; V.clump(f, b0, Math.PI + 0.3 - t * 1.6 + W.R(f, -0.2, 0.2), W.R(f, 16, 30), W.R(f, 2.6, 4), i % 3 ? '#4a3a2c' : '#6a5644', { bend: W.R(f, -0.6, 0.6), inkOp: 0.7 }); }
  for (let i = 0; i < 6; i++) { const b0 = hF([[0.06 + i * 0.05, -0.36 + i * 0.01]])[0]; V.clump(f, b0, -1.2 + i * 0.15 + W.R(f, -0.2, 0.2), W.R(f, 12, 22), 2.6, '#4a3a2c', { bend: W.R(f, -0.5, 0.5), inkOp: 0.7 }); }
  // the scarf: a linen kerchief over the crown, tied at the nape, its edge charred
  const scarf = hF([[-0.42, -0.08], [-0.4, -0.34], [-0.22, -0.5], [0.04, -0.58], [0.26, -0.5], [0.36, -0.34], [0.3, -0.3], [0.12, -0.36], [-0.08, -0.3], [-0.26, -0.12], [-0.34, 0.06]]);
  f.part(scarf, { fill: '#7a6e5a', shadow: '#2e2820', light: '#a89a80', shade: 0.42, maxShade: 18, tex: 'weave' + seed, texOp: 0.5 });
  W.clipDraw(f, scarf, () => { W.scorch(f, hF([[0.2, -0.46]])[0], 22, 14, 0.5); for (const q of [[[-0.2, -0.46], [-0.3, -0.24]], [[0.0, -0.52], [-0.12, -0.3]]]) f.stroke(hF(q), 2, INK, { op: 0.5 }); f.flat(hF(ell([0.1, -0.48], 0.04, 0.03, 0, 8)), '#120a06', { op: 0.9 }); });
  f.line(hF([[0.36, -0.34], [0.3, -0.3], [0.12, -0.36], [-0.08, -0.3]]), 3, P.char, { op: 0.8 });
  const knot = hF([[-0.42, 0.0]])[0];
  f.part(ell(knot, 10, 8, 0, 10), { fill: '#6a604e', shade: 0.4, tex: 'weave' + seed, inkW: 1.2 });
  for (const [dx, dy] of [[-16, 30], [-4, 34]]) f.part([add(knot, [-4, 4]), add(knot, [4, 6]), add(knot, [dx + 4, dy]), add(knot, [dx - 2, dy - 2])], { fill: '#6a604e', shade: 0.4, tex: 'weave' + seed, inkW: 1.1, cast: false }); // ends hanging plumb

  // ---- near arm: rolled sleeve, blackened forearm, the fist on the key's shaft behind the T-handle
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, SN, lerp(SN, EN, 0.84), 50, 54, { p: [[0.5, 0.14, 0.2]], depth: 6, teeth: 5 }), KT());
  W.armRig(f, lerp(SN, EN, 0.7), EN, WN, [46, 42, 32], ARM(), '_n', { bp: [[1, 0.25, 0.14, 0.2]], bq: [[1, 0.2, 0.12, 0.2]] });
  f.bone('upperarm_n');
  f.part(ell(lerp(SN, EN, 0.82), 30, 11, ang(SN, EN) + Math.PI / 2, 12), KT({ fill: kirtD, inkW: 1.3 })); // the roll of sleeve
  f.stroke([lp(SN, EN, 0.3, 16), lp(SN, EN, 0.5, 4), lp(SN, EN, 0.66, 14)], 2, INK, { op: 0.5 });
  f.bone('forearm_n');
  V.charCracks(f, K.chain([EN, WN], [42, 32]), lerp(EN, WN, 0.5), 20, 12, 2, 36, 1.5, { a: kA + Math.PI });
  V.lich(f, K.chain([EN, WN], [42, 32]), lp(EN, WN, 0.8), ang(WN, EN), 70, 2.8, { depth: 3, col: '#140c08' });
  f.part(plate(EN, WN, 0.72, 0.94, 36, 34), { fill: '#a89c80', shade: 0.4, tex: 'weave' + seed, texOp: 0.5, inkW: 1.1, cast: false }); // burn bandage at the wrist
  for (const t of [0.76, 0.83, 0.9]) f.line([lp(EN, WN, t, -17), lp(EN, WN, t + 0.03, 17)], 1, INK, { op: 0.5 });
  f.flat(ell(lp(EN, WN, 0.82, 4), 5, 4, 0, 8), '#6a4a2a', { op: 0.6 }); // weeping through
  f.bone('torso');
  V.lich(f, K.chain([SN, EN], [56, 50]), lp(SN, EN, 0.3, 8), -1.6, 60, 2.6, { depth: 2, col: '#2a1a12' }); // the scar running on up the shoulder
  // the shaft over the shoulder: a long square iron bar, worn bright where it rides the shoulder; the T-handle in front
  f.bone('key');
  const shaft = [add(kT, rot([0, -8], kA)), add(kSock, rot([-34, -7], kA)), add(kSock, rot([-34, 7], kA)), add(kT, rot([0, 8], kA))].map(q => [q[0], q[1], 1]);
  const shd = f.part(shaft, W.IR(f, { fill: '#3e3a36', inkW: 1.6 })); W.bevel(f, shd, E.bbox(shaft), 3, { lite: '#8a847a', lite2: '#c0bab0' });
  f.line([add(kT, rot([0, -3], kA)), add(kSock, rot([-40, -3], kA))], 1.2, '#8a847a', { op: 0.5, straight: true });
  f.line([add(shTop, rot([-24, -4], kA)), add(shTop, rot([24, -4], kA))], 3, '#a8a49a', { op: 0.55, straight: true }); // worn bright on the shoulder
  W.clipDraw(f, shaft, () => { W.lichtenberg(f, add(WN, rot([60, 0], kA)), kA, 120, 2, { metal: true, depth: 2 }); f.scratches(add(WN, rot([150, 0], kA)), 30, 6, '#b8b2a8', 0.8, kA); });
  const TF = frame(kT, kA, 1); // the T-handle: a crossbar with turned wooden grips at each end
  f.part(TF([[-6, -40], [6, -40], [6, 40], [-6, 40]]).map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 1.5 }));
  for (const sg of [-1, 1]) { f.part(TF([[-11, sg * 26], [11, sg * 26], [12, sg * 48], [8, sg * 54], [-8, sg * 54], [-12, sg * 48]]), { fill: P.wood, shadow: P.woodD, shade: 0.42, tex: 'wood' + seed, texOp: 0.5, inkW: 1.3, cast: false }); f.line(TF([[-10, sg * 36], [10, sg * 36]]), 1.2, INK, { op: 0.6 }); }
  f.part(ell(kT, 9, 9, 0, 10), W.IR(f, { fill: P.ironL, inkW: 1.2, cast: false }));
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, kA, 25, '#4a382c', { tex: 'craze' + seed, texOp: 0.45, shadow: '#140c08', name: 'tender key' });
  W.seam(f, gN.F([[-0.6, -0.2], [-0.3, 0.0], [0.0, -0.1], [0.2, 0.1]]), 1.4, { glowOp: 0.3 }); // the back of the hand split
  for (const [x, y] of [[0.3, -0.4], [0.32, -0.1], [0.3, 0.2]]) f.flat(ell(gN.F([[x, y]])[0], 3.4, 2.4, 0, 6), '#8a7058', { op: 0.6 });
  // ---- the far fist round the can's handle, fused into it
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, 0, 24, '#3e2e24', { tex: 'craze' + seed, texOp: 0.45, shadow: '#120a06', name: 'tender can' });
  W.seam(f, gF.F([[-0.6, 0.1], [-0.2, -0.1], [0.1, 0.1]]), 1.3, { glowOp: 0.3 });
  W.weld(f, [gF.F([[0.3, 0.7]])[0], gF.F([[0.1, 0.9]])[0], gF.F([[-0.2, 0.8]])[0]], 4, { lich: false }); // the handle fused into the palm
  V.lich(f, K.chain([EF, WF], [38, 30]), lp(EF, WF, 0.9), ang(WF, EF), 50, 2.2, { depth: 2, col: '#140c08' });
  // posture (independent review): sunk back on the rear foot under the key's weight, the trunk leaning back from the hips
  return V.bake(f, { torso: -6, head: 5 });
}

// ------------------------------------------------------------------ NAIL-WIFE (cast, human 0.95)
// A short back-street nail-maker. Lightning struck her hearth and welded hundreds of iron nails onto her left (near)
// arm and side, points out, a hedgehog's back of scorched iron; she carries that heavy side out and low, away from
// her body, and leans to her right over her clean side, where the weight sits on the straight far leg. The far hand
// holds a small nail hammer up, ready. Fire has blackened her whole body and cracked the skin in glowing seams from
// ankle to jaw. Lined face, a row of nails clamped in the mouth, a rag over the nose, hair frizzed upright under a
// scorched cap. Layers: kirtle kilted up, leather apron with a pocket of nails, a shawl charred at the edges and pinned
// with a nail, belt with the nail-header on a cord. A bucket of nails at her feet.
// Rig: standard humanoid + hammer (hand_f) + skirt (pelvis) + apron (torso) + header (pelvis); the bucket is on root.
// Motion: idle taps a nail head on the header (far arm); attack swings the bristling arm (near arm sweeps forward).
function nailWife() {
  const seed = 527, f = new Fig(W.base(seed, 820, { grimeY: 620 }));
  W.textures(f);
  const gy = f.o.groundY, H = 95;
  const BLK = (o = {}) => V.CHAR(f, Object.assign({ fill: '#46362c', light: '#8a6e58', maxShade: 20 }, o)); // fire-blackened skin
  const kirt = '#5a5040', kirtD = '#463e32';
  const KT = (o = {}) => Object.assign({ fill: kirt, shadow: '#201c16', light: '#827660', shade: 0.42, maxShade: 18, tex: 'weave' + seed, texOp: 0.5 }, o);
  const N = [336, 300], C = [304, 396], Pv = [290, 494];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.36, 0.13), SF = S.at(0.42, 0.1);
  const EN = [214, 440], WN = [150, 528];
  const EF = [394, 418], WF = [458, 344];
  const HF = S.at(0.22, 1.0), KF = [316, 630], AF = [322, 752];
  const HN = S.at(-0.32, 1.0), KN = [256, 628], AN = [232, 752];
  const HC = [354, 238], hA = 0.1;
  const WB = S.at(0, 0.8), dW = [0, 1];
  const hamA = -2.1, hamHead = add(WF, rot([62, 0], hamA));

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.08, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('hammer', WF, 'hand_f').joint('skirt', WB, 'pelvis').joint('apron', S.at(0.4, 0.78), 'torso').joint('header', S.at(0.56, 0.86), 'pelvis');

  f.bone('root');
  f.flat(ell([320, gy + 2], 140, 9, 0, 16), '#000', { op: 0.35 });
  // the bucket of nails at her feet: oak staves, two iron hoops, a rope handle, nails heaped and spilled
  const bk = [470, gy];
  const bucket = [[bk[0] - 44, bk[1] - 86], [bk[0] + 44, bk[1] - 86], [bk[0] + 38, bk[1] - 2, 1], ...ell([bk[0], bk[1] - 4], 38, 6, 0, 16).slice(1, 8), [bk[0] - 38, bk[1] - 2, 1]];
  f.part(bucket, { fill: '#4e3a26', shadow: '#1a120a', light: '#7a6040', shade: 0.42, maxShade: 20, tex: 'wood' + seed, texOp: 0.6 });
  W.clipDraw(f, bucket, () => { for (let i = -3; i <= 3; i++) f.line([[bk[0] + i * 13, bk[1] - 88], [bk[0] + i * 11, bk[1]]], 1.4, INK, { op: 0.6 }); W.scorch(f, [bk[0] + 10, bk[1] - 30], 40, 30, 0.5); });
  for (const y of [-74, -24]) { f.stroke([[bk[0] - 44 + (y + 86) * 0.07, bk[1] + y], [bk[0], bk[1] + y + 5], [bk[0] + 44 - (y + 86) * 0.07, bk[1] + y]], 7, INK); f.stroke([[bk[0] - 43 + (y + 86) * 0.07, bk[1] + y], [bk[0], bk[1] + y + 5], [bk[0] + 43 - (y + 86) * 0.07, bk[1] + y]], 4.4, P.iron); f.rivet([bk[0] + 20, bk[1] + y + 4], 2, P.ironL); }
  f.flat(ell([bk[0], bk[1] - 86], 44, 9, 0, 16), '#1a1410');
  for (let i = 0; i < 26; i++) { const q = W.scatter(f, [bk[0], bk[1] - 92], 38, 8); V.nail(f, q, -Math.PI / 2 + W.R(f, -1.4, 1.4), W.R(f, 12, 20), 3, { head: true }); }
  W.rope(f, [[bk[0] - 44, bk[1] - 80], [bk[0] - 56, bk[1] - 110], [bk[0] - 40, bk[1] - 122], [bk[0] - 20, bk[1] - 104]], 2.4, { col: '#6a5a3c' });
  for (let i = 0; i < 7; i++) V.nail(f, [W.R(f, 400, 530), gy - 2], W.R(f, -0.3, 0.3) + (f.r() > 0.5 ? 0 : Math.PI), W.R(f, 12, 18), 3); // spilled on the floor

  // ---- the hammer: a small cross-peen nail hammer, ash haft through the far fist, head up and back
  f.bone('hammer');
  const hb = add(WF, rot([-26, 0], hamA));
  f.part(limb(hb, hamHead, 11, 10, { steps: 6 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  const HD = frame(hamHead, hamA, 1);
  f.part(HD([[-6, -26], [10, -24], [12, -18], [12, 14], [8, 26], [-6, 24], [-10, 14], [-10, -18]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#2e2c2a', inkW: 1.5 }));
  f.part(HD([[-8, -30], [10, -30], [10, -24], [-8, -24]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#5a5652', inkW: 1.1, cast: false })); // striking face
  f.flat(HD([[-5, -29], [7, -29], [6, -26], [-4, -26]]), '#c8c0b0', { op: 0.6 });
  f.part(HD([[-6, 24], [8, 24], [4, 38], [-2, 38]]), W.IR(f, { fill: '#3a3634', inkW: 1.1, cast: false })); // the peen

  // ---- far arm (behind): sleeve pushed up, a blackened, seamed forearm raising the hammer
  W.armRig(f, SF, EF, WF, [40, 34, 28], BLK({ fill: '#3e3028' }), '_f', { bp: [[1, 0.25, 0.14, 0.2]] });
  f.bone('upperarm_f');
  f.part(K.ragLimb(f, SF, lerp(SF, EF, 0.62), 46, 46, { q: [[0.5, 0.12, 0.2]], depth: 6, teeth: 5 }), KT({ fill: kirtD }));
  f.bone('forearm_f');
  V.charCracks(f, K.chain([EF, WF], [34, 28]), lerp(EF, WF, 0.5), 16, 20, 2, 40, 1.4);

  // ---- legs: kilted skirt to the knee, bare blackened shins split by seams, clogs
  for (const [sfx, Hp, Kn, A, t] of [['_f', HF, KF, AF, 0.15], ['_n', HN, KN, AN, 0]]) {
    const look = BLK({ fill: mix('#46362c', '#000', t) });
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 64, 46, { steps: 8 }), KT({ fill: '#4a4438' }));
    W.legTube(f, Kn, lerp(Kn, A, 0.55), A, [44, 40, 28], look, sfx, { A, bq: [[0, 0.4, 0.2, 0.25]] });
    f.bone('shin' + sfx);
    V.charCracks(f, K.chain([Kn, A], [44, 28]), lerp(Kn, A, 0.6), 10, 40, 3, 40, 1.4, { a: -Math.PI / 2 });
    f.line([lp(Kn, A, 0.1, 8), lp(Kn, A, 0.8, 5)], 1.2, '#9a8068', { op: 0.4 });
    V.clog(f, A, 48, sfx, Kn);
    f.bone('foot' + sfx); W.splats(f, add(A, [18, 34]), 34, 8, 5, '#15110e');
  }

  // ---- torso: a short, solid body, the kirtle; on the near flank the cloth is burnt open where the nails took her
  const kirtle = [S.at(-0.2, -0.08), S.at(0.3, -0.04), S.at(0.56, 0.1), S.at(0.72, 0.32), S.at(0.6, 0.5), S.at(0.52, 0.72), S.at(0.6, 0.84), S.at(0.8, 1.04), [412, 580], [420, 626, 1],
    [396, 634], [372, 626, 1], [346, 636], [318, 628, 1], [294, 634], [270, 624, 1], [244, 632], [222, 624, 1], [220, 590], S.at(-0.82, 1.02), S.at(-0.6, 0.82), S.at(-0.56, 0.66), S.at(-0.68, 0.4), S.at(-0.6, 0.14)];
  split(f, () => {
    f.part(kirtle, KT());
    W.clipDraw(f, kirtle, () => {
      for (const q of [[[244, 560], [238, 600], [242, 630]], [[290, 556], [292, 600], [288, 632]], [[340, 560], [346, 600], [344, 632]], [[390, 560], [400, 600], [404, 628]]]) { f.stroke(q, 2.4, INK, { op: 0.55 }); f.line(q.map(z => add(z, [3, 0])), 1.1, '#827660', { op: 0.5 }); }
      f.flat([[200, 600], [440, 600], [440, 640], [200, 640]], '#1a140e', { op: 0.35 });
      W.soot(f, S.at(-0.4, 0.5), 40, 50, 0.4);
    });
    // the kilted swag: the hem pulled up on the far hip and tucked under the belt, its lining showing
    const sw = [S.at(0.3, 0.86), S.at(0.7, 0.86), [420, 560], [404, 604], [368, 600], [336, 580]];
    f.part(sw, KT({ fill: kirtD, inkW: 1.4 }));
    f.stroke([S.at(0.36, 0.9), [372, 560], [356, 586]], 2.2, INK, { op: 0.55 }); f.stroke([S.at(0.56, 0.9), [400, 566], [396, 596]], 2, INK, { op: 0.5 });
    f.line([[224, 626], [270, 630], [318, 630], [370, 632], [418, 628]], 4, P.char, { op: 0.8 });
    for (let i = 0; i < 6; i++) { const x = 230 + i * 32; f.flat([[x, 628], [x + 6, 640], [x + 12, 630]], P.char); f.line([[x + 3, 630], [x + 6, 637]], 1, P.lamp, { op: 0.6 }); }
  }, [['skirt', side(S.at(0, 0.86), dW)], ['torso', side(WB, mul(dW, -1))]]);
  f.bone('torso');
  // the burnt-open flank: charred skin, fused cloth edge glowing, ribs under it
  const flank = [S.at(-0.6, 0.16), S.at(-0.3, 0.22), S.at(-0.16, 0.5), S.at(-0.26, 0.86), S.at(-0.6, 0.86), S.at(-0.58, 0.66), S.at(-0.68, 0.4)];
  f.part(flank, BLK({ inkW: 1.4 }));
  V.charCracks(f, flank, S.at(-0.42, 0.5), 20, 40, 3, 36, 1.4);
  f.line(flank.slice(0, 5), 4, P.char, { op: 0.9 }); W.seam(f, flank.slice(0, 5), 1.1, { glowOp: 0.25 });

  // ---- apron: leather, scorched, a pocket of nails
  f.bone('apron');
  const ap = [S.at(0.16, 0.2), S.at(0.6, 0.18), S.at(0.62, 0.5), S.at(0.56, 0.78), S.at(0.7, 1.0), [404, 600, 1], [370, 594], [340, 604, 1], S.at(-0.06, 0.98), S.at(0.02, 0.6), S.at(0.06, 0.36)];
  f.part(ap, W.LEA(f, { fill: '#4a3220', shade: 0.42, maxShade: 20 }));
  W.clipDraw(f, ap, () => {
    W.scorch(f, [370, 560], 40, 30, 0.5);
    for (let i = 0; i < 10; i++) { const q = W.scatter(f, [360, 500], 40, 80), r = W.R(f, 2, 4); f.flat(ell(q, r, r * 0.8, 0, 8), '#140c08', { op: 0.85 }); f.line(ell(q, r + 1.5, r * 0.8 + 1.5, 0, 8).slice(4, 8), 1, '#a8865a', { op: 0.6 }); }
    f.stroke([[350, 420], [356, 500], [350, 590]], 2, INK, { op: 0.45 });
  });
  const pk = [S.at(0.12, 0.66), S.at(0.5, 0.64), S.at(0.52, 0.82), S.at(0.14, 0.84)];
  f.part(pk, W.LEA(f, { fill: '#3a2616', inkW: 1.3, cast: false, sharp: true }));
  f.stitches([pk[0], pk[1], pk[2], pk[3], pk[0]], '#a08a6a', 0.8);
  for (let i = 0; i < 9; i++) { const q = lerp(pk[0], pk[1], 0.1 + i * 0.1); V.nail(f, add(q, [0, 6]), -Math.PI / 2 + W.R(f, -0.4, 0.4), W.R(f, 14, 22), 3); } // nails heaped in the pocket
  f.part([S.at(0.16, 0.2), S.at(0.24, 0.2), S.at(0.12, -0.02), S.at(0.04, -0.02)], W.LEA(f, { fill: '#2e2014', inkW: 1.1, cast: false }));

  // ---- belt and the nail-header on its cord
  f.bone('pelvis');
  f.part([S.at(-0.66, 0.8), S.at(0.6, 0.78), S.at(0.61, 0.88), S.at(-0.68, 0.9)], W.LEA(f, { fill: '#2e2016', sharp: true }));
  f.bone('header');
  const hd = add(S.at(0.56, 0.86), [6, 54]);
  W.rope(f, [S.at(0.56, 0.86), add(S.at(0.56, 0.86), [4, 24]), add(hd, [0, -14])], 1.8, { col: '#6a5a3a' });
  const hdr = [add(hd, [-16, -12]), add(hd, [16, -12]), add(hd, [16, 14]), add(hd, [-16, 14])].map(q => [q[0], q[1], 1]);
  const hdd = f.part(hdr, W.IR(f, { inkW: 1.5 })); W.bevel(f, hdd, E.bbox(hdr), 3, { lite: '#8a847a' });
  f.flat(ell(add(hd, [0, -12]), 6, 2.4, 0, 10), '#060504'); f.line([add(hd, [-14, -11]), add(hd, [14, -11])], 1.2, '#c8c0b0', { op: 0.5 }); // the heading hole, the face worn bright
  f.flat(ell(add(hd, [0, -12]), 3, 1.4, 0, 8), P.lamp, { op: 0.8 });

  // ---- the shawl: over the far shoulder and the back, burnt off the near side, pinned at the breast with a nail
  f.bone('torso');
  const shawl = [S.at(-0.1, -0.06), S.at(0.3, 0.02), S.at(0.62, 0.12), S.at(0.66, 0.3), S.at(0.5, 0.44), S.at(0.36, 0.36), S.at(0.2, 0.42), S.at(-0.1, 0.5), S.at(-0.36, 0.46), S.at(-0.5, 0.3), S.at(-0.4, 0.08)];
  f.part(shawl, { fill: '#5e4a3a', shadow: '#1e1610', light: '#8a7058', shade: 0.42, maxShade: 18, tex: 'weave' + seed, texOp: 0.55 });
  W.clipDraw(f, shawl, () => { f.stroke([S.at(0.0, 0.1), S.at(0.1, 0.3), S.at(0.04, 0.44)], 2.2, INK, { op: 0.5 }); f.stroke([S.at(0.4, 0.16), S.at(0.46, 0.34)], 2, INK, { op: 0.5 }); W.soot(f, S.at(-0.3, 0.3), 26, 20, 0.45); });
  f.line([S.at(0.5, 0.44), S.at(0.36, 0.36), S.at(0.2, 0.42), S.at(-0.1, 0.5), S.at(-0.36, 0.46), S.at(-0.5, 0.3), S.at(-0.4, 0.08)], 4.4, P.char, { op: 0.85 }); // charred edge
  for (let i = 0; i < 5; i++) { const q = lerp(S.at(0.2, 0.42), S.at(-0.36, 0.46), i / 4); f.flat([add(q, [-5, 0]), add(q, [0, 9 + (i % 2) * 5]), add(q, [5, 0])], P.char); f.line([add(q, [0, 2]), add(q, [0, 7])], 1, P.lamp, { op: 0.6 }); }
  V.nail(f, S.at(0.42, 0.24), -2.5, 30, 3.4); // the pin

  // ---- head: a lined face, nails clamped in the mouth under a rag tied over the nose; hair frizzed up under a cap
  f.bone('head');
  f.part(limb(S.at(0.08, -0.02), add(HC, [-4, 34]), 42, 36), BLK());
  V.charCracks(f, limb(S.at(0.08, -0.02), add(HC, [-4, 34]), 42, 36), lerp(N, HC, 0.5), 8, 14, 1, 30, 1.2, { a: -1.4 });
  const hF = B.head(f, HC, H, hA, {
    skin: '#6e5444', jaw: 0.98, chin: 0.0, nose: 1.04, hook: 0.1, mouth: 'set', squint: 0.4, browDown: 0.06, age: true, gaunt: true, faceShade: 0.78, faceHatch: false, lips: true, lashes: true, glint: true,
    iris: '#1a120c', eyeWhite: '#b8a68a', hairCol: '#3a2e26', browCol: '#2a201a', browW: 0.045, jawShade: 0.2,
    hair: [[-0.42, 0.1], [-0.46, -0.16], [-0.34, -0.3], [-0.26, -0.12], [-0.3, 0.08]],
  });
  W.clipDraw(f, hF(W.faceOutline(0.98, 0)), () => {
    W.seam(f, hF([[-0.1, 0.0], [-0.04, 0.12], [-0.08, 0.26], [0.02, 0.4]]), 1.2, { glowOp: 0.2 });
    W.seam(f, hF([[0.06, -0.3], [0.14, -0.22], [0.24, -0.26]]), 0.9, { glowOp: 0.2 });
    W.hairline(f, hF([[0.06, 0.4], [0.14, 0.46]]), 1);
    for (let i = 0; i < 3; i++) f.line(hF([[0.04, -0.2 - i * 0.04], [0.2, -0.22 - i * 0.04]]), 1, INK, { op: 0.45 }); // a lined brow
  });
  // the rag over the nose: tied behind the head, its lower edge at the upper lip
  const rag = hF([[0.04, 0.02], [0.28, -0.02], [0.36, 0.04], [0.4, 0.12], [0.37, 0.2], [0.3, 0.23], [0.2, 0.22], [0.08, 0.2], [-0.12, 0.12], [-0.2, 0.02]]);
  f.part(rag, { fill: '#948870', shadow: '#5a5040', light: '#b8aa8e', shade: 0.3, maxShade: 6, tex: 'weave' + seed, texOp: 0.5, inkW: 1.3 });
  W.clipDraw(f, rag, () => { for (const q of [[[0.3, 0.0], [0.26, 0.1], [0.24, 0.2]], [[0.3, 0.0], [0.16, 0.08], [0.06, 0.18]], [[0.36, 0.06], [0.34, 0.14], [0.32, 0.22]]]) f.stroke(hF(q), 1.6, INK, { op: 0.45 }); W.soot(f, hF([[0.36, 0.16]])[0], 10, 6, 0.4); });
  f.line(hF([[0.08, 0.2], [0.2, 0.22], [0.3, 0.23], [0.37, 0.2]]), 1.6, P.char, { op: 0.6 });
  // nails clamped in the lips, points out
  for (let i = 0; i < 5; i++) { const b0 = hF([[0.2 + i * 0.025, 0.295]])[0]; V.nail(f, b0, hA - 0.25 + i * 0.16, 26 - i, 3.2, { col: '#6a6460', lit: '#d8d0c4' }); }
  // hair frizzed upright under the cap
  for (let i = 0; i < 22; i++) { const t = i / 21, b0 = hF([[-0.42 + t * 0.4, -0.04 - Math.sin(t * Math.PI * 0.6) * 0.34]])[0]; V.clump(f, b0, Math.PI + 0.1 + t * 1.4 + W.R(f, -0.2, 0.2), W.R(f, 16, 30), W.R(f, 2.6, 4.2), i % 3 ? '#3a2e26' : '#5a4a3a', { bend: W.R(f, -0.7, 0.7), inkOp: 0.7, tipCol: '#1a1410' }); }
  for (let i = 0; i < 8; i++) { const b0 = hF([[-0.1 + i * 0.05, -0.46 + i * 0.012]])[0]; V.clump(f, b0, -Math.PI / 2 - 0.4 + i * 0.1 + W.R(f, -0.2, 0.2), W.R(f, 14, 24), 3, '#3a2e26', { bend: W.R(f, -0.7, 0.7), inkOp: 0.7, tipCol: '#1a1410' }); } // frizz standing up through the cap's crown
  const cap = hF([[-0.44, -0.12], [-0.42, -0.32], [-0.24, -0.46], [0.02, -0.52], [0.22, -0.46], [0.3, -0.34], [0.2, -0.3], [0.0, -0.34], [-0.2, -0.26], [-0.34, -0.06]]);
  f.part(cap, { fill: '#8a7e66', shadow: '#2a241c', light: '#b4a68a', shade: 0.42, maxShade: 16, tex: 'weave' + seed, texOp: 0.5 });
  W.clipDraw(f, cap, () => { W.scorch(f, hF([[0.1, -0.44]])[0], 22, 14, 0.6); f.flat(hF(ell([-0.18, -0.4], 0.03, 0.025, 0, 8)), '#120a06', { op: 0.9 }); f.stroke(hF([[-0.3, -0.36], [-0.1, -0.44], [0.12, -0.44]]), 1.6, INK, { op: 0.5 }); });
  f.line(hF([[0.3, -0.34], [0.2, -0.3], [0.0, -0.34], [-0.2, -0.26], [-0.34, -0.06]]), 3, P.char, { op: 0.75 });
  for (const dx of [-14, -4]) f.part([add(hF([[-0.42, 0.0]])[0], [0, 0]), add(hF([[-0.42, 0.0]])[0], [dx + 4, 4]), add(hF([[-0.42, 0.0]])[0], [dx, 24]), add(hF([[-0.42, 0.0]])[0], [dx - 4, 22])], { fill: '#7a6c56', shade: 0.4, tex: 'weave' + seed, inkW: 1.1, cast: false }); // the rag's tails at the nape

  // ---- the near arm: blackened, bristling with welded nails from shoulder to knuckles, held out and low
  W.armRig(f, SN, EN, WN, [54, 46, 34], BLK(), '_n', { bp: [[0, 0.3, 0.14, 0.2], [1, 0.25, 0.14, 0.2]], bq: [[1, 0.3, 0.1, 0.2]] });
  f.bone('upperarm_n'); V.charCracks(f, K.chain([SN, EN], [54, 46]), lerp(SN, EN, 0.5), 14, 40, 3, 36, 1.4);
  f.bone('forearm_n'); V.charCracks(f, K.chain([EN, WN], [46, 34]), lerp(EN, WN, 0.5), 12, 34, 2, 36, 1.4);
  f.bone('hand_n');
  const hn = B.hand(f, WN, 1.75, 24, '#3e3028', { spread: 0.5, curl: 0.55, shadow: '#120a06' });
  // the flank's nails (on the torso), then the arm's, back to front
  f.bone('torso');
  V.bristle(f, [S.at(-0.46, 0.2), S.at(-0.44, 0.5), S.at(-0.46, 0.8)], [40, 50, 40], 46, [20, 36], { span: 0.95, weld: 0.4, w: 4.6 });
  V.lich(f, flank, S.at(-0.42, 0.5), 2.6, 60, 2.2, { depth: 2, col: '#100806' });
  f.bone('upperarm_n');
  V.bristle(f, [lp(SN, EN, 0.08), lp(SN, EN, 0.5), lp(SN, EN, 0.98)], [56, 54, 46], 52, [24, 42], { weld: 0.5, w: 5 });
  f.bone('forearm_n');
  V.bristle(f, [lp(EN, WN, 0.04), lp(EN, WN, 0.5), lp(EN, WN, 0.95)], [46, 42, 34], 44, [22, 38], { weld: 0.5, w: 5 });
  f.bone('hand_n');
  V.bristle(f, [lp(EN, WN, 1.02), lp(EN, WN, 1.18)], [30, 26], 10, [10, 18], { weld: 0.6 });

  // ---- the far fist on the hammer
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, hamA, 22, '#3e3028', { tex: 'craze' + seed, texOp: 0.45, shadow: '#120a06', name: 'nailwife hammer' });
  W.seam(f, gF.F([[-0.6, 0.1], [-0.2, -0.1], [0.1, 0.1]]), 1.2, { glowOp: 0.3 });
  W.ash(f, add(HC, [-40, -60]), 8, 60, 90, 0.8);
  // posture (independent review): hunched over her work toward the hammer, the bristling arm swung out and low behind as a
  // counterweight, the hammer cocked higher for the next stroke
  return V.bake(f, { torso: 9, head: -7, upperarm_n: -18, forearm_n: -6, upperarm_f: -14, forearm_f: -12 });
}

// ------------------------------------------------------------------ MOULD-SITTER (cast, human 1.0)
// A labourer paid to sit for the guild's statue of a working man, still inside the two-part clay mould when the storm
// struck the pour. He stands in the statue's pose: chest out, fists on hips, elbows out, chin raised, feet fused to the
// casting base. Fire baked the mould black and poured bronze in round him; where the shell has fallen away the bronze
// skin shows, glowing in its cracks, and at one crack the strip of his own work shirt. Lightning fused shell, bronze
// and man together: branching scorch trees across the clay. The mould's parting line runs down his side as a raised
// flange, bound with iron bands and twisted wire round chest and thighs. The pour cup still stands on his crown with a
// frozen bronze drip down one side; iron vent rods jut from both shoulders like quills; wax runners hang from the elbows.
// Rig: standard humanoid + funnel (head) + vents (torso) + base (root). Motion: idle a stiff sway, clay flakes falling;
// attack a heavy stiff-armed blow (the near arm comes off the hip and swings down and forward).
function mouldSitter() {
  const seed = 525, f = new Fig(W.base(seed, 820, { grimeY: 640 }));
  W.textures(f);
  const gy = f.o.groundY, H = 100, baseTop = 752;
  const CL = (o = {}) => Object.assign({ fill: '#463a32', shadow: '#16100c', light: '#7e6c5e', shade: 0.42, maxShade: 22, tex: 'craze' + seed, texOp: 0.55 }, o); // fired mould clay, smoke-black
  const BZ = (o = {}) => W.BR(f, Object.assign({ fill: '#8a6236', shadow: '#2e1c0e', light: '#d0a46a', maxShade: 22 }, o)); // the bronze skin
  const rimC = '#8a5a3a'; // the broken edge of the shell: fired clay, red-brown inside the black skin
  const N = [318, 272], C = [324, 372], Pv = [312, 480];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.38, 0.13), SF = S.at(0.44, 0.1);
  const EN = [196, 392], FN = [262, 470], WN = lerp(EN, FN, 0.72);
  const EF = [446, 380], FF = [376, 468], WF = lerp(EF, FF, 0.72);
  const HN = S.at(-0.24, 1.0), KN = [292, 610], AN = [282, 706];
  const HF = S.at(0.28, 0.98), KF = [352, 612], AF = [360, 706];
  const HC = [338, 196], hA = -0.2;
  const hF = frame(HC, hA, H);

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: S.at(0.06, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('funnel', hF([[0.0, -0.52]])[0], 'head').joint('vents', S.at(0, 0.1), 'torso').joint('base', [320, gy], null);

  // a piece of the mould with breaks: draw the clay, then, inside it, each break: the bronze beneath, a seam of glow in
  // its cracks, and the shell's broken rim (red-brown fired clay with a black skin)
  const shell = (pts, breaks = [], o = {}) => {
    const d = f.part(pts, CL(o.look || {}));
    W.clipDraw(f, pts, () => {
      if (o.inside) o.inside();
      for (const b0 of breaks) {
        const b = Object.assign({}, b0, { pts: jag(b0.pts) });
        f.part(b.pts, b.look || BZ());
        W.clipDraw(f, b.pts, () => { if (b.after) b.after(); for (let i = 0; i < (b.cracks ?? 1); i++) W.crackNet(f, W.scatter(f, E.bbox(b.pts).slice(0, 2).map((v, k) => (v + E.bbox(b.pts)[k + 2]) / 2), 10, 10), f.r() * 6.3, b.len || 36, 1.4, { depth: 1, glowOp: 0.3 }); });
        f.line(b.pts.concat([b.pts[0]]), 4.4, rimC, { op: 0.9 }); f.line(b.pts.concat([b.pts[0]]).map(q => add(q, mul(f.L, 2))), 1.6, INK, { op: 0.7 });
      }
      if (o.after) o.after();
    });
    return d;
  };
  // a break's edge is broken, not cut: subdivide it and push each point in or out, with sharp corners
  const jag = pts => { const o = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], n = E.norm([-(b[1] - a[1]), b[0] - a[0]]); for (let k = 0; k < 3; k++) { const q = add(lerp(a, b, k / 3), mul(n, k ? W.R(f, -5, 5) : 0)); o.push([q[0], q[1], 1]); } } return o; };
  const flange = (pts, w = 7) => { f.stroke(pts, w + 3, INK, { op: 0.9 }); f.stroke(pts, w, '#3e342e'); f.stroke(pts.map(q => add(q, mul(f.L, -w * 0.25))), w * 0.3, '#7a6a5e', { op: 0.6 }); }; // the parting line's raised seam
  const band = (a, b, w = 9) => { f.stroke([a, lerp(a, b, 0.5), b], w + 3, INK); f.stroke([a, lerp(a, b, 0.5), b], w, P.iron); f.line([a, b].map(q => add(q, [0, -w * 0.25])), 1.4, P.ironL, { op: 0.6 }); f.rivet(lerp(a, b, 0.15), 2.6, P.ironL); f.rivet(lerp(a, b, 0.85), 2.6, P.ironL); };
  const wire = (pts) => { f.line(pts, 6, INK); f.line(pts, 3.6, '#5a5650'); for (let i = 0; i < pts.length - 1; i++) for (let t = 0; t < 1; t += 0.12) { const q = lerp(pts[i], pts[i + 1], t); f.line([add(q, [-2, -3]), add(q, [2, 3])], 1, '#a8a49a', { op: 0.8, straight: true }); } }; // twisted iron binding wire

  f.bone('base');
  f.flat(ell([320, gy + 2], 150, 9, 0, 16), '#000', { op: 0.35 });
  // the casting base: a bronze plinth still wearing clay at its foot, a sprue stub, the guild's stamp
  const plinth = [[196, baseTop + 4, 1], [214, baseTop - 6], [432, baseTop - 8], [452, baseTop + 2, 1], [456, gy, 1], [192, gy, 1]];
  const pd = f.part(plinth, BZ({ fill: '#6e4c2a' })); W.bevel(f, pd, E.bbox(plinth), 5);
  W.clipDraw(f, plinth, () => {
    f.part([[180, gy - 14], [240, gy - 20], [300, gy - 12], [360, gy - 18], [470, gy - 14], [470, gy + 4], [180, gy + 4]], CL());
    W.lichtenberg(f, [380, baseTop], 1.2, 60, 2.2, { metal: true, depth: 2 });
    W.verdigris(f, [230, gy - 24], 20, 8, 0.5);
    f.line([[214, baseTop - 2], [432, baseTop - 4]], 2, P.bronzeP, { op: 0.5 });
  });
  const st = [404, gy - 34]; // the maker's stamp: a hammer in a ring, struck into the bronze
  K.ring(f, st, 13, 11, 2, '#2a1a0c'); f.stroke([add(st, [-6, 5]), add(st, [4, -5])], 2.6, '#2a1a0c'); f.stroke([add(st, [1, -9]), add(st, [8, -2])], 3.4, '#2a1a0c');
  f.part([[204, baseTop - 2], [216, baseTop - 26], [228, baseTop - 26], [232, baseTop - 2]], BZ({ inkW: 1.3, cast: false })); // the sprue stub, sawn
  f.flat(ell([222, baseTop - 26], 6, 2, 0, 8), P.bronzeP, { op: 0.6 });

  // ---- far arm, behind the body: akimbo, the elbow out in front, the fist on the far hip; clay with a break at the
  // elbow, a wax runner hanging from it
  f.bone('upperarm_f');
  shell(limb(SF, EF, 62, 52, { steps: 10, p: [[0.4, 0.1, 0.25]] }), [{ pts: [lp(SF, EF, 0.5, -20), lp(SF, EF, 0.62, 14), lp(SF, EF, 0.85, 20), lp(SF, EF, 0.8, -18)] }], { look: { fill: '#3a302a' } });
  flange([lp(SF, EF, 0.1, 0), lp(SF, EF, 0.95, 0)], 5);
  f.bone('forearm_f');
  shell(limb(EF, FF, 52, 44, { steps: 8 }), [], { look: { fill: '#3a302a' } });
  f.line([EF, add(EF, [2, 40]), add(EF, [-1, 70])], 5, '#c8b890'); f.line([EF, add(EF, [2, 40])], 1.4, '#efe4c4', { op: 0.6 }); // wax runner, hanging plumb
  f.bone('hand_f');
  shell(ell(FF, 26, 22, ang(EF, FF), 14), [{ pts: ell(add(FF, [4, -4]), 14, 10, 0.4, 10), cracks: 1, len: 16 }], { look: { fill: '#3a302a' } });

  // ---- legs: the mould's leg shells to the ankle, wire and an iron band round each thigh; bare bronze feet below,
  // fused to the base
  for (const [sfx, Hp, Kn, A, dark] of [['_f', HF, KF, AF, 0.12], ['_n', HN, KN, AN, 0]]) {
    f.bone('foot' + sfx);
    B.bareFoot(f, A, 1, 50, mix('#8a6236', '#000', dark), { groundY: baseTop - 4, shadow: '#2e1c0e', tex: 'hammer' + seed, texOp: 0.6 });
    W.weld(f, [add(A, [-20, baseTop - A[1] - 6]), add(A, [20, baseTop - A[1] - 6]), add(A, [56, baseTop - A[1] - 6])], 5, { lich: false }); // fused to the plinth
    const lgs = K.chain([Hp, Kn, add(A, [0, -4])], [74, 48, 38], { bp: [[0, 0.5, 0.1, 0.25], [1, 0.3, 0.3, 0.18]], bq: [[0, 0.4, 0.14, 0.25], [0, 0.95, -0.06, 0.08], [1, 0.12, 0.08, 0.12]] });
    split(f, () => {
      shell(lgs, [{ pts: [lp(Kn, A, 0.25, -16), lp(Kn, A, 0.3, 14), lp(Kn, A, 0.62, 20), lp(Kn, A, 0.66, -12)], cracks: 2 }, { pts: [lp(Hp, Kn, 0.15, -6), lp(Hp, Kn, 0.2, 36), lp(Hp, Kn, 0.6, 34), lp(Hp, Kn, 0.66, 4), lp(Hp, Kn, 0.4, -10)], cracks: 1, after: () => W.groove(f, [lp(Hp, Kn, 0.2, 18), lp(Hp, Kn, 0.5, 14), lp(Hp, Kn, 0.66, 22)], 1.8) }], { look: { fill: mix('#463a32', '#000', dark) }, after: () => { W.lichtenberg(f, lp(Kn, A, 0.9, 10), -1.7, 120, 2.4, { col: '#0a0605', depth: 3 }); W.scorch(f, lp(Hp, Kn, 0.6), 20, 30, 0.4); } });
      flange([lp(Hp, Kn, 0.05, -4), lp(Hp, Kn, 0.9, -6), lp(Kn, A, 0.4, -3), lp(Kn, A, 0.95, -2)], 5);
      wire([lp(Hp, Kn, 0.4, -38), lp(Hp, Kn, 0.44, 0), lp(Hp, Kn, 0.4, 38)]);
      band(lp(Hp, Kn, 0.72, -36), lp(Hp, Kn, 0.74, 36), 9);
      f.line([lp(Kn, A, 0.98, -22), lp(Kn, A, 1.0, -8), lp(Kn, A, 0.96, 4), lp(Kn, A, 1.0, 20)], 4, rimC, { op: 0.9, straight: true }); // the shell's broken lower edge at the ankle
    }, [['thigh' + sfx, side(Kn, mul(elb(Hp, Kn, A), -1), 30)], ['shin' + sfx, side(Kn, elb(Hp, Kn, A), 30)]]);
  }

  // ---- torso: the statue's chest thrust out, in its mould; the parting flange down the side; iron bands and twisted
  // wire round the chest; a break over the belly showing bronze and, in one crack, the strip of his work shirt
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.4, 0.34], [0.06, 0.7, 0.6], [0.2, 0.74, 0.9], [0.4, 0.62, 0.86], [0.6, 0.46, 0.58], [0.76, 0.46, 0.48], [0.94, 0.56, 0.56], [1.1, 0.5, 0.5]]);
  shell(torso, [
    { pts: [S.at(0.1, 0.12), S.at(0.5, 0.08), S.at(0.86, 0.2), S.at(0.8, 0.44), S.at(0.6, 0.72), S.at(0.36, 0.8), S.at(0.16, 0.6), S.at(0.24, 0.36)], cracks: 2, len: 44, after: () => {
      W.groove(f, [S.at(0.2, 0.36), S.at(0.5, 0.42), S.at(0.84, 0.36)], 3); W.groove(f, [S.at(0.56, 0.12), S.at(0.6, 0.3), S.at(0.58, 0.42)], 2); // the pectoral's lower edge, the sternum
      for (const v of [0.52, 0.62]) W.groove(f, [S.at(0.3, v), S.at(0.5, v + 0.02), S.at(0.68, v)], 1.8); W.groove(f, [S.at(0.5, 0.46), S.at(0.5, 0.72)], 1.6);
      W.dent(f, S.at(0.4, 0.24), 10, 0); W.verdigris(f, S.at(0.7, 0.46), 14, 10, 0.5); } },
    { pts: [S.at(-0.5, 0.36), S.at(-0.24, 0.3), S.at(-0.2, 0.5), S.at(-0.44, 0.56)], look: { fill: '#8a8070', shadow: '#2e2a24', light: '#b0a690', shade: 0.4, maxShade: 12, tex: 'weave' + seed, texOp: 0.6 }, cracks: 0, after: () => { f.stroke([S.at(-0.46, 0.4), S.at(-0.3, 0.46)], 1.6, INK, { op: 0.5 }); W.scorch(f, S.at(-0.3, 0.5), 10, 8, 0.5); } },
  ], { after: () => {
    W.lichtenberg(f, S.at(0.6, 0.2), 2.6, 110, 2.6, { col: '#0a0605', depth: 3 }); W.lichtenberg(f, S.at(-0.5, 0.7), -0.6, 80, 2.2, { col: '#0a0605', depth: 2 });
    f.stroke([S.at(0.2, 0.06), S.at(0.5, 0.2), S.at(0.78, 0.28)], 3, '#000', { op: 0.35 }); // the pectoral's shelf under the clay
    W.scorch(f, S.at(-0.3, 0.8), 30, 30, 0.4);
    for (let i = 0; i < 5; i++) W.hairline(f, [S.at(W.R(f, -0.5, 0.5), W.R(f, 0.1, 0.9)), S.at(W.R(f, -0.5, 0.5), W.R(f, 0.1, 0.9))], 1);
  } });
  flange([S.at(-0.14, -0.04), S.at(-0.1, 0.3), S.at(-0.08, 0.62), S.at(-0.14, 1.04)], 7);
  wire([S.at(-0.7, 0.24), S.at(0.0, 0.3), S.at(0.84, 0.3)]); wire([S.at(-0.66, 0.3), S.at(0.0, 0.36), S.at(0.82, 0.37)]);
  band(S.at(-0.62, 0.86), S.at(0.62, 0.86), 11);
  band(S.at(-0.7, 0.12), S.at(0.6, 0.14), 9);
  W.flakes(f, S.at(0.3, 0.9), 40, 10, 6, 0.9);

  // ---- vent rods from both shoulders, jutting up and out like quills, rusted, one bent
  f.bone('vents');
  for (const [p0, a, l] of [[S.at(-0.5, 0.06), -2.1, 120], [S.at(-0.36, 0.02), -1.95, 100], [S.at(-0.6, 0.14), -2.35, 92], [S.at(0.56, 0.06), -1.2, 104], [S.at(0.68, 0.12), -0.95, 84]]) {
    const tip = add(p0, rot([l, 0], a)), mid = add(p0, rot([l * 0.55, 0], a + (l === 92 ? 0.25 : 0)));
    f.stroke([p0, mid, tip], 9, INK); f.stroke([p0, mid, tip], 6, P.iron); f.line([p0, mid, tip].map(q => add(q, rot([0, -2], a))), 1.4, P.ironL, { op: 0.6 });
    f.flat(ell(tip, 4, 4, 0, 8), P.ironD); f.line([lerp(p0, tip, 0.3), lerp(p0, tip, 0.5)], 3, P.rust, { op: 0.7 });
    f.part(ell(p0, 11, 7, a + Math.PI / 2, 10), CL({ inkW: 1.2, cast: false })); // the clay boss where it goes in
  }

  // ---- head: the mould's head shell, its front half fallen away: a bronze face, mouth open, eyes shut, chin up
  f.bone('head');
  f.part(limb(S.at(0.06, -0.02), add(HC, rot([-6, 36], hA)), 56, 50), CL());
  const face = B.head(f, HC, H, hA, { skin: '#8a6236', jaw: 1.1, chin: 0.04, nose: 1.05, hook: 0.2, mouth: 'set', blind: true, browDown: 0.0, age: false, faceShade: 0.78, faceHatch: false, jawShade: 0.3, noEar: true, browCol: '#4e3418', browW: 0.04 });
  W.clipDraw(f, hF(W.faceOutline(1.1, 0.04)), () => {
    W.bevel(f, E.smooth(hF(W.faceOutline(1.1, 0.04))), E.bbox(hF(W.faceOutline(1.1, 0.04))), 6);
    f.flat(hF([[0.18, 0.27], [0.28, 0.27], [0.33, 0.3], [0.3, 0.4], [0.2, 0.4]]), '#1a0e06'); // the open mouth
    f.flat(hF([[0.2, 0.36], [0.28, 0.36], [0.27, 0.4], [0.21, 0.4]]), P.lamp, { op: 0.7 });
    for (const [x0, x1] of [[0.06, 0.17], [0.27, 0.31]]) { f.line(hF([[x0, -0.06], [(x0 + x1) / 2, -0.045], [x1, -0.06]]), 2.2, '#2e1c0e'); f.line(hF([[x0, -0.075], [(x0 + x1) / 2, -0.07], [x1, -0.075]]), 1.2, P.bronzeP, { op: 0.6 }); } // shut lids
    W.crackNet(f, hF([[0.14, 0.1]])[0], 1.2, 40, 1.4, { depth: 1, glowOp: 0.3 });
    W.verdigris(f, hF([[0.05, 0.42]])[0], 14, 8, 0.5);
  });
  // the shell still on the back half of the head, its broken edge across the cheek
  const hs = hF([[-0.5, 0.2], [-0.5, -0.24], [-0.34, -0.5], [-0.06, -0.6], [0.1, -0.56], [0.06, -0.34], [0.0, -0.14], [0.06, 0.06], [-0.04, 0.26], [0.02, 0.44], [-0.12, 0.56], [-0.34, 0.48]]);
  f.part(hs, CL());
  W.clipDraw(f, hs, () => { W.lichtenberg(f, hF([[-0.3, -0.3]])[0], -2.5, 60, 2, { col: '#0a0605', depth: 2 }); W.scorch(f, hF([[-0.3, 0.2]])[0], 20, 26, 0.4); });
  f.line(hs.slice(4, 11), 4.4, rimC, { op: 0.9 }); f.line(hs.slice(4, 11).map(q => add(q, [-2, 1])), 1.4, INK, { op: 0.7 });
  flange(hF([[-0.08, -0.6], [-0.22, -0.4], [-0.3, -0.1], [-0.3, 0.3], [-0.24, 0.52]]), 5);
  W.flakes(f, hF([[0.06, 0.1]])[0], 14, 30, 4, 0.8);

  // ---- the pour cup on the crown: a clay funnel, a thick rim, a frozen bronze drip run down one side and over the brow
  f.bone('funnel');
  const fc = hF([[0.0, -0.54]])[0], fA = hA;
  const FF0 = frame(fc, fA, 1);
  const cup = FF0([[-15, 4], [-16, -30], [-24, -42], [-62, -70], [-66, -80], [66, -84], [62, -74], [26, -44], [17, -30], [16, 4]]);
  f.part(cup, CL({ maxShade: 26 }));
  W.clipDraw(f, cup, () => { W.scorch(f, FF0([[10, -40]])[0], 30, 30, 0.4); W.lichtenberg(f, FF0([[-20, -10]])[0], fA - 1.9, 60, 2, { col: '#0a0605', depth: 2 }); f.line(FF0([[-40, -70], [-16, -20]]), 2, '#5e5048', { op: 0.6 }); });
  f.part(FF0([[-68, -78], [-64, -90], [68, -94], [70, -82]]), CL({ fill: '#3a302a', inkW: 1.4, cast: false })); // the rim
  f.flat(ell(FF0([[2, -88]])[0], 58, 6, fA, 16), '#1a0e06'); f.flat(ell(FF0([[2, -88]])[0], 48, 4, fA, 16), P.bronzeD); f.flat(ell(FF0([[-6, -88]])[0], 18, 2, fA, 10), P.lamp, { op: 0.7 }); // the cup full of set bronze, still warm
  const drip = [FF0([[58, -86]])[0], FF0([[62, -70]])[0], FF0([[30, -44]])[0], FF0([[20, -6]])[0], hF([[0.26, -0.44]])[0], hF([[0.32, -0.3]])[0]];
  f.stroke(drip, 16, INK); f.stroke(drip, 12, '#7e5a32'); f.stroke(drip.slice(0, 4).map(q => add(q, [-2, -1])), 4, P.bronzeP, { op: 0.6 });
  f.part(ell(hF([[0.33, -0.27]])[0], 9, 11, 0, 10), BZ({ inkW: 1.3, cast: false })); // the bead that set on the brow

  // ---- near arm: akimbo, the elbow out behind, the fist on the near hip; clay with a break on the forearm
  f.bone('upperarm_n');
  shell(limb(SN, EN, 68, 56, { steps: 10, p: [[0.35, 0.12, 0.25]] }), [{ pts: [lp(SN, EN, 0.3, -6), lp(SN, EN, 0.34, 24), lp(SN, EN, 0.58, 28), lp(SN, EN, 0.6, 2)], cracks: 1 }], { after: () => W.lichtenberg(f, lp(SN, EN, 0.1), ang(SN, EN) + 0.4, 80, 2.2, { col: '#0a0605', depth: 2 }) });
  flange([lp(SN, EN, 0.12, 0), lp(SN, EN, 0.95, 2)], 5);
  wire([lp(SN, EN, 0.75, -30), lp(SN, EN, 0.78, 0), lp(SN, EN, 0.75, 30)]);
  f.bone('forearm_n');
  shell(limb(EN, FN, 56, 46, { steps: 8 }), [{ pts: [lp(EN, FN, 0.3, -18), lp(EN, FN, 0.35, 16), lp(EN, FN, 0.62, 18), lp(EN, FN, 0.6, -14)], cracks: 1, len: 26 }]);
  f.line([EN, add(EN, [-3, 36]), add(EN, [2, 66]), add(EN, [0, 84])], 5.4, '#c8b890'); f.line([EN, add(EN, [-3, 36])], 1.4, '#efe4c4', { op: 0.6 }); f.flat(ell(add(EN, [0, 86]), 4, 5, 0, 8), '#c8b890'); // wax runner
  f.line([add(EN, [16, 6]), add(EN, [18, 34])], 4, '#b8a880'); // a second, shorter
  f.bone('hand_n');
  shell(ell(FN, 30, 24, ang(EN, FN), 14), [{ pts: [add(FN, [-8, -16]), add(FN, [14, -18]), add(FN, [20, 2]), add(FN, [0, 8])], cracks: 1, len: 20, after: () => { for (const k of [-10, -2, 6]) f.line([add(FN, [k, -12]), add(FN, [k + 4, 2])], 1.4, '#2e1c0e', { op: 0.7 }); } }]); // the fist's knuckles in bronze where the clay broke
  W.ash(f, add(HC, [-30, -150]), 10, 70, 110, 0.9);
  // posture (independent review): caught mid-lurch, the whole statue and its casting base tipped forward on the base's
  // front edge as he drags it one stiff jerk onward
  return V.bake(f, {}, [4, [452, 790]]);
}

// ------------------------------------------------------------------ COKE-HEAVER (cast, large 1.4)
// A huge furnace labourer stooped under a tall wicker coke basket, carrying coke from the yards to the forges. The hunch
// is in the upper back, bowed by years of the load; the basket rides high on it, its rim above his head, coke heaped
// and smouldering. He leans forward, weight on the bent front foot, the broad iron coke shovel held across his body in
// both hands like a spade-axe, blade forward. Fire dominates: the coke has burned through the bottom of the wicker into
// his back, which is blackened and split in glowing seams. Lightning, striking the iron shovel, has stood his hair and
// beard upright and branched scars up his neck and across his face. Broad, flat, black-smudged face, eyes squeezed shut.
// Layers: sackcloth smock with burned holes, leather leggings bound with cord, rope straps over leather pads, clogs.
// Rig: standard humanoid + shovel (hand_f; the near hand will need IK onto the haft) + basket (torso) + waterskin
// (pelvis). Motion: idle a shrug to settle the basket (torso and basket lift); attack a shovel swing that throws burning
// coke (both arms swing the blade up and forward; the coke on it is FX).
function cokeHeaver() {
  const seed = 526, CW = 900, CH = 1100, f = new Fig(W.base(seed, CH, { grimeY: 860 }));
  W.textures(f);
  const gy = f.o.groundY, H = 132;
  const skin = '#8a6c56', skinS = '#2e1e16';
  const SKs = (o = {}) => W.SK(f, Object.assign({ fill: skin, shadow: mix(skin, skinS, 0.6), maxShade: 34 }, o));
  const sack = '#544a3a', sackD = '#3e3628';
  const SC = (o = {}) => Object.assign({ fill: sack, shadow: '#1a1610', light: '#7a6e58', shade: 0.42, maxShade: 24, tex: 'weave' + seed, texOp: 0.55 }, o);
  const Pv = [330, 664], N = [590, 384], C = [380, 330];
  const S = B.spine(N, C, Pv, H);
  const SN = [522, 404], SF = [592, 396];
  const EN = [452, 566], WN = [482, 694];
  const EF = [560, 546], WF = [620, 650];
  const HN = [356, 684], KN = [470, 852], AN = [486, 1010];
  const HF = [298, 676], KF = [258, 862], AF = [176, 1010];
  const HC = [644, 400], hA = 0.42;
  const shA = ang(WN, WF), blade0 = add(WN, rot([240, 0], shA));
  const bB = [300, 560], bA = -1.2, bLen = 440, bT = add(bB, rot([bLen, 0], bA)); // the basket: bottom centre, axis up and forward, top centre
  const bd = rot([1, 0], bA), bn = [-bd[1], bd[0]];
  const bp = (t, u) => add(lerp(bB, bT, t), mul(bn, u)); // a point on the basket: t up the axis, u across (+ toward the back of the man)

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('shovel', WF, 'hand_f').joint('basket', bp(0.1, 0), 'torso').joint('waterskin', [300, 700], 'pelvis');

  f.bone('root');
  f.flat(ell([400, gy + 3], 260, 12, 0, 20), '#000', { op: 0.35 });
  W.splats(f, [600, gy - 4], 120, 6, 10, '#15110e');
  for (let i = 0; i < 6; i++) { const q = [W.R(f, 560, 760), gy - 4]; f.part(W.lumpy(f, ell(q, 7, 5, 0, 8), 2), { fill: P.slag, light: P.slagL, shade: 0.4, inkW: 0.9, cast: false, hatch: false }); if (f.r() < 0.5) f.flat(ell(q, 3, 2, 0, 6), P.lamp); } // dropped coke

  // ---- the basket, behind everything on the back: a tall wicker pannier flaring to the top, its bottom burned through
  f.bone('basket');
  const bask = [bp(0, -96), bp(0, 96), bp(0.5, 120), bp(1, 150), bp(1.02, 0), bp(1, -150), bp(0.5, -118)];
  f.part(bask, { fill: '#5e4630', shadow: '#1e140a', light: '#8e7450', shade: 0.42, maxShade: 26, tex: 'hatch' + seed, texOp: 0.35 });
  W.clipDraw(f, bask, () => {
    // the weave: stakes up the axis, withies round it, each withy bowed round the basket's belly
    for (let i = -6; i <= 6; i++) f.line([bp(0, i * 15), bp(0.5, i * 19), bp(1, i * 24)], 2.2, '#2a1c0e', { op: 0.6 });
    for (let k = 0; k < 34; k++) { const t = k / 33, w = 96 + (k / 33) * 54, row = []; for (let j = -6; j <= 6; j++) row.push(add(bp(t, j * w / 6), mul(bd, -Math.cos(j / 6 * 1.5) * 6))); f.line(row, 3.4, k % 3 === 0 ? '#5a4428' : k % 2 ? '#7a5e3a' : '#6a5032', { op: 0.85 }); f.line(row.map(q => add(q, mul(bd, -1.8))), 1, '#1a1008', { op: 0.6 }); }
    // charred from the bottom up where the coke burned through; the glowing hole against his back
    f.raw(`<path d="${E.smooth([bp(0, -110), bp(0, 110), bp(0.3, 130), bp(0.42, 40), bp(0.3, -130)])}" fill="${P.char}" opacity="0.75" filter="url(#smk${seed})"/>`);
    const hole = [bp(0.02, 20), bp(0.04, 96), bp(0.22, 104), bp(0.3, 60), bp(0.2, 30)];
    f.flat(hole, P.ember); W.clipDraw(f, hole, () => { for (let i = 0; i < 9; i++) { const q = W.scatter(f, bp(0.14, 64), 30, 30); f.part(W.lumpy(f, ell(q, 11, 8, 0, 8), 3), { fill: P.char, light: '#5a4a3a', shade: 0.4, inkW: 1, cast: false, hatch: false }); f.line(ell(q, 9, 6, 0, 8).slice(0, 5), 1.6, P.lampL, { op: 0.9 }); } });
    W.glow(f, bp(0.14, 64), 70, 60, P.lamp, 0.45);
    W.scorch(f, bp(0.6, -60), 40, 50, 0.4);
    W.lichtenberg(f, bp(0.9, -40), bA + Math.PI + 0.2, 160, 2.4, { col: '#140c06', depth: 2 });
  });
  for (const [t, w] of [[0.0, 96], [0.98, 150]]) { const rim = [bp(t, -w), bp(t + 0.01, 0), bp(t, w)]; f.stroke(rim, 14, INK); f.stroke(rim, 10, '#5a4428'); f.line(rim.map(q => add(q, mul(bd, 2))), 2, '#a08458', { op: 0.6 }); } // the bound rims
  // the coke heaped above the rim, smouldering, white-gold at the heart
  const heap = [bp(1, -150), bp(1.08, -120), bp(1.16, -60), bp(1.2, 0), bp(1.15, 70), bp(1.07, 130), bp(1, 150)];
  f.part(heap, { fill: '#2a2420', shadow: '#0a0806', light: '#5a524a', shade: 0.4, maxShade: 20, tex: 'pit' + seed, texOp: 0.7 });
  W.clipDraw(f, heap, () => { for (let i = 0; i < 26; i++) { const q = W.scatter(f, bp(1.08, 0), 130, 40), r = W.R(f, 9, 17); const lump = W.lumpy(f, ell(q, r * 1.2, r, f.r() * 3, 9), r * 0.3); f.part(lump, { fill: f.r() < 0.3 ? '#3a2a20' : '#2a2420', light: '#6a5e54', shadow: '#000', shade: 0.4, inkW: 1, cast: false, hatch: false, tex: 'pit' + seed, texOp: 0.6 }); if (f.r() < 0.45) { f.flat(ell(add(q, [2, 3]), r * 0.5, r * 0.35, 0, 8), P.lamp, { op: 0.9 }); f.flat(ell(add(q, [2, 3]), r * 0.22, r * 0.15, 0, 6), P.hot); } } });
  W.glow(f, bp(1.1, 0), 150, 50, P.lamp, 0.35, true, bA + Math.PI / 2);
  W.ash(f, bp(1.18, -20), 16, 140, 220, 1.4);
  W.smoke(f, bp(1.2, 30), 200, 44, { sway: 24, phase: 1, drift: -40, op: 0.28 });

  // ---- far arm (behind the body): sleeve to the elbow, forearm to the haft
  W.armRig(f, SF, EF, WF, [86, 72, 58], SKs({ fill: mix(skin, skinS, 0.2) }), '_f', { bp: [[1, 0.25, 0.14, 0.2]] });
  f.bone('upperarm_f');
  f.bone('forearm_f');
  V.lich(f, K.chain([EF, WF], [72, 58]), lp(EF, WF, 0.95), ang(WF, EF), 100, 3, { depth: 3, col: '#1e120c' });

  // ---- the shovel: an ash haft, a socketed broad blade turned up at the sides, scorched; coke on it
  f.bone('shovel');
  const hEnd = add(WN, rot([-46, 0], shA));
  f.part(limb(hEnd, blade0, 26, 24, { steps: 8 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, texOp: 0.6 });
  f.line([lp(hEnd, blade0, 0.05, -6), lp(hEnd, blade0, 0.9, -6)], 1.6, P.woodL, { op: 0.5, straight: true });
  f.part(limb(add(hEnd, rot([-8, 0], shA)), add(hEnd, rot([16, 0], shA)), 34, 32, { steps: 2, capK: 0.3 }), W.IR(f, { inkW: 1.4, cast: false })); // iron ferrule on the end
  const BF = frame(blade0, shA, 1);
  f.part(BF([[-60, -12], [10, -16], [10, 16], [-60, 12]]), W.IR(f, { inkW: 1.6 })); // the socket and its strap up the haft
  for (const x of [-46, -16]) f.rivet(BF([[x, 0]])[0], 3, P.ironL);
  const blade = BF([[4, -50], [130, -64], [152, -58], [158, 40], [146, 52], [6, 46]]).map(q => [q[0], q[1], 1]);
  const bld = f.part(blade, W.IR(f, { fill: '#3a3632', inkW: 2 })); W.bevel(f, bld, E.bbox(blade), 5, { lite: '#8a847a', lite2: '#b8b2a8' });
  f.part(BF([[4, 40], [146, 46], [158, 40], [160, 54], [148, 64], [6, 56]]).map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#26221e', inkW: 1.4, cast: false })); // the turned-up side
  W.clipDraw(f, blade, () => {
    W.scorch(f, BF([[100, 0]])[0], 70, 50, 0.6); W.heatTint(f, BF([[130, -60], [152, -10], [152, 40]]), 6);
    W.lichtenberg(f, BF([[140, -40]])[0], shA + Math.PI - 0.3, 150, 2.6, { metal: true, depth: 3 }); // the strike that took him
    for (let i = 0; i < 9; i++) { const q = W.scatter(f, BF([[80, 4]])[0], 50, 22), r = W.R(f, 6, 12); f.part(W.lumpy(f, ell(q, r * 1.2, r, 0, 8), r * 0.3), { fill: '#2a2420', light: '#6a5e54', shade: 0.4, inkW: 1, cast: false, hatch: false }); if (f.r() < 0.5) f.flat(ell(q, r * 0.4, r * 0.3, 0, 6), P.lamp); }
    f.line(BF([[154, -56], [156, 40]]), 3, '#c8c0b0', { op: 0.5 }); // the edge worn bright and nicked
  });
  for (const y of [-30, 10]) f.flat(BF([[152, y], [160, y + 4], [152, y + 8]]), '#1a1612');

  // ---- legs: leather leggings bound with cord criss-cross, heavy calves, clogs; the front knee bent under the weight
  for (const [sfx, Hp, Kn, A, t] of [['_f', HF, KF, AF, 0.18], ['_n', HN, KN, AN, 0]]) {
    V.clog(f, A, 72, sfx, Kn, { shaft: 0.6 });
    W.legTube(f, Hp, Kn, add(A, [0, -10]), [112, 84, 62], W.LEA(f, { fill: mix('#5a4230', '#000', t), maxShade: 24 }), sfx, { A, bp: [[0, 0.4, 0.1, 0.25], [1, 0.3, 0.22, 0.2]], bq: [[0, 0.45, 0.12, 0.25], [1, 0.15, 0.06, 0.12]] });
    f.bone('shin' + sfx);
    for (let i = 0; i < 6; i++) { const t0 = 0.1 + i * 0.14; f.line([lp(Kn, A, t0, -36), lp(Kn, A, t0 + 0.08, 34)], 3, '#2a2016'); f.line([lp(Kn, A, t0, -36), lp(Kn, A, t0 + 0.08, 34)], 1.6, '#8a7a56'); f.line([lp(Kn, A, t0 + 0.08, -34), lp(Kn, A, t0 + 0.02, 34)], 1.4, '#6a5a3e', { op: 0.8 }); } // cord bindings, crossed
    W.soot(f, lp(Kn, A, 0.7), 30, 40, 0.4);
    f.bone('thigh' + sfx);
    f.stroke([lp(Hp, Kn, 0.8, -40), lp(Hp, Kn, 0.9, 0), lp(Hp, Kn, 0.86, 40)], 2.4, INK, { op: 0.6 });
    for (let i = 0; i < 4; i++) { const q = lp(Hp, Kn, W.R(f, 0.2, 0.8), W.R(f, -30, 30)); f.flat(ell(q, 4, 3, 0, 8), '#120a06', { op: 0.85 }); f.line(ell(q, 6, 4.4, 0, 8).slice(4, 8), 1, '#a8865a', { op: 0.5 }); } // spark burns
    f.bone('foot' + sfx); W.splats(f, add(A, [30, 50]), 50, 10, 6, '#15110e');
  }

  // ---- torso: massive back and shoulders bowed under the load; a sackcloth smock with burned holes, torn open at the
  // back where the basket burned through: blackened, split skin glowing round the hole
  f.bone('torso');
  const torso = [[606, 414], [606, 476], [574, 560], [536, 640], [490, 700], [482, 744, 1], [440, 756], [396, 748, 1], [352, 758], [306, 746, 1], [262, 740], [250, 690], [258, 610], [280, 520], [330, 430], [392, 370], [456, 344], [516, 350], [566, 372]];
  f.part(torso, SC());
  const back = [[250, 610, 1], [262, 560], [290, 520], [318, 540], [344, 512], [352, 560], [326, 600], [300, 590], [278, 630, 1]]; // where the basket burned through the smock into the back
  W.clipDraw(f, torso, () => {
    for (const q of [[[540, 470], [520, 560], [500, 650]], [[460, 420], [430, 540], [440, 700]], [[380, 470], [372, 600], [380, 740]], [[320, 640], [310, 700], [318, 748]]]) { f.stroke(q, 3, INK, { op: 0.5 }); f.line(q.map(z => add(z, [4, 0])), 1.4, '#7a6e58', { op: 0.5 }); }
    f.stroke([[470, 360], [420, 380], [380, 420]], 4, INK, { op: 0.4 }); // the hump's fold
    for (const [c, r] of [[[520, 520], 9], [[420, 640], 7], [[470, 720], 6], [[400, 470], 5]]) { f.flat(ell(c, r, r * 0.8, 0, 10), '#1a120c', { op: 0.9 }); f.line(ell(c, r + 2, r * 0.8 + 2, 0, 10).slice(0, 7), 1.6, P.char, { op: 0.8 }); } // burn holes
    W.soot(f, [330, 560], 60, 90, 0.45); W.soot(f, [440, 730], 60, 20, 0.4);
    f.part(back, V.CHAR(f, { inkW: 1.4 }));
    V.charCracks(f, back, [310, 550], 30, 50, 4, 50, 2, { depth: 2 });
    f.line(back.concat([back[0]]), 5, P.char, { op: 0.9 }); W.seam(f, back.slice(2, 6), 1.3, { glowOp: 0.3 });
    W.glow(f, [300, 566], 40, 40, P.lamp, 0.35);
  });
  // the straps: rope over leather pads, from the basket's rim over each shoulder and under the arm
  const pad = [[470, 346], [530, 348], [566, 372], [548, 392], [480, 372]];
  f.part(pad, W.LEA(f, { fill: '#3e2a18', inkW: 1.4, maxShade: 10 }));
  f.stitches([[480, 356], [544, 364]], '#a08a6a', 1);
  W.rope(f, [bp(0.62, 40), [500, 344], [556, 370], [580, 430], [560, 500], [500, 520], [400, 500], bp(0.2, 60)], 6, { col: '#7a6a48' });
  // the water skin on its cord at the hip
  f.bone('waterskin');
  const wsk = [290, 776];
  W.rope(f, [[300, 700], [294, 720], add(wsk, [6, -40])], 2.4, { col: '#6a5a3a' });
  f.part([add(wsk, [-4, -50]), add(wsk, [14, -48]), add(wsk, [30, -10]), add(wsk, [26, 34]), add(wsk, [2, 46]), add(wsk, [-24, 30]), add(wsk, [-26, -6])], W.LEA(f, { fill: '#5a3e26', maxShade: 20 }));
  f.part(ell(add(wsk, [4, -54]), 9, 6, 0, 10), { fill: P.wood, shade: 0.4, inkW: 1.1, cast: false });
  f.stitches([add(wsk, [-22, -4]), add(wsk, [-20, 28]), add(wsk, [2, 42])], '#a08a6a', 1);
  // belt: a rope round the smock
  f.bone('pelvis');
  W.rope(f, [[256, 680], [380, 690], [500, 680]], 7, { col: '#6a5a3c' });

  // ---- head: thrust forward and down, a broad flat face black with coke dust, eyes squeezed shut; hair and beard
  // standing straight up; a rag hanging loose below the mouth; Lichtenberg scars up the neck and across the face
  f.bone('head');
  const nk = limb([570, 400], add(HC, rot([-30, 44], hA)), 104, 92);
  f.part(nk, SKs({ fill: mix(skin, '#2a2018', 0.25) }));
  V.lich(f, nk, [586, 420], -0.4, 110, 3.4, { depth: 3, col: '#1a100a' });
  const hF = B.head(f, HC, H, hA, {
    skin, jaw: 1.24, chin: 0.02, nose: 1.0, hook: -0.2, mouth: 'grim', squint: 1, blind: true, browDown: 0.08, age: true, faceShade: 0.78, faceHatch: false, jawShade: 0.3,
    hairCol: '#2a221c', browCol: '#1a1410', browW: 0.06, beard: 'short', beardCol: '#2a221c',
    hair: [[-0.44, 0.1], [-0.46, -0.2], [-0.34, -0.42], [-0.08, -0.54], [0.18, -0.5], [0.3, -0.4], [0.12, -0.38], [-0.06, -0.34], [-0.22, -0.18], [-0.28, 0.06]],
  });
  W.clipDraw(f, hF(W.faceOutline(1.24, 0.02)), () => {
    for (const [u, v, rx, ry, op] of [[-0.2, 0.0, 0.2, 0.4, 0.5], [0.15, -0.3, 0.3, 0.12, 0.4], [0.3, 0.1, 0.1, 0.1, 0.35]]) f.flat(hF(ell([u, v], rx, ry, 0, 12)), P.sootD, { op });
    for (const [x0, x1] of [[0.04, 0.19], [0.25, 0.32]]) { f.stroke(hF([[x0, -0.07], [(x0 + x1) / 2, -0.05], [x1, -0.07]]), 4, INK); for (let i = 0; i < 3; i++) f.line(hF([[x1 + 0.01, -0.07 + i * 0.02], [x1 + 0.05, -0.08 + i * 0.03]]), 1.2, INK, { op: 0.7 }); } // eyes squeezed shut, crow's feet
    f.line(hF([[0.06, -0.12], [0.18, -0.16], [0.26, -0.13]]), 2.2, INK, { op: 0.6 }); // brow knotted
    W.lichtenberg(f, hF([[-0.14, 0.46]])[0], -0.9, 80, 2, { depth: 2, col: '#1a100a', op: 0.7 });
  });
  // the beard standing out stiff from the jaw and the hair standing up off the scalp: clumped, singed at the tips
  for (let i = 0; i < 18; i++) { const t = i / 17, a = Math.PI * (0.62 - t * 0.5), b0 = hF([[0.1 + Math.cos(a) * 0.26, 0.3 + Math.sin(a) * 0.22]])[0], out = Math.atan2(Math.sin(a), Math.cos(a)) + hA; V.clump(f, b0, out + W.R(f, -0.25, 0.25), W.R(f, 20, 34), W.R(f, 3, 4.6), i % 3 ? '#2a221c' : '#4a3e32', { bend: W.R(f, -0.4, 0.4), tipCol: '#12100c', inkOp: 0.7 }); }
  for (let i = 0; i < 30; i++) { const t = i / 29, a = Math.PI * (0.98 + t * 0.62), b0 = hF([[-0.06 + Math.cos(a) * 0.36, -0.08 + Math.sin(a) * 0.44]])[0]; V.clump(f, b0, -Math.PI / 2 - 0.8 + t * 1.3 + W.R(f, -0.15, 0.15), W.R(f, 34, 66), W.R(f, 3, 5), i % 3 ? '#2a221c' : '#463a2e', { bend: W.R(f, -0.5, 0.5), tipCol: '#12100c', inkOp: 0.75 }); }
  // the rag hanging loose below the mouth, tied behind the neck
  const rc = hF([[0.08, 0.5]])[0]; // hung from its knot behind the neck, the rag falls plumb from under the chin
  const rg = [add(rc, [-34, -10]), add(rc, [18, -2]), add(rc, [22, 30]), add(rc, [8, 58]), add(rc, [-4, 74]), add(rc, [-16, 52]), add(rc, [-30, 28])];
  f.part(rg, { fill: '#5e5442', shadow: '#221e16', light: '#867a62', shade: 0.4, maxShade: 12, tex: 'weave' + seed, texOp: 0.5 });
  W.clipDraw(f, rg, () => { f.stroke([add(rc, [-4, 0]), add(rc, [0, 30]), add(rc, [-4, 64])], 2, INK, { op: 0.5 }); f.stroke([add(rc, [10, 4]), add(rc, [12, 30])], 1.6, INK, { op: 0.45 }); W.soot(f, add(rc, [0, 30]), 16, 20, 0.5); });
  f.line([add(rc, [22, 30]), add(rc, [8, 58]), add(rc, [-4, 74])], 2.6, P.char, { op: 0.7 });

  // ---- near arm: a heavy bare arm, the fist at the haft's end
  W.armRig(f, SN, EN, WN, [98, 80, 64], SKs(), '_n', { bp: [[0, 0.2, 0.16, 0.16], [1, 0.25, 0.16, 0.2]], bq: [[0, 0.55, 0.12, 0.2]] });
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, SN, lerp(SN, EN, 0.5), 104, 96, { depth: 8, teeth: 6, p: [[0.4, 0.08, 0.25]] }), SC());
  f.stroke([lp(SN, EN, 0.15, 30), lp(SN, EN, 0.3, 10), lp(SN, EN, 0.4, 30)], 2.4, INK, { op: 0.5 });
  W.flakes(f, lp(SN, EN, 0.6), 30, 10, 4, 1);
  f.bone('forearm_n');
  W.clipDraw(f, K.chain([EN, WN], [80, 64]), () => { for (const v of [[[0.2, 10], [0.5, 18], [0.8, 8]], [[0.3, -14], [0.6, -20]]]) { const pts = v.map(([t, o]) => lp(EN, WN, t, o)); f.line(pts, 4, skinS, { op: 0.4 }); f.line(pts.map(q => add(q, [2, -2])), 1.6, '#b8957a', { op: 0.5 }); } W.soot(f, lp(EN, WN, 0.6), 30, 40, 0.4); });
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, shA, 40, skin, { tex: 'mottle' + seed, texOp: 0.45, shadow: skinS, name: 'heaver haft end' });
  for (const [x, y] of [[0.3, -0.4], [0.32, -0.1], [0.3, 0.2]]) f.flat(ell(gN.F([[x, y]])[0], 5, 3.4, 0, 6), '#b8957a', { op: 0.5 });
  f.bone('hand_f');
  B.grip(f, WF, EF, shA, 38, mix(skin, skinS, 0.15), { tex: 'mottle' + seed, texOp: 0.45, shadow: skinS, name: 'heaver haft' });
  return f;
}

// ------------------------------------------------------------------ SALAMANDER (cast, small, 0.3 tall, 0.6 long)
// A black-and-yellow fire salamander that wintered in the foundry's charcoal stacks and ran out of the wood when it was
// thrown on the forge; the smiths left it scraps on the hearthstone. Now it lives in the fire. Low on four splayed legs
// on the hearthstone, curled round a bent guild nail, the broad flat head raised toward the company, the thick tail
// curled round behind; weight in the splayed forelegs, elbows out, wrists bent, toes spread on the stone. Fire has dried
// and split its skin along the back into a net of seams glowing white-gold, so every yellow blotch burns like a coal;
// toes charred and flaking, ash curling off the spine. Lightning struck it on the anvil's foot: a fern of pale scars from
// the forefeet up the near flank, the tail tip fused into a bronze bead it drags, iron filings standing up on its back.
// Rig: spine_1 (hips, root) > spine_2 (chest) > head > jaw; tail_1 > tail_2 > tail_3; legs leg_[f|h][n|f]_1..2.
// Motion: idle a slow blink while sparks run over the back; attack a darting bite (spine_2 and head lunge, jaw opens).
function salamander() {
  const seed = 524, f = new Fig(W.base(seed, 820, { grimeY: 9999 }));
  W.textures(f);
  const gy = f.o.groundY, top = 758; // the hearthstone's face
  const BK = (o = {}) => Object.assign({ fill: '#221c1a', shadow: '#060404', light: '#6a625c', shade: 0.4, maxShade: 16, tex: 'craze' + seed, texOp: 0.35 }, o); // glossy black skin
  const HC = [470, 650], hA = -0.28, hF = frame(HC, hA, 1);
  const spine = [[420, 690], [380, 702], [320, 708], [262, 712], [218, 712]];
  const tail = W.spline([[226, 712], [176, 704], [118, 712], [84, 736], [96, 760], [150, 770], [214, 772], [258, 770]], 6);
  const LEG = {
    fn: { S: [392, 716], E: [420, 738], W: [426, 754], T: [448, top - 2], ta: 0.1 },
    ff: { S: [372, 712], E: [360, 738], W: [354, 752], T: [372, top - 4], ta: -0.3 },
    hn: { S: [242, 720], E: [276, 740], W: [268, 754], T: [246, top - 2], ta: Math.PI + 0.2 },
    hf: { S: [226, 716], E: [210, 738], W: [204, 752], T: [184, top - 4], ta: Math.PI - 0.2 },
  };
  f.joint('spine_1', [262, 712]).joint('spine_2', [340, 706], 'spine_1').joint('head', [432, 682], 'spine_2').joint('jaw', hF([[-24, 10]])[0], 'head');
  f.joint('tail_1', [222, 712], 'spine_1').joint('tail_2', [96, 730], 'tail_1').joint('tail_3', [150, 770], 'tail_2');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.S, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.E, `leg_${k}_1`);

  // glowing blotch: a coal-bright patch with a charred rim and a white-gold heart, split by its own small seams
  const blotch = (c, rx, ry, a) => {
    const e = W.lumpy(f, ell(c, rx, ry, a, 12), Math.min(rx, ry) * 0.35);
    W.glow(f, c, rx * 1.8, ry * 1.8, P.lamp, 0.35);
    f.flat(e, P.ember); f.flat(W.lumpy(f, ell(c, rx * 0.72, ry * 0.68, a, 10), 2), P.lamp); f.flat(ell(add(c, [1, -1]), rx * 0.35, ry * 0.32, a, 8), P.hot);
    f.line(e.concat([e[0]]), 2.4, P.char, { op: 0.85 });
    W.hairline(f, [add(c, rot([-rx * 0.6, 0], a)), c, add(c, rot([rx * 0.5, ry * 0.4], a))], 0.8);
  };
  // a splayed leg: upper limb, a bent elbow or knee, a wrist down onto a spread hand of fat toes
  const leg = (k, far) => {
    const L = LEG[k], tone = far ? 0.25 : 0, front = k[0] === 'f', look = BK({ fill: mix('#221c1a', '#000', tone) });
    f.bone(`leg_${k}_1`);
    f.part(limb(L.S, L.E, 36, 26, { steps: 8, p: [[0.4, 0.16, 0.25]], q: [[0.5, 0.1, 0.25]] }), look);
    f.bone(`leg_${k}_2`);
    f.part(K.chain([L.E, L.W, add(L.W, rot([10, 0], L.ta))], [26, 20, 18], { bp: [[0, 0.3, 0.12, 0.2]] }), look);
    f.line([lp(L.E, L.W, 0.2, 5), lp(L.E, L.W, 0.8, 4)], 1.4, '#7a726a', { op: 0.5 }); // gloss
    const nT = front ? 4 : 5;
    for (let i = 0; i < nT; i++) {
      if (k === 'hn' && i === 2) continue; // a missing toe
      const a = L.ta + (i - (nT - 1) / 2) * 0.46, b0 = add(L.W, [0, 3]), t0 = add(b0, rot([20 + (i === 1 ? 5 : 0), 0], a));
      const tp = [b0, add(b0, rot([8, -1], a)), t0, add(t0, [0, top - t0[1]])].map((q, j) => j === 3 ? [q[0], Math.min(q[1], top), 1] : q);
      f.part(K.chain([b0, t0], [10, 7]), Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false }));
      f.part(ell(add(t0, [0, 1]), 4.4, 3.6, 0, 8), Object.assign({}, look, { fill: mix('#2a1e18', P.ember, 0.25), inkW: 0.9, cast: false })); // the toe pad, charred
      if (f.r() < 0.5) W.flakes(f, t0, 4, 2, 1, 0.5);
    }
    f.flat(ell([L.W[0], top + 1], 24, 3, 0, 10), '#000', { op: 0.35 });
  };

  f.bone('root');
  V.slab(f, 50, 570, gy, gy - top, { col: '#4a443e' });
  W.clipDraw(f, [[40, top - 10], [580, top - 10], [580, gy + 10], [40, gy + 10]], () => { W.scorch(f, [320, top + 8], 200, 14, 0.5); W.lichtenberg(f, [400, top + 2], 0.2, 120, 2.2, { metal: true, depth: 2 }); });
  f.flat(ell([300, top + 2], 200, 6, 0, 20), '#000', { op: 0.4 });

  // ---- far legs, behind the body
  leg('hf', true); leg('ff', true);

  // ---- tail: thick at the root, curled round behind and forward along the stone; a scorched notch in its upper edge;
  // the tip fused into a bead of bronze that drags
  const tS = W.arcLen(tail), tL = tS[tS.length - 1];
  const segs = [['tail_1', 0, 0.36], ['tail_2', 0.34, 0.68], ['tail_3', 0.66, 1.0]];
  for (const [bn, u0, u1] of segs) {
    f.bone(bn);
    const pts = [], ws = [];
    for (let i = 0; i <= 8; i++) { const u = (u0 + (u1 - u0) * i / 8) * tL, q = W.at(tail, tS, u); pts.push(q.p); ws.push(46 * (1 - (u / tL) * 0.78)); }
    f.part(K.chain(pts, ws), BK());
    W.clipDraw(f, K.chain(pts, ws), () => {
      for (let i = 0; i < 3; i++) { const u = (u0 + (u1 - u0) * (0.2 + i * 0.3)) * tL, q = W.at(tail, tS, u); blotch(add(q.p, mul(q.n, -4)), 9 - u / tL * 4, 6, Math.atan2(q.d[1], q.d[0])); }
      for (let i = 1; i < 6; i++) { const u = (u0 + (u1 - u0) * i / 6) * tL, q = W.at(tail, tS, u); f.line([add(q.p, mul(q.n, 16)), add(q.p, mul(q.n, -16))], 1, INK, { op: 0.4 }); } // annular grooves
      f.line(pts.map((q, i) => add(q, mul(W.at(tail, tS, (u0 + (u1 - u0) * i / 8) * tL).n, ws[i] * 0.3))), 2, '#9a928a', { op: 0.35 }); // the gloss
    });
  }
  f.bone('tail_1');
  { const q = W.at(tail, tS, tL * 0.22); f.flat([add(q.p, mul(q.n, 22)), add(add(q.p, mul(q.n, 12)), mul(q.d, 8)), add(q.p, mul(q.n, 16)), add(add(q.p, mul(q.n, 12)), mul(q.d, -8))], '#060404'); f.line([add(add(q.p, mul(q.n, 12)), mul(q.d, -8)), add(add(q.p, mul(q.n, 12)), mul(q.d, 8))], 1.4, P.lamp, { op: 0.8 }); } // the scorched notch
  f.bone('tail_3');
  const bead = tail[tail.length - 1];
  f.part(ell(add(bead, [10, -6]), 15, 13, 0, 14), W.BR(f, { fill: '#a07440', inkW: 1.5 }));
  f.flat(ell(add(bead, [6, -12]), 5, 3, -0.4, 8), P.bronzeP, { op: 0.8 }); W.verdigris(f, add(bead, [14, 0]), 6, 4, 0.5);
  f.line([add(bead, [24, 4]), add(bead, [60, 5]), add(bead, [96, 4])], 1.4, '#7a6a5a', { op: 0.5 }); // the drag line it leaves on the stone

  // ---- body: thick, round in section, sagging to the stone between the legs; the back split into glowing seams
  f.bone('spine_1');
  const body = K.chain(spine, [62, 70, 74, 70, 54], { bq: [[1, 0.5, 0.12, 0.3], [2, 0.5, 0.1, 0.3]] });
  split(f, () => {
    f.part(body, BK());
    W.clipDraw(f, body, () => {
      f.raw(`<path d="${E.smooth([[420, 718], [330, 734], [230, 734], [230, 744], [420, 744]])}" fill="${P.char}" opacity="0.6" filter="url(#smk${seed})"/>`); // the soot crust on the belly
      for (const [c, rx, ry, a] of [[[398, 688], 12, 8, 0.3], [[362, 684], 22, 9, -0.1], [[338, 694], 8, 6, 0.6], [[296, 688], 15, 10, 0.2], [[258, 696], 10, 7, -0.4], [[326, 712], 13, 6, 0.1], [[280, 716], 7, 5, 0.5], [[232, 706], 9, 6, 0.3]]) blotch(c, rx, ry, a);
      W.crackNet(f, [400, 688], Math.PI, 90, 1.6, { depth: 2, glowOp: 0.3 }); W.crackNet(f, [300, 690], Math.PI, 80, 1.4, { depth: 1, glowOp: 0.3 });
      // the pale fern of the strike, from the forefoot up across the near flank
      W.lichtenberg(f, [408, 726], -2.6, 120, 2.6, { depth: 3, col: '#c8c0b0', op: 0.55 });
      f.line([[420, 682], [340, 676], [250, 684]], 3, '#9a928a', { op: 0.4 }); // gloss along the back
    });
  }, [['spine_1', side([340, 706], [1, 0], 34)], ['spine_2', side([340, 706], [-1, 0], 34)]]);
  // ash curling off the spine's ridge; iron filings standing in stiff bristles
  f.bone('spine_2');
  for (let i = 0; i < 22; i++) { const x = W.R(f, 236, 410), y = 708 - 33 - (x - 236) * 0.06 + W.R(f, -1, 2), l = W.R(f, 7, 14); f.line([[x, y + 4], [x + W.R(f, -2, 2), y - l]], 2.2, INK); f.line([[x, y + 4], [x + W.R(f, -1, 1), y - l + 2]], 0.9, '#8a847a', { op: 0.7 }); }
  W.ash(f, [330, 652], 12, 120, 90, 0.8);

  // the bent guild nail it lies curled round: a long smith-made nail on the stone between its legs, bent up at the
  // point, the guild's mark on its head
  f.bone('root');
  const nb = [[300, top - 4], [420, top - 5], [500, top - 8], [524, top - 30]];
  f.stroke(nb, 11, INK); f.stroke(nb, 7.4, P.iron); f.line(nb.map(q => add(q, [0, -2])), 1.4, P.ironL, { op: 0.6 });
  f.part(ell([292, top - 5], 5, 11, 0, 10), W.IR(f, { fill: P.ironL, inkW: 1.3, cast: false })); f.line([[289, top - 10], [295, top]], 1.4, INK, { op: 0.7 });
  // ---- near hind leg, then the shed skin curling off it
  leg('hn', false);
  f.bone('leg_hn_1');
  f.flat([[248, 724], [272, 736], [282, 728], [270, 746], [260, 742], [244, 732]], '#c8bca4', { op: 0.55 }); f.line([[272, 736], [282, 728], [286, 720]], 1.2, '#e8dcc4', { op: 0.7 });

  // ---- head and neck raised toward the company: a broad flat head, swollen glands behind the eyes cracked and glowing,
  // small black eyes, a wide closed mouth; a split across the throat
  f.bone('jaw');
  const jaw = hF([[-34, 4], [0, 10], [34, 12], [52, 10], [48, 20], [20, 24], [-20, 22], [-40, 14]]);
  f.part(jaw, BK({ fill: '#2a2220' }));
  f.bone('head');
  f.part(K.chain([[400, 698], [430, 682], hF([[-26, 2]])[0]], [64, 56, 46]), BK()); // the neck
  const skull = hF([[-40, -8], [-30, -22], [-4, -26], [26, -22], [48, -12], [58, -2], [56, 8], [40, 12], [0, 12], [-36, 12]]);
  f.part(skull, BK());
  W.clipDraw(f, skull, () => { f.line(hF([[-30, -20], [10, -24], [44, -14]]), 2.4, '#9a928a', { op: 0.45 }); blotch(hF([[8, -16]])[0], 8, 5, hA); });
  // the gland: a swollen kidney behind the eye, split and glowing
  const gl = hF([[-34, -16], [-24, -30], [-4, -30], [4, -18], [-6, -8], [-28, -6]]);
  f.part(gl, BK({ fill: '#2a2220' }));
  W.clipDraw(f, gl, () => { f.flat(gl, P.ember, { op: 0.6 }); W.crackNet(f, hF([[-16, -20]])[0], hA, 26, 1.6, { depth: 1, glowOp: 0.4 }); for (let i = 0; i < 5; i++) f.flat(ell(hF([[-26 + i * 6, -22 + (i % 2) * 5]])[0], 1.6, 1.6, 0, 6), '#060404'); });
  f.line(gl.concat([gl[0]]), 1.6, P.char);
  f.part(ell(hF([[18, -12]])[0], 7, 6, hA, 12), { fill: '#0a0606', light: '#3a3230', shade: 0.3, inkW: 1.4, cast: false, hatch: false }); // the eye, small, black, bulging
  f.flat(ell(hF([[16, -15]])[0], 2.2, 1.6, hA, 6), '#e8e0d0', { op: 0.85 });
  f.line(hF([[10, -18], [18, -20], [26, -16]]), 1.6, INK, { op: 0.7 }); // the lid
  f.line(hF([[-36, 11], [0, 12], [36, 11], [54, 7]]), 2.2, INK); // the wide closed mouth
  f.flat(ell(hF([[54, -4]])[0], 1.6, 1.4, 0, 6), '#060404'); // nostril
  W.seam(f, [hF([[-44, 18]])[0], [424, 712], [410, 718]], 1.4, { glowOp: 0.35 }); // the split across the throat
  W.sparks(f, hF([[-10, -30]])[0], 5, 20, { spread: 1.6 });

  // ---- near foreleg, in front; a drop of solder fused to the foot
  leg('fn', false);
  f.bone('leg_fn_2');
  f.part(ell([440, top - 9], 6, 5, 0, 10), W.BR(f, { fill: '#a07440', inkW: 1.1, cast: false }));
  return f;
}

// ------------------------------------------------------------------ HEARTH CAT (cast, small 0.35)
// A thin foundry cat that slept on warm anvils. Side-on, the back arched high over a tucked belly, all four legs stiff
// and straight up on its toes, the tail up and bottle-brushed, the head low and forward with the ears pinned flat,
// eyes slitted, mouth open in a hiss over small teeth. Lightning has made the whole coat stand out stiff in a static
// halo of clumped fur; a fern of branching scars runs across one bare flank. Fire has singed bare patches whose skin is
// blackened and split in glowing seams, charred the tail tip, burned the whiskers to stubs and scorched the paw pads.
// A leather collar with a bronze bell, its clapper fused silent; a notch in one ear; a scrap of apron string tangled
// round a hind leg; a smear of soot along the back.
// Rig: spine_1 (hips, root) > spine_2 (chest) > neck > head > jaw; tail_1 > tail_2; legs leg_[f|h][n|f]_1..3.
// Motion: idle kneading the floor (fore paws lift in turn); attack a spitting leap and a scratch (spine and forelegs).
function hearthCat() {
  const seed = 530, f = new Fig(W.base(seed, 820, { grimeY: 9999 }));
  W.textures(f);
  const gy = f.o.groundY;
  const coat = '#5e564c', coatD = '#3a342e', coatL = '#8e857a';
  const FUR = (o = {}) => Object.assign({ fill: coat, shadow: '#1a1612', light: coatL, shade: 0.4, maxShade: 16, tex: 'hatch' + seed, texOp: 0.25 }, o);
  const HC = [476, 652], hA = 0.32, hF = frame(HC, hA, 1.3);
  const LEG = { // H top (shoulder or hip), K elbow or stifle, A wrist or hock, T paw
    fn: { H: [420, 668], K: [418, 712], A: [424, 762], T: [436, gy] },
    ff: { H: [404, 664], K: [398, 710], A: [400, 764], T: [410, gy] },
    hn: { H: [236, 662], K: [262, 704], A: [226, 748], T: [240, gy] },
    hf: { H: [222, 656], K: [240, 702], A: [204, 746], T: [214, gy] },
  };
  f.joint('spine_1', [250, 640]).joint('spine_2', [330, 600], 'spine_1').joint('neck', [418, 630], 'spine_2').joint('head', [448, 650], 'neck').joint('jaw', hF([[-14, 10]])[0], 'head');
  f.joint('tail_1', [214, 622], 'spine_1').joint('tail_2', [178, 520], 'tail_1');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.H, par).joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }

  // fur standing out from an outline: clumps along its normal, longer where o.len says, a few stray wires
  const halo = (pts, len, o = {}) => {
    const C = W.spline(pts, 5), Sx = W.arcLen(C), L = Sx[Sx.length - 1], n = Math.round(L / (o.step ?? 7));
    for (let i = 0; i <= n; i++) {
      const u = i / n * L, q = W.at(C, Sx, u), sg = o.side ?? 1, a = Math.atan2(q.n[1] * sg, q.n[0] * sg) + W.R(f, -0.35, 0.35) + (o.lean ?? 0);
      const l = (typeof len === 'function' ? len(i / n) : len) * W.R(f, 0.65, 1.15);
      const rr = f.r(); V.clump(f, add(q.p, mul(q.n, -sg * 4)), a, l, W.R(f, 2.4, 4) * (o.w ?? 1), rr < 0.4 ? coatD : rr < 0.85 ? coat : coatL, { bend: W.R(f, -0.4, 0.4), tipCol: f.r() < (o.singe ?? 0.3) ? '#1a1410' : undefined, inkOp: 0.4, lit: mix(coat, '#fff', 0.2) });
    }
  };
  // one leg in one outline from the top of the limb to the paw, cut at the elbow/stifle and the wrist/hock for the rig;
  // part 1 draws the limb (and a fringe of fur down its back), part 3 the paw
  const legPart = (k, part, far) => {
    const L = LEG[k], front = k[0] === 'f', look = FUR({ fill: mix(coat, '#000', far ? 0.28 : 0) }), pt = [L.T[0] - 4, gy - 14];
    if (part === 1) {
      const dk = elb(L.H, L.K, L.A), da = elb(L.K, L.A, pt);
      split(f, () => {
        f.part(K.chain([L.H, L.K, L.A, pt], front ? [36, 21, 15, 14] : [52, 24, 13, 13], { bp: front ? [] : [[0, 0.4, 0.22, 0.25], [1, 0.2, 0.3, 0.12]], bq: front ? [[0, 0.3, 0.12, 0.2]] : [[0, 0.5, 0.14, 0.25]] }), look);
        f.line([lp(L.K, L.A, 0.1, 3), lp(L.K, L.A, 0.9, 2)], 1, coatL, { op: 0.5 });
        if (!far) halo(front ? [lp(L.H, L.K, 0.0, -18), lp(L.H, L.K, 0.9, -10)] : [lp(L.H, L.K, -0.1, 26), lp(L.H, L.K, 0.6, 22)], 10, { side: front ? 1 : -1, step: 5, w: 0.8, lean: 0.4 });
      }, [[`leg_${k}_1`, side(L.K, mul(dk, -1), 14)], [`leg_${k}_2`, [side(L.K, dk, 14), side(L.A, mul(da, -1), 10)]], [`leg_${k}_3`, side(L.A, da, 10)]]);
    }
    if (part === 3) {
      f.bone(`leg_${k}_3`);
      // the paw: up on its toes, three knuckled toes and a heel pad, the pads scorched
      const X = u => L.T[0] + u * 12;
      f.part([[X(-1.4), gy - 2, 1], [X(-1.5), gy - 14], [X(-0.6), gy - 22], [X(0.8), gy - 22], [X(1.8), gy - 12], [X(1.9), gy - 1, 1]], look);
      for (let i = 0; i < 3; i++) { const tx = X(-0.4 + i * 0.9); f.line([[tx, gy - 18], [tx + 1, gy - 4]], 1.2, INK, { op: 0.6 }); }
      f.flat([[X(-1.3), gy - 2], [X(1.8), gy - 2], [X(1.6), gy + 1], [X(-1.2), gy + 1]], '#1a0e08');
      f.flat(ell([X(1.6), gy - 3], 3, 2, 0, 6), P.lamp, { op: 0.7 }); // a pad still hot
      f.flat(ell(L.T, 22, 3, 0, 10), '#000', { op: 0.3 });
    }
  };

  f.bone('root');
  f.flat(ell([330, gy + 2], 150, 7, 0, 16), '#000', { op: 0.35 });
  // ---- far legs (behind)
  for (const k of ['hf', 'ff']) for (const p of [1, 3]) legPart(k, p, true);

  // ---- tail: up and bottle-brushed, bent over at the top, its tip charred to a bare black stub
  const tl = W.spline([[214, 626], [192, 590], [176, 540], [174, 496], [186, 462], [206, 446]], 5);
  const tS = W.arcLen(tl), tL = tS[tS.length - 1];
  for (const [bn, u0, u1] of [['tail_1', 0, 0.52], ['tail_2', 0.48, 1]]) {
    f.bone(bn);
    const pts = []; for (let i = 0; i <= 6; i++) pts.push(W.at(tl, tS, (u0 + (u1 - u0) * i / 6) * tL).p);
    f.part(K.chain(pts, pts.map((_, i) => 22 - (u0 + (u1 - u0) * i / 6) * 10)), FUR({ fill: coatD }));
    const uEnd = Math.min(u1, 0.86);
    if (uEnd > u0) { const hp = []; for (let i = 0; i <= 8; i++) hp.push(W.at(tl, tS, (u0 + (uEnd - u0) * i / 8) * tL).p); halo(hp, 26, { step: 3.5, w: 1.1 }); halo(hp, 26, { side: -1, step: 3.5, w: 1.1 }); }
  }
  f.bone('tail_2');
  const tip = tl.slice(Math.floor(tl.length * 0.84));
  f.stroke(tip, 14, INK); f.stroke(tip, 10, P.char); W.seam(f, tip.slice(0, Math.max(2, tip.length - 1)), 1.2, { glowOp: 0.3 });
  W.ash(f, tl[tl.length - 1], 6, 20, 50, 0.6);

  // ---- body: deep chest, the back arched high, the belly tucked up; a singed bare patch on the flank
  f.bone('spine_1');
  const body = [[204, 640], [214, 612], [250, 588], [300, 572], [350, 576], [396, 598], [428, 626], [440, 664], [428, 700], [404, 712], [370, 700], [330, 684], [290, 686], [262, 700], [236, 694], [212, 672]];
  const bare = W.lumpy(f, [[296, 640], [312, 628, 1], [330, 626], [348, 616, 1], [362, 640], [356, 662, 1], [338, 674], [318, 664, 1], [300, 666]], 4);
  split(f, () => {
    f.part(body, FUR());
    W.clipDraw(f, body, () => {
      for (let i = 0; i < 7; i++) { const x = 230 + i * 28; f.stroke([[x, 590 + Math.abs(x - 310) * 0.12], [x + 6, 630], [x - 2, 668]], 6, coatD, { op: 0.6 }); } // tabby bars over the arch
      f.raw(`<path d="${E.smooth([[250, 588], [300, 572], [350, 576], [396, 598], [380, 610], [300, 596], [240, 612]])}" fill="${P.sootD}" opacity="0.5" filter="url(#smk${seed})"/>`); // the soot smear along the back
      f.raw(`<path d="${E.smooth([[300, 680], [400, 706], [420, 690], [330, 670]])}" fill="#000" opacity="0.35" filter="url(#smk${seed})"/>`); // the chest's underside
      // the ribs, visible on a thin cat
      for (let i = 0; i < 4; i++) f.stroke([[352 - i * 14, 640], [346 - i * 14, 664], [350 - i * 14, 686]], 2, coatD, { op: 0.5 });
      f.part(bare, V.CHAR(f, { inkW: 1.3 }));
      W.clipDraw(f, bare, () => { W.lichtenberg(f, [360, 660], Math.PI + 0.3, 80, 2.2, { depth: 3, col: '#c8b8a0', op: 0.6 }); W.crackNet(f, [330, 650], 0.4, 40, 1.4, { depth: 1, glowOp: 0.35 }); });
      f.line(bare.concat([bare[0]]), 3, P.char, { op: 0.9 }); // the fur singed back round it
    });
  }, [['spine_1', side([330, 600], [1, 0], 30)], ['spine_2', side([330, 600], [-1, 0], 30)]]);
  // the static halo: the coat standing out stiff all along the arch, the rump and the chest
  f.bone('spine_1');
  halo([[206, 652], [212, 616], [250, 590], [300, 574], [330, 573]], t => 18 + Math.sin(t * Math.PI) * 30, { step: 3.2 });
  halo([[214, 676], [240, 694], [262, 700]], 14, { side: -1, step: 7 });
  f.bone('spine_2');
  halo([[330, 573], [360, 578], [396, 600], [420, 622]], t => 40 - t * 20, { step: 3.2 });
  halo([[300, 688], [340, 690], [380, 704], [410, 712]], 16, { side: -1, step: 6 });
  W.sparks(f, [300, 540], 6, 30, { spread: 2 });

  // ---- near legs
  for (const k of ['hn', 'fn']) for (const p of [1, 3]) legPart(k, p, false);
  f.bone('leg_hn_2'); // the scrap of apron string tangled round the hind leg
  f.line([lp(LEG.hn.K, LEG.hn.A, 0.4, -10), lp(LEG.hn.K, LEG.hn.A, 0.48, 10), lp(LEG.hn.K, LEG.hn.A, 0.6, -10), lp(LEG.hn.K, LEG.hn.A, 0.66, 8)], 2.6, '#8a7e64');
  f.line([lp(LEG.hn.K, LEG.hn.A, 0.66, 8), add(lp(LEG.hn.K, LEG.hn.A, 0.66, 8), [8, 20]), add(lp(LEG.hn.K, LEG.hn.A, 0.66, 8), [2, 36])], 2.2, '#8a7e64'); // its end hanging

  // ---- neck, collar and head: low and forward, ears pinned flat, eyes slitted, mouth open in a hiss
  f.bone('neck');
  f.part(K.chain([[400, 616], [430, 636], hF([[-18, 6]])[0]], [56, 50, 42]), FUR());
  halo([[400, 594], [426, 612], hF([[-20, -16]])[0]], 22, { step: 5 });
  // the collar: worn leather, a bronze bell, its clapper fused into the mouth so it hangs silent
  const cl = [[436, 602], [446, 608], [416, 656], [406, 650]];
  f.part(cl, W.LEA(f, { fill: '#4a3020', inkW: 1.3, cast: false, k: 0.5 }));
  f.stitches([[440, 606], [411, 652]], '#a08a6a', 0.7);
  const bc = [410, 674];
  f.line([[411, 654], add(bc, [0, -10])], 2, P.iron);
  f.part([add(bc, [-10, 6]), add(bc, [-9, -4]), add(bc, [-4, -10]), add(bc, [4, -10]), add(bc, [9, -4]), add(bc, [10, 6]), add(bc, [12, 9]), add(bc, [-12, 9])], W.BR(f, { fill: '#a07440', inkW: 1.3, cast: false }));
  f.flat(ell(add(bc, [0, 9]), 9, 2.6, 0, 10), '#1a0e06'); f.part(ell(add(bc, [1, 10]), 3.4, 3, 0, 8), W.BR(f, { fill: '#6a4a28', inkW: 1, cast: false })); W.weld(f, [add(bc, [-6, 9]), add(bc, [1, 10]), add(bc, [7, 9])], 2.2, { lich: false });
  f.flat(ell(add(bc, [-4, -4]), 2.4, 1.6, 0, 6), P.bronzeP, { op: 0.8 });

  f.bone('jaw');
  const jaw = hF([[-16, 8], [6, 14], [26, 22], [34, 30], [24, 34], [0, 30], [-16, 20]]);
  f.part(jaw, FUR({ fill: '#6a6258' }));
  for (const x of [8, 16, 24]) f.part(hF([[x, 22], [x + 3, 15], [x + 5, 23]]), { fill: '#e0d6c4', shade: 0.2, inkW: 0.8, cast: false }); // lower teeth
  f.bone('head');
  f.flat(hF([[-6, 6], [34, 6], [40, 14], [34, 28], [6, 20]]), '#3a0e0a'); // the open mouth
  f.flat(hF([[6, 16], [26, 18], [30, 24], [10, 22]]), '#8a3a32', { op: 0.8 }); // the tongue
  const skull = hF([[-30, -4], [-24, -22], [-6, -30], [14, -26], [28, -16], [40, -8], [46, 0], [42, 8], [30, 8], [14, 6], [-8, 12], [-26, 10]]);
  f.part(skull, FUR());
  W.clipDraw(f, skull, () => {
    f.stroke(hF([[-8, -26], [6, -20], [16, -24]]), 3, coatD, { op: 0.7 }); f.stroke(hF([[-14, -22], [-2, -14]]), 2.6, coatD, { op: 0.6 }); // tabby marks on the brow
    f.raw(`<path d="${E.smooth(hF([[14, -6], [36, -4], [40, 6], [18, 6]]))}" fill="${coatL}" opacity="0.5" filter="url(#smk${seed})"/>`); // the muzzle pad
    f.flat(hF(ell([-10, -6], 8, 6, 0, 10)), P.char, { op: 0.6 }); // a singed patch on the cheek
  });
  for (const x of [26, 32]) f.part(hF([[x, 6], [x + 2, 16], [x + 4, 6]]), { fill: '#e8e0d0', shade: 0.2, inkW: 0.8, cast: false }); // upper fangs
  f.part(hF([[38, -6], [46, -4], [46, 2], [40, 2]]), { fill: '#5a3a34', shade: 0.3, inkW: 1, cast: false }); // the nose leather
  // the eye: narrowed to a slit, a hard vertical pupil, glinting
  const eye = hF([[8, -16], [16, -19], [26, -16], [17, -12]]);
  f.flat(hF(ell([17, -15], 10, 7, 0, 10)), '#120c08', { op: 0.6 });
  f.flat(eye, '#c8a43a'); f.flat(hF([[16, -18.5], [18, -18.5], [18, -12.5], [16, -12.5]]), '#060404'); f.flat(ell(hF([[21, -16]])[0], 1.2, 1, 0, 6), '#fff', { op: 0.9 });
  f.line(hF([[6, -16], [16, -21], [28, -17]]), 2, INK); f.line(hF([[8, -12], [18, -11], [26, -14]]), 1.2, INK, { op: 0.7 });
  // ears pinned flat back along the skull, one notched; burnt whisker stubs
  for (const [ea, far] of [[[[-18, -22], [-30, -30], [-40, -26], [-28, -16]], true], [[[-8, -27], [-22, -36], [-34, -33], [-22, -21]], false]]) {
    f.part(hF(ea), FUR({ fill: far ? coatD : coat, inkW: 1.3, cast: false, k: 0.6 }));
    if (!far) { f.flat(hF([[-24, -35], [-21, -31], [-18, -34.5]]), '#000'); f.flat(hF([[-12, -27], [-22, -32], [-26, -29], [-18, -24]]), '#6a4a44', { op: 0.6 }); for (let i = 0; i < 4; i++) f.line(hF([[-10 - i * 5, -28 + i], [-14 - i * 5, -34 + i * 0.5]]), 1, coatL, { op: 0.6 }); } // the ear's inner hairs
  }
  for (let i = 0; i < 6; i++) { const b0 = hF([[30 + (i % 3) * 3, -2 + Math.floor(i / 3) * 5]])[0]; f.line([b0, add(b0, rot([W.R(f, 5, 9), 0], hA + 0.3 - i * 0.12))], 1.2, '#1a1410'); f.flat(ell(add(b0, rot([W.R(f, 6, 9), 0], hA + 0.3 - i * 0.12)), 1.2, 1.2, 0, 5), '#0a0808'); }
  halo([hF([[-30, -4]])[0], hF([[-30, 10]])[0], hF([[-12, 16]])[0]], 14, { step: 5, side: -1 }); // the ruff standing out under the jaw
  W.sparks(f, hF([[34, 26]])[0], 4, 16, { ang: 0.6, spread: 1.4 });
  return f;
}

// ------------------------------------------------------------------ THE WIRE-DRAWER (elite 2.1)
// A guild wire-drawer, a big broad long-armed man who pulled hot bronze through a draw-plate into wire for cables, chain
// and automata. He leans back hard as if hauling on a line, the near foot braced forward, the far leg bent under his
// hips, the heavy draw-tongs held in both fists close to his chest (both forearms near square to the reins); the jaws
// grip a live wire that runs out taut ahead of him. Great coils of drawn bronze wire hang over both shoulders like a
// mantle, the ends trailing to the floor, one end fused into his back. The steel draw-plate hangs on his chest on a
// chain. Fire dominates: forearms and chest blackened and split with glowing seams, the hands burned smooth and shining
// where the gauntlets burst. Lightning has fused wire into him: loops of wire welded into the skin of the shoulders in
// bands, scars branching from every weld, his last hair stood in stiff singed tufts. Bald soot-black head, ears singed,
// jaw clenched, squinting behind smoked-glass goggles. Layers: skin, wire mantle, waist apron, leggings, belt of spools.
// Rig: standard humanoid + tongs (hand_f; the near hand will need IK onto the reins) + wire (tongs, the live line) +
// coil_n, coil_f (torso) + trail (coil_n, the end on the floor) + apron (pelvis).
// Motion: idle the coils ticking as they cool (coils sway a little); attack a length of live wire whipped round a hero
// and hauled tight (both arms whip forward, then haul back: the wire is an FX line from the tongs' jaws).
function wireDrawer() {
  const seed = 522, CW = 1100, CH = 1400, f = new Fig(W.base(seed, CH, { grimeY: 1080 }));
  W.textures(f);
  const gy = f.o.groundY, H = 206;
  const BLK = (o = {}) => V.CHAR(f, Object.assign({ fill: '#33261e', light: '#6a5242', maxShade: 34 }, o)); // fire-blackened skin
  const SKs = (o = {}) => W.SK(f, Object.assign({ fill: '#7a604e', shadow: '#24160e', maxShade: 34 }, o));
  const N = [384, 330], C = [440, 590], Pv = [560, 806];
  const S = B.spine(N, C, Pv, H);
  const SN = [356, 384], SF = [446, 368];
  const EN = [300, 624], WN = [540, 530];
  const EF = [448, 642], WF = [610, 600];
  const HN = [604, 824], KN = [758, 1060], AN = [856, 1300];
  const HF = [530, 816], KF = [456, 1062], AF = [440, 1300];
  const HC = [438, 212], hA = 0.1;
  const tA = ang(WN, WF), pivot = add(WF, rot([150, 0], tA)), jaws = add(WF, rot([236, 0], tA));
  const coilN = [296, 640], coilF = [500, 600];

  W.humanJoints(f, { P: Pv, T: S.at(0, 0.84), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('tongs', WF, 'hand_f').joint('wire', jaws, 'tongs').joint('coil_n', [356, 380], 'torso').joint('coil_f', [470, 364], 'torso').joint('trail', [300, 880], 'coil_n').joint('apron', S.at(0.2, 0.8), 'pelvis');

  f.bone('root');
  f.flat(ell([600, gy + 3], 300, 12, 0, 20), '#000', { op: 0.35 });
  W.splats(f, [620, gy - 4], 220, 6, 12, '#15110e');

  // ---- the far coil, behind the body: its loops hang from the far shoulder down past the hip
  f.bone('coil_f');
  V.wireCoil(f, coilF, 130, 236, 0.3, 12, 6.4, { gap: 4.2, jit: 0.05, col: '#6e4e2c', sprung: [3, 9] });

  // ---- far arm (behind): blackened forearm, a leather gauntlet, the fist forward on the reins
  W.muscleArm(f, SF, EF, WF, [104, 86, 74], BLK({ fill: '#3e2e26' }), '_f');
  f.bone('forearm_f');
  V.charCracks(f, K.chain([EF, WF], [96, 84]), lerp(EF, WF, 0.4), 30, 30, 3, 60, 2);
  f.part(plate(EF, WF, 0.68, 1.06, 100, 104), W.LEA(f, { fill: '#3a2818', maxShade: 20 })); // gauntlet cuff
  f.line([lp(EF, WF, 0.74, -50), lp(EF, WF, 0.74, 50)], 2, INK, { op: 0.6 });

  // ---- the draw-tongs: two long iron reins through both fists to a pivot, short hooked jaws biting the wire's end;
  // the live wire runs out taut ahead, sagging only a little, to the bench out of frame
  f.bone('tongs');
  const TF = frame(WF, tA, 1);
  for (const sg of [-1, 1]) f.part(TF([[-150, sg * 9 - 2], [150, sg * 9], [150, sg * 3], [-150, sg * 3 - 2]].map(q => [q[0], q[1], 1])), W.IR(f, { inkW: 1.8 }));
  f.part(TF([[-166, -14], [-148, -14], [-148, 14], [-166, 14]].map(q => [q[0], q[1], 1])), W.IR(f, { inkW: 1.4, cast: false })); // the ring that locks the reins
  f.part(ell(pivot, 17, 17, 0, 12), W.IR(f, { fill: P.ironL, inkW: 1.6 })); f.rivet(pivot, 6, '#9a948a');
  for (const sg of [-1, 1]) f.part(TF([[150, sg * 6], [196, sg * 22], [236, sg * 14], [244, sg * 2], [232, -sg * 2], [200, sg * 8]]), W.IR(f, { inkW: 1.8, fill: mix(P.iron, P.ember, 0.2) })); // the jaws, heat-blued and hooked
  V.lich(f, TF([[-150, -10], [150, -10], [150, 10], [-150, 10]]), TF([[100, 0]])[0], tA + Math.PI, 200, 2, { metal: true, depth: 2 });
  f.bone('wire');
  const wr = [jaws, add(jaws, [90, 70]), add(jaws, [190, 150]), add(jaws, [300, 232])];
  f.line(wr, 6, INK); f.line(wr, 3.6, '#b08450'); f.line(wr.map(q => add(q, [0, -1])), 1.2, P.bronzeP, { op: 0.8 });
  W.glow(f, jaws, 24, 18, P.lamp, 0.5);
  W.sparks(f, jaws, 7, 26, { ang: -0.4, spread: 2.4 });

  // ---- legs: leather leggings, a turn of wire round the near knee as a brace, iron-shod clogs
  for (const [sfx, Hp, Kn, A, t] of [['_f', HF, KF, AF, 0.2], ['_n', HN, KN, AN, 0]]) {
    V.clog(f, A, 92, sfx, Kn, { shaft: 0.62, col: '#4e3a26' });
    f.bone('foot' + sfx);
    f.line([[A[0] - 40, gy - 6], [A[0] + 120, gy - 6]], 5, P.iron); W.rivetRow(f, [A[0] - 30, gy - 6], [A[0] + 110, gy - 6], 4, 2.4, P.ironL); // the iron shoe
    W.splats(f, add(A, [40, 60]), 60, 10, 6, '#15110e');
    W.legTube(f, Hp, Kn, add(A, [0, -20]), [150, 104, 84], W.LEA(f, { fill: mix('#5a3e28', '#000', t), light: '#8a6a4a', maxShade: 30 }), sfx, { A, bp: [[0, 0.45, 0.1, 0.25], [1, 0.3, 0.2, 0.2]], bq: [[0, 0.4, 0.12, 0.25], [1, 0.15, 0.06, 0.12]] });
    // the leggings (independent review): heavy leather moulded by wear to the leg beneath: the thigh's round turning
    // into shadow at the back, the lit front of the quad and shin, the kneecap pushing through, folds bunched behind the
    // knee and slumped over the clog, a thonged outseam, a patch, scuffs worn bright and burns
    const soft = (pts, op, col = '#000') => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#smk${f.o.seed})"/>`);
    const tube = K.chain([Hp, Kn, add(A, [0, -20])], [150, 104, 84]);
    f.bone('thigh' + sfx);
    W.clipDraw(f, tube, () => {
      soft([lp(Hp, Kn, 0.0, 70), lp(Hp, Kn, 0.95, 50), lp(Hp, Kn, 0.95, 20), lp(Hp, Kn, 0.0, 30)], 0.5); // the back of the thigh in shadow
      soft([lp(Hp, Kn, 0.1, -30), lp(Hp, Kn, 0.7, -24), lp(Hp, Kn, 0.7, -56), lp(Hp, Kn, 0.1, -66)], t ? 0.08 : 0.24, '#b08a62'); // the quad's round to the light
      f.stroke([lp(Hp, Kn, 0.7, 48), lp(Hp, Kn, 0.85, 20), lp(Hp, Kn, 0.98, 36)], 4, INK, { op: 0.6 }); f.line([lp(Hp, Kn, 0.66, 44), lp(Hp, Kn, 0.81, 18)], 2, '#b08a62', { op: t ? 0.15 : 0.45 }); f.stroke([lp(Hp, Kn, 0.78, 50), lp(Hp, Kn, 0.92, 30), lp(Hp, Kn, 1.02, 46)], 3, INK, { op: 0.5 }); // folds bunched behind the knee
      f.stroke([lp(Hp, Kn, 0.2, -66), lp(Hp, Kn, 0.32, -30), lp(Hp, Kn, 0.36, 10)], 2.6, INK, { op: 0.45 }); f.line([lp(Hp, Kn, 0.18, -62), lp(Hp, Kn, 0.3, -28)], 1.6, '#a8865a', { op: 0.5 }); // the pull from the hip as he braces
      W.soot(f, lp(Hp, Kn, 0.5, 10), 40, 60, 0.35);
      const pt = [lp(Hp, Kn, 0.45, -40), lp(Hp, Kn, 0.45, 0), lp(Hp, Kn, 0.66, 4), lp(Hp, Kn, 0.66, -44)];
      if (!t) { f.part(pt, W.LEA(f, { fill: '#4a301c', cast: false, inkW: 1.3, maxShade: 8 })); f.stitches(pt.concat([pt[0]]), '#a08a6a', 1.2); } // a patch over a burn
    });
    f.stitches([lp(Hp, Kn, 0.05, 6), lp(Hp, Kn, 0.5, 10), lp(Hp, Kn, 0.95, 6)], '#8a7454', 1.6); // the thonged outseam
    for (let i = 1; i < 8; i++) { const q = lp(Hp, Kn, i / 8, 8); f.line([add(q, [-4, -2]), add(q, [4, 2])], 2, '#2a1a0e'); }
    f.bone('shin' + sfx);
    W.clipDraw(f, tube, () => {
      soft([lp(Kn, A, 0.0, 44), lp(Kn, A, 0.9, 34), lp(Kn, A, 0.9, 10), lp(Kn, A, 0.0, 14)], 0.5); // the calf's back in shadow
      soft(ell(lp(Kn, A, 0.0, -16), 30, 24, ang(Kn, A), 12), t ? 0.1 : 0.3, '#c8a070'); soft(ell(lp(Kn, A, 0.14, -10), 30, 10, ang(Kn, A) + 1.5, 10), 0.4); // the kneecap pushing through, worn bright, the hollow under it
      f.line(ell(lp(Kn, A, 0.0, -18), 24, 18, ang(Kn, A), 12).slice(10, 14), 2, '#c8a878', { op: t ? 0.15 : 0.45 });
      f.line([lp(Kn, A, 0.15, -36), lp(Kn, A, 0.6, -32), lp(Kn, A, 0.85, -30)], 2.6, '#a8865a', { op: t ? 0.15 : 0.45 }); // the shin's lit edge
      for (const v of [0.66, 0.76, 0.86]) { f.stroke([lp(Kn, A, v, -42), lp(Kn, A, v + 0.04, 0), lp(Kn, A, v, 40)], 4, INK, { op: 0.6 }); f.line([lp(Kn, A, v - 0.03, -40), lp(Kn, A, v + 0.01, 0), lp(Kn, A, v - 0.03, 30)], 2, '#b08a62', { op: t ? 0.15 : 0.5 }); } // slumped folds over the clog, each with its lit ridge
    });
    for (let i = 0; i < 4; i++) { const q = lp(Kn, A, W.R(f, 0.2, 0.7), W.R(f, -30, 30)); f.flat(ell(q, 5, 4, 0, 8), '#120a06', { op: 0.85 }); f.line(ell(q, 7, 6, 0, 8).slice(4, 8), 1.2, '#a8865a', { op: 0.5 }); } // burn pocks
    W.scorch(f, lp(Kn, A, 0.86), 40, 16, 0.5);
  }
  f.bone('shin_n'); // the turn of wire round the near knee, a brace, its ends twisted off
  for (let i = 0; i < 4; i++) { const t = 0.06 + i * 0.045; f.line([lp(KN, AN, t, -64), lp(KN, AN, t + 0.03, 0), lp(KN, AN, t, 64)], 6, INK); f.line([lp(KN, AN, t, -64), lp(KN, AN, t + 0.03, 0), lp(KN, AN, t, 64)], 3.4, '#9a7044'); }
  f.line([lp(KN, AN, 0.2, 62), lp(KN, AN, 0.24, 84), lp(KN, AN, 0.2, 96)], 3, '#9a7044');

  // ---- torso: broad, bare, blackened and split; leaning back on the haul
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.44, 0.38], [0.06, 0.74, 0.6], [0.2, 0.8, 0.84], [0.4, 0.62, 0.82], [0.6, 0.48, 0.6], [0.8, 0.5, 0.54], [0.98, 0.62, 0.6], [1.1, 0.58, 0.5]]);
  f.part(torso, BLK());
  V.charCracks(f, torso, S.at(0.4, 0.4), 80, 140, 6, 80, 2.2, { depth: 2 });
  W.clipDraw(f, torso, () => {
    f.stroke([S.at(0.2, 0.18), S.at(0.5, 0.3), S.at(0.84, 0.34)], 6, '#120a06', { op: 0.5 }); f.line([S.at(0.2, 0.14), S.at(0.5, 0.26), S.at(0.8, 0.3)], 2.4, '#8e735e', { op: 0.45 }); // the pectoral's lower edge
    for (let i = 0; i < 3; i++) f.stroke([S.at(0.2 + i * 0.08, 0.44 + i * 0.1), S.at(0.6, 0.48 + i * 0.1)], 3, '#120a06', { op: 0.35 }); // the belly's blocks under the char
    f.stroke([S.at(-0.5, 0.2), S.at(-0.6, 0.5), S.at(-0.5, 0.8)], 5, '#120a06', { op: 0.4 }); // the lat
  });
  // wire welded into the skin of the shoulders and back in bands, scars branching from every weld
  for (let k = 0; k < 4; k++) {
    const pts = [S.at(-0.78, 0.08 + k * 0.08), S.at(-0.4, 0.04 + k * 0.08), S.at(0.0, 0.06 + k * 0.08)];
    f.line(pts, 6, INK); f.line(pts, 3.6, '#9a7044'); f.line(pts.map(q => add(q, [0, -1.2])), 1.2, P.bronzeP, { op: 0.6 });
    for (let j = 0; j < 3; j++) { const q = lerp(pts[0], pts[2], 0.15 + j * 0.33 + k * 0.04); W.weld(f, [add(q, [-8, 0]), add(q, [8, 0])], 3.4, { lich: false }); V.lich(f, torso, q, -1.2 + f.r() * 2.4, 70, 2.2, { depth: 2, col: '#140a06' }); }
  }

  // one end fused into his back: the wire runs from the coil into the skin, welded, a fern of scars spreading
  f.bone('torso');
  const fe = [add(coilN, rot([-150, 30], 0.26)), S.at(-0.66, 0.5), S.at(-0.6, 0.56)];
  f.line(fe, 6, INK); f.line(fe, 3.6, '#8a6236');
  W.weld(f, [S.at(-0.68, 0.52), S.at(-0.56, 0.58)], 5, { lich: false }); V.lich(f, torso, S.at(-0.6, 0.56), 0.4, 120, 3, { depth: 3, col: '#140a06' });

  // ---- apron at the waist: heavy leather, scorched through, a belt of wire spools, a tallow pot, the guild badge
  f.bone('apron');
  const ap = [S.at(-0.2, 0.78), S.at(0.68, 0.76), [700, 900], [736, 1000], [730, 1060, 1], [690, 1050], [650, 1066, 1], [610, 1048], [576, 1060, 1], [560, 980], S.at(0.0, 1.06)];
  f.part(ap, W.LEA(f, { fill: '#6a4428', light: '#9a7048', maxShade: 26 }));
  W.clipDraw(f, ap, () => {
    W.scorch(f, [660, 1000], 70, 50, 0.6);
    for (const [c, r] of [[[650, 930], 13], [[610, 1010], 9], [[700, 1020], 8]]) { f.flat(ell(c, r, r * 0.8, 0, 10), '#0e0806'); f.line(ell(c, r + 3, r * 0.8 + 3, 0, 10).slice(0, 7), 2, P.char, { op: 0.8 }); f.line(ell(c, r, r * 0.8, 0, 10).slice(2, 6), 1.2, P.lamp, { op: 0.6 }); } // scorched through
    for (const q of [[[620, 860], [630, 960], [620, 1050]], [[680, 870], [700, 960], [700, 1050]]]) f.stroke(q, 3, INK, { op: 0.45 });
  });
  f.bone('pelvis');
  f.part([S.at(-0.74, 0.74), S.at(0.72, 0.72), S.at(0.74, 0.84), S.at(-0.76, 0.86)], W.LEA(f, { fill: '#2a1c12', sharp: true }));
  for (const [u, r] of [[-0.5, 20], [-0.2, 24], [0.1, 18]]) { // wooden spools wound with bronze wire, on the belt
    const c = add(S.at(u, 0.8), [0, 14]);
    f.part([add(c, [-r, -r * 1.1]), add(c, [r, -r * 1.1]), add(c, [r, r * 1.1]), add(c, [-r, r * 1.1])].map(q => [q[0], q[1], 1]), { fill: P.wood, shade: 0.4, tex: 'wood' + seed, inkW: 1.3, cast: false });
    f.part([add(c, [-r * 0.85, -r * 0.8]), add(c, [r * 0.85, -r * 0.8]), add(c, [r * 0.85, r * 0.8]), add(c, [-r * 0.85, r * 0.8])], W.BR(f, { fill: '#9a7044', inkW: 1, cast: false, tex: null }));
    for (let i = 0; i < 6; i++) f.line([add(c, [-r * 0.85, -r * 0.7 + i * r * 0.28]), add(c, [r * 0.85, -r * 0.7 + i * r * 0.28])], 1, INK, { op: 0.6 });
  }
  const tp = add(S.at(0.46, 0.84), [0, 40]); // the tallow pot on a thong
  W.rope(f, [S.at(0.46, 0.82), add(tp, [0, -26])], 2, { col: '#5a4a30' });
  f.part([add(tp, [-18, -20]), add(tp, [18, -20]), add(tp, [16, 16]), add(tp, [-16, 16])], { fill: '#5a4a3a', shade: 0.4, tex: 'mottle' + seed, inkW: 1.3, cast: false });
  f.flat(ell(add(tp, [0, -20]), 18, 5, 0, 10), '#d8ccaa'); f.line([add(tp, [-8, -18]), add(tp, [-6, 0])], 3, '#d8ccaa', { op: 0.8 }); // tallow run down the side
  const bdg = S.at(-0.3, 0.68); // the journeyman's bronze guild badge, pinned through the belt's flap
  f.part(ell(bdg, 14, 16, 0, 12), W.BR(f, { fill: '#a07440', inkW: 1.3, cast: false })); f.stroke([add(bdg, [-6, 6]), add(bdg, [4, -6])], 2, '#2a1a0c'); f.stroke([add(bdg, [0, -10]), add(bdg, [8, -3])], 3, '#2a1a0c');

  // ---- head: bald, soot-black, the ears singed, the jaw clenched, squinting behind smoked-glass goggles on a strap
  f.bone('head');
  const nk = limb(S.at(0.06, -0.02), add(HC, [-14, 80]), 132, 118);
  f.part(nk, BLK());
  V.charCracks(f, nk, add(HC, [-10, 100]), 30, 30, 2, 50, 1.8, { a: -1.6 });
  const hF = B.head(f, HC, H, hA, {
    skin: '#6a5444', jaw: 1.2, chin: 0.03, nose: 1.06, hook: 0.1, mouth: 'set', squint: 0.8, browDown: 0.08, age: true, faceShade: 0.8, faceHatch: false, jawShade: 0.35,
    hairCol: '#1e1814', browCol: '#1a1410', browW: 0.05,
  });
  W.clipDraw(f, hF(W.faceOutline(1.2, 0.03)), () => {
    for (const [u, v, rx, ry, op] of [[-0.24, 0.0, 0.2, 0.44, 0.5], [0.0, -0.42, 0.34, 0.14, 0.45], [0.2, 0.46, 0.2, 0.1, 0.35]]) f.flat(hF(ell([u, v], rx, ry, 0, 12)), P.sootD, { op });
    W.seam(f, hF([[-0.12, -0.36], [-0.02, -0.28], [0.06, -0.34], [0.16, -0.3]]), 1.6, { glowOp: 0.2 }); // the scalp split
    W.seam(f, hF([[-0.06, 0.3], [0.02, 0.4], [0.0, 0.5]]), 1.3, { glowOp: 0.2 });
    f.stroke(hF([[-0.06, 0.24], [0.0, 0.36], [0.06, 0.48]]), 6, '#1a100a', { op: 0.4 }); // the masseter knotted, jaw clenched
    W.lichtenberg(f, hF([[-0.16, 0.5]])[0], -1.4, 90, 2.4, { depth: 2, col: '#140a06' });
  });
  f.line(hF([[0.18, 0.28], [0.24, 0.27], [0.31, 0.28]]), 1.4, '#c0b4a0', { op: 0.6 }); // teeth showing at the set lips
  // the ear singed: shrivelled and dark at the helix
  f.flat(hF([[-0.24, -0.08], [-0.28, -0.04], [-0.27, 0.08], [-0.22, 0.12]]), P.char, { op: 0.8 });
  // what hair is left: stiff singed tufts over the ear and at the nape
  for (const [u, v] of [[-0.36, -0.12], [-0.4, 0.0], [-0.34, -0.22], [-0.42, 0.12]]) V.clump(f, hF([[u, v]])[0], -Math.PI / 2 - 0.9 + W.R(f, -0.3, 0.3), W.R(f, 24, 40), 4, '#2a221c', { bend: W.R(f, -0.4, 0.4), tipCol: '#0a0806' });
  // the goggles: a leather strap round the skull, two riveted cups, smoked glass with a sheen; the far cup foreshortened
  f.line(hF([[-0.38, -0.14], [-0.2, -0.2], [0.04, -0.14]]), 10, INK); f.line(hF([[-0.38, -0.14], [-0.2, -0.2], [0.04, -0.14]]), 7, '#3a2818');
  for (const [c, rx] of [[[0.12, -0.07], 0.11], [[0.3, -0.075], 0.045]]) {
    const e = hF(ell(c, rx, 0.08, 0, 14)); f.part(e, { fill: '#5a5048', shade: 0.4, inkW: 2, cast: false }); // the cup's rim
    const g = hF(ell([c[0] + 0.01, c[1]], rx * 0.76, 0.06, 0, 14)); f.part(g, { fill: '#1a1816', light: '#4a4440', shadow: '#060504', shade: 0.4, inkW: 1.2, cast: false, hatch: false });
    f.line(hF([[c[0] - rx * 0.4, c[1] - 0.03], [c[0] + rx * 0.2, c[1] - 0.045]]), 2, '#c8c0b0', { op: 0.55 });
  }
  f.line(hF([[0.23, -0.08], [0.255, -0.09]]), 4, '#3a3632'); // the bridge
  f.rivet(hF([[0.03, -0.12]])[0], 3, P.ironL);
  f.line(hF([[0.14, -0.1], [0.2, -0.04]]), 1.2, '#e8dcc0', { op: 0.5 }); // a crack in the near glass

  // ---- near arm: long, heavy, blackened; the fist on the reins behind the far one
  W.muscleArm(f, SN, EN, WN, [104, 80, 76], BLK(), '_n', { muscle: false, bp: [[0, 0.14, 0.24, 0.12], [0, 0.6, 0.18, 0.2], [1, 0.25, 0.22, 0.2]], bq: [[0, 0.5, 0.16, 0.2], [1, 0.2, 0.18, 0.18]] });
  f.bone('upperarm_n');
  W.clipDraw(f, K.chain([SN, EN], [140, 110]), () => { // the arm's anatomy under the char: deltoid, biceps, triceps, the elbow's point
    f.flat([lp(SN, EN, 0.0, 60), lp(SN, EN, 1.0, 50), lp(SN, EN, 1.0, 10), lp(SN, EN, 0.4, 20)], '#000', { op: 0.32 }); // the back of the arm turns from the light
    f.stroke([lp(SN, EN, 0.05, -48), lp(SN, EN, 0.25, -30), lp(SN, EN, 0.42, -8), lp(SN, EN, 0.36, 26), lp(SN, EN, 0.2, 48)], 6, '#120a06', { op: 0.5 }); // the deltoid's edge
    f.line([lp(SN, EN, 0.1, -40), lp(SN, EN, 0.28, -24)], 3, '#9a7e66', { op: 0.5 });
    f.stroke([lp(SN, EN, 0.5, -40), lp(SN, EN, 0.75, -44), lp(SN, EN, 0.95, -30)], 5, '#120a06', { op: 0.4 }); // the biceps' front edge
    f.line([lp(SN, EN, 0.5, -30), lp(SN, EN, 0.8, -32)], 2.4, '#9a7e66', { op: 0.5 });
    f.stroke([lp(SN, EN, 0.5, 12), lp(SN, EN, 0.7, 20), lp(SN, EN, 0.92, 10)], 4, '#120a06', { op: 0.45 }); // the split between biceps and triceps
  });
  f.flat(ell(lp(SN, EN, 1.0, 30), 24, 18, ang(SN, EN), 10), '#000', { op: 0.3 }); // the elbow's point
  V.charCracks(f, K.chain([SN, EN], [118, 104]), lerp(SN, EN, 0.5), 30, 90, 4, 60, 2);
  for (let k = 0; k < 3; k++) { const pts = [lp(SN, EN, 0.16 + k * 0.1, -50), lp(SN, EN, 0.24 + k * 0.1, -20), lp(SN, EN, 0.26 + k * 0.1, 16), lp(SN, EN, 0.2 + k * 0.1, 50)]; f.line(pts, 6, INK); f.line(pts, 3.6, '#9a7044'); f.line(pts.slice(0, 3).map(q => add(q, [0, -1.4])), 1.2, P.bronzeP, { op: 0.6 }); W.weld(f, [add(pts[1], [-6, 0]), add(pts[1], [6, 0])], 3.4, { lich: false }); } // wire welded round the arm, bowed round its section
  V.lich(f, K.chain([SN, EN], [118, 104]), lp(SN, EN, 0.3), ang(SN, EN) + 0.3, 130, 3, { depth: 3, col: '#140a06' });
  f.bone('forearm_n');
  V.charCracks(f, K.chain([EN, WN], [104, 90]), lerp(EN, WN, 0.4), 30, 40, 3, 60, 2);
  f.part(plate(EN, WN, 0.68, 1.06, 108, 112), W.LEA(f, { fill: '#3e2a1a', maxShade: 20 }));
  f.line([lp(EN, WN, 0.74, -54), lp(EN, WN, 0.74, 54)], 2, INK, { op: 0.6 }); f.stitches([lp(EN, WN, 0.8, -54), lp(EN, WN, 0.8, 54)], '#a08a6a', 1);
  f.bone('torso'); // the deltoid's cap over the top of the arm (on the torso: it stays when the arm swings)
  const dl = [add(SN, [-58, 10]), add(SN, [-50, -30]), add(SN, [-10, -52]), add(SN, [36, -40]), add(SN, [56, -6]), add(SN, [44, 40]), add(SN, [10, 76]), add(SN, [-30, 70])];
  f.part(dl, BLK({ maxShade: 16 }));
  W.clipDraw(f, dl, () => { f.stroke([add(SN, [40, 30]), add(SN, [6, 66]), add(SN, [-26, 62])], 5, '#120a06', { op: 0.5 }); f.line([add(SN, [-40, -24]), add(SN, [-6, -44]), add(SN, [30, -34])], 3, '#8e735e', { op: 0.5 }); V.charCracks(f, dl, SN, 20, 20, 1, 40, 1.6); });
  for (let k = 0; k < 2; k++) { const pts = [add(SN, [-50, -6 + k * 26]), add(SN, [-10, 4 + k * 26]), add(SN, [40, -4 + k * 26])]; f.line(pts, 6, INK); f.line(pts, 3.6, '#9a7044'); W.weld(f, [add(pts[1], [-6, 0]), add(pts[1], [6, 0])], 3.4, { lich: false }); }
  // ---- the near coil slung over the near shoulder, lying on the outside of the arm, its end trailing to the floor
  f.bone('coil_n');
  V.wireCoil(f, coilN, 150, 250, 0.26, 16, 6.6, { gap: 4.2, jit: 0.05, col: '#8a6236', sprung: [2, 7, 11] });
  V.wireCoil(f, add(coilN, [-20, 30]), 120, 210, 0.36, 10, 5.6, { gap: 4, jit: 0.07, col: '#7a5630', sprung: [4] }); // a second, smaller coil over the first
  for (const t of [0.2, 0.55, 0.85]) { const q = add(coilN, rot([Math.cos(t * 6.3) * 150, Math.sin(t * 6.3) * 250], 0.26)); f.line([add(q, [-6, -8]), add(q, [6, 8])], 5, '#5a5040'); f.line([add(q, [-8, 4]), add(q, [8, -4])], 3, '#5a5040'); } // binding twists round the coil
  f.bone('trail');
  const tr = [add(coilN, rot([-40, 250], 0.26)), [250, 980], [236, 1160], [232, gy - 8], [150, gy - 4], [60, gy - 10]];
  f.line(tr, 6.4, INK); f.line(tr, 4, '#8a6236'); f.line(tr.map(q => add(q, [1, -1])), 1.2, P.bronzeP, { op: 0.6 });
  f.line([[60, gy - 10], [44, gy - 18], [38, gy - 12]], 3, '#5a4028');
  // ---- the draw-plate on a chain round the neck, hanging on the chest: a steel plate pierced with graded holes
  f.bone('torso');
  const dp = S.at(0.5, 0.3);
  W.chainLinks(f, [S.at(-0.1, -0.02), add(dp, [-50, -40])], 12, P.ironL); W.chainLinks(f, [S.at(0.4, -0.04), add(dp, [40, -40])], 12, P.ironL);
  const plt = [add(dp, [-64, -40]), add(dp, [56, -44]), add(dp, [60, 40]), add(dp, [-60, 44])].map(q => [q[0], q[1], 1]);
  const pdd = f.part(plt, W.IR(f, { fill: '#4e4c4a', light: '#9a968e', inkW: 2 })); W.bevel(f, pdd, E.bbox(plt), 4, { lite: '#b8b4aa', lite2: '#d8d4ca' });
  for (let i = 0; i < 9; i++) { const r = 9 - i * 0.8, q = add(dp, [-46 + i * 12, (i % 2) * 22 - 10]); f.flat(ell(q, r, r * 0.9, 0, 10), '#0a0808'); f.line(ell(q, r + 1.5, r * 0.9 + 1.5, 0, 10).slice(8, 14), 1.2, '#d8d4ca', { op: 0.6 }); }
  W.clipDraw(f, plt, () => { W.scorch(f, add(dp, [20, 20]), 40, 30, 0.4); W.heatTint(f, [add(dp, [-60, 40]), add(dp, [60, 36])], 6); W.lichtenberg(f, add(dp, [50, -30]), 2.4, 60, 1.8, { metal: true, depth: 2 }); });
  for (const q of [add(dp, [-52, -32]), add(dp, [46, -36])]) f.rivet(q, 4, P.ironL);

  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, tA, 58, '#3e2a1a', { tex: 'craze' + seed, texOp: 0.4, shadow: '#140a06', name: 'wiredrawer reins rear' });
  // the gauntlet burst at the knuckles: the hand burned smooth and shining beneath
  const bu = gN.F([[0.12, -0.6], [0.38, -0.58], [0.42, 0.1], [0.3, 0.2], [0.14, -0.1]]);
  f.part(bu, { fill: '#6a5240', light: '#e0c8a8', shadow: '#2a1a10', shade: 0.4, inkW: 1.3, cast: false, hatch: false });
  f.line(gN.F([[0.2, -0.5], [0.34, -0.3], [0.32, 0.0]]), 2.4, '#f0dcc0', { op: 0.7 }); // the shine
  f.line(bu.concat([bu[0]]), 2.6, '#1e140c', { op: 0.8 }); // the burst leather's ragged edge
  f.bone('hand_f');
  B.grip(f, WF, EF, tA, 56, '#3a2818', { tex: 'craze' + seed, texOp: 0.4, shadow: '#140a06', name: 'wiredrawer reins front' });
  W.ash(f, add(HC, [-60, -120]), 10, 120, 140, 1.2);
  return f;
}

// ------------------------------------------------------------------ THE DRAY HORSE (elite, 2.0 at the head)
// A foundry dray horse, a Shire-built draught horse that hauled bells out of the pits on a sledge. Rearing half up: the
// skeleton is a standing Shire (withers 1.8 m, body 1.9 m, head 0.7 m at 640 px per 1.75 m) with the forehand rotated
// 40 degrees up about the hip joint. The weight sits on the crouched hind quarters: the thigh inside the great round
// croup, the stifle forward at the flank, the gaskin running back to the hock, the cannon nearly upright, the hooves
// flat under the hip. The forelegs fold: the forearm out level from the elbow, the knee bent, the cannon hanging, the
// hooves curled. A thick crested neck stands up from the deep chest to a high poll; the long heavy head points forward,
// nostrils flared and sooted, lips drawn back, the near eye wild with white all round; a burn has closed the far one.
// Fire has burned the coat off in streaks; the hide beneath is blackened and split in glowing seams along the shoulder
// and flank; the feather is singed into black curls. Lightning came in through the iron shoes, fused up into the hooves:
// Lichtenberg trees climb all four legs from the hooves, the mane and tail stand out stiff, the bronze harness fittings
// are welded to the hide. Gear: a leather-and-straw collar burst at one side, bronze hame knobs fused into the neck,
// broken trace chains, a bridle with blinkers (the near one torn away), a bronze brow medallion, the broken sledge shaft
// dragging from the harness, a scorched wool saddle cloth, an empty nosebag, a bell on the collar, the guild brand on
// the hip, a split hoof bound with wire.
// Rig: spine_1 (hind quarters, root, pivot at the hip joint) > spine_2 (barrel and chest) > neck > head > jaw; tail
// (spine_1); mane (neck); legs leg_[f|h][n|f]_1..3; shaft and traces (spine_2). Motion: idle stamping and snorting (a
// foreleg paws, the head tosses); attack the rear and crash of both forehooves (spine_2 drops, forelegs strike down).
function drayHorse() {
  const seed = 523, CH = 1400, f = new Fig(W.base(seed, CH, { grimeY: 1160 }));
  W.textures(f);
  const gy = f.o.groundY; // 1370
  const hide = '#2e2622', hideL = '#8e7664', coat = '#4a3426', coatL = '#80604a', burnt = '#1c1512';
  const HD = (o = {}) => Object.assign({ fill: hide, shadow: '#070504', light: hideL, shade: 0.45, maxShade: 36, tex: 'craze' + seed, texOp: 0.26 }, o);
  // the body frame: a standing Shire's trunk in body units (u forward from the hip joint, v down), turned 41 degrees up
  // about the hip joint
  const HJ = [420, 1000], th = -0.72, BF = frame(HJ, th, 1), bp = (u, v) => BF([[u, v]])[0];
  // legs (screen): T top inside the trunk, J1 stifle or elbow, J2 hock or knee, A fetlock, C coronet, toe and heel
  const LEG = {
    hf: { T: [446, 990], J1: [615, 1082], J2: [508, 1214], A: [592, 1294], C: [624, 1318], toe: [676, gy], heel: [592, gy], hind: true },
    hn: { T: [420, 1000], J1: [578, 1096], J2: [456, 1226], A: [532, 1296], C: [566, 1322], toe: [622, gy], heel: [532, gy], hind: true },
    ff: { T: [796, 712], J1: [800, 716], J2: [952, 612], A: [994, 708], C: [990, 742], toe: [968, 786], heel: [1018, 760] },
    fn: { T: [822, 744], J1: [826, 748], J2: [990, 702], A: [980, 808], C: [962, 838], toe: [922, 868], heel: [990, 862] },
  };
  const PL = [664, 168], hA = 0.42, hF = frame(PL, hA, 1); // the head: origin at the poll, u down the face to the muzzle, v toward the jaw
  const TMJ = [36, 34], jd = 0.13, jl = q => add(TMJ, rot(sub(q, TMJ), jd)), jF = pts => hF(pts.map(jl)); // the jaw, dropped about its hinge
  f.joint('spine_1', HJ).joint('spine_2', bp(250, -60), 'spine_1').joint('neck', [690, 540], 'spine_2').joint('head', PL, 'neck').joint('jaw', hF([TMJ])[0], 'head');
  f.joint('tail', bp(-95, -200), 'spine_1').joint('mane', [600, 420], 'neck').joint('shaft', bp(360, 30), 'spine_2').joint('traces', [800, 560], 'spine_2');
  for (const [k, L] of Object.entries(LEG)) { const par = L.hind ? 'spine_1' : 'spine_2'; f.joint(`leg_${k}_1`, L.hind ? L.T : L.J1, par).joint(`leg_${k}_2`, L.J2, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }

  // the hair left on the hide lies in short streaks along the lie of the coat; bare burnt hide shows between
  const streaks = (region, c, rx, ry, a, n, o = {}) => W.clipDraw(f, region, () => {
    for (let i = 0; i < n; i++) { const p = W.scatter(f, c, rx, ry), l = W.R(f, 30, 90) * (o.k ?? 1); const q = [p, add(p, rot([l * 0.5, W.R(f, -4, 4)], a)), add(p, rot([l, W.R(f, -3, 3)], a))]; f.stroke(q, W.R(f, 8, 18) * (o.k ?? 1), o.col || coat, { op: 0.8 }); for (let j = 0; j < 3; j++) f.line([add(p, rot([l * 0.1, -5 + j * 4], a)), add(p, rot([l * 0.75, -4 + j * 4], a))], 1, j ? '#1a120c' : coatL, { op: 0.5 }); }
  });
  // soft modelling: a blurred dark mass for a hollow, a blurred light mass for a swell turned to the key light
  const shadeMass = (pts, op = 0.45, col = '#000') => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#smk${seed})"/>`);
  const lightMass = (pts, op = 0.22) => shadeMass(pts, op, hideL);
  const rim = (pts, w = 3, op = 0.55) => f.line(pts, w, hideL, { op });
  // a lightning fern climbing from a shoe: a pale keloid scar on the black hide with a white-gold fused thread at its root
  const fern = (c, a, len, w, d = 2) => V.fernSkin(f, c, a, len, w, { depth: d, thread: true, fork: 0.65 });
  // the feather: long coarse hair hanging from the back of the cannon over the hoof in clumps, singed to black curls
  // a lock of coarse hair: a tapered dark mass with strands over it that part toward the tip, the end singed to a curl
  const lock = (base, a, l, w, col, o = {}) => {
    const bend = o.bend ?? W.R(f, -0.35, 0.35), pts = [0, 0.33, 0.66, 1].map(t => add(base, rot([l * t, 0], a + bend * t)));
    f.stroke(pts, w + 2.4, INK, { op: o.inkOp ?? 0.55 }); f.stroke(pts, w, col);
    for (let k = 0; k < 4; k++) { const off = (k - 1.5) / 1.5, sp = pts.map((q, i) => add(q, rot([0, off * w * (0.18 + i * 0.1)], a + bend * i / 3))); f.line(sp.slice(0, 3 + (k % 2)), 1.1, k % 2 ? '#0a0605' : (o.lit || '#7a6656'), { op: 0.7 }); }
    const tip = pts[3];
    if (o.curl !== false) f.line(ell(add(tip, rot([3, 0], a + bend)), 4.5, 3.5, a, 8).slice(0, 7), 2, '#050302');
    return tip;
  };
  const feather = (from, to, n, fall, len) => {
    for (let i = 0; i < n; i++) {
      const b0 = lerp(from, to, i / (n - 1)), a = fall + W.R(f, -0.25, 0.25), l = len * W.R(f, 0.7, 1.15), w = W.R(f, 9, 15);
      lock(b0, a, l, w, i % 3 ? '#3a2e26' : '#5a4838', { bend: W.R(f, -0.5, 0.5) });
      lock(add(b0, [W.R(f, -6, 6), W.R(f, -4, 4)]), a + W.R(f, -0.3, 0.3), l * W.R(f, 0.5, 0.8), w * 0.5, '#2a201a', { bend: W.R(f, -0.6, 0.6), inkOp: 0.4 });
    }
  };
  // a heavy hoof: the wall sloping from the coronet to the ground, growth rings, the band of the coronet, and the iron
  // shoe fused up into the wall (the shoe's iron runs up into the horn in molten tongues, nail heads sunk, a white-gold
  // thread in the seam). For a lifted hoof, pass its own frame (u along the sole toward the toe, v toward the coronet).
  const hoof = (HF0, far, o = {}) => {
    const dk = far ? 0.3 : 0;
    const wall = HF0([[-44, -10, 1], [50, -10, 1], [40, -26], [20, -60], [-12, -56], [-34, -40], [-44, -24]]);
    f.part(wall, { fill: mix('#2a2420', '#000', dk), shadow: '#050404', light: '#6e645a', shade: 0.4, maxShade: 16, tex: 'pit' + seed, texOp: 0.4 });
    W.clipDraw(f, wall, () => {
      for (let i = 0; i < 4; i++) f.line(HF0([[-44, -20 - i * 9], [0, -22 - i * 10], [46, -16 - i * 10]]), 1.3, '#000', { op: 0.5 });
      f.line(HF0([[18, -54], [38, -26], [46, -12]]), 3, '#8a8070', { op: 0.45 }); // the toe's worn-bright wall
      if (o.split) { f.line(HF0([[10, -60], [6, -30], [12, -4]]), 3, '#000'); for (let i = 0; i < 3; i++) f.line(HF0([[-30, -46 + i * 12], [48, -36 + i * 11]]), 3.2, '#9a7044'); }
    });
    f.part(HF0([[-36, -42], [-14, -62], [22, -66], [26, -56], [-10, -50]]), HD({ fill: '#1a1410', cast: false, inkW: 1.2 })); // the coronet band
    const shoe = HF0([[-46, 0, 1], [54, 0, 1], [54, -12], [-46, -12]]);
    f.part(shoe, W.IR(f, { fill: '#2a2624', inkW: 1.4, cast: false, maxShade: 6 }));
    for (const u of [-30, -6, 18, 40]) f.rivet(HF0([[u, -6]])[0], 1.8, '#6a645c');
    for (const [u, h] of [[-28, 16], [-4, 26], [24, 18]]) { const q = HF0([[u - 6, -12], [u - 2, -12 - h * 0.6], [u + 1, -12 - h], [u + 6, -12]]); f.flat(q, '#36322e'); f.line([HF0([[u, -12]])[0], HF0([[u, -8 - h * 0.8]])[0]], 1.2, P.arcG, { op: 0.6 }); } // the iron run up into the horn
    W.weld(f, HF0([[-46, -14], [0, -15], [50, -13]]), 3.2, { lich: false });
    if (!far) W.glow(f, HF0([[0, -8]])[0], 54, 14, P.arcG, 0.22);
  };
  // one leg drawn as one outline, cut for the rig at the two lower joints; o.front/o.back: the contour points (screen)
  let outline0 = null;
  const leg = (k, far, o) => {
    const L = LEG[k], look = HD({ fill: mix(hide, '#000', far ? 0.35 : 0), light: far ? '#5a4a40' : hideL });
    const outline = [...o.front, ...o.back]; outline0 = outline;
    const d2 = elb(L.J1, L.J2, L.A), d3 = elb(L.J2, L.A, L.C);
    split(f, () => {
      f.part(outline, o.thin ? Object.assign({}, look, { inkW: 1.1, inkHeavy: 0, cast: false, hi: 0 }) : look);
      if (o.heavy) for (const q of o.heavy) { f.line(q, 3.6, INK, { op: 0.9 }); }
      W.clipDraw(f, outline, () => {
        if (o.model) o.model();
        streaks(outline, lerp(L.J1, L.J2, 0.4), 40, 40, ang(L.J1, L.J2), 3);
        fern(L.C, ang(L.A, L.J2) + W.R(f, -0.15, 0.15), E.len(sub(L.J2, L.A)) * 1.1 + 70, far ? 2.6 : 3.4, 2);
        if (!far) fern(lerp(L.A, L.C, 0.5), ang(L.A, L.J2) + 0.5, E.len(sub(L.J2, L.A)) * 0.8, 2.4, 1);
      });
      if (o.after) o.after();
    }, [[`leg_${k}_1`, side(L.J2, mul(d2, -1), o.r2)], [`leg_${k}_2`, [side(L.J2, d2, o.r2), side(L.A, mul(d3, -1), o.r3)]], [`leg_${k}_3`, [side(L.J2, d2, o.r2), side(L.A, d3, o.r3)]]]);
    f.bone(`leg_${k}_3`);
    if (o.hoof) o.hoof();
  };
  // the hind leg: the thigh and second thigh in one heavy mass from the hip, the stifle forward at the flank, the
  // gaskin swelling behind, the hock's point sticking back, the flat cannon with its tendon, the round fetlock
  const hindLeg = (k, far) => {
    const L = LEG[k], [Tq, S, Hk, A, C] = [L.T, L.J1, L.J2, L.A, L.C];
    const dA = E.norm(sub(A, Hk)), nA = [dA[1], -dA[0]]; // nA: toward the front of the cannon
    const top = far ? [add(Tq, [30, -110])] : [...BF([[-95, -214], [-40, -244], [20, -256], [70, -250]]), bp(98, -196), bp(118, -132), bp(116, -70)]; // the haunch's front rounds over (consistency pass)
    const front = [...top, add(Tq, [112, -12]), add(S, [16, -40]), add(S, [26, 10]), add(S, [0, 40]), lerp(add(S, [-10, 44]), add(Hk, mul(nA, 26)), 0.5), add(Hk, mul(nA, 28)), add(lerp(Hk, A, 0.6), mul(nA, 24)), add(A, mul(nA, 32)), add(add(A, mul(nA, 30)), mul(dA, 26)), add(C, [14, -4])];
    const back = [add(C, [-30, 4]), add(add(A, mul(nA, -40)), mul(dA, 8)), add(A, mul(nA, -34)), add(lerp(Hk, A, 0.55), mul(nA, -26)), add(add(Hk, mul(nA, -28)), mul(dA, 24)), add(Hk, [-40, 2]), add(Hk, [-52, -30]), add(Hk, [-36, -58]), add(Hk, [-50, -94]), add(Tq, [-82, 120]), add(Tq, [-108, 56]), ...(far ? [add(Tq, [-102, -60])] : [bp(-126, -50), bp(-124, -132)])];
    const nTop = top.length;
    leg(k, far, {
      front, back, r2: 34, r3: 32, thin: true, heavy: [front.slice(nTop), back.slice(0, back.length - (far ? 1 : 0))].concat(far ? [] : [front.slice(0, 5)]),
      model: () => {
        if (!far) {
          lightMass(BF([[-90, -200], [20, -246], [80, -200], [40, -110], [-60, -110]]), 0.3); // the round of the haunch to the light
          streaks(outline0, bp(0, -120), 120, 120, th + 1.3, 22);
          rim(BF([[-90, -216], [-40, -244], [20, -256], [70, -250]]), 4, 0.55);
          f.stroke(BF([[-60, -210], [-80, -120], [-104, -40]]), 6, '#000', { op: 0.35 }); // the groove between the haunch muscles
          const br = bp(-20, -150); K.ring(f, br, 28, 24, 6, P.scar, { op: 0.6 }); K.ring(f, br, 28, 24, 2.4, P.scarL, { op: 0.45 }); f.stroke([add(br, [-14, 12]), add(br, [10, -12])], 6, P.scarL, { op: 0.5 }); f.stroke([add(br, [2, -20]), add(br, [20, -4])], 9, P.scarL, { op: 0.5 }); // the guild brand, healed proud
          W.crackNet(f, bp(20, -200), th + 1.9, 120, 2.4, { depth: 2, glowOp: 0.32 });
        }
        lightMass([add(Tq, [70, -40]), add(S, [-10, -70]), add(S, [16, -20]), add(S, [-20, 20]), add(Tq, [40, 40])], far ? 0.08 : 0.26); // the thigh to the stifle
        shadeMass([add(Hk, [-40, -90]), add(S, [-70, 10]), add(S, [-20, 40]), add(Hk, [10, -30]), add(Hk, [-20, -20])], 0.42); // the gaskin's hollow front
        f.stroke([add(Tq, [-70, 50]), add(Tq, [-50, 120]), add(Hk, [-30, -90]), add(Hk, [-20, -56])], 6, '#000', { op: 0.45 }); // the hamstring groove down into the gaskin
        f.stroke([add(S, [-40, -60]), add(S, [-30, -10]), add(S, [-26, 30])], 5, '#000', { op: 0.35 }); // the stifle's edge
        f.line([add(Hk, [-44, -90]), add(Hk, [-34, -58]), add(Hk, [-44, -30])], 2.6, hideL, { op: far ? 0.15 : 0.5 }); // the Achilles cord, lit
        f.stroke([add(Hk, [-10, -10]), add(Hk, [8, 6])], 4, '#000', { op: 0.45 }); // the hock's front crease
        f.stroke([add(add(Hk, mul(nA, -18)), mul(dA, 30)), add(lerp(Hk, A, 0.6), mul(nA, -16)), add(A, mul(nA, -20))], 5, '#000', { op: 0.45 }); // the tendon down the back of the cannon
        f.line([add(add(Hk, mul(nA, -22)), mul(dA, 34)), add(lerp(Hk, A, 0.7), mul(nA, -20))], 1.8, hideL, { op: far ? 0.1 : 0.4 });
        rim([add(Tq, [112, -12]), add(S, [16, -40]), add(S, [26, 6])], 3.2, far ? 0.2 : 0.6);
        rim([add(Hk, mul(nA, 28)), add(lerp(Hk, A, 0.6), mul(nA, 22)), add(A, mul(nA, 28))], 2.4, far ? 0.15 : 0.5);
        W.crackNet(f, add(S, [-40, -40]), 2.2, 90, 2, { depth: 1, glowOp: 0.3 });
      },
      after: () => feather(add(add(Hk, mul(nA, -24)), mul(dA, 80)), add(A, mul(nA, -32)), 4, Math.PI / 2 + 0.15, 70),
      hoof: () => {
        f.part([add(A, mul(nA, 32)), add(C, [18, -6]), add(C, [10, 14]), add(C, [-34, 10]), add(A, mul(nA, -36))], HD({ fill: mix(hide, '#000', far ? 0.35 : 0), cast: false })); // the pastern
        hoof(frame([(L.toe[0] + L.heel[0]) / 2, gy], 0, 0.86), far, { split: k === 'hn' });
        feather(add(A, mul(nA, -36)), add(A, mul(nA, 4)), 5, Math.PI / 2 + 0.1, 52);
      },
    });
  };
  // the foreleg, raised and folded: the forearm out from the elbow, the flat knee bent, the cannon hanging, the
  // fetlock flexed and the hoof curled back under
  const foreLeg = (k, far) => {
    const L = LEG[k], [E0, Kn, A, C] = [L.J1, L.J2, L.A, L.C];
    const dF = E.norm(sub(Kn, E0)), nF = [dF[1], -dF[0]], dC = E.norm(sub(A, Kn)), nC = [dC[1], -dC[0]]; // nF: the top of the forearm; nC: the front of the cannon
    const fa = t => lerp(E0, Kn, t);
    const front = [add(fa(0.22), mul(nF, 54)), add(fa(0.45), mul(nF, 46)), add(fa(0.72), mul(nF, 32)), add(Kn, add(mul(nF, 28), mul(dF, 6))), add(Kn, add(mul(nF, 8), mul(dF, 32))), add(Kn, add(mul(nC, 30), mul(dC, 16))), add(add(Kn, mul(nC, 24)), mul(dC, 44)), add(lerp(Kn, A, 0.75), mul(nC, 22)), add(A, mul(nC, 32)), add(add(A, mul(nC, 24)), mul(dC, 24))];
    const back = [add(C, mul(nC, -22)), add(add(A, mul(nC, -34)), mul(dC, 6)), add(lerp(Kn, A, 0.5), mul(nC, -24)), add(add(Kn, mul(nC, -22)), mul(nF, -24)), add(fa(0.8), mul(nF, -26)), add(fa(0.5), mul(nF, -34)), add(fa(0.2), mul(nF, -46)), add(E0, mul(nF, -56)), add(E0, add(mul(nF, -30), mul(dF, -26)))];
    leg(k, far, {
      front, back, r2: 30, r3: 30, thin: true, heavy: [front, back.slice(0, back.length - 1)],
      model: () => {
        lightMass([add(E0, mul(nF, 50)), add(lerp(E0, Kn, 0.5), mul(nF, 40)), add(lerp(E0, Kn, 0.5), mul(nF, 10)), add(E0, mul(nF, 10))], far ? 0.08 : 0.24); // the forearm's muscle to the light
        f.stroke([add(lerp(E0, Kn, 0.1), mul(nF, 10)), add(lerp(E0, Kn, 0.55), mul(nF, 2)), add(lerp(E0, Kn, 0.85), mul(nF, 10))], 4, '#000', { op: 0.4 }); // the split between the extensors and flexors
        f.part([add(fa(0.76), mul(nF, -22)), add(fa(0.86), mul(nF, -34)), add(Kn, add(mul(nF, -26), mul(nC, -16)))], HD({ fill: mix(hide, '#000', far ? 0.35 : 0), cast: false, inkW: 1.1 })); // the accessory bone at the back of the knee
        f.flat([add(lerp(E0, Kn, 0.55), mul(nF, -40)), add(lerp(E0, Kn, 0.68), mul(nF, -42)), add(lerp(E0, Kn, 0.62), mul(nF, -30))], '#4a3e34'); // the chestnut
        f.stroke([add(Kn, mul(nC, -20)), lerp(add(Kn, mul(nC, -22)), add(A, mul(nC, -24)), 0.6), add(A, mul(nC, -26))], 5, '#000', { op: 0.45 }); // the tendon
        rim([add(lerp(E0, Kn, 0.2), mul(nF, 56)), add(lerp(E0, Kn, 0.8), mul(nF, 36)), add(Kn, add(mul(nF, 32), mul(dF, 12)))], 3, far ? 0.15 : 0.6);
        rim([add(add(Kn, mul(nC, 28)), mul(dC, 30)), add(A, mul(nC, 30))], 2.4, far ? 0.15 : 0.5);
        W.crackNet(f, lerp(E0, Kn, 0.3), ang(E0, Kn), 80, 1.8, { depth: 1, glowOp: 0.3 });
      },
      after: () => { feather(add(lerp(Kn, A, 0.7), mul(nC, -24)), add(A, mul(nC, -32)), 4, Math.PI / 2 + 0.25, 64); f.flat([add(Kn, add(mul(nC, 28), mul(dC, 14))), add(add(Kn, mul(nC, 22)), mul(dC, 40)), add(add(Kn, mul(nC, 8)), mul(dC, 30)), add(add(Kn, mul(nC, 12)), mul(dC, 8))], hideL, { op: far ? 0.1 : 0.3 }); }, // the knee's flat front plane
      hoof: () => {
        const ha = ang(A, C) - 0.96; // the standing hoof turned with the flexed pastern: toe down, the sole to the rear // the sole turned back and up
        f.part([add(A, mul(nC, 30)), add(C, mul(nC, 30)), add(C, mul(nC, -30)), add(A, mul(nC, -32))], HD({ fill: mix(hide, '#000', far ? 0.35 : 0), cast: false }));
        hoof(frame(add(C, rot([0, 56], ha)), ha, 0.94), far);
        feather(add(A, mul(nC, -30)), add(C, mul(nC, -20)), 4, Math.PI / 2 + 0.3, 50);
      },
    });
  };

  f.bone('root');
  f.flat(ell([600, gy + 3], 250, 13, 0, 20), '#000', { op: 0.4 });
  W.splats(f, [600, gy - 6], 200, 8, 14, '#15110e');
  W.sparks(f, [650, gy - 6], 9, 50, { ang: -Math.PI / 2, spread: 2.2 }); // sparks thrown from the shoes on the floor

  // ---- far legs, behind the trunk
  f.bone('spine_1'); hindLeg('hf', true);
  f.bone('spine_2'); foreLeg('ff', true);

  // ---- the tail: the dock set high on the croup, the hair standing out stiff and fanned behind, singed at the ends
  f.bone('tail');
  const t0 = bp(-95, -200), td = [t0, add(t0, [-46, 22]), add(t0, [-92, 48])];
  f.part(K.chain(td, [60, 48, 36]), HD());
  for (let i = 0; i < 26; i++) { const t = W.R(f, 0, 1), b0 = lerp(td[0], td[2], t), a = Math.PI + 0.25 + W.R(f, -0.35, 0.55) + t * 0.2; lock(b0, a, W.R(f, 120, 220) * (0.6 + t * 0.45), W.R(f, 10, 18), f.r() < 0.4 ? '#1e1814' : '#3e3028'); }

  // ---- the trunk: croup, loin, back to the withers, the shoulder and the deep chest, the girth, the belly turning up
  // to the flank; cut at the loin for the rig
  f.bone('spine_1');
  const body = BF([[-95, -214], [-40, -244], [20, -256], [70, -250], [130, -228], [210, -196], [290, -186], [370, -214], [440, -270], [500, -252], [560, -152], [598, -64], [612, 4], [596, 66], [552, 118], [486, 152], [410, 168], [330, 164], [252, 146], [180, 116], [118, 84], [70, 66], [20, 96], [-50, 82], [-106, 32], [-126, -50], [-124, -132]]); // consistency pass 2026-11-25: a round barrel that sags at the girth and tucks up to the flank (was a straight-bellied box)
  const cut = bp(250, -60), cd = E.norm(rot([1, 0], th));
  split(f, () => {
    f.part(body, HD({ maxShade: 44 }));
    W.clipDraw(f, body, () => {
      streaks(body, bp(220, -80), 260, 160, th, 26);
      // the masses: the round hindquarter with the point of the hip; the barrel turning under; the shoulder blade laid
      // back from the withers with the triceps' heavy bulge behind the elbow; the pectoral at the front of the chest
      lightMass(BF([[-90, -200], [40, -236], [90, -180], [40, -90], [-60, -110]]), 0.3);
      shadeMass(BF([[60, 60], [240, 90], [420, 100], [520, 70], [420, 150], [200, 150], [60, 130]]), 0.55);
      shadeMass(BF([[60, -60], [120, -20], [110, 70], [40, 90], [20, 0]]), 0.45); // the flank's hollow
      lightMass(BF([[440, -250], [560, -150], [590, -40], [520, -60], [440, -180]]), 0.3);
      shadeMass(BF([[400, -220], [440, -100], [460, 10], [420, 60], [380, -40], [370, -180]]), 0.4); // behind the shoulder blade
      lightMass(BF([[540, 0], [596, 10], [580, 80], [520, 90]]), 0.2);
      f.stroke(BF([[-30, -230], [20, -170], [60, -110], [90, -40]]), 5, '#000', { op: 0.35 }); // the line from the hip over the thigh
      f.stroke(BF([[440, -262], [480, -160], [530, -60], [570, 0]]), 4, hideL, { op: 0.35 }); // the spine of the shoulder blade
      f.stroke(BF([[420, -230], [430, -120], [450, -10], [470, 60]]), 6, '#000', { op: 0.45 }); // the back edge of the shoulder
      for (let i = 0; i < 6; i++) f.stroke(BF([[170 + i * 38, -120], [196 + i * 38, -30], [200 + i * 36, 50], [184 + i * 34, 104 + i * 6]]), 3, '#000', { op: 0.28 }); // ribs under the hide, curving round the barrel
      lightMass(BF([[200, -150], [330, -170], [420, -120], [430, -20], [360, 40], [240, 20], [190, -60]]), 0.16); // the round of the ribcage turned to the light
      shadeMass(BF([[150, 70], [260, 110], [380, 128], [470, 118], [440, 156], [330, 166], [230, 146], [150, 110]]), 0.5); // the barrel turning under
      f.stroke(BF([[-118, -40], [-80, 20], [-40, 70]]), 5, '#000', { op: 0.4 });
      // burnt bare hide along the shoulder and the flank, split in glowing seams
      for (const [c, a, l] of [[[480, -140], 1.6, 160], [[300, -60], 0.5, 170], [[120, -120], 2.4, 130], [[530, 40], -0.4, 90], [[-60, -150], 1.2, 110]]) { W.crackNet(f, bp(...c), a + th, l, 2.6, { depth: 2, glowOp: 0.35 }); }
      W.soot(f, bp(470, -120), 60, 40, 0.4, th); W.soot(f, bp(300, -40), 70, 40, 0.35, th);
      fern(bp(570, 60), th + 2.3, 160, 2.6, 2); // the fern from the forelegs onto the chest
    });
    rim(BF([[130, -228], [210, -196], [290, -186], [370, -214], [440, -270], [500, -252]]), 3.4, 0.5);
    rim(BF([[560, -150], [600, -52], [600, 16]]), 3, 0.45);
  }, [['spine_1', side(cut, mul(cd, -1), 80)], ['spine_2', side(cut, cd, 80)]]);

  // ---- the harness on the back: the scorched wool saddle cloth, the cart saddle with its bronze terrets welded on,
  // the back band down the side to the tug, and the girth under the belly
  f.bone('spine_2');
  const sc = BF([[250, -252], [400, -262], [420, -170], [400, -110], [270, -100], [240, -170]]);
  f.part(sc, { fill: '#5a4434', shadow: '#1a120c', light: '#8e705a', shade: 0.4, maxShade: 18, tex: 'weave' + seed, texOp: 0.55 });
  W.clipDraw(f, sc, () => { W.scorch(f, bp(330, -150), 60, 40, 0.6, th); f.flat(ell(bp(360, -140), 15, 11, th, 10), '#0e0806'); f.line(ell(bp(360, -140), 18, 14, th, 10).slice(0, 6), 2.4, P.char); f.stroke(BF([[290, -240], [300, -110]]), 2.4, INK, { op: 0.5 }); });
  for (let i = 0; i < 8; i++) { const q = lerp(bp(400, -110), bp(270, -100), i / 7); f.line([q, add(q, rot([0, 18], th))], 3, '#3a2a1e'); }
  const sd = BF([[290, -262], [380, -268], [384, -226], [292, -222]]);
  f.part(sd, W.LEA(f, { fill: '#3e2a1a', maxShade: 12 }));
  for (const u of [304, 366]) { const tq = bp(u, -270); K.ring(f, tq, 11, 13, 6, INK); K.ring(f, tq, 11, 13, 3.6, P.bronze); W.weld(f, [add(tq, [-10, 10]), add(tq, [10, 12])], 2.6, { a: th - 1.6 }); }
  const bb = BF([[330, -226], [338, -120], [346, -20], [350, 40]]);
  f.stroke(bb, 22, INK); f.stroke(bb, 18, '#3e2a1a'); f.line(bb.map(q => add(q, [3, -2])), 1, '#8a6a4a', { op: 0.6, dash: '3 3' });
  const tug = bp(350, 40); K.ring(f, tug, 16, 16, 8, INK); K.ring(f, tug, 16, 16, 5, P.iron);
  const gt = BF([[350, 40], [356, 100], [362, 164]]); f.stroke(gt, 26, INK); f.stroke(gt, 22, '#3a2618');
  W.chainLinks(f, [bp(360, 60), bp(300, 140), bp(250, 170)], 16, P.iron); // the girth chain, sheared, hanging

  // ---- the broken sledge shaft dragging from the tug to the floor behind, its end splintered
  f.bone('shaft');
  const s0 = add(tug, [-6, 10]), s1 = [150, gy - 16];
  const shaft = limb(s0, s1, 34, 30, { steps: 8, capK: 0.25 });
  f.part(shaft, { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.42, maxShade: 14, tex: 'wood' + seed, texOp: 0.6 });
  W.clipDraw(f, shaft, () => { W.scorch(f, lerp(s0, s1, 0.35), 50, 20, 0.5); f.line([lp(s0, s1, 0.05, 9), lp(s0, s1, 0.95, 9)], 2, P.woodL, { op: 0.5 }); f.line([lp(s0, s1, 0.3, -4), lp(s0, s1, 0.6, -6)], 1.4, INK, { op: 0.6 }); });
  f.part([add(s1, [12, -16]), add(s1, [-44, -8]), add(s1, [-12, -2]), add(s1, [-50, 10]), add(s1, [10, 14])], { fill: P.woodL, shade: 0.4, inkW: 1.2, cast: false });
  for (const t of [0.08, 0.16]) f.part(limb(lerp(s0, s1, t), lerp(s0, s1, t + 0.03), 42, 42, { steps: 2, capK: 0.2 }), W.IR(f, { inkW: 1.5, cast: false }));
  f.rivet(lerp(s0, s1, 0.095), 3, '#8a847a'); f.rivet(lerp(s0, s1, 0.175), 3, '#8a847a');

  // ---- the near hind leg over the trunk
  f.bone('spine_1'); hindLeg('hn', false);

  // ---- the neck: thick and crested, standing up from the deep chest to the poll; the jugular groove along the throat
  f.bone('neck');
  const neck = [[548, 560], [552, 490], [548, 420], [554, 340], [576, 268], [606, 212], [642, 176], [676, 164], [712, 196], [722, 250], [732, 310], [750, 380], [778, 446], [812, 504], [850, 566], [866, 622], [800, 650], [680, 620], [600, 600]];
  f.part(neck, HD({ maxShade: 40 }));
  W.clipDraw(f, neck, () => {
    streaks(neck, [680, 400], 90, 180, -1.5, 12);
    lightMass([[600, 230], [690, 200], [740, 330], [700, 420], [620, 360]], 0.22); // the side of the neck turned to the light
    shadeMass([[552, 480], [600, 420], [640, 560], [560, 590]], 0.5);
    f.stroke([[716, 250], [734, 330], [770, 430], [820, 530], [846, 590]], 7, '#000', { op: 0.42 }); // the jugular groove
    f.stroke([[600, 260], [620, 340], [640, 440], [660, 520]], 5, '#000', { op: 0.3 }); // the crest's fat roll above the neck muscles
    W.crackNet(f, [690, 430], -1.5, 150, 2.4, { depth: 2, glowOp: 0.32 });
    W.lichtenberg(f, [800, 560], -2.1, 160, 2.6, { col: '#b6a08a', op: 0.5, depth: 2 });
  });
  rim([[676, 168], [712, 198], [724, 256], [736, 318], [756, 388], [782, 448]], 3.4, 0.55);
  rim([[552, 420], [558, 340], [580, 268], [610, 212]], 2.2, 0.3);

  // the mane: heavy clumped locks along the crest, standing stiff out from it, crackling, the ends singed black
  f.bone('mane');
  const crest = W.spline([[556, 540], [550, 430], [556, 340], [578, 268], [610, 210], [648, 176]], 8), cS = W.arcLen(crest), cL = cS[cS.length - 1];
  for (let i = 0; i < 22; i++) {
    const u = (i + 0.5) / 22 * cL, q = W.at(crest, cS, u), out = Math.atan2(-q.n[1], -q.n[0]); // n points into the neck; out is away from it
    const base = add(q.p, mul(q.n, 10)), l = W.R(f, 70, 120) * (1 - 0.3 * u / cL), w = W.R(f, 14, 20);
    const a = out + W.R(f, -0.25, 0.25) + 0.2;
    lock(base, a, l, w, i % 3 ? '#2a201a' : '#463830');
    lock(add(base, mul(q.d, 8)), a + W.R(f, -0.2, 0.2), l * 0.7, w * 0.55, '#1a1410', { inkOp: 0.35, curl: i % 2 === 0 });
  }

  // ---- the collar: a thick roll of leather stuffed with straw round the neck in front of the shoulders, burst at the
  // near side; the hames along its front with their bronze knobs fused down into the crest; the bell; the trace chains
  f.bone('neck');
  const colC = W.spline([[566, 488], [636, 486], [716, 516], [796, 556], [858, 612]], 6), colW = colC.map((_, i) => 58 + Math.sin(i / (colC.length - 1) * Math.PI) * 12);
  const colTop = K.chain(colC, colW, { steps: 1 });
  f.part(colTop, W.LEA(f, { fill: '#5e4028', light: '#9a7650', maxShade: 26 }));
  for (const [q, w] of [[colC[0], colW[0]], [colC[colC.length - 1], colW[colW.length - 1]]]) f.part(ell(q, w * 0.5, w * 0.5, 0, 14), W.LEA(f, { fill: '#5e4028', light: '#9a7650', maxShade: 18, cast: false }));
  W.clipDraw(f, colTop, () => {
    f.line(colC.map(q => add(q, [4, 10])), 4, INK, { op: 0.4 }); // the seam along the roll
    f.line(colC.map(q => add(q, [6, -14])), 3, '#b08a60', { op: 0.45 });
    W.scorch(f, [720, 560], 70, 26, 0.5, 0.4); W.scorch(f, [620, 520], 40, 20, 0.4);
    for (let i = 0; i < colC.length; i += 4) f.line([add(colC[i], [0, 18]), add(colC[i], [2, 26])], 1.2, '#c8a878', { op: 0.5 }); // stitching
  });
  const burst = [[690, 540], [738, 536], [756, 572], [722, 594], [684, 580]];
  f.flat(burst, '#1a120a');
  for (let i = 0; i < 18; i++) { const b0 = W.scatter(f, [720, 566], 22, 18); f.line([b0, add(b0, rot([W.R(f, 16, 34), 0], -2.4 + W.R(f, -0.9, 0.9)))], 2.2, f.r() < 0.5 ? '#c8a860' : '#9a7a40'); }
  // the hames: two bronze-bound wooden arms along the collar's front, their tops standing above the crest with knobs
  for (const [a0, a1] of [[[590, 446], [694, 488]], [[690, 488], [870, 590]]]) { const pts = [a0, add(lerp(a0, a1, 0.5), [4, -10]), a1]; f.stroke(pts, 20, INK); f.stroke(pts, 15, P.bronze); f.line(pts.map(q => add(q, [3, -3])), 2.6, P.bronzeP, { op: 0.6 }); }
  for (const q of [[574, 446], [600, 430]]) { f.part(ell(q, 20, 18, 0, 14), W.BR(f, { fill: '#a07440', inkW: 1.6, cast: false })); f.flat(ell(add(q, [5, -6]), 6, 4, -0.5, 8), P.bronzeP, { op: 0.6 }); W.weld(f, [add(q, [-16, 12]), add(q, [14, 16])], 4, { a: -1.6 }); }
  f.stroke([[574, 446], [590, 480]], 12, INK); f.stroke([[574, 446], [590, 480]], 8, P.bronze);
  const hook = [778, 568]; K.ring(f, hook, 13, 13, 7, INK); K.ring(f, hook, 13, 13, 4.4, P.bronzeL); W.weld(f, [add(hook, [-12, -10]), add(hook, [10, -14])], 3, { a: -2.2 });
  f.bone('traces');
  W.chainLinks(f, [hook, [760, 630], [748, 700], [746, 760]], 20, P.iron); W.chainLinks(f, [[836, 600], [846, 680], [842, 730]], 18, P.ironL);
  f.part(ell([746, 772], 10, 13, 0.3, 8), W.IR(f, { fill: P.ironL, inkW: 1.3, cast: false })); // the sheared link
  const bl = [652, 590];
  f.part([add(bl, [-18, 16]), add(bl, [-16, -8]), add(bl, [-7, -18]), add(bl, [7, -18]), add(bl, [16, -8]), add(bl, [18, 16]), add(bl, [22, 20]), add(bl, [-22, 20])], W.BR(f, { fill: '#a07440', inkW: 1.4, cast: false }));
  f.flat(ell(add(bl, [0, 20]), 15, 4, 0, 10), '#1a0e06'); f.part(ell(add(bl, [2, 24]), 5, 5, 0, 8), W.BR(f, { inkW: 1, cast: false }));
  // the empty nosebag hung from the near hame on a cord
  W.rope(f, [[700, 600], [690, 650], [700, 700]], 3, { col: '#5a4a30' });
  const nb = [[676, 700], [728, 694], [740, 760], [718, 792], [684, 788], [670, 744]];
  f.part(nb, { fill: '#6a5a44', shadow: '#221c14', light: '#968466', shade: 0.4, maxShade: 16, tex: 'weave' + seed, texOp: 0.55 });
  W.clipDraw(f, nb, () => { f.stroke([[686, 712], [700, 760], [696, 790]], 2.4, INK, { op: 0.5 }); W.scorch(f, [716, 776], 24, 14, 0.5); });

  // ---- the near foreleg over the chest and the collar's foot
  f.bone('spine_2'); foreLeg('fn', false);

  // ---- the lower jaw, dropped on its hinge: the lower lip hanging, the incisors bared
  f.bone('jaw');
  const jaw = jF([[120, 52], [170, 44], [214, 36], [252, 34], [270, 40], [272, 54], [256, 64], [214, 64], [160, 66], [110, 72]]);
  f.part(jaw, HD({ fill: '#3a302c', maxShade: 14 }));
  for (let i = 0; i < 4; i++) f.part(jF([[236 + i * 8, 30], [243 + i * 8, 30], [243 + i * 8, 40], [236 + i * 8, 40]]), { fill: '#cfc2a2', shade: 0.3, inkW: 0.8, cast: false });
  f.flat(jF([[226, 42], [262, 42], [266, 52], [232, 54]]), '#3a1612'); // the inside of the lower lip
  f.line(jF([[180, 62], [240, 60], [262, 56]]), 1.4, '#000', { op: 0.5 });
  f.flat(jF(ell([262, 66], 6, 3, 0, 8)), '#c8c0b0', { op: 0.5 }); // froth at the lip

  // ---- the head: long and heavy, the Roman nose, the great round jowl, the deep cheek, the flared nostril
  f.bone('head');
  const head = hF([[-20, 22], [-10, -18], [12, -34], [50, -42], [100, -42], [150, -38], [190, -40], [224, -36], [252, -24], [274, -8], [286, 10], [282, 24], [262, 28], [236, 28], [214, 30], [186, 38], [150, 46], [116, 62], [86, 84], [46, 94], [12, 86], [-10, 62]]);
  f.part(head, HD({ maxShade: 22 }));
  W.clipDraw(f, head, () => {
    streaks(head, hF([[130, 0]])[0], 110, 26, hA, 6, { k: 0.7 });
    shadeMass(hF([[10, 40], [60, 30], [110, 60], [80, 96], [10, 90]]), 0.4); // the jowl turning under
    lightMass(hF([[20, 20], [70, 10], [100, 40], [60, 62], [24, 56]]), 0.28); // the round flat of the cheek
    f.stroke(hF([[16, 70], [40, 36], [92, 26], [140, 34], [180, 34]]), 6, '#000', { op: 0.42 }); // the facial crest (cheekbone ridge)
    shadeMass(hF([[110, -20], [200, -26], [240, -6], [200, 20], [120, 16]]), 0.3); // the face's long hollow under the bone
    f.stroke(hF([[194, 4], [218, -6], [246, -6]]), 4, '#000', { op: 0.4 }); // the false nostril's fold
    shadeMass(hF([[40, -36], [70, -40], [80, -26], [52, -24]]), 0.4); // the hollow above the eye
    W.lichtenberg(f, hF([[246, 22]])[0], hA + Math.PI + 0.2, 170, 2.6, { col: '#b6a08a', op: 0.55, depth: 2 });
    W.soot(f, hF([[258, 4]])[0], 30, 22, 0.5, hA);
    // the burn welt that runs from the brow across the cheek (the strike that closed the far eye came over the face)
    f.stroke(hF([[20, -36], [56, -30], [90, 6], [120, 30]]), 12, P.scar, { op: 0.6 }); f.line(hF([[22, -36], [58, -30], [92, 4], [122, 28]]), 2, P.scarL, { op: 0.6 });
  });
  rim(hF([[14, -34], [60, -42], [120, -40], [190, -40], [236, -32], [266, -16]]), 3.4, 0.6);
  // the upper lip drawn back off the gum, the incisors and the tushes bared
  f.flat(hF([[220, 26], [276, 22], [282, 30], [252, 34], [226, 34]]), '#3a1612');
  for (let i = 0; i < 5; i++) f.part(hF([[232 + i * 9, 26], [239 + i * 9, 26], [239 + i * 9, 36], [232 + i * 9, 36]]), { fill: '#d6caa8', shade: 0.3, inkW: 0.8, cast: false });
  f.part(hF([[214, 28], [222, 28], [220, 38]]), { fill: '#c8bc9a', shade: 0.3, inkW: 0.8, cast: false });
  f.stroke(hF([[220, 22], [250, 14], [276, 14]]), 5, '#1a1210', { op: 0.6 }); // the lip curled back
  // the nostril, flared wide and sooted: a deep comma with a lit rim
  f.part(hF([[234, -18], [254, -26], [270, -16], [268, 4], [252, 8], [240, -4]]), HD({ fill: '#221a16', inkW: 1.8, cast: false, maxShade: 6 }));
  f.flat(hF([[244, -14], [258, -20], [264, -10], [256, 2], [248, -4]]), '#050303');
  f.line(hF([[238, -22], [256, -28], [272, -16]]), 2.6, hideL, { op: 0.6 });
  // the near eye (consistency pass 2026-11-25: was a round white staring eye): small and dark, set deep under the bony
  // orbit; the heavy upper lid comes down over it, a thin crescent of white shows only at the back corner (the eye rolls
  // back toward the party), a wet glint, the lower lid red-rimmed and sagging
  const EC = [80, -8];
  f.flat(hF(ell([EC[0], EC[1] - 2], 24, 15, 0.08, 16)), '#000', { op: 0.5 }); // the socket's shadow
  f.part(hF([[EC[0] - 12, EC[1] + 1], [EC[0] - 4, EC[1] - 5], [EC[0] + 8, EC[1] - 6], [EC[0] + 13, EC[1] - 1], [EC[0] + 6, EC[1] + 5], [EC[0] - 5, EC[1] + 5]]), { fill: '#1e120a', shade: 0.4, maxShade: 4, inkW: 1.3, inkHeavy: 1.8, cast: false, hatch: false }); // the eyeball: dark brown, almond
  f.flat(hF([[EC[0] - 11, EC[1] + 1], [EC[0] - 7, EC[1] - 3], [EC[0] - 4, EC[1] + 3]]), '#b8a88c', { op: 0.85 }); // the white at the back corner
  f.flat(hF(ell([EC[0] + 3, EC[1] - 1], 4.6, 3.6, 0, 10)), '#050302');
  f.flat(hF(ell([EC[0] + 1, EC[1] - 3], 1.5, 1.1, 0, 6)), '#e8dcc8', { op: 0.85 }); // wet glint
  f.part(hF([[EC[0] - 16, EC[1] - 1], [EC[0] - 6, EC[1] - 10], [EC[0] + 10, EC[1] - 11], [EC[0] + 18, EC[1] - 3], [EC[0] + 10, EC[1] - 4], [EC[0] - 4, EC[1] - 3]]), HD({ fill: '#2a201a', cast: false, maxShade: 6, inkW: 1.4 })); // the heavy upper lid over it
  f.flat(hF([[EC[0] - 12, EC[1] + 4], [EC[0] - 2, EC[1] + 8], [EC[0] + 9, EC[1] + 7], [EC[0] + 5, EC[1] + 5], [EC[0] - 6, EC[1] + 5]]), '#6a3a2e', { op: 0.55 }); // red of the lower lid
  for (let i = 0; i < 4; i++) { const q = hF([[EC[0] - 6 + i * 6, EC[1] - 10]])[0]; f.line([q, add(q, rot([-2, 6], hA))], 1.2, INK); } // lashes pointing down
  f.line(hF([[EC[0] - 14, EC[1] + 5], [EC[0], EC[1] + 10], [EC[0] + 14, EC[1] + 5]]), 1.6, INK, { op: 0.7 });
  f.stroke(hF([[EC[0] - 30, EC[1] - 10], [EC[0] - 4, EC[1] - 24], [EC[0] + 22, EC[1] - 22], [EC[0] + 34, EC[1] - 10]]), 9, '#000', { op: 0.5 }); // the orbit's ridge overhanging it
  f.line(hF([[EC[0] - 24, EC[1] - 22], [EC[0], EC[1] - 32], [EC[0] + 26, EC[1] - 26]]), 2.6, hideL, { op: 0.55 }); // the lit edge of the brow bone
  f.line(hF([[EC[0] - 10, EC[1] + 14], [EC[0] + 4, EC[1] + 20], [EC[0] + 18, EC[1] + 16]]), 1.4, '#000', { op: 0.4 }); // a sag line under it
  // the ears, pinned flat back along the neck, singed at the tips; the forelock standing up stiff between them
  for (const [e, far] of [[[[-6, -22], [-74, -50], [-66, -66], [6, -36]], true], [[[2, -28], [-62, -72], [-48, -84], [18, -40]], false]]) { f.part(hF(e), HD({ fill: far ? '#1a1410' : hide, cast: false })); f.flat(hF([e[1], e[2], lerp(e[2], e[3], 0.25)]), '#0a0806'); if (!far) f.stroke(hF([[0, -34], [-40, -62]]), 4, '#000', { op: 0.5 }); }
  for (let i = 0; i < 7; i++) { const b0 = hF([[4 + i * 6, -36 + i * 0.5]])[0]; lock(b0, -1.75 + i * 0.16 + W.R(f, -0.15, 0.15), W.R(f, 40, 64), W.R(f, 9, 13), i % 2 ? '#2a201a' : '#463830'); }
  // the bridle: crown piece behind the ears, throatlatch, browband with the bronze medallion, cheek piece down to the
  // bit ring, noseband; the near blinker torn off its stitching, leaving a stub and ripped thread
  const strap = (pts, w = 11) => { f.stroke(pts, w + 3, INK); f.stroke(pts, w, '#3a2818'); f.line(pts, 1, '#8a6a4a', { op: 0.6, dash: '3 3' }); };
  strap(hF([[-2, -34], [6, 10], [14, 60]]), 12); strap(hF([[14, 60], [40, 70], [70, 82]]), 9); strap(hF([[6, -30], [40, -42]]), 10);
  strap(hF([[10, 20], [100, 26], [200, 26]]), 10); strap(hF([[180, -38], [186, 0], [192, 36]]), 11);
  const md = hF([[40, -44]])[0]; f.part(ell(md, 20, 20, 0, 14), W.BR(f, { fill: '#a07440', inkW: 1.6, cast: false })); f.stroke([add(md, [-8, 7]), add(md, [7, -7])], 3.4, '#2a1a0c'); f.stroke([add(md, [0, -11]), add(md, [10, -2])], 4.4, '#2a1a0c'); W.weld(f, [add(md, [-18, 9]), add(md, [16, 11])], 3, { a: -1.6 });
  f.part(hF([[52, 10], [66, 6], [70, 22], [54, 24]]), W.LEA(f, { fill: '#2a1a10', cast: false, inkW: 1.1 })); f.line(hF([[54, 26], [64, 34], [74, 30]]), 2, '#8a6a4a', { op: 0.7, dash: '2 3' });
  const bt = hF([[212, 30]])[0]; K.ring(f, bt, 13, 13, 6, INK); K.ring(f, bt, 13, 13, 3.6, P.bronzeL);
  strap([add(bt, [-4, 12]), add(bt, [-20, 60]), add(bt, [-12, 110])], 9); // the broken rein, hanging
  f.part([add(bt, [-20, 104]), add(bt, [-2, 108]), add(bt, [-6, 124]), add(bt, [-22, 118])], W.LEA(f, { fill: '#3a2818', cast: false, inkW: 1 })); // its torn end
  return f;
}

// ------------------------------------------------------------------ THE STORM-CATCHER (ruler 3.5)
// The guild's engineer, who raised the iron spire and the copper cables that drew the storm down into the forges, and is
// still holding on to them. A giant, huge and gaunt, braced at the foot of the spire: legs wide, the front leg driven
// forward, the feet fused into the spire's riveted footing plate; he leans back against the pull, both arms raised in a
// V, each fist round a copper cable that runs up out of frame. Drawn at true size (3.5 x 640 px, head 350 px) on a
// heightened canvas (GUIDE 2, ruling of 2026-11-23); the frame crops the cables and the spire above his fists.
// Fire dominates: he is blackened all over and cracked like a hearth brick, every crack glowing white-gold where the
// current runs hot inside, brightest at the wrists and the chest. Lightning has ferned his skin from fingertips to feet,
// fused the cables into his palms so that they run under the skin of the forearms like veins of metal, and stood his hair
// and beard straight up, singed to wire. Head tilted back, jaw locked open, eyes burned blank.
// Dress: a guild master's leather coat charred away below the waist; a heavy bronze guild chain fused into the chest; a
// leather tool belt with dividers, a plumb bob and a folding rule; a leather tube of scorched drawings; iron cable clamps
// bolted round both forearms; glazed clay insulators on the cables above the fists; copper wire wound round one upper
// arm; a burnt notebook on a cord; a ring of keys; a guild seal ring; one boot burst open by the fused foot; the spire's
// riveted footing plate; a lightning-split weathervane fallen at his feet.
// Rig (follows the Motion line): pelvis (root) > torso > head > jaw; both arms upperarm/forearm/hand with cable_n and
// cable_f on the hands; legs thigh/shin/foot (the feet stay fused); coat (torso tails); tube (torso). Motion: idle a
// constant tremor (small torso/arm keys; the sparks running down the cables are FX); attack a heave on the cables (both
// arms drive down, torso leans further back; the strike from above the frame is an engine effect).
function stormCatcher() {
  const seed = 521, CW = 1800, CH = 2600, f = new Fig(W.base(seed, CH, { grimeY: 2250 }));
  W.textures(f);
  const gy = f.o.groundY, plateTop = 2486, H = 350;
  const BRK = (o = {}) => V.CHAR(f, Object.assign({ fill: '#30251f', light: '#7a6252', shadow: '#0a0605', maxShade: 46, tex: 'craze' + seed, texOp: 0.45 }, o)); // hearth-brick skin
  const COAT = (o = {}) => W.LEA(f, Object.assign({ fill: '#4e3826', light: '#86684c', shadow: '#140c06', maxShade: 46 }, o));
  const soft = (pts, op = 0.45, col = '#000') => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#smk${seed})"/>`);
  const rim = (pts, w = 4, op = 0.5, col = '#8a7060') => f.line(pts, w, col, { op });
  // the skin crazed like a hearth brick: a net of glowing seams in polygonal cells, the cells smaller and hotter where
  // the current runs hot (wrists, chest)
  const brick = (region, cell = 64, w = 2.2, glow = 0.24) => V.brickCracks(f, region, E.bbox(region), cell, w, { glowOp: glow, hot: P.arc, skip: 0.42 });
  // the burns spreading from where the strike came in: thin branching scars with a fused white-gold thread at the root
  const fern = (region, c, a, len, w, d = 3) => W.clipDraw(f, region, () => V.fernSkin(f, c, a, len, w, { depth: d, thread: true, fork: 0.7, lite: '#8a7060', liteOp: 0.55 }));

  // ---- the skeleton: legs braced wide on the footing plate, the trunk leaning back from the hips, the arms raised in a
  // V with the elbows out, the forearms rising to the fists; the cables converge on the spire's head far above the frame
  const N = [875, 845], Pv = [1020, 1530];
  const SN = [835, 915], EN = [462, 654], WN = [241, 339];
  const SF = [950, 885], EF = [1344, 658], WF = [1591, 363];
  const HN = [1060, 1550], KN = [1360, 1975], AN = [1400, 2392], HF = [975, 1540], KF = [880, 2010], AF = [650, 2396]; // the knees bent and braced
  const HC = [812, 580], hA = -0.72, HH = H, hF = frame(HC, hA, HH);
  const CT = [920, -1000];
  W.humanJoints(f, { P: Pv, T: [940, 1210], N: [858, 790], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('jaw', hF([[-0.08, 0.2]])[0], 'head').joint('cable_n', WN, 'hand_n').joint('cable_f', WF, 'hand_f').joint('coat', [900, 1330], 'torso').joint('tube', [760, 950], 'torso');

  // ---- root: the spire's near leg (a riveted lattice of iron angle rising out of frame), the footing plate, the
  // lightning-split weathervane
  f.bone('root');
  const legX = (x0, x1, y) => x0 + (x1 - x0) * y / plateTop;
  for (const [x0, x1] of [[470, 60], [560, 260]]) { f.part([[x0, 0], [x0 + 50, 0], [x1 + 56, plateTop], [x1, plateTop]].map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#2a2724', inkW: 2.2 })); for (let y = 100; y < plateTop; y += 160) f.rivet([legX(x0, x1, y) + 26, y], 7, P.ironL); }
  for (let y = 200; y < plateTop - 300; y += 320) { const a0 = [legX(496, 86, y), y], a1 = [legX(586, 286, y + 300), y + 300], b0 = [legX(586, 286, y), y], b1 = [legX(496, 86, y + 300), y + 300]; for (const [p0, p1] of [[a0, a1], [b0, b1]]) { f.stroke([p0, p1], 26, INK); f.stroke([p0, p1], 20, '#3a3632'); } }
  W.clipDraw(f, [[470, 0], [610, 0], [316, plateTop], [60, plateTop]], () => { W.lichtenberg(f, [380, 900], -1.2, 800, 5, { metal: true, depth: 3 }); W.scorch(f, [300, 1600], 120, 500, 0.4); });
  const plate = [[60, plateTop, 1], [1640, plateTop, 1], [1680, gy, 1], [20, gy, 1]];
  const pdd = f.part(plate, W.IR(f, { fill: '#34302c', inkW: 2.6 })); W.bevel(f, pdd, E.bbox(plate), 6, { lite: '#8a847a', lite2: '#b0aa9e' });
  W.rivetRow(f, [80, plateTop + 22], [1620, plateTop + 22], 24, 7, P.ironL, { fused: 0.25 });
  W.clipDraw(f, plate, () => { W.lichtenberg(f, [AN[0] + 40, plateTop + 30], 0.1, 300, 4, { metal: true, depth: 3 }); W.lichtenberg(f, [AF[0], plateTop + 30], Math.PI - 0.1, 400, 4, { metal: true, depth: 3 }); });
  f.flat(ell([1000, gy + 4], 760, 16, 0, 24), '#000', { op: 0.35 });
  const wv = [1560, plateTop - 10]; // the weathervane: an iron cockerel on an arrow, split down the middle, its halves fallen apart
  f.line([add(wv, [-200, 0]), add(wv, [-20, -6])], 10, INK); f.line([add(wv, [-200, 0]), add(wv, [-20, -6])], 6, P.iron);
  f.part([add(wv, [-200, -18]), add(wv, [-170, 0]), add(wv, [-200, 18])], W.IR(f, { inkW: 1.4, cast: false }));
  f.part([add(wv, [0, 0]), add(wv, [20, -60]), add(wv, [60, -90]), add(wv, [70, -60]), add(wv, [100, -50]), add(wv, [40, -10])], W.IR(f, { fill: '#2e2a26', inkW: 1.8 }));
  f.part([add(wv, [50, 0]), add(wv, [100, -36]), add(wv, [118, -100]), add(wv, [140, -40]), add(wv, [110, -4])], W.IR(f, { fill: '#2a2622', inkW: 1.8 }));
  f.line([add(wv, [44, -8]), add(wv, [56, -50]), add(wv, [50, -84])], 3, P.arcG, { op: 0.7 }); W.scorch(f, add(wv, [60, -30]), 60, 30, 0.5);

  // ---- the cable: twisted copper running from the fist up to the spire's head, a glazed clay insulator of four sheds
  // above the fist; it enters the fist and is fused into the palm
  const cable = (W0, bone) => {
    f.bone(bone);
    const top = CT, pts = [lerp(W0, top, -0.02), lerp(W0, top, 0.5), top];
    f.stroke(pts, 44, INK); f.stroke(pts, 36, P.copper); f.line(pts.map(q => add(q, [7, 0])), 5, P.copperL, { op: 0.6 }); f.line(pts.map(q => add(q, [-9, 0])), 4, P.copperD, { op: 0.6 });
    for (let t = 0; t < 0.5; t += 0.012) { const q = lerp(W0, top, t), a = ang(W0, top); f.line([add(q, rot([0, -17], a)), add(q, rot([10, 17], a))], 1.6, P.copperD, { op: 0.7, straight: true }); } // the strands' twist
    const ia = ang(W0, top), ic = add(W0, rot([230, 0], ia));
    f.stroke([add(ic, rot([-90, 0], ia)), add(ic, rot([110, 0], ia))], 34, '#4a2a1a'); // the insulator's core
    for (let k = 0; k < 4; k++) { const c = add(ic, rot([k * 44 - 66, 0], ia)), skirt = ell(c, 20, 62 - k * 3, ia, 16); f.part(skirt, { fill: '#6a3a26', shadow: '#1e0c06', light: '#c8906a', shade: 0.4, maxShade: 24, inkW: 2.2, cast: false, hatch: false }); f.line(ell(c, 13, 46, ia, 16).slice(11, 15), 3, '#f0d0b0', { op: 0.5 }); }
    W.clipDraw(f, [add(ic, rot([-110, -80], ia)), add(ic, rot([110, -80], ia)), add(ic, rot([110, 80], ia)), add(ic, rot([-110, 80], ia))], () => W.scorch(f, add(ic, rot([-40, 20], ia)), 60, 50, 0.55));
    f.flat(ell(add(ic, rot([20, 40], ia)), 4, 10, ia, 8), '#1a0e06');
    f.line([add(W0, rot([70, 18], ia)), add(W0, rot([150, 14], ia))], 3, P.arcG, { op: 0.6 }); // the copper bright where it went white-hot
  };

  // ---- an arm: a gaunt giant's arm, the deltoid capping the shoulder and wedging into the arm, the biceps and triceps
  // stringy over the bone, the elbow's point, the forearm's flexors swelling under the elbow and tapering to a bony
  // wrist. ws: widths at the shoulder, mid upper arm, elbow, forearm swell, wrist. el: +1 if the elbow's point is on
  // the limb's P side
  const arm = (S0, E0, W0, sfx, far, el) => {
    const look = BRK({ fill: far ? '#231b17' : '#30251f', light: far ? '#5a4a40' : '#7a6252' });
    const ws = far ? [170, 146, 112, 132, 92] : [186, 158, 120, 142, 98];
    const pts = [S0, lerp(S0, E0, 0.45), E0, lerp(E0, W0, 0.3), W0];
    const outline = K.chain(pts, ws, { steps: 6, bp: [[0, 0.1, 0.12, 0.2], [1, 0.4, 0.1, 0.2]], bq: [[0, 0.2, 0.1, 0.25], [2, 0.1, 0.08, 0.2]] });
    const de = elb(S0, E0, W0);
    split(f, () => {
      f.part(outline, look);
      W.clipDraw(f, outline, () => {
        const dU = E.norm(sub(E0, S0)), nU = [-dU[1], dU[0]], dL = E.norm(sub(W0, E0)), nL = [-dL[1], dL[0]];
        soft([add(lerp(S0, E0, 0.2), mul(nU, el * 40)), add(lerp(S0, E0, 0.7), mul(nU, el * 50)), add(lerp(S0, E0, 0.75), mul(nU, el * 80)), add(lerp(S0, E0, 0.2), mul(nU, el * 90))], 0.45); // the shadowed underside
        soft([add(lerp(S0, E0, 0.25), mul(nU, -el * 30)), add(lerp(S0, E0, 0.65), mul(nU, -el * 34)), add(lerp(S0, E0, 0.6), mul(nU, -el * 70)), add(lerp(S0, E0, 0.25), mul(nU, -el * 76))], far ? 0.08 : 0.2, '#8a7060'); // the biceps to the light
        f.stroke([add(lerp(S0, E0, 0.15), mul(nU, el * 10)), add(lerp(S0, E0, 0.55), mul(nU, el * 4)), add(lerp(S0, E0, 0.9), mul(nU, el * 14))], 8, '#000', { op: 0.42 }); // biceps from triceps
        f.stroke([add(lerp(S0, E0, 0.05), mul(nU, -el * 70)), add(lerp(S0, E0, 0.22), mul(nU, -el * 20)), add(lerp(S0, E0, 0.32), mul(nU, el * 50))], 9, '#000', { op: 0.4 }); // the deltoid's lower edge
        f.stroke([add(E0, mul(nU, el * 46)), add(lerp(E0, W0, 0.18), mul(nL, el * 40)), add(lerp(E0, W0, 0.32), mul(nL, el * 26))], 7, '#000', { op: 0.4 }); // the elbow's crease
        f.stroke([add(lerp(E0, W0, 0.15), mul(nL, -el * 20)), add(lerp(E0, W0, 0.5), mul(nL, -el * 10)), add(lerp(E0, W0, 0.9), mul(nL, -el * 18))], 6, '#000', { op: 0.35 }); // the flexor groove
        for (const o of [0.16, -0.12]) f.line([add(lerp(E0, W0, 0.7), mul(nL, o * 120)), add(lerp(E0, W0, 0.98), mul(nL, o * 90))], 4, '#8a7060', { op: far ? 0.15 : 0.4 }); // the wrist's tendons standing
        brick(outline, 58, 2.2, 0.22);
        W.glow(f, lerp(E0, W0, 0.9), 70, 50, P.arcG, 0.25, false, ang(E0, W0)); // the wrists, hottest
        fern(outline, lerp(E0, W0, 0.96), ang(W0, E0) + 0.1, 360, far ? 4 : 5, 3); // the burns spreading from where the cable enters the hand
        fern(outline, lerp(E0, W0, 0.96), ang(W0, E0) - 0.35, 220, far ? 3 : 3.6, 2);
      });
      // the elbow's point: the bone standing under the skin
      const ep = add(E0, mul(de, -8)), en = add(ep, mul(E.norm(sub(add(E0, mul([-E.norm(sub(E0, S0))[1], E.norm(sub(E0, S0))[0]], el * 60)), E0)), 54));
      f.part(ell(en, 30, 24, ang(S0, E0), 12), Object.assign({}, look, { cast: false, inkW: 1.4, inkHeavy: 2 }));
      f.line(ell(en, 22, 16, ang(S0, E0), 12).slice(9, 14), 3, '#8a7060', { op: far ? 0.15 : 0.45 });
      // the cable running on under the skin of the forearm like a vein of metal, glowing where the skin has split over it
      for (const o of [-0.18, 0.12]) {
        const vp = [lp(E0, W0, 0.15, ws[3] * o), lp(E0, W0, 0.45, ws[3] * (o + 0.05)), lp(E0, W0, 0.75, ws[4] * o), lp(E0, W0, 1.0, ws[4] * o * 0.5)];
        f.stroke(vp, 20, '#000', { op: 0.5 }); f.stroke(vp, 13, P.copper, { op: 0.9 }); f.line(vp.map(q => add(q, [2, -2])), 3, P.copperL, { op: 0.7 }); W.glowLine(f, vp.slice(1), 10, P.arcG, 0.22);
      }
    }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[2] * 0.6)], ['forearm' + sfx, side(E0, de, ws[2] * 0.6)]]);
    // the iron cable clamp bolted round the forearm, with its bolt lug
    f.bone('forearm' + sfx);
    const t = 0.48, w = ws[3] * 0.98, a = lp(E0, W0, t, -w * 0.6), b = lp(E0, W0, t, w * 0.6), c0 = lp(E0, W0, t + 0.09, w * 0.56), d0 = lp(E0, W0, t + 0.09, -w * 0.56);
    const cl = [a, b, c0, d0].map(q => [q[0], q[1], 1]), cd = f.part(cl, W.IR(f, { fill: '#3a3632', inkW: 2.2 })); W.bevel(f, cd, E.bbox(cl), 5, { lite: '#8a847a' });
    for (const s of [-0.4, 0, 0.4]) f.rivet(lp(E0, W0, t + 0.045, w * s), 8, P.ironL);
    f.part([lp(E0, W0, t - 0.02, w * 0.6), lp(E0, W0, t + 0.11, w * 0.6), lp(E0, W0, t + 0.11, w * 0.78), lp(E0, W0, t - 0.02, w * 0.78)].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 1.6, cast: false })); f.rivet(lp(E0, W0, t + 0.045, w * 0.69), 9, '#9a948a');
    W.seam(f, [lp(E0, W0, t - 0.01, -w * 0.5), lp(E0, W0, t - 0.02, 0), lp(E0, W0, t - 0.01, w * 0.5)], 2.4, { hot: P.arc, glowOp: 0.3 }); // the skin split against the clamp's edge
    // the fist round the cable: knuckles standing, the cable fused into the palm with a hot seam
    f.bone('hand' + sfx);
    const g = B.grip(f, W0, E0, ang(W0, CT), far ? 118 : 128, far ? '#3a2e26' : '#4e3e32', { tex: 'craze' + seed, texOp: 0.45, shadow: '#160e0a', name: 'catcher cable ' + sfx, maxBend: 38 });
    W.seam(f, g.F([[-0.62, 0.02], [-0.3, -0.12], [0.1, 0.02], [0.3, -0.06]]), 3.6, { hot: P.arc, glowOp: 0.45 });
    for (const [x, y] of [[0.3, -0.42], [0.33, -0.12], [0.31, 0.18], [0.28, 0.46]]) { f.flat(ell(g.F([[x, y]])[0], 14, 10, 0, 8), '#8a7060', { op: far ? 0.2 : 0.5 }); f.line(ell(g.F([[x + 0.04, y]])[0], 10, 7, 0, 8).slice(0, 4), 2, '#120a06', { op: 0.6 }); } // the knuckles, skin split over them
    for (const [x, y] of [[0.55, -0.35], [0.6, 0.0], [0.56, 0.3]]) W.hairline(f, g.F([[x - 0.1, y - 0.05], [x + 0.05, y + 0.08]]), 1.6);
    return g;
  };

  // ---- far cable and far arm, behind the head and the trunk
  cable(WF, 'cable_f');
  arm(SF, EF, WF, '_f', true, 1);
  const sleeve = (S0, E0, w, far) => {
    const sl = K.ragLimb(f, lerp(S0, E0, -0.12), lerp(S0, E0, 0.42), w + 16, w - 10, { teeth: 7, depth: 28 });
    f.part(sl, COAT(far ? { fill: '#3a2a1c', light: '#5e4a36' } : {}));
    W.clipDraw(f, sl, () => {
      const side1 = (E.norm([-(E0[1] - S0[1]), E0[0] - S0[0]])[0] * f.L[0] + E.norm([-(E0[1] - S0[1]), E0[0] - S0[0]])[1] * f.L[1]) > 0 ? 1 : -1; // the P side faces the light?
      soft([lp(S0, E0, -0.1, -side1 * w * 0.5), lp(S0, E0, 0.45, -side1 * w * 0.5), lp(S0, E0, 0.45, -side1 * w * 0.2), lp(S0, E0, -0.1, -side1 * w * 0.2)], 0.6); // the sleeve turning away from the light
      soft([lp(S0, E0, 0.0, side1 * w * 0.3), lp(S0, E0, 0.4, side1 * w * 0.3), lp(S0, E0, 0.4, side1 * w * 0.1), lp(S0, E0, 0.0, side1 * w * 0.1)], far ? 0.08 : 0.22, '#9a7a5a'); // the lit crown of the sleeve
      for (const t of [0.02, 0.1, 0.19, 0.3]) { const q = [lp(S0, E0, t, -w * 0.5), lp(S0, E0, t + 0.04, -w * 0.1), lp(S0, E0, t + 0.02, w * 0.3), lp(S0, E0, t - 0.01, w * 0.5)]; f.stroke(q, 9, INK, { op: 0.45 }); f.line(q.map(z => add(z, mul(f.L, 4))), 3, '#9a7a5a', { op: 0.45 }); } // folds bunched toward the armpit, wrapping the arm
      f.stitches([lp(S0, E0, -0.1, side1 * w * 0.36), lp(S0, E0, 0.4, side1 * w * 0.34)], '#a08a6a', 1.6);
      W.glow(f, lp(S0, E0, 0.36), 80, 40, P.sootD, 0.5);
    });
    W.seam(f, [lp(S0, E0, 0.4, -90), lp(S0, E0, 0.43, 0), lp(S0, E0, 0.4, 90)], 2.4, { glowOp: 0.3 });
  };
  f.bone('torso'); sleeve(SF, EF, 196, true);

  // ---- the legs: bare and gaunt from the knee (the breeches burnt off there in curled tatters), blackened, cracked,
  // ferned from the feet up; heavy boots welded into the plate, the near one burst open by the fused foot
  const legDraw = (sfx, Hp, Kn, A, far) => {
    const look = BRK({ fill: far ? '#231b17' : '#30251f', light: far ? '#5a4a40' : '#7a6252' });
    const dir = -1; // the limb's Q side is its front for both legs
    const lg = K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.35), add(A, [0, -40])], far ? [236, 200, 150, 152, 112] : [252, 214, 158, 162, 118], { steps: 6, bp: [[0, 0.3, 0.1, 0.3], [1, 0.2, 0.06, 0.3], [3, 0.0, 0.14, 0.3]], bq: [[0, 0.6, 0.12, 0.3], [1, 0.5, 0.06, 0.25], [2, 0.5, -0.08, 0.2], [3, 0.3, 0.04, 0.3]] });
    const dk = elb(Hp, Kn, A);
    split(f, () => {
      f.part(lg, look);
      W.clipDraw(f, lg, () => {
        const dS = E.norm(sub(A, Kn)), nS = [-dS[1], dS[0]];
        soft([lp(Kn, A, 0.1, -dir * 40), lp(Kn, A, 0.5, -dir * 30), lp(Kn, A, 0.5, -dir * 90), lp(Kn, A, 0.1, -dir * 90)], 0.4);
        f.stroke([lp(Kn, A, 0.08, dir * 30), lp(Kn, A, 0.5, dir * 34), lp(Kn, A, 0.9, dir * 24)], 6, '#8a7060', { op: far ? 0.15 : 0.4 }); // the shin bone's edge, lit
        f.stroke([lp(Kn, A, 0.1, -dir * 50), lp(Kn, A, 0.35, -dir * 70), lp(Kn, A, 0.7, -dir * 40)], 8, '#000', { op: 0.4 }); // the calf, wasted
        f.part(ell(add(Kn, mul(dk, -10)), 52, 42, ang(Hp, Kn), 12), Object.assign({}, look, { cast: false, inkW: 1.2, inkHeavy: 0 })); // the kneecap
        brick(lg, 62, 2.2, 0.2);
        fern(lg, add(A, [0, -50]), ang(A, Kn) + 0.08, 560, 5.4, 3); // the burns climbing from the feet
        // the breeches, burnt away below the knee in curled tatters
        const br = [lp(Hp, Kn, -0.15, -dir * 170), lp(Hp, Kn, -0.15, dir * 170), lp(Hp, Kn, 0.85, dir * 116), lp(Hp, Kn, 0.98, dir * 70), lp(Hp, Kn, 0.9, dir * 20), lp(Hp, Kn, 1.06, -dir * 30), lp(Hp, Kn, 0.94, -dir * 80), lp(Hp, Kn, 1.02, -dir * 110), lp(Hp, Kn, 0.86, -dir * 130)];
        f.part(br, COAT({ fill: far ? '#2e261e' : '#3e3428', light: '#6e5e4a', tex: 'weave' + seed, texOp: 0.5 }));
        soft([lp(Hp, Kn, 0.0, 120), lp(Hp, Kn, 0.9, 80), lp(Hp, Kn, 0.9, 30), lp(Hp, Kn, 0.0, 50)], 0.55); // the thigh turning away, the back of the leg
        soft([lp(Hp, Kn, 0.1, -40), lp(Hp, Kn, 0.7, -30), lp(Hp, Kn, 0.7, -90), lp(Hp, Kn, 0.1, -100)], far ? 0.06 : 0.18, '#9a7a5a'); // the quad's round to the light
        f.stitches([lp(Hp, Kn, 0.0, 6), lp(Hp, Kn, 0.5, 14), lp(Hp, Kn, 0.86, 10)], '#8a7454', 1.6); // the outseam
        f.part([lp(Hp, Kn, 0.5, -90), lp(Hp, Kn, 0.5, -40), lp(Hp, Kn, 0.66, -40), lp(Hp, Kn, 0.68, -86)], COAT({ fill: '#2e2418', cast: false, inkW: 1.4, maxShade: 8 })); // a leather patch over the knee's wear
        W.clipDraw(f, br, () => {
          for (const q of [[lp(Hp, Kn, 0.15, dir * 60), lp(Hp, Kn, 0.45, dir * 30), lp(Hp, Kn, 0.8, dir * 60)], [lp(Hp, Kn, 0.3, -dir * 70), lp(Hp, Kn, 0.55, -dir * 40), lp(Hp, Kn, 0.85, -dir * 50)], [lp(Hp, Kn, 0.05, 0), lp(Hp, Kn, 0.35, -dir * 10), lp(Hp, Kn, 0.6, dir * 10)]]) { f.stroke(q, 9, INK, { op: 0.5 }); f.line(q.map(z => add(z, [6, -3])), 3, '#7a6a54', { op: 0.5 }); } // folds pulled by the wide stance
          W.glow(f, lp(Hp, Kn, 0.8), 120, 100, P.sootD, 0.5, true); W.scorch(f, lp(Hp, Kn, 0.55, dir * 40), 60, 80, 0.4);
          for (const [u, v, r] of [[0.45, dir * 70, 14], [0.7, -dir * 60, 18]]) { const c = lp(Hp, Kn, u, v); f.flat(ell(c, r, r * 0.8, 0, 10), '#0e0806'); f.line(ell(c, r + 5, r * 0.8 + 5, 0, 10).slice(0, 7), 4, P.char, { op: 0.8 }); f.line(ell(c, r, r * 0.8, 0, 10).slice(2, 6), 2, P.lamp, { op: 0.6 }); }
        });
        f.line(br.slice(2, 9), 10, P.char, { op: 0.9 }); W.seam(f, br.slice(3, 8), 2.4, { glowOp: 0.3 });
        for (let i = 0; i < 6; i++) { const q = lerp(br[2], br[8], i / 5); f.flat([add(q, [-12, -2]), add(q, [0, 26 + (i % 2) * 16]), add(q, [12, 0])], P.char); }
      });
    }, [['thigh' + sfx, side(Kn, mul(dk, -1), 110)], ['shin' + sfx, side(Kn, dk, 110)]]);
    // the boot
    const ac = ankleCut(Kn, A);
    if (!far) {
      split(f, () => B.boot(f, A, 1, 220, '#2a1c12', { shaft: 0.9, tex: 'craze' + seed, groundY: plateTop }), [['shin_n', side(A, mul(ac, -1), 76)], ['foot_n', side(A, ac, 76)]]);
      f.bone('foot_n');
      const burst = [[A[0] + 24, A[1] - 30], [A[0] + 160, A[1] + 6], [A[0] + 230, plateTop - 54], [A[0] + 130, plateTop - 12], [A[0] + 20, plateTop - 46]];
      f.part(burst, BRK({ inkW: 2 })); brick(burst, 40, 2.2, 0.3);
      f.line(burst.slice(0, 3), 6, '#140c06'); for (let i = 0; i < 6; i++) { const q = lerp(burst[0], burst[2], i / 5); f.line([q, add(q, [12 - i * 3, -20])], 3.4, '#2a1c12'); } // the split leather's torn lips
      for (let i = 0; i < 4; i++) f.part(ell([A[0] + 196 - i * 10, plateTop - 30 + i * 2], 16, 14, 0, 10), BRK({ cast: false, inkW: 1.4 })); // the toes swollen through the split
    } else {
      split(f, () => B.boot(f, A, 1, 214, '#24180f', { shaft: 0.9, strap: true, tex: 'craze' + seed, groundY: plateTop }), [['shin_f', side(A, mul(ac, -1), 76)], ['foot_f', side(A, ac, 76)]]);
    }
    f.bone('foot' + sfx);
    W.weld(f, [[A[0] - 100, plateTop - 4], [A[0] + 80, plateTop - 2], [A[0] + 250, plateTop - 4]], 14, { a: Math.PI / 2 }); // fused into the plate
    W.glow(f, [A[0] + 80, plateTop], 220, 30, P.arcG, 0.25);
  };
  legDraw('_f', HF, KF, AF, true);
  legDraw('_n', HN, KN, AN, false);

  // ---- the leather tube of drawings slung across the back
  f.bone('tube');
  const t0 = [700, 910], t1 = [650, 1330];
  const tb = limb(t0, t1, 96, 90, { steps: 6, capK: 0.25 });
  f.part(tb, COAT({ fill: '#5a3e26' }));
  for (const t of [0.08, 0.92]) f.part(limb(lerp(t0, t1, t - 0.04), lerp(t0, t1, t + 0.04), 104, 104, { steps: 2, capK: 0.2 }), COAT({ fill: '#3a2616', cast: false }));
  W.clipDraw(f, tb, () => { W.scorch(f, lerp(t0, t1, 0.6), 60, 120, 0.6); f.line([lp(t0, t1, 0.1, -30), lp(t0, t1, 0.9, -28)], 3, '#8a6a4e', { op: 0.5 }); });
  f.part([add(t0, [-30, -20]), add(t0, [20, -30]), add(t0, [40, -64]), add(t0, [0, -86]), add(t0, [-36, -64])], { fill: '#c8bc9e', shade: 0.4, inkW: 1.6, cast: false, tex: 'hatch' + seed, texOp: 0.3 }); // a rolled drawing poking out, scorched
  f.flat(ell(add(t0, [10, -68]), 16, 10, 0, 10), P.char);

  // ---- the trunk: a huge gaunt frame leaning back, the ribcage lifted by the raised arms, the belly sunk under it, the
  // lats stretched from the armpits; the guild chain fused into the chest
  f.bone('torso');
  const TOR = [[917, 762], [968, 800], [1022, 856], [1076, 940], [1114, 1022], [1130, 1110], [1122, 1200], [1094, 1280], [1109, 1370], [1140, 1450], [1160, 1530], [1096, 1590], [943, 1596], [866, 1510], [835, 1400], [802, 1300], [746, 1180], [707, 1070], [692, 980], [707, 890], [751, 822], [815, 770]];
  f.part(TOR, BRK({ maxShade: 60 }));
  W.clipDraw(f, TOR, () => {
    soft([[712, 910], [789, 910], [815, 1150], [866, 1350], [866, 1550], [789, 1450], [725, 1150]], 0.55); // the back turning away
    soft([[968, 870], [1096, 970], [1122, 1070], [1020, 1050], [943, 950]], 0.25, '#8a7060'); // the far pectoral, lit, stretched up
    for (let i = 0; i < 6; i++) { const y = 880 + i * 46; f.stroke([[820 + i * 6, y - 30], [930 + i * 4, y], [1040 - i * 6, y + 10 + i * 4], [1074 - i * 4, y - 10]], 13, '#000', { op: 0.42 }); f.line([[840 + i * 6, y - 36], [940 + i * 4, y - 8], [1040 - i * 6, y + 2]], 4, '#8a7060', { op: 0.4 }); } // the ribs standing out
    soft([[968, 1290], [1084, 1270], [1096, 1370], [1007, 1400], [943, 1360]], 0.5); // the belly sunk under the ribs
    f.stroke([[1084, 1280], [1020, 1300], [968, 1350]], 10, '#000', { op: 0.4 }); // the ribcage's lower edge
    f.stroke([[751, 990], [789, 1110], [840, 1230]], 12, '#000', { op: 0.4 }); f.line([[764, 980], [802, 1100], [848, 1210]], 4, '#8a7060', { op: 0.35 }); // the lat stretched from the armpit
    f.stroke([[1025, 870], [1007, 950], [1020, 1050]], 7, '#000', { op: 0.35 }); // the sternum's groove
    brick(TOR, 60, 2.6, 0.3);
    W.glow(f, [1032, 1000], 220, 200, P.arcG, 0.22, true); // the chest, brightest
    V.brickCracks(f, ell([1032, 1010], 120, 110, 0, 14), [890, 900, 1130, 1120], 34, 2.4, { glowOp: 0.35, hot: P.arc, skip: 0.3 });
  });
  rim([[968, 800], [1022, 856], [1076, 940], [1114, 1022], [1130, 1110]], 5, 0.5);
  // the coat: a guild master's leather coat over the back and sides, open over the chest, pulled up into folds by the
  // raised arms, charred away at the waist in curled tatters glowing at their edges
  f.bone('coat');
  const coatB = [[810, 760], [866, 790], [892, 910], [912, 1050], [930, 1190], [958, 1310], [943, 1370], [892, 1400], [866, 1360], [815, 1412], [764, 1366], [725, 1400], [687, 1330], [692, 1210], [664, 1090], [651, 980], [674, 870], [733, 800]];
  f.part(coatB, COAT());
  W.clipDraw(f, coatB, () => {
    for (const q of [[[712, 870], [764, 1030], [802, 1190], [840, 1330]], [[687, 950], [712, 1110], [751, 1260]], [[866, 830], [853, 970], [879, 1130], [892, 1270]]]) { f.stroke(q, 10, INK, { op: 0.5 }); f.line(q.map(z => add(z, [7, -2])), 3.4, '#8a6a4e', { op: 0.5 }); } // folds pulled up from the armpit
    W.glow(f, [764, 1270], 120, 110, P.sootD, 0.55, true); W.scorch(f, [828, 1050], 60, 120, 0.4);
    for (const [c, r] of [[[751, 1110], 22], [[840, 1250], 14], [[712, 1310], 12]]) { f.flat(ell(c, r, r * 0.8, 0, 10), '#0e0806'); f.line(ell(c, r + 5, r * 0.8 + 5, 0, 10).slice(0, 7), 4, P.char, { op: 0.8 }); f.line(ell(c, r, r * 0.8, 0, 10).slice(2, 6), 2, P.lamp, { op: 0.6 }); } // burnt through
    f.stitches([[881, 850], [899, 1010], [917, 1170], [938, 1300]], '#a08a6a', 1.6);
    W.lichtenberg(f, [712, 910], 1.4, 420, 4.4, { depth: 3, col: '#0c0604', op: 0.8 });
  });
  f.line(coatB.slice(5, 13), 14, P.char, { op: 0.9 }); W.seam(f, coatB.slice(6, 12), 3, { glowOp: 0.3 });
  W.flakes(f, [815, 1400], 110, 30, 10, 2.2);
  // the far lapel: a strip of the coat down the far side
  const lap = [[1020, 850], [1066, 910], [1096, 1010], [1114, 1130], [1109, 1250], [1084, 1300], [1071, 1230], [1076, 1110], [1058, 1000], [1007, 890]];
  f.bone('torso'); f.part(lap, COAT({ fill: '#3e2c1e', maxShade: 20 })); f.line(lap.slice(5, 7), 10, P.char, { op: 0.9 });
  // the guild chain: heavy bronze plates linked across the chest, the middle plates sunk and fused into the skin, ferns
  // spreading from each
  const ch = [[866, 850], [917, 940], [968, 1010], [1032, 1040], [1091, 1010], [1122, 950]];
  ch.forEach((q, i) => {
    const a = i < ch.length - 1 ? ang(q, ch[i + 1]) : ang(ch[i - 1], q), sunk = i >= 2 && i <= 4;
    const pl = [[-36, -26], [36, -26], [38, 24], [0, 42], [-38, 24]].map(([u, v]) => add(q, rot([u, v], a))).map(z => [z[0], z[1], 1]);
    if (sunk) { W.seam(f, [add(q, rot([-32, 36], a)), add(q, rot([0, 50], a)), add(q, rot([32, 36], a))], 2.4, { hot: P.arc, glowOp: 0.3 }); V.lich(f, TOR, add(q, rot([0, 34], a)), a + Math.PI / 2 + W.R(f, -0.4, 0.4), 170, 4, { depth: 3, col: '#0a0605' }); }
    const d = f.part(pl, W.BR(f, { fill: sunk ? '#7a5630' : '#a07444', inkW: 2, cast: false, k: 0.3, shade: 0.25, tex: null })); W.bevel(f, d, E.bbox(pl), 5);
    f.stroke([add(q, rot([-14, 10], a)), add(q, rot([10, -12], a))], 7, '#2a1a0c'); f.stroke([add(q, rot([2, -20], a)), add(q, rot([18, -6], a))], 9, '#2a1a0c');
    if (i < ch.length - 1) { const m = lerp(q, ch[i + 1], 0.5), e = ell(m, 16, 11, a, 12); f.line(e.concat([e[0]]), 10, INK); f.line(e.concat([e[0]]), 6, P.bronzeL); }
  });
  W.rope(f, [[700, 910], [800, 850], [950, 800]], 10, { col: '#3a2818' }); // the tube's strap over the shoulder
  // the notebook on a cord, burnt
  const nb = [1020, 1160];
  f.line([[940, 810], [990, 970], add(nb, [0, -54])], 3, '#3a2a1a');
  const nbk = [add(nb, [-44, -54]), add(nb, [40, -58]), add(nb, [44, 50]), add(nb, [-40, 56])].map(q => [q[0], q[1], 1]);
  f.part(nbk, W.LEA(f, { fill: '#3a2616', inkW: 2 })); f.part([add(nb, [34, -56]), add(nb, [44, -58]), add(nb, [48, 48]), add(nb, [38, 50])].map(q => [q[0], q[1], 1]), { fill: '#c8bc9e', shade: 0.3, inkW: 1.4, cast: false }); W.scorch(f, add(nb, [-10, 30]), 40, 30, 0.6); f.flat(ell(add(nb, [-20, 30]), 16, 12, 0, 10), '#0e0806'); f.line(ell(add(nb, [-20, 30]), 20, 16, 0, 10).slice(0, 6), 2.4, P.lamp, { op: 0.6 });

  // ---- pelvis: the tool belt with the dividers, the plumb bob, the folding rule, the ring of keys
  f.bone('pelvis');
  const belt = [[840, 1400], [1122, 1386], [1148, 1450], [853, 1466]];
  f.part(belt.map(q => [q[0], q[1], 1]), W.LEA(f, { fill: '#2a1c12' }));
  f.stitches([[870, 1412], [1080, 1400]], '#8a7454', 1.4);
  const bk = [1070, 1424]; f.part([add(bk, [-28, -28]), add(bk, [28, -28]), add(bk, [28, 28]), add(bk, [-28, 28])].map(q => [q[0], q[1], 1]), W.BR(f, { inkW: 2, cast: false })); f.flat([add(bk, [-14, -14]), add(bk, [14, -14]), add(bk, [14, 14]), add(bk, [-14, 14])].map(q => [q[0], q[1], 1]), '#1a0e06');
  const dv = [900, 1460]; // the dividers: two iron legs from a hinge, hanging point down from a loop
  f.part(ell(dv, 18, 18, 0, 10), W.IR(f, { inkW: 1.6, cast: false })); for (const sg of [-1, 1]) { const tip = add(dv, [sg * 44, 240]); f.part([add(dv, [-8, 0]), add(dv, [8, 0]), tip], W.IR(f, { inkW: 1.6 })); }
  const pb = [990, 1462]; W.rope(f, [pb, add(pb, [6, 120])], 3, { col: '#6a5a3a' }); // the plumb bob
  f.part([add(pb, [-20, 120]), add(pb, [32, 120]), add(pb, [24, 160]), add(pb, [6, 210]), add(pb, [-12, 160])], W.BR(f, { fill: '#8a6236', inkW: 2 }));
  const rl = [944, 1458]; // the folding rule, half open, boxwood with brass joints
  f.part([add(rl, [-14, 0]), add(rl, [14, 0]), add(rl, [26, 250]), add(rl, [-2, 252])].map(q => [q[0], q[1], 1]), { fill: '#b8a070', shade: 0.4, inkW: 1.6, tex: 'wood' + seed, texOp: 0.4 });
  for (let i = 1; i < 19; i++) f.line([add(rl, [14 + i * 0.6, i * 13]), add(rl, [14 + i * 0.6 - (i % 4 ? 6 : 12), i * 13])], 1.2, INK);
  f.part(ell(add(rl, [6, 126]), 13, 13, 0, 10), W.BR(f, { inkW: 1.4, cast: false })); W.scorch(f, add(rl, [10, 200]), 20, 50, 0.6);
  const kr = [1100, 1480]; K.ring(f, add(kr, [0, 44]), 26, 26, 8, '#2a2622'); K.ring(f, add(kr, [0, 44]), 26, 26, 3, '#8a847a');
  for (let i = 0; i < 5; i++) { const a = 1.1 + i * 0.22, k0 = add(add(kr, [0, 44]), rot([24, 0], a)), k1 = add(add(kr, [0, 44]), rot([80 - i * 6, 0], a)); f.line([k0, k1], 8, '#2e2a26', { straight: true }); f.line([k1, add(k1, rot([0, 14], a)), add(k1, rot([-10, 14], a))], 6, '#2e2a26', { straight: true }); }

  // ---- head: thrown back on a corded neck, the jaw locked open, the eyes burned blank under heavy scorched lids; a
  // long heavy face with a jutting brow, hollow starved cheeks and a broken nose; the hair and beard a crown of standing,
  // singed wire
  f.bone('head');
  const neck = [[836, 790], [790, 710], [770, 620], [800, 570], [880, 620], [930, 710], [960, 790]];
  f.part(neck, BRK());
  W.clipDraw(f, neck, () => {
    f.stroke([[930, 750], [900, 670], [870, 620]], 14, '#000', { op: 0.45 }); f.line([[940, 746], [910, 670], [880, 620]], 4, '#8a7060', { op: 0.45 }); // the sternomastoid stretched by the tilt
    f.stroke([[880, 780], [870, 710], [860, 650]], 8, '#000', { op: 0.35 }); // the windpipe's ridge
    brick(neck, 50, 2, 0.25);
  });
  f.bone('torso'); // the coat's standing collar round the neck's root
  f.part([[800, 790], [860, 756], [940, 762], [984, 810], [940, 840], [870, 830], [816, 850]], COAT({ fill: '#3a2818', maxShade: 16 }));
  f.bone('jaw');
  const jw = hF([[-0.08, 0.2], [0.1, 0.36], [0.26, 0.5], [0.34, 0.62], [0.24, 0.74], [0.04, 0.72], [-0.14, 0.56], [-0.22, 0.34]]);
  f.part(jw, BRK({ fill: '#2a201a', maxShade: 30 }));
  W.clipDraw(f, jw, () => {
    brick(jw, 40, 1.8, 0.22);
    f.flat(hF([[0.1, 0.44], [0.4, 0.44], [0.36, 0.58], [0.12, 0.6]]), '#0a0504'); // the gape running on down to the lower teeth
    for (let i = 0; i < 4; i++) f.flat(hF([[0.17 + i * 0.038, 0.575], [0.2 + i * 0.038, 0.57], [0.2 + i * 0.038, 0.6], [0.17 + i * 0.038, 0.605]]), '#8e806a', { op: 0.9 }); // the lower teeth
    f.stroke(hF([[0.14, 0.62], [0.24, 0.62], [0.34, 0.6]]), 10, '#1a0e0a'); // the lower lip, burnt back
    f.stroke(hF([[0.0, 0.7], [0.2, 0.72], [0.32, 0.66]]), 10, '#000', { op: 0.45 }); f.line(hF([[0.08, 0.64], [0.24, 0.66]]), 4, '#8a7060', { op: 0.4 }); // the chin's underside and its lit point
  });
  f.bone('head');
  B.head(f, HC, HH, hA, { skin: '#463830', jaw: 1.1, chin: 0.04, nose: 1.24, hook: 0.5, mouth: 'set', blind: true, browDown: 0.0, browOut: 0.03, age: true, gaunt: true, faceShade: 0.8, faceHatch: false, jawShade: 0.3, browCol: '#0e0a08', browW: 0.06, hairCol: '#2a221c',
    hair: [[-0.46, 0.06], [-0.48, -0.2], [-0.36, -0.44], [-0.1, -0.56], [0.12, -0.53], [0.26, -0.42], [0.1, -0.42], [-0.06, -0.38], [-0.2, -0.24], [-0.3, 0.02]] });
  const face = hF(W.faceOutline(1.1, 0.04));
  W.clipDraw(f, face, () => {
    V.brickCracks(f, face, E.bbox(face), 44, 2, { glowOp: 0.28, hot: P.arc, skip: 0.45 });
    soft(hF([[0.04, 0.06], [0.22, 0.12], [0.22, 0.34], [0.06, 0.3]]), 0.5); // the cheek's starved hollow
    f.stroke(hF([[0.0, 0.03], [0.14, 0.04], [0.28, 0.08]]), 12, '#8a7060', { op: 0.45 }); // the cheekbone, lit
    // the mouth locked open in a rictus: the lips burned back off the teeth, the gape a dark slot, a dull ember deep in the throat
    f.flat(hF([[0.15, 0.27], [0.34, 0.255], [0.4, 0.46], [0.3, 0.6], [0.12, 0.6], [0.1, 0.42]]), '#0a0504');
    W.glow(f, hF([[0.24, 0.42]])[0], 22, 16, P.ember, 0.16);
    for (let i = 0; i < 5; i++) f.flat(hF([[0.165 + i * 0.034, 0.27], [0.192 + i * 0.034, 0.268], [0.19 + i * 0.034, 0.302 + (i % 2) * 0.01], [0.168 + i * 0.034, 0.304]]), i === 2 ? '#3a2e26' : '#8e806a', { op: 0.9 }); // the upper teeth, sooted, one gone
    f.stroke(hF([[0.13, 0.27], [0.24, 0.245], [0.36, 0.25]]), 9, '#1a0e0a', { op: 0.9 }); // the burnt upper lip, shrunk back
    // the eyes burned blank: deep sockets under the brow shelf, the lids scorched and swollen half shut over a dull grey glaze
    f.flat(hF([[0.02, -0.1], [0.12, -0.13], [0.22, -0.1], [0.22, -0.03], [0.12, -0.01], [0.03, -0.04]]), '#050302', { op: 0.8 });
    f.flat(hF([[0.07, -0.055], [0.13, -0.07], [0.19, -0.055], [0.13, -0.045]]), '#5e5850', { op: 0.7 });
    f.stroke(hF([[0.02, -0.07], [0.12, -0.095], [0.22, -0.065]]), 14, '#24160e'); f.line(hF([[0.04, -0.09], [0.12, -0.11], [0.2, -0.09]]), 3, '#8a7060', { op: 0.5 }); // the scorched upper lid, swollen
    f.stroke(hF([[0.05, -0.03], [0.13, -0.02], [0.2, -0.04]]), 8, '#1e120c', { op: 0.9 }); // the lower lid, puffed
    f.flat(hF([[0.27, -0.1], [0.32, -0.11], [0.33, -0.03], [0.28, -0.02]]), '#050302', { op: 0.8 }); f.flat(hF([[0.29, -0.06], [0.32, -0.065], [0.32, -0.05], [0.29, -0.048]]), '#5e5850', { op: 0.6 });
    soft(hF([[0.06, 0.32], [0.16, 0.36], [0.12, 0.52], [0.0, 0.5]]), 0.4); f.stroke(hF([[-0.08, 0.2], [-0.02, 0.36], [0.06, 0.5]]), 10, '#8a7060', { op: 0.35 }); // the masseter clenched, the jaw's corner lit
    soft(hF([[-0.08, -0.24], [0.02, -0.2], [0.0, -0.1], [-0.1, -0.12]]), 0.4); // the temple's hollow
    f.stroke(hF([[-0.02, -0.15], [0.16, -0.19], [0.36, -0.14]]), 18, '#000', { op: 0.45 }); f.line(hF([[0.0, -0.2], [0.18, -0.24], [0.36, -0.19]]), 6, '#9a8270', { op: 0.55 }); // the jutting brow shelf, lit along its crest
    f.stroke(hF([[0.3, -0.06], [0.33, 0.02], [0.36, 0.1]]), 6, '#000', { op: 0.35 }); f.line(hF([[0.33, -0.02], [0.36, 0.06]]), 3, '#9a8270', { op: 0.5 }); // the bridge, knocked aside
    fern(face, hF([[-0.1, 0.36]])[0], hA - 1.2, 260, 4.4, 3); // the burn climbing the jaw from the throat
    f.line(hF([[0.04, -0.3], [0.2, -0.32]]), 3, '#000', { op: 0.5 }); f.line(hF([[0.06, -0.36], [0.18, -0.38]]), 2.4, '#000', { op: 0.4 }); // the forehead's lines
  });
  // the beard stood up off the jaw and the hair a crown of standing wire, singed: clumped locks, kinked, the tips
  // burned black or still glowing
  const lockH = (base, a, l, w, col, tip) => {
    const bend = W.R(f, -0.4, 0.4), pts = [0, 0.33, 0.66, 1].map(t => add(base, rot([l * t, 0], a + bend * t + Math.sin(t * 9) * 0.05)));
    f.stroke(pts, w + 3, INK, { op: 0.7 }); f.stroke(pts, w, col);
    for (let k = 0; k < 3; k++) { const off = (k - 1) * w * 0.25; f.line(pts.slice(0, 3 + (k % 2)).map((q, i) => add(q, rot([0, off * (1 + i * 0.3)], a))), 1.4, k === 1 ? '#a8988a' : '#0a0605', { op: 0.6 }); }
    if (tip) f.stroke([pts[2], pts[3]], w * 0.6, tip, { op: 0.9 });
  };
  for (let i = 0; i < 14; i++) { const t = i / 13, b0 = hF([[-0.1 + t * 0.42, 0.56 + Math.sin(t * Math.PI) * 0.14]])[0]; lockH(b0, -1.25 + t * 0.7 + W.R(f, -0.15, 0.15), W.R(f, 90, 150), W.R(f, 12, 18), i % 3 ? '#4a3e34' : '#6a5a4c', i % 4 ? '#0a0605' : P.lamp); } // the beard standing out from the jaw toward the sky
  for (let i = 0; i < 32; i++) { const t = i / 31, a = Math.PI * (0.95 + t * 0.72), b0 = hF([[-0.08 + Math.cos(a) * 0.36, -0.1 + Math.sin(a) * 0.44]])[0]; lockH(b0, -Math.PI / 2 - 0.55 + t * 1.0 + W.R(f, -0.15, 0.15), W.R(f, 170, 280), W.R(f, 14, 20), i % 3 ? '#4a3e34' : '#6a5a4c', i % 4 ? '#0a0605' : P.lamp); }
  W.ash(f, hF([[0, -0.9]])[0], 18, 220, 300, 2.4);

  // ---- near cable and near arm, raised up and back; copper wire wound round the upper arm; the seal ring
  cable(WN, 'cable_n');
  const gN = arm(SN, EN, WN, '_n', false, -1);
  f.bone('upperarm_n');
  for (let i = 0; i < 9; i++) { const t = 0.5 + i * 0.03, pts = [lp(SN, EN, t, -86), lp(SN, EN, t + 0.015, 0), lp(SN, EN, t, 84)]; f.line(pts, 10, INK); f.line(pts, 6.4, P.copper); f.line(pts.map(q => add(q, [1, -2])), 2.2, P.copperL, { op: 0.6 }); } // copper wire wound round
  f.bone('hand_n');
  const ringP = gN.F([[0.26, 0.6]])[0]; f.part(ell(ringP, 17, 11, 0.3, 10), W.BR(f, { fill: '#a07440', inkW: 1.6, cast: false })); f.flat(ell(ringP, 7, 5, 0.3, 8), '#2a1a0c'); // the guild seal ring
  // the coat's sleeves: leather over the upper arms, pulled up toward the armpit by the raised arm, burnt off above the
  // elbow in a ragged, glowing edge; on the torso over the shoulder, so they stay put as the arm heaves
  f.bone('torso');
  sleeve(SN, EN, 214, false);
  return f;
}

// ------------------------------------------------------------------ THE CRUCIBLE (ruler 4)
// The foundry's great crucible, hung from the casting crane over the bell pit, and the three pourers who tipped it. A
// fireclay pot the size of a house, banded with iron, hangs tilted from the crane's chains, lip down toward the company;
// the crane, its hook and the chains run up out of frame (the frame crops them, as the bible says). A heavy rope of
// molten bronze falls from the lip into the clay runner cup of the half-cast bell in the pit below. Fire dominates: the
// clay is white-hot at the base and cracked into a net of glowing seams, blackened and flaking higher up, bronze slopping
// over the lip and frozen down the side like candle wax. Lightning has fused the iron bands and chains into one welded
// mass, the links set rigid so the pot can never be righted, Lichtenberg scorch trees climbing the clay from every band.
// The three pourers hang from the long iron tipping bar, charred black, their gauntleted hands welded to the iron, ferns
// up their arms, hair standing stiff, legs dangling over the pit's edge.
// Rig (follows the Motion line): swing (the hang, pivot at the crane hook above the frame) > pot > bar > pourer_1..3 (pivot
// at their welded hands) > legs_1..3 (pivot at the hips) and bucket; pour (pot, pivot at the lip); chains (swing). The
// pit, the bell's crown, the runner cup and the ladder are on root. Motion: idle a slow swing on the chains (swing), the
// pour stretching (pour), the pourers' legs dangling; attack the crucible tipping further (pot) with a wave of bronze
// over the front ranks (FX) and sparks cracking down the stream.
function crucible() {
  const seed = 520, CW = 2300, CH = 2200, f = new Fig(W.base(seed, CH, { grimeY: 1900 }));
  W.textures(f);
  const gy = f.o.groundY;
  // the pot: a cast fireclay crucible lying tipped on its trunnions, the mouth turned down to the right. Local u runs
  // along its axis from the base (0) to the mouth (1030); v across it, +v the lower side, -v the upper side (to the
  // key light). Cross-sections are circles seen a little end-on (ellipses with e = 0.28), so bands and the rim curve.
  const B0 = [1100, 300], pA = 0.9, pF = frame(B0, pA, 1), e = 0.28;
  const prof = [[0, 430], [60, 500], [200, 556], [420, 580], [650, 566], [850, 540], [960, 548], [1000, 576], [1030, 580]];
  const r = u => { for (let i = 1; i < prof.length; i++) if (u <= prof[i][0]) { const [u0, r0] = prof[i - 1], [u1, r1] = prof[i]; return r0 + (r1 - r0) * (u - u0) / (u1 - u0); } return prof[prof.length - 1][1]; };
  const ring = (u, t0 = -90, t1 = 90, n = 18, k = 1) => { const R = r(u) * k, out = []; for (let i = 0; i <= n; i++) { const t = (t0 + (t1 - t0) * i / n) * Math.PI / 180; out.push(pF([[u + e * R * Math.cos(t), R * Math.sin(t)]])[0]); } return out; };
  const CLAY = (o = {}) => Object.assign({ fill: '#352822', shadow: '#0a0605', light: '#8a6e5a', shade: 0.42, maxShade: 90, tex: 'craze' + seed, texOp: 0.5 }, o);
  const soft = (pts, op = 0.45, col = '#000', big = false) => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'smk'}${seed})"/>`);
  const MU = 1030, mouthC = pF([[MU, 0]])[0], spout = pF([[MU + 40, r(MU) + 90]])[0];
  const TR = pF([[500, 0]])[0], hook = [1500, -900];
  const barRoot = pF([[40, r(40) + 10]])[0], barEnd = [40, 590];
  f.joint('swing', hook, null).joint('pot', TR, 'swing').joint('bar', barRoot, 'pot').joint('pour', spout, 'pot').joint('chains', hook, 'swing');
  const PX = [160, 400, 630].map(x => [x, lerp(barEnd, barRoot, (x - barEnd[0]) / (barRoot[0] - barEnd[0]))[1]]);
  PX.forEach((h, i) => f.joint(`pourer_${i + 1}`, h, 'bar').joint(`legs_${i + 1}`, add(h, [0, 548 * [1, 0.96, 1.04][i]]), `pourer_${i + 1}`));
  f.joint('bucket', lerp(barEnd, barRoot, 0.86), 'bar');

  // ================= root: the floor and the bell pit, the half-cast bell's crown and its runner cup, the ladder, the
  // fallen clog
  f.bone('root');
  f.part([[0, gy - 8], [CW, gy - 8], [CW, gy + 30], [0, gy + 30]], { fill: '#2a2420', shadow: '#0a0806', shade: 0.3, tex: 'pit' + seed, texOp: 0.6, cast: false });
  f.flat([[420, gy - 4, 1], [520, gy - 34], [900, gy - 50], [1700, gy - 52], [2200, gy - 36], [CW, gy - 30], [CW, gy, 1]], '#0a0605'); // the pit's mouth
  const rc = [1290, gy - 120];
  const crown = [[1030, gy - 20], [1060, gy - 60], [1140, gy - 80], [1290, gy - 94], [1440, gy - 80], [1520, gy - 60], [1550, gy - 20]];
  f.part(crown, CLAY({ fill: '#4a3a30', maxShade: 40 }));
  W.clipDraw(f, crown, () => {
    V.charCracks(f, crown, [1290, gy - 50], 180, 30, 5, 90, 2.4);
    f.part([[1150, gy - 74], [1290, gy - 90], [1430, gy - 74], [1400, gy - 50], [1180, gy - 50]], W.BR(f, { fill: '#a07440' })); // the bronze crown of the bell, where the pour has filled the mould
    W.lichtenberg(f, [1480, gy - 40], -2.6, 140, 3, { col: '#0a0605', depth: 2 });
  });
  f.part([add(rc, [-90, -40]), add(rc, [90, -46]), add(rc, [54, 40]), add(rc, [-54, 40])], CLAY({ fill: '#5a4434', maxShade: 20 })); // the clay runner cup
  f.flat(ell(add(rc, [0, -42]), 84, 16, 0, 16), P.ember); f.flat(ell(add(rc, [0, -42]), 64, 11, 0, 16), P.lamp); f.flat(ell(add(rc, [0, -42]), 30, 6, 0, 12), P.hot);
  W.glow(f, add(rc, [0, -40]), 220, 90, P.lamp, 0.5, true);
  const la = [[250, gy - 6], [380, 1640]], lb = [[330, gy - 6], [452, 1650]]; // the broken ladder against the pit's edge
  for (const [p0, p1] of [la, lb]) f.part(limb(p0, p1, 26, 22, { steps: 4, capK: 0.3 }), { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.4, maxShade: 12, tex: 'wood' + seed, texOp: 0.6 });
  for (let i = 1; i < 8; i++) { if (i === 5) continue; const t = i / 8; f.line([lerp(la[0], la[1], t), lerp(lb[0], lb[1], t)], 13, INK); f.line([lerp(la[0], la[1], t), lerp(lb[0], lb[1], t)], 9, P.woodL); }
  f.line([lerp(la[0], la[1], 5 / 8), add(lerp(la[0], la[1], 5 / 8), [22, 16])], 9, P.woodL); f.line([lerp(lb[0], lb[1], 5 / 8), add(lerp(lb[0], lb[1], 5 / 8), [-18, 20])], 9, P.woodL);
  W.scorch(f, [400, 1740], 50, 80, 0.6);
  f.part([[100, gy - 44], [168, gy - 54], [194, gy - 32], [178, gy - 10], [100, gy - 12]], { fill: '#5a4028', shade: 0.4, tex: 'wood' + seed, inkW: 1.6 }); f.flat(ell([132, gy - 40], 22, 7, -0.1, 10), '#1a120a'); // the clog fallen from a pourer
  f.flat(ell([1100, gy + 4], 900, 16, 0, 20), '#000', { op: 0.3 });

  // ================= the chains and the bail: an iron bail pinned on the trunnion runs up to the crane hook out of
  // frame; lightning has welded every link into the next and the bail to the bands, so the pot can never be righted
  f.bone('chains');
  const bailTop = [TR[0] + 40, -40];
  for (const [dx, col] of [[-60, P.iron], [56, P.ironL]]) {
    const a0 = add(bailTop, [dx, 0]), a1 = add(hook, [dx * 0.3, 0]);
    W.chainLinks(f, [add(a0, [0, 30]), a1], 60, col);
  }
  f.bone('pot');

  // ================= the pot
  const top = prof.map(([u]) => pF([[u, -r(u)]])[0]), bot = prof.map(([u]) => pF([[u, r(u)]])[0]);
  const baseCap = ring(0, 90, 270, 16).slice(1, -1), rimOut = ring(MU, -90, 90, 20, 1.06);
  const pot = [...top, ...rimOut, ...bot.slice().reverse(), ...baseCap.slice().reverse().reverse()];
  const potD = f.part(pot, CLAY());
  W.clipDraw(f, pot, () => {
    // the clay hot from inside along the lower side where the bronze lies, white-hot near the mouth; blackened above
    soft(pF([[100, 300], [500, 420], [960, 440], [980, 620], [500, 640], [80, 520]]), 0.6, P.lamp, true);
    soft(pF([[500, 470], [940, 480], [960, 600], [600, 620]]), 0.6, P.hot, true);
    soft(pF([[0, -440], [500, -600], [1000, -560], [900, -250], [400, -250], [0, -200]]), 0.55, '#000', true); // the charred upper flank
    soft(pF([[120, -420], [600, -540], [880, -500], [700, -420], [200, -360]]), 0.3, '#a8907a'); // the key light's sheen on the black clay
    soft(pF([[-40, 0], [20, -300], [80, 0], [20, 300]]), 0.4); // the base turning away
    // the crack net: big hot cells low on the belly, finer and duller higher up
    V.brickCracks(f, pot, E.bbox(pF([[0, 160], [1000, 640]])), 84, 3.6, { glowOp: 0.4, hot: P.core, skip: 0.2 });
    V.charCracks(f, pot, pF([[500, -150]])[0], 380, 260, 7, 140, 2.6, { depth: 2 });
    for (let i = 0; i < 60; i++) { const q = pF([[W.R(f, 40, 980), W.R(f, -560, -60)]])[0]; W.flakes(f, q, 8, 8, 1, 2.4); } // scale and flaking char
    for (let i = 0; i < 14; i++) { const q = pF([[W.R(f, 60, 960), W.R(f, -520, 200)]])[0], rr = W.R(f, 14, 30); f.flat(W.lumpy(f, ell(q, rr * 1.4, rr, pA, 9), rr * 0.4), '#1a120c', { op: 0.6 }); f.line(ell(q, rr * 1.4, rr, pA, 9).slice(5, 9), 2, '#a08a74', { op: 0.5 }); } // scabs of scale lifting off
    // cylinder modelling: lines of the throw running round the pot
    for (const u of [100, 300, 560, 800]) f.line(ring(u, -80, 80, 16, 0.995), 2, '#000', { op: 0.3 });
  });
  W.bevel(f, potD, E.bbox(pot), 14, { lite: '#b08a6a', liteOp: 0.25, lite2: '#d8b89a', lite2Op: 0.3, darkOp: 0.35 });
  // the iron bands round the pot: curved straps with rolled edges, riveted, sheeted in red-brown scale; each fused to the
  // next by the strike, scorch trees climbing the clay from them
  for (const [u, w] of [[90, 56], [330, 60], [700, 60], [930, 54]]) {
    const outer = ring(u - w / 2, -92, 92, 20, 1.025), inner = ring(u + w / 2, 92, -92, 20, 1.025);
    const band = [...outer, ...inner];
    const bd = f.part(band, W.IR(f, { fill: '#2e2a26', inkW: 2.6, maxShade: 20 })); W.bevel(f, bd, E.bbox(band), 6, { lite: '#9a948a', lite2: '#c8c2b4' });
    W.clipDraw(f, band, () => { for (let i = 0; i < 8; i++) { const q = lerp(outer[Math.floor(f.r() * 20)], inner[Math.floor(f.r() * 20)], 0.5); f.flat(W.lumpy(f, ell(q, 16, 10, pA, 8), 4), P.rust, { op: 0.5 }); } });
    const mid = ring(u, -80, 80, 9, 1.03);
    mid.forEach((q, i) => { if (i % 2 === 0) { if (f.r() < 0.3) { f.flat(ell(q, 10, 9, 0, 8), P.ironD); f.flat(ell(add(q, [0, 14]), 5, 12, 0, 8), '#3a3632'); } else f.rivet(q, 9, P.ironL); } });
    for (const t of [-50, 10, 60]) V.lich(f, pot, ring(u + w / 2 + 4, t, t + 1, 1)[0], pA + W.R(f, -0.5, 0.5), 230, 4, { depth: 3, col: '#0a0605' });
  }
  // the welds where the strike fused band to band and band to bail
  for (const t of [-30, 40]) W.weld(f, [ring(118, t, t, 1)[0], ring(300, t, t, 1)[0]], 9, { lich: false });
  // the trunnion: a riveted boss on the pot's side, the pin it was tipped on; the bail's eye over it
  const tpl = ring(500, -60, 60, 10, 0.5).concat(ring(500, 60, -60, 10, 0.18));
  const tpd = f.part(ell(TR, 150, 130, pA, 20), W.IR(f, { fill: '#2e2a26', inkW: 2.6 })); W.bevel(f, tpd, E.bbox(ell(TR, 150, 130, pA, 20)), 7, { lite: '#8a847a' });
  for (let i = 0; i < 8; i++) f.rivet(add(TR, rot([118, 0], i * Math.PI / 4)), 10, P.ironL);
  f.part(ell(TR, 84, 84, 0, 20), W.IR(f, { fill: '#3a3632', inkW: 2.6 })); f.part(ell(TR, 46, 46, 0, 14), W.IR(f, { fill: P.ironL, inkW: 2 })); f.flat(ell(TR, 14, 14, 0, 10), '#0a0806');
  // the bail arm from the trunnion up to the chains, welded to the boss
  f.bone('chains');
  const bail = [add(TR, [-46, -40]), add(TR, [46, -40]), add(bailTop, [50, 0]), add(bailTop, [-50, 0])].map(q => [q[0], q[1], 1]);
  const bld = f.part(bail, W.IR(f, { fill: '#34302c', inkW: 2.6 })); W.bevel(f, bld, E.bbox(bail), 6, { lite: '#8a847a' });
  W.clipDraw(f, bail, () => { W.lichtenberg(f, add(TR, [0, -60]), -Math.PI / 2, 600, 3.4, { metal: true, depth: 2 }); f.line([add(TR, [-10, -80]), add(bailTop, [-10, 0])], 3, P.arcG, { op: 0.4 }); });
  for (let y = TR[1] - 140; y > 0; y -= 150) f.rivet([TR[0] + (bailTop[0] - TR[0]) * (TR[1] - y) / TR[1], y], 9, P.ironL);
  W.weld(f, [add(TR, [-80, -70]), add(TR, [0, -96]), add(TR, [80, -70])], 13, { a: -1.6 });
  W.sparks(f, add(TR, [0, -220]), 10, 80, { spread: 3, s: 1.6 });
  f.bone('pot');
  // the guild's mark stamped on the upper band; the chalk tally of pours; a hammer wedged under a band
  const gm = ring(330, -55, -55, 1, 1.03)[0]; K.ring(f, gm, 26, 20, 4.4, '#a8a294'); f.stroke([add(gm, [-12, 9]), add(gm, [10, -10])], 5, '#a8a294'); f.stroke([add(gm, [2, -16]), add(gm, [16, -2])], 6, '#a8a294');
  for (let i = 0; i < 8; i++) { const q = ring(700, -60 + i * 5, -60 + i * 5, 1, 1.03)[0]; f.line([add(q, rot([-16, 0], pA)), add(q, rot([16, 0], pA))], 3.4, '#d8d0c0', { op: 0.85 }); } f.line([ring(700, -62, -62, 1, 1.03)[0], ring(700, -22, -22, 1, 1.03)[0]], 3, '#d8d0c0', { op: 0.85 }); // the chalk tally on the band
  const hm = ring(930, 10, 10, 1, 1.03)[0], hmA = pA + Math.PI / 2 + 0.3;
  f.part(limb(hm, add(hm, rot([220, 0], hmA)), 22, 20, { steps: 4 }), { fill: P.wood, shadow: P.woodD, shade: 0.4, tex: 'wood' + seed, inkW: 1.8 });
  f.part([add(hm, rot([-14, -48], hmA)), add(hm, rot([34, -48], hmA)), add(hm, rot([34, 48], hmA)), add(hm, rot([-14, 48], hmA))].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 2 }));
  // frozen slag and bronze run down the side from the rim like candle wax, hanging plumb
  for (const t of [20, 38, 54, 70]) { const st = ring(MU - 10, t, t, 1, 1.0)[0]; for (let k = 0; k < 2; k++) { const s0 = add(st, [k * 22 - 10, 0]); W.fusedRun(f, s0, W.R(f, 110, 260), 18 - k * 4, { col: k ? '#3a3632' : P.bronzeD }); } }

  // ================= the mouth: the rolled lip, the interior's dark wall, the molten bronze lying in the lower lip
  // with its crust, slopping over the spout; the skimming rod hooked over the rim
  const rimIn = ring(MU + 6, -90, 270, 36, 0.86);
  f.part(ring(MU, -90, 270, 36, 1.06), CLAY({ fill: '#2a1e18', maxShade: 30, inkW: 3 }));
  f.flat(rimIn, '#0c0806');
  W.clipDraw(f, rimIn, () => {
    const pool = [pF([[MU - 80, 120]])[0], ...ring(MU + 6, 30, 160, 12, 0.86), pF([[MU - 60, 380]])[0]];
    f.flat(pool, P.ember); soft(pF([[MU - 40, 220], [MU + 120, 300], [MU + 80, 460], [MU - 60, 380]]), 0.8, P.hot);
    for (let i = 0; i < 4; i++) { const q = pF([[MU + W.R(f, -20, 90), 220 + i * 55]])[0], d = rot([1, 0], pA + 1.57 + W.R(f, -0.2, 0.2)); f.stroke([add(q, mul(d, -50)), add(q, mul(d, -10)), add(q, mul(d, 40))], 7, '#7a3a16', { op: 0.55 }); f.line([add(q, mul(d, -46)), add(q, mul(d, 36))].map(z => add(z, [2, -4])), 1.6, P.core, { op: 0.6 }); } // the skin wrinkling on the melt as it slides to the spout
    W.glow(f, pF([[MU + 40, 300]])[0], 160, 120, P.lampL, 0.5);
    soft(pF([[MU - 120, -100], [MU + 40, -200], [MU + 160, 60], [MU + 40, 200], [MU - 100, 140]]), 0.35, P.ember, true); // the inner wall lit by the melt
    for (let i = 0; i < 5; i++) { const q = pF([[MU + W.R(f, -60, 120), W.R(f, -380, 80)]])[0]; f.line([q, add(q, rot([W.R(f, 30, 70), 0], pA + W.R(f, -0.4, 0.4)))], 2, P.lamp, { op: 0.4 }); } // glowing cracks in the inner wall
  });
  W.clipDraw(f, ring(MU, -90, 270, 36, 1.06), () => { W.charCracks ? 0 : 0; V.charCracks(f, ring(MU, -90, 270, 36, 1.06), pF([[MU + 60, -300]])[0], 60, 200, 4, 60, 2); W.scorch(f, pF([[MU + 100, -200]])[0], 60, 140, 0.5); });
  f.line(ring(MU, -90, 90, 20, 1.0), 6, '#9a7e68', { op: 0.45 }); // the lip's rolled edge, lit
  // the spout: a lip pulled out at the lowest point of the rim, the bronze slopping over it
  const sp = [pF([[MU - 30, r(MU) - 40]])[0], pF([[MU + 90, r(MU) - 30]])[0], spout, pF([[MU - 20, r(MU) + 70]])[0]];
  f.part(sp, CLAY({ fill: '#2e2018', maxShade: 16, inkW: 2.4 }));
  f.stroke([pF([[MU + 20, r(MU) - 20]])[0], pF([[MU + 50, r(MU) + 40]])[0], spout], 46, P.lamp); f.stroke([pF([[MU + 20, r(MU) - 20]])[0], pF([[MU + 50, r(MU) + 40]])[0], spout], 20, P.hot);
  W.glow(f, spout, 120, 90, P.lampL, 0.5);
  const sk0 = pF([[MU + 30, -360]])[0], skH = pF([[MU - 40, -380]])[0], sk1 = pF([[300, -700]])[0];
  f.stroke([sk1, skH, sk0, pF([[MU + 10, -300]])[0]], 16, INK); f.stroke([sk1, skH, sk0, pF([[MU + 10, -300]])[0]], 10, P.iron); f.line([sk1, skH].map(q => add(q, [3, -3])), 2.4, P.ironL, { op: 0.6 }); // the skimming rod hooked over the rim

  // ================= the pour: a heavy rope of molten bronze falling from the spout into the runner cup: a bright
  // core, a darker skin crusting into plates that tear and fold as it falls, drips spinning off it
  f.bone('pour');
  const pr = W.spline([spout, add(spout, [26, 60]), add(spout, [44, 200]), [rc[0] - 10, 1820], [rc[0], 1960], add(rc, [0, -40])], 6), prS = W.arcLen(pr), prL = prS[prS.length - 1];
  const wAt = t => 120 - t * 52 + Math.sin(t * 19) * 7;
  const step = 3, sP = pr.filter((_, i) => i % step === 0).concat([pr[pr.length - 1]]), sW = sP.map((_, i, a) => wAt(i / (a.length - 1)));
  f.raw(`<path d="${E.smooth(pr, false)}" fill="none" stroke="${P.lamp}" stroke-width="240" opacity="0.32" filter="url(#glowL${seed})"/>`);
  const stream = K.chain(sP, sW);
  f.part(stream, { fill: P.lampL, shadow: P.ember, light: P.core, shade: 0.4, maxShade: 26, inkW: 2.4, cast: false, hatch: false, gritOp: 0.06 });
  W.clipDraw(f, stream, () => {
    // the skin: dark crust plates torn apart by the fall, the melt showing white-gold in the tears
    for (let i = 0; i < 30; i++) {
      const t = W.R(f, 0.02, 0.97), q = W.at(pr, prS, prL * t), w = wAt(t), off = W.R(f, -0.55, 0.5) * w, c = add(q.p, mul(q.n, off)), L = W.R(f, 24, 60), Wd = W.R(f, 10, 26) * (1 - Math.abs(off) / w);
      const pl = W.lumpy(f, [add(c, mul(q.d, -L / 2)), add(add(c, mul(q.n, Wd / 2)), mul(q.d, -L / 6)), add(c, mul(q.d, L / 2)), add(add(c, mul(q.n, -Wd / 2)), mul(q.d, L / 6))], 5);
      f.flat(pl, f.r() < 0.5 ? '#7a3a16' : '#4a2410', { op: 0.75 }); f.line(pl.slice(0, 3), 1.4, P.hot, { op: 0.7 });
    }
    // the hot core, offset to the lit side, twisting; the folds of the skin across it
    f.line(pr.map((q, i) => { const a = W.at(pr, prS, prS[i]); return add(q, mul(a.n, -wAt(prS[i] / prL) * 0.18 + Math.sin(i * 0.2) * 6)); }), 18, P.hot, { op: 0.9 });
    f.line(pr.map((q, i) => { const a = W.at(pr, prS, prS[i]); return add(q, mul(a.n, -wAt(prS[i] / prL) * 0.2 + Math.sin(i * 0.2) * 6)); }), 7, P.core);
    for (let i = 0; i < 9; i++) { const t = 0.06 + i * 0.1, q = W.at(pr, prS, prL * t), w = wAt(t); f.line([add(q.p, mul(q.n, w * 0.5)), add(add(q.p, mul(q.n, w * 0.3)), mul(q.d, 14)), add(add(q.p, mul(q.n, w * 0.12)), mul(q.d, 20))], 2.4, P.ember, { op: 0.6 }); } // the skin folding at the shadow edge
  });
  // drips spinning off the stream's edges and falling from the spout's underside
  for (let i = 0; i < 14; i++) { const t = W.R(f, 0.1, 0.85), q = W.at(pr, prS, prL * t), sd = f.r() < 0.5 ? 1 : -1, p0 = add(q.p, mul(q.n, sd * (wAt(t) * 0.5 + W.R(f, 10, 60)))); W.drip(f, p0, W.R(f, 1.4, 2.6), f.r() < 0.5 ? P.lampL : P.hot); }
  for (let i = 0; i < 3; i++) W.drip(f, add(spout, [-30 - i * 24, 40 + i * 30]), 2.6, P.lampL);
  for (let i = 0; i < 4; i++) W.sparks(f, W.at(pr, prS, prL * (0.25 + i * 0.18)).p, 9, 80, { spread: 6.2, s: 1.8 });
  W.sparks(f, add(rc, [0, -50]), 22, 150, { spread: 2.6, s: 2 }); // spitting where it goes in
  W.smoke(f, add(rc, [80, -80]), 460, 110, { sway: 50, drift: 80, op: 0.3, phase: 2 });

  // ================= the tipping bar: a long square iron bar out from the pot's base, its socket riveted to the band
  f.bone('bar');
  const bd2 = [add(barRoot, [30, -26]), add(barEnd, [0, -22]), add(barEnd, [0, 22]), add(barRoot, [30, 26])].map(q => [q[0], q[1], 1]);
  const bdd = f.part(bd2, W.IR(f, { fill: '#34302c', inkW: 2.6 })); W.bevel(f, bdd, E.bbox(bd2), 5, { lite: '#8a847a' });
  W.clipDraw(f, bd2, () => W.lichtenberg(f, barRoot, ang(barRoot, barEnd), 700, 3, { metal: true, depth: 2 }));
  f.part([add(barRoot, [-50, -60]), add(barRoot, [60, -66]), add(barRoot, [64, 60]), add(barRoot, [-46, 60])].map(q => [q[0], q[1], 1]), W.IR(f, { inkW: 2.4 }));
  for (const q of [add(barRoot, [-24, -34]), add(barRoot, [36, 34]), add(barRoot, [36, -36])]) f.rivet(q, 9, P.ironL);
  f.part([add(barEnd, [-14, -30]), add(barEnd, [10, -30]), add(barEnd, [10, 30]), add(barEnd, [-14, 30])].map(q => [q[0], q[1], 1]), W.IR(f, { fill: '#2a2622', inkW: 2 })); // the bar's end, upset by hammering
  f.bone('bucket'); // the leather water bucket on its chain, steaming
  const bk = lerp(barEnd, barRoot, 0.86), bkc = add(bk, [0, 240]);
  W.chainLinks(f, [add(bk, [0, 20]), add(bkc, [0, -70])], 20, P.iron);
  const bkt = [add(bkc, [-64, -70]), add(bkc, [64, -70]), add(bkc, [52, 70]), add(bkc, [-52, 70])];
  f.part(bkt, W.LEA(f, { fill: '#4a3220', maxShade: 24 }));
  W.clipDraw(f, bkt, () => { f.line([add(bkc, [-62, -34]), add(bkc, [62, -34])], 5, '#2a1a0c'); f.line([add(bkc, [-56, 30]), add(bkc, [56, 30])], 5, '#2a1a0c'); W.scorch(f, add(bkc, [10, 20]), 40, 30, 0.6); f.stitches([add(bkc, [-30, -66]), add(bkc, [-24, 66])], '#a08a6a', 1.4); });
  f.flat(ell(add(bkc, [0, -70]), 64, 13, 0, 14), '#1a120a');
  W.smoke(f, add(bkc, [0, -80]), 260, 60, { sway: 20, op: 0.3, col: '#8a8076' });

  // ================= the three pourers: men charred black, hanging dead from the bar by their welded gauntlets: the
  // shoulders hauled up round the ears, the arms all but straight, the ribs standing on the stretched trunk, the head
  // slumped forward between the arms, the legs hanging plumb with their weight, toes down
  const pourer = (h, i) => {
    const s = [1, 0.96, 1.04][i], sway = [0.03, -0.04, 0.0][i], F = frame(h, sway, s), Q = (x, y) => F([[x, y]])[0];
    const CH0 = ['#2e2420', '#34281e', '#2a2220'][i], CHR = (o = {}) => V.CHAR(f, Object.assign({ fill: CH0, light: '#7a6252', shadow: '#0a0605', maxShade: 22 }, o));
    const FAR = { fill: mix(CH0, '#000', 0.35), light: '#4a3a30' };
    const hnd = { f: Q(30, 0), n: Q(-34, 2) }, wr = { f: Q(28, 44), n: Q(-34, 46) }, el = { f: Q(48, 156), n: Q(-58, 160) }, sh = { f: Q(42, 286), n: Q(-52, 294) };
    const Pv0 = Q(4, 548), HC0 = Q(22, 304), hT = [1.15, 1.35, 1.0][i];
    const LG = [{ n: [[-22, 552], [-14, 716], [-24, 872]], f: [[26, 548], [44, 708], [36, 864]] }, { n: [[-22, 552], [-2, 714], [-10, 870]], f: [[26, 548], [30, 710], [20, 866]] }, { n: [[-22, 552], [-26, 716], [-34, 872]], f: [[26, 548], [52, 704], [50, 860]] }][i];
    // ---- legs
    f.bone(`legs_${i + 1}`);
    for (const k of ['f', 'n']) {
      const [hp, kn, an] = LG[k].map(([x, y]) => Q(x, y)), far = k === 'f', look = CHR(far ? FAR : {});
      const lg = K.chain([hp, lerp(hp, kn, 0.45), kn, lerp(kn, an, 0.35), an], [84 * s, 70 * s, 48 * s, 58 * s, 30 * s], { steps: 5, bp: [[0, 0.2, 0.12, 0.3], [3, 0.1, 0.2, 0.3]], bq: [[0, 0.5, 0.1, 0.3], [2, 0.5, -0.08, 0.2], [3, 0.6, -0.1, 0.3]] });
      f.part(lg, look);
      W.clipDraw(f, lg, () => { soft([lp(hp, kn, 0, 20), lp(hp, an, 1, 10), lp(hp, an, 1, 30), lp(hp, kn, 0, 40)], 0.45); f.line([lp(kn, an, 0.1, -12), lp(kn, an, 0.8, -8)], 2.4, '#8a7060', { op: far ? 0.1 : 0.45 }); V.charCracks(f, lg, lerp(kn, an, 0.3), 12, 60, 2, 40, 1.4, { a: Math.PI / 2 }); });
      f.part(ell(add(kn, [2, -4]), 18 * s, 15 * s, 0, 10), Object.assign({}, look, { cast: false, inkW: 1, inkHeavy: 0 })); // the kneecap
      // the foot hanging toes down: the heel up behind, the instep, the toes; a clog on two of them
      const ft = [add(an, [-14 * s, -10]), add(an, [16 * s, -12]), add(an, [26 * s, 34 * s]), add(an, [22 * s, 62 * s]), add(an, [8 * s, 76 * s]), add(an, [-6 * s, 58 * s]), add(an, [-20 * s, 18 * s])];
      const bare = i === 0 && !far;
      if (bare) { f.part(ft, CHR()); for (let q = 0; q < 4; q++) f.line([add(an, [2 + q * 5, 58 * s]), add(an, [4 + q * 5, 72 * s])], 1.2, INK, { op: 0.6 }); f.line([add(an, [-16, 0]), add(an, [-18, 22])], 1.6, '#8a7060', { op: 0.4 }); }
      else { f.part(ft, { fill: far ? '#3a2a1a' : '#5a4028', shade: 0.4, tex: 'wood' + seed, texOp: 0.5, inkW: 1.6 }); f.line([add(an, [-12, 4]), add(an, [18, 2])], 3, '#2a1a0c'); }
    }
    // ---- the far arm, the head, the trunk, the near arm
    f.bone(`pourer_${i + 1}`);
    const arm = (S0, E0, W0, far) => {
      const look = CHR(far ? FAR : {});
      const ao = K.chain([S0, lerp(S0, E0, 0.45), E0, lerp(E0, W0, 0.35), W0], [70 * s, 58 * s, 40 * s, 52 * s, 32 * s], { steps: 5, bp: [[0, 0.15, 0.14, 0.25], [1, 0.3, 0.08, 0.3], [3, 0.0, 0.16, 0.3]], bq: [[0, 0.45, 0.12, 0.3], [2, 0.6, -0.08, 0.2]] });
      f.part(ao, look);
      W.clipDraw(f, ao, () => {
        soft([lp(S0, E0, 0.1, 18 * s), lp(S0, W0, 0.9, 14 * s), lp(S0, W0, 0.9, 30 * s), lp(S0, E0, 0.1, 40 * s)], 0.45);
        f.stroke([lp(S0, E0, 0.2, -6), lp(S0, E0, 0.6, -2), lp(S0, E0, 0.95, -6)], 3.4, '#000', { op: 0.4 }); // biceps from triceps
        f.line([lp(E0, W0, 0.2, -12 * s), lp(E0, W0, 0.9, -8 * s)], 2, '#8a7060', { op: far ? 0.1 : 0.45 }); // the forearm's bone, lit
        V.fernSkin(f, lerp(E0, W0, 0.95), ang(W0, E0) + W.R(f, -0.15, 0.15), 230 * s, 2.6, { depth: 3, thread: true, fork: 0.7, lite: '#a08a76', liteOp: 0.45 }); // ferns down the arm from the welded hand
      });
      f.part(ell(add(E0, [far ? 10 : -10, 0]), 12 * s, 10 * s, 0, 8), Object.assign({}, look, { cast: false, inkW: 1, inkHeavy: 0 })); // the elbow's point
    };
    arm(sh.f, el.f, wr.f, true);
    // the trunk: the shoulders hauled up, the ribcage lifted and stretched, the belly hollowed, the hips hanging
    const tor = [Q(-80, 290), Q(-36, 262), Q(20, 258), Q(72, 282), Q(86, 340), Q(82, 410), Q(64, 462), Q(58, 500), Q(68, 548), Q(56, 586), Q(6, 598), Q(-46, 588), Q(-58, 540), Q(-48, 490), Q(-60, 430), Q(-84, 360)];
    f.part(tor, CHR({ maxShade: 26 }));
    W.clipDraw(f, tor, () => {
      soft([Q(-80, 300), Q(-40, 300), Q(-30, 560), Q(-80, 560)], 0.5); // the back turning away
      for (let k = 0; k < 6; k++) { const y = 318 + k * 22; f.stroke([Q(-60 + k * 3, y - 14), Q(-10, y + 4), Q(40 - k * 2, y + 22 + k * 3), Q(72 - k * 4, y + 40 + k * 4)], 4.2, '#000', { op: 0.42 }); f.line([Q(-56 + k * 3, y - 19), Q(-8, y - 1), Q(40 - k * 2, y + 16 + k * 3)], 1.8, '#8a7060', { op: 0.4 }); } // the ribs, arching down to the front, stretched by the hang
      soft([Q(10, 470), Q(64, 470), Q(60, 520), Q(16, 520)], 0.45); // the belly sucked in under the ribs
      f.stroke([Q(70, 300), Q(50, 340), Q(30, 360)], 4, '#000', { op: 0.4 }); // the pectoral's edge, pulled up
      V.charCracks(f, tor, Q(0, 430), 40, 100, 4, 50, 1.6);
      f.stroke([Q(-70, 300), Q(-74, 380), Q(-56, 470)], 6, '#000', { op: 0.45 }); f.line([Q(-64, 300), Q(-68, 380), Q(-52, 460)], 2, '#8a7060', { op: 0.35 }); // the lat stretched from the armpit
      f.stroke([Q(-20, 280), Q(10, 300), Q(40, 290)], 5, '#000', { op: 0.4 }); // the collarbone under the hauled-up shoulders
    });
    for (const [S0, far] of [[sh.f, true], [sh.n, false]]) f.part(ell(add(S0, [0, -6]), 40 * s, 34 * s, 1.4, 12), CHR(Object.assign({ cast: false, inkW: 1.2, inkHeavy: 0 }, far ? FAR : {}))); // the deltoids bunched round the shoulder
    // the leather apron burned to rags, hanging plumb from its neck strap and ties
    const ap = [Q(-40, 514), Q(10, 506), Q(62, 504), Q(80, 570), Q(84, 640), Q(66, 676), Q(56, 640), Q(40, 712), Q(24, 650), Q(10, 690), Q(-6, 640), Q(-22, 670), Q(-34, 620), Q(-46, 570)];
    f.part(ap, W.LEA(f, { fill: '#33231a', light: '#6a5038', maxShade: 20 }));
    W.clipDraw(f, ap, () => { f.stroke([Q(-20, 520), Q(-14, 600), Q(-16, 660)], 3, INK, { op: 0.5 }); f.stroke([Q(30, 512), Q(38, 600), Q(42, 680)], 3, INK, { op: 0.45 }); W.flakes(f, Q(20, 600), 40, 40, 5, 1.4); soft([Q(-46, 520), Q(-10, 520), Q(-12, 660), Q(-46, 640)], 0.4); f.line([Q(-44, 518), Q(64, 506)], 4, '#1a0e06'); });
    f.line(ap.slice(3, 11), 6, P.char, { op: 0.9 }); W.seam(f, ap.slice(4, 9), 1.4, { glowOp: 0.3 });
    W.rope(f, [Q(66, 504), Q(84, 512), Q(80, 540)], 2.6, { col: '#3a2818' }); f.line([Q(-30, 380), Q(-38, 330), Q(-30, 296)], 4, P.char, { op: 0.8 }); // the apron's tie, and the bib's burnt neck strap
    // the head, slumped forward between the arms, chin on the chest; hair standing stiff off the crown
    const hF0 = frame(HC0, hT, 96 * s);
    B.head(f, HC0, 96 * s, hT, { skin: '#3e302a', jaw: 1.06, nose: 1.1, hook: 0.2, mouth: 'set', blind: true, age: true, gaunt: true, faceShade: 0.8, faceHatch: false, jawShade: 0.35, browCol: '#0e0a08', browW: 0.05 });
    W.clipDraw(f, hF0(W.faceOutline(1.06, 0)), () => {
      V.charCracks(f, hF0(W.faceOutline(1.06, 0)), HC0, 24, 24, 3, 30, 1.3);
      f.flat(hF0([[0.17, 0.27], [0.32, 0.26], [0.31, 0.4], [0.19, 0.4]]), '#0e0604'); // the slack jaw open
      f.flat(hF0(ell([0.12, -0.06], 0.1, 0.05, 0.05, 12)), '#050302', { op: 0.75 }); f.stroke(hF0([[0.04, -0.07], [0.12, -0.08], [0.2, -0.06]]), 4, '#1e120c'); // the eyes burned shut
    });
    for (let k = 0; k < 16; k++) { const t = k / 15, a = Math.PI * (0.95 + t * 0.7), b0 = hF0([[-0.06 + Math.cos(a) * 0.36, -0.06 + Math.sin(a) * 0.44]])[0]; V.clump(f, b0, hT - Math.PI / 2 - 0.7 + t * 1.4 + W.R(f, -0.2, 0.2), W.R(f, 34, 56) * s, 5, k % 3 ? '#2a221c' : '#4a3e34', { bend: W.R(f, -0.5, 0.5), tipCol: '#0a0806', inkOp: 0.7 }); }
    arm(sh.n, el.n, wr.n, false);
    // the leather gauntlets fused to the bar: two fists over the bar, the cuffs flared up the forearm, welded through
    for (const [Hh, E0, far] of [[hnd.f, el.f, true], [hnd.n, el.n, false]]) {
      B.grip(f, Hh, E0, ang(barRoot, barEnd), 36 * s, far ? '#2a1c12' : '#3e2a18', { cuff: true, tex: 'craze' + seed, texOp: 0.4, shadow: '#0e0806', name: `pourer ${i + 1}` });
      { const wl = [add(Hh, [-30, -20]), add(Hh, [0, -27]), add(Hh, [30, -20])]; f.stroke(wl, 14, '#1a1410'); for (let k = 0; k < 7; k++) f.flat(ell(lerp(wl[0], wl[2], k / 6), 6, 5, 0, 8), '#3a3430', { op: 0.9 }); f.line(wl, 1.6, P.arcG, { op: 0.75 }); } // the glove's leather and the bar's iron fused in one black bead
    }
  };
  PX.forEach((h, i) => pourer(h, i));
  f.bone('bar');
  W.glow(f, lerp(barEnd, barRoot, 0.4), 420, 30, P.arcG, 0.15, true, ang(barEnd, barRoot));
  return f;
}

module.exports = {
  heroes: [
    { key: 'guild_warden', name: 'Guild Warden', tier: 'human', w: 600, h: 820, flip: true, build: guildWarden },
    { key: 'automaton_tender', name: 'Automaton Tender', tier: 'human', w: 600, h: 820, flip: true, build: automatonTender },
    { key: 'nail_wife', name: 'Nail-Wife', tier: 'human', w: 600, h: 820, flip: true, build: nailWife },
    { key: 'mould_sitter', name: 'Mould-Sitter', tier: 'human', w: 600, h: 820, flip: true, build: mouldSitter },
    { key: 'coke_heaver', name: 'Coke-Heaver', tier: 'large', w: 900, h: 1100, flip: true, build: cokeHeaver },
    { key: 'salamander', name: 'Salamander', tier: 'small', w: 600, h: 820, flip: true, build: salamander },
    { key: 'hearth_cat', name: 'Hearth Cat', tier: 'small', w: 600, h: 820, flip: true, build: hearthCat },
    { key: 'wire_drawer', name: 'The Wire-Drawer', tier: 'elite', w: 1100, h: 1400, flip: true, build: wireDrawer },
    { key: 'dray_horse', name: 'The Dray Horse', tier: 'elite', w: 1100, h: 1400, flip: true, build: drayHorse },
    { key: 'storm_catcher', name: 'The Storm-Catcher', tier: 'ruler', w: 1800, h: 2600, flip: true, build: stormCatcher },
    { key: 'crucible', name: 'The Crucible', tier: 'ruler', w: 2300, h: 2200, flip: true, build: crucible },
  ],
};
