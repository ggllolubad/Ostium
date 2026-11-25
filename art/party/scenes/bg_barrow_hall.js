// World IX, the Hollow Barrow: THE BURIAL HALL (round 2 upgrade, battle room, Living Ink). Room key 'barrow_hall'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Burial Hall (the household, still at the table), The Thane's Barrow (a lord with his household).
// The place: the household's timber hall, buried under the mound when the kingdom buried itself alive. Round 2: the empty
// grave-throne is gone from here (the king's own resting place is the boss room, barrow_boss). The centrepiece is now the
// funeral feast: along the back wall the high table stands on its raised dais, and the household sits at it still, frozen
// grey in their best clothes, mould furring them, heads fallen forward or thrown back, one with a cup still raised. The
// funeral candles down the table froze mid-flame; their flames are pale ice and give the hall its only light, cold and
// white, lighting the dead faces from below. The roof bows under the barrow: heavy split logs laid from the wall plate up
// over us, earth and roots pushing between them. In the long wall the doorway is walled up from within (the mason's rough
// stones, a lime plague cross). The thane's own seat at the table's middle is high-backed (he stands among the foes).
// Courses: FROST (grey rime in the hollows, frozen candles, icicles from the roof); TOXIN (grey-green mould fur, caps,
// plague sores, the bloom on the feast). Palette: grey-green frost, bone, mould, timber and earth; no gold, no warm light.
// Usage: node scenes/bg_barrow_hall.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IX');
const W = 1480, H = 480, ROOM = 'barrow_hall';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 9101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e2620' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#141a16', murk: '#0d100e' });
const { BK, BL, air, glare, plates } = G;
const { fog, line, pline, fillP, fillS, inkP, blob, jag, lump, box, post, beam, icicles, rime, mould, bracket, caps, pustules, steam, quiet } = BK;

const TIM = '#4e4a3e', TIMD = '#2e2c26', EARTH = '#2e2a22', MOULD = '#7c8c62', MOULDD = '#4a5638', FROST = '#c4d0c4', BONE = '#d2cab2', LINEN = '#b4ae9a', IRON = '#3a3a38', SILV = '#8a8e88', STONE = '#5c605a', MURK = '#0d100e', FLAME = '#e8f2f0', SKIN = '#8e968a';
const ZW = 14, WT = 3.3;                         // the long wall, and its top (the wall plate)
const atW = (s, t) => [-22 + s, t, ZW];
const POSTS = [-16.5, -10.5, -4.5, 1.5, 7.5, 13.5];
const DOOR = [-12.6, -10.2];                     // the walled-up doorway, left of the dais
const DZ = 12.4, DH = 1.5, DX0 = -8.2, DX1 = 12.5; // the dais: front edge, height, extent
const TZ = 12.9, TY = DH + 0.78;                 // the high table's front edge and top
const frostPatch = (cx, cy, rx, ry, op = 0.5) => fillS(blob(cx, cy, rx, ry, 12, 0.5), FROST, op * 0.5) + fillS(blob(cx, cy, rx * 0.6, ry * 0.6, 10, 0.5), mix(FROST, '#fff', 0.3), op * 0.4);
// the candles' cold light: a surface near the table takes a pale tint (bone-white), falling off with distance
const cand = (c, p, k = 1) => { const d = Math.hypot((p[0] - 2) / 9, p[1] - TY - 0.3, (p[2] - TZ) / 2.5); return mix(c, '#c8d4cc', Math.max(0, Math.min(0.4, (1 - d) * 0.5)) * k); };
// a root hanging through the roof
function root(x, y, len, w, o = {}) {
  const pts = [[x, y]]; let cx = x, cy = y, a = Math.PI / 2 + (R() - 0.5) * 0.3; const n = 8;
  for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.5; a = Math.PI / 2 + (a - Math.PI / 2) * 0.8; cx += Math.cos(a) * len / n; cy += Math.sin(a) * len / n; pts.push([cx, cy]); }
  const L = [], Rr = []; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], pr = pts[Math.max(0, i - 1)], dx = q[0] - pr[0], dy = q[1] - pr[1], l = Math.hypot(dx, dy) || 1, ww = w * (1 - i / pts.length * 0.85); L.push([p[0] - dy / l * ww, p[1] + dx / l * ww]); Rr.push([p[0] + dy / l * ww, p[1] - dx / l * ww]); }
  const col = o.col || '#7a7262';
  let s = `<path d="${smooth([...L, ...Rr.reverse()], true, 0.5)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, w * 0.35))}"/>`;
  s += line(pts.slice(0, -2).map(([px, py]) => [px - w * 0.3, py]), Math.max(0.4, w * 0.3), mix(col, '#f0ecdc', 0.45), 0.6);
  let hr = ''; for (let i = 1; i < pts.length; i++) if (R() < 0.6) { const [px, py] = pts[i], l = w * (2 + R() * 4), sg = R() < 0.5 ? -1 : 1; hr += `M${f1(px)} ${f1(py)} q${f1(sg * l * 0.5)} ${f1(l * 0.3)} ${f1(sg * l * 0.7)} ${f1(l)} `; }
  s += `<path d="${hr}" stroke="${mix(col, INK, 0.3)}" stroke-width="0.5" fill="none" opacity="0.8"/>`;
  if (o.rime) s += rime(pts.slice(0, 4).map(([px, py]) => [px - w, py]), 8, { th: w * 0.9, op: 0.8, col: FROST });
  if (o.branch && len > 40) { const k = 2 + Math.floor(R() * 4); s += root(pts[k][0], pts[k][1], len * 0.45, w * 0.55, { col }); }
  return s;
}
// one of the household at the table: seated behind it, frozen, grey, mould-furred; pose: 0 upright, 1 head fallen on the
// table, 2 head thrown back, 3 cup raised; robe colour from the household's faded best clothes
function diner(X, pose, robe, kind = 0) {
  const Z = TZ + 0.45, sz = kind === 4 ? 0.72 : 1.18 + R() * 0.22, k = K(Z) * sz, b = P(X, TY - 0.05, Z), lean = pose === 1 ? 0.35 : pose === 2 ? -0.18 : (R() - 0.5) * 0.1, sh = k * 0.24;
  const tw = k * (0.2 + R() * 0.1), th = k * (0.55 + R() * 0.1);
  const top = [b[0] + lean * th, b[1] - th];
  const torso = [[b[0] - tw, b[1] + 2], [top[0] - sh, top[1] + k * 0.06], [top[0] - sh * 0.4, top[1] - k * 0.02], [top[0] + sh * 0.4, top[1] - k * 0.02], [top[0] + sh, top[1] + k * 0.06], [b[0] + tw, b[1] + 2]];
  let s = cel(torso, { Z, fill: cand(robe, [X, TY + 0.3, Z]), band: Math.max(1, k * 0.05), tex: 'url(#mottle)', texOp: 0.4 });
  for (let i = 0; i < 3; i++) s += pline([[b[0] - tw * 0.6 + i * tw * 0.6, b[1]], [top[0] - sh * 0.5 + i * sh * 0.5, top[1] + k * 0.08]], 0.6, INK, 0.45);
  // the head: grey, sunken, frost in the hollows; fallen forward (low, on the arms), thrown back (tilted), or upright
  const hc = pose === 1 ? [top[0] + k * 0.12, top[1] + k * 0.14] : [top[0] + (pose === 2 ? -k * 0.06 : 0), top[1] - k * 0.13];
  const hr = k * 0.11, ha = pose === 2 ? -0.5 : pose === 1 ? 0.9 : (R() - 0.5) * 0.3;
  const hd = blob(hc[0], hc[1], hr * 0.85, hr, 10, 0.12, ha);
  s += cel(hd, { Z, fill: cand(SKIN, [X, TY + 0.5, Z], 1.4), band: Math.max(1, hr * 0.3) });
  if (pose !== 1) s += `<ellipse cx="${f1(hc[0] - hr * 0.3)}" cy="${f1(hc[1] - hr * 0.05)}" rx="${f1(hr * 0.18)}" ry="${f1(hr * 0.14)}" fill="#1a1e1a"/><ellipse cx="${f1(hc[0] + hr * 0.25)}" cy="${f1(hc[1] - hr * 0.05)}" rx="${f1(hr * 0.17)}" ry="${f1(hr * 0.13)}" fill="#1a1e1a"/>` + pline([[hc[0] - hr * 0.25, hc[1] + hr * 0.5], [hc[0] + hr * 0.2, hc[1] + hr * 0.48]], 0.8, '#1a1e1a');
  // what each wears on the head: a hood of grave linen, a warrior's conical helm, a woman's headcloth, bare and balding,
  // or the child's loose hair; every one different
  if (kind === 1) s += cel([[hc[0] - hr * 1.15, hc[1] + hr * 0.9], [hc[0] - hr * 1.2, hc[1] - hr * 0.3], [hc[0] - hr * 0.4, hc[1] - hr * 1.25], [hc[0] + hr * 0.6, hc[1] - hr * 1.15], [hc[0] + hr * 1.15, hc[1] - hr * 0.2], [hc[0] + hr * 1.1, hc[1] + hr * 0.9], [hc[0] + hr * 0.7, hc[1] + hr * 0.2], [hc[0] - hr * 0.7, hc[1] + hr * 0.2]], { Z, fill: cand(mix(LINEN, '#5a5a4e', 0.5), [X, TY + 0.5, Z]), band: 1.5 });
  else if (kind === 2) s += cel([[hc[0] - hr * 1.05, hc[1] - hr * 0.2], [hc[0], hc[1] - hr * 1.6], [hc[0] + hr * 1.05, hc[1] - hr * 0.2]], { Z, fill: cand('#4a4c48', [X, TY + 0.5, Z]), band: 1.5 }) + pline([[hc[0], hc[1] - hr * 0.25], [hc[0], hc[1] + hr * 0.45]], Math.max(1, hr * 0.18), '#3a3c38');
  else if (kind === 3) s += cel([[hc[0] - hr * 1.1, hc[1] + hr * 0.3], [hc[0] - hr * 0.9, hc[1] - hr * 0.9], [hc[0] + hr * 0.5, hc[1] - hr * 1.1], [hc[0] + hr * 1.1, hc[1] - hr * 0.1], [hc[0] + hr * 1.4, hc[1] + hr * 1.3]], { Z, fill: cand('#b8b4a0', [X, TY + 0.5, Z]), band: 1.5 });
  else if (kind === 4) s += line([[hc[0] - hr, hc[1] - hr * 0.3], [hc[0] - hr * 1.1, hc[1] + hr * 0.8]], hr * 0.5, '#3a3428', 0.9) + line([[hc[0] + hr * 0.9, hc[1] - hr * 0.3], [hc[0] + hr, hc[1] + hr * 0.7]], hr * 0.4, '#3a3428', 0.9);
  s += frostPatch(hc[0] - hr * 0.3, hc[1] - hr * 0.5, hr * 0.6, hr * 0.25, 0.8);
  if (R() < 0.5) s += mould(hc[0] + hr * 0.2, hc[1] + hr * 0.7, hr * 0.6, hr * 0.4, { col: MOULD, n: 8 });
  // the arms on the table, the hands grey; one raises a cup (pose 3)
  for (const sg of [-1, 1]) { const sp = [top[0] + sg * sh * 0.9, top[1] + k * 0.1], hp = pose === 3 && sg > 0 ? [top[0] + k * 0.3, top[1] - k * 0.22] : [b[0] + sg * tw * 0.7 + k * 0.1, b[1] + 1]; s += line([sp, [(sp[0] + hp[0]) / 2 + sg * 2, (sp[1] + hp[1]) / 2 + 2], hp], k * 0.09 + 1.2, INK) + line([sp, [(sp[0] + hp[0]) / 2 + sg * 2, (sp[1] + hp[1]) / 2 + 2], hp], k * 0.09, cand(robe, [X, TY, Z])) + `<ellipse cx="${f1(hp[0])}" cy="${f1(hp[1])}" rx="${f1(k * 0.05)}" ry="${f1(k * 0.035)}" fill="${cand(SKIN, [X, TY, Z])}" stroke="${INK}" stroke-width="0.5"/>`;
    if (pose === 3 && sg > 0) s += cel([[hp[0] - k * 0.04, hp[1]], [hp[0] + k * 0.04, hp[1]], [hp[0] + k * 0.06, hp[1] - k * 0.12], [hp[0] - k * 0.06, hp[1] - k * 0.12]], { Z, fill: SILV, band: 1 }) + BL.icicles([hp[0] - k * 0.04, hp[1] + 1], [hp[0] + k * 0.04, hp[1] + 1], 2, { max: k * 0.06, col: FROST }); }
  s += mould(b[0] + (R() - 0.5) * tw, b[1] - th * (0.3 + R() * 0.4), k * 0.1, k * 0.14, { col: MOULD, n: 10 });
  if (R() < 0.4) s += caps(b[0] + tw * 0.6, top[1] + k * 0.12, k * 0.12, Z, { col: mix(BONE, MURK, 0.2), n: 3 });
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the roof: heavy split logs laid from the wall plate up over us (they run toward us, converging), sagging under the
// barrow; between them earth pushing through with roots; a cracked rafter shored with a raw trunk
{
  const zr = Z => WT + (ZW - Z) * 0.72;
  const at = (s, t) => [-30 + s, zr(ZW - t), ZW - t];
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, 9), at(0, 9)])}" fill="${EARTH}"/>`);
  // the logs: each a half-round split log from the plate toward us, its lit upper-left edge, its dark lower right, bark
  // ends and splits; the sag of the barrow's weight bows each a little
  for (let X = -26; X < 26; X += 0.34 + R() * 0.06) {
    if (R() < 0.05) { X += 0.3; continue; }
    const pts = [], pts2 = []; for (let i = 0; i <= 10; i++) { const t = 9 * i / 10, sag = Math.sin(i / 10 * Math.PI) * 0.18 * (0.6 + 0.4 * Math.sin(X)); const p = at(X + 30, t); pts.push(P(p[0] - 0.13, p[1] - sag, p[2])); pts2.push(P(p[0] + 0.13, p[1] - sag, p[2])); }
    const poly = [...pts, ...pts2.slice().reverse()], col = mix(TIMD, '#4a4436', R() * 0.5);
    raw(fillP(poly, col) + line(pts, 0.7, mix(col, '#a8a090', 0.4), 0.6) + line(pts2, Math.max(0.6, inkW(10) * 1.2), INK, 0.9));
  }
  raw(hatch3(at, 0, 60, 0, 9, 0.6, { op: 0.45 }) + hatch3(at, 0, 60, 0, 9, -0.8, { op: 0.35 }));
  // earth bulging through where logs have split apart, frost on its edges, roots in clumps out of each
  for (let k = 0; k < 12; k++) { const X = -20 + R() * 40, t = 0.6 + R() * 5.5, c = P(...at(X + 30, t)), r = K(ZW - t) * (0.3 + R() * 0.4);
    raw(lump(blob(c[0], c[1], r, r * 0.35, 12, 0.55), ZW - t, '#3a3428', { band: 3 }) + frostPatch(c[0] - r * 0.3, c[1] - r * 0.15, r * 0.6, r * 0.18, 0.6));
    for (let j = 0; j < 3 + Math.floor(R() * 4); j++) raw(root(c[0] + (R() - 0.5) * r * 1.4, c[1] + r * 0.2, K(ZW - t) * (0.5 + R() * 1.4), Math.max(1.4, K(ZW - t) * (0.035 + R() * 0.03)), { branch: true, rime: R() < 0.3 })); }
  // the rafters over the posts: round logs, heavier, rimed on their windward edges, icicles off them
  for (const X of [...POSTS, -22.5, 19.5]) { const A = [X, WT, ZW - 0.1], Bt = [X, zr(ZW - 9), ZW - 9]; raw(beam(A, Bt, 0.36, mix(TIM, MURK, 0.45)) + rime([P(X - 0.18, WT + 0.3, ZW - 0.5), P(X - 0.18, zr(ZW - 3), ZW - 3), P(X - 0.18, zr(ZW - 7), ZW - 7)], 12, { th: 2.2, op: 0.7, col: FROST }) + icicles([P(X + 0.18, zr(ZW - 2), ZW - 2), P(X + 0.18, zr(ZW - 6), ZW - 6)], 10, { len: 14, dens: 0.8, col: FROST, shadow: '#5e6c62' })); }
  // the cracked rafter over the dais, shored with a raw trunk standing on the dais
  { const X = 4.5, M = [X, zr(ZW - 3.2) - 0.5, ZW - 3.2], m = P(...M); raw(beam([X - 0.3, DH, ZW - 1.0], [X + 0.1, M[1] - 0.1, ZW - 3.0], 0.34, mix('#3a3428', '#6a5e48', 0.3), { chip: true }) + pline([[m[0] - 8, m[1] - 4], [m[0] - 2, m[1] + 2], [m[0] + 4, m[1] - 3], [m[0] + 9, m[1] + 1]], 1.6, INK) + pline([[m[0] - 6, m[1] - 2], [m[0], m[1] + 4], [m[0] + 6, m[1]]], 1, '#d8ccb0', 0.6)); }
  // more roots hanging through between the logs, long, in clumps
  for (let k = 0; k < 60; k++) { const X = -20 + R() * 40, t = 0.6 + R() * 6, [x, y] = P(...at(X + 30, t)); if (y < -10 || y > 190) continue; const Z = ZW - t; raw(root(x, y, K(Z) * (0.6 + R() * 1.4), Math.max(1.2, K(Z) * (0.03 + R() * 0.03)), { rime: R() < 0.35, branch: R() < 0.4, col: R() < 0.5 ? '#7a7262' : '#6a6656' })); }
}
// ---- the long wall: upright staves, the wall plate, carved posts; mould rising; hangings of the household gone grey
{
  raw(S.boards((s, t) => [-22 + t, s, ZW], WT, 44, fog('#55503f', ZW, 0.5), { bw: 0.24, segs: 1, knots: 0.3, stains: 0.3, nails: false }));
  raw(hatch3(atW, 0, 44, 0, WT, 0.8, { op: 0.4, ragged: 0.25 }));
  for (let k = 0; k < 9; k++) { const X = -20 + R() * 40, c = P(X, 2.6 + R() * 0.6, ZW); raw(mould(c[0], c[1], 10 + R() * 18, 6 + R() * 10, { col: MOULD })); }
  for (let k = 0; k < 12; k++) { const X = -20 + R() * 40, c = P(X, WT - 0.15, ZW); raw(frostPatch(c[0], c[1], 20 + R() * 20, 4 + R() * 3, 0.7)); }
  raw(beam([-22, WT, ZW - 0.1], [22, WT, ZW - 0.1], 0.3, fog(TIM, ZW, 0.5)) + rime(Array.from({ length: 30 }, (_, k) => P(-22 + k * 44 / 29, WT + 0.16, ZW - 0.12)), ZW, { th: 2.0, col: FROST, op: 0.6 }));
  raw(icicles(Array.from({ length: 30 }, (_, k) => P(-22 + k * 44 / 29, WT - 0.15, ZW - 0.12)), ZW, { len: 12, dens: 0.6, col: FROST, shadow: '#5e6c62' }));
  for (const X of POSTS) {
    raw(post(X, ZW - 0.3, 0.2, 0, WT, fog(TIM, ZW, 0.4), { shadeOp: 0.45 }));
    for (const Y of [2.6, 1.0]) { const a = P(X - 0.2, Y, ZW - 0.5), b2 = P(X + 0.2, Y + 0.4, ZW - 0.5); let d = ''; for (let k = 0; k < 4; k++) { const y = a[1] + (b2[1] - a[1]) * k / 4; d += `M${f1(a[0])} ${f1(y)} C${f1(a[0] + 6)} ${f1(y - 6)} ${f1(b2[0] - 6)} ${f1(y + 4)} ${f1(b2[0])} ${f1(y - 3)} `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.7"/>`); }
    raw(rime([P(X - 0.2, 0.4, ZW - 0.5), P(X - 0.2, 1.6, ZW - 0.5), P(X - 0.2, 3.0, ZW - 0.5)].reverse(), ZW, { th: 2.2, col: FROST, op: 0.7 }));
  }
  // the household's banners hung above the table between the posts: long cloths gone grey-green, frozen stiff, mould
  for (const [x0, x1] of [[-3.8, -1.8], [2.6, 4.4], [8.6, 10.4]]) { const q = [P(x0, WT - 0.1, ZW - 0.12), P(x1, WT - 0.1, ZW - 0.12), P(x1 - 0.1, TY + 0.9, ZW - 0.12), P((x0 + x1) / 2, TY + 0.7, ZW - 0.12), P(x0 + 0.1, TY + 0.9, ZW - 0.12)]; raw(cel(q, { Z: ZW, fill: cand('#4a5444', [(x0 + x1) / 2, 2.6, ZW]), band: 2, tex: 'url(#mottle)', texOp: 0.5 }) + mould((q[0][0] + q[1][0]) / 2, q[3][1] - 8, 10, 6, { col: MOULD }) + BL.icicles(q[4], q[3], 3, { max: 8, col: FROST }) + BL.icicles(q[3], q[2], 3, { max: 8, col: FROST })); }
}
// ---- THE SEALED DOOR at the left: the doorway walled up from within, rough stones in slopped mortar, the lime cross
{
  const [xa, xb] = DOOR, dt = 2.6, Z = ZW - 0.2, at = (s, t) => [xa + s, t, Z];
  raw(S.ashlar(at, xb - xa, dt, fog(STONE, ZW, 0.6), { scale: 0.5, rough: true, roughP: 0.7, vary: 0.3, mortar: 0.3, lost: 0.05, chip: 0.7, spall: 0.1 }));
  for (let k = 0; k < 16; k++) { const s = R() * (xb - xa), t = R() * dt, c = P(...at(s, t)); raw(fillS(blob(c[0], c[1], 3 + R() * 5, 1.2 + R() * 1.5, 8, 0.6), '#9a9888', 0.7)); }
  const cc = P(...at((xb - xa) / 2, 1.85)), k = K(Z) * 1.2;
  raw(`<path d="M${f1(cc[0])} ${f1(cc[1] - k * 0.6)} L${f1(cc[0] + 2)} ${f1(cc[1] + k * 0.55)} M${f1(cc[0] - k * 0.45)} ${f1(cc[1] - k * 0.05)} L${f1(cc[0] + k * 0.45)} ${f1(cc[1] - k * 0.1)}" stroke="#c8c8b8" stroke-width="${f1(k * 0.09)}" stroke-linecap="round" opacity="0.6"/>`);
  for (let i = 0; i < 4; i++) { const x = cc[0] - k * 0.4 + R() * k * 0.8, y = cc[1] - k * 0.05; raw(pline([[x, y], [x + 0.5, y + k * (0.1 + R() * 0.25)]], 1.2, '#c8c8b8', 0.45)); }
  raw(post(xa - 0.12, Z - 0.05, 0.12, 0, dt + 0.2, fog(TIM, ZW, 0.4)) + post(xb + 0.12, Z - 0.05, 0.12, 0, dt + 0.2, fog(TIM, ZW, 0.4)) + beam([xa - 0.3, dt + 0.1, Z - 0.2], [xb + 0.3, dt + 0.1, Z - 0.2], 0.26, fog(TIM, ZW, 0.45)));
  for (const Y of [0.6, 1.9]) { const a = P(xa - 0.12, Y, Z - 0.2); raw(pline([[a[0], a[1]], [a[0] + 9, a[1]]], 3, INK) + pline([[a[0], a[1]], [a[0] + 9, a[1]]], 1.6, '#4a4440')); }
  raw(rime([P(xa - 0.3, dt + 0.24, Z - 0.2), P(xb + 0.3, dt + 0.24, Z - 0.2)], ZW, { th: 2.4, col: FROST }));
}
// ---- THE FEAST: the dais along the back wall, the high table on it, the household seated at it frozen; the thane's
// high-backed seat empty at the middle; the funeral candles frozen mid-flame lighting the dead from below
{
  // the dais: a timber platform with a stepped front, its face planked, its edge rimed; steps at the middle
  raw(box(DX0, DX1, 0, DH, DZ, ZW - 0.3, { col: fog('#3e3a30', DZ, 0.5), shadeOp: 0.5 }));
  raw(S.boards((s, t) => [DX0 + s, t, DZ - 0.01], DX1 - DX0, DH, fog('#3e3a30', DZ, 0.4), { bw: 0.25, knots: 0.15, nails: true, vary: 0.15 }));
  raw(hatch3((s, t) => [DX0 + s, t, DZ - 0.02], 0, DX1 - DX0, 0, DH, 0.8, { op: 0.45 }));
  raw(rime([P(DX0, DH + 0.02, DZ), P(DX1, DH + 0.02, DZ)], DZ, { th: 2, col: FROST, op: 0.7 }));
  for (let i = 0; i < 4; i++) { const y0 = DH * i / 4, z0 = DZ - 1.0 + i * 0.25; raw(box(1.2, 3.0, y0, y0 + DH / 4, z0, DZ, { col: fog('#4a4436', z0, 0.5), shadeOp: 0.45 }) + rime([P(1.2, y0 + DH / 4 + 0.02, z0), P(3.0, y0 + DH / 4 + 0.02, z0)], z0, { th: 1.4, col: FROST, op: 0.6 })); }
  // the thane's high seat: a tall carved back at the table's middle, empty, frost in the seat
  { const X = 2.1, q = [P(X - 0.5, DH, ZW - 0.5), P(X + 0.5, DH, ZW - 0.5), P(X + 0.45, DH + 2.3, ZW - 0.5), P(X, DH + 2.55, ZW - 0.5), P(X - 0.45, DH + 2.3, ZW - 0.5)]; raw(cel(q, { Z: ZW, fill: cand(fog(TIM, ZW, 0.3), [X, DH + 1.5, ZW]), band: 2, tex: 'url(#mottle)', texOp: 0.4 }) + rime(q.slice(2).reverse(), ZW, { th: 2.4, col: FROST }));
    let d = ''; for (let k = 0; k < 7; k++) { const t = k / 7, a = P(X - 0.35, DH + 0.5 + t * 1.6, ZW - 0.52), b2 = P(X + 0.35, DH + 0.5 + t * 1.6, ZW - 0.52); d += `M${f1(a[0])} ${f1(a[1])} q${f1((b2[0] - a[0]) / 2)} -4 ${f1(b2[0] - a[0])} 0 `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.6"/>`); }
  // the household seated behind the table
  const robes = ['#5a6454', '#6a6658', '#4a5048', '#7a7464', '#545a50', '#665e50', '#4e5a52', '#706a5a'];
  let ri = 0; for (let X = DX0 + 0.8; X < DX1 - 0.4; X += 0.92 + R() * 0.5) { if (Math.abs(X - 2.1) < 0.6) continue; if (R() < 0.14) { X += 0.4; continue; } raw(diner(X, [0, 1, 2, 3, 1, 0, 2, 1][ri % 8], robes[(ri * 3) % 8], [1, 0, 3, 2, 4, 1, 3, 0, 2, 3][ri % 10])); ri++; }
  // the table: its top seen a little from below (we are under the dais), the board's front edge, linen hanging
  { const a = P(DX0 + 0.3, TY, TZ), b = P(DX1 - 0.3, TY, TZ), th = K(TZ) * 0.08; raw(fillP([a, b, [b[0], b[1] + th], [a[0], a[1] + th]], cand('#3a3428', [2, TY, TZ])) + inkP([a, b, [b[0], b[1] + th], [a[0], a[1] + th]], 1));
    // the cloth hanging over the front, grey linen, its hem frozen in folds, mould spreading in it
    const hem = []; for (let i = 0; i <= 40; i++) { const t = i / 40; hem.push([a[0] + (b[0] - a[0]) * t, a[1] + th + K(TZ) * (0.3 + 0.08 * Math.sin(i * 1.7) + 0.04 * Math.sin(i * 4.3))]); }
    raw(fillP([[a[0], a[1] + th], [b[0], b[1] + th], ...hem.slice().reverse()], cand(mix(LINEN, '#5a5a4e', 0.45), [2, TY - 0.2, TZ], 0.8)) + fillP([[a[0], a[1] + th], [b[0], b[1] + th], ...hem.slice().reverse()], 'url(#mottle)', 0.5) + line(hem, 1, INK, 0.8));
    for (let i = 0; i < 40; i += 3) raw(pline([[hem[i][0], a[1] + th + 1], [hem[i][0] + 1, hem[i][1] - 1]], 0.6, INK, 0.4));
    for (let i = 0; i < 6; i++) raw(mould(a[0] + R() * (b[0] - a[0]), a[1] + th + K(TZ) * 0.2, 8 + R() * 10, 3 + R() * 2, { col: MOULD, n: 10 }));
    raw(BL.icicles(hem[0], hem[40], 30, { max: K(TZ) * 0.08, col: FROST })); }
  // the feast on the table: platters, a boar's head gone to mould, bread furred, cups, and the funeral candles with flames
  // frozen solid, pale ice, each with its cold glare; the light focus of the room
  for (let X = DX0 + 1.2; X < DX1 - 1; X += 1.9 + R() * 0.6) {
    const c = P(X, TY + 0.02, TZ + 0.15), k = K(TZ);
    raw(GLOW(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - k * 0.4)}" rx="${f1(k * 1.3)}" ry="${f1(k * 0.7)}" fill="#e0ece8" opacity="0.16" filter="url(#soft)"/>`));
    raw(glare(c[0], c[1] - k * 0.58, k * 0.08, '#eef4f0', { steps: [[1.6, 0.2], [1.0, 0.3]], sx: 1, sy: 1.3, jag: 0.4 }));
    raw(cel([[c[0] - k * 0.04, c[1]], [c[0] + k * 0.04, c[1]], [c[0] + k * 0.04, c[1] - k * 0.4], [c[0] - k * 0.04, c[1] - k * 0.4]], { Z: TZ, fill: BONE, band: 0.8 }) + BL.icicles([c[0] - k * 0.04, c[1] - k * 0.2], [c[0] + k * 0.04, c[1] - k * 0.2], 2, { max: k * 0.12, col: '#e8ece0' }));
    const fl = [[c[0] - k * 0.04, c[1] - k * 0.4], [c[0] - k * 0.05, c[1] - k * 0.55], [c[0] + k * 0.006, c[1] - k * 0.72], [c[0] + k * 0.05, c[1] - k * 0.53], [c[0] + k * 0.04, c[1] - k * 0.4]];
    raw(EM(fillS(fl, FLAME, 1, 0.5) + fillS(fl.map(([x, y]) => [c[0] + (x - c[0]) * 0.5, y + k * 0.03]), '#ffffff', 1, 0.5)) + `<path d="${smooth(fl, true, 0.5)}" fill="none" stroke="#5a6e6a" stroke-width="0.7"/>` + pline([[c[0] - k * 0.01, c[1] - k * 0.5], [c[0], c[1] - k * 0.64]], 0.6, '#8aa8a4', 0.8));
    if (R() < 0.7) { const p = P(X + 0.8, TY + 0.02, TZ + 0.25), r = K(TZ) * 0.16; raw(`<ellipse cx="${f1(p[0])}" cy="${f1(p[1])}" rx="${f1(r)}" ry="${f1(r * 0.25)}" fill="${SILV}" stroke="${INK}" stroke-width="0.6"/>` + mould(p[0], p[1] - r * 0.2, r * 0.6, r * 0.25, { col: MOULD, n: 8 })); }
  }
  // the boar's head on its platter in front of the empty seat, furred grey-green, caps sprouting
  { const c = P(2.1, TY + 0.1, TZ + 0.2), k = K(TZ); raw(cel(blob(c[0], c[1] - k * 0.1, k * 0.26, k * 0.15, 12, 0.2), { Z: TZ, fill: cand('#6a6454', [2, TY, TZ]), band: 2 }) + mould(c[0], c[1] - k * 0.12, k * 0.2, k * 0.1, { col: MOULD }) + caps(c[0] + k * 0.1, c[1] - k * 0.2, k * 0.14, TZ, { col: BONE, n: 3 })); }
}
// ---- the floor: trodden earth frozen hard, strewn rushes gone grey, lime from a slit sack by the sealed door; frost
{
  const Z0 = 4, Z1 = DZ;
  raw(`<path d="${pp([[-40, 0, Z0], [40, 0, Z0], [40, 0, Z1], [-40, 0, Z1]])}" fill="${mix('#3a3830', MURK, 0.45)}"/>` + `<path d="${pp([[-40, 0, Z0], [40, 0, Z0], [40, 0, Z1], [-40, 0, Z1]])}" fill="url(#mottle)" opacity="0.5"/>`);
  raw(S.strew((s, t) => [-30 + s, 0, 4 + t], 0, 60, 0, 8.3, 700, { cols: ['#4a4a40', '#5a584a', '#3e3e36', '#6a685a'], len: 0.35 }));
  for (let k = 0; k < 10; k++) { const c = P(-18 + R() * 36, 0, 5 + R() * 7); raw(frostPatch(c[0], c[1], 20 + R() * 30, 3 + R() * 3, 0.35)); }
  { const c = P(-11.0, 0, 12.6); raw(fillS(blob(c[0] + 10, c[1] + 3, 46, 6, 14, 0.5), '#b8b8aa', 0.35)); }
  // the old hearth's long kerb running across the floor toward the dais (its stones converge), cold, rimed
  for (let Z = 6.6; Z < DZ - 0.6; Z += 0.42) for (const dx of [-0.6, 0.6]) { const c = P(-2.4 + dx, 0.08, Z), r = K(Z) * 0.14; raw(lump(blob(c[0], c[1] - r * 0.3, r, r * 0.5, 8, 0.4), Z, mix(fog(STONE, Z, 0.6), MURK, 0.35), { band: 1 })); }
  raw(S.occBand((s, t) => [-40 + s, 0, DZ - t], 80, 1.2, { op: 0.4, cross: true }));
  raw(hatch3((s, t) => [-40 + s, 0, 4 + t], 0, 80, 0, 1.4, 0.25, { op: 0.35, ragged: 0.3 }));
}
raw(quiet([[300, 0.1], [330, 0.12], [360, 0.12]], { hop: 0.14 }));
for (const [cx, cy, r] of [[0, 0, 520], [W, 0, 480], [0, H, 380]]) for (const k of [1, 0.75, 0.5]) raw(fillS(blob(cx, cy, r * k, r * k * 0.8, 14, 0.25), MURK, 0.16));
// frozen spores hanging in the air, catching the candle light near the table
{ let m = ''; for (let k = 0; k < 110; k++) { const x = R() * W, y = R() * 300; m += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.4 + R() * 0.9)}" fill="${R() < 0.6 ? FROST : '#a8b88a'}" opacity="${f1(0.12 + R() * 0.3)}"/>`; } raw(m); }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
{
  // the hearth's cauldron fallen on its side, frozen contents spilled; a bench overturned; the mason's lime bucket
  const Z = 9.4, c = P(-2.0, 0.32, Z), r = K(Z) * 0.34;
  raw(cel(blob(c[0], c[1], r, r * 0.8, 14, 0.06), { Z, fill: mix(fog(IRON, Z, 0.5), MURK, 0.3), band: 4 }) + `<ellipse cx="${f1(c[0] + r * 0.85)}" cy="${f1(c[1] + r * 0.1)}" rx="${f1(r * 0.18)}" ry="${f1(r * 0.7)}" fill="#1a1c18" stroke="${INK}" stroke-width="1"/>` + fillS(blob(c[0] + r * 1.8, c[1] + r * 0.7, r * 1.2, r * 0.18, 10, 0.4), mix(FROST, MURK, 0.4), 0.8));
  raw(box(4.2, 6.6, 0, 0.16, 10.2, 10.6, { col: mix(TIM, MURK, 0.5), shadeOp: 0.5 }) + box(4.4, 4.6, 0.16, 0.5, 10.2, 10.35, { col: mix(TIM, MURK, 0.5), shadeOp: 0.5 }));
  { const Z2 = 12.0, c2 = P(-9.0, 0.2, Z2), r2 = K(Z2) * 0.16; raw(cel([[c2[0] - r2, c2[1] - r2], [c2[0] + r2, c2[1] - r2], [c2[0] + r2 * 0.8, c2[1] + r2 * 1.3], [c2[0] - r2 * 0.8, c2[1] + r2 * 1.3]], { Z: Z2, fill: mix('#4a4030', MURK, 0.35), band: 1.5 }) + `<ellipse cx="${f1(c2[0])}" cy="${f1(c2[1] - r2)}" rx="${f1(r2)}" ry="${f1(r2 * 0.25)}" fill="#9a9a8c" stroke="${INK}" stroke-width="0.7"/>`); }
}

// ======================================================================== FORE: framing at the edges
layer('fore');
{
  // left: a near carved roof post, rimed on its windward side, furred with mould and shelf fungus, roots past it
  const Z = 4.2, X = -4.7;
  raw(post(X, Z, 0.26, -1, 8, mix(TIM, '#0a0a08', 0.55), { shadeOp: 0.55 }));
  { let d = ''; for (const Y of [3.4, 2.8, 2.2]) { const a = P(X - 0.26, Y, Z - 0.27), b2 = P(X + 0.26, Y + 0.45, Z - 0.27); for (let k = 0; k < 3; k++) { const y = a[1] + (b2[1] - a[1]) * k / 3; d += `M${f1(a[0])} ${f1(y)} C${f1(a[0] + 14)} ${f1(y - 14)} ${f1(b2[0] - 14)} ${f1(y + 10)} ${f1(b2[0])} ${f1(y - 6)} `; } } raw(`<path d="${d}" stroke="${INK}" stroke-width="1.4" fill="none" opacity="0.8"/>`); }
  { const pts = []; for (let k = 0; k <= 14; k++) pts.push(P(X - 0.26, k * 0.32, Z - 0.27)); raw(rime(pts.reverse(), Z, { th: 5, col: FROST })); }
  const c = P(X, 0.8, Z - 0.3); raw(mould(c[0], c[1], 34, 60, { col: mix(MOULDD, '#0a0a08', 0.2) }) + bracket(c[0] + 10, c[1] - 30, 46, Z, { col: mix(BONE, '#3a3a30', 0.35) }) + bracket(c[0] - 6, c[1] - 6, 30, Z, { col: mix(BONE, '#3a3a30', 0.45) }));
  // right: one of the household who fell from the bench, lying in grave linen at the frame's corner (low, clear of foe 3),
  // grey arm out on the floor, buboes at the wrist, icicles from the fingers
  { const y = H + 6, x0 = W - 230; const sh = [[x0, y], [x0 + 20, y - 34], [x0 + 90, y - 46], [x0 + 170, y - 40], [W + 10, y - 50], [W + 10, H + 5], [x0 - 10, H + 5]];
    raw(cel(sh, { Z: 3.8, fill: mix(LINEN, '#20201a', 0.5), band: 8 }) + `<path d="${smooth(sh, true, 0.4)}" fill="url(#mottle)" opacity="0.4"/>` + mould(x0 + 110, y - 30, 30, 10, { col: mix(MOULD, '#1a1a14', 0.4) }) + caps(x0 + 150, y - 40, 18, 3.8, { col: mix(BONE, '#2a2a22', 0.35), n: 4 }) + rime(sh.slice(1, 4), 3.8, { th: 4, col: mix(FROST, '#20201a', 0.25) }));
    const arm = [[x0 + 10, y - 20], [x0 - 40, y - 8], [x0 - 90, y - 4]]; raw(line(arm, 14, INK) + line(arm, 11, mix('#8a9086', '#20201a', 0.45)) + pustules(x0 - 70, y - 8, 9, 4, mix('#8a8a5a', '#20201a', 0.3), 3.8));
    let fg = ''; for (let k = 0; k < 4; k++) fg += `M${f1(x0 - 96)} ${f1(y - 8 + k * 3)} l${f1(-12 - (k % 2) * 3)} ${f1(1 + k)} `; raw(`<path d="${fg}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="${fg}" stroke="${mix('#8a9086', '#20201a', 0.45)}" stroke-width="3.2" stroke-linecap="round"/>`); }
  // the roof over us: the nearest logs' ends across the top of the frame, earth and roots hanging out between them
  { const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 14 + Math.sin(k * 0.9) * 5 + R() * 4]); raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3.5, fill: '#1e1c16', band: 4 }) + `<path d="${p2([[-5, -5], [W + 5, -5], ...e.slice().reverse()])}" fill="${S.hatchA(4)}" opacity="0.5"/>`);
    for (let k = 0; k < 26; k++) { const x = R() * W, r = 6 + R() * 5; raw(`<ellipse cx="${f1(x)}" cy="${f1(10 + R() * 4)}" rx="${f1(r)}" ry="${f1(r * 0.8)}" fill="#3a342a" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f1(x)}" cy="${f1(10)}" rx="${f1(r * 0.5)}" ry="${f1(r * 0.4)}" fill="none" stroke="#5a5040" stroke-width="0.8"/>`); }
    for (let k = 0; k < 16; k++) { const x = R() * W; raw(root(x, 14, 30 + R() * 80, 2.5 + R() * 2.5, { branch: R() < 0.5, rime: R() < 0.3, col: '#4e483c' })); } }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
