// World IX, the Hollow Barrow: THE MOUND FIELD (battle room, Living Ink). Room key 'barrow_mound'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Mound Road (wolves among the grave mounds), The Leper Path (bells in the snow).
// The place: outside, in the field of grave mounds round the Hollow Barrow, at a winter dusk in freezing fog. The old road
// runs between the mounds to the great barrow on the rise, long and low, its stone portal walled up; the sun is a pale
// disc in the fog over it (the room's light). Nearer, mounds of every size under snow, their flanks dark with dead grass,
// standing stones with worn serpent bands, dead yews twisted by the wind; crows on the mounds. By the road the lepers'
// warning post with its bell and its rags; the lepers' own path trodden off through the snow. Fog lies in bands between
// the mounds, so each row is paler than the one before.
// Courses: FROST (rime on every windward edge, hoar on the yews, the snow, the fog); TOXIN (mould and shelf fungus on the
// yews, the rags of the lepers, a wolf-killed carcass gone to rot under the snow). Palette: grey-green frost, bone, mould.
// Usage: node scenes/bg_barrow_mound.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IX');
const W = 1480, H = 480, ROOM = 'barrow_mound';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 9202, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#f4f6ee', shadowTint: '#2a3228' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW } = S;
const G = require('./battle_kit_g3')(S, { air: '#aab2a6', murk: '#3a4238' });
const { BK, BL, air, glare, plates, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, box, post, beam, icicles, rime, mould, bracket, caps } = BK;

const SNOW = '#e2e6de', SNOW2 = '#c4cac0', GRASS = '#5a5a44', EARTH = '#3a382e', STONE = '#6a6e66', FROST = '#e8ece4', MOULD = '#7c8c62', BONE = '#d2cab2', YEW = '#2e2c26', MURK = '#3a4238', FOGC = '#aab2a6';
const fz = (c, Z) => air(c, Z, { z0: 18, z1: 120, max: 0.85 });           // fog only thickens with distance

// a dead yew, twisted by the wind: a leaning, twisting trunk and irregular branches (never a Y fork), rime on the upper
// windward side, mould and shelf fungus on the trunk. Screen base (x,y), height h px.
function yew(x, y, h, Z, o = {}) {
  const col = o.col || YEW; let s = '';
  const seg = (x0, y0, ang, len, w, d) => {
    const n = 5, pts = [[x0, y0]]; let cx = x0, cy = y0, a = ang;
    for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.7 + (o.wind || 0.08); cx += Math.cos(a) * len / n; cy += Math.sin(a) * len / n; pts.push([cx, cy]); }
    s += line(pts, w + 1.4, INK) + line(pts, w, col) + (w > 2 ? line(pts.map(([px, py]) => [px - w * 0.3, py - w * 0.2]), Math.max(0.6, w * 0.25), FROST, 0.55) : '');
    if (d > 0) { const nb = 1 + Math.floor(R() * 2.6); for (let b = 0; b < nb; b++) { const k = 2 + Math.floor(R() * 3), side = R() < 0.5 ? -1 : 1; seg(pts[k][0], pts[k][1], a + side * (0.4 + R() * 0.9) - 0.15, len * (0.35 + R() * 0.4), w * (0.45 + R() * 0.2), d - 1); } }
    else if (R() < 0.5) s += BL.icicles([pts[n][0] - 2, pts[n][1]], [pts[n][0] + 2, pts[n][1]], 1, { max: 4, col: FROST });
    return pts;
  };
  // the trunk: a broad, twisted, hollowed bole
  const tw = h * 0.09, pts = [[x, y]]; let cx = x; for (let i = 1; i <= 6; i++) { cx += (R() - 0.35) * tw * 0.8; pts.push([cx, y - h * 0.45 * i / 6]); }
  const L = pts.map(([px, py], i) => [px - tw * (1 - i * 0.08) * (1 + (i === 0 ? 0.5 : 0)), py]), Rr = pts.map(([px, py], i) => [px + tw * (1 - i * 0.08) * (1 + (i === 0 ? 0.6 : 0)), py]);
  s += cel([...L, ...Rr.slice().reverse()], { Z, fill: col, band: tw * 0.5, tex: 'url(#mottle)', texOp: 0.5 });
  for (let i = 0; i < 4; i++) s += line([[pts[0][0] + (i - 1.5) * tw * 0.4, y], [pts[6][0] + (i - 1.5) * tw * 0.3 + (R() - 0.5) * 4, y - h * 0.45]], 0.7, INK, 0.5);
  s += rime(L.slice().reverse(), Z, { th: Math.max(1.4, tw * 0.25), col: FROST });
  if (o.mould !== false) s += mould(x + tw * 0.3, y - h * 0.18, tw * 0.7, tw * 1.1, { col: MOULD }) + bracket(x + tw * 0.8, y - h * 0.28, tw * 1.2, Z, { col: mix(BONE, '#4a4a3a', 0.3) });
  const t = pts[6];
  seg(t[0], t[1], -Math.PI / 2 - 0.35, h * 0.42, tw * 0.75, 3); seg(t[0], t[1] + h * 0.06, -Math.PI / 2 + 0.6, h * 0.36, tw * 0.6, 2); if (R() < 0.6) seg(pts[4][0], pts[4][1], -Math.PI / 2 - 1.1, h * 0.3, tw * 0.45, 2);
  return s;
}
// a grave mound: a low dome of earth under snow, its windward flank with snow lying, its lee dark with dead grass, a crest
function mound(X, Z, w, h, o = {}) {
  const k = K(Z), c = P(X, 0, Z), top = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24, u = 2 * t - 1, hh = h * Math.pow(Math.max(0, 1 - u * u), 0.45) * (1 + 0.03 * Math.sin(i * 1.3 + X)); top.push([c[0] - k * w / 2 + k * w * t, c[1] - k * hh]); }
  const body = [...top, [c[0] + k * w / 2, c[1] + 2], [c[0] - k * w / 2, c[1] + 2]];
  let s = fillS(body, fz(o.flank || GRASS, Z), 1, 0.4) + fillS(body, 'url(#mottle)', 0.5, 0.4);
  // turf: tussock strokes over the whole flank, darker in the lee; frozen grass
  { let tf = ''; for (let i = 0; i < Math.round(w * h * 10); i++) { const t = 0.05 + R() * 0.9, p = top[Math.round(t * 24)], yy = p[1] + (c[1] - p[1]) * R(); tf += `M${f1(p[0])} ${f1(yy)} l${f1(-0.6 - R())} ${f1(-Math.max(1.5, k * 0.06))} `; } s += `<path d="${tf}" stroke="${fz('#2e2e22', Z)}" stroke-width="${f1(Math.max(0.6, k * 0.012))}" fill="none" opacity="0.8"/>`; }
  // snow lying over the crest and the windward (left) flank, thinning down the lee
  const sn = [...top.slice(0, 20), ...top.slice(2, 20).reverse().map(([x, y], i) => [x + k * w * 0.04, y + k * h * (0.18 + 0.3 * (i / 18)) * (0.9 + 0.15 * Math.sin(i * 0.9))])];
  s += fillS(sn, fz(SNOW, Z), 1, 0.4);
  s += fillS([...top.slice(13), ...top.slice(13).reverse().map(([x, y]) => [x - k * w * 0.05, y + k * h * 0.5])], fz('#4a4a3a', Z), 0.45, 0.4) + `<path d="${smooth([...top.slice(13), ...top.slice(13).reverse().map(([x, y]) => [x - k * w * 0.05, y + k * h * 0.5])], true, 0.4)}" fill="${S.hatchA(Z)}" opacity="0.25"/>`;
  // dead grass tufts poking through the snow
  for (let i = 0; i < Math.round(w * 2); i++) { const t = 0.1 + R() * 0.8, p = top[Math.round(t * 24)], yy = p[1] + k * h * R() * 0.6; s += pline([[p[0], yy], [p[0] - 1.2, yy - Math.max(2, k * 0.08)]], 0.7, fz('#4a4a32', Z), 0.8); }
  // the drift the wind built in the mound's lee: a long tail of snow running off to the right, its crest lit
  { const tl = []; for (let i = 0; i <= 10; i++) { const t = i / 10; tl.push([c[0] + k * w * (0.25 + 0.9 * t), c[1] - k * h * 0.45 * Math.pow(1 - t, 1.5)]); } s += fillS([...tl, [c[0] + k * w * 1.15, c[1] + 2], [c[0] + k * w * 0.25, c[1] + 2]], fz(SNOW, Z), 0.95, 0.4) + line(tl.slice(0, 6), 0.8, fz('#8a9086', Z), 0.6); }
  s += line(top, Math.max(0.6, S.inkW(Z) * 0.9), INK, 0.6);
  return { svg: s, top, c, k };
}
// a standing stone: tall, uneven, its serpent band worn, rimed on the windward edge, lichen/mould low; lean in radians
function stone(X, Z, h, w, lean = 0, o = {}) {
  const k = K(Z), b = P(X, 0, Z), sw = k * w, sh = k * h, tp = [b[0] + Math.sin(lean) * sh, b[1] - Math.cos(lean) * sh];
  const q = [[b[0] - sw / 2, b[1] + 2], [b[0] - sw * 0.55 + (tp[0] - b[0]) * 0.5, b[1] - sh * 0.5], [tp[0] - sw * 0.38, tp[1] + sh * 0.06], [tp[0] - sw * 0.1, tp[1]], [tp[0] + sw * 0.3, tp[1] + sh * 0.08], [b[0] + sw * 0.5 + (tp[0] - b[0]) * 0.5, b[1] - sh * 0.45], [b[0] + sw / 2, b[1] + 2]];
  let s = cel(q, { Z, fill: fz(o.col || STONE, Z), band: sw * 0.25, tex: 'url(#mottle)', texOp: 0.5 }) + (Z < 30 ? G.stoneV2(q, Z, fz(o.col || STONE, Z)) : '');
  s += rime(q.slice(0, 4).reverse(), Z, { th: Math.max(1.2, sw * 0.12), col: fz(FROST, Z) });
  // the worn serpent band: a sinuous ribbon down the face with cross-hatched body
  const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([b[0] + (tp[0] - b[0]) * (0.15 + t * 0.7) + Math.sin(t * 8) * sw * 0.18, b[1] - sh * (0.15 + t * 0.7)]); }
  s += line(pts, Math.max(0.8, sw * 0.08), fz('#3a3c36', Z), 0.7) + line(pts.map(([x, y]) => [x + 1, y + 1]), Math.max(0.5, sw * 0.03), fz('#b8bcb0', Z), 0.5);
  s += mould(b[0] - sw * 0.1, b[1] - sh * 0.12, sw * 0.4, sh * 0.08, { col: fz(MOULD, Z) });
  return s;
}

// ======================================================================== FAR
layer('far');
// ---- the fog sky: pale grey-green, brightest round the sun's veiled disc low over the great barrow
{
  raw(`<rect width="${W}" height="${H}" fill="${FOGC}"/>`);
  raw(G.skyGrad([[0, '#6e7668'], [0.4, '#8a9286'], [0.75, '#aab2a6'], [1, '#bcc2b6']], { y0: 0, y1: 310 }));
  raw(G.radGlow(960, 178, 300, 170, '#eef0e6', 0.7, { mid: 0.3, midOp: 0.45 }) + G.radGlow(960, 178, 60, 54, '#f8f8f0', 0.8) + `<circle cx="960" cy="178" r="21" fill="#f6f6ee" opacity="0.7"/>`);
  // long fog streaks across the sky (thin, wavering, light), crows far off
  for (let i = 0; i < 9; i++) { const y = 40 + i * 26 + R() * 10, x = -100 + R() * 1500; raw(G.softMass(x, y, 200 + R() * 260, 6 + R() * 8, '#c4cabe', 0.4)); }
  for (let i = 0; i < 9; i++) { const x = 300 + R() * 900, y = 60 + R() * 120, s2 = 3 + R() * 3; raw(`<path d="M${f1(x - s2)} ${f1(y)} q${f1(s2 * 0.5)} ${f1(-s2 * 0.5)} ${f1(s2)} 0 q${f1(s2 * 0.5)} ${f1(-s2 * 0.5)} ${f1(s2)} 0" stroke="#4a4c44" stroke-width="1.2" fill="none"/>`); }
}
// ---- the great barrow on the rise: a long low mound against the fog, standing stones on its crest, its portal (two
// uprights and a lintel) walled up, the road running up to it; palest and lowest contrast (farthest)
{
  const Z = 110, b = P(10, 0, Z), k = K(Z);
  const top = []; for (let i = 0; i <= 30; i++) { const t = i / 30, u = 2 * t - 1; top.push([b[0] - k * 34 + k * 68 * t, b[1] - k * 9 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 2.4)), 0.7)]); }
  raw(fillS([...top, [b[0] + k * 34, b[1] + 4], [b[0] - k * 34, b[1] + 4]], fz('#5a5c4c', Z), 1, 0.4) + fillS([...top.slice(0, 22), ...top.slice(2, 22).reverse().map(([x, y]) => [x + 3, y + k * 2])], fz(SNOW, Z), 0.9, 0.4) + line(top, 0.8, INK, 0.35));
  for (const [dx, hh] of [[-20, 2.6], [-12, 3.2], [-3, 3.6], [6, 3.0], [15, 3.4], [24, 2.4]]) { const p = top.reduce((a, q) => Math.abs(q[0] - (b[0] + k * dx)) < Math.abs(a[0] - (b[0] + k * dx)) ? q : a); raw(fillP([[p[0] - k * 0.6, p[1] + 2], [p[0] - k * 0.5, p[1] - k * hh], [p[0] + k * 0.45, p[1] - k * hh * 0.95], [p[0] + k * 0.55, p[1] + 2]], fz('#3a3c34', Z))); }
  // the portal: two uprights and a lintel, the stones walled in between
  { const pc = P(10, 0, Z - 6), kk = K(Z - 6); raw(fillP([[pc[0] - kk * 2.4, pc[1]], [pc[0] - kk * 2.4, pc[1] - kk * 3.2], [pc[0] + kk * 2.4, pc[1] - kk * 3.3], [pc[0] + kk * 2.4, pc[1]]], fz('#3a3a32', Z)) + fillP([[pc[0] - kk * 1.5, pc[1]], [pc[0] - kk * 1.5, pc[1] - kk * 2.3], [pc[0] + kk * 1.5, pc[1] - kk * 2.3], [pc[0] + kk * 1.5, pc[1]]], fz('#6a6c62', Z)) + pline([[pc[0] - kk * 2.6, pc[1] - kk * 3.3], [pc[0] + kk * 2.6, pc[1] - kk * 3.4]], kk * 0.5, fz('#2e2e28', Z))); }
}
// ---- the mound field, brought close (polish round 2): big grave mounds at three depths, turf showing dark through the
// snow, fog thickening only with distance; one opened mound in the middle with its stone-lined passage black and its kerb
// stones tumbled; rooted yews and thorns among them
{
  // far row (pale in the fog)
  raw(G.softMass(740, P(0, 0, 60)[1] - 4, 900, 14, '#c4cabc', 0.5));
  for (const [X, w, h] of [[-46, 14, 3.2], [-24, 11, 2.6], [22, 12, 3.0], [44, 15, 3.4]]) raw(mound(X, 55, w, h).svg);
  for (const [X, Z, hh, kind, lean] of [[-34, 46, 7, 'yew', 0], [30, 44, 6, 'thorn', 0.1]]) { const b2 = P(X, 0, Z); raw(G.treeV2(b2[0], b2[1], K(Z) * hh, Z, { kind, col: fz('#2a2822', Z), leaf: fz('#1e2a22', Z), rime: fz(FROST, Z), snow: fz(SNOW, Z), lean })); }
  raw(G.softMass(740, P(0, 0, 36)[1] - 2, 900, 10, '#c8cec0', 0.4));
  // middle row
  for (const [X, w, h] of [[-26, 11, 3.0], [24, 12, 3.4], [36, 9, 2.4]]) raw(mound(X, 30, w, h).svg);
  for (const [X, hh, lean] of [[-14, 2.6, 0.08], [16, 3.0, -0.12]]) raw(stone(X, 28, hh, 0.9, lean));
  // the opened mound, centre: its kerb of stones round the foot (some tumbled out onto the snow), the passage cut into
  // its flank lined with upright slabs and a lintel, black inside; its spoil heaped beside it
  { const Z = 21, X = -0.8, w = 12, h = 3.2, m = mound(X, Z, w, h, { flank: '#4a4a36' }); raw(m.svg);
    const k = K(Z);
    for (let i = 0; i < 16; i++) { const t = i / 15, a = Math.PI * (1 - t), kx = X + Math.cos(a) * w * 0.48, kz = Z - Math.sin(a) * 1.6, tumbled = i > 6 && i < 10; const c = P(kx + (tumbled ? (R() - 0.5) * 1.4 : 0), tumbled ? 0.2 : 0.35, kz - (tumbled ? 1.2 + R() : 0)), r = K(kz) * 0.32; raw(lump(blob(c[0], c[1], r, r * (tumbled ? 0.55 : 0.8), 8, 0.35), kz, STONE, { band: 1.4 }) + fillS(blob(c[0] - r * 0.2, c[1] - r * 0.6, r * 0.7, r * 0.18, 7, 0.4), SNOW, 0.95)); }
    const pa = [P(X - 0.7, 0, Z - 1.2), P(X + 0.7, 0, Z - 1.2), P(X + 0.6, 1.7, Z - 1.2), P(X - 0.6, 1.7, Z - 1.2)];
    raw(fillP(pa, "#050605") + inkP(pa, 1.4));
    for (const sx of [-1, 1]) { const q = [P(X + sx * 0.7, 0, Z - 1.3), P(X + sx * 1.05, 0, Z - 1.3), P(X + sx * 1.0, 1.85, Z - 1.3), P(X + sx * 0.7, 1.8, Z - 1.3)]; raw(cel(q, { Z, fill: '#6a6e64', band: 2, tex: 'url(#mottle)', texOp: 0.5 }) + G.stoneV2(q, Z, '#6a6e64') + rime([q[3], q[2]], Z, { th: 1.6, col: FROST })); }
    { const q = [P(X - 1.25, 1.75, Z - 1.35), P(X + 1.2, 1.8, Z - 1.35), P(X + 1.15, 2.2, Z - 1.35), P(X - 1.2, 2.15, Z - 1.35)]; raw(cel(q, { Z, fill: '#5e6258', band: 2 }) + fillS([q[3], q[2], [q[2][0], q[2][1] - 4], [q[3][0], q[3][1] - 5]], SNOW, 0.95)); }
    const sp = P(X + 4.4, 0, Z - 1.4); raw(fillS([[sp[0] - k * 1.4, sp[1] + 2], [sp[0] - k * 0.6, sp[1] - k * 0.55], [sp[0] + k * 0.5, sp[1] - k * 0.6], [sp[0] + k * 1.6, sp[1] + 2]], '#3a3428', 1, 0.4) + fillS([[sp[0] - k * 1.2, sp[1] - k * 0.1], [sp[0] - k * 0.5, sp[1] - k * 0.58], [sp[0] + k * 0.4, sp[1] - k * 0.62], [sp[0] + k * 0.9, sp[1] - k * 0.4]], SNOW, 0.85, 0.4));
    raw(G.treeV2(...P(X + 9.5, 0, Z + 1.5), K(Z) * 5.0, Z, { kind: 'yew', col: '#2a2822', rime: FROST, snow: SNOW, lean: -0.05 })); }
  // near row: big mounds flanking the stage, their tops above the fighters' heads, turf dark, snow capped
  for (const [X, w, h] of [[-13.5, 16, 3.8], [14.5, 15, 3.5]]) raw(mound(X, 15.5, w, h, { flank: '#3e3e2e' }).svg);
  raw(G.treeV2(...P(-5.6, 0, 14.2), K(14.2) * 5.2, 14.2, { kind: 'thorn', col: '#24221c', rime: FROST, snow: SNOW, lean: 0.05 }));
  raw(G.treeV2(...P(8.8, 0, 13.6), K(13.6) * 4.6, 13.6, { kind: 'thorn', col: '#24221c', rime: FROST, snow: SNOW, lean: -0.1 }));
}
// ---- the road: two ruts and a trodden way between the near mounds, running away to the great barrow (converging);
// a low dry-stone dyke along its left side
{
  const rd = t => [1.2 + Math.sin(t * 0.08) * 2.2 + t * 0.1, 0, 7 + t];
  for (const off of [-1.1, 1.1]) { const pts = []; for (let t = 0; t <= 90; t += 2) { const p = rd(t); pts.push(P(p[0] + off, 0.01, p[2])); } raw(line(pts, 2.2, '#8a8e80', 0.7) + line(pts.map(([x, y]) => [x, y - 1]), 1, '#f0f2ea', 0.5)); }
  { const pts = []; for (let t = 0; t <= 60; t += 0.8) { const p = rd(t); pts.push([p[0] - 2.8, p[2]]); } for (let i = 0; i < pts.length - 1; i++) { const [X, Z] = pts[i], c = P(X, 0.2, Z), r = K(Z) * 0.22; raw(lump(blob(c[0], c[1], r, r * 0.6, 8, 0.4), Z, fz(STONE, Z), { band: 1 }) + fillS(blob(c[0] - r * 0.2, c[1] - r * 0.45, r * 0.8, r * 0.2, 8, 0.4), fz(SNOW, Z), 0.9)); } }
}
// ---- the lepers' warning post by the road: a post with a crossbar, a hand bell hung from it, rags tied on, a cup for
// alms nailed under it; their path trodden off through the snow to the right
{
  const Z = 15, X = 3.8, b = P(X, 0, Z), k = K(Z), t = P(X, 2.6, Z);
  raw(line([b, t], k * 0.12 + 1.4, INK) + line([b, t], k * 0.12, '#4a4438') + line([[t[0] - k * 0.45, t[1] + k * 0.15], [t[0] + k * 0.45, t[1] + k * 0.1]], k * 0.09 + 1.2, INK) + line([[t[0] - k * 0.45, t[1] + k * 0.15], [t[0] + k * 0.45, t[1] + k * 0.1]], k * 0.09, '#4a4438') + rime([[b[0] - k * 0.06, b[1]], [t[0] - k * 0.06, t[1]]], Z, { th: 1.4 }));
  const bl = [t[0] + k * 0.3, t[1] + k * 0.5]; raw(line([[t[0] + k * 0.3, t[1] + k * 0.12], bl], 0.8, INK) + cel([[bl[0] - k * 0.07, bl[1] + k * 0.16], [bl[0] - k * 0.05, bl[1]], [bl[0] + k * 0.05, bl[1]], [bl[0] + k * 0.08, bl[1] + k * 0.16]], { Z, fill: '#5a5e58', band: 1 }) + BL.icicles([bl[0] - k * 0.06, bl[1] + k * 0.17], [bl[0] + k * 0.06, bl[1] + k * 0.17], 2, { max: 5, col: FROST }));
  for (const dx of [-0.35, -0.15]) raw(line([[t[0] + k * dx, t[1] + k * 0.14], [t[0] + k * dx - 1, t[1] + k * 0.5], [t[0] + k * dx + 1, t[1] + k * 0.75]], k * 0.05, '#8a8270'));
  for (let i = 0; i < 22; i++) { const Z2 = Z + 0.5 + i * 0.9, X2 = X + 1.4 + i * 0.6 + Math.sin(i * 0.7) * 0.4, c = P(X2, 0.01, Z2), kk = K(Z2); raw(fillS(blob(c[0], c[1], kk * 0.08, kk * 0.03, 7, 0.3), '#8a8e80', 0.6)); }
}
// ---- the ground's story: a line of leaning grave boards marching along the road toward the great barrow; a gibbet-like
// marker post by the road with crows on its arm; offerings at its foot
{
  for (let i = 0; i < 14; i++) { const Z = 11 + i * i * 0.45 + i * 1.6, X = (i % 2 ? 3.0 : -1.2) + Math.sin(Z * 0.08) * 2.2 + (Z - 7) * 0.1, hh = 1.2 + R() * 0.4, lean = (R() - 0.5) * 0.4; const b = P(X, 0, Z), k = K(Z), t = [b[0] + Math.sin(lean) * k * hh, b[1] - k * hh];
    const q = [[b[0] - k * 0.16, b[1]], [t[0] - k * 0.16, t[1] + k * 0.12], [t[0] - k * 0.06, t[1]], [t[0] + k * 0.06, t[1]], [t[0] + k * 0.16, t[1] + k * 0.12], [b[0] + k * 0.16, b[1]]];
    raw(cel(q, { Z, fill: fz('#3a3428', Z), band: Math.max(0.8, k * 0.03) }) + rime(q.slice(0, 4).reverse(), Z, { th: Math.max(0.8, k * 0.03), col: fz(FROST, Z) }) + pline([[t[0] - k * 0.1, t[1] + k * 0.35], [t[0] + k * 0.1, t[1] + k * 0.35]], 0.8, INK, 0.6) + fillS(blob(b[0] + k * 0.1, b[1], k * 0.35, k * 0.06, 8, 0.3), fz(SNOW, Z), 0.95)); }
  // the marker: a tall post with an arm, a rope end hanging from it frozen, crows along the arm
  { const Z = 11.5, X = -1.8, b = P(X, 0, Z), t = P(X, 4.0, Z), k = K(Z); raw(line([b, t], k * 0.14 + 1.6, INK) + line([b, t], k * 0.14, '#3a3428') + rime([[b[0] - k * 0.07, b[1]], [t[0] - k * 0.07, t[1]]], Z, { th: 1.6, col: FROST }));
    const arm = [[t[0] - k * 0.1, t[1] + k * 0.2], [t[0] + k * 1.2, t[1] + k * 0.15]]; raw(line(arm, k * 0.1 + 1.4, INK) + line(arm, k * 0.1, '#3a3428') + line([[arm[0][0] + 6, arm[0][1] + 6], [t[0] + k * 0.4, t[1] + k * 0.75]], 2.4, INK) + rime([[arm[0][0], arm[0][1] - 3], [arm[1][0], arm[1][1] - 3]], Z, { th: 2, col: FROST }));
    raw(line([[arm[1][0] - k * 0.1, arm[1][1]], [arm[1][0] - k * 0.12, arm[1][1] + k * 0.9]], 2, '#6a6250') + BL.icicles([arm[1][0] - k * 0.16, arm[1][1] + k * 0.9], [arm[1][0] - k * 0.08, arm[1][1] + k * 0.9], 2, { max: 8, col: FROST }));
    for (const [u, dir] of [[0.15, 1], [0.45, -1], [0.7, 1], [0.95, 1]]) { const x = arm[0][0] + (arm[1][0] - arm[0][0]) * u, y = arm[0][1] + (arm[1][1] - arm[0][1]) * u - k * 0.04, c = k * 0.22; raw(fillS([[x - c * 0.4 * dir, y], [x - c * 0.6 * dir, y - c * 0.5], [x - c * 0.15 * dir, y - c * 0.85], [x + c * 0.35 * dir, y - c * 0.8], [x + c * 0.6 * dir, y - c * 0.95], [x + c * 0.45 * dir, y - c * 0.55], [x + c * 0.15 * dir, y]], '#0e0e0b', 1, 0.4) + pline([[x + c * 0.55 * dir, y - c * 0.9], [x + c * 0.85 * dir, y - c * 0.85]], 1.6, '#0e0e0b') + pline([[x - c * 0.5 * dir, y - c * 0.25], [x - c * 0.95 * dir, y + c * 0.1]], 2, '#0e0e0b')); }
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, c = P(X + Math.cos(a) * 0.55, 0.05, Z + Math.sin(a) * 0.35); raw(lump(blob(c[0], c[1], 3.4, 2, 7, 0.4), Z, STONE, { band: 0.8 }) + fillS(blob(c[0], c[1] - 1.5, 2.8, 0.8, 6, 0.3), SNOW)); }
    const cp = P(X + 0.1, 0.05, Z - 0.1); raw(cel([[cp[0] - k * 0.06, cp[1]], [cp[0] + k * 0.06, cp[1]], [cp[0] + k * 0.08, cp[1] - k * 0.12], [cp[0] - k * 0.08, cp[1] - k * 0.12]], { Z, fill: '#6a6a5c', band: 1 })); }
}
// ---- the quiet band: stepped toward the dusk murk behind the fighters (the fog)
raw(BL.quiet('#5a6256', 250, 350, { steps: [0.06, 0.08, 0.1, 0.12], hop: 0.08 }));
// ---- the near snow: wind crust, the road's ruts and the wolves' tracks running toward the barrow (converging), frozen
// grass, a wolf-killed sheep's carcass half under the snow, rotting through the frost
{
  const at = (s, t) => [-30 + s, 0, 4 + t];
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, 14), at(0, 14)])}" fill="${SNOW2}"/><path d="${pp([at(0, 0), at(60, 0), at(60, 14), at(0, 14)])}" fill="url(#mottle)" opacity="0.3"/>`);
  for (let i = 0; i < 26; i++) { const X = -22 + R() * 44, Z = 4.4 + Math.pow(R(), 0.8) * 12, c = P(X, 0, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * (0.6 + R()), k * 0.05, 10, 0.5), '#9aa294', 0.35)); }
  for (let i = 0; i < 60; i++) { const X = -20 + R() * 40, Z = 4.3 + Math.pow(R(), 0.8) * 13, a = P(X, 0.01, Z), l = K(Z) * (0.6 + R() * 1.6); raw(fillS([[a[0] - l / 2, a[1]], [a[0] - l * 0.1, a[1] - Math.max(1, K(Z) * 0.04)], [a[0] + l / 2, a[1]]], SNOW, 0.9) + pline([[a[0] - l * 0.05, a[1] - Math.max(0.6, K(Z) * 0.02)], [a[0] + l / 2, a[1]]], 0.7, '#8a9086', 0.6)); }
  // the ruts coming toward us
  for (const off of [-1.1, 1.1]) { const pts = []; for (let Z = 4.2; Z <= 18; Z += 0.5) pts.push(P(1.2 + off + Math.sin((Z - 7) * 0.08) * 2.2, 0.01, Z)); raw(line(pts, 4, '#8a8e80', 0.6) + line(pts.map(([x, y]) => [x, y - 2]), 1.4, '#f4f6ee', 0.6)); }
  // the wolves' tracks: lines of paired prints, and a dragged trail
  for (const x0 of [-6, 7.5]) for (let Z = 4.6; Z < 16; Z += 0.55) { const X = x0 + Math.sin(Z * 0.6) * 0.5, c = P(X + (Math.round(Z * 2) % 2 ? 0.1 : -0.1), 0.01, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * 0.05, k * 0.02, 6, 0.3), '#7a8076', 0.6)); }
  for (let i = 0; i < 30; i++) { const X = -18 + R() * 36, Z = 4.4 + Math.pow(R(), 0.8) * 12, c = P(X, 0, Z), k = K(Z); for (let j = 0; j < 4; j++) raw(pline([[c[0] + j * 1.2, c[1]], [c[0] + j * 1.2 + (R() - 0.5) * 2, c[1] - k * (0.08 + R() * 0.1)]], 0.7, '#5a5a44', 0.8)); }
  // frozen tussocks: clumps of dead grass pushing through the snow, each with a cap of snow and a blue shadow to its right
  for (let i = 0; i < 55; i++) { const X = -22 + R() * 44, Z = 4.4 + Math.pow(R(), 0.9) * 14, c = P(X, 0, Z), k = K(Z), w = k * (0.15 + R() * 0.25), hh = k * (0.12 + R() * 0.2); let bl = ''; for (let j = 0; j < 9; j++) { const x = c[0] - w + j * w / 4.5, l = hh * (0.6 + R() * 0.6), lean = (j - 4) * 0.12 + (R() - 0.5) * 0.3; bl += `M${f1(x)} ${f1(c[1])} q${f1(Math.sin(lean) * l * 0.5)} ${f1(-l * 0.6)} ${f1(Math.sin(lean) * l)} ${f1(-l)} `; } raw(fillS(blob(c[0] + w * 0.6, c[1] + 1, w * 1.1, hh * 0.15, 8, 0.3), '#8a9286', 0.5) + `<path d="${bl}" stroke="#5a5a40" stroke-width="${f1(Math.max(0.6, k * 0.012))}" fill="none"/>` + fillS(blob(c[0] - w * 0.1, c[1] - hh * 0.75, w * 0.7, hh * 0.25, 8, 0.4), SNOW, 0.95)); }
  raw(occBand((s, t) => [-30 + s, 0, 4 + t], 60, 1.0, { op: 0.2 }));
}
raw(snowfall(160, { len: 2, slant: 0.3, op: 0.5, col: '#f0f2ec', y1: 340 }));

// ======================================================================== MID: the plague cart and the dead horse, in the gap between the lines
layer('mid');
{
  // the plague cart, large, just behind the line between the company and the foes: two-wheeled, one wheel broken so the
  // bed is down on that side, its load of the dead under a rimed shroud with an arm hanging out, the lime sack split and
  // white lime spilt on the snow, the shafts lying on the snow; its ruts behind it. A scale cue (a cart is a cart).
  const Z = 9.4, X = 2.6, k = K(Z);
  { const pts = []; for (let z = Z + 0.3; z < 22; z += 0.5) pts.push(P(X + 0.5 + (z - Z) * 0.18, 0.01, z)); const pts2 = pts.map(([x, y], i) => [x + K(Z + 0.3 + i * 0.5) * 1.5, y]); raw(line(pts, 3, '#5a6056', 0.7) + line(pts2, 3, '#5a6056', 0.7)); }
  const b0 = P(X - 1.3, 0.45, Z), b1 = P(X + 1.3, 0.95, Z), bed = [b0, b1, [b1[0], b1[1] - k * 0.32], [b0[0], b0[1] - k * 0.3]];
  raw(fillS([[b0[0] - k * 0.6, b0[1] + k * 0.45], [b0[0], b0[1] + k * 0.2], [b1[0] + k * 0.4, b1[1] + k * 0.75], [b1[0] + k * 1.0, b1[1] + k * 0.95]], '#1e221c', 0.35, 0.4));
  // the shroud over the load: bodies under it, its folds, rime on top, an arm hanging out over the low side
  const load = [bed[3], [bed[3][0] + k * 0.2, bed[3][1] - k * 0.55], [bed[3][0] + k * 0.8, bed[3][1] - k * 0.85], [bed[3][0] + k * 1.5, bed[3][1] - k * 0.78], [bed[2][0] - k * 0.5, bed[2][1] - k * 0.72], [bed[2][0] - k * 0.05, bed[2][1] - k * 0.3], bed[2]];
  raw(cel(load, { Z, fill: '#a8a694', band: 4, tex: 'url(#mottle)', texOp: 0.5 }) + rime(load.slice(0, 5).reverse(), Z, { th: 3, col: FROST }));
  for (let i = 0; i < 5; i++) { const t = (i + 0.5) / 5, x = bed[3][0] + (bed[2][0] - bed[3][0]) * t; raw(line([[x - k * 0.05, bed[3][1] + (bed[2][1] - bed[3][1]) * t - k * 0.7 + Math.sin(i) * 4], [x + k * 0.1, bed[3][1] + (bed[2][1] - bed[3][1]) * t - 2]], 1, INK, 0.45)); }
  raw(line([[bed[3][0] + k * 0.3, bed[3][1] - k * 0.2], [bed[3][0] + k * 0.2, bed[3][1] + k * 0.15], [bed[3][0] + k * 0.25, bed[3][1] + k * 0.42]], k * 0.08 + 1.4, INK) + line([[bed[3][0] + k * 0.3, bed[3][1] - k * 0.2], [bed[3][0] + k * 0.2, bed[3][1] + k * 0.15], [bed[3][0] + k * 0.25, bed[3][1] + k * 0.42]], k * 0.08, '#8e968a') + BL.icicles([bed[3][0] + k * 0.18, bed[3][1] + k * 0.45], [bed[3][0] + k * 0.32, bed[3][1] + k * 0.45], 2, { max: 8, col: FROST }));
  // the bed's sides: planks, a chalked tally of the dead on the tail-board
  raw(cel(bed, { Z, fill: '#3a3428', band: 3, tex: 'url(#mottle)', texOp: 0.5 }) + pline([[bed[0][0], bed[0][1] - k * 0.15], [bed[1][0], bed[1][1] - k * 0.16]], 1, INK, 0.6));
  { let d = ''; for (let g = 0; g < 4; g++) { const x0 = bed[0][0] + k * (0.4 + g * 0.3), y0 = bed[0][1] - k * 0.25 + (bed[1][1] - bed[0][1]) * (0.15 + g * 0.11); for (let j = 0; j < 4; j++) d += `M${f1(x0 + j * 3)} ${f1(y0)} l0.5 ${f1(k * 0.15)} `; d += `M${f1(x0 - 2)} ${f1(y0 + k * 0.12)} l14 ${f1(-k * 0.1)} `; } raw(`<path d="${d}" stroke="#d8d8cc" stroke-width="1.2" fill="none" opacity="0.8"/>`); }
  // the good wheel (high side): iron tyre, spokes, hub; the broken wheel: lying flat, spokes snapped
  { const wc = P(X + 0.9, 0.62, Z - 0.05), wr = k * 0.62; raw(`<ellipse cx="${f1(wc[0])}" cy="${f1(wc[1])}" rx="${f1(wr * 0.92)}" ry="${f1(wr)}" fill="none" stroke="${INK}" stroke-width="${f1(k * 0.09)}"/><ellipse cx="${f1(wc[0])}" cy="${f1(wc[1])}" rx="${f1(wr * 0.92)}" ry="${f1(wr)}" fill="none" stroke="#4a4438" stroke-width="${f1(k * 0.055)}"/>`); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; raw(pline([wc, [wc[0] + Math.cos(a) * wr * 0.9, wc[1] + Math.sin(a) * wr * 0.97]], k * 0.035 + 1, INK) + pline([wc, [wc[0] + Math.cos(a) * wr * 0.9, wc[1] + Math.sin(a) * wr * 0.97]], k * 0.025, '#4a4438')); } raw(`<circle cx="${f1(wc[0])}" cy="${f1(wc[1])}" r="${f1(k * 0.1)}" fill="#2a2620" stroke="${INK}" stroke-width="1.2"/>` + BL.rimeEdge(Array.from({ length: 8 }, (_, i) => { const a = Math.PI + i / 7 * Math.PI * 0.9; return [wc[0] + Math.cos(a) * wr * 0.92, wc[1] + Math.sin(a) * wr]; }), { w: 2, col: FROST })); }
  { const w2 = P(X - 1.9, 0.02, Z - 0.6), wr = k * 0.62; raw(`<ellipse cx="${f1(w2[0])}" cy="${f1(w2[1])}" rx="${f1(wr)}" ry="${f1(wr * 0.2)}" fill="none" stroke="${INK}" stroke-width="${f1(k * 0.08)}"/><ellipse cx="${f1(w2[0])}" cy="${f1(w2[1])}" rx="${f1(wr)}" ry="${f1(wr * 0.2)}" fill="none" stroke="#4a4438" stroke-width="${f1(k * 0.045)}"/>`); for (let i = 0; i < 5; i++) raw(pline([[w2[0] - wr * 0.8 + i * wr * 0.4, w2[1] - 2], [w2[0] - wr * 0.6 + i * wr * 0.4, w2[1] + 3]], 2, '#4a4438')); }
  // the shafts lying on the snow, the lime sack split, lime spilt white on the snow
  for (const dz of [-0.2, 0.25]) { const a = P(X - 1.3, 0.5, Z + dz), b = P(X - 3.6, 0.04, Z + dz - 0.5); raw(line([a, b], k * 0.07 + 1.4, INK) + line([a, b], k * 0.07, '#4a4438')); }
  { const sk = P(X + 2.0, 0, Z - 0.3); raw(cel(blob(sk[0], sk[1] - k * 0.16, k * 0.34, k * 0.18, 10, 0.25), { Z, fill: '#8a8676', band: 2 }) + pline([[sk[0] - k * 0.1, sk[1] - k * 0.3], [sk[0] + k * 0.25, sk[1] - k * 0.05]], 1.4, INK) + fillS(blob(sk[0] + k * 0.7, sk[1] + 2, k * 0.75, k * 0.08, 10, 0.4), '#f4f4ec') + line([[sk[0] + k * 0.1, sk[1]], [sk[0] + k * 1.3, sk[1] + 3]], 1, '#b8b8ac', 0.6)); }
  // the dead horse, a clear dark shape on the snow: lying on its side, legs out stiff, neck stretched, half drifted over
  { const Z2 = 12.8, c2 = P(-0.2, 0, Z2), k2 = K(Z2); const body = [[c2[0] - k2 * 1.0, c2[1]], [c2[0] - k2 * 0.95, c2[1] - k2 * 0.45], [c2[0] - k2 * 0.4, c2[1] - k2 * 0.62], [c2[0] + k2 * 0.5, c2[1] - k2 * 0.55], [c2[0] + k2 * 0.95, c2[1] - k2 * 0.32], [c2[0] + k2 * 1.0, c2[1]]];
    raw(cel(body, { Z: Z2, fill: '#2a2620', band: 3, tex: 'url(#mottle)', texOp: 0.5 }) + cel([[c2[0] - k2 * 0.9, c2[1] - k2 * 0.35], [c2[0] - k2 * 1.4, c2[1] - k2 * 0.55], [c2[0] - k2 * 1.75, c2[1] - k2 * 0.4], [c2[0] - k2 * 1.65, c2[1] - k2 * 0.12], [c2[0] - k2 * 0.95, c2[1] - k2 * 0.05]], { Z: Z2, fill: '#24201a', band: 2 }));
    for (const [dx, a] of [[-0.55, -0.55], [-0.25, -0.35], [0.3, -0.6], [0.65, -0.4]]) { const p0 = [c2[0] + k2 * dx, c2[1] - k2 * 0.5], p1 = [p0[0] + Math.cos(a) * k2 * 0.5, p0[1] + Math.sin(a) * k2 * 0.5], p2b = [p1[0] + Math.cos(a + 0.3) * k2 * 0.25, p1[1] + Math.sin(a + 0.3) * k2 * 0.25]; raw(line([p0, p1, p2b], k2 * 0.08 + 1.4, INK) + line([p0, p1, p2b], k2 * 0.08, '#2a2620')); }
    raw(fillS([[c2[0] - k2 * 0.4, c2[1] + 2], [c2[0] + k2 * 0.3, c2[1] - k2 * 0.25], [c2[0] + k2 * 1.0, c2[1] - k2 * 0.18], [c2[0] + k2 * 1.6, c2[1] + 2]], SNOW, 0.95, 0.5) + rime(body.slice(1, 4).reverse(), Z2, { th: 2, col: FROST }) + mould(c2[0] - k2 * 0.1, c2[1] - k2 * 0.15, k2 * 0.25, k2 * 0.08, { col: MOULD }));
    for (const dx of [0.1, 0.5]) { const x = c2[0] + k2 * dx, y = c2[1] - k2 * 0.62, cc = k2 * 0.18; raw(fillS([[x - cc * 0.4, y], [x - cc * 0.6, y - cc * 0.5], [x - cc * 0.15, y - cc * 0.85], [x + cc * 0.35, y - cc * 0.8], [x + cc * 0.6, y - cc * 0.95], [x + cc * 0.45, y - cc * 0.55], [x + cc * 0.15, y]], '#0e0e0b', 1, 0.4)); } }
}

// ======================================================================== FORE: framing
layer('fore');
{
  // left: a near dead yew, its hollow trunk at the frame edge and one twisted limb reaching across the top-left, hoar on
  // its upper side, shelf fungus, a crow on the limb
  const tr = [[-10, H + 10], [-10, 60], [30, 40], [58, 70], [70, 160], [62, 280], [76, H + 10]];
  raw(cel(tr, { Z: 4, fill: '#24221c', band: 10 }) + fillP(tr, S.hatchA(4), 0.4) + rime([[30, 40], [58, 70], [70, 160], [62, 280]].reverse(), 4, { th: 5, col: FROST }));
  for (let i = 0; i < 6; i++) raw(line([[8 + i * 9, 80], [14 + i * 9 + (R() - 0.5) * 10, H]], 1, INK, 0.5));
  raw(bracket(66, 230, 50, 4, { col: mix(BONE, '#3a3a30', 0.3) }) + bracket(70, 262, 36, 4, { col: mix(BONE, '#3a3a30', 0.4) }) + mould(40, 360, 26, 50, { col: '#5a6644' }));
  // the limb: one smooth tapering ribbon bending gently, side branches tapering off it (no kinks)
  { const ribbon = (pts, w0, w1) => { const L = [], Rr = []; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], pr = pts[Math.max(0, i - 1)], dx = q[0] - pr[0], dy = q[1] - pr[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (pts.length - 1)) / 2; L.push([p[0] - dy / l * w, p[1] + dx / l * w]); Rr.push([p[0] + dy / l * w, p[1] - dx / l * w]); } return [L, Rr]; };
    const curve = (x0, y0, a0, len, bend, n = 14) => { const pts = [[x0, y0]]; let x = x0, y = y0, a = a0; for (let i = 0; i < n; i++) { a += bend; x += Math.cos(a) * len / n; y += Math.sin(a) * len / n; pts.push([x, y]); } return pts; };
    const limbs = [[curve(44, 66, -0.32, 460, 0.028), 16, 1.2], [curve(150, 40, 0.55, 110, -0.02), 6, 0.4], [curve(250, 34, -0.75, 100, 0.03), 5, 0.4], [curve(330, 28, 0.35, 90, 0.04), 4.5, 0.4], [curve(400, 24, -0.6, 70, 0.02), 3.4, 0.3], [curve(190, 44, 0.9, 70, 0.05), 3.4, 0.3], [curve(290, 30, 0.75, 60, -0.03), 3, 0.3]];
    let twg = ''; for (const [pts] of limbs.slice(1)) { const e = pts[pts.length - 1]; for (let k = 0; k < 4; k++) { const a = (R() - 0.5) * 2.4, l = 14 + R() * 22; twg += `M${f1(e[0])} ${f1(e[1])} q${f1(Math.cos(a) * l * 0.5)} ${f1(Math.sin(a) * l * 0.5 - 3)} ${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; } } raw(`<path d="${twg}" stroke="#24221c" stroke-width="1.2" fill="none" stroke-linecap="round"/>`);
    for (const [pts, w0, w1] of limbs) { const [L, Rr] = ribbon(pts, w0, w1); raw(`<path d="${smooth([...L, ...Rr.slice().reverse()], true, 0.5)}" fill="#24221c" stroke="${INK}" stroke-width="1.4"/>` + `<path d="${smooth(L, false, 0.5)}" stroke="${FROST}" stroke-width="${f1(Math.max(1, w0 * 0.2))}" fill="none" opacity="0.85"/>`); }
    raw(BL.icicles([150, 46], [420, 40], 14, { max: 16, col: FROST })); }
  { const x = 336, y = 18; raw(fillS([[x - 9, y], [x - 4, y - 9], [x + 4, y - 11], [x + 9, y - 6], [x + 14, y - 8], [x + 10, y - 2], [x + 6, y + 2], [x - 4, y + 3]], '#14140f') + pline([[x + 13, y - 8], [x + 19, y - 7]], 2, '#14140f')); }
  // right: a near standing stone leaning in at the frame edge, rimed, with the worn serpent band, low enough to clear foe 3
  const sq = [[W - 90, H + 10], [W - 100, 300], [W - 70, 200], [W - 30, 182], [W + 10, 190], [W + 10, H + 10]];
  raw(cel(sq, { Z: 4, fill: '#4a4e46', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + G.stoneV2(sq, 4, '#4a4e46') + rime([[W - 100, 300], [W - 70, 200], [W - 30, 182]].reverse(), 4, { th: 6, col: FROST }));
  { const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([W - 60 + Math.sin(t * 8) * 12, 220 + t * 220]); } raw(line(pts, 8, '#2a2c26', 0.8) + line(pts.map(([x, y]) => [x + 1.5, y + 1.5]), 2.4, '#a8aca0', 0.5)); }
  raw(mould(W - 50, 420, 30, 40, { col: '#5a6644' }));
  // the snow crust at the bottom
  { const bank = []; for (let k = 0; k <= 14; k++) bank.push([k * 40 - 10, H - 6 - Math.sin(k / 14 * Math.PI * 2) * 6 - R() * 5]); raw(fillS([[-10, H + 4], ...bank, [570, H + 4]], SNOW, 0.95) + line(bank, 1, '#8a9086', 0.6)); }
  raw(snowfall(100, { len: 3.4, slant: 0.3, op: 0.6, col: '#f4f6f0', w: 1.6 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
