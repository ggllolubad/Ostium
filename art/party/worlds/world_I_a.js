// World I, The Drowned Kingdom (Water + Void): rulers and the Grasping Deep.
// Drawn facing right with kit.foeBase (light from the upper right) and flipped, so foes face left lit from the upper left.
// Built for the rig from the start: joints first, f.bone() before every part, overlaps at every joint.
'use strict';
const K = require('../kit');
const W = require('./kit_I_a');
const { E, B, G, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const { P } = W;

// ------------------------------------------------------------------ THE GRASPING DEEP (elite 2.4)
// One mast-sized drowned forearm rising through a breach in the cathedral floor, the hand open and hooked over the
// front rank, fingers as long as the Thrall is tall. The elbow is below the floor: only forearm and hand are seen.
// Rig: floor (root) > arm_1 (lower forearm, pivots at the waterline) > arm_2 (upper forearm) > hand (wrist) > fingers.
function graspingDeep() {
  const CW = 1100, CH = 1400;
  const f = new Fig(W.base(104, CH, { grimeY: 1180 }));
  const SK = (o = {}) => W.SK(f, o);
  // mottled lividity: overlapping blotches of violet, green-grey and dead yellow, so the skin is never one smooth white
  // always clipped to the shape it marks (poly), so nothing spills past the silhouette
  let mid = 0;
  const mottle = (c, rx, ry, n, poly) => { const id = `mot104_${mid++}`; f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(poly)}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">`); for (let i = 0; i < n; i++) { const q = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]), r = 8 + f.r() * Math.min(rx, ry) * 0.5; f.flat(ell(q, r * (1 + f.r()), r, f.r() * 3, 12), ['#5e5a86', '#6e8264', '#867e5a', '#4e4e72'][i % 4], { op: 0.24 + f.r() * 0.18 }); } f.raw('</g>'); };
  const BC = [420, 1346]; // breach centre on the floor
  const A0 = [410, 1372], M = [446, 1080], Wr = [500, 836]; // forearm: waterline, mid, wrist
  const aH = -1.12, hs = 1.08; // hand axis (up and forward), hand scale
  const hF0 = frame(Wr, aH, hs), hF = pts => hF0(pts); // hand frame: u toward the knuckles, +v toward the thumb (forward)
  // fingers: base on the knuckle row (hand frame), spread, segment lengths and widths (px), curl per joint
  const FING = [
    { k: 'little', b: [314, -106], d: -0.4, L: [170, 124, 98], w: [70, 62, 54, 50], c: [0.34, 0.4] },
    { k: 'ring', b: [336, -40], d: -0.14, L: [214, 160, 0], w: [80, 72, 66, 0], c: [0.26, 0.3], cut: 0.6 },
    { k: 'middle', b: [346, 28], d: 0.08, L: [236, 174, 138], w: [88, 78, 70, 64], c: [0.22, 0.3] },
    { k: 'index', b: [330, 92], d: 0.3, L: [208, 156, 122], w: [84, 74, 66, 60], c: [0.18, 0.26] },
  ];
  const segs = {};
  for (const g of FING) {
    let p = hF([g.b])[0], a = aH + g.d; const s = [];
    for (let i = 0; i < 3; i++) { if (i > 0) a += g.c[i - 1]; const L = (i === 2 && g.cut ? g.L[1] * g.cut : g.L[i]) * hs; const q = add(p, rot([L, 0], a)); s.push({ p, q, a, w: g.w[i] * hs, w2: (g.w[i + 1] || g.w[i] * 0.9) * hs }); p = q; }
    segs[g.k] = s;
  }
  const thB = hF([[120, 130]])[0], thA = aH + 1.0, th1 = add(thB, rot([160 * hs, 0], thA)), th2 = add(th1, rot([128 * hs, 0], thA + 0.3));

  // ---- joints
  f.joint('floor', BC).joint('arm_1', A0, 'floor').joint('arm_2', M, 'arm_1').joint('hand', Wr, 'arm_2');
  for (const g of FING) segs[g.k].forEach((s, i) => f.joint(`${g.k}_${i + 1}`, s.p, i ? `${g.k}_${i}` : 'hand'));
  f.joint('thumb_1', thB, 'hand').joint('thumb_2', th1, 'thumb_1');
  f.joint('chain', lp(A0, M, 0.66, 150), 'arm_1').joint('kelp', Wr, 'hand');

  // ---- floor behind the arm: cracked flags, the far rim of the breach, slabs heaved up
  f.bone('floor');
  const slab = (top, th, col = P.stone) => { // a broken flagstone: top face plus its thickness below, lit from the upper right
    const edge = [...top.slice(2), ...top.slice(2).reverse().map(q => add(q, [0, th]))].reverse();
    const ed = [top[2], top[3], add(top[3], [0, th]), add(top[2], [0, th])];
    f.part(ed.map(q => [...q, 1]), { fill: P.stoneD, shade: 0.3, inkW: 1.4, tex: 'mottle104', texOp: 0.6 });
    f.part(top.map(q => [...q, 1]), { fill: col, shade: 0.35, tex: 'mottle104', texOp: 0.7 });
    f.line([lerp(top[0], top[1], 0.3), lerp(top[3], top[2], 0.45)], 1.2, INK, { op: 0.45, straight: true }); // a crack
    f.line([top[0], top[1]], 1.6, mix(col, '#fff', 0.35), { op: 0.5, straight: true }); // worn edge
    const ch = lerp(top[2], top[3], 0.4); f.flat([add(ch, [-12, -2]), add(ch, [10, -6]), add(ch, [6, 10]), add(ch, [-8, 8])], P.stoneD); // a chip out of the edge
    W.verdigris(f, lerp(top[0], top[2], 0.5), 30, 10, 3, 0.3);
  };
  f.part([[30, 1326], [150, 1298], [330, 1286], [560, 1282], [780, 1290], [960, 1312], [1060, 1340], [1050, 1388], [780, 1398], [420, 1400], [120, 1396], [36, 1380]], { fill: mix(P.stone, '#1a1e22', 0.45), shade: 0.15, tex: 'mottle104', texOp: 0.8, k: 0.5 });
  for (const [a, b] of [[[150, 1300], [118, 1396]], [[330, 1288], [300, 1398]], [[800, 1292], [840, 1396]], [[960, 1314], [1000, 1392]], [[36, 1352], [1056, 1360]], [[60, 1320], [1040, 1322]]]) f.line([a, b], 1.6, INK, { op: 0.5, straight: true });
  // the breach: a jagged black mouth, black water welling up in it
  f.flat([[150, 1336], [200, 1306], [300, 1300], [380, 1290], [470, 1296], [560, 1292], [650, 1304], [700, 1326], [690, 1360], [600, 1384], [430, 1390], [260, 1386], [170, 1366]], '#05070a');
  f.flat(ell(add(BC, [6, -6]), 260, 44, 0, 32), P.water);
  f.flat(ell(add(BC, [20, -10]), 200, 26, 0, 32), P.waterM, { op: 0.9 });
  W.ripples(f, add(BC, [0, -8]), 170, 28, 3, '#6a8898', 0.55);
  // far rim: heavy slabs heaved up behind the arm
  slab([[150, 1304], [236, 1218], [330, 1232], [262, 1312]], 46);
  slab([[540, 1288], [612, 1196], [712, 1214], [664, 1296]], 52, P.stoneL);
  slab([[330, 1292], [372, 1250], [470, 1252], [452, 1294]], 32);
  W.crust(f, [624, 1228], 36, 14, 6); W.barnacles(f, [270, 1250], 30, 12, 4, 5, 9);
  W.kelpStrand(f, [[612, 1200], [600, 1240], [606, 1290]], 10);

  // ---- the forearm, lower segment: swollen as a mast, the extensor mass bulging on the back edge
  f.bone('arm_1');
  const a1 = K.chain([A0, lerp(A0, M, 0.55), add(M, [0, -50])], [420, 380, 300], { bq: [[0, 0.7, 0.07, 0.3]], bp: [[0, 0.6, 0.04, 0.3]] });
  f.part(a1, SK({ maxShade: 100 }));
  f.flat(K.chain([lp(A0, M, 0.0, -40), lp(A0, M, 0.3, -30)], [300, 260]), P.green, { op: 0.22 }); // tide stain at the waterline
  mottle(lerp(A0, M, 0.5), 150, 140, 30, a1); W.livid(f, lerp(A0, M, 0.45), 130, 110, 16, 2.2); W.veins(f, lerp(A0, M, 0.5), 120, 90, 7, 2.2);
  f.line([lp(A0, M, 0.0, -150), lp(A0, M, 0.5, -150), lp(A0, M, 1.05, -128)], 2, mix(P.skin, '#fff', 0.35), { op: 0.55 }); // ulna ridge
  f.stroke([lp(A0, M, 0.05, 70), lp(A0, M, 0.5, 64), lp(A0, M, 1.0, 46)], 3.4, mix(P.skinS, '#000', 0.2)); // flexor groove
  // sagging folds of waterlogged skin
  for (const [t, o] of [[0.2, -60], [0.28, 20], [0.12, -10]]) f.stroke([lp(A0, M, t, o - 60), lp(A0, M, t - 0.03, o), lp(A0, M, t, o + 60)], 2.6, mix(P.skinS, '#000', 0.25));
  // barnacles crusting the back of the forearm, mussels in the crease
  W.barnacles(f, lp(A0, M, 0.42, -150), 30, 90, 12, 8, 17);
  for (const [t, o, a] of [[0.86, 120, 0.4], [0.9, 98, -0.3], [0.94, 124, 0.9], [0.4, 150, 1.2]]) W.mussel(f, lp(A0, M, t, o), a, 2);
  // eyes opened in the skin (void world): milky, wet, set in puckered lids
  for (const [t, o, r] of [[0.2, 40, 11], [0.26, 100, 8], [0.13, 112, 6]]) {
    const c = lp(A0, M, t, o);
    f.flat(ell(c, r * 1.9, r * 1.2, 0.1, 14), mix(P.skinS, '#000', 0.25), { op: 0.7 });
    f.flat(ell(c, r * 1.3, r * 0.5, 0.1, 14), '#c4c8bc');
    f.flat(ell(add(c, [r * 0.15, 0]), r * 0.34, r * 0.34, 0, 10), '#7c8086', { op: 0.7 });
    f.flat(ell(add(c, [-r * 0.3, -r * 0.15]), r * 0.14, r * 0.08, 0, 6), '#fff', { op: 0.6 });
    f.line([add(c, [-r * 1.5, 0]), add(c, [0, -r * 0.75]), add(c, [r * 1.5, 0])], 2, INK);
    f.line([add(c, [-r * 1.3, r * 0.2]), add(c, [0, r * 0.72]), add(c, [r * 1.3, r * 0.2])], 1.2, INK, { op: 0.7 });
    W.pucker(f, add(c, [0, -r * 1.3]), 0.1, 3, r * 2, 4, INK, 0.4);
  }
  // a clean round void hole through the forearm
  W.voidHole(f, lp(A0, M, 0.42, -56), 46, 38, -0.08);
  // water sheeting off the forearm where it leaves the breach
  for (let i = 0; i < 8; i++) { const p = lp(A0, M, 0.02, -170 + i * 46); f.line([p, add(p, [2, -40 - f.r() * 70])], 2.4, P.drip, { op: 0.45 }); }

  // ---- anchor chain wound round the forearm, a loose length hanging into the water
  f.bone('chain');
  const cw = [lp(A0, M, 0.56, -214), add(lp(A0, M, 0.6, -90), [0, 22]), add(lp(A0, M, 0.66, 40), [0, 26]), lp(A0, M, 0.72, 190)];
  W.ironChain(f, cw, 74, 17);
  const ch0 = lp(A0, M, 0.71, 190);
  W.ironChain(f, [ch0, add(ch0, [34, 80]), add(ch0, [52, 170]), [690, 1330]], 74, 17, P.iron, { phase: 1 });
  W.kelpHang(f, add(ch0, [10, 20]), 170, 12, 14);

  // ---- upper forearm, tapering to the wrist; its rounded foot sits inside arm_1
  f.bone('arm_2');
  const a2 = K.chain([add(M, [-2, 56]), M, Wr], [334, 318, 244], { bq: [[1, 0.3, 0.07, 0.25]], bp: [[1, 0.55, 0.05]] });
  f.part(a2, SK({ maxShade: 90, cast: false }));
  mottle(lerp(M, Wr, 0.5), 120, 120, 24, a2); W.livid(f, lerp(M, Wr, 0.45), 96, 100, 12, 1.8); W.veins(f, lerp(M, Wr, 0.6), 80, 90, 6, 2);
  for (const [t, o] of [[0.3, -60], [0.55, 40], [0.7, -20]]) { const a = lp(M, Wr, t, o), b = lp(M, Wr, t + 0.06, o + 20); f.line([a, b], 3, '#3a2e3a', { op: 0.6 }); f.line([a, b].map(q => add(q, [-1, -2])), 1, '#e8e2d2', { op: 0.5 }); } // splits in the waterlogged skin
  f.line([lp(M, Wr, -0.1, -136), lp(M, Wr, 0.5, -118), lp(M, Wr, 1.0, -104)], 2, mix(P.skin, '#fff', 0.35), { op: 0.55 });
  f.stroke([lp(M, Wr, 0.0, 46), lp(M, Wr, 0.5, 40), lp(M, Wr, 0.95, 28)], 3, mix(P.skinS, '#000', 0.2));
  W.peel(f, lp(M, Wr, 0.5, -40), 7, 1.8, 80);
  W.barnacles(f, lp(M, Wr, 0.35, -116), 22, 50, 7, 7, 13);
  W.kelpStrand(f, [lp(M, Wr, 0.2, -150), lp(M, Wr, 0.3, -40), lp(M, Wr, 0.42, 60), lp(M, Wr, 0.5, 140)], 14);
  W.kelpStrand(f, [lp(M, Wr, 0.5, -130), lp(M, Wr, 0.56, -20), lp(M, Wr, 0.6, 80), lp(M, Wr, 0.64, 128)], 9);
  for (const [t, o] of [[0.25, -60], [0.4, 30], [0.7, -80]]) W.peel(f, lp(M, Wr, t, o), 3, 1.4, 40);
  // rope bound round the joint of the two segments (hides the seam when the arm flexes)
  // rope bands follow the round of the limb: below the eye line they sag (we see their top), above it they arch
  const rope = (a, b, ts, w, sag = 14) => { for (const t of ts) { const p1 = lp(a, b, t, w / 2 + 4), q1 = lp(a, b, t + 0.03, -w / 2 - 4), m1 = add(lerp(p1, q1, 0.5), [0, sag * 2]); const qb = u => lerp(lerp(p1, m1, u), lerp(m1, q1, u), u), band = [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1].map(qb); f.part(K.chain(band, [12, 14, 15, 16, 15, 14, 12]), { fill: '#7a6a48', shade: 0.45, inkW: 1.2, inkHeavy: 2, cast: false, tex: 'hatch104', texOp: 0.5 }); for (let k = 1; k < 8; k++) { const c = qb(k / 8); f.line([add(c, [-3, -6]), add(c, [3, 6])], 1, INK, { op: 0.6, straight: true }); } } };
  rope(add(M, [0, 60]), add(M, [0, -60]), [0.16, 0.36, 0.56], 330, 22);
  f.stroke([lp(M, Wr, -0.08, 170), lp(M, Wr, -0.14, 200), lp(M, Wr, -0.24, 196), lp(M, Wr, -0.34, 214)], 10, '#6e5e40'); // frayed rope end
  for (let k = -1; k <= 1; k++) f.line([lp(M, Wr, -0.34, 214), add(lp(M, Wr, -0.34, 214), [k * 6, 20])], 1.4, '#8a7a58');

  // ---- the hand: seen from the back in 3/4, fingers hooking forward over the front rank (they flex toward the palm,
  // which faces the front rank, so the curl in the picture plane is a real flexion, not a sideways bend)
  f.bone('hand');
  const palm = hF([[-70, -112], [-84, 0], [-70, 112], [30, 132], [150, 150], [290, 128], [350, 60], [354, -30], [334, -124], [230, -150], [100, -134], [20, -120]]);
  f.part(palm, SK({ fill: mix(P.skin, P.skinS, 0.08), maxShade: 90, cast: false }));
  mottle(hF([[150, 0]])[0], 170, 120, 26, palm);
  // the thumb's web turning away on the front edge, the heel of the hand behind
  f.part(hF([[20, 100], [110, 96], [190, 120], [200, 146], [110, 150], [30, 132]]), SK({ inkW: 0, inkHeavy: 0, cast: false, fill: mix(P.skin, P.skinS, 0.3), maxShade: 10 }));
  // extensor tendons fanning from the wrist to each knuckle, standing up under the waterlogged skin
  for (const g of FING) { const k = hF([g.b])[0], w0 = hF([[-40, g.b[1] * 0.25]])[0]; const m = lerp(w0, k, 0.5); f.line([w0, add(m, rot([0, -5], aH)), k], 7, mix(P.skin, '#fff', 0.25), { op: 0.55 }); f.line([add(w0, rot([0, 6], aH)), add(m, rot([0, 3], aH)), add(k, rot([0, 7], aH))], 1.6, mix(P.skinS, '#000', 0.2), { op: 0.6 }); }
  // knuckle heads along the knuckle row, each in a whorl of loose wrinkled skin
  for (const g of FING) { const k = hF([[g.b[0] - 10, g.b[1]]])[0]; f.part(ell(k, 42 * hs, 30 * hs, aH + Math.PI / 2, 14), SK({ inkW: 0, inkHeavy: 0, cast: false, maxShade: 16, fill: mix(P.skin, '#fff', 0.06) })); for (let i = 0; i < 4; i++) f.line([add(k, rot([-14 + i * 9, -30], aH)), add(k, rot([-20 + i * 9, 0], aH)), add(k, rot([-14 + i * 9, 30], aH))], 1.3, INK, { op: 0.55 }); }
  // a swollen vein, splits in the skin, lividity pooled toward the front edge, peeling
  f.line(hF([[-40, -60], [60, -40], [140, 10], [220, 0], [300, 40]]), 3.4, '#4e4a78', { op: 0.55 });
  f.line(hF([[60, -40], [120, -96], [200, -110]]), 2.4, '#4e4a78', { op: 0.45 });
  for (const [a, b] of [[[120, 60], [170, 40]], [[230, -70], [270, -50]], [[40, -80], [70, -100]]]) { f.line(hF([a, b]), 3, '#3a2e3a', { op: 0.7 }); f.line(hF([a, b]).map(q => add(q, [-1, -2])), 1, '#e8e2d2', { op: 0.6 }); }
  W.livid(f, hF([[200, 90]])[0], 90, 50, 12, 1.8); W.peel(f, hF([[240, -40]])[0], 6, 1.6, 70); W.peel(f, hF([[60, 60]])[0], 4, 1.4, 40);
  for (let i = 0; i < 3; i++) W.pucker(f, hF([[150, -90 + i * 70]])[0], aH + 0.1, 4, 30, 7);
  // the wrist: rope wound over the seam between hand and forearm, mussels clinging in it
  rope(hF([[-60, 0]])[0], hF([[40, 0]])[0], [0.12, 0.38, 0.64], 236 * hs, 6);
  W.mussel(f, hF([[-10, -140]])[0], 0.6, 1.8); W.mussel(f, hF([[8, -132]])[0], -0.4, 1.6); W.mussel(f, hF([[-24, 126]])[0], 1.2, 1.7);

  // ---- fingers, little to index (back to front): three segments each, knuckles that overlap, swollen pads
  const fingerSeg = (s, i, last, cut) => {
    // the knuckle bulges on the back edge, the pad on the palm edge; no cast shadow so the joints do not ring
    // drawn tip first, so each proximal segment's lit end laps over the next joint like a knuckle
    const fo = limb(s.p, s.q, s.w, s.w2, { steps: 8, capK: 0.8, q: [[0.92, 0.12, 0.1], [0.08, 0.06, 0.12]], p: [[0.5, 0.1, 0.24]] });
    f.part(fo, SK({ fill: mix(P.skin, P.skinS, 0.06), inkW: 0, inkHeavy: 0, cast: false, maxShade: 60 }));
    // ink only the long edges (and the tip), so a joint reads by its creases, not as a ring round a sausage
    f.line(fo.slice(0, 9), 2.6, INK); f.line(fo.slice(14, 23), 3.2, INK); if (last) f.line(fo.slice(8, 15), 2.6, INK);
    mottle(lerp(s.p, s.q, 0.5), s.w * 0.5, E.len(sub(s.q, s.p)) * 0.5, 5, fo);
    W.pucker(f, lp(s.p, s.q, 0.45, -s.w * 0.1), s.a, 4, s.w * 0.5, 5, INK, 0.4); // waterlogged skin puckered along the finger
    // the pad side (toward the front rank): a soft swell, its flexion crease cut deep at the joint
    f.flat([lp(s.p, s.q, 0.15, s.w * 0.5), lp(s.p, s.q, 0.5, s.w * 0.56), lp(s.p, s.q, 0.85, s.w * 0.48), lp(s.p, s.q, 0.7, s.w * 0.3), lp(s.p, s.q, 0.3, s.w * 0.3)], mix(P.skinS, '#000', 0.1), { op: 0.35 });
    if (!last) {
      f.line([lp(s.p, s.q, 0.95, s.w * 0.52), lp(s.p, s.q, 0.9, s.w * 0.22)], 2.6, INK, { op: 0.85 });
      // knuckle on the back edge: a bump of loose skin wrinkled in tight arcs
      f.flat(ell(lp(s.p, s.q, 0.94, -s.w * 0.3), s.w * 0.22, s.w * 0.16, s.a, 10), mix(P.skin, '#fff', 0.3), { op: 0.45 });
      for (let k = 0; k < 4; k++) f.line([lp(s.p, s.q, 0.82 + k * 0.05, -s.w * 0.52), lp(s.p, s.q, 0.86 + k * 0.05, -s.w * 0.3), lp(s.p, s.q, 0.82 + k * 0.05, -s.w * 0.06)], k === 1 ? 1.6 : 1.1, INK, { op: 0.6 });
    }
    f.line([lp(s.p, s.q, 0.15, -s.w * 0.34), lp(s.p, s.q, 0.7, -s.w * 0.36)], 1.6, mix(P.skin, '#fff', 0.45), { op: 0.55 }); // lit back edge
    if (last && !cut) {
      // washerwoman's tip: the pad swollen and ridged, skin sloughing off it in a loose flap
      W.prune(f, lp(s.p, s.q, 0.35, s.w * 0.18), lp(s.p, s.q, 0.98, s.w * 0.1), s.w * 0.55, 5, 0.6);
      f.part([lp(s.p, s.q, 0.42, s.w * 0.5), lp(s.p, s.q, 0.6, s.w * 0.62), lp(s.p, s.q, 0.74, s.w * 0.5), lp(s.p, s.q, 0.6, s.w * 0.36)], { fill: '#dedcd0', shadow: '#8a887c', shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false }); // the peeling flap
      // a thick, ridged, cracked nail on the back of the tip, its edge lifting
      const nl = [lp(s.p, s.q, 0.4, -s.w * 0.5), lp(s.p, s.q, 0.86, -s.w * 0.46), lp(s.p, s.q, 1.07, -s.w * 0.2), lp(s.p, s.q, 1.04, s.w * 0.04), lp(s.p, s.q, 0.8, -s.w * 0.02), lp(s.p, s.q, 0.42, -s.w * 0.1)];
      f.part(nl, { fill: '#56606e', shadow: '#1e2430', shade: 0.4, inkW: 1.4, inkHeavy: 2, cast: false, tex: 'mottle104', texOp: 0.5 });
      for (const o2 of [-0.38, -0.26, -0.14]) f.line([lp(s.p, s.q, 0.46, s.w * o2), lp(s.p, s.q, 0.98, s.w * (o2 + 0.06))], 1, INK, { op: 0.5 }); // ridges
      f.line([lp(s.p, s.q, 1.04, -s.w * 0.1), lp(s.p, s.q, 0.84, -s.w * 0.2), lp(s.p, s.q, 0.72, -s.w * 0.32), lp(s.p, s.q, 0.62, -s.w * 0.28)], 1.6, INK, { op: 0.9 }); // the crack
      f.line([lp(s.p, s.q, 0.44, -s.w * 0.46), lp(s.p, s.q, 0.44, -s.w * 0.14)], 2, '#c8ccc2', { op: 0.55 }); // lifted cuticle
      f.flat(ell(lp(s.p, s.q, 0.62, s.w * 0.12), s.w * 0.22, s.w * 0.18, s.a, 10), P.blotch, { op: 0.45 });
    }
  };
  for (const g of FING) for (let i = 2; i >= 0; i--) { const s = segs[g.k][i]; f.bone(`${g.k}_${i + 1}`); fingerSeg(s, i, i === 2, g.cut); if (i === 0) W.livid(f, lerp(s.p, s.q, 0.5), s.w * 0.3, 40, 3, 1.2); }
  // the ring finger's last joint is gone: unmade at a clean flat rim
  { f.bone('ring_3'); const s = segs.ring[2]; W.voidHole(f, lerp(s.p, s.q, 0.92), s.w2 * 0.5 + 6, s.w2 * 0.22, s.a + Math.PI / 2); }
  // the thumb, out toward the front rank, its torn nail on its side
  f.bone('thumb_1');
  f.part(limb(add(thB, rot([-50, 0], thA)), th1, 112, 88, { steps: 8, capK: 0.9, q: [[0.35, 0.14, 0.25]], p: [[0.6, 0.06, 0.2]] }), SK({ inkW: 1.5, cast: false, maxShade: 30 }));
  f.line([lp(thB, th1, 0.45, -40), lp(thB, th1, 0.52, 0), lp(thB, th1, 0.45, 40)], 1.6, INK, { op: 0.55 });
  f.bone('thumb_2');
  f.part(limb(th1, th2, 88, 72, { steps: 8, capK: 0.9, p: [[0.5, 0.08, 0.2]] }), SK({ inkW: 1.5, cast: false, maxShade: 26 }));
  f.line([lp(th1, th2, 0.06, 40), lp(th1, th2, 0.12, 8)], 2, INK, { op: 0.7 });
  f.part([lp(th1, th2, 0.42, -38), lp(th1, th2, 0.9, -34), lp(th1, th2, 1.08, -12), lp(th1, th2, 1.04, 6), lp(th1, th2, 0.8, -4), lp(th1, th2, 0.44, -8)], { fill: '#56606e', shadow: '#1e2430', shade: 0.4, inkW: 1.4, inkHeavy: 2, cast: false, tex: 'mottle104', texOp: 0.5 });
  f.line([lp(th1, th2, 1.04, -6), lp(th1, th2, 0.86, -18), lp(th1, th2, 0.74, -26)], 1.6, INK, { op: 0.9 }); // the nail torn and split
  f.line([lp(th1, th2, 0.82, -30), lp(th1, th2, 0.92, -22)], 1.4, '#c8d0d8', { op: 0.7 });
  W.prune(f, lp(th1, th2, 0.4, 20), lp(th1, th2, 0.95, 14), 40, 5, 0.6);
  for (let k = 0; k < 4; k++) f.line([lp(thB, th1, 0.86 + k * 0.05, -46), lp(thB, th1, 0.9 + k * 0.05, -20), lp(thB, th1, 0.86 + k * 0.05, 4)], 1.2, INK, { op: 0.55 });
  mottle(lerp(thB, th1, 0.5), 50, 60, 5, limb(add(thB, rot([-50, 0], thA)), th1, 112, 88, { steps: 8 }));
  W.pucker(f, lerp(th1, th2, 0.5), thA + 0.3, 3, 28, 6, INK, 0.35);

  // ---- kelp hanging plumb off the wrist and draped over the knuckles, dripping
  f.bone('kelp');
  W.frond(f, hF([[30, -128]])[0], add(hF([[30, -128]])[0], [-26, 300]), 46);
  W.kelpHang(f, hF([[-20, -60]])[0], 230, 12, 12);
  W.frond(f, hF([[40, 120]])[0], add(hF([[40, 120]])[0], [22, 240]), 38);
  W.kelpHang(f, hF([[10, 134]])[0], 280, 10, -10);
  f.bone('kelp'); // on the kelp bone so it can be counter-rotated to hang plumb when the hand moves
  // weed snagged in the crotches between the fingers: a wad caught in the web, thin strands falling from it
  for (const [a, b] of [['little', 'ring'], ['ring', 'middle'], ['middle', 'index']]) { const q = add(lerp(segs[a][0].p, segs[b][0].p, 0.5), rot([30, 0], aH)); for (let k = 0; k < 2; k++) { const e = add(q, [(k - 0.5) * 14, 0]); W.kelpStrand(f, [add(e, rot([70, -18 + k * 30], aH)), add(e, rot([26, -6], aH)), add(e, [-4, 30]), add(e, [6, 110 + k * 60]), add(e, [-4, 170 + k * 70])], 9 - k * 2); W.drip(f, add(e, [-4, 176 + k * 70]), 1.2); } }
  f.bone('hand');
  W.barnacles(f, hF([[300, -100]])[0], 26, 20, 5, 6, 11); W.barnacles(f, hF([[316, 40]])[0], 20, 16, 4, 5, 10); W.barnacles(f, hF([[180, -130]])[0], 30, 14, 4, 6, 11);
  f.bone('little_2'); W.barnacles(f, lp(segs.little[1].p, segs.little[1].q, 0.4, -segs.little[1].w * 0.2), 14, 10, 3, 5, 9);
  f.bone('index_1'); W.barnacles(f, lp(segs.index[0].p, segs.index[0].q, 0.5, -segs.index[0].w * 0.25), 18, 12, 3, 5, 10);
  f.bone('middle_1'); { const q = lerp(segs.middle[0].p, segs.middle[0].q, 0.55); W.frond(f, q, add(q, [-14, 250]), 34); W.kelpHang(f, add(q, [10, 0]), 200, 9, 12); }
  f.bone('index_2'); W.kelpHang(f, lerp(segs.index[1].p, segs.index[1].q, 0.4), 180, 10, 8);
  f.bone('little_1'); W.kelpHang(f, lerp(segs.little[0].p, segs.little[0].q, 0.7), 150, 9, -8);
  for (const g of FING) if (!g.cut) { f.bone(`${g.k}_3`); W.drip(f, add(segs[g.k][2].q, [0, 30]), 1.7); }
  f.bone('thumb_2'); W.drip(f, add(th2, [0, 34]), 1.7);

  // ---- floor in front of the arm: near rim slabs tipping into the breach, water spilling over them
  f.bone('floor');
  f.flat([[150, 1350], [260, 1356], [420, 1362], [600, 1354], [700, 1348], [690, 1378], [430, 1392], [170, 1380]], P.water, { op: 0.95 });
  { const e = ell(add(A0, [0, -12]), 226, 26, 0, 28); f.line(e.slice(1, 14), 4, '#a8c0cc', { op: 0.5 }); f.line(e.slice(2, 13).map(q => add(q, [0, 8])), 1.6, '#7a98a8', { op: 0.6 }); }
  W.ripples(f, add(A0, [0, 0]), 270, 22, 2, '#6a8898', 0.45);
  slab([[100, 1366], [176, 1300], [290, 1318], [232, 1382]], 34, P.stoneL);
  slab([[300, 1392], [356, 1334], [480, 1342], [458, 1396]], 24);
  slab([[566, 1390], [606, 1316], [730, 1300], [720, 1374]], 38, P.stoneL);
  // a carved grave slab fragment: half a cross and the start of a name
  f.line([[628, 1370], [650, 1330]], 4, INK, { op: 0.65, straight: true }); f.line([[618, 1352], [664, 1348]], 4, INK, { op: 0.65, straight: true });
  f.line([[672, 1362], [679, 1342], [686, 1362]], 2, INK, { op: 0.55 }); f.line([[694, 1342], [694, 1360], [705, 1358]], 2, INK, { op: 0.55 });
  // water running over the near slabs, wet sheen, silt
  for (const x of [190, 250, 340, 420, 610, 690]) f.line([[x, 1330], [x + 6, 1360], [x + 2, 1392]], 3, P.drip, { op: 0.35 });
  W.crust(f, [170, 1340], 30, 12, 5); W.barnacles(f, [700, 1326], 22, 8, 4, 5, 9);
  W.kelpStrand(f, [[300, 1340], [262, 1362], [210, 1382], [140, 1392]], 11);
  W.kelpStrand(f, [[560, 1344], [600, 1372], [672, 1386]], 9);
  return f;
}

// ------------------------------------------------------------------ THE DROWNED KING (ruler 3.5)
// Seated on a coral-crusted cathedral throne, hunched forward over his knees, the near forearm laid along the stone
// armrest with the swollen hand gripping its scroll, the far fist holding the sceptre-rod planted ahead of his feet.
// The crown has grown into the skull and pushes out as antlers; the frame crops their tips and the throne's top.
// Rig: throne (root) > pelvis > torso > head / collar / arms; legs under the robe; sceptre on the far hand.
function drownedKing() {
  const CW = 1600, CH = 1600;
  const f = new Fig(W.base(101, CH, { grimeY: 1200 }));
  const gy = f.o.groundY, H = 350;
  const SK = (o = {}) => W.SK(f, Object.assign({ maxShade: 60 }, o));
  const VEL = (o = {}) => Object.assign({ fill: P.velvet, shadow: P.velvetD, shade: 0.4, tex: 'mottle101', texOp: 0.55, maxShade: 110 }, o);
  const ERM = (o = {}) => Object.assign({ fill: P.ermine, shadow: P.ermineD, shade: 0.4, tex: 'hatch101', texOp: 0.35, maxShade: 40 }, o);
  const STONE = (o = {}) => Object.assign({ fill: P.stone, shadow: P.stoneD, shade: 0.4, tex: 'mottle101', texOp: 0.75, maxShade: 90 }, o);
  const GOLD = (o = {}) => Object.assign({ fill: '#7a6636', shadow: '#33280f', shade: 0.45, tex: 'mottle101', texOp: 0.7, maxShade: 30 }, o);
  const TUN = (o = {}) => Object.assign({ fill: '#4a4e52', shadow: '#22242a', shade: 0.4, tex: 'weave101', texOp: 0.45, maxShade: 90 }, o);
  const fold = (pts, w = 3.4, c = mix(P.velvetD, '#000', 0.45)) => f.stroke(pts, w, c);
  // a torn, wet hem from a to b: uneven strips hanging plumb, some long, some short
  const hem = (a, b, n, depth) => { const r = []; for (let i = 1; i < n; i++) { const q = lerp(a, b, (i + (f.r() - 0.5) * 0.7) / n), d = (i % 2 ? 1 : 0.2) * depth * (0.3 + f.r() * 1.1) * (i % 5 === 1 ? 1.5 : 1); r.push([q[0], q[1] + d, i % 2 ? 1 : 0]); } return r; };

  // skeleton
  const Pv = [600, 1050], N = [930, 580], C = [690, 760];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.5, 0.16), SF = S.at(0.5, 0.18);
  const EN = [560, 846], WN = [912, 852];                               // near arm laid along the armrest
  const EF = [1080, 900], WF = [1424, 884];                             // far arm: forearm out over the knees to the sceptre
  const KN = [1150, 1040], AN = [1176, 1452], KF = [1206, 1008], AF = [1268, 1444];
  const HC = [1086, 430], hA = 0.44, HH = H * 1.12;                                    // head hung forward and bowed, on the line of the neck
  const scT = [1384, 540], scB = [1486, 1566];                          // sceptre: finial and foot
  f.joint('throne', [560, 1300]).joint('pelvis', Pv, 'throne').joint('torso', S.at(0, 0.85), 'pelvis').joint('head', S.at(0.25, -0.04), 'torso');
  f.joint('collar', S.at(0.0, 0.0), 'torso');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f').joint('sceptre', WF, 'hand_f');
  f.joint('thigh_n', S.at(-0.2, 1.0), 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', S.at(0.3, 0.98), 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('robe', S.at(0.4, 0.95), 'pelvis');

  // ---------------- throne, back half: the tall back slab, seat block and plinth (behind him)
  f.bone('throne');
  f.part([[180, 1470], [1100, 1452], [1110, 1572, 1], [170, 1576, 1]], STONE({ fill: P.stoneD }));
  f.part([[200, 1440], [1070, 1424], [1090, 1460], [190, 1478]], STONE({ fill: P.stoneL, shade: 0.3 }));
  f.part([[240, -40], [320, -40, 1], [330, 1130], [252, 1160, 1]], STONE({ fill: P.stoneD }));
  f.part([[320, -40, 1], [540, -40, 1], [540, 1120, 1], [330, 1130, 1]], STONE());
  f.part([[360, 1050], [360, 400], [390, 290], [435, 230], [480, 290], [510, 400], [510, 1040]], STONE({ fill: mix(P.stone, '#000', 0.28), shade: 0.3 }));
  f.line([[435, 236], [435, 1040]], 2, INK, { op: 0.5 }); f.line([[360, 660], [510, 652]], 2, INK, { op: 0.5 });
  for (const y of [120, 320, 540, 780, 1000]) f.line([[322, y], [540, y - 6]], 1.4, INK, { op: 0.45 });
  for (let i = 0; i < 6; i++) f.part(ell([318 + (i % 2) * 6, 20 + i * 56], 16, 10, 0.6, 10), STONE({ fill: P.stoneL, inkW: 1.2 })); // crockets
  W.coral(f, [540, 160], -0.5, 70, '#c2bba6'); W.coral(f, [536, 360], 0.2, 50, mix('#c2bba6', P.verd, 0.4));
  W.crust(f, [440, 110], 90, 40, 14); W.crust(f, [520, 760], 26, 90, 10);
  W.barnacles(f, [400, 940], 40, 60, 10, 6, 12);
  W.voidHole(f, [436, 500], 40, 46, 0);
  // seat block and the far armrest's end, mostly hidden by him
  f.part([[540, 1100], [1030, 1110], [1036, 1452, 1], [540, 1452, 1]], STONE({ fill: P.stoneD }));
  f.part([[980, 860], [1080, 850], [1090, 900], [990, 912]], STONE({ fill: P.stoneD }));

  // ---------------- far arm, upper (behind the torso): heavy velvet sleeve
  f.bone('upperarm_f');
  f.part(K.chain([add(SF, [-30, -30]), lerp(SF, EF, 0.5), EF], [230, 214, 196]), VEL());

  // ---------------- far leg: thigh under the robe, swollen bare shin and foot
  f.bone('thigh_f');
  f.part(limb(S.at(0.3, 0.98), KF, 250, 190), TUN());
  f.bone('shin_f');
  f.part(limb(KF, AF, 186, 146, { q: [[0.3, 0.12, 0.2]] }), SK({ fill: mix(P.skin, P.skinS, 0.18) }));
  W.livid(f, lerp(KF, AF, 0.7), 40, 60, 6, 1.6);
  f.line([lp(KF, AF, 0.25, 50), lp(KF, AF, 0.6, 44), lp(KF, AF, 0.85, 36)], 2.6, mix(P.skin, '#fff', 0.35), { op: 0.45 });
  for (let i = 0; i < 3; i++) f.line([lp(KF, AF, 0.87 + i * 0.04, -60), lp(KF, AF, 0.91 + i * 0.04, 0), lp(KF, AF, 0.87 + i * 0.04, 56)], 1.3, INK, { op: 0.5 });
  W.barnacles(f, lp(KF, AF, 0.6, 30), 20, 30, 5, 6, 11); W.peel(f, lerp(KF, AF, 0.4), 4, 1.4, 40);
  f.bone('foot_f');
  B.bareFoot(f, AF, 1, 196, mix(P.skin, P.skinS, 0.18), { swell: 1, shadow: P.skinS, tex: 'mottle101' });

  // ---------------- pelvis: the robe spread over the seat behind him and spilling over its near edge
  f.bone('pelvis');
  f.part([S.at(-0.9, 0.7), S.at(0.4, 0.8), [1060, 1000], [1060, 1110], [1040, 1180], [1000, 1370], ...hem([1000, 1370], [460, 1370], 14, 60), [460, 1370], [420, 1240], [400, 1120], S.at(-1.0, 1.02)], VEL({ fill: mix(P.velvet, P.velvetD, 0.35) }));
  for (const [a, b2, c] of [[[520, 1140], [500, 1260], [470, 1350]], [[640, 1140], [650, 1280], [640, 1370]], [[780, 1140], [800, 1280], [800, 1380]], [[920, 1140], [930, 1260], [930, 1340]]]) fold([a, b2, c], 4);
  f.line([[470, 1350], [700, 1356], [990, 1352]], 2, '#8a9ac0', { op: 0.3 });
  for (const x of [520, 640, 760, 880]) W.drip(f, [x, 1410 + (x % 3) * 6], 1.8);
  W.kelpHang(f, [600, 1150], 260, 16, 14); W.kelpHang(f, [860, 1160], 200, 12, -8);
  for (const [x, y] of [[700, 1300], [820, 1250], [540, 1280]]) { const c = [x, y]; f.flat(ell(c, 14, 9, 0.4, 10), '#06080e'); }

  // ---------------- near leg
  f.bone('thigh_n');
  f.part(limb(S.at(-0.2, 1.0), KN, 270, 200), TUN());
  f.bone('shin_n');
  f.part(limb(KN, AN, 200, 156, { q: [[0.3, 0.14, 0.2]], p: [[0.2, 0.06, 0.2]] }), SK());
  W.livid(f, lerp(KN, AN, 0.7), 46, 70, 8, 1.8); W.veins(f, lerp(KN, AN, 0.6), 40, 70, 4, 2);
  W.peel(f, lerp(KN, AN, 0.68), 5, 1.6, 60);
  f.line([lp(KN, AN, 0.25, 56), lp(KN, AN, 0.6, 50), lp(KN, AN, 0.85, 40)], 3, mix(P.skin, '#fff', 0.4), { op: 0.5 }); // the shin bone's lit edge
  f.stroke([lp(KN, AN, 0.3, -70), lp(KN, AN, 0.5, -76), lp(KN, AN, 0.72, -60)], 3, mix(P.skinS, '#000', 0.2)); // the calf turning away
  for (let i = 0; i < 4; i++) f.line([lp(KN, AN, 0.86 + i * 0.035, -70), lp(KN, AN, 0.9 + i * 0.035, 0), lp(KN, AN, 0.86 + i * 0.035, 66)], 1.4, INK, { op: 0.55 }); // swollen ankle, skin folding over it
  for (const [t, o] of [[0.5, 20], [0.62, -30]]) { const a = lp(KN, AN, t, o), b = lp(KN, AN, t + 0.06, o + 14); f.line([a, b], 3, '#3a2e3a', { op: 0.65 }); f.line([a, b].map(q => add(q, [-1, -2])), 1, '#e8e2d2', { op: 0.5 }); } // splits
  W.pucker(f, lp(KN, AN, 0.4, 0), Math.atan2(AN[1] - KN[1], AN[0] - KN[0]) + Math.PI / 2, 4, 50, 9);
  W.barnacles(f, lp(KN, AN, 0.45, -60), 18, 30, 4, 6, 11); W.mussel(f, lp(KN, AN, 0.92, -70), 1.2, 1.8);
  f.bone('foot_n');
  B.bareFoot(f, AN, 1, 200, P.skin, { swell: 1, shadow: P.skinS, tex: 'mottle101' });
  W.barnacles(f, add(AN, [60, 34]), 26, 10, 3, 5, 8);

  // ---------------- torso: the swollen body in a dark rotted undertunic, the velvet robe over the back and side
  f.bone('torso');
  const body = S.shape([[-0.1, 0.42, 0.42], [0.06, 0.82, 0.62], [0.25, 0.92, 0.86], [0.45, 0.88, 1.02], [0.65, 0.84, 1.12], [0.85, 0.84, 1.04], [1.0, 0.86, 0.84], [1.1, 0.7, 0.5]]);
  f.part(body, TUN());
  for (const [u, v0, v1] of [[0.62, 0.3, 0.8], [0.84, 0.42, 0.95], [0.5, 0.55, 0.98]]) fold([S.at(u, v0), S.at(u + 0.12, (v0 + v1) / 2), S.at(u - 0.04, v1)], 3, '#15161a');
  // the tunic has split over the belly: grey skin, lividity, stretch marks
  f.part([S.at(0.7, 0.56), S.at(0.94, 0.52), S.at(1.06, 0.7), S.at(0.96, 0.84), S.at(0.76, 0.78)], SK({ inkW: 1.4, cast: false }));
  W.livid(f, S.at(0.88, 0.68), 36, 26, 6, 1.6);
  for (let i = 0; i < 4; i++) f.line([S.at(0.8 + i * 0.05, 0.6), S.at(0.84 + i * 0.05, 0.74)], 1.2, '#e8e4d8', { op: 0.5 });
  f.flat(ell(S.at(0.45, 0.85), 80, 36, 0.6, 14), '#6a6a56', { op: 0.3 }); // tide stain
  // the robe: back, hump and near side, open down the front
  const robe = S.shape([[-0.16, 0.6, -0.3], [0.02, 1.0, 0.06], [0.22, 1.08, 0.26], [0.45, 1.04, 0.36], [0.65, 1.0, 0.42], [0.85, 1.0, 0.4], [1.0, 1.02, 0.3], [1.12, 0.9, 0.1]]);
  f.part(robe, VEL());
  for (const [u, v0, v1] of [[-0.62, 0.18, 0.95], [-0.3, 0.28, 1.0], [0.05, 0.4, 1.02], [-0.85, 0.36, 0.98]]) fold([S.at(u, v0), S.at(u + 0.08, (v0 + v1) / 2), S.at(u - 0.04, v1)]);
  for (const [u, v] of [[-0.5, 0.58], [-0.18, 0.76], [-0.72, 0.84], [0.12, 0.62]]) { const c = S.at(u, v); f.flat(ell(c, 12 + f.r() * 8, 8 + f.r() * 5, f.r() * 3, 10), '#06080e'); f.line(ell(c, 15, 10, 0.3, 10).slice(0, 6), 1, '#5a6a9a', { op: 0.6 }); } // moth-eaten holes
  for (const v of [0.7, 0.77]) f.line([S.at(-0.98, v), S.at(-0.5, v + 0.03), S.at(0.0, v + 0.02), S.at(0.3, v + 0.04)], 2, '#c8ccd0', { op: 0.22 }); // salt tide lines
  // ermine trim down the robe's front edge: grey, stringy, black tail tips, kelp through it
  const trim = [[-0.34, 0.12], [-0.16, 0.26], [0.04, 0.44], [0.2, 0.64], [0.28, 0.84], [0.24, 1.08]].map(([u, v]) => S.at(u, v));
  f.part(K.chain(trim, [70, 66, 64, 62, 62, 64]), ERM());
  for (let i = 0; i < 30; i++) { const t = i / 30, k = Math.min(trim.length - 2, Math.floor(t * (trim.length - 1))), q = lerp(trim[k], trim[k + 1], t * (trim.length - 1) - k), o = (f.r() - 0.5) * 54; f.line([add(q, [o, -6]), add(q, [o + 2, 12 + f.r() * 10])], 1.3, mix(P.ermine, '#000', 0.45), { op: 0.7 }); }
  for (let i = 0; i < 5; i++) { const q = lerp(trim[i], trim[i + 1], 0.5); f.part([add(q, [-5, -9]), add(q, [5, -9]), add(q, [3, 20]), add(q, [0, 26]), add(q, [-3, 18])], { fill: '#141414', shade: 0.2, inkW: 1, inkHeavy: 1, cast: false }); }
  W.kelpStrand(f, [trim[1], add(trim[2], [20, 20]), add(trim[3], [-10, 40]), add(trim[3], [6, 150])], 12);
  // chain of office in tarnished gold across the chest, sagging under its weight, pendant crusted green
  const coA = S.at(-0.28, 0.1), coB = S.at(0.8, 0.22), coM = add(lerp(coA, coB, 0.5), [30, 170]);
  for (let i = 0; i <= 12; i++) { const t = i / 12, q = lerp(lerp(coA, coM, t), lerp(coM, coB, t), t); f.part(ell(q, 15, 11, 0.4 + t, 10), GOLD({ inkW: 1.2, inkHeavy: 1.8, cast: false })); }
  { const q = lerp(lerp(coA, coM, 0.5), lerp(coM, coB, 0.5), 0.5); f.part([add(q, [-26, 4]), add(q, [26, 4]), add(q, [18, 56]), add(q, [0, 70]), add(q, [-18, 56])], GOLD()); f.flat(ell(add(q, [0, 30]), 9, 12, 0, 10), P.verdD, { op: 0.8 }); W.verdigris(f, add(q, [0, 30]), 18, 24, 4, 0.6); }
  W.barnacles(f, S.at(-0.6, 0.15), 50, 40, 8, 7, 14);

  // ---------------- near upper arm: velvet sleeve down to the elbow on the armrest
  f.bone('upperarm_n');
  f.part(K.chain([add(SN, [10, -20]), lerp(SN, EN, 0.5), EN], [250, 236, 214], { bp: [[0, 0.6, 0.08]] }), VEL());
  fold([lp(SN, EN, 0.3, 60), lp(SN, EN, 0.55, 40), lp(SN, EN, 0.8, 70)], 3.2);
  fold([lp(SN, EN, 0.4, -40), lp(SN, EN, 0.62, -70), lp(SN, EN, 0.85, -40)], 2.6);
  W.mussel(f, lp(SN, EN, 0.7, 80), 0.6, 2);

  // ---------------- head: the swollen neck, a long sagging face with the jaw fallen open, the crown grown into the skull
  f.bone('head');
  const hF = frame(HC, hA, HH);
  // lank grey hair hanging plumb from the back of the skull, matted with kelp
  const nape = hF([[-0.36, -0.05]])[0];
  for (let i = 0; i < 7; i++) { const p0 = add(nape, [i * 12 - 30, -10 + i * 16]); W.kelpStrand(f, [p0, add(p0, [-10 - i * 3, 110]), add(p0, [-4, 210 + i * 10]), add(p0, [-14, 290 + i * 12])], 15 - i, i % 2 ? '#6e706a' : '#55584e', '#a0a298'); }
  // the neck: swollen, nearly as wide as the head, rolls of flesh
  f.part(K.chain([S.at(0.0, 0.14), lerp(S.at(0.0, 0.14), add(HC, [-30, 70]), 0.5), add(HC, [-30, 60])], [380, 350, 300]), SK());
  for (let i = 0; i < 3; i++) f.stroke([add(N, [40 + i * 34, -40 - i * 40]), add(N, [120 + i * 30, -24 - i * 40]), add(N, [200 + i * 24, -40 - i * 36])], 3, mix(P.skinS, '#000', 0.3));
  W.livid(f, add(N, [110, -50]), 60, 40, 8, 2);
  // the fallen jaw: the lower face hangs open below the skull, long and slack
  f.part(hF([[-0.2, 0.2], [0.05, 0.34], [0.3, 0.36], [0.35, 0.48], [0.32, 0.62], [0.18, 0.68], [0.0, 0.64], [-0.14, 0.48]]), SK({ inkW: 1.6 }));
  B.head(f, HC, HH, hA, {
    skin: P.skin, jaw: 1.3, chin: -0.06, nose: 1.12, hook: 0.25, mouth: 'set', squint: -0.2, browDown: -0.05, faceShade: 0.7, jawShade: 0.3, age: true, blind: true,
    hairCol: '#5a5c54', browCol: '#6a6c62',
  });
  // the mouth hangs open: a dark slack gape, thin grey-blue upper lip, the lower lip sagging off a few loose teeth
  // the jaw has fallen and hangs a little to one side: a lopsided slack gape, the lower lip turned out and sagging
  f.flat(hF([[0.155, 0.29], [0.24, 0.276], [0.33, 0.29], [0.342, 0.33], [0.318, 0.4], [0.25, 0.43], [0.19, 0.41], [0.16, 0.35]]), '#080c10');
  f.flat(hF([[0.15, 0.285], [0.24, 0.27], [0.335, 0.285], [0.33, 0.298], [0.24, 0.284], [0.16, 0.298]]), mix(P.lips, P.skin, 0.45));
  f.flat(hF([[0.17, 0.4], [0.24, 0.43], [0.31, 0.405], [0.33, 0.39], [0.336, 0.42], [0.31, 0.46], [0.24, 0.48], [0.17, 0.45]]), mix(P.skin, P.skinS, 0.4));
  f.line(hF([[0.17, 0.41], [0.24, 0.435], [0.31, 0.41]]), 1.4, INK, { op: 0.6 });
  f.line(hF([[0.18, 0.47], [0.25, 0.49], [0.3, 0.47]]), 1.2, INK, { op: 0.4 });
  f.flat(hF([[0.2, 0.39], [0.26, 0.37], [0.31, 0.38], [0.29, 0.415], [0.23, 0.42]]), '#232a34', { op: 0.9 }); // the swollen tongue lying in the jaw
  f.flat(hF([[0.27, 0.293], [0.293, 0.293], [0.29, 0.326], [0.276, 0.322]]), '#8a8270'); // one brown tooth left
  f.flat(hF([[0.2, 0.392], [0.212, 0.372], [0.222, 0.392]]), '#6e6a58'); // a stump in the lower gum
  f.line(hF([[0.24, 0.47], [0.24, 0.56], [0.25, 0.64]]), 1.6, P.drip, { op: 0.7 }); // water stringing from the lip
  f.line(hF([[0.02, 0.4], [0.12, 0.54], [0.16, 0.64]]), 1.8, INK, { op: 0.6 }); // jowl fold
  f.part(hF([[-0.08, 0.32], [0.06, 0.42], [0.1, 0.56], [0.02, 0.66], [-0.12, 0.6], [-0.16, 0.46]]), SK({ inkW: 1.2, cast: false, fill: mix(P.skin, P.blotch, 0.12) })); // the sagging jowl
  // white, fish-like eyes: milky and flat, a ghost of a pupil, the heavy upper lid sagging over them
  for (const [c, rx, ry] of [[[0.12, -0.055], 0.07, 0.045], [[0.295, -0.062], 0.03, 0.042]]) {
    f.flat(hF(ell(c, rx, ry, 0, 14)), '#c9cdc2');
    f.flat(hF(ell([c[0] + 0.012, c[1] + 0.006], rx * 0.38, ry * 0.42, 0, 10)), '#a2a8a6', { op: 0.7 });
    f.flat(hF([[c[0] - rx * 1.1, c[1] + ry * 0.1], [c[0], c[1] - ry * 1.3], [c[0] + rx * 1.1, c[1] - ry * 0.3], [c[0] + rx * 1.02, c[1] + ry * 0.3], [c[0], c[1] - ry * 0.08], [c[0] - rx, c[1] + ry * 0.25]]), mix(P.skin, P.skinS, 0.35));
    f.line(hF([[c[0] - rx, c[1] + ry * 0.22], [c[0], c[1] - ry * 0.08], [c[0] + rx, c[1] + ry * 0.28]]), 2.2, INK);
    // the lower lid sagging up over the white, so the eye is a half-moon under a heavy lid, not a lens
    f.flat(hF([[c[0] - rx * 1.25, c[1] + ry * 0.3], [c[0], c[1] + ry * 0.62], [c[0] + rx * 1.2, c[1] + ry * 0.28], [c[0] + rx * 1.3, c[1] + ry * 1.5], [c[0] - rx * 1.3, c[1] + ry * 1.5]]), mix(P.skin, P.skinS, 0.18));
    f.line(hF([[c[0] - rx * 0.95, c[1] + ry * 0.36], [c[0], c[1] + ry * 0.64], [c[0] + rx * 0.95, c[1] + ry * 0.32]]), 1.3, INK, { op: 0.7 });
    f.line(hF([[c[0] - rx * 0.8, c[1] + ry * 1.15], [c[0], c[1] + ry * 1.35], [c[0] + rx * 0.8, c[1] + ry * 1.1]]), 1, INK, { op: 0.4 });
    f.line(hF([[c[0] - rx * 0.5, c[1] + ry * 0.2], [c[0] + rx * 0.2, c[1] + ry * 0.28]]), 1.6, '#eef4f4', { op: 0.6 }); // glassy wet light, like a fish's eye
  }
  f.flat(hF([[0.04, 0.0], [0.12, 0.03], [0.2, 0.0], [0.2, 0.06], [0.12, 0.08], [0.04, 0.05]]), P.blotch, { op: 0.6 }); // bags under the eyes
  // a perfectly round, clean-rimmed void through the near cheek, the dark behind it
  W.voidHole(f, hF([[0.0, 0.3]])[0], H * 0.058, H * 0.058, 0);
  W.livid(f, hF([[-0.08, 0.1]])[0], 30, 26, 6, 1.4); W.peel(f, hF([[0.2, -0.24]])[0], 3, 1.4, 30); W.peel(f, hF([[0.05, 0.55]])[0], 3, 1.4, 30);
  // a thin sodden beard hanging plumb from the dropped jaw, kelp in it
  hF([[-0.02, 0.6], [0.1, 0.67], [0.22, 0.67], [0.32, 0.6]]).forEach((q, i) => W.kelpStrand(f, [q, add(q, [4, 50 + i * 16]), add(q, [-4, 100 + i * 30]), add(q, [2, 140 + i * 40])], 13 - i * 2, i % 2 ? '#6e706a' : '#5a5c54', '#a0a298'));
  W.kelpHang(f, hF([[0.16, 0.68]])[0], 200, 8, 6);
  // the crown band, sunk into the swollen brow: flesh rolls over it
  f.part(hF([[-0.42, -0.4], [-0.12, -0.5], [0.18, -0.48], [0.36, -0.37], [0.37, -0.27], [0.2, -0.35], [-0.12, -0.37], [-0.42, -0.28]]), GOLD({ maxShade: 18 }));
  f.line(hF([[-0.4, -0.27], [-0.12, -0.35], [0.2, -0.33], [0.37, -0.25]]), 3.4, mix(P.skin, '#fff', 0.15), { op: 0.75 });
  W.verdigris(f, hF([[0.0, -0.43]])[0], 70, 14, 6, 0.6);
  for (const u of [-0.3, -0.05, 0.12]) f.rivet(hF([[u, -0.43]])[0], 6, '#8a7440');
  // The Tooth: a pale shard of stone set in the crown's front socket
  f.part(hF([[0.24, -0.46], [0.29, -0.66], [0.33, -0.72], [0.35, -0.6], [0.37, -0.46], [0.31, -0.38]]), { fill: '#dcd8ca', shadow: '#8a8478', shade: 0.4, inkW: 1.4, inkHeavy: 2.4, cast: false, tex: 'mottle101', texOp: 0.4 });
  f.line(hF([[0.29, -0.62], [0.31, -0.48]]), 1.2, INK, { op: 0.6 });
  f.part(hF([[0.22, -0.46], [0.27, -0.5], [0.36, -0.48], [0.39, -0.4], [0.31, -0.36], [0.22, -0.38]]), GOLD({ inkW: 1.2, cast: false }));
  // antlers: the crown's tines pushing out through the scalp, gnarled, branching to points, crusted
  const antler = (pts, w0) => {
    const ws = pts.map((_, i) => Math.max(5, w0 * Math.pow(0.66, i)));
    ws[ws.length - 1] = 4;
    f.part(K.chain(pts, ws, { bp: [[0, 0.5, 0.12, 0.2]], bq: [[1, 0.4, 0.1, 0.2]] }), GOLD());
    f.line(pts.slice(0, -1).map((q, i) => add(q, [ws[i] * 0.22, -ws[i] * 0.1])), 1.6, '#a8905a', { op: 0.6 });
    for (let i = 0; i < pts.length - 2; i++) f.line([lerp(pts[i], pts[i + 1], 0.3), lerp(pts[i], pts[i + 1], 0.42)], 1.4, INK, { op: 0.6 }); // burr rings
  };
  const A = q => hF(q);
  antler(A([[-0.24, -0.46], [-0.42, -0.78], [-0.52, -1.12], [-0.46, -1.45], [-0.34, -1.8]]), 80);
  antler(A([[-0.44, -0.86], [-0.7, -0.98], [-0.9, -1.2], [-0.96, -1.42]]), 40);
  antler(A([[-0.5, -1.2], [-0.72, -1.4], [-0.82, -1.66]]), 28);
  antler(A([[0.02, -0.52], [0.0, -0.86], [0.08, -1.2], [0.06, -1.6], [0.14, -2.0]]), 72);
  antler(A([[0.03, -0.98], [-0.18, -1.2], [-0.24, -1.44]]), 30);
  antler(A([[0.18, -0.48], [0.38, -0.76], [0.66, -0.96], [0.98, -1.04], [1.26, -1.0]]), 76);
  antler(A([[0.46, -0.84], [0.54, -1.14], [0.52, -1.44]]), 34);
  antler(A([[0.8, -1.0], [0.92, -1.26], [0.96, -1.46]]), 26);
  W.coral(f, A([[-0.47, -0.92]])[0], -2.6, 46, '#c9c2ae', 2); W.coral(f, A([[0.56, -0.92]])[0], -1.3, 40, mix('#c9c2ae', P.verd, 0.5), 2);
  W.crust(f, A([[-0.2, -0.6]])[0], 34, 24, 7); W.crust(f, A([[0.3, -0.66]])[0], 28, 22, 6); W.crust(f, A([[0.02, -0.7]])[0], 20, 26, 5);
  W.barnacles(f, A([[-0.5, -1.05]])[0], 18, 26, 5, 6, 11); W.barnacles(f, A([[0.86, -1.02]])[0], 26, 12, 4, 5, 9); W.barnacles(f, A([[0.05, -1.1]])[0], 14, 24, 4, 5, 9);
  W.verdigris(f, A([[-0.3, -0.7]])[0], 30, 40, 5, 0.5); W.verdigris(f, A([[0.5, -0.86]])[0], 40, 20, 5, 0.5);
  W.kelpHang(f, A([[0.74, -0.98]])[0], 220, 12, 6); W.kelpHang(f, A([[-0.56, -1.2]])[0], 280, 13, -10); W.kelpHang(f, A([[0.04, -1.3]])[0], 160, 9, 4);
  // bubbles rising from the slack mouth, plumb, in front of the face
  W.bubbles(f, add(hF([[0.36, 0.42]])[0], [96, -30]), 7, 26, 220, 1.6);

  // ---------------- collar: a ragged ermine collar on the shoulders, wet and stringy, under the neck
  f.bone('collar');
  // built from overlapping clumps of sodden fur so its edge is lumpy, not a plate; darker where it is wettest
  const col = [S.at(-0.56, 0.0), S.at(-0.28, -0.08), S.at(0.1, -0.08), S.at(0.46, 0.0), S.at(0.6, 0.08), S.at(0.36, 0.13), S.at(0.0, 0.15), S.at(-0.34, 0.16), S.at(-0.6, 0.1)];
  f.part(col, ERM({ fill: '#5e5c56', shadow: '#2e2e30' }));
  for (let i = 0; i < 34; i++) {
    const u = -0.56 + (i % 17) / 16 * 1.12, v = (i < 17 ? 0.02 : 0.1) + f.r() * 0.04, q = S.at(u, v), l = 26 + f.r() * 34, w = 13 + f.r() * 8;
    f.part([add(q, [-w, -l * 0.3]), add(q, [w * 0.2, -l * 0.42]), add(q, [w, -l * 0.1]), add(q, [w * 0.5, l * 0.6]), add(q, [0, l]), add(q, [-w * 0.6, l * 0.5])], ERM({ fill: mix(P.ermine, '#5e5c56', f.r() * 0.5), inkW: 1, inkHeavy: 1.4, cast: false, maxShade: 12 }));
    f.line([add(q, [-2, -l * 0.2]), add(q, [1, l * 0.8])], 1, mix(P.ermine, '#000', 0.5), { op: 0.6 });
  }
  for (const [u, v] of [[-0.42, 0.08], [-0.02, 0.06], [0.36, 0.1]]) { const q = S.at(u, v); f.part([add(q, [-5, -7]), add(q, [5, -7]), add(q, [3, 16]), add(q, [0, 21]), add(q, [-3, 15])], { fill: '#141414', shade: 0.2, inkW: 1, inkHeavy: 1, cast: false }); }
  W.kelpStrand(f, [S.at(-0.6, 0.04), S.at(-0.3, 0.12), S.at(0.0, 0.08), S.at(0.3, 0.14)], 13);
  W.mussel(f, S.at(0.45, 0.1), 0.4, 2); W.mussel(f, S.at(0.56, 0.12), -0.5, 1.8);

  // ---------------- robe over the knees, falling in heavy folds to a torn, wet hem at mid-shin
  f.bone('robe');
  const sk = [S.at(-0.3, 0.84), S.at(0.5, 0.8), [1120, 940], [1280, 960], [1330, 1040], [1334, 1180], [1330, 1250], ...hem([1330, 1250], [1036, 1240], 11, 70), [1036, 1240], [1020, 1180], [990, 1120], S.at(-0.4, 1.04)];
  f.part(sk, VEL({ maxShade: 90 }));
  for (const [a, b2, c] of [[[1130, 990], [1160, 1120], [1180, 1300]], [[1230, 1000], [1270, 1140], [1262, 1320]], [[1060, 1030], [1080, 1160], [1086, 1260]]]) fold([a, b2, c], 4);
  f.line([[1050, 1236], [1150, 1246], [1250, 1250], [1320, 1246]], 2, '#8a9ac0', { op: 0.35 });
  for (const [x, y] of [[1300, 1304], [1240, 1314], [1170, 1300], [1100, 1296]]) W.drip(f, [x, y + 4], 1.8);
  W.kelpStrand(f, [[1150, 960], [1200, 1070], [1190, 1190], [1214, 1320]], 12);
  W.mussel(f, [1290, 1080], 0.5, 2); W.mussel(f, [1300, 1110], -0.4, 1.8);
  for (const [x, y] of [[1210, 1150], [1100, 1100]]) { f.flat(ell([x, y], 13, 8, 0.3, 10), '#06080e'); f.line(ell([x, y], 16, 10, 0.3, 10).slice(0, 6), 1, '#5a6a9a', { op: 0.6 }); }

  // ---------------- far forearm in its sleeve, the sceptre-rod, the far fist
  f.bone('forearm_f');
  f.part(K.chain([add(EF, [-20, 0]), lerp(EF, WF, 0.5), lerp(EF, WF, 0.84)], [190, 164, 150], { bq: [[1, 0.6, 0.15]] }), VEL());
  fold([lp(EF, WF, 0.2, -40), lp(EF, WF, 0.45, -20), lp(EF, WF, 0.6, -50)], 3);
  for (const t of [0.15, 0.32, 0.5, 0.68]) fold([lp(EF, WF, t, 70), lp(EF, WF, t + 0.04, 0), lp(EF, WF, t + 0.1, -80)], 2.6);
  for (const t of [0.24, 0.42, 0.6]) f.line([lp(EF, WF, t, 60), lp(EF, WF, t + 0.04, 10)], 1.6, '#6070a0', { op: 0.35 });
  for (const [t, l] of [[0.3, 90], [0.55, 60], [0.74, 110]]) { const q = lp(EF, WF, t, 74); f.part([add(q, [-12, -10]), add(q, [12, -10]), add(q, [6, l]), add(q, [-2, l + 12]), add(q, [-8, l * 0.7])], VEL({ inkW: 1.2, cast: false, maxShade: 10 })); W.drip(f, add(q, [0, l + 16]), 1.4); } // torn strips hanging under the sleeve
  { const q = lp(EF, WF, 0.46, 30); f.flat(ell(q, 13, 8, 0.3, 10), '#06080e'); }
  f.part(K.chain([lp(EF, WF, 0.83, -62), lp(EF, WF, 0.82, 0), lp(EF, WF, 0.83, 64), lp(EF, WF, 0.78, 120)], [44, 50, 46, 20]), ERM({ fill: '#6e6c66', cast: false })); // ermine cuff, its torn end hanging
  for (let i = 0; i < 10; i++) { const q = lp(EF, WF, 0.82, -56 + i * 12); f.line([q, add(q, [2, 14])], 1, INK, { op: 0.5 }); }
  f.part(limb(lerp(EF, WF, 0.86), add(WF, [-20, 0]), 96, 92, { steps: 6 }), SK({ cast: false })); // swollen wrist
  f.bone('sceptre');
  // the sceptre: an iron rod fused with barnacles; the old orb and cross at its head, crusted over
  f.part(limb(scB, scT, 34, 40, { steps: 10 }), { fill: P.iron, shadow: '#1a1818', shade: 0.4, tex: 'mottle101', texOp: 0.7, maxShade: 20 });
  for (const t of [0.12, 0.3, 0.5, 0.72, 0.86]) W.barnacles(f, lerp(scB, scT, t), 16, 24, 3, 5, 10);
  for (const t of [0.22, 0.62]) f.flat(ell(lerp(scB, scT, t), 16, 30, 0.1, 10), '#8a4a22', { op: 0.5 });
  { const a = Math.atan2(scT[1] - scB[1], scT[0] - scB[0]), F2 = frame(scT, a, 1);
    f.part(F2([[-6, -30], [6, -30], [6, 30], [-6, 30]]), GOLD({ inkW: 1.2 })); // collar ring
    f.part(ell(F2([[56, 0]])[0], 56, 52, a, 18), GOLD({ maxShade: 30 })); // the orb
    f.line(F2([[18, -40], [56, -6], [94, -30]]), 2, '#2a2010', { op: 0.6 }); f.line(F2([[56, -52], [56, 52]]), 2, '#2a2010', { op: 0.5 });
    f.part(F2([[104, -10], [150, -10], [150, 10], [104, 10]]), GOLD({ fill: '#6a5830', inkW: 1.2 })); // the broken cross, its arms gone
    f.part(F2([[130, -34], [140, -34], [146, -14], [132, -10]]), GOLD({ fill: '#6a5830', inkW: 1.1 }));
    W.crust(f, F2([[50, 10]])[0], 34, 30, 7); W.verdigris(f, F2([[56, 0]])[0], 36, 34, 6, 0.6); W.barnacles(f, F2([[40, -30]])[0], 16, 12, 3, 5, 9); }
  W.kelpHang(f, lerp(scB, scT, 0.88), 260, 12, 8);
  f.bone('hand_f');
  B.grip(f, WF, EF, Math.atan2(scT[1] - WF[1], scT[0] - WF[0]), 80, P.skin, { shadow: P.skinS, tex: 'mottle101', texOp: 0.6, name: 'king sceptre' });
  W.peel(f, WF, 4, 1.6, 60); W.livid(f, WF, 40, 30, 4, 1.6);
  f.part(ell(add(WF, [-10, -40]), 14, 24, 0.2, 10), GOLD({ inkW: 1.1, cast: false })); // a signet ring sunk in the swollen flesh

  // ---------------- throne, near side: the armrest rail and its scroll-topped front post, in front of his hip
  f.bone('throne');
  f.part([[952, 930], [1030, 924], [1036, 1458, 1], [956, 1462, 1]], STONE({ maxShade: 60 })); // front post
  for (const y of [1060, 1200, 1340]) f.line([[956, y], [1034, y - 4]], 1.6, INK, { op: 0.5 });
  f.part([[330, 868], [990, 858], [1000, 934], [338, 944]], STONE({ fill: P.stoneL })); // rail
  f.part([[338, 940], [372, 940], [380, 1180], [342, 1190]], STONE({ fill: P.stoneD })); // back post, mostly under the robe
  f.part(ell([1000, 896], 62, 66, 0, 20), STONE({ fill: P.stoneL }));
  f.line(ell([1000, 896], 38, 42, 0, 14).concat(ell([1006, 900], 18, 20, 0, 10)), 2, INK, { op: 0.6 });
  W.coral(f, [990, 1460], -1.5, 70, mix('#c2bba6', P.verd, 0.4)); W.coral(f, [338, 1010], -2.6, 56, '#c2bba6', 2); W.coral(f, [1030, 1200], -0.4, 50, '#c2bba6', 2);
  W.crust(f, [680, 868], 130, 12, 14); W.crust(f, [990, 1360], 30, 70, 8);
  W.barnacles(f, [990, 1420], 30, 20, 5, 6, 12); W.barnacles(f, [470, 940], 60, 10, 6, 6, 11);
  for (const [x, l, w] of [[430, 320, 16], [540, 220, 11], [800, 300, 16]]) W.kelpHang(f, [x, 940], l, w, (f.r() - 0.5) * 30);
  // silt and standing water at the foot of the throne
  f.flat(ell([760, 1574], 600, 14, 0, 24), P.water, { op: 0.6 }); W.ripples(f, [1160, 1568], 260, 10, 2);

  // ---------------- near arm: forearm laid on the rail in a hanging velvet sleeve, swollen hand over the scroll
  f.bone('forearm_n');
  const slv = [lp(EN, WN, -0.14, -40), lp(EN, WN, 0.0, -78), lp(EN, WN, 0.4, -74), lp(EN, WN, 0.84, -66), lp(EN, WN, 0.9, -20), add(WN, [-24, 40]), [870, 1060], [880, 1170], ...hem([880, 1170], [500, 1150], 9, 60), [500, 1150], [470, 1000], lp(EN, WN, -0.2, 30)];
  f.part(slv, VEL());
  f.flat([add(WN, [-30, 44]), [866, 1060], [870, 1150], [836, 1100]], '#05070c', { op: 0.85 }); // the sleeve's dark mouth
  for (const [a, b2, c] of [[[600, 960], [610, 1060], [600, 1160]], [[700, 960], [720, 1060], [710, 1170]], [[800, 970], [790, 1070], [800, 1160]], [[540, 980], [560, 1060], [530, 1150]], [[650, 950], [670, 1010], [652, 1100]], [[760, 1000], [770, 1080], [752, 1150]]]) fold([a, b2, c], 3.4);
  for (const [a, c] of [[[560, 950], [880, 1020]], [[520, 1030], [860, 1100]]]) f.line([a, add(lerp(a, c, 0.5), [0, 24]), c], 2, mix(P.velvetD, '#000', 0.4), { op: 0.6 }); // the sleeve sagging between its folds
  for (const x of [580, 690, 770]) f.line([[x, 966], [x + 8, 1040], [x - 4, 1120]], 1.6, '#6070a0', { op: 0.35 }); // wet sheen on the fold ridges
  for (const [x, y] of [[620, 1090], [740, 1030], [840, 1110]]) { f.flat(ell([x, y], 12, 8, 0.4, 10), '#06080e'); f.line(ell([x, y], 15, 10, 0.4, 10).slice(0, 6), 1, '#5a6a9a', { op: 0.6 }); }
  f.part([[880, 1170], [900, 1250], [880, 1330], [868, 1240]], VEL({ inkW: 1.2, cast: false, maxShade: 10 })); f.part([[520, 1150], [530, 1240], [510, 1290], [504, 1200]], VEL({ inkW: 1.2, cast: false, maxShade: 10 })); // torn strips hanging from the hem
  f.line([[520, 1150], [700, 1164], [880, 1170]], 2, '#8a9ac0', { op: 0.3 });
  for (let i = 0; i < 5; i++) W.drip(f, [560 + i * 70, 1190 + (i % 2) * 20], 1.6);
  f.part(K.chain([lp(EN, WN, 0.8, 80), lp(EN, WN, 0.84, 0), lp(EN, WN, 0.8, -72)], [46, 52, 46]), ERM({ fill: '#6e6c66', cast: false }));
  W.kelpHang(f, [660, 1150], 200, 12, 10);
  f.part(limb(lerp(EN, WN, 0.86), add(WN, [20, 6]), 96, 92, { steps: 6 }), SK({ cast: false }));
  f.bone('hand_n');
  // the swollen fist closed over the scroll's top: back of the hand toward the elbow, thumb along the top, fingers over the front
  B.grip(f, [988, 884], EN, -0.97, 80, P.skin, { shadow: P.skinS, tex: 'mottle101', texOp: 0.6, name: 'king armrest' });
  W.livid(f, [970, 870], 40, 30, 6, 1.6); W.peel(f, [960, 860], 4, 1.5, 40); W.pucker(f, [1010, 900], 0.9, 4, 34, 8);
  f.part(ell([1022, 912], 12, 22, 0.6, 10), GOLD({ inkW: 1.1, cast: false })); // a ring sunk in the swollen flesh
  return f;
}

// ------------------------------------------------------------------ THE BELL BELOW (ruler 4)
// The cathedral's great bell, three storeys of verdigris bronze, hanging from a chain that rises out of the frame,
// its lip resting in the silt. The drowned are fused into its surface like reliefs on a cathedral door. A clean void
// hole has opened in its waist, and through it the clapper shows: a drowned bell-ringer bound to the iron tongue.
// Rig: floor (root) > chain (pivot far above the frame) > bell (canons) > clapper (inside the crown) / loose chain / reacher.
function bellBelow() {
  const CW = 1600, CH = 1600;
  const f = new Fig(W.base(102, CH, { grimeY: 1330 }));
  const gy = f.o.groundY, cx = 800, eyeY = 1110;
  const BR = (o = {}) => Object.assign({ fill: '#566e5a', shadow: '#1e2c28', shade: 0.4, tex: 'mottle102', texOp: 0.8, maxShade: 230 }, o);
  // the bell's profile: half-width at each height, a classic church bell, flaring to the sound bow
  const prof = [[150, 236], [190, 312], [236, 376], [290, 414], [360, 412], [500, 384], [680, 372], [880, 398], [1050, 448], [1200, 512], [1330, 582], [1430, 638], [1500, 664], [1548, 672]];
  const hw = y => { for (let i = 0; i < prof.length - 1; i++) { const [y0, w0] = prof[i], [y1, w1] = prof[i + 1]; if (y <= y1) { const t = (y - y0) / (y1 - y0), s2 = t * t * (3 - 2 * t); return w0 + (w1 - w0) * s2; } } return prof[prof.length - 1][1]; };
  const ryAt = y => (y - eyeY) * 0.055; // a horizontal ring's ellipse: below the eye it smiles, above it frowns
  const arc = (y, t0 = 0, t1 = 1, n = 28, inset = 0) => { const r = [], w = hw(y) - inset, ry = ryAt(y); for (let i = 0; i <= n; i++) { const t = Math.PI * (t0 + (t1 - t0) * i / n); r.push([cx - Math.cos(t) * w, y + Math.sin(t) * ry]); } return r; };
  const on = (u, y) => [cx + u * hw(y), y + Math.sqrt(Math.max(0, 1 - u * u)) * ryAt(y)]; // a point on the front surface (u -1..1 across)
  const outline = [...prof.map(([y]) => [cx - hw(y), y]), ...arc(1548, 0, 1, 30).slice(1, -1), ...prof.slice().reverse().map(([y]) => [cx + hw(y), y]), ...arc(150, 1, 0, 20).slice(1, -1)];
  const HOLE = [cx - 30, 790], hrx = 196, hry = 226;
  const hole = ell(HOLE, hrx, hry, 0, 40);
  const tongueTop = [cx, 260], ball = [cx, 1400];
  const chainTop = [cx + 30, -40], ring0 = [cx, 92];

  f.joint('floor', [cx, gy]).joint('chain', [cx + 30, -600], 'floor').joint('bell', ring0, 'chain');
  f.joint('clapper', tongueTop, 'bell').joint('chain_loose', [cx + 150, 150], 'bell').joint('reacher', on(0.86, 960), 'bell').joint('rings', [cx, gy], 'floor');

  // ---------------- floor behind: a mound of silt the lip has sunk into
  f.bone('floor');
  f.part([[60, 1560], [300, 1500], [800, 1486], [1300, 1500], [1560, 1556], [1540, 1590], [60, 1592]], { fill: '#2c3430', shadow: '#141a18', shade: 0.3, tex: 'mottle102', texOp: 0.8, maxShade: 30 });

  // ---------------- the chain, rising out of the frame
  f.bone('chain');
  W.ironChain(f, [ring0, lerp(ring0, chainTop, 0.5), chainTop], 120, 26);
  W.kelpHang(f, lerp(ring0, chainTop, 0.4), 160, 12, 10);

  // ---------------- the bell: its dark inside (seen only through the hole) first
  f.bone('bell');
  f.part(outline, { fill: '#0c121c', noShade: true, cast: false, inkW: 0 });
  f.flat(ell(add(HOLE, [40, 0]), hrx * 1.2, hry * 1.1, 0, 30), '#16222c', { op: 0.9 });
  f.line([[cx - 160, 560], [cx - 180, 800], [cx - 150, 1030]], 6, '#2a3e3c', { op: 0.6 }); // the inner wall's curve catching a little light
  for (let i = 0; i < 5; i++) f.line([[cx + 60 + i * 20, 600 + i * 30], [cx + 80 + i * 20, 980 - i * 20]], 1.4, '#22363a', { op: 0.6 });

  // ---------------- the clapper: the iron tongue with the drowned bell-ringer bound to it
  f.bone('clapper');
  f.part(limb(tongueTop, ball, 40, 34, { steps: 10 }), { fill: P.iron, shadow: '#141212', shade: 0.4, tex: 'mottle102', texOp: 0.7, maxShade: 20 });
  f.part(ell(ball, 86, 96, 0, 22), { fill: P.iron, shadow: '#141212', shade: 0.45, tex: 'mottle102', texOp: 0.7, maxShade: 60 });
  f.flat(ell(add(ball, [20, -30]), 26, 18, 0.4, 10), '#8a4a22', { op: 0.5 });
  // the ringer: a drowned sexton bound upright to the tongue, wrists lashed above his head, head lolled onto his shoulder
  const rg = { neck: [cx + 6, 730], hip: [cx + 4, 990], sh: [cx - 44, 754], sh2: [cx + 50, 750], wr: [cx + 2, 590] };
  f.part(limb(rg.neck, rg.hip, 150, 120, { p: [[0.5, 0.1, 0.3]] }), { fill: '#8a887c', shadow: '#3a3a40', shade: 0.35, tex: 'weave102', texOp: 0.5 }); // his rotted shirt
  f.part([add(rg.neck, [-40, 30]), add(rg.neck, [30, 20]), add(rg.neck, [20, 120]), add(rg.neck, [-30, 140])], W.SK(f, { maxShade: 12, cast: false })); // torn open over the chest
  W.livid(f, add(rg.neck, [0, 80]), 26, 40, 5, 1.2);
  f.part([[cx - 60, 990], [cx + 66, 990], [cx + 70, 1150], [cx + 40, 1130, 1], [cx + 20, 1170], [cx - 10, 1136, 1], [cx - 40, 1180], [cx - 64, 1140]], { fill: '#1e1e22', shadow: '#0a0a0c', shade: 0.35, tex: 'weave102', texOp: 0.5 });
  for (const [a, b2] of [[rg.sh, rg.wr], [rg.sh2, rg.wr]]) { const el = add(lerp(a, b2, 0.5), [a[0] < cx ? -30 : 30, 0]); f.part(K.chain([a, el, b2], [46, 40, 34]), W.SK(f, { maxShade: 14 })); }
  f.part(ell(rg.wr, 30, 22, 0, 12), W.SK(f, { maxShade: 10 }));
  for (const y of [570, 586, 602, 618]) f.line([[cx - 30, y], [cx + 30, y + 6]], 4, '#7a6a48'); // wrists lashed to the tongue
  for (const y of [790, 850, 930, 1010]) { f.line([[cx - 76, y], [cx + 76, y + 14]], 6, '#6e5e40'); f.line([[cx - 70, y - 2], [cx + 70, y + 12]], 1.2, '#a89870', { op: 0.6 }); } // rope round body and tongue
  const rH = [cx + 52, 690];
  B.head(f, rH, 92, 0.9, { skin: P.skin, jaw: 1.2, mouth: 'set', squint: -0.3, faceShade: 0.6, iris: '#c8cec6', eyeWhite: '#e4e6de', hairCol: P.kelp, browCol: '#4a5240', noEar: true });
  f.flat(frame(rH, 0.9, 92)([[0.17, 0.25], [0.25, 0.24], [0.31, 0.26], [0.3, 0.38], [0.24, 0.42], [0.18, 0.38]]), '#0c1012');
  f.part(frame(rH, 0.9, 92)([[-0.45, 0.1], [-0.4, -0.3], [-0.1, -0.52], [0.25, -0.46], [0.3, -0.3], [0.0, -0.36], [-0.2, -0.1], [-0.3, 0.2]]), { fill: P.kelp, shadow: '#141a10', tex: 'hatch102', texOp: 0.3 });
  for (let i = 0; i < 4; i++) W.kelpHang(f, add(rH, [-30 + i * 14, 10 + i * 6]), 70 + i * 16, 6, 4);
  W.livid(f, rg.wr, 20, 14, 4);

  // ---------------- the shell: verdigris bronze with the clean void hole through its waist
  f.bone('bell');
  const shellD = E.smooth(outline) + ' ' + E.smooth(hole); // outline runs anticlockwise, the hole clockwise: a true hole
  // shade the whole shell as one surface, then mask the hole out of it (so the hole does not throw a false recess shadow)
  f.defs.push(`<mask id="hole102" maskUnits="userSpaceOnUse" x="0" y="-200" width="${CW}" height="${CH + 400}"><rect x="0" y="-200" width="${CW}" height="${CH + 400}" fill="#fff"/><path d="${E.smooth(hole)}" fill="#000"/></mask>`);
  f.raw('<g mask="url(#hole102)">'); f.part(outline, BR()); f.raw('</g>');
  f.defs.push(`<clipPath id="shell102"><path d="${shellD}"/></clipPath>`);
  f.raw('<g clip-path="url(#shell102)">');
  // roundness: a cool lit band on the right of the bell, a dark core on the left
  f.flat([...prof.slice(2).map(([y]) => [cx + hw(y) * 0.4, y]), ...prof.slice(2).reverse().map(([y]) => [cx + hw(y) * 0.72, y])], '#a8c4b4', { op: 0.14 });
  f.flat([...prof.slice(2).map(([y]) => [cx - hw(y) * 0.9, y]), ...prof.slice(2).reverse().map(([y]) => [cx - hw(y) * 0.58, y])], '#0a1210', { op: 0.25 });
  // verdigris running down from every moulding in streaks, bronze worn through on the raised places
  // verdigris runs: thin, wandering, uneven streaks that pool and fork as they run down, darker than the bloom they
  // leave from (tapered pale spikes read as icicles, which is frost's language, not water's)
  for (let i = 0; i < 80; i++) {
    const y0 = [236, 330, 1130, 1220, 1430][i % 5], u = (f.r() - 0.5) * 1.9, q = on(u, y0 + 6), l = 50 + f.r() * 170, n = 7, pts = [];
    for (let k = 0; k <= n; k++) pts.push(add(q, [Math.sin(k * 1.3 + i) * (2 + f.r() * 5), l * k / n]));
    const col = f.r() > 0.7 ? P.verdL : f.r() > 0.4 ? P.verd : '#3c6a5a';
    f.stroke(pts, 3 + f.r() * 7, col, { op: 0.3 + f.r() * 0.3 });
    if (f.r() > 0.6) { const k = 3 + Math.floor(f.r() * 3); f.stroke([pts[k], add(pts[k], [6 + f.r() * 8, l * 0.2]), add(pts[k], [4 + f.r() * 10, l * 0.42])], 3, col, { op: 0.3 }); } // a fork
    f.flat(ell(pts[n], 4 + f.r() * 4, 2 + f.r() * 2, 0, 8), col, { op: 0.45 }); // where it pools
  }
  for (let i = 0; i < 60; i++) { const y = 260 + f.r() * 1260, u = (f.r() - 0.5) * 1.9, q = on(u, y); f.flat(ell(q, 3 + f.r() * 10, 2 + f.r() * 6, f.r() * 3, 8), f.r() > 0.5 ? P.verdL : P.verdD, { op: 0.5 }); }
  for (let i = 0; i < 30; i++) { const y = 300 + f.r() * 1200, u = (f.r() - 0.5) * 1.8, q = on(u, y); f.flat(ell(q, 4 + f.r() * 14, 3 + f.r() * 6, 0, 10), mix(P.bronze, P.bronzeL, f.r()), { op: 0.6 }); }
  // mouldings: raised rings at the shoulder, round the inscription band, and three on the sound bow
  const rib = (y, w = 3) => { const a = arc(y, 0.0, 1.0); f.line(a, w + 3, '#141c1a', { op: 0.85 }); f.line(a.map(q => add(q, [0, -3])), 2, '#9cc0b0', { op: 0.55 }); };
  for (const y of [236, 290, 330, 1130, 1220, 1430, 1470, 1520]) rib(y);
  // the inscription band, drowned gold, legible in places (pre-mirrored so it reads after the flip)
  const ins = arc(1190, 0.06, 0.94, 30).map(q => [CW - q[0], q[1]]).reverse().map(q => q.map(v => v.toFixed(1)).join(','));
  f.defs.push(`<path id="insc102" d="M${ins.join(' L')}"/>`);
  f.raw(`<g transform="translate(${CW},0) scale(-1,1)"><text font-family="DejaVu Serif, serif" font-weight="bold" font-size="48" letter-spacing="6" fill="#9a8448" stroke="#2a2010" stroke-width="1.4" opacity="0.92"><textPath href="#insc102" startOffset="1%">+ VIVOS VOCO + MORTVOS PLANGO + FVLGVRA FRANGO +</textPath></text></g>`);

  // ---------------- the drowned, fused into the bronze: heavy half-sunk torsos of raised metal, faces and hands still pale
  const RB = { fill: '#7a9a82', shadow: '#22342c', shade: 0.4, tex: 'mottle102', texOp: 0.7, maxShade: 22, inkW: 1.6, inkHeavy: 2.8 };
  const pale = mix(P.skin, '#7a9a82', 0.25);
  // c: where the body sinks into the metal; ang: body axis (0 upright); s: head height; arms: [[shoulder angle, elbow bend, hand curl]]
  const relief = (c, ang, s, o = {}) => {
    const R = (u, v) => add(c, rot([u * s, v * s], ang)), dir = a => rot([Math.sin(a), -Math.cos(a)], ang);
    const torso = [R(-0.62, 0.15), R(-0.72, -0.6), R(-0.95, -1.4), R(-1.0, -1.95), R(-0.5, -2.2), R(0.5, -2.2), R(1.0, -1.95), R(0.98, -1.4), R(0.74, -0.6), R(0.64, 0.15)];
    const arm = (k, [a, bend, curl]) => {
      const sh = R(k ? 0.82 : -0.82, -1.85), el = add(sh, mul(dir(a), 1.45 * s)), wr = add(el, mul(dir(a + bend), 1.25 * s));
      f.part(K.chain([sh, el, wr], [0.66 * s, 0.44 * s, 0.36 * s], { bp: [[0, 0.22, 0.14, 0.14], [1, 0.25, 0.16, 0.14]], bq: [[0, 0.6, 0.1, 0.18], [1, 0.2, 0.14, 0.14]] }), RB);
      f.line([lp(sh, el, 0.2, 0.15 * s), lp(sh, el, 0.6, 0.18 * s)], 1.4, '#c0dccc', { op: 0.5 });
      f.line([lp(sh, el, 0.92, 0.2 * s), lp(sh, el, 1.0, 0), lp(el, wr, 0.08, -0.18 * s)], 1.6, '#22342c', { op: 0.75 }); // the elbow's crease
      f.line([lp(el, wr, 0.2, 0.12 * s), lp(el, wr, 0.6, 0.1 * s)], 1.2, '#c0dccc', { op: 0.45 });
      B.hand(f, add(wr, mul(dir(a + bend), 0.15 * s)), ang + a + bend - Math.PI / 2, s * 0.42, pale, { spread: 0.45, curl: curl ?? 0.4, shadow: P.skinS });
    };
    if (o.back) arm(1, o.back); // the far arm, behind the torso
    f.part(torso, RB);
    f.line([R(-0.55, -1.95), R(0, -1.72), R(0.55, -1.95)], 1.6, '#22342c', { op: 0.7 }); // collarbones
    f.line([R(0, -1.7), R(0.02, -0.9)], 1.4, '#22342c', { op: 0.6 }); // sternum
    for (let i = 0; i < 3; i++) f.line([R(-0.75, -1.4 + i * 0.22), R(-0.3, -1.25 + i * 0.24)], 1.2, '#22342c', { op: 0.5 }); // ribs
    f.line([R(0.55, -1.45), R(0.85, -1.0)], 1.6, '#c0dccc', { op: 0.5 });
    if (o.front) arm(0, o.front);
    const hc = R(o.headX || 0.08, -2.85), ha = ang + (o.headTilt || 0);
    f.part(K.chain([R(0, -2.1), hc], [0.6 * s, 0.55 * s]), RB);
    B.head(f, hc, s * 1.05, ha, { skin: pale, jaw: 1.25, mouth: 'set', squint: -0.3, faceShade: 0.6, jawShade: 0.3, blind: true, noEar: true, browCol: '#3a4a40', nose: 1.05 });
    const hF2 = frame(hc, ha, s * 1.05);
    f.flat(hF2([[0.16, 0.24], [0.25, 0.23], [0.32, 0.26], [0.31, 0.42], [0.24, 0.47], [0.17, 0.42]]), '#0c1210');
    for (const ex of [0.12, 0.29]) f.flat(hF2(ell([ex, -0.06], 0.05, 0.035, 0, 8)), '#d6dad0');
    // the back of the skull is metal: hair cast in bronze, closing over the head
    f.part(hF2([[-0.5, 0.3], [-0.52, -0.2], [-0.3, -0.5], [0.05, -0.6], [0.3, -0.5], [0.34, -0.36], [0.1, -0.42], [-0.12, -0.3], [-0.22, -0.05], [-0.26, 0.3]]), Object.assign({}, RB, { maxShade: 10, inkW: 1.2, inkHeavy: 1.8, cast: false }));
    for (let i = 0; i < 4; i++) f.line(hF2([[-0.4 + i * 0.1, -0.1 - i * 0.1], [-0.2 + i * 0.12, -0.42 - i * 0.03]]), 1.2, '#22342c', { op: 0.6 });
    // where it sinks: the bell's own metal lapping over the waist in a raised, uneven lip
    // the metal flows up over the waist in uneven tongues and the rest of the body is gone under it
    const ridge = [R(-1.15, -0.1), R(-0.8, -0.34), R(-0.45, -0.22), R(-0.1, -0.5), R(0.25, -0.28), R(0.6, -0.44), R(0.95, -0.2), R(1.2, -0.06)];
    f.part([...ridge, R(1.2, 0.25), R(0.4, 0.32), R(-0.4, 0.3), R(-1.15, 0.22)], { fill: '#566e5a', shadow: '#1e2c28', shade: 0.4, tex: 'mottle102', texOp: 0.8, maxShade: 10, inkW: 0, cast: false });
    f.line(ridge, 2.2, INK, { op: 0.85 }); f.line(ridge.map(q => add(q, [0, 4])), 1.6, '#9cc0b0', { op: 0.5 });
    W.verdigris(f, R(0, 0.05), 1.0 * s, 0.25 * s, 5, 0.6);
  };
  // shoulder register: three great faces crying out of the metal, in a band like a frieze
  for (const [u, y, Hh, a] of [[-0.6, 440, 116, -0.25], [0.02, 420, 122, 0.05], [0.6, 446, 108, 0.3]]) W.sunkFace(f, on(u, y), Hh, a, '#566e5a', { tex: 'mottle102', skin: pale });
  // waist register: bodies crowding the hole, clawing at its rim, sinking at the waist
  relief(on(0.7, 1010), 0.3, 72, { front: [-2.3, 0.9, 0.85], back: [0.3, -0.6, 0.3], headTilt: -0.45 });
  relief(on(-0.72, 1110), -0.38, 62, { front: [2.1, -0.7, 0.8], back: [-0.5, 0.7, 0.3], headTilt: 0.5, headX: -0.1 });
  relief(on(0.12, 1160), -0.12, 50, { front: [-0.5, 0.4, 0.5], back: [0.7, -0.5, 0.6], headTilt: 0.2 });
  W.sunkFace(f, on(0.86, 760), 70, 0.6, '#566e5a', { tex: 'mottle102', skin: pale });
  W.sunkFace(f, on(-0.86, 820), 64, -0.6, '#566e5a', { tex: 'mottle102', skin: pale });
  for (const [u, y, a, sz] of [[-0.3, 560, -1.9, 34], [0.34, 590, -1.3, 32], [-0.86, 560, -0.8, 28], [0.9, 1250, -0.6, 30], [-0.92, 1300, -2.4, 30]]) B.hand(f, on(u, y), a, sz, pale, { spread: 0.6, curl: 0.25, shadow: P.skinS }); // hands pressed out of the metal
  // flare register, below the inscription: three more rising out of the sound bow, reaching up
  relief(on(-0.66, 1480), -0.22, 72, { front: [-0.3, 0.4, 0.3], back: [0.5, -0.3, 0.4], headTilt: 0.35 });
  relief(on(-0.08, 1510), 0.08, 62, { front: [-0.9, 0.4, 0.2], back: [0.2, -0.2, 0.5], headTilt: -0.1 });
  relief(on(0.52, 1460), 0.34, 78, { front: [-0.1, -0.5, 0.5], back: [1.0, 0.3, 0.3], headTilt: -0.4 });
  // a hand of one of them gripping the hole's rim from inside the metal
  B.hand(f, [HOLE[0] - hrx + 4, 700], 0.1, 30, pale, { spread: 0.3, curl: 0.8, shadow: P.skinS });
  // barnacles and mussels crusting the sound bow and shoulder; kelp hanging off the mouldings
  W.barnacles(f, on(-0.6, 1494), 120, 26, 16, 8, 16); W.barnacles(f, on(0.5, 1500), 110, 24, 14, 8, 15);
  W.barnacles(f, on(-0.3, 300), 120, 18, 10, 6, 13); W.barnacles(f, on(0.7, 340), 50, 18, 6, 6, 12);
  for (const [u, y, a] of [[0.3, 1500, 0.3], [0.34, 1508, -0.5], [0.38, 1498, 1.1], [0.33, 1516, 0.8], [-0.86, 1508, 0.2], [-0.82, 1516, -0.7]]) W.mussel(f, on(u, y), a, 2.4); // in clumps on the sound bow, not in pairs
  f.raw('</g>');
  for (const [u, y, l] of [[-0.75, 1135, 160], [-0.2, 1225, 120], [0.35, 1225, 200], [0.8, 1135, 140], [-0.45, 295, 180], [0.3, 335, 150]]) W.kelpHang(f, on(u, y), l, 12, (f.r() - 0.5) * 20);
  W.coral(f, on(-0.9, 1500), -2.4, 90, '#c2bba6'); W.coral(f, on(0.92, 1490), -0.8, 80, mix('#c2bba6', P.verd, 0.4));
  // a clean void rim round the hole: the bronze's cut edge, pale and perfectly round, the wall's thickness seen across it
  f.raw(`<ellipse cx="${HOLE[0]}" cy="${HOLE[1]}" rx="${hrx * 1.25}" ry="${hry * 1.2}" fill="#6a4aa0" opacity="0.12" filter="url(#soft102)"/>`);
  f.flat([...ell(HOLE, hrx, hry, 0, 40).slice(10, 31), ...ell(add(HOLE, [24, 0]), hrx - 20, hry - 6, 0, 40).slice(10, 31).reverse()], '#cfc8bc', { op: 0.9 });
  { const e = ell(HOLE, hrx + 2, hry + 2, 0, 40); f.line(e.concat([e[0]]), 6, '#e8e2d8', { op: 0.95 }); f.line(e.concat([e[0]]), 2, INK); }
  // canons on the crown: bronze loops the chain hangs from, one cracked
  f.part([[cx - 200, 156], [cx - 170, 120], [cx + 170, 120], [cx + 200, 156], [cx + 150, 172], [cx - 150, 172]], BR({ maxShade: 16 })); // crown plate
  for (const [dx, h, w] of [[-150, 66, 36], [-70, 92, 40], [70, 92, 40], [150, 66, 36]]) { const b0 = [cx + dx - w, 132], b1 = [cx + dx + w, 132], top = [cx + dx, 132 - h]; const o2 = [b0, add(b0, [-4, -h * 0.6]), add(top, [-w * 0.6, 0]), add(top, [w * 0.6, 0]), add(b1, [4, -h * 0.6]), b1, add(b1, [-18, 0]), add(b1, [-16, -h * 0.5]), add(top, [w * 0.3, 20]), add(top, [-w * 0.3, 20]), add(b0, [16, -h * 0.5]), add(b0, [18, 0])]; f.part(o2, BR({ maxShade: 14, inkW: 1.4 })); f.line([add(top, [-w * 0.4, 4]), add(top, [w * 0.3, 4])], 1.6, '#9cc0b0', { op: 0.6 }); }
  f.part(E.smooth(ell(ring0, 40, 52, 0, 16)) + ' ' + E.smooth(ell(ring0, 20, 30, 0, 16).reverse()), BR({ bbPts: ell(ring0, 40, 52), maxShade: 16, inkW: 1.4 }));
  f.line([[cx + 136, 110], [cx + 150, 128]], 2.4, INK);

  // ---------------- a broken length of chain dangling from a canon, over the shoulder
  f.bone('chain_loose');
  const cl = W.ironChain(f, [[cx + 150, 130], [cx + 260, 230], [cx + 330, 380], [cx + 350, 470]], 84, 20);
  { const [c, a] = cl[cl.length - 1]; const e = add(c, rot([40, 0], a)); f.part(limb(e, add(e, rot([30, 20], a)), 18, 14, { steps: 3 }), { fill: P.iron, shadow: '#141212', shade: 0.4, cast: false }); } // the sprung open link
  W.kelpHang(f, [cx + 300, 320], 200, 12, 8);

  // ---------------- one of the drowned half free of the bronze, reaching for the front rank
  f.bone('reacher');
  const r0 = on(0.86, 960), r1 = add(r0, [110, -40]), r2 = add(r1, [120, 60]);
  f.part(K.chain([add(r0, [-40, 0]), r1, r2], [84, 68, 56]), { fill: '#76967e', shadow: '#22342c', shade: 0.4, tex: 'mottle102', texOp: 0.7, maxShade: 24 });
  f.part(K.chain([lerp(r1, r2, 0.4), r2], [62, 56]), W.SK(f, { maxShade: 20, cast: false })); // the flesh showing where the metal has let go
  W.livid(f, lerp(r1, r2, 0.7), 20, 16, 4, 1.2);
  B.hand(f, add(r2, [12, 10]), 0.5, 42, P.skin, { spread: 0.5, curl: 0.45, shadow: P.skinS });
  W.verdigris(f, lerp(r0, r1, 0.5), 40, 20, 5, 0.6);
  W.drip(f, add(r2, [30, 50]), 2);

  // ---------------- silt piled against the lip, debris, bones; the toll's rings spreading on the water
  f.bone('floor');
  f.part([[90, 1572], [200, 1520], [420, 1540], [640, 1560], [960, 1562], [1200, 1540], [1420, 1522], [1520, 1570], [1500, 1596], [100, 1596]], { fill: '#323c38', shadow: '#141a18', shade: 0.3, tex: 'mottle102', texOp: 0.85, maxShade: 30 });
  for (const [x, y, a] of [[260, 1562, -0.3], [1310, 1566, 0.4]]) { f.part(ell([x, y], 34, 26, a, 14), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.4, cast: false }); f.flat(ell([x - 8, y - 4], 7, 8, 0, 8), '#1a1410'); f.flat(ell([x + 10, y - 4], 6, 7, 0, 8), '#1a1410'); f.flat([[x - 14, y + 10], [x + 16, y + 10], [x + 10, y + 22], [x - 10, y + 22]], P.boneD); } // skulls in the silt
  for (const [x, y, a] of [[420, 1576, 0.2], [1180, 1580, -0.3], [520, 1584, 1.2]]) f.part(limb([x - 40, y], [x + 40, y + a * 20], 12, 10, { steps: 4 }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.2, cast: false });
  W.coral(f, [160, 1580], -1.6, 70, '#c2bba6'); W.coral(f, [1440, 1580], -1.2, 60, mix('#c2bba6', P.verd, 0.4));
  for (const [x, l] of [[340, 140], [1260, 110]]) W.kelpStrand(f, [[x, 1590], [x + 10, 1590 - l * 0.4], [x - 6, 1590 - l * 0.8], [x + 8, 1590 - l]], 12);
  f.bone('rings');
  W.ripples(f, [cx, 1574], 720, 20, 3, '#7a98a8', 0.55);
  return f;
}

// ------------------------------------------------------------------ MOTHER OF BRINE (ruler 3)
// The harbour's fishwife and midwife, risen waist-deep from black water: a vast, sagging, drowned matron, her
// shoulders rounded under a dowager's hump, arms opened wide as if to take a child from you. Wet linen clings to her
// breasts and belly; her weed-dark hair floats upward as though she were still under the sea. Her daughters cling to her.
// Built in 3/4 view facing right (her front and near side to us): the near shoulder is on the left, the far on the right.
// Rig: water (root) > pelvis > torso > head > hair locks; arms; shawl; fins; the siren and two children.
function motherOfBrine() {
  const CW = 1600, CH = 1600;
  const f = new Fig(W.base(103, CH, { grimeY: 1700 }));
  const gy = f.o.groundY, H = 320;
  const skin = '#a9b4b8', skinS = '#3e4862', skinD = '#2a3046';
  const SKM = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.36, tex: 'mottle103', texOp: 0.7, maxShade: 90 }, o);
  const HAIR = (o = {}) => Object.assign({ fill: '#1e2414', shadow: '#0a0d06', shade: 0.42, tex: 'hatch103', texOp: 0.35, maxShade: 40, inkW: 1.4, inkHeavy: 2.4, cast: false }, o);
  const SHIFT = (o = {}) => Object.assign({ fill: '#5c6466', shadow: '#1e242c', shade: 0.4, tex: 'weave103', texOp: 0.55, maxShade: 90 }, o);
  const APR = (o = {}) => Object.assign({ fill: '#a2a496', shadow: '#454c58', shade: 0.4, tex: 'weave103', texOp: 0.55, maxShade: 80 }, o);
  const WOOL = (o = {}) => Object.assign({ fill: '#30362f', shadow: '#111412', shade: 0.4, tex: 'weave103', texOp: 0.45, maxShade: 60 }, o);
  const GOLD = (o = {}) => Object.assign({ fill: '#7a6636', shadow: '#33280f', shade: 0.45, tex: 'mottle103', texOp: 0.6, maxShade: 12, inkW: 1.1, inkHeavy: 1.6, cast: false }, o);
  const crease = (pts, w = 2.6, c = skinD, op = 0.8) => f.line(pts, w, c, { op });
  const sheen = (pts, w = 2) => f.line(pts, w, '#dfe8ea', { op: 0.45 }); // wet light on the turn of a form
  const salt = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const q = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.flat(ell(q, 1 + f.r() * 2.2, 1 + f.r() * 1.8, 0, 6), '#eef2f0', { op: 0.6 }); } };
  const WL = 1526; // the waterline at her hips
  const Nk = [815, 950], Pv = [770, 1580];
  const S = B.spine(Nk, [740, 1260], Pv, H);
  const SN = [578, 1004], EN = [384, 1246], WN = [226, 1168];   // near arm: opened low and wide, hand raised to receive
  const SF = [1012, 1004], EF = [1240, 1106], WF = [1372, 990]; // far arm: out toward the front rank, hand reaching
  const HC = [905, 742], hA = 0.3, HH = H;
  f.joint('water', [770, gy]).joint('pelvis', [770, 1500], 'water').joint('torso', [770, 1420], 'pelvis').joint('head', [850, 900], 'torso');
  f.joint('hair_1', add(HC, [-120, -100]), 'head').joint('hair_2', add(HC, [-20, -150]), 'head').joint('hair_3', add(HC, [80, -130]), 'head');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('shawl', [760, 900], 'torso').joint('fins', [560, 1530], 'pelvis');
  f.joint('siren', [1200, 1526], 'pelvis').joint('child_1', [770, 1526], 'pelvis').joint('child_2', [560, 1526], 'pelvis');

  // ---------------- the pool's far half
  f.bone('water');
  f.flat(ell([790, 1546], 720, 50, 0, 40), P.water);
  f.flat(ell([830, 1538], 580, 30, 0, 40), P.waterM, { op: 0.8 });

  // ---------------- floating hair: heavy wet locks lifting off the scalp and drifting up and back on the current
  // (her mark; it does not hang). Each lock is a tapered, twisting ribbon with strands inside it.
  // a0: lean (negative = back), wav: how far it snakes; the lock twists so its width breathes along it
  const lock = (root, a0, len, w0, ph, col, wav = 0.55) => {
    const n = 24, C = [root];
    for (let i = 1; i <= n; i++) { const t = i / n, a = a0 + wav * Math.sin(t * 7.5 + ph) * (0.25 + 0.75 * t) - 0.25 * t * t; C.push(add(C[i - 1], rot([0, -len / n], a))); }
    const L = [], R = [];
    C.forEach((q, i) => { const t = i / n, a = C[Math.min(n, i + 1)], b = C[Math.max(0, i - 1)], d = E.norm(sub(a, b)), nn = [-d[1], d[0]], w = w0 * (1 - t) ** 0.9 * (0.7 + 0.3 * Math.sin(t * 11 + ph)) / 2 + 1.2, tw = 0.45 + 0.55 * Math.abs(Math.cos(t * 6 + ph)); L.push(add(q, mul(nn, w * tw))); R.push(add(q, mul(nn, -w))); });
    f.part([...L, ...R.reverse()], HAIR({ fill: col }));
    for (let k = 0; k < 3; k++) { const o2 = (k / 2 - 0.5) * 0.6; f.line(C.slice(1, n - 3).map((q, i) => { const t = (i + 1) / n, a = C[i + 2], b = C[i], d = E.norm(sub(a, b)); return add(q, mul([-d[1], d[0]], o2 * w0 * (1 - t) ** 0.9 / 2)); }), 1, k === 1 ? P.kelpL : '#0a0d06', { op: k === 1 ? 0.5 : 0.6 }); }
    return C[n];
  };
  // big locks from the crown and the back of the skull, all drifting up and back; thin strands lifting between them
  const locks = [
    ['hair_1', [-0.44, 0.0], -1.15, 460, 70, 0.4, '#161c0e'], ['hair_1', [-0.46, -0.2], -0.95, 560, 84, 1.9, '#1e2412'], ['hair_1', [-0.4, -0.36], -0.72, 640, 90, 3.1, '#262e16'],
    ['hair_2', [-0.26, -0.46], -0.5, 700, 92, 0.9, '#1c2210'], ['hair_2', [-0.1, -0.52], -0.3, 620, 80, 2.5, '#2a3218'],
    ['hair_3', [0.06, -0.52], -0.12, 560, 70, 4.0, '#1e2412'], ['hair_3', [0.18, -0.46], 0.05, 420, 56, 5.2, '#262e16'],
  ];
  const hF = frame(HC, hA, HH);
  for (const [bn, r, a, len, w, ph, col] of locks) { f.bone(bn); lock(hF([r])[0], a, len, w, ph, col); }
  for (let i = 0; i < 16; i++) { f.bone(['hair_1', 'hair_2', 'hair_3'][i % 3]); const r = hF([[-0.46 + i * 0.042, -0.18 - Math.sin(i / 15 * Math.PI) * 0.34]])[0]; lock(r, -1.05 + i * 0.07 + (f.r() - 0.5) * 0.3, 280 + f.r() * 380, 12 + f.r() * 14, f.r() * 6, i % 3 ? '#2c3419' : '#3c4526', 0.7); }
  f.bone('hair_1'); W.frond(f, hF([[-0.36, -0.3]])[0], add(hF([[-0.36, -0.3]])[0], [-260, -380]), 40, '#2e3420');

  // ---------------- the shawl: rotted fishwife's wool round her back, its end hanging behind the near side
  f.bone('shawl');
  const shawl = [[720, 880], [800, 850], [900, 880], [990, 940], [1050, 990], [1000, 1010], [900, 960], [790, 930], [700, 940], [620, 952], [552, 988], [512, 1060], [490, 1160], [474, 1270], [470, 1380], [438, 1362], [428, 1240], [446, 1120], [486, 1012], [560, 948], [650, 910]];
  f.part(shawl, WOOL());
  for (let i = 0; i < 9; i++) { const q = lerp([416, 1250], [462, 1380], i / 8); f.part([add(q, [-7, -4]), add(q, [7, -4]), add(q, [3, 26 + (i % 3) * 12]), add(q, [-3, 30 + (i % 3) * 12])], WOOL({ inkW: 1, inkHeavy: 1.4, cast: false })); }
  for (const [a, b2] of [[[480, 1020], [436, 1200]], [[520, 1010], [450, 1300]], [[600, 950], [540, 990]]]) f.stroke([a, lerp(a, b2, 0.5), b2], 3, '#0c0e0c');
  f.flat(ell([440, 1180], 14, 10, 0.5, 10), '#06080a'); f.flat(ell([470, 1300], 10, 7, 0.2, 10), '#06080a'); // moth holes
  W.barnacles(f, [470, 1080], 30, 50, 6, 6, 12);

  // ---------------- far arm, behind the body at the shoulder, opened out toward the front rank
  f.bone('upperarm_f');
  f.part(limb(add(SF, [-20, -10]), EF, 200, 150, { p: [[0.18, 0.14, 0.15]], q: [[0.5, 0.3, 0.2]] }), SKM());
  crease([lp(SF, EF, 0.45, -64), lp(SF, EF, 0.62, -82), lp(SF, EF, 0.8, -70)], 2.2); // the sag of the underarm
  W.livid(f, lerp(SF, EF, 0.55), 50, 30, 7, 1.8); W.veins(f, lerp(SF, EF, 0.45), 40, 30, 3, 2); salt(lerp(SF, EF, 0.5), 60, 40, 16);
  W.barnacles(f, lp(SF, EF, 0.15, 60), 40, 20, 6, 7, 13);
  f.bone('forearm_f');
  f.part(limb(EF, WF, 144, 104, { p: [[0.22, 0.12, 0.2]], q: [[0.25, 0.08, 0.2]] }), SKM());
  for (let i = 0; i < 3; i++) crease([lp(EF, WF, 0.02 + i * 0.04, 50), lp(EF, WF, 0.05 + i * 0.04, 20), lp(EF, WF, 0.02 + i * 0.04, -10)], 1.4, skinD, 0.6); // elbow skin
  W.livid(f, lerp(EF, WF, 0.4), 50, 30, 6, 1.8); W.pucker(f, lerp(EF, WF, 0.8), Math.atan2(WF[1] - EF[1], WF[0] - EF[0]) + 1.4, 4, 40, 8); W.peel(f, lerp(EF, WF, 0.3), 4, 1.5, 40);
  W.kelpHang(f, lp(EF, WF, 0.45, -40), 170, 11, 8);
  for (let i = 0; i < 3; i++) W.drip(f, lp(EF, WF, 0.2 + i * 0.25, -60), 1.8);
  f.bone('hand_f');
  // her left hand reaching out over the front rank, palm down, the back of it to us, fingers drooping to take hold
  W.openHand(f, WF, -0.42, 214, { back: true, look: SKM({ maxShade: 26 }), spread: 0.12, curl: 0.45, swell: 0.3, thumbAng: 1.0, bend: [0.06, 0.02, 0, -0.03] });
  salt(add(WF, [50, -50]), 50, 40, 10);

  // ---------------- body: vast and soft, rounded shoulders on a dowager's hump, heavy breasts resting on the belly
  // the inner masses carry no outline: their volume comes from their own shading and from the creases between them
  f.bone('pelvis');
  f.part([[500, 1470], [760, 1460], [1120, 1470], [1130, 1560], [500, 1560]], SKM({ maxShade: 20 }));
  f.bone('torso');
  const torso = [[790, 792], [760, 860], [712, 908], [646, 938], [590, 956], [548, 990], [522, 1060], [520, 1150], [504, 1250], [490, 1360], [500, 1470], [510, 1560], [1110, 1560], [1140, 1480], [1152, 1400], [1126, 1322], [1096, 1292], [1098, 1232], [1088, 1170], [1058, 1098], [1032, 1036], [996, 1000], [944, 966], [908, 930], [900, 880]];
  f.part(torso, SKM({ maxShade: 160 }));
  const NI = { inkW: 0, inkHeavy: 0, cast: false };
  // the side plane turned from the light, the roll of fat over the hip, the hump of the upper back
  f.flat([[540, 1000], [522, 1100], [516, 1200], [500, 1320], [504, 1470], [570, 1470], [574, 1330], [584, 1200], [576, 1080]], skinD, { op: 0.32 });
  f.stroke([[496, 1336], [540, 1356], [590, 1354], [624, 1330]], 4, skinD); f.stroke([[512, 1250], [548, 1264], [584, 1256]], 2.6, skinD, { op: 0.7 });
  f.stroke([[690, 906], [740, 884], [772, 846]], 3, skinD, { op: 0.6 }); sheen([[620, 950], [680, 926], [730, 900]], 2.6);
  // belly: the great hanging mass under the breasts, its lower half in the water
  const belly = [[590, 1300], [700, 1286], [840, 1282], [980, 1282], [1080, 1294], [1138, 1350], [1160, 1420], [1148, 1500], [1110, 1566], [640, 1566], [570, 1500], [560, 1400]];
  f.part(belly, SKM(Object.assign({ maxShade: 130 }, NI)));
  f.line([[1096, 1294], [1138, 1350], [1160, 1420], [1150, 1500], [1124, 1550]], 3.6, INK); // the belly's profile
  // far breast in profile at the front edge, then the near breast, both heavy and low, resting on the belly
  const brF = [[960, 1094], [1022, 1112], [1070, 1170], [1098, 1240], [1092, 1296], [1050, 1326], [990, 1328], [944, 1304], [922, 1250], [928, 1160]];
  const brN = [[740, 1082], [830, 1080], [886, 1120], [914, 1196], [908, 1270], [870, 1318], [790, 1342], [708, 1330], [650, 1290], [630, 1220], [652, 1146]];
  const under = (pts, w) => { f.flat([...pts, ...pts.slice().reverse().map(q => add(q, [0, w * 3.4]))], skinD, { op: 0.55 }); f.stroke(pts, w, INK); }; // the crease under a breast, and its shadow on the belly
  f.part(brF, SKM(Object.assign({ maxShade: 80 }, NI))); under([[934, 1296], [990, 1330], [1052, 1328], [1094, 1294]], 4.4);
  f.line([[1058, 1098], [1088, 1170], [1098, 1232], [1094, 1282]], 3.6, INK); // the far breast's profile
  f.part(brN, SKM(Object.assign({ maxShade: 100 }, NI))); under([[640, 1274], [700, 1328], [796, 1346], [876, 1316], [908, 1264]], 5);
  f.stroke([[904, 1150], [916, 1210], [906, 1280]], 3, skinD, { op: 0.7 }); // between them
  // collarbones, the hollows above them, the notch; the crepe of an old chest
  f.flat([[870, 996], [820, 990], [740, 982], [670, 974], [700, 990], [800, 1000], [866, 1006]], skinD, { op: 0.28 });
  f.line([[884, 1012], [820, 1008], [748, 1000], [680, 992], [626, 984]], 4.4, '#dfe6e6', { op: 0.55 });
  crease([[884, 1020], [820, 1018], [748, 1010], [680, 1002]], 2.2, skinD, 0.75);
  f.line([[904, 1012], [950, 1006], [996, 998]], 3.6, '#dfe6e6', { op: 0.5 }); crease([[904, 1020], [950, 1014], [990, 1008]], 1.8, skinD, 0.7);
  f.flat([[880, 1004], [896, 1026], [910, 1004]], skinD, { op: 0.7 });
  for (let i = 0; i < 5; i++) crease([[870 - i * 4, 1030 + i * 10], [900, 1056 + i * 8], [926 + i * 4, 1032 + i * 10]], 1.1, skinD, 0.4);
  W.livid(f, [760, 1036], 90, 28, 10, 2); salt([740, 1030], 120, 30, 30);
  // the neck: short and thick, two cords standing out, a soft ring of fat, the wattle hanging from the jaw
  const neck = [[790, 800], [900, 820], [944, 900], [940, 960], [900, 1000], [840, 990], [780, 950], [756, 880]];
  f.part(neck, SKM(Object.assign({ maxShade: 26 }, NI)));
  f.line([[944, 904], [940, 960], [906, 998]], 3, INK, { op: 0.9 });
  crease([[904, 880], [884, 940], [874, 994]], 2.2, skinD, 0.55); crease([[862, 862], [840, 930], [826, 984]], 1.8, skinD, 0.45);
  W.livid(f, [850, 930], 40, 40, 6, 1.5);
  // barnacles crusting the near shoulder and the hump
  W.barnacles(f, [610, 958], 50, 16, 9, 8, 16); W.barnacles(f, [690, 930], 30, 12, 5, 6, 11); W.mussel(f, [548, 1010], 1.1, 2.2);

  // ---------------- the wet shift: grey linen clinging to every form below a torn neckline
  const clip = (id, poly, draw) => { f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(poly)}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">`); draw(); f.raw('</g>'); };
  const neckline = [[470, 1116], [560, 1098], [640, 1070], [720, 1062], [810, 1058], [880, 1062], [930, 1050], [984, 1022], [1016, 1006], [1060, 990]];
  const shiftReg = [...neckline, [1200, 990], [1220, 1600], [440, 1600], [440, 1116]];
  clip('shift103', shiftReg, () => {
    f.part(torso, SHIFT(Object.assign({ maxShade: 160, opacity: 0.94 }, NI)));
    f.part(belly, SHIFT(Object.assign({ maxShade: 130, opacity: 0.92 }, NI)));
    for (const [c, rx, ry, a] of [[[770, 1160], 110, 60, -0.3], [[1010, 1170], 50, 60, 0.4]]) f.flat(ell(c, rx, ry, a, 18), '#8a9294', { op: 0.35 }); // light on the upper slope of each breast
    for (const [c, rx, ry, a] of [[[760, 1170], 70, 50, -0.4], [[1040, 1190], 30, 50, 0.3], [[980, 1390], 110, 60, 0.2], [[540, 1200], 22, 70, 0]]) f.flat(ell(c, rx, ry, a, 16), skin, { op: 0.2 });
    under([[640, 1274], [700, 1328], [796, 1346], [876, 1316], [908, 1264]], 4); under([[934, 1296], [990, 1330], [1052, 1328], [1094, 1294]], 3.6);
    // drag folds: pulled from the far strap over the breasts, wrapped round the side roll, pooling at the hip
    for (const [a, m, b2] of [[[990, 1020], [900, 1080], [800, 1112]], [[1000, 1030], [962, 1100], [934, 1150]], [[600, 1100], [650, 1124], [690, 1114]], [[524, 1160], [560, 1192], [620, 1172]], [[508, 1290], [550, 1312], [600, 1300]], [[510, 1420], [560, 1442], [612, 1432]], [[540, 1380], [580, 1400], [604, 1396]]]) { f.stroke([a, m, b2], 3.4, '#141a20'); f.line([add(a, [-2, -4]), add(m, [0, -5]), add(b2, [2, -4])], 1.4, '#9aa2a2', { op: 0.5 }); }
  });
  f.line(neckline.slice(0, 6), 2.4, INK, { op: 0.9 }); f.line(neckline.slice(5), 2, INK, { op: 0.8 });
  for (let i = 0; i < 8; i++) { const q = lerp([490, 1112], [720, 1062], i / 7); f.line([q, add(q, [(f.r() - 0.5) * 8, 12 + f.r() * 18])], 1.3, '#8a9090', { op: 0.75 }); } // torn edge, loose threads
  f.part(K.chain([[984, 1024], [1010, 990], [1030, 960], [1020, 930]], [30, 28, 26, 22]), SHIFT({ maxShade: 10, cast: false, inkW: 1.2 })); // the far strap

  // ---------------- the midwife's apron: a linen bib from a strap round the neck, soaked translucent, clinging
  const bib = [[742, 1094], [826, 1086], [930, 1076], [1000, 1108], [1060, 1200], [1084, 1290], [1144, 1360], [1170, 1440], [1176, 1600], [630, 1600], [646, 1440], [668, 1330], [684, 1220], [700, 1130]];
  clip('apron103', bib, () => {
    f.part(belly, APR(Object.assign({ maxShade: 130, opacity: 0.95 }, NI)));
    f.part(bib, APR(Object.assign({ maxShade: 60, opacity: 0.95 }, NI)));
    f.flat([[660, 1230], [700, 1290], [780, 1318], [860, 1300], [906, 1256], [908, 1300], [870, 1336], [790, 1356], [700, 1344], [650, 1300]], '#3a414c', { op: 0.6 }); // the near breast's underside turning away
    f.flat([[940, 1250], [990, 1300], [1060, 1304], [1094, 1270], [1092, 1312], [1050, 1338], [990, 1340], [944, 1312]], '#3a414c', { op: 0.55 });
    f.flat([[900, 1130], [924, 1200], [918, 1290], [900, 1300], [896, 1210]], '#3a414c', { op: 0.5 }); // where the cloth sinks between them
    for (const [c, rx, ry, a] of [[[770, 1170], 104, 62, -0.25], [[1010, 1190], 46, 58, 0.4], [[1010, 1420], 120, 50, 0.1]]) f.flat(ell(c, rx, ry, a, 18), '#eeeee2', { op: 0.32 });
    for (const [c, rx, ry, a] of [[[700, 1240], 40, 70, 0.3], [[680, 1440], 40, 90, 0.1]]) f.flat(ell(c, rx, ry, a, 18), '#3a414c', { op: 0.35 }); // the side of each form, turned from the light
    for (const [c, rx, ry, a] of [[[780, 1180], 56, 44, -0.4], [[1030, 1200], 28, 44, 0.3], [[960, 1400], 120, 70, 0.2]]) f.flat(ell(c, rx, ry, a, 16), skin, { op: 0.26 }); // wet, see-through on the high points
    under([[640, 1274], [700, 1328], [796, 1346], [876, 1316], [908, 1264]], 3.4); under([[934, 1296], [990, 1330], [1052, 1328], [1094, 1294]], 3);
    // tension from the strap corners down over the breasts, a sag where it bridges between them, wrapping round the belly
    for (const [a, m, b2, w] of [[[756, 1100], [786, 1150], [794, 1210], 2.4], [[920, 1086], [900, 1130], [884, 1196], 2.2], [[832, 1092], [856, 1140], [866, 1180], 1.8],
      [[880, 1240], [906, 1272], [930, 1300], 2.4], [[690, 1400], [860, 1428], [1100, 1400], 2], [[680, 1480], [880, 1500], [1120, 1470], 2.2], [[1060, 1300], [1100, 1360], [1130, 1424], 2.4], [[700, 1350], [720, 1420], [700, 1500], 2]]) { f.stroke([a, m, b2], w, '#353c48'); f.line([add(a, [-3, -3]), add(m, [-3, -4]), add(b2, [-3, -3])], 1.2, '#e2e2d6', { op: 0.45 }); }
    for (let i = 0; i < 18; i++) { const q = [700 + f.r() * 420, 1160 + f.r() * 320]; f.line([q, add(q, [8 + f.r() * 18, 3 + f.r() * 8])], 1.1, '#454c58', { op: 0.5 }); }
    // old blood from a hundred births, never washed out, smeared and run; a darn; a tide line; salt
    for (const [u, v, r] of [[760, 1420, 34], [840, 1470, 26], [720, 1490, 22], [1040, 1460, 18]]) { const c = [u, v]; f.flat([add(c, [-r, -r * 0.2]), add(c, [-r * 0.2, -r * 0.5]), add(c, [r * 0.6, -r * 0.3]), add(c, [r, r * 0.4]), add(c, [r * 0.2, r * 0.9]), add(c, [-r * 0.1, r * 0.3]), add(c, [-r * 0.7, r * 0.5])], '#5a3a2e', { op: 0.42 }); f.line([add(c, [-r * 0.3, 0]), add(c, [-r * 0.2, r * 1.5])], 2, '#5a3a2e', { op: 0.4 }); }
    f.part([[694, 1250], [760, 1244], [766, 1290], [700, 1296]], APR({ fill: '#8c8e82', inkW: 1.2, inkHeavy: 1.4, cast: false })); f.stitches([[694, 1250], [760, 1244], [766, 1290], [700, 1296], [694, 1250]], '#e0dccc', 1);
    f.flat(ell([980, 1500], 160, 22, 0.05, 16), '#4e5648', { op: 0.35 });
    salt([900, 1200], 160, 80, 30);
  });
  // the apron's edges: the top hem, the sides where it lifts off the body
  f.line([[742, 1094], [826, 1086], [930, 1076]], 3, '#e0e0d4', { op: 0.6 }); f.line([[700, 1130], [742, 1096], [826, 1088], [930, 1078], [1000, 1110]], 2.2, INK, { op: 0.85 });
  f.line([[700, 1130], [684, 1220], [668, 1330], [646, 1440], [636, 1540]], 2.6, INK, { op: 0.85 });
  f.line([[1000, 1110], [1060, 1200], [1084, 1290]], 2, INK, { op: 0.7 });
  f.part(K.chain([[748, 1094], [770, 1040], [800, 990], [820, 950]], [22, 22, 20, 18]), APR({ maxShade: 8, cast: false, inkW: 1.2, inkHeavy: 1.6 }));
  f.part(K.chain([[926, 1080], [930, 1030], [924, 980]], [22, 20, 18]), APR({ maxShade: 8, cast: false, inkW: 1.2, inkHeavy: 1.6 }));
  // the pocket on the belly: the midwife's shears and a spool of thread
  const pk = [1010, 1470];
  f.part([add(pk, [-60, -14]), add(pk, [56, -22]), add(pk, [62, 64]), add(pk, [-54, 72])], APR({ fill: '#909284', inkW: 1.4, inkHeavy: 1.8, maxShade: 20 }));
  f.stitches([add(pk, [-56, -10]), add(pk, [52, -18])], '#e0dccc', 1);
  f.part([add(pk, [-32, -14]), add(pk, [-24, -80]), add(pk, [-12, -82]), add(pk, [-14, -14])], { fill: P.iron, shadow: '#141212', shade: 0.4, inkW: 1.2, cast: false });
  for (const dx of [-32, -10]) { const e = ell(add(pk, [dx, -92]), 11, 9, 0, 10); f.line(e.concat([e[0]]), 3.4, P.iron); }
  f.flat(ell(add(pk, [-20, -60]), 6, 10, 0, 8), '#8a4a22', { op: 0.6 });
  f.part(ell(add(pk, [26, -26]), 16, 22, 0, 10), { fill: '#6a5a3a', shadow: '#2a2010', shade: 0.4, inkW: 1.1, cast: false });
  for (let i = 0; i < 4; i++) f.line([add(pk, [12, -40 + i * 9]), add(pk, [40, -40 + i * 9])], 1, '#2a2010', { op: 0.6 });
  W.mussel(f, [1120, 1500], 0.6, 2.2); W.mussel(f, [1132, 1480], -0.3, 2); W.mussel(f, [652, 1500], 1.4, 2);
  W.kelpStrand(f, [[760, 1100], [740, 1200], [770, 1300], [744, 1420]], 10);
  // the string of drowned gold coins at her throat, sagging plumb on the upper chest
  for (let i = 0; i <= 10; i++) { const t = i / 10, q = lerp(lerp([800, 984], [870, 1080], t), lerp([870, 1080], [950, 990], t), t); f.part(ell(add(q, [0, 10]), 13, 15, 0.2, 12), GOLD()); f.line(ell(add(q, [0, 10]), 7, 8, 0.2, 8).slice(0, 5), 1, '#a89058', { op: 0.6 }); if (i % 3 === 0) W.verdigris(f, add(q, [0, 10]), 7, 7, 1, 0.7); }
  // apron strings floating upward from her waist like weed, as her hair does
  f.stroke([[1150, 1440], [1200, 1380], [1180, 1300], [1226, 1230], [1206, 1170]], 12, '#8e9288');
  f.stroke([[640, 1450], [600, 1400], [620, 1320], [584, 1260]], 11, '#8e9288');

  // ---------------- head: broad, heavy, old and grieving; the eyes a little too large and too wet
  f.bone('head');
  const NIh = { inkW: 0, inkHeavy: 0, cast: false };
  // the jowls and double chin hang below the jaw onto the neck
  f.part(hF([[-0.2, 0.3], [0.0, 0.44], [0.2, 0.5], [0.3, 0.56], [0.22, 0.68], [0.04, 0.7], [-0.14, 0.6], [-0.24, 0.44]]), SKM(Object.assign({ maxShade: 12 }, NIh)));
  f.line(hF([[-0.1, 0.62], [0.04, 0.7], [0.22, 0.68], [0.3, 0.57]]), 2, INK, { op: 0.7 });
  B.head(f, HC, HH, hA, { skin, jaw: 1.34, chin: -0.02, nose: 1.02, mouth: 'set', squint: -0.2, browW: 0.0001, faceShade: 0.9, jawShade: 0.22, lips: false, noEar: true, blind: true });
  // heavy cheeks sagging into jowls, the nasolabial fold cut deep, the mouth's corners dragged down
  f.part(hF([[0.02, 0.12], [0.18, 0.16], [0.27, 0.24], [0.3, 0.36], [0.24, 0.48], [0.1, 0.5], [-0.02, 0.4], [-0.06, 0.24]]), SKM(Object.assign({ maxShade: 24, fill: mix(skin, '#8a96a6', 0.15) }, NIh)));
  f.flat(hF([[0.0, 0.36], [0.12, 0.46], [0.22, 0.5], [0.12, 0.54], [-0.02, 0.48]]), skinD, { op: 0.2 }); // the jowl's underside
  crease(hF([[0.262, 0.13], [0.22, 0.22], [0.19, 0.3], [0.18, 0.39]]), 3, skinD, 0.9);
  crease(hF([[0.17, 0.34], [0.15, 0.43], [0.12, 0.52]]), 2.2, skinD, 0.75);
  // the mouth: lips parted a little, the corners pulled down in grief
  f.flat(hF([[0.18, 0.31], [0.24, 0.296], [0.3, 0.3], [0.32, 0.316], [0.29, 0.326], [0.23, 0.33], [0.19, 0.338]]), '#0c1014');
  f.flat(hF([[0.18, 0.31], [0.24, 0.292], [0.3, 0.298], [0.316, 0.31], [0.24, 0.304]]), P.lips, { op: 0.8 });
  f.flat(hF([[0.19, 0.336], [0.24, 0.33], [0.3, 0.326], [0.29, 0.352], [0.23, 0.36]]), mix(P.lips, skin, 0.3), { op: 0.85 });
  crease(hF([[0.175, 0.3], [0.17, 0.335], [0.16, 0.37]]), 1.8, INK, 0.8);
  for (let i = 0; i < 4; i++) f.line(hF([[0.2 + i * 0.03, 0.27], [0.205 + i * 0.03, 0.29]]), 0.9, INK, { op: 0.5 });
  f.line(hF([[0.19, 0.4], [0.24, 0.39], [0.29, 0.4]]), 1.2, skinD, { op: 0.6 });
  // brows: the inner ends lifted, the outer ends falling; furrows over the root of the nose
  f.stroke(hF([[-0.02, -0.11], [0.08, -0.13], [0.16, -0.165], [0.21, -0.185]]), 12, '#1c2210');
  f.stroke(hF([[0.255, -0.19], [0.3, -0.17], [0.345, -0.14]]), 8, '#1c2210');
  crease(hF([[0.2, -0.26], [0.22, -0.22], [0.24, -0.2]]), 1.6, skinD, 0.7); crease(hF([[0.06, -0.26], [0.14, -0.29], [0.22, -0.27]]), 1.4, skinD, 0.55); crease(hF([[0.02, -0.32], [0.12, -0.35], [0.24, -0.33]]), 1.2, skinD, 0.45);
  // the eyes: too large, filmed like a drowned eye, the iris clouded and the pupil only a smudge, set under heavy
  // drooping lids, the lower lids sagging off them, violet-rimmed and brimming with water that never stops
  for (const [c, rx, ry, far] of [[[0.12, -0.058], 0.086, 0.05, 0], [[0.3, -0.064], 0.036, 0.048, 1]]) {
    f.flat(hF(ell([c[0], c[1] + ry * 0.3], rx * 1.4, ry * 1.8, 0, 14)), skinD, { op: 0.6 }); // the deep socket
    const opn = [[c[0] - rx, c[1] + ry * 0.15], [c[0] - rx * 0.4, c[1] - ry * 0.55], [c[0] + rx * 0.5, c[1] - ry * 0.6], [c[0] + rx, c[1] - ry * 0.05], [c[0] + rx * 0.6, c[1] + ry * 0.7], [c[0], c[1] + ry * 0.92], [c[0] - rx * 0.6, c[1] + ry * 0.72]];
    f.flat(hF(opn), '#a7b1ae'); // the white, gone grey and wet
    const ic = [c[0] + rx * (far ? 0.05 : 0.14), c[1] + ry * 0.12];
    f.flat(hF(ell(ic, rx * (far ? 0.56 : 0.5), ry * 0.8, 0, 14)), '#5c6c74'); // a clouded iris
    f.flat(hF(ell(ic, rx * (far ? 0.4 : 0.36), ry * 0.6, 0, 12)), '#8e9ea2', { op: 0.6 }); // the film over it
    f.flat(hF(ell([ic[0] + rx * 0.04, ic[1] + ry * 0.04], rx * 0.16, ry * 0.26, 0, 10)), '#28303a', { op: 0.7 }); // the drowned pupil
    f.line(hF([[c[0] - rx * 0.7, c[1] + ry * 0.48], [c[0], c[1] + ry * 0.7], [c[0] + rx * 0.6, c[1] + ry * 0.45]]), 2, '#e8f4f6', { op: 0.7 }); // wet light along the lower curve
    // the heavy upper lid drooping over the top of the iris and down over the outer corner
    f.flat(hF([[c[0] - rx * 1.12, c[1] + ry * 0.2], [c[0] - rx * 0.4, c[1] - ry * 1.0], [c[0] + rx * 0.5, c[1] - ry * 1.1], [c[0] + rx * 1.14, c[1] - ry * 0.1], [c[0] + rx * 1.0, c[1] + ry * 0.24], [c[0] + rx * 0.5, c[1] - ry * 0.22], [c[0] - rx * 0.4, c[1] - ry * 0.2], [c[0] - rx * 0.96, c[1] + ry * 0.3]]), mix(skin, skinS, 0.32));
    f.line(hF([[c[0] - rx * 0.98, c[1] + ry * 0.3], [c[0] - rx * 0.4, c[1] - ry * 0.2], [c[0] + rx * 0.5, c[1] - ry * 0.22], [c[0] + rx * 1.02, c[1] + ry * 0.26]]), far ? 2.2 : 3, INK);
    f.line(hF([[c[0] - rx * 0.9, c[1] - ry * 0.6], [c[0] - rx * 0.1, c[1] - ry * 1.25], [c[0] + rx * 0.95, c[1] - ry * 0.7]]), 1.4, skinD, { op: 0.75 });
    // the lower lid sagging away from the eye: its wet violet inner rim shows, water standing on it
    f.flat(hF([[c[0] - rx * 0.8, c[1] + ry * 0.72], [c[0], c[1] + ry * 0.95], [c[0] + rx * 0.7, c[1] + ry * 0.66], [c[0] + rx * 0.6, c[1] + ry * 1.0], [c[0], c[1] + ry * 1.4], [c[0] - rx * 0.7, c[1] + ry * 1.05]]), '#56486a', { op: 0.8 });
    f.line(hF([[c[0] - rx * 0.8, c[1] + ry * 0.68], [c[0], c[1] + ry * 0.94], [c[0] + rx * 0.72, c[1] + ry * 0.64]]), 2.6, '#bfe0ea', { op: 0.95 });
    f.line(hF([[c[0] - rx * 0.8, c[1] + ry * 1.36], [c[0], c[1] + ry * 1.5], [c[0] + rx * 0.7, c[1] + ry * 1.0]]), 1.6, INK, { op: 0.6 });
    f.line(hF([[c[0] - rx * 0.9, c[1] + ry * 1.9], [c[0], c[1] + ry * 2.3], [c[0] + rx * 0.8, c[1] + ry * 1.9]]), 1.3, skinD, { op: 0.7 }); // bags
    f.line(hF([[c[0] - rx * 0.6, c[1] + ry * 2.7], [c[0] + rx * 0.2, c[1] + ry * 3.0], [c[0] + rx * 0.8, c[1] + ry * 2.7]]), 1, skinD, { op: 0.5 });
  }
  for (let i = 0; i < 3; i++) f.line(hF([[0.02, -0.05 + i * 0.03], [-0.04, -0.06 + i * 0.045]]), 1.2, skinD, { op: 0.6 }); // crow's feet
  // tears that do not stop: water running from both eyes down the cheek and dripping from the jaw
  f.stroke(hF([[0.1, 0.0], [0.09, 0.08], [0.1, 0.18], [0.08, 0.3], [0.06, 0.44]]), 5, '#a8d0dc', { op: 0.7 });
  f.stroke(hF([[0.29, -0.01], [0.28, 0.1], [0.27, 0.2]]), 3.4, '#a8d0dc', { op: 0.6 });
  W.drip(f, add(hF([[0.06, 0.46]])[0], [0, 6]), 1.8);
  // a sheen of salt and wet on the brow, cheekbone and nose; lividity pooled low in the jowl
  sheen(hF([[0.02, -0.38], [0.14, -0.4], [0.24, -0.36]]), 2.6); sheen(hF([[0.06, 0.08], [0.14, 0.1]]), 2); sheen(hF([[0.34, -0.02], [0.37, 0.06]]), 2);
  W.livid(f, hF([[-0.04, 0.4]])[0], 40, 30, 7, 1.6); salt(hF([[0.0, -0.2]])[0], 60, 50, 16); W.peel(f, hF([[-0.1, -0.1]])[0], 3, 1.4, 30);
  // wet hair plastered to the scalp and temple, lifting off the crown into the floating locks behind
  f.part(hF([[-0.4, 0.26], [-0.46, 0.08], [-0.42, -0.04], [-0.48, -0.18], [-0.4, -0.3], [-0.42, -0.42], [-0.3, -0.5], [-0.06, -0.58], [0.22, -0.54], [0.34, -0.42], [0.3, -0.36], [0.22, -0.42], [0.12, -0.36], [0.02, -0.42], [-0.06, -0.3], [-0.16, -0.14], [-0.2, 0.06], [-0.28, 0.3]]), HAIR({ fill: '#181e0f', maxShade: 30 }));
  for (let i = 0; i < 16; i++) { const a0 = hF([[-0.36 + i * 0.04, 0.1 - i * 0.04]])[0], b0 = hF([[-0.42 + i * 0.045, -0.5 + Math.abs(i - 8) * 0.01]])[0]; f.line([a0, add(lerp(a0, b0, 0.5), [-6, 0]), b0], i % 3 ? 1.2 : 2, i % 3 ? '#0a0d06' : P.kelpL, { op: i % 3 ? 0.6 : 0.45 }); } // wet strands pulled toward the crown
  for (let i = 0; i < 9; i++) { const r = hF([[-0.44 + i * 0.075, -0.3 - Math.sin(i / 8 * Math.PI) * 0.24]])[0]; lock(r, -0.95 + i * 0.1, 150 + (i % 3) * 50, 26 + (i % 2) * 10, i * 1.7, i % 2 ? '#222a16' : '#2c3419', 0.4); } // lifting off the scalp
  f.stroke(hF([[0.04, -0.4], [0.08, -0.26], [0.04, -0.12], [0.06, 0.02]]), 7, '#1c2210'); f.stroke(hF([[-0.18, -0.12], [-0.12, 0.06], [-0.14, 0.24], [-0.08, 0.38]]), 9, '#1c2210');

  // ---------------- a drowned child hiding its face in her near side, one small fist clutching her
  f.bone('child_2');
  { const c = [586, 1360], h = 104, a = 0.24, sk = W.SK(f, { maxShade: 30 }), smock = { fill: '#363e40', shadow: '#101416', shade: 0.4, tex: 'weave103', texOp: 0.5, maxShade: 40 };
    f.part([[506, 1560], [508, 1470], [530, 1426], [590, 1410], [640, 1430], [660, 1470], [662, 1560]], smock); // shoulders and back in a wet smock
    for (const [a2, b2] of [[[540, 1440], [536, 1530]], [[600, 1430], [610, 1520]]]) f.stroke([a2, lerp(a2, b2, 0.5), b2], 2.4, '#0a0e10');
    f.part(K.chain([[620, 1436], [650, 1390], [636, 1336]], [32, 28, 24]), sk); // its arm reaching up her side
    B.hand(f, [634, 1318], -1.75, 26, P.skin, { spread: 0.5, curl: 0.5, shadow: P.skinS }); // the small hand spread on her, clinging
    B.head(f, c, h, a, { skin: P.skin, jaw: 0.86, chin: -0.06, nose: 0.82, mouth: 'set', squint: 0.75, faceShade: 0.7, jawShade: 0.5, iris: '#c8cec6', eyeWhite: '#e4e6de', hairCol: '#1a2010', browCol: '#3a4230', noEar: true });
    const cF = frame(c, a, h);
    f.part(cF([[-0.48, 0.26], [-0.48, -0.3], [-0.16, -0.58], [0.22, -0.52], [0.36, -0.32], [0.3, -0.12], [0.18, -0.24], [0.02, -0.2], [-0.14, 0.0], [-0.28, 0.32]]), HAIR({ fill: '#1a2010', maxShade: 20 }));
    for (let i = 0; i < 4; i++) W.kelpHang(f, cF([[-0.42 + i * 0.09, -0.22 + i * 0.04]])[0], 50 + i * 16, 5, 1, { col: '#1a2010', drip: i % 2 === 0 });
    W.livid(f, cF([[0.0, 0.3]])[0], 16, 12, 4, 1); }

  // ---------------- a drowned child at her belly, its back against her, staring out at the front rank
  f.bone('child_1');
  { const c = [806, 1344], h = 112, a = -0.05, sk = W.SK(f, { maxShade: 30 }), smock = { fill: '#3a4242', shadow: '#101416', shade: 0.4, tex: 'weave103', texOp: 0.5, maxShade: 50 };
    f.part(K.chain([[742, 1446], [716, 1486], [708, 1520]], [32, 28, 24]), sk); B.fist(f, [706, 1530], 1.7, 21, P.skin, { shadow: P.skinS }); // the near arm, its hand in the apron
    f.part([[726, 1560], [732, 1470], [752, 1426], [804, 1410], [862, 1420], [888, 1458], [892, 1560]], smock);
    for (const [a2, b2] of [[[760, 1452], [770, 1520]], [[846, 1450], [856, 1530]]]) f.stroke([a2, lerp(a2, b2, 0.5), b2], 2.4, '#0a0e10');
    f.part(K.chain([[868, 1446], [890, 1480], [896, 1510]], [32, 28, 24]), sk); // the far arm down at its side
    B.fist(f, [898, 1520], 1.6, 22, P.skin, { shadow: P.skinS }); // clutching a fistful of the apron
    for (let i = 0; i < 4; i++) f.line([[898, 1514], [880 + i * 14, 1460 - (i % 2) * 10]], 1.4, '#353c48', { op: 0.6 });
    f.part(K.chain([[794, 1422], [800, 1396]], [46, 42]), sk); // the thin neck
    B.head(f, c, h, a, { skin: P.skin, jaw: 0.86, chin: -0.05, nose: 0.82, mouth: 'set', squint: -0.5, faceShade: 0.7, jawShade: 0.45, iris: '#c8cec6', eyeWhite: '#e4e6de', hairCol: '#1a2010', browCol: '#3a4230', noEar: true, blind: true,
      hair: [[-0.48, 0.2], [-0.48, -0.34], [-0.14, -0.6], [0.24, -0.54], [0.36, -0.36], [0.18, -0.38], [0.06, -0.28], [-0.1, -0.3], [-0.22, -0.04], [-0.3, 0.24]] });
    const cF = frame(c, a, h);
    for (const [ex, er] of [[0.125, 0.05], [0.295, 0.028]]) { f.flat(cF(ell([ex, -0.06], er, 0.032, 0, 10)), '#dfe2da'); f.line(cF([[ex - er, -0.06], [ex, -0.09], [ex + er, -0.064]]), 1.8, INK); } // white, staring
    f.flat(cF([[0.18, 0.27], [0.27, 0.26], [0.3, 0.3], [0.26, 0.35], [0.2, 0.34]]), '#0c1012'); f.line(cF([[0.18, 0.27], [0.27, 0.26], [0.3, 0.29]]), 2.4, P.lips, { op: 0.9 }); // the mouth hanging open, blue lips
    f.flat(cF([[0.04, 0.02], [0.14, 0.04], [0.16, 0.1], [0.04, 0.1]]), '#5a6a8a', { op: 0.4 });
    for (let i = 0; i < 4; i++) W.kelpHang(f, cF([[-0.42 + i * 0.09, -0.26 + i * 0.05]])[0], 46 + i * 12, 5, 1, { col: '#1a2010', drip: i % 3 === 0 });
    W.drip(f, cF([[0.24, 0.4]])[0], 1.2); W.livid(f, [810, 1490], 40, 30, 5, 1.2); }

  // ---------------- a siren, one of her daughters, half out of the water at her far hip, arched back against her and singing
  f.bone('siren');
  { const sH = 100, sC = [1246, 1226], sA = -0.5, sSk = '#b8c4c6', sSh = '#4a5670';
    const SS = (o = {}) => Object.assign({ fill: sSk, shadow: sSh, shade: 0.36, tex: 'mottle103', texOp: 0.5, maxShade: 46 }, o);
    // her hair floats up and back like her mother's
    for (let i = 0; i < 7; i++) lock(add(sC, [-40 + i * 9, -20 - i * 4]), -1.35 + i * 0.1, 200 + i * 30, 30 - i * 2, i * 1.3, i % 2 ? '#2a3218' : '#1e2414', 0.6);
    // a girl's thin torso arched back against her mother: shoulders, the ribcage under the skin, a pinched waist,
    // then pale scales and the start of the eel tail under the water
    const sb = [[1166, 1540], [1172, 1470], [1186, 1410], [1178, 1352], [1180, 1310], [1214, 1290], [1268, 1288], [1296, 1316], [1292, 1366], [1272, 1420], [1270, 1470], [1288, 1540]];
    f.part(sb, SS());
    f.line([[1210, 1300], [1240, 1312], [1270, 1300]], 1.6, sSh, { op: 0.8 }); // collarbones
    f.flat([[1250, 1330], [1288, 1340], [1284, 1380], [1256, 1372]], sSh, { op: 0.3 }); // the small breast's shadow
    for (let i = 0; i < 5; i++) f.line([[1194 + i * 2, 1350 + i * 14], [1228, 1356 + i * 14], [1256 - i * 3, 1350 + i * 14]], 1.3, sSh, { op: 0.7 }); // ribs
    f.stroke([[1270, 1420], [1260, 1440], [1270, 1470]], 2, sSh, { op: 0.6 });
    for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) f.line(ell([1192 + k * 28 + (r % 2) * 14, 1456 + r * 22], 12, 7, 0, 8).slice(0, 5), 1.2, '#3a4a5a', { op: 0.75 }); // scales from the waist down
    // her near arm wrapped back round her mother's waist, the webbed hand on the wet apron
    f.part(K.chain([[1198, 1316], [1150, 1366], [1104, 1392]], [40, 34, 28]), SS({ cast: false }));
    B.hand(f, [1092, 1398], 2.9, 28, sSk, { spread: 0.6, curl: 0.35, shadow: sSh });
    f.line([[1076, 1386], [1070, 1404], [1082, 1418]], 1, '#6a7a80', { op: 0.7 }); // webbing
    f.part(K.chain([[1240, 1296], [1250, 1270]], [40, 36]), SS({ cast: false })); // neck
    B.head(f, sC, sH, sA, { skin: sSk, jaw: 0.86, chin: -0.06, nose: 0.88, mouth: 'set', squint: 0.1, faceShade: 0.6, lips: false, lashes: true, iris: '#1c2430', eyeWhite: '#d8dcd4', hairCol: '#1e2414', browCol: '#2a3020', noEar: true,
      hair: [[-0.46, 0.2], [-0.46, -0.3], [-0.16, -0.56], [0.2, -0.52], [0.32, -0.36], [0.1, -0.38], [-0.12, -0.26], [-0.24, 0.0], [-0.32, 0.3]] });
    // the mouth open far too wide in song, rows of fine needle teeth inside
    const sF = frame(sC, sA, sH);
    f.flat(sF([[0.17, 0.26], [0.26, 0.24], [0.33, 0.28], [0.34, 0.46], [0.28, 0.62], [0.2, 0.6], [0.16, 0.4]]), '#0a0c10');
    for (let i = 0; i < 5; i++) { f.flat(sF([[0.19 + i * 0.03, 0.265], [0.205 + i * 0.03, 0.3], [0.22 + i * 0.03, 0.262]]), '#d8d8cc'); f.flat(sF([[0.2 + i * 0.026, 0.59], [0.212 + i * 0.026, 0.55], [0.224 + i * 0.026, 0.59]]), '#c8c8bc'); }
    f.line(sF([[0.17, 0.26], [0.26, 0.24], [0.33, 0.28]]), 2, '#4a5a7a'); }

  // ---------------- near arm, opened low and wide, the forearm raised and the palm turned up as if to take a child
  // drawn without an outline where it grows out of the shoulder, so the deltoid flows out of the trapezius
  f.bone('upperarm_n');
  { const ua = limb(add(SN, [-12, 22]), EN, 192, 150, { p: [[0.22, 0.12, 0.14]], q: [[0.52, 0.34, 0.2]] });
    f.part(ua, SKM({ inkW: 0, inkHeavy: 0 }));
    f.line(ua.slice(5, 15), 3.6, INK); f.line(ua.slice(15, 20), 3.6, INK); f.line(ua.slice(20, 30), 3.8, INK); }
  crease([lp(SN, EN, 0.24, 40), lp(SN, EN, 0.38, 60), lp(SN, EN, 0.5, 66)], 2, skinD, 0.55); // the deltoid's edge
  crease([lp(SN, EN, 0.35, -70), lp(SN, EN, 0.55, -98), lp(SN, EN, 0.8, -78)], 2.4, skinD, 0.75); // the hanging flesh under the arm
  for (let i = 0; i < 3; i++) crease([lp(SN, EN, 0.88 + i * 0.03, -60), lp(SN, EN, 0.92 + i * 0.03, -20), lp(SN, EN, 0.9 + i * 0.03, 20)], 1.6, skinD, 0.6);
  sheen([lp(SN, EN, 0.12, 92), lp(SN, EN, 0.3, 98), lp(SN, EN, 0.5, 88)], 2.6);
  W.barnacles(f, lp(SN, EN, 0.1, 66), 46, 22, 8, 8, 15);
  W.livid(f, lerp(SN, EN, 0.62), 50, 40, 8, 2); W.veins(f, lerp(SN, EN, 0.5), 40, 40, 4, 2); W.peel(f, lerp(SN, EN, 0.75), 4, 1.5, 40); salt(lerp(SN, EN, 0.4), 70, 50, 20);
  W.voidHole(f, lp(SN, EN, 0.52, 18), 30, 26, 0.4); // the void has taken a clean round piece out of her arm
  f.part(K.chain([lp(SN, EN, 0.24, 94), lp(SN, EN, 0.34, 40), lp(SN, EN, 0.36, -10), lp(SN, EN, 0.3, -90)], [16, 18, 18, 14]), SHIFT({ maxShade: 6, cast: false, inkW: 1.1, inkHeavy: 1.4 })); // the shift's strap, slipped off the shoulder
  f.bone('forearm_n');
  f.part(limb(EN, WN, 150, 106, { p: [[0.22, 0.12, 0.2]], q: [[0.2, 0.1, 0.2]] }), SKM());
  for (let i = 0; i < 3; i++) crease([lp(EN, WN, 0.02 + i * 0.04, -54), lp(EN, WN, 0.05 + i * 0.04, -24), lp(EN, WN, 0.02 + i * 0.04, 6)], 1.4, skinD, 0.55);
  crease([lp(EN, WN, 0.12, 40), lp(EN, WN, 0.4, 44), lp(EN, WN, 0.8, 32)], 1.8, skinD, 0.5); // the flexor groove
  W.peel(f, lerp(EN, WN, 0.5), 5, 1.6, 50); W.kelpHang(f, lp(EN, WN, 0.3, -50), 180, 12, 8); W.pucker(f, lerp(EN, WN, 0.7), Math.atan2(WN[1] - EN[1], WN[0] - EN[0]) + 1.5, 4, 40, 8);
  W.livid(f, lerp(EN, WN, 0.6), 40, 30, 6, 1.6);
  for (let i = 0; i < 3; i++) W.drip(f, lp(EN, WN, 0.3 + i * 0.25, -60), 1.8);
  f.bone('hand_n');
  // her right palm, turned up and in toward her, the long swollen fingers loosely cupped to receive
  W.openHand(f, WN, -2.55, 218, { look: SKM({ maxShade: 24 }), spread: 0.09, curl: 0.55, swell: 0.3, thumbAng: 0.85, bend: [0.1, 0.04, 0, -0.04] });

  // ---------------- the near half of the pool: black water lapping round her hips, ripples, weed on the surface
  f.bone('water');
  f.flat([[40, 1556], [300, 1536], [600, WL], [1000, WL - 2], [1360, 1530], [1540, 1552], [1460, 1590], [1000, 1600], [400, 1600], [100, 1590]], P.water, { op: 0.96 });
  { const e = ell([800, WL + 6], 420, 18, 0, 30); f.line(e.slice(1, 15), 4, '#a8c0cc', { op: 0.55 }); f.line(e.slice(2, 14).map(q => add(q, [0, 8])), 1.6, '#7a98a8', { op: 0.6 }); }
  for (const [c, rx] of [[[580, WL + 4], 90], [[810, WL + 6], 90], [[1220, WL + 4], 80]]) { const e = ell(c, rx, 10, 0, 20); f.line(e.slice(1, 10), 2.4, '#a8c0cc', { op: 0.5 }); }
  W.ripples(f, [800, WL + 10], 480, 22, 4, '#6a8898', 0.5);
  // her lower body dissolving into kelp and long fins, seen just under the surface and breaking it
  f.bone('fins');
  for (const [a, b2, w] of [[[560, 1540], [140, 1506], 60], [[660, 1550], [260, 1576], 46], [[980, 1548], [1380, 1520], 40], [[1080, 1556], [1480, 1584], 34]]) W.frond(f, a, b2, w, '#2e3420');
  const fin = [[600, 1540], [480, 1512], [330, 1490], [190, 1494], [80, 1512], [170, 1530], [300, 1540], [460, 1548]];
  f.part(fin, { fill: '#46565a', shadow: '#1a2228', shade: 0.4, tex: 'mottle103', texOp: 0.6, maxShade: 20, opacity: 0.75 });
  for (let i = 0; i < 9; i++) f.line([lerp([560, 1536], [150, 1506], i / 9), lerp([520, 1514], [110, 1502], i / 9)], 1.3, '#1a2228', { op: 0.7 });
  f.line([[600, 1538], [480, 1510], [320, 1488], [190, 1492], [80, 1510]], 2, '#9ab0b8', { op: 0.45 });
  for (const [a, b2] of [[[300, 1560], [120, 1580]], [[1300, 1556], [1480, 1572]], [[700, 1576], [560, 1592]]]) W.frond(f, a, b2, 34, '#2e3420');
  return f;
}

module.exports = {
  heroes: [
    { key: 'drowned_king', name: 'The Drowned King', tier: 'ruler', w: 1600, h: 1600, flip: true, build: drownedKing },
    { key: 'bell_below', name: 'The Bell Below', tier: 'ruler', w: 1600, h: 1600, flip: true, build: bellBelow },
    { key: 'mother_of_brine', name: 'Mother of Brine', tier: 'ruler', w: 1600, h: 1600, flip: true, build: motherOfBrine },
    { key: 'grasping_deep', name: 'The Grasping Deep', tier: 'elite', w: 1100, h: 1400, flip: true, build: graspingDeep },
  ],
};
