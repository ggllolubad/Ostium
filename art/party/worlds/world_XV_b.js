// World XV, The Torn Sky (Lightning + Void, Discharge), second batch. A heaven torn open by the void's betrayal of the
// Mother of Courses; there was no war. The ruins float in the storm and something looks in through the tears. The host
// is her broken court, not an army: a doorkeeper still holding the key to a gate that is gone, a herald still sounding,
// the recorder of names, the weigher, the lamplighter, the wheels that bore her seat, the lions on its steps, the guardian
// that watched it. Each still does its office, broken.
// Lightning (dominant) scars everything with violet branching Lichtenberg burns clipped to the surfaces they lie on, fuses
// metal and joints, stands hair and feathers on end; no arcs or bolts are drawn in the air (strikes are engine effects).
// Void (second) cracks bodies open onto darkness with clean rims; eyes are expected here.
// Palette: gold leaf cracked over black (laid as plates with form modelling, never flat yellow, never spotted), violet
// burns; plus ink black, bone and grey. Red only as the rubric strikes in the Recording Angel's book.
// Foes face left: every figure is drawn facing right with kit.foeBase and flipped. Built for the rig from the start.
// Seeds 1520 + index in bible order: Wheel of Thrones 1520, Fourfold Beast 1521, Recording Angel 1522, Weigher of Souls
// 1523, Porter of Heaven 1524, Herald of Heaven 1525, Putto 1526, Scorched Doves 1527, Throne Lion 1528, Rift Crawler
// 1529, Star-Lighter 1530.
'use strict';
const K = require('../kit');
const X = require('./kit_XV_b');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang, R, AR, ARD, SKA, LTH, CLB, scorch, weld, gilt, mFist, onPlane } = X;
const dir = a => [Math.cos(a), Math.sin(a)];

// ---------------------------------------------------------------- shared angel parts
// A head (B.head, three-quarter, face shading 0.8) with the gilt or pale skin laid as leaf plates, cut by cracks.
function angelHead(f, HC, H, hA, o = {}) {
  const gold = !!o.gold, skin = o.skin || (gold ? '#b08a3a' : '#d0c2a6');
  const F = B.head(f, HC, H, hA, Object.assign({ skin, jaw: 1.05, chin: 0.01, nose: 1.0, mouth: 'set', squint: 0.45, browDown: 0.03, lips: false, faceShade: 0.8, faceHatch: false, iris: P.vioD, hairCol: '#1e1a20', browCol: '#1a1418', browW: 0.05 }, o.head || {}));
  const face = F(X.FACE);
  X.clipDraw(f, E.smooth(face), () => {
    if (gold) X.leaf(f, face, { cell: H * 0.32, s: 0.55, chips: 2, open: 0.1, nB: 1, burnish: false });
    X.softTone(f, E.smooth(face), [[F([[-0.1, -0.1], [0.15, -0.05], [0.18, 0.3], [-0.05, 0.45], [-0.3, 0.2]]), gold ? '#140a02' : '#2a2030', 0.28, H * 0.06], [F([[0.12, -0.32], [0.3, -0.26], [0.3, -0.16], [0.14, -0.2]]), '#fff6dc', 0.35, H * 0.03]]);
    if (o.inFace) o.inFace(F);
  });
  return F;
}
// a sandal: a sole under the bare foot, straps over the instep and round the ankle, scorched
function sandal(f, A, s, o = {}) {
  const gy = f.o.groundY, X0 = u => A[0] + u * s, h = gy - A[1];
  f.part([[X0(-0.42), gy - 5], [X0(1.3), gy - 5], [X0(1.32), gy + 1, 1], [X0(-0.44), gy + 1, 1]], LTH(f, { maxShade: 3, cast: false, inkW: 1.1 }));
  for (const [u0, u1, y0, y1] of [[-0.3, 0.32, h * 0.05, h * 0.18], [0.18, 0.62, h * 0.3, h * 0.55], [0.55, 0.96, h * 0.58, h * 0.72]]) {
    const a = [X0(u0), A[1] + y0], b = [X0(u1), A[1] + y1], m = add(lerp(a, b, 0.5), [0, -3]);
    f.line([a, m, b], 5.2, INK, { op: 0.9 }); f.line([a, m, b], 3.4, o.col || '#3a2e30'); f.line([a, m].map(q => add(q, [0, -1])), 1, '#6a5a5a', { op: 0.6 });
  }
  X.charEdge(f, [[X0(0.5), A[1] + h * 0.42], [X0(0.62), A[1] + h * 0.55]], 3, { gap: 30 });
}

// ------------------------------------------------------------------ PORTER OF HEAVEN (cast, human 1.15)
// It kept the gate. The gate is gone. It still has the key. A heavy, short-necked doorkeeper of the Mother's gate, standing
// guard square on both feet, the huge key carried over the near shoulder like a club (the hand on the shank behind the
// bow, the shank resting on the shoulder, the warded bit hanging behind its back), a section of the gilded gate grille
// strapped to the far forearm and held across the front as a shield. Gilt skin (leaf over black) cracked along the jaw
// and the collarbone onto void; a third eye open in a crack on the brow. The near wing torn off at the root, the stump
// cracked open onto darkness; the far wing folded high behind. Burns branch down the key arm from the shoulder.
// Dress: a short gilded mail coat over a black warden's tabard worked with a key device, a belt with a ring of smaller
// keys, an open padlock at the hip, a chain from the key's bow to the belt, scorched sandals, a cracked halo.
// Rig: standard humanoid + key (hand_n) + shield (forearm_f) + skirt (pelvis) + halo (head) + wing_f_1..3, stump (torso).
// Motion: idle tapping the key on its shoulder (forearm_n, key); attack a swing of the key (upperarm_n back then over).
function porter() {
  const CW = 760, CH = 900, seed = 1524;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 115, gy = f.o.groundY;
  const N = [392, 272], C = [382, 392], Pv = [380, 508];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.22, 0.1), SF = S.at(0.48, 0.1);
  const EN = [440, 446], WN = [480, 360];
  const EF = [476, 414], WF = [548, 430];
  const HN = S.at(-0.18, 1.0), KN = [420, 694], AN = [436, 832];
  const HF = S.at(0.26, 1.0), KF = [352, 690], AF = [318, 830];
  const HC = [414, 202], hA = 0.05, neck0 = S.at(0.14, -0.06);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const kA = -2.55, kD = dir(kA), kN = [-kD[1], kD[0]];
  f.joint('key', WN, 'hand_n').joint('shield', lerp(EF, WF, 0.5), 'forearm_f').joint('skirt', S.at(0, 0.84), 'pelvis').joint('halo', add(HC, [-30, -40]), 'head').joint('stump', S.at(-0.8, 0.14), 'torso');
  const Wf = { S: S.at(-0.4, 0.02), E: [318, 168], W: [272, 230], T: [214, 640] };
  f.joint('wing_f_1', Wf.S, 'torso').joint('wing_f_2', Wf.E, 'wing_f_1').joint('wing_f_3', Wf.W, 'wing_f_2');
  const GS = (o = {}) => X.GILT(f, o);

  // ---- the far wing, folded high behind: the wrist above the shoulder, the primaries hanging to the calf
  X.wing(f, Wf.S, Wf.E, Wf.W, Wf.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: -1, Lp: 230, Ls: 120, Wp: 22, Ws: 22, np: 8, ns: 8, nt: 3, look: X.FE(f, { fill: mix(P.plume, '#000', 0.22) }), skin: GS({ fill: mix(P.gold, '#000', 0.25) }), lift: true, notchP: [2, 5], notchS: [3, 6], rake: -0.2, wS: 34, wE: 24, wW: 18, darkTips: 0.5, spreadP: 0.22, cover: true, pLen: t => 0.8 + 0.26 * Math.sin(t * 4.1), sLen: t => 0.8 + 0.2 * Math.sin(t * 5 + 1) });
  // ---- the halo, cracked into four, tilted behind the head
  f.bone('halo');
  X.crackedHalo(f, add(HC, [-26, -46]), 70, 48, -0.25, 13, [0.1, 0.36, 0.62, 0.86], { drift: 8, lost: 0.3 });

  // ---- far leg (behind): bare gilt leg under the tabard, a scorched sandal
  const LEGL = o => GS(Object.assign({ fill: mix('#b08a3a', '#000', 0.25), maxShade: 14 }, o));
  X.bareLegRig(f, HF, KF, AF, 46, 76, 56, LEGL(), '_f', { extra: pts => { sandal(f, AF, 46); X.leaf(f, pts, { cell: 34, s: 0.5, chips: 1, burnish: false }); }, nail: P.black });

  // ---- far arm: gilt upper arm behind the body, the forearm carried across the front under the grille
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.92), 58, 48, GS({ fill: mix('#b08a3a', '#000', 0.2) }), '_f', { lit: '#e2c272', vein: false });
  f.bone('hand_f');
  const gF = mFist(f, WF, EF, -Math.PI / 2, 30, mix('#b08a3a', '#000', 0.15), { tex: 'craq' + seed, texOp: 0.4, shadow: P.goldS, name: 'porter grille' });

  // ---- near leg, under it, square on its foot
  X.bareLegRig(f, HN, KN, AN, 48, 80, 58, GS({ maxShade: 16 }), '_n', { extra: pts => { sandal(f, AN, 48); X.leaf(f, pts, { cell: 34, s: 0.5, chips: 2, burnish: false }); X.clipDraw(f, E.smooth(pts), () => { X.softTone(f, E.smooth(pts), [[[add(KN, [-50, -40]), add(KN, [-12, -40]), add(AN, [-10, 0]), add(AN, [-40, 0])], '#120a02', 0.45, 10]]); scorch(f, add(KN, [4, 4]), 26, 22, 0.55); }); }, nail: P.black });

  // ---- torso: a black warden's tabard under a short gilded mail coat; the neck short and thick
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.5, 0.42], [0.06, 0.82, 0.72], [0.22, 0.9, 0.86], [0.42, 0.82, 0.82], [0.62, 0.74, 0.78], [0.82, 0.76, 0.76], [1.0, 0.8, 0.74]]);
  f.part(torso, CLB(f, { maxShade: 30 }));
  // ---- skirt: the tabard below the mail, to the knee, worked with the key device in gold thread, its hem scorched
  f.bone('skirt');
  { const hem = X.charHem(f, S.at(-0.72, 2.02), S.at(0.74, 1.98), 7, 18, [0, 1]); const sk = [S.at(-0.66, 1.0), S.at(0.68, 0.98), S.at(0.78, 1.5), ...hem.slice().reverse(), S.at(-0.76, 1.5)];
    f.part(sk, CLB(f, { maxShade: 18 }));
    X.clipDraw(f, E.smooth(sk), () => {
      for (let i = 0; i < 4; i++) X.fold2(f, E.smooth(sk), [S.at(-0.5 + i * 0.36, 1.2), S.at(-0.52 + i * 0.37, 1.55), S.at(-0.55 + i * 0.38, 1.98)], 10, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.25 });
      // the key device: a key worked in couched gold thread, bow up, wards down
      const kc = S.at(0.12, 1.42), kd = [0.06, 1], kn = [-1, 0.06];
      const thr = (pts, w = 3) => { f.line(pts, w + 1.6, '#1a1004', { op: 0.8 }); f.line(pts, w, '#c8a050'); f.line(pts, 0.8, '#fff0b0', { op: 0.5, dash: '2 3' }); };
      thr(ell(add(kc, mul(kd, -36)), 16, 12, 0.06, 14).concat([ell(add(kc, mul(kd, -36)), 16, 12, 0.06, 14)[0]]));
      thr([add(kc, mul(kd, -24)), add(kc, mul(kd, 40))]);
      thr([add(kc, mul(kd, 26)), add(add(kc, mul(kd, 26)), mul(kn, -18)), add(add(kc, mul(kd, 40)), mul(kn, -18)), add(kc, mul(kd, 40))]);
      thr([add(add(kc, mul(kd, 32)), mul(kn, -6)), add(add(kc, mul(kd, 32)), mul(kn, -12))], 2);
      X.stains(f, E.smooth(sk), E.bbox(sk), '#08060a', 0.04, 3, -1.6, 13, 0.7);
    });
    X.charEdge(f, hem, 5, { gap: 7 });
  }
  f.bone('torso');
  // the mail coat: to the upper thigh, short sleeves over the shoulders, its hem a little ragged
  const mail = S.shape([[-0.04, 0.6, 0.5], [0.08, 0.92, 0.8], [0.24, 0.98, 0.92], [0.44, 0.88, 0.88], [0.66, 0.8, 0.84], [0.9, 0.86, 0.86], [1.18, 0.92, 0.9]]);
  const ML = { fill: '#8e6c28', shadow: '#1a1004', light: '#d8b868', shade: 0.45, tex: 'mail' + seed, texOp: 0.75, maxShade: 34 };
  f.part(mail, ML);
  const mD = E.smooth(mail);
  X.clipDraw(f, mD, () => {
    X.softTone(f, mD, [[[S.at(-1.1, 0.0), S.at(-0.4, 0.0), S.at(-0.3, 1.3), S.at(-1.1, 1.3)], '#120a02', 0.5, 14], [ell(S.at(0.4, 0.26), H * 0.4, H * 0.25, 0.2, 14), '#fff0c0', 0.35, 12]]);
    for (let i = 0; i < 5; i++) X.crease(f, [S.at(-0.6 + i * 0.32, 0.92), S.at(-0.62 + i * 0.33, 1.05), S.at(-0.64 + i * 0.34, 1.16)], 2.2, { col: '#140a02', lit: '#e8c878', op: 0.6 }); // the mail sagging into folds under the belt
    X.formHatch(f, [S.at(-0.82, 0.1), S.at(-0.9, 0.5), S.at(-0.84, 0.9)], H * 0.2, { op: 0.45 });
    X.stains(f, mD, E.bbox(mail), '#140e16', 0.03, 3, -1.5, 41, 0.8); // scorch
    X.burn(f, S.at(-0.2, 0.02), 1.4, 120, 2.6, { depth: 3 }); // from the shoulder down the key arm's side
    // collarbone crack in the gilt skin above the mail's neck: drawn later on the neck
  });
  f.line(S.shape([[1.18, 0.92, 0.9]]).concat([]), 1, INK);
  { const hem = []; for (let i = 0; i <= 10; i++) hem.push(add(S.at(-0.92 + i * 0.182, 1.18 + (i % 2) * 0.02), [0, R(f, -2, 3)])); f.line(hem, 3, '#d8b868', { op: 0.5 }); }
  // ---- the stump of the torn near wing, on the back: a broken arm-bone of gilt, quills snapped, cracked onto void
  f.bone('stump');
  { const r0 = S.at(-0.72, 0.1), e0 = add(r0, [-40, -62]);
    for (let i = 0; i < 5; i++) { const q = lerp(r0, e0, 0.25 + i * 0.16), L = R(f, 22, 40), a = -2.6 + i * 0.1; f.stroke([q, add(q, rot([L * 0.6, 3], a)), add(q, rot([L, 0], a))], R(f, 7, 10), mix(P.plume, '#000', 0.15)); f.line([q, add(q, rot([L, 0], a))], 0.9, INK, { op: 0.6 }); }
    const st = [...limb(r0, e0, 50, 36, { steps: 6, capB: false, p: [[0.3, 0.15, 0.2]] })];
    gilt(f, st, { cell: 30 });
    const bk = [add(e0, [-6, -22]), add(e0, [-16, -6]), add(e0, [-4, 6]), add(e0, [-14, 18]), add(e0, [2, 20])]; // the torn end
    f.part([...bk, add(e0, [16, 8]), add(e0, [12, -18])], { fill: '#2a2430', shade: 0.3, inkW: 1.6, cast: false, tex: 'chisel' + seed, texOp: 0.6 });
    f.flat([add(e0, [-2, -14]), add(e0, [-8, -2]), add(e0, [0, 6]), add(e0, [-6, 14]), add(e0, [8, 10]), add(e0, [8, -10])], P.void);
    f.line([add(e0, [-2, -14]), add(e0, [-8, -2]), add(e0, [0, 6]), add(e0, [-6, 14])], 1.4, P.vio, { op: 0.8 });
    X.vcrack(f, [lerp(r0, e0, 0.3), lerp(r0, e0, 0.6), add(e0, [-2, -4])], 7, { dark: P.goldS });
    X.shards(f, add(e0, [-10, 0]), Math.PI + 0.3, 3, 0.8);
  }

  // the neck (short, thick) and the collar line: gilt skin, the crack along the collarbone onto void
  f.bone('head');
  f.part(limb(neck0, add(HC, [-18, 40]), 78, 70, { steps: 6 }), GS({ maxShade: 18 }));
  f.bone('torso');
  { const cl = [S.at(-0.3, 0.0), S.at(0.1, 0.04), S.at(0.5, -0.0)]; f.part([...cl, S.at(0.62, 0.1), S.at(-0.4, 0.12)], GS({ maxShade: 10 })); X.vcrack(f, [S.at(-0.2, 0.05), S.at(0.1, 0.07), S.at(0.4, 0.05)], 6, { dark: P.goldS }); }
  // belt over the mail: a broad strap, an iron buckle; the ring of keys, the open padlock
  const bt = [S.at(-0.82, 0.86), S.at(0.8, 0.84), S.at(0.82, 0.96), S.at(-0.84, 0.98)];
  f.part(bt, LTH(f, { sharp: true, maxShade: 6 }));
  f.part([S.at(0.36, 0.83), S.at(0.54, 0.83), S.at(0.54, 0.99), S.at(0.36, 0.99)], { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.3, sharp: true, cast: false });
  f.line([S.at(0.42, 0.86), S.at(0.42, 0.96)], 2.4, '#141216');
  f.bone('pelvis');
  // the ring of keys at the near hip, hanging plumb; the open padlock beside it
  { const ring = S.at(-0.5, 0.98); f.line(ell(add(ring, [0, 14]), 14, 16, 0, 16).concat([ell(add(ring, [0, 14]), 14, 16, 0, 16)[0]]), 5, INK); f.line(ell(add(ring, [0, 14]), 14, 16, 0, 16).concat([ell(add(ring, [0, 14]), 14, 16, 0, 16)[0]]), 3, '#9a7a34');
    for (let i = 0; i < 4; i++) { const top = add(ring, [-10 + i * 7, 28]), L = R(f, 44, 64), a = Math.PI / 2 + (i - 1.5) * 0.12, b = add(top, rot([L, 0], a)), nn = rot([0, 1], a);
      f.part(ell(top, 6, 5, a, 10), AR(f, { fill: '#8a6a24', maxShade: 2, cast: false, inkW: 1 })); f.flat(ell(top, 2.4, 2, a, 8), P.void);
      f.part(limb(add(top, rot([5, 0], a)), b, 4, 4, { steps: 3 }), { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1, cast: false });
      f.part([b, add(b, mul(nn, 9)), add(add(b, mul(nn, 9)), rot([-10, 0], a)), add(b, rot([-10, 0], a))].map(q => [...q, 1]), { fill: '#6a5a3a', shade: 0.4, inkW: 1, cast: false }); }
    const pl = S.at(-0.05, 1.04); // the padlock, hung open on its hasp
    f.line([add(pl, [-10, 0]), add(pl, [-12, -16]), add(pl, [-2, -24]), add(pl, [8, -18])], 5, INK); f.line([add(pl, [-10, 0]), add(pl, [-12, -16]), add(pl, [-2, -24]), add(pl, [8, -18])], 3, P.ironL);
    const lk = [add(pl, [-18, 0]), add(pl, [14, -2]), add(pl, [16, 30]), add(pl, [0, 36]), add(pl, [-18, 30])];
    f.part(lk, AR(f, { fill: '#8a6a24', maxShade: 8 })); X.leaf(f, lk, { cell: 16, s: 0.4, chips: 1, burnish: false });
    f.flat([add(pl, [-3, 10]), add(pl, [3, 10]), add(pl, [2, 22]), add(pl, [-2, 22])], P.void); f.flat(ell(add(pl, [0, 10]), 4, 4, 0, 8), P.void);
  }

  // ---- the gate grille strapped to the far forearm, carried across the front, turned toward the party: a section of
  // gilded bars with scrollwork and a broken top rail, foreshortened in its plane
  f.bone('shield');
  { const O = add(lerp(EF, WF, 0.5), [-58, -118]), U = [0.62, 0.16], V = [0.05, 1];
    onPlane(f, O, U, V, () => {
      const w = 170, h = 250, bar = (x0, y0, x1, y1, bw, shade = 0) => { const sh = limb([x0, y0], [x1, y1], bw, bw, { steps: 6, capK: 0.3 }); f.part(sh, AR(f, { fill: mix('#a07c30', '#000', shade), maxShade: bw * 0.5, cast: false, inkW: 1.6, inkHeavy: 2.4 })); f.line([[x0 - bw * 0.2, y0], [x1 - bw * 0.2, y1]], 1.6, '#f6dc90', { op: 0.6 }); return sh; };
      // the rails behind, then the bars (spear-tipped, one bent, one snapped)
      bar(-6, 30, w + 6, 26, 16, 0.15); bar(-6, h - 30, w + 6, h - 26, 16, 0.15);
      for (let i = 0; i < 5; i++) { const x = 10 + i * 37, top = i === 3 ? 60 : -10 - (i % 2) * 12, bend = i === 1 ? 10 : 0; const sh = bar(x, h + 6, x + bend, top, 13); if (i !== 3) f.part([[x + bend - 11, top + 6], [x + bend, top - 20, 1], [x + bend + 11, top + 6], [x + bend, top + 12]], AR(f, { maxShade: 3, cast: false, inkW: 1.4 })); else { f.flat(ell([x, top], 7, 3, 0, 8), P.void); f.line([[x - 6, top - 1], [x + 6, top + 1]], 1.4, P.goldW, { op: 0.7 }); } if (i === 2) X.burn(f, [x, h * 0.4], -1.4, 120, 2.2, { depth: 2, halo: false, clip: sh }); }
      // scrollwork between the rails: C-scrolls of flat bar
      for (let i = 0; i < 4; i++) { const cx = 28 + i * 37, cy = h * 0.52, sc = []; for (let k = 0; k <= 14; k++) { const t = k / 14 * 5.2, r = 15 - t * 2.2; sc.push([cx + Math.cos(t + i) * r, cy + Math.sin(t + i) * r * 1.4]); } f.line(sc, 6.4, INK); f.line(sc, 4.2, '#b28e3c'); f.line(sc.slice(2, 8), 1.2, '#f6dc90', { op: 0.6 }); }
      // the leaf plates and black showing on the bars; scorch; the lion-head boss where the arm is strapped
      X.stains(f, `M-20,-40 H${w + 20} V${h + 20} H-20 Z`, [-20, -40, w + 20, h + 20], '#140e16', 0.04, 3, -1.7, 23, 0.6);
      for (const y of [h * 0.3, h * 0.66]) { f.part([[w * 0.3, y - 9], [w * 0.7, y - 10], [w * 0.7, y + 9], [w * 0.3, y + 10]], LTH(f, { maxShade: 4, cast: false, sharp: true })); f.part([[w * 0.5 - 9, y - 12], [w * 0.5 + 9, y - 12], [w * 0.5 + 9, y + 12], [w * 0.5 - 9, y + 12]], { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.2, sharp: true, cast: false }); }
    });
  }
  // the fist on the grille's bar behind it shows between the bars: redraw its knuckles over the near rail
  f.bone('hand_f'); X.fistDetail(f, gF, 30, mix('#b08a3a', '#000', 0.15), { nail: P.goldS, wrinkle: false });

  // ---- head: square and heavy, cracked along the jaw onto void, the third eye in a crack on the brow, the mouth set
  f.bone('head');
  const hd = angelHead(f, HC, H, hA, { gold: true, head: { jaw: 1.3, chin: 0.03, nose: 0.92, hook: 0.05, mouth: 'set', squint: 0.5, browDown: 0.05, browW: 0.06, hairCol: '#2a2018',
    hair: [[-0.42, 0.06], [-0.48, -0.22], [-0.34, -0.48], [-0.06, -0.56], [0.2, -0.52], [0.3, -0.42], [0.08, -0.44], [-0.12, -0.38], [-0.26, -0.16], [-0.3, 0.06]] },
    inFace: F => {
      X.vcrack(f, F([[-0.22, 0.26], [-0.08, 0.44], [0.12, 0.52], [0.3, 0.46]]), 6, { dark: P.goldS }); // along the jaw
      X.crackV(f, F([[0.0, 0.46]])[0], hA + 1.9, 26, 3, { depth: 1, dark: P.goldS });
      X.burn(f, F([[-0.26, 0.2]])[0], hA + 0.6, 40, 1.4, { depth: 2, haloOp: 0.2, wander: 0.6 });
      // the brow crack, opened into a third eye
      const ec = F([[0.17, -0.3]])[0];
      X.vcrack(f, F([[0.14, -0.48], [0.18, -0.38], [0.17, -0.22], [0.2, -0.16]]), 10, { dark: P.goldS });
      f.flat(ell(ec, H * 0.13, H * 0.075, hA + Math.PI / 2, 14), P.void); X.eye(f, ec, H * 0.11, hA + Math.PI / 2 + 0.05, { lid: X.GL(f, { fill: '#8a6a26' }), open: 0.7, gaze: [0.1, -0.7], iris: P.vio, mass: false, inkW: 1 });
    } });
  // cropped hair, the strike standing it up off the crown
  { const roots = []; for (let i = 0; i < 9; i++) { const t = i / 8, q = hd([[-0.38 + t * 0.52, -0.2 - Math.sin(t * Math.PI) * 0.34 - t * 0.04]])[0]; roots.push([q, -2.4 + t * 1.3 + R(f, -0.1, 0.1)]); } X.standingHair(f, roots, 18, { pal: ['#0e0c10', '#2a2018', '#4a4038', '#2a2430'], w: 6, gap: false }); }

  // ---- near arm, up to the key: the burns branch down it from the shoulder
  f.bone('key');
  const bow = add(WN, mul(kD, -64)), sh0 = add(WN, mul(kD, -34)), sh1 = add(WN, mul(kD, 292));
  { const IRN = (o = {}) => X.GL(f, Object.assign({ fill: '#9a7a30', maxShade: 10 }, o));
    // the bit: a plate off the shank's end, cut through with intricate wards
    const KF = frame(sh1, kA, 1), bit = KF([[-78, 6], [-6, 6], [-2, 70], [-20, 74], [-24, 58], [-38, 58], [-40, 76], [-62, 76], [-64, 58], [-80, 54]].map((q, i) => [q[0], q[1], i > 1 ? 1 : 0]));
    X.cutHoles(f, [[KF([[-50, 30]])[0], 7], [KF([[-24, 34]])[0], 5]], () => { f.part(bit, IRN()); X.leaf(f, bit, { cell: 26, s: 0.5, chips: 2, burnish: false }); }, { shape: bit, rimW: 1 });
    for (const [a, b] of [[[-70, 18], [-70, 46]], [[-56, 40], [-30, 40]], [[-14, 14], [-14, 50]]]) f.line(KF([a, b]), 4, P.void); // the wards cut in
    const shank = limb(sh0, sh1, 22, 20, { steps: 10 }); f.part(shank, IRN());
    X.leaf(f, shank, { cell: 30, s: 0.5, chips: 2, burnish: false });
    X.softTone(f, E.smooth(shank), [[[lp(sh0, sh1, 0, -11), lp(sh0, sh1, 1, -10), lp(sh0, sh1, 1, -3), lp(sh0, sh1, 0, -3)], '#120a02', 0.5, 3], [[lp(sh0, sh1, 0, 4), lp(sh0, sh1, 1, 4), lp(sh0, sh1, 1, 8), lp(sh0, sh1, 0, 8)], '#fff2c4', 0.5, 2]]);
    for (const t of [0.12, 0.4, 0.9]) f.part([lp(sh0, sh1, t, -14), lp(sh0, sh1, t + 0.03, -14), lp(sh0, sh1, t + 0.03, 14), lp(sh0, sh1, t, 14)].map(q => [...q, 1]), IRN({ fill: '#7a5e22', maxShade: 2, cast: false })); // collars
    X.burn(f, lp(sh0, sh1, 0.2, 0), kA, 240, 2.2, { depth: 2, halo: false, wander: 0.4, clip: shank });
    // the bow: an oval ring with a quatrefoil cut in it
    const bo = ell(bow, 38, 30, kA, 22), bi = ell(bow, 22, 15, kA, 18);
    f.part(E.smooth(bo) + ' ' + E.smooth(bi.slice().reverse()), Object.assign(IRN(), { bbPts: bo }));
    X.clipDraw(f, E.smooth(bo) + ' ' + E.smooth(bi.slice().reverse()), () => { X.leaf(f, bo, { cell: 22, s: 0.45, chips: 1, burnish: false }); X.dent(f, add(bow, rot([-20, -14], kA)), 6, kA); });
    f.line(ell(bow, 30, 22, kA, 18).slice(9, 16), 1.4, '#f6dc90', { op: 0.6 });
  }
  // the chain from the bow down to the belt (hangs in a sag)
  f.bone('torso'); X.ironChain(f, [add(bow, [-4, 30]), add(bow, [-20, 90]), S.at(0.1, 0.8), S.at(-0.1, 0.88)], 13, 3.4, '#8a6a24');
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 62, 52, GS({}), '_n', { lit: '#e8c878', vein: false });
  f.bone('upperarm_n'); X.burn(f, lp(SN, EN, 0.05, -6), ang(SN, EN) + 0.15, 110, 2.8, { depth: 3, clip: ell(lerp(SN, EN, 0.5), E.len(sub(EN, SN)) * 0.56, 28, ang(SN, EN), 18) });
  // the mail sleeve's edge over the shoulder (torso: shoulder armour belongs to the torso)
  f.bone('torso'); { const a0 = lp(SN, EN, -0.08, 0), a1 = lp(SN, EN, 0.38, 0), sl = K.ragLimb(f, a0, a1, 78, 70, { teeth: 6, depth: 7, p: [[0.2, 0.12, 0.25]] }); f.part(sl, ML); X.clipDraw(f, E.smooth(sl), () => X.softTone(f, E.smooth(sl), [[[lp(a0, a1, 0, -40), lp(a0, a1, 1.1, -36), lp(a0, a1, 1.1, -12), lp(a0, a1, 0, -14)], '#120a02', 0.5, 6]])); f.line([lp(a0, a1, 0.95, 34), lp(a0, a1, 0.98, -32)], 2.2, '#d8b868', { op: 0.5 }); }
  f.bone('forearm_n'); X.burn(f, lp(EN, WN, 0.1, 4), ang(EN, WN), 70, 2.2, { depth: 2, clip: ell(lerp(EN, WN, 0.45), E.len(sub(WN, EN)) * 0.5, 22, ang(EN, WN), 16) });
  f.bone('hand_n');
  mFist(f, WN, EN, kA, 32, '#b08a3a', { tex: 'craq' + seed, texOp: 0.4, shadow: P.goldS, name: 'porter key' });
  f.bone('root');
  f.flat(ell([380, gy + 2], 200, 9, 0, 18), '#000', { op: 0.3 });
  X.leafDrift(f, [380, 640], 220, 120, 7);
  return X.toneGold(f);
}

// ------------------------------------------------------------------ HERALD OF HEAVEN (cast, human 1.05)
// It was sent to sound the end of the world. It is still sounding it. A slim herald angel leaning back on its back foot,
// chest lifted, the long straight trumpet raised to its lips and levelled forward, held up mid-shaft by the near hand
// from below; the square banner of the Mother's sign hangs from the shaft, scorched at its edges. The strike fused the
// mouthpiece to its lips mid-note (a weld of gold over the mouth); violet burns branch from there down the throat and
// chest. A void crack runs across the ribs, open at the tabard's side under the raised arm. Wings half raised, each at
// its own spread, tips scorched black. A black herald's tabard edged in gold leaf, a baldric with a satchel of sealed
// proclamations (the far hand on it), a tasselled cord wound round the trumpet, bare feet, a cracked halo.
// Rig: standard humanoid + trumpet (hand_n) + banner (trumpet) + skirt (pelvis) + satchel (pelvis) + halo (head) +
// wing_n_1..3, wing_f_1..3 (torso). Motion: idle a long held note (banner stirring); attack a blast (torso back, trumpet
// up a little, banner flung).
function herald() {
  const CW = 1000, CH = TIERS.human[1], seed = 1525;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 105, gy = f.o.groundY;
  const N = [424, 252], C = [436, 360], Pv = [462, 462];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.22, 0.1), SF = S.at(0.36, 0.08);
  const HC = [462, 178], hA = -0.12, neck0 = S.at(0.1, -0.04);
  const mouth = add(HC, rot([0.3 * H, 0.28 * H], hA));
  const tA = -0.05, tD = dir(tA), tN = [-tD[1], tD[0]], T0 = add(mouth, mul(tD, 2)), T1 = add(T0, mul(tD, 470));
  const tAt = (t, o = 0) => add(lerp(T0, T1, t), mul(tN, o));
  const WN = tAt(0.36), EN = [560, 330];
  const EF = [500, 372], WF = [530, 436];
  const HN = S.at(-0.18, 1.0), KN = [444, 616], AN = [410, 754];
  const HF = S.at(0.26, 1.0), KF = [548, 606], AF = [604, 750];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('trumpet', WN, 'hand_n').joint('banner', tAt(0.52), 'trumpet').joint('skirt', S.at(0, 0.84), 'pelvis').joint('satchel', S.at(0.3, 0.86), 'pelvis').joint('halo', add(HC, [-30, -34]), 'head');
  const Wn = { S: S.at(-0.56, 0.1), E: [300, 170], W: [220, 120], T: [70, 196], tr: 1 };   // near wing half raised, thrown back
  const Wf = { S: S.at(-0.3, 0.02), E: [356, 120], W: [326, 66], T: [236, 50], tr: -1 };   // far wing raised higher, half closed
  for (const [k, w] of [['n', Wn], ['f', Wf]]) f.joint(`wing_${k}_1`, w.S, 'torso').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  const SKG = (o = {}) => SKA(f, o);
  const GS = (o = {}) => X.GILT(f, o);

  // ---- the far wing, raised and half closed behind the head; then the halo
  X.wing(f, Wf.S, Wf.E, Wf.W, Wf.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: Wf.tr, Lp: 150, Ls: 96, Wp: 17, Ws: 18, np: 8, ns: 9, nt: 3, look: X.FE(f, { fill: mix(P.plume, '#000', 0.25) }), skin: SKG({ fill: mix('#d0c2a6', '#000', 0.3) }), lift: true, notchP: [3], notchS: [2, 6], rake: -0.3, wS: 28, wE: 20, wW: 15, darkTips: 0.55, spreadP: 0.2, pLen: t => 0.82 + 0.24 * Math.sin(t * 3.4), sLen: t => 0.86 + 0.14 * Math.sin(t * 7) });
  f.bone('halo');
  X.crackedHalo(f, add(HC, [-28, -36]), 62, 44, -0.4, 11, [0.16, 0.5, 0.78], { drift: 9, lost: 0.3 });
  // ---- the far arm, down at its side, the hand laid on the satchel of proclamations
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 40, 32, SKG({ fill: mix('#d0c2a6', '#000', 0.2) }), '_f', { vein: false });
  // ---- far leg, forward, bare
  X.bareLegRig(f, HF, KF, AF, 40, 56, 40, SKG({ fill: mix('#d0c2a6', '#000', 0.2), maxShade: 12 }), '_f', { nail: P.boneS });
  // ---- near leg, back, the weight on it (straighter)
  X.bareLegRig(f, HN, KN, AN, 42, 60, 42, SKG({ maxShade: 14 }), '_n', { extra: pts => X.clipDraw(f, E.smooth(pts), () => { X.burn(f, lerp(KN, AN, 0.3), 1.9, 60, 1.6, { depth: 2, haloOp: 0.25 }); scorch(f, add(AN, [10, 20]), 30, 16, 0.4); }), nail: P.boneS });
  // ---- torso: a black undertunic (to the knee), the ribs bare at the tabard's open side under the raised arm
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.36], [0.06, 0.58, 0.58], [0.2, 0.62, 0.7], [0.4, 0.56, 0.6], [0.6, 0.46, 0.5], [0.8, 0.52, 0.5], [1.0, 0.58, 0.54]]);
  f.part(torso, SKG({ maxShade: 22 }));
  X.clipDraw(f, E.smooth(torso), () => {
    for (let i = 0; i < 4; i++) X.crease(f, [S.at(-0.3, 0.3 + i * 0.07), S.at(-0.05, 0.33 + i * 0.075), S.at(0.15, 0.32 + i * 0.075)], 1.8, { col: '#2a2030', lit: '#f0e6d2', op: 0.55 }); // the ribs, stretched as it leans back
    X.vcrack(f, [S.at(-0.45, 0.28), S.at(-0.2, 0.34), S.at(0.05, 0.36), S.at(0.25, 0.42)], 9, { dark: '#2a2030', lip: '#f0e6d2' });
    X.crackV(f, S.at(-0.1, 0.35), 2.0, 34, 4, { depth: 1, dark: '#2a2030', lip: '#f0e6d2' });
  });
  // the undertunic skirt (skirt bone), to the knee, its hem scorched; then the tabard over it
  f.bone('skirt');
  { const hem = X.charHem(f, S.at(-0.62, 1.86), S.at(0.7, 1.8), 7, 14, [0, 1]); const sk = [S.at(-0.5, 0.82), S.at(0.54, 0.8), S.at(0.68, 1.3), ...hem.slice().reverse(), S.at(-0.66, 1.3)];
    f.part(sk, X.GR(f, { fill: '#4a4650', maxShade: 16, tex: 'weave' + seed, texOp: 0.4 }));
    X.clipDraw(f, E.smooth(sk), () => { for (let i = 0; i < 4; i++) X.fold2(f, E.smooth(sk), [S.at(-0.4 + i * 0.3, 1.0), S.at(-0.42 + i * 0.32, 1.4), S.at(-0.46 + i * 0.34, 1.8)], 9, { dark: '#000', light: '#9a96a0', lit: '#8a8690', col: '#141218', lightOp: 0.25 }); });
    X.charEdge(f, hem, 4, { gap: 8 });
    // the tabard's front panel, over the undertunic: black, a border of gold leaf, the Mother's sign (a ring of six rays)
    const tb = [S.at(0.0, 0.1), S.at(0.62, 0.12), S.at(0.6, 0.6), S.at(0.6, 1.1), S.at(0.72, 1.5), S.at(0.5, 1.52), S.at(0.2, 1.5), S.at(0.0, 1.46), S.at(-0.04, 1.0), S.at(-0.06, 0.5)];
    f.part(tb, CLB(f, { maxShade: 16 }));
    X.clipDraw(f, E.smooth(tb), () => {
      X.fold2(f, E.smooth(tb), [S.at(0.3, 0.86), S.at(0.34, 1.16), S.at(0.38, 1.5)], 8, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 });
      X.stains(f, E.smooth(tb), E.bbox(tb), '#08060a', 0.04, 3, -1.6, 17, 0.7);
      const sc = S.at(0.32, 1.12); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 - Math.PI / 2; f.line([add(sc, rot([12, 0], a)), add(sc, rot([26, 0], a))], 3.4, '#1a1004'); f.line([add(sc, rot([12, 0], a)), add(sc, rot([26, 0], a))], 2, '#c8a050'); }
      f.line(ell(sc, 10, 10, 0, 14).concat([ell(sc, 10, 10, 0, 14)[0]]), 3.4, '#1a1004'); f.line(ell(sc, 10, 10, 0, 14).concat([ell(sc, 10, 10, 0, 14)[0]]), 2, '#c8a050');
    });
    const edge = [S.at(0.0, 0.1), S.at(-0.06, 0.5), S.at(-0.04, 1.0), S.at(0.0, 1.46), S.at(0.2, 1.5), S.at(0.5, 1.52), S.at(0.72, 1.5)];
    f.line(edge, 7, INK); f.line(edge, 5, P.gold); f.line(edge.map(q => add(q, [-1, -1])), 1.4, P.goldL, { op: 0.7 }); for (let i = 1; i < edge.length - 1; i++) f.line([lerp(edge[i], edge[i + 1], 0.3), lerp(edge[i], edge[i + 1], 0.36)], 2.4, P.blackD, { op: 0.8 }); // the gilt edge, cracked
  }
  // the tabard's top on the torso: over the chest and the far shoulder, a short hanging sleeve
  f.bone('torso');
  { const tt = [S.at(-0.1, -0.02), S.at(0.3, -0.04), S.at(0.6, 0.06), S.at(0.62, 0.84), S.at(0.0, 0.84), S.at(-0.04, 0.4)]; f.part(tt, CLB(f, { maxShade: 18 }));
    X.clipDraw(f, E.smooth(tt), () => { X.fold2(f, E.smooth(tt), [S.at(0.1, 0.1), S.at(0.24, 0.4), S.at(0.3, 0.8)], 8, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 }); X.burn(f, S.at(0.4, 0.0), 1.7, 120, 2.4, { depth: 3, scorch: '#0a0610' }); });
    f.line([S.at(-0.1, -0.02), S.at(-0.04, 0.4), S.at(0.0, 0.84)], 6, INK); f.line([S.at(-0.1, -0.02), S.at(-0.04, 0.4), S.at(0.0, 0.84)], 4, P.gold);
    // a belt of cord
    X.rope(f, [S.at(-0.52, 0.84), S.at(0.1, 0.88), S.at(0.62, 0.84)], 5, '#4a4038'); }
  // ---- the baldric over the near shoulder to the satchel at the far hip; sealed proclamations in it
  X.rope(f, [S.at(-0.3, 0.0), S.at(0.1, 0.3), S.at(0.5, 0.74)], 8, '#2a2428', { lit: false });
  f.bone('satchel');
  { const sc = S.at(0.6, 0.98), bag = [add(sc, [-34, -30]), add(sc, [34, -34]), add(sc, [40, 30]), add(sc, [0, 40]), add(sc, [-36, 30])];
    for (let i = 0; i < 4; i++) { const r0 = add(sc, [-24 + i * 14, -28]), r1 = add(r0, [R(f, -4, 4), -R(f, 22, 38)]); f.part(limb(r0, r1, 11, 11, { steps: 4, capK: 0.4 }), X.BN(f, { fill: '#cec6b2', maxShade: 4, cast: false, inkW: 1 })); f.line([lp(r0, r1, 0.9, -5), lp(r0, r1, 0.9, 5)], 1, INK, { op: 0.6 }); if (i % 2 === 0) { f.part(ell(add(r1, [0, 6]), 6, 5, 0, 10), X.BK(f, { fill: '#2a2230', maxShade: 2, cast: false })); f.flat(ell(add(r1, [-1, 5]), 2.4, 2, 0, 8), P.gold); } }
    f.part(bag, LTH(f, { maxShade: 14 })); f.part([add(sc, [-34, -30]), add(sc, [34, -34]), add(sc, [32, -2]), add(sc, [-30, 2])], LTH(f, { fill: '#352e32', maxShade: 6 }));
    f.stitches([add(sc, [-30, 0]), add(sc, [30, -4])], '#6a5a5a'); f.flat(ell(add(sc, [0, -4]), 6, 5, 0, 8), P.gold); X.charEdge(f, [add(sc, [-36, 30]), add(sc, [0, 40])], 4, { gap: 20 });
  }
  f.bone('hand_f');
  X.openHand(f, WF, ang(EF, WF) - 0.6, 66, { look: SKG({ fill: mix('#d0c2a6', '#000', 0.12), maxShade: 6 }), back: true, flip: true, spread: 0.12, curl: 0.35, nail: '#8a8070' });

  // ---- head: a young, ageless face tipped back a little, eyes closed, the cheeks set hard round the mouthpiece; hair
  // standing from the strike
  f.bone('head');
  f.part(limb(neck0, add(HC, [-10, 40]), 46, 40), SKG());
  X.clipDraw(f, E.smooth(limb(neck0, add(HC, [-10, 40]), 46, 40)), () => X.burn(f, add(HC, [10, 58]), 1.8, 70, 2, { depth: 2, haloOp: 0.3 })); // down the throat
  const hd = angelHead(f, HC, H, hA, { head: { jaw: 0.95, chin: 0.0, nose: 0.95, mouth: 'set', squint: 0.9, blind: true, browDown: -0.02, browW: 0.04, hairCol: '#1e1a20' },
    inFace: F => {
      f.line(F([[0.06, -0.06], [0.11, -0.05], [0.17, -0.06]]), 1.6, INK); f.line(F([[0.272, -0.065], [0.3, -0.058]]), 1.4, INK); // closed lids
      f.line(F([[0.07, -0.035], [0.12, -0.028], [0.16, -0.036]]), 1, '#6a5a66', { op: 0.7 });
      X.softTone(f, E.smooth(F(X.FACE)), [[F(ell([0.18, 0.2], 0.1, 0.08, 0, 12)), '#f4ecdc', 0.5, 4], [F([[0.08, 0.24], [0.2, 0.32], [0.14, 0.38], [0.04, 0.3]]), '#2a2030', 0.35, 3]]); // the puffed cheek, lit, with its shadow under
      X.crease(f, F([[0.2, 0.14], [0.17, 0.24], [0.2, 0.33]]), 1.6, { col: '#2a2030', lit: '#f4ecdc' });
      X.burn(f, F([[0.26, 0.3]])[0], hA + 1.9, 46, 1.4, { depth: 2, haloOp: 0.25 });
    } });
  { const roots = []; for (let i = 0; i < 12; i++) { const t = i / 11, q = hd([[-0.42 + t * 0.6, -0.14 - Math.sin(t * Math.PI) * 0.4 - t * 0.04]])[0]; roots.push([q, -2.6 + t * 1.6 + R(f, -0.12, 0.12)]); } X.standingHair(f, roots, 36, { pal: ['#0e0c10', '#2a2430', '#5a5060', '#3a3440'], w: 5, gap: false }); }

  // ---- the near wing, half raised and thrown back (its own spread), behind the near arm
  X.wing(f, Wn.S, Wn.E, Wn.W, Wn.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: Wn.tr, Lp: 170, Ls: 104, Wp: 19, Ws: 20, np: 9, ns: 10, nt: 3, look: X.FE(f), skin: SKG(), lift: true, notchP: [2, 6], notchS: [1, 5, 8], rake: 0.28, wS: 32, wE: 22, wW: 17, darkTips: 0.55, spreadP: 0.42, pLen: t => 0.74 + 0.36 * Math.sin(t * 2.6), sLen: t => 0.84 + 0.16 * Math.sin(t * 5 + 2) });
  f.bone('wing_n_3'); X.burn(f, lerp(Wn.W, Wn.T, 0.3), ang(Wn.W, Wn.T) + 0.3, 70, 1.6, { depth: 2, clip: ell(lerp(Wn.W, Wn.T, 0.5), 90, 26, ang(Wn.W, Wn.T), 14) });

  // ---- the trumpet: mouthpiece fused to the lips, a long straight gilt tube with knops and a tasselled cord wound on it,
  // the bell flaring and split; the banner hanging from it
  f.bone('trumpet');
  const tube = limb(T0, tAt(0.86), 13, 15, { steps: 16 }), bellC = T1;
  f.part(tube, GS({ maxShade: 5 }));
  X.leaf(f, tube, { cell: 30, s: 0.45, chips: 2, burnish: false });
  X.softTone(f, E.smooth(tube), [[[tAt(0, 3), tAt(0.9, 3), tAt(0.9, 9), tAt(0, 9)], '#120a02', 0.55, 2], [[tAt(0, -2), tAt(0.9, -2), tAt(0.9, -6), tAt(0, -6)], '#fff2c4', 0.6, 1.5]]);
  X.burn(f, tAt(0.04, 0), tA, 190, 1.6, { depth: 2, halo: false, wander: 0.35, clip: tube });
  for (const t of [0.08, 0.3, 0.62]) { const k = [tAt(t - 0.012, -13), tAt(t + 0.012, -13), tAt(t + 0.02, 0), tAt(t + 0.012, 13), tAt(t - 0.012, 13), tAt(t - 0.02, 0)]; f.part(k, GS({ maxShade: 4, cast: false })); f.line([tAt(t - 0.005, -11), tAt(t - 0.005, 11)], 1.4, P.goldW, { op: 0.6 }); }
  // the bell: flaring, seen a little from the side; the split down its lip, black inside
  const bell = [tAt(0.84, -8), add(bellC, mul(tN, -46)), add(add(bellC, mul(tN, -50)), mul(tD, 10)), add(add(bellC, mul(tN, 50)), mul(tD, 10)), add(bellC, mul(tN, 46)), tAt(0.84, 8)];
  f.part(bell, GS({ maxShade: 12 }));
  X.leaf(f, bell, { cell: 30, s: 0.5, chips: 2, burnish: false });
  f.part(ell(add(bellC, mul(tD, 8)), 16, 50, tA, 22), X.BK(f, { fill: '#1a141c', maxShade: 10, cast: false }));
  f.flat(ell(add(bellC, mul(tD, 10)), 10, 38, tA, 18), P.void);
  f.line(ell(add(bellC, mul(tD, 8)), 16, 50, tA, 22).slice(14, 22), 2.4, P.goldL, { op: 0.7 });
  X.vcrack(f, [add(add(bellC, mul(tN, -48)), mul(tD, 8)), add(add(bellC, mul(tN, -30)), mul(tD, -14)), add(add(bellC, mul(tN, -16)), mul(tD, -40))], 7, { dark: P.goldS });
  // the tasselled cord wound round the shaft near the hand, its tassels hanging plumb
  for (let i = 0; i < 6; i++) { const t = 0.42 + i * 0.022; f.line([tAt(t, -14), tAt(t + 0.012, 14)], 3.6, INK, { op: 0.85 }); f.line([tAt(t, -13), tAt(t + 0.012, 13)], 2.2, '#4a3a2a'); }
  { const k0 = tAt(0.54, 12); X.rope(f, [k0, add(k0, [6, 30]), add(k0, [2, 58])], 3.4, '#4a3a2a', { fray: true }); X.rope(f, [k0, add(k0, [-8, 26]), add(k0, [-10, 48])], 3.4, '#4a3a2a', { fray: true }); f.part(ell(add(k0, [4, 64]), 7, 12, 0, 10), X.GL(f, { maxShade: 3, cast: false })); }
  // the mouthpiece fused to the lips: a weld of melted gold over the mouth, a run off it
  f.bone('head');
  weld(f, [add(mouth, rot([-14, 0], hA)), add(mouth, rot([0, 2], hA)), add(mouth, rot([16, 0], hA))], 6, AR(f), { runs: 1 });
  // ---- the banner: square, hanging from rings on the shaft, worked in gold thread with the Mother's sign, its edges
  // burnt into curled tongues, a hole burnt through, stirring a little
  f.bone('banner');
  { const b0 = tAt(0.5, 12), b1 = tAt(0.8, 12), hgt = 200;
    const hem = X.charHem(f, add(b1, [10, hgt + 6]), add(b0, [-4, hgt]), 6, 22, [0, 1]);
    const bn = [b0, lerp(b0, b1, 0.5), b1, add(b1, [14, hgt * 0.5]), ...hem, add(b0, [-8, hgt * 0.55])];
    f.part(bn, CLB(f, { fill: '#2a242c', maxShade: 16 }));
    X.clipDraw(f, E.smooth(bn), () => {
      X.fold2(f, E.smooth(bn), [lerp(b0, b1, 0.3), add(lerp(b0, b1, 0.32), [-6, 100]), add(lerp(b0, b1, 0.28), [-4, 200])], 12, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 });
      X.fold2(f, E.smooth(bn), [lerp(b0, b1, 0.72), add(lerp(b0, b1, 0.74), [4, 110]), add(lerp(b0, b1, 0.76), [10, 210])], 10, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 });
      const sc = add(lerp(b0, b1, 0.5), [2, 96]);
      const thr = (pts, w = 3.4) => { f.line(pts, w + 1.8, '#1a1004', { op: 0.8 }); f.line(pts, w, '#c8a050'); f.line(pts, 0.8, '#fff0b0', { op: 0.5, dash: '2 3' }); };
      for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 - Math.PI / 2, L = k % 2 ? 46 : 58; thr([add(sc, rot([22, 0], a)), add(sc, rot([L, 0], a))]); thr(ell(add(sc, rot([L + 6, 0], a)), 5, 5, 0, 10).concat([ell(add(sc, rot([L + 6, 0], a)), 5, 5, 0, 10)[0]]), 2); thr([add(sc, rot([28, 0], a + 0.5)), add(sc, rot([36, 0], a + 0.5))], 1.6); } // six rays, one per course, each ending in a bead
      thr(ell(sc, 18, 18, 0, 16).concat([ell(sc, 18, 18, 0, 16)[0]]));
      thr([add(b0, [12, 18]), add(b1, [-4, 18])], 2.4); // a border in gold thread
      X.burn(f, add(b1, [-10, 40]), 2.0, 110, 2, { depth: 2, halo: true });
      X.burnHole(f, add(lerp(b0, b1, 0.25), [0, 150]), 11, 0.4);
      X.stains(f, E.smooth(bn), E.bbox(bn), '#08060a', 0.04, 3, -1.6, 19, 0.8);
    });
    X.charEdge(f, hem, 5, { gap: 7 });
    for (const t of [0.04, 0.5, 0.96]) { const q = lerp(b0, b1, t); f.line(ell(add(q, [0, -6]), 8, 10, 0, 12).concat([ell(add(q, [0, -6]), 8, 10, 0, 12)[0]]), 4, INK); f.line(ell(add(q, [0, -6]), 8, 10, 0, 12).concat([ell(add(q, [0, -6]), 8, 10, 0, 12)[0]]), 2.4, P.goldM); } // rings round the shaft
  }
  // ---- the near arm, raised under the shaft: the hand holds it from below
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 44, 36, SKG(), '_n', { vein: false });
  f.bone('forearm_n'); X.burn(f, lp(EN, WN, 0.15, 4), ang(EN, WN), 70, 1.6, { depth: 2, clip: ell(lerp(EN, WN, 0.45), E.len(sub(WN, EN)) * 0.5, 18, ang(EN, WN), 16) });
  f.bone('torso'); { const a0 = lp(SN, EN, -0.1, 0), a1 = lp(SN, EN, 0.32, 0), sl = K.ragLimb(f, a0, a1, 60, 56, { teeth: 5, depth: 8 }); f.part(sl, CLB(f, { maxShade: 10 })); f.line([lp(a0, a1, 0.92, 26), lp(a0, a1, 0.96, -26)], 3, P.gold, { op: 0.8 }); }
  f.bone('hand_n');
  mFist(f, WN, EN, 0, 26, '#d0c2a6', { shadow: '#3e3238', tex: 'mottle' + seed, texOp: 0.4, maxBend: 40, name: 'herald trumpet' });
  f.bone('root');
  f.flat(ell([500, gy + 2], 200, 9, 0, 18), '#000', { op: 0.3 });
  X.leafDrift(f, [700, 520], 200, 140, 7);
  return X.toneGold(f);
}

// ------------------------------------------------------------------ STAR-LIGHTER (cast, human 1.0)
// It lit the stars every evening. Most of them have gone out. It is doing its best. A slight lamplighter angel, a little
// stooped, holding its lighting pole upright in front of it with both hands (taller than itself, planted beside the
// forward foot, the weight on that leg); at the pole's hooked tip an iron cage hangs on a ring, and in the cage a dead star,
// a black cinder crazed with violet. The tired, gentle face tipped back, looking up at the cage, cracked across one cheek.
// Its wings are bound flat to its back with turns of cord to keep them from the flame. Violet burns branch up the pole
// arm; a void crack runs from the collarbone to the hip (open above the apron's bib and again at the hip beside it).
// A black leather apron edged in cracked gold leaf over a grey working tunic, scorched sleeves rolled to the elbow, a bag
// of wicks, trimming shears and a tinderbox at the belt, a cracked halo.
// Rig: standard humanoid + pole (hand_n) + cage (pole: it swings on its ring) + skirt (pelvis) + apron (pelvis) + wings
// (torso, bound) + halo (head). Motion: idle reaching up to relight the cage (upperarm_f up, head back); attack swinging
// the cage down onto a hero (pole and cage over, torso forward).
function starLighter() {
  const CW = 640, CH = 1000, seed = 1530;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 100, gy = f.o.groundY;
  const N = [366, 404], C = [346, 500], Pv = [352, 604];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.24, 0.1), SF = S.at(0.36, 0.08);
  const pB = [480, gy - 2], pT = [468, 128], pA = ang(pB, pT);
  const onP = y => lerp(pB, pT, (pB[1] - y) / (pB[1] - pT[1]));
  const WN = onP(512), EN = [368, 556];
  const WF = onP(430), EF = [400, 478];
  const HN = S.at(-0.2, 1.0), KN = [352, 782], AN = [326, 920];
  const HF = S.at(0.26, 1.0), KF = [430, 776], AF = [440, 916];
  const HC = [402, 344], hA = -0.78, neck0 = S.at(0.16, -0.05);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const hook = [526, 150], cageTop = add(hook, [0, 14]);
  f.joint('pole', WN, 'hand_n').joint('cage', cageTop, 'pole').joint('skirt', S.at(0, 0.84), 'pelvis').joint('apron', S.at(0.1, 0.86), 'pelvis').joint('wings', S.at(-0.6, 0.1), 'torso').joint('halo', add(HC, [-36, -10]), 'head');
  const SKG = (o = {}) => SKA(f, o);
  const TUN = (o = {}) => X.GR(f, Object.assign({ fill: '#5a5660', tex: 'weave' + seed, texOp: 0.45 }, o));

  // ---- the halo, cracked, tilted back with the head
  f.bone('halo');
  X.crackedHalo(f, add(HC, [-40, -8]), 54, 40, -1.1, 10, [0.05, 0.4, 0.7], { drift: 7, lost: 0.35 });
  // ---- the bound wings, folded flat down its back, cord wound round them and the body
  f.bone('wings');
  { const r0 = S.at(-0.5, 0.0), tip = [266, 800], d = E.norm(sub(tip, r0)), n = [-d[1], d[0]];
    for (let i = 7; i >= 0; i--) { const t = i / 7, q = add(lerp(r0, tip, 0.25 + t * 0.12), mul(n, -16 + i * 3)); X.feather(f, q, ang(r0, tip) + 0.06 - i * 0.02, 210 + i * 14, 20, X.FE(f, { fill: mix(P.plume, '#000', 0.2 + (i % 3) * 0.05) }), { lead: 0.35, round: true, dark: 0.35, notch: i === 3 ? [0.6] : [] }); }
    const mass = [add(r0, mul(n, 30)), add(r0, mul(n, -36)), add(lerp(r0, tip, 0.45), mul(n, -30)), add(lerp(r0, tip, 0.55), mul(n, 26))];
    X.plumeMass(f, [...mass.slice(0, 3), ...X.featherHem([add(lerp(r0, tip, 0.45), mul(n, -30)), add(lerp(r0, tip, 0.5), mul(n, 0)), add(lerp(r0, tip, 0.55), mul(n, 26))], ang(r0, tip), 18, f)], ang(r0, tip), 16, X.FE(f, { fill: '#c4bcb0', inkW: 1 }), { w: 1, op: 0.5 });
  }
  // ---- far arm, up to the pole above the near hand (behind the pole)
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 34, 28, SKG({ fill: mix('#d0c2a6', '#000', 0.2) }), '_f', { vein: false });
  f.bone('upperarm_f'); { const a0 = lp(SF, EF, -0.05, 0), a1 = lp(SF, EF, 0.98, 0); f.part(K.ragLimb(f, a0, a1, 44, 40, { teeth: 5, depth: 6 }), TUN({ fill: mix('#5a5660', '#000', 0.25), maxShade: 10 })); X.charEdge(f, [lp(a0, a1, 0.94, 18), lp(a0, a1, 0.98, -18)], 4, { gap: 20 }); }
  f.bone('hand_f');
  const gF = mFist(f, WF, EF, -Math.PI / 2, 22, mix('#d0c2a6', '#000', 0.15), { shadow: '#3e3238', tex: 'mottle' + seed, texOp: 0.4, maxBend: 40, name: 'lighter far hand' });
  // ---- legs: the far one forward by the pole, carrying the weight (straighter); bare feet
  X.bareLegRig(f, HF, KF, AF, 38, 52, 38, SKG({ fill: mix('#d0c2a6', '#000', 0.18), maxShade: 12 }), '_f', { nail: P.boneS });
  X.bareLegRig(f, HN, KN, AN, 38, 54, 40, SKG({ maxShade: 12 }), '_n', { extra: pts => X.clipDraw(f, E.smooth(pts), () => scorch(f, add(AN, [20, 30]), 30, 14, 0.4)), nail: P.boneS });
  // ---- torso: the grey working tunic, the void crack from the collarbone down
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.34, 0.36], [0.06, 0.56, 0.56], [0.22, 0.6, 0.62], [0.42, 0.54, 0.56], [0.62, 0.46, 0.5], [0.82, 0.52, 0.52], [1.0, 0.56, 0.52]]);
  f.part(torso, TUN({ maxShade: 22 }));
  X.clipDraw(f, E.smooth(torso), () => { X.formHatch(f, [S.at(-0.4, 0.05), S.at(-0.5, 0.4), S.at(-0.44, 0.8)], 14, { op: 0.4 }); for (let i = 0; i < 3; i++) X.crease(f, [S.at(-0.3, 0.6 + i * 0.08), S.at(0.0, 0.64 + i * 0.08), S.at(0.3, 0.6 + i * 0.08)], 1.6, { col: '#1e1c22', lit: '#8a8690', op: 0.5 }); });
  // the neck and the open collar: pale skin with the crack starting at the collarbone
  f.bone('head');
  f.part(limb(neck0, add(HC, [-16, 34]), 40, 36), SKG());
  f.bone('torso');
  { const col = [S.at(-0.12, -0.04), S.at(0.3, -0.06), S.at(0.36, 0.22), S.at(0.12, 0.3), S.at(-0.06, 0.16)]; f.part(col, SKG({ maxShade: 8 }));
    X.clipDraw(f, E.smooth(col), () => X.vcrack(f, [S.at(-0.02, 0.02), S.at(0.12, 0.12), S.at(0.2, 0.24), S.at(0.24, 0.34)], 8, { dark: '#2a2030', lip: '#f0e6d2' })); }
  // the cord that binds the wings: three turns round the chest and the wing mass, knotted at the front
  for (const [v, sag] of [[0.22, 6], [0.46, 8], [0.7, 6]]) { const a = S.at(-0.84, v - 0.04), m = S.at(0, v + 0.04), b = S.at(0.58, v); X.rope(f, [add(a, [4, 8]), a, add(lerp(a, m, 0.5), [0, sag]), m, b], 4.4, '#6a5c48');  }
  { const k = S.at(0.5, 0.48); f.part(ell(k, 7, 6, 0, 10), X.GR(f, { fill: '#6a5c48', maxShade: 3, cast: false })); X.rope(f, [k, add(k, [6, 20]), add(k, [3, 38])], 3.6, '#6a5c48', { fray: true }); }
  // ---- skirt of the tunic, to the knee; the leather apron over it, edged in cracked gold leaf
  f.bone('skirt');
  { const hem = X.charHem(f, S.at(-0.6, 1.82), S.at(0.66, 1.78), 6, 12, [0, 1]); const sk = [S.at(-0.5, 0.82), S.at(0.54, 0.8), S.at(0.64, 1.3), ...hem.slice().reverse(), S.at(-0.62, 1.3)];
    f.part(sk, TUN({ maxShade: 14 })); X.clipDraw(f, E.smooth(sk), () => { for (let i = 0; i < 3; i++) X.fold2(f, E.smooth(sk), [S.at(-0.4 + i * 0.3, 1.0), S.at(-0.42 + i * 0.32, 1.4), S.at(-0.46 + i * 0.34, 1.78)], 8, { dark: '#000', light: '#9a96a0', lit: '#8a8690', col: '#141218', lightOp: 0.25 }); });
    X.charEdge(f, hem, 4, { gap: 9 });
    // the crack again at the hip, beside the apron
    X.vcrack(f, [S.at(-0.3, 0.9), S.at(-0.2, 1.0), S.at(-0.12, 1.08)], 7, { dark: '#1e1c22', lip: '#9a96a0' }); }
  f.bone('apron');
  { const ap = [S.at(0.02, 0.3), S.at(0.5, 0.28), S.at(0.56, 0.86), S.at(0.7, 1.6), S.at(0.3, 1.66), S.at(-0.06, 1.62), S.at(-0.08, 0.86)];
    f.part(ap, LTH(f, { maxShade: 16 }));
    X.clipDraw(f, E.smooth(ap), () => {
      X.fold2(f, E.smooth(ap), [S.at(0.2, 0.9), S.at(0.24, 1.3), S.at(0.26, 1.64)], 9, { dark: '#000', light: '#6a6268', lit: '#7a7078', col: '#040306', lightOp: 0.35 });
      X.softTone(f, E.smooth(ap), [[[S.at(0.3, 0.3), S.at(0.6, 0.3), S.at(0.6, 1.0), S.at(0.3, 1.0)], '#8a8088', 0.25, 10]]); // the stiff leather's sheen
      for (let i = 0; i < 6; i++) X.burnHole(f, S.at(R(f, 0.0, 0.5), R(f, 0.5, 1.5)), R(f, 2, 4), f.r() * 3); // spark pocks
      X.burn(f, S.at(0.3, 1.3), -1.4, 110, 2, { depth: 2, scorch: '#0a0610' });
      // the pocket with the shears
    });
    const edge = [S.at(0.02, 0.3), S.at(-0.08, 0.86), S.at(-0.06, 1.62), S.at(0.3, 1.66), S.at(0.7, 1.6)];
    f.line(edge, 7, INK); f.line(edge, 4.6, P.gold); f.line(edge.map(q => add(q, [-1, -1])), 1.2, P.goldL, { op: 0.7 }); for (let i = 0; i < edge.length - 1; i++) for (const t of [0.3, 0.7]) f.line([lerp(edge[i], edge[i + 1], t), lerp(edge[i], edge[i + 1], t + 0.05)], 2.2, P.blackD, { op: 0.85 });
    f.line([S.at(0.02, 0.3), S.at(0.5, 0.28)], 6, INK); f.line([S.at(0.02, 0.3), S.at(0.5, 0.28)], 4, P.gold);
    f.line([S.at(0.04, 0.3), S.at(-0.1, 0.0), S.at(-0.3, -0.06)], 3, '#1a1418'); // the neck strap
    // belt of the apron strings, the tinderbox, the bag of wicks, the shears
    f.line([S.at(-0.5, 0.86), S.at(0.0, 0.9), S.at(0.6, 0.86)], 4, '#1a1418');
    const tb = S.at(-0.36, 0.98); f.part([add(tb, [-16, -12]), add(tb, [16, -12]), add(tb, [16, 14]), add(tb, [-16, 14])], { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.2, sharp: true }); f.line([add(tb, [-16, -4]), add(tb, [16, -4])], 1.2, INK, { op: 0.7 }); f.flat(ell(add(tb, [6, 4]), 3, 3, 0, 8), P.goldM); // tinderbox
    const bg = S.at(-0.08, 1.16), bag = [add(bg, [-16, -26]), add(bg, [12, -24]), add(bg, [18, 12]), add(bg, [4, 26]), add(bg, [-18, 18])]; f.line([S.at(-0.14, 0.88), add(bg, [-8, -26])], 2, '#1a1418'); f.part(bag, X.GR(f, { fill: '#7a7064', tex: 'weave' + seed, texOp: 0.5, maxShade: 8 })); for (let i = 0; i < 4; i++) f.line([add(bg, [-8 + i * 5, -24]), add(bg, [-10 + i * 6, -40 - i * 3])], 2.2, '#e8e0cc'); X.rope(f, [add(bg, [-14, -22]), add(bg, [12, -22])], 2.4, '#4a4038'); // the bag of wicks, wick ends out
    const sh = S.at(0.56, 1.02); f.line([S.at(0.58, 0.88), sh], 1.6, '#1a1418'); for (const s0 of [-1, 1]) { f.part(limb(sh, add(sh, [s0 * 6, 40]), 6, 2, { steps: 4 }), { fill: P.ironL, shade: 0.35, inkW: 1, cast: false }); } f.line(ell(add(sh, [-6, -6]), 6, 5, 0, 10).concat([ell(add(sh, [-6, -6]), 6, 5, 0, 10)[0]]), 2.4, P.iron); f.line(ell(add(sh, [6, -6]), 6, 5, 0, 10).concat([ell(add(sh, [6, -6]), 6, 5, 0, 10)[0]]), 2.4, P.iron); f.rivet(add(sh, [0, 4]), 2, '#8a8a86'); // trimming shears
  }
  // ---- head: tired and gentle, tipped back to look up at the cage, cracked across the near cheek
  f.bone('head');
  const hd = angelHead(f, HC, H, hA, { head: { jaw: 0.92, chin: -0.01, nose: 0.95, mouth: 'set', squint: 0.55, browDown: -0.03, browW: 0.04, age: true, hairCol: '#6a6470', iris: P.vioD,
    hair: [[-0.42, 0.08], [-0.48, -0.2], [-0.34, -0.46], [-0.08, -0.53], [0.14, -0.48], [0.2, -0.42], [0.04, -0.42], [-0.14, -0.34], [-0.24, -0.12], [-0.3, 0.08]], hairLines: [[[-0.3, -0.4], [-0.1, -0.46], [0.1, -0.44]], [[-0.4, -0.2], [-0.3, -0.36], [-0.1, -0.42]], [[-0.38, 0.0], [-0.34, -0.2], [-0.2, -0.34]]] },
    inFace: F => { X.vcrack(f, F([[-0.12, 0.06], [0.0, 0.14], [0.12, 0.18], [0.24, 0.16]]), 5, { dark: '#2a2030', lip: '#f0e6d2' }); X.crease(f, F([[0.04, -0.02], [0.1, 0.02], [0.17, 0.0]]), 1, { col: '#3a3040', op: 0.5 }); } });
  for (let i = 0; i < 6; i++) { const q = hd([[-0.38 + i * 0.1, -0.44 - Math.sin(i / 5 * Math.PI) * 0.1]])[0]; X.hairClump(f, [q, add(q, rot([10, -6], hA - 1.2 + i * 0.2)), add(q, rot([18, -6], hA - 1.0 + i * 0.25))], 5, { pal: ['#6a6470', '#8a8490', '#4a4450'], gap: false, n: 2 }); }
  // ---- the pole: dark wood, worn bright where the hands go, a hook of iron at its tip; the cage on its ring
  f.bone('pole');
  { const pole = limb(pB, pT, 14, 11, { steps: 16 }); f.part(pole, { fill: '#3a2e2a', light: '#6a5a4e', shadow: '#0e0a08', shade: 0.42, tex: 'wood' + seed, texOp: 0.45, maxShade: 6 });
    f.line([lp(pB, pT, 0.02, -3), lp(pB, pT, 0.98, -3)], 1.6, '#8a7a68', { op: 0.6 });
    f.line([lp(pB, pT, 0.36, -4), lp(pB, pT, 0.62, -4)], 2.4, '#b8a690', { op: 0.5 }); // worn bright by the hands
    X.burn(f, lp(pB, pT, 0.35, 0), pA, 340, 1.8, { depth: 2, halo: false, wander: 0.35, clip: pole });
    f.part(limb(lp(pB, pT, 0.0, 0), lp(pB, pT, 0.03, 0), 18, 16, { steps: 3, capK: 0.3 }), { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.2, cast: false }); // the ferrule
    const hk = [pT, add(pT, [2, -24]), add(pT, [24, -40]), add(pT, [50, -36]), add(pT, [62, -16]), add(pT, [58, 4]), hook];
    f.line(X.spline(hk, 3), 10, INK); f.line(X.spline(hk, 3), 7, P.iron); f.line(X.spline(hk.slice(1, 5), 3).map(q => add(q, [-1, -2])), 1.6, P.ironL, { op: 0.7 });
    f.part(limb(lp(pB, pT, 0.97, 0), lp(pB, pT, 1.0, 0), 18, 16, { steps: 3, capK: 0.3 }), { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.2, cast: false });
  }
  f.bone('cage');
  { const c = add(cageTop, [0, 70]), w = 34, h = 54;
    f.line(ell(add(cageTop, [0, -2]), 8, 10, 0, 12).concat([ell(add(cageTop, [0, -2]), 8, 10, 0, 12)[0]]), 5, INK); f.line(ell(add(cageTop, [0, -2]), 8, 10, 0, 12).concat([ell(add(cageTop, [0, -2]), 8, 10, 0, 12)[0]]), 3, P.ironL);
    const bars = u => [add(c, [u * w * 0.8, -h - 6]), add(c, [u * w * 1.05, -h * 0.4]), add(c, [u * w * 1.05, h * 0.5]), add(c, [u * w * 0.7, h + 6])];
    for (const u of [-0.3, 0.3]) f.line(X.spline(bars(u), 3), 4, P.ironD); // the back bars
    // the dead star: a black cinder, crazed with violet, one face caught in the light
    const st = []; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; st.push(add(add(c, [0, 8]), rot([22 * R(f, 0.75, 1.15), 0], a))); }
    f.part(st, X.BK(f, { fill: '#1e1a22', light: '#4a4452', maxShade: 8 }));
    X.clipDraw(f, E.smooth(st), () => { for (let i = 0; i < 4; i++) X.burn(f, add(c, [R(f, -6, 6), 8 + R(f, -6, 6)]), f.r() * 6.3, 26, 1.3, { depth: 2, halo: false }); });
    f.flat(ell(add(c, [-6, 2]), 5, 3, -0.5, 8), '#5a5262', { op: 0.6 });
    for (const u of [-1, -0.6, 0, 0.6, 1]) { const bb = X.spline(bars(u), 3); f.line(bb, 5.4, INK); f.line(bb, 3.4, P.iron); f.line(bb.slice(2, 8).map(q => add(q, [-1, 0])), 1, P.ironL, { op: 0.6 }); }
    for (const y of [-h - 6, -h * 0.4, h * 0.5, h + 6]) { const e = ell(add(c, [0, y]), w * (y > 0 && y > h ? 0.7 : y < -h ? 0.8 : 1.05), 6, 0, 18); f.line(e.slice(0, 10), 6, INK); f.line(e.slice(0, 10), 4, P.iron); }
    f.part(ell(add(c, [0, -h - 10]), w * 0.9, 9, 0, 14), { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.4, cast: false }); // the cage's cap
    f.part(ell(add(c, [0, h + 10]), w * 0.7, 7, 0, 14), { fill: P.ironD, light: P.iron, shade: 0.4, inkW: 1.4, cast: false });
    f.flat(ell(add(c, [6, h + 14]), 3, 4, 0, 8), '#2a2430'); // soot
  }
  // ---- the near arm, sleeve rolled to the elbow, the forearm burnt up from the pole
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 38, 32, SKG(), '_n', { vein: true });
  f.bone('forearm_n'); X.burn(f, lp(EN, WN, 0.95, 0), ang(WN, EN), 90, 2, { depth: 3, clip: ell(lerp(EN, WN, 0.5), E.len(sub(WN, EN)) * 0.55, 18, ang(EN, WN), 16) });
  f.bone('upperarm_n'); { const a0 = lp(SN, EN, -0.08, 0), a1 = lp(SN, EN, 0.96, 0), sl = K.ragLimb(f, a0, a1, 44, 40, { teeth: 6, depth: 6 }); f.part(sl, TUN({ maxShade: 10 })); for (let i = 0; i < 3; i++) X.crease(f, [lp(a0, a1, 0.8 + i * 0.05, -22), lp(a0, a1, 0.82 + i * 0.05, 0), lp(a0, a1, 0.8 + i * 0.05, 22)], 1.6, { col: '#1e1c22', lit: '#8a8690' }); X.charEdge(f, [lp(a0, a1, 0.94, 22), lp(a0, a1, 0.98, -22)], 4, { gap: 14 }); X.burnHole(f, lp(a0, a1, 0.5, 8), 4, 0.3); }
  f.bone('hand_n');
  mFist(f, WN, EN, -Math.PI / 2, 24, '#d0c2a6', { shadow: '#3e3238', tex: 'mottle' + seed, texOp: 0.4, maxBend: 40, name: 'lighter near hand' });
  f.bone('root');
  f.flat(ell([400, gy + 2], 150, 8, 0, 18), '#000', { op: 0.3 });
  X.leafDrift(f, [430, 400], 160, 200, 5);
  return X.toneGold(f);
}

// ------------------------------------------------------------------ PUTTO (cast, small 0.5)
// Heaven kept them for decoration. They have found other work. One of the winged infants of the Mother's ceilings, gilt
// carving over black: a real infant's body, heavy with fat and hanging from its beating wings (a large head, a short neck
// lost in folds, a belly that sags, short limbs ringed with creases at the wrists, elbows, knees and ankles, thighs in
// rolls, the legs dangling, the toes dropped). Drawing a small bow: the far arm thrust forward with the bow, the near
// hand drawn back to the jaw with the nock. Half its face is cracked away onto darkness, the broken shell showing its
// thickness, and an eye looks out of the dark; the rest is a sullen pout. Violet burns across the belly; a scorched knee;
// curls crisped by the strike. A scrap of drapery round the hips, a garland of gilt leaves over one shoulder, a quiver of
// three arrows with a ribbon trailing; one wing tip broken off. Not cute: the weight, the sag, the void and the eye.
// Rig: standard humanoid + bow (hand_f) + arrow (hand_n) + quiver (torso) + drape (pelvis) + wing_n_1..3, wing_f_1..3.
// Motion: idle a lazy bobbing hover (wings beat, legs swing); attack a loosed arrow (string released, near arm forward).
function putto() {
  const CW = TIERS.small[0], CH = TIERS.small[1], seed = 1526;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY, Hh = 100;
  const GS = (o = {}) => X.GILT(f, Object.assign({ maxShade: 12 }, o));
  const fold = (pts, w = 1.6) => X.crease(f, pts, w, { col: P.blackD, lit: P.goldL, op: 0.85 }); // a fat fold, black in its depth
  const N = [300, 290], C = [296, 344], Pv = [302, 404];
  const S = B.spine(N, C, Pv, 84);
  const SN = S.at(-0.28, 0.12), SF = S.at(0.3, 0.1);
  const EN = [246, 278], WN = [322, 288];
  const EF = [372, 300], WF = [426, 286];
  const HN = S.at(-0.16, 1.0), KN = [314, 464], AN = [290, 522];
  const HF = S.at(0.24, 1.0), KF = [352, 452], AF = [338, 512];
  const HC = [326, 222], hA = 0.1, neck0 = [306, 288];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('bow', WF, 'hand_f').joint('arrow', WN, 'hand_n').joint('quiver', S.at(-0.6, 0.3), 'torso').joint('drape', S.at(0, 0.9), 'pelvis');
  const Wn = { S: S.at(-0.6, 0.16), E: [218, 236], W: [198, 166], T: [150, 120], tr: 1 };   // near wing up, mid-beat
  const Wf = { S: S.at(-0.5, 0.1), E: [236, 300], W: [196, 334], T: [140, 360], tr: -1 };   // far wing down, the tip broken
  for (const [k, w] of [['n', Wn], ['f', Wf]]) f.joint(`wing_${k}_1`, w.S, 'torso').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  const i0 = f.out.length;
  // a fat limb: a soft tube with a roll at each end, rings of crease at the joints, leaf over black
  const fatLimb = (pts, ws, o = {}) => { const sh = K.chain(pts, ws, { steps: 8, bp: o.bp || [[0, 0.5, 0.16, 0.3]], bq: o.bq || [[0, 0.5, 0.2, 0.3]] }); gilt(f, tubeEnd(sh, pts, ws), { cell: 22, s: 0.4, chips: 1, dark: 0.45 }); return sh; };
  const tubeEnd = (sh) => sh;

  // ---- far wing (down-stroke, the tip broken off), the quiver on the back behind it
  X.wing(f, Wf.S, Wf.E, Wf.W, Wf.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: Wf.tr, Lp: 70, Ls: 46, Wp: 11, Ws: 11, np: 6, ns: 6, nt: 2, look: X.FE(f, { fill: mix('#c8a868', '#000', 0.3), tex: 'craq' + seed, texOp: 0.4 }), skin: GS({ fill: mix(P.gold, '#000', 0.3) }), notchP: [1], notchS: [3], rake: -0.2, wS: 16, wE: 11, wW: 8, darkTips: 0.3, spreadP: 0.5, pLen: t => t > 0.7 ? 0.45 : 0.9 + 0.2 * Math.sin(t * 5) });
  f.bone('wing_f_3'); { const b = lerp(Wf.W, Wf.T, 0.62); f.part([add(b, [-8, -10]), add(b, [6, -8]), add(b, [10, 6]), add(b, [-4, 10])], { fill: '#3a3440', shade: 0.3, inkW: 1.2, cast: false }); f.flat(ell(b, 5, 4, 0.4, 8), P.void); X.shards(f, b, Math.PI - 0.4, 2, 0.5); } // the broken tip: clean break, black inside
  f.bone('quiver');
  { const q0 = S.at(-0.72, 0.62), q1 = S.at(-0.5, -0.1), qs = limb(q0, q1, 26, 30, { steps: 6, capK: 0.3 });
    for (let i = 0; i < 3; i++) { const r0 = lerp(q0, q1, 0.92), tp = add(r0, rot([40 + i * 4, 0], ang(q0, q1) + (i - 1) * 0.18)); f.line([r0, tp], 2.4, '#3a2e2a'); X.feather(f, lerp(r0, tp, 0.55), ang(r0, tp) + 0.05, 20, 8, X.FE(f, { fill: i === 1 ? '#3a3440' : P.plume }), { lead: 0.5 }); }
    f.part(qs, LTH(f, { fill: '#2e2830', maxShade: 6 })); X.leaf(f, [lp(q0, q1, 0.8, -15), lp(q0, q1, 0.8, 15), lp(q0, q1, 0.95, 15), lp(q0, q1, 0.95, -15)], { cell: 14, s: 0.3, chips: 0, burnish: false });
    f.part([lp(q0, q1, 0.82, -16), lp(q0, q1, 0.82, 16), lp(q0, q1, 0.96, 16), lp(q0, q1, 0.96, -16)].map(q => [...q, 1]), GS({ maxShade: 3, cast: false }));
    // the ribbon trailing from the quiver: hanging plumb, a twist and a forked tail
    const rb = lp(q0, q1, 0.1, -10); const rp = [rb, add(rb, [-6, 20]), add(rb, [2, 42]), add(rb, [-8, 64]), add(rb, [-2, 84])];
    f.part(K.chain(rp, [9, 8, 9, 7, 8], { steps: 6 }), X.BN(f, { fill: '#cfc8ba', maxShade: 4, cast: false }));
    f.line(rp.map(q => add(q, [-2, 0])), 1, '#6a6070', { op: 0.6 }); f.part([add(rp[4], [-5, 0]), add(rp[4], [5, 0]), [...add(rp[4], [7, 16]), 1], add(rp[4], [0, 8]), [...add(rp[4], [-6, 16]), 1]], X.BN(f, { fill: '#cfc8ba', maxShade: 2, cast: false }));
    X.charEdge(f, [add(rp[4], [-6, 14]), add(rp[4], [6, 14])], 3, { gap: 20 });
  }
  // ---- far arm thrust forward with the bow; far leg
  const ARM = (S0, E0, W0, wU, wF, sfx, dim) => {
    f.bone('upperarm' + sfx); const up = K.chain([S0, E0], [wU, wU * 0.82], { steps: 8, bp: [[0, 0.45, 0.14, 0.3]], bq: [[0, 0.5, 0.18, 0.3]] }); gilt(f, up, { look: { fill: mix(P.gold, '#000', dim) }, cell: 20, s: 0.4, chips: 1 });
    f.bone('forearm' + sfx); const fo = K.chain([lerp(S0, E0, 0.92), W0], [wF * 1.04, wF * 0.84], { steps: 8, bp: [[0, 0.3, 0.16, 0.3]], bq: [[0, 0.35, 0.12, 0.3]] }); gilt(f, fo, { look: { fill: mix(P.gold, '#000', dim) }, cell: 20, s: 0.4, chips: 1 });
    const d = E.norm(sub(W0, E0)), n = [-d[1], d[0]];
    fold([add(E0, mul(n, wF * 0.5)), add(add(E0, mul(d, 3)), mul(n, 0)), add(E0, mul(n, -wF * 0.3))], 1.6); // the elbow's fold (a dimple on the outside)
    f.flat(ell(add(E0, mul(n, -wF * 0.1)), 3, 2, 0, 6), P.blackD, { op: 0.7 });
    fold([add(lerp(E0, W0, 0.86), mul(n, wF * 0.48)), add(lerp(E0, W0, 0.9), mul(n, 0)), add(lerp(E0, W0, 0.86), mul(n, -wF * 0.46))], 1.8); // the wrist's ring of crease
    fold([add(lerp(S0, E0, 0.2), mul(n, wU * 0.5)), add(lerp(S0, E0, 0.26), mul(n, wU * 0.1))], 1.4); // the armpit's fold
  };
  ARM(SF, EF, lerp(EF, WF, 0.85), 34, 30, '_f', 0.18);
  const LEG = (Hp, Kn, A, sfx, dim, scorchK) => {
    const d1 = E.norm(sub(Kn, Hp)), n1 = [-d1[1], d1[0]], d2 = E.norm(sub(A, Kn)), n2 = [-d2[1], d2[0]];
    // the whole leg in one soft outline (a fat thigh in rolls, a dimpled knee, a short plump calf), cut at the knee
    const [c0, c1] = X.jcut(Hp, Kn, A, 18);
    const sh = split(f, () => { const lg = K.chain([Hp, lerp(Hp, Kn, 0.5), Kn, lerp(Kn, A, 0.45), A], [58, 52, 36, 34, 22], { steps: 8, bp: [[0, 0.4, 0.06, 0.3], [2, 0.6, 0.14, 0.3]], bq: [[0, 0.5, 0.16, 0.3], [1, 0.3, 0.1, 0.3], [2, 0.5, 0.2, 0.3]] }); gilt(f, lg, { look: { fill: mix(P.gold, '#000', dim) }, cell: 22, s: 0.4, chips: 1, dark: 0.4 });
      for (const t of [0.4, 0.72]) fold([add(lerp(Hp, Kn, t), mul(n1, -24 * (1 - t * 0.4))), add(lerp(Hp, Kn, t + 0.03), mul(n1, -8)), add(lerp(Hp, Kn, t), mul(n1, 10))], 2); // the thigh's rolls, inside and front
      fold([add(Kn, mul(n2, -15)), add(add(Kn, mul(d2, 4)), mul(n2, 0)), add(Kn, mul(n2, 13))], 1.8); f.flat(ell(add(Kn, mul(n2, 6)), 3, 2, 0, 6), P.blackD, { op: 0.6 }); // the knee's crease and its dimple
      fold([add(lerp(Kn, A, 0.9), mul(n2, -11)), add(lerp(Kn, A, 0.93), mul(n2, 0)), add(lerp(Kn, A, 0.9), mul(n2, 10))], 1.6); // the ankle's ring
      return lg; }, [['thigh' + sfx, c0], ['shin' + sfx, c1]]);
    if (scorchK) X.clipDraw(f, E.smooth(sh), () => { scorch(f, Kn, 18, 16, 0.7); X.burn(f, add(Kn, [4, -4]), 1.2, 30, 1.2, { depth: 2, haloOp: 0.2 }); X.ashCake(f, Kn, 10, 8, 4, 0.5, 0.4); });
    // the foot hanging, toes dropped: a fat little foot, sole turned back, toes as pads
    f.bone('foot' + sfx);
    const fd = E.norm(add(d2, [0.7, 0.25])), fn = [-fd[1], fd[0]], toe = add(A, mul(fd, 38));
    const ft = [add(A, mul(fn, -13)), add(add(A, mul(fd, 16)), mul(fn, -16)), add(add(toe, mul(fd, -4)), mul(fn, -11)), add(toe, mul(fn, -2)), add(add(toe, mul(fd, -2)), mul(fn, 8)), add(add(A, mul(fd, 20)), mul(fn, 11)), add(add(A, mul(fd, 4)), mul(fn, 14)), add(add(A, mul(fd, -10)), mul(fn, 10)), add(add(A, mul(fd, -12)), mul(fn, -4))];
    gilt(f, ft, { look: { fill: mix(P.gold, '#000', dim + 0.05) }, cell: 16, s: 0.35, chips: 0 });
    for (let i = 0; i < 4; i++) { const tc = add(add(toe, mul(fd, -2 - i * 3)), mul(fn, 6 - i * 4.4)); f.part(ell(tc, 4.6 - i * 0.6, 4, ang(A, toe), 8), GS({ fill: mix(P.gold, '#000', dim + 0.1), cast: false, inkW: 0.9, inkHeavy: 1, maxShade: 2 })); }
    fold([add(add(A, mul(fd, 22)), mul(fn, -12)), add(add(A, mul(fd, 24)), mul(fn, 2))], 1.2);
  };
  LEG(HF, KF, AF, '_f', 0.2, false);

  // ---- the near wing, raised in the beat, behind the body
  X.wing(f, Wn.S, Wn.E, Wn.W, Wn.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: Wn.tr, Lp: 78, Ls: 50, Wp: 12, Ws: 12, np: 7, ns: 6, nt: 2, look: X.FE(f, { fill: '#c8a868', tex: 'craq' + seed, texOp: 0.4 }), skin: GS(), lift: true, notchP: [3], notchS: [2], rake: 0.3, wS: 18, wE: 12, wW: 9, darkTips: 0.4, spreadP: 0.35, pLen: t => 0.8 + 0.3 * Math.sin(t * 3) });
  f.bone('wing_n_2'); X.burn(f, lerp(Wn.E, Wn.W, 0.3), ang(Wn.E, Wn.W) - 0.5, 34, 1.2, { depth: 2, clip: ell(lerp(Wn.E, Wn.W, 0.4), 40, 14, ang(Wn.E, Wn.W), 12) });

  // ---- the body: a short chest, the belly hanging round and low (it hangs from the wings), the navel, folds
  f.bone('torso');
  const torso = S.shape([[-0.1, 0.34, 0.3], [0.06, 0.52, 0.5], [0.24, 0.58, 0.56], [0.44, 0.58, 0.66], [0.62, 0.6, 0.8], [0.8, 0.62, 0.84], [0.96, 0.62, 0.7], [1.08, 0.56, 0.4]]);
  gilt(f, torso, { cell: 26, s: 0.45, chips: 2, dark: 0.55, lite: 0.45 });
  X.clipDraw(f, E.smooth(torso), () => {
    X.softTone(f, E.smooth(torso), [[ell(S.at(0.5, 0.92), 34, 12, 0, 12), P.blackD, 0.6, 5], [ell(S.at(0.45, 0.62), 22, 20, 0, 12), '#fff2c4', 0.4, 8]]); // the belly's underside in shadow, its round lit
    fold([S.at(0.0, 0.9), S.at(0.3, 0.98), S.at(0.6, 0.96), S.at(0.8, 0.9)], 2.2); // the fold under the belly
    fold([S.at(0.1, 0.36), S.at(0.3, 0.38), S.at(0.5, 0.34)], 1.4); // the chest's lower fold
    f.flat(ell(S.at(0.62, 0.7), 3.4, 4.2, 0.3, 8), P.blackD); f.line([S.at(0.58, 0.66), S.at(0.62, 0.68)], 1, P.goldL, { op: 0.7 }); // navel
    X.burn(f, S.at(0.2, 0.55), -0.1, 70, 2, { depth: 3, haloOp: 0.3 }); // across the belly
    X.burn(f, S.at(0.7, 0.8), -2.6, 40, 1.4, { depth: 2, haloOp: 0.3 });
  });
  // the neck lost in fat: a double fold under the jaw
  f.bone('head');
  { const nk = [add(neck0, [-26, -14]), add(neck0, [26, -16]), add(neck0, [30, 10]), add(neck0, [-28, 12])]; gilt(f, nk, { cell: 18, s: 0.35, chips: 0 }); }
  // ---- drapery round the hips: a twisted scrap of black cloth, an end hanging plumb and lifting a little
  f.bone('drape');
  { const top = [S.at(-0.66, 0.84), S.at(-0.1, 0.96), S.at(0.5, 1.02), S.at(0.74, 0.96)], bot = [S.at(0.72, 1.12), S.at(0.4, 1.18), S.at(-0.1, 1.14), S.at(-0.68, 1.02)];
    const dr = [...top, ...bot]; f.part(dr, CLB(f, { maxShade: 8 }));
    X.clipDraw(f, E.smooth(dr), () => { for (let i = 0; i < 4; i++) X.crease(f, [S.at(-0.5 + i * 0.32, 0.88), S.at(-0.4 + i * 0.32, 1.0), S.at(-0.36 + i * 0.32, 1.12)], 1.6, { col: '#040306', lit: '#5a5060' }); });
    const e0 = S.at(-0.2, 1.08), tail = [e0, add(e0, [-4, 18]), add(e0, [2, 38]), add(e0, [-2, 56])]; f.part(K.chain(tail, [22, 20, 18, 16], { steps: 6 }), CLB(f, { maxShade: 6 }));
    { const hm = X.charHem(f, add(tail[3], [10, 0]), add(tail[3], [-10, 0]), 3, 10, [0, 1]); X.charEdge(f, hm, 3, { gap: 20 }); }
    X.crease(f, tail.map(q => add(q, [2, 0])), 1.4, { col: '#040306', lit: '#5a5060' });
  }
  // ---- near leg, the knee scorched
  LEG(HN, KN, AN, '_n', 0, true);
  // ---- garland of gilt leaves over the near shoulder and across the chest
  f.bone('torso');
  { const gp = X.spline([S.at(-0.4, -0.04), S.at(-0.1, 0.2), S.at(0.3, 0.44), S.at(0.6, 0.52)], 4);
    f.line(gp, 3, '#3a2e1a');
    for (let i = 1; i < gp.length - 1; i += 1) { const q = gp[i], a = ang(gp[i - 1], gp[i + 1]) + (i % 2 ? 1 : -1) * R(f, 0.5, 1.1); const lf = [q, add(q, rot([9, -7], a)), add(q, rot([20, 0], a)), add(q, rot([9, 7], a))]; f.part(lf, GS({ maxShade: 2, cast: false, inkW: 1, inkHeavy: 1.2 })); f.line([q, add(q, rot([12, 0], a))], 0.8, P.goldS, { op: 0.8 }); }
    for (let k = 0; k < 2; k++) { const e = gp[gp.length - 1], d0 = [k ? 4 : -4, 18]; f.line([e, add(e, d0), add(e, [d0[0] * 0.5, 30])], 2.4, '#3a2e1a'); f.part([add(e, [d0[0] * 0.5, 30]), add(e, [d0[0] * 0.5 + 6, 36]), add(e, [d0[0] * 0.5, 44]), add(e, [d0[0] * 0.5 - 6, 36])], GS({ maxShade: 2, cast: false, inkW: 1 })); }
  }

  // ---- the head: big, heavy, the cheeks dropping into jowls; half the face cracked away, an eye in the dark
  f.bone('head');
  const F = frame(HC, hA, Hh);
  const skull = F([[-0.48, -0.04], [-0.46, -0.3], [-0.3, -0.5], [-0.04, -0.57], [0.22, -0.5], [0.37, -0.32], [0.42, -0.12], [0.41, 0.0], [0.47, 0.1], [0.46, 0.15], [0.42, 0.17], [0.45, 0.22], [0.43, 0.27], [0.38, 0.3], [0.36, 0.37], [0.3, 0.47], [0.12, 0.53], [-0.06, 0.49], [-0.25, 0.37], [-0.42, 0.18]]);
  gilt(f, skull, { cell: 26, s: 0.42, chips: 1, dark: 0.5 });
  const voidR = F([[0.08, -0.44], [0.22, -0.48], [0.35, -0.34], [0.41, -0.18], [0.41, -0.04], [0.36, 0.0], [0.3, 0.06], [0.22, 0.03], [0.14, 0.06], [0.08, -0.02], [0.1, -0.14], [0.02, -0.28]].map(q => [q[0], q[1], 1]));
  X.clipDraw(f, E.smooth(skull), () => {
    // cheek mass sagging toward the jaw, the jowl's fold; the double chin; the sullen pout
    X.softTone(f, E.smooth(skull), [[F(ell([0.14, 0.26], 0.16, 0.14, 0, 12)), '#fff2c4', 0.35, 4], [F([[-0.1, 0.3], [0.2, 0.42], [0.32, 0.44], [0.1, 0.5], [-0.12, 0.42]]), P.blackD, 0.5, 4], [F(ell([-0.3, 0.0], 0.18, 0.3, 0, 12)), P.blackD, 0.35, 6]]);
    fold(F([[0.1, 0.42], [0.22, 0.4], [0.33, 0.36]]), 1.8);
    fold(F([[0.02, 0.36], [0.14, 0.36], [0.24, 0.3]]), 1.2);
    // the mouth: a pout, the upper lip turned out over a heavy lower lip, the corner pulled down
    f.part(F([[0.37, 0.215], [0.44, 0.2], [0.455, 0.235], [0.42, 0.25], [0.37, 0.245]]), GS({ fill: '#b8903e', maxShade: 2, cast: false, inkW: 1 }));
    f.part(F([[0.37, 0.25], [0.43, 0.255], [0.44, 0.28], [0.39, 0.3], [0.35, 0.28]]), GS({ fill: '#a07a30', maxShade: 2, cast: false, inkW: 1 }));
    f.line(F([[0.33, 0.27], [0.37, 0.25], [0.43, 0.25]]), 1.6, P.blackD);
    // the nose: small, a little upturned; the far eye under a heavy lid
    f.line(F([[0.42, 0.04], [0.46, 0.12], [0.43, 0.16]]), 1.4, P.goldS, { op: 0.8 }); f.flat(F(ell([0.43, 0.15], 0.012, 0.01, 0, 6)), P.blackD); fold(F([[0.36, 0.1], [0.3, 0.17], [0.32, 0.22]]), 1.2); // the cheek's fold beside the nose
    // the ear behind the jaw, mostly under the curls
    f.part(F([[-0.16, -0.02], [-0.24, -0.06], [-0.28, 0.06], [-0.22, 0.16], [-0.14, 0.14]]), GS({ maxShade: 3, cast: false, inkW: 1 })); fold(F([[-0.2, 0.0], [-0.24, 0.06], [-0.2, 0.12]]), 1);
  });
  // the broken half: the shell's thickness round the hole, the void inside, an eye looking out of it
  f.part(voidR.map(q => add(q, [0, 0])), { fill: '#3a3440', shade: 0.3, inkW: 1.6, inkHeavy: 2.2, cast: false, tex: 'chisel' + seed, texOp: 0.6 });
  { const inner = F([[0.11, -0.38], [0.22, -0.42], [0.32, -0.31], [0.37, -0.17], [0.36, -0.06], [0.31, -0.02], [0.26, 0.02], [0.2, -0.01], [0.15, 0.01], [0.12, -0.05], [0.13, -0.15], [0.07, -0.27]].map(q => [q[0], q[1], 1]));
    f.flat(inner, P.void); f.line(inner.slice(0, 6), 1.6, P.goldW, { op: 0.7 }); f.line(inner.slice(6), 1.2, P.vio, { op: 0.7 });
    X.eye(f, F([[0.24, -0.14]])[0], Hh * 0.07, hA, { lid: X.BK(f, { fill: '#2a2236' }), open: 0.6, gaze: [0.8, 0.1], iris: P.vio, mass: false, inkW: 1 });
    X.vcrack(f, F([[0.0, 0.1], [-0.08, 0.2], [-0.12, 0.32]]), 4, { dark: P.goldS }); X.vcrack(f, F([[0.34, 0.04], [0.38, 0.14]]), 3, { dark: P.goldS });
    X.shards(f, F([[0.4, -0.3]])[0], -0.6, 3, 0.45);
  }
  // crisped curls: tight carved spirals over the crown, their tips charred by the strike
  for (let i = 0; i < 16; i++) { const a = -Math.PI * (0.18 + 0.8 * i / 15), rr = 0.43 + (i % 2) * 0.05, c = F([[Math.cos(a) * rr - 0.04, Math.sin(a) * rr * 0.98 - 0.06]])[0], r = Hh * R(f, 0.07, 0.1);
    const sp = []; for (let k = 0; k <= 12; k++) { const t = k / 12 * 5.4, rk = r * (1 - k / 14); sp.push(add(c, [Math.cos(t + i) * rk, Math.sin(t + i) * rk])); }
    f.part(ell(c, r * 1.1, r * 0.95, i, 10), GS({ fill: i % 3 ? '#a07a2c' : '#8a6a26', maxShade: 3, cast: false, inkW: 1.1, inkHeavy: 1.4 }));
    f.line(sp, 1.4, P.goldS, { op: 0.85 }); f.line(sp.slice(0, 5).map(q => add(q, [-1, -1])), 1, P.goldL, { op: 0.6 });
    if (i % 3 === 0) f.flat(ell(add(c, rot([r * 0.8, 0], a)), r * 0.45, r * 0.3, a, 8), P.charS, { op: 0.8 }); }
  X.burn(f, F([[-0.3, -0.2]])[0], 1.9, 30, 1.2, { depth: 2, haloOp: 0.2, clip: skull });

  // ---- the bow in the far hand, the arrow nocked and drawn to the near hand at the jaw
  f.bone('bow');
  const bT = add(WF, [-14, -96]), bB = add(WF, [-8, 92]);
  { const arm = (a, mid, b) => { const C2 = X.spline([a, mid, b], 3); f.line(C2, 7.6, INK); f.line(C2, 5.4, '#a8822e'); f.line(C2.map(q => add(q, [-1, -1])), 1.4, P.goldL, { op: 0.7 }); return C2; };
    arm(WF, add(WF, [12, -50]), bT); arm(WF, add(WF, [14, 48]), bB);
    for (const tp of [bT, bB]) f.part(ell(tp, 4, 5, 0, 8), GS({ maxShade: 1, cast: false, inkW: 1 }));
    f.line([bT, WN, bB], 1.1, '#d8d0bc', { op: 0.9, straight: true }); // the drawn string
    X.burn(f, add(WF, [8, -30]), -1.6, 30, 1, { depth: 1, halo: false, clip: limb(WF, add(WF, [12, -60]), 8, 6) });
  }
  f.bone('arrow');
  { const aT = add(WF, [44, 4]); f.line([WN, aT], 3, '#3a2e2a'); f.part([add(aT, [-2, -5]), add(aT, [12, 0], 1), add(aT, [-2, 5])], GS({ maxShade: 1, cast: false, inkW: 1 })); X.feather(f, add(WN, [8, 0]), ang(aT, WN) + Math.PI, 16, 7, X.FE(f), { lead: 0.5 }); }
  f.bone('hand_f');
  mFist(f, WF, EF, -Math.PI / 2, 16, mix(P.gold, '#000', 0.1), { tex: 'craq' + seed, texOp: 0.35, shadow: P.goldS, maxBend: 40, name: 'putto bow' });
  // ---- near arm drawn back, the hand at the jaw holding the nock
  ARM(SN, EN, lerp(EN, WN, 0.85), 34, 30, '_n', 0);
  f.bone('upperarm_n'); X.burn(f, lp(SN, EN, 0.2, 0), ang(SN, EN), 40, 1.2, { depth: 2, clip: ell(lerp(SN, EN, 0.5), 30, 14, ang(SN, EN), 12) });
  f.bone('hand_n');
  mFist(f, WN, EN, Math.PI / 2, 15, P.gold, { tex: 'craq' + seed, texOp: 0.35, shadow: P.goldS, maxBend: 40, name: 'putto nock' });
  f.bone('root');
  X.placeFigure(f, i0, 0.88, [300, 380], [300, 380], Object.keys(f.joints)); // true size: 0.5 of a human
  X.leafDrift(f, [300, 600], 80, 60, 5);
  f.flat(ell([300, gy + 2], 70, 5, 0, 14), '#000', { op: 0.2 });
  return X.toneGold(f);
}

// ------------------------------------------------------------------ SCORCHED DOVES (cast, small, a flock 0.6 across)
// The doves of heaven carried its messages. The messages are bad now. Eight white doves wheeling in a curve, each its own
// bird: each at its own size, heading and wingbeat (up-stroke, down-stroke, glide, tucked in a dive), each burnt in its
// own way. White feathers scorched with violet branching burns (clipped to the bird), wing tips crisped black, breast
// feathers standing out from the strike. Void cracks open across some bodies, black inside; one has too many eyes; one
// has no head (a clean void rim where the neck ends) and flies anyway. Tiny message scrolls tied to their legs, cracked
// gold leg rings, a sprig of gilt leaves in one beak, loose feathers falling behind, a scrap of burnt banner on a foot.
// Rig: flock (root) > dove_1..dove_8 (one bone per bird). Motion: idle wheeling (each dove bobs and its bone turns);
// attack the flock diving through a hero (the flock bone sweeps, the doves tuck).
function scorchedDoves() {
  const CW = TIERS.small[0], CH = TIERS.small[1], seed = 1527;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY;
  const FW = (o = {}) => X.FE(f, Object.assign({ fill: '#e2d4ba', shadow: '#5a4434', light: '#fbf2de' }, o)); // warm bone white, not cool grey: the doves were white and the strike has singed them
  const doves = [
    { c: [150, 318], a: -0.32, s: 74, ph: 'up', headless: true, ring: true },
    { c: [236, 248], a: -0.12, s: 82, ph: 'down', scroll: true, ring: true },
    { c: [330, 318], a: 0.12, s: 88, ph: 'glide', sprig: true, crack: true },
    { c: [438, 264], a: 0.42, s: 74, ph: 'down', eyes: true },
    { c: [206, 408], a: 0.04, s: 70, ph: 'glide', crack: true, scroll: true },
    { c: [312, 452], a: -0.5, s: 64, ph: 'up', banner: true, ring: true },
    { c: [420, 400], a: 0.7, s: 72, ph: 'tuck', crack: true },
    { c: [500, 330], a: 1.15, s: 62, ph: 'down', scroll: true },
  ];
  f.joint('flock', [320, 350]);
  for (const d of doves) { d.c = [320 + (d.c[0] - 320) * 1.05, 350 + (d.c[1] - 350) * 1.3]; d.s *= 0.86; }
  doves.forEach((d, i) => f.joint('dove_' + (i + 1), d.c, 'flock'));
  // one dove: local frame, x forward along its heading, y down (mirrored when it flies leftward so its back stays up)
  const dove = (d, i) => {
    f.bone('dove_' + (i + 1));
    const fl = Math.cos(d.a) < 0 ? -1 : 1, F0 = frame(d.c, d.a, d.s), F = pts => F0(pts.map(p => [p[0], p[1] * fl, p[2] || 0]));
    const dim = (i % 3) * 0.06, look = FW({ fill: mix('#e2d4ba', '#3a2418', dim) });
    const shoulder = [0.1, -0.12];
    // a wing as a fan of feathers off a leading edge (shoulder > wrist > tip), coverts as one plumed mass over the bases
    const SA = la => d.a + fl * la; // a local angle carried to the screen
    const blend = (a1, a2, k) => Math.atan2(Math.sin(a1) * (1 - k) + Math.sin(a2) * k, Math.cos(a1) * (1 - k) + Math.cos(a2) * k);
    const wing = (wa, bend, len, far) => {
      const wl = far ? FW({ fill: mix('#e2d4ba', '#3a2418', dim + 0.22) }) : look, tl = Math.PI - 0.15;
      const wrL = add(shoulder, mul(dir(wa), 0.34 * len)), tpL = add(wrL, mul(dir(wa + bend), 0.5 * len));
      const S0 = F([shoulder])[0], Wr = F([wrL])[0], T = F([tpL])[0];
      for (let k = 6; k >= 0; k--) { const t = k / 6, r0 = lerp(Wr, T, t * 0.85), a = SA(blend(wa + bend, tl, (1 - t) * 0.7)); X.feather(f, r0, a, d.s * len * (0.46 + 0.1 * Math.sin(t * 3)) * R(f, 0.9, 1.05), d.s * 0.1, Object.assign({}, wl, { inkW: 0.8, inkHeavy: 1.2 }), { lead: 0.3, round: true, dark: 0.22, darkCol: '#24160c', darkOp: 0.85, splits: false, notch: (k + i) % 4 === 0 ? [0.7] : [] }); }
      for (let k = 4; k >= 0; k--) { const t = k / 4, r0 = lerp(S0, Wr, 0.15 + t * 0.85); X.feather(f, r0, SA(blend(wa, tl, 0.85) + (f.r() - 0.5) * 0.15), d.s * len * 0.34, d.s * 0.11, Object.assign({}, wl, { inkW: 0.8, inkHeavy: 1.2 }), { lead: 0.4, round: true, dark: 0.2, darkCol: '#24160c', darkOp: 0.7, splits: false }); }
      const cv = F([shoulder, wrL, add(wrL, mul(dir(blend(wa, tl, 0.85)), 0.14 * len)), add(shoulder, mul(dir(blend(wa, tl, 0.85)), 0.18 * len))]);
      X.plumeMass(f, cv, SA(blend(wa, tl, 0.85)), d.s * 0.09, Object.assign({}, wl, { inkW: 0.9, inkHeavy: 1.2, fill: mix(wl.fill, '#fff', 0.08) }), { w: 0.8, op: 0.45 });
      if (!far) X.burn(f, lerp(S0, Wr, 0.3), SA(wa + bend), d.s * len * 0.4, 1.1, { depth: 2, haloOp: 0.3, clip: F([shoulder, wrL, tpL, add(tpL, mul(dir(tl), 0.3)), add(shoulder, mul(dir(tl), 0.3 * len))]) });
    };
    const W = { up: [[-1.9, 0.5, 1.0], [-1.6, 0.4, 0.9]], down: [[1.7, -0.5, 1.0], [1.3, -0.4, 0.85]], glide: [[-0.5, -0.3, 0.9], [-0.8, -0.2, 0.75]], tuck: [[-2.7, -0.2, 0.85], [-2.85, -0.15, 0.8]] }[d.ph];
    wing(W[1][0], W[1][1], W[1][2], true); // the far wing, behind the body
    // tail fan
    for (let k = 0; k < 5; k++) X.feather(f, F([[-0.34, 0.0]])[0], SA(Math.PI + (k - 2) * 0.12 * (d.ph === 'tuck' ? 0.4 : 1)), d.s * 0.36, d.s * 0.11, Object.assign({}, look, { fill: mix(look.fill, '#000', 0.06 + k * 0.02), inkW: 0.8, inkHeavy: 1.1 }), { lead: 0.5, round: true, dark: 0.18, darkCol: '#24160c', darkOp: 0.8, splits: false });
    // legs tucked under, the feet with a ring, a scroll or a scrap of banner
    const ft = F([[0.02, 0.2]])[0];
    f.line([F([[0.06, 0.12]])[0], ft], d.s * 0.04, '#2a2430'); f.line([ft, add(ft, rot([d.s * 0.08, 0], SA(0.8)))], d.s * 0.025, '#2a2430');
    if (d.ring) { f.part(ell(F([[0.045, 0.15]])[0], d.s * 0.035, d.s * 0.025, d.a, 8), X.GL(f, { maxShade: 1, cast: false, inkW: 0.8, inkHeavy: 0.8 })); f.line([F([[0.035, 0.13]])[0], F([[0.04, 0.17]])[0]], 1, P.blackD); }
    if (d.scroll) { const sc = add(ft, [2, d.s * 0.06]); f.part(limb(add(sc, [-d.s * 0.07, 0]), add(sc, [d.s * 0.07, 0]), d.s * 0.05, d.s * 0.05, { steps: 3, capK: 0.3 }), X.BN(f, { fill: '#cec6b2', maxShade: 2, cast: false, inkW: 0.9 })); f.line([add(sc, [-2, -d.s * 0.03]), ft], 0.9, '#4a3a2a'); f.line([add(sc, [-1, -d.s * 0.025]), add(sc, [-1, d.s * 0.025])], 1, '#4a3a2a'); X.charEdge(f, [add(sc, [d.s * 0.06, -2]), add(sc, [d.s * 0.07, 2])], 2, { gap: 10, violet: false }); }
    if (d.banner) { const b0 = add(ft, [0, 2]); const bn = [b0, add(b0, [d.s * 0.16, 4]), add(b0, [d.s * 0.12, d.s * 0.2]), add(b0, [d.s * 0.04, d.s * 0.26]), add(b0, [-d.s * 0.04, d.s * 0.16])]; f.part(bn, CLB(f, { maxShade: 3, cast: false, inkW: 1 })); f.line([add(b0, [d.s * 0.02, d.s * 0.06]), add(b0, [d.s * 0.1, d.s * 0.07])], 1.2, '#c8a050'); X.charEdge(f, bn.slice(2), 2.4, { gap: 8 }); }
    // the body: a full breast, a tapering back; breast feathers standing out from the strike
    const body = F([[0.36, -0.06], [0.3, -0.15], [0.12, -0.19], [-0.1, -0.14], [-0.3, -0.06], [-0.4, 0.0], [-0.3, 0.06], [-0.06, 0.15], [0.14, 0.17], [0.3, 0.1]]);
    f.part(body, Object.assign({}, look, { maxShade: d.s * 0.1, tex: 'barb' + seed, texOp: 0.3 }));
    X.clipDraw(f, E.smooth(body), () => {
      X.softTone(f, E.smooth(body), [[F([[-0.3, 0.04], [0.3, 0.06], [0.2, 0.2], [-0.2, 0.2]]), '#4a3426', 0.45, d.s * 0.04], [F([[-0.4, -0.1], [0.0, -0.2], [0.1, -0.05], [-0.3, 0.02]]), '#7a4e26', 0.45, d.s * 0.05]]); // the belly in warm shade; a brown singe across the back
      X.plumeMass(f, body, SA(Math.PI), d.s * 0.08, Object.assign({}, look, { inkW: 0 }), { w: 0.7, op: 0.35, dark: 0.1 });
      X.burn(f, F([[0.1, -0.1]])[0], SA(2.4), d.s * 0.4, 1.2, { depth: 2, haloOp: 0.35 });
      if (d.crack) X.vcrack(f, F([[-0.2, -0.08], [-0.02, -0.02], [0.12, 0.08], [0.22, 0.12]]), d.s * 0.07, { dark: '#3a3440', lip: '#f4f0e6' });
    });
    for (let k = 0; k < 5; k++) { const q = F([[0.33 - k * 0.025, -0.02 + k * 0.03]])[0], aa = SA(0.2 + k * 0.22) + (f.r() - 0.5) * 0.4, l = d.s * R(f, 0.04, 0.07); f.stroke([q, add(q, rot([l * 0.6, 1], aa)), add(q, rot([l, 0], aa))], d.s * 0.04, '#ece6da'); f.line([q, add(q, rot([l, 0], aa))], 0.6, INK, { op: 0.45 }); } // the breast feathers standing out
    // the head: small and round on a short neck, the beak open; or its absence
    const hc = F([[0.4, -0.12]])[0], hr = d.s * 0.095;
    if (d.headless) {
      const nk = F([[0.36, -0.1]])[0]; f.part(ell(nk, hr * 0.62, hr * 0.8, d.a, 14), { fill: P.ashW, shade: 0.1, inkW: 1, cast: false, hatch: false }); f.flat(ell(nk, hr * 0.48, hr * 0.64, d.a, 14), P.void); f.flat(ell(add(nk, [1, 1]), hr * 0.2, hr * 0.26, d.a, 8), P.vioS, { op: 0.9 });
      X.shards(f, add(nk, rot([hr, 0], d.a)), d.a, 3, 0.4);
    } else {
      const beak = (open) => { const b0 = F([[0.47, -0.13]])[0]; f.part([F([[0.46, -0.16]])[0], F([[0.56, -0.14 - open]])[0], F([[0.47, -0.11]])[0]], { fill: '#3a3440', shade: 0.3, inkW: 1, cast: false }); f.part([F([[0.46, -0.1]])[0], F([[0.54, -0.08 + open]])[0], F([[0.47, -0.12]])[0]], { fill: '#2a2430', shade: 0.3, inkW: 1, cast: false }); f.flat(ell(F([[0.46, -0.155]])[0], d.s * 0.012, d.s * 0.008, d.a, 6), P.boneD); return b0; };
      f.part(ell(hc, hr, hr * 0.92, d.a, 14), Object.assign({}, look, { maxShade: hr * 0.3, tex: 'barb' + seed, texOp: 0.3 }));
      X.clipDraw(f, E.smooth(ell(hc, hr, hr * 0.92, d.a, 14)), () => X.softTone(f, E.smooth(ell(hc, hr, hr * 0.92, d.a, 14)), [[ell(add(hc, mul(f.L, -hr * 0.6)), hr * 0.8, hr * 0.8, 0, 10), '#3a3440', 0.4, 2]]));
      beak(0.03 + (i % 3) * 0.012);
      if (d.eyes) { for (const [u, v, k] of [[0.42, -0.15, 1], [0.36, -0.16, 0.8], [0.4, -0.08, 0.7], [0.33, -0.1, 0.75], [0.3, -0.13, 0.6], [0.25, -0.12, 0.55]]) X.eye(f, F([[u, v]])[0], d.s * 0.022 * k, d.a, { lid: FW({ fill: '#b8b2a6' }), open: 0.75, gaze: [0.6 * fl, 0.1], iris: P.vio, mass: false, inkW: 0.7 }); }
      else { f.flat(ell(F([[0.42, -0.145]])[0], d.s * 0.016, d.s * 0.014, d.a, 8), '#120e16'); f.flat(ell(F([[0.418, -0.15]])[0], d.s * 0.005, d.s * 0.005, d.a, 6), '#e8e2d4', { op: 0.8 }); f.line(F([[0.405, -0.16], [0.43, -0.162]]), 0.8, INK, { op: 0.6 }); }
      if (d.sprig) { const b = F([[0.52, -0.11]])[0]; f.line([b, add(b, rot([d.s * 0.24, 0], SA(0.3)))], 1.6, '#3a2e1a'); for (let k = 0; k < 4; k++) { const q = add(b, rot([d.s * (0.06 + k * 0.05), 0], SA(0.3))), aa = d.a + (k % 2 ? 1 : -1) * 0.9; f.part([q, add(q, rot([5, -3], aa)), add(q, rot([11, 0], aa)), add(q, rot([5, 3], aa))], X.GL(f, { maxShade: 1, cast: false, inkW: 0.8, inkHeavy: 0.8 })); } }
    }
    wing(W[0][0], W[0][1], W[0][2], false); // the near wing, over the body
  };
  // loose feathers falling behind the flock, turning as they fall; a few charred
  f.bone('flock');
  for (let k = 0; k < 9; k++) { const q = [R(f, 80, 300), R(f, 440, 660)], a = R(f, -2, 2); X.feather(f, q, a, R(f, 14, 26), R(f, 4, 6), FW({ inkW: 0.8, inkHeavy: 1 }), { lead: 0.45, round: true, dark: k % 3 === 0 ? 0.5 : 0.2, darkCol: '#24160c', darkOp: 0.85, splits: false }); }
  // draw back to front: the smaller and farther birds first
  doves.map((d, i) => [d, i]).sort((p, q) => p[0].s - q[0].s).forEach(([d, i]) => dove(d, i));
  X.leafDrift(f, [300, 560], 160, 80, 5);
  f.bone('root');
  f.flat(ell([310, gy + 2], 150, 6, 0, 16), '#000', { op: 0.15 });
  return X.toneGold(f);
}

// ------------------------------------------------------------------ THRONE LION (cast, large 1.3)
// Twelve lions stood on the steps of the throne. The steps fell. The lions did not. One of the gilded stone lions from
// the steps of the Mother's seat, standing four-square on the broken step it was set into, head low, the near forepaw
// raised off its iron pin; the weight on the three planted feet. A heavy heraldic lion (not a hound: a short deep body,
// massive forearms and paws, a great carved mane of stiff curls over the neck and shoulders down to the elbows, the head
// carried low inside the ruff). Its hindquarters have broken off at the loin and stand a hand's width behind the body,
// the break faces black void with the stone shell round them; violet burns branch over the shoulders and across both
// break faces (on the stone only: whatever holds the halves together is an engine effect, never drawn in the air).
// Gold leaf cracked over black throughout, laid in plates and modelled. A carved collar, cracked; a chipped ear; the
// tail's end gone; the iron pin and lead fixing left standing in the step under the raised paw; an inscription on the
// step's edge. A carved heraldic face: mouth open, teeth chipped, blank stone eyes.
// Rig: spine_1 (forequarters, root) > neck > head > jaw; leg_fn_1..3, leg_ff_1..3 (spine_1); haunch (spine_1, the
// floating hindquarters) > leg_hn_1..3, leg_hf_1..3, tail; step (static). Motion: idle a grinding drift of the haunch
// (haunch turns and shifts a little); attack a pounce (spine_1 forward, the haunch slams into the break).
function throneLion() {
  const CW = 1300, CH = TIERS.large[1], seed = 1528;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY, sT = gy - 110; // the step's top
  const GF = P.gold, ST = (o = {}) => X.GILT(f, Object.assign({ maxShade: 26 }, o));
  const groove = (pts, w = 3, op = 0.65) => X.crease(f, pts, w, { col: P.blackD, lit: '#ecd496', op });
  const LEG = {
    fn: { H: [880, 640], K: [820, 782], A: [902, 768], T: [1000, 820] },     // near fore, raised off its pin
    ff: { H: [920, 630], K: [866, 796], A: [884, 904], T: [914, sT] },       // far fore, planted
    hn: { H: [384, 600], K: [446, 770], A: [334, 872], T: [366, sT] },       // near hind
    hf: { H: [404, 590], K: [466, 754], A: [376, 862], T: [408, sT - 4] },   // far hind
  };
  const HC = [1060, 636], hA = 0.3, HS = 300, HF = frame(HC, hA, HS);
  f.joint('spine_1', [740, 620]).joint('neck', [900, 540], 'spine_1').joint('head', HF([[-0.38, 0.0]])[0], 'neck').joint('jaw', HF([[-0.16, 0.1]])[0], 'head').joint('haunch', [400, 600], 'spine_1').joint('tail', [250, 520], 'haunch').joint('step', [680, sT]);
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_1' : 'haunch'; f.joint(`leg_${k}_1`, L.H, par).joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }
  // a break face: the stone shell's thickness round a hollow of void, its lip catching the light, burns on the stone
  const breakFace = (pts, o = {}) => { f.part(pts, { fill: '#3a3440', shadow: '#0c0a10', light: '#6a6270', shade: 0.35, tex: 'chisel' + seed, texOp: 0.8, inkW: 1.6, inkHeavy: 2.4, cast: false, maxShade: 6 }); const c = E.bbox(pts), cc = [(c[0] + c[2]) / 2, (c[1] + c[3]) / 2]; const inner = pts.map(q => add(cc, mul(sub(q, cc), 0.72))); f.flat(inner, P.void); f.line(inner.slice(0, Math.ceil(inner.length / 2)), 1.6, P.vio, { op: 0.8 }); X.clipDraw(f, E.smooth(pts), () => X.burn(f, cc, o.a ?? -1.6, o.len ?? 120, 2, { depth: 3, haloOp: 0.4, scorch: '#0a0610' })); return inner; };

  // ---- the step: a block of gilded marble broken at both ends, its top seen a little from above, an inscription cut
  // in its edge, cracks, the lead fixing and the iron pin where the raised paw stood
  f.bone('step');
  { const top = [[150, sT - 22], [420, sT - 26], [760, sT - 24], [1180, sT - 20], [1210, sT - 6], [1196, sT + 2], [130, sT + 2]], face = [[130, sT], [1196, sT], [1222, sT + 30, 1], [1204, sT + 62], [1226, gy - 2, 1], [104, gy - 2, 1], [120, sT + 70], [96, sT + 40, 1]];
    X.gilt(f, face, { look: { fill: mix(GF, '#000', 0.2) }, sz: 110, cell: 70, s: 1, chips: 5, open: 0.12, dark: 0.35 });
    X.clipDraw(f, E.smooth(face), () => {
      X.softTone(f, E.smooth(face), [[[[90, gy - 40], [1230, gy - 40], [1230, gy + 10], [90, gy + 10]], P.blackD, 0.5, 14]]);
      f.flat([[300, sT + 30], [1000, sT + 30], [1000, sT + 76], [300, sT + 76]], P.blackD, { op: 0.55 }); f.line([[300, sT + 30], [1000, sT + 30]], 2, P.goldW, { op: 0.6 }); f.line([[300, sT + 76], [1000, sT + 76]], 2, P.goldW, { op: 0.35 });
      for (let x = 316; x < 990; x += 26) { const g = Math.floor(f.r() * 5), y0 = sT + 38, y1 = sT + 68; const L = [[[x, y0], [x, y1]], [[x, y0], [x + 14, y0], [x + 14, y1]], [[x, y1], [x + 7, y0], [x + 14, y1]], [[x, y0], [x + 12, y0 + 8], [x, y0 + 16], [x + 12, y1]], [[x, y0], [x + 14, y1]]][g]; f.line(L, 4, P.blackD); f.line(L.map(q => add(q, [-1, -1])), 1.6, P.goldL, { op: 0.8 }); if (g === 0) f.line([[x + 6, y0 + 15], [x + 12, y0 + 15]], 3, P.blackD); }
      X.crackV(f, [620, sT + 2], 1.7, 90, 6, { depth: 2, dark: P.goldS }); X.crackV(f, [180, sT + 10], 1.2, 70, 5, { depth: 1, dark: P.goldS });
      X.burn(f, [940, sT + 8], 1.5, 90, 2.4, { depth: 2 });
    });
    X.gilt(f, top, { look: { fill: mix(GF, '#fff', 0.12) }, sz: 26, cell: 50, s: 0.8, chips: 2, open: 0.1, dark: 0.3, lite: 0.4 });
    X.softTone(f, E.smooth(top), [[[[300, sT - 30], [1000, sT - 30], [1000, sT + 4], [300, sT + 4]], '#0a0604', 0.35, 10]]); // the lion's own shadow on the step
    f.line([[130, sT + 1], [1196, sT + 1]], 2.4, P.goldW, { op: 0.6 }); // the worn front arris
    for (const [x0, w] of [[96, 1], [1222, -1]]) { const br = [[x0, sT - 2], [x0 + w * 26, sT + 18], [x0 + w * 6, sT + 46], [x0 + w * 30, sT + 74], [x0 + w * 10, gy - 4]]; f.line(br, 3.4, P.blackD); f.line(br.map(q => add(q, [w * 4, 0])), 1.6, P.goldW, { op: 0.5 }); }
    const pin = [964, sT - 12]; f.part(ell(pin, 22, 6, 0, 14), X.GR(f, { fill: '#6a6870', light: '#a8a6ae', maxShade: 2, cast: false })); f.flat(ell(pin, 10, 3, 0, 10), P.blackD);
    f.line([pin, add(pin, [2, -30]), add(pin, [12, -46])], 8, INK); f.line([pin, add(pin, [2, -30]), add(pin, [12, -46])], 5.4, P.iron); f.line([add(pin, [-1, -4]), add(pin, [1, -28])], 1.4, P.ironL, { op: 0.7 }); f.flat(ell(add(pin, [12, -46]), 4, 3, 0.5, 8), P.rust);
    for (const x of [560, 760]) { f.part(ell([x, sT - 14], 18, 5, 0, 12), X.GR(f, { fill: '#5a5860', maxShade: 2, cast: false })); f.flat(ell([x, sT - 14], 7, 2.4, 0, 8), P.blackD); }
  }
  // one leg, in muscled segments that overlap at the joints (Magma Hound / Plague Wolf habits), gilt and modelled; the
  // planted paws carry the weight on knuckled toes, the raised one hangs from the bent wrist with its pad turned back
  const leg = (k, far, part = 7, only) => {
    const L = LEG[k], front = k[0] === 'f', fill = mix(GF, '#000', far ? 0.28 : 0), look = { fill };
    if (part & 3) {
      const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]];
      if (front) X.lionLimb(f, L.H, L.K, L.A, [150, 96, 66], [`leg_${k}_1`, `leg_${k}_2`], { look, only, clip1: only === 1 ? E.smooth(limb(lerp(L.K, L.A, -0.2), lerp(L.K, L.A, 1.15), 130, 100)) : null, point: 0.42, mus0: 0.26, mus0At: 0.55, mus1: 0.3, extra: () => {
        groove([lp(L.H, L.K, 0.2, -30), lp(L.H, L.K, 0.6, -24), lp(L.H, L.K, 0.85, -10)], 3, 0.5); // the triceps' edge
        groove([lp(L.K, L.A, 0.12, -6), lp(L.K, L.A, 0.5, 4), lp(L.K, L.A, 0.88, 2)], 2.6, 0.5); // flexors from extensors
        f.line([lp(L.K, L.A, 0.15, -30), lp(L.K, L.A, 0.6, -26)], 2, '#e8c46e', { op: 0.35 }); } });
      else X.lionLimb(f, L.H, L.K, L.A, [156, 96, 58], [`leg_${k}_1`, `leg_${k}_2`], { look, only, point: 0.36, mus0: 0.18, mus1: 0.36, extra: () => {
        groove([lp(L.H, L.K, 0.15, -10), lp(L.H, L.K, 0.55, 14), lp(L.H, L.K, 0.85, 20)], 3.2, 0.55); // quadriceps from hamstrings
        X.gilt(f, [add(L.A, mul(nk, 10)), add(add(L.A, mul(nk, 36)), mul(dk, -16)), add(add(L.A, mul(nk, 34)), mul(dk, 12)), add(L.A, mul(dk, 22))], { look: { fill: mix(fill, '#000', 0.08) }, sz: 28, chips: 0, cell: 40, s: 0.4 }); // the point of the hock
        f.line([lp(L.K, L.A, 0.35, 26), lp(L.K, L.A, 0.95, 14)], 2.6, P.blackD, { op: 0.5 }); f.line([lp(L.K, L.A, 0.35, 22), lp(L.K, L.A, 0.95, 10)], 1.4, '#e8c46e', { op: 0.45 }); } }); // the hamstring's tendon to the hock
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      if (k !== 'fn') {
        const pt = [L.T[0] - 30, L.T[1] - 46];
        X.muscle(f, [lerp(L.A, pt, -0.12), L.A, pt], [58, 56, 64], { look, chips: 0 }); // the pastern, sloped to the paw
        X.lionPaw(f, [L.T[0] + 12, L.T[1]], 118, { look, claws: 'tip', carpal: front });
      } else { // the raised paw: the wrist bent, the paw hanging, its pad turned back with the socket where the pin was
        const U = [Math.cos(1.05), Math.sin(1.05)], V = [Math.cos(1.05 + Math.PI / 2), Math.sin(1.05 + Math.PI / 2)];
        X.muscle(f, [lerp(L.A, add(L.A, mul(U, 50)), -0.3), L.A, add(L.A, mul(U, 44))], [62, 60, 64], { look, chips: 0 });
        X.onPlane(f, add(L.A, mul(U, 78)), U, V, () => { X.lionPaw(f, [0, 0], 118, { look, claws: 'tip' });
          f.part(ell([0, 8], 40, 11, 0, 14), ST({ fill: mix(fill, '#000', 0.45), maxShade: 3, cast: false, inkW: 1.4 })); f.flat(ell([4, 8], 8, 4, 0, 10), P.void); f.line(ell([4, 8], 12, 6, 0, 12).concat([ell([4, 8], 12, 6, 0, 12)[0]]), 1.8, '#8a8890'); }); // the pad and the pin's socket, lead round it
      }
    }
  };

  // ---- far legs behind, the tail, the haunch (its far hind leg first)
  leg('hf', true); leg('ff', true);
  f.bone('tail');
  { const tl = X.spline([[262, 520], [214, 560], [190, 650], [200, 740], [222, 790]], 6); const tk = tl.filter((_, i) => i % 3 === 0).concat([tl[tl.length - 1]]);
    X.gilt(f, K.chain(tk, tk.map((_, i, a) => 46 - i * 18 / a.length)), { sz: 38, cell: 30, s: 0.5, chips: 1 });
    for (let i = 2; i < tk.length - 1; i += 2) groove([lp(tk[i - 1], tk[i], 0.5, -14), lp(tk[i - 1], tk[i], 0.6, 0), lp(tk[i - 1], tk[i], 0.5, 14)], 2, 0.4); // carved rings
    const e = tl[tl.length - 1], d = E.norm(sub(e, tl[tl.length - 3])); f.part(ell(e, 15, 20, Math.atan2(d[1], d[0]) + Math.PI / 2, 12), { fill: '#3a3440', shade: 0.3, inkW: 1.4, cast: false, tex: 'chisel' + seed, texOp: 0.6 }); f.flat(ell(e, 10, 14, Math.atan2(d[1], d[0]) + Math.PI / 2, 12), P.void); X.shards(f, add(e, mul(d, 12)), Math.atan2(d[1], d[0]), 3, 0.7); } // the end gone, a clean break
  // ---- the hindquarters (haunch bone): the croup, the round haunch, the flank's back; broken at the loin
  f.bone('haunch');
  leg('hn', false, 3);
  const hq = [[500, 486, 1], [430, 468], [350, 466], [272, 490], [234, 556], [238, 640], [262, 708], [300, 756], [352, 786], [412, 792], [458, 772], [472, 724], [486, 690, 1], [470, 640, 1], [492, 590, 1], [478, 540, 1]];
  X.gilt(f, hq, { sz: 220, cell: 56, s: 0.9, chips: 4, dark: 0.55 });
  X.clipDraw(f, E.smooth(hq), () => { groove([[452, 600], [446, 680], [440, 740], [416, 784]], 3.4, 0.55); groove([[300, 690], [340, 740], [380, 774]], 3, 0.45); X.gilt(f, [[448, 488], [478, 476], [500, 496], [486, 524], [458, 520]], { sz: 40, chips: 0, cell: 40, s: 0.4, lite: 0.45 }); /* the point of the hip under the leaf */ groove([[290, 486], [312, 540], [330, 600]], 3, 0.45); groove([[420, 476], [452, 520], [470, 560]], 3, 0.45); X.burn(f, [470, 520], 2.8, 130, 2.4, { depth: 3 }); X.crackV(f, [300, 640], 0.4, 60, 4, { depth: 1, dark: P.goldS }); });
  breakFace([[500, 486], [522, 520], [508, 560], [528, 610], [510, 650], [520, 690], [486, 700], [470, 640], [492, 590], [478, 540]], { a: -1.8, len: 140 });
  leg('hn', false, 4);
  // ---- the forequarters (spine_1): the ribcage's barrel, the deep chest, the waist drawn in to the break at the loin
  f.bone('spine_1');
  const body = [[548, 496, 1], [620, 476], [700, 456], [800, 418], [880, 452], [940, 540], [962, 640], [944, 740], [886, 792], [800, 800], [720, 770], [650, 734], [590, 712], [570, 706, 1], [586, 650, 1], [560, 600, 1], [578, 548, 1]];
  X.gilt(f, body, { sz: 300, cell: 60, s: 1, chips: 4, dark: 0.55 });
  X.clipDraw(f, E.smooth(body), () => {
    // the ribcage swelling under the leaf: curved ribs, lit on their tops, shadowed in the intercostal grooves; the flank
    // drawn in behind them toward the loin; the belly line tucked up
    for (let i = 0; i < 6; i++) { const x0 = 640 + i * 38; groove([[x0, 540 + i * 6], [x0 + 14, 620], [x0 + 8, 700 - i * 4], [x0 - 6, 744 - i * 6]], 3, 0.45); f.line([[x0 + 8, 548 + i * 6], [x0 + 22, 624], [x0 + 16, 700 - i * 4]], 1.6, '#ecd496', { op: 0.3 }); }
    X.softTone(f, E.smooth(body), [[[[560, 600], [640, 560], [650, 760], [560, 720]], '#0a0604', 0.4, 22], [[[560, 760], [960, 780], [900, 830], [560, 800]], '#0a0604', 0.55, 18]]);
    X.crackV(f, [700, 700], -0.6, 80, 5, { depth: 2, dark: P.goldS });
    X.burn(f, [840, 560], 2.2, 160, 2.6, { depth: 3 });
  });
  breakFace([[548, 496], [572, 520], [556, 556], [580, 600], [560, 650], [586, 690], [570, 706], [540, 700], [530, 650], [548, 600], [532, 550]], { a: 1.4, len: 140 });
  // ---- the mane: carved locks in layers over the neck and shoulders to the elbows, each a tongue of hair ending in a
  // stiff curl (bible: "the carved mane in stiff curls"), the outer rows first so the rows nearer the face lap them;
  // burns branch across it from the shoulders
  f.bone('neck');
  leg('fn', false, 3);
  const MC = [990, 630];
  const maneR = [[1030, 410], [930, 384], [830, 400], [756, 450], [722, 540], [724, 650], [756, 740], [812, 792], [890, 812], [970, 806], [1040, 776], [1090, 720], [1080, 560], [1090, 450]];
  X.castOn(f, maneR, 24, 0.5, body);
  const mane = X.maneFill(f, HF([[0.0, -0.05]])[0], maneR, { step: 50, len: 124, w: 76, fill: GF, droop: 0.5 });
  X.clipDraw(f, E.smooth(maneR), () => { X.burn(f, [790, 520], 0.4, 200, 2.8, { depth: 3 }); X.burn(f, [760, 700], -0.4, 160, 2.4, { depth: 3 }); });
  // the carved collar round the throat under the mane's front, cracked through, rivets
  { const cl = [HF([[-0.2, 0.42]])[0], HF([[0.12, 0.54]])[0], HF([[0.3, 0.6]])[0], HF([[0.28, 0.7]])[0], HF([[0.08, 0.66]])[0], HF([[-0.24, 0.54]])[0]];
    X.gilt(f, cl, { look: { fill: mix(GF, '#000', 0.25) }, sz: 34, cell: 22, s: 0.4, chips: 1, lite: 0.4 });
    for (let i = 0; i < 4; i++) f.rivet(lerp(HF([[-0.16, 0.5]])[0], HF([[0.24, 0.64]])[0], i / 3), 4, '#a8822e');
    X.vcrack(f, [HF([[0.06, 0.55]])[0], HF([[0.1, 0.6]])[0], HF([[0.08, 0.66]])[0]], 6, { dark: P.goldS }); }
  // ---- the head, low inside the ruff: a stern carved heraldic face, short-muzzled, mouth open, teeth chipped, blank
  // stone eyes, the ear chipped
  X.lionHead(f, HC, HS, hA, { open: 0.5, eye: 'blank', chip: true, earChip: true, fill: mix(GF, '#fff', 0.02), jaw: 'jaw', head: 'head' });
  f.bone('head');
  X.clipDraw(f, E.smooth(HF([[-0.52, -0.1], [-0.44, -0.36], [-0.2, -0.5], [0.04, -0.52], [0.2, -0.42], [0.1, 0.0], [-0.4, 0.1]])), () => X.burn(f, HF([[-0.3, -0.38]])[0], hA + 0.3, 110, 2, { depth: 2, haloOp: 0.3 }));
  X.crackV(f, HF([[0.34, 0.08]])[0], hA + 2.2, 40, 3, { depth: 1, dark: P.goldS });
  // the ruff's last row, short locks framing the face's back edge
  for (let i = 0; i < 6; i++) { const t = i / 5, root = HF([[-0.46 + Math.sin(t * Math.PI) * 0.04, -0.38 + t * 0.7]])[0]; X.maneLock(f, root, Math.PI + hA - 0.45 + t * 0.9, 84, 58, { fill: mix(GF, '#000', 0.04), curl: i % 2 ? 1 : -1, bend: 0.3 }); }
  // ---- the near foreleg over the body and the mane's lower edge: the forearm raised, the paw hanging
  { const L = LEG.fn; f.bone('leg_fn_2'); X.muscle(f, [lerp(L.K, L.A, -0.12), lerp(L.K, L.A, 0.4), L.A], [100, 92, 64], { look: { fill: GF }, bp: [[0, 0.5, 0.14, 0.3]], bq: [[1, 0.3, 0.08, 0.3]] }); groove([lp(L.K, L.A, 0.1, 6), lp(L.K, L.A, 0.5, -4), lp(L.K, L.A, 0.9, -2)], 2.6, 0.5); } // the raised forearm over the mane's edge: flexors under, extensors on top
  leg('fn', false, 4);
  f.bone('root');
  X.leafDrift(f, [520, 600], 60, 160, 9, 1.4); // leaf drifting in the gap between the halves
  f.flat(ell([680, gy + 2], 560, 10, 0, 20), '#000', { op: 0.35 });
  return X.toneGold(f);
}

// ------------------------------------------------------------------ RIFT CRAWLER (cast, large 1.6 long)
// It came in through a tear and has been eating the floor of heaven ever since. Heaven is mostly floor. Something from
// outside: a low segmented body on eight thick jointed legs, splayed and planted, the front segment reared. Each segment
// is a broad plate of black void-stuff with a violet-burnt margin (the lightning scorched it coming through), scored and
// chipped; between the plates the soft joints split and show what it has eaten inside it: chunks of gilded floor tile.
// Rows of eyes along its back, lidded in the plate. A blunt head with no face: a cluster of eyes and side-opening
// mandibles crusted with flakes of the gold leaf it eats, a tooth-marked shard of floor in them. A broken halo caught
// round one leg; a strip of banner dragged under it; gold dust on the leg tips; one leg shorter, healed crooked.
// Rig: body (root) > seg_b1 > seg_b2 (tail); body > seg_f1 > seg_f2 > head > mandible_n, mandible_f; one bone per near
// leg (leg_1..leg_4, parent its segment); far legs ride their segments. Motion: idle the legs testing the edges of things
// (leg bones twitch); attack a rearing lunge and a bite (seg_f1, seg_f2 up, head forward, mandibles close).
function riftCrawler() {
  const CW = 1250, CH = TIERS.large[1], seed = 1529;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY;
  const PL = (o = {}) => Object.assign({ fill: '#221e2a', shadow: '#060508', light: '#4a4458', shade: 0.42, tex: 'craze' + seed, texOp: 0.45, maxShade: 18 }, o);
  const ctrl = [[110, 884], [260, 872], [420, 864], [580, 856], [700, 838], [792, 796], [852, 736]];
  const C = X.spline(ctrl, 3), S = X.arcLen(C), Lt = S[S.length - 1];
  const AT = u => { const s0 = Math.max(0, Math.min(1, u)) * Lt; let i = 1; while (i < S.length - 1 && S[i] < s0) i++; const t = (s0 - S[i - 1]) / ((S[i] - S[i - 1]) || 1), p = lerp(C[i - 1], C[i], t), d = E.norm(sub(C[i], C[i - 1])); return { p, d, n: [-d[1], d[0]] }; };
  const wOf = u => u < 0.18 ? 22 + 34 * Math.pow(u / 0.18, 0.7) : u > 0.9 ? 56 - (u - 0.9) * 60 : 56 + Math.sin(u * 9) * 3;
  const sideP = (u, k) => { const a = AT(u); return add(a.p, mul(a.n, (k + 1) * wOf(u))); }; // k: -1 the far margin (top), +1 the belly
  const NS = 7, segU = i => [i / NS, (i + 1) / NS];
  const BR = [['seg_b2', 0, 2 / 7, 'seg_b1'], ['seg_b1', 2 / 7, 3 / 7, 'body'], ['body', 3 / 7, 5 / 7, null], ['seg_f1', 5 / 7, 6 / 7, 'body'], ['seg_f2', 6 / 7, 1.01, 'seg_f1']];
  const boneAt = u => BR.find(([, a, b]) => u >= a && u < b)[0];
  f.joint('body', AT(0.5).p);
  for (const [nm, a, b, par] of BR) if (par) f.joint(nm, AT(nm.startsWith('seg_b') ? b : a).p, par);
  const A1 = AT(1), hd = E.norm(add(A1.d, [1.4, 0.9])), hn = [-hd[1], hd[0]], neck = sideP(1, -0.1);
  const HP = (x, y) => add(add(neck, mul(hd, x)), mul(hn, y)); // x forward along the head, y toward the belly side
  f.joint('head', neck, 'seg_f2').joint('mandible_n', HP(70, 40), 'head').joint('mandible_f', HP(64, 26), 'head');
  // legs: [segment u, near?]. Each leg: hip, coxa end, knee (arching up and out), ankle, tip planted
  const LEGS = [[0.26, -0.8, 0], [0.42, -0.3, 0], [0.58, 0.25, 0], [0.73, 0.8, 1]];
  const legGeo = (u, fan, far, short) => {
    const c0 = far ? sideP(u, -0.7) : sideP(u, 0.5);
    if (far) { const c1 = add(c0, [fan * 14, -8]), k = add(c1, [fan * 110 + 6, -86]), an = [k[0] + fan * 60 + 18, gy - 100], tip = [an[0] + fan * 18 + 12, gy - 64]; return [c0, c1, k, an, tip]; }
    const c1 = add(c0, [fan * 22, 26]), k = add(c1, [fan * 130 + 26, -30]), an = [k[0] + fan * 70 + 34, gy - 50 - (short ? 30 : 0)], tip = [an[0] + fan * 22 + 18, gy - 3];
    return [c0, c1, k, an, tip];
  };
  const LG = (o = {}) => PL(Object.assign({ inkW: 1.4, inkHeavy: 2.2, cast: false, k: 0.85 }, o));
  const lseg = (a, b, wa, wb, look, last) => {
    const sh = limb(a, b, wa, wb, { steps: 8, capK: 0.5, p: [[0.4, 0.16, 0.25]], q: [[0.3, 0.06, 0.2]] });
    f.part(sh, look); f.line([lp(a, b, 0.12, wa * 0.24), lp(a, b, 0.8, wb * 0.26)], Math.max(1.2, wb * 0.14), P.vioD, { op: 0.8 }); // a violet-burnt ridge
    f.line([lp(a, b, 0.15, wa * 0.32), lp(a, b, 0.7, wb * 0.32)], 1, P.vioL, { op: 0.45 });
    if (!last) { f.part(ell(b, wb * 0.55, wb * 0.5, 0, 12), LG({ fill: '#3a3044', maxShade: 4 })); f.flat(ell(b, wb * 0.25, wb * 0.2, 0, 8), P.void); }
    return sh;
  };
  const leg = (Pts, ws, look, o = {}) => {
    const [c0, c1, k, an, tip] = Pts;
    f.part(ell(c0, ws * 0.8, ws * 0.62, ang(c1, c0), 12), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.25) }));
    lseg(c0, c1, ws * 1.15, ws * 1.0, look); const fem = lseg(c1, k, ws * 1.0, ws * 0.78, look); lseg(k, an, ws * 0.72, ws * 0.48, look);
    const d = E.norm(sub(tip, an)), nn = [-d[1], d[0]];
    f.part([add(an, mul(nn, ws * 0.26)), add(lerp(an, tip, 0.7), mul(nn, ws * 0.14)), [...tip, 1], add(lerp(an, tip, 0.7), mul(nn, -ws * 0.14)), add(an, mul(nn, -ws * 0.26))], Object.assign({}, look, { fill: '#100c14' }));
    for (let i = 0; i < 4; i++) f.flat(ell(add(tip, [R(f, -8, 8), -R(f, 2, 14)]), 2, 1.4, 0, 6), f.r() > 0.4 ? P.goldL : P.gold, { op: 0.9 }); // gold dust on the tip
    f.flat(ell(add(tip, [0, 2]), ws * 0.7, 3, 0, 8), '#000', { op: 0.45 });
    if (o.crooked) { const q = lerp(k, an, 0.45); f.part(ell(q, ws * 0.62, ws * 0.5, ang(k, an), 12), LG({ fill: '#2e2838' })); f.line([add(q, [-ws * 0.5, -3]), add(q, [ws * 0.5, 3])], 2, P.blackD); X.vcrack(f, [add(q, [-ws * 0.4, 4]), q, add(q, [ws * 0.4, -2])], 3, { dark: '#100c14', lip: '#6a6080' }); } // the old break, healed crooked in a knot
    if (o.halo) { const hc = lerp(c1, k, 0.5); X.crackedHalo(f, hc, ws * 1.6, ws * 0.7, ang(c1, k) + Math.PI / 2, 7, [0.2, 0.62], { drift: 4, lost: 0.4, burn: false }); }
    return fem;
  };

  // ---- far legs (their knees rise above the back), behind the body
  for (const [u, fan] of LEGS) { f.bone(boneAt(u)); leg(legGeo(u, fan, true, false), 28, LG({ fill: '#16121c' })); }
  // ---- the strip of banner it drags under it, out behind on the floor
  f.bone('body');
  { const b = [[560, gy - 10], [430, gy - 6], [300, gy - 2], [200, gy + 2], [150, gy], [170, gy - 14], [290, gy - 20], [430, gy - 22], [560, gy - 28]]; f.part(b, CLB(f, { fill: '#2a242c', maxShade: 4, cast: false })); f.line([[540, gy - 20], [200, gy - 6]], 1.6, '#c8a050', { op: 0.7, dash: '6 5' }); X.charEdge(f, [[200, gy + 2], [150, gy], [170, gy - 14]], 4, { gap: 6 }); X.burnHole(f, [340, gy - 12], 6, 0.2); }
  // ---- the body: tail to head. Each plate: a broad top (black void-stuff, the burnt violet margin, scored and chipped,
  // eyes along it) lapping the next; under the margin its rim; between the plates the split joint, gilded tile inside
  for (let i = 0; i < NS; i++) {
    const [u0, u1] = segU(i), um = (u0 + u1) / 2, ov = 0.25 / NS, st = 8, U = k => u0 - ov + (u1 - u0 + ov) * k / st;
    f.bone(boneAt(um));
    // the split joint: black, and in it chunks of gilded floor tile it has eaten
    { const jt = [sideP(u0 - ov, -0.95), sideP(u0 + ov * 0.6, -0.95), sideP(u0 + ov * 0.6, 0.9), sideP(u0 - ov, 0.9)]; f.flat(jt, P.void);
      for (let q = 0; q < 3; q++) { const c = sideP(u0 + R(f, -0.6, 0.4) * ov, R(f, -0.7, 0.6)); X.chip(f, c, R(f, 7, 12), X.GL(f, { maxShade: 3 }), { k: 0.6 }); } }
    // under-rim: soft pleated membrane, dark violet
    const pl = []; for (let k = 0; k <= st; k++) pl.push(sideP(U(k), 0.25)); for (let k = st; k >= 0; k--) pl.push(sideP(U(k), 0.95));
    f.part(pl, PL({ fill: '#2a2034', light: '#4a3a5a', tex: 'wrinkle' + seed, texOp: 0.6, maxShade: 8 }));
    for (let k = 1; k < 4; k++) f.line([sideP(U(k * 2), 0.3), sideP(U(k * 2), 0.9)], 1.4, '#0c0810', { op: 0.6 });
    const rim = []; for (let k = 0; k <= st; k++) rim.push(sideP(U(k), -0.06)); for (let k = st; k >= 0; k--) rim.push(sideP(U(k), 0.32));
    f.part(rim, PL({ fill: '#1a1620', maxShade: 6 }));
    const top = []; for (let k = 0; k <= st; k++) top.push(sideP(U(k), -1 + 0.04 * Math.sin(k))); top.push(sideP(u1 + 0.05 / NS, -0.5)); for (let k = st; k >= 0; k--) top.push(sideP(U(k), -0.06));
    top.push([...sideP(u0 - ov * 1.3, -0.5), 1]);
    f.part(top, PL({ castOp: 0.55 }));
    X.clipDraw(f, E.smooth(top), () => {
      X.softTone(f, E.smooth(top), [[[sideP(u0, -1.1), sideP(u1, -1.1), sideP(u1, -0.7), sideP(u0, -0.7)], '#5a4e6a', 0.45, 6]]); // the lit crown of the plate
      f.line([sideP(u0 + 0.12 / NS, -1), sideP(u0 + 0.12 / NS, -0.06)], 3, P.vioD, { op: 0.9 }); f.line([sideP(u0 + 0.12 / NS, -1), sideP(u0 + 0.12 / NS, -0.06)], 1.2, P.vioL, { op: 0.8 }); // the burnt violet margin
      X.burn(f, sideP(u0 + 0.14 / NS, -0.5), AT(um).d[0] > 0 ? Math.atan2(AT(um).d[1], AT(um).d[0]) : 0, (u1 - u0) * Lt * 0.6, 1.6, { depth: 2, haloOp: 0.3 });
      f.scratches(sideP(um, -0.5), 30, 4, '#8a7a9a', 0.9, Math.atan2(AT(um).d[1], AT(um).d[0]) + 0.3);
      if (i % 2) X.chip(f, sideP(u1 - 0.1 / NS, -0.9), 9, PL({ fill: '#3a3248' }));
      // eyes along the back, in a row on the crown of the plate (not on the tail tip)
      if (i > 0 && i < NS - 1) for (let e = 0; e < 3; e++) { const c = sideP(u0 + (0.3 + e * 0.26) / NS, -0.72 + (e % 2) * 0.1), sz = R(f, 6, 10) * (i === 3 ? 1.2 : 1); X.eye(f, c, sz, Math.atan2(AT(um).d[1], AT(um).d[0]), { lid: PL({ fill: '#2a2434' }), open: R(f, 0.3, 0.8), gaze: [0.6, -0.2], iris: P.vio, mass: false, inkW: 0.9 }); }
    });
    f.line([sideP(u0 - ov * 0.6, -0.08), sideP(um, -0.07), sideP(u1, -0.08)], 2.2, '#6a5c80', { op: 0.75 }); // the near margin worn pale
    f.line([sideP(u0, 0.3), sideP(u1, 0.3)], 1.4, P.vioD, { op: 0.7 });
  }
  // ---- the head: blunt, no face, a cluster of eyes; side-opening mandibles crusted with gold leaf, a floor shard in them
  f.bone('mandible_f');
  const mand = (base, sg, dim) => { const pts = [HP(base[0], base[1] - 18 * sg), HP(base[0] + 70, base[1] - 8 * sg), HP(base[0] + 130, base[1] + 10 * sg), HP(base[0] + 150, base[1] + 34 * sg), HP(base[0] + 128, base[1] + 28 * sg), HP(base[0] + 74, base[1] + 20 * sg), HP(base[0], base[1] + 20 * sg)]; f.part(pts, PL({ fill: mix('#2a2434', '#000', dim), maxShade: 8 })); for (let k = 0; k < 4; k++) { const q = HP(base[0] + 40 + k * 16, base[1] + 4 * sg); f.part([q, add(q, mul(hn, 8 * sg)), add(q, mul(hd, 6))].map(z => [...z, 1]), PL({ fill: '#3a3248', maxShade: 2 })); } X.leafFlakes(f, HP(base[0] + 50, base[1]), 26, 8, 7, 0.9); f.line([HP(base[0] + 10, base[1] - 6 * sg), HP(base[0] + 90, base[1] + 8 * sg)], 1.4, P.vioL, { op: 0.6 }); return pts; };
  mand([56, 20], 1, 0.25);
  f.bone('head');
  const head = [HP(-16, -60), HP(30, -66), HP(70, -50), HP(92, -14), HP(90, 30), HP(66, 58), HP(20, 66), HP(-20, 54)];
  f.part(head, PL({ maxShade: 24 }));
  X.clipDraw(f, E.smooth(head), () => {
    X.softTone(f, E.smooth(head), [[[HP(-20, -70), HP(60, -70), HP(40, -40), HP(-20, -40)], '#5a4e6a', 0.4, 8]]);
    X.burn(f, HP(-10, -40), Math.atan2(hd[1], hd[0]) - 0.3, 70, 1.8, { depth: 2, haloOp: 0.3 });
    const cl = [[52, -20, 13], [70, 0, 10], [40, 6, 11], [66, 24, 8], [30, -36, 8], [46, 30, 7], [78, -24, 6], [22, 22, 6]];
    for (const [x, y, sz] of cl) X.eye(f, HP(x, y), sz, Math.atan2(hd[1], hd[0]), { lid: PL({ fill: '#2a2434' }), open: R(f, 0.5, 0.85), gaze: [0.7, 0.1], iris: P.vio, mass: true, inkW: 1 });
  });
  // the floor shard held across the mandibles, tooth-marked
  { const sc = HP(150, 30), sd = rot(hd, 0.9), sn = [-sd[1], sd[0]]; const sh = [add(sc, mul(sd, -46)), add(add(sc, mul(sd, -20)), mul(sn, -20)), add(add(sc, mul(sd, 40)), mul(sn, -16)), add(sc, mul(sd, 52)), add(add(sc, mul(sd, 30)), mul(sn, 18)), add(add(sc, mul(sd, -30)), mul(sn, 14))].map(q => [...q, 1]);
    f.part(sh, X.GILT(f, { maxShade: 6 })); X.leaf(f, sh, { cell: 24, s: 0.4, chips: 1, burnish: false }); f.flat([sh[3], sh[4], add(sc, mul(sd, 10)), add(sc, mul(sd, 30))].map(q => [...q, 1]), '#7a7880', { op: 0.6 }); // the tile's grey body at its broken edge
    for (let k = 0; k < 4; k++) f.flat(ell(add(add(sc, mul(sd, -10 + k * 12)), mul(sn, -14)), 3, 4, 0, 8), P.blackD); } // tooth marks
  f.bone('mandible_n');
  mand([62, 34], -1, 0);
  // ---- near legs, in front
  LEGS.forEach(([u, fan, crooked], i) => { f.bone('leg_' + (i + 1)); leg(legGeo(u, fan, false, !!crooked), 36, LG(), { crooked: !!crooked, halo: i === 1 }); });
  LEGS.forEach(([u], i) => f.joint('leg_' + (i + 1), sideP(u, 0.55), boneAt(u)));
  f.bone('root');
  f.flat(ell([560, gy + 2], 460, 10, 0, 20), '#000', { op: 0.35 });
  X.leafDrift(f, [960, 760], 100, 120, 7);
  return X.toneGold(f);
}

// ------------------------------------------------------------------ THE RECORDING ANGEL (elite 2.2)
// It wrote down every soul. It has started crossing them out. The angel who kept the Mother's book of names: tall, thin,
// stooped from the upper back over the huge open book held against its chest on a strap, the head bowed to the pages, a
// quill raised in the near hand for the next stroke, the wings folded; the weight on the back foot. The book is seen as
// we would see it from below (the covers' undersides, the page blocks' edges, the clasps hanging): its pages face the
// angel. Leaves torn loose lift out of it in the storm and show us the names, many struck through in red rubric, and
// among the names eyes have opened. The strike fused the writing hand to the quill (a weld of gold and flesh) and burnt
// violet branches over the face and down both hands; the face is cracked across like glazed clay, black in the cracks;
// hair standing from the strike. Long black robes edged with cracked gold leaf; a chain from the book's spine to the belt;
// an inkhorn of black horn with a burn-split rim; a pen-knife and a seal; a belt of wax tablets; one wing burnt to bare
// quills; a halo cracked into three pieces drifting apart; the strap across the chest worn through to its lining.
// Rig: standard humanoid + book (hand_f) > pages + quill (hand_n) + skirt (pelvis) + wing_n, wing_f (torso) + halo
// (head). Motion: idle writing, then a slow stroke through a name (forearm_n, hand_n, quill); attack striking a hero's
// name out (a hard downward stroke of the quill arm).
function recordingAngel() {
  const CW = 1200, CH = 1500, seed = 1522;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 220, gy = f.o.groundY;
  const N = [628, 400], C = [470, 470], Pv = [488, 790];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.26, 0.12), SF = S.at(0.34, 0.1);
  const HC = [744, 318], hA = 0.85, neck0 = S.at(0.16, -0.04);
  const EN = [630, 640], WN = [832, 486];
  const EF = [760, 700], WF = [930, 676];
  const HN = S.at(-0.18, 1.0), KN = [470, 1110], AN = [432, 1404];
  const HF = S.at(0.24, 1.0), KF = [610, 1100], AF = [668, 1400];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the book: its spine runs into depth (D); leaves L (against the chest) and R (out toward the party), seen from below
  const SP = [812, 740], LA = [666, 520], RA = [1010, 600], D = [150, -46];
  const qA = -0.82, qD = dir(qA), qT = add(WN, mul(qD, 330));
  f.joint('book', WF, 'hand_f').joint('pages', add(SP, [40, -120]), 'book').joint('quill', WN, 'hand_n').joint('skirt', S.at(0, 0.9), 'pelvis').joint('wing_f', S.at(-0.5, 0.06), 'torso').joint('wing_n', S.at(-0.7, 0.12), 'torso').joint('halo', add(HC, [-60, -110]), 'head');
  const SKG = (o = {}) => SKA(f, o);
  const ROBE = (o = {}) => CLB(f, Object.assign({ maxShade: 30, fill: '#2e2a34', light: '#56505e' }, o));
  const gEdge = (pts, w = 9) => { f.line(pts, w + 3, INK); f.line(pts, w, P.gold); f.line(pts.map(q => add(q, mul(f.L, 1.4))), 1.6, P.goldL, { op: 0.7 }); for (let i = 0; i < pts.length - 1; i++) for (const t of [0.25, 0.7]) f.line([lerp(pts[i], pts[i + 1], t), lerp(pts[i], pts[i + 1], t + 0.04)], w * 0.5, P.blackD, { op: 0.85 }); };

  // ---- the halo in three pieces drifting apart, behind the bowed head
  f.bone('halo');
  X.crackedHalo(f, add(HC, [-70, -110]), 130, 80, -0.5, 18, [0.12, 0.46, 0.78], { drift: 22, lost: 0.3, capW: 0.3 });
  // ---- the far wing, folded close down the back, intact (wing_f); the near wing burnt to bare quills over it (wing_n)
  f.bone('wing_f');
  { const r0 = S.at(-0.55, 0.0), tip = [330, 1280], d = E.norm(sub(tip, r0)), n = [-d[1], d[0]];
    for (let i = 8; i >= 0; i--) { const q = add(lerp(r0, tip, 0.22 + i * 0.012), mul(n, -40 + i * 7)); X.feather(f, q, ang(r0, tip) + 0.04 - i * 0.018, 640 + i * 20, 44, X.FE(f, { fill: mix(P.plume, '#000', 0.3 + (i % 3) * 0.05) }), { lead: 0.35, round: true, dark: 0.3, notch: i % 4 === 1 ? [0.55, 0.8] : [] }); }
    X.plumeMass(f, [add(r0, mul(n, 60)), add(r0, mul(n, -70)), add(lerp(r0, tip, 0.4), mul(n, -60)), ...X.featherHem([add(lerp(r0, tip, 0.4), mul(n, -60)), add(lerp(r0, tip, 0.45), mul(n, 0)), add(lerp(r0, tip, 0.5), mul(n, 50))], ang(r0, tip), 40, f)], ang(r0, tip), 36, X.FE(f, { fill: '#a8a298' }), { w: 1.2, op: 0.5 });
  }
  f.bone('wing_n');
  { const r0 = S.at(-0.72, 0.08), tip = [300, 1180], d = E.norm(sub(tip, r0)), n = [-d[1], d[0]];
    for (let i = 0; i < 11; i++) { const q = add(lerp(r0, tip, 0.12 + i * 0.03), mul(n, -30 + i * 6)), a = ang(r0, tip) + 0.1 - i * 0.03, L = R(f, 360, 640); const e = add(q, rot([L, 0], a)); f.line([q, e], 5.6, INK); f.line([q, e], 3.4, '#b8b0a2'); f.line([q, lerp(q, e, 0.9)], 1, '#e8e2d4', { op: 0.6 }); for (let k = 0; k < 5; k++) { const p = lerp(q, e, 0.3 + k * 0.13), l = R(f, 8, 18); f.line([p, add(p, rot([l, 0], a + (k % 2 ? 0.7 : -0.7)))], 1.6, '#1a1418'); } f.flat(ell(e, 3, 3, 0, 6), P.charS); } // bare burnt quills, barbs gone to black stubs
    X.burn(f, lerp(r0, tip, 0.2), ang(r0, tip), 200, 2.4, { depth: 2, halo: false, clip: [add(r0, mul(n, 40)), add(r0, mul(n, -60)), add(lerp(r0, tip, 0.8), mul(n, -40)), add(lerp(r0, tip, 0.8), mul(n, 40))] });
  }
  // ---- the far arm, forward under the book (its hand under the far leaf)
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 70, 56, SKG({ fill: mix('#d0c2a6', '#000', 0.2) }), '_f', { vein: false });
  f.bone('upperarm_f'); { const a0 = lp(SF, EF, -0.05, 0), a1 = lp(SF, EF, 1.05, 0); const sl = K.ragLimb(f, a0, a1, 104, 130, { teeth: 6, depth: 14 }); f.part(sl, ROBE({ fill: '#1e1a22' })); gEdge([lp(a0, a1, 0.98, 64), lp(a0, a1, 1.0, -64)], 7); }
  // ---- the robe: the back leg's fold under it, then the long skirt to the floor, the front foot's toes under the hem
  f.bone('foot_n');
  { const A = AN, s = 66, X0 = u => A[0] + u * s; f.part([[X0(-0.4), gy - 50], [X0(0.6), gy - 60], [X0(1.24), gy - 10], [X0(1.2), gy, 1], [X0(-0.36), gy, 1]], SKG({ fill: mix('#d0c2a6', '#000', 0.2), maxShade: 10 })); }
  f.bone('foot_f');
  { const A = AF, s = 66, X0 = u => A[0] + u * s; f.part([[X0(0.0), gy - 54], [X0(0.7), gy - 50], [X0(1.28), gy - 12], [X0(1.22), gy, 1], [X0(-0.1), gy, 1]], SKG({ maxShade: 10 })); for (let i = 0; i < 4; i++) { const tx = X0(0.86 + i * 0.1); f.line([[tx, gy - 30 + i * 4], [tx + 6, gy - 4]], 1.2, INK, { op: 0.6 }); } f.flat([[X0(1.08), gy - 26], [X0(1.2), gy - 16], [X0(1.18), gy - 8], [X0(1.08), gy - 14]], '#8a8070'); }
  f.bone('skirt');
  { const hem = X.charHem(f, S.at(-0.7, 3.2), S.at(1.0, 3.04), 9, 22, [0, 1]); const sk = [S.at(-0.6, 0.8), S.at(0.62, 0.78), S.at(0.86, 1.8), ...hem.slice().reverse(), S.at(-0.8, 1.9)];
    f.part(sk, ROBE());
    X.clipDraw(f, E.smooth(sk), () => {
      X.model(f, sk, { sz: 520, dark: 0.45, lite: 0.32, darkCol: '#000', litCol: '#8a8296', reflCol: '#4a4450', spec: 0 }); // the robe's own value range: lit toward the key light, turning into shade
      for (const [a0, a1, a2] of [[S.at(0.5, 1.1), S.at(0.0, 1.9), S.at(-0.5, 2.9)], [S.at(0.7, 1.6), S.at(0.3, 2.3), S.at(-0.1, 3.05)]]) X.fold2(f, E.smooth(sk), [a0, a1, a2], 18, { dark: '#000', darkOp: 0.7, light: '#7a7288', lit: '#9a92a8', col: '#040306', lightOp: 0.5 }); // drag folds toward the back foot that carries the weight
      for (const [u0, u1] of [[-0.4, -0.5], [-0.05, -0.1], [0.3, 0.5], [0.62, 0.86]]) X.fold2(f, E.smooth(sk), [S.at(u0, 1.0), S.at((u0 + u1) / 2, 2.0), S.at(u1, 3.1)], 24, { dark: '#000', darkOp: 0.7, light: '#6a6278', lit: '#8a8296', col: '#040306', lightOp: 0.45 });
      { const ln = [S.at(0.62, 1.3), S.at(0.74, 1.9), S.at(0.88, 2.5), S.at(1.0, 3.04), S.at(0.7, 3.1), S.at(0.56, 2.5), S.at(0.5, 1.9)]; f.part(ln, X.GR(f, { fill: '#5e5866', light: '#9a94a2', maxShade: 20, cast: false, tex: 'weave' + seed, texOp: 0.4 })); X.fold2(f, E.smooth(ln), [S.at(0.6, 1.6), S.at(0.7, 2.3), S.at(0.82, 3.0)], 12, { dark: '#1a1820', light: '#b0aab8', lit: '#c8c2d0', col: '#1a1820', lightOp: 0.4 }); X.burnHole(f, S.at(0.72, 2.6), 7, 0.4); } // the grey lining turned back along the front opening as it parts over the stride
      X.formHatch(f, [S.at(-0.6, 1.0), S.at(-0.74, 2.0), S.at(-0.72, 3.0)], 40, { op: 0.4 });
      X.stains(f, E.smooth(sk), E.bbox(sk), '#08060a', 0.02, 3, -1.9, 31, 0.45);
      X.burn(f, S.at(0.2, 2.7), -1.3, 200, 2.6, { depth: 3, scorch: '#0a0610' });
      X.stains(f, E.smooth(sk), E.bbox(sk), '#5a5266', 0.05, 4, -2.0, 37, 0.45); for (let i = 0; i < 7; i++) X.burnHole(f, S.at(R(f, -0.5, 0.6), R(f, 1.6, 3.0)), R(f, 5, 12), f.r() * 3); // ash-grey scorch patches, burn holes
      for (let i = 0; i < 3; i++) { const q = S.at(-0.4 + i * 0.4, 2.2 + i * 0.25); X.burn(f, q, -1.4 + i * 0.3, 120, 1.8, { depth: 2, scorch: '#0a0610' }); }
      { const pc = S.at(-0.3, 2.3), pt = [add(pc, [-40, -36]), add(pc, [38, -30]), add(pc, [42, 40]), add(pc, [-36, 44])]; f.part(pt, CLB(f, { fill: '#2e2834', maxShade: 4, cast: false, sharp: true })); f.stitches([...pt, pt[0]], '#6a6070'); }
    });
    X.charEdge(f, hem, 6, { gap: 8 });
    X.clipDraw(f, E.smooth(sk), () => { const hb = hem.map(q => add([q[0], q[1]], [0, -34])); f.line(hb, 18, INK); f.line(hb, 14, P.gold); f.line(hb.map(q => add(q, [0, -4])), 2, P.goldL, { op: 0.6 }); for (let i = 2; i < hb.length - 1; i += 3) f.line([hb[i], add(hb[i], [3, 10])], 3, P.blackD, { op: 0.8 }); });
    gEdge([S.at(0.62, 0.78), S.at(0.76, 1.4), S.at(0.88, 2.2), S.at(1.0, 3.0)]); // the front opening's edge of gilt
  }
  // ---- torso: the robe's upper body, the strap across it worn through
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.32, 0.34], [0.06, 0.6, 0.5], [0.22, 0.64, 0.6], [0.42, 0.56, 0.52], [0.62, 0.46, 0.46], [0.82, 0.54, 0.5], [1.0, 0.6, 0.56]]);
  f.part(torso, ROBE());
  X.clipDraw(f, E.smooth(torso), () => { X.fold2(f, E.smooth(torso), [S.at(-0.2, 0.2), S.at(-0.1, 0.5), S.at(0.0, 0.86)], 18, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 }); X.formHatch(f, [S.at(-0.5, 0.06), S.at(-0.56, 0.5), S.at(-0.5, 0.9)], 36, { op: 0.4 }); });
  gEdge([S.at(0.0, -0.04), S.at(0.3, 0.3), S.at(0.5, 0.8)], 8);
  // the belt: wax tablets on a thong, the inkhorn (black horn, burn-split rim), the pen-knife and the seal
  { const b0 = S.at(-0.66, 0.84), b1 = S.at(0.6, 0.82); f.part([add(b0, [0, -10]), add(b1, [0, -10]), add(b1, [0, 12]), add(b0, [0, 12])], LTH(f, { sharp: true, maxShade: 4 }));
    for (let i = 0; i < 5; i++) { const q = lerp(b0, b1, 0.08 + i * 0.12), t = [add(q, [-18, 10]), add(q, [18, 10]), add(q, [16, 64]), add(q, [-16, 62])]; f.part(t, { fill: '#6a5a3a', light: '#9a8a5a', shadow: '#1a1408', shade: 0.4, inkW: 1.3, sharp: true, cast: false }); f.flat([add(q, [-12, 18]), add(q, [12, 18]), add(q, [11, 56]), add(q, [-11, 54])], '#3a3020', { op: 0.6 }); for (let k = 0; k < 4; k++) f.line([add(q, [-9, 24 + k * 8]), add(q, [R(f, 0, 9), 24 + k * 8])], 1, '#c8b880', { op: 0.6 }); } // wax tablets, scratched
    const ih = S.at(0.36, 0.98); f.part([add(ih, [-14, -6]), add(ih, [16, -10]), add(ih, [10, 60]), add(ih, [-2, 86]), add(ih, [-10, 56])], X.BK(f, { fill: '#1a161c', light: '#4a424e', maxShade: 8 })); f.part(ell(add(ih, [1, -8]), 16, 6, -0.1, 12), X.BK(f, { fill: '#2a242e', maxShade: 2, cast: false })); f.flat(ell(add(ih, [1, -8]), 9, 3, -0.1, 10), P.void); X.vcrack(f, [add(ih, [6, -10]), add(ih, [8, 8]), add(ih, [4, 26])], 4, { dark: '#0a080c', lip: '#6a6070' }); f.line([add(ih, [-12, 20]), add(ih, [12, 16])], 3, P.goldM); // inkhorn
    const pk = S.at(0.12, 1.0); f.part([add(pk, [-5, 0]), add(pk, [5, 0]), add(pk, [4, 40]), add(pk, [-4, 40])], LTH(f, { maxShade: 2, cast: false, sharp: true })); f.part([add(pk, [-3, 40]), add(pk, [3, 40]), add(pk, [1, 70], 1), add(pk, [-3, 64])], { fill: '#8a8890', light: '#c8c6ce', shade: 0.3, inkW: 1, cast: false }); // pen-knife
    const sl = S.at(-0.2, 1.0); f.line([sl, add(sl, [0, 30])], 2, '#4a4038'); f.part(ell(add(sl, [0, 42]), 13, 13, 0, 14), X.GL(f, { maxShade: 4, cast: false })); f.flat(ell(add(sl, [0, 42]), 7, 7, 0, 10), P.goldS, { op: 0.6 }); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; f.line([add(sl, [0, 42]), add(add(sl, [0, 42]), [Math.cos(a) * 6, Math.sin(a) * 6])], 1.2, P.goldL); } // the seal, the Mother's six rays on it
  }
  // ---- head: long and ascetic, bowed to the book, eyes half closed; cracked like glazed clay; hair standing
  f.bone('head');
  f.part(limb(neck0, add(HC, rot([-0.12 * H, 0.28 * H], hA)), 92, 84), SKG());
  X.clipDraw(f, E.smooth(limb(neck0, add(HC, rot([-0.12 * H, 0.28 * H], hA)), 92, 84)), () => X.burn(f, add(HC, rot([0, 0.5 * H], hA)), 2.0, 120, 2.4, { depth: 2, haloOp: 0.3 }));
  const hd = angelHead(f, HC, H, hA, { head: { jaw: 0.86, chin: 0.03, nose: 1.15, hook: 0.15, mouth: 'set', squint: 0.72, browDown: 0.0, browW: 0.04, age: true, gaunt: true, hairCol: '#2a2430', iris: P.vioD, lashes: false,
    hair: [[-0.44, 0.04], [-0.48, -0.24], [-0.32, -0.48], [-0.06, -0.56], [0.16, -0.52], [0.22, -0.44], [0.04, -0.44], [-0.14, -0.34], [-0.26, -0.12], [-0.3, 0.04]] },
    inFace: F => {
      for (const [a, b, c] of [[[-0.3, -0.3], [0.0, -0.2], [0.34, -0.22]], [[-0.1, 0.4], [0.08, 0.2], [0.3, 0.1]], [[0.0, -0.46], [0.1, -0.3], [0.08, -0.12]]]) X.vcrack(f, F([a, b, c]), 7, { dark: '#2a2030', lip: '#f0e6d2' });
      X.crackV(f, F([[0.12, 0.06]])[0], hA + 0.5, 40, 2.4, { depth: 2, dark: '#2a2030', lip: '#f0e6d2' });
      X.burn(f, F([[-0.2, 0.3]])[0], hA - 0.7, 80, 2, { depth: 3, haloOp: 0.25 });
      for (const [x0, y0] of [[0.04, 0.18], [0.2, 0.08], [-0.12, -0.1], [0.24, -0.36]]) for (let k = 0; k < 3; k++) X.hairline(f, F([[x0 + k * 0.02, y0], [x0 + 0.05 + k * 0.02, y0 + 0.06], [x0 + 0.03 + k * 0.03, y0 + 0.12]]), 1); // crazing, like glaze
    } });
  { const roots = []; for (let i = 0; i < 14; i++) { const t = i / 13, q = hd([[-0.44 + t * 0.62, -0.12 - Math.sin(t * Math.PI) * 0.42 - t * 0.04]])[0]; roots.push([q, hA - 2.6 + t * 1.4 + R(f, -0.1, 0.1)]); } X.standingHair(f, roots, 80, { pal: ['#0e0c10', '#2a2430', '#5a5060', '#3a3440'], w: 10, gap: false }); }

  // ---- the book, seen from below: the strap from its spine over the near shoulder (worn through to the lining), the
  // chain from the spine to the belt; the two covers' undersides, the page blocks' edges at the fore-edges; clasps of
  // cracked gold hanging
  f.bone('torso');
  { const st = [add(SP, mul(D, 0.15)), S.at(0.3, 0.4), S.at(-0.1, 0.0), S.at(-0.5, -0.04)]; f.line(X.spline(st, 4), 22, INK); f.line(X.spline(st, 4), 18, '#2a2428'); f.line(X.spline(st, 4).map(q => add(q, [-3, -3])), 2, '#5a5058', { op: 0.6 });
    const wq = lerp(st[1], st[2], 0.5); f.part(ell(wq, 16, 9, ang(st[1], st[2]), 12), { fill: '#6a5a4a', shade: 0.3, inkW: 1, cast: false }); f.line(ell(wq, 16, 9, ang(st[1], st[2]), 12).slice(0, 7), 1.2, '#2a2428'); f.stitches([lerp(st[1], st[2], 0.2), lerp(st[1], st[2], 0.8)], '#8a7a6a'); } // the lining showing where it wore through
  X.ironChain(f, [add(SP, mul(D, 0.1)), add(SP, [-40, 90]), S.at(0.3, 0.86)], 22, 5, '#8a6a24');
  f.bone('book');
  const COV = (o = {}) => LTH(f, Object.assign({ fill: '#221c22', light: '#4a3e48', maxShade: 20 }, o));
  const leaf = (E0, sgn) => {
    // the page block's edge at the fore-edge (striped), above the cover board's edge
    const pb = [E0, add(E0, D), add(add(E0, D), [0, -54]), add(E0, [0, -54])].map(q => [...q, 1]);
    f.part(pb, X.BN(f, { fill: '#cfc6ae', maxShade: 4, cast: false }));
    for (let k = 1; k < 9; k++) f.line([add(E0, [0, -k * 6]), add(add(E0, D), [0, -k * 6])], 0.8, '#6a604e', { op: 0.6 });
    X.charEdge(f, [add(E0, [0, -54]), add(add(E0, D), [0, -54])], 5, { gap: 10 });
    // the cover's underside: dark leather over boards, corners of gilt, a cracked gilt clasp hanging from the fore-edge
    const cv = [SP, E0, add(E0, D), add(SP, D)].map(q => [...q, 1]);
    f.part(cv, COV());
    X.clipDraw(f, E.smooth(cv), () => { X.softTone(f, E.smooth(cv), [[[SP, lerp(SP, E0, 0.5), add(lerp(SP, E0, 0.5), D), add(SP, D)], '#000', 0.5, 20]]); f.line([lerp(SP, E0, 0.1), lerp(add(SP, D), add(E0, D), 0.1)], 3, '#4a3e48', { op: 0.7 }); X.burn(f, lerp(SP, E0, 0.6), ang(SP, E0), 140, 2.2, { depth: 2, scorch: '#0a0610' }); f.scratches(lerp(SP, E0, 0.5), 40, 6, '#6a5e66', 1, ang(SP, E0)); });
    for (const t of [0.0, 1.0]) { const c = lerp(E0, add(E0, D), t), cn = [c, lerp(c, SP, 0.12), add(lerp(c, SP, 0.12), mul(D, t ? -0.12 : 0.12)), add(c, mul(D, t ? -0.12 : 0.12))].map(q => [...q, 1]); f.part(cn, X.GILT(f, { maxShade: 3, cast: false })); X.leaf(f, cn, { cell: 14, s: 0.3, chips: 0, burnish: false }); }
    const ck = lerp(E0, add(E0, D), 0.5); f.part([add(ck, [-16, -10]), add(ck, [16, -14]), add(ck, [14 + sgn * 6, 50]), add(ck, [0, 66]), add(ck, [-14 + sgn * 6, 52])], X.GILT(f, { maxShade: 6 })); X.vcrack(f, [add(ck, [-2, 6]), add(ck, [4, 30]), add(ck, [0, 54])], 4, { dark: P.goldS }); f.rivet(add(ck, [0, 0]), 4, '#a8822e');
  };
  leaf(RA, 1); leaf(LA, -1);
  // the near end of the open book: the page blocks' head edges as two thick cream wedges in a V, on their boards
  for (const [E0, sg] of [[LA, -1], [RA, 1]]) {
    const u = E.norm(sub(E0, SP)), nU = [u[1] * -sg, -u[0] * -sg], up = nU[1] < 0 ? nU : mul(nU, -1), th = 70;
    const bd = [SP, E0, add(E0, mul(up, -12)), add(SP, mul(up, -12))].map(q => [...q, 1]); f.part(bd, COV({ fill: '#2e2630', maxShade: 4, cast: false }));
    const wd = [add(SP, mul(up, 6)), add(E0, mul(up, 2)), add(E0, mul(up, th)), add(lerp(SP, E0, 0.25), mul(up, th * 0.5)), add(SP, mul(up, 14))].map(q => [...q, 1]);
    f.part(wd, X.BN(f, { fill: '#d6cdb4', light: '#f2ead6', maxShade: 12, cast: false }));
    X.clipDraw(f, E.smooth(wd), () => { for (let k = 1; k < 12; k++) f.line([add(lerp(SP, E0, 0.05), mul(up, 6 + k * 5)), add(E0, mul(up, 2 + k * 5.6))], 0.9, '#6a604e', { op: 0.55 }); X.softTone(f, E.smooth(wd), [[[SP, E0, add(E0, mul(up, 20)), add(SP, mul(up, 20))], '#3a3028', 0.4, 6]]); });
    X.charEdge(f, [add(lerp(SP, E0, 0.3), mul(up, th * 0.6)), add(E0, mul(up, th))], 5, { gap: 9 });
  }
  f.line([SP, add(SP, D)], 7, INK); f.line([SP, add(SP, D)], 4, '#3a3038'); for (let k = 1; k < 5; k++) { const q = lerp(SP, add(SP, D), k / 5); f.line([add(q, [-6, -3]), add(q, [6, 3])], 3, P.gold); } // the spine's bands
  // ---- leaves torn loose lifting out of the book in the storm: names in black ink, many struck through in red rubric,
  // eyes opened among the names; scorched, curling edges
  f.bone('pages');
  const page = (c, a, w, h, curl, eyes) => {
    const F = frame(c, a, 1), pg = F([[-w / 2, -h / 2], [w / 2, -h / 2 + curl * 0.3], [w / 2 + curl, h / 2], [-w / 2 + curl * 0.4, h / 2]]);
    const hem = X.charHem(f, pg[2], pg[1], 4, 12, F([[1, 0]])[0].map((v, i) => v - c[i]));
    const sh = [pg[0], pg[1], ...hem.slice(1, -1).reverse(), pg[2], pg[3]];
    f.part([pg[0], pg[1], pg[2], pg[3]].map(q => [...q, 1]), X.BN(f, { fill: '#d6cdb4', light: '#f2ead6', maxShade: 10 }));
    X.clipDraw(f, E.smooth([pg[0], pg[1], pg[2], pg[3]].map(q => [...q, 1])), () => {
      X.softTone(f, E.smooth(pg), [[F([[-w / 2, h * 0.1], [w / 2 + curl, h * 0.1], [w / 2 + curl, h / 2], [-w / 2, h / 2]]), '#4a4038', 0.35, 10]]);
      for (let r = 0; r < 9; r++) { const y = -h / 2 + 16 + r * (h - 30) / 9, x0 = -w / 2 + 12, len = R(f, w * 0.4, w * 0.8); const ln = []; for (let k = 0; k <= 6; k++) ln.push([x0 + len * k / 6, y + Math.sin(k * 2.3 + r) * 1.2]); f.line(F(ln), 2.2, '#1a1414', { op: 0.85, dash: `${R(f, 6, 12).toFixed(0)} ${R(f, 2, 4).toFixed(0)}` }); if (f.r() < 0.55) f.line(F([[x0 - 4, y + 1], [x0 + len + 4, y - 1]]), 2.4, K.rubric, { op: 0.9 }); }
      for (const [ex, ey, sz] of eyes) X.eye(f, F([[ex, ey]])[0], sz, a, { lid: X.BN(f, { fill: '#c4bca4' }), open: 0.7, gaze: [-0.4, 0.3], iris: P.vio, mass: false, inkW: 1 });
      X.stains(f, E.smooth(pg), E.bbox(pg), '#2a2018', 0.03, 3, -1.7, Math.round(c[0]) % 97, 0.6);
    });
    X.charEdge(f, [pg[1], pg[2], pg[3]], 6, { gap: 8 });
  };
  page([1080, 392], -0.95, 92, 120, 22, [[0, -10, 10]]);
  page([990, 330], -0.45, 84, 108, 18, [[-14, 24, 9]]);
  page([962, 470], -0.3, 104, 130, 26, [[10, 12, 12], [-26, -34, 7]]);

  // ---- the far hand under the far leaf, holding it up; fingers curled over its fore-edge
  f.bone('hand_f');
  X.openHand(f, WF, ang(EF, WF) - 0.2, 120, { look: SKG({ fill: mix('#d0c2a6', '#000', 0.12), maxShade: 8 }), back: true, flip: false, spread: 0.1, curl: 0.55, curls: [0.5, 0.6, 0.65, 0.7], nail: '#8a8070' });
  f.bone('forearm_f'); X.burn(f, lp(EF, WF, 0.9, 0), ang(WF, EF), 110, 2.2, { depth: 2, clip: ell(lerp(EF, WF, 0.6), E.len(sub(WF, EF)) * 0.5, 26, ang(EF, WF), 14) });

  // ---- the near arm raised with the quill, the sleeve fallen back to the elbow; the hand fused to the quill
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 70, 58, SKG(), '_n', { vein: true });
  f.bone('upperarm_n'); { const a0 = lp(SN, EN, -0.05, 0), a1 = lp(SN, EN, 1.08, 0); const sl = K.ragLimb(f, a0, a1, 104, 150, { teeth: 6, depth: 18 }); f.part(sl, ROBE()); X.clipDraw(f, E.smooth(sl), () => X.fold2(f, E.smooth(sl), [lp(a0, a1, 0.2, 10), lp(a0, a1, 0.6, 30), lp(a0, a1, 1.0, 50)], 14, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 })); gEdge([lp(a0, a1, 0.98, 74), lp(a0, a1, 1.02, -74)], 7); }
  f.bone('forearm_n'); X.burn(f, lp(EN, WN, 0.95, 0), ang(WN, EN), 150, 2.6, { depth: 3, clip: ell(lerp(EN, WN, 0.55), E.len(sub(WN, EN)) * 0.55, 28, ang(EN, WN), 16) });
  f.bone('quill');
  { const qB = add(WN, mul(qD, -46)), sh = limb(qB, qT, 7, 3, { steps: 8 }); f.part(sh, X.BN(f, { fill: '#d8d0bc', maxShade: 2, cast: false }));
    X.feather(f, add(WN, mul(qD, 70)), qA - 0.03, 270, 46, X.FE(f, { fill: '#cfc8ba' }), { lead: 0.25, bend: -0.06, dark: 0.35, darkCol: '#0c0a0c', darkOp: 0.9, notch: [0.45, 0.7], lift: 3 }); // a seraph's flight feather, scorched at the vane
    X.burn(f, add(WN, mul(qD, 120)), qA, 160, 1.8, { depth: 2, halo: false, clip: limb(add(WN, mul(qD, 60)), qT, 60, 20) });
    f.part([qB, add(qB, mul(qD, -18)), add(add(qB, mul(qD, -6)), [3, 2])].map(q => [...q, 1]), X.BK(f, { maxShade: 1, cast: false })); } // the cut nib, black with ink
  f.bone('hand_n');
  const gq = mFist(f, WN, EN, qA, 46, '#d0c2a6', { shadow: '#3e3238', tex: 'mottle' + seed, texOp: 0.4, inline: true, bend: -0.1, name: 'recorder quill' });
  weld(f, [add(WN, mul(qD, -30)), WN, add(WN, mul(qD, 34))], 10, AR(f), { runs: 2 }); // the hand fused to the quill
  X.burn(f, WN, qA + Math.PI - 0.4, 90, 2.2, { depth: 2, clip: ell(WN, 44, 34, qA, 14) });
  f.bone('root');
  f.flat(ell([560, gy + 2], 300, 12, 0, 20), '#000', { op: 0.32 });
  X.leafDrift(f, [900, 300], 220, 160, 9, 1.4);
  return X.toneGold(f);
}

// ------------------------------------------------------------------ THE WEIGHER OF SOULS (elite 2.3)
// It weighed every soul against a feather. It has lost the feather. The angel that held the scales at the Mother's gate,
// standing dead straight with both arms out level to the sides: the strike came at the moment of weighing and fused
// shoulders, arms and wrists into one rigid bar of gilt metal and flesh (the arm's muscle still showing under bands of
// fused metal, the fists welded round the hanger rings), violet burns flaring out from the shoulders along it. The body
// hangs under the bar like a plumb line. From each wrist a great pan of hammered gold hangs on chains below the knee,
// cracked, one hanging lower: in the low pan a heap of grey ash that was souls, the high pan empty where the feather
// should be. A metal pointer, the scale's needle, rises straight out of the crown, a cracked halo round it. Void cracks
// open down the torso. A long black tabard bordered with cracked gold leaf, a girdle of plaited cord, a weight-stone at
// the belt and a string of small gilt weights on a cord, wings folded tight behind (the far one gone to a clean void
// edge), bare feet with one toe missing. A narrow, impassive face, eyes closed. Seen nearly from the front: a T.
// Rig: pelvis (root) > torso > head > needle; torso > bar > chain_n > pan_n, bar > chain_f > pan_f; torso > wing_n,
// wing_f; pelvis > skirt; legs. Motion: idle the pans swaying (chain_*), the needle wobbling; attack weighing the party
// (bar tips a few degrees, pans swing, the needle settles).
function weigher() {
  const CW = 1800, CH = 1900, seed = 1523;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 230, gy = f.o.groundY, cx = 900;
  const SKG = (o = {}) => SKA(f, o);
  const GS = (o = {}) => X.GILT(f, o);
  // the beam: its pivot at the sternal notch (P0); it has tipped toward the heavier pan (the ash), so the near end is
  // lower; the needle stands perpendicular to it out of the crown and leans with it. The arms ARE the beam.
  const tilt = 0.075, dB = [Math.cos(tilt), -Math.sin(tilt)], up = [dB[1], -dB[0]], P0 = [cx + 6, 706];
  const onB = k => add(P0, mul(dB, k));
  const SN = onB(-196), SF = onB(150), EN = onB(-470), EF = onB(440), wN = onB(-730), wF = onB(700);
  const HC = add(P0, mul(up, 196)), hA = Math.atan2(dB[1], dB[0]) + 0.04, crown = add(HC, mul(up, 128));
  // the body hangs under the pivot like a plumb line. Final pass 2026-11-25: it stood in contrapposto (hip pushed out
  // over the near leg, far knee eased forward, heel lifting), against the bible's 'standing very straight ... weight dead
  // centre: it reads as a T'. Now the spine is vertical under the pivot, both legs straight and the feet flat, side by
  // side under the pelvis, and the tabard hangs plumb with a level hem.
  const N = [cx + 6, 700], C = [cx + 6, 870], Pv = [cx + 6, 1110];
  const S = B.spine(N, C, Pv, H);
  const HN = S.at(-0.2, 1.0), KN = [cx - 50, 1480], AN = [cx - 56, gy - 72];
  const HF = S.at(0.3, 1.02), KF = [cx + 70, 1480], AF = [cx + 74, gy - 72];
  const chainL = 880, panN = add(wN, [0, chainL]), panF = add(wF, [0, chainL]); // equal chains, so the low end's pan hangs lower
  f.joint('pelvis', Pv).joint('torso', S.at(0, 0.86), 'pelvis').joint('head', add(P0, mul(up, 60)), 'torso').joint('needle', crown, 'head');
  f.joint('bar', P0, 'torso').joint('chain_n', wN, 'bar').joint('pan_n', panN, 'chain_n').joint('chain_f', wF, 'bar').joint('pan_f', panF, 'chain_f');
  f.joint('wing_n', S.at(-0.7, 0.12), 'torso').joint('wing_f', S.at(-0.5, 0.06), 'torso').joint('skirt', S.at(0, 0.9), 'pelvis');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');

  // ---- the needle rising from the crown along the beam's perpendicular, and its cracked halo
  f.bone('needle');
  { const b = crown, t = add(crown, mul(up, 330)), nn = [-up[1], up[0]], nd = [add(b, mul(nn, -12)), add(lerp(b, t, 0.7), mul(nn, -7)), [...t, 1], add(lerp(b, t, 0.7), mul(nn, 9)), add(b, mul(nn, 12))];
    f.part(nd, X.GR(f, { fill: '#6a6870', light: '#b8b6c0', maxShade: 6 })); f.line([lerp(b, t, 0.05), lerp(b, t, 0.92)].map(q => add(q, mul(nn, 3))), 2.4, '#d8d6e0', { op: 0.6 }); X.burn(f, lerp(b, t, 0.2), Math.atan2(up[1], up[0]), 200, 1.6, { depth: 2, halo: false, clip: nd });
    const kn = lerp(b, t, 0.42), kq = [add(kn, mul(nn, -26)), add(kn, mul(up, 34)), add(kn, mul(nn, 26)), add(kn, mul(up, -34))].map(q => [...q, 1]); X.gilt(f, kq, { sz: 40, cell: 16, s: 0.3, chips: 1 }); f.flat(ell(kn, 6, 6, 0, 10), P.void); // the needle's boss
    X.crackedHalo(f, lerp(b, t, 0.6), 110, 34, Math.atan2(dB[1], dB[0]), 16, [0.1, 0.42, 0.7], { drift: 12, lost: 0.3, capW: 0.3 }); }
  // ---- wings folded tight down the back; the far one ends in a clean void edge
  const wingFold = (root, tip, sg, cut, dim) => {
    const d = E.norm(sub(tip, root)), n = [-d[1], d[0]];
    const tipC = cut ? lerp(root, tip, 0.55) : tip, L = E.len(sub(tipC, root));
    const body = () => { for (let i = 6; i >= 0; i--) { const q = add(lerp(root, tipC, 0.18 + i * 0.01), mul(n, sg * (-30 + i * 9))); X.feather(f, q, ang(root, tip) + sg * (0.04 - i * 0.012), L * (0.84 + i * 0.03), 42, X.FE(f, { fill: mix(P.plume, '#000', dim + (i % 3) * 0.05) }), { lead: 0.35, round: true, dark: cut ? 0 : 0.3, notch: i === 2 ? [0.6] : [] }); }
      X.plumeMass(f, [add(root, mul(n, 50)), add(root, mul(n, -50)), add(lerp(root, tipC, 0.35), mul(n, -46)), ...X.featherHem([add(lerp(root, tipC, 0.35), mul(n, -46)), add(lerp(root, tipC, 0.4), mul(n, 0)), add(lerp(root, tipC, 0.45), mul(n, 46))], ang(root, tip), 32, f)], ang(root, tip), 30, X.FE(f, { fill: mix('#aca69c', '#000', dim * 0.5) }), { w: 1.2, op: 0.5 }); };
    if (!cut) return body();
    const cutC = lerp(root, tip, 0.55), cd = E.norm(sub(tip, root));
    X.clipDraw(f, X.side(cutC, mul(cd, -1), 0), body);
    const e0 = add(cutC, mul([-cd[1], cd[0]], 90)), e1 = add(cutC, mul([-cd[1], cd[0]], -90)); f.line([e0, e1], 3, P.ashW, { op: 0.9 }); f.line([add(e0, mul(cd, 3)), add(e1, mul(cd, 3))], 2, P.vio, { op: 0.7 }); X.shards(f, add(cutC, mul(cd, 20)), ang(root, tip), 4, 1.2);
  };
  const foldWing = (Sw, k, dim, cut) => { const E0 = add(Sw, [-50, -120]), W0 = add(Sw, [-110, -30]), T0 = add(Sw, [-150 - k * 40, 820]);
    const draw = () => X.wing(f, Sw, E0, W0, T0, { bones: [k ? 'wing_n' : 'wing_f', k ? 'wing_n' : 'wing_f', k ? 'wing_n' : 'wing_f'], tr: -1, Lp: 620, Ls: 300, Wp: 46, Ws: 46, np: 9, ns: 10, nt: 3, look: X.FE(f, { fill: mix(P.plume, '#000', dim) }), skin: SKG({ fill: mix('#d0c2a6', '#000', dim) }), lift: true, notchP: [2, 6], notchS: [3, 7], rake: -0.2, wS: 70, wE: 52, wW: 40, darkTips: 0.4, spreadP: 0.12, cover: true, pLen: t => 0.86 + 0.18 * Math.sin(t * 4.1), sLen: t => 0.86 + 0.16 * Math.sin(t * 5 + 1) });
    if (!cut) return draw();
    const cutC = lerp(Sw, T0, 0.5), cd = E.norm(sub(T0, Sw)); X.clipDraw(f, X.side(cutC, mul(cd, -1), 0), draw);
    const nn = [-cd[1], cd[0]], e0 = add(cutC, mul(nn, 160)), e1 = add(cutC, mul(nn, -160)); f.line([e0, e1], 3, P.ashW, { op: 0.9 }); f.line([add(e0, mul(cd, 3)), add(e1, mul(cd, 3))], 2, P.vio, { op: 0.7 }); X.shards(f, add(cutC, mul(cd, 24)), Math.atan2(cd[1], cd[0]), 5, 1.4); };
  f.bone('wing_f'); foldWing(S.at(-0.4, 0.04), 0, 0.34, true);
  f.bone('wing_n'); foldWing(S.at(-0.66, 0.1), 1, 0.2, false);
  // ---- the chains and pans: from the hook under each fist three chains run taut to the pan's rim, pulled straight by
  // the weight (scorched violet at the links); the pan of hammered gold seen a little from above, its inside, its
  // belly; the low pan heaped with grey ash that was souls, the high pan empty, only the worn place where the feather lay
  const pan = (w, c, sg, bones, ash) => {
    f.bone(bones[0]);
    const rx = 170, ry = 38, hook = add(w, [0, 66]), rim = [-0.92, 0.02, 0.92].map(t => add(c, [t * rx, -ry * (t === 0.02 ? 0.95 : 0.25)]));
    for (const r of rim) { X.ironChain(f, [hook, r], 26, 5.2, '#8a6a24', { phase: rim.indexOf(r) % 2 }); for (let k = 0; k < 3; k++) { const q = lerp(hook, r, 0.25 + k * 0.25 + R(f, -0.05, 0.05)); f.flat(ell(q, 7, 5, 0, 8), P.vio, { op: 0.5 }); f.flat(ell(q, 3, 2, 0, 6), P.vioL, { op: 0.7 }); } }
    f.part(ell(hook, 16, 18, 0, 12), X.GR(f, { fill: '#5a5860', light: '#a8a6ae', maxShade: 3, cast: false })); f.flat(ell(hook, 7, 8, 0, 10), P.void); // the ring the chains gather on
    f.bone(bones[1]);
    const belly = [add(c, [-rx, 0]), add(c, [-rx * 0.82, ry * 1.6]), add(c, [0, ry * 2.5]), add(c, [rx * 0.82, ry * 1.6]), add(c, [rx, 0])], outl = [...belly, ...ell(c, rx, ry, 0, 24).slice(0, 13).reverse()];
    X.gilt(f, outl, { sz: 110, cell: 40, s: 0.7, chips: 2, dark: 0.6, lite: 0.4 });
    for (let k = 0; k < 14; k++) { const q = add(c, [R(f, -rx * 0.8, rx * 0.8), R(f, ry * 0.4, ry * 2.0)]); f.flat(ell(q, R(f, 6, 12), R(f, 4, 7), R(f, -0.4, 0.4), 10), P.goldL, { op: 0.3 }); f.line(ell(q, R(f, 6, 12), R(f, 4, 7), 0, 10).slice(5, 10), 1, P.goldS, { op: 0.6 }); } // the hammer marks
    const inside = ell(c, rx * 0.95, ry * 0.85, 0, 26); f.part(inside, GS({ fill: '#5a4418', maxShade: 10, cast: false })); X.leaf(f, inside, { cell: 30, s: 0.5, chips: 0, burnish: false }); X.softTone(f, E.smooth(inside), [[ell(add(c, [rx * 0.3, -ry * 0.2]), rx * 0.6, ry * 0.6, 0, 16), '#0a0604', 0.5, 12]]);
    f.line(ell(c, rx, ry, 0, 30).concat([ell(c, rx, ry, 0, 30)[0]]), 6, INK); f.line(ell(c, rx, ry, 0, 30).slice(16, 30), 3, P.goldL); f.line(ell(c, rx, ry, 0, 30).slice(1, 15), 3, P.goldM);
    X.vcrack(f, [add(c, [rx * 0.5 * sg, ry * 0.3]), add(c, [rx * 0.62 * sg, ry * 1.2]), add(c, [rx * 0.5 * sg, ry * 2.0])], 8, { dark: P.goldS });
    if (ash) X.ashHeap(f, add(c, [6, ry * 0.4]), rx * 1.2, 76, { n: 12 });
    else { f.flat(ell(add(c, [30, 6]), 18, 5, 0, 10), P.goldS, { op: 0.5 }); f.line([add(c, [12, 4]), add(c, [50, 2])], 1, P.goldL, { op: 0.4 }); }
  };
  // ---- the far arm (behind the body's line), the beam running out of it to the far end
  const arm = (Sh, El, Wr, w, dim, sfx) => {
    const dl = ell(add(add(Sh, mul(dB, sfx === '_n' ? -20 : 20)), mul(up, w[0] * 0.08)), w[0] * 0.82, w[0] * 0.66, Math.atan2(dB[1], dB[0]), 20); X.castOn(f, dl, 14, 0.4); X.gilt(f, dl, { look: { fill: mix(P.gold, '#000', dim) }, sz: w[0], cell: 50, s: 0.7, chips: 1, dark: 0.5, lite: 0.38 }); // the deltoid, flesh going over into metal
    const sh = K.chain([Sh, El, Wr], [w[0], w[1], w[2]], { steps: 10, bp: [[0, 0.3, 0.16, 0.25], [1, 0.25, 0.14, 0.25]], bq: [[0, 0.55, 0.12, 0.3], [1, 0.2, 0.1, 0.3]] });
    X.gilt(f, sh, { look: { fill: mix(P.gold, '#000', dim) }, sz: w[1] * 1.1, cell: 60, s: 0.9, chips: 3, dark: 0.55 });
    X.clipDraw(f, E.smooth(sh), () => {
      X.crease(f, [add(El, mul(up, w[1] * 0.4)), add(El, mul(dB, 6)), add(El, mul(up, -w[1] * 0.3))], 3, { col: P.blackD, lit: P.goldL }); // the elbow, locked straight
      for (const t of [0.3, 0.62, 0.86]) { const q = lerp(Sh, Wr, t), ww = (w[0] + (w[2] - w[0]) * t) * 0.62; const bd = [add(add(q, mul(dB, -12)), mul(up, ww)), add(add(q, mul(dB, 12)), mul(up, ww)), add(add(q, mul(dB, 14)), mul(up, -ww)), add(add(q, mul(dB, -14)), mul(up, -ww))].map(z => [...z, 1]); f.part(bd, AR(f, { fill: mix('#8a6a24', '#000', dim), maxShade: 4, cast: false })); f.line([bd[0], bd[3]].map(z => add(z, mul(dB, 3))), 2, '#fff6d8', { op: 0.5 }); } // bands of fused metal round the beam
      X.burn(f, add(Sh, mul(dB, sfx === '_n' ? -20 : 20)), Math.atan2(dB[1], dB[0]) + (sfx === '_n' ? Math.PI : 0), 460, 3.4, { depth: 3, haloOp: 0.4 }); // flaring out from the shoulder along the bar
      weld(f, [add(lerp(Sh, Wr, 0.44), mul(up, w[1] * 0.45)), lerp(Sh, Wr, 0.45), add(lerp(Sh, Wr, 0.46), mul(up, -w[1] * 0.45))], 8, AR(f), { runs: 1 });
      X.vcrack(f, [lerp(Sh, El, 0.3), add(lerp(Sh, El, 0.6), mul(up, 10)), lerp(Sh, El, 0.9)], 7, { dark: P.goldS }); // the beam's metal showing through the flesh
    });
    // the beam's forged end out of the fist, the hook under it, and the fist fused round it
    const sgn = sfx === '_n' ? -1 : 1, e0 = add(Wr, mul(dB, sgn * 20)), e1 = add(Wr, mul(dB, sgn * 70)), bar = limb(e0, e1, 30, 26, { steps: 4, capK: 0.5 });
    f.part(bar, AR(f, { fill: '#7a5e22', maxShade: 6 })); f.part(ell(e1, 18, 20, 0, 12), AR(f, { fill: '#8a6a24', maxShade: 4, cast: false }));
    f.line([add(e1, [0, 18]), add(Wr, [sgn * 50, 66])], 9, INK); f.line([add(e1, [0, 18]), add(Wr, [sgn * 50, 66])], 6, '#5a5860'); // the hanger down to the ring
    mFist(f, Wr, El, -Math.PI / 2, 62, mix(P.gold, '#000', dim + 0.05), { inline: true, tex: 'craq' + seed, texOp: 0.4, shadow: P.goldS, name: 'weigher fist ' + sfx });
    weld(f, [add(Wr, mul(up, 50)), add(Wr, mul(dB, -sgn * 30)), add(Wr, mul(up, -50))], 9, AR(f), { runs: 2 });
  };
  f.bone('bar'); arm(SF, EF, wF, [118, 82, 62], 0.2, '_f');
  pan(add(wF, [50, 0]), panF, 1, ['chain_f', 'pan_f'], false);
  // ---- legs: both straight under the weight, the feet flat side by side; bare feet, the near foot missing its little toe
  X.bareLegRig(f, HF, KF, AF, 74, 132, 98, SKG({ fill: mix('#d0c2a6', '#000', 0.16), maxShade: 20 }), '_f', { nail: P.boneS });
  X.bareLegRig(f, HN, KN, AN, 76, 138, 102, SKG({ maxShade: 22 }), '_n', { nail: P.boneS, extra: pts => X.clipDraw(f, E.smooth(pts), () => { X.burn(f, add(AN, [20, -60]), -1.3, 80, 1.8, { depth: 2, haloOp: 0.3 }); const q = add(AN, [100, 60]); f.flat(ell(q, 9, 6, 0, 8), '#3a3440'); f.flat(ell(q, 5, 3, 0, 8), P.void); }) });
  // ---- the tabard: long, black, hanging to the shins, bordered in cracked gold leaf; the cloth answers the stance:
  // tension folds pulled from the hip that carries the weight down across to the eased far knee, the folds breaking
  // over that knee, long straight folds dropping from the girdle on the near side
  f.bone('skirt');
  { const hem = X.charHem(f, [cx - 250, 1770], [cx + 262, 1770], 10, 22, [0, 1]); const sk = [S.at(-0.66, 0.92), S.at(0.62, 0.9), [cx + 228, 1300], [cx + 262, 1690], ...hem.slice().reverse(), [cx - 250, 1700], [cx - 218, 1300]];
    f.part(sk, CLB(f, { fill: '#2a2630', maxShade: 26 }));
    X.clipDraw(f, E.smooth(sk), () => {
      for (const [a0, a1, a2, w] of [[S.at(-0.5, 1.0), [cx - 150, 1380], [cx - 168, 1750], 18], [S.at(-0.2, 1.0), [cx - 66, 1400], [cx - 64, 1760], 16], [S.at(0.1, 1.0), [cx + 40, 1400], [cx + 46, 1762], 18], [S.at(0.36, 0.98), [cx + 136, 1380], [cx + 156, 1756], 16], [[cx - 14, 1480], [cx - 10, 1620], [cx - 16, 1756], 12], [[cx + 92, 1470], [cx + 98, 1620], [cx + 104, 1756], 14], [[cx + 196, 1420], [cx + 212, 1580], [cx + 228, 1740], 12]])
        X.fold2(f, E.smooth(sk), [a0, a1, a2], w, { dark: '#000', darkOp: 0.75, light: '#6a6272', lit: '#8a8094', col: '#040306', lightOp: 0.45 });
      X.softTone(f, E.smooth(sk), [[ell([cx + 70, 1478], 50, 34, 0, 14), '#7a7084', 0.2, 20]]); X.model(f, sk, { sz: 420, dark: 0.5, lite: 0.2, darkCol: '#000', litCol: '#8a8094', reflCol: '#4a4450', spec: 0 }); // the far knee pushing the cloth forward; the body's turn, its far side in shade // the far knee pushing the cloth forward; the near side in shade
      X.stains(f, E.smooth(sk), E.bbox(sk), '#08060a', 0.03, 3, -1.9, 43, 0.5);
      const bd = hem.map(q => add([q[0], q[1]], [0, -40])); f.line(bd, 26, INK); f.line(bd, 22, P.gold); X.clipDraw(f, `M${cx - 300},${1600} H${cx + 300} V${1840} H${cx - 300} Z`, () => { for (let i = 1; i < bd.length - 1; i += 2) f.line([add(bd[i], [0, -10]), add(bd[i], [4, 10])], 3, P.blackD, { op: 0.85 }); });
      X.vcrack(f, [[cx + 10, 1120], [cx - 6, 1230], [cx + 14, 1340], [cx + 4, 1420]], 14, { dark: '#0a080c', lip: '#6a6070' }); // the void crack running on down through the cloth
      for (let i = 0; i < 4; i++) X.burnHole(f, [R(f, cx - 180, cx + 180), R(f, 1250, 1560)], R(f, 5, 10), f.r() * 3);
    });
    X.charEdge(f, hem, 6, { gap: 8 });
    for (const e of [[S.at(-0.66, 0.92), [cx - 218, 1300], [cx - 238, 1580]], [S.at(0.62, 0.9), [cx + 228, 1300], [cx + 250, 1580]]]) { f.line(e, 22, INK); f.line(e, 18, P.gold); f.line(e.map(q => add(q, mul(f.L, 3))), 2, P.goldL, { op: 0.6 }); for (let k = 0; k < 6; k++) { const q = lerp(e[k < 3 ? 0 : 1], e[k < 3 ? 1 : 2], (k % 3) * 0.3 + 0.15); f.line([add(q, [-9, 0]), add(q, [9, 6])], 2.6, P.blackD); } }
  }
  // ---- torso: turned three-quarters, the chest's near plane lit, the far side turning into shade; void cracks down it
  f.bone('torso');
  const tor = S.shape([[-0.04, 0.62, 0.56], [0.1, 0.86, 0.8], [0.26, 0.84, 0.8], [0.46, 0.7, 0.66], [0.66, 0.6, 0.6], [0.86, 0.66, 0.64], [1.0, 0.7, 0.66]]);
  f.part(tor, SKG({ maxShade: 30 }));
  X.clipDraw(f, E.smooth(tor), () => {
    X.model(f, tor, { sz: 300, dark: 0.45, lite: 0.25, darkCol: '#1a1420', litCol: '#fff4e0', reflCol: '#8a8090', specCol: '#ffffff', spec: 0.15 });
    X.crease(f, [S.at(-0.5, 0.36), S.at(-0.2, 0.4), S.at(0.05, 0.36)], 2.4, { col: '#2a2030', lit: '#f0e6d2' }); X.crease(f, [S.at(0.12, 0.36), S.at(0.34, 0.4), S.at(0.5, 0.34)], 2.2, { col: '#2a2030', lit: '#f0e6d2' }); // the pectorals' lower edge
    for (let i = 0; i < 3; i++) X.crease(f, [S.at(-0.5, 0.5 + i * 0.08), S.at(-0.3, 0.54 + i * 0.08)], 1.6, { col: '#2a2030', lit: '#f0e6d2', op: 0.5 }); // the ribs on the near side
    X.vcrack(f, [S.at(0.08, 0.04), S.at(0.12, 0.2), S.at(0.06, 0.36), S.at(0.12, 0.5)], 16, { dark: '#2a2030', lip: '#f0e6d2' });
    X.crackV(f, S.at(0.1, 0.28), 2.4, 90, 6, { depth: 2, dark: '#2a2030', lip: '#f0e6d2' }); X.crackV(f, S.at(0.08, 0.4), 0.7, 80, 5, { depth: 1, dark: '#2a2030', lip: '#f0e6d2' });
  });
  // the tabard's upper part over the chest, open at the neck in a V where the crack shows, folds from the shoulders
  { const tb = [S.at(-0.6, 0.06), S.at(-0.1, 0.02), S.at(0.1, 0.5, 1), S.at(0.28, 0.0), S.at(0.6, 0.06), S.at(0.62, 0.5), S.at(0.6, 0.92), S.at(-0.66, 0.94), S.at(-0.64, 0.5)];
    f.part(tb, CLB(f, { fill: '#2a2630', maxShade: 26 })); X.model(f, tb, { sz: 380, dark: 0.5, lite: 0.22, darkCol: '#000', litCol: '#8a8094', reflCol: '#4a4450', spec: 0 });
    X.clipDraw(f, E.smooth(tb), () => { X.fold2(f, E.smooth(tb), [S.at(-0.42, 0.1), S.at(-0.4, 0.5), S.at(-0.44, 0.9)], 14, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 }); X.fold2(f, E.smooth(tb), [S.at(0.42, 0.1), S.at(0.36, 0.5), S.at(0.3, 0.9)], 12, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 }); X.vcrack(f, [S.at(0.12, 0.56), S.at(0.06, 0.74), S.at(0.12, 0.92)], 12, { dark: '#0a080c', lip: '#6a6070' }); X.burn(f, S.at(0.4, 0.1), 1.4, 160, 2.4, { depth: 3, scorch: '#0a0610' }); });
    const e = [S.at(-0.1, 0.02), S.at(0.1, 0.5), S.at(0.28, 0.0)]; f.line(e, 18, INK); f.line(e, 14, P.gold); f.line(e.map(q => add(q, mul(f.L, 2))), 2, P.goldL, { op: 0.6 }); for (let k = 0; k < 5; k++) { const q = lerp(e[k < 3 ? 0 : 1], e[k < 3 ? 1 : 2], (k % 3) * 0.35 + 0.15); f.line([add(q, [-6, 0]), add(q, [6, 4])], 2.4, P.blackD); } }
  // the girdle of plaited cord: twice round the waist, knotted, the ends hanging; the weight-stone and the string of weights
  { const g0 = S.at(-0.68, 0.9), g1 = S.at(0.0, 0.94), g2 = S.at(0.62, 0.88); X.rope(f, [g0, g1, g2], 9, '#8a7a5a'); X.rope(f, [add(g0, [0, 18]), add(g1, [0, 18]), add(g2, [0, 18])], 9, '#7a6a4a');
    const kn = S.at(0.16, 0.98); f.part(ell(kn, 16, 14, 0, 12), X.GR(f, { fill: '#7a6a4a', maxShade: 4, cast: false })); X.rope(f, [kn, add(kn, [10, 70]), add(kn, [4, 150])], 7, '#7a6a4a', { fray: true }); X.rope(f, [kn, add(kn, [-14, 60]), add(kn, [-18, 128])], 7, '#8a7a5a', { fray: true });
    const ws = S.at(-0.5, 0.98); X.rope(f, [ws, add(ws, [-2, 50])], 4, '#4a4038'); f.part([add(ws, [-26, 50]), add(ws, [22, 50]), add(ws, [30, 110]), add(ws, [-32, 110])], X.GR(f, { fill: '#6a6870', light: '#a8a6ae', maxShade: 10, tex: 'chisel' + seed, texOp: 0.6 })); f.part(ell(add(ws, [0, 50]), 14, 6, 0, 10), X.GR(f, { fill: '#4a4850', maxShade: 2, cast: false })); X.crackV(f, add(ws, [10, 90]), -1.2, 30, 3, { depth: 1, dark: '#1a1820', lip: '#a8a6ae' }); // the weight-stone
    const sw = S.at(0.46, 0.96); const cord = [sw, add(sw, [6, 60]), add(sw, [2, 130]), add(sw, [8, 190])]; X.rope(f, cord, 3, '#4a4038'); [16, 13, 11, 9, 7].forEach((r, k) => { const q = lerp(cord[0], cord[3], 0.2 + k * 0.18); X.gilt(f, [add(q, [-r, -r * 0.7]), add(q, [r, -r * 0.7]), add(q, [r, r * 0.7]), add(q, [-r, r * 0.7])], { sz: r * 1.4, chips: 0, cell: 20, s: 0.2, lite: 0.45 }); }); }
  // ---- the head: narrow, impassive, eyes closed, set square on the beam (it leans with it); the needle out of its crown
  f.bone('head');
  const nk = limb(add(P0, mul(up, 10)), add(HC, mul(up, -70)), 104, 92); f.part(nk, SKG()); X.model(f, nk, { sz: 100, dark: 0.4, lite: 0.2, darkCol: '#1a1420', litCol: '#fff4e0', reflCol: '#8a8090', spec: 0 });
  const hd = angelHead(f, HC, H, hA, { head: { jaw: 0.84, chin: 0.0, nose: 1.05, mouth: 'set', squint: 0.9, blind: true, browDown: 0.0, browW: 0.035, hairCol: '#3a3440',
    hair: [[-0.44, 0.0], [-0.46, -0.26], [-0.3, -0.5], [-0.04, -0.56], [0.18, -0.52], [0.26, -0.42], [0.06, -0.46], [-0.14, -0.4], [-0.28, -0.16], [-0.32, 0.0]] },
    inFace: F => { f.line(F([[0.05, -0.06], [0.11, -0.048], [0.17, -0.06]]), 2.2, INK); f.line(F([[0.27, -0.065], [0.31, -0.058]]), 1.8, INK); f.line(F([[0.06, -0.035], [0.12, -0.03], [0.16, -0.038]]), 1.2, '#6a5a66', { op: 0.6 }); X.burn(f, F([[0.0, -0.4]])[0], 1.4, 60, 1.6, { depth: 2, haloOp: 0.25 }); X.hairline(f, F([[0.2, 0.1], [0.24, 0.26], [0.2, 0.4]]), 1.4); } });
  { const roots = []; for (let i = 0; i < 7; i++) { const t = i / 6, q = hd([[-0.36 + t * 0.48, -0.36 - Math.sin(t * Math.PI) * 0.16]])[0]; roots.push([q, Math.atan2(up[1], up[0]) - 0.6 + t * 1.2]); } X.standingHair(f, roots, 24, { pal: ['#2a2430', '#3a3440', '#5a5060'], w: 5, gap: false }); }
  { const r = crown; f.part(ell(r, 26, 12, hA, 14), X.GR(f, { fill: '#5a5860', maxShade: 4, cast: false })); weld(f, [add(r, rot([-26, 4], hA)), add(r, rot([0, 10], hA)), add(r, rot([26, 4], hA))], 6, X.GR(f, { fill: '#7a7880', light: '#c8c6d0', shadow: '#1a1820' }), { runs: 1 }); } // the needle's root fused into the skull
  // ---- the beam's pivot: where both arms run into the body the collarbones are the beam itself, a forged bar through
  // the shoulder girdle with its knife-edge pivot boss at the sternal notch, the needle's line running up from it
  f.bone('bar');
  { const cb = ell(P0, 70, 40, Math.atan2(dB[1], dB[0]), 16); X.vcrack(f, [add(P0, mul(dB, -150)), add(P0, add(mul(dB, -80), mul(up, -10))), add(P0, mul(dB, -30))], 7, { dark: P.goldS }); X.vcrack(f, [add(P0, mul(dB, 30)), add(P0, add(mul(dB, 80), mul(up, -8))), add(P0, mul(dB, 130))], 7, { dark: P.goldS }); // the beam's metal showing along the collarbones
    const bs = [add(P0, mul(dB, -70)), add(P0, mul(up, 26)), add(P0, mul(dB, 70)), add(P0, mul(up, -26))].map(q => [...q, 1]); X.gilt(f, ell(P0, 30, 30, 0, 16), { look: { fill: '#8a6a24' }, sz: 40, chips: 0, cell: 30, s: 0.3 });
    X.gilt(f, bs, { look: { fill: '#9a7a30' }, sz: 70, cell: 30, s: 0.4, chips: 1, lite: 0.5 }); f.flat(ell(P0, 12, 12, 0, 12), P.void); f.line(ell(P0, 16, 16, 0, 14).slice(0, 8), 2, P.goldW, { op: 0.7 }); // the pivot boss and its pin hole
  }
  // ---- the near arm in front, out along the beam to the low end; its pan, heaped with ash
  arm(SN, EN, wN, [132, 92, 70], 0, '_n');
  pan(add(wN, [-50, 0]), panN, -1, ['chain_n', 'pan_n'], true);
  f.bone('root');
  f.flat(ell([cx, gy + 2], 340, 12, 0, 20), '#000', { op: 0.32 });
  X.leafDrift(f, [cx, 1000], 600, 500, 12, 1.4);
  return X.toneGold(f);
}

// ------------------------------------------------------------------ THE WHEEL OF THRONES (ruler 4)
// It carried the god's seat. It is still turning, looking for the weight. One of the Thrones, the living wheels that bore
// the Mother's seat: two great wheels, one set inside the other at right angles, turning slowly above a broken floor, the
// lowest point of the outer rim grinding along the floor and carrying its weight there. Built in 3D and projected by an
// orthographic camera (turned 40 degrees, a little below), so the rims have their thickness (a side face, a tread as
// broad as a road, an inner face), the inner wheel stands across the outer in perspective, and the eyes are set into
// the rims' faces with lids, each turned with its face. The upper rims run out of the frame top; the near rim is cut by
// the frame's edge (true size: 2560 px across, four humans). Gold leaf cracked over black, laid as plates (every rim
// segment its own plate, some cracks opened onto void), shaded by the key light; violet Lichtenberg burns across rims and
// spokes. Details: the hub a lump of metal fused by the strike, the Mother's seal stamped on it half melted, the largest
// eye closed in it; several snapped spokes; a sector of the outer rim missing with clean edges, darkness behind; the
// empty socket of the seat on top with its bolts sheared; the chariot's traces trailing from the axle with harness rings
// pulling nothing; tatters of the canopy caught in the spokes; an inscription band round the inner edge; scorched iron
// tyre bands, one sprung loose; a feather caught in a spoke; drips of molten gold frozen on the underside; chunks of
// floating ruin carried round; a cracked halo hung on one spoke.
// Rig: wheel (root, the hub; turns the whole) > outer, inner (each turns on its own axle in the animation as an engine
// transform; drawn here as separate layers), hub_eye (inner), traces (wheel), floor (static).
// Motion: idle a slow grinding turn, the eyes rolling past; attack the wheels spinning up and the hub eye opening, a
// discharge from every eye (engine FX).
function wheelOfThrones() {
  const CW = 2000, CH = 2400, seed = 1520;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY;
  const V = X.v3;
  const RO = 1280, tO = 160, wO = 300, RI = 920, tI = 124, wI = 230, bO = 28, bI = 22;
  const yaw = 0.7, pitch = -0.06;
  // find the centre so the outer rim's lowest point sits on the floor
  let cam = X.camera([0, 0], yaw, pitch, 1);
  let low = -1e9; for (let i = 0; i < 360; i++) { const th = i / 360 * Math.PI * 2; for (const s of [-1, 1]) { const q = cam.P3([RO * Math.cos(th), RO * Math.sin(th), s * wO / 2]); low = Math.max(low, q[1]); } }
  const O2 = [1010, gy - 6 - low];
  cam = X.camera(O2, yaw, pitch, 1);
  const P3 = cam.P3, V3 = cam.V3, pr = p => P3(p).slice(0, 2);
  // the key light in camera space: from the upper RIGHT of the drawing (foeBase), so from the upper left after the
  // flip, and from in front (independent review: it was set from the drawing's left, i.e. from the right in the game)
  const LC = V.norm([0.55, -0.72, -0.42]);
  const outer = { u: [1, 0, 0], v: [0, 1, 0], a: [0, 0, 1], R: RO, t: tO, w: wO, b: bO };
  const inner = { u: [0, 0, 1], v: [0, 1, 0], a: [1, 0, 0], R: RI, t: tI, w: wI, b: bI };
  const pt = (W, th, r, z) => V.add(V.add(V.mul(W.u, r * Math.cos(th)), V.mul(W.v, r * Math.sin(th))), V.mul(W.a, z));
  const radial = (W, th) => V.add(V.mul(W.u, Math.cos(th)), V.mul(W.v, Math.sin(th)));
  const tang = (W, th) => V.add(V.mul(W.u, -Math.sin(th)), V.mul(W.v, Math.cos(th)));
  const facing = n => V3(n)[2] < -0.02;
  const lam = n => V.dot(V.norm(V3(n)), LC);
  // one continuous ramp of gilt values from the turned-away black to the burnished light (no per-plate jitter: the
  // first build's random tint per segment is what made the rims read as planks)
  const RAMP = ['#120a04', '#2e200a', '#523c14', '#785c22', '#9c7c32', '#bc9a48', '#d6b66a', '#ecd498'];
  const ramp = l => { const t = Math.max(0, Math.min(1, (l + 0.5) / 1.4)) * (RAMP.length - 1), i = Math.min(RAMP.length - 2, Math.floor(t)); return mix(RAMP[i], RAMP[i + 1], t - i); };
  f.joint('wheel', O2).joint('outer', O2, 'wheel').joint('inner', O2, 'wheel').joint('hub_eye', O2, 'inner').joint('traces', O2, 'wheel').joint('floor', [1000, gy - 40]);
  // the rim's cross-section, bevelled: [r, z] corners round the loop tread > chamfer > side B > chamfer > inner face >
  // chamfer > side A > chamfer; each edge of the loop is one face, with its kind and its normal (radial / axial mix)
  const XS = W => { const h = W.w / 2, R0 = W.R, Ri = W.R - W.t, b = W.b; return { c: [[R0, -h + b], [R0, h - b], [R0 - b, h], [Ri + b, h], [Ri, h - b], [Ri, -h + b], [Ri + b, -h], [R0 - b, -h]], k: ['tread', 'chamf', 'sideB', 'chamf', 'inner', 'chamf', 'sideA', 'chamf'], n: [[1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7], [0, -1], [0.7, -0.7]] }; };
  const fnorm = (W, th, nn) => V.norm(V.add(V.mul(radial(W, th), nn[0]), V.mul(W.a, nn[1])));
  // a plate crack across a face (gold leaf laid in plates: black only along the cracks between them, some opened)
  const plateCrack = (a, b, w) => { const m = add(lerp(a, b, 0.5), [R(f, -5, 5), R(f, -5, 5)]); if (f.r() < 0.3) { f.line([a, m, b], w * 2.6, P.blackD, { op: 0.95 }); f.line([a, m, b].map(q => add(q, mul(f.L, -2))), 1.2, P.goldW, { op: 0.6 }); } else f.line([a, m, b], w, P.blackD, { op: 0.8 }); };
  // one segment of a rim, the faces in `kinds` that face the camera, smooth-shaded from the ramp; inner faces and the
  // inside chamfers darkened for occlusion (the inside of a ring gets little light); ink only on the silhouette edges
  // (strong) and the bevel creases (faint), never on the radial cuts between segments, so the rim reads as one solid
  const seg = (W, th0, th1, kinds, o = {}) => {
    const S = XS(W), thm = (th0 + th1) / 2, out = [];
    const quads = S.c.map((c0, i) => { const c1 = S.c[(i + 1) % 8]; return [pt(W, th0, c0[0], c0[1]), pt(W, th1, c0[0], c0[1]), pt(W, th1, c1[0], c1[1]), pt(W, th0, c1[0], c1[1])]; });
    const nrm = S.n.map(nn => fnorm(W, thm, nn)), fac = nrm.map(facing);
    for (let i = 0; i < 8; i++) {
      if (!fac[i] || !kinds.includes(S.k[i])) continue;
      const q = quads[i].map(pr), occ = S.k[i] === 'inner' ? 0.45 : (S.n[i][0] < 0 ? 0.65 : 1), l = lam(nrm[i]) * occ - (1 - occ) * 0.35;
      const col = ramp(l + (o.tone ?? 0));
      f.flat(q, col, { sharp: true, stroke: col, sw: 1.6 });
      f.flat(q, `url(#craq${seed})`, { sharp: true, op: 0.13 });
      if (l < -0.1) f.flat(q, `url(#hatch${seed})`, { sharp: true, op: Math.min(0.5, 0.2 - l * 0.5) });
      if (S.k[i] === 'chamf' && l > 0.3) f.line([q[0], q[1]], 1.6, '#fff2cc', { straight: true, op: 0.5 + Math.min(0.4, l - 0.3) }); // a burnished bevel
      // the two long edges: silhouette (the neighbour face turned away) in strong ink, a crease in faint
      for (const [e, nb] of [[[q[0], q[1]], (i + 7) % 8], [[q[3], q[2]], (i + 1) % 8]]) f.line(e, fac[nb] ? 0.9 : 2.4, INK, { straight: true, op: fac[nb] ? 0.35 : 0.9 });
      if (o.crack && S.k[i] !== 'chamf') plateCrack(lerp(q[0], q[1], 0.5), lerp(q[3], q[2], 0.5), 1.2);
      if (S.k[i] === 'chamf' && f.r() < 0.12) { const c = lerp(lerp(q[0], q[1], R(f, 0.2, 0.8)), lerp(q[3], q[2], 0.5), 0.5); f.flat(ell(c, R(f, 5, 10), R(f, 3, 6), R(f, 0, 3), 7), P.black); } // a chip off the arris
      out.push([S.k[i], q, quads[i], nrm[i]]);
    }
    return out;
  };
  const depth = p3 => P3(p3)[2];
  const gapO = [0.42, 0.9]; // the missing sector of the outer rim (radians; y down, so this is the lower right)
  const inGap = th => { const t = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return t > gapO[0] && t < gapO[1]; };
  const NO = 120, NI = 90;
  const crackEvery = () => f.r() < 0.22;

  // ---- the floor: broken gilded slabs, the groove the rim grinds, rubble
  f.bone('floor');
  { const fl = [[-20, gy - 70], [400, gy - 92], [760, gy - 60], [1180, gy - 84], [1600, gy - 66], [2020, gy - 90], [2020, CH], [-20, CH]];
    X.gilt(f, fl, { look: { fill: '#6a5020' }, sz: 90, cell: 110, s: 1.2, chips: 4, open: 0.2, dark: 0.35 });
    X.clipDraw(f, E.smooth(fl), () => { for (const x of [240, 620, 1420, 1800]) X.crackV(f, [x, gy - 60], 1.4 + R(f, -0.4, 0.4), 120, 7, { depth: 2, dark: P.goldS }); X.softTone(f, E.smooth(fl), [[ell([1010, gy - 30], 520, 34, 0, 20), '#0a0604', 0.6, 20]]); });
    for (let i = 0; i < 9; i++) X.chip(f, [R(f, 300, 1700), gy - R(f, 10, 50)], R(f, 10, 28), X.GILT(f, { maxShade: 6 }));
  }
  // ---- 1. the outer rim's inner face (and its inside chamfers) seen through the hole: the far half
  f.bone('outer');
  for (let i = 0; i < NO; i++) { const th0 = i / NO * Math.PI * 2, th1 = (i + 1) / NO * Math.PI * 2; if (inGap(th0 + 0.01) || inGap(th1 - 0.01)) continue; seg(outer, th0, th1, ['inner'], { crack: crackEvery() }); }
  // ---- 2. the inner wheel's back half (behind the outer wheel's plane), far to near
  f.bone('inner');
  const iSegs = []; for (let i = 0; i < NI; i++) { const th0 = i / NI * Math.PI * 2, th1 = (i + 1) / NI * Math.PI * 2, m = pt(inner, (th0 + th1) / 2, RI - tI / 2, 0); iSegs.push({ th0, th1, z: m[2], d: depth(m) }); }
  const spokesI = [0.5, 1.15, 2.0, 2.6, 3.6, 4.15, 5.2, 5.75].map((a, k) => ({ a, snap: k === 3 || k === 6 ? R(f, 0.45, 0.7) : 1 }));
  // a spoke: an octagonal bar, thick at the hub and tapering out to the rim, smooth-shaded, ink on its silhouette only;
  // a snapped one ends in a jagged break (gilt skin round the black core) with shards
  const spokeDraw = (W, sp, wid) => {
    const r0 = 230, rr = r0 + (W.R - W.t + 10 - r0) * sp.snap, dA = radial(W, sp.a), tA = tang(W, sp.a), NN = 8;
    const ring = (r, k) => { const P = V.mul(dA, r), out = []; for (let j = 0; j < NN; j++) { const g = (j + 0.5) / NN * Math.PI * 2; out.push(V.add(P, V.add(V.mul(tA, Math.cos(g) * wid * k / 2), V.mul(W.a, Math.sin(g) * wid * k / 2)))); } return out; };
    const kE = 0.72 + 0.28 * (1 - sp.snap), c0 = ring(r0, 1.12), c1 = ring(rr, sp.snap < 1 ? kE : 0.74);
    const nrm = []; for (let j = 0; j < NN; j++) { const g = (j + 1) / NN * Math.PI * 2; nrm.push(V.norm(V.add(V.mul(tA, Math.cos(g)), V.mul(W.a, Math.sin(g))))); }
    const fac = nrm.map(facing);
    for (let j = 0; j < NN; j++) {
      if (!fac[j]) continue;
      const q = [c0[j], c1[j], c1[(j + 1) % NN], c0[(j + 1) % NN]].map(pr), l = lam(nrm[j]), col = ramp(l);
      f.flat(q, col, { sharp: true, stroke: col, sw: 1.4 }); f.flat(q, `url(#craq${seed})`, { sharp: true, op: 0.13 });
      if (l < -0.1) f.flat(q, `url(#hatch${seed})`, { sharp: true, op: Math.min(0.5, 0.2 - l * 0.5) });
      for (const [e, nb] of [[[q[0], q[1]], (j + NN - 1) % NN], [[q[3], q[2]], (j + 1) % NN]]) f.line(e, fac[nb] ? 0.8 : 2.2, INK, { straight: true, op: fac[nb] ? 0.3 : 0.9 });
      if (f.r() < 0.25) plateCrack(lerp(q[0], q[3], 0.5), lerp(q[1], q[2], R(f, 0.3, 0.6)), 1);
    }
    if (sp.snap < 1) { const e = c1.map(pr).map(q => [q[0] + R(f, -7, 7), q[1] + R(f, -7, 7)]), cc = pr(V.mul(dA, rr)); f.flat(e, '#2a2430', { sharp: true }); f.flat(e.map(q => lerp(q, cc, 0.3)), P.black, { sharp: true }); f.line([...e, e[0]], 2, INK, { straight: true }); f.line(e.slice(0, 4), 1.6, P.goldW, { straight: true, op: 0.7 }); X.fusedRun(f, add(cc, [0, wid * 0.3]), R(f, 24, 44), 8, AR(f)); X.shards(f, cc, Math.atan2(pr(V.add(V.mul(dA, rr + 10), [0, 0, 0]))[1] - cc[1], pr(V.add(V.mul(dA, rr + 10), [0, 0, 0]))[0] - cc[0]), 3, 1.3, { fill: '#2a2430', rim: P.goldD }); }
    return { c0, c1, P0: V.mul(dA, r0), P1: V.mul(dA, rr), dA };
  };
  const iBack = iSegs.filter(s => s.z > 0).sort((p, q) => q.d - p.d), iFront = iSegs.filter(s => s.z <= 0).sort((p, q) => q.d - p.d);
  const ALL = ['tread', 'chamf', 'sideA', 'sideB', 'inner'];
  for (const s of iBack) seg(inner, s.th0, s.th1, ALL, { crack: crackEvery(), tone: -0.08 });
  for (const sp of spokesI) if (pt(inner, sp.a, 400, 0)[2] > 0) spokeDraw(inner, sp, 74);
  // ---- 3. the outer wheel's spokes (in its own plane), several snapped; the hub's cast shadow along their roots
  f.bone('outer');
  const spokesO = [0.28, 0.66, 2.2, 2.62, 3.4, 3.86, 5.02, 5.58].map((a, k) => ({ a, snap: k === 1 ? 0.62 : k === 4 ? 0.5 : 1 }));
  const so = spokesO.map(sp => spokeDraw(outer, sp, 100));
  { const hubC0 = pr([0, 0, 0]); X.softTone(f, so.map(sp => E.smooth([...sp.c0.map(pr), ...sp.c1.map(pr).reverse()].map(z => [...z, 1]))).join(' '), [[ell(add(hubC0, mul(f.L, -90)), 420, 380, 0, 24), '#0a0604', 0.4, 60]]); } // the hub's shadow thrown down the spokes (clipped to them, never into the air)
  // ---- 4. the outer wheel's near side face as one plane (between its bevels): leaf plates, a value range across it,
  // the inscription band, deep lidded eyes set into it, burns
  const sgn = facing(V.mul(outer.a, -1)) ? -1 : 1;
  { const origin = pr(V.mul(outer.a, sgn * wO / 2)), U = V3(outer.u).slice(0, 2), Vv = V3(outer.v).slice(0, 2), nS = V.mul(outer.a, sgn), lS = lam(nS);
    X.onPlane(f, origin, U, Vv, () => {
      const ring = [], N = 160, r1 = RO - bO, r0 = RO - tO + bO;
      for (let i = 0; i <= N; i++) { const th = gapO[1] + (2 * Math.PI - (gapO[1] - gapO[0])) * i / N; ring.push([r1 * Math.cos(th), r1 * Math.sin(th), i === 0 || i === N ? 1 : 0]); }
      for (let i = N; i >= 0; i--) { const th = gapO[1] + (2 * Math.PI - (gapO[1] - gapO[0])) * i / N; ring.push([r0 * Math.cos(th), r0 * Math.sin(th), i === 0 || i === N ? 1 : 0]); }
      const rD = E.smooth(ring);
      f.part(ring, X.GILT(f, { fill: ramp(lS), maxShade: 30, cast: false, inkW: 2.4, inkHeavy: 3.4 }));
      X.leaf(f, ring, { cell: 130, s: 1.4, chips: 14, open: 0.22, burnish: false });
      X.clipDraw(f, rD, () => {
        // a value range across the face: lit toward the key light, falling off into a core of shade on the far side of
        // the wheel; the inner edge darkened by the inside of the ring, the outer edge with a thin reflected light
        const Lp = f.L; // already carried into the plane's space by onPlane
        X.softTone(f, rD, [
          [ell(mul(Lp, -RO * 0.75), RO * 1.1, RO * 1.1, 0, 40), '#0c0604', 0.5, 120],
          [ell(mul(Lp, RO * 0.9), RO * 0.7, RO * 0.7, 0, 40), '#f0d48c', 0.35, 110],
          [ell([0, 0], r0 + 34, r0 + 34, 0, 80).concat(ell([0, 0], r0 - 30, r0 - 30, 0, 80).reverse()), '#0a0604', 0.55, 14],
          [ell([0, 0], r1 - 6, r1 - 6, 0, 80).concat(ell([0, 0], r1 - 22, r1 - 22, 0, 80).reverse()), '#c09a50', 0.35, 4],
        ]);
        X.formHatch(f, Array.from({ length: 12 }, (_, i) => { const th = Math.atan2(-Lp[1], -Lp[0]) - 0.9 + i * 0.16; return [(r0 + 40) * Math.cos(th), (r0 + 40) * Math.sin(th)]; }), 40, { op: 0.35 });
        // the inscription band round the inner edge: a sunk band of glyphs
        const bandR0 = r0 + 14, bandR1 = r0 + 52;
        f.flat(ell([0, 0], bandR1 + 4, bandR1 + 4, 0, 120).concat(ell([0, 0], bandR0 - 4, bandR0 - 4, 0, 120).reverse()), '#0a0604', { op: 0.3 });
        for (let i = 0; i < 170; i++) { const th = i / 170 * Math.PI * 2; if (inGap(th) || inGap(th + 0.04)) continue; const c = [((bandR0 + bandR1) / 2) * Math.cos(th), ((bandR0 + bandR1) / 2) * Math.sin(th)], tn = th + Math.PI / 2, g = Math.floor(f.r() * 4), L = [[[0, -13], [0, 13]], [[-8, -13], [0, 13], [8, -13]], [[-8, -13], [8, -13], [0, 0], [8, 13]], [[-8, 0], [8, 0], [0, -13], [0, 13]]][g].map(p => add(c, rot(p, tn - Math.PI / 2))); f.line(L, 5, P.blackD, { op: 0.9 }); f.line(L.map(q => add(q, mul(Lp, 1.6))), 1.8, P.goldL, { op: 0.55 }); }
        f.line(ell([0, 0], bandR0 - 6, bandR0 - 6, 0, 120), 3, P.blackD, { op: 0.7 }); f.line(ell([0, 0], bandR1 + 6, bandR1 + 6, 0, 120), 3, P.blackD, { op: 0.7 });
        // eyes of different sizes set deep into the face between the band and the outer edge, lidded and wet, each at
        // its own point of a blink (one shut), rolling with the wheel
        const eyes = [[1.3, 50, 0.6], [1.62, 34, 0.15], [1.95, 58, 0.5], [2.3, 40, 0.75], [2.65, 52, 0.3], [2.98, 36, 0.62], [3.3, 56, 0.0], [3.65, 44, 0.5], [3.98, 38, 0.7], [1.02, 40, 0.4], [4.32, 58, 0.55], [4.72, 42, 0.2], [5.1, 50, 0.6], [5.5, 36, 0.45], [5.9, 56, 0.7], [6.22, 44, 0.35], [0.2, 50, 0.6]];
        for (const [th, sz, op] of eyes) { if (inGap(th)) continue; const c = [(RO - tO * 0.36) * Math.cos(th), (RO - tO * 0.36) * Math.sin(th)], a = th + Math.PI / 2 + Math.PI;
          if (op < 0.05) { X.softTone(f, rD, [[ell(c, sz * 1.7, sz * 1.1, a, 16), '#0a0604', 0.5, sz * 0.25]]); const lidS = ell(c, sz * 1.08, sz * 0.5, a, 18); f.part(lidS, X.GILT(f, { fill: '#8a6a26', maxShade: sz * 0.2, cast: false, inkW: 1.6 })); X.model(f, lidS, { sz: sz * 0.8, dark: 0.5, lite: 0.4 }); f.stroke(ell(c, sz, sz * 0.1, a, 16).slice(0, 9), 3.4, INK); for (let k = 0; k < 7; k++) { const q = add(c, rot([(-0.8 + k * 0.27) * sz, sz * 0.08], a)); f.line([q, add(q, rot([0, sz * 0.26], a))], 1.6, INK); } }
          else X.deepEye(f, c, sz, a, { lid: X.GILT(f, { fill: '#8a6a26' }), open: op, gaze: [R(f, -0.6, 0.6), R(f, -0.4, 0.4)], iris: f.r() < 0.3 ? P.goldM : P.vio, lashes: sz > 45 }); }
        for (const th of [1.5, 2.5, 3.5, 5.3, 0.1]) X.burn(f, [(RO - tO * 0.5) * Math.cos(th), (RO - tO * 0.5) * Math.sin(th)], th + Math.PI / 2 + R(f, -0.4, 0.4), 260, 3.4, { depth: 3, haloOp: 0.4 });
      });
    });
  }
  // ---- 4b. the missing sector: the void has taken it cleanly, so the darkness behind keeps the rim's own shape (a
  // hole in the world where the rim was, as the Rift Hound is a hound-shaped hole), its edges clean and violet-rimmed,
  // stars in it; the two cut ends are clean faces of the rim's black core under its skin of leaf
  { const NG = 16, faces = [];
    for (let i = 0; i < NG; i++) { const th0 = gapO[0] + (gapO[1] - gapO[0]) * i / NG, th1 = gapO[0] + (gapO[1] - gapO[0]) * (i + 1) / NG, S = XS(outer);
      for (let k = 0; k < 8; k++) { const c0 = S.c[k], c1 = S.c[(k + 1) % 8], q = [pt(outer, th0, c0[0], c0[1]), pt(outer, th1, c0[0], c0[1]), pt(outer, th1, c1[0], c1[1]), pt(outer, th0, c1[0], c1[1])].map(pr); faces.push(q); } }
    for (const q of faces) f.line([...q, q[0]], 7, P.vioD, { straight: true, op: 0.9 });
    for (const q of faces) f.flat(q, P.void, { sharp: true, stroke: P.void, sw: 1.5 });
    faces.forEach((q, i) => { if (i % 8 === 0 || i % 8 === 6) { const bq = E.bbox(q); X.starfield(f, E.smooth(q.map(z => [...z, 1])), bq, 3); } }); // stars in the dark where the rim was
    { const g0 = pr(pt(outer, (gapO[0] + gapO[1]) / 2, RO - tO * 0.5, -wO / 2)); X.eye(f, g0, 30, 1.9, { lid: X.BK(f), open: 0.55, gaze: [-0.4, -0.2], iris: P.vio, mass: false }); X.shards(f, pr(pt(outer, gapO[1] - 0.05, RO + 10, 0)), 0.9, 4, 1.4); } // something looking in through it
    for (const th of gapO) { const S = XS(outer), q = S.c.map(c => pr(pt(outer, th, c[0], c[1]))), cc = pr(pt(outer, th, RO - tO / 2, 0));
      f.flat(q, '#1e1a22', { sharp: true }); f.flat(q.map(z => lerp(z, cc, 0.08)), '#0e0c12', { sharp: true }); f.line([...q, q[0]], 3, P.goldW, { straight: true, op: 0.8 }); f.line([...q, q[0]].map(z => lerp(z, cc, 0.06)), 1.6, P.vio, { straight: true, op: 0.7 }); }
  }
  // ---- 5. the hub: a lump of metal fused by the strike where both axles meet; the seal stamped on it, half melted;
  // the largest eye in it, closed, deep in a socket under a heavy lid
  f.bone('inner');
  const hubC = pr([0, 0, 0]);
  { const lump = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 300 * (0.9 + 0.1 * Math.sin(i * 2.7 + 1) + R(f, -0.04, 0.04)); lump.push(add(hubC, [Math.cos(a) * r, Math.sin(a) * r * 0.92])); }
    X.castOn(f, lump, 40, 0.5, so.map(sp => E.smooth([...sp.c0.map(pr), ...sp.c1.map(pr).reverse()].map(z => [...z, 1]))).join(' ')); // its shadow on the spokes only
    X.gilt(f, lump, { sz: 560, cell: 80, s: 1.1, chips: 4, dark: 0.6, lite: 0.4 });
    X.clipDraw(f, E.smooth(lump), () => { for (let k = 0; k < 6; k++) { const a = R(f, 0, 6.28), q = add(hubC, [Math.cos(a) * 180, Math.sin(a) * 170]); weld(f, [q, add(q, rot([60, 0], a + 1.6)), add(q, rot([110, 10], a + 1.6))], 12, AR(f), { runs: 1 }); } X.burn(f, add(hubC, [140, -120]), 2.5, 300, 3.4, { depth: 3 }); });
    const sc = add(hubC, [-110, -150]); f.line(ell(sc, 56, 50, 0, 24).slice(0, 14), 6, P.blackD); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + k / 6 * Math.PI * 2; if (a > 0.4 && a < 2.6) continue; f.line([add(sc, rot([20, 0], a)), add(sc, rot([48, 0], a))], 5, P.blackD); f.line([add(sc, rot([20, -2], a)), add(sc, rot([48, -2], a))], 1.6, P.goldL, { op: 0.6 }); }
    X.fusedRun(f, add(sc, [-20, 46]), 50, 10, AR(f)); X.fusedRun(f, add(sc, [26, 40]), 36, 8, AR(f));
    f.bone('hub_eye');
    const ec = add(hubC, [20, 50]), es = 170, lid = ell(ec, es * 1.2, es * 0.62, -0.05, 30);
    X.softTone(f, E.smooth(lump), [[ell(ec, es * 1.6, es * 1.0, -0.05, 24), '#0a0604', 0.6, 30]]); // the socket
    X.crease(f, ell(add(ec, [0, -es * 0.12]), es * 1.45, es * 0.92, -0.05, 24).slice(13, 24), 7, { col: '#0a0604', lit: '#f0d898', op: 0.8 }); // the brow's fold over it
    X.castOn(f, lid, 16, 0.5, E.smooth(lump));
    X.gilt(f, lid, { look: { fill: '#9a7a2a' }, sz: es * 1.1, cell: 50, s: 0.8, chips: 1, dark: 0.6, lite: 0.45 });
    const seam = []; for (let k = 0; k <= 16; k++) { const t = k / 16; seam.push(add(ec, [(-1.1 + 2.2 * t) * es, Math.sin(Math.PI * t) * es * 0.24])); }
    X.crease(f, seam.map((q, k) => add(q, [0, es * 0.2 + Math.sin(Math.PI * k / 16) * es * 0.08])).slice(2, 15), 4, { col: '#0a0604', lit: '#f0d898', op: 0.6 }); // the lower lid's fold
    f.stroke(seam, 8, P.blackD); f.line(seam.slice(1, 16).map(q => add(q, [0, 4])), 2.2, '#fff6e0', { op: 0.55 }); // the seam, wet along the lower lid
    for (let k = 2; k < 15; k += 1) { const q = seam[k], out = (k - 8) / 8, l = 14 + Math.sin(k / 16 * Math.PI) * 14; f.line([q, add(q, [out * l * 0.5, l * 0.55]), add(q, [out * l * 1.1, l * 0.8])], 2.2, P.blackD, { op: 0.85 }); } // short lashes, curving out
    f.line(seam.map((q, k) => add(q, [0, -es * 0.32 * Math.sin(Math.PI * k / 16)])), 3.4, '#2a1c08', { op: 0.75 }); // the lid's crease above
    f.line(seam.map((q, k) => add(q, [0, -es * 0.42 * Math.sin(Math.PI * k / 16)])).slice(3, 13), 2.4, '#f4dea4', { op: 0.5 }); // the lid's lit bulge
  }
  // ---- 6. the inner wheel's front half (in front of the outer wheel's plane), its spokes there; deep eyes on its tread
  f.bone('inner');
  for (const sp of spokesI) if (pt(inner, sp.a, 400, 0)[2] <= 0) spokeDraw(inner, sp, 74);
  const iEye = [];
  for (const s of iFront) { const out = seg(inner, s.th0, s.th1, ALL, { crack: crackEvery(), tone: -0.04 }); for (const [kind, q2, q3, n] of out) if (kind === 'tread' && f.r() < 0.16) iEye.push([s, q3, n]); }
  for (const [s, q3, n] of iEye) { const thm = (s.th0 + s.th1) / 2, c3 = pt(inner, thm, RI, 0), U = V3(tang(inner, thm)).slice(0, 2), Vv = V3(inner.a).slice(0, 2);
    X.onPlane(f, pr(c3), U, Vv, () => X.deepEye(f, [0, 0], R(f, 46, 66), 0, { lid: X.GILT(f, { fill: '#8a6a26' }), open: R(f, 0.15, 0.75), gaze: [R(f, -0.5, 0.5), 0.2], iris: P.vio, lashes: true })); }
  for (const th of [Math.PI * 0.85, Math.PI * 1.15, Math.PI * 0.6]) { const c = pr(pt(inner, th, RI - tI * 0.5, -60)); X.burn(f, c, -1.2 + R(f, -0.5, 0.5), 240, 3, { depth: 3, clip: [pr(pt(inner, th - 0.25, RI, -wI / 2)), pr(pt(inner, th + 0.25, RI, -wI / 2)), pr(pt(inner, th + 0.25, RI - tI, wI / 2)), pr(pt(inner, th - 0.25, RI - tI, wI / 2))] }); }
  // ---- the empty socket of the seat on top of the inner wheel: a gilt saddle with its bolts sheared
  { const th = -Math.PI / 2, c = pr(pt(inner, th, RI + 30, 0)), U = V3(tang(inner, th)).slice(0, 2), Vv = V3(inner.a).slice(0, 2);
    X.onPlane(f, c, mul(U, 1.6), mul(Vv, 1.6), () => { const sk = [[-150, -60], [150, -60], [170, 70], [120, 90], [-120, 90], [-170, 70]]; X.gilt(f, sk, { sz: 140, cell: 40, s: 0.7, chips: 2 }); f.flat([[-110, -40], [110, -40], [120, 60], [-120, 60]], P.blackD, { op: 0.7 }); for (const [x, y] of [[-130, -30], [130, -30], [-140, 60], [140, 60]]) { f.part(ell([x, y], 14, 14, 0, 10), { fill: P.iron, light: P.ironL, shade: 0.4, inkW: 1.2, cast: false }); f.flat(ell([x, y], 7, 7, 0, 8), '#c8c6ce'); f.line([[x - 9, y - 3], [x + 9, y + 3]], 1.4, P.ironD); } });
  }
  // ---- 7. the outer wheel's tread and outer bevels (near half), drawn far to near; scorched iron tyre bands over the
  // tread with their cast shadow, one sprung loose and curling off at the gap
  f.bone('outer');
  const treadQ = [];
  const oSegs = []; for (let i = 0; i < NO; i++) { const th0 = i / NO * Math.PI * 2, th1 = (i + 1) / NO * Math.PI * 2; if (inGap(th0 + 0.01) || inGap(th1 - 0.01)) continue; oSegs.push({ th0, th1, d: depth(pt(outer, (th0 + th1) / 2, RO, 0)) }); }
  for (const s of oSegs.sort((p, q) => q.d - p.d)) { const out = seg(outer, s.th0, s.th1, ['tread', 'chamf'], { crack: crackEvery() }); if (out.some(x => x[0] === 'tread')) treadQ.push([s.th0, s.th1]); }
  treadQ.sort((p, q) => p[0] - q[0]);
  const runs = []; for (const q of treadQ) { const last = runs[runs.length - 1]; if (last && Math.abs(last[last.length - 1][1] - q[0]) < 1e-6) last.push(q); else runs.push([q]); }
  for (const run of runs) for (const s of [-0.62, 0.62]) { const band = []; for (const [th0] of run) band.push(pr(pt(outer, th0, RO + 4, s * wO / 2))); band.push(pr(pt(outer, run[run.length - 1][1], RO + 4, s * wO / 2))); if (band.length < 3) continue; f.line(band.map(q => add(q, mul(f.L, -9))), 22, '#0a0604', { op: 0.45 }); f.line(band, 26, INK); f.line(band, 20, '#3a383e'); f.line(band.map(q => add(q, mul(f.L, 3))), 3, '#7a7880', { op: 0.6 }); for (let k = 0; k < band.length; k += 3) f.rivet(band[k], 6, '#4a4850'); X.clipDraw(f, `M0,0 H${CW} V${CH} H0 Z`, () => { for (let k = 2; k < band.length - 2; k += 7) X.soot(f, band[k], 16, 8, 0.5); }); }
  { const th = gapO[0] - 0.02, base = pt(outer, th, RO + 6, 0.62 * wO / 2); const tq = tang(outer, th), rq = radial(outer, th); const pts = [base]; for (let k = 1; k <= 6; k++) pts.push(V.add(V.add(base, V.mul(tq, -k * 70)), V.mul(rq, k * k * 9))); const pp = pts.map(pr); f.line(pp.map(q => add(q, mul(f.L, -10))), 22, '#0a0604', { op: 0.35 }); f.line(pp, 26, INK); f.line(pp, 20, '#3a383e'); f.line(pp.map(q => add(q, mul(f.L, 3))), 3, '#7a7880', { op: 0.6 }); X.charEdge(f, pp.slice(-2), 6, { gap: 20 }); } // the sprung band
  // ---- drips of molten gold frozen on the underside of the rim; ruin carried round; rags; the feather; the halo
  for (const th of [1.25, 1.45, 1.65, 1.9, 2.1]) { const q = pr(pt(outer, th, RO, R(f, -0.6, 0.6) * wO / 2)); X.fusedRun(f, q, R(f, 30, 70), R(f, 7, 12), AR(f)); }
  for (const th of [2.9, 3.6, 5.6]) { const q = pr(pt(outer, th, RO + 120, 0)); X.chip(f, q, R(f, 30, 60), X.GILT(f, { maxShade: 10 })); }
  { const sp = so[2], q = pr(V.mul(sp.dA, 700)); const rag = [q, add(q, [60, 20]), add(q, [70, 140]), add(q, [40, 260]), add(q, [10, 200]), add(q, [-20, 280]), add(q, [-30, 120])]; f.part(rag, CLB(f, { maxShade: 10 })); X.clipDraw(f, E.smooth(rag), () => { X.fold2(f, E.smooth(rag), [add(q, [20, 30]), add(q, [30, 140]), add(q, [20, 240])], 10, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 }); f.line([add(q, [-30, 120]), add(q, [70, 140])], 4, '#c8a050', { dash: '8 6' }); }); X.charEdge(f, rag.slice(3, 6), 6, { gap: 10 }); } // canopy tatters caught on a spoke
  { const sp = so[6], q = pr(V.mul(sp.dA, 820)); const rag = [q, add(q, [50, -10]), add(q, [40, 120]), add(q, [10, 180]), add(q, [-24, 90])]; f.part(rag, CLB(f, { fill: '#3a3440', maxShade: 8 })); X.charEdge(f, rag.slice(2, 5), 5, { gap: 10 }); }
  { const sp = so[5], q = pr(V.mul(sp.dA, 640)); X.feather(f, q, 1.9, 150, 26, X.FE(f), { lead: 0.35, round: true, dark: 0.3, lift: 2 }); }
  { const sp = so[3], q = pr(V.mul(sp.dA, 860)); X.crackedHalo(f, add(q, [0, 110]), 110, 60, 0.1, 18, [0.32, 0.7], { drift: 10, lost: 0.3, capW: 0.3 }); X.rope(f, [add(q, [0, -10]), add(q, [0, 50])], 5, '#4a4038'); }
  // ---- the chariot's traces trailing from the axle: two straps out of the hub, down and back across the floor, the
  // harness rings at their ends pulling nothing
  f.bone('traces');
  for (const [dx, end] of [[-30, [260, gy - 30]], [30, [520, gy - 18]]]) { const a = add(hubC, [dx, 60]), m = add(lerp(a, end, 0.5), [-120, 200]); const tr = X.spline([a, m, add(end, [80, -10]), end], 6); f.line(tr, 30, INK); f.line(tr, 24, '#2a2428'); f.line(tr.map(q => add(q, mul(f.L, 4))), 3, '#5a5058', { op: 0.6 }); f.stitches(tr.map(q => add(q, [0, 6])), '#6a5a5a'); f.line(ell(add(end, [-34, 0]), 30, 22, 0, 18).concat([ell(add(end, [-34, 0]), 30, 22, 0, 18)[0]]), 14, INK); f.line(ell(add(end, [-34, 0]), 30, 22, 0, 18).concat([ell(add(end, [-34, 0]), 30, 22, 0, 18)[0]]), 9, P.gold); }
  f.bone('root');
  X.leafDrift(f, [1000, 1500], 900, 800, 30, 2);
  f.flat(ell([1000, gy + 6], 600, 18, 0, 20), '#000', { op: 0.3 });
  return X.toneGold(f);
}

// ------------------------------------------------------------------ THE FOURFOLD BEAST (ruler 3.5)
// It had a face for each wind, to watch the throne from every side. Three are gone. One of the living creatures that
// guarded the Mother's seat: a lion's body with an eagle's wings and one broad neck carrying four faces (man, lion, ox,
// eagle), all of gilt flesh, leaf cracked over black. It lies couched like a sphinx on a fallen slab of heaven, the
// hindquarters down, the forequarters raised on straight forelegs (the weight goes down through the lion's forepaws),
// the great wings spread up and out of the frame top, each at its own spread; the head turned to the party. Only the
// lion's face is whole (heavy-maned, mouth open): the man's face, turned to us, is cracked away onto void, a few edges of
// it left; the ox's face at the back is a clean-rimmed hole; of the eagle's head, on the far side, only the beak hangs on
// by a shard. Violet burns run along the flanks; the wing feathers are fused by the strike into stiff scorched vanes and
// the wings are full of eyes. Details: a jewelled collar of cracked gold with every setting empty; a snapped chain from
// the collar trailing; a broken gilt shaft in the flank (the canopy pole of the throne, driven in when the throne fell:
// there was no war, see the review); claws of fused metal; gold scales on the chest, several missing; a shattered halo-
// ring floating behind the heads in pieces; a torn standard of the Mother's sign trapped under a forepaw; the fallen slab,
// cracked and carved; shards of the lost faces drifting; burn-blackened pinions.
// Rig: body (root) > neck > head > jaw, beak, halo; body > wing_n_1..3, wing_f_1..3; leg_fn_1..3, leg_ff_1..3; tail;
// chain; slab (static). Motion: idle the faces turning in slow sequence (head, beak swings), the lion's always back to
// the party; attack a roar (jaw open, head forward) and a discharge from the void where the others were (engine FX).
function fourfoldBeast() {
  const CW = 2000, CH = 1800, seed = 1521;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY, sT = 1530, GF = P.gold;
  const GS = (o = {}) => X.GILT(f, Object.assign({ maxShade: 30 }, o));
  const groove = (pts, w = 4, op = 0.6) => X.crease(f, pts, w, { col: P.blackD, lit: '#ecd496', op });
  // legs: front H shoulder point, K elbow, A wrist, T paw; the hind leg folded under the couched haunch
  const LEG = { fn: { H: [1400, 1110], K: [1290, 1300], A: [1336, 1452], T: [1420, sT] }, ff: { H: [1480, 1090], K: [1390, 1280], A: [1452, 1440], T: [1560, sT - 6] } };
  const HL = { H: [560, 1230], K: [790, 1410], A: [430, 1486], T: [820, sT] }; // hip, stifle, hock (on the slab), the hind paw laid forward
  const LC = [1660, 730], LS = 340, LA = 0.1; // the lion's face: toward the party
  f.joint('body', [1000, 1250]).joint('neck', [1360, 980], 'body').joint('head', [1420, 820], 'neck').joint('jaw', frame(LC, LA, LS)([[-0.16, 0.1]])[0], 'head').joint('beak', [1470, 1070], 'head').joint('halo', [1400, 620], 'head').joint('tail', [260, 1260], 'body').joint('chain', [1440, 1000], 'neck').joint('slab', [1000, sT]);
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.H, 'body').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`);
  const Wn = { S: [1070, 990], E: [770, 650], W: [560, 400], T: [170, -40], tr: 1 };    // near wing thrown back and up over the body
  const Wf = { S: [1190, 950], E: [1180, 520], W: [1290, 220], T: [1540, -240], tr: -1 }; // far wing raised nearly upright
  for (const [k, w] of [['n', Wn], ['f', Wf]]) f.joint(`wing_${k}_1`, w.S, 'body').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  // eyes in the wings: set deep into the coverts, lidded, each at its own point of a blink
  const wingEye = dim => (ri, q, sz, a) => X.deepEye(f, q, Math.max(14, sz), a + Math.PI / 2 * 0.15, { lid: GS({ fill: mix(GF, '#000', dim + 0.1) }), open: R(f, 0.25, 0.8), gaze: [R(f, 0.2, 0.9), R(f, -0.3, 0.3)], iris: f.r() < 0.35 ? P.goldM : P.vio, lashes: sz > 26 });

  // ---- the far wing, raised nearly upright behind (stiff scorched vanes, burnt pinions, eyes in the coverts)
  X.bigWing(f, Wf.S, Wf.E, Wf.W, Wf.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: Wf.tr, fill: mix(GF, '#000', 0.3), Lp: 760, Ls: 400, Wp: 118, Ws: 62, np: 10, ns: 12, nt: 4, rake: -0.28, wS: 120, wE: 90, wW: 70, spreadP: 0.8, burnP: 0.24, notchP: [2, 6], notchS: [3, 8], pLen: t => 0.8 + 0.28 * Math.sin(t * 2.8), sLen: t => 0.86 + 0.12 * Math.sin(t * 6 + 1), eyes: wingEye(0.3), eyesAt: (ri, i) => (ri === 1 || ri === 2) && i % 4 === 1 });
  f.bone('wing_f_2'); X.burn(f, lerp(Wf.E, Wf.W, 0.3), ang(Wf.E, Wf.W), 300, 3, { depth: 3, clip: ell(lerp(Wf.E, Wf.W, 0.5), 260, 120, ang(Wf.E, Wf.W), 16) });
  // ---- the halo-ring behind the heads, shattered, its pieces drifting
  f.bone('halo');
  X.crackedHalo(f, [1400, 640], 360, 130, -0.2, 34, [0.05, 0.2, 0.33, 0.5, 0.64, 0.82], { drift: 40, lost: 0.3, capW: 0.3 });
  // ---- the slab: a fallen block of heaven's floor, cracked and carved in relief along its face
  f.bone('slab');
  { const top = [[60, sT - 36], [700, sT - 44], [1300, sT - 40], [1900, sT - 30], [1940, sT - 4], [1920, sT + 4], [40, sT + 4]], fc = [[40, sT], [1920, sT], [1960, sT + 60, 1], [1930, sT + 120], [1950, gy, 1], [20, gy, 1], [50, sT + 130], [10, sT + 60, 1]];
    X.gilt(f, fc, { look: { fill: mix(GF, '#000', 0.25) }, sz: 200, cell: 120, s: 1.4, chips: 6, dark: 0.35 });
    X.clipDraw(f, E.smooth(fc), () => {
      X.softTone(f, E.smooth(fc), [[[[0, gy - 60], [2000, gy - 60], [2000, gy + 10], [0, gy + 10]], P.blackD, 0.55, 20]]);
      // the carved relief: a procession of the Mother's court (small winged figures) in a sunk panel, worn and cracked
      f.flat([[200, sT + 40], [1760, sT + 40], [1760, sT + 190], [200, sT + 190]], P.blackD, { op: 0.45 }); f.line([[200, sT + 40], [1760, sT + 40]], 3, P.goldW, { op: 0.5 });
      for (let i = 0; i < 12; i++) { const x = 270 + i * 124, c = [x + (i % 2) * 8, sT + 120]; const bd = [add(c, [-12, -48]), add(c, [12, -50]), add(c, [24, 20]), add(c, [30, 60]), add(c, [-26, 60]), add(c, [-20, 18])]; X.gilt(f, bd, { look: { fill: mix(GF, '#000', 0.15) }, sz: 30, chips: 0, cell: 30, s: 0.3 }); X.gilt(f, ell(add(c, [2, -66]), 15, 17, 0, 10), { look: { fill: mix(GF, '#000', 0.15) }, sz: 24, chips: 0, cell: 30, s: 0.3 }); for (const sg of [-1, 1]) X.gilt(f, [add(c, [sg * 10, -40]), add(c, [sg * 58, -86]), add(c, [sg * 64, -60]), add(c, [sg * 48, -18]), add(c, [sg * 16, -10])], { look: { fill: mix(GF, '#000', 0.22) }, sz: 26, chips: 0, cell: 30, s: 0.3 }); if (i % 4 === 2) f.flat(ell(add(c, [0, -10]), 26, 50, 0.2, 12), P.blackD, { op: 0.7 }); }
      X.crackV(f, [900, sT + 10], 1.6, 220, 9, { depth: 2, dark: P.goldS }); X.crackV(f, [1500, sT + 20], 1.3, 200, 8, { depth: 2, dark: P.goldS });
      X.burn(f, [700, sT + 200], -1.2, 220, 3, { depth: 3 });
    });
    X.gilt(f, top, { look: { fill: mix(GF, '#fff', 0.1) }, sz: 40, cell: 90, s: 1.1, chips: 3, dark: 0.25, lite: 0.4 });
    X.softTone(f, E.smooth(top), [[[[200, sT - 50], [1700, sT - 50], [1700, sT + 6], [200, sT + 6]], '#0a0604', 0.35, 18]]); // the beast's shadow on the slab
    f.line([[40, sT + 1], [1920, sT + 1]], 3, P.goldW, { op: 0.5 });
    for (const [x0, w] of [[10, 1], [1960, -1]]) { const br = [[x0, sT - 2], [x0 + w * 40, sT + 50], [x0 + w * 8, sT + 110], [x0 + w * 44, sT + 170], [x0 + w * 14, gy - 4]]; f.line(br, 4, P.blackD); f.line(br.map(q => add(q, [w * 5, 0])), 2, P.goldW, { op: 0.5 }); }
  }
  // ---- the far foreleg, planted behind the chest: shoulder, elbow, a straight forearm, the wrist and a weight-bearing
  // paw, the claws fused metal
  const foreleg = (k, dim) => {
    const L = LEG[k], look = { fill: mix(GF, '#000', dim) };
    X.lionLimb(f, L.H, L.K, L.A, [250, 150, 104], [`leg_${k}_1`, `leg_${k}_2`], { look, point: 0.4, mus0: 0.24, mus0At: 0.5, mus1: 0.28, extra: () => {
      groove([lp(L.H, L.K, 0.2, -50), lp(L.H, L.K, 0.6, -40), lp(L.H, L.K, 0.88, -14)], 4, 0.5); groove([lp(L.K, L.A, 0.1, -8), lp(L.K, L.A, 0.5, 6), lp(L.K, L.A, 0.9, 2)], 3.4, 0.5);
    } });
    f.bone(`leg_${k}_3`);
    const pt = [L.T[0] - 50, L.T[1] - 70];
    X.muscle(f, [lerp(L.A, pt, -0.12), L.A, pt], [104, 98, 110], { look, chips: 0 });
    X.lionPaw(f, [L.T[0] + 14, L.T[1]], 190, { look, claws: 'metal', carpal: true });
  };
  foreleg('ff', 0.3);
  // ---- tail along the slab, the tuft at its end
  f.bone('tail');
  { const tl = X.spline([[270, 1250], [190, 1330], [150, 1430], [200, 1490], [330, 1500]], 8), tk = tl.filter((_, i) => i % 3 === 0).concat([tl[tl.length - 1]]);
    X.gilt(f, K.chain(tk, tk.map((_, i, a) => 80 - i * 40 / a.length)), { sz: 66, cell: 50, s: 0.8, chips: 1 });
    const e = tl[tl.length - 1]; for (let k = 0; k < 5; k++) X.maneLock(f, add(e, [-10, -6 + k * 4]), -0.3 + k * 0.2, 90 + k * 8, 34, { fill: mix(GF, '#000', 0.1), curl: k % 2 ? 1 : -1, bend: 0.3 }); }
  // ---- the body: the haunch couched on the slab, the back rising to the raised forequarters, the deep chest; lion
  // anatomy under the leaf: the ribcage's barrel with its ribs, the flank drawn in, the belly's line, the shoulder blade
  f.bone('body');
  const body = [[240, 1520], [210, 1380], [260, 1240], [400, 1150], [600, 1112], [800, 1082], [1000, 1022], [1160, 960], [1300, 960], [1440, 1010], [1510, 1100], [1500, 1220], [1440, 1320], [1330, 1360], [1200, 1380], [1040, 1420], [900, 1470], [800, 1500]];
  X.gilt(f, body, { sz: 420, cell: 110, s: 1.3, chips: 6, dark: 0.5 });
  X.clipDraw(f, E.smooth(body), () => {
    for (let i = 0; i < 7; i++) { const x0 = 900 + i * 56; groove([[x0, 1080 - i * 8], [x0 + 26, 1200 - i * 4], [x0 + 18, 1310 - i * 6], [x0 - 8, 1380 - i * 10]], 4, 0.45); f.line([[x0 + 12, 1088 - i * 8], [x0 + 40, 1200 - i * 4], [x0 + 32, 1306 - i * 6]], 2, '#e8c46e', { op: 0.3 }); } // the ribs swelling under the leaf
    X.softTone(f, E.smooth(body), [[[[760, 1140], [900, 1100], [880, 1460], [760, 1480]], '#0a0604', 0.4, 40], [[[700, 1440], [1400, 1300], [1400, 1420], [700, 1520]], '#0a0604', 0.5, 30]]); // the flank drawn in before the haunch; the belly in shade
    groove([[820, 1470], [1000, 1420], [1200, 1380], [1320, 1350]], 4, 0.5); // the belly line
    X.burn(f, [500, 1200], 0.15, 520, 3.6, { depth: 3, haloOp: 0.45 }); X.burn(f, [900, 1300], -0.3, 420, 3.2, { depth: 3, haloOp: 0.45 }); // along the flank
    for (let r = 0; r < 6; r++) for (let k = 0; k < 4 - (r > 3 ? 1 : 0); k++) { const c = [1370 + k * 34 + (r % 2) * 17, 1090 + r * 40]; if ((r * 7 + k * 3) % 5 === 0) { f.flat(ell(c, 17, 13, 0, 10), P.blackD); continue; } const sc = [add(c, [-17, -12]), add(c, [17, -12]), add(c, [14, 8]), add(c, [0, 18]), add(c, [-14, 8])]; X.gilt(f, sc, { look: { fill: mix(GF, '#fff', (k % 2) * 0.08) }, sz: 30, chips: 0, cell: 30, s: 0.3, lite: 0.4 }); } // gold scales on the chest, several missing
  });
  // the shoulder blade and the deltoid's mass over the ribcage, behind the raised forequarters
  { const sc = [[1150, 960], [1290, 940], [1420, 1010], [1460, 1110], [1400, 1170], [1290, 1150], [1190, 1070]]; X.castOn(f, sc, 22, 0.45, body); X.gilt(f, sc, { sz: 200, cell: 80, s: 1, chips: 1, lite: 0.38 }); groove([[1200, 990], [1300, 1060], [1390, 1110]], 4, 0.55); } // the spine of the scapula
  // the haunch: the thigh's great mass couched on the slab, the hind leg folded under it, the paw laid forward
  { const L = HL;
    X.lionLimb(f, L.H, L.K, L.A, [300, 170, 100], ['body', 'body'], { look: { fill: mix(GF, '#000', 0.05) }, point: 0.3, mus0: 0.2, mus1: 0.3 });
    const hk = [[L.A[0] - 30, L.A[1] - 40], [L.A[0] + 40, L.A[1] - 46], [L.T[0] - 90, sT - 60], [L.T[0] - 60, sT - 6, 1], [L.A[0] - 40, sT - 4, 1]]; X.gilt(f, hk, { sz: 70, cell: 60, s: 0.6, chips: 1 }); // the hind foot along the slab
    X.lionPaw(f, [L.T[0], sT], 170, { claws: 'metal' });
    const th = [[250, 1250], [420, 1160], [580, 1166], [700, 1236], [800, 1370], [790, 1416], [700, 1436], [560, 1462], [440, 1488], [330, 1478], [250, 1410]];
    X.castOn(f, th, 26, 0.45, body);
    X.gilt(f, th, { sz: 340, cell: 90, s: 1.1, chips: 3, dark: 0.55, lite: 0.36 });
    X.clipDraw(f, E.smooth(th), () => { groove([[290, 1300], [440, 1280], [600, 1300], [740, 1376]], 5, 0.65); groove([[590, 1176], [650, 1260], [700, 1380]], 5, 0.6); groove([[320, 1440], [440, 1420], [560, 1430]], 4, 0.5); X.burn(f, [420, 1220], 0.3, 260, 3, { depth: 3 }); X.crackV(f, [540, 1350], 0.9, 90, 6, { depth: 2, dark: P.goldS }); }); // the quadriceps' edge, the hamstrings, the gaskin folded under
  }
  // the broken shaft in the flank: the gilt canopy pole of the throne, driven in when the throne fell, snapped short;
  // the leaf cracked open round the wound (there was no war: see the review)
  { const a = [860, 1210], b = [640, 1000], sh = limb(a, b, 34, 30, { steps: 8 });
    for (let k = 0; k < 5; k++) X.vcrack(f, [a, add(a, rot([40 + k * 10, 0], 0.6 + k * 1.1)), add(a, rot([80 + k * 18, 6], 0.6 + k * 1.1))], 5, { dark: P.goldS });
    X.gilt(f, sh, { sz: 32, cell: 30, s: 0.5, chips: 1 }); for (const t of [0.3, 0.62]) f.part([lp(a, b, t, -18), lp(a, b, t + 0.04, -18), lp(a, b, t + 0.04, 18), lp(a, b, t, 18)].map(q => [...q, 1]), GS({ fill: mix(GF, '#000', 0.3), maxShade: 3, cast: false })); // its gilt bands
    for (let k = 0; k < 6; k++) { const q = add(b, [R(f, -14, 14), R(f, -8, 8)]); f.stroke([q, add(q, [R(f, -40, -10), R(f, -50, -20)])], 8, '#7a5e22'); } f.part(ell(a, 30, 20, -0.7, 12), X.BK(f, { maxShade: 3, cast: false })); X.fusedRun(f, add(a, [10, 16]), 60, 9, AR(f)); }
  // ---- the near foreleg, over the chest; the throne's torn standard (the Mother's sign) trapped under its paw
  f.bone('slab');
  { const sd = [[1300, sT - 6], [1560, sT - 10], [1600, sT + 30], [1580, sT + 120], [1520, sT + 90], [1460, sT + 150], [1400, sT + 100], [1330, sT + 130], [1290, sT + 40]]; f.part(sd, CLB(f, { maxShade: 10 }));
    X.clipDraw(f, E.smooth(sd), () => { const c = [1440, sT + 60]; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + k / 6 * 6.28; f.line([add(c, rot([14, 0], a)), add(c, rot([40, 0], a))], 4, '#c8a050'); } f.line(ell(c, 12, 12, 0, 12).concat([ell(c, 12, 12, 0, 12)[0]]), 4, '#c8a050'); X.fold2(f, E.smooth(sd), [[1340, sT + 10], [1370, sT + 60], [1380, sT + 110]], 10, { dark: '#000', light: '#5a5060', lit: '#6a6070', col: '#040306', lightOp: 0.3 }); });
    X.charEdge(f, sd.slice(3, 8), 6, { gap: 8 }); X.rope(f, [[1300, sT - 4], [1260, sT - 60], [1270, sT - 120]], 6, '#4a3a2a'); }
  X.castOn(f, K.chain([LEG.fn.H, LEG.fn.K, LEG.fn.A], [250, 150, 104], { steps: 8 }), 26, 0.45, body);
  foreleg('fn', 0);
  { const L = LEG.fn; f.bone('leg_fn_1'); X.burn(f, lp(L.H, L.K, 0.2, 0), 1.9, 220, 3, { depth: 3, clip: limb(L.H, L.K, 200, 130, { steps: 12 }) }); }
  // ---- the neck, broad, rising from the chest; the heavy mane over it, the collar with its empty settings, the chain
  f.bone('neck');
  const neck = [[1180, 1000], [1240, 820], [1330, 680], [1560, 660], [1620, 820], [1560, 1080], [1420, 1080]];
  X.gilt(f, neck, { sz: 340, cell: 90, s: 1.2, chips: 3, dark: 0.5 });
  const maneR = [[1080, 760], [1140, 560], [1270, 450], [1440, 430], [1590, 500], [1640, 600], [1620, 900], [1580, 1060], [1460, 1110], [1300, 1080], [1170, 1010]];
  X.castOn(f, maneR, 30, 0.5, body);
  X.maneFill(f, [1500, 700], maneR, { step: 64, len: 190, w: 92, fill: GF, flow: [-0.8, 0.5], dimOuter: 0.16 });
  { const cl = [[1230, 950], [1390, 990], [1570, 960], [1580, 1020], [1390, 1060], [1220, 1020]]; X.gilt(f, cl, { look: { fill: mix(GF, '#000', 0.25) }, sz: 60, cell: 30, s: 0.5, chips: 1, lite: 0.4 });
    for (let k = 0; k < 7; k++) { const q = lerp(lerp([1240, 985], [1390, 1025], Math.min(1, k / 3.5)), [1560, 995], Math.max(0, (k - 3.5) / 3.5)); X.gilt(f, ell(q, 20, 16, 0, 12), { look: { fill: mix(GF, '#fff', 0.08) }, sz: 30, chips: 0, cell: 30, s: 0.3, lite: 0.45 }); f.flat(ell(q, 11, 8, 0, 10), P.void); f.line(ell(q, 11, 8, 0, 10).slice(5, 10), 1.4, P.goldW, { op: 0.6 }); for (const a of [0.6, 2.2, 3.8, 5.4]) f.flat(ell(add(q, rot([13, 0], a)), 3, 2, a, 6), P.goldL); } // the empty settings, their claws open
    X.vcrack(f, [[1300, 1000], [1310, 1030], [1300, 1050]], 6, { dark: P.goldS }); }
  f.bone('chain'); X.ironChain(f, [[1440, 1050], [1500, 1200], [1560, 1380], [1640, 1500], [1760, sT - 8]], 46, 9, '#8a6a24');
  { const e = [1760, sT - 10]; f.part([add(e, [-10, -16]), add(e, [20, -10]), add(e, [26, 10]), add(e, [-6, 12])], GS({ fill: '#7a5e22', maxShade: 3, cast: false })); X.vcrack(f, [add(e, [10, -16]), add(e, [8, 12])], 5, { dark: P.goldS }); } // the snapped last link
  // ---- the head: four faces on one neck, facing four ways. At the back the ox's face is a clean-rimmed hole, its horn
  // sheared and its ear left on the rim; toward us the man's face, cracked away onto void, brow, eye, nose and a corner of
  // the mouth left on the shell; toward the party the lion's, whole, roaring; on the far side only the eagle's beak, hanging
  // by a shard under the jaw
  f.bone('head');
  const head = [[1060, 640], [1110, 490], [1250, 404], [1430, 386], [1580, 436], [1650, 560], [1640, 760], [1560, 880], [1400, 924], [1220, 884], [1090, 780]];
  X.gilt(f, head, { sz: 420, cell: 90, s: 1.2, chips: 3, dark: 0.5 });
  { const crown = X.spline([[1090, 560], [1180, 450], [1320, 396], [1470, 396], [1600, 450]], 30); crown.forEach((q, i) => { const t = i / (crown.length - 1); for (const [dr, L, w] of [[-30, 170, 84], [10, 130, 70]]) X.maneLock(f, add(q, [R(f, -8, 8), dr + R(f, -6, 6)]), -Math.PI / 2 - 0.9 + t * 0.6 + R(f, -0.15, 0.15) - (dr > 0 ? 0.25 : 0), L * R(f, 0.85, 1.1), w, { fill: mix(GF, '#000', dr < 0 ? 0.12 : 0.02), curl: f.r() < 0.5 ? 1 : -1, bend: -0.4 }); }); } // the heavy mane over the crown, flowing back
  // the ox: a clean round hole at the back of the head, the pale clean rim, the void inside; the ear and the sheared horn
  { const oc = [1130, 640]; X.voidDisk(f, oc, 70, 96, 0.15); f.line(ell(oc, 74, 100, 0.15, 30).slice(16, 30), 3, P.goldW, { op: 0.7 }); X.starfield(f, E.smooth(ell(oc, 60, 86, 0.15, 20)), E.bbox(ell(oc, 60, 86, 0.15, 20)), 10);
    const er = [[1180, 540], [1130, 500], [1090, 520], [1100, 556], [1150, 570]]; X.gilt(f, er, { look: { fill: mix(GF, '#000', 0.1) }, sz: 40, chips: 0, cell: 30, s: 0.4 }); X.crease(f, [[1116, 528], [1144, 540], [1166, 552]], 3, { col: P.blackD, lit: '#ecd496' }); // the ox's drooping ear
    const hb = [1200, 500], hn = [add(hb, [-28, 10]), add(hb, [-48, -34]), add(hb, [-40, -78]), add(hb, [-12, -96]), add(hb, [6, -60]), add(hb, [24, 0])]; X.gilt(f, hn, { look: { fill: '#c8bca0' }, sz: 46, chips: 0, cell: 30, s: 0.4 }); for (let k = 0; k < 4; k++) X.crease(f, [add(hb, [-40 + k * 4, -10 - k * 18]), add(hb, [-14 + k * 4, -4 - k * 18])], 2, { col: '#3a3028', lit: '#f0ead8', op: 0.6 }); const cut = ell(add(hb, [-14, -92]), 18, 8, 0.3, 12); f.part(cut, { fill: P.ashW, shade: 0.1, inkW: 1.2, cast: false, hatch: false }); f.flat(ell(add(hb, [-14, -92]), 12, 5, 0.3, 10), P.void); } // the horn, sheared clean, its core void
  // the man's face, turned to us: a carved gilt face, most of it cracked away onto the void behind it
  { const MC = [1360, 650], MH = 290;
    const mF = angelHead(f, MC, MH, 0.05, { gold: true, head: { jaw: 1.0, chin: 0.02, nose: 1.0, mouth: 'set', squint: 0.6, browDown: 0.04, hairCol: mix(GF, '#000', 0.4), noEar: true, hair: [[-0.42, 0.0], [-0.44, -0.3], [-0.3, -0.5], [-0.04, -0.56], [0.2, -0.5], [0.28, -0.4], [0.06, -0.44], [-0.14, -0.38], [-0.28, -0.14], [-0.32, 0.0]] } });
    const gone = mF([[-0.12, -0.52], [-0.04, -0.36], [-0.1, -0.24], [-0.02, -0.12], [-0.08, 0.02], [0.02, 0.12], [-0.06, 0.26], [0.0, 0.36], [-0.14, 0.44], [-0.34, 0.36], [-0.46, 0.12], [-0.48, -0.2], [-0.36, -0.44]]).map(q => [...q, 1]);
    f.part(gone, { fill: '#3a3440', shade: 0.3, inkW: 2.4, inkHeavy: 3, cast: false, tex: 'chisel' + seed, texOp: 0.7, maxShade: 10 }); // the shell's broken thickness
    const voidM = gone.map(q => add(lerp(q, mF([[-0.24, -0.04]])[0], 0.12), [4, 4]));
    X.vcrack(f, mF([[-0.02, 0.06], [0.1, 0.16], [0.16, 0.3], [0.24, 0.36]]), 8, { dark: P.goldS }); // the crack running on across the cheek to the mouth
    f.flat(voidM, P.void); f.line(voidM.slice(0, 7), 2.4, P.goldW, { op: 0.7 }); f.line(voidM.slice(7), 2, P.vio, { op: 0.8 });
    X.clipDraw(f, E.smooth(voidM), () => { X.starfield(f, E.smooth(voidM), E.bbox(voidM), 26); });
    X.shards(f, mF([[0.3, 0.2]])[0], 0.4, 4, 1.4); X.crackV(f, mF([[0.1, -0.3]])[0], -1.2, 60, 4, { depth: 1, dark: P.goldS }); }
  // the lion's face, toward the party: whole, heavy-maned, roaring, the brow knotted, the living eye gold
  X.lionHead(f, LC, LS, LA, { open: 0.85, eye: 'living', fill: mix(GF, '#fff', 0.03), jaw: 'jaw', head: 'head' });
  f.bone('head');
  { const LF = frame(LC, LA, LS); X.clipDraw(f, E.smooth(LF([[-0.52, -0.12], [-0.46, -0.34], [-0.28, -0.46], [-0.04, -0.5], [0.16, -0.45], [0.1, 0.0], [-0.4, 0.1]])), () => X.burn(f, LF([[-0.3, -0.36]])[0], LA + 0.4, 160, 2.6, { depth: 3, haloOp: 0.3 })); }
  // the eagle's beak, hanging on by a shard under the far side of the head, swinging; a few eagle feathers left on it
  f.bone('beak');
  { const s0 = [1470, 1066], s1 = [1478, 1150]; X.gilt(f, [[1452, 900], [1486, 904], [1484, 1070], [1458, 1072]], { look: { fill: mix(GF, '#000', 0.4) }, sz: 30, chips: 0, cell: 30, s: 0.3 }); // the shard it hangs by, from under the jaw, behind the collar
    for (let k = 0; k < 4; k++) X.gFeather(f, add(s0, [-20 + k * 12, -6]), Math.PI / 2 + 0.6 - k * 0.3, 70, 22, { fill: mix(GF, '#000', 0.35), burn: 0.3, lead: 0.4 });
    X.gilt(f, [add(s0, [-22, 0]), add(s0, [24, -4]), add(s1, [12, 0]), add(s1, [-14, 4])], { look: { fill: mix(GF, '#000', 0.3) }, sz: 40, chips: 0, cell: 30, s: 0.4 }); X.vcrack(f, [add(s0, [-16, 2]), add(s0, [18, 0])], 5, { dark: P.goldS });
    const bk = [add(s1, [-44, -8]), add(s1, [40, -16]), add(s1, [104, 24]), add(s1, [134, 98]), add(s1, [108, 150], 1), add(s1, [88, 88]), add(s1, [30, 60]), add(s1, [-40, 44])]; X.castOn(f, bk, 20, 0.5);
    X.gilt(f, bk, { look: { fill: mix(GF, '#fff', 0.05) }, sz: 70, cell: 30, s: 0.5, chips: 1, lite: 0.45 }); f.line([add(s1, [-30, 14]), add(s1, [40, 22]), add(s1, [92, 58])], 4, P.blackD); f.flat(ell(add(s1, [-8, 2]), 11, 7, 0, 8), P.blackD); X.charEdge(f, [add(s1, [-40, 44]), add(s1, [30, 60])], 6, { gap: 20 }); } // the beak: the hooked upper mandible, its cutting edge, the nostril
  // ---- the near wing, thrown back and up over the body (its own spread), eyes in the coverts, the pinions burnt black
  X.bigWing(f, Wn.S, Wn.E, Wn.W, Wn.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: Wn.tr, fill: GF, Lp: 800, Ls: 430, Wp: 124, Ws: 66, np: 10, ns: 13, nt: 4, rake: 0.3, wS: 130, wE: 96, wW: 74, spreadP: 0.85, burnP: 0.26, notchP: [3, 7], notchS: [2, 6, 10], pLen: t => 0.76 + 0.32 * Math.sin(t * 2.6), sLen: t => 0.84 + 0.14 * Math.sin(t * 5 + 2), eyes: wingEye(0), eyesAt: (ri, i) => (ri === 1 || ri === 2) && i % 3 === 1 });
  f.bone('wing_n_2'); X.burn(f, lerp(Wn.E, Wn.W, 0.2), ang(Wn.E, Wn.W) + 0.2, 340, 3.2, { depth: 3, clip: ell(lerp(Wn.E, Wn.W, 0.5), 280, 130, ang(Wn.E, Wn.W), 16) });
  // ---- shards of the lost faces drifting round: a nose, a lip, the curve of a brow, an ox's horn-tip
  f.bone('root');
  for (const [c, r] of [[[1820, 470], 40], [[1860, 880], 30], [[1100, 420], 34], [[1700, 300], 28], [[1900, 640], 22]]) { const q = X.chip(f, c, r, GS({ maxShade: 6 })); f.line([q[1], lerp(q[1], q[3], 0.5), q[4]], 2.4, P.blackD, { op: 0.7 }); }
  X.leafDrift(f, [1200, 700], 700, 500, 30, 1.8);
  f.flat(ell([1000, gy + 4], 900, 14, 0, 20), '#000', { op: 0.3 });
  return X.toneGold(f);
}

module.exports = {
  heroes: [
    { key: 'porter_of_heaven', name: 'Porter of Heaven', tier: 'human', w: 760, h: 900, flip: true, build: porter },
    { key: 'herald_of_heaven', name: 'Herald of Heaven', tier: 'human', w: 1000, h: TIERS.human[1], flip: true, build: herald },
    { key: 'star_lighter', name: 'Star-Lighter', tier: 'human', w: 640, h: 1000, flip: true, build: starLighter },
    { key: 'putto', name: 'Putto', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: putto },
    { key: 'scorched_doves', name: 'Scorched Doves', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: scorchedDoves },
    { key: 'throne_lion', name: 'Throne Lion', tier: 'large', w: 1300, h: TIERS.large[1], flip: true, build: throneLion },
    { key: 'rift_crawler', name: 'Rift Crawler', tier: 'large', w: 1250, h: TIERS.large[1], flip: true, build: riftCrawler },
    { key: 'recording_angel', name: 'The Recording Angel', tier: 'elite', w: 1200, h: 1500, flip: true, build: recordingAngel },
    { key: 'weigher_of_souls', name: 'The Weigher of Souls', tier: 'elite', w: 1800, h: 1900, flip: true, build: weigher },
    { key: 'wheel_of_thrones', name: 'The Wheel of Thrones', tier: 'ruler', w: 2000, h: 2400, flip: true, build: wheelOfThrones },
    { key: 'fourfold_beast', name: 'The Fourfold Beast', tier: 'ruler', w: 2000, h: 1800, flip: true, build: fourfoldBeast },
  ],
};
