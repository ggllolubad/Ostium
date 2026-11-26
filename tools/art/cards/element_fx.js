// Element FX (LESSONS L61, Cole 2026-11-25: "i want them to look like that ELEMENT not just that color").
// The Elementalist writes a course: the stroke leaves the nib or the hand as ink and BECOMES the element where it travels
// and lands. Each element is its own shape, drawn in woodcut ink (rule 6: no glows, neon or sparkles), so the six
// courses read apart even in greyscale:
//   fire       flame tongues breaking off the stroke, smoke, ash and embers, a scorched char ring; ochre and orange, never
//              the round splat (it reads as blood; red is for blood, rule 9)
//   frost      the stroke stiffens into rime with icicle spurs; a bloom of hoar crystals where it lands; pale specks falling
//   lightning  the stroke forks into a jagged branching bolt; a burnt branching scar on the floor
//   water      a breaking wave crest or sheet of water throwing droplets; a pooled spill
//   toxin      grey-green fume billowing off the stroke; mould blooming where it lands
//   void       the stroke ends in a clean bored hole or rift with its wall showing; the surroundings drawn toward it
// physical (and any unknown course) keeps plain ink. stroke(), impact() and pour() return SVG strings in card space.
'use strict';
const K = require('./card_kit');
const { E, INK, PAPER } = K;
const { add, sub, mul, lerp, rot, mix, norm, len } = E;
const f1 = K.f1;

const COL = {
  fire: { body: '#c8742c', core: '#eab45a', dark: '#2e1a0c', smoke: '#3a3430' },
  frost: { body: '#dce8ee', core: '#f4f8fa', dark: '#5a7484' },
  lightning: { body: '#efe2a8', core: '#faf4d8', dark: '#2a2414' },
  water: { body: '#3e6a96', core: '#a8c4d4', dark: '#1a2c40' },
  toxin: { body: '#7a8a3a', core: '#c8c890', dark: '#1e2410', fume: '#3a4220' },
  void: { body: '#4b2a5c', core: '#8a6a9a', dark: '#06040a' },
};
const ELEMENTS = Object.keys(COL);
const isElement = c => ELEMENTS.includes(c);
const tri = (a, b, c) => 'M' + [a, b, c].map(p => f1(p[0]) + ',' + f1(p[1])).join('L') + 'Z';

// ---- pieces
function tongues(r, base, h, n, c) {   // flame tongues rising off a point: the kit's ink flame (dark tongues, an ochre core), spread
  let s = '';
  for (let i = 0; i < n; i++) s += K.inkFlame(r, add(base, [(i - (n - 1) / 2) * h * 0.35, (r() - 0.5) * h * 0.1]), h * (0.75 + r() * 0.5), c.core);
  return s;
}
function embers(r, c0, R, n, c) { let s = ''; for (let i = 0; i < n; i++) { const q = add(c0, [(r() - 0.5) * R * 2, -r() * R * 1.4]); s += `<path d="M${f1(q[0])},${f1(q[1])}l${f1(1 + r() * 3)},${f1(-3 - r() * 5)}" stroke="${r() < 0.55 ? c.body : '#2a2020'}" stroke-width="${f1(2 + r() * 2.2)}" stroke-linecap="round"/>`; } return s; }
function spurs(r, pts, L, c, down = true) {   // icicle spurs hanging off a line: long pale wedges, inked, with a lit edge
  let s = '';
  pts.forEach((p, i) => { const l = L * (0.5 + r() * 0.8), a = (down ? Math.PI / 2 : -Math.PI / 2) + (r() - 0.5) * 0.5, tip = add(p, [Math.cos(a) * l, Math.sin(a) * l]), w = l * 0.18, n = [-Math.sin(a), Math.cos(a)];
    s += `<path d="${tri(add(p, mul(n, w)), add(p, mul(n, -w)), tip)}" fill="${c.body}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${f1(p[0] + n[0] * w * 0.4)},${f1(p[1] + n[1] * w * 0.4)}L${f1(tip[0])},${f1(tip[1])}" stroke="${c.core}" stroke-width="1.2"/>`; });
  return `<g filter="url(#kWob)">${s}</g>`;
}
function hoar(r, c0, R, n, c) {   // hoar crystals: short ink spines branching off a few rays, pale filled; never a sparkle
  let s = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.4, L = R * (0.5 + r() * 0.6), tip = add(c0, [Math.cos(a) * L, Math.sin(a) * L * 0.8]);
    s += `<path d="M${f1(c0[0])},${f1(c0[1])}L${f1(tip[0])},${f1(tip[1])}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(c0[0])},${f1(c0[1])}L${f1(tip[0])},${f1(tip[1])}" stroke="${c.body}" stroke-width="2.6" stroke-linecap="round"/>`;
    for (const t of [0.45, 0.7]) { const b = lerp(c0, tip, t); for (const sg of [-1, 1]) { const e = add(b, rot([L * 0.22, 0], a + sg * 0.8)); s += `<path d="M${f1(b[0])},${f1(b[1])}L${f1(e[0])},${f1(e[1])}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M${f1(b[0])},${f1(b[1])}L${f1(e[0])},${f1(e[1])}" stroke="${c.body}" stroke-width="1.6" stroke-linecap="round"/>`; } } }
  return `<g filter="url(#kWob)">${s}</g>`;
}
function jag(r, a, b, n, amp) { const pts = [a]; for (let i = 1; i < n; i++) { const t = i / n, d = norm(sub(b, a)), nn = [-d[1], d[0]]; pts.push(add(lerp(a, b, t), mul(nn, (r() - 0.5) * amp * 2))); } pts.push(b); return pts; }
function bolt(r, pts, w, c) {   // a jagged bolt as a split loaded stroke: ink under a pale core, hard corners (polyline, not a curve)
  const d = 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L');
  return `<g filter="url(#kRag)"><path d="${d}" stroke="${INK}" stroke-width="${f1(w)}" fill="none" stroke-linejoin="miter" stroke-linecap="round"/><path d="${d}" stroke="${c.body}" stroke-width="${f1(w * 0.42)}" fill="none" stroke-linejoin="miter"/></g>`;
}
function scar(r, c0, R, c) {   // a burnt branching scar on the floor: dark branching strokes, flattened
  let s = ''; const main = jag(r, add(c0, [-R, 0]), add(c0, [R, 6]), 7, 8);
  s += K.drybrush(r, main, 12, INK, { dry: 0.8, op: 0.9, body: false, bristles: 5 });
  for (let k = 1; k < main.length - 1; k += 2) { const q = main[k], e = add(q, [(r() - 0.5) * R * 0.6, (r() < 0.5 ? -1 : 1) * (10 + r() * 18)]); s += K.drybrush(r, jag(r, q, e, 3, 5), 6, INK, { dry: 1, op: 0.85, body: false, bristles: 3 }); }
  return s;
}
function crest(r, c0, R, dir, c) { return waterCurl(r, c0, R * 0.7, dir, c); }   // kept for callers: now the rounded wave curl (round 10)
function puddle(r, c0, R, c) { let s = `<g filter="url(#kRag)"><ellipse cx="${f1(c0[0])}" cy="${f1(c0[1])}" rx="${f1(R)}" ry="${f1(R * 0.2)}" fill="${c.dark}" opacity="0.85"/></g>`; for (let i = 0; i < 3; i++) s += K.drybrush(r, K.arc(c0, R * (0.35 + i * 0.22), R * 0.06 * (1 + i), 200, 340, 10), 4, c.core, { dry: 1, op: 0.7, body: false, bristles: 2 }); return s; }
function mould(r, c0, R, n, c) {   // mould blooms: ragged blotches spreading on the ground, pale-edged, with specks (no ring and dot: it read as an eye)
  let s = '';
  for (let i = 0; i < n; i++) { const q = add(c0, [(r() - 0.5) * R * 2, (r() - 0.5) * R * 0.6]), z = 6 + r() * 14; s += `<path d="${K.pathD(K.blob(r, q, z, 10, 0.8, 0.55), true)}" fill="${r() < 0.5 ? c.body : c.dark}" stroke="${c.core}" stroke-width="1.6"/>`; for (let k = 0; k < 4; k++) s += `<circle cx="${f1(q[0] + (r() - 0.5) * z * 2.4)}" cy="${f1(q[1] + (r() - 0.5) * z)}" r="${f1(1 + r() * 1.8)}" fill="${c.core}"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
// a flame mass (Cole: "bigger and fuller"): overlapping filled tongues, an orange-ochre body inked dark at the edge, a
// lighter core inside, a dark smoke plume rolling up off it and embers; reads as fire, never as grass or a blood splat
function flameShape(b, w, h, lean) { return [add(b, [-w / 2, 0]), add(b, [-w * 0.55, -h * 0.3]), add(b, [-w * 0.25 + lean * 0.3, -h * 0.62]), add(b, [lean, -h]), add(b, [w * 0.3 + lean * 0.4, -h * 0.55]), add(b, [w * 0.55, -h * 0.25]), add(b, [w / 2, 0])]; }
function flameTongue(b, w, h, lean, curl) {   // one licking tongue: a fat foot, a waist, the tip curling over with the heat
  return [add(b, [-w / 2, 0]), add(b, [-w * 0.62, -h * 0.22]), add(b, [-w * 0.3 + lean * 0.25, -h * 0.52]), add(b, [-w * 0.08 + lean * 0.7, -h * 0.82]), add(b, [lean + curl * w * 0.5, -h]), add(b, [lean * 0.9 + curl * w * 0.7, -h * 0.86]), add(b, [w * 0.18 + lean * 0.55, -h * 0.6]), add(b, [w * 0.5 + lean * 0.2, -h * 0.3]), add(b, [w * 0.5, 0])];
}
function fireMass(r, b, R, c) {
  // irregular licking flames (not a row of even triangles): uneven heights, tips curling and leaning with one heat drift,
  // some tongues splitting in two, gaps between them; a smoke column over the tallest; embers
  const drift = (r() < 0.5 ? -1 : 1) * (0.15 + r() * 0.2), n = 4 + Math.floor(r() * 3), xs = [];
  // variety by construction (L61 fire evenness, for every caller): the gaps and the heights are stretched about their mean
  // until each has a coefficient of variation of at least 0.4, so no draw comes out as a picket fence
  const stretch = (v, lo) => { const m = v.reduce((a, b) => a + b, 0) / v.length, sd = Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / v.length), cv = sd / m; return cv >= 0.4 ? v : v.map(x => Math.max(lo * m, m + (x - m) * (0.4 / Math.max(cv, 0.05)))); };
  // the tongues are placed by their TIPS (what the eye and the L61 check read), not their bases: uneven tip gaps from a
  // shuffled set, stretched to a CV of 0.4 or more; each base then sits under its own tip, lean and curl included
  const odd = r() < 0.5, set = [0.28, 0.5, 0.95, 0.38, 0.75], gaps = stretch(Array.from({ length: n - 1 }, (_, i) => set[(i * 3 + (odd ? 1 : 0) + Math.floor(r() * 2)) % set.length] * (0.9 + r() * 0.2)), 0.25);
  const tall = Math.floor(r() * n), hts = stretch(Array.from({ length: n }, (_, i) => i === tall ? 1.6 + r() * 0.3 : (i % 2 ? 0.3 + r() * 0.3 : 0.75 + r() * 0.45)), 0.2);
  const T = hts.map((hh, i) => { const h = R * hh, w = R * (i === tall ? 0.38 + r() * 0.08 : 0.2 + r() * 0.12), lean = (drift + (r() - 0.5) * 0.3) * h, curl = (r() < 0.5 ? -1 : 1) * (0.3 + r() * 0.5); return { h, w, lean, curl, tip: lean + curl * w * 0.5 }; });
  let x = -R * 0.85; for (let i = 0; i < n; i++) { xs.push(x - T[i].tip); if (i < n - 1) x += R * gaps[i]; }
  const shift = (xs[0] + xs[xs.length - 1]) / 2;
  let body = '', core = '', ink = '', top = b;
  xs.forEach((x0, i) => {
    const bb = add(b, [x0 - shift, (r() - 0.5) * R * 0.06]), { h, w, lean, curl } = T[i];
    const tips = i === tall ? [[lean - w * 0.3, curl, 1], [lean + w * 0.4, -curl, 0.62]] : [[lean, curl, 1]];   // the tallest tongue splits
    for (const [ln, cu, hs] of tips) {
      const P = flameTongue(bb, w * (tips.length > 1 && hs < 1 ? 0.6 : 1), h * hs, ln, cu);
      body += `<path d="${K.pathD(P, true)}" fill="${c.body}" stroke="${c.dark}" stroke-width="${f1(Math.max(2.4, R * 0.045))}" stroke-linejoin="round"/>`;
      core += `<path d="${K.pathD(flameTongue(add(bb, [w * 0.04, -h * 0.03]), w * 0.42, h * hs * 0.58, ln * 0.6, cu * 0.6), true)}" fill="${c.core}"/>`;
      ink += `<path d="M${f1(bb[0] - w * 0.15)},${f1(bb[1] - h * 0.05)}Q${f1(bb[0] - w * 0.1 + ln * 0.3)},${f1(bb[1] - h * hs * 0.45)} ${f1(bb[0] + ln * 0.65)},${f1(bb[1] - h * hs * 0.78)}" stroke="${c.dark}" stroke-width="${f1(Math.max(1.6, R * 0.024))}" fill="none" stroke-linecap="round" opacity="0.75"/>`;
      if (i === tall) top = add(bb, [ln, -h * hs]);
    }
  });
  let s = '';
  for (let k = 0; k < 3; k++) s += K.billow(r, add(top, [drift * R * (0.4 + k * 0.5), -R * (0.35 + k * 0.45)]), R * (0.42 + k * 0.14), R * (0.24 + k * 0.06), c.smoke, { op: 0.8 - k * 0.12, lw: 4, curls: 1 });
  s += `<g filter="url(#kRag)">${body}${core}${ink}</g>`;
  return s + embers(r, add(top, [0, R * 0.3]), R * 0.8, 24, c);
}
// a toxin cloud (Cole: "the fume as a mass"): billows rolling off one another, dark-edged and hatched, mould blooming under
function fumeMass(r, c0, R, c, dir = [1, 0]) { return fumeCloud(r, c0, R, c, dir) + ooze(r, add(c0, [0, R * 0.75]), R * 0.8, c); }   // kept for callers: now a see-through fume over ooze (round 10)
function hole(r, c0, R, c) {   // a clean bored hole with its wall showing (as D.hole), and the surroundings drawn into it
  const rx = R, ry = R * 0.62;
  let s = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + r() * 0.3, far = add(c0, [Math.cos(a) * R * 3.4, Math.sin(a) * R * 2.4]), near = add(c0, [Math.cos(a) * R * 1.25, Math.sin(a) * R * 0.85]); s += K.motionHatch(r, [far, lerp(far, near, 0.5), near], 26, INK, { lw: 2.8, op: 0.8, grow: true }); }
  s += `<g filter="url(#kRag)"><ellipse cx="${f1(c0[0])}" cy="${f1(c0[1])}" rx="${f1(rx * 1.16)}" ry="${f1(ry * 1.16)}" fill="${c.body}" stroke="${INK}" stroke-width="3.4"/>`;
  s += `<ellipse cx="${f1(c0[0] + rx * 0.08)}" cy="${f1(c0[1] + ry * 0.14)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${c.dark}"/>`;
  s += `<path d="M${f1(c0[0] - rx)},${f1(c0[1])}A${f1(rx)},${f1(ry)} 0 0 1 ${f1(c0[0] + rx)},${f1(c0[1])}" stroke="${c.core}" stroke-width="3" fill="none" opacity="0.85"/></g>`;
  return s;
}


// ---- round 10 (coordinator's eye review): fire as a jet and a burst, water as curls and beads, toxin as a see-through fume and ooze
const rotAbout = (pts, b, a) => pts.map(p => add(b, rot(sub(p, b), a)));
function fireBurst(r, c0, R, c, dir = [1, 0]) {   // a burst from a hot core: tongues thrown out in a fan (mostly up and out, carried on along the throw), embers flung, a smoke puff
  let s = K.billow(r, add(c0, [R * 0.2, -R * 1.25]), R * 0.7, R * 0.35, c.smoke, { op: 0.5, lw: 3, curls: 1 }), body = '', core = '';
  const n = 9, sx = dir[0] < 0 ? -1 : 1;   /* round 10: the fan leans the way the throw was going and its far tongues run longer, so the burst is never its own mirror (L61) */
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI * (0.06 + 0.88 * i / (n - 1)) + (r() - 0.5) * 0.25 + sx * 0.3, a = a0, L = R * (0.55 + r() * 0.95) * (1 + 0.45 * sx * Math.cos(a0)), w = R * (0.24 + r() * 0.16);
    const P = rotAbout(flameTongue([0, 0], w, L, -0.45 * L * Math.cos(a) + (r() - 0.5) * L * 0.2, (r() < 0.5 ? -1 : 1) * (0.3 + r() * 0.4)), [0, 0], a + Math.PI / 2).map(q => add(c0, q));   /* tongues bend up at their tips (fire rises): straight radial tongues read as fingers or a sun */
    body += `<path d="${K.pathD(P, true)}" fill="${c.body}" stroke="${c.dark}" stroke-width="${f1(Math.max(2.4, R * 0.04))}" stroke-linejoin="round"/>`;
    const Q = rotAbout(flameTongue([0, 0], w * 0.45, L * 0.55, 0, 0), [0, 0], a + Math.PI / 2).map(q => add(c0, q));
    core += `<path d="${K.pathD(Q, true)}" fill="${c.core}"/>`;
  }
  s += `<g filter="url(#kRag)">${body}<ellipse cx="${f1(c0[0])}" cy="${f1(c0[1])}" rx="${f1(R * 0.42)}" ry="${f1(R * 0.34)}" fill="${c.core}" stroke="${c.body}" stroke-width="${f1(R * 0.08)}"/>${core}</g>`;
  for (let i = 0; i < 26; i++) { const a = -Math.PI * r() * 1.1 + 0.05, d = R * (0.6 + r() * 1.1), q = add(c0, [Math.cos(a) * d, Math.sin(a) * d]); s += `<path d="M${f1(q[0])},${f1(q[1])}l${f1(Math.cos(a) * (3 + r() * 6))},${f1(Math.sin(a) * (3 + r() * 6))}" stroke="${r() < 0.6 ? c.core : c.body}" stroke-width="${f1(2 + r() * 2)}" stroke-linecap="round"/>`; }
  return s;
}
function flameJet(r, P, w, c) {   // a jet of flame along the throw: widening from the hand, licks peeling back off its top, sparks and embers shed
  const N = K.normals(P).map(n => n[1] > 0 ? mul(n, -1) : n), A = [], B = [], C1 = [], C2 = [];
  P.forEach((q, i) => { const t = i / (P.length - 1), ww = w * (0.35 + 1.25 * Math.pow(t, 0.8)) * (0.85 + r() * 0.3); A.push(add(q, mul(N[i], ww * 0.55))); B.push(add(q, mul(N[i], -ww * 0.45))); C1.push(add(q, mul(N[i], ww * 0.22))); C2.push(add(q, mul(N[i], -ww * 0.12))); });
  let licks = '', ink = '', s = '';
  for (let i = 3; i < P.length - 2; i += 4) { const t = i / (P.length - 1), d = norm(sub(P[i + 1], P[i - 1])), h = w * (0.8 + r() * 1.2) * (0.5 + t), lean = -d[0] * h * 0.7; licks += `<path d="${K.pathD(flameTongue(A[i], w * (0.4 + t * 0.4), h, lean, (r() < 0.5 ? -1 : 1) * 0.5), true)}" fill="${c.body}" stroke="${c.dark}" stroke-width="2.4" stroke-linejoin="round"/>`; }
  for (let k = 0; k < 3; k++) { const off = (k - 1) * 0.18; ink += `<path d="${K.pathD(P.filter((q, i) => i % 3 === 0).map((q, i2) => add(q, mul(N[Math.min(N.length - 1, i2 * 3)], w * off))), false)}" stroke="${c.dark}" stroke-width="1.8" fill="none" opacity="0.55" stroke-dasharray="${f1(w * 1.5)} ${f1(w * 0.8)}"/>`; }
  s += `<g filter="url(#kRag)">${licks}<path d="${K.pathD([...A, ...B.slice().reverse()], true)}" fill="${c.body}" stroke="${c.dark}" stroke-width="3"/><path d="${K.pathD([...C1, ...C2.slice().reverse()], true)}" fill="${c.core}"/>${ink}</g>`;
  for (let i = 0; i < 30; i++) { const t = r(), q = P[Math.floor(t * (P.length - 1))], p2 = add(q, [(r() - 0.5) * w * 2.4, -w * (0.3 + r() * 1.6)]); s += `<path d="M${f1(p2[0])},${f1(p2[1])}l${f1(1 + r() * 3)},${f1(-2 - r() * 4)}" stroke="${r() < 0.6 ? c.core : '#2a2020'}" stroke-width="${f1(1.8 + r() * 2)}" stroke-linecap="round"/>`; }
  return s;
}
function waterCurl(r, c0, R, dir, c) {   // a wave curl rising and turning over, a white foam edge, a low crown splash whose tips end in round beads, round droplets
  const sx = (dir && dir[0] < 0) ? -1 : 1, foamC = '#eef4f6';
  const spine = [[-1.1, 0.35], [-0.6, 0.2], [-0.15, -0.25], [0.2, -0.7], [0.62, -0.85], [0.9, -0.62], [0.82, -0.32], [0.55, -0.3]].map(([x, y]) => add(c0, [sx * x * R, y * R]));
  let s = K.drybrush(r, spine, R * 0.5, c.dark, { profile: t => 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.05)), dry: 0.3, op: 0.95, bodyLen: 0.95, bristles: 14 });
  s += K.drybrush(r, spine.map(q => add(q, [0, -R * 0.06])), R * 0.38, c.body, { profile: t => 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.05)), dry: 0.3, op: 0.95, bodyLen: 0.95, bristles: 12 });
  s += K.motionHatch(r, spine.slice(0, 5).map(q => add(q, [0, R * 0.16])), R * 0.16, INK, { lw: 1.6, op: 0.6, grow: false, step: 6 });
  /* round 10c (coordinator): the body was one flat blue tube (a tentacle, a slide) and its foam marks were paired arcs
     that read as seagulls. The body now carries a lighter band and long thin streaks running with the flow, and the foam
     is broken crests curling over along the lip (single hooked strokes of uneven length, never a pair) with spray dots. */
  const sp = K.catmull(spine, 6), band = sp.slice(1, Math.round(sp.length * 0.85));
  s += K.drybrush(r, band.filter((q, i) => i % 3 === 0).map(q => add(q, [0, -R * 0.1])), R * 0.14, '#6a94b8', { profile: t => 0.2 + 0.8 * Math.sin(Math.PI * t), dry: 0.7, op: 0.55, body: false, bristles: 8 });
  for (let k2 = 0; k2 < 4; k2++) { const off = R * (-0.16 + k2 * 0.1), seg = band.slice(Math.floor(band.length * (0.05 + 0.1 * k2)), Math.floor(band.length * (0.6 + 0.1 * k2))); if (seg.length > 2) s += `<path d="${K.pathD(seg.filter((q, i) => i % 2 === 0).map(q => add(q, [0, off])), false)}" stroke="${k2 % 2 ? '#6a94b8' : c.dark}" stroke-width="${f1(Math.max(1.4, R * 0.022))}" fill="none" opacity="0.7" stroke-linecap="round"/>`; }
  const placed = [];
  for (let i = 0; i < 9; i++) { const t = 0.3 + 0.62 * i / 8 + (r() - 0.5) * 0.04, q = sp[Math.min(sp.length - 2, Math.floor(t * (sp.length - 1)))], q2 = sp[Math.min(sp.length - 1, Math.floor(t * (sp.length - 1)) + 1)], d = norm(sub(q2, q)), n = [d[1], -d[0]], top = add(q, mul(n[1] < 0 ? n : mul(n, -1), R * 0.24)), L2 = R * (0.08 + r() * 0.12), tip = add(top, mul(d, L2));
    if (r() < 0.25 || Math.abs(d[0]) < 0.6 || placed.some(q2 => Math.hypot(q2[0] - top[0], q2[1] - top[1]) < R * 0.2)) continue;   /* broken: gaps along the crest; only where the crest runs across (a curl on the falling front stood upright and crossed its neighbour into a little figure), and never on top of another */
    placed.push(top);
    s += `<path d="M${f1(top[0] - d[0] * L2 * 0.6)},${f1(top[1] - d[1] * L2 * 0.6)}Q${f1(tip[0])},${f1(tip[1] - R * 0.05)} ${f1(tip[0] + d[0] * R * 0.02)},${f1(tip[1] + R * 0.05)}" stroke="${foamC}" stroke-width="${f1(Math.max(2.2, R * 0.035))}" fill="none" stroke-linecap="round"/>`;
    for (let j = 0; j < 2; j++) { const dq = add(tip, [(r() - 0.3) * R * 0.15, -R * (0.04 + r() * 0.1)]); s += `<circle cx="${f1(dq[0])}" cy="${f1(dq[1])}" r="${f1(R * (0.012 + r() * 0.014))}" fill="${foamC}"/>`; } }
  for (let i = 0; i < 7; i++) { const q = add(spine[6], [(r() - 0.5) * R * 0.4, (r() - 0.3) * R * 0.3]); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(R * (0.03 + r() * 0.04))}" fill="${foamC}" stroke="${INK}" stroke-width="1"/>`; }
  // the crown: short rounded arcs rising off a low rim, each ending in a round bead
  const base = add(c0, [sx * R * 0.25, R * 0.55]);
  s += `<ellipse cx="${f1(base[0])}" cy="${f1(base[1])}" rx="${f1(R * 0.7)}" ry="${f1(R * 0.14)}" fill="${c.body}" stroke="${INK}" stroke-width="2"/><path d="M${f1(base[0] - R * 0.6)},${f1(base[1] - R * 0.03)}Q${f1(base[0])},${f1(base[1] - R * 0.16)} ${f1(base[0] + R * 0.6)},${f1(base[1] - R * 0.03)}" stroke="${foamC}" stroke-width="2.4" fill="none"/>`;
  for (let i = 0; i < 8; i++) { const t = (i + 0.5) / 8, x0 = base[0] - R * 0.65 + t * R * 1.3, h = R * (0.18 + r() * 0.22) * (1 - Math.abs(t - 0.5)), out = (t - 0.5) * R * 0.5, tip = [x0 + out, base[1] - h];
    s += `<path d="M${f1(x0)},${f1(base[1] - R * 0.05)}Q${f1(x0 + out * 0.2)},${f1(base[1] - h * 0.8)} ${f1(tip[0])},${f1(tip[1])}" stroke="${c.body}" stroke-width="${f1(Math.max(3, R * 0.06))}" fill="none" stroke-linecap="round"/><circle cx="${f1(tip[0])}" cy="${f1(tip[1] - R * 0.03)}" r="${f1(R * (0.045 + r() * 0.03))}" fill="${c.core}" stroke="${INK}" stroke-width="1.4"/>`; }
  for (let i = 0; i < 16; i++) { const a = -Math.PI * (0.1 + r() * 0.8), d = R * (0.7 + r() * 0.8), q = add(c0, [Math.cos(a) * d * sx, Math.sin(a) * d * 0.8]), rr = R * (0.025 + r() * 0.035); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(rr)}" fill="${c.core}" stroke="${INK}" stroke-width="1.2"/><circle cx="${f1(q[0] - rr * 0.3)}" cy="${f1(q[1] - rr * 0.3)}" r="${f1(rr * 0.35)}" fill="${foamC}"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
function fumeCloud(r, c0, R, c, dir = [1, 0]) {   // a drifting fume you can see through: translucent lobes with no ink outline, wisps curling off, faint hatching
  const sx = dir[0] < 0 ? -1 : 1; let s = '';
  const lobes = [[-0.9, 0.2, 0.55, 0.3, 0.42], [-0.4, 0.05, 0.75, 0.42, 0.5], [0.2, -0.15, 0.85, 0.5, 0.55], [0.75, -0.4, 0.6, 0.38, 0.46], [0.35, -0.7, 0.45, 0.28, 0.36]];
  for (const [dx, dy, w, h, op] of lobes) s += `<path d="${K.pathD(K.blob(r, add(c0, [sx * dx * R, dy * R]), w * R, 14, 0.4, h / w), true)}" fill="${c.fume}" opacity="${f1(Math.min(0.8, op * 1.4))}" filter="url(#kRag)"/>`;
  /* round 10b: the dark fume alone vanished on the green grounds (strips at 170 px), and lit lobe crowns read as bushes.
     The fume now reads by long see-through wisps drifting off it: dry-brush streaks of a sickly lit green along the drift,
     curling up at their ends, and a darker belly. No lobe outline anywhere. */
  for (let i = 0; i < 5; i++) { const y0 = c0[1] + R * (-0.55 + i * 0.22), x0 = c0[0] - sx * R * (1.0 - r() * 0.3), x1 = c0[0] + sx * R * (0.9 + r() * 0.7), lift = R * (0.12 + r() * 0.2);
    const pts = [[x0, y0 + lift * 0.3], [lerp([x0, 0], [x1, 0], 0.35)[0], y0 - lift * 0.4], [lerp([x0, 0], [x1, 0], 0.7)[0], y0 + lift * 0.2], [x1, y0 - lift], [x1 - sx * R * 0.12, y0 - lift * 1.9]];
    s += K.drybrush(r, pts, R * (0.16 + r() * 0.08), i % 2 ? c.body : c.core, { profile: t => 0.3 + 0.7 * Math.sin(Math.PI * t), dry: 0.85, body: false, op: i % 2 ? 0.6 : 0.42, bristles: 9 }); }
  s += `<path d="${K.pathD(K.blob(r, add(c0, [0, R * 0.25]), R * 1.0, 14, 0.3, 0.28), true)}" fill="${c.dark}" opacity="0.32" filter="url(#kRag)"/>`;
  for (let i = 0; i < 6; i++) { const q = add(c0, [sx * (r() - 0.4) * R * 1.6, (r() - 0.6) * R * 0.8]); s += K.drybrush(r, [q, add(q, [sx * R * 0.25, -R * 0.12]), add(q, [sx * R * 0.4, -R * 0.02]), add(q, [sx * R * 0.32, R * 0.08])], R * 0.1, '#3e4a22', { dry: 1, op: 0.75, body: false, bristles: 5 }); }
  return s;
}
function ooze(r, c0, R, c) {   // sickly ooze dripping into a pool that bubbles, a few bubbles popping
  const g = '#5e6a24', gl = '#a8b060'; /* a dark sickly green, not slime (rule 8) */ let s = `<g filter="url(#kRag)"><path d="${K.pathD(K.blob(r, c0, R * 0.8, 16, 0.35, 0.2), true)}" fill="${g}" stroke="${c.dark}" stroke-width="2.2" opacity="0.92"/></g>`;
  for (let i = 0; i < 7; i++) { const q = add(c0, [(r() - 0.5) * R * 1.2, -R * 0.03 - r() * R * 0.05]), b = R * (0.04 + r() * 0.06); s += r() < 0.75 ? `<circle cx="${f1(q[0])}" cy="${f1(q[1] - b)}" r="${f1(b)}" fill="${gl}" stroke="${c.dark}" stroke-width="1.4"/><circle cx="${f1(q[0] - b * 0.35)}" cy="${f1(q[1] - b * 1.35)}" r="${f1(b * 0.3)}" fill="#f0f0c8"/>` : `<path d="M${f1(q[0] - b)},${f1(q[1])}a${f1(b)},${f1(b)} 0 0 1 ${f1(b * 0.7)},${f1(-b)}M${f1(q[0] + b)},${f1(q[1])}a${f1(b)},${f1(b)} 0 0 0 ${f1(-b * 0.7)},${f1(-b)}" stroke="${c.dark}" stroke-width="1.4" fill="none"/>` + [0, 1, 2].map(k => `<circle cx="${f1(q[0] + (k - 1) * b * 0.8)}" cy="${f1(q[1] - b * (1.4 + r()))}" r="1.6" fill="${gl}"/>`).join(''); }
  return s;
}
function oozeDrips(r, pts, R) { let s = ''; for (const q of pts) { const l = R * (0.15 + r() * 0.3), w = R * 0.05; s += `<path d="M${f1(q[0] - w)},${f1(q[1])}Q${f1(q[0] - w)},${f1(q[1] + l)} ${f1(q[0])},${f1(q[1] + l + w)}Q${f1(q[0] + w)},${f1(q[1] + l)} ${f1(q[0] + w)},${f1(q[1])}Z" fill="#5e6a24" stroke="#1e2410" stroke-width="1.4"/>`; } return s; }
// ---- the projectile in flight (Cole: "the WHOLE projectile should be the elemental effect"): from the moment it leaves
// the hand or nib it is the element; the ink lives in the drawing (woodcut line and hatching), not in a liquid stroke.
// o.inkPart is accepted and ignored (kept so callers need not change).
function shard(r, p, d, z, c) {   // an angular ice splinter pointing along d, inked, with a lit facet
  const n = [-d[1], d[0]], tip = add(p, mul(d, z)), tail = add(p, mul(d, -z * 0.55)), a = add(p, mul(n, z * 0.22)), b = add(add(p, mul(n, -z * 0.16)), mul(d, z * 0.1));
  return `<path d="M${f1(tail[0])},${f1(tail[1])}L${f1(a[0])},${f1(a[1])}L${f1(tip[0])},${f1(tip[1])}L${f1(b[0])},${f1(b[1])}Z" fill="${c.body}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="miter"/><path d="M${f1(a[0])},${f1(a[1])}L${f1(tip[0])},${f1(tip[1])}" stroke="${c.core}" stroke-width="1.4"/><path d="M${f1(tail[0])},${f1(tail[1])}L${f1(b[0])},${f1(b[1])}" stroke="${c.dark}" stroke-width="1.6"/>`;
}
function stroke(r, course, pts, w, o = {}) {
  const c = COL[course], P = K.catmull(pts, 10), L = K.plen(P);
  const at = t => { const i = Math.min(P.length - 2, Math.floor(t * (P.length - 1))); return [P[i], norm(sub(P[i + 1], P[i]))]; };
  if (!c) return K.drybrush(r, P.filter((q, i) => i % 3 === 0 || i === P.length - 1), w, INK, { profile: t => 0.15 + 0.85 * t, dry: 0.8, body: false, op: 0.85, bristles: 10 });
  let s = '';
  if (course === 'fire') {   // a jet of flame from the hand along the whole throw (round 10: not standing flames)
    for (let i = 0; i < 4; i++) { const [q] = at(0.1 + i * 0.22); s += K.billow(r, add(q, [0, -w * 2.4 - i * w * 0.3]), w * (1 + i * 0.2), w * 0.5, COL.fire.smoke, { op: 0.35, lw: 2, curls: 1 }); }
    s += flameJet(r, P, w * 2.0, c);   // wide enough to read as a jet at 162 px
  } else if (course === 'frost') {   // a stream of ice shards: angular splinters and icicles flying along the path, cold vapour, specks
    for (let i = 0; i < 4; i++) { const [q] = at(0.15 + i * 0.25); s += K.billow(r, q, w * 1.5, w * 0.55, '#c8d8e0', { op: 0.35, lw: 2, curls: 1 }); }
    const n = Math.max(8, Math.round(L / (w * 0.9)));
    let sh = '';
    for (let i = 0; i < n; i++) { const t = i / (n - 1), [q, d] = at(t), nn = [-d[1], d[0]], j = add(q, mul(nn, (r() - 0.5) * w * 1.6)), dd = norm(add(d, mul(nn, (r() - 0.5) * 0.5))); sh += shard(r, j, dd, w * (1.6 + r() * 1.2) * (1.1 - 0.3 * t), c); }
    s += `<g filter="url(#kWob)">${sh}</g>`;
    for (let i = 0; i < 40; i++) { const [q] = at(r()); const p = add(q, [(r() - 0.5) * w * 3, (r() - 0.5) * w * 2.4]); s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(1.2 + r() * 2)}" fill="${c.core}" stroke="${INK}" stroke-width="0.5"/>`; }
  } else if (course === 'lightning') {   // the bolt itself, already forked, from the hand to the target
    s += bolt(r, jag(r, P[0], P[P.length - 1], 10, w * 1.3), w * 1.1, c);
    for (let k = 2; k < 9; k += 2) { const [q] = at(k / 10); s += bolt(r, jag(r, q, add(q, [(r() - 0.3) * w * 5, (r() < 0.5 ? -1 : 1) * w * (2 + r() * 2.5)]), 3, w * 0.6), w * 0.55, c); }
  } else if (course === 'water') {   // a jet that breaks apart: a narrow column from the hand widening, fraying into ragged spray and foam
    const N = K.normals(P), cut = Math.round(P.length * 0.6), body = P.slice(0, cut + 1), Q = body.filter((q, i) => i % 3 === 0 || i === body.length - 1);
    s += K.drybrush(r, Q, w * 1.25, c.dark, { profile: t => 0.25 + 0.75 * t, dry: 0.35, op: 0.95, bodyLen: 0.95, bristles: 12 }) + K.drybrush(r, Q.map(q => add(q, [0, -w * 0.12])), w * 0.95, c.body, { profile: t => 0.25 + 0.75 * t, dry: 0.35, op: 0.95, bodyLen: 0.95, bristles: 10 });
    s += K.motionHatch(r, body.map((q, i) => add(q, mul(N[i], w * 0.45 * (0.3 + 0.7 * i / body.length)))), w * 0.6, INK, { lw: 1.8, op: 0.75, step: 6 });   // the underside hatched
    for (let i = 2; i < body.length - 1; i += 3) { const q = body[i], d = norm(sub(body[i + 1], q)), f = add(q, mul(N[i], -w * 0.2 * (0.3 + i / body.length))); s += `<path d="M${f1(f[0])},${f1(f[1])}l${f1(d[0] * w * 0.9)},${f1(d[1] * w * 0.9)}" stroke="#7aa2c2" stroke-width="2" stroke-linecap="round" opacity="0.9"/>`; }   // flow lines, a mid blue: pale ones crossed the white foam into little figures (round 12)
    const end = P[cut], tip = P[P.length - 1], dd = norm(sub(tip, end)), nn = [-dd[1], dd[0]], Lr = len(sub(tip, end));
    /* round 12: no frayed strands fanned from one point: five strokes from a point drew a little stick figure at the wave's tip (coordinator). The jet breaks into round spray only */
    for (let i = 0; i < 26; i++) { const t = r(), q = add(lerp(end, tip, t), mul(nn, (r() - 0.5) * Lr * 0.9)), rr = 2 + r() * 4, d2 = dd; s += `<path d="${K.pathD([add(q, mul(d2, -rr * 2.3)), add(q, mul(nn, rr)), add(q, mul(d2, rr)), add(q, mul(nn, -rr))], true)}" fill="${r() < 0.6 ? c.core : c.body}" stroke="${INK}" stroke-width="1.2"/>`; }   // spray and droplets
  } else if (course === 'toxin') {   // a see-through fume drifting along the path, ooze dripping off it
    const n = Math.max(4, Math.round(L / (w * 2.4)));
    for (let i = 0; i < n; i++) { const t = i / (n - 1), [q, d] = at(t); s += fumeCloud(r, add(q, [0, -w * 0.3]), w * (1.4 + t * 0.9), c, d); }
    s += oozeDrips(r, Array.from({ length: 6 }, () => add(at(0.25 + r() * 0.7)[0], [(r() - 0.5) * w * 2, w * 0.7])), w * 3);
  } else if (course === 'void') {   // a dark rift travelling along the path: a ragged tear, black inside, its lips lit, the air hatched in toward it
    const A2 = [], B2 = [], N = K.normals(P);
    P.forEach((q, i) => { const t = i / (P.length - 1), ww = w * 1.5 * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (0.7 + r() * 0.5); A2.push(add(q, mul(N[i], ww))); B2.push(add(q, mul(N[i], -ww * 0.7))); });
    for (let i = 2; i < P.length - 2; i += 3) { const q = P[i], nn = N[i], far = add(q, mul(nn, (i % 6 < 3 ? 1 : -1) * w * 3)); s += K.motionHatch(r, [far, lerp(far, q, 0.6), add(q, mul(nn, (i % 6 < 3 ? 1 : -1) * w * 0.9))], 14, INK, { lw: 2, op: 0.7 }); }
    s += `<g filter="url(#kRag)"><path d="${K.pathD([...A2, ...B2.slice().reverse()], true)}" fill="${c.dark}" stroke="${c.body}" stroke-width="3"/><path d="${K.pathD(A2, false)}" stroke="${c.core}" stroke-width="1.6" fill="none" opacity="0.8"/></g>`;
  }
  return `<g data-fx="element-path-${course}">${s}</g>`;
}
// ---- where it lands
function impact(r, course, c0, R, o = {}) {
  const c = COL[course], floorY = o.floorY;
  if (!c) return K.impact(r, c0, R, INK, { rays: 7, core: false });
  let s = '';
  if (course === 'fire') { s += fireBurst(r, c0, R * 1.05, c, o.dir || [1, 0]); if (floorY) s += `<g filter="url(#kRag)"><ellipse cx="${f1(c0[0])}" cy="${f1(floorY)}" rx="${f1(R * 1.5)}" ry="${f1(R * 0.28)}" fill="none" stroke="${c.dark}" stroke-width="${f1(R * 0.22)}" opacity="0.85"/></g>`; }
  else if (course === 'frost') {   // a heap of splinters (no radial starburst, rule 8): bases scattered over an uneven heap, pointing mostly away from the hit
    const d = norm(o.dir || [1, 0]), low = floorY && floorY - c0[1] < R * 1.2, base = low ? -Math.PI / 2 + (d[0] < 0 ? -0.55 : 0.55) : Math.atan2(d[1], d[0]); let sh = '';   /* a hit on the floor bursts up and forward: a forward fan there had every long splinter cut by the floor and turned straight up */
    for (let i = 0; i < 18; i++) {
      const sc = i % 3 === 0 ? 0.35 : 1, p = add(c0, [(r() - 0.35) * R * 1.3 * sc, (r() - 0.2) * R * 0.7 * sc]),   /* the long splinters spring from near the hit, so their lengths (not their scatter) set the heap's outline */ away = r() < 0.75, a = low && i % 2 ? Math.atan2(d[1], d[0]) - 0.15 - r() * 0.35 : away ? base + (r() - 0.3) * 2.2 - 0.35 : -Math.PI / 2 + (r() - 0.5) * 1.4, z = R * (i % 3 === 0 ? [2.1, 1.3, 0.9, 0.65, 1.1, 0.75][i / 3] * (0.9 + r() * 0.2) : i % 3 === 1 ? 0.45 + r() * 0.3 : 0.18 + r() * 0.17);   /* the long tier is set uneven (one long splinter, the rest stepping down): six random lengths came out even more often than not, and a heap of even splinters reads as a starburst */   // three tiers of length   // long and short splinters, so the heap never reads as a ring of equal spikes
      /* a splinter the frame edge would cut turns until it fits (either way first, at random), and if no turn fits it is
         shortened by a random share of its room. Cut tips all end at the edge and read as rays of one length (Heavy Pour
         CV 0.07); shortening alone left a heap at the edge small and even (Ink Bolt cover 0.09). */
      const roomAt = an => Math.min(...[[Math.cos(an), 14 - p[0], K.W - 14 - p[0]], [Math.sin(an), 14 - p[1], K.H - 6 - p[1]]].map(([dd, lo, hi]) => dd > 1e-6 ? hi / dd : dd < -1e-6 ? lo / dd : 1e9)) / 1.45;
      let aa = a; const sg = r() < 0.5 ? 1 : -1;
      for (let t = 1; t <= 7 && roomAt(aa) < z; t++) aa = a + (t % 2 ? sg : -sg) * Math.ceil(t / 2) * 0.45;
      const room = roomAt(aa), zz = z <= room ? z : Math.max(R * 0.15, room * (0.55 + r() * 0.4));
      sh += shard(r, add(p, [Math.cos(aa) * zz * 0.45, Math.sin(aa) * zz * 0.45]), [Math.cos(aa), Math.sin(aa)], zz, c);
    }
    for (let i = 0; i < 2; i++) { /* two fallen bits, not five: a ring of fallen bits at one depth read as even rays below the heap */ const q = add(c0, [(r() - 0.3) * R * 1.6, R * (0.6 + r() * 0.8)]), a = r() * 6.28; sh += shard(r, q, [Math.cos(a), Math.sin(a)], R * (0.12 + r() * 0.14), c); s += K.motionHatch(r, [add(q, [0, -R * 0.35]), add(q, [0, -R * 0.18]), add(q, [0, -R * 0.06])], 10, INK, { lw: 1.4, op: 0.6 }); }
    const fy = floorY || c0[1] + R * 0.8;
    s += `<g opacity="0.55">${K.inkRime(r, [[c0[0] - R * 0.45, fy - 4], [c0[0] + R * 0.2, fy - 9], [c0[0] + R * 0.8, fy - 2], [c0[0] + R * 1.4, fy - 7]], R * 0.2)}</g>` + `<g filter="url(#kWob)">${sh}</g>`;   /* the rime crust lies flat and see-through under the heap: full white, it read as two more rays of one length along the floor */
    for (let i = 0; i < 26; i++) { const q = add(c0, [(r() - 0.4) * R * 3, (r() - 0.4) * R * 2.2]); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(1.3 + r() * 2)}" fill="${c.core}" stroke="${INK}" stroke-width="0.5"/>`; }
  }
  else if (course === 'lightning') { for (let k = 0; k < 6; k++) { const a = -2.5 + k * 0.7 + (r() - 0.5) * 0.4; s += bolt(r, jag(r, c0, add(c0, [Math.cos(a) * R * 2.0, Math.sin(a) * R * 1.6]), 4, R * 0.3), R * 0.38, c); } if (floorY) s += scar(r, [c0[0], floorY], R * 1.6, c); }
  else if (course === 'water') { s += waterCurl(r, c0, R * 1.25, o.dir || [1, 0], c); if (floorY) s += puddle(r, [c0[0] + R * 0.3, floorY], R * 1.6, c); }
  else if (course === 'toxin') {   /* the fume, ooze hanging from its belly and falling in drops, and the pool it lands in on the floor (round 10b: the pool floated in mid-air when the hit was high) */
    const py = floorY ? Math.max(c0[1] + R * 0.6, floorY - R * 0.05) : c0[1] + R * 0.8, pool = [c0[0] + R * 0.1, py];
    s += fumeCloud(r, c0, R * 1.15, c, o.dir || [1, 0]) + oozeDrips(r, [add(c0, [-R * 0.3, R * 0.28]), add(c0, [R * 0.15, R * 0.34]), add(c0, [R * 0.55, R * 0.22])], R);
    for (let i = 0; i < 4; i++) { const x = c0[0] + R * (-0.25 + i * 0.25), y = lerp([0, c0[1] + R * 0.75], [0, py - R * 0.12], (i + 0.5) / 4)[1], z = R * (0.04 + 0.01 * (i % 2)); s += `<path d="M${f1(x)},${f1(y - z * 2.2)}Q${f1(x + z)},${f1(y)} ${f1(x)},${f1(y + z)}Q${f1(x - z)},${f1(y)} ${f1(x)},${f1(y - z * 2.2)}Z" fill="#5e6a24" stroke="${c.dark}" stroke-width="1.4"/>`; }
    s += ooze(r, pool, R * 0.9, c); }
  else if (course === 'void') { s += hole(r, c0, R * 1.15, c); }
  return `<g data-fx="element-${course}">${s}</g>`;
}
// ---- poured: the stream leaves the mouth as ink and falls as the element, landing as the element
function pour(r, course, mouth, floor, w) {
  const mid = [lerp(mouth, floor, 0.45)[0] + w * 2, lerp(mouth, floor, 0.45)[1]], pts = [mouth, add(mouth, [w * 2.5, w * 1.6]), mid, floor];
  const land = course === 'fire' ? puddle(r, floor, w * 9, { dark: '#5a2a10', core: '#eab45a' }) + fireBurst(r, add(floor, [w * 0.5, -w * 3.2]), w * 6.5, COL.fire) : impact(r, course, add(floor, [0, -w * 5]), w * 7, { floorY: floor[1], dir: [1, -0.3] });   // landed high enough that the frame edge does not clip it
  return stroke(r, course, pts, w) + `<g class="cimp">${land}</g>`;   // cimp: the landing alone, for the L61 symmetry check   // the whole fall is the element; fire lands as a burning pool
}
module.exports = { COL, ELEMENTS, isElement, stroke, impact, pour, hole, crest, hoar, spurs, tongues, bolt, jag, mould, fireMass, fumeMass, fireBurst, flameJet, waterCurl, fumeCloud, ooze };
