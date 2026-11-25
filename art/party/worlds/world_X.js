// World X, The Venom Spires (Lightning + Toxin, Neurotoxin). A plain of travellers' roads; lightning struck it and the
// insects built towers to catch the lightning. Their venom stops the heart, then the will. Lightning (dominant) marks
// chitin and flesh with branching white-violet burns; toxin swells, paralyses and hollows (pustules, mould, fruiting
// bodies, larva holes). The cast are the hive's insects and the travellers it has taken.
// Palette: chitin black, venom green, white-violet strikes, plus ink black, bone and grey (copper sheen, a faded red sash
// and a dusty brown cloak where the bible names them).
// Foes face left: every figure is drawn facing right with kit.foeBase (light from the upper right) and flipped.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
'use strict';
const K = require('../kit');
const X = require('./kit_X');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, ang, elb, dir } = X;
const D = 180 / Math.PI;

// ------------------------------------------------------------------ one wasp (Spire Wasps; the Queen is built apart)
// Local frame: +x forward, s = 1 is a 100 px body. o.sting curls the gaster under so the sting points forward (attack);
// o.wingUp raises the wings; o.bones = [body, wing] bone names (the wing bone is a child of the body bone).
// Real anatomy: head (compound eye, clypeus, hinged mandibles, elbowed antennae), mesosoma (pronotum collar, scutum,
// scutellum, propodeum), petiole, a gaster of overlapping tergites with green posterior bands, six jointed legs hanging
// in flight, fore and hind wings rooted on the scutum with veins.
function wasp(f, c, a, s, o = {}) {
  const F = frame(c, a, s), sd = f.o.seed, [bb, bw] = o.bones;
  const look = X.CH(f, { tex: 'growth' + sd, texOp: 0.4 }), legLook = X.CH(f, { fill: '#26242c', light: '#6a6478' });
  const wingRoot = F([[2, -13]])[0], wa = a + (o.wingA ?? -2.35);
  const ws = o.wingS ?? 1;
  // far wings (behind everything), raised and a little blurred by the beat
  f.bone(bw);
  X.iwing(f, add(wingRoot, rot([-3 * s, -2 * s], a)), wa - 0.22, 50 * s * ws, 12 * s * ws, { tr: -1, op: 0.22, tears: o.tearF || [] });
  X.iwing(f, add(wingRoot, rot([-5 * s, 0], a)), wa - 0.05, 68 * s * ws, 17 * s * ws, { tr: -1, op: 0.24 });
  // far legs: hanging, femur forward-down, tibia back-down, the tarsus dangling
  f.bone(bb);
  const legs = (far) => {
    const k = far ? 0.82 : 1, dy = far ? -3 : 0;
    const L = [
      [[10, 8 + dy], [14, 13], [22, 19], [15, 29], [20, 37]], // foreleg tucked up under the head
      [[2, 10 + dy], [1, 16], [9, 25], [-1, 37], [1, 47]], // mid leg hanging
      [[-8, 9 + dy], [-12, 15], [-6, 26], [-22, 38], [-31, 46]], // hind leg trailing back
    ];
    L.forEach((J, i) => { if (o.missing === (far ? 'f' : 'n') + i) { f.part(F(limb(J[0], J[1], 6, 5, { steps: 3 })), legLook); f.flat(ell(F([J[1]])[0], 2.6 * s, 2 * s, 0, 6), '#0a0a0a'); return; } X.ileg(f, F(J.map((q, j) => j > 1 && far ? [q[0] + 4 + i * 2, q[1] - 3 - (j - 1) * 1.5] : q)), 8 * s * k, far ? X.CH(f, { fill: '#1c1a22', light: '#4a4656' }) : legLook, { spines: 2, hairs: 3 }); });
  };
  legs(true);
  // gaster: overlapping tergites with green posterior bands; curled under in the sting pose
  const gc = o.sting ? [[-14, 6], [-34, 12], [-48, 26], [-50, 42], [-42, 54]] : [[-14, 6], [-34, 10], [-52, 16], [-68, 24]];
  const swell = o.swell || 0;
  const hw = u => (u < 0.12 ? 4 + u / 0.12 * 8 : u < 0.4 ? 12 + (u - 0.12) / 0.28 * 4.5 : 16.5 - (u - 0.4) / 0.6 * 13) * s * (1 + swell * Math.sin(Math.min(1, u * 1.3) * Math.PI));
  const gpt = X.segBody(f, F(gc), hw, 5, look, { vs: -1, wrap: 0.58, band: i => i < 4 ? mix(P.ven, P.chit, i % 2 ? 0.28 : 0.16) : null, bandT: 0.64,
    deco: (i, u0, u1, pt) => { if (i < 4) for (const kk of [-0.75, -0.2]) f.flat(ell(pt((u0 + u1) / 2 + 0.06, kk), 2.4 * s, 1.6 * s, a, 6), P.chitD, { op: 0.8 }); } });
  // the sting, a dark needle with a venom bead
  const tip = gpt(1, 0), tipD = E.norm(sub(gpt(1, 0), gpt(0.9, 0)));
  f.part([add(tip, rot([0, -2.4 * s], Math.atan2(tipD[1], tipD[0]))), add(tip, mul(tipD, 14 * s)), add(tip, rot([0, 2.4 * s], Math.atan2(tipD[1], tipD[0])))], { fill: '#0c0b0e', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  const vd = add(tip, mul(tipD, 15 * s));
  f.part(ell(add(vd, [0, 3 * s]), 2.6 * s, 3.4 * s, 0, 8), { fill: P.venL, shade: 0.4, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
  // petiole and the mesosoma
  f.part(F(limb([-8, 4], [-17, 6], 7, 5, { steps: 4 })), look);
  const ms = F([[14, -6], [10, -14], [0, -17], [-10, -15], [-16, -9], [-19, 0], [-15, 8], [-6, 12], [6, 12], [13, 8]]);
  f.part(ms, Object.assign({}, look, { k: 0.9 }));
  X.clipDraw(f, ms, () => {
    f.part(F([[14, -6], [9, -15], [4, -16], [6, -6], [8, 6], [14, 8]]), X.VN(f, { inkW: 1, inkHeavy: 1.4, cast: false, fill: mix(P.ven, P.chit, 0.25) })); // pronotum collar, green-edged
    f.line(F([[4, -16], [6, -6], [7, 8]]), 1.4, INK, { op: 0.8 }); // pronotal suture
    f.part(F([[-6, -17], [-13, -15], [-14, -9], [-8, -10]]), Object.assign({}, look, { fill: mix(P.chit, P.ven, 0.35), inkW: 1, inkHeavy: 1.2, cast: false })); // scutellum
    f.line(F([[-15, -8], [-6, -4], [4, 4]]), 1.1, INK, { op: 0.6 }); // pleural suture
    f.flat(F(ell([-2, 2], 4, 3, 0.3, 8)), P.ven, { op: 0.7 }); // pleural spot
  });
  f.line(F([[8, -14], [-2, -16], [-10, -14]]), 1.5, P.chitP, { op: 0.6 });
  // head: tall, the compound eye on its side, clypeus with green face marks, hinged mandibles, elbowed antennae
  const HC = F([[22, -2]])[0], ha = a + 0.35, HF = frame(HC, ha, s);
  f.part(HF(limb([-6, 0], [-12, 0], 8, 9, { steps: 3 })), look); // neck
  X.mandible(f, HF([[8, 11]])[0], ha + 1.15, 9 * s, 4 * s, X.CH(f, { fill: '#3a3020', light: '#7a6a48' }), -1);
  const hd = HF([[-7, -12], [3, -16], [11, -12], [14, -2], [13, 10], [8, 16], [0, 16], [-7, 10], [-9, -2]]);
  f.part(hd, Object.assign({}, look, { k: 0.9 }));
  X.ceye(f, HF([[-1, -2]])[0], 5 * s, 11.5 * s, ha + 0.12, { kidney: 0.4, glints: 1 });
  f.part(HF([[7, 5], [13, 3], [13, 11], [8, 15], [5, 11]]), X.VN(f, { fill: mix(P.ven, P.chit, 0.2), inkW: 0.9, inkHeavy: 1.2, cast: false })); // clypeus
  f.line(HF([[2, -12], [8, -10], [12, -4]]), 1.2, P.chitP, { op: 0.6 }); // sheen on the vertex
  f.flat(HF(ell([7, -8], 2, 1.4, 0, 6)), P.ven, { op: 0.7 });
  X.mandible(f, HF([[7, 13]])[0], ha + 0.95, 11 * s, 4.6 * s, X.CH(f, { fill: '#4a3c26', light: '#8a7650' }), -1);
  f.bone(bb);
  const ab = HF([[8, -8]])[0];
  X.antenna(f, [ab, add(ab, rot([8 * s, -10 * s], a)), add(ab, rot([18 * s, -12 * s], a)), add(ab, rot([30 * s, -4 * s], a + (o.antA || 0)))], 2.6 * s, legLook, { n: 10 });
  legs(false);
  // marks: lightning burn across the gaster, pustules on a swollen one, a cordyceps stalk out of the hollowed thorax
  if (o.burn) { const GO = []; for (let i = 0; i <= 16; i++) GO.push(gpt(i / 16, -0.95)); for (let i = 16; i >= 0; i--) GO.push(gpt(i / 16, 0.9)); X.clipDraw(f, GO, () => X.burn(f, gpt(0.12, -0.2), Math.atan2(gpt(0.8, -0.1)[1] - gpt(0.12, -0.2)[1], gpt(0.8, -0.1)[0] - gpt(0.12, -0.2)[0]), 40 * s, 2 * s, { depth: 2 })); } // clipped to the gaster: a scar, never a spark in the air
  if (o.pust) X.pustules(f, gpt(0.45, 0.1), 10 * s, 8 * s, 4, 1.8 * s, 3.4 * s);
  if (o.mould) X.mould(f, gpt(0.7, 0), 8 * s, 6 * s, 10, { s: 0.8 });
  if (o.cordy) X.cordyceps(f, F([[-6, -14]])[0], a - 1.9, 34 * s, 3.4 * s, { bend: 0.4 });
  // near wings, over the body, glinting with static at the tips
  f.bone(bw);
  const w1 = X.iwing(f, add(wingRoot, rot([-6 * s, 1 * s], a)), wa + 0.18, 46 * s * ws, 12 * s * ws, { tr: -1, op: 0.26, tears: o.tearH || [] });
  const w2 = X.iwing(f, wingRoot, wa, 66 * s * ws, 17 * s * ws, { tr: -1, op: 0.3, tears: o.tears || [], burn: o.wingBurn });
    const wt = add(wingRoot, rot([66 * s * ws, 0], wa)), gb = add(wingRoot, rot([60 * s * ws, 0], wa + 0.9));
  if (o.spark) { // lightning, no sparks in the air: the wing tip singed and curled, the thorax setae standing stiff
    f.line([add(wt, rot([-14 * s, 3 * s], wa)), add(wt, rot([-6 * s, 5 * s], wa)), add(wt, rot([-1 * s, 2 * s], wa))], 2.2 * s, '#141218', { op: 0.6 }); // the wing tip singed along its edge
    f.bone(bb); X.standingHair(f, F([[-8, -16], [-3, -17.5], [2, -17.5], [7, -16], [11, -13]]), 9 * s, { col: '#14121a', w: 1.3 * s, fan: 0.9, lean: a });
  }
  return { HC, tip, gpt };
}

// ------------------------------------------------------------------ SPIRE WASPS (cast, small: a cloud about 0.6 across)
// Six black-and-green wasps the size of fists in a loose buzzing knot, the lead pair diving forward with their gasters
// curled under and the stings out; the rest wheel round them. One is burnt by a strike, one swells with pustules, one is
// being hollowed by a fruiting stalk out of its back, one has lost a leg; wings are torn and spark at the tips.
// Rig: swarm (root, the cloud's centre) + wasp_1..6 (one bone per body) + wing_1..6 (parent wasp_i).
// Motion: idle a swirling buzz (wasp bones orbit the swarm, wings beat); attack the stinging swarm (all dive forward).
function spireWasps() {
  const seed = 1003, h = TIERS.small[1];
  const f = new Fig(X.base(seed, h, { grimeY: 900 }));
  X.texturesX(f);
  const gy = f.o.groundY, C0 = [300, 470];
  f.joint('swarm', C0, null);
  // [centre, heading, scale, options]: back of the knot first, the lead stingers last (in front)
  const W = [
    [[222, 404], -0.38, 0.78, { antA: -0.3, tears: [0.55], mould: true }],
    [[364, 376], 0.12, 0.74, { cordy: true, tearH: [0.6], antA: 0.2, wingA: -2.6 }],
    [[190, 506], 0.08, 0.9, { missing: 'n2', burn: true, wingBurn: [0.55, 0.35, 0.16], spark: true }],
    [[318, 458], -0.16, 1.0, { pust: true, swell: 0.22, tears: [0.7] }],
    [[414, 536], 0.42, 1.05, { sting: true, burn: true, spark: true, wingA: -2.1 }],
    [[276, 588], 0.3, 1.0, { sting: true, tearF: [0.5], antA: 0.3 }],
  ];
  W.forEach(([c], i) => f.joint('wasp_' + (i + 1), c, 'swarm'));
  W.forEach(([c, a, s], i) => f.joint('wing_' + (i + 1), add(c, rot([2 * s, -13 * s], a)), 'wasp_' + (i + 1)));
  W.forEach(([c, a, s, o], i) => wasp(f, c, a, s, Object.assign({ bones: ['wasp_' + (i + 1), 'wing_' + (i + 1)] }, o)));
  // shadow of the cloud on the ground, and fallen husks of the swarm's dead
  f.bone('root');
  f.flat(ell([300, gy + 2], 170, 8, 0, 20), '#14121a', { op: 0.45 });
  for (const [x, r] of [[180, 0.4], [410, -0.6]]) { const p = [x, gy - 5]; f.part(ell(p, 12, 5, r, 10), X.CH(f, { cast: false, inkW: 1, inkHeavy: 1.4 })); f.flat(ell(add(p, [4, -1]), 4, 2, r, 6), P.ven, { op: 0.8 }); X.burn(f, add(p, [-4, -2]), -0.4, 10, 0.9, { depth: 1 }); }
  return f;
}

// ------------------------------------------------------------------ HIVE DRONE (cast, small 0.6, hovering)
// A fat, fuzzy drone bee hanging in the air under small wings, its heavy gaster sagging. Middle and hind legs cradle a
// lumpy ball of venom-green nectar in a wax skin; the hind tibiae carry packed pollen baskets. Its tongue unrolls toward
// the wounded ally it feeds. Lightning singed a fern through the thorax fur and fused the far foreleg's knee into a lump;
// the wings are burnt and frayed at the edge. Toxin: the gaster ripens with pustules and mould, and a hole in its side
// lets a grub out (the hive hollows its own).
// Rig: body (root, thorax) + head + abdomen + wing_n, wing_f + leg_n1..3, leg_f1..3 + nectar (parent body).
// Motion: idle a lazy hover (body bob, wings beat); action feeding nectar (head dips, the tongue reaches).
function hiveDrone() {
  const seed = 1007, h = TIERS.small[1];
  const f = new Fig(X.base(seed, h, { grimeY: 900 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const T0 = [332, 410], NK = [394, 420], PT = [274, 424], WR = [322, 352], BC = [300, 548];
  const fur = mix(P.chit, '#3a3640', 0.5), furG = mix(P.ven, P.chit, 0.35);
  const FUR = (o = {}) => Object.assign({ fill: fur, shadow: P.chitS, light: P.chitL, shade: 0.4, tex: 'setae' + sd, texOp: 0.6 }, o);
  const legLook = X.CH(f, { fill: '#2a2830', light: '#6a6478' }), legFar = X.CH(f, { fill: '#1c1a22', light: '#4a4656' });
  const LN = [
    [[380, 448], [392, 466], [414, 486], [404, 520], [414, 546]],
    [[338, 462], [342, 478], [368, 500], [350, 530], [338, 554]],
    [[296, 462], [286, 478], [250, 500], [254, 548], [282, 584]],
  ];
  const LF = [
    [[366, 438], [376, 454], [402, 470], [400, 500], [410, 522]],
    [[324, 452], [326, 466], [346, 482], [320, 512], [304, 516]],
    [[284, 452], [270, 466], [232, 484], [240, 526], [262, 532]],
  ];
  f.joint('body', T0, null).joint('head', NK, 'body').joint('abdomen', PT, 'body').joint('nectar', BC, 'body');
  f.joint('wing_f', add(WR, [-6, -4]), 'body').joint('wing_n', WR, 'body');
  LN.forEach((J, i) => f.joint('leg_n' + (i + 1), J[0], 'body')); LF.forEach((J, i) => f.joint('leg_f' + (i + 1), J[0], 'body'));

  // ---- far wings, raised behind
  f.bone('wing_f');
  X.iwing(f, add(WR, [-10, -4]), -2.75, 112, 30, { tr: -1, op: 0.24, tears: [0.62] });
  X.iwing(f, add(WR, [-6, -4]), -2.5, 156, 44, { tr: -1, op: 0.26, burn: [0.82, 0.35, 0.14] });
  // ---- far legs; the foreleg's knee fused by the strike into a glassy lump
  LF.forEach((J, i) => { f.bone('leg_f' + (i + 1)); X.ileg(f, J, 15, legFar, { spines: 2, hairs: 6 }); });
  f.bone('leg_f1');
  f.part(ell(LF[0][2], 13, 11, 0.4, 12), X.CH(f, { fill: '#24202a', light: '#7a7090', cast: false }));
  X.burn(f, add(LF[0][2], [-4, -4]), -0.8, 22, 1.2, { depth: 1 });
  f.bone('leg_f3');
  f.part(ell(lerp(LF[2][2], LF[2][3], 0.5), 12, 18, 0.2, 12), { fill: mix(P.venP, P.bone, 0.4), shadow: '#4a4a2a', shade: 0.42, tex: 'grain' + sd, texOp: 0.5, cast: false, inkW: 1.1 });

  // ---- the gaster: heavy, sagging, furred over its tergites: green fur bands, dark creases between the segments, the
  // bare sternite plates underneath; a hole in its side lets a grub out; pustules ripen on the belly
  f.bone('abdomen');
  const GC = X.spline([PT, [238, 432], [194, 452], [158, 482], [136, 512]], 3), GS = X.arcLen(GC), GL = GS[GS.length - 1];
  const ghw = u => u < 0.22 ? 42 + u / 0.22 * 26 : u < 0.6 ? 68 - (u - 0.22) * 8 : 65 - Math.pow((u - 0.6) / 0.4, 1.6) * 58;
  const gpt = (u, k) => { const A = X.at(GC, GS, Math.max(0, Math.min(1, u)) * GL); return add(A.p, mul(A.n, -k * ghw(Math.max(0, Math.min(1, u))))); };
  const GO = []; for (let i = 0; i <= 24; i++) GO.push(gpt(i / 24, -1)); for (let i = 24; i >= 0; i--) GO.push(gpt(i / 24, 1));
  X.furMass(f, GO, FUR({ fill: '#2c2a32' }), { len: 13, edge: 6, flow: p => Math.PI * 0.82, skip: p => p[0] > 262,
    tint: p => { for (const [a0, a1] of [[0.08, 0.2], [0.25, 0.37], [0.58, 0.66]]) if (E.len(sub(p, gpt((a0 + a1) / 2, 0))) < 999 && inBand(p, a0, a1)) return furG; return null; },
    under: () => {
      for (const [a0, a1, op] of [[0.08, 0.2, 0.9], [0.25, 0.37, 0.9], [0.58, 0.66, 0.6]]) f.flat([gpt(a0, -1.3), gpt(a1, -1.3), gpt(a1 + 0.02, 0.5), gpt(a0 + 0.02, 0.5)], furG, { op });
      for (let i = 1; i < 6; i++) { const u = i / 6; f.stroke([gpt(u - 0.02, -1.05), gpt(u, -0.3), gpt(u + 0.03, 0.55)], 6, '#0c0b10', { op: 0.55 }); f.line([gpt(u + 0.025, -0.95), gpt(u + 0.03, -0.3)], 1.4, P.chitL, { op: 0.4 }); }
      for (let i = 0; i < 6; i++) { const u0 = i / 6 + 0.01, u1 = (i + 1) / 6 + 0.02; f.part([gpt(u0, 0.6), gpt(u1, 0.62), gpt(u1, 1.05), gpt(u0, 1.05)], X.CH(f, { fill: '#3a3842', cast: false, inkW: 1.1, inkHeavy: 1.6 })); }
    } });
  function inBand(p, a0, a1) { let best = 1e9, bu = 0; for (let i = 0; i <= 40; i++) { const u = i / 40, d = E.len(sub(p, gpt(u, 0))); if (d < best) { best = d; bu = u; } } return bu >= a0 && bu <= a1 && best < ghw(bu) * 0.6; }
  X.pustules(f, gpt(0.5, 0.82), 30, 8, 6, 3, 6.5);
  X.mould(f, gpt(0.82, -0.2), 22, 16, 26);
  X.hole(f, gpt(0.42, -0.15), 11, 9, 0.4);
  X.grub(f, add(gpt(0.42, -0.15), [-4, -6]), -2.2, 0.9, { curl: 0.6 });
  X.cordyceps(f, gpt(0.7, -0.9), -2.0, 40, 4, { bend: 0.5 });
  f.part([gpt(0.97, -0.5), add(gpt(1, 0), [-12, 8]), gpt(0.97, 0.5)], { fill: '#141218', shade: 0.3, inkW: 1, cast: false, hatch: false }); // the blunt tip: a drone has no sting

  // ---- thorax: a furred mass, the collar band green, a lightning fern singed through the fur
  f.bone('body');
  const TH = [[384, 372], [360, 350], [322, 344], [288, 356], [268, 384], [266, 420], [280, 452], [312, 470], [350, 468], [380, 450], [394, 420], [396, 392]];
  X.furMass(f, TH, FUR(), { len: 16, edge: 6, flow: p => Math.atan2(p[1] - 470, p[0] - 330) + 0.6, skip: p => p[0] < 282 && p[1] > 400 || p[1] > 455,
    matted: p => p[1] < 360 && p[0] > 340 && p[0] < 362, tint: p => p[0] > 364 + (p[1] - 360) * 0.2 ? furG : null,
    under: () => f.flat([[400, 372], [372, 344], [362, 346], [366, 400], [384, 460], [404, 420]], furG, { op: 0.9 }), inner: () => {
      X.burn(f, [360, 360], 2.4, 96, 2.4, { depth: 3 });
      f.flat([[300, 370], [340, 372], [350, 400], [320, 410], [296, 396]], '#000', { op: 0.25 }); // the singed patch, fur burnt short
    } });
  X.mould(f, [290, 452], 16, 9, 14);

  // ---- the nectar: a lumpy bolus in a wrinkled wax skin, comb walls inside, pollen stuck to it, a slow drip
  f.bone('nectar');
  const BL = X.lumpy(f, ell(BC, 46, 42, 0.2, 16), 6);
  f.part(BL, { fill: mix(P.ven, P.venL, 0.25), shadow: P.venS, light: P.venP, shade: 0.42, tex: 'comb' + sd, texOp: 0.35 });
  X.clipDraw(f, BL, () => { f.flat(ell(add(BC, [-14, -16]), 18, 10, -0.5, 12), P.venP, { op: 0.35 }); f.flat(ell(add(BC, [14, 22]), 34, 16, 0.2, 12), P.venS, { op: 0.4 }); for (let i = 0; i < 5; i++) { const q = add(BC, [-30 + i * 14, -8 + (i % 2) * 18]); f.line([q, add(q, [8, -4]), add(q, [14, 2])], 1, P.wax, { op: 0.6 }); } });
  for (let i = 0; i < 9; i++) f.flat(ell(add(BC, [R2(f, -36, 36), R2(f, -30, 30)]), 2.2, 1.8, f.r() * 3, 6), mix(P.venP, P.bone, 0.5), { op: 0.9 });
  X.drip(f, add(BC, [6, 40]), 1.4, P.venL); X.drip(f, add(BC, [-18, 36]), 1, P.venL);
  // ---- near legs: the middle and hind tarsi wrap the bolus; packed pollen on the hind tibia
  LN.forEach((J, i) => { f.bone('leg_n' + (i + 1)); X.ileg(f, J, 17, legLook, { spines: 2, hairs: 7 }); });
  f.bone('leg_n3');
  f.part(X.lumpy(f, ell(lerp(LN[2][2], LN[2][3], 0.52), 15, 22, 0.15, 12), 3), { fill: mix(P.venP, P.bone, 0.45), shadow: '#4a4a2a', light: '#f0ecd0', shade: 0.42, tex: 'grain' + sd, texOp: 0.55, cast: false, inkW: 1.2 });
  for (let i = 0; i < 6; i++) f.flat(ell(add(lerp(LN[2][2], LN[2][3], 0.52), [R2(f, -14, 14), R2(f, -24, 30)]), 1.6, 1.6, 0, 6), P.venP, { op: 0.8 });

  // ---- head: tilted down to the tongue; a big faceted eye, ocelli, short elbowed antennae, a hairy face, mandibles
  f.bone('head');
  const HC = [432, 436], ha = 0.42, HF = frame(HC, ha, 1);
  f.part(limb(NK, add(HC, [-24, -4]), 44, 40, { steps: 4 }), FUR());
  // the tongue: a segmented glossa unrolling forward and down, a green bead at its tip
  const g0 = HF([[16, 40]])[0], gl = [g0, add(g0, [20, 12]), add(g0, [42, 20]), add(g0, [62, 32]), add(g0, [72, 46])];
  f.part(X.tube(gl, [9, 7.5, 6, 5, 4]), { fill: '#7a6a52', shadow: '#2a2018', light: '#b8a482', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'wrinkle' + sd, texOp: 0.6 });
  for (let i = 1; i < 12; i++) { const q = lerp(gl[Math.floor(i / 3)], gl[Math.floor(i / 3) + 1], (i % 3) / 3); f.line([add(q, [-4, 1]), add(q, [4, -1])], 0.9, INK, { op: 0.6 }); }
  X.drip(f, add(gl[4], [0, 4]), 1.1, P.venL);
  const hd = HF([[-30, -34], [-6, -42], [16, -34], [30, -14], [36, 10], [30, 34], [14, 46], [-4, 44], [-22, 30], [-34, 6]]);
  X.furMass(f, hd, FUR({ fill: '#2a2830' }), { len: 10, edge: 8, flow: p => ha + 1.9, skip: p => p[0] < HC[0] - 10 && p[1] > HC[1] - 10 });
  X.ceye(f, HF([[-6, -4]])[0], 15, 31, ha + 0.1, { kidney: 0.3, glints: 2 });
  X.furMass(f, HF([[16, 8], [32, 4], [36, 20], [30, 36], [16, 40], [10, 26]]), FUR({ fill: mix(furG, '#2a2830', 0.4) }), { len: 8, edge: 6, flow: p => ha + 1.4 }); // the hairy face
  for (const q of [[-6, -38], [4, -40], [12, -36]]) f.flat(ell(HF([q])[0], 3, 2.6, 0, 6), '#0e0c12');
  X.mandible(f, HF([[18, 40]])[0], ha + 1.2, 16, 7, X.CH(f, { fill: '#3e3224', light: '#8a7650' }), -1);
  const ab = HF([[22, -18]])[0];
  X.antenna(f, [ab, add(ab, [16, -26]), add(ab, [26, -34]), add(ab, [44, -26]), add(ab, [58, -10])], 6, legLook, { n: 12 });

  // ---- near wings over the body: small for the bulk, burnt along the edge, frayed
  f.bone('wing_n');
  X.iwing(f, add(WR, [-6, 4]), -2.6, 108, 30, { tr: -1, op: 0.28, tears: [0.5, 0.74] });
  X.iwing(f, WR, -2.35, 158, 46, { tr: -1, op: 0.24, tears: [0.68], burn: [0.9, 0.3, 0.12] });
  X.scorch(f, add(WR, rot([146, 8], -2.35)), 14, 9, 0.7, -2.35); X.burn(f, add(WR, rot([120, 10], -2.35)), -2.2, 30, 1.1, { depth: 1 }); // the wing tip singed, no sparks
  f.bone('body'); X.standingHair(f, [[300, 352], [316, 346], [334, 344], [352, 348], [368, 356]], 22, { col: '#1a1820', w: 2.2, fan: 1.0, lean: -0.2 }); // the thorax fur standing stiff along the fern

  f.bone('root');
  f.flat(ell([300, gy + 2], 130, 7, 0, 20), '#14121a', { op: 0.45 });
  f.flat(ell([306, gy], 10, 3, 0, 8), P.venD, { op: 0.6 }); // a drop of nectar on the ground (a drop, not a puddle)
  return f;
}
function R2(f, a, b) { return a + (b - a) * f.r(); }

// ------------------------------------------------------------------ GALVANIC BEETLE (cast, large 1.2 long, low)
// A heavy rhinoceros beetle, coppery black, standing low and splayed on six thick spined legs with the claws dug in. The
// head horn sweeps up and back toward the short thoracic horn. The lightning it stores is drawn only as lightning's
// marks, never as arcs (the bible's "arcs" breaks the course's Never column; director's ruling): a fern burnt the
// length of the horn and its tip fused glassy, the elytra welded into one shell along a suture of fused copper, a
// blistered fused plate where a strike went in, ferns across the shell and pronotum, bristles standing stiff on end
// along the seams, one hind knee welded. Toxin rots the seams: mould in the striae, pustules along the margin, fruiting
// stalks out of the pronotal seam and a hole eaten through the shell, a flake peeled up at the rear.
// Rig: body (root) + head (the horns ride on it) + leg_n1..3, leg_f1..3 (one bone per leg).
// Motion: idle a low hum (bristles and antennae tremble); attack a charged horn ram (body lunges, head dips then flicks up).
function galvanicBeetle() {
  const seed = 1006, h = TIERS.large[1];
  const f = new Fig(X.base(seed, h, { grimeY: 980 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const shell = mix(P.chit, P.copperD, 0.24), SHL = (o = {}) => X.CH(f, Object.assign({ fill: shell, light: mix(P.copper, P.chitL, 0.35), shadow: '#0a0706', tex: 'pit' + sd, texOp: 0.45 }, o));
  const legL = SHL({ fill: mix(P.chit, P.copperD, 0.25) }), legF = SHL({ fill: '#181414', light: '#4a3e38' });
  // legs splayed low: the femur runs out and a little up from the coxa so the knee stands proud of the body line, the
  // tibia comes down steeply, the tarsus lies along the ground with the claws dug in
  const LN = [
    [[720, 932], [746, 948], [804, 928], [848, 1030], [892, 1066]],
    [[566, 962], [582, 980], [644, 958], [678, 1044], [726, 1066]],
    [[436, 974], [412, 990], [338, 964], [300, 1046], [238, 1066]],
  ];
  const LF = [
    [[700, 922], [716, 938], [778, 902], [818, 1020], [858, 1060]],
    [[548, 954], [560, 966], [608, 928], [636, 1030], [674, 1060]],
    [[424, 964], [404, 974], [350, 938], [326, 1034], [276, 1060]],
  ];
  f.joint('body', [450, 900], null).joint('head', [734, 902], 'body');
  LN.forEach((J, i) => f.joint('leg_n' + (i + 1), J[0], 'body')); LF.forEach((J, i) => f.joint('leg_f' + (i + 1), J[0], 'body'));
  // ---- far legs
  LF.forEach((J, i) => { f.bone('leg_f' + (i + 1)); X.ileg(f, J, 32, legF, { spines: i === 0 ? 4 : 3, hairs: 5, planted: true }); });
  // ---- underside: the sternites between the legs, hairy at the margins; the pygidium under the elytral apex
  f.bone('body');
  f.part([[122, 896], [100, 926], [110, 956], [146, 966], [160, 934]], SHL({ fill: '#241c1a', cast: false }));
  const ST = [[150, 960], [560, 936], [724, 932], [712, 980], [566, 1006], [320, 1012], [172, 994]];
  f.part(ST, SHL({ fill: '#221c1a', cast: false }));
  for (let i = 0; i < 6; i++) { const x = 210 + i * 70; f.line([[x, 962 - i * 3], [x + 10, 1004 - i * 2]], 1.6, INK, { op: 0.7 }); for (let k = 0; k < 4; k++) f.line([[x + 4 + k * 3, 1004 - i * 2], [x + 2 + k * 3, 1012 - i * 2]], 0.9, '#8a7a60', { op: 0.6 }); }
  // ---- the elytra: welded into one shell. Humeral callus at the shoulder, a flat back, a steep declivity with an
  // apical callus, a pointed apex; striae and punctures; the epipleural rim gives the plate its thickness
  // final pass 2026-11-25: the outline was near a smooth oval. Now it has the shell's landmarks: the humeral callus
  // standing up behind the pronotum, a slight saddle over the back, the apical callus as a second bump before the steep
  // declivity, a sutural spine at the apex, and a lower margin that is sinuate over the hind leg with a rotted bite out of it
  const EL = [[560, 806, 1], [552, 772], [534, 748], [508, 730], [482, 734], [446, 748], [410, 752], [360, 744], [310, 744], [262, 748], [230, 744], [208, 750], [192, 772], [176, 796], [156, 816], [140, 844], [108, 890, 1], [126, 906], [136, 928, 1], [172, 946], [214, 960], [262, 966], [294, 958, 1], [306, 966], [318, 958, 1], [350, 970], [410, 976], [470, 968], [530, 950], [562, 922], [576, 886], [578, 846]];
  f.part(EL, SHL({ k: 0.9, maxShade: 46 }));
  const top = X.spline([[560, 806], [530, 760], [400, 746], [252, 764], [162, 812], [120, 884]], 4);
  const bot = X.spline([[576, 904], [540, 944], [452, 962], [342, 968], [232, 960], [150, 934], [120, 892]], 4);
  const TS = X.arcLen(top), BS = X.arcLen(bot), tL = TS[TS.length - 1], bL = BS[BS.length - 1];
  const ept = (u, k) => lerp(X.at(top, TS, u * tL).p, X.at(bot, BS, u * bL).p, k);
  X.clipDraw(f, EL, () => {
    for (let j = 1; j < 9; j++) { const k = j / 9.5, L1 = [], L2 = []; for (let i = 0; i <= 30; i++) { const u = i / 30, q = add(ept(u, k), [0, Math.sin(u * 9 + j) * 1.5]); L1.push(q); L2.push(add(q, [1.5, 3.5])); } f.line(L1, 2, INK, { op: 0.6 }); f.line(L2, 1.4, mix(P.copperL, P.chitP, 0.3), { op: 0.3 }); for (let i = 1; i < 30; i += 2) f.flat(ell(ept(i / 30 + (j % 2) * 0.015, k + 0.04), 2, 1.4, 0, 6), '#060404', { op: 0.75 }); }
    f.flat([...[0.02, 0.2, 0.4, 0.6, 0.75].map(u => ept(u, 0.08)), ...[0.75, 0.6, 0.4, 0.2, 0.02].map(u => ept(u, 0.26))], P.copperL, { op: 0.2 }); // copper sheen in a band along the back
    for (const [u, k, l] of [[0.08, 0.1, 0.22], [0.36, 0.08, 0.3]]) f.stroke([ept(u, k), ept(u + l * 0.5, k - 0.02), ept(u + l, k + 0.03)], 5, mix(P.copperL, '#fff', 0.4), { op: 0.6 }); // gloss
    f.flat(ell(ept(0.03, 0.18), 22, 16, 0.4, 12), mix(P.copperL, '#fff', 0.2), { op: 0.25 }); // humeral callus
    f.flat(ell([220, 764], 22, 15, 0.8, 12), mix(P.copperL, '#fff', 0.2), { op: 0.3 }); f.stroke([[240, 758], [214, 756], [196, 774]], 3, INK, { op: 0.5 }); // apical callus, its rear edge dropping to the declivity
    f.flat([[200, 770], [170, 800], [140, 850], [116, 892], [150, 930], [200, 900], [214, 830]], '#000', { op: 0.3 }); // the steep declivity turning away
    f.flat(ell([506, 744], 24, 13, 0.1, 12), mix(P.copperL, '#fff', 0.25), { op: 0.35 }); f.stroke([[534, 756], [510, 742], [484, 746], [460, 758]], 2.4, INK, { op: 0.45 }); // the humeral callus standing up
    f.line([0.02, 0.2, 0.4, 0.6, 0.78, 0.92].map(u => ept(u, 0.8)), 3, INK, { op: 0.55 }); f.line([0.04, 0.22, 0.42, 0.62, 0.78].map(u => add(ept(u, 0.8), [0, -3])), 1.4, mix(P.copperL, '#fff', 0.25), { op: 0.4 }); // the lateral keel where the shell bends down
    f.flat([...[0, 0.25, 0.5, 0.75, 1].map(u => ept(u, 0.78)), ...[1, 0.75, 0.5, 0.25, 0].map(u => ept(u, 1.05))], '#000', { op: 0.4 });
    for (const [u, k] of [[0.3, 0.5], [0.52, 0.66], [0.18, 0.7]]) { f.flat(ell(ept(u, k), 14, 7, 0.1, 10), '#000', { op: 0.35 }); f.line([add(ept(u, k), [-12, -6]), add(ept(u, k), [10, -7])], 1.2, mix(P.copperL, '#fff', 0.3), { op: 0.5 }); } // dents
    X.mould(f, ept(0.86, 0.45), 24, 30, 30);
    X.burn(f, ept(0.34, 0.14), 2.2, 130, 2.8, { depth: 3 });
    f.scratches(ept(0.2, 0.45), 40, 8, '#b8a890', 0.9, 0.2);
  });
  // the epipleural rim: the shell's thickness turned under along the margin, darker, the lower lip worn bright
  const rim = [...[0.02, 0.2, 0.4, 0.6, 0.8, 0.98].map(u => ept(u, 0.9)), ...[0.98, 0.8, 0.6, 0.4, 0.2, 0.02].map(u => add(ept(u, 1.0), [0, 14]))];
  f.part(rim, SHL({ fill: '#160e0c', cast: false, inkW: 1.4 }));
  f.line([0.05, 0.3, 0.55, 0.8, 0.97].map(u => add(ept(u, 1.0), [0, 12])), 1.8, mix(P.copperL, '#fff', 0.2), { op: 0.65 });
  X.pustules(f, ept(0.6, 0.98), 70, 8, 7, 3, 6.5);
  f.line([[294, 958], [300, 952], [306, 962], [312, 952], [318, 958]], 1.6, '#6a5a44', { op: 0.8 }); X.mould(f, [306, 958], 12, 8, 10); // the rotted bite in the margin, its edge soft with mould
  f.part([[118, 896], [104, 902], [112, 912], [124, 906]], SHL({ fill: '#2a1e18', cast: false, inkW: 1.1 })); // the sutural spine at the apex
  // a hollow: the shell eaten through from inside, a fruiting stalk out of it
  X.hole(f, ept(0.62, 0.36), 17, 12, 0.1, { lip: '#6a5a44' });
  X.cordyceps(f, add(ept(0.62, 0.36), [-4, -6]), -2.3, 62, 5, { bend: 0.4 });
  // the curled flake: a plate peeled up off the declivity, its pale underlayer showing, breaking the outline
  const fk = ept(0.84, 0.02);
  f.part([add(fk, [22, 10]), add(fk, [-16, 8]), add(fk, [-34, -18]), add(fk, [-12, -46]), add(fk, [20, -24])], { fill: '#8a7a62', shadow: '#3a3024', shade: 0.42, inkW: 1.4, inkHeavy: 2, cast: false, tex: 'growth' + sd, texOp: 0.4 });
  f.part([add(fk, [22, 10]), add(fk, [-12, -46]), add(fk, [4, -50]), add(fk, [30, -12])], SHL({ cast: false }));
  X.mould(f, add(fk, [-24, 6]), 14, 8, 14);
  // the fused suture: a ridge with a bead of fused copper along it, spitting forks; copper runs set hard at the margin
  f.line([0.0, 0.2, 0.4, 0.6, 0.78].map(u => ept(u, 0.03)), 5, INK, { op: 0.8 });
  f.line([0.0, 0.2, 0.4, 0.6, 0.78].map(u => ept(u, 0.03)), 2.8, P.copper, { op: 0.9 });
  f.line([0.05, 0.25, 0.45].map(u => ept(u, 0.025)), 1.1, mix(P.copperL, '#fff', 0.3), { op: 0.9 });
  X.fusedRun(f, ept(0.12, 0.98), 30, 6, P.copper); X.fusedRun(f, ept(0.74, 0.99), 22, 5, P.copper);
  // standing bristles: the setae along the fused suture stand stiff on end, singed at the tips
  X.standingHair(f, [0.06, 0.1, 0.14, 0.18, 0.22, 0.26, 0.3, 0.36, 0.42, 0.48, 0.54, 0.6].map(u => ept(u, 0.02)), 34, { col: '#1a1410', w: 3, fan: 0.9, lean: -0.3 });
  for (const u of [0.14, 0.32, 0.48]) f.flat(ell(add(ept(u, 0.02), [0, -20]), 3, 2, 0, 6), P.vioL, { op: 0.7 });
  // a fused, blistered plate where a strike went in: the striae melted flat, a glassy rim, the burn branching out
  { const c = ept(0.5, 0.42); f.part(X.lumpy(f, ell(c, 34, 22, 0.1, 14), 5), SHL({ fill: '#1a1214', light: mix(P.copperL, P.vioL, 0.5), cast: false, inkW: 1.4 })); f.flat(ell(add(c, [-6, -6]), 16, 8, 0.1, 10), mix(P.vioL, '#fff', 0.2), { op: 0.35 }); X.burn(f, add(c, [20, 6]), 0.4, 80, 1.8, { depth: 2 }); X.burn(f, add(c, [-24, 4]), 2.9, 70, 1.6, { depth: 2 }); }
  // ---- head (under the pronotum's front): small eye, lamellate antenna, mandibles
  f.bone('head');
  const HD = [[724, 860], [764, 858], [802, 876], [826, 906], [828, 936], [810, 958], [770, 964], [736, 952], [720, 922], [718, 886]];
  f.part(HD, SHL({ k: 0.9 }));
  X.ceye(f, [756, 900], 9, 12, 0.2, { glints: 0, kidney: 0.15 });
  X.mandible(f, [812, 950], 0.6, 26, 12, SHL({ fill: '#1e1614' }), 1);
  const ab = [790, 944]; X.antenna(f, [ab, [806, 968], [826, 978]], 7, legL, { n: 5 });
  for (let i = 0; i < 3; i++) f.part(ell([832 + i * 2, 980 + i * 7], 10, 4, 0.4, 8), SHL({ fill: '#3a2a20', cast: false, inkW: 1 })); // lamellate club
  // ---- pronotum: a shield with a sharp lateral margin, a scooped front, a carina into the short thoracic horn
  f.bone('body');
  const PR = [[554, 806], [578, 770], [628, 752], [690, 756], [730, 780], [756, 818], [768, 862, 1], [748, 898], [700, 918], [640, 924], [586, 914], [562, 882], [556, 842]];
  f.part(PR, SHL({ k: 0.9, maxShade: 36 }));
  X.clipDraw(f, PR, () => {
    f.flat([[702, 760], [744, 792], [766, 858], [742, 852], [718, 800]], '#000', { op: 0.45 }); // the front scoop in shadow
    f.stroke([[596, 786], [636, 766], [688, 770]], 5, mix(P.copperL, '#fff', 0.35), { op: 0.55 });
    f.flat([[586, 900], [640, 908], [700, 902], [748, 884], [756, 930], [560, 930]], '#000', { op: 0.4 }); // the turned-under margin
    f.line([[566, 890], [640, 900], [700, 894], [752, 874]], 1.8, mix(P.copperL, '#fff', 0.2), { op: 0.6 });
    for (let i = 0; i < 30; i++) f.flat(ell([R2(f, 580, 740), R2(f, 790, 890)], 1.8, 1.3, 0, 6), '#060404', { op: 0.65 });
    X.burn(f, [610, 850], -0.4, 50, 1.6, { depth: 2 });
  });
  f.line([[600, 800], [640, 776], [664, 760]], 2.4, INK, { op: 0.6 }); f.line([[602, 796], [642, 772]], 1.2, mix(P.copperL, '#fff', 0.3), { op: 0.6 }); // the carina
  f.part([[618, 762], [656, 728], [696, 704], [716, 696], [712, 710], [692, 732], [676, 768]], SHL({ cast: false }));
  f.line([[640, 750], [690, 712], [710, 700]], 1.4, mix(P.copperL, '#fff', 0.3), { op: 0.6 });
  f.line([[560, 808], [566, 860], [572, 910]], 5, INK, { op: 0.8 }); f.line([[560, 808], [566, 860], [572, 910]], 2.8, P.copper, { op: 0.9 });
  X.standingHair(f, [[562, 820], [564, 840], [566, 860], [568, 880], [570, 900]], 18, { col: '#1a1410', w: 2, fan: 0.6, lean: -0.5 });
  X.cordyceps(f, [596, 768], -1.95, 54, 5, { bend: 0.35 }); X.cordyceps(f, [578, 784], -2.4, 38, 4, { bend: -0.3 });
  // ---- the head horn, sweeping up and back, worn bright on the leading curve; stored lightning crackles to the thoracic horn
  f.bone('head');
  const HN = [[786, 906], [828, 844], [848, 774], [846, 714], [828, 666]], HT = X.tube(HN.slice(0, 4), [50, 40, 28, 17]);
  const HPT = [...HT.slice(0, 12), [826, 662, 1], ...HT.slice(19)];
  f.part(HPT, SHL({ k: 0.9 }));
  f.line([[808, 880], [836, 820], [850, 760], [846, 710]], 2.2, mix(P.copperL, '#fff', 0.35), { op: 0.65 });
  for (let i = 0; i < 6; i++) { const q = lerp([800, 890], [846, 720], i / 6); f.line([add(q, [-12, 0]), add(q, [8, 4])], 1.1, INK, { op: 0.45 }); }
  X.scorch(f, [838, 700], 10, 18, 0.5);

  // the stored lightning shows as burns, not arcs: a fern burnt the length of the horn, the tip fused and blistered,
  // bristles standing on end along its base
  X.clipDraw(f, HPT, () => { X.burn(f, [808, 870], -1.2, 200, 2.2, { depth: 3 }); f.flat(ell([830, 676], 12, 22, 0.4, 10), '#140e10', { op: 0.75 }); f.flat(ell([826, 680], 5, 9, 0.4, 8), mix(P.vioL, '#fff', 0.3), { op: 0.45 }); }); // the tip fused glassy where the charge leaves it
  X.standingHair(f, [[792, 900], [800, 884], [810, 868], [818, 852]], 16, { col: '#1a1410', w: 2, fan: 0.6, lean: 0.4 });
  // ---- near legs, the hind knee welded stiff by a strike
  LN.forEach((J, i) => { f.bone('leg_n' + (i + 1)); X.ileg(f, J, 40, legL, { spines: i === 0 ? 5 : 3, hairs: 6, planted: true }); });
  f.bone('leg_n3');
  f.part(X.lumpy(f, ell(LN[2][2], 26, 20, 0.2, 12), 4), SHL({ fill: '#2a1e18', light: mix(P.copperL, P.vioL, 0.3), cast: false }));
  f.line([add(LN[2][2], [-14, -6]), add(LN[2][2], [10, -10])], 2.2, P.copper, { op: 0.9 });
  X.burn(f, add(LN[2][2], [6, 4]), 1.0, 40, 1.4, { depth: 2 });
  f.bone('leg_n1'); X.mould(f, lerp(LN[0][3], LN[0][4], 0.3), 10, 14, 10);
  // ---- ground
  f.bone('root');
  f.flat(ell([500, gy + 2], 400, 10, 0, 24), '#14121a', { op: 0.5 });
  for (const x of [238, 726, 892]) f.flat(ell([x, gy - 1], 18, 3, 0, 8), '#3a3430', { op: 0.6 });
  return f;
}

// ------------------------------------------------------------------ PUPPET HOST (cast, human 1.0)
// A pilgrim off the plain road whom the hive has hollowed and filled with larvae; it moves when they do. Still dressed
// for the road: a wide-brimmed pilgrim hat with a lead ampulla pinned to the turned-up brim, a dusty hooded cape and a
// long cloak, a pack and bedroll on its back, a scrip at the belt, a walking staff with a gourd tied under the knob.
// The posture is a broken doll's: the near shoulder hiked to the ear, the elbow jerked out, the head lolled over on its
// neck, the near knee buckled forward while the body hangs on the staff; the far arm dangles with the wrist bent back.
// Toxin is the one part pushed hard: the throat and jaw are swollen into a goitre of larvae under stretched, shiny skin
// that bulges where they move, holed where they come and go (cheek, throat, the back of the staff hand). Lightning left a
// fern from the temple down the neck and a burn down the far hand. Rot breaks the outline: holes and mould in the cloak,
// fruiting stalks out of the shoulder and the pack.
// Rig: standard humanoid + staff (parent hand_n) + cape (cloak back, parent torso) + pack (parent torso).
// Motion: idle twitching as the larvae move (head, shoulders); attack a jerking staff swing (near arm up and over).
function puppetHost() {
  const seed = 1005, h = TIERS.human[1];
  const f = new Fig(X.base(seed, h, { grimeY: 600 }));
  X.texturesX(f);
  const H = 98, gy = f.o.groundY, sd = seed;
  const SKN = (o = {}) => X.SKX(f, o), CL = (o = {}) => X.CLK(f, o);
  const tunic = '#7a7262', hose = '#4e463c';
  const Pv = [282, 486], Tj = [284, 466], N0 = [318, 282], HC = [336, 228], hA = -0.3;
  const SN = [296, 300], EN = [390, 384], WN = [468, 398];
  const SF = [346, 300], EF = [372, 398], WF = [394, 470];
  const HN = [296, 494], KN = [346, 610], AN = [300, 744];
  const HF = [258, 490], KF = [246, 620], AF = [206, 748];
  X.humanJoints(f, { P: Pv, T: Tj, N: N0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const sT = [450, 150], sB = [496, 786], sA = ang(sT, sB);
  f.joint('staff', WN, 'hand_n').joint('cape', [300, 300], 'torso').joint('pack', [256, 330], 'torso');
  const ankle = (K0, A) => add(E.norm(sub(A, K0)), [0.6, 0]);

  // ---- cloak back panel: long, heavy with dust, hem rotted into holes and torn tongues
  f.bone('cape');
  const CB = [[300, 290], [256, 296], [222, 328], [202, 400], [182, 500], [164, 600], [148, 668], [164, 700, 1], [184, 676], [198, 714, 1], [220, 686], [238, 718, 1], [260, 690], [284, 708, 1], [300, 682], [312, 600], [318, 470], [320, 360]];
  f.part(CB, CL({ fill: P.cloakD }));
  X.clipDraw(f, CB, () => { for (const pts of [[[236, 340], [212, 480], [188, 660]], [[262, 340], [250, 500], [232, 680]], [[290, 360], [290, 520], [276, 690]]]) f.stroke(pts, 3.2, '#1e1812', { op: 0.6 }); for (const pts of [[[248, 360], [232, 500], [212, 650]]]) f.stroke(pts, 2, mix(P.cloakD, '#fff', 0.2), { op: 0.5 }); f.flat([[140, 600], [320, 600], [320, 720], [140, 720]], '#2a2420', { op: 0.35 }); });
  X.hole(f, [214, 560], 8, 11, 0.2, { lip: P.cloakL, bruise: '#2a2420' }); X.hole(f, [248, 626], 6, 8, 0, { lip: P.cloakL, bruise: '#2a2420' });
  X.mould(f, [196, 660], 30, 22, 30);
  // ---- the pack: a strapped bedroll over a satchel, a fruiting stalk through its flap
  f.bone('pack');
  f.part([[226, 312], [270, 300], [282, 330], [280, 420], [240, 430], [218, 400]], X.CLK(f, { fill: P.leath, shadow: P.leathD, tex: 'wrinkle' + sd, texOp: 0.5 }));
  f.part([[222, 316], [274, 304], [270, 336], [226, 346]], X.CLK(f, { fill: P.leathD, cast: false, inkW: 1.2 }));
  f.part(limb([200, 300], [276, 290], 40, 40, { steps: 6, capK: 0.45 }), CL({ fill: '#5e5446', tex: 'weave' + sd }));
  f.part(ell([200, 300], 13, 20, -0.1, 12), CL({ fill: '#6e6250', shade: 0.3, cast: false }));
  f.line(ell([200, 300], 7, 11, -0.1, 10), 1, INK, { op: 0.6 });
  for (const x of [222, 256]) f.line([[x, 278], [x + 2, 322]], 4, P.leathD, { straight: true });
  X.cordyceps(f, [246, 304], -2.1, 58, 4.5, { bend: 0.4 }); X.cordyceps(f, [260, 302], -1.7, 40, 3.6, { bend: -0.3 });

  // ---- far arm: dangling, behind the body; the wrist bent back, the hand hanging, burnt and holed
  X.armRig(f, SF, EF, WF, [46, 38, 32], CL({ fill: mix(tunic, '#000', 0.2), tex: 'weave' + sd }), '_f');
  f.bone('hand_f');
  const fh = X.openHand(f, WF, 1.2, 52, { look: SKN({ fill: mix(P.skin, P.skinS, 0.15) }), back: true, curl: 0.55, spread: 0.08, flip: true });
  X.hole(f, add(WF, [4, 14]), 4.5, 3.5, 0.6); X.skinBurn(f, add(WF, [-2, 2]), 1.9, 40, 1.4, { depth: 2 });

  // ---- far leg: hose, rag-bound shin, a turnshoe; stiff, braced back
  X.legTube(f, HF, KF, lerp(KF, AF, 0.3), [74, 58, 50], CL({ fill: hose, tex: 'weave' + sd }), '_f', { A: AF });
  f.bone('shin_f');
  f.part(limb(lerp(KF, AF, 0.28), AF, 50, 38, { steps: 6, q: [[0.25, 0.15, 0.2]] }), CL({ fill: '#6a604e', tex: 'weave' + sd }));
  for (let i = 0; i < 6; i++) f.line([lp(KF, AF, 0.35 + i * 0.1, -20), lp(KF, AF, 0.4 + i * 0.1, 18)], 1.6, '#2e2620', { op: 0.7 });
  X.bootRig(f, KF, AF, 50, '#3a2e22', '_f', { tex: 'mottle' + sd, shaft: 0.4, toe: 1.12, strap: true });

  // ---- torso: tunic over a gaunt hollowed body, belt, scrip; the cape over the shoulders
  f.bone('torso');
  const TOR = [[318, 284], [358, 294], [386, 324], [396, 380], [390, 430], [378, 470], [330, 504], [266, 506], [232, 482], [228, 420], [234, 360], [250, 310], [288, 286]];
  f.part(TOR, CL({ fill: tunic, shadow: '#2e2a24' }));
  X.clipDraw(f, TOR, () => {
    for (const pts of [[[360, 340], [350, 420], [356, 480]], [[300, 330], [296, 420], [300, 490]], [[330, 360], [340, 440]]]) f.stroke(pts, 2.4, '#2e2820', { op: 0.6 });
    // the larvae under the tunic: the cloth lifts in bumps over the belly
    for (const [c, r] of [[[352, 420], 13], [[330, 452], 10], [[362, 456], 9]]) { f.flat(ell(add(c, [3, 6]), r, r * 0.6, 0.3, 10), '#1e1a16', { op: 0.45 }); f.flat(ell(add(c, [-2, -3]), r * 0.8, r * 0.5, 0.3, 10), mix(tunic, '#fff', 0.25), { op: 0.45 }); }
    f.flat([[244, 470], [380, 470], [380, 510], [244, 510]], '#2a2420', { op: 0.3 });
  });
  X.hole(f, [270, 400], 6, 8, 0.1, { lip: mix(tunic, '#fff', 0.2), bruise: '#2a2420' });
  // pack straps over the shoulder, down the chest to a buckle
  f.part([[300, 296], [314, 292], [346, 380], [352, 452], [340, 454], [334, 384]], X.CLK(f, { fill: P.leath, shadow: P.leathD, tex: 'wrinkle' + sd, cast: false, inkW: 1.2 }));
  f.part([[338, 420], [356, 418], [358, 436], [340, 438]].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  // belt, scrip (pilgrim's purse) on a cord, a knife
  f.bone('pelvis');
  f.part([[244, 474], [300, 480], [366, 472], [370, 488], [300, 496], [242, 490]], X.CLK(f, { fill: P.leathD, shadow: '#140e0a', tex: 'wrinkle' + sd, k: 0.5 }));
  f.part([[304, 476], [318, 476], [318, 492], [304, 492]].map(q => [...q, 1]), { fill: P.ironL, shade: 0.4, inkW: 1, cast: false });
  f.part([[250, 494], [292, 494], [296, 548], [274, 560], [248, 548]], X.CLK(f, { fill: P.leath, shadow: P.leathD, tex: 'wrinkle' + sd }));
  f.part([[248, 492], [294, 492], [290, 516], [270, 522], [250, 514]], X.CLK(f, { fill: P.leathD, cast: false, inkW: 1.2 }));
  f.line([[270, 520], [271, 530]], 2, INK); X.mould(f, [262, 540], 12, 8, 10);
  f.part([[350, 488], [360, 488], [362, 530], [354, 548], [348, 528]], X.CLK(f, { fill: '#2e2620', cast: false }));
  // ---- near leg: the knee buckled forward and in, the body hanging off the staff
  X.legTube(f, HN, KN, lerp(KN, AN, 0.3), [78, 60, 52], CL({ fill: mix(hose, '#000', 0.05), tex: 'weave' + sd }), '_n', { A: AN, bq: [[0, 0.4, 0.12]] });
  f.bone('shin_n');
  f.part(limb(lerp(KN, AN, 0.28), AN, 52, 40, { steps: 6, q: [[0.25, 0.15, 0.2]] }), CL({ fill: '#746a56', tex: 'weave' + sd }));
  for (let i = 0; i < 6; i++) f.line([lp(KN, AN, 0.35 + i * 0.1, -21), lp(KN, AN, 0.4 + i * 0.1, 19)], 1.6, '#2e2620', { op: 0.7 });
  f.line([lp(KN, AN, 0.9, 18), lp(KN, AN, 0.94, 30), lp(KN, AN, 1.0, 34)], 2, '#746a56'); // the loose end of the binding
  X.bootRig(f, KN, AN, 52, '#40322a', '_n', { tex: 'mottle' + sd, shaft: 0.4, toe: 1.1 });
  f.bone('thigh_n');
  f.part([lp(HN, KN, 0.5, -20), lp(HN, KN, 0.46, 10), lp(HN, KN, 0.7, 12), lp(HN, KN, 0.74, -18)].map(q => [...q, 1]), CL({ fill: mix(hose, P.cloak, 0.5), cast: false, inkW: 1.1 }));
  f.stitches([lp(HN, KN, 0.5, -20), lp(HN, KN, 0.46, 10), lp(HN, KN, 0.7, 12), lp(HN, KN, 0.74, -18), lp(HN, KN, 0.5, -20)], '#b8a880', 0.8);
  f.bone('cape');
  X.mould(f, [292, 664], 14, 12, 14);

  // ---- the cape over the shoulders (hood thrown back), on the torso
  f.bone('torso');
  const CP = [[264, 290], [300, 272], [340, 280], [374, 306], [396, 350], [392, 392, 1], [376, 376], [364, 404, 1], [350, 382], [332, 408, 1], [318, 380], [298, 400, 1], [280, 376], [258, 394, 1], [240, 356], [244, 310]];
  f.part(CP, CL());
  X.clipDraw(f, CP, () => { for (const pts of [[[300, 300], [302, 350], [296, 390]], [[336, 306], [344, 352], [340, 392]]]) f.stroke(pts, 2.2, '#2a221a', { op: 0.6 }); });
  f.part([[240, 290], [276, 268], [304, 274], [300, 296], [268, 318], [238, 318]], CL({ fill: P.cloakD, cast: false })); // the hood bunched at the nape
  X.hole(f, [372, 360], 5, 7, 0.2, { lip: P.cloakL, bruise: '#2a2420' });
  X.cordyceps(f, [282, 300], -2.0, 44, 4, { bend: 0.5 });

  // ---- near arm: the shoulder hiked, the elbow jerked out, the fist on the staff (holed, a larva in the back of it)
  X.armRig(f, SN, EN, WN, [52, 42, 34], CL({ fill: tunic, tex: 'weave' + sd }), '_n', { bp: [[0, 0.5, 0.12]] });
  f.bone('upperarm_n');
  f.part(K.ragLimb(f, add(SN, [-4, -8]), lerp(SN, EN, 0.6), 64, 56, { depth: 10, teeth: 5 }), CL());
  f.bone('forearm_n');
  f.part(limb(lerp(EN, WN, 0.5), WN, 34, 30, { steps: 4, p: [[0.4, 0.12, 0.25]] }), SKN());
  f.line([lp(EN, WN, 0.6, -6), lp(EN, WN, 0.95, -4)], 1, P.skinS, { op: 0.6 }); // tendon
  for (const [c, r] of [[lerp(EN, WN, 0.72), 6]]) { f.flat(ell(c, r * 1.2, r, 0.3, 8), mix(P.skin, '#fff', 0.25), { op: 0.6 }); f.flat(ell(add(c, [1, 3]), r, r * 0.5, 0.3, 8), P.skinS, { op: 0.4 }); } // a bulge where a larva moves
  f.bone('staff');
  f.part(limb(sT, sB, 15, 13, { steps: 10, capK: 0.5 }), { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.4, tex: 'wood' + sd, texOp: 0.6 });
  f.line([lp(sT, sB, 0.02, -4), lp(sT, sB, 0.98, -3)], 1, P.woodL, { op: 0.6, straight: true });
  f.part(ell(add(sT, [0, -6]), 12, 13, 0, 12), { fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.42, tex: 'wood' + sd, texOp: 0.6, inkW: 1.3 }); // the knob
  f.part(limb(add(sB, [-3, -24]), add(sB, [0, 2]), 17, 14, { steps: 3 }), { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.1, cast: false }); // iron ferrule
  // the gourd tied under the knob, hanging plumb; scorched where a strike ran down the staff
  const gc0 = lp(sT, sB, 0.08, 12);
  f.line([gc0, add(gc0, [4, 14])], 2.2, '#6e5e40');
  f.part([add(gc0, [-2, 12]), add(gc0, [12, 12]), add(gc0, [20, 30]), add(gc0, [22, 50]), add(gc0, [10, 64]), add(gc0, [-4, 56]), add(gc0, [-6, 36]), add(gc0, [0, 24])], { fill: '#8a7a52', shadow: '#3a2e1a', light: '#b8a676', shade: 0.42, tex: 'mottle' + sd, texOp: 0.5, inkW: 1.3 });
  f.part(ell(add(gc0, [5, 11]), 5, 3, 0, 8), { fill: '#4a3a22', shade: 0.3, inkW: 1, cast: false });
  X.burn(f, lp(sT, sB, 0.2, 0), sA + 0.1, 120, 1.6, { depth: 2 });
  X.scorch(f, lp(sT, sB, 0.12, 0), 8, 16, 0.45);
  f.bone('hand_n');
  B.grip(f, WN, EN, -Math.PI / 2 + 0.1, 25, P.skin, { tex: 'mottle' + sd, texOp: 0.5, shadow: P.skinS, name: 'puppet staff' });
  X.hole(f, add(WN, [-6, -6]), 4, 3, 0.3); X.grub(f, add(WN, [-6, -8]), -1.8, 0.35, { curl: 0.3 });

  // ---- head: lolled over on its neck, eyes rolled up into the lids, mouth slack; the swollen throat and jaw
  f.bone('head');
  f.part(limb(N0, add(HC, [-14, 28]), 50, 44, { steps: 4 }), SKN());
  const hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, {
    skin: P.skin, jaw: 1.05, chin: -0.01, nose: 1.02, hook: 0.2, mouth: 'set', squint: 0.0, browDown: -0.02, age: true, gaunt: true,
    eyeWhite: '#d8d2c0', iris: '#d8d2c0', hairCol: '#4a4238', beard: 'stubble', beardCol: '#3a342e', faceShade: 0.8, jawShade: 0.55,
  });
  // eyes rolled up: a sliver of iris under each upper lid
  f.flat(hF(ell([0.12, -0.085], 0.02, 0.01, 0, 6)), '#4a4a44', { op: 0.8 }); f.flat(hF(ell([0.29, -0.085], 0.012, 0.008, 0, 6)), '#4a4a44', { op: 0.8 });
  f.flat(hF([[0.18, 0.26], [0.26, 0.25], [0.32, 0.27], [0.31, 0.34], [0.25, 0.36], [0.19, 0.32]]), '#1a1210'); // slack open mouth
  f.flat(hF([[0.21, 0.262], [0.27, 0.258], [0.29, 0.27], [0.22, 0.273]]), P.boneD, { op: 0.9 });
  X.skinBurn(f, hF([[-0.16, -0.2]])[0], hA + 1.75, 70, 1.8, { depth: 2 });
  // the goitre: throat and jaw swollen with larvae, stretched shiny skin, the lumps where they move, holes
  const GT = [hF([[-0.22, 0.22]])[0], hF([[0.06, 0.4]])[0], hF([[0.26, 0.52]])[0], add(N0, [72, 6]), add(N0, [80, 34]), add(N0, [66, 70]), add(N0, [34, 82]), add(N0, [4, 64]), add(N0, [-16, 30]), hF([[-0.3, 0.4]])[0]];
  f.part(X.lumpy(f, GT, 4), SKN({ fill: mix(P.skin, P.venP, 0.2), shade: 0.32 }));
  X.clipDraw(f, GT, () => {
    for (const [c, r] of [[add(N0, [34, 14]), 17], [add(N0, [10, 34]), 14], [add(N0, [56, 44]), 15], [add(N0, [36, 62]), 12], [hF([[0.08, 0.5]])[0], 12]]) {
      f.flat(ell(add(c, [2, 5]), r * 1.1, r * 0.7, 0.4, 10), P.skinS, { op: 0.4 });
      f.flat(ell(c, r, r * 0.75, 0.4, 10), mix(P.skin, '#fff', 0.2), { op: 0.6 });
      X.grub(f, c, 0.4 + f.r(), r / 14, { col: P.venP, curl: 0.8 }); // the larva showing through the stretched skin
      f.flat(ell(c, r * 1.05, r * 0.8, 0.4, 10), mix(P.skin, P.venP, 0.15), { op: 0.68 });
      f.line([add(c, [-r * 0.5, -r * 0.5]), add(c, [r * 0.2, -r * 0.7])], 1.4, '#f4efe2', { op: 0.7 }); // sheen
    }
    for (let i = 0; i < 8; i++) { const q = add(N0, [R2(f, -10, 70), R2(f, -6, 70)]); f.line([q, add(q, [6, 4]), add(q, [10, 12])], 0.9, '#5a4e6a', { op: 0.6 }); } // veins
  });
  X.hole(f, add(N0, [62, 28]), 7, 6, 0.4); X.grub(f, add(N0, [66, 32]), 0.6, 0.7); X.hole(f, add(N0, [24, 72]), 5, 4, 0.2); X.pustules(f, add(N0, [50, 60]), 16, 10, 3, 2.5, 4.5);
  X.hole(f, hF([[0.06, 0.16]])[0], 5, 4, hA); // the hole in the cheek
  X.grub(f, add(hF([[0.06, 0.16]])[0], [2, 4]), hA + 1.2, 0.5, { curl: 0.4 });
  // the pilgrim hat: a wide brim turned up at the front, pinned with a lead ampulla; a cord under the chin
  const crown = [[-0.36, -0.3], [-0.34, -0.62], [-0.18, -0.8], [0.12, -0.82], [0.32, -0.66], [0.38, -0.3]];
  f.part(hF(crown), CL({ fill: '#4e4436', shadow: '#1e1812', tex: 'mottle' + sd }));
  f.part(hF([[-0.38, -0.36], [0.38, -0.36], [0.4, -0.27], [-0.38, -0.25]]), X.CLK(f, { fill: P.leathD, cast: false, inkW: 1.1 }));
  const brim = [[-0.95, -0.2], [-0.6, -0.34], [0.0, -0.38], [0.42, -0.36], [0.66, -0.44], [0.82, -0.54], [0.88, -0.48], [0.74, -0.34], [0.5, -0.2], [0.0, -0.18], [-0.6, -0.12], [-0.98, -0.08]];
  f.part(hF(brim), CL({ fill: '#5a4e3e', shadow: '#1e1812', tex: 'mottle' + sd }));
  f.line(hF([[-0.9, -0.12], [-0.4, -0.18], [0.2, -0.2], [0.6, -0.3]]), 1.4, mix('#5a4e3e', '#fff', 0.25), { op: 0.5 });
  X.hole(f, hF([[-0.62, -0.18]])[0], 5, 3, hA, { lip: '#6a5e4c', bruise: '#2a2420' });
  const amp = hF([[0.68, -0.46]])[0], AF2 = frame(amp, hA - 0.6, 1);
  f.part(AF2([[-6, -10], [6, -10], [9, 2], [6, 10], [-6, 10], [-9, 2]]), { fill: '#7a7a76', shadow: '#2a2a2a', shade: 0.42, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'pit' + sd, texOp: 0.6 });
  f.part(AF2([[-3, -16], [3, -16], [3, -10], [-3, -10]]), { fill: '#6a6a66', shade: 0.4, inkW: 1, cast: false });
  f.line(AF2([[-3, -2], [3, -2]]), 1, INK, { op: 0.6 }); f.line(AF2([[0, -6], [0, 4]]), 1, INK, { op: 0.6 });
  // lank hair falling plumb from under the brim at the back
  for (let i = 0; i < 7; i++) { const q = hF([[-0.42 + i * 0.03, -0.12 + i * 0.05]])[0], l = 40 + f.r() * 30; f.stroke([q, add(q, [-3 + f.r() * 4, l * 0.5]), add(q, [-2 + f.r() * 6, l])], 3.4, i % 2 ? '#4a4238' : '#5e564a'); }
  f.line([hF([[-0.3, -0.2]])[0], hF([[-0.1, 0.4]])[0], hF([[0.1, 0.52]])[0]], 1.4, P.leathD, { op: 0.8 }); // hat cord
  f.bone('root');
  f.flat(ell([300, gy + 2], 190, 7, 0, 20), '#14121a', { op: 0.45 });
  return f;
}

// setae along a leg segment a->b of width w: short stiff hairs on both edges, leaning toward the tip, a few pale
function setaeRow(f, a, b, w, n, o = {}) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
  for (let i = 0; i < n; i++) {
    const t = 0.06 + (i + f.r() * 0.6) / n * 0.9, sg = i % 2 ? 1 : -1, ww = w * (1 - t * (o.taper ?? 0.25)) * 0.5, base = add(lerp(a, b, t), mul(nn, sg * ww * 0.92)), L = w * R2(f, 0.32, 0.6) * (o.len ?? 1);
    f.line([base, add(base, add(mul(nn, sg * L), mul(d, L * 0.7)))], R2(f, 0.9, 1.5), f.r() < 0.2 ? '#8a8494' : INK, { op: 0.85 });
  }
}
// a spider leg: [coxa, trochanter, knee (patella), tibia end, tip] through ileg, with the femur swelling, a patella knob
// at the knee, a knob at the tibia-metatarsus joint, and setae on every segment
function sleg(f, J, w, look, o = {}) {
  X.ileg(f, J, w, look, Object.assign({ spines: 4, hairs: 12, femurSpines: 2 }, o));
  // the femur swells in its first half (muscle in the segment), the metatarsus is long and thin
  const d = E.norm(sub(J[2], J[1]));
  f.part(X.mlimb(J[1], J[2], [[0, w * 0.45], [0.3, w * 0.62], [0.7, w * 0.46], [1, w * 0.38]], [[0, w * 0.45], [0.35, w * 0.56], [0.75, w * 0.42], [1, w * 0.36]], { capK: 0.5 }), Object.assign({}, look, { cast: false, k: 0.9 }));
  f.line([lp(J[1], J[2], 0.1, w * 0.3), lp(J[1], J[2], 0.5, w * 0.36), lp(J[1], J[2], 0.9, w * 0.2)], 1.6, look.light, { op: 0.55 });
  for (let i = 0; i < 9; i++) { const t = 0.1 + i * 0.09, sg = i % 2 ? 1 : -1, b = lp(J[1], J[2], t, sg * w * 0.5); f.line([b, add(b, add(mul([-d[1], d[0]], sg * w * 0.45), mul(d, w * 0.3)))], 1, INK, { op: 0.8 }); }
  f.part(ell(J[2], w * 0.5, w * 0.42, ang(J[1], J[2]), 10), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.15), cast: false, inkW: 1.1, inkHeavy: 1.6 }));
  if (o.fur) { setaeRow(f, J[2], J[3], w * 0.7, Math.round(o.fur * 1.2)); setaeRow(f, J[3], J[4], w * 0.34, o.fur, { len: 1.2 }); f.part(ell(J[3], w * 0.3, w * 0.26, ang(J[2], J[3]), 10), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.15), cast: false, inkW: 1 })); }
  if (o.band) for (const t of [0.15, 0.8]) { const a = lerp(J[2], J[3], t), d = E.norm(sub(J[3], J[2])), n = [-d[1], d[0]]; f.stroke([add(a, mul(n, w * 0.32)), add(a, mul(d, 2)), add(a, mul(n, -w * 0.3))], w * 0.18, o.band, { op: 0.7 }); }
}

// ------------------------------------------------------------------ VENOM SPIDER (cast, large 1.2 wide, hanging)
// A heavy black spider hanging head-down on its dragline between the spires, legs spread in a basket, the hind pair
// hooked on the thread above its spinnerets. A big hairy abdomen with copper-sheened chevrons edged in venom green and a
// burn fern across it; a broad hairy cephalothorax with its eye mound, fovea and radiating grooves; thick hairy legs with
// knobbed joints and copper bands at the knees; heavy chelicerae with the fangs out and venom on them. Behind it, a torn
// sheet of web strung with its prey: a silk-wrapped bird with a charred wing and foot sticking out, and a burnt moth,
// both killed by the lightning it waits for. Lightning burnt ferns across the abdomen and carapace and fused one knee;
// toxin ripens pustules under the abdomen, mould in the leg joints, venom on the fangs.
// Rig: thread (root, the anchor above) + abdomen (at the spinnerets) + body (prosoma, at the pedicel) + leg_n1..4,
// leg_f1..4 + chelicera_n, chelicera_f + palp_n, palp_f + web (root) + prey (parent web).
// Motion: idle a slow spin on the thread (thread bone); attack a drop and bite (abdomen and body drop, chelicerae open).
function venomSpider() {
  const seed = 1004, h = TIERS.large[1];
  const f = new Fig(X.base(seed, h, { grimeY: 1200 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const BLK = (o = {}) => X.CH(f, Object.assign({ fill: '#24222a', light: '#5e5868', tex: 'setae' + sd, texOp: 0.45 }, o));
  const legN = BLK({ fill: '#2a2830' }), legF = BLK({ fill: '#18161c', light: '#45404e' });
  const UP = 140, U = q => [q[0], q[1] - UP], UJ = J => J.map(U); // the spider hangs well clear of the ground
  const TA = [412, 0], SP = U([414, 336]), PD = U([452, 652]), PC = U([486, 746]);
  const LN = [
    [[552, 708], [576, 700], [706, 610], [834, 690], [886, 820]],
    [[560, 748], [588, 754], [732, 760], [810, 902], [828, 1012]],
    [[486, 806], [466, 828], [356, 884], [318, 1002], [350, 1070]],
    [[450, 712], [424, 704], [288, 610], [306, 452], [408, 318]],
  ];
  const LF = [
    [[540, 694], [560, 682], [660, 578], [794, 578], [862, 648]],
    [[552, 726], [576, 722], [718, 690], [822, 772], [872, 862]],
    [[468, 786], [448, 798], [292, 804], [216, 922], [228, 1012]],
    [[444, 692], [420, 678], [318, 540], [350, 410], [410, 290]],
  ];
  LN.forEach((J, i) => { LN[i] = UJ(J); }); LF.forEach((J, i) => { LF[i] = UJ(J); });
  const CHN = U([534, 846]), CHF = U([512, 834]), PLN = U([560, 826]), PLF = U([540, 812]);
  f.joint('thread', TA, null).joint('abdomen', SP, 'thread').joint('body', PD, 'abdomen');
  LN.forEach((J, i) => f.joint('leg_n' + (i + 1), J[0], 'body')); LF.forEach((J, i) => f.joint('leg_f' + (i + 1), J[0], 'body'));
  f.joint('chelicera_f', CHF, 'body').joint('chelicera_n', CHN, 'body').joint('palp_n', PLN, 'body').joint('palp_f', PLF, 'body');
  f.joint('web', [120, 300], null).joint('prey', [176, 380], 'web');

  // ---- the web behind: a torn sheet strung from the left, radials and a few turns of the spiral, prey in it
  f.bone('web');
  const hub = [150, 300];
  for (const e of [[0, 60], [0, 250], [0, 470], [80, 0], [250, 0], [330, 150], [300, 520], [120, 640]]) X.silk(f, hub, e, { w: 1.2, op: 0.55, sag: 6 });
  for (let r = 40; r < 200; r += 34) { const pts = []; for (let i = 0; i <= 8; i++) { const a = -2.0 + i * 0.42; pts.push(add(hub, [Math.cos(a) * r * 1.1, Math.sin(a) * r + 4])); } f.line(pts, 1, P.silk, { op: 0.45 }); }
  X.silk(f, [330, 150], [300, 520], { w: 1, op: 0.4, sag: 10 }); // a torn strand hanging
  // a burnt moth caught in the radials
  const mo = [86, 190]; for (const [a, l] of [[-0.6, 34], [0.5, 30], [2.6, 30], [3.6, 26]]) f.part([mo, add(mo, rot([l, -6], a)), add(mo, rot([l * 0.9, 8], a))], { fill: '#3a3430', shade: 0.4, inkW: 1, cast: false, tex: 'mottle' + sd, texOp: 0.6 });
  f.part(ell(mo, 6, 14, 0.2, 10), BLK({ fill: '#2a2420', cast: false })); X.scorch(f, add(mo, [10, -4]), 14, 8, 0.6); X.burn(f, add(mo, [-6, 4]), 2.6, 26, 1, { depth: 1 });
  // the wrapped bundle: a bird bound in silk, a charred wing and a clenched foot sticking out
  f.bone('prey');
  X.silk(f, [176, 300], [176, 380], { w: 1.4, op: 0.8 });
  f.part([[168, 380], [186, 384], [200, 412], [212, 440], [206, 468], [198, 500], [186, 520], [176, 534], [160, 516], [148, 486], [152, 456], [146, 428], [156, 402]], { fill: '#9e98a0', shadow: '#3e3a46', light: '#c8c2cc', shade: 0.4, tex: 'wrinkle' + sd, texOp: 0.7 });
  for (let i = 0; i < 9; i++) f.line([[148, 396 + i * 15], [176, 404 + i * 15], [208, 392 + i * 16]], 1, INK, { op: 0.35 });
  for (const q of [[140, 430], [212, 400], [200, 500]]) X.silk(f, add(q, [0, 0]), add(q, [(f.r() - 0.5) * 30, 26]), { w: 0.9, op: 0.6 });
  const wg = [206, 438]; for (let i = 0; i < 5; i++) { const a = -0.5 + i * 0.22; f.part([add(wg, [0, i * 4]), add(wg, rot([62 - i * 6, -4], a)), add(wg, rot([58 - i * 6, 8], a)), add(wg, [4, i * 4 + 8])], { fill: '#2a2420', shadow: '#0c0a08', shade: 0.4, inkW: 1, cast: false, tex: 'mottle' + sd, texOp: 0.6 }); }
  X.scorch(f, [228, 430], 24, 14, 0.6); X.burn(f, [190, 450], 0.2, 44, 1.4, { depth: 2, col: '#5a4870' });
  for (const [a, l] of [[1.9, 26], [1.4, 22], [2.4, 20]]) f.line([[170, 526], add([170, 526], rot([l, 0], a))], 3, '#5a4a3a'); // the foot, clenched
  f.flat(ell([176, 470], 18, 26, 0, 12), '#2a2420', { op: 0.25 });
  f.part([[160, 392], [150, 384], [136, 380, 1], [150, 396]], { fill: '#3a3430', shade: 0.4, inkW: 1, cast: false }); // the beak through the wrapping

  // ---- the dragline: a doubled silk line from the anchor above to the spinnerets, taut under the weight
  f.bone('thread');
  X.silk(f, TA, SP, { w: 3, op: 0.95 }); X.silk(f, add(TA, [4, 0]), add(SP, [3, -4]), { w: 1.2, op: 0.6 });
  for (const y of [90, 160]) f.flat(ell([TA[0] + (SP[0] - TA[0]) * y / SP[1], y], 2.4, 3.2, 0, 6), P.silk, { op: 0.7 }); // knots of re-spun silk
  // ---- far legs
  LF.forEach((J, i) => { f.bone('leg_f' + (i + 1)); sleg(f, J, 34, legF, { band: mix(P.copperD, '#000', 0.2), fur: 10 }); });
  f.bone('palp_f'); X.ileg(f, [PLF, add(PLF, [16, 12]), add(PLF, [52, 22]), add(PLF, [64, 60]), add(PLF, [70, 80])], 16, legF, { spines: 1, hairs: 8 });
  f.bone('chelicera_f');
  f.part([add(CHF, [-12, -14]), add(CHF, [28, -10]), add(CHF, [44, 46]), add(CHF, [30, 100]), add(CHF, [2, 70])], BLK({ fill: '#1c1a20' }));
  f.part([add(CHF, [22, 90]), add(CHF, [38, 94]), add(CHF, [34, 132]), add(CHF, [12, 156, 1]), add(CHF, [24, 124])], { fill: '#0c0b0e', light: '#4a4656', shade: 0.4, inkW: 1, cast: false, hatch: false });

  // ---- the abdomen: big and heavy, pinched at the pedicel, two shoulder humps, sagging under its own weight; hairs
  // break the edge; copper chevrons edged venom green down the back; burn ferns; pustules and mould under it
  f.bone('abdomen');
  const AC = [421, 470], SA = q => U(add(AC, mul(sub(q, AC), 1.32)));
  const AB = [[438, 600], [404, 580], [366, 544], [346, 500], [342, 456], [354, 414], [380, 380], [406, 362], [424, 362], [446, 376], [470, 398], [494, 410], [500, 438], [492, 470], [498, 504], [490, 548], [470, 584], [452, 602]].map(SA);
  X.furMass(f, AB, BLK({ fill: '#26242c', maxShade: 50 }), { len: 11, edge: 7, flow: p => Math.atan2(p[1] - 640, p[0] - 446) + 0.4, litShare: 0.35,
    skip: p => p[1] > 630 || E.len(sub(p, SP)) < 16,
    under: () => {
      for (let i = 0; i < 5; i++) { const c = SA(lerp([420, 400], [450, 560], i / 4.6)), w = (24 - i * 2.4) * 1.32; const ch = [add(c, [-w, -8]), add(c, [0, 13]), add(c, [w, -8]), add(c, [w * 0.8, 3]), add(c, [0, 24]), add(c, [-w * 0.8, 3])]; f.flat(ch.map(q => add(q, [0, 4])), P.ven, { op: 0.6 }); f.flat(ch, i % 2 ? P.copper : mix(P.copper, P.copperL, 0.3), { op: 0.8 }); }
      for (let i = 0; i < 12; i++) f.flat(ell(SA([R2(f, 350, 490), R2(f, 380, 590)]), R2(f, 3, 7), R2(f, 2, 4), f.r() * 3, 8), P.venD, { op: 0.6 }); // venom-green flecks
      f.flat(ell(SA([430, 470]), 60, 96, -0.2, 16), P.copperL, { op: 0.1 });
      f.flat([SA([346, 450]), SA([370, 380]), SA([356, 360]), SA([340, 430])], '#000', { op: 0.3 });
      f.flat(ell(SA([446, 560]), 70, 40, 0.3, 14), '#000', { op: 0.3 }); // the sag in shadow
    } });
  for (const [c, a] of [[[470, 400], -0.5], [[360, 420], -2.2]]) f.part(X.lumpy(f, ell(SA(c), 26, 19, a, 10), 3), BLK({ fill: '#2a2830', cast: false })); // the shoulder humps
  X.burn(f, SA([372, 470]), -0.6, 130, 2.6, { depth: 3 }); X.burn(f, SA([480, 430]), 2.4, 70, 1.8, { depth: 2 });
  X.pustules(f, SA([470, 540]), 24, 36, 7, 3.5, 7);
  X.mould(f, SA([380, 560]), 26, 20, 24);
  for (const [dx, a] of [[-10, -1.9], [0, -1.6], [10, -1.3]]) f.part(limb(add(SP, [dx, 12]), add(SP, [dx * 1.4 + Math.cos(a) * 16, 12 + Math.sin(a) * 16]), 11, 7, { steps: 3 }), BLK({ fill: '#3a3640', cast: false, inkW: 1 })); // spinnerets

  // ---- prosoma: a broad hairy carapace pointing down and forward, the eye mound raised, fovea and radiating grooves,
  // a venom-green band down each side, a burn fern across it
  f.bone('body');
  const SC = q => add(PC, mul(sub(q, [474, 640]), 1.75));
  f.part(limb(PD, add(PD, [14, 24]), 34, 30, { steps: 3 }), BLK({ cast: false }));
  const CA = [[446, 600], [480, 598], [512, 614], [534, 642], [540, 674], [526, 700], [500, 708], [470, 698], [448, 672], [438, 640]].map(SC);
  X.furMass(f, CA, BLK({ fill: '#2e2c34', maxShade: 40 }), { len: 8, edge: 7, litShare: 0.4, flow: p => Math.atan2(p[1] - PC[1], p[0] - PC[0]), skip: p => p[1] < PC[1] - 60 && p[0] < PC[0],
    under: () => {
      for (const sg of [-1, 1]) f.flat(ell(add(PC, rot([0, sg * 52], 0.95)), 70, 14, 0.95, 12), P.venD, { op: 0.55 }); // venom-green side bands
      f.stroke([add(PC, [10, -70]), add(PC, [60, -40]), add(PC, [86, 10])], 8, P.chitP, { op: 0.35 });
      f.flat([add(PC, [10, 60]), add(PC, [120, 20]), add(PC, [120, 110]), add(PC, [10, 110])], '#000', { op: 0.35 });
    },
    inner: () => {
      f.flat(ell(PC, 8, 16, 0.6, 8), '#0a090c', { op: 0.8 }); // fovea
      for (let i = 0; i < 7; i++) { const a = -0.9 + i * 0.5; f.line([add(PC, rot([12, 0], a)), add(PC, rot([84, 0], a))], 1.6, INK, { op: 0.5 }); }
    } });
  X.burn(f, add(PC, [-40, -10]), 0.9, 90, 1.8, { depth: 2 });
  const EM = SC([522, 652]);
  f.part(ell(EM, 30, 22, 0.9, 12), BLK({ fill: '#34323a', cast: false })); // eye mound
  for (const q of [add(EM, [6, -4]), add(EM, [-6, 8])]) { f.flat(ell(q, 6.5, 5.5, 0.9, 8), '#08070a'); f.flat(ell(add(q, [-1.5, -1.5]), 1.6, 1.6, 0, 5), '#6a6478', { op: 0.6 }); }
  // ---- near legs, one knee fused by a strike
  LN.forEach((J, i) => { f.bone('leg_n' + (i + 1)); sleg(f, J, 44, legN, { band: P.copper, fur: 12 }); });
  f.bone('leg_n2');
  f.part(X.lumpy(f, ell(LN[1][2], 22, 19, 0.3, 12), 3), BLK({ fill: '#2a2430', light: mix(P.copperL, P.vioL, 0.4), cast: false }));
  X.burn(f, add(LN[1][2], [4, 2]), 0.7, 60, 1.5, { depth: 2 });
  for (const i of [0, 2]) { f.bone('leg_n' + (i + 1)); X.mould(f, LN[i][2], 15, 12, 14); }
  // ---- near palp and chelicera: a thick hairy basal segment, the fang curled under, venom on its tip
  f.bone('palp_n'); X.ileg(f, [PLN, add(PLN, [18, 14]), add(PLN, [62, 22]), add(PLN, [78, 66]), add(PLN, [86, 90])], 20, legN, { spines: 1, hairs: 9 });
  f.bone('chelicera_n');
  const CHn = [add(CHN, [-16, -16]), add(CHN, [34, -12]), add(CHN, [58, 40]), add(CHN, [50, 104]), add(CHN, [20, 124]), add(CHN, [-4, 70])];
  X.furMass(f, CHn, BLK({ fill: '#2a2830' }), { len: 8, edge: 7, flow: () => 1.5, skip: p => p[1] < CHN[1] });
  f.line([add(CHN, [6, -2]), add(CHN, [34, 40]), add(CHN, [32, 96])], 1.6, P.chitP, { op: 0.5 });
  const fang = [add(CHN, [26, 112]), add(CHN, [48, 116]), add(CHN, [44, 160]), add(CHN, [14, 196, 1]), add(CHN, [28, 152])];
  f.part(fang, { fill: '#0c0b0e', light: '#4a4656', shade: 0.4, inkW: 1.2, cast: false, hatch: false });
  f.line([add(CHN, [42, 122]), add(CHN, [38, 154])], 1.2, '#8a84a0', { op: 0.6 });
  const ft = add(CHN, [14, 196]); f.stroke([ft, add(ft, [1, 10]), add(ft, [0, 20])], 4, P.venL, { op: 0.85 }); X.drip(f, add(ft, [0, 22]), 1.4, P.venL);

  f.bone('root');
  f.flat(ell([470, gy + 2], 240, 8, 0, 20), '#14121a', { op: 0.35 });
  f.flat(ell([548, gy], 8, 2.5, 0, 8), P.venD, { op: 0.6 });
  return f;
}

// a spiderling: a tiny black spider (abdomen, prosoma, eight bent legs) with a green fleck, heading a, size s
function spiderling(f, c, a, s, o = {}) {
  const F = frame(c, a, s);
  for (let i = 0; i < 4; i++) for (const sg of [-1, 1]) { const b = F([[1 - i * 0.9, 0]])[0], k = F([[3 - i * 2.6 + (i > 1 ? -1 : 1), sg * 4.8]])[0], t = F([[4.5 - i * 3.6, sg * 7.5]])[0]; f.line([b, k, t], Math.max(0.8, s * 0.42), INK); }
  f.flat(F(ell([-3.6, 0], 4, 3.1, 0, 10)), o.col || '#1a181e');
  f.flat(F(ell([1.6, 0], 2.6, 2.2, 0, 8)), o.col || '#24222a');
  f.flat(F(ell([-4.4, -0.8], 1.3, 0.9, 0, 6)), o.fleck || P.ven, { op: 0.9 });
  f.flat(F(ell([-2.6, -1.4], 1.2, 0.7, 0, 6)), '#8a84a0', { op: 0.5 });
}

// ------------------------------------------------------------------ BROOD MOTHER (elite, 2.2 wide, legs spread)
// The plains spider queen standing low and broad on eight thick legs, knees high, claws planted far out (the leg span
// runs off the frame). Her abdomen is swollen past all proportion with the brood the toxin ripened in her, sagging under
// its own weight, black with venom-green chevrons and blotches, ripe with pustules. Hundreds of spiderlings crawl over it
// in a living crust that breaks the top of her outline and spills down her legs; pale silk egg sacs are webbed under the
// abdomen, one split and spilling young. Lightning has burnt a fern across the abdomen and fused one front knee.
// Rig: body (root, prosoma) + abdomen (pedicel) + brood (parent abdomen) + eggs (parent abdomen) + leg_n1..4, leg_f1..4 +
// chelicera_n, chelicera_f + palp_n, palp_f.
// Motion: idle the young swarming over her back (brood bone, abdomen breathing); attack a venom bite (body lunges,
// chelicerae open), the spiderlings scatter.
function broodMother() {
  const seed = 1002, h = TIERS.elite[1];
  const f = new Fig(X.base(seed, h, { grimeY: 1250 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const BLK = (o = {}) => X.CH(f, Object.assign({ fill: '#24222a', light: '#5e5868', tex: 'setae' + sd, texOp: 0.45 }, o));
  const legN = BLK({ fill: '#2a2830' }), legF = BLK({ fill: '#18161c', light: '#45404e' });
  const PC = [690, 1150], PD = [566, 1146];
  // low and broad: the knees barely clear her back, the tibiae splay out, the claws plant far from the body
  const LN = [
    [[790, 1178], [816, 1168], [936, 1000], [1064, 1150], [1112, 1366]],
    [[752, 1198], [776, 1210], [884, 1040], [984, 1218], [1044, 1366]],
    [[692, 1210], [668, 1226], [560, 1064], [470, 1240], [416, 1366]],
    [[652, 1200], [628, 1212], [404, 1084], [250, 1250], [156, 1366]],
  ];
  const LF = [
    [[778, 1158], [798, 1144], [884, 930], [1022, 1020], [1096, 1336]],
    [[740, 1178], [760, 1178], [834, 960], [934, 1120], [994, 1344]],
    [[680, 1188], [660, 1188], [522, 960], [400, 1120], [340, 1344]],
    [[642, 1178], [622, 1178], [334, 980], [140, 1120], [24, 1344]],
  ];
  f.joint('body', PC, null).joint('abdomen', PD, 'body').joint('brood', [330, 920], 'abdomen').joint('eggs', [280, 1260], 'abdomen');
  LN.forEach((J, i) => f.joint('leg_n' + (i + 1), J[0], 'body')); LF.forEach((J, i) => f.joint('leg_f' + (i + 1), J[0], 'body'));
  f.joint('chelicera_f', [800, 1158], 'body').joint('chelicera_n', [818, 1164], 'body').joint('palp_n', [808, 1140], 'body').joint('palp_f', [796, 1132], 'body');

  // ---- far legs: their knees stand above her back
  LF.forEach((J, i) => { f.bone('leg_f' + (i + 1)); sleg(f, J, 46, legF, { band: mix(P.venD, '#000', 0.3), planted: true }); });
  f.bone('palp_f'); X.ileg(f, [[796, 1132], [814, 1144], [858, 1146], [880, 1190], [890, 1212]], 18, legF, { spines: 1, hairs: 8 });
  f.bone('chelicera_f');
  f.part([[786, 1136], [828, 1144], [846, 1204], [826, 1246], [794, 1210]], BLK({ fill: '#1c1a20' }));
  f.part([[818, 1236], [834, 1242], [830, 1284], [806, 1312, 1], [814, 1276]], { fill: '#0c0b0e', light: '#4a4656', shade: 0.4, inkW: 1.1, cast: false, hatch: false });

  // ---- abdomen: swollen with the brood the toxin ripened in her, its weight pooled low and to the rear so the belly
  // sags almost to the ground. The swelling has cracked her leathery dorsal shield into separate plates riding on
  // stretched, pale, striated skin; the sigilla (muscle dimples) pit the plates; deep folds crease the hanging belly;
  // lumps of brood push the outline out in lobes.
  f.bone('abdomen');
  const AB = X.lumpy(f, [[560, 1128], [546, 1074], [512, 1024], [460, 990], [384, 968], [298, 958], [214, 968], [140, 998], [84, 1044], [44, 1104], [26, 1170], [30, 1236], [62, 1290], [116, 1326], [190, 1346], [280, 1350], [370, 1340], [440, 1310], [494, 1266], [534, 1212], [552, 1170]], 7);
  const topC = X.spline([[546, 1074], [512, 1024], [460, 990], [384, 968], [298, 958], [214, 968], [140, 998], [84, 1044], [44, 1104], [26, 1170]], 3), TS = X.arcLen(topC), TL = TS[TS.length - 1];
  const tp = (u, d) => { const A = X.at(topC, TS, Math.max(0, Math.min(1, u)) * TL); return add(A.p, mul(A.n, -d)); }; // d: depth in from the top edge
  X.furMass(f, AB, BLK({ fill: '#2c2a32', maxShade: 60 }), { len: 13, edge: 9, flow: p => Math.atan2(p[1] - 1140, p[0] - 562) + 0.3, litShare: 0.3,
    skip: p => p[0] > 540 && p[1] > 1100,
    under: () => {
      f.flat(ell([300, 1250], 250, 90, 0.05, 18), '#000', { op: 0.4 }); // the hanging belly in shadow
      for (let i = 0; i < 14; i++) f.flat(ell([R2(f, 110, 500), R2(f, 1040, 1200)], R2(f, 6, 14), R2(f, 4, 8), f.r() * 3, 10), P.venD, { op: 0.55 });
    },
    inner: () => {
      // deep folds where the belly hangs: long creases curving round the underside, lit along their upper lips
      for (let i = 0; i < 6; i++) { const y0 = 1180 + i * 22, x0 = 90 + i * 16, x1 = 520 - i * 22; const C = [[x0, y0 - 30], [(x0 + x1) / 2 - 40, y0 + 30 + i * 4], [x1, y0 - 10 - i * 6]]; f.stroke(X.spline(C, 8), 7, '#08070a', { op: 0.65 }); f.line(X.spline(C, 8).map(q => add(q, [0, -5])), 1.4, '#7a7684', { op: 0.45 }); }
      f.stroke([[60, 1150], [80, 1230], [130, 1290]], 9, '#08070a', { op: 0.5 }); // the rear sag folding under
    } });
  // the stretched skin across the back, pale and bare where it is pulled thin, striated along the pull, a soft fur
  // edge where it meets the haired flanks
  const SKF = []; for (let k = 0; k <= 12; k++) SKF.push(tp(-0.02 + k * 1.04 / 12, -6)); for (let k = 12; k >= 0; k--) SKF.push(tp(-0.02 + k * 1.04 / 12, 250 - Math.sin(k / 12 * Math.PI) * -20 + (k % 2) * 14));
  const skF = SKF.map((q, i) => i < 13 ? q : add(q, [(f.r() - 0.5) * 12, (f.r() - 0.5) * 12]));
  f.part(X.clipDraw ? skF : skF, { fill: '#6e6878', shadow: '#2a2632', light: '#a8a2b4', shade: 0.4, tex: 'wrinkle' + sd, texOp: 0.6, maxShade: 50, cast: false, inkW: 0 });
  X.clipDraw(f, AB, () => X.clipDraw(f, skF, () => {
    for (let i = 0; i < 70; i++) { const u = R2(f, 0, 1), d0 = R2(f, 0, 240); f.line([tp(u - 0.014, d0), tp(u + 0.014, d0 + 3)], 1.1, f.r() < 0.5 ? '#a8a2b4' : '#2a2632', { op: 0.45 }); } // stretch striations
    for (let i = 0; i < 8; i++) { const p = tp(R2(f, 0.05, 0.95), R2(f, 40, 220)); f.line([p, add(p, [R2(f, -20, 20), R2(f, 14, 30)]), add(p, [R2(f, -30, 30), R2(f, 34, 50)])], 1.4, '#3a3048', { op: 0.5 }); } // veins under the thin skin
    f.flat([tp(-0.05, 200), tp(1.05, 200), tp(1.05, 300), tp(-0.05, 300)], '#000', { op: 0.35 });
  }));
  // the cracked dorsal shield: plates pulled apart by the swelling, each with a rim of thickness and its sigilla
  const PLATES = [[0.04, 0.2, 20, 120], [0.24, 0.42, 14, 150], [0.46, 0.64, 16, 140], [0.68, 0.84, 22, 112], [0.3, 0.56, 168, 230]];
  for (const [u0, u1, d0, d1] of PLATES) {
    const q = []; for (let k = 0; k <= 6; k++) q.push(tp(u0 + (u1 - u0) * k / 6 + (f.r() - 0.5) * 0.008, d0 + (f.r() - 0.5) * 6)); for (let k = 6; k >= 0; k--) q.push(tp(u0 + (u1 - u0) * k / 6 + (f.r() - 0.5) * 0.01 + (k === 3 ? 0.01 : 0), d1 + (f.r() - 0.5) * 14));
    f.part(q, BLK({ fill: '#24222a', light: '#6a6476', tex: 'pit' + sd, texOp: 0.5, maxShade: 26, cast: false, inkW: 1.8, inkHeavy: 3 }));
    X.clipDraw(f, q, () => {
      const um = (u0 + u1) / 2, dm = (d0 + d1) / 2;
      f.flat([tp(u0 + 0.01, d0 + 6), tp(u1, d0 + 6), tp(u1, (d0 + dm) / 2), tp(u0 + 0.01, (d0 + dm) / 2)], P.chitP, { op: 0.12 }); // the lit crown of the plate
      f.stroke([tp(u0, d1 - 6), tp(um, d1 - 4), tp(u1, d1 - 6)], 12, '#000', { op: 0.45 }); // its thickness at the lower lip
      for (const sg of [-1, 1]) f.flat(ell(tp(um + sg * (u1 - u0) * 0.2, dm), 6, 4, 0.3, 8), '#060508', { op: 0.85 }); // sigilla
      const ch = tp(um, dm - 4), w2 = (u1 - u0) * TL * 0.28; f.flat([add(ch, [w2, -10]), add(ch, [0, 6]), add(ch, [-w2, -10]), add(ch, [-w2 * 0.8, 0]), add(ch, [0, 16]), add(ch, [w2 * 0.8, 0])], P.ven, { op: 0.7 }); // the venom-green chevron on each plate
    });
    f.line([tp(u0 + 0.01, d0 + 3), tp((u0 + u1) / 2, d0 + 1), tp(u1 - 0.01, d0 + 3)], 1.6, '#8a84a0', { op: 0.5 }); // worn bright upper edge
  }
  X.burn(f, tp(0.5, 90), 0.3, 220, 3, { depth: 3 });
  X.pustules(f, [300, 1260], 150, 30, 14, 4, 10, { burst: 0.35 });
  X.mould(f, [90, 1150], 30, 40, 30);
  f.part(limb(PD, add(PD, [36, 4]), 52, 46, { steps: 3 }), BLK({ cast: false }));

  // ---- egg sacs webbed under the abdomen (over its lower edge); one split open with young spilling out
  f.bone('eggs');
  const sac = (c, rx, ry, a, split) => {
    const pts = X.lumpy(f, ell(c, rx, ry, a, 14).map(q => { const dy = (q[1] - c[1]) / ry; return [c[0] + (q[0] - c[0]) * (dy < 0 ? 0.12 + 0.88 * Math.sqrt(Math.max(0, 1 + dy)) : 1.05), q[1] + (dy < -0.5 ? -ry * 0.3 * (-dy - 0.5) * 2 : dy > 0.4 ? ry * 0.1 : 0)]; }), rx * 0.08); // a teardrop: drawn up to its silk at the top, sagging at the bottom
    f.part(pts, { fill: '#c8c0b2', shadow: '#5a5450', light: '#e8e2d6', shade: 0.4, tex: 'wrinkle' + sd, texOp: 0.8, inkW: 1.4 });
    X.clipDraw(f, pts, () => { for (let i = 0; i < 7; i++) { const q = add(c, rot([(i - 3) * rx * 0.3, -ry], a)); f.line([q, add(q, rot([rx * 0.2, ry], a)), add(q, rot([-rx * 0.1, ry * 2], a))], 1, INK, { op: 0.35 }); } f.flat(ell(add(c, rot([rx * 0.3, ry * 0.4], a)), rx * 0.8, ry * 0.5, a, 10), '#3a3440', { op: 0.3 }); });
    if (split) { const q = add(c, rot([rx * 0.4, ry * 0.5], a)); f.flat([add(q, [-14, -10]), add(q, [12, -6]), add(q, [10, 12]), add(q, [-10, 10])], '#0e0c10'); for (let i = 0; i < 9; i++) spiderling(f, add(q, [R2(f, -30, 50), R2(f, -10, 30)]), R2(f, 0, 6), 1.6, { col: '#3a3842' }); }
  };
  sac([196, 1290], 52, 40, 0.3, false); sac([340, 1300], 46, 36, -0.2, true); sac([100, 1236], 38, 34, 0.6, false);
  for (const [a, b] of [[[200, 1210], [250, 1160]], [[360, 1260], [380, 1220]], [[150, 1130], [180, 1100]], [[270, 1290], [300, 1250]], [[410, 1310], [440, 1250]]]) X.silk(f, a, b, { w: 1.2, op: 0.7 });

  // ---- prosoma: a broad carapace, the head region raised toward the eyes, fovea, radiating grooves
  f.bone('body');
  const CA = [[560, 1100], [620, 1078], [700, 1076], [770, 1094], [818, 1126], [832, 1164], [812, 1196], [760, 1212], [690, 1214], [620, 1204], [572, 1180], [554, 1140]];
  f.part(CA, BLK({ fill: '#2e2c34', tex: 'pit' + sd, texOp: 0.4, maxShade: 40 }));
  X.clipDraw(f, CA, () => {
    f.flat(ell([680, 1130], 8, 16, 1.3, 8), '#0a090c', { op: 0.8 });
    for (let i = 0; i < 7; i++) { const a = -2.8 + i * 0.5; f.line([add([680, 1130], rot([12, 0], a)), add([680, 1130], rot([90, 0], a))], 1.6, INK, { op: 0.5 }); }
    f.stroke([[600, 1090], [680, 1084], [770, 1100]], 5, P.chitP, { op: 0.35 });
    f.flat([[560, 1190], [830, 1180], [830, 1230], [560, 1230]], '#000', { op: 0.35 });
    for (const q of [[640, 1160], [740, 1150]]) f.flat(ell(q, 22, 10, 0.1, 10), P.ven, { op: 0.45 });
  });
  f.part(ell([796, 1118], 22, 14, 0.4, 10), BLK({ fill: '#34323a', cast: false }));
  for (const q of [[804, 1114], [790, 1122]]) { f.flat(ell(q, 5, 4, 0.4, 8), '#08070a'); f.flat(ell(add(q, [-1, -1]), 1.2, 1.2, 0, 5), '#6a6478', { op: 0.5 }); }

  // ---- the brood: hundreds of young crusting her back, a bed of small ones with larger ones in clumps and streams over
  // the plates and down her sides, breaking the top of the outline
  f.bone('brood');
  const bl = [];
  for (let i = 0; i < 150; i++) { const u = f.r(), d = f.r() < 0.3 ? R2(f, -10, 6) : R2(f, 6, 200) * (f.r() < 0.5 ? 1 : 0.5); bl.push([tp(u, d), R2(f, 0, 6.3), R2(f, 1.4, 2.2)]); }
  for (const [uc, dc, n] of [[0.18, 40, 9], [0.5, 30, 12], [0.78, 60, 8], [0.36, 190, 7], [0.62, 230, 6]]) for (let i = 0; i < n; i++) bl.push([tp(uc + R2(f, -0.06, 0.06), dc + R2(f, -30, 30)), R2(f, 0, 6.3), R2(f, 3.0, 4.6)]); // clumps of bigger young
  for (let i = 0; i < 10; i++) { const t = i / 10; bl.push([lerp(tp(0.92, 30), [80, 1280], t), 1.6 + R2(f, -0.4, 0.4), R2(f, 2.6, 3.6)]); } // a stream down her rear
  bl.sort((a, b) => a[2] - b[2]).forEach(([q, a, sz]) => spiderling(f, q, a, sz, { fleck: f.r() < 0.6 ? P.ven : P.venL, col: f.r() < 0.5 ? '#3a3842' : '#4a4652' }));
  f.bone('body');
  for (let i = 0; i < 22; i++) spiderling(f, [R2(f, 580, 800), R2(f, 1080, 1110)], R2(f, 0, 6.3), R2(f, 1.4, 2.2), { col: '#3a3842' }); // on the carapace
  // ---- near legs (one front knee fused by a strike) with young crawling down them
  LN.forEach((J, i) => { f.bone('leg_n' + (i + 1)); sleg(f, J, 58, legN, { band: P.ven, planted: true, fur: 12 }); for (let k = 0; k < 3 + i; k++) { const t = R2(f, 0.1, 0.9), q = lerp(J[1], J[2], t); spiderling(f, add(q, [R2(f, -6, 6), R2(f, -10, 2)]), ang(J[2], J[1]) + R2(f, -0.4, 0.4), 1.8, { col: '#3a3842' }); } });
  f.bone('leg_n1');
  f.part(X.lumpy(f, ell(LN[0][2], 30, 26, 0.3, 12), 5), BLK({ fill: '#2a2430', light: mix(P.vioL, '#888', 0.3), cast: false }));
  X.burn(f, add(LN[0][2], [4, 2]), 0.9, 70, 1.8, { depth: 2 });
  for (const i of [1, 3]) { f.bone('leg_n' + (i + 1)); X.mould(f, LN[i][2], 16, 14, 16); }
  // ---- near palp and chelicera with the fang and venom
  f.bone('palp_n'); X.ileg(f, [[808, 1140], [828, 1154], [878, 1158], [902, 1204], [914, 1230]], 22, legN, { spines: 1, hairs: 9 });
  f.bone('chelicera_n');
  f.part([[802, 1144], [846, 1150], [866, 1210], [852, 1266], [818, 1276], [800, 1220]], BLK({ fill: '#2a2830', tex: 'setae' + sd, texOp: 0.6 }));
  f.line([[818, 1158], [846, 1204], [842, 1250]], 1.8, P.chitP, { op: 0.5 });
  f.part([[836, 1260], [858, 1266], [854, 1312], [824, 1348, 1], [840, 1306]], { fill: '#0c0b0e', light: '#4a4656', shade: 0.4, inkW: 1.2, cast: false, hatch: false });
  f.stroke([[824, 1348], [825, 1354], [824, 1358]], 4, P.venL, { op: 0.85 }); f.flat(ell([826, 1366], 9, 3, 0, 8), P.venD, { op: 0.7 });

  f.bone('root');
  f.flat(ell([560, gy + 2], 520, 12, 0, 24), '#14121a', { op: 0.45 });
  for (let i = 0; i < 10; i++) spiderling(f, [R2(f, 300, 900), gy - R2(f, 4, 10)], R2(f, -0.4, 0.4) + (f.r() < 0.5 ? Math.PI : 0), 1.8, { col: '#3a3842' }); // young scattering on the ground
  return f;
}

// a raptorial femur: a deep, laterally flattened blade from a to b. The muscle side (away from the spines) bulges in the
// proximal half; the spine side is a straight keel with two rows of spines (long and short alternating) and the groove
// the tibia folds into; the knee ends in two lobes. sg: the side the spines face (+1 = +normal of a->b).
function raptFemur(f, a, b, w, look, sg = 1) {
  const sp = [[0, w * 0.3], [0.12, w * 0.36], [0.5, w * 0.36], [0.85, w * 0.3], [1, w * 0.24]]; // spine side: a straight keel
  const mu = [[0, w * 0.34], [0.14, w * 0.6], [0.32, w * 0.72], [0.55, w * 0.56], [0.82, w * 0.36], [1, w * 0.28]]; // muscle side
  const pts = X.mlimb(a, b, sg > 0 ? sp : mu, sg > 0 ? mu : sp, { capK: 0.55 });
  f.part(pts, Object.assign({ k: 0.9 }, look, { cast: false }));
  const d = E.norm(sub(b, a)), n = mul([-d[1], d[0]], sg), at = (t, k) => add(lerp(a, b, t), mul(n, k * w));
  X.clipDraw(f, pts, () => {
    f.flat([at(0, -0.9), at(1, -0.5), at(1, -0.12), at(0.5, -0.14), at(0, -0.2)], '#000', { op: 0.28 }); // the far face of the blade turned away
    f.stroke([at(0.08, -0.36), at(0.3, -0.5), at(0.6, -0.36), at(0.92, -0.18)], 7, look.light, { op: 0.4 }); // lit curve of the muscle
    for (let i = 0; i < 9; i++) { const t = 0.12 + i * 0.09; f.line([at(t, -0.6), at(t + 0.02, -0.15)], 0.9, INK, { op: 0.3 }); } // growth ridges
    f.flat([at(0.06, 0.05), at(0.3, 0.08), at(0.3, 0.26), at(0.06, 0.22)], mix(P.venP, P.bone, 0.3), { op: 0.35 }); // the pale grooming brush near the base
    for (let i = 0; i < 8; i++) f.line([at(0.08 + i * 0.03, 0.08), at(0.09 + i * 0.03, 0.24)], 0.8, INK, { op: 0.45 });
  });
  f.line([at(0.04, 0.24), at(0.96, 0.18)], 2, INK, { op: 0.7 }); // the groove the tibia folds into
  f.line([at(0.04, 0.3), at(0.96, 0.22)], 1.2, look.light, { op: 0.45 });
  const tips = [];
  for (let i = 0; i < 13; i++) {
    const t = 0.1 + i * 0.068, big = i % 3 === 0, wl = (big ? 0.5 : 0.24) * w, base = at(t, 0.33), tip = add(add(base, mul(n, wl)), mul(d, -wl * 0.4));
    f.part([add(base, mul(d, -w * (big ? 0.09 : 0.05))), tip, add(base, mul(d, w * (big ? 0.07 : 0.04)))], Object.assign({}, look, { fill: mix(look.fill, '#000', 0.3), inkW: 1, inkHeavy: 1.4, cast: false, k: 0.3, hatch: false }));
    f.flat([lerp(base, tip, 0.55), tip, add(lerp(base, tip, 0.55), mul(d, 2))], '#0a0a08'); tips.push(tip);
  }
  for (const k of [0.22, -0.2]) f.part(ell(at(0.97, k), w * 0.2, w * 0.15, Math.atan2(d[1], d[0]), 8), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.2), cast: false, inkW: 1 })); // knee lobes
  return { tips, at };
}
// the tibia folded back onto the femur: a curved blade with a fine spine row facing the femur and a long terminal hook
function raptTibia(f, a, b, w, look, sg = 1) {
  const d = E.norm(sub(b, a)), n = mul([-d[1], d[0]], sg), L = E.len(sub(b, a)), at = (t, k) => add(add(lerp(a, b, t), mul(n, k * w)), mul(n, -Math.sin(t * Math.PI) * w * 0.25));
  const pts = []; for (let i = 0; i <= 8; i++) pts.push(at(i / 8, 0.42 - i * 0.02)); pts.push([...at(1.02, 0), 1]); for (let i = 8; i >= 0; i--) pts.push(at(i / 8, -0.5 + i * 0.03));
  f.part(pts, Object.assign({ k: 0.9 }, look, { cast: false }));
  f.line([at(0.05, -0.28), at(0.5, -0.3), at(0.95, -0.2)], 1.6, look.light, { op: 0.55 });
  for (let i = 0; i < 11; i++) { const t = 0.12 + i * 0.075, base = at(t, 0.38), tip = add(add(base, mul(n, w * (i % 2 ? 0.22 : 0.34))), mul(d, w * 0.2)); f.line([base, tip], 2, '#0e0e0a'); }
  const e = at(1, 0), hk = [add(e, mul(n, -w * 0.3)), add(add(e, mul(d, w * 0.9)), mul(n, -w * 0.2)), [...add(add(e, mul(d, w * 1.25)), mul(n, w * 0.55)), 1], add(add(e, mul(d, w * 0.55)), mul(n, w * 0.12)), add(e, mul(n, w * 0.3))];
  f.part(hk, { fill: '#121210', light: '#5a5a48', shade: 0.4, inkW: 1.2, cast: false, hatch: false }); // the terminal hook
  f.part([add(at(0.9, 0.3), mul(d, -4)), add(add(at(0.94, 0.3), mul(n, w * 0.5)), mul(d, w * 0.4)), at(0.98, 0.3)], { fill: '#121210', shade: 0.4, inkW: 1, cast: false, hatch: false }); // tibial spur
  return at;
}

// ------------------------------------------------------------------ MANTIS DUELIST (elite, 2.0, upright)
// A big green-black mantis that watched the travellers' fencing schools, standing reared on four planted walking legs.
// Mass in the body: a deep meso- and metathorax of plates with thickness; a heavy segmented abdomen sagging behind under
// leathery wing cases; a prothorax that tapers from a thick base and flares into a shield-like collar over the foreleg
// coxae. The triangular head, tilted politely, carries big compound eyes at its upper corners and mandibles at the point.
// The salute: the near raptorial femur stands upright before the face like a sword at the salute, its tibia folded back
// along the spined keel like a closed blade; the far scythe is angled forward so the two cross like blades. A duelling
// sash, faded to dust and stiff with old blood, is tied round the thorax with a fencer's glove tucked in the knot as a
// trophy; a snapped blade tip is lodged in the prothorax. Lightning (no sparks in the air, director's ruling): ferns burnt
// into the scythes and pronotum, the scythe spines fused glassy at their tips, the setae along both scythe edges standing
// stiff, a hind knee fused. Toxin: pustules and mould on the abdomen, a fruiting stalk through the wing case, the wing
// cases rotted through in holes.
// Rig: body (root, thorax) + abdomen + wings (tegmina) + prothorax + head + coxa/femur/tibia _n and _f + leg_mn, leg_mf,
// leg_hn, leg_hf + sash (parent body).
// Motion: idle a slow bow (prothorax and head dip); attack a double scythe strike (femora and tibiae swing down).
function mantisDuelist() {
  const seed = 1001, h = TIERS.elite[1];
  const f = new Fig(X.base(seed, h, { grimeY: 1240 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const mg = mix(P.ven, P.chit, 0.7), MG = (o = {}) => X.VN(f, Object.assign({ fill: mg, light: mix(mg, P.venL, 0.45), shadow: '#0e120a', tex: 'growth' + sd, texOp: 0.4 }, o));
  const MGF = MG({ fill: mix(mg, '#000', 0.35), light: mix(mg, P.ven, 0.5) });
  const MEMB = MG({ fill: mix(P.venD, P.grey, 0.35), light: mix(P.ven, P.grey, 0.3), shadow: '#14160e', tex: 'wrinkle' + sd, texOp: 0.6 });
  const TA0 = [456, 968], TA1 = [572, 808], BO = [512, 890]; // thorax axis: metathorax at the rear, mesothorax at the front
  const PB = [566, 818], PT = [614, 432], HC = [668, 374];
  // raptorial legs: coxa hanging forward from under the collar, femur raised, tibia folded back onto the femur's keel
  const RN = { c0: [636, 482], k: [792, 664], fk: [862, 172] };
  const RF = { c0: [612, 492], k: [730, 652], fk: [1010, 352] };
  const tAt = (R, t, off) => add(lerp(R.k, R.fk, t), mul(E.norm([-(R.fk[1] - R.k[1]), R.fk[0] - R.k[0]]), off));
  RN.tt = tAt(RN, 0.48, -62); RF.tt = tAt(RF, 0.5, -54);
  const WL = {
    mn: [[560, 902], [584, 930], [752, 786], [814, 1252], [890, 1366]],
    mf: [[548, 890], [570, 912], [722, 768], [770, 1236], [842, 1352]],
    hn: [[478, 962], [452, 992], [300, 860], [218, 1290], [140, 1366]],
    hf: [[492, 950], [472, 970], [338, 838], [270, 1272], [196, 1352]],
  };
  f.joint('body', BO, null).joint('abdomen', TA0, 'body').joint('wings', [500, 896], 'body').joint('prothorax', PB, 'body').joint('head', PT, 'prothorax');
  for (const [sx, R] of [['_n', RN], ['_f', RF]]) f.joint('coxa' + sx, R.c0, 'prothorax').joint('femur' + sx, R.k, 'coxa' + sx).joint('tibia' + sx, R.fk, 'femur' + sx);
  for (const k of Object.keys(WL)) f.joint('leg_' + k, WL[k][0], 'body');
  const KN = [606, 902]; f.joint('sash', KN, 'body');

  // ---- far walking legs
  for (const k of ['mf', 'hf']) { f.bone('leg_' + k); X.ileg(f, WL[k], 46, MGF, { spines: 4, hairs: 6, planted: true, tib: 1.35 }); }
  // ---- far raptorial leg: angled forward, behind the body, its tibia crossing behind the near scythe
  f.bone('coxa_f'); f.part(X.mlimb(RF.c0, RF.k, [[0, 30], [0.4, 32], [1, 24]], [[0, 30], [0.5, 30], [1, 24]], { capK: 0.6 }), MGF);
  f.bone('femur_f'); const FF = raptFemur(f, RF.k, RF.fk, 82, MGF, -1);
  f.bone('tibia_f'); raptTibia(f, RF.fk, RF.tt, 42, MGF, 1);
  // far antenna behind the head
  f.bone('head');
  const tilt = -0.35, hF = frame(HC, tilt, 1);
  X.antenna(f, [hF([[-8, -40]])[0], hF([[-30, -110]])[0], hF([[-90, -190]])[0], hF([[-170, -230]])[0]], 4, MGF, { n: 18 });

  // ---- abdomen: deep and heavy, sagging behind the thorax; overlapping tergites with rims, green sternites under it
  f.bone('abdomen');
  const ahw = u => u < 0.12 ? 62 + u / 0.12 * 24 : u < 0.45 ? 86 + Math.sin((u - 0.12) / 0.33 * Math.PI / 2) * 12 : 98 - Math.pow((u - 0.45) / 0.55, 1.4) * 66;
  const apt = X.segBody(f, [[462, 960], [392, 1012], [318, 1074], [254, 1134], [206, 1186], [180, 1222]], ahw, 7, MG({ fill: mix(P.ven, P.chit, 0.45), maxShade: 50 }),
    { vs: -1, wrap: 0.56, ov: 0.32, sternCol: mix(P.ven, P.chit, 0.4), band: i => i % 2 ? mix(P.ven, P.chit, 0.5) : null, bandT: 0.6,
      deco: (i, u0, u1, pt) => { for (let q = 0; q < 14; q++) f.flat(ell(pt(R2(f, u0, u1), R2(f, -0.9, 0.5)), 1.8, 1.3, 0, 5), '#0a0c06', { op: 0.5 }); f.line([pt(u0 + 0.01, 0.62), pt((u0 + u1) / 2, 0.75), pt(u1, 0.66)], 1, INK, { op: 0.4 }); } });
  X.pustules(f, apt(0.52, 0.82), 44, 12, 7, 3.5, 7.5);
  X.mould(f, apt(0.88, 0.55), 22, 16, 20);
  for (const a of [2.5, 2.85]) f.part(limb(apt(1, 0), add(apt(1, 0), rot([34, 0], a)), 10, 4, { steps: 3 }), MG({ cast: false, inkW: 1 })); // cerci
  // ---- the wing cases: leathery tegmina folded over the abdomen's back, the smoky hind wing's fan edge showing under
  // them; veined, rotted through in holes, the tip torn and burnt
  f.bone('wings');
  const HW = [[506, 884], [430, 934], [330, 1006], [240, 1090], [180, 1160], [150, 1206], [160, 1218], [196, 1192], [262, 1132], [346, 1066], [440, 1000], [508, 948]];
  f.part(HW, { fill: '#3a3830', shadow: '#121210', light: '#6a6656', shade: 0.4, tex: 'wrinkle' + sd, texOp: 0.4, cast: false });
  for (let i = 0; i < 9; i++) f.line([lerp([500, 920], [180, 1190], i / 9), lerp([508, 946], [196, 1198], i / 9 + 0.04)], 1, INK, { op: 0.5 });
  const TG = [[512, 872], [470, 878], [400, 912], [318, 966], [240, 1030], [176, 1092], [136, 1140], [118, 1168, 1], [140, 1176], [154, 1164], [170, 1186, 1], [204, 1160], [270, 1110], [350, 1052], [430, 996], [496, 944], [522, 906]];
  f.part(TG, MG({ fill: mix(P.ven, P.chitL, 0.3), tex: 'wrinkle' + sd, texOp: 0.45, maxShade: 34 }));
  X.clipDraw(f, TG, () => {
    f.line([[506, 884], [420, 920], [300, 990], [200, 1070], [130, 1160]], 2.6, INK, { op: 0.6 }); // costal vein
    for (let j = 1; j < 5; j++) f.line([[506, 886 + j * 12], [400, 930 + j * 14], [290, 1010 + j * 13], [190, 1090 + j * 12], [140, 1150 + j * 8]], 1.2, INK, { op: 0.45 });
    for (let i = 0; i < 16; i++) { const p = lerp([480, 900], [150, 1150], i / 16); f.line([add(p, [-4, 4]), add(p, [6, 34])], 0.9, INK, { op: 0.4 }); } // cross-veins
    f.flat([[500, 950], [170, 1180], [150, 1200], [500, 990]], '#000', { op: 0.3 }); // the lower edge turned under
    f.stroke([[480, 882], [380, 926], [270, 1000], [190, 1070]], 8, mix(P.venL, '#fff', 0.2), { op: 0.3 }); // sheen on the fold
    f.flat(ell([352, 960], 16, 5, -0.62, 10), '#1a1a10', { op: 0.55 }); // the stigma, a dark dash on the costa
    f.flat(ell([176, 1140], 34, 18, -0.7, 10), '#141210', { op: 0.55 }); // burnt tip
  });
  X.hole(f, [300, 1012], 9, 6, -0.6, { lip: P.venP, bruise: '#1a1a10' }); X.hole(f, [236, 1070], 7, 5, -0.6, { lip: P.venP, bruise: '#1a1a10' }); X.hole(f, [410, 950], 6, 4, -0.6, { lip: P.venP, bruise: '#1a1a10' });
  X.burn(f, [168, 1146], -0.9, 60, 1.6, { depth: 2 });
  X.cordyceps(f, [372, 962], -2.1, 84, 7, { bend: 0.5 }); X.cordyceps(f, [338, 984], -2.6, 50, 5, { bend: -0.3 });

  // ---- thorax: meso- and metathorax, deep plates with thickness; the walking legs' coxal plates under them
  f.bone('body');
  const TH = X.mlimb(TA0, TA1, [[0, 70], [0.3, 80], [0.62, 76], [1, 60]], [[0, 64], [0.3, 72], [0.62, 70], [1, 54]], { capK: 0.6 });
  f.part(TH, MG({ k: 0.9, maxShade: 46 }));
  const tA = (t, k) => lp(TA0, TA1, t, k);
  X.clipDraw(f, TH, () => {
    f.flat([tA(0, 30), tA(1, 26), tA(1, 90), tA(0, 90)], '#000', { op: 0.32 }); // the ventral half turned down and away
    for (const [t0, t1] of [[-0.05, 0.5], [0.5, 1.05]]) { // the two notal plates: raised, with a rim along their rear edge
      const pl = [tA(t0 + 0.03, -80), tA(t1, -80), tA(t1, -8), tA(t0 + 0.03, -12)];
      f.part(pl, MG({ fill: mix(mg, P.ven, 0.25), cast: false, inkW: 1.3, inkHeavy: 2, maxShade: 20 }));
      f.stroke([tA(t0 + 0.04, -70), tA(t0 + 0.05, -40), tA(t0 + 0.06, -12)], 9, '#000', { op: 0.4 });
      f.line([tA(t0 + 0.1, -66), tA((t0 + t1) / 2, -70), tA(t1 - 0.04, -64)], 2, mix(P.venL, '#fff', 0.2), { op: 0.5 });
    }
    f.line([tA(0.5, -84), tA(0.5, 0), tA(0.47, 70)], 2.4, INK, { op: 0.75 }); // the meso-meta suture
    for (const t of [0.24, 0.74]) { f.part(ell(tA(t, 46), 22, 15, Math.atan2(TA1[1] - TA0[1], TA1[0] - TA0[0]), 10), MG({ fill: mix(mg, '#000', 0.2), cast: false, inkW: 1.1 })); f.flat(ell(tA(t, 22), 4, 2.4, 0.4, 6), '#0a0c06'); } // coxal plates and spiracles
    for (let q = 0; q < 40; q++) f.flat(ell(tA(R2(f, 0, 1), R2(f, -70, 60)), 1.8, 1.3, 0, 5), '#0a0c06', { op: 0.5 });
    f.scratches(tA(0.5, -30), 40, 8, P.venP, 0.9, -0.8);
  });
  X.burn(f, tA(0.7, -40), -2.6, 90, 1.8, { depth: 2 });

  // ---- the prothorax: thick at the base, tapering, then flaring into a shield-like collar over the foreleg coxae
  f.bone('prothorax');
  const prW = [[0, 50], [0.18, 40], [0.5, 30], [0.7, 36], [0.8, 58], [0.9, 64], [0.97, 50], [1, 34]], prQ = [[0, 52], [0.2, 42], [0.5, 32], [0.7, 40], [0.8, 60], [0.9, 66], [0.97, 52], [1, 36]];
  const PR = X.mlimb(PB, PT, prW, prQ, { capK: 0.5 });
  f.part(PR, MG({ k: 0.9, maxShade: 34 }));
  const pA = (t, k) => lp(PB, PT, t, k);
  X.clipDraw(f, PR, () => {
    f.flat([pA(0, -60), pA(1, -60), pA(1, -10), pA(0, -12)], P.ven, { op: 0.22 }); // the lit dorsal face
    f.flat([pA(0, 14), pA(1, 10), pA(1, 70), pA(0, 70)], '#000', { op: 0.32 }); // the ventral face in shadow
    f.line([pA(0.02, -16), pA(0.5, -12), pA(0.72, -16), pA(0.98, -12)], 2.2, INK, { op: 0.6 }); // the median keel
    f.line([pA(0.02, -20), pA(0.5, -16), pA(0.72, -20)], 1.4, P.venL, { op: 0.45 });
    for (let i = 1; i < 10; i++) f.line([pA(i / 14, -26), pA(i / 14 + 0.01, 22)], 0.9, INK, { op: 0.28 });
    for (let q = 0; q < 50; q++) f.flat(ell(pA(R2(f, 0, 0.72), R2(f, -36, 30)), 1.6, 1.2, 0, 5), '#0a0c06', { op: 0.5 }); // granules
    f.stroke([pA(0.02, 0), pA(0.02, -50)], 8, '#000', { op: 0.4 }); f.stroke([pA(0.06, 0), pA(0.06, 50)], 6, '#000', { op: 0.3 }); // the collar ring at the base
  });
  // the shield: a raised supracoxal plate with a rim of thickness and a toothed margin breaking the outline
  const SHD = [pA(0.66, -38), pA(0.76, -58), pA(0.86, -68), pA(0.94, -60), pA(0.99, -34), pA(0.99, 38), pA(0.94, 62), pA(0.86, 70), pA(0.76, 60), pA(0.66, 40)];
  for (let i = 0; i < 9; i++) for (const sg of [1, -1]) { const t = 0.68 + i * 0.035, b = pA(t, sg * (52 + Math.sin((t - 0.66) / 0.33 * Math.PI) * 18)), dd = E.norm(sub(PT, PB)), tip = add(add(b, mul([-dd[1] * sg, dd[0] * sg], 10)), mul(dd, 5)); f.part([add(b, mul(dd, -5)), tip, add(b, mul(dd, 4))], MG({ fill: mix(mg, '#000', 0.3), inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.3, hatch: false })); }
  f.part(SHD, MG({ fill: mix(mg, P.ven, 0.2), cast: false, inkW: 1.6, inkHeavy: 2.6, maxShade: 24 }));
  X.clipDraw(f, SHD, () => {
    f.stroke([pA(0.68, 40), pA(0.86, 64), pA(0.97, 40)], 12, '#000', { op: 0.45 }); // the rim's under-edge
    f.stroke([pA(0.68, -36), pA(0.86, -60), pA(0.97, -34)], 6, mix(P.venL, '#fff', 0.25), { op: 0.45 }); // the lit rim
    f.line([pA(0.67, 0), pA(0.98, 0)], 2, INK, { op: 0.55 });
    for (let q = 0; q < 30; q++) f.flat(ell(pA(R2(f, 0.68, 0.97), R2(f, -50, 50)), 1.8, 1.4, 0, 5), '#0a0c06', { op: 0.55 });
  });
  X.burn(f, pA(0.36, -10), ang(PB, PT) + 0.25, 90, 1.8, { depth: 2 });
  X.burn(f, pA(0.8, -30), ang(PB, PT) - 0.5, 60, 1.4, { depth: 2 });
  // a snapped blade tip lodged in the front of the prothorax, a crust of old blood round the wound
  const bl0 = pA(0.42, 26); f.flat(ell(bl0, 14, 10, 0.4, 10), '#2a0806', { op: 0.75 });
  f.part([add(bl0, [-3, -2]), add(bl0, [62, -26]), add(bl0, [64, -20]), add(bl0, [3, 4])], { fill: '#9aa0a6', shadow: '#3a3e46', shade: 0.4, inkW: 1.2, cast: false, hatch: false, tex: 'pit' + sd, texOp: 0.5 });
  f.line([add(bl0, [6, -2]), add(bl0, [58, -23])], 0.8, '#e8eaf0', { op: 0.8 }); f.flat([add(bl0, [40, -17]), add(bl0, [48, -20]), add(bl0, [46, -14])], '#3a2a22', { op: 0.8 });

  // ---- the duelling sash: wound round the thorax and knotted at the front, the tails hanging plumb; faded to dust,
  // stiff with old blood that has soaked and dried brown-black; frayed, holed, burnt at one end; a glove in the knot
  f.bone('sash');
  const sc = mix(P.sash, '#6e665c', 0.55), sD = mix(P.sashD, '#2a2622', 0.5), sL = mix(P.sashL, '#9a9284', 0.55);
  const SSH = { fill: sc, shadow: sD, light: sL, shade: 0.42, tex: 'weave' + sd, texOp: 0.55 };
  const blood = (c, rx, ry, a = 0, op = 0.8) => { f.flat(ell(c, rx, ry, a, 12).map(q => add(q, [(f.r() - 0.5) * rx * 0.5, (f.r() - 0.5) * ry * 0.5])), '#34140e', { op }); f.flat(ell(add(c, [rx * 0.1, ry * 0.15]), rx * 0.6, ry * 0.55, a, 10).map(q => add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3])), '#1a0a06', { op: op * 0.85 }); f.line(ell(c, rx * 1.02, ry * 1.02, a, 12).slice(2, 9), 1, '#1a0604', { op: 0.6 }); };
  const SB = [tA(0.68, -86), tA(0.84, -84), tA(0.86, -30), tA(0.84, 30), tA(0.86, 82), tA(0.68, 86), tA(0.66, 30), tA(0.7, -30)];
  f.part(SB, SSH);
  X.clipDraw(f, SB, () => {
    for (let i = 0; i < 5; i++) f.stroke([tA(0.66 + i * 0.045, -86), tA(0.69 + i * 0.045, 0), tA(0.66 + i * 0.045, 86)], 2.6, sD, { op: 0.65 }); // folds where it is pulled tight
    blood(tA(0.76, -40), 26, 18, 0.5); blood(tA(0.74, 50), 20, 26, 0.3, 0.7);
  });
  f.part(X.lumpy(f, ell(KN, 24, 19, 0.3, 12), 4), SSH);
  blood(add(KN, [4, 4]), 14, 10, 0.3, 0.7);
  const tail = (pts, w) => { const o = X.ribbon(X.spline(pts, 4), t => w * (1 - t * 0.25)); f.part(o, SSH); X.clipDraw(f, o, () => { f.flat([add(pts[pts.length - 1], [-60, -40]), add(pts[pts.length - 1], [60, -50]), add(pts[pts.length - 1], [60, 10]), add(pts[pts.length - 1], [-60, 10])], '#2a2018', { op: 0.55 }); f.line([add(pts[1], [-w * 0.1, 0]), add(pts[2], [w * 0.05, 0]), add(pts[3], [0, -10])], 1.4, sD, { op: 0.7 }); }); const e = pts[pts.length - 1]; for (let i = -3; i <= 3; i++) f.line([add(e, [i * w / 8, -2]), add(e, [i * w / 8 + (f.r() - 0.5) * 4, 10 + f.r() * 10])], 1.2, sc); };
  tail([KN, [618, 960], [612, 1040], [620, 1130]], 34); tail([KN, [588, 952], [580, 1010], [574, 1080]], 26);
  blood([616, 1000], 14, 26, 0, 0.75); for (let i = 0; i < 3; i++) f.stroke([[606 + i * 9, 1010], [607 + i * 9, 1050 + i * 12], [606 + i * 9, 1070 + i * 16]], 3, '#2a0806', { op: 0.75 }); // a run of old blood dried down the tail
  X.hole(f, [612, 1086], 5, 7, 0, { lip: sL, bruise: sD });
  X.scorch(f, [574, 1072], 12, 10, 0.65); X.burn(f, [576, 1066], -1.4, 30, 1, { depth: 1 });
  // the trophy: a fencer's leather glove, cuff down, its fingers hooked over the knot
  f.part([[612, 874], [644, 870], [656, 910], [662, 952], [650, 966], [620, 970], [612, 924]], X.CLK(f, { fill: P.leath, shadow: P.leathD, tex: 'wrinkle' + sd }));
  f.part([[616, 944], [658, 940], [666, 970], [614, 976]], X.CLK(f, { fill: P.leathL, shadow: P.leathD, cast: false, inkW: 1.1 }));
  for (let i = 0; i < 4; i++) f.part(limb([616 + i * 9, 880], [604 + i * 10, 858 - (i % 2) * 4], 10, 9, { steps: 3 }), X.CLK(f, { fill: P.leathL, shadow: P.leathD, cast: false, inkW: 1 }));
  f.line([[620, 960], [660, 956]], 1, P.leathL, { dash: '2 2', op: 0.7 }); blood([640, 916], 9, 7, 0.2, 0.6);

  // ---- head: triangular, tilted politely; big faceted eyes at the upper corners standing out past the head line,
  // ocelli, frons and clypeus, crossed mandibles at the point, palps hanging plumb
  f.bone('head');
  f.part(limb(PT, hF([[-4, 34]])[0], 50, 44, { steps: 3 }), MEMB); // the neck membrane
  for (let i = 0; i < 4; i++) f.line([lp(PT, hF([[-4, 34]])[0], 0.2 + i * 0.18, -20), lp(PT, hF([[-4, 34]])[0], 0.24 + i * 0.18, 20)], 1, INK, { op: 0.5 });
  X.ceye(f, hF([[-64, -30]])[0], 24, 36, tilt - 0.4, { glints: 1, kidney: 0.1, col: '#2e3820' }); // far eye
  const HD = hF([[-70, -44], [-40, -60], [0, -64], [40, -60], [74, -44], [76, -18], [54, 14], [32, 46], [14, 74], [0, 80, 1], [-14, 72], [-32, 42], [-54, 10], [-72, -16]]);
  f.part(HD, MG({ k: 0.85, fill: mix(mg, P.venL, 0.14), maxShade: 40 }));
  X.clipDraw(f, HD, () => {
    f.flat(hF([[-80, -10], [-40, 0], [-10, 50], [0, 90], [-80, 90]]), '#000', { op: 0.35 }); // the far cheek turned away
    f.stroke(hF([[-34, -56], [10, -60], [50, -52]]), 7, P.venP, { op: 0.35 }); // vertex sheen
    for (const sg of [-1, 1]) f.line(hF([[sg * 30, -24], [sg * 22, 10], [sg * 10, 44]]), 1.6, INK, { op: 0.55 }); // genal sutures
    for (let q = 0; q < 24; q++) f.flat(ell(hF([[R2(f, -60, 60), R2(f, -56, 40)]])[0], 1.5, 1.1, 0, 5), '#0a0c06', { op: 0.45 });
  });
  f.part(hF([[-22, -16], [22, -16], [18, 16], [0, 24], [-18, 16]]), MG({ cast: false, fill: mix(mg, P.venP, 0.22), inkW: 1.2 })); // frons
  f.line(hF([[-18, -12], [0, -6], [18, -12]]), 1.2, INK, { op: 0.6 });
  f.part(hF([[-15, 24], [15, 24], [12, 38], [-12, 38]]), MG({ cast: false, fill: mix(mg, P.venL, 0.3), inkW: 1.1 })); // clypeus
  f.part(hF([[-9, 38], [9, 38], [6, 52], [-6, 52]]), MG({ cast: false, fill: '#4a4430', inkW: 1 })); // labrum
  X.ceye(f, hF([[58, -34]])[0], 31, 42, tilt + 0.35, { glints: 2, kidney: 0.12, col: '#3e4a2a' }); // near eye, bulging past the corner
  f.line(ell(hF([[58, -34]])[0], 32, 43, tilt + 0.35, 20).slice(13, 19), 2, P.venP, { op: 0.4 });
  for (const q of [[-8, -46], [8, -46], [0, -36]]) f.flat(ell(hF([q])[0], 3.4, 3, 0, 6), '#0a0c06'); // ocelli
  X.mandible(f, hF([[-8, 56]])[0], tilt + 1.2, 26, 10, MG({ fill: '#2a2a18', light: '#6a6a48' }), 1);
  X.mandible(f, hF([[8, 56]])[0], tilt + 2.0, 24, 9, MG({ fill: '#34341e', light: '#7a7650' }), -1);
  f.flat(ell(add(hF([[4, 80]])[0], [0, 4]), 3, 5, 0, 8), P.venL, { op: 0.85 }); // a bead of venom at the mouth
  for (const [q, l] of [[[-26, 40], 46], [[24, 44], 54]]) { const b = hF([q])[0]; const pp = [b, add(b, [4, l * 0.35]), add(b, [2, l * 0.7]), add(b, [5, l])]; for (let i = 0; i < 3; i++) f.part(limb(pp[i], pp[i + 1], 8 - i, 7 - i, { steps: 3, capK: 0.6 }), MG({ cast: false, inkW: 1, fill: mix(mg, P.venL, 0.2) })); } // maxillary palps, hanging plumb
  X.antenna(f, [hF([[10, -42]])[0], hF([[0, -120]])[0], hF([[-50, -210]])[0], hF([[-120, -270]])[0]], 4.6, MG(), { n: 20 });
  X.burn(f, hF([[30, -50]])[0], tilt - 2.4, 40, 1.2, { depth: 1 });

  // ---- near walking legs, the hind knee fused into a glassy lump
  for (const k of ['mn', 'hn']) { f.bone('leg_' + k); X.ileg(f, WL[k], 54, MG(), { spines: 5, hairs: 7, planted: true, tib: 1.35 }); }
  f.bone('leg_hn'); f.part(X.lumpy(f, ell(WL.hn[2], 30, 24, 0.2, 12), 4), MG({ fill: '#2a2c20', light: mix(P.vioL, mg, 0.55), cast: false })); f.stroke([add(WL.hn[2], [-16, -8]), add(WL.hn[2], [-2, -14]), add(WL.hn[2], [12, -10])], 4, mix(P.vioL, '#fff', 0.2), { op: 0.35 }); X.burn(f, add(WL.hn[2], [4, 2]), 1.2, 60, 1.5, { depth: 2 });
  f.bone('leg_mn'); X.mould(f, WL.mn[2], 16, 12, 14);

  // ---- near raptorial leg: coxa, the heavy femur raised upright before the face in the salute, the tibia folded back
  f.bone('coxa_n'); f.part(X.mlimb(RN.c0, RN.k, [[0, 34], [0.4, 38], [1, 28]], [[0, 34], [0.5, 34], [1, 28]], { capK: 0.6 }), MG());
  f.line([lp(RN.c0, RN.k, 0.1, -10), lp(RN.c0, RN.k, 0.9, -8)], 1.6, P.venL, { op: 0.45 }); X.burn(f, lp(RN.c0, RN.k, 0.4, 8), ang(RN.c0, RN.k), 60, 1.2, { depth: 1 });
  f.bone('femur_n'); const FN = raptFemur(f, RN.k, RN.fk, 98, MG(), -1);
  X.burn(f, FN.at(0.22, -0.3), ang(RN.k, RN.fk) - 0.15, 170, 2.2, { depth: 3 });
  f.bone('tibia_n'); raptTibia(f, RN.fk, RN.tt, 48, MG(), 1);
  // lightning on the scythe edges (no sparks in the air): the spine tips fused glassy, the setae along the cutting edge
  // standing stiff on end and singed
  for (const [bn, F, R] of [['femur_n', FN, RN], ['femur_f', FF, RF]]) {
    f.bone(bn);
    F.tips.forEach((t, i) => { if (i % 3 === 1) { f.flat(ell(t, 4, 3, 0, 6), '#141016', { op: 0.9 }); f.flat(ell(add(t, [-1, -1]), 2, 1.5, 0, 5), mix(P.vioL, '#fff', 0.3), { op: 0.8 }); } });
    const mu = [[0, 0.34], [0.14, 0.6], [0.32, 0.72], [0.55, 0.56], [0.82, 0.36], [1, 0.28]], muK = t => { for (let i = 1; i < mu.length; i++) if (t <= mu[i][0]) return mu[i - 1][1] + (mu[i][1] - mu[i - 1][1]) * (t - mu[i - 1][0]) / (mu[i][0] - mu[i - 1][0]); return 0.28; };
    const edge = []; for (let i = 0; i < 12; i++) { const t = 0.12 + i * 0.07; edge.push(F.at(t, -muK(t) + 0.04)); }
    const dd = E.norm(sub(R.fk, R.k)), outA = Math.atan2(dd[0], -dd[1]);
    X.standingHair(f, edge, 22, { col: '#1a1c12', w: 1.8, fan: 0.4, lean: outA + Math.PI / 2 });
  }

  f.bone('root');
  f.flat(ell([500, gy + 2], 420, 11, 0, 24), '#14121a', { op: 0.5 });
  for (const x of [140, 890]) f.flat(ell([x, gy - 1], 14, 3, 0, 8), '#3a3430', { op: 0.6 });
  return f;
}

// ------------------------------------------------------------------ THE HIVE QUEEN (ruler, 4, cropped by the frame)
// The first wasp to nest on a lightning-struck tower, grown to fill the inside of the spire. She clings head-down to the
// spire's inner wall of chewed hive paper, her back to the wall and her belly to the party; six thick legs splay out
// and hook their claws into the paper. The spire's iron lightning rod runs down the wall and into her back, welded into
// the chitin with fused copper, and the burns branch out from it across her thorax. Her egg-laying gaster is swollen
// past all reason (toxin, pushed hard): it rises from the petiole, arches out of the top of the frame and curls forward
// over the party, its intersegmental membranes stretched so thin that the white-violet charge she stores shows through,
// and the pale eggs behind them. The sting hangs ready at its end, and the Tooth is driven through the sting's base,
// grown round with chitin and copper. Torn wings buzz with static; the antennae crackle. Compound eyes, hinged
// mandibles with venom on them. The wall behind her: paper bands, brood comb with grubs, scorched strike channels,
// fruiting stalks and mould.
// Rig: spire (root: the wall, floor and rod) + body (thorax) + head + mandible_n, mandible_f + antenna_n, antenna_f +
// abdomen_1..3 (the gaster chain) + sting (parent abdomen_3) + wing_n, wing_f + leg_n1..3, leg_f1..3.
// Motion: idle a pulsing abdomen and twitching antennae; attack a stinger strike that paralyses (the gaster chain curls,
// the sting drives down).
function hiveQueen() {
  const seed = 1000, h = TIERS.ruler[1];
  const f = new Fig(X.base(seed, h, { grimeY: 1900 }));
  X.texturesX(f);
  const gy = f.o.groundY, sd = seed;
  const CHQ = (o = {}) => X.CH(f, Object.assign({ fill: '#2a2832', light: '#6a6478', shadow: '#09080c', tex: 'growth' + sd, texOp: 0.45, maxShade: 60 }, o));
  const legN = CHQ({ fill: '#2c2a34', tex: 'pit' + sd, texOp: 0.4 }), legF = CHQ({ fill: '#1a1820', light: '#46424e', tex: 'pit' + sd, texOp: 0.4 });
  const T = [640, 780], PET = [650, 566], NK = [680, 1000];
  const GC = [[650, 566], [662, 420], [722, 252], [842, 112], [1010, 42], [1180, 66], [1326, 180], [1410, 360], [1446, 560]];
  const LN = [
    [[742, 980], [792, 1006], [904, 960], [966, 1120], [934, 1262]],
    [[772, 862], [822, 850], [952, 762], [1014, 900], [992, 1010]],
    [[762, 706], [812, 684], [904, 560], [884, 420], [842, 330]],
  ];
  const LF = [
    [[700, 980], [660, 1010], [520, 1082], [420, 1182], [380, 1300]],
    [[700, 850], [650, 852], [482, 902], [382, 822], [332, 880]],
    [[700, 700], [650, 690], [482, 620], [402, 480], [380, 380]],
  ];
  const rodA = [170, -20], rodB = [566, 690];
  f.joint('spire', [500, 1500], null).joint('body', T, 'spire').joint('head', NK, 'body');
  f.joint('abdomen_1', PET, 'body').joint('abdomen_2', [760, 210], 'abdomen_1').joint('abdomen_3', [1250, 110], 'abdomen_2');
  f.joint('wing_f', [560, 610], 'body').joint('wing_n', [590, 620], 'body');
  LN.forEach((J, i) => f.joint('leg_n' + (i + 1), J[0], 'body')); LF.forEach((J, i) => f.joint('leg_f' + (i + 1), J[0], 'body'));

  // ---- the spire wall: chewed hive paper in bands, ribbed, its broken edge torn open on the right; brood comb with
  // grubs, scorched strike channels, fruiting stalks and mould; the floor of paper debris
  f.bone('spire');
  const WL = [[0, 0], [1030, 0], [1070, 160], [1010, 330], [1090, 560], [1030, 760], [1110, 980], [1050, 1200], [1120, 1400], [1080, 1570], [0, 1570]];
  f.part(WL, X.PAP(f, { maxShade: 20, shade: 0.2 }));
  X.clipDraw(f, WL, () => {
    for (let i = 0; i < 34; i++) { const y = i * 48 + R2(f, -10, 10), w = R2(f, 4, 22), pts = []; for (let k = 0; k <= 8; k++) pts.push([k * 140, y + Math.sin(k * 0.9 + i) * 14 + (k - 4) * (k - 4) * 1.2]); f.stroke(pts, w, f.r() < 0.5 ? mix(P.paper, '#000', 0.3) : P.paperL, { op: 0.35 }); } // pulp bands, scallops of chewed wood laid course by course
    for (const x of [120, 900]) { f.stroke([[x, 0], [x + 40, 400], [x + 20, 900], [x + 60, 1500]], 60, mix(P.paper, '#000', 0.3), { op: 0.4 }); f.stroke([[x + 26, 0], [x + 66, 400], [x + 46, 900], [x + 86, 1500]], 10, P.paperL, { op: 0.35 }); } // buttress ribs
    f.flat([[0, 0], [180, 0], [140, 1570], [0, 1570]], '#000', { op: 0.35 }); f.flat([[880, 0], [1120, 0], [1120, 1570], [900, 1570]], '#000', { op: 0.3 }); // the curve of the wall into shadow
    f.flat([[0, 1300], [1120, 1300], [1120, 1570], [0, 1570]], '#1a1612', { op: 0.3 });
  });
  // brood comb on the wall, cells capped or holding grubs
  const comb = (c, nx, ny, r) => { for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const q = add(c, [i * r * 1.75 + (j % 2) * r * 0.87, j * r * 1.5]), hx = []; for (let k = 0; k < 6; k++) hx.push(add(q, rot([r, 0], k * Math.PI / 3 + Math.PI / 6))); f.part(hx, { fill: P.paperL, shadow: P.paperD, shade: 0.3, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false }); const v = f.r(); if (v < 0.4) f.flat(ell(q, r * 0.7, r * 0.7, 0, 8), '#1a1612'); else if (v < 0.75) { f.flat(ell(q, r * 0.7, r * 0.7, 0, 8), '#1a1612'); X.grub(f, q, f.r() * 6, r / 16, { col: P.venP }); } else f.flat(ell(q, r * 0.66, r * 0.66, 0, 8), '#c8c0aa', { op: 0.9 }); } };
  comb([90, 1040], 5, 6, 22); comb([150, 160], 4, 4, 18);
  X.lichtenberg(f, [300, 0], 1.75, 520, 9, { col: '#141010', lite: P.vioL, depth: 3 }); // a strike channel burnt down the paper
  X.lichtenberg(f, [980, 1240], 2.4, 260, 6, { col: '#141010', lite: P.vioL, depth: 2 });
  for (const [x, y, a] of [[60, 700, -1.2], [90, 720, -1.6], [40, 740, -0.9], [980, 620, -2.0], [960, 640, -2.5]]) X.cordyceps(f, [x, y], a, 90, 8, { bend: 0.3 });
  X.mould(f, [70, 760], 60, 40, 40); X.mould(f, [1000, 1420], 60, 40, 40);
  X.hole(f, [260, 560], 30, 46, 0.1, { lip: P.paperL, bruise: '#1a1612' });
  // the floor: paper debris, husks of drones, a drift of dead
  f.part([[0, 1490], [300, 1476], [700, 1488], [1120, 1470], [1600, 1480], [1600, 1600], [0, 1600]], X.PAP(f, { fill: P.paperD, shade: 0.2, cast: false }));
  for (let i = 0; i < 9; i++) { const q = [R2(f, 40, 1560), R2(f, 1500, 1560)]; f.part(ell(q, R2(f, 16, 30), R2(f, 7, 12), R2(f, -0.4, 0.4), 10), CHQ({ cast: false, inkW: 1.2 })); f.flat(ell(add(q, [6, -2]), 8, 4, 0, 8), P.ven, { op: 0.7 }); }
  // the lightning rod: an iron rod stapled down the wall, its point driven into her back
  f.part(limb(rodA, rodB, 30, 26, { steps: 10 }), { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.42, tex: 'pit' + sd, texOp: 0.7 });
  f.line([lp(rodA, rodB, 0.02, -8), lp(rodA, rodB, 0.98, -7)], 2, '#8a8a92', { op: 0.6 });
  for (const t of [0.12, 0.4, 0.68]) { const q = lerp(rodA, rodB, t); f.part([add(q, [-30, -16]), add(q, [20, -22]), add(q, [24, -8]), add(q, [-28, 0])], { fill: P.iron, shadow: P.ironD, shade: 0.4, inkW: 1.2, cast: false }); f.rivet(add(q, [-22, -8]), 4); f.rivet(add(q, [16, -14]), 4); }
  for (const t of [0.25, 0.55, 0.85]) X.fusedRun(f, lp(rodA, rodB, t, 10), 30, 7, P.copper);

  // ---- far legs and wings, behind her
  LF.forEach((J, i) => { f.bone('leg_f' + (i + 1)); X.ileg(f, J, 70, legF, { spines: 4, hairs: 8, tib: 1.2 }); f.flat(ell(J[4], 16, 10, 0, 8), '#0c0a08', { op: 0.6 }); });
  // wings built cell by cell: veined, translucent panes, torn cells and a ragged trailing margin, one cell burnt through
  f.bone('wing_f');
  X.cellWing(f, [560, 610], -1.7, 560, 160, { tr: -1, op: 0.22, tears: [3, 6], holes: [[7, 3]] });
  f.bone('wing_n');
  X.cellWing(f, [596, 600], -2.05, 780, 230, { tr: -1, op: 0.32, tears: [2, 5, 7], holes: [[6, 2], [3, 3], [7, 3]], burn: [5, 1] });
  X.cellWing(f, [604, 640], -2.5, 520, 150, { tr: -1, op: 0.28, tears: [4, 6], holes: [[5, 3]] });

  // ---- the gaster: swollen past reason, banded black and venom green, its stretched membranes showing the stored charge
  // and the eggs; pustules ripening along the sternites; a strike fern across a tergite
  const qhw = u => u < 0.08 ? 36 + u / 0.08 * 90 : u < 0.25 ? 126 + (u - 0.08) / 0.17 * 80 : u < 0.5 ? 206 + Math.sin((u - 0.25) / 0.25 * Math.PI / 2) * 14 : u < 0.85 ? 220 - (u - 0.5) / 0.35 * 110 : 110 - (u - 0.85) / 0.15 * 74;
  const segBone = i => i < 2 ? 'abdomen_1' : i < 4 ? 'abdomen_2' : 'abdomen_3';
  const GCs = X.spline(GC, 3), GS = X.arcLen(GCs), GL = GS[GS.length - 1];
  const gp = (u, k) => { const A = X.at(GCs, GS, Math.max(0, Math.min(1, u)) * GL); return add(A.p, mul(A.n, k * qhw(Math.max(0, Math.min(1, u))))); }, gpt = gp;
  // The gaster is swollen with eggs: six tergites (k -1 is the outer, dorsal curve; +1 the inner, ventral) that cannot
  // stretch, and the intersegmental membrane between them that must. Where she is most swollen (the middle segments, on
  // the outer curve) the plates are pulled far apart and the membrane shows wide, thin and pale, the eggs and the stored
  // charge showing through it; on the inner curve the plates still overlap.
  const NS = 6, swell = [0.45, 0.9, 1.25, 1.3, 1.0, 0.5], wrap = 0.62;
  const kk = (k0, k1, n) => { const r = []; for (let q = 0; q <= n; q++) r.push(k0 + (k1 - k0) * q / n); return r; };
  const MEMQ = { fill: '#8e889a', shadow: '#2e2a38', light: '#d6cee6', shade: 0.42, tex: 'wrinkle' + sd, texOp: 0.6, maxShade: 60, cast: false };
  for (let i = 0; i < NS; i++) {
    f.bone(segBone(i));
    const u0 = i / NS - 0.01, u1 = (i + 1) / NS + 0.012, M = [];
    for (let q = 0; q <= 8; q++) M.push(gp(u0 + (u1 - u0) * q / 8, -0.97)); for (let q = 8; q >= 0; q--) M.push(gp(u0 + (u1 - u0) * q / 8, 0.98));
    f.part(M, MEMQ);
    X.clipDraw(f, M, () => {
      const ug = (i + 1) / NS - 0.03 * swell[i], ang2 = Math.atan2(gp(ug, 1)[1] - gp(ug, -1)[1], gp(ug, 1)[0] - gp(ug, -1)[0]);
      X.glow(f, gp(ug, -0.55), 36 * swell[i], 70, P.vio, 0.22, false, ang2); // the stored charge, a dull violet light deep in the swelling
      for (let e = 0; e < 7; e++) { const p = gp(ug + R2(f, -0.02, 0.02), R2(f, -0.95, 0.2)); f.part(ell(p, R2(f, 10, 15), R2(f, 6, 9), ang2 + 1.57 + R2(f, -0.3, 0.3), 10), { fill: '#e2dcc8', shadow: '#8a8474', shade: 0.4, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false, opacity: 0.75 }); } // eggs pressed against the skin
      for (let t = 0; t < 3; t++) { const p0 = gp(ug - 0.025, R2(f, -0.9, -0.1)); f.line([p0, add(p0, rot([30, 8], ang2 - 1.57)), add(p0, rot([60, -6], ang2 - 1.57))], 1.4, '#3a3048', { op: 0.6 }); } // tracheae
      for (let t = 0; t < 10; t++) { const kq = -0.95 + t * 0.2; f.line([gp(ug - 0.03, kq), gp(ug + 0.03, kq + 0.04)], 1, '#4a4458', { op: 0.35 }); } // stretch lines along the pull
    });
  }
  const TS = [];
  for (let i = NS - 1; i >= 0; i--) {
    f.bone(segBone(i));
    const u0 = i / NS - 0.015, gap = 0.072 * swell[i];
    const ur = k => (i + 1) / NS - gap * (0.35 + 0.65 * Math.max(0, Math.min(1, (wrap - k) / (wrap + 1)))) + 0.024 * Math.max(0, 1 - ((k + 0.2) / 0.9) ** 2); // the rear edge: pulled forward on the outer curve, bowed back mid-side
    // sternite under the inner curve: grey, overlapping, a small gap only
    const sw0 = wrap + 0.06 + 0.06 * swell[i]; const sn = [...kk(sw0, 1.02, 6).map(k => gp(u0 + 0.008, k)), ...kk(1.02, sw0, 6).map(k => gp((i + 1) / NS - 0.006 - 0.02 * swell[i] + 0.008 * (1 - ((k - sw0) / (1.02 - sw0) - 0.5) ** 2 * 4), k))];
    f.part(sn, CHQ({ fill: '#46444e', maxShade: 40, cast: false, inkW: 1.4, inkHeavy: 2.2 }));
    X.clipDraw(f, sn, () => { f.stroke(kk(1.02, wrap, 5).map(k => gp((i + 1) / NS - 0.012, k)), 10, '#000', { op: 0.35 }); for (let q = 0; q < 20; q++) f.flat(ell(gp(R2(f, u0, (i + 1) / NS), R2(f, wrap, 1)), 2, 1.5, 0, 5), '#08070a', { op: 0.5 }); });
    // the tergite: a hard plate with thickness, its front edge tucked under the plate in front
    const tg = [...kk(-1.03, wrap, 10).map(k => gp(u0, k)), ...kk(wrap, -1.03, 10).map(k => gp(ur(k), k))];
    f.part(tg, CHQ({ tex: 'pit' + sd, texOp: 0.55, maxShade: 46 }));
    X.clipDraw(f, tg, () => {
      if (i < 5) { const bd = [...kk(-1.1, wrap + 0.05, 8).map(k => gp(ur(k) - 0.04 - 0.004 * Math.sin(k * 5 + i), k)), ...kk(wrap + 0.05, -1.1, 8).map(k => gp(ur(k) + 0.01, k))]; f.part(bd, X.VN(f, { fill: mix(P.ven, P.chit, i % 2 ? 0.5 : 0.36), cast: false, inkW: 1.2, inkHeavy: 1.6, maxShade: 30 })); } // the venom-green hind band
      for (const k of [-0.7, -0.25, 0.2]) f.flat(ell(gp(u0 + 0.06, k), 16, 10, 0.4, 8), P.chitD, { op: 0.75 }); // the dark marks of the pattern
      for (let q = 0; q < 70; q++) f.flat(ell(gp(R2(f, u0, (i + 1) / NS), R2(f, -1, wrap)), 2.2, 1.6, 0, 5), '#08070a', { op: 0.55 }); // punctures
      f.scratches(gp(u0 + 0.06, -0.4), 60, 8, '#b8b0c8', 1, 0.6);
      f.stroke(kk(-0.95, 0.3, 6).map(k => gp(u0 + 0.06 + 0.012 * k, k)), 22, '#d0c8e4', { op: 0.22 }); f.stroke(kk(-1.05, wrap, 6).map(k => gp(u0 + 0.03, k)), 30, '#000', { op: 0.2 }); // the plate's curve: a lit crown, darker toward its front
      f.stroke(kk(-1.05, wrap, 8).map(k => gp(ur(k) - 0.008, k)), 16, '#000', { op: 0.45 }); // the plate's thickness at its rear lip, in shadow
      f.line(kk(-1.0, wrap - 0.05, 8).map(k => gp(ur(k) - 0.017, k)), 2.4, '#a8a0bc', { op: 0.55 }); // the worn bright edge of the lip
      f.stroke(kk(-1.05, wrap, 6).map(k => gp(u0 + 0.012, k)), 12, '#000', { op: 0.35 }); // the shadow where it slides under the plate in front
    });
    TS.push(tg);
  }
  f.bone('abdomen_2');
  X.burn(f, gpt(0.38, -0.5), 0.3, 220, 3.2, { depth: 3 });
  X.pustules(f, gpt(0.3, 0.8), 40, 60, 9, 6, 13);
  X.mould(f, gpt(0.45, 0.85), 50, 30, 30);
  f.bone('abdomen_3');
  X.pustules(f, gpt(0.72, 0.8), 30, 40, 6, 5, 11);
  // the sting: a long dark lancet out of the last segment, venom beading at the point; the Tooth driven through its base
  f.bone('sting');
  const sb = gpt(1, 0), sdv = E.norm(sub(gpt(1, 0), gpt(0.95, 0))), sa = Math.atan2(sdv[1], sdv[0]), stip = add(sb, mul(sdv, 190));
  f.joint('sting', sb, 'abdomen_3');
  f.part(X.mlimb(add(sb, mul(sdv, -20)), stip, [[0, 22], [0.4, 14], [0.85, 6], [1, 1]], [[0, 22], [0.4, 15], [0.85, 6], [1, 1]], { capK: 0.3 }), { fill: '#141218', light: '#5a5668', shadow: '#050406', shade: 0.42, inkW: 1.4, inkHeavy: 2.4, cast: false, tex: 'growth' + sd, texOp: 0.4 });
  f.line([lp(sb, stip, 0.05, -6), lp(sb, stip, 0.8, -2)], 1.6, '#8a84a0', { op: 0.6 });
  for (let i = 0; i < 6; i++) { const b0 = lp(sb, stip, 0.45 + i * 0.07, 7); f.line([b0, add(b0, rot([8, 6], sa))], 1.4, INK); } // barbs
  f.part(ell(add(stip, mul(sdv, 10)), 8, 11, sa, 10), { fill: P.venL, shadow: P.venD, shade: 0.4, inkW: 1, cast: false, hatch: false });
  const TC = lp(sb, stip, 0.1, 0), TA2 = sa + 1.35, TF = frame(TC, TA2, 1);
  f.part(TF([[-90, -16], [-60, -26], [0, -30], [40, -24], [80, -10], [110, 4, 1], [80, 14], [30, 22], [-20, 22], [-70, 20], [-100, 8]]), { fill: P.bone, shadow: '#5a5240', light: '#f2ead6', shade: 0.42, inkW: 1.6, inkHeavy: 2.6, cast: false, tex: 'wrinkle' + sd, texOp: 0.5 }); // the Tooth
  f.part(TF([[-100, -14], [-130, -22], [-150, -10], [-126, 2], [-140, 14], [-104, 12]]), { fill: '#b8ae94', shadow: '#5a5240', shade: 0.42, inkW: 1.3, cast: false }); // its forked root
  f.line(TF([[-60, -6], [20, -8], [90, 2]]), 1.4, '#fff8e8', { op: 0.7 }); f.line(TF([[-20, 8], [10, 18], [30, 6]]), 1.2, INK, { op: 0.6 }); // a crack
  f.part(X.lumpy(f, ell(TC, 34, 24, sa, 12), 6), CHQ({ fill: '#24202a', light: mix(P.copperL, P.vioL, 0.4), cast: false })); // chitin grown round it
  X.fusedRun(f, add(TC, [-10, 10]), 26, 6, P.copper);

  // ---- the thorax: the reviewed wasp mesosoma, scaled up, in a mirrored frame (dorsum to the wall, +x toward the head):
  // pronotal collar at the head end, scutum, scutellum, propodeum at the petiole; the rod's point welded in
  f.bone('body');
  const MF0 = frame(T, Math.PI / 2 + 0.06, 13.5), MF = pts => MF0(pts.map(q => q.length > 2 ? [q[0], -q[1], 1] : [q[0], -q[1]]));
  f.part(limb(PET, add(PET, [0, 70]), 80, 96, { steps: 4 }), CHQ());
  const TX = MF([[15, -6], [11, -14], [0, -17.5], [-10, -15.5], [-16.5, -9], [-19.5, 0], [-15.5, 8.5], [-6, 12.5], [6, 12.5], [13.5, 8.5]]);
  // the mesosoma as separate hard plates with crevices between them: the base is the dark membrane in the sutures
  f.part(TX, CHQ({ k: 0.9, maxShade: 110, fill: '#121118' }));
  const plate = (pts, o = {}) => { const q = MF(pts); f.part(q, CHQ(Object.assign({ k: 0.85, maxShade: 70, cast: false, inkW: 2, inkHeavy: 3.4 }, o))); return q; };
  const scorePlate = (q, n = 40) => X.clipDraw(f, q, () => { const bb = E.bbox(q); for (let i = 0; i < n; i++) f.flat(ell([R2(f, bb[0], bb[2]), R2(f, bb[1], bb[3])], 2.2, 1.6, 0, 5), '#08070a', { op: 0.55 }); });
  // mesopleuron: the side plate under the scutum, turned toward the ventral side and darker
  const PLc = plate([[3.6, -3.6], [-5.8, -4.6], [-10.6, -0.8], [-11.6, 6.8], [-6, 12.1], [5.6, 12.1], [7.6, 5.6]], { fill: '#24222c', maxShade: 50 });
  X.clipDraw(f, PLc, () => { f.line(MF([[2, -3], [-1, 4], [-4, 12]]), 3, INK, { op: 0.7 }); f.flat(MF(ell([-2, 3], 4, 3, 0.3, 10)), P.ven, { op: 0.6 }); f.flat(MF([[-12, 4], [8, 6], [8, 13], [-12, 13]]), '#000', { op: 0.4 }); });
  scorePlate(PLc, 30);
  // propodeum: slopes down into the petiole, a median furrow and two swollen side lobes
  const PRc = plate([[-15.6, -11.8], [-18.4, -6], [-19.1, 0], [-16.6, 5.6], [-12.2, 5.8], [-11.2, -1.6], [-12.4, -8.2]], { fill: '#26242e' });
  X.clipDraw(f, PRc, () => { f.line(MF([[-16, -10], [-16.4, -2], [-15, 5]]), 3, INK, { op: 0.7 }); f.stroke(MF([[-13, -7], [-12.4, -2], [-13, 3]]), 10, '#c8c0dc', { op: 0.25 }); });
  scorePlate(PRc, 30);
  // metanotum: a narrow ridged band
  const MTc = plate([[-13.2, -15.2], [-15.6, -13], [-16, -9.6], [-14.4, -9], [-12.8, -12]], { fill: '#2a2832' });
  f.line(MF([[-13.4, -14.4], [-15, -12.4], [-15.2, -10]]), 2, '#9a94b0', { op: 0.5 });
  // scutellum: a raised hump, venom-green edged
  const SCc = plate([[-8.2, -16.6], [-12.6, -15.4], [-14.2, -11.4], [-12, -8.6], [-8.4, -9.6]], { fill: mix(P.chit, P.ven, 0.35) });
  X.clipDraw(f, SCc, () => { f.stroke(MF([[-9, -15.6], [-12, -14.6], [-13.4, -12]]), 10, P.venL, { op: 0.35 }); f.flat(MF([[-8, -11], [-14, -11], [-14, -8], [-8, -8]]), '#000', { op: 0.35 }); });
  // mesoscutum: the big shield, parapsidal furrows and a median line, the rod welded through it
  const MSc = plate([[4.4, -16.4], [-2, -17.6], [-7.8, -16.4], [-8.8, -11], [-6, -5.4], [2, -4.6], [4.2, -10]], { fill: '#2c2a34' });
  X.clipDraw(f, MSc, () => {
    f.line(MF([[-2, -17], [-2.6, -10], [-3, -5.4]]), 2.4, INK, { op: 0.6 }); for (const y of [-14.8, -7.6]) f.line(MF([[2.6, y], [-2.5, y + (y < -10 ? 2 : -0.6)], [-7, y + (y < -10 ? 3.4 : -1.4)]]), 2, INK, { op: 0.5 }); // furrows
    f.stroke(MF([[2, -15.4], [-3, -16.4], [-7, -15.4]]), 12, P.chitP, { op: 0.4 }); // sheen along the curve of the shield
    f.flat(MF([[-8, -9], [4, -8], [4, -4], [-8, -4]]), '#000', { op: 0.35 });
    f.scratches(MF([[-2, -11]])[0], 60, 10, '#b8b0c8', 1.1, 0.8);
  });
  scorePlate(MSc, 50);
  // pronotum: the collar band at the head end, curving round to the side, venom-green, its front edge a raised rim
  const PNc = plate([[14.8, -6], [11, -14], [5.4, -16.6], [3.4, -10.4], [4, -0.2], [6, 8.2], [13.4, 8.4]], X.VN(f, { fill: mix(P.ven, P.chit, 0.3), maxShade: 60, tex: 'pit' + sd, texOp: 0.5 }));
  X.clipDraw(f, PNc, () => { f.stroke(MF([[13.6, -6], [10.4, -13], [6, -15.6]]), 14, '#000', { op: 0.35 }); f.line(MF([[12.8, -5.4], [9.8, -12.4], [5.6, -15]]), 2.4, P.venP, { op: 0.6 }); f.flat(MF([[3, 2], [14, 2], [14, 9], [3, 9]]), '#000', { op: 0.4 }); f.flat(MF(ell([10, 2], 2.4, 3.6, 0, 10)), P.chitD, { op: 0.55 }); });
  scorePlate(PNc, 30);
  const fringe = (O, n, L, skip) => { const C = X.spline([...O, O[0]], 3), S = X.arcLen(C), Lt = S[S.length - 1], cen = O.reduce((a, p) => add(a, mul(p, 1 / O.length)), [0, 0]); for (let i = 0; i < n; i++) { const A = X.at(C, S, Lt * i / n), p = A.p; if (skip && skip(p)) continue; const d = E.norm(add(E.norm(sub(p, cen)), mul(A.d, 0.6))), l = L * R2(f, 0.5, 1.1), q = [p, add(add(p, mul(d, l * 0.5)), mul(A.d, 3)), add(add(p, mul(d, l)), mul(A.d, 8))]; f.stroke(q, R2(f, 2, 3.4), i % 3 ? '#1a1820' : '#5a5666'); } };
  fringe(TX, 120, 26, p => p[1] > 950);
  f.part(MF(ell([-8, -16], 3.4, 2.2, 0.2, 12)), CHQ({ fill: mix(P.ven, P.chit, 0.4), cast: false, inkW: 1.4 })); // tegula over the wing roots
  f.part(X.lumpy(f, ell(rodB, 44, 32, 0.9, 12), 8), CHQ({ fill: '#2a2026', light: mix(P.copperL, P.vioL, 0.4), cast: false }));
  f.part(ell(rodB, 18, 15, 0.9, 10), { fill: P.copper, shadow: P.copperD, light: P.copperL, shade: 0.4, inkW: 1.3, cast: false });
  X.burn(f, add(rodB, [10, 10]), 0.8, 220, 3.2, { depth: 3 }); X.burn(f, add(rodB, [0, 10]), 1.9, 160, 2.6, { depth: 2 });
  X.fusedRun(f, add(rodB, [16, 20]), 40, 7, P.copper);
  // ---- near legs splayed out, claws hooked into the paper; a tarsus missing on the hind leg
  LN.forEach((J, i) => { f.bone('leg_n' + (i + 1)); X.ileg(f, J, 88, legN, { spines: 5, hairs: 10, tib: 1.2 }); f.flat(ell(J[4], 18, 10, 0, 8), '#0c0a08', { op: 0.6 }); });
  f.bone('leg_n2'); X.mould(f, LN[1][2], 24, 20, 20); X.burn(f, lp(LN[1][1], LN[1][2], 0.4, 0), -0.6, 90, 1.8, { depth: 2 });
  f.bone('leg_n1'); X.pustules(f, lp(LN[0][1], LN[0][2], 0.5, 10), 20, 12, 3, 4, 7);

  // ---- the head, hanging off the thorax, face turned toward the party: the reviewed wasp head scaled up in the same
  // mirrored frame (vertex to the wall): a kidney compound eye down its side, ocelli, the green-marked clypeus, two
  // hinged mandibles (the near one open) with venom on them, antennae crackling
  f.bone('head');
  const ha = 1.18, HC = [700, 1196], HF0 = frame(HC, ha, 11.5), HF = pts => HF0(pts.map(q => q.length > 2 ? [q[0], -q[1], 1] : [q[0], -q[1]]));
  f.part(limb(NK, HF([[-9, 0]])[0], 130, 120, { steps: 4 }), CHQ());
  f.bone('mandible_f'); f.joint('mandible_f', HF([[7, 14]])[0], 'head');
  X.mandible(f, HF([[7, 14]])[0], ha - 0.75, 150, 56, CHQ({ fill: '#3a3020', light: '#8a7650' }), 1);
  f.bone('head');
  // final pass 2026-11-25 (head only; the spire bone is untouched): the head read as one dark dome dominated by a huge
  // grey eye, and the green clypeus with a dark spot in it read as a second, green eye. The capsule is now built of
  // plates with their own values: a lit frons between the eye and the clypeus, a broad gena (cheek) under the eye, the
  // vertex ridge, sutures as dark grooves with lit lips, the antennal sockets as raised rings; the eye is smaller,
  // notched where the antenna sits, set back on the side; the clypeus is a flat toothed plate with a median keel and no
  // spot; the venom marks are paired stripes on the frons, not dots.
  const HD = HF([[-7, -12], [3, -16.5], [11.5, -12.5], [14.5, -3], [14, 6], [12.5, 12], [8, 16.5], [0, 17], [-5, 13], [-8.5, 7], [-9.5, -2]]);
  f.part(HD, CHQ({ k: 0.9, maxShade: 90 }));
  X.clipDraw(f, HD, () => {
    f.flat(HF([[-9, 4], [4, 10], [12, 12], [10, 20], [-10, 20]]), '#000', { op: 0.35 });
    f.stroke(HF([[2, -14], [9, -11], [13, -3]]), 8, P.chitP, { op: 0.4 });
    for (let q = 0; q < 40; q++) f.flat(ell(HF([[R2(f, -8, 13), R2(f, -14, 14)]])[0], 2, 1.5, 0, 5), '#08070a', { op: 0.5 });
    // the frons: a lit plate from the vertex down between the eye and the clypeus
    f.part(HF([[3.5, -11.5], [9.5, -10], [13, -3], [13, 3.5], [8.5, 4.5], [5.5, -1], [3, -6]]), CHQ({ fill: '#4e4a5e', light: '#a49ebc', inkW: 0, inkHeavy: 0, cast: false, maxShade: 20 }));
    f.stroke(HF([[5, -10], [9, -7.5], [11.5, -2], [12, 2]]), 16, '#b8b2cc', { op: 0.4 }); // its lit crown
    // the gena: the cheek plate under the eye, turning away from the light, a lit rim along its edge
    f.part(HF([[-8.5, 3], [-3, 6.5], [3, 8.5], [5.5, 12.5], [2, 16.5], [-4.5, 13], [-8, 7]]), CHQ({ fill: '#24222c', light: '#5e5870', inkW: 0, inkHeavy: 0, cast: false, maxShade: 30 }));
    f.line(HF([[-9, 1], [-8, 7], [-4.5, 12.5], [1.5, 16.3]]), 2.4, '#7a7490', { op: 0.55 });
    // sutures: the frontal line down the middle of the frons, the epistomal groove over the clypeus, the genal groove
    for (const [pts, w] of [[[[4, -12], [6.5, -5], [8, 3.5]], 3], [[[5.5, 4.5], [9.5, 3.4], [13.6, 3]], 3.4], [[[-2.5, 6], [2.5, 8.5], [5, 11.5]], 3]]) { f.line(HF(pts), w, '#060508', { op: 0.75 }); f.line(HF(pts.map(q => [q[0] + 0.4, q[1] + 0.5])), w * 0.5, '#9a94b0', { op: 0.45 }); }
    // the venom marks: paired stripes on the frons, the wasp's warning pattern
    for (const [x0, y0, x1, y1] of [[6, -9.5, 8.5, -4], [9.5, -8.5, 11.5, -3.5]]) f.stroke(HF([[x0, y0], [(x0 + x1) / 2 + 0.3, (y0 + y1) / 2], [x1, y1]]), 9, P.ven, { op: 0.6 });
    // the temple: a second lit plane behind the eye; the occiput's raised rim where the head meets the neck
    f.raw(`<path d="${E.smooth(HF([[-6.5, -12], [1, -15.2], [2.5, -11.5], [-1.5, -8], [-6, -6.5]]))}" fill="#a49ebc" opacity="0.16"/>`);
    f.stroke(HF([[-8.6, -8], [-9.4, -1], [-8.8, 5]]), 12, '#050407', { op: 0.6 }); f.line(HF([[-8, -8.5], [-8.7, -1], [-8.1, 5]]), 2.6, '#8a84a0', { op: 0.5 });
    // pits and fine hairs on the cheek
    for (let q = 0; q < 18; q++) { const c0 = HF([[R2(f, -7, 3), R2(f, 7, 15)]])[0]; f.line([c0, add(c0, [R2(f, -3, 3), 7])], 0.9, '#6a6480', { op: 0.5 }); }
  });
  fringe(HD, 90, 22, p => p[1] < 1060);
  f.stroke(HF([[-6, -12.5], [3, -16], [11, -12.5]]), 6, '#0a090c', { op: 0.7 }); f.stroke(HF([[-5, -13.5], [3, -17], [10, -13.5]]), 2.4, '#9a94b0', { op: 0.6 }); // the vertex ridge
  // the compound eye: smaller, set back on the side of the head, notched (emarginate) where the antenna sits, dull
  X.ceye(f, HF([[-3.5, -3]])[0], 40, 98, ha - 0.12, { kidney: 0.62, glints: 2, col: '#2a2832' });
  f.line(ell(HF([[-3.5, -3]])[0], 42, 100, ha - 0.12, 20).slice(11, 17), 2.4, '#7a7490', { op: 0.45 }); // the lit rim of the eye
  f.stroke(ell(HF([[-3.5, -3]])[0], 48, 106, ha - 0.12, 20).slice(2, 9), 6, '#060508', { op: 0.55 }); // the socket groove behind it
  for (const q of [[-3, -14], [0, -15.5], [-1, -12]]) { f.flat(ell(HF([q])[0], 6, 5, 0, 8), '#0a090c'); f.flat(ell(add(HF([q])[0], [-1.5, -1.5]), 1.6, 1.2, 0, 5), '#8a84a0', { op: 0.6 }); } // ocelli, small
  // the antennal sockets: raised rings, lit on their upper lip
  for (const q of [[7, -9], [9, -8]]) { const c0 = HF([q])[0]; f.part(ell(c0, 19, 15, ha, 12), CHQ({ fill: '#3a3644', inkW: 1.2, cast: false, maxShade: 8 })); f.line(ell(c0, 19, 15, ha, 12).slice(6, 11), 2, '#a6a0bc', { op: 0.55 }); f.flat(ell(c0, 10, 8, ha, 10), '#09080c'); }
  // the clypeus: a flat plate with a median keel, its lower edge cut into blunt teeth; muted venom colour, no spot
  { const CL = HF([[6.5, 4.8], [13.6, 3.6], [13.8, 10.5], [12.6, 12.5], [11.8, 11.4], [10.6, 13.6], [9.6, 12.2], [8.4, 14.6], [7.4, 12.6], [5.2, 10.8]]);
    f.part(CL, X.VN(f, { fill: mix(P.ven, P.chit, 0.5), inkW: 1.6, cast: false, maxShade: 40 }));
    f.line(HF([[7.4, 5.2], [9.6, 8.4], [10.4, 12.4]]), 2.2, P.chitD, { op: 0.7 }); f.line(HF([[7.8, 5], [10, 8.2]]), 1.4, '#e0e8c0', { op: 0.4 }); // the keel
    f.line(HF([[7, 5.4], [13.2, 4.2]]), 2.4, '#e0e8c0', { op: 0.35 }); // its lit upper edge
    f.flat(HF([[11, 9], [13.6, 8], [13.6, 11.5], [12, 12]]), '#000', { op: 0.3 }); }
  X.burn(f, HF([[4, -14]])[0], ha + 2.8, 120, 2.2, { depth: 2 });
  f.bone('mandible_n'); f.joint('mandible_n', HF([[6.5, 13.5]])[0], 'head');
  const mt = X.mandible(f, HF([[6.5, 13.5]])[0], ha - 0.2, 180, 66, CHQ({ fill: '#4a3c26', light: '#9a8458' }), 1);
  f.stroke([mt, add(mt, [2, 22]), add(mt, [0, 40])], 7, P.venL, { op: 0.85 }); X.drip(f, add(mt, [0, 42]), 2.4, P.venL);
  for (const [nm, a0, ctl, w] of [['antenna_f', [7, -9], [[7, -9], [8, 4], [4, 18], [-4, 30], [-14, 36]], 14], ['antenna_n', [9, -8], [[9, -8], [14, 6], [14, 22], [8, 36], [-2, 46]], 17]]) {
    const b0 = HF([a0])[0]; f.bone(nm); f.joint(nm, b0, 'head');
    const tip = X.antenna(f, HF(ctl), w, nm === 'antenna_n' ? legN : legF, { n: 20 });
    f.part(X.lumpy(f, ell(tip, w * 0.9, w * 0.7, 0, 10), 2), CHQ({ fill: '#1a1418', light: mix(P.vioL, '#888', 0.4), cast: false, inkW: 1.2 })); f.flat(ell(add(tip, [-2, -2]), w * 0.35, w * 0.25, 0, 8), mix(P.vioL, '#fff', 0.3), { op: 0.4 }); // the tip fused glassy
    const AC2 = X.spline(HF(ctl), 4); X.standingHair(f, AC2.filter((_, q) => q % 3 === 1).slice(0, 12), w * 1.4, { col: '#1a1820', w: 1.6, fan: 0.6, lean: -0.4 }); // bristles standing along the scape
  }
  return f;
}

module.exports = {
  heroes: [
    { key: 'hive_queen', name: 'The Hive Queen', tier: 'ruler', w: 1600, h: 1600, flip: true, build: hiveQueen },
    { key: 'mantis_duelist', name: 'Mantis Duelist', tier: 'elite', w: 1100, h: 1400, flip: true, build: mantisDuelist },
    { key: 'brood_mother', name: 'Brood Mother', tier: 'elite', w: 1100, h: 1400, flip: true, build: broodMother },
    { key: 'venom_spider', name: 'Venom Spider', tier: 'large', w: 900, h: 1100, flip: true, build: venomSpider },
    { key: 'puppet_host', name: 'Puppet Host', tier: 'human', w: 600, h: 820, flip: true, build: puppetHost },
    { key: 'galvanic_beetle', name: 'Galvanic Beetle', tier: 'large', w: 900, h: 1100, flip: true, build: galvanicBeetle },
    { key: 'hive_drone', name: 'Hive Drone', tier: 'small', w: 600, h: 820, flip: true, build: hiveDrone },
    { key: 'spire_wasps', name: 'Spire Wasps', tier: 'small', w: 600, h: 820, flip: true, build: spireWasps },
  ],
};
// every figure's ground line is its canvas height minus 30 (the rig export reads groundY from the figure options)
for (const e of module.exports.heroes) { const b = e.build; e.build = () => { const f = b(); if (f.o.groundY !== e.h - 30) throw new Error(`${e.key}: groundY ${f.o.groundY}, expected ${e.h - 30}`); return f; }; }
