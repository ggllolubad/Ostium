// Card art kit: grounds, ink FX, object details and posed heroes for Ostium card illustrations, in Living Ink.
// Every card is drawn at 1120 x 612 (the 560 x 306 card art at 2x) and downscaled once at the end.
// Heroes and objects are drawn with the figure engine itself (engine.js Fig, kit.base), so line weight, cel shadow,
// hatching, grit and wobble are the same as the hero figures. Nothing here changes the frozen shared files.
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('../engine');
const KIT = require('../kit');
const { add, sub, mul, lerp, rot, mix, rng, smooth, ell, norm, len, Fig } = E;

const W = 1120, H = 612, INK = KIT.INK;
const PARTY = path.join(__dirname, '..');
const ROOMS = '/home/claude/ostium/assets/art/rooms/';
const f1 = n => Math.round(n * 10) / 10;

// ==== colour
// Course washes for the ground. wash = the room is multiplied by this, deep = the shadow it falls to,
// pool = the light behind the subject, ink = the course's ink from the Elementalist's six pots (bible 01).
const COURSE = {
  physical: { wash: '#8a7458', deep: '#1c140d', pool: '#ead8b4', ink: '#6a4a2e' },
  fire: { wash: '#8a5a40', deep: '#1c0e08', pool: '#e8c8a0', ink: '#b8341f' },
  frost: { wash: '#6c8696', deep: '#10181e', pool: '#e2eaea', ink: '#8fb2c9' },
  lightning: { wash: '#8a7a48', deep: '#18140a', pool: '#efe6c2', ink: '#c9a43a' },
  water: { wash: '#3e5e74', deep: '#0a1218', pool: '#cad8d6', ink: '#2f4f8f' },
  toxin: { wash: '#5e6e3e', deep: '#11150a', pool: '#dcdcb0', ink: '#7d9a3a' },
  void: { wash: '#54465e', deep: '#0d0a12', pool: '#dcd2e0', ink: '#4b2a5c' },
};
const INK6 = { fire: '#b8341f', frost: '#8fb2c9', lightning: '#c9a43a', water: '#2f4f8f', toxin: '#7d9a3a', void: '#4b2a5c' };
const BLOOD = '#4c0c08', BLOOD_L = '#661510', BONE = '#d8ccb0', PAPER = '#e4d6b8';
// a course's FX ink: its bible ink pulled toward the game's ink so it reads as ink, not paint (NOTES rule 7: 0.6 to 0.74).
// The Elementalist's attuned cards pull less (ATTUNED_PULL, LESSONS L60), so the six element variants of one card
// (<id>~fire ... <id>~void) can be told apart at 162 x 86.
const ATTUNED_PULL = 0.3;
function courseInk(course, o = {}) { if (course === 'physical' || !INK6[course]) return INK; return mix(INK6[course], '#16110e', o.attuned ? ATTUNED_PULL : (o.pull ?? 0.62)); }

// ==== geometry helpers
function catmull(pts, n = 8) { // open Catmull-Rom resample
  const out = [], P = i => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < n; k++) {
    const t = k / n, p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), t2 = t * t, t3 = t2 * t;
    out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
  }
  out.push(pts[pts.length - 1].slice(0, 2));
  return out;
}
function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += len(sub(pts[i], pts[i - 1])); return s; }
function normals(P) { return P.map((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], d = norm(sub(b, a)); return [-d[1], d[0]]; }); }
const pathD = (pts, closed) => smooth(pts, closed, 1);
const polyD = pts => 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L') + 'Z';
function arc(c, rx, ry, a0, a1, n = 16, ang = 0) { const o = []; for (let i = 0; i <= n; i++) { const a = E.deg(a0 + (a1 - a0) * i / n); o.push(add(c, rot([Math.cos(a) * rx, Math.sin(a) * ry], ang))); } return o; }
// a ragged closed blob: r(theta) jittered, for stains, splats and holes
function blob(r, c, rad, n = 14, jit = 0.35, sq = 1, ang = 0) { const o = []; for (let i = 0; i < n; i++) { const a = Math.PI * 2 * i / n + (r() - 0.5) * 0.3, rr = rad * (1 - jit / 2 + r() * jit); o.push(add(c, rot([Math.cos(a) * rr, Math.sin(a) * rr * sq], ang))); } return o; }

// ==== card-level defs
// k* ids belong to the card layer; figure and object Figs bring their own seed-numbered defs.
function cardDefs(seed, c) {
  return `
<filter id="kRough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="${seed}" result="a"/><feDisplacementMap in="SourceGraphic" in2="a" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="${seed + 1}" result="b"/><feDisplacementMap in="d" in2="b" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="kRag" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" seed="${seed + 2}" result="a"/><feDisplacementMap in="SourceGraphic" in2="a" scale="10" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="kWob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" seed="${seed + 3}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="kRoom" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.6"/><feColorMatrix type="saturate" values="0.25"/><feComponentTransfer><feFuncR type="gamma" amplitude="0.95" exponent="1.25"/><feFuncG type="gamma" amplitude="0.95" exponent="1.25"/><feFuncB type="gamma" amplitude="0.95" exponent="1.25"/></feComponentTransfer></filter>
<filter id="kRoomL" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.2"/><feColorMatrix type="saturate" values="0.2"/><feComponentTransfer><feFuncR type="linear" slope="0.75" intercept="0.3"/><feFuncG type="linear" slope="0.75" intercept="0.3"/><feFuncB type="linear" slope="0.75" intercept="0.3"/></feComponentTransfer></filter>
<filter id="kSoot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.006" numOctaves="4" seed="${seed + 4}"/><feColorMatrix values="0 0 0 0 0.06  0 0 0 0 0.045  0 0 0 0 0.03  0 0 0 -2.6 1.45"/></filter>
<filter id="kTide" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" seed="${seed + 5}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 0 0 0 -0.55" result="n"/><feComponentTransfer in="n" result="m"><feFuncA type="discrete" tableValues="0 0 0 0 1 1 1 1"/></feComponentTransfer><feMorphology in="m" operator="erode" radius="1.2" result="e"/><feComposite in="m" in2="e" operator="out" result="ring"/><feFlood flood-color="${mix(c.deep, '#3a2414', 0.4)}" result="col"/><feComposite in="col" in2="ring" operator="in" result="r1"/><feFlood flood-color="${c.deep}" flood-opacity="0.28"/><feComposite in2="m" operator="in"/><feMerge><feMergeNode/></feMerge></filter>
<filter id="kSpeck" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="1" seed="${seed + 6}"/><feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0 0.04  0 0 -3 0 1.62"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0.85"/></feComponentTransfer></filter>
<filter id="kGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed + 7}"/><feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.075  0 0 0 0 0.05  0 0 0 -1.9 1.05"/></filter>
<filter id="kPool" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="${seed + 8}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="34"/></filter>
<filter id="kSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="kHaze" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="${seed + 9}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="5"/></filter>
<radialGradient id="kVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="${c.deep}" stop-opacity="0"/><stop offset="1" stop-color="${c.deep}" stop-opacity="0.85"/></radialGradient>`;
}

// ==== grounds
const imgCache = {};
function dataURI(file) { if (!imgCache[file]) imgCache[file] = 'data:image/webp;base64,' + fs.readFileSync(file).toString('base64'); return imgCache[file]; }
// The card's room, cropped, greyed, darkened and washed in the course colour, with soot, tide stains and specks laid
// over it, a focal pool of key light behind the subject, and hand-laid crosshatch closing in from the edges.
// o: room, x (left of the crop in source px), y (top), w (source px shown across the card), c (course), pool [cx, cy, rx, ry]
function ground(r, o) {
  const c = o.c, sw = o.w || 1757, s = W / sw, sx = o.x || 0, sy = o.y || 0;
  const layers = (o.layers || ['far', 'mid']).map(l => ROOMS + o.room + '_' + l + '.webp').filter(f => fs.existsSync(f));
  const img = layers.map(f => `<image href="${dataURI(f)}" x="${f1(-sx * s)}" y="${f1(-sy * s)}" width="${f1(2960 * s)}" height="${f1(960 * s)}" preserveAspectRatio="none"/>`).join('');
  const [px, py, prx, pry] = o.pool || [W / 2, H / 2, 300, 220];
  const pl = o.poolOp ?? 0.9;
  let g = `<defs><mask id="kPoolM" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/><ellipse cx="${px}" cy="${py}" rx="${prx}" ry="${pry}" fill="#fff" opacity="${pl}" filter="url(#kPool)"/><ellipse cx="${px - prx * 0.12}" cy="${py - pry * 0.12}" rx="${prx * 0.5}" ry="${pry * 0.5}" fill="#fff" filter="url(#kPool)"/></mask></defs>`;
  g += `<rect width="${W}" height="${H}" fill="${c.deep}"/>`;
  // the room in shadow: greyed, darkened, multiplied by the course wash
  g += `<g filter="url(#kRoom)" opacity="${o.roomOp ?? 0.9}">${img}</g>`;
  g += `<rect width="${W}" height="${H}" fill="${c.wash}" style="mix-blend-mode:multiply" opacity="${o.washOp ?? 0.95}"/>`;
  g += `<rect width="${W}" height="${H}" fill="${c.deep}" opacity="${o.dark ?? 0.35}"/>`;
  // the same room lifted inside the key light pool, so the pool keeps the room's texture instead of a flat glow
  g += `<g mask="url(#kPoolM)"><g style="isolation:isolate"><rect width="${W}" height="${H}" fill="${mix(c.pool, c.wash, 0.35)}"/><g filter="url(#kRoomL)" style="mix-blend-mode:multiply">${img}</g><rect width="${W}" height="${H}" fill="${c.wash}" style="mix-blend-mode:color" opacity="0.6"/></g></g>`;
  // soot and water damage
  g += `<rect width="${W}" height="${H}" filter="url(#kSoot)" opacity="${o.soot ?? 0.85}"/>`;
  g += `<rect width="${W}" height="${H}" filter="url(#kTide)" opacity="${o.tide ?? 0.3}"/>`;
  if (o.shaft) g += lightShaft(r, o.shaft, c);
  g += `<rect width="${W}" height="${H}" filter="url(#kSpeck)" opacity="0.8"/>`;
  g += edgeHatch(r, [px, py], Math.max(prx, pry) * (o.hatchR ?? 1.0), o.hatchOp ?? 0.6);
  return g;
}
// a shaft of light falling from the upper left (belfry slats, a broken roof), soft, dusty, hatched at its edges
function lightShaft(r, sh, c) {
  const [x0, w0, x1, w1] = sh;
  const p = [[x0, -20], [x0 + w0, -20], [x1 + w1, H + 20], [x1, H + 20]];
  let g = `<path d="${polyD(p)}" fill="${c.pool}" opacity="0.22" filter="url(#kSoft)" style="mix-blend-mode:screen"/>`;
  for (let i = 0; i < 60; i++) { const t = r(), u = r(), q = lerp(lerp(p[0], p[1], u), lerp(p[3], p[2], u), t); g += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(0.6 + r() * 1.4)}" fill="${c.pool}" opacity="${f1(0.2 + r() * 0.5)}"/>`; }
  return g;
}
// crosshatch laid by hand toward the corners: two directions, each line a slightly bent stroke, density rising with
// distance from the focal point. Replaces a gradient vignette.
function edgeHatch(r, F, R, op = 0.5) {
  let s = '';
  for (const [ang, step, w] of [[-0.66, 9, 1.7], [0.74, 11, 1.4], [-0.1, 13, 1.2]]) {
    const d = [Math.cos(ang), Math.sin(ang)], n = [-d[1], d[0]];
    for (let k = -90; k < 90; k++) {
      const o = add([W / 2, H / 2], mul(n, k * step + (r() - 0.5) * 3));
      let t = -900;
      while (t < 900) {
        const segL = 30 + r() * 70, a = add(o, mul(d, t)), b = add(o, mul(d, t + segL)), m = lerp(a, b, 0.5);
        t += segL + 4 + r() * 10;
        if (m[0] < -20 || m[0] > W + 20 || m[1] < -20 || m[1] > H + 20) continue;
        const dd = len([(m[0] - F[0]) / 1.25, m[1] - F[1]]) / R + (r() - 0.5) * 0.35;
        const need = ang === -0.66 ? 1.0 : ang === 0.74 ? 1.3 : 1.65;
        if (dd < need) continue;
        const bend = mul(n, (r() - 0.5) * 3);
        s += `<path d="M${f1(a[0])},${f1(a[1])}Q${f1(m[0] + bend[0])},${f1(m[1] + bend[1])} ${f1(b[0])},${f1(b[1])}" stroke="${INK}" stroke-width="${f1(w * (0.7 + r() * 0.6))}" fill="none" stroke-linecap="round" opacity="${f1(Math.min(1, 0.5 + (dd - need) * 0.8))}"/>`;
      }
    }
  }
  return `<g filter="url(#kWob)" opacity="${op}">${s}</g>`;
}
// last pass over the whole card: course colour pulled through everything a little, grain, vignette
function finish(c, o = {}) {
  return `<rect width="${W}" height="${H}" fill="${c.wash}" style="mix-blend-mode:soft-light" opacity="${o.unify ?? 0.35}"/>`
    + `<rect width="${W}" height="${H}" fill="url(#kVig)"/>`
    + `<rect width="${W}" height="${H}" filter="url(#kGrain)" opacity="0.3"/>`;
}

// ==== ink FX (SVG strings, card space)
// Dry brush: a loaded brush dragged along pts. Each bristle is its own line that breaks up as the brush dries, so the
// stroke has a dense head, streaky body and ragged split tail. o.profile(t) gives the width along the stroke.
function drybrush(r, pts, w, col, o = {}) {
  const P = catmull(pts, o.res || 10), N = normals(P), L = plen(P);
  const nb = o.bristles || Math.max(7, Math.round(w / 2.4));
  const prof = o.profile || (t => Math.pow(Math.sin(Math.PI * (0.06 + 0.9 * t)), 0.45) * (1 - 0.35 * t));
  const dry = o.dry ?? 0.6;
  let s = '';
  for (let b = 0; b < nb; b++) {
    const u = (b + 0.5) / nb - 0.5 + (r() - 0.5) * 0.6 / nb;
    const t0 = r() * 0.08 * (o.ragStart ?? 1), t1 = 1 - r() * (0.08 + Math.abs(u) * 0.5 * dry);
    const q = [];
    P.forEach((p, i) => { const t = i / (P.length - 1); if (t >= t0 && t <= t1) q.push(add(p, mul(N[i], u * w * prof(t)))); });
    if (q.length < 2) continue;
    // dashes: long wet runs at the head, broken skips later
    let dash = [], acc = 0;
    while (acc < L * 1.05) { const t = acc / L, on = (40 + r() * 140) * (1 - t * dry * 0.8) + 6, off = r() < (0.15 + t * dry) ? 3 + r() * 18 * (0.3 + t) * dry : 0.01; dash.push(f1(on), f1(off)); acc += on + off; }
    const bw = (w / nb) * (1.15 + r() * 0.9) * (o.bw ?? 1);
    s += `<path d="${'M' + q.map(p => f1(p[0]) + ',' + f1(p[1])).join('L')}" stroke="${col}" stroke-width="${f1(bw)}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${dash.join(' ')}" opacity="${f1((o.op ?? 0.95) * (0.7 + r() * 0.3))}"/>`;
  }
  // the loaded head: a solid ragged body under the bristles for the first part of the stroke
  if (o.body !== false) {
    const k = Math.round(P.length * (o.bodyLen ?? 0.45)), A = [], B2 = [];
    for (let i = 0; i < k; i++) { const t = i / (P.length - 1), ww = w * prof(t) * 0.42 * (1 - i / k * 0.6); A.push(add(P[i], mul(N[i], ww))); B2.push(add(P[i], mul(N[i], -ww))); }
    if (k > 2) s = `<path d="${pathD([...A, ...B2.reverse()], true)}" fill="${col}" opacity="${o.op ?? 0.95}"/>` + s;
  }
  return `<g filter="url(#${o.filter || 'kRough'})">${s}</g>`;
}
// ink splatter: one ragged blot, tear-shaped drops flung along dir, and a fine mist of specks
function splatter(r, c, rad, col, o = {}) {
  const dir = o.dir ? norm(o.dir) : null, n = o.n || 26;
  let s = o.blot === false ? '' : `<path d="${pathD(blob(r, c, rad * (o.blotR ?? 0.32), 16, 0.6), true)}" fill="${col}"/>`;
  for (let i = 0; i < n; i++) {
    let a = r() * Math.PI * 2; if (dir) a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * (o.spread ?? 1.6);
    const d = rad * (0.3 + Math.pow(r(), 0.8) * 0.9), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), rr = Math.max(0.8, rad * 0.07 * (1.25 - d / rad) * (0.4 + r()));
    const v = [Math.cos(a), Math.sin(a)], tail = add(p, mul(v, -rr * (2 + r() * 3))), nn = [-v[1], v[0]];
    s += `<path d="${pathD([tail, add(p, mul(nn, rr)), add(p, mul(v, rr)), add(p, mul(nn, -rr))], true)}" fill="${col}"/>`;
  }
  for (let i = 0; i < n * 1.5; i++) { const a = r() * Math.PI * 2, d = rad * (0.4 + r() * 0.9), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]); s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(0.6 + r() * 1.3)}" fill="${col}" opacity="${f1(0.6 + r() * 0.4)}"/>`; }
  return `<g filter="url(#kRag)" opacity="${o.op ?? 1}">${s}</g>`;
}
// engraver's motion lines: short slanted hatch strokes laid along a path, thinning out toward its start
function motionHatch(r, pts, w, col = INK, o = {}) {
  const P = catmull(pts, 12), N = normals(P), L = plen(P), step = o.step || 9;
  let s = '', acc = 0;
  for (let i = 1; i < P.length; i++) {
    acc += len(sub(P[i], P[i - 1])); if (acc < step) continue; acc = 0;
    const t = i / (P.length - 1); if (r() < (o.skip ?? 0.2) + (1 - t) * 0.3) continue;
    const ww = w * (o.grow === false ? 1 : 0.35 + 0.65 * t) * (0.6 + r() * 0.5), d = norm(sub(P[i], P[i - 1])), slant = add(mul(N[i], 1), mul(d, o.slant ?? -0.35));
    const off = (r() - 0.5) * w * 0.3, a = add(P[i], mul(N[i], off - ww / 2)), b = add(add(P[i], mul(N[i], off)), mul(norm(slant), ww / 2));
    s += `<path d="M${f1(a[0])},${f1(a[1])}L${f1(b[0])},${f1(b[1])}" stroke="${col}" stroke-width="${f1((o.lw || 2) * (0.6 + r() * 0.6))}" stroke-linecap="round" opacity="${f1((o.op ?? 0.85) * (0.4 + t * 0.6))}"/>`;
  }
  return `<g filter="url(#kWob)">${s}</g>`;
}
// a brush flick: a solid tapered wedge from p0 (loaded, width w) to a point at p1, slightly bowed, with a few dry
// bristle streaks running past the tip. Used for impact bursts and cuts.
function flick(r, p0, p1, w, col = INK, o = {}) {
  const d = norm(sub(p1, p0)), n = [-d[1], d[0]], L = len(sub(p1, p0)), bow = (o.bow ?? (r() - 0.5) * 0.25) * L;
  const A = [], B2 = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10, c = add(lerp(p0, p1, t), mul(n, bow * Math.sin(Math.PI * t))), ww = w / 2 * Math.pow(1 - t, o.pow ?? 0.8) * (0.85 + r() * 0.3); A.push(add(c, mul(n, ww))); B2.push(add(c, mul(n, -ww))); }
  let s = `<path d="${pathD([...A, ...B2.reverse()], true)}" fill="${col}"/>`;
  for (let i = 0; i < (o.streaks ?? 3); i++) { const u = (r() - 0.5) * w * 0.5, a = add(lerp(p0, p1, 0.55 + r() * 0.2), mul(n, u)), b = add(add(p1, mul(d, L * (0.08 + r() * 0.3))), mul(n, u * 1.4)); s += `<path d="M${f1(a[0])},${f1(a[1])}L${f1(b[0])},${f1(b[1])}" stroke="${col}" stroke-width="${f1(1 + r() * 2)}" stroke-linecap="round" stroke-dasharray="${f1(10 + r() * 30)} ${f1(3 + r() * 8)}"/>`; }
  return `<g filter="url(#kRag)">${s}</g>`;
}
// impact: a ragged ink smash, a few heavy flicks of uneven length thrown out of it, splatter, and a broken paper flash
function impact(r, c, R, col = INK, o = {}) {
  let s = '';
  const k = o.rays || 7, a0 = o.a0 ?? 0, fan = o.fan ?? 1;
  for (let i = 0; i < k; i++) {
    const a = a0 + (i + 0.5) / k * Math.PI * 2 * fan + (r() - 0.5) * 0.45, L = R * (0.55 + r() * 0.85) * (i % 2 ? 0.7 : 1);
    const d = [Math.cos(a), Math.sin(a)];
    s += flick(r, add(c, mul(d, R * 0.2)), add(c, mul(d, R * 0.25 + L)), R * (0.22 + r() * 0.16), col);
  }
  const bl = blob(r, c, R * 0.42, 22, 0.75);
  s += `<g filter="url(#kRag)"><path d="${pathD(bl, true)}" fill="${col}"/></g>`;
  if (o.core !== false) {
    const fl = blob(r, add(c, [-R * 0.05, -R * 0.06]), R * 0.15, 11, 0.9, 0.8, r() * 3);
    s += `<g filter="url(#kRag)"><path d="${pathD(fl, true)}" fill="${o.core || PAPER}" opacity="0.85"/></g>`;
  }
  s += splatter(r, c, R * 1.5, col, Object.assign({ n: 26, blot: false }, o.splat || {}));
  return s;
}
const K_poly = pts => polyD(pts);

// a blade's cut: a crescent of ink tapered at both ends along a curve, a thin paper edge where the steel caught the
// light, and dry bristle streaks trailing off the end
function slash(r, pts, w, col = INK, o = {}) {
  const P = catmull(pts, 10), N = normals(P), A = [], B2 = [];
  P.forEach((p, i) => { const t = i / (P.length - 1), ww = w / 2 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08)), 0.7) * (0.85 + r() * 0.3); A.push(add(p, mul(N[i], ww))); B2.push(add(p, mul(N[i], -ww * 0.6))); });
  let s = `<path d="${pathD([...A, ...B2.reverse()], true)}" fill="${col}"/>`;
  const edge = P.map((p, i) => add(p, mul(N[i], -w * 0.12))).slice(Math.round(P.length * 0.15), Math.round(P.length * 0.8));
  const edgeS = o.edge === false ? '' : `<path d="${smooth(edge, false, 1)}" stroke="${o.edgeCol || PAPER}" stroke-width="${f1(Math.max(1.2, w * 0.07))}" fill="none" stroke-linecap="round" opacity="0.7" stroke-dasharray="${f1(30 + r() * 60)} ${f1(6 + r() * 10)}"/>`;
  const end = P[P.length - 1], d = norm(sub(end, P[P.length - 4]));
  for (let i = 0; i < 4; i++) { const u = (r() - 0.5) * w * 0.4, a = add(P[Math.round(P.length * 0.75)], mul(N[0], u)), b = add(add(end, mul(d, 20 + r() * 50)), mul([-d[1], d[0]], u)); s += `<path d="M${f1(a[0])},${f1(a[1])}Q${f1(end[0])},${f1(end[1])} ${f1(b[0])},${f1(b[1])}" stroke="${col}" stroke-width="${f1(1 + r() * 1.8)}" fill="none" stroke-linecap="round" stroke-dasharray="${f1(14 + r() * 30)} ${f1(4 + r() * 10)}"/>`; }
  return `<g filter="url(#kRag)">${s}</g><g filter="url(#kWob)">${edgeS}</g>`;
}
// a billow of smoke, gas or mist in the woodcut manner: a lobed shape washed in colour, hatched on its shadow side,
// its upper edge drawn in broken dry ink, a curl or two inside. Never a soft glow.
let billowN = 0;
function billow(r, c, w, h, col, o = {}) {
  const n = 48, lobes = o.lobes || 5, ph = r() * 6, pts = [], id = 'kBl' + Math.round(ph * 1e6) + '_' + Math.round(c[0]) + '_' + Math.round(c[1]); void billowN;   // L57: the clip id comes from the billow itself, not a process-wide counter (the counter made a card differ alone and in a batch); the r() order is unchanged
  for (let i = 0; i < n; i++) { const t = Math.PI * 2 * i / n, up = Math.sin(t) < 0.15; const bump = up ? 0.2 * Math.abs(Math.sin(lobes * t / 2 + ph)) : 0.04 * Math.abs(Math.sin(lobes * t + ph)); pts.push(add(c, [Math.cos(t) * w * (1 + bump), Math.sin(t) * h * (up ? 1 + bump * 1.6 : 0.7)])); }
  let s = `<defs><clipPath id="${id}"><path d="${pathD(pts, true)}"/></clipPath></defs>`;
  s += `<path d="${pathD(pts, true)}" fill="${col}" opacity="${o.op ?? 0.55}" filter="url(#kRag)"/>`;
  let hl = ''; const ang = E.deg(o.hatchAng ?? 52), d = [Math.cos(ang), Math.sin(ang)], nn = [-d[1], d[0]];
  for (let k = -60; k < 60; k++) { const q = add(c, mul(nn, k * 6.5)); const a = add(q, mul(d, -w * 1.6)), b = add(q, mul(d, w * 1.6)); hl += `<path d="M${f1(a[0])},${f1(a[1])}L${f1(b[0])},${f1(b[1])}" stroke="${INK}" stroke-width="1.4"/>`; }
  // hatch only on the lower, away-from-light part: a soft mask that grows toward the lower right
  s += `<g clip-path="url(#${id})"><g mask="url(#${id}m)" opacity="0.7">${hl}</g></g>`;
  s += `<defs><mask id="${id}m" maskUnits="userSpaceOnUse" x="${f1(c[0] - w * 2)}" y="${f1(c[1] - h * 3)}" width="${f1(w * 4)}" height="${f1(h * 6)}"><rect x="${f1(c[0] - w * 2)}" y="${f1(c[1] - h * 3)}" width="${f1(w * 4)}" height="${f1(h * 6)}" fill="#000"/><ellipse cx="${f1(c[0] + w * 0.55)}" cy="${f1(c[1] + h * 0.6)}" rx="${f1(w * 1.1)}" ry="${f1(h * 1.0)}" fill="#fff" filter="url(#kSoft)"/></mask></defs>`;
  const top = pts.filter((p, i) => Math.sin(Math.PI * 2 * i / n) < 0.1);
  const ordered = pts.slice(Math.round(n / 2)).concat(pts.slice(0, 1));
  s += drybrush(r, ordered, o.lw || 6, INK, { dry: 1, body: false, op: 0.7, bristles: 4, profile: t => 0.2 + 0.8 * Math.sin(Math.PI * t), filter: 'kRag' });
  for (let i = 0; i < (o.curls ?? 4); i++) { const q = add(c, [(r() - 0.5) * w, -h * (0.1 + r() * 0.5)]); s += `<path d="M${f1(q[0] - w * 0.18)},${f1(q[1] + 6)}q${f1(w * 0.08)},${f1(-h * 0.35)} ${f1(w * 0.2)},${f1(-h * 0.1)}" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}

// ==== object FX, the only way objects make fire, steam, smoke, lightning, drips or rime (L18)
// Object builders never draw these themselves: they call fxReq(f, kind, point, size) and the composition draws the FX
// here, in card space, in ink. Every FX group carries data-fx so the build can audit where FX came from.
function fxReq(f, kind, p, size = 40, o = {}) { (f.fxReq = f.fxReq || []).push(Object.assign({ kind, p, size }, o)); }
// a flame as ink: four or five dry-brush tongues bent up off one base, dark ink with the course colour only in the core,
// ash lifting off it (review 3: bright orange spikes read as cartoon fire)
function inkFlame(r, b, h, col = '#c8642a', o = {}) {
  let s = '';
  const n = 4 + Math.round(r()), dark = mix(col, '#1a120c', 0.62), core = mix(col, '#d8c8a0', 0.2);
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * h * 0.14, hh = h * (0.5 + r() * 0.55) * (Math.abs(i - (n - 1) / 2) < 1 ? 1.2 : 0.9), lean = (r() - 0.5) * h * 0.45;
    const p0 = [b[0] + dx, b[1] + 4], p1 = [b[0] + dx * 0.8 + lean * 0.35, b[1] - hh * 0.45], p2 = [b[0] + dx * 0.6 + lean, b[1] - hh];
    s += drybrush(r, [p0, p1, p2], h * 0.2, dark, { profile: t => Math.pow(1 - t, 0.8), dry: 0.7, op: 0.9, bodyLen: 0.55, bristles: 7 });
    if (Math.abs(i - (n - 1) / 2) < 1.5) s += drybrush(r, [lerp(p0, p1, 0.15), p1, lerp(p1, p2, 0.5)], h * 0.07, core, { profile: t => 1 - t, dry: 1, body: false, op: 0.8, bristles: 3 });
  }
  for (let i = 0; i < 10; i++) { const q = [b[0] + (r() - 0.5) * h * 0.9, b[1] - h * (0.9 + r() * 0.9)]; s += `<path d="M${f1(q[0])},${f1(q[1])}l${f1(1 + r() * 3)},${f1(-2 - r() * 4)}" stroke="${r() < 0.75 ? '#2a2020' : dark}" stroke-width="${f1(1.4 + r() * 1.6)}" stroke-linecap="round"/>`; }
  return `<g data-fx="flame">${s}</g>`;
}
// steam or smoke as ink: broad dry wisps that lean and thin out as they rise, never a regular wave
function inkSteam(r, b, h, col = '#c8c4b8', o = {}) {
  let s = '';
  const drift = (r() - 0.5) * h * 0.5;
  for (let i = 0; i < (o.n || 2); i++) {
    let p = [b[0] + (i - 0.5) * h * 0.3 + (r() - 0.5) * 10, b[1]]; const pts = [p];
    for (let k = 1; k < 4; k++) { p = [p[0] + drift * 0.4 + (r() - 0.5) * h * 0.15, p[1] - h * (0.24 + r() * 0.1)]; pts.push(p); }
    s += drybrush(r, pts, h * 0.24, col, { profile: t => 0.25 + 0.75 * Math.sin(Math.PI * Math.min(1, t * 1.3)), dry: 1, body: false, op: 0.32, bristles: 12 });
  }
  return `<g data-fx="steam">${s}</g>`;
}
// lightning as ink: a ragged bolt, a split loaded brush stroke with forks, burns where it lands
function inkBolt(r, a, b, col = '#f0e8c8', o = {}) {
  const pts = [a]; let p = a; const n = 7;
  for (let i = 1; i < n; i++) { const t = i / n; p = add(lerp(a, b, t), [(r() - 0.5) * 60, (r() - 0.5) * 20]); pts.push(p); }
  pts.push(b);
  let s = drybrush(r, pts, 22, INK, { dry: 0.8, op: 0.95, bodyLen: 0.5, bristles: 8, filter: 'kRag' }) + drybrush(r, pts, 8, col, { dry: 0.6, op: 0.95, body: false, bristles: 4 });
  for (let k = 2; k < n; k += 2) { const q = pts[k], e = add(q, [(r() - 0.5) * 140, 40 + r() * 80]); s += drybrush(r, [q, lerp(q, e, 0.5), e], 8, INK, { dry: 1, op: 0.85, body: false, bristles: 4 }); }
  s += splatter(r, b, 90, INK, { n: 18, blotR: 0.25 });
  return `<g data-fx="bolt">${s}</g>`;
}
// rime: a crust of pale broken strokes along an edge and specks of frost on and round it
function inkRime(r, pts, w = 18) {
  let s = drybrush(r, pts, w, '#e6eef0', { dry: 1, op: 0.85, body: false, bristles: 10 });
  for (const q of catmull(pts, 4)) for (let k = 0; k < 2; k++) { const p = add(q, [(r() - 0.5) * w * 2, (r() - 0.5) * w]); s += `<path d="M${f1(p[0])},${f1(p[1])}l${f1((r() - 0.5) * 6)},${f1(4 + r() * 6)}" stroke="#f0f6f8" stroke-width="1.6" stroke-linecap="round"/>`; }
  return `<g data-fx="rime">${s}</g>`;
}
// drips falling from a point
function inkDrip(r, p, col = INK, n = 3) {
  let s = '';
  for (let i = 0; i < n; i++) { const q = add(p, [(r() - 0.5) * 30, 14 + i * 22 + r() * 10]), rr = 3 + r() * 3; s += `<path d="${pathD([add(q, [0, -rr * 2.4]), add(q, [rr, 0]), add(q, [0, rr]), add(q, [-rr, 0])], true)}" fill="${col}" stroke="${INK}" stroke-width="1"/>`; }
  return `<g data-fx="drip">${s}</g>`;
}
const FX = { flame: inkFlame, steam: inkSteam, bolt: inkBolt, rime: inkRime, drip: inkDrip };

// ==== object detail helpers (Fig space)
// Everything here draws into a Fig with its own shading, so details get the same cel band, hatch and grit.
const D = {
  // form lines laid over a part and clipped to it: cross-contour hatching the way the bible's ink follows a form.
  // lines: polylines in figure space. o.w line width, o.op, o.dash
  contour(f, outline, lines, o = {}) {
    const id = f.id('cc');
    f.defs.push(`<clipPath id="${id}"><path d="${smooth(outline, true, 1)}"/></clipPath>`);
    let g = '';
    for (const L of lines) g += `<path d="${smooth(L, false, 1)}" fill="none" stroke="${o.col || INK}" stroke-width="${o.w || 1.3}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} opacity="${o.op ?? 0.6}"/>`;
    f.raw(`<g clip-path="url(#${id})">${g}</g>`);
  },
  // the void's mark: a clean round hole bored through the material. Black inside, the far inner wall showing the
  // material's thickness (lit, since the key light comes from the upper left), a hard ink rim. Never ragged.
  hole(f, c, rx, ry, wall, o = {}) {
    const a = o.ang || 0, th = o.th ?? 0.22;
    f.flat(ell(c, rx, ry, a, 28), '#060509');
    const wallP = [];
    for (let i = 0; i <= 14; i++) { const t = E.deg(-20 + i * 160 / 14); wallP.push(add(c, rot([Math.cos(t) * rx, Math.sin(t) * ry], a))); }
    for (let i = 14; i >= 0; i -= 1) { const t = E.deg(-20 + i * 160 / 14); wallP.push(add(c, rot([Math.cos(t) * rx * (1 - th) - rx * th * 0.4, Math.sin(t) * ry * (1 - th) - ry * th * 0.6], a))); }
    f.flat(wallP, wall); f.flat(wallP.slice(0, 8).concat(wallP.slice(-8)), mix(wall, '#000', 0.35), { op: 0.6 });
    f.line(ell(c, rx, ry, a, 28).concat([ell(c, rx, ry, a, 28)[0]]), o.w || 2.2, INK);
    f.line(ell(c, rx + 1.6, ry + 1.6, a, 28).slice(15, 22), 1.1, o.glint || '#e8e2d8', { op: 0.8 });
  },
  // dress a finished part so it never reads flat: cross-contour hatching laid over its shadow side and wear (pits,
  // nicks, scratches) and a grime stain, all clipped to the part's outline. o.dir: hatch direction angle (radians).
  dress(f, outline, o = {}) {
    const r = f.r, bb = E.bbox(outline), w = bb[2] - bb[0], h = bb[3] - bb[1], cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2;
    const i0 = f.out.length, step = o.step || 8, a = o.dir ?? 0.12, d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]];
    const L = [];
    for (let k = -Math.ceil((w + h) / step); k < Math.ceil((w + h) / step); k++) {
      const c0 = add([cx, cy], mul(n, k * step)), t0 = (-0.5 + (o.from ?? 0.45)) * w + (r() - 0.5) * w * 0.14;
      L.push([add(c0, mul(d, t0)), add(c0, mul(d, t0 + w * 0.5)), add(c0, add(mul(d, w * 1.2), mul(n, 3)))]);
    }
    let g = '';
    for (const q of L) g += `<path d="${smooth(q, false, 1)}" fill="none" stroke="${INK}" stroke-width="${o.lw || 1.3}" stroke-linecap="round" stroke-dasharray="${(14 + r() * 20).toFixed(0)} ${(3 + r() * 5).toFixed(0)}" opacity="${o.op ?? 0.5}"/>`;
    f.raw(`<g>${g}</g>`);
    if (o.wear !== false) D.wear(f, [cx, cy], w * 0.42, h * 0.42, Math.round((w * h) / 900) + 6, o.dark || '#1a120c', o.lt || '#e8dcc0');
    if (o.stain !== false) D.stain(f, [bb[0] + w * (0.3 + r() * 0.4), bb[1] + h * (0.5 + r() * 0.3)], Math.min(w, h) * 0.18, o.grime || '#2a1a0c', { op: 0.25 });
    const body = f.out.splice(i0).join('\n'), id = f.id('dr');
    f.defs.push(`<clipPath id="${id}"><path d="${smooth(outline, true, o.k ?? 1)}"/></clipPath>`);
    f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  },
  // thickness for a flat-fronted object (door, shield, mirror, plaque): the same outline pushed back and down-right, darker,
  // drawn first, so the edge between reads as the material's depth. Returns the back outline.
  slab(f, outline, depth = [8, 7], col = '#2a2018') {
    const back = outline.map(p => p.length > 2 ? [p[0] + depth[0], p[1] + depth[1], p[2]] : [p[0] + depth[0], p[1] + depth[1]]);
    f.part(back, { fill: col, shade: 0.3, inkW: 1.6, inkHeavy: 3, cast: true, hatch: false });
    return back;
  },
  // surface breakup for a large plain area: pits, nicks and fine scratches scattered in a region
  wear(f, c, rx, ry, n = 20, col = '#1a120c', lt = '#e8dcc0') {
    const r = f.r;
    for (let i = 0; i < n; i++) { const p = add(c, [(r() - 0.5) * rx * 2, (r() - 0.5) * ry * 2]); if (r() < 0.6) f.flat(ell(p, 0.8 + r() * 1.8, 0.7 + r() * 1.2, r() * 3, 6), col, { op: 0.6 }); else { const a = -0.5 + (r() - 0.5), l = 3 + r() * 8; f.line([p, add(p, rot([l, 0], a))], 0.9, r() < 0.5 ? lt : col, { straight: true, op: 0.6 }); } }
  },
  // wax or pitch run over a lip: a cap of wax along `edge` with drips hanging toward +y (local down)
  wax(f, edge, col, o = {}) {
    const r = f.r, top = edge.map(p => add(p, [0, -(o.thick || 5)])), bot = [];
    edge.slice().reverse().forEach((p, i) => { bot.push(add(p, [0, 4 + r() * 3])); if (i % 2 === 1 && r() < (o.drips ?? 0.7)) { const L = 10 + r() * (o.dripL || 26); bot.push(add(p, [-3, L * 0.6]), [p[0] - 1, p[1] + L], [p[0] + 3, p[1] + L * 0.9], add(p, [4, L * 0.4])); } });
    f.part([...top, ...bot], { fill: col, shade: 0.35, inkW: 1.2, inkHeavy: 2, hi: 0.18, cast: o.cast ?? true });
    f.line(top.slice(1, -1).map(p => add(p, [0, 2])), 1.2, mix(col, '#fff', 0.5), { op: 0.7 });
  },
  // twine wrapped round a neck between two edges, ending in a knot and two loose ends
  twine(f, a, b, turns, col = '#8a7454', o = {}) {
    for (let i = 0; i < turns; i++) {
      const t = (i + 0.5) / turns, y = lerp(a[0], b[0], t), z = lerp(a[1], b[1], t);
      f.line([y, lerp(y, z, 0.5), z].map((p, k) => add(p, [0, k === 1 ? 3 : 0])), 3.2, INK);
      f.line([y, lerp(y, z, 0.5), z].map((p, k) => add(p, [0, k === 1 ? 3 : 0])), 1.6, col);
    }
    if (o.knot) {
      const k = o.knot; f.part(ell(k, 5, 4, 0.3, 8), { fill: col, shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false });
      for (const e of o.ends || []) { f.line([k, ...e], 3, INK); f.line([k, ...e], 1.5, col); }
    }
  },
  // a hairline crack: a jagged main run with forks, ink with a worn-bright lip on the lit side
  crack(f, a, ang, L, o = {}) {
    const r = f.r, pts = [a]; let p = a, A = ang;
    const n = o.n || 6;
    for (let i = 0; i < n; i++) { A += (r() - 0.5) * 0.9; p = add(p, rot([L / n, 0], A)); pts.push(p); if (o.forks !== false && r() < 0.45 && i > 0 && i < n - 1) { const q = add(p, rot([L / n * 0.9, 0], A + (r() < 0.5 ? 0.9 : -0.9))); f.line([p, q, add(q, rot([L / n * 0.5, 0], A))], 1.1, INK, { straight: true, op: 0.85 }); } }
    f.line(pts, o.w || 1.8, INK, { straight: true });
    f.line(pts.map(q => add(q, [-1.2, -1.4])), 0.9, o.lip || '#f0ead8', { straight: true, op: 0.6 });
    return pts;
  },
  // a chipped notch bitten out of an edge: dark recess plus a bright worn rim
  chip(f, p, s, ang = 0, col = '#1a120c') {
    const F = E.frame(p, ang, s);
    f.flat(F([[-1, 0], [-0.4, 0.7], [0.3, 0.5], [1, 0]]), col, { op: 0.85 });
    f.line(F([[-0.4, 0.75], [0.3, 0.55], [1, 0.05]]), 1, '#e8e0cc', { op: 0.6 });
  },
  // rust or verdigris bloom: soft blotches with a darker core and specks
  bloom(f, c, rad, col, o = {}) {
    const r = f.r;
    for (let i = 0; i < (o.n || 4); i++) f.flat(blob(r, add(c, [(r() - 0.5) * rad, (r() - 0.5) * rad * 0.7]), rad * (0.3 + r() * 0.4), 9, 0.6), col, { op: o.op ?? 0.55 });
    for (let i = 0; i < (o.specks || 10); i++) f.flat(ell(add(c, [(r() - 0.5) * rad * 2, (r() - 0.5) * rad * 1.4]), 0.8 + r() * 1.6, 0.8 + r() * 1.2, 0, 6), mix(col, '#000', 0.4), { op: 0.7 });
  },
  // a grime or tea stain with a darker tide edge
  stain(f, c, rad, col = '#3a2414', o = {}) {
    const b = blob(f.r, c, rad, 12, 0.5, o.sq || 0.8, o.ang || 0);
    f.flat(b, col, { op: o.op ?? 0.28 });
    f.line(b.concat([b[0]]).slice(0, 9), 1.1, col, { op: (o.op ?? 0.28) * 2 });
  },
  // a paper tag or label with a torn edge, ink marks drawn on it by `marks(F)` in local unit space
  label(f, c, w, h, ang, col = '#cdbb94', marks) {
    const r = f.r, F = E.frame(c, ang, 1), pts = [[-w / 2, -h / 2, 1], [w / 2, -h / 2, 1], [w / 2, h / 2, 1]];
    for (let i = 1; i < 6; i++) pts.push([w / 2 - w * i / 6, h / 2 + (r() - 0.5) * 5 + (i % 2 ? 2 : -1)]);
    pts.push([-w / 2, h / 2, 1]);
    f.part(F(pts), { fill: col, shade: 0.3, inkW: 1.2, inkHeavy: 2, tex: 'mottle' + f.o.seed, texOp: 0.5, hi: 0.04 });
    if (marks) marks(F, w, h);
    D.stain(f, F([[w * 0.25, h * 0.15]])[0], Math.min(w, h) * 0.25, '#6a4a28', { op: 0.25 });
    return F;
  },
};

// ==== posed heroes
// Builds a hero (or foe) from its world module and poses it the way card_figure.js does: each draw-order run rotated
// about its bone chain's rest pivots, parent outermost. Returns the SVG pieces and a function that maps a point drawn
// on a bone to where it lands after the pose (for placing FX on a hand or a blade tip).
function hero(mod, key, pose = {}, list = 'heroes', o = {}) {
  const Dm = require(path.join(PARTY, mod));
  const h = Dm[list].find(q => q.key === key);
  if (!h) throw new Error('no figure ' + key + ' in ' + mod);
  const f = h.build(), FW = h.w || 600, J = f.joints;
  // a pose may carry per-figure corrections, { vary: { <figure key>: { bone: deg } } }, for path variants whose rest arms differ
  if (pose.vary && pose.vary[key]) pose = Object.assign({}, pose, pose.vary[key]);
  const chain = b => { const c = []; while (b && J[b]) { c.push(b); b = J[b].parent; } return c.reverse(); };
  let body = '';
  for (const run of f.runs()) {
    if ((o.hide || []).includes(run.bone)) continue;
    if (o.only && !o.only.includes(run.bone)) continue;
    const ops = run.bone === 'root' || !J[run.bone] ? [] : chain(run.bone).filter(b => pose[b]).map(b => `rotate(${pose[b]} ${J[b].pivot[0]} ${J[b].pivot[1]})`);
    body += ops.length ? `<g transform="${ops.join(' ')}">${run.body}</g>` : run.body;
  }
  const lean = pose.lean ? `rotate(${pose.lean} ${FW / 2} ${f.o.groundY})` : '';
  const wrap = (h.flip ? `translate(${FW},0) scale(-1,1) ` : '') + lean;
  const rotP = (p, a, c) => add(c, rot(sub(p, c), E.deg(a)));
  const at = (bone, p) => {
    let q = p.slice();
    for (const b of chain(bone).reverse()) if (pose[b]) q = rotP(q, pose[b], J[b].pivot);
    if (pose.lean) q = rotP(q, pose.lean, [FW / 2, f.o.groundY]);
    if (h.flip) q = [FW - q[0], q[1]];
    return q;
  };
  const joint = name => at(J[name].parent || name, J[name].pivot);
  return { f, defs: f.sharedDefs() + f.defs.join('\n'), body: `<g transform="${wrap}">${body}</g>`, at, joint, J, W: FW, H: h.h || 820, flip: !!h.flip };
}
// place figure-space content so that figure point `anchor` lands on card point `to`, at scale s (mirror with sx -1)
function place(body, anchor, to, s, o = {}) {
  const sx = o.mirror ? -s : s;
  return `<g transform="translate(${f1(to[0] - anchor[0] * sx)},${f1(to[1] - anchor[1] * s)}) scale(${f1(sx * 1000) / 1000},${f1(s * 1000) / 1000})"${o.filter ? ` filter="${o.filter}"` : ''}${o.mask ? ` mask="${o.mask}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}>${body}</g>`;
}
// map figure point to card point under place()
const mapPt = (p, anchor, to, s, mirror) => [to[0] + (p[0] - anchor[0]) * (mirror ? -s : s), to[1] + (p[1] - anchor[1]) * s];
// a Fig for an object or an FX layer drawn with the hero settings (ground grime off: objects float in the card)
function objFig(seed, o = {}) { return new Fig(KIT.base(seed, Object.assign({ grimeY: null, groundY: 2000 }, o))); }
function figSVG(f) { return { defs: f.sharedDefs() + f.defs.join('\n'), body: `<g filter="url(#wob${f.o.seed})">${f.out.join('\n')}</g>` }; }

// ==== card assembly and render
function svgDoc(seed, c, defs, body, o = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${cardDefs(seed, c)}${defs}</defs>${body}${finish(c, o)}</svg>`;
}

module.exports = { W, H, INK, COURSE, INK6, BLOOD, BLOOD_L, BONE, PAPER, ATTUNED_PULL, courseInk, catmull, plen, normals, arc, blob, pathD, polyD, cardDefs, ground, lightShaft, edgeHatch, finish, drybrush, splatter, motionHatch, impact, flick, slash, billow, fxReq, FX, inkFlame, inkSteam, inkBolt, inkRime, inkDrip, D, hero, place, mapPt, objFig, figSVG, svgDoc, E, KIT, f1 };
