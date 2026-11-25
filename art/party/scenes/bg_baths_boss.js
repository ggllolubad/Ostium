// World III, the Boiling Baths: THE SANCTUM OF THE WATERS (boss room `baths_boss`, The Simmering Matron), Living Ink,
// round 2 (group g1). Lore: "The matron of the baths. She has been simmering for a hundred years and is nearly ready." The
// temple's high priestess of the waters never left the great pool. Her pool lies at the heart of the temple's rotunda:
// a ring of tall columns under a coffered dome, the dome's oculus letting one column of light fall straight down through
// her steam into the water. Behind her the cult exedra: a half-dome gilded with the temple's waves (holy, the only gold),
// the sacred spring's bronze mouth, the priestesses' bronze basins on their stands. The floor is laid in rings of marble
// round the pool, heat-crazed, wet.
// Space: grand domed interior, the colonnade curving round; the exedra frames her (boss stage: the right 45%).
// Light: the most dramatic in the world: a vertical column of light from the oculus into her steam, the dome dark above.
// Shapes: the dome's coffer rings, the curving colonnade, the exedra's half-dome; curves throughout.
// Courses: fire (crazed marble, cooked red tide line, scorched bronze), water (steam, scale, the wet floor).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'III');
const W = 1480, H = 480, ROOM = 'baths_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2533, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#3a1e1c' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G;
const MURK = '#241414', LIGHT = '#fff4e0';
const fog = (c, Z, k = 1) => mix(c, '#5a3e3a', Math.max(0, Math.min(0.45, (Z - 8) / 40)) * k);
const T = G.III(fog);
const CX0 = 9, CZ0 = 14, RR = 18, CH = 9, DOME = 10.6;          // the rotunda: centre, radius, column height, dome springing
const ring = (phi, r = RR) => [CX0 + r * Math.cos(phi), CZ0 + r * Math.sin(phi)];
const PHI_EX = 57 * Math.PI / 180;                             // the exedra's bearing (behind the matron as seen)

layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the dome: rings of coffers seen from inside, dark, converging up toward the (unseen) oculus; underlit pink near the beam
{
  for (let ri = 0; ri < 7; ri++) { const th0 = ri * 0.13, th1 = th0 + 0.11; for (let k = 0; k < 40; k++) { const p0 = -0.3 + k * 0.1, p1 = p0 + 0.085;
      const pt = (ph, th) => { const r = RR * Math.cos(th); return [CX0 + r * Math.cos(ph), DOME + 1.6 + RR * 0.9 * Math.sin(th), CZ0 + r * Math.sin(ph)]; };
      const q = [pt(p0, th0), pt(p1, th0), pt(p1, th1), pt(p0, th1)]; if (q.some(p => p[2] < 4)) continue; const ps = q.map(p => P(...p)); if (ps.every(p => p[1] < -5 || p[0] < -20 || p[0] > W + 20)) continue;
      const nearBeam = Math.max(0, 1 - Math.abs(ps[0][0] - 1160) / 500);
      raw(`<path d="${p2(ps)}" fill="${mix('#2a1816', '#6a4038', nearBeam * 0.6)}" stroke="${INK}" stroke-width="1"/>`);
      const inset = ps.map(([x, y], i) => { const c = ps.reduce((a, b) => [a[0] + b[0] / 4, a[1] + b[1] / 4], [0, 0]); return [x + (c[0] - x) * 0.3, y + (c[1] - y) * 0.3]; }); raw(`<path d="${p2(inset)}" fill="${mix('#140a0a', '#4a2a26', nearBeam * 0.5)}"/>`); } }
}
// ---- the drum: an entablature ring round the hall at the dome's foot, its frieze a meander in rubric red, a cornice
{
  const band = (y0, y1, col) => { const pts0 = [], pts1 = []; for (let k = 0; k <= 60; k++) { const ph = -0.4 + k * 0.065, [x, z] = ring(ph); if (z < 4) continue; pts0.push(P(x, y0, z)); pts1.push(P(x, y1, z)); } return `<path d="${p2([...pts0, ...pts1.reverse()])}" fill="${col}" stroke="${INK}" stroke-width="1"/>`; };
  raw(band(CH, CH + 0.7, fog('#8a7470', 25)) + band(CH + 0.7, CH + 1.2, fog('#6a5450', 25)) + band(CH + 1.2, DOME + 1.6, fog('#9a8480', 25)));
  let mq = ''; for (let k = 0; k < 90; k++) { const ph = -0.4 + k * 0.044, [x, z] = ring(ph), [x2, z2] = ring(ph + 0.03); if (z < 4) continue; const a = P(x, CH + 0.8, z), b = P(x2, CH + 1.1, z2); mq += `M${f1(a[0])} ${f1(b[1])} L${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(a[1])} `; } raw(`<path d="${mq}" stroke="${T.BOIL}" stroke-width="1.2" fill="none" opacity="0.7"/>`);
}
// ---- the wall behind the colonnade: marble revetment, dark; the exedra opens in it behind the matron
{
  const pts0 = [], pts1 = []; for (let k = 0; k <= 60; k++) { const ph = -0.4 + k * 0.065, [x, z] = ring(ph, RR + 2.2); if (z < 4) continue; pts0.push(P(x, 0, z)); pts1.push(P(x, CH, z)); }
  raw(`<path d="${p2([...pts0, ...pts1.reverse()])}" fill="${fog('#4a302c', 30)}"/>` + `<path d="${p2([...pts0, ...pts1])}" fill="${S.hatchA(30)}" opacity="0.4"/>`);
  // the exedra: a deep half-round recess, its half-dome gilded with the temple's waves; the spring's bronze mouth; votives
  const [ex, ez] = ring(PHI_EX, RR + 2.4), w = 4.6, top = CH + 1.6;
  const op = G.arch(ex - w, ex + w, CH - 2.2, 'round', { rise: w, n: 14 }); const ops = op.map(([x, y]) => P(x, y, ez));
  raw(`<path d="${p2(ops)}" fill="${fog('#3a2220', 28)}"/>`);
  { const cid = S.id('ex'); raw(`<clipPath id="${cid}"><path d="${p2(ops)}"/></clipPath><g clip-path="url(#${cid})">`);
    // the half-dome's gilded waves: concentric scalloped bands round its crown
    const c = P(ex, CH - 2.2, ez + 3), k = K(ez + 1.5);
    for (let j = 0; j < 7; j++) { const r = k * (0.6 + j * 0.7), pts = []; for (let a = 0; a <= 24; a++) { const t = Math.PI - a / 24 * Math.PI; pts.push([c[0] + Math.cos(t) * r * 1.05 + Math.sin(a * 2.1) * k * 0.08, c[1] - Math.sin(t) * r * 0.95]); } raw(line(pts, Math.max(2, k * 0.25), j % 2 ? T.GILT : mix(T.GILT, '#5a4020', 0.5), 0.9)); }
    for (let j = 0; j < 11; j++) { const a = Math.PI * (j + 0.5) / 11; raw(line([c, [c[0] + Math.cos(a) * k * 5.2, c[1] - Math.sin(a) * k * 5]], 1.4, INK, 0.5)); }
    raw(`<rect x="0" y="${f1(P(0, CH - 2.2, ez)[1])}" width="${W}" height="${H}" fill="${fog('#2a1616', 28)}"/>` + hatch3((s2, t) => [ex - w + s2, t, ez + 2], 0, w * 2, 0, CH - 2.2, 0.8, { op: 0.45 }));
    raw('</g>'); }
  raw(`<path d="${p2(ops)}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + G.ring(op, ez - 0.05, 0.6, fog('#a48c86', 28), { v: 0.6 }));
  // the spring's bronze mouth in the exedra, steaming; a row of the priestesses' bronze basins on tripods before it
  const sp = P(ex, 4.0, ez + 1); raw(cel([[sp[0] - 8, sp[1] - 4], [sp[0] + 8, sp[1] - 4], [sp[0] + 6, sp[1] + 4], [sp[0] - 6, sp[1] + 4]], { Z: ez, fill: T.BRONZE, band: 1.5 }) + G.softSteam(sp[0], sp[1], 80, 16, { n: 5, op: 0.22 }));
  for (const dx of [-3.2, 3.4]) { const b = P(ex + dx, 0, ez - 1.5), k2 = K(ez); raw(line([[b[0], b[1]], [b[0] - k2 * 0.3, b[1] - k2 * 1.3]], 1.4, INK, 1) + line([[b[0], b[1]], [b[0] + k2 * 0.3, b[1] - k2 * 1.3]], 1.4, INK, 1) + cel([[b[0] - k2 * 0.55, b[1] - k2 * 1.3], [b[0] + k2 * 0.55, b[1] - k2 * 1.3], [b[0] + k2 * 0.35, b[1] - k2 * 1.0], [b[0] - k2 * 0.35, b[1] - k2 * 1.0]], { Z: ez, fill: T.BRONZE, band: 1 })); }
}
// ---- the colonnade: tall Ionic columns round the ring, each its own weathering; none in front of the exedra
{
  const cols = []; for (let k = 0; k < 22; k++) { const ph = -0.25 + k * 0.17; if (Math.abs(ph - PHI_EX) < 0.2) continue; const [x, z] = ring(ph); if (z < 5.5 || (z < 11 && x < 2)) continue; const px = P(x, 0, z)[0]; if (px < -60 || px > W + 60) continue; cols.push([x, z]); }
  cols.sort((a, b) => b[1] - a[1]);
  for (const [x, z] of cols) raw(T.column(x, z, CH, 0.55, { tide: 1.2, peel: R() < 0.4 ? 0.3 + R() * 0.4 : 0 }) + hatch3((s2, t) => [x - 0.55 + s2, t, z], 0, 1.1, 0, CH, 0.8, { op: 0.25 + Math.max(0, (x - 0) / 40) * 0.0 }));
}
// ---- polish (Cole): no second basin. The matron sits in her own tub on the floor at the foot of a stepped round dais
// (the old pool's place): three marble steps rising behind her to the cult exedra, their risers crusted with scale where
// her overflow has run down them for a century; on the dais top, the spring's channel and bronze basins.
{
  const DX = 7.5, DZ = 15.5;
  for (let k = 0; k < 3; k++) { const r = 8.5 - k * 1.1, y0 = k * 0.25, y1 = y0 + 0.25, top = [], bot = [];
    for (let j = 0; j <= 56; j++) { const a = Math.PI * 0.95 + j / 56 * Math.PI * 1.1, X = DX + r * Math.cos(a), Z = DZ + r * Math.sin(a) * 0.9; if (Z < 5) continue; top.push(P(X, y1, Z)); bot.push(P(X, y0, Z)); }
    raw(`<path d="${p2([...top, ...bot.reverse()])}" fill="${fog('#8a7470', 14)}" stroke="${INK}" stroke-width="1"/>` + `<path d="${p2([...top, ...bot])}" fill="${S.hatchA(14)}" opacity="0.3"/>`);
    raw(line(top, 1.4, fog('#e0d0c8', 14), 0.6) + line(bot.map(([x, y]) => [x, y - 3]), 2.2, T.SCALE, 0.35));
    const tp = []; for (let j = 0; j <= 56; j++) { const a = j / 56 * 6.283, X = DX + r * Math.cos(a), Z = DZ + r * Math.sin(a) * 0.9; if (Z < 5) continue; tp.push(P(X, y1, Z)); } }
  // the dais top: rings of marble, wet; the spring's channel running from the exedra down to the steps
  const c = P(DX, 0.75, DZ), k = K(DZ); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 6.3)}" ry="${f1(k * 0.35)}" fill="${fog('#a08a86', 15)}" opacity="0.6"/>`);
  raw(line([P(DX + 1.5, 0.76, DZ + 5.5), P(DX + 0.5, 0.76, DZ - 1), P(DX - 1.5, 0.76, DZ - 5.4)], Math.max(2, k * 0.22), '#6a8070', 0.8));
}
const darkVeil = (ops) => { const c = P(5.2, 3.5, 11); for (const [r, op] of ops) { const hole = []; for (let k = 0; k < 22; k++) { const a = k / 22 * 6.283, m = 0.85 + R() * 0.25; hole.push([c[0] + Math.cos(a) * r * m * 1.1, c[1] + Math.sin(a) * r * m * 1.0]); }
  raw(`<path fill-rule="evenodd" d="M-20 -20 H${W + 20} V${H + 20} H-20 Z ${smooth(hole, true, 0.6)}" fill="${MURK}" opacity="${op}"/>`); } };
darkVeil([[220, 0.16], [380, 0.18], [560, 0.2], [760, 0.2]]);
// ---- THE LIGHT: one column of light from the oculus straight down into the pool, through the steam; the steam pillar
{
  const c = P(5.2, 0, 11), w = K(11) * 3.6;   // polish: the column falls onto her
  raw(G.shaft(c[0] - w / 2, -10, w, c[1] + 10, 0, LIGHT, { op: 0.5, fill: 0.26, spread: 12, gap: 3.5 }) + G.shaft(c[0] - w * 0.22, -10, w * 0.44, c[1] + 10, 0, '#ffffff', { op: 0.5, fill: 0.22, spread: 6, gap: 2.5 }));
  for (let i = 0; i < 5; i++) raw(G.softSteam(c[0] + (R() - 0.5) * w * 0.8, c[1] + 10, 340 + R() * 60, 70 + R() * 40, { n: 10, op: 0.12, inkOp: 0.12, drift: (R() - 0.5) * 0.2 }));
  raw(glow(c[0], 140, w * 1.1, 220, LIGHT, 0.25) + glow(c[0], c[1] - 10, w, 60, LIGHT, 0.3));
}
raw(BK.quiet(MURK, 318, 400, { steps: [0.05, 0.06, 0.08, 0.1], hop: 0.08 }));
raw(G.edges(MURK, { l: 280, r: 80, t: 90, steps: [0.18, 0.2, 0.22, 0.24] }));
// ---- the floor: marble laid in rings round the pool, radial joints converging; heat-crazed; wet; a scald line
{
  for (let ri = 0; ri < 14; ri++) { const r0 = 1.4 + ri * 1.25, r1 = r0 + 1.2, nseg = 24 + ri * 6; for (let k = 0; k < nseg; k++) { const a0 = k / nseg * Math.PI * 2, a1 = a0 + Math.PI * 2 / nseg * 0.96;
      const q = [[r0, a0], [r0, a1], [r1, a1], [r1, a0]].map(([r, a]) => [4.2 + r * Math.cos(a), 0, 7.6 + r * Math.sin(a) * 0.95]); if (q.some(p => p[2] < 3.1)) continue; { const mx = (q[0][0] + q[2][0]) / 2, mz = (q[0][2] + q[2][2]) / 2; if (Math.hypot(mx - 7.5, (mz - 15.5) / 0.9) < 8.6) continue; } const ps = q.map(p => P(...p)); if (ps.every(p => p[0] < -20 || p[0] > W + 20) || ps.every(p => p[1] < 300)) continue;
      raw(cel(ps, { Z: q[0][2], fill: tone(ri % 3 === 1 ? '#a08a86' : '#8a7470', 0.12), band: 0.8, tex: 'url(#mottle)', texOp: 0.25, inkW: 0.5, heavy: 0.8, hi: q[0][2] < 9 })); } }
  for (let i = 0; i < 18; i++) { const X = -12 + R() * 20, Z = 3.5 + R() * 6; raw(S.crack((s2, t) => [s2, 0.001, t], X, Z, 0.6 + R(), R() * 6.28, { w: 0.8, lip: '#e8d0c8' })); }
  for (let i = 0; i < 30; i++) { const X = -12 + R() * 20, Z = 4 + R() * 6, [x, y] = P(X, 0, Z), l = K(Z) * (0.3 + R() * 0.8); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="#fff0ea" stroke-width="${f1(Math.max(0.5, K(Z) * 0.012))}" opacity="0.4"/>`); }
  // drain channels cut in the floor, radiating from the tub's foot to grated drains; the scalding overflow running from
  // her tub along them and spreading across the floor in wet tongues, steaming
  const TX = 4.0, TZ = 6.3;
  for (const [ang, len] of [[3.45, 5.5], [3.85, 4.2], [4.25, 3.4]]) { const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10, r = 1.0 + len * u; pts.push([TX - 0.8 + Math.cos(ang + Math.sin(u * 3) * 0.08) * r * 1.2, TZ + Math.sin(ang) * r * 0.75]); }
    const Lp = pts.map(([x, z]) => P(x, 0.001, z - 0.18)), Rp = pts.map(([x, z]) => P(x, 0.001, z + 0.18)); raw(`<path d="${p2([...Lp, ...Rp.reverse()])}" fill="#2a1a18" stroke="${INK}" stroke-width="0.8"/>`);
    const W2 = pts.map(([x, z]) => P(x, 0.002, z)); raw(line(W2, 3, '#7a9a8a', 0.8) + line(W2.map(([x, y]) => [x - 1, y - 1]), 1, '#f0f8f0', 0.6));
    const [ex, ez] = pts[10], g = P(ex, 0.002, ez), gk = K(ez); raw(`<ellipse cx="${f1(g[0])}" cy="${f1(g[1])}" rx="${f1(gk * 0.4)}" ry="${f1(gk * 0.12)}" fill="#120a08" stroke="${INK}" stroke-width="1"/>`); for (let j = -2; j <= 2; j++) raw(line([[g[0] + j * gk * 0.14, g[1] - gk * 0.1], [g[0] + j * gk * 0.15, g[1] + gk * 0.1]], 1.2, T.BRONZE, 1));
    raw(G.softSteam(W2[3][0], W2[3][1], 40, 14, { n: 4, op: 0.14 })); }
  for (let j = 0; j < 8; j++) { const x0 = 2.0 + R() * 4.5, z0 = TZ + 0.2, pts = []; let x = x0, z = z0; for (let k = 0; k < 6; k++) { pts.push(P(x, 0.002, z)); x -= 0.3 + R() * 0.5; z -= 0.15 + R() * 0.25; } raw(line(pts, Math.max(1.5, K(5) * 0.05 * (0.5 + R())), '#8aa89a', 0.55) + line(pts.map(([a, b]) => [a - 1, b - 1]), 0.8, '#f4fff8', 0.5)); }
  raw(S.occBand((s2, t) => [-16 + s2, 0, 3.1 + t], 40, 1.0, { op: 0.35 }));
  darkVeil([[260, 0.12], [460, 0.16], [700, 0.18]]);
}

// ======================================================================== MID: low things on the floor behind the fighters
layer('mid');
{
  // a fallen bronze basin on its side, a broken tripod; folded linens soaked through; a strigil and an oil flask
  const Z = 9.2, b = P(-4.6, 0.2, Z), k = K(Z); raw(`<ellipse cx="${f1(b[0])}" cy="${f1(b[1])}" rx="${f1(k * 0.5)}" ry="${f1(k * 0.22)}" fill="${T.BRONZE}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f1(b[0] + k * 0.1)}" cy="${f1(b[1] - k * 0.02)}" rx="${f1(k * 0.38)}" ry="${f1(k * 0.14)}" fill="#2a1a10"/>`);
  raw(line([P(-3.6, 0.05, Z), P(-2.6, 0.5, Z + 0.3)], 2, INK, 1) + line([P(-3.4, 0.05, Z), P(-2.2, 0.1, Z - 0.2)], 2, INK, 1));
  raw(cel([P(-1.4, 0, Z), P(-0.4, 0, Z), P(-0.5, 0.18, Z), P(-1.3, 0.2, Z)], { Z, fill: '#c8bcb0', band: 1 }) + cel([P(-1.35, 0.2, Z), P(-0.45, 0.18, Z), P(-0.55, 0.3, Z), P(-1.25, 0.32, Z)], { Z, fill: '#d8ccc0', band: 1 }));
}

raw(G.barrel(-0.8, 9.4, { col: '#5a3a2a', hoop: '#3a2a1a', extra: G.softSteam(...P(-0.8, 1.0, 9.4), 30, 8, { n: 4, op: 0.15 }) }));   // scale cue: an attendants' water tub
// ======================================================================== FORE: a near column at the left, a hanging bronze lamp and votive ribbons over the top
layer('fore');
{
  raw(T.column(-3.95, 3.3, 7, 0.42, { tide: 1.0 }));
  // a bronze hanging lamp on chains, cold, from the top left; votive ribbons tied to its chain
  const top = [330, -10], c = [360, 92]; raw(line([top, c], 2, INK, 1) + line([[c[0] - 26, c[1]], [top[0], 10], [c[0] + 26, c[1]]], 1.4, INK, 1));
  raw(cel([[c[0] - 30, c[1]], [c[0] + 30, c[1]], [c[0] + 20, c[1] + 18], [c[0] - 20, c[1] + 18]], { Z: 3, fill: T.BRONZE, band: 4, tex: 'url(#mottle)', texOp: 0.4 }) + `<path d="M${c[0] - 30} ${c[1]} L${c[0] + 30} ${c[1]}" stroke="${INK}" stroke-width="3"/>`);
  for (let k = 0; k < 4; k++) raw(`<path d="M${c[0] - 22 + k * 14} ${c[1] + 18} l0 ${f1(6 + R() * 10)}" stroke="${T.SCALE}" stroke-width="2" opacity="0.7"/>`);
  for (const [cx, sd] of [[60, -1], [W - 50, 1]]) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([cx + sd * (t - 0.5) * 180, H - 8 - Math.sin(t * Math.PI) * (18 + R() * 8)]); } raw(G.rockMass([[cx - 100, H + 4], ...pts, [cx + 100, H + 4]], 3.5, '#2a1a18', { fiss: 3, hop: 0.55 })); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, x_to: 1480 } }, null, 1));
console.log(ROOM, 'layers written');
