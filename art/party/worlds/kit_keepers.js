// Abbey keeper helpers (worlds/keepers.js). Everything matches Mother Hild in dirAC2.js: the warm keeper light
// (keyTint #ffd8a0, shadowTint #2e1e1a), the same habit greys, scapular black, rope, iron keys and lead badge.
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, B, G, INK, rubric, ring } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side } = require('../dirAC');

// the Ostiarii palette (Hild's values) plus the abbey's furniture and holy metals
const P = {
  habit: '#75695a', habitD: '#5e5446', habitL: '#877b6a', scap: '#262220', scapL: '#3a3430',
  rope: '#8a7a56', ropeD: '#5e5238', iron: '#3e3e40', ironL: '#6e6e70', lead: '#74777b',
  boot: '#2e2218', hose: '#5a5046', linen: '#c9bfa6', linenD: '#968c76',
  oak: '#5a3e26', oakD: '#3a2818', oakL: '#7a5a3a', wax: '#e4d8b8', waxD: '#b8a884',
  flame: '#ffd27a', flameO: '#ff9a3a', gold: '#b08a3a', goldL: '#e2c472', brass: '#8a7444', brassL: '#b8a070',
  skinS: '#7a4a3e', glass: '#9aa6a8',
};
// the keeper render setup: kit.base with the warm abbey light, exactly as Mother Hild
const KB = (seed, o = {}) => K.base(seed, Object.assign({ keyTint: '#ffd8a0', shadowTint: '#2e1e1a', grimeY: 650 }, o));
const T = (f, n) => n + f.o.seed;
// cloth looks
const HB = (f, o = {}) => Object.assign({ fill: P.habit, tex: T(f, 'weave'), texOp: 0.55 }, o);
const SC = (f, o = {}) => Object.assign({ fill: P.scap, tex: T(f, 'weave'), texOp: 0.4 }, o);
const SKN = (f, skin, o = {}) => Object.assign({ fill: skin, shadow: P.skinS, tex: T(f, 'mottle'), texOp: 0.45 }, o);
// joint cut square to the bisector of a bend (Hild's elb)
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0))));
// a non-uniform local frame: u along ang (scale su), v across (scale sv)
const fr2 = (o, ang, su, sv) => pts => pts.map(p => { const q = add(o, rot([p[0] * su, p[1] * sv], ang)); return p[2] ? [q[0], q[1], 1] : q; });

// rope belt across the body from a (back) to b (front) with a sag, twist lines, a knot at t and hanging ends that fall plumb
function ropeBelt(f, a, b, w, o = {}) {
  const sag = o.sag ?? 6, m = add(lerp(a, b, 0.5), [0, sag]);
  const top = [a, add(lerp(a, m, 0.5), [0, sag * 0.4]), m, add(lerp(m, b, 0.5), [0, -sag * 0.2]), b];
  const pts = [...top.map((p, i) => [p[0], p[1] - w / 2, i === 0 || i === top.length - 1 ? 1 : 0]), ...top.slice().reverse().map((p, i) => [p[0], p[1] + w / 2, i === 0 || i === top.length - 1 ? 1 : 0])];
  f.part(pts, { fill: o.col || P.rope, tex: T(f, 'hatch'), texOp: 0.45, k: 0.7, inkW: 1.3, cast: o.cast });
  const n = Math.round(E.len(sub(b, a)) / (w * 0.9));
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, c = t < 0.5 ? lerp(top[0], top[2], t * 2) : lerp(top[2], top[4], t * 2 - 1); f.line([add(c, [-w * 0.3, -w * 0.45]), add(c, [w * 0.3, w * 0.45])], 1, INK, { op: 0.55 }); }
  if (o.knot != null) {
    const k = o.knot < 0.5 ? lerp(top[0], top[2], o.knot * 2) : lerp(top[2], top[4], o.knot * 2 - 1);
    for (const [dx, L, sw] of (o.ends || [[-3, 70, -4], [5, 92, 5]])) {
      const e0 = add(k, [dx, 2]), pts2 = [e0, add(e0, [sw * 0.4, L * 0.4]), add(e0, [sw, L * 0.75]), add(e0, [sw * 0.8, L])];
      f.stroke(pts2, w * 0.9, mix(o.col || P.rope, '#000', 0.2));
      f.line(pts2.slice(0, 3).map(q => add(q, [-w * 0.2, 0])), 1, mix(o.col || P.rope, '#fff', 0.3), { op: 0.5 });
      for (let j = 1; j < 5; j++) { const q = lerp(pts2[1], pts2[3], j / 5); f.line([add(q, [-w * 0.3, -2]), add(q, [w * 0.3, 2])], 0.9, INK, { op: 0.5 }); }
      const tip = pts2[3]; for (let j = -1; j <= 1; j++) f.line([tip, add(tip, [j * 2.5, 7])], 0.9, mix(o.col || P.rope, '#000', 0.3), { op: 0.8 }); // frayed end
    }
    f.part(ell(k, w * 0.95, w * 0.75, 0.3, 10), { fill: o.col || P.rope, tex: T(f, 'hatch'), texOp: 0.5, inkW: 1.2, cast: false });
    f.line([add(k, [-w * 0.5, -w * 0.3]), add(k, [w * 0.5, w * 0.3])], 1, INK, { op: 0.6 });
  }
  return top;
}

// a soft tube along a polyline with a round cap at the far end (fingers)
function tube(pts, ws) {
  const c = K.chain(pts, ws, { steps: 4 }), n = c.length / 2, P = c.slice(0, n), Q = c.slice(n), end = pts[pts.length - 1], d = E.norm(sub(end, pts[pts.length - 2])), r = ws[ws.length - 1] / 2, nn = [-d[1], d[0]];
  const cap = []; for (let i = 1; i < 6; i++) { const t = Math.PI * i / 6; cap.push(add(end, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * 0.9)))); }
  return [...P, ...cap, ...Q];
}
// one iron key hanging from p along angle a (PI/2 = plumb). len: total, s: bow size
function key(f, p, a, len, s, col = P.iron) {
  const d = rot([1, 0], a), n = [-d[1], d[0]], bw = add(p, mul(d, s * 1.05));
  f.part(ell(bw, s * 1.15, s * 0.85, a, 10), { fill: col, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false });
  f.flat(ell(bw, s * 0.5, s * 0.32, a, 8), '#0e0c0a');
  const s0 = add(p, mul(d, s * 2)), s1 = add(p, mul(d, len));
  f.part(limb(s0, s1, s * 0.62, s * 0.5, { steps: 4 }), { fill: col, shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false });
  f.part(ell(lerp(s0, s1, 0.08), s * 0.4, s * 0.7, a, 8), { fill: col, shade: 0.4, inkW: 0.9, cast: false }); // collar
  const b0 = add(s1, mul(d, -s * 1.6)), q = (u, v) => add(add(b0, mul(d, u * s)), mul(n, v * s));
  f.part([q(0, 0.2), q(0, 1.5), q(0.5, 1.5), q(0.5, 1.0), q(0.9, 1.0), q(0.9, 1.6), q(1.6, 1.6), q(1.6, 0.2)].map(x => [x[0], x[1], 1]), { fill: col, shade: 0.35, inkW: 0.9, inkHeavy: 1.2, cast: false });
  f.line([add(s0, mul(n, -s * 0.15)), add(s1, mul(n, -s * 0.15))], 0.8, mix(col, '#fff', 0.4), { op: 0.6, straight: true });
}
// a key ring hanging from `hang` (on the belt) by a short strap; keys hang plumb, bunched under the ring.
// keys: [[angle offset from plumb, length, bow size]]
function keyRing(f, hang, r, keys, o = {}) {
  const c = add(hang, [0, o.drop ?? (r + 10)]);
  f.part([add(hang, [-3, -3]), add(hang, [3, -3]), add(c, [3, -r + 2]), add(c, [-3, -r + 2])], { fill: o.strap || '#3a2a1a', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, sharp: true });
  // keys behind the ring first (odd), then the ring, then the front keys
  const draw = (k, i) => { const a = Math.PI / 2 + k[0], p0 = add(c, rot([r * 0.92, 0], a)); key(f, p0, a, k[1], k[2], i % 3 === 2 ? mix(P.iron, '#5a4a3a', 0.4) : P.iron); };
  keys.forEach((k, i) => { if (i % 2) draw(k, i); });
  ring(f, c, r, r, Math.max(3, r * 0.22), P.iron); ring(f, c, r, r, 1, '#9a9a96', { op: 0.6 });
  f.line(ell(c, r, r, 0, 14).slice(9, 13), 1.4, '#b0aca4', { op: 0.6 });
  keys.forEach((k, i) => { if (!(i % 2)) draw(k, i); });
  return c;
}
// the lead ostium badge on a cord from the belt
function badgeOn(f, from, top, s = 10, ang = 0.05) { f.line([from, lerp(from, top, 0.5).map((v, i) => v + (i ? 2 : 1)), top], 1.2, '#2b2119'); G.badge(f, top, s, P.lead, ang); }

// a resting hand seen from above and the side: back of the hand, four fingers, thumb. wrist -> fingertips along ang.
// s ~ the hand's length / 2. sq squashes the width (foreshortening). o.tips: fingertip colour, o.flip: thumb on the other side,
// o.curl: how far the fingers bend down over an edge (0 flat), o.glove: seams, o.missing: [finger indices] sewn shut / gone.
function restHand(f, wrist, ang, s, col, o = {}) {
  const sq = o.sq ?? 0.75, fw = o.fw ?? 1, fl = o.flip ? -1 : 1, F = fr2(wrist, ang, s, s * sq * fl), sh = o.shadow || P.skinS, ink = INK;
  const look = (c, x = {}) => Object.assign({ fill: c, shadow: sh, shade: 0.45, inkW: 1.1, inkHeavy: 1.7, cast: false, tex: o.tex, texOp: o.texOp }, x);
  const fy = [-0.34, -0.12, 0.1, 0.3], fl0 = [0.78, 0.88, 0.82, 0.64], spread = o.spread ?? 0.08, curl = o.curl ?? 0;
  const tipsOut = [], tipC = i => (Array.isArray(o.tips) ? o.tips[i] : o.tips) || col;
  // thumb under the hand on the far side, then fingers (little finger first), then the back of the hand over their roots
  const th = [[0.12, -0.42], [0.5, -0.62], [0.82, -0.66]];
  if (o.thumb !== false) { f.part(F(limb(th[0], th[1], 0.42, 0.3, { steps: 4 })), look(col)); f.part(F(limb(th[1], th[2], 0.3, 0.24, { steps: 4 })), look(o.thumbTip || col)); }
  for (let i = 3; i >= 0; i--) {
    const y = fy[i], L = fl0[i], a = (i - 1.5) * spread, b0 = [0.86, y];
    const cu = o.curls ? o.curls[i] : curl, k1 = add(b0, rot([L * 0.46, 0], a + cu * 0.3)), k2 = add(k1, rot([L * 0.3, 0], a + cu * 1.1)), k3 = add(k2, rot([L * 0.26, 0], a + cu * 1.9));
    if (o.missing && o.missing.includes(i)) {
      // a stump: the glove finger sewn shut over it
      f.part(F(limb(b0, add(b0, rot([L * 0.3, 0], a)), 0.24, 0.2, { steps: 4 })), look(col));
      f.line(F([add(b0, rot([L * 0.3, -0.1], a)), add(b0, rot([L * 0.3, 0.1], a))]), 1.2, mix(col, '#000', 0.5));
      for (let j = 0; j < 3; j++) f.line(F([add(b0, rot([L * 0.26, -0.1 + j * 0.1], a)), add(b0, rot([L * 0.34, -0.1 + j * 0.1], a))]), 0.8, o.thread || '#d8cba8');
      continue;
    }
    const ws = [0.25, 0.22, 0.2, 0.17].map(x => x * fw), fk = { inkW: 0.9, inkHeavy: 1.3, shade: 0.35 };
    f.part(F(tube([b0, k1, k2, k3], ws)), look(col, o.glove ? {} : fk));
    if (!o.glove) {
      const tc = tipC(i);
      if (tc !== col) f.part(F(tube([lerp(k2, k3, 0.2), k3], [ws[2] * 0.98, ws[3]])), look(tc, { inkW: 0.6, inkHeavy: 0, shade: 0.3 }));
      f.line(F([add(k1, [-0.01, -ws[1] * 0.4]), add(k1, [0.01, ws[1] * 0.4])]), 0.8, mix(col, '#000', 0.5), { op: 0.5 });
      f.line(F([add(k2, [-0.01, -ws[2] * 0.35]), add(k2, [0.01, ws[2] * 0.35])]), 0.7, mix(col, '#000', 0.5), { op: 0.4 });
      f.flat(F(ell(add(k3, rot([-0.06, 0], a + cu * 1.9)), 0.06, ws[3] * 0.32, a + cu * 1.9, 6)), mix(tc, '#fff', 0.35), { op: 0.7 }); // nail
    } else f.line(F([add(k1, [0, -0.06]), add(k1, [0.02, 0.06])]), 0.8, mix(col, '#fff', 0.25), { op: 0.5 });
    tipsOut.push(F([k3])[0]);
  }
  f.part(F([[-0.1, -0.28], [0.25, -0.42], [0.66, -0.47], [0.9, -0.38], [0.98, -0.06], [0.95, 0.3], [0.72, 0.43], [0.3, 0.4], [-0.08, 0.28], [-0.16, 0.0]]), look(col, { shade: 0.32, inkW: 1.3, inkHeavy: 1.8 }));
  // knuckle bumps, tendons
  for (let i = 0; i < 4; i++) f.flat(F(ell([0.84, fy[i]], 0.07, 0.05, 0, 6)), mix(col, '#fff', 0.3), { op: 0.5 });
  f.line(F([[0.05, -0.2], [0.7, -0.3]]), 0.9, mix(col, '#000', 0.45), { op: 0.5 });
  f.line(F([[0.05, 0.05], [0.72, 0.1]]), 0.9, mix(col, '#000', 0.45), { op: 0.45 });
  if (o.glove) { f.stitches(F([[0.0, 0.3], [0.86, 0.4]]), mix(col, '#fff', 0.35), 0.8); f.line(F([[0.2, -0.4], [0.3, 0.38]]), 0.9, mix(col, '#000', 0.5), { op: 0.6 }); }
  if (o.ring) { const rp = F([[0.86 + 0.2, fy[3]]])[0]; f.part(ell(rp, s * 0.14, s * 0.1, ang, 8), { fill: o.ring, shade: 0.4, inkW: 1, cast: false }); }
  return { F, tips: tipsOut };
}

// a hand lying palm-down on a surface, seen from the side at eye height (Independent review): the palm sits on the surface
// line, the back of the hand arches from the wrist to the knuckle ridge, the fingers lie flat along the surface with the
// deeper ones stacked a little higher (perspective), and a contact shadow runs under it. W: the wrist's contact point on
// the surface; ang: the fingers' direction along the surface; L: wrist to middle fingertip. o.thumbNear: the thumb is on
// the viewer's side (a far left hand); otherwise the little finger is nearest. o.depth: screen offset per finger in depth
// (px at L 70). o.tips / o.tipList: fingertip colours; o.light: fingertips only touching (lift the hand a little).
function tableHand(f, W, ang, L, col, o = {}) {
  const F = fr2(W, ang, L, L), sh = o.shadow || P.skinS, dk = mix(col, '#000', 0.45), lt = mix(col, '#fff', 0.35);
  const look = x => Object.assign({ fill: col, shadow: sh, shade: 0.45, inkW: 1, inkHeavy: 1.5, cast: false, tex: o.tex, texOp: o.texOp }, x);
  const ds = mul(o.depth || [-0.5, -2.4], L / 70), lift = o.light ? -0.03 : 0;
  const at = (pts, d) => F(pts).map(q => add(q, mul(ds, d)));
  // contact shadow on the surface
  f.flat(at([[-0.06, 0.0], [0.5, -0.01], [1.02, -0.005], [1.0, 0.035], [0.4, 0.04], [-0.06, 0.03]], o.thumbNear ? 1 : 0.5), '#0c0806', { op: 0.45 });
  // fingers: [u end, root width, tip width, name]; drawn deepest first
  const fing = { index: [0.95, 0.105, 0.08], middle: [1.0, 0.11, 0.082], ring: [0.94, 0.1, 0.076], little: [0.82, 0.088, 0.068] };
  const order = o.thumbNear ? ['little', 'ring', 'middle', 'index'] : ['index', 'middle', 'ring', 'little'];
  const depthOf = i => (o.thumbNear ? 3 - i + 0.0 : 3 - i);
  const thumb = d => {
    const pts = [[0.06, -0.09 + lift], [0.24, -0.075 + lift], [0.4, -0.05 + lift], [0.52, -0.04 + lift]];
    f.part(at(tube(pts, [0.13, 0.11, 0.095, 0.085].map(x => x * (o.fw || 1))), d), look({}));
    if (o.thumbTip) f.part(at(tube([lerp(pts[2], pts[3], 0.1), pts[3]], [0.09, 0.085].map(x => x * (o.fw || 1))), d), look({ fill: o.thumbTip, inkW: 0.6, inkHeavy: 0 }));
    f.flat(at(ell([0.48, -0.065 + lift], 0.04, 0.018, 0, 6), d), lt, { op: 0.6 });
    f.line(at([[0.3, -0.12 + lift], [0.31, -0.03 + lift]], d), 0.8, dk, { op: 0.5 });
  };
  if (!o.thumbNear && o.thumb !== false) thumb(4.2);
  order.forEach((n, i) => {
    const [ue, w0, w1] = fing[n], d = depthOf(i), cu = (o.curl || 0), tl = o.tipList ? o.tipList[n] : o.tips;
    const pts = [[0.44, -0.12 + lift], [0.66, -0.088 + lift * 0.8], [0.83 * ue / 0.95, -0.06 + lift * 0.5 + cu * 0.03], [ue, -w1 / 2 + cu * 0.06]];
    f.part(at(tube(pts, [w0, w0 * 0.92, w1 * 1.02, w1].map(x => x * (o.fw || 1))), d), look({ inkW: 0.9, inkHeavy: 1.3, shade: 0.35 }));
    if (tl && tl !== col) f.part(at(tube([lerp(pts[2], pts[3], 0.25), pts[3]], [w1 * 1.0, w1]), d), look({ fill: tl, inkW: 0.6, inkHeavy: 0, shade: 0.3 }));
    f.line(at([[0.66, -0.088 - w0 * 0.5 + lift], [0.675, -0.088 + w0 * 0.15 + lift]], d), 0.8, dk, { op: 0.55 }); // knuckle crease
    f.line(at([[0.83 * ue / 0.95, -0.06 - w1 * 0.5 + lift * 0.5], [0.84 * ue / 0.95, -0.06 + w1 * 0.1 + lift * 0.5]], d), 0.7, dk, { op: 0.45 });
    f.flat(at(ell([ue - 0.05, -w1 * 0.85 + cu * 0.05], 0.04, 0.014, 0, 6), d), mix(tl || col, '#fff', 0.4), { op: 0.7 }); // nail
  });
  // back of the hand: palm on the surface, arching from the wrist to the knuckle ridge
  const dm = 1.5;
  f.part(at([[-0.06, 0.0 + lift], [-0.08, -0.13], [-0.02, -0.235], [0.14, -0.27], [0.3, -0.255], [0.44, -0.2], [0.5, -0.135], [0.47, -0.05 + lift], [0.4, 0.0 + lift]], dm * 0.4), look({ shade: 0.4, inkW: 1.2, inkHeavy: 1.8 }));
  for (let i = 0; i < 4; i++) f.flat(at(ell([0.45, -0.2 + i * 0.025], 0.035, 0.022, 0, 6), 3 - i), lt, { op: 0.45 }); // knuckle ridge
  f.line(at([[0.02, -0.2], [0.2, -0.235], [0.4, -0.2]], 1), 0.9, dk, { op: 0.45 }); // tendons
  f.line(at([[0.02, -0.14], [0.22, -0.16], [0.42, -0.15]], 0.5), 0.9, dk, { op: 0.4 });
  if (o.veins) f.line(at([[0.04, -0.17], [0.14, -0.2], [0.22, -0.18], [0.3, -0.21]], 1), 1.1, '#5a6a8a', { op: 0.35 });
  if (o.thumbNear && o.thumb !== false) thumb(-1.0);
  if (o.ring) { const rp = at([[0.6, -0.1]], o.thumbNear ? 0 : 0)[0]; f.part(ell(rp, L * 0.035, L * 0.06, ang, 8), { fill: o.ring, shade: 0.4, inkW: 1, cast: false }); }
  return { F, at };
}

// a writing hand seen from its outer side: the back of the hand and the curled little and ring fingers toward us, the
// index and thumb pinching the quill on the far side; the quill runs from the nib at `tip` up and back over the knuckles.
// s ~ half the hand's length. o.tips: ink-black fingertips. Returns { F, quillEnd }.
function penHand(f, W, tip, s, col, o = {}) {
  const ang = Math.atan2(tip[1] - W[1], tip[0] - W[0]), d = E.len(sub(tip, W)) / s, F = fr2(W, ang, s, s), sh = o.shadow || P.skinS;
  const look = x => Object.assign({ fill: col, shadow: sh, shade: 0.45, inkW: 1.1, inkHeavy: 1.7, cast: false, tex: o.tex, texOp: o.texOp }, x);
  const tc = o.tips || col, nib = [d, 0];
  // thumb on the far side (behind the quill), its tip inked
  f.part(F(limb([0.3, -0.42], [d - 0.42, -0.5], 0.32, 0.24, { steps: 5 })), look({ fill: mix(col, '#3a2a28', 0.15) }));
  f.part(F(ell([d - 0.38, -0.5], 0.13, 0.11, 0, 8)), look({ fill: tc }));
  // the quill: nib on the page, shaft up and back over the web of the hand, the vane above the wrist
  const qa = o.qAng ?? -2.0, qd = rot([1, 0], qa), N0 = F([nib])[0], Q = [N0, add(N0, mul(qd, s * 0.75)), add(N0, mul(qd, s * 1.6)), add(N0, mul(qd, s * (o.qLen ?? 3.6)))];
  f.line(Q.slice(0, 3), o.qW ?? 1.6, o.qCol || '#3a3028');
  f.line([Q[2], Q[3]], 1.4, '#d8d0c0');
  for (let i = 0; i < 14; i++) { const t = (o.vane ?? 0) + i / 13 * (1 - (o.vane ?? 0)), q = lerp(Q[2], Q[3], t), n = rot(E.norm(sub(Q[3], Q[2])), -Math.PI / 2), w = 7 * Math.sin(Math.PI * (0.15 + 0.85 * t)); f.line([q, add(add(q, mul(n, w)), mul(E.norm(sub(Q[3], Q[2])), 4))], 1, '#ece4d4', { op: 0.9 }); f.line([q, add(add(q, mul(n, -w * 0.5)), mul(E.norm(sub(Q[3], Q[2])), 3))], 0.9, '#bdb4a4', { op: 0.75 }); }
  f.flat([Q[0], add(Q[0], [-2, -3]), add(Q[0], [2, -3])], '#0e0a08');
  // index finger laid along the quill to just above the nib, inked at the tip
  f.part(F(limb([0.8, -0.3], [d - 0.5, -0.28], 0.26, 0.22, { steps: 5 })), look({}));
  f.part(F(limb([d - 0.52, -0.28], [d - 0.22, -0.16], 0.22, 0.18, { steps: 4 })), look({ fill: tc }));
  // back of the hand
  f.part(F([[-0.12, -0.36], [0.3, -0.46], [0.86, -0.42], [1.0, -0.12], [0.96, 0.24], [0.6, 0.42], [0.1, 0.4], [-0.16, 0.24], [-0.22, -0.04]]), look({ shade: 0.4, inkW: 1.3, inkHeavy: 2 }));
  // middle, ring and little fingers curled under toward the page, knuckles toward us
  for (let i = 0; i < 3; i++) { const y = -0.08 + i * 0.2, c = [0.98 - i * 0.06, y + 0.04]; f.part(F([[c[0] - 0.2, c[1] - 0.12], [c[0] + 0.14, c[1] - 0.1], [c[0] + 0.24, c[1] + 0.06], [c[0] + 0.12, c[1] + 0.2], [c[0] - 0.18, c[1] + 0.16]]), look({ fill: i === 0 ? tc : mix(col, tc, 0.25) })); }
  f.line(F([[0.1, -0.2], [0.8, -0.28]]), 0.9, mix(col, '#000', 0.45), { op: 0.5 });
  f.line(F([[0.1, 0.06], [0.8, 0.04]]), 0.9, mix(col, '#000', 0.45), { op: 0.45 });
  for (let i = 0; i < 3; i++) f.flat(F(ell([0.86, -0.16 + i * 0.2], 0.06, 0.05, 0, 6)), mix(col, '#fff', 0.3), { op: 0.5 });
  return { F, quillEnd: Q[3] };
}
// hands pressed together in prayer, seen from the back of the near hand: wrist at W, fingertips along ang, length L.
// The far hand shows as a sliver of fingers and its thumb along the front edge. Returns the frame.
function prayerHands(f, W, ang, L, col, o = {}) {
  const F = fr2(W, ang, L, o.flip ? -L : L), sh = o.shadow || P.skinS, look = x => Object.assign({ fill: col, shadow: sh, light: mix(col, '#e8c4a0', 0.12), shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: o.tex, texOp: o.texOp }, x);
  const dk = mix(col, '#000', 0.45);
  // far hand: a sliver of its fingers along the front edge, tips peeking past the near fingers
  f.part(F([[0.3, -0.26], [0.7, -0.27], [1.0, -0.2], [1.04, -0.12], [0.98, -0.06], [0.6, -0.1], [0.3, -0.14]]), look({ fill: mix(col, '#3a2a28', 0.2) }));
  // near hand: back of the hand, then four fingers lying side by side, then the thumbs up the front edge
  f.part(F([[-0.04, -0.2], [0.3, -0.24], [0.5, -0.2], [0.56, 0.0], [0.5, 0.22], [0.26, 0.26], [-0.04, 0.22], [-0.1, 0.0]]), look({ fill: mix(col, sh, 0.3), light: mix(col, sh, 0.12), shade: 0.3, inkW: 1.3, inkHeavy: 2 }));
  // fingers: uneven lengths and widths, each bowing a little toward the far hand, with knotted joints and creases
  const fv = [[-0.14, 0.97, 0.112, 0.64, 0.83], [-0.045, 1.04, 0.118, 0.67, 0.86], [0.05, 0.99, 0.11, 0.65, 0.84], [0.145, 0.85, 0.096, 0.61, 0.76]];
  for (let i = 3; i >= 0; i--) {
    const [v, l, w, j1, j2] = fv[i], bow = -0.012 - i * 0.004;
    f.part(F(tube([[0.46, v], [j1, v + bow], [j2, v + bow * 1.6], [l, v + bow * 1.2 + 0.008 * i]], [w, w * 1.05, w * 0.9, w * 0.78])), look({ inkW: 1, inkHeavy: 1.4 }));
    f.line(F([[j1 - 0.01, v + bow - w * 0.42], [j1 + 0.01, v + bow + w * 0.42]]), 0.8, dk, { op: 0.65 });
    f.line(F([[j1 + 0.02, v + bow - w * 0.3], [j1 + 0.03, v + bow + w * 0.3]]), 0.7, dk, { op: 0.4 });
    f.line(F([[j2, v + bow * 1.6 - w * 0.36], [j2 + 0.01, v + bow * 1.6 + w * 0.36]]), 0.7, dk, { op: 0.5 });
    f.flat(F(ell([j1, v + bow], 0.03, w * 0.32, 0, 6)), mix(col, '#fff', 0.25), { op: 0.3 }); // knotted joint catching the light
  }
  f.part(F(tube([[0.08, -0.22], [0.3, -0.255], [0.52, -0.262]], [0.14, 0.12, 0.1])), look({})); // near thumb along the front
  f.line(F([[0.3, -0.3], [0.31, -0.21]]), 0.8, dk, { op: 0.5 });
  for (let i = 0; i < 4; i++) f.flat(F(ell([0.47, -0.15 + i * 0.1], 0.022, 0.026, 0, 6)), mix(col, '#fff', 0.3), { op: 0.3 }); // knuckles, low and bony
  // tendons fanning from the wrist to each knuckle, a raised vein
  for (let i = 0; i < 4; i++) f.line(F([[0.04, -0.06 + i * 0.04], [0.44, -0.15 + i * 0.1]]), 0.8, dk, { op: 0.38 });
  if (o.veins !== false) f.line(F([[0.02, 0.02], [0.14, 0.05], [0.24, 0.02], [0.34, 0.06]]), 1.1, '#5a6a8a', { op: 0.4 });
  return F;
}
// a standing candle (or a stub): base at p, height h, width w, flame on top; drips of wax
function candle(f, p, h, w, o = {}) {
  const top = add(p, [0, -h]);
  f.part([add(p, [-w / 2, 0]), add(top, [-w / 2, 2]), add(top, [-w * 0.2, -1]), add(top, [w * 0.25, 1]), add(top, [w / 2, 3]), add(p, [w / 2, 0])], { fill: o.col || P.wax, shadow: P.waxD, shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false });
  for (let i = 0; i < (o.drips ?? 2); i++) { const x = (f.r() - 0.5) * w * 0.8, l = 4 + f.r() * h * 0.4; f.part([add(top, [x - 1.6, 2]), add(top, [x + 1.6, 2]), add(top, [x + 1.8, l]), add(top, [x, l + 2]), add(top, [x - 1.8, l])], { fill: o.col || P.wax, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); }
  if (o.lit !== false) flame(f, add(top, [0, -1]), o.fs ?? Math.max(5, w * 0.55));
  return top;
}
// a soft warm light pool: radial gradient, no hard edge
function glow(f, c, rx, ry, col = '#ffb060', op = 0.3) {
  const id = f.id('gl'); f.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="0.45" stop-color="${col}" stop-opacity="${op * 0.45}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`);
  f.raw(`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`);
}
function flame(f, p, s, o = {}) {
  if (o.glow !== false) glow(f, [p[0], p[1] - s], s * 4, s * 3.6, P.flameO, 0.35);
  f.line([p, add(p, [0, -s * 0.5])], 1, '#1a120c');
  f.flat([add(p, [0, -s * 0.2]), add(p, [s * 0.5, -s * 0.9]), add(p, [s * 0.1, -s * 2.2]), add(p, [-s * 0.45, -s * 0.9])], P.flameO, { op: 0.9 });
  f.flat([add(p, [0, -s * 0.4]), add(p, [s * 0.25, -s * 0.9]), add(p, [s * 0.05, -s * 1.6]), add(p, [-s * 0.22, -s * 0.9])], '#fff0c0');
}
// a closed book seen in 3/4: front cover quad c0..c3 (top-left, top-right, bottom-right, bottom-left), page block depth
// vector dv (toward the spine side/back), cover colour, o.corners: brass corner pieces, o.clasp
function closedBook(f, c, dv, col, o = {}) {
  const [a, b, cc, d] = c, pg = o.pages || '#d6cbb0', dk = mix(col, '#000', 0.35);
  // back cover + page block edges
  f.part([add(a, dv), add(b, dv), add(cc, dv), add(d, dv)], { fill: dk, shade: 0.3, inkW: 1.2, cast: false });
  f.part([a, b, add(b, dv), add(a, dv)].map(q => [q[0], q[1], 1]), { fill: pg, shade: 0.25, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
  for (let i = 1; i < 6; i++) f.line([lerp(a, add(a, dv), i / 6), lerp(b, add(b, dv), i / 6)], 0.7, '#8a7a5a', { op: 0.6, straight: true });
  f.part([b, cc, add(cc, dv), add(b, dv)].map(q => [q[0], q[1], 1]), { fill: pg, shade: 0.35, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
  for (let i = 1; i < 6; i++) f.line([lerp(b, add(b, dv), i / 6), lerp(cc, add(cc, dv), i / 6)], 0.7, '#8a7a5a', { op: 0.6, straight: true });
  // front cover with a raised border and worn edges
  f.part([a, b, cc, d].map(q => [q[0], q[1], 1]), { fill: col, shade: 0.4, tex: T(f, 'mottle'), texOp: 0.55, inkW: 1.4 });
  const inset = (p, t) => lerp(p, lerp(lerp(a, b, 0.5), lerp(d, cc, 0.5), 0.5), t);
  f.line([inset(a, 0.16), inset(b, 0.16), inset(cc, 0.16), inset(d, 0.16), inset(a, 0.16)], 1.1, mix(col, '#000', 0.45), { op: 0.8, straight: true });
  f.line([inset(a, 0.2), inset(b, 0.2), inset(cc, 0.2)], 0.9, mix(col, '#fff', 0.3), { op: 0.45, straight: true });
  f.line([a, lerp(a, d, 0.6)], 1.4, mix(col, '#fff', 0.35), { op: 0.5 }); // worn spine edge
  if (o.corners) for (const [p, q1, q2] of [[a, b, d], [b, a, cc], [cc, d, b], [d, cc, a]]) {
    const u = E.norm(sub(q1, p)), v = E.norm(sub(q2, p)), L = o.corners;
    f.part([p, add(p, mul(u, L)), add(add(p, mul(u, L * 0.5)), mul(v, L * 0.5)), add(p, mul(v, L))].map(x => [x[0], x[1], 1]), { fill: P.brass, light: P.brassL, shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
    f.rivet(add(add(p, mul(u, L * 0.3)), mul(v, L * 0.3)), 1.5, P.brassL);
  }
}
// hidden legs in wool hose for the rig (Hild's construction): thigh and part of the shin
function hoseLegs(f, legs, o = {}) {
  for (const [sfx, Hp, Kn, A] of legs) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, o.tw || 46, o.kw || 40, { steps: 8 }), { fill: o.col || P.hose, tex: T(f, 'weave') });
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.7), o.kw || 40, o.aw || 34, { steps: 8 }), { fill: o.col || P.hose, tex: T(f, 'weave') });
  }
}
// boot cut at the ankle into shin and foot bones (Hild's construction)
function bootRig(f, A, sfx, s, col, o = {}) {
  const ankleCut = side(A, [0.45, 0.89], 20), shinCut = side(A, [-0.45, -0.89], 20);
  split(f, () => B.boot(f, A, o.dir || 1, s, col, Object.assign({ shaft: 1.0, tex: T(f, 'mottle') }, o)), [['shin' + sfx, shinCut], ['foot' + sfx, ankleCut]]);
}
// split one outline at a horizontal-ish waist: the lower copy goes to `lower`, the upper to `upper`
function waistSplit(f, draw, WB, lower = 'skirt', upper = 'torso', dW = [0, 1]) {
  return split(f, draw, [[lower, side(add(WB, mul(dW, -40)), dW)], [upper, side(WB, mul(dW, -1))]]);
}
// fold strokes in cloth
function folds(f, list, w = 2.2, col) { for (const q of list) f.stroke(q, w, col); }
// a hem: frayed threads and a mud band
function hemWear(f, x0, x1, y, o = {}) {
  f.flat([[x0, y - (o.h ?? 60)], [x1, y - (o.h ?? 60)], [x1 + 2, y + 10], [x0 - 2, y + 10]], o.mud || '#2a1e12', { op: o.op ?? 0.22 });
  const pts = []; for (let x = x0 + 4; x < x1; x += 22) pts.push([x, y - 4 + ((x / 22) % 2 ? 3 : -2)]);
  f.line(pts, 1, '#cfc0a0', { op: o.thread ?? 0.45, dash: '2 3' });
}
// a patch with stitches
function patch(f, pts, col, thread = '#b8a888') { f.part(pts.map(q => [q[0], q[1], 1]), { fill: col, tex: 'weave' + f.o.seed, inkW: 1.1 }); f.stitches([...pts, pts[0]], thread, 0.8); }
// frost-breath or cold mist: a few pale wisps
function wisps(f, p, dir, n, col = '#d8e4ea', op = 0.55) {
  const nn = [-dir[1], dir[0]];
  for (let i = 0; i < n; i++) {
    const a = add(p, add(mul(dir, i * 5), mul(nn, (i - n / 2) * 3))), L = 22 + i * 7, pts = [];
    for (let k = 0; k <= 6; k++) pts.push(add(add(a, mul(dir, L * k / 6)), mul(nn, Math.sin(k * 1.1 + i) * (2 + k * 1.2) - k * 1.5)));
    f.stroke(pts, 4.5 - i * 0.6, col, { op: op - i * 0.1 });
  }
}

module.exports = { K, E, B, G, INK, P, KB, T, HB, SC, SKN, elb, fr2, split, side, ropeBelt, key, keyRing, badgeOn, restHand, tableHand, penHand, prayerHands, candle, glow, flame, closedBook, hoseLegs, bootRig, waistSplit, folds, hemWear, patch, wisps, rubric };
