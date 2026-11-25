// The Scriptorium in Living Ink. Same room as grim/int_scriptorium.js: same camera, room box (10 x 9 x 4.4, flat boarded
// ceiling on beams), door, three back windows, keeper spot (with the over_cut that brings his hands back over the desk),
// hotspots (exit, codex, keeper) and lights. Brother Lucan's long writing room: the Grey through three tall windows is the
// only light good enough to write by; carrels under the outer two; book presses down the right wall and in the back corner;
// pages hung drying on cords across the room. Lucan stoops over his slanted desk at the front, the open Codex on it (the panel).
// Lore (2026-11-23, item 9): Lucan was a scribe at the Stilled Spire, where the astronomers stopped time. A pocket watch hangs
// on a nail on the front of his desk, stopped, its hands fixed (as on his figure, worlds/keepers.js). Nothing else in the room
// keeps time: no clock, no running sand-glass (the one on the left carrel has run out and lies on its side).
// Usage: node scenes/int_scriptorium.js [outDir]   (default out/scenes/hub/scriptorium)
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'scriptorium');
const I = require('./int_shell')('scriptorium', { width: 10, depth: 9, height: 4.4, wall: '#5a5246', wall2: '#605848', floorCol: '#3e3a32', floor: 'stone', stone: 'ashlar', ceilCol: '#34281c', beamCol: '#3e3022', seed: 2287, panel: 'codex', beamGap: 1.7,
  jambFix: true, wallOpts: { dampCol: '#2a2a20', rough: true, courses: [1.1, 0.45, 0.8, 1.3, 0.38, 0.38, 0.95, 0.6, 1.2, 0.5, 0.75], wscale: 0.6 } });   // v4 (2026-11-24): coursed rubble, window jambs from the sill
const S = I;
const { P, K, sc, pp, p2, f1, INK, raw, layer, PLW, cel, hatch3, mix, hot, addLight, through, R, castOn, shadowPoly, figProp, glow, prop, HW, D0, D1, HT } = S;
const PR = require('./props_li');
const KK = require('../worlds/kit_keepers');
const E = require('../engine');
const { ell, lerp } = E;
const DR = require('./dress_li')(I);
const WOOD = '#4a3624', WOODL = '#6a5034', VELLUM = '#d8ccae', GOLD = '#b08a3a', BRASS = '#9a7a40';
const BOOKC = ['#5a2a1a', '#3a3a2a', '#6a5a3a', '#2a2a3a', '#7a6a4a', '#4a1a14', '#3a2a1a', '#2a3a2a', '#5a4a2a', '#6a3a2a'];
const pickc = () => BOOKC[Math.floor(R() * BOOKC.length)];
const KEEPER = { X: 0.45, Z: 4.55, h: (790 - 193) / (640 / 1.75), sprite: 'lucan', label: 'Brother Lucan', cutY: 1.08, cutZ: 4.0, figure: [193, 790], flip: true };
const DESK = { x0: -0.95, x1: 0.95, z0: 3.75, z1: 4.25, lo: 0.88, hi: 1.12 };
const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];

// a book lying flat: cover on top, the page block (or spine) on the faces the camera sees; rot about the vertical
function lyingBook(X, Y, Z, w, d, t, col, rot = 0) {
  const c = Math.cos(rot), s0 = Math.sin(rot), at = (u, v, y) => [X + u * c - v * s0, Y + y, Z + u * s0 + v * c];
  const b = t * 0.16, Zm = Z;
  let o = '';
  const face = (q, fill, o2 = {}) => { o += cel(q.map(p => P(...p)), Object.assign({ Z: Zm, fill, band: 1.2 }, o2)); };
  face([at(-w, -d, 0), at(w, -d, 0), at(w, -d, t), at(-w, -d, t)], mix(VELLUM, '#8a7a5a', R() * 0.5));
  face([at(-w, -d, 0), at(w, -d, 0), at(w, -d, b), at(-w, -d, b)], mix(col, '#000', 0.2), { band: 0.5 });
  face([at(-w, -d, t - b), at(w, -d, t - b), at(w, -d, t), at(-w, -d, t)], mix(col, '#000', 0.1), { band: 0.5 });
  if (X + w < -0.2) face([at(w, -d, 0), at(w, d, 0), at(w, d, t), at(w, -d, t)], col);
  if (X - w > 0.2) face([at(-w, -d, 0), at(-w, d, 0), at(-w, d, t), at(-w, -d, t)], col);
  face([at(-w, -d, t), at(w, -d, t), at(w, d, t), at(-w, d, t)], col, { tex: 'url(#mottle)', texOp: 0.4 });
  { const q = [at(-w + 0.025, -d + 0.025, t + 0.001), at(w - 0.025, -d + 0.025, t + 0.001), at(w - 0.025, d - 0.025, t + 0.001), at(-w + 0.025, d - 0.025, t + 0.001)].map(p => P(...p)); o += `<path d="${p2(q)}" fill="none" stroke="${R() < 0.35 ? GOLD : mix(col, '#000', 0.4)}" stroke-width="0.9" opacity="0.7"/>`; }
  if (R() < 0.35) { const A = P(...at(w * 0.2, -d, t * 0.5)), B = P(...at(w * 0.25, -d - 0.07, 0)); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#8a1a14" stroke-width="1.6"/>`; }
  raw(PLW(FLOOR, o));
  return Y + t;
}
function bookStack(X, Z, n, Y0 = 0) { let Y = Y0; for (let k = 0; k < n; k++) { const w = 0.12 + R() * 0.08, d = 0.09 + R() * 0.06, t = 0.035 + R() * 0.045; lyingBook(X + (R() - 0.5) * 0.06, Y, Z + (R() - 0.5) * 0.04, w, d, t, pickc(), (R() - 0.5) * 0.3); Y += t; } return Y; }
// book spines standing on a shelf in a plane: at(s,t) maps shelf-plane coords (s along the shelf, t up) to the world
function spines(at, s0, s1, t0, maxH, pts3) {
  let o = '';
  for (let s = s0 + 0.02; s < s1 - 0.05;) {
    const r = R();
    if (r < 0.07) { s += 0.1 + R() * 0.18; continue; }
    if (r < 0.17) { let t = t0; for (let k = 0; k < 2 + Math.floor(R() * 3); k++) { const th = 0.035 + R() * 0.04, len = 0.22 + R() * 0.12; o += cel([at(s, t), at(s + len, t), at(s + len, t + th), at(s, t + th)].map(p => P(...p)), { Z: at(s, t)[2], fill: pickc(), band: 0.8 }); t += th; } s += 0.38; continue; }
    const h = Math.min(maxH, 0.22 + R() * 0.26), w = 0.035 + R() * 0.045, lean = R() < 0.1 ? 0.07 : 0, col = pickc();
    o += cel([at(s, t0), at(s + w, t0), at(s + w + lean, t0 + h), at(s + lean, t0 + h)].map(p => P(...p)), { Z: at(s, t0)[2], fill: col, tex: 'url(#mottle)', texOp: 0.3, band: 1 });
    for (const tt of [0.14, 0.82]) if (R() < 0.7) { const A = P(...at(s + lean * tt + 0.004, t0 + h * tt)), B = P(...at(s + w + lean * tt - 0.004, t0 + h * tt)); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${R() < 0.45 ? GOLD : INK}" stroke-width="1.1" opacity="0.85"/>`; }
    if (R() < 0.25) { const A = P(...at(s + w / 2, t0 + h * 0.45)); o += `<rect x="${f1(A[0] - 1.5)}" y="${f1(A[1] - 2.5)}" width="3" height="5" fill="#c8b890" stroke="${INK}" stroke-width="0.4"/>`; }
    s += w + 0.006;
  }
  raw(PLW(pts3, o));
}

I.shell();
I.door(6.2, 7.2, { side: -1, ts: 2.0 });   // the stair down to the garth is in the west wall
for (const X of [-3.2, 0, 3.2]) I.backWindow(X - 0.55, X + 0.55, 1.5, 3.85, { I: 1.0, range: 7.5, sky: '#6a6a66', bars: 3 });

// ------------------------------------------------------------------ the walls worn: render patched over the stone, cracks from the window
// heads, damp low down, soot over the carrels where candles are stood at dusk; nails with things on them
{
  const atB = I.atB, BP = [atB(0, 0), atB(1, 0), atB(0, 1)];
  I.wear(atB, BP, {
    patches: [[0.6, 2.4, 0.9, 1.3, '#6a6456', true], [3.4, 0.9, 1.2, 0.7, '#6e6858', true], [6.6, 3.95, 0.8, 0.45, '#6a6456', true], [9.4, 1.6, 0.8, 1.4, '#6a6456', true]],
    bloom: [[0.4, 0.4, 0.8, 0.6], [9.6, 0.4, 0.7, 0.6], [4.9, 0.3, 0.6, 0.4]],
    cracks: [[1.6, 3.95, 0.9, 2.0], [5.4, 3.95, 0.7, 1.2], [8.3, 3.95, 1.0, 0.7], [2.3, 0.1, 0.8, 1.4]],
    soot: [[2.0, 3.0, 2.3, 3.4, 0.14], [7.9, 8.6, 1.9, 3.0, 0.16]],
  });
  DR.nailHang(-4.3, 2.3, D1 - 0.02, 'bag');
  DR.nailHang(1.05, 2.9, D1 - 0.02, 'herbs');
  const atL = I.atL; I.wear(atL, [atL(0, 0), atL(1, 0), atL(0, 1)], { patches: [[1.4, 2.3, 1.0, 1.2, '#4e4a40', true]], bloom: [[1.0, 0.35, 1.4, 0.5]], cracks: [[3.6, 2.6, 0.9, 2.2]] });
}
// ------------------------------------------------------------------ the carrels under the outer windows
for (const X of [-2.65, 3.2]) prop(7.6, () => {
  const x0 = X - 0.85, x1 = X + 0.85, z0 = 7.6, z1 = D1 - 0.02;
  I.woodBox(x0 - 0.05, x0, 0, 2.0, z0, z1, WOOD, { bw: 0.2 }); I.woodBox(x1, x1 + 0.05, 0, 2.0, z0, z1, WOOD, { bw: 0.2 });
  I.woodFace([[x0, 1.2, z1], [x1, 1.2, z1], [x1, 1.05, z0], [x0, 1.05, z0]], WOODL, { bw: 0.15, stains: 0.5 });
  I.woodFace([[x0, 1.05, z0], [x1, 1.05, z0], [x1, 0.95, z0], [x0, 0.95, z0]], WOOD, { boards: 1, segs: 1 });
  for (const XX of [x0 + 0.1, x1 - 0.1]) I.beam(XX - 0.03, XX + 0.03, 0, 0.95, z0 + 0.05, z0 + 0.11, WOOD);
  const sl = zz => 1.05 + 0.15 * (zz - z0) / (z1 - z0);
  if (X < 0) {
    // the left carrel: a book open on the slope, an inkhorn, two books shut, a sand-glass run out and lying on its side
    const pg = [[X - 0.35, sl(z0 + 0.15) + 0.01, z0 + 0.15], [X + 0.25, sl(z0 + 0.15) + 0.01, z0 + 0.15], [X + 0.25, sl(z0 + 0.55) + 0.01, z0 + 0.55], [X - 0.35, sl(z0 + 0.55) + 0.01, z0 + 0.55]];
    let o = cel(pg.map(p => P(...p)), { Z: z0, fill: VELLUM, band: 1 });
    for (let r = 0; r < 6; r++) { const zz = z0 + 0.2 + r * 0.055; for (const [u0, u1] of [[-0.31, -0.09], [-0.01, 0.21]]) { const A = P(X + u0, sl(zz) + 0.012, zz), B = P(X + u1 - R() * 0.05, sl(zz) + 0.012, zz); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#3a3028" stroke-width="0.8" opacity="0.6"/>`; } }
    raw(PLW(pg.slice(0, 3), o));
    bookStack(X + 0.6, z0 + 0.35, 2, 1.12);
    figProp(X - 0.6, 1.1, z0 + 0.2, (f, u) => { f.part([[-0.02 * u, 0], [0.02 * u, 0], [0.04 * u, -0.12 * u], [0.01 * u, -0.14 * u]], { fill: '#c8b890', shade: 0.35, inkW: 1.1, cast: false }); f.line([[0.02 * u, -0.13 * u], [0.1 * u, -0.3 * u]], 1.1, '#e8e0d0'); });
    figProp(X + 0.32, 1.14, z0 + 0.25, (f, u) => { const s = 0.06 * u; f.part([[-s * 1.4, -s * 0.5], [-s * 1.4, s * 0.5], [-s * 0.1, s * 0.05], [s * 0.1, s * 0.05], [s * 1.4, s * 0.5], [s * 1.4, -s * 0.5], [s * 0.1, -s * 0.05], [-s * 0.1, -s * 0.05]], { fill: '#b8c4c8', light: '#e8f0f0', shade: 0.25, inkW: 1, cast: false, hatch: false }); f.flat([[s * 0.2, s * 0.08], [s * 1.3, s * 0.45], [s * 1.3, s * 0.1]], '#c8a868'); for (const x of [-s * 1.5, s * 1.5]) f.part([[x - 1.6, -s * 0.6], [x + 1.6, -s * 0.6], [x + 1.6, s * 0.6], [x - 1.6, s * 0.6]], { fill: WOOD, shade: 0.3, inkW: 0.9, cast: false }); });
  } else {
    // the right carrel: loose quires weighted with a stone, a pen-knife, a candle stood in its own wax (lit at dusk)
    let o = '';
    for (let k = 0; k < 4; k++) { const u = -0.4 + R() * 0.3, zz = z0 + 0.15 + R() * 0.2, rot = (R() - 0.5) * 0.4, w = 0.14, d = 0.1, at = (p, q2) => [X + u + p * Math.cos(rot) - q2 * Math.sin(rot), sl(zz) + 0.012 + k * 0.003, zz + p * Math.sin(rot) + q2 * Math.cos(rot)];
      o += cel([at(-w, -d), at(w, -d), at(w, d), at(-w, d)].map(p => P(...p)), { Z: z0, fill: mix(VELLUM, '#8a7a5a', R() * 0.4), band: 0.8 }); }
    raw(PLW([[x0, 1.05, z0], [x1, 1.05, z0], [x0, 1.2, z1]], o));
    figProp(X - 0.2, 1.13, z0 + 0.3, (f, u) => f.part([[-0.05 * u, 0], [-0.045 * u, -0.04 * u], [0.01 * u, -0.06 * u], [0.05 * u, -0.03 * u], [0.05 * u, 0]], { fill: '#5a5650', shade: 0.4, inkW: 1.2, tex: PR.T(f, 'mottle'), texOp: 0.6 }));
    figProp(X + 0.65, 1.18, z0 + 0.3, (f, u) => { PR.candleStub(f, 0, 0.1 * u, 0.03 * u); });
    addLight(X + 0.65, 1.48, z0 + 0.3, 0.17, 2.4, [1.0, 0.74, 0.44]);
    layer('fx'); raw(glow(...P(X + 0.65, 1.32, z0 + 0.3), K(z0) * 0.5, K(z0) * 0.45, '#ffb060', 0.35)); layer('bg');
  }
});
// ------------------------------------------------------------------ book presses: down the right wall, and a tall one in the back-right corner
prop(6.9, () => {
  const z0 = 6.9, z1 = D1 - 0.05, X = HW - 0.45;
  I.woodBox(X, HW - 0.02, 0, 3.0, z0, z1, WOOD, { bw: 0.2, cast: false });
  for (const Y of [0.1, 0.7, 1.3, 1.9, 2.5]) {
    const sh = [[X + 0.01, Y, z0], [X + 0.01, Y, z1], [X + 0.01, Y + 0.56, z1], [X + 0.01, Y + 0.56, z0]];
    raw(PLW(sh.slice(0, 3), cel(sh.map(p => P(...p)), { Z: z0, fill: '#1a140e', band: 0 }) + hatch3((s, t) => [X + 0.01, Y + t, z0 + s], 0, z1 - z0, 0, 0.56, 0.7, { op: 0.4 })));
    spines((s, t) => [X + 0.02, t, z0 + s], 0, z1 - z0, Y, 0.52, sh.slice(0, 3));
    I.woodFace([[X - 0.01, Y, z0], [X - 0.01, Y, z1], [X - 0.01, Y - 0.04, z1], [X - 0.01, Y - 0.04, z0]], WOODL, { boards: 1, segs: 1 });
  }
});
prop(D1 - 0.45, () => {
  const x0 = 4.0, x1 = HW - 0.05, z = D1 - 0.45;
  I.woodBox(x0, x1, 0, 2.7, z, D1 - 0.02, WOOD, { bw: 0.2 });
  for (const Y of [0.15, 0.75, 1.35, 1.95]) {
    const q = [[x0 + 0.05, Y, z - 0.01], [x1 - 0.05, Y, z - 0.01], [x1 - 0.05, Y + 0.55, z - 0.01], [x0 + 0.05, Y + 0.55, z - 0.01]];
    raw(PLW(q, cel(q.map(p => P(...p)), { Z: z, fill: '#1a140e', band: 2 })));
    spines((s, t) => [x0 + 0.05 + s, t, z - 0.015], 0, x1 - x0 - 0.1, Y, 0.52, q);
    I.woodFace([[x0, Y, z - 0.02], [x1, Y, z - 0.02], [x1, Y - 0.04, z - 0.02], [x0, Y - 0.04, z - 0.02]], WOODL, { boards: 1, segs: 1 });
  }
});
// a chair pushed back from the left carrel, its seat worn pale
prop(7.0, () => {
  const X = -2.4, Z = 7.0;
  for (const [dx, dz] of [[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]]) I.beam(X + dx - 0.02, X + dx + 0.02, 0, 0.45, Z + dz - 0.02, Z + dz + 0.02, WOOD);
  I.woodBox(X - 0.22, X + 0.22, 0.45, 0.5, Z - 0.2, Z + 0.2, WOODL, { cast: false, boards: 1, topBoards: 3 });
  for (const dx of [-0.18, 0.18]) I.beam(X + dx - 0.02, X + dx + 0.02, 0.5, 1.0, Z + 0.16, Z + 0.2, WOOD);
  I.beam(X - 0.2, X + 0.2, 0.85, 0.95, Z + 0.16, Z + 0.2, WOOD);
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - 0.22, X + 0.22, 0, 0.5, Z - 0.2, Z + 0.2), [0, 1, 0], 0), Z, { op: 0.25 })));
});
// the floor: rushes along the walls (strewn for the cold), books stacked on the flags, quill shavings and pumice dust
{
  const atF = I.atF;
  for (const [Xc, Zc, w, h] of [[-4.6, 4.5, 0.7, 3.0], [-4.3, 8.6, 1.2, 0.6], [-0.2, 8.7, 2.0, 0.5], [4.4, 5.0, 0.8, 2.6]]) DR.drift(atF, Xc + HW, Zc - D0, w, h, { base: '#4e4428' });
}
prop(5.6, () => { bookStack(-3.2, 5.6, 3); bookStack(2.6, 6.2, 5); bookStack(2.95, 6.1, 2); });
// cords across the room with pages pegged to dry: every leaf different, text, ruled, illuminated, scraped, a bifolium
for (const [Z, Y, xs, xe] of [[6.2, 3.1, -HW, 2.4], [5.2, 3.35, -3.6, 3.0]]) prop(Z, () => {
  const n = 16, pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, X = xs + (xe - xs) * t; pts.push([X, Y - Math.sin(t * Math.PI) * 0.35, Z]); }
  raw(`<path d="${S.smooth(pts.map(p => P(...p)), false, 0.5)}" stroke="${INK}" stroke-width="2" fill="none"/><path d="${S.smooth(pts.map(p => P(...p)), false, 0.5)}" stroke="#8a7a56" stroke-width="0.9" fill="none" stroke-dasharray="2 1.5"/>`);
  const s = K(Z);
  for (let t = 0.03 + R() * 0.05; t < 0.97;) {
    const X = xs + (xe - xs) * t, Yc = Y - Math.sin(t * Math.PI) * 0.35, [x, y] = P(X, Yc, Z), kind = ['text', 'text', 'text2', 'illum', 'ruled', 'blank', 'bifol'][Math.floor(R() * 7)];
    const w = s * (kind === 'bifol' ? 0.2 : 0.07 + R() * 0.07), h = s * (0.14 + R() * 0.1), tone = mix(VELLUM, R() < 0.5 ? '#8a7a5a' : '#e8e0c8', R() * 0.5), sw = (R() - 0.5) * 6, curl = R() < 0.35;
    const pg = [[x - w, y], [x + w, y + 1], [x + w * 0.96 + sw * 0.3, y + h], [x + w * 0.4, y + h + (curl ? -s * 0.03 : 1)], [x - w * 0.98 + sw * 0.3, y + h - 2]];
    let o = cel(pg, { Z, fill: tone, band: 1.2, tex: 'url(#mottle)', texOp: 0.35 });
    if (curl) o += `<path d="M${f1(x + w * 0.4)} ${f1(y + h - s * 0.03)} Q${f1(x + w * 0.7)} ${f1(y + h - s * 0.05)} ${f1(x + w * 0.96 + sw * 0.3)} ${f1(y + h)}" fill="${mix(tone, '#000', 0.25)}" stroke="${INK}" stroke-width="0.7"/>`;
    const line = (x0, y0, l, col = '#2a2018', wd = 0.7, op = 0.65) => { o += `<path d="M${f1(x0)} ${f1(y0)} l${f1(l)} 0" stroke="${col}" stroke-width="${wd}" opacity="${op}"/>`; };
    if (kind === 'text' || kind === 'illum' || kind === 'bifol') { const cols = kind === 'bifol' ? 2 : 1, cw = (w * 2) / cols; for (let cI = 0; cI < cols; cI++) for (let r = 0; r < 7 + Math.floor(R() * 5); r++) { const ly = y + h * 0.14 + r * h * 0.07; if (ly > y + h * 0.88) break; const off = kind === 'illum' && r < 3 ? cw * 0.3 : 0; line(x - w + cI * cw + cw * 0.15 + off, ly, cw * 0.7 * (r % 6 === 5 ? 0.5 : 0.85 + R() * 0.15) - off); } }
    if (kind === 'text2') for (let r = 0; r < 10; r++) for (const cI of [0, 1]) line(x - w * 0.85 + cI * w * 0.95, y + h * 0.12 + r * h * 0.075, w * 0.75, '#2a2018', 0.6, 0.6);
    if (kind === 'ruled') for (let r = 0; r < 12; r++) line(x - w * 0.85, y + h * 0.1 + r * h * 0.07, w * 1.7, '#8a6a5a', 0.4, 0.5);
    if (kind === 'bifol') o += `<path d="M${f1(x)} ${f1(y)} L${f1(x + sw * 0.15)} ${f1(y + h)}" stroke="#6a5a40" stroke-width="1" opacity="0.7"/>`;
    if (R() < 0.4) o += S.stain(x + (R() - 0.5) * w, y + h * (0.3 + R() * 0.5), w * 0.3, '#5a4a2a', 0.3);
    if (kind === 'illum') o += `<rect x="${f1(x - w * 0.82)}" y="${f1(y + h * 0.1)}" width="${f1(w * 0.5)}" height="${f1(h * 0.24)}" fill="${['#8a1a14', '#2a3a6a', '#3a5a2a'][Math.floor(R() * 3)]}" stroke="${GOLD}" stroke-width="1.1"/><path d="M${f1(x - w * 0.7)} ${f1(y + h * 0.3)} l${f1(w * 0.12)} ${f1(-h * 0.14)} l${f1(w * 0.12)} ${f1(h * 0.14)}" stroke="#e2c472" stroke-width="1.2" fill="none"/>`;
    else if (kind !== 'blank' && kind !== 'ruled' && R() < 0.5) o += `<rect x="${f1(x - w * 0.75)}" y="${f1(y + h * 0.1)}" width="${f1(w * 0.18)}" height="${f1(h * 0.1)}" fill="#9a2a1a"/>`;
    for (const px of kind === 'bifol' ? [x - w * 0.6, x + w * 0.6] : [x]) o += `<rect x="${f1(px - 2)}" y="${f1(y - 4)}" width="4" height="7" fill="${mix('#6a4a2a', '#8a7a5a', R())}" stroke="${INK}" stroke-width="0.6"/>`;
    raw(o);
    t += (w * 2) / s / (xe - xs) + 0.012 + R() * 0.05 + (R() < 0.12 ? 0.08 : 0);
  }
});

// ================================================================== MID: Lucan's desk and the open Codex
layer('mid');
prop(DESK.z0, () => {
  const { x0, x1, z0, z1, lo, hi } = DESK;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(x0, x1, 0, hi, z0, z1), [0, 1, 0], 0), z0, { op: 0.32 })));
  // the carcase: its front board (carved with a door and a key, the order's mark), heavy posts, a stretcher
  I.woodFace([[x0, lo, z0], [x1, lo, z0], [x1, 0.02, z0], [x0, 0.02, z0]], '#4a3624', { bw: 0.22, stains: 0.4 });
  for (const XX of [x0 + 0.04, x1 - 0.04]) I.beam(XX - 0.04, XX + 0.04, 0, lo, z0 - 0.04, z0 + 0.04, WOOD, { knots: 0.6 });
  { const s = K(z0), [cx, cy] = P(0, 0.62, z0 - 0.005); raw(PLW([[0, 0, z0], [1, 0, z0], [0, 1, z0]], `<path d="M${f1(cx - s * 0.08)} ${f1(cy + s * 0.14)} L${f1(cx - s * 0.08)} ${f1(cy)} Q${f1(cx)} ${f1(cy - s * 0.13)} ${f1(cx + s * 0.08)} ${f1(cy)} L${f1(cx + s * 0.08)} ${f1(cy + s * 0.14)}" stroke="#1e140c" stroke-width="3" fill="none"/><path d="M${f1(cx - s * 0.08 + 1)} ${f1(cy + s * 0.14)} L${f1(cx - s * 0.08 + 1)} ${f1(cy + 1)} Q${f1(cx)} ${f1(cy - s * 0.12)} ${f1(cx + s * 0.08 - 1)} ${f1(cy + 1)}" stroke="#8a6a44" stroke-width="1" fill="none" opacity="0.6"/><circle cx="${f1(cx)}" cy="${f1(cy + s * 0.05)}" r="${f1(s * 0.014)}" fill="#1e140c"/><path d="M${f1(cx)} ${f1(cy + s * 0.06)} l0 ${f1(s * 0.05)}" stroke="#1e140c" stroke-width="2"/>`)); }
  // ---- the stopped pocket watch, hung on a nail on the desk front: brass case, a dent, the crystal cracked, its hands
  // stopped at eight minutes to midnight (Lucan has never set it going since the Spire)
  raw(S.peg(0.62, 0.74, z0 - 0.01, {}));
  figProp(0.62, 0.735, z0 - 0.02, (f, u) => {
    const r = 0.036 * u, c = [0, 0.08 * u];
    const ch = []; for (let k = 0; k <= 8; k++) { const t = k / 8; ch.push([Math.sin(t * Math.PI) * 0.012 * u - 0.006 * u * t, c[1] * 0.75 * t]); }
    f.line(ch, 1.8, '#1a120c', { dash: '1.5 1' }); f.line(ch, 1.0, BRASS, { dash: '1.5 1' });
    f.part(ell([0, c[1] - r * 1.05], r * 0.28, r * 0.22, 0, 10), { fill: BRASS, shade: 0.3, inkW: 1, cast: false, hatch: false });
    f.part(ell(c, r, r, 0, 24), { fill: BRASS, light: '#d8b870', shadow: '#4a3818', shade: 0.4, inkW: 1.5 });
    f.part(ell([c[0] - r * 0.05, c[1] + r * 0.02], r * 0.8, r * 0.8, 0, 22), { fill: '#e8e0c8', light: '#fffaf0', shade: 0.25, inkW: 1, cast: false, hatch: false });
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, p0 = [c[0] - r * 0.05 + Math.sin(a) * r * 0.68, c[1] + r * 0.02 - Math.cos(a) * r * 0.68], p1 = [c[0] - r * 0.05 + Math.sin(a) * r * 0.58, c[1] + r * 0.02 - Math.cos(a) * r * 0.58]; f.line([p0, p1], k % 3 ? 0.6 : 1.1, '#2a2018'); }
    const hc = [c[0] - r * 0.05, c[1] + r * 0.02], ah = (m, l, w) => f.line([hc, [hc[0] + Math.sin(m) * l, hc[1] - Math.cos(m) * l]], w, '#14100c');
    ah(-8 / 60 * Math.PI * 2, r * 0.6, 1.0); ah((11 + 52 / 60) / 12 * Math.PI * 2, r * 0.4, 1.6);
    f.line([[hc[0] - r * 0.5, hc[1] - r * 0.45], [hc[0] - r * 0.05, hc[1] - r * 0.05], [hc[0] + r * 0.35, hc[1] + r * 0.55]], 0.7, '#ffffff', { op: 0.8 });
    f.line([[c[0] + r * 0.45, c[1] - r * 0.7], [c[0] + r * 0.75, c[1] - r * 0.35]], 1.2, '#4a3818', { op: 0.8 });
    f.line([[c[0] - r * 0.6, c[1] - r * 0.5], [c[0] - r * 0.3, c[1] - r * 0.78]], 1.2, '#fff4d0', { op: 0.6 });
  }, { tag: false });
  // the slanted top: high at the back, low at the front
  const top = [[x0 - 0.05, hi, z1], [x1 + 0.05, hi, z1], [x1 + 0.05, lo, z0 - 0.05], [x0 - 0.05, lo, z0 - 0.05]];
  I.woodFace(top, WOODL, { bw: 0.17, stains: 0.6 });
  I.woodFace([[x0 - 0.05, lo, z0 - 0.05], [x1 + 0.05, lo, z0 - 0.05], [x1 + 0.05, lo - 0.06, z0 - 0.05], [x0 - 0.05, lo - 0.06, z0 - 0.05]], WOOD, { boards: 1, segs: 1 });
  raw('<g class="panel">');
  // ---- the Codex: a great book open on the slope, black letter in two columns, a red initial, a ribbon, the gutter
  const Y = z => lo + (hi - lo) * (z - z0 + 0.05) / (z1 - z0 + 0.05) + 0.03, cz0 = z0 + 0.05, cz1 = z1 - 0.06, w = 0.42;
  const pageL = [[-w, Y(cz0), cz0], [0, Y(cz0) + 0.02, cz0], [0, Y(cz1) + 0.02, cz1], [-w, Y(cz1), cz1]], pageR = [[0, Y(cz0) + 0.02, cz0], [w, Y(cz0), cz0], [w, Y(cz1), cz1], [0, Y(cz1) + 0.02, cz1]];
  const PL = [pageL[0], pageL[1], pageL[3]];
  raw(PLW(PL, cel([[-w - 0.03, Y(cz0) - 0.02, cz0 - 0.03], [w + 0.03, Y(cz0) - 0.02, cz0 - 0.03], [w + 0.03, Y(cz1) - 0.02, cz1 + 0.03], [-w - 0.03, Y(cz1) - 0.02, cz1 + 0.03]].map(p => P(...p)), { Z: z0, fill: '#3a1810', tex: 'url(#mottle)', texOp: 0.5 })));
  // the page block's edge, thick, gatherings showing
  { const e = [[-w, Y(cz0) - 0.01, cz0 - 0.005], [w, Y(cz0) - 0.01, cz0 - 0.005], [w, Y(cz0) + 0.005, cz0 - 0.005], [-w, Y(cz0) + 0.005, cz0 - 0.005]]; raw(PLW(PL, cel(e.map(p => P(...p)), { Z: z0, fill: '#c8b890', band: 0.6 }))); }
  for (const pg of [pageL, pageR]) {
    let t = cel(pg.map(p => P(...p)), { Z: z0, fill: VELLUM, tex: 'url(#mottle)', texOp: 0.35, band: 1.5 });
    for (const [ua, ub] of [[0.08, 0.46], [0.54, 0.92]]) for (let r = 0; r < 10; r++) { const zz = cz0 + 0.035 + r * (cz1 - cz0 - 0.07) / 9, xa = pg[0][0] + (pg[1][0] - pg[0][0]) * ua, xb = pg[0][0] + (pg[1][0] - pg[0][0]) * ub - R() * 0.03, A = P(xa, Y(zz) + 0.012, zz), B = P(xb, Y(zz) + 0.012, zz); t += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#2a201a" stroke-width="1.1" stroke-dasharray="3 1.2 5 1.2 2 1.2" opacity="0.8"/>`; }
    raw(PLW(PL, t));
  }
  { const [ix, iy] = P(-w + 0.08, Y(cz1 - 0.08) + 0.02, cz1 - 0.08), is = K(cz1); raw(PLW(PL, `<rect x="${f1(ix - is * 0.04)}" y="${f1(iy - is * 0.03)}" width="${f1(is * 0.08)}" height="${f1(is * 0.07)}" fill="#9a2a1a" stroke="${INK}" stroke-width="1"/><path d="M${f1(ix - is * 0.02)} ${f1(iy + is * 0.03)} l${f1(is * 0.02)} ${f1(-is * 0.045)} l${f1(is * 0.02)} ${f1(is * 0.045)}" stroke="#e2c472" stroke-width="1.4" fill="none"/>`)); }
  { const A = P(0, Y(cz0) + 0.022, cz0), B = P(0, Y(cz1) + 0.022, cz1); raw(PLW(PL, `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="2.2" opacity="0.85"/>`)); }
  { const A = P(0.02, Y(cz0) + 0.02, cz0), B = P(0.04, Y(cz0) - 0.25, cz0 - 0.02); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="4.4"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#8a1a14" stroke-width="2.8"/>`); }
  raw('</g>');
  // the candle on its pricket at the left end, the inkhorn in its hole, a skull for a paperweight at the back right
  figProp(x0 + 0.12, Y(z0 + 0.1) + 0.0, z0 + 0.05, (f, u) => { f.part([[-0.05 * u, 0], [0.05 * u, 0], [0.012 * u, -0.04 * u], [-0.012 * u, -0.04 * u]], { fill: '#3a3634', shade: 0.4, inkW: 1.1, cast: false }); KK.candle(f, [0, -0.04 * u], 0.16 * u, 0.04 * u, { drips: 3, fs: 6 }); });
  addLight(x0 + 0.12, 1.2, z0 - 0.1, 0.17, 2.4, [1.0, 0.74, 0.44]);
  addLight(x0 + 0.1, 1.3, z0 - 0.15, 0.7, 3.5, [1.0, 0.72, 0.42]);
  layer('fx'); raw(glow(...P(x0 + 0.12, Y(z0) + 0.25, z0 + 0.05), K(z0) * 0.7, K(z0) * 0.6, '#ffb060', 0.38)); layer('mid');
  figProp(x1 - 0.15, Y(z1 - 0.1), z1 - 0.1, (f, u) => { f.part([[-0.08 * u, 0], [-0.09 * u, -0.09 * u], [0, -0.14 * u], [0.08 * u, -0.1 * u], [0.06 * u, 0]], { fill: '#b8ae94', shade: 0.4, inkW: 1.3 }); f.flat(ell([-0.035 * u, -0.07 * u], 0.02 * u, 0.018 * u, 0, 8), '#14100c'); f.flat([[-0.07 * u, -0.035 * u], [-0.06 * u, -0.015 * u], [-0.05 * u, -0.035 * u]], '#14100c'); });
  figProp(x1 - 0.35, Y(z0 + 0.1), z0 + 0.1, (f, u) => { f.part([[-0.025 * u, 0], [0.025 * u, 0], [0.03 * u, -0.08 * u], [-0.02 * u, -0.09 * u]], { fill: '#2a2420', shade: 0.4, inkW: 1.1, cast: false }); f.line([[0.0, -0.085 * u], [0.06 * u, -0.26 * u]], 1.1, '#1a120c'); f.part([[0.06 * u, -0.26 * u], [0.09 * u, -0.23 * u], [0.04 * u, -0.12 * u], [0.025 * u, -0.13 * u]], { fill: '#d8d0bc', shade: 0.3, inkW: 0.8, cast: false }); });
  hot('codex', 'The open Codex', [pageL[0], pageR[1], pageR[2], pageL[3]].map(p => P(...p)));
});

// ================================================================== FG: a lectern with its chained book; a basket of vellum offcuts and the floor's mess
layer('fg');
prop(3.2, () => {
  const X = -1.85, Z = 3.2;
  raw(PLW(FLOOR, shadowPoly(castOn(S.boxPts(X - 0.35, X + 0.35, 0, 1.2, Z - 0.1, Z + 0.25), [0, 1, 0], 0), Z, { op: 0.28 })));
  for (const d of [-0.25, 0.25]) I.beam(Math.min(X, X + d) - 0.03, Math.max(X, X + d) + 0.03, 0, 0.06, Z + 0.05, Z + 0.15, WOOD);
  I.beam(X - 0.05, X + 0.05, 0, 1.0, Z + 0.02, Z + 0.12, WOOD, { knots: 0.6 });
  I.woodFace([[X - 0.35, 1.2, Z + 0.25], [X + 0.35, 1.2, Z + 0.25], [X + 0.35, 1.0, Z - 0.1], [X - 0.35, 1.0, Z - 0.1]], WOODL, { bw: 0.12 });
  const bk = [[X - 0.3, 1.03, Z - 0.06], [X + 0.3, 1.03, Z - 0.06], [X + 0.3, 1.21, Z + 0.22], [X - 0.3, 1.21, Z + 0.22]];
  let o = cel(bk.map(p => P(...p)), { Z, fill: '#4a1a14', band: 2 });
  o += cel([[X - 0.27, 1.035, Z - 0.04], [X - 0.01, 1.04, Z - 0.03], [X - 0.01, 1.215, Z + 0.2], [X - 0.27, 1.21, Z + 0.19]].map(p => P(...p)), { Z, fill: mix(VELLUM, '#8a7a5a', 0.3), band: 1 });
  o += cel([[X + 0.01, 1.04, Z - 0.03], [X + 0.27, 1.035, Z - 0.04], [X + 0.27, 1.21, Z + 0.19], [X + 0.01, 1.215, Z + 0.2]].map(p => P(...p)), { Z, fill: mix(VELLUM, '#8a7a5a', 0.2), band: 1 });
  for (let r = 0; r < 7; r++) { const t = 0.15 + r * 0.1; for (const [u0, u1] of [[-0.24, -0.04], [0.04, 0.24]]) { const A = P(X + u0, 1.04 + 0.17 * t, Z - 0.03 + 0.22 * t), B = P(X + u1, 1.04 + 0.17 * t, Z - 0.03 + 0.22 * t); o += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#3a3028" stroke-width="0.9" opacity="0.6"/>`; } }
  raw(PLW([bk[0], bk[1], bk[3]], o));
  // the chain from the book's board down to a ring on the post
  const ch = []; for (let k = 0; k <= 12; k++) { const t = k / 12; ch.push(P(X + 0.3 + 0.08 * Math.sin(t * 3), 1.05 - t * 0.55, Z - 0.05 + t * 0.12)); }
  raw(`<path d="${S.smooth(ch, false, 0.5)}" stroke="${INK}" stroke-width="4.6" fill="none" stroke-dasharray="4 2"/><path d="${S.smooth(ch, false, 0.5)}" stroke="#5a5450" stroke-width="2.6" fill="none" stroke-dasharray="4 2"/>`);
});
prop(3.3, () => {
  figProp(2.5, 0, 3.3, (f, u) => {
    const w = 0.24 * u, h = 0.3 * u;
    // the scraps behind the rim first: curled offcuts of vellum standing up out of the basket, every one a different shape
    for (let k = 0; k < 7; k++) { const x = -w * 0.75 + k * w * 0.25 + (f.r() - 0.5) * 6, ht = (0.05 + f.r() * 0.07) * u, lean = (f.r() - 0.5) * 14, ww = (0.04 + f.r() * 0.04) * u;
      f.part([[x - ww / 2, -h + 4], [x - ww / 2 + lean * 0.6, -h - ht * 0.7], [x + lean, -h - ht], [x + ww / 2 + lean * 0.8, -h - ht * 0.8], [x + ww / 2, -h + 4]], { fill: mix(VELLUM, '#8a7a5a', f.r() * 0.45), shade: 0.35, inkW: 1, cast: false, hatch: false }); if (f.r() < 0.5) f.line([[x - ww * 0.3, -h - ht * 0.3], [x + ww * 0.3 + lean * 0.5, -h - ht * 0.55]], 0.7, '#3a3028', { op: 0.6 }); }
    f.part([[-w, -h], [w, -h], [w * 0.85, 0], [-w * 0.85, 0]], { fill: '#6a5a3a', tex: PR.T(f, 'weave'), texOp: 0.8, shade: 0.45 });
    for (let k = 0; k < 4; k++) f.line([[-w * (1 - k * 0.03), -h + k * h / 4], [w * (1 - k * 0.03), -h + k * h / 4]], 1.2, '#3a2a18', { op: 0.6 });
    f.part(ell([0, -h], w, 0.03 * u, 0, 16), { fill: '#5a4a2e', shade: 0.3, inkW: 1.4, cast: false, tex: PR.T(f, 'weave'), texOp: 0.6 });
    // one scrap hung over the rim, a long curl lying on the floor beside it
    f.part([[w * 0.3, -h - 2], [w * 0.55, -h - 4], [w * 0.62, -h + 0.07 * u], [w * 0.4, -h + 0.06 * u]], { fill: mix(VELLUM, '#8a7a5a', 0.2), shade: 0.3, inkW: 1, cast: false, hatch: false });
    f.part([[w * 1.05, 0], [w * 1.6, -0.01 * u], [w * 1.7, -0.03 * u], [w * 1.5, -0.035 * u], [w * 1.1, -0.02 * u]], { fill: mix(VELLUM, '#8a7a5a', 0.3), shade: 0.3, inkW: 1, cast: false, hatch: false });
  });
  // a stool by it
  figProp(1.85, 0, 3.5, (f, u) => { for (const k of [-1, 0.2, 1]) { f.line([[k * 0.08 * u, -0.45 * u], [k * 0.17 * u, 0]], 5, '#1a120c'); f.line([[k * 0.08 * u, -0.45 * u], [k * 0.17 * u, 0]], 3, WOOD); } f.part(ell([0, -0.46 * u], 0.17 * u, 0.04 * u, 0, 14), { fill: mix(WOOD, '#8a7a60', 0.25), shade: 0.35, inkW: 1.4, tex: PR.T(f, 'wood'), texOp: 0.4 }); });
});
prop(3.0, () => {
  bookStack(-0.95, 3.35, 4); bookStack(1.45, 3.5, 2);
  lyingBook(1.1, 0, 3.0, 0.16, 0.12, 0.05, pickc(), 0.5);
  // the ink pot knocked over and its pool, quill shavings, pumice dust
  let o = ''; const [ix, iy] = P(0.75, 0, 3.0), is = K(3.0);
  o += `<path d="${S.smooth(S.blobST(0.85, 3.0, 0.32, 0.12, 12, 0.5).map(q => P(q[0], 0.002, q[1])), true, 0.6)}" fill="#0a0a0e" opacity="0.88"/>`;
  raw(PLW(FLOOR, o));
  figProp(0.62, 0, 2.98, (f, u) => { f.part([[-0.04 * u, 0], [0.04 * u, -0.01 * u], [0.05 * u, -0.06 * u], [-0.03 * u, -0.07 * u]], { fill: '#2a1e14', shade: 0.4, inkW: 1.3 }); f.part(ell([0.05 * u, -0.035 * u], 0.01 * u, 0.025 * u, 0, 8), { fill: '#0a0a0e', shade: 0.2, inkW: 1, cast: false, hatch: false }); });
  let sh = ''; for (let k = 0; k < 26; k++) { const [x, y] = P(-1.5 + R() * 3, 0, 2.7 + R() * 1.8); sh += `<path d="M${f1(x)} ${f1(y)} q${f1(3 + R() * 4)} -3 ${f1(6 + R() * 6)} 0" stroke="#b0a48a" stroke-width="1.2" fill="none" opacity="0.65"/>`; }
  for (let k = 0; k < 40; k++) { const [x, y] = P(-0.8 + R() * 1.6, 0, 3.5 + R() * 0.8); sh += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + R())}" fill="#8a8478" opacity="0.6"/>`; }
  raw(PLW(FLOOR, sh));
});

// ================================================================== write
I.write(KEEPER, {}, OUT, { veil: { op: 0.5, cut: 0.32 } });
