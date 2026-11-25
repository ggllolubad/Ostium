// World XV, the Torn Sky: THE CHOIR OF HEAVEN (battle room `sky_choir`; finale-tier rebuild, 2026-11-24, kit
// battle_kit_xv.js). The choir where heaven sang, a hall forty-six metres high. Its walls rise in four tiers, bay after
// bay: the stalls of the host with their pinnacled canopies; a gallery behind a gilt parapet, its arcade peopled with
// carved angels singing; a triforium of small lancets; and the clerestory, whose tall windows still burn gold with the
// light outside. No two bays are alike: one is cut through every tier by the void, one burned black by the strike,
// one has lost its parapet, statues have fallen or stand headless. At the far end the great organ, its pipes fused by
// the strike into one another. In the middle of the floor the eagle lectern holds the last hymnal open in a shaft of
// gold from the high lantern. Over the seraph's post on the right the wall is torn open onto the storm, and something
// looks in. Encounters: The Broken Choir (the eyes are singing), The Seraph's Watch (it is holding the sky together).
// Light: warm gold, from the high lantern and the clerestory (upper left); the left wall in its own shade, the right
// wall lit. Dark key. Gold leaf only on the holy (all of heaven is). Lightning only as violet burns on surfaces.
// Usage: node scenes/bg_sky_choir.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XV');
const { S, B, G, X } = require('./battle_kit_xv').make(15411, '#120c0e', '#24181a', '#3a2a24');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, mix, R, smooth, inkW, hatchA, hatchB } = S;
const { line, pline, fillP, fillS, inkP, blob, jag, fused, quiet } = B;
const { W, H, GOLD, GOLDL, GOLDD, BLACK } = G;
const { fade, burnV, grad, rgrad, blurF, glowE, sky, softCloud, shaftG, weather, stone, giltW, tearS, celSil, chainC } = X;
const STONE = '#6a5446', LIT = '#ffd890', XW = 10.5, ZEND = 88, BAY = 6.2;
const pl = (side, z, y) => P(side * XW, y, z);
const Q2 = (side, za, zb, ya, yb, d) => [P(side * (XW - d), ya, za), P(side * (XW - d), ya, zb), P(side * (XW - d), yb, zb), P(side * (XW - d), yb, za)];           // a point on a wall plane
const pli = (side, z, y, d) => P(side * (XW - d), y, z); // d metres in front of the wall (toward the centre)

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="#120c0e"/>`);
raw(`<rect width="${W}" height="${H}" fill="${rgrad(740, 230, 520, 360, [[0, '#6a4a2a', 1], [0.4, '#3a2618', 1], [1, '#140c0c', 1]])}"/>`);

// ---- the far end: the back wall and the great organ, fused by the strike, glowing in the gold of the far clerestory
{
  const bw = [P(-XW, 0, ZEND), P(XW, 0, ZEND), P(XW, 60, ZEND), P(-XW, 60, ZEND)];
  raw(fillP(bw, '#4a3424') + `<path d="${p2(bw)}" fill="url(#mottle)" opacity="0.4"/>`);
  // a great rose above the organ, burning gold (only its lower half shows under the frame top)
  { const c = P(0, 40, ZEND), r = K(ZEND) * 8; raw(glowE(c[0], c[1], r * 3.2, r * 2.8, '#ffe0a0', 0.75) + `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="#fff4d0" stroke="${INK}" stroke-width="1.6"/>`);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; raw(pline([[c[0], c[1]], [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]], 1.4, '#3a2418')); }
    raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.35)}" fill="none" stroke="#3a2418" stroke-width="1.4"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.7)}" fill="none" stroke="#3a2418" stroke-width="1"/>`); }
  // the organ: three flats of pipes in graded heights, gilt over black, the case's pinnacles; pipes fused and run
  const flats = [[-8.6, -4.4, 26], [-4.0, 4.0, 34], [4.4, 8.6, 27]];
  const caseQ = [P(-9.4, 0, ZEND - 1.5), P(9.4, 0, ZEND - 1.5), P(9.4, 8, ZEND - 1.5), P(-9.4, 8, ZEND - 1.5)];
  raw(stone(caseQ, ZEND, '#3a2618', { band: 2, w: { op: 0.7 } }) + pline([P(-9.4, 8, ZEND - 1.5), P(9.4, 8, ZEND - 1.5)], 2, GOLD, 0.9));
  for (const [x0, x1, top] of flats) { const n = Math.round((x1 - x0) / 0.55), mid = (x0 + x1) / 2;
    for (let i = 0; i < n; i++) { const x = x0 + (i + 0.5) * (x1 - x0) / n, hh = top - Math.abs(x - mid) / ((x1 - x0) / 2) * (top - 14) * (x1 - x0 > 6 ? 0.55 : 1) * (x0 < 0 && x1 < 0 ? (x - x0) / (x1 - x0) : x0 > 0 ? (x1 - x) / (x1 - x0) : 1), r = 0.22;
      const a = P(x - r, 8, ZEND - 1.6), b = P(x + r, 8 + hh, ZEND - 1.6), q = [[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]];
      raw(giltW(q, ZEND, { dim: 0.15 + (i % 3) * 0.05, cracks: 1, lost: 0, wear: 0.5, sheen: 0.8 }));
      const m = P(x, 9.6 + (i % 2) * 0.5, ZEND - 1.6); raw(fillP([[a[0], m[1]], [b[0], m[1]], [(a[0] + b[0]) / 2, m[1] - 3]], BLACK)); }
    // the pinnacled tower of the case over each flat
    const t0 = P(x0 - 0.2, 8 + top + 0.4, ZEND - 1.7), t1 = P(x1 + 0.2, 8 + top + 1.6, ZEND - 1.7); raw(giltW([[t0[0], t1[1]], [t1[0], t1[1]], [t1[0], t0[1]], [t0[0], t0[1]]], ZEND, { dim: 0.25, cracks: 2, lost: 1 })); }
  // the fused pipes: a run of melted gold down the centre flat, drips frozen; a violet burn branching across the pipes
  { const c = P(0.8, 20, ZEND - 1.7); raw(fused(c[0], c[1], 10, mix(GOLD, '#3a2418', 0.2), ZEND) + fused(c[0] + 10, c[1] + 24, 7, mix(GOLD, '#3a2418', 0.3), ZEND) + burnV(c[0], c[1], 1.9, 80, 2, { depth: 4 }) + burnV(c[0], c[1], 0.6, 60, 1.6, { depth: 3 })); }
  // the console below with its bench (scale)
  { const a = P(-1.6, 0, ZEND - 4), b = P(1.6, 1.4, ZEND - 4); raw(stone([[a[0], b[1]], [b[0], b[1]], [b[0], a[1]], [a[0], a[1]]], ZEND, '#2a1a12', { band: 1.5, w: { op: 0.5 } })); }
}

// ---- THE WALLS: bay by bay, four tiers; each bay its own state
function wall(side) {
  const lit = side > 0, base = lit ? '#7a5e48' : '#3a2a22', sh = lit ? 0.05 : 0.45;
  let s = '';
  // the wall plane itself, far to near
  const wq = [pl(side, 8, 0), pl(side, ZEND, 0), pl(side, ZEND, 60), pl(side, 8, 60)];
  s += fillP(wq, base) + `<path d="${p2(wq)}" fill="url(#mottle)" opacity="0.5"/>`;
  s += S.ashlar((u, v) => [side * XW, v, 8 + u], 22, 13, base, { scale: 1.9, vary: 0.2, lost: 0.15, spall: 0.2 });
  const bays = []; for (let z = ZEND - BAY; z > 6; z -= BAY) bays.push(z);
  bays.forEach((z0, bi) => {
    const z1 = z0 + BAY, zm = z0 + BAY / 2, state = ['', 'burned', '', 'void', 'fallen', '', 'noparapet', '', 'headless', 'burned', '', ''][(bi + (side > 0 ? 5 : 0)) % 12];
    const Q = (za, zb, ya, yb, d = 0) => [pli(side, za, ya, d), pli(side, zb, ya, d), pli(side, zb, yb, d), pli(side, za, yb, d)];
    // the clerestory window: a tall lancet burning gold, its tracery
    { const ol = G.pointed(-1.5, 1.5, 12, 10, 0.9).map(([u, v]) => pl(side, zm + u, 29 + v)); s += fillP(ol, '#2a1a12'); const inner = G.pointed(-1.25, 1.25, 11.6, 10, 0.9).map(([u, v]) => pl(side, zm + u, 29.4 + v));
      s += `<path d="${p2(inner)}" fill="${grad([[0, '#fff0c0'], [0.6, '#ffc870'], [1, '#c07a3a']], 0, inner[6][1], 0, inner[0][1])}"/>` + pline([pl(side, zm, 29.4), pl(side, zm, 39)], 1, '#3a2418', 0.9);
      for (let j = 1; j < 5; j++) s += pline([pl(side, zm - 1.25, 29.4 + j * 2.4), pl(side, zm + 1.25, 29.4 + j * 2.4)], 0.6, '#3a2418', 0.7); }
    // the triforium: four small lancets, dark
    for (let i = 0; i < 4; i++) { const zc = z0 + BAY * (i + 0.5) / 4, ol = G.pointed(-0.45, 0.45, 5.6, 5, 0.9).map(([u, v]) => pl(side, zc + u, 19.5 + v)); s += fillP(ol, '#120a08') + inkP(ol, 0.6); }
    // gilt string courses
    for (const [ya, yb] of [[17.2, 18.2], [27.6, 28.4]]) s += giltW(Q(z0, z1, ya, yb, 0.3), zm, { dim: lit ? 0.1 : 0.55, cracks: 2, lost: 1, wear: 0.8, sheen: lit ? 1 : 0.3 });
    // the gallery arcade: two arches per bay, black depth behind, a carved angel singing in each (or not)
    for (let i = 0; i < 2; i++) { const zc = z0 + BAY * (i * 0.5 + 0.25), ol = G.pointed(-1.2, 1.2, 6.2, 8, 0.85).map(([u, v]) => pl(side, zc + u, 8.6 + v));
      s += fillP(ol, '#0c0606') + `<path d="${p2(ol)}" fill="${grad([[0, '#2a1810', 0.0], [1, '#3a2418', 0.8]], 0, ol[8][1], 0, ol[0][1])}"/>` + inkP(ol, 0.8);
      s += line(ol.slice(1, -1), Math.max(1, K(zc) * 0.25), mix(base, '#fff0c8', lit ? 0.3 : 0.05)) + line(ol.slice(1, -1), Math.max(0.6, K(zc) * 0.08), mix(GOLD, base, lit ? 0.1 : 0.5), 0.9);
      if (state === 'void' || (state === 'fallen' && i === 0)) continue;
      if (zc < 60) s += singer(pl(side, zc, 8.6), K(zc), side, state === 'headless' && i === 1, lit, bi * 2 + i); }
    // the gallery parapet: a gilt balustrade projecting in front of the arcade, on a corbelled stone shelf
    if (state !== 'noparapet') { s += stone(Q(z0, z1, 7.0, 7.6, 1.2), zm, mix(base, '#000', 0.15), { band: 2, chip: false, w: { op: 0.6 } });
      s += giltW(Q(z0, z1, 7.6, 8.7, 1.2), zm, { dim: lit ? 0.05 : 0.5, cracks: 3, lost: 2, wear: 1, sheen: lit ? 1.2 : 0.3 });
      for (let i = 1; i < 6; i++) { const zz = z0 + BAY * i / 6, a = pli(side, zz, 7.7, 1.2), b = pli(side, zz, 8.6, 1.2); s += pline([a, b], Math.max(0.6, K(zz) * 0.06), BLACK, 0.7); } }
    else { const a = pli(side, z0, 7.4, 1.2), b = pli(side, z1, 7.4, 1.2); s += pline(jag(a, b, 7, K(zm) * 0.2), 1.2, INK) ; }
    // the stalls: a desk in front, seat backs with blind tracery, projecting canopies with ogee hood faces, crockets and
    // tapered pinnacles (heights vary, one broken); above them a gilt diaper over the wall up to the gallery
    { const near = zm < 40;
      // the gilt diaper (lozenges) on the wall between the canopies and the gallery shelf
      if (near) { let d = ''; for (let k = -12; k < 24; k++) { const za = z0 + k * 0.55; const A = pl(side, za, 4.6), B2 = pl(side, za + 2.2, 7.0), C = pl(side, za + 2.2, 4.6), D = pl(side, za, 7.0); d += `M${f1(A[0])} ${f1(A[1])} L${f1(B2[0])} ${f1(B2[1])} M${f1(C[0])} ${f1(C[1])} L${f1(D[0])} ${f1(D[1])} `; }
        const cq = Q(z0, z1, 4.6, 7.0), cl = S.id('dp'); s += `<clipPath id="${cl}"><path d="${p2(cq)}"/></clipPath><g clip-path="url(#${cl})"><path d="${p2(cq)}" fill="${mix(base, '#000', 0.2)}"/><path d="${d}" stroke="${mix(GOLD, base, lit ? 0.25 : 0.6)}" stroke-width="${f1(Math.max(0.6, K(zm) * 0.04))}" fill="none" opacity="0.85"/>${weather(cq, { col: base, op: 0.8, stainGap: 5, lichen: false })}</g>`;
        if (bi % 3 === 1) { const c = pl(side, zm, 5.8); s += singer([c[0], c[1] + K(zm) * 1.0], K(zm) * 0.5, side, false, lit, bi + 7); } }
      s += stone(Q(z0, z1, 0, 3.0, 0.9), zm, mix(base, '#000', 0.2), { band: 1.5, chip: false, w: { op: 0.7 } });
      for (let i = 0; i < 3; i++) { const zc = z0 + BAY * (i + 0.5) / 3, ol = G.pointed(-0.8, 0.8, 1.8, 6, 0.9).map(([u, v]) => pli(side, zc + u, 0.9 + v, 0.9));
        s += fillP(ol, '#1a0e0a') + pline(ol, Math.max(0.7, K(zc) * 0.03), mix(GOLD, base, 0.3), 0.85);
        if (near) { s += pline([pli(side, zc, 0.9, 0.9), pli(side, zc, 2.3, 0.9)], Math.max(0.6, K(zc) * 0.03), mix(base, '#000', 0.3), 0.9); const qc = pli(side, zc, 2.25, 0.9); s += `<circle cx="${f1(qc[0])}" cy="${f1(qc[1])}" r="${f1(K(zc) * 0.18)}" fill="none" stroke="${mix(GOLD, base, 0.35)}" stroke-width="${f1(Math.max(0.5, K(zc) * 0.025))}"/>`; }
        // the canopy: its soffit (dark), its ogee front face in stone with a gilt fillet and crockets
        if (!near && ((bi * 7 + i * 3 + (side > 0 ? 2 : 0)) % 5 === 0)) continue; const hk = i === 1 ? 1.45 + ((bi + side) % 3) * 0.25 : (bi % 2 ? 0.75 : 1.0) + ((bi * 3 + i) % 4) * 0.12, hood = [], soff = []; for (let k = 0; k <= 12; k++) { const u = k / 12 * 2 - 1, yy = 3.1 + Math.pow(1 - Math.abs(u), 1.4) * 1.5 * hk + Math.sin(Math.abs(u) * Math.PI) * 0.3; hood.push(pli(side, zc + u * 0.98, yy, 1.4)); soff.push(pli(side, zc + u * 0.98, 3.1, 1.4)); }
        const face = [...hood, pli(side, zc + 0.98, 3.0, 1.4), pli(side, zc - 0.98, 3.0, 1.4)];
        s += fillP([pli(side, zc - 0.98, 3.0, 0.9), pli(side, zc + 0.98, 3.0, 0.9), pli(side, zc + 0.98, 3.0, 1.4), pli(side, zc - 0.98, 3.0, 1.4)], '#0c0606');
        s += stone(face, zc, mix(base, '#fff0c8', lit ? 0.18 : 0.06), { chip: false, band: Math.max(1, K(zc) * 0.06), w: { op: 0.7 } }) + line(hood.map(([x, y]) => [x, y + K(zc) * 0.08]), Math.max(0.6, K(zc) * 0.05), mix(GOLD, base, lit ? 0.1 : 0.45), 0.9);
        if (near) for (let k = 2; k < 11; k += 2) { const p = hood[k]; s += `<path d="${smooth([[p[0], p[1]], [p[0] - K(zc) * 0.06, p[1] - K(zc) * 0.12], [p[0] + K(zc) * 0.04, p[1] - K(zc) * 0.16]], false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, K(zc) * 0.03))}" fill="none"/>`; }
        // the pinnacle: a tapered crocketed spire of stone, gilt only at the finial
        const ph = (1.1 + ((bi * 3 + i) % 4) * 0.45) * (i === 1 ? 1.4 : 1), broken = (bi * 3 + i) % 7 === 3, yb = 3.1 + 1.5 * hk - 0.05, yt = yb + (broken ? ph * 0.45 : ph), w0 = 0.16;
        const sp = [pli(side, zc - w0, yb, 1.4), pli(side, zc + w0, yb, 1.4), pli(side, zc + (broken ? w0 * 0.5 : 0.02), yt, 1.4), pli(side, zc - (broken ? w0 * 0.5 : 0.02), yt, 1.4)];
        s += fillP(sp, mix(base, '#fff0c8', lit ? 0.2 : 0.08)) + fillP([sp[1], sp[2], [(sp[2][0] + sp[3][0]) / 2, sp[2][1]], [(sp[0][0] + sp[1][0]) / 2, sp[0][1]]], mix(base, '#000', 0.35), 0.7) + inkP(sp, Math.max(0.5, K(zc) * 0.025));
        if (near) for (let k = 1; k < 4; k++) { const yy = yb + (yt - yb) * k / 4, a2 = pli(side, zc - w0 * (1 - k / 4), yy, 1.4); s += pline([a2, [a2[0] - K(zc) * 0.06, a2[1] - K(zc) * 0.05]], Math.max(0.5, K(zc) * 0.025), INK, 0.8); }
        if (broken) s += pline(jag(sp[3], sp[2], 3, K(zc) * 0.03), 0.8, INK); else { const ft = pli(side, zc, yt, 1.4); s += `<circle cx="${f1(ft[0])}" cy="${f1(ft[1])}" r="${f1(Math.max(0.8, K(zc) * 0.07))}" fill="${GOLD}" stroke="${INK}" stroke-width="0.5"/>`; } }
      // the kneeling desk in front of the stalls, with books on it
      s += stone(Q(z0 + 0.2, z1 - 0.2, 0, 1.0, 2.2), zm, mix(base, '#000', 0.1), { band: 1.5, chip: false, w: { op: 0.6 } }) + pline([pli(side, z0 + 0.2, 1.0, 2.2), pli(side, z1 - 0.2, 1.0, 2.2)], Math.max(0.8, K(zm) * 0.04), mix(GOLD, base, 0.3), 0.9);
      if (near) for (let i = 0; i < 3; i++) if ((bi + i) % 2 === 0) { const zc = z0 + BAY * (i + 0.5) / 3, c = pli(side, zc, 1.0, 2.0), w = K(zc) * 0.3; s += `<path d="M${f1(c[0] - w)} ${f1(c[1])} L${f1(c[0])} ${f1(c[1] - w * 0.25)} L${f1(c[0] + w)} ${f1(c[1])} L${f1(c[0])} ${f1(c[1] + w * 0.1)} Z" fill="#d8c8a0" stroke="${INK}" stroke-width="0.6"/>`; }
    }
    // the piers between bays: a cluster of shafts running the full height, projecting toward the centre
    { const za = z0 - 0.35, zb = z0 + 0.35, fq = Q(za, zb, 0, 60, 1.0), sq = [pli(side, side > 0 ? za : zb, 0, 0), pli(side, side > 0 ? za : zb, 0, 1.0), pli(side, side > 0 ? za : zb, 60, 1.0), pli(side, side > 0 ? za : zb, 60, 0)];
      s += fillP(sq, mix(base, '#000', 0.35)) + `<path d="${p2(sq)}" fill="${hatchA(z0)}" opacity="0.4"/>` + fillP(fq, mix(base, '#fff0c8', lit ? 0.22 : 0.08)) + `<path d="${p2(fq)}" fill="url(#mottle)" opacity="0.5"/>`;
      for (const u of [0.25, 0.5, 0.75]) s += pline([pli(side, za + (zb - za) * u, 0, 1.0), pli(side, za + (zb - za) * u, 60, 1.0)], 0.6, INK, 0.5);
      s += inkP(fq, 0.8); for (const yy of [7.6, 17.6, 28]) s += giltW(Q(za - 0.15, zb + 0.15, yy - 0.5, yy + 0.4, 1.15), z0, { dim: lit ? 0.1 : 0.5, cracks: 1, lost: 0 }); }
    // bay states
    if (state === 'burned') { const c = pl(side, zm, 12 + (bi % 3) * 4), cl = S.id('bb'); s += `<clipPath id="${cl}"><path d="${p2(Q(z0, z1, 0, 30))}"/></clipPath><g clip-path="url(#${cl})">${B.char(c[0], c[1], K(zm) * 2.2, K(zm) * 3.2, { op: 0.6, Z: zm })}${burnV(c[0], c[1], 1.6, K(zm) * 6, 2, { depth: 5 })}${burnV(c[0], c[1], -1.2, K(zm) * 5, 1.6, { depth: 4 })}</g>`; }
    if (state === 'void') { const c = pl(side, zm, 13); const t = tearS(c[0], c[1], K(zm) * 4.6, K(zm) * 12, { tears: 3, tearLen: 0.4, teeth: 2, slivers: 6, flecks: 14, mat: base, eyes: [[0.0, -0.2, 0.3], [0.1, 0.3, 0.18]], eyeO: { white: '#d8ccb4', iris: '#6a5a8a', open: 0.5 } }); s += t.svg; }
    if (state === 'fallen') { const c = pli(side, z0 + BAY * 0.25, 0.2, 2.5); s += `<path d="${smooth(blob(c[0], c[1], K(z0) * 1.2, K(z0) * 0.3, 10, 0.4), true, 0.5)}" fill="${mix(base, '#fff0c8', 0.15)}" stroke="${INK}" stroke-width="0.8"/>`; }
  });
  // the wall's own shade: the left wall faces away from the light (crosshatch), the right takes the light
  if (!lit) s += `<path d="${p2(wq)}" fill="${hatchA(20)}" opacity="0.4"/><path d="${p2(wq)}" fill="${grad([[0, '#060303', 0.72], [0.6, '#060303', 0.5], [1, '#060303', 0.35]], 0, 0, 0, 440)}"/>`;
  else s += `<path d="${p2(wq)}" fill="${grad([[0, '#ffd890', 0.12], [1, '#ffd890', 0]], 0, 0, 0, 300)}"/>`;
  { const ub = [pl(side, 8, 0), pl(side, ZEND, 0), pli(side, ZEND, 0, 2.6), pli(side, 8, 0, 2.6)]; s += `<path d="${p2(ub)}" fill="#040202" opacity="${lit ? 0.55 : 0.75}"/>`; for (const yy of [0.0]) s += `<path d="${p2(Q2(side, 8, ZEND, 0, 3.0, 0.92))}" fill="${grad([[0, '#040202', 0], [1, '#040202', lit ? 0.5 : 0.75]], 0, 0, 0, 440)}"/>`; }
  return s;
}
// a carved angel of the choir, singing: standing, wings half raised, the head tipped back, a scroll of music in the
// hands; gilt over dark stone on the lit side; u = px per metre at its depth
function singer(b, u, side, headless, lit, n) {
  const sc = u * 0.95, d = -side, T = (x, y) => [b[0] + x * sc * d, b[1] - y * sc], col = lit ? '#a8865e' : '#6a5038', g = lit ? GOLD : mix(GOLD, '#2a1a12', 0.35);
  const pose = n % 3; let s = '';
  const sil = (pts, c) => celSil(pts.map(p => T(...p)), c, { Ld: [-0.6, -0.8], ds: Math.max(1, sc * 0.12), dl: Math.max(0.5, sc * 0.04), ink: Math.max(0.5, sc * 0.03), Z: 20, k: 0.7 });
  s += sil([[-0.1, 1.5], [-0.55, 1.9], [-0.7, 2.7], [-0.5, 3.1], [-0.35, 2.5], [-0.15, 2.0]], mix(col, '#000', 0.2));
  s += sil([[-0.3, 0], [0.3, 0], [0.26, 0.8], [0.25, 1.75], [0.05, 1.95], [-0.2, 1.8], [-0.28, 0.9]], col);
  if (!headless) s += sil([[-0.12, 1.9], [0.1, 1.92], [0.18 + pose * 0.04, 2.1], [0.08, 2.3], [-0.1, 2.22]], col) + `<ellipse cx="${f1(T(-0.02, 2.2)[0])}" cy="${f1(T(-0.02, 2.2)[1])}" rx="${f1(sc * 0.22)}" ry="${f1(sc * 0.22)}" fill="none" stroke="${g}" stroke-width="${f1(Math.max(0.6, sc * 0.05))}"/>`;
  s += fillP([T(0.15, 1.3), T(0.55, 1.45 + pose * 0.1), T(0.5, 1.2 + pose * 0.1), T(0.12, 1.1)], mix('#e8dcc0', col, lit ? 0.2 : 0.6)) + pline([T(0.15, 1.3), T(0.55, 1.45 + pose * 0.1)], 0.6, INK, 0.8);
  s += pline([T(-0.25, 0.1), T(-0.25, 1.8)], Math.max(0.5, sc * 0.02), INK, 0.4) + pline([T(0.0, 0.1), T(0.02, 1.7)], Math.max(0.5, sc * 0.02), INK, 0.4);
  return s;
}
raw(wall(-1));
raw(wall(1));
// ---- the right wall torn open over the seraph's post: the storm outside, an eye
{
  const c = pl(1, 12.5, 7.5);
  const t = tearS(c[0] + 40, 70, 300, 190, { tears: 3, tearLen: 0.4, teeth: 2, slivers: 9, flecks: 26, mat: '#7a5e48', edge: '#a88ad0', edgeOp: 0.6, n: 80 });
  raw(t.svg);
  const cl = S.id('st'); raw(`<clipPath id="${cl}"><path d="${p2(t.outline)}"/></clipPath><g clip-path="url(#${cl})">`);
  raw(`<rect x="${f1(c[0] - 200)}" y="-20" width="500" height="320" fill="${grad([[0, '#0c0814'], [0.6, '#2a1e3a'], [1, '#4a3a5a']], 0, -20, 0, 260)}"/>`);
  raw(X.softCloud(c[0] + 40, 150, 340, 90, { col: '#2e2440', lit: '#b896d0', dark: '#0c0814', light: [-0.7, -0.7], fronts: 2, rim: 6, wisps: 3 }));
  raw(X.rain(c[0] - 120, c[0] + 220, -20, 260, 160, { ang: 0.25, len: 16, op: 0.3, col: '#c8b8e0' }));
  raw(X.voidEye(c[0] + 90, 52, 40, { open: 0.4, look: [-0.7, 0.5], lips: 1, lip: '#2a2036' }));
  raw('</g>');
}
// ---- light: the gold shafts from the high lantern (upper left) falling onto the lectern and the floor
raw(shaftG([[420, -10], [600, -10], [860, 420], [640, 420]], '#ffe4a8', 0.5, { soft: 9, core: 0.9, motes: 70 }));
raw(shaftG([[280, -10], [340, -10], [560, 430], [480, 430]], LIT, 0.16, { soft: 6, motes: 20 }));
raw(shaftG([[660, -10], [700, -10], [990, 430], [930, 430]], LIT, 0.14, { soft: 6, motes: 20 }));
// ---- the floor: black marble with gilt lines converging on the lectern, polished: the windows and the shaft reflect in it
{
  const fl = [pl(-1, 6, 0), pl(-1, ZEND, 0), pl(1, ZEND, 0), pl(1, 6, 0), [W + 20, H + 10], [-20, H + 10]];
  raw(fillP(fl, '#140c0a'));
  const cf = S.id('fl'); raw(`<clipPath id="${cf}"><path d="${p2(fl)}"/></clipPath><g clip-path="url(#${cf})">`);
  raw(B.flags(-XW, XW, 3.5, 60, '#2a1c16', { depth: 1.7, width: 1.8, vary: 0.2, cracks: 0.25, fogK: 0.1, joint: 0.7, hi: false }));
  // gilt inlay: the long lines down the choir, and a great inlaid circle round the lectern
  for (const x of [-6, -2.2, 2.2, 6]) raw(pline([P(x, 0, 3.5), P(x, 0, ZEND)], 1.6, mix(GOLD, '#2a1c16', 0.25), 0.8));
  { const pts = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; pts.push(P(Math.cos(a) * 4.2, 0, 24 + Math.sin(a) * 4.2)); } raw(line(pts, 2, mix(GOLD, '#2a1c16', 0.2), 0.9)); const p3 = pts.map((p, i) => P(Math.cos(i / 48 * Math.PI * 2) * 3.6, 0, 24 + Math.sin(i / 48 * Math.PI * 2) * 3.6)); raw(line(p3, 1, mix(GOLD, '#2a1c16', 0.3), 0.8)); }
  // reflections: the lit organ and the right wall's windows mirrored as soft vertical streaks; the shaft's pool
  raw(`<path d="${p2([P(-6, 0, ZEND - 2), P(6, 0, ZEND - 2), P(6, 0, 40), P(-6, 0, 40)])}" fill="${grad([[0, '#ffc870', 0.4], [1, '#ffc870', 0]], 0, P(0, 0, ZEND)[1], 0, P(0, 0, 40)[1])}"/>`);
  for (let z = ZEND - BAY / 2; z > 12; z -= BAY) { const a = P(XW - 0.6, 0, z), b = P(XW - 0.6, 0, z - 1.2); raw(`<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} L${f1(b[0] - K(z) * 3)} ${f1(b[1] + K(z) * 0.4)} L${f1(a[0] - K(z) * 3)} ${f1(a[1] + K(z) * 0.4)} Z" fill="#ffc870" opacity="0.12" filter="${blurF(2)}"/>`); }
  raw(`<ellipse cx="${f1(P(0, 0, 24)[0] - 40)}" cy="${f1(P(0, 0, 24)[1])}" rx="200" ry="22" fill="${rgrad(P(0, 0, 24)[0] - 40, P(0, 0, 24)[1], 200, 22, [[0, LIT, 0.5], [1, LIT, 0]])}"/>`);
  raw(`<path d="${p2([P(-2.6, 0, 3.5), P(2.6, 0, 3.5), P(1.6, 0, 20), P(-1.6, 0, 20)])}" fill="#4a3424" opacity="0.35"/>`);
  raw(`<path d="${p2([[620, 480], [900, 480], [830, 330], [690, 330]])}" fill="${grad([[0, LIT, 0], [0.6, LIT, 0.14], [1, LIT, 0.22]], 0, 480, 0, 330)}" filter="${blurF(8)}"/>`);
  // hymnals fallen from the stalls, open, face down; a burn across the marble
  for (const [x, z, a] of [[-7.5, 14, 0.3], [-6.8, 19, -0.5], [7.2, 16, 0.8], [6.5, 30, 0.1], [-8, 36, 0.2]]) { const c = P(x, 0.02, z), w = K(z) * 0.32; raw(`<path d="M${f1(c[0] - w)} ${f1(c[1])} L${f1(c[0])} ${f1(c[1] - w * 0.18)} L${f1(c[0] + w)} ${f1(c[1] + w * 0.05)} L${f1(c[0])} ${f1(c[1] + w * 0.15)} Z" fill="#d8c8a0" stroke="${INK}" stroke-width="0.7" transform="rotate(${f1(a * 20)} ${f1(c[0])} ${f1(c[1])})"/>`); }
  { const c = P(3, 0, 13); for (let i = 0; i < 4; i++) raw(burnV(c[0], c[1], i / 4 * 6.28 + 0.6, 60 + R() * 40, 1.6, { depth: 4, haloOp: 0.2 })); }
  raw('</g>');
}
// ---- the eagle lectern in the light: a stepped base, the shaft, the gilt eagle with its wings carrying the hymnal open
{
  const z = 24, k = K(z), b = P(0, 0, z), T = (x, y) => [b[0] + x * k, b[1] - y * k];
  raw(stone([T(-0.9, 0), T(0.9, 0), T(0.8, 0.25), T(-0.8, 0.25)], z, '#3a2618', { band: 1.5 }) + stone([T(-0.6, 0.25), T(0.6, 0.25), T(0.5, 0.45), T(-0.5, 0.45)], z, '#4a3424', { band: 1.5 }));
  raw(giltW([T(-0.09, 0.45), T(0.09, 0.45), T(0.07, 1.25), T(-0.07, 1.25)], z, { dim: 0.05, cracks: 2, lost: 0 }));
  raw(celSil([T(-0.1, 1.2), T(0.25, 1.25), T(0.4, 1.4), T(0.15, 1.42), T(-0.1, 1.5), T(-0.45, 1.55), T(-0.3, 1.38)], GOLD, { Ld: [-0.6, -0.8], ds: 3, dl: 1.2, dark: GOLDD, lit: GOLDL, ink: 1 }));
  raw(celSil([T(-0.5, 1.5), T(0.45, 1.66), T(0.42, 1.74), T(-0.52, 1.6)], '#e8dcc0', { Ld: [-0.6, -0.8], ds: 1.5, dl: 0.8, ink: 0.8 }) + pline([T(-0.03, 1.55), T(-0.03, 1.67)], 0.8, INK) + fillP([T(-0.42, 1.56), T(-0.3, 1.58), T(-0.31, 1.62), T(-0.43, 1.6)], '#a02a1a'));
}
// ---- the quiet zone: warm murk veils over the far floor band
raw(quiet([[262, 0.12], [300, 0.14], [340, 0.12], [390, 0.1]], { hop: 0.12, col: '#140a08' }));

// ======================================================================== MID
layer('mid');
{ // near the fighters: a fallen hymnal, a snapped candle and its pricket stand on its side (low, dark)
  const c = P(-2.8, 0.02, 8.4), w = K(8.4) * 0.3; raw(`<path d="M${f1(c[0] - w)} ${f1(c[1])} L${f1(c[0])} ${f1(c[1] - w * 0.16)} L${f1(c[0] + w)} ${f1(c[1] + w * 0.05)} L${f1(c[0])} ${f1(c[1] + w * 0.14)} Z" fill="#8a7a5a" stroke="${INK}" stroke-width="0.8" opacity="0.85"/>`);
  const a = P(4.2, 0.08, 9.0), b2 = P(5.6, 0.08, 9.4); raw(line([a, b2], 3, INK, 0.7) + line([a, b2], 1.6, mix(GOLDD, '#2a1c16', 0.5)));
}

// ======================================================================== FORE
layer('fore');
{ // left: the near stall end, cropped by the frame: dark carved oak-like stone with a poppyhead and a gilt kneeling-angel
  // finial; top left: a sanctuary lamp hanging on its chain into the frame, still lit (scale)
  const q = [[-10, 250], [38, 246], [44, H + 10], [-10, H + 10]];
  raw(stone(q, 3.2, '#2a1a12', { band: 5, chip: 0.2, w: { op: 1, stainGap: 4, pitArea: 30, cracks: 2 } }) + `<path d="${p2([[18, 246], [44, 246], [44, H + 10], [18, H + 10]])}" fill="${hatchA(3.2)}" opacity="0.5"/>`);
  raw(stone([[-12, 236], [50, 232], [52, 252], [-12, 254]], 3.2, '#3a2818', { band: 4, w: { op: 0.8 } }) + pline([[-12, 233], [50, 229]], 2, GOLD, 0.9));
  raw(X.colossus(-4, 234, 150, 1, { k: 0, col: '#8a6a3a', ink: 1.8, burn: false }));
  const cl = S.id('se'); raw(`<clipPath id="${cl}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${cl})">${burnV(16, 470, -1.5, 160, 2.2, { depth: 5 })}</g>`);
  // the sanctuary lamp
  raw(chainC([300, -10], [304, 70], 2, 2.2, { col: '#5a4028' }));
  raw(glowE(304, 90, 60, 50, '#ffc870', 0.4) + celSil([[286, 72], [322, 72], [316, 96], [304, 106], [292, 96]], GOLD, { Ld: [-0.6, -0.8], ds: 3, dl: 1.2, ink: 1.4 }) + `<path d="M298 74 Q304 62 310 74 Z" fill="#fff0b0"/>`);
}

G.write(OUT, 'sky_choir');
