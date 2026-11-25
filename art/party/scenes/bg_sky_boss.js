// World XV, the Torn Sky: THE SEAT OF THE MOTHER OF COURSES (boss room `sky_boss`; finale-tier rebuild, 2026-11-24, kit
// battle_kit_xv.js). Boss: The Shattered God ("She held all six courses in one body, and the world was whole. The void
// betrayed her, and now it is all that runs out of her."). Heaven's summit, her open apse, above everything. A column of
// white-gold light falls straight down onto her seat from a rent in the storm, so her broken, hollow pieces hang
// back-lit in it. Behind her stands her glory: a halo the size of a cathedral front, broken, its broken arc drifting
// outward in order, and the gilt rays of the glory round it, some snapped. On the left the apse's colonnade of colossal
// fluted columns curves round toward her; one has broken and its upper drums lift apart along its own axis, each a
// little further. Over it the whole sky is torn open: a clean-rimmed absence wider than the summit, and from it
// something looks down at her. Between the columns, far below, lie the islands of heaven with their waterfalls, and
// round the summit the host kneels at kilometre scale, heads bowed toward her seat. From her dais the six courses that
// once carried the six courses out into the world run across the floor toward us: gilt-lipped channels, and the only
// thing that runs in them now is void. No war: nothing here fought. Her eyes and mouth are missing (her figure).
// Composition: the right 45% is her stage; the halo, the rays and the light frame her; the grand features (the torn
// sky, the colonnade, the kneeling host) take the left and the top. Highest contrast in the game: black void and white
// light. Lightning only as violet burns on surfaces. Usage: node scenes/bg_sky_boss.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XV');
const { S, B, G, X } = require('./battle_kit_xv').make(15511, '#1a1620', '#2a2232', '#6a5e70');
const { P, K, p2, f1, INK, raw, layer, cel, chip, mix, R, smooth, inkW, hatchA, hatchB } = S;
const { line, pline, fillP, fillS, inkP, blob, jag, fused, quiet } = B;
const { W, H, GOLD, GOLDL, GOLDD, BLACK } = G;
const { fade, burnV, grad, rgrad, blurF, glowE, sky, softCloud, stormWall, cloudSea, shaftG, weather, stone, giltW, tearS, island, halo, colossus, column, celSil, driftSeq } = X;
const LIGHTC = '#fff6dc', MARBLE = '#d4ccc0', MC = [1165, 150]; // MC: the centre of her glory (screen)
const DAIS = [5.6, 13];                                          // her seat on the floor (X, Z)

// ======================================================================== FAR
layer('far');
// ---- the storm sky: near black at the top, violet, a glare low around the column of light
raw(sky([[0, '#0a0810'], [0.3, '#1e1828'], [0.58, '#4a3c52'], [0.64, '#8a7a7a'], [0.7, '#3a3040'], [1, '#1a1620']], [[MC[0], 250, 520, 220, '#ffe8b0', 0.55], [MC[0], 120, 240, 420, '#fff2d0', 0.35]]));
// storm masses: a ceiling of billows across the top, lit from below by the column
raw(softCloud(1240, 10, 900, 130, { col: '#2a2234', lit: '#ffe0a8', dark: '#0a0810', light: [0, 1], flat: 0.5, peak: 0.6, fronts: 5, wisps: 3, rim: 12, inkOp: 0.2 }));
raw(stormWall(1200, 1560, 300, 60, { rows: 4, col: '#241c2e', edge: v => 1330 - v * 60, cloud: { lit: '#ffd8a0', dark: '#08060c', light: [-1, -0.2] } }));
// ---- far below: the cloud sea and the islands of heaven, small, waterfalls off their lips; the host kneeling round
raw(cloudSea(300, 400, { col: '#5a4c5e', lit: '#ffe0b8', dark: '#1e1826', rows: 6, big: 0.6, light: [0.8, -0.6] }));
raw(island(140, 312, 130, { k: 0.6, col: '#a89a8c', depth: 0.5, build: [{ type: 'cathedral', u: 0, s: 0.5 }], falls: [[-0.44, 0.03], [0.42, 0.025]], fallLen: 60, baseFade: 0.9 }));
raw(island(520, 318, 90, { k: 0.66, col: '#a89a8c', depth: 0.5, build: [{ type: 'dome', u: -0.1, s: 0.3 }, { type: 'tower', u: 0.25, s: 0.18 }], falls: [[0.4, 0.03]], fallLen: 50, baseFade: 0.9 }));
raw(island(760, 309, 160, { k: 0.62, col: '#a89a8c', depth: 0.5, build: [{ type: 'hall', u: -0.1, s: 0.35 }, { type: 'tower', u: 0.3, s: 0.2, h: 1.5 }], falls: [[-0.45, 0.025], [0.1, 0.02]], fallLen: 70, baseFade: 0.9 }));

// ---- THE TORN SKY: the whole upper sky torn open over the summit; something enormous looks down at her through it
{
  const t = tearS(430, 56, 860, 200, { tears: 3, tearLen: 0.35, teeth: 2, slivers: 5, flecks: 30, mat: '#3a3044', edge: '#a080d0', edgeOp: 0.7, n: 110 });
  raw(t.svg);
  const cl = S.id('tv'); raw(`<clipPath id="${cl}"><path d="${p2(t.outline)}"/></clipPath><g clip-path="url(#${cl})">`);
  const ec = [345, 32];
  raw(`<ellipse cx="${f1(ec[0])}" cy="${f1(ec[1])}" rx="300" ry="130" fill="${rgrad(ec[0], ec[1], 300, 130, [[0, '#3a3046', 0.9], [0.5, '#1c1624', 0.7], [1, '#050407', 0]])}"/>`);
  raw(X.voidEye(ec[0], ec[1], 128, { open: 0.34, look: [0.6, 0.5], rot: 0.08, lip: '#2e2638', skin: '#342a3e' }));
  raw('</g>');
}

// the host kneeling round the summit (in front of the torn sky, silhouetted against the void), heads bowed toward her: kilometre scale, out over the drop (two seen)
raw(colossus(150, 338, 340, 1, { k: 0.58, col: '#a89c98' }));
raw(colossus(560, 330, 250, 1, { k: 0.66, col: '#a09492', pose: 'headless', wing: 'broken' }));

// ---- THE COLUMN OF LIGHT falling onto her seat from a rent in the storm (luminous: bright core, soft glow)
raw(`<rect x="${MC[0] - 300}" y="-10" width="600" height="500" fill="${rgrad(MC[0], 200, 300, 400, [[0, '#ffe8b8', 0.5], [1, '#ffe8b8', 0]])}"/>`);
raw(shaftG([[MC[0] - 150, -10], [MC[0] + 150, -10], [MC[0] + 230, 470], [MC[0] - 230, 470]], '#fff0c8', 0.55, { soft: 18, mid: 0.6, midOp: 0.85, endOp: 0.35 }));
raw(shaftG([[MC[0] - 80, -10], [MC[0] + 80, -10], [MC[0] + 120, 470], [MC[0] - 120, 470]], '#ffffff', 0.75, { soft: 10, mid: 0.6, midOp: 0.9, endOp: 0.5 }));

// ---- HER GLORY: the rays of gilt round her, some snapped (their broken outer parts drift outward in line), and the
// broken halo the size of a cathedral front behind her head
{
  const nR = 22; for (let i = 0; i < nR; i++) { const a = i / nR * Math.PI * 2 + 0.06, r0 = 330, r1 = 330 + (160 + (i % 3) * 90 + (i % 2) * 50) * (Math.cos(a) < -0.3 ? 0.35 : 1), w0 = 0.032, broke = i % 5 === 2;
    const rp = (r, da) => [MC[0] + Math.cos(a + da) * r, MC[1] + Math.sin(a + da) * r * 0.98];
    const full = [rp(r0, -w0), rp(r1, -0.004), rp(r1, 0.004), rp(r0, w0)];
    const dim = 0.05 + (Math.sin(a) + 1) * 0.12;
    if (!broke) raw(giltW(full, 30, { dim, cracks: 1, lost: 0, wear: 0.3, sheen: 0.8 }) + burnV(...rp(r0 + 30, 0), a, 50, 1.2, { depth: 2 }));
    else { const rm = r0 + (r1 - r0) * 0.45, inner = [rp(r0, -w0), rp(rm, -w0 * 0.75), rp(rm, w0 * 0.75), rp(r0, w0)], outer = [rp(rm, -w0 * 0.75), rp(r1, -0.004), rp(r1, 0.004), rp(rm, w0 * 0.75)];
      raw(giltW(inner, 30, { dim, cracks: 1, lost: 0 }) + fillP([inner[1], inner[2], rp(rm + 3, 0)], BLACK));
      raw(driftSeq([outer], [Math.cos(a), Math.sin(a)], 26, 0.06, q => giltW(q, 30, { dim: dim + 0.1, cracks: 1, lost: 0 }))); } }
  raw(halo(MC[0], MC[1], 300, 296, 26, { gap: [-2.35, -1.75], drift: 11, along: 7, turn: 0.04, dim: 0.02, n: 22, Z: 30, murk: '#6a5e70', burns: 4, shadeK: 0.35, wear: 0.3 }).svg);
}

// ---- THE COLONNADE of the apse on the left: colossal fluted columns curving round toward her seat; one broken, its
// upper drums lifting apart along its axis in order; the lower heavens between them
{
  const cols = [[-19, 19, 1.5, { broken: 6.2, lift: [3, 0.7, 1.4] }], [-15.5, 25, 1.5, { broken: 10.5 }], [-11.5, 32, 1.5, { cap: 'gilt', burn: true, top: 13.5 }], [-7.5, 40, 1.5, { broken: 16, lift: [2, 1.2, 1.2] }], [-3.6, 49, 1.5, { cap: 'gilt', top: 18.5 }], [0.2, 58, 1.5, { broken: 21, lift: [2, 1.5, -0.8] }]];
  for (const [Xc, Zc, r, o] of cols.slice().reverse()) {
    raw(column(Xc, Zc, r, 0, o.top ?? 60, Object.assign({ col: MARBLE, flutes: 14, cap: false, k: Math.max(0, (Zc - 12) / 90), drum: 2.6, shadeK: 1.5 }, o)));
    // the column's warm rim on its right edge, from the light of her seat
    const a = P(Xc + r, 0, Zc), b = P(Xc + r, o.broken ?? o.top ?? 60, Zc); raw(pline([[a[0] - 1.2, a[1]], [b[0] - 1.2, b[1]]], Math.max(1.2, K(Zc) * 0.12), '#ffe8b8', 0.55));
  }
  // on the whole column nearest the stage a fragment of the fallen architrave still rests on its capital, gilt frieze
  { const Xc = -3.6, Zc = 49, yT = 18.5 + 3.6, a = P(Xc - 3.2, yT, Zc), b = P(Xc + 2.4, yT + 2.2, Zc), q = [[a[0], b[1]], [b[0], b[1] + 3], [b[0] - 6, a[1]], [a[0], a[1]]];
    raw(stone(q, Zc, MARBLE, { band: 2 }) + giltW([[a[0] + 2, b[1] + 6], [b[0] - 3, b[1] + 8], [b[0] - 4, b[1] + 13], [a[0] + 2, b[1] + 11]], Zc, { dim: 0.1, cracks: 1, lost: 1 })); }
  // the colonnade's plinth course and the apse's step running round
  const st = []; for (let i = 0; i <= 20; i++) { const u = i / 20, Xc = -21 + u * 22, Zc = 17 + u * u * 41; st.push([Xc, Zc]); }
  raw(line(st.map(([x, z]) => P(x, 1.0, z)), 2.4, INK, 0.9) + line(st.map(([x, z]) => P(x, 1.0, z)), 1.4, mix(GOLD, MARBLE, 0.3), 0.9));
}

// ---- THE FLOOR of the summit: pale weathered marble, gilt radial inlay round her dais, the six courses running out
{
  const edgeZ = 52, fl = [P(-40, 0, edgeZ), P(40, 0, edgeZ), [W + 20, H + 10], [-20, H + 10]];
  raw(fillP(fl, '#8a8288'));
  const cf = S.id('fl'); raw(`<clipPath id="${cf}"><path d="${p2(fl)}"/></clipPath><g clip-path="url(#${cf})">`);
  raw(B.flags(-30, 30, 3.6, edgeZ, '#a49aa0', { depth: 1.5, width: 1.7, vary: 0.14, cracks: 0.3, fogK: 0.3, joint: 0.5, hi: true }));
  // the gilt rings of inlay round the dais
  for (const rr of [5.5, 8.5, 12]) { const pts = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; pts.push(P(DAIS[0] + Math.cos(a) * rr, 0, DAIS[1] + Math.sin(a) * rr)); } raw(line(pts.filter(p => p[1] > 300), 1.6, mix(GOLD, '#8a8288', 0.2), 0.85)); }
  // the light lying on the floor before her: a blazing pool, warm
  raw(`<ellipse cx="${f1(MC[0] - 40)}" cy="420" rx="420" ry="70" fill="${rgrad(MC[0] - 40, 420, 420, 70, [[0, '#fff2d0', 0.75], [0.5, '#ffe0a0', 0.35], [1, '#ffe0a0', 0]])}"/>`);
  // THE SIX COURSES: gilt-lipped channels radiating from the dais toward us and to the left; void runs in them
  { const d0 = [DAIS[0] - 2.6, DAIS[1] - 2.2], targets = [-130, 120, 330, 520, 700, 860];
    targets.forEach((tx, k) => { const Zt = 4.0, Xt = (tx - 740) * Zt / 652, Ls = [], Rs = [], N = 30;
      for (let i = 0; i <= N; i++) { const u = i / N, Xc = d0[0] + (Xt - d0[0]) * u + Math.sin(u * Math.PI * (1.4 + k * 0.17) + k) * (0.5 + u * 0.9), Zc = d0[1] + (Zt - d0[1]) * u, dx = Xt - d0[0], dz = Zt - d0[1], l = Math.hypot(dx, dz), nx = -dz / l, nz = dx / l, w = 0.34 * (1 - Math.pow(u, 1.5)) + 0.06;
        Ls.push(P(Xc + nx * w, 0, Zc + nz * w)); Rs.push(P(Xc - nx * w, 0, Zc - nz * w)); }
      const ch = [...Ls, ...Rs.slice().reverse()];
      raw(`<path d="${smooth(ch, true, 0.3)}" fill="#050407"/>` + `<path d="${smooth(ch, true, 0.3)}" fill="${hatchB(8)}" opacity="0.3"/>`);
      const lit = Ls[0][0] > Rs[0][0] ? Rs : Ls, sh = lit === Ls ? Rs : Ls;
      const cut = Math.round(N * 0.86); raw(line(Ls.slice(0, cut), 4.2, '#e8e0d4', 0.7) + line(Rs.slice(0, cut), 4.2, '#e8e0d4', 0.5) + line(Ls.slice(0, cut), 2.8, INK) + line(Rs.slice(0, cut), 2.8, INK) + line(lit.slice(0, cut).map(([x, y]) => [x, y - 0.6]), 2.2, GOLDL, 1) + line(sh.slice(0, cut), 1.7, GOLD, 0.95));
      // gilt flecks drawn into the void and carried out along the course, thinning toward us
      for (let i = 2; i < N; i += 3) { const m = [(Ls[i][0] + Rs[i][0]) / 2 + (R() - 0.5) * 3, (Ls[i][1] + Rs[i][1]) / 2], r2 = 0.8 + R() * 1.4; raw(`<path d="M${f1(m[0] - r2)} ${f1(m[1])} l${f1(r2)} ${f1(-r2 * 0.6)} l${f1(r2)} ${f1(r2 * 0.6)} Z" fill="${GOLD}" opacity="${f1(0.85 - i / N * 0.6)}"/>`); }
      // where a course is broken the void spills out in a clean-rimmed pool
      if (k === 1 || k === 4) { const i = k === 1 ? 18 : 12, m = [(Ls[i][0] + Rs[i][0]) / 2, (Ls[i][1] + Rs[i][1]) / 2]; raw(tearS(m[0], m[1], 44, 12, { tears: 2, tearLen: 0.3, teeth: 1, slivers: 2, flecks: 8, mat: '#a49aa0', n: 30 }).svg); } }); }
  // the dais: three steps round her seat (its flanks show either side of her)
  for (let k = 0; k < 3; k++) { const r = 5.4 - k * 0.55, y0 = k * 0.28, top = [], bot = [], tread = [];
    for (let i = 0; i <= 28; i++) { const ang = Math.PI * (1.02 + i / 28 * 0.98), X0 = DAIS[0] + Math.cos(ang) * r * 1.35, Z0 = DAIS[1] + Math.sin(ang) * r; top.push(P(X0, y0 + 0.28, Z0)); bot.push(P(X0, y0, Z0)); tread.push(P(DAIS[0] + Math.cos(ang) * (r - 0.55) * 1.35, y0 + 0.28, DAIS[1] + Math.sin(ang) * (r - 0.55))); }
    raw(`<path d="${smooth([...top, ...tread.slice().reverse()], true, 0.3)}" fill="${mix(MARBLE, '#fff0d0', 0.3)}"/>`);
    const face = [...top, ...bot.slice().reverse()]; raw(stone(face, 10, mix(MARBLE, '#b0a8a8', 0.3), { chip: false, band: 1.5, w: { op: 0.6 } }) + line(top, 1.6, GOLD, 0.95) + line(bot, 1.2, INK, 0.8)); }
  // the strike at the foot of the dais: a fused scar, burns branching across the marble
  { const c = P(-1.5, 0, 14); raw(fused(c[0], c[1], 6, '#6a6070', 14)); for (let i = 0; i < 4; i++) raw(burnV(c[0], c[1], i / 4 * 6.28 + 0.4, 40 + R() * 40, 1.5, { depth: 3, haloOp: 0.2 })); }
  // gold leaf fallen from her, drifted against the dais and along the courses
  { let m = ''; for (let i = 0; i < 160; i++) { const z = 6 + R() * 9, c = P(-6 + R() * 22, 0, z), r = 0.6 + R() * 1.6; m += `M${f1(c[0] - r)} ${f1(c[1])} l${f1(r * 1.3)} ${f1(-r * 0.5)} l${f1(r * 0.7)} ${f1(r * 0.6)} Z `; } raw(`<path d="${m}" fill="${GOLD}" opacity="0.75"/>`); }
  // familiar scale: a prie-dieu kneeler of the host before the dais, and a candle-stand, both near the fighters' line
  { const z = 11.2, b = P(-3.2, 0, z), k2 = K(z), T = (x, y) => [b[0] + x * k2, b[1] - y * k2];
    raw(stone([T(-0.3, 0), T(0.3, 0), T(0.3, 0.25), T(-0.3, 0.25)], z, '#6a5a50', { band: 1.5 }) + stone([T(0.1, 0.25), T(0.3, 0.25), T(0.3, 1.0), T(0.1, 1.0)], z, '#6a5a50', { band: 1.5 }) + stone([T(0.02, 0.95), T(0.42, 0.98), T(0.42, 1.08), T(0.02, 1.05)], z, '#7a6a5e', { band: 1 }) + pline([T(0.02, 1.06), T(0.42, 1.09)], 1.2, GOLD));
    const c = P(-8.5, 0, 12.5), kc = K(12.5); raw(line([c, [c[0], c[1] - kc * 1.7]], 2, INK) + line([c, [c[0], c[1] - kc * 1.7]], 1, GOLD) + line([[c[0] - kc * 0.25, c[1] - kc * 1.7], [c[0] + kc * 0.25, c[1] - kc * 1.7]], 2, GOLD) + `<rect x="${f1(c[0] - 1.2)}" y="${f1(c[1] - kc * 1.95)}" width="2.4" height="${f1(kc * 0.25)}" fill="#e8dcc0" stroke="${INK}" stroke-width="0.5"/>`); }
  raw('</g>');
  raw(pline([P(-40, 0, edgeZ), P(40, 0, edgeZ)], 1.4, '#fff0d0', 0.6));
}
raw(quiet([[262, 0.08], [300, 0.1], [345, 0.08]], { hop: 0.08, col: '#1a1620' }));

// ======================================================================== MID
layer('mid');
{ // low near the heroes: a broken drum of a column fallen and split, a scatter of gold leaf, a cracked halo ring
  const c = P(-6.4, 0.5, 8.8), k2 = K(8.8); raw(stone([[c[0] - k2 * 1.0, c[1] - k2 * 0.5], [c[0] + k2 * 0.8, c[1] - k2 * 0.52], [c[0] + k2 * 0.9, c[1] + k2 * 0.5], [c[0] - k2 * 1.0, c[1] + k2 * 0.5]], 8.8, '#6a6268', { band: 3, w: { op: 0.6 } }) + `<ellipse cx="${f1(c[0] + k2 * 0.86)}" cy="${f1(c[1])}" rx="${f1(k2 * 0.2)}" ry="${f1(k2 * 0.5)}" fill="#4a4248" stroke="${INK}" stroke-width="1"/>`);
  for (let i = 1; i < 8; i++) raw(pline([[c[0] - k2 * 1.0 + i * k2 * 0.25, c[1] - k2 * 0.5], [c[0] - k2 * 1.0 + i * k2 * 0.25, c[1] + k2 * 0.5]], 0.6, INK, 0.4));
}

// ======================================================================== FORE
layer('fore');
{ // the light falling on her: a soft luminous shaft over her stage and motes of gold leaf turning down through it
  raw(shaftG([[MC[0] - 110, -10], [MC[0] + 110, -10], [MC[0] + 200, 480], [MC[0] - 200, 480]], '#fff4d8', 0.16, { soft: 20, mid: 0.6, midOp: 0.9, endOp: 0.1 }));
  { let m = ''; for (let i = 0; i < 46; i++) { const y = R() * 460, x = MC[0] + (R() - 0.5) * (200 + y * 0.35), r = 0.8 + R() * 1.8, a = R() * 3; m += `<path d="M${f1(x - r)} ${f1(y)} L${f1(x + r * Math.cos(a))} ${f1(y - r * 0.7)} L${f1(x + r)} ${f1(y + r * 0.4)} Z" fill="${R() < 0.5 ? GOLDL : GOLD}" stroke="${INK}" stroke-width="0.3" opacity="${f1(0.5 + R() * 0.4)}"/>`; } raw(m); }
  // her dais stones and rubble at her foot, over the straight base of her render (y 438, x 927-1402) and the cut left
  // edge of her lap (x 927, y 349-438): broken step blocks of marble with gilt nosings, a heap at the lap's left edge,
  // drifts of her gold leaf among them
  { const blk = (cx, cy, w, h2, tilt, col, wedge) => { const base = wedge ? [[-0.5, 0.5], [-0.35, -0.5], [0.5, 0.1], [0.5, 0.5]] : [[-0.5, 0.5], [-0.5, -0.5], [0.15 + R() * 0.2, -0.5], [0.5, -0.2 - R() * 0.25], [0.5, 0.5]];
      const q = base.map(([u, v]) => { const dx = u * w, dy = v * h2; return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), cy + dx * Math.sin(tilt) + dy * Math.cos(tilt)]; });
      const top = [q[1], q[2], q[3]];
      return stone(chip(q, 0.6), 6, col, { band: 3, chip: false, w: { op: 1, stainGap: 4 } }) + `<path d="${p2(q)}" fill="${hatchA(6)}" opacity="0.4"/>` + pline(top, 1.5, '#ffe6b0', 0.6) + (!wedge && R() < 0.6 ? pline([q[1], q[2]], 1.6, GOLD, 0.85) : ''); };
    const pieces = [[922, 410, 52, 30, -0.5, '#4e464e', false], [958, 384, 46, 22, 0.35, '#5a5058', true], [940, 440, 70, 30, 0.1, '#463e46', false], [992, 446, 50, 18, -0.15, '#524a52', true]];
    let x = 1012; while (x < W + 30) { const w = 50 + R() * 70, h2 = 12 + R() * 14, wg = R() < 0.35; pieces.push([x + w / 2, 452 + R() * 8, w, h2, (R() - 0.5) * 0.3, mix('#4a424a', '#625860', R()), wg]); x += w * (0.75 + R() * 0.35); }
    for (let i = 0; i < 12; i++) pieces.push([900 + R() * 580, 470 + R() * 8, 12 + R() * 22, 6 + R() * 6, (R() - 0.5) * 0.8, '#3e383e', R() < 0.5]);
    for (const [cx, cy, w, h2, t, c, wg] of pieces) raw(blk(cx, cy, w, h2, t, c, wg));
    let m = ''; for (let i = 0; i < 90; i++) { const xx = 900 + R() * 580, yy = 420 + R() * 55, r2 = 0.8 + R() * 2; m += `M${f1(xx - r2)} ${f1(yy)} l${f1(r2 * 1.3)} ${f1(-r2 * 0.5)} l${f1(r2 * 0.7)} ${f1(r2 * 0.6)} Z `; } raw(`<path d="${m}" fill="${GOLD}" stroke="${INK}" stroke-width="0.3" opacity="0.85"/>`);
    // the light blooming round the edge of her raised hand (x 927, y 233-318)
    raw(`<ellipse cx="925" cy="276" rx="26" ry="62" fill="${rgrad(925, 276, 26, 62, [[0, '#fff4d8', 0.55], [0.6, '#fff0d0', 0.25], [1, '#fff0d0', 0]])}"/>`); }
  // left: the nearest column of the colonnade, cropped by the frame: fluted marble, a fused strike and a violet burn
  raw(column(-7.6, 4.0, 0.9, 0, 30, { col: '#7a7078', flutes: 12, cap: false, base: false, drum: 1.4, burn: true }));
}

G.write(OUT, 'sky_boss');
