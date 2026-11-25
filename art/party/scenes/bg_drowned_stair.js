// World I, the Drowned Kingdom: THE SEA STAIR (room key `stair`), Living Ink, round 2 (group g1).
// The processional stair from the cathedral's west door down through the drowned lower town to the harbour and the trench.
// The company stands on the top landing, two paces from where the stair drops away; behind the foes the stair falls through
// terraces of drowned houses to the harbour, where the masts of the royal fleet still stand, and past it the trench.
// Encounters: thralls shambling up from below (the fleet's sailors), eels and lampreys in the pools where the landing's flags
// have dropped, and the Grasping Deep reaching up through a breach at the landing's edge.
// Space: open exterior, vast, high above a descent. Light: diffuse daylight from the surface far above, brightest in a pale
// "window" at the upper left, shafts slanting down; the trench black below (lightest key of the world, cold blue).
// Courses: water (kelp, barnacles, verdigris, silt), void (a torn absence through a saint's statue on the newel and through
// a house in the lower town). Gold: none (no holy gold object here). No eyes.
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'I');
const W = 1480, H = 480, ROOM = 'stair';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2311, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#18242a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, ashlar } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, I = G.I;
const AIR = '#4e6a6c', MURK = '#0e171b';
const fog = G.fogger(AIR, 8, 140, 0.82);
const EDGE = 8.5;                 // the landing's edge (Z); the stair drops away beyond it

layer('far');
// ---- the water column above: stepped bands, brightest at the top where the surface is; the surface "window" upper left
raw(`<rect width="${W}" height="${H}" fill="#22302f"/>`);
raw(G.sky([[0, '#64807e'], [0.25, '#56726f'], [0.45, '#48625f'], [0.62, '#3a5050'], [0.75, '#2c3e3e'], [1, '#1a2628']]));   // polish: a smooth gradient water column
{ // the window: nested ragged blobs of pale light, a net of caustic lines in it
  S.DEFS.push(`<radialGradient id="swin"><stop offset="0" stop-color="#dcece4" stop-opacity="0.85"/><stop offset="0.35" stop-color="#a8c4bc" stop-opacity="0.5"/><stop offset="1" stop-color="#7a9894" stop-opacity="0"/></radialGradient>`); raw(S.GLOW(`<ellipse cx="290" cy="-10" rx="380" ry="130" fill="url(#swin)"/>`));   // polish: the surface window as a soft glow
  let cn = ''; for (let i = 0; i < 70; i++) { const x = 60 + R() * 480, y = R() * 95, l = 14 + R() * 26, a = R() * 3; cn += `M${f1(x)} ${f1(y)} q${f1(Math.cos(a) * l * 0.5 + 4)} ${f1(Math.sin(a) * l * 0.2 - 3)} ${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l * 0.35)} `; }
  raw(`<path d="${cn}" stroke="#e0ece4" stroke-width="0.8" fill="none" opacity="0.35"/>`);
}
for (const [x, w, len, op] of [[120, 70, 420, 0.24], [300, 110, 440, 0.26], [520, 60, 380, 0.2], [700, 90, 360, 0.16], [980, 50, 330, 0.12]]) raw(G.shaft(x, -5, w, len, 0.55, '#c8dcd4', { op, fill: 0.06, spread: 30 }));
// ---- distance (Z 90-180): the harbour mouth, the sea wall with its two towers, the masts of the sunken fleet
{
  const zW = 150, wall = []; for (let X = -160; X <= 160; X += 8 + R() * 10) wall.push(P(X, -16 + Math.sin(X * 0.05) * 1.5 + R(), zW));
  raw(`<path d="${p2([P(-170, -40, zW), ...wall, P(170, -40, zW)])}" fill="${fog('#3a4a4c', zW)}" stroke="${fog(INK, zW, 0.9)}" stroke-width="0.6"/>`);
  for (const [X, h, w] of [[-38, 9, 6], [46, 12, 7]]) { const t = [[X, -18], [X + w, -18], [X + w * 0.95, h], [X + w * 0.5, h + 3], [X + w * 0.05, h]].map(([x, y]) => P(x, y, zW)); raw(cel(t, { Z: zW, fill: fog('#3e5052', zW), band: 0.8, inkW: 0.5 })); }
  // masts of the royal fleet, standing out of the harbour at every lean, yards askew, shrouds gone to threads
  for (let i = 0; i < 13; i++) { const Z = 48 + R() * 50, X = -55 + R() * 110, base = -12 - R() * 4, top = 3 + R() * 12, lean = (R() - 0.5) * 3;
    if (Math.abs(X) < 6) continue;
    const A = P(X, base, Z), B = P(X + lean, top, Z), col = fog('#2a3436', Z);
    raw(line([A, B], Math.max(1, K(Z) * 0.35), col, 1));
    for (let k = 0; k < 1 + Math.floor(R() * 3); k++) { const u = 0.45 + k * 0.18 + R() * 0.05, c = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u], yw = K(Z) * (2 + R() * 2), tl = (R() - 0.5) * yw * 0.5; raw(line([[c[0] - yw, c[1] + tl], [c[0] + yw, c[1] - tl]], Math.max(0.7, K(Z) * 0.18), col, 1)); }
    raw(line([B, [B[0] + K(Z) * 5, A[1] + (B[1] - A[1]) * 0.3]], 0.5, col, 0.6)); }
  raw(G.softBank(-10, W + 10, 300, 26, { col: AIR, op: 0.35, ph: 2, below: 20 }));
}
// ---- middle (Z 14-75), polish round (Cole): the lower town as real houses on four terraces falling away to the harbour.
// Every house is a solid (walls, an optional jettied upper storey, a pitched roof sitting on its walls, a chimney), each
// its own: gable to the street or eaves to the street, limewash, stone, tarred boards or timber frame; doors, shuttered
// windows (one hanging), shop signs on brackets, salt crust on the ridges, slipped slates, weed and barnacles; drowned
// laundry lines between upper windows with the washing streaming upward in the water; stairs between the terraces;
// wrecked boats lodged on roofs and capsized in the street.
{
  const fogA = G.fogger(AIR, 14, 75, 0.75), fogM = (c, Z, k = 1) => fogA(mix(c, '#142022', Math.max(0, 0.38 - (Z - 14) * 0.012)), Z, k);   // near houses darker, far ones lift into the water's light
  const TER = [[15.5, -0.9, 30], [25, -3.0, 42], [36.5, -5.8, 56], [51, -9.2, 72]];   // [front Z, ground Y, half-width X]
  const WALLS = [['#7e8c88', 'lime'], ['#58625f', 'stone'], ['#2e3634', 'tar'], ['#9a9e94', 'frame'], ['#6a7470', 'lime']];
  const SIGNS = ['fish', 'boot', 'cup', 'anchor', 'shears'];
  const UPPER = [];
  const win = (x, y, z, w, h, o2 = {}) => { const q = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map(([a, b]) => P(a, b, z)); let s = `<path d="${p2(q)}" fill="${fogM('#0c1416', z, 0.6)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, K(z) * 0.03))}"/>`;
    if (o2.shut !== false) { const sh = R(); const lq = sh < 0.35 ? [[x - w * 0.5, y + 0.05], [x, y], [x, y + h], [x - w * 0.5, y + h - 0.05]] : sh < 0.6 ? [[x, y], [x + w * 0.5, y - 0.02], [x + w * 0.45, y + h * 0.9], [x, y + h]] : [[x - w * 0.42, y - 0.2], [x, y + 0.02], [x, y + h], [x - w * 0.42, y + h - 0.3]];
      s += cel(lq.map(([a, b]) => P(a, b, z - 0.02)), { Z: z, fill: fogM(['#3a4a46', '#4a3a2a', '#2e3e3a'][Math.floor(R() * 3)], z), band: 0.8, inkW: 0.5 });
      if (R() < 0.6) s += cel([[x + w, y], [x + w * 1.5, y + 0.03], [x + w * 1.5, y + h], [x + w, y + h]].map(([a, b]) => P(a, b, z - 0.02)), { Z: z, fill: fogM('#3a4a46', z), band: 0.8, inkW: 0.5 }); }
    if (R() < 0.4) s += I.kelp(x + w * 0.5, y, z - 0.05, 0.3 + R() * 0.6, { w: 0.03, col: fogM('#1e2a1c', z) });
    return s; };
  const sign = (x, y, z, kind) => { const a = P(x, y, z - 0.05), b = P(x - 0.7, y, z - 0.6), k = K(z); let s = line([a, b], Math.max(1, k * 0.05), INK, 1);
    const c = [b[0], b[1] + k * 0.22], r = k * 0.22; s += line([b, [c[0], c[1] - r]], 0.6, INK, 1);
    const shapes = { fish: [[c[0] - r, c[1]], [c[0] - r * 0.2, c[1] - r * 0.5], [c[0] + r * 0.6, c[1]], [c[0] + r, c[1] - r * 0.4], [c[0] + r, c[1] + r * 0.4], [c[0] + r * 0.6, c[1]], [c[0] - r * 0.2, c[1] + r * 0.5]], boot: [[c[0] - r * 0.4, c[1] - r], [c[0] + r * 0.1, c[1] - r], [c[0] + r * 0.1, c[1] + r * 0.3], [c[0] + r * 0.8, c[1] + r * 0.4], [c[0] + r * 0.8, c[1] + r * 0.8], [c[0] - r * 0.4, c[1] + r * 0.8]], cup: [[c[0] - r * 0.6, c[1] - r], [c[0] + r * 0.6, c[1] - r], [c[0] + r * 0.4, c[1] + r * 0.3], [c[0] + r * 0.1, c[1] + r * 0.4], [c[0] + r * 0.1, c[1] + r * 0.8], [c[0] - r * 0.4, c[1] + r * 0.8], [c[0] - r * 0.1, c[1] + r * 0.4], [c[0] - r * 0.4, c[1] + r * 0.3]], anchor: [[c[0] - r * 0.1, c[1] - r], [c[0] + r * 0.1, c[1] - r], [c[0] + r * 0.1, c[1] + r * 0.5], [c[0] + r * 0.7, c[1] + r * 0.1], [c[0] + r * 0.5, c[1] + r * 0.8], [c[0] - r * 0.5, c[1] + r * 0.8], [c[0] - r * 0.7, c[1] + r * 0.1], [c[0] - r * 0.1, c[1] + r * 0.5]], shears: [[c[0] - r * 0.8, c[1] - r * 0.6], [c[0] + r * 0.8, c[1] + r * 0.6], [c[0] + r * 0.5, c[1] + r * 0.8], [c[0], c[1] + r * 0.1], [c[0] - r * 0.5, c[1] + r * 0.8], [c[0] - r * 0.8, c[1] + r * 0.6], [c[0] + r * 0.8, c[1] - r * 0.6]] };
    return s + cel(shapes[kind], { Z: z, fill: fogM('#4e6a5e', z), band: 0.8, inkW: 0.6 }) + I.barnacles(c[0], c[1], r * 0.4, 3, z); };
  function townHouse(X0, w, Z0, d, base) {
    const st = 1 + Math.floor(R() * (base > -1.5 ? 1.8 : 2.6)), h1 = 2.5 + R() * 0.4, h = h1 * st + R() * 0.4, jetty = st >= 2 && R() < 0.55, gz = R() < 0.55, [wc, kind] = WALLS[Math.floor(R() * WALLS.length)];
    const roofC = ['#283034', '#34383a', '#3e4440', '#24302e'][Math.floor(R() * 4)], X1 = X0 + w, jz = jetty ? 0.4 : 0, zf = Z0 - jz, yT = base + h, rise = (gz ? w : d) / 2 * (0.65 + R() * 0.5), ov = 0.3;
    let s = '';
    const frontLower = () => { let o2 = ''; const z = Z0 - 0.01;
      if (R() < 0.85) { const dx = X0 + 0.4 + R() * (w - 1.6), dq = G.arch(dx, dx + 1.0, base + 1.6, R() < 0.5 ? 'round' : 'point', { n: 5 }).map(([x, y]) => P(x, y === 0 ? base : y, z)); o2 += `<path d="${p2(dq)}" fill="${fogM('#081012', z, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, K(z) * 0.035))}"/>`; if (R() < 0.4) for (let k = 0; k < 3; k++) { const a = P(dx + 0.05, base + 0.3 + k * 0.45, z - 0.02), b = P(dx + 0.95, base + 0.4 + k * 0.42, z - 0.02); o2 += line([a, b], Math.max(1.2, K(z) * 0.1), fogM('#3a3024', z), 1); } }
      if (w > 3) o2 += win(X1 - 1.4, base + 1.2, z, 0.75, 1.0);
      o2 += I.barnacles(...P(X0 + w / 2, base + 0.2, z), K(z) * w * 0.4, 6, z);
      if (kind === 'frame') for (const u of [0, 0.5, 1]) o2 += line([P(X0 + w * u, base, z), P(X0 + w * u, base + h1, z)], Math.max(1, K(z) * 0.1), fogM('#2a241c', z), 1);
      if (R() < 0.5) o2 += sign(X1 - 0.1, base + h1 - 0.4, z, SIGNS[Math.floor(R() * SIGNS.length)]);
      return o2; };
    const frontUpper = (zz, yb) => () => { let o2 = ''; const z = zz - 0.01; for (let k = 0; k < Math.max(1, Math.round(w / 2)); k++) { const x = X0 + 0.5 + k * (w - 1.2) / Math.max(1, Math.round(w / 2) - 0.6 || 1); if (x + 0.7 > X1) break; o2 += win(x, yb + 0.9, z, 0.65, 0.95); UPPER.push([x + 0.3, yb + 1.9, z, Z0]); }
      if (kind === 'frame') { o2 += line([P(X0 - jz * 0.3, yb + 0.1, z), P(X1 + jz * 0.3, yb + 0.1, z)], Math.max(1, K(z) * 0.1), fogM('#2a241c', z), 1); for (const u of [0, 0.33, 0.66, 1]) o2 += line([P(X0 + w * u, yb, z), P(X0 + w * u, yb + h - h1, z)], Math.max(1, K(z) * 0.08), fogM('#2a241c', z), 1); }
      if (jetty) for (let k = 0; k <= w / 0.5; k++) { const a = P(X0 + k * 0.5, yb - 0.05, zz), b = P(X0 + k * 0.5, yb - 0.05, Z0); o2 += line([a, b], Math.max(1, K(zz) * 0.08), INK, 1); }
      return o2; };
    s += G.solid(G.box(X0, X1, base, base + h1, Z0, Z0 + d, wc, { front: frontLower }), { fog: fogM, stone: true });
    if (st >= 2) s += G.solid(G.box(X0 - jz * 0.3, X1 + jz * 0.3, base + h1, yT, zf, Z0 + d, wc, { front: frontUpper(zf, base + h1) }), { fog: fogM, stone: true });
    // the roof, sitting on the walls: gable to the street (ridge along Z) or eaves to the street (ridge along X)
    const xa = X0 - jz * 0.3 - (gz ? ov : ov * 0.6), xb = X1 + jz * 0.3 + (gz ? ov : ov * 0.6), za = zf - ov, zb = Z0 + d + ov, yE = yT - 0.12;
    const roofDeco = (ps, n, Z) => { let o2 = ''; const c = ps.reduce((a, p) => [a[0] + p[0] / ps.length, a[1] + p[1] / ps.length], [0, 0]); for (let k = 1; k < 6; k++) { const u = k / 6; o2 += `<path d="M${f1(ps[0][0] + (ps[3][0] - ps[0][0]) * u)} ${f1(ps[0][1] + (ps[3][1] - ps[0][1]) * u)} L${f1(ps[1][0] + (ps[2][0] - ps[1][0]) * u)} ${f1(ps[1][1] + (ps[2][1] - ps[1][1]) * u)}" stroke="${INK}" stroke-width="0.5" opacity="0.5"/>`; }
      if (R() < 0.5) { const hw = Math.abs(ps[1][0] - ps[0][0]) * 0.12, hh = Math.abs(ps[3][1] - ps[0][1]) * 0.18, cx = c[0] + (R() - 0.5) * hw * 3, cy = c[1] + (R() - 0.5) * hh; o2 += `<path d="M${f1(cx - hw)} ${f1(cy - hh)} L${f1(cx + hw)} ${f1(cy - hh * 0.8)} L${f1(cx + hw * 0.8)} ${f1(cy + hh)} L${f1(cx - hw * 0.9)} ${f1(cy + hh * 0.9)} Z" fill="#080c0e"/>` + line([[cx - hw * 0.4, cy - hh], [cx - hw * 0.4, cy + hh]], 1, '#3a3026', 0.9) + line([[cx + hw * 0.3, cy - hh], [cx + hw * 0.3, cy + hh]], 1, '#3a3026', 0.9); }
      o2 += stain(c[0] + (R() - 0.5) * 10, c[1], Math.abs(ps[1][0] - ps[0][0]) * 0.15, '#1e2a1c', 0.5); return o2; };
    let roof;
    if (gz) roof = [{ pts: [[xa, yE, za], [xa, yE, zb], [(X0 + X1) / 2, yT + rise, zb], [(X0 + X1) / 2, yT + rise, za]], col: roofC, deco: roofDeco, roof: true }, { pts: [[xb, yE, za], [xb, yE, zb], [(X0 + X1) / 2, yT + rise, zb], [(X0 + X1) / 2, yT + rise, za]], col: roofC, deco: roofDeco, roof: true },
      { pts: [[xa, yE, za], [xb, yE, za], [(X0 + X1) / 2, yT + rise, za]], col: mix(wc, '#000', 0.1), deco: () => R() < 0.6 ? win((X0 + X1) / 2 - 0.3, yT + 0.2, za + 0.02, 0.6, Math.min(0.8, rise * 0.5), { shut: false }) : '' }, { pts: [[xa, yE, zb], [xb, yE, zb], [(X0 + X1) / 2, yT + rise, zb]], col: wc }];
    else roof = [{ pts: [[xa, yE, za], [xb, yE, za], [xb, yT + rise, (za + zb) / 2], [xa, yT + rise, (za + zb) / 2]], col: roofC, deco: roofDeco, roof: true }, { pts: [[xa, yE, zb], [xb, yE, zb], [xb, yT + rise, (za + zb) / 2], [xa, yT + rise, (za + zb) / 2]], col: roofC, deco: roofDeco, roof: true },
      { pts: [[xa, yE, za], [xa, yE, zb], [xa, yT + rise, (za + zb) / 2]], col: wc }, { pts: [[xb, yE, za], [xb, yE, zb], [xb, yT + rise, (za + zb) / 2]], col: wc }];
    s += G.solid(roof, { fog: fogM });
    // salt crust and weed along the ridge
    const r0 = gz ? P((X0 + X1) / 2, yT + rise, za) : P(xa, yT + rise, (za + zb) / 2), r1 = gz ? P((X0 + X1) / 2, yT + rise, zb) : P(xb, yT + rise, (za + zb) / 2);
    s += line([r0, r1], Math.max(1, K(Z0) * 0.07), fogM('#c8ccc0', Z0), 0.6) + I.kelp((X0 + X1) / 2 + (R() - 0.5) * w * 0.6, yE, za - 0.05, 0.4 + R() * 1.0, { w: 0.05, col: fogM('#1e2a1c', Z0) });
    // a chimney on the roof, stone, one broken off
    if (R() < 0.75) { const cxx = X0 + w * (0.2 + R() * 0.6), czz = gz ? Z0 + d * (0.3 + R() * 0.4) : (za + zb) / 2 + (R() < 0.5 ? -0.4 : 0.4), top = yT + rise + 0.6 + R() * 1.0;
      s += G.solid(G.box(cxx - 0.3, cxx + 0.3, yT, top, czz - 0.3, czz + 0.3, fogM('#4a5250', Z0)), { fog: fogM }); if (R() < 0.5) s += G.solid(G.box(cxx - 0.38, cxx + 0.38, top, top + 0.12, czz - 0.38, czz + 0.38, '#3a4240'), { fog: fogM }); }
    return s;
  }
  const items = [];
  TER.forEach(([Zt, base, hw], ti) => { let X = -hw - R() * 3; while (X < hw) { const w = 2.8 + R() * 2.6, d = 4 + R() * 2.5, gap = 0.3 + R() * 1.4; const zOff = R() * 2.5; if (!(ti === 0 && X + w > -7.5 && X < 8) && !(ti === 1 && X + w > -4 && X < 4.5)) items.push(['house', X, w, Zt + 0.5 + zOff, d, base]); X += w + gap; } });
  // the parish church: nave and broken spire on the third terrace, left
  items.push(['church', -22, 0, 38, 0, -5.8]);
  items.sort((a, b) => b[3] - a[3]);
  // terrace retaining walls (drawn just in front of each terrace's houses) and the stairs between terraces
  const walls = TER.map(([Zt, base, hw], ti) => [Zt, () => { const at = (s2, t) => [-hw - 10 + s2, base - 3.2 + t, Zt]; return ashlar(at, hw * 2 + 20, 3.2, fogM('#46524f', Zt), { scale: 1.2, rough: true, vary: 0.2, mortar: 0.55 }) + hatch3(at, 0, hw * 2 + 20, 0, 3.2, 0.7, { op: 0.35 }) + line([P(-hw - 10, base, Zt), P(hw + 10, base, Zt)], Math.max(1, K(Zt) * 0.08), fogM('#7a8478', Zt), 0.7); }]);
  let wi = walls.length - 1;
  for (const it of items) {
    while (wi >= 0 && walls[wi][0] > it[3] - 0.01 + 100) wi--;
    if (it[0] === 'church') { const [, X, , Z, , base] = it; raw(G.solid(G.box(X, X + 7, base, base + 6, Z, Z + 12, '#4e5a58'), { fog: fogM }) + G.solid([{ pts: [[X - 0.3, base + 5.9, Z - 0.3], [X - 0.3, base + 5.9, Z + 12.3], [X + 3.5, base + 9, Z + 12.3], [X + 3.5, base + 9, Z - 0.3]], col: '#2a3234' }, { pts: [[X + 7.3, base + 5.9, Z - 0.3], [X + 7.3, base + 5.9, Z + 12.3], [X + 3.5, base + 9, Z + 12.3], [X + 3.5, base + 9, Z - 0.3]], col: '#2a3234' }, { pts: [[X - 0.3, base + 5.9, Z - 0.3], [X + 7.3, base + 5.9, Z - 0.3], [X + 3.5, base + 9, Z - 0.3]], col: '#4e5a58' }], { fog: fogM }));
      const tz = Z - 3, tw = [[X + 2, base], [X + 5, base], [X + 5, base + 15], [X + 4.6, base + 17.5], [X + 3.9, base + 21], [X + 3.2, base + 18.2], [X + 2, base + 16]].map(([x, y]) => P(x, y, tz)); raw(cel(tw, { Z: tz, fill: fogM('#4a5654', tz), band: 1, tex: 'url(#mottle)', texOp: 0.4 }) + hatch3((s2, t) => [X + 3.5 + s2, base + t, tz], 0, 1.5, 0, 16, 0.8, { op: 0.35 }));
      raw(`<path d="${p2(G.arch(X + 3, X + 4, base + 12, 'point', { n: 4 }).map(([x, y]) => P(x, y === 0 ? base + 11 : y, tz - 0.01)))}" fill="${fogM('#0e1618', tz)}"/>`);
      raw(BK.tornVoid((s2, t) => [X + 2 + s2, base + t, tz - 0.02], 1.6, 17.6, 0.6, 0.85, { rot: 0.2, lobes: [[0.5, 0.3, 0.6]], fray: [[0.4, 3, 0.3]], depth: 0.4, cut: fogM('#2a3436', tz), fissures: 1 }).svg); continue; }
    const [, X, w, Z, d, base] = it; raw(townHouse(X, w, Z, d, base));
  }
  walls.slice().reverse().forEach(([, fn]) => raw(fn()));
  // stairs down between the terraces (left of the processional stair), treads seen from above
  for (const [x0, za, ya, zb, yb] of [[-7.4, 16, -0.9, 25, -3.0], [-9.5, 25.5, -3.0, 36.5, -5.8], [8.2, 16, -0.9, 25, -3.0]]) { const n = Math.round((ya - yb) / 0.2); for (let k = 0; k < n; k++) { const z = za + (zb - za) * k / n, y = ya - (ya - yb) * k / n, q = [P(x0, y, z), P(x0 + 1.6, y, z), P(x0 + 1.6, y, z + (zb - za) / n), P(x0, y, z + (zb - za) / n)]; raw(`<path d="${p2(q)}" fill="${fogM('#6a7470', z)}" stroke="${fogM(INK, z, 0.6)}" stroke-width="0.6"/>`); } }
  // drowned laundry lines between upper windows of neighbours: the washing streams upward, as cloth does under water
  UPPER.sort((a, b) => a[3] - b[3] || a[0] - b[0]);
  for (let i = 0; i < UPPER.length - 1; i++) { const a = UPPER[i], b = UPPER[i + 1]; if (a[3] !== b[3] && Math.abs(a[2] - b[2]) > 3) continue; if (Math.abs(b[0] - a[0]) > 6 || Math.abs(b[0] - a[0]) < 1.2 || R() < 0.45) continue;
    const A = P(a[0], a[1], a[2] - 0.1), B = P(b[0], b[1], b[2] - 0.1), sag = K(a[2]) * 0.2; raw(G.hang(A, B, sag, 0.6, fogM('#4a4234', a[2])));
    for (let k = 1; k < 5; k++) { if (R() < 0.3) continue; const u = k / 5, x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u + Math.sin(u * Math.PI) * sag, cw = K(a[2]) * (0.25 + R() * 0.2), ch = K(a[2]) * (0.4 + R() * 0.4), lean = (R() - 0.3) * cw;
      raw(cel([[x - cw / 2, y], [x + cw / 2, y], [x + cw / 2 + lean, y - ch], [x + lean * 0.5, y - ch * 1.15], [x - cw / 2 + lean, y - ch * 0.9]], { Z: a[2], fill: fogM(['#8a9088', '#5a6a72', '#9a9478', '#6a5a4a'][Math.floor(R() * 4)], a[2]), band: 0.8, inkW: 0.5 })); } }
  // wrecked boats: one lodged across a second-terrace roof, one capsized in the near street
  for (const [X, Y, Z, l, tilt, cap] of [[11.5, 2.6, 27, 6, -0.25, false], [-12.5, -0.9, 18.5, 5, 0.05, true]]) { const k = K(Z), c = P(X, Y, Z), L2 = l * k / 2, Hh = k * 0.8, ca = Math.cos(tilt), sa = Math.sin(tilt), rot = ([u, v]) => [c[0] + u * ca - v * sa, c[1] + u * sa + v * ca];
    const hull = cap ? [[-L2, 0], [-L2 * 0.8, -Hh * 0.8], [0, -Hh], [L2 * 0.85, -Hh * 0.8], [L2, 0]] : [[-L2, -Hh * 0.9], [-L2 * 0.7, 0], [L2 * 0.7, 0], [L2, -Hh * 1.1], [L2 * 0.6, -Hh * 0.6], [-L2 * 0.6, -Hh * 0.55]];
    raw(cel(hull.map(rot), { Z, fill: fogM('#3a3024', Z), band: 1.5, tex: 'url(#mottle)', texOp: 0.5 }));
    for (let j = 1; j < 4; j++) raw(line([rot([-L2 * (1 - j * 0.1), -Hh * j / 4]), rot([L2 * (1 - j * 0.08), -Hh * j / 4])], 0.7, INK, 0.6));
    if (!cap) { raw(line([rot([0, -Hh * 0.6]), rot([L2 * 0.1, -Hh * 3.2])], Math.max(1.4, k * 0.12), INK, 1)); raw(I.barnacles(...rot([0, -Hh * 0.3]), L2 * 0.4, 6, Z)); }
    raw(I.kelp(X + l * 0.3, Y, Z - 0.1, 0.8, { w: 0.05, col: fogM('#1e2a1c', Z) })); }
}
// ---- near structure (Z 10-16): the stair's drop. Its two balustrades fall away from the newels; on each newel a saint
{
  // the descending flight seen past the edge: treads as horizontal lips, stepping down and away (only their lips show)
  for (let k = 0; k < 40; k++) { const Z = EDGE + 0.4 + k * 0.34, Y = -0.17 * (k + 1); const A = P(-2.6, Y, Z), B = P(3.4, Y, Z); if (A[1] > 392) break; raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${fog('#7a8e8a', Z)}" stroke-width="0.8" opacity="0.6"/>`); }
  for (const [X, side] of [[-3.0, -1], [3.8, 1]]) {
    // balustrade: a coping rail falling with the stair, squat balusters under it, some gone
    const rail = []; for (let k = 0; k <= 12; k++) { const Z = EDGE + k * 0.8, Y = 1.0 - 0.5 * k * 0.8; rail.push([X, Y, Z]); }
    const top = rail.map(p => P(...p)), bot = rail.map(([x, y, z]) => P(x, y - 0.18, z));
    raw(`<path d="${p2([...top, ...bot.reverse()])}" fill="${fog('#5e6c6a', 12)}" stroke="${INK}" stroke-width="0.8"/>`);
    for (let k = 0; k < 30; k++) { const Z = EDGE + 0.2 + k * 0.32, Y = 1.0 - 0.5 * (Z - EDGE); if (R() < 0.2) continue; const a = P(X, Y - 0.18, Z), b = P(X, Y - 0.9, Z), w = Math.max(1, K(Z) * 0.06); if (b[1] > 395) break; raw(`<path d="M${f1(a[0])} ${f1(a[1])} C${f1(a[0] - w * 1.6)} ${f1(a[1] + (b[1] - a[1]) * 0.4)} ${f1(a[0] + w * 1.6)} ${f1(a[1] + (b[1] - a[1]) * 0.6)} ${f1(b[0])} ${f1(b[1])}" stroke="${INK}" stroke-width="${f1(w * 1.6)}" fill="none"/><path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="${fog('#56625f', Z)}" stroke-width="${f1(w * 0.9)}"/>`); }
    // the newel and its saint: a tall plinth, the statue robed, one arm raised in blessing (left) or broken off (right)
    const Zn = EDGE + 0.3, nb = [[X - 0.45, 0], [X + 0.45, 0], [X + 0.45, 1.5], [X - 0.45, 1.5]].map(([x, y]) => P(x, y, Zn));
    raw(cel(nb, { Z: Zn, fill: '#4a5654', tex: 'url(#mottle)', texOp: 0.45 }) + hatch3((s, t) => [X - 0.45 + s, t, Zn], 0, 0.9, 0, 1.5, 0.8, { op: 0.4 }) + I.barnacles(...P(X, 0.25, Zn), K(Zn) * 0.3, 9, Zn));
    // a gothic pinnacle on the newel: a gabled shaft with a niche, then a crocketed spire; the right one snapped off
    { const top = side < 0 ? 4.3 : 3.15, sh = [[-0.32, 1.5], [0.32, 1.5], [0.32, 2.55], [0.0, 2.85], [-0.32, 2.55]];
      raw(cel(sh.map(([x, y]) => P(X + x, y, Zn)), { Z: Zn, fill: '#5e6c6a', tex: 'url(#mottle)', texOp: 0.5, band: K(Zn) * 0.08 }) + hatch3((s, t) => [X + s, 1.5 + t, Zn], 0, 0.32, 0, 1.0, 0.8, { op: 0.4 }));
      raw(`<path d="${p2(G.arch(X - 0.14, X + 0.14, 1.95, 'point', { n: 4 }).map(([x, y]) => P(x, y ? y : 1.7, Zn)))}" fill="#121a1c" stroke="${INK}" stroke-width="0.8"/>`);
      const sp = side < 0 ? [[-0.24, 2.6], [0.24, 2.6], [0.03, top], [-0.03, top]] : [[-0.24, 2.6], [0.24, 2.6], [0.13, 2.95], [0.08, 3.1], [0.02, 2.98], [-0.05, top], [-0.12, 3.0]];
      raw(cel(sp.map(([x, y]) => P(X + x, y, Zn)), { Z: Zn, fill: '#667472', tex: 'url(#mottle)', texOp: 0.5, band: K(Zn) * 0.06 }));
      for (let k = 0; k < (side < 0 ? 5 : 2); k++) for (const sd of [-1, 1]) { const y = 2.75 + k * 0.3, x = sd * 0.24 * (1 - (y - 2.6) / (top - 2.6 + 0.01)), c = P(X + x, y, Zn); raw(`<path d="M${f1(c[0])} ${f1(c[1])} q${f1(sd * 4)} ${f1(-3)} ${f1(sd * 2)} ${f1(-6)} q${f1(-sd * 2)} 2 ${f1(-sd * 2)} 4 Z" fill="#6a7876" stroke="${INK}" stroke-width="0.7"/>`); }
      if (side < 0) { const f = P(X, top, Zn); raw(`<path d="M${f1(f[0])} ${f1(f[1] + 2)} l0 -10 M${f1(f[0] - 4)} ${f1(f[1] - 5)} l8 0" stroke="${INK}" stroke-width="3.2"/><path d="M${f1(f[0])} ${f1(f[1] + 2)} l0 -10 M${f1(f[0] - 4)} ${f1(f[1] - 5)} l8 0" stroke="#6a7876" stroke-width="1.6"/>`); }
      raw(I.kelp(X + 0.2, 2.55, Zn - 0.1, 1.0, { w: 0.045 }) + I.kelp(X - 0.15, top - 0.2, Zn - 0.1, 0.7, { w: 0.035 }) + I.barnacles(...P(X + 0.1, 2.5, Zn), 6, 6, Zn)); }
    if (side < 0) raw(BK.tornVoid((s, t) => [X - 0.4 + s, 1.5 + t, Zn - 0.12], 0.5, 0.75, 0.2, 0.24, { rot: -0.4, lobes: [[3.6, 0.12, 0.5]], fray: [[0.3, 3, 0.1]], depth: 0.3, cut: '#26302f', fissures: 1, fissLen: 0.2, violet: true }).svg);
  }
}
// ---- the stepped quiet band behind the fighters, and dark frame edges
raw(BK.quiet(MURK, 318, 392, { steps: [0.1, 0.12, 0.14, 0.18], hop: 0.14 }));
raw(G.edges(MURK, { l: 150, r: 220, t: 0, steps: [0.14, 0.16, 0.18, 0.2] }));
// ---- the top landing: big flags heaved and silted, joints converging; pools where flags have dropped (the eels' holes)
{
  const holes = [[-5.3, 7.4, 1.1, 0.8], [2.2, 7.8, 1.4, 0.7]];
  raw(G.flags(-14, 14, 3.4, EDGE, '#56625e', { size: 0.85, long: 1.3, heave: 0.3, cracks: 22, vary: 0.2, skip: (X, Z) => holes.some(([x, z, w, d]) => Math.abs(X - x) < w * 0.45 && Math.abs(Z - z) < d * 0.45) }));
  for (const [x, z, w, d] of holes) raw(G.puddle(x, z, w, d, '#081014', '#7a9a92') + I.barnacles(...P(x - w * 0.45, 0, z - d * 0.45), 8, 6, z) + I.kelp(x + 0.2, 0, z, -0.5, { w: 0.05 }));
  // silt drifted against the balustrade foot, rippled; low contrast
  for (let i = 0; i < 9; i++) { const X = -12 + i * 3 + R(), Z = 4 + R() * 4, w = 1.2 + R() * 2, pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(P(X + w * t, 0.005, Z + Math.sin(t * Math.PI) * 0.35)); } for (let k = 8; k >= 0; k--) { const t = k / 8; pts.push(P(X + w * t, 0.005, Z - Math.sin(t * Math.PI) * 0.18)); } raw(`<path d="${smooth(pts, true, 0.6)}" fill="#7a8278" opacity="0.28"/>`); }
  // the landing's lip: a moulded coping, chipped, over the drop
  const lip = [P(-14, 0, EDGE), P(14, 0, EDGE), P(14, -0.25, EDGE), P(-14, -0.25, EDGE)]; raw(cel(lip, { Z: EDGE, fill: '#4a5654', tex: 'url(#mottle)', texOp: 0.4 }));
  raw(S.occBand((s, t) => [-14 + s, 0, 3.4 + t], 28, 0.9, { op: 0.35 }));
}
raw(I.bubbles(30, 0, W, 10, 280, 1.6) + I.motes(160, 0, 380, '#b8d0c8'));

// ======================================================================== MID: low, dark things on the landing behind the fighters
layer('mid');
{
  // the breach at the landing's edge, right of centre: the flags broken and tipped into the drop, black water welling in it
  const Z = 8.0, cx = 5.6, br = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283, m = 0.75 + R() * 0.35; br.push(P(cx + Math.cos(a) * 1.5 * m, 0.004, Z + Math.sin(a) * 0.45 * m)); }
  raw(`<path d="${smooth(br, true, 0.3)}" fill="#04080a" stroke="${INK}" stroke-width="1"/>`);
  for (let k = 0; k < 6; k++) { const a = R() * 6.283, c = P(cx + Math.cos(a) * 1.4, 0.05, Z + Math.sin(a) * 0.35), w = K(Z) * (0.25 + R() * 0.2); raw(cel(chip([[c[0] - w, c[1]], [c[0] + w, c[1] - w * 0.35 * (R() - 0.3)], [c[0] + w * 0.8, c[1] - w * 0.5], [c[0] - w * 0.9, c[1] - w * 0.3]], 0.5), { Z, fill: '#3a4644', band: 1 })); }
  raw(BK.ripples(...P(cx, 0.01, Z), K(Z) * 1.0, 4, '#4a6260', 0.4));
  // a fallen iron lamp standard across the landing, verdigris, its cage crushed; a coil of mooring rope
  const a = P(-9.5, 0.08, 7.6), b = P(-6.2, 0.1, 8.2); raw(line([a, b], K(8) * 0.07, INK, 1) + line([a, b], K(8) * 0.04, '#34504a', 1));
  raw(cel(chip([[b[0] - 5, b[1] - 8], [b[0] + 6, b[1] - 9], [b[0] + 7, b[1] + 1], [b[0] - 6, b[1] + 1]], 0.5), { Z: 8, fill: '#2a3e3a', band: 1.2 }));
  let rp = ''; for (let k = 0; k < 4; k++) rp += `<ellipse cx="${f1(P(9.6, 0, 7.4)[0])}" cy="${f1(P(9.6, 0, 7.4)[1] - k * 1.6)}" rx="${f1(K(7.4) * (0.45 - k * 0.07))}" ry="${f1(K(7.4) * 0.08)}" fill="none" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${f1(P(9.6, 0, 7.4)[0])}" cy="${f1(P(9.6, 0, 7.4)[1] - k * 1.6)}" rx="${f1(K(7.4) * (0.45 - k * 0.07))}" ry="${f1(K(7.4) * 0.08)}" fill="none" stroke="#4a4232" stroke-width="1.4"/>`; raw(rp);
  raw(I.kelp(-7, 0, 8.3, -0.4, { w: 0.04 }) + I.kelp(8.6, 0, 8.2, -0.5, { w: 0.05 }));
}

raw(G.barrel(-1.0, 8.2, { side: true, col: '#34403a', hoop: '#2a3a34', extra: I.barnacles(...P(-1.0, 0.3, 8.2), 10, 6, 8.2) }));   // scale cue: a drowned cask
// ======================================================================== FORE: the west porch's arch over the top left, a fallen royal statue head, a lamp
layer('fore');
{
  // the porch arch's underside across the top: voussoirs seen from below, deep in shadow, kelp hanging from the joints
  const ZN = 3.2, pts = []; for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push([-4.3 + u * 2.9, 1.9 + Math.pow(u, 1.5) * 1.4]); }
  const top = pts.map(([x, y]) => P(x, y + 2, ZN)), bot = pts.map(([x, y]) => P(x, y, ZN));
  raw(`<path d="${p2([...top, ...bot.reverse()])}" fill="#141c20" stroke="${INK}" stroke-width="2"/>`);
  for (let k = 0; k < 12; k++) { const A = P(pts[k][0], pts[k][1], ZN), B = P(pts[k][0], pts[k][1] + 2, ZN); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0] - 10)} ${f1(B[1])}" stroke="${INK}" stroke-width="1.6"/>`); }
  raw(`<path d="${p2([...pts.map(([x, y]) => P(x, y + 2, ZN)), ...pts.map(([x, y]) => P(x, y, ZN)).reverse()])}" fill="${S.hatchA(3)}" opacity="0.55"/>`);
  for (let k = 0; k < 5; k++) { const p = pts[1 + Math.floor(R() * 7)]; raw(I.kelp(p[0] + R() * 0.2, p[1], ZN - 0.05, 0.25 + R() * 0.35, { w: 0.05, col: '#141c14' })); }
  // a drowned king's statue head on the landing at the left, fallen from somewhere above: crowned, barnacled, face up
  const c = P(-4.35, 0.3, 4.2), k = K(4.2) * 0.36;
  raw(G.rockMass([[c[0] - k, c[1] + k * 0.9], [c[0] - k * 1.05, c[1] - k * 0.1], [c[0] - k * 0.6, c[1] - k * 0.8], [c[0] + k * 0.2, c[1] - k * 0.95], [c[0] + k * 0.9, c[1] - k * 0.5], [c[0] + k * 1.0, c[1] + k * 0.3], [c[0] + k * 0.6, c[1] + k * 0.9]], 4.2, '#3c4846', { fiss: 2 }));
  for (let j = 0; j < 5; j++) { const x = c[0] - k * 0.7 + j * k * 0.32, y = c[1] - k * 0.75 - Math.sin(j / 4 * Math.PI) * k * 0.15; raw(cel([[x - k * 0.09, y], [x + k * 0.09, y], [x + k * 0.06, y - k * 0.16], [x, y - k * 0.22], [x - k * 0.06, y - k * 0.17]], { Z: 4.2, fill: '#4a5a54', band: 1 })); }
  raw(line([[c[0] - k * 0.5, c[1] - k * 0.1], [c[0] - k * 0.1, c[1] - k * 0.05]], 1.6, INK, 0.8) + line([[c[0] + k * 0.15, c[1] - k * 0.05], [c[0] + k * 0.5, c[1] - k * 0.1]], 1.6, INK, 0.8) + line([[c[0] - k * 0.05, c[1] + k * 0.15], [c[0] + k * 0.2, c[1] + k * 0.35]], 1.4, INK, 0.7));
  raw(I.barnacles(c[0] + k * 0.4, c[1] + k * 0.4, k * 0.5, 14, 4.2) + `<path d="M${f1(c[0] - k * 0.4)} ${f1(c[1] + k * 0.6)} q${f1(k * 0.4)} ${f1(-k * 0.2)} ${f1(k * 0.9)} 0" stroke="${I.VERD}" stroke-width="3" opacity="0.4" fill="none"/>`);
  // the right edge: an iron lamp standard on the balustrade, verdigris, its lantern dark, a mooring ring and chain
  const L0 = P(4.55, 0, 4.6), L1 = P(4.55, 2.5, 4.6); raw(line([L0, L1], 9, INK, 1) + line([L0, L1], 6, '#2c3c38', 1) + line([[L0[0] - 1.5, L0[1]], [L1[0] - 1.5, L1[1]]], 1.2, '#5a8070', 0.5));
  const lc = P(4.05, 2.15, 4.6); raw(line([L1, [lc[0] - 10, L1[1] + 4], lc], 5, INK, 1) + line([L1, [lc[0] - 10, L1[1] + 4], lc], 3, '#2c3c38', 1));
  raw(cel([[lc[0] - 14, lc[1] + 4], [lc[0] + 14, lc[1] + 4], [lc[0] + 18, lc[1] + 46], [lc[0] - 18, lc[1] + 46]], { Z: 4.6, fill: '#22302c', band: 3 }) + `<path d="M${f1(lc[0])} ${f1(lc[1] + 4)} L${f1(lc[0])} ${f1(lc[1] + 46)} M${f1(lc[0] - 16)} ${f1(lc[1] + 25)} L${f1(lc[0] + 16)} ${f1(lc[1] + 25)}" stroke="${INK}" stroke-width="2"/>` + I.kelp(4.45, 2.4, 4.5, 0.5, { w: 0.05, col: '#141c14' }));
  // rubble along the bottom edge
  for (const [cx, sd] of [[60, -1], [W - 60, 1]]) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([cx + sd * (t - 0.5) * 200, H - 14 - Math.sin(t * Math.PI) * (26 + R() * 10)]); } raw(G.rockMass([[cx - 110, H + 4], ...pts, [cx + 110, H + 4]], 3.5, '#1a2428', { fiss: 3, hop: 0.6 })); }
  raw(I.bubbles(12, 40, W - 40, 40, H - 60, 2.2));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
