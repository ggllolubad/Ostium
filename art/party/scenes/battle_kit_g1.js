// Living Ink battle-room kit for group g1 (worlds I, II, III), round 2 (2026-11-24). Opt-in; built on lik.js and
// battle_li.js, neither edited. Generic helpers for depth, value plan and floors, then a small kit per world.
//   fogger      atmospheric recession toward a world's air colour (farther = lower contrast)
//   bands       stepped horizontal bands with ragged edges (skies, water glow): never a gradient
//   shaft       a light shaft of fine parallel lines with a faint fill, from upper left
//   edges       dark frame edges: stepped ragged darkening at the left, right and top (value plan)
//   arch        opening outlines (pointed, round, segmental), varied by the caller
//   holedWall   an ashlar wall plane with openings cut out (evenodd clip)
//   ring        an arch ring of voussoirs of uneven size; soffit: the arch's underside
//   flags       a flagged floor in perspective: uneven slabs, joints converging, cracks running toward the horizon
//   puddle      standing water on a floor, with a broken reflection of the light focus
//   rubble      a heap of fallen stones; rockMass: an organic rock or cave mass with cel, hatch and fissures
// Usage: const G = require('./battle_kit_g1')(S, BK);
'use strict';
const { ell } = require('../engine');

module.exports = (S, BK) => {
  const { W, H, P, K, pp, p2, f1, INK, cel, chip, hatch3, mix, R, smooth, tone, glow, stain, ashlar, hatchA, hatchB, inkW, id } = S;
  const line = BK.line, polyS = BK.polyS;
  const fogger = (air, z0, z1, max) => (col, Z, k = 1) => mix(col, air, Math.max(0, Math.min(max, (Z - z0) / (z1 - z0) * max)) * k);
  const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };

  // ---------------------------------------------------------------- stepped bands: stops [[y, colour], ...] top to bottom
  function bands(stops, o = {}) {
    let s = '';
    for (const [y0, c] of stops) { const pts = []; for (let x = -20; x <= W + 40; x += (o.step || 46) + R() * (o.step || 46)) pts.push([x, y0 + Math.sin(x * (o.f || 0.006) + y0) * (o.amp ?? 10) + (R() - 0.5) * (o.jit ?? 7)]); s += `<path d="${smooth([...pts, [W + 40, o.bottom || H + 20], [-20, o.bottom || H + 20]], true, 0.6)}" fill="${c}"${o.op ? ` opacity="${o.op}"` : ''}/>`; }
    return s;
  }
  // ---------------------------------------------------------------- light shaft: top edge at screen (x, y), width w, length len,
  // slant sk (dx per dy, positive = falling to the right, from the upper left); fine lines and a faint fill
  function shaft(x, y, w, len, sk, col, o = {}) {
    const d = `M${f1(x)} ${f1(y)} L${f1(x + w)} ${f1(y)} L${f1(x + w + len * sk + (o.spread || 0))} ${f1(y + len)} L${f1(x + len * sk - (o.spread || 0))} ${f1(y + len)} Z`;
    let s = `<path d="${d}" fill="${col}" opacity="${o.fill ?? 0.08}"/>`;
    let ln = ''; const n = Math.max(2, Math.round(w / (o.gap || 5)));
    for (let k = 0; k < n; k++) { const u = (k + R() * 0.6) / n, xx = x + w * u, l = len * (0.45 + R() * 0.55), sp = (o.spread || 0) * (u * 2 - 1); ln += `M${f1(xx)} ${f1(y)} L${f1(xx + l * sk + sp * l / len)} ${f1(y + l)} `; }
    s += `<path d="${ln}" stroke="${col}" stroke-width="${o.lw || 0.6}" opacity="${o.op ?? 0.22}" fill="none"/>`;
    return o.glow === false ? s : S.GLOW(s);
  }
  // ---------------------------------------------------------------- dark frame edges (far layer, drawn last before floor)
  function edges(col, o = {}) {
    let s = ''; const steps = o.steps || [0.16, 0.16, 0.18, 0.22];
    const side = (x0, wid, dir) => steps.forEach((op, i) => { const w = wid * (1 - i / steps.length), pts = [];
      for (let y = -10; y <= H + 20; y += 22 + R() * 18) pts.push([x0 + dir * w * (0.85 + Math.sin(y * 0.02 + i) * 0.1 + R() * 0.08), y]);
      s += `<path d="${smooth([[x0 - dir * 30, -10], ...pts, [x0 - dir * 30, H + 20]], true, 0.5)}" fill="${col}" opacity="${op}"/>`; });
    if (o.l) side(0, o.l, 1); if (o.r) side(W, o.r, -1);
    if (o.t) steps.forEach((op, i) => { const h = o.t * (1 - i / steps.length), pts = []; for (let x = -10; x <= W + 20; x += 26 + R() * 20) pts.push([x, h * (0.8 + Math.sin(x * 0.011 + i * 2) * 0.15 + R() * 0.08)]); s += `<path d="${smooth([[-10, -30], ...pts, [W + 20, -30]], true, 0.5)}" fill="${col}" opacity="${op}"/>`; });
    return s;
  }
  // ---------------------------------------------------------------- arches: outline [X,Y] from (xa,0) round to (xb,0)
  function arch(xa, xb, ys, kind = 'point', o = {}) {
    const w = xb - xa, out = [[xa, 0]], n = o.n || 10;
    if (kind === 'point') { const r = w * (o.r || 1); // r > w/2: pointed; r = w: equilateral
      const c1 = xa + r, c2 = xb - r, ap = Math.acos((w / 2 - r) / r), ap2 = Math.PI - ap;
      for (let i = 0; i <= n; i++) { const th = Math.PI - i / n * (Math.PI - ap); out.push([c1 + r * Math.cos(th), ys + r * Math.sin(th)]); }
      for (let i = 1; i <= n; i++) { const th = ap2 - i / n * ap2; out.push([c2 + r * Math.cos(th), ys + r * Math.sin(th)]); }
    } else if (kind === 'round') { for (let i = 0; i <= n * 2; i++) { const th = Math.PI - i / (n * 2) * Math.PI; out.push([xa + w / 2 + w / 2 * Math.cos(th), ys + (o.rise || w / 2) * Math.sin(th)]); } }
    else { const rise = o.rise || w * 0.18; for (let i = 0; i <= n * 2; i++) { const u = i / (n * 2); out.push([xa + w * u, ys + rise * Math.sin(u * Math.PI)]); } }
    out.push([xb, 0]); return out;
  }
  // an ashlar wall facing the viewer at depth Z with openings (each an [X,Y] polygon) cut out
  function holedWall(Z, X0, X1, Y0, Y1, holes, col, o = {}) {
    const outer = pp([[X0, Y0, Z], [X1, Y0, Z], [X1, Y1, Z], [X0, Y1, Z]]), hs = holes.map(h => p2(h.map(([x, y]) => P(x, y, Z)))).join(' ');
    const cid = id('hw'), at = (s, t) => [X0 + s, Y0 + t, Z];
    return `<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${hs}"/></clipPath><g clip-path="url(#${cid})">` +
      ashlar(at, X1 - X0, Y1 - Y0, col, Object.assign({ vary: 0.24, chip: 0.45, mortar: 0.62, lost: 0.2, spall: 0.24, rough: true, roughP: 0.35, skip: (s0, s1, t0, t1) => holes.some(h => inPoly(X0 + (s0 + s1) / 2, Y0 + (t0 + t1) / 2, h)) }, o.ash || {})) +
      (o.shade !== false ? hatch3(at, 0, X1 - X0, 0, (Y1 - Y0) * (o.shadeH ?? 0.4), 0.8, { op: o.shadeOp ?? 0.4, ragged: 0.25 }) : '') + (o.extra || '') + '</g>';
  }
  // the arch ring: voussoirs of uneven width round the opening's curve (skips the jambs), each chipped and toned
  function ring(op, Z, dep, col, o = {}) {
    const curve = op.slice(1, -1), L = []; let acc = 0; L.push(0);
    for (let i = 1; i < curve.length; i++) { acc += Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]); L.push(acc); }
    const at = d => { for (let i = 1; i < L.length; i++) if (L[i] >= d) { const u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [curve[i - 1][0] + (curve[i][0] - curve[i - 1][0]) * u, curve[i - 1][1] + (curve[i][1] - curve[i - 1][1]) * u, i]; } return [...curve[curve.length - 1], curve.length - 1]; };
    const nrm = d => { const a = at(Math.max(0, d - 0.05)), b = at(Math.min(acc, d + 0.05)), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; };
    let s = '', d = 0; const skipFrom = o.skip ?? -1;
    let k = 0;
    while (d < acc - 0.05) {
      const w = Math.min(acc - d, (o.v || 0.42) * (0.65 + R() * 0.8)); const d1 = d + w;
      if (!(skipFrom >= 0 && d >= skipFrom * acc && d < (o.skipTo ?? 1) * acc)) {
        const a = at(d), b = at(d1), na = nrm(d), nb = nrm(d1), dd = dep * (0.85 + R() * 0.35), sl = o.slip && k === o.slip ? -0.14 : 0;
        const q = [[a[0], a[1] + sl], [b[0], b[1] + sl], [b[0] - nb[0] * dd, b[1] - nb[1] * dd + sl], [a[0] - na[0] * dd, a[1] - na[1] * dd + sl]].map(([x, y]) => P(x, y, Z));
        // keep the extrados outward: the normal points into the opening for a ccw curve, so flip if needed
        const cq = chip(q, 0.35), fl = tone(col, 0.22); s += cel(cq, { Z, fill: fl, tex: 'url(#mottle)', texOp: 0.35, band: Math.max(0.9, K(Z) * 0.04) }) + require('./materials_v2')(S).stoneMarks(cq, Z, fl, { wy0: a[1], wx: o.wx });
      }
      d = d1; k++;
    }
    return s;
  }
  function soffit(op, Z0, Z1, col) {
    const f = op.slice(1, -1).map(([x, y]) => P(x, y, Z0)), b = op.slice(1, -1).map(([x, y]) => P(x, y, Z1));
    return `<path d="${p2([...f, ...b.reverse()])}" fill="${col}" stroke="${INK}" stroke-width="0.8"/><path d="${p2([...op.slice(1, -1).map(([x, y]) => P(x, y, Z0)), ...op.slice(1, -1).map(([x, y]) => P(x, y, Z1)).reverse()])}" fill="${hatchA(Z0)}" opacity="0.5"/>`;
  }
  // ---------------------------------------------------------------- floor in perspective at height Y (default 0)
  // o.size: slab size m; o.skip(X,Z) -> true to leave a hole; o.fog(col,Z); o.cracks: count; o.Y
  function flags(X0, X1, Z0, Z1, col, o = {}) {
    const Y = o.Y || 0, fog = o.fog || (c => c), sz = o.size || 1.1; let s = `<path d="${pp([[X0, Y, Z0], [X1, Y, Z0], [X1, Y, Z1], [X0, Y, Z1]])}" fill="${mix(col, INK, 0.5)}"/>`;
    const WX = require('./materials_v2')(S).begin((s2, t2) => [X0 + s2, Y, Z0 + t2], X1 - X0, Z1 - Z0, o.wx);   // materials v2: weathered slabs
    let Z = Z0, r = 0;
    while (Z < Z1) {
      const dz = Math.min(Z1 - Z, sz * (0.7 + R() * 0.6) * (1 + (Z - Z0) * (o.grow ?? 0.03))); let X = X0 - R() * sz;
      while (X < X1) { const w = sz * (0.6 + R() * 1.1) * (o.long || 1), Xc = X + w / 2, Zc = Z + dz / 2;
        if (!(o.skip && o.skip(Xc, Zc))) { const g = 0.025 + (o.gap || 0), drop = o.heave ? (R() < o.heave ? (R() - 0.5) * 0.06 : 0) : 0;
          const q = [[X + g, Y + drop, Z + dz - g], [X + w - g, Y + drop, Z + dz - g], [X + w - g, Y, Z + g], [X + g, Y, Z + g]].map(p => P(...p));
          if (q[1][0] > -10 && q[0][0] < W + 10) { const cq = chip(q, 0.3), fl = fog(tone(col, o.vary ?? 0.14), Z); s += cel(cq, { Z, fill: fl, band: Math.max(0.6, K(Z) * 0.015), tex: 'url(#mottle)', texOp: 0.35, inkW: Math.max(0.4, inkW(Z) * 0.6), heavy: Math.max(0.6, inkW(Z)), hi: Z < 9 }); s += WX.stoneNow(cq, Z, fl, [[X, Y, Z + dz], [X + w, Y, Z + dz], [X + w, Y, Z], [X, Y, Z]], { joint: mix(col, INK, 0.5) }); } }
        X += w; }
      Z += dz; r++;
    }
    // cracks running back toward the horizon (perspective cue), forking
    for (let i = 0; i < (o.cracks ?? 8); i++) { let X = X0 + R() * (X1 - X0), Zc = Z0 + R() * (Z1 - Z0) * 0.5; const pts = [P(X, Y, Zc)]; const L = 2 + R() * 5;
      for (let k = 0; k < 7; k++) { X += (R() - 0.5) * 0.35; Zc += L / 7; pts.push(P(X, Y, Zc)); }
      s += line(pts, Math.max(0.5, K(Z0) * 0.012), INK, 0.6); }
    return s + WX.end();
  }
  // standing water on a floor plane: a ragged dark pool with lit rim and broken reflection strokes in the reflection colour
  function puddle(X, Z, w, d, col, refl, o = {}) {
    const Y = (o.Y || 0) + 0.003, pts = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283, m = 0.75 + R() * 0.35; pts.push(P(X + Math.cos(a) * w / 2 * m, Y, Z + Math.sin(a) * d / 2 * m)); }
    let s = `<path d="${smooth(pts, true, 0.6)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.7))}"/>`;
    const c = P(X, Y, Z), k = K(Z);
    for (let i = 0; i < 6 + w * 2; i++) { const yy = c[1] + (R() - 0.5) * k * d * 0.035, ww = k * w * (0.1 + R() * 0.3); s += `<path d="M${f1(c[0] - ww / 2 + (R() - 0.5) * k * w * 0.4)} ${f1(yy)} l${f1(ww)} 0" stroke="${refl}" stroke-width="${f1(Math.max(0.6, k * 0.012))}" opacity="${f1(0.25 + R() * 0.35)}"/>`; }
    return s;
  }
  // ---------------------------------------------------------------- rubble and rock
  function rubble(X, Z, w, h, col, o = {}) {
    const hp = []; for (let k = 0; k <= 14; k++) { const t = k / 14; hp.push(P(X - w / 2 + w * t, Math.max(0, Math.sin(t * Math.PI) * h * (1 - (o.lean || 0) * t)) + (R() - 0.5) * h * 0.1, Z - Math.sin(t * Math.PI) * w * 0.15)); }
    const d = smooth([P(X - w / 2 - 0.3, 0, Z), ...hp, P(X + w / 2 + 0.3, 0, Z)], true, 0.4);
    let s = `<path d="${d}" fill="${mix(col, INK, 0.35)}" stroke="${INK}" stroke-width="1"/><path d="${d}" fill="${hatchA(Z)}" opacity="0.4"/>`;
    for (let k = 0; k < (o.n || 18); k++) { const t = R(), Xb = X - w / 2 + w * t, Yb = R() * Math.max(0.05, Math.sin(t * Math.PI) * h), Zb = Z - R() * 0.6, [x, y] = P(Xb, Yb, Zb), r2 = K(Zb) * (o.stone || 0.14) * (0.6 + R() * 0.9);
      const an = (R() - 0.5) * 0.8, ca = Math.cos(an), sa = Math.sin(an), ww = r2 * (1 + R()), hh = r2 * (0.5 + R() * 0.4);
      const blk = [[-ww, -hh], [ww * (0.7 + R() * 0.3), -hh * (0.8 + R() * 0.4)], [ww, hh], [-ww * (0.8 + R() * 0.2), hh]].map(([u, v]) => [x + u * ca - v * sa, y + u * sa + v * ca]);
      const cb = chip(blk, 0.6), fl = tone(col, 0.2); s += cel(cb, { Z: Zb, fill: fl, band: 1.1, inkW: 0.6, heavy: 0.9, tex: 'url(#mottle)', texOp: 0.35 }) + require('./materials_v2')(S).stoneMarks(cb, Zb, fl, { wy0: Yb, wx: o.wx }); }
    return s;
  }
  // an organic mass (rock, cave wall, peat bank) from a screen polygon: base tone, mottle, shadow hatch on the lower right,
  // a lit upper-left rim, a few fissures following the form
  function rockMass(pts, Z, col, o = {}) {
    const d = smooth(pts, true, o.round ?? 0.35), cid = id('rm');
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
    let s = `<path d="${d}" fill="${col}"/><path d="${d}" fill="url(#mottle)" opacity="${o.tex ?? 0.5}"/><clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`;
    s += `<ellipse cx="${f1(x0 + w * 0.78)}" cy="${f1(y0 + h * 0.8)}" rx="${f1(w * 0.6)}" ry="${f1(h * 0.65)}" fill="${hatchA(Z)}" opacity="${o.hop ?? 0.5}"/>`;
    if (o.cross !== false) s += `<ellipse cx="${f1(x0 + w * 0.9)}" cy="${f1(y0 + h * 0.95)}" rx="${f1(w * 0.4)}" ry="${f1(h * 0.45)}" fill="${hatchB(Z)}" opacity="${(o.hop ?? 0.5) * 0.8}"/>`;
    for (let k = 0; k < (o.fiss ?? 4); k++) { const sx = x0 + w * (0.15 + R() * 0.7), sy = y0 + h * (0.15 + R() * 0.5), pp2 = [[sx, sy]]; let x = sx, y = sy; for (let j = 0; j < 4; j++) { x += (R() - 0.3) * w * 0.06; y += h * (0.05 + R() * 0.08); pp2.push([x, y]); } s += line(pp2, Math.max(0.5, inkW(Z) * 0.8), INK, 0.7); }
    s += require('./materials_v2')(S).rockSkin(pts, Z, col, { noClip: true, wx: o.wx });   // materials v2: strata, fractures, tafoni, lichen, runs
    s += `</g><path d="${d}" fill="none" stroke="${INK}" stroke-width="${f1(o.ink || Math.max(0.8, inkW(Z) * 1.2))}" stroke-linejoin="round"/>`;
    if (o.rim !== false) { const top = pts.filter(p => p[1] < y0 + h * 0.35 && p[0] < x0 + w * 0.7).sort((a, b) => a[0] - b[0]); if (top.length > 1) s += line(top, Math.max(0.7, inkW(Z) * 0.8), mix(col, '#fff3d8', 0.4), 0.5); }
    return s;
  }
  // a hanging rope or chain line from screen A to B with sag (px)
  const hang = (A, B, sag, w, col) => { const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + sag]; return line([A, m, B], w + 1.4, INK, 1) + line([A, m, B], w, col, 1); };

  // ================================================================ WORLD I kit (the Drowned Kingdom)
  const I = (() => {
    const MURK = '#0f171c', STONE = '#4b5759', VERD = '#4f7d6c', GOLD = '#8a7840', KELP = '#25301f', WL = '#a9c4b8', BONE = '#c8bea4';
    function kelp(X, Y, Z, len, o = {}) {
      const pts = [], n = 10, sway = (R() - 0.5) * 0.25;
      for (let i = 0; i <= n; i++) { const t = i / n; pts.push([X + Math.sin(t * 5 + R()) * 0.06 + sway * t * t, Y - len * t, Z]); }
      const ps = pts.map(p => P(...p)), w = Math.max(1.0, K(Z) * (o.w || 0.08)), L = [], Rr = [];
      for (let i = 0; i < ps.length; i++) { const a = ps[Math.max(0, i - 1)], b = ps[Math.min(ps.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = w * (1 - i / ps.length * 0.7) * (0.7 + 0.3 * Math.sin(i * 1.7)); L.push([ps[i][0] - dy / l * ww, ps[i][1] + dx / l * ww]); Rr.push([ps[i][0] + dy / l * ww, ps[i][1] - dx / l * ww]); }
      const col = o.col || '#2c3a24';
      return require('./materials_v2')(S).strand(ps, w * 2, Math.max(0.6, w * 0.5), Z, { col, shade: w > 1.5 }) + line(ps.slice(1, -2), Math.max(0.4, w * 0.25), mix(col, WL, 0.35), o.mid ?? 0.5);   // materials v2 strand
    }
    function barnacles(cx, cy, r, n, Z, col = '#b4b0a0') {
      let s = ''; for (let i = 0; i < n; i++) { const a = R() * 6.283, d = Math.sqrt(R()) * r, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.6, b = Math.max(0.9, K(Z) * (0.025 + R() * 0.03));
        s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(b)}" ry="${f1(b * 0.85)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, b * 0.25))}"/><ellipse cx="${f1(x + b * 0.1)}" cy="${f1(y + b * 0.1)}" rx="${f1(b * 0.42)}" ry="${f1(b * 0.32)}" fill="${INK}"/>`; }
      return s;
    }
    function bubbles(n, x0, x1, y0, y1, rmax) { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), r = 0.6 + R() * rmax; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${WL}" fill-opacity="0.12" stroke="${mix(WL, INK, 0.3)}" stroke-width="${f1(Math.max(0.35, r * 0.25))}" opacity="0.7"/><circle cx="${f1(x - r * 0.35)}" cy="${f1(y - r * 0.35)}" r="${f1(r * 0.28)}" fill="#e8f0ea" opacity="0.7"/>`; } return s; }
    function motes(n, y0, y1, col = WL) { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${f1(R() * W)}" cy="${f1(y0 + R() * (y1 - y0))}" r="${f1(0.4 + R() * 0.8)}" fill="${col}" opacity="${f1(0.15 + R() * 0.3)}"/>`; return s; }
    // a drowned gabled house front at depth Z (lower town): rubble walls, a doorway, a shuttered window, a slumped roof line
    // with slipped slates; o.gable: pitch; kelp from the eaves; o.col
    function house(X, Z, w, h, o = {}, fog = c => c) {
      const yb = o.base || 0, P = (x, y, z) => S.P(x, y + yb, z), kelp2 = (X, Y, Z, l, oo) => kelp(X, Y + yb, Z, l, oo); const pitch = o.pitch ?? 0.55, ridge = h + w / 2 * pitch * (0.8 + R() * 0.4), lean = (R() - 0.5) * 0.2, col = fog(o.col || '#46514f', Z);
      const outline = [[X, 0], [X + w, 0], [X + w, h], [X + w / 2 + lean, ridge], [X, h]];
      let s = cel(outline.map(([x, y]) => P(x, y, Z)), { Z, fill: col, tex: 'url(#mottle)', texOp: 0.45 });
      s += hatch3((s2, t) => [X + s2, t + yb, Z], 0, w, 0, h * 0.6, 0.8, { op: 0.35, ragged: 0.3 });
      // the roof: a dark slate rake with slipped slates, broken at one end
      const rk = [[X - 0.25, h - 0.1], [X + w / 2 + lean, ridge + 0.2], [X + w + 0.25, h - 0.1]]; s += line(rk.map(([x, y]) => P(x, y, Z - 0.1)), Math.max(1.2, K(Z) * 0.18), fog('#1c2426', Z), 1);
      if (o.door !== false) { const dx = X + w * (0.2 + R() * 0.4), d = arch(dx, dx + Math.min(1.1, w * 0.3), 1.5, 'round', { n: 5 }).map(([x, y]) => P(x, y, Z)); s += `<path d="${p2(d)}" fill="${fog('#0a1012', Z, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Z)))}"/>`; }
      if (o.win) { const wx = X + w * (0.55 + R() * 0.2), q = [[wx, h * 0.62], [wx + 0.6, h * 0.62], [wx + 0.6, h * 0.62 + 0.8], [wx, h * 0.62 + 0.8]].map(([x, y]) => P(x, y, Z)); s += `<path d="${p2(q)}" fill="${fog('#0c1214', Z, 0.6)}" stroke="${INK}" stroke-width="0.6"/>`; }
      if (o.kelp) for (let k = 0; k < o.kelp; k++) s += kelp2(X + R() * w, h - 0.05, Z - 0.05, 0.6 + R() * 1.4, { w: 0.06, col: fog('#1e2a1c', Z) });
      return s;
    }
    return { MURK, STONE, VERD, GOLD, KELP, WL, BONE, kelp, barnacles, bubbles, motes, house };
  })();


  // ================================================================ WORLD II kit (the Rotmire)
  const II = (() => {
    const PEAT = '#4a3828', PEATD = '#2a2018', BILE = '#7a8a3a', BILED = '#4a5428', AMBER = '#c8903e', OAK = '#2a2218', REED = '#5a5a36', TAN = '#6a4a2e';
    function reeds(x, y, h, n, col = REED, o = {}) {
      let s = '';
      for (let i = 0; i < n; i++) { const dx = (R() - 0.5) * h * 0.5, hh = h * (0.5 + R() * 0.6), bend = (R() - 0.4) * hh * (o.flat ? 1.2 : 0.35), x0 = x + dx, tip = [x0 + bend, y - hh * (o.flat ? 0.4 : 1)], w = Math.max(0.8, h * 0.03);
        s += `<path d="M${f1(x0 - w)} ${f1(y)} Q${f1(x0 + bend * 0.2)} ${f1(y - hh * 0.5)} ${f1(tip[0])} ${f1(tip[1])} Q${f1(x0 + bend * 0.25 + w)} ${f1(y - hh * 0.5)} ${f1(x0 + w)} ${f1(y)} Z" fill="${tone(col, 0.25)}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, w * 0.4))}"/>`;
        if (R() < (o.heads ?? 0.15)) s += `<ellipse cx="${f1(tip[0])}" cy="${f1(tip[1] + h * 0.04)}" rx="${f1(w * 1.1)}" ry="${f1(h * 0.06)}" fill="#3a2a18" stroke="${INK}" stroke-width="0.5"/>`; }
      return s;
    }
    function hornLantern(x, y, s, o = {}) {
      let out = `<path d="M${f1(x)} ${f1(y - s * 1.6)} L${f1(x)} ${f1(y - s * 0.7)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.12))}"/>`;
      out += S.EM(`<path d="M${f1(x - s * 0.32)} ${f1(y - s * 0.7)} L${f1(x + s * 0.32)} ${f1(y - s * 0.7)} L${f1(x + s * 0.36)} ${f1(y + s * 0.3)} L${f1(x - s * 0.36)} ${f1(y + s * 0.3)} Z" fill="${AMBER}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.1))}"/>` + `<path d="M${f1(x - s * 0.15)} ${f1(y - s * 0.55)} L${f1(x - s * 0.12)} ${f1(y + s * 0.15)}" stroke="#f0d090" stroke-width="${f1(Math.max(0.5, s * 0.1))}" opacity="0.7"/>`);
      out += `<path d="M${f1(x - s * 0.4)} ${f1(y - s * 0.7)} L${f1(x + s * 0.4)} ${f1(y - s * 0.7)} L${f1(x + s * 0.25)} ${f1(y - s * 0.95)} L${f1(x - s * 0.25)} ${f1(y - s * 0.95)} Z M${f1(x - s * 0.4)} ${f1(y + s * 0.3)} L${f1(x + s * 0.4)} ${f1(y + s * 0.3)} L${f1(x + s * 0.3)} ${f1(y + s * 0.45)} L${f1(x - s * 0.3)} ${f1(y + s * 0.45)} Z" fill="#2a2620" stroke="${INK}" stroke-width="0.6"/>`;
      if (o.glow !== false) out += glow(x, y - s * 0.2, s * (o.r || 4), s * (o.r || 4) * 0.8, AMBER, o.gop ?? 0.22);
      return out;
    }
    // a black tanned post or pile (world metres), slick below the waterline, fungus, mould fur, an optional snapped top
    function post(X, Y0, Y1, Z, w, col, o = {}) {
      const lean = o.lean || 0, a = P(X - w / 2, Y0, Z), b = P(X + w / 2, Y0, Z), c = P(X + w / 2 + lean, Y1, Z), d = P(X - w / 2 + lean, Y1, Z);
      let top = [c, d]; if (o.snap) { const tp = []; for (let k = 0; k <= 5; k++) { const u = k / 5; tp.push([c[0] + (d[0] - c[0]) * u, c[1] - (k % 2 ? 1 : 0.2) * K(Z) * (0.1 + R() * 0.2)]); } top = tp; }
      let s = cel([a, b, ...top], { Z, fill: tone(col, 0.12), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(1, (b[0] - a[0]) * 0.35) });
      const wpx = b[0] - a[0]; for (let k = 0; k < 3; k++) { const u = 0.2 + k * 0.3; s += `<path d="M${f1(a[0] + wpx * u)} ${f1(a[1] - 2)} L${f1(d[0] + wpx * u)} ${f1(d[1] + 3)}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, wpx * 0.03))}" opacity="0.45"/>`; }
      if (o.carve) for (let k = 0; k < o.carve; k++) { const y = d[1] + (a[1] - d[1]) * (0.12 + k * 0.1); s += `<path d="M${f1(d[0] + wpx * 0.15)} ${f1(y)} q${f1(wpx * 0.35)} ${f1(-wpx * 0.25)} ${f1(wpx * 0.7)} 0" stroke="${INK}" stroke-width="${f1(Math.max(0.5, wpx * 0.06))}" fill="none" opacity="0.7"/>`; }
      if (o.shelf) s += BK.shelf(a[0] + wpx * 0.6, d[1] + (a[1] - d[1]) * o.shelf, Math.max(3, wpx * 0.9), mix('#8a7a4a', col, 0.2), { n: 2 });
      return s;
    }
    // a bog body pressed into a peat face at screen (x,y), size k (px per m): a tanned brown face in profile or a hand
    function peatBody(x, y, k, kind = 'face', col = TAN) {
      if (kind === 'hand') { let s = `<path d="M${f1(x - k * 0.06)} ${f1(y + k * 0.12)} L${f1(x - k * 0.05)} ${f1(y - k * 0.02)}`; const fingers = [[-0.06, -0.14], [-0.02, -0.17], [0.02, -0.16], [0.06, -0.12], [0.09, -0.04]]; for (const [fx, fy] of fingers) s += ` L${f1(x + fx * k)} ${f1(y + fy * k)} L${f1(x + fx * k + k * 0.02)} ${f1(y + fy * k + k * 0.03)}`; s += ` L${f1(x + k * 0.07)} ${f1(y + k * 0.12)} Z`;
        return `<path d="${s}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, k * 0.012))}" stroke-linejoin="round"/>`; }
      const f = [[x - k * 0.1, y - k * 0.12], [x + k * 0.02, y - k * 0.15], [x + k * 0.1, y - k * 0.08], [x + k * 0.12, y - k * 0.02], [x + k * 0.16, y + k * 0.01], [x + k * 0.11, y + k * 0.04], [x + k * 0.11, y + k * 0.08], [x + k * 0.06, y + k * 0.13], [x - k * 0.04, y + k * 0.14], [x - k * 0.12, y + k * 0.05]];
      return `<path d="${smooth(f, true, 0.35)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, k * 0.012))}"/>` + `<path d="M${f1(x + k * 0.03)} ${f1(y - k * 0.03)} l${f1(k * 0.05)} ${f1(k * 0.01)} M${f1(x + k * 0.04)} ${f1(y + k * 0.08)} l${f1(k * 0.05)} 0" stroke="${INK}" stroke-width="${f1(Math.max(0.5, k * 0.012))}"/>` + `<path d="${smooth(f.slice(0, 3), false, 0.4)}" stroke="#2a1a0e" stroke-width="${f1(Math.max(1, k * 0.04))}" fill="none"/>`;
    }
    return { PEAT, PEATD, BILE, BILED, AMBER, OAK, REED, TAN, reeds, hornLantern, post, peatBody };
  })();

  // ================================================================ WORLD III kit (the Boiling Baths): marble, column, votive,
  // pipe, lifted unchanged from bg_baths_pool.js (round 1) so the new rooms share them; III(fog) binds a room's haze
  const III = (fogIn) => {
    const MARB = '#b8a29c', MARBD = '#8a7470', STEAM = '#ece6e0', BOIL = '#a4483a', COPPER = '#8a4a32', BRONZE = '#7a5a32', GILT = '#b89848', SCALE = '#e8e4d4', CLAY = '#a8704a', HOT = '#ff9a4a';
    const fog = fogIn || ((c) => c);
    function marble(at, Ls, Lt, col, o = {}) {
      let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, 0.55)}"/>`;
      const rowsH = o.rows || 0.8; let t = 0, ri = 0;
      while (t < Lt - 0.02) {
        const h = Math.min(Lt - t, rowsH * (0.7 + R() * 0.6)); let s = -R() * 0.8;
        while (s < Ls) {
          const w = (o.slab || 1.2) * (0.6 + R() * 0.9), a0 = Math.max(0, s), a1 = Math.min(Ls, s + w);
          if (a1 - a0 > 0.05 && !(o.skip && o.skip(a0, a1, t, t + h))) {
            const g = 0.015, q = [at(a0 + g, t + g), at(a1 - g, t + g), at(a1 - g, t + h - g), at(a0 + g, t + h - g)], qs = q.map(p => P(...p)), Zb = (q[0][2] + q[2][2]) / 2;
            const fill = tone(col, o.vary ?? 0.14);
            out += cel(o.chipAmt ? chip(qs, o.chipAmt) : qs, { Z: Zb, fill, tex: 'url(#mottle)', texOp: 0.25, band: Math.max(0.8, K(Zb) * 0.02) });
        out += require('./materials_v2')(S).stoneMarks(o.chipAmt ? qs : qs, Zb, fill, { wy0: Math.min(q[0][1], q[2][1]) });   // materials v2
            // veins: two or three soft wandering lines, one darker and thin, one pale
            for (let k = 0; k < 2 + Math.floor(R() * 2); k++) { const pts = []; let vs = a0 + R() * (a1 - a0), vt = t + R() * h, ang = R() * 6.28; for (let j = 0; j < 7; j++) { pts.push(P(...at(Math.max(a0, Math.min(a1, vs)), Math.max(t, Math.min(t + h, vt))))); ang += (R() - 0.5) * 1.2; vs += Math.cos(ang) * w * 0.15; vt += Math.sin(ang) * h * 0.18; }
              out += `<path d="${smooth(pts, false, 0.6)}" stroke="${k ? mix(fill, '#f8f0f0', 0.5) : mix(fill, '#5a4a5a', 0.45)}" stroke-width="${f1(Math.max(0.4, K(Zb) * 0.008))}" fill="none" opacity="${k ? 0.45 : 0.5}"/>`; }
            // heat crazing: a fine net of short ink lines on some slabs (fire's mark on stone)
            if (R() < (o.craze || 0)) { let cz = ''; const c = P(...at((a0 + a1) / 2, t + h / 2)), rx = Math.abs(qs[1][0] - qs[0][0]) * 0.4, ry = Math.abs(qs[3][1] - qs[0][1]) * 0.4; for (let j = 0; j < 7; j++) { const x = c[0] + (R() - 0.5) * rx * 2, y = c[1] + (R() - 0.5) * ry * 2; cz += `M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * rx * 0.6)} ${f1((R() - 0.5) * ry * 0.6)} l${f1((R() - 0.5) * rx * 0.4)} ${f1((R() - 0.5) * ry * 0.5)} `; } out += `<path d="${cz}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.5"/>`; }
          }
          s += w;
        }
        t += h; ri++;
      }
      return out;
    }
    // a column of the colonnade at X on depth Z: Attic base, a fluted shaft with entasis, an Ionic capital with its volutes;
    // lit on the left, hatched on the right third; the cooked red tide line and the white scale crust near its foot; peeling
    function column(X, Z, h, r, o = {}) {
      let s = ''; const k = K(Z), base = P(X, 0, Z), top = P(X, h, Z), rpx = r * k, col = fog(o.col || MARB, Z);
      const shaft = []; for (let i = 0; i <= 10; i++) { const u = i / 10, w = rpx * (1 - 0.14 * u + 0.05 * Math.sin(u * Math.PI)); shaft.push([base[0] - w, base[1] + (top[1] - base[1]) * u - (i === 0 ? -rpx * 0.25 : 0)]); }
      const right = shaft.map(([x, y]) => [base[0] + (base[0] - x), y]).reverse();
      const poly = [...shaft, ...right];
      s += `<path d="${p2(poly)}" fill="${col}"/><path d="${p2(poly)}" fill="url(#mottle)" opacity="0.3"/>`;
      // cylinder shading: a cel band on the right, hatched; a lit stripe on the left
      const band = shaft.map(([x, y], i) => [base[0] + (base[0] - x) * 0.25, y]), bandR = right.slice().reverse();
      s += `<path d="${p2([...band, ...right])}" fill="${mix(col, '#3a1e1c', 0.4)}"/><path d="${p2([...band, ...right])}" fill="${S.hatchA(Z)}" opacity="0.45"/>`;
      s += `<path d="${p2(shaft.map(([x, y]) => [x + rpx * 0.35, y]).concat(shaft.map(([x, y]) => [x + rpx * 0.5, y]).reverse()))}" fill="#fff6f0" opacity="0.25"/>`;
      // flutes
      for (let j = 1; j < 8; j++) { const u = j / 8 * 2 - 1, xx = base[0] + Math.sin(u * Math.PI / 2) * rpx * 0.92, xt = top[0] + Math.sin(u * Math.PI / 2) * rpx * 0.8; s += `<path d="M${f1(xx)} ${f1(base[1] - rpx * 0.5)} L${f1(xt)} ${f1(top[1] + rpx * 0.3)}" stroke="${mix(col, INK, 0.45)}" stroke-width="${f1(Math.max(0.4, k * 0.012))}" opacity="${f1(0.35 + Math.max(0, u) * 0.3)}"/>`; }
      s += `<path d="${p2(poly)}" fill="none" stroke="${INK}" stroke-width="${f1(S.inkW(Z))}"/>`;
      // the base: two tori and a plinth
      s += cel([[base[0] - rpx * 1.45, base[1]], [base[0] + rpx * 1.45, base[1]], [base[0] + rpx * 1.45, base[1] - rpx * 0.4], [base[0] - rpx * 1.45, base[1] - rpx * 0.4]], { Z, fill: tone(col, 0.1), tex: 'url(#mottle)', texOp: 0.25 });
      s += cel(ell([base[0], base[1] - rpx * 0.6], rpx * 1.3, rpx * 0.26, 0, 14), { Z, fill: tone(col, 0.1) }) + cel(ell([base[0], base[1] - rpx * 0.95], rpx * 1.12, rpx * 0.2, 0, 14), { Z, fill: tone(col, 0.1) });
      // the capital: echinus, two volutes, abacus
      const cy = top[1];
      s += cel([[top[0] - rpx * 1.5, cy - rpx * 0.55], [top[0] + rpx * 1.5, cy - rpx * 0.55], [top[0] + rpx * 1.5, cy - rpx * 0.8], [top[0] - rpx * 1.5, cy - rpx * 0.8]], { Z, fill: tone(col, 0.1) });
      s += cel([[top[0] - rpx * 1.3, cy - rpx * 0.55], [top[0] + rpx * 1.3, cy - rpx * 0.55], [top[0] + rpx * 0.9, cy], [top[0] - rpx * 0.9, cy]], { Z, fill: tone(col, 0.1) });
      for (const sg of [-1, 1]) { const vx = top[0] + sg * rpx * 1.25, vy = cy - rpx * 0.25; s += `<circle cx="${f1(vx)}" cy="${f1(vy)}" r="${f1(rpx * 0.4)}" fill="${col}" stroke="${INK}" stroke-width="${f1(S.inkW(Z) * 0.9)}"/><path d="M${f1(vx)} ${f1(vy)} m${f1(-rpx * 0.25)} 0 a${f1(rpx * 0.25)} ${f1(rpx * 0.25)} 0 1 1 ${f1(rpx * 0.3)} ${f1(rpx * 0.12)} a${f1(rpx * 0.14)} ${f1(rpx * 0.14)} 0 1 1 ${f1(-rpx * 0.12)} ${f1(-rpx * 0.12)}" stroke="${INK}" stroke-width="0.6" fill="none"/>`; }
      // the cooked tide line at the old water height (boiled red-brown), white scale crust below it, peeling skin of the marble
      if (o.tide !== undefined) { const ty = P(X, o.tide, Z)[1]; s += `<path d="M${f1(base[0] - rpx * 0.95)} ${f1(ty)} Q${f1(base[0])} ${f1(ty + 3)} ${f1(base[0] + rpx * 0.95)} ${f1(ty)}" stroke="${BOIL}" stroke-width="${f1(Math.max(1, k * 0.06))}" fill="none" opacity="0.55"/>`;
        s += `<path d="${p2([[base[0] - rpx * 0.95, ty + 2], [base[0] + rpx * 0.95, ty + 2], [base[0] + rpx * 1.0, base[1] - rpx * 1.1], [base[0] - rpx * 1.0, base[1] - rpx * 1.1]])}" fill="${SCALE}" opacity="0.25"/>`; }
      if (o.peel) { const py = top[1] + (base[1] - top[1]) * o.peel; s += `<path d="M${f1(base[0] - rpx * 0.7)} ${f1(py)} q${f1(rpx * 0.4)} ${f1(-rpx * 0.3)} ${f1(rpx * 0.8)} 0 l${f1(-rpx * 0.1)} ${f1(rpx * 0.9)} q${f1(-rpx * 0.4)} ${f1(rpx * 0.2)} ${f1(-rpx * 0.6)} ${f1(-rpx * 0.1)} Z" fill="${mix(col, '#7a5a5a', 0.4)}" stroke="${INK}" stroke-width="0.6"/><path d="M${f1(base[0] + rpx * 0.1)} ${f1(py)} q${f1(rpx * 0.3)} ${f1(rpx * 0.2)} ${f1(rpx * 0.15)} ${f1(rpx * 0.6)}" stroke="${INK}" stroke-width="0.7" fill="${mix(col, '#fff', 0.3)}"/>`; }
      return s;
    }
    // a clay votive hung on a cord from a nail: a leg, an arm, a hand, a foot or a swaddled baby, terracotta, some cracked
    function votive(x, y, s, kind, o = {}) {
      const col = tone(o.col || CLAY, 0.2); let out = `<path d="M${f1(x)} ${f1(y - s * 0.5)} L${f1(x)} ${f1(y)}" stroke="${INK}" stroke-width="0.5"/><circle cx="${f1(x)}" cy="${f1(y - s * 0.5)}" r="0.7" fill="${INK}"/>`;
      let shape;
      if (kind === 'leg') shape = [[x - s * 0.18, y], [x + s * 0.18, y], [x + s * 0.14, y + s * 0.9], [x + s * 0.12, y + s * 1.7], [x + s * 0.5, y + s * 1.85], [x + s * 0.5, y + s * 2.0], [x - s * 0.12, y + s * 2.0], [x - s * 0.15, y + s * 0.9]];
      else if (kind === 'arm') shape = [[x - s * 0.15, y], [x + s * 0.15, y], [x + s * 0.12, y + s * 1.3], [x + s * 0.25, y + s * 1.55], [x + s * 0.05, y + s * 1.8], [x - s * 0.2, y + s * 1.6], [x - s * 0.13, y + s * 1.3]];
      else if (kind === 'hand') shape = [[x - s * 0.22, y], [x + s * 0.22, y], [x + s * 0.28, y + s * 0.5], [x + s * 0.2, y + s * 0.95], [x + s * 0.05, y + s * 1.0], [x - s * 0.12, y + s * 0.95], [x - s * 0.28, y + s * 0.55]];
      else if (kind === 'foot') shape = [[x - s * 0.15, y], [x + s * 0.12, y], [x + s * 0.14, y + s * 0.5], [x + s * 0.55, y + s * 0.62], [x + s * 0.55, y + s * 0.8], [x - s * 0.18, y + s * 0.8]];
      else shape = [[x, y], [x + s * 0.25, y + s * 0.2], [x + s * 0.28, y + s * 0.9], [x + s * 0.15, y + s * 1.25], [x - s * 0.15, y + s * 1.25], [x - s * 0.28, y + s * 0.9], [x - s * 0.25, y + s * 0.2]];
      out += cel(shape, { Z: o.Z || 20, fill: col, band: Math.max(0.6, s * 0.12), inkW: 0.6 });
      if (kind === 'hand') for (let j = 0; j < 3; j++) out += `<path d="M${f1(x - s * 0.1 + j * s * 0.1)} ${f1(y + s * 0.6)} l0 ${f1(s * 0.32)}" stroke="${INK}" stroke-width="0.4"/>`;
      if (kind === 'baby') for (let j = 0; j < 3; j++) out += `<path d="M${f1(x - s * 0.25)} ${f1(y + s * (0.45 + j * 0.22))} l${f1(s * 0.5)} ${f1(s * 0.08)}" stroke="${INK}" stroke-width="0.4"/>`;
      if (R() < 0.35) out += `<path d="M${f1(x - s * 0.1)} ${f1(y + s * 0.3)} l${f1(s * 0.12)} ${f1(s * 0.25)} l${f1(-s * 0.06)} ${f1(s * 0.3)}" stroke="${INK}" stroke-width="0.6" fill="none"/>`;
      return out;
    }
    // a copper pipe along screen points, cooked red-brown, with rivet bands; o.rags at fractions: rag bandages weeping steam
    function pipe(pts, w, o = {}) {
      let s = line(pts, w + 2, INK, 1) + line(pts, w, o.col || COPPER, 1) + line(pts.map(([x, y]) => [x - w * 0.15, y - w * 0.22]), Math.max(0.6, w * 0.25), '#d89070', 0.55) + line(pts.map(([x, y]) => [x + w * 0.1, y + w * 0.25]), Math.max(0.6, w * 0.3), '#3a1a10', 0.5);
      for (const u of o.rags || []) { const i = Math.min(pts.length - 2, Math.floor(u * (pts.length - 1))), A = pts[i], B = pts[i + 1], x = A[0] + (B[0] - A[0]) * 0.5, y = A[1] + (B[1] - A[1]) * 0.5;
        s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w * 1.1)}" ry="${f1(w * 0.85)}" fill="#c8b8a0" stroke="${INK}" stroke-width="0.7"/><path d="M${f1(x - w * 0.6)} ${f1(y - w * 0.5)} l${f1(w * 0.4)} ${f1(w)} M${f1(x)} ${f1(y - w * 0.7)} l${f1(w * 0.4)} ${f1(w * 1.2)}" stroke="${INK}" stroke-width="0.5" opacity="0.7"/><path d="M${f1(x)} ${f1(y + w * 0.8)} l0 ${f1(w * 2 + R() * w * 2)}" stroke="${SCALE}" stroke-width="${f1(w * 0.4)}" opacity="0.6" stroke-linecap="round"/>` + BK.steam(x + w * 0.5, y - w, w * 7, w * 2.2, { n: 4, op: 0.22, drift: 0.3 }); }
      return s;
    }
    return { MARB, MARBD, STEAM, BOIL, COPPER, BRONZE, GILT, SCALE, CLAY, HOT, marble, column, votive, pipe };
  };

  // ================================================================ polish round (2026-11-24): atmosphere, organic trees, scale cues
  // smooth sky: a vertical linear gradient (skies, fog and glows only may use gradients)
  function sky(stops, o = {}) { const g = id('sk'); S.DEFS.push(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">${stops.map(([t, c]) => `<stop offset="${t}" stop-color="${c}"/>`).join('')}</linearGradient>`);
    return `<rect x="-20" y="${o.y0 ?? -20}" width="${W + 40}" height="${(o.y1 ?? H + 20) - (o.y0 ?? -20)}" fill="url(#${g})"/>`; }
  const RG = {}; const soft = col => { if (!RG[col]) { RG[col] = id('sf'); S.DEFS.push(`<radialGradient id="${RG[col]}"><stop offset="0" stop-color="${col}" stop-opacity="1"/><stop offset="0.45" stop-color="${col}" stop-opacity="0.6"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`); } return `url(#${RG[col]})`; };
  // soft steam (same call as battle_li steam): soft-edged lobes of varied size with gradient falloff, rising and spreading,
  // a few thin wisps breaking off; no ink rings
  function softSteam(x, y, h, w, o = {}) {
    const col = o.col || '#ece6e0', n = Math.max(4, o.n || 7), op = Math.min(0.9, (o.op ?? 0.16) * 2.2); let s = '';
    for (let i = 0; i < n; i++) { const u = i / (n - 1), cx = x + Math.sin(u * 3 + R() * 2) * w * 0.3 + (o.drift || 0) * u * h, cy = y - u * h, r = w * (0.4 + u * 0.8) * (0.6 + R() * 0.8);
      s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r * (1 + R() * 0.5))}" ry="${f1(r * (0.55 + R() * 0.3))}" fill="${soft(col)}" opacity="${f1(op * (1 - u * 0.55) * (0.6 + R() * 0.5))}"/>`; }
    for (let k = 0; k < 2 + Math.floor(R() * 2); k++) { const u = 0.4 + R() * 0.5, cx = x + (o.drift || 0) * u * h, cy = y - u * h, l = w * (1 + R() * 1.5), sd = R() < 0.5 ? -1 : 1;
      s += `<path d="M${f1(cx)} ${f1(cy)} q${f1(sd * l * 0.5)} ${f1(-l * 0.25)} ${f1(sd * l)} ${f1(-l * 0.1 - R() * l * 0.3)}" stroke="${col}" stroke-width="${f1(Math.max(1, w * 0.12))}" fill="none" stroke-linecap="round" opacity="${f1(op * 0.35)}"/>`; }
    return S.GLOW(s);
  }
  // soft bank of mist or smoke lying along a screen band (same call as battle_li bank): overlapping soft ellipses + a faint
  // gradient band; an uneven top where wisps lift
  function softBank(x0, x1, y, h, o = {}) {
    const col = o.col || '#c8ccc0', op = Math.min(0.9, (o.op ?? 0.18) * 1.6); let s = '';
    const g = id('sb'); S.DEFS.push(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset="0.5" stop-color="${col}" stop-opacity="${f1(op * 0.6)}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>`);
    s += `<rect x="${f1(x0)}" y="${f1(y - h)}" width="${f1(x1 - x0)}" height="${f1(h * 2 + (o.below ?? h * 0.4))}" fill="url(#${g})"/>`;
    for (let x = x0; x < x1; x += h * (1.2 + R() * 1.6)) { const r = h * (0.8 + R() * 1.4); s += `<ellipse cx="${f1(x)}" cy="${f1(y - r * 0.2 + (R() - 0.5) * h * 0.3)}" rx="${f1(r * (1.6 + R()))}" ry="${f1(r * 0.5)}" fill="${soft(col)}" opacity="${f1(op * (0.4 + R() * 0.5))}"/>`; }
    return S.GLOW(s);
  }
  // a soft cloud mass: a cluster of soft lobes, flatter at the base, a soft lit rim toward the upper left, a darker belly
  function softCloud(cx, cy, w, h, col, o = {}) {
    // form, not smears: a flat dark underside, a body of round lobes domed toward the middle (taller lobes sit higher),
    // light caps on the upper-left of the high lobes; every edge a gradient falloff
    let s = ''; const n = o.n || 14, lit = o.lit || mix(col, '#ffffff', 0.3), dark = o.dark || mix(col, '#000000', 0.35), op = o.op ?? 0.85;
    for (let i = 0; i < 4; i++) { const x = cx + (R() - 0.5) * w * 0.6; s += `<ellipse cx="${f1(x)}" cy="${f1(cy + h * 0.05)}" rx="${f1(w * (0.22 + R() * 0.12))}" ry="${f1(h * 0.28)}" fill="${soft(dark)}" opacity="${f1(op * 0.8)}"/>`; }
    const lobes = []; for (let i = 0; i < n; i++) { const u = (i + R() * 0.8) / n, dome = Math.pow(Math.sin(u * Math.PI), 0.7) * (0.6 + R() * 0.5), r = h * (0.3 + 0.6 * dome) * (0.8 + R() * 0.4); lobes.push([cx + (u - 0.5) * w * 0.9, cy - r * 0.55 - dome * h * 0.25, r, dome]); }
    for (const [x, y, r] of lobes) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.3)}" ry="${f1(r)}" fill="${soft(col)}" opacity="${f1(op)}"/>`;
    for (const [x, y, r, d] of lobes) if (d > 0.45) s += `<ellipse cx="${f1(x - r * 0.25)}" cy="${f1(y - r * 0.35)}" rx="${f1(r * 0.75)}" ry="${f1(r * 0.5)}" fill="${soft(lit)}" opacity="${f1(op * 0.75)}"/>`;
    for (let i = 0; i < 3; i++) { const x = cx + (R() - 0.5) * w * 0.7; s += `<ellipse cx="${f1(x)}" cy="${f1(cy + h * 0.12)}" rx="${f1(w * 0.18)}" ry="${f1(h * 0.12)}" fill="${soft(dark)}" opacity="${f1(op * 0.55)}"/>`; }
    return S.GLOW(s);
  }
  const stars = (n, y0, y1, col = '#e8ecd8') => { let s = ''; for (let i = 0; i < n; i++) { const r = R() < 0.9 ? 0.5 + R() * 0.5 : 1 + R() * 0.6; s += `<circle cx="${f1(R() * W)}" cy="${f1(y0 + Math.pow(R(), 1.3) * (y1 - y0))}" r="${f1(r)}" fill="${col}" opacity="${f1(0.3 + R() * 0.6)}"/>`; } return s; };
  // a tapered smooth limb along screen points: both edges offset from a smoothed centreline, width w0 at the base to w1
  function limb(pts, w0, w1, col, o = {}) {
    if (pts.length < 2) return ''; const L = [], Rr = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, u = i / (pts.length - 1), w = (w0 + (w1 - w0) * Math.pow(u, 0.8)) / 2; L.push([pts[i][0] - dy / l * w, pts[i][1] + dx / l * w]); Rr.push([pts[i][0] + dy / l * w, pts[i][1] - dx / l * w]); }
    const d = smooth([...L, ...Rr.reverse()], true, 0.5);
    let s = `<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, Math.min(1.6, w0 * 0.12)))}" stroke-linejoin="round"/>`;
    if (w0 > 3 && o.lit !== false) s += `<path d="${smooth(L.slice(0, Math.ceil(L.length * 0.8)), false, 0.5)}" stroke="${o.litCol || mix(col, '#fff3d8', 0.3)}" stroke-width="${f1(Math.max(0.6, w0 * 0.12))}" fill="none" opacity="0.5"/>`;
    if (w0 > 5 && o.hatch !== false) s += `<path d="${smooth(Rr.slice(Math.floor(Rr.length * 0.2)), false, 0.5)}" stroke="${INK}" stroke-width="${f1(w0 * 0.22)}" fill="none" opacity="0.35"/>`;
    return s;
  }
  // an organic tree in world metres at depth Z: trunk from (X, Y0) up, limbs leaving at different heights, each bending
  // smoothly (small turn per step), tapering, thinning into twigs; root flare into the ground; o.lean, o.stems, o.spread
  // returns { svg, segs } where segs are the centrelines (screen) for reflections
  // polish (materials v2): drawn by MV.tree (organic skeleton, bark, root flare into a ground lip); the old skeleton
  // grower stays as otreeOld. o.kind: alder (default) | birch | dead | oak ...; returns { svg, segs } for reflections
  function otree(X, Y0, Z, h, o = {}) {
    const MV = require('./materials_v2')(S), [x, y] = P(X, Y0, Z), k = K(Z);
    const t = MV.tree(x, y, h * k, Z, { kind: o.kind || 'alder', col: o.col, lean: o.lean, seed: Math.round(X * 97 + Z * 13 + h * 7) + 1, ground: o.roots === false ? false : undefined, tw: o.w ? o.w * k : undefined, ...(o.mv || {}) });
    return { svg: t.svg, segs: (t.limbs || []).map(([pts, w0]) => [pts, w0, Math.max(0.5, w0 * 0.2)]) };
  }
  function otreeOld(X, Y0, Z, h, o = {}) {
    const branches = [], k = K(Z);
    const grow = (x, y, a, len, w, d) => { const n = 12, pts = [[x, y]]; let cx = x, cy = y, turn = (R() - 0.5) * 0.25 * (o.gnarl ?? 1), ph = R() * 6;
      for (let i = 1; i <= n; i++) { turn = Math.max(-0.3, Math.min(0.3, turn + (R() - 0.5) * 0.2 * (o.gnarl ?? 1))) + Math.sin(i * 0.9 + ph) * 0.03 * (o.gnarl ?? 1); a += turn * 0.45 + (o.up ?? 0.05) * Math.sign(Math.PI / 2 - a) * 0.5; cx += Math.cos(a) * len / n; cy += Math.sin(a) * len / n; pts.push([cx, cy]);
        if (d > 0 && i >= 3 && i < n - 1 && R() < (o.fork ?? 0.32)) { const t = i / n; grow(cx, cy, a + (R() < 0.5 ? -1 : 1) * (0.45 + R() * 0.55), len * (0.38 + R() * 0.3) * (1 - t * 0.4), w * (1 - t * 0.7) * 0.55, d - 1); } }
      branches.push([pts, w, Math.max(0.012, w * 0.12)]); };
    const stems = o.stems || 1;
    for (let sI = 0; sI < stems; sI++) grow(X + (sI - (stems - 1) / 2) * 0.18, Y0, Math.PI / 2 + (o.lean ?? (R() - 0.5) * 0.3) + (sI - (stems - 1) / 2) * 0.22, h * (0.8 + R() * 0.3), o.w || 0.34, o.depth ?? 3);
    branches.sort((a, b) => a[1] - b[1]);
    let s = '';
    // root flare: a few curved roots spreading into the ground at the foot
    if (o.roots !== false) for (let r2 = 0; r2 < 4; r2++) { const sd = r2 < 2 ? -1 : 1, l = (o.w || 0.34) * (1.2 + R() * 1.5); s += limb([P(X + sd * 0.05, Y0 + 0.25, Z), P(X + sd * l * 0.4, Y0 + 0.06, Z - 0.05), P(X + sd * l, Y0, Z - 0.1 + (R() - 0.5) * 0.2)].map(p => p), k * (o.w || 0.34) * 0.5, k * 0.02, o.col || '#2a2218', { hatch: false }); }
    const segs = [];
    for (const [pts, w0, w1] of branches.reverse()) { const ps = pts.map(([x, y]) => P(x, y, Z)); segs.push([ps, w0 * k, w1 * k]); s += limb(ps, Math.max(1, w0 * k), Math.max(0.5, w1 * k), o.col || '#2a2218', o); }
    return { svg: s, segs };
  }
  // reflections of a tree's limbs in still water whose surface is at screen y yw: mirrored, broken, darker
  const reflect = (segs, yw, col, op = 0.6) => { let s = ''; for (const [ps, w0, w1] of segs) { const rp = ps.map(([x, y]) => [x + (R() - 0.5) * 1.5, 2 * yw - y]); s += `<path d="${smooth(rp, false, 0.5)}" stroke="${col}" stroke-width="${f1(Math.max(0.8, (w0 + w1) / 2))}" fill="none" opacity="${op}" stroke-dasharray="${f1(5 + R() * 9)} ${f1(1 + R() * 2)}" stroke-linecap="round"/>`; } return s; };
  // scale cues near the fighters: a cask on its side or standing, staves and hoops (1.0 m tall)
  function barrel(X, Z, o = {}) {
    const Y = o.Y || 0, h = 0.95, r = 0.33, k = K(Z), c = P(X, Y, Z), col = o.col || '#4a3624', hoop = o.hoop || '#2a2a2a';
    if (o.side) { const L = k * h, R2 = k * r, pts = [[c[0] - L / 2, c[1]], [c[0] - L / 2, c[1] - R2 * 2], [c[0] + L / 2, c[1] - R2 * 2], [c[0] + L / 2, c[1]]];
      let s = cel([[c[0] - L / 2, c[1] - R2 * 0.1], [c[0] - L / 2 + R2 * 0.2, c[1] - R2 * 1.95], [c[0] + L / 2 - R2 * 0.2, c[1] - R2 * 1.95], [c[0] + L / 2, c[1] - R2 * 0.1]], { Z, fill: col, band: R2 * 0.5, tex: 'url(#mottle)', texOp: 0.5 });
      for (const u of [0.12, 0.3, 0.7, 0.88]) s += `<path d="M${f1(c[0] - L / 2 + L * u)} ${f1(c[1] - R2 * 1.98)} Q${f1(c[0] - L / 2 + L * u + 1)} ${f1(c[1] - R2)} ${f1(c[0] - L / 2 + L * u)} ${f1(c[1])}" stroke="${hoop}" stroke-width="${f1(Math.max(1, k * 0.03))}" fill="none"/>`;
      for (let j = 1; j < 4; j++) s += `<path d="M${f1(c[0] - L / 2)} ${f1(c[1] - R2 * 2 * j / 4)} L${f1(c[0] + L / 2)} ${f1(c[1] - R2 * 2 * j / 4)}" stroke="${INK}" stroke-width="0.5" opacity="0.5"/>`;
      s += `<ellipse cx="${f1(c[0] + L / 2)}" cy="${f1(c[1] - R2)}" rx="${f1(R2 * 0.35)}" ry="${f1(R2)}" fill="${mix(col, '#c8b090', 0.2)}" stroke="${INK}" stroke-width="1"/>`;
      return s + (o.extra || ''); }
    const w = k * r * 2, hh = k * h; let s = cel([[c[0] - w * 0.45, c[1]], [c[0] + w * 0.45, c[1]], [c[0] + w * 0.5, c[1] - hh * 0.5], [c[0] + w * 0.45, c[1] - hh], [c[0] - w * 0.45, c[1] - hh], [c[0] - w * 0.5, c[1] - hh * 0.5]], { Z, fill: col, band: w * 0.25, tex: 'url(#mottle)', texOp: 0.5 });
    for (const u of [0.1, 0.32, 0.68, 0.9]) s += `<path d="M${f1(c[0] - w * 0.48)} ${f1(c[1] - hh * u)} Q${f1(c[0])} ${f1(c[1] - hh * u + 2)} ${f1(c[0] + w * 0.48)} ${f1(c[1] - hh * u)}" stroke="${hoop}" stroke-width="${f1(Math.max(1, k * 0.03))}" fill="none"/>`;
    for (let j = 1; j < 5; j++) s += `<path d="M${f1(c[0] - w * 0.45 + w * 0.9 * j / 5)} ${f1(c[1])} L${f1(c[0] - w * 0.45 + w * 0.9 * j / 5)} ${f1(c[1] - hh)}" stroke="${INK}" stroke-width="0.5" opacity="0.45"/>`;
    return s + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - hh)}" rx="${f1(w * 0.45)}" ry="${f1(w * 0.1)}" fill="${mix(col, '#c8b090', 0.15)}" stroke="${INK}" stroke-width="1"/>` + (o.extra || '');
  }

  // convex solids in the camera: faces [{ pts: [[X,Y,Z]...], col, deco(ps, n) }] culled against the eye, shaded by the key
  // light (lit faces clean, faces turned away hatched), drawn far to near. o.fog(col, Z) recedes them.
  function solid(faces, o = {}) {
    const all = faces.flatMap(f => f.pts), c = all.reduce((a, p) => [a[0] + p[0] / all.length, a[1] + p[1] / all.length, a[2] + p[2] / all.length], [0, 0, 0]);
    const eye = [0, S.EYE, 0], out = [];
    for (const f of faces) { const q = f.pts; let n = [0, 0, 0]; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]); }
      const l = Math.hypot(...n) || 1; n = n.map(v => v / l); const p0 = q[0], fc = q.reduce((a, p) => [a[0] + p[0] / q.length, a[1] + p[1] / q.length, a[2] + p[2] / q.length], [0, 0, 0]);
      if ((fc[0] - c[0]) * n[0] + (fc[1] - c[1]) * n[1] + (fc[2] - c[2]) * n[2] < 0) n = n.map(v => -v);
      if (n[0] * (eye[0] - p0[0]) + n[1] * (eye[1] - p0[1]) + n[2] * (eye[2] - p0[2]) <= 0.001) continue;
      out.push([Math.hypot(fc[0], fc[1] - S.EYE, fc[2]), f, n, fc]); }
    out.sort((a, b) => b[0] - a[0]); let svg = '';
    for (const [, f, n, fc] of out) { const ps = f.pts.map(p => P(...p)), Z = fc[2], lm = S.lam(n), fog = o.fog || (x => x);
      let col = f.col; col = lm > 0.25 ? mix(col, S.KEY, Math.min(0.25, (lm - 0.25) * 0.4)) : lm < 0.05 ? mix(col, S.SHT, 0.3) : col;
      svg += cel(ps, { Z, fill: fog(col, Z), tex: f.tex === false ? undefined : 'url(#mottle)', texOp: 0.4, band: Math.max(0.6, K(Z) * 0.03), inkW: Math.max(0.5, inkW(Z) * 0.8), hi: lm > 0.25 });
      if (lm < 0.05) svg += `<path d="${p2(ps)}" fill="${hatchA(Z)}" opacity="0.45"/>` + (lm < -0.2 ? `<path d="${p2(ps)}" fill="${hatchB(Z)}" opacity="0.35"/>` : '');
      if (o.stone && !f.roof) svg += require('./materials_v2')(S).stoneMarks(ps, Z, fog(col, Z), { wy0: Math.min(...f.pts.map(p => p[1])) });
      if (f.deco) svg += f.deco(ps, n, Z); }
    return svg;
  }
  const box = (x0, x1, y0, y1, z0, z1, col, deco = {}) => [
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col, deco: deco.front }, { pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col },
    { pts: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], col, deco: deco.left }, { pts: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], col, deco: deco.right },
    { pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], col: deco.topCol || col }, { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col }];

  return { solid, box, sky, softSteam, softBank, softCloud, stars, limb, otree, reflect, barrel, III, II, fogger, inPoly, bands, shaft, edges, arch, holedWall, ring, soffit, flags, puddle, rubble, rockMass, hang, line, polyS, I };
};
