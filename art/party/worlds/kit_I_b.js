// World I (Drowned Kingdom), batch b: local helpers. Shared files stay frozen; everything new lives here.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp } = E;

// world palette (deep blue-black, verdigris, drowned gold) plus ink, bone and grey
const PAL = {
  bb: '#161c28', bbL: '#263142', verd: '#4c7f6e', verdL: '#79a596', gold: '#857340', goldL: '#ad9858', goldD: '#5a4c28',
  bone: '#d0c7b0', salt: '#dad6ca', grey: '#7a7c78', water: '#9ec0d0', rust: '#6a4632', rustL: '#8a5a3a',
  kelp: '#262a16', kelpL: '#6a7040', voidC: '#06050a', voidH: '#2a1c44', skin: '#b6b6a4', skinS: '#6e6a7e', blotch: '#8a86a2', green: '#7a8c6c',
};

// Author in human space (ground 790, a 1.0 human about 640 tall, centred near x 300) and map onto the tier canvas at the
// creature's true scale k. Ink widths and hatch spacing stay in canvas pixels, so the style matches the whole cast.
function space(k, X0, GY, cx = 300) {
  const Z = p => { const q = [X0 + (p[0] - cx) * k, GY - (790 - p[1]) * k]; return p[2] ? [q[0], q[1], 1] : q; };
  return { k, Z, ZZ: pts => pts.map(Z), W: w => w * k };
}

// barnacles: low irregular cones in clusters, dark slit at the top (same build as the Drowned Thrall's)
function barnacle(f, c, r) {
  const j = () => (f.r() - 0.5) * r * 0.5;
  f.part([add(c, [-r + j(), r * 0.4]), add(c, [-r * 0.5 + j(), -r * 0.35 + j()]), add(c, [r * 0.4 + j(), -r * 0.45 + j()]), add(c, [r + j(), r * 0.4])], { fill: mix('#a9a596', '#6e6a5e', f.r() * 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.9, hatch: false });
  f.line([add(c, [-r * 0.3, -r * 0.3]), add(c, [r * 0.25, -r * 0.35])], Math.max(1.2, r * 0.2), '#1c1a1a');
}
function barnacles(f, c, rx, ry, n, r0) { for (let i = 0; i < n; i++) { const a = f.r() * Math.PI * 2, rr = Math.sqrt(f.r()); barnacle(f, add(c, [Math.cos(a) * rx * rr, Math.sin(a) * ry * rr]), r0 * (0.6 + f.r() * 0.7)); } }
function mussel(f, c, a, s = 1) {
  f.part(ell(c, 7 * s, 3.6 * s, a, 10), { fill: '#1d2332', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false });
  f.line([add(c, rot([-5 * s, -1 * s], a)), add(c, rot([5 * s, -1 * s], a))], 0.9, '#6a7a9a', { op: 0.7 });
}
// a clean-rimmed void hole (not see-through): pale rim, black core, faint violet heart
function voidHole(f, c, rx, ry, ang = 0, glow = true) {
  if (glow) f.raw(`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx * 1.5}" ry="${ry * 1.5}" fill="#6a4aa0" opacity="0.22" filter="url(#soft${f.o.seed})"/>`);
  f.part(ell(c, rx, ry, ang, 20), { fill: '#e8e2d8', shade: 0.2, inkW: 1.4, inkHeavy: 1.4, cast: false, hatch: false });
  f.flat(ell(add(c, [rx * 0.07, ry * 0.07]), rx * 0.8, ry * 0.8, ang, 20), PAL.voidC);
  f.flat(ell(add(c, [rx * 0.2, ry * 0.15]), rx * 0.33, ry * 0.33, ang, 12), PAL.voidH, { op: 0.9 });
}
// make out[i0..i1) see-through inside `holePts` (a true hole in the silhouette). Each entry is a whole element, so the
// wrap is XML-safe and bone runs keep their indices.
function punch(f, i0, i1, holePts) {
  const id = `hole${f.o.seed}_${f.n++}`;
  f.defs.push(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff"/><path d="${E.smooth(holePts)}" fill="#000"/></mask>`);
  for (let i = i0; i < i1; i++) f.out[i] = `<g mask="url(#${id})">${f.out[i]}</g>`;
}
// bleached coral grown out of a joint: a low brain-coral mound with meandering grooves and short blunt knobs, so it
// never reads as fingers. ang points the mound away from the joint; len sets its spread, w its thickness.
function coral(f, b, ang, len, w, col = '#aea08a') {
  const r = Math.max(w * 1.3, len * 0.45), c = add(b, rot([r * 0.35, 0], ang));
  for (let i = 0; i < 4; i++) {
    const a = ang + (i - 1.5) * 0.55 + (f.r() - 0.5) * 0.3, p = add(c, rot([r * 0.6, 0], a)), q = add(p, rot([r * (0.35 + f.r() * 0.25), 0], a));
    f.part(limb(p, q, r * 0.42, r * 0.36, { steps: 4, capK: 1 }), { fill: mix(col, '#7a6e60', f.r() * 0.3), shade: 0.45, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.4 });
    f.flat(ell(q, r * 0.09, r * 0.09, 0, 6), '#4a3e36', { op: 0.7 });
  }
  const m = [];
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, rr = r * (0.85 + f.r() * 0.25); m.push(add(c, [Math.cos(a) * rr, Math.sin(a) * rr * 0.8])); }
  f.part(m, { fill: col, shade: 0.45, inkW: 1.2, inkHeavy: 1.8, cast: false, tex: 'mottle' + f.o.seed, texOp: 0.45 });
  for (let i = 0; i < 4; i++) { const y = (i - 1.5) * r * 0.36; f.line([add(c, [-r * 0.7, y]), add(c, [-r * 0.3, y - r * 0.12]), add(c, [0, y + r * 0.1]), add(c, [r * 0.35, y - r * 0.1]), add(c, [r * 0.7, y + r * 0.05])], 1.1, '#4a3e36', { op: 0.65 }); }
}
// verdigris bloom: crusty patches that weep downward in streaks, never round polka dots
function verd(f, c, rx, ry, n, col = PAL.verd) {
  // independent review: the first version was a teardrop blob with a pale dot, which read as pasted-on raindrops. Now an
  // irregular crust with two or three thin streaks weeping from it, low contrast.
  for (let i = 0; i < n; i++) {
    const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]), r = 2 + f.r() * 4.5, l = 10 + f.r() * 30;
    const cr = []; for (let j = 0; j < 7; j++) { const a = j / 7 * Math.PI * 2, rr = r * (0.5 + f.r() * 0.7); cr.push(add(p, [Math.cos(a) * rr * 1.3, Math.sin(a) * rr * 0.7])); }
    f.flat(cr, col, { op: 0.35 + f.r() * 0.2 });
    for (let j = 0; j < 1 + Math.floor(f.r() * 3); j++) { const s0 = add(p, [(f.r() - 0.5) * r * 1.6, r * 0.3]), ll = l * (0.4 + f.r() * 0.6); f.line([s0, add(s0, [(f.r() - 0.5) * 2, ll * 0.5]), add(s0, [(f.r() - 0.5) * 3, ll])], 0.8 + f.r() * 1.2, col, { op: 0.3 + f.r() * 0.2 }); }
  }
}
// pitting and corrosion on iron and steel
function pits(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]), r = 0.8 + f.r() * 2; f.flat(ell(p, r, r * 0.8, 0, 6), '#1a1616', { op: 0.7 }); f.flat(ell(add(p, [r * 0.6, r * 0.6]), r * 0.5, r * 0.4, 0, 6), '#c8c8bc', { op: 0.4 }); } }
function drip(f, p, s = 1) { f.flat(ell(p, 2 * s, 3.4 * s, 0, 6), PAL.water, { op: 0.85 }); }
// a kelp strand hanging plumb from p0, length l, width w, sway sideways
function kelp(f, p0, l, w, sway = 0) {
  const pts = [p0, add(p0, [sway * 0.4, l * 0.35]), add(p0, [sway, l * 0.7]), add(p0, [sway * 0.6, l])];
  f.stroke(pts, w, PAL.kelp); f.line(pts.slice(0, 3).map(q => add(q, [-w * 0.18, 0])), 1, PAL.kelpL, { op: 0.7 });
  return pts[3];
}
// chain of links along a polyline: alternating face-on rings and edge-on bars
function chainLinks(f, pts, s, col = '#4a3a30', o = {}) {
  const segs = []; let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) { const l = E.len(sub(pts[i + 1], pts[i])); segs.push([pts[i], pts[i + 1], tot, l]); tot += l; }
  const step = s * 1.5, n = Math.floor(tot / step), at = d => { for (const [a, b, t0, l] of segs) if (d <= t0 + l) return [lerp(a, b, (d - t0) / l), Math.atan2(b[1] - a[1], b[0] - a[0])]; const g = segs[segs.length - 1]; return [g[1], Math.atan2(g[1][1] - g[0][1], g[1][0] - g[0][0])]; };
  const lt = mix(col, '#d8c8b0', 0.45), dk = mix(col, '#000', 0.4);
  for (let i = 0; i <= n; i++) {
    const [c, a] = at(i * step + step / 2);
    if (i % 2 === 0) {
      const e = ell(c, s * 1.05, s * 0.62, a, 14).concat([ell(c, s * 1.05, s * 0.62, a, 14)[0]]);
      f.line(e, s * 0.42 + 2.2, INK); f.line(e, s * 0.42, col); f.line(e.slice(8, 13), s * 0.14, lt, { op: 0.8 });
    } else {
      f.part(limb(add(c, rot([-s * 1.05, 0], a)), add(c, rot([s * 1.05, 0], a)), s * 0.5, s * 0.5, { steps: 4 }), { fill: col, shade: 0.4, inkW: 1.2, inkHeavy: 1.8, cast: false, hatch: false });
      f.line([add(c, rot([-s * 0.7, -s * 0.1], a)), add(c, rot([s * 0.7, -s * 0.1], a))], 1, lt, { op: 0.6 });
    }
    if (o.rust && f.r() > 0.5) f.flat(ell(add(c, [f.r() * 4 - 2, f.r() * 4 - 2]), s * 0.3, s * 0.2, a, 6), o.rust, { op: 0.6 });
  }
}
// lumpy outline: thin the polygon to about `n` points, then bulge one rounded lump outward on each edge (rock-like
// growth, a few big lumps rather than a furry fringe)
function lumpy(f, pts, amp, n = 12) {
  const step = Math.max(1, Math.round(pts.length / n)), src = pts.filter((_, i) => i % step === 0);
  const c = src.reduce((s2, p) => add(s2, p), [0, 0]).map(v => v / src.length), out = [];
  for (let i = 0; i < src.length; i++) {
    const a = src[i], b = src[(i + 1) % src.length], q = lerp(a, b, 0.5), d = E.norm(sub(q, c)), e = E.len(sub(b, a));
    out.push(a, add(q, mul(d, Math.min(amp * (0.5 + f.r() * 0.8), e * 0.35))));
  }
  return out;
}
// salt crust: a greyed crust patch with small rough cubic blocks clustered on it (grimy salt, never snowflakes or ice)
function salt(f, c, rx, ry, n, s = 4, o = {}) {
  const crust = [];
  // independent review: a smooth 9-point crust read as a pale bubble on dark cloth; now a ragged edge at lower opacity
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = (i % 2 ? 0.55 : 0.8) + f.r() * 0.45; crust.push([...add(c, [Math.cos(a) * rx * r, Math.sin(a) * ry * r]), i % 2]); }
  if (o.crust !== false) f.flat(crust, '#cfcabe', { op: 0.2 });
  for (let i = 0; i < n; i++) {
    const a0 = f.r() * Math.PI * 2, rr = Math.sqrt(f.r()) * 0.8, p = add(c, [Math.cos(a0) * rx * rr, Math.sin(a0) * ry * rr]), a = f.r() * 1.5, r = s * (0.4 + f.r() * 0.6);
    const q = [rot([-r, -r], a), rot([r, -r * 0.8], a), rot([r * 0.9, r], a), rot([-r * 0.8, r * 0.9], a)].map(v => [...add(p, v), 1]);
    f.flat(q, f.r() > 0.35 ? '#dedad0' : '#a8a296', { op: 0.75 });
    f.line([q[1], q[2], q[3]], 0.8, '#4a4640', { op: 0.55, straight: true });
  }
}
function pearl(f, c, r) {
  f.part(ell(c, r, r, 0, 12), { fill: '#e2ddd0', shade: 0.25, inkW: 0.9, inkHeavy: 1.4, cast: false, hatch: false });
  f.flat(ell(add(c, [r * 0.25, r * 0.3]), r * 0.55, r * 0.35, 0.6, 8), '#b8b4c8', { op: 0.5 });
  f.flat(ell(add(c, [-r * 0.32, -r * 0.35]), r * 0.26, r * 0.2, 0, 6), '#ffffff', { op: 0.9 });
  f.line([add(c, [r * 0.5, -r * 0.3]), add(c, [r * 0.62, r * 0.1])], 0.8, '#c8a8a0', { op: 0.7 });
}
// skin breakup for drowned flesh: lividity blotches and marbled veins inside a region
function livid(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.flat(ell(p, 3 + f.r() * 8, 2 + f.r() * 5, f.r() * 3, 8), f.r() > 0.45 ? PAL.blotch : PAL.green, { op: 0.4 }); } }
function veins(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.line([p, add(p, [3 + f.r() * 7, 5 + f.r() * 6]), add(p, [f.r() * 14, 13 + f.r() * 10])], 0.9, '#57527e', { op: 0.6 }); } }
function peel(f, c, n, s = 1) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * 24 * s, (f.r() - 0.5) * 20 * s]); f.flat([p, add(p, [8 * s, -2 * s]), add(p, [10 * s, 3 * s]), add(p, [3 * s, 5 * s])], '#e2e0d2', { op: 0.85 }); f.line([p, add(p, [8 * s, -2 * s])], 0.8, INK, { op: 0.6 }); } }
// standing water under the feet
function puddle(f, c, rx) { f.flat(ell(c, rx, rx * 0.11, 0, 16), '#3a4a4a', { op: 0.45 }); f.line([add(c, [-rx * 0.6, -1]), add(c, [rx * 0.2, -2])], 1, '#9ec0d0', { op: 0.35 }); }

// ================================================================== drowned flesh (independent review additions)
// Waterlogged skin: a soft violet-green flesh mottle (replaces the speckled 'mottle' that made skin read as granite) and
// fine crease patterns (washerwoman's skin) at six angles, so creases always run across the limb they sit on.
function skinDefs(f) {
  if (f._skin) return; f._skin = true;
  const s = f.o.seed;
  f.defs.push(`<filter id="fleshf${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${s + 31}"/><feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.25  0 0 0 0 0.32  0 0 0 -2.4 1.25"/></filter><pattern id="flesh${s}" patternUnits="userSpaceOnUse" width="420" height="420"><rect width="420" height="420" filter="url(#fleshf${s})"/></pattern>`);
  f.defs.push(`<filter id="wrkf${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency="0.014 0.11" numOctaves="2" seed="${s + 37}"/><feColorMatrix values="0 0 0 0 0.10  0 0 0 0 0.08  0 0 0 0 0.14  0 0 0 -7 0.85"/></filter>`);
  for (let i = 0; i < 6; i++) f.defs.push(`<pattern id="wrk${s}_${i}" patternUnits="userSpaceOnUse" width="360" height="360" patternTransform="rotate(${i * 30})"><rect width="360" height="360" filter="url(#wrkf${s})"/></pattern>`);
}
// `over` markup for part(): creases across a limb running at screen angle ang, plus soft pooled lividity blotches
// (blurred, clipped to the part, so they read as bruised dead flesh, never as polka dots)
function skinOver(f, pts, ang, o = {}) {
  skinDefs(f);
  const bb = E.bbox(pts), pad = 20, s = f.o.seed;
  let deg = ((ang * 180 / Math.PI + 90) % 180 + 180) % 180, i = Math.round(deg / 30) % 6;
  let g = `<rect x="${bb[0] - pad}" y="${bb[1] - pad}" width="${bb[2] - bb[0] + pad * 2}" height="${bb[3] - bb[1] + pad * 2}" fill="url(#wrk${s}_${i})" opacity="${o.wr ?? 0.4}"/>`;
  for (const [c, rx, ry, col, op] of (o.pools || [])) g += `<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${col}" opacity="${op}" filter="url(#soft${s})"/>`;
  return g;
}
// anatomical limb from explicit half-widths: P [[t, w]] on the +normal side, Q on the -normal side (t from 0 to 1),
// so muscle bellies swell and joints narrow where the anatomy puts them. Round caps unless capA/capB are false.
function mlimb(a, b, P, Q, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  const side = (arr, sg) => arr.map(([t, w, sh]) => { const q = add(lerp(a, b, t), mul(n, sg * w)); return sh ? [...q, 1] : q; });
  const pp = side(P, 1), qq = side(Q, -1);
  const ck = o.capK ?? 0.75, out = [...pp];
  const wpB = P[P.length - 1][1], wqB = Q[Q.length - 1][1], cB = lerp(lerp(a, b, P[P.length - 1][0]), lerp(a, b, Q[Q.length - 1][0]), 0.5);
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(cB, add(mul(n, Math.cos(an) * w), mul(d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...qq.reverse());
  const wpA = P[0][1], wqA = Q[0][1], cA = lerp(lerp(a, b, P[0][0]), lerp(a, b, Q[0][0]), 0.5);
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(cA, add(mul(n, -Math.cos(an) * w), mul(d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
// one continuous anatomical outline through several joints (hip, knee, ankle or shoulder, elbow, wrist), so a limb has
// no doll-joint caps: the inside of each bend closes in a sharp crease, the outside swells into the bony knob (knee,
// elbow point). J: joint points; profs: per segment [P, Q] half-width lists as in mlimb. Pair with split() for the rig.
function mchain(J, profs, o = {}) {
  const segs = [];
  for (let s = 0; s < J.length - 1; s++) { const a = J[s], b = J[s + 1], d = E.norm(sub(b, a)); segs.push({ a, b, d, n: [-d[1], d[0]] }); }
  const P = [], Q = [], trim = o.trim ?? 0.2;
  for (let s = 0; s < segs.length; s++) {
    const { a, b, n } = segs[s], [pp, qq] = profs[s];
    const inPrev = s > 0 ? segs[s - 1].inner : 0, inNext = s < segs.length - 1 ? ((segs[s + 1].d[0] * n[0] + segs[s + 1].d[1] * n[1]) > 0 ? 1 : -1) : 0;
    segs[s].inner = inNext;
    const keep = (t, sg) => (s === 0 || t >= (inPrev === sg ? trim : 0.06)) && (s === segs.length - 1 || t <= (inNext === sg ? 1 - trim : 0.94));
    for (const [t, w] of pp) if (keep(t, 1)) P.push(add(lerp(a, b, t), mul(n, w)));
    for (const [t, w] of qq) if (keep(t, -1)) Q.push(add(lerp(a, b, t), mul(n, -w)));
    if (s < segs.length - 1) {
      const nx = segs[s + 1], bis = E.norm(add(n, nx.n)), wP = (pp[pp.length - 1][1] + profs[s + 1][0][0][1]) / 2, wQ = (qq[qq.length - 1][1] + profs[s + 1][1][0][1]) / 2;
      const kb = (o.knob ?? [])[s] ?? 1.12;
      if (inNext > 0) { P.push([...add(b, mul(bis, wP * 0.8)), 1]); Q.push(add(b, mul(bis, -wQ * kb))); }
      else { P.push(add(b, mul(bis, wP * kb))); Q.push([...add(b, mul(bis, -wQ * 0.8)), 1]); }
    }
  }
  const out = [...P], last = segs[segs.length - 1], first = segs[0], ck = o.capK ?? 0.7;
  const wpB = P.length ? E.len(sub(P[P.length - 1], last.b)) : 10, wqB = E.len(sub(Q[Q.length - 1], last.b));
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(last.b, add(mul(last.n, Math.cos(an) * w), mul(last.d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...Q.reverse());
  const wpA = E.len(sub(P[0], first.a)), wqA = E.len(sub(out[out.length - 1], first.a));
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(first.a, add(mul(first.n, -Math.cos(an) * w), mul(first.d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
// rig helpers (same contract as dirAC.js side/split, copied here because shared files are frozen):
// side(P, d, r) is the half-plane on the d side of the line through P plus a disk of radius r round P;
// split(f, draw, cuts) draws once and hands a clipped copy to each bone in order (child last, on top).
function side(Pt, d, r = 0, L = 3000) {
  d = E.norm(d); const n = [-d[1], d[0]], pts = [add(Pt, mul(n, L)), add(add(Pt, mul(n, L)), mul(d, L)), add(add(Pt, mul(n, -L)), mul(d, L)), add(Pt, mul(n, -L))];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; pts.push(add(Pt, add(mul(n, -Math.cos(a) * r), mul(d, -Math.sin(a) * r)))); }
  return 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
}
function split(f, draw, cuts) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  for (const [bone, reg] of cuts) {
    let g = body;
    for (const r of [].concat(reg)) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; }
    f.bone(bone); f.raw(g);
  }
  return res;
}
// cut direction at a joint: the mean of the two segment directions
function jdir(a, j, b) { return E.norm(add(E.norm(sub(j, a)), E.norm(sub(b, j)))); }
// a tapered groove between two muscles, or a tendon ridge (light), along a polyline
function groove(f, pts, w, col, op = 0.5) { f.stroke(pts, w, col, { op }); }
// wet sheen: short broken pale streaks along a lit edge
function wet(f, pts, w = 1.4, col = '#e4eef0', op = 0.6) {
  for (let i = 0; i < pts.length - 1; i++) if (f.r() > 0.25) { const a = pts[i], b = pts[i + 1]; f.line([lerp(a, b, 0.1 + f.r() * 0.2), lerp(a, b, 0.6 + f.r() * 0.3)], w, col, { op }); }
}
// fine crease fan at a joint (inside of an elbow, behind a knee, over a knuckle)
function creases(f, c, ang, len, n, col, op = 0.55) {
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * len * 0.22, a = ang + (f.r() - 0.5) * 0.3, p = add(c, rot([0, o], ang)); f.line([add(p, rot([-len / 2, 0], a)), add(p, rot([0, len * 0.06], a)), add(p, rot([len / 2, 0], a))], 1, col, { op: op * (0.6 + f.r() * 0.4) }); }
}
// extra anatomy on a B.grip fist (pass its result g and the same size s): knuckle heads along the back of the hand,
// crease lines over the finger joints, a thumbnail, and webbing from thumb to index for the drowned
function fistDetail(f, g, s, col, o = {}) {
  const F = g.F, dk = mix(col, '#1a1020', 0.5), lt = mix(col, '#ffffff', 0.4);
  for (let i = 0; i < 4; i++) { const y = -0.45 + i * 0.3; f.flat(F(ell([0.34, y], 0.1, 0.11, 0, 8)), lt, { op: 0.45 }); f.line(F([[0.28, y + 0.1], [0.4, y + 0.12]]), 0.9, dk, { op: 0.6 }); }
  for (let i = 0; i < 4; i++) { const y = -0.5 + i * 0.3; f.line(F([[0.5, y + 0.06], [0.56, y + 0.12], [0.54, y + 0.2]]), 0.9, dk, { op: 0.55 }); }
  f.part(F([[0.38, -0.82], [0.56, -0.8], [0.6, -0.68], [0.44, -0.66]]), { fill: o.nail || mix(col, '#d8d4dc', 0.5), shade: 0.3, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
  if (o.web) f.flat(F([[0.02, -0.52], [0.36, -0.5], [0.3, -0.34], [0.06, -0.38]]), o.web, { op: 0.55 });
  if (o.wrinkle !== false) for (let i = 0; i < 3; i++) f.line(F([[-0.6 + i * 0.12, -0.3], [-0.55 + i * 0.12, 0.3]]), 0.8, dk, { op: 0.4 });
}

// ================================================================== crab parts
// one crab leg segment: flattened, flaring toward the distal socket, a lit ridge, a row of spines along the leading
// edge, bristles (setae) on the trailing edge, and a pale joint membrane at the distal end. a -> b, widths wa -> wb.
function crabSeg(f, a, b, wa, wb, look, o = {}) {
  const P = [[0, wa * 0.42], [0.2, wa * 0.52], [0.6, wb * 0.56], [0.88, wb * 0.62], [1, wb * 0.5]];
  const Q = [[0, wa * 0.42], [0.25, wa * 0.48], [0.65, wb * 0.5], [0.9, wb * 0.56], [1, wb * 0.46]];
  const pts = mlimb(a, b, P, Q, { capK: 0.5 });
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], dk = mix(look.fill, '#000', 0.5), lt = mix(look.fill, '#e8d8c0', 0.35);
  f.line([lp(a, b, 0.1, wa * 0.2), lp(a, b, 0.55, wb * 0.26), lp(a, b, 0.86, wb * 0.3)], 1.6, lt, { op: 0.55 }); // lit ridge
  f.line([lp(a, b, 0.12, -wa * 0.18), lp(a, b, 0.8, -wb * 0.22)], 1.1, dk, { op: 0.5 }); // carina groove
  // distal socket: a darker flared rim and the pale membrane where the next segment turns
  f.line([lp(a, b, 0.9, wb * 0.6), lp(a, b, 0.95, 0), lp(a, b, 0.9, -wb * 0.55)], 1.4, INK, { op: 0.7 });
  if (o.membrane !== false) f.flat(ell(lp(a, b, 0.97, -wb * 0.15), wb * 0.22, wb * 0.16, Math.atan2(d[1], d[0]), 8), '#8a7a6a', { op: 0.7 });
  // spines on the leading (+normal or -normal) edge, pointing toward the tip
  const sg = o.spineSide ?? 1, ns = o.spines ?? 3;
  for (let i = 0; i < ns; i++) {
    const t = 0.18 + i * 0.68 / Math.max(1, ns - 1), w = (wa + (wb - wa) * t) * 0.5, base = lp(a, b, t, sg * w * 0.95), L = w * (0.45 + f.r() * 0.3);
    const tip = add(base, add(mul(n, sg * L), mul(d, L * 0.9)));
    f.part([add(base, mul(d, -w * 0.22)), tip, add(base, mul(d, w * 0.2))], Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false, k: 0.4, fill: mix(look.fill, '#d8c8a8', 0.25) }));
  }
  // setae: short stiff bristles along the trailing edge
  for (let i = 0; i < (o.hairs ?? 7); i++) {
    const t = 0.1 + f.r() * 0.8, w = (wa + (wb - wa) * t) * 0.5, base = lp(a, b, t, -sg * w * 0.9), L = w * (0.3 + f.r() * 0.35);
    f.line([base, add(base, add(mul(n, -sg * L), mul(d, L * 0.6)))], 0.9, INK, { op: 0.8 });
  }
  return pts;
}
// the dactyl: a curved, tapering last segment ending in a dark horn tip that is planted on the ground
function dactyl(f, a, tip, w, look, bend = 0.25) {
  const d = E.norm(sub(tip, a)), n = [-d[1], d[0]], L = E.len(sub(tip, a)), m = add(lerp(a, tip, 0.5), mul(n, L * bend * 0.3));
  const pts = [add(a, mul(n, w * 0.5)), add(m, mul(n, w * 0.34)), add(lerp(m, tip, 0.6), mul(n, w * 0.14)), [...tip, 1], add(lerp(m, tip, 0.6), mul(n, -w * 0.12)), add(m, mul(n, -w * 0.3)), add(a, mul(n, -w * 0.5))];
  f.part(pts, Object.assign({ k: 0.85 }, look));
  f.flat([add(lerp(m, tip, 0.45), mul(n, w * 0.2)), [...tip, 1], add(lerp(m, tip, 0.45), mul(n, -w * 0.18))], '#1a1210', { op: 0.85 }); // horn tip
  for (let i = 0; i < 5; i++) { const q = add(lerp(a, m, 0.2 + i * 0.18), mul(n, -w * 0.36)); f.line([q, add(q, add(mul(n, -w * 0.3), mul(d, w * 0.2)))], 0.9, INK, { op: 0.75 }); } // setae
  f.line([add(a, mul(n, w * 0.2)), add(m, mul(n, w * 0.16)), add(lerp(m, tip, 0.5), mul(n, w * 0.06))], 1.2, mix(look.fill, '#e8d8c0', 0.35), { op: 0.5 });
  return pts;
}

module.exports = { pits, PAL, space, barnacle, barnacles, mussel, voidHole, punch, coral, verd, drip, kelp, chainLinks, lumpy, salt, pearl, livid, veins, peel, puddle,
  skinDefs, skinOver, mlimb, mchain, side, split, jdir, groove, wet, creases, fistDetail, crabSeg, dactyl };
