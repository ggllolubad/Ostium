// Living Ink battle-room kit: helpers shared by the world battle rooms (bg_<world>_<room>.js). Opt-in, built on lik.js;
// nothing in lik.js changes (the hub rooms render exactly as before).
//   tornVoid   the void's absence (worlds I, XII-XV): an irregular, clean-rimmed hole with a torn, uneven outline that
//              cuts straight across stones and courses, tongues that run out along the beds and thin to a point, then
//              into detached slivers and hairline fissures that end in nothing. No circles, no glow, no cracks.
//   rain       storm rain: thin slanted strokes in sheets, denser in bands (Storm worlds V, VI). Never a bolt.
//   scorch     a branching (Lichtenberg) burn scarred INTO a surface plane, clipped to that surface. Never in the air.
//   icicle, rime, fungus, shelf, toadstool, sulphur, steam, ripples, rock: course marks and materials.
//   quiet      the fighters' band on the far layer: stepped, ragged-edged darkening toward the murk (no gradient).
// Every function takes plane maps at(s,t) -> [X,Y,Z] in metres, like lik.js, so marks follow the room's perspective.
'use strict';
const E = require('../engine');
const { ell } = E;

module.exports = S => {
  const { P, K, R, f1, INK, p2, pp, cel, chip, hatch3, hatchA, hatchB, mix, smooth, id, inkW, KEY } = S;
  const line = (pts, w, col, op = 1, extra = '') => `<path d="${smooth(pts, false, 0.6)}" stroke="${col}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"${extra}/>`;
  const polyS = pts => 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';

  // ------------------------------------------------------------------------------------------------ the void's absence
  // at(s,t): the plane; cs,ct: centre (m); rw,rh: half extents (m); o.rot: tilt. o.lobes: [[angle, extra m, half-width rad]]
  // (angles in the plane, 0 = +s, pi/2 = +t); o.fray: [[angle, pieces, spread m]] where the edge breaks up into nothing;
  // o.depth (m) and o.dir: the cut through the thickness; o.cut: the cut face's colour; o.islands: [[s,t,size]] stone left
  // standing inside the hole; o.fissures: count of hairlines along the beds.
  function tornVoid(at, cs, ct, rw, rh, o = {}) {
    // outline: r(theta) from low-frequency noise plus broad bent lobes (o.lobes: [[angle, extra length m, half-width rad]]),
    // sampled at irregular angles with straight segments; a few sharp V notches. Asymmetric, never a star, never a circle.
    const ph = [R() * 6.28, R() * 6.28, R() * 6.28], rot = o.rot ?? (R() - 0.5) * 0.6;
    const lobes = o.lobes || [];
    const rOf = th => { let r = 1 + 0.2 * Math.sin(th + ph[0]) + 0.13 * Math.sin(2 * th + ph[1]) + 0.07 * Math.sin(3 * th + ph[2]); let ex = 0;
      for (const [a, L, hw] of lobes) { const d = Math.abs(((th - a + 9.4248) % 6.2832) - 3.1416); if (d < hw) ex = Math.max(ex, L * Math.pow(1 - d / hw, 1.3)); } return [r, ex]; };
    const pt = (th, r, ex) => { const x = Math.cos(th) * (rw * r + ex), y = Math.sin(th) * (rh * r + ex); return [cs + x * Math.cos(rot) - y * Math.sin(rot), ct + x * Math.sin(rot) + y * Math.cos(rot)]; };
    const outline = []; let th = R() * 0.3; const N = o.n || 40;
    while (th < Math.PI * 2 - 0.05) {
      const [r, ex] = rOf(th); outline.push(pt(th, r * (0.95 + R() * 0.1), ex));
      if (R() < (o.notch ?? 0.16) && ex < 0.05) { const t2 = th + 0.04 + R() * 0.04; const [r2] = rOf(t2); outline.push(pt(t2, r2 * (0.72 + R() * 0.12), 0)); }
      th += (Math.PI * 2 / N) * (0.45 + R() * 1.1);
    }
    const front = outline.map(q => at(q[0], q[1])), Fs = front.map(p => P(...p)), dz = o.depth ?? 0.5, dir = o.dir || [0, 0, 1];
    const Bs = front.map(p => P(p[0] + dir[0] * dz, p[1] + dir[1] * dz, p[2] + dir[2] * dz)), Z = front[0][2];
    const fd = polyS(Fs), bd = polyS(Bs), VOID = o.voidCol || '#020304', inkV = Math.max(0.9, inkW(Z) * 1.3);
    let out = '';
    // the cut through the thickness: the faces seen inside the rim, in shadow, with the coursing carried across them
    const cid = id('tv');
    out += `<path d="${fd}" fill="${o.cut || '#3a4444'}"/><clipPath id="${cid}"><path d="${fd}"/></clipPath><g clip-path="url(#${cid})">`;
    for (let i = 0; i < Fs.length; i += 2) out += `<path d="M${f1(Fs[i][0])} ${f1(Fs[i][1])} L${f1(Bs[i][0])} ${f1(Bs[i][1])}" stroke="${INK}" stroke-width="0.6" opacity="0.45"/>`;
    out += `<path d="${fd}" fill="${hatchA(Z)}" opacity="0.55"/><path d="${fd}" fill="${hatchB(Z)}" opacity="0.35"/>`;
    out += `<path d="${bd}" fill="${VOID}"/></g>`;
    // stone left standing inside the hole: fragments with nothing holding them, crisp on every side
    for (const [s0, t0, sz] of o.islands || []) {
      const pts = []; const n = 5 + Math.floor(R() * 2); let a0 = R() * 6.28; for (let k = 0; k < n; k++) { const a = a0 + k / n * 6.28 + (R() - 0.5) * 0.5, m = 0.6 + R() * 0.5; pts.push(P(...at(s0 + Math.cos(a) * sz * m, t0 + Math.sin(a) * sz * 0.75 * m))); }
      out += cel(pts, { Z, fill: o.islandCol || mix(o.cut || '#4a5656', '#9aa8a0', 0.3), tex: 'url(#mottle)', texOp: 0.35, band: Math.max(1, K(Z) * 0.04), inkW: inkV * 0.8 });
    }
    // the clean rim: one firm, unbroken ink line with sharp joins; a thin cold lip on the edges facing the light
    out += `<path d="${fd}" fill="none" stroke="${INK}" stroke-width="${f1(inkV)}" stroke-linejoin="miter" stroke-miterlimit="5"/>`;
    { let lip = ''; for (let i = 0; i < Fs.length; i++) { const A = Fs[i], B = Fs[(i + 1) % Fs.length], nx = (B[1] - A[1]), ny = -(B[0] - A[0]), l = Math.hypot(nx, ny) || 1; if ((nx / l) * 0.6 + (ny / l) * 0.8 > 0.35) lip += `M${f1(A[0] + nx / l * 1.2)} ${f1(A[1] + ny / l * 1.2)} L${f1(B[0] + nx / l * 1.2)} ${f1(B[1] + ny / l * 1.2)} `; }
      out += `<path d="${lip}" stroke="${o.lip || '#c8d0c8'}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.5))}" fill="none" opacity="0.35"/>`; }
    if (o.violet) out += `<path d="${bd}" fill="none" stroke="#5a4278" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.55))}" opacity="0.4" stroke-linejoin="miter"/>`;
    // the edge thinning into nothing (o.fray: [[angle, pieces, spread]]): off the rim at that angle the absence breaks up into
    // detached angular pieces, each smaller and farther apart than the last, drifting a little, until nothing is left
    const piece = (s, t, sz, asp) => { const n = 4 + Math.floor(R() * 3), a0 = R() * 6.28, q = []; for (let k = 0; k < n; k++) { const a = a0 + k / n * 6.28 + (R() - 0.5) * 0.6, m = 0.55 + R() * 0.55; q.push(P(...at(s + Math.cos(a) * sz * m, t + Math.sin(a) * sz * asp * m))); }
      return `<path d="${polyS(q)}" fill="${VOID}" stroke="${INK}" stroke-width="${f1(Math.max(0.45, inkV * 0.6))}" stroke-linejoin="miter"/>`; };
    for (const [a, n, spread] of o.fray || []) {
      const [r, ex] = rOf(a - rot), edge = pt(a - rot, r, ex), dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
      let d = Math.min(rw, rh) * 0.1, sz = Math.min(rw, rh) * (o.fraySize ?? 0.42);
      for (let k = 0; k < n; k++) {
        const side = (R() - 0.5) * (spread || 0.4) * (1 + k * 0.4);
        out += piece(edge[0] + dx * d + nx * side, edge[1] + dy * d + ny * side, sz, 0.6 + R() * 0.5);
        if (R() < 0.5 && k < n - 1) out += piece(edge[0] + dx * (d + sz * 0.6) - nx * side * 1.3, edge[1] + dy * (d + sz * 0.6) - ny * side * 1.3, sz * 0.45, 0.7);
        d += sz * (1.5 + R() * 0.7) + 0.04 * k; sz *= 0.62;
      }
      const A = P(...at(edge[0] + dx * d, edge[1] + dy * d)), B = P(...at(edge[0] + dx * (d + sz * 4), edge[1] + dy * (d + sz * 4)));
      out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${VOID}" stroke-width="0.5" opacity="0.6" stroke-dasharray="2 2.5 1 3"/>`;
    }
    // hairline fissures: the absence creeping a short way along a bed or a joint from the rim, tapering to nothing (no lit lip)
    for (let k = 0; k < (o.fissures ?? 3); k++) {
      const q = outline[Math.floor(R() * outline.length)], horiz = R() < 0.7, sg = horiz ? Math.sign(q[0] - cs) || 1 : Math.sign(q[1] - ct) || 1, L = (o.fissLen || 0.5) * (0.5 + R() * 0.8), pts = [], w0 = o.fissW || 0.025;
      let s = q[0], t = q[1];
      for (let j = 0; j <= 5; j++) { pts.push([s, t]); if (horiz) { s += sg * L / 5; t += (R() - 0.5) * 0.02; } else { t += sg * L / 5; s += (R() - 0.5) * 0.02; } }
      const up = [], dn = []; pts.forEach(([ss, tt], j) => { const w = w0 * Math.pow(1 - j / 5, 1.2); up.push(P(...at(ss + (horiz ? 0 : w), tt + (horiz ? w : 0)))); dn.push(P(...at(ss - (horiz ? 0 : w), tt - (horiz ? w : 0)))); });
      out += `<path d="${polyS([...up, ...dn.reverse()])}" fill="${VOID}"/>`;
    }
    return { svg: out, outline: Fs };
  }

  // ------------------------------------------------------------------------------------------------ storm rain (no bolts)
  // sheets of thin slanted strokes in screen space; o.x0..x1,y0..y1; o.slant (dx per dy); o.col; denser where dens(x,y) is high
  function rain(n, o = {}) {
    const x0 = o.x0 ?? 0, x1 = o.x1 ?? S.W, y0 = o.y0 ?? 0, y1 = o.y1 ?? S.H, sl = o.slant ?? 0.32, col = o.col || '#c8d4d8';
    const buckets = {};
    for (let i = 0; i < n; i++) {
      const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0); if (o.dens && R() > o.dens(x, y)) continue;
      const l = (o.len || 14) * (0.5 + R()), w = f1((o.w || 0.6) * (0.6 + R() * 0.8)), op = f1((o.op || 0.35) * (0.5 + R() * 0.7));
      const k = w + '|' + op; buckets[k] = (buckets[k] || '') + `M${f1(x)} ${f1(y)} l${f1(l * sl)} ${f1(l)} `;
    }
    return Object.entries(buckets).map(([k, d]) => { const [w, op] = k.split('|'); return `<path d="${d}" stroke="${col}" stroke-width="${w}" opacity="${op}" stroke-linecap="round" fill="none"/>`; }).join('');
  }
  // splashes where rain hits a floor: small crowns and rings on the floor plane at(s,t)
  function splashes(at, s0, s1, t0, t1, n, col = '#c8d4d8') {
    let o = '';
    for (let i = 0; i < n; i++) { const s = s0 + R() * (s1 - s0), t = t0 + R() * (t1 - t0), [x, y] = P(...at(s, t)), k = K(at(s, t)[2]), r = Math.max(1, k * (0.04 + R() * 0.05));
      o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.3)}" fill="none" stroke="${col}" stroke-width="0.6" opacity="0.45"/>`;
      if (R() < 0.4) o += `<path d="M${f1(x - r * 0.4)} ${f1(y)} l${f1(-r * 0.2)} ${f1(-r * 0.6)} M${f1(x + r * 0.4)} ${f1(y)} l${f1(r * 0.2)} ${f1(-r * 0.6)} M${f1(x)} ${f1(y - r * 0.1)} l0 ${f1(-r * 0.8)}" stroke="${col}" stroke-width="0.6" opacity="0.5"/>`; }
    return o;
  }

  // ------------------------------------------------------------------------------------------------ lightning's mark on a surface
  // a Lichtenberg burn: a branching fern of scorch laid in the plane at(s,t) from (s0,t0) toward angle ang. Dark char at the
  // trunk with a thin hot core (o.core: colour, or false on cold metal/wood); width falls off fast; branches fork both ways.
  function scorch(at, s0, t0, len, ang, o = {}) {
    const segs = [];
    const go = (s, t, a, l, w, d) => {
      const n = 4 + Math.floor(R() * 3); let cs = s, ct = t;
      for (let i = 0; i < n; i++) {
        a += (R() - 0.5) * 0.9; const ns = cs + Math.cos(a) * l / n, nt = ct + Math.sin(a) * l / n;
        segs.push([cs, ct, ns, nt, w * (1 - i / n * 0.5)]);
        if (d > 0 && R() < 0.55) go(ns, nt, a + (R() < 0.5 ? -1 : 1) * (0.4 + R() * 0.7), l * (0.35 + R() * 0.3), w * 0.55, d - 1);
        cs = ns; ct = nt;
      }
    };
    go(s0, t0, ang, len, o.w || 0.05, o.depth ?? 4);
    const Z = at(s0, t0)[2], kz = K(Z);
    let char = '', hot = '', halo = '';
    for (const [a0, b0, a1, b1, w] of segs) {
      const A = P(...at(a0, b0)), B = P(...at(a1, b1)), px = Math.max(0.35, w * kz);
      halo += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke-width="${f1(px * 3.2)}"/>`;
      char += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke-width="${f1(px)}"/>`;
      if (px > 0.9) hot += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke-width="${f1(px * 0.35)}"/>`;
    }
    let out = `<g stroke="${o.halo || '#1a120c'}" opacity="${o.haloOp ?? 0.22}" stroke-linecap="round" fill="none">${halo}</g><g stroke="${o.col || '#140e0a'}" opacity="${o.op ?? 0.85}" stroke-linecap="round" fill="none">${char}</g>`;
    if (o.core) { const g = `<g stroke="${o.core}" opacity="${o.coreOp ?? 0.7}" stroke-linecap="round" fill="none">${hot}</g>`; out += o.em ? S.EM(g) : g; }
    return out;
  }

  // ------------------------------------------------------------------------------------------------ frost
  // an icicle hanging plumb from a screen point: a tapering, slightly knuckled spike, ink outline, cold lit edge on the left
  function icicle(x, y, len, w, o = {}) {
    const pts = [[x - w / 2, y]], n = 4;
    for (let k = 1; k <= n; k++) { const u = k / n, ww = w / 2 * Math.pow(1 - u, 0.8) * (k % 2 ? 0.85 : 1); pts.push([x - ww + (R() - 0.5) * 0.3, y + len * u * (k === n ? 1 : 1)]); }
    const right = []; for (let k = n - 1; k >= 1; k--) { const u = k / n, ww = w / 2 * Math.pow(1 - u, 0.8) * (k % 2 ? 0.9 : 1); right.push([x + ww, y + len * u]); }
    const poly = [...pts, ...right, [x + w / 2, y]];
    return `<path d="${polyS(poly)}" fill="${o.col || '#c8d8e0'}" stroke="${INK}" stroke-width="${f1(o.ink || 0.6)}" stroke-linejoin="round"/>` +
      `<path d="M${f1(x - w * 0.25)} ${f1(y + 1)} L${f1(x - w * 0.05)} ${f1(y + len * 0.7)}" stroke="#f4faff" stroke-width="${f1(Math.max(0.4, w * 0.15))}" opacity="0.7"/>` +
      `<path d="M${f1(x + w * 0.2)} ${f1(y + 1)} L${f1(x + w * 0.05)} ${f1(y + len * 0.55)}" stroke="${mix(o.col || '#c8d8e0', INK, 0.5)}" stroke-width="${f1(Math.max(0.4, w * 0.18))}" opacity="0.6"/>`;
  }
  // a row of icicles along a screen edge from A to B (lengths vary; o.max length px)
  function icicles(A, B, n, o = {}) { let s = ''; for (let i = 0; i < n; i++) { const u = (i + 0.2 + R() * 0.6) / n, x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u, l = (o.max || 20) * (0.2 + Math.pow(R(), 1.6) * 0.8); s += icicle(x, y - 0.5, l, Math.max(1.2, l * (o.wk || 0.14)), o); } return s; }
  // rime crust on a surface's windward (upper-left) edge: a thick white rind with feathers growing into the wind
  function rimeEdge(pts, o = {}) {
    let s = ''; const w = o.w || 3, col = o.col || '#e4eef2';
    for (let i = 0; i < pts.length - 1; i++) {
      const A = pts[i], B = pts[i + 1], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, nx = dy / l, ny = -dx / l;
      const n = Math.max(1, Math.round(l / 3)); let top = [], bot = [];
      for (let k = 0; k <= n; k++) { const u = k / n, x = A[0] + dx * u, y = A[1] + dy * u, ww = w * (0.6 + R() * 0.8); top.push([x + nx * ww, y + ny * ww]); bot.push([x - nx * w * 0.25, y - ny * w * 0.25]); }
      s += `<path d="${polyS([...top, ...bot.reverse()])}" fill="${col}" stroke="${mix(col, INK, 0.55)}" stroke-width="0.5" opacity="${o.op ?? 0.92}"/>`;
      for (let k = 0; k < n; k += 2) { const u = (k + R()) / n, x = A[0] + dx * u + nx * w, y = A[1] + dy * u + ny * w; s += `<path d="M${f1(x)} ${f1(y)} l${f1(nx * w * 0.8 - 1.2)} ${f1(ny * w * 0.8 - 0.6)}" stroke="${col}" stroke-width="0.7" opacity="0.8"/>`; }
    }
    return s;
  }

  // ------------------------------------------------------------------------------------------------ toxin
  // shelf fungus (bracket) on a vertical surface at a screen point, facing the viewer: stacked lips, lit tops, gills shaded
  function shelf(x, y, w, col = '#8a7a4a', o = {}) {
    let s = '';
    for (let k = 0; k < (o.n || 3); k++) {
      const ww = w * (1 - k * 0.22) * (0.85 + R() * 0.3), yy = y + k * w * 0.32, h = ww * 0.32;
      const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10, a = Math.PI * u; pts.push([x - ww / 2 + ww * u, yy - Math.sin(a) * h * (0.9 + R() * 0.2)]); }
      const under = [[x + ww / 2, yy], [x + ww * 0.3, yy + h * 0.35], [x - ww * 0.3, yy + h * 0.35], [x - ww / 2, yy]];
      s += `<path d="${smooth([...pts, ...under], true, 0.4)}" fill="${mix(col, '#000', 0.15 * k)}" stroke="${INK}" stroke-width="0.8"/>`;
      s += `<path d="M${f1(x - ww * 0.42)} ${f1(yy + h * 0.1)} Q${f1(x)} ${f1(yy + h * 0.45)} ${f1(x + ww * 0.42)} ${f1(yy + h * 0.1)}" stroke="${INK}" stroke-width="0.6" fill="${mix(col, INK, 0.55)}" opacity="0.9"/>`;
      s += `<path d="${smooth(pts.slice(1, 6), false, 0.5)}" stroke="${mix(col, KEY, 0.5)}" stroke-width="0.8" fill="none" opacity="0.7"/>`;
      for (let j = 1; j < 4; j++) s += `<path d="${smooth(pts.map(p => [p[0] + (x - p[0]) * j * 0.18, p[1] + (yy - p[1]) * j * 0.22]), false, 0.5)}" stroke="${mix(col, INK, 0.4)}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
    }
    return s;
  }
  // a toadstool cluster growing at a screen point: caps of different sizes, stems, gills dark, a few with a blister bloom
  function toadstools(x, y, s, n, col = '#b8a878', o = {}) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const dx = (R() - 0.5) * s * 2.2, h = s * (0.5 + R() * 1.0), cw = s * (0.35 + R() * 0.45), lean = (R() - 0.5) * s * 0.4, X = x + dx, top = [X + lean, y - h];
      out += `<path d="M${f1(X - cw * 0.12)} ${f1(y)} Q${f1(X + lean * 0.3 - cw * 0.14)} ${f1(y - h * 0.5)} ${f1(top[0] - cw * 0.1)} ${f1(top[1])} L${f1(top[0] + cw * 0.1)} ${f1(top[1])} Q${f1(X + lean * 0.3 + cw * 0.14)} ${f1(y - h * 0.5)} ${f1(X + cw * 0.12)} ${f1(y)} Z" fill="${mix(o.stem || '#d8d0b0', INK, 0.15)}" stroke="${INK}" stroke-width="0.6"/>`;
      const cap = []; for (let j = 0; j <= 8; j++) { const a = Math.PI * j / 8; cap.push([top[0] - Math.cos(a) * cw, top[1] - Math.sin(a) * cw * 0.55]); }
      out += `<path d="${smooth([...cap, [top[0] + cw * 0.85, top[1] + cw * 0.12], [top[0] - cw * 0.85, top[1] + cw * 0.12]], true, 0.4)}" fill="${tone(col)}" stroke="${INK}" stroke-width="0.7"/>`;
      out += `<path d="M${f1(top[0] - cw * 0.8)} ${f1(top[1] + cw * 0.08)} L${f1(top[0] + cw * 0.8)} ${f1(top[1] + cw * 0.08)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, cw * 0.15))}" opacity="0.7"/>`;
      out += `<path d="${smooth(cap.slice(1, 4), false, 0.5)}" stroke="${mix(col, KEY, 0.5)}" stroke-width="0.7" fill="none" opacity="0.7"/>`;
      if (o.spots) for (let j = 0; j < 3; j++) out += `<circle cx="${f1(top[0] + (R() - 0.5) * cw)}" cy="${f1(top[1] - cw * (0.15 + R() * 0.3))}" r="${f1(Math.max(0.4, cw * 0.08))}" fill="${o.spots}" opacity="0.8"/>`;
    }
    return out;
  }
  const tone = (c, v = 0.2) => S.tone(c, v);
  // blisters: ripe pustules swelling out of a surface (toxin): domes with a lit top, a dark ring and a shine
  function blisters(x, y, r, n, col = '#8a9a3a', o = {}) {
    let s = '';
    for (let i = 0; i < n; i++) { const a = R() * 6.28, d = Math.sqrt(R()) * r, bx = x + Math.cos(a) * d, by = y + Math.sin(a) * d * (o.flat ?? 0.6), b = (o.size || 2) * (0.5 + R());
      s += `<ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="${f1(b * 1.1)}" ry="${f1(b * 0.9)}" fill="${tone(col, 0.25)}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, b * 0.2))}"/><ellipse cx="${f1(bx + b * 0.25)}" cy="${f1(by + b * 0.25)}" rx="${f1(b * 0.6)}" ry="${f1(b * 0.45)}" fill="${mix(col, INK, 0.45)}" opacity="0.6"/><circle cx="${f1(bx - b * 0.35)}" cy="${f1(by - b * 0.35)}" r="${f1(Math.max(0.35, b * 0.25))}" fill="#f0f0d0" opacity="0.65"/>`; }
    return s;
  }
  // sulphur crust: a pale-yellow crystalline rind in clusters (faceted crystals with ink edges and lit facets)
  function sulphur(x, y, r, n, o = {}) {
    let s = ''; const col = o.col || '#d8c040';
    for (let i = 0; i < n; i++) {
      const a = R() * 6.28, d = Math.sqrt(R()) * r, cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d * 0.6, h = (o.size || 3) * (0.5 + R() * 1.2), w = h * (0.35 + R() * 0.3), lean = (R() - 0.5) * 0.8;
      const tip = [cx + Math.sin(lean) * h, cy - Math.cos(lean) * h], L = [cx - w, cy], Rr = [cx + w, cy], M = [cx + Math.sin(lean) * h * 0.65 + w * 0.15, cy - Math.cos(lean) * h * 0.65];
      s += `<path d="${polyS([L, M, tip, Rr])}" fill="${tone(col, 0.25)}" stroke="${INK}" stroke-width="0.5"/><path d="${polyS([L, M, tip])}" fill="${mix(col, '#fff8d0', 0.35)}" opacity="0.6"/><path d="${polyS([M, tip, Rr])}" fill="${mix(col, '#5a4010', 0.45)}" opacity="0.55"/>`;
    }
    return s;
  }

  // ------------------------------------------------------------------------------------------------ steam and haze
  // a steam plume: a column of soft lobes rising and spreading, each lobe a pale shape with a broken ink contour on its
  // shadow side (lower right) and a lit rim at the upper left; translucent. Not a gradient.
  function steam(x, y, h, w, o = {}) {
    let s = ''; const col = o.col || '#e8e4dc', n = o.n || 7;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), cx = x + Math.sin(u * 3 + R()) * w * 0.25 + (o.drift || 0) * u * h, cy = y - u * h, r = w * (0.35 + u * 0.55) * (0.8 + R() * 0.4);
      const pts = []; for (let k = 0; k < 11; k++) { const a = k / 11 * 6.28, m = 0.7 + R() * 0.4 + 0.12 * Math.sin(a * 3 + i); pts.push([cx + Math.cos(a) * r * m, cy + Math.sin(a) * r * m * 0.62]); }
      const d = smooth(pts, true, 0.8);
      s += `<path d="${d}" fill="${col}" opacity="${f1((o.op ?? 0.16) * (1 - u * 0.6))}"/>`;
      s += `<path d="${smooth(pts.slice(1, 6), false, 0.8)}" stroke="${mix(col, INK, 0.55)}" stroke-width="0.6" fill="none" opacity="${f1((o.inkOp ?? 0.3) * (1 - u * 0.7))}" stroke-dasharray="${f1(4 + R() * 6)} ${f1(2 + R() * 4)}"/>`;
      s += `<path d="${smooth(pts.slice(6, 10), false, 0.8)}" stroke="#ffffff" stroke-width="0.7" fill="none" opacity="${f1((o.op ?? 0.16) * 1.4 * (1 - u * 0.6))}"/>`;
    }
    return s;
  }
  // a low bank of mist or smoke lying on a plane, screen y band: lobed top edge, hatched lightly inside, translucent
  function bank(x0, x1, y, h, o = {}) {
    const top = []; for (let x = x0; x <= x1 + 1; x += (o.soft ? 40 : 18) + R() * 16) top.push([x, y - h * (o.soft ? (0.55 + 0.45 * Math.sin(x * 0.009 + (o.ph || 0)) * Math.sin(x * 0.0031 + 1)) * (0.9 + R() * 0.1) : (0.5 + 0.5 * Math.abs(Math.sin(x * 0.011 + (o.ph || 0)))) * (0.75 + R() * 0.35))]);
    const d = smooth([[x0, y + (o.below ?? h * 0.4)], ...top, [x1, y + (o.below ?? h * 0.4)]], true, 0.7);
    return `<path d="${d}" fill="${o.col || '#c8ccc0'}" opacity="${o.op ?? 0.18}"/>` + `<path d="${smooth(top, false, 0.7)}" stroke="${o.edge || mix(o.col || '#c8ccc0', '#ffffff', 0.4)}" stroke-width="0.8" fill="none" opacity="${f1((o.op ?? 0.18) * 1.6)}" stroke-dasharray="14 6 4 8"/>`;
  }

  // ------------------------------------------------------------------------------------------------ water
  // a water surface plane (Y = y0) from Z z0 to z1: dark base, broken horizontal reflection strokes (wider and fewer near),
  // ripple rings, and reflections of given screen columns (o.refl: [[x, width, colour]]) broken into dashes
  function water(x0X, x1X, z0, z1, col, o = {}) {
    const y0 = o.y ?? 0, at = (s, t) => [x0X + s, y0, z0 + t];
    let s = `<path d="${pp([at(0, 0), at(x1X - x0X, 0), at(x1X - x0X, z1 - z0), at(0, z1 - z0)])}" fill="${col}"/>`;
    s += `<path d="${pp([at(0, 0), at(x1X - x0X, 0), at(x1X - x0X, z1 - z0), at(0, z1 - z0)])}" fill="url(#mottle)" opacity="0.35"/>`;
    const nn = o.n || 160;
    for (let i = 0; i < nn; i++) { const Z = z0 + Math.pow(R(), 0.7) * (z1 - z0), X = x0X + R() * (x1X - x0X), [x, y] = P(X, y0, Z), l = K(Z) * (0.3 + R() * 1.2);
      if (x < -20 || x > S.W + 20) continue;
      s += `<path d="M${f1(x - l / 2)} ${f1(y)} L${f1(x + l / 2)} ${f1(y)}" stroke="${R() < 0.5 ? (o.lite || mix(col, '#c8d0c0', 0.35)) : mix(col, INK, 0.5)}" stroke-width="${f1(Math.max(0.5, K(Z) * 0.012))}" opacity="${f1(0.25 + R() * 0.35)}"/>`; }
    for (const [x, w, c, y1, y2] of o.refl || []) { for (let y = y1; y < y2; y += 2.2 + R() * 2.5) { const ww = w * (0.4 + R() * 0.8); s += `<path d="M${f1(x - ww / 2 + (R() - 0.5) * 4)} ${f1(y)} l${f1(ww)} 0" stroke="${c}" stroke-width="${f1(0.8 + R())}" opacity="${f1(0.2 + R() * 0.3)}"/>`; } }
    return s;
  }
  function ripples(x, y, r, n = 3, col = '#c8d0c0', op = 0.35) { let s = ''; for (let k = 1; k <= n; k++) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * k / n)}" ry="${f1(r * k / n * 0.25)}" fill="none" stroke="${col}" stroke-width="0.6" opacity="${f1(op * (1.2 - k / n))}" stroke-dasharray="${f1(4 + R() * 5)} ${f1(2 + R() * 3)}"/>`; return s; }

  // ------------------------------------------------------------------------------------------------ rock and rubble
  // a boulder or rock mass at screen centre (x,y), w x h px: a faceted chipped outline; cel shading; fissures; o.col
  function rock(x, y, w, h, Z, o = {}) {
    const pts = [], n = o.n || 9;
    for (let k = 0; k < n; k++) { const a = Math.PI + k / (n - 1) * Math.PI, m = 0.75 + R() * 0.35; pts.push([x + Math.cos(a) * w / 2 * m, y + Math.sin(a) * h * m]); }
    pts.push([x + w / 2, y + 2], [x - w / 2, y + 2]);
    let s = cel(chip(pts, 0.5), { Z, fill: tone(o.col || '#4a4a48', 0.2), tex: 'url(#mottle)', texOp: 0.45, band: Math.max(1.2, w * 0.12) });
    // facet lines and a shaded right flank
    s += `<path d="${polyS([[x + w * 0.05, y - h * 0.9], [x + w * 0.5, y], [x + w * 0.1, y]])}" fill="${hatchA(Z)}" opacity="0.45"/>`;
    for (let k = 0; k < 2; k++) { const a = [x + (R() - 0.3) * w * 0.5, y - h * (0.4 + R() * 0.5)]; s += `<path d="M${f1(a[0])} ${f1(a[1])} l${f1((R() - 0.2) * w * 0.25)} ${f1(h * (0.3 + R() * 0.3))}" stroke="${INK}" stroke-width="0.7" opacity="0.7"/>`; }
    s += require('./materials_v2')(S).rockSkin(pts, Z, o.col || '#4a4a48', { wy0: 0 });   // materials v2: strata, fractures, pits, lichen, runs
    return s;
  }

  // ------------------------------------------------------------------------------------------------ the fighters' quiet band
  // stepped darkening on the far layer between screen y0 and y1 (y in px): ragged-topped bands of the murk colour, each step
  // a little darker; a gentle hatch over the lowest steps. Draw it after the backdrop and before the floor.
  function quiet(col, y0, y1, o = {}) {
    const steps = o.steps || [0.14, 0.14, 0.16, 0.18], n = steps.length; let s = '';
    for (let i = 0; i < n; i++) {
      const yt = y0 + (y1 - y0) * i / n, pts = [];
      for (let x = -10; x <= S.W + 20; x += 24 + R() * 20) pts.push([x, yt + Math.sin(x * 0.013 + i * 1.7) * 5 + (R() - 0.5) * 6]);
      s += `<path d="${smooth([[-10, y1 + 60], ...pts, [S.W + 20, y1 + 60]], true, 0.5)}" fill="${col}" opacity="${steps[i]}"/>`;
    }
    if (o.hatch !== false) s += `<rect x="0" y="${f1(y0 + (y1 - y0) * 0.45)}" width="${S.W}" height="${f1((y1 - y0) * 0.55 + 60)}" fill="${hatchA(18)}" opacity="${o.hop ?? 0.18}"/>`;
    return s;
  }

  // ------------------------------------------------------------------------------------------------ rope, chain, sag lines
  const rope = (pts, w, col, o = {}) => line(pts, w + 1.6, INK, 1) + line(pts, w, col, 1) + line(pts, w, mix(col, INK, 0.5), 0.6, ` stroke-dasharray="${f1(w * 0.6)} ${f1(w * 0.9)}"`);
  function chain(A, B, sag, link, col = '#3a3a3c', o = {}) {
    // a hanging chain from A to B: links alternate face-on (open ovals) and edge-on (bars); o.rigid: no sag (fused)
    let s = ''; const L = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(2, Math.round(L / (link * 1.6)));
    let prev = A;
    for (let i = 1; i <= n; i++) {
      const u = i / n, x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u + (o.rigid ? 0 : Math.sin(u * Math.PI) * sag), mx = (prev[0] + x) / 2, my = (prev[1] + y) / 2, ang = Math.atan2(y - prev[1], x - prev[0]) * 57.3;
      if (i % 2) s += `<ellipse cx="${f1(mx)}" cy="${f1(my)}" rx="${f1(link)}" ry="${f1(link * 0.5)}" transform="rotate(${f1(ang)} ${f1(mx)} ${f1(my)})" fill="none" stroke="${INK}" stroke-width="${f1(link * 0.55)}"/><ellipse cx="${f1(mx)}" cy="${f1(my)}" rx="${f1(link)}" ry="${f1(link * 0.5)}" transform="rotate(${f1(ang)} ${f1(mx)} ${f1(my)})" fill="none" stroke="${col}" stroke-width="${f1(link * 0.28)}"/>`;
      else s += `<path d="M${f1(prev[0])} ${f1(prev[1])} L${f1(x)} ${f1(y)}" stroke="${INK}" stroke-width="${f1(link * 0.7)}" stroke-linecap="round"/><path d="M${f1(prev[0])} ${f1(prev[1])} L${f1(x)} ${f1(y)}" stroke="${col}" stroke-width="${f1(link * 0.3)}" stroke-linecap="round"/>`;
      prev = [x, y];
    }
    return s;
  }

  return { line, polyS, tornVoid, rain, splashes, scorch, icicle, icicles, rimeEdge, shelf, toadstools, blisters, sulphur, steam, bank, water, ripples, rock, quiet, rope, chain };
};
