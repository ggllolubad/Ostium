// Battle-room kit for worlds X, XI, XII, round 2 (group g4). New file: battle_kit_b.js, battle_li.js and lik.js are not
// edited. G4(S, B, cfg) takes a lik.js scene S and its battle_kit_b B and adds what round 2 asks of every room:
//   depth     air(col, Z): atmospheric recession toward the world's air colour (farther = lower contrast)
//   light     pool(): a stepped, ragged light pool (no gradient); shaft(): a beam as nested ragged bands with motes;
//             frame(): dark frame edges (stepped ragged bands), so the light focus reads
//   floors    joints(): perspective joints and cracks laid in the floor plane, converging on the horizon; puddle()
//   sky       cloud(): a storm-cloud mass built of billows of many sizes (never stripes), lit on the upper left
//   X         spire(): hive spires of several kinds (bulb, tiered, broken, twin, flared), never a plain cone;
//             comb(): paper comb cells on a plane (capped, larva, nectar, empty), irregular; web(): an orb web, torn;
//             eggSac(), roots()
//   XI        stars(), gear() (a brass wheel with teeth and spokes, in a plane), aurora() (curtains stopped in the sky)
//   XII       drift(): wind-carved snow ridges (sastrugi), hide() helpers for tents
'use strict';
module.exports = function G4(S, B, cfg = {}) {
  const { P, K, R, f1, INK, KEY, p2, pp, cel, chip, hatch3, hatchA, hatchB, mix, smooth, id, inkW, inkH } = S;
  const { line, pline, fillP, fillS, inkP, inkS, blob } = B;
  const W = S.W, H = S.H, AIR = cfg.air || '#3a3846';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smoothPts = pts => pts; // (cel takes a polygon; the turret outline is already curved by its sample density)
  const air = (col, Z, o = {}) => mix(col, o.air || AIR, clamp((Z - (o.z0 ?? 7)) / ((o.z1 ?? 70) - (o.z0 ?? 7)), 0, o.kmax ?? 0.78));

  // ---------------------------------------------------------------- soft atmosphere (polish round: skies, fog, steam,
  // light glows may use smooth gradients and soft edges; objects keep their cel bands)
  const BLUR = {};
  const blur = std => { const k = Math.round(std * 10); if (!BLUR[k]) { BLUR[k] = id('bl'); S.DEFS.push(`<filter id="${BLUR[k]}" filterUnits="userSpaceOnUse" x="-200" y="-200" width="${W + 400}" height="${H + 400}"><feGaussianBlur stdDeviation="${(std).toFixed(1)}"/></filter>`); } return `url(#${BLUR[k]})`; };
  const grad = (stops, o = {}) => { const g = id('gr'); const st = stops.map(([of, c, op = 1]) => `<stop offset="${of}" stop-color="${c}" stop-opacity="${op}"/>`).join('');
    S.DEFS.push(o.radial ? `<radialGradient id="${g}" cx="${o.cx ?? 0.5}" cy="${o.cy ?? 0.5}" r="${o.r ?? 0.5}">${st}</radialGradient>` : `<linearGradient id="${g}" ${o.units === 'user' ? `gradientUnits="userSpaceOnUse" x1="${o.x1}" y1="${o.y1}" x2="${o.x2}" y2="${o.y2}"` : `x1="${o.x1 ?? 0}" y1="${o.y1 ?? 0}" x2="${o.x2 ?? 0}" y2="${o.y2 ?? 1}"`}>${st}</linearGradient>`); return `url(#${g})`; };
  // a smooth gradient sky over the frame top to y1: stops [[offset 0..1, colour], ...]
  const sky = (stops, y1 = 302) => `<rect width="${W}" height="${f1(y1)}" fill="${grad(stops, { units: 'user', x1: 0, y1: 0, x2: 0, y2: y1 })}"/>`;
  // a soft mass (fog, steam, smoke, a cloud's body): overlapping ellipses, blurred; wisps breaking off; op overall
  function softMass(cx, cy, w, h, col, o = {}) {
    let s = ''; const n = o.n || 7;
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, x = cx - w / 2 + w * (t + (R() - 0.5) * 0.12), rx = w * (0.12 + R() * 0.18), ry = h * (0.3 + R() * 0.35) * Math.sin(Math.PI * Math.min(0.95, Math.max(0.1, t))), y = cy - (R() * 0.4) * h; s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}"/>`; }
    for (let i = 0; i < (o.wisps ?? 3); i++) { const x = cx + (R() - 0.5) * w * 1.1, y = cy + (R() - 0.6) * h, rx = w * (0.08 + R() * 0.12), ry = h * (0.06 + R() * 0.08); s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="0.6" transform="rotate(${f1((R() - 0.5) * 12)} ${f1(x)} ${f1(y)})"/>`; }
    return `<g filter="${blur(o.blur ?? Math.max(2, h * 0.18))}" opacity="${o.op ?? 1}">${s}</g>`;
  }
  // ---------------------------------------------------------------- light and value
  // stepped ragged light pool: n rings, each a ragged ellipse a step smaller and a step stronger
  function pool(cx, cy, rx, ry, col, o = {}) {
    const n = o.n || 4, pk = Math.min(0.9, 1 - Math.pow(1 - (o.op ?? 0.1), n)), g = grad([[0, col, pk], [0.35, col, pk * 0.62], [0.7, col, pk * 0.22], [1, col, 0]], { radial: true });
    return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${g}" transform="rotate(${f1((o.rot || 0) * 57.3)} ${f1(cx)} ${f1(cy)})"/>`;
  }
  // a beam: top edge a0..a1, bottom edge b0..b1 (screen); nested ragged bands (wide faint to narrow stronger), motes
  function shaft(a0, a1, b0, b1, col, o = {}) {
    const n = o.n || 3, pk = Math.min(0.75, 1 - Math.pow(1 - (o.op ?? 0.08), n * 1.6)), my = (a0[1] + b0[1]) / 2;
    const g = grad([[0, col, pk], [0.55, col, pk * 0.6], [1, col, pk * 0.25]], { units: 'user', x1: (a0[0] + a1[0]) / 2, y1: a0[1], x2: (b0[0] + b1[0]) / 2, y2: b0[1] });
    const core = (k) => { const L = [a0[0] + (a1[0] - a0[0]) * k, a0[1]], Rr = [a1[0] - (a1[0] - a0[0]) * k, a1[1]], Lb = [b0[0] + (b1[0] - b0[0]) * k, b0[1]], Rb = [b1[0] - (b1[0] - b0[0]) * k, b1[1]]; return [L, Rr, Rb, Lb]; };
    const wb = Math.abs(b1[0] - b0[0]);
    let s = `<g filter="${blur(Math.max(4, wb * 0.08))}">` + fillP(core(0), g) + fillP(core(0.28), g, 0.7) + '</g>';
    let d = ''; for (let i = 0; i < (o.motes ?? 40); i++) { const t = R(), u = 0.15 + R() * 0.7, xa = a0[0] + (b0[0] - a0[0]) * t, xb = a1[0] + (b1[0] - a1[0]) * t, y = a0[1] + (b0[1] - a0[1]) * t, x = xa + (xb - xa) * u, r = 0.4 + R() * 0.9; d += `M${f1(x - r)} ${f1(y)} l${f1(r * 2)} ${f1(r * 0.3)} `; }
    if (d) s += `<path d="${d}" stroke="${o.mote || col}" stroke-width="0.9" opacity="${o.moteOp ?? 0.5}"/>`;
    return s;
  }
  // dark frame edges: stepped ragged bands down the sides and along the top (and bottom), heavier at the corners
  function frame(col, o = {}) {
    let s = '';
    const side = (x0, dir, w, op) => { const pts = [[x0, -5]]; for (let k = 0; k <= 24; k++) pts.push([x0 + dir * w * (0.75 + R() * 0.5) * (1 + 0.35 * Math.pow(Math.abs(k / 12 - 1), 2)), H * k / 24]); pts.push([x0, H + 5]); return fillP(pts, col, op); };
    for (const [w, op] of o.sides || [[90, 0.18], [50, 0.2], [24, 0.22]]) { s += side(-5, 1, w, op) + side(W + 5, -1, w, op); }
    for (const [h, op] of o.top || [[60, 0.14], [30, 0.16]]) { const pts = [[-5, -5]]; for (let k = 0; k <= 30; k++) pts.push([W * k / 30, h * (0.7 + R() * 0.6) * (1 + 0.6 * Math.pow(Math.abs(k / 15 - 1), 2))]); pts.push([W + 5, -5]); s += fillP(pts, col, op); }
    for (const [h, op] of o.bottom || []) { const pts = [[-5, H + 5]]; for (let k = 0; k <= 30; k++) pts.push([W * k / 30, H - h * (0.7 + R() * 0.6) * (1 + 0.6 * Math.pow(Math.abs(k / 15 - 1), 2))]); pts.push([W + 5, H + 5]); s += fillP(pts, col, op); }
    return s;
  }

  // ---------------------------------------------------------------- floors
  // perspective joints on the floor plane Y=y0 between x0..x1, z0..z1: long joints running into depth (they converge on
  // the horizon), cross joints at uneven depths, a few cracks wandering along the depth, worn bright lips
  function joints(x0, x1, z0, z1, o = {}) {
    const y = o.y || 0, col = o.col || INK, lip = o.lip || '#c8c0b0'; let d = '', dl = '';
    for (let X = x0 + R() * (o.dx || 1.2); X < x1; X += (o.dx || 1.2) * (0.6 + R() * 0.8)) {
      const pts = []; for (let Z = z0; Z <= z1; Z += 0.5) pts.push(P(X + (R() - 0.5) * 0.04, y, Z));
      d += 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' ';
    }
    for (let Z = z0 + R() * (o.dz || 1); Z < z1; Z += (o.dz || 1) * (0.6 + R() * 0.9)) {
      let X = x0; while (X < x1) { const L = (o.dx || 1.2) * (0.8 + R() * 2.4), a = P(X, y, Z + (R() - 0.5) * 0.08), b = P(Math.min(x1, X + L), y, Z + (R() - 0.5) * 0.08); if (R() > (o.gapP ?? 0.15)) { d += `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} `; dl += `M${f1(a[0])} ${f1(a[1] + 0.9)} L${f1(b[0])} ${f1(b[1] + 0.9)} `; } X += L; }
    }
    let s = `<path d="${d}" stroke="${col}" stroke-width="${f1(o.w || 0.9)}" fill="none" opacity="${o.op ?? 0.55}" stroke-linecap="round"/>`;
    s += `<path d="${dl}" stroke="${lip}" stroke-width="0.6" fill="none" opacity="${o.lipOp ?? 0.22}"/>`;
    for (let i = 0; i < (o.cracks ?? 5); i++) { let X = x0 + R() * (x1 - x0), Z = z0 + R() * (z1 - z0) * 0.6; const pts = [P(X, y, Z)]; for (let k = 0; k < 9; k++) { X += (R() - 0.5) * 0.5; Z += 0.3 + R() * 0.9; if (Z > z1) break; pts.push(P(X, y, Z)); } s += pline(pts, o.cw || 1.1, col, 0.65); }
    return s;
  }
  // a puddle lying in the floor plane: a ragged flat ellipse, its far edge catching the light, a dark near lip
  function puddle(X, Z, w, d, col, o = {}) {
    const pts = []; for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, m = 0.75 + R() * 0.4; pts.push(P(X + Math.cos(a) * w / 2 * m, o.y || 0.005, Z + Math.sin(a) * d / 2 * m)); }
    let s = fillS(pts, col, o.op ?? 0.85, 0.4);
    const far = pts.filter((p, k) => k > 8 && k < 16); if (far.length > 2) s += line(far, 0.9, o.lit || '#e8e4f0', 0.55);
    s += inkS(pts, 0.6, 0.4, 0.5);
    return s;
  }

  // ---------------------------------------------------------------- sky
  // a storm-cloud mass: billows of many sizes along a ragged top, a flatter darker base, inner billow contours, a lit rim
  // on the upper-left billows, the underside banded and hatched. Never stripes: each mass its own lump.
  function cloud(cx, cy, w, h, col, o = {}) {
    const n = o.n || 8 + Math.floor(R() * 5), lobes = [];
    for (let i = 0; i < n; i++) { const t = 0.06 + R() * 0.88, env = Math.sin(Math.PI * t), r = h * (0.16 + Math.pow(R(), 1.5) * 0.45) * (0.5 + 0.7 * env); lobes.push([cx - w / 2 + w * t, cy + h * 0.08 - r * 0.5 - R() * h * 0.45 * env, r * (1.2 + R() * 0.6), r]); }
    const lit = mix(col, o.lit || '#d8d4e4', 0.22), dark = mix(col, o.dark || '#0c0a12', 0.35);
    let body = ''; for (const [x, y, rx, ry] of lobes) body += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}"/>`;
    body += `<ellipse cx="${f1(cx)}" cy="${f1(cy + h * 0.12)}" rx="${f1(w * 0.46)}" ry="${f1(h * 0.2)}" fill="${dark}"/>`;
    let caps = ''; for (const [x, y, rx, ry] of lobes) if (R() < 0.7) caps += `<ellipse cx="${f1(x - rx * 0.25)}" cy="${f1(y - ry * 0.35)}" rx="${f1(rx * 0.55)}" ry="${f1(ry * 0.4)}" fill="${lit}" opacity="0.55"/>`;
    let s = `<g filter="${blur(Math.max(2, h * 0.07))}">${body}${caps}</g>`;
    for (let i = 0; i < 3; i++) { const x = cx + (R() - 0.5) * w, y = cy + h * (0.15 + R() * 0.15); s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w * (0.06 + R() * 0.1))}" ry="${f1(h * 0.05)}" fill="${col}" filter="${blur(Math.max(2, h * 0.05))}" opacity="0.7"/>`; }
    // a few broken ink strokes on the lit tops of the biggest billows (the ink style, never a closed outline)
    for (const [x, y, rx, ry] of lobes.slice().sort((p, q) => q[3] - p[3]).slice(0, 4)) { const a0 = Math.PI * (1.1 + R() * 0.2), a1 = a0 + Math.PI * (0.25 + R() * 0.25), q = []; for (let k = 0; k <= 8; k++) { const a = a0 + (a1 - a0) * k / 8; q.push([x + Math.cos(a) * rx * 0.98, y + Math.sin(a) * ry * 0.98]); } s += line(q, Math.max(0.5, (o.ink || 1.3) * 0.5), INK, 0.35); }
    return s;
  }
  // ---------------------------------------------------------------- X: the hive
  // a hive spire at (X, Z), base width bw, height h (m). kind: 'bulb' (swollen belly, a pinched neck, a knob), 'tiered'
  // (stacked collars stepping in), 'broken' (the top snapped and leaning), 'twin' (two shafts grown together), 'flare'
  // (a root flare and a long whip of a top). Paper bands, flight holes, an iron crown, burns down from the crown.
  function spire(X, Z, bw, h, o = {}) {
    const kind = o.kind || 'tiered', lean = o.lean ?? (R() - 0.5) * 0.08, n = 40, col = o.col || '#8c877a';
    const coll = []; for (let k = 0; k < (o.collars ?? 3 + Math.floor(R() * 3)); k++) coll.push([0.12 + R() * 0.75, 0.025 + R() * 0.04, 0.12 + R() * 0.3]);
    const lumps = []; for (let k = 0; k < 6 + Math.floor(R() * 6); k++) lumps.push([R(), 0.01 + R() * 0.03, (R() - 0.35) * 0.22]); const LUMP = t => lumps.reduce((a, [c, wd, amp]) => a + amp * Math.exp(-Math.pow((t - c) / wd, 2)), 0);
    const prof = t => {
      let w;
      if (kind === 'bulb') w = 0.55 + 0.75 * Math.sin(Math.PI * Math.min(1, t * 1.5)) * (1 - t) + 0.25 * Math.exp(-Math.pow((t - 0.86) / 0.05, 2)) - 0.45 * t;
      else if (kind === 'tiered') w = (1 - t * 0.92) * (1 + 0.18 * Math.sin(t * 5 * Math.PI) * (1 - t)) ;
      else if (kind === 'flare') w = 0.28 + 0.9 * Math.exp(-t * 7) + 0.35 * (1 - t);
      else w = Math.pow(1 - t * 0.9, 0.8);
      w += coll.reduce((a, [c, wd, amp]) => a + amp * Math.exp(-Math.pow((t - c) / wd, 2)), 0) * (1 - t * 0.6);
      w *= 1 + 0.08 * Math.sin(t * 19 + X) + 0.06 * Math.sin(t * 41 + Z) + 0.05 * Math.sin(t * 73 + X * 3) + LUMP(t);
      return Math.max(0.05, w);
    };
    const hh = kind === 'broken' ? h * 0.78 : h, Lp = [], Rp = [];
    for (let k = 0; k <= n; k++) { const t = k / n, Y = hh * t, w = bw / 2 * prof(t), cx = X + lean * Y + Math.sin(t * 3.3 + X) * bw * 0.06 * (o.wander ?? 1);
      Lp.push(P(cx - w * (1 + (R() - 0.5) * 0.04), Y, Z)); Rp.push(P(cx + w * (1 + (R() - 0.5) * 0.04), Y, Z)); }
    let top = Lp[n];
    if (kind === 'broken') { // the snapped top: a jagged stump and the broken crown leaning over at an angle
      const a = Lp[n], b = Rp[n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; Lp[n] = [a[0], a[1] + 4]; Rp[n] = [b[0], b[1] - 3]; top = m; }
    const poly = [...Lp, ...Rp.slice().reverse()];
    let s = cel(poly, { Z, fill: col, band: Math.max(2, K(Z) * bw * 0.13), tex: 'url(#mottle)', texOp: 0.5, inkW: Math.max(0.7, inkW(Z)) });
    const cid = id('sp'); s += `<clipPath id="${cid}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${cid})">`;
    // paper bands: arcs of chewed paper, each layer its own height, the lower lip catching the light, some layers darker
    for (let t = 0.01; t < 1; t += (o.band || 0.022) * (0.55 + R() * 0.9)) { const i = Math.round(t * n), a = Lp[i], b = Rp[i], pts = [], sag = (b[0] - a[0]) * (0.04 + R() * 0.06);
      for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + Math.sin(u * Math.PI) * sag + Math.sin(u * 9 + t * 30) * sag * 0.25]); }
      s += line(pts, Math.max(0.5, K(Z) * 0.02), mix(col, INK, 0.6), 0.65) + line(pts.map(([x, y]) => [x, y + Math.max(0.8, K(Z) * 0.015)]), 0.55, mix(col, '#f2eee4', 0.45), 0.4);
      if (R() < 0.3) s += fillS([...pts, ...pts.slice().reverse().map(([x, y]) => [x, y - Math.max(2, K(Z) * 0.12)])], mix(col, R() < 0.5 ? '#d0c8b0' : '#2a2620', 0.3), 0.4); }
    // the shadow side: crosshatch on the right third and under each collar
    s += hatch3((sv, t) => [X + lean * t + sv, t, Z], -bw, bw, 0, hh, 0.8, { op: 0.4, keep: sv => sv > bw * 0.12 }) + hatch3((sv, t) => [X + lean * t + sv, t, Z], -bw, bw, 0, hh, -0.7, { op: 0.32, keep: sv => sv > bw * 0.3 });
    if (o.burns !== false) for (let k = 0; k < (o.nburn ?? 2); k++) { const tp = P(X + lean * hh * 0.95 + (R() - 0.5) * bw * 0.1, hh * 0.97, Z); s += B.burn(tp[0], tp[1], Math.PI / 2 + (R() - 0.5) * 0.7, K(Z) * hh * (0.25 + R() * 0.35), Math.max(0.8, K(Z) * 0.06), { core: o.vio || '#d4c8f4', depth: 4 }); }
    s += '</g>';
    // flight holes: ragged dark mouths with a raised paper lip
    for (let k = 0; k < (o.holes ?? 5); k++) { const t = 0.12 + R() * 0.72, i = Math.round(t * n), a = Lp[i], b = Rp[i], u = 0.2 + R() * 0.6, c = [a[0] + (b[0] - a[0]) * u, a[1]], r = Math.max(1, K(Z) * (0.1 + R() * 0.12));
      s += fillS(blob(c[0], c[1], r, r * 0.8, 8, 0.45), '#08070a') + `<path d="M${f1(c[0] - r * 1.25)} ${f1(c[1] + r * 0.55)} Q${f1(c[0])} ${f1(c[1] + r * 1.5)} ${f1(c[0] + r * 1.25)} ${f1(c[1] + r * 0.55)}" stroke="${mix(col, '#f0ece0', 0.4)}" stroke-width="${f1(Math.max(0.5, r * 0.25))}" fill="none"/>`; }
    // flutes: shallow vertical ribs where the builders laid their paper in columns, following the profile
    for (let k = 0; k < (o.flutes ?? 4); k++) { const u = 0.15 + R() * 0.7, q = []; for (let i = 2; i < n - 3; i += 2) { const a = Lp[i], b = Rp[i]; q.push([a[0] + (b[0] - a[0]) * (u + Math.sin(i * 0.5 + k) * 0.03), a[1]]); } s += line(q, Math.max(0.5, K(Z) * 0.02), mix(col, INK, 0.5), 0.45); }
    // turrets: side chimneys of paper growing out and up from the flanks (each its own size), a flight hole at the mouth
    for (let k = 0; k < (o.turrets ?? (bw * K(Z) > 60 ? 1 + Math.floor(R() * 2) : 0)); k++) { const i = Math.round((0.3 + R() * 0.4) * n), sd = R() < 0.5 ? -1 : 1, at = sd < 0 ? Lp[i] : Rp[i], L = K(Z) * bw * (0.22 + R() * 0.18), wd = L * (0.55 + R() * 0.15), a0 = -Math.PI / 2 + sd * (0.55 + R() * 0.3);
      const pts = []; for (let j = 0; j <= 8; j++) { const t = j / 8, a = a0 - sd * 0.6 * t, x = at[0] + Math.cos(a) * L * t - sd * wd * 0.2, y = at[1] + Math.sin(a) * L * t + wd * 0.5 * (1 - t); pts.push([x, y, wd * (1 - t * 0.55)]); }
      const Lq = pts.map(([x, y, w]) => [x - w / 2, y]), Rq = pts.map(([x, y, w]) => [x + w / 2, y]); const tp = pts[8];
      s += cel([...Lq, ...Rq.reverse()].length ? smoothPts([...Lq, ...Rq.reverse()]) : [], { Z, fill: col, band: wd * 0.3, tex: 'url(#mottle)', texOp: 0.5 }) + fillS(blob(tp[0], tp[1], tp[2] * 0.4, tp[2] * 0.2, 8, 0.3), '#08070a');
      for (let j = 2; j < 8; j += 2) s += line([[pts[j][0] - pts[j][2] / 2, pts[j][1]], [pts[j][0], pts[j][1] + 1.5], [pts[j][0] + pts[j][2] / 2, pts[j][1]]], 0.6, mix(col, INK, 0.6), 0.6); }
    // the iron crown: scavenged iron, fused at the tip and where it enters the paper
    const rk = K(Z), crown = o.crown || 'rod';
    if (kind === 'broken') { // the broken-off top hangs over, still wearing its iron
      const ang = (o.droop ?? 0.9) * (R() < 0.5 ? 1 : -1), L = rk * hh * 0.22, w0 = Math.abs(Rp[n][0] - Lp[n][0]) * 0.5, c = Math.cos(ang), sn = Math.sin(ang);
      const T = (u, v) => [top[0] + u * sn + v * c, top[1] - u * c + v * sn];
      const piece = [T(0, -w0), T(L * 0.5, -w0 * 0.7), T(L, -w0 * 0.15), T(L * 1.02, 0), T(L, w0 * 0.15), T(L * 0.5, w0 * 0.7), T(0, w0)];
      s += cel(piece, { Z, fill: mix(col, INK, 0.1), band: w0 * 0.4, tex: 'url(#mottle)', texOp: 0.5 }) + line([T(L, 0), T(L + rk * 1.6, 0)], Math.max(1.4, rk * 0.08), INK) + B.fused(...T(L + rk * 1.6, 0), Math.max(1.6, rk * 0.13), '#4a4440', Z);
    } else if (crown !== 'none') {
      const tip = [top[0] + (Rp[n][0] - Lp[n][0]) / 2 + rk * 0.05, top[1] - rk * (o.rodH || 2.2)], bt = [(Lp[n][0] + Rp[n][0]) / 2, top[1]];
      s += line([bt, tip], Math.max(1.5, rk * 0.09), INK) + line([bt, tip], Math.max(0.7, rk * 0.05), '#3a3634');
      if (crown === 'cross') s += pline([[tip[0] - rk * 0.45, tip[1] + rk * 0.6], [tip[0] + rk * 0.45, tip[1] + rk * 0.52]], Math.max(1.5, rk * 0.1), INK) + pline([[tip[0] - rk * 0.45, tip[1] + rk * 0.6], [tip[0] + rk * 0.45, tip[1] + rk * 0.52]], Math.max(0.7, rk * 0.06), '#3a3634');
      if (crown === 'vane') s += fillP([[tip[0], tip[1] + rk * 0.3], [tip[0] + rk * 0.9, tip[1] + rk * 0.12], [tip[0] + rk * 0.75, tip[1] + rk * 0.5], [tip[0], tip[1] + rk * 0.55]], '#3a3634') + inkP([[tip[0], tip[1] + rk * 0.3], [tip[0] + rk * 0.9, tip[1] + rk * 0.12], [tip[0] + rk * 0.75, tip[1] + rk * 0.5], [tip[0], tip[1] + rk * 0.55]], 1);
      if (crown === 'wheel') s += `<ellipse cx="${f1(tip[0])}" cy="${f1(tip[1] + rk * 0.4)}" rx="${f1(rk * 0.55)}" ry="${f1(rk * 0.55)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(1.2, rk * 0.08))}"/>` + pline([[tip[0] - rk * 0.55, tip[1] + rk * 0.4], [tip[0] + rk * 0.55, tip[1] + rk * 0.4]], 1, INK) + pline([[tip[0], tip[1] - rk * 0.15], [tip[0], tip[1] + rk * 0.95]], 1, INK);
      s += B.fused(tip[0], tip[1] + rk * 0.12, Math.max(1.6, rk * 0.15), '#4a4440', Z) + B.fused(bt[0], bt[1] - rk * 0.1, Math.max(2, rk * 0.2), '#4a4440', Z);
    }
    if (kind === 'twin') { const t2 = spire(X + bw * 0.42, Z + 0.3, bw * 0.55, h * 0.72, Object.assign({}, o, { kind: 'flare', crown: o.crown2 || 'rod', lean: lean + 0.06, holes: 2, nburn: 1 })); s = t2.svg + s; }
    return { svg: s, L: Lp, R: Rp, top };
  }
  // paper comb on a plane at(s,t): hexagonal cells of uneven size, the paper walls lit on their lower lip, the insides by
  // content: capped (a pale domed lid), larva (a curled grub), nectar (venom green, a bright meniscus), empty (black).
  function comb(at, s0, s1, t0, t1, r, o = {}) {
    const wall = o.wall || '#9a927e', P3 = (s, t) => P(...at(s, t)); let s = '';
    const rows = []; for (let t = t0; t < t1; t += r * 1.5 * (0.9 + R() * 0.2)) rows.push(t);
    rows.forEach((t, ri) => { for (let sv = s0 + (ri % 2) * r * 0.87; sv < s1; sv += r * 1.74 * (0.92 + R() * 0.16)) {
      if (o.keep && !o.keep(sv, t)) continue;
      const rr = r * (0.88 + R() * 0.2), hx = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; hx.push(P3(sv + Math.cos(a) * rr * (0.95 + R() * 0.1), t + Math.sin(a) * rr * (0.95 + R() * 0.1))); }
      const inn = hx.map(p => { const c = P3(sv, t); return [c[0] + (p[0] - c[0]) * 0.74, c[1] + (p[1] - c[1]) * 0.74]; }), Z = at(sv, t)[2];
      s += fillP(hx, mix(wall, o.dark ? INK : '#000', R() * 0.25));
      const u = R(), kind = (o.pick ? o.pick(sv, t, u) : (u < (o.capP ?? 0.35) ? 'cap' : u < (o.capP ?? 0.35) + (o.larvaP ?? 0.2) ? 'larva' : u < (o.capP ?? 0.35) + (o.larvaP ?? 0.2) + (o.nectarP ?? 0.12) ? 'nectar' : 'empty'));
      const c = P3(sv, t), rad = Math.abs(inn[0][0] - inn[3][0]) / 2 || 2;
      if (kind === 'empty') s += fillP(inn, o.voidCol || '#0c0a0a') + fillP(inn.map(([x, y]) => [x + rad * 0.15, y + rad * 0.2]), mix(wall, INK, 0.6), 0.5);
      else if (kind === 'cap') s += fillP(inn, mix(o.capCol || '#d8d0b8', INK, R() * 0.15)) + line([[c[0] - rad * 0.45, c[1] - rad * 0.2], [c[0] - rad * 0.15, c[1] - rad * 0.42]], Math.max(0.4, Math.min(1.2, rad * 0.08)), '#fff8e8', 0.35) + fillP(inn.slice(2, 5).concat([c]), mix(o.capCol || '#d8d0b8', INK, 0.4), 0.45);
      else if (kind === 'larva') { const g = o.grub || '#cdc6a6', gp = inn.map(([x, y]) => [c[0] + (x - c[0]) * 0.86, c[1] + (y - c[1]) * 0.86]); s += fillP(inn, '#141010') + fillS(gp, mix(g, INK, R() * 0.2), 0.95, 0.5) + fillS(gp.slice(2, 6).concat([[c[0] + rad * 0.1, c[1] + rad * 0.1]]), mix(g, '#3a3020', 0.45), 0.6, 0.5) + `<path d="M${f1(c[0] - rad * 0.45)} ${f1(c[1] - rad * 0.15)} Q${f1(c[0])} ${f1(c[1] + rad * 0.35)} ${f1(c[0] + rad * 0.4)} ${f1(c[1] - rad * 0.2)}" stroke="${mix(g, INK, 0.55)}" stroke-width="${f1(Math.max(0.4, rad * 0.1))}" fill="none" opacity="0.8"/>`; }
      else if (kind === 'nectar') s += fillP(inn, '#0e0c08') + fillS(inn.map(([x, y]) => [c[0] + (x - c[0]) * 0.8, c[1] + (y - c[1]) * 0.7 + rad * 0.15]), o.nectar || '#4a6024', 0.95, 0.4) + line([[c[0] - rad * 0.35, c[1] + rad * 0.05], [c[0] + rad * 0.1, c[1] - rad * 0.05]], Math.max(0.5, rad * 0.12), o.nectarL || '#b8cc7a', 0.55);
      s += `<path d="${p2(hx)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Z) * 0.55))}"/>` + line([hx[0], hx[1], hx[2]], Math.max(0.5, inkW(Z) * 0.6), mix(wall, '#fff4e0', 0.5), 0.45);
    } });
    return s;
  }
  // an orb web strung between anchors (screen points), hub c: radials to the anchors and between, a spiral in segments,
  // torn sectors, prey bundles. Pale grey-violet, thin.
  function web(c, anchors, o = {}) {
    const col = o.col || '#c8c4d4', rad = []; let s = '';
    const n = o.n || 16; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + (R() - 0.5) * 0.3; rad.push([a, (o.r || 60) * (0.55 + R() * 0.75) * (Math.sin(a) > 0 ? 1.15 : 0.9)]); }
    let d = ''; for (const [a, r] of rad) d += `M${f1(c[0])} ${f1(c[1])} L${f1(c[0] + Math.cos(a) * r)} ${f1(c[1] + Math.sin(a) * r)} `;
    for (const A of anchors) { const r = rad.reduce((b, q) => Math.abs(Math.atan2(Math.sin(Math.atan2(A[1] - c[1], A[0] - c[0]) - q[0]), Math.cos(Math.atan2(A[1] - c[1], A[0] - c[0]) - q[0]))) < Math.abs(Math.atan2(Math.sin(Math.atan2(A[1] - c[1], A[0] - c[0]) - b[0]), Math.cos(Math.atan2(A[1] - c[1], A[0] - c[0]) - b[0]))) ? q : b); d += `M${f1(c[0] + Math.cos(r[0]) * r[1])} ${f1(c[1] + Math.sin(r[0]) * r[1])} L${f1(A[0])} ${f1(A[1])} `; }
    const torn = new Set(); for (let k = 0; k < (o.torn ?? 3); k++) torn.add(Math.floor(R() * n));
    for (let ring = 0.12; ring < 1; ring += 0.07 + R() * 0.05) for (let k = 0; k < n; k++) { if ((torn.has(k) && ring > 0.25) || R() < 0.18) continue; const [a0, r0] = rad[k], [a1, r1] = rad[(k + 1) % n], sg = (r0 + r1) / 2 * ring * (0.1 + R() * 0.1);
      d += `M${f1(c[0] + Math.cos(a0) * r0 * ring)} ${f1(c[1] + Math.sin(a0) * r0 * ring)} Q${f1(c[0] + Math.cos((a0 + a1) / 2 + (k === n - 1 ? Math.PI : 0)) * (r0 + r1) / 2 * ring * 0.96)} ${f1(c[1] + Math.sin((a0 + a1) / 2 + (k === n - 1 ? Math.PI : 0)) * (r0 + r1) / 2 * ring * 0.96 + sg)} ${f1(c[0] + Math.cos(a1) * r1 * ring)} ${f1(c[1] + Math.sin(a1) * r1 * ring)} `; }
    for (const k of torn) { const [a, r] = rad[k], L = r * (0.3 + R() * 0.5); d += `M${f1(c[0] + Math.cos(a) * r * 0.4)} ${f1(c[1] + Math.sin(a) * r * 0.4)} q${f1(Math.cos(a + 1) * 4)} ${f1(L * 0.5)} ${f1(Math.cos(a) * 5)} ${f1(L)} `; }
    // loose strands hanging from the web's lower edge, weighted with dew and husks
    for (let k = 0; k < (o.strands ?? 5); k++) { const [a, r] = rad[Math.floor(R() * n)]; if (Math.sin(a) < 0.1) continue; const x = c[0] + Math.cos(a) * r * 0.8, y = c[1] + Math.sin(a) * r * 0.8, L = r * (0.25 + R() * 0.5); d += `M${f1(x)} ${f1(y)} q${f1((R() - 0.5) * 6)} ${f1(L * 0.5)} ${f1((R() - 0.5) * 4)} ${f1(L)} `; }
    s += `<path d="${d}" stroke="${INK}" stroke-width="${f1((o.w || 0.6) * 1.9)}" fill="none" opacity="${(o.op ?? 0.55) * 0.35}"/><path d="${d}" stroke="${col}" stroke-width="${f1(o.w || 0.6)}" fill="none" opacity="${o.op ?? 0.55}"/>`;
    for (let k = 0; k < (o.prey ?? 3); k++) { const [a, r] = rad[Math.floor(R() * n)], u = 0.3 + R() * 0.6, x = c[0] + Math.cos(a) * r * u, y = c[1] + Math.sin(a) * r * u, sz = (o.preySz || 4) * (0.6 + R() * 0.8);
      s += cel(blob(x, y + sz * 0.6, sz * 0.5, sz, 9, 0.3), { Z: o.Z || 12, fill: o.preyCol || '#a8a498', band: sz * 0.3 }) + (R() < 0.6 ? B.burn(x, y, Math.PI / 2, sz * 1.6, 0.8, { core: '#d4c8f4', depth: 1 }) : ''); }
    return s;
  }
  // an egg sac: a lumpy pale silk bag bound to whatever it hangs from, with the threads wound round it and a shadow side
  function eggSac(x, y, r, Z, o = {}) {
    const b = blob(x, y, r * 0.8, r, 12, 0.25), col = o.col || '#d8d4c4';
    let s = (o.thread !== false ? pline([[x + (R() - 0.5) * 2, y - r - (o.hang || r * 1.5)], [x, y - r * 0.9]], 0.6, '#c8c4b8', 0.8) : '') + cel(b, { Z, fill: col, band: r * 0.35, tex: 'url(#mottle)', texOp: 0.4 });
    for (let k = 0; k < 4; k++) { const yy = y - r * 0.7 + k * r * 0.45 + (R() - 0.5) * r * 0.2; s += `<path d="M${f1(x - r * 0.8)} ${f1(yy)} Q${f1(x)} ${f1(yy + r * 0.25)} ${f1(x + r * 0.8)} ${f1(yy - r * 0.05)}" stroke="${mix(col, INK, 0.4)}" stroke-width="0.5" fill="none" opacity="0.6"/>`; }
    if (o.green) s += fillS(blob(x + r * 0.15, y + r * 0.2, r * 0.3, r * 0.4, 8, 0.4), '#6a8a3a', 0.45);
    return s;
  }
  // roots hanging from a ceiling at screen y: tapering, kinked, with rootlets; o.n roots across x0..x1
  // materials v2: the old kinked roots are replaced by smooth tapering roots with rootlets (scenes/materials_v2.js
  // hangRoots). The old body still runs (its output dropped) so the room's random stream, and every later placement, is unchanged.
  function roots(x0, x1, y, Z, o = {}) { rootsV1(x0, x1, y, Z, o); return require('./materials_v2')(S).hangRoots(x0, x1, y, Z, { n: o.n || 10, len: o.len || 60, w: (o.w || 4) * 1.1, col: o.col || '#4a3c2c', seed: Math.round(x0 * 7 + y * 13 + x1) }); }
  function rootsV1(x0, x1, y, Z, o = {}) {
    let s = ''; const col = o.col || '#4a3c2c';
    for (let i = 0; i < (o.n || 10); i++) { const x = x0 + R() * (x1 - x0), L = (o.len || 60) * (0.3 + R() * 0.9), w0 = (o.w || 4) * (0.5 + R()), pts = [[x, y - 2]]; let cx = x, a = Math.PI / 2;
      for (let k = 0; k < 7; k++) { a += (R() - 0.5) * 0.25; a = clamp(a, 1.25, 1.9); cx += Math.cos(a) * L / 7; pts.push([cx, y + L * (k + 1) / 7]); }
      const Lp = pts.map(([px, py], k) => [px - w0 * (1 - k / 7) / 2, py]), Rp = pts.map(([px, py], k) => [px + w0 * (1 - k / 7) / 2, py]);
      const rp = [...Lp, ...Rp.reverse()]; s += fillS(rp, mix(col, INK, R() * 0.3), 1, 0.5) + inkS(rp, Math.max(0.5, inkW(Z) * 0.6), 0.5);
      for (let k = 2; k < 7; k += 1 + Math.floor(R() * 2)) { const p = pts[k], l = L * 0.15 * (0.5 + R()), sg = R() < 0.5 ? -1 : 1; s += line([p, [p[0] + sg * l * 0.35, p[1] + l * 0.3], [p[0] + sg * l * 0.55, p[1] + l * 0.7], [p[0] + sg * l * 0.6, p[1] + l]], 0.6, mix(col, INK, 0.3), 0.8); }
    }
    return s;
  }

  // ---------------------------------------------------------------- XI
  // stars in a screen region (o.clip polygon), still: a few with short cross glints, most points
  function stars(x0, y0, x1, y1, n, o = {}) { let d = '', g = ''; for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), r = 0.35 + Math.pow(R(), 3) * 1.6; d += `M${f1(x)} ${f1(y)} m${f1(-r)} 0 a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0 a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0 `; if (r > 1.3) g += `M${f1(x - r * 3)} ${f1(y)} L${f1(x + r * 3)} ${f1(y)} M${f1(x)} ${f1(y - r * 3)} L${f1(x)} ${f1(y + r * 3)} `; }
    return `<path d="${d}" fill="${o.col || '#e8eef8'}" opacity="${o.op ?? 0.8}"/><path d="${g}" stroke="${o.col || '#e8eef8'}" stroke-width="0.5" opacity="0.5"/>`; }
  // a brass wheel on a plane at(s,t) centred cs,ct radius r (m): rim with teeth, spokes, hub; o.teeth count, o.spokes
  function gear(at, cs, ct, r, Z, o = {}) {
    const col = o.col || '#8c7c4c', nT = o.teeth || Math.max(12, Math.round(r * 40)), ring = [], inner = [], hub = []; let s = '';
    for (let k = 0; k < nT * 4; k++) { const a = k / (nT * 4) * Math.PI * 2 + (o.rot || 0), tooth = (k % 4 === 1 || k % 4 === 2) ? 1 : 0, rr = r * (tooth ? 1 : 0.9); ring.push(P(...at(cs + Math.cos(a) * rr, ct + Math.sin(a) * rr))); }
    for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; inner.push(P(...at(cs + Math.cos(a) * r * 0.76, ct + Math.sin(a) * r * 0.76))); hub.push(P(...at(cs + Math.cos(a) * r * 0.15, ct + Math.sin(a) * r * 0.15))); }
    s += cel(ring, { Z, fill: col, band: Math.max(1, K(Z) * r * 0.08), hi: true });
    if (o.open !== false) {
      s += fillP(inner, o.behind || '#0a0c10', o.behindOp ?? 1);
      for (let k = 0; k < (o.spokes || 5); k++) { const a = k / (o.spokes || 5) * Math.PI * 2 + (o.rot || 0) + 0.3, w = 0.07; const q = [at(cs + Math.cos(a - w) * r * 0.12, ct + Math.sin(a - w) * r * 0.12), at(cs + Math.cos(a - w * 0.4) * r * 0.8, ct + Math.sin(a - w * 0.4) * r * 0.8), at(cs + Math.cos(a + w * 0.4) * r * 0.8, ct + Math.sin(a + w * 0.4) * r * 0.8), at(cs + Math.cos(a + w) * r * 0.12, ct + Math.sin(a + w) * r * 0.12)].map(p => P(...p)); s += cel(q, { Z, fill: mix(col, INK, 0.12), band: 1 }); }
      s += `<path d="${p2(inner)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.6, inkW(Z) * 0.8))}"/>`;
    }
    s += cel(hub, { Z, fill: mix(col, '#fff0c8', 0.12), band: 1 });
    return s;
  }
  // aurora curtains stopped in the sky: folded vertical drapes (screen), each a ribbon whose lower hem is bright and whose
  // rays run up and fade in steps; colour col (aurora green), a violet upper edge
  function aurora(x0, x1, yb, h, o = {}) {
    let s = ''; const col = o.col || '#86e8b8', n = o.n || 3;
    for (let c = 0; c < n; c++) {
      const hem = []; const ph = R() * 6, amp = (o.amp || 30) * (0.6 + R() * 0.8), yy = yb - c * (o.dy || 18);
      for (let k = 0; k <= 60; k++) { const t = k / 60, x = x0 + (x1 - x0) * t; hem.push([x + Math.sin(t * 9 + ph) * amp * 0.5, yy + Math.sin(t * 5.3 + ph * 2) * amp + Math.sin(t * 17 + ph) * amp * 0.15]); }
      const top = hem.map(([x, y], k) => [x + h * 0.05, y - h * (0.7 + 0.3 * Math.sin(k * 0.35 + c))]);
      const g = grad([[0, o.violet || '#9a88d8', 0], [0.45, col, (o.op ?? 0.07) * 2.2], [0.9, col, (o.op ?? 0.07) * 5], [1, mix(col, '#ffffff', 0.4), (o.op ?? 0.07) * 6]]);
      s += `<g filter="${blur(4)}">` + fillS([...hem, ...top.slice().reverse()], g, 1, 0.3) + '</g>';
      let rays = ''; for (let k = 0; k < hem.length; k++) { if (R() < 0.45) continue; const [x, y] = hem[k], l = h * (0.3 + R() * 0.6); rays += `M${f1(x)} ${f1(y)} l${f1(l * 0.05)} ${f1(-l)} `; }
      s += `<path d="${rays}" stroke="${col}" stroke-width="1.6" opacity="${(o.op ?? 0.07) * 1.6}" filter="${blur(1.2)}"/>` + `<g filter="${blur(1.5)}">` + line(hem, 2.4, mix(col, '#ffffff', 0.5), (o.op ?? 0.07) * 6) + '</g>';
    }
    return s;
  }
  // ---------------------------------------------------------------- XII
  // wind-carved snow ridges (sastrugi) on the ground plane: long ridges with a lit windward face and an ink lee edge,
  // converging into depth, between x0..x1 and z0..z1
  function sastrugi(x0, x1, z0, z1, n, o = {}) {
    let s = ''; for (let i = 0; i < n; i++) { const Z = z0 + Math.pow(R(), 0.8) * (z1 - z0), X = x0 + R() * (x1 - x0), L = (o.len || 3) * (0.4 + R()) * (1 + Z * 0.05), hgt = (o.h || 0.12) * (0.5 + R()), a = (o.ang ?? -0.25) + (R() - 0.5) * 0.3;
      const pts = [], top = []; for (let k = 0; k <= 8; k++) { const u = k / 8 - 0.5, x = X + Math.cos(a) * L * u, z = Z + Math.sin(a) * L * u, e = Math.sin(Math.PI * (u + 0.5)); pts.push(P(x, 0, z)); top.push(P(x + 0.04, hgt * e * (0.8 + R() * 0.3), z - 0.03)); }
      s += fillP([...pts, ...top.slice().reverse()], o.shade || '#c4c8cc', 0.8) + line(top, Math.max(0.5, inkW(Z) * 0.7), INK, o.inkOp ?? 0.7) + line(top.map(([x, y]) => [x - 0.5, y + 0.8]), 0.6, '#ffffff', 0.8); }
    return s;
  }
  // the fighters' band floor: a worn path where feet go (along x, at the fighters' depth), debris with contact shadows,
  // and cracks running into depth; low contrast (it sits under the quiet veil). o.col: floor tone, o.wear: the worn tone
  function bandFloor(x0, x1, o = {}) {
    let s = ''; const z0 = o.z0 ?? 4.6, z1 = o.z1 ?? 8.6, col = o.col || '#555';
    const up = [], dn = []; for (let X = x0; X <= x1; X += 0.5) { up.push(P(X, 0.002, 6.9 + Math.sin(X * 0.7) * 0.25 + (R() - 0.5) * 0.12)); dn.push(P(X, 0.002, 5.3 + Math.sin(X * 0.9 + 1) * 0.2 + (R() - 0.5) * 0.12)); }
    s += fillS([...up, ...dn.reverse()], o.wear || mix(col, '#ffffff', 0.12), o.wearOp ?? 0.35, 0.4);
    for (let i = 0; i < (o.scuffs ?? 40); i++) { const X = x0 + R() * (x1 - x0), Z = 5.4 + R() * 1.4, a = P(X, 0.003, Z), b = P(X + 0.2 + R() * 0.4, 0.003, Z + (R() - 0.5) * 0.1); s += pline([a, b], 0.7, o.scuff || mix(col, INK, 0.4), 0.45); }
    for (let i = 0; i < (o.debris ?? 26); i++) { const X = x0 + R() * (x1 - x0), Z = z0 + R() * (z1 - z0), p = P(X, 0, Z), r = K(Z) * (0.025 + R() * 0.05);
      s += `<ellipse cx="${f1(p[0] + r * 0.4)}" cy="${f1(p[1] + r * 0.15)}" rx="${f1(r * 1.3)}" ry="${f1(r * 0.35)}" fill="${INK}" opacity="0.35"/>` + cel(blob(p[0], p[1] - r * 0.3, r, r * 0.6, 7, 0.4), { Z, fill: S.tone(o.debrisCol || mix(col, '#ffffff', 0.15), 0.2), band: Math.max(0.6, r * 0.3), inkW: 0.5 }); }
    for (let i = 0; i < (o.cracks ?? 6); i++) { let X = x0 + R() * (x1 - x0), Z = z0; const pts = [P(X, 0.002, Z)]; for (let k = 0; k < 8; k++) { X += (R() - 0.5) * 0.25; Z += 0.25 + R() * 0.5; if (Z > z1 + 2) break; pts.push(P(X, 0.002, Z)); } s += pline(pts, 0.9, mix(col, INK, 0.6), 0.5); }
    return s;
  }
  return { bandFloor, blur, grad, sky, softMass, air, pool, shaft, frame, joints, puddle, cloud, spire, comb, web, eggSac, roots, stars, gear, aurora, sastrugi, clamp };
};
