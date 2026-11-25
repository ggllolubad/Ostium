// Shared armour and gear shapes.
'use strict';
const E = require('./engine');
const { add, sub, mul, rot, frame, ell, mix, lerp, lp } = E;

// curved plate lame, sharp ends. c = top centre
function lame(c, w, h, ang = 0, bend = 6) {
  const F = frame(c, ang, 1);
  return F([[-w / 2, bend * 0.3, 1], [-w / 4, -bend * 0.6], [w / 4, -bend * 0.6], [w / 2, bend * 0.3, 1], [w / 2 - 2, h + bend * 0.3, 1], [w / 4, h - bend * 0.5], [-w / 4, h - bend * 0.5], [-w / 2 + 2, h + bend * 0.3, 1]]);
}
// knee cop with side wing. dir = +1 wing on the left of the knee
// Articulated: lame above, lame below, faceted cop with a medial ridge, fan wing on the outside.
// local +y runs down the limb. Also used as a couter at the elbow.
function poleyn(f, knee, ang, s, col, colD) {
  const F = frame(knee, ang, s * 1.22), ink = f.o.ink, lt = mix(col, '#fff', 0.45);
  // fan wing, ragged and dented
  f.part(F([[-0.25, -0.22], [-0.92, -0.55, 1], [-1.1, -0.05], [-1.02, 0.32, 1], [-0.82, 0.62, 1], [-0.28, 0.36]]), { fill: colD, shade: 0.45, inkW: 1.3 });
  f.line(F([[-0.35, -0.1], [-0.9, -0.3]]), 1, ink, { op: 0.5 }); f.line(F([[-0.35, 0.15], [-0.95, 0.3]]), 1, ink, { op: 0.5 });
  // articulating lames
  f.part(F([[-0.5, -1.0, 1], [0.0, -1.08], [0.5, -0.98, 1], [0.54, -0.62], [0.0, -0.52], [-0.52, -0.62]]), { fill: colD, shade: 0.5, inkW: 1.2, cast: false });
  f.part(F([[-0.48, 0.56], [0.0, 0.66], [0.5, 0.56], [0.46, 0.98, 1], [0.0, 1.06], [-0.44, 0.98, 1]]), { fill: colD, shade: 0.5, inkW: 1.2, cast: false });
  f.line(F([[-0.4, -0.9], [0.4, -0.9]]), 0.9, lt, { op: 0.5 }); f.line(F([[-0.38, 0.72], [0.38, 0.72]]), 0.9, lt, { op: 0.5 });
  // the cop: faceted, ridge off-centre toward the light, flattened sides
  f.part(F([[0.0, -0.78, 1], [0.42, -0.52], [0.6, -0.05, 1], [0.48, 0.45], [0.05, 0.74, 1], [-0.38, 0.5], [-0.56, 0.0, 1], [-0.42, -0.5]]), { fill: col, shade: 0.5, k: 0.6 });
  f.line(F([[-0.02, -0.72], [0.04, -0.05], [0.04, 0.7]]), 1.5, ink, { op: 0.7 });
  f.line(F([[-0.08, -0.66], [-0.04, -0.05], [-0.04, 0.6]]), 1, lt, { op: 0.6 });
  f.flat(F([[0.1, 0.05], [0.42, 0.1], [0.36, 0.42], [0.08, 0.6]]), '#000', { op: 0.18 });
  f.rivet(F([[-0.34, -0.3]])[0], 2.2); f.rivet(F([[-0.34, 0.3]])[0], 2.2);
  f.rivet(F([[0.34, -0.82]])[0], 1.8); f.rivet(F([[0.32, 0.82]])[0], 1.8);
}
// lead ostium badge: an arched door token with a dark doorway, hung from `top` on a cord loop. s ~ badge half-width
function badge(f, top, s, col = '#73767a', ang = 0) {
  const F = frame(top, ang, s), ink = f.o.ink;
  f.line(F(ell([0, -0.05], 0.22, 0.22, 0, 8).concat([ell([0, -0.05], 0.22, 0.22, 0, 8)[0]])), 1.1, ink);
  f.part(F([[-0.62, 1.55, 1], [-0.64, 0.75], [-0.5, 0.36], [0.0, 0.14], [0.5, 0.36], [0.64, 0.75], [0.62, 1.55, 1]]), { fill: col, shade: 0.45, inkW: 1.1, inkHeavy: 1.8, cast: false });
  f.flat(F([[-0.27, 1.38], [-0.27, 0.78], [-0.18, 0.56], [0.0, 0.48], [0.18, 0.56], [0.27, 0.78], [0.27, 1.38]]), '#121010');
  f.flat(F([[-0.27, 1.38], [-0.27, 0.78], [-0.18, 0.56], [-0.08, 0.52], [-0.12, 1.38]]), mix(col, '#000', 0.25));
  f.line(F([[-0.5, 1.5], [-0.52, 0.8], [-0.36, 0.44]]), 0.9, mix(col, '#fff', 0.5), { op: 0.7 });
  f.flat(F(ell([0.4, 1.0], 0.07, 0.07, 0, 6)), '#2a2a2a');
}
// gauntlet fingers hooked over an edge: base = where the knuckles sit on the far side, dir = which way the fingers point
// (pointing from behind the object toward the viewer side), n fingers stacked along `along`
function fingersOver(f, base, along, dir, s, col, n = 4) {
  const ink = f.o.ink;
  for (let i = 0; i < n; i++) {
    const b = add(base, mul(along, i * s * 0.32)), l = s * (i === 0 || i === n - 1 ? 0.48 : 0.56);
    const tip = add(b, mul(dir, l));
    f.part(E.limb(b, tip, s * 0.3, s * 0.26, { steps: 4, capK: 0.9 }), { fill: col, shade: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false });
    f.line([add(b, mul(dir, l * 0.5)), add(add(b, mul(dir, l * 0.5)), mul(along, s * 0.12))], 1, ink, { op: 0.7, straight: true });
  }
}
// layered pauldron on a shoulder point. side: +1 drapes toward the right
function pauldron(f, sh, s, ang, col, colD, n = 3) {
  for (let i = n - 1; i >= 0; i--) f.part(lame(add(sh, rot([0, s * (0.35 + i * 0.32)], ang)), s * (1.9 - i * 0.15), s * 0.42, ang, s * 0.22), { fill: i % 2 ? colD : col, shade: 0.5, inkW: 1.4 });
  const F = frame(sh, ang, s);
  f.part(F([[-1.0, 0.4, 1], [-0.85, -0.25], [-0.4, -0.62], [0.2, -0.68], [0.75, -0.42], [1.02, 0.15], [0.95, 0.5, 1], [0.4, 0.36], [-0.3, 0.38]]), { fill: col, shade: 0.55 });
  f.line(F([[-0.6, 0.2], [-0.4, -0.35], [0.1, -0.5]]), 1.3, f.o.ink, { op: 0.5 });
  for (let i = 0; i < 3; i++) f.rivet(F([[-0.6 + i * 0.6, 0.28 - (i === 1 ? 0.06 : 0)]])[0], 2.6);
}
// a hem of cloth or mail, jagged
function hem(pts, f, r = 4) { return pts.map((p, i) => i % 2 ? add(p, [(f.r() - 0.5) * r, f.r() * r]) : p); }

module.exports = { lame, poleyn, pauldron, hem, badge, fingersOver };
// flanged mace head at p, haft direction ang (pointing from grip to head), size s
function maceHead(f, p, ang, s, col = '#4d5055') {
  const F = frame(p, ang, s);
  const fins = [[-0.95, 0.55], [-0.55, 0.85], [0.0, 1.0], [0.55, 0.85], [0.95, 0.55]];
  // back fins first
  f.part(F([[-0.9, -0.25, 1], [0.55, -0.25, 1], [0.75, -0.62], [0.15, -1.0, 1], [-0.55, -0.7]]), { fill: mix(col, '#000', 0.25), shade: 0.4, inkW: 1.2 });
  f.part(F([[-0.9, 0.25, 1], [0.55, 0.25, 1], [0.75, 0.62], [0.15, 1.0, 1], [-0.55, 0.7]]), { fill: mix(col, '#000', 0.1), shade: 0.45, inkW: 1.2 });
  f.part(F([[-0.95, -0.32, 1], [0.7, -0.3, 1], [0.95, 0.0, 1], [0.7, 0.3, 1], [-0.95, 0.32, 1]]), { fill: col, shade: 0.5, inkW: 1.3 });
  f.part(F([[-0.8, -0.12, 1], [0.6, -0.55], [1.05, -0.1, 1], [0.6, 0.12], [-0.8, 0.12, 1]]), { fill: mix(col, '#fff', 0.12), shade: 0.45, inkW: 1.2 });
  f.part(F(ell([-1.1, 0], 0.18, 0.4, 0, 8)), { fill: mix(col, '#000', 0.2), shade: 0.4, inkW: 1 });
  f.part(F(ell([1.12, 0], 0.16, 0.16, 0, 8)), { fill: col, shade: 0.4, inkW: 1 });
}
module.exports.maceHead = maceHead;
// swept rapier hilt at the guard point gh, blade angle bA, scale s (~1 = 20 px), metal col. side: +1/-1 flips the bow
function rapierHilt(f, gh, bA, s, col = '#77716a', o = {}) {
  const P = (x, y) => add(gh, rot([x * s, y * s * (o.side || 1)], bA)), ink = f.o.ink, lt = mix(col, '#fff', 0.45);
  const W = (o.w || 2.6) * Math.max(0.8, s / 20 * 1.2);
  const ringL = (pts, w) => { f.line(pts, w + 1.8, ink); f.line(pts, w, col); f.line(pts, Math.max(0.8, w * 0.35), lt, { op: 0.7 }); };
  const back = o.only !== 'front', front = o.only !== 'back';
  if (back) {
  // grip with wire wrap, pommel
  const g0 = P(-1.35, 0), g1 = P(-0.12, 0);
  f.part(E.limb(g0, g1, s * 0.42, s * 0.36, { steps: 4 }), { fill: o.grip || '#2a2018', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false });
  for (let i = 1; i < 6; i++) f.line([P(-1.35 + i * 0.21, -0.19), P(-1.28 + i * 0.21, 0.19)], 0.9, mix(col, '#fff', 0.2), { straight: true, op: 0.8 });
  f.part(ell(P(-1.58, 0), s * 0.3, s * 0.26, bA, 10), { fill: col, shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false });
  // side ring seen in perspective (behind the quillon)
  ringL(ell(P(0.22, 0.32), s * 0.24, s * 0.5, bA + 0.25, 14).concat([ell(P(0.22, 0.32), s * 0.24, s * 0.5, bA + 0.25, 14)[0]]), W * 0.8);
  f.part([P(0, -0.12), P(0.7, -0.1), P(0.7, 0.1), P(0, 0.12)], { fill: mix(col, '#fff', 0.3), shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, sharp: true });
  }
  if (!front) return;
  // knuckle bow sweeping from the quillon back to the pommel, plus two counter-guard branches
  ringL([P(0.0, 0.7), P(-0.45, 1.12), P(-1.1, 1.05), P(-1.55, 0.3)], W);
  ringL([P(0.0, 0.6), P(-0.5, 0.82), P(-0.95, 0.55)], W * 0.75);
  ringL([P(0.02, 0.5), P(0.5, 0.75), P(0.62, 0.35)], W * 0.7);
  // quillon bar with a turned-down end
  ringL([P(0.0, -1.0), P(0.06, -0.5), P(0.0, 0.0), P(0.0, 0.7)], W * 1.1);
  ringL([P(0.0, -1.0), P(-0.22, -1.1)], W);
}
module.exports.rapierHilt = rapierHilt;
