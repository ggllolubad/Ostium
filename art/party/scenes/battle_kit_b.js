// Battle-room kit for worlds VIII-XV (Living Ink). Owned by the VIII-XV scene maker; lik.js is not edited.
// BK(S, { murk }) wraps a lik.js scene S (the shared battle camera: horizon 300, eye 1.2, focal 652, cx 740) and adds:
//   - screen helpers: line, blob, jagged polylines, fog toward the room's murk
//   - solids: box (faces shaded by the key light: lit, single hatch, crosshatch), post, slab
//   - course marks:
//       frost   icicles (faceted, pointing down, clustered), rime crust on windward/top edges
//       fire    glowing seams with charred lips (branching), ash curling upward, char
//       light-  Lichtenberg scorch scarred INTO a surface (fern branching, a coloured core in the burn); never in the air
//       ning
//       toxin   mould fur, bracket fungus, fruiting caps, pustules
//       void    tornVoid: an irregular, clean-rimmed absence: torn uneven outline (tears running across the courses,
//               teeth of material left standing), slivers of the material thinning into nothing at the rim, flecks
//               drifting off, the cut through the thickness; never a cluster of round bites, never a glow
//       eye     an eye (void worlds only: XII, XIII, XIV, XV)
//   - quiet zone: stepped murk veils over the fighters' band (y 230-430) in the far layer, ragged, never a gradient
'use strict';
const E = require('../engine');
module.exports = function BK(S, cfg = {}) {
  const { P, K, sc, p2, pp, f1, INK, KEY, R, raw, cel, chip, hatch3, mix, smooth, inkW, inkH, hatchA, hatchB, id, DEFS, GLOW, EM, lam, planeShade } = S;
  const MURK = cfg.murk || '#101318', W = S.W, H = S.H;
  const fog = (col, Z, k = 1) => mix(col, MURK, Math.max(0, Math.min(0.72, (Z - 6) / 24)) * k);
  const line = (pts, w, col, op = 1, extra = '') => `<path d="${smooth(pts, false, 0.6)}" stroke="${col}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"${extra}/>`;
  const pline = (pts, w, col, op = 1, extra = '') => `<path d="${p2(pts, false)}" stroke="${col}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"${extra}/>`;
  const fillP = (pts, col, op = 1, extra = '') => `<path d="${p2(pts)}" fill="${col}" opacity="${op}"${extra}/>`;
  const fillS = (pts, col, op = 1, k = 0.5, extra = '') => `<path d="${smooth(pts, true, k)}" fill="${col}" opacity="${op}"${extra}/>`;
  const inkS = (pts, w, k = 0.5, op = 1) => `<path d="${smooth(pts, true, k)}" fill="none" stroke="${INK}" stroke-width="${f1(w)}" stroke-linejoin="round" opacity="${op}"/>`;
  const inkP = (pts, w, op = 1) => `<path d="${p2(pts)}" fill="none" stroke="${INK}" stroke-width="${f1(w)}" stroke-linejoin="round" opacity="${op}"/>`;
  // an irregular closed outline in screen space
  const blob = (cx, cy, rx, ry, n = 12, jag = 0.35, rot = 0) => { const o = []; for (let k = 0; k < n; k++) { const th = k / n * Math.PI * 2, m = 1 - jag / 2 + R() * jag, x = Math.cos(th) * rx * m, y = Math.sin(th) * ry * m; o.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return o; };
  // a jagged polyline from a to b (n steps, amp px across)
  const jag = (a, b, n = 8, amp = 3) => { const o = [a], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; for (let i = 1; i < n; i++) { const t = i / n, d = (R() - 0.5) * 2 * amp; o.push([a[0] + dx * t + nx * d, a[1] + dy * t + ny * d]); } o.push(b); return o; };
  // a cel-shaded irregular screen polygon with mottle (rock, rubble, lumps)
  const lump = (pts, Z, fill, o = {}) => cel(o.chip === false ? pts : chip(pts, o.chip ?? 0.5), Object.assign({ Z, fill, tex: 'url(#mottle)', texOp: 0.4 }, o));

  // ------------------------------------------------------------------ solids
  // shade for a face by its normal: lit none, mid single hatch, away crosshatch (hatch laid in the face)
  const faceShade = (at, Ls, Lt, n, o = {}) => planeShade(at, Ls, Lt, n, o);
  // an axis-aligned box in metres; o.front/top/side colours, o.tex, o.shadeOp. Visible faces only, back to front.
  function box(x0, x1, y0, y1, z0, z1, o = {}) {
    const col = o.col || '#6a6a6a', fz = (z0 + z1) / 2, EYE = S.EYE; let s = '';
    const face = (pts3, at, Ls, Lt, n, fill) => { s += cel(pts3.map(p => P(...p)), { Z: fz, fill, tex: o.tex === false ? undefined : (o.tex || 'url(#mottle)'), texOp: o.texOp ?? 0.35, band: o.band, hi: o.hi }); if (o.shade !== false) s += faceShade(at, Ls, Lt, n, { op: o.shadeOp ?? 0.42 }); };
    if (y1 < EYE && o.top !== false) face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], (a, b) => [x0 + a, y1, z0 + b], x1 - x0, z1 - z0, [0, 1, 0], o.topCol || mix(col, KEY, 0.12));
    if (y0 > EYE && o.bottom !== false) face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], (a, b) => [x0 + a, y0, z0 + b], x1 - x0, z1 - z0, [0, -1, 0], mix(col, INK, 0.5));
    if (x0 > 0 && o.sides !== false) face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], (a, b) => [x0, y0 + b, z0 + a], z1 - z0, y1 - y0, [-1, 0, 0], o.sideCol || mix(col, KEY, 0.05));
    if (x1 < 0 && o.sides !== false) face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], (a, b) => [x1, y0 + b, z0 + a], z1 - z0, y1 - y0, [1, 0, 0], o.sideCol || mix(col, INK, 0.35));
    if (o.front !== false) face([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], (a, b) => [x0 + a, y0 + b, z0], x1 - x0, y1 - y0, [0, 0, -1], o.frontCol || col);
    return s;
  }
  // a timber or post of square section r (m) from y0 to y1 at (x, z), with grain
  function post(x, z, r, y0, y1, col, o = {}) {
    let s = box(x - r, x + r, y0, y1, z - r, z + r, Object.assign({ col, tex: 'url(#mottle)' }, o));
    if (o.grain !== false) { const a = P(x - r, y0, z - r), b = P(x + r, y1, z - r), w = b[0] - a[0]; for (let k = 0; k < 3; k++) { const xx = a[0] + w * (0.2 + k * 0.3 + (R() - 0.5) * 0.1), pts = []; for (let i = 0; i <= 8; i++) pts.push([xx + Math.sin(i * 1.3 + k) * w * 0.05, a[1] + (b[1] - a[1]) * i / 8]); s += line(pts, Math.max(0.4, inkW(z) * 0.4), mix(col, INK, 0.6), 0.5); } }
    return s;
  }
  // a beam between two 3D points with a square section (screen-space quad with a shadow band on the underside)
  function beam(A, B, th, col, o = {}) {
    const a = P(...A), b = P(...B), Z = (A[2] + B[2]) / 2, t = K(Z) * th, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * t / 2, ny = dx / L * t / 2;
    const q = [[a[0] - nx, a[1] - ny], [b[0] - nx, b[1] - ny], [b[0] + nx, b[1] + ny], [a[0] + nx, a[1] + ny]];
    let s = cel(o.chip ? chip(q, 0.3) : q, { Z, fill: col, tex: 'url(#mottle)', texOp: 0.4, band: Math.max(1, t * 0.35) });
    for (let k = 0; k < 2; k++) { const u = 0.3 + k * 0.35; s += pline([[a[0] + (nx * (u * 2 - 1)), a[1] + ny * (u * 2 - 1)], [b[0] + nx * (u * 2 - 1), b[1] + ny * (u * 2 - 1)]], Math.max(0.4, inkW(Z) * 0.35), mix(col, INK, 0.6), 0.5); }
    return s;
  }

  // ------------------------------------------------------------------ frost
  // icicles hanging from a screen edge (pts: polyline along the edge). Faceted: a lit left facet, a shadow right facet,
  // pointing down; long ones in clusters with short ones beside them. o.len: max length px, o.dens: per 10 px.
  function icicles(pts, Z, o = {}) {
    let s = ''; const ice = o.col || '#d4e2ea', sh = o.shadow || mix(ice, '#3a5266', 0.6), maxL = o.len || 30, dens = o.dens ?? 0.7;
    const segs = []; let tot = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push([pts[i], pts[i + 1], l]); tot += l; }
    const n = Math.round(tot / 10 * dens);
    const at = u => { let d = u * tot; for (const [a, b, l] of segs) { if (d <= l) return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]; d -= l; } return pts[pts.length - 1]; };
    const list = []; for (let i = 0; i < n; i++) { const u = R(), clus = 0.5 + 0.5 * Math.sin(u * tot * 0.045 + (o.ph || 0)); list.push([u, maxL * (0.12 + R() * 0.88) * (0.35 + 0.65 * clus)]); }
    list.sort((p, q) => q[1] - p[1]);
    for (const [u, L] of list) {
      const [x, y] = at(u), w = Math.max(1.2, L * (0.12 + R() * 0.08)) * (o.wmul || 1), kink = (R() - 0.5) * w * 0.6, tip = [x + kink + (R() - 0.5) * 1.5, y + L];
      const mid = [x + kink * 0.5, y + L * 0.45];
      const left = [[x - w / 2, y - 1], [mid[0] - w * 0.28, mid[1]], tip], right = [[x + w / 2, y - 1], [mid[0] + w * 0.28, mid[1]], tip];
      s += fillP([...left, ...right.slice().reverse()], ice);
      s += fillP([[x + w * 0.05, y - 1], [x + w / 2, y - 1], [mid[0] + w * 0.28, mid[1]], tip, [mid[0] + w * 0.02, mid[1]]], sh, 0.8);
      if (L > 10) s += pline([[x - w * 0.25, y + 1], [mid[0] - w * 0.15, mid[1]], [tip[0] - 0.3, tip[1] - L * 0.2]], Math.max(0.4, w * 0.12), '#f4fbff', 0.7);
      for (let k = 1; k < Math.min(4, L / 8); k++) { const yy = y + L * k / 5, ww = w * (1 - k / 5) * 0.5; s += pline([[x + kink * k / 5 - ww, yy], [x + kink * k / 5 + ww, yy + 0.8]], 0.5, sh, 0.5); }
      s += inkP([...left, ...right.slice().reverse()], Math.max(0.5, Math.min(inkW(Z) * 0.6, w * 0.25)));
    }
    return s;
  }
  // rime crust sitting on an edge (pts left to right): a lumpy, feathered white rind whose feathers grow into the wind
  // (from the left). o.th: thickness px, o.up: grows up (true, on top of a ledge) or toward -normal.
  function rime(pts, Z, o = {}) {
    const th = o.th || 4, col = o.col || '#e6eef2', top = [], bot = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = dy / L, ny = -dx / L, t = th * (0.45 + R() * 0.8) * (o.taper ? Math.sin(Math.PI * (i + 0.5) / pts.length) : 1); top.push([pts[i][0] + nx * t, pts[i][1] + ny * t]); bot.push([pts[i][0] - nx * th * 0.15, pts[i][1] - ny * th * 0.15]); }
    let s = fillS([...top, ...bot.reverse()], col, o.op ?? 0.95, 0.35);
    s += `<path d="${smooth(top, false, 0.35)}" stroke="${INK}" stroke-width="${f1(Math.max(0.45, inkW(Z) * 0.45))}" fill="none" opacity="0.8"/>`;
    // feathers: short strokes leaning into the wind (to the left), and a blue shadow under the crust
    let fe = ''; for (let i = 0; i < top.length; i++) if (R() < 0.6) { const [x, y] = top[i], l = th * (0.4 + R() * 0.8); fe += `M${f1(x)} ${f1(y)} l${f1(-l * 0.8)} ${f1(-l * 0.5)} `; }
    s += `<path d="${fe}" stroke="${mix(col, '#5a7486', 0.5)}" stroke-width="0.5" fill="none" opacity="0.7"/>`;
    s += `<path d="${smooth(bot.slice().reverse(), false, 0.35)}" stroke="${o.under || '#5a7486'}" stroke-width="${f1(Math.max(0.6, th * 0.35))}" fill="none" opacity="0.4"/>`;
    return s;
  }

  // ------------------------------------------------------------------ fire
  // a glowing seam: a crack in a surface whose depths burn. Char lip, ink, molten core, hot thread; painted glow (class glow)
  function seam(pts, w, o = {}) {
    const core = o.core || '#ff7a24', hot = o.hot || '#ffd890', char = o.char || '#1a0d08';
    let s = line(pts, w * 3.4, char, 0.55) + line(pts, w * 1.7, INK, 1);
    s += EM(line(pts, w, core, 1) + line(pts, Math.max(0.4, w * 0.38), hot, 0.95));
    if (o.glow !== false) s += GLOW(line(pts, w * (o.glowW || 7), core, o.glowOp ?? 0.16, ' filter="url(#soft)"'));
    return s;
  }
  // a branching seam tree from x,y heading ang, total length len px
  function seamTree(x, y, ang, len, w, o = {}, depth = 2) {
    let s = ''; const pts = [[x, y]]; let cx = x, cy = y, a = ang; const n = 6 + Math.floor(R() * 4);
    for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.9; cx += Math.cos(a) * len / n; cy += Math.sin(a) * len / n; pts.push([cx, cy]); if (depth > 0 && R() < 0.3) s += seamTree(cx, cy, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.7), len * (0.25 + R() * 0.3), w * 0.6, o, depth - 1); }
    return seam(pts, w, o) + s;
  }
  // ash flakes curling upward (thin curled ink-edged flakes, grey), in a screen box
  function ash(n, x0, x1, y0, y1, o = {}) {
    let s = ''; for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), r = (o.r || 2.2) * (0.5 + R()), a = R() * 6.28;
      const c = mix(o.col || '#8a8680', R() < 0.5 ? '#2a2624' : '#c8c4bc', R() * 0.4);
      s += `<path d="M${f1(x)} ${f1(y)} q${f1(Math.cos(a) * r)} ${f1(-r)} ${f1(Math.cos(a) * r * 1.6)} ${f1(-r * 0.2)} q${f1(-r * 0.4)} ${f1(r * 0.6)} ${f1(-Math.cos(a) * r * 1.6)} ${f1(r * 0.2)}" fill="${c}" stroke="${INK}" stroke-width="0.4" opacity="${f1(o.op ?? (0.4 + R() * 0.4))}"/>`; }
    return s;
  }
  // char: a burnt patch on a surface, built of crosshatch and black flakes, with a scorched brown halo
  function char(cx, cy, rx, ry, o = {}) {
    const b = blob(cx, cy, rx, ry, 14, 0.5), b2 = blob(cx, cy, rx * 0.65, ry * 0.65, 12, 0.6), c = id('ch');
    let s = fillS(blob(cx, cy, rx * 1.25, ry * 1.25, 14, 0.4), o.halo || '#3a2416', 0.25) + fillS(b, '#140c08', o.op ?? 0.55);
    s += `<clipPath id="${c}"><path d="${smooth(b, true, 0.5)}"/></clipPath><g clip-path="url(#${c})"><rect x="${f1(cx - rx * 1.3)}" y="${f1(cy - ry * 1.3)}" width="${f1(rx * 2.6)}" height="${f1(ry * 2.6)}" fill="${hatchA(o.Z || 8)}" opacity="0.6"/><rect x="${f1(cx - rx * 1.3)}" y="${f1(cy - ry * 1.3)}" width="${f1(rx * 2.6)}" height="${f1(ry * 2.6)}" fill="${hatchB(o.Z || 8)}" opacity="0.5"/></g>` + fillS(b2, '#0a0605', 0.5);
    return s;
  }

  // ------------------------------------------------------------------ lightning, as a scar only
  // a Lichtenberg burn scarred into a surface: fern branching from a strike point, the burn dark with a coloured core
  // (o.core: violet, aurora green, white), a scorched halo. Clipped by the caller to the surface. Never drawn in the air.
  function burn(x, y, ang, len, w, o = {}) {
    const core = o.core || '#b8a0e8', scorch = o.scorch || '#120a10';
    let dk = '', cr = '', halo = '';
    const go = (x, y, a, l, w, d) => {
      const n = 4 + Math.floor(R() * 3); let cx = x, cy = y; const pts = [[x, y]];
      for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.8; cx += Math.cos(a) * l / n; cy += Math.sin(a) * l / n; pts.push([cx, cy]);
        if (d > 0 && R() < (o.branchP ?? 0.75)) go(cx, cy, a + (R() < 0.5 ? -1 : 1) * (o.spread ?? 0.45) * (1 + R() * 1.3), l * (0.35 + R() * 0.3), w * 0.62, d - 1); }
      const dd = 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
      halo += `<path d="${dd}" stroke-width="${f1(w * 3.2)}"/>`; dk += `<path d="${dd}" stroke-width="${f1(w)}"/>`; if (w > 0.7) cr += `<path d="${dd}" stroke-width="${f1(Math.max(0.35, w * 0.32))}"/>`;
    };
    go(x, y, ang, len, w, o.depth ?? 4);
    return `<g fill="none" stroke="${scorch}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.haloOp ?? 0.22}">${halo}</g><g fill="none" stroke="${scorch}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.op ?? 0.9}">${dk}</g><g fill="none" stroke="${core}" stroke-linecap="round" opacity="${o.coreOp ?? 0.75}">${cr}</g>`;
  }
  // a lump of fused metal (screen): a melted, run blob with drips, ink, a lit run on its upper left, scorch round it
  function fused(cx, cy, r, col, Z, o = {}) {
    const b = blob(cx, cy, r, r * 0.8, 13, 0.45);
    let s = fillS(blob(cx, cy, r * 1.6, r * 1.3, 12, 0.4), o.scorch || '#140c10', 0.3) + cel(b, { Z, fill: col, band: r * 0.35 });
    for (let k = 0; k < 2 + Math.floor(R() * 3); k++) { const x = cx + (R() - 0.5) * r * 1.2, l = r * (0.4 + R() * 0.8); s += `<path d="M${f1(x - r * 0.12)} ${f1(cy + r * 0.5)} L${f1(x)} ${f1(cy + r * 0.5 + l)} L${f1(x + r * 0.12)} ${f1(cy + r * 0.5)} Z" fill="${col}" stroke="${INK}" stroke-width="0.6"/>`; }
    s += line([[cx - r * 0.6, cy - r * 0.2], [cx - r * 0.2, cy - r * 0.55], [cx + r * 0.2, cy - r * 0.5]], Math.max(0.6, r * 0.12), mix(col, '#fff4dc', 0.6), 0.7);
    return s;
  }

  // ------------------------------------------------------------------ toxin
  function mould(cx, cy, rx, ry, o = {}) {
    const col = o.col || '#7a8a6a';
    let s = fillS(blob(cx, cy, rx, ry, 14, 0.55), mix(col, INK, 0.3), 0.35) + fillS(blob(cx, cy, rx * 0.6, ry * 0.6, 12, 0.6), col, 0.45);
    let fur = ''; for (let i = 0; i < (o.n || Math.round(rx * ry * 0.4) + 6); i++) { const r = Math.sqrt(R()), th = R() * 6.28, x = cx + Math.cos(th) * r * rx, y = cy + Math.sin(th) * r * ry, l = 0.8 + R() * 2; fur += `M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * l)} ${f1(-l)} `; }
    s += `<path d="${fur}" stroke="${mix(col, '#e8ecd8', 0.35)}" stroke-width="0.5" fill="none" opacity="0.75"/>`;
    for (let i = 0; i < Math.round(rx * ry * 0.05) + 2; i++) s += `<circle cx="${f1(cx + (R() - 0.5) * rx * 1.4)}" cy="${f1(cy + (R() - 0.5) * ry * 1.2)}" r="${f1(0.5 + R() * 1.1)}" fill="${INK}" opacity="0.45"/>`;
    return s;
  }
  // a bracket fungus shelf on a vertical surface, its upper face lit, the gills shaded under it, growth rings
  function bracket(x, y, w, Z, o = {}) {
    const col = o.col || '#c8b884', h = w * (0.3 + R() * 0.15), pts = [];
    for (let k = 0; k <= 10; k++) { const t = k / 10, a = Math.PI * t; pts.push([x - w / 2 + w * t, y - Math.sin(a) * h * 0.3 + (R() - 0.5) * 0.6]); }
    for (let k = 10; k >= 0; k--) { const t = k / 10, a = Math.PI * t; pts.push([x - w / 2 + w * t, y + Math.sin(a) * h * (0.8 + R() * 0.1)]); }
    let s = cel(pts, { Z, fill: col, band: h * 0.3 });
    for (let k = 1; k < 3; k++) { const r = k / 3; s += `<path d="M${f1(x - w / 2 * r)} ${f1(y + h * 0.05)} Q${f1(x)} ${f1(y + h * 0.7 * r)} ${f1(x + w / 2 * r)} ${f1(y + h * 0.05)}" stroke="${mix(col, INK, 0.45)}" stroke-width="0.6" fill="none" opacity="0.7"/>`; }
    s += `<path d="M${f1(x - w / 2)} ${f1(y)} Q${f1(x)} ${f1(y + h * 1.05)} ${f1(x + w / 2)} ${f1(y)}" stroke="${mix(col, '#fff8e8', 0.5)}" stroke-width="${f1(Math.max(0.6, h * 0.12))}" fill="none" opacity="0.6"/>`;
    return s;
  }
  // a cluster of fruiting caps on stems rising from a point (screen), h = tallest stem px
  function caps(x, y, h, Z, o = {}) {
    const col = o.col || '#d8c8a0', stem = o.stem || mix(col, '#f4ecd8', 0.3); let s = '';
    const n = o.n || 3 + Math.floor(R() * 3), list = [];
    for (let i = 0; i < n; i++) list.push([x + (R() - 0.5) * h * 0.9, h * (0.35 + R() * 0.65), (R() - 0.5) * 0.5]);
    list.sort((a, b) => a[1] - b[1]);
    for (const [sx, sh, lean] of list.reverse()) {
      const top = [sx + lean * sh, y - sh], cw = sh * (0.35 + R() * 0.25), sw = Math.max(1, cw * 0.18);
      s += fillP([[sx - sw, y], [top[0] - sw * 0.7, top[1]], [top[0] + sw * 0.7, top[1]], [sx + sw, y]], stem) + inkP([[sx - sw, y], [top[0] - sw * 0.7, top[1]], [top[0] + sw * 0.7, top[1]], [sx + sw, y]], 0.6);
      const cap = [[top[0] - cw, top[1] + cw * 0.15], [top[0] - cw * 0.6, top[1] - cw * 0.45], [top[0], top[1] - cw * 0.6], [top[0] + cw * 0.65, top[1] - cw * 0.4], [top[0] + cw, top[1] + cw * 0.15]];
      s += cel([...cap, [top[0], top[1] + cw * 0.05]], { Z, fill: col, band: cw * 0.25 });
      for (let k = 0; k < 4; k++) s += `<path d="M${f1(top[0])} ${f1(top[1] + cw * 0.08)} L${f1(top[0] - cw + k * cw * 0.66)} ${f1(top[1] + cw * 0.14)}" stroke="${INK}" stroke-width="0.4" opacity="0.6"/>`;
      if (o.spots) for (let k = 0; k < 3; k++) s += `<circle cx="${f1(top[0] + (R() - 0.5) * cw)}" cy="${f1(top[1] - cw * 0.25 * R())}" r="${f1(Math.max(0.5, cw * 0.08))}" fill="${o.spots}" opacity="0.8"/>`;
    }
    return s;
  }
  // pustules: swollen domes with a lit highlight and a dark pore
  function pustules(cx, cy, r, n, col, Z) {
    let s = ''; for (let i = 0; i < n; i++) { const x = cx + (R() - 0.5) * r * 2, y = cy + (R() - 0.5) * r * 1.2, b = Math.max(1, r * (0.12 + R() * 0.15));
      s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(b)}" ry="${f1(b * 0.85)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, b * 0.2))}"/><circle cx="${f1(x - b * 0.35)}" cy="${f1(y - b * 0.35)}" r="${f1(b * 0.25)}" fill="#f4f0d8" opacity="0.7"/><circle cx="${f1(x + b * 0.2)}" cy="${f1(y + b * 0.15)}" r="${f1(b * 0.15)}" fill="${INK}" opacity="0.7"/>`; }
    return s;
  }

  // ------------------------------------------------------------------ void
  // tornVoid: an absence torn out of a surface at(s,t) (metres). The outline is irregular and clean: long straight-ish
  // tears that run off across the courses, teeth of material left standing into the hole, no round arcs. At the rim the
  // material thins into nothing (slivers tapering to a point, flecks drifting off and fading). The cut through the
  // thickness (o.depth along o.dir) is a fresh, paler face. Inside: black. o.eyes: [[u,v,r]] in hole units (void worlds).
  function tornVoid(at, s0, t0, w, h, o = {}) {
    const N = o.n || 44, pts = [], tears = [];
    const nt = o.tears ?? 3; for (let i = 0; i < nt; i++) tears.push([R() * Math.PI * 2, (o.tearLen ?? 1) * (0.5 + R() * 0.9), 0.05 + R() * 0.07]);
    const teeth = o.teeth ?? 3, tth = []; for (let i = 0; i < teeth; i++) tth.push([R() * Math.PI * 2, 0.25 + R() * 0.3, 0.06 + R() * 0.06]);
    let rw = 0;
    for (let i = 0; i < N; i++) {
      const th = i / N * Math.PI * 2; rw += (R() - 0.5) * 0.22; rw *= 0.82;
      let m = 1 + rw + 0.12 * Math.sin(th * 3 + (o.ph || 0)) + (R() - 0.5) * 0.12;
      for (const [ta, tl, tw] of tears) { const d = Math.abs(Math.atan2(Math.sin(th - ta), Math.cos(th - ta))); if (d < tw) m += tl * (1 - d / tw); }
      for (const [ta, tl, tw] of tth) { const d = Math.abs(Math.atan2(Math.sin(th - ta), Math.cos(th - ta))); if (d < tw) m -= tl * (1 - d / tw); }
      pts.push([s0 + Math.cos(th) * w / 2 * Math.max(0.15, m), t0 + Math.sin(th) * h / 2 * Math.max(0.15, m)]);
    }
    const front = pts.map(q => at(q[0], q[1])), dir = o.dir || [0, 0, 1], dz = o.depth ?? 0.4;
    const Fs = front.map(p => P(...p)), Bs = front.map(p => P(p[0] + dir[0] * dz, p[1] + dir[1] * dz, p[2] + dir[2] * dz));
    const Z = front[0][2], fd = p2(Fs), bd = p2(Bs);
    const voidCol = o.voidCol || '#050407', cut = o.cut || '#8a8a86';
    let s = '';
    // the material thinning toward the rim: ragged crosshatch and a dark wash in a band round the hole (thinning, not glowing)
    if (o.halo !== false) { const ring = Fs.map(([x, y], i) => { const c = Fs.reduce((a, p) => [a[0] + p[0] / Fs.length, a[1] + p[1] / Fs.length], [0, 0]), dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy) || 1, k = (o.haloPx || K(Z) * 0.14) * (0.6 + R() * 0.8); return [x + dx / l * k, y + dy / l * k]; }), cid = id('tv');
      s += `<clipPath id="${cid}"><path d="${p2(ring)}"/></clipPath><g clip-path="url(#${cid})"><path d="${p2(ring)}" fill="${o.thin || '#000'}" opacity="${o.thinOp ?? 0.16}"/><path d="${p2(ring)}" fill="${hatchA(Z)}" opacity="0.45"/></g>`; }
    if (dz > 0) { s += `<path d="${fd}" fill="${cut}"/>`; const c2 = id('tc'); s += `<clipPath id="${c2}"><path d="${fd}"/></clipPath><g clip-path="url(#${c2})"><path d="${fd}" fill="${hatchA(Z)}" opacity="0.25"/><path d="${bd}" fill="${voidCol}"/></g>`; }
    else s += `<path d="${fd}" fill="${voidCol}"/>`;
    // eyes looking out of the absence (void worlds only)
    const c = Fs.reduce((a, p) => [a[0] + p[0] / Fs.length, a[1] + p[1] / Fs.length], [0, 0]), rx = (Math.max(...Fs.map(p => p[0])) - Math.min(...Fs.map(p => p[0]))) / 2, ry = (Math.max(...Fs.map(p => p[1])) - Math.min(...Fs.map(p => p[1]))) / 2;
    for (const [u, v, r] of o.eyes || []) s += eye(c[0] + u * rx, c[1] + v * ry, r * Math.min(rx, ry), o.eyeO || {});
    // slivers: pieces of the material reaching into the hole, tapering to nothing; flecks drifting off, fading
    let sl = '';
    for (let i = 0; i < (o.slivers ?? 7); i++) { const k = Math.floor(R() * N), A = Fs[k], B = Fs[(k + 1 + Math.floor(R() * 2)) % N], L = Math.hypot(B[0] - A[0], B[1] - A[1]); if (L < 2) continue;
      const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], dx = c[0] - m[0], dy = c[1] - m[1], dl = Math.hypot(dx, dy) || 1, len = dl * (0.12 + R() * 0.25), tip = [m[0] + dx / dl * len + (R() - 0.5) * len * 0.4, m[1] + dy / dl * len + (R() - 0.5) * len * 0.4];
      sl += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(tip[0])} ${f1(tip[1])} L${f1(B[0])} ${f1(B[1])} Z" fill="${o.mat || cut}" opacity="0.9"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(tip[0])} ${f1(tip[1])} L${f1(B[0])} ${f1(B[1])}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.6))}" stroke-linejoin="miter"/>`; }
    for (let i = 0; i < (o.flecks ?? 9); i++) { const k = Math.floor(R() * N), A = Fs[k], dx = c[0] - A[0], dy = c[1] - A[1], dl = Math.hypot(dx, dy) || 1, u = 0.06 + R() * 0.3, x = A[0] + dx * u, y = A[1] + dy * u, r = Math.max(0.8, K(Z) * 0.025 * (1 - u * 2) * (0.6 + R())), a = R() * 3;
      sl += `<path d="M${f1(x - r)} ${f1(y)} L${f1(x + r * Math.cos(a))} ${f1(y - r * 0.8)} L${f1(x + r)} ${f1(y + r * 0.4)} Z" fill="${o.mat || cut}" stroke="${INK}" stroke-width="0.45" opacity="${f1(Math.max(0.15, 0.85 - u * 2.2))}"/>`; }
    s += sl;
    // the clean rim: one firm ink line; a faint cold edge on the far rim (no glow)
    s += `<path d="${fd}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(1.0, inkW(Z) * 1.25))}" stroke-linejoin="miter" stroke-miterlimit="3"/>`;
    if (o.edge) s += `<path d="${dz > 0 ? bd : fd}" fill="none" stroke="${o.edge}" stroke-width="${f1(Math.max(0.6, inkW(Z) * 0.7))}" opacity="${o.edgeOp ?? 0.4}"/>`;
    return { svg: s, outline: Fs, center: c, rx, ry };
  }
  // an eye (void worlds only): almond lids, a wet bone white, a pale iris, a dark pupil, the upper lid's shadow hatched
  function eye(x, y, r, o = {}) {
    const lk = o.look || [(R() - 0.5) * 0.4, (R() - 0.5) * 0.2], open = o.open ?? (0.45 + R() * 0.25), rot = o.rot ?? (R() - 0.5) * 0.3;
    const T = (u, v) => [x + (u * Math.cos(rot) - v * Math.sin(rot)) * r, y + (u * Math.sin(rot) + v * Math.cos(rot)) * r];
    const upper = [], lower = []; for (let k = 0; k <= 8; k++) { const u = -1 + k / 4; upper.push(T(u, -open * (1 - u * u) - 0.02)); lower.push(T(u, open * 0.75 * (1 - u * u))); }
    const al = [...upper, ...lower.slice().reverse()], c = id('ey');
    let s = `<path d="${smooth(al, true, 0.4)}" fill="${o.white || '#d8d2c0'}"/>`;
    s += `<clipPath id="${c}"><path d="${smooth(al, true, 0.4)}"/></clipPath><g clip-path="url(#${c})">`;
    const ic = T(lk[0], lk[1] * open), ir = r * open * 0.95;
    s += `<circle cx="${f1(ic[0])}" cy="${f1(ic[1])}" r="${f1(ir)}" fill="${o.iris || '#8a8478'}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, r * 0.06))}"/><circle cx="${f1(ic[0])}" cy="${f1(ic[1])}" r="${f1(ir * 0.45)}" fill="${INK}"/><circle cx="${f1(ic[0] - ir * 0.35)}" cy="${f1(ic[1] - ir * 0.35)}" r="${f1(Math.max(0.4, ir * 0.16))}" fill="#f4f0e4" opacity="0.8"/>`;
    s += `<path d="${smooth([...upper, ...upper.slice().reverse().map(p => [p[0], p[1] + r * open * 0.5])], true, 0.4)}" fill="${hatchA(8)}" opacity="0.6"/></g>`;
    s += `<path d="${smooth(upper, false, 0.4)}" stroke="${INK}" stroke-width="${f1(Math.max(0.7, r * 0.16))}" fill="none" stroke-linecap="round"/><path d="${smooth(lower, false, 0.4)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, r * 0.08))}" fill="none"/>`;
    if (o.lid !== false) s += `<path d="${smooth(upper.map(p => [p[0], p[1] - r * 0.22]), false, 0.4)}" stroke="${o.lidCol || INK}" stroke-width="${f1(Math.max(0.4, r * 0.06))}" fill="none" opacity="0.5"/>`;
    return s;
  }

  // ------------------------------------------------------------------ misc
  function chain(pts, size, col = '#3a3634', o = {}) {
    let s = ''; const segs = []; let tot = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push([pts[i], pts[i + 1], l]); tot += l; }
    const n = Math.floor(tot / (size * 1.5)); let k = 0;
    for (const [a, b, l] of segs) { const m = Math.floor(l / (size * 1.5)); for (let i = 0; i < m; i++, k++) { const t = (i + 0.5) / m, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 57.3, flat = k % 2;
      s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(size)}" ry="${f1(flat ? size * 0.25 : size * 0.55)}" transform="rotate(${f1(ang)} ${f1(x)} ${f1(y)})" fill="${flat ? col : 'none'}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, size * 0.28))}"/>` + (flat ? '' : `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(size)}" ry="${f1(size * 0.55)}" transform="rotate(${f1(ang)} ${f1(x)} ${f1(y)})" fill="none" stroke="${col}" stroke-width="${f1(Math.max(0.3, size * 0.14))}"/>`); } }
    return s;
  }
  // wisps of steam rising (line work, pale, no fill), from x,y up to h px
  function steam(x, y, h, o = {}) {
    let s = ''; for (let i = 0; i < (o.n || 3); i++) { const pts = []; let cx = x + (R() - 0.5) * (o.w || 10), a = R() * 6; for (let k = 0; k <= 8; k++) { pts.push([cx + Math.sin(a + k * 0.9) * (2 + k * 0.9), y - h * k / 8]); }
      s += line(pts, (o.lw || 2.4) * (1 - i * 0.2), o.col || '#e8eef0', (o.op ?? 0.3) * (1 - i * 0.2)); }
    return s;
  }
  // stepped murk veils over the fighters' band, in the far layer: ragged bands, heavier toward the floor, plus a ragged
  // hatch. bands: [[yTop, op], ...] each covering to the frame bottom (x0..x1 optional).
  function quiet(bands, o = {}) {
    let s = '';
    for (const [y0, op] of bands) { const pts = [[o.x0 ?? -5, H + 5]]; for (let k = 0; k <= 30; k++) { const x = (o.x0 ?? -5) + ((o.x1 ?? W + 5) - (o.x0 ?? -5)) * k / 30; pts.push([x, y0 + Math.sin(k * 1.7 + y0) * 4 + (R() - 0.5) * 5]); } pts.push([o.x1 ?? W + 5, H + 5]); s += fillP(pts, o.col || MURK, op); }
    if (o.hatch !== false) { let hl = ''; const y0 = bands[0][0]; for (let x = -200; x < W + 50; x += o.gap || 4.2) { const a = y0 + 10 + R() * 30, b = H; hl += `M${f1(x)} ${f1(a)} L${f1(x + (b - a) * 0.78)} ${f1(b)} `; } s += `<path d="${hl}" stroke="${INK}" stroke-width="0.6" opacity="${o.hop ?? 0.22}" fill="none"/>`; }
    return s;
  }
  // stepped sky: bands of tone (no gradient), each with a ragged lower edge, plus hatch heavier at the top
  function skyBands(cols, ys, o = {}) {
    let s = `<rect width="${W}" height="${H}" fill="${cols[0]}"/>`;
    for (let i = 1; i < cols.length; i++) { const pts = [[-5, H + 5], [-5, ys[i - 1]]]; for (let k = 0; k <= 40; k++) pts.push([W * k / 40, ys[i - 1] + Math.sin(k * 0.8 + i) * (o.wav || 5) + (R() - 0.5) * 4]); pts.push([W + 5, ys[i - 1]], [W + 5, H + 5]); s += fillP(pts, cols[i]); }
    return s;
  }
  // a floor of irregular flags: rows of varying depth, stones of their own widths, chipped; a few broken or missing
  function flags(x0, x1, z0, z1, col, o = {}) {
    let s = `<path d="${pp([[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]])}" fill="${mix(col, INK, o.joint ?? 0.55)}"/>`;
    let z = z0, r = 0;
    const WX = require('./materials_v2')(S).begin((s2, t2) => [x0 + s2, 0, z0 + t2], x1 - x0, z1 - z0, o.wx);   // materials v2: weathered slabs
    while (z < z1) { const d = (o.depth || 0.9) * (0.6 + R() * 0.8) * (1 + (z - z0) * 0.03), za = z, zb = Math.min(z1, z + d);
      let X = x0 - R() * 1.2; while (X < x1) { const wdt = (o.width || 1.1) * (0.5 + R() * 1.1), xa = X, xb = X + wdt; X = xb;
        const q = [[xa + 0.025, 0, zb - 0.025], [xb - 0.025, 0, zb - 0.025 + (R() - 0.5) * 0.05], [xb - 0.025, 0, za + 0.025], [xa + 0.025, 0, za + 0.025 + (R() - 0.5) * 0.05]].map(p => P(...p));
        if (q[1][0] < -10 || q[0][0] > W + 10) continue;
        if (o.skip && o.skip((xa + xb) / 2, (za + zb) / 2)) continue;
        if (R() < (o.missing ?? 0.03)) continue;
        const cq = chip(q, 0.35), fl = fog(S.tone(col, o.vary ?? 0.12), za, o.fogK ?? 0.8);   // chip first, as before (same S.R order)
        s += cel(cq, { Z: za, fill: fl, band: Math.max(0.6, K(za) * 0.014), tex: 'url(#mottle)', texOp: 0.35, inkW: Math.max(0.4, inkW(za) * 0.5), heavy: Math.max(0.6, inkH(za) * 0.35), hi: o.hi ?? false });
        s += WX.stoneNow(cq, za, fl, [[xa, 0, zb], [xb, 0, zb], [xb, 0, za], [xa, 0, za]], { joint: mix(col, INK, o.joint ?? 0.55) });
        if (R() < (o.cracks ?? 0.12)) { const c = P((xa + xb) / 2, 0, (za + zb) / 2); s += `<path d="M${f1(c[0] - K(za) * 0.3)} ${f1(c[1])} l${f1(K(za) * 0.2)} ${f1(K(za) * 0.02)} l${f1(K(za) * 0.25)} ${f1(-K(za) * 0.03)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.6"/>`; }
      }
      z = zb; r++;
    }
    return s + WX.end();
  }
  // Voronoi cells of seeds [[s,t],...] inside the box [s0,s1]x[t0,t1]: each cell a convex polygon (half-plane clipping)
  function voronoi(seeds, s0, s1, t0, t1) {
    const clip = (poly, a, b, c) => { const out = []; for (let i = 0; i < poly.length; i++) { const P1 = poly[i], P2 = poly[(i + 1) % poly.length], d1 = a * P1[0] + b * P1[1] - c, d2 = a * P2[0] + b * P2[1] - c; if (d1 <= 0) out.push(P1); if ((d1 <= 0) !== (d2 <= 0)) { const t = d1 / (d1 - d2); out.push([P1[0] + (P2[0] - P1[0]) * t, P1[1] + (P2[1] - P1[1]) * t]); } } return out; };
    return seeds.map((p, i) => { let poly = [[s0, t0], [s1, t0], [s1, t1], [s0, t1]]; for (let j = 0; j < seeds.length; j++) { if (j === i) continue; const q = seeds[j]; if (Math.abs(q[0] - p[0]) > 8 || Math.abs(q[1] - p[1]) > 8) continue; const a = q[0] - p[0], b = q[1] - p[1], c = (q[0] * q[0] + q[1] * q[1] - p[0] * p[0] - p[1] * p[1]) / 2; poly = clip(poly, a, b, c); if (poly.length < 3) break; } return { seed: p, poly }; }).filter(c => c.poly.length >= 3);
  }
  // jittered seeds on a loose grid (cw x rh cells)
  const seedsIn = (s0, s1, t0, t1, cw, rh, jit = 0.8) => { const o = []; for (let t = t0 + rh / 2; t < t1 + rh / 2; t += rh) for (let s = s0 + cw / 2 * R(); s < s1 + cw / 2; s += cw * (0.7 + R() * 0.6)) o.push([s + (R() - 0.5) * cw * jit, Math.min(t1 - 0.05, t + (R() - 0.5) * rh * jit)]); return o; };
  // pick scars: a group of short parallel gouges left by a miner's pick (screen), dark cut with a lit lower lip
  function pickScars(x, y, len, n, ang, o = {}) { let d = '', l = ''; for (let i = 0; i < n; i++) { const ox = x + i * len * 0.28 + (R() - 0.5) * 2, oy = y + i * len * 0.08 + (R() - 0.5) * 2, L = len * (0.6 + R() * 0.5), a = ang + (R() - 0.5) * 0.2, ex = ox + Math.cos(a) * L, ey = oy + Math.sin(a) * L, mx = (ox + ex) / 2 + Math.sin(a) * L * 0.08, my = (oy + ey) / 2 - Math.cos(a) * L * 0.08; d += `M${f1(ox)} ${f1(oy)} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)} `; l += `M${f1(ox + 0.8)} ${f1(oy + 1)} Q${f1(mx + 0.8)} ${f1(my + 1)} ${f1(ex + 0.8)} ${f1(ey + 1)} `; }
    return `<path d="${d}" stroke="${o.col || INK}" stroke-width="${f1(o.w || 1)}" fill="none" stroke-linecap="round" opacity="${o.op ?? 0.75}"/><path d="${l}" stroke="${o.lip || '#f2f8fa'}" stroke-width="${f1((o.w || 1) * 0.6)}" fill="none" opacity="${(o.op ?? 0.75) * 0.6}"/>`; }
  return { voronoi, seedsIn, pickScars, MURK, fog, line, pline, fillP, fillS, inkS, inkP, blob, jag, lump, box, post, beam, icicles, rime, seam, seamTree, ash, char, burn, fused, mould, bracket, caps, pustules, tornVoid, eye, chain, steam, quiet, skyBands, flags };
};
