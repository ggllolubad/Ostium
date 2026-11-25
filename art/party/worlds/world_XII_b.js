// World XII, The White Silence (Frost + Void, absolute zero): second batch ("b", 11 creatures, seeds 1220 to 1230).
// Same world as world_XII.js and the same rules: near-white figures on near-white ground carried by ink line, the cel
// shadow band and crosshatch; frost (dominant) rimes the windward faces, hangs icicles plumb and stops things
// mid-gesture; void takes pieces away with clean rims (faces, ears, sound, shadows) and its holes are see-through.
// Palette: white, a black sun, ink black, grey and bone; nothing else. No ground shadows anywhere (director's ruling).
// Eyes only where an entry asks for them (the drum's painted eye).
// Every creature is a foe: drawn facing right with foeBase (key light upper right in drawing space) and flipped on
// render; windward = the heroes' side = drawing +x. Rigged from the start: joints first, f.bone() before each part,
// parts drawn whole, overlap at the joints, shoulder gear on the torso.
'use strict';
const K = require('../kit');
const XB = require('./kit_XII_b');
const { E, B, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { shiftFig, PAL, base, ang, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, openHand, humanJoints, rope, crease, softTone, muscleBody, fx, snowGround, snowLip, split, side,
  mirrorDraw, mx, forkHanks, clumpEdge, furBoot, beadBand, cord, beadString, face, hairMass, braid, dogPaw } = XB;
const deg = d => d * Math.PI / 180;
const FUR = (o = {}) => Object.assign({ fill: PAL.fur, shadow: PAL.furS, light: PAL.furL, shade: 0.36 }, o);
const HIDE = (o = {}) => Object.assign({ fill: PAL.hide, shadow: PAL.hideS, light: '#f2f2ee', shade: 0.36 }, o);
const BONE = (o = {}) => Object.assign({ fill: PAL.bone, shadow: PAL.boneS, light: '#f8f4ea', shade: 0.38, inkW: 1.2, inkHeavy: 1.8, cast: false, hatch: false }, o);
const SKIN = (seed, o = {}) => Object.assign({ fill: PAL.skin, shadow: PAL.skinS, light: '#f6f6f6', shade: 0.38, tex: 'mottle' + seed, texOp: 0.45 }, o);

// folds on a hide or cloth mass: a dark trough stroke with a lit ridge beside it (inside a clip)
function folds(f, list, w, col = PAL.hideS, op = 0.5) { for (const q of list) { f.stroke(q, w, col, { op }); f.line(q.map(v => add(v, [w * 0.7, -w * 0.3])), Math.max(1, w * 0.18), '#ffffff', { op: 0.8 }); } }
// an arm or leg through three joints in one outline, split for the rig at the middle joint
function limb3(f, A, J, Bp, ws, look, bones, o = {}) {
  const [c0, c1] = jcut(A, J, Bp, o.cut ?? ws[1] * 0.42), shape = jointLimb(A, J, Bp, ws, o);
  if (o.capA !== false) { // a rounded top (shoulder, hip) instead of the chain's flat cut end
    const d = E.norm(sub(J, A)), n = [-d[1], d[0]], r = ws[0] / 2;
    for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; shape.push(add(A, add(mul(n, -Math.cos(t) * r), mul(d, -Math.sin(t) * r * (o.capK ?? 0.55))))); }
  }
  split(f, () => { f.part(shape, look); if (o.inside) clipDraw(f, shape, () => o.inside(shape)); if (o.crease !== false) creases(f, J, ang(A, Bp) + (o.ca ?? 1.5), ws[1] * 0.5, 3, o.creaseCol || PAL.furD, 0.65); }, [[bones[0], c0], [bones[1], c1]]);
  return shape;
}
// a fur cuff round a sleeve's end: a lumpy roll of fur about the limb at b (the limb runs a -> b), w the limb's width;
// its edges break into small clumps and its fur runs along the limb
function cuff(f, X, a, b, w, tone = 0.1, tex) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], L = w * 0.42, pts = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10, v = -0.5 + t; pts.push(add(add(b, mul(n, v * w * 1.12)), mul(d, L * 0.5 + (i % 2 ? 4 : 0) + Math.sin(t * Math.PI) * w * 0.06))); }
  for (let i = 10; i >= 0; i--) { const t = i / 10, v = -0.5 + t; pts.push(add(add(b, mul(n, v * w * 1.08)), mul(d, -L * 0.5 - (i % 2 ? 3 : 0) + Math.sin(t * Math.PI) * w * 0.05))); }
  f.part(pts, FUR({ fill: mix(PAL.fur, PAL.furS, tone), tex, texOp: 0.3, k: 0.9, maxShade: w * 0.25 }));
  X.furField(pts, 12, L * 0.8, { dir: () => d, w: 2.4 });
  return pts;
}

// ------------------------------------------------------------------ ICE-FISHER (Human 0.9)
// An ice-fisher who sat over a hole in the lake ice all winter, hunched forward on a whale-vertebra stool, frozen to it.
// The hole at its feet is a perfectly round black hole, clean-rimmed and deeper than any lake. The near hand, in a
// sealskin mitten, works a short antler jigging stick; the line drops plumb into the hole. The far hand is gone at the
// wrist, a clean rim, and a spare line is tied round the forearm above the stump. A three-pronged fish spear lies across
// the knees; bone ice pick, bait pouch at the belt; a string of frozen fish beside it, each with a clean hole through it;
// an antler scoop on the ice. Hide parka, hood up, the ruff frozen into spikes; rime thick on the windward shoulder and
// the hood's rim; icicles from the stick and line. Face frozen white, eyes squeezed shut against the glare, ivory lip plug.
// Rig: standard humanoid (pelvis root) + jig (hand_n), spear (pelvis), ruff (head), stool (root).
function iceFisher() {
  const CW = 600, CH = TIERS.human[1], GY = CH - 30, sd = 1224;
  const f = new Fig(base(sd, CH, { grimeY: GY - 150 }));
  const X = fx(f), furTex = X.hairTex(90);
  const H = 90;
  const P = [236, 640], C = [262, 548], N = [328, 486];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = 0.42, HC = add(N, add(mul(up, 44), [22, 6])), hF = frame(HC, hA, H);
  const SN = S.at(-0.3, 0.14), EN = [352, 590], WN = [426, 582];
  const SF = S.at(0.44, 0.1), EF = [398, 596], WF = [474, 646]; // the far forearm rests forward over the knee, the stump past it
  const HN = S.at(-0.1, 1.0), KN = [374, 620], AN = [392, 744];
  const HF = S.at(0.3, 0.98), KF = [394, 606], AF = [426, 736];
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const JT = add(WN, [6, -4]), jTip = [500, 620]; // the jigging stick: short, angled down toward the hole
  const HOLE = [496, GY + 8];
  f.joint('jig', WN, 'hand_n').joint('spear', S.at(0, 0.95), 'pelvis').joint('ruff', hF([[0.2, 0.15]])[0], 'head').joint('line', jTip, 'jig');
  const PARKA = (o = {}) => HIDE(Object.assign({ tex: 'mottle' + sd, texOp: 0.4 }, o));

  // ---- the ice, the hole, and what lies on it (root): the string of holed fish behind, the antler scoop
  f.bone('root');
  snowGround(f, 40, 590, GY, { depth: 30 });
  // the hole: a perfect circle in the ice seen at a low angle, flat black to a clean rim; the ice's cut edge shows a
  // sliver of thickness on the far side, pale, as it would at any hole, and then nothing below it
  const he = ell(HOLE, 64, 15, 0, 40);
  f.flat(he, PAL.void);
  f.part(ell(add(HOLE, [0, -6]), 60, 9, 0, 30).slice(16, 30).concat(ell(HOLE, 64, 15, 0, 40).slice(1, 20).reverse()), X.IC({ fill: PAL.glaze, shade: 0.2 }));
  f.flat(ell(add(HOLE, [0, 2]), 58, 11, 0, 40), PAL.void);
  f.line(he.concat([he[0]]), 2, INK); f.line(ell(HOLE, 67, 17, 0, 40).slice(2, 18), 1.3, '#ffffff', { op: 0.9 });
  X.rime([[430, GY + 6], [460, GY - 4], [500, GY - 7], [540, GY - 4], [562, GY + 4]], 4, -1, { look: { fill: '#f6f8f8' } }); // hoar round the hole's lip
  // the antler scoop lying on the ice behind the stool: a tine handle and a bone net-ring
  const sc0 = [96, GY + 4];
  f.line([sc0, add(sc0, [70, -8])], 7, INK); f.line([sc0, add(sc0, [70, -8])], 5, PAL.bone);
  f.part(ell(add(sc0, [-20, 2]), 24, 8, 0.1, 18), BONE({ fill: '#d2cec2' })); f.flat(ell(add(sc0, [-20, 1]), 17, 4.5, 0.1, 16), '#9a9ea4');
  for (let i = -2; i <= 2; i++) f.line([add(sc0, [-20 + i * 6, -3]), add(sc0, [-20 + i * 6, 5])], 0.8, PAL.greyD, { op: 0.8 });
  // the string of frozen fish laid beside the stool, each with a clean round hole through it
  const fish = [[[150, GY - 18], 0.15, 1], [[110, GY - 2], -0.08, 0.9], [[176, GY + 8], 0.05, 0.85]];
  const fh = fish.map(([c, a, s]) => X.hole(add(c, rot([4 * s, -1], a)), 6 * s, 6 * s, 0, [1.5, 1]));
  X.cut(fh, () => {
    for (const [c, a, s] of fish) {
      const F = frame(c, a, s);
      f.part(F([[-48, 0], [-36, -10], [-4, -13], [24, -9], [40, -2], [50, -12], [56, -14], [52, 0], [56, 13], [50, 11], [40, 3], [24, 9], [-4, 12], [-36, 9]]), { fill: '#c8cbcf', shadow: '#5e626a', light: '#f0f2f2', shade: 0.4, inkW: 1.2, cast: false, tex: X.icetex, texOp: 0.4 });
      f.line(F([[-32, -6], [-28, 0], [-32, 6]]), 1, INK, { op: 0.7 }); f.flat(F(ell([-40, -2], 2.2, 2, 0, 6)), '#16181c');
      for (let i = 0; i < 5; i++) f.line(F([[-18 + i * 8, -8], [-14 + i * 8, 6]]), 0.8, '#6a6e74', { op: 0.5 });
      f.line(F([[-30, 4], [24, 4]]), 1, '#ffffff', { op: 0.6 });
    }
    for (const h of fh) X.holeWall(h);
  });
  for (const h of fh) X.holeRim(h, { w: 1.4 });
  cord(f, [[100, GY - 12], [140, GY - 20], [186, GY - 4], [214, GY - 30], [222, GY - 70]], 1.4); // the string, its end tied up at the stool

  // ---- the stool: a whale's vertebra, a squat drum of bone with its wing processes, frozen to the ice
  f.bone('root');
  // the centrum: a short bone drum pinched at the waist, its top face (the articular plate) an ellipse under the parka
  const st = [[152, 668], [170, 676], [178, 700], [172, 730], [160, GY - 14], [168, GY - 2, 1], [298, GY - 2, 1], [306, GY - 14], [296, 730], [292, 700], [300, 676], [316, 664], [300, 652], [234, 646], [166, 652]];
  // the wing processes first, behind the drum: flat bone blades swept down to each side, the far one shorter
  f.part([[170, 692], [124, 694], [110, 710], [118, 720], [146, 716], [174, 714]], BONE({ fill: '#cdc9bc', tex: 'mottle' + sd, texOp: 0.45 }));
  f.part([[294, 690], [340, 688], [358, 704], [350, 716], [320, 714], [292, 714]], BONE({ fill: '#d6d2c6', tex: 'mottle' + sd, texOp: 0.45 }));
  f.line([[122, 714], [160, 708]], 1, PAL.boneD, { op: 0.6 }); f.line([[310, 706], [350, 712]], 1, PAL.boneD, { op: 0.6 });
  f.part(st, BONE({ fill: '#d8d4c8', inkW: 1.6, inkHeavy: 2.4, tex: 'mottle' + sd, texOp: 0.5, shade: 0.4, maxShade: 20 }));
  clipDraw(f, st, () => {
    softTone(f, E.smooth(st), [[[[140, 660], [196, 660], [200, GY], [140, GY]], PAL.boneS, 0.55, 10], [[[250, 690], [290, 690], [290, GY], [250, GY]], '#ffffff', 0.4, 10]]);
    for (let i = 0; i < 26; i++) { const q = [176 + f.r() * 116, 690 + f.r() * 80]; f.flat(ell(q, 1.6 + f.r() * 1.6, 1.2 + f.r(), 0, 6), PAL.boneD, { op: 0.55 }); } // porous bone
    f.line([[168, 690], [234, 700], [298, 690]], 1.6, PAL.boneD, { op: 0.6 }); f.line([[168, GY - 30], [234, GY - 22], [300, GY - 30]], 1.6, PAL.boneD, { op: 0.6 }); // the rims of the plates
    crease(f, [[188, 708], [184, 740], [190, 770]], 2, { col: PAL.boneD, op: 0.5 }); // the waist
  });
  X.rime([[166, 652], [234, 644], [300, 650]], 5, -1);
  X.icicles([[118, 720], [150, 716]], 2, 14, 4); X.icicles([[320, 714], [352, 716]], 2, 12, 4);

  // ---- far arm: behind the body, forearm forward over the knee; the hand gone at the wrist, a clean rim; a spare
  // line tied round the forearm above the stump
  limb3(f, SF, EF, WF, [54, 48, 42], PARKA({ fill: mix(PAL.hide, PAL.hideS, 0.28), maxShade: 16 }), ['upperarm_f', 'forearm_f'], { point: 0.3, mus0: 0.12, mus1: 0.16, creaseCol: PAL.hideD });
  f.bone('forearm_f');
  { const d = E.norm(sub(WF, EF)), n = [-d[1], d[0]], st0 = lerp(EF, WF, 0.72);
    f.part(jointLimb(lerp(EF, WF, 0.5), lerp(EF, WF, 0.8), add(WF, mul(d, 6)), [34, 32, 30]), SKIN(sd, { fill: mix(PAL.skin, PAL.bite, 0.35) })); // the bare wrist where the cuff rides up
    cuff(f, X, EF, lerp(EF, WF, 0.6), 46, 0.3, furTex);
    // the stump: the wrist ends in a clean flat cut, black inside a pale rim
    const se = ell(add(WF, mul(d, 6)), 9, 15, Math.atan2(d[1], d[0]), 22);
    X.voidPatch(se, { w: 1.6, rim: false }); f.line(ell(add(WF, mul(d, 6)), 11, 17, Math.atan2(d[1], d[0]), 22).slice(4, 14), 1.2, '#ffffff', { op: 0.9 });
    // the spare line wound round the forearm, a knot and a tail hanging plumb with a bone hook
    for (let i = 0; i < 4; i++) { const c = lerp(EF, WF, 0.66 + i * 0.03); f.line([add(c, mul(n, 17)), add(add(c, mul(n, 0)), mul(d, 2)), add(c, mul(n, -17))], 1.6, PAL.greyD); }
    const kn = add(lerp(EF, WF, 0.7), mul(n, -16)); f.flat(ell(kn, 3, 3, 0, 6), PAL.greyD);
    cord(f, [kn, add(kn, [2, 22]), add(kn, [0, 44])], 1); f.part([add(kn, [-3, 42]), add(kn, [3, 42]), add(kn, [4, 52]), add(kn, [-2, 56]), add(kn, [-5, 50])], BONE());
    X.icicle(add(kn, [0, 56]), 10, 3);
    X.bite(lerp(EF, WF, 0.85), 6, 6, 3, 0.4);
  }

  // ---- legs: fur trousers, knees forward, shins down to the boots; the far leg first
  // (review) the legs were plain grey tubes: now bulky fur trousers with weight, the thigh lit on top and dark beneath, the
  // cloth bunched in folds behind the knee and over the boot top, the knee's round showing through with a sewn patch on
  // the near one, the fur hanging in frozen clumps from the underside of the thigh and the back of the calf, a tie at the
  // boot top
  const leg = (Hp, Kn, A, sfx, tone) => {
    const d0 = E.norm(sub(Kn, Hp)), n0 = [-d0[1], d0[0]], d1 = E.norm(sub(A, Kn)), n1 = [-d1[1], d1[0]], und = n0[1] > 0 ? 1 : -1;
    limb3(f, Hp, Kn, A, [88, 70, 56], FUR({ fill: mix(PAL.fur, PAL.furS, tone), tex: furTex, texOp: 0.24 }), ['thigh' + sfx, 'shin' + sfx], { point: 0.3, mus0: 0.18, mus1: 0.24, ca: 1.57, inside: sh => {
      softTone(f, E.smooth(sh), [[[lp(Hp, Kn, -0.2, und * 8), lp(Hp, Kn, 1.1, und * 8), lp(Hp, Kn, 1.1, und * 70), lp(Hp, Kn, -0.2, und * 70)], PAL.furD, 0.5, 8], [[lp(Hp, Kn, 0.1, -und * 10), lp(Hp, Kn, 0.9, -und * 10), lp(Hp, Kn, 0.9, -und * 50), lp(Hp, Kn, 0.1, -und * 50)], '#ffffff', 0.5, 8]]);
      folds(f, [[lp(Hp, Kn, 0.78, und * 34), lp(Kn, A, 0.08, -und * 20), lp(Kn, A, 0.2, -und * 30)], [lp(Hp, Kn, 0.88, und * 20), lp(Kn, A, 0.14, -und * 10)], [lp(Kn, A, 0.6, -26), lp(Kn, A, 0.66, 0), lp(Kn, A, 0.6, 26)], [lp(Hp, Kn, 0.35, -und * 34), lp(Hp, Kn, 0.5, -und * 10)]], 3, PAL.furD, 0.55);
      X.furField(sh, 16, 18, { dir: () => [0.05, 1], w: 2.6 });
    } });
    f.bone('thigh' + sfx); forkHanks(f, X, [lp(Hp, Kn, 0.25, und * 40), lp(Hp, Kn, 0.85, und * 34)], 3, 14, 30, 10, 14, { ice: 0.5, tone: tone + 0.12, fade: false }); // the fur hanging from the underside of the thigh
    f.bone('shin' + sfx); forkHanks(f, X, [lp(Kn, A, 0.15, 30), lp(Kn, A, 0.45, 26)], 2, 12, 24, 10, 12, { ice: 0.4, tone: tone + 0.14, fade: false }); // and off the back of the calf
    if (sfx === '_n') { const kc = lp(Kn, A, 0.02, -10), pt = ell(kc, 18, 15, Math.atan2(d1[1], d1[0]), 12); f.part(pt, HIDE({ fill: '#cfcfc8', inkW: 1.1, cast: false, k: 0.8 })); f.stitches([...pt, pt[0]], PAL.hideD, 0.8); } // a sewn patch over the near knee
    split(f, () => { furBoot(f, X, Kn, A, 50, tone, furTex); const t0 = lp(Kn, A, 0.62, -30), t1 = lp(Kn, A, 0.62, 30); f.stroke([t0, lerp(t0, t1, 0.5), t1], 4, PAL.greyD); f.line([add(t1, [0, 2]), add(t1, [6, 16])], 2, PAL.greyD); }, [['shin' + sfx, side(A, [0.3, -1], 16)], ['foot' + sfx, side(A, [-0.3, 1], 16)]]);
  };
  leg(HF, KF, AF, '_f', 0.25);
  leg(HN, KN, AN, '_n', 0.05);

  // ---- the parka: the body hunched forward, the skirt over the stool and the thighs, frozen to the stool's rim
  f.bone('pelvis');
  const skirt = [S.at(-0.9, 0.7), S.at(0.9, 0.72), lp(HN, KN, 0.5, -30), lp(HN, KN, 0.78, -24), [362, 650], [330, 664], [270, 676], [200, 672], [158, 660], S.at(-1.05, 0.96)];
  f.part(skirt, PARKA());
  clipDraw(f, skirt, () => {
    softTone(f, E.smooth(skirt), [[[[150, 600], [230, 610], [240, 680], [150, 680]], PAL.hideS, 0.5, 12]]);
    folds(f, [[[220, 640], [270, 652], [330, 650]], [[260, 620], [300, 636], [350, 632]]], 4);
    beadBand(f, [[160, 652], [250, 662], [330, 654], [368, 640]], 10);
  });
  X.fringe([[158, 662], [210, 676], [270, 680], [330, 668], [364, 652]], 9, 10, 28, { ice: 0.4, fill: PAL.hide, tex: 'mottle' + sd });
  X.rime([[158, 666], [200, 680]], 5, 1); // frozen to the stool's rim
  f.bone('torso');
  const tor = S.shape([[-0.12, 0.4, 0.44], [0.06, 0.8, 0.72], [0.3, 0.84, 0.86], [0.55, 0.8, 0.88], [0.8, 0.86, 0.92], [1.0, 0.92, 0.94]]);
  f.part(tor, PARKA());
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-1, 0.1), S.at(-0.4, 0.05), S.at(-0.5, 0.95), S.at(-1, 0.95)], PAL.hideS, 0.5, 14]]);
    folds(f, [[S.at(-0.5, 0.2), S.at(-0.4, 0.5), S.at(-0.5, 0.8)], [S.at(0.2, 0.55), S.at(0.45, 0.7), S.at(0.7, 0.72)], [S.at(-0.1, 0.3), S.at(0.05, 0.6)]], 4);
    f.stitches([S.at(-0.95, 0.4), S.at(-0.6, 0.38), S.at(-0.2, 0.42)], PAL.hideD, 1); // the back seam
    const dn = [S.at(-0.78, 0.34), S.at(-0.6, 0.3), S.at(-0.52, 0.4), S.at(-0.62, 0.5), S.at(-0.8, 0.46)]; f.part(dn, PARKA({ fill: '#cfcfc8', inkW: 1.1, cast: false, k: 0.8 })); f.stitches([...dn, dn[0]], PAL.hideD, 0.9); // a sewn-on patch of older hide
    for (let i = 0; i < 5; i++) { const a = S.at(-0.3 + i * 0.05, 0.14 + i * 0.02); f.line([add(a, [-5, -4]), add(a, [5, 4])], 1, PAL.hideD, { op: 0.8 }); } // a darned tear by the shoulder
  });
  X.rime([S.at(-0.6, 0.0), S.at(-0.1, -0.1), S.at(0.4, -0.06), S.at(0.85, 0.1), S.at(0.98, 0.4)], 12, -1); // thick on the windward shoulder
  // belt: braided hide; the bait pouch, the bone ice pick
  f.bone('pelvis');
  const bl = [S.at(-0.98, 0.76), S.at(0.0, 0.8), S.at(0.95, 0.76), S.at(0.96, 0.84), S.at(0.0, 0.88), S.at(-1.0, 0.85)];
  f.part(bl, { fill: PAL.greyD, shadow: '#141418', shade: 0.35, tex: 'hatch' + sd, texOp: 0.5, k: 0.6 });
  const pu = S.at(-0.7, 0.86);
  f.part([add(pu, [-16, 0]), add(pu, [16, -2]), add(pu, [20, 30]), add(pu, [4, 42]), add(pu, [-16, 34])], PARKA({ fill: '#bfc0bc', inkW: 1.2 })); f.part([add(pu, [-18, -2]), add(pu, [18, -4]), add(pu, [16, 12]), add(pu, [-14, 14])], PARKA({ fill: '#cfd0cc', inkW: 1.1, cast: false }));
  f.flat(ell(add(pu, [0, 10]), 3, 3, 0, 6), PAL.bone); f.stitches([add(pu, [-12, 30]), add(pu, [12, 28])], PAL.hideD, 0.8);
  const pk = S.at(0.3, 0.84), pF = frame(pk, deg(80), 1);
  f.part(pF([[0, -5], [70, -4], [88, 0], [70, 4], [0, 5]]), BONE()); f.part(pF([[-24, -6], [0, -6], [0, 6], [-24, 6]]), BONE({ fill: PAL.boneS }));
  for (const t of [-18, -8]) f.line(pF([[t, -6], [t, 6]]), 1.6, PAL.greyD);

  // ---- the fish spear laid across the knees: driftwood shaft, three bone prongs with barbs, lashed
  f.bone('spear');
  const sp0 = [120, 640], sp1 = [548, 606], sd0 = E.norm(sub(sp1, sp0)), sn0 = [-sd0[1], sd0[0]];
  f.part(limb(sp0, sp1, 10, 9, { steps: 10 }), { fill: PAL.wood, shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood' + sd, inkW: 1.3 });
  for (const t of [0.9, 0.93, 0.96]) f.line([lp(sp0, sp1, t, -6), lp(sp0, sp1, t + 0.005, 6)], 2.4, PAL.greyD, { straight: true });
  for (const o of [-9, 0, 9]) { const a = add(sp1, mul(sn0, o * 0.6)), b = add(add(sp1, mul(sd0, 46 - Math.abs(o))), mul(sn0, o * 1.6)); f.part(limb(a, b, 6, 2.5, { steps: 6 }), BONE({ inkW: 1 })); f.line([lerp(a, b, 0.6), add(lerp(a, b, 0.6), add(mul(sd0, -7), mul(sn0, o >= 0 ? 4 : -4)))], 1.6, INK); }
  X.icicles([lp(sp0, sp1, 0.7, 5), lp(sp0, sp1, 0.85, 5)], 2, 14, 4);
  X.rime([lp(sp0, sp1, 0.55, -5), lp(sp0, sp1, 0.95, -5)], 3.5, -1);

  // ---- the head in the hood: the hood up, the face frozen white inside the ruff
  f.bone('head');
  f.part(limb(S.at(0.1, -0.02), hF([[-0.05, 0.36]])[0], 52, 46), PARKA({ fill: '#c8c8c2' }));
  const hood = hF([[-0.5, 0.5], [-0.62, 0.1], [-0.58, -0.26], [-0.36, -0.56], [-0.02, -0.66], [0.3, -0.58], [0.5, -0.36], [0.56, -0.04], [0.54, 0.3], [0.44, 0.58], [0.1, 0.72], [-0.3, 0.7]]);
  f.part(hood, PARKA({ maxShade: 18 }));
  clipDraw(f, hood, () => { softTone(f, E.smooth(hood), [[hF([[-0.7, -0.2], [-0.3, -0.3], [-0.2, 0.7], [-0.7, 0.7]]), PAL.hideS, 0.5, 10]]); folds(f, [hF([[-0.44, -0.3], [-0.2, -0.5], [0.12, -0.56]]), hF([[-0.52, 0.0], [-0.4, 0.3], [-0.42, 0.56]])], 3); });
  face(f, X, add(HC, rot([2, 2], hA)), H * 0.92, hA, { jaw: 1.12, chin: 0.02, nose: 1.0, squint: 1, blind: true, browDown: 0.06, age: true, faceShade: 0.8, wrinkles: 0.6, ear: 'none', hairCol: '#c8cacc', browCol: '#f2f2f0' });
  // the eyes squeezed shut against the glare: crushed lids with crow's feet
  const fF = frame(add(HC, rot([2, 2], hA)), hA, H * 0.92);
  for (const [a, b2] of [[[0.04, -0.06], [0.18, -0.05]], [[0.26, -0.06], [0.33, -0.055]]]) { f.line(fF([a, [(a[0] + b2[0]) / 2, a[1] + 0.025], b2]), 2, INK); }
  for (let i = 0; i < 3; i++) f.line(fF([[0.02, -0.06 + i * 0.03], [-0.04, -0.07 + i * 0.05]]), 1, INK, { op: 0.6 });
  // the ivory lip plug at the corner of the mouth
  f.part(fF(ell([0.19, 0.34], 0.035, 0.03, 0, 10)), BONE({ inkW: 1 })); f.flat(fF(ell([0.2, 0.335], 0.012, 0.01, 0, 6)), PAL.boneD);
  // the ruff: a thick band of fur round the opening, its guard hairs frozen into stiff spikes
  f.bone('ruff');
  const RC = [0.2, 0.1], ruffO = [];
  for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2, r = 1 + 0.07 * Math.sin(t * 9 + 0.5) + 0.04 * Math.sin(t * 4) + (f.r() - 0.5) * 0.1; ruffO.push(rot([Math.cos(t) * 0.5 * r, Math.sin(t) * 0.62 * r], -0.15)); }
  const ruffI = []; for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2; ruffI.push(rot([Math.cos(t) * 0.36, Math.sin(t) * 0.48], -0.15)); }
  const ring = [...hF(ruffO.map(q => add(q, RC))), hF([add(ruffO[0], RC)])[0], ...hF(ruffI.map(q => add(q, RC))).reverse(), hF([add(ruffI[0], RC)])[0]];
  // the ruff is the band between the outer and inner edge; the face shows through the inner opening
  const ringD = E.smooth(hF(ruffO.map(q => add(q, RC)))) + ' ' + E.smooth(hF(ruffI.map(q => add(q, RC)))).replace(/^M/, 'M');
  { const id = f.id('ru'); f.defs.push(`<clipPath id="${id}"><path d="${ringD}" clip-rule="evenodd"/></clipPath>`); const i0 = f.out.length;
    f.part(hF(ruffO.map(q => add(q, RC))), FUR({ fill: mix(PAL.fur, PAL.furS, 0.06), tex: furTex, texOp: 0.3 }));
    const c = hF([RC])[0];
    for (let i = 0; i < 46; i++) { const a = f.r() * 6.28, q0 = hF([add(RC, rot([Math.cos(a) * 0.34, Math.sin(a) * 0.46], -0.15))])[0], d = E.norm(sub(q0, c)); f.stroke([q0, add(q0, mul(d, 8 + f.r() * 6))], 2.6, PAL.furD, { op: 0.55 }); f.line([add(q0, [1.2, -1.2]), add(add(q0, mul(d, 7)), [1.2, -1.2])], 1, '#ffffff', { op: 0.85 }); }
    const body = f.out.splice(i0).join('\n'); f.raw(`<g clip-path="url(#${id})">${body}</g>`); }
  f.line(hF(ruffI.map(q => add(q, RC))).concat([hF([add(ruffI[0], RC)])[0]]), 1.6, INK, { op: 0.8 });
  // the frozen spikes: stiff points of guard hair standing out round the rim, uneven, the windward ones rimed
  for (let i = 0; i < 9; i++) { const t = (i + 0.2 + f.r() * 0.6) / 9 * Math.PI * 2 - 0.4, base0 = hF([add(RC, rot([Math.cos(t) * 0.42, Math.sin(t) * 0.54], -0.15))])[0], d = add(E.norm(sub(base0, hF([RC])[0])), [0, 1.3]); X.lock(base0, 8 + f.r() * 10, 9 + f.r() * 4, { dir: d, sway: (f.r() - 0.5) * 6, cast: false, inkW: 0.8, inkHeavy: 1.2, fill: mix(PAL.fur, PAL.furS, 0.1 + f.r() * 0.15) }); } // (review: radiating points read as a cartoon sun) fewer, shorter, pulled down by their own ice, softer ink // guard hair frozen into stiff points, pulled down a little by the ice
  X.rime(hF([[0.0, -0.46], [0.3, -0.42], [0.56, -0.2], [0.66, 0.1]]), 7, 1); // the hood's rim, windward
  X.icicles(hF([[0.0, 0.66], [0.3, 0.62], [0.5, 0.48]]), 3, 16, 4);

  // ---- near arm: forward over the knees, the mittened fist on the jigging stick; the line drops plumb into the hole
  limb3(f, SN, EN, lerp(EN, WN, 0.86), [62, 54, 50], PARKA({ maxShade: 18 }), ['upperarm_n', 'forearm_n'], { point: 0.35, mus0: 0.16, mus1: 0.14, creaseCol: PAL.hideD, inside: sh => folds(f, [[lp(SN, EN, 0.3, 12), lp(SN, EN, 0.7, 16)]], 3) });
  f.bone('torso'); X.rime([add(SN, [-20, -16]), add(SN, [12, -26]), add(SN, [36, -18])], 9, -1);
  f.bone('forearm_n'); cuff(f, X, EN, lerp(EN, WN, 0.78), 54, 0.08, furTex);
  X.rime([lp(EN, WN, 0.1, -24), lp(EN, WN, 0.7, -26)], 6, 1);
  f.bone('jig');
  const jd = E.norm(sub(jTip, JT));
  f.part(limb(add(JT, mul(jd, -20)), jTip, 9, 5, { steps: 8 }), BONE({ fill: '#cfcabd', inkW: 1.3, tex: 'mottle' + sd, texOp: 0.4 }));
  for (let i = 0; i < 4; i++) f.line([lp(JT, jTip, 0.3 + i * 0.14, -4), lp(JT, jTip, 0.32 + i * 0.14, 4)], 0.9, PAL.boneD, { op: 0.7 });
  f.part([add(jTip, [-2, -2]), add(jTip, [8, -6]), add(jTip, [6, 2])], BONE()); // a tine stub at the tip
  X.icicles([lp(JT, jTip, 0.4, 4), lp(JT, jTip, 0.9, 4)], 2, 16, 4);
  f.bone('line');
  // the line plumb from the tip into the hole, beaded with frost; the bone lure is down there in the dark
  const lTop = add(jTip, [6, 2]), lBot = [lTop[0], HOLE[1] - 2];
  f.line([lTop, lBot], 1.4, PAL.greyD); for (let i = 0; i < 5; i++) { const y = lTop[1] + 20 + i * 26; f.flat(ell([lTop[0], y], 2.2, 1.8, 0, 6), '#ffffff'); }
  X.icicle(add(lTop, [0, 2]), 18, 4);
  f.bone('hand_n');
  const g = B.grip(f, WN, EN, ang(JT, jTip), 30, PAL.hide, { tex: 'mottle' + sd, texOp: 0.45, shadow: PAL.hideS, name: 'fisher jig', inline: true, bend: ang(JT, jTip) - ang(EN, WN) });
  fistDetail(f, g, 30, mix(PAL.hide, PAL.hideS, 0.1), { wrinkle: true, nail: PAL.hide });
  f.part(g.F([[-0.6, -0.7], [-0.95, -0.8], [-1.05, 0.0], [-0.95, 0.75], [-0.6, 0.65]]), FUR({ fill: PAL.fur, inkW: 1.2, cast: false })); // the mitten's fur gauntlet
  X.rime([g.F([[-0.3, -0.75]])[0], g.F([[0.3, -0.8]])[0]], 4, 1);

  // the feet sink in a little; no shadow
  f.bone('foot_n'); snowLip(f, [AN[0] + 22, GY + 3], 82, 7);
  f.bone('foot_f'); snowLip(f, [AF[0] + 22, GY + 3], 72, 6);
  return f;
}

// a fur-backed mitten flat against a surface: W the wrist, a the direction the mitt lies (along the surface), s length,
// up the side of the surface the palm presses (+1: the palm faces the -normal side). The thumb stall rides on the side.
function mittenFlat(f, X, W, a, s, look, o = {}) {
  const F = frame(W, a, s), sg = o.flip ? -1 : 1, G = pts => F(pts.map(q => [q[0], q[1] * sg]));
  const mitt = G([[-0.12, -0.3], [0.3, -0.36], [0.74, -0.32], [0.98, -0.16], [1.02, 0.06], [0.86, 0.2], [0.4, 0.24], [0.0, 0.26], [-0.16, 0.12]]);
  f.part(mitt, Object.assign({}, look, { k: 0.95 }));
  clipDraw(f, mitt, () => { f.stroke(G([[0.05, 0.0], [0.5, 0.06], [0.86, 0.02]]), s * 0.06, PAL.hideD, { op: 0.35 }); f.line(G([[0.62, -0.3], [0.66, 0.2]]), 1, PAL.hideD, { op: 0.6 }); }); // the mitt's crease where the fingers bend
  f.part(G([[0.1, -0.3], [0.26, -0.56], [0.42, -0.6], [0.48, -0.46], [0.4, -0.3]]), Object.assign({}, look, { cast: false, inkW: 1.1 })); // the thumb stall
  // fur on the back of the mitten
  const fb = G([[-0.18, 0.1], [0.2, 0.16], [0.62, 0.17], [0.88, 0.12], [0.8, 0.26], [0.4, 0.3], [0.0, 0.3], [-0.22, 0.22]]);
  f.part(fb, FUR({ fill: mix(PAL.fur, PAL.furS, o.tone ?? 0.1), cast: false, inkW: 1.1, tex: X.hairTex(10), texOp: 0.3 }));
  X.furField(fb, 6, s * 0.16, { dir: () => rot([1, 0.3 * sg], a), w: 2 });
  f.stitches(G([[0.0, 0.25], [0.5, 0.22], [0.9, 0.12]]), PAL.hideD, 0.8);
  return mitt;
}

// ------------------------------------------------------------------ SNOW-HOUSE BUILDER (Human 1.05)
// The builder who cut snow blocks for the clan's winter houses, frozen at the top of a lift: a big cut block held high
// overhead in both mittened hands, arms locked straight, the back arched under the weight, the weight on the planted
// rear foot, the front foot light. A clean round hole goes through the block and another through the near forearm.
// Short hide parka belted at the waist, the long bone snow knife in the belt, hide knee pads worn through from kneeling
// to build, an antler snow probe slung on the back, fur-backed mittens, sealskin boots, a bone charm on a thong.
// Hood back, cropped hair frozen stiff, a squint up at the block, chapped lips. Rime caked on the windward side, icicles
// from the elbows and from the block's underside. True size: 1.05 to the crown, the block on top, so the canvas is
// heightened (same pixel scale, groundY = h - 30).
// Rig: standard humanoid + block (hand_n; hand_f follows it with IK), probe (torso), knife (pelvis), skirt (pelvis), hood (torso).
function snowHouseBuilder() {
  const CW = 600, CH = 1160, GY = CH - 30, sd = 1230;
  const f = new Fig(base(sd, CH, { grimeY: GY - 170 }));
  const X = fx(f), furTex = X.hairTex(90);
  const H = 102;
  const P = [292, 758], C = [318, 652], N = [270, 532]; // the back arched: belly pushed forward, the chest up and back
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = -0.24, HC = add(N, add(mul(up, 54), [36, 6])), hF = frame(HC, hA, H);
  const SN = S.at(-0.32, 0.12), SF = S.at(0.42, 0.08);
  const WN = [206, 312], WF = [352, 290]; // the near arm goes up past the back of the head, never across the face; the far arm behind the face
  const EN = add(lerp(SN, WN, 0.52), [-10, 0]), EF = add(lerp(SF, WF, 0.5), [-8, 0]); // locked straight, a hair of bend
  const HN = S.at(-0.24, 1.0), KN = [246, 920], AN = [196, GY - 56]; // the planted rear leg, straight under the load
  const HF = S.at(0.3, 1.0), KF = [392, 914], AF = [420, GY - 52];
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the block: a cut slab of hard-packed snow, seen from below (it is above the eye): its long front face, the windward
  // end, a sliver of the underside; the hands under its bottom edge
  const BL = [168, 282], BR = [430, 268], BH = 150, DP = [30, 16]; // above the eye, so the back edges sit lower: the underside shows // bottom-left and -right of the front face, height, depth
  f.joint('block', lerp(WN, WF, 0.5), 'hand_n').joint('probe', S.at(-0.6, 0.2), 'torso').joint('knife', S.at(0.4, 0.86), 'pelvis').joint('skirt', S.at(0, 0.86), 'pelvis').joint('hood', S.at(-0.4, -0.04), 'torso');
  const PARKA = (o = {}) => HIDE(Object.assign({ tex: 'mottle' + sd, texOp: 0.4 }, o));

  f.bone('root');
  snowGround(f, 40, 580, GY, { depth: 30 });

  // ---- the antler snow probe slung on the back: a long straight tine-shaft, the point down behind the far leg
  f.bone('probe');
  const pr0 = S.at(-0.4, -0.25), pr1 = add(S.at(-0.9, 1.1), [-30, 120]);
  f.part(limb(add(pr0, [8, -30]), pr1, 13, 8, { steps: 10 }), BONE({ fill: '#d2cdc0', inkW: 1.3, tex: 'mottle' + sd, texOp: 0.45 }));
  for (let i = 0; i < 7; i++) f.line([lp(pr0, pr1, 0.1 + i * 0.12, -6), lp(pr0, pr1, 0.13 + i * 0.12, 5)], 1, PAL.boneD, { op: 0.65 });
  f.part([add(pr0, [8, -30]), add(pr0, [-6, -56]), add(pr0, [2, -60]), add(pr0, [14, -34])], BONE()); // a tine left at the top as a hand-hold
  X.icicles([lp(pr0, pr1, 0.5, 6), lp(pr0, pr1, 0.8, 6)], 2, 14, 4);

  // ---- far arm up to the block
  limb3(f, SF, EF, lerp(EF, WF, 0.9), [66, 56, 46], PARKA({ fill: mix(PAL.hide, PAL.hideS, 0.3), maxShade: 16 }), ['upperarm_f', 'forearm_f'], { point: 0.3, mus0: 0.28, mus0At: 0.55, mus1: 0.32, creaseCol: PAL.hideD });
  f.bone('forearm_f'); cuff(f, X, EF, lerp(EF, WF, 0.8), 52, 0.32, furTex);
  X.icicles([add(EF, [-26, 10]), add(EF, [-20, 30])], 2, 22, 5);

  // ---- legs: fur trousers, the hide knee pads worn through, sealskin boots
  const leg = (Hp, Kn, A, sfx, tone) => {
    limb3(f, Hp, Kn, A, [88, 64, 48], FUR({ fill: mix(PAL.fur, PAL.furS, tone), tex: furTex, texOp: 0.24 }), ['thigh' + sfx, 'shin' + sfx], { point: 0.22, mus0: 0.16, mus1: 0.26, ca: 1.57 });
    f.bone('shin' + sfx);
    const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], kc = lerp(Kn, A, 0.06);
    const pad = [add(add(kc, mul(n, 30)), mul(d, -26)), add(add(kc, mul(n, 36)), mul(d, 10)), add(add(kc, mul(n, 30)), mul(d, 34)), add(add(kc, mul(n, 4)), mul(d, 40)), add(add(kc, mul(n, -18)), mul(d, 26)), add(add(kc, mul(n, -20)), mul(d, -18)), add(add(kc, mul(n, 2)), mul(d, -30))];
    f.part(pad, PARKA({ fill: mix(PAL.hide, PAL.hideS, tone + 0.12), inkW: 1.3, cast: false, k: 0.9 }));
    clipDraw(f, pad, () => { f.stroke([add(add(kc, mul(n, 24)), mul(d, -14)), add(add(kc, mul(n, 26)), mul(d, 20))], 3, PAL.hideD, { op: 0.4 }); f.flat(ell(add(kc, mul(n, 8)), 18, 14, 0, 12), PAL.hideD, { op: 0.25 }); }); // scuffed dark where it took the kneeling
    X.voidPatch(ell(add(add(kc, mul(n, 6)), mul(d, 4)), 12, 9, Math.atan2(d[1], d[0]), 14), { rim: false, w: 1 }); // worn right through
    f.flat(ell(add(add(kc, mul(n, 6)), mul(d, 4)), 10, 7, Math.atan2(d[1], d[0]), 14), mix(PAL.fur, PAL.furS, tone + 0.1)); // the trouser fur shows through the worn hole
    for (const t of [-0.5, 0.7]) f.line([add(add(kc, mul(n, 36)), mul(d, t * 36)), add(add(kc, mul(n, 44)), mul(d, t * 36 + 4)), add(add(kc, mul(n, 40)), mul(d, t * 36 + 14))], 2, PAL.greyD); // the ties round the back of the knee, their ends stiff
    f.stitches([add(add(kc, mul(n, 28)), mul(d, -18)), add(add(kc, mul(n, 32)), mul(d, 10)), add(add(kc, mul(n, 26)), mul(d, 30))], PAL.hideD, 0.8);
    split(f, () => furBoot(f, X, Kn, A, 56, tone + 0.06, furTex, { beads: tone < 0.1, tufts: false }), [['shin' + sfx, side(A, [0.3, -1], 18)], ['foot' + sfx, side(A, [-0.3, 1], 18)]]);
  };
  leg(HF, KF, AF, '_f', 0.25);
  leg(HN, KN, AN, '_n', 0.04);

  // ---- the parka: short, to mid-thigh, belted; the hood thrown back
  f.bone('skirt');
  const sk = [S.at(-0.94, 0.74), S.at(0.94, 0.74), S.at(1.02, 0.95), lp(HF, KF, 0.32, -40), lp(HF, KF, 0.4, 40), lp(HN, KN, 0.36, 50), lp(HN, KN, 0.3, -46), S.at(-1.02, 0.96)];
  f.part(sk, PARKA());
  clipDraw(f, sk, () => { softTone(f, E.smooth(sk), [[[S.at(-1.2, 0.7), S.at(-0.5, 0.7), lp(HN, KN, 0.4, 0), lp(HN, KN, 0.4, -60)], PAL.hideS, 0.5, 12]]); folds(f, [[S.at(-0.4, 0.9), lp(HN, KN, 0.25, 10)], [S.at(0.5, 0.9), lp(HF, KF, 0.3, 0)]], 4); beadBand(f, [lp(HN, KN, 0.3, -46), lp(HN, KN, 0.36, 40), lp(HF, KF, 0.38, 20)], 10); });
  X.fringe([lp(HN, KN, 0.32, -46), lp(HN, KN, 0.38, 40), lp(HF, KF, 0.38, 30), lp(HF, KF, 0.33, -36)], 9, 10, 26, { ice: 0.5, fill: PAL.hide, tex: 'mottle' + sd });
  f.bone('hood');
  const hd = [S.at(-0.5, -0.1), S.at(-0.1, -0.2), S.at(-0.6, -0.3), S.at(-1.05, -0.1), S.at(-1.08, 0.2), S.at(-0.78, 0.28)];
  f.part(hd, FUR({ fill: mix(PAL.fur, PAL.furS, 0.12), tex: furTex, texOp: 0.25 }));
  f.part([S.at(-0.3, -0.18), S.at(-0.6, -0.24), S.at(-0.92, -0.06), S.at(-0.9, 0.06), S.at(-0.6, -0.06)], { fill: PAL.furS, shadow: PAL.furD, shade: 0.3, inkW: 1.2, cast: false, tex: furTex, texOp: 0.4 });
  forkHanks(f, X, [S.at(-1.06, 0.1), S.at(-1.05, 0.24), S.at(-0.8, 0.3)], 3, 18, 40, 12, 18, { ice: 0.4 });
  f.bone('torso');
  const tor = S.shape([[-0.14, 0.5, 0.5], [0.04, 1.02, 0.86], [0.26, 0.98, 0.9], [0.5, 0.76, 0.8], [0.76, 0.8, 0.78], [1.0, 0.92, 0.88]]); // broad shoulders and lats spread under the lift, the waist taken in
  f.part(tor, PARKA());
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-1.1, 0.1), S.at(-0.4, 0.05), S.at(-0.5, 0.95), S.at(-1.1, 0.95)], PAL.hideS, 0.5, 14], [[S.at(0.3, 0.1), S.at(0.9, 0.1), S.at(0.9, 0.4), S.at(0.3, 0.4)], '#ffffff', 0.4, 14]]);
    folds(f, [[S.at(-0.3, 0.1), S.at(-0.1, 0.4), S.at(0.0, 0.7)], [S.at(0.3, 0.5), S.at(0.55, 0.62), S.at(0.8, 0.6)], [S.at(-0.7, 0.3), S.at(-0.6, 0.6)]], 4); // pull folds up into the raised arms
    beadBand(f, [S.at(-0.4, -0.02), S.at(0.2, 0.1), S.at(0.8, 0.0)], 9); // the beaded yoke seam
  });
  // the strap of the probe across the chest
  rope(f, [S.at(-0.5, -0.1), S.at(0.2, 0.3), S.at(0.7, 0.62), S.at(0.9, 0.8)], 4.4, PAL.greyD);
  X.rime([S.at(0.2, 0.05), S.at(0.7, 0.1), S.at(0.95, 0.35), S.at(0.96, 0.7)], 11, -1); // caked on the windward chest
  // the belt, the snow knife: a long flat bone blade in the belt, the handle up
  f.bone('pelvis');
  const bl = [S.at(-1.0, 0.76), S.at(0.0, 0.8), S.at(0.98, 0.75), S.at(1.0, 0.84), S.at(0.0, 0.89), S.at(-1.02, 0.85)];
  f.part(bl, { fill: PAL.greyD, shadow: '#141418', shade: 0.35, tex: 'hatch' + sd, texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 14; i++) f.line([S.at(-0.94 + i * 0.14, 0.77), S.at(-0.9 + i * 0.14, 0.86)], 1.1, '#9a9c9e', { op: 0.55, straight: true });
  // the bone charm on its thong at the belt
  const ch = S.at(0.7, 0.86); cord(f, [ch, add(ch, [2, 20]), add(ch, [0, 34])], 1.2); f.part([add(ch, [-8, 32]), add(ch, [8, 30]), add(ch, [10, 44]), add(ch, [0, 54]), add(ch, [-9, 44])], BONE()); f.flat(ell(add(ch, [0, 42]), 2.4, 2.4, 0, 6), PAL.boneD);
  f.bone('knife');
  const kn0 = S.at(-0.3, 0.7), kn1 = lp(HN, KN, 0.62, -50), kd = E.norm(sub(kn1, kn0)), knn = [-kd[1], kd[0]];
  const blade = [add(kn0, mul(knn, -9)), add(add(kn0, mul(kd, 40)), mul(knn, -14)), add(kn1, mul(knn, -6)), [...add(kn1, mul(kd, 16)), 1], add(kn1, mul(knn, 9)), add(add(kn0, mul(kd, 40)), mul(knn, 12)), add(kn0, mul(knn, 9))];
  f.part(blade, BONE({ fill: '#e0dbcf', inkW: 1.4, tex: 'mottle' + sd, texOp: 0.4, maxShade: 8 }));
  f.line([add(add(kn0, mul(kd, 50)), mul(knn, 2)), add(kn1, mul(knn, 1))], 1, PAL.boneD, { op: 0.6 });
  const kh = [add(kn0, mul(knn, -8)), add(add(kn0, mul(kd, -54)), mul(knn, -7)), add(add(kn0, mul(kd, -58)), mul(knn, 6)), add(kn0, mul(knn, 8))];
  f.part(kh, BONE({ fill: PAL.boneS })); for (let i = 1; i < 5; i++) f.line([add(add(kn0, mul(kd, -i * 11)), mul(knn, -8)), add(add(kn0, mul(kd, -i * 11)), mul(knn, 8))], 2, PAL.greyD);

  // ---- head: tipped back, squinting up at the block; cropped hair frozen stiff in clumps; chapped lips
  f.bone('head');
  f.part(limb(S.at(0.12, -0.02), hF([[-0.05, 0.36]])[0], 56, 50), SKIN(sd));
  creases(f, hF([[-0.02, 0.5]])[0], hA + 1.4, 26, 2, PAL.skinS, 0.6); // the neck's cords under the load
  const hairB = hF([[-0.18, -0.46], [-0.4, -0.36], [-0.44, -0.1], [-0.38, 0.12], [-0.26, 0.1], [-0.24, -0.16], [-0.06, -0.36]]);
  f.part(hairB, FUR({ fill: '#c4c6c8', tex: X.hairTex(110), texOp: 0.35 }));
  face(f, X, HC, H, hA, { jaw: 1.16, chin: 0.04, nose: 1.05, squint: 0.85, browDown: 0.05, age: false, faceShade: 0.8, wrinkles: 0.25, hairCol: '#b8babc', browCol: '#f0f0ee' });
  // chapped lips: cracks across the lower lip
  for (let i = 0; i < 4; i++) f.line(hF([[0.2 + i * 0.03, 0.3], [0.21 + i * 0.03, 0.33]]), 1, INK, { op: 0.7 });
  // cropped hair frozen stiff: short clumps standing up and back off the crown, rimed tips
  const crown = hF([[0.18, -0.46], [-0.06, -0.56], [-0.3, -0.5], [-0.42, -0.3], [-0.42, -0.1], [-0.3, -0.08], [-0.1, -0.3], [0.1, -0.36], [0.28, -0.36]]);
  f.part(crown, FUR({ fill: '#c8cacc', tex: X.hairTex(140), texOp: 0.35 }));
  X.furField(crown, 14, 16, { dir: () => rot([-1, -0.4], hA), w: 2.6 });
  for (let i = 0; i < 9; i++) { const t = i / 8, p = hF([[0.24 - t * 0.66, -0.4 - Math.sin(Math.PI * t) * 0.14]])[0], d = rot([-0.7 - t * 0.4, -1 + t * 0.5], hA); X.lock(p, 10 + f.r() * 9, 8 + f.r() * 4, { dir: d, sway: (f.r() - 0.5) * 4, cast: false, fill: i % 2 ? '#d4d6d8' : '#bcbec0' }); }
  X.rime(hF([[0.1, -0.5], [0.3, -0.42], [0.4, -0.26]]), 5, 1);

  // ---- the block, above the hands: cut faces scored with saw marks, the edges crumbled a little, rime on the windward
  // end, icicles from the underside; a clean round hole straight through it
  f.bone('block');
  const TL = [BL[0], BL[1] - BH], TR = [BR[0], BR[1] - BH];
  const shp = a => a.map(q => [q[0], q[1], 1]), front = shp([BL, BR, TR, TL]), endF = shp([BR, add(BR, DP), add(TR, DP), TR]), under = shp([BL, add(BL, DP), add(BR, DP), BR]); // hard corners (a smoothed clip would bulge past the cut faces)
  // (review) the hole sat dead centre on the blank face with a pale ring, and read as a lens or an eye: it is now off
  // centre toward the windward end, and the bore runs at an angle (the far exit offset), so the black tunnel wall shows as
  // a crescent beside the see-through opening: a hole bored through a thick block, not a disc on its face
  const hole = X.hole([372, 196], 30, 34, 0.15, [18, -10]);
  X.cut([hole], () => {
    f.part(under, { fill: '#c4c8cc', shadow: PAL.snowD, light: '#e8eaec', shade: 0.3, inkW: 1.4, cast: false, sharp: true, grime: false, hatch: true, tex: X.icetex, texOp: 0.3 });
    f.part(endF, { fill: '#f6f7f7', shadow: PAL.snowS, light: '#ffffff', shade: 0.2, maxShade: 8, inkW: 1.6, sharp: true, cast: false, tex: X.icetex, texOp: 0.3 });
    f.part(front, { fill: PAL.snow, shadow: PAL.snowS, light: '#ffffff', shade: 0.25, maxShade: 18, inkW: 2, inkHeavy: 3, sharp: true, cast: false, tex: X.icetex, texOp: 0.35 });
    clipDraw(f, front, () => {
      softTone(f, E.smooth(front), [[[TL, [260, 130], [230, 300], BL], PAL.snowS, 0.5, 18]]);
      for (let i = 0; i < 9; i++) { const x = 200 + i * 26 + f.r() * 8; f.line([[x, BL[1] - 140], [x + 10, BL[1] - 70 + f.r() * 20], [x + 6, BL[1] - 4]], 1, PAL.snowD, { op: 0.6 }); } // the saw's strokes down the cut face
      for (let i = 0; i < 3; i++) f.line([[190, 180 + i * 34], [440, 166 + i * 34]], 1.2, '#ffffff', { op: 0.8 }); // the wind-packed layers
      X.frost([310, 200], 120, 60, 18, 1.4);
    });
    clipDraw(f, endF, () => { for (let i = 0; i < 4; i++) f.line([lerp(BR, TR, 0.15 + i * 0.22), add(lerp(BR, TR, 0.15 + i * 0.22), DP)], 1, PAL.snowD, { op: 0.5 }); });
    X.holeWall(hole);
  });
  X.holeRim(hole, { w: 2 });
  // the crumbled corners and the rime on the windward end and top
  f.part([TL, add(TL, [16, -6]), add(TL, [30, 4]), add(TL, [6, 14])], { fill: '#f2f4f4', shadow: PAL.snowS, shade: 0.2, inkW: 1, cast: false, hatch: false });
  X.rime([add(TR, DP), TR, add(TR, [-60, 2])], 6, -1);
  X.rime([add(BR, DP), add(TR, DP)], 8, 1);
  X.icicles([lerp(BL, BR, 0.05), lerp(BL, BR, 0.2)], 2, 30, 7); X.icicles([lerp(BL, BR, 0.75), add(BR, DP)], 3, 36, 7);

  // ---- the hands under the block's bottom edge, mittened, the palms flat against it
  f.bone('hand_f');
  mittenFlat(f, X, add(WF, [0, 4]), deg(-12), 64, PARKA({ fill: mix(PAL.hide, PAL.hideS, 0.3) }), { tone: 0.35 });
  // ---- the near arm, locked straight up; a clean round hole through the forearm
  const fh = X.hole(lerp(EN, WN, 0.46), 13, 14, 0, [4, 2]);
  X.cut([fh], () => {
    limb3(f, SN, EN, lerp(EN, WN, 0.92), [72, 60, 50], PARKA({ maxShade: 18 }), ['upperarm_n', 'forearm_n'], { point: 0.3, mus0: 0.3, mus0At: 0.55, mus1: 0.34, creaseCol: PAL.hideD, inside: sh => folds(f, [[lp(SN, EN, 0.2, -14), lp(SN, EN, 0.8, -12)], [lp(EN, WN, 0.1, 12), lp(EN, WN, 0.4, 14)]], 3) });
    f.bone('forearm_n'); X.holeWall(fh);
  });
  f.bone('forearm_n'); X.holeRim(fh, { w: 1.6 });
  cuff(f, X, EN, lerp(EN, WN, 0.82), 58, 0.06, furTex);
  X.rime([lp(EN, WN, 0.05, 30), lp(EN, WN, 0.7, 30)], 7, 1);
  X.icicles([add(EN, [-30, 12]), add(EN, [-26, 34])], 2, 26, 6); // icicles from the elbow
  f.bone('torso'); X.rime([add(SN, [-20, -10]), add(SN, [10, -30]), add(SN, [40, -24])], 9, -1);
  f.bone('hand_n');
  mittenFlat(f, X, add(WN, [0, 4]), deg(-10), 66, PARKA({}), { tone: 0.08 });

  f.bone('foot_n'); snowLip(f, [AN[0] + 24, GY + 3], 90, 8);
  f.bone('foot_f'); snowLip(f, [AF[0] + 24, GY + 3], 80, 5); // the front foot light: barely sunk
  return f;
}

// ------------------------------------------------------------------ SLEDGE HAULER (Large 1.3)
// The herder woman who hauled the clan's goods after the dogs died: huge, broad, leaning almost forty-five degrees into
// a hide chest strap, legs driving, frozen mid-stride, the weight over the front foot. The strap crosses her breastbone
// and runs back under the arms to the sledge's traces, taut. A clean round hole through her near forearm where the strap
// rubbed. Long hide coat kilted up over fur trousers; snowshoes of bent wood and sinew; one mitten lost, the bare near
// hand white with frostbite on the strap; a knife at her hip. Her braid frozen stiff in its forward swing; icicles from
// her chin and the strap; rime thick on the windward side. Wide wind-burnt face, the mouth clenched, the eyes fixed ahead.
// The sledge: bone-shod runners curled up at the front, crossbars, heaped with hides, a rolled tent and a cooking pot,
// tent poles sticking out behind, lashing ropes, an empty cradleboard hoop tied on top. No footprints, no shadow.
// True size: 1.3, plus a sledge a human long behind her, so the canvas is widened at the same scale.
// Rig: standard humanoid + braid (head), skirt (pelvis), traces (torso), sledge (root; its pivot at the trace bar, so the
// attack swings it round), knife (pelvis).
function sledgeHauler() {
  const CW = 1500, CH = TIERS.large[1], GY = CH - 30, sd = 1228;
  const f = new Fig(base(sd, CH, { grimeY: GY - 220 }));
  const X = fx(f, 1.2), furTex = X.hairTex(90);
  const H = 126;
  const P = [1100, 690], u45 = E.norm([0.72, -0.7]), N = add(P, mul(u45, 278)), C = add(add(P, mul(u45, 150)), [-26, -24]); // the back rounds over the pull
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = 0.18, HC = add(N, add(mul(up, 58), [34, 4])), hF = frame(HC, hA, H); // the neck stretched forward, the face level: eyes fixed ahead
  const SN = S.at(-0.3, 0.14), SF = S.at(0.42, 0.1);
  const EN = add(SN, [-4, 164]), WN = S.at(1.04, 0.26); // the bare near hand on the strap at the breastbone, pulling it down
  const EF = add(SF, [62, 118]), WF = add(SF, [148, 190]); // the far arm hangs forward, mittened fist clenched
  const HN = S.at(-0.2, 1.0), KN = [1012, 862], AN = [902, 990]; // the near leg driving back, the heel up
  const HF = S.at(0.32, 0.98), KF = [1246, 822], AF = [1282, GY - 66]; // the front leg bent under the weight
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const BAR = [700, 900]; // the sledge's front trace bar
  f.joint('braid', hF([[-0.3, -0.1]])[0], 'head').joint('skirt', S.at(0, 0.86), 'pelvis').joint('traces', S.at(-0.6, 0.3), 'torso').joint('sledge', BAR).joint('knife', S.at(-0.6, 0.9), 'pelvis');
  const COAT = (o = {}) => HIDE(Object.assign({ tex: 'mottle' + sd, texOp: 0.4 }, o));

  f.bone('root');
  snowGround(f, 30, 1480, GY, { depth: 34 });

  // ---- the sledge behind her: drawn first; runners, crossbars, the heaped load lashed down, poles out behind
  f.bone('sledge');
  const RY = GY - 16, rx0 = 110, rx1 = 720; // near runner on the snow; the far runner a little higher and further
  const runner = (dy, dx, tone) => {
    const r = [[rx0 + dx, RY + dy - 26], [rx1 - 30 + dx, RY + dy - 26], [rx1 + 20 + dx, RY + dy - 40], [rx1 + 44 + dx, RY + dy - 80], [rx1 + 36 + dx, RY + dy - 100], [rx1 + 24 + dx, RY + dy - 92], [rx1 + 26 + dx, RY + dy - 64], [rx1 + 4 + dx, RY + dy - 44], [rx1 - 30 + dx, RY + dy - 40], [rx0 + dx, RY + dy - 40]];
    f.part(r, { fill: mix(PAL.wood, '#000', tone), shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood' + sd, inkW: 1.5 });
    // the bone shoeing under it, pegged
    const sh = [[rx0 + dx, RY + dy - 26], [rx1 - 30 + dx, RY + dy - 26], [rx1 + 18 + dx, RY + dy - 38], [rx1 + 22 + dx, RY + dy - 30], [rx1 - 26 + dx, RY + dy - 14], [rx0 + dx, RY + dy - 14]];
    f.part(sh, BONE({ fill: mix(PAL.bone, '#000', tone) }));
    for (let i = 0; i < 9; i++) f.flat(ell([rx0 + 30 + i * 66 + dx, RY + dy - 20], 2, 2, 0, 6), PAL.boneD);
  };
  runner(-30, 40, 0.25);
  // the load: hides heaped, the rolled tent, the pot, the poles, all lashed; the cradleboard hoop on top
  const load = [[150, RY - 60], [170, RY - 128], [214, RY - 150], [236, RY - 206], [300, RY - 228], [350, RY - 262], [430, RY - 256], [470, RY - 272], [548, RY - 240], [600, RY - 230], [640, RY - 186], [690, RY - 170], [712, RY - 110], [720, RY - 60], [700, RY - 40], [160, RY - 40]]; // heaped bundles, not a dome
  // tent poles first, sticking out behind (left)
  for (const [a, b2, w] of [[[560, RY - 200], [20, RY - 330], 12], [[600, RY - 170], [40, RY - 268], 11], [[520, RY - 214], [70, RY - 380], 10]]) { f.part(limb(a, b2, w, w * 0.8, { steps: 8 }), { fill: PAL.wood, shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood' + sd, inkW: 1.3 }); X.icicles([lerp(a, b2, 0.6), lerp(a, b2, 0.9)], 2, 16, 4); }
  // (review: the load was one smooth polygon and read as a loaf) separate bundles, each with its own outline, edges and
  // ties: a flat stack of hides on the runners, a folded bundle behind, a tied bundle in front; the tent rolled on top
  const bundle = (pts, fill, edges, ties) => { f.part(pts, HIDE({ fill, tex: 'mottle' + sd, texOp: 0.45, maxShade: 18 })); clipDraw(f, pts, () => { softTone(f, E.smooth(pts), [[pts.slice(Math.floor(pts.length / 2)).map(q => add(q, [0, 30])), PAL.hideS, 0.45, 12]]); for (const q of edges) { f.stroke(q, 5, PAL.hideD, { op: 0.5 }); f.line(q.map(v => add(v, [3, -4])), 1.2, '#ffffff', { op: 0.85 }); } }); for (const [p0, p1] of ties) rope(f, [p0, lerp(p0, p1, 0.5), p1], 3, PAL.greyD); };
  bundle([[300, RY - 100], [330, RY - 196], [420, RY - 226], [510, RY - 210], [540, RY - 104]], '#c6c6c0', [[[340, RY - 160], [430, RY - 180], [530, RY - 160]]], []); // a bundle further back, between the others
  bundle([[150, RY - 40], [156, RY - 96], [250, RY - 116], [420, RY - 108], [600, RY - 122], [712, RY - 98], [720, RY - 40]], '#dcdcd6', [[[160, RY - 60], [400, RY - 70], [710, RY - 58]], [[162, RY - 82], [420, RY - 90], [706, RY - 80]]], []); // the flat stack of hides, their edges in layers
  bundle([[196, RY - 104], [204, RY - 168], [250, RY - 200], [336, RY - 198], [384, RY - 160], [376, RY - 106]], '#e6e6e0', [[[214, RY - 140], [290, RY - 160], [370, RY - 140]]], [[[290, RY - 200], [296, RY - 104]]]); // a folded bundle behind
  bundle([[452, RY - 112], [470, RY - 186], [548, RY - 214], [636, RY - 196], [690, RY - 150], [684, RY - 112]], '#d0d0ca', [[[480, RY - 150], [580, RY - 176], [676, RY - 150]]], [[[560, RY - 212], [566, RY - 112]]]); // a tied bundle in front
  X.furField([[160, RY - 100], [700, RY - 100], [700, RY - 50], [160, RY - 50]], 20, 18, { dir: () => [0.1, 1], w: 2.6 });
  // a fur-out hide hanging over the side of the load, its edge in frozen hanks
  forkHanks(f, X, [[230, RY - 120], [330, RY - 112], [440, RY - 118]], 7, 26, 60, 14, 22, { ice: 0.5, tone: 0.06 });
  // the rolled tent along the top, tied
  const tent = [[230, RY - 222], [520, RY - 262], [540, RY - 236], [528, RY - 212], [240, RY - 176], [222, RY - 196]];
  f.part(tent, HIDE({ fill: '#d4d4ce', tex: 'mottle' + sd, texOp: 0.4 }));
  f.part(ell([232, RY - 199], 14, 24, 0.2, 16), HIDE({ fill: '#c4c4be', cast: false })); for (let i = 0; i < 3; i++) f.line(ell([232, RY - 199], 4 + i * 4, 8 + i * 6, 0.2, 14).concat([ell([232, RY - 199], 4 + i * 4, 8 + i * 6, 0.2, 14)[0]]), 1, PAL.hideD, { op: 0.6 });
  // the cooking pot, iron, lashed on its side at the front of the load
  const pot = [620, RY - 150];
  f.part([add(pot, [-44, -30]), add(pot, [40, -36]), add(pot, [50, 14]), add(pot, [30, 40]), add(pot, [-30, 42]), add(pot, [-50, 12])], { fill: PAL.iron, shadow: PAL.ironD, light: '#8a8e92', shade: 0.38, tex: 'mottle' + sd, texOp: 0.6, inkW: 1.6 });
  f.part(ell(add(pot, [-2, -33]), 42, 8, -0.06, 16), { fill: '#2a2c30', shadow: '#0e0e10', shade: 0.3, inkW: 1.4, cast: false, hatch: false });
  f.line([add(pot, [-40, -26]), add(pot, [-60, 0]), add(pot, [-48, 30])], 3, PAL.greyD); // the bail, fallen against its side
  f.line([add(pot, [-30, 0]), add(pot, [-22, 30])], 1.4, '#a8acb0', { op: 0.7 }); X.rime([add(pot, [-40, -34]), add(pot, [0, -40]), add(pot, [40, -38])], 5, -1);
  // the empty cradleboard hoop tied on top: a bent-wood arch, its charms gone, its lashing ends
  const hp = [400, RY - 250];
  f.line([add(hp, [-60, 6]), add(hp, [-50, -70]), add(hp, [0, -104]), add(hp, [50, -74]), add(hp, [62, 0])], 11, INK); f.line([add(hp, [-60, 6]), add(hp, [-50, -70]), add(hp, [0, -104]), add(hp, [50, -74]), add(hp, [62, 0])], 7.5, PAL.wood);
  f.line([add(hp, [-54, -60]), add(hp, [0, -94]), add(hp, [46, -66])], 1.2, '#b8b8b2', { op: 0.6 });
  for (const q of [add(hp, [-30, -94]), add(hp, [20, -100])]) { cord(f, [q, add(q, [1, 12])], 1); } // the cords where the charms hung, cut short
  // lashing ropes over the load, to the runners
  for (const [a, b2] of [[[200, RY - 40], [270, RY - 230]], [[360, RY - 40], [380, RY - 252]], [[520, RY - 40], [470, RY - 258]], [[660, RY - 40], [600, RY - 210]]]) rope(f, [a, lerp(a, b2, 0.5), b2], 3.4, PAL.greyD);
  rope(f, [[170, RY - 130], [330, RY - 190], [520, RY - 200], [690, RY - 120]], 3.4, PAL.greyD);
  X.rime([[206, RY - 172], [250, RY - 200], [336, RY - 198]], 8, -1); X.rime([[476, RY - 188], [548, RY - 214], [636, RY - 196], [690, RY - 150]], 8, -1); X.rime([[250, RY - 228], [380, RY - 248], [520, RY - 266]], 8, -1); // rime on the windward tops of the bundles and the tent roll
  X.icicles([[200, RY - 40], [700, RY - 40]], 7, 24, 6);
  runner(0, 0, 0);
  // crossbar stanchions between the runners and the load
  for (const x of [190, 360, 530, 680]) f.part([[x - 7, RY - 40], [x + 7, RY - 40], [x + 9 + 20, RY - 70], [x - 5 + 20, RY - 70]], { fill: PAL.wood, shadow: PAL.woodD, shade: 0.35, inkW: 1.2, cast: false, tex: 'wood' + sd });
  // the trace bar at the front and the traces' ends
  f.part([add(BAR, [-12, -20]), add(BAR, [12, -22]), add(BAR, [16, 40]), add(BAR, [-8, 42])], { fill: PAL.wood, shadow: PAL.woodD, shade: 0.35, inkW: 1.3, tex: 'wood' + sd });
  snowLip(f, [420, GY + 2], 640, 8);

  // ---- the traces: two braided hide lines from the trace bar, taut, up to the strap at her back
  f.bone('traces');
  const tA = S.at(-0.6, 0.34), tB = S.at(-0.4, 0.46);
  for (const [a, w] of [[tA, 5], [tB, 4.6]]) { rope(f, [add(BAR, [0, a === tA ? -8 : 14]), a], w, PAL.hide); }
  X.icicles([lerp(BAR, tA, 0.3), lerp(BAR, tA, 0.75)], 4, 26, 5);

  // ---- far arm hanging forward (behind the body), mittened fist
  limb3(f, SF, EF, lerp(EF, WF, 0.9), [80, 70, 60], COAT({ fill: mix(PAL.hide, PAL.hideS, 0.3), maxShade: 20 }), ['upperarm_f', 'forearm_f'], { point: 0.3, mus0: 0.2, mus1: 0.24, creaseCol: PAL.hideD });
  f.bone('forearm_f'); cuff(f, X, EF, lerp(EF, WF, 0.82), 70, 0.3, furTex);
  f.bone('hand_f');
  const gF = B.fist(f, WF, ang(EF, WF), 36, mix(PAL.hide, PAL.hideS, 0.3), { tex: 'mottle' + sd, texOp: 0.4, shadow: PAL.hideS });
  f.part(gF([[-0.5, -0.66], [0.3, -0.72], [0.66, -0.4], [0.7, 0.3], [0.4, 0.66], [-0.5, 0.6]]), COAT({ fill: mix(PAL.hide, PAL.hideS, 0.3), inkW: 1.3, cast: false })); // the mitten closed over the fist
  f.part(gF([[-0.3, -0.62], [0.1, -0.96], [0.36, -0.9], [0.3, -0.6]]), COAT({ fill: mix(PAL.hide, PAL.hideS, 0.38), inkW: 1.1, cast: false })); // its thumb
  f.line(gF([[0.2, -0.5], [0.4, 0.0], [0.3, 0.5]]), 1.1, PAL.hideD, { op: 0.6 });

  // ---- legs: thick fur trousers; snowshoes of bent wood and sinew
  const shoe = (A, tilt, tone) => {
    // a bent-wood frame (a long oval, its toe turned up), sinew lacing, the foot strapped on; seen at a low angle
    const c = add(A, [18, 46]), F = frame(c, tilt, 1);
    const fr = F(ell([0, 0], 116, 22, 0, 30).map(q => [q[0], q[1] + (q[0] > 70 ? -(q[0] - 70) * 0.3 : 0)]));
    f.flat(F(ell([0, 0], 104, 16, 0, 30).map(q => [q[0], q[1] + (q[0] > 70 ? -(q[0] - 70) * 0.3 : 0)])), mix('#c8ccd0', '#000', tone), { op: 0.35 });
    for (let i = -5; i <= 5; i++) { f.line(F([[i * 18, -16], [i * 18 + 6, 16]]), 1, PAL.greyD, { op: 0.8 }); f.line(F([[-100, i * 2.6], [100, i * 2.6]]), 0.8, PAL.greyD, { op: 0.45 }); }
    f.line(fr.concat([fr[0]]), 6, INK); f.line(fr.concat([fr[0]]), 3.6, mix(PAL.wood, '#000', tone));
    f.line(F([[-30, -14], [-34, 14]]), 3, PAL.wood); f.line(F([[40, -16], [36, 16]]), 3, PAL.wood); // the cross-bars
    X.icicles(F([[-90, 18], [60, 20]]), 3, 12, 3);
  };
  const leg = (Hp, Kn, A, sfx, tone, heelUp) => {
    // (review: the driving leg read as a plain tube) the trousers bunched behind the knee and at the boot top, the thigh's
    // lit top and dark underside, the calf's swell, and the fur hanging in frozen clumps off the back of the thigh
    const d0 = E.norm(sub(Kn, Hp)), n0 = [-d0[1], d0[0]], und = n0[1] > 0 ? 1 : -1;
    limb3(f, Hp, Kn, A, [134, 96, 64], FUR({ fill: mix(PAL.fur, PAL.furS, tone), tex: furTex, texOp: 0.24, maxShade: 24 }), ['thigh' + sfx, 'shin' + sfx], { point: 0.26, mus0: 0.24, mus1: 0.36, ca: 1.57, inside: sh => {
      X.furField(sh, 30, 30, { dir: () => [0.1, 1], w: 3.4 });
      softTone(f, E.smooth(sh), [[[lp(Hp, Kn, -0.2, und * 10), lp(Hp, Kn, 1.1, und * 10), lp(Hp, Kn, 1.1, und * 100), lp(Hp, Kn, -0.2, und * 100)], PAL.furD, 0.5, 12], [[lp(Hp, Kn, 0.1, -und * 14), lp(Hp, Kn, 0.9, -und * 14), lp(Hp, Kn, 0.9, -und * 70), lp(Hp, Kn, 0.1, -und * 70)], '#ffffff', 0.5, 12]]);
      folds(f, [[lp(Hp, Kn, 0.74, und * 50), lp(Kn, A, 0.06, -und * 30), lp(Kn, A, 0.2, -und * 40)], [lp(Hp, Kn, 0.86, und * 30), lp(Kn, A, 0.12, -und * 14)], [lp(Kn, A, 0.62, -30), lp(Kn, A, 0.7, 0), lp(Kn, A, 0.62, 30)], [lp(Hp, Kn, 0.3, -und * 50), lp(Hp, Kn, 0.5, -und * 20)]], 4, PAL.furD, 0.55);
    } });
    f.bone('thigh' + sfx); forkHanks(f, X, [lp(Hp, Kn, 0.3, und * 62), lp(Hp, Kn, 0.85, und * 50)], 3, 20, 40, 12, 18, { ice: 0.5, tone: tone + 0.12, fade: false });
    split(f, () => {
      if (heelUp) {
        // the rear foot driving off its toe: the boot tilted, the snowshoe tilted with it, its tail on the snow
        const F = frame(A, deg(28), 1);
        f.part(F([[-30, -40], [30, -40], [44, 10], [110, 36], [118, 56], [100, 66], [-20, 58], [-40, 20]]), FUR({ fill: mix(PAL.fur, PAL.furS, tone + 0.1), tex: furTex, texOp: 0.22 }));
        f.flat(F([[-24, 52], [116, 56], [100, 66], [-20, 60]]), '#3a3c40', { op: 0.9 });
        shoe(add(A, [10, -4]), deg(28), 0.2);
      } else {
        furBoot(f, X, Kn, A, 70, tone, furTex, { tufts: false });
        shoe([A[0] + 20, A[1] + 12], 0, 0);
      }
    }, [['shin' + sfx, side(A, [0.3, -1], 22)], ['foot' + sfx, side(A, [-0.3, 1], 22)]]);
  };
  leg(HF, KF, AF, '_f', 0.25, false);
  // ---- the near leg, driving back off its toe (under the coat's kilted skirt)
  leg(HN, KN, AN, '_n', 0.05, true);

  // ---- the coat: long hide coat kilted up into the belt over the trousers; it hangs off the back in a frozen swag
  f.bone('skirt');
  const sk = [S.at(-0.95, 0.72), S.at(0.95, 0.74), S.at(1.0, 0.95), lp(HF, KF, 0.3, -50), lp(HF, KF, 0.42, 60), S.at(-0.3, 1.16), S.at(-0.9, 1.08), S.at(-1.15, 0.92)];
  f.part(sk, COAT());
  clipDraw(f, sk, () => { softTone(f, E.smooth(sk), [[[S.at(-1.3, 0.7), S.at(-0.6, 0.7), S.at(-0.6, 1.2), S.at(-1.3, 1.2)], PAL.hideS, 0.5, 14]]); folds(f, [[S.at(0.6, 0.82), S.at(0.3, 1.0), S.at(-0.1, 1.1)], [S.at(-0.4, 0.82), S.at(-0.7, 1.0)], [S.at(0.2, 0.8), S.at(-0.2, 0.96)]], 5); }); // pulled up in bunches where it is tucked in
  X.fringe([S.at(-1.15, 0.92), S.at(-0.9, 1.08), S.at(-0.3, 1.16), lp(HF, KF, 0.42, 60)], 9, 14, 40, { ice: 0.5, fill: PAL.hide, tex: 'mottle' + sd });
  f.bone('torso');
  const tor = S.shape([[-0.12, 0.5, 0.48], [0.06, 1.1, 0.8], [0.3, 1.14, 0.98], [0.55, 1.04, 1.0], [0.8, 1.02, 0.98], [1.0, 1.04, 1.0]]); // a thick back
  f.part(tor, COAT());
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-1.2, 0.3), S.at(-0.3, 0.4), S.at(0.6, 1.0), S.at(-1.2, 1.0)], PAL.hideS, 0.5, 20], [[S.at(-0.9, -0.1), S.at(0.2, -0.1), S.at(0.0, 0.3), S.at(-0.8, 0.3)], '#ffffff', 0.4, 18]]);
    folds(f, [[S.at(-0.8, 0.2), S.at(-0.5, 0.5), S.at(-0.5, 0.8)], [S.at(0.2, 0.5), S.at(0.6, 0.68), S.at(0.9, 0.66)], [S.at(-0.2, 0.2), S.at(0.0, 0.55)]], 5);
    f.stitches([S.at(-0.98, 0.3), S.at(-0.7, 0.28), S.at(-0.3, 0.34)], PAL.hideD, 1);
    beadBand(f, [S.at(-0.5, -0.04), S.at(0.3, 0.06), S.at(0.95, 0.0)], 10);
  });
  X.rime([S.at(-0.8, -0.06), S.at(-0.3, -0.16), S.at(0.3, -0.12), S.at(0.8, 0.0), S.at(1.0, 0.25)], 16, -1); // thick on the windward back and shoulder
  // the belt and the knife at the hip
  f.bone('pelvis');
  const bl = [S.at(-1.04, 0.76), S.at(0.0, 0.8), S.at(1.0, 0.76), S.at(1.02, 0.85), S.at(0.0, 0.89), S.at(-1.06, 0.86)];
  f.part(bl, { fill: PAL.greyD, shadow: '#141418', shade: 0.35, tex: 'hatch' + sd, texOp: 0.5, k: 0.6 });
  f.bone('knife');
  const kS = S.at(-0.6, 0.88), kF = frame(kS, deg(120), 1);
  f.part(kF([[0, -11], [80, -9], [98, 0], [80, 9], [0, 11]]), { fill: '#3a3c40', shadow: '#16161a', shade: 0.4, inkW: 1.2, tex: 'mottle' + sd });
  for (const t of [16, 52]) f.part(kF([[t, -12], [t + 8, -12], [t + 8, 12], [t, 12]]), BONE({ sharp: true }));
  f.part(kF([[-44, -8], [0, -9], [0, 9], [-44, 8]]), BONE());

  // ---- the head: wide wind-burnt face, the mouth clenched, the eyes fixed ahead; the hood down on the back
  f.bone('head');
  f.part(limb(S.at(0.15, -0.02), hF([[-0.05, 0.36]])[0], 74, 66), SKIN(sd));
  creases(f, hF([[-0.02, 0.56]])[0], hA + 1.5, 34, 2, PAL.skinS, 0.6);
  f.part(hF([[-0.2, -0.46], [-0.42, -0.34], [-0.48, -0.06], [-0.4, 0.2], [-0.28, 0.16], [-0.26, -0.14], [-0.08, -0.36]]), FUR({ fill: '#c4c6c8', tex: X.hairTex(120), texOp: 0.35 }));
  face(f, X, HC, H, hA, { jaw: 1.22, chin: 0.02, nose: 0.96, squint: 0.55, browDown: 0.07, faceShade: 0.8, wrinkles: 0.45, hairCol: '#b8babc', browCol: '#f0f0ee', mouth: 'set' });
  const fF = hF;
  f.stroke(fF([[0.17, 0.27], [0.24, 0.265], [0.32, 0.28]]), 3.2, INK); // the clenched mouth, pressed hard
  crease(f, fF([[0.15, 0.24], [0.14, 0.3]]), 1.6, { col: PAL.skinS, op: 0.7 });
  X.bite(fF([[0.24, 0.08]])[0], 10, 8, 4, 0.35); X.bite(fF([[0.36, 0.12]])[0], 5, 4, 2, 0.5); // wind-burn on the cheek and the nose
  // hair: centre-parted, pulled back to the nape into one thick braid; the braid frozen stiff in its forward swing
  const hr = fF([[0.18, -0.46], [-0.06, -0.56], [-0.3, -0.5], [-0.44, -0.3], [-0.46, -0.02], [-0.36, 0.1], [-0.3, -0.12], [-0.12, -0.32], [0.1, -0.38], [0.26, -0.34]]);
  hairMass(f, X, hr, null, { fill: '#cacccf', ang: 150, n: 14, len: 22, dir: () => rot([-1, 0.2], hA) });
  X.rime(fF([[0.08, -0.52], [0.26, -0.44], [0.38, -0.28]]), 6, 1);
  for (const [u, v, l] of [[0.24, 0.5, 26], [0.12, 0.54, 18], [0.32, 0.18, 12]]) X.icicle(fF([[u, v]])[0], l, 6); // icicles from the chin and the nose
  f.bone('braid');
  const b0 = fF([[-0.36, 0.0]])[0];
  braid(f, X, [b0, add(b0, [10, 60]), add(b0, [56, 120]), add(b0, [118, 150])], 26, { ties: [0.15, 0.7], fill: '#cacccf' }); // swung forward and frozen there

  // ---- the chest strap: broad hide across the breastbone, back over the shoulder and under the arm to the traces
  f.bone('torso');
  const st1 = [S.at(1.06, 0.3), S.at(0.75, 0.12), S.at(0.25, -0.02), S.at(-0.3, 0.04), S.at(-0.62, 0.3)]; // from the breastbone up over the near shoulder and down the back to the traces (and under the far arm, unseen)
  f.part(ribbon(spline(st1, 6), spline(st1, 6).map((_, i, A) => 34 - 6 * i / A.length)), HIDE({ fill: '#cfcfc8', tex: 'mottle' + sd, texOp: 0.5, inkW: 1.6, cast: false, maxShade: 8 }));
  for (const t of [0.2, 0.5, 0.8]) { const q = spline(st1, 6)[Math.round(t * (spline(st1, 6).length - 1))]; f.part(ell(q, 6, 6, 0, 10), BONE()); }
  f.stitches(spline(st1, 6).slice(2, -2), PAL.hideD, 0.9);
  X.icicles([S.at(0.75, 0.16), S.at(0.25, 0.02)], 3, 30, 6); // icicles from the strap
  // ---- the near arm: the bare hand on the strap, frostbitten white; a clean hole through the forearm where it rubbed
  const fh = X.hole(lerp(EN, WN, 0.64), 14, 15, 0, [5, 2]);
  X.cut([fh], () => {
    limb3(f, SN, EN, lerp(EN, WN, 0.72), [96, 80, 66], COAT({ maxShade: 22 }), ['upperarm_n', 'forearm_n'], { point: 0.35, mus0: 0.22, mus1: 0.26, creaseCol: PAL.hideD, inside: sh => folds(f, [[lp(SN, EN, 0.2, 20), lp(SN, EN, 0.8, 24)]], 4) });
    f.bone('forearm_n');
    f.part(jointLimb(lerp(EN, WN, 0.4), lerp(EN, WN, 0.75), WN, [62, 56, 46], { mus0: 0.2 }), SKIN(sd, { fill: mix(PAL.skin, PAL.bite, 0.2) })); // the bare forearm out of the pushed-up sleeve
    X.holeWall(fh);
  });
  f.bone('forearm_n'); X.holeRim(fh, { w: 1.8 });
  cuff(f, X, EN, lerp(EN, WN, 0.3), 78, 0.06, furTex);
  X.rime([lp(EN, WN, 0.0, 40), lp(EN, WN, 0.28, 40)], 8, 1);
  f.bone('hand_n');
  const sdir = E.norm(sub(S.at(1.05, 0.2), S.at(0.6, 0.04)));
  const gN = B.grip(f, WN, EN, Math.atan2(sdir[1], sdir[0]), 40, mix(PAL.skin, PAL.bite, 0.15), { tex: 'mottle' + sd, texOp: 0.45, shadow: PAL.skinS, name: 'hauler strap', maxBend: 40 });
  fistDetail(f, gN, 40, PAL.skin, {});
  for (let i = 0; i < 4; i++) f.flat(gN.F(ell([0.55, -0.45 + i * 0.3], 0.1, 0.09, 0, 8)), PAL.biteD, { op: 0.6 }); // frostbite blackening the knuckles
  X.bite(gN.F([[0, 0]])[0], 16, 12, 6, 0.5);
  f.bone('torso'); X.rime([add(SN, [-30, -20]), add(SN, [10, -40]), add(SN, [50, -34])], 12, -1);

  f.bone('foot_f'); snowLip(f, [AF[0] + 30, GY + 3], 110, 4); // snowshoes: barely sunk; no prints behind her
  return f;
}

// ------------------------------------------------------------------ THE SILENT SINGERS (Human 1.0, two figures)
// Two throat-singers of the camp, face to face in their contest, each gripping the other's forearms, leaning in until
// their faces almost touch; together one silhouette, an arch, their weight on their outer feet, braced against each other.
// Between their open mouths hangs a small black void, a clean hole in the air where the sound was. Each is her own
// woman (never a clone): the elder (near the heroes' side? no: the left in drawing, so the right in the game) is short,
// heavy and grey, her face lined, with cheek tattoos, a long-tailed parka with a fur hem and a needle case; the younger is
// tall and slight, dark-haired, chin tattoos, a short fringed parka, a mitten of the elder's tucked into her belt (they
// traded at the start). Matching only in kind: hide parkas with deep hoods thrown back, beaded yokes in white and black,
// long braids with bone ornaments, ivory earrings, frost on the lashes; rime on the windward faces, icicles from sleeves
// and hair. Neither casts a shadow.
// Rig: two humanoids, prefixed a_ (the elder) and b_ (the younger), each rooted at her pelvis; void (root).
// The forearm clasp is two open hands curled round the other's forearm (not a fist on a haft); in the game each hand
// follows the other's forearm with IK.
function singer(f, X, o, pf) {
  const sd = f.o.seed, H = o.H, furTex = X.hairTex(90);
  const P = o.P, N = o.N, C = o.C, S = B.spine(N, C, P, H), up = E.norm(sub(N, C));
  const hA = o.hA, HC = add(N, add(mul(up, H * 0.56), o.hOff)), hF = frame(HC, hA, H);
  const SN = S.at(-0.3, 0.14), SF = S.at(0.42, 0.1), { EN, WN, EF, WF, KN, AN, KF, AF } = o;
  const HN = S.at(-0.2, 1.0), HF = S.at(0.3, 0.98);
  const J = n => pf + n;
  f.joint(J('pelvis'), P).joint(J('torso'), S.at(0, 0.8), J('pelvis')).joint(J('head'), S.at(0.05, -0.02), J('torso'));
  f.joint(J('upperarm_n'), SN, J('torso')).joint(J('forearm_n'), EN, J('upperarm_n')).joint(J('hand_n'), WN, J('forearm_n'));
  f.joint(J('upperarm_f'), SF, J('torso')).joint(J('forearm_f'), EF, J('upperarm_f')).joint(J('hand_f'), WF, J('forearm_f'));
  f.joint(J('thigh_n'), HN, J('pelvis')).joint(J('shin_n'), KN, J('thigh_n')).joint(J('foot_n'), AN, J('shin_n'));
  f.joint(J('thigh_f'), HF, J('pelvis')).joint(J('shin_f'), KF, J('thigh_f')).joint(J('foot_f'), AF, J('shin_f'));
  f.joint(J('braid'), hF([[-0.3, 0.0]])[0], J('head')).joint(J('tail'), S.at(-0.6, 0.9), J('pelvis'));
  const tone = o.tone, PK = (x = {}) => HIDE(Object.assign({ fill: mix(PAL.hide, PAL.hideS, tone), tex: 'mottle' + sd, texOp: 0.4 }, x));
  const parts = {};
  // far arm, far leg, behind
  parts.farArm = () => {
    limb3(f, SF, EF, lerp(EF, WF, 0.86), [o.arm * 0.9, o.arm * 0.78, o.arm * 0.68], PK({ fill: mix(PAL.hide, PAL.hideS, tone + 0.28), maxShade: 14 }), [J('upperarm_f'), J('forearm_f')], { point: 0.3, mus0: 0.18, mus1: 0.22, creaseCol: PAL.hideD });
    f.bone(J('forearm_f')); cuff(f, X, EF, lerp(EF, WF, 0.8), o.arm * 0.7, tone + 0.3, furTex);
    f.bone(J('hand_f'));
    openHand(f, WF, ang(EF, WF) + 0.1, o.arm * 0.95, SKIN(sd, { fill: mix(PAL.skin, PAL.skinS, 0.25) }), { back: true, curl: 0.75, spread: 0.06, flip: false });
  };
  const leg = (Hp, Kn, A, sfx, t2) => {
    limb3(f, Hp, Kn, A, [o.thigh, o.thigh * 0.74, o.thigh * 0.55], FUR({ fill: mix(PAL.fur, PAL.furS, t2), tex: furTex, texOp: 0.24 }), [J('thigh' + sfx), J('shin' + sfx)], { point: 0.22, mus0: 0.16, mus1: 0.26, ca: 1.57 });
    split(f, () => furBoot(f, X, Kn, A, o.foot, t2, furTex, { tufts: false, beads: o.bootBeads }), [[J('shin' + sfx), side(A, [0.3, -1], 16)], [J('foot' + sfx), side(A, [-0.3, 1], 16)]]);
  };
  parts.farLeg = () => leg(HF, KF, AF, '_f', 0.25);
  parts.nearLeg = () => leg(HN, KN, AN, '_n', 0.04);
  parts.body = () => {
    // the parka's tail at the back (long on the elder, short on the younger) and front flap; fur or fringe at the hem
    f.bone(J('tail'));
    const tl = [S.at(-0.9, 0.8), S.at(-0.2, 0.86), add(S.at(-0.3, 1.0), [0, o.tailLen * 0.7]), add(S.at(-0.8, 1.0), [-10, o.tailLen]), add(S.at(-1.2, 1.0), [-24, o.tailLen * 0.8]), S.at(-1.15, 0.86)];
    f.part(tl, PK());
    clipDraw(f, tl, () => { folds(f, [[S.at(-0.6, 0.9), add(S.at(-0.7, 1.0), [0, o.tailLen * 0.6])], [S.at(-1.0, 0.9), add(S.at(-1.1, 1.0), [-8, o.tailLen * 0.6])]], 4); softTone(f, E.smooth(tl), [[[S.at(-1.4, 0.8), S.at(-0.8, 0.8), add(S.at(-0.8, 1.0), [0, o.tailLen]), add(S.at(-1.4, 1.0), [0, o.tailLen])], PAL.hideS, 0.45, 12]]); });
    const tEdge = [add(S.at(-0.3, 1.0), [0, o.tailLen * 0.7]), add(S.at(-0.8, 1.0), [-10, o.tailLen]), add(S.at(-1.2, 1.0), [-24, o.tailLen * 0.8])];
    if (o.furHem) forkHanks(f, X, tEdge, 5, 14, 34, 12, 18, { ice: 0.4, tone: 0.05 }); else X.fringe(tEdge, 7, 14, 36, { ice: 0.4, fill: mix(PAL.hide, PAL.hideS, tone), tex: 'mottle' + sd });
    f.bone(J('pelvis'));
    const fr = [S.at(-0.5, 0.78), S.at(0.95, 0.76), S.at(1.02, 0.95), add(S.at(0.6, 1.0), [0, o.frontLen]), add(S.at(-0.1, 1.0), [0, o.frontLen * 0.9]), S.at(-0.4, 0.98)];
    f.part(fr, PK());
    clipDraw(f, fr, () => folds(f, [[S.at(0.3, 0.86), add(S.at(0.3, 1.0), [0, o.frontLen * 0.8])], [S.at(0.8, 0.86), add(S.at(0.85, 1.0), [0, o.frontLen * 0.7])]], 3.4));
    const fEdge = [S.at(-0.4, 0.98), add(S.at(-0.1, 1.0), [0, o.frontLen * 0.9]), add(S.at(0.6, 1.0), [0, o.frontLen]), S.at(1.02, 0.95)];
    if (o.furHem) forkHanks(f, X, fEdge, 4, 10, 26, 10, 16, { ice: 0.4, tone: 0.05 }); else X.fringe(fEdge, 6, 10, 28, { ice: 0.4, fill: mix(PAL.hide, PAL.hideS, tone), tex: 'mottle' + sd });
    // torso
    f.bone(J('torso'));
    const tor = S.shape(o.torso);
    f.part(tor, PK());
    clipDraw(f, tor, () => {
      softTone(f, E.smooth(tor), [[[S.at(-1.2, 0.1), S.at(-0.4, 0.1), S.at(-0.4, 0.95), S.at(-1.2, 0.95)], PAL.hideS, 0.5, 14]]);
      folds(f, [[S.at(-0.4, 0.3), S.at(-0.2, 0.6), S.at(-0.3, 0.85)], [S.at(0.3, 0.5), S.at(0.6, 0.62)]], 4);
      // the beaded yoke over the shoulders and breast: bands of white and black beads, a different pattern on each
      beadBand(f, [S.at(-0.7, 0.08), S.at(0.0, 0.18), S.at(0.6, 0.2), S.at(0.95, 0.1)], 10, { pattern: o.beadA });
      beadBand(f, [S.at(-0.65, 0.18), S.at(0.0, 0.3), S.at(0.6, 0.32), S.at(0.95, 0.24)], 8, { pattern: o.beadB });
      for (let i = 0; i < 7; i++) { const q = S.at(-0.2 + i * 0.17, 0.36); f.line([q, add(q, [0, 14 + (i % 2) * 6])], 2.4, '#1a1a1c'); f.flat(ell(add(q, [0, 16 + (i % 2) * 6]), 2.4, 2.4, 0, 6), i % 2 ? '#f2f2f0' : '#0e0e10'); } // bead tassels
    });
    X.rime([S.at(0.3, 0.02), S.at(0.8, 0.12), S.at(1.0, 0.4)], 8, -1);
    // the deep hood thrown back on the shoulders
    f.part([S.at(-0.4, -0.04), S.at(-0.2, -0.12), S.at(-0.6, -0.18), S.at(-0.98, -0.04), S.at(-1.04, 0.16), S.at(-0.82, 0.26), S.at(-0.6, 0.16)], PK({ fill: mix(PAL.hide, PAL.hideS, tone + 0.1) }));
    f.part([S.at(-0.32, -0.08), S.at(-0.6, -0.13), S.at(-0.9, -0.02), S.at(-0.88, 0.08), S.at(-0.6, 0.0)], { fill: PAL.furS, shadow: PAL.furD, shade: 0.3, inkW: 1.1, cast: false, tex: furTex, texOp: 0.4 });
    forkHanks(f, X, [S.at(-1.0, -0.02), S.at(-1.04, 0.16), S.at(-0.82, 0.26)], 3, 12, 26, 9, 13, { ice: 0.3 }); // its fur rim
    // belt and what hangs on it
    f.bone(J('pelvis'));
    const bw = o.torso.find(r => r[0] >= 0.8), bl = [S.at(-bw[1] * 0.96, 0.78), S.at(0.0, 0.8), S.at(bw[2] * 0.96, 0.77), S.at(bw[2] * 0.96, 0.82), S.at(0.0, 0.85), S.at(-bw[1] * 0.96, 0.83)];
    f.part(bl, { fill: '#5a5c60', shadow: '#141418', shade: 0.35, tex: 'hatch' + sd, texOp: 0.5, k: 0.6, inkW: 1.2 });
    for (let i = 0; i < 12; i++) f.line([S.at(-bw[1] * 0.9 + i * 0.16, 0.785), S.at(-bw[1] * 0.86 + i * 0.16, 0.83)], 1, '#a8aaac', { op: 0.6, straight: true }); // the braided sinew
    if (o.needleCase) { const q = S.at(0.5, 0.84); cord(f, [q, add(q, [2, 18])], 1.2); f.part([add(q, [-6, 16]), add(q, [6, 16]), add(q, [7, 62]), add(q, [0, 68]), add(q, [-7, 62])], BONE({ tex: 'mottle' + sd, texOp: 0.4 })); for (let i = 0; i < 3; i++) f.line([add(q, [-6, 26 + i * 12]), add(q, [6, 26 + i * 12])], 1.2, PAL.boneD); f.flat(ell(add(q, [0, 70]), 3, 3, 0, 6), PAL.greyD); }
    if (o.mittenTucked) { const q = S.at(0.3, 0.8); f.part([add(q, [-14, -6]), add(q, [14, -8]), add(q, [18, 30]), add(q, [8, 50]), add(q, [-12, 46]), add(q, [-16, 20])], HIDE({ fill: mix(PAL.hide, PAL.hideS, 0.45), inkW: 1.2, cast: false })); f.part([add(q, [-12, 46]), add(q, [-26, 40]), add(q, [-24, 24]), add(q, [-14, 26])], HIDE({ fill: mix(PAL.hide, PAL.hideS, 0.5), inkW: 1, cast: false })); X.furField([add(q, [-14, -6]), add(q, [14, -8]), add(q, [14, 6]), add(q, [-14, 6])], 4, 8, { w: 2 }); } // the elder's mitten, darker, tucked in her belt
  };
  parts.head = () => {
    f.bone(J('head'));
    f.part(limb(S.at(0.12, -0.02), hF([[-0.05, 0.36]])[0], H * 0.5, H * 0.44), SKIN(sd));
    face(f, X, HC, H, hA, Object.assign({ squint: 0.3, browDown: -0.02, faceShade: 0.78, lashes: true, hairCol: o.hair, browCol: mix(o.hair, '#ffffff', 0.4), mouthOpen: { x: 0.25, y: 0.33, w: 0.085, h: 0.08 } }, o.face));
    // hair over the skull from the hairline back: centre-parted, drawn tight to the head, clumped strands running back
    const hr = hF([[0.22, -0.4], [0.12, -0.5], [-0.08, -0.57], [-0.3, -0.52], [-0.45, -0.32], [-0.48, -0.04], [-0.4, 0.16], [-0.3, 0.14], [-0.26, -0.04], [-0.16, -0.24], [0.02, -0.36], [0.16, -0.36]]);
    hairMass(f, X, hr, null, { fill: o.hair, ang: 170, n: 16, len: 22, dir: () => rot([-1, 0.25], hA) });
    clipDraw(f, hr, () => { for (let i = 0; i < 5; i++) { const t = i / 5; f.stroke(hF([[0.18 - t * 0.1, -0.42 - t * 0.02], [-0.1 - t * 0.04, -0.5 + t * 0.1], [-0.36 + t * 0.06, -0.3 + t * 0.2]]), 3.4, mix(o.hair, '#000', 0.4), { op: 0.45 }); } }); // the combed-back clumps
    // the ivory earring, frost on the lashes
    const er = hF([[-0.2, 0.2]])[0]; cord(f, [add(er, [0, -6]), er], 1); f.part([add(er, [-5, 0]), add(er, [5, 0]), add(er, [3, 18]), add(er, [0, 24]), add(er, [-3, 18])], BONE({ inkW: 1 }));
    f.line(hF([[0.06, -0.078], [0.11, -0.09], [0.17, -0.082]]), 1.6, '#ffffff', { op: 0.9 });
    X.rime(hF([[0.06, -0.52], [0.24, -0.44], [0.36, -0.3]]), 5, 1);
  };
  parts.braid = () => {
    f.bone(J('braid'));
    const b0 = hF([[-0.24, 0.1]])[0];
    braid(f, X, [b0, add(b0, [4, 60]), add(b0, [0, 140]), add(b0, [-4, o.braidLen])], o.braidW, { ties: o.braidTies, fill: o.hair });
  };
  parts.nearArm = () => {
    limb3(f, SN, EN, lerp(EN, WN, 0.86), [o.arm, o.arm * 0.86, o.arm * 0.74], PK({ maxShade: 16 }), [J('upperarm_n'), J('forearm_n')], { point: 0.32, mus0: 0.18, mus1: 0.22, creaseCol: PAL.hideD });
    f.bone(J('torso')); X.rime([add(SN, [-18, -12]), add(SN, [10, -24]), add(SN, [34, -18])], 7, -1);
    f.bone(J('forearm_n')); cuff(f, X, EN, lerp(EN, WN, 0.8), o.arm * 0.78, tone + 0.05, furTex);
    X.icicles([lp(EN, WN, 0.2, o.arm * 0.4), lp(EN, WN, 0.7, o.arm * 0.4)], 3, 22, 5); // icicles from the sleeve
  };
  parts.nearHand = () => {
    f.bone(J('hand_n'));
    const h = openHand(f, WN, ang(EN, WN) + 0.05, o.arm * 1.0, SKIN(sd), { back: true, curl: 0.8, spread: 0.05 });
    X.bite(WN, 8, 6, 3, 0.3);
    return h;
  };
  return { parts, S, HC, hF };
}
function silentSingers() {
  const CW = 720, CH = TIERS.human[1], GY = CH - 30, sd = 1229, cx = CW / 2;
  const f = new Fig(base(sd, CH, { grimeY: GY - 160 }));
  const X = fx(f);
  const M = p => [2 * cx - p[0], p[1]]; // the younger is authored facing right in her own mirrored frame
  // the elder: short and heavy, grey; the forearms clasp in the middle
  const A = {
    H: 90, P: [214, 520], C: [250, 430], N: [296, 350], hA: -0.3, hOff: [16, 0], tone: 0.06,
    EN: [282, 470], WN: [384, 438], EF: [318, 452], WF: [392, 424],
    KN: [188, 650], AN: [150, 748], KF: [284, 652], AF: [300, 754],
    arm: 70, thigh: 104, foot: 52, tailLen: 120, frontLen: 40, furHem: true, bootBeads: true, needleCase: true,
    torso: [[-0.12, 0.5, 0.52], [0.06, 1.02, 0.82], [0.3, 1.04, 0.96], [0.5, 0.92, 1.02], [0.7, 0.9, 1.12], [0.86, 1.02, 1.1], [1.0, 1.1, 0.98]], // round-shouldered, the belly heavy and low
    hair: '#c8cacc', braidLen: 230, braidW: 22, braidTies: [0.25, 0.6],
    beadA: i => i % 4 !== 1, beadB: i => i % 2 === 0,
    face: { jaw: 1.2, chin: 0.0, nose: 1.0, wrinkles: 0.85, age: true, tattoo: [[[0.02, 0.06], [0.1, 0.12], [0.16, 0.2]], [[0.0, 0.12], [0.07, 0.18], [0.12, 0.26]], [[0.04, 0.02], [0.14, 0.04]]] },
  };
  // the younger: tall and slight, dark-haired; her coordinates in her own frame (mirrored about the centre)
  const Bq = {
    H: 98, P: M([522, 460]), C: M([500, 368]), N: M([446, 300]), hA: 0.34, hOff: [8, 4], tone: 0.0,
    EN: M([456, 400]), WN: M([350, 450]), EF: M([426, 386]), WF: M([344, 432]),
    KN: M([556, 606]), AN: M([602, 746]), KF: M([470, 614]), AF: M([450, 752]),
    arm: 56, thigh: 80, foot: 50, tailLen: 40, frontLen: 30, furHem: false, bootBeads: false, mittenTucked: true,
    torso: [[-0.12, 0.38, 0.42], [0.06, 0.78, 0.66], [0.28, 0.8, 0.82], [0.5, 0.62, 0.66], [0.66, 0.56, 0.6], [0.84, 0.72, 0.7], [1.0, 0.86, 0.8]], // slight: the waist taken in
    hair: '#3a3c40', braidLen: 300, braidW: 18, braidTies: [0.2, 0.45, 0.75],
    beadA: i => i % 3 === 0, beadB: i => i % 3 !== 2,
    face: { jaw: 0.94, chin: -0.04, nose: 0.92, wrinkles: 0, age: false, tattoo: [[[0.18, 0.36], [0.18, 0.5]], [[0.22, 0.36], [0.23, 0.52]], [[0.27, 0.36], [0.28, 0.5]], [[0.12, 0.38], [0.1, 0.48]]] },
  };
  f.bone('root');
  snowGround(f, 40, CW - 40, GY, { depth: 30 });
  const a = singer.bind(null, f, X, A, 'a_'), b = () => singer(f, X, Bq, 'b_');
  // build both figures' part lists (no drawing yet), then draw in depth order
  let SA, SB;
  const drawA = k => SA.parts[k](), drawB = k => mirrorDraw(f, cx, () => SB.parts[k]());
  SA = a(); mirrorDraw(f, cx, () => { SB = b(); });
  drawA('farArm'); drawB('farArm');
  drawA('farLeg'); drawB('farLeg');
  drawA('nearLeg'); drawB('nearLeg');
  drawA('body'); drawB('body');
  drawA('head'); drawB('head');
  drawA('braid'); drawB('braid');
  // the void between their open mouths: a small clean hole in the air where the sound was
  f.bone('root');
  const mA = SA.hF([[0.25, 0.33]])[0], mB = M(SB.hF([[0.25, 0.33]])[0]), vc = add(lerp(mA, mB, 0.5), [0, 2]);
  f.joint('void', vc);
  f.bone('void');
  const ve = ell(vc, 11, 11, 0, 24); f.flat(ve, PAL.void); f.line(ve.concat([ve[0]]), 1.6, INK); f.line(ell(vc, 13.5, 13.5, 0, 24).slice(14, 23), 1.2, '#ffffff', { op: 0.9 });
  // the forearms clasped: the younger's near arm under, the elder's over it; each hand curled round the other's forearm
  drawB('nearArm'); drawA('nearArm'); drawB('nearHand'); drawA('nearHand');
  f.bone('a_foot_n'); snowLip(f, [A.AN[0] + 20, GY + 3], 80, 8);
  f.bone('a_foot_f'); snowLip(f, [A.AF[0] + 20, GY + 3], 70, 5);
  f.bone('b_foot_n'); snowLip(f, M([Bq.AN[0] + 20, GY + 3]), 76, 8);
  f.bone('b_foot_f'); snowLip(f, M([Bq.AF[0] + 20, GY + 3]), 66, 5);
  return f;
}

// ------------------------------------------------------------------ HUSH-CHILD (Small 0.5 including the board)
// An infant of the winter camp, laced into its cradleboard when the star rose. The board stands upright on its own in
// the snow, its splayed foot frozen in, leaning back a little; the child swaddled in hide, laced with sinew thongs that
// cross over the body, only the face and one fist free. The face is crying, the brow puckered, the eyes squeezed shut,
// and the open mouth is a black void that takes the cry. Tears frozen into two icicles down the cheeks; rime on the
// windward cheek; the skin bluish-white. A bent-wood hoop arches over the head, hung with charms: bone beads, a carved
// ivory seal, a dried hare's foot, a tiny drum. The fur lining round the face frozen into spikes. The carrying strap
// trails in the snow. No shadow.
// Rig: board (root, pivot at the foot) > head (the face, swaddle top), fist, hoop > charms; strap (board).
function hushChild() {
  const CW = 600, CH = TIERS.small[1], GY = CH - 30, sd = 1225;
  const f = new Fig(base(sd, CH, { grimeY: GY - 80 }));
  const X = fx(f, 0.8);
  const tilt = deg(-5), FT = [300, GY - 4], BF = frame(FT, tilt, 1); // board frame: x across the board, y up is negative
  const T = (x, y) => BF([[x, y]])[0];
  const FC = T(4, -238); // the face's centre
  f.joint('board', FT).joint('head', T(0, -200), 'board').joint('fist', T(-40, -206), 'board').joint('hoop', T(0, -270), 'board').joint('charms', T(0, -318), 'hoop').joint('strap', T(-60, -120), 'board');
  const WOOD = (o = {}) => Object.assign({ fill: '#9a9a96', shadow: PAL.woodD, light: '#c8c8c2', shade: 0.36, tex: 'wood' + sd, texOp: 0.5, inkW: 1.6, inkHeavy: 2.4 }, o);

  f.bone('root');
  snowGround(f, 120, 480, GY, { depth: 26 });
  // ---- the carrying strap trailing back from the board into the snow
  f.bone('strap');
  rope(f, [T(-58, -150), T(-90, -110), T(-120, -40), [168, GY - 2], [130, GY + 6]], 5, PAL.hide);
  f.part([[126, GY], [100, GY - 4], [96, GY + 6], [124, GY + 10]], HIDE({ inkW: 1.1, cast: false, grime: false }));
  X.icicles([T(-90, -110), T(-118, -50)], 2, 14, 4);
  // ---- the board: a long slab of bent wood, its back edge showing (thickness on the far side), the foot splayed
  f.bone('board');
  const edge = [T(52, -296), T(64, -290), T(68, -40), T(86, -8), T(84, 0), T(56, 0)]; // the windward edge's thickness
  f.part(edge, WOOD({ fill: '#b4b4ae' }));
  const brd = [T(-58, -270), T(-40, -298), T(0, -306), T(40, -300), T(56, -280), T(58, -40), T(76, -6), T(72, 4, 1), T(-78, 4, 1), T(-80, -6), T(-60, -40)];
  f.part(brd, WOOD({ maxShade: 14 }));
  clipDraw(f, brd, () => {
    for (let i = 0; i < 6; i++) f.line([T(-50 + i * 20, -290), T(-48 + i * 20 + (i % 2) * 4, -120), T(-52 + i * 20, -10)], 1, PAL.woodD, { op: 0.5 }); // grain
    f.line([T(-80, -24), T(76, -24)], 2, PAL.woodD, { op: 0.6 }); // the foot's lashing groove
    for (let i = 0; i < 5; i++) f.line([T(-70 + i * 34, -30), T(-66 + i * 34, -18)], 1.4, PAL.greyD);
  });
  X.rime([T(40, -300), T(60, -282), T(66, -200), T(66, -100)], 6, -1);
  // ---- the swaddle: a hide wrap on the board, bulging round the body, laced with crossing sinew thongs
  const sw = [T(-46, -222), T(-30, -186), T(-50, -150), T(-54, -90), T(-44, -46), T(0, -36), T(44, -48), T(52, -96), T(50, -160), T(40, -190), T(46, -222), T(0, -196)];
  f.part(sw, HIDE({ fill: '#deded8', tex: 'mottle' + sd, texOp: 0.45, maxShade: 18 }));
  clipDraw(f, sw, () => {
    softTone(f, E.smooth(sw), [[[T(-60, -200), T(-20, -200), T(-20, -30), T(-60, -30)], PAL.hideS, 0.5, 10]]);
    folds(f, [[T(-30, -170), T(-10, -120), T(-20, -70)], [T(30, -160), T(20, -110)]], 3);
    // the crossing thongs, laced from loops on the board's edges
    for (let i = 0; i < 5; i++) { const y0 = -190 + i * 30; cord(f, [T(-56, y0), T(0, y0 + 16), T(56, y0 + 30)], 1.6); cord(f, [T(56, y0), T(0, y0 + 16), T(-56, y0 + 30)], 1.6); }
  });
  for (let i = 0; i < 6; i++) { f.part(ell(T(-58, -194 + i * 30), 4, 4, 0, 8), BONE({ inkW: 0.9 })); f.part(ell(T(58, -194 + i * 30), 4, 4, 0, 8), BONE({ inkW: 0.9 })); } // the lacing loops
  X.icicles([T(-44, -46), T(0, -36), T(44, -48)], 3, 14, 4);
  // ---- the fur lining round the face, frozen into spikes
  f.bone('head');
  const lin = []; for (let i = 0; i < 30; i++) { const t = i / 30 * Math.PI * 2, r = 1 + 0.08 * Math.sin(t * 7) + (f.r() - 0.5) * 0.1; lin.push(add(FC, rot([Math.cos(t) * 58 * r, Math.sin(t) * 62 * r], tilt))); }
  f.part(lin, FUR({ fill: '#ececea', tex: X.hairTex(90), texOp: 0.3 }));
  X.furField(lin, 30, 12, { dir: p => sub(p, FC), w: 2.4 });
  for (let i = 0; i < 9; i++) { const t = (i + 0.3 + f.r() * 0.4) / 9 * Math.PI * 2, b0 = add(FC, [Math.cos(t) * 54, Math.sin(t) * 58]), d = add(E.norm(sub(b0, FC)), [0, 0.3]); X.lock(b0, 9 + f.r() * 10, 8 + f.r() * 3, { dir: d, cast: false, fill: '#f4f4f2' }); }
  X.rime([add(FC, [10, -60]), add(FC, [44, -40]), add(FC, [60, -6])], 5, -1);
  // ---- the face: small and creased, bluish-white, turned a little toward the heroes; fat cheeks, a small chin, the
  // brow puckered, the eyes squeezed shut, the mouth stretched wide open on the cry, and inside it nothing
  const F = frame(FC, tilt, 1), sk = mix(PAL.skin, '#c8d0dc', 0.0);
  const fc = F([[-30, -30], [-10, -42], [14, -40], [32, -26], [40, -8], [39, 12], [32, 28], [16, 40], [-2, 44], [-18, 38], [-30, 24], [-37, 6], [-37, -14]]); // a high bulging brow, fat cheeks, a small chin
  f.part(fc, { fill: '#d6dade', shadow: '#6c7280', light: '#f4f6f8', shade: 0.4, maxShade: 12, tex: 'mottle' + sd, texOp: 0.4, inkW: 1.5 });
  clipDraw(f, fc, () => {
    softTone(f, E.smooth(fc), [[F([[-40, -10], [-16, -10], [-16, 40], [-40, 40]]), '#6c7280', 0.4, 6], [F([[4, 6], [28, 4], [30, 22], [8, 24]]), '#ffffff', 0.4, 5], [F([[-24, 4], [-8, 6], [-10, 22], [-26, 20]]), '#ffffff', 0.3, 5]]);
  });
  // the brow puckered into ridges over the nose; the lids squeezed shut, creased at the corners
  crease(f, F([[-14, -22], [-4, -18], [6, -22]]), 1.8, { col: '#5a5e6a', op: 0.7 }); crease(f, F([[-10, -28], [-2, -25], [8, -28]]), 1.4, { col: '#5a5e6a', op: 0.6 });
  crease(f, F([[-2, -16], [-1, -8]]), 1.4, { col: '#5a5e6a', op: 0.6 });
  for (const [cx0, w0] of [[-16, 11], [16, 12]]) { f.line(F([[cx0 - w0, -9], [cx0, -12], [cx0 + w0, -9]]), 2, INK); for (let i = 0; i < 3; i++) f.line(F([[cx0 + (cx0 < 0 ? -w0 : w0), -9 + i * 3], [cx0 + (cx0 < 0 ? -w0 - 6 : w0 + 6), -12 + i * 5]]), 0.9, INK, { op: 0.55 }); }
  f.part(F([[-3, -6], [4, -6], [7, 3], [3, 6], [-4, 5], [-7, 2]]), { fill: '#ccd0d6', shadow: '#6c7280', shade: 0.4, inkW: 1, cast: false, hatch: false }); // the button nose
  // the mouth: wide open, square-cornered with the cry; the lips stretched thin round it; inside, the void
  const mo = F([[-15, 10], [-4, 7], [8, 8], [17, 12], [18, 24], [10, 33], [-4, 34], [-14, 26]]);
  f.part(F([[-19, 7], [0, 3], [21, 9], [22, 26], [12, 37], [-6, 38], [-18, 29]]), { fill: '#c4c8d0', shadow: '#6c7280', shade: 0.4, inkW: 1.1, cast: false, hatch: false });
  X.voidPatch(mo, { w: 1.6, rim: false });
  f.line(F([[-12, 11], [2, 8], [15, 13]]), 1, '#ffffff', { op: 0.85 }); // the clean rim where the cry is taken
  crease(f, F([[-24, 4], [-22, 16], [-18, 26]]), 1.4, { col: '#5a5e6a', op: 0.6 }); crease(f, F([[22, 4], [24, 16], [22, 26]]), 1.2, { col: '#5a5e6a', op: 0.5 }); // the cheeks pushed up
  // tears frozen into two icicles down the cheeks; rime on the windward cheek
  // (each tear ran from the outer corner of the eye down the cheek and froze there: a glassy streak lying on the skin,
  // thickening as it went, with a bead at the jaw)
  for (const pts of [F([[-27, -8], [-31, 4], [-31, 18], [-27, 30]]), F([[28, -8], [33, 4], [34, 18], [31, 30]])]) {
    const C2 = spline(pts, 3), W2 = C2.map((_, i) => 2 + 4 * i / (C2.length - 1));
    f.part(ribbon(C2, W2), X.IC({ fill: '#eef2f4', inkW: 1, inkHeavy: 1.3 }));
    f.line(C2.map(q => add(q, [0.8, -0.5])), 0.9, '#ffffff', { op: 0.9 });
    X.icicle(add(C2[C2.length - 1], [0, 2]), 9, 5);
  }
  X.rime(F([[30, -14], [38, 2], [36, 18]]), 3.5, -1); X.frost(F([[28, 6]])[0], 6, 8, 4, 0.9);
  // the swaddle's edge pulled up under the chin
  f.part([add(FC, rot([-40, 34], tilt)), add(FC, rot([-10, 46], tilt)), add(FC, rot([24, 44], tilt)), add(FC, rot([42, 30], tilt)), add(FC, rot([40, 48], tilt)), add(FC, rot([0, 60], tilt)), add(FC, rot([-42, 50], tilt))], HIDE({ fill: '#d8d8d2', inkW: 1.2, cast: false }));
  // ---- the free fist, beside the face: tiny, clenched, creased at the wrist, the knuckles dimpled
  f.bone('fist');
  const fp = T(-52, -212);
  f.part([add(fp, [-6, 34]), add(fp, [6, 30]), add(fp, [10, 10]), add(fp, [-4, 8])], { fill: '#d0d4da', shadow: '#6c7280', shade: 0.4, inkW: 1.1, cast: false, tex: 'mottle' + sd, texOp: 0.4 }); // the wrist out of the swaddle
  const fs = [add(fp, [-14, -4]), add(fp, [-6, -16]), add(fp, [8, -16]), add(fp, [16, -6]), add(fp, [16, 8]), add(fp, [6, 16]), add(fp, [-10, 14]), add(fp, [-16, 6])];
  f.part(fs, { fill: '#d6dade', shadow: '#6c7280', light: '#f4f6f8', shade: 0.4, inkW: 1.3, tex: 'mottle' + sd, texOp: 0.4 });
  for (let i = 0; i < 3; i++) f.line([add(fp, [-8 + i * 7, -14]), add(fp, [-7 + i * 7, -6])], 1, INK, { op: 0.6 }); // the curled fingers
  f.part([add(fp, [-16, 0]), add(fp, [-22, -8]), add(fp, [-14, -12]), add(fp, [-8, -6])], { fill: '#d0d4da', shadow: '#6c7280', shade: 0.4, inkW: 1, cast: false }); // the thumb over them
  for (let i = 0; i < 3; i++) f.flat(ell(add(fp, [-6 + i * 7, -10]), 1.4, 1.2, 0, 6), '#6c7280', { op: 0.6 }); // dimples
  f.line([add(fp, [-6, 22]), add(fp, [8, 20])], 1, INK, { op: 0.6 }); // the wrist crease
  X.rime([add(fp, [-6, -16]), add(fp, [8, -16]), add(fp, [16, -6])], 3, -1);
  // ---- the hoop over the head, and its charms
  f.bone('hoop');
  const hp = [T(-62, -250), T(-60, -300), T(-30, -336), T(10, -344), T(48, -326), T(66, -290), T(66, -246)];
  f.line(spline(hp, 4), 13, INK); f.line(spline(hp, 4), 9.5, '#a4a49e'); f.line(spline(hp, 4).slice(4, -6).map(q => add(q, [1.5, -2.5])), 1.4, '#e8e8e4', { op: 0.8 });
  for (const q of [hp[0], hp[6]]) for (let i = 0; i < 4; i++) f.line([add(q, [-7, -4 + i * 4]), add(q, [7, -2 + i * 4])], 2, PAL.greyD); // lashed to the board
  X.rime(spline(hp, 4).slice(6, -4).map(q => add(q, [0, -5])), 4, -1);
  f.bone('charms');
  const hang = (t, len) => { const C2 = spline(hp, 4), q = C2[Math.round(t * (C2.length - 1))]; cord(f, [add(q, [0, 4]), add(q, [0, 4 + len])], 1.1); return add(q, [0, 4 + len]); };
  // bone beads
  { const e = hang(0.2, 10); beadString(f, [e, add(e, [0, 18]), add(e, [1, 34])], 3.2, 5); }
  // the carved ivory seal
  { const e = hang(0.36, 14), F2 = frame(add(e, [0, 10]), deg(90), 1); f.part(F2([[-10, -5], [-2, -8], [10, -6], [20, -2], [26, -6], [28, 2], [20, 4], [6, 8], [-8, 6]]), BONE({ tex: 'mottle' + sd, texOp: 0.4 })); f.flat(F2(ell([-6, -2], 1.4, 1.4, 0, 6)), INK); f.line(F2([[2, 6], [8, 12]]), 1.2, PAL.boneD); }
  // the dried hare's foot
  { const e = hang(0.56, 12); f.part([add(e, [-4, 0]), add(e, [5, 0]), add(e, [7, 18]), add(e, [4, 34]), add(e, [-2, 36]), add(e, [-6, 20])], FUR({ fill: '#e8e8e6', inkW: 1.1, cast: false })); f.line([add(e, [-1, 34]), add(e, [-1, 40])], 1.4, '#3a3c40'); f.line([add(e, [2, 34]), add(e, [3, 40])], 1.4, '#3a3c40'); }
  // the tiny drum: a hoop of wood with a skin, painted with a black sun
  { const e = hang(0.76, 10), c = add(e, [0, 14]); f.part(ell(c, 12, 13, 0.2, 16), WOOD({ inkW: 1.2, cast: false })); f.part(ell(c, 9.5, 10.5, 0.2, 16), HIDE({ fill: '#eeeee8', inkW: 1, cast: false, shade: 0.2 })); f.flat(ell(c, 3.6, 3.6, 0, 10), '#141416'); for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; f.line([add(c, [Math.cos(a) * 5, Math.sin(a) * 5]), add(c, [Math.cos(a) * 8, Math.sin(a) * 8])], 1, '#141416'); } }
  X.icicles([T(-40, -336), T(40, -332)], 2, 10, 3);
  // ---- the foot frozen in: snow drifted against it on both sides
  f.bone('board'); snowLip(f, [FT[0] - 4, GY + 3], 190, 14);
  return f;
}

// ------------------------------------------------------------------ LEAD DOG (Large, 1.2 long)
// The lead dog of a herder's sledge team, still leading it: low and leaning into its harness, the shoulders down, the
// near forepaw reaching, the hind legs driving, the line taut behind it. The line runs back a pace and ends in a clean cut,
// still pulled tight as if the team were on it. One ear gone, the rim clean. No shadow.
// (Independent review rebuild, after the Plague Wolf's habits: the first dog read as a cartoon, a big round eye, a grin
// and plain tube legs.) A thick-furred sledge dog: the deep chest down to the elbow, the waist tucked up behind it; each
// leg three muscled segments overlapping at the joints: the upper arm with the triceps behind and the point of the
// elbow, the forearm lean to the wrist, the sloped pastern onto a thick paw; the heavy thigh merging into the croup, the
// gaskin with the calf high behind, the point of the hock, the hind pastern angled forward to the paw. A broad wedge
// head with a clear stop, the small dark almond eye under a brow ridge, small ears; the mouth open a little in a silent
// pant (the lips short and drooping at the corner, the grey tongue's tip between the teeth), frost on the whiskers. A
// thick ruff of frozen hanks round the neck and chest; a brush tail carried up and curled over the croup, its long hair
// hanging off it in frozen hanks. The coat clumped and frozen into points that hang down; rime on the windward side;
// ice balled between the toes. Hide harness with bone toggles, the breast strap worn bright; a bone bead on the collar;
// hide booties on two feet only (the near fore and the far hind); an old bite scar across the shoulder; a frozen chewing
// rag caught in the harness.
// Rig: spine_1 (root, hindquarters) > spine_2 > neck > head > jaw, ear; tail; line (spine_1); legs leg_<fn|ff|hn|hf>_1..3.
function leadDog() {
  const CW = 1100, CH = TIERS.large[1], GY = CH - 30, sd = 1227;
  const f = new Fig(base(sd, CH, { grimeY: GY - 140 }));
  const X = fx(f, 1.2), furTex = X.hairTex(95);
  const COAT = (o = {}) => FUR(Object.assign({ tex: furTex, texOp: 0.2 }, o));
  // canine legs. Front: H the point of the shoulder, K the elbow (behind the brisket), A the wrist, T the paw.
  // Hind: H the hip, K the stifle (forward), A the point of the hock (back), T the paw.
  const LEG = {
    fn: { H: [804, 846], K: [790, 944], A: [884, 990], T: [948, 1022], lift: true }, // reaching forward, the paw about to strike
    ff: { H: [770, 846], K: [742, 940], A: [716, 1012], T: [732, GY] }, // planted, angled back under the pull
    hn: { H: [426, 790], K: [480, 902], A: [364, 980], T: [330, GY] }, // driving back
    hf: { H: [446, 786], K: [520, 896], A: [450, 978], T: [458, GY] },
  };
  const NK = [812, 790], HC = [930, 838], hA = deg(12), HS = 1.0, hF = frame(HC, hA, HS); // the head low and forward
  const LINE0 = [352, 712], LINEC = [96, 748]; // the line leaves the harness at the tail's root and runs back to its cut
  f.joint('spine_1', [430, 774]).joint('spine_2', [620, 780], 'spine_1').joint('neck', NK, 'spine_2').joint('head', hF([[-60, -6]])[0], 'neck').joint('jaw', hF([[-10, 26]])[0], 'head').joint('ear', hF([[-40, -46]])[0], 'head').joint('tail', [376, 716], 'spine_1').joint('line', LINE0, 'spine_1');
  for (const [k, L] of Object.entries(LEG)) f.joint(`leg_${k}_1`, L.H, k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`);
  const groove = (pts, wd = 2.6, op = 0.5) => f.stroke(pts, wd, PAL.furD, { op });

  f.bone('root');
  snowGround(f, 40, 1080, GY, { depth: 30 });

  // ---- the body outline (needed by the near thigh's clip): the croup, the back level to low withers, the deep chest to
  // the elbow, the waist tucked up behind it
  const body = [[352, 726], [400, 702], [470, 700], [540, 714], [620, 724], [700, 718], [770, 726], [830, 752], [862, 800], [858, 860], [830, 914], [780, 944], [720, 948], [664, 928], [612, 892], [566, 866], [520, 858], [480, 866], [440, 858], [394, 834], [358, 796], [342, 760]];
  // one leg: three bones, each a muscled segment overlapping the next; the paw carries the weight
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.34 : 0, look = COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 18 });
    const [dk, nk] = [E.norm(sub(L.A, L.K)), (d => [-d[1], d[0]])(E.norm(sub(L.A, L.K)))];
    if (part & 1) {
      f.bone(`leg_${k}_1`);
      if (front) f.part(limb(L.H, L.K, 96, 56, { steps: 12, capK: 0.9, p: [[0.55, 0.28, 0.2]], q: [[0.25, 0.12, 0.18]] }), look); // upper arm, the triceps behind
      else if (far) f.part(limb(L.H, L.K, 150, 66, { steps: 12, capK: 0.9, p: [[0.4, 0.3, 0.22]], q: [[0.45, 0.16, 0.2]] }), look);
      else { const top = add(L.H, mul(sub(L.H, L.K), 0.7)); clipDraw(f, E.smooth(body) + ' M0,860 L1100,860 L1100,1100 L0,1100 Z', () => f.part(limb(top, L.K, 150, 64, { steps: 14, capK: 0.9, capA: false, p: [[0.5, 0.34, 0.2]], q: [[0.62, 0.24, 0.16]] }), look)); } // the thigh: hamstrings behind, quadriceps in front; its top merges into the croup
      groove(front ? [lp(L.H, L.K, 0.2, 16), lp(L.H, L.K, 0.75, 11)] : [lp(L.H, L.K, 0.15, -24), lp(L.H, L.K, 0.6, 5), lp(L.H, L.K, 0.9, 12)]);
      if (!front) forkHanks(f, X, [lp(L.H, L.K, 0.35, 64), lp(L.H, L.K, 0.85, 44)], 3, 26, 46, 14, 20, { ice: 0.4, tone: tone + 0.1, fade: false }); // the breeches behind the thigh
      else forkHanks(f, X, [lp(L.H, L.K, 0.7, 30), lp(L.H, L.K, 0.98, 26)], 2, 22, 36, 12, 16, { ice: 0.4, tone: tone + 0.1, fade: false }); // feathering at the elbow
    }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      if (front) {
        f.part(limb(L.K, L.A, 56, 32, { steps: 12, capK: 0.9, q: [[0.22, 0.24, 0.18]] }), look); // forearm: the muscle below the elbow, lean to the wrist
        f.part([add(L.K, mul(nk, 12)), add(add(L.K, mul(nk, 34)), mul(dk, -8)), add(add(L.K, mul(nk, 34)), mul(dk, 16)), add(add(L.K, mul(nk, 14)), mul(dk, 30))], COAT({ fill: mix(PAL.fur, PAL.furS, tone + 0.18), inkW: 1.1, inkHeavy: 1.5, cast: false, maxShade: 4 })); // the point of the elbow
      } else {
        f.part(limb(L.K, L.A, 74, 30, { steps: 12, capK: 0.9, p: [[0.22, 0.32, 0.18]] }), look); // gaskin: the calf muscle high behind
        f.part([add(L.A, mul(nk, 4)), add(add(L.A, mul(nk, 26)), mul(dk, -10)), add(add(L.A, mul(nk, 24)), mul(dk, 10)), add(L.A, mul(dk, 18))], COAT({ fill: mix(PAL.fur, PAL.furS, tone + 0.18), inkW: 1.1, inkHeavy: 1.5, cast: false, maxShade: 4 })); // the point of the hock
        f.line([lp(L.K, L.A, 0.3, -12), lp(L.K, L.A, 0.92, -7)], 1.8, PAL.furD, { op: 0.55 }); // the Achilles cord
      }
      f.line([lp(L.K, L.A, 0.15, front ? -10 : 10), lp(L.K, L.A, 0.85, front ? -7 : 7)], 1.4, '#ffffff', { op: 0.7 });
      forkHanks(f, X, [lp(L.K, L.A, 0.1, front ? 26 : 34), lp(L.K, L.A, 0.5, front ? 18 : 22)], 2, 18, 34, 10, 14, { ice: 0.5, tone: tone + 0.08, fade: false });
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T, pt = L.lift ? T : [T[0] - 12, GY - 34]; // the pastern runs down to the back of the paw, sloped
      f.part(K.chain([lerp(L.A, pt, -0.14), L.A, lerp(L.A, pt, 0.55), pt], [32, 30, 25, 34]), COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 6, cast: false }));
      if (front) f.part([add(L.A, [-13, -9]), add(L.A, [9, -13]), add(L.A, [15, 4]), add(L.A, [-2, 13]), add(L.A, [-13, 7])], COAT({ fill: mix(PAL.fur, PAL.furS, tone + 0.18), inkW: 1, inkHeavy: 1.3, cast: false, maxShade: 3 })); // the knob of the wrist
      const boot = (k === 'fn' || k === 'hf');
      if (L.lift) {
        // the reaching paw, lifted, in its bootie: the toes curled, the sole turned back and down
        const F2 = frame(T, deg(52), 0.95); // turned down, about to strike the snow
        f.part(F2([[-22, -18], [16, -20], [44, -8], [54, 8], [46, 22], [8, 24], [-22, 16]]), HIDE({ fill: '#d6d6d0', tex: 'mottle' + sd, texOp: 0.45 }));
        f.stroke(F2([[-24, -8], [-2, -16], [18, -14]]), 5, PAL.greyD); f.stitches(F2([[-14, 18], [42, 16]]), PAL.hideD, 0.9);
        f.line(F2([[18, 22], [24, 6], [22, -12]]), 1, PAL.hideD, { op: 0.6 }); f.line(F2([[34, 20], [38, 6]]), 1, PAL.hideD, { op: 0.6 }); // the toes curled inside the bootie
        X.icicles(F2([[0, 22], [44, 20]]), 2, 12, 4);
      } else dogPaw(f, X, [T[0] - 6, GY - 32], 1, 74, COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 6, cast: false }), { bootie: boot, bootCol: mix(PAL.hide, PAL.hideS, tone) });
    }
  };

  // ---- far legs, the near thigh and upper arm (under the body)
  leg('hf', true); leg('ff', true);

  // ---- the tail: a thick brush carried up and curled forward over the croup, its tip lying on the back; the long hair
  // hangs off its underside in frozen hanks
  f.bone('tail');
  const tC = spline([[384, 724], [364, 676], [374, 630], [410, 604], [456, 610], [486, 646], [494, 694]], 6), tW = tC.map((_, i, a) => 96 - 30 * i / (a.length - 1)); // a full brush curled tight onto the croup, its tip lying on the back (no gap under the curl)
  // the hair filling the curl (it is a plume, not a hoop): drawn first, darker, under the brush
  const inCurl = [[392, 700], [404, 640], [440, 626], [474, 650], [482, 712], [430, 724]];
  f.part(inCurl, COAT({ fill: mix(PAL.fur, PAL.furS, 0.28), maxShade: 10, cast: false })); X.furField(inCurl, 12, 20, { dir: () => [0.1, 1], w: 3 });
  const tail = ribbon(tC, tW);
  { const c0 = [430, 640]; tail.forEach((q, i) => { const d = E.norm(sub(q, c0)); tail[i] = add(q, mul(d, 4 * Math.sin(i * 1.7) + f.r() * 3)); }); } // its outline in clumps, not a smooth tube
  f.part(tail, COAT({ maxShade: 18 }));
  clipDraw(f, tail, () => { X.furField(tail, 30, 22, { dir: p => E.norm(sub(p, [430, 650])), w: 3 }); softTone(f, E.smooth(tail), [[[[330, 640], [420, 650], [420, 740], [330, 740]], PAL.furD, 0.4, 14], [[[380, 570], [480, 570], [480, 610], [380, 610]], '#ffffff', 0.5, 12]]); });
  forkHanks(f, X, tC.slice(0, Math.round(tC.length * 0.5)).map((q, i) => add(q, [-tW[i] * 0.44, tW[i] * 0.06])), 5, 34, 70, 18, 28, { ice: 0.5, tone: 0.12 }); // the brush's long hair hanging off its rising side // the brush's long hair hanging off its rising side
  forkHanks(f, X, tC.slice(Math.round(tC.length * 0.5)).map((q, i) => add(q, [0, 18])), 3, 24, 44, 16, 22, { ice: 0.4, tone: 0.08 }); // and off the curl over the back
  X.rime(tC.slice(2, -2).map((q, i) => add(q, [tW[i + 2] * 0.2, -tW[i + 2] * 0.4])), 7, -1);

  // ---- the body: deep chest, tucked waist; split over the two spine bones
  split(f, () => {
    f.part(body, COAT({ maxShade: 30 }));
    clipDraw(f, body, () => {
      X.furField(body, 110, 26, { dir: p => [-0.35, 0.7 + (p[1] - 760) * 0.006], w: 3.2 });
      softTone(f, E.smooth(body), [[[[460, 840], [600, 870], [780, 940], [860, 900], [720, 860], [540, 820]], PAL.furD, 0.5, 14], [[[440, 704], [760, 716], [760, 760], [440, 756]], '#ffffff', 0.55, 16], [[[520, 820], [620, 840], [620, 900], [520, 880]], PAL.furD, 0.45, 12]]); // the lit back, the belly and the tuck in shadow
      for (let i = 0; i < 4; i++) groove([[640 + i * 24, 790], [648 + i * 22, 840], [642 + i * 20, 890 - i * 6]], 1.8, 0.3); // the ribs over the deep chest
      groove([[560, 860], [530, 826], [494, 810]], 2.4, 0.5); // the flank fold before the stifle
      groove([[734, 740], [754, 806], [764, 876]], 2.6, 0.45); // the shoulder blade's back edge
      // the old bite scar across the shoulder: a bald pale weal with the tooth marks either side
      f.stroke([[744, 772], [780, 786], [816, 802]], 7, '#f8f8f6'); f.line([[744, 772], [780, 786], [816, 802]], 1, INK, { op: 0.55 });
      for (let i = 0; i < 4; i++) { f.flat(ell([752 + i * 20, 764 + i * 8], 2.4, 1.8, 0, 6), PAL.furD, { op: 0.7 }); f.flat(ell([748 + i * 20, 788 + i * 8], 2.4, 1.8, 0, 6), PAL.furD, { op: 0.7 }); }
    });
  }, [['spine_1', side([560, 800], [-1, 0], 50)], ['spine_2', side([560, 800], [1, 0], 50)]]);
  // the coat hanging from the belly and the deep chest in frozen points, darker in the shadow under the body
  f.bone('spine_1');
  forkHanks(f, X, [[380, 820], [440, 848], [520, 852]], 4, 20, 40, 16, 24, { ice: 0.4, tone: 0.2 });
  X.rime([[352, 726], [400, 702], [470, 700], [540, 714], [600, 722]], 9, -1);
  f.bone('spine_2');
  forkHanks(f, X, [[600, 880], [680, 930], [760, 944], [820, 916]], 6, 28, 56, 20, 28, { ice: 0.4, tone: 0.22 });
  X.rime([[600, 722], [700, 718], [770, 726], [830, 752]], 10, -1);

  // ---- the near legs over the body
  leg('hn', false); leg('fn', false);
  // the near shoulder blade and the haunch, by light and shadow, on the spine bones (they stay put when a leg swings)
  f.bone('spine_1');
  softTone(f, E.smooth(body), [[[[370, 740], [450, 730], [470, 790], [420, 812], [380, 790]], '#ffffff', 0.4, 10]]);
  groove([[384, 744], [430, 790], [456, 856]], 2.6, 0.45);
  f.bone('spine_2');
  softTone(f, E.smooth(body), [[[[760, 750], [810, 758], [824, 806], [800, 822], [772, 800]], '#ffffff', 0.4, 10]]);
  groove([[760, 752], [786, 800], [806, 846]], 2.8, 0.5);

  // ---- the neck and the thick ruff: frozen hanks round the neck and down the chest, hanging plumb
  f.bone('neck');
  const neck = [[706, 720], [790, 714], [872, 744], [910, 780], [930, 850], [896, 896], [846, 904], [814, 884], [790, 834]];
  f.part(neck, COAT({ maxShade: 20 }));
  clipDraw(f, neck, () => { X.furField(neck, 40, 22, { dir: () => [-0.5, 0.8], w: 3 }); softTone(f, E.smooth(neck), [[[[800, 840], [930, 840], [930, 910], [800, 910]], PAL.furD, 0.45, 12]]); });
  X.hanks([[770, 760], [820, 754], [870, 772]], 4, 40, 70, 22, 30, { ice: 0.2, inside: neck, lift: -30 }); // the mane down the neck
  forkHanks(f, X, [[790, 840], [834, 880], [880, 904], [920, 880]], 7, 34, 70, 18, 26, { ice: 0.5, tone: 0.12 }); // the chest ruff, thick, under the throat
  X.rime([[720, 716], [800, 712], [872, 744], [906, 780]], 9, -1);

  // ---- the harness: the collar with its bone bead, the breast strap (worn bright) across the chest, the side straps
  // to the loop at the tail's root, bone toggles; a frozen chewing rag caught in it
  f.bone('spine_2');
  const HR = (o = {}) => HIDE(Object.assign({ fill: '#8e9094', shadow: '#3a3c40', light: '#c4c6c8', inkW: 1.4, cast: false, tex: 'mottle' + sd, texOp: 0.5, shade: 0.35 }, o));
  const strap = (pts, w, look) => { const C2 = spline(pts, 5); f.part(ribbon(C2, C2.map(() => w)), look || HR()); return C2; };
  const sideS = strap([[858, 840], [790, 850], [700, 820], [610, 780], [520, 744], [440, 722], [370, 714]], 18);
  f.stitches(sideS.slice(2, -2), '#d8dadc', 0.9);
  strap([[704, 724], [694, 820], [688, 920]], 16); // the girth strap behind the elbow
  for (const q of [[694, 826], [520, 746]]) { f.part(ell(q, 7, 11, 0.3, 10), BONE()); f.line([add(q, [-2, -8]), add(q, [2, 8])], 1, PAL.boneD); } // bone toggles
  f.bone('neck');
  const br = strap([[832, 756], [884, 796], [908, 856], [892, 890]], 20, HR({ fill: '#a4a6aa', light: '#e8eaec' }));
  f.line(br.slice(1, -2).map(q => add(q, [4, -3])), 2.4, '#f0f2f4', { op: 0.9 }); // worn bright where it bears
  strap([[886, 764], [910, 804], [922, 840]], 14); // the collar
  const bd = [918, 846]; cord(f, [add(bd, [0, -4]), add(bd, [0, 6])], 1.2); f.part(ell(add(bd, [0, 14]), 7, 8, 0, 10), BONE());
  f.part([[880, 824], [902, 832], [906, 870], [896, 894], [882, 882], [868, 856]], HIDE({ fill: '#cdcdc6', inkW: 1.2, cast: false })); f.line([[882, 840], [888, 880]], 1, PAL.hideD, { op: 0.6 }); for (let i = 0; i < 4; i++) f.flat(ell([876 + i * 6, 854 + i * 8], 1.6, 1.2, 0, 6), PAL.hideD, { op: 0.7 }); // the chewing rag with its tooth marks
  X.icicle([892, 892], 14, 4);
  f.bone('spine_1');
  const loop = [372, 712]; f.part(ell(loop, 16, 12, 0, 14), HR()); f.flat(ell(loop, 7, 5, 0, 10), '#1a1a1c'); // the loop at the tail's root

  // ---- the line: braided hide, taut, running back a pace and stopping dead in a clean flat cut
  f.bone('line');
  const ld = E.norm(sub(LINEC, LINE0)), ln = [-ld[1], ld[0]];
  f.part(ribbon([LINE0, LINEC], [10, 10]), HIDE({ fill: '#b8b8b2', inkW: 1.4, cast: false, tex: 'mottle' + sd, texOp: 0.4 }));
  for (let i = 1; i < 26; i++) { const q = lerp(LINE0, LINEC, i / 26); f.line([add(q, mul(ln, 5)), add(add(q, mul(ld, 5)), mul(ln, -5))], 1, PAL.hideD, { op: 0.8, straight: true }); } // the braid's lay
  X.icicles([lerp(LINE0, LINEC, 0.2), lerp(LINE0, LINEC, 0.9)], 3, 18, 4);
  const ce = ell(LINEC, 3.5, 6, Math.atan2(ld[1], ld[0]), 14);
  f.flat(ce, PAL.void); f.line(ce.concat([ce[0]]), 1.4, INK); f.line(ell(LINEC, 6, 8.5, Math.atan2(ld[1], ld[0]), 14).slice(1, 8), 1.2, '#ffffff', { op: 0.9 });

  // ---- the head: a broad wedge, deepest at the stop, the muzzle blunt; small ears (the near one gone, the rim clean);
  // the small dark eye under the brow ridge; the mouth a little open in the silent pant
  f.bone('ear');
  f.part(hF([[-50, -34], [-56, -74], [-44, -84, 1], [-22, -50]]), COAT({ fill: mix(PAL.fur, PAL.furS, 0.32), inkW: 1.2, cast: false, maxShade: 6 })); // the far ear, small, upright
  f.flat(hF([[-46, -44], [-48, -70], [-40, -76], [-30, -50]]), PAL.furD, { op: 0.5 });
  f.bone('jaw');
  const jaw = hF([[-20, 30], [20, 30], [56, 28], [92, 30], [100, 40], [86, 50], [44, 54], [0, 50], [-30, 44]]);
  f.part(hF([[30, 16], [100, 14], [96, 32], [40, 30]]), { fill: '#161618', shadow: '#060608', shade: 0.2, inkW: 1.2, cast: false, hatch: false }); // the dark of the open mouth
  f.part(hF([[52, 24], [86, 22], [92, 30], [70, 34], [52, 32]]), { fill: '#8a8e96', shadow: '#3a3c42', light: '#c0c4ca', shade: 0.35, inkW: 1, cast: false, hatch: false }); // the grey tongue's tip, inside the teeth
  f.part(jaw, COAT({ maxShade: 8 }));
  crease(f, hF([[30, 30], [64, 32], [94, 32]]), 1.8, { col: '#141416', op: 0.9 }); // the black lower lip
  f.part(hF([[82, 30], [88, 30], [86, 20]]), BONE({ inkW: 0.8 })); // the lower canine
  forkHanks(f, X, hF([[-24, 46], [20, 54], [60, 52]]), 4, 14, 28, 10, 14, { ice: 0.6, fade: false, tone: 0.15 }); // the frost beard under the jaw
  f.bone('head');
  const skull = hF([[-74, 14], [-70, -18], [-50, -42], [-16, -50], [14, -46], [36, -34], [52, -24], [84, -20], [104, -14], [114, -4], [112, 8], [96, 14], [66, 16], [40, 18], [20, 26], [-12, 36], [-46, 36]]);
  f.part(skull, COAT({ maxShade: 14 }));
  clipDraw(f, skull, () => {
    X.furField(skull, 26, 14, { dir: () => rot([-1, 0.25], hA), w: 2.6 });
    softTone(f, E.smooth(skull), [[hF([[-80, 6], [-10, 10], [0, 40], [-80, 40]]), PAL.furD, 0.45, 8], [hF([[-50, -46], [30, -40], [30, -28], [-50, -30]]), '#ffffff', 0.55, 8], [hF([[44, -2], [110, -6], [110, 14], [44, 16]]), PAL.furS, 0.4, 6]]);
    groove(hF([[34, -36], [40, -24], [44, -14]]), 2, 0.55); // the stop
    groove(hF([[-6, 2], [10, 14], [14, 26]]), 1.8, 0.45); // the cheek's edge
    f.flat(hF([[52, -22], [104, -14], [110, -6], [86, -10], [58, -14]]), PAL.furD, { op: 0.3 }); // the darker bridge of the muzzle
  });
  // the eye: narrow and almond, under the brow ridge's dark stroke, frost on the lid
  f.flat(hF([[4, -26], [16, -31], [30, -28], [20, -22], [8, -21]]), '#121214');
  f.flat(hF(ell([19, -27], 2, 1.6, 0, 6)), '#6a6e74');
  f.stroke(hF([[-4, -32], [16, -38], [36, -32]]), 4, '#1a1a1e');
  f.line(hF([[6, -27], [18, -31], [28, -28]]), 0.9, '#ffffff', { op: 0.7 });
  // the nose, black; the upper lip short and drooping at the corner; the upper canine; frosted whiskers
  const nz = hF([[110, -6]])[0];
  f.part([add(nz, [-10, -8]), add(nz, [4, -10]), add(nz, [11, -2]), add(nz, [8, 8]), add(nz, [-8, 7])], { fill: '#1e1e22', shadow: '#060608', light: '#6a6e74', shade: 0.3, inkW: 1.2, cast: false, hatch: false });
  f.flat(ell(add(nz, [3, -4]), 3, 1.6, 0, 6), '#9a9ea4');
  crease(f, hF([[44, 16], [74, 14], [108, 10]]), 2, { col: '#141416', op: 0.9 });
  f.part(hF([[76, 14], [82, 14], [79, 26]]), BONE({ inkW: 0.8 }));
  for (let i = 0; i < 5; i++) { const a = hF([[66 + i * 7, -2 + (i % 2) * 4]])[0]; f.line([a, add(a, [16 + i * 2, 6 + i * 2])], 0.9, '#ffffff', { op: 0.9 }); f.flat(ell(add(a, [16 + i * 2, 6 + i * 2]), 1.5, 1.2, 0, 6), '#ffffff'); }
  X.frost(hF([[70, -4]])[0], 18, 7, 7, 1.1);
  X.rime(hF([[-50, -44], [-16, -52], [14, -48], [40, -30], [96, -18]]), 6, -1);
  // the near ear: gone, its base cut off flat in a clean rim
  const er = hF([[-30, -46]])[0];
  f.part([add(er, rot([-16, 4], hA)), add(er, rot([-12, -6], hA)), add(er, rot([12, -8], hA)), add(er, rot([16, 4], hA))], COAT({ fill: mix(PAL.fur, PAL.furS, 0.1), cast: false, inkW: 1.1 })); // the stump of the near ear, cut off flat
  X.voidPatch([add(er, rot([-12, -6], hA)), add(er, rot([12, -8], hA)), add(er, rot([10, -5], hA)), add(er, rot([-10, -3], hA))], { w: 1, rim: false }); f.line([add(er, rot([-12, -9], hA)), add(er, rot([12, -11], hA))], 1.1, '#ffffff', { op: 0.9 }); // the clean flat cut, black in section
  // the ruff of the cheek and throat, thick, in points
  forkHanks(f, X, hF([[-78, 4], [-66, 28], [-40, 36]]), 5, 22, 44, 12, 18, { ice: 0.4, fade: false, tone: 0.06 });

  // the feet sink in a little; no shadow
  for (const k of ['ff', 'hn', 'hf']) { f.bone(`leg_${k}_3`); snowLip(f, [LEG[k].T[0] + 20, GY + 3], 90, 7); }
  return f;
}

// ------------------------------------------------------------------ LEMMING DRIFT (Small, 0.5 high, 1.0 wide)
// One lemming, side on: c centre, a heading, s body length. o.arch bends the back (+ hunched, - stretched), o.sx squashes
// it along its length (turned toward or away from the viewer), o.mirror faces it the other way, o.legs [fore, hind]
// angles (0 down, + forward), o.frozen stiff straight legs and a rimed coat, o.cut cuts it off cleanly at that fraction
// from the nose (the void took the back half), o.open the mouth open, o.tone the coat's shade (far ones darker).
function lemming(f, X, c, a, s, o = {}) {
  const sg = o.mirror ? -1 : 1, sx = o.sx ?? 1, ar = o.arch ?? 0.1, ud = o.upside ? -1 : 1;
  const L = q => { const x = q[0] * sx, y = (q[1] + ar * (q[0] * q[0] - 0.2)) * ud; return add(c, rot([x * s * sg, y * s], a * sg)); };
  const LL = pts => pts.map(L);
  const tone = o.tone ?? 0, col = mix(PAL.fur, PAL.furS, tone), dk = mix(PAL.furD, '#000', tone * 0.3);
  const look = { fill: col, shadow: mix(PAL.furS, PAL.furD, tone), light: PAL.furL, shade: 0.42, maxShade: s * 0.18, tex: X.hairTex(90), texOp: 0.18, inkW: 1.3, inkHeavy: 1.9, cast: false, hatch: tone > 0.2 };
  const leg = (h, ang0, len, front) => {
    const dir = [Math.sin(ang0), Math.cos(ang0)], k = add(h, mul(dir, len * 0.55)), e = add(h, mul(dir, len));
    const pts = o.frozen ? [h, e] : [h, add(k, [front ? 0.04 : -0.06, 0]), e];
    const P2 = LL(pts), w = s * (front ? 0.09 : 0.11);
    f.part(tube(P2, P2.map((_, i) => w * (1 - i * 0.25))), Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, maxShade: 3 }));
    // the claws: the fore claws long in winter, dark
    const ee = P2[P2.length - 1], dd = E.norm(sub(ee, P2[P2.length - 2]));
    for (let i = -1; i <= 1; i++) { const q = add(ee, mul([-dd[1], dd[0]], i * w * 0.3)); f.line([q, add(q, mul(rot(dd, sg * (front ? -0.6 : -0.3)), s * (front ? 0.08 : 0.05)))], 1.1, '#141416'); }
    if (o.frozen) X.icicle(add(ee, [0, 1]), s * 0.14, Math.max(2.4, s * 0.04));
  };
  const lg = o.legs || [0.3, -0.3];
  // far legs first (darker), then the body, then the near legs
  const i0 = f.out.length;
  leg([0.18, 0.12], lg[0] - 0.4, 0.26, true); leg([-0.3, 0.12], lg[1] + 0.4, 0.24, false);
  const body = LL([[-0.52, 0.04], [-0.46, -0.16], [-0.28, -0.3], [0.0, -0.33], [0.22, -0.29], [0.36, -0.2], [0.48, -0.1], [0.56, 0.0], [0.53, 0.08], [0.44, 0.13], [0.3, 0.2], [0.04, 0.25], [-0.24, 0.24], [-0.44, 0.17]]);
  f.part(body, look);
  clipDraw(f, body, () => {
    for (let i = 0; i < 5; i++) { const x = -0.4 + i * 0.17 + (f.r() - 0.5) * 0.08, p0 = L([x, -0.2 + f.r() * 0.1]), p1 = L([x - 0.08 - f.r() * 0.06, 0.06 + f.r() * 0.12]); f.stroke([p0, add(lerp(p0, p1, 0.5), [(f.r() - 0.5) * s * 0.06, 0]), p1], s * 0.03, dk, { op: 0.32 }); } // the coat parting in a few clumps
    f.flat(LL([[-0.6, 0.1], [0.0, 0.14], [0.6, 0.08], [0.6, 0.3], [-0.6, 0.3]]), look.shadow, { op: 0.35 }); // the belly in shade
  });
  // the head: the blunt snout, the cheek's fur, a small ear buried in fur, the black eye, the incisors black-tipped
  crease(f, LL([[0.22, -0.26], [0.26, -0.08], [0.24, 0.12]]), Math.max(1, s * 0.02), { col: dk, op: 0.45 });
  f.part(LL([[0.17, -0.27], [0.22, -0.33], [0.27, -0.27], [0.24, -0.22]]), Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.1 })); // the ear
  f.flat(ell(L([0.38, -0.1]), s * 0.034, s * 0.03, 0, 8), '#0e0e10'); f.flat(ell(add(L([0.38, -0.1]), [s * 0.008 * sg, -s * 0.01]), s * 0.009, s * 0.008, 0, 6), '#c8ccd0');
  f.flat(ell(L([0.555, 0.0]), s * 0.03, s * 0.025, 0, 6), '#2a2c30'); // the nose
  const mo = o.open ? 0.07 : 0.02;
  f.part(LL([[0.47, 0.07], [0.51, 0.07], [0.51, 0.1 + mo], [0.49, 0.12 + mo], [0.47, 0.1 + mo]]), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
  f.flat(LL([[0.47, 0.09 + mo], [0.51, 0.09 + mo], [0.5, 0.12 + mo], [0.48, 0.12 + mo]]), '#0e0e10'); // black-tipped teeth
  if (o.open) f.flat(LL([[0.42, 0.1], [0.5, 0.12], [0.44, 0.16]]), '#141416');
  for (let i = 0; i < 3; i++) f.line([L([0.5, 0.02 + i * 0.02]), L([0.66, -0.02 + i * 0.05])], 0.7, '#ffffff', { op: 0.9 }); // whiskers, frosted
  // the stub tail; frost
  if (!o.cut) { f.part(LL([[-0.5, -0.02], [-0.62, -0.06], [-0.63, 0.0], [-0.5, 0.06]]), Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.1 })); X.icicle(L([-0.6, 0.0]), s * 0.12, Math.max(2.2, s * 0.035)); }
  if (o.frozen) { X.frost(L([0.0, -0.2]), s * 0.3, s * 0.08, 5, 1); X.rime(LL([[-0.3, -0.3], [0.0, -0.34], [0.3, -0.26]]), s * 0.06, ud * sg > 0 ? -1 : 1); }
  if (o.icy !== false) X.icicles(LL([[-0.2, 0.24], [0.1, 0.24]]), 1, s * 0.16, Math.max(2.4, s * 0.04));
  leg([0.22, 0.14], lg[0], 0.27, true); leg([-0.26, 0.14], lg[1], 0.25, false);
  if (o.cut) {
    // the void took the back half: everything behind the cut line is gone, the cut face flat black with a clean rim
    const cx = o.cut, P0 = L([cx, -0.6]), P1 = L([cx, 0.6]), d = E.norm(sub(L([cx + 1, 0]), L([cx, 0])));
    const body2 = f.out.splice(i0 - (f.out.length - f.out.length)).join('\n');
    const keep = [add(P0, mul(d, 4 * s)), add(P1, mul(d, 4 * s)), P1, P0].map(q => [q[0], q[1], 1]);
    const id = f.id('lc'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(keep)}"/></clipPath>`);
    f.raw(`<g clip-path="url(#${id})">${body2}</g>`);
    const fc = ell(L([cx, -0.04]), s * 0.05 * sx + 2, s * 0.27, a * sg + Math.PI / 2 - Math.PI / 2, 18).map(q => q);
    const face0 = LL([[cx, -0.31], [cx + 0.03, -0.18], [cx + 0.035, 0.0], [cx + 0.03, 0.14], [cx, 0.22], [cx - 0.03, 0.14], [cx - 0.035, 0.0], [cx - 0.03, -0.18]]);
    f.flat(face0, PAL.void); f.line(face0.concat([face0[0]]), 1.2, INK); f.line(face0.slice(0, 5), 1, '#ffffff', { op: 0.9 });
  }
}
function lemmingDrift() {
  const CW = 760, CH = TIERS.small[1], GY = CH - 30, sd = 1226;
  const f = new Fig(base(sd, CH, { grimeY: GY + 100 }));
  const X = fx(f, 0.8);
  f.joint('heap', [360, GY - 60]);
  f.bone('root');
  snowGround(f, 30, CW - 20, GY, { depth: 30 });
  // the heap: a low wide wave of bodies pouring forward, its crest toward the front; the mass under the individuals is
  // dense fur in shadow, packed lemmings half-seen in it
  const heap = [[60, GY], [80, GY - 70], [150, GY - 140], [250, GY - 200], [350, GY - 250], [440, GY - 290], [520, GY - 300], [580, GY - 278], [620, GY - 220], [650, GY - 140], [690, GY - 70], [730, GY - 10], [740, GY]]; // a low wave, its crest toward the front
  // (review: two clean holes side by side in a bare patch of the mass read as a pair of eyes) three holes of different
  // sizes at different heights, and they cut straight through the lemmings packed round them
  const holes = [X.hole([300, GY - 120], 28, 28, 0, [8, 4]), X.hole([476, GY - 206], 17, 17, 0, [5, 3]), X.hole([604, GY - 92], 12, 12, 0, [4, 2])];
  const R = () => f.r(), inside = (q, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const A = poly[i], Bq = poly[j]; if ((A[1] > q[1]) !== (Bq[1] > q[1]) && q[0] < (Bq[0] - A[0]) * (q[1] - A[1]) / (Bq[1] - A[1]) + A[0]) c = !c; } return c; };
  // the bodies of the drift, back and high first, front and low last; each heads along the pour (up the back, over the
  // crest, down the front face), sized by depth, every one in its own pose
  const L = [];
  const pose = () => ({ arch: -0.05 + R() * 0.35, legs: [0.1 + R() * 1.2, -0.2 - R() * 0.9], sx: 0.72 + R() * 0.32, open: R() < 0.2, mirror: R() < 0.1 });
  const flow = q => { const x = q[0]; if (x < 520) return -0.35 + (x - 60) / 460 * 0.35 + (R() - 0.5) * 0.5; return 0.3 + (x - 520) / 200 * 1.0 + (R() - 0.5) * 0.4; };
  for (let row = 0; row < 7; row++) {
    const yb = GY - 300 + row * 46;
    for (let k = 0; k < 9; k++) {
      const q = [70 + k * 76 + (row % 2) * 36 + (R() - 0.5) * 34, yb + (R() - 0.5) * 26];
      if (!inside(q, heap) || holes.some(h => E.len(sub(q, h.c)) < h.rx * 0.5)) continue;
      L.push([q[0], q[1], flow(q), 46 + row * 3.4 + R() * 10, Object.assign(pose(), { tone: Math.max(0, 0.34 - row * 0.05) })]);
    }
  }
  // the ones with a story, placed by hand: frozen solid and carried, the back halves taken, the tumblers off the front
  L.push([210, GY - 168, 0.2, 54, { frozen: true, legs: [0.9, -0.9], upside: true, tone: 0.12, arch: 0 }]);
  L.push([400, GY - 236, 0.3, 64, { frozen: true, legs: [1.0, -1.0], arch: 0, tone: 0.06 }]);
  L.push([430, GY - 84, 0.1, 66, { frozen: true, legs: [0.7, -0.7], arch: 0, tone: 0.02, upside: true }]);
  L.push([570, GY - 232, 0.8, 58, { arch: 0.1, legs: [0.9, -0.5], tone: 0.08, cut: 0.0 }]);
  L.push([340, GY - 160, 0.3, 60, { arch: 0.12, legs: [0.6, -0.6], open: true, tone: 0.1, cut: 0.05 }]);
  L.push([330, GY - 30, 0.05, 64, { arch: 0.15, legs: [0.5, -0.6], tone: 0.02, cut: 0.1 }]);
  L.push([660, GY - 46, 1.3, 58, { arch: 0.3, legs: [1.4, 0.6], tone: 0.0 }]); // tumbling headfirst down the front
  L.push([708, GY - 18, 0.08, 54, { arch: 0.0, legs: [0.9, -0.8], tone: 0.0 }]); // already running on
  L.push([620, GY - 150, 1.0, 62, { arch: 0.3, legs: [1.2, 0.2], tone: 0.04 }]);
  L.push([450, GY - 312, 0.1, 58, { arch: 0.25, legs: [0.6, -0.9], open: true, tone: 0.1 }]); // up on the crest
  // the outline itself is lemmings: one row along the heap's top edge, so the edge breaks into backs, heads and legs
  { const C2 = spline(heap.slice(1, -1), 3), S2 = arcLen(C2), Lt = S2[S2.length - 1];
    for (let u = 20; u < Lt - 20; u += 50 + R() * 14) { let i = S2.findIndex(v => v >= u); const q = add(C2[i], [0, 14]), d = sub(C2[Math.min(C2.length - 1, i + 2)], C2[Math.max(0, i - 2)]); L.push([q[0], q[1], Math.atan2(d[1], d[0]) + (R() - 0.5) * 0.5, 44 + R() * 12, Object.assign(pose(), { tone: 0.12 + R() * 0.15 })]); } }
  L.sort((a, b) => a[1] - b[1]);
  X.cut(holes, () => {
    f.bone('heap');
    const heapIn = heap.map(q => [q[0] + (q[0] < 400 ? 14 : -14), GY - (GY - q[1]) * 0.86]); // set in from the outline, which is bodies
    f.part(heapIn, FUR({ fill: mix(PAL.fur, PAL.furD, 0.45), shadow: '#2a2c30', tex: X.hairTex(80), texOp: 0.4, maxShade: 40, inkW: 0 })); // the dark of the packed mass between the bodies
    clipDraw(f, heap, () => {
      // the packed mass: half-seen backs, tails and paws in the shadow between the bodies
      softTone(f, E.smooth(heap), [[[[60, GY - 80], [720, GY - 60], [730, GY + 10], [60, GY + 10]], PAL.furD, 0.5, 20]]);
      X.furField(heap, 90, 14, { dir: () => [0.5, 1], w: 2.4, dark: '#3a3c40' });
    });
    f.bone('heap');
    // what they have gnawed and dragged along, tooth marks on everything
    // a herder's mitten
    { const m = [180, GY - 110], F2 = frame(m, -0.3, 1); f.part(F2([[-24, -14], [16, -18], [34, -6], [36, 10], [20, 18], [-24, 14]]), HIDE({ fill: '#bfbfb8', inkW: 1.2, cast: false })); f.part(F2([[4, -16], [10, -32], [20, -32], [22, -16]]), HIDE({ fill: '#b4b4ae', inkW: 1, cast: false })); for (let i = 0; i < 5; i++) f.flat(F2(ell([-12 + i * 9, 14], 2, 1.4, 0, 6)), PAL.hideD); }
    // a chewed harness strap with a bone toggle
    { const a0 = [520, GY - 160], a1 = [580, GY - 120]; f.part(ribbon([a0, a1], [10, 10]), HIDE({ fill: '#8e9094', shadow: '#3a3c40', inkW: 1.2, cast: false })); f.part(ell(lerp(a0, a1, 0.3), 5, 8, 0.4, 10), BONE()); for (let i = 0; i < 4; i++) f.flat(ell(add(a1, [-2 - i * 4, -3 + (i % 2) * 6]), 2, 1.6, 0, 6), '#1a1a1c'); }
    // a string of bone beads
    beadString(f, [[230, GY - 64], [270, GY - 50], [310, GY - 58], [350, GY - 44]], 3.6, 8);
    // a ptarmigan feather: white vane, a dark shaft, the tip black
    { const fp = [250, GY - 220], F2 = frame(fp, -0.4, 1); f.part(F2([[0, 0], [20, -8], [56, -8], [70, -2], [56, 6], [20, 6]]), { fill: '#f6f6f4', shadow: PAL.furS, shade: 0.3, inkW: 1, cast: false, hatch: false }); f.line(F2([[-8, 0], [66, -1]]), 1.4, '#3a3c40'); for (let i = 0; i < 6; i++) f.line(F2([[14 + i * 9, -1], [20 + i * 9, -7]]), 0.8, PAL.furS); f.flat(F2([[58, -6], [70, -2], [58, 5]]), '#1a1a1c'); }
    // a scrap of hide
    f.part([[380, GY - 126], [420, GY - 134], [430, GY - 110], [400, GY - 98], [376, GY - 108]], HIDE({ fill: '#d0d0ca', inkW: 1.1, cast: false })); for (let i = 0; i < 4; i++) f.flat(ell([386 + i * 10, GY - 100], 2, 1.5, 0, 6), PAL.hideD);
    // the individuals, over the mass; the holes go clean through the ones packed over them too
    L.forEach((q, i) => { f.joint('lem_' + i, [q[0], q[1]], 'heap'); f.bone('lem_' + i); lemming(f, X, [q[0], q[1]], q[2], q[3], q[4]); });
    f.bone('heap');
    for (const h of holes) X.holeWall(h);
  });
  f.bone('heap');
  for (const h of holes) X.holeRim(h, { w: 1.8 });
  return f;
}

// ------------------------------------------------------------------ THE DRUM-SEER (Elite 1.9)
// The clan's drum-seer, who beat the great frame drum to call the herds and speak with the dead: a lean old man frozen
// mid-dance, stooped, knees bent, the weight on the bent front leg, the rear heel off the ground. The great drum held up
// beside his head on the near side, the antler beater raised high in the other hand. The coat's fringes are caught in a
// swing that never fell (frozen mid-gesture), icicles hanging plumb from every tip; rime on the windward side. The drum
// skin has a clean round hole through its centre where the last beat landed, the sky showing through. No shadow, and the
// snow round his feet is unmarked though he dances.
// Long coat of white reindeer hide hung with iron pendants, bone discs, long hide fringes and small iron bells whose
// clappers are gone; the drum's skin painted in black with herds, hunters and a black sun, and among them an eye; a
// beater of antler wrapped in fur; a headdress of antler tines with a fringe of hide strips over the brow; a belt of
// bone plaques; a bear-claw necklace; soft boots with beaded tops; a pouch of knucklebones; mittens on a cord.
// Gaunt face, black tattooed lines on the chin, the eyes rolled up white, the lips parted in a chant with no sound.
// Rig: standard humanoid + drum (hand_n), beater (hand_f), headdress (head), hem (pelvis), necklace (torso), mittens (pelvis).
function drumSeer() {
  const CW = TIERS.elite[0], CH = TIERS.elite[1], GY = CH - 30, sd = 1222;
  const f = new Fig(base(sd, CH, { grimeY: GY - 260 }));
  const X = fx(f, 1.5), furTex = X.hairTex(90);
  const H = 176;
  const P = [520, 838], C = [534, 690], N = [640, 586]; // stooped: the upper back rounds, the head forward
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = -0.2, HC = add(N, add(mul(up, 92), [30, -2])), hF = frame(HC, hA, H); // the face lifted to the chant
  const SN = S.at(-0.3, 0.14), EN = [520, 712], WN = [528, 566]; // the near arm down and back, the forearm up behind the drum to its bar
  const SF = S.at(0.42, 0.1), EF = [866, 444], WF = [858, 286]; // the far arm raised high, forward of the face, with the beater
  const HN = S.at(-0.24, 1.0), KN = [458, 1060], AN = [338, 1250]; // the rear leg, the heel lifted
  const HF = S.at(0.3, 0.98), KF = [690, 990], AF = [676, GY - 76]; // the bent front leg carrying the weight
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const D = [520, 452], DRX = 112, DRY = 158, DA = deg(-8); // the drum: as wide as his shoulders, turned three-quarters
  const BT = add(WF, [-206, -18]); // the beater's head, swung back toward the drum's face
  f.joint('drum', WN, 'hand_n').joint('beater', WF, 'hand_f').joint('headdress', hF([[0, -0.4]])[0], 'head').joint('hem', S.at(0, 0.9), 'pelvis').joint('necklace', S.at(0.3, 0.1), 'torso').joint('mittens', S.at(-0.7, 0.86), 'pelvis');
  const COAT = (o = {}) => HIDE(Object.assign({ fill: '#e4e4de', tex: 'mottle' + sd, texOp: 0.4 }, o));
  const swing = [-0.42, 1]; // the fringes froze swinging back from the step

  f.bone('root');
  snowGround(f, 120, 1060, GY, { depth: 40 });

  // ---- far arm raised in front with the beater
  limb3(f, SF, EF, lerp(EF, WF, 0.86), [96, 80, 64], COAT({ fill: mix('#e4e4de', PAL.hideS, 0.28), maxShade: 20 }), ['upperarm_f', 'forearm_f'], { point: 0.35, mus0: 0.14, mus1: 0.2, creaseCol: PAL.hideD });
  f.bone('forearm_f');
  X.fringe([lp(EF, WF, 0.05, -46), lp(EF, WF, 0.5, -40)], 4, 30, 60, { ice: 0.7, fill: mix(PAL.hide, PAL.hideS, 0.3), tex: 'mottle' + sd, dir: [0.6, 1] });
  cuff(f, X, EF, lerp(EF, WF, 0.8), 66, 0.3, furTex);

  // ---- the legs: hide trousers, soft boots with beaded tops; the rear foot on its toe
  const leg = (Hp, Kn, A, sfx, tone, toe) => {
    limb3(f, Hp, Kn, A, [120, 84, 58], HIDE({ fill: mix(PAL.hide, PAL.hideS, tone), tex: 'mottle' + sd, texOp: 0.4 }), ['thigh' + sfx, 'shin' + sfx], { point: 0.25, mus0: 0.12, mus1: 0.24, ca: 1.57, creaseCol: PAL.hideD });
    split(f, () => {
      if (toe) {
        // the rear heel lifted: the soft boot bent at the ball of the foot, the toe on the snow, no mark under it
        const F2 = frame(A, deg(34), 1);
        const bt = F2([[-40, -34], [40, -36], [56, 20], [130, 50], [146, 72], [126, 86], [-10, 74], [-46, 30]]);
        f.part(bt, FUR({ fill: mix(PAL.fur, PAL.furS, tone + 0.06), tex: furTex, texOp: 0.22 }));
        beadBand(f, F2([[-44, -24], [0, -30], [44, -26]]), 12);
        f.flat(F2([[-10, 70], [140, 74], [126, 86], [-10, 78]]), '#3a3c40', { op: 0.9 });
        X.icicles(F2([[0, 76], [100, 80]]), 2, 16, 4);
      } else furBoot(f, X, Kn, A, 76, tone, furTex, { tufts: false, thong: true });
    }, [['shin' + sfx, side(A, [0.3, -1], 26)], ['foot' + sfx, side(A, [-0.3, 1], 26)]]);
  };
  leg(HF, KF, AF, '_f', 0.25, false);
  leg(HN, KN, AN, '_n', 0.05, true);

  // ---- the coat: long, to mid-shin, its skirt and fringes frozen in the swing of the step
  f.bone('hem');
  const sk = [S.at(-1.0, 0.7), S.at(0.95, 0.72), S.at(1.1, 1.0), [742, 1086], [700, 1126], [600, 1150], [500, 1150], [404, 1130], [330, 1080], [300, 1010], S.at(-1.2, 1.0)];
  f.part(sk, COAT());
  clipDraw(f, sk, () => {
    softTone(f, E.smooth(sk), [[[[290, 860], [430, 860], [440, 1160], [290, 1160]], PAL.hideS, 0.5, 20]]);
    folds(f, [[[470, 900], [440, 1000], [410, 1110]], [[560, 920], [560, 1040], [550, 1140]], [[660, 900], [690, 1010], [700, 1100]], [[380, 900], [350, 1000], [330, 1060]]], 6);
    beadBand(f, [[320, 1050], [420, 1100], [560, 1112], [700, 1090], [750, 1060]], 14, { pattern: i => i % 4 !== 2 });
    for (let i = 0; i < 6; i++) f.flat(ell([360 + i * 70, 1000 + (i % 2) * 20], 3, 3, 0, 6), PAL.hideD); // grime and old stains
  });
  X.fringe([[300, 1010], [330, 1080], [404, 1130], [500, 1150], [600, 1150], [700, 1126], [742, 1086]], 16, 50, 120, { ice: 0.8, fill: mix(PAL.hide, PAL.hideS, 0.05), tex: 'mottle' + sd, dir: swing, sway: -20 });
  // iron pendants and bone discs and bells hung on the skirt
  const bell = (q, sz) => { cord(f, [add(q, [0, -14]), q], 1.2); const F2 = frame(q, 0.0, sz); f.part(F2([[-0.5, 0], [0.5, 0], [0.8, 1.4], [1.1, 2.0], [-1.1, 2.0], [-0.8, 1.4]]), { fill: PAL.iron, shadow: PAL.ironD, light: '#8a8e92', shade: 0.35, inkW: 1.2, cast: false, tex: 'mottle' + sd, texOp: 0.6 }); f.flat(F2(ell([0, 2.0], 1.1, 0.28, 0, 12)), PAL.void); X.icicle(F2([[0.6, 2.1]])[0], sz * 0.8, 3); };
  for (const [x, y] of [[420, 960], [520, 990], [640, 970]]) bell([x, y], 13);
  for (const [x, y] of [[470, 1000], [590, 1010]]) { cord(f, [[x, y - 18], [x, y]], 1.2); f.part(ell([x, y + 12], 12, 13, 0, 14), BONE()); f.flat(ell([x, y + 12], 3, 3, 0, 8), PAL.boneD); }
  f.bone('torso');
  const tor = S.shape([[-0.12, 0.42, 0.44], [0.06, 0.86, 0.7], [0.3, 0.9, 0.78], [0.55, 0.82, 0.76], [0.8, 0.88, 0.82], [1.0, 0.96, 0.9]]);
  f.part(tor, COAT());
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-1.1, 0.1), S.at(-0.4, 0.1), S.at(-0.4, 0.95), S.at(-1.1, 0.95)], PAL.hideS, 0.5, 20]]);
    folds(f, [[S.at(-0.5, 0.2), S.at(-0.3, 0.5), S.at(-0.4, 0.85)], [S.at(0.2, 0.4), S.at(0.5, 0.6), S.at(0.7, 0.7)]], 5);
    f.stitches([S.at(0.6, 0.1), S.at(0.7, 0.5), S.at(0.66, 0.9)], PAL.hideD, 1);
  });
  X.rime([S.at(0.2, -0.04), S.at(0.7, 0.06), S.at(0.95, 0.35), S.at(0.95, 0.7)], 12, -1);
  // fringes across the back of the shoulders, frozen mid-swing; pendants and bells on the breast
  X.fringe([S.at(-0.9, 0.12), S.at(-0.95, 0.4), S.at(-0.98, 0.7)], 6, 60, 110, { ice: 0.8, fill: mix(PAL.hide, PAL.hideS, 0.12), tex: 'mottle' + sd, dir: [-0.6, 1] });
  for (const [u, v] of [[0.5, 0.42], [0.2, 0.5]]) { const q = S.at(u, v); cord(f, [add(q, [0, -18]), q], 1.3); f.part([add(q, [-8, 0]), add(q, [8, 0]), add(q, [6, 34]), add(q, [0, 42]), add(q, [-6, 34])], { fill: PAL.iron, shadow: PAL.ironD, light: '#8a8e92', shade: 0.35, inkW: 1.2, cast: false }); }
  bell(S.at(0.75, 0.55), 11);
  // the belt of bone plaques, the knucklebone pouch, the mittens on their cord
  f.bone('pelvis');
  const bl = [S.at(-1.02, 0.78), S.at(0.0, 0.81), S.at(0.98, 0.77), S.at(1.0, 0.87), S.at(0.0, 0.9), S.at(-1.04, 0.87)];
  f.part(bl, { fill: '#5a5c60', shadow: '#141418', shade: 0.35, inkW: 1.3, k: 0.6 });
  for (let i = 0; i < 9; i++) { const q = S.at(-0.9 + i * 0.22, 0.84); f.part([add(q, [-12, -10]), add(q, [12, -10]), add(q, [12, 10]), add(q, [-12, 10])], BONE({ sharp: true, inkW: 1 })); f.line([add(q, [-6, -4]), add(q, [6, 4])], 1, PAL.boneD, { op: 0.7 }); }
  const pu = S.at(0.6, 0.9);
  f.part([add(pu, [-22, 0]), add(pu, [22, -2]), add(pu, [28, 40]), add(pu, [10, 58]), add(pu, [-14, 56]), add(pu, [-28, 34])], HIDE({ fill: '#c8c8c2', inkW: 1.3 }));
  rope(f, [add(pu, [-20, 8]), add(pu, [0, 14]), add(pu, [22, 6])], 2.4, PAL.greyD);
  for (let i = 0; i < 3; i++) f.part(ell(add(pu, [-10 + i * 10, 30 + (i % 2) * 8]), 5, 4, 0.4, 8), BONE({ inkW: 0.9 })); // the knucklebones' shapes in the hide
  f.bone('mittens');
  const mc = S.at(-0.7, 0.86);
  cord(f, [mc, add(mc, [-20, 60]), add(mc, [-14, 120])], 1.6); cord(f, [mc, add(mc, [16, 50]), add(mc, [30, 96])], 1.6);
  for (const [q, a0] of [[add(mc, [-14, 120]), 0.1], [add(mc, [30, 96]), -0.2]]) { const F2 = frame(q, a0 + Math.PI / 2, 1); f.part(F2([[0, -16], [50, -18], [70, -4], [66, 14], [10, 18]]), HIDE({ fill: '#bebeb8', inkW: 1.3 })); f.part(F2([[20, -16], [30, -32], [42, -30], [38, -14]]), HIDE({ fill: '#b2b2ac', inkW: 1.1, cast: false })); X.icicle(F2([[66, 4]])[0], 14, 4); }

  // ---- the head: gaunt, old; the eyes rolled up white; the lips parted on the chant; chin tattoos; the headdress
  f.bone('head');
  f.part(limb(S.at(0.12, -0.02), hF([[-0.05, 0.36]])[0], 82, 70), SKIN(sd));
  creases(f, hF([[-0.04, 0.54]])[0], hA + 1.5, 40, 3, PAL.skinS, 0.6); // the cords of an old neck
  f.part(hF([[-0.2, -0.46], [-0.42, -0.34], [-0.5, -0.04], [-0.46, 0.3], [-0.36, 0.46], [-0.28, 0.2], [-0.24, -0.1], [-0.08, -0.36]]), FUR({ fill: '#d0d2d4', tex: X.hairTex(100), texOp: 0.35 })); // thin white hair to the nape
  face(f, X, HC, H, hA, { jaw: 1.06, chin: 0.03, nose: 1.12, hook: 0.4, gaunt: true, age: true, wrinkles: 1, squint: -0.1, browDown: -0.06, faceShade: 0.5, eyeWhite: '#eeeeec', iris: '#e6e6e4', mouthOpen: { x: 0.24, y: 0.33, w: 0.07, h: 0.06 },
    tattoo: [[[0.14, 0.38], [0.13, 0.5]], [[0.19, 0.39], [0.19, 0.52]], [[0.24, 0.39], [0.25, 0.52]], [[0.29, 0.38], [0.3, 0.48]], [[0.1, 0.36], [0.06, 0.46]]] });
  // (review) the face sat in the cel shadow band (the head is turned up and the band ran across the cheek): a narrower
  // band (faceShade 0.5, the band ~44 px) and the lit planes of the brow, cheek and muzzle lifted toward the key light
  softTone(f, E.smooth(hF([[-0.3, -0.4], [0.18, -0.47], [0.38, -0.12], [0.33, 0.25], [0.28, 0.5], [0.05, 0.55], [-0.2, 0.3], [-0.34, -0.1]])), [[hF([[-0.02, -0.34], [0.3, -0.3], [0.34, 0.2], [0.24, 0.46], [0.0, 0.4], [-0.08, 0.0]]), '#ffffff', 0.45, H * 0.06]]);
  // the irises rolled up under the lids: only a grey sliver at the top of each white
  f.flat(hF([[0.1, -0.08], [0.15, -0.085], [0.16, -0.072], [0.1, -0.07]]), '#5a5e66', { op: 0.8 }); f.flat(hF([[0.28, -0.078], [0.305, -0.082], [0.305, -0.07], [0.28, -0.068]]), '#5a5e66', { op: 0.8 });
  f.bone('headdress');
  // the band round the head, the antler tines rising from it, the fringe of hide strips hanging over the brow
  const band = hF([[0.3, -0.34], [0.1, -0.44], [-0.2, -0.46], [-0.44, -0.3], [-0.42, -0.2], [-0.18, -0.34], [0.1, -0.32], [0.3, -0.24]]);
  f.part(band, HIDE({ fill: '#bcbcb6', inkW: 1.4, tex: 'mottle' + sd, texOp: 0.5 }));
  beadBand(f, hF([[-0.38, -0.26], [-0.1, -0.38], [0.24, -0.3]]), 9);
  const tine = (b0, pts, w) => { const C2 = spline([b0, ...pts], 5), W2 = C2.map((_, i) => Math.max(3, w * (1 - i / C2.length))); f.part(ribbon(C2, W2), BONE({ fill: '#ddd8cb', inkW: 1.4, tex: 'mottle' + sd, texOp: 0.4 })); for (let i = 2; i < C2.length - 2; i += 3) f.line([lp(C2[i], C2[i + 1], 0, -W2[i] * 0.4), lp(C2[i], C2[i + 1], 0.5, W2[i] * 0.2)], 1, PAL.boneD, { op: 0.6 }); X.rime(C2.slice(1, -2).map((q, i) => add(q, [W2[i + 1] * 0.3, -W2[i + 1] * 0.3])), 4, -1); return C2; };
  const t0 = hF([[-0.06, -0.44]])[0], t1 = hF([[-0.3, -0.4]])[0];
  tine(t1, [add(t1, [-30, -70]), add(t1, [-50, -150]), add(t1, [-30, -220])], 22);
  tine(add(t1, [-40, -140]), [add(t1, [-90, -170]), add(t1, [-110, -200])], 12);
  tine(t0, [add(t0, [10, -80]), add(t0, [40, -160]), add(t0, [80, -210])], 24);
  tine(add(t0, [30, -140]), [add(t0, [-10, -180]), add(t0, [-20, -220])], 12);
  tine(add(t0, [16, -100]), [add(t0, [60, -120]), add(t0, [90, -110])], 10);
  // the brow fringe: hide strips hanging plumb over the forehead, stiff with frost. (Review: seven separate outlined strips
  // read as a row of teeth over the face.) One fringe shape, short, its lower edge broken into uneven strips
  X.fringe(hF([[0.32, -0.29], [0.1, -0.31], [-0.14, -0.33], [-0.3, -0.27]]), 6, 8, 20, { ice: 0.3, fill: '#d0d0ca', tex: 'mottle' + sd, lift: 2 });

  // ---- the bear-claw necklace over the coat
  f.bone('necklace');
  const nk = [S.at(-0.3, 0.06), S.at(0.1, 0.3), S.at(0.5, 0.36), S.at(0.84, 0.2)];
  beadString(f, nk, 6, 9, { teeth: true });
  // black claws: tip the bone-coloured teeth with black (bear claws are dark)
  { const C2 = spline(nk, 3); for (let i = 0; i < 9; i++) { const q = C2[Math.floor((i + 0.5) / 9 * (C2.length - 1))]; f.flat(ell(add(q, [0, 13]), 3, 3.6, 0, 8), '#1c1c20'); } }

  // ---- the near arm up and back, the drum held up beside the head by its cross-bar
  limb3(f, SN, EN, lerp(EN, WN, 0.84), [104, 86, 70], COAT({ maxShade: 22 }), ['upperarm_n', 'forearm_n'], { point: 0.35, mus0: 0.14, mus1: 0.22, creaseCol: PAL.hideD });
  f.bone('torso'); X.rime([add(SN, [-30, -20]), add(SN, [10, -40]), add(SN, [50, -30])], 12, -1);
  f.bone('upperarm_n');
  X.fringe([lp(SN, EN, 0.3, -52), lp(SN, EN, 0.95, -46)], 5, 60, 110, { ice: 0.8, fill: mix(PAL.hide, PAL.hideS, 0.06), tex: 'mottle' + sd, dir: [-0.3, 1] }); // the sleeve fringe hanging from under the raised arm
  f.bone('forearm_n'); cuff(f, X, EN, lerp(EN, WN, 0.78), 72, 0.06, furTex);
  f.bone('hand_n');
  const barA = Math.atan2(Math.sin(DA + Math.PI / 2), Math.cos(DA + Math.PI / 2));
  const gN = B.grip(f, WN, EN, ang(EN, WN) - Math.PI / 2, 46, PAL.skin, { tex: 'mottle' + sd, texOp: 0.45, shadow: PAL.skinS, name: 'seer drum bar' });
  fistDetail(f, gN, 46, PAL.skin, {}); X.bite(WN, 12, 10, 4, 0.3);

  // ---- the drum: a bentwood rim with its depth showing, the skin painted in black, a clean hole through its centre
  f.bone('drum');
  const DF = frame(D, DA, 1), dE = (rx, ry, n = 48) => ell(D, rx, ry, DA, n);
  const rimBack = dE(DRX, DRY).map(q => add(q, rot([-20, 4], DA))); // the rim's depth, toward the back
  const hole = X.hole(add(D, rot([4, -4], DA)), 24, 30, DA, [-8, 2]);
  X.cut([hole], () => {
    f.part(rimBack, { fill: '#8a8a86', shadow: PAL.woodD, light: '#b8b8b2', shade: 0.4, inkW: 1.8, tex: 'wood' + sd, texOp: 0.5, cast: false });
    f.part(dE(DRX + 8, DRY + 8), { fill: '#a2a29c', shadow: PAL.woodD, light: '#d0d0ca', shade: 0.36, inkW: 2, inkHeavy: 3, tex: 'wood' + sd, texOp: 0.5, cast: false });
    const skin = dE(DRX - 4, DRY - 4);
    f.part(skin, { fill: '#eceae2', shadow: '#9a9890', light: '#fbfaf6', shade: 0.28, maxShade: 24, inkW: 1.4, tex: 'mottle' + sd, texOp: 0.35, cast: false });
    clipDraw(f, skin, () => {
      softTone(f, E.smooth(skin), [[DF([[-120, -40], [-60, -50], [-60, 170], [-120, 170]]), '#9a9890', 0.4, 18]]);
      const ink = '#121214', P2 = pts => DF(pts);
      // the black sun at the top, rayed
      const sc = DF([[0, -100]])[0]; f.flat(ell(sc, 18, 18, 0, 16), ink); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; f.line([add(sc, [Math.cos(a) * 22, Math.sin(a) * 22]), add(sc, [Math.cos(a) * 32, Math.sin(a) * 32])], 2.4, ink); }
      // a ground line and the herd: small reindeer in a file, antlers up
      f.line(P2([[-96, 40], [-30, 46], [40, 44], [100, 36]]), 2, ink);
      const deer = (x, y, sz) => { const F2 = frame(DF([[x, y]])[0], DA, sz); f.flat(F2([[-10, -4], [8, -5], [11, -9], [14, -8], [12, -3], [10, 0], [-10, 1]]), ink); for (const lx of [-8, -4, 5, 8]) f.line(F2([[lx, 0], [lx + (lx > 0 ? 1 : -1), 8]]), 1.2, ink); f.line(F2([[11, -9], [9, -15], [13, -19]]), 1, ink); f.line(F2([[12, -9], [16, -14]]), 1, ink); };
      for (const [x, y, s2] of [[-70, 30, 1.6], [-40, 26, 1.8], [-6, 30, 1.5], [28, 26, 1.7], [60, 28, 1.4]]) deer(x, y, s2);
      // the hunters: stick men with bows, one with a spear, under the herd
      const hunter = (x, y, bow) => { const F2 = frame(DF([[x, y]])[0], DA, 1.6); f.flat(F2(ell([0, -14], 3, 3, 0, 8)), ink); f.line(F2([[0, -11], [0, 2], [-4, 12]]), 1.6, ink); f.line(F2([[0, 2], [4, 12]]), 1.6, ink); f.line(F2([[0, -6], [7, -8]]), 1.4, ink); if (bow) f.line(F2([[7, -16], [11, -8], [7, 0]]), 1.2, ink); else f.line(F2([[-4, -2], [16, -14]]), 1.2, ink); };
      hunter(-60, 80, true); hunter(-10, 84, false); hunter(40, 78, true);
      // the dead under the ground line: figures upside down, as the old drums show the lower world
      for (const x of [-40, 20]) { const F2 = frame(DF([[x, 118]])[0], DA + Math.PI, 1.4); f.flat(F2(ell([0, -14], 3, 3, 0, 8)), ink); f.line(F2([[0, -11], [0, 4]]), 1.4, ink); f.line(F2([[-6, -6], [6, -6]]), 1.4, ink); }
      // the eye, among the painted figures; it blinks
      const ec = DF([[62, -40]])[0]; f.flat(ell(ec, 16, 8, DA, 16), ink); f.flat(ell(ec, 12, 6, DA, 16), '#eceae2'); f.flat(ell(ec, 5, 5, 0, 10), ink); f.line([add(ec, [-16, -2]), add(ec, [0, -10]), add(ec, [16, -2])], 1.6, ink);
      // wear: the skin darkened and scuffed where the beater lands, a split mended with sinew stitches
      f.flat(ell(add(D, rot([4, -4], DA)), 50, 58, DA, 20), '#8a8880', { op: 0.25 });
      f.stitches(P2([[-80, -60], [-60, -84], [-40, -96]]), '#3a3c40', 1.2);
    });
    X.holeWall(hole);
  });
  X.holeRim(hole, { w: 2.2 });
  // lacing round the rim, rime on the windward rim, icicles plumb from its lower edge
  const rimP = dE(DRX + 4, DRY + 4, 32);
  for (let i = 0; i < 32; i += 2) f.line([rimP[i], lerp(rimP[i], D, 0.06)], 1.6, PAL.greyD);
  X.rime(dE(DRX + 10, DRY + 10, 40).slice(28, 40), 7, -1);
  X.icicles(dE(DRX + 6, DRY + 6, 40).slice(6, 15), 4, 30, 6);

  // ---- the beater: an antler tine, its head wrapped in fur and tied, raised high over the drum
  f.bone('beater');
  const bd0 = add(WF, mul(E.norm(sub(WF, BT)), 40));
  f.part(limb(bd0, BT, 14, 10, { steps: 10 }), BONE({ fill: '#d6d1c4', inkW: 1.4, tex: 'mottle' + sd, texOp: 0.4 }));
  for (let i = 0; i < 4; i++) f.line([lp(bd0, BT, 0.25 + i * 0.15, -6), lp(bd0, BT, 0.27 + i * 0.15, 6)], 1, PAL.boneD, { op: 0.6 });
  const bh = ell(BT, 26, 20, ang(WF, BT), 16);
  f.part(bh, FUR({ fill: '#dcdcd8', tex: furTex, texOp: 0.35 })); X.furField(bh, 10, 10, { w: 2.4 });
  rope(f, [lp(bd0, BT, 0.86, -10), lp(bd0, BT, 0.88, 10)], 3, PAL.greyD);
  X.icicles([add(BT, [-16, 14]), add(BT, [16, 12])], 2, 18, 5);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, ang(WF, BT), 44, PAL.skin, { tex: 'mottle' + sd, texOp: 0.45, shadow: PAL.skinS, name: 'seer beater' });
  fistDetail(f, gF, 44, PAL.skin, {}); X.bite(WF, 12, 10, 4, 0.3);
  // no snow lips: the snow round his feet is unmarked
  return f;
}

// ------------------------------------------------------------------ THE VOICELESS CHIEF (Elite 2.1)
// The chief of the winter camp, who decided where the clan went and when: a heavy man in his fifties, broad and upright,
// feet planted wide, an ivory baton of office raised and pointing, the other fist on his belt, the weight square on both
// feet. Frozen mid-shout: the jaw open, the cords of the neck standing out. A clean round hole passes through his throat
// where his voice was taken, the snow behind showing through it. Rime on the windward side; icicles from the beard and
// the baton hand; no breath clouds from the mouth.
// Armour of bone slats: a cuirass of ivory and bone plates laced with sinew over a hide coat, chipped and scored. A collar
// of white fox pelts, a fox head on the near shoulder and on the far one only a clean-cut neck where the head was. Ivory
// labrets at the corners of the mouth; a baton of walrus ivory carved with tally marks; a long knife in a bone sheath;
// mittens with ivory toggles; a belt hung with the tally sticks of the herds; knee boots with bone spikes on the soles; a
// beaded hood thrown back; an old scar across the brow. Broad flat face, heavy brow, grey hair cropped short, frost-burnt
// cheeks, narrowed eyes.
// Rig: standard humanoid + baton (hand_f), collar (torso), hood (torso), skirt (pelvis), knife (pelvis), tallies (pelvis).
function voicelessChief() {
  const CW = TIERS.elite[0], CH = TIERS.elite[1], GY = CH - 30, sd = 1223;
  const f = new Fig(base(sd, CH, { grimeY: GY - 280 }));
  const X = fx(f, 1.6), furTex = X.hairTex(90);
  const H = 204;
  const P = [520, 690], C = [540, 470], N = [552, 290];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = -0.08, HC = add(N, add(mul(up, 112), [24, 0])), hF = frame(HC, hA, H);
  const SN = S.at(-0.36, 0.14), EN = [318, 540], WN = S.at(-0.5, 0.86); // the fist on the belt at the hip, the elbow out behind
  const SF = S.at(0.46, 0.1), EF = [790, 330], WF = [930, 262]; // the baton arm raised and pointing
  const HN = S.at(-0.28, 1.0), KN = [430, 1000], AN = [370, GY - 80];
  const HF = S.at(0.34, 0.98), KF = [654, 994], AF = [730, GY - 84];
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const BTIP = add(WF, rot([200, 0], deg(-24)));
  f.joint('baton', WF, 'hand_f').joint('collar', S.at(0, 0.05), 'torso').joint('hood', S.at(-0.5, -0.04), 'torso').joint('skirt', S.at(0, 0.9), 'pelvis').joint('knife', S.at(-0.6, 0.86), 'pelvis').joint('tallies', S.at(0.5, 0.86), 'pelvis');
  const COAT = (o = {}) => HIDE(Object.assign({ tex: 'mottle' + sd, texOp: 0.4 }, o));
  const SLAT = (o = {}) => BONE(Object.assign({ fill: '#e2ddcf', inkW: 1.3, inkHeavy: 1.8, tex: 'mottle' + sd, texOp: 0.4, shade: 0.4 }, o));

  f.bone('root');
  snowGround(f, 120, 1060, GY, { depth: 40 });

  // ---- the hood thrown back, beaded, behind the head
  f.bone('hood');
  const hd = [S.at(-0.4, -0.1), S.at(-0.1, -0.22), S.at(-0.6, -0.36), S.at(-1.1, -0.18), S.at(-1.16, 0.12), S.at(-0.86, 0.24)];
  f.part(hd, COAT({ fill: '#d2d2cc' }));
  beadBand(f, [S.at(-1.1, -0.12), S.at(-1.12, 0.1), S.at(-0.84, 0.22)], 13);
  f.part([S.at(-0.3, -0.18), S.at(-0.6, -0.28), S.at(-0.98, -0.12), S.at(-0.96, 0.02), S.at(-0.6, -0.06)], { fill: PAL.furS, shadow: PAL.furD, shade: 0.3, inkW: 1.2, cast: false, tex: furTex, texOp: 0.4 });

  // ---- the far arm, raised and pointing the baton; icicles from the hand
  limb3(f, SF, EF, lerp(EF, WF, 0.86), [118, 100, 86], COAT({ fill: mix(PAL.hide, PAL.hideS, 0.28), maxShade: 22 }), ['upperarm_f', 'forearm_f'], { point: 0.3, mus0: 0.2, mus1: 0.26, creaseCol: PAL.hideD });
  f.bone('forearm_f'); cuff(f, X, EF, lerp(EF, WF, 0.8), 92, 0.3, furTex);
  // the bone slat vambrace on the forearm
  for (let i = 0; i < 5; i++) { const t = 0.22 + i * 0.1; f.part([lp(EF, WF, t, -44), lp(EF, WF, t + 0.08, -42), lp(EF, WF, t + 0.08, 40), lp(EF, WF, t, 42)], SLAT({ sharp: true, cast: false })); }
  rope(f, [lp(EF, WF, 0.3, -46), lp(EF, WF, 0.68, 44)], 2, PAL.greyD);

  // ---- legs: hide trousers into knee boots with bone spikes on the soles
  const leg = (Hp, Kn, A, sfx, tone, dir) => {
    limb3(f, Hp, Kn, A, [150, 112, 80], COAT({ fill: mix(PAL.hide, PAL.hideS, tone) }), ['thigh' + sfx, 'shin' + sfx], { point: 0.22, mus0: 0.14, mus1: 0.26, ca: 1.57, creaseCol: PAL.hideD });
    split(f, () => {
      furBoot(f, X, Kn, A, 98, tone, furTex, { tufts: false, w: 30 });
      for (let i = 0; i < 5; i++) { const x = A[0] - 30 + i * 26; f.part([[x - 6, GY - 6], [x + 6, GY - 6], [x + 1, GY + 8, 1]], BONE({ inkW: 1 })); } // the bone spikes on the sole, biting the snow
    }, [['shin' + sfx, side(A, [0.3, -1], 30)], ['foot' + sfx, side(A, [-0.3, 1], 30)]]);
  };
  leg(HF, KF, AF, '_f', 0.25);
  leg(HN, KN, AN, '_n', 0.05);

  // ---- the hide coat's skirt under the cuirass, to the knee
  f.bone('skirt');
  const sk = [S.at(-1.1, 0.78), S.at(1.05, 0.8), S.at(1.24, 1.0), [800, 950], [720, 984], [640, 972], [560, 1000], [470, 990], [380, 1004], [290, 966], S.at(-1.34, 1.0)]; // flared over the wide stance, the hem uneven
  f.part(sk, COAT());
  clipDraw(f, sk, () => { softTone(f, E.smooth(sk), [[[[260, 780], [420, 780], [420, 1010], [260, 1010]], PAL.hideS, 0.55, 18], [[[560, 790], [720, 800], [700, 900], [560, 880]], '#ffffff', 0.4, 18]]); folds(f, [[[420, 800], [400, 880], [380, 990]], [[500, 810], [480, 900], [470, 990]], [[590, 812], [600, 900], [560, 996]], [[680, 806], [720, 890], [730, 970]], [[350, 800], [320, 880], [300, 960]]], 7); for (let i = 0; i < 8; i++) f.flat(ell([320 + f.r() * 440, 860 + f.r() * 120], 6 + f.r() * 10, 3 + f.r() * 4, f.r(), 8), PAL.hideD, { op: 0.35 }); beadBand(f, [[300, 940], [400, 976], [520, 980], [640, 958], [780, 930]], 14, { pattern: i => i % 3 !== 0 }); });
  X.fringe([[290, 966], [380, 1004], [470, 990], [560, 1000], [640, 972], [720, 984], [800, 950]], 13, 30, 70, { ice: 0.6, fill: PAL.hide, tex: 'mottle' + sd });

  // ---- the torso: the hide coat, and over it the cuirass of bone slats laced in rows with sinew
  f.bone('torso');
  const tor = S.shape([[-0.12, 0.5, 0.52], [0.06, 1.12, 0.84], [0.3, 1.12, 1.0], [0.55, 1.0, 1.04], [0.8, 1.06, 1.1], [1.0, 1.14, 1.08]]);
  f.part(tor, COAT());
  const cu = S.shape([[0.14, 1.0, 0.96], [0.3, 1.04, 1.0], [0.55, 0.94, 1.04], [0.8, 1.0, 1.08], [0.9, 1.04, 1.08]]);
  clipDraw(f, cu, () => {
    for (let r = 0; r < 4; r++) {
      const v0 = 0.16 + r * 0.19, v1 = v0 + 0.18;
      // (review: equal slats in straight rows read as a flat brick wall) the slats wrap a barrel chest: they narrow toward
      // the sides (u = sin of the angle round the body) and each row bows down at the sides
      const U = th => 1.08 * Math.sin(th), Vb = th => 0.05 * (1 - Math.cos(th));
      for (let k = 0; k < 14; k++) {
        const th0 = -1.42 + k * 0.205 + (r % 2) * 0.09, th1 = th0 + 0.19, u0 = U(th0), u1 = U(th1), ch = f.r() < 0.18;
        const sl = [S.at(u0, v0 + Vb(th0)), S.at(u1, v0 + Vb(th1)), S.at(u1, v1 + Vb(th1) - (ch ? 0.04 : 0)), S.at(u0, v1 + Vb(th0))].map(q => [q[0], q[1], 1]);
        f.part(sl, SLAT({ fill: mix('#e2ddcf', PAL.boneS, ((k + r) % 3) * 0.08 + (u0 < -0.3 ? 0.18 : 0)), cast: false, maxShade: 6 }));
        const vb = Vb((th0 + th1) / 2), du = u1 - u0;
        f.line([S.at(u0 + du * 0.2, v0 + vb + 0.03), S.at(u0 + du * 0.35, v1 + vb - 0.03)], 1, '#ffffff', { op: 0.7 });
        if (f.r() < 0.35) f.line([S.at(u0 + du * 0.25, v0 + vb + 0.08), S.at(u1 - du * 0.15, v0 + vb + 0.11)], 1, PAL.boneD, { op: 0.8 }); // scored
        if (ch) f.flat([S.at(u1, v1 + vb - 0.06), S.at(u1 - du * 0.3, v1 + vb - 0.02), S.at(u1, v1 + vb - 0.01)], PAL.boneS); // chipped
      }
      // the sinew lacing through each row
      const lc = []; for (let k = 0; k <= 14; k++) { const th = -1.42 + k * 0.205 + (r % 2) * 0.09; lc.push(S.at(U(th), v0 + Vb(th) + 0.05 + (k % 2) * 0.03)); }
      f.line(lc, 2.2, PAL.greyD, { op: 0.9 });
    }
    softTone(f, E.smooth(cu), [[[S.at(-1.2, 0.1), S.at(-0.5, 0.1), S.at(-0.5, 0.95), S.at(-1.2, 0.95)], PAL.boneS, 0.55, 24], [[S.at(0.75, 0.1), S.at(1.2, 0.1), S.at(1.2, 0.95), S.at(0.75, 0.95)], PAL.boneS, 0.3, 20], [[S.at(0.05, 0.15), S.at(0.55, 0.15), S.at(0.55, 0.8), S.at(0.05, 0.8)], '#ffffff', 0.35, 24]]); // the barrel turning away at both sides, the lit front
  });
  f.line(cu.concat([cu[0]]), 1.6, INK, { op: 0.8 });
  X.rime([S.at(0.5, 0.1), S.at(0.95, 0.3), S.at(1.0, 0.7)], 12, -1);
  // the belt, the tally sticks, the knife in its bone sheath
  f.bone('pelvis');
  const bl = [S.at(-1.1, 0.82), S.at(0.0, 0.86), S.at(1.06, 0.82), S.at(1.08, 0.92), S.at(0.0, 0.96), S.at(-1.12, 0.92)];
  f.part(bl, { fill: '#5a5c60', shadow: '#141418', shade: 0.35, inkW: 1.4, tex: 'hatch' + sd, texOp: 0.4, k: 0.6 });
  f.bone('tallies');
  for (let i = 0; i < 6; i++) { const q = S.at(0.3 + i * 0.12, 0.94); cord(f, [q, add(q, [0, 10])], 1.2); const l = 40 + (i % 3) * 12; f.part([add(q, [-4, 8]), add(q, [4, 8]), add(q, [4, 8 + l]), add(q, [-4, 8 + l])], BONE({ sharp: true, inkW: 1 })); for (let k = 0; k < 4; k++) f.line([add(q, [-4, 16 + k * 8]), add(q, [2, 16 + k * 8])], 1, INK, { op: 0.8 }); }
  f.bone('knife');
  const kS = S.at(-0.6, 0.94), kF = frame(kS, deg(100), 1);
  f.part(kF([[0, -14], [170, -12], [196, 0], [170, 12], [0, 14]]), BONE({ fill: '#d2cdc0', inkW: 1.4, cast: true }));
  for (const t of [40, 110]) f.line(kF([[t, -13], [t + 4, 13]]), 2.6, PAL.greyD);
  f.part(kF([[-60, -10], [0, -12], [0, 12], [-60, 10]]), BONE({ fill: PAL.boneS }));
  for (let i = 1; i < 5; i++) f.line(kF([[-i * 12, -10], [-i * 12, 10]]), 2, PAL.greyD);

  // ---- the head and neck: the throat with a clean round hole through it; the face mid-shout
  f.bone('head');
  const throat = X.hole(hF([[0.06, 0.68]])[0], 30, 32, hA, [-7, 3]);
  X.cut([throat], () => {
    f.part(limb(S.at(0.1, -0.02), hF([[0.0, 0.4]])[0], 140, 120), SKIN(sd));
    clipDraw(f, limb(S.at(0.1, -0.02), hF([[0.0, 0.4]])[0], 140, 120), () => { for (const o2 of [-30, 10, 40]) crease(f, [add(hF([[0.02, 0.5]])[0], [o2, 0]), add(hF([[0.02, 0.5]])[0], [o2 * 0.6 - 10, 80])], 3, { col: PAL.skinS, op: 0.6 }); }); // the cords of the neck standing out
    face(f, X, HC, H, hA, { jaw: 1.3, chin: 0.04, nose: 1.0, squint: 0.7, browDown: 0.08, browW: 0.07, age: true, wrinkles: 0.7, faceShade: 0.8, beard: 'short', beardCol: '#bcbec2', hairCol: '#a8aaae', browCol: '#d8dadc',
      scar: [[0.0, -0.3], [0.14, -0.24], [0.3, -0.26]], mouthOpen: { x: 0.24, y: 0.34, w: 0.1, h: 0.1, teeth: true } });
    X.holeWall(throat);
  });
  X.holeRim(throat, { w: 2.4 });
  // the labrets of ivory at the corners of the mouth
  for (const q of [[0.13, 0.33], [0.34, 0.33]]) { f.part(hF(ell(q, 0.028, 0.024, 0, 10)), BONE({ inkW: 1 })); f.flat(hF(ell(q, 0.01, 0.009, 0, 6)), PAL.boneD); }
  X.bite(hF([[0.18, 0.12]])[0], 16, 12, 5, 0.3); // frost-burnt cheek
  // grey hair cropped short, frozen in stiff clumps
  const crown = hF([[0.2, -0.42], [-0.04, -0.56], [-0.3, -0.5], [-0.46, -0.3], [-0.46, -0.04], [-0.34, 0.06], [-0.28, -0.14], [-0.1, -0.34], [0.12, -0.36]]);
  f.part(crown, FUR({ fill: '#a8aaae', shadow: '#4a4c52', light: '#d8dadc', tex: X.hairTex(140), texOp: 0.4 }));
  X.furField(crown, 18, 16, { dir: () => rot([-1, -0.2], hA), w: 2.6 });
  for (let i = 0; i < 8; i++) { const t = i / 7, q = hF([[0.18 - t * 0.6, -0.42 - Math.sin(Math.PI * t) * 0.12]])[0]; X.lock(q, 6 + f.r() * 5, 9 + f.r() * 4, { dir: rot([-1, -0.35], hA), cast: false, fill: i % 2 ? '#b4b6ba' : '#9c9ea2', look: { light: '#d8dadc' } }); }
  X.rime(hF([[0.1, -0.5], [0.3, -0.4], [0.42, -0.2]]), 7, 1);
  for (const [u, v, l] of [[0.1, 0.6, 30], [0.2, 0.62, 40], [0.3, 0.56, 24], [0.0, 0.54, 20]]) X.icicle(hF([[u, v]])[0], l, 7); // icicles from the beard

  // ---- the collar of white fox pelts round the shoulders: a fox head on the near shoulder, on the far one a clean cut
  f.bone('collar');
  const col = [S.at(-1.04, 0.14), S.at(-0.6, 0.04), S.at(-0.1, 0.1), S.at(0.5, 0.14), S.at(1.0, 0.18), S.at(1.06, 0.3), S.at(0.4, 0.32), S.at(-0.4, 0.34), S.at(-1.04, 0.3)]; // low round the shoulders, under the throat
  f.part(col, FUR({ tex: furTex, texOp: 0.3, maxShade: 20 }));
  X.furField(col, 40, 22, { dir: () => [0.2, 1], w: 3 });
  forkHanks(f, X, [S.at(-1.0, 0.3), S.at(-0.4, 0.36), S.at(0.3, 0.34), S.at(0.95, 0.32)], 9, 24, 50, 14, 20, { ice: 0.5 });
  // the far shoulder: the pelt's neck ends in a clean cut, a flat black face, a pale rim
  // (review: the cut faced the viewer as a black disc with a lit rim and read as an eye) the pelt's neck lies along the
  // shoulder toward the heroes and its cut is seen nearly edge-on: a narrow black section with a pale rim
  const fc = S.at(0.94, 0.08), fe = ell(add(fc, [8, -2]), 5, 17, -0.35, 16);
  f.part([add(fc, [-56, -4]), add(fc, [-20, -20]), add(fc, [6, -18]), add(fc, [10, 16]), add(fc, [-20, 20]), add(fc, [-58, 12])], FUR({ fill: mix(PAL.fur, PAL.furS, 0.12), cast: false, tex: furTex, texOp: 0.3 }));
  X.voidPatch(fe, { w: 1.4, rim: false }); f.line(ell(add(fc, [8, -2]), 6.5, 18.5, -0.35, 16).slice(0, 8), 1.1, '#ffffff', { op: 0.9 });
  // ---- the near arm: the elbow out behind, the fist on the belt; mitten with ivory toggles
  limb3(f, SN, EN, lerp(EN, WN, 0.84), [124, 104, 90], COAT({ maxShade: 24 }), ['upperarm_n', 'forearm_n'], { point: 0.4, mus0: 0.2, mus1: 0.26, creaseCol: PAL.hideD });
  f.bone('upperarm_n');
  for (let i = 0; i < 3; i++) { const t = 0.1 + i * 0.16; f.part([lp(SN, EN, t, -60), lp(SN, EN, t + 0.14, -60), lp(SN, EN, t + 0.14, 58), lp(SN, EN, t, 58)], SLAT({ sharp: true, cast: false, fill: mix('#e2ddcf', PAL.boneS, 0.1) })); } // bone slats laced over the upper arm
  // the near shoulder: the fox's head, eyes sewn shut, ears up, its muzzle down over the chest. (Review: drawn under the
  // near arm it showed only as a horn-like curve; it now lies on top of the shoulder, over the arm's root, on the collar)
  f.bone('collar');
  const fx0 = add(SN, [-40, -60]), FX = frame(fx0, deg(66), 1.15);
  f.part(FX([[-34, -30], [-6, -24], [-30, -78], [-14, -76], [4, -30]]), FUR({ fill: mix(PAL.fur, PAL.furS, 0.12), cast: false, inkW: 1.1 })); // the far ear
  const fox = FX([[-52, 8], [-44, -26], [-12, -38], [22, -34], [44, -22], [72, -14], [98, -6], [106, 2], [98, 10], [72, 14], [44, 20], [16, 32], [-22, 36], [-46, 28]]);
  f.part(fox, FUR({ fill: '#f2f2f0', tex: furTex, texOp: 0.3, maxShade: 10 }));
  clipDraw(f, fox, () => { softTone(f, E.smooth(fox), [[FX([[-60, 10], [110, 6], [110, 40], [-60, 40]]), PAL.furS, 0.45, 6]]); f.line(FX([[40, -20], [46, -8], [44, 6]]), 1.4, PAL.furD, { op: 0.6 }); }); // the stop
  f.part(FX([[-16, -34], [-32, -82], [-2, -38]]), FUR({ cast: false, inkW: 1.1 })); f.flat(FX([[-16, -40], [-26, -72], [-8, -42]]), '#5a5e66', { op: 0.8 }); // the near ear, its dark inside
  f.flat(FX(ell([102, 1], 6, 5, 0, 8)), '#1c1c20'); f.line(FX([[60, 12], [96, 8]]), 1.2, INK, { op: 0.8 }); // the black nose, the lip line
  f.line(FX([[8, -16], [30, -14]]), 1.6, INK); f.stitches(FX([[6, -18], [32, -16]]), PAL.greyD, 0.8); // the eye sewn shut
  forkHanks(f, X, FX([[-50, 20], [-30, 34], [0, 34]]), 3, 14, 26, 10, 14, { ice: 0.4, fade: false }); // the cheek ruff
  X.icicle(FX([[70, 16]])[0], 14, 4);

  f.bone('forearm_n'); cuff(f, X, EN, lerp(EN, WN, 0.8), 96, 0.06, furTex);
  X.rime([lp(EN, WN, 0.1, 50), lp(EN, WN, 0.7, 48)], 8, 1);
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, deg(-90), 52, PAL.hide, { tex: 'mottle' + sd, texOp: 0.45, shadow: PAL.hideS, name: 'chief belt', inline: true });
  fistDetail(f, gN, 52, PAL.hide, { nail: PAL.hide });
  for (const q of [[-0.5, -0.3], [-0.5, 0.3]]) f.part(gN.F([ [q[0] - 0.12, q[1] - 0.05], [q[0] + 0.12, q[1] - 0.05], [q[0] + 0.12, q[1] + 0.05], [q[0] - 0.12, q[1] + 0.05] ]), BONE({ inkW: 0.9 })); // ivory toggles on the mitten's cuff
  f.bone('torso'); X.rime([add(SN, [-30, -30]), add(SN, [20, -50]), add(SN, [70, -40])], 12, -1);

  // ---- the baton of walrus ivory, carved with tally marks, pointing
  f.bone('baton');
  const b0 = add(WF, rot([-40, 0], deg(-24)));
  f.part(limb(b0, BTIP, 22, 16, { steps: 10 }), BONE({ fill: '#e6e0d0', inkW: 1.6, tex: 'mottle' + sd, texOp: 0.4, maxShade: 6 }));
  for (let i = 0; i < 12; i++) f.line([lp(b0, BTIP, 0.3 + i * 0.05, -8), lp(b0, BTIP, 0.31 + i * 0.05, 8)], 1.2, INK, { op: 0.8 });
  f.part(ell(BTIP, 14, 12, deg(-24), 12), BONE({ fill: '#d6d0c0' })); f.line([lp(b0, BTIP, 0.2, -2), lp(b0, BTIP, 0.95, -4)], 1.2, '#ffffff', { op: 0.8 });
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, ang(WF, BTIP), 50, PAL.hide, { tex: 'mottle' + sd, texOp: 0.45, shadow: PAL.hideS, name: 'chief baton', inline: true });
  fistDetail(f, gF, 50, PAL.hide, { nail: PAL.hide });
  X.icicles([add(WF, [-30, 30]), add(WF, [20, 34])], 3, 30, 6); // icicles from the baton hand

  f.bone('foot_n'); snowLip(f, [AN[0] + 40, GY + 3], 140, 8);
  f.bone('foot_f'); snowLip(f, [AF[0] + 40, GY + 3], 130, 8);
  return f;
}

// a knotted, frost-split old hand gripping something: B.grip plus swollen knuckles, split skin, ridged nails, bitten tips
function oldFist(f, X, c, elbow, thumbAng, s, sd, o = {}) {
  const g = B.grip(f, c, elbow, thumbAng, s, PAL.skin, Object.assign({ tex: 'mottle' + sd, texOp: 0.5, shadow: PAL.skinS }, o));
  fistDetail(f, g, s, PAL.skin, {});
  for (let i = 0; i < 4; i++) { const y = -0.45 + i * 0.3; f.part(g.F(ell([0.36, y], 0.12, 0.13, 0, 10)), { fill: mix(PAL.skin, PAL.bite, 0.25), shadow: PAL.skinS, shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(g.F(ell([0.4, y - 0.03], 0.04, 0.03, 0, 6)), '#ffffff', { op: 0.6 }); } // the swollen knuckles
  for (let i = 0; i < 3; i++) { const y = -0.3 + i * 0.3; f.line(g.F([[0.1, y], [0.2, y + 0.05], [0.28, y + 0.02]]), 1.4, '#1a1a20', { op: 0.85 }); f.line(g.F([[0.1, y - 0.02], [0.2, y + 0.03]]), 0.9, '#ffffff', { op: 0.7 }); } // frost-split skin across the back of the hand
  for (let i = 0; i < 3; i++) f.line(g.F([[-0.5, -0.4 + i * 0.25], [-0.1, -0.35 + i * 0.25], [0.2, -0.38 + i * 0.25]]), 1.6, PAL.skinS, { op: 0.55 }); // the tendons and veins standing out
  X.bite(g.F([[0.5, 0]])[0], s * 0.3, s * 0.2, 5, 0.5);
  return g;
}

// ------------------------------------------------------------------ THE HEARTH GRANDMOTHER (Ruler 3)
// The clan's eldest woman, keeper of the winter fire and sewer of every coat in the camp. Seated cross-legged before the
// dead hearth, bent over her sewing, huge and round-backed under heaped hides; her humped back and hood rise out of the
// frame top; her bent head is in frame; her weight settles low and wide. Knotted, frost-split hands, skin white with
// rime; drifted snow heaped on the back; icicles from her chin, her nose and the edges of the hides. The void has taken
// her ears, leaving clean round holes; she casts no shadow. Where her hearth fire burned there is a round black hole in
// the ground, ringed by the hearth stones; the cooking pot is frozen to its tripod over it.
// Coats of hide layered fur-out over fur-in, every edge sewn with bone beads; a hide mask half sewn in her lap (a face cut
// from white skin, a slit for a mouth), held in her far hand with a bone thimble on the finger; a bone needle as long as a
// spear raised in her near fist, threaded with sinew that runs down to the mask; a hide needle case and an ulu knife at
// her belt; a cord over one shoulder strung with a dozen finished masks, no two alike; strips of cut hide draped over one
// knee; a sinew spool; a bone comb in her hair; the snow round her trampled flat by the faceless who come to be fitted.
// Broad flat old face, deep wrinkles, eyes nearly shut, the mouth working without sound; two grey braids frozen stiff;
// the hood pushed back onto the hump.
// Rig (the Motion line: the long pull of sinew with the needle arm rising; the stitch, the needle darting out): pelvis
// (root, the seated mass) > torso > head > braid_n, braid_f; upperarm_n > forearm_n > hand_n > needle > thread;
// upperarm_f > forearm_f > hand_f > mask; masks (torso); hood (torso); root: the hearth, the tripod, the pot.
function hearthGrandmother() {
  const CW = 2000, CH = TIERS.ruler[1], GY = CH - 30, sd = 1221;
  const f = new Fig(base(sd, CH, { grimeY: GY - 200 }));
  const X = fx(f, 2.4), furTex = X.hairTex(90);
  const H = 330;
  const P = [820, 1300], C = [640, 760], N = [1060, 560]; // the back rounds up into a great hump, the neck comes forward out of it
  const S = B.spine(N, C, P, H);
  const hA = 0.46, HC = [1170, 610], hF = frame(HC, hA, H); // the head bent down over the work
  const SN = [1010, 890], EN = [1410, 1060], WN = [1540, 660]; // the needle arm: the elbow forward and low, the fist raised in front of her, clear of the face
  const SF = [940, 760], EF = [1060, 1120], WF = [1170, 1250]; // the far hand in the lap, holding the mask by its edge
  const NDL0 = [1600, 720], NDL1 = [1060, 40]; // the needle angled back over her head, square across the raised fist // the needle: the eye end below the fist, the point raised out of the frame
  const MASK = [1300, 1230];
  f.joint('pelvis', P).joint('torso', [820, 1100], 'pelvis').joint('head', [1080, 600], 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n').joint('needle', WN, 'hand_n').joint('thread', NDL0, 'needle');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('mask', MASK, 'hand_f');
  f.joint('braid_n', hF([[-0.2, 0.1]])[0], 'head').joint('braid_f', hF([[0.0, -0.2]])[0], 'head').joint('masks', [900, 300], 'torso').joint('hood', [1060, 480], 'torso');
  const OUT = (o = {}) => FUR(Object.assign({ tex: furTex, texOp: 0.22 }, o)); // the outer coat, fur out
  const INN = (o = {}) => HIDE(Object.assign({ fill: '#d6d4cc', tex: 'mottle' + sd, texOp: 0.45 }, o)); // the inner coat, skin out

  // ---- the ground: trampled flat, crossed with the prints of the faceless who come to be fitted
  f.bone('root');
  const pr = []; for (let i = 0; i < 16; i++) pr.push([200 + i * 108 + (f.r() - 0.5) * 40, 16 + f.r() * 8]);
  snowGround(f, 40, 1990, GY, { depth: 40, prints: pr });
  // the dead hearth: a round black hole in the ground where the fire burned, ringed by the hearth stones
  const HH = [1690, GY + 12];
  const hr = ell(HH, 150, 30, 0, 48); f.flat(hr, PAL.void); f.line(hr.concat([hr[0]]), 2.4, INK); f.line(ell(HH, 155, 33, 0, 48).slice(26, 46), 1.6, '#ffffff', { op: 0.9 });
  // the tripod and the pot frozen to it; drawn before the stones in front
  const apex = [1700, 1020];
  for (const [b0, tone] of [[[1840, GY + 6], 0.3], [[1560, GY + 4], 0.1]]) { f.part(limb(b0, apex, 16, 11, { steps: 10 }), { fill: mix(PAL.wood, '#000', tone), shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood' + sd, inkW: 1.4 }); X.icicles([lerp(b0, apex, 0.5), lerp(b0, apex, 0.8)], 2, 26, 5); }
  rope(f, [add(apex, [-16, 6]), add(apex, [16, 4]), add(apex, [-12, 20]), add(apex, [14, 18])], 4, PAL.greyD);
  cord(f, [add(apex, [0, 16]), [1700, 1230]], 2.4);
  const pot = [1700, 1300];
  const potS = [add(pot, [-86, -60]), add(pot, [86, -66]), add(pot, [98, 0]), add(pot, [76, 60]), add(pot, [0, 76]), add(pot, [-76, 60]), add(pot, [-98, 0])];
  f.part(potS, { fill: PAL.iron, shadow: PAL.ironD, light: '#8a8e92', shade: 0.4, tex: 'mottle' + sd, texOp: 0.6, inkW: 2 });
  clipDraw(f, potS, () => { f.line([add(pot, [-70, -20]), add(pot, [-60, 40])], 2, '#a8acb0', { op: 0.6 }); X.frost(pot, 70, 40, 20, 2); });
  f.part(ell(add(pot, [0, -62]), 88, 14, -0.03, 20), { fill: '#d8dcde', shadow: PAL.iceS, shade: 0.3, inkW: 1.8, cast: false, hatch: false }); // the pot's contents, frozen white
  f.line([add(pot, [-86, -60]), add(pot, [-40, -100]), add(pot, [0, -110]), add(pot, [40, -100]), add(pot, [86, -66])], 4, PAL.greyD); // the bail
  X.icicles([add(pot, [-76, 60]), add(pot, [0, 76]), add(pot, [76, 60])], 6, 70, 10); // the pot frozen to its tripod: ice hanging from it toward the hole
  X.rime([add(pot, [-80, -66]), add(pot, [0, -74]), add(pot, [80, -70])], 10, -1);
  f.part(limb([1700, GY - 2], apex, 18, 12, { steps: 10 }), { fill: PAL.wood, shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood' + sd, inkW: 1.4 }); // the front leg of the tripod
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, q = add(HH, [Math.cos(a) * 176, Math.sin(a) * 40]); if (Math.sin(a) < -0.3) continue; f.part(ell(q, 34 + f.r() * 14, 18 + f.r() * 6, 0, 12).map(v => add(v, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 4])), { fill: '#9a9ea2', shadow: '#4a4c52', light: '#c8cccf', shade: 0.4, inkW: 1.4, cast: false, tex: 'mottle' + sd, texOp: 0.6 }); X.rime([add(q, [-30, -12]), add(q, [0, -18]), add(q, [30, -12])], 5, -1); } // the hearth stones
  // the sinew spool on the snow by her knee
  const sp = [1500, GY - 10]; f.part(ell(sp, 26, 30, 0, 14), BONE({ fill: '#d4cfc2' })); for (let i = 0; i < 6; i++) f.line([add(sp, [-20, -20 + i * 8]), add(sp, [20, -24 + i * 8])], 1.4, PAL.greyD, { op: 0.8 }); f.part(ell(add(sp, [16, 0]), 6, 28, 0, 10), BONE({ fill: '#c8c3b6' }));

  // ---- the cord of finished masks over the far shoulder, hanging down her back: a dozen faces, no two alike
  f.bone('masks');
  const mc = spline([[1100, 440], [900, 90], [620, 170], [400, 400], [300, 700], [290, 1000], [330, 1260]], 10); // over the far shoulder and down the back
  cord(f, mc, 3);
  const maskFace = (c, a, sc, k) => {
    const F2 = frame(c, a, sc), sh = [[-0.36, -0.5], [0, -0.58], [0.36, -0.48], [0.42, 0.0], [0.3, 0.46], [0, 0.6], [-0.3, 0.46], [-0.42, 0.0]].map(q => [q[0] * (1 + (k % 3) * 0.1), q[1] * (1 + ((k + 1) % 2) * 0.12)]);
    f.part(F2(sh), HIDE({ fill: k % 4 === 1 ? '#c8c8c2' : '#ecebe4', inkW: 1.4, cast: false, shade: 0.3, maxShade: 6 }));
    // eye slits (each mask cut differently), a mouth slit, stitching, a tuft of fur at the brow on some
    const ey = (k % 3 === 0) ? [[-0.16, -0.1], [0.16, -0.1]] : (k % 3 === 1) ? [[-0.18, -0.16], [0.14, -0.06]] : [[-0.14, -0.04], [0.18, -0.14]];
    for (const e of ey) f.flat(F2([[e[0] - 0.1, e[1]], [e[0], e[1] - 0.03 - (k % 2) * 0.02], [e[0] + 0.1, e[1]], [e[0], e[1] + 0.02]]), '#141416');
    f.flat(F2([[-0.18 - (k % 2) * 0.06, 0.28], [0.2, 0.26 + (k % 3) * 0.02], [0.18, 0.3], [-0.16, 0.32]]), '#141416');
    f.stitches(F2([[-0.38, 0.0], [-0.3, 0.4], [0, 0.56]]), PAL.hideD, 1);
    if (k % 4 === 2) for (let i = 0; i < 3; i++) f.line(F2([[-0.1 + i * 0.1, 0.1], [-0.12 + i * 0.1, 0.22]]), 1.2, '#141416'); // tattoo lines sewn on
    if (k % 4 === 3) f.part(F2([[-0.3, -0.5], [0.3, -0.52], [0.2, -0.66], [-0.2, -0.66]]), FUR({ inkW: 1, cast: false })); // a fur brow
    X.icicle(F2([[0.1, 0.58]])[0], 14 * sc / 60, 4);
  };
  for (let k = 0; k < 8; k++) { const q = add(mc[Math.round((0.3 + k * 0.088) * (mc.length - 1))], [-30, 0]); cord(f, [q, add(q, [0, 20])], 1.4); maskFace(add(q, [0, 20 + 40]), (f.r() - 0.5) * 0.4, 70 + (k % 3) * 8, k); }

  // ---- the far arm down into the lap (behind the body's front)
  limb3(f, SF, EF, lerp(EF, WF, 0.86), [200, 170, 150], OUT({ fill: mix(PAL.fur, PAL.furS, 0.3), maxShade: 40 }), ['upperarm_f', 'forearm_f'], { point: 0.3, mus0: 0.14, mus1: 0.2 });

  // ---- the seated mass: the crossed legs under the coats, the knees wide, the hems pooled on the snow
  f.bone('pelvis');
  const lap = [[480, 1300], [560, 1200], [760, 1160], [1000, 1180], [1200, 1230], [1380, 1300], [1470, 1380], [1490, 1470], [1440, GY - 4], [1200, GY + 4], [900, GY + 2], [620, GY - 4], [470, GY - 20], [430, 1440]];
  f.part(lap, INN({ maxShade: 50 }));
  clipDraw(f, lap, () => {
    softTone(f, E.smooth(lap), [[[[420, 1260], [700, 1260], [700, GY], [420, GY]], PAL.hideS, 0.55, 30], [[[1100, 1240], [1460, 1300], [1460, 1400], [1100, 1340]], '#ffffff', 0.45, 24]]);
    // the knees: the near one forward and high, the far one behind; the shins crossed under the hem
    crease(f, [[1180, 1240], [1300, 1290], [1420, 1340], [1470, 1420]], 5, { col: PAL.hideD, op: 0.5 });
    folds(f, [[[700, 1240], [760, 1380], [740, 1520]], [[900, 1220], [940, 1360], [920, 1540]], [[1060, 1240], [1120, 1380], [1100, 1540]], [[1280, 1340], [1320, 1440], [1300, 1550]], [[560, 1300], [540, 1440], [520, 1540]]], 9);
    beadBand(f, [[470, GY - 30], [700, GY - 22], [1000, GY - 14], [1300, GY - 18], [1460, GY - 30]], 18, { pattern: i => i % 3 !== 1 });
    for (let i = 0; i < 10; i++) f.flat(ell([520 + f.r() * 900, 1300 + f.r() * 220], 10 + f.r() * 18, 5 + f.r() * 6, f.r(), 8), PAL.hideD, { op: 0.3 }); // old stains, soot from the fire that was
  });
  // the boots crossed in front, their soles turned up, peeking from under the hem
  for (const [c, a0, tone] of [[[1180, GY - 40], 0.25, 0.1], [[980, GY - 30], -0.15, 0.3]]) { const F2 = frame(c, a0, 1); f.part(F2([[-110, -40], [60, -50], [130, -20], [140, 20], [100, 44], [-110, 40]]), OUT({ fill: mix(PAL.fur, PAL.furS, tone) })); f.part(F2([[60, -50], [130, -20], [140, 20], [100, 44], [80, 0]]), { fill: '#3a3c40', shadow: '#121216', shade: 0.3, inkW: 1.2, cast: false }); beadBand(f, F2([[-100, -30], [-20, -42], [50, -44]]), 14); }
  // strips of cut hide draped over the near knee, hanging plumb
  for (let i = 0; i < 5; i++) { const x = 1300 + i * 30, y0 = 1290 + i * 14, l = 160 + f.r() * 110, w2 = 18 + f.r() * 12; f.part([[x, y0], [x + w2, y0 + 4], [x + w2 + 4, y0 + l * 0.6], [x + w2 - 2, y0 + l], [x + 2, y0 + l - 6], [x - 4, y0 + l * 0.5]], HIDE({ fill: i % 2 ? '#e6e4dc' : '#cfcdc5', inkW: 1.3, cast: false, maxShade: 6 })); X.icicle([x + w2 / 2, y0 + l - 2], 20, 5); }
  // ---- the body under the heaped hides (independent review rebuild: it read as a tall white vase). The great hunched
  // back: from the hips up a broad round back to the hump behind the neck (its top just cut by the frame), then down at
  // the front onto the shoulders, where the neck leaves it and the head hangs forward over the work. The spine stands as
  // a ridge of knuckled vertebrae under the hides; the near shoulder blade rides on the upper back; the near shoulder is
  // a round mass where the needle arm leaves. The hides are draped over the back from the spine, their hems following
  // the curve (lower at the back, rising toward the shoulders), each fringed with forked hanks; folds run down from the
  // spine; snow is heaped on the windward top of the hump.
  f.bone('torso');
  const tor = [[440, 1330], [372, 1160], [330, 960], [318, 760], [344, 580], [410, 410], [510, 270], [630, 150], [760, 60], [880, 8], [980, 8], [1060, 60], [1120, 150], [1166, 270], [1192, 390], [1196, 480], [1170, 580], [1160, 700], [1186, 880], [1236, 1040], [1270, 1180], [1100, 1240], [900, 1270], [700, 1320]]; // the hump peaks behind the shoulders and slopes forward into the nape, where the head hangs
  // the spine's knuckles push the back's outline up in small bumps
  { const C2 = spline(tor.concat([tor[0]]), 14); tor.length = 0; C2.forEach(q => { const back = q[0] < 1100 && q[1] < 900 && (q[0] < 520 || q[1] < 420); const k = back ? Math.max(0, Math.sin((q[0] + q[1]) * 0.07)) * 13 : 0, c0 = [760, 760], d = E.norm(sub(q, c0)), blade = 40 * Math.exp(-(((q[0] - 470) ** 2 + (q[1] - 380) ** 2) / (2 * 80 * 80))), hip = 22 * Math.exp(-(((q[0] - 340) ** 2 + (q[1] - 900) ** 2) / (2 * 90 * 90))); tor.push(add(q, mul(d, k + blade + hip + f.r() * 3))); }); }
  const spineL = [[1150, 470], [1130, 330], [1070, 190], [980, 90], [850, 80], [720, 140], [600, 250], [490, 400], [420, 580], [390, 800], [392, 1010], [430, 1200]];
  f.part(tor, OUT({ maxShade: 80 }));
  X.furField(tor, 260, 70, { dir: p => [p[0] < 600 ? -0.3 : 0.1, 1], w: 5.5 });
  clipDraw(f, tor, () => {
    // value plan: the top of the hump and the shoulders lit, the back's leeward side and the underside of the hump dark
    softTone(f, E.smooth(tor), [[[[300, 520], [560, 560], [600, 1340], [300, 1340]], PAL.furS, 0.65, 60], [[[560, 60], [1000, 0], [1120, 200], [1000, 320], [700, 300], [520, 330]], '#ffffff', 0.6, 50], [[[1040, 760], [1300, 900], [1300, 1250], [980, 1250]], PAL.furS, 0.45, 40], [[[640, 840], [1000, 820], [1040, 1200], [640, 1200]], PAL.furS, 0.3, 60]]);
    // the near shoulder blade riding on the upper back: a lit plane, its lower edge in shadow
    // (ruler pass) both shoulder blades push through the hides: the near one a lit plane on the upper back with a hard
    // lower edge and the hide pulled into tension folds off its point; the far one on the back's slope, its spine edge lit
    softTone(f, E.smooth(tor), [[[[640, 300], [860, 250], [960, 420], [860, 600], [680, 520]], '#ffffff', 0.55, 22], [[[860, 600], [700, 540], [620, 640], [760, 700]], PAL.furD, 0.55, 20], [[[420, 300], [560, 300], [600, 470], [470, 520], [400, 440]], '#ffffff', 0.4, 20], [[[400, 470], [600, 500], [560, 600], [400, 580]], PAL.furD, 0.5, 20]]);
    crease(f, [[960, 420], [900, 520], [840, 600], [720, 560], [660, 500]], 11, { col: PAL.furD, op: 0.6 }); // the near blade's lower edge
    crease(f, [[600, 470], [540, 540], [450, 560]], 10, { col: PAL.furD, op: 0.55 }); // the far blade's lower edge
    for (const [a, b2] of [[[860, 600], [930, 760]], [[840, 610], [800, 790]], [[700, 540], [640, 700]], [[470, 560], [430, 700]]]) crease(f, [a, lerp(a, b2, 0.5), b2], 7, { col: PAL.furD, op: 0.45 }); // tension folds pulled off the blades' points
    // the near shoulder: a round mass in front of the blade where the arm leaves
    crease(f, [[960, 640], [1010, 760], [1090, 820]], 8, { col: PAL.furD, op: 0.45 });
    // folds running down off the spine, between the hides' hems
    folds(f, [[[520, 420], [470, 560], [450, 720]], [[640, 300], [620, 460], [640, 600]], [[790, 180], [800, 300], [840, 380]], [[420, 860], [410, 980], [430, 1100]], [[560, 900], [560, 1040], [600, 1140]]], 10, PAL.furS, 0.5);
    // the heaped hides: three coats draped from the spine, each hem fringed and sewn with bone beads, lower at the back
    // and rising toward the shoulders (they follow the hunch); drawn lowest first so each hem covers the roots below
    for (const [e, tone, n] of [[[[350, 1060], [520, 1110], [720, 1060], [900, 980], [1060, 900], [1190, 860]], 0.14, 9], [[[330, 820], [480, 860], [640, 780], [800, 660], [960, 560], [1110, 520]], 0.08, 9], [[[400, 520], [540, 500], [680, 400], [820, 290], [960, 220], [1090, 230]], 0.0, 8]]) {
      const C2 = spline(e, 6); f.stroke(C2.map(q => add(q, [0, 12])), 26, PAL.furD, { op: 0.45 });
      forkHanks(f, X, e, n, 50, 140, 26, 46, { ice: 0.35, tone, fade: false, jit: 2.2 });
      { const T2 = spline(e, 6); f.part(ribbon(T2, T2.map((_, j) => 30 + 8 * Math.sin(j * 0.7))), OUT({ fill: mix(PAL.fur, PAL.furS, tone + 0.06), maxShade: 10, cast: true, castOp: 0.5 })); // (ruler pass) the hide's edge rolled in a band of fur trim
        for (let j = 1; j < T2.length - 1; j += 2) f.line([add(T2[j], [-6, -10]), add(T2[j], [2, 4]), add(T2[j], [-2, 14])], 1.6, PAL.furD, { op: 0.5 });
        const sn = T2.filter((_, j) => j % 1 === 0).map((q, j) => add(q, [0, -18 - 6 * Math.sin(j * 1.3)])), sb = T2.map(q => add(q, [0, -8])).reverse();
        f.part([...sn.slice(1, -2), ...sb.slice(2, -1)], { fill: PAL.snow, shadow: PAL.snowS, light: '#ffffff', shade: 0.2, maxShade: 6, inkW: 1.3, cast: false, hatch: false, tex: X.icetex, texOp: 0.3 }); } // snow lying along the trim's top, as on a ledge
      beadString(f, e.slice(2, 4), 6, 8); // a short run of the bead-sewn hem showing between the hanks
    }
    // the spine ridge: knuckled vertebrae standing under the hides, each lit on top with a shadow below
    { const C2 = spline(spineL, 6), Sl = arcLen(C2), Lt = Sl[Sl.length - 1];
      f.stroke(C2.map(q => add(q, [-10, 12])), 18, PAL.furD, { op: 0.35 });
      for (let k = 0; k < 10; k++) { const u = (k + 0.5 + (f.r() - 0.5) * 0.3) / 10 * Lt; let i = Sl.findIndex(v => v >= u); if (i < 0) i = C2.length - 1; const q = C2[i], qa = C2[Math.max(0, i - 1)], qb = C2[Math.min(C2.length - 1, i + 1)], a0 = Math.atan2(qb[1] - qa[1], qb[0] - qa[0]); softTone(f, E.smooth(tor), [[ell(add(q, [-10, 16]), 40, 22, a0, 12), PAL.furD, 0.45, 8], [ell(q, 34, 18, a0, 12), '#ffffff', 0.4, 8]]); } } // each knuckle a soft lit bump with its shadow below
    // seams and old patches, sewn with sinew
    f.stitches([[700, 200], [720, 330], [760, 430]], PAL.hideD, 1.6); f.stitches([[520, 640], [500, 820]], PAL.hideD, 1.6);
    const pt = [[700, 920], [820, 900], [840, 1000], [710, 1020]]; f.part(pt, INN({ fill: '#c8c6be', inkW: 1.4, cast: false })); f.stitches([...pt, pt[0]], PAL.hideD, 1.2);
    // (ruler pass) the hides as panels: the seams between skins run down from the spine, each a raised welt laced with a
    // thong through punched holes; one panel turned skin-out, paler, among the fur; snow lodged in the deepest folds
    f.flat([[560, 600], [680, 640], [700, 790], [600, 860], [500, 820], [470, 700]], '#ffffff', { op: 0.16 });
    f.flat([[330, 900], [460, 880], [520, 1000], [380, 1080]], PAL.furD, { op: 0.14 });
    for (const sm of [[[700, 640], [690, 760], [660, 860]], [[470, 600], [440, 720], [430, 820]], [[560, 870], [600, 960], [640, 1060]], [[960, 640], [1000, 760], [1040, 880]]]) {
      const C2 = spline(sm, 8); f.stroke(C2.map(q => add(q, [8, 6])), 12, PAL.furD, { op: 0.4 }); f.line(C2, 5, mix(PAL.fur, '#ffffff', 0.4), { op: 0.8 }); // the welt and its shadow
      for (let j = 0; j < C2.length - 1; j += 2) { const a = C2[j], b2 = C2[j + 1], d = E.norm(sub(b2, a)), n2 = [-d[1], d[0]], L1 = add(a, mul(n2, 12)), R1 = add(lerp(a, b2, 0.5), mul(n2, -12)), L2 = add(b2, mul(n2, 12)); f.line([L1, R1, L2], 2.2, '#8a847a', { op: 0.7 }); f.line([L1, R1], 1, '#d8d2c4', { op: 0.5 }); for (const h of [L1, R1]) f.flat(ell(h, 3, 3, 0, 6), '#1a1a1e'); } // the lacing thong
    }
    for (const sp of [[[452, 720], [478, 760], [470, 800]], [[640, 640], [662, 690], [652, 730]], [[810, 680], [830, 720]], [[420, 960], [440, 1010]]]) { f.line(sp, 9, PAL.snow); f.line(sp.map(q => add(q, [2, 4])), 2, PAL.snowS, { op: 0.7 }); } // snow lodged in the folds
  });
  // (ruler pass) the hides' ends overlap at the back like shingles: each skin's lower edge stands proud of the one below,
  // with its own thickness, fur trim and frozen hanks, so the back's outline steps instead of running as one smooth dome
  for (const [fl, tone] of [[[[340, 860], [306, 940], [290, 1040], [318, 1096], [372, 1084], [366, 980]], 0.16], [[[372, 560], [318, 640], [286, 760], [292, 858], [346, 866], [356, 760], [380, 640]], 0.1], [[[480, 300], [424, 326], [372, 420], [346, 524], [382, 552], [446, 536], [466, 420]], 0.04]]) {
    f.part(fl, OUT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 26, castOp: 0.55 }));
    clipDraw(f, fl, () => { X.furField(fl, 26, 40, { dir: () => [-0.2, 1], w: 4.5 }); f.flat(fl.map(q => add(q, [26, -10])), PAL.furD, { op: 0.25 }); });
    const lo = [fl[fl.length - 1], fl[fl.length - 2], fl[fl.length - 3]].sort((a, b) => a[0] - b[0]);
    f.line([fl[2], fl[3], fl[4]], 6, mix(PAL.fur, '#ffffff', 0.5), { op: 0.5 }); // the skin's thick edge catching light
    forkHanks(f, X, [fl[3], fl[4], lerp(fl[4], fl[5], 0.6)], 3, 40, 90, 24, 34, { ice: 0.6, tone: tone + 0.1 });
  }
  // the outline broken by the hides' frozen edges: hanks off the back and down the front
  forkHanks(f, X, [[330, 600], [314, 800], [330, 1000], [380, 1180]], 7, 40, 100, 26, 36, { ice: 0.6, tone: 0.2 });
  forkHanks(f, X, [[1150, 740], [1190, 900], [1240, 1060]], 5, 50, 110, 26, 36, { ice: 0.6 });
  // snow heaped on the windward top of the hump, lumpy, lit, icicles hanging off its edge
  // (ruler pass) the snow lies in separate heaps where the hides fold (on the spine's ledge, in the hollow behind the
  // shoulder), not as one smooth cap that echoes the dome
  const drift = [[600, 190], [660, 120], [740, 66], [820, 40], [880, 44], [900, 80], [860, 120], [780, 140], [700, 190], [640, 220]];
  { const d2 = [[960, 40], [1030, 30], [1090, 80], [1140, 170], [1172, 262], [1144, 276], [1100, 210], [1040, 150], [980, 110], [944, 76]]; f.part(d2, { fill: PAL.snow, shadow: PAL.snowS, light: '#ffffff', shade: 0.2, maxShade: 14, inkW: 1.8, cast: false, hatch: false, tex: X.icetex, texOp: 0.3 }); X.icicles([[980, 110], [1100, 210], [1144, 276]], 4, 60, 9); }
  f.part(drift, { fill: PAL.snow, shadow: PAL.snowS, light: '#ffffff', shade: 0.2, maxShade: 16, inkW: 1.8, cast: false, hatch: false, tex: X.icetex, texOp: 0.3 });
  clipDraw(f, drift, () => { for (let i = 0; i < 6; i++) { const q = [700 + i * 64, 120 - Math.sin(i * 0.6) * 60]; f.line([q, add(q, [40, -10]), add(q, [80, -6])], 1.6, PAL.snowD, { op: 0.6 }); } });
  X.icicles([[640, 220], [780, 140], [880, 100]], 4, 70, 10);
  X.rime([[1170, 290], [1194, 390], [1196, 480]], 14, -1);
  // the inner coat's edge showing at the front of the neck and the breast, skin out, beaded
  const inner = [[1080, 600], [1150, 680], [1180, 820], [1220, 980], [1170, 1000], [1120, 860], [1070, 700]];
  f.part(inner, INN({ maxShade: 20 }));
  beadString(f, [[1090, 620], [1150, 720], [1180, 860], [1210, 970]], 6, 16);
  // the belt: the needle case and the ulu hang from it
  f.bone('pelvis');
  const bl = [[420, 1180], [700, 1220], [1000, 1214], [1250, 1180], [1260, 1222], [1000, 1258], [700, 1262], [420, 1226]];
  f.part(bl, { fill: '#5a5c60', shadow: '#141418', shade: 0.35, inkW: 1.6, tex: 'hatch' + sd, texOp: 0.4, k: 0.6 });
  const nc = [560, 1240]; cord(f, [nc, add(nc, [4, 30])], 2); f.part([add(nc, [-20, 26]), add(nc, [24, 24]), add(nc, [26, 140]), add(nc, [4, 160]), add(nc, [-18, 140])], HIDE({ fill: '#c4c4be', inkW: 1.4 })); beadBand(f, [add(nc, [-16, 40]), add(nc, [22, 38])], 10); f.stitches([add(nc, [2, 50]), add(nc, [4, 150])], PAL.hideD, 1);
  const ul = [800, 1250]; cord(f, [ul, add(ul, [-4, 20])], 2);
  f.part([add(ul, [-40, 60]), add(ul, [40, 56]), add(ul, [56, 90]), add(ul, [0, 104]), add(ul, [-56, 92])], { fill: '#8a8e94', shadow: '#3a3c42', light: '#d0d4d8', shade: 0.35, inkW: 1.4, cast: false }); // the ulu's crescent blade
  f.line([add(ul, [-52, 92]), add(ul, [0, 102]), add(ul, [52, 90])], 1.6, '#e8eaec', { op: 0.8 });
  f.part([add(ul, [-30, 20]), add(ul, [30, 18]), add(ul, [32, 40]), add(ul, [-30, 42])], BONE()); f.line([add(ul, [-14, 40]), add(ul, [-20, 60])], 5, PAL.boneS); f.line([add(ul, [14, 40]), add(ul, [20, 58])], 5, PAL.boneS);

  // ---- the hood pushed back onto the hump behind the head, its ruff stiff
  f.bone('hood');
  // (ruler pass) the hood is a real mass of hide: its fur-trimmed opening at the nape behind the head, its crown lying
  // back over the hump and running into the back, its tip hanging down the slope; folds from the opening to the crown,
  // snow in them
  const hd = [[1150, 650], [1200, 560], [1200, 450], [1160, 350], [1090, 260], [1000, 190], [900, 150], [800, 160], [720, 210], [650, 290], [640, 360], [690, 380], [760, 400], [850, 440], [940, 500], [1020, 560], [1080, 620], [1110, 650]]; // the crown lies back over the hump, the tip hangs down the slope
  f.flat(hd.map(q => add(q, [-14, 18])), PAL.furD, { op: 0.35 }); // its shadow on the back
  f.part(hd, OUT({ fill: mix(PAL.fur, PAL.furS, 0.05), maxShade: 40 }));
  clipDraw(f, hd, () => {
    X.furField(hd, 70, 50, { dir: () => [-0.3, 1], w: 4.5 });
    softTone(f, E.smooth(hd), [[[[760, 160], [1000, 180], [1150, 340], [1000, 300], [820, 240]], '#ffffff', 0.5, 20], [[[660, 340], [860, 420], [1020, 540], [1100, 650], [1000, 600], [820, 470], [650, 380]], PAL.furD, 0.6, 22]]);
    folds(f, [[[1120, 420], [1040, 330], [930, 260]], [[1100, 520], [1010, 430], [880, 360]], [[1110, 610], [1020, 520], [900, 440]], [[860, 210], [780, 260], [700, 330]], [[960, 300], [860, 330], [760, 360]]], 9, PAL.furS, 0.6);
    for (const sp of [[[1030, 320], [960, 270], [900, 245]], [[1010, 410], [950, 360]]]) { f.line(sp, 8, PAL.snow); f.line(sp.map(q => add(q, [2, 4])), 2, PAL.snowS, { op: 0.7 }); } // snow lying in the hood's folds
    f.stitches([[1000, 190], [960, 240], [940, 300]], PAL.hideD, 1.4); // the hood's back seam
  });
  forkHanks(f, X, [[1200, 640], [1206, 540], [1196, 440], [1160, 360]], 6, 40, 80, 24, 32, { ice: 0.5 }); // the ruff round the opening, frozen stiff
  forkHanks(f, X, [[650, 360], [760, 400], [880, 460], [1000, 550]], 6, 50, 100, 26, 36, { ice: 0.6, tone: 0.25 }); // the fur trim along the hood's lower edge, frozen
  X.rime([[900, 152], [1000, 190], [1090, 262]], 10, 1);

  // ---- the head: broad, flat, old; bent over the work; eyes nearly shut; the mouth working without a sound
  f.bone('braid_f');
  braid(f, X, [hF([[0.0, -0.2]])[0], add(hF([[0.0, -0.2]])[0], [40, 160]), add(hF([[0.0, -0.2]])[0], [60, 340])], 46, { ties: [0.3, 0.7], fill: '#a8aaae' }); // the far braid, frozen stiff, falling past the face
  f.bone('head');
  f.part(limb([1080, 600], hF([[-0.05, 0.36]])[0], 230, 200), SKIN(sd));
  face(f, X, HC, H, hA, { jaw: 1.36, chin: -0.02, nose: 1.08, hook: 0.2, squint: 0.92, browDown: 0.04, age: true, gaunt: false, wrinkles: 1, faceShade: 0.8, ear: 'none', hairCol: '#a8aaae', browCol: '#e8eaec', mouthOpen: { x: 0.24, y: 0.33, w: 0.06, h: 0.035 } });
  // more age: pouches under the eyes, the cheek's heavy fold, the lips drawn in over few teeth, the chin's dimpled pad
  crease(f, hF([[0.03, 0.03], [0.12, 0.07], [0.2, 0.04]]), 3, { col: PAL.skinS, op: 0.6 }); crease(f, hF([[0.05, 0.08], [0.14, 0.12], [0.22, 0.08]]), 2.4, { col: PAL.skinS, op: 0.5 });
  crease(f, hF([[0.0, 0.2], [0.04, 0.32], [0.1, 0.42], [0.16, 0.48]]), 3.4, { col: PAL.skinS, op: 0.6 });
  for (let i = 0; i < 6; i++) f.line(hF([[0.18 + i * 0.022, 0.3], [0.19 + i * 0.022, 0.335]]), 1.4, PAL.skinS, { op: 0.7 }); // pleats of the lips round the mouth
  for (let i = 0; i < 4; i++) f.flat(hF(ell([0.2 + (i % 2) * 0.05, 0.43 + Math.floor(i / 2) * 0.04], 0.012, 0.01, 0, 6)), PAL.skinS, { op: 0.7 });
  X.bite(hF([[0.3, 0.12]])[0], 24, 18, 5, 0.3); X.frost(hF([[0.2, -0.3]])[0], 40, 16, 6, 1.6); // rime on the skin
  X.cracks(hF([[0.14, 0.18]])[0], 30, 2, 0.8);
  // the ears taken: clean round holes where they were
  const eh = hF([[-0.2, 0.06]])[0]; X.voidPatch(ell(eh, 26, 30, hA, 24), { w: 2, rim: false }); f.line(ell(eh, 29, 33, hA, 24).slice(14, 23), 1.6, '#ffffff', { op: 0.9 });
  // grey hair from a centre parting, pulled back to the braids; the bone comb in it
  const hr2 = hF([[0.22, -0.4], [0.1, -0.5], [-0.1, -0.57], [-0.34, -0.5], [-0.48, -0.3], [-0.5, -0.02], [-0.42, 0.12], [-0.3, 0.12], [-0.3, -0.02], [-0.18, -0.24], [0.0, -0.36], [0.16, -0.36]]);
  hairMass(f, X, hr2, null, { fill: '#bcbec2', ang: 170, n: 26, len: 50, dir: () => rot([-1, 0.25], hA), w: 5 });
  clipDraw(f, hr2, () => { for (let i = 0; i < 6; i++) { const t = i / 6; f.stroke(hF([[0.18 - t * 0.12, -0.42], [-0.1 - t * 0.04, -0.5 + t * 0.1], [-0.36 + t * 0.06, -0.3 + t * 0.24]]), 6, '#4a4c52', { op: 0.45 }); } });
  const cb = hF([[-0.42, -0.2]])[0], CB = frame(cb, hA + 1.1, 0.7); f.part(CB([[-50, -12], [50, -14], [54, 10], [-50, 12]]), BONE({ inkW: 1.4 })); for (let i = 0; i < 9; i++) f.line(CB([[-44 + i * 11, 10], [-44 + i * 11, 30]]), 2.6, PAL.bone); // the bone comb pushed into the hair at the back of the head // the bone comb
  for (const [u, v, l] of [[0.32, 0.2, 60], [0.2, 0.56, 80], [0.08, 0.54, 50], [0.3, 0.5, 40]]) X.icicle(hF([[u, v]])[0], l, 12); // icicles from the nose and the chin
  f.bone('braid_n');
  const b0 = hF([[-0.24, 0.1]])[0];
  braid(f, X, [b0, add(b0, [10, 140]), add(b0, [0, 300]), add(b0, [-10, 420])], 52, { ties: [0.25, 0.6], fill: '#b0b2b6' }); // the near braid, frozen stiff

  // ---- the far hand in the lap on the mask: the mask half sewn, a face cut from white skin, a slit for a mouth
  f.bone('mask');
  const MF = frame(MASK, -0.3, 1);
  // a face cut from white skin: brow, cheeks, a narrow chin; turned up toward her eyes, so it shows foreshortened
  const msk = MF([[-40, -120], [40, -122], [110, -96], [150, -40], [150, 30], [120, 90], [60, 130], [0, 140], [-60, 130], [-120, 90], [-150, 30], [-150, -40], [-110, -96]].map(q => [q[0], q[1] * 0.78]));
  f.part(msk, HIDE({ fill: '#f0efe8', shadow: '#9a9890', light: '#ffffff', inkW: 1.8, maxShade: 20, tex: 'mottle' + sd, texOp: 0.3 }));
  clipDraw(f, msk, () => {
    f.flat(MF([[-90, -34], [-50, -46], [-30, -32], [-70, -24]]), '#141416'); f.flat(MF([[22, -40], [66, -34], [62, -22], [20, -26]]), '#141416'); // the eye holes
    f.flat(MF([[-50, 54], [52, 50], [54, 58], [-48, 62]]), '#141416'); // the slit for a mouth
    f.line(MF([[-6, -30], [-10, 10], [6, 22]]), 2, '#9a9890', { op: 0.8 }); // the nose's fold, pinched up and sewn
    f.stitches(MF([[-150, 0], [-120, 70], [-60, 100], [0, 110]]), '#3a3c40', 1.6); // the half of it sewn
  });
  f.line(MF([[0, 110], [60, 100], [116, 70], [148, 10]]), 2, '#3a3c40', { op: 0.7, dash: '1 7' }); // the holes punched for the half not yet sewn
  f.bone('hand_f');
  const hf = openHand(f, WF, deg(-20), 220, SKIN(sd, { fill: mix(PAL.skin, PAL.bite, 0.15) }), { back: true, curl: 0.45, spread: 0.12 });
  hf.fing.forEach(g => { f.part(ell(g.k1, 14, 16, 0, 10), { fill: mix(PAL.skin, PAL.bite, 0.3), shadow: PAL.skinS, shade: 0.45, inkW: 1, cast: false, hatch: false }); X.bite(g.k3, 10, 8, 3, 0.5); }); // knotted knuckles, the fingertips darkened
  { const g = hf.fing[1]; f.part(ell(lerp(g.k2, g.k3, 0.6), 18, 15, 0, 12), BONE({ inkW: 1.4 })); for (let i = 0; i < 6; i++) f.flat(ell(add(lerp(g.k2, g.k3, 0.6), [(i % 3 - 1) * 8, Math.floor(i / 3) * 8 - 4]), 1.6, 1.6, 0, 6), PAL.boneD); } // the bone thimble
  f.bone('forearm_f'); cuff(f, X, EF, lerp(EF, WF, 0.8), 180, 0.25, furTex);

  // ---- the needle arm raised high, in front of the face; the needle as long as a spear; the sinew down to the mask
  f.bone('thread');
  const ty = [NDL0, lerp(NDL0, msk[3], 0.5), MF([[150, -20]])[0]];
  f.line(ty, 4, INK); f.line(ty, 2.2, '#c8c8c2', { straight: true }); for (let i = 1; i < 5; i++) X.icicle(lerp(ty[0], ty[2], i / 5), 18, 4);
  f.bone('needle');
  const nd = E.norm(sub(NDL1, NDL0)), nn = [-nd[1], nd[0]];
  const needle = [add(NDL0, mul(nn, 12)), add(lerp(NDL0, NDL1, 0.5), mul(nn, 16)), [...NDL1, 1], add(lerp(NDL0, NDL1, 0.5), mul(nn, -16)), add(NDL0, mul(nn, -12)), add(NDL0, mul(nd, -16))];
  f.part(needle, BONE({ fill: '#e4dfd2', inkW: 2, inkHeavy: 3, tex: 'mottle' + sd, texOp: 0.4, maxShade: 10 }));
  f.flat(ell(add(NDL0, mul(nd, 14)), 4, 12, Math.atan2(nd[1], nd[0]), 10), '#141416'); // the eye
  f.line([add(NDL0, mul(nn, 6)), add(lerp(NDL0, NDL1, 0.95), mul(nn, 2))], 2, '#ffffff', { op: 0.7 });
  for (let i = 0; i < 8; i++) f.line([lp(NDL0, NDL1, 0.2 + i * 0.08, -10), lp(NDL0, NDL1, 0.21 + i * 0.08, 8)], 1.2, PAL.boneD, { op: 0.5 });
  X.rime([lp(NDL0, NDL1, 0.3, 14), lp(NDL0, NDL1, 0.9, 6)], 6, 1);
  // the sleeve as two masses overlapping at the elbow (one outline folded over itself at this sharp bend and drew an
  // inked triangle): the upper arm round at the shoulder, the forearm over it, the hide bunched in folds at the elbow
  { const ua = limb(lerp(SN, EN, -0.06), add(EN, mul(E.norm(sub(EN, SN)), 30)), 236, 178, { steps: 14, capK: 0.8, p: [[0.5, 0.1, 0.2]], q: [[0.3, 0.12, 0.2]] }), fa = limb(add(EN, mul(E.norm(sub(WN, EN)), -40)), lerp(EN, WN, 0.86), 200, 150, { steps: 14, capK: 0.9, p: [[0.25, 0.12, 0.18]], q: [[0.25, 0.1, 0.18]] });
    f.bone('upperarm_n'); f.part(ua, OUT({ maxShade: 44 })); clipDraw(f, ua, () => { X.furField(ua, 40, 50, { dir: () => [0.1, 1], w: 4.5 }); softTone(f, E.smooth(ua), [[[lp(SN, EN, -0.2, 20), lp(SN, EN, 1.2, 20), lp(SN, EN, 1.2, 200), lp(SN, EN, -0.2, 200)], PAL.furS, 0.5, 30]]); folds(f, [[lp(SN, EN, 0.3, -60), lp(SN, EN, 0.45, 10), lp(SN, EN, 0.55, 80)], [lp(SN, EN, 0.66, -70), lp(SN, EN, 0.8, 0), lp(SN, EN, 0.88, 70)]], 8, PAL.furS, 0.5); });
    f.bone('forearm_n'); f.part(fa, OUT({ maxShade: 40 })); clipDraw(f, fa, () => { X.furField(fa, 30, 50, { dir: () => [0.1, 1], w: 4.5 }); softTone(f, E.smooth(fa), [[[lp(EN, WN, -0.2, 30), lp(EN, WN, 1.1, 30), lp(EN, WN, 1.1, 180), lp(EN, WN, -0.2, 180)], PAL.furS, 0.45, 26]]); folds(f, [[lp(EN, WN, 0.02, -70), lp(EN, WN, 0.12, 0), lp(EN, WN, 0.2, 70)], [lp(EN, WN, 0.3, -60), lp(EN, WN, 0.38, 10), lp(EN, WN, 0.44, 60)]], 8, PAL.furS, 0.5); }); }
  f.bone('upperarm_n'); forkHanks(f, X, [lp(SN, EN, 0.3, 96), lp(SN, EN, 0.95, 86)], 6, 50, 110, 26, 36, { ice: 0.7 }); // the sleeve's fur hanging plumb under the arm
  f.bone('forearm_n'); cuff(f, X, EN, lerp(EN, WN, 0.78), 190, 0.06, furTex); beadString(f, [lp(EN, WN, 0.74, -100), lp(EN, WN, 0.8, 0), lp(EN, WN, 0.74, 100)], 6, 12);
  X.rime([lp(EN, WN, 0.1, 96), lp(EN, WN, 0.7, 96)], 14, 1);
  f.bone('hand_n');
  oldFist(f, X, WN, EN, ang(NDL0, NDL1), 92, sd, { name: 'grandmother needle' });
  f.bone('torso'); X.rime([[1100, 640], [1150, 720], [1186, 880]], 12, -1); // rime on the windward breast
  return f;
}

// ------------------------------------------------------------------ THE UNSPOKEN BEAR (Ruler 3.5)
// The old white she-bear the hunters honoured with offerings and never hunted: reared on her hind legs out of a
// snowdrift, forepaws raised wide, the frame top cutting her at the brow and cutting the raised near paw. Her weight
// sinks into the haunches and the drift. (Not the White Bear of World VII, a drowned male on all fours with its head
// hung low: this one stands, frozen dry, every clump of fur hanging plumb and tipped with ice.)
// (Independent review rebuild) Bear anatomy standing: the heavy shoulder hump between the shoulder blades behind the
// neck; a long neck into a long skull with a defined stop under the brow, the small dark eye sunk under it; the mouth a
// snarl (black lips drawn back off the canines, the muzzle wrinkled, a narrow black gap with no tongue and no throat),
// never a grin; the raised arms with a deltoid at the shoulder, triceps, the elbow point, the forearm swelling below the
// elbow and narrowing to the wrist, then a paw broader than the wrist, cocked forward, five toes and long curved claws;
// the pot belly hanging forward of a narrower chest; heavy thighs under the belly; the hind leg with the calf bulging
// behind the shin into the Achilles and a narrow ankle over a broad plantigrade foot flat on the snow.
// Fur: forked hanks (the White Bear's reviewed habit) in bands that follow the form (round the hump, down the barrel,
// round the belly, along the underside of each raised arm), roots at uneven heights, shingled (lower bands first). Value
// plan: the lit top of every mass (the hump, the top of each arm, the crown of the belly, the front of the thigh) and
// its dark underside (under the arms, the belly's underside, the inner thigh, under the jaw); the hanks under a mass are
// toned darker. Rime thick down the windward front, so she reads as a drift that stood up.
// Void: clean round holes through the belly, the near forepaw and the near shoulder, see-through; no shadow.
// Offerings: bone bead strings knotted into the ruff; ivory amulets on sinew cords; three broken spear shafts and a
// harpoon head in the flank with its line trailing into the snow; a hide strap of tied offering bundles round the neck;
// a necklace of seal teeth; a notch torn from the ear; bald scar ridges across the chest; a shattered sledge under the
// near hind paw; an offering bowl of bone overturned in the drift; a ring of offering stones half buried; a frozen fish.
// True size: 3.5 human = 2240 px, the crown and ears cut by the frame; the canvas is widened to 2200 for the spread arms
// and the near paw's claws (same pixel scale).
// Rig (the Motion line: a slow sway on the hind legs; the two-pawed downward blow, then the silent roar): pelvis (root) >
// torso > head > jaw; upperarm_n/f > forearm_n/f > hand_n/f (the paws); thigh_n/f > shin_n/f > foot_n/f; strap (torso);
// line (torso).
function unspokenBear() {
  const CW = 2200, CH = 2250, GY = CH - 30, sd = 1220;
  const f = new Fig(base(sd, CH, { grimeY: GY - 400 }));
  const X = fx(f, 3), furTex = X.hairTex(92);
  const COAT = (o = {}) => FUR(Object.assign({ tex: furTex, texOp: 0.22 }, o));
  const DARK = '#2c2e34', CLAW = { fill: '#34363c', shadow: '#0e0e10', light: '#8a8e94', shade: 0.35, inkW: 1.5, inkHeavy: 2.2, cast: false, hatch: false };
  const P = [900, 1500], T = [940, 1060], NK = [1080, 300];
  const HC = [1236, 222], hA = deg(10), HS = 0.8, HF = frame(HC, hA, HS); // the head: long skull, muzzle a little down at the heroes
  const SN = [1160, 640], EN = [1540, 500], WN = [1800, 240]; // the near arm raised up and out toward the heroes
  const SF = [860, 640], EF = [570, 560], WF = [370, 330]; // the far arm raised wide behind
  const HN = [1060, 1560], KN = [1250, 1850], AN = [1070, 2104]; // near hind: stifle forward, the ankle back over the heel
  const HFr = [820, 1560], KF = [880, 1864], AF = [690, 2104];
  f.joint('pelvis', P).joint('torso', T, 'pelvis').joint('head', NK, 'torso').joint('jaw', HF([[60, 64]])[0], 'head');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HFr, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('strap', [1100, 470], 'torso').joint('line', [600, 1240], 'torso');
  const inPoly = (q, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d, [-d[1], d[0]]]; };
  // a band of forked hanks following a form line; lower bands are drawn first so the band above shingles over their roots
  const band = (pts, n, l0, l1, w0, w1, x = {}) => forkHanks(f, X, pts, n, l0, l1, w0, w1, Object.assign({ ice: 0.3, jit: 2.6, lift: 10 }, x));

  // ---- the drift behind her (low, so the legs read against it), the ring of offering stones, the overturned bowl
  f.bone('root');
  const drift = [[60, GY + 10], [140, GY - 120], [300, GY - 210], [480, GY - 240], [660, GY - 190], [860, GY - 170], [1180, GY - 150], [1480, GY - 190], [1760, GY - 120], [2000, GY - 60], [2160, GY + 10]];
  f.part(drift, { fill: PAL.snow, shadow: PAL.snowS, light: '#ffffff', shade: 0.15, maxShade: 30, inkW: 1.6, cast: false, hatch: false, grime: false, tex: X.icetex, texOp: 0.25 });
  clipDraw(f, drift, () => { for (let i = 0; i < 12; i++) { const x = 120 + f.r() * 1760, y = GY - 40 - f.r() * 150; f.line([[x, y], [x + 60, y - 6], [x + 130, y + 2]], 1.6, PAL.snowD, { op: 0.5 }); f.line([[x + 4, y - 3], [x + 60, y - 9]], 1.4, '#ffffff', { op: 0.9 }); } });
  snowGround(f, 20, 2180, GY, { depth: 30 });
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.05 + i * 0.11), q = [1000 + Math.cos(a) * 900, GY - 30 + Math.sin(a) * 26 - (i % 2) * 10]; const st = ell(q, 34 + f.r() * 16, 22 + f.r() * 6, 0, 12).map(v => [v[0] + (f.r() - 0.5) * 6, Math.min(v[1], q[1] + 6)]); f.part(st, { fill: '#9a9ea2', shadow: '#4a4c52', light: '#c8cccf', shade: 0.4, inkW: 1.4, cast: false, tex: 'mottle' + sd, texOp: 0.6 }); X.rime([add(q, [-30, -14]), add(q, [0, -22]), add(q, [30, -14])], 6, -1); snowLip(f, add(q, [0, 14]), 90, 10); } // the stones, half buried
  const bw = [420, GY - 100]; f.part([add(bw, [-70, 20]), add(bw, [-60, -30]), add(bw, [0, -50]), add(bw, [60, -30]), add(bw, [70, 20])], BONE({ fill: '#d8d3c6', inkW: 1.8, tex: 'mottle' + sd, texOp: 0.4, shade: 0.4, maxShade: 14 })); f.line([add(bw, [-60, -10]), add(bw, [60, -12])], 1.4, PAL.boneD, { op: 0.6 }); snowLip(f, add(bw, [0, 24]), 180, 18);

  // ---- an arm: the upper arm (deltoid swelling at the shoulder on top, triceps under), the elbow point, the forearm
  // swelling below the elbow and narrowing to the wrist; the fur hanging plumb off its underside in forked hanks, the
  // top lit, the underside dark
  const arm = (S0, E0, W0, sfx, far, hole) => {
    const tone = far ? 0.32 : 0, LK = COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 46 });
    const [d1, n1] = nrm(S0, E0), [d2, n2] = nrm(E0, W0);
    const under1 = n1[1] > 0 ? 1 : -1, under2 = n2[1] > 0 ? 1 : -1; // which side of each segment faces the ground
    const up = n1[1] > 0 ? 'q' : 'p', dn = up === 'p' ? 'q' : 'p', A0 = lerp(S0, E0, -0.1);
    const bump = { p: [], q: [] };
    bump[up].push([0, 0.22, 0.26, 0.14]); bump[dn].push([0, 0.62, 0.14, 0.16]); // the deltoid on top, the triceps under
    bump[dn].push([0, 1, 0.42, 0.06], [1, 0, 0.42, 0.06]); // the elbow point, outside the bend
    bump[up].push([1, 0.2, 0.16, 0.14]); bump[dn].push([1, 0.26, 0.24, 0.16]); // the forearm's muscle below the elbow
    const whole = K.chain([A0, E0, W0], [310, 216, 156], { bp: bump.p, bq: bump.q, steps: 14 });
    { const r = 155; for (let i = 1; i < 10; i++) { const t = Math.PI * i / 10; whole.push(add(A0, add(mul(n1, Math.cos(t) * r * (up === 'q' ? 1 : -1)), mul(d1, -Math.sin(t) * r * 0.6)))); } } // a rounded root inside the shoulder
    const [k1, k2] = jcut(A0, E0, W0, 110);
    const inside = (sh, d, n, und, len) => {
      X.furField(sh, 40, 60, { dir: () => [0.08, 1], w: 5 });
      softTone(f, E.smooth(sh), [[[add(S0, mul(n, und * 30)), add(W0, mul(n, und * 30)), add(W0, mul(n, und * 220)), add(S0, mul(n, und * 220))], PAL.furD, 0.55, 30], [[add(S0, mul(n, -und * 60)), add(W0, mul(n, -und * 50)), add(W0, mul(n, -und * 200)), add(S0, mul(n, -und * 200))], '#ffffff', 0.55, 26]]);
    };
    const drawUA = () => split(f, () => {
      f.part(whole, LK);
      clipDraw(f, whole, () => {
        X.furField(whole, 60, 60, { dir: () => [0.08, 1], w: 5 });
        const u1 = n1[1] > 0 ? 1 : -1, u2 = n2[1] > 0 ? 1 : -1;
        softTone(f, E.smooth(whole), [[[add(A0, mul(n1, u1 * 40)), add(E0, mul(n1, u1 * 40)), add(W0, mul(n2, u2 * 30)), add(W0, mul(n2, u2 * 220)), add(E0, mul(n1, u1 * 260)), add(A0, mul(n1, u1 * 240))], PAL.furD, 0.55, 30], [[add(A0, mul(n1, -u1 * 70)), add(E0, mul(n1, -u1 * 50)), add(W0, mul(n2, -u2 * 40)), add(W0, mul(n2, -u2 * 200)), add(E0, mul(n1, -u1 * 220)), add(A0, mul(n1, -u1 * 220))], '#ffffff', 0.55, 26]]);
        crease(f, [lp(A0, E0, 0.3, -u1 * 50), lp(A0, E0, 0.5, -u1 * 10), lp(A0, E0, 0.6, u1 * 50)], 6, { col: PAL.furD, op: 0.45 }); // the deltoid's lower edge
        crease(f, [lp(E0, W0, 0.08, u2 * 64), lp(E0, W0, 0.36, u2 * 54), lp(E0, W0, 0.7, u2 * 34)], 5, { col: PAL.furD, op: 0.4 }); // the flexor mass
        crease(f, [lp(E0, W0, 0.84, -60), lp(E0, W0, 0.92, 0), lp(E0, W0, 0.84, 60)], 4, { col: PAL.furD, op: 0.45 }); // the wrist fold
      });
    }, [['upperarm' + sfx, k1], ['forearm' + sfx, k2]]);
    if (hole) { X.cut([hole], () => { drawUA(); f.bone('upperarm' + sfx); X.holeWall(hole); }); f.bone('upperarm' + sfx); X.holeRim(hole, { w: 3.4 }); }
    else drawUA();
    // the frozen fur hanging plumb off the underside, the hanks under the arm in its shadow (darker)
    f.bone('upperarm' + sfx); band([lp(S0, E0, 0.12, under1 * 120), lp(S0, E0, 0.5, under1 * 112), lp(S0, E0, 0.95, under1 * 100)], 8, 110, 230, 40, 62, { tone: tone + 0.22, ice: 0.45 });
    band([lp(S0, E0, 0.02, -under1 * 150), lp(S0, E0, 0.04, -under1 * 40), lp(S0, E0, 0.0, under1 * 120)].sort((a, b) => a[0] - b[0]), 5, 90, 170, 40, 56, { tone: tone + 0.08, ice: 0.2 }); // the shoulder's fur falling over the arm's root, so the arm grows out of the body
    f.bone('forearm' + sfx); band([lp(E0, W0, 0.0, under2 * 116), lp(E0, W0, 0.45, under2 * 100), lp(E0, W0, 0.78, under2 * 80)], 6, 90, 180, 36, 54, { tone: tone + 0.22, ice: 0.45 });
    X.rime([lp(S0, E0, 0.1, -under1 * 140), lp(S0, E0, 0.6, -under1 * 118), lp(E0, W0, 0.1, -under2 * 116), lp(E0, W0, 0.7, -under2 * 86)], 18, under1 > 0 ? -1 : 1);
  };
  // a paw raised and cocked forward at the wrist (ruler pass: rebuilt; it read as a mitten). The sole is turned toward the
  // heroes: a broad metacarpal pad and a small carpal pad, black leathery skin with a dull sheen; five toes splayed in an
  // arc, each its own digit with a toe pad and fur between them, gaps between the toes; long thick curved claws hooking
  // forward and down. bite: a clean round void bite out of the paw's outer edge (the bible's holed forepaw, moved off the
  // palm so it cannot read as an eye)
  const paw = (W0, dir, sfx, tone, bite) => {
    f.bone('hand' + sfx);
    const fw = [-dir[1], dir[0]], F2 = q => add(add(W0, mul(dir, q[0])), mul(fw, q[1])), M = pts => pts.map(F2), ad = Math.atan2(dir[1], dir[0]);
    const LK = COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 30 });
    const PAD = { fill: mix('#3c3e44', '#000', tone * 0.6), shadow: '#0c0c0e', light: '#7a7e86', shade: 0.4, inkW: 1.6, inkHeavy: 2.4, cast: false, hatch: false, tex: 'mottle' + sd, texOp: 0.55, maxShade: 12 };
    const pw = M([[-60, -86], [40, -120], [120, -136], [176, -120], [196, -60], [200, 0], [196, 60], [176, 112], [120, 132], [40, 116], [-60, 90]]); // the paw's heel and palm, broader than the wrist
    const digits = [[-0.5, 78, 70], [-0.24, 92, 74], [0.0, 96, 76], [0.24, 90, 72], [0.48, 76, 66]]; // splay angle, reach, width (outer toes shorter)
    const draw = () => {
      // the toes first, each a separate digit fanning out from the knuckle arc, so gaps open between them
      const tips = digits.map(([sp, rch, wd], i) => {
        const b0 = [166 - Math.abs(i - 2) * 14, (i - 2) * 50], t1 = add(b0, rot([rch * 0.5, 0], sp)), t2 = add(b0, rot([rch, 0], sp * 1.1));
        const dg = K.chain(M([b0, t1, t2]), [wd, wd * 0.95, wd * 0.8], { steps: 6 });
        const dD = f.part(dg, Object.assign({}, LK, { fill: mix(LK.fill, PAL.furS, Math.abs(i - 1.5) * 0.04), maxShade: 14 }));
        clipDraw(f, dg, () => { softTone(f, E.smooth(dg), [[M([add(b0, [0, wd * 0.3]), add(t2, [20, wd * 0.3]), add(t2, [20, wd]), add(b0, [0, wd])]), PAL.furD, 0.55, 10]]); });
        f.part(ell(F2(lerp(t1, t2, 0.55)), wd * 0.34, wd * 0.27, ad + sp, 12), PAD); // the toe pad
        f.flat(ell(F2(add(lerp(t1, t2, 0.5), [-4, -wd * 0.08])), wd * 0.12, wd * 0.06, ad + sp, 8), '#9a9ea6', { op: 0.5 }); // its dull sheen
        return { tip: t2, sp, wd };
      });
      f.part(pw, LK);
      clipDraw(f, pw, () => { X.furField(pw, 26, 40, { dir: () => [0.1, 1], w: 4 }); softTone(f, E.smooth(pw), [[M([[-60, 40], [220, 40], [220, 160], [-60, 160]]), PAL.furD, 0.5, 22], [M([[0, -140], [190, -140], [190, -70], [0, -70]]), '#ffffff', 0.45, 18]]); });
      // the metacarpal pad: a broad bean across the palm, creased, its upper rim catching the light; fur between the pads
      const mp = M([[70, -104], [118, -112], [150, -80], [158, -20], [152, 50], [126, 100], [84, 104], [62, 60], [80, 0], [62, -60]]);
      f.part(mp, PAD);
      clipDraw(f, mp, () => { f.line(M([[86, -70], [110, -10], [104, 60]]), 3, '#0a0a0c', { op: 0.6 }); f.line(M([[120, -90], [146, -40]]), 3, '#a0a4aa', { op: 0.45 }); for (let i = 0; i < 18; i++) f.flat(ell(F2([70 + f.r() * 80, -90 + f.r() * 180]), 2.4, 1.8, 0, 5), '#16161a', { op: 0.5 }); }); // a crease, the sheen, the pebbled skin
      f.part(M([[8, -96], [40, -104], [52, -78], [30, -60], [6, -70]]), PAD); // the carpal pad near the wrist
      for (let i = 0; i < 4; i++) f.stroke(M([[166, (i - 1.5) * 50 - 6], [200, (i - 1.5) * 56], [226, (i - 1.5) * 62 + 4]]), 12, LK.fill, { op: 0.95 }); // tufts of fur between the toes
      return tips;
    };
    let tips;
    if (bite) {
      const h = X.hole(F2([60, -128]), 46, 50, ad, [10, 6]);
      X.cut([h], () => { tips = draw(); clipDraw(f, pw, () => f.flat(ell(h.c, h.rx, h.ry, h.a0, 28), PAL.void)); }); // the tunnel's wall shows only where it passes through the paw
      clipDraw(f, pw, () => { const e = ell(h.c, h.rx, h.ry, h.a0, 28); f.line(e.concat([e[0]]), 3, INK); f.line(ell(h.c, h.rx + 2.6, h.ry + 2.6, h.a0, 28).slice(1, 12), 1.2, '#ffffff', { op: 0.85 }); }); // the clean rim, only on the paw
    } else tips = draw();
    // the claws: long, thick at the root, curving forward and hooking down toward the heroes
    tips.forEach(({ tip, sp, wd }, i) => {
      const r0 = add(tip, rot([-6, 0], sp)), cl = spline(M([r0, add(r0, rot([46, 4], sp)), add(r0, rot([90, 30], sp)), add(r0, rot([110, 76 + i * 4], sp))]), 6);
      f.part(ribbon(cl, cl.map((_, j, A) => wd * 0.42 * (1 - j / A.length) + 3)), CLAW);
      f.line(cl.slice(1, -2).map(q => add(q, mul(dir, 3))), 1.6, '#9a9ea4', { op: 0.7 });
    });
    band(M([[-30, 96], [80, 126], [170, 120]]).sort((a, b) => a[0] - b[0]), 3, 60, 110, 40, 52, { tone: tone + 0.2, ice: 0.5 });
    band(M([[-30, -96], [-20, 0], [-30, 96]]).sort((a, b) => a[0] - b[0]), 4, 60, 110, 40, 54, { tone: tone + 0.06, ice: 0.3, jit: 1 }); // the wrist's fur ruff over the seam
    X.rime(M([[-20, -96], [60, -124], [150, -126]]), 7, 1);
  };
  // ---- the shattered sledge under the near hind paw
  f.bone('root');
  for (const [a, b2, w] of [[[1000, GY - 10], [1560, GY - 40], 26], [[1580, GY - 40], [1760, GY - 110], 24], [[1120, GY - 30], [1340, GY - 120], 20], [[1300, GY - 6], [1480, GY + 6], 22]]) { f.part(limb(a, b2, w, w * 0.9, { steps: 8 }), { fill: PAL.wood, shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood' + sd, inkW: 1.6, cast: false }); f.flat([add(b2, [-6, -w * 0.5]), add(b2, [10, -w * 0.2]), add(b2, [2, 0]), add(b2, [12, w * 0.3]), add(b2, [-4, w * 0.5])], '#e6e6e0'); } // splintered ends
  rope(f, [[1140, GY - 20], [1240, GY - 70], [1340, GY - 30]], 4, PAL.greyD);
  const holeB = X.hole([1214, 1330], 70, 86, 0.3, [24, 6]), hS = X.hole(lp(SN, EN, 0.12, -24), 40, 44, 0.2, [12, 6]); // the belly hole; the near shoulder's hole goes on through whatever is behind it
  // far arm and paw, behind everything
  arm(SF, EF, WF, '_f', true, null); paw(WF, E.norm(sub(WF, EF)), '_f', 0.32, false);

  // ---- a hind leg. Thigh: the heavy mass from the haunch to the stifle, drawn under the body (the belly's hanks cover
  // its top). Gaskin: broad under the rounded stifle, the calf bulging behind into the Achilles, the ankle narrow. Foot:
  // plantigrade, the heel round behind the ankle, the long sole flat on the snow, the toes in a ridge, short dark claws.
  const hindLeg = (Hp, Kn, A, sfx, far) => {
    const tone = far ? 0.34 : 0.02, LK = COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 60 });
    const H0 = add(Hp, [-20, -130]);
    // p is the back of the leg on both segments (hamstring, calf); q the front (quadriceps, the knee's point, the shin)
    const leg = K.chain([H0, Kn, A], [420, 250, 132], { steps: 14, bp: [[0, 0.42, 0.12, 0.2], [1, 0.26, 0.5, 0.15], [1, 0.62, 0.12, 0.1]], bq: [[0, 0.52, 0.2, 0.2], [0, 1, 0.16, 0.06], [1, 0, 0.16, 0.06], [1, 0.3, 0.06, 0.2]] });
    { const [d0, n0] = nrm(H0, Kn), r = 210; for (let i = 1; i < 10; i++) { const t = Math.PI * i / 10; leg.push(add(H0, add(mul(n0, -Math.cos(t) * r), mul(d0, -Math.sin(t) * r * 0.5)))); } } // the top rounds into the haunch under the belly
    const [c1, c2] = jcut(H0, Kn, A, 130);
    const [kd] = nrm(Kn, A);
    split(f, () => {
      f.part(leg, LK);
      clipDraw(f, leg, () => {
        X.furField(leg, 70, 60, { dir: () => [0.04, 1], w: 5 });
        softTone(f, E.smooth(leg), [[[lp(H0, Kn, 0, 60), lp(H0, Kn, 1, 30), lp(Kn, A, 1, 20), lp(Kn, A, 1, 260), lp(H0, Kn, 1, 300), lp(H0, Kn, 0, 300)], PAL.furD, 0.55, 40], [[lp(H0, Kn, 0.2, -60), lp(H0, Kn, 0.9, -40), lp(H0, Kn, 0.9, -230), lp(H0, Kn, 0.2, -240)], '#ffffff', 0.55, 40], [[lp(Kn, A, 0.1, -40), lp(Kn, A, 0.9, -30), lp(Kn, A, 0.9, -120), lp(Kn, A, 0.1, -150)], '#ffffff', 0.45, 24]]);
        crease(f, [lp(H0, Kn, 0.45, -120), lp(H0, Kn, 0.75, -110), lp(Kn, A, 0.02, -100)], 6, { col: PAL.furD, op: 0.4 }); // the quadriceps over the knee
        crease(f, [lp(H0, Kn, 0.7, 70), lp(H0, Kn, 0.95, 90), lp(Kn, A, 0.1, 150)], 6, { col: PAL.furD, op: 0.45 }); // the back of the knee
        f.stroke([lp(Kn, A, 0.3, 160), lp(Kn, A, 0.54, 104), lp(Kn, A, 0.7, 70)], 8, PAL.furD, { op: 0.5 }); // the calf's lower edge
        f.line([lp(Kn, A, 0.66, 70), lp(Kn, A, 1.0, 50)], 5, '#ffffff', { op: 0.75 }); f.line([lp(Kn, A, 0.66, 46), lp(Kn, A, 1.0, 26)], 3.4, PAL.furD, { op: 0.6 }); // the Achilles, lit, its groove beside it
        f.stroke([lp(Kn, A, 0.12, -90), lp(Kn, A, 0.46, -70), lp(Kn, A, 0.8, -54)], 4, PAL.furS, { op: 0.4 }); // the shin's front muscle
      });
    }, [['thigh' + sfx, c1], ['shin' + sfx, c2]]);
    f.bone('thigh' + sfx); band([lp(H0, Kn, 0.55, 200), lp(H0, Kn, 0.85, 160)], 3, 60, 110, 34, 46, { tone: tone + 0.24, ice: 0.3 }); // the breeches off the back of the thigh
    X.rime([lp(H0, Kn, 0.5, -230), lp(Kn, A, 0.0, -140), lp(Kn, A, 0.5, -96), lp(Kn, A, 0.98, -70)], 16, -1);
    f.bone('foot' + sfx);
    // the plantigrade foot
    f.bone('foot' + sfx);
    const heelTop = lp(Kn, A, 1.0, 66), ankF = lp(Kn, A, 1.0, -70), toeX = A[0] + 360;
    const ft = [heelTop, add(heelTop, [-36, 36]), [A[0] - 100, GY - 52], [A[0] - 92, GY - 16], [A[0] - 60, GY - 2], [A[0] + 120, GY - 6], [toeX - 40, GY - 2], [toeX + 30, GY - 4], [toeX + 42, GY - 30], [toeX + 10, GY - 70], [toeX - 60, GY - 86], [A[0] + 160, GY - 94], add(ankF, [24, 14])]; // the heel pad round, the sole a little arched off the snow at the instep
    f.part(ft, LK);
    clipDraw(f, ft, () => { X.furField(ft, 30, 40, { dir: () => [0.3, 1], w: 5 }); f.flat([[A[0] - 140, GY - 40], [toeX + 100, GY - 40], [toeX + 100, GY + 10], [A[0] - 140, GY + 10]], PAL.furD, { op: 0.4 }); f.line([add(heelTop, [-26, 44]), [A[0] - 80, GY - 34]], 2.6, PAL.furD, { op: 0.5 }); });
    for (let i = 0; i < 5; i++) { const c = [toeX - 10 + i * 12, GY - 76 + i * 15], r = 30 + i * 3; f.part(ell(c, r, r * 0.8, 0.5, 12), Object.assign({}, LK, { fill: mix(LK.fill, PAL.furS, (4 - i) * 0.05), maxShade: 8, cast: false })); f.line([add(c, [-r * 0.6, -r * 0.4]), add(c, [-r * 0.7, r * 0.3])], 1.4, INK, { op: 0.5 }); } // the toes splayed round the front of the foot, the near ones lower and larger
    for (let i = 0; i < 5; i++) { const c = [toeX + 14 + i * 12, GY - 70 + i * 15]; f.part([add(c, [0, -8]), add(c, [34, 4]), add(c, [46, 26 - i * 2]), add(c, [20, 12])], CLAW); } // short thick claws, forward and down into the snow
    band([[A[0] - 96, GY - 100], [A[0] + 40, GY - 116], [A[0] + 200, GY - 102], [toeX - 50, GY - 90]], 6, 40, 80, 26, 38, { tone: tone + 0.1, ice: 0.2, jit: 1.6 }); // the long foot fur hanging over the sides of the foot, breaking its top line
    X.rime([ankF, [A[0] + 200, GY - 118], [toeX + 44, GY - 66]], 12, -1);
    band([[toeX - 90, GY - 92], [toeX - 30, GY - 84], [toeX + 10, GY - 66]], 3, 30, 60, 22, 30, { tone: tone + 0.06, ice: 0.6, jit: 1 }); // the foot's fur hanging over the toes, iced
  };
  // the far hind leg, the near thigh (under the body)
  X.cut([holeB], () => { hindLeg(HFr, KF, AF, '_f', true); hindLeg(HN, KN, AN, '_n', false); }); // both legs go under the body: the belly hangs over the thighs' tops

  // ---- the body: the hump between the shoulder blades behind the neck, the back down to the haunch, the narrower chest,
  // the pot belly hanging forward, the long neck up to the head. One outline, split for the rig at the waist.
  const tor = [[640, 1790], [520, 1690], [466, 1540], [488, 1360], [528, 1180], [540, 1010], [520, 860], [498, 720], [534, 560], [612, 444], [716, 392], [808, 400], [876, 452], [930, 430], [990, 320], [1050, 210], [1160, 160], [1250, 230], [1280, 420], [1290, 600], [1300, 780], [1330, 950], [1370, 1130], [1390, 1300], [1368, 1440], [1300, 1530], [1180, 1590], [1000, 1660], [820, 1740]]; // the hump high behind the neck, the back hollow under it, the haunch bulging back; the chest narrower than the belly
  { const C2 = spline(tor.concat([tor[0]]), 40); tor.length = 0; C2.forEach((q, i) => { const c0 = [930, 1100], d = E.norm(sub(q, c0)); tor.push(add(q, mul(d, 10 * Math.sin(i * 0.9) + 7 * Math.sin(i * 2.3 + 1) + f.r() * 6))); }); } // the outline breaks into frozen clumps
  X.cut([holeB, hS], () => {
    split(f, () => {
      f.part(tor, COAT({ maxShade: 100 }));
      X.furField(tor, 300, 80, { dir: p => [p[0] < 700 ? -0.12 : p[0] > 1250 ? 0.12 : 0, 1], w: 6 });
      clipDraw(f, tor, () => {
        // the value plan: the back in shade, the belly's underside and the chest under the raised arm dark; the hump's top,
        // the shoulder and the crown of the belly lit
        softTone(f, E.smooth(tor), [
          [[[420, 860], [640, 860], [700, 1820], [420, 1820]], PAL.furD, 0.55, 70],
          [[[640, 1330], [1000, 1380], [1420, 1300], [1420, 1700], [640, 1820]], PAL.furD, 0.85, 90],
          [[[760, 1200], [1100, 1240], [1100, 1400], [760, 1380]], PAL.furS, 0.35, 80],
          [[[1060, 640], [1320, 660], [1320, 860], [1060, 820]], PAL.furD, 0.45, 40],
          [[[560, 470], [880, 430], [900, 560], [600, 620]], '#ffffff', 0.6, 40],
          [[[1180, 960], [1420, 1080], [1420, 1240], [1180, 1160]], '#ffffff', 0.55, 46],
          [[[1050, 160], [1250, 200], [1270, 380], [1080, 340]], '#ffffff', 0.4, 30],
        ]);
        // the hump's mass: the shoulder blades' ridge under the fur, a groove down the spine
        crease(f, [[560, 640], [640, 560], [760, 520], [880, 540]], 8, { col: PAL.furD, op: 0.35 });
        crease(f, [[540, 900], [580, 760], [650, 640]], 7, { col: PAL.furD, op: 0.35 });
        // the bald scar ridges across the chest
        for (const [a, b2] of [[[1000, 760], [1200, 830]], [[990, 840], [1190, 920]], [[1030, 920], [1230, 990]]]) { f.stroke([a, lerp(a, b2, 0.5), b2], 14, '#f6f6f4'); f.line([a, lerp(a, b2, 0.5), b2], 1.4, INK, { op: 0.6 }); f.line([add(a, [0, 8]), add(b2, [0, 8])], 1.4, PAL.skinS, { op: 0.6 }); }
        // the belly's round: a crease under it, the ribs above it, the line of the haunch
        crease(f, [[1000, 1520], [1180, 1560], [1360, 1480]], 7, { col: PAL.furD, op: 0.45 });
        crease(f, [[600, 1360], [640, 1540], [720, 1700]], 6, { col: PAL.furD, op: 0.4 });
        for (let i = 0; i < 4; i++) crease(f, [[700 + i * 50, 940 + i * 50], [780 + i * 50, 1010 + i * 50], [860 + i * 46, 1080 + i * 50]], 3, { col: PAL.furD, op: 0.3 });
      });
      // the three broken spear shafts and the harpoon head in the flank (the back side)
      for (const [a, l, ang0] of [[[600, 1090], 220, -2.6], [[640, 1180], 180, -2.4], [[590, 1320], 160, -2.9]]) { const b2 = add(a, rot([l, 0], ang0)); f.line([a, b2], 20, INK); f.line([a, b2], 15, PAL.wood); f.part([add(b2, [-10, -12]), add(b2, [12, -10]), add(b2, [4, 14]), add(b2, [-14, 8])], { fill: '#d8d4c8', shadow: PAL.woodD, shade: 0.3, inkW: 1.4, cast: false }); for (let i = 0; i < 3; i++) f.line([lerp(a, b2, 0.3 + i * 0.06), add(lerp(a, b2, 0.3 + i * 0.06), rot([0, 16], ang0))], 3, PAL.greyD); X.icicles([lerp(a, b2, 0.4), lerp(a, b2, 0.9)], 2, 40, 8); f.flat(ell(a, 16, 10, ang0, 10), PAL.furD, { op: 0.6 }); }
      const hp = [600, 1240]; f.part([add(hp, [0, -16]), add(hp, [-70, -40]), add(hp, [-50, 0]), add(hp, [-70, 40]), add(hp, [0, 16])], BONE({ inkW: 1.6 })); f.flat(ell(add(hp, [-30, 0]), 6, 6, 0, 8), PAL.void);
      // the fur in bands that follow the form, the lowest first so each band above shingles over its roots; the bands
      // under the belly and the back are toned darker, the ones over the crown of the belly and the hump lighter
      // (ruler pass) fewer, larger hanks in four tiers that follow the form, lowest first so each tier shingles over the
      // roots of the one below: each tier lit or shaded as a mass (the crown of the belly and the hump light, the
      // underside of the belly and the back dark), so the barrel reads as a few big frozen locks with clear light and shadow
      band([[700, 1570], [900, 1620], [1080, 1600], [1240, 1540], [1360, 1450]], 6, 110, 190, 80, 104, { tone: 0.5, ice: 0.35, split: 60 }); // under the belly, in its shadow
      band([[500, 1380], [560, 1470], [660, 1540]], 3, 150, 240, 84, 104, { tone: 0.46, split: 60 }); // the haunch's underside
      band([[600, 1250], [780, 1290], [960, 1300], [1140, 1270], [1340, 1200]], 5, 200, 300, 96, 124, { tone: 0.24, ice: 0.3, split: 60, jit: 1.4 }); // round the belly's crown
      band([[560, 1040], [700, 1080], [860, 1090], [1040, 1060], [1260, 1000]], 5, 200, 300, 96, 124, { tone: 0.1, ice: 0.3, split: 60, jit: 1.4 }); // the barrel under the chest, in the light
      band([[520, 870], [640, 890], [780, 860], [900, 820]], 4, 170, 260, 90, 116, { tone: 0.2, split: 60, jit: 1.4 }); // under the hump's overhang
      band([[960, 450], [1040, 380], [1140, 350]], 4, 70, 130, 36, 50, { tone: 0.05, ice: 0.2 }); // the ruff at the nape
      band([[940, 600], [1020, 650], [1100, 690]], 4, 80, 150, 38, 54, { tone: 0.24, ice: 0.3 }); // the chest ruff in the arm's shadow
      X.holeWall(holeB); X.holeWall(hS);
    }, [['pelvis', side([930, 1320], [0, 1], 120)], ['torso', side([930, 1320], [0, -1], 120)]]);
  });
  f.bone('pelvis'); X.holeRim(holeB, { w: 4 });
  f.bone('torso');
  X.rime([[1260, 230], [1290, 420], [1300, 600], [1312, 780], [1350, 960], [1408, 1150], [1430, 1320], [1400, 1480]], 30, -1); // windward: so thick she reads as a drift that stood up
  X.rime([[560, 560], [700, 470], [820, 454], [900, 480]], 24, -1);
  // the harpoon's line out of the flank, down into the snow
  f.bone('line');
  rope(f, [[600, 1240], [520, 1500], [460, 1800], [400, 2060], [280, GY + 4]], 6, PAL.hide); X.icicles([[520, 1500], [430, 1900]], 4, 40, 7);

  f.bone('foot_n'); snowLip(f, [AN[0] + 140, GY + 4], 520, 20);
  f.bone('foot_f'); snowLip(f, [AF[0] + 140, GY + 4], 460, 18);
  // the belly's fur hanging over the top of the near thigh (on the pelvis, so the thigh has no top edge)
  f.bone('pelvis'); band([[980, 1620], [1140, 1600], [1300, 1530]], 4, 50, 100, 40, 56, { tone: 0.3, ice: 0.3 });

  // ---- the head: a long skull, the brow over a defined stop, a long straight muzzle to the black nose; the snarl:
  // black lips drawn back off the canines, the upper lip lifted at the front with the muzzle wrinkled over it, a narrow
  // black gap with no tongue and no throat; the small dark eye sunk under the brow; the notched ear behind, at the frame
  f.bone('jaw');
  const jaw = HF([[50, 74], [170, 78], [270, 74], [356, 58], [368, 78], [346, 108], [260, 132], [140, 146], [20, 144], [-60, 126], [-30, 90]]); // a deep lower jaw and chin
  X.voidPatch(HF([[150, 70], [220, 64], [290, 50], [364, 32], [362, 62], [300, 76], [220, 84], [150, 82]]), { w: 2.4, rim: false }); // no tongue, no throat: only black
  f.part(jaw, COAT({ maxShade: 22 }));
  clipDraw(f, jaw, () => { softTone(f, E.smooth(jaw), [[HF([[-40, 100], [370, 90], [370, 140], [-40, 140]]), PAL.furD, 0.55, 14]]); X.furField(jaw, 16, 26, { dir: () => [-1, 0.3], w: 3.4 }); });
  crease(f, HF([[60, 80], [180, 82], [280, 74], [360, 56]]), 9, { col: '#141416', op: 0.95 }); // the black lower lip
  for (const [x, l] of [[334, 42], [310, 16], [292, 14]]) f.part(HF([[x - 9, 76], [x + 9, 74], [x + 2, 76 - l]]), BONE({ inkW: 1.1 })); // the lower canine and two worn incisors
  band(HF([[-30, 120], [110, 134], [250, 122]]), 5, 50, 110, 26, 38, { ice: 0.7, tone: 0.2, jit: 1.6 }); // the frozen fur under the jaw, in shadow
  f.bone('head');
  // the ear at the back of the skull, its top torn away in an old notch (mostly cut by the frame)
  const er = HF([[-150, -170]])[0];
  f.part([add(er, [-46, 50]), add(er, [-60, -20]), add(er, [-36, -64]), add(er, [-10, -44]), add(er, [4, -62]), add(er, [32, -36]), add(er, [40, 40])], COAT({ fill: mix(PAL.fur, PAL.furS, 0.12), inkW: 1.6 }));
  f.part([add(er, [-34, 24]), add(er, [-40, -18]), add(er, [-22, -42]), add(er, [16, -22]), add(er, [22, 24])], { fill: '#9a9ca4', shadow: '#4a4c54', shade: 0.4, inkW: 1, cast: false, hatch: false });
  const skull = HF([[-230, 80], [-256, -40], [-216, -150], [-110, -206], [10, -196], [90, -152], [124, -118], [150, -106], [214, -104], [290, -98], [350, -88], [390, -66], [404, -30], [398, 6], [374, 30], [290, 50], [190, 66], [80, 78], [-30, 112], [-160, 122]]); // the brow over a clear stop, the muzzle deep and blunt
  f.part(skull, COAT({ maxShade: 40 }));
  const nape = HF([[-272, 110], [-280, -40], [-236, -150], [-170, -196], [-130, -120], [-150, 0], [-140, 110]]);
  f.part(nape, COAT({ inkW: 0, inkHeavy: 0, cast: false, maxShade: 30 })); // the neck's fur running over the back of the skull, no seam
  band(HF([[-250, 40], [-200, 110], [-120, 130]]), 4, 70, 130, 36, 50, { tone: 0.12, ice: 0.3 }); // the cheek ruff
  clipDraw(f, skull, () => {
    X.furField(skull, 50, 30, { dir: () => rot([-1, 0.15], hA), w: 4 });
    softTone(f, E.smooth(skull), [[HF([[-280, 30], [80, 40], [80, 120], [-280, 120]]), PAL.furD, 0.5, 20], [HF([[-120, -210], [130, -150], [400, -86], [400, -56], [140, -110], [-120, -160]]), '#ffffff', 0.6, 18], [HF([[160, -20], [390, -30], [390, 30], [160, 50]]), PAL.furS, 0.4, 14], [HF([[-240, -120], [-60, -100], [-60, 40], [-240, 40]]), PAL.furS, 0.35, 26]]);
    crease(f, HF([[20, -186], [92, -146], [148, -104]]), 7, { col: PAL.furD, op: 0.6 }); // the brow ridge over the stop
    crease(f, HF([[-30, -60], [40, -20], [120, 16]]), 5, { col: PAL.furD, op: 0.45 }); // the cheek's edge
    crease(f, HF([[-170, -20], [-150, 40], [-170, 90]]), 6, { col: PAL.furD, op: 0.4 }); // the jaw muscle's back edge
    for (let i = 0; i < 4; i++) crease(f, HF([[226 + i * 28, -94 + i * 3], [240 + i * 28, -58], [230 + i * 28, -20 + i * 4]]), 4, { col: PAL.furD, op: 0.55 }); // the muzzle wrinkled back in the snarl
  });
  // the upper lip drawn back and lifted at the front off the canine, black; the grey gum above the teeth
  f.part(HF([[270, 36], [340, 20], [374, 22], [360, 36], [310, 46]]), { fill: '#4e5058', shadow: '#26282e', shade: 0.35, inkW: 1, cast: false, hatch: false });
  crease(f, HF([[70, 72], [190, 62], [290, 46], [350, 24], [384, 22]]), 9, { col: '#141416', op: 0.95 });
  for (const [x, l] of [[322, 54], [352, 16], [366, 14]]) f.part(HF([[x - 11, 30 + (x > 340 ? -6 : 6)], [x + 11, 28 + (x > 340 ? -6 : 6)], [x - 2, 30 + l + (x > 340 ? -6 : 6)]]), BONE({ inkW: 1.1 })); // the upper canine, long, and the front incisors
  // the black nose
  const nz = HF([[384, -40]])[0];
  f.part([add(nz, [-26, -20]), add(nz, [12, -26]), add(nz, [28, -4]), add(nz, [20, 20]), add(nz, [-20, 16])], { fill: '#1e1e22', shadow: '#060608', light: '#6a6e74', shade: 0.3, inkW: 1.6, cast: false, hatch: false });
  f.flat(ell(add(nz, [8, -8]), 7, 4, 0, 8), '#8a8e94'); f.flat(ell(add(nz, [16, 6]), 5, 3, 0.4, 8), '#000');
  // the small dark eye, almond, sunk under the brow's ledge
  const ey = HF([[116, -90]])[0];
  f.flat(ell(add(ey, [0, 2]), 22, 13, hA - 0.15, 12), PAL.furD, { op: 0.6 });
  f.flat([add(ey, rot([-12, 0], hA)), add(ey, rot([0, -5], hA)), add(ey, rot([12, -1], hA)), add(ey, rot([0, 5], hA))], '#0a0a0e');
  f.flat(ell(add(ey, rot([3, -1], hA)), 1.8, 1.2, 0, 6), '#6a727c', { op: 0.6 });
  f.part([add(ey, rot([-30, -8], hA)), add(ey, rot([-4, -20], hA)), add(ey, rot([26, -14], hA)), add(ey, rot([18, -4], hA)), add(ey, rot([0, -6], hA)), add(ey, rot([-18, -1], hA))], COAT({ maxShade: 6, inkW: 0.9, inkHeavy: 1.3, cast: false })); // the brow's fur ledge over the eye
  // frost on the muzzle; rime on the brow and the bridge; icicles under the jaw and from the lip
  X.frost(HF([[290, -64]])[0], 50, 18, 12, 1.3);
  X.rime(HF([[-60, -206], [40, -194], [140, -112], [280, -96], [380, -70]]), 14, -1);
  X.icicles(HF([[20, 150], [200, 150]]), 3, 36, 7); // from the chin's fur, well below the lip

  // ---- the offerings at the neck: the hide strap of tied bundles, the seal-tooth necklace, bone beads knotted into the
  // ruff, ivory amulets on sinew cords, the frozen fish on its cord
  X.cut([hS], () => {
  f.bone('strap');
  const stp = [[940, 470], [1020, 560], [1140, 580], [1240, 520], [1280, 430]];
  f.part(ribbon(spline(stp, 6), spline(stp, 6).map(() => 30)), HIDE({ fill: '#a8a8a2', shadow: '#4a4c50', inkW: 1.6, cast: false, tex: 'mottle' + sd, texOp: 0.5 }));
  const bundle = (q, k) => { cord(f, [q, add(q, [0, 30])], 2.4); const b2 = add(q, [0, 30]); f.part([add(b2, [-30, 0]), add(b2, [30, -4]), add(b2, [40, 50]), add(b2, [20, 90]), add(b2, [-26, 86]), add(b2, [-40, 40])], HIDE({ fill: k % 2 ? '#d0d0ca' : '#bcbcb6', inkW: 1.4 })); rope(f, [add(b2, [-36, 20]), add(b2, [0, 28]), add(b2, [36, 16])], 3, PAL.greyD); f.line([add(b2, [0, 0]), add(b2, [-6, -20])], 2, PAL.greyD); X.icicle(add(b2, [0, 90]), 30, 7); };
  [[970, 500], [1050, 566]].forEach((q, k) => bundle(q, k));
  { const q = [1010, 560]; cord(f, [q, add(q, [-6, 70])], 2); const F2 = frame(add(q, [-8, 150]), deg(92), 1.6); f.part(F2([[-48, 0], [-36, -10], [-4, -13], [24, -9], [40, -2], [50, -12], [56, -14], [52, 0], [56, 13], [50, 11], [40, 3], [24, 9], [-4, 12], [-36, 9]]), { fill: '#c8cbcf', shadow: '#5e626a', light: '#f0f2f2', shade: 0.4, inkW: 1.4, cast: false, tex: X.icetex, texOp: 0.4 }); f.flat(F2(ell([-40, -2], 2.4, 2, 0, 6)), '#16181c'); for (let i = 0; i < 5; i++) f.line(F2([[-18 + i * 8, -8], [-14 + i * 8, 6]]), 1, '#6a6e74', { op: 0.5 }); X.icicle(F2([[56, 0]])[0], 26, 6); } // the frozen fish
  f.bone('torso');
  beadString(f, [[930, 420], [1030, 500], [1150, 520], [1260, 470]], 12, 14, { teeth: true }); // the seal-tooth necklace
  for (const [a, b2] of [[[1010, 380], [1020, 450]], [[1130, 400], [1140, 470]], [[950, 400], [940, 470]]]) beadString(f, [a, lerp(a, b2, 0.5), b2], 9, 6); // bone beads knotted into the ruff
  for (const q of [[1190, 500]]) { cord(f, [q, add(q, [0, 40])], 1.6); const c = add(q, [0, 70]); f.part([add(c, [-20, -30]), add(c, [20, -30]), add(c, [26, 10]), add(c, [0, 40]), add(c, [-26, 10])], BONE({ tex: 'mottle' + sd, texOp: 0.4 })); f.line([add(c, [-10, -10]), add(c, [10, -10])], 1.4, PAL.boneD); f.flat(ell(add(c, [0, 6]), 4, 4, 0, 8), PAL.boneD); } // an ivory amulet
  { const q = [900, 600]; cord(f, [[880, 470], q], 1.6); const c = add(q, [0, 30]); f.part([add(c, [-18, -26]), add(c, [18, -26]), add(c, [22, 12]), add(c, [0, 36]), add(c, [-22, 12])], BONE({ tex: 'mottle' + sd, texOp: 0.4 })); f.line([add(c, [-8, -6]), add(c, [8, -6])], 1.4, PAL.boneD); } // a second amulet

  });
  // ---- the near arm raised toward the heroes, a clean hole through the shoulder; the near paw, holed
  arm(SN, EN, WN, '_n', false, hS);
  paw(WN, E.norm(sub(WN, EN)), '_n', 0, true);
  return f;
}

module.exports = {
  heroes: [
    { key: 'the_unspoken_bear', name: 'The Unspoken Bear', tier: 'ruler', w: 2200, h: 2250, flip: true, build: unspokenBear },
    { key: 'the_hearth_grandmother', name: 'The Hearth Grandmother', tier: 'ruler', w: 2000, h: TIERS.ruler[1], flip: true, build: hearthGrandmother },
    { key: 'the_drum_seer', name: 'The Drum-Seer', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: drumSeer },
    { key: 'the_voiceless_chief', name: 'The Voiceless Chief', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: voicelessChief },
    { key: 'ice_fisher', name: 'Ice-Fisher', tier: 'human', w: 600, h: TIERS.human[1], flip: true, build: iceFisher },
    { key: 'hush_child', name: 'Hush-Child', tier: 'small', w: 600, h: TIERS.small[1], flip: true, build: hushChild },
    { key: 'lemming_drift', name: 'Lemming Drift', tier: 'small', w: 760, h: TIERS.small[1], flip: true, build: lemmingDrift },
    { key: 'lead_dog', name: 'Lead Dog', tier: 'large', w: 1100, h: TIERS.large[1], flip: true, build: leadDog },
    { key: 'sledge_hauler', name: 'Sledge Hauler', tier: 'large', w: 1500, h: TIERS.large[1], flip: true, build: sledgeHauler },
    { key: 'the_silent_singers', name: 'The Silent Singers', tier: 'human', w: 720, h: TIERS.human[1], flip: true, build: silentSingers },
    { key: 'snow_house_builder', name: 'Snow-House Builder', tier: 'human', w: 600, h: 1160, flip: true, build: snowHouseBuilder },
  ],
};
