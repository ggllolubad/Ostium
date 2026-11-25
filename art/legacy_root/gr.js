// Ostium "grim manuscript" art engine.
// Engraving-style auto shading: every shape gets a hatched form shadow and a cross-hatched core
// shadow computed from the light direction with SVG masks, an umber wash under the hatching, a lit
// rim, optional grime stipple and gore decals clipped to the shape. Paths must use absolute coords.
const INK = '#1c130c';
const G = {
  ink: INK, parch: '#e6d8b8', parchD: '#cdbb93', paper: '#efe4c9',
  umber: '#4a3424', umberL: '#7b5d43',
  flesh: '#cdb093', fleshD: '#a88468', fleshP: '#b9a690', corpse: '#9aa596', corpseD: '#6f7d70', bruise: '#5b5468',
  bone: '#d8ccaa', boneD: '#ad9f7b',
  steel: '#9c998e', steelL: '#b3afa1', steelD: '#6f6d64', iron: '#5f5d58', rust: '#87482a', rustL: '#a8653b',
  blood: '#6a120d', bloodD: '#380805', bloodL: '#8f1e14', bloodW: '#a3271a',
  leather: '#6e4e34', leatherD: '#4b3423', wood: '#7d5b3c', woodD: '#5a3f28',
  cloth: '#4c4238', azure: '#4e6079', azureD: '#37455a', red: '#83321f', redD: '#5e2117', gold: '#a8873e', goldL: '#c9a653',
  green: '#5e6b47', greenD: '#414b31', teal: '#5d7c75', tealD: '#3d5650', violet: '#5d4f6e', violetD: '#40364d',
  black: '#221a14', algae: '#4f5f3a', slime: '#7d8a5a', water: '#557276'
};
const L = norm([-0.55, -0.83]); // light comes from the upper left

function norm(v) { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const f = n => +n.toFixed(1);

// Catmull-Rom -> cubic Bezier through points
function smooth(pts, closed = true, tension = 1) {
  const n = pts.length;
  if (n < 2) return '';
  const P = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? ' Z' : '');
}
// tapered limb along a spine with a width per spine point; round caps
function limb(spine, widths, cap = true) {
  const n = spine.length, left = [], right = [];
  for (let i = 0; i < n; i++) {
    const a = spine[Math.max(0, i - 1)], b = spine[Math.min(n - 1, i + 1)];
    const t = norm([b[0] - a[0], b[1] - a[1]]), nn = [-t[1], t[0]], w = widths[i] / 2;
    left.push([spine[i][0] + nn[0] * w, spine[i][1] + nn[1] * w]);
    right.push([spine[i][0] - nn[0] * w, spine[i][1] - nn[1] * w]);
  }
  const pts = [...left];
  if (cap) {
    const e = spine[n - 1], t = norm([e[0] - spine[n - 2][0], e[1] - spine[n - 2][1]]);
    pts.push([e[0] + t[0] * widths[n - 1] * 0.42, e[1] + t[1] * widths[n - 1] * 0.42]);
  }
  pts.push(...right.reverse());
  if (cap) {
    const s = spine[0], t = norm([spine[1][0] - s[0], spine[1][1] - s[1]]);
    pts.push([s[0] - t[0] * widths[0] * 0.42, s[1] - t[1] * widths[0] * 0.42]);
  }
  return smooth(pts, true);
}
function poly(pts) { return 'M' + pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L') + ' Z'; }
function bbox(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i + 1 < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
// irregular blob around a centre
function blob(cx, cy, r, R, k = 9, jit = 0.35) {
  const pts = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + R() * 0.3, rr = r * (1 - jit + R() * jit * 2);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.9]);
  }
  return smooth(pts, true);
}

class Art {
  constructor(w, h, seed = 1) {
    this.w = w; this.h = h; this.R = rng(seed); this.defs = []; this.body = []; this.tags = []; this.cur = 'body'; this.layers = []; this.uid = 0; this.pats = {};
    this.defs.push(`<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.4"/></filter>`);
    this.defs.push(`<filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="${seed + 3}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter>`);
    this.defs.push(`<filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="${seed + 11}"/><feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0 0.09  0 0 0 -2.0 1.08"/></filter>`);
    this.defs.push(`<filter id="mottleF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="3" seed="${seed + 17}"/><feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.13  0 0 0 0 0.08  0 0 0 -2.4 1.3"/></filter>`);
    this.stipple('grime', 46, 220, INK, 0.55);
    this.stipple('grimeF', 30, 260, INK, 0.38);
    this.stipple('rustS', 40, 160, G.rust, 0.9);
    this.stipple('bloodS', 34, 120, G.blood, 0.8);
    this.defs.push(`<pattern id="mail" width="5.2" height="4.4" patternUnits="userSpaceOnUse"><path d="M0 4.4 C0.4 1.2 4.8 1.2 5.2 4.4 M-2.6 2.2 C-2.2 -1 2.2 -1 2.6 2.2 M2.6 2.2 C3 -1 7.4 -1 7.8 2.2" fill="none" stroke="${INK}" stroke-width="0.6"/></pattern>`);
    this.defs.push(`<pattern id="weave" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 1 L4 1 M1 0 L1 4" stroke="${INK}" stroke-width="0.35" opacity="0.6"/></pattern>`);
    this.defs.push(`<pattern id="grain" width="60" height="7" patternUnits="userSpaceOnUse"><path d="M0 2 C15 1 30 3 60 2 M0 5.5 C20 6.5 40 4.5 60 5.5" fill="none" stroke="${INK}" stroke-width="0.5" opacity="0.7"/></pattern>`);
  }
  id(p = 'i') { return p + (this.uid++); }
  hatchPat(angle, gap = 3, w = 0.65, color = INK) {
    const k = `h${Math.round(angle)}_${gap}_${w}_${color.slice(1)}`;
    if (!this.pats[k]) {
      this.pats[k] = k;
      this.defs.push(`<pattern id="${k}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><path d="M-1 ${gap / 2} L${gap + 1} ${gap / 2}" stroke="${color}" stroke-width="${w}"/></pattern>`);
    }
    return `url(#${k})`;
  }
  stipple(id, size, n, color, r) {
    const R = this.R; let dots = '';
    for (let i = 0; i < n; i++) dots += `<circle cx="${f(R() * size)}" cy="${f(R() * size)}" r="${f(r * (0.4 + R()))}"/>`;
    this.defs.push(`<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><g fill="${color}">${dots}</g></pattern>`);
  }
  // finer surface noise for the abbey interiors and the keepers: darkening only (no pale fog), small scale, irregular
  useGrain() { this.grainScale = 0.3;
    const seed = Math.floor(this.R() * 1000);
    const swap = (id, body) => { const i = this.defs.findIndex(d => d.includes(`id="${id}"`)); const v = body; if (i >= 0) this.defs[i] = v; else this.defs.push(v); };
    swap('mottle', `<filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="3" seed="${seed}"/><feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.035  0 0 0 0 0.02  2.6 0 0 0 -1.25"/></filter>`);
    swap('mottleF', `<filter id="mottleF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${seed + 5}"/><feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0 0.02  3.2 0 0 0 -1.6"/></filter>`);
    // grime: irregular specks, pits and hair scratches on a large tile so it never reads as a repeat
    const R = this.R; let g = '';
    for (let i = 0; i < 260; i++) { const x = R() * 160, y = R() * 160, k = R();
      g += k < 0.7 ? `<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="${(0.25 + R() * R() * 1.4).toFixed(2)}" opacity="${(0.3 + R() * 0.6).toFixed(2)}"/>` : k < 0.9 ? `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${((R() - 0.5) * 9).toFixed(1)} ${((R() - 0.5) * 4).toFixed(1)}" stroke="${INK}" stroke-width="0.45" opacity="0.5"/>` : `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(0.8 + R() * 1.6).toFixed(1)}" ry="${(0.5 + R()).toFixed(1)}" opacity="0.35"/>`; }
    swap('grime', `<pattern id="grime" width="160" height="160" patternUnits="userSpaceOnUse"><g fill="${INK}">${g}</g></pattern>`);
    return this;
  }
  raw(s) { this.body.push(s); this.tags.push(this.cur); return this; }
  // layers: everything drawn after layer(name) belongs to that layer until the next call
  layer(name, pivot) { this.cur = name; if (!this.layers.find(l => l.name === name)) this.layers.push({ name, pivot }); return this; }
  // optional uniform scale: draw in a base frame, output on a bigger canvas (this.k, this.ox)
  scaleTo(W, H, baseW, baseH) { this.k = H / baseH; this.ox = (W - baseW * this.k) / 2; this.w = W; this.h = H; return this; }
  _wrap(inner) { return this.k ? `<g transform="translate(${f(this.ox)} 0) scale(${f(this.k * 1000) / 1000})">${inner}</g>` : inner; }
  svgLayer(name, wobble = true) {
    const b = this.body.filter((_, i) => this.tags[i] === name);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.w}" height="${this.h}" viewBox="0 0 ${this.w} ${this.h}"><defs>${this.defs.join('')}</defs>${this._wrap(`<g${wobble ? ' filter="url(#wob)"' : ''}>${b.join('\n')}</g>`)}</svg>`;
  }
  glow(cx, cy, r, col, op = 0.7) {
    const id = this.id('gl');
    this.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="0.45" stop-color="${col}" stop-opacity="${op * 0.45}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`);
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="url(#${id})"/>`;
  }
  // writes <base>.svg (all layers) plus <base>__<layer>.svg and a rig json beside it
  writeRig(base, anim) {
    const fs = require('fs');
    fs.writeFileSync(base + '.svg', this.svg());
    for (const l of this.layers) fs.writeFileSync(`${base}__${l.name}.svg`, this.svgLayer(l.name));
    const k = this.k || 1, ox = this.ox || 0, tp = p => p ? [f(p[0] * k + ox), f(p[1] * k)] : p;
    const layers = this.layers.map(l => ({ name: l.name, pivot: tp(l.pivot) }));
    const an = Object.assign({}, anim || {}); if (an.hand) an.hand = tp(an.hand);
    fs.writeFileSync(base + '.rig.json', JSON.stringify({ w: this.w, h: this.h, layers, anim: an }));
  }
  // ------------------------------------------------------------------ the shaded shape
  // p: { d, fill, ink, tex, texOp, grime, depth, hatch, cross, wash, hl, hlCol, core, lines, free, lineW, decals, after, op, noShade, inkCol }
  shape(p) {
    const id = this.id('s'), b = bbox(p.d);
    const depth = p.depth !== undefined ? p.depth : Math.max(3, Math.min(b.w, b.h) * 0.34);
    const ang = p.hatch !== undefined ? p.hatch : 45;
    this.defs.push(`<path id="${id}" d="${p.d}"/>`);
    this.defs.push(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    const mk = (k, dx, dy) => { const m = id + k; this.defs.push(`<mask id="${m}" maskUnits="userSpaceOnUse" x="${-this.w}" y="${-this.h}" width="${this.w * 3}" height="${this.h * 3}"><use href="#${id}" fill="#fff"/><use href="#${id}" fill="#000" transform="translate(${f(dx)} ${f(dy)})"/></mask>`); return m; };
    let o = `<g${p.op !== undefined ? ` opacity="${p.op}"` : ''}${p.filter ? ` filter="${p.filter}"` : ''}>`;
    o += `<use href="#${id}" fill="${p.fill || G.parch}"/>`;
    if (p.tex) o += `<use href="#${id}" fill="${p.tex}"${p.texOp !== undefined ? ` opacity="${p.texOp}"` : ''}/>`;
    const inner = [];
    let mid = null;
    if (!p.noShade) {
      mid = mk('m', L[0] * depth, L[1] * depth); const core = mk('k', L[0] * depth * 0.42, L[1] * depth * 0.42);
      const hlm = mk('h', -L[0] * depth * 0.5, -L[1] * depth * 0.5);
      if (p.hl !== false) o += `<use href="#${id}" fill="${p.hlCol || '#fff7e4'}" opacity="${p.hlOp !== undefined ? p.hlOp : 0.12}" mask="url(#${hlm})"/>`;
      if (p.far !== false) { const far = mk('f', L[0] * depth * 1.7, L[1] * depth * 1.7); o += `<use href="#${id}" fill="${this.hatchPat(ang, (p.gap || 2.6) * 1.9, (p.hw || 0.7) * 0.8)}" mask="url(#${far})"/>`; }
      o += `<use href="#${id}" fill="${p.washCol || G.umber}" opacity="${p.wash !== undefined ? p.wash : 0.34}" mask="url(#${mid})"/>`;
      o += `<use href="#${id}" fill="${this.hatchPat(ang, p.gap || 3, p.hw || 0.6)}" mask="url(#${mid})"/>`;
      if (p.core !== false) {
        o += `<use href="#${id}" fill="${p.washCol || G.umber}" opacity="${(p.wash !== undefined ? p.wash : 0.34) * 1.45}" mask="url(#${core})"/>`;
        o += `<use href="#${id}" fill="${this.hatchPat(ang + 90 - (p.crossTilt || 30), (p.gap || 2.6) * 0.95, p.hw || 0.6)}" mask="url(#${core})"/>`;
      }
    }
    if (p.mottle) inner.push(`<rect x="${f(b.x0 - 4)}" y="${f(b.y0 - 4)}" width="${f(b.w + 8)}" height="${f(b.h + 8)}" filter="url(#${p.fine ? 'mottleF' : 'mottle'})" opacity="${f(p.mottle * (this.grainScale || 1))}"/>`);
    if (p.grime) o += `<use href="#${id}" fill="url(#${p.grimeId || 'grime'})" opacity="${p.grime}"/>`;
    if (p.decals) inner.push(p.decals);
    if (p.lines) inner.push(p.lines.map(l => typeof l === 'string' ? `<path d="${l}" fill="none" stroke="${p.lineCol || INK}" stroke-width="${p.lineW || 0.9}" stroke-linecap="round"/>` : `<path d="${l.d}" fill="${l.fill || 'none'}" stroke="${l.col || INK}" stroke-width="${l.w || 0.9}" stroke-linecap="round" ${l.op !== undefined ? `opacity="${l.op}"` : ''}/>`).join(''));
    if (inner.length) o += `<g clip-path="url(#${id}c)">${inner.join('')}</g>`;
    if (p.spec) o += `<g clip-path="url(#${id}c)">` + p.spec.map(l => `<path d="${l}" fill="none" stroke="#fffaf0" stroke-width="${p.specW || 1.4}" stroke-linecap="round" opacity="${p.specOp || 0.75}"/>`).join('') + `</g>`;
    if (p.free) o += p.free.map(l => typeof l === 'string' ? `<path d="${l}" fill="none" stroke="${INK}" stroke-width="${p.freeW || 0.9}" stroke-linecap="round"/>` : `<path d="${l.d}" fill="${l.fill || 'none'}" stroke="${l.col || INK}" stroke-width="${l.w || 0.9}" stroke-linecap="round"/>`).join('');
    const ink = p.ink === undefined ? 1.3 : p.ink;
    if (ink > 0) {
      o += `<use href="#${id}" fill="none" stroke="${p.inkCol || INK}" stroke-width="${ink * 0.75}" stroke-linejoin="round"/>`;
      if (mid) o += `<use href="#${id}" fill="none" stroke="${p.inkCol || INK}" stroke-width="${ink * 2.1}" stroke-linejoin="round" mask="url(#${mid})"/>`;
    }
    if (p.after) o += p.after;
    if (p.over) o += p.over;
    o += `</g>`;
    this.body.push(o); this.tags.push(this.cur);
    return id;
  }
  // tapered limb with cross-contour engraving strokes that follow the form
  limb(spine, widths, p = {}) {
    const gap = p.cgap || 2.4, pts = [], n = spine.length;
    // resample along the spine
    let segs = [], total = 0;
    for (let i = 0; i < n - 1; i++) { const l = Math.hypot(spine[i + 1][0] - spine[i][0], spine[i + 1][1] - spine[i][1]); segs.push(l); total += l; }
    let d = '';
    const bulge = p.bulge !== undefined ? p.bulge : 0.32;
    for (let s = -widths[0] * 0.4; s <= total + widths[n - 1] * 0.4; s += gap) {
      let acc = 0, i = 0;
      const sc = Math.max(0, Math.min(total - 0.001, s));
      while (i < segs.length - 1 && acc + segs[i] < sc) { acc += segs[i]; i++; }
      const u = (sc - acc) / segs[i];
      const c = [spine[i][0] + (spine[i + 1][0] - spine[i][0]) * u + 0, spine[i][1] + (spine[i + 1][1] - spine[i][1]) * u];
      const tt = norm([spine[i + 1][0] - spine[i][0], spine[i + 1][1] - spine[i][1]]);
      const off = s - sc; c[0] += tt[0] * off; c[1] += tt[1] * off;
      const w = (widths[i] + (widths[i + 1] - widths[i]) * u) / 2 * 1.15, nn = [-tt[1], tt[0]];
      const ax = c[0] + nn[0] * w, ay = c[1] + nn[1] * w, bx = c[0] - nn[0] * w, by = c[1] - nn[1] * w;
      d += `M${f(ax)} ${f(ay)} Q${f(c[0] + tt[0] * w * bulge * 2)} ${f(c[1] + tt[1] * w * bulge * 2)} ${f(bx)} ${f(by)} `;
    }
    const contour = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${p.hw || 0.7}"/>`;
    return this.shape(Object.assign({ d: limb(spine, widths), contour }, p));
  }
  // ------------------------------------------------------------------ gore and grime decals (return strings; pass in decals or raw)
  splat(cx, cy, r, opts = {}) {
    const R = this.R, col = opts.col || G.blood;
    let o = `<path d="${blob(cx, cy, r, R, 11, 0.4)}" fill="${col}" opacity="${opts.op || 0.92}"/>`;
    o += `<path d="${blob(cx - r * 0.15, cy - r * 0.15, r * 0.45, R, 8, 0.3)}" fill="${G.bloodD}" opacity="0.55"/>`;
    const n = opts.drops === undefined ? 9 : opts.drops;
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2, d = r * (1.1 + R() * 1.4), rr = r * (0.06 + R() * 0.14);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.85;
      o += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="${col}"/>`;
      if (R() < 0.45) { const x2 = cx + Math.cos(a) * (d - rr * 3), y2 = cy + Math.sin(a) * (d - rr * 3) * 0.85; o += `<path d="M${f(x2)} ${f(y2)} L${f(x)} ${f(y)}" stroke="${col}" stroke-width="${f(rr * 1.1)}" stroke-linecap="round"/>`; }
    }
    return o;
  }
  drip(x, y, len, w = 2.4, col = G.blood) {
    const R = this.R, wob = (R() - 0.5) * 2;
    return `<path d="M${f(x - w / 2)} ${f(y)} C${f(x - w / 2 + wob)} ${f(y + len * 0.5)} ${f(x - w * 0.3)} ${f(y + len * 0.8)} ${f(x - w * 0.55)} ${f(y + len)} C${f(x - w * 0.6)} ${f(y + len + w * 1.2)} ${f(x + w * 0.6)} ${f(y + len + w * 1.2)} ${f(x + w * 0.55)} ${f(y + len)} C${f(x + w * 0.3)} ${f(y + len * 0.8)} ${f(x + w / 2 + wob)} ${f(y + len * 0.5)} ${f(x + w / 2)} ${f(y)} Z" fill="${col}"/>` +
      `<path d="M${f(x - w * 0.1)} ${f(y + len * 0.2)} L${f(x - w * 0.12)} ${f(y + len * 0.7)}" stroke="#d8573d" stroke-width="${f(w * 0.18)}" opacity="0.5" stroke-linecap="round"/>`;
  }
  drips(x0, x1, y, n, maxLen, w = 2.2, col = G.blood) {
    let o = '';
    for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)) + (this.R() - 0.5) * 3; o += this.drip(x, y, maxLen * (0.25 + this.R() * 0.75), w * (0.7 + this.R() * 0.6), col); }
    return o;
  }
  // a gash: dark slit with a raw red rim and stitch-like hatch around
  gash(x1, y1, x2, y2, w = 5, opts = {}) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, t = norm([x2 - x1, y2 - y1]), n = [-t[1], t[0]];
    const p = (k, s) => [mx + n[0] * w * k * s, my + n[1] * w * k * s];
    const d = `M${f(x1)} ${f(y1)} Q${f(p(1, 1)[0])} ${f(p(1, 1)[1])} ${f(x2)} ${f(y2)} Q${f(p(1, -1)[0])} ${f(p(1, -1)[1])} ${f(x1)} ${f(y1)} Z`;
    const d2 = `M${f(x1)} ${f(y1)} Q${f(p(0.45, 1)[0])} ${f(p(0.45, 1)[1])} ${f(x2)} ${f(y2)} Q${f(p(0.45, -1)[0])} ${f(p(0.45, -1)[1])} ${f(x1)} ${f(y1)} Z`;
    let o = `<path d="${d}" fill="${opts.rim || G.bloodW}" stroke="${INK}" stroke-width="0.9"/><path d="${d2}" fill="${G.bloodD}"/>`;
    if (opts.drip !== false) o += this.drip(mx + n[0] * w * 0.4, my + Math.abs(n[1]) * w * 0.4, opts.dripLen || 14, w * 0.5);
    return o;
  }
  // claw/rake marks
  rake(x, y, ang, len, n = 3, gap = 6, w = 2.6) {
    let o = ''; const t = [Math.cos(ang), Math.sin(ang)], nn = [-t[1], t[0]];
    for (let i = 0; i < n; i++) { const ox = x + nn[0] * gap * i, oy = y + nn[1] * gap * i; o += this.gash(ox, oy, ox + t[0] * len * (0.8 + this.R() * 0.3), oy + t[1] * len * (0.8 + this.R() * 0.3), w, { drip: i === 1, dripLen: 10 }); }
    return o;
  }
  // stain: soft irregular wash (used for dried blood, rust, water marks)
  stain(cx, cy, r, col = G.blood, op = 0.45) {
    // soft, rough-edged wash; no contour so it reads as soak rather than a patch
    const R = this.R, o2 = op * 0.7;
    return `<g filter="url(#rough)"><path d="${blob(cx, cy, r, R, 12, 0.45)}" fill="${col}" opacity="${o2 * 0.7}"/><path d="${blob(cx + r * 0.1, cy + r * 0.12, r * 0.62, R, 10, 0.4)}" fill="${col}" opacity="${o2}"/></g>`;
  }

  // a cloth fold: a tapering dark wedge of hatching from (x1,y1) to (x2,y2)
  fold(x1, y1, x2, y2, w = 6, ang = 70) {
    const t = norm([x2 - x1, y2 - y1]), n = [-t[1], t[0]];
    const d = `M${f(x1)} ${f(y1)} Q${f((x1 + x2) / 2 + n[0] * w)} ${f((y1 + y2) / 2 + n[1] * w)} ${f(x2)} ${f(y2)} Q${f((x1 + x2) / 2 + n[0] * w * 0.2)} ${f((y1 + y2) / 2 + n[1] * w * 0.2)} ${f(x1)} ${f(y1)} Z`;
    return `<path d="${d}" fill="${G.umber}" opacity="0.35"/><path d="${d}" fill="${this.hatchPat(ang, 2.2, 0.6)}"/><path d="M${f(x1)} ${f(y1)} Q${f((x1 + x2) / 2 + n[0] * w * 0.2)} ${f((y1 + y2) / 2 + n[1] * w * 0.2)} ${f(x2)} ${f(y2)}" stroke="${INK}" stroke-width="0.9" fill="none"/>`;
  }
  rivet(x, y, r = 1.8) { return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${G.steelL}" stroke="${INK}" stroke-width="0.8"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.35)}" fill="#fff" opacity="0.7"/>`; }
  ground(cx, cy, rx, ry = 9) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${G.umber}" opacity="0.28"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${this.hatchPat(-20, 3.2, 0.6)}" opacity="0.8"/><ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.6}" ry="${ry * 0.6}" fill="${this.hatchPat(70, 3, 0.6)}" opacity="0.7"/>`;
  }
  svg(wobble = true) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.w}" height="${this.h}" viewBox="0 0 ${this.w} ${this.h}"><defs>${this.defs.join('')}</defs>${this._wrap(`<g${wobble ? ' filter="url(#wob)"' : ''}>${this.body.join('\n')}</g>`)}</svg>`;
  }
}
module.exports = { Art, G, INK, smooth, limb, poly, bbox, blob, rng, norm, L };
