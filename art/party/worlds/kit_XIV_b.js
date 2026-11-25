// World XIV, The Blighted Garden, second batch: the first batch's kit (kit_XIV, required and re-exported unchanged) plus
// the helpers this batch needs. The first batch's files are never edited; everything new lives here.
// Reused from reviewed kits (required, not edited): the modelled human arm and leg (mArm, mLeg: kit_X_b), the modelled
// fist (knuckleFist, gripK: kit_III_b), the wing with slotted primaries and layered coverts (wing, feather, plumeMass,
// featherHem: kit_VI), lumpy (kit_III).
// New: cloth folds, a clipped yew hedge gone shaggy (foliage), a woven willow / wicker surface, coiled straw (skep and
// straw stuffing), brain fungus (a soft lobed mass with folds), a garden snail with a spiral shell, motley diamonds,
// generic animal modelling (a value plan for a quadruped barrel: lit top line, dark belly and girth, form hatching).
// Toxin ripens and rots (never slime or glow); void cuts clean round holes and opens eyes. Palette as kit_XIV.
'use strict';
const K = require('../kit');
const X = require('./kit_XIV');
const Xb = require('./kit_X_b');
const T3 = require('./kit_III');
const V = require('./kit_VI');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { P, split, side, R, spline, clipDraw, softTone } = X;

// textures: the first batch's set, plus feather barbs (for kit_VI's wing), yew needles, straw and wicker
function texturesB(f) {
  X.textures(f);
  const s = f.o.seed, r = E.rng(s * 7 + 11);
  f.defs.push(`<pattern id="barb${s}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="0.7" opacity="0.5"/></pattern>`);
  let y = '';
  for (let i = 0; i < 34; i++) { const x0 = r() * 44, y0 = r() * 44, a = r() * 6.3; for (let k = -2; k <= 2; k++) { const aa = a + k * 0.32, l = 4 + r() * 4; y += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} l${(Math.cos(aa) * l).toFixed(1)},${(Math.sin(aa) * l).toFixed(1)}" stroke="${INK}" stroke-width="0.7" opacity="${(0.3 + r() * 0.35).toFixed(2)}"/>`; } }
  f.defs.push(`<pattern id="yew${s}" patternUnits="userSpaceOnUse" width="44" height="44">${y}</pattern>`);
  let st = '';
  for (let i = 0; i < 26; i++) { const x0 = r() * 40, y0 = r() * 40, a = -1.3 + (r() - 0.5) * 0.7, l = 10 + r() * 16; st += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" stroke="${INK}" stroke-width="${(0.6 + r() * 0.6).toFixed(1)}" opacity="${(0.35 + r() * 0.3).toFixed(2)}"/>`; }
  f.defs.push(`<pattern id="straw${s}" patternUnits="userSpaceOnUse" width="40" height="40">${st}</pattern>`);
}

// a cloth fold: a dark tapered valley with a soft shadow beside it and a lit lip on the wall that faces the key light
function fold(f, pts, w, o = {}) {
  const C = spline(pts, 3);
  f.stroke(C.map(q => add(q, mul(f.L, -w * 0.9))), w * 2.8, o.sh || '#000', { op: o.shOp ?? 0.16 });
  f.stroke(C, w, o.dk || INK, { op: o.op ?? 0.62 });
  if (o.lit !== false && C.length > 3) f.line(C.slice(1, -1).map(q => add(q, mul(f.L, -w * 0.75))), Math.max(0.8, w * 0.38), o.lt || '#e8e0d0', { op: o.ltOp ?? 0.42 });
}
// a fan of folds hanging from tops (each [x,y]) for len px, wandering; col / lit as fold's dk / lt
function folds(f, tops, len, w, o = {}) {
  for (const t of tops) { const l = len * R(f, 0.6, 1.1), b = R(f, -8, 8); fold(f, [t, add(t, [b * 0.5, l * 0.35]), add(t, [b, l * 0.7]), add(t, [b * 0.8 + R(f, -4, 4), l])], w * R(f, 0.7, 1.2), o); }
}

// ---- brain fungus: a soft, folded mass (Sparassis, cauliflower fungus) rooted on a host: a dark mound packed with
// curled, wavy sheets like crumpled ribbon, each sheet lit along its rolled outer lip with a dark crease under it, the
// sheets toward the key light paler, those in shadow dark and hatched. Cast shadow on the host; mixed sheet sizes.
function brainFungus(f, c, rx, ry, o = {}) {
  const col = o.col || P.lilac, n = o.n ?? Math.round(rx * ry / 70), sz = o.sz ?? 1;
  X.hostShadow(f, ell(c, rx * 1.05, ry * 1.05, 0, 18), Math.max(rx, ry) * 0.18, 0.55);
  const mound = T3.lumpy(f, ell(c, rx, ry, o.a || 0, 24), Math.min(rx, ry) * 0.16);
  const md = f.part(mound, X.FL(f, mix(col, P.loamD, 0.55), { maxShade: ry * 0.5 }));
  const lit = q => Math.max(0, Math.min(1, 0.5 + ((q[0] - c[0]) * f.L[0] + (q[1] - c[1]) * f.L[1]) / (Math.max(rx, ry) * 1.1)));
  const L = [];
  for (let i = 0; i < n; i++) { const t = f.r() * Math.PI * 2, k = Math.sqrt(f.r()) * 0.92, p = add(c, [Math.cos(t) * rx * k, Math.sin(t) * ry * k]); L.push([p, t + R(f, -0.9, 0.9), R(f, 12, 30) * sz * (1.1 - k * 0.4), R(f, 5, 9) * sz]); }
  L.sort((a, b) => lit(a[0]) - lit(b[0])).forEach(([p, a, l, w]) => {
    const d = rot([1, 0], a + Math.PI / 2), nn = rot([1, 0], a), bend = R(f, -0.35, 0.35) * l;
    const C = spline([add(add(p, mul(d, -l / 2)), mul(nn, bend)), p, add(add(p, mul(d, l / 2)), mul(nn, bend))], 2.5), m = C.length;
    const outer = C.map((q, i) => { const t = i / (m - 1); return add(q, mul(nn, w * Math.sin(Math.PI * (0.05 + 0.9 * t)) * (1 + 0.35 * Math.sin(t * 13 + a * 3)))); });
    const inner = C.map((q, i) => { const t = i / (m - 1); return add(q, mul(nn, -w * 0.35 * Math.sin(Math.PI * (0.05 + 0.9 * t)))); });
    const k = lit(add(p, mul(nn, w))), sheet = [...outer, ...inner.reverse()];
    f.part(sheet, X.FL(f, mix(mix(col, P.loamD, 0.42), mix(col, '#fff', 0.14), k), { inkW: 0.9, inkHeavy: 1.3, maxShade: w * 0.5, texOp: 0.35, hatch: k < 0.45 }));
    f.stroke(inner.map(q => add(q, mul(nn, -1.5))), Math.max(1.2, w * 0.4), mix(col, P.loamD, 0.85), { op: 0.75 }); // the crease under the sheet
    f.line(outer.slice(1, -1).map(q => add(q, mul(nn, -w * 0.12))), Math.max(0.7, w * 0.12), mix(col, '#fff', 0.5), { op: 0.35 + 0.4 * k }); // the rolled lip catching light
  });
  if (o.fur !== false) X.fungalFur(f, mound.slice(0, 14), Math.max(4, rx * 0.1), 1, { gaps: 0.5 });
  return md;
}

// ---- a clipped yew hedge gone shaggy and rotting. outline: the mass; o.lit(p) -> 0..1 the form's light at p (default:
// lit toward the key light side of the bbox). Base fill with a needle texture, soft form tones, then a dense field of
// needle tufts: each a lumpy clump toned by the form's light, a dark pocket under it, needle sprays on its lit rim.
// o.dead: polygons gone dead and black (drawn over, needles bare and grey). o.edge: sprigs breaking the outline.
function foliage(f, outline, o = {}) {
  const col = o.col || '#2a3028', dk = o.dark || '#0c0e0b', lt = o.light || '#5a6250', bb = E.bbox(outline), sd = f.o.seed;
  const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, span = Math.max(bb[2] - bb[0], bb[3] - bb[1]);
  const litF = o.lit || (p => Math.max(0, Math.min(1, 0.5 + ((p[0] - cx) * f.L[0] + (p[1] - cy) * f.L[1]) / (span * 0.5))));
  const d = f.part(outline, { fill: col, shadow: dk, light: lt, shade: 0.4, maxShade: o.maxShade ?? 30, tex: 'yew' + sd, texOp: 0.8, inkW: 1.4, inkHeavy: 3, k: 0.9, castOp: 0.35 });
  clipDraw(f, d, () => {
    if (o.tones) softTone(f, d, o.tones);
    const step = o.step ?? 26, list = [];
    for (let y = bb[1]; y < bb[3]; y += step * 0.7) for (let x = bb[0]; x < bb[2]; x += step * 0.85) list.push([x + R(f, -step * 0.7, step * 0.7), y + R(f, -step * 0.6, step * 0.6)]);
    list.sort((a, b) => a[1] - b[1]).forEach(p => {
      const k = Math.max(0, Math.min(1, litF(p) + R(f, -0.18, 0.18))), r = step * Math.pow(R(f, 0.3, 1), 0.7) * 0.85;
      if (o.skip && o.skip(p)) return;
      const tone = mix(mix(dk, col, 0.6), lt, Math.pow(k, 1.5) * 0.8), cl = T3.lumpy(f, ell(p, r, r * R(f, 0.5, 0.85), R(f, -0.9, 0.9), 9), r * 0.4);
      f.flat(cl.map(q => add(q, mul(f.L, -r * 0.35))), dk, { op: 0.55 * (1 - k * 0.5) }); // the dark pocket below the clump
      f.flat(cl, tone, { op: 0.92 });
      for (let i = 0; i < 4; i++) { const a = Math.atan2(-f.L[1], -f.L[0]) + Math.PI + R(f, -1.2, 1.2), q = add(p, rot([r * 0.6, 0], a)); f.line([q, add(q, rot([r * R(f, 0.4, 0.8), 0], a + R(f, -0.3, 0.3)))], 0.8, k > 0.5 ? mix(lt, '#e8ecd8', 0.25) : mix(col, lt, 0.4), { op: 0.7 }); }
      if (k < 0.45) f.line([add(p, [-r * 0.5, r * 0.2]), add(p, [r * 0.4, r * 0.4])], 0.9, INK, { op: 0.45 }); // hatch in the shadow
    });
    for (const poly of (o.dead || [])) deadPatch(f, poly, o);
  });
  if (o.edge !== false) for (let i = 0; i < (o.sprigs ?? Math.round(outline.length * 1.5)); i++) {
    const k = Math.floor(f.r() * outline.length), p = outline[k], q0 = outline[(k + 1) % outline.length], dd = E.norm(sub(q0, p)), nn = [dd[1], -dd[0]], l = R(f, 8, 20) * (o.sprigK ?? 1);
    const tip = add(p, add(mul(nn, l), mul(dd, R(f, -4, 4))));
    f.line([p, lerp(p, tip, 0.5), tip], 1.4, mix(col, lt, 0.3), { op: 0.9 });
    for (let j = 0; j < 3; j++) { const m = lerp(p, tip, 0.4 + j * 0.2); f.line([m, add(m, rot(mul(nn, 5), (j % 2 ? 1 : -1) * 0.9))], 0.8, mix(col, lt, 0.5), { op: 0.8 }); }
  }
  return d;
}
// a dead, blackened patch of the hedge: near-black, bare grey twigs crossing it, grey-lilac mould on it
function deadPatch(f, poly, o = {}) {
  const bb = E.bbox(poly);
  f.part(T3.lumpy(f, poly, 8), { fill: '#141412', shadow: '#050505', light: '#3a3834', shade: 0.35, maxShade: 12, tex: 'yew' + f.o.seed, texOp: 0.5, inkW: 0, inkHeavy: 0, cast: false, k: 0.9 });
  clipDraw(f, poly, () => {
    for (let i = 0; i < Math.round((bb[2] - bb[0]) * (bb[3] - bb[1]) / 900); i++) { const p = [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])], a = R(f, -2.6, -0.4), l = R(f, 14, 40), e = add(p, rot([l, 0], a)); f.line([p, lerp(p, e, 0.5), e], R(f, 1, 2.2), '#4a4844', { op: 0.8 }); f.line([lerp(p, e, 0.5), add(lerp(p, e, 0.5), rot([l * 0.35, 0], a + 0.7))], 0.9, '#4a4844', { op: 0.7 }); }
    if (o.deadMould !== false) for (let i = 0; i < 2 + Math.round((bb[2] - bb[0]) * (bb[3] - bb[1]) / 9000); i++) X.mould(f, [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])], R(f, 14, 40), R(f, 10, 30), { col: mix(P.lilac, P.grey, 0.4), op: 0.8 });
  });
}

// ---- woven willow: rods laid along `dir` with stakes across them; each rod a lit lozenge bulging over the stake and
// diving under the next (the over-under shows as alternating light and shadow). Drawn clipped to `region`.
function wicker(f, region, dir, rodW, o = {}) {
  const bb = E.bbox(region), d = rot([1, 0], dir), n = [-d[1], d[0]], col = o.col || P.yelD, cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, span = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2 + 10;
  const stake = o.stake ?? rodW * 2.6;
  clipDraw(f, region, () => {
    f.flat([[bb[0] - 4, bb[1] - 4], [bb[2] + 4, bb[1] - 4], [bb[2] + 4, bb[3] + 4], [bb[0] - 4, bb[3] + 4]], mix(col, P.loamD, 0.75));
    let row = 0;
    for (let v = -span; v < span; v += rodW, row++) for (let u = -span; u < span; u += stake) {
      const off = (row % 2) * stake * 0.5, p = add(add([cx, cy], mul(n, v)), mul(d, u + off)), q = add(p, mul(d, stake * 0.98));
      const m = lerp(p, q, 0.5), lz = [p, add(m, mul(n, -rodW * 0.48)), q, add(m, mul(n, rodW * 0.48))];
      const k = o.lit ? o.lit(m) : 0.6, tone = mix(mix(col, P.loamD, 0.45), mix(col, '#fff', 0.18), k);
      f.flat(lz, tone);
      f.line([lerp(p, q, 0.15), add(m, mul(n, -rodW * 0.3)), lerp(p, q, 0.85)], Math.max(0.7, rodW * 0.12), mix(col, '#fff', 0.35), { op: 0.55 * k + 0.1 });
      f.line([lerp(p, q, 0.1), add(m, mul(n, rodW * 0.38)), lerp(p, q, 0.9)], Math.max(0.7, rodW * 0.14), INK, { op: 0.55 });
    }
  });
}
// ---- coiled straw (a bee skep, a straw rope): bands of straw `bandH` thick stacked up a dome outline, each band a
// fat bundle with straw strokes along it, a dark seam under it, bound across by split-bramble stitches
function coiledStraw(f, outline, rows, o = {}) {
  const col = o.col || P.yel, bb = E.bbox(outline);
  clipDraw(f, outline, () => {
    for (const [a, b, h] of rows) {
      const m = lerp(a, b, 0.5), mid = add(m, [0, -h * (o.bow ?? 0.25)]), band = [add(a, [0, -h / 2]), add(mid, [0, -h / 2]), add(b, [0, -h / 2]), add(b, [0, h / 2]), add(mid, [0, h / 2]), add(a, [0, h / 2])];
      const k = o.lit ? o.lit(m) : 0.6;
      f.part(band, { fill: mix(mix(col, P.loamD, 0.4), mix(col, '#fff', 0.15), k), shadow: mix(col, P.loamD, 0.7), shade: 0.4, maxShade: h * 0.35, tex: 'straw' + f.o.seed, texOp: 0.7, inkW: 0.9, inkHeavy: 1.4, cast: false, k: 0.9 });
      const C = spline([a, mid, b], 4);
      f.stroke(C.map(q => add(q, [0, h * 0.46])), h * 0.22, mix(col, P.loamD, 0.85), { op: 0.8 });
      for (let i = 1; i < C.length - 1; i += 2) f.line([add(C[i], [R(f, -6, 0), -h * 0.3]), add(C[i + 1] || C[i], [R(f, 0, 6), -h * 0.25])], 0.8, mix(col, '#fff', 0.4), { op: 0.6 });
      for (let i = 2; i < C.length - 1; i += Math.max(3, Math.round(C.length / (o.stitches ?? 7)))) { f.line([add(C[i], [-2, -h * 0.42]), add(C[i], [2, h * 0.42])], Math.max(1.2, h * 0.12), o.bind || P.loamL, { op: 0.9 }); f.line([add(C[i], [-1, -h * 0.4]), add(C[i], [3, h * 0.4])], 0.7, INK, { op: 0.5 }); }
    }
  });
}

// ---- a garden snail, as an individual. c: the shell's centre; s: shell radius; dir +1 crawls right. The foot is a soft
// grey slug body (sole edge rippled, skirt, pustules) running from the tail behind the shell to the head; the head carries
// its eye stalks (o.stalks: extra stalks on some snails), real eyes at the tips. The shell is a logarithmic spiral seen
// from the side: the body whorl round to the aperture lip, the inner whorls stepping in, a suture groove, growth lines
// across each whorl, lit from the key light and dark underneath, blotched pink or lilac with mould and swelling with galls.
// o.hole: a clean round void hole through the shell (nothing inside). o.broken: the shell's crown cracked away.
function snail(f, c, s, dir = 1, o = {}) {
  const sk = o.skin || '#8a8682', skS = mix(sk, '#14101a', 0.6), lean = o.lean ?? 0, tilt = o.tilt ?? 0;
  const F0 = frame(c, tilt, 1), M = pts => F0(pts.map(q => [q[0] * dir, q[1], q[2]].filter(v => v !== undefined)));
  const gy = s * 0.78, footL = s * (o.footL ?? 2.4);
  const SK = (x = {}) => Object.assign({ fill: sk, shadow: skS, light: mix(sk, '#fff', 0.3), shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: 1.2, inkHeavy: 2, maxShade: s * 0.18, cast: false }, x);
  // the foot: a soft slug body, the tail tapering behind, the body under the shell, the neck rising into the head in front
  const hx = s * (1.3 + ((o.footL ?? 2.4) - 2.4) * 0.3), hy = -s * 0.02 - (o.rear ?? 0) * s;
  const foot = M([[-s * 1.55, gy * 0.96, 1], [-s * 1.15, gy * 0.7], [-s * 0.5, gy * 0.56], [s * 0.3, gy * 0.56], [hx - s * 0.5, hy + s * 0.42], [hx - s * 0.2, hy + s * 0.04], [hx + s * 0.12, hy - s * 0.06], [hx + s * 0.36, hy + s * 0.1], [hx + s * 0.4, hy + s * 0.4], [hx + s * 0.22, gy * 0.97], [s * 0.4, gy * 1.03], [-s * 0.7, gy * 1.03]]);
  f.flat(ell(add(c, [dir * s * 0.1, gy * 1.08]), s * 1.7, s * 0.14, tilt, 14), P.loamD, { op: 0.45 }); // the contact shadow
  if (o.trail !== false) f.stroke(M([[-s * 3.2, gy * 1.04], [-s * 2.2, gy * 1.03], [-s * 1.3, gy * 1.0]]), s * 0.2, mix(P.grey, P.yelL, 0.3), { op: 0.35 }); // the trail drying to a dull crust
  const fd = f.part(foot, SK());
  clipDraw(f, fd, () => {
    softTone(f, fd, [[M([[-s * 1.6, gy * 0.85], [hx + s * 0.5, gy * 0.85], [hx + s * 0.5, gy * 1.2], [-s * 1.6, gy * 1.2]]), skS, 0.55, s * 0.12], [M([[hx - s * 0.4, hy - s * 0.1], [hx + s * 0.4, hy - s * 0.1], [hx + s * 0.3, hy + s * 0.3], [hx - s * 0.3, hy + s * 0.4]]), mix(sk, '#fff', 0.35), 0.4, s * 0.1]]);
    f.stroke(M([[-s * 1.3, gy * 0.92], [0, gy * 0.96], [hx + s * 0.1, gy * 0.9]]), s * 0.14, mix(sk, '#fff', 0.25), { op: 0.35 }); // the skirt's paler rim
    for (let i = 0; i < 9; i++) { const x = -s * 1.2 + i * (hx + s * 1.3) / 9; f.line(M([[x, gy * 0.94], [x + s * 0.1, gy * 1.02]]), 1, INK, { op: 0.45 }); } // the sole's ripples
    for (let i = 0; i < 16; i++) { const q = M([[R(f, -s * 1.2, hx + s * 0.2), R(f, gy * 0.6, gy * 0.92)]])[0]; f.flat(ell(q, s * 0.07, s * 0.045, R(f, 0, 3), 6), skS, { op: 0.55 }); } // the tubercles
    f.line(M([[s * 0.3, gy * 0.6], [hx - s * 0.45, hy + s * 0.42], [hx - s * 0.12, hy + s * 0.02]]), Math.max(1, s * 0.05), mix(sk, '#fff', 0.4), { op: 0.5 }); // the lit neck
    f.line(M([[hx - s * 0.1, hy + s * 0.3], [hx + s * 0.2, hy + s * 0.34]]), 1, INK, { op: 0.5 }); // the mouth
  });
  if (o.pust !== false) X.pustules(f, M([[R(f, -s * 0.6, s * 0.6), gy * 0.72]])[0], s * 0.4, s * 0.12, o.npust ?? 3, s * 0.07, s * 0.12, { col: mix(P.pink, sk, 0.4) });
  // the eye stalks: two long upper stalks (or a crowd), each with a real eye; two short lower tentacles
  const head = M([[hx + s * 0.08, hy + s * 0.04]])[0];
  for (const [la, ll] of [[0.5, 0.32], [0.85, 0.28]]) { const a = (dir > 0 ? 0 : Math.PI) + dir * la + tilt, tip = add(head, rot([s * ll, 0], a)); f.part(X.tube([head, tip], [s * 0.11, s * 0.07]), SK({ inkW: 1, inkHeavy: 1.2 })); }
  const stalks = o.stalks || [[-1.25, 1.0], [-0.85, 1.1]];
  stalks.forEach(([sa, sl], i) => {
    const a = (dir > 0 ? sa : Math.PI - sa) + tilt + (o.sway ?? 0) * (i % 2 ? 1 : -1), mid = add(head, rot([s * sl * 0.5, dir * s * 0.08], a)), tip = add(head, rot([s * sl, 0], a + dir * 0.12));
    const stC = spline([add(head, [0, s * 0.05]), mid, tip], 3); f.line(stC, Math.max(3, s * 0.2) + 2.2, INK); f.line(stC, Math.max(3, s * 0.2), mix(sk, skS, 0.2)); f.line(stC.slice(0, -1).map(q => add(q, mul(f.L, 1))), 1, mix(sk, '#fff', 0.4), { op: 0.6 });
    X.eye(f, add(tip, rot([s * 0.06, 0], a)), s * (o.eyeS ?? 0.42), a + Math.PI / 2, { open: (o.opens || [0.7, 0.4, 0.9, 0.2, 0.6])[i % 5], lid: mix(sk, P.pink, 0.2), lidS: skS, look: [0.06 * dir, 0.02] });
  });
  // the shell
  shell(f, add(c, [-dir * s * 0.12, -s * 0.3 - (o.lift ?? 0)]), s, dir, o);
}
function shell(f, c, s, dir, o = {}) {
  const col = o.col || P.pink, sq = o.sq ?? 0.9, k = 0.125, turns = o.turns ?? 3.2;
  const ltc = mix(col, '#fff', 0.3), dkc = mix(col, P.loamD, 0.8);
  // the outline: the body whorl seen from the side, a slightly lumpy, slightly flattened disc
  const outer = []; for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2; outer.push(add(c, [Math.cos(t) * s * (1 + 0.04 * Math.sin(t * 5 + s)), Math.sin(t) * s * sq * (1 + 0.03 * Math.cos(t * 3))])); }
  // the spiral suture, from the aperture (front, low) winding inward to the apex near the centre
  const ctr = add(c, [-dir * s * 0.1, -s * 0.08]), th0 = dir > 0 ? 0.55 + (o.spin ?? 0) : Math.PI - 0.55 - (o.spin ?? 0);
  const sp = t => { const r = s * 0.96 * Math.exp(-k * t), th = th0 - dir * t; return add(ctr, [Math.cos(th) * r, Math.sin(th) * r * sq]); };
  X.hostShadow(f, outer, s * 0.12, 0.45);
  const draw = () => {
    const d = f.part(outer, Object.assign(X.FL(f, col, { maxShade: s * 0.34, shade: 0.44, texOp: 0.2 }), { inkW: 1.3, inkHeavy: 2.6, tex: 'mottle' + f.o.seed, texOp: 0.5 }));
    clipDraw(f, d, () => {
      // form: the lit crown toward the key light, the underside turning away dark
      softTone(f, d, [[ell(add(c, mul(f.L, s * 0.42)), s * 0.55, s * 0.42, 0, 12), ltc, 0.55, s * 0.2], [ell(add(c, mul(f.L, -s * 0.85)), s * 1.0, s * 0.55, 0, 12), P.loamD, 0.65, s * 0.22]]);
      // each whorl's swell: a lit band just outside the suture, a darker band of colour along the whorl's middle
      const N = Math.round(turns * 40), SP = Array.from({ length: N + 1 }, (_, i) => sp(i / 40 * Math.PI * 2));
      const mid = Array.from({ length: N + 1 }, (_, i) => { const t = i / 40 * Math.PI * 2, a = sp(t), b = sp(t + Math.PI * 2); return lerp(a, b, 0.45); });
      f.line(mid.slice(0, 40), Math.max(1.2, s * 0.12), mix(col, P.loamD, 0.35), { op: 0.45 }); // the band round the body whorl
      for (let i = 0; i < 34; i++) { const t = i / 34 * Math.PI * 2 * 1.1, a = sp(t), b = sp(t + Math.PI * 2), m = lerp(a, b, 0.5); f.line([lerp(a, b, 0.08), add(m, mul(E.norm(sub(a, b)), 0)), lerp(a, b, 0.9)], 0.8, mix(col, P.loamD, 0.55), { op: 0.4 }); } // growth lines across the whorls
      f.stroke(SP, Math.max(1.6, s * 0.09), dkc, { op: 0.9 }); // the suture groove
      f.line(SP.slice(2, N - 10).map((q, i) => add(q, mul(E.norm(sub(q, ctr)), Math.max(0.8, s * 0.05) * Math.exp(-k * i / 40 * 6.28)))), Math.max(0.8, s * 0.045), ltc, { op: 0.55 }); // its lit lip
      f.flat(ell(ctr, s * 0.07, s * 0.06, 0, 8), dkc, { op: 0.8 }); // the apex
      for (let i = 0; i < (o.blotch ?? 3); i++) X.mould(f, add(c, [R(f, -0.6, 0.6) * s, R(f, -0.6, 0.5) * s]), s * R(f, 0.14, 0.24), s * R(f, 0.1, 0.18), { col: o.blotchCol || (f.r() > 0.5 ? P.lilac : mix(P.pink, P.grey, 0.3)), op: 0.75, rings: 1 });
      if (o.dark) f.flat(ell(c, s * 1.1, s, 0, 12), P.loamD, { op: 0.35 });
    });
    // the aperture lip at the front-bottom: thickened and pale, curling out over the foot
    const ap = [0.0, 0.3, 0.65, 1.0].map(u => { const th = th0 + dir * (u - 0.35) * 1.2; return add(c, [Math.cos(th) * s * 1.0, Math.sin(th) * s * sq * 1.0]); });
    f.stroke(ap, s * 0.16, mix(col, '#fff', 0.45));
    f.line(ap.map(q => add(q, [0, s * 0.05])), 1, INK, { op: 0.6 });
    if (o.galls) for (const [t, rr] of o.galls) X.pustules(f, sp(t), s * rr, s * rr * 0.7, 2, s * rr * 0.5, s * rr * 0.8, { col: mix(P.pink, '#fff', 0.1) });
    if (o.broken) { const bc = ctr; f.flat(T3.lumpy(f, ell(add(bc, [dir * s * 0.05, -s * 0.05]), s * 0.4, s * 0.32, 0.2, 10), s * 0.12), mix(col, P.loamD, 0.88)); for (let i = 0; i < 5; i++) { const a = i * 1.25, q = add(bc, rot([s * 0.36, 0], a)); f.line([q, add(q, rot([s * R(f, 0.15, 0.35), 0], a + R(f, -0.3, 0.3)))], 1.1, INK, { op: 0.8 }); } f.line(ell(bc, s * 0.42, s * 0.34, 0.2, 10).slice(5, 10), 1.3, ltc, { op: 0.65 }); f.flat(ell(add(bc, [s * 0.05, s * 0.05]), s * 0.12, s * 0.1, 0, 8), mix(P.grey, '#000', 0.4)); }
  };
  if (o.hole) X.cutHoles(f, [[sp(o.hole[0]), s * o.hole[2]]], draw, { shape: outer }); else draw();
}

// ---- motley: diamonds in two colours laid on a garment along `dir`, the mould soaked into whole diamonds
function motley(f, region, c0, dir, sz, cols, o = {}) {
  const bb = E.bbox(region), d = rot([1, 0], dir), n = [-d[1], d[0]], span = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]);
  clipDraw(f, region, () => {
    for (let i = -Math.ceil(span / sz); i <= Math.ceil(span / sz); i++) for (let j = -Math.ceil(span / sz); j <= Math.ceil(span / sz); j++) {
      const p = add(add(c0, mul(d, i * sz)), mul(n, j * sz * 1.4)), q = (((i + j) % 2) + 2) % 2;
      if (p[0] < bb[0] - sz || p[0] > bb[2] + sz || p[1] < bb[1] - sz * 1.4 || p[1] > bb[3] + sz * 1.4) continue;
      const dm = [add(p, mul(d, sz)), add(p, mul(n, sz * 1.4)), add(p, mul(d, -sz)), add(p, mul(n, -sz * 1.4))];
      const mouldy = o.mould && o.mould(p, i, j);
      f.flat(dm, mouldy ? mix(cols[q], P.lilacD, 0.25) : cols[q], { op: o.op ?? 0.88 });
      f.line(dm.concat([dm[0]]), 0.9, INK, { op: 0.35 });
      if (mouldy) { X.mould(f, p, sz * 0.8, sz * 1.0, { col: mix(P.lilac, P.grey, 0.3), op: 0.85, rings: 1 }); }
    }
  });
}

// ---- a quadruped barrel's value plan (the Mother's, made generic): lit top line along `top` (a path along the back),
// dark belly core along `belly`, the girth hollow behind the shoulder (`girth`: polygon), form hatching round the belly.
function barrelTones(f, d, o) {
  const tones = [];
  if (o.top) tones.push([[...o.top.map(q => add(q, [0, -o.w * 0.2])), ...o.top.slice().reverse().map(q => add(q, [0, o.w * 0.9]))], o.lit, o.litOp ?? 0.7, o.blur ?? 18]);
  if (o.belly) tones.push([[...o.belly.map(q => add(q, [0, 20])), ...o.belly.slice().reverse().map(q => add(q, [0, -o.w * 1.4]))], o.dark, o.darkOp ?? 0.85, o.blur ?? 22]);
  for (const g of (o.hollows || [])) tones.push([g, o.dark, o.hollowOp ?? 0.6, o.blur ?? 20]);
  for (const g of (o.rounds || [])) tones.push([g, o.lit, 0.4, (o.blur ?? 20) * 1.2]);
  softTone(f, d, tones);
  if (o.belly) { const C = spline(o.belly, 3), Sx = X.arcLen(C), Lt = Sx[Sx.length - 1], n = Math.round(Lt / (o.hatchStep ?? 7)); clipDraw(f, d, () => { for (let k = 0; k < n; k++) { const u = (k + 0.5) / n * Lt; let i = Sx.findIndex(v => v >= u); i = Math.max(1, Math.min(C.length - 2, i)); const t = E.norm(sub(C[i + 1], C[i - 1])), nn = [t[1], -t[0]], l = o.w * R(f, 0.5, 1.0), p0 = add(C[i], mul(nn, 2)); f.line([p0, add(add(p0, mul(nn, l * 0.5)), mul(t, l * 0.18)), add(add(p0, mul(nn, l)), mul(t, l * 0.12))], 1.2, INK, { op: 0.45 }); } }); }
}

// (independent review) coarse bristles: tapered hair strokes laid in tracts along o.dir(p), toned by the form's light
// o.lit(p) 0..1 (dark strokes everywhere, pale tips only where the form is lit), so the hatching carries the value plan
// instead of an even texture. o.w stroke width; o.dark / o.mid / o.lite colours.
function bristles(f, outline, n, len, o = {}) {
  const bb = E.bbox(outline), dirF = o.dir || (() => [0, 1]), litF = o.lit || (() => 0.5);
  clipDraw(f, outline, () => {
    for (let i = 0; i < n; i++) {
      const p = [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])], d = E.norm(dirF(p)), nn = [-d[1], d[0]], k = Math.max(0, Math.min(1, litF(p))), l = len * R(f, 0.55, 1.3), bw = R(f, -0.1, 0.1) * l;
      const pts = [p, add(add(p, mul(d, l * 0.5)), mul(nn, bw)), add(add(p, mul(d, l)), mul(nn, bw * 1.8))];
      f.stroke(pts, (o.w || 3) * R(f, 0.7, 1.35), mix(o.dark, o.mid, k * 0.45), { op: 0.5 + 0.35 * (1 - k) });
      if (f.r() < k * 0.9) f.line(pts.slice(1).map(q => add(q, mul(f.L, (o.w || 3) * 0.6))), Math.max(0.7, (o.w || 3) * 0.3), o.lite, { op: 0.2 + 0.55 * k });
    }
  });
}
// a boar's mane: long bristles standing off a ridge line (root to tip along `up`, swept back), clumped, dark at the root,
// a few pale tips where the light catches them
function maneRidge(f, pts, n, len, o = {}) {
  const C = spline(pts, 3), S = X.arcLen(C), Lt = S[S.length - 1];
  for (let i = 0; i < n; i++) {
    const u = R(f, 0, Lt); let j = S.findIndex(v => v >= u); j = Math.max(1, Math.min(C.length - 2, j));
    const t = E.norm(sub(C[j + 1], C[j - 1])), up = [t[1], -t[0]], sweep = o.sweep ?? -0.5, d = E.norm(add(up, mul(t, sweep + R(f, -0.25, 0.25)))), l = len * R(f, 0.5, 1.2) * (o.lenF ? o.lenF(u / Lt) : 1);
    const p = add(C[j], mul(up, -R(f, 4, 18))), nn = [-d[1], d[0]], bw = R(f, -0.15, 0.15) * l;
    const tip = add(add(p, mul(d, l)), mul(nn, bw));
    f.stroke([p, add(add(p, mul(d, l * 0.5)), mul(nn, bw * 0.4)), tip], (o.w || 4) * R(f, 0.7, 1.4), f.r() < 0.7 ? o.dark : o.mid, { op: 0.9 });
    if (f.r() < 0.4) f.line([add(p, mul(d, l * 0.45)), tip].map(q => add(q, mul(f.L, 1.2))), 0.9, o.lite, { op: 0.5 });
  }
}

// (ruler pass) a ruler's face modelled at full size, to the Drowned King's bar. One outline carries the profile (brow,
// the socket's notch, the nose, the lips, the chin). The value plan runs warm to cool: lit planes near bone-white and warm,
// a warm reddish band at the terminator, the planes turning away cool lilac-grey, the deepest recesses (sockets, under
// the nose, under the lower lip, the jaw's underplane) a warm near-black. Planes laid with soft tones of real strength:
// forehead, brow ridge, sockets, cheekbone and the hollow under it, the bridge and side of the nose, the philtrum, the
// lips (upper in shadow, lower full and lit), the chin's ball, the jaw. Contour hatching on the shadow side. Lids with
// thickness (a lit convex lid over the ball, its crease, a heavy lashed margin, lashes, a lit lower rim); lips with
// volume (cupid's bow, the lower lip's wet light, the corner pinched in a dreamy smile). F: frame(HC, hA, H).
function ladyFace(f, HC, H, hA, o = {}) {
  const F = frame(HC, hA, H), skin = o.skin, warm = o.warm || mix(skin, '#8a4a3c', 0.5), cool = mix(skin, '#3a2c3c', 0.58), deep = mix(warm, '#24120e', 0.62), lt = mix(skin, '#fffaf2', 0.5), b = H * 0.03;
  const face = F([[-0.3, -0.42], [-0.06, -0.52], [0.16, -0.47], [0.28, -0.33], [0.335, -0.17], [0.318, -0.085], [0.345, -0.03], [0.375, 0.05], [0.402, 0.112], [0.392, 0.142], [0.362, 0.158], [0.338, 0.178], [0.348, 0.214], [0.336, 0.24], [0.328, 0.258], [0.338, 0.29], [0.322, 0.318], [0.31, 0.338], [0.322, 0.38], [0.31, 0.43], [0.26, 0.47], [0.14, 0.5], [0.0, 0.44], [-0.15, 0.3], [-0.24, 0.12], [-0.3, -0.12]]);
  const d = f.part(face, { fill: mix(skin, warm, 0.24), shadow: mix(cool, deep, 0.2), light: lt, shade: 0.42, maxShade: H * 0.32 * (o.faceShade ?? 0.8), tex: 'mottle' + f.o.seed, texOp: 0.55, hatch: false, inkW: 1.3, inkHeavy: 2.8, cast: false, k: 0.9 });
  softTone(f, d, [
    [F([[-0.4, -0.34], [-0.05, -0.34], [0.0, 0.1], [0.02, 0.56], [-0.34, 0.46]]), cool, 0.88, b * 0.7], // the far side turning away, cool
    [F([[-0.04, -0.3], [0.05, -0.3], [0.09, 0.1], [0.09, 0.44], [-0.01, 0.44], [-0.03, 0.1]]), mix(warm, '#a04a3a', 0.35), 0.5, b * 0.7], // the warm terminator
    [F(ell([-0.1, -0.2], 0.09, 0.11, 0, 10)), mix(cool, deep, 0.3), 0.5, b], // the temple's hollow
    [F([[0.02, -0.46], [0.24, -0.42], [0.3, -0.28], [0.3, -0.2], [0.02, -0.22]]), lt, 0.85, b * 0.9], // the forehead's lit plane
    [F([[0.02, -0.19], [0.3, -0.18], [0.32, -0.14], [0.03, -0.13]]), lt, 0.8, b * 0.35], // the brow ridge catching the light
    [F(ell([0.15, -0.075], 0.12, 0.058, 0.05, 12)), deep, 0.72, b * 0.5], [F(ell([0.3, -0.085], 0.045, 0.055, 0, 10)), deep, 0.7, b * 0.4], // the sockets, deep under it
    [F(ell([0.15, 0.035], 0.12, 0.05, 0.22, 10)), lt, 0.85, b * 0.6], // the cheekbone lit
    [F(ell([0.09, 0.2], 0.11, 0.06, 0.35, 10)), cool, 0.7, b * 0.9], // the hollow under it, cool
    [F(ell([0.2, 0.15], 0.08, 0.06, 0.2, 10)), mix(skin, '#b0665e', 0.6), 0.4, b * 1.2], // the cheek's warm flush (rose under the pallor)
    [F([[0.31, -0.06], [0.37, 0.02], [0.398, 0.1], [0.372, 0.1], [0.34, 0.0]]), lt, 0.9, b * 0.25], // the bridge and tip of the nose lit
    [F([[0.26, -0.04], [0.31, -0.01], [0.315, 0.13], [0.26, 0.16]]), cool, 0.8, b * 0.35], // the side of the nose
    [F(ell([0.33, 0.168], 0.055, 0.022, 0, 8)), deep, 0.9, b * 0.22], // the nose's cast shadow on the lip
    [F([[0.27, 0.18], [0.33, 0.18], [0.34, 0.24], [0.27, 0.24]]), lt, 0.3, b * 0.3], // the philtrum's lit plane
    [F(ell([0.3, 0.312], 0.05, 0.02, 0, 8)), deep, 0.7, b * 0.22], // under the lower lip
    [F(ell([0.275, 0.385], 0.055, 0.045, 0, 8)), lt, 0.55, b * 0.4], // the chin's ball
    [F([[-0.12, 0.36], [0.12, 0.42], [0.3, 0.42], [0.28, 0.54], [-0.12, 0.54]]), deep, 0.85, b * 0.6], // the jaw's underplane
    [F([[0.02, 0.4], [0.14, 0.44], [0.26, 0.45], [0.26, 0.47], [0.02, 0.43]]), mix(warm, '#d08a70', 0.4), 0.3, b * 0.25], // warm light bounced up under the jaw
  ]);
  clipDraw(f, d, () => {
    X.crease(f, F([[0.29, 0.135], [0.27, 0.2], [0.255, 0.255]]), H * 0.009, { col: warm, lit: lt, op: 0.55, litOp: 0.4 }); // the nasolabial fold, soft
    for (let i = 0; i < 16; i++) { const t = i / 15, q0 = F([[-0.32 + t * 0.07, -0.3 + t * 0.72]])[0], q1 = F([[-0.1 + t * 0.06, -0.26 + t * 0.72]])[0], m = lerp(q0, q1, 0.5); f.line([q0, add(m, rot([0, -4], hA)), q1], 1.3, deep, { op: 0.42 }); } // contour hatching round the far side
    for (let i = 0; i < 9; i++) { const q0 = F([[-0.06 + i * 0.04, 0.44]])[0], q1 = F([[-0.03 + i * 0.04, 0.51]])[0]; f.line([q0, q1], 1, deep, { op: 0.3 }); } // hatching under the jaw
    f.line(F([[0.3, 0.18], [0.305, 0.235]]), 1, warm, { op: 0.5 }); f.line(F([[0.325, 0.18], [0.33, 0.235]]), 1, lt, { op: 0.5 }); // the philtrum's ridges
    f.line(F([[0.24, 0.33], [0.28, 0.345], [0.31, 0.34]]), 1.2, warm, { op: 0.45 }); // the groove above the chin
  });
  // the lips: the upper in shadow with its bow, the lower full and lit with a wet light, the corner pinched and lifted
  const lipC = mix(mix(skin, P.pinkD, 0.55), '#8a4a4c', 0.3), lipS = mix(lipC, '#2a1418', 0.5);
  f.part(F([[0.232, 0.254], [0.27, 0.236], [0.298, 0.24], [0.31, 0.248], [0.322, 0.236], [0.346, 0.25], [0.33, 0.262], [0.28, 0.263], [0.25, 0.266]]), { fill: mix(lipC, lipS, 0.35), shadow: lipS, light: lipC, shade: 0.4, maxShade: 4, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.3 });
  f.line(F([[0.27, 0.236], [0.298, 0.239], [0.31, 0.246], [0.322, 0.235], [0.346, 0.249]]), 1.2, lt, { op: 0.55 }); // the lip's edge catching the light
  f.part(F([[0.248, 0.266], [0.29, 0.266], [0.334, 0.263], [0.342, 0.276], [0.33, 0.296], [0.3, 0.306], [0.268, 0.298], [0.252, 0.282]]), { fill: lipC, shadow: lipS, light: mix(lipC, '#fff', 0.35), shade: 0.42, maxShade: 6, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.3 });
  f.flat(F(ell([0.3, 0.278], 0.022, 0.007, -0.05, 8)), mix(lipC, '#fff', 0.5), { op: 0.6 }); // the lower lip's wet light
  f.line(F([[0.275, 0.268], [0.285, 0.29]]), 0.9, lipS, { op: 0.4 }); f.line(F([[0.31, 0.268], [0.315, 0.292]]), 0.9, lipS, { op: 0.35 }); // the lip's fine creases
  f.line(F([[0.222, 0.248], [0.25, 0.265], [0.29, 0.265], [0.33, 0.263], [0.346, 0.252]]), H * 0.007, INK, { op: 0.9 }); // the mouth line
  f.line(F([[0.222, 0.248], [0.214, 0.236]]), H * 0.005, INK, { op: 0.6 }); f.flat(F(ell([0.226, 0.252], 0.008, 0.006, 0, 6)), deep, { op: 0.6 }); // the corner, pinched in a dreamy smile
  // the nose: the nostril wing with its own little shadow, the nostril
  f.line(F([[0.312, 0.118], [0.294, 0.14], [0.308, 0.16], [0.335, 0.162]]), H * 0.0065, INK, { op: 0.75 });
  f.flat(F(ell([0.335, 0.153], 0.018, 0.008, -0.2, 8)), deep, { op: 0.9 });
  f.line(F([[0.3, 0.12], [0.296, 0.14]]), 1.2, lt, { op: 0.5 });
  // the eyes: the lid a lit convex form over the ball, half closed; its crease above, the heavy lashed margin, the
  // lashes hanging, a sliver of eye under it, the lower lid a lit rim with the soft trough under it
  for (const [x0, x1, k] of [[0.065, 0.23, 1], [0.278, 0.332, 0.62]]) {
    const xm = (x0 + x1) / 2, w = x1 - x0;
    f.flat(F([[x0, -0.068], [xm, -0.06], [x1, -0.066], [x1 - 0.01 * k, -0.05], [xm, -0.044], [x0 + 0.012, -0.054]]), '#241a20'); // the slit under the lid
    f.flat(F(ell([xm + 0.012 * k, -0.053], 0.018 * k, 0.007, 0, 8)), o.iris || '#4a4250', { op: 0.9 });
    f.flat(F(ell([xm + 0.004, -0.056], 0.006 * k, 0.003, 0, 6)), '#e8e0e0', { op: 0.5 });
    const lid = F([[x0 - 0.014, -0.07], [x0 + 0.01, -0.098], [xm - 0.01, -0.114], [x1 - 0.012, -0.104], [x1 + 0.012, -0.072], [xm, -0.06]]);
    f.part(lid, { fill: mix(mix(skin, warm, 0.45), P.lilacD, 0.2), shadow: mix(cool, deep, 0.3), light: lt, shade: 0.45, maxShade: 6 * k, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.3 });
    f.flat(F(ell([xm - 0.006, -0.094], w * 0.2, 0.007, 0.03, 10)), lt, { op: 0.3 }); // the lid's convex top catching the light
    f.flat(F([[x0 - 0.01, -0.074], [xm, -0.064], [x1 + 0.01, -0.072], [x1, -0.08], [xm, -0.072], [x0, -0.08]]), mix(cool, deep, 0.4), { op: 0.55 }); // the lid's thickness turning under
    f.stroke(F([[x0 - 0.016, -0.07], [x0 + 0.02, -0.066], [xm, -0.061], [x1 - 0.01, -0.064], [x1 + 0.014, -0.07]]), H * 0.011 * (0.55 + k * 0.45), INK); // its lashed margin
    for (let i = 0; i < 9; i++) { const t = x0 + w * (i + 0.5) / 9, out = (t - x0) / w; f.line(F([[t, -0.063], [t + 0.004 + out * 0.008, -0.05], [t + 0.01 + out * 0.012, -0.044]]), (1.1 * k + 0.4) * (0.7 + 0.3 * Math.sin(Math.PI * out)), INK, { op: 0.85 }); } // lashes hanging
    f.line(F([[x0 - 0.004, -0.106], [x0 + 0.03, -0.124], [xm, -0.13], [x1 - 0.004, -0.118], [x1 + 0.012, -0.096]]), H * 0.005, deep, { op: 0.7 }); // the lid's crease
    f.line(F([[x0 + 0.02, -0.136], [xm, -0.142], [x1 - 0.01, -0.13]]), H * 0.003, lt, { op: 0.45 }); // the brow bone's lit edge over it
    f.line(F([[x0 + 0.014, -0.044], [xm, -0.039], [x1 - 0.008, -0.045]]), H * 0.0045, lt, { op: 0.55 }); // the lower lid's lit rim
    f.line(F([[x0 + 0.02, -0.03], [xm, -0.022], [x1 - 0.01, -0.03]]), H * 0.004, mix(cool, deep, 0.3), { op: 0.4 }); // the soft trough under it
    f.flat(F(ell([x0 + 0.004, -0.06], 0.008, 0.006, 0, 6)), mix(lipC, skin, 0.4), { op: 0.6 }); // the inner corner
  }
  f.stroke(F([[0.035, -0.152], [0.13, -0.176], [0.24, -0.152]]), H * 0.017, mix(o.hairCol || '#1a1618', skin, 0.22)); // the near brow, thin and arched
  for (let i = 0; i < 7; i++) { const t = 0.05 + i * 0.027; f.line(F([[t, -0.155 - Math.sin(t * 14) * 0.006], [t + 0.02, -0.168 - Math.sin(t * 14) * 0.006]]), 0.9, o.hairCol || '#1a1618', { op: 0.55 }); }
  f.stroke(F([[0.272, -0.15], [0.302, -0.166], [0.336, -0.156]]), H * 0.011, mix(o.hairCol || '#1a1618', skin, 0.3));
  return { F, face, d, cool, warm, deep, lt };
}

// (ruler pass) a velvet sleeve pushed up and bunched on an arm, mouth at M, gathered toward G (the shoulder): the outline
// swells and pinches in alternating bunches on its two sides (so the compression folds zigzag across as diamonds, never
// rings), each bunch lit on the side toward the key light with a dark crease under it, the side away from the light in
// shadow; the mouth's rim shows a crescent of the paler lining and a worn braid. w0 / w1: width at the mouth / gather.
// look: a part look (fill / shadow / light); o.lining, o.braid colours; o.nb bunches. Returns the outline.
function sleeveBunch(f, M, G, w0, w1, look, o = {}) {
  const d = E.norm(sub(G, M)), n = [-d[1], d[0]], len = E.len(sub(G, M)), nb = o.nb ?? 3, N = 28;
  const lsd = n[0] * f.L[0] + n[1] * f.L[1] > 0 ? 1 : -1; // the side of the sleeve toward the light
  const at = (t, k) => add(add(M, mul(d, t * len)), mul(n, k));
  const wAt = (t, sg) => (w0 + (w1 - w0) * t) / 2 * (1 + 0.16 * Math.sin(Math.PI * 2 * nb * t + (sg > 0 ? 0 : Math.PI) + 0.6) * Math.min(1, t * 6));
  const P1 = [], Q1 = [];
  for (let i = 0; i <= N; i++) { const t = i / N; P1.push(at(t, wAt(t, 1))); Q1.push(at(t, -wAt(t, -1))); }
  const capM = []; for (let i = 1; i < 10; i++) { const a = Math.PI * i / 10; capM.push(add(add(M, mul(n, -Math.cos(a) * w0 / 2)), mul(d, -Math.sin(a) * w0 * 0.2))); }
  const out = [...capM, ...P1.slice(1), ...Q1.slice(1).reverse()].map((q, i) => i % 3 ? q : add(q, [R(f, -2, 2), R(f, -2, 2)]));
  const sd = f.part(out, Object.assign({ maxShade: 22, cast: true, castOp: 0.4 }, look));
  const dk = o.dk || look.shadow, lt = o.lt || look.light;
  clipDraw(f, sd, () => {
    softTone(f, sd, [[[at(-0.2, -lsd * w0), at(1.1, -lsd * w1), at(1.1, -lsd * w1 * 0.12), at(-0.2, -lsd * w0 * 0.1)], dk, 0.6, 9], [[at(-0.2, lsd * w0 * 0.08), at(1.1, lsd * w1 * 0.06), at(1.1, lsd * w1 * 0.4), at(-0.2, lsd * w0 * 0.4)], lt, 0.4, 8]]);
    for (let i = 0; i < nb * 2; i++) { // the compression folds: zigzag diamonds, each a dark valley with a lit lip above
      const t0 = (i + 0.35) / (nb * 2), t1 = (i + 0.85) / (nb * 2), sg = i % 2 ? 1 : -1, w = (w0 + (w1 - w0) * t0) / 2;
      fold(f, [at(t0, sg * w * 1.05), at((t0 + t1) / 2, sg * w * 0.1), at(t1, -sg * w * 0.5)], 3.4 - i * 0.2, { dk: mix(dk, '#000', 0.3), lt });
      f.raw(`<ellipse cx="${at(t1, sg * w * 0.2)[0].toFixed(1)}" cy="${at(t1, sg * w * 0.2)[1].toFixed(1)}" rx="${(w * 0.5).toFixed(1)}" ry="${(len / nb * 0.16).toFixed(1)}" transform="rotate(${(Math.atan2(n[1], n[0]) * 57.3).toFixed(1)} ${at(t1, sg * w * 0.2)[0].toFixed(1)} ${at(t1, sg * w * 0.2)[1].toFixed(1)})" fill="${lt}" opacity="0.3" filter="url(#puff${f.o.seed})"/>`); // the bunch's lit swell
    }
    if (o.stains) o.stains(sd, E.bbox(out));
  });
  // the mouth: a crescent of the lining on its far side, the braid along its rim
  f.part([...capM.slice(1, -1), ...capM.slice(1, -1).reverse().map(q => add(lerp(q, M, 0.6), mul(d, w0 * 0.05)))], { fill: o.lining || mix(P.bone, P.lilacL, 0.45), shadow: P.lilacD, light: P.boneL, shade: 0.4, maxShade: 5, inkW: 0.9, inkHeavy: 1.2, cast: false, tex: 'weave' + f.o.seed, texOp: 0.4 });
  f.line(capM, 2.4, o.braid || mix(P.yel, P.bone, 0.4), { op: 0.55, dash: '6 4' });
  return out;
}

// (ruler pass) a rose seen from three-quarters above, not a cushion: outer guard petals splayed and rolled back, a middle
// ring, a cup, the heart a tight spiral of petal edges round a dark centre. Each petal its own shape with a dark gap at
// its base, a lit rolled lip, browning at the rim on many, a torn notch on some, a dropped petal curling off the front.
// Drawn back to front, so the far petals sit behind the cup and the near ones over it. o.sy squash, o.tilt, o.dim (0..1
// toward loam), o.simple for the small far roses (fewer petals).
function rose2(f, c, r, col, o = {}) {
  const sy = o.sy ?? 0.64, tilt = o.tilt ?? 0, cz = Math.sqrt(1 - sy * sy) * 0.85, a0 = o.ang ?? R(f, 0, 6.3);
  const P3 = (rho, th, z) => add(c, rot([rho * Math.cos(th), rho * Math.sin(th) * sy - z * cz], tilt));
  const dk = mix(col, P.loamD, 0.62), deep = mix(col, '#0a0608', 0.86), lit = mix(col, '#fff4ee', 0.45), brown = mix(mix(col, P.loamB, 0.8), P.yelD, 0.15);
  const small = r < 30 || o.simple, sd = f.o.seed;
  const rings = small ? [[5, 0.22, 1.0, -0.02, 0.1, 1.3, 'out'], [3, 0.1, 0.56, 0.06, 0.4, 1.35, 'cup']]
    : [[6, 0.28, 1.0, -0.04, 0.08, 1.22, 'out'], [5, 0.18, 0.76, 0.06, 0.34, 1.26, 'mid'], [4, 0.08, 0.48, 0.14, 0.5, 1.38, 'cup']];
  const L = [];
  rings.forEach(([n, r0, r1, z0, z1, wk, kind], ri) => {
    const off = a0 + ri * 0.62;
    for (let i = 0; i < n; i++) {
      const th = off + (i + R(f, -0.16, 0.16)) / n * Math.PI * 2;
      L.push({ th, hw: Math.PI / n * wk, r0: r0 * r, r1: r1 * r * R(f, 0.9, 1.08), z0: z0 * r, z1: z1 * r, kind, ri,
        torn: kind !== 'cup' && f.r() < 0.24, brownE: f.r() < (kind === 'out' ? 0.6 : kind === 'mid' ? 0.3 : 0.12), key: r1 * Math.sin(th) });
    }
  });
  L.push({ heart: true, key: 0.02 });
  // the shadow the rose throws on the bed, and the dark gap it sits in
  f.raw(`<ellipse cx="${(c[0] - f.L[0] * r * 0.15).toFixed(1)}" cy="${(c[1] + r * 0.32).toFixed(1)}" rx="${(r * 1.12).toFixed(1)}" ry="${(r * 0.62).toFixed(1)}" fill="${P.loamD}" opacity="0.7" filter="url(#puff${sd})"/>`);
  L.sort((p, q) => p.key - q.key).forEach(p => {
    if (p.heart) { // the heart: a dark well, the innermost petals wrapped round it in a spiral, their edges lit
      const zc = (small ? 0.4 : 0.5) * r;
      f.flat(ell(P3(0, 0, zc * 0.92), r * 0.16, r * 0.16 * sy, tilt, 10), deep);
      if (o.noHeart) return; // an eye opens here instead (the caller draws it)
      const C = []; for (let k = 0; k <= 26; k++) { const s = k / 26, th = a0 + s * Math.PI * 3.4; C.push(P3(r * (0.03 + 0.25 * s), th, zc * (1 - 0.12 * s))); }
      f.line(C, Math.max(1.2, r * 0.07), deep, { op: 0.9 }); f.line(C.map(q => add(q, [0, -Math.max(0.8, r * 0.035)])), Math.max(0.8, r * 0.03), lit, { op: 0.75 });
      return;
    }
    const front = Math.sin(p.th) > 0.15, m = 9, rim = [];
    for (let k = 0; k <= m; k++) {
      const t = k / m, th = p.th - p.hw + 2 * p.hw * t, bul = 1 + 0.1 * Math.sin(Math.PI * t);
      let rho = p.r1 * bul, z = p.z1 + (p.kind === 'out' ? -0.07 * r * Math.sin(Math.PI * t) : 0.03 * r * Math.sin(Math.PI * t));
      if (p.torn && t > 0.38 && t < 0.62) rho *= 0.8 - 0.06 * Math.sin((t - 0.38) / 0.24 * Math.PI);
      rim.push(P3(rho, th, z));
    }
    const bL = P3(p.r0, p.th - p.hw * 0.45, p.z0), bR = P3(p.r0, p.th + p.hw * 0.45, p.z0);
    const pts = [bL, ...rim, bR];
    const fill = p.kind === 'out' ? mix(col, dk, front ? 0.12 : 0.3) : p.kind === 'mid' ? mix(col, dk, front ? 0.0 : 0.18) : mix(col, lit, front ? 0.12 : 0.0);
    const pd = f.part(pts, { fill, shadow: dk, light: lit, shade: 0.42, maxShade: r * 0.16, inkW: Math.max(0.7, r * 0.018), inkHeavy: Math.max(1, r * 0.035), cast: false, hatch: !front && p.kind === 'out', k: 0.85, tex: 'mfur' + sd, texOp: 0.18, gritOp: 0.3 });
    const base = P3(p.r0, p.th, p.z0);
    clipDraw(f, pd, () => {
      f.raw(`<ellipse cx="${base[0].toFixed(1)}" cy="${base[1].toFixed(1)}" rx="${(r * 0.34).toFixed(1)}" ry="${(r * 0.24).toFixed(1)}" fill="${deep}" opacity="${front ? 0.45 : 0.7}" filter="url(#puff${sd})"/>`); // the dark gap at its base
      const rimIn = rim.slice(1, -1).map(q => lerp(q, base, front ? 0.06 : 0.12));
      f.line(rimIn, Math.max(1, r * 0.055), lit, { op: front ? 0.55 : 0.8 }); // the rolled lip lit
      if (p.brownE) { f.line(rim.slice(1, -1), Math.max(1.4, r * 0.1), brown, { op: 0.8 }); for (let k = 0; k < 3; k++) { const q = lerp(rim[2 + k * 2], base, R(f, 0.08, 0.22)); f.flat(ell(q, r * 0.05, r * 0.03, R(f, 0, 3), 6), mix(brown, P.loamD, 0.4), { op: 0.6 }); } } // browning at the rim
      f.line([lerp(base, rim[3], 0.15), lerp(base, rim[4], 0.7)], Math.max(0.6, r * 0.012), dk, { op: 0.35 }); f.line([lerp(base, rim[6], 0.15), lerp(base, rim[6], 0.65)], Math.max(0.6, r * 0.012), dk, { op: 0.3 }); // veining
    });
    if (p.torn) { const q0 = rim[3], q1 = rim[6]; f.line([q0, lerp(lerp(q0, q1, 0.5), base, 0.18), q1], Math.max(1, r * 0.04), brown, { op: 0.85 }); } // the torn edge, browned
  });
  // a dropped outer petal curling down off the front, browned
  if (!small && f.r() < 0.4) { const th = a0 + R(f, 1.2, 1.9), q = P3(r * 1.0, th, -0.05 * r), F2 = frame(q, tilt + R(f, -0.4, 0.4), r);
    f.part(F2([[-0.22, -0.06], [0.0, -0.1], [0.24, -0.04], [0.2, 0.22], [0.04, 0.4], [-0.06, 0.3], [-0.2, 0.16]]), { fill: brown, shadow: mix(brown, P.loamD, 0.6), light: mix(brown, '#fff', 0.3), shade: 0.4, maxShade: r * 0.08, inkW: Math.max(0.7, r * 0.018), inkHeavy: Math.max(1, r * 0.03), cast: true, castOp: 0.3, hatch: false, k: 0.85 });
    f.line(F2([[-0.16, 0.0], [0.0, -0.05], [0.18, 0.0]]), Math.max(0.8, r * 0.03), mix(brown, '#fff', 0.35), { op: 0.6 }); }
}

// (independent review) a contour feather seen from above: narrow at the root, broadest past the middle, a rounded tip.
// No outline round it: it is separated from its neighbours by value (a soft shadow thrown past its tip onto whatever
// lies under it, drawn first), ink only along the free tip, a lit lip on the side toward the key light, a faint rachis.
// So a stack of them reads as layered plumage instead of planks. col: its fill (toned by the caller).
function cfeather(f, root, a, L, W, col, o = {}) {
  const d = rot([1, 0], a), n = [-d[1], d[0]], N = 12, sh = o.sh || mix(col, '#1a1820', 0.45);
  const wt = t => W * 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.78)), 0.8) * (t > 0.82 ? Math.sqrt(Math.max(0, 1 - ((t - 0.82) / 0.18) ** 2)) * 0.9 + 0.1 : 1);
  const C = []; for (let i = 0; i <= N; i++) { const t = i / N; C.push(add(add(root, mul(d, L * t)), mul(n, (o.bend ?? 0) * L * t * t))); }
  const pp = C.map((q, i) => add(q, mul(n, wt(i / N) * (1 + (o.lop ?? 0))))), qq = C.map((q, i) => add(q, mul(n, -wt(i / N))));
  const pts = [...pp, add(C[N], mul(d, W * 0.06)), ...qq.reverse()];
  if (o.shadow !== false) f.raw(`<ellipse cx="${(C[N][0] + d[0] * W * 0.15 - f.L[0] * W * 0.12).toFixed(1)}" cy="${(C[N][1] + d[1] * W * 0.15 - f.L[1] * W * 0.12).toFixed(1)}" rx="${(W * 0.55).toFixed(1)}" ry="${(W * 0.32).toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${C[N][0].toFixed(1)} ${C[N][1].toFixed(1)})" fill="${o.cast || '#1a1820'}" opacity="${(o.castOp ?? 0.3).toFixed(2)}" filter="url(#puff${f.o.seed})"/>`);
  f.part(pts, { fill: col, shadow: sh, light: mix(col, '#fff', 0.35), shade: 0.36, maxShade: W * 0.22, tex: o.tex || ('barb' + f.o.seed), texOp: o.texOp ?? 0.3, inkW: 0, inkHeavy: 0, cast: false, hatch: o.hatch ?? false, k: 1, hi: 0.03 });
  const tipArc = [...pp.slice(Math.round(N * 0.62)), C[N], ...qq.slice(Math.round(N * 0.62)).reverse()].map(q => q.slice(0, 2));
  f.line(tipArc, o.inkW ?? 1, INK, { op: o.inkOp ?? 0.65 });
  const litN = n[0] * f.L[0] + n[1] * f.L[1] > 0 ? pp : qq; f.line(litN.slice(3, N - 1).map(q => lerp(q, C[litN.indexOf(q)] || q, 0.15)), Math.max(0.8, W * 0.04), mix(col, '#fff', 0.55), { op: 0.45 });
  if (o.rachis !== false) f.line(C.slice(1, N - 2), Math.max(0.6, W * 0.025), mix(col, '#000', 0.25), { op: 0.25 });
  return { tip: C[N], C };
}

// (independent review) a swan's wing raised and arched in threat, after kit_VI's habits. The leading edge runs shoulder S
// > elbow Ew > wrist Wr (the top of the arch), the hand back down toward T. Order, under to over: primaries fanned back
// from the hand (inner first, the outer one last so its edge stays clean; slotted, emarginated tips that step);
// secondaries hanging from the forearm toward the body (o.body), elbow ones on top, their tips the scalloped trailing
// edge; tertials drooping back from the elbow; greater, median and lesser coverts in rows, each feather throwing its soft
// shadow past its tip onto the row under it; primary coverts and the alula on the hand; scapulars over the arm; last the
// leading edge, one shaped band thick over the arm and the wrist's bend, thinning to the hand, inked heavily only along
// its outer edge, marginal coverts fringing its inner edge. Feathers are toned by where they sit in the light.
// o.wht / o.sh / o.dk: white, shadow and deep colours; o.far darkens the far wing; o.rot(bone, info) adds the rot.
function swanWing(f, S, Ew, Wr, T, o = {}) {
  const [b1, b2, b3] = o.bones, wht = o.wht, dk = o.dk, far = o.far ? 0.4 : 0, s = o.s ?? 1;
  const cx = (S[0] + Wr[0] + T[0]) / 3, cy = (S[1] + Wr[1] + T[1]) / 3;
  const lit = p => Math.max(0, Math.min(1, 0.62 + ((p[0] - cx) * f.L[0] + (p[1] - cy) * f.L[1]) / 360)) * (1 - far);
  const col = (p, k0 = 0) => mix(dk, wht, Math.max(0.06, Math.min(1, lit(p) - k0)));
  const an = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  const inward = (a, b) => { const d = E.norm(sub(b, a)), n = [-d[1], d[0]], m = lerp(a, b, 0.5); return n[0] * (o.body[0] - m[0]) + n[1] * (o.body[1] - m[1]) > 0 ? n : mul(n, -1); };
  const nF = inward(Ew, Wr), nH = inward(Wr, T), nU = inward(S, Ew);
  const H = lerp(Wr, T, 0.28), aP = an(Wr, T), Lp = E.len(sub(T, Wr)) * (o.pK ?? 0.9), Ls = (o.Ls ?? 240) * s, Ws = (o.Ws ?? 58) * s, Wp = (o.Wp ?? 30) * s;
  const aSec = an([0, 0], E.norm(add(nF, [-(o.rakeX ?? 0.35), 0])));
  const CF = (r0, a, L, W, p, k0, x = {}) => cfeather(f, r0, a, L, W, col(p, k0), Object.assign({ cast: dk, castOp: 0.34 * (1 - far * 0.5) }, x));
  const out = {};
  // ---- the hand: primaries, primary coverts, alula
  f.bone(b3);
  const np = o.np ?? 10;
  for (let i = np - 1; i >= 0; i--) {
    const t = i / (np - 1), r0 = add(lerp(Wr, H, 1 - t * 0.9), mul(nH, 4 + t * 22 * s)), a = an([0, 0], E.norm(add(rot([1, 0], aP), mul(nH, 0.6 * t)))), L = Lp * (1 - t * 0.4) * R(f, 0.95, 1.04);
    if (i < np - 1) f.raw(`<path d="${E.smooth([r0, add(r0, rot([L * 0.95, Wp * 0.3], a)), add(r0, rot([L * 0.95, Wp * 0.9], a)), add(r0, rot([0, Wp * 0.7], a))])}" fill="${dk}" opacity="${0.3 * (1 - far * 0.5)}" filter="url(#puff${f.o.seed})"/>`); // the shadow of this feather on the next
    V.feather(f, r0, a, L, Wp * (1 - t * 0.12), { fill: col(lerp(r0, T, 0.3), 0.06 + t * 0.12), shadow: o.sh, light: mix(wht, '#fff', 0.35), shade: 0.4, tex: 'barb' + f.o.seed, texOp: 0.3, inkW: 0.8, inkHeavy: 1.2 }, { lead: 0.3, round: false, emarg: t < 0.65 ? 0.85 - t * 0.6 : 0.1, notch: (o.notchP || []).includes(i) ? [0.62, 0.8] : [], dark: 0.28, darkCol: mix(dk, P.lilacS, 0.4), darkOp: 0.35, splits: true, lift: i % 4 === 1 ? 1 : 0 });
  }
  for (let i = 6; i >= 0; i--) { const t = i / 6, r0 = add(lerp(Wr, H, 0.08 + t * 0.92), mul(nH, 2)); CF(r0, aP + 0.14 + R(f, -0.06, 0.06), Lp * 0.34 * R(f, 0.9, 1.05), Wp * 1.9, r0, 0.0); } // primary coverts
  for (let i = 2; i >= 0; i--) CF(add(Wr, mul(nH, -4 + i * 8)), aP - 0.3 + i * 0.12, (64 - i * 10) * s, 18 * s, Wr, -0.05, { shadow: false }); // the alula
  // ---- the forearm: secondaries, then the covert rows
  f.bone(b2);
  const ns = o.ns ?? 12;
  for (let i = ns - 1; i >= 0; i--) { const t = i / (ns - 1), r0 = add(lerp(Ew, Wr, 0.03 + t * 0.95), mul(nF, 10)), a = aSec + (t - 0.5) * 0.3 + R(f, -0.05, 0.05), L = Ls * (0.9 + 0.16 * Math.sin(t * 2.8)) * R(f, 0.94, 1.06); CF(r0, a, L, Ws, add(r0, rot([L * 0.7, 0], a)), 0.12, { bend: 0.06, inkW: 1.2, dark: true }); }
  for (let i = (o.ng ?? 10) - 1; i >= 0; i--) { const t = i / ((o.ng ?? 10) - 1), r0 = add(lerp(Ew, Wr, 0.02 + t * 0.96), mul(nF, 16 * s)); CF(r0, aSec + (t - 0.5) * 0.22 + R(f, -0.06, 0.06), Ls * 0.48 * R(f, 0.9, 1.08), Ws * 1.05, r0, 0.0); } // greater coverts
  for (let i = 13; i >= 0; i--) { const t = i / 13, r0 = add(lerp(Ew, Wr, t), mul(nF, 12 * s)); CF(r0, aSec + R(f, -0.12, 0.12), Ls * 0.27 * R(f, 0.85, 1.1), Ws * 0.78, r0, -0.06, { inkW: 0.9 }); } // median coverts
  for (const k of [0, 1]) for (let i = 18; i >= 0; i--) { const t = Math.min(1, (i + k * 0.5) / 18), r0 = add(lerp(Ew, Wr, t), mul(nF, (4 + k * 5) * s)); CF(r0, aSec + R(f, -0.18, 0.18), (34 - k * 9) * s * R(f, 0.85, 1.15), 22 * s, r0, -0.12, { inkW: 0.8, inkOp: 0.5, rachis: false }); } // lesser coverts, the palest
  if (o.rot) o.rot(b2, { nF, Ew, Wr, Ls });
  // ---- the upper arm: tertials drooping back over the body, the scapulars over the arm's base
  f.bone(b1);
  for (let i = 0; i < 4; i++) { const t = i / 3, r0 = add(lerp(lerp(S, Ew, 0.7), Ew, t), mul(nU, 10)), a = an([0, 0], E.norm(add(nU, [-0.5, 0.9]))) + (t - 0.5) * 0.4; CF(r0, a, Ls * (0.95 - t * 0.2), Ws * 1.2, add(r0, rot([Ls * 0.5, 0], a)), 0.14, { bend: -0.08 }); } // tertials drooping down and back over the body
  for (let i = 6; i >= 0; i--) { const t = i / 6, r0 = add(lerp(S, Ew, 0.1 + t * 0.8), mul(nU, 6 + (i % 2) * 16)); CF(r0, an([0, 0], E.norm(add(nU, [-0.4, 1.0]))) + R(f, -0.2, 0.2), Ls * 0.42 * R(f, 0.8, 1.15), Ws * 0.95, r0, 0.04); } // scapulars lying down over the arm
  if (o.rot) o.rot(b1, { nU, S, Ew });
  // ---- the leading edge: one shaped band, split onto the three bones
  const LE = spline([lerp(S, Ew, 0.55), Ew, lerp(Ew, Wr, 0.5), Wr, lerp(Wr, T, 0.12), lerp(Wr, T, 0.24)], 5), nL = LE.length; // the arm's base is buried in the scapulars
  const wAt = i => { const t = i / (nL - 1); return (30 - 14 * t + 12 * Math.exp(-((t - 0.6) ** 2) / 0.008)) * s * (t < 0.08 ? 0.5 + t * 6 : 1); }; // thick over the arm, the wrist's bend swollen, thin at the hand
  const outward = mul(nF, -1);
  const band = X.ribbon(LE, LE.map((_, i) => wAt(i)));
  const drawBand = () => { const bd = f.part(band, { fill: col(Ew, -0.25), shadow: o.sh, light: mix(wht, '#fff', 0.4), shade: 0.38, maxShade: 10, tex: 'barb' + f.o.seed, texOp: 0.3, inkW: 0, inkHeavy: 0, cast: false, hatch: false });
    clipDraw(f, bd, () => { const inner = LE.map((q, i) => { const a2 = LE[Math.max(0, i - 1)], b2_ = LE[Math.min(nL - 1, i + 1)], dd = E.norm(sub(b2_, a2)), nn = [-dd[1], dd[0]], sg = nn[0] * nF[0] + nn[1] * nF[1] > 0 ? 1 : -1; return add(q, mul(nn, sg * wAt(i) * 0.5)); }); for (let i = 2; i < nL - 2; i += 2) { const q = inner[i]; f.line([add(lerp(q, LE[i], 0.5), [0, 0]), add(q, mul(nF, 5)), lerp(q, inner[Math.min(nL - 1, i + 2)], 0.5)], 0.9, dk, { op: 0.45 }); } softTone(f, E.smooth(band), [[inner.concat(LE.slice().reverse()), dk, 0.25 * (1 - far), 6]]); });
    const outer = LE.map((q, i) => { const a2 = LE[Math.max(0, i - 1)], b2_ = LE[Math.min(nL - 1, i + 1)], dd = E.norm(sub(b2_, a2)), nn = [-dd[1], dd[0]], sg = nn[0] * nF[0] + nn[1] * nF[1] > 0 ? -1 : 1; return add(q, mul(nn, sg * wAt(i) * 0.5)); });
    f.line(outer, 2.2, INK); f.line(outer.slice(1, -1).map(q => add(q, mul(f.L, -2.5))), 1.6, mix(wht, '#fff', 0.5), { op: 0.6 * (1 - far) }); };
  split(f, drawBand, [[b1, side(Ew, sub(Ew, S), 30 * s)], [b2, [side(Ew, sub(S, Ew), 30 * s), side(Wr, sub(Ew, Wr), 26 * s)]], [b3, side(Wr, sub(Wr, Ew), 26 * s)]]);
  if (o.rot) { f.bone(b3); o.rot(b3, { nH, Wr, T, H }); }
  return out;
}

// a boot split at the ankle for the rig (kit_X bootRig)
function bootRig(f, K0, A, s, col, sfx, o = {}) {
  const da = add(E.norm(sub(A, K0)), [0.6, 0]);
  return split(f, () => B.boot(f, A, 1, s, col, o), [['shin' + sfx, side(A, mul(da, -1), s * 0.36)], ['foot' + sfx, side(A, da, s * 0.36)]]);
}
// a bare leg from hip to toes in one outline (kit fullLeg), cut at the knee and the ankle (kit_XIII_b bareLegRig)
function bareLegRig(f, Hp, Kn, A, s, wH, wK, look, sfx, o = {}) {
  const de = X.elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  const i0 = f.out.length; const pts = X.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o); if (o.after) o.after(pts); const body = f.out.splice(i0).join('\n');
  const put = (bone, regs) => { let g = body; for (const r of regs) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; } f.bone(bone); f.raw(g); };
  put('thigh' + sfx, [side(Kn, mul(de, -1), wK / 2)]);
  put('shin' + sfx, [side(Kn, de, wK / 2), side(A, mul(da, -1), 18)]);
  put('foot' + sfx, [side(A, da, 18)]);
  return pts;
}
// an iron ring or plain band (collar ring, leg ring): a thick torus seen at an angle
function ironRing(f, c, rx, ry, w, a = 0, o = {}) {
  const col = o.col || '#4a4846', e = ell(c, rx, ry, a, 24);
  f.line(e.concat([e[0]]), w + 2.4, INK); f.line(e.concat([e[0]]), w, col);
  f.line(e.slice(14, 22), Math.max(0.8, w * 0.35), mix(col, '#fff', 0.45), { op: 0.7 });
  f.line(e.slice(3, 9), Math.max(0.8, w * 0.4), '#000', { op: 0.5 });
}
// a lead garden label on a wire: a small dull-grey tag, stamped letters scratched, a bent corner
function leadLabel(f, top, w, h, a = 0, o = {}) {
  const F = frame(top, a, 1), wire = o.wire ?? 20;
  f.line([top, F([[0, wire * 0.5]])[0], F([[1, wire]])[0]], 1.2, '#4a4846');
  const pl = F([[-w / 2, wire], [w / 2, wire], [w / 2, wire + h], [-w / 2 + 5, wire + h], [-w / 2, wire + h - 5]]).map(q => [...q, 1]);
  f.part(pl, { fill: '#6e6c6e', shadow: '#2e2c30', light: '#9a989c', shade: 0.4, inkW: 1.1, inkHeavy: 1.4, cast: true, castOp: 0.3, tex: 'mottle' + f.o.seed, texOp: 0.6 });
  for (let i = 0; i < (o.lines ?? 2); i++) f.line(F([[-w * 0.35, wire + h * (0.35 + i * 0.3)], [w * (0.1 + f.r() * 0.25), wire + h * (0.35 + i * 0.3)]]), 1, INK, { op: 0.6, dash: '3 2' });
  f.flat(F(ell([0, wire + 3], 1.6, 1.6, 0, 6)), INK);
}

// clean round void holes cut through everything draw() outputs, wrapping each output separately so the rig's bone marks
// (indices into f.out) stay valid across several bones (a wing drawn on three bones); rims drawn after, on the current bone
function holeEach(f, holes, draw, o = {}) {
  const i0 = f.out.length, res = draw(), id = f.id('vh');
  const circ = ([c, r]) => `M${(c[0] + r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] - r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] + r).toFixed(1)},${c[1].toFixed(1)}Z`;
  f.defs.push(`<clipPath id="${id}"><path clip-rule="evenodd" d="M-4000,-4000H8000V8000H-4000Z ${holes.map(circ).join(' ')}"/></clipPath>`);
  for (let i = i0; i < f.out.length; i++) f.out[i] = `<g clip-path="url(#${id})">${f.out[i]}</g>`;
  if (o.rimBone) f.bone(o.rimBone);
  for (const [c, r] of holes) { const e = ell(c, r + 0.4, r + 0.4, 0, 32), e2 = ell(c, r + 2.6, r + 2.6, 0, 32); f.line(e2.concat([e2[0]]), 1.6, INK, { op: 0.7 }); f.line(e.concat([e[0]]), 1.6, P.rim, { op: 0.95 }); f.line(ell(c, r + 1.2, r + 1.2, 0, 32).slice(17, 30), 1, P.rimD, { op: 0.6 }); }
  return res;
}

// modelling for a large face drawn with B.head (a ruler's): soft tones clipped to B.head's own face outline: the eye
// sockets and the under-brow, the lit cheekbone and nose bridge, the shadow under the nose and the lower lip, the jaw
// turning away, and fine contour hatching along the shadow side. p: the same jaw/chin as given to B.head.
function faceModel(f, HC, H, hA, p = {}) {
  const F = frame(HC, hA, H), jaw = p.jaw ?? 1, chin = p.chin ?? 0, skin = p.skin, sh = p.shadow || mix(skin, '#2a1c26', 0.55);
  const face = F([[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32 + chin * 0.5, 0.37], [0.29 + chin, 0.47], [0.13 + chin * 0.5, 0.535 + chin * 0.2], [-0.06 - 0.08 * (jaw - 1), 0.47 + 0.04 * (jaw - 1)], [-0.21 - 0.1 * (jaw - 1), 0.27], [-0.30, 0.08], [-0.37, -0.13]]);
  const d = E.smooth(face), b = H * 0.06;
  softTone(f, d, [
    [F(ell([0.12, -0.08], 0.13, 0.07, 0, 10)), sh, 0.45, b * 0.6], [F(ell([0.3, -0.08], 0.06, 0.06, 0, 8)), sh, 0.4, b * 0.5], // the sockets
    [F([[0.0, -0.14], [0.3, -0.13], [0.3, -0.1], [0.0, -0.11]]), sh, 0.4, b * 0.4], // under the brow
    [F(ell([0.12, 0.04], 0.12, 0.06, 0.2, 10)), '#ffffff', 0.25, b], [F([[0.27, -0.12], [0.33, -0.1], [0.34, 0.1], [0.3, 0.12]]), '#ffffff', 0.25, b * 0.5], // cheekbone, nose bridge
    [F(ell([0.24, 0.18], 0.08, 0.035, 0, 8)), sh, 0.4, b * 0.5], [F(ell([0.22, 0.36], 0.08, 0.03, 0, 8)), sh, 0.35, b * 0.5], // under the nose, under the lip
    [F([[-0.36, -0.2], [-0.12, -0.2], [-0.06, 0.5], [-0.3, 0.4]]), sh, 0.5, b * 1.2], // the far side of the face turning away
    [F(ell([0.12, 0.44], 0.2, 0.08, 0, 10)), sh, 0.35, b], // the jaw's underplane
  ]);
  clipDraw(f, d, () => { for (let i = 0; i < 18; i++) { const t = i / 17, q0 = F([[-0.34 + t * 0.06, -0.3 + t * 0.7]])[0], q1 = F([[-0.2 + t * 0.05, -0.28 + t * 0.7]])[0]; f.line([q0, lerp(q0, q1, 0.5).map((v, k) => v + (k ? 2 : 0)), q1], 1, INK, { op: 0.35 }); } });
}

module.exports = Object.assign({}, X, {
  mArm: Xb.mArm, mLeg: Xb.mLeg, knuckleFist: Xb.knuckleFist, gripK: Xb.gripK, hemLine: Xb.hemLine, wear: Xb.wear, lumpy: T3.lumpy,
  wing: V.wing, feather: V.feather, plumeMass: V.plumeMass, featherHem: V.featherHem,
  texturesB, holeEach, faceModel, ladyFace, rose2, sleeveBunch, bristles, maneRidge, swanWing, cfeather, fold, folds, brainFungus, foliage, deadPatch, wicker, coiledStraw, snail, shell, motley, barrelTones, bootRig, bareLegRig, ironRing, leadLabel,
});
