// World I, the Drowned Kingdom: THE THRONE HALL (boss room `throne`, The Drowned King), Living Ink, round 2 (group g1).
// Lore: "He kept his crown. The sea grew it into him." The king was crowned on the day the sea came in; he sits on, in the
// apse of his hall, his last loyal knight before him. The hall runs away from us down its length: massive round piers on
// the left receding to the apse; the apse at the end, right of centre, is the boss's stage: its curved wall, the cloth of
// estate rotted to rags, and over the throne a great round window whose light falls down the dais (the room's light focus,
// the most dramatic backlight in the world). Coral and barnacle crust everything; kelp hangs; silt drifts on the steps.
// Space: grand interior seen in one-point recession (unlike the nave's side-on arcade). Shapes: the apse curve, the window
// ring, round piers, the stepped dais. Palette: deep blue velvet, verdigris, drowned gold only on the window's holy boss.
// Courses: water (coral, barnacles, kelp, silt), void (a torn absence through a pier; one through a floor slab).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'I');
const W = 1480, H = 480, ROOM = 'throne';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2341, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141a2a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, ashlar } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, I = G.I;
const MURK = '#0b1018', STONE = '#4a5458', VEL = '#24305a', WIN = '#cfe4dc', GOLD = I.GOLD, CORAL = '#6e6c62';
const fog = G.fogger('#1a2430', 8, 40, 0.6);
const AX = 1.6, AZ = 24, AR = 8.6;   // polish: the apse's window sits left of the king, above the knight, where it stays visible          // the apse: centre X, back Z, radius
const apseAt = (s, t) => { const th = Math.PI - s / AR; return [AX + AR * Math.cos(th), t, AZ - 6 + AR * Math.sin(th) * 0.9]; };   // s 0..PI*AR, left to right
// coral: lumpy branching growths (many short stubby branches, never a Y-fork), fan coral, brain lumps
function coral(x, y, s, col = CORAL) {
  let o = ''; const n = 3 + Math.floor(R() * 4);
  for (let i = 0; i < n; i++) { let px = x + (R() - 0.5) * s * 0.6, py = y; const pts = [[px, py]]; let a = -Math.PI / 2 + (R() - 0.5) * 1.2; for (let k = 0; k < 4; k++) { a += (R() - 0.5) * 0.8; px += Math.cos(a) * s * 0.25; py += Math.sin(a) * s * 0.25; pts.push([px, py]); }
    o += line(pts, Math.max(1.6, s * 0.16), INK, 1) + line(pts, Math.max(0.9, s * 0.1), col, 1) + `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(Math.max(0.8, s * 0.08))}" fill="${mix(col, '#fff3d8', 0.25)}" stroke="${INK}" stroke-width="0.5"/>`; }
  return o;
}

layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the apse (distance, Z 18-24): its curved wall, tall shafts, the great round window over the throne
{
  raw(ashlar(apseAt, Math.PI * AR, 16, fog(STONE, 22), { scale: 1.1, rough: true, roughP: 0.3, vary: 0.22, mortar: 0.6, weather: { algae: 0.3, salt: 0.3, saltCol: '#a8b0a8' }, barnBands: [[0.0, 1.0, 140]], barnCol: '#8a8a80' }));
  for (let i = 0; i < 24; i++) { const s0 = Math.PI * AR * i / 24, f = Math.cos(Math.PI - s0 / AR); if (f < -0.2) raw(hatch3(apseAt, s0, s0 + Math.PI * AR / 24 + 0.05, 0, 16, 0.75, { op: 0.45, ragged: 0.1 })); }
  // the great round window: a ring of voussoirs, plate tracery of uneven lights (some lost), sea light pouring through
  const wc = apseAt(Math.PI * AR * 0.5, 7.6), wr = 2.55,   // last touch-up: lowered and reduced so the whole rose reads under the vault
   Wc = P(...wc), k = K(wc[2]);
  raw(`<circle cx="${f1(Wc[0])}" cy="${f1(Wc[1])}" r="${f1(wr * k)}" fill="${WIN}"/>`);
  raw(G.bands([[Wc[1] - wr * k, '#e4f0ea'], [Wc[1] - wr * k * 0.3, '#cfe2da'], [Wc[1] + wr * k * 0.3, '#b4ccc4']], { amp: 4 }).replace(/<path /g, `<path clip-path="url(#thw)" `));
  S.DEFS.push(`<clipPath id="thw"><circle cx="${f1(Wc[0])}" cy="${f1(Wc[1])}" r="${f1(wr * k)}"/></clipPath>`);
  // tracery: a hub, eight spokes of uneven thickness, foiled lights between, three lights broken out, kelp through one
  for (let j = 0; j < 9; j++) { const a = j / 9 * 6.283 + 0.2, l = wr * k; raw(line([[Wc[0] + Math.cos(a) * l * 0.28, Wc[1] + Math.sin(a) * l * 0.28], [Wc[0] + Math.cos(a) * l, Wc[1] + Math.sin(a) * l]], j % 3 === 0 ? 7 : 5, INK, 1) + line([[Wc[0] + Math.cos(a) * l * 0.28, Wc[1] + Math.sin(a) * l * 0.28], [Wc[0] + Math.cos(a) * l, Wc[1] + Math.sin(a) * l]], j % 3 === 0 ? 4 : 2.6, '#4e5a5c', 1)); }
  for (let j = 0; j < 9; j++) { if (j === 2 || j === 6) continue; const a = (j + 0.5) / 9 * 6.283 + 0.2, c = [Wc[0] + Math.cos(a) * wr * k * 0.68, Wc[1] + Math.sin(a) * wr * k * 0.68]; raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(wr * k * 0.17)}" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(wr * k * 0.17)}" fill="none" stroke="#4e5a5c" stroke-width="1"/>`); }
  raw(`<circle cx="${f1(Wc[0])}" cy="${f1(Wc[1])}" r="${f1(wr * k * 0.28)}" fill="${GOLD}" stroke="${INK}" stroke-width="3"/><path d="M${f1(Wc[0])} ${f1(Wc[1] - wr * k * 0.2)} L${f1(Wc[0])} ${f1(Wc[1] + wr * k * 0.2)} M${f1(Wc[0] - wr * k * 0.14)} ${f1(Wc[1] - wr * k * 0.04)} L${f1(Wc[0] + wr * k * 0.14)} ${f1(Wc[1] - wr * k * 0.04)}" stroke="${INK}" stroke-width="3"/><circle cx="${f1(Wc[0] - wr * k * 0.08)}" cy="${f1(Wc[1] - wr * k * 0.1)}" r="${f1(wr * k * 0.06)}" fill="#c8b880" opacity="0.5"/>`);
  { const circ = []; for (let j = 0; j <= 40; j++) { const a = Math.PI - j / 40 * Math.PI * 2; circ.push([wc[0] + wr * Math.cos(a), wc[1] + wr * Math.sin(a)]); } raw(G.ring([circ[0], ...circ, circ[40]], wc[2] - 0.05, 0.75, fog('#5a6466', 22), { v: 0.75 })); }
  raw(I.kelp(wc[0] - 1.2, wc[1] + 1.5, wc[2] - 0.1, 2.6, { w: 0.1 }) + I.kelp(wc[0] + 2.1, wc[1] - 0.5, wc[2] - 0.1, 1.8, { w: 0.08 }));
  // tall engaged shafts round the apse, each its own: coral-crusted, one broken off, one leaning
  for (const [u, kind] of [[0.12, 'coral'], [0.3, 'broken'], [0.7, 'coral'], [0.88, 'lean']]) { const s0 = Math.PI * AR * u, a = apseAt(s0, 0), b = apseAt(s0, kind === 'broken' ? 6.5 : 16), A = P(...a), B = P(b[0] + (kind === 'lean' ? 0.4 : 0), b[1], b[2]), w = K(a[2]) * 0.5;
    raw(cel([[A[0] - w / 2, A[1]], [A[0] + w / 2, A[1]], [B[0] + w / 2, B[1]], [B[0] - w / 2, B[1]]], { Z: a[2], fill: fog('#56605f', a[2]), tex: 'url(#mottle)', texOp: 0.4, band: w * 0.4 }));
    for (let k2 = 0; k2 < 4; k2++) raw(coral(A[0] + (R() - 0.5) * w, A[1] - (B[1] < 0 ? 200 : (A[1] - B[1])) * R() * 0.6, K(a[2]) * 0.7, fog(CORAL, a[2]))); }
  // the cloth of estate behind the throne: deep blue velvet hanging in rotted strips from a rail, kelp through it
  { const y0 = 4.7, y1 = 1.2; const xs = [-3.2, -2.4, -1.5, -0.7, 0.3, 1.1, 2.0, 2.8, 3.4];
    for (let i = 0; i < xs.length - 1; i++) { const a = P(AX + xs[i], y0, AZ - 6.4), b = P(AX + xs[i + 1] - 0.08, y0, AZ - 6.4), lb = y1 + R() * 1.8, c = P(AX + xs[i + 1] - 0.15, lb + R() * 0.4, AZ - 6.4), d = P(AX + xs[i] + 0.1, lb, AZ - 6.4);
      raw(cel([a, b, [c[0], c[1]], [(c[0] + d[0]) / 2 + (R() - 0.5) * 6, Math.max(c[1], d[1]) + 8], [d[0], d[1]]], { Z: 18, fill: fog(tone(VEL, 0.15), 18), tex: 'url(#mottle)', texOp: 0.5, band: 3 }) + hatch3((s2, t) => [AX + xs[i] + s2, lb + t, AZ - 6.4], 0, xs[i + 1] - xs[i], 0, y0 - lb, 1.4, { op: 0.35 })); }
    raw(line([P(AX - 3.5, y0, AZ - 6.4), P(AX + 3.7, y0, AZ - 6.4)], 4, INK, 1) + line([P(AX - 3.5, y0, AZ - 6.4), P(AX + 3.7, y0, AZ - 6.4)], 2, '#3a3a38', 1)); }
  // the dais: three broad steps rising to the apse, silt drifted on the treads, coral lumps on the risers
  for (let k2 = 0; k2 < 3; k2++) { const z0 = 11 + k2 * 1.6, y = 0.22 * (k2 + 1), x0 = -1.5 + k2 * 0.6, x1 = 16 - k2 * 0.6;
    raw(cel([P(x0, y - 0.22, z0), P(x1, y - 0.22, z0), P(x1, y, z0), P(x0, y, z0)], { Z: z0, fill: fog('#4e585a', z0), tex: 'url(#mottle)', texOp: 0.4 }) + cel([P(x0, y, z0), P(x1, y, z0), P(x1, y, z0 + 1.6), P(x0, y, z0 + 1.6)], { Z: z0, fill: fog('#5a6462', z0), tex: 'url(#mottle)', texOp: 0.3, hi: false }));
    raw(I.barnacles(...P(x0 + 2 + k2, y - 0.1, z0), 14, 7, z0) + coral(...P(x0 + 4 + k2 * 2, y - 0.2, z0), K(z0) * 0.5, fog(CORAL, z0))); }
  raw(`<rect width="${W}" height="${H}" fill="${MURK}" opacity="0.3"/>`);
  // the window's light falling down the dais toward us: broad shafts from the window, stepped pale on the steps
  raw(G.shaft(Wc[0] - wr * k * 0.9, Wc[1], wr * k * 1.8, 330, -0.18, WIN, { op: 0.34, fill: 0.12, spread: 90, gap: 4 }));
  for (const [z, w, op] of [[16, 5, 0.12], [14, 5.5, 0.1], [12.5, 6, 0.09]]) { const q = [P(AX - w / 2, 0.68, z), P(AX + w / 2, 0.68, z), P(AX + w / 2 + 0.5, 0.68, z + 1.2), P(AX - w / 2 - 0.5, 0.68, z + 1.2)]; raw(S.GLOW(`<path d="${p2(q)}" fill="${WIN}" opacity="${op}"/>`)); }
}
// ---- the hall's left side: massive round piers receding to the apse (middle and near), the aisle dark behind, banners
{
  // the aisle wall far left, dark, with the hall's own lancets dim
  const atA = (s, t) => [-9, t, 4 + s]; raw(ashlar(atA, 22, 12, '#2e3638', { scale: 1.2, rough: true, vary: 0.2 }) + hatch3(atA, 0, 22, 0, 12, 0.7, { op: 0.5 }) + hatch3(atA, 0, 22, 0, 12, -0.8, { op: 0.45 }));
  for (const z of [10, 15, 20]) raw(`<path d="${p2(G.arch(z, z + 1.2, 5.5, 'point', { n: 5 }).map(([zz, y]) => P(-9, y ? y : 3.2, zz)))}" fill="${fog('#5a7068', z)}" stroke="${INK}" stroke-width="1"/>`);
  // the hall's right wall beyond the apse, dark
  { const at = (s2, t) => [15.5, t, 4 + s2]; raw(ashlar(at, 16, 14, '#2a3234', { scale: 1.2, rough: true, vary: 0.2 }) + hatch3(at, 0, 16, 0, 14, 0.7, { op: 0.45 })); }
  // the end wall of the hall left of the apse: ashlar, a tall pointed door into the dark, two niches with drowned saints
  { const at = (s2, t) => [-9 + s2, t, 18.2], hole = G.arch(-7.0, -5.0, 3.4, 'point', { n: 6 });
    raw(G.holedWall(18.2, -9, -6.6, 0, 14, [], fog(STONE, 18), { ash: { scale: 1.1 }, shadeH: 0.5, shadeOp: 0.45, extra: hatch3(at, 0, 6.8, 0, 14, 0.75, { op: 0.4 }) }));
    
    for (const X of []) { const q = G.arch(X, X + 1.3, 3.6, 'round', { n: 6 }).map(([x, y]) => P(x, y ? y : 1.4, 18.15)); raw(`<path d="${p2(q)}" fill="#0a0e12" stroke="${INK}" stroke-width="1"/>`); const c = P(X + 0.65, 1.4, 18.1), k2 = K(18); raw(cel([[c[0] - k2 * 0.3, c[1]], [c[0] + k2 * 0.3, c[1]], [c[0] + k2 * 0.22, c[1] - k2 * 1.4], [c[0] + k2 * 0.1, c[1] - k2 * 1.75], [c[0] - k2 * 0.12, c[1] - k2 * 1.72], [c[0] - k2 * 0.24, c[1] - k2 * 1.35]], { Z: 18, fill: fog('#56605e', 18), band: 1 }) + coral(c[0], c[1] - k2 * 0.6, k2 * 0.5, fog(CORAL, 18))); } }
  // the vault overhead: a dark stone ceiling between transverse ribs, converging to the apse
  { const atC = (s2, t) => [-9 + s2, 9.6 - Math.abs(s2 - 14) * 0.08, 4 + t]; raw(ashlar(atC, 28.5, 14.2, '#2a3234', { scale: 1.3, rough: true, vary: 0.2 }) + hatch3(atC, 0, 28.5, 0, 14.2, 0.6, { op: 0.5 }) + hatch3(atC, 0, 28.5, 0, 14.2, -0.7, { op: 0.45 })); }
  // the vault overhead going away: transverse ribs as dark arcs spanning the hall, converging
  for (const z of [9, 12.5, 16]) { const pts = []; for (let k2 = 0; k2 <= 14; k2++) { const u = k2 / 14, X = -1.4 + u * 16.8; pts.push(P(X, 8 + Math.sin(u * Math.PI) * 4.5, z)); } raw(line(pts, K(z) * 0.5, INK, 1) + line(pts, K(z) * 0.34, fog('#3a4446', z), 1)); }
  // banners of the realm, deep blue velvet rotted to rags, hanging between the piers
  for (const [z, len] of [[11, 3.2], [14.6, 2.4], [18, 3.8]]) { const a = P(-7.4, 7.5, z), b = P(-6.3, 7.5, z), lw = P(-6.8, 7.5 - len, z); raw(cel([a, b, [b[0] - 2, lw[1] - 10], [lw[0], lw[1]], [a[0] + 3, lw[1] - 14]], { Z: z, fill: fog(VEL, z), tex: 'url(#mottle)', texOp: 0.5, band: 2 }) + hatch3((s2, t) => [-7.4 + s2, 7.5 - len + t, z], 0, 1.1, 0, len, 1.3, { op: 0.3 })); }
  // the piers: round drums, coral-crusted, each a different damage
  for (const [z, kind] of [[19, ''], [15.5, 'void'], [12, 'coral'], [8.5, 'kelp']]) { const X = -4.6, r = 0.7, A = P(X - r, 0, z), B = P(X + r, 0, z), T = P(X, 12, z), w = B[0] - A[0];
    raw(cel([[A[0], T[1]], [B[0], T[1]], [B[0], A[1]], [A[0], A[1]]], { Z: z, fill: fog('#3c4446', z), tex: 'url(#mottle)', texOp: 0.4, band: w * 0.45 }));
    for (let y = 0.5; y < 12; y += 0.55 + R() * 0.2) { const yy = P(X, y, z)[1]; raw(`<path d="M${f1(A[0])} ${f1(yy)} Q${f1((A[0] + B[0]) / 2)} ${f1(yy + w * 0.12)} ${f1(B[0])} ${f1(yy)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.6"/>`); }
    raw(hatch3((s2, t) => [X + s2 * 0.5, t, z], 0, r * 2, 0, 12, 0.8, { op: 0.4 }));
    raw(I.barnacles((A[0] + B[0]) / 2, P(0, 0.4, z)[1], w * 0.6, 14, z) + coral((A[0] + B[0]) / 2, P(0, 0.2, z)[1], K(z) * 0.6, fog(CORAL, z)));
    if (kind === 'coral') for (let k2 = 0; k2 < 3; k2++) raw(I.barnacles(A[0] + R() * w, P(0, 1 + R() * 4, z)[1], w * 0.2, 8, z, '#7a786c'));
    if (kind === 'kelp') for (let k2 = 0; k2 < 5; k2++) raw(I.kelp(X - r + R() * r * 2, 6 + R() * 3, z - 0.75, 2 + R() * 3, { w: 0.08 }));
    if (kind === 'void') raw(BK.tornVoid((s2, t) => [X - r + s2, t, z - r], 0.75, 3.2, 0.45, 0.8, { rot: 0.1, lobes: [[3.3, 0.3, 0.5]], fray: [[4.6, 4, 0.2], [1.4, 3, 0.2]], depth: 1.2, cut: '#1e2428', fissures: 2, violet: true }).svg); }
}
raw(I.motes(140, 0, 380, '#b8ccc4') + I.bubbles(24, 0, W, 10, 280, 1.4));
raw(BK.quiet(MURK, 300, 400, { steps: [0.08, 0.1, 0.12, 0.14], hop: 0.12 }));
raw(G.edges(MURK, { l: 280, r: 90, t: 70, steps: [0.16, 0.18, 0.2, 0.22] }));
// ---- the hall floor: great slabs in recession, joints converging to the apse; silt runs; a torn absence through one slab
{
  raw(G.flags(-14, 26, 3.2, 11, '#4a5254', { size: 1.4, long: 0.8, cracks: 16, vary: 0.18 }));
  raw(BK.tornVoid((s2, t) => [-1.5 + s2, 0.004, 7.6 + t], 0, 0, 0.8, 0.5, { rot: 0.2, lobes: [[0.3, 0.3, 0.5]], fray: [[3.6, 3, 0.15]], depth: 0.5, dir: [0, -1, 0], cut: '#2a3234', fissures: 2, violet: true }).svg);
  for (let i = 0; i < 12; i++) { const X = -10 + R() * 30, Z = 4.5 + R() * 6; raw(line([P(X, 0.003, Z), P(X + (X - 9) * 0.1, 0.003, Z + 2 + R() * 2)], 2.4, '#727468', 0.2)); }
  raw(S.occBand((s, t) => [-14 + s, 0, 3.2 + t], 40, 1.0, { op: 0.4 }));
}

// ======================================================================== MID: low, dark things before the dais
layer('mid');
{
  // a fallen candle-stand of the royal chapel, verdigris bronze, across the floor; a dropped gauntlet; silt
  const a = P(-6.5, 0.12, 9.2), b = P(-3.0, 0.12, 9.8); raw(line([a, b], K(9.4) * 0.09, INK, 1) + line([a, b], K(9.4) * 0.06, '#2c4a40', 1));
  for (const u of [0, 0.5, 1]) { const c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(K(9.4) * 0.12)}" ry="${f1(K(9.4) * 0.05)}" fill="#24403a" stroke="${INK}" stroke-width="0.8"/>`); }
  raw(coral(...P(-1, 0, 9.5), K(9.5) * 0.5, '#4a4840') + I.barnacles(...P(4.5, 0.1, 9.6), 12, 8, 9.6, '#6a6a60'));
}

raw(G.barrel(-0.2, 9.6, { col: '#2e3634', hoop: '#26302c', extra: I.barnacles(...P(-0.2, 0.5, 9.6), 8, 6, 9.6) }));   // scale cue: a wine cask of the royal table
// ======================================================================== FORE: a near pier at the left, a broken royal corona hanging at the top
layer('fore');
{
  const Zp = 4.4, X = -5.6, r = 0.8, A = P(X - r, 0, Zp), B = P(X + r, 0, Zp), T = P(X, 6, Zp), w = B[0] - A[0];
  raw(cel([[A[0], T[1]], [B[0], T[1]], [B[0], A[1]], [A[0], A[1]]], { Z: Zp, fill: '#1e262a', tex: 'url(#mottle)', texOp: 0.5, band: w * 0.5 }) + hatch3((s2, t) => [X - r + s2, t, Zp], 0, r * 2, 0, 6, 0.8, { op: 0.45 }));
  for (let y = 0.4; y < 6; y += 0.55) { const yy = P(X, y, Zp)[1]; raw(`<path d="M${f1(A[0])} ${f1(yy)} Q${f1((A[0] + B[0]) / 2)} ${f1(yy + w * 0.1)} ${f1(B[0])} ${f1(yy)}" stroke="${INK}" stroke-width="1.2" fill="none" opacity="0.6"/>`); }
  for (let k2 = 0; k2 < 7; k2++) raw(coral(A[0] + R() * w, P(0, 0.3 + R() * 3.5, Zp)[1], K(Zp) * 0.45, '#4a4a44'));
  raw(I.barnacles((A[0] + B[0]) / 2, P(0, 0.3, Zp)[1], w * 0.5, 22, Zp, '#5a5a54'));
  for (const [cx, sd] of [[60, -1], [W - 50, 1]]) { const pts = []; for (let k2 = 0; k2 <= 8; k2++) { const t = k2 / 8; pts.push([cx + sd * (t - 0.5) * 180, H - 10 - Math.sin(t * Math.PI) * (20 + R() * 8)]); } raw(G.rockMass([[cx - 100, H + 4], ...pts, [cx + 100, H + 4]], 3.5, '#121820', { fiss: 3, hop: 0.6 })); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, x_to: 1480 } }, null, 1));
console.log(ROOM, 'layers written');
