// Battle-room kit for worlds VII, VIII, IX (group g3, round 2). New file; lik.js, battle_li.js and battle_kit_b.js are
// required, never edited. G3(S, { air, murk }) wraps a lik.js scene on the shared battle camera and adds:
//   air        atmospheric recession: a colour pushed toward the room's air colour with depth (lower contrast far away)
//   clouds     a cloud field of separate masses: each a cluster of lobes of its own sizes on a flattish base, lit rim on
//              the upper left, a hatched shadow band underneath, a broken ink contour; smaller and flatter toward the
//              horizon (perspective), never stripes, no two alike
//   glare      a stepped light source (sun, moon, opening): ragged concentric steps, no gradient
//   shaft      a light shaft: stepped translucent bands between two screen edges, with motes
//   ridge      a mountain or ice ridge silhouette by midpoint displacement, snow on the slopes facing the light, gullies
//   wedges     a band of faceted fragments (ice plates, rubble) along a screen polyline, sizes and tilts varied
//   ship       a ship of the line broadside in the ice (World VII): curved sheer and tumblehome strakes, wales casting
//              their own shadows, gunports following the sheer in every state (open, lid raised, hanging, closed), channels
//              with deadeyes and chain plates breaking the port rows, quarter gallery and beakhead, masts, yards, frozen
//              furled sails, shrouds and ratlines, icicles and rime, pressure ice heaped against the waterline
//   sparks, motes, snowfall
'use strict';
module.exports = function G3(S, cfg = {}) {
  const { P, K, R, f1, INK, KEY, p2, pp, cel, chip, mix, smooth, hatchA, hatchB, hatch3, inkW, id, W, H } = S;
  const BK = require('./battle_kit_b')(S, { murk: cfg.murk || '#101318' });
  const BL = require('./battle_li')(S);
  const AIR = cfg.air || '#9aa4ac';
  const air = (col, Z, o = {}) => mix(col, o.to || AIR, Math.max(0, Math.min(o.max ?? 0.8, (Z - (o.z0 ?? 8)) / ((o.z1 ?? 90) - (o.z0 ?? 8)))));
  const { line, pline, fillP, fillS, inkP, inkS, blob } = BK;

  // ---------------------------------------------------------------- clouds
  // o: { n, x0, x1, y0, y1 (screen band of cloud bases), size (px at the top of the band), lit, mid, shade, inkOp, flat }
  function clouds(o = {}) {
    let s = ''; const n = o.n || 10, x0 = o.x0 ?? -80, x1 = o.x1 ?? W + 80, y0 = o.y0 ?? 30, y1 = o.y1 ?? 220;
    const list = []; for (let i = 0; i < n; i++) list.push(y0 + (y1 - y0) * Math.pow(R(), 0.8));
    list.sort((a, b) => a - b);                           // far (low) clouds first? no: high first, low (far) drawn later would overlap wrongly
    list.reverse();                                       // far clouds (near the horizon, low) first, high near ones last
    for (const cy of list) {
      const persp = 1 - (cy - y0) / Math.max(1, (o.horizon ?? 300) - y0) * 0.75;       // 1 high up, smaller toward the horizon
      const w = (o.size || 260) * persp * (0.5 + R() * 0.9), h = w * (o.flat ?? 0.24) * (0.7 + R() * 0.6), cx = x0 + R() * (x1 - x0);
      const nl = 3 + Math.floor(R() * 5), lobes = [];
      for (let k = 0; k < nl; k++) { const u = (k + 0.2 + R() * 0.6) / nl, env = Math.sin(Math.PI * (0.12 + u * 0.76)); lobes.push([cx - w / 2 + w * u, h * (0.35 + 0.75 * env) * (0.6 + R() * 0.6)]); }
      const top = []; const N = 26;
      for (let k = 0; k <= N; k++) { const x = cx - w / 2 + w * k / N; let y = 0; for (const [lx, r] of lobes) { const d = (x - lx) / (r * 1.25); if (Math.abs(d) < 1) y = Math.max(y, r * Math.sqrt(1 - d * d)); } top.push([x, cy - Math.max(h * 0.08, y) + (R() - 0.5) * 1.2]); }
      const base = []; for (let k = N; k >= 0; k--) { const x = cx - w / 2 + w * k / N; base.push([x, cy + Math.sin(k * 0.9 + cx) * h * 0.05 + h * 0.06 * Math.sin(Math.PI * k / N)]); }
      const poly = [...top, ...base], d = smooth(poly, true, 0.45);
      s += `<path d="${d}" fill="${o.mid || '#9aa4ac'}"${o.op ? ` opacity="${o.op}"` : ''}/>`;
      // shadow band underneath: the lower 35-55 % with a ragged upper edge
      const sb = []; for (let k = 0; k <= N; k++) { const x = cx - w / 2 + w * k / N, ty = top[k][1], by = cy; sb.push([x, Math.max(ty, by - (by - ty) * (0.38 + R() * 0.18) - h * 0.06)]); }
      const sp = [...sb, ...base], cid = id('cl');
      s += `<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})"><path d="${smooth(sp, true, 0.4)}" fill="${o.shade || '#6a747c'}" opacity="${o.shadeOp ?? 0.6}"/><path d="${smooth(sp, true, 0.4)}" fill="${hatchA(30)}" opacity="${o.hatchOp ?? 0.25}"/>`;
      // the lit rim along the top on the side toward the light
      s += `<path d="${smooth(top.slice(0, Math.round(N * 0.7)).map(([x, y]) => [x + 1.5, y + 2]), false, 0.5)}" stroke="${o.lit || '#e4e8ea'}" stroke-width="${f1(Math.max(1, h * (o.rimW ?? 0.06)))}" fill="none" opacity="${o.rimOp ?? 0.6}"/></g>`;
      s += `<path d="${smooth(top, false, 0.45)}" stroke="${INK}" stroke-width="${f1(o.ink || 0.8)}" fill="none" opacity="${o.inkOp ?? 0.35}" stroke-dasharray="${f1(18 + R() * 20)} ${f1(4 + R() * 6)}"/>`;
    }
    return s;
  }
  // a stepped glare round a light source (sun, moon, a lit opening): ragged concentric steps, no gradient
  function glare(x, y, r, col, o = {}) {
    let s = ''; const steps = o.steps || [[3.2, 0.08], [2.2, 0.1], [1.5, 0.14], [1.0, 0.22]];
    for (const [k, op] of steps) s += fillS(blob(x, y, r * k * (o.sx || 1), r * k * (o.sy || 0.8), 16, o.jag ?? 0.18), col, op, 0.6);
    if (o.disc) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(o.disc)}" ry="${f1(o.disc)}" fill="${o.discCol || '#ffffff'}" opacity="${o.discOp ?? 0.95}"/>`;
    return s;
  }
  // a light shaft between a top edge [a,b] and a bottom edge [c,d] (screen points): stepped translucent bands, motes
  function shaft(a, b, c, d, col, o = {}) {
    let s = ''; const k = o.steps || 3;
    for (let i = 0; i < k; i++) { const t = i / k * 0.35; const L = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], Rr = [b[0] - (b[0] - a[0]) * t, b[1] - (b[1] - a[1]) * t], L2 = [c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t], R2 = [d[0] - (d[0] - c[0]) * t, d[1] - (d[1] - c[1]) * t]; s += fillP([L, Rr, R2, L2], col, o.op ?? 0.08); }
    for (let i = 0; i < (o.motes || 30); i++) { const u = R(), v = R(), top = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], bot = [c[0] + (d[0] - c[0]) * u, c[1] + (d[1] - c[1]) * u], x = top[0] + (bot[0] - top[0]) * v, y = top[1] + (bot[1] - top[1]) * v; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.4 + R() * 0.9)}" fill="${o.mote || col}" opacity="${f1(0.25 + R() * 0.45)}"/>`; }
    return s;
  }
  // ---------------------------------------------------------------- terrain
  // a ridge silhouette from x0 to x1 over base y (screen); o.h: peak height px, o.rough, o.col, o.snow (snow colour), o.Z
  function ridgePts(x0, x1, yb, h, o = {}) {
    let pts = [[x0, yb - h * (o.e0 ?? 0.2)], [x1, yb - h * (o.e1 ?? 0.2)]];
    const peaks = o.peaks || [[0.5, 1]];
    for (const [u, m] of peaks) pts.splice(pts.length - 1, 0, [x0 + (x1 - x0) * u, yb - h * m]);
    pts.sort((a, b) => a[0] - b[0]);
    let amp = h * (o.rough ?? 0.35);
    for (let it = 0; it < (o.iter || 6); it++) { const np = [pts[0]]; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; np.push([(a[0] + b[0]) / 2 + (R() - 0.5) * (b[0] - a[0]) * 0.2, (a[1] + b[1]) / 2 + (R() - 0.5) * amp]); np.push(b); } pts = np; amp *= 0.52; }
    return pts.map(([x, y]) => [x, Math.min(yb, y)]);
  }
  function ridge(x0, x1, yb, h, o = {}) {
    const top = ridgePts(x0, x1, yb, h, o), col = o.col || '#6a7480', Z = o.Z || 60;
    const poly = [[x0, yb + (o.below ?? 40)], ...top, [x1, yb + (o.below ?? 40)]];
    let s = fillP(poly, col);
    if (o.tex !== false) s += `<path d="${p2(poly)}" fill="url(#mottle)" opacity="${o.texOp ?? 0.25}"/>`;
    const cid = id('rg'); s += `<clipPath id="${cid}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${cid})">`;
    // faces: from each silhouette vertex a fall line down; slopes rising to the right (facing upper left) lit with snow,
    // falling to the right in shade (hatched)
    // faces: from each silhouette segment a facet falls diagonally: slopes rising to the right (facing the upper-left
    // light) carry snow and fall away down-left; slopes falling to the right are in shade and fall down-right. Segments are
    // merged into runs of the same facing so the facets are broad, not stripes.
    const runs = []; for (let i = 1; i < top.length; i++) { const up = top[i][1] < top[i - 1][1]; if (runs.length && runs[runs.length - 1].up === up) runs[runs.length - 1].pts.push(top[i]); else runs.push({ up, pts: [top[i - 1], top[i]] }); }
    for (const { up, pts } of runs) {
      const dep = (o.faceDepth ?? 0.7) * h * (0.6 + R() * 0.6), dx = (up ? -0.55 : 0.55) * dep;
      const q = [...pts, ...pts.slice().reverse().map(([x, y], j) => [x + dx * (0.7 + 0.3 * Math.sin(j)), y + dep * (0.75 + 0.35 * R())])];
      if (up && o.snow) s += fillS(q, o.snow, o.snowOp ?? 0.8, 0.25);
      else if (!up) s += fillS(q, o.shade || mix(col, INK, 0.3), 0.55, 0.25) + `<path d="${smooth(q, true, 0.25)}" fill="${hatchA(Z)}" opacity="${o.hatchOp ?? 0.3}"/>`;
    }
    // gullies: dark streaks down from the dips
    for (let i = 2; i < top.length - 2; i++) if (top[i][1] > top[i - 1][1] && top[i][1] > top[i + 1][1] && R() < 0.7) { const g = [top[i]]; let x = top[i][0], y = top[i][1]; for (let k = 0; k < 6; k++) { x += (R() - 0.4) * 5; y += h * 0.12; g.push([x, y]); } s += line(g, 1 + R() * 1.4, o.gully || mix(col, INK, 0.5), 0.6); }
    s += '</g>';
    s += pline(top, o.inkW || 0.9, INK, o.inkOp ?? 0.7);
    return { svg: s, top };
  }
  // a band of faceted fragments (ice plates, slabs) standing along a screen polyline: each a tilted slab, lit face upper
  // left, shadow face right; sizes from o.size [min,max] px; o.cols [lit, mid, shade]; o.rime colour on the top edges
  function wedges(path, n, o = {}) {
    let s = ''; const [smin, smax] = o.size || [10, 30], cols = o.cols || ['#e4ecf0', '#b4c4d0', '#7a8e9e'];
    const segs = []; let tot = 0; for (let i = 0; i < path.length - 1; i++) { const l = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); segs.push([path[i], path[i + 1], l]); tot += l; }
    const at = u => { let d = u * tot; for (const [a, b, l] of segs) { if (d <= l) return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]; d -= l; } return path[path.length - 1]; };
    const list = []; for (let i = 0; i < n; i++) list.push([R(), smin + Math.pow(R(), 1.6) * (smax - smin)]);
    list.sort((a, b) => a[1] - b[1]);
    for (const [u, sz] of list) {
      const [x, y] = at(u), tilt = (R() - 0.5) * 1.1, hh = sz * (0.5 + R() * 0.9), ww = sz * (0.6 + R() * 0.7);
      const tip = [x + Math.sin(tilt) * hh, y - Math.cos(tilt) * hh], L = [x - ww / 2, y + 2], Rr = [x + ww / 2, y + 2];
      const sh = [tip[0] + ww * (0.15 + R() * 0.2), tip[1] + hh * (0.1 + R() * 0.15)];
      const lit = [L, [tip[0] - ww * 0.1, tip[1] + hh * 0.05], tip, sh, [x + ww * (R() - 0.5) * 0.3, y + 2]];
      const dark = [[x + ww * (R() - 0.5) * 0.3, y + 2], sh, Rr];
      s += fillP(lit, o.fog ? mix(cols[0], o.fog, o.fogK || 0.3) : cols[0]) + fillP(dark, o.fog ? mix(cols[2], o.fog, o.fogK || 0.3) : cols[2]);
      if (o.hatch !== false) s += `<path d="${p2(dark)}" fill="${hatchA(o.Z || 10)}" opacity="0.35"/>`;
      s += inkP([L, [tip[0] - ww * 0.1, tip[1] + hh * 0.05], tip, sh, Rr], o.ink || 0.8, 0.9) + pline([sh, [x + ww * (R() - 0.5) * 0.3, y + 2]], 0.5, INK, 0.5);
      if (o.rime) s += BL.rimeEdge([[L[0] + 1, L[1] - hh * 0.4], [tip[0] - ww * 0.1, tip[1] + hh * 0.05], tip], { w: Math.max(1, sz * 0.08), col: o.rime });
    }
    return s;
  }
  // a band of heaved plates (sea ice, slabs) standing along a screen polyline: each a broad tilted slab (a quadrilateral, not
  // a spike) with its face, its lit top edge with rime, and its thickness showing on the side away from the light
  function plates(path, n, o = {}) {
    let s = ''; const [smin, smax] = o.size || [20, 60], cols = o.cols || ['#c8d4dc', '#7e92a2', '#3a4a58'];
    const segs = []; let tot = 0; for (let i = 0; i < path.length - 1; i++) { const l = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); segs.push([path[i], path[i + 1], l]); tot += l; }
    const at = u => { let d = u * tot; for (const [a, b, l] of segs) { if (d <= l) return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]; d -= l; } return path[path.length - 1]; };
    const list = []; for (let i = 0; i < n; i++) list.push([R(), smin + Math.pow(R(), 1.4) * (smax - smin)]);
    list.sort((a, b) => a[1] - b[1]);
    for (const [u, sz] of list) {
      const [x, y] = at(u), w = sz * (0.9 + R() * 1.1), h = sz * (0.45 + R() * 0.7), tilt = (R() - 0.5) * 0.9, th = sz * (0.08 + R() * 0.1);
      const ct = Math.cos(tilt), st = Math.sin(tilt), Q = (a, b) => [x + a * ct - b * st, y + a * st + b * ct];
      const face = [Q(-w / 2, 4), Q(-w / 2 + w * 0.06, -h), Q(w / 2 - w * 0.1 * R(), -h * (0.8 + R() * 0.2)), Q(w / 2, 4)];
      const side = tilt > 0 ? [face[2], face[3], [face[3][0] + th, face[3][1]], [face[2][0] + th, face[2][1] - th * 0.3]] : [face[1], face[0], [face[0][0] - th, face[0][1]], [face[1][0] - th, face[1][1] - th * 0.3]];
      const fc = o.fog ? mix(cols[1], o.fog, o.fogK || 0.3) : cols[1];
      s += fillP(side, o.fog ? mix(cols[2], o.fog, o.fogK || 0.3) : cols[2]) + inkP(side, o.ink || 0.8, 0.9);
      s += cel(face, { Z: o.Z || 20, fill: S.tone(fc, 0.1), band: Math.max(1, sz * 0.08), tex: 'url(#mottle)', texOp: 0.3, hi: false });
      if (o.hatch !== false) s += `<path d="${p2(face)}" fill="${hatchA(o.Z || 20)}" opacity="${o.hatchOp ?? 0.25}"/>`;
      for (let k = 1; k < 3; k++) s += pline([Q(-w / 2 + 2, -h * k / 3), Q(w / 2 - 2, -h * k / 3 + (R() - 0.5) * 3)], 0.6, mix(fc, INK, 0.4), 0.5);
      s += pline([face[1], face[2]], Math.max(1, sz * 0.05), o.lit || cols[0], 0.9);
      if (o.rime) s += BL.rimeEdge([face[1], face[2]], { w: Math.max(1, sz * 0.07), col: o.rime });
      if (o.icicles) s += BL.icicles(face[0][1] > face[3][1] ? face[3] : face[0], face[1], 2, { max: sz * 0.3, col: o.rime || '#e4ecf0' });
    }
    return s;
  }
  // falling snow: flakes in screen space, slanted short strokes (o.slant), opacity varied; o.n, o.y0..y1
  function snowfall(n, o = {}) { let d = '', d2 = ''; for (let i = 0; i < n; i++) { const x = R() * (W + 60) - 30, y = (o.y0 ?? 0) + R() * ((o.y1 ?? H) - (o.y0 ?? 0)), l = (o.len || 3) * (0.4 + R()), sl = o.slant ?? 0.4; (R() < 0.5 ? (d += `M${f1(x)} ${f1(y)} l${f1(l * sl)} ${f1(l)} `) : (d2 += `M${f1(x)} ${f1(y)} l${f1(l * sl)} ${f1(l)} `)); }
    return `<path d="${d}" stroke="${o.col || '#eef3f6'}" stroke-width="${o.w || 1.3}" stroke-linecap="round" opacity="${o.op ?? 0.55}"/><path d="${d2}" stroke="${o.col || '#eef3f6'}" stroke-width="${(o.w || 1.3) * 0.6}" stroke-linecap="round" opacity="${(o.op ?? 0.55) * 0.6}"/>`; }

  // ---------------------------------------------------------------- World VII: a ship of the line broadside in the ice
  // X0 (stern) .. X1 (bow) when o.dir = 1 (bow to the right; -1 mirrors), side plane at Z. o.trim: rise of the bow over the
  // stern (m) from ice pressure; o.masts: [[X, height, yard half-width]]; o.ports: per tier; o.fog: air amount 0..1;
  // o.gunners: frozen gunners leaning out; o.burst: a gun split open; o.cut: skip masts above this screen y (cropped).
  function ship(X0, X1, Z, o = {}) {
    const dir = o.dir || 1, L = X1 - X0, sx = X => dir > 0 ? X : X0 + X1 - X;        // sx: ship coord to world X
    const u = X => (X - X0) / L;                                                      // 0 stern, 1 bow (ship coords)
    const g = X => (o.sheer ?? 0.9) * Math.pow(2 * u(X) - 1, 2) + 0.9 * Math.pow(1 - u(X), 2) + (o.trim || 0) * (u(X) - 0.5);
    const rail = X => g(X) + (o.free || 6.4) + 1.7 * Math.pow(Math.max(0, 0.3 - u(X)) / 0.3, 1.2) + 0.5 * Math.pow(Math.max(0, u(X) - 0.85) / 0.15, 1.5);
    const fg = c => mix(c, o.air || AIR, o.fog || 0);
    const k = K(Z), ink = Math.max(0.6, inkW(Z));
    const HULL = fg(o.hull || '#1c1e22'), HULL2 = fg(o.hull2 || '#2e3238'), RIME = fg('#e4ecf0'), SNOW = fg('#eef2f4'), RIG = fg('#7a8a9c'), SAIL = fg('#a8b0b4'), WALE = fg('#16181b'), STRIPE = fg('#5a6066');
    const Pt = (X, Y, dz = 0) => P(sx(X), Y, Z + dz);
    let s = '';
    // ---- masts, tops, yards and furled frozen sails (behind the hull), stays
    for (const [mX, mh, yw] of o.masts || []) {
      const zc = 6.5, base = Pt(mX, rail(mX) - 0.5, zc), top = Pt(mX + 0.15 * dir, rail(mX) + mh, zc), kz = K(Z + zc);
      const mw = Math.max(2, kz * 0.55);
      s += line([base, top], mw + 1.6, INK) + line([base, top], mw, fg('#2a2a2c')) + line([[base[0] - mw * 0.32, base[1]], [top[0] - mw * 0.32, top[1]]], Math.max(0.6, mw * 0.18), RIME, 0.75);
      // the top (platform) and the cap, with the topmast above
      for (const fr of [0.48, 0.8]) { const yy = rail(mX) + mh * fr, a = Pt(mX - 1.3, yy, zc), b = Pt(mX + 1.3, yy, zc); if (a[1] < (o.cut ?? -50)) continue; s += pline([a, b], Math.max(2, kz * 0.22), INK) + pline([a, b], Math.max(1, kz * 0.14), fg('#26282c')) + BL.rimeEdge([[a[0], a[1] - 1], [b[0], b[1] - 1]], { w: Math.max(1, kz * 0.08), col: SNOW }) + BL.icicles([a[0], a[1] + 1], [b[0], b[1] + 1], 6, { max: kz * 0.5, col: RIME }); }
      for (const [fr, ww] of [[0.4, yw], [0.66, yw * 0.78], [0.9, yw * 0.55]]) {
        const yy = rail(mX) + mh * fr, a = Pt(mX - ww, yy - 0.15, zc + 0.3), b = Pt(mX + ww, yy + 0.1, zc + 0.3); if (a[1] < (o.cut ?? -50)) continue;
        s += line([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1], b], Math.max(1.6, kz * 0.2) + 1.2, INK) + line([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1], b], Math.max(1, kz * 0.2), fg('#2e2e30'));
        // the furled sail: a lumpy frozen roll along the yard, with gaskets, and a frozen slab hanging where a gasket broke
        const roll = []; const n = 14; for (let i = 0; i <= n; i++) { const t = i / n; roll.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + kz * (0.2 + 0.08 * Math.sin(i * 1.7 + mX)) + kz * 0.05]); }
        const rp = [...roll.map(([x, y]) => [x, y - kz * 0.12]), ...roll.slice().reverse().map(([x, y]) => [x, y + kz * (0.1 + R() * 0.05)])];
        s += cel(rp, { Z: Z + zc, fill: SAIL, tex: 'url(#mottle)', texOp: 0.35, band: Math.max(1, kz * 0.08) });
        for (let i = 1; i < 6; i++) { const t = i / 6, p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; s += pline([[p[0], p[1] - 0.5], [p[0] + 0.5, p[1] + kz * 0.35]], 0.7, INK, 0.7); }
        if (R() < 0.55) { const t = 0.2 + R() * 0.5, p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + kz * 0.28], ww2 = kz * (0.6 + R() * 1.0), hh = kz * (0.8 + R() * 1.6); const sl = [[p[0] - ww2 / 2, p[1]], [p[0] + ww2 / 2, p[1]], [p[0] + ww2 * 0.35, p[1] + hh], [p[0] - ww2 * 0.45, p[1] + hh * (0.8 + R() * 0.2)]]; s += cel(sl, { Z: Z + zc, fill: mix(SAIL, '#d8dee2', 0.2), tex: 'url(#mottle)', texOp: 0.35, band: 1.5 }) + BL.icicles(sl[3], sl[2], 5, { max: kz * 0.7, col: RIME }); }
        s += BL.icicles([a[0], a[1] + kz * 0.34], [b[0], b[1] + kz * 0.34], Math.round(ww * 3), { max: kz * (0.4 + R() * 0.4), col: RIME });
      }
    }
    // stays between the mast heads and to the bowsprit
    const ms = o.masts || []; for (let i = 0; i < ms.length - 1; i++) { const a = Pt(ms[i][0], rail(ms[i][0]) + ms[i][1] * 0.78, 6.5), b = Pt(ms[i + 1][0], rail(ms[i + 1][0]) + ms[i + 1][1] * 0.35, 6.5); s += line([a, b], Math.max(0.6, k * 0.03), RIG, 0.8); }

    // ---- the hull side
    const N = 40, top = []; for (let i = 0; i <= N; i++) { const X = X0 + L * i / N; top.push([X, rail(X)]); }
    const stern = [[X0 - 0.9, rail(X0) + 0.6], [X0 - 0.55, rail(X0) * 0.6], [X0 + 0.4, -0.3]];
    const bow = [[X1 - 1.2, -0.3], [X1 + 0.2, rail(X1) * 0.35], [X1 + 1.3, rail(X1) * 0.75], [X1 + 1.6, rail(X1) + 0.7]];
    const hull = [...stern.slice().reverse().map(([X, Y]) => [X, Y]).reverse(), ...top, ...bow.slice().reverse()].map(([X, Y]) => [X, Y]);
    const hullS = [Pt(X0 + 0.4, -0.3), Pt(X0 - 0.55, rail(X0) * 0.6), Pt(X0 - 0.9, rail(X0) + 0.6), ...top.map(([X, Y]) => Pt(X, Y)), Pt(X1 + 1.6, rail(X1) + 0.7), Pt(X1 + 1.3, rail(X1) * 0.75), Pt(X1 + 0.2, rail(X1) * 0.35), Pt(X1 - 1.2, -0.3)];
    const cid = id('hl');
    s += `<path d="${smooth(hullS, true, 0.15)}" fill="${HULL}"/><clipPath id="${cid}"><path d="${smooth(hullS, true, 0.15)}"/></clipPath><g clip-path="url(#${cid})">`;
    // strakes: bands following the sheer; tone graded by tumblehome (lower strakes face down: darker; upper face up: catch
    // the sky); a pale weathered stripe along each gun tier; plank butts staggered; swollen, split along the grain
    const strake = 0.32, nS = Math.ceil(((o.free || 6.4) + 2.5) / strake);
    for (let j = 0; j < nS; j++) {
      const y0 = -0.3 + j * strake, y1 = y0 + strake, frac = y0 / (o.free || 6.4);
      let col = frac < 0.15 ? mix(HULL, INK, 0.35) : frac < 0.45 ? HULL : frac < 0.8 ? mix(HULL, HULL2, 0.4) : HULL2;
      const tier = [[1.85, 2.45], [3.95, 4.55]].some(([a, b]) => y0 >= a - 0.05 && y1 <= b + 0.05);
      if (tier) col = mix(STRIPE, HULL, 0.35);
      let X = X0 - 1 - R() * 3;
      while (X < X1 + 2) { const w = 3 + R() * 4, xa = X, xb = Math.min(X1 + 2, X + w); X = xb;
        const tn = mix(col, R() < 0.5 ? '#000' : '#5a6068', R() * 0.12), q = [Pt(xa, g(xa) + y0 + 0.01), Pt(xb, g(xb) + y0 + 0.01), Pt(xb, g(xb) + y1 - 0.01), Pt(xa, g(xa) + y1 - 0.01)];
        s += fillP(q, tn) + pline([q[3], q[2]], Math.max(0.5, ink * 0.5), INK, 0.7);
        if (R() < 0.35) s += pline([q[1], q[2]], Math.max(0.4, ink * 0.4), INK, 0.6);
        if (R() < 0.18 && k > 8) { const p = Pt(xa + w * R(), g(xa) + (y0 + y1) / 2), l = k * (0.5 + R()); s += pline([[p[0], p[1]], [p[0] + l * 0.4, p[1] - 0.4], [p[0] + l, p[1] + 0.3]], Math.max(0.6, k * 0.012), RIME, 0.5); }
      }
    }
    s += `<path d="${smooth(hullS, true, 0.15)}" fill="url(#mottle)" opacity="0.3"/>`;
    // tumblehome shading: hatch over the lower third (the hull turning under), lighter single hatch over the waist
    { const at = (a, b) => [sx(X0 - 2 + a), b - 0.3, Z - 0.02]; s += hatch3((a, b) => [sx(X0 - 2 + a), b - 0.3 + g(X0 - 2 + a), Z - 0.02], 0, L + 4, 0, 1.6, 0.7, { op: 0.4, ragged: 0.2 }) + hatch3((a, b) => [sx(X0 - 2 + a), b - 0.3 + g(X0 - 2 + a), Z - 0.02], 0, L + 4, 0, 0.8, -0.8, { op: 0.35, ragged: 0.3 }); }
    // barnacles and frozen kelp at the old waterline, just above the ice
    s += BL.blisters(Pt(X0 + L / 2, 0.35)[0], Pt(0, 0.35)[1], Math.abs(Pt(X1, 0)[0] - Pt(X0, 0)[0]) * 0.48, Math.round(L * 3), fg('#6a7078'), { size: Math.max(0.6, k * 0.022), flat: 0.05 });
    for (let j = 0; j < L * 1.2; j++) { const X = X0 + R() * L, a = Pt(X, g(X) + 0.6); s += line([a, [a[0] + (R() - 0.5) * 3, a[1] + k * (0.25 + R() * 0.4)]], Math.max(0.8, k * 0.04), fg('#2e3a2e'), 0.8); }
    s += '</g>';
    // ---- wales: heavy strakes standing proud, each with a shadow strip under it and rime on top; icicles hang from them
    const wales = [[1.35, 0.3], [3.4, 0.24], [5.55, 0.22]];
    for (const [wy, th] of wales) {
      const pts = [], und = []; for (let i = 0; i <= N; i++) { const X = X0 - 0.4 + (L + 0.8) * i / N; pts.push(Pt(X, g(X) + wy, -0.06)); und.push(Pt(X, g(X) + wy - th * 1.1, -0.02)); }
      const band = [...pts, ...pts.slice().reverse().map(([x, y]) => [x, y + k * th])];
      s += fillP([...pts.map(([x, y]) => [x, y + k * th]), ...und.slice().reverse()], '#000', 0.35);
      s += fillP(band, WALE) + `<path d="${p2(band)}" fill="url(#mottle)" opacity="0.3"/>` + pline(pts, Math.max(0.7, ink * 0.8), INK) + pline(pts.map(([x, y]) => [x, y + k * th]), Math.max(0.9, ink * 1.1), INK);
      s += BL.rimeEdge(pts.map(([x, y]) => [x, y - 0.5]), { w: Math.max(1.2, k * 0.07), col: RIME });
      for (let j = 0; j < L * 1.1; j++) { const t = R(), p = pts[Math.floor(t * N)]; const len = k * (0.15 + Math.pow(R(), 2.2) * 1.4); s += BL.icicle(p[0] + (R() - 0.5) * 3, p[1] + k * th, len, Math.max(1, Math.min(k * 0.07, len * 0.16)), { col: RIME, ink: Math.max(0.5, ink * 0.6) }); }
    }
    // ---- gunports in two tiers, following the sheer; every state; ports are smaller than they read from afar (0.6 m)
    const tiers = [[1.95, o.ports ? o.ports[0] : 12, 0.6], [4.05, o.ports ? o.ports[1] : 11, 0.55]];
    const chX = (o.masts || []).map(m => m[0]);
    for (const [ty, n, ps] of tiers) for (let j = 0; j < n; j++) {
      const X = X0 + 1.8 + (j + (ty > 3 ? 0.5 : 0.15) + (R() - 0.5) * 0.3) * (L - 4) / n;
      if (R() < 0.08) continue;                                                     // a port planked over after battle damage
      if (X > X1 - 1.6) continue;
      if (chX.some(c => Math.abs(X - c) < 0.5) && ty > 3) continue;               // the channels sit over these
      const y0 = g(X) + ty, a = Pt(X - ps / 2, y0, -0.07), b = Pt(X + ps / 2, y0 + ps, -0.07), w = b[0] - a[0], h = a[1] - b[1];
      const st = R(), lidC = fg('#26282c');
      if (st < 0.28) {                                                              // closed: the lid flush, its hinge straps
        s += `<path d="${p2([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]])}" fill="${mix(HULL, '#000', 0.2)}" stroke="${INK}" stroke-width="${f1(ink * 0.8)}"/>` + pline([[a[0] + w * 0.1, b[1] + h * 0.3], [b[0] - w * 0.15, b[1] + h * 0.3]], Math.max(0.6, k * 0.025), fg('#4a4c50')) + pline([[a[0] + w * 0.1, b[1] + h * 0.7], [b[0] - w * 0.15, b[1] + h * 0.7]], Math.max(0.6, k * 0.025), fg('#4a4c50'));
        s += BL.rimeEdge([[a[0], b[1] - 0.5], [b[0], b[1] - 0.5]], { w: Math.max(0.8, k * 0.05), col: RIME });
      } else {
        // the open port: not black but the dark of the gun deck with the gun's carriage and a cold glint
        s += fillP([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], '#07090b') + fillP([[a[0], a[1] - h * 0.35], [b[0], a[1] - h * 0.35], [b[0], a[1]], [a[0], a[1]]], fg('#1a1c20'));
        s += inkP([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], Math.max(0.8, ink * 0.9));
        // the lid: raised (seen from below, a thin dark slab angled up), hanging askew on one hinge, or gone
        if (st < 0.72) { const ang = st < 0.5 ? 0 : (R() - 0.5) * 0.8, lw = w * 1.08, lh = h * (st < 0.5 ? 0.35 : 0.9); const p0 = [a[0] - w * 0.04, b[1]], q = st < 0.5 ? [p0, [p0[0] + lw, p0[1]], [p0[0] + lw + w * 0.08, p0[1] - lh], [p0[0] + w * 0.12, p0[1] - lh * 1.1]] : [[b[0], b[1]], [b[0] + Math.cos(1.2 + ang) * w * 0.2, b[1] + h * 0.1], [b[0] + w * 0.3, b[1] + lh], [b[0] + w * 0.05, b[1] + lh * 1.05]];
          s += cel(q, { Z, fill: lidC, band: Math.max(0.8, k * 0.03) }) + BL.rimeEdge([q[3], q[2]], { w: Math.max(0.8, k * 0.045), col: RIME });
          if (st < 0.5) s += BL.icicles([q[3][0], q[3][1] + lh * 0.95], [q[2][0], q[2][1] + lh * 0.95], 4, { max: k * 0.35, col: RIME }); }
        // the muzzle: a short dark cylinder with a rimed top and its tompion hanging; or a frozen gunner leaning out
        if (o.gunners && R() < 0.16) { const m = [(a[0] + b[0]) / 2, a[1] - h * 0.35], hh = h * 0.95; s += `<path d="${smooth([[m[0] - w * 0.3, m[1]], [m[0] - w * 0.34, m[1] - hh * 0.6], [m[0] - w * 0.12, m[1] - hh], [m[0] + w * 0.18, m[1] - hh * 0.95], [m[0] + w * 0.32, m[1] - hh * 0.5], [m[0] + w * 0.36, m[1]]], true, 0.5)}" fill="${fg('#a8b0b4')}" stroke="${INK}" stroke-width="${f1(ink * 0.7)}"/>` + BL.rimeEdge([[m[0] - w * 0.3, m[1] - hh * 0.6], [m[0] - w * 0.1, m[1] - hh]], { w: 1, col: SNOW }); }
        else if (R() < 0.85) { const m = [(a[0] + b[0]) / 2 + (R() - 0.5) * w * 0.15, a[1] - h * 0.45], r = w * 0.22; s += `<ellipse cx="${f1(m[0])}" cy="${f1(m[1])}" rx="${f1(r * 1.1)}" ry="${f1(r)}" fill="${fg('#2a2c30')}" stroke="${INK}" stroke-width="${f1(ink * 0.7)}"/><ellipse cx="${f1(m[0] + r * 0.1)}" cy="${f1(m[1] + r * 0.05)}" rx="${f1(r * 0.55)}" ry="${f1(r * 0.5)}" fill="${R() < 0.4 ? '#000' : fg('#3a4048')}"/>` + BL.rimeEdge([[m[0] - r, m[1] - r * 0.5], [m[0] + r * 0.6, m[1] - r]], { w: Math.max(0.6, r * 0.25), col: SNOW }); }
        if (o.burst && j === Math.floor(n / 2) && ty < 3) { const m = [(a[0] + b[0]) / 2, a[1] - h * 0.45]; s += fillP([[m[0] - w * 0.3, m[1] - w * 0.1], [m[0] - w * 0.5, m[1] - w * 0.5], [m[0] - w * 0.1, m[1] - w * 0.25], [m[0] + w * 0.1, m[1] - w * 0.6], [m[0] + w * 0.2, m[1] - w * 0.2], [m[0] + w * 0.5, m[1] - w * 0.4], [m[0] + w * 0.3, m[1] + w * 0.1]], fg('#2a2c30')) + inkP([[m[0] - w * 0.3, m[1] - w * 0.1], [m[0] - w * 0.5, m[1] - w * 0.5], [m[0] - w * 0.1, m[1] - w * 0.25], [m[0] + w * 0.1, m[1] - w * 0.6], [m[0] + w * 0.2, m[1] - w * 0.2], [m[0] + w * 0.5, m[1] - w * 0.4], [m[0] + w * 0.3, m[1] + w * 0.1]], ink); }
      }
      s += BL.icicles([a[0] - 1, a[1] + 1], [b[0] + 1, a[1] + 1], 3, { max: k * (0.3 + R() * 0.9), col: RIME, wk: 0.13 });
    }
    // ---- breaking the port rows: sheets of frozen spray draped over stretches of the side (from the wale down over two to
    // four ports, an icicle fringe at their foot), and snow drifted up over the lower tier in places
    for (let i = 0; i < Math.round(L / 9); i++) { const xa = X0 + 2 + R() * (L - 8), xb = xa + 2 + R() * 3, ya = 5.4, yb = 1.6 + R() * 1.6; const top = [], bot = []; for (let k2 = 0; k2 <= 8; k2++) { const X = xa + (xb - xa) * k2 / 8; top.push(Pt(X, g(X) + ya, -0.1)); bot.push(Pt(X, g(X) + yb + Math.sin(k2 * 1.9) * 0.35 + R() * 0.2, -0.1)); }
      const sh = [...top, ...bot.slice().reverse()]; s += fillS(sh, RIME, 0.82, 0.3) + fillS(sh.map(([x, y]) => [x + 2, y]), '#8a9eae', 0.25, 0.3) + line(bot, Math.max(0.6, inkW(Z) * 0.8), INK, 0.6); for (let k2 = 0; k2 < 6; k2++) { const x = top[k2][0] + R() * 6; s += line([[x, top[0][1] + 4], [x + (R() - 0.5) * 3, bot[k2][1] - 2]], 0.6, '#ffffff', 0.5); } s += BL.icicles(bot[0], bot[8], 8, { max: k * 0.6, col: RIME }); }
    for (let i = 0; i < Math.round(L / 12); i++) { const xa = X0 + R() * L, xb = xa + 2 + R() * 4, pts = []; for (let k2 = 0; k2 <= 8; k2++) { const t = k2 / 8, X = xa + (xb - xa) * t; pts.push(Pt(X, g(X) + 0.4 + 1.9 * Math.sin(t * Math.PI) * (0.7 + R() * 0.3), -0.3)); } s += fillS([Pt(xa, 0, -0.3), ...pts, Pt(xb, 0, -0.3)], SNOW, 0.95, 0.4) + line(pts.slice(1, 6), 0.8, '#8a9aaa', 0.6); }
    // ---- channels at each mast: a ledge standing out at the upper wale with deadeyes, the chain plates running down
    // diagonally across the ports, the shrouds rising from the deadeyes (in front of the hull)
    for (const [mX, mh] of o.masts || []) {
      const y = g(mX) + 5.75, a = Pt(mX - 1.9, y, -0.35), b = Pt(mX + 1.9, y + 0.05, -0.35);
      s += fillP([a, b, [b[0], b[1] + k * 0.16], [a[0], a[1] + k * 0.16]], WALE) + inkP([a, b, [b[0], b[1] + k * 0.16], [a[0], a[1] + k * 0.16]], ink) + BL.rimeEdge([[a[0], a[1] - 0.5], [b[0], b[1] - 0.5]], { w: Math.max(1.4, k * 0.1), col: SNOW });
      s += BL.icicles([a[0], a[1] + k * 0.17], [b[0], b[1] + k * 0.17], 10, { max: k * (1.0 + R() * 1.0), col: RIME, wk: 0.11 });
      const top = Pt(mX + 0.1 * dir, rail(mX) + mh * 0.47, 6.5);
      for (let i = 0; i < 6; i++) { const X = mX - 1.6 + i * 0.64, d = Pt(X, y + 0.25, -0.38), cp = Pt(X - 0.25 * dir, y - 1.5, -0.1);
        s += pline([[d[0], d[1] + k * 0.14], cp], Math.max(0.8, k * 0.04), INK) + `<ellipse cx="${f1(d[0])}" cy="${f1(d[1])}" rx="${f1(Math.max(1, k * 0.09))}" ry="${f1(Math.max(1.2, k * 0.12))}" fill="${fg('#2a2826')}" stroke="${INK}" stroke-width="0.6"/>`;
        s += line([d, top], Math.max(0.7, k * 0.04), RIG, 0.95);
        if (k > 9) s += BL.rimeEdge([[d[0] - 1, d[1] - 2], [d[0] + (top[0] - d[0]) * 0.25 - 1, d[1] + (top[1] - d[1]) * 0.25]], { w: Math.max(0.6, k * 0.03), col: RIME }); }
      // ratlines across the shrouds, sagging, a few broken and hanging
      for (let r = 1; r < 14; r++) { const t = r / 15, A = Pt(mX - 1.6 + (0.1 * dir + 1.6) * t, y + 0.25 + (rail(mX) + mh * 0.47 - y) * t, -0.38 + 6.9 * t), Bp = Pt(mX + 1.6 - (1.6 - 0.1 * dir) * t, y + 0.25 + (rail(mX) + mh * 0.47 - y) * t, -0.38 + 6.9 * t); if (A[1] < (o.cut ?? -50)) continue; s += line([A, [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2 + 1.2], Bp], Math.max(0.4, k * 0.02), RIG, 0.65); }
    }
    // ---- the rail and hammock nettings: snow lying thick on it, the hull's top inked heavy
    const railS = top.map(([X, Y]) => Pt(X, Y));
    s += BL.rimeEdge(railS.map(([x, y]) => [x, y + 0.5]), { w: Math.max(2, k * 0.14), col: SNOW }) + pline(railS, Math.max(1.2, inkH(Z) * 0.7), INK);
    // ---- the quarter gallery near the stern: a bulging box of windows with a curved roof and a hanging finial
    { const Xq = X0 + 1.6, yb = g(Xq) + 3.5, yt = g(Xq) + 6.1, w2 = 1.2; const q = [Pt(Xq - w2, yb), Pt(Xq + w2, yb + 0.1), Pt(Xq + w2 * 1.05, yt), Pt(Xq - w2 * 1.05, yt + 0.05)].map(p => [p[0], p[1]]);
      s += cel(q, { Z, fill: fg('#2a2e34'), band: Math.max(1, k * 0.05) });
      for (let i = 0; i < 3; i++) { const a = Pt(Xq - w2 * 0.8 + i * w2 * 0.58, yb + 0.9, -0.03), b = Pt(Xq - w2 * 0.8 + i * w2 * 0.58 + w2 * 0.4, yb + 2.0, -0.03); s += fillP([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], fg('#4a5866')) + pline([[(a[0] + b[0]) / 2, b[1]], [(a[0] + b[0]) / 2, a[1]]], 0.6, INK) + pline([[a[0], (a[1] + b[1]) / 2], [b[0], (a[1] + b[1]) / 2]], 0.6, INK) + inkP([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], ink * 0.8) + fillP([[a[0], b[1]], [b[0], b[1]], [a[0] + (b[0] - a[0]) * 0.4, a[1]]], '#e4ecf0', 0.25); }
      const roof = [Pt(Xq - w2 * 1.1, yt), Pt(Xq, yt + 0.8), Pt(Xq + w2 * 1.1, yt)]; s += fillS([...roof, [roof[2][0], roof[2][1] + 2], [roof[0][0], roof[0][1] + 2]], fg('#24262a')) + BL.rimeEdge(roof, { w: Math.max(1.6, k * 0.1), col: SNOW });
      const fb = Pt(Xq, yb - 0.9); s += fillS([[q[0][0], q[0][1]], [q[1][0], q[1][1]], fb], fg('#24262a')) + inkP([[q[0][0], q[0][1]], [q[1][0], q[1][1]], fb], ink) + BL.icicles([q[0][0] + 2, q[0][1] + 2], [fb[0], fb[1]], 5, { max: k * 0.5, col: RIME }); }
    // ---- the beakhead and figurehead at the bow, rimed; the bowsprit raking up
    { const st = Pt(X1 + 1.6, rail(X1) + 0.7), fh = Pt(X1 + 1.9, rail(X1) - 0.6), bs = Pt(X1 + (o.sprit || 9), rail(X1) + 5.5);
      s += line([st, bs], Math.max(2, k * 0.36) + 1.6, INK) + line([st, bs], Math.max(1.2, k * 0.36), fg('#2a2a2c')) + BL.rimeEdge([st, bs].map(([x, y]) => [x, y - 1]), { w: Math.max(1, k * 0.08), col: SNOW });
      const body = [[fh[0] - k * 0.15, fh[1] - k * 0.9], [fh[0] + k * 0.3 * dir, fh[1] - k * 0.6], [fh[0] + k * 0.45 * dir, fh[1] - k * 0.1], [fh[0] + k * 0.25 * dir, fh[1] + k * 0.6], [fh[0] - k * 0.1, fh[1] + k * 0.5]];
      s += cel(body, { Z, fill: fg('#8a9098'), band: Math.max(1, k * 0.06) }) + BL.rimeEdge(body.slice(0, 3), { w: Math.max(1, k * 0.08), col: SNOW }) + BL.icicles(body[3], body[4], 4, { max: k * 0.5, col: RIME });
      for (const dy of [0.6, 1.4]) s += line([Pt(X1 - 0.5, rail(X1) - dy), Pt(X1 + 1.5, rail(X1) - dy - 0.3)], Math.max(0.9, k * 0.06), INK) ; }
    // ---- pressure ice heaped against the waterline: plates shoved up the hull, snow drifted into a ramp
    s += wedges(Array.from({ length: 12 }, (_, i) => Pt(X0 - 1 + (L + 2) * i / 11, 0, -0.6)), Math.round(L * 1.4), { size: [k * 0.3, k * 1.3], cols: [fg('#e4ecf0'), fg('#b4c4d0'), fg('#7a8e9e')], rime: SNOW, Z });
    return { svg: s, rail, g, Pt };
  }

  // ---------------------------------------------------------------- polish round: soft atmosphere, gradients, trees
  // smooth gradients are allowed for skies, fog and light glows only (Cole, 2026-11-24 polish brief)
  function skyGrad(stops, o = {}) { const g = id('sg'); S.DEFS.push(`<linearGradient id="${g}" x1="0" y1="${o.y0 ?? 0}" x2="0" y2="${o.y1 ?? H}" gradientUnits="userSpaceOnUse">${stops.map(([t, c, op]) => `<stop offset="${t}" stop-color="${c}"${op !== undefined ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`); return `<rect x="${o.x0 ?? -10}" y="${o.y0 ?? 0}" width="${o.w ?? W + 20}" height="${(o.y1 ?? H) - (o.y0 ?? 0)}" fill="url(#${g})"/>`; }
  function radGlow(x, y, rx, ry, col, op, o = {}) { const g = id('rg'); S.DEFS.push(`<radialGradient id="${g}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="${o.mid ?? 0.35}" stop-color="${col}" stop-opacity="${op * (o.midOp ?? 0.55)}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#${g})"/>`; }
  const blurIds = {}; const blurF = sd => { const k = Math.round(sd * 2); if (!blurIds[k]) { blurIds[k] = id('bl'); S.DEFS.push(`<filter id="${blurIds[k]}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); } return blurIds[k]; };
  // a soft-edged mass (cloud, steam, smoke, fog): a lobed shape, blurred at its edge
  function softMass(x, y, rx, ry, col, op, o = {}) { const b = blob(x, y, rx, ry, o.n || 14, o.jag ?? 0.35, o.rot || 0); return `<path d="${smooth(b, true, 0.8)}" fill="${col}" opacity="${f1(op * 100) / 100}" filter="url(#${blurF(o.blur ?? Math.max(1.5, Math.min(rx, ry) * 0.22))})"/>`; }
  // a soft cloud: several masses of varied size, a lit top (toward the upper-left key), a shaded underside, wisps breaking
  // off downwind; o.lit / o.mid / o.shade colours
  function softCloud(x, y, w, h, o = {}) {
    let s = ''; const n = o.n || 5 + Math.floor(R() * 4);
    s += softMass(x + w * 0.05, y + h * 0.25, w * 0.55, h * 0.45, o.shade || '#5a6470', (o.op ?? 1) * 0.75);
    for (let i = 0; i < n; i++) { const u = (i + R() * 0.6) / n - 0.5, r = w * (0.16 + R() * 0.22) * (1 - Math.abs(u) * 0.8); s += softMass(x + u * w, y - h * (0.1 + R() * 0.5) * (1 - Math.abs(u)), r, r * (0.55 + R() * 0.3), o.mid || '#8a96a2', (o.op ?? 1) * (0.6 + R() * 0.3)); }
    for (let i = 0; i < Math.ceil(n / 2); i++) { const u = (R() - 0.6) * 0.8, r = w * (0.1 + R() * 0.12); s += softMass(x + u * w - r * 0.2, y - h * (0.35 + R() * 0.4), r, r * 0.5, o.lit || '#dce4ea', (o.op ?? 1) * (0.45 + R() * 0.3)); }
    for (let i = 0; i < (o.wisps ?? 3); i++) { const sx = x + w * (0.3 + R() * 0.3), sy = y + (R() - 0.3) * h * 0.6, l = w * (0.3 + R() * 0.5), pts = []; for (let k = 0; k <= 6; k++) pts.push([sx + l * k / 6, sy + Math.sin(k * 0.9 + i) * h * 0.06 + k * h * 0.02]); s += `<path d="${smooth(pts, false, 0.6)}" stroke="${o.mid || '#8a96a2'}" stroke-width="${f1(h * (0.08 + R() * 0.08))}" fill="none" stroke-linecap="round" opacity="${f1((o.op ?? 1) * 0.4)}" filter="url(#${blurF(Math.max(1, h * 0.05))})"/>`; }
    if (o.ink !== false) { const top = []; for (let k = 0; k <= 10; k++) { const u = k / 10 - 0.5; top.push([x + u * w * 0.9, y - h * 0.55 * Math.sqrt(Math.max(0, 1 - 4 * u * u)) * (0.8 + R() * 0.3)]); } s += `<path d="${smooth(top, false, 0.6)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="${o.inkOp ?? 0.18}" stroke-dasharray="${f1(10 + R() * 14)} ${f1(6 + R() * 10)}"/>`; }
    return s;
  }
  // soft steam or smoke rising from (x,y): masses growing and thinning as they rise, drifting, wisps breaking off
  function softSteam(x, y, h, w, o = {}) {
    let s = ''; const n = o.n || 9, col = o.col || '#e8ecee';
    for (let i = 0; i < n; i++) { const t = i / (n - 1), cx = x + (o.drift || 0.2) * h * t * t + Math.sin(t * 5 + x) * w * 0.15, cy = y - h * t, r = w * (0.25 + t * 0.75) * (0.8 + R() * 0.4);
      s += softMass(cx, cy, r, r * (0.6 + R() * 0.3), i < (o.hotN || 0) ? (o.hot || col) : col, (o.op ?? 0.35) * (1 - t * 0.75), { blur: r * 0.35 }); }
    for (let i = 0; i < (o.wisps ?? 2); i++) { const t = 0.4 + R() * 0.5, sx = x + (o.drift || 0.2) * h * t * t, sy = y - h * t, pts = []; for (let k = 0; k <= 5; k++) pts.push([sx + k * w * 0.4, sy - k * w * 0.15 + Math.sin(k + i) * 3]); s += `<path d="${smooth(pts, false, 0.6)}" stroke="${col}" stroke-width="${f1(w * 0.12)}" fill="none" stroke-linecap="round" opacity="${f1((o.op ?? 0.35) * 0.5)}" filter="url(#${blurF(w * 0.06)})"/>`; }
    return s;
  }
  // an organic tree (dead, winter): a tapering trunk with smooth sides and a root flare running into the ground, branches
  // as tapering ribbons that bend smoothly and thin at every fork, twigs; rime on the upper (windward, left) side.
  // (x, y): the ground point; h: height px; o.col, o.rime, o.lean, o.Z
  function tree(x, y, h, o = {}) {
    // kinds: 'yew' (wind-bent, a massive low crown of dark evergreen masses on thick limbs swept downwind, snow on the
    // masses), 'thorn' (bare, crooked, limbs swept downwind ending in soft fans of fine twigs, no spikes). Wind blows to the
    // right (+x). Every trunk has a root flare running into the ground.
    const kind = o.kind || 'thorn', col = o.col || '#2a2822', Z = o.Z || 20, wind = o.wind ?? 0.55, rimeC = o.rime || '#e4eae4';
    let s = '', twigs = '', masses = [];
    const ribbon = (pts, w0, w1) => { const L = [], Rr = []; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], pr = pts[Math.max(0, i - 1)], dx = q[0] - pr[0], dy = q[1] - pr[1], l = Math.hypot(dx, dy) || 1, u = i / (pts.length - 1), w = (w0 + (w1 - w0) * Math.pow(u, 0.8)) / 2; L.push([p[0] - dy / l * w, p[1] + dx / l * w]); Rr.push([p[0] + dy / l * w, p[1] - dx / l * w]); } return [L, Rr]; };
    const tube = (pts, w0, w1, rim = true) => { const [L, Rr] = ribbon(pts, w0, w1); let t = `<path d="${smooth([...L, ...Rr.slice().reverse()], true, 0.5)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, Math.min(1.6, w0 * 0.16)))}"/>`; if (w0 > 3) t += `<path d="${smooth(Rr, false, 0.5)}" stroke="${INK}" stroke-width="${f1(w0 * 0.22)}" fill="none" opacity="0.35"/>`; if (rim && w0 > 1.6) t += `<path d="${smooth(L.slice(0, -1), false, 0.5)}" stroke="${rimeC}" stroke-width="${f1(Math.max(0.7, w0 * 0.2))}" fill="none" opacity="0.8"/>`; return t; };
    // a limb: a smooth curve whose direction eases toward the wind and droops with length; branches thin at each fork
    const limb = (x0, y0, ang, len, w, d) => {
      const n = 12, pts = [[x0, y0]]; let cx = x0, cy = y0, a = ang;
      for (let i = 0; i < n; i++) { const t = i / n; a = a + (0 - a) * wind * 0.06 + (Math.PI / 2 - a) * 0.012 * t + (R() - 0.5) * 0.05; cx += Math.cos(a) * len / n; cy += Math.sin(a) * len / n; pts.push([cx, cy]); }
      const wEnd = Math.max(0.5, w * (d > 0 ? 0.42 : 0.2));
      s += tube(pts, w, wEnd);
      if (d > 0) { const nb = kind === 'yew' ? 2 : 2 + (R() < 0.5 ? 1 : 0); for (let b = 0; b < nb; b++) { const k = 4 + Math.floor(R() * 6), side = b % 2 ? 1 : -1, wk = w + (wEnd - w) * k / n; limb(pts[k][0], pts[k][1], a + side * (0.35 + R() * 0.45), len * (0.5 + R() * 0.25), wk * 0.7, d - 1); } }
      const tip = pts[n];
      if (kind === 'yew' && d <= 1) masses.push([tip[0] + len * 0.1, tip[1], len * (0.5 + R() * 0.25)]);
      else if (d <= 1) { // a fan of fine twigs (curved hairlines) plus a soft dark haze: a mass, not spikes
        for (let k = 0; k < 7; k++) { const aa = a + (R() - 0.4) * 1.6, l2 = len * (0.25 + R() * 0.35), p0 = pts[n - Math.floor(R() * 4)]; twigs += `M${f1(p0[0])} ${f1(p0[1])} q${f1(Math.cos(aa) * l2 * 0.5 + 2)} ${f1(Math.sin(aa) * l2 * 0.5 - 2)} ${f1(Math.cos(aa) * l2)} ${f1(Math.sin(aa) * l2)} `; }
        masses.push([tip[0], tip[1], len * 0.35]); }
    };
    // root flare: roots spreading over the ground from the foot, tapering into the earth
    const tw0 = h * (o.girth ?? (kind === 'yew' ? 0.11 : 0.07));
    for (let i = 0; i < 5; i++) { const sd = i % 2 ? 1 : -1, l = tw0 * (1.5 + R() * 2), pts = []; for (let k = 0; k <= 6; k++) { const t = k / 6; pts.push([x + sd * (tw0 * 0.2 + l * t), y - tw0 * 0.6 * (1 - t) * (1 - t) + t * 2]); } s += tube(pts, tw0 * (0.6 + R() * 0.3), 0.6, false); }
    // the trunk: short and leaning downwind (more for the yew), smooth taper, bark furrows following the twist
    const lean = (o.lean || 0) + wind * (kind === 'yew' ? 0.28 : 0.22), th = h * (kind === 'yew' ? 0.36 : 0.45), tp = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; tp.push([x + Math.sin(lean) * th * t * t * 1.2 + Math.sin(t * 3 + x) * tw0 * 0.15, y - th * t]); }
    s += tube(tp, tw0 * 2.2, tw0 * 1.25);
    const [TL, TR] = ribbon(tp, tw0 * 2.2, tw0 * 1.25);
    for (let k = 1; k < 4; k++) { const u = k / 4; s += `<path d="${smooth(tp.map((p, i) => [TL[i][0] + (TR[i][0] - TL[i][0]) * (u + 0.08 * Math.sin(i * 0.9 + k)), p[1]]), false, 0.5)}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.45"/>`; }
    const top = tp[10];
    if (kind === 'yew') { limb(top[0], top[1], -Math.PI / 2 + 0.2, h * 0.5, tw0 * 1.3, 2); limb(top[0], top[1] + th * 0.05, -0.25, h * 0.55, tw0 * 1.2, 2); limb(tp[7][0], tp[7][1], -Math.PI + 0.5, h * 0.32, tw0 * 0.9, 1); }
    else { limb(top[0], top[1], -Math.PI / 2 + 0.35, h * 0.5, tw0 * 1.2, 3); limb(top[0], top[1] + th * 0.05, -0.45, h * 0.46, tw0 * 1.05, 2); limb(tp[7][0], tp[7][1], -Math.PI + 0.7, h * 0.3, tw0 * 0.8, 2); }
    // the crown: yew foliage as dark lobed masses (lit upper-left rim, snow lying on their tops); thorn twigs as a haze
    let crown = '';
    if (kind === 'yew') for (const [mx, my, r] of masses.sort((a, b) => a[1] - b[1])) { const b2 = blob(mx, my, r * 1.2, r * 0.5, 16, 0.45); crown += cel(b2, { Z, fill: o.leaf || '#1e2a22', band: r * 0.3, tex: 'url(#mottle)', texOp: 0.5 }) + fillS(blob(mx - r * 0.15, my - r * 0.35, r * 0.75, r * 0.22, 10, 0.4), o.snow || '#e8ece4', 0.9) + BL.icicles([mx - r * 0.6, my + r * 0.45], [mx + r * 0.6, my + r * 0.5], 3, { max: r * 0.25, col: rimeC }); }
    else { for (const [mx, my, r] of masses) crown += softMass(mx, my, r, r * 0.6, col, 0.35, { blur: r * 0.3 }); crown += `<path d="${twigs}" stroke="${col}" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.9"/>`; }
    s = (kind === 'thorn' ? crown : '') + s + (kind === 'yew' ? crown : '');
    if (o.snow) s += fillS([[x - tw0 * 4.5, y + 2], [x - tw0 * 2, y - tw0 * 0.5], [x, y - tw0 * 0.7], [x + tw0 * 2.4, y - tw0 * 0.35], [x + tw0 * 5, y + 2]], o.snow, 0.95, 0.5);
    return s;
  }
  // smooth mountains: a soft silhouette (few, smoothed points), snow lying on the slopes facing the light as soft masses,
  // shade on the slopes turned away, couloirs as smooth tapering streaks; no facets
  function mountains(x0, x1, yb, h, o = {}) {
    const top = ridgePts(x0, x1, yb, h, Object.assign({ iter: 3, rough: 0.22 }, o)), col = o.col || '#6a7480';
    const poly = [[x0, yb + 40], ...top, [x1, yb + 40]], d = smooth(poly, true, 0.45), cid = id('mt');
    let s = `<path d="${d}" fill="${col}"/><path d="${d}" fill="url(#mottle)" opacity="0.2"/><clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`;
    for (let i = 1; i < top.length; i++) { const a = top[i - 1], b = top[i], up = b[1] < a[1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (up && o.snow) s += softMass(mx - len * 0.15, my + h * 0.18, len * 0.7, h * 0.28, o.snow, 0.85, { rot: Math.atan2(b[1] - a[1], b[0] - a[0]) * 0.6, blur: Math.max(1.5, h * 0.04) });
      else if (!up) s += softMass(mx + len * 0.1, my + h * 0.3, len * 0.6, h * 0.4, o.shade || mix(col, INK, 0.3), 0.5, { blur: Math.max(2, h * 0.06) }); }
    for (let i = 1; i < top.length - 1; i++) if (top[i][1] > top[i - 1][1] && top[i][1] > top[i + 1][1]) { const g = [top[i]]; let x = top[i][0], y = top[i][1]; for (let k = 0; k < 5; k++) { x += (R() - 0.45) * 6; y += h * 0.1; g.push([x, y]); } s += `<path d="${smooth(g, false, 0.6)}" stroke="${o.gully || mix(col, INK, 0.45)}" stroke-width="${f1(1.4 + R())}" fill="none" stroke-linecap="round" opacity="0.5"/>`; }
    s += '</g>' + `<path d="${smooth(top, false, 0.45)}" stroke="${INK}" stroke-width="${f1(o.inkW || 0.9)}" fill="none" opacity="${o.inkOp ?? 0.6}"/>`;
    return { svg: s, top };
  }

  // materials v2 switch: when scenes/materials_v2.READY exists, trees and the custom stone in g3 rooms use the shared
  // materials (MV.tree, MV.stoneMarks, MV.rockSkin); until then the g3 organic tree and no extra stone marks
  const USE_MV_YEW = process.env.G3_MV_YEW !== '0';          // MV.tree yew (with foliage) reads better than the g3 yew; G3_MV_YEW=0 falls back
  const V2 = require('fs').existsSync(require('path').join(__dirname, 'materials_v2.READY'));
  const MV = V2 ? require('./materials_v2')(S) : null;
  const treeV2 = (x, y, h, Z, o = {}) => V2 && !(o.kind === 'yew' && !USE_MV_YEW) ? MV.tree(x, y, h, Z, Object.assign({ kind: o.kind === 'thorn' ? 'windswept' : (o.kind || 'dead'), col: o.col, lean: o.lean || 0, leaves: o.kind === 'yew' }, o.mv || {})).svg + (o.snow ? fillS([[x - h * 0.25, y + 2], [x - h * 0.1, y - h * 0.03], [x + h * 0.12, y - h * 0.02], [x + h * 0.28, y + 2]], o.snow, 0.95, 0.5) : '') : tree(x, y, h, Object.assign({ Z }, o));
  const stoneV2 = (ps, Z, fill, o = {}) => V2 ? MV.stoneMarks(ps, Z, fill, o) : '';
  const rockV2 = (pts, Z, col, o = {}) => V2 ? MV.rockSkin(pts, Z, col, o) : '';
  const inkH = S.inkH;
  return { BK, BL, AIR, air, clouds, glare, shaft, ridge, ridgePts, wedges, plates, snowfall, ship, skyGrad, radGlow, softMass, softCloud, softSteam, tree, mountains, V2, treeV2, stoneV2, rockV2 };
};
