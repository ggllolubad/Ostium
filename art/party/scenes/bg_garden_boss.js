// World XIV, the Blighted Garden: THE HEART OF THE GARDEN (boss room `garden_boss`, round 2, Living Ink). Boss: The
// Antlered Mother ("The garden's heart: a great stag grown through with fungus and eyes. She is the garden now.").
// Where she belongs: the white hind's glade at the garden's heart, the oldest ground, ringed by colossal trees whose
// roots all run to her. Two of them lean together over her into a pointed gate of trunks and roots (the right 45%, her
// stage); through it the low sun sets in pale yellow and pink behind her antlers, the most dramatic light in the world.
// The roots spread from where she stands across the black loam toward us, eyes opened in them; blooms and fungus on
// everything. The heroes stand under the dark vault of branches on the left, among buttress roots.
// Palette: pink and pale-yellow glare against black loam and bark; lilac sky. No gold; no red.
// Usage: node scenes/bg_garden_boss.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIV');
const { S, B, G } = require('./battle_kit_g5').make(14501, '#120e12', '#2a1e28', '#e8c8c0');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, mould, bracket, caps, pustules, eye, quiet, skyBands } = B;
const { W, H, air, rose, foliage, bigCap, tree, shaft } = G;
const MV = require('./materials_v2')(S);
const PINK = '#d4a0b2', LILAC = '#b4a0cc', YEL = '#ded68e', LOAM = '#1a1512', BARK = '#2e2628', BONE = '#d8d0bc', MOULD = '#8a8098', MURK = B.MURK;
const SUN = [1010, 96];

// a colossal trunk from foot (screen) leaning to top, width w at the foot narrowing; bark furrows, brackets, eyes
function colossus(fx, fy, tx, ty, w0, w1, o = {}) {
  const n = 10, L = [], Rr = []; for (let i = 0; i <= n; i++) { const u = i / n, x = fx + (tx - fx) * u + Math.sin(u * 3 + (o.ph || 0)) * w0 * 0.15, y = fy + (ty - fy) * u, w = w0 + (w1 - w0) * Math.pow(u, 0.7) + (i === 0 ? w0 * 0.5 : i === 1 ? w0 * 0.15 : 0); L.push([x - w / 2, y]); Rr.push([x + w / 2, y]); }
  const poly = [...L, ...Rr.slice().reverse()], col = o.col || BARK;
  let s = cel(poly, { Z: o.Z || 14, fill: col, band: w0 * 0.12, tex: 'url(#mottle)', texOp: 0.5 });
  // bark: deep furrows wandering up the trunk in broken runs, plates between them, burls and moss
  for (let k = 0; k < 9; k++) { const u = 0.06 + k * 0.11 + (R() - 0.5) * 0.04; let i0 = Math.floor(R() * 3); while (i0 < n) { const i1 = Math.min(n, i0 + 2 + Math.floor(R() * 4)); const seg = []; for (let i = i0; i <= i1; i++) seg.push([L[i][0] + (Rr[i][0] - L[i][0]) * (u + Math.sin(i * 1.7 + k * 2.3) * 0.03), L[i][1]]); s += line(seg, Math.max(1, w0 * (0.01 + R() * 0.015)), mix(col, INK, 0.7), 0.8); i0 = i1 + 1 + Math.floor(R() * 2); } }
  for (let k = 0; k < 3; k++) { const i = 2 + Math.floor(R() * 6), u = 0.25 + R() * 0.5, c = [L[i][0] + (Rr[i][0] - L[i][0]) * u, L[i][1]], r = w0 * (0.12 + R() * 0.1); s += cel(blob(c[0], c[1], r, r * 1.3, 12, 0.3), { Z: o.Z || 14, fill: mix(col, '#6a5a5a', 0.15), band: r * 0.3 }) + `<path d="M${f1(c[0] - r * 0.5)} ${f1(c[1])} q${f1(r * 0.5)} ${f1(-r * 0.6)} ${f1(r)} 0" stroke="${INK}" stroke-width="1" fill="none" opacity="0.7"/>`; }
  for (let k = 0; k < 1; k++) { const i = 1 + Math.floor(R() * 4), c = [(L[i][0] + Rr[i][0]) / 2 + (R() - 0.5) * w0 * 0.3, L[i][1]]; s += B.mould(c[0], c[1], w0 * 0.15, w0 * 0.3, { col: '#4a5440', n: 30 }); }
  // the rim of sunset light on the side toward the sun, the far side crosshatched
  const toSun = (SUN[0] - fx) > 0 ? Rr : L; s += line(toSun.map(([x, y]) => [x + (toSun === Rr ? -2 : 2), y]), Math.max(1.4, w0 * 0.03), o.rim || '#f0d8c8', 0.75);
  const away = toSun === Rr ? L : Rr; s += `<path d="${p2([...away, ...away.map((p, i) => [(p[0] + (toSun === Rr ? Rr : L)[i][0]) / 2, p[1]]).reverse()])}" fill="${S.hatchA(10)}" opacity="0.5"/>`;
  return { svg: s, L, R: Rr };
}
// a root: smooth tapering body (screen)
function root(pts, w0, w1, col = BARK) {   // materials v2 strand, with the sunset rim kept on its upper edge
  const n = pts.length, Lp = []; for (let j = 0; j < n; j++) { const a = pts[Math.max(0, j - 1)], b = pts[Math.min(n - 1, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = (w0 + (w1 - w0) * j / (n - 1)) / 2 * 0.8; Lp.push([pts[j][0] - dy / l * ww, pts[j][1] + dx / l * ww]); }
  return MV.strand(pts, w0, w1, 12, { col, bark: w0 > 8 ? 1 : 0 }) + `<path d="${smooth(Lp, false, 0.5)}" stroke="#e8c8b8" stroke-width="${f1(Math.max(0.6, w0 * 0.05))}" fill="none" opacity="0.45"/>`;
}

// ======================================================================== FAR
layer('far');
raw(G.gradSky([[0, '#4e3e58'], [0.18, '#6e5a72'], [0.35, '#946e84'], [0.5, '#c0949a'], [0.62, '#e2bca8'], [0.75, '#f2e0c0'], [1, '#f4e4c4']]));
for (const [cx, cy, w, h] of [[300, 60, 520, 50], [700, 110, 380, 34], [1380, 70, 300, 36]]) raw(G.softCloud(cx, cy, w, h, '#a8849a', { lit: '#f8dcc8', litK: 0.45, dark: '#4a3848', darkK: 0.3, op: 0.75 }));
// the low sun behind her, stepped rings of pale yellow and pink
raw(G.glow(SUN[0], SUN[1], 420, 300, '#f8e0c4', 0.75) + G.glow(SUN[0], SUN[1], 150, 140, '#fdf0d8', 0.95) + `<circle cx="${SUN[0]}" cy="${SUN[1]}" r="34" fill="#fffbee"/>`);
// spore and petals hanging in the glare
{ let m = ''; for (let k = 0; k < 260; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 300)}" r="${f1(0.5 + R() * 1.3)}" fill="${R() < 0.5 ? '#fff4dc' : PINK}" opacity="${f1(0.3 + R() * 0.5)}"/>`; raw(m); }
// ---- distance: the far ring of the colossal trees round the glade, silhouettes in the pink haze
for (const [X, Z, w] of [[-60, 120, 5], [-30, 110, 4], [-10, 130, 4.5], [30, 120, 4], [55, 125, 5], [80, 115, 4.5]]) { const b = P(X, 0, Z), k = K(Z); raw(fillP([[b[0] - k * w * 0.6, b[1]], [b[0] + k * w * 0.6, b[1]], [b[0] + k * w * 0.35, -5], [b[0] - k * w * 0.35, -5]], '#a88a92', 0.8) + line([[b[0] - k * w * 0.35, 60], [b[0] - k * w * 2, 20]], k * 1.2, '#a88a92', 0.8)); }
// the glade floor far off, pale with the glare, the roots running out across it
raw(fillP([[-10, 296], [W + 10, 296], [W + 10, H + 5], [-10, H + 5]], '#8a7472'));
for (const [z0, col] of [[45, '#6a5658'], [24, '#4a3c3e'], [14, '#2e2628'], [8.5, '#1e1818']]) raw(fillP([P(-200, 0, z0), P(200, 0, z0), P(200, 0, 3.5), P(-200, 0, 3.5)].map(([x, y]) => [Math.max(-20, Math.min(W + 20, x)), y]), col));
// ---- the two colossal trunks leaning together into the gate over the stage, and their branches meeting overhead
{
  const gl = colossus(690, 330, 800, -40, 120, 70, { ph: 1, Z: 15 }), gr = colossus(1450, 336, 1350, -40, 140, 80, { ph: 2.5, Z: 15 });
  // the branches of the two meeting over the gate in a pointed arch (cropped at the frame top)
  const arcL = [[800, 0], [880, 20], [980, 30], [1080, 24]], arcR = [[1350, 0], [1270, 18], [1170, 30], [1080, 24]];
  raw(root(arcL, 50, 18) + root(arcR, 54, 18) + root([[930, 24], [990, 6], [1040, -10]], 18, 6) + root([[1230, 26], [1180, 8], [1130, -10]], 18, 6));
  raw(gl.svg + gr.svg);
  // their buttress roots spreading out over the glade toward us and toward her
  for (const [fx, fy, sgn] of [[690, 330, 1], [1450, 336, -1]]) for (let k = 0; k < 4; k++) { const ang = (k / 3 - 0.5) * 1.6, pts = [[fx + sgn * 30 * Math.cos(ang), fy - 30], [fx + 90 * Math.sin(ang) + sgn * 30, fy + 14 + k * 6], [fx + 200 * Math.sin(ang) + sgn * 20, fy + 40 + k * 14]]; raw(root(pts, 34 - k * 4, 8)); }
  // brackets and blooms on the trunks, eyes opened in the bark
  for (const g of [gl, gr]) { for (let i = 0; i < 6; i++) { const j = 2 + Math.floor(R() * 7), p = g.L[j], q = g.R[j], u = R(); raw(bracket(p[0] + (q[0] - p[0]) * u, p[1], 22 + R() * 20, 14, { col: R() < 0.5 ? YEL : mix(BONE, PINK, 0.35) })); }
    for (let i = 0; i < 1; i++) { const j = 1 + Math.floor(R() * 8), p = g.L[j], q = g.R[j]; raw(eye(p[0] + (q[0] - p[0]) * (0.3 + R() * 0.4), p[1], 7 + R() * 6, { white: '#e0d8c8', iris: '#7a6a8a', open: 0.35 })); }
    raw(mould(g.L[3][0] + 30, g.L[3][1], 30, 40, { col: MOULD, n: 60 })); }
  // blooms hung from the arch's branches like a lintel garland
  for (let i = 0; i < 9; i++) { const p = [840 + i * 56 + (R() - 0.5) * 30, 16 + R() * 18]; raw(rose(p[0], p[1], 7 + R() * 6, R() < 0.5 ? PINK : LILAC)); }
}
// ---- the left: a colossal trunk behind the heroes, the glade's ring receding left into the dark, buttress roots
{
  const c = colossus(P(-10.5, 0, 13)[0], P(-10.5, 0, 13)[1], 150, -40, 160, 90, { ph: 0.4, Z: 13, col: '#241e20' }); raw(c.svg);
  for (let i = 0; i < 5; i++) { const j = 2 + Math.floor(R() * 6); raw(bracket(c.R[j][0] - 20, c.R[j][1], 26 + R() * 14, 13, { col: R() < 0.5 ? YEL : mix(BONE, PINK, 0.35) })); }
  raw(eye((c.L[4][0] + c.R[4][0]) / 2, c.L[4][1], 14, { white: '#d8d0c0', iris: '#7a6a8a', open: 0.3 }));
  const c2 = colossus(P(-4, 0, 26)[0], P(-4, 0, 26)[1], 610, -40, 70, 44, { ph: 1.7, Z: 26, col: '#4a3a40' }); raw(c2.svg);
  // the vault of dark branches over the left half, hung with moss and blooms
  // the vault of branches: limbs of the colossus arching out over the heroes in smooth tapering curves, forking and thinning
  { const limbT = (a, b, sag, w0, d) => { const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag]); } const [dd] = G.tube(pts, w0, Math.max(1.5, w0 * 0.2)); raw(`<path d="${dd}" fill="${INK}" stroke="${INK}" stroke-width="1.6"/><path d="${dd}" fill="#1e181a"/>`); if (d > 0) for (const at of [0.45, 0.75]) { const j = Math.round(at * 10), p = pts[j]; limbT(p, [p[0] + (b[0] - a[0]) * 0.35 * (0.6 + R() * 0.5), p[1] + 30 + R() * 50], 10 + R() * 14, w0 * (1 - at * 0.6) * 0.55, d - 1); } };
    for (const [ay, bx, by, sag, w] of [[70, 560, -20, 40, 26], [130, 720, 20, 60, 20], [190, 460, 30, 50, 16]]) limbT([-20, ay], [bx, by], sag, w, 2); }
  for (let k = 0; k < 26; k++) { const x = R() * 700, y = 30 + R() * 70, l = 20 + R() * 70; raw(line([[x, y], [x + (R() - 0.5) * 8, y + l]], 1.4, '#3a3036', 0.8) + (R() < 0.3 ? rose(x, y + l, 5 + R() * 4, R() < 0.5 ? PINK : LILAC, { eye: false }) : '')); }
}
// ---- the roots running from where she stands out across the loam toward us, eyes in them, blooms along them
{
  const C = P(13.0, 0, 8.0);
  for (let k = 0; k < 11; k++) { const ang = Math.PI * (0.55 + k / 10 * 0.9), far = [C[0] + Math.cos(ang) * 40, C[1] - 6], end = P(13 + Math.cos(ang) * 16, 0, 8 + Math.sin(ang) * 4.2 - 2.4); if (end[1] < 300) continue; const mid = [(far[0] + end[0]) / 2 + (R() - 0.5) * 40, (far[1] + end[1]) / 2 + 6]; raw(root([far, mid, end], 14 + R() * 8, 5 + R() * 4)); if (R() < 0.5) raw(eye(mid[0], mid[1] - 2, 4 + R() * 3, { white: '#d8d0c0', iris: '#7a6a8a', open: 0.35 })); }
  for (let k = 0; k < 18; k++) { const c = P((R() - 0.4) * 30, 0, 7 + R() * 16), w = 20 + R() * 40; let pt = ''; for (let j = 0; j < 24; j++) { const x = c[0] + (R() - 0.5) * w, y = c[1] + (R() - 0.5) * 4, col = R() < 0.5 ? PINK : LILAC; pt += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1 + R() * 1.6)}" ry="${f1(0.5 + R() * 0.6)}" fill="${mix(col, '#5a4040', R() * 0.4)}" opacity="0.75"/>`; } raw(pt); }
}
// the sunset pouring through the gate onto the glade (stepped, from behind her toward us)
raw(G.shaftG([[1000, 60], [1290, 60], [1460, 440], [820, 440]], '#fbe8d0', 0.2));
raw(quiet([[236, 0.14], [270, 0.14], [306, 0.12], [350, 0.12]], { hop: 0.16, x1: 860 }));
raw(quiet([[306, 0.08], [350, 0.1]], { hop: 0.08, x0: 860 }));

// ======================================================================== MID
layer('mid');
{ // the hind's offering stone: a worn stone bowl on a knee-high pillar, old offerings rotted in it (a familiar size)
  const Z = 9.2, X = -1.6, k = K(Z); raw(B.box(X - 0.18, X + 0.18, 0, 0.55, Z - 0.18, Z + 0.18, { col: mix('#6a6064', MURK, 0.35), shadeOp: 0.5 })); const c = P(X, 0.62, Z); raw(cel([[c[0] - k * 0.38, c[1] - k * 0.07], [c[0] + k * 0.38, c[1] - k * 0.07], [c[0] + k * 0.25, c[1] + k * 0.1], [c[0] - k * 0.25, c[1] + k * 0.1]], { Z, fill: mix('#7a7074', MURK, 0.3), band: 2 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - k * 0.07)}" rx="${f1(k * 0.36)}" ry="${f1(k * 0.05)}" fill="#1a1414" stroke="${INK}" stroke-width="0.8"/>` + rose(c[0] - 4, c[1] - k * 0.1, k * 0.06, PINK) + mould(c[0], c[1] + k * 0.3, k * 0.12, k * 0.2, { col: mix(MOULD, MURK, 0.3), n: 14 })); }
{ // fallen petals and a shed antler tine grown with coral fungus, low behind the heroes; a dead hare under blooms
  const Z = 9.4, a = P(-3.6, 0.05, Z), k = K(Z); raw(line([a, [a[0] + k * 0.6, a[1] - k * 0.15], [a[0] + k * 1.0, a[1] - k * 0.05]], 4, INK) + line([a, [a[0] + k * 0.6, a[1] - k * 0.15], [a[0] + k * 1.0, a[1] - k * 0.05]], 2.2, mix(BONE, MURK, 0.4)) + caps(a[0] + k * 0.6, a[1] - k * 0.14, k * 0.14, Z, { col: mix(PINK, MURK, 0.3), n: 3 }));
  const h = P(1.8, 0.08, 10.2), kk = K(10.2); raw(cel(blob(h[0], h[1], kk * 0.18, kk * 0.07, 10, 0.2), { Z: 10.2, fill: mix('#8a7a6a', MURK, 0.4), band: 1.5 }) + rose(h[0] + 3, h[1] - 4, kk * 0.06, PINK) + rose(h[0] - 5, h[1] - 3, kk * 0.05, LILAC));
}

// ======================================================================== FORE
layer('fore');
{ // left: the near buttress root of the colossus, arching out of the frame edge, furred and shelved, an eye in it
  raw(root([[-30, 200], [40, 260], [70, 360], [60, H + 20]], 110, 70, '#1a1416'));
  raw(bracket(70, 300, 54, 4, { col: YEL }) + bracket(60, 360, 40, 4, { col: mix(BONE, PINK, 0.35) }) + mould(30, 420, 30, 30, { col: MOULD, n: 50 }) + eye(36, 300, 15, { white: '#d8d0c0', iris: '#7a6a8a', open: 0.35 }));
  // top: hanging moss and rose canes from the branch vault, thinning toward the stage
  for (let k = 0; k < 7; k++) { const x0 = 120 + k * 90 + R() * 40, l = 70 + R() * 90 - k * 8, pts = [[x0, -5], [x0 + (R() - 0.5) * 20, l * 0.5], [x0 + (R() - 0.5) * 30, l]]; raw(line(pts, 3, INK) + line(pts, 1.6, '#4a4a32') + rose(pts[2][0], pts[2][1], 10 + R() * 5, k % 2 ? PINK : LILAC, { eye: k === 3 })); }
  // bottom right: a low root crossing the corner (clear of the boss's stage)
  raw(root([[W - 260, H + 20], [W - 140, 452], [W + 20, 440]], 40, 30, '#1a1416'));
}
{ let m = ''; for (let k = 0; k < 40; k++) { const x = R() * W, y = R() * H, col = [PINK, LILAC, YEL][k % 3]; m += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.5 + R() * 2)}" ry="${f1(0.8 + R())}" transform="rotate(${f1(R() * 180)} ${f1(x)} ${f1(y)})" fill="${col}" stroke="${INK}" stroke-width="0.4" opacity="0.7"/>`; } raw(m); }

G.write(OUT, 'garden_boss');
