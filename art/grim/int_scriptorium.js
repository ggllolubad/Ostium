// The Scriptorium: Brother Lucan's long writing room. Three tall windows in the back wall let in the Grey, which is the
// only light good enough to write by; carrels sit under the outer two; book presses line the right wall; pages hang
// drying on cords across the room. Lucan stoops over his slanted desk at the front, the open Codex on it (the panel),
// writing every death in a beautiful hand. The door out is in the back wall at the far left.
const I = require('./interior')('scriptorium', { width: 10, depth: 9, height: 4.4, wall: '#5a5246', wall2: '#605848', floorCol: '#3e3a32', ceilCol: '#34281c', render: 3, renderCol: '#6a6456', seed: 2287, panel: 'codex', beamGap: 1.7 });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern, smoke } = I;
const DETAIL = process.env.PASS !== 'base';
const Pr = require('./props')(I);
const BOOKC = ['#5a2a1a', '#3a3a2a', '#6a5a3a', '#2a2a3a', '#7a6a4a', '#4a1a14', '#3a2a1a', '#2a3a2a', '#5a4a2a'];
const pickc = () => BOOKC[Math.floor(R() * BOOKC.length)];
// a lying book: cover on top, page block on the visible edges, boards proud of the pages, sometimes clasps or a bookmark
function lyingBook(X, Y, Z, w, d, t, col, rot = 0) {
  const c = Math.cos(rot), s0 = Math.sin(rot), at = (u, v, y) => [X + u * c - v * s0, Y + y, Z + u * s0 + v * c];
  const q = (pts, fill, ink) => face(pts, fill, ink, '', { plain: true });
  const b = t * 0.18;
  q([at(-w, -d, 0), at(w, -d, 0), at(w, -d, b), at(-w, -d, b)], dark(col, 0.2), 1);
  q([at(-w + 0.008, -d + 0.008, b), at(w - 0.008, -d + 0.008, b), at(w - 0.008, -d + 0.008, t - b), at(-w + 0.008, -d + 0.008, t - b)], mix(VELLUM, '#8a7a5a', R() * 0.5), 0.8);
  if (rot === 0 && X + w < 0) q([at(w, -d, 0), at(w, d, 0), at(w, d, t), at(w, -d, t)], col, 1);
  if (rot === 0 && X - w > 0) q([at(-w, -d, 0), at(-w, d, 0), at(-w, d, t), at(-w, -d, t)], col, 1);
  q([at(-w, -d, t - b), at(w, -d, t - b), at(w, -d, t), at(-w, -d, t)], dark(col, 0.1), 1);
  const top = [at(-w, -d, t), at(w, -d, t), at(w, d, t), at(-w, d, t)]; face(top, col, 1.1);
  a.raw(`<path d="${pp([at(-w + 0.03, -d + 0.03, t + 0.001), at(w - 0.03, -d + 0.03, t + 0.001), at(w - 0.03, d - 0.03, t + 0.001), at(-w + 0.03, d - 0.03, t + 0.001)])}" fill="none" stroke="${R() < 0.4 ? G.gold : dark(col, 0.4)}" stroke-width="1" opacity="0.7"/>`);
  if (R() < 0.35) a.raw(I.seg3(at(w * 0.2, -d, t * 0.5), at(w * 0.25, -d - 0.06, t * 0.1), '#8a1a14', 1.6));
  if (R() < 0.3) { const p = P(...at(w * 0.6, -d, t * 0.5)); a.raw(`<rect x="${f(p[0] - 2)}" y="${f(p[1] - 3)}" width="5" height="6" fill="${G.gold}" stroke="${INK}" stroke-width="0.6"/>`); }
}
function bookStack(X, Z, n, Y0 = 0) { let Y = Y0; for (let k = 0; k < n; k++) { const w = 0.12 + R() * 0.1, d = 0.09 + R() * 0.07, t = 0.035 + R() * 0.05; lyingBook(X + (R() - 0.5) * 0.06, Y, Z + (R() - 0.5) * 0.04, w, d, t, pickc(), (R() - 0.5) * 0.25); Y += t; } return Y; }

const WOOD = '#4a3624', WOODL = '#6a5034', VELLUM = '#d8ccae';
const KEEPER = { X: 0.45, Z: 4.55, h: 1.78, sprite: 'lucan', label: 'Brother Lucan', cutY: 1.0, cutZ: 4.0, figure: [150, 830] };
const DESK = { x0: -0.95, x1: 0.95, z0: 3.75, z1: 4.25, lo: 0.88, hi: 1.3 };

I.shell();
I.door(6.2, 7.2, { side: -1, ts: 2.0 });   // the stair down to the garth is in the west wall
for (const X of [-3.2, 0, 3.2]) I.backWindow(X - 0.55, X + 0.55, 1.5, 3.85, { I: 1.0, range: 7.5, sky: '#6a6a66', bars: 3 });

// ------------------------------------------------------------------ the carrels under the outer windows: a monk bent at each, writing by the Grey
for (const [X, who] of [[-2.65, false], [3.2, false]]) prop(7.6, () => {
  const x0 = X - 0.85, x1 = X + 0.85, z0 = 7.6, z1 = D1 - 0.02;
  I.woodBox(x0 - 0.05, x0, 0, 2.0, z0, z1, WOOD, { bw: 0.2 }); I.woodBox(x1, x1 + 0.05, 0, 2.0, z0, z1, WOOD, { bw: 0.2 });
  I.wood([[x0, 1.05, z0], [x1, 1.05, z0], [x1, 1.2, z1], [x0, 1.2, z1]], WOODL, { bw: 0.15 });
  I.wood([[x0, 0.95, z0], [x1, 0.95, z0], [x1, 1.05, z0], [x0, 1.05, z0]], WOOD, { boards: 1 });
  const sl = (X2, zz) => 1.05 + 0.15 * (zz - z0) / (z1 - z0);
  if (X < 0) {   // the left carrel: a book open on the slope, a pumice, an inkhorn, two books shut
    const pg = [[X - 0.35, sl(0, z0 + 0.15) + 0.01, z0 + 0.15], [X + 0.25, sl(0, z0 + 0.15) + 0.01, z0 + 0.15], [X + 0.25, sl(0, z0 + 0.55) + 0.01, z0 + 0.55], [X - 0.35, sl(0, z0 + 0.55) + 0.01, z0 + 0.55]];
    face(pg, VELLUM, 1.2); a.raw(I.seg3([X - 0.05, sl(0, z0 + 0.15) + 0.012, z0 + 0.15], [X - 0.05, sl(0, z0 + 0.55) + 0.012, z0 + 0.55], '#6a5a40', 1.2));
    for (let r = 0; r < 6; r++) { const zz = z0 + 0.2 + r * 0.055; for (const [u0, u1] of [[-0.31, -0.09], [-0.01, 0.21]]) a.raw(I.seg3([X + u0, sl(0, zz) + 0.012, zz], [X + u1 - R() * 0.05, sl(0, zz) + 0.012, zz], '#3a3028', 0.8, 0.6)); }
    bookStack(X + 0.6, z0 + 0.35, 2, 1.12);
    { const [hx, hy] = P(X - 0.6, 1.1, z0 + 0.2), s = K(z0); a.raw(`<path d="M${f(hx)} ${f(hy)} q${f(-s * 0.04)} ${f(-s * 0.08)} ${f(s * 0.02)} ${f(-s * 0.14)}" stroke="${INK}" stroke-width="${f(s * 0.035 + 2)}" fill="none" stroke-linecap="round"/><path d="M${f(hx)} ${f(hy)} q${f(-s * 0.04)} ${f(-s * 0.08)} ${f(s * 0.02)} ${f(-s * 0.14)}" stroke="#c8b890" stroke-width="${f(s * 0.035)}" fill="none" stroke-linecap="round"/><path d="M${f(hx + s * 0.02)} ${f(hy - s * 0.14)} l${f(s * 0.06)} ${f(-s * 0.16)}" stroke="#e8e0d0" stroke-width="1.4"/>`); }
  } else {       // the right carrel: loose quires weighted with a stone, a pen-knife, a dead candle in a puddle of wax
    for (let k = 0; k < 4; k++) { const u = -0.4 + R() * 0.3, zz = z0 + 0.15 + R() * 0.2, rot = (R() - 0.5) * 0.4, w = 0.14, d = 0.1, at = (p, q2) => [X + u + p * Math.cos(rot) - q2 * Math.sin(rot), sl(0, zz) + 0.012 + k * 0.003, zz + p * Math.sin(rot) + q2 * Math.cos(rot)];
      face([at(-w, -d), at(w, -d), at(w, d), at(-w, d)], mix(VELLUM, '#8a7a5a', R() * 0.4), 1, '', { plain: true }); }
    { const [sx, sy] = P(X - 0.2, 1.14, z0 + 0.3), s = K(z0); a.shape({ d: blob(sx, sy - s * 0.03, s * 0.05, R, 7, 0.25), fill: '#5a5650', depth: 3, ink: 1.3, hatch: 60 }); }
    a.raw(I.seg3([X + 0.15, 1.12, z0 + 0.12], [X + 0.32, 1.13, z0 + 0.2], G.steelL, 2) + I.seg3([X + 0.32, 1.13, z0 + 0.2], [X + 0.4, 1.135, z0 + 0.24], G.wood, 3));
    { const [wx, wy] = P(X + 0.55, 1.13, z0 + 0.3), s = K(z0); a.raw(`<ellipse cx="${f(wx)}" cy="${f(wy)}" rx="${f(s * 0.06)}" ry="${f(s * 0.015)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.7"/><rect x="${f(wx - 3)}" y="${f(wy - s * 0.05)}" width="6" height="${f(s * 0.05)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.8"/><path d="M${f(wx)} ${f(wy - s * 0.05)} l0 -4" stroke="${INK}" stroke-width="1.2"/>`); }
    a.raw(candles(X + 0.65, z0 + 0.45, 1, 1.18, 0.1));
  }
});
function S_folk(X, Z) { I.folk(X, Z, { pose: 'bend', col: '#4a4840', face: -1, arm: 'fold', lean: 0 }); }
// ------------------------------------------------------------------ book presses down the right wall, and a chained book on a lectern
prop(6.9, () => {
  const z0 = 6.9, z1 = D1 - 0.05, X = HW - 0.45;
  for (const Y of [0.1, 0.7, 1.3, 1.9, 2.5]) {
    I.wood([[X, Y, z0], [X, Y, z1], [HW, Y, z1], [HW, Y, z0]], WOODL, { bw: 0.15, nails: false });
    for (let z = z0 + 0.04; z < z1 - 0.05;) { const r = R();
      if (r < 0.08) { z += 0.15 + R() * 0.2; continue; }
      if (r < 0.2) { let yy = Y; for (let k = 0; k < 2 + Math.floor(R() * 3); k++) { const t = 0.04 + R() * 0.04, dd = 0.1 + R() * 0.06; face([[X + 0.02, yy, z], [X + 0.02, yy, z + dd * 2], [X + 0.02, yy + t, z + dd * 2], [X + 0.02, yy + t, z]], mix(VELLUM, '#6a5a40', R() * 0.5), 0.9, '', { plain: true }); a.raw(I.seg3([X + 0.021, yy + t, z], [X + 0.021, yy + t, z + dd * 2], pickc(), 2)); yy += t; } z += 0.28; continue; }
      const h = 0.24 + R() * 0.28, wd = 0.04 + R() * 0.05, col = pickc(), lean = R() < 0.12 ? 0.07 : 0;
      face([[X + 0.02, Y, z], [X + 0.02, Y, z + wd], [X + 0.02, Y + h, z + wd + lean], [X + 0.02, Y + h, z + lean]], col, 1.1);
      for (const tt of [0.15, 0.8]) if (R() < 0.7) a.raw(I.seg3([X + 0.021, Y + h * tt, z + lean * tt], [X + 0.021, Y + h * tt, z + wd + lean * tt], R() < 0.4 ? G.gold : INK, 1.1));
      z += wd + 0.008; }
  }
  face([[X, 0, z0], [X, 3.0, z0], [X + 0.1, 3.0, z0], [X + 0.1, 0, z0]], WOOD, 1.6);
});
prop(D1 - 0.45, () => {
  const x0 = 4.0, x1 = HW - 0.05, z = D1 - 0.45;
  I.woodBox(x0, x1, 0, 2.7, z, D1 - 0.02, WOOD, { bw: 0.2 });
  for (const Y of [0.15, 0.75, 1.35, 1.95]) {
    face([[x0 + 0.05, Y, z - 0.01], [x1 - 0.05, Y, z - 0.01], [x1 - 0.05, Y + 0.55, z - 0.01], [x0 + 0.05, Y + 0.55, z - 0.01]], '#1a140e', 1.2);
    for (let X = x0 + 0.08; X < x1 - 0.08;) { const r = R();
      if (r < 0.1) { X += 0.12 + R() * 0.12; continue; }
      if (r < 0.2) { bookStack(X + 0.14, z - 0.15, 2 + Math.floor(R() * 2), Y); X += 0.3; continue; }
      const h = 0.26 + R() * 0.26, wd = 0.035 + R() * 0.045, lean = R() < 0.1 ? 0.08 : 0, col = pickc(); face([[X, Y, z], [X + wd, Y, z], [X + wd + lean, Y + h, z], [X + lean, Y + h, z]], col, 1);
      for (const tt of [0.12, 0.85]) if (R() < 0.6) a.raw(I.seg3([X + lean * tt, Y + h * tt, z - 0.002], [X + wd + lean * tt, Y + h * tt, z - 0.002], R() < 0.4 ? G.gold : INK, 1.1));
      X += wd + 0.006; }
    face([[x0, Y - 0.04, z - 0.02], [x1, Y - 0.04, z - 0.02], [x1, Y, z - 0.02], [x0, Y, z - 0.02]], WOODL, 1.4);
  }
});
if (DETAIL) prop(3.6, () => {
  // books stacked on the floor, an ink pot knocked over, quill shavings and pumice dust
  bookStack(-0.95, 3.35, 4); bookStack(1.45, 3.5, 2); bookStack(2.05, 3.35, 6); lyingBook(1.15, 0, 3.0, 0.16, 0.12, 0.05, pickc(), 0.5);
  const [ix, iy] = P(0.9, 0, 3.0), is = K(3.0);
  a.raw(`<ellipse cx="${f(ix + is * 0.15)}" cy="${f(iy)}" rx="${f(is * 0.18)}" ry="${f(is * 0.04)}" fill="#0a0a0e" opacity="0.9"/><path d="M${f(ix - is * 0.05)} ${f(iy - is * 0.03)} l${f(is * 0.1)} ${f(-is * 0.02)} l${f(is * 0.02)} ${f(is * 0.07)} l${f(-is * 0.1)} ${f(is * 0.02)} Z" fill="#2a1e14" stroke="${INK}" stroke-width="1.4"/>`);
  let o = ''; for (let k = 0; k < 16; k++) { const [x, y] = P(-1.5 + R() * 3, 0, 2.8 + R() * 1.6); o += `<path d="M${f(x)} ${f(y)} q${f(3 + R() * 4)} ${f(-3)} ${f(6 + R() * 6)} 0" stroke="#a89c84" stroke-width="1.2" fill="none" opacity="0.6"/>`; } a.raw(o);
});
// cords across the room with pages pegged to dry: every leaf different, text, ruled, illuminated, scraped, a bifolium
for (const [Z, Y, xs, xe] of [[6.2, 3.1, -HW, 2.4], [5.2, 3.35, -3.6, 3.0]]) prop(Z, () => {
  const n = 16, pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, X = xs + (xe - xs) * t; pts.push([X, Y - Math.sin(t * Math.PI) * 0.35, Z]); }
  a.raw(`<path d="${smooth(pts.map(p => P(...p)), false, 0.5)}" stroke="${INK}" stroke-width="1.4" fill="none"/>`);
  const s = K(Z);
  for (let t = 0.03 + R() * 0.05; t < 0.97;) {
    const X = xs + (xe - xs) * t, Yc = Y - Math.sin(t * Math.PI) * 0.35, [x, y] = P(X, Yc, Z), kind = ['text', 'text', 'text2', 'illum', 'ruled', 'blank', 'bifol'][Math.floor(R() * 7)];
    const w = s * (kind === 'bifol' ? 0.2 : 0.07 + R() * 0.07), h = s * (0.14 + R() * 0.1), tone = mix(VELLUM, R() < 0.5 ? '#8a7a5a' : '#e8e0c8', R() * 0.5), sw = (R() - 0.5) * 6, curl = R() < 0.3;
    const d = `M${f(x - w)} ${f(y)} L${f(x + w)} ${f(y + 1)} L${f(x + w * 0.96 + sw * 0.3)} ${f(y + h)} ${curl ? `Q${f(x + w * 0.8)} ${f(y + h - s * 0.04)} ${f(x + w * 0.6)} ${f(y + h - 1)}` : ''} L${f(x - w * 0.98 + sw * 0.3)} ${f(y + h - 2)} Z`;
    const L = [];
    if (kind === 'text' || kind === 'illum' || kind === 'bifol') { const cols = kind === 'bifol' ? 2 : 1, cw = (w * 2) / cols; for (let cI = 0; cI < cols; cI++) for (let r = 0; r < 7 + Math.floor(R() * 5); r++) { const ly = y + h * 0.14 + r * h * 0.07; if (ly > y + h * 0.9) break; const lx = x - w + cI * cw + cw * 0.15 + (kind === 'illum' && r < 3 ? cw * 0.3 : 0); L.push({ d: `M${f(lx)} ${f(ly)} l${f(cw * 0.7 * (r % 6 === 5 ? 0.5 : 0.85 + R() * 0.15) - (kind === 'illum' && r < 3 ? cw * 0.3 : 0))} 0`, w: 0.7, col: '#2a2018', op: 0.65 }); } }
    if (kind === 'text2') for (let r = 0; r < 10; r++) for (const cI of [0, 1]) L.push({ d: `M${f(x - w * 0.85 + cI * w * 0.95)} ${f(y + h * 0.12 + r * h * 0.075)} l${f(w * 0.75)} 0`, w: 0.6, col: '#2a2018', op: 0.6 });
    if (kind === 'ruled') for (let r = 0; r < 12; r++) L.push({ d: `M${f(x - w * 0.85)} ${f(y + h * 0.1 + r * h * 0.07)} l${f(w * 1.7)} 0`, w: 0.4, col: '#8a6a5a', op: 0.5 });
    if (kind === 'bifol') L.push({ d: `M${f(x)} ${f(y)} L${f(x + sw * 0.15)} ${f(y + h)}`, w: 1, col: '#6a5a40', op: 0.7 });
    let dec = R() < 0.4 ? a.stain(x + (R() - 0.5) * w, y + h * (0.3 + R() * 0.5), w * 0.3, '#5a4a2a', 0.35) : '';
    if (kind === 'illum') dec += `<rect x="${f(x - w * 0.82)}" y="${f(y + h * 0.1)}" width="${f(w * 0.5)}" height="${f(h * 0.24)}" fill="${['#8a1a14', '#2a3a6a', '#3a5a2a'][Math.floor(R() * 3)]}" stroke="${G.gold}" stroke-width="1.2"/><path d="M${f(x - w * 0.7)} ${f(y + h * 0.3)} l${f(w * 0.12)} ${f(-h * 0.14)} l${f(w * 0.12)} ${f(h * 0.14)}" stroke="${G.goldL}" stroke-width="1.4" fill="none"/><path d="M${f(x - w * 0.9)} ${f(y + h * 0.1)} L${f(x - w * 0.9)} ${f(y + h * 0.9)}" stroke="${G.gold}" stroke-width="1" opacity="0.8"/>`;
    else if (kind !== 'blank' && kind !== 'ruled' && R() < 0.5) dec += `<rect x="${f(x - w * 0.75)}" y="${f(y + h * 0.1)}" width="${f(w * 0.18)}" height="${f(h * 0.1)}" fill="#9a2a1a"/>`;
    a.shape({ d, fill: tone, depth: 3, ink: 1.1, hatch: 0, core: false, hl: false, lines: L, decals: dec });
    for (const px of kind === 'bifol' ? [x - w * 0.6, x + w * 0.6] : [x]) a.raw(`<rect x="${f(px - 2)}" y="${f(y - 4)}" width="4" height="7" fill="${mix(G.wood, '#8a7a5a', R())}" stroke="${INK}" stroke-width="0.6"/>`);
    t += (w * 2) / s / (xe - xs) + 0.012 + R() * 0.05 + (R() < 0.12 ? 0.08 : 0);
  }
});
// ------------------------------------------------------------------ the Grey's shafts from the windows (painted cue, unlit preview only)
a.raw(`<g class="glow">${[-3.2, 0, 3.2].map(X => `<path d="${pp([[X - 0.55, 3.8, D1], [X + 0.55, 3.8, D1], [X + 1.6, 0, D1 - 4], [X + 0.2, 0, D1 - 4]])}" fill="#d8d8d0" opacity="0.05"/>`).join('')}</g>`);

// ================================================================== MID: Lucan's desk and the open Codex
a.layer('mid');
prop(DESK.z0, () => {
  const { x0, x1, z0, z1, lo, hi } = DESK, s = K(z0);
  for (const [X, Z] of [[x0 + 0.08, z0 + 0.05], [x1 - 0.08, z0 + 0.05]]) a.raw(rod([X, 0, Z], [X, lo, Z], WOOD, 9));
  a.raw(rod([x0 + 0.08, 0.25, z0 + 0.05], [x1 - 0.08, 0.25, z0 + 0.05], WOOD, 6));
  // the front panel of the desk, carved with a door and a key
  a.raw(planks((u, t) => [x0 + u, 0.02 + t, z0], x1 - x0, lo - 0.02, '#4a3624', { board: 0.22, nails: 6 }));
  shade([[x0, 0.02, z0], [x1, 0.02, z0], [x1, lo, z0], [x0, lo, z0]], { depth: 10, mottle: 0.5, grime: 0.5, ink: 2, wash: 0.3 });
  { const [cx, cy] = P(0, 0.68, z0 - 0.01); a.raw(`<path d="M${f(cx - s * 0.08)} ${f(cy + s * 0.12)} L${f(cx - s * 0.08)} ${f(cy - s * 0.02)} Q${f(cx)} ${f(cy - s * 0.14)} ${f(cx + s * 0.08)} ${f(cy - s * 0.02)} L${f(cx + s * 0.08)} ${f(cy + s * 0.12)}" stroke="#2a1e14" stroke-width="3" fill="none"/>`); }
  // the slanted top: high at the back, low at the front
  const top = [[x0 - 0.05, lo, z0 - 0.05], [x1 + 0.05, lo, z0 - 0.05], [x1 + 0.05, hi, z1], [x0 - 0.05, hi, z1]];
  I.wood(top, WOODL, { bw: 0.17 });
  face([[x0 - 0.05, lo - 0.06, z0 - 0.05], [x1 + 0.05, lo - 0.06, z0 - 0.05], [x1 + 0.05, lo, z0 - 0.05], [x0 - 0.05, lo, z0 - 0.05]], WOOD, 1.6);
  a.raw('<g class="panel">');
  // the Codex: a great book open on the slope, black letter and a red initial, a ribbon, the gutter
  const Y = (z) => lo + (hi - lo) * (z - z0 + 0.05) / (z1 - z0 + 0.05) + 0.03, cz0 = z0 + 0.05, cz1 = z1 - 0.06, w = 0.42;
  const pageL = [[-w, Y(cz0), cz0], [0, Y(cz0) + 0.02, cz0], [0, Y(cz1) + 0.02, cz1], [-w, Y(cz1), cz1]], pageR = [[0, Y(cz0) + 0.02, cz0], [w, Y(cz0), cz0], [w, Y(cz1), cz1], [0, Y(cz1) + 0.02, cz1]];
  face([[-w - 0.03, Y(cz0) - 0.02, cz0 - 0.03], [w + 0.03, Y(cz0) - 0.02, cz0 - 0.03], [w + 0.03, Y(cz1) - 0.02, cz1 + 0.03], [-w - 0.03, Y(cz1) - 0.02, cz1 + 0.03]], '#3a1810', 1.8);
  for (const pg of [pageL, pageR]) {
    face(pg, VELLUM, 1.4);
    let t = '';
    for (let r = 0; r < 9; r++) { const zz = cz0 + 0.04 + r * (cz1 - cz0 - 0.08) / 8, xa = pg[0][0] + 0.05, xb = pg[1][0] - 0.05; t += `<path d="${pp([[xa, Y(zz) + 0.01, zz], [xb - R() * 0.05, Y(zz) + 0.01, zz]]).replace(' Z', '')}" stroke="#2a201a" stroke-width="1.2" stroke-dasharray="3 1.5 6 1.5 2 1.5" opacity="0.8"/>`; }
    a.raw(t);
  }
  { const [ix, iy] = P(-w + 0.08, Y(cz1 - 0.08) + 0.02, cz1 - 0.08), is = K(cz1); a.raw(`<rect x="${f(ix - is * 0.04)}" y="${f(iy - is * 0.03)}" width="${f(is * 0.08)}" height="${f(is * 0.07)}" fill="#9a2a1a" stroke="${INK}" stroke-width="1"/><rect x="${f(ix - is * 0.025)}" y="${f(iy - is * 0.015)}" width="${f(is * 0.05)}" height="${f(is * 0.04)}" fill="${G.goldL}" opacity="0.8"/>`); }
  a.raw(`<path d="${pp([[0.02, Y(cz0) + 0.02, cz0], [0.04, Y(cz0) - 0.25, cz0 - 0.02]]).replace(' Z', '')}" stroke="#8a1a14" stroke-width="3"/>`);
  a.raw('</g>');
  // the ink horn in its hole, a candle on a pricket, the pen-knife, a skull for a paperweight
  a.raw(candles(x0 + 0.12, z0 + 0.05, 1, lo + 0.02, 0.1));
  addLight(x0 + 0.1, 1.3, z0 - 0.15, 0.7, 3.5, [1.0, 0.72, 0.42]);
  { const [kx, ky] = P(x0 + 0.15, hi, z1 - 0.1), ks = K(z1); a.shape({ d: smooth([[kx - ks * 0.08, ky], [kx - ks * 0.09, ky - ks * 0.09], [kx, ky - ks * 0.14], [kx + ks * 0.08, ky - ks * 0.1], [kx + ks * 0.06, ky]], true, 0.5), fill: '#b8ae94', depth: 4, ink: 1.4, hatch: 60, after: `<ellipse cx="${f(kx - ks * 0.04)}" cy="${f(ky - ks * 0.07)}" rx="${f(ks * 0.02)}" ry="${f(ks * 0.018)}" fill="${INK}"/>` }); }
  hot('codex', 'The open Codex', [pageL[0], pageR[1], pageR[2], pageL[3]].map(p => P(...p)));
});

// ================================================================== FG
a.layer('fg');
// near left: a lectern with a chained book; near right: a basket of scraped vellum offcuts and a stool
prop(3.2, () => {
  const X = -1.85, Z = 3.2, s = K(Z);
  a.raw(rod([X, 0, Z], [X, 1.05, Z], WOOD, 12));
  for (const d of [-0.25, 0.25]) a.raw(rod([X, 0.05, Z], [X + d, 0, Z + 0.1], WOOD, 8));
  const tp = [[X - 0.35, 1.0, Z - 0.1], [X + 0.35, 1.0, Z - 0.1], [X + 0.35, 1.2, Z + 0.25], [X - 0.35, 1.2, Z + 0.25]];
  I.wood(tp, WOODL, { bw: 0.12 });
  face([[X - 0.3, 1.03, Z - 0.06], [X + 0.3, 1.03, Z - 0.06], [X + 0.3, 1.21, Z + 0.22], [X - 0.3, 1.21, Z + 0.22]], '#4a1a14', 1.8);
  face([[X - 0.27, 1.035, Z - 0.04], [X - 0.01, 1.04, Z - 0.03], [X - 0.01, 1.215, Z + 0.2], [X - 0.27, 1.21, Z + 0.19]], mix(VELLUM, '#8a7a5a', 0.3), 1.2);
  face([[X + 0.01, 1.04, Z - 0.03], [X + 0.27, 1.035, Z - 0.04], [X + 0.27, 1.21, Z + 0.19], [X + 0.01, 1.215, Z + 0.2]], mix(VELLUM, '#8a7a5a', 0.2), 1.2);
  for (let r = 0; r < 7; r++) { const t = 0.15 + r * 0.1; for (const [u0, u1] of [[-0.24, -0.04], [0.04, 0.24]]) a.raw(I.seg3([X + u0, 1.04 + 0.17 * t, Z - 0.03 + 0.22 * t], [X + u1, 1.04 + 0.17 * t, Z - 0.03 + 0.22 * t], '#3a3028', 0.8, 0.6)); }
  { const ch = []; for (let k = 0; k <= 10; k++) { const t = k / 10; ch.push(P(X + 0.3 + 0.08 * Math.sin(t * 3), 1.05 - t * 0.95, Z - 0.05 + t * 0.1)); } a.raw(`<path d="${smooth(ch, false, 0.5)}" stroke="${INK}" stroke-width="4" fill="none" stroke-dasharray="4 2"/><path d="${smooth(ch, false, 0.5)}" stroke="#5a5450" stroke-width="2.4" fill="none" stroke-dasharray="4 2"/>`); }
});
prop(3.3, () => {
  const [x, y] = P(2.5, 0, 3.3), s = K(3.3);
  a.shape({ d: `M${f(x - s * 0.24)} ${f(y - s * 0.32)} L${f(x + s * 0.24)} ${f(y - s * 0.32)} L${f(x + s * 0.2)} ${f(y)} L${f(x - s * 0.2)} ${f(y)} Z`, fill: '#6a5a3a', depth: 6, ink: 2, hatch: 90, tex: 'url(#weave)', texOp: 0.8 });
  for (let k = 0; k < 7; k++) a.raw(`<path d="M${f(x - s * 0.2 + k * s * 0.06)} ${f(y - s * 0.32)} l${f((R() - 0.5) * 16)} ${f(-s * (0.05 + R() * 0.1))} l${f(s * 0.05)} ${f(s * 0.02)} Z" fill="${VELLUM}" stroke="${INK}" stroke-width="1.2"/>`);
});

I.write(KEEPER);
