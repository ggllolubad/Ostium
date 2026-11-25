// The grim engine's drawing API (Art, shape, glow, stain, limb, rivet, ...) implemented in Living Ink, so grim's icon
// scripts (grim/icons.js with kit.js, sigils.js and anatomy.js) draw through the locked figure engine (engine.js Fig):
// every grim shape becomes a Fig part (lit edge, shadow band toward the lower right, its hatch and crosshatch, thin ink all
// round and heavy ink on the shadow side), with no gradients or blurs. Glows become stepped flat discs, stains flat blobs.
// grim's own raw SVG (ink-and-colour strokes, sigils) passes through unchanged: it is already linework.
// Used by scenes/icons_li.js, which stages the grim icon sources against this file as their '../gr'.
'use strict';
const E = require('../engine');
const KIT = require('../kit');
const { mix, Fig } = E;
const INK = KIT.INK || '#16110d';
const G = { black: '#0e0b09', blood: '#6a1410', bloodD: '#4a0e0a', bloodL: '#8a2a1e', bloodW: '#7a1e16', red: '#7a2018', redD: '#5a1612', rust: '#5a2a14', rustL: '#7a4424', bone: '#c8bca0', boneD: '#9a8e74',
  leather: '#5a3e28', leatherD: '#3a2618', algae: '#3e5a3a', steel: '#7a7e82', steelD: '#4a4e52', steelL: '#a8acb0', iron: '#3e3e40', gold: '#a8873e', goldL: '#d8b860', wood: '#5a4230', woodD: '#3a2a1c',
  parch: '#d8ccae', parchD: '#a89a7a', bruise: '#4a3a4a', corpse: '#8a8a72', teal: '#3a6a6a', umber: '#2a1c12' };
const f = n => +(+n).toFixed(1);
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function smooth(pts, closed = true, k = 1) {
  const n = pts.length; if (n < 3) return 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join(' L');
  const P = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`; const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), s = k / 6; d += ` C${f(p1[0] + (p2[0] - p0[0]) * s)} ${f(p1[1] + (p2[1] - p0[1]) * s)} ${f(p2[0] - (p3[0] - p1[0]) * s)} ${f(p2[1] - (p3[1] - p1[1]) * s)} ${f(p2[0])} ${f(p2[1])}`; }
  return d + (closed ? ' Z' : '');
}
const poly = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join(' L') + ' Z';
function blob(x, y, r, R, n = 8, irr = 0.2) { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, m = 1 + (R() - 0.5) * 2 * irr; pts.push([x + Math.cos(a) * r * m, y + Math.sin(a) * r * m]); } return smooth(pts, true, 1); }
function limb(a, b, wa, wb) { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; return [[a[0] + nx * wa / 2, a[1] + ny * wa / 2], [b[0] + nx * wb / 2, b[1] + ny * wb / 2], [b[0] - nx * wb / 2, b[1] - ny * wb / 2], [a[0] - nx * wa / 2, a[1] - ny * wa / 2]]; }
const isHex = c => typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c);
// bounding box of an SVG path (M L H V C S Q T A Z, absolute and relative; arcs by their end points and radii)
function pathBox(d) {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || []; let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = 'M';
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    if (C === 'Z') { cx = sx; cy = sy; continue; }
    const pt = () => { let x = num(), y = num(); if (rel) { x += cx; y += cy; } return [x, y]; };
    if (C === 'M' || C === 'L' || C === 'T') { const [x, y] = pt(); add(x, y); cx = x; cy = y; if (C === 'M') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; } }
    else if (C === 'H') { let x = num(); if (rel) x += cx; add(x, cy); cx = x; }
    else if (C === 'V') { let y = num(); if (rel) y += cy; add(cx, y); cy = y; }
    else if (C === 'C') { const a = pt(), b = pt(), c = pt(); add(...a); add(...b); add(...c); cx = c[0]; cy = c[1]; }
    else if (C === 'S' || C === 'Q') { const a = pt(), c = pt(); add(...a); add(...c); cx = c[0]; cy = c[1]; }
    else if (C === 'A') { const rx = num(), ry = num(); num(); num(); num(); let x = num(), y = num(); if (rel) { x += cx; y += cy; } add(x, y); add(Math.min(cx, x) - rx * 0.5, Math.min(cy, y) - ry * 0.5); add(Math.max(cx, x) + rx * 0.5, Math.max(cy, y) + ry * 0.5); cx = x; cy = y; }
    else i++;
  }
  return x0 > x1 ? [0, 0, 1, 1] : [x0, y0, x1, y1];
}
class Art {
  constructor(W, H, seed) {
    this.W = W; this.H = H; this.R = rng(seed); this.seed = seed; this.defs = []; this.L = { main: [] }; this.cur = 'main'; this.n = 0; this.hp = {};
    // icon scale: a 128 px canvas, so the figure engine's ink and hatch are drawn a little finer than a 640 px figure's
    this.fig = new Fig(KIT.base(seed, { grimeY: null, groundY: H, wobble: 0.9, inkW: 1.25, inkHeavy: 2.6 }));
    const s = seed;
    this.defs.push(`<pattern id="grain" patternUnits="userSpaceOnUse" width="40" height="8"><path d="M0,2 q10,2 20,0 t20,0 M0,6 q14,-2 28,1 t12,0" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.7"/></pattern>`,
      `<pattern id="weave" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M0,1 h4 M1,0 v4" stroke="${INK}" stroke-width="0.6" opacity="0.6"/></pattern>`,
      `<filter id="rough"><feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" result="t" seed="${s % 50}"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2"/></filter>`);
  }
  useGrain() { return this; }
  id(p) { return `${p}${this.seed}_${this.n++}`; }
  layer(n) { this.cur = n; this.L[n] = this.L[n] || []; }
  raw(s) { this.L[this.cur].push(s); }
  hatchPat(ang, gap = 3, w = 0.5) { const k = `${ang}_${gap}_${w}`; if (!this.hp[k]) { const id = this.id('hp'); this.hp[k] = id; this.defs.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${gap}" height="${gap}" patternTransform="rotate(${ang})"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="${INK}" stroke-width="${w * 2}"/></pattern>`); } return `url(#${this.hp[k]})`; }
  // a stain: two overlapping flat blobs (no gradient)
  stain(x, y, r, col, op = 0.5) { return `<path d="${blob(x, y, r, this.R, 9, 0.3)}" fill="${col}" opacity="${f(op * 0.6)}"/><path d="${blob(x + (this.R() - 0.5) * r * 0.3, y, r * 0.6, this.R, 8, 0.3)}" fill="${col}" opacity="${f(op * 0.5)}"/>`; }
  // a glow: stepped flat discs, each a shade stronger toward the source (Living Ink steps light, it does not airbrush it)
  glow(x, y, r, col, op = 0.4) { let s = ''; for (const [k, o] of [[1, 0.25], [0.72, 0.3], [0.46, 0.4]]) s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * k)}" fill="${col}" opacity="${f(op * o)}"/>`; return s; }
  drip(x, y, len, w = 1.2, col = '#1a1410') { return `<path d="M${f(x)} ${f(y)} q${f(w * 0.4)} ${f(len * 0.5)} 0 ${f(len)}" stroke="${col}" stroke-width="${w}" opacity="0.7" fill="none" stroke-linecap="round"/><circle cx="${f(x)}" cy="${f(y + len)}" r="${f(w * 0.8)}" fill="${col}" opacity="0.7"/>`; }
  rivet(x, y, r = 3) { return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="#3a3632" stroke="${INK}" stroke-width="0.9"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.38)}" fill="#8a8680"/>`; }
  // a fold in cloth: a valley line in ink with a lit lip beside it
  fold(x1, y1, x2, y2, w = 5) { const mx = (x1 + x2) / 2 + (this.R() - 0.5) * w, my = (y1 + y2) / 2; return `<path d="M${f(x1)} ${f(y1)} Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}" stroke="${INK}" stroke-width="${f(Math.max(1, w * 0.3))}" fill="none" opacity="0.55" stroke-linecap="round"/><path d="M${f(x1 - 2)} ${f(y1)} Q${f(mx - 2)} ${f(my)} ${f(x2 - 2)} ${f(y2)}" stroke="#fff3d8" stroke-width="1" fill="none" opacity="0.25"/>`; }
  // a gash: a dark slit with a wet rim (blood: red is right here)
  gash(x1, y1, x2, y2, w = 2.4, o = {}) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, nx = -(y2 - y1), ny = x2 - x1, l = Math.hypot(nx, ny) || 1, k = w / l; return `<path d="M${f(x1)} ${f(y1)} Q${f(mx + nx * k)} ${f(my + ny * k)} ${f(x2)} ${f(y2)} Q${f(mx - nx * k)} ${f(my - ny * k)} ${f(x1)} ${f(y1)} Z" fill="${o.rim || G.bloodW}" stroke="${INK}" stroke-width="1.1"/><path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="#1a0806" stroke-width="${f(w * 0.5)}"/>`; }
  splat(x, y, r, col = G.blood) { return this.stain(x, y, r, col, 0.8); }
  ground(x, y, w, h) { return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(h)}" fill="${G.umber}" opacity="0.25"/>`; }
  limb(spine, widths, o = {}) { const L = [], Rr = []; for (let i = 0; i < spine.length; i++) { const a = spine[Math.max(0, i - 1)], b = spine[Math.min(spine.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (widths[i] ?? widths[widths.length - 1]) / 2; L.push([spine[i][0] - dy / l * w, spine[i][1] + dx / l * w]); Rr.push([spine[i][0] + dy / l * w, spine[i][1] - dx / l * w]); } return this.shape(Object.assign({}, o, { d: smooth([...L, ...Rr.reverse()], true, 0.8) })); }
  // a Lichtenberg burn: a branching scorch scarred into a surface (the lightning course's mark; never a bolt in the air)
  lichtenberg(x, y, ang, len, col = '#2a1a10', w = 1.6) {
    let s = ''; const R = this.R;
    const go = (x, y, a, l, w, d) => { const n = 4 + Math.floor(R() * 3); let px = x, py = y, path = `M${f(x)} ${f(y)}`; for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.9; px += Math.cos(a) * l / n; py += Math.sin(a) * l / n; path += ` L${f(px)} ${f(py)}`; if (d > 0 && R() < 0.55) go(px, py, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), l * 0.45, w * 0.6, d - 1); } s += `<path d="${path}" stroke="${col}" stroke-width="${f(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><path d="${path}" stroke="#e8c070" stroke-width="${f(w * 0.3)}" fill="none" opacity="0.45" transform="translate(0.5 0.5)"/>`; };
    go(x, y, ang, len, w, 3); return s;
  }
  // a shape in Living Ink: the figure engine's part (o.d any path), then grim's lines, decals and spec clipped to it
  shape(o) {
    const d = o.d, fig = this.fig, n0 = fig.out.length;
    // o.outline: a heavy ink silhouette under the part (keeps thin things legible at icon-tag size)
    let s = o.outline ? `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(o.outline)}" stroke-linejoin="round"/>` : '';
    if (isHex(o.fill) && !o.fillOp) {
      const tex = o.tex === 'url(#grain)' ? 'wood' + this.seed : o.tex === 'url(#weave)' ? 'weave' + this.seed : (o.mottle ? 'mottle' + this.seed : undefined);
      fig.part(d, { fill: o.fill, bb: pathBox(d), shade: o.noShade ? 0 : 0.42, noShade: !!o.noShade, tex, texOp: o.tex ? (o.texOp ?? 0.5) : Math.min(0.55, (o.mottle || 0) * 0.8), cast: false, hatch: o.hatch === 0 ? false : undefined,
        inkW: o.ink === 0 ? 0 : Math.max(0.9, Math.min(2.2, o.ink ?? 1.25)), inkHeavy: o.ink === 0 ? 0 : 2.6, hi: 0.1 });
      s += fig.out.splice(n0).join('');
    } else {
      // translucent fills (glass, ice, gauze): a flat tint, a lit inner edge, thin ink
      s += `<path d="${d}" fill="${o.fill || '#777'}"${o.fillOp ? ` opacity="${o.fillOp}"` : ''}/>` + (o.ink !== 0 ? `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(o.ink ?? 1.25)}"/>` : '');
    }
    const id = this.id('sh'); this.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    let inner = '';
    for (const l of o.lines || []) { const L = typeof l === 'string' ? { d: l } : l; inner += `<path d="${L.d}" stroke="${L.col || INK}" stroke-width="${L.w || 1}" fill="none" opacity="${L.op ?? 0.8}" stroke-linecap="round"/>`; }
    if (o.decals) inner += o.decals;
    for (const sp of o.spec || []) inner += `<path d="${sp}" stroke="#fff3d8" stroke-width="1.8" opacity="${f((o.specOp ?? 0.3) * 1.3)}" fill="none" stroke-linecap="round"/>`;
    if (inner) s += `<g clip-path="url(#${id})">${inner}</g>`;
    if (o.after) s += o.after;
    if (o.raw) return s;
    this.raw(s); return s;
  }
  body(names) { return names.map(n => (this.L[n] || []).join('\n')).join('\n'); }
  svg() { return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.W}" height="${this.H}" viewBox="0 0 ${this.W} ${this.H}"><defs>${this.fig.sharedDefs()}${this.fig.defs.join('')}${this.defs.join('')}</defs>${this.body(Object.keys(this.L))}</svg>`; }
  svgLayer(n) { return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.W}" height="${this.H}" viewBox="0 0 ${this.W} ${this.H}"><defs>${this.fig.sharedDefs()}${this.fig.defs.join('')}${this.defs.join('')}</defs>${this.body([n])}</svg>`; }
}
module.exports = { Art, G, INK, smooth, poly, blob, limb, rng, pathBox };
