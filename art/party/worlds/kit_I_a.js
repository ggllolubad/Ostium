// World I (The Drowned Kingdom) helpers for the ruler and elite set (world_I_a.js).
// Everything here matches the Drowned Thrall in dirAC2.js: same skin, shadow, lividity, barnacles, mussels, kelp,
// drips and void holes, so the rulers read as the same world. All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;

// world palette: deep blue-black, verdigris, drowned gold (tarnished), plus the Thrall's dead-skin set
const P = {
  skin: '#b6b6a4', skinS: '#6e6a7e', skinB: '#a9adb0', blotch: '#8a86a2', green: '#7a8c6c', lips: '#4f6a8e',
  kelp: '#262a16', kelpL: '#6a7040', kelpM: '#3a3f22', drip: '#9ec0d0', water: '#0b111a', waterM: '#16202c', waterL: '#3a4a4a',
  gold: '#8a7440', goldL: '#b39a5c', goldD: '#4a3c20', verd: '#4f8a76', verdL: '#86b3a2', verdD: '#28463c',
  bronze: '#6a5434', bronzeL: '#8e7650', velvet: '#22305a', velvetD: '#141c36', iron: '#3c3a3a', ironL: '#5c5856', rust: '#6a4632',
  bone: '#d6cdb8', boneD: '#9a917e', stone: '#5e625e', stoneL: '#7a7e78', stoneD: '#3a3e3c', void: '#06050a', voidV: '#2a1c44',
  linen: '#a8a696', linenD: '#6e6e62', ermine: '#8e8c84', ermineD: '#5e5c56',
};

// the world's render setup: kit.foeBase plus the Thrall's cool shadow tint and silt-green mud; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - 240, shadowTint: '#2a2a38', mud: '#1e2a24' }, o));

// dead skin look (Thrall): explicit violet-grey shadow so it reads as flesh, not steel
const SK = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.3, tex: 'mottle' + f.o.seed, texOp: 0.6 }, o);
const rnd = (f, a, b) => a + (b - a) * f.r();

// lividity blotches and marbled veins inside a skin region
function livid(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.flat(ell(p, (3 + f.r() * 7) * s, (2 + f.r() * 4) * s, f.r() * 3, 8), f.r() > 0.45 ? P.blotch : P.green, { op: 0.4 }); } }
function veins(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.line([p, add(p, [(3 + f.r() * 6) * s, (5 + f.r() * 5) * s]), add(p, [f.r() * 12 * s, (12 + f.r() * 8) * s]), add(p, [(f.r() * 16 - 4) * s, (22 + f.r() * 10) * s])], 0.9 + s * 0.3, '#57527e', { op: 0.6 }); } }
// peeling skin flakes
function peel(f, c, n, s = 1, spread = 22) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * spread, (f.r() - 0.5) * spread * 0.8]); f.flat([p, add(p, [7 * s, -2 * s]), add(p, [9 * s, 3 * s]), add(p, [3 * s, 4 * s])], '#e2e0d2', { op: 0.85 }); f.line([p, add(p, [7 * s, -2 * s])], 0.8, INK, { op: 0.6 }); } }
// wrinkled, water-puckered skin: short parallel creases along a direction
function pucker(f, c, ang, n, len, gap, col = INK, op = 0.45) { const d = rot([1, 0], ang), nn = [-d[1], d[0]]; for (let i = 0; i < n; i++) { const o = add(c, mul(nn, (i - n / 2) * gap)); f.line([add(o, mul(d, -len / 2)), add(add(o, mul(d, 0)), mul(nn, 1.5)), add(o, mul(d, len / 2))], 0.9, col, { op }); } }
// barnacles: low irregular cones in clusters, a dark slit at the top, never neat teeth
function barnacle(f, c, r) { const j = () => (f.r() - 0.5) * r * 0.5; f.part([add(c, [-r + j(), r * 0.4]), add(c, [-r * 0.5 + j(), -r * 0.35 + j()]), add(c, [r * 0.4 + j(), -r * 0.45 + j()]), add(c, [r + j(), r * 0.4])], { fill: mix('#a9a596', '#6e6a5e', f.r() * 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.9, hatch: false }); f.line([add(c, [-r * 0.3, -r * 0.3]), add(c, [r * 0.25, -r * 0.35])], Math.max(1.4, r * 0.18), '#1c1a1a'); }
function barnacles(f, c, rx, ry, n, r0, r1) { const pts = []; for (let i = 0; i < n; i++) pts.push([add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]), rnd(f, r0, r1)]); pts.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => barnacle(f, p, r)); }
function mussel(f, c, a, s = 1) { f.part(ell(c, 7 * s, 3.6 * s, a, 10), { fill: '#1d2332', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false }); f.line([add(c, rot([-5 * s, -1 * s], a)), add(c, rot([5 * s, -1 * s], a))], 0.9, '#6a7a9a', { op: 0.7 }); }
// drips of water, a falling drop under a point
function drip(f, p, s = 1) { f.flat([add(p, [-1.6 * s, 0]), add(p, [1.6 * s, 0]), add(p, [0, 7 * s])], P.drip, { op: 0.8 }); f.flat(ell(add(p, [0, 12 * s]), 2 * s, 3.4 * s, 0, 6), P.drip, { op: 0.85 }); }
// rising bubbles (hollow rings with a glint)
function bubbles(f, p, n, spread = 30, rise = 160, s = 1) { for (let i = 0; i < n; i++) { const q = add(p, [(f.r() - 0.5) * spread + Math.sin(i * 1.7) * 6, -i * rise / n - f.r() * 10]), r = (2 + f.r() * 4 + (n - i) * 0.4) * s; const e = ell(q, r, r, 0, 10); f.line(e.concat([e[0]]), 1.2, '#c8dce6', { op: 0.8 }); f.flat(ell(add(q, [-r * 0.35, -r * 0.35]), r * 0.25, r * 0.25, 0, 6), '#eef', { op: 0.85 }); } }
// a kelp strand along a polyline: tapered brush stroke plus a lit edge
function kelpStrand(f, pts, w, col = P.kelp, lit = P.kelpL) { f.stroke(pts, w, col); f.line(pts.slice(0, Math.max(2, pts.length - 1)).map(q => add(q, [-w * 0.18, -w * 0.05])), Math.max(1, w * 0.1), lit, { op: 0.7 }); }
// a hanging kelp strand from p, falling plumb with a sway; returns its end
function kelpHang(f, p, len, w, sway = 0, o = {}) { const pts = [p, add(p, [sway * 0.4, len * 0.35]), add(p, [sway, len * 0.7]), add(p, [sway * 0.6, len])]; kelpStrand(f, pts, w, o.col, o.lit); if (o.drip !== false) drip(f, add(pts[3], [0, 2]), Math.max(0.8, w / 9)); return pts[3]; }
// a kelp frond: a flat ribbon with a crinkled edge, from a to b
function frond(f, a, b, w, col = P.kelpM) {
  const n = 9, d = E.norm(sub(b, a)), nn = [-d[1], d[0]], L = [], R = [];
  for (let i = 0; i <= n; i++) { const t = i / n, c = lerp(a, b, t), ww = w * Math.sin(Math.PI * (0.1 + 0.85 * t)) * 0.5 * (1 + 0.25 * Math.sin(i * 2.3)); const sw = mul(nn, Math.sin(t * 5 + w) * w * 0.4); L.push(add(add(c, sw), mul(nn, ww))); R.push(add(add(c, sw), mul(nn, -ww))); }
  f.part([...L, ...R.reverse()], { fill: col, shadow: '#101408', shade: 0.4, inkW: 1.1, inkHeavy: 1.8, cast: false, tex: 'hatch' + f.o.seed, texOp: 0.25 });
  f.line([a, lerp(a, b, 0.5), b], 1, P.kelpL, { op: 0.5 });
}
// a clean-rimmed void hole: pale rim, black core, faint violet heart, faint glow behind
function voidHole(f, c, rx, ry, ang = 0, o = {}) {
  if (o.glow !== false) f.raw(`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx * 1.45}" ry="${ry * 1.45}" transform="rotate(${ang * 57.3} ${c[0]} ${c[1]})" fill="#6a4aa0" opacity="0.24" filter="url(#soft${f.o.seed})"/>`);
  f.part(ell(c, rx, ry, ang, 24), { fill: o.rim || '#e8e2d8', shade: 0.2, inkW: 1.4, inkHeavy: 1.4, cast: false, hatch: false });
  f.flat(ell(add(c, [rx * 0.03, ry * 0.05]), rx * 0.82, ry * 0.8, ang, 24), P.void);
  f.flat(ell(add(c, [rx * 0.12, ry * 0.12]), rx * 0.34, ry * 0.32, ang, 14), P.voidV, { op: 0.9 });
}
// branching coral: bone-white or verdigris, knobbly tips, grows from base along ang (radians, screen), size s
function coral(f, base, ang, s, col = '#c9c2ae', depth = 3) {
  const br = (p, a, l, w, d) => {
    const q = add(p, rot([l, 0], a));
    f.part(limb(p, q, w, w * 0.72, { steps: 5, capK: 1 }), { fill: col, shade: 0.45, inkW: 1, inkHeavy: 1.6, cast: false, hatch: d > 1, k: 1 });
    if (d > 0) { br(lerp(p, q, 0.7), a - 0.55 - f.r() * 0.3, l * 0.62, w * 0.7, d - 1); br(q, a + 0.35 + f.r() * 0.3, l * 0.66, w * 0.72, d - 1); }
    else for (let i = 0; i < 2; i++) f.flat(ell(add(q, [(f.r() - 0.5) * w, (f.r() - 0.5) * w]), w * 0.18, w * 0.18, 0, 6), mix(col, '#000', 0.5), { op: 0.7 });
  };
  br(base, ang, s, s * 0.32, depth);
}
// coral crust: a lumpy encrusted patch (knobs and pits), for stone and metal
function crust(f, c, rx, ry, n, col = '#b8b29e') {
  for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]), r = 3 + f.r() * Math.min(rx, ry) * 0.25; f.part(ell(p, r * 1.2, r, f.r() * 3, 9), { fill: mix(col, P.verd, f.r() * 0.4), shade: 0.5, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); f.flat(ell(add(p, [r * 0.2, r * 0.1]), r * 0.3, r * 0.25, 0, 6), '#1c1a18', { op: 0.75 }); }
}
// verdigris bloom: flat soft patches of green on metal
function verdigris(f, c, rx, ry, n, op = 0.55) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.flat(ell(p, 4 + f.r() * rx * 0.3, 3 + f.r() * ry * 0.25, f.r() * 3, 10), f.r() > 0.3 ? P.verd : P.verdL, { op: op * (0.6 + f.r() * 0.5) }); } }
// a ring of ripples on a water surface (flat ellipses)
function ripples(f, c, rx, ry, n, col = '#7a98a8', op = 0.45) { for (let i = 0; i < n; i++) { const k = 1 + i * 0.28, e = ell(c, rx * k, ry * k, 0, 28), s0 = Math.floor(f.r() * 8), seg = e.slice(s0, s0 + 12 + Math.floor(f.r() * 8)); f.line(seg, 1.4, col, { op: op * (1 - i / (n + 1)) }); } }
// one iron chain link, centre c, along direction ang, length l, face-on (open ring) or edge-on (bar)
function link(f, c, ang, l, w, faceOn, col = P.iron) {
  if (faceOn) {
    // stud-link anchor chain: a long oval ring with a bar across its middle
    const ry = l * 0.34, o = ell(c, l / 2, ry, ang, 20), i = ell(c, l / 2 - w * 0.9, ry - w * 0.8, ang, 20);
    f.part(E.smooth(o) + ' ' + E.smooth(i.slice().reverse()), { bbPts: o, fill: col, shade: 0.45, inkW: 1.3, inkHeavy: 2.2, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.6 });
    f.part(limb(add(c, rot([0, -ry + w * 0.5], ang)), add(c, rot([0, ry - w * 0.5], ang)), w * 0.7, w * 0.7, { steps: 3 }), { fill: mix(col, '#000', 0.1), shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false });
    f.line([add(c, rot([-l * 0.3, -ry * 0.75], ang)), add(c, rot([l * 0.1, -ry * 0.85], ang))], 1.2, mix(col, '#fff', 0.4), { op: 0.6 });
  } else {
    f.part(limb(add(c, rot([-l / 2 + w * 0.5, 0], ang)), add(c, rot([l / 2 - w * 0.5, 0], ang)), w * 1.15, w * 1.15, { steps: 4, capK: 1 }), { fill: mix(col, '#000', 0.12), shade: 0.45, inkW: 1.3, inkHeavy: 2.2, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.6 });
  }
  f.flat(ell(add(c, rot([-l * 0.15, -w * 0.3], ang)), l * 0.12, w * 0.2, ang, 8), '#8a4a22', { op: 0.55 }); // rust bloom
}
// a chain along a polyline: alternating face-on and edge-on links
function ironChain(f, pts, l, w, col = P.iron, o = {}) {
  const segs = []; let acc = 0; for (let i = 0; i < pts.length - 1; i++) { const L = E.len(sub(pts[i + 1], pts[i])); segs.push([pts[i], pts[i + 1], acc, L]); acc += L; }
  const n = Math.floor(acc / (l * 0.78)), at = s => { for (const [a, b, a0, L] of segs) if (s <= a0 + L) return [lerp(a, b, (s - a0) / L), Math.atan2(b[1] - a[1], b[0] - a[0])]; const [a, b] = segs[segs.length - 1]; return [b, Math.atan2(b[1] - a[1], b[0] - a[0])]; };
  const out = [];
  for (let k = 0; k < n; k++) { const [c, a] = at(l * 0.5 + k * l * 0.78); out.push([c, a, k % 2 === (o.phase || 0)]); }
  // edge-on links first so the face-on rings sit over them
  for (const [c, a, face] of out) if (!face) link(f, c, a, l, w, false, col);
  for (const [c, a, face] of out) if (face) link(f, c, a, l, w, true, col);
  return out;
}
// rope wraps across a limb between a and b (bands at the given t values), with a frayed loose end
function ropeWrap(f, a, b, ts, w, col = '#7a6a48') {
  for (const t of ts) { const p = lp(a, b, t, w / 2 + 2), q = lp(a, b, t + 0.012, -w / 2 - 2); f.line([p, q], 5, mix(col, '#000', 0.3), { straight: true }); f.line([p, q], 3, col, { straight: true }); f.line([lerp(p, q, 0.2), lerp(p, q, 0.5)], 1, '#c8b890', { op: 0.6, straight: true }); }
}
// a little drowned face pressed into a surface (relief): uses B.head at size H, then sinks its edge into `col` (the host material)
function sunkFace(f, c, H, ang, col, o = {}) {
  B.head(f, c, H, ang, Object.assign({ skin: o.skin || P.skin, jaw: 1.2, mouth: 'set', squint: -0.3, faceShade: 0.6, jawShade: 0.3, iris: '#c8cec6', eyeWhite: '#e4e6de', noEar: true, browCol: '#4a5240' }, o.head || {}));
  const hF = frame(c, ang, H);
  // open mouth
  f.flat(hF([[0.17, 0.25], [0.25, 0.24], [0.31, 0.26], [0.3, 0.38], [0.24, 0.43], [0.18, 0.39]]), P.lips);
  f.flat(hF([[0.19, 0.28], [0.25, 0.27], [0.29, 0.29], [0.28, 0.36], [0.23, 0.4], [0.2, 0.36]]), '#0c1012');
  // the host material closing over the back of the skull: a ring of metal/stone lapping onto the face edge
  const lap = hF([[-0.44, -0.5], [0.08, -0.62], [0.4, -0.48], [0.3, -0.36], [0.04, -0.44], [-0.2, -0.3], [-0.26, 0.1], [-0.14, 0.4], [0.1, 0.58], [0.34, 0.52], [0.36, 0.62], [-0.08, 0.7], [-0.42, 0.46], [-0.5, 0.0]]);
  f.part(lap, { fill: col, shade: 0.45, inkW: 0.6, inkHeavy: 0, cast: false, tex: o.tex, texOp: 0.5, k: 1 });
  f.line(hF([[0.3, -0.38], [0.04, -0.46], [-0.2, -0.3], [-0.26, 0.1], [-0.14, 0.4], [0.1, 0.58], [0.34, 0.52]]), 2, INK, { op: 0.8 }); // the seam where face meets metal
  for (let i = 0; i < 4; i++) f.line(hF([[-0.36 + i * 0.08, -0.05 - i * 0.1], [-0.16 + i * 0.1, -0.4 - i * 0.02]]), 1.2, INK, { op: 0.45 }); // hair cast in the metal
  return hF;
}

// a tapered tube through joint points with a rounded far end and an open (hidden) base: one outline for a whole
// finger, so the joints read as creases on one limb, not as a string of capped sausages
function tube(pts, ws, capK = 0.9) {
  const o = K.chain(pts, ws, { steps: 6 }), n = o.length / 2, P = o.slice(0, n), Q = o.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = ws[ws.length - 1] / 2, cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(b, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * capK)))); }
  return [...P, ...cap, ...Q];
}
// washerwoman skin: short wavy ridges running along a fingertip pad
function prune(f, a, b, w, n, op = 0.5) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
  for (let i = 0; i < n; i++) { const o = (i / (n - 1) - 0.5) * w * 0.7, p0 = add(a, mul(nn, o)), p1 = add(b, mul(nn, o * 0.8)); f.line([p0, add(lerp(p0, p1, 0.33), mul(nn, 1.6)), add(lerp(p0, p1, 0.66), mul(nn, -1.6)), p1], 0.9, INK, { op }); }
}
// A big swollen open hand for the drowned giants. c: wrist, ang: wrist to middle knuckle (screen radians),
// s: hand length (wrist to middle fingertip). Local u runs along the hand, v across it, +v is the thumb side
// (o.flip puts it on -v). o.back shows the back of the hand (nails, knuckles, tendons) instead of the palm.
// Fingers fan in the picture plane (o.spread); bending toward or away from the viewer shows only as foreshortening
// (o.curl 0..1), never as a sideways bend, because fingers only flex toward the palm.
function openHand(f, c, ang, s, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(c, ang, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg]));
  const back = !!o.back, look = o.look, sp = o.spread ?? 0.14, cu = o.curl ?? 0.2, sw = 1 + (o.swell ?? 0.25);
  const sh = look.shadow || mix(look.fill, '#000', 0.4), dk = mix(sh, '#000', 0.3), lt = mix(look.fill, '#fff', 0.45);
  const part = (q, st) => f.part(q, Object.assign({}, look, { cast: false }, st || {}));
  // little, ring, middle, index: knuckle [u, v], length, base width (in hand lengths)
  const FG = [[0.405, -0.17, 0.4, 0.088], [0.45, -0.062, 0.5, 0.097], [0.465, 0.048, 0.545, 0.1], [0.44, 0.158, 0.49, 0.097]];
  const fing = FG.map(([u, v, L, w], i) => {
    const a = (i - 1.9) * sp + (o.bend || [0, 0, 0, 0])[i], d = [Math.cos(a), Math.sin(a)], k0 = [u, v];
    const l1 = L * 0.46, l2 = L * 0.3 * (1 - cu * 0.45), l3 = L * 0.24 * (1 - cu * 0.62);
    const k1 = add(k0, mul(d, l1)), k2 = add(k1, mul(d, l2)), k3 = add(k2, mul(d, l3)), W = w * sw;
    return { k0: F([k0])[0], k1: F([k1])[0], k2: F([k2])[0], k3: F([k3])[0], kb: F([add(k0, mul(d, -0.05))])[0], W: W * s, cut: (o.cut || [])[i] };
  });
  const thB = [0.07, 0.19], ta = (o.thumbAng ?? 0.9), td = [Math.cos(ta), Math.sin(ta)], th1 = add(thB, mul(td, 0.24)), td2 = [Math.cos(ta - 0.25), Math.sin(ta - 0.25)], th2 = add(th1, mul(td2, 0.2 * (1 - cu * 0.3)));
  const thumb = () => {
    part(tube([F([add(thB, mul(td, -0.06))])[0], F([th1])[0], F([th2])[0]], [0.15 * sw * s, 0.125 * sw * s, 0.105 * sw * s]), { inkW: 1.5, inkHeavy: 2.2 });
    const a = F([th1])[0], b = F([th2])[0], ww = 0.11 * sw * s;
    f.line([lp(a, b, -0.04, ww * 0.55), lp(a, b, 0.02, 0), lp(a, b, -0.04, -ww * 0.55)], 1.6, dk, { op: 0.75 });
    if (back) nail(a, b, ww); else { f.flat(ell(lp(a, b, 0.62, 0), ww * 0.42, ww * 0.34, Math.atan2(b[1] - a[1], b[0] - a[0]), 10), lt, { op: 0.25 }); prune(f, lp(a, b, 0.45, 0), lp(a, b, 0.92, 0), ww, 4); }
  };
  // a thick, ridged, cracked nail on the distal segment (back view)
  const nail = (a, b, w) => {
    const q = [lp(a, b, 0.3, w * 0.3), lp(a, b, 0.86, w * 0.34), lp(a, b, 1.04, w * 0.1), lp(a, b, 1.04, -w * 0.12), lp(a, b, 0.86, -w * 0.34), lp(a, b, 0.3, -w * 0.28)];
    f.part(q, { fill: o.nail || '#5a6272', shadow: '#232a36', shade: 0.4, inkW: 1.2, inkHeavy: 1.8, cast: false, tex: look.tex, texOp: 0.5 });
    f.flat([lp(a, b, 0.3, w * 0.22), lp(a, b, 0.42, 0), lp(a, b, 0.3, -w * 0.2), lp(a, b, 0.36, 0)], '#c8ccc6', { op: 0.5 });
    for (const off of [-0.14, 0.08]) f.line([lp(a, b, 0.4, w * off), lp(a, b, 0.96, w * off * 1.1)], 0.8, INK, { op: 0.45 }); // ridges
    f.line([lp(a, b, 1.0, w * 0.05), lp(a, b, 0.78, w * 0.12), lp(a, b, 0.66, -w * 0.04)], 1.1, INK, { op: 0.8 }); // the crack
    f.line([lp(a, b, 0.32, w * 0.36), lp(a, b, 0.2, w * 0.5)], 1, lt, { op: 0.6 }); // lifted cuticle
  };
  const finger = g => {
    const ws = [g.W, g.W * 0.94, g.W * 0.86, g.W * 0.78];
    if (g.cut) { part(K.chain([g.kb, g.k1, lerp(g.k1, g.k2, g.cut)], ws.slice(0, 3)), { inkW: 1.5, inkHeavy: 2.2 }); return; }
    part(tube([g.kb, g.k1, g.k2, g.k3], ws), { inkW: 1.5, inkHeavy: 2.2 });
    for (const [k, w, pa, pb] of [[g.k1, ws[1], g.k0, g.k2], [g.k2, ws[2], g.k1, g.k3]]) {
      if (back) { // knuckle wrinkles: tight arcs of loose skin over the joint
        const dd = E.norm(sub(pb, pa)), nn = [-dd[1], dd[0]];
        for (let i = 0; i < 3; i++) { const c0 = add(k, mul(dd, (i - 1) * w * 0.15)); f.line([add(c0, mul(nn, -w * 0.34)), add(add(c0, mul(dd, -w * 0.09)), mul(nn, 0)), add(c0, mul(nn, w * 0.34))], i === 1 ? 1.4 : 1, INK, { op: 0.55 }); }
        f.flat(ell(k, w * 0.2, w * 0.14, Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), 8), lt, { op: 0.3 });
      } else { // flexion creases across the pad side
        const dd = E.norm(sub(pb, pa)), nn = [-dd[1], dd[0]];
        for (const off of [-0.05, 0.05]) f.line([add(add(k, mul(dd, off * w)), mul(nn, w * 0.42)), add(add(k, mul(dd, off * w + 1)), mul(nn, 0)), add(add(k, mul(dd, off * w)), mul(nn, -w * 0.42))], off < 0 ? 1.6 : 1.1, dk, { op: 0.8 });
      }
    }
    if (back) nail(g.k2, g.k3, ws[3]); else { f.flat(ell(lerp(g.k2, g.k3, 0.6), ws[3] * 0.32, ws[3] * 0.26, Math.atan2(g.k3[1] - g.k2[1], g.k3[0] - g.k2[0]), 10), lt, { op: 0.22 }); prune(f, lerp(g.k2, g.k3, 0.25), lerp(g.k2, g.k3, 0.95), ws[3], 4); prune(f, lerp(g.k1, g.k2, 0.25), lerp(g.k1, g.k2, 0.8), ws[2], 3, 0.35); }
    peel(f, lerp(g.k1, g.k2, 0.5), 1, 1.1, 10);
  };
  // the palm or the back of the hand: square, swollen, wider at the knuckles
  const palm = F([[-0.06, -0.15], [0.06, -0.2], [0.24, -0.215], [0.4, -0.22], [0.47, -0.13], [0.49, 0.0], [0.48, 0.12], [0.45, 0.21], [0.3, 0.24], [0.16, 0.26], [0.04, 0.23], [-0.06, 0.12]]);
  if (back) {
    thumb();
    part(palm, { inkW: 1.6, inkHeavy: 2.6 });
    fing.forEach(finger);
    // knuckle row: a bump over each knuckle head, tendons fanning back to the wrist, a vein
    fing.forEach(g => { f.flat(ell(g.k0, g.W * 0.34, g.W * 0.24, ang, 10), lt, { op: 0.35 }); f.line([lp(g.k0, g.k1, 0.05, g.W * 0.5), lp(g.k0, g.k1, -0.02, 0), lp(g.k0, g.k1, 0.05, -g.W * 0.5)], 1.2, dk, { op: 0.6 }); f.line([F([[0.04, 0.0]])[0], lerp(F([[0.04, 0.0]])[0], g.k0, 0.5), g.k0].map((q, i) => i === 1 ? add(q, mul(rot([0, 1], ang), sg * 4)) : q), 2.2, lt, { op: 0.4 }); f.line([F([[0.06, 0.012]])[0], lerp(F([[0.06, 0.012]])[0], g.k0, 0.94)], 1, dk, { op: 0.4 }); });
    f.line(F([[0.02, -0.1], [0.14, -0.04], [0.22, 0.06], [0.3, 0.04], [0.38, 0.12]]), 2.4, mix(sh, '#3a3a6a', 0.3), { op: 0.55 }); // a swollen vein
  } else {
    fing.forEach(finger);
    part(palm, { inkW: 1.6, inkHeavy: 2.6 });
    // finger-base pads, heel pads, the deep creases of a palm that has soaked for years
    fing.forEach(g => part(ell(lerp(g.k0, g.k1, 0.08), g.W * 0.48, g.W * 0.36, ang + Math.PI / 2, 12), { inkW: 1, inkHeavy: 1.2, maxShade: 8 }));
    part(F([[0.0, 0.04], [0.12, 0.02], [0.24, 0.12], [0.22, 0.24], [0.08, 0.26], [-0.04, 0.16]]), { inkW: 1.1, inkHeavy: 1.4, maxShade: 14 }); // thenar
    part(F([[0.04, -0.18], [0.24, -0.2], [0.3, -0.12], [0.16, -0.08], [0.02, -0.1]]), { inkW: 0.9, inkHeavy: 1.1, maxShade: 10 }); // hypothenar
    f.line(F([[0.36, -0.2], [0.33, -0.08], [0.36, 0.04], [0.42, 0.13]]), 2, dk, { op: 0.8 });
    f.line(F([[0.3, 0.2], [0.27, 0.06], [0.22, -0.06], [0.24, -0.18]]), 1.8, dk, { op: 0.75 });
    f.line(F([[0.3, 0.19], [0.18, 0.12], [0.06, 0.1], [0.0, 0.04]]), 1.8, dk, { op: 0.75 });
    for (let i = 0; i < 10; i++) { const q = F([[0.06 + f.r() * 0.36, -0.18 + f.r() * 0.36]])[0], a2 = ang + (f.r() - 0.5) * 1.2; f.line([q, add(q, rot([6 + f.r() * 10, 0], a2))], 0.8, INK, { op: 0.4 }); }
    thumb();
  }
  return { fing, thumb: [F([thB])[0], F([th1])[0], F([th2])[0]], F };
}

module.exports = { P, base, SK, rnd, livid, veins, peel, pucker, barnacle, barnacles, mussel, drip, bubbles, kelpStrand, kelpHang, frond, voidHole, coral, crust, verdigris, ripples, link, ironChain, ropeWrap, sunkFace, tube, prune, openHand };
