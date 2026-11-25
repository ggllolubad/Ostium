// Shared shell for the abbey interiors. One box-set camera for every room (eye 1.6 m, horizon 430, focal 900): the
// back wall faces us, the side walls recede, the way out is a door in the left wall near the back. Builds the walls,
// floor and ceiling (flat timber or a barrel vault), the door with its stone-traced hover outline, and writes the
// room's SVG layers, light file and hotspots. Layers: bg (behind the keeper), mid (in front of the keeper's legs but
// under hands that rest on it, e.g. a table), fg (in front of everything).
const { G, INK, smooth, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const W = 1600, H = 1000, HZ = 430, E = 1.6, FL = 900, CX = 800;

module.exports = (room, o) => {
  const S = require('./scenekit')({ W, H, HZ, E, FL, CX, seed: o.seed || 77 });
  const { a, R, P, K, pp, PLW, EM, addLight, stones, stones0, shade, planks, archPts, archRing, through, stoneTrace, outline, hot, HOT, PLANES, LIGHTS } = S;
  const HW = o.width / 2, D0 = 2.5, D1 = o.depth, HT = o.height;
  const I = Object.assign({}, S, { HW, D0, D1, HT, W, H, f, mix, dark, light, G, INK, smooth, poly, blob });
  I.panel = fn => { a.raw('<g class="panel">'); fn(); a.raw('</g>'); };
  I.prop = (Z, fn) => { a.raw(`<g class="z_${Math.round(Z * 100)}">`); fn(); a.raw('</g>'); };
  I.seg3 = (p, q, col = INK, w = 2, op = 1) => `<path d="${pp([p, q]).replace(' Z', '')}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
  I.rod = (p, q, col, w) => I.seg3(p, q, INK, w + 3) + I.seg3(p, q, col, w);
  // a face as a tagged polygon: never a flat fill. Every face is shaded across itself, darkened into its edges and grimed.
  I.face = (pts, fill, ink = 1.4, extra = '', o3 = {}) => { const d = pp(pts), solid = /^#/.test(fill);
    a.raw(PLW([pts[0], pts[1], pts[pts.length - 1]], `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${ink}" stroke-linejoin="round"/>` +
      (solid && o3.plain !== true ? `<path d="${d}" fill="url(#fshade)"/><path d="${d}" fill="url(#aoshade)" opacity="0.7"/><path d="${d}" fill="url(#grime)" opacity="${o3.grime === undefined ? 0.35 : o3.grime}"/>` : '') + extra)); };
  // ------------------------------------------------------------------ materials
  // bilinear point inside a quad of 3D corners: u along q0->q1, v along q0->q3
  const quadAt = (q, u, v) => [0, 1, 2].map(i => q[0][i] + (q[1][i] - q[0][i]) * u + (q[3][i] - q[0][i]) * v + (q[0][i] - q[1][i] + q[2][i] - q[3][i]) * u * v);
  I.quadAt = quadAt;
  // wood: boards along u, each its own tone, grain that wanders, knots with rings, nail heads, worn edges, end splits, stains
  I.wood = (q, col, o4 = {}) => {
    const lenV = Math.hypot(...[0, 1, 2].map(i => q[3][i] - q[0][i])), lenU = Math.hypot(...[0, 1, 2].map(i => q[1][i] - q[0][i]));
    const n = o4.boards || Math.max(1, Math.round(lenV / (o4.bw || 0.22))), Zm = (q[0][2] + q[2][2]) / 2, kz = K(Zm);
    let out = `<path d="${pp(q)}" fill="${dark(col, 0.55)}" stroke="${INK}" stroke-width="${f(Math.min(2.4, 1 + kz / 120))}"/>`;
    for (let i = 0; i < n; i++) {
      const v0 = i / n + 0.004, v1 = (i + 1) / n - 0.004, tone = mix(col, R() < 0.5 ? '#c8a878' : '#140c06', R() * 0.32), sag = (R() - 0.5) * 0.02;
      const b = [quadAt(q, 0, v0), quadAt(q, 1, v0 + sag), quadAt(q, 1, v1 + sag), quadAt(q, 0, v1)], bd = pp(b);
      out += `<path d="${bd}" fill="${tone}" stroke="${INK}" stroke-width="${f(Math.min(1.6, 0.6 + kz / 200))}"/><path d="${bd}" fill="url(#bshade)"/>`;
      // grain: long wavy lines, some running out at the board's edge
      const gl = 3 + Math.floor(R() * 4);
      for (let j = 0; j < gl; j++) { const vv = v0 + (v1 - v0) * (0.12 + 0.76 * (j + R() * 0.6) / gl), amp = (v1 - v0) * (0.05 + R() * 0.12), ph = R() * 6, fr = 2 + R() * 5, pts = [];
        for (let k = 0; k <= 16; k++) { const u = k / 16; pts.push(P(...quadAt(q, u, Math.min(v1, Math.max(v0, vv + Math.sin(u * fr + ph) * amp))))); }
        out += `<path d="${smooth(pts, false, 0.5)}" stroke="${dark(tone, 0.45)}" stroke-width="${f(Math.max(0.5, kz * 0.0035))}" fill="none" opacity="${f(0.45 + R() * 0.35)}"/>`; }
      // knots
      if (R() < (o4.knots === undefined ? 0.45 : o4.knots)) { const u = 0.1 + R() * 0.8, c = P(...quadAt(q, u, (v0 + v1) / 2)), rr = Math.max(1.5, kz * (0.012 + R() * 0.012));
        out += `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rr * 1.6)}" ry="${f(rr)}" fill="${dark(tone, 0.5)}" stroke="${INK}" stroke-width="0.7"/><ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rr * 2.6)}" ry="${f(rr * 1.6)}" fill="none" stroke="${dark(tone, 0.35)}" stroke-width="0.6" opacity="0.7"/><ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rr * 3.6)}" ry="${f(rr * 2.1)}" fill="none" stroke="${dark(tone, 0.3)}" stroke-width="0.5" opacity="0.5"/>`; }
      // nails at the ends, worn light along the top edge, an end split, a dark stain
      if (o4.nails !== false && lenU > 0.4) for (const u of [0.04, 0.96]) { const c = P(...quadAt(q, u, (v0 + v1) / 2)), r = Math.max(1, kz * 0.008); out += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="#2a2420" stroke="${INK}" stroke-width="0.5"/><circle cx="${f(c[0] + r * 0.6)}" cy="${f(c[1] + r * 0.8)}" r="${f(r * 1.6)}" fill="#5a2a14" opacity="0.35"/>`; }
      if (R() < 0.6) { const u0 = R() * 0.5, u1 = u0 + 0.2 + R() * 0.4, pa = P(...quadAt(q, u0, v0 + 0.01)), pb = P(...quadAt(q, Math.min(1, u1), v0 + 0.01)); out += `<path d="M${f(pa[0])} ${f(pa[1])} L${f(pb[0])} ${f(pb[1])}" stroke="#e8d0a8" stroke-width="${f(Math.max(0.6, kz * 0.004))}" opacity="0.28"/>`; }
      if (R() < 0.3) { const pa = P(...quadAt(q, R() < 0.5 ? 0 : 1, (v0 + v1) / 2)), pb = P(...quadAt(q, R() < 0.5 ? 0.12 : 0.88, (v0 + v1) / 2 + (R() - 0.5) * (v1 - v0) * 0.4)); out += `<path d="M${f(pa[0])} ${f(pa[1])} L${f(pb[0])} ${f(pb[1])}" stroke="${INK}" stroke-width="1" opacity="0.8"/>`; }
      if (R() < 0.25) { const c = P(...quadAt(q, R(), (v0 + v1) / 2)); out += a.stain(c[0], c[1], kz * (0.05 + R() * 0.08), '#120a04', 0.45); }
    }
    out += `<path d="${pp(q)}" fill="url(#aoshade)" opacity="0.6"/><path d="${pp(q)}" fill="url(#grime)" opacity="0.3"/>`;
    if (o4.raw) return PLW([q[0], q[1], q[3]], out);
    a.raw(PLW([q[0], q[1], q[3]], out));
  };
  // a wooden box with every visible face in boards; boards run horizontally on fronts and sides, along depth on top
  // boards on any face at(s, t): along t by default, along s with o.across (the scenekit's planks, now in real wood)
  I.planks = (at, Ls, Lt, col, o4 = {}) => {
    const q = o4.across ? [at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)] : [at(0, 0), at(0, Lt), at(Ls, Lt), at(Ls, 0)];
    return I.wood(q, col, { raw: true, bw: o4.board || 0.22, nails: o4.nails !== 0, knots: o4.knots });
  };
  I.woodBox = (x0, x1, y0, y1, z0, z1, col, o4 = {}) => {
    if (x1 < 0) I.wood([[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], dark(col, 0.22), o4);
    if (x0 > 0) I.wood([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], dark(col, 0.22), o4);
    if (y1 < E) I.wood([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], light(col, 0.06), Object.assign({}, o4, { bw: o4.topBw || 0.18 }));
    I.wood([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col, o4);
  };
  // metal and other shaded materials for a.shape: a gradient fill plus wear
  I.metal = (col, o5 = {}) => { const id = a.id('mg'); a.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="${light(col, 0.35)}"/><stop offset="0.35" stop-color="${col}"/><stop offset="0.7" stop-color="${dark(col, 0.35)}"/><stop offset="1" stop-color="${dark(col, 0.6)}"/></linearGradient>`); return `url(#${id})`; };
  I.rust = (x, y, r) => a.stain(x, y, r * 0.8, '#4a2410', 0.45) + a.stain(x + r * 0.3, y + r * 0.2, r * 0.4, '#5a2a14', 0.35) + Array.from({ length: 5 }, () => `<circle cx="${f(x + (R() - 0.5) * r * 1.6)}" cy="${f(y + (R() - 0.5) * r * 1.2)}" r="${f(0.5 + R() * 1.2)}" fill="#3a1a0a" opacity="0.7"/>`).join('');
  I.grad = (c0, c1, vertical = true) => { const id = a.id('gr'); a.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`); return `url(#${id})`; };
  // an axis-aligned box: draws the faces the camera can see, front last; o2: { col, side, top, ink, tex }
  I.box = (x0, x1, y0, y1, z0, z1, col, o2 = {}) => {
    const side = o2.side || dark(col, 0.25), top = o2.top || light(col, 0.08), ink = o2.ink || 1.6;
    if (x1 < 0) I.face([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], side, ink);
    if (x0 > 0) I.face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], side, ink);
    if (y1 < E) I.face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], top, ink);
    if (y0 > E) I.face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], side, ink);
    const fr = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]];
    if (o2.front !== false) { I.face(fr, col, ink); if (o2.tex) a.raw(PLW([fr[0], fr[1], fr[3]], `<path d="${pp(fr)}" fill="${o2.tex}" opacity="${o2.texOp || 0.5}"/>`)); if (o2.shade !== false) shade(fr, { depth: o2.depth || 10, grime: o2.grime || 0.5, ink: 0, wash: 0.3 }); }
  };
  // ------------------------------------------------------------------ the shell
  I.shell = () => {
    a.layer('bg');
    a.raw(`<rect width="${W}" height="${H}" fill="#0e0b09"/>`);
    const wall = o.wall, wo = o.wallOpts || { course: 0.4, block: 0.85, streaks: 8 };
    const atB = (s, t) => [-HW + s, t, D1];
    const SPR = o.vault ? o.spring : HT, CROWN = o.vault ? HT - o.spring : 0;
    I.Yv = X => SPR + CROWN * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2));
    if (o.vault) {
      const top = []; for (let i = 0; i <= 24; i++) { const X = -HW + 2 * HW * i / 24; top.push([X, I.Yv(X), D1]); }
      const back = [[-HW, 0, D1], [HW, 0, D1], ...top.reverse()];
      through(back, () => a.raw(stones(atB, 2 * HW, HT, wall, Object.assign({ streaks: 14 }, wo))));
      shade(back, { depth: 22, mottle: 0.45, grime: 0.55, ink: 0, wash: 0.3 });
      const Lt = Math.PI * Math.sqrt((HW * HW + CROWN * CROWN) / 2), atV = (s, t) => { const th = Math.PI * (1 - t / Lt); return [HW * Math.cos(th), SPR + CROWN * Math.sin(th), D0 + s]; };
      const body = stones0(atV, D1 - D0, Lt, o.vaultCol || wall, { course: 0.3, block: 0.62, streaks: 10, vary: 0.2 });
      const N = 12;
      for (let i = 0; i < N; i++) { const t0 = Lt * i / N, t1 = Lt * (i + 1) / N, q = [atV(0, t0), atV(D1 - D0, t0), atV(D1 - D0, t1), atV(0, t1)], id = a.id('vs');
        a.raw(PLW([q[0], q[1], q[3]], `<clipPath id="${id}"><path d="${pp(q)}"/></clipPath><g clip-path="url(#${id})">${body}</g>`));
        shade(q, { depth: 10, mottle: 0.4, grime: 0.5, ink: 0, wash: 0.25, hl: false }); }
      // transverse ribs
      for (const z of o.ribs || []) { const ring = []; for (let i = 0; i <= 20; i++) { const X = -HW + 2 * HW * i / 20; ring.push([X, I.Yv(X) - 0.02, z]); } const ring2 = ring.map(p => [p[0], p[1] - 0.22 * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (p[0] / HW) ** 2))), z]);
        a.raw(PLW([[0, 0, z], [1, 0, z], [0, 1, z]], `<path d="${pp([...ring, ...ring2.reverse()])}" fill="${o.wall2 || wall}" stroke="${INK}" stroke-width="2"/>`)); }
    } else {
      a.raw(stones(atB, 2 * HW, HT, wall, Object.assign({ streaks: 14 }, wo)));
      shade([atB(0, 0), atB(2 * HW, 0), atB(2 * HW, HT), atB(0, HT)], { depth: 22, mottle: 0.45, grime: 0.55, ink: 0, wash: 0.3 });
    }

    for (const side of [-1, 1]) {
      const atS = (s, t) => [side * HW, t, D0 + s];
      a.raw(stones(atS, D1 - D0, SPR, side < 0 ? (o.wall2 || wall) : wall, wo));
      shade([atS(0, 0), atS(D1 - D0, 0), atS(D1 - D0, SPR), atS(0, SPR)], { depth: 18, mottle: 0.45, grime: 0.5, ink: 0, wash: 0.3 });

    }
    const atF = (s, t) => [-HW + s, 0, D0 + t];
    if (o.floor === 'boards') a.raw(I.planks((s, t) => [-HW + t, 0, D0 + s], D1 - D0, 2 * HW, o.floorCol, { across: true, board: 0.24, nails: 40 }));
    else a.raw(stones(atF, 2 * HW, D1 - D0, o.floorCol, { course: 0.42, block: 0.62, vary: 0.16 }));
    shade([atF(0, 0), atF(2 * HW, 0), atF(2 * HW, D1 - D0), atF(0, D1 - D0)], { depth: 16, mottle: 0.5, grime: 0.7, ink: 0, wash: 0.25, hl: false });
    if (o.vault) return;
    // a flat ceiling of boards on heavy beams running side to side
    const atC = (s, t) => [-HW + s, HT, D0 + t];
    a.raw(I.planks((s, t) => [-HW + t, HT, D0 + s], D1 - D0, 2 * HW, o.ceilCol || '#3a2e22', { across: true, board: 0.3, nails: 0 }));
    shade([atC(0, 0), atC(2 * HW, 0), atC(2 * HW, D1 - D0), atC(0, D1 - D0)], { depth: 16, mottle: 0.5, grime: 0.7, ink: 0, wash: 0.35, hl: false });
    for (let z = D1 - 0.4; z > D0; z -= o.beamGap || 1.6) {
      const bw = 0.24, bh = 0.3;
      I.face([[-HW, HT - bh, z], [HW, HT - bh, z], [HW, HT - bh, z + bw], [-HW, HT - bh, z + bw]], '#2a2018', 1.6);      // underside
      I.face([[-HW, HT - bh, z], [HW, HT - bh, z], [HW, HT, z], [-HW, HT, z]], '#3a2c1e', 1.8, `<path d="${pp([[-HW, HT - bh, z], [HW, HT - bh, z], [HW, HT, z], [-HW, HT, z]])}" fill="url(#grain)" opacity="0.5"/>`);
    }
  };
  // ------------------------------------------------------------------ the way out: an opening in the left wall from z0 to z1
  // the way out in a side wall (d.side: -1 left, +1 right), on the side the building's garth door faces, z0..z1 along the wall.
  // Through it: the reveal, the threshold, and a slice of the garth at dusk (ground, the far range with a lit window, the Grey).
  I.door = (z0, z1, d = {}) => {
    const sd = d.side || -1, WX = sd * HW, at = (s, t) => [WX, t, s], ts = d.ts || 1.95, rise = d.rise === undefined ? (z1 - z0) / 2 : d.rise;
    const hole = d.square ? [at(z0, 0), at(z1, 0), at(z1, ts), at(z0, ts)] : archPts(at, z0, z1, 0, ts, rise, 12);
    const out = X => WX + sd * X;
    through(hole, () => {
      // the garth beyond, painted on a far plane facing into the room
      const XF = out(7), zf0 = z0 * 0.4, zf1 = z1 * 3.2, sky = a.id('sk');
      a.raw(`<linearGradient id="${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a6a66"/><stop offset="1" stop-color="#b8b4a8"/></linearGradient>`);
      const fp = (Z, Y) => [XF, Y, Z];
      a.raw(PLW([fp(zf0, 0), fp(zf1, 0), fp(zf0, 1)], EM(`<path d="${pp([fp(zf0, 1.5), fp(zf1, 1.5), fp(zf1, 6), fp(zf0, 6)])}" fill="url(#${sky})"/>`)));
      // the far range: a dark wall, a slate roof line, one window lit warm, a sailcloth awning
      const wall = [fp(zf0, -0.5), fp(zf1, -0.5), fp(zf1, 1.3), fp((z0 + z1) / 2 * (HW + 7) / HW, 1.7), fp(zf0, 1.15)];
      a.raw(PLW([fp(zf0, 0), fp(zf1, 0), fp(zf0, 1)], `<path d="${pp(wall)}" fill="#2a2622" stroke="${INK}" stroke-width="1.2"/>` +
        `<path d="${pp([fp(zf0, 1.15), fp((z0 + z1) / 2 * (HW + 7) / HW, 1.7), fp(zf1, 1.3), fp(zf1, 1.6), fp((z0 + z1) / 2 * (HW + 7) / HW, 2.3), fp(zf0, 1.45)])}" fill="#1a1816" stroke="${INK}" stroke-width="1.2"/>` +
        `<path d="${pp([fp((z0 + z1) / 2 * (HW + 7) / HW + 0.5, 1.4), fp((z0 + z1) / 2 * (HW + 7) / HW + 0.9, 1.4), fp((z0 + z1) / 2 * (HW + 7) / HW + 0.9, 2.6), fp((z0 + z1) / 2 * (HW + 7) / HW + 0.5, 2.6)])}" fill="#1e1c1a" stroke="${INK}" stroke-width="1"/>`));
      { let sm = ''; for (let k = 0; k < 4; k++) { const [sx, sy] = P(XF, 2.8 + k * 0.45, (z0 + z1) / 2 * (HW + 7) / HW + 0.7 + k * 0.25), sr = K(Math.abs(XF)) * (0.3 + k * 0.12); sm += `<ellipse cx="${f(sx)}" cy="${f(sy)}" rx="${f(sr)}" ry="${f(sr * 0.6)}" fill="#8a8680" opacity="${f(0.35 - k * 0.06)}"/>`; } a.raw(sm); }
      const zc = (z0 + z1) / 2 * (HW + 7) / HW, wz = zc - 0.25;
      a.raw(PLW([fp(zf0, 0), fp(zf1, 0), fp(zf0, 1)], EM(`<path d="${pp([fp(wz, 0.35), fp(wz + 0.7, 0.35), fp(wz + 0.7, 0.95), fp(wz, 0.95)])}" fill="#e8963c" stroke="${INK}" stroke-width="1.2"/>`)));
      // the garth's mud and flags running to the door
      I.face([[WX, 0, z0 - 0.4], [out(7), 0, zf0], [out(7), 0, zf1], [WX, 0, z1 + 0.4]], '#3a3226', 1.2);
      for (let k = 0; k < 3; k++) { const X1 = out(2 + k * 1.5), Z = (z0 + z1) / 2 + (R() - 0.5) * 2; a.raw(I.rod([X1, 0, Z], [X1, 1.1 + R() * 0.3, Z], '#2a2420', 3)); }
      for (let k = 0; k < 5; k++) { const Z = z0 + (z1 - z0) * R(), X1 = out(0.6 + R() * 3); I.face([[X1, 0.005, Z - 0.2], [X1 + sd * 0.5, 0.005, Z - 0.2], [X1 + sd * 0.5, 0.005, Z + 0.25], [X1, 0.005, Z + 0.25]], '#5a564c', 0.8); }
      // the reveal: the wall is 0.6 m thick; the door leaf stands open against it
      { const T = 0.28, rv = [[WX, 0, z1], [out(T), 0, z1], [out(T), ts + rise, z1], [WX, ts + rise, z1]];
        a.raw(PLW([[WX, 0, z1], [out(T), 0, z1], [WX, 2, z1]], `<path d="${pp(rv)}" fill="#4a443c" stroke="${INK}" stroke-width="1.2"/>` + Array.from({ length: 6 }, (_, k) => `<path d="${pp([[WX, 0.35 * (k + 1), z1], [out(T), 0.35 * (k + 1), z1]]).replace(' Z', '')}" stroke="${INK}" stroke-width="1" opacity="0.6"/>`).join('') + `<path d="${pp(rv)}" fill="url(#bshade)"/>`)); }
      if (d.leaf === true) a.raw(I.planks((s, t) => [out(0.05 + s * 0.95), t, z1 - 0.02 - s * 0.3], 0.9, ts + 0.1, '#4a3826', { board: 0.15, nails: 6 }));
    });
    addLight(WX - sd * 0.4, 1.8, (z0 + z1) / 2, d.I || 0.75, 5.0, d.col || [0.66, 0.66, 0.7]);
    if (d.square) {
      for (const [p, q] of [[[z0 - 0.12, 0], [z0, ts + 0.12]], [[z1, 0], [z1 + 0.12, ts + 0.12]], [[z0 - 0.12, ts], [z1 + 0.12, ts + 0.2]]]) I.wood([at(p[0], p[1]), at(q[0], p[1]), at(q[0], q[1]), at(p[0], q[1])], '#3e2e20', { boards: 1, knots: 0.3, nails: false });
    } else {
      a.raw(archRing(at, z0, z1, ts, rise, 0.2, d.ring || o.wall2 || o.wall, 7));
      for (const z of [z0 - 0.2, z1]) for (let t = 0; t < ts; t += 0.38) a.raw(PLW([at(z, t), at(z + 0.2, t), at(z, t + 0.3)], `<path d="${pp([at(z, t + 0.02), at(z + 0.2, t + 0.02), at(z + 0.2, t + 0.36), at(z, t + 0.36)])}" fill="${mix(o.wall2 || o.wall, '#a89a80', R() * 0.25)}" stroke="${INK}" stroke-width="1.1"/><path d="${pp([at(z, t + 0.02), at(z + 0.2, t + 0.02), at(z + 0.2, t + 0.36), at(z, t + 0.36)])}" fill="url(#bshade)"/>`));
    }
    // the worn threshold step into the room
    I.face([[WX, 0.12, z0 - 0.15], [WX - sd * 0.35, 0.12, z0 - 0.15], [WX - sd * 0.35, 0.12, z1 + 0.15], [WX, 0.12, z1 + 0.15]], '#6a6256', 1.2);
    I.face([[WX - sd * 0.35, 0, z0 - 0.15], [WX - sd * 0.35, 0.12, z0 - 0.15], [WX - sd * 0.35, 0.12, z1 + 0.15], [WX - sd * 0.35, 0, z1 + 0.15]], '#3e3830', 1.2);
    hot('exit', 'To the garth', hole.map(p => P(...p)));
    { const dep = d.square ? 0.14 : 0.2, head = d.square ? [at(z0 - dep, ts + dep), at(z1 + dep, ts + dep)] : S.arcPts(at, z0 - dep, z1 + dep, ts, rise + dep, 18), x = WX - sd * 0.01;
      outline('exit', [[[[x, 0.12, z0 - dep], ...head.map(p => [x, p[1], p[2]]), [x, 0.12, z1 + dep], [WX - sd * 0.36, 0.12, z1 + 0.15], [WX - sd * 0.36, 0.12, z0 - 0.15]], true]]); }
    return hole;
  };
  // the way out in the back wall (for rooms where the left wall is too foreshortened to read): an opening from x0 to x1
  I.backDoor = (x0, x1, d = {}) => {
    const at = (s, t) => [s, t, D1], ts = d.ts || 2.0, rise = d.rise === undefined ? (x1 - x0) / 2 : d.rise;
    const hole = d.square ? [at(x0, 0), at(x1, 0), at(x1, ts), at(x0, ts)] : archPts(at, x0, x1, 0, ts, rise, 12);
    through(hole, () => {
      const gid = a.id('bd'), zf = D1 + 2.2;
      a.raw(`<linearGradient id="${gid}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2a2824"/><stop offset="0.5" stop-color="#5a5852"/><stop offset="1" stop-color="${d.beyond || '#9a9890'}"/></linearGradient>`);
      // the passage: its floor, its side walls, the grey at the far end where it turns out to the garth
      I.face([[x0 - 0.3, 0, D1], [x1 + 0.3, 0, D1], [x1 + 0.3, 0, zf], [x0 - 0.3, 0, zf]], '#3e3a34', 1.2);
      a.raw(PLW([[x0 - 1, 0, zf], [x1 + 1, 0, zf], [x0 - 1, 1, zf]], EM(`<path d="${pp([[x0 - 1, 0, zf], [x1 + 1, 0, zf], [x1 + 1, ts + 1, zf], [x0 - 1, ts + 1, zf]])}" fill="url(#${gid})"/>`)));
      const rg = a.id('rv');
      a.raw(`<linearGradient id="${rg}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1e1c1a"/><stop offset="1" stop-color="#6a6862"/></linearGradient>`);
      for (const X of [x0, x1]) { const side = X < 0 ? (X === x0) : (X === x1); a.raw(PLW([[X, 0, D1], [X, 0, zf], [X, 1, D1]], (side ? (s2 => EM(s2)) : (s2 => s2))(`<path d="${pp([[X, 0, D1], [X, 0, zf], [X, ts + 1, zf], [X, ts + 1, D1]])}" fill="${side ? `url(#${rg})` : '#2e2a26'}" stroke="${INK}" stroke-width="1.2"/>`))); }
      if (d.leaf === true) a.raw(I.planks((s, t) => [x1 - 0.02, t, D1 + 0.05 + s], 0.9, ts - 0.05, '#4a3826', { board: 0.15, nails: 6 }));
      a.raw(`<path d="${pp(hole)}" fill="url(#grimeF)" opacity="0.45"/>`);
    });
    addLight((x0 + x1) / 2, 1.5, D1 - 0.3, d.I || 0.6, 5.0, d.col || [0.62, 0.66, 0.74]);
    if (d.square) {
      for (const [p, q] of [[[x0 - 0.14, 0], [x0, ts + 0.14]], [[x1, 0], [x1 + 0.14, ts + 0.14]], [[x0 - 0.14, ts], [x1 + 0.14, ts + 0.2]]]) I.face([at(p[0], p[1]), at(q[0], p[1]), at(q[0], q[1]), at(p[0], q[1])], '#3e2e20', 1.6);
    } else {
      a.raw(archRing(at, x0, x1, ts, rise, 0.2, d.ring || o.wall2 || o.wall, 7));
      for (const X of [x0 - 0.2, x1]) for (let t = 0; t < ts; t += 0.38) a.raw(PLW([at(X, t), at(X + 0.2, t), at(X, t + 0.3)], `<path d="${pp([at(X, t + 0.02), at(X + 0.2, t + 0.02), at(X + 0.2, t + 0.36), at(X, t + 0.36)])}" fill="${mix(o.wall2 || o.wall, '#d0c4a8', R() * 0.25)}" stroke="${INK}" stroke-width="1.1"/>`));
    }
    I.face([[x0 - 0.15, 0.1, D1 - 0.35], [x1 + 0.15, 0.1, D1 - 0.35], [x1 + 0.15, 0.1, D1], [x0 - 0.15, 0.1, D1]], '#6a6256', 1.2);
    I.face([[x0 - 0.15, 0, D1 - 0.35], [x1 + 0.15, 0, D1 - 0.35], [x1 + 0.15, 0.1, D1 - 0.35], [x0 - 0.15, 0.1, D1 - 0.35]], '#3e3830', 1.2);
    hot('exit', 'To the garth', hole.map(p => P(...p)));
    { const dep = d.square ? 0.14 : 0.2, head = d.square ? [at(x0 - dep, ts + dep), at(x1 + dep, ts + dep)] : S.arcPts(at, x0 - dep, x1 + dep, ts, rise + dep, 18);
      outline('exit', [[[[x0 - dep, 0.1, D1 - 0.01], ...head, [x1 + dep, 0.1, D1 - 0.01], [x1 + 0.15, 0.1, D1 - 0.36], [x0 - 0.15, 0.1, D1 - 0.36]], true]]); }
    return hole;
  };
  // a window in the back wall showing the Grey: deep reveal, bars, a cold shaft of light
  I.backWindow = (x0, x1, y0, y1, d = {}) => {
    const at = (s, t) => [s, t, D1];
    const hole = d.square ? [at(x0, y0), at(x1, y0), at(x1, y1), at(x0, y1)] : archPts(at, x0, x1, y0, y1 - (x1 - x0) / 2, (x1 - x0) / 2, 10);
    through(hole, () => {
      { const gid = a.id('wsk'), sk = d.sky || '#7a7874', [, ya] = P(0, y1, D1), [, yb] = P(0, y0, D1);
        a.raw(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(ya)}" x2="0" y2="${f(yb)}"><stop offset="0" stop-color="${light(sk, 0.25)}"/><stop offset="1" stop-color="${dark(sk, 0.2)}"/></linearGradient>`);
        a.raw(EM(`<path d="${pp(hole)}" fill="url(#${gid})"/>`));
        // the garth's far roofs and a chimney stack against the Grey, low in the opening
        const far = (u, v) => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * v, D1 + 0.81], rl = [];
        rl.push(far(-0.1, -0.1)); for (let k = 0; k <= 6; k++) { const u = -0.1 + 1.2 * k / 6; rl.push(far(u, 0.22 + (k % 2 ? 0.1 : 0) + R() * 0.06)); } rl.push(far(1.1, -0.1));
        a.raw(`<path d="${pp(rl)}" fill="${dark(sk, 0.55)}" opacity="0.85"/>`);
        if (R() < 0.6) { const u = 0.2 + R() * 0.6; a.raw(`<path d="${pp([far(u, 0.2), far(u + 0.08, 0.2), far(u + 0.08, 0.42), far(u, 0.42)])}" fill="${dark(sk, 0.6)}" opacity="0.85"/>`); } }
      // the reveal's sill and sides seen inside the opening (the wall is 0.8 m thick)
      I.face([[x0, y0, D1], [x1, y0, D1], [x1, y0, D1 + 0.8], [x0, y0, D1 + 0.8]], '#5a5448', 1.2);
      if (x0 > 0) I.face([[x0, y0, D1], [x0, y0, D1 + 0.8], [x0, y1, D1 + 0.8], [x0, y1, D1]], '#4a443a', 1.2);
      if (x1 < 0) I.face([[x1, y0, D1], [x1, y0, D1 + 0.8], [x1, y1, D1 + 0.8], [x1, y1, D1]], '#4a443a', 1.2);
      for (let i = 1; i < (d.bars || 4); i++) { const X = x0 + (x1 - x0) * i / (d.bars || 4); a.raw(I.rod([X, y0, D1 + 0.4], [X, y1, D1 + 0.4], '#2a2826', 2.5)); }
    });
    a.raw(archRing ? '' : '');
    I.face([[x0 - 0.1, y0 - 0.12, D1 - 0.01], [x1 + 0.1, y0 - 0.12, D1 - 0.01], [x1 + 0.1, y0, D1 - 0.01], [x0 - 0.1, y0, D1 - 0.01]], o.wall2 || o.wall, 1.4);
    addLight((x0 + x1) / 2, (y0 + y1) / 2 - 0.2, D1 - 0.6, d.I || 0.7, d.range || 6.5, [0.62, 0.66, 0.74]);
    return hole;
  };
  // ------------------------------------------------------------------ write everything out
  I.write = (keeper, extra = {}) => {
    a.layer('fx');
    a.raw(`<g class="glow"><rect width="${W}" height="${H}" fill="url(#grimeF)" opacity="0.12"/></g>`);
    fs.mkdirSync('grim/hub/int', { recursive: true });
    fs.writeFileSync(`grim/hub/int/${room}.svg`, a.svg());
    for (const l of ['bg', 'mid', 'fg', 'fx']) fs.writeFileSync(`grim/hub/int/${room}__${l}.svg`, a.svgLayer(l));
    fs.writeFileSync(`grim/hub/int/${room}.light.json`, JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: E, focal_px: FL, cx: CX }, planes: PLANES, lights: LIGHTS }));
    const KP = Object.assign({ feet: P(keeper.X, 0, keeper.Z).map(f), height_px: f(K(keeper.Z) * keeper.h), z: keeper.Z, flip: false, figure: [170, 830] }, keeper);
    if (keeper.cutY !== undefined) KP.over_cut = f(P(0, keeper.cutY, keeper.cutZ)[1]);
    HOT.keeper = { label: keeper.label, poly: [] };
    fs.writeFileSync(`grim/hub/int/${room}_hotspots.json`, JSON.stringify(Object.assign({ w: W, h: H, room, camera: { horizon: HZ, eye_m: E, focal_px: FL, cx: CX }, hotspots: HOT, keeper: KP, panel: o.panel, draw_order: ['bg', 'keeper', 'mid', 'fg'] }, extra), null, 1));
    console.log(room, PLANES.length, 'planes', LIGHTS.length, 'lights', Object.keys(HOT).join(','));
  };
  return I;
};
