// Battle-room kit for worlds XIII-XV, round 2 (group g5). New file; lik.js, battle_kit_b.js and battle_li.js are required,
// not edited. G5.make(seed, murk, shadowTint) builds a lik.js scene on the shared battle camera and wraps it with
// battle_kit_b, then adds:
//   air(col, Z)            atmospheric recession toward the room's AIR colour (farther = lower contrast)
//   blackFlame             XIII: black flame as broad licking tongues with S-curves, curled tips that break off into
//                          detached licks, a violet rim and dark-violet inner ink; it gives no light (no glow)
//   cloud                  storm / spore cloud masses built from lobes of uneven size, ledges, a shadowed underside
//   shaft                  a light shaft as three nested translucent steps (never a gradient)
//   tree                   a gnarled, kinked tree: flared root foot, bent trunk, limbs of uneven count, length and angle,
//                          broken stubs (never Y-forks)
//   bigCap                 a large mushroom seen from below eye height: leaning stem, bulb, torn veil ring, an
//                          asymmetric cap with a torn, drooping margin and the gills seen from under
//   rose, foliage          XIV blooms and leaf texture (as round 1)
//   gilt, drum             XV gold leaf over black, modelled lighter toward the upper-left light, crazed, flakes lost
//   pointed                pointed-arch outline in a plane (s,t)
//   write                  writes <room>_{far,mid,fore}.svg and <room>.camera.json (the nave's battle camera)
'use strict';
const fs = require('fs');
const path = require('path');

function make(seed, murk, sht, air) {
  const W = 1480, H = 480;
  const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
    gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: sht || '#1e1a22' });
  const B = require('./battle_kit_b')(S, { murk });
  const { P, K, p2, f1, INK, cel, chip, mix, R, smooth, inkW, EM, hatchA } = S;
  const { line, pline, fillP, fillS, inkP, inkS, blob } = B;
  const AIR = air || murk;
  const air_ = (col, Z, k = 1, z0 = 7, span = 40) => mix(col, AIR, Math.max(0, Math.min(0.85, (Z - z0) / span)) * k);

  // ------------------------------------------------------------------ black flame (XIII)
  function blackFlame(x, y, w, h, o = {}) {
    const VIO = o.vio || '#a678e8', VIOD = o.viod || '#4a2e6a', BF = o.bf || '#08060a';
    const n = o.n || Math.max(1, Math.round(w / Math.max(5, h * 0.32)));
    const list = [];
    for (let i = 0; i < n; i++) { const u = n === 1 ? 0 : i / (n - 1) - 0.5, env = 1 - Math.abs(u) * 0.6; list.push({ cx: x + u * w * 0.85 + (R() - 0.5) * w * 0.08, hh: h * Math.max(0.35, env) * (0.62 + R() * 0.38), bw: w / n * (1.1 + R() * 0.35) * (o.fat || 1), ph: R() * 6, ph2: R() * 6, lean: (o.lean ?? 0) + (R() - 0.5) * 0.5 }); }
    list.sort((a, b) => b.hh - a.hh);
    let s = '';
    // the bed: a low dark mass the tongues rise from
    s += fillS(blob(x, y - h * 0.06, w * 0.55, h * 0.1, 12, 0.3), BF);
    for (const t of list) {
      const L = [], Rr = [], N = 12;
      for (let k = 0; k <= N; k++) {
        const u = k / N, xc = t.cx + t.lean * t.hh * Math.pow(u, 1.4) * 0.6 + Math.sin(u * Math.PI * 2.2 + t.ph) * t.bw * 0.38 * u;
        const prof = u < 0.22 ? 0.8 + u * 0.9 : Math.pow((1 - u) / 0.78, 1.25), wd = t.bw * 0.5 * prof * (1 + 0.22 * Math.sin(u * 13 + t.ph2));
        L.push([xc - wd, y - t.hh * u]); Rr.push([xc + wd, y - t.hh * u]);
      }
      const tip = L[N], dir = Math.sin(t.ph) > 0 ? 1 : -1, hook = [tip[0] + dir * t.bw * 0.22, tip[1] + t.hh * 0.05];
      const poly = [...L.slice(0, N), [tip[0], tip[1]], hook, ...Rr.slice(0, N).reverse()];
      const rw = Math.max(0.5, Math.min(1.4, t.bw * 0.03));
      s += `<path d="${smooth(poly, true, 0.55)}" fill="${BF}"/>`;
      s += `<path d="${smooth([...L.slice(2, N), tip, hook], false, 0.55)}" fill="none" stroke="${VIO}" stroke-width="${f1(rw)}" opacity="${o.rimOp ?? 0.85}"/><path d="${smooth(Rr.slice(3, N), false, 0.55)}" fill="none" stroke="${VIO}" stroke-width="${f1(rw * 0.7)}" opacity="${(o.rimOp ?? 0.85) * 0.7}"/>`;
      // inner dark-violet licks following the tongue
      const mid = L.map((p, k) => [(p[0] + Rr[k][0]) / 2 + (R() - 0.5) * t.bw * 0.1, p[1]]).slice(1, N - 1);
      s += line(mid, Math.max(0.5, t.bw * 0.05), VIOD, 0.9);
      // detached licks breaking off above the tip
      if (t.hh > h * 0.5 && R() < (o.lick ?? 0.75)) { const lx = hook[0] + (R() - 0.5) * t.bw * 0.3, ly = tip[1] - t.hh * (0.1 + R() * 0.15), lw = t.bw * (0.12 + R() * 0.12), lh = t.hh * (0.12 + R() * 0.1);
        const lk = [[lx, ly + lh * 0.5], [lx - lw, ly], [lx - lw * 0.2, ly - lh * 0.5], [lx + lw * 0.6 * dir, ly - lh * 0.6], [lx + lw * 0.5, ly + lh * 0.1]];
        s += `<path d="${smooth(lk, true, 0.5)}" fill="${BF}" stroke="${VIO}" stroke-width="${f1(Math.max(0.4, lw * 0.12))}"/>`; }
    }
    return EM(s);
  }

  // ------------------------------------------------------------------ clouds
  function cloud(cx, cy, w, h, col, o = {}) {
    // the top is the envelope of a stack of overlapping round masses of very different sizes (a cumulus is built, not
    // scalloped); the underside a soft flat base; the masses lower in the stack show as inner ledges
    const env = u => Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, u)))), o.flat ?? 0.6);
    const cs = []; const n = o.n || Math.max(4, Math.round(w / h * 1.3));
    for (let i = 0; i < n; i++) { const u = 0.06 + R() * 0.88, r = h * (0.22 + R() * 0.5) * (o.lobe || 1) * (0.5 + env(u) * 0.7); cs.push([cx - w / 2 + w * u, cy - h * 0.55 * env(u) + r * (0.35 + R() * 0.3), r]); }
    cs.sort((a, b) => b[2] - a[2]);
    const N = 48, top = [];
    for (let k = 0; k <= N; k++) { const x = cx - w / 2 + w * k / N; let y = cy - h * 0.08 * env(k / N); for (const [qx, qy, r] of cs) { const d = x - qx; if (Math.abs(d) < r) y = Math.min(y, qy - Math.sqrt(r * r - d * d)); } top.push([x, y]); }
    const under = []; for (let k = 12; k >= 0; k--) { const t = k / 12; under.push([cx - w / 2 + w * t, cy + h * 0.1 * Math.sin(t * Math.PI * 2 + (o.ph ?? R() * 3)) * env(t) + h * 0.04 * (R() - 0.5)]); }
    const poly = [...top, ...under];
    const cid = S.id('cl'), lit = mix(col, o.lit || '#efe8f4', o.litK ?? 0.22), dk = mix(col, o.dark || '#08060c', o.darkK ?? 0.45);
    let s = fillP(poly, col) + `<path d="${p2(poly)}" fill="url(#mottle)" opacity="0.3"/>`;
    s += `<clipPath id="${cid}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${cid})">`;
    for (const [qx, qy, r] of cs) { s += fillS(blob(qx - r * 0.18, qy - r * 0.2, r * 0.8, r * 0.72, 12, 0.18), lit, 0.55); const arc = []; for (let k = 0; k <= 8; k++) { const a = Math.PI * (0.15 + k / 8 * 0.75); arc.push([qx + Math.cos(a) * r * 0.98, qy + Math.sin(a) * r * 0.98]); } s += line(arc, Math.max(0.6, r * 0.04), dk, 0.45); }
    const band = [...under, ...under.slice().reverse().map(([a, b]) => [a, b - h * (0.2 + R() * 0.08)])];
    s += fillS(band, dk, 0.85, 0.4) + `<path d="${smooth(band, true, 0.4)}" fill="${hatchA(30)}" opacity="0.45"/></g>`;
    s += `<path d="${p2(poly)}" fill="none" stroke="${INK}" stroke-width="${f1(o.ink ?? 1.2)}" opacity="${o.inkOp ?? 0.85}" stroke-linejoin="round"/>`;
    return s;
  }
  // a smoke column: one continuous body widening and bending downwind, its edges rolling, breaking up at the top
  function smoke(x, y, h, w, o = {}) {
    const n = 14, lean = o.lean ?? 0.55, L = [], Rr = [], ph = R() * 6;
    for (let i = 0; i <= n; i++) { const u = i / n, c = x + lean * h * u * u * 1.8 + Math.sin(u * 3 + ph) * w * 0.15 * u, yy = y - h * Math.sin(u * Math.PI / 2), ww = w * (0.45 + u * 1.3) * (1 + 0.15 * Math.sin(u * 11 + ph)); L.push([c - ww / 2 - Math.abs(Math.sin(i * 1.7)) * ww * 0.12, yy]); Rr.push([c + ww / 2 + Math.abs(Math.sin(i * 2.3 + 1)) * ww * 0.12, yy]); }
    const col = o.col || '#0c0a0e', air = o.air || '#6a6060', poly = [...L, ...Rr.slice().reverse()];
    let s = fillS(poly, col, 0.88, 0.45);
    for (let i = 3; i <= n; i += 2) { const u = i / n; s += fillS([L[i], Rr[i], Rr[Math.min(n, i + 2)], L[Math.min(n, i + 2)]], air, u * 0.35, 0.45); }
    for (let i = 2; i < n; i += 3) s += line([L[i], [(L[i][0] + Rr[i][0]) / 2, L[i][1] + w * 0.25], Rr[i]], 0.8, o.rim || '#4a2e6a', 0.5);
    for (let k = 0; k < 3; k++) { const t = Rr[n], r = w * (0.6 + R()); s += fillS(blob(t[0] + (R() - 0.2) * w * 2, t[1] - r * (0.5 + k), r * 1.3, r * 0.5, 10, 0.4), mix(col, air, 0.5), 0.4 - k * 0.1); }
    return s + `<path d="${smooth(poly, true, 0.45)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.45"/>`;
  }

  // ------------------------------------------------------------------ light shaft (stepped, not a gradient)
  function shaft(poly, col, op = 0.08, steps = 3) {
    const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]);
    let s = ''; for (let i = 0; i < steps; i++) { const k = 1 - i * 0.22; s += fillP(poly.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * (1 - i * 0.05)]), col, op); }
    return s;
  }

  // ------------------------------------------------------------------ trees (gnarled, never Y-forks)
  // a smooth tapering tube along pts (screen) from width w0 to w1: [outline path d, L, R]
  function tube(pts, w0, w1) {
    const n = pts.length, L = [], Rr = [];
    for (let j = 0; j < n; j++) { const a = pts[Math.max(0, j - 1)], b = pts[Math.min(n - 1, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, u = j / (n - 1), ww = Math.max(0.3, (w0 + (w1 - w0) * Math.pow(u, 0.8)) / 2);
      L.push([pts[j][0] + nx * ww, pts[j][1] + ny * ww]); Rr.push([pts[j][0] - nx * ww, pts[j][1] - ny * ww]); }
    return [smooth([...L, pts[n - 1], ...Rr.slice().reverse()], true, 0.5), L, Rr];
  }
  // an organic tree: a smoothly bending trunk with a root flare into the ground, limbs that curve and taper as tubes,
  // children branching off at moderate angles and thinning, a few broken stubs; never polyline kinks
  // materials v2: the tree's own skeleton (trunk and limb polylines, as before) is drawn by the shared organic renderer
  // (scenes/materials_v2.js renderTree: every axis Catmull-Rom smoothed into a tapered tube, shading toward the key light,
  // bark following the form, root flare into a ground lip). The skeleton, the return value { limbs, trunk, tw, wAt } and the
  // room's random stream are exactly as before, so decorations hung on limbs and everything placed after stay put.
  // o.kind picks the bark and extras (default dead); o.col passes through.
  function tree(x, y, h, Z, o = {}) {
    const v = treeV1(x, y, h, Z, o), MV = require('./materials_v2')(S), n = v.trunk.length - 1;
    const t = MV.renderTree({ trunk: v.trunk, trunkW: [v.wAt(0) * 1.15, v.wAt(n)], limbs: v.limbs.map(([pts, w]) => [pts, w, w * 0.4]) }, Z,
      { kind: o.kind || 'dead', col: o.col || '#5a5258', hollow: o.hollow ? 1 : 0, seed: Math.round(x * 31 + y * 17 + h * 7) });
    return Object.assign({}, v, { svg: t.svg });
  }
  function treeV1(x, y, h, Z, o = {}) {
    const col = o.col || '#5a5258', dk = mix(col, INK, 0.5), tw = o.tw || h * 0.07;
    const nT = 10, ph = R() * 6, lean = o.lean || 0, cl = [];
    for (let i = 0; i <= nT; i++) { const u = i / nT; cl.push([x + Math.sin(u * 2.2 + ph) * tw * 0.45 * u + lean * h * u, y - h * 0.62 * u]); }
    const wAt = i => tw * (1 - i / nT * 0.38) * (i === 0 ? 1.25 : 1);
    const tubes = [];
    const limb = (x0, y0, a, l, w, d) => {
      const n = 7, pts = [[x0, y0]]; let px = x0, py = y0, aa = a; const bend = (R() - 0.5) * 0.12 + (a < -Math.PI / 2 ? 0.05 : -0.05) * (o.droop ? -1 : 1);
      for (let i = 0; i < n; i++) { aa += bend + (R() - 0.5) * 0.14; px += Math.cos(aa) * l / n; py += Math.sin(aa) * l / n; pts.push([px, py]); }
      const wEnd = Math.max(0.6, w * 0.3); tubes.push([pts, w, wEnd]);
      if (d <= 0) return;
      const kids = R() < 0.25 ? 1 : R() < 0.7 ? 2 : 3;
      for (let k = 0; k < kids; k++) { const at = 2 + Math.floor(R() * (n - 2)), side = (k % 2 ? 1 : -1) * (R() < 0.8 ? 1 : -1), wk = (w + (wEnd - w) * at / n) * (0.5 + R() * 0.2);
        if (R() < (o.broken ?? 0.12)) { const q = pts[at], e = [q[0] + Math.cos(aa + side * 0.6) * l * 0.12, q[1] + Math.sin(aa + side * 0.6) * l * 0.12]; tubes.push([[q, [(q[0] + e[0]) / 2, (q[1] + e[1]) / 2], e], wk, wk * 0.8]); continue; }
        limb(pts[at][0], pts[at][1], aa + side * (0.35 + R() * 0.55), l * (0.4 + R() * 0.35), wk, d - 1); }
    };
    const top = cl[nT], nl = o.limbs || 2 + Math.floor(R() * 3);
    for (let k = 0; k < nl; k++) { const i = Math.min(nT, 5 + Math.floor(R() * 6)), base = cl[i], a = -Math.PI / 2 + (k % 2 ? 1 : -1) * (0.45 + R() * 0.6); limb(base[0], base[1], a, h * (0.25 + R() * 0.25), wAt(i) * (0.4 + R() * 0.15), o.depth ?? 3); }
    limb(top[0], top[1], -Math.PI / 2 + (R() - 0.5) * 0.5, h * 0.3, wAt(nT) * 0.75, o.depth ?? 3);
    const ik = Math.max(1, inkW(Z) * 1.4); let inks = '', fills = '';
    for (const [pts, w0, w1] of tubes) { const [d, L, Rr] = tube(pts, w0, w1); inks += `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="${f1(ik)}" stroke-linejoin="round"/>`; fills += `<path d="${d}" fill="${col}"/>`;
      if (w0 > 2.5) { // the shade side (away from the upper-left key): a cel band of darker tone and hatch along the tube, a lit edge opposite
        const j = Math.floor(pts.length / 2), nx = L[j][0] - pts[j][0], ny = L[j][1] - pts[j][1], shadeL = nx * 0.6 + ny * 0.8 > 0, Sd = shadeL ? L : Rr, Lt = shadeL ? Rr : L;
        const band = [...Sd, ...pts.map((p, i) => [p[0] + (Sd[i][0] - p[0]) * 0.15, p[1] + (Sd[i][1] - p[1]) * 0.15]).reverse()];
        fills += `<path d="${smooth(band, true, 0.5)}" fill="${dk}" opacity="0.55"/><path d="${smooth(band, true, 0.5)}" fill="${hatchA(Z)}" opacity="0.5"/><path d="${smooth(Lt.slice(1, -1).map((p, i) => [p[0] + (pts[i + 1][0] - p[0]) * 0.2, p[1] + (pts[i + 1][1] - p[1]) * 0.2]), false, 0.5)}" stroke="${mix(col, '#ffffff', 0.3)}" stroke-width="${f1(Math.max(0.6, w0 * 0.08))}" fill="none" opacity="0.6" stroke-linecap="round"/>`; } }
    // the trunk as one tube with a root flare spreading into the ground (roots running out and sinking)
    const [td, TL, TR] = tube(cl, wAt(0), wAt(nT));
    let trunk = `<path d="${td}" fill="${INK}" stroke="${INK}" stroke-width="${f1(ik)}"/><path d="${td}" fill="${col}"/><path d="${td}" fill="url(#mottle)" opacity="0.4"/>`;
    for (const sx of [-1, 1]) for (let k = 0; k < 2; k++) { const r0 = [x + sx * tw * (0.25 + k * 0.12), y - tw * (0.35 + k * 0.12)], r1 = [x + sx * tw * (0.62 + k * 0.25 + R() * 0.15), y - tw * 0.06], r2 = [x + sx * tw * (0.95 + k * 0.35 + R() * 0.2), y + 1.5]; const [rd] = tube([r0, r1, r2], tw * (0.3 - k * 0.08), tw * 0.06); trunk += `<path d="${rd}" fill="${INK}" stroke="${INK}" stroke-width="${f1(ik)}"/><path d="${rd}" fill="${col}"/>`; }
    let s = inks + fills + trunk;
    for (let k = 0; k < 4; k++) { const u = 0.2 + k * 0.2 + (R() - 0.5) * 0.08, pts = cl.slice(0, nT - 1).map((p, i) => [TL[i][0] + (TR[i][0] - TL[i][0]) * u, p[1]]); s += line(pts, Math.max(0.5, tw * 0.05), dk, 0.6); }
    const cidT = S.id('tk'); s += `<clipPath id="${cidT}"><path d="${td}"/></clipPath><g clip-path="url(#${cidT})"><path d="${smooth([...cl.map((p, i) => [p[0] + wAt(i) * 0.1, p[1]]), ...TR.slice().reverse().map(([a, b2]) => [a + 4, b2])], true, 0.5)}" fill="${hatchA(Z)}" opacity="0.5"/></g>`;
    if (o.hollow) { const hc = cl[3]; s += fillS(blob(hc[0] + tw * 0.05, hc[1], tw * 0.28, tw * 0.6, 10, 0.4), '#060508') + inkS(blob(hc[0] + tw * 0.05, hc[1], tw * 0.3, tw * 0.62, 10, 0.4), 1); }
    const limbs = tubes.map(([pts, w]) => [pts, w]);
    return { svg: s, limbs, trunk: cl.filter((_, i) => i % 2 === 0), tw, wAt: i => wAt(Math.min(nT, i * 2)) };
  }

  // ------------------------------------------------------------------ soft atmosphere (gradients allowed: skies, fog, glows)
  let gid = 0;
  const radGrad = (col, op = 1, stops) => { const i = `g5rg${seed}_${gid++}`; S.DEFS.push(`<radialGradient id="${i}">${(stops || [[0, 1], [0.55, 0.75], [1, 0]]).map(([o2, a]) => `<stop offset="${o2}" stop-color="${col}" stop-opacity="${a * op}"/>`).join('')}</radialGradient>`); return `url(#${i})`; };
  function gradSky(stops) { const i = `g5sky${seed}_${gid++}`; S.DEFS.push(`<linearGradient id="${i}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o2, c]) => `<stop offset="${o2}" stop-color="${c}"/>`).join('')}</linearGradient>`); return `<rect width="${W}" height="${H}" fill="url(#${i})"/>`; }
  // a light shaft fading softly toward its foot (a light, so a gradient is allowed)
  function shaftG(poly, col, op = 0.25, fadeAt = 1) { const ys = poly.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), i = `g5sh${seed}_${gid++}`; S.DEFS.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${f1(y0)}" x2="0" y2="${f1(y1)}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="${fadeAt * 0.6}" stop-color="${col}" stop-opacity="${op * 0.6}"/><stop offset="${fadeAt}" stop-color="${col}" stop-opacity="0"/></linearGradient>`); return `<path d="${p2(poly)}" fill="url(#${i})"/>`; }
  function glow(x, y, rx, ry, col, op = 1) { return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${radGrad(col, op, [[0, 1], [0.35, 0.6], [1, 0]])}"/>`; }
  // a soft cloud mass: overlapping soft-edged puffs of different sizes, a lit crown toward the upper left, a darker
  // underside, wisps breaking off downwind; a few broken ink touches only on the lit crown
  function softCloud(cx, cy, w, h, col, o = {}) {
    let s = ''; const n = o.n || Math.max(5, Math.round(w / h * 2)), lit = mix(col, o.lit || '#f4f0f6', o.litK ?? 0.35), dk = mix(col, o.dark || '#1a1420', o.darkK ?? 0.35);
    const puffs = []; for (let i = 0; i < n; i++) { const u = R(), env = Math.sin(Math.PI * u); puffs.push([cx - w / 2 + w * u, cy - h * 0.35 * env + (R() - 0.5) * h * 0.2, h * (0.35 + R() * 0.55) * (0.5 + env * 0.6)]); }
    for (const [x, y, r] of puffs) s += `<ellipse cx="${f1(x)}" cy="${f1(y + r * 0.25)}" rx="${f1(r * 1.6)}" ry="${f1(r * 0.75)}" fill="${radGrad(dk, o.op ?? 0.8)}"/>`;
    for (const [x, y, r] of puffs) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.4)}" ry="${f1(r * 0.85)}" fill="${radGrad(col, o.op ?? 0.95)}"/>`;
    for (const [x, y, r] of puffs) s += `<ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.35)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.45)}" fill="${radGrad(lit, (o.op ?? 0.95) * 0.8)}"/>`;
    for (let i = 0; i < (o.wisps ?? 3); i++) { const [x, y, r] = puffs[Math.floor(R() * n)]; s += `<ellipse cx="${f1(x + r * (1.5 + R() * 1.5) * (o.drift ?? 1))}" cy="${f1(y + (R() - 0.3) * r * 0.6)}" rx="${f1(r * (1.6 + R()))}" ry="${f1(r * 0.18)}" fill="${radGrad(col, 0.6)}"/>`; }
    if (o.ink !== false) for (const [x, y, r] of puffs.slice(0, 3)) { const arc = []; for (let k = 0; k <= 6; k++) { const a = Math.PI * (1.15 + k / 6 * 0.55); arc.push([x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 0.75]); } s += line(arc, 0.8, INK, 0.25); }
    return s;
  }
  // soft smoke: a rising, drifting column of soft puffs growing and thinning, a dark core near the source
  function softSmoke(x, y, h, w, o = {}) {
    let s = ''; const n = o.n || 14, lean = o.lean ?? 0.6, col = o.col || '#0c0a0e', air2 = o.air || '#6a6060';
    for (let i = 0; i < n; i++) { const u = i / (n - 1), cx = x + lean * h * u * u * 1.6 + Math.sin(u * 5 + x) * w * 0.25 * u, cy = y - h * Math.sin(u * Math.PI / 2), r = w * (0.5 + u * 1.6) * (0.8 + R() * 0.4); s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r * 1.25)}" ry="${f1(r * 0.85)}" fill="${radGrad(mix(col, air2, u * 0.55), (o.op ?? 0.85) * (1 - u * 0.55))}"/>`; }
    return s;
  }

  // ------------------------------------------------------------------ big mushroom seen from below eye height
  function bigCap(x, y, h, Z, o = {}) {
    const col = o.col || '#c8b8d0', st = o.stem || '#d8d0c0', lean = o.lean ?? (R() - 0.5) * 0.3, cw = h * (o.cw || 0.3), sw = h * 0.038;
    const top = [x + lean * h, y - h];
    const stem = []; for (let i = 0; i <= 8; i++) { const u = i / 8, xx = x + lean * h * u * u + Math.sin(u * 3) * sw * 0.3, ww = sw * (1.8 - u * 0.9) * (u < 0.15 ? 1.6 - u * 3 : 1); stem.push([xx - ww, y - h * u, xx + ww]); }
    let s = cel([...stem.map(p => [p[0], p[1]]), ...stem.slice().reverse().map(p => [p[2], p[1]])], { Z, fill: st, band: sw * 0.6, tex: 'url(#mottle)', texOp: 0.4 });
    for (let k = 0; k < 4; k++) { const u0 = 0.2 + k * 0.2; s += line(stem.map((p, i) => [p[0] + (p[2] - p[0]) * u0 + Math.sin(i * 1.7 + k) * 0.6, p[1]]).slice(0, 7), 0.5, mix(st, INK, 0.45), 0.6); }
    // the torn veil ring hanging from the stem
    const rg = stem[6]; { const rp = [[rg[0] - sw * 0.3, rg[1]], [rg[2] + sw * 0.3, rg[1]], [rg[2] + sw * 0.1, rg[1] + sw * 0.9], [rg[2] - sw * 0.5, rg[1] + sw * 0.5], [rg[0] + sw * 0.6, rg[1] + sw * 1.3], [rg[0] - sw * 0.2, rg[1] + sw * 0.6]]; s += fillP(rp, mix(st, '#ffffff', 0.15)) + inkP(rp, 0.6); }
    // underside (gills): seen because the cap is above the eye; an ellipse band under the cap, radiating gill lines
    const below = Math.max(0.12, Math.min(0.45, (300 - top[1]) / 400)), ury = cw * below * 0.55, tilt = (R() - 0.5) * 0.12;
    const margin = []; for (let k = 0; k <= 20; k++) { const a = Math.PI - k / 20 * Math.PI * 2, rr = 1 + 0.08 * Math.sin(k * 1.9 + lean * 9) + (R() - 0.5) * 0.06; margin.push([top[0] + Math.cos(a) * cw * rr, top[1] + Math.sin(a) * ury * rr + Math.cos(a) * cw * tilt + (k > 3 && k < 9 ? cw * 0.06 * Math.sin(k) : 0)]); }
    s += cel(margin, { Z, fill: mix(col, '#2a2030', 0.45), band: 1, hi: false });
    let g = ''; for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2, e = [top[0] + Math.cos(a) * cw * 0.95, top[1] + Math.sin(a) * ury * 0.95 + Math.cos(a) * cw * tilt]; if (e[1] < top[1] - ury * 0.2) continue; g += `M${f1(top[0] + Math.cos(a) * sw * 0.9)} ${f1(top[1] + Math.sin(a) * sw * 0.3)} L${f1(e[0])} ${f1(e[1])} `; }
    s += `<path d="${g}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Z) * 0.5))}" opacity="0.6" fill="none"/>`;
    // the cap: asymmetric dome, margin torn and drooping, a split
    const dome = []; const pk = (R() - 0.5) * 0.35;
    for (let k = 0; k <= 16; k++) { const u = k / 16, a = Math.PI * (1 - u), hh = cw * (o.dome || 0.95) * Math.pow(Math.sin(Math.PI * Math.pow(u, 1 + pk)), 0.65); dome.push([top[0] + Math.cos(a) * cw * (1 + (R() - 0.5) * 0.04), top[1] - hh - (R() - 0.5) * cw * 0.02]); }
    const rim = []; for (let k = 0; k <= 16; k++) { const u = 1 - k / 16, xx = top[0] - cw + 2 * cw * u, droop = Math.sin(u * Math.PI) * ury + (Math.abs(u - (o.split ?? 0.68)) < 0.04 ? -cw * 0.18 : 0) + Math.sin(u * 17 + lean) * cw * 0.03; rim.push([xx, top[1] + droop * 0.9 + Math.cos(Math.PI * u) * cw * tilt * -1]); }
    const capP = [...dome, ...rim];
    s += cel(capP, { Z, fill: col, band: cw * 0.12, tex: 'url(#mottle)', texOp: 0.45 });
    s += `<path d="${smooth([...dome.slice(2, 9).map(([a, b]) => [a + cw * 0.06, b + cw * 0.08])], false, 0.5)}" stroke="${mix(col, '#ffffff', 0.45)}" stroke-width="${f1(Math.max(0.8, cw * 0.05))}" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    // scales and spots on the cap, larger toward the crown
    for (let k = 0; k < (o.scales ?? 14); k++) { const u = 0.1 + R() * 0.8, d = dome[Math.round(u * 16)], yy = d[1] + (top[1] - d[1]) * R() * 0.7, r = Math.max(0.7, cw * (0.02 + R() * 0.035)); s += `<path d="M${f1(d[0] - r)} ${f1(yy)} q${f1(r)} ${f1(-r * 1.2)} ${f1(r * 2)} 0 z" fill="${mix(col, o.spot || '#f4ecf0', 0.5)}" stroke="${INK}" stroke-width="0.4" opacity="0.8"/>`; }
    return { svg: s, top, cw, ury };
  }

  // ------------------------------------------------------------------ XIV
  function rose(x, y, r, col, o = {}) {
    let s = '';
    for (let k = 0; k < 3; k++) { const rr = r * (1 - k * 0.28), c = mix(col, k === 0 ? '#5a3a40' : '#ffffff', k === 0 ? 0.25 : k * 0.08); s += cel(blob(x + (R() - 0.5) * r * 0.5, y - k * r * 0.12 + (R() - 0.5) * r * 0.3, rr, rr * 0.8, 9, 0.5, R()), { Z: 10, fill: c, band: rr * 0.25, inkW: Math.max(0.4, r * 0.08) }); }
    s += fillS(blob(x - r * 0.1, y + r * 0.6, r * 0.9, r * 0.35, 9, 0.5), '#5a4030', 0.45);
    if (o.eye) s += B.eye(x, y, r * 0.5, { white: '#e0d8c8', iris: '#7a6a8a', open: 0.5 }); else for (let k = 0; k < 3; k++) { const a = R() * 6.28; s += `<path d="M${f1(x + Math.cos(a) * r * 0.5)} ${f1(y + Math.sin(a) * r * 0.4)} Q${f1(x)} ${f1(y - r * 0.1)} ${f1(x + Math.cos(a + 2) * r * 0.5)} ${f1(y + Math.sin(a + 2) * r * 0.4)}" stroke="${mix(col, '#4a2a34', 0.55)}" stroke-width="${f1(Math.max(0.5, r * 0.1))}" fill="none"/>`; }
    return s;
  }
  function foliage(x0, y0, x1, y1, n, o = {}) { let s = '', d1 = '', d2 = ''; for (let k = 0; k < n; k++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), l = (o.l || 4) * (0.6 + R() * 0.8), a = (o.ang ?? -0.9) + (R() - 0.5) * 1.4, lit = R() < (o.lit ?? 0.25); const seg = `M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; if (lit) d1 += seg; else d2 += seg; }
    return `<path d="${d2}" stroke="${o.dkCol || INK}" stroke-width="${f1(o.w || 1)}" stroke-linecap="round" opacity="${o.dkOp ?? 0.6}"/><path d="${d1}" stroke="${o.litCol || '#4a5a3e'}" stroke-width="${f1(o.w || 1)}" stroke-linecap="round" opacity="0.8"/>`; }

  // ------------------------------------------------------------------ XV gold leaf over black
  const GOLD = '#c09a46', GOLDL = '#ecd488', GOLDD = '#7a5c24', BLACK = '#121016';
  function gilt(q, Z, o = {}) {
    const [a, b, c, d] = q, dim = o.dim || 0, M = o.murk || murk;
    const L = (u, v) => { const tp = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], bt = [d[0] + (c[0] - d[0]) * u, d[1] + (c[1] - d[1]) * u]; return [tp[0] + (bt[0] - tp[0]) * v, tp[1] + (bt[1] - tp[1]) * v]; };
    const g = col => mix(col, M, dim);
    const thick = Math.min(Math.hypot(d[0] - a[0], d[1] - a[1]), Math.hypot(c[0] - b[0], c[1] - b[1]), Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - d[0], c[1] - d[1]));
    let s = cel(q, { Z, fill: g(GOLD), band: Math.max(0.5, Math.min(Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.06, thick * 0.3)), shadow: g(GOLDD), inkW: Math.max(0.5, Math.min(inkW(Z) * 0.9, thick * 0.3)) });
    s += fillP([L(0, 0), L(0.62, 0), L(0.35, 0.55), L(0, 0.8)], g(mix(GOLD, GOLDL, 0.55)), 0.9) + fillP([L(0.02, 0.03), L(0.3, 0.03), L(0.12, 0.35), L(0.02, 0.4)], g(GOLDL), 0.85);
    s += fillP([L(1, 0.4), L(1, 1), L(0.45, 1), L(0.8, 0.6)], g(GOLDD), 0.55);
    const n = o.cracks ?? Math.max(2, Math.round(Math.hypot(b[0] - a[0], d[1] - a[1]) / 14));
    for (let k = 0; k < n; k++) { let u = R(), v = R(), ang = R() * 6.28; const pts = [L(u, v)]; for (let i = 0; i < 5; i++) { ang += (R() - 0.5) * 1.2; u = Math.min(1, Math.max(0, u + Math.cos(ang) * 0.12)); v = Math.min(1, Math.max(0, v + Math.sin(ang) * 0.18)); pts.push(L(u, v)); } s += pline(pts, Math.max(0.6, inkW(Z) * 0.7), BLACK, 0.9); }
    // flakes lost to the black: small, angular, few (never blobs); the lit lip on their lower right edge
    for (let k = 0; k < (o.lost ?? 2); k++) { const ctr = L(0.15 + R() * 0.7, 0.15 + R() * 0.7), r = Math.max(1.2, Math.min(5, Math.hypot(b[0] - a[0], b[1] - a[1]) * (0.015 + R() * 0.025))), pg = [[ctr[0] - r, ctr[1] - r * 0.3], [ctr[0] + r * 0.2, ctr[1] - r * 0.7], [ctr[0] + r, ctr[1] + r * 0.1], [ctr[0] - r * 0.1, ctr[1] + r * 0.5]]; s += fillP(pg, BLACK) + pline([pg[2], pg[3]], 0.6, g(GOLDL), 0.7); }
    return s;
  }

  // ------------------------------------------------------------------ geometry
  // a pointed arch outline from s=a to s=b, springing at t=ys; k: steepness (1 equilateral, <1 blunter). [[s,t],...]
  function pointed(a, b, ys, n = 10, k = 1) {
    const w = b - a, r = w * k, o = [[a, 0]];
    const c1 = a + r, c2 = b - r, th = Math.acos(Math.max(-1, Math.min(1, (w / 2 - r) / r))), sp = Math.PI - th;
    for (let i = 0; i <= n; i++) { const t = Math.PI - i / n * sp; o.push([c1 + r * Math.cos(t), ys + r * Math.sin(t)]); }
    for (let i = 1; i <= n; i++) { const t = sp - i / n * sp; o.push([c2 + r * Math.cos(t), ys + r * Math.sin(t)]); }
    o.push([b, 0]); return o;
  }

  function write(OUT, room) {
    fs.mkdirSync(OUT, { recursive: true });
    for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${room}_${l}.svg`), S.svgLayer(l));
    fs.writeFileSync(path.join(OUT, `${room}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
    console.log(room, 'layers written');
  }
  const G = { W, H, AIR, air: air_, blackFlame, cloud, smoke, tube, gradSky, glow, shaftG, softCloud, softSmoke, radGrad, shaft, tree, bigCap, rose, foliage, gilt, GOLD, GOLDL, GOLDD, BLACK, pointed, write };
  return { S, B, G };
}
module.exports = { make };
