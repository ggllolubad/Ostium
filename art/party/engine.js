// Ostium party figure engine. Builds layered SVG figures from joints.
// One key light from the upper left. Three render modes: ink, paint, block.
'use strict';

// ---------- vector + colour helpers ----------
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = a => Math.hypot(a[0], a[1]);
const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const rot = (a, ang) => { const c = Math.cos(ang), s = Math.sin(ang); return [a[0] * c - a[1] * s, a[0] * s + a[1] * c]; };
const deg = d => d * Math.PI / 180;
const f1 = n => Math.round(n * 10) / 10;

function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function rgb2hex(c) { return '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); }

// seeded random so renders are repeatable
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

// ---------- paths ----------
// pts: [x,y] or [x,y,1] (1 = sharp corner). Closed Catmull-Rom smoothing.
function smooth(pts, closed = true, k = 1) {
  const n = pts.length; if (n < 3) return 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L');
  const P = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const s1 = p1[2] ? 0 : k / 6, s2 = p2[2] ? 0 : k / 6;
    const c1 = [p1[0] + (p2[0] - p0[0]) * s1, p1[1] + (p2[1] - p0[1]) * s1];
    const c2 = [p2[0] - (p3[0] - p1[0]) * s2, p2[1] - (p3[1] - p1[1]) * s2];
    d += `C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); } return [x0, y0, x1, y1]; }

// tapered limb from a to b. Side P is +normal (screen-left for a downward limb), Q is -normal.
// bumps: [[t, amp, sigma]] amp as fraction of local half width.
function limb(a, b, wa, wb, o = {}) {
  const d = norm(sub(b, a)), n = [-d[1], d[0]], L = len(sub(b, a));
  const steps = o.steps || 14, P = [], Q = [];
  const bump = (arr, t) => (arr || []).reduce((s, [bt, amp, sg]) => s + amp * Math.exp(-((t - bt) ** 2) / (2 * sg * sg)), 0);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, c = lerp(a, b, t), w = (wa + (wb - wa) * t) / 2;
    P.push(add(c, mul(n, w * (1 + bump(o.p, t)))));
    Q.push(add(c, mul(n, -w * (1 + bump(o.q, t)))));
  }
  const cap = (c, w, dir, k) => { const r = []; for (let i = 1; i < 6; i++) { const ang = Math.PI * i / 6; r.push(add(c, add(mul(n, Math.cos(ang) * w * (k > 0 ? 1 : -1)), mul(dir, Math.sin(ang) * w * (o.capK || 0.7))))); } return r; };
  for (const [ft, side, dep] of (o.folds || [])) {
    const i = Math.max(1, Math.min(steps - 1, Math.round(ft * steps))), arr = side === 'p' ? P : Q, c = lerp(a, b, ft);
    const q = arr[i], v = sub(c, q); arr[i] = [...add(q, mul(v, dep)), 1];
  }
  const out = [...P];
  if (o.capB !== false) out.push(...cap(b, wb / 2, d, 1));
  out.push(...Q.reverse());
  if (o.capA !== false) out.push(...cap(a, wa / 2, mul(d, -1), -1));
  return out;
}
// point along a limb, offset along its normal (+ = P side)
function lp(a, b, t, off = 0) { const d = norm(sub(b, a)); return add(lerp(a, b, t), mul([-d[1], d[0]], off)); }
// quad plate between t0 and t1 of a segment
function plate(a, b, t0, t1, w0, w1, o = {}) {
  const sh = o.shift || 0, bow = o.bow || 0;
  const p0 = lp(a, b, t0, sh), p1 = lp(a, b, t1, sh), d = norm(sub(b, a)), n = [-d[1], d[0]];
  const m = lerp(p0, p1, 0.5);
  return [add(p0, mul(n, w0 / 2)), add(add(m, mul(n, (w0 + w1) / 4 + bow)), [0, 0]), add(p1, mul(n, w1 / 2)), [...add(p1, mul(n, -w1 / 2)), o.sharp ? 1 : 0], add(m, mul(n, -(w0 + w1) / 4 - bow)), [...add(p0, mul(n, -w0 / 2)), o.sharp ? 1 : 0]];
}
// ellipse polygon
function ell(c, rx, ry, ang = 0, n = 16) { const r = []; for (let i = 0; i < n; i++) { const t = Math.PI * 2 * i / n; r.push(add(c, rot([Math.cos(t) * rx, Math.sin(t) * ry], ang))); } return r; }
// local frame: map local points [u,v] by origin, angle, scale
function frame(o, ang, s) { return pts => pts.map(p => { const q = add(o, rot([p[0] * s, p[1] * s], ang)); return p[2] ? [q[0], q[1], 1] : q; }); }

// ---------- figure ----------
class Fig {
  constructor(o = {}) {
    this.o = Object.assign({
      mode: 'ink', light: [-0.6, -0.8], ink: '#14100c', shadowTint: '#1d1a2a', keyTint: '#fff1d6', rim: null, rimDir: [1, -0.2],
      grimeY: null, groundY: 790, mud: '#2a2014', hatch: true, seed: 7, inkW: 1.5, inkHeavy: 3.4, wobble: 1.6,
    }, o);
    this.defs = []; this.out = []; this.n = 0; this.r = rng(this.o.seed);
    this.marks = [{ i: 0, bone: 'root' }]; this.joints = {};
    this.L = norm(this.o.light);
  }
  id(p) { return `${p}${this.o.seed}_${this.n++}`; }
  raw(s) { this.out.push(s); }
  // ---- rigging: everything drawn after bone(name) belongs to that bone until the next bone() call.
  // joint(name, pivot, parent) records where a bone rotates and what it hangs from.
  bone(name) { const last = this.marks[this.marks.length - 1]; if (last.i === this.out.length) last.bone = name; else this.marks.push({ i: this.out.length, bone: name }); return this; }
  joint(name, pivot, parent = null) { this.joints[name] = { pivot: [f1(pivot[0]), f1(pivot[1])], parent }; return this; }
  runs() {
    const res = [];
    this.marks.forEach((m, k) => { const end = k + 1 < this.marks.length ? this.marks[k + 1].i : this.out.length; if (end > m.i) res.push({ bone: m.bone, body: `<g filter="url(#wob${this.o.seed})">${this.out.slice(m.i, end).join('\n')}</g>` }); });
    return res;
  }

  // filled, shaded shape. pts array or {d, bb}
  part(pts, o = {}) {
    const m = this.o.mode;
    if (o.sharp && typeof pts !== 'string') pts = pts.map(q => [q[0], q[1], 1]);
    const d = typeof pts === 'string' ? pts : smooth(pts, true, o.k ?? 1);
    const bb = o.bb || bbox(typeof pts === 'string' ? o.bbPts : pts);
    const w = bb[2] - bb[0], h = bb[3] - bb[1], size = Math.max(4, Math.min(w, h));
    const base = o.fill || '#888';
    const sh = o.shade ?? (m === 'block' ? 0.5 : m === 'paint' ? 0.5 : 0.36);
    const s = Math.min(size * sh * (m === 'block' ? 1.35 : 1), o.maxShade || 70), hl = Math.min(size * (o.hi ?? 0.08), 6);
    const L = this.L, pad = 40;
    const rx = bb[0] - pad, ry = bb[1] - pad, rw = w + pad * 2, rh = h + pad * 2;
    const R = (f, extra = '') => `<rect x="${f1(rx)}" y="${f1(ry)}" width="${f1(rw)}" height="${f1(rh)}" fill="${f}" ${extra}/>`;
    const shadowC = o.shadow || mix(base, this.o.shadowTint, m === 'block' ? 0.88 : m === 'paint' ? 0.55 : 0.6);
    const sMul = m === 'block' ? 1.35 : 1;
    const hiC = o.light || mix(base, this.o.keyTint, m === 'paint' ? 0.22 : 0.3);
    const cid = this.id('c'), mid = this.id('m'), mid2 = this.id('m'), mid3 = this.id('m');
    const blur = m === 'paint' ? `filter="url(#soft${this.o.seed})"` : '';
    this.defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
    this.defs.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${rx}" y="${ry}" width="${rw}" height="${rh}">${R('#fff')}<path d="${d}" transform="translate(${f1(L[0] * s)},${f1(L[1] * s)})" fill="#000" ${blur}/></mask>`);
    this.defs.push(`<mask id="${mid2}" maskUnits="userSpaceOnUse" x="${rx}" y="${ry}" width="${rw}" height="${rh}">${R('#fff')}<path d="${d}" transform="translate(${f1(L[0] * s * 0.45)},${f1(L[1] * s * 0.45)})" fill="#000"/></mask>`);
    let g = '';
    if (o.cast !== false && this.o.cast !== false) g += `<path d="${d}" transform="translate(${f1(-L[0] * 4)},${f1(-L[1] * 5)})" fill="#000" opacity="${o.castOp ?? 0.42}" filter="url(#cast${this.o.seed})"/>`;
    g += `<g clip-path="url(#${cid})">`;
    if (o.noShade) {
      g += R(base);
    } else {
      g += R(hiC);
      g += `<path d="${d}" transform="translate(${f1(-L[0] * hl)},${f1(-L[1] * hl)})" fill="${base}"/>`;
      if (o.tex) g += R(`url(#${o.tex})`, `opacity="${o.texOp ?? 0.5}"`);
      if (o.grad !== false && m === 'paint') g += R(`url(#vgrad${this.o.seed})`, 'opacity="0.35"');
      g += R(shadowC, `mask="url(#${mid})"`);
      if (this.o.hatch && o.hatch !== false && m !== 'block') g += R(`url(#hatch${this.o.seed})`, `mask="url(#${mid2})" opacity="${m === 'paint' ? 0.18 : 0.55}"`);
      if (m === 'ink' && o.hatch !== false && this.o.hatch) g += R(`url(#xhatch${this.o.seed})`, `mask="url(#${mid})" opacity="0.5"`);
      if (this.o.rim && o.rim !== false) {
        // thin cool fill-side rim: 2-3 px, half strength, so it reads as light, not as a sticker outline
        const rid = this.id('m'), rd = norm(this.o.rimDir), rs = Math.min(size * 0.05, 2.8);
        this.defs.push(`<mask id="${rid}" maskUnits="userSpaceOnUse" x="${rx}" y="${ry}" width="${rw}" height="${rh}">${R('#fff')}<path d="${d}" transform="translate(${f1(-rd[0] * rs)},${f1(-rd[1] * rs)})" fill="#000"/></mask>`);
        g += R(this.o.rim, `mask="url(#${rid})" opacity="${o.rimOp ?? 0.5}"`);
      }
    }
    if (this.o.grimeY != null && o.grime !== false && bb[3] > this.o.grimeY) g += R(`url(#grime${this.o.seed})`);
    if (o.over) g += o.over;
    g += `<rect x="${f1(rx)}" y="${f1(ry)}" width="${f1(rw)}" height="${f1(rh)}" fill="url(#grit${this.o.seed})" opacity="${o.gritOp ?? 0.55}"/>`;
    g += '</g>';
    const iw = o.inkW ?? this.o.inkW, ih = o.inkHeavy ?? this.o.inkHeavy;
    if (iw > 0) {
      g += `<path d="${d}" fill="none" stroke="${this.o.ink}" stroke-width="${iw}" stroke-linejoin="round"/>`;
      this.defs.push(`<mask id="${mid3}" maskUnits="userSpaceOnUse" x="${rx}" y="${ry}" width="${rw}" height="${rh}">${R('#fff')}<path d="${d}" transform="translate(${f1(L[0] * s * 0.7)},${f1(L[1] * s * 0.7)})" fill="#000"/></mask>`);
      if (ih > 0) g += `<path d="${d}" fill="none" stroke="${this.o.ink}" stroke-width="${ih}" stroke-linejoin="round" mask="url(#${mid3})"/>`;
    }
    this.out.push(`<g${o.opacity ? ` opacity="${o.opacity}"` : ''}>${g}</g>`);
    return d;
  }
  // flat fill with no shading (deep shadows, holes, slits)
  flat(pts, fill, o = {}) { if (o.sharp && typeof pts !== 'string') pts = pts.map(q => [q[0], q[1], 1]); const d = typeof pts === 'string' ? pts : smooth(pts, true, o.k ?? 1); this.out.push(`<path d="${d}" fill="${fill}"${o.op ? ` opacity="${o.op}"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}${o.blend ? ` style="mix-blend-mode:${o.blend}"` : ''}/>`); }
  // ink line through points
  line(pts, w = 1.4, col, o = {}) {
    const d = o.straight ? 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L') : smooth(pts, false, o.k ?? 1);
    this.out.push(`<path d="${d}" fill="none" stroke="${col || this.o.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o.op ? ` opacity="${o.op}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`);
  }
  // tapered brush stroke: from a through b to c, max width w
  stroke(pts, w = 3, col, o = {}) {
    const n = pts.length, L = [], R2 = [];
    for (let i = 0; i < n; i++) {
      const pa = pts[Math.max(0, i - 1)], pb = pts[Math.min(n - 1, i + 1)], d = norm(sub(pb, pa)), nn = [-d[1], d[0]];
      const t = i / (n - 1), ww = w * Math.sin(Math.PI * (0.08 + 0.84 * t)) * (o.taper === 'start' ? (1 - t * 0.7) : 1) / 2;
      L.push(add(pts[i], mul(nn, ww))); R2.push(add(pts[i], mul(nn, -ww)));
    }
    this.flat([...L, ...R2.reverse()], col || this.o.ink, { op: o.op });
  }
  rivet(p, r = 3, col = '#8a8a86') {
    this.out.push(`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r}" fill="${mix(col, '#000', 0.35)}" stroke="${this.o.ink}" stroke-width="0.9"/><circle cx="${f1(p[0] - r * 0.3)}" cy="${f1(p[1] - r * 0.35)}" r="${r * 0.42}" fill="${mix(col, '#fff', 0.55)}"/>`);
  }
  scratches(c, rad, n, col = '#e8e2d2', w = 0.9, ang = -0.5) {
    for (let i = 0; i < n; i++) {
      const p = add(c, [(this.r() - 0.5) * rad * 2, (this.r() - 0.5) * rad * 2]), a = ang + (this.r() - 0.5) * 0.8, l = 4 + this.r() * 9;
      this.line([p, add(p, rot([l, 0], a))], w, col, { straight: true, op: 0.75 });
    }
  }
  spatter(c, rad, n, col = '#5c0f0b') {
    for (let i = 0; i < n; i++) {
      const a = this.r() * Math.PI * 2, rr = Math.pow(this.r(), 1.6) * rad, p = add(c, [Math.cos(a) * rr, Math.sin(a) * rr]);
      const r = 0.6 + this.r() * (rr < rad * 0.3 ? 3.2 : 1.6);
      this.out.push(`<ellipse cx="${f1(p[0])}" cy="${f1(p[1])}" rx="${f1(r * 1.3)}" ry="${f1(r)}" transform="rotate(${f1(a * 57)} ${f1(p[0])} ${f1(p[1])})" fill="${col}" opacity="0.85"/>`);
    }
  }
  stitches(pts, col = '#d8cbb0', w = 1) { this.line(pts, w, col, { dash: '3 3', op: 0.8 }); }

  // ---- defs shared by all parts of this figure ----
  sharedDefs() {
    const s = this.o.seed, ink = this.o.ink, m = this.o.mode;
    const gy = this.o.grimeY ?? 0, gg = this.o.groundY;
    return `
<pattern id="hatch${s}" patternUnits="userSpaceOnUse" width="${m === 'ink' ? 6.5 : 5}" height="7" patternTransform="rotate(-38)"><line x1="1" y1="0" x2="1" y2="7" stroke="${ink}" stroke-width="${m === 'paint' ? 1 : 1.5}"/></pattern>
<pattern id="xhatch${s}" patternUnits="userSpaceOnUse" width="${m === 'ink' ? 6.5 : 5}" height="7" patternTransform="rotate(42)"><line x1="1" y1="0" x2="1" y2="7" stroke="${ink}" stroke-width="1.4"/></pattern>
<filter id="soft${s}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5"/></filter>
<filter id="cast${s}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter>
<linearGradient id="vgrad${s}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient>
<linearGradient id="grime${s}" gradientUnits="userSpaceOnUse" x1="0" y1="${gy}" x2="0" y2="${gg}"><stop offset="0" stop-color="${this.o.mud}" stop-opacity="0"/><stop offset="0.55" stop-color="${this.o.mud}" stop-opacity="0.3"/><stop offset="0.92" stop-color="${this.o.mud}" stop-opacity="0.55"/><stop offset="1" stop-color="${this.o.mud}" stop-opacity="0.7"/></linearGradient>
<filter id="gritf${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${s}"/><feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 -2.2 1.25"/></filter>
<pattern id="grit${s}" patternUnits="userSpaceOnUse" width="256" height="256"><rect width="256" height="256" filter="url(#gritf${s})"/></pattern>
<filter id="wob${s}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="turbulence" baseFrequency="0.045" numOctaves="2" seed="${s + 3}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="${this.o.wobble}" xChannelSelector="R" yChannelSelector="G"/></filter>
${TEX(s, ink)}`;
  }
  svg() { return { defs: this.sharedDefs() + this.defs.join('\n'), body: `<g filter="url(#wob${this.o.seed})">${this.out.join('\n')}</g>` }; }
}

// material textures, referenced by o.tex = 'mail'+seed etc.
function TEX(s, ink) {
  return `
<pattern id="mail${s}" patternUnits="userSpaceOnUse" width="7" height="6"><path d="M0,3 a3.5,3 0 0 1 7,0" fill="none" stroke="${ink}" stroke-width="1.1"/><path d="M-3.5,6 a3.5,3 0 0 1 7,0 M3.5,6 a3.5,3 0 0 1 7,0" fill="none" stroke="${ink}" stroke-width="1.1"/><circle cx="3.5" cy="1.4" r="0.8" fill="#fff" opacity="0.5"/></pattern>
<pattern id="weave${s}" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M0,1 h4 M1,0 v4" stroke="${ink}" stroke-width="0.6" opacity="0.6"/></pattern>
<pattern id="wood${s}" patternUnits="userSpaceOnUse" width="60" height="9" patternTransform="rotate(90)"><path d="M0,2 q15,2 30,0 t30,0 M0,6 q20,-2 40,1 t20,0" fill="none" stroke="${ink}" stroke-width="0.9" opacity="0.8"/></pattern>
<filter id="mottlef${s}"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="${s + 9}"/><feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 -1.6 1.0"/></filter>
<pattern id="mottle${s}" patternUnits="userSpaceOnUse" width="300" height="300"><rect width="300" height="300" filter="url(#mottlef${s})"/></pattern>
<pattern id="quilt${s}" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)"><path d="M0,0 v10 M0,0 h10" stroke="${ink}" stroke-width="0.8" stroke-dasharray="2 1.5" opacity="0.7"/></pattern>`;
}

module.exports = { add, sub, mul, len, norm, lerp, rot, deg, mix, rng, smooth, bbox, limb, lp, plate, ell, frame, Fig, f1 };
