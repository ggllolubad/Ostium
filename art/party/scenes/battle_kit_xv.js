// Battle-room kit for World XV, the Torn Sky (finale-tier rebuild, 2026-11-24). New file; lik.js, battle_kit_b.js and
// battle_kit_g5.js are required, not edited. XV.make(seed, murk, shadowTint, air) returns { S, B, G, X } where S/B/G are
// the g5 kit (the shared battle camera) and X adds the spectacle helpers this world needs:
//   grad / rgrad / blurF        smooth gradients (skies, fog and light ONLY) and soft-edge filters, registered in DEFS
//   sky                         a full-frame sky: a smooth vertical gradient plus soft radial glows
//   softCloud                   a soft-edged cloud mass: lobes of very different size shaded from the light, gradient
//                               falloff at the edges, wisps breaking off downwind, a hatched underside, broken ink on top
//   stormWall                   a towering storm front built of softCloud masses, dark core, lit rim on the light side
//   cloudSea                    the sea of cloud far below heaven: rows of soft tops, smaller toward the horizon
//   shaftG                      a light shaft as a smooth gradient (bright at the source, fading), soft edges, motes
//   island                      a floating island of heaven: weathered stone lens, an organic hanging underside with
//                               strata, buildings on its top (cathedral, towers, domes), waterfalls pouring off its lip,
//                               the pieces that fell from its underside hanging below it in a deliberate line
//   waterfall                   a fall of water off a lip, widening and thinning into mist
//   chainC                      a catenary chain between two points
//   halo                        a broken halo ring (gilt over black, modelled toward the light); the broken arc's pieces
//                               drift outward IN SEQUENCE along the ring (each a little further), never scattered
//   colossus                    a kneeling statue of the heavenly host (wings raised and folded, head bowed, hands on a
//                               sword) at any scale; weathered stone with gilt remnants
//   column                      a round column in 3D: cylindrical cel bands, fluting, drums, base, capital; o.broken
//                               breaks it and lifts its upper drums apart along its own axis in sequence
//   stone / giltW / weather     weathered stone (stains running down, grime at the foot, pits, cracks, lichen, chipped
//                               arrises) and weathered gilt (leaf lost to black at edges and cracks, grime, burnish)
//   tearS                       a torn void in screen units (tornVoid on a screen-parallel plane), with eyes
//   rain                        slanting rain streaks
// Organic forms are drawn with smooth curves only (no polyline kinks). Usage: const { S, B, G, X } = require('./battle_kit_xv').make(...)
'use strict';
const G5 = require('./battle_kit_g5');

function make(seed, murk, sht, air) {
  const { S, B, G } = G5.make(seed, murk, sht, air);
  const { P, K, p2, f1, INK, KEY, cel, chip, mix, R, smooth, inkW, hatchA, hatchB, id, DEFS } = S;
  const { line, pline, fillP, fillS, inkP, inkS, blob, burn } = B;
  const { W, H, GOLD, GOLDL, GOLDD, BLACK } = G;
  const AIR = air || murk;
  const VIO = '#b49ae8';
  const MV = require('./materials_v2')(S);   // materials v2 (Cole's polish round): weathered stone marks, natural rock skin
  const fade = (col, k) => mix(col, AIR, Math.max(0, Math.min(1, k)));
  const burnV = (x, y, a, l, w, o = {}) => burn(x, y, a, l, w, Object.assign({ core: VIO, scorch: '#0c0810', coreOp: 0.75, branchP: 0.55, spread: 0.6 }, o));

  // ------------------------------------------------------------------ gradients and soft filters (sky, fog, light only)
  const stopsS = st => st.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  function grad(st, x1, y1, x2, y2) { const i = id('lg'); DEFS.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}">${stopsS(st)}</linearGradient>`); return `url(#${i})`; }
  function gradB(st, ang = 90) { const i = id('lb'), a = ang * Math.PI / 180; DEFS.push(`<linearGradient id="${i}" x1="${f1(0.5 - Math.cos(a) / 2)}" y1="${f1(0.5 - Math.sin(a) / 2)}" x2="${f1(0.5 + Math.cos(a) / 2)}" y2="${f1(0.5 + Math.sin(a) / 2)}">${stopsS(st)}</linearGradient>`); return `url(#${i})`; }
  function rgrad(cx, cy, rx, ry, st, o = {}) { const i = id('rg'); DEFS.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" ${o.fx !== undefined ? `fx="${o.fx}" fy="${o.fy}"` : ''} gradientTransform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(o.rot || 0)}) scale(${f1(rx)} ${f1(ry)})">${stopsS(st)}</radialGradient>`); return `url(#${i})`; }
  const BL = {};
  function blurF(sd) { const k = Math.max(0.3, Math.round(sd * 2) / 2); if (!BL[k]) { BL[k] = id('bf'); DEFS.push(`<filter id="${BL[k]}" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${k}"/></filter>`); } return `url(#${BL[k]})`; }
  const glowE = (cx, cy, rx, ry, col, op, o = {}) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${rgrad(cx, cy, rx, ry, [[0, col, op], [o.mid ?? 0.45, col, op * (o.midOp ?? 0.45)], [1, col, 0]])}"/>`;

  // ------------------------------------------------------------------ sky
  // st: vertical gradient stops [[offset, colour]...] over 0..H (or o.y0..o.y1); glows: [[cx, cy, rx, ry, col, op]]
  function sky(st, glows = [], o = {}) {
    let s = `<rect width="${W}" height="${H}" fill="${st[0][1]}"/>`;
    s += `<rect width="${W}" height="${H}" fill="${grad(st, 0, o.y0 ?? 0, 0, o.y1 ?? H)}"/>`;
    for (const g of glows) s += glowE(...g);
    return s;
  }

  // ------------------------------------------------------------------ soft cloud
  // A mass of lobes (smooth blobs of very different sizes) under an envelope: bigger in the middle, a flat-ish base.
  // Each lobe is shaded from the light side (radial gradient offset toward the light), the whole body is blurred to a
  // soft edge; wisps tear off downwind; the underside darkens and takes a soft hatch; a few broken ink strokes ride the
  // lit top so it stays Living Ink. o: col (body), lit, dark, light [dx, dy] (toward the light, screen), soft (blur px),
  // n, flat, op, wisps, ink, hatch, base (flat base 0..1), tall (lobes stacked upward)
  // the outline of one cauliflower mass: the top is the envelope of circles of very different sizes, the base nearly
  // flat; (cx, by) base centre, w wide, h tall
  function massOutline(cx, by, w, h, o = {}) {
    const env = u => Math.pow(Math.max(0, Math.sin(Math.PI * u)), o.flat ?? 0.8), cs = [], n = Math.max(3, Math.round(w / h * (o.bumps ?? 2.2)));
    for (let i = 0; i < n; i++) { const u = 0.08 + 0.84 * (i + R() * 0.8) / n, e = env(u), r = Math.min(w * (o.rCap ?? 0.6), h * (0.22 + R() * 0.3) * (0.55 + e * 0.55)); cs.push([cx - w / 2 + w * u, by - h * e * (o.peak ?? 0.85) + r * 0.5, r]); }
    for (let i = 0; i < n * 1.4; i++) { const c = cs[Math.floor(R() * n)], a = -Math.PI / 2 + (R() - 0.5) * 2.6, r = c[2] * (0.18 + R() * 0.3); cs.push([c[0] + Math.cos(a) * c[2] * 0.85, c[1] + Math.sin(a) * c[2] * 0.85, r]); }
    if (o.flank) for (const side of [-1, 1]) for (let j = 0; j < o.flank; j++) { const v = 0.08 + 0.8 * (j + R() * 0.7) / o.flank, hw = w / 2 * Math.pow(Math.max(0.05, 1 - v * v), 0.5) * (o.taper ?? 0.85), r = h * (0.07 + R() * 0.09); cs.push([cx + side * (hw - r * 0.3), by - h * v * (o.peak ?? 0.85) * 1.05, r]); }
    const sk = c => Math.max(0, by - c[1]) * (o.skirt ?? 0.28);
    const xa = Math.min(cx - w / 2, ...cs.map(c => c[0] - c[2] - sk(c))), xb = Math.max(cx + w / 2, ...cs.map(c => c[0] + c[2] + sk(c))), N = Math.max(30, Math.round((xb - xa) / 3)), top = [];
    for (let k = 0; k <= N; k++) { const x = xa + (xb - xa) * k / N; let y = by; for (const c of cs) { const [qx, qy, r] = c, d = Math.abs(x - qx); if (d < r) y = Math.min(y, qy - Math.sqrt(r * r - d * d)); else { const S2 = sk(c); if (S2 > 0 && d < r + S2) { const t = (d - r) / S2; y = Math.min(y, qy + (by - qy) * t * t * (3 - 2 * t)); } } } top.push([x, Math.min(y, by)]); }
    const base = []; for (let k = 10; k >= 0; k--) { const t = k / 10; base.push([xa + (xb - xa) * t, by + h * (o.belly ?? 0.04) * Math.sin(Math.PI * t) + h * 0.015 * Math.sin(t * 13 + cx)]); }
    return { pts: [...top, ...base], top };
  }
  // one mass: { fill, rim, ink } strings. Fill: a smooth gradient along the light direction (lit side, body, shadow
  // side) and a darkening toward the base; rim: the contour segments that face the light, stroked in the lit colour
  // and clipped inside the mass (blurred by the caller: a soft rim of light); ink: broken strokes on the lit top
  function cloudMass(ol, h, o) {
    const { col, lit, dk, Ld } = o, d = p2(ol.pts), rim = o.rim ?? h * 0.14;
    const xs = ol.pts.map(p => p[0]), ys = ol.pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), c = [(x0 + x1) / 2, (y0 + y1) / 2], Rr = Math.max(x1 - x0, y1 - y0) * 0.5 * (o.span ?? 0.7);
    let fill = `<path d="${d}" fill="${grad([[0, mix(col, lit, o.litMix ?? 0.45)], [0.3, mix(col, lit, 0.12)], [0.62, col], [1, mix(col, dk, 0.75)]], c[0] + Ld[0] * Rr, c[1] + Ld[1] * Rr, c[0] - Ld[0] * Rr, c[1] - Ld[1] * Rr)}" opacity="${o.op ?? 1}"/>`;
    fill += `<path d="${d}" fill="${grad([[0, dk, 0], [0.55, dk, 0], [1, dk, o.baseDk ?? 0.55]], 0, y0, 0, y1)}"/>`;
    if (o.hatch !== false) fill += `<path d="${d}" fill="${hatchA(30)}" opacity="${o.hatchOp ?? 0.08}"/>`;
    // the contour facing the light
    const t0 = ol.top, t = t0.map((p, i) => { let sx = 0, sy = 0, n = 0; for (let j = Math.max(0, i - 3); j <= Math.min(t0.length - 1, i + 3); j++) { sx += t0[j][0]; sy += t0[j][1]; n++; } return [sx / n, sy / n]; }), segs = []; let cur = [];
    for (let i = 1; i < t.length - 1; i++) { const dx = t[i + 1][0] - t[i - 1][0], dy = t[i + 1][1] - t[i - 1][1], l = Math.hypot(dx, dy) || 1, nx = dy / l, ny = -dx / l; if (nx * Ld[0] + ny * Ld[1] > (o.rimT ?? 0.12)) { if (i % (o.rimStep ?? 3) === 0) cur.push(t[i]); } else { if (cur.length > 2) segs.push(cur); cur = []; } }
    if (cur.length > 2) segs.push(cur);
    const ci = id('cc'); DEFS.push(`<clipPath id="${ci}"><path d="${d}"/></clipPath>`);
    const rimS = segs.length ? `<g clip-path="url(#${ci})"><path d="${segs.map(sg => smooth(sg, false, 0.4)).join(' ')}" fill="none" stroke="${lit}" stroke-width="${f1(rim * 2)}" stroke-linejoin="round" stroke-linecap="round" opacity="${o.litOp ?? 0.9}"/><path d="${segs.map(sg => smooth(sg, false, 0.4)).join(' ')}" fill="none" stroke="${mix(lit, '#ffffff', 0.35)}" stroke-width="${f1(rim * 0.7)}" opacity="${(o.litOp ?? 0.9) * 0.7}"/></g>` : '';
    let ink = '';
    if (o.ink !== false && segs.length) { let dd = ''; for (const sg of segs) if (sg.length > 5 && R() < 0.6) { const a = Math.floor(R() * sg.length * 0.4); dd += smooth(sg.slice(a, a + Math.max(4, Math.floor(sg.length * (0.3 + R() * 0.4)))), false, 0.4) + ' '; } if (dd) ink = `<path d="${dd}" fill="none" stroke="${INK}" stroke-width="${f1(o.inkW ?? Math.max(0.6, h * 0.008))}" opacity="${o.inkOp ?? 0.3}" stroke-linecap="round"/>`; }
    return { fill, rim: rimS, ink };
  }
  const nrm = v => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l]; };
  // draw a list of masses: [{ol, h, o}] back to front, all fills in one softly blurred group, all rims in another
  function drawMasses(list, soft, rimSoft) {
    let f = '', r = '', k = '';
    for (const m of list) { const q = cloudMass(m.ol, m.h, m.o); f += q.fill; r += q.rim; k += q.ink; }
    return `<g filter="${blurF(soft)}">${f}</g><g filter="${blurF(rimSoft)}">${r}</g>${k}`;
  }
  // a cloud: a big back mass and smaller masses in front of its lower part; wisps downwind.
  // o: col, lit, dark, light [dx,dy] (toward the light), soft, fronts, flat, op, wisps, ink, hatch, rim
  function softCloud(cx, cy, w, h, o = {}) {
    const col = o.col || '#6a6070', lit = o.lit || mix(col, '#f4eee8', 0.55), dk = o.dark || mix(col, '#060408', 0.55);
    const Ld = nrm(o.light || [-0.6, -0.8]), soft = o.soft ?? Math.max(0.6, h * 0.008);
    const by = cy + h * 0.35, mo = Object.assign({}, o, { col, lit, dk, Ld }), list = [{ ol: massOutline(cx, by, w, h, o), h, o: mo }];
    const nf = o.fronts ?? Math.max(1, Math.round(w / h * 0.8));
    const fW = o.frontW || [0.3, 0.3]; for (let i = 0; i < nf; i++) { const u = (i + 0.5) / nf + (R() - 0.5) * 0.25 / nf, rise = (o.frontRise || 0) * R(), ww = w * (fW[0] + R() * fW[1]) * (1 - rise * 0.5), hh0 = h * (0.3 + R() * 0.25) * (o.frontRise ? 0.8 : 1), hh = Math.min(hh0, ww * 0.5), fx = cx - (w / 2) * (1 - rise * 0.6) + w * (1 - rise * 0.6) * u, fb = by + h * (0.04 + R() * 0.06) - h * rise;
      list.push({ ol: massOutline(fx, fb, ww, hh, Object.assign({}, o, { bumps: 2.2 })), h: hh, o: Object.assign({}, mo, { col: mix(col, dk, 0.08 + R() * 0.12), rim: (o.rim ?? h * 0.14) * 0.8, litOp: (o.litOp ?? 0.9) * 0.6, rimT: 0.35, rimStep: 4, ink: o.ink !== false && R() < 0.6 }) }); }
    list.sort((a, b) => a.ol.pts[0][1] - b.ol.pts[0][1]);
    let s = `<g opacity="${o.op ?? 1}">` + drawMasses(list, soft, Math.max(0.5, (o.rim ?? h * 0.14) * 0.3));
    for (let i = 0; i < (o.wisps ?? 2); i++) { const dir = o.wind ?? 1, ww = w * (0.15 + R() * 0.25), hh = Math.max(1.2, h * (0.04 + R() * 0.05)), x = cx + dir * (w * (0.35 + R() * 0.25)), y = by - h * (0.1 + R() * 0.5);
      s += `<path d="${smooth(blob(x, y, ww / 2, hh, 12, 0.35, dir * 0.05), true, 0.5)}" fill="${mix(col, lit, 0.3)}" opacity="${f1(0.3 + R() * 0.25)}" filter="${blurF(soft + hh * 0.5)}"/>`; }
    return s + '</g>';
  }
  // a towering storm wall: rows of overlapping cumulus billows from the top (behind) to the base (in front), the wall's
  // flank stepping outward toward the base; each billow lit on its edges toward the light; darker toward the base.
  // o.edge(v): the wall's left edge x at height fraction v (0 top, 1 base); x1 its right end
  function stormWall(x0, x1, yb, yt, o = {}) {
    let s = ''; const col = o.col || '#2a2236', co = o.cloud || {}, rows = o.rows || 5, bh0 = (yb - yt) / rows * 1.5;
    for (let r = 0; r < rows; r++) { const v = r / (rows - 1), y = yt + (yb - yt) * v + bh0 * 0.2, ex = o.edge ? o.edge(v) : x0 + (1 - v) * (x1 - x0) * 0.25, bw = bh0 * (1.8 + R() * 0.6) * (0.8 + v * 0.4), n = Math.ceil((x1 - ex) / bw * 1.5) + 1;
      for (let k = 0; k < n; k++) { const cx = ex + bw * 0.4 + (x1 - ex) * k / n + (R() - 0.5) * bw * 0.2, hh = bh0 * (0.75 + R() * 0.5), ww = bw * (0.85 + R() * 0.4);
        s += softCloud(cx, y, ww, hh, Object.assign({ col: mix(col, '#000', 0.25 * v + R() * 0.08), flat: 0.7, peak: 0.85, fronts: 1 + Math.round(R()), wisps: k === 0 ? 2 : 0, wind: -1, rim: hh * 0.07, rimT: 0.2, inkOp: 0.25, baseDk: 0.4 }, co, { lit: mix(co.lit || '#e8d8f0', col, 0.25 * v + (k > 0 ? 0.25 : 0)) })); } }
    return s;
  }
  // the sea of cloud far below heaven: rows of soft tops from the horizon (small, pale, dense) toward y1 (bigger)
  function cloudSea(y0, y1, o = {}) {
    const col = o.col || '#8a8498', lit = o.lit || '#e8e4f0', dk = o.dark || mix(col, '#100c18', 0.5), Ld = nrm(o.light || [-0.6, -0.8]);
    let s = `<rect x="-10" y="${f1(y0 - 2)}" width="${W + 20}" height="${f1(y1 - y0 + 60)}" fill="${grad([[0, mix(col, lit, 0.55)], [0.25, col], [1, dk]], 0, y0, 0, y1 + 40)}"/>`;
    const rows = o.rows || 7;
    for (let r = 0; r < rows; r++) { const u = r / Math.max(1, rows - 1), y = y0 + (y1 - y0) * Math.pow(u, 1.4) + 2, sc = 0.15 + u * u * (o.big || 1), mw = 140 * sc + 18, n = Math.ceil((W + 200) / mw * 1.8), list = [];
      for (let k = 0; k < n; k++) { const w = mw * (0.9 + R() * 1.1), hh = w * (0.12 + R() * 0.1), cx = -100 + (W + 200) * (k + R()) / n, yy = y + (R() - 0.5) * (y1 - y0) / rows * 0.8;
        list.push({ ol: massOutline(cx, yy, w, hh, { flat: 0.6, bumps: 3, belly: 0.1 }), h: hh, o: { col: mix(col, dk, u * 0.25 + R() * 0.1), lit: mix(lit, col, u * 0.2), dk, Ld, rim: hh * 0.16, litOp: 0.6, rimT: 0.3, rimStep: 4, ink: u > 0.45 && R() < 0.5, inkOp: 0.2, hatch: u > 0.5, hatchOp: 0.08 } }); }
      s += drawMasses(list, Math.max(0.5, mw * 0.004), Math.max(0.5, mw * 0.01)); }
    return s;
  }
  // ------------------------------------------------------------------ light
  // a light shaft: polygon (top edge first two points); a smooth gradient from the top (op) to nothing; soft edges
  function shaftG(poly, col, op = 0.3, o = {}) {
    const ys = poly.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let s = `<path d="${p2(poly)}" fill="${grad([[0, col, op], [o.mid ?? 0.55, col, op * (o.midOp ?? 0.5)], [1, col, o.endOp ?? 0]], 0, y0, 0, y1)}" filter="${blurF(o.soft ?? 6)}"/>`;
    if (o.core) { const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]), q = poly.map(([x, y]) => [c[0] + (x - c[0]) * 0.45, y]); s += `<path d="${p2(q)}" fill="${grad([[0, col, op * o.core], [1, col, 0]], 0, y0, 0, y1)}" filter="${blurF((o.soft ?? 6) * 0.7)}"/>`; }
    if (o.motes) { const xs = poly.map(p => p[0]); for (let i = 0; i < o.motes; i++) { const x = Math.min(...xs) + R() * (Math.max(...xs) - Math.min(...xs)), y = y0 + R() * (y1 - y0), r = 0.5 + R() * 1.2; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${col}" opacity="${f1(0.2 + R() * 0.45)}"/>`; } }
    return s;
  }

  // ------------------------------------------------------------------ weathering
  // weather the inside of a screen polygon: rain stains running down from the top edge, grime rising from the foot, pits,
  // fine cracks, pale lichen; o.op scales everything (distance), o.col: the surface colour
  function weather(poly, o = {}) {
    const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
    if (w < 3 || h < 3) return '';
    const c = id('wc'), k = o.op ?? 1, col = o.col || '#8a8278', dk = mix(col, '#0a0806', 0.6);
    let s = `<clipPath id="${c}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${c})">`;
    // grime rising from the foot, uneven
    if (o.grime !== false) s += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" fill="${grad([[0, dk, 0], [0.55, dk, 0.08 * k], [1, dk, 0.42 * k]], 0, y0, 0, y1)}"/>`;
    // rain stains: long tapering runs from the top edge and from ledges
    let st = '', sl = ''; const ns = Math.round(w / (o.stainGap || 7) * (o.stains ?? 1));
    for (let i = 0; i < ns; i++) { const x = x0 + R() * w, len = h * (0.15 + R() * 0.7), ww = Math.max(0.6, Math.min(5, w * (0.008 + R() * 0.02))), top = y0 + (R() < 0.7 ? 0 : R() * h * 0.5);
      const pts = []; for (let j = 0; j <= 5; j++) pts.push([x + Math.sin(j * 1.3 + i) * ww * 0.3, top + len * j / 5]);
      const L = pts.map(([a, b], j) => [a - ww * (1 - j / 6) / 2, b]), Rr = pts.map(([a, b], j) => [a + ww * (1 - j / 6) / 2, b]);
      (R() < 0.75 ? (st += smooth([...L, ...Rr.reverse()], true, 0.5) + ' ') : (sl += smooth([...L, ...Rr.reverse()], true, 0.5) + ' ')); }
    s += `<path d="${st}" fill="${dk}" opacity="${f1(0.22 * k)}"/><path d="${sl}" fill="${mix(col, '#f0ece0', 0.5)}" opacity="${f1(0.2 * k)}"/>`;
    if (o.mv) return s + '</g>';
    // pits and spots
    let pd = ''; for (let i = 0; i < Math.min(160, w * h / (o.pitArea || 90)); i++) { const x = x0 + R() * w, y = y0 + R() * h, r = 0.35 + R() * (o.pitR || 1.1); pd += `M${f1(x - r)} ${f1(y)} a${f1(r)} ${f1(r * 0.8)} 0 1 0 ${f1(r * 2)} 0 a${f1(r)} ${f1(r * 0.8)} 0 1 0 ${f1(-r * 2)} 0 `; }
    s += `<path d="${pd}" fill="${INK}" opacity="${f1(0.32 * k)}"/>`;
    // lichen / salt bloom: pale soft patches, mostly high and on the lit side
    if (o.lichen !== false) for (let i = 0; i < Math.round(w * h / 2500 * (o.lichenN ?? 1)) + 1; i++) { const x = x0 + R() * w * 0.7, y = y0 + R() * h * 0.6, r = Math.min(w, h) * (0.04 + R() * 0.08); s += `<path d="${smooth(blob(x, y, r, r * 0.7, 10, 0.5), true, 0.6)}" fill="${o.lichenCol || mix(col, '#d8d4b8', 0.5)}" opacity="${f1(0.2 * k)}"/>`; }
    // fine cracks
    for (let i = 0; i < Math.round(w * h / 9000 * (o.cracks ?? 1)) + (o.cracks === 0 ? 0 : 1); i++) { let x = x0 + R() * w, y = y0 + R() * h * 0.8, a = Math.PI / 2 + (R() - 0.5) * 1.4; const pts = [[x, y]]; const L = Math.min(h, 10 + R() * h * 0.4); for (let j = 0; j < 5; j++) { a += (R() - 0.5) * 0.9; x += Math.cos(a) * L / 5; y += Math.sin(a) * L / 5; pts.push([x, y]); } s += pline(pts, Math.max(0.5, o.crackW || 0.8), INK, 0.6 * k) + pline(pts.map(([a, b]) => [a + 0.8, b + 0.8]), 0.5, mix(col, '#fff', 0.5), 0.3 * k); }
    return s + '</g>';
  }
  // a weathered stone face: chipped cel polygon, mottle, weathering, an optional hatch on the shade side
  function stone(poly, Z, col, o = {}) {
    const q = o.chip === false ? poly : chip(poly, o.chip ?? 0.35);
    let s = cel(q, { Z, fill: col, tex: 'url(#mottle)', texOp: o.texOp ?? 0.5, band: o.band, hi: o.hi, inkW: o.inkW, heavy: o.heavy, ink: o.ink, shadow: o.shadow });
    if (o.shade) s += `<path d="${p2(q)}" fill="${hatchA(Z)}" opacity="${o.shade}"/>`;
    if (o.weather !== false) s += MV.stoneMarks(q, Z, col, { wy0: o.wy0 ?? 0.5 }) + weather(q, Object.assign({ col }, o.w || {}, { mv: true }));
    return s;
  }
  // weathered gilt: the g5 plate, plus leaf lost to the black along the edges and from the foot, grime and a burnish
  function giltW(q, Z, o = {}) {
    let s = G.gilt(q, Z, o);
    const xs = q.map(p => p[0]), ys = q.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
    if (w < 4 || h < 4) return s;
    const c = id('gw'), k = o.wear ?? 1, M = o.murk || murk, dim = o.dim || 0;
    s += `<clipPath id="${c}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${c})">`;
    // leaf lost: irregular soft patches showing black/dark stone, concentrated at the lower edge and the far side
    for (let i = 0; i < Math.round((w * h) / 600 * k) + 1; i++) { const u = Math.pow(R(), 0.6), x = x0 + (R() < 0.5 ? R() * w : w * (0.6 + R() * 0.4)), y = y0 + h * (0.35 + u * 0.7), r = Math.min(w, h) * (0.06 + R() * 0.14);
      const b = blob(x, y, r, r * (0.5 + R() * 0.5), 9, 0.6, R() * 3); s += `<path d="${smooth(b, true, 0.4)}" fill="${mix('#16121a', M, dim * 0.6)}" opacity="0.85"/><path d="${smooth(b.slice(0, 5), false, 0.4)}" fill="none" stroke="${mix(GOLDL, M, dim)}" stroke-width="0.5" opacity="0.5"/>`; }
    // grime running down in streaks and gathered at the foot
    s += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" fill="${grad([[0, '#1a1208', 0], [0.6, '#1a1208', 0.12 * k], [1, '#1a1208', 0.45 * k]], 0, y0, 0, y1)}"/>`;
    let st = ''; for (let i = 0; i < w / 9 * k; i++) { const x = x0 + R() * w, l = h * (0.2 + R() * 0.6), ww = 0.6 + R() * Math.min(3, w * 0.02); st += `M${f1(x - ww / 2)} ${f1(y0)} L${f1(x + ww / 2)} ${f1(y0)} L${f1(x + ww * 0.1)} ${f1(y0 + l)} Z `; }
    s += `<path d="${st}" fill="#1a1208" opacity="${f1(0.18 * k)}"/>`;
    // the burnish: a soft bright sheen toward the key light (upper left)
    if (o.burnish !== false) s += `<ellipse cx="${f1(x0 + w * 0.3)}" cy="${f1(y0 + h * 0.25)}" rx="${f1(w * 0.35)}" ry="${f1(h * 0.3)}" fill="${rgrad(x0 + w * 0.3, y0 + h * 0.25, w * 0.35, h * 0.3, [[0, mix('#fff4d0', M, dim), 0.35 * (o.sheen ?? 1)], [1, '#fff4d0', 0]])}"/>`;
    return s + '</g>';
  }

  // ------------------------------------------------------------------ void in screen units
  function tearS(cx, cy, w, h, o = {}) {
    const Zp = 20, at = (s2, t2) => [(cx + s2 - 740) / 652 * Zp, 1.2 - (cy + t2 - 300) / 652 * Zp, Zp];
    return B.tornVoid(at, 0, 0, w, h, Object.assign({ depth: 0, halo: false, n: 72, slivers: 8, flecks: 18 }, o));
  }
  // a tear's outline as a screen polygon (for clipping things inside it), using the same generator
  // rain: slanting streaks in a box, light and dark mixed
  function rain(x0, x1, y0, y1, n, o = {}) {
    let d = '', d2 = ''; const a = o.ang ?? 0.22;
    for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), l = (o.len || 14) * (0.5 + R()); const seg = `M${f1(x)} ${f1(y)} l${f1(-Math.sin(a) * l)} ${f1(Math.cos(a) * l)} `; if (R() < 0.6) d += seg; else d2 += seg; }
    return `<path d="${d}" stroke="${o.col || '#d8d0e8'}" stroke-width="${o.w || 0.6}" opacity="${o.op ?? 0.22}"/><path d="${d2}" stroke="${o.col2 || '#0c0a10'}" stroke-width="${o.w || 0.6}" opacity="${(o.op ?? 0.22) * 0.8}"/>`;
  }

  // ------------------------------------------------------------------ waterfall
  // a fall from a lip (x, y), width w px, falling len px; widens, thins, frays into streaks and ends in soft mist
  function waterfall(x, y, w, len, o = {}) {
    const col = o.col || '#e8eef4', dk = o.dark || mix(col, '#2a2a3a', 0.5), lean = o.lean || 0;
    const L = [], Rr = []; for (let i = 0; i <= 10; i++) { const u = i / 10, ww = w * (1 + u * (o.spread ?? 1.4)), cx = x + lean * len * u * u + (i === 0 ? 0 : Math.sin(u * 5) * w * 0.06); L.push([cx - ww / 2, y + len * u]); Rr.push([cx + ww / 2, y + len * u]); }
    const poly = [...L, ...Rr.reverse()];
    let s = `<path d="${smooth(poly, true, 0.5)}" fill="${grad([[0, col, o.op ?? 0.95], [0.5, col, (o.op ?? 0.95) * 0.6], [1, col, 0]], 0, y, 0, y + len)}" filter="${blurF(Math.max(0.4, w * 0.06))}"/>`;
    // streaks: lit and shaded strands down the fall
    let a = '', b = ''; for (let i = 0; i < Math.max(3, w / 2.5); i++) { const u = R(), l = len * (0.3 + R() * 0.6), y0 = y + R() * len * 0.2, x0 = x - w / 2 + w * u; const seg = `M${f1(x0)} ${f1(y0)} Q${f1(x0 + (u - 0.5) * w * 0.4)} ${f1(y0 + l * 0.5)} ${f1(x0 + (u - 0.5) * w * 1.2 + lean * l * 0.5)} ${f1(y0 + l)} `; if (u < 0.55) a += seg; else b += seg; }
    s += `<path d="${a}" stroke="#ffffff" stroke-width="${f1(Math.max(0.4, w * 0.05))}" fill="none" opacity="${0.45 * (o.op ?? 1)}"/><path d="${b}" stroke="${dk}" stroke-width="${f1(Math.max(0.4, w * 0.06))}" fill="none" opacity="${0.4 * (o.op ?? 1)}"/>`;
    // the lip: the water bending over the edge
    s += `<path d="M${f1(x - w * 0.55)} ${f1(y + 1)} Q${f1(x)} ${f1(y - w * 0.25)} ${f1(x + w * 0.55)} ${f1(y + 1)}" stroke="#ffffff" stroke-width="${f1(Math.max(0.5, w * 0.12))}" fill="none" opacity="${0.6 * (o.op ?? 1)}"/>`;
    // mist where it frays
    s += glowE(x + lean * len * 0.6, y + len * 0.8, w * 2.2, len * 0.25, col, 0.25 * (o.op ?? 1));
    return s;
  }

  // ------------------------------------------------------------------ chain (catenary)
  function chainC(a, b, sag, size, o = {}) {
    const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + sag * 4 * u * (1 - u)]); }
    if (size < 1.2) return line(pts, Math.max(0.6, size * 1.1), INK, o.op ?? 0.9) + line(pts, Math.max(0.3, size * 0.5), o.col || '#4a4450', (o.op ?? 0.9) * 0.8);
    return `<g opacity="${o.op ?? 1}">${B.chain(pts, size, o.col || '#3a3440')}</g>`;
  }

  // ------------------------------------------------------------------ the floating island of heaven
  // (cx, y): the centre of its top surface; w: width px. o.depth: underside depth (x w); o.col stone; o.k: air fade
  // (0 near, 1 lost in air); o.build: buildings [{type:'cathedral'|'tower'|'dome'|'hall'|'ruin', u (-0.5..0.5), s (scale)}];
  // o.falls: [[u, width]] waterfalls off the lip; o.fallLen; o.drops: hang the broken pieces of its underside in a line
  function island(cx, y, w, o = {}) {
    const k = o.k ?? 0.4, col0 = o.col || '#a89c8c', col = fade(col0, k), dkC = fade(mix(col0, '#120e16', 0.6), k), litC = fade(mix(col0, '#fff4e0', 0.35), k);
    const d = w * (o.depth ?? 0.55), th = w * 0.075, ink = Math.max(0.4, (o.ink ?? 1.2) * (1 - k * 0.7)), inkOp = 1 - k * 0.55;
    let s = '';
    // underside: an organic hanging mass: a sum of hanging lobes of different width and depth (never a hull)
    const nb = 3 + Math.floor(R() * 3), bumps = []; for (let i = 0; i < nb; i++) bumps.push([0.25 + R() * 0.5, 0.06 + R() * 0.12, (i === 0 ? 0.8 : 0.25 + R() * 0.4)]);
    const lean = bumps[0][0] - 0.5, U = [];
    for (let i = 0; i <= 32; i++) { const u = i / 32; let dd = (o.body ?? 0.45) * Math.pow(Math.sin(Math.PI * u), 0.9); for (const [c, wd, a] of bumps) dd += a * Math.exp(-Math.pow((u - c) / wd, 2)); dd = dd * Math.pow(Math.sin(Math.PI * u), 0.4); U.push([cx - w / 2 + w * u, y + th + d * dd * 0.8]); }
    const tipI = U.reduce((bi, p, i) => p[1] > U[bi][1] ? i : bi, 0), tipX = U[tipI][0], tipY = U[tipI][1];
    const under = [[cx - w / 2, y], ...U.slice(1, -1), [cx + w / 2, y]];
    s += `<path d="${smooth(under, true, 0.55)}" fill="${col}"/><path d="${smooth(under, true, 0.55)}" fill="url(#mottle)" opacity="${0.5 * inkOp}"/>`;
    const uc = id('iu'); s += `<clipPath id="${uc}"><path d="${smooth(under, true, 0.55)}"/></clipPath><g clip-path="url(#${uc})">`;
    // shading: shadow on the right/lower side, lit lip upper left; gradient darkening downward (form shading as bands)
    s += `<path d="${smooth(under.map(([a, b]) => [a + w * 0.16, b - d * 0.02]), true, 0.55)}" fill="${dkC}" opacity="0.7"/><path d="${smooth(under.map(([a, b]) => [a - w * 0.2, b - d * 0.15]), true, 0.55)}" fill="${litC}" opacity="0.35"/>`;
    s += `<rect x="${f1(cx - w)}" y="${f1(y)}" width="${f1(w * 2)}" height="${f1(d * 1.2)}" fill="${hatchA(30)}" opacity="${0.3 * inkOp}"/>` + `<path d="${smooth(under.map(([a, b]) => [a + w * 0.3, b + d * 0.05]), true, 0.55)}" fill="${hatchB(30)}" opacity="${0.3 * inkOp}"/>`;
    s += MV.rockSkin(under, Math.max(12, 60 * (1 - k)), col, { strata: false });
    // strata following the hanging form: smooth lines at fractions of the local depth, broken in places
    for (let j = 1; j < 8; j++) { const v = j / 8 + (R() - 0.5) * 0.05, pts = U.map(([x, yy]) => [x, y + th + (yy - y - th) * v + Math.sin(x * 0.07 + j) * d * 0.012]); const a0 = Math.floor(R() * 8), a1 = 32 - Math.floor(R() * 8); s += line(pts.slice(a0, a1), Math.max(0.4, ink * (0.4 + (1 - v) * 0.4)), INK, 0.4 * inkOp); }
    // vertical fissures down the lobes
    for (let j = 0; j < 6; j++) { const i = 3 + Math.floor(R() * 26), [x, yy] = U[i]; s += line([[x, y + th + 2], [x + (R() - 0.5) * w * 0.02, y + th + (yy - y - th) * 0.5], [x + (R() - 0.5) * w * 0.03, yy - 2]], Math.max(0.4, ink * 0.5), INK, 0.35 * inkOp); }
    // recesses: soft shaded hollows between the lobes (cel shadow, hatched), and the base lost in the storm's air
    for (let j = 1; j < bumps.length; j++) { const c = Math.min(bumps[0][0], bumps[j][0]) + Math.abs(bumps[0][0] - bumps[j][0]) / 2, x = cx - w / 2 + w * c; s += `<path d="${smooth(blob(x, y + th + d * 0.25, w * 0.025, d * 0.3, 9, 0.3), true, 0.5)}" fill="${dkC}" opacity="0.6"/>`; }
    s += `<rect x="${f1(cx - w)}" y="${f1(y + th)}" width="${f1(w * 2)}" height="${f1(d * 1.3)}" fill="${grad([[0, AIR, 0], [0.45, AIR, 0.1], [1, AIR, o.baseFade ?? 0.7]], 0, y + th, 0, y + th + d * 0.9)}"/>`;
    s += '</g>';
    s += `<path d="${smooth(under, true, 0.55)}" fill="none" stroke="${INK}" stroke-width="${f1(ink)}" opacity="${inkOp}"/>`;
    // the top (last touch-up: no more flat dish): a broken rim and real terrain. The ground line rises in hummocks and
    // crags of weathered rock; two or three bites are broken out of the rim, their fracture faces pale and fresh; the
    // rim's slab is thick and uneven, its strata following the ground; rubble and a broken wall stub sit on it.
    const NT = 44, hum = [], crag = [], bite = [];
    for (let i = 0; i < 3 + Math.floor(R() * 2); i++) hum.push([0.1 + R() * 0.8, 0.05 + R() * 0.1, th * (0.6 + R() * 0.9)]);
    for (let i = 0; i < 3 + Math.floor(R() * 2); i++) crag.push([0.08 + R() * 0.84, 0.012 + R() * 0.025, th * (1.0 + R() * 1.4)]);
    for (let i = 0; i < 2 + Math.floor(R() * 2); i++) bite.push([i === 0 ? 0.04 + R() * 0.1 : i === 1 ? 0.86 + R() * 0.1 : 0.3 + R() * 0.4, 0.025 + R() * 0.03, th * (0.5 + R() * 0.5)]);
    const gh = u => { let v = th * 0.25 * Math.pow(Math.sin(Math.PI * u), 0.6); for (const [c, wd, a] of hum) v += a * Math.exp(-Math.pow((u - c) / wd, 2)); for (const [c, wd, a] of crag) { const dd = Math.abs(u - c) / wd; if (dd < 1) v += a * (1 - dd) * (1 - dd * 0.3); } for (const [c, wd, a] of bite) { const dd = Math.abs(u - c) / wd; if (dd < 1) v -= a * (1 - dd * dd); } return v * Math.pow(Math.min(1, Math.sin(Math.PI * u) * 3), 0.7); };
    const topAt = u => y - gh(u);
    const top = []; for (let i = 0; i <= NT; i++) { const u = i / NT; top.push([cx - w / 2 + w * u, topAt(u) + (R() - 0.5) * th * 0.12]); }
    const lipB = []; for (let i = 20; i >= 0; i--) { const u = i / 20, x = cx - w / 2 + w * u; lipB.push([x, y + th * (0.9 + 0.5 * Math.sin(Math.PI * u)) + (R() - 0.3) * th * 0.7 + (R() < 0.2 ? th * 0.8 : 0)]); }
    // the slab's ends broken off in steps (fracture faces), not tapered like a plate's rim
    const endR = [[top[NT][0] + th * 0.15, top[NT][1] + th * 0.4], [top[NT][0] - th * 0.25, top[NT][1] + th * 0.75], [top[NT][0] + th * 0.05, top[NT][1] + th * 1.1]], endL = [[top[0][0] - th * 0.05, top[0][1] + th * 1.15], [top[0][0] + th * 0.3, top[0][1] + th * 0.7], [top[0][0] - th * 0.12, top[0][1] + th * 0.35]];
    const lip = [...top, ...endR, ...lipB.slice(1, -1), ...endL], lipD = p2(lip);
    s += `<path d="${lipD}" fill="${col}"/><path d="${lipD}" fill="url(#mottle)" opacity="0.5"/>`;
    const tc = id('it'); s += `<clipPath id="${tc}"><path d="${lipD}"/></clipPath><g clip-path="url(#${tc})">`;
    // light from the upper left: the ground's left slopes lit, right slopes and the crags' right faces in shadow
    for (let i = 0; i < NT; i++) { const A = top[i], Bq = top[i + 1], sl = (Bq[1] - A[1]) / (Bq[0] - A[0] || 1); if (sl < -0.15) s += fillP([A, Bq, [Bq[0], Bq[1] + th * 0.8], [A[0], A[1] + th * 0.8]], litC, 0.45); else if (sl > 0.15) s += fillP([A, Bq, [Bq[0], Bq[1] + th * 1.2], [A[0], A[1] + th * 1.2]], dkC, 0.5); }
    s += `<path d="${lipD}" fill="${hatchA(30)}" opacity="${0.25 * inkOp}"/>`;
    // strata following the ground, broken
    for (let j = 1; j < 4; j++) { const pts = top.map(([a2, b2], i) => [a2, b2 + (y + th * 0.8 - b2) * j / 4 + Math.sin(a2 * 0.09 + j) * th * 0.06]); const a0 = Math.floor(R() * 10), a1 = NT - Math.floor(R() * 10); s += line(pts.slice(a0, a1), Math.max(0.4, ink * 0.45), INK, 0.4 * inkOp); }
    // the bites: pale fresh fracture faces stepping down into the rim
    for (const [c, wd, a] of bite) { const x0 = cx - w / 2 + w * (c - wd), x1 = cx - w / 2 + w * (c + wd), yb = topAt(c); s += fillP([[x0, topAt(c - wd)], [x0 + (x1 - x0) * 0.3, yb], [x0 + (x1 - x0) * 0.62, yb + th * 0.15], [x1, topAt(c + wd)], [x1, topAt(c + wd) + th * 0.5], [x0, topAt(c - wd) + th * 0.5]], fade(mix(col0, '#fff4e8', 0.45), k), 0.55); }
    for (const e of [endR, endL]) s += fillP(e, fade(mix(col0, '#fff4e8', 0.35), k), 0.5);
    s += '</g>';
    // crag ink, the lit ground line, the outline
    s += pline(top.slice(0, Math.floor(NT * 0.65)), Math.max(0.5, ink * 1.1), fade('#fff0d0', k * 0.6), 0.55) + `<path d="${lipD}" fill="none" stroke="${INK}" stroke-width="${f1(ink * 0.8)}" opacity="${inkOp}"/>`;
    // rubble on the ground and a broken wall stub where no building stands
    for (let i = 0; i < 6; i++) { const u = 0.1 + R() * 0.8, gx = cx - w / 2 + w * u, gy = topAt(u), rr = Math.max(0.8, th * (0.12 + R() * 0.15)); s += `<path d="${smooth(blob(gx, gy - rr * 0.5, rr * 1.3, rr, 7, 0.4), true, 0.4)}" fill="${col}" stroke="${INK}" stroke-width="${f1(ink * 0.5)}" stroke-opacity="${inkOp}"/><path d="${smooth(blob(gx + rr * 0.4, gy - rr * 0.3, rr * 0.7, rr * 0.6, 6, 0.3), true, 0.4)}" fill="${dkC}" opacity="0.5"/>`; }
    { const used = (o.build || []).map(b2 => b2.u + 0.5); let u = 0.5; for (let t = 0; t < 8; t++) { const c = 0.12 + R() * 0.76; if (used.every(q => Math.abs(q - c) > 0.18)) { u = c; break; } }
      const gx = cx - w / 2 + w * u, gy = topAt(u), ww = w * 0.07, hh = th * 1.6, q = [[gx - ww / 2, gy + 1], [gx - ww / 2, gy - hh * 0.8], [gx - ww * 0.2, gy - hh], [gx, gy - hh * 0.7], [gx + ww * 0.25, gy - hh * 0.85], [gx + ww / 2, gy - hh * 0.4], [gx + ww / 2, gy + 1]];
      s += fillP(q, mix(col, litC, 0.2)) + fillP([[gx + ww * 0.15, gy + 1], [gx + ww * 0.25, gy - hh * 0.85], [gx + ww / 2, gy - hh * 0.4], [gx + ww / 2, gy + 1]], dkC, 0.6) + inkP(q, ink * 0.6, inkOp) + line([[gx - ww / 2, gy - hh * 0.35], [gx + ww / 2, gy - hh * 0.3]], Math.max(0.4, ink * 0.4), INK, 0.5 * inkOp); }
    // buildings on top, each set on the ground where it stands
    for (const b of o.build || []) s += building(cx + b.u * w, topAt(b.u + 0.5) + th * 0.1, w * (b.s || 0.3), b.type, k, Object.assign({ ink, inkOp }, b));
    // the pieces that fell from the underside: hung below it in a line, each smaller and further (deliberate sequence)
    if (o.drops) { let px = tipX, py = tipY, r = w * 0.06; for (let i = 0; i < o.drops; i++) { py += r * 2.2 + i * r * 0.4; px += lean * r * 1.5; r *= 0.72; const rk = blob(px, py, r, r * 1.3, 9, 0.35, 0.3); s += `<path d="${smooth(rk, true, 0.5)}" fill="${col}" stroke="${INK}" stroke-width="${f1(ink * 0.7)}" stroke-opacity="${inkOp}"/><path d="${smooth(rk.map(([a, b]) => [a + r * 0.3, b + r * 0.2]), true, 0.5)}" fill="${dkC}" opacity="0.5"/>`; } }
    // waterfalls pouring off the lip into the storm
    for (const [u, fw] of o.falls || []) { const x = cx + u * w, yl = y + th * 0.3; s += waterfall(x, yl, w * fw, o.fallLen || d * 2.2, { col: fade('#eef2f6', k * 0.6), op: 0.9 - k * 0.4, lean: (u < 0 ? -1 : 1) * 0.04 }); }
    return s;
  }
  // a building on an island (screen; base at (x,y), size sz = width px), faded by k. Gothic heaven: steep roofs,
  // buttresses with pinnacles, lancets, a rose, spires with gilt finials; ruined parts broken
  function building(x, y, sz, type, k, o = {}) {
    const c0 = o.col || '#b8ac98', st = fade(c0, k), sh = fade(mix(c0, '#141018', 0.55), k), rf = fade(mix(c0, '#3a3040', 0.45), k), gl = fade(GOLD, k * 0.75), ink = o.ink || 1, io = o.inkOp ?? 1;
    const win = fade(o.lightWin ? '#ffe2a0' : '#16101a', o.lightWin ? k * 0.3 : k * 0.7);
    let s = '';
    const wall = (x0, x1, y0, y1, side = 0.25) => { const q = [[x0, y1], [x0, y0], [x1, y0], [x1, y1]], m = x0 + (x1 - x0) * (1 - side); return fillP(q, st) + `<path d="${p2(q)}" fill="url(#mottle)" opacity="0.35"/>` + fillP([[m, y1], [m, y0], [x1, y0], [x1, y1]], sh, 0.75) + inkP(q, ink * 0.6, io); };
    const lancet = (cx, yb, w, h) => { const q = [[cx - w / 2, yb], [cx - w / 2, yb - h * 0.72], [cx - w * 0.3, yb - h * 0.92], [cx, yb - h], [cx + w * 0.3, yb - h * 0.92], [cx + w / 2, yb - h * 0.72], [cx + w / 2, yb]]; return fillP(q, win); };
    const pinn = (cx, yb, w, h) => { const q = [[cx - w / 2, yb], [cx - w / 2, yb - h * 0.45], [cx, yb - h], [cx + w / 2, yb - h * 0.45], [cx + w / 2, yb]]; return fillP(q, st) + fillP([[cx, yb - h], [cx + w / 2, yb - h * 0.45], [cx + w / 2, yb], [cx + w * 0.05, yb]], sh, 0.7) + inkP(q, ink * 0.5, io); };
    const spire = (cx, yb, w, h, broken) => { const tip = broken ? h * 0.65 : h, q = [[cx - w / 2, yb], [cx - w * 0.5 * (1 - tip / h), yb - tip], [cx + w * 0.5 * (1 - tip / h), yb - tip], [cx + w / 2, yb]];
      let t = fillP(q, rf) + fillP([[cx, yb], [cx, yb - tip], [q[2][0], q[2][1]], [cx + w / 2, yb]], sh, 0.6) + inkP(q, ink * 0.6, io);
      for (let i = 1; i < 6; i++) { const yy = yb - tip * i / 6, ww = w / 2 * (1 - (h - (yb - yy) > 0 ? (yb - yy) / h : 1)); t += pline([[cx - ww - w * 0.06, yy + 1], [cx - ww, yy]], ink * 0.5, rf, io) + pline([[cx + ww + w * 0.06, yy + 1], [cx + ww, yy]], ink * 0.5, rf, io); }
      if (!broken) t += pline([[cx, yb - h], [cx, yb - h - w * 0.45]], Math.max(0.6, w * 0.06), gl, io) + pline([[cx - w * 0.12, yb - h - w * 0.3], [cx + w * 0.12, yb - h - w * 0.3]], Math.max(0.5, w * 0.05), gl, io);
      return t; };
    const roof = (x0, x1, y0, hgt, broken) => { const q = broken ? [[x0, y0], [x0 + (x1 - x0) * 0.2, y0 - hgt], [x0 + (x1 - x0) * 0.55, y0 - hgt], [x0 + (x1 - x0) * 0.62, y0 - hgt * 0.4], [x0 + (x1 - x0) * 0.7, y0 - hgt * 0.75], [x1, y0]] : [[x0, y0], [x0 + (x1 - x0) * 0.04, y0 - hgt], [x1 - (x1 - x0) * 0.04, y0 - hgt], [x1, y0]]; return fillP(q, rf) + inkP(q, ink * 0.6, io) + pline([q[1], q[q.length - 2]], ink * 0.8, fade('#e8dcc8', k), 0.5 * io); };
    if (type === 'cathedral') {
      const nw = sz, nh = sz * 0.2, x0 = x - nw * 0.38, x1 = x + nw * 0.42;
      s += wall(x0, x1, y - nh, y, 0.2) + roof(x0, x1, y - nh, nh * 0.7, o.broken);
      const nb = 7; for (let i = 0; i < nb; i++) { const bx = x0 + (x1 - x0) * (i + 0.5) / nb; s += lancet(bx, y - nh * 0.22, nw * 0.035, nh * 0.58); if (i < nb - 1) { const px = x0 + (x1 - x0) * (i + 1) / nb; s += fillP([[px - nw * 0.012, y], [px - nw * 0.012, y - nh * 1.05], [px + nw * 0.012, y - nh * 1.05], [px + nw * 0.02, y]], sh) + pinn(px, y - nh * 1.05, nw * 0.022, nh * 0.45) + pline([[px, y - nh * 0.85], [px + nw * 0.03, y - nh * 1.15]], ink * 0.9, st, io); } }
      // apse at the east end, rounded
      { const ax = x1, pts = []; for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + Math.PI * i / 8; pts.push([ax + Math.cos(a) * nw * 0.06, y - nh * 0.5 + Math.sin(a) * nh * 0.5]); } s += `<path d="${smooth(pts, true, 0.5)}" fill="${sh}" stroke="${INK}" stroke-width="${f1(ink * 0.6)}" stroke-opacity="${io}"/>`; }
      // the crossing tower and its great spire
      const cxs = x + nw * 0.12; s += wall(cxs - nw * 0.06, cxs + nw * 0.06, y - nh * 1.9, y - nh * 0.9, 0.35) + lancet(cxs - nw * 0.02, y - nh * 1.2, nw * 0.02, nh * 0.5) + lancet(cxs + nw * 0.025, y - nh * 1.2, nw * 0.02, nh * 0.5);
      s += pinn(cxs - nw * 0.06, y - nh * 1.9, nw * 0.02, nh * 0.5) + pinn(cxs + nw * 0.06, y - nh * 1.9, nw * 0.02, nh * 0.5) + spire(cxs, y - nh * 1.9, nw * 0.1, nh * 2.6, o.brokenSpire);
      // the west front: two towers with pinnacles and short spires, a rose window between
      for (const [tx, hh] of [[x0 - nw * 0.04, 2.5], [x0 + nw * 0.1, 2.2]]) { s += wall(tx - nw * 0.055, tx + nw * 0.055, y - nh * hh, y, 0.35) + lancet(tx, y - nh * hh * 0.55, nw * 0.026, nh * 0.6) + lancet(tx, y - nh * 0.2, nw * 0.03, nh * 0.45); s += pinn(tx - nw * 0.05, y - nh * hh, nw * 0.018, nh * 0.4) + pinn(tx + nw * 0.05, y - nh * hh, nw * 0.018, nh * 0.4) + spire(tx, y - nh * hh, nw * 0.085, nh * 1.3); }
      s += `<circle cx="${f1(x0 + nw * 0.03)}" cy="${f1(y - nh * 1.15)}" r="${f1(nw * 0.03)}" fill="${win}" stroke="${INK}" stroke-width="${f1(ink * 0.5)}" stroke-opacity="${io}"/>`;
    } else if (type === 'tower') {
      const tw = sz * 0.3, th = sz * (o.h || 1.4);
      s += wall(x - tw / 2, x + tw / 2, y - th, y, 0.35) + lancet(x, y - th * 0.62, tw * 0.3, th * 0.2) + lancet(x, y - th * 0.3, tw * 0.25, th * 0.12);
      s += pinn(x - tw / 2, y - th, tw * 0.16, th * 0.18) + pinn(x + tw / 2, y - th, tw * 0.16, th * 0.18) + spire(x, y - th, tw * 0.8, th * 0.55, o.brokenSpire);
    } else if (type === 'dome') {
      const r = sz * 0.3; s += wall(x - r * 1.05, x + r * 1.05, y - sz * 0.3, y, 0.3); for (let i = 0; i < 6; i++) s += lancet(x - r * 0.85 + i * r * 0.34, y - sz * 0.06, r * 0.1, sz * 0.16);
      const yb = y - sz * 0.3, pts = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * i / 14; pts.push([x - Math.cos(a) * r, yb - Math.sin(a) * r * 1.05]); }
      s += `<path d="${smooth(pts, true, 0.5)}" fill="${gl}"/><path d="${smooth([...pts.slice(7), [x + r, yb], [x, yb]], true, 0.5)}" fill="${fade(GOLDD, k)}" opacity="0.8"/>`;
      for (let i = 1; i < 6; i++) { const u = i / 6, xx = x - r + 2 * r * u; s += `<path d="M${f1(xx)} ${f1(yb)} Q${f1(x + (xx - x) * 1.05)} ${f1(yb - r * 0.75)} ${f1(x)} ${f1(yb - r * 1.05)}" fill="none" stroke="${INK}" stroke-width="${f1(ink * 0.5)}" opacity="${0.7 * io}"/>`; }
      s += `<path d="${smooth(pts, true, 0.5)}" fill="none" stroke="${INK}" stroke-width="${f1(ink * 0.7)}" opacity="${io}"/>` + pinn(x, yb - r * 1.02, r * 0.18, r * 0.5);
    } else if (type === 'hall') {
      s += wall(x - sz / 2, x + sz / 2, y - sz * 0.2, y, 0.2) + roof(x - sz / 2, x + sz / 2, y - sz * 0.2, sz * 0.16, true);
      for (let i = 0; i < 6; i++) { const bx = x - sz * 0.42 + i * sz * 0.168; s += lancet(bx, y - sz * 0.04, sz * 0.05, sz * 0.12); s += fillP([[bx + sz * 0.075, y], [bx + sz * 0.075, y - sz * 0.22], [bx + sz * 0.095, y - sz * 0.22], [bx + sz * 0.1, y]], sh) + pinn(bx + sz * 0.085, y - sz * 0.22, sz * 0.02, sz * 0.08); }
    } else if (type === 'ruin') {
      // a broken arcade: clustered piers of different heights, two pointed arches still spanning, one fallen
      const n = 5, pw = sz * 0.05; const hs = [0.62, 0.66, 0.4, 0.58, 0.24]; for (let i = 0; i < n; i++) { const px = x - sz / 2 + i * sz / (n - 1), ph = sz * hs[i]; s += wall(px - pw / 2, px + pw / 2, y - ph, y, 0.4); const bj = B.jag([px - pw / 2, y - ph], [px + pw / 2, y - ph], 3, pw * 0.25); s += fillP([...bj, [px + pw / 2, y - ph + 2], [px - pw / 2, y - ph + 2]], sh); }
      for (const i of [0, 1]) { const xa = x - sz / 2 + i * sz / (n - 1) + pw / 2, xb = xa + sz / (n - 1) - pw, ys = y - sz * 0.42, pts = G.pointed(0, xb - xa, 0, 10, 0.9).map(([u, v]) => [xa + u, ys - v]); s += line(pts, Math.max(1.2, sz * 0.025), INK, io) + line(pts, Math.max(0.6, sz * 0.016), st); }
    }
    return s;
  }
  // ------------------------------------------------------------------ the broken halo
  // an elliptical ring (cx, cy, rx, ry) of width wd px, rot radians, made of gilt plates. gap: [a0, a1] (radians, screen
  // angles) where it broke; the pieces of that arc drift OUTWARD and ALONG in sequence: piece i is pushed out by
  // drift*(i+1) and turned a little more each, so the break reads as one deliberate motion. o.k air fade, o.dim
  function halo(cx, cy, rx, ry, wd, o = {}) {
    const n = o.n || 36, gap = o.gap || [-0.5, 0.1], rot = o.rot || 0, Z = o.Z || 40, dim = o.dim ?? 0.3;
    const pt = (a, r) => { const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; };
    const rIn = 1 - wd / Math.max(rx, ry);
    let s = '', back = '', drift = '';
    const inGap = a => { let t = ((a - gap[0]) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); return t < ((gap[1] - gap[0]) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); };
    let di = 0;
    for (let i = 0; i < n; i++) {
      const a0 = i / n * Math.PI * 2 + 0.01, a1 = (i + 1) / n * Math.PI * 2 - 0.01, am = (a0 + a1) / 2;
      let q = [pt(a0, 1), pt(a1, 1), pt(a1, rIn), pt(a0, rIn)];
      // the plate's light: lighter toward the upper left (screen angle of its outward normal)
      const nx = Math.cos(am), ny = Math.sin(am), lit = -(nx * 0.6 + ny * 0.8), dd = Math.min(0.85, dim + (o.backDim ?? 0) * (ny < 0 ? 0 : 0) + (0.35 - lit * 0.3) * (o.shadeK ?? 0.6));
      if (inGap(am)) {
        di++; const out = (o.drift || 14) * di, along = (o.along || 6) * di, turn = (o.turn || 0.04) * di, c = pt(am, (1 + rIn) / 2), tx = Math.cos(am) * out - Math.sin(am) * along, ty = Math.sin(am) * out * (ry / rx) + Math.cos(am) * along * (ry / rx);
        q = q.map(([x, y]) => { const dx = x - c[0], dy = y - c[1]; return [c[0] + dx * Math.cos(turn) - dy * Math.sin(turn) + tx, c[1] + dx * Math.sin(turn) + dy * Math.cos(turn) + ty]; });
        drift += giltW(chip(q, 0.6), Z, { dim: Math.min(0.85, dd + 0.05), cracks: 2, lost: 1, wear: 0.6, murk: o.murk });
        // the black break faces where it parted (clean)
        drift += fillP([q[0], q[3], [q[3][0] + 1.5, q[3][1] + 1.5], [q[0][0] + 1.5, q[0][1] + 1.5]], BLACK);
        continue;
      }
      const piece = giltW(q, Z, { dim: dd, cracks: 2, lost: R() < 0.3 ? 1 : 0, wear: o.wear ?? 0.7, murk: o.murk, sheen: 0.6 });
      if (Math.sin(am) < 0 && o.behind) back += piece; else s += piece;
    }
    // burns branching along the ring
    for (let i = 0; i < (o.burns ?? 2); i++) { const a = R() * Math.PI * 2; if (inGap(a)) continue; const p = pt(a, (1 + rIn) / 2); s += burnV(p[0], p[1], a + Math.PI / 2, Math.max(rx, ry) * 0.3, Math.max(0.8, wd * 0.06), { depth: 3 }); }
    return { svg: back + s + drift, back, front: s, drift };
  }

  // ------------------------------------------------------------------ silhouette cel shading
  // a smooth closed silhouette (screen pts) shaded as one cel: a shadow band along the edges away from the light (hatched),
  // the body colour, a lit rim along the edges toward the light. Built from offset copies inside the silhouette's clip.
  // Ld: unit vector toward the light (screen); ds: shadow band px; dl: lit rim px
  function celSil(pts, col, o = {}) {
    const d = smooth(pts, true, o.k ?? 0.5), Ld = o.Ld || [-0.6, -0.8], ds = o.ds ?? 6, dl = o.dl ?? 2, dk = o.dark || mix(col, '#140f18', 0.55), lt = o.lit || mix(col, '#fff8e8', 0.45), c1 = id('cs'), c2 = id('cs');
    DEFS.push(`<clipPath id="${c1}"><path d="${d}"/></clipPath><clipPath id="${c2}"><path d="${d}" transform="translate(${f1(Ld[0] * ds)} ${f1(Ld[1] * ds)})"/></clipPath>`);
    let s = `<g clip-path="url(#${c1})"><path d="${d}" fill="${dk}"/><path d="${d}" fill="${hatchA(o.Z || 30)}" opacity="${o.hatch ?? 0.45}"/>`;
    s += `<g clip-path="url(#${c2})"><path d="${d}" fill="${lt}"/><path d="${d}" fill="${col}" transform="translate(${f1(-Ld[0] * dl)} ${f1(-Ld[1] * dl)})"/><path d="${d}" fill="url(#mottle)" opacity="0.35"/></g>`;
    if (o.inner) s += o.inner;
    s += `</g><path d="${d}" fill="none" stroke="${INK}" stroke-width="${f1(o.ink ?? 1)}" opacity="${o.inkOp ?? 1}" stroke-linejoin="round"/>`;
    return s;
  }

  // ------------------------------------------------------------------ the kneeling colossus of the host
  // base at (x, y) on screen, height h px (plinth to wingtips), dir +1 faces right, -1 left. The knight's vigil, sculpted:
  // kneeling on the back knee, the front knee raised; a veiled head bowed over joined hands that rest on the pommel of a
  // great sword stood point-down before the knee; face in profile (brow, nose, closed eye with lashes, lips, jaw); wings
  // raised and folded behind with lesser and greater coverts and long primaries; a robe in deep folds with bell sleeves;
  // a cracked halo with one piece slipped. Weathered stone, gilt remnants. o.pose: 'bowed' | 'voidface' | 'headless';
  // o.wing: 'broken'; o.k: air fade; o.col: stone; o.con: contrast (0..1, lower pushes it back)
  function colossus(x, y, h, dir = 1, o = {}) {
    const k = o.k ?? 0.5, con = o.con ?? 1, c0 = o.col || '#b0a698', st = fade(c0, k), dk = fade(mix(c0, '#141018', 0.55 * con), k * 0.85), lt = fade(mix(c0, '#fffaf0', 0.45 * con), k * 0.7), ink = Math.max(0.5, (o.ink ?? 1.6) * (1 - k * 0.55)), io = (1 - k * 0.45) * (0.55 + 0.45 * con);
    const T = (u, v) => [x + u * h * dir, y - v * h], TT = pts => pts.map(p => T(...p));
    const Ld = [-0.6, -0.8], ds = h * 0.03, dl = h * 0.009, gl = fade(GOLD, k * 0.8), fdk = fade(mix(c0, '#0c0a10', 0.7 * con), k * 0.8);
    const sil = (pts, col, extra = {}) => celSil(TT(pts), col, Object.assign({ Ld, ds, dl, dark: dk, lit: lt, ink, inkOp: io, Z: 30, hatch: 0.35 * io, k: 0.6 }, extra));
    const crv = (pts, w, col, op = 1) => `<path d="${smooth(TT(pts), false, 0.5)}" fill="none" stroke="${col}" stroke-width="${f1(w)}" stroke-linecap="round" opacity="${f1(op)}"/>`;
    // a deep fold: a tapered shadow wedge along a curve, hatched, with a lit ridge beside it
    const fold = (pts, w) => { const L = [], Rr = [], n = pts.length; for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = w * Math.sin(Math.PI * (i + 0.5) / n); L.push([pts[i][0] - dy / l * ww, pts[i][1] + dx / l * ww]); Rr.push([pts[i][0] + dy / l * ww * 0.3, pts[i][1] - dx / l * ww * 0.3]); }
      const sh = TT([...L, ...Rr.reverse()]); return `<path d="${smooth(sh, true, 0.5)}" fill="${fdk}" opacity="${f1(0.75 * io)}"/><path d="${smooth(sh, true, 0.5)}" fill="${hatchA(30)}" opacity="${f1(0.4 * io)}"/>` + crv(pts.map(([u, v]) => [u + w * 0.6, v]), Math.max(0.5, h * 0.004), lt, 0.6 * io); };
    let s = '';
    // plinth
    const pl = TT([[-0.44, 0], [0.52, 0], [0.52, -0.08], [-0.44, -0.08]]);
    s += stone(pl, 30, st, { band: Math.max(1, h * 0.01), w: { op: 0.6 * io, col: st } }) + pline([T(-0.46, -0.002), T(0.54, -0.002)], Math.max(0.8, h * 0.006), gl, io);
    // ---- wings, raised and folded behind (far wing darker), with coverts and primaries
    const wing = (off, tipU, tipV, col, broken) => {
      const lead = [[0.03 + off, 0.56], [0.03 + off, 0.74], [-0.04 + off, 0.92], [tipU + 0.04, tipV - 0.04], [tipU, tipV]];
      const bz = t => { const a = [tipU, tipV], b = [-0.48 + off, 0.62], c = [-0.22 + off, 0.12], m = 1 - t; return [m * m * a[0] + 2 * m * t * b[0] + t * t * c[0], m * m * a[1] + 2 * m * t * b[1] + t * t * c[1]]; };
      const pts = lead.slice(), tips = []; const NF = 9;
      for (let i = 0; i < NF; i++) { const t0 = i / NF, t1 = (i + 1) / NF, p0 = bz(t0), p1 = bz(t1), dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, fl = 0.02 + 0.012 * Math.sin(Math.PI * t0);
        const lp = (u, k2) => [p0[0] + dx * u + nx * fl * k2, p0[1] + dy * u + ny * fl * k2]; pts.push(lp(0, 0.1), lp(0.3, 0.8), lp(0.6, 1.0), lp(0.9, 0.55)); tips.push(lp(0.6, 1.0)); }
      pts.push([-0.18 + off, 0.3], [-0.04 + off, 0.46]);
      const P2 = broken ? pts.map(([u, v]) => [u, Math.min(v, 0.86)]) : pts;
      let w = sil(P2, col, { k: 0.8 });
      const wc = id('wg'); w += `<clipPath id="${wc}"><path d="${smooth(TT(P2), true, 0.8)}"/></clipPath><g clip-path="url(#${wc})">`;
      // lesser coverts: small scallop rows along the leading edge; greater coverts: a row of larger scallops below them
      for (let r = 0; r < 3; r++) { const row = []; for (let i = 0; i <= 18; i++) { const t = i / 18, base = [0.02 + off - r * 0.05 + (tipU - off) * t * (0.75 - r * 0.12), 0.6 + (tipV - 0.62) * t * (0.92 - r * 0.15)]; row.push([base[0] - 0.012 * Math.abs(Math.sin(t * Math.PI * (7 - r))), base[1] - 0.018 * Math.abs(Math.sin(t * Math.PI * (7 - r)))]); }
        w += crv(row, Math.max(0.5, h * 0.0035), INK, 0.6 * io) + crv(row.map(([u, v]) => [u + 0.006, v - 0.006]), Math.max(0.4, h * 0.003), lt, 0.5 * io); }
      // primaries: long quills from the greater coverts to each tip of the trailing edge
      for (const tp of tips) { const root = [tp[0] + (0.02 + off - tp[0]) * 0.45, tp[1] + (0.62 - tp[1]) * 0.45]; w += crv([root, [(root[0] + tp[0]) / 2 + 0.01, (root[1] + tp[1]) / 2], tp], Math.max(0.5, h * 0.0035), INK, 0.55 * io); }
      w += '</g>' + crv(lead.slice(1), Math.max(0.7, h * 0.006), gl, 0.75 * io);
      if (broken) w += `<path d="${p2(TT([[-0.18 + off, 0.86], [-0.02 + off, 0.86], [-0.08 + off, 0.875]]))}" fill="${BLACK}"/>`;
      return w; };
    s += wing(-0.1, -0.3, 1.12, mix(st, dk, 0.35), false);
    s += wing(0.0, -0.16, 1.04, st, o.wing === 'broken');
    // ---- the robe: back foot, the kneeling shin along the plinth, back, shoulders; the raised front knee and shin
    const body = [[-0.42, 0], [-0.41, 0.05], [-0.3, 0.1], [-0.23, 0.17], [-0.21, 0.28], [-0.19, 0.4], [-0.15, 0.51], [-0.09, 0.59], [0.0, 0.625], [0.08, 0.6], [0.12, 0.52], [0.13, 0.41], [0.18, 0.335], [0.33, 0.315], [0.37, 0.27], [0.36, 0.15], [0.35, 0.05], [0.43, 0]];
    let inner = '';
    for (const f of [[[-0.12, 0.54], [-0.16, 0.38], [-0.24, 0.2], [-0.33, 0.06]], [[-0.03, 0.56], [-0.06, 0.4], [-0.08, 0.22], [-0.12, 0.04]], [[0.07, 0.5], [0.06, 0.38], [0.02, 0.2], [0.04, 0.03]], [[0.14, 0.33], [0.22, 0.305], [0.3, 0.29]], [[0.2, 0.31], [0.25, 0.22], [0.27, 0.1], [0.28, 0.02]], [[0.32, 0.28], [0.33, 0.16], [0.32, 0.04]]]) inner += fold(f, 0.016);
    inner += MV.stoneMarks(TT(body), 30, st, { wy0: 0.5 }) + weather(TT(body), { col: st, op: 0.5 * io, mv: true });
    s += sil(body, st, { inner });
    // ---- the arm (last touch-up: modelled, not tubes): the upper arm in its sleeve from the shoulder to a bent elbow, the
    // fabric bunched at the inside of the bend in compression folds; the forearm reaching forward to the hands, a bare
    // wrist tapering out of a wide bell sleeve whose cloth hangs below the forearm in deep pipe folds to a scalloped hem;
    // the cuff's opening shows its dark inside; the hem's edge carries a lit lip.
    const slv = mix(st, lt, 0.08), slvD = mix(st, dk, 0.2);
    // the forearm, bare at the wrist: drawn first so the sleeve covers its root
    s += sil([[0.185, 0.5], [0.205, 0.522], [0.228, 0.533], [0.247, 0.536], [0.252, 0.522], [0.244, 0.507], [0.226, 0.5], [0.204, 0.488]], mix(st, lt, 0.22), { ds: ds * 0.4, inner: crv([[0.205, 0.512], [0.228, 0.522], [0.245, 0.524]], Math.max(0.4, h * 0.0022), lt, 0.7 * io) + crv([[0.21, 0.497], [0.232, 0.503], [0.246, 0.51]], Math.max(0.4, h * 0.002), fdk, 0.5 * io) });
    // the upper arm in its sleeve: shoulder cap, a gentle swell over the biceps, the bend at the elbow
    s += sil([[-0.012, 0.605], [0.03, 0.612], [0.072, 0.588], [0.105, 0.545], [0.128, 0.495], [0.134, 0.455], [0.118, 0.428], [0.09, 0.425], [0.066, 0.45], [0.04, 0.5], [0.016, 0.545], [-0.008, 0.575]], slv, { inner:
      fold([[0.03, 0.6], [0.06, 0.55], [0.085, 0.49], [0.1, 0.44]], 0.012) + fold([[0.1, 0.53], [0.112, 0.5], [0.118, 0.465]], 0.008) +
      crv([[0.082, 0.47], [0.1, 0.455], [0.118, 0.462]], Math.max(0.5, h * 0.003), INK, 0.7 * io) + crv([[0.078, 0.488], [0.098, 0.474], [0.12, 0.48]], Math.max(0.5, h * 0.0028), INK, 0.6 * io) + crv([[0.083, 0.483], [0.1, 0.47], [0.118, 0.476]], Math.max(0.4, h * 0.0025), lt, 0.6 * io) +
      crv([[0.0, 0.6], [0.035, 0.6], [0.07, 0.575]], Math.max(0.5, h * 0.003), lt, 0.7 * io) });
    // the bell sleeve of the forearm: from the elbow along the forearm's top to the cuff, its cloth hanging in pipe folds
    const hem = [[0.214, 0.452], [0.2, 0.418], [0.188, 0.402], [0.175, 0.392], [0.16, 0.37], [0.146, 0.358], [0.131, 0.352], [0.116, 0.364], [0.1, 0.392], [0.088, 0.42]];
    const bell = [[0.09, 0.455], [0.115, 0.485], [0.15, 0.505], [0.19, 0.523], [0.208, 0.522], [0.22, 0.495], ...hem];
    const pipes = [[[0.122, 0.47], [0.12, 0.42], [0.118, 0.368]], [[0.138, 0.48], [0.142, 0.43], [0.146, 0.362]], [[0.158, 0.49], [0.165, 0.44], [0.17, 0.39]], [[0.178, 0.5], [0.188, 0.46], [0.196, 0.415]]];
    s += sil(bell, slv, { inner: (() => { let f = '';
      for (const pq of pipes) f += fold(pq, 0.011) + crv(pq.map(([u, v]) => [u + 0.009, v]), Math.max(0.5, h * 0.003), lt, 0.65 * io);
      // the cuff opening: the sleeve's dark inside seen at its mouth, the wrist going into it
      f += `<path d="${smooth(TT([[0.206, 0.52], [0.218, 0.497], [0.214, 0.462], [0.204, 0.44], [0.198, 0.47], [0.2, 0.5]]), true, 0.6)}" fill="${fdk}" opacity="${f1(0.9 * io)}"/>`;
      // the hem's shadowed underside and its lit lip
      f += crv(hem.map(([u, v]) => [u, v + 0.006]), Math.max(0.6, h * 0.007), fdk, 0.7 * io) + crv(hem.slice(0, 7).map(([u, v]) => [u - 0.002, v + 0.011]), Math.max(0.4, h * 0.0028), lt, 0.6 * io);
      return f; })() });
    // the scalloped hem: where each pipe fold ends, the cloth turns under in a small curl
    for (const [u, v] of [[0.118, 0.364], [0.146, 0.358], [0.17, 0.388], [0.196, 0.412]]) s += crv([[u - 0.01, v + 0.004], [u, v - 0.006], [u + 0.01, v + 0.004]], Math.max(0.5, h * 0.003), INK, 0.8 * io);
    // ---- the sword stood before the knee: blade, a gilt crossguard, the joined hands over the pommel
    const bx = 0.3;
    s += sil([[bx - 0.011, 0.0], [bx + 0.011, 0.0], [bx + 0.013, 0.48], [bx - 0.013, 0.48]], fade(mix('#d8d4cc', '#5a5460', 0.3), k), { ds: ds * 0.4 }) + crv([[bx, 0.02], [bx, 0.46]], Math.max(0.4, h * 0.002), INK, 0.5 * io);
    s += sil([[bx - 0.06, 0.48], [bx + 0.06, 0.48], [bx + 0.065, 0.497], [bx - 0.065, 0.497]], gl, { lit: fade(GOLDL, k), dark: fade(GOLDD, k), ds: ds * 0.3 });
    { const hd = mix(st, lt, 0.16); // joined hands over the pommel: the near hand's back, knuckles, four fingers curled down over the far hand, a thumb along the top
      s += sil([[0.242, 0.536], [0.262, 0.541], [0.285, 0.548], [0.298, 0.553], [0.31, 0.55], [0.322, 0.553], [0.333, 0.547], [0.341, 0.533], [0.343, 0.515], [0.337, 0.5], [0.322, 0.496], [0.3, 0.498], [0.276, 0.502], [0.256, 0.507], [0.244, 0.515]], hd, { ds: ds * 0.45, inner:
        [0.318, 0.327, 0.335].map((u, i) => crv([[u - 0.004, 0.547 - i * 0.002], [u + 0.002, 0.525], [u - 0.002, 0.502]], Math.max(0.4, h * 0.0024), INK, 0.65 * io)).join('') +
        crv([[0.258, 0.527], [0.282, 0.532], [0.304, 0.526]], Math.max(0.4, h * 0.0026), INK, 0.6 * io) + crv([[0.26, 0.531], [0.283, 0.537], [0.303, 0.531]], Math.max(0.4, h * 0.0022), lt, 0.6 * io) +
        crv([[0.27, 0.544], [0.29, 0.55], [0.31, 0.548], [0.33, 0.548]], Math.max(0.4, h * 0.0022), lt, 0.55 * io) +
        crv([[0.262, 0.509], [0.29, 0.503], [0.318, 0.5]], Math.max(0.4, h * 0.0025), fdk, 0.5 * io) }); }
    // ---- the head, bowed over the hands: a veil over crown and shoulders, the face in profile under it
    const hc = [0.15, 0.69], hr = 0.085, tilt = -0.55;            // head centre, head half-height, bow (radians, forward)
    const HT = ([a, b]) => { const c = Math.cos(tilt), sn = Math.sin(tilt); return [hc[0] + (a * c - b * sn) * hr, hc[1] + (a * sn + b * c) * hr]; };
    // the cracked halo behind the head, one piece slipped outward
    if (o.pose !== 'headless') { const hcs = T(hc[0] - 0.035, hc[1] + 0.04), R0 = h * 0.105; let ha = '';
      for (let i = 0; i < 9; i++) { if (i === 3) continue; const a0 = i / 9 * Math.PI * 2 + 0.05, a1 = a0 + Math.PI * 2 / 9 - 0.08, off = i === 4 ? h * 0.018 : 0, am = (a0 + a1) / 2; const arc = []; for (let j = 0; j <= 6; j++) { const a = a0 + (a1 - a0) * j / 6; arc.push([hcs[0] + Math.cos(a) * R0 + Math.cos(am) * off, hcs[1] + Math.sin(a) * R0 + Math.sin(am) * off]); }
        ha += `<path d="${smooth(arc, false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, h * 0.016))}" fill="none" opacity="${f1(io)}"/><path d="${smooth(arc, false, 0.5)}" stroke="${gl}" stroke-width="${f1(Math.max(0.7, h * 0.009))}" fill="none"/>`; }
      s = s.replace(/^/, '') + ha; }
    if (o.pose === 'headless') {
      // broken at the neck: a fresh fracture face; the head lies on the plinth before the knee, veiled, face down
      s += sil([[0.04, 0.6], [0.13, 0.6], [0.135, 0.625], [0.05, 0.635]], mix(st, lt, 0.25), { ds: ds * 0.3 }) + `<path d="${p2(TT([[0.05, 0.62], [0.08, 0.632], [0.1, 0.618], [0.125, 0.628]]))}" fill="none" stroke="${INK}" stroke-width="${f1(ink * 0.6)}"/>`;
      s += sil([[0.36, 0.0], [0.47, 0.0], [0.5, 0.04], [0.47, 0.09], [0.4, 0.1], [0.355, 0.05]], st, { inner: fold([[0.38, 0.08], [0.44, 0.05], [0.49, 0.03]], 0.012) });
    } else {
      const veil = [[0.42, 0.85], [-0.1, 1.3], [-0.9, 1.08], [-1.3, 0.2], [-1.4, -0.9], [-1.0, -1.7], [-0.1, -1.5], [0.15, -0.8], [0.22, 0.0], [0.3, 0.6]].map(HT);
      const face = [[0.4, 0.75], [0.62, 0.55], [0.72, 0.32], [0.68, 0.22], [0.85, -0.08], [0.72, -0.2], [0.74, -0.32], [0.66, -0.4], [0.7, -0.5], [0.6, -0.72], [0.35, -0.85], [0.1, -0.7], [0.2, -0.1], [0.25, 0.5]].map(HT);
      s += sil(veil, mix(st, dk, 0.1), { inner: fold([[0.0, 1.1], [-0.6, 0.6], [-0.9, -0.4], [-0.75, -1.3]].map(HT), 0.012) + fold([[0.2, 0.7], [0.1, -0.2], [0.15, -1.1]].map(HT), 0.01) });
      s += sil(face, mix(st, lt, 0.3), { ds: ds * 0.35, inner: (() => { let f = ''; // closed eye: lid curve with lashes; brow shadow; nostril; lips; jaw line
        f += crv([[0.42, 0.2], [0.5, 0.15], [0.58, 0.17]].map(HT), Math.max(0.6, h * 0.004), INK, 0.9 * io);
        for (let i = 0; i < 4; i++) { const p = HT([0.44 + i * 0.04, 0.17 - i * 0.003]); const q = HT([0.42 + i * 0.04, 0.07]); f += `<path d="M${f1(p[0])} ${f1(p[1])} L${f1(q[0])} ${f1(q[1])}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, h * 0.0022))}" opacity="${f1(0.8 * io)}"/>`; }
        f += `<path d="${smooth([[0.35, 0.34], [0.6, 0.38], [0.7, 0.3], [0.5, 0.24], [0.35, 0.26]].map(HT), true, 0.5)}" fill="${fdk}" opacity="${f1(0.5 * io)}"/>`;
        f += crv([[0.7, -0.12], [0.66, -0.15]].map(HT), Math.max(0.5, h * 0.003), INK, 0.8 * io) + crv([[0.71, -0.3], [0.62, -0.31], [0.56, -0.29]].map(HT), Math.max(0.5, h * 0.003), INK, 0.8 * io) + crv([[0.55, -0.7], [0.3, -0.62], [0.2, -0.3]].map(HT), Math.max(0.5, h * 0.0028), fdk, 0.6 * io);
        return f; })() });
      if (o.pose === 'voidface') { const fc = HT([0.5, -0.05]), fcs = T(...fc); s += tearS(fcs[0], fcs[1], h * hr * 1.5, h * hr * 1.9, { tears: 2, tearLen: 0.3, teeth: 2, slivers: 3, flecks: 6, mat: st, n: 30 }).svg; }
    }
    // a violet burn down the robe from the shoulder
    if (o.burn !== false && k < 0.75) { const b = T(-0.02, 0.56); s += burnV(b[0], b[1], Math.PI / 2 + 0.25 * dir, h * 0.3, Math.max(0.6, h * 0.004), { depth: 3, op: 0.8 * io, coreOp: 0.6 * io }); }
    return s;
  }
  // ------------------------------------------------------------------ an eye that looks in through a tear
  // painterly and unsettling: heavy wet lids with folds, lashes in ink, a veined, shaded sclera, a textured iris set a
  // little off-axis, a void-black pupil with no catch-light; the tear's ragged lips cross its ends. (x, y) centre, r half-
  // width. o: open, look [-1..1, -1..1], rot, skin (lid colour), lip (the tear's material, for the ragged lips), lips (n)
  function voidEye(x, y, r, o = {}) {
    const open = o.open ?? 0.36, rot = o.rot ?? 0, lk = o.look || [0.2, 0.35], skin = o.skin || '#3a3044', skD = mix(skin, '#060408', 0.6), skL = mix(skin, '#c8b8c8', 0.35);
    const T = (u, v) => [x + (u * Math.cos(rot) - v * Math.sin(rot)) * r, y + (u * Math.sin(rot) + v * Math.cos(rot)) * r];
    const up = [], lo = []; for (let k = 0; k <= 14; k++) { const u = -1 + k / 7; up.push(T(u, -open * Math.pow(1 - u * u, 0.8) * (1 + 0.15 * u) - 0.02)); lo.push(T(u, open * 0.72 * Math.pow(1 - u * u, 1.1) * (1 - 0.1 * u))); }
    const al = [...up, ...lo.slice().reverse()], dA = smooth(al, true, 0.4), cl = id('ve');
    let s = '';
    // the flesh round it: soft folds stacked above and below, shading into the dark
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.8)}" ry="${f1(r * 1.05)}" fill="${rgrad(x, y, r * 1.8, r * 1.05, [[0, skin, 0.95], [0.6, mix(skin, '#0c0a10', 0.4), 0.8], [1, '#050407', 0]])}"/>`;
    for (let i = 1; i <= 5; i++) { const lift = open + i * 0.13, f = []; for (let k = 0; k <= 12; k++) { const u = -1.15 - i * 0.06 + k / 12 * (2.3 + i * 0.12); f.push(T(u, -lift * Math.pow(Math.max(0, 1 - (u / (1.15 + i * 0.06)) ** 2), 0.7) - 0.04)); }
      s += `<path d="${smooth(f, false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, r * (0.03 - i * 0.004)))}" fill="none" opacity="${f1(0.8 - i * 0.12)}"/><path d="${smooth(f.map(([a, b]) => [a, b + r * 0.025]), false, 0.5)}" stroke="${skL}" stroke-width="${f1(Math.max(0.5, r * 0.012))}" fill="none" opacity="${f1(0.4 - i * 0.06)}"/>`; }
    for (let i = 1; i <= 3; i++) { const f = []; for (let k = 0; k <= 10; k++) { const u = -1 + k / 5; f.push(T(u * (1 - i * 0.05), open * 0.72 + i * 0.12 - (open * 0.1) * (u * u))); } s += `<path d="${smooth(f, false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, r * 0.018))}" fill="none" opacity="${f1(0.6 - i * 0.15)}"/>`; }
    // the sclera: wet, yellowed toward the corners, shaded under the upper lid; veins
    s += `<path d="${dA}" fill="${rgrad(x, y, r, r * open, [[0, '#d2c6ae', 1], [0.7, '#a89880', 1], [1, '#6a5a4a', 1]])}"/>`;
    s += `<clipPath id="${cl}"><path d="${dA}"/></clipPath><g clip-path="url(#${cl})">`;
    let vd = ''; for (let i = 0; i < 9; i++) { const side = i % 2 ? 1 : -1, p0 = T(side * (0.95 - (i % 3) * 0.05), (i % 3 - 1) * open * 0.3); let cx = p0[0], cy = p0[1]; const pts = [[cx, cy]]; let a = Math.atan2(y - cy, x - cx) + (R() - 0.5) * 0.8; for (let j = 0; j < 5; j++) { a += (R() - 0.5) * 0.9; cx += Math.cos(a) * r * 0.08; cy += Math.sin(a) * r * 0.05; pts.push([cx, cy]); } vd += smooth(pts, false, 0.5) + ' '; }
    s += `<path d="${vd}" stroke="#6e2c28" stroke-width="${f1(Math.max(0.4, r * 0.008))}" fill="none" opacity="0.55"/>`;
    // the iris: off-axis, its limbal ring dark, striations radiating, darker toward the rim
    const ic = T(lk[0] * 0.45, lk[1] * open * 0.5), ir = r * open * 1.05, irr = ir * 0.92;
    s += `<ellipse cx="${f1(ic[0])}" cy="${f1(ic[1])}" rx="${f1(ir)}" ry="${f1(irr)}" fill="${rgrad(ic[0], ic[1], ir, irr, [[0, o.iris2 || '#968c88', 1], [0.55, o.iris || '#4c4552', 1], [1, '#141016', 1]])}"/>`;
    let st = '', stL = ''; for (let i = 0; i < 46; i++) { const a = i / 46 * Math.PI * 2 + R() * 0.1, r0 = ir * (0.38 + R() * 0.1), r1 = ir * (0.75 + R() * 0.22), seg = `M${f1(ic[0] + Math.cos(a) * r0)} ${f1(ic[1] + Math.sin(a) * r0 * 0.92)} L${f1(ic[0] + Math.cos(a + 0.05) * r1)} ${f1(ic[1] + Math.sin(a + 0.05) * r1 * 0.92)} `; if (i % 3) st += seg; else stL += seg; }
    s += `<path d="${st}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, ir * 0.03))}" opacity="0.5"/><path d="${stL}" stroke="#bcb2a8" stroke-width="${f1(Math.max(0.4, ir * 0.025))}" opacity="0.3"/>`;
    s += `<ellipse cx="${f1(ic[0])}" cy="${f1(ic[1])}" rx="${f1(ir)}" ry="${f1(irr)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.8, ir * 0.08))}"/>`;
    // the pupil: void black, slightly oval and off-centre, clean-rimmed; no catch-light
    const pc = [ic[0] + ir * 0.06, ic[1] + ir * 0.03]; s += `<path d="${smooth(blob(pc[0], pc[1], ir * 0.4, ir * 0.46, 12, 0.06, 0.2), true, 0.6)}" fill="#020103"/>`;
    // the upper lid's shadow across the eye (hatched), and a wet line along the lower lid
    s += `<path d="${smooth([...up, ...up.slice().reverse().map(([a, b]) => [a, b + r * open * 0.55])], true, 0.4)}" fill="#1a1018" opacity="0.45"/><path d="${smooth([...up, ...up.slice().reverse().map(([a, b]) => [a, b + r * open * 0.45])], true, 0.4)}" fill="${hatchA(8)}" opacity="0.5"/>`;
    s += '</g>';
    s += `<path d="${smooth(lo.slice(2, 13).map(([a, b]) => [a, b - r * 0.015]), false, 0.4)}" stroke="#e8e0d0" stroke-width="${f1(Math.max(0.5, r * 0.012))}" fill="none" opacity="0.45"/>`;
    // the lid margins: thick, ink, with lashes
    s += `<path d="${smooth(up, false, 0.4)}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, r * 0.05))}" fill="none" stroke-linecap="round"/><path d="${smooth(lo, false, 0.4)}" stroke="${INK}" stroke-width="${f1(Math.max(0.8, r * 0.025))}" fill="none"/>`;
    let la = ''; for (let k = 1; k < 14; k++) { const p = up[k], u = -1 + k / 7, L = r * (0.07 + 0.06 * (1 - Math.abs(u))) * (0.8 + R() * 0.4), a = -Math.PI / 2 + u * 0.9 + rot; la += `M${f1(p[0])} ${f1(p[1])} Q${f1(p[0] + Math.cos(a) * L * 0.6)} ${f1(p[1] + Math.sin(a) * L * 0.4)} ${f1(p[0] + Math.cos(a + 0.4 * Math.sign(u || 1)) * L)} ${f1(p[1] + Math.sin(a) * L * 0.9 + L * 0.25)} `; }
    for (let k = 3; k < 12; k += 2) { const p = lo[k], L = r * 0.04; la += `M${f1(p[0])} ${f1(p[1])} l${f1((k - 7) * L * 0.1)} ${f1(L)} `; }
    s += `<path d="${la}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, r * 0.014))}" fill="none" stroke-linecap="round"/>`;
    // the tear's ragged lips crossing the eye's ends (the eye is behind the hole, partly hidden). Last touch-up: each lip
    // is torn MATERIAL: a flap of the sky's skin with a fibrous torn edge, its cut thickness showing as a pale band along
    // that edge, light catching the edge on the side toward the key, a soft shadow cast on the eye, loose fibres and one
    // corner curled back to show the flap's paler underside.
    const lipC = o.lip || '#2e2638', Ld = o.Ld || [-0.6, -0.8], cutF = mix(lipC, '#d0c4c8', 0.38), edgeL = mix(lipC, '#f4ece4', 0.7), lipD = mix(lipC, '#050407', 0.45);
    for (let i = 0; i < (o.lips ?? 2); i++) {
      const side = i % 2 ? 1 : -1, bx = side * (1.1 + R() * 0.25);
      // the torn edge: many small irregular steps (fibre-scale), not long zigzags
      const key = [[1.0, 0.8], [0.86 + R() * 0.06, 0.3], [0.98, 0.02], [0.82 + R() * 0.06, -0.3], [0.94, -0.62], [1.08, -1.0]], edge = [];
      for (let k = 0; k < key.length - 1; k++) { const [u0, v0] = key[k], [u1, v1] = key[k + 1]; for (let j = 0; j < 4; j++) { const t = j / 4, jj = (R() - 0.5) * 0.045; edge.push(T(bx * (u0 + (u1 - u0) * t + jj), v0 + (v1 - v0) * t + (R() - 0.5) * 0.03)); } }
      edge.push(T(bx * key[key.length - 1][0], key[key.length - 1][1]));
      const pts = [T(bx * 1.6, -1.2), T(bx * 1.6, 1.0), ...edge];
      // inward normal at an edge point (toward the eye's middle, screen)
      const nIn = (q) => { const dx = x - q[0], dy = y - q[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
      const th = Math.max(1.4, r * 0.05);                      // the material's cut thickness, px
      // shadow cast on the eye, away from the light, soft
      s += `<path d="${p2(pts.map(([a2, b2]) => [a2 - Ld[0] * th * 2.2, b2 - Ld[1] * th * 2.2]))}" fill="#050407" opacity="0.5" filter="${blurF(Math.max(1, th * 1.2))}"/>`;
      // the flap: dark skin, lighter toward the torn edge where it thins, hatched on its far side
      const gc = T(bx * 0.95, 0), gf = T(bx * 1.5, 0);
      s += fillP(pts, `${grad([[0, mix(lipC, '#8a7e8c', 0.12)], [0.3, lipC], [1, lipD]], gc[0], gc[1], gf[0], gf[1])}`) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.4"/>` + `<path d="${p2(pts)}" fill="${hatchA(20)}" opacity="0.25"/>`;
      // its cut thickness: a pale band just inside the torn edge, lit where the edge faces the light
      const band = edge.map(q => { const n = nIn(q); return [q[0] - n[0] * th, q[1] - n[1] * th]; });
      s += `<path d="${smooth([...edge, ...band.slice().reverse()], true, 0.2)}" fill="${cutF}"/>`;
      for (let k = 0; k < edge.length - 1; k++) { const A = edge[k], Bq = edge[k + 1], n = nIn(A), lit = -(n[0] * Ld[0] + n[1] * Ld[1]); if (lit < 0.1) continue;
        s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(Bq[0])} ${f1(Bq[1])}" stroke="${edgeL}" stroke-width="${f1(Math.max(0.6, th * 0.55))}" opacity="${f1(Math.min(0.9, 0.3 + lit * 0.7))}" stroke-linecap="round"/>`; }
      s += `<path d="${smooth(edge, false, 0.2)}" stroke="${INK}" stroke-width="${f1(Math.max(0.8, r * 0.018))}" fill="none"/>` + `<path d="${smooth(band, false, 0.2)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, r * 0.008))}" fill="none" opacity="0.6"/>`;
      // stress creases in the flap where it was pulled before it tore: short curves running back from the edge
      for (let k = 0; k < 7; k++) { const q = edge[1 + Math.floor(R() * (edge.length - 2))], n = nIn(q), L = r * (0.12 + R() * 0.16), a2 = Math.atan2(-n[1], -n[0]) + (R() - 0.5) * 0.6, e = [q[0] + Math.cos(a2) * L, q[1] + Math.sin(a2) * L], m2 = [(q[0] + e[0]) / 2 + (R() - 0.5) * L * 0.25, (q[1] + e[1]) / 2 + (R() - 0.5) * L * 0.25];
        s += `<path d="M${f1(q[0] - n[0] * th)} ${f1(q[1] - n[1] * th)} Q${f1(m2[0])} ${f1(m2[1])} ${f1(e[0])} ${f1(e[1])}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, r * 0.006))}" fill="none" opacity="0.55"/><path d="M${f1(q[0] - n[0] * th + 1)} ${f1(q[1] - n[1] * th - 1)} Q${f1(m2[0] + 1)} ${f1(m2[1] - 1)} ${f1(e[0] + 1)} ${f1(e[1] - 1)}" stroke="${cutF}" stroke-width="${f1(Math.max(0.35, r * 0.004))}" fill="none" opacity="0.35"/>`; }
      // loose fibres reaching out of the torn edge into the opening
      let fb = '', fl = ''; for (let k = 0; k < 9; k++) { const q = edge[1 + Math.floor(R() * (edge.length - 2))], n = nIn(q), L = r * (0.03 + R() * 0.06), a2 = Math.atan2(n[1], n[0]) + (R() - 0.5) * 0.9, e = [q[0] + Math.cos(a2) * L, q[1] + Math.sin(a2) * L]; const seg = `M${f1(q[0])} ${f1(q[1])} Q${f1((q[0] + e[0]) / 2 + (R() - 0.5) * L * 0.4)} ${f1((q[1] + e[1]) / 2 + L * 0.2)} ${f1(e[0])} ${f1(e[1])} `; fb += seg; if (R() < 0.5) fl += seg; }
      s += `<path d="${fb}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, r * 0.009))}" fill="none" stroke-linecap="round"/><path d="${fl}" stroke="${cutF}" stroke-width="${f1(Math.max(0.35, r * 0.004))}" fill="none" opacity="0.8"/>`;
      // one corner curled back: a small flap folded over, its paler underside up, a crease line, a shadow under it
      { const kq = 2 + Math.floor(R() * (edge.length - 6)), A = edge[kq], Bq = edge[kq + 3], m = [(A[0] + Bq[0]) / 2, (A[1] + Bq[1]) / 2], n = nIn(m), L = Math.hypot(Bq[0] - A[0], Bq[1] - A[1]);
        const tip = [m[0] - n[0] * L * 0.9 + (Bq[1] - A[1]) * 0.15, m[1] - n[1] * L * 0.9 - (Bq[0] - A[0]) * 0.15], curl = [A, [(A[0] + tip[0]) / 2 - n[0] * L * 0.1, (A[1] + tip[1]) / 2 - n[1] * L * 0.1], tip, [(Bq[0] + tip[0]) / 2, (Bq[1] + tip[1]) / 2], Bq];
        s += `<path d="${smooth(curl.map(([a2, b2]) => [a2 + th, b2 + th * 1.2]), true, 0.5)}" fill="#050407" opacity="0.35"/>` + `<path d="${smooth(curl, true, 0.5)}" fill="${mix(lipC, '#a89aa4', 0.4)}"/>` + `<path d="${smooth(curl, true, 0.5)}" fill="url(#mottle)" opacity="0.35"/>` + `<path d="${smooth(curl, true, 0.5)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.6, r * 0.012))}"/>` + `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(Bq[0])} ${f1(Bq[1])}" stroke="${edgeL}" stroke-width="${f1(Math.max(0.5, th * 0.4))}" opacity="0.7"/>`; }
    }
    return s;
  }

  // ------------------------------------------------------------------ the round column (3D)
  // at (X, Z), radius r m, from Y0 to Y1; o.col stone; o.flutes; o.cap (capital: 'gilt'|'stone'|false); o.base;
  // o.broken: Y of the break; o.lift: drums above the break lifted apart in sequence [n, gap m, turn]; o.fade k
  function column(X, Z, r, Y0, Y1, o = {}) {
    const k = o.k ?? 0, col = fade(o.col || '#a49a8c', k), lt = fade(mix(o.col || '#a49a8c', '#fff6e4', 0.35), k), dk = fade(mix(o.col || '#a49a8c', '#120e14', 0.62), k);
    const kz = K(Z), cx = P(X, 0, Z)[0], wpx = r * kz, ink = Math.max(0.5, inkW(Z) * 1.1), Yb = o.broken ?? Y1;
    let s = '';
    const drumH = o.drum || r * 1.6;
    const shaft = (ya, yb, dx = 0, turn = 0, isDrum = false) => {
      const a = P(X, ya, Z)[1], b = P(X, yb, Z)[1], ent = (u) => 1 - 0.06 * Math.pow(Math.abs(u - 0.33), 2);
      const yA = a, yB = b, x0 = cx + dx - wpx, x1 = cx + dx + wpx;
      // curvature of the drum ends: above the eye we see the underside (curve up); below, the top (curve down)
      const ec = (yy) => { const Y = 1.2 - (yy - 300) / kz; return Math.max(-0.18, Math.min(0.18, (Y - 1.2) / (Z * 2))) * wpx; };
      const ell = (yy, dir) => { const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12, ang = Math.PI * t; pts.push([cx + dx - Math.cos(ang) * wpx, yy + Math.sin(ang) * ec(yy) * dir]); } return pts; };
      const outline = [...ell(yB, 1).map(([x, y]) => [x, y]), ...ell(yA, 1).reverse()];
      const rot = turn ? ` transform="rotate(${f1(turn)} ${f1(cx + dx)} ${f1((yA + yB) / 2)})"` : '';
      let q = `<path d="${smooth(outline, true, 0.2)}" fill="${col}"/>`;
      const cid = id('co'); q += `<clipPath id="${cid}"><path d="${smooth(outline, true, 0.2)}"/></clipPath><g clip-path="url(#${cid})">`;
      // cylindrical cel bands: lit (left), mid, shade + hatch (right), crosshatched core shadow
      q += `<rect x="${f1(x0)}" y="${f1(Math.min(yA, yB) - 5)}" width="${f1(wpx * 0.55)}" height="${f1(Math.abs(yA - yB) + 10)}" fill="${lt}" opacity="0.55"/>`;
      q += `<rect x="${f1(cx + dx + wpx * 0.15)}" y="${f1(Math.min(yA, yB) - 5)}" width="${f1(wpx * 0.9)}" height="${f1(Math.abs(yA - yB) + 10)}" fill="${dk}" opacity="${f1(0.5 * (o.shadeK ?? 1))}"/>`;
      q += `<rect x="${f1(cx + dx + wpx * 0.15)}" y="${f1(Math.min(yA, yB) - 5)}" width="${f1(wpx * 0.9)}" height="${f1(Math.abs(yA - yB) + 10)}" fill="${hatchA(Z)}" opacity="0.5"/>`;
      q += `<rect x="${f1(cx + dx + wpx * 0.5)}" y="${f1(Math.min(yA, yB) - 5)}" width="${f1(wpx * 0.5)}" height="${f1(Math.abs(yA - yB) + 10)}" fill="${hatchB(Z)}" opacity="0.4"/>`;
      // reflected light at the far edge (thin)
      q += `<rect x="${f1(x1 - wpx * 0.1)}" y="${f1(Math.min(yA, yB) - 5)}" width="${f1(wpx * 0.06)}" height="${f1(Math.abs(yA - yB) + 10)}" fill="${lt}" opacity="0.15"/>`;
      // fluting: lines spaced by the cosine of the angle round the shaft
      const nf = o.flutes ?? 12; for (let i = 1; i < nf; i++) { const ang = Math.PI * i / nf, xx = cx + dx - Math.cos(ang) * wpx, shade = i / nf > 0.55;
        q += pline([[xx, yA], [xx, yB]], Math.max(0.4, wpx * 0.035 * Math.sin(ang) + 0.2), shade ? INK : mix(dk, col, 0.3), shade ? 0.55 : 0.45) + (i / nf < 0.5 ? pline([[xx + wpx * 0.04, yA], [xx + wpx * 0.04, yB]], Math.max(0.3, wpx * 0.02), lt, 0.5) : ''); }
      q += MV.stoneMarks(outline, Z, col, { wy0: ya }) + weather(outline, { col, op: 0.9, stainGap: 4, mv: true });
      q += '</g>';
      q += `<path d="${smooth(outline, true, 0.2)}" fill="none" stroke="${INK}" stroke-width="${f1(ink)}"/>`;
      // drum joints
      for (let yy = ya + drumH; yy < yb - drumH * 0.3; yy += drumH) { const py = P(X, yy, Z)[1]; q += line(ell(py, 1), Math.max(0.5, ink * 0.6), INK, 0.65); }
      return turn ? `<g${rot}>${q}</g>` : q;
    };
    // base: square plinth and torus
    if (o.base !== false) { const b0 = P(X - r * 1.35, Y0, Z), b1 = P(X + r * 1.35, Y0 + r * 0.6, Z); s += stone([[b0[0], b0[1]], [b1[0], b0[1]], [b1[0], b1[1]], [b0[0], b1[1]]], Z, col, { band: Math.max(1, wpx * 0.12) });
      const t0 = P(X - r * 1.15, Y0 + r * 0.6, Z), t1 = P(X + r * 1.15, Y0 + r * 1.0, Z); s += cel([[t0[0], t0[1]], [t1[0], t0[1]], [t1[0] - 2, t1[1]], [t0[0] + 2, t1[1]]], { Z, fill: col, band: Math.max(1, wpx * 0.1), tex: 'url(#mottle)' }); }
    s += shaft(Y0 + (o.base === false ? 0 : r), Yb);
    // the break: a jagged fracture top (broken stone may be angular), dark inside
    if (o.broken !== undefined) { const a = P(X - r, Yb, Z), b = P(X + r, Yb, Z), j = B.jag([a[0], a[1]], [b[0], b[1]], 7, wpx * 0.25); s += fillP([...j, [b[0], b[1] + 4], [a[0], a[1] + 4]], dk) + inkP(j, ink, 1);
      if (o.lift) { const [n, gap, turn] = o.lift; let y = Yb; for (let i = 0; i < n; i++) { y += gap * (i + 1); const dx = (o.liftDx || 0) * kz * (i + 1); s += shaft(y, y + drumH * (0.8 + R() * 0.3), dx, turn * (i + 1), true); y += drumH; } } }
    // capital: a bell with two rows of gilt acanthus, corner volutes, a moulded abacus with concave sides
    if (o.cap && o.broken === undefined) { const yb0 = P(X, Y1, Z)[1], hh = r * 2.2 * kz, wb = wpx * 1.05, wt = wpx * 1.6;
      const bell = [[cx - wb, yb0], [cx + wb, yb0], [cx + wt, yb0 - hh], [cx - wt, yb0 - hh]];
      s += stone(bell, Z, col, { chip: false, band: Math.max(1, wpx * 0.08) });
      for (let row = 0; row < 2; row++) { const yy = yb0 - hh * (0.05 + row * 0.38), lh = hh * 0.48, n = 5; for (let i = 0; i < n; i++) { const u = -1 + (i + 0.5) / n * 2, lx = cx + u * (wb + (wt - wb) * (row * 0.4 + 0.2)) * 0.95, lw = wb * 0.36;
          const leaf = [[lx - lw, yy], [lx - lw * 0.8, yy - lh * 0.6], [lx - lw * 0.3, yy - lh * 0.95], [lx + lw * 0.2, yy - lh * 1.05], [lx + lw * 0.45, yy - lh * 0.8], [lx + lw * 0.2, yy - lh * 0.7], [lx + lw * 0.8, yy - lh * 0.4], [lx + lw, yy]];
          s += celSil(leaf, mix(GOLD, col, o.cap === 'gilt' ? 0.15 + k * 0.6 : 0.7), { Ld: [-0.6, -0.8], ds: Math.max(1, lw * 0.25), dl: Math.max(0.5, lw * 0.08), dark: fade(GOLDD, k), lit: fade(GOLDL, k), ink: Math.max(0.5, ink * 0.6), k: 0.6 }) + `<path d="M${f1(lx)} ${f1(yy)} Q${f1(lx + lw * 0.1)} ${f1(yy - lh * 0.5)} ${f1(lx + lw * 0.15)} ${f1(yy - lh * 0.95)}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, ink * 0.4))}" fill="none" opacity="0.6"/>`; } }
      for (const sx of [-1, 1]) { const vc = [cx + sx * wt * 0.92, yb0 - hh * 0.88], vr = hh * 0.16, sp = []; for (let i = 0; i <= 18; i++) { const a = i / 18 * Math.PI * 3.2 * sx + (sx < 0 ? Math.PI : 0), rr = vr * (1 - i / 22); sp.push([vc[0] + Math.cos(a) * rr, vc[1] + Math.sin(a) * rr]); } s += `<circle cx="${f1(vc[0])}" cy="${f1(vc[1])}" r="${f1(vr * 1.05)}" fill="${fade(GOLD, k)}" stroke="${INK}" stroke-width="${f1(ink * 0.6)}"/>` + `<path d="${smooth(sp, false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, ink * 0.5))}" fill="none"/>`; }
      const ay = yb0 - hh, ab = [[cx - wt * 1.12, ay], [cx + wt * 1.12, ay], [cx + wt * 1.2, ay - hh * 0.22], [cx - wt * 1.2, ay - hh * 0.22]];
      s += stone(ab, Z, mix(col, '#fff', 0.08), { chip: 0.3, band: Math.max(1, wpx * 0.1) }) + pline([[ab[0][0], ay - 1.5], [ab[1][0], ay - 1.5]], Math.max(0.8, ink * 0.8), fade(GOLD, k), 0.9); }
    // a violet burn down the shaft
    if (o.burn) { const p0 = P(X - r * 0.2, Math.min(Yb, Y1) * 0.85, Z), c = id('cb'); s += burnV(p0[0], p0[1], Math.PI / 2 + 0.1, (P(X, 0, Z)[1] - p0[1]) * 0.6, Math.max(0.8, wpx * 0.05), { depth: 4 }); }
    return s;
  }

  // ------------------------------------------------------------------ deliberate drift
  // pieces: [{poly, Z, draw(poly)}] broken from a structure; each moved by step*(i+1) along dir with a turn of rot*(i+1)
  // about its own centre: a sequence, never scatter
  function driftSeq(polys, dir, step, rot, draw) {
    let s = ''; polys.forEach((poly, i) => { const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]), m = step * (i + 1), t = rot * (i + 1);
      const q = poly.map(([x, y]) => { const dx = x - c[0], dy = y - c[1]; return [c[0] + dx * Math.cos(t) - dy * Math.sin(t) + dir[0] * m, c[1] + dx * Math.sin(t) + dy * Math.cos(t) + dir[1] * m]; }); s += draw(q, i); });
    return s;
  }

  const X = { voidEye, celSil, fade, burnV, VIO, grad, gradB, rgrad, blurF, glowE, sky, softCloud, stormWall, cloudSea, shaftG, weather, stone, giltW, tearS, rain, waterfall, chainC, island, building, halo, colossus, column, driftSeq };
  return { S, B, G, X };
}
module.exports = { make };
