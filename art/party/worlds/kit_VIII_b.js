// World VIII, The Sundered Rime, second batch (VIII_b): re-exports the first batch's kit (kit_VIII.js, unchanged) and
// adds the helpers the second batch needs: fur in hanks (copied from kit_IX's hairClump, recoloured to this world),
// small dark animal eyes under the brow (no white staring discs; VIII is not a void world), a scale texture for the
// adder, plain iced / burnt parts for figures whose split is local, timber and adit (tunnel mouth) builders for the
// two rulers, and tally marks. All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const V0 = require('./kit_VIII');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, lp } = E;
const P = V0.P;

// extra textures for this batch (call after V.textures(f)): scales (overlapping keeled scales), grain (split timber)
function texturesB(f) {
  V0.textures(f);
  const s = f.o.seed;
  let sc = '';
  for (let row = 0; row < 3; row++) for (let i = -1; i < 4; i++) { const x = i * 12 + (row % 2) * 6, y = row * 8; sc += `<path d="M${x},${y + 8} q6,-9 12,0" fill="none" stroke="${INK}" stroke-width="0.9" opacity="0.65"/><path d="M${x + 6},${y + 1.5} l0,4" stroke="#ffffff" stroke-width="0.7" opacity="0.35"/>`; }
  f.defs.push(`<pattern id="scales${s}" patternUnits="userSpaceOnUse" width="24" height="16">${sc}</pattern>`);
  const r = E.rng(s * 7 + 3); let g = '';
  for (let i = 0; i < 7; i++) { const y = r() * 40; g += `<path d="M0,${y.toFixed(1)} q${(20 + r() * 20).toFixed(1)},${((r() - 0.5) * 4).toFixed(1)} 60,${((r() - 0.5) * 3).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${(0.6 + r() * 0.6).toFixed(1)}" opacity="0.6"/>`; }
  for (let i = 0; i < 3; i++) { const x = r() * 60, y = r() * 40; g += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4" ry="1.8" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="grain${s}" patternUnits="userSpaceOnUse" width="60" height="40">${g}</pattern>`);
  f.defs.push(`<filter id="mblur${s}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>`);
  f.defs.push(`<filter id="mblurS${s}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>`);
}

// ---------------------------------------------------------------- form (independent review): modelling inside big bodies
// resample a polyline (through a spline) to k points evenly spaced by arc length
function resample(ctrl, k) { const C = V0.spline(ctrl, 4), S = V0.arcLen(C), T = S[S.length - 1], out = []; for (let i = 0; i < k; i++) out.push(V0.at(C, S, T * i / (k - 1)).p); return out; }
// a soft mass (a muscle, a bone under skin) modelled inside a big part: a blurred shadow on the edge turned away from
// the key light and a blurred lit plane on the edge toward it, so the mass turns without a hard outline.
// o.s: how far the light bites in (px); o.op / o.hiOp: strengths; o.edge: an ink stroke along the shadowed contour.
function mass(f, pts, o = {}) {
  const d = E.smooth(pts), bb = E.bbox(pts), sz = Math.min(bb[2] - bb[0], bb[3] - bb[1]), s = o.s ?? sz * 0.28, L = f.L, pad = 200;
  const box = `x="${(bb[0] - pad).toFixed(0)}" y="${(bb[1] - pad).toFixed(0)}" width="${(bb[2] - bb[0] + 2 * pad).toFixed(0)}" height="${(bb[3] - bb[1] + 2 * pad).toFixed(0)}"`;
  const sid = f.id('ms'), hid = f.id('mh'), bl = `url(#${o.sharp ? 'mblurS' : 'mblur'}${f.o.seed})`;
  f.defs.push(`<mask id="${sid}" maskUnits="userSpaceOnUse" ${box}><g filter="${bl}"><path d="${d}" fill="#fff"/><path d="${d}" transform="translate(${(L[0] * s).toFixed(1)},${(L[1] * s).toFixed(1)})" fill="#000"/></g></mask>`);
  f.defs.push(`<mask id="${hid}" maskUnits="userSpaceOnUse" ${box}><g filter="${bl}"><path d="${d}" fill="#fff"/><path d="${d}" transform="translate(${(-L[0] * s * 0.6).toFixed(1)},${(-L[1] * s * 0.6).toFixed(1)})" fill="#000"/></g></mask>`);
  f.raw(`<rect ${box} fill="${o.shadow || '#1a2440'}" opacity="${o.op ?? 0.42}" mask="url(#${sid})"/>`);
  if (o.hiOp !== 0) f.raw(`<rect ${box} fill="${o.light || '#ffffff'}" opacity="${o.hiOp ?? 0.3}" mask="url(#${hid})"/>`);
  if (o.edge) f.stroke(o.edge, o.edgeW ?? 6, INK, { op: o.edgeOp ?? 0.45 });
}
// form hatching between two curves: n tapered strokes, each a blend of the two, so the hatching follows the form
// (between two ribs, under a breast, along a muscle). o.col (ink by default; white for rime hatching), o.ragged: how
// much of each stroke's ends is dropped at random, o.fade: strokes thin and fade from A toward B.
function bandHatch(f, A, B, n, w, o = {}) {
  const k = o.k || 14, a = resample(A, k), b = resample(B, k), col = o.col || INK, rag = o.ragged ?? 0.3;
  for (let j = 0; j < n; j++) {
    const t = n === 1 ? 0.5 : j / (n - 1), tt = Math.min(1, Math.max(0, t + (f.r() - 0.5) * 0.5 / n));
    const pts = a.map((p, i) => lerp(p, b[i], tt));
    const i0 = Math.floor(f.r() * rag * k), i1 = k - Math.floor(f.r() * rag * k);
    if (i1 - i0 < 3) continue;
    f.stroke(pts.slice(i0, i1), w * (0.7 + f.r() * 0.6) * (o.fade ? (1 - t * 0.6) : 1), col, { op: (o.op ?? 0.4) * (o.fade ? (1 - t * 0.5) : 1) });
  }
}
// cross-contour hatching round a limb: short arcs across it on its shadow side, curving the way a ring round the limb
// would, from near the centre line out to the edge. side +1 is the +normal side of limb(a, b) ([-d.y, d.x]).
function wrapHatch(f, a, b, wa, wb, side, n, o = {}) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
  for (let i = 0; i < n; i++) {
    const t = (o.t0 ?? 0) + ((o.t1 ?? 1) - (o.t0 ?? 0)) * (i + 0.5 + (f.r() - 0.5) * 0.5) / n, c = lerp(a, b, t), w = wa + (wb - wa) * t, bow = (o.bow ?? 0.22) * w;
    const s0 = o.s0 ?? (0.2 + f.r() * 0.2);
    const pts = [s0, (s0 + 0.95) / 2, 0.8, 0.96].map(s => add(add(c, mul(nn, side * w * s)), mul(d, bow * s * s)));
    f.stroke(pts, (o.w || 3) * (0.7 + f.r() * 0.6), o.col || INK, { op: o.op ?? 0.35 });
  }
}
// an old crack in ice skin: a dark jagged trough with a lit lip on the side toward the light and hairline branches
function oldCrack(f, ctl, w, o = {}) {
  const L = V0.jag(f, ctl, o.amp ?? w * 1.4, o.step ?? 16);
  f.stroke(L, w * 2.6, '#0c1424', { op: 0.3 });
  f.line(L, w, '#0a0e18', { op: 0.85 });
  f.line(L.map(p => add(p, [w * 0.7, -w * 0.7])), Math.max(1, w * 0.4), '#ffffff', { op: 0.6 });
  for (let i = 2; i < L.length - 1; i += 2) if (f.r() < 0.65) {
    const t = E.norm(sub(L[i + 1], L[i - 1])), nn = [-t[1], t[0]], s = f.r() < 0.5 ? 1 : -1, q = add(L[i], add(mul(nn, s * V0.R(f, 14, 40) * w / 4), mul(t, V0.R(f, -10, 10))));
    f.line([L[i], lerp(L[i], q, 0.5).map(v => v + (f.r() - 0.5) * 5), q], Math.max(0.9, w * 0.28), INK, { op: 0.6 });
  }
  return L;
}
// a heavy hank of guard hair (independent review, for the musk ox): wide where it roots, swelling a little below the
// root, tapering unevenly, the tip splitting into 1 to 3 points of different lengths. Drawn as a shaded part, so each
// hank has volume and its own shadow side and overlaps the hanks under it with an edge, then strand lines and a lit
// strand. o.look: the part look; o.ice: rime it, clot an ice ball in it, sometimes hang an icicle off a tip.
function hank(f, path, w, o = {}) {
  const C = V0.spline(path, 6), n = C.length, end = 0.86;
  const wf = t => (t < 0.25 ? w * (0.5 + 2 * t) : w * (1 - (t - 0.25) / (end - 0.25) * 0.72)) * (o.wk || 1);
  const side = s => { const out = []; for (let i = 0; i < n; i++) { const t = i / (n - 1); if (t > end) break; const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; out.push(add(C[i], mul(nn, s * wf(t) / 2 * (1 + (f.r() - 0.5) * 0.12)))); } return out; };
  const L = side(1), Rr = side(-1), m = o.tips ?? (w > 60 ? 3 : w > 34 ? 2 : 1 + (f.r() < 0.4 ? 1 : 0)), last = C[n - 1], ie = L.length - 1;
  const dEnd = E.norm(sub(last, C[Math.max(0, n - 4)])), tips = [];
  for (let k = 0; k < m; k++) { const base = lerp(L[ie], Rr[ie], (k + 0.5) / m), q = add(add(base, mul(dEnd, V0.R(f, 0.3, 1.2) * E.len(sub(last, C[Math.floor((n - 1) * end)])) + 6)), [(f.r() - 0.5) * 8, 0]); tips.push(q); }
  const outl = [...L]; for (let k = 0; k < m; k++) { outl.push([...tips[k], 1]); if (k < m - 1) outl.push(lerp(lerp(L[ie], Rr[ie], (k + 1) / m), C[Math.floor((n - 1) * end)], 0.2)); } outl.push(...Rr.reverse());
  { const d0 = E.norm(sub(C[1], C[0])), nn0 = [-d0[1], d0[0]], w0 = wf(0); outl.push(add(add(C[0], mul(d0, -w0 * 0.3)), mul(nn0, -w0 * 0.3)), add(C[0], mul(d0, -w0 * 0.42)), add(add(C[0], mul(d0, -w0 * 0.3)), mul(nn0, w0 * 0.3))); } // a rounded root, not a cut end
  const look = Object.assign({ fill: '#9a9e9e', shadow: '#2e323c', light: '#e4e8ea', shade: 0.42, tex: 'fur' + f.o.seed, texOp: 0.7, inkW: 1.3, inkHeavy: 2.2, maxShade: Math.max(8, w * 0.38), castOp: 0.5, hi: 0.025 }, o.look || {});
  // the root third carries no ink, so the hank grows out of the coat and only separates into a clump lower down
  const d = f.part(outl, Object.assign({}, look, { inkW: 0, cast: false }));
  { const m0 = L.length, s0 = Math.floor(m0 * (o.rootK ?? 0.32)), tl = outl.length - 2 * m0 - 3, seg = outl.slice(s0, m0 + tl + m0 - s0); f.line(seg, look.inkW, INK, { k: 1 }); f.line(seg.slice(Math.floor(seg.length * 0.3)).map(q => add(q, [1.2, 1.2])), 1.6, INK, { op: 0.45 }); }
  V0.clipDraw(f, d, () => {
    for (let k = 0; k < Math.max(2, Math.round(w / 18)); k++) { const s0 = (k / Math.max(1, Math.round(w / 18) - 1) - 0.5) * 0.7 + (f.r() - 0.5) * 0.15, t0 = f.r() * 0.3, t1 = 0.6 + f.r() * 0.4; const pts = []; for (let i = Math.floor(t0 * (n - 1)); i <= Math.floor(t1 * (n - 1)); i++) { const t = i / (n - 1), a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], dd = E.norm(sub(b, a)), nn = [-dd[1], dd[0]]; pts.push(add(C[i], mul(nn, s0 * wf(Math.min(t, end))))); } if (pts.length > 2) f.line(pts, 0.8 + f.r() * 0.9, f.r() < 0.6 ? mix(look.fill, '#000', 0.55) : mix(look.fill, '#fff', 0.45), { op: 0.7 }); }
    if (o.ice) { f.raw(`<path d="${E.smooth(outl)}" fill="url(#rime${f.o.seed})" opacity="0.45"/>`); }
  });
  if (o.ice && f.r() < (o.ballK ?? 0.25)) { const q = C[Math.floor((n - 1) * V0.R(f, 0.35, 0.8))]; f.part(ell(add(q, [(f.r() - 0.5) * w * 0.3, 0]), V0.R(f, 7, 13), V0.R(f, 6, 11), f.r(), 10), { fill: P.glass, shadow: P.iceS, light: P.iceL, shade: 0.4, inkW: 1, cast: false, hatch: false, gritOp: 0.2 }); }
  if (o.ice && f.r() < (o.icicleK ?? 0.35)) { const t = tips[Math.floor(f.r() * tips.length)]; V0.icicle(f, add(t, [0, -4]), V0.R(f, 10, 30), V0.R(f, 4, 7), { drop: f.r() < 0.3 }); }
  return { d, tips };
}
// a matted woolly underlayer (the musk ox's qiviut) over a region: a pale buff base, then dense small curls and tufts
function underwool(f, pts, o = {}) {
  const d = f.part(pts, Object.assign({ fill: '#b4ac9c', shadow: '#4a4438', light: '#e8e2d4', shade: 0.4, tex: 'fur' + f.o.seed, texOp: 0.5, inkW: 1.2, maxShade: 50 }, o.look || {}));
  const bb = E.bbox(pts);
  V0.clipDraw(f, d, () => {
    const n = Math.round((bb[2] - bb[0]) * (bb[3] - bb[1]) / (o.density || 90));
    for (let i = 0; i < n; i++) { const p = [bb[0] + f.r() * (bb[2] - bb[0]), bb[1] + f.r() * (bb[3] - bb[1])], r = V0.R(f, 3, 7), a = f.r() * 6.3; f.line([add(p, rot([-r, 0], a)), add(p, rot([0, -r * 0.9], a)), add(p, rot([r, 0], a)), add(p, rot([r * 0.3, r * 0.6], a))], 1.1, f.r() < 0.6 ? '#5a5246' : '#f0ece0', { op: 0.75 }); }
    f.raw(`<path d="${E.smooth(pts)}" fill="url(#rime${f.o.seed})" opacity="0.5"/>`);
  });
  return d;
}
// a healed seam: an old split refrozen with clearer ice, a glassy band with dark edges and ice ties bridging it
function healedSeam(f, ctl, w) {
  const L = V0.jag(f, ctl, w * 0.6, 18);
  f.stroke(L, w * 2, '#1a2840', { op: 0.35 });
  f.stroke(L, w * 1.1, P.glass, { op: 0.9 });
  f.line(L.map(p => add(p, [1.5, -1.5])), 1.4, '#ffffff', { op: 0.6 });
  for (let i = 1; i < L.length - 1; i++) { const t = E.norm(sub(L[i + 1], L[i - 1])), nn = [-t[1], t[0]]; f.line([add(L[i], mul(nn, w * 0.95)), add(add(L[i], mul(nn, -w * 0.95)), mul(t, 3))], 1.6, '#2a3a50', { op: 0.65 }); }
}

function offsetLine(pts, off) {
  const n = pts.length;
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)); return add(p, mul([-d[1], d[0]], off(i / (n - 1)))); });
}
// a clump (hank) of matted hair or fur along path (root to tip): dark gap, tapered body, strands converging on the tip
function hairClump(f, path, w, o = {}) {
  const pal = o.pal || [P.furD, P.fur, P.furL, P.grey];
  const b0 = o.base || pal[Math.floor(f.r() * pal.length)];
  const tw = t => Math.sin(Math.PI * (0.1 + 0.85 * t)) * (t < 0.15 ? 0.6 + t * 2.6 : 1);
  if (o.gap !== false) f.stroke(path, w + 4, INK, { op: 0.85 });
  f.stroke(path, w, b0);
  const n = o.n || Math.max(3, Math.round(w / 6));
  for (let k = 0; k < n; k++) {
    const s = (k / (n - 1) - 0.5) * w * 0.7, j = (f.r() - 0.5) * 3;
    const pts = offsetLine(path, t => (s + j) * tw(t) * 0.95);
    const t0 = Math.floor(f.r() * 2), t1 = pts.length - Math.floor(f.r() * 2);
    f.line(pts.slice(t0, Math.max(t0 + 2, t1)), 0.7 + f.r() * 1.0, f.r() > 0.45 ? mix(b0, '#000', 0.45) : mix(b0, '#e8e8dc', 0.3), { op: 0.75 });
  }
  if (o.sheen) { const pts = offsetLine(path, t => w * 0.16 * tw(t)); f.line(pts.slice(1, -1), Math.max(1, w * 0.08), o.sheen, { op: 0.55 }); }
}
// a fringe of hanks hanging from an edge polyline: each hank roots on the edge, falls along `dir` (plumb by default),
// sways a little and ends in a point. o.state: 'ice' (frozen stiff, rimed, icicle tags on the tips), 'singed'
// (shortened, charred tips curling up, embers), none. Returns the tips.
function hanks(f, edge, n, l0, l1, w, o = {}) {
  const C = V0.spline(edge, 3), S = V0.arcLen(C), T = S[S.length - 1], d0 = E.norm(o.dir || [0, 1]), tips = [];
  const pal = o.pal || (o.state === 'ice' ? [mix(P.fur, P.ice, 0.55), mix(P.furL, P.ice, 0.6), P.iceM, mix(P.furD, P.ice, 0.4)] : o.state === 'singed' ? [P.charD, P.char, P.charL, '#2a2220'] : [P.furD, P.fur, P.furL, P.grey]);
  const order = [...Array(n).keys()].sort(() => f.r() - 0.5);
  for (const i of order) {
    const u = T * (i + 0.2 + f.r() * 0.6) / n, a = V0.at(C, S, u), l = V0.R(f, l0, l1) * (o.state === 'singed' ? 0.55 : 1), ww = w * (0.75 + f.r() * 0.5);
    const sw = (f.r() - 0.5) * (o.sway ?? 0.35), d = rot(d0, sw), side = [-d[1], d[0]], bend = (f.r() - 0.5) * l * 0.25;
    const root = add(a.p, mul(d, -ww * 0.3));
    const path = [root, add(add(root, mul(d, l * 0.35)), mul(side, bend * 0.4)), add(add(root, mul(d, l * 0.7)), mul(side, bend)), add(add(root, mul(d, l)), mul(side, bend * (o.state === 'ice' ? 0.6 : 1.4)))];
    if (o.state === 'singed') path[3] = add(path[2], add(mul(d, l * 0.18), mul(side, (bend > 0 ? 1 : -1) * l * 0.2)));
    hairClump(f, path, ww, { pal, n: o.strands || 3, gap: o.gap });
    const tip = path[path.length - 1]; tips.push(tip);
    if (o.state === 'ice' && f.r() < (o.icicleK ?? 0.5)) V0.icicle(f, add(tip, [0, -3]), V0.R(f, 6, 16) * (o.icS || 1), Math.max(2.5, ww * 0.35), { drop: f.r() < 0.3 });
    if (o.state === 'singed' && f.r() < 0.5) f.flat(ell(tip, 1.8, 1.4, 0, 6), f.r() > 0.5 ? P.lampL : P.lamp, { op: 0.9 });
  }
  return tips;
}
// a small, dark animal eye set deep under the brow: socket shadow, a dark almond with a wet glint, the brow above.
// c: eye centre, s: eye length, a: head angle. o.frost: rime on the lashes; o.ember: a dull ember sheen (burnt side).
function animalEye(f, c, s, a, o = {}) {
  const F = pts => pts.map(p => add(c, rot([p[0] * s, p[1] * s], a)));
  f.flat(F([[-0.95, -0.15], [-0.4, -0.7], [0.4, -0.72], [1.0, -0.2], [0.7, 0.45], [-0.5, 0.5]]), '#120c0c', { op: 0.55 });
  f.flat(F([[-0.55, 0.02], [-0.1, -0.3], [0.45, -0.24], [0.62, 0.04], [0.15, 0.24], [-0.35, 0.2]]), '#0c0808');
  f.flat(F([[-0.3, -0.02], [0.05, -0.18], [0.35, -0.12], [0.1, 0.04]]), o.ember ? '#5a2410' : '#2a2226', { op: 0.9 });
  f.flat(ell(F([[0.12, -0.12]])[0], s * 0.08, s * 0.06, a, 6), o.ember ? P.lampL : '#d8dcdc', { op: 0.85 });
  f.stroke(F([[-0.9, -0.42], [-0.2, -0.78], [0.55, -0.7], [1.05, -0.4]]), Math.max(2, s * 0.32), '#141010', { op: 0.85 });
  if (o.frost) f.line(F([[-0.6, -0.5], [0.0, -0.72], [0.6, -0.6]]), 1, P.rime, { op: 0.8 });
}
// a part drawn wholly on the frozen side: the rimed look, rime specks, faceted planes, frost cracks
function iced(f, pts, look, o = {}) {
  const d = f.part(pts, look), bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], rx = (bb[2] - bb[0]) / 2, ry = (bb[3] - bb[1]) / 2;
  V0.clipDraw(f, d, () => {
    f.raw(`<rect x="${(bb[0] - 10).toFixed(1)}" y="${(bb[1] - 10).toFixed(1)}" width="${(bb[2] - bb[0] + 20).toFixed(1)}" height="${(bb[3] - bb[1] + 20).toFixed(1)}" fill="url(#rime${f.o.seed})" opacity="${o.rimeOp ?? 0.5}"/>`);
    if (o.facets !== false) V0.facets(f, c, rx, ry, o.nFacets ?? Math.max(2, Math.round(rx * ry / 1800)), { op: 0.28, s: o.fs || 1 });
    if (o.cracks) V0.frostCracks(f, c, rx, ry, o.cracks);
    if (o.after) o.after(d);
  });
  return d;
}
// a part drawn wholly on the burnt side: the charred look, craze, embers, a few glowing seams
function burnt(f, pts, look, o = {}) {
  const d = f.part(pts, look), bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], rx = (bb[2] - bb[0]) / 2, ry = (bb[3] - bb[1]) / 2;
  V0.clipDraw(f, d, () => {
    f.raw(`<rect x="${(bb[0] - 10).toFixed(1)}" y="${(bb[1] - 10).toFixed(1)}" width="${(bb[2] - bb[0] + 20).toFixed(1)}" height="${(bb[3] - bb[1] + 20).toFixed(1)}" fill="url(#craze${f.o.seed})" opacity="${o.crazeOp ?? 0.8}"/>`);
    if (o.nEmbers !== 0) V0.embers(f, c, rx, ry, o.nEmbers ?? Math.max(2, Math.round(rx * ry / 1500)));
    for (let i = 0; i < (o.seams ?? 0); i++) V0.crackNet(f, V0.scatter(f, c, rx * 0.8, ry * 0.8), f.r() * 6.3, V0.R(f, 0.6, 1.1) * Math.min(rx, ry) * 1.4, o.seamW ?? 2, { depth: 1, fork: 0.5 });
    if (o.after) o.after(d);
  });
  return d;
}
// a split line from a list of control points: jagged, with the ice on the side toward `iceToward` (a screen vector)
function splitLine(f, ctl, iceToward, amp = 7, step = 13) {
  const line = V0.jag(f, ctl, amp, step), d = E.norm(sub(line[line.length - 1], line[0])), n = [d[1], -d[0]];
  return { line, ice: (n[0] * iceToward[0] + n[1] * iceToward[1]) > 0 ? 1 : -1, dir: E.norm(iceToward) };
}
// a squared timber from a to b, width w: split grain, a dark end-grain face at each end (o.ends), adze marks,
// o.state 'ice' (rime on top, icicles under) or 'char' (charred, alligatored, glowing in the checks)
function timber(f, a, b, w, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], h = w / 2;
  const pts = [add(a, mul(n, h)), add(b, mul(n, h * (0.92 + f.r() * 0.12))), add(b, mul(n, -h)), add(a, mul(n, -h * (0.9 + f.r() * 0.15)))].map(q => [...q, 1]);
  const base = o.state === 'char' ? V0.charred({ fill: P.wood, shadow: P.woodD }, 0.55) : o.state === 'ice' ? V0.rimed({ fill: P.wood, shadow: P.woodD }, 0.32) : { fill: P.wood, shadow: P.woodD };
  const look = Object.assign({ shade: 0.4, tex: 'grain' + f.o.seed, texOp: 0.75, inkW: o.inkW ?? 1.5, maxShade: o.maxShade ?? 40 }, base, o.look || {});
  const dd = f.part(pts, look);
  V0.clipDraw(f, dd, () => {
    for (let i = 0; i < Math.max(1, Math.round(E.len(sub(b, a)) / 90)); i++) { const t = (i + 0.3 + f.r() * 0.4) / Math.max(1, Math.round(E.len(sub(b, a)) / 90)); f.line([lp(a, b, t, (f.r() - 0.5) * w * 0.6), lp(a, b, t + 0.04, (f.r() - 0.5) * w * 0.6)], 1, INK, { op: 0.5 }); } // checks and adze marks
    if (o.state === 'char') { f.raw(`<path d="${E.smooth(pts)}" fill="url(#craze${f.o.seed})" opacity="0.9"/>`); for (let i = 0; i < 2; i++) V0.seam(f, [lp(a, b, 0.2 + i * 0.4, -h * 0.2), lp(a, b, 0.3 + i * 0.4, h * 0.1), lp(a, b, 0.38 + i * 0.4, -h * 0.1)], Math.max(1, w * 0.05)); }
    if (o.state === 'ice') f.raw(`<path d="${E.smooth(pts)}" fill="url(#rime${f.o.seed})" opacity="0.6"/>`);
  });
  if (o.ends !== false) for (const [p, s] of [[a, -1], [b, 1]]) if (o.ends === undefined || o.ends === (s < 0 ? 'a' : 'b') || o.ends === true) { const q = add(p, mul(d, s * 1)); f.part([add(q, mul(n, h)), add(add(q, mul(n, h * 0.8)), mul(d, s * w * 0.18)), add(add(q, mul(n, -h * 0.9)), mul(d, s * w * 0.16)), add(q, mul(n, -h))], { fill: mix(base.fill, '#000', 0.25), shade: 0.3, inkW: 1.1, cast: false, tex: 'grain' + f.o.seed, texOp: 0.4 }); }
  if (o.state === 'ice' && o.crust !== false) { const up = n[1] < 0 ? 1 : -1; V0.rimeCrust(f, [add(a, mul(n, h * up)), add(b, mul(n, h * up))], Math.max(4, w * 0.22), [-0.8, -0.6], { gap: 7 }); }
  return dd;
}
// tally marks cut into a surface: groups of four strokes with a fifth across, n marks, along direction a
function tally(f, p, n, s, a = 0, col = INK) {
  for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5, q = add(p, rot([g * s * 1.5 + k * s * 0.24, 0], a)); if (k < 4) { f.line([q, add(q, rot([s * 0.05, s * 0.6], a))], Math.max(1.2, s * 0.08), col, { op: 0.85 }); f.line([add(q, [1, 0]), add(q, rot([s * 0.05 + 1, s * 0.6], a))], 0.8, P.iceL, { op: 0.4 }); } else { const q0 = add(p, rot([g * s * 1.5 - s * 0.08, s * 0.42], a)); f.line([q0, add(q0, rot([s * 0.9, -s * 0.28], a))], Math.max(1.2, s * 0.08), col, { op: 0.85 }); } }
}
// obsidian rubble: a scatter of chipped black glass lumps sitting on a ground line
function rubble(f, x0, x1, y, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * (i + f.r() * 0.8) / n, r = V0.R(f, 8, 22) * s, h = r * V0.R(f, 0.6, 1.0);
    const pts = [[x - r, y + 2, 1], [x - r * 0.8, y - h * 0.6, 1], [x - r * 0.1, y - h, 1], [x + r * 0.7, y - h * 0.7, 1], [x + r, y + 2, 1]];
    V0.glassPlate(f, pts, { inkW: 1.1, inkH: 1.6, chip: f.r() < 0.5 });
  }
}

// a crack along a closed (or open) boundary between a burnt zone and the ice round it: glow, a char lip inside, a rime lip
// outside, the seam, and short branches. `inside` is a point in the burnt zone (sets which way is out).
function ringRift(f, loop, inside, w = 3, o = {}) {
  const L = loop, outN = (i) => { const a = L[Math.max(0, i - 1)], b = L[Math.min(L.length - 1, i + 1)], t = E.norm(sub(b, a)); let n = [t[1], -t[0]]; const v = sub(L[i], inside); if (n[0] * v[0] + n[1] * v[1] < 0) n = mul(n, -1); return n; };
  if (!o.faint) V0.glowLine(f, L, w * 5, P.lamp, 0.22);
  f.line(L.map((p, i) => add(p, mul(outN(i), w * 1.1))), w * 0.9, P.rime, { op: 0.65 });
  f.line(L.map((p, i) => add(p, mul(outN(i), -w * 1.2))), w * 1.4, P.charS, { op: 0.8 });
  if (o.faint) { f.line(L, w * 1.2, P.charS, { op: 0.85 }); for (let i = 1; i < L.length - 2; i += 3) if (f.r() < 0.75) V0.seam(f, [L[i], L[i + 1], L[Math.min(L.length - 1, i + 2)]], w * 0.55, { glow: false }); }
  else V0.seam(f, L, w, { glow: false });
  for (let i = 2; i < L.length - 2; i += 3) {
    const n = outN(i), t = E.norm(sub(L[i + 1], L[i - 1]));
    const it = add(add(L[i], mul(n, V0.R(f, 8, 18) * w / 3)), mul(t, V0.R(f, -6, 6)));
    f.line([L[i], lerp(L[i], it, 0.5).map(v => v + (f.r() - 0.5) * 3), it], 1, INK, { op: 0.7 });
    if (!o.faint && f.r() < 0.6) { const ct = add(add(L[i + 1], mul(n, -V0.R(f, 8, 18) * w / 3)), mul(t, V0.R(f, -6, 6))); V0.seam(f, [L[i + 1], lerp(L[i + 1], ct, 0.5), ct], w * 0.4, { glow: false }); }
  }
}
// a part rimed all over except a burnt zone (region polygon, already jagged); the crack runs along the zone's edge
// inside the part. o.iceO / o.charO: options for iced() / burnt().
function zone(f, pts, iceLook, charLook, region, o = {}) {
  const d = iced(f, pts, iceLook, o.iceO || {});
  const c = region.reduce((a, p) => add(a, mul(p, 1 / region.length)), [0, 0]);
  V0.clipDraw(f, region, () => burnt(f, pts, charLook, Object.assign({}, o.charO || {})));
  if (o.rift !== false) V0.clipDraw(f, d, () => ringRift(f, region.concat([region[0]]), o.inside || c, o.riftW ?? 3, { faint: o.faint }));
  return d;
}
// a jagged closed loop from control points (for zone regions)
function jagLoop(f, ctl, amp = 7, step = 12) { const l = V0.jag(f, ctl.concat([ctl[0]]), amp, step); l.pop(); return l; }

// steam or smoke rising from p0 as soft blurred lobes only (no defining line, so it can never read as a bolt)
function puff(f, p0, h, w, o = {}) {
  const n = o.n || 4, col = o.col || P.steam;
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, c = add(p0, [Math.sin(t * 3 + (o.phase || 0)) * (o.sway ?? 8) + (o.drift || 0) * t, -h * t]), r = w * (0.4 + t * 0.7); f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${(r * 0.8).toFixed(1)}" ry="${(r * 1.2).toFixed(1)}" fill="${col}" opacity="${((o.op ?? 0.3) * (1 - t * 0.5)).toFixed(2)}" filter="url(#${o.big ? 'smkL' : 'smk'}${f.o.seed})"/>`); }
}

// crazing over a drawn part (clip d, bounding box bb): a jittered cell net like crackled glaze. Each cell is either left
// rimed (the part's own look) or singed: charred over with a glowing rim (a fraction k of them). Every edge is a fine
// crack, glowing where it borders a singed cell; o.wide(p) > 1 widens the crack at a point (joints, ears).
function crazing(f, d, bb, cell, k = 0.4, o = {}) {
  const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, R0 = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2 + cell, nx = Math.ceil(R0 * 2 / cell) + 1, ny = nx, G = [], ra = o.rot ?? 0.55;
  for (let j = 0; j < ny; j++) { G.push([]); for (let i = 0; i < nx; i++) { const u = -R0 + i * cell + (j % 2) * cell * 0.5 + (f.r() - 0.5) * cell * 0.85, v = -R0 + j * cell * 0.86 + (f.r() - 0.5) * cell * 0.85; G[j].push(add([cx, cy], rot([u, v], ra))); } }
  const hot = []; for (let j = 0; j < ny - 1; j++) { hot.push([]); for (let i = 0; i < nx - 1; i++) hot[j].push(o.hotAt ? o.hotAt(G[j][i], f.r()) : f.r() < k); }
  V0.clipDraw(f, d, () => {
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) if (hot[j][i]) {
      const c = [G[j][i], G[j][i + 1], G[j + 1][i + 1], G[j + 1][i]], m = c.reduce((a, p) => add(a, mul(p, 0.25)), [0, 0]), cs = c.map(p => lerp(p, m, 0.08));
      f.flat(cs, o.char || '#2e2420', { op: 0.92 });
      f.flat(cs.map(p => lerp(p, m, 0.3)), o.charL || '#3e302a', { op: 0.5 });
      if (f.r() < 0.15) f.flat(ell(lerp(m, cs[Math.floor(f.r() * 4)], 0.7), 1.3, 1, 0, 6), P.lampL, { op: 0.9 });
      f.line(cs.concat([cs[0]]), 1.4, P.ember, { op: 0.7 });
    }
    const edge = (a, b, hotEdge) => { const w = (o.wide ? o.wide(lerp(a, b, 0.5)) : 1); const mid = add(lerp(a, b, 0.5), [(f.r() - 0.5) * 2, (f.r() - 0.5) * 2]); f.line([a, mid, b], 1.2 * w, P.charS, { op: 0.8 }); if (hotEdge || w > 1.3) f.line([a, mid, b], 0.8 * w, w > 1.3 ? P.lamp : P.lampL, { op: 0.85 }); };
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx - 1; i++) edge(G[j][i], G[j][i + 1], (hot[j] && hot[j][i]) || (hot[j - 1] && hot[j - 1][i]));
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx; i++) edge(G[j][i], G[j + 1][i], (hot[j][i]) || (hot[j][i - 1]));
  });
}

// a miners' adit cut into ice skin: a tunnel mouth framed with two timber props and a lintel, charred inside and frosted
// outside, glowing molten orange from within (receding timber sets show the depth), ash curling up out of it, and
// cracks crazing out across the ice from its corners, glowing at their roots and white at their tips.
// c: centre of the opening, w/h: opening size, a: tilt of the frame (radians)
function adit(f, c, w, h, a = 0, o = {}) {
  const F = pts => pts.map(p => add(c, rot(p, a)));
  const open = F([[-w * 0.5, h * 0.5], [-w * 0.46, -h * 0.4], [-w * 0.3, -h * 0.5], [w * 0.32, -h * 0.5], [w * 0.47, -h * 0.38], [w * 0.5, h * 0.5]]);
  // the crazed cracks first, so the frame sits on them
  for (let i = 0; i < (o.cracks ?? 6); i++) {
    const corner = F([[(i % 2 ? 1 : -1) * w * 0.55, (i % 3 - 1) * h * 0.45]])[0], ang0 = Math.atan2(corner[1] - c[1], corner[0] - c[0]) + (f.r() - 0.5) * 0.8;
    V0.crackNet(f, corner, ang0, V0.R(f, 0.5, 0.9) * w, Math.max(2, w * 0.018), { depth: 1, fork: 0.5 });
    let q = add(corner, rot([w * 0.5, 0], ang0)); const pts = [q]; for (let k = 0; k < 4; k++) { q = add(q, rot([V0.R(f, 20, 50) * w / 200, 0], ang0 + (f.r() - 0.5) * 1.2)); pts.push(q); }
    f.line(pts, Math.max(1.2, w * 0.008), INK, { op: 0.6 }); f.line(pts.map(z => add(z, [1, 1])), 1, P.iceL, { op: 0.7 }); // the white tips running on into the ice
  }
  V0.glow(f, c, w * 0.9, h * 0.8, P.lamp, 0.35, true);
  f.part(open.map(q => add(q, mul(sub(q, c), 0.16))), { fill: P.charS, shadow: '#000', shade: 0.3, inkW: 2, tex: 'craze' + f.o.seed, texOp: 0.8 }); // the charred lip round the mouth
  f.flat(open, '#1a0602');
  V0.glow(f, add(c, [0, h * 0.08]), w * 0.32, h * 0.3, P.lamp, 0.9);
  V0.glow(f, add(c, [0, h * 0.1]), w * 0.16, h * 0.14, P.hot, 0.9);
  // receding timber sets inside, black against the glow
  for (let k = 1; k <= 3; k++) { const s = 1 - k * 0.22, set = F([[-w * 0.36 * s, h * 0.42 * s], [-w * 0.36 * s, -h * 0.36 * s], [w * 0.36 * s, -h * 0.36 * s], [w * 0.36 * s, h * 0.42 * s]]).map(q => add(q, [0, h * 0.06 * k])); f.line(set, Math.max(3, w * 0.05 * s), '#100604', { op: 0.95 }); }
  f.flat(F([[-w * 0.5, h * 0.5], [w * 0.5, h * 0.5], [w * 0.3, h * 0.3], [-w * 0.3, h * 0.3]]), P.ember, { op: 0.5 }); // the floor of the gallery, glowing
  // the frame: two props and a lintel, rimed on their outer faces, charred on the inner
  const tw = Math.max(16, w * 0.13);
  const pl = F([[-w * 0.56, h * 0.56], [-w * 0.52, -h * 0.56]]), pr = F([[w * 0.56, h * 0.56], [w * 0.52, -h * 0.56]]), li = F([[-w * 0.7, -h * 0.58], [w * 0.7, -h * 0.6]]);
  for (const [a0, b0] of [pl, pr]) { timber(f, a0, b0, tw, { state: 'ice', ends: 'b', crust: false }); f.line([lp(a0, b0, 0.05, (b0 === pl[1] ? 1 : -1) * tw * 0.35), lp(a0, b0, 0.95, (b0 === pl[1] ? 1 : -1) * tw * 0.35)], tw * 0.3, P.charS, { op: 0.8 }); }
  timber(f, li[0], li[1], tw * 1.15, { state: 'ice', ends: true });
  f.line([lp(li[0], li[1], 0.15, tw * 0.4), lp(li[0], li[1], 0.85, tw * 0.4)], tw * 0.3, P.charS, { op: 0.8 });
  for (const q of [F([[-w * 0.52, -h * 0.58]])[0], F([[w * 0.52, -h * 0.58]])[0]]) f.rivet(q, Math.max(2.4, w * 0.02), P.ironL); // spikes pinning the lintel
  V0.icicles(f, [li[0], li[1]], Math.max(3, Math.round(w / 40)), w * 0.06, w * 0.16);
  V0.ash(f, F([[0, -h * 0.3]])[0], o.ash ?? 18, w * 0.6, h * 1.4, Math.max(1, w / 120));
  puff(f, F([[0, -h * 0.62]])[0], h * 1.2, w * 0.4, { op: 0.28, big: true, sway: w * 0.1 });
  return open;
}

module.exports = Object.assign({}, V0, { hank, underwool, resample, mass, bandHatch, wrapHatch, oldCrack, healedSeam, adit, crazing, puff, ringRift, zone, jagLoop, texturesB, offsetLine, hairClump, hanks, animalEye, iced, burnt, splitLine, timber, tally, rubble });
