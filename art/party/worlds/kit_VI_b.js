// World VI, The Stormwrack Coast, batch b: helpers for world_VI_b.js (the 11 creatures added to the reviewed 8).
// Builds on kit_VI.js (required, never edited): the same palette, feathers, crab legs, sea-wear and Lichtenberg burns.
// Lightning here is only ever a mark on the figure: branching burns that spread from fused metal, fused joints,
// welds, standing hair and lifted feathers. No arcs or bolts are drawn (strikes are engine effects).
// hairMass is copied from kit_I_c.js. Everything else is new. All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const V = require('./kit_VI');
const { P, R, scatter, ang, dir } = V;

// one connected mass of hair along a path, its end split into tapering tips (copied from kit_I_c)
function hairMass(f, path, ws, look, o = {}) {
  const n = 24, C = [], W = [];
  for (let i = 0; i <= n; i++) { const t = i / n * (path.length - 1), k = Math.min(path.length - 2, Math.floor(t)), u = t - k; C.push(lerp(path[k], path[k + 1], u)); W.push(ws[k] + (ws[k + 1] - ws[k]) * u); }
  const top = [], bot = [], ph = o.phase ?? 0, amp = o.amp ?? 4;
  C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n, i + 1)], d = E.norm(sub(b, a)), m = [-d[1], d[0]], t = i / n;
    top.push(add(c, mul(m, W[i] / 2 + Math.sin(t * 11 + ph) * amp * t))); bot.push(add(c, mul(m, -W[i] / 2 + Math.sin(t * 9 + ph + 1) * amp * t))); });
  const tips = o.tips || 4, end = C[n], a = C[n - 2], d = E.norm(sub(end, a)), m = [-d[1], d[0]], we = W[n];
  const tipPts = [];
  for (let k = 0; k < tips; k++) {
    const u = we / 2 - we * (k + 0.5) / tips, L = (o.tipL ?? 40) * (0.6 + 0.4 * Math.sin(k * 2.3 + ph)), curlv = rot(d, (o.tipCurl ?? 0.3) * (k - tips / 2) / tips);
    tipPts.push([...add(add(end, mul(m, u)), mul(curlv, L)), 1]);
    if (k < tips - 1) tipPts.push(add(add(end, mul(m, we / 2 - we * (k + 1) / tips)), mul(d, -8)));
  }
  const outline = [...top, ...tipPts, ...bot.slice().reverse()];
  f.part(outline, Object.assign({ k: 0.85 }, look));
  if (o.strands !== false) for (let s = 1; s < 6; s++) { const v = s / 6 - 0.5; const pts = C.slice(1, n - 1).filter((_, i) => i % 2 === 0).map((c, i) => { const j = i * 2 + 1, aa = C[Math.max(0, j - 1)], bb = C[Math.min(n, j + 1)], dd = E.norm(sub(bb, aa)), mm = [-dd[1], dd[0]]; return add(c, mul(mm, v * W[j] * 0.9 + Math.sin(j * 0.7 + s) * 2)); }); f.line(pts, s % 2 ? 1.2 : 1, s % 2 ? (o.lit || P.slateP) : INK, { op: s % 2 ? 0.55 : 0.5 }); }
  return { top, bot, C, outline };
}

// lumpy ellipse (irregular rims, charred halos)
const lumpE = (f, c, rx, ry, a = 0, j = 0.3, n = 14) => ell(c, rx, ry, a, n).map((q, i) => add(q, [(f.r() - 0.5) * rx * j, (f.r() - 0.5) * ry * j]));

// A weld: metal fused into flesh by a strike. c: the junction, a: the metal's direction, w: the metal's width.
// A charred halo, a bead of fused metal along the junction with a hot glint, a pale shiny keloid rim, and Lichtenberg
// burns branching out of it (o.burns: [[angle, length, width]]).
function weld(f, c, a, w, o = {}) {
  const n = [-Math.sin(a), Math.cos(a)];
  f.flat(lumpE(f, c, w * 0.95, w * 0.62, a + Math.PI / 2, 0.35), '#120f0e', { op: o.haloOp ?? 0.62 });
  if (w >= 14 && o.rim !== false) f.line(ell(c, w * 0.78, w * 0.5, a + Math.PI / 2, 14).slice(3, 11), 1.6, P.scarL, { op: 0.55 });
  for (let i = -2; i <= 2; i++) { const q = add(c, mul(n, i * w * 0.2)), r = w * R(f, 0.1, 0.16); f.part(lumpE(f, q, r * 1.3, r, a, 0.2, 8), { fill: o.metal || P.ironD, shadow: '#060505', light: P.ironL, shade: 0.4, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false }); }
  f.line([add(c, mul(n, -w * 0.32)), add(c, mul(n, w * 0.3))], 1.1, P.lampL, { op: 0.75 });
  // burns: a skin scar by default; on timber, iron or cloth a scorch (o.burnCol / o.burnLite, or the figure-wide f.o.burnCol)
  const bc = o.burnCol || f.o.burnCol, bl0 = o.burnLite || f.o.burnLite;
  for (const [ba, bl, bw] of (o.burns || [])) V.lichtenberg(f, add(c, rot([w * 0.5, 0], ba)), ba, bl, bw, Object.assign({ depth: o.depth ?? 2, fork: 0.7 }, bc ? { col: bc, lite: bl0 || '#7a7060' } : {}));
}

// an iron strap band from a to b, width w, riveted, pitted, a worn bright edge; o.rivets: count
function strap(f, a, b, w, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  f.part([add(a, mul(n, w / 2)), add(b, mul(n, w / 2)), add(b, mul(n, -w / 2)), add(a, mul(n, -w / 2))].map(q => [...q, 1]), V.IR(f, Object.assign({ inkW: 1.3, inkHeavy: 1.8, cast: false, shade: 0.35 }, o.look || {})));
  f.line([add(a, mul(n, w * 0.38)), add(b, mul(n, w * 0.38))], 1, P.ironL, { op: 0.7, straight: true });
  const nr = o.rivets ?? 3; for (let i = 0; i < nr; i++) f.rivet(lerp(a, b, (i + 0.5) / nr), Math.max(1.8, w * 0.17), P.ironL);
  if (o.rust !== false) f.flat(ell(lerp(a, b, 0.6 + f.r() * 0.3), w * 0.5, w * 0.3, Math.atan2(d[1], d[0]), 8), P.rust, { op: 0.45 });
}

// wet fur trim along a polyline: a thick band whose lower edge clumps into wet points hanging plumb
function furTrim(f, line, w, col, o = {}) {
  const top = [], bot = [];
  line.forEach((p, i) => { const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)], d = E.norm(sub(b, a)), n = [-d[1], d[0]]; top.push(add(p, mul(n, w / 2))); bot.push(add(p, mul(n, -w / 2))); });
  // the lower (or outer) edge breaks into clumps
  const rag = []; for (let i = 0; i < bot.length - 1; i++) { const p0 = bot[i], p1 = bot[i + 1], L = E.len(sub(p1, p0)), k = Math.max(1, Math.round(L / (w * 0.45))); for (let j = 0; j < k; j++) { const q0 = lerp(p0, p1, (j + (f.r() - 0.5) * 0.4) / k), q1 = lerp(p0, p1, (j + 0.3 + f.r() * 0.4) / k), hl = w * (0.12 + Math.pow(f.r(), 1.8) * 1.1) * (o.hang ?? 1); rag.push(add(q0, [0, w * f.r() * 0.15]), f.r() > 0.35 ? [...add(q1, [(f.r() - 0.5) * 4, hl]), 1] : add(q1, [0, hl])); } /* wet clumps of uneven size and spacing, a few long, some barely parted */ }
  rag.push(bot[bot.length - 1]);
  const out = [...top, ...rag.reverse()];
  f.part(out, { fill: col, shadow: mix(col, '#000', 0.6), shade: 0.4, tex: 'hatch' + f.o.seed, texOp: 0.4, k: 0.8, inkW: 1.3 });
  for (let i = 0; i < line.length * 3; i++) { const t = i / (line.length * 3), j = Math.min(line.length - 2, Math.floor(t * (line.length - 1))), q = lerp(line[j], line[j + 1], t * (line.length - 1) - j), p0 = add(q, [(f.r() - 0.5) * w * 0.6, -w * 0.25]); f.line([p0, add(p0, [(f.r() - 0.5) * 3, w * R(f, 0.35, 0.6)])], 1, f.r() > 0.5 ? mix(col, '#fff', 0.35) : INK, { op: 0.55 }); }
  return out;
}

// a timber box in 3/4: three visible faces given as quads (top, side, front) with plank seams and grain
function boxFaces(f, faces, look, o = {}) {
  const shades = [0.08, 0, -0.22];
  faces.forEach((q, i) => { if (!q) return; f.part(q.map(p => [...p, 1]), Object.assign({}, look, { fill: mix(look.fill, shades[i] > 0 ? '#fff' : '#000', Math.abs(shades[i])), cast: i === 2 })); });
}

// a bare foot in any orientation: A the ankle, a the direction the toes point, sole: +1 if the sole lies on the right
// of the toe direction (the clockwise side). s: foot length unit, h: ankle height above the sole. Heel, Achilles, arch,
// ball, big toe with its nail, the small toes as pads, calluses. Returns the outline.
function looseFoot(f, A, a, s, h, look, o = {}) {
  const sg = o.sole ?? 1, F0 = frame(A, a, 1), F = pts => F0(pts.map(q => q.length > 2 ? [q[0], q[1] * sg, q[2]] : [q[0], q[1] * sg]));
  const X = u => u * s, sw = o.swell ?? 0;
  for (let i = 3; i >= 1; i--) { const tx = 1.13 - i * 0.075; f.part(F(ell([X(tx), h * 0.88], s * 0.065, h * 0.1, 0, 10)), Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false, shade: 0.45, fill: mix(look.fill, '#3a2a30', 0.1 + i * 0.05) })); }
  const pts = F([[X(0.22), -4], [X(0.36 + sw * 0.06), h * 0.28], [X(0.62), h * 0.5], [X(0.92), h * 0.66], [X(1.08), h * 0.7], [X(1.2), h * 0.8], [X(1.24), h * 0.93], [X(1.16), h, 1], [X(0.86), h - 1], [X(0.62), h * 0.9], [X(0.36), h * 0.93], [X(0.06), h, 1], [X(-0.2), h - 1], [X(-0.33), h * 0.82], [X(-0.33), h * 0.52], [X(-0.24), h * 0.12], [X(-0.2), -4]]);
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const dk = mix(look.fill, '#2a1c22', 0.45), lt = mix(look.fill, '#fff', 0.3);
  f.part(F([[X(0.98), h * 0.67], [X(1.12), h * 0.71], [X(1.22), h * 0.82], [X(1.23), h * 0.92], [X(1.12), h * 0.94], [X(1.02), h * 0.86]]), Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.4 }));
  f.flat(F([[X(1.12), h * 0.75], [X(1.2), h * 0.82], [X(1.21), h * 0.89], [X(1.13), h * 0.85]]), mix(look.fill, '#e8dcc8', 0.5), { op: 0.9 });
  // the small toes, stepped back along the top of the foot, each a knuckled pad with a nail
  for (let i = 0; i < 3; i++) { const u = 1.06 - i * 0.07, v = 0.6 - i * 0.07; f.part(F([[X(u - 0.1), h * (v - 0.02)], [X(u + 0.02), h * (v - 0.06)], [X(u + 0.1), h * (v + 0.04)], [X(u + 0.06), h * (v + 0.16)], [X(u - 0.06), h * (v + 0.14)]]), Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false, shade: 0.4, fill: mix(look.fill, '#3a2a30', 0.06 + i * 0.05) })); f.flat(F(ell([X(u + 0.05), h * (v + 0.03)], X(0.03), h * 0.035, 0, 6)), mix(look.fill, '#e8dcc8', 0.45), { op: 0.85 }); }
  f.line(F([[X(-0.22), h * 0.05], [X(-0.24), h * 0.6]]), 1, dk, { op: 0.6 });
  f.line(F([[X(0.34), h * 0.32], [X(0.56), h * 0.52], [X(0.82), h * 0.64]]), 1, lt, { op: 0.6 });
  f.line(F([[X(0.0), h * 0.3], [X(0.08), h * 0.36]]), 1.2, INK, { op: 0.5 }); // ankle bone
  // calluses: yellowed, cracked pads at the heel and the ball
  for (const [u, w] of [[-0.12, 0.2], [0.78, 0.24]]) { f.flat(F(ell([X(u), h * 0.95], X(w), h * 0.07, 0, 10)), '#b8ae8a', { op: 0.75 }); f.line(F([[X(u - w * 0.5), h * 0.95], [X(u), h * 0.92], [X(u + w * 0.4), h * 0.96]]), 0.8, INK, { op: 0.6 }); }
  return pts;
}

// An octopus arm: a spline centre line through ctrl, thick at the base and tapering to a fine curled tip (taper is
// not linear: the arm stays muscular for its first third). The oral side (o.oral = +1/-1, the side the suckers are on)
// is a paler band, and the suckers sit along it in two staggered rows that follow the arm, shrinking to the tip; each
// is a cup with a pale rim and a dark mouth, rimmed on the edge so it reads as raised. Returns the centre line tools.
function tentacle(f, ctrl, w0, look, o = {}) {
  const C = V.spline(ctrl, 3), Sx = V.arcLen(C), L = Sx[Sx.length - 1], sg = o.oral ?? 1;
  const wf = t => Math.max(2.2, w0 * (t < 0.3 ? 1 - t * 0.45 : 0.865 * Math.pow((1 - t) / 0.7, 0.95)) * (1 + (o.swell || 0) * Math.exp(-(((t - 0.08) / 0.12) ** 2))));
  const out = V.ribbon(C, t => wf(t)); f.part(out, Object.assign({ k: 0.9 }, look));
  const at = u => V.at(C, Sx, u);
  // the oral band, paler and wrinkled
  const band = [], end = o.bandEnd ?? 0.96;
  for (let i = 0; i <= 30; i++) { const t = i / 30 * end, a = at(t * L); band.push(add(a.p, mul(a.n, sg * wf(t) * 0.5))); }
  for (let i = 30; i >= 0; i--) { const t = i / 30 * end, a = at(t * L); band.push(add(a.p, mul(a.n, sg * wf(t) * 0.12))); }
  f.part(band, Object.assign({}, look, { fill: o.under || mix(look.fill, '#e0e2dc', 0.42), shadow: look.shadow, cast: false, inkW: 0.8, inkHeavy: 1.1, maxShade: 6 }));
  // muscle rings across the arm's top side
  for (let t = 0.05; t < 0.85; t += 0.07) { const a = at(t * L), w = wf(t); f.line([add(a.p, mul(a.n, sg * w * 0.1)), add(add(a.p, mul(a.n, -sg * w * 0.2)), mul(a.d, w * 0.08)), add(a.p, mul(a.n, -sg * w * 0.46))], 0.9, INK, { op: 0.35 }); }
  // suckers: two staggered rows along the oral side
  const sk = [];
  let t = o.suckFrom ?? 0.06, k = 0;
  while (t < (o.suckTo ?? 0.95)) {
    const w = wf(t), a = at(t * L), off = k % 2 ? 0.3 : 0.46, r = Math.max(1.4, w * 0.17), q = add(a.p, mul(a.n, sg * w * off)), aa = Math.atan2(a.d[1], a.d[0]);
    sk.push({ q, r, t, a: aa, n: a.n });
    if (!(o.skip && o.skip(t))) {
      f.part(ell(q, r * 1.05, r * 0.78, aa, 10), { fill: o.cup || mix(look.fill, '#eceee8', 0.55), shadow: mix(look.fill, '#000', 0.3), shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
      f.flat(ell(add(q, mul(a.n, sg * r * 0.15)), r * 0.5, r * 0.36, aa, 8), '#2a2228', { op: 0.85 });
    }
    t += Math.max(0.012, (w * 0.26) / L); k++;
  }
  return { C, S: Sx, L, wf, at, out, suckers: sk };
}

// One storm petrel, facing right. c: body centre, k: scale (1 = a 60 px body), o.wing: [nearAngle, farAngle] of the
// raised wings (radians, the leading edge from the shoulder), o.gape: how far the bill is open, o.broken: the near wing
// hangs broken. Lightning has stood every feather on end: the body is a ruffled mass of spiky contour feathers round a
// bird's shape (head, breast, tail), the wingtips scorched and frayed, a fern of burns across the white rump band.
// Returns anchor points (bill tip, feet, rump) for props.
function petrel(f, c, k, o = {}) {
  const ink = INK, soot = o.col || '#2e3036', sootL = mix(soot, '#9aa2a8', 0.35), look = { fill: soot, shadow: '#0c0e12', light: sootL, shade: 0.38, tex: 'barb' + f.o.seed, texOp: 0.45, inkW: 1, inkHeavy: 1.4 };
  const F = frame(c, o.tilt || 0, k), A = q => F([q])[0];
  const wing = (S0, a, L, near) => {
    // a long narrow pointed wing: the arm and hand along the leading edge, a covert mass over the bases, primaries lying
    // close along the hand (slotted at the tips), short secondaries on the trailing edge
    const hb = (o.broken && near ? 1.3 : 0.18), W = add(S0, rot([L * 0.4, 0], a)), T = add(W, rot([L * 0.6, 0], a + hb));
    const tr = a + Math.PI / 2, lk = Object.assign({}, look, { fill: near ? soot : mix(soot, '#000', 0.25) });
    for (let i = 5; i >= 0; i--) { const t = i / 5, r0 = lerp(S0, W, 0.15 + t * 0.85); V.feather(f, r0, tr - 0.35 + 0.25 * t, L * 0.26, L * 0.1, Object.assign({}, lk, { fill: mix(lk.fill, '#fff', 0.03) }), { lead: 0.45, round: true, splits: false, lift: i % 2 }); }
    for (let i = 0; i < 6; i++) { const t = i / 5, r0 = lerp(W, T, 0.05 + t * 0.6), fa = ang(W, T) + (1 - t) * 0.45; V.feather(f, r0, fa, L * (0.42 + t * 0.12), L * 0.11, Object.assign({}, lk), { lead: 0.32, round: false, emarg: t > 0.5 ? 0.55 : 0, dark: o.scorch ?? 0.3, darkCol: '#0a0806', darkOp: 0.65, lift: 1, splits: false }); }
    const cov = [add(S0, rot([-5 * k, -3 * k], a)), add(lerp(S0, W, 0.5), rot([0, -4 * k], a)), add(W, rot([8 * k, -3 * k], a)), add(W, rot([L * 0.1, L * 0.1], a + hb)), add(W, rot([-L * 0.05, L * 0.17], a)), add(S0, rot([L * 0.08, L * 0.2], a))];
    V.plumeMass(f, cov, tr, L * 0.07, Object.assign({}, lk, { fill: mix(lk.fill, '#fff', 0.08) }), { w: 0.8, op: 0.45 });
    if (o.broken && near) { f.flat(ell(W, 4 * k, 3 * k, 0, 8), '#3a1a18', { op: 0.8 }); f.line([W, add(W, [3 * k, 6 * k])], 1.4, '#d8d0c0'); }
    return { W, T };
  };
  const wn = o.wing || [-2.0, -2.3];
  const far = wing(A([8, -12]), wn[1], 80 * k, false);
  // legs dangling, webbed feet pattering (dark legs and webs: the ochre webs read as gold), drawn before the body
  const feet = [];
  for (const [x, l, sw] of [[4, 30, 0.2], [12, 34, -0.15]]) { const h0 = A([x, 14]), a2 = Math.PI / 2 + (o.legAng || 0.25) + sw, kn = add(h0, rot([l * 0.5 * k, 0], a2)), ft = add(kn, rot([l * 0.5 * k, 0], a2 + 0.2)); f.part(K.chain([h0, kn, ft], [4.6 * k, 3.6 * k, 3.4 * k], { steps: 4 }), { fill: '#3a3a40', shadow: '#101014', shade: 0.4, inkW: 0.9, inkHeavy: 1.1, cast: false }); const web = [ft, add(ft, rot([12 * k, -5 * k], a2 - 1.2)), add(ft, rot([14 * k, 0], a2 - 0.9)), add(ft, rot([12 * k, 5 * k], a2 - 0.6))]; f.part(web, { fill: '#2e2e32', shadow: '#0c0c0e', light: '#5a5a60', shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false }); f.line([ft, web[2]], 0.8, ink, { op: 0.6 }); feet.push(ft); }
  // the body: a bird's shape (crown, breast, belly, the tail behind) with its contour feathers stood on end
  const body = [A([34, -6]), A([24, -16]), A([6, -20]), A([-14, -16]), A([-30, -8]), A([-46, -4]), A([-52, 2]), A([-44, 8]), A([-26, 14]), A([-4, 18]), A([18, 14]), A([32, 6])];
  f.part(body, Object.assign({}, look, { k: 0.9, shade: 0.42 }));
  // spiky standing feathers all over: tapered points radiating from the body's core, darker inside, lit at the tips
  const core = A([-4, 0]);
  for (let i = 0; i < (o.spikes ?? 44); i++) { const q = lerp(body[i % body.length], body[(i + 1) % body.length], f.r()), r0 = lerp(core, q, 0.5 + f.r() * 0.35), dd = E.norm(sub(q, core)), L2 = (4 + f.r() * 6) * k, tip = add(add(r0, mul(dd, L2 + E.len(sub(q, r0)))), rot([0, (f.r() - 0.5) * 6 * k], 0)); const nn = [-dd[1], dd[0]]; f.part([add(r0, mul(nn, 3 * k)), tip, add(r0, mul(nn, -3 * k))], Object.assign({}, look, { fill: mix(soot, '#fff', f.r() * 0.1), inkW: 0.8, inkHeavy: 1, cast: false, k: 0.5, shade: 0.4 })); }
  // white rump band with a fern of burns across it
  const rump = [A([-30, -9]), A([-20, -13]), A([-18, 9]), A([-30, 10]), A([-36, 2])];
  f.part(rump, { fill: P.surfD, shadow: P.surfS, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, tex: 'barb' + f.o.seed, texOp: 0.3 });
  V.clipDraw(f, rump, () => V.lichtenberg(f, A([-14, -2]), Math.PI + (o.tilt || 0) + 0.2, 18 * k, 1.1 * k, { depth: 2, col: '#3a2a2c', lite: '#e8e0d0' }));
  // tail: a short square fan
  for (let i = 0; i < 4; i++) V.feather(f, A([-44, -2 + i * 2]), Math.PI + (o.tilt || 0) + (i - 1.5) * 0.12, 22 * k, 7 * k, look, { lead: 0.5, round: true, splits: false, lift: 1 });
  // head: a small round crown, a dark eye, the tube-nosed hooked bill, open
  const hc = A([30, -8]);
  f.part(ell(hc, 11 * k, 10 * k, o.tilt || 0, 12), Object.assign({}, look, { cast: false }));
  for (let i = 0; i < 5; i++) { const aa = -2.4 + i * 0.4 + (o.tilt || 0), r0 = add(hc, rot([8 * k, 0], aa)); f.part([add(r0, rot([0, -2 * k], aa)), add(r0, rot([7 * k, 0], aa)), add(r0, rot([0, 2 * k], aa))], Object.assign({}, look, { inkW: 0.7, inkHeavy: 0.9, cast: false })); }
  f.flat(ell(A([33, -10]), 2.6 * k, 2.4 * k, 0, 8), '#060608'); f.flat(ell(A([32.4, -10.6]), 0.8 * k, 0.8 * k, 0, 6), '#d8dcd8', { op: 0.8 });
  const g = o.gape ?? 0.35, bb = A([38, -6]);
  const upper = [A([37, -10]), A([46, -10]), A([54, -7]), A([57, -3]), A([54, -4]), A([46, -5]), A([38, -4])];
  const lower = [A([38, -4]), ...[[46, -2], [54, 0], [52, 2], [44, 1], [38, 0]].map(q => add(bb, rot(sub(A(q), bb), g)))];
  f.part(lower, { fill: '#2a2a2e', shadow: '#0a0a0c', shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
  f.flat([A([38, -4]), A([50, -5]), add(bb, rot(sub(A([50, -1]), bb), g))], '#2e2228', { op: 0.95 }); // the open mouth
  f.part(upper, { fill: '#2e2e32', shadow: '#0a0a0c', shade: 0.35, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
  f.part([A([37, -11]), A([46, -12]), A([47, -9]), A([38, -8])], { fill: '#3e3e44', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); f.flat(ell(A([46.5, -10.4]), 1.2 * k, 1 * k, 0, 6), '#000'); // the nasal tube and its nostril
  const near = wing(A([0, -14]), wn[0], 84 * k, true);
  // soaked: drips off the belly and feet, salt in the plumage
  if (o.drips !== false) { V.drip(f, A([0, 20]), 0.7 * k); V.saltCrust(f, A([-6, -4]), 14 * k, 6 * k, 3); }
  return { bill: A([56, -4]), feet, rump: A([-20, 0]), near, far, body };
}

module.exports = Object.assign({}, V, { hairMass, lumpE, weld, strap, furTrim, boxFaces, looseFoot, tentacle, petrel });
