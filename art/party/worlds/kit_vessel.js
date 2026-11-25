// Helpers for THE VESSEL (worlds/hero_vessel.js). The six course inks run in bands up the skin from the fingertips.
// A band is drawn by painting the whole limb (or hand part) once per ink and clipping each copy to the far side of a
// bowed cut that wraps the limb like a ring seen from chest height, so every band keeps the limb's own Living Ink
// shading and hatching: the ink is in the skin, not on it. All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, B, G, INK, rubric } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, norm, len } = E;
const KK = require('./kit_keepers');
const { fr2, glow } = KK;

// the Prismatic's six inks (dirAC.js elementalist), fingertips upward; the void ink pushed to violet-black
const COURSES = ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'];
// deep pigments, desaturated toward ink: vermilion, a cold pale blue, burnished ochre-gold, indigo, sick olive, violet-black.
// Each is a dye laid into the skin at 55 to 65 percent, so the skin's warmth, mottle and form show through it.
const INK6 = ['#8a2a1c', '#6f8faa', '#8e6c26', '#1e3868', '#56622a', '#2a1a32'];
const DEPTH = [0.6, 0.62, 0.58, 0.64, 0.6, 0.6];
const GOLD = '#d2ad58', GOLDD = '#8a6a2a'; // gold leaf: the rules are gilded, the Vessel is holy (Director note 2026-11-23)
const GAP = 2.6; // a hair of bare skin between two inks: the ruled line the scribe left
const SKIN = '#c4a184'; // the Elementalist's skin: same person
// how a dyed band is laid: the skin's own mottle, stronger, so the dye sits unevenly in it like ink in vellum
const DYE = f => ({ tex: 'mottle' + f.o.seed, texOp: 0.7 });
const bandCol = (i, skin = SKIN) => mix(skin, INK6[i], DEPTH[i]);

// clip everything draw() puts out to a region (path string)
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n'), id = f.id('vk');
  f.defs.push(`<clipPath id="${id}"><path d="${region}"/></clipPath>`);
  f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
// a gentle, seeded unevenness so a band's edge is a hand-ruled line, not a machine one
function wobbler(f, amp) { const a = f.r() * 6, b = f.r() * 6, k1 = 0.18 + f.r() * 0.1, k2 = 0.41 + f.r() * 0.2; return u => amp * (0.65 * Math.sin(u * k1 + a) + 0.35 * Math.sin(u * k2 + b)); }
// the boundary curve through P square to d (d points distal), half-width hw, bowing `bow` toward d in the middle
function cutCurve(P, d, hw, bow, wob, ext = 1.0, n = 14) {
  d = norm(d); const nn = [-d[1], d[0]], pts = [];
  for (let i = 0; i <= n; i++) { const u = -hw * ext + (2 * hw * ext) * i / n, uu = Math.max(-1, Math.min(1, u / hw)); pts.push(add(add(P, mul(nn, u)), mul(d, bow * (1 - uu * uu) + (wob ? wob(u) : 0)))); }
  return pts;
}
// the region on the distal side of that curve, as a path
function cutRegion(P, d, hw, bow, wob) {
  d = norm(d); const nn = [-d[1], d[0]], L = 3000, c = cutCurve(P, d, hw, bow, wob, 1.6, 20);
  const a = add(c[0], mul(nn, -L)), b = add(c[c.length - 1], mul(nn, L));
  const pts = [a, ...c, b, add(b, mul(d, L)), add(a, mul(d, L))];
  return 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z';
}
// point, direction and width at a distance `dist` back from the distal end of a polyline with widths
function along(pts, ws, dist) {
  let rem = dist;
  for (let i = pts.length - 1; i > 0; i--) {
    const a = pts[i - 1], b = pts[i], L = len(sub(b, a));
    if (rem <= L || i === 1) { const t = Math.max(0, 1 - rem / L); return { p: lerp(a, b, t), d: norm(sub(b, a)), w: ws[i - 1] + (ws[i] - ws[i - 1]) * t }; }
    rem -= L;
  }
}
// minims: a faint run of script along a curve, strokes along d, word gaps; invisible at game size
function script(f, curve, d, col, k = 1) {
  for (let i = 1; i < curve.length - 1; i++) { if (i % 6 === 0) continue; const p = curve[i]; f.line([add(p, mul(d, -1.2 * k)), add(p, mul(d, 1.2 * k))], 0.55 * k, col, { op: 0.45 }); if (i % 6 === 3) f.line([add(p, mul(d, -1.2 * k)), add(add(p, mul(d, -2.4 * k)), [0.8 * k, 0])], 0.5 * k, col, { op: 0.4 }); }
}
// the proximal side of a cut (the mirror of cutRegion)
function cutRegionP(P, d, hw, bow) { return cutRegion(P, mul(norm(d), -1), hw, -bow, null); }
// Each ink is a translucent dye over the finished skin: the skin is drawn and modelled first (shading, hatching, tendon
// and muscle lines), then each band's pigment is laid over it at ALPHA, so the form shows through.
const ALPHA = [0.42, 0.44, 0.34, 0.5, 0.46, 0.45];
const inkOver = (f, shapes, ci, op) => { for (const sh of shapes) f.flat(sh, INK6[ci], { op: op ?? ALPHA[ci] }); };
// a bare limb along pts (proximal -> distal) inked in bands. cuts: [[distance back from the distal end, ink index distal
// of the cut]], base: ink index at the proximal end. look: the skin's part options. o.detail(f): skin modelling drawn
// before the inks. Returns the limb outline path.
function bandedLimb(f, pts, ws, base, cuts, look = {}, o = {}) {
  const shape = K.chain(pts, ws, o.chain || {}), colOf = c => bandCol(c, o.skin);
  const d0 = f.part(shape, Object.assign({}, look, { fill: o.skin || SKIN }));
  const L = norm(f.o.light), sorted = cuts.slice().sort((a, b) => b[0] - a[0]), gap = o.gap ?? GAP, bowK = o.bow ?? 0.18;
  const total = (() => { let s = 0; for (let i = 1; i < pts.length; i++) s += len(sub(pts[i], pts[i - 1])); return s; })();
  clipDraw(f, d0, () => {
    // the skin's own form under the dye: ring-following hatch on the shadow side, a long muscle line
    for (let dist = total - 5; dist > 3; dist -= o.hatchStep ?? 5) {
      const q = along(pts, ws, dist), nn = [-q.d[1], q.d[0]], sg = (nn[0] * L[0] + nn[1] * L[1]) > 0 ? -1 : 1, hw = q.w / 2, bow = q.w * bowK;
      const c = []; for (let i = 0; i <= 4; i++) { const u = sg * hw * (0.4 + 0.62 * i / 4), uu = u / hw; c.push(add(add(q.p, mul(nn, u)), mul(q.d, bow * (1 - uu * uu)))); }
      f.line(c, 0.8, mix(o.skin || SKIN, INK, 0.55), { op: 0.4 });
    }
    if (o.detail) o.detail(f);
    // the inks, band by band, each clipped between its two ruled rings
    const edges = sorted.map(([dist]) => { const qa = along(pts, ws, dist + gap / 2), qb = along(pts, ws, dist - gap / 2), qm = along(pts, ws, dist); return { qa, qb, qm }; });
    const bands = [base, ...sorted.map(c => c[1])];
    bands.forEach((ci, k) => {
      const regs = [];
      if (k > 0) { const e = edges[k - 1]; regs.push(cutRegion(e.qb.p, e.qb.d, e.qb.w / 2 + 3, e.qb.w * bowK, null)); }
      if (k < edges.length) { const e = edges[k]; regs.push(cutRegionP(e.qa.p, e.qa.d, e.qa.w / 2 + 3, e.qa.w * bowK)); }
      const draw = () => inkOver(f, [shape], ci);
      if (regs.length === 0) draw(); else if (regs.length === 1) clipDraw(f, regs[0], draw); else clipDraw(f, regs[0], () => clipDraw(f, regs[1], draw));
    });
    // the rules: each an ellipse round the limb, its two dye edges and the gold hairline between them
    for (const [k, e] of edges.entries()) {
      f.line(cutCurve(e.qb.p, e.qb.d, e.qb.w / 2, e.qb.w * bowK, null), 0.7, mix(colOf(bands[k + 1]), INK, 0.5), { op: 0.45 });
      f.line(cutCurve(e.qa.p, e.qa.d, e.qa.w / 2, e.qa.w * bowK, null), 0.7, mix(colOf(bands[k]), INK, 0.5), { op: 0.4 });
      f.line(cutCurve(e.qm.p, e.qm.d, e.qm.w / 2, e.qm.w * bowK, null), 0.9, GOLD, { op: 0.9 });
    }
    if (o.script !== false) { const stops = [total, ...sorted.map(c => c[0]), 0]; for (let k = 0; k < stops.length - 1; k++) {
      if (stops[k] - stops[k + 1] < 12) continue;
      const q = along(pts, ws, (stops[k] + stops[k + 1]) / 2);
      script(f, cutCurve(q.p, q.d, q.w / 2 * 0.8, q.w * bowK, null, 1, 24), q.d, mix(INK6[bands[k]], INK, 0.3), o.scriptK ?? 1);
    } }
  });
  return d0;
}

// a soft tube along a polyline with a round cap at the far end (a finger), as kit_keepers' tube
function tube(pts, ws) {
  const c = K.chain(pts, ws, { steps: 4 }), n = c.length / 2, P = c.slice(0, n), Q = c.slice(n), end = pts[pts.length - 1], d = norm(sub(end, pts[pts.length - 2])), r = ws[ws.length - 1] / 2, nn = [-d[1], d[0]];
  const cap = []; for (let i = 1; i < 6; i++) { const t = Math.PI * i / 6; cap.push(add(end, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * 0.9)))); }
  return [...P, ...cap, ...Q];
}

// ---- the course stacks: each course's own mark resting on its band, still and contained, the skin whole under it.
// Every token sits ON the skin: a soft contact shadow to the lower right, its own light from the upper left, an ink edge.
// c: centre, s: size (px), a: the surface's angle (local x along it).
const contact = (f, c, rx, ry, a = 0, op = 0.35) => f.raw(`<ellipse cx="${(c[0] + rx * 0.25).toFixed(1)}" cy="${(c[1] + ry * 0.45).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${(c[0] + rx * 0.25).toFixed(1)} ${(c[1] + ry * 0.45).toFixed(1)})" fill="#120a08" opacity="${op}" filter="url(#cast${f.o.seed})"/>`);
const STACK = {
  fire(f, c, s, a = -Math.PI / 2) { // a bead of fire: a small steady drop of flame standing on the vermilion, no burn under it
    KK.glow(f, add(c, [0, -s * 0.7]), s * 2.2, s * 2.2, '#e07a30', 0.18);
    contact(f, c, s * 0.7, s * 0.28, 0, 0.5);
    const R = E.frame(c, a + Math.PI / 2, s);
    f.part(R([[-0.55, 0], [-0.5, -0.55], [-0.15, -1.15], [0.05, -1.55], [0.28, -0.95], [0.56, -0.35], [0.45, 0.1], [-0.3, 0.14]]), { fill: '#c85a24', shade: 0.35, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
    f.flat(R([[-0.26, -0.04], [-0.18, -0.5], [0.0, -0.95], [0.2, -0.45], [0.22, -0.04]]), '#f0b860');
  },
  frost(f, c, s, a = 0) { // a skin of rime: a thin faceted crust lying on the pale blue, dull, no crystal stars
    const R = E.frame(c, a, s), crust = R([[-1, 0.1], [-0.7, -0.45], [-0.15, -0.6], [0.4, -0.5], [0.95, -0.15], [0.85, 0.3], [0.3, 0.52], [-0.4, 0.5]]);
    contact(f, c, s * 0.95, s * 0.55, a, 0.35);
    f.part(crust.map(q => [q[0], q[1], 1]), { fill: '#c4d2da', shadow: '#7a92a2', shade: 0.45, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
    for (const l of [[[-0.7, -0.45], [-0.2, 0.0], [0.3, 0.52]], [[-0.2, 0.0], [0.4, -0.5]], [[-0.2, 0.0], [0.85, 0.3]], [[-0.4, 0.5], [-0.2, 0.0]]]) f.line(R(l), 0.8, '#5a7a8a', { straight: true, op: 0.75 });
    f.flat(R([[-0.7, -0.45], [-0.15, -0.6], [-0.2, 0.0]]).map(q => [q[0], q[1], 1]), '#e6eef2', { op: 0.85 }); // the lit facet
  },
  lightning(f, c, s, a = 0) { // a branching spark lying in the gold: raised fern of fine burnished lines, a shadow under each
    const R = E.frame(c, a, s), br = [[[-1, 0.1], [-0.4, 0.0], [0.1, 0.12], [0.6, -0.05], [1.0, 0.05]], [[-0.4, 0.0], [-0.2, -0.45]], [[0.1, 0.12], [0.3, 0.55]], [[0.6, -0.05], [0.75, -0.45]], [[-0.2, -0.45], [-0.35, -0.7]], [[0.3, 0.55], [0.15, 0.8]], [[0.1, 0.12], [0.0, -0.35]]];
    for (const l of br) f.line(R(l).map(q => add(q, [0.9, 1.1])), 1.8, '#2a1a08', { straight: true, op: 0.55 });
    for (const [i, l] of br.entries()) f.line(R(l), i === 0 ? 1.5 : 1, '#e8cc80', { straight: true });
    for (const [i, l] of br.entries()) if (i < 3) f.line(R(l).map(q => add(q, [-0.4, -0.5])), 0.6, '#fff4d0', { straight: true, op: 0.8 });
  },
  water(f, c, s) { // a bead of water resting on the indigo: a clear dome with its highlight and its shadow
    contact(f, c, s * 0.85, s * 0.4, 0, 0.45);
    f.part(ell(c, s * 0.7, s * 0.8, 0, 14), { fill: '#4a6e94', shadow: '#1e3454', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
    f.flat(ell(add(c, [-s * 0.25, -s * 0.3]), s * 0.2, s * 0.13, -0.6, 8), '#dce8f0');
    f.line(ell(c, s * 0.55, s * 0.62, 0, 12).slice(2, 6), 0.8, '#9ab8d0', { op: 0.6 });
  },
  toxin(f, c, s, a = 0) { // a ripe swelling: a tight, glossy rise in the olive skin, whole, nothing broken
    contact(f, c, s * 1.05, s * 0.6, a, 0.35);
    f.part(ell(c, s, s * 0.72, a, 16), { fill: mix(bandCol(4), '#b8b060', 0.3), shade: 0.45, inkW: 1, inkHeavy: 1.6, cast: false });
    f.flat(ell(add(c, rot([-s * 0.3, -s * 0.3], a)), s * 0.28, s * 0.14, a - 0.5, 8), '#e6e2b0', { op: 0.7 });
    f.line(ell(c, s * 1.15, s * 0.85, a, 14).slice(4, 10), 0.8, mix(bandCol(4), INK, 0.5), { op: 0.5 }); // the skin pulled tight round it
  },
  void(f, c, s, a = 0) { // a small dark seal of void on the violet-black: a violet rim lit from the upper left, a clean-rimmed
    // hole of absence within, a soft contact shadow; no glow, no sparkle
    contact(f, c, s * 1.05, s * 0.8, a, 0.45);
    const rim = ell(c, s, s * 0.84, a, 20);
    f.part(rim, { fill: mix(INK6[5], '#b49ac4', 0.5), shadow: INK6[5], shade: 0.5, inkW: 1, inkHeavy: 1.5, cast: false, hatch: false });
    f.flat(ell(add(c, [s * 0.06, s * 0.08]), s * 0.58, s * 0.46, a, 16), '#0c0812');
    f.flat(ell(add(c, [s * 0.2, s * 0.18]), s * 0.3, s * 0.18, a, 10), '#2e2238', { op: 0.8 });
    f.line(rim.slice(10, 16), 0.8, '#e4d8ec', { op: 0.6 });
  },
};

// ---- a modelled hand with the inks. W: wrist, ang: wrist -> fingertips, L: wrist to the middle fingertip (px).
// o.view: 'back' or 'palm'; o.sq: across-hand foreshortening; o.flip: mirror across (thumb on the other side);
// o.curls: bend of each finger (index..little, radians shared over its three joints); o.cdir: which way they curl (+1/-1);
// o.spread; o.thumb: [base angle, bend] in local radians; o.scarRing (finger index).
// The whole hand is drawn and modelled in skin first, element by element (knuckles, tendons, nails, pads, mounts and
// creases), and each element's inks are laid over it as translucent dye before the next element covers it: vermilion
// from the middle joint to the tip, pale blue over the first joints and the knuckles, ochre-gold from the back of the hand
// into the wrist. Every edge is an ellipse round the finger or hand, gold-ruled.
function hand6(f, W, ang, L, o = {}) {
  const sq = o.sq ?? 0.86, fl = o.flip ? -1 : 1, F = fr2(W, ang, L, L * sq * fl), back = (o.view || 'back') === 'back';
  const am = back ? 1 : 0.72, inkO = (shapes, ci) => inkOver(f, shapes, ci, ALPHA[ci] * am); // palm skin holds the dye more faintly
  const skin = o.skin || SKIN, sk = mix(skin, INK, 0.5), lt = mix(skin, '#fff3d8', 0.45);
  const look = (x = {}) => Object.assign({ fill: skin, shadow: o.shadow, shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.4, k: 0.9 }, x);
  const S2 = p => F([p])[0], dirS = (a, b) => norm(sub(S2(b), S2(a)));
  const cd = o.cdir ?? 1, spread = o.spread ?? 0.08, curls = o.curls || [0.15, 0.2, 0.25, 0.32];
  const fv = [-0.15, -0.05, 0.05, 0.145], fu = [0.47, 0.485, 0.47, 0.435], fl0 = [0.42, 0.47, 0.44, 0.35], fw = [0.112, 0.116, 0.108, 0.094], jit = [0.04, -0.05, 0.06, -0.02];
  const fingers = fv.map((v, i) => {
    const a = (i - 1.5) * spread, c = curls[i] * cd, b0 = [fu[i], v];
    const k1 = add(b0, rot([fl0[i] * 0.46, 0], a + c * 0.35)), k2 = add(k1, rot([fl0[i] * 0.3, 0], a + c * 1.35)), k3 = add(k2, rot([fl0[i] * 0.24, 0], a + c * 2.05));
    const w = fw[i];
    const segs = [F(limb(b0, k1, w, w * 0.86, { steps: 5, q: [[0.12, 0.06, 0.2]] })), F(limb(k1, k2, w * 0.88, w * 0.72, { steps: 5, p: [[0.0, 0.1, 0.15]] })), F(limb(k2, k3, w * 0.74, w * 0.5, { steps: 5, capK: 1.1 }))];
    return { i, b0, k1, k2, k3, w, a, c, segs };
  });
  const ring = (P, d, hw, bow, ciA, ciB) => { // a ruled ellipse round the form
    f.line(cutCurve(add(P, mul(d, GAP / 2)), d, hw, bow, null, 1, 10), 0.6, mix(INK6[ciB], INK, 0.3), { op: 0.45 });
    f.line(cutCurve(add(P, mul(d, -GAP / 2)), d, hw, bow, null, 1, 10), 0.6, mix(INK6[ciA], INK, 0.3), { op: 0.4 });
    f.line(cutCurve(P, d, hw, bow, null, 1, 10), 0.8, GOLD, { op: 0.9 });
  };
  const finger = g => {
    for (const sg of g.segs) f.part(sg, look({ inkW: 1, inkHeavy: 1.4, shade: 0.45 }));
    // skin modelling first: joint creases and wrinkles, knuckle light, nails or pads
    const n1 = rot([0, 1], g.a + g.c * 0.85), n2 = rot([0, 1], g.a + g.c * 1.7), na = g.a + g.c * 2.05;
    for (const [k, n, w0] of [[g.k1, n1, g.w * 0.88], [g.k2, n2, g.w * 0.74]]) {
      if (back) {
        f.flat(F(ell(k, 0.03, w0 * 0.28, g.a + g.c, 8)), lt, { op: 0.55 });
        for (const dd of [-0.012, 0.0, 0.012]) f.line(F([add(add(k, mul(n, -w0 * 0.3)), [dd, 0]), add(k, [dd + 0.008, 0]), add(add(k, mul(n, w0 * 0.3)), [dd, 0])]), 0.7, sk, { op: 0.6 });
      } else f.line(F([add(k, mul(n, -w0 * 0.4)), add(k, mul(n, w0 * 0.4))]), 0.9, sk, { op: 0.7 });
    }
    const nc = lerp(g.k2, g.k3, 0.6), nail = F(ell(nc, 0.055, g.w * 0.25, na, 10));
    if (back) { f.part(nail, look({ fill: mix(skin, '#f0e4d4', 0.45), inkW: 0.7, inkHeavy: 0, shade: 0.3, hatch: false, tex: undefined })); f.line(F([add(nc, rot([-0.04, -g.w * 0.2], na)), add(nc, rot([-0.045, g.w * 0.2], na))]), 0.6, sk, { op: 0.5 }); }
    else { f.flat(F(ell(lerp(g.k2, g.k3, 0.45), 0.045, g.w * 0.26, na, 8)), lt, { op: 0.45 }); f.flat(F(ell(add(g.k3, rot([-0.012, 0], na)), 0.014, g.w * 0.2, na, 8)), mix(skin, '#f0e4d4', 0.5), { op: 0.7 }); } // pad; the nail's free edge past the tip
    if (o.scarRing === g.i) { const r0 = lerp(g.b0, g.k1, 0.45); f.line(F([add(r0, rot([0, -g.w * 0.5], g.a)), add(r0, rot([0.01, 0], g.a)), add(r0, rot([0, g.w * 0.5], g.a))]), 1.8, mix(skin, '#f0e8dc', 0.6), { op: 0.7 }); }
    // the inks over it: pale blue to the middle joint, vermilion from there to the tip, ruled round the finger
    const t = 0.86 + jit[g.i], P0 = S2(lerp(g.b0, g.k1, t)), d = dirS(g.b0, g.k1), hw = g.w * L * sq * 0.5 + 2, bow = g.w * L * sq * 0.34;
    clipDraw(f, cutRegionP(add(P0, mul(d, -GAP / 2)), d, hw, bow), () => inkO(g.segs, 1));
    clipDraw(f, cutRegion(add(P0, mul(d, GAP / 2)), d, hw, bow, null), () => inkO(g.segs, 0));
    ring(P0, d, hw - 2, bow, 1, 0);
    if (back) f.flat(nail, mix(skin, '#f8f0e4', 0.5), { op: 0.35 }); // the nail plate reads through the dye
    else { f.flat(F(ell(lerp(g.k2, g.k3, 0.45), 0.04, g.w * 0.22, na, 8)), lt, { op: 0.3 }); f.flat(F(ell(add(g.k3, rot([-0.012, 0], na)), 0.014, g.w * 0.2, na, 8)), mix(skin, '#f0e4d4', 0.5), { op: 0.5 }); }
    for (const [k, n, w0] of [[g.k1, n1, g.w * 0.88], [g.k2, n2, g.w * 0.74]]) f.line(F([add(k, mul(n, -w0 * 0.36)), add(k, mul(n, w0 * 0.36))]), 0.7, mix(INK6[0], INK, 0.4), { op: 0.45 }); // ink pooled in the joint creases
    // the skin's light coming back up through the dye on the finger's lit side: a cylinder, not a painted tube
    { const Lt = norm(f.o.light), pts = [g.b0, lerp(g.b0, g.k1, 0.5), g.k1, lerp(g.k1, g.k2, 0.5), g.k2, lerp(g.k2, g.k3, 0.6)].map(S2);
      const d0 = norm(sub(pts[pts.length - 1], pts[0])), nn = [-d0[1], d0[0]], sg = (nn[0] * Lt[0] + nn[1] * Lt[1]) > 0 ? 1 : -1, off = g.w * L * sq * 0.22;
      f.line(pts.map(q => add(q, mul(nn, sg * off))), Math.max(1.2, g.w * L * 0.16), lt, { op: 0.4 }); }
  };
  // the hand's plate (back or palm): ochre-gold at the wrist, pale blue over the knuckle half
  const plate = F(back ? [[-0.03, -0.14], [0.12, -0.19], [0.3, -0.215], [0.45, -0.2], [0.5, -0.12], [0.51, -0.02], [0.495, 0.08], [0.455, 0.18], [0.3, 0.2], [0.12, 0.175], [-0.03, 0.14], [-0.06, 0.0]]
    : [[-0.03, -0.15], [0.12, -0.2], [0.3, -0.22], [0.45, -0.21], [0.5, -0.12], [0.51, -0.02], [0.5, 0.08], [0.46, 0.19], [0.3, 0.21], [0.12, 0.19], [-0.03, 0.15], [-0.06, 0.0]]);
  const drawPlate = () => {
    const dp = f.part(plate, look({ shade: 0.4, inkW: 1.3, inkHeavy: 2 }));
    clipDraw(f, dp, () => {
      if (back) {
        for (const g of fingers) {
          glow(f, S2([g.b0[0] - 0.01, g.b0[1]]), L * 0.035, L * 0.04, '#fff3d8', 0.5); // knuckle caps
          f.flat(F(ell([g.b0[0] + 0.03, g.b0[1] + 0.01], 0.02, g.w * 0.36, 0, 8)), sk, { op: 0.3 });
          f.line(F([[0.04, g.b0[1] * 0.55], [0.2, g.b0[1] * 0.75], [g.b0[0] - 0.05, g.b0[1]]]), 0.9, sk, { op: 0.5 }); // extensor tendons
          f.line(F([[0.06, g.b0[1] * 0.55 - 0.014], [0.22, g.b0[1] * 0.75 - 0.014], [g.b0[0] - 0.07, g.b0[1] - 0.014]]), 0.8, lt, { op: 0.5 });
        }
        f.line(F([[0.0, 0.04], [0.1, 0.0], [0.18, 0.05], [0.26, -0.02], [0.32, 0.02]]), 1.1, '#5a6a8a', { op: 0.35 }); // a vein
        glow(f, S2([0.03, 0.15]), L * 0.04, L * 0.035, '#fff3d8', 0.5); // the wrist bone
      } else {
        // the palm's mounts: thenar and hypothenar, the pads under the fingers; the creases
        glow(f, S2([0.16, -0.12]), L * 0.12, L * 0.09, '#fff3d8', 0.4);
        glow(f, S2([0.2, 0.13]), L * 0.12, L * 0.06, '#fff3d8', 0.3);
        for (const g of fingers) glow(f, S2([g.b0[0] - 0.05, g.b0[1]]), L * 0.04, L * 0.045, '#fff3d8', 0.35);
        glow(f, S2([0.3, 0.0]), L * 0.1, L * 0.1, '#2a1712', 0.18); // the hollow of the palm
        for (const l of [[[0.38, 0.19], [0.4, 0.06], [0.41, -0.06], [0.43, -0.18]], [[0.33, 0.18], [0.31, 0.03], [0.31, -0.12]], [[0.33, -0.2], [0.22, -0.08], [0.1, -0.05], [0.0, -0.08]]]) {
          f.line(F(l), 1.8, sk, { op: 0.2 }); f.line(F(l), 0.9, sk, { op: 0.75 });
        }
        f.line(F([[0.06, 0.16], [0.2, 0.19], [0.34, 0.19]]), 1, sk, { op: 0.4 });
      }
      // inks: ochre-gold at the wrist, pale blue over the knuckle half
      const cu = o.cutAt ?? 0.34, cP = S2([cu, 0]), dirv = dirS([0, 0], [1, 0]), hw = L * sq * 0.26, bow = L * 0.09;
      clipDraw(f, cutRegionP(add(cP, mul(dirv, -GAP / 2)), dirv, hw, bow), () => inkO([plate], 2));
      clipDraw(f, cutRegion(add(cP, mul(dirv, GAP / 2)), dirv, hw, bow, null), () => inkO([plate], 1));
      ring(cP, dirv, hw, bow, 2, 1);
      // the skin's light back through the dye: knuckle caps or the palm's mounts and the heel of the hand
      if (back) { for (const g of fingers) glow(f, S2([g.b0[0] - 0.01, g.b0[1]]), L * 0.04, L * 0.045, '#fff3d8', 0.45); glow(f, S2([0.22, -0.06]), L * 0.12, L * 0.07, '#fff3d8', 0.25); }
      else { glow(f, S2([0.16, -0.12]), L * 0.12, L * 0.09, '#fff3d8', 0.35); glow(f, S2([0.18, 0.13]), L * 0.12, L * 0.06, '#fff3d8', 0.25); for (const g of fingers) glow(f, S2([g.b0[0] - 0.05, g.b0[1]]), L * 0.04, L * 0.045, '#fff3d8', 0.35); }
      script(f, cutCurve(S2([cu + 0.08, 0]), dirv, hw * 0.8, bow, null, 1, 22), dirv, mix(INK6[1], INK, 0.3), L / 76);
      script(f, cutCurve(S2([cu - 0.14, 0]), dirv, hw * 0.75, bow, null, 1, 22), dirv, mix(INK6[2], INK, 0.3), L / 76);
      if (!back) for (const l of [[[0.38, 0.19], [0.4, 0.06], [0.41, -0.06], [0.43, -0.18]], [[0.33, 0.18], [0.31, 0.03], [0.31, -0.12]], [[0.33, -0.2], [0.22, -0.08], [0.1, -0.05], [0.0, -0.08]]]) f.line(F(l), 0.9, mix(INK6[2], INK, 0.45), { op: 0.55 }); // ink pooled in the creases
    });
  };
  const thumb = () => {
    const [ta, tb] = o.thumb || (back ? [-0.75, 0.25] : [-0.95, 0.35]);
    const t0 = [0.1, -0.1], t1 = add(t0, rot([0.2, 0], ta)), t2 = add(t1, rot([0.15, 0], ta + tb)), t3 = add(t2, rot([0.13, 0], ta + tb * 2));
    const segs = [F(limb(t0, t1, 0.2, 0.13, { steps: 5, q: [[0.4, 0.15, 0.25]] })), F(limb(t1, t2, 0.13, 0.11, { steps: 5 })), F(limb(t2, t3, 0.11, 0.075, { steps: 5, capK: 1.1 }))];
    for (const sg of segs) f.part(sg, look({ inkW: 1.1, inkHeavy: 1.5 }));
    const tn = lerp(t2, t3, 0.6);
    if (back) f.part(F(ell(tn, 0.05, 0.03, ta + tb * 2, 8)), look({ fill: mix(skin, '#f0e4d4', 0.45), inkW: 0.7, inkHeavy: 0, shade: 0.3, hatch: false, tex: undefined }));
    else f.flat(F(ell(tn, 0.04, 0.03, ta + tb * 2, 8)), lt, { op: 0.45 });
    f.line(F([add(t1, mul(rot([0, 1], ta), -0.05)), add(t1, mul(rot([0, 1], ta), 0.05))]), 0.8, sk, { op: 0.6 });
    // inks: gold on the thumb's root, pale blue on its first joint, vermilion on its tip
    const d1 = dirS(t0, t1), d2 = dirS(t2, t3), P1 = S2(lerp(t0, t1, 0.96)), P2 = S2(lerp(t2, t3, 0.1)), hw1 = 0.08 * L * sq + 2, hw2 = 0.06 * L * sq + 2;
    clipDraw(f, cutRegionP(add(P1, mul(d1, -GAP / 2)), d1, hw1, hw1 * 0.6), () => inkO(segs, 2));
    clipDraw(f, cutRegion(add(P1, mul(d1, GAP / 2)), d1, hw1, hw1 * 0.6, null), () => clipDraw(f, cutRegionP(add(P2, mul(d2, -GAP / 2)), d2, hw2, hw2 * 0.6), () => inkO(segs, 1)));
    clipDraw(f, cutRegion(add(P2, mul(d2, GAP / 2)), d2, hw2, hw2 * 0.6, null), () => inkO(segs, 0));
    ring(P1, d1, hw1 - 2, hw1 * 0.6, 2, 1); ring(P2, d2, hw2 - 2, hw2 * 0.6, 1, 0);
    { const Lt = norm(f.o.light), pts = [t0, t1, t2, lerp(t2, t3, 0.7)].map(S2), d0 = norm(sub(pts[3], pts[0])), nn = [-d0[1], d0[0]], sg = (nn[0] * Lt[0] + nn[1] * Lt[1]) > 0 ? 1 : -1;
      f.line(pts.map(q => add(q, mul(nn, sg * 0.03 * L * sq))), Math.max(1.2, 0.018 * L), lt, { op: 0.4 }); }
    return S2(t3);
  };
  let tTip;
  const order = fingers.slice().reverse(); // little finger first
  if (back) { tTip = thumb(); order.forEach(finger); drawPlate(); }
  else { order.forEach(finger); drawPlate(); tTip = thumb(); }
  return { F, tips: fingers.map(g => F([g.k3])[0]), thumbTip: tTip,
    fire: F([lerp(fingers[o.fireOn ?? 1].k2, fingers[o.fireOn ?? 1].k3, 0.55)])[0],
    frost: F([back ? [0.47, 0.02] : [0.44, 0.02]])[0], lightning: F([[0.1, 0.0]])[0] };
}

module.exports = { K, E, B, G, INK, rubric, KK, COURSES, INK6, SKIN, GAP, GOLD, GOLDD, script, ALPHA, inkOver, cutRegionP, bandCol, clipDraw, wobbler, cutCurve, cutRegion, along, bandedLimb, hand6, STACK, tube, DYE, contact };
