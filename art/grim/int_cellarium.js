// The Cellarium: Godric's stores under the west range. A cold barrel vault, casks racked two high along the back wall,
// sacks of grain heaped at the right, bundles of candles counted onto a rack at the left, hams and sausages hung from the
// vault, loaves on boards. Godric stands hugging his candles beside the tally board (the panel), where every candle and
// loaf is notched on a stick. The door out is in the back wall at the far left.
const I = require('./interior')('cellarium', { width: 11, depth: 9, height: 4.2, vault: true, spring: 2.7, wall: '#4e483e', wall2: '#555046', vaultCol: '#48423a', floorCol: '#3a342c', seed: 5813, panel: 'tally', ribs: [6.2, 3.9] });
const { a, R, P, K, pp, f, G, INK, mix, dark, light, smooth, blob, PLW, EM, addLight, stones, shade, planks, through, hot, outline, HOT, HW, D1, HT, prop, face, box, rod, seg3, candles, lantern, smoke, barrel, sack } = I;
const DETAIL = process.env.PASS !== 'base';
const WOOD = '#4a3624', WOODL = '#6a5034', WAX = '#d8ccaa';
const KEEPER = { X: 0.6, Z: 4.45, h: 1.68, sprite: 'godric', label: 'Godric', figure: [195, 830] };
const TB = { x0: -1.65, x1: -0.45, z: 4.2, y0: 0.8, y1: 1.85 };

I.shell();
I.door(6.7, 7.7, { side: 1, ts: 1.95 });   // the cellarium's garth door faces east

const Pr = require('./props')(I);
// ------------------------------------------------------------------ the cask racks along the back wall, two tiers
// Every cask is its own: big tuns, small kegs, one tapped with a cup under the spigot, gaps where stock has gone out.
{
  const z = D1 - 0.55, zc = z - 0.4;
  prop(z, () => {
    for (const X of [-3.75, -1.75, 0.55, 2.95, 4.9]) I.woodBox(X - 0.07, X + 0.07, 0, 2.1, zc - 0.06, zc + 0.06, dark(WOOD, 0.1), { knots: 0.2 });
    for (const Y of [0.1, 1.05]) I.wood([[-3.82, Y, zc - 0.08], [4.97, Y, zc - 0.08], [4.97, Y + 0.13, zc - 0.08], [-3.82, Y + 0.13, zc - 0.08]], mix(WOOD, '#2a1e14', R() * 0.3), { boards: 1, knots: 0.6 });
    // bottom tier sits on the cradle top at 0.23, top tier at 1.18
    for (const [X, r, o] of [[-3.25, 0.47], [-2.27, 0.41], [-1.2, 0.46, { tap: true }], [0.0, 0.44], [1.06, 0.4], [2.42, 0.47], [3.52, 0.43], [4.45, 0.32]]) Pr.caskHead(X, 0.23 + r, zc - 0.12, r, o || {});
    for (const [X, r] of [[-3.25, 0.31], [-2.62, 0.3], [-1.55, 0.43], [0.42, 0.45], [1.42, 0.3], [2.05, 0.31], [3.1, 0.46]]) Pr.caskHead(X, 1.18 + r, zc - 0.12, r);
    // the empty berth at the top right: a cup and a candle end left on the cradle
    Pr.food(4.2, 1.18, zc - 0.12, 'crock');
    a.raw(candles(4.6, zc - 0.12, 1, 1.18, 0.05));
    // the tapped cask's cup on the floor below its spigot, and a wet stain spreading
    const [dx, dy] = P(-1.0, 0, zc - 0.35), s = K(zc - 0.35);
    a.raw(a.stain(dx, dy, s * 0.22, '#1a0a06', 0.55));
    Pr.food(-1.0, 0, zc - 0.35, 'crock');
  });
  // at the rack's foot: a cheese wheel stack, jugs, a funnel
  prop(7.55, () => {
    for (let k = 0; k < 3; k++) Pr.food(1.75 + (R() - 0.5) * 0.05, k * 0.065, 7.55, 'cheese', 0.14 - k * 0.012);
    Pr.food(2.4, 0, 7.6, 'crock'); Pr.food(2.62, 0, 7.45, 'crock');
    Pr.bottle(-2.8, 0, 7.55, '#3a5a2a'); Pr.bottle(-2.62, 0, 7.5);
  });
}
// the candle rack on the left: three shelves stocked unevenly, bundles of every length, one tipped over, a box of stubs
prop(6.0, () => {
  const x0 = -5.45, x1 = -4.1, z0 = 6.0, z1 = 6.5;
  for (const X of [x0 + 0.05, x1 - 0.05]) I.woodBox(X - 0.05, X + 0.05, 0, 1.95, z0 - 0.05, z0 + 0.05, dark(WOOD, 0.1), { knots: 0.2 });
  const stock = [[{ X: -5.28, n: 7 }, { X: -5.0, n: 5 }, { X: -4.7, lay: true }, { X: -4.35, n: 4 }], [{ X: -5.3, n: 3 }, { X: -5.1, n: 8 }, { X: -4.6, box: true }, { X: -4.25, n: 6 }], [{ X: -5.25, n: 5 }, { X: -4.95, lay: true }, { X: -4.55, crock: true }, { X: -4.3, n: 9 }]];
  [0.5, 1.05, 1.6].forEach((Y, i) => {
    I.wood([[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]], mix(WOODL, '#2a1e14', R() * 0.3), { bw: 0.17, knots: 0.3 });
    I.wood([[x0, Y - 0.05, z0], [x1, Y - 0.05, z0], [x1, Y, z0], [x0, Y, z0]], WOOD, { boards: 1 });
    for (const it of stock[i]) {
      if (it.box) { I.woodBox(it.X - 0.14, it.X + 0.14, Y, Y + 0.12, z0 + 0.12, z0 + 0.32, '#5a4430', { knots: 0 }); const [bx, by] = P(it.X, Y + 0.12, z0 + 0.2), s = K(z0); for (let k = 0; k < 9; k++) a.raw(`<rect x="${f(bx - s * 0.11 + R() * s * 0.2)}" y="${f(by - s * (0.02 + R() * 0.05))}" width="${f(s * 0.02)}" height="${f(s * (0.03 + R() * 0.05))}" fill="${mix(WAX, '#8a7a5a', R() * 0.4)}" stroke="${INK}" stroke-width="0.5" transform="rotate(${f((R() - 0.5) * 50)} ${f(bx)} ${f(by)})"/>`); }
      else if (it.crock) Pr.food(it.X, Y, z0 + 0.2, 'crock');
      else Pr.candleBundle(it.X, Y, z0 + 0.15, { n: it.n, lay: it.lay });
    }
    // under the shelf: a dipping rod with pairs of new candles hung by their joined wicks to harden
    if (i > 0) { const Yr = Y - 0.09; a.raw(rod([x0 + 0.08, Yr, z0 + 0.06], [x1 - 0.08, Yr, z0 + 0.06], '#6a5034', 3));
      for (let X = x0 + 0.16; X < x1 - 0.12; X += 0.11 + R() * 0.06) { if (R() < 0.2) continue; const [hx, hy] = P(X, Yr, z0 + 0.06), s = K(z0), l = s * (0.16 + R() * 0.06), cw = s * 0.022;
        a.raw(`<path d="M${f(hx - cw)} ${f(hy + 3)} Q${f(hx)} ${f(hy - 4)} ${f(hx + cw)} ${f(hy + 3)}" stroke="${INK}" stroke-width="0.9" fill="none"/>` + [-1, 1].map(d => `<path d="M${f(hx + d * cw - cw * 0.45)} ${f(hy + 3)} L${f(hx + d * cw + cw * 0.45)} ${f(hy + 3)} L${f(hx + d * cw + cw * 0.3)} ${f(hy + 3 + l)} Q${f(hx + d * cw)} ${f(hy + 6 + l)} ${f(hx + d * cw - cw * 0.3)} ${f(hy + 3 + l)} Z" fill="${mix(WAX, '#fff4e0', R() * 0.3)}" stroke="${INK}" stroke-width="0.7"/><path d="M${f(hx + d * cw - cw * 0.15)} ${f(hy + 6)} l0 ${f(l * 0.8)}" stroke="#fff8e8" stroke-width="0.6" opacity="0.5"/>`).join('')); } }
  });
});
// sacks of grain heaped at the left front: four different sacks, the top one open on grain
prop(5.75, () => Pr.sack(-4.55, 0, 5.75));
prop(5.6, () => Pr.sack(-3.85, 0, 5.55));
prop(5.55, () => Pr.sack(-4.2, 0.38, 5.62, { open: true }));
prop(5.3, () => Pr.sack(-3.15, 0, 5.3));
prop(5.4, () => { let o = ''; for (let k = 0; k < 50; k++) { const [x, y] = P(-2.95 + R() * 0.55 * R(), 0, 5.0 + R() * 0.4); o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1.6 + R())}" ry="${f(0.8 + R() * 0.5)}" fill="${mix('#c8b070', '#8a7040', R() * 0.5)}" stroke="${INK}" stroke-width="0.4"/>`; } a.raw(o); });
// the hanging board out of the rats' reach: a round loaf, a long one, a loaf already cut, a cheese, a crock of dripping
prop(6.0, () => {
  const z = 6.0, Y = 2.0, x0 = 1.0, x1 = 2.8;
  for (const X of [x0 + 0.1, x1 - 0.1]) a.raw(seg3([X, Y, z], [X, I.Yv(X) - 0.05, z], '#3a3026', 1.8));
  I.wood([[x0, Y, z - 0.25], [x1, Y, z - 0.25], [x1, Y, z + 0.25], [x0, Y, z + 0.25]], WOODL, { bw: 0.25, knots: 0.5 });
  I.wood([[x0, Y - 0.06, z - 0.25], [x1, Y - 0.06, z - 0.25], [x1, Y, z - 0.25], [x0, Y, z - 0.25]], WOOD, { boards: 1 });
  Pr.food(1.2, Y, z, 'round'); Pr.food(1.62, Y, z + 0.05, 'long'); Pr.food(2.05, Y, z - 0.05, 'cut'); Pr.food(2.38, Y, z, 'cheese'); Pr.food(2.66, Y, z + 0.08, 'crock');
});
// stores hung from hooks in the vault: two hams of different cure, onions, garlic, dried fish, a sausage string
for (const [X, Z, kind] of [[-1.3, 6.3, 'ham'], [-0.6, 6.4, 'onions'], [1.9, 5.3, 'fish'], [-2.9, 5.0, 'saus'], [3.1, 4.6, 'ham'], [-2.2, 6.6, 'garlic'], [4.3, 6.9, 'onions']]) prop(Z, () => Pr.hanging(X, I.Yv(X) - 0.02, Z, kind));
// a lantern on a hook in the left rib, and the tally candle
prop(4.3, () => { const [lx, ly] = P(1.35, 2.15, 4.3), [tx, ty] = P(1.35, I.Yv(1.35) - 0.05, 4.3), s = K(4.3) * 0.13; a.raw(`<path d="M${f(tx)} ${f(ty)} L${f(lx)} ${f(ly - s * 1.6)}" stroke="${INK}" stroke-width="3" stroke-dasharray="4 2"/>` + lantern(lx, ly, s, [1.35, 2.1, 4.25, 1.3, 5.5])); });

// ================================================================== FG and the tally board
a.layer('fg');
// the tally board: a plank on a trestle, hung with notched sticks in rows, chalk columns, a candle stub on its ledge
prop(TB.z, () => I.panel(() => {
  const { x0, x1, z, y0, y1 } = TB, s = K(z);
  for (const [X, d] of [[x0 + 0.15, -0.12], [x1 - 0.15, 0.12]]) a.raw(rod([X - d, 0, z + 0.2], [X, y0 + 0.2, z + 0.02], WOOD, 6) + rod([X + d, 0, z - 0.2], [X, y0 + 0.2, z - 0.02], WOOD, 6));
  a.raw(planks((u, t) => [x0 + u, y0 + t, z], x1 - x0, y1 - y0, '#5a4430', { board: 0.25, nails: 8 }));
  shade([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], { depth: 12, mottle: 0.5, grime: 0.5, ink: 2, wash: 0.3 });
  // pegs and the hanging tally sticks: hazel, split, notched, a row per store
  for (let r = 0; r < 2; r++) { const Y = y1 - 0.12 - r * 0.48;
    for (let k = 0; k < 5; k++) { const X = x0 + 0.17 + k * 0.215, [px, py] = P(X, Y, z - 0.02), len = s * (0.22 + R() * 0.08);
      a.raw(`<circle cx="${f(px)}" cy="${f(py)}" r="2.4" fill="${INK}"/><path d="M${f(px)} ${f(py + 2)} L${f(px + 1)} ${f(py + len)}" stroke="${INK}" stroke-width="${f(s * 0.03 + 2)}" stroke-linecap="round"/><path d="M${f(px)} ${f(py + 2)} L${f(px + 1)} ${f(py + len)}" stroke="#b8a074" stroke-width="${f(s * 0.03)}" stroke-linecap="round"/>` +
        Array.from({ length: 3 + Math.floor(R() * 5) }, (_, n) => `<path d="M${f(px - s * 0.02)} ${f(py + 8 + n * len / 8)} l${f(s * 0.04)} ${f(-s * 0.012)}" stroke="#1a120a" stroke-width="2.2"/>`).join('')); } }
  // a chalked count down the side, crossed out and redone
  let ch = ''; const [cx, cy] = P(x1 - 0.12, y1 - 0.15, z - 0.01);
  for (let r = 0; r < 8; r++) ch += `<path d="M${f(cx - s * 0.06)} ${f(cy + r * s * 0.07)} ${Array.from({ length: 4 }, (_, k) => `M${f(cx - s * 0.06 + k * 4)} ${f(cy + r * s * 0.07)} l0 ${f(s * 0.05)}`).join(' ')} M${f(cx - s * 0.07)} ${f(cy + r * s * 0.07 + s * 0.04)} l${f(s * 0.08)} ${f(-s * 0.03)}" stroke="#e8e0d0" stroke-width="1.8" opacity="${r < 5 ? 0.85 : 0.5}"/>`;
  ch += `<path d="M${f(cx - s * 0.08)} ${f(cy + s * 0.1)} L${f(cx + s * 0.03)} ${f(cy + s * 0.3)}" stroke="#d8d0c0" stroke-width="1.6" opacity="0.5"/>`;
  a.raw(ch);
  face([[x0 - 0.05, y0 - 0.02, z - 0.15], [x1 + 0.05, y0 - 0.02, z - 0.15], [x1 + 0.05, y0 - 0.02, z], [x0 - 0.05, y0 - 0.02, z]], WOODL, 1.6);
  a.raw(candles(x0 + 0.3, z - 0.08, 1, y0 - 0.02, 0.1));
  hot('tally', 'The tally board', [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);
}));
prop(3.3, () => {
  // a cask lying on its side on chocks, its head toward the left
  Pr.caskSide(2.2, 0.0, 3.4, 0.3, 1.05);
  for (const dx of [-0.35, 0.35]) { const [wx, wy] = P(2.2 + dx, 0, 3.4); a.raw(`<path d="M${f(wx - 10)} ${f(wy)} L${f(wx + 10)} ${f(wy)} L${f(wx)} ${f(wy - 14)} Z" fill="${WOOD}" stroke="${INK}" stroke-width="1.6"/>`); }
});
prop(5.85, () => { a.raw(rod([-0.4, 0, 5.75], [-0.05, 2.55, 6.55], WOOD, 6) + rod([0.05, 0, 5.75], [0.4, 2.55, 6.55], WOOD, 6)); for (let k = 1; k < 8; k++) { const t = k / 8; a.raw(rod([-0.4 + 0.35 * t, 2.55 * t, 5.75 + 0.8 * t], [0.05 + 0.35 * t, 2.55 * t, 5.75 + 0.8 * t], WOOD, 4)); } });
if (DETAIL) prop(3.6, () => {
  // straw and spilled grain, wax drips, a coil of rope and a dropped mitten across the near floor
  let o = '';
  for (let k = 0; k < 70; k++) { const [x, y] = P(-3 + R() * 6, 0, 2.7 + R() * 1.8); o += `<path d="M${f(x)} ${f(y)} l${f((R() - 0.5) * 18)} ${f((R() - 0.5) * 4)}" stroke="${R() < 0.5 ? '#a8904a' : '#7a6a3a'}" stroke-width="1.5" opacity="0.8"/>`; }
  for (let k = 0; k < 40; k++) { const [x, y] = P(-0.8 + R() * 1.6, 0, 4.6 + R() * 0.5); o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="2.2" ry="1" fill="#c8b070"/>`; }
  for (let k = 0; k < 8; k++) { const [x, y] = P(-1.2 + R() * 2.4, 0, 3.6 + R() * 1.0); o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(3 + R() * 4)}" ry="${f(1.5 + R() * 1.5)}" fill="${WAX}" stroke="${INK}" stroke-width="0.6"/>`; }
  const [rx, ry] = P(1.0, 0, 3.0), rs = K(3.0); for (let k = 0; k < 5; k++) o += `<ellipse cx="${f(rx)}" cy="${f(ry - k * 3)}" rx="${f(rs * (0.2 - k * 0.015))}" ry="${f(rs * 0.06)}" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="${f(rx)}" cy="${f(ry - k * 3)}" rx="${f(rs * (0.2 - k * 0.015))}" ry="${f(rs * 0.06)}" fill="none" stroke="#8a7a5a" stroke-width="3"/>`;
  a.raw(o);
});
// near: a crate of turnips, a barrel, a rat trap; a rat at the trap
prop(3.0, () => {
  barrel(-2.95, 3.95);
  I.woodBox(-2.3, -1.8, 0, 0.32, 2.85, 3.2, '#5a4430', { bw: 0.11, knots: 0.4 });
  for (let k = 0; k < 16; k++) { const X = -2.24 + R() * 0.38, [tx, ty] = P(X, 0.3 + (k > 9 ? 0.06 : 0), 3.0 + R() * 0.15), s = K(3.0), rr = s * (0.04 + R() * 0.025); a.shape({ d: blob(tx, ty - rr * 0.6, rr, R, 8, 0.18), fill: R() < 0.5 ? '#c8b0a0' : mix('#9a6a8a', '#6a3a5a', R()), depth: rr * 0.5, ink: 1.3, hatch: 60, grime: 0.3, after: `<path d="M${f(tx)} ${f(ty - rr * 1.5)} l${f(-2 - R() * 3)} ${f(-6 - R() * 6)} m${f(3)} ${f(8)} l${f(3 + R() * 3)} ${f(-7 - R() * 5)}" stroke="#4a5a2a" stroke-width="1.8"/>` }); }
});
prop(3.4, () => {
  const [x, y] = P(1.9, 0, 3.4), s = K(3.4);
  a.raw(`<rect x="${f(x - s * 0.12)}" y="${f(y - s * 0.04)}" width="${f(s * 0.24)}" height="${f(s * 0.04)}" fill="${WOOD}" stroke="${INK}" stroke-width="1.6"/><path d="M${f(x - s * 0.1)} ${f(y - s * 0.04)} Q${f(x)} ${f(y - s * 0.14)} ${f(x + s * 0.1)} ${f(y - s * 0.04)}" stroke="${G.iron}" stroke-width="2.4" fill="none"/>`);
  if (DETAIL) a.shape({ d: smooth([[x + s * 0.16, y], [x + s * 0.2, y - s * 0.06], [x + s * 0.28, y - s * 0.07], [x + s * 0.34, y - s * 0.03], [x + s * 0.33, y]], true, 0.5), fill: '#3a3230', depth: 3, ink: 1.4, hatch: 60, after: `<path d="M${f(x + s * 0.33)} ${f(y - s * 0.01)} q${f(s * 0.1)} ${f(-s * 0.02)} ${f(s * 0.16)} ${f(s * 0.02)}" stroke="#7a5a5a" stroke-width="1.6" fill="none"/><circle cx="${f(x + s * 0.19)}" cy="${f(y - s * 0.045)}" r="1.4" fill="#e8d8c0"/>` });
});

prop(5.4, () => { const [lx, ly] = P(-3.6, 1.8, 5.4), ls = K(5.4) * 0.1; a.raw(I.seg3([-3.6, I.Yv(-3.6) - 0.02, 5.4], [-3.6, 1.88, 5.4], INK, 1.3) + lantern(lx, ly, ls)); addLight(-3.6, 1.7, 5.2, 0.6, 4.0, [1.0, 0.72, 0.42]); });
I.write(KEEPER);
