// World VII, the Icebound Fleet: THE FROZEN DECK (battle room, Living Ink). Room key 'fleet_deck'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Frozen Deck (whalers at their stations, frozen to the rails), Gull Rookery (the gulls have the rigging).
// The place: the weather deck of the flagship at night, looking across the ship to the larboard rail. The mainmast stands
// behind the company; its shrouds fan down to the far channel in a black web against moonlit cloud, gulls roosting along
// the ratlines and on the frozen sail. Over the rail the masts and rigging of the rest of the line stand in rows into the
// dark. A moon in a break of the cloud, high and left, is the only light: it silvers the rime, the snow on the hammock
// nettings and the glazed deck. The whalers' gear: a harpoon rack at the mast, line tubs, a whaleboat in its davits hung
// out over the rail. Courses: FROST (rime, icicles, the glazed deck, snow); WATER (a hammock of a drowned man burst at the
// netting, the deck swollen and split, frozen bilge pumped up through the scuppers).
// Palette: black hull and spars, grey-blue rigging, moon-white; no warm colour, no eyes, no gold, no red.
// Usage: node scenes/bg_fleet_deck.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VII');
const W = 1480, H = 480, ROOM = 'fleet_deck';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 7202, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#e8f0f8', shadowTint: '#0e141c' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack } = S;
const G = require('./battle_kit_g3')(S, { air: '#3a4656', murk: '#101620' });
const { BK, BL, air, clouds, glare, wedges, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, box, post, beam } = BK;

const MOON = '#eef4f8', RIME = '#c8d4de', SNOW = '#d4dee6', RIG = '#4a5a6c', SPAR = '#16181c', DECK = '#2c3440', MURK = '#101620', NIGHT = '#1c2430';
const ZB = 13.0;                                    // the far (larboard) bulwark's inner face
const MX = 1.4, MZ = 9.2;                           // the mainmast
// a gull at rest, sitting (screen x,y at its feet; s = body length px): pale body, grey back, black wingtip, a beak; frost
function gull(x, y, s, o = {}) {
  const d = o.dir || (R() < 0.5 ? -1 : 1), b = [[x - s * 0.5 * d, y - s * 0.25], [x - s * 0.1 * d, y - s * 0.5], [x + s * 0.35 * d, y - s * 0.45], [x + s * 0.55 * d, y - s * 0.62], [x + s * 0.72 * d, y - s * 0.6], [x + s * 0.62 * d, y - s * 0.42], [x + s * 0.45 * d, y - s * 0.2], [x, y - s * 0.05], [x - s * 0.7 * d, y - s * 0.12]];
  let g = fillS(b, o.col || '#c8d0d6', 1, 0.4) + fillS([[x - s * 0.55 * d, y - s * 0.28], [x + s * 0.2 * d, y - s * 0.45], [x + s * 0.25 * d, y - s * 0.25], [x - s * 0.75 * d, y - s * 0.12]], o.back || '#7a8694', 1, 0.4) + fillP([[x - s * 0.62 * d, y - s * 0.2], [x - s * 0.95 * d, y - s * 0.12], [x - s * 0.7 * d, y - s * 0.08]], '#0e1014');
  g += `<path d="${smooth(b, true, 0.4)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.06))}"/>` + pline([[x + s * 0.72 * d, y - s * 0.58], [x + s * 0.92 * d, y - s * 0.55]], Math.max(0.6, s * 0.06), '#8a8a7a');
  if (s > 6) g += `<circle cx="${f1(x + s * 0.6 * d)}" cy="${f1(y - s * 0.55)}" r="${f1(s * 0.035)}" fill="${INK}"/>`;
  return g;
}

// ======================================================================== FAR
layer('far');
// ---- the night sky: slate blue, a break in the cloud round the moon high on the left; moonlit cloud rims
{
  raw(`<rect width="${W}" height="${H}" fill="${NIGHT}"/>` + G.skyGrad([[0, '#0e131a'], [0.4, '#1a222e'], [0.75, '#2a3442'], [1, '#323e4c']], { y0: 0, y1: 320 }));
  // one moon, one smooth halo
  raw(G.radGlow(470, 96, 300, 230, '#7a8ca0', 0.6, { mid: 0.22, midOp: 0.4 }));
  raw(`<circle cx="470" cy="96" r="17" fill="${MOON}"/><circle cx="470" cy="96" r="17" fill="url(#mottle)" opacity="0.25"/><path d="M462 90 q4 -3 8 0 M474 102 q3 2 6 -1 M466 104 q2 1 4 0" stroke="#a8b4c0" stroke-width="1.4" fill="none" opacity="0.6"/>`);
  // cloud with form: long banks of stratocumulus lying in layers (wide, flat, ragged), their tops toward the moon
  // silvered, their bellies dark; thinner and lower toward the horizon; the moon in a clear break between two banks
  const bank = (cx, cy, w, h, near) => { const top = [], bot = []; const n = 22; for (let i = 0; i <= n; i++) { const t = i / n, x = cx - w / 2 + w * t, env = Math.pow(Math.sin(Math.PI * t), 0.6); top.push([x, cy - h * env * (0.55 + 0.45 * Math.abs(Math.sin(t * 7 + cx))) ]); bot.push([x, cy + h * 0.35 * env + Math.sin(t * 11 + cy) * 2]); }
    const poly = [...top, ...bot.slice().reverse()], d = smooth(poly, true, 0.5);
    let o = `<path d="${d}" fill="${mix('#1c2430', '#2e3a48', near * 0.6)}" opacity="0.95" filter="url(#soft)"/>`;
    o += `<path d="${smooth(bot.map(([x, y]) => [x, y - h * 0.12]), false, 0.5)}" stroke="#0e131a" stroke-width="${f1(h * 0.45)}" fill="none" opacity="0.6" filter="url(#soft)"/>`;
    o += `<path d="${smooth(top.slice(1, -1).map(([x, y]) => [x, y + 2]), false, 0.5)}" stroke="${mix('#3a4656', '#c8d6e4', near)}" stroke-width="${f1(1 + near * 2.4)}" fill="none" opacity="${f1(0.4 + near * 0.5)}"/>`;
    o += `<path d="${smooth(top, false, 0.5)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.15"/>`;
    return o; };
  for (const [cx, cy, w, h] of [[160, 46, 620, 70], [1040, 40, 860, 80], [760, 168, 600, 46], [1300, 140, 560, 50], [120, 200, 460, 30], [980, 238, 720, 22], [400, 254, 520, 16], [1380, 264, 380, 14]]) { const near = Math.max(0, 1 - Math.hypot(cx - 470, (cy - 96) * 1.8) / 650); raw(bank(cx, cy, w, h, near)); }
}
// ---- the distance: the rest of the line beyond the rail, masts and yards and rigging in rows going away into the dark
{
  for (const [X, Z, n] of [[-60, 120, 3], [-34, 80, 3], [20, 95, 3], [-8, 58, 3], [44, 70, 3], [62, 140, 3]]) {
    const col = air('#0e1014', Z, { z0: 20, z1: 160, max: 0.55 });
    for (let j = 0; j < n; j++) { const mx = X + j * 9 * (Z / 60), b = P(mx, -1, Z), t = P(mx, 36, Z), kz = K(Z);
      raw(line([b, t], Math.max(0.8, kz * 0.6), col));
      for (const [fr, yw] of [[0.42, 6], [0.62, 4.8], [0.8, 3.4]]) { const y = -1 + 37 * fr, a = P(mx - yw, y, Z), c = P(mx + yw, y, Z); raw(pline([a, c], Math.max(0.7, kz * 0.25), col) + fillS([[a[0], a[1]], [c[0], c[1]], [c[0] - 1, c[1] + kz * 0.35], [a[0] + 1, a[1] + kz * 0.4]], col, 0.85) + BL.icicles([a[0], a[1] + kz * 0.4], [c[0], c[1] + kz * 0.4], 5, { max: kz * 0.6, col: air(RIME, Z, { to: '#3a4656', z0: 20, z1: 160, max: 0.6 }) })); }
      for (const sg of [-1, 1]) for (let i = 0; i < 4; i++) raw(line([P(mx + 0.2 * sg, 28, Z), P(mx + sg * (1.5 + i * 0.9), 0, Z + 3)], 0.5, col, 0.7)); }
  }
}
// ---- the whaleboat hung out in its davits over the far rail (left), the davits' curved iron arms, frozen falls
{
  const Z = ZB + 1.6, k = K(Z);
  for (const X of [-9.5, -4.5]) { const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(P(X + Math.sin(t * 1.4) * 1.1, 1.2 + t * 2.9 - Math.pow(t, 3) * 0.4, Z - 1.2 + t * 1.2)); } raw(line(pts, Math.max(2, k * 0.12) + 1.4, INK) + line(pts, Math.max(1.2, k * 0.12), '#4a5664') + BL.rimeEdge(pts.slice(3).map(([x, y]) => [x - 1, y - 1]), { w: 1.6, col: RIME }));
    const tip = pts[10]; raw(line([tip, [tip[0] + 1, tip[1] + k * 0.9]], 1, RIG) + BL.icicles([tip[0] - 4, tip[1] + 2], [tip[0] + 4, tip[1] + 2], 3, { max: 10, col: RIME })); }
  const a = P(-10.4, 3.0, Z + 0.2), b = P(-3.6, 3.1, Z + 0.2);
  // a double-ended whaleboat: the sheer rising to both pointed ends, the keel's curve under it
  const sh = [], kl = []; for (let i = 0; i <= 12; i++) { const t = i / 12, x = a[0] + (b[0] - a[0]) * t, e = Math.pow(2 * t - 1, 2); sh.push([x, a[1] - k * (0.15 + 0.35 * e)]); kl.push([x, a[1] + k * (0.5 - 0.5 * Math.pow(Math.abs(2 * t - 1), 1.6)) - k * 0.15 * e]); }
  const hull = [...sh, ...kl.slice().reverse()];
  raw(cel(hull, { Z, fill: '#2e353e', band: 3, tex: 'url(#mottle)', texOp: 0.4 }) + pline(sh.map(([x, y]) => [x, y + k * 0.12]), 1, INK, 0.6) + BL.rimeEdge(sh.slice(0, 8), { w: 2.4, col: SNOW }) + BL.icicles(kl[3], kl[9], 10, { max: k * 0.6, col: RIME }));
  for (let i = 0; i < 4; i++) raw(pline([[a[0] + (b[0] - a[0]) * (0.2 + i * 0.2), a[1] - k * 0.2], [a[0] + (b[0] - a[0]) * (0.2 + i * 0.2), b[1] + k * 0.4]], 0.7, INK, 0.6));
  // harpoons and lances still racked in the boat, their irons rimed
  for (let i = 0; i < 4; i++) { const x0 = a[0] + (b[0] - a[0]) * (0.3 + i * 0.12); raw(line([[x0, a[1] - k * 0.15], [x0 + k * (0.9 + i * 0.1), a[1] - k * (0.9 + i * 0.12)]], 1.4, INK) + line([[x0, a[1] - k * 0.15], [x0 + k * (0.9 + i * 0.1), a[1] - k * (0.9 + i * 0.12)]], 0.7, '#5a5a58')); }
  for (let i = 0; i < 5; i++) raw(gull(a[0] + (b[0] - a[0]) * (0.15 + i * 0.18), a[1] - k * 0.22 + (i % 2), 9 + R() * 3));
}
// ---- the far shrouds: from the masthead (above the frame) fanning down to the far channel; ratlines; gulls roosting on them
{
  const top = P(MX + 0.1, 19, MZ), dl = [];
  for (let i = 0; i < 7; i++) { const X = MX - 3.6 + i * 1.2, d = P(X, 2.1, ZB + 0.6); dl.push([X, d]);
    raw(line([d, top], Math.max(1.4, K(ZB) * 0.05) + 1, INK, 0.9) + line([d, top], Math.max(1, K(ZB) * 0.05), RIG));
    raw(BL.rimeEdge([[d[0] - 1.5, d[1] - 4], [d[0] + (top[0] - d[0]) * 0.35 - 1.5, d[1] + (top[1] - d[1]) * 0.35]], { w: 1.4, col: RIME })); }
  // ratlines: short sagging rungs between the shrouds, icicles hanging off them like the teeth of a comb
  for (let r = 1; r < 26; r++) { const t = r / 34, pts = dl.map(([X, d]) => [d[0] + (top[0] - d[0]) * t, d[1] + (top[1] - d[1]) * t]); if (pts[0][1] < -5) break;
    for (let i = 0; i < pts.length - 1; i++) { if (R() < 0.06) continue; const a = pts[i], b = pts[i + 1], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1.5]; raw(line([a, m, b], 0.9, RIG, 0.9)); if (R() < 0.45) raw(BL.icicles([a[0] + 2, a[1] + 1], [b[0] - 2, b[1] + 1], 2, { max: 4 + R() * 8, col: RIME })); if (R() < 0.12) raw(gull(m[0] + (R() - 0.5) * 6, m[1] + 0.5, 8 + R() * 3, { col: '#b0bac4' })); } }
  // deadeyes and lanyards at the channel
  for (const [X, d] of dl) raw(`<ellipse cx="${f1(d[0])}" cy="${f1(d[1])}" rx="3" ry="3.8" fill="#24262a" stroke="${INK}" stroke-width="0.7"/>` + pline([[d[0], d[1] + 3], [d[0] - 0.5, d[1] + 12]], 1.2, INK));
}
// ---- the mainmast: a great built mast with iron hoops, rimed on its windward (left) side, the moon catching it; the
// fife rail round its foot with belaying pins and frozen coils; harpoons racked against it
{
  const k = K(MZ), r = 0.46, x0 = P(MX - r, 0, MZ)[0], x1 = P(MX + r, 0, MZ)[0];
  const col = '#1c1e22';
  raw(fillP([[x0, -5], [x1, -5], [x1, P(0, 0, MZ)[1]], [x0, P(0, 0, MZ)[1]]], col) + `<path d="M${f1(x0)} -5 L${f1(x1)} -5 L${f1(x1)} ${f1(P(0, 0, MZ)[1])} L${f1(x0)} ${f1(P(0, 0, MZ)[1])} Z" fill="url(#mottle)" opacity="0.35"/>`);
  raw(fillP([[x0 + (x1 - x0) * 0.55, -5], [x1, -5], [x1, P(0, 0, MZ)[1]], [x0 + (x1 - x0) * 0.6, P(0, 0, MZ)[1]]], S.hatchA(MZ), 0.6) + fillP([[x0 + (x1 - x0) * 0.75, -5], [x1, -5], [x1, P(0, 0, MZ)[1]], [x0 + (x1 - x0) * 0.78, P(0, 0, MZ)[1]]], S.hatchB(MZ), 0.5));
  raw(line([[x0 + (x1 - x0) * 0.2, -5], [x0 + (x1 - x0) * 0.2, P(0, 0.8, MZ)[1]]], (x1 - x0) * 0.12, '#5a6878', 0.6));
  for (let y = 4; y < P(0, 1.0, MZ)[1]; y += 26 + R() * 18) raw(pline([[x0 - 1, y], [x1 + 1, y + 2]], 4.4, INK) + pline([[x0, y], [x1, y + 2]], 2.4, '#3a3e44') + pline([[x0, y - 1.2], [x0 + (x1 - x0) * 0.4, y - 0.6]], 1, '#a8b8c8', 0.7));
  raw(BL.rimeEdge(Array.from({ length: 16 }, (_, i) => [x0 - 1, -5 + i * (P(0, 0.9, MZ)[1] + 5) / 15]).reverse(), { w: 3.4, col: RIME }));
  for (let y = 20; y < 220; y += 40 + R() * 30) raw(BL.icicles([x0 - 2, y], [x1 + 2, y + 2], 5, { max: 18, col: RIME }));
  // white guano streaks down the mast from the gulls above, frozen
  for (let i = 0; i < 7; i++) { const x = x0 + (x1 - x0) * R(), y = -5 + R() * 60, l = 30 + R() * 80; raw(line([[x, y], [x + (R() - 0.5) * 3, y + l * 0.5], [x + (R() - 0.5) * 4, y + l]], 1 + R() * 1.6, '#d8dde0', 0.5)); }
  // harpoons and a lance leaning against the mast, their irons rimed
  for (let i = 0; i < 5; i++) { const b = P(MX - 1.0 + i * 0.12, 0, MZ - 0.6), t = P(MX - 0.5 + i * 0.05, 2.6 + R() * 0.3, MZ - 0.5); raw(line([b, t], 2.4, INK) + line([b, t], 1.2, '#4a4844') + line([t, [t[0] + 1, t[1] - K(MZ) * 0.3]], 2.6, INK) + line([t, [t[0] + 1, t[1] - K(MZ) * 0.3]], 1.4, '#6a7078') + BL.rimeEdge([[t[0] - 1, t[1]], [t[0], t[1] - K(MZ) * 0.3]], { w: 1.2, col: RIME })); }
  // the fife rail: a timber rail on stanchions round the foot, pins with frozen coils hanging
  const fr = [P(MX - 1.6, 0.95, MZ - 0.9), P(MX + 1.7, 0.95, MZ - 0.9)];
  raw(pline(fr, 6, INK) + pline(fr, 4, '#2a2c30') + BL.rimeEdge([[fr[0][0], fr[0][1] - 2.5], [fr[1][0], fr[1][1] - 2.5]], { w: 2.4, col: SNOW }));
  for (const X of [MX - 1.5, MX - 0.2, MX + 1.6]) { const a = P(X, 0, MZ - 0.9), b = P(X, 0.95, MZ - 0.9); raw(pline([a, b], 5, INK) + pline([a, b], 3, '#24262a')); }
  for (let i = 0; i < 7; i++) { const X = MX - 1.4 + i * 0.5, p = P(X, 1.0, MZ - 0.95); raw(pline([[p[0], p[1] + 3], [p[0], p[1] - 6]], 2, INK)); if (i % 2 === 0) { const c = [p[0], p[1] + 10], rr = 5 + R() * 3; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rr * 0.6)}" ry="${f1(rr)}" fill="none" stroke="${INK}" stroke-width="2.8"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rr * 0.6)}" ry="${f1(rr)}" fill="none" stroke="#5a6676" stroke-width="1.4"/>` + BL.icicle(c[0], c[1] + rr, 6 + R() * 6, 1.5, { col: RIME })); } }
}
// ---- the far bulwark: its inner planking, timberheads, a gun at its port, the rail, the hammock nettings with snow
{
  const at = (s, t) => [-24 + s, t, ZB];
  raw(S.boards((s, t) => at(s, t), 48, 1.45, '#262c34', { bw: 0.2, knots: 0.15, stains: 0.2, nails: true, vary: 0.1 }));
  raw(hatch3(at, 0, 48, 0, 1.45, 0.8, { op: 0.4 }) + hatch3(at, 0, 48, 0, 0.9, -0.7, { op: 0.35 }));
  for (let X = -22; X < 22; X += 2.2 + R() * 0.3) raw(post(X, ZB - 0.12, 0.1, 0, 1.55, '#1e2024', { shadeOp: 0.5, grain: false }));
  // the gun at its port, run out, a carronade on its slide with the slide running back toward us (converging)
  { const X = 7.5, pa = P(X - 0.4, 0.45, ZB - 0.02), pb = P(X + 0.4, 1.15, ZB - 0.02); raw(fillP([[pa[0], pb[1]], [pb[0], pb[1]], [pb[0], pa[1]], [pa[0], pa[1]]], '#0c1016') + fillP([[pa[0] + 2, pb[1] + 2], [pb[0] - 2, pb[1] + 2], [pb[0] - 2, pa[1] - 6], [pa[0] + 2, pa[1] - 6]], '#3a4656', 0.6));
    raw(box(X - 0.25, X + 0.25, 0, 0.42, ZB - 2.4, ZB - 0.1, { col: '#24262a', shadeOp: 0.5 }) + box(X - 0.22, X + 0.22, 0.45, 0.85, ZB - 1.6, ZB - 0.2, { col: '#1a1c20', shadeOp: 0.5 }) + BL.rimeEdge([P(X - 0.22, 0.86, ZB - 1.6), P(X - 0.22, 0.86, ZB - 0.2)], { w: 1.4, col: SNOW })); }
  // the rail cap and the hammock nettings above it: the crew's rolled hammocks stowed in netting, snow lying thick on top,
  // one burst open where its drowned sleeper swelled
  const rail = [P(-24, 1.5, ZB - 0.1), P(24, 1.5, ZB - 0.1)];
  raw(pline(rail, 7, INK) + pline(rail, 5, '#24272c'));
  // the rolls are lashed hammocks of their own sizes, sagging and leaning, dark under the netting; the snow lies on top
  // as one long drift that dips between them
  const tops = [];
  for (let X = -23; X < 23;) { const w = 0.45 + R() * 0.6, hh = 0.42 + R() * 0.25, lean = (R() - 0.5) * 0.15, a = P(X, 1.55, ZB), b = P(X + w, 1.55 + hh, ZB);
    const q = [[a[0] + 2, a[1]], [a[0] + lean * 20, a[1] - (a[1] - b[1]) * 0.55], [a[0] + 4 + lean * 30, b[1] + 1], [(a[0] + b[0]) / 2 + lean * 30, b[1] - 1], [b[0] - 3 + lean * 30, b[1] + 2], [b[0] + lean * 20, a[1] - (a[1] - b[1]) * 0.5], [b[0] - 2, a[1]]];
    raw(cel(q, { Z: ZB, fill: tone('#323a44', 0.12), band: 2.2, hi: false }) + pline([[a[0] + (b[0] - a[0]) * 0.3, a[1] - 1], [a[0] + (b[0] - a[0]) * 0.32 + lean * 20, b[1] + 3]], 0.8, INK, 0.5));
    tops.push(q[2], q[3], q[4]); X += w + 0.01; }
  raw(BL.rimeEdge(tops, { w: 3, col: SNOW }));
  { let nt = ''; for (let X = -24; X < 24; X += 0.3) { const a = P(X, 1.55, ZB - 0.05), b = P(X + 0.3, 2.2, ZB - 0.05); nt += `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} M${f1(b[0])} ${f1(a[1])} L${f1(a[0])} ${f1(b[1])} `; } raw(`<path d="${nt}" stroke="${INK}" stroke-width="0.6" opacity="0.4"/>`); }
  // the burst hammock: a sewn bundle swollen, split, a pale wrinkled hand hanging out, icicles from it
  { const a = P(-1.8, 2.0, ZB - 0.2), k = K(ZB); raw(fillS([[a[0] - k * 0.5, a[1] + 4], [a[0] - k * 0.4, a[1] - k * 0.25], [a[0] + k * 0.5, a[1] - k * 0.3], [a[0] + k * 0.6, a[1] + 4]], '#5a6068') + pline([[a[0] - k * 0.3, a[1] - k * 0.1], [a[0] + k * 0.35, a[1] - k * 0.15]], 1.2, INK) + line([[a[0] + k * 0.1, a[1]], [a[0] + k * 0.14, a[1] + k * 0.35], [a[0] + k * 0.1, a[1] + k * 0.5]], 5, INK) + line([[a[0] + k * 0.1, a[1]], [a[0] + k * 0.14, a[1] + k * 0.35], [a[0] + k * 0.1, a[1] + k * 0.5]], 3, '#a8b0b4') + BL.icicles([a[0] + k * 0.02, a[1] + k * 0.55], [a[0] + k * 0.2, a[1] + k * 0.55], 3, { max: 9, col: RIME })); }
  // icicles hanging from the rail over the inner planking, long, and frozen bilge water in a sheet under the scuppers
  raw(BL.icicles([rail[0][0], rail[0][1] + 3], [rail[1][0], rail[1][1] + 3], 70, { max: 22, col: RIME, wk: 0.12 }));
}
// ---- the quiet band: stepped toward the night murk behind the fighters
raw(BL.quiet(MURK, 238, 370, { steps: [0.12, 0.14, 0.16, 0.18], hop: 0.16 }));
// ---- the deck: planks running along the ship (across the frame), glazed with ice that catches the moon in streaks; the
// gun slides and ringbolts and a grating running toward the far side; snow drifted against the bulwark and the mast
{
  const at = (s, t) => [-22 + s, 0, 4.2 + t], Ls = 44, Lt = ZB - 4.2;
  raw(S.boards(at, Ls, Lt, DECK, { bw: 0.14, knots: 0.1, stains: 0.15, nails: true, vary: 0.1 }));
  raw(fillP([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)].map(p => P(...p)), '#3a4a5c', 0.3));
  raw(hatch3(at, 0, Ls, 0, Lt, 0.3, { op: 0.25, gap: 1.3 }));
  // ice glaze: broken moonlit streaks lying along the planks, brightest under the moon's line
  for (let i = 0; i < 70; i++) { const X = -14 + R() * 26, Z = 4.6 + Math.pow(R(), 0.8) * 8, a = P(X, 0.01, Z), l = K(Z) * (0.4 + R() * 1.4), near = Math.max(0, 1 - Math.abs(X + 3) / 10); raw(`<path d="M${f1(a[0] - l / 2)} ${f1(a[1])} l${f1(l)} ${f1((R() - 0.5) * 0.8)}" stroke="#b4c4d4" stroke-width="${f1(Math.max(0.6, K(Z) * 0.012))}" opacity="${f1(0.15 + near * 0.5 * R())}"/>`); }
  // a grating hatch in perspective (its bars run toward the far side)
  { const x0 = -7.4, x1 = -5.2, z0 = 7.4, z1 = 9.6; raw(fillP([P(x0, 0.02, z0), P(x1, 0.02, z0), P(x1, 0.02, z1), P(x0, 0.02, z1)], '#121418')); for (let i = 0; i <= 8; i++) { const X = x0 + (x1 - x0) * i / 8; raw(pline([P(X, 0.03, z0), P(X, 0.03, z1)], 1.4, '#2e3238')); } for (let i = 0; i <= 8; i++) { const Z = z0 + (z1 - z0) * i / 8; raw(pline([P(x0, 0.03, Z), P(x1, 0.03, Z)], 1.0, '#2e3238')); } raw(inkP([P(x0, 0.02, z0), P(x1, 0.02, z0), P(x1, 0.02, z1), P(x0, 0.02, z1)], 1.6) + BL.rimeEdge([P(x0, 0.05, z0), P(x1, 0.05, z0)], { w: 2, col: SNOW })); }
  // ringbolts and the gun slides' tracks across the deck toward the ports (converge)
  for (const X of [-12.5, 2.6, 13.5]) { raw(pline([P(X - 0.3, 0.01, 6), P(X - 0.3, 0.01, ZB - 0.2)], 1.2, INK, 0.55) + pline([P(X + 0.3, 0.01, 6), P(X + 0.3, 0.01, ZB - 0.2)], 1.2, INK, 0.55)); const r = P(X, 0.01, 7.2); raw(`<ellipse cx="${f1(r[0])}" cy="${f1(r[1])}" rx="4" ry="1.2" fill="none" stroke="${INK}" stroke-width="1.4"/>`); }
  // snow drifted against the bulwark foot and round the mast, with lit crests
  for (let X = -22; X < 22; X += 1.6 + R() * 1.4) { const Z = ZB - 0.4 - R() * 0.6, w = 1.4 + R() * 1.6, pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(P(X + w * t, Math.sin(t * Math.PI) * (0.18 + R() * 0.1), Z)); } raw(fillS([P(X, 0, Z), ...pts, P(X + w, 0, Z)], '#7a8a9a', 0.75) + line(pts.slice(1, 5), 0.9, '#c8d4de', 0.6)); }
  // the deck split along a seam where the sea froze in the timber below (water swells, frost bursts)
  raw(crack((s, t) => [s, 0.005, t], -16, 7.8, 7, 0.02, { w: 1, lip: '#9aaabc', op: 0.75, branch: 1 }));
  raw(occBand((s, t) => [-30 + s, 0, 4.2 + t], 60, 1.0, { op: 0.35 }));
}
// falling snow over the far (fine, slanted)
raw(snowfall(160, { len: 2.2, slant: 0.45, op: 0.5, y1: 300, col: '#c8d4e0' }));

// ======================================================================== MID: low, dark things on the deck behind the fighters
layer('mid');
{
  // whale-line tubs, a coil of line frozen in its tub, a dropped block, a bucket frozen to the deck (low and dark)
  const Z = 10.4;
  for (const [X, r] of [[-11.5, 0.38], [-10.6, 0.3]]) { const c = P(X, 0, Z), k = K(Z); raw(cel([[c[0] - k * r, c[1]], [c[0] - k * r * 0.95, c[1] - k * 0.5], [c[0] + k * r * 0.95, c[1] - k * 0.5], [c[0] + k * r, c[1]]], { Z, fill: '#2a2e34', band: 2 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - k * 0.5)}" rx="${f1(k * r * 0.95)}" ry="${f1(k * r * 0.18)}" fill="#3a4250" stroke="${INK}" stroke-width="0.8"/>` + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - k * 0.52)}" rx="${f1(k * r * 0.6)}" ry="${f1(k * r * 0.1)}" fill="none" stroke="#5a6676" stroke-width="1.2"/>` + BL.rimeEdge([[c[0] - k * r * 0.95, c[1] - k * 0.52], [c[0] + k * r * 0.3, c[1] - k * 0.56]], { w: 1.4, col: SNOW })); for (const yy of [0.15, 0.38]) raw(pline([[c[0] - k * r, c[1] - k * yy], [c[0] + k * r, c[1] - k * yy]], 1.4, INK, 0.7)); }
  { const c = P(10.5, 0, 9.6), k = K(9.6); raw(cel([[c[0] - k * 0.2, c[1]], [c[0] - k * 0.17, c[1] - k * 0.3], [c[0] + k * 0.17, c[1] - k * 0.3], [c[0] + k * 0.2, c[1]]], { Z: 9.6, fill: '#2a2e34', band: 1.5 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - k * 0.3)}" rx="${f1(k * 0.17)}" ry="${f1(k * 0.04)}" fill="#8a9aaa"/>`); }
  { const c = P(-3.8, 0.1, 10.8), k = K(10.8); raw(cel(blob(c[0], c[1], k * 0.16, k * 0.11, 9, 0.2), { Z: 10.8, fill: '#2e3036', band: 1.4 }) + line([[c[0] + k * 0.1, c[1]], [c[0] + k * 0.8, c[1] + 2], [c[0] + k * 1.4, c[1] + 1]], 1.6, '#4a5666')); }
  // the frozen bodies of gulls that fell from the yards (small, pale on the dark deck)
  for (const [X, Z] of [[-8.2, 9.8], [5.6, 10.6], [12.2, 11.2]]) { const c = P(X, 0, Z); raw(gull(c[0], c[1] + 2, K(Z) * 0.32, { col: '#7a8490', back: '#4a5460' })); }
}

// ======================================================================== FORE: framing over the fighters
layer('fore');
{
  // left: the mizzenmast's foot close by, black, hooped, rimed on its windward edge; belaying pins with frozen coils
  const x0 = -16, x1 = 58;
  raw(fillP([[x0, -5], [x1, -5], [x1 - 4, H + 5], [x0, H + 5]], '#0c0e10') + fillP([[x0 + (x1 - x0) * 0.6, -5], [x1, -5], [x1 - 4, H + 5], [x0 + (x1 - x0) * 0.6, H + 5]], S.hatchA(4), 0.5));
  for (let y = 30; y < H; y += 70 + R() * 40) raw(pline([[x0, y], [x1 + 1, y + 3]], 7, INK) + pline([[x0, y], [x1, y + 3]], 4, '#2a2e34') + pline([[x0, y - 2], [x1 * 0.6, y - 1]], 1.2, '#8a9cb0', 0.6));
  raw(BL.rimeEdge(Array.from({ length: 20 }, (_, i) => [x1 - 2 - i * 0.2, H - i * (H + 10) / 19]), { w: 5, col: RIME }));
  for (const y of [70, 190, 320]) raw(BL.icicles([x0, y + 4], [x1, y + 7], 6, { max: 34, col: RIME }));
  // top right: the main course broken loose from its gaskets and frozen as it fell, a stiff grey curtain hanging from
  // out of frame, hung with icicles; the gulls have it: a row roosting on its upper fold, guano streaked down it
  const sl = [[930, -10], [W + 10, -10], [W + 10, 150], [1430, 168], [1360, 132], [1270, 156], [1160, 112], [1060, 92], [980, 54]];
  raw(cel(sl, { Z: 4, fill: '#5a6470', tex: 'url(#mottle)', texOp: 0.4, band: 7 }) + fillP(sl, S.hatchA(4), 0.3));
  for (let i = 0; i < 7; i++) { const x = 990 + i * 70 + R() * 20; raw(line([[x, -5], [x + 8 + R() * 10, 60 + i * 10 + R() * 30]], 1.4, INK, 0.5) + line([[x + 3, -5], [x + 10 + R() * 10, 50 + i * 10 + R() * 30]], 1.6, '#8a96a2', 0.5)); }
  raw(BL.rimeEdge(sl.slice(3).map(([x, y]) => [x, y - 2]).reverse(), { w: 3, col: RIME }) + BL.icicles([980, 56], [1060, 94], 6, { max: 40, col: RIME }) + BL.icicles([1160, 114], [1270, 158], 7, { max: 54, col: RIME }) + BL.icicles([1360, 134], [1430, 170], 5, { max: 46, col: RIME }));
  for (let i = 0; i < 8; i++) { const x = 1000 + i * 58 + R() * 10; raw(line([[x, 20 + i * 6], [x + 2, 70 + i * 8 + R() * 30]], 2 + R() * 2, '#e0e6ea', 0.55)); }
  for (let i = 0; i < 9; i++) { const x = 960 + i * 54 + R() * 14, y = 12 + (x - 930) * 0.04; raw(gull(x, y, 15 + R() * 5, { dir: i % 3 ? -1 : 1 })); }
  // bottom: snow and ice drifted at the deck's front edge, a frozen line snaking across the bottom right
  { const bank = []; for (let k = 0; k <= 12; k++) bank.push([W - 360 + k * 32, H - 8 - Math.sin(k / 12 * Math.PI) * 18 - R() * 5]); raw(cel([[W - 370, H + 4], ...bank, [W + 10, H + 4]], { Z: 3.6, fill: '#5a6a7a', band: 4 }) + BL.rimeEdge(bank, { w: 3, col: SNOW })); }
  raw(line([[W - 420, H + 4], [W - 330, H - 14], [W - 220, H - 6], [W - 120, H - 22], [W + 10, H - 12]], 9, INK) + line([[W - 420, H + 4], [W - 330, H - 14], [W - 220, H - 6], [W - 120, H - 22], [W + 10, H - 12]], 6, '#5a6676'));
  raw(snowfall(110, { len: 4, slant: 0.45, op: 0.55, col: '#c8d4e0', w: 1.6 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
